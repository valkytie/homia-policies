import { readFile, writeFile, readdir, mkdir, mkdtemp, cp, rename, rm, lstat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';

const policies = ['privacy-policy', 'support-and-data-deletion', 'terms-of-service', 'report-a-bug'];

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function normalizeUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('Site URL must be HTTPS, without credentials, query or fragment.');
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}

async function validateAssets(directory) {
  const info = await lstat(directory);
  if (info.isSymbolicLink()) throw new Error('Public assets must not contain a symbolic link.');
  if (!info.isDirectory()) return;
  for (const entry of await readdir(directory)) {
    if (entry.startsWith('.')) throw new Error('Hidden files are not public website assets.');
    await validateAssets(path.join(directory, entry));
  }
}

function renderMarkdown(markdown) {
  const seen = new Map();
  return marked.parse(markdown, { gfm: true, breaks: false }).replace(
    /<h([1-6])>([\s\S]*?)<\/h\1>/g,
    (_, level, content) => {
      const base = content.replace(/<[^>]*>/g, '').toLowerCase()
        .replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-');
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count ? `${base}-${count}` : base;
      return `<h${level} id="${escapeHtml(id)}">${content}</h${level}>`;
    }
  );
}

function documentPage({ title, content, canonical }) {
  const canonicalTag = canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : '<meta name="robots" content="noindex">';
  return `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#fbf8f0">
  <title>${escapeHtml(title)}｜嚮家 Homia</title>
  ${canonicalTag}
  <link rel="icon" href="/assets/favicon.png" type="image/png">
  <link rel="stylesheet" href="/assets/site.css">
  <style>
    .policy-header { padding-block: 22px; border-bottom: 1px solid var(--line); }
    .policy-header a, .policy-footer a { display: inline-flex; align-items: center; min-height: 44px; }
    .policy-page { max-width: 850px; }
    .policy-content { padding-block: 48px 64px; overflow-wrap: anywhere; }
    .policy-content h1 { font-size: clamp(1.7rem, 4vw, 2.4rem); line-height: 1.6; margin-bottom: 24px; }
    .policy-content h2 { font-size: 1.5rem; margin-block: 40px 18px; }
    .policy-content h3 { font-size: 1.15rem; margin-block: 26px 12px; }
    .policy-content p, .policy-content ol, .policy-content ul { margin-block: 14px; }
    .policy-content li + li { margin-top: 14px; }
    .policy-content code { font-size: .9em; overflow-wrap: anywhere; }
    .policy-footer { padding-block: 24px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 8px 24px; font-size: .85rem; }
  </style>
</head>
<body>
  <a class="skip-link" href="#main">跳到主要內容</a>
  <header class="policy-header"><div class="wrap"><a href="/">嚮家 Homia · 返回官網首頁</a></div></header>
  <main class="wrap policy-page" id="main"><article class="policy-content">${content}</article></main>
  <footer class="wrap policy-footer" aria-label="客服與政策">
    <a href="/privacy-policy.html">隱私權政策</a>
    <a href="/terms-of-service.html">服務條款</a>
    <a href="/support-and-data-deletion.html">客服與資料刪除</a>
    <a href="/report-a-bug.html">問題回報</a>
  </footer>
</body>
</html>
`;
}

export async function buildSite({ root = process.cwd(), siteUrl, output = path.join(root, 'dist') } = {}) {
  const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
  const url = normalizeUrl(siteUrl ?? config.url);
  const homepage = await readFile(path.join(root, 'index.html'), 'utf8');
  const documents = await Promise.all(policies.map(async name => ({
    name, markdown: await readFile(path.join(root, `${name}.md`), 'utf8')
  })));
  await validateAssets(path.join(root, 'assets'));

  const replacements = [
    [/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeHtml(url)}">`],
    [/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeHtml(url)}">`],
    [/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(new URL('assets/homia-icon.png', url).href)}">`]
  ];
  let builtHomepage = homepage;
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(builtHomepage)) throw new Error('Homepage is missing required social metadata.');
    builtHomepage = builtHomepage.replace(pattern, replacement);
  }

  await mkdir(path.dirname(output), { recursive: true });
  const staging = await mkdtemp(path.join(path.dirname(output), '.homia-build-'));
  const backup = `${staging}-previous`;
  let hadPrevious = false;
  try {
    await writeFile(path.join(staging, 'index.html'), builtHomepage);
    await cp(path.join(root, 'assets'), path.join(staging, 'assets'), { recursive: true });
    for (const { name, markdown } of documents) {
      const title = markdown.match(/^#\s+(.+)$/m)?.[1];
      if (!title) throw new Error(`${name}.md is missing its page title.`);
      await writeFile(path.join(staging, `${name}.html`), documentPage({
        title, content: renderMarkdown(markdown), canonical: new URL(name, url).href
      }));
    }
    await writeFile(path.join(staging, '404.html'), documentPage({
      title: '找不到這個頁面',
      content: '<h1>找不到這個頁面</h1><p>連結可能已更新，請回到嚮家官網首頁，或使用下方客服與政策入口。</p><p><a href="/">返回官網首頁</a></p>'
    }));
    try { await rename(output, backup); hadPrevious = true; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { await rename(staging, output); }
    catch (error) { if (hadPrevious) await rename(backup, output); throw error; }
    if (hadPrevious) await rm(backup, { recursive: true, force: true });
    return { output, siteUrl: url, pages: 6 };
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== '--site-url')) {
      throw new Error('Usage: node tools/build-site.mjs [--site-url https://your-site/]');
    }
    const result = await buildSite({ siteUrl: args[1] });
    process.stdout.write(`Built ${result.pages} pages for ${result.siteUrl}\n`);
  } catch (error) {
    process.stderr.write(`Website build failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
