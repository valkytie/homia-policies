import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, readFile, readdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const builder = path.join(project, 'tools/build-site.mjs');
const policies = ['privacy-policy', 'support-and-data-deletion', 'terms-of-service', 'report-a-bug'];
const siteUrl = 'https://homia-build-test.example/';

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
  assert.equal(after.slice(after.indexOf('<body>')), before.slice(before.indexOf('<body>')));
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
