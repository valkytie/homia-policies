import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, readFile, readdir, writeFile, rm, symlink, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const builder = path.join(project, 'tools/build-site.mjs');
const policies = ['privacy-policy', 'support-and-data-deletion', 'terms-of-service', 'report-a-bug'];
const siteUrl = 'https://homia-build-test.example/';
const textContent = html => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'homia-site-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const file of ['index.html', 'assets', ...policies.map(name => `${name}.md`)]) {
    await cp(path.join(project, file), path.join(root, file), { recursive: true });
  }
  await writeFile(path.join(root, 'site.config.json'), JSON.stringify({ url: siteUrl }));
  return root;
}

function build(root, args = []) {
  return spawnSync(process.execPath, [builder, ...args], { cwd: root, encoding: 'utf8' });
}

function assertSameBody(before, after) {
  const extract = html => {
    const match = html.match(/<body\b[^>]*>[\s\S]*<\/body\s*>/i);
    assert.ok(match, 'Expected a complete body element before comparing content.');
    return match[0];
  };
  assert.equal(extract(after), extract(before));
}

test('body preservation detects changed content when body has attributes', () => {
  assert.throws(() => assertSameBody(
    '<body class="home"><main>approved story</main></body>\n',
    '<body class="home"><main>changed story</main></body>\n'
  ), assert.AssertionError);
});

test('body preservation refuses documents without a complete body', () => {
  assert.throws(() => assertSameBody('<main>no body</main>\n', '<main>no body</main>\n'), /body/);
});

test('keeps the approved founder story, Watch explanation, FAQ answers and policy sources', async () => {
  const approved = JSON.parse(await readFile(path.join(project, 'test/fixtures/approved-content.json'), 'utf8'));
  const html = await readFile(path.join(project, 'index.html'), 'utf8');
  const story = html.match(/<section\b[^>]*id="story"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(story, 'Founder story must remain present.');
  const paragraphs = [...story.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m => textContent(m[1]));
  assert.deepEqual(paragraphs.filter(p => approved.story.includes(p)), approved.story);
  const faq = html.match(/<section\b[^>]*id="faq"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(faq, 'FAQ section must remain present.');
  const details = [...faq.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)];
  assert.equal(details.length, Object.keys(approved.faq).length);
  for (const [, detail] of details) {
    const question = textContent(detail.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)[1]);
    const answer = textContent(detail.match(/<div[^>]*>([\s\S]*?)<\/div>/)[1]);
    assert.equal(sha256(answer), approved.faq[question], question);
  }
  const allParagraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m => textContent(m[1]));
  for (const paragraph of approved.watch) assert.ok(allParagraphs.includes(paragraph), paragraph);
  for (const [file, hash] of Object.entries(approved.policies)) {
    assert.equal(sha256(await readFile(path.join(project, file))), hash, file);
  }
});

test('every local homepage and CSS asset exists and no third-party runtime assets are requested', async () => {
  const html = await readFile(path.join(project, 'index.html'), 'utf8');
  const css = await readFile(path.join(project, 'assets/site.css'), 'utf8');
  for (const [, ref] of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) await access(path.join(project, ref));
  for (const [, , ref] of css.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
    assert.ok(!/^(?:https?:)?\/\//i.test(ref), ref);
    await access(path.join(project, 'assets', ref));
  }
  assert.ok(!/@import\b/.test(css), 'Stylesheets must be local.');
  assert.ok(!/<iframe\b/i.test(html));
  for (const [, tag, attributes] of html.matchAll(/<(img|script|link|source)\b([^>]*)>/gi)) {
    if (tag.toLowerCase() === 'link' && /rel="canonical"/.test(attributes)) continue;
    for (const [, ref] of attributes.matchAll(/(?:src|href)="([^"]+)"/g)) {
      assert.ok(!/^(?:https?:)?\/\//i.test(ref), ref);
    }
  }
});

test('the pinned font subset covers all homepage serif text and policy pages do not preload it', async t => {
  const manifest = JSON.parse(await readFile(path.join(project, 'tools/font-manifest.json'), 'utf8'));
  const font = await readFile(path.join(project, 'assets/fonts/noto-serif-tc-500.woff2'));
  assert.equal(font.subarray(0, 4).toString(), 'wOF2');
  assert.ok(font.length <= 180 * 1024);
  assert.equal(sha256(font), manifest.sha256);
  const html = await readFile(path.join(project, 'index.html'), 'utf8');
  const text = [...html.matchAll(/<(h[1-3]|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => textContent(m[2])).join('') +
    [...html.matchAll(/<(p|footer)\b[^>]*class="letter-(?:meta|signature)"[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => textContent(m[2])).join('');
  const available = new Set(manifest.codepoints);
  for (const character of text) assert.ok(available.has(character.codePointAt(0)), `Missing font character: ${character}`);
  const root = await fixture(t);
  assert.equal(build(root).status, 0);
  for (const name of policies) {
    const policy = await readFile(path.join(root, `dist/${name}.html`), 'utf8');
    assert.ok(!/<link\b[^>]*as="font"/.test(policy));
    assert.ok(!/<body\b[^>]*class="home"/.test(policy));
  }
});

async function files(root, prefix = '') {
  const result = [];
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(root, name));
    else result.push(name);
  }
  return result.sort();
}

test('builds the complete site with new metadata and preserves the homepage body', async t => {
  const root = await fixture(t);
  const result = build(root);
  assert.equal(result.status, 0, result.stderr);
  const before = await readFile(path.join(root, 'index.html'), 'utf8');
  const after = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  assertSameBody(before, after);
  assert.ok(after.includes(`<link rel="canonical" href="${siteUrl}">`));
  assert.ok(after.includes(`content="${siteUrl}assets/homia-icon.png"`));
  for (const name of policies) {
    const html = await readFile(path.join(root, `dist/${name}.html`), 'utf8');
    assert.ok(html.includes('<article class="policy-content">'), name);
    assert.ok(html.includes('<h1'), name);
    assert.ok(html.includes('valkytie@gmail.com'), name);
    assert.ok(html.includes(`<link rel="canonical" href="${siteUrl}${name}">`), name);
  }
  const privacy = await readFile(path.join(root, 'dist/privacy-policy.html'), 'utf8');
  assert.ok(privacy.includes('id="english"'));
  assert.ok(privacy.includes('Firebase family sync, ZIP backup'));
  assert.ok(privacy.includes('嚮家不會把「登入」本身當作上傳未配對本機紀錄的授權'));
  const report = await readFile(path.join(root, 'dist/report-a-bug.html'), 'utf8');
  assert.ok(report.includes('https://docs.google.com/forms/d/e/'));
  assert.ok(report.includes('support-and-data-deletion.html'));
  assert.ok((await readFile(path.join(root, 'dist/404.html'), 'utf8')).includes('找不到這個頁面'));
});

test('publishes only explicit website assets and keeps policy sources unchanged', async t => {
  const root = await fixture(t);
  const snapshots = await Promise.all(policies.map(name => readFile(path.join(root, `${name}.md`))));
  await writeFile(path.join(root, '.env'), 'PRIVATE_TEST_VALUE=must-not-be-published');
  await writeFile(path.join(root, 'wrangler.jsonc'), '{"test":"configuration-only"}');
  await mkdir(path.join(root, 'node_modules'));
  await writeFile(path.join(root, 'node_modules/private.txt'), 'must-not-be-published');
  assert.equal(build(root).status, 0);
  const actual = await files(path.join(root, 'dist'));
  const expected = ['index.html', '404.html', ...policies.map(name => `${name}.html`),
    ...(await files(path.join(root, 'assets'))).map(name => `assets/${name}`)].sort();
  assert.deepEqual(actual, expected);
  for (const [index, name] of policies.entries()) {
    assert.deepEqual(await readFile(path.join(root, `${name}.md`)), snapshots[index]);
  }
});

test('missing policy fails before replacing the previously built site', async t => {
  const root = await fixture(t);
  await mkdir(path.join(root, 'dist'));
  await writeFile(path.join(root, 'dist/index.html'), 'previous-good-build');
  await rm(path.join(root, 'privacy-policy.md'));
  const result = build(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /privacy-policy/);
  assert.equal(await readFile(path.join(root, 'dist/index.html'), 'utf8'), 'previous-good-build');
});

test('rejects a non-HTTPS site URL before writing output', async t => {
  const root = await fixture(t);
  const result = build(root, ['--site-url', 'http://homia-build-test.example/']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /HTTPS/);
  await assert.rejects(readFile(path.join(root, 'dist/index.html')), { code: 'ENOENT' });
});

test('rejects symbolic links in the public assets directory', async t => {
  const root = await fixture(t);
  await writeFile(path.join(root, '.env'), 'PRIVATE_TEST_VALUE');
  await symlink(path.join(root, '.env'), path.join(root, 'assets/leaked.txt'));
  const result = build(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symbolic link/);
});

test('rebuilding unchanged inputs produces identical files', async t => {
  const root = await fixture(t);
  assert.equal(build(root).status, 0);
  const list = await files(path.join(root, 'dist'));
  const snapshot = await Promise.all(list.map(name => readFile(path.join(root, 'dist', name))));
  assert.equal(build(root).status, 0);
  for (const [index, name] of list.entries()) {
    assert.deepEqual(await readFile(path.join(root, 'dist', name)), snapshot[index], name);
  }
});

test('legacy homepage redirects to the official site, preserves anchors and leaves policy routes alone', async () => {
  const homepage = await readFile(path.join(project, 'index.html'), 'utf8');
  const script = homepage.match(/<script id="legacy-home-redirect">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'Legacy GitHub homepage must guide visitors to the new official site.');
  for (const pathname of ['/homia-policies/', '/homia-policies/index.html']) {
    const destinations = [];
    runInNewContext(script, { location: {
      hostname: 'valkytie.github.io', pathname, search: '?from=old', hash: '#android',
      replace: url => destinations.push(url)
    }});
    assert.deepEqual(destinations, ['https://homia-official-site.valkytie.workers.dev/?from=old#android']);
  }
  for (const [hostname, pathname] of [
    ['homia-official-site.valkytie.workers.dev', '/'],
    ['valkytie.github.io', '/homia-policies/privacy-policy.html'],
    ['valkytie.github.io', '/another-project/'],
    ['example.com', '/homia-policies/']
  ]) {
    runInNewContext(script, { location: {
      hostname, pathname, search: '', hash: '',
      replace: () => assert.fail(`Unexpected redirect from ${hostname}${pathname}`)
    }});
  }
  assert.ok(homepage.includes('href="https://homia-official-site.valkytie.workers.dev/">嚮家官網'));
});
