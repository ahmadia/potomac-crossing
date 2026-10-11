/* The visual-check tools that can run without Safari or Quick Look: node --test */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SHOTS = path.join(ROOT, 'tools/shots.mjs');

test('shots.mjs: on a locked screen each shot gets a fresh short session; LOCKED overrides the check (no Safari needed)', () => {
  const run = (env) => spawnSync(process.execPath, [SHOTS, '--lock'], { encoding: 'utf8', env: Object.assign({}, process.env, env) });
  const on = run({ LOCKED: '1' }), off = run({ LOCKED: '0' }), ask = run({ LOCKED: '' });
  assert.equal(on.status, 0, on.stderr);
  assert.match(on.stdout, /^locked: a fresh short session for each shot/);
  assert.match(off.stdout, /^unlocked: one session for every shot/);
  assert.equal(ask.status, 0, ask.stderr);
  assert.match(ask.stdout, /^(locked|unlocked): /, 'reads the lock from the window server, or says unlocked when it cannot');
});

test('shots.mjs: STORY=fixture3 stands the fixture chapter 3 in (chapter 3’s screens before its story is written); STORY=fixture keeps chapter 2’s', () => {
  const run = (story) => spawnSync(process.execPath, [SHOTS, '--lock'], { encoding: 'utf8', env: Object.assign({}, process.env, { LOCKED: '1', STORY: story }) });
  assert.match(run('fixture3').stdout, /stories from tests\/fixtures\/chapters\.js: ch03$/m);
  assert.match(run('fixture').stdout, /stories from tests\/fixtures\/chapters\.js: ch02$/m);
  assert.match(run('fixture,fixture3').stdout, /: ch02, ch03$/m);
  assert.doesNotMatch(run('').stdout, /stories from/);
});

test('shots.mjs: STORY=fixture4 stands the fixture chapter 4 in (her Case File and the pages she taps, before chapter 4’s story is written)', () => {
  const run = (story) => spawnSync(process.execPath, [SHOTS, '--lock'], { encoding: 'utf8', env: Object.assign({}, process.env, { LOCKED: '1', STORY: story }) });
  assert.match(run('fixture4').stdout, /stories from tests\/fixtures\/chapters\.js: ch04$/m);
  assert.match(run('fixture3,fixture4').stdout, /: ch03, ch04$/m);
  assert.match(run('fixture,fixture3,fixture4').stdout, /: ch02, ch03, ch04$/m);
});

test('shots.mjs: the fixture chapter 4 it stands in is sound, and has every screen the tool is asked for (a row of bark, the glint, the file frame, a card frame)', () => {
  const { load } = require('./_load.js');
  const E = load().engine, fx = require('./fixtures/chapters.js')().ch04;
  const kinds = Object.values(fx.frames).map(f => E.kindOf(f) + (f.scratch ? ':' + E.tapWords(f).kind : '') + (f.card ? '+card' : ''));
  for (const want of ['scratch:cards', 'scratch:draws', 'scratch:tap', 'file', 'next+card', 'skip', 'counts', 'choice']) assert.ok(kinds.includes(want), want);
  // the tool's source knows the new targets (the Case File open, a tap on the page's tap picture, cards for the test cat)
  const src = require('node:fs').readFileSync(SHOTS, 'utf8');
  for (const want of ['PC.debug.file(', 'PC.debug.tap()', 'E.giveCard(c, id', "target === 'file'"]) assert.ok(src.includes(want), want);
});

test('shots.mjs --blank: a screenshot that is one flat colour but for a sliver is blank (never kept as a picture); a real page is not (no Safari needed)', () => {
  const fs = require('node:fs'), os = require('node:os'), zlib = require('node:zlib');
  // a small PNG writer: 8-bit RGBA, each row filtered `filter` (0 none, 1 sub, 2 up), from a pixel function
  const png = (W, H, at, filter) => {
    const chunk = (type, data) => { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(type, 4, 'latin1'); data.copy(b, 8); b.writeUInt32BE(zlib.crc32(b.subarray(4, 8 + data.length)) >>> 0, 8 + data.length); return b; };
    const head = Buffer.alloc(13); head.writeUInt32BE(W, 0); head.writeUInt32BE(H, 4); head[8] = 8; head[9] = 6;
    const px = Buffer.alloc(W * H * 4), raw = Buffer.alloc((W * 4 + 1) * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px.set(at(x, y), (y * W + x) * 4);
    for (let y = 0; y < H; y++) {
      raw[y * (W * 4 + 1)] = filter;
      for (let i = 0; i < W * 4; i++) {
        const v = px[y * W * 4 + i], a = i >= 4 ? px[y * W * 4 + i - 4] : 0, b = y ? px[(y - 1) * W * 4 + i] : 0;
        raw[y * (W * 4 + 1) + 1 + i] = (v - (filter === 1 ? a : filter === 2 ? b : 0)) & 255;
      }
    }
    return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', head), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
  };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-blank-'));
  const BLACK = [0, 0, 0, 255], WHITE = [255, 255, 255, 255], GREY = [128, 128, 128, 255];
  const files = {
    // the mini's black sheet: black, with a line of small print along the bottom edge (about 3 pixels in 10,000)
    'black-sheet.png': [png(400, 300, (x, y) => (y > 290 && x % 37 === 0 ? WHITE : BLACK), 1), 'blank'],
    'grey.png': [png(400, 300, () => GREY, 2), 'blank'],
    'nearly-flat.png': [png(400, 300, (x, y) => [1 + (x % 2), 2, 0, 255], 0), 'blank'],
    // a real page: a dark ground, a panel, a balloon; and a page that is mostly one colour (9 in 10) is still a picture
    'page.png': [png(400, 300, (x, y) => (x > 40 && x < 360 && y > 30 && y < 220 ? [(x * 3) & 255, (y * 2) & 255, 90, 255] : [27, 22, 34, 255]), 1), 'ok'],
    'mostly-dark.png': [png(400, 300, (x, y) => (y < 30 ? WHITE : BLACK), 2), 'ok'],
    'not-a-png.png': [Buffer.from('<html>no</html>'), 'blank']
  };
  try {
    const names = Object.keys(files);
    names.forEach(n => fs.writeFileSync(path.join(dir, n), files[n][0]));
    const all = spawnSync(process.execPath, [SHOTS, '--blank'].concat(names.map(n => path.join(dir, n)), [path.join(dir, 'missing.png')]), { encoding: 'utf8' });
    const said = all.stdout.trim().split('\n').map(l => l.split(': ')[0]);
    assert.deepEqual(said, names.map(n => files[n][1]).concat(['blank']), all.stdout + all.stderr);
    assert.equal(all.status, 1, 'exit 1 when any is blank');
    const good = spawnSync(process.execPath, [SHOTS, '--blank', path.join(dir, 'page.png')], { encoding: 'utf8' });
    assert.deepEqual([good.status, good.stdout.trim()], [0, 'ok: ' + path.join(dir, 'page.png')]);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  // the tool reads every screenshot before it keeps it, takes a blank one again in a fresh session, falls back from
  // a sheet to its pages, and names what never painted
  const src = fs.readFileSync(SHOTS, 'utf8');
  assert.equal((src.match(/if \(blankPng\(png\)\) return 'blank';/g) || []).length, 2, 'a sheet and a single page');
  assert.match(src, /still blank; taking its pages one by one/);
  assert.match(src, /console\.error\('blank: ' \+ t \+ ' \(no picture after ' \+ TRIES \+ ' tries; nothing was written\)'\)/);
  assert.match(src, /if \(lost\.length\) process\.exitCode = 1;/);
});

test('shots.mjs: EXTRA never reads the save back from a storage that may have lost it: the page’s own save, and a stand-in that lasts the reload', () => {
  const src = require('node:fs').readFileSync(SHOTS, 'utf8');
  assert.match(src, /var raw = PC\.debug\.state\(\);/);
  assert.ok(!/JSON\.parse\(localStorage\.getItem\(E\.STORAGE_KEY\)\)/.test(src), 'not what storage hands back');
  assert.match(src, /if \(EXTRA && [^\n]*index\\\.html[^\n]*\) body = Buffer\.from\(String\(body\)\.replace\('<head>', '<head>' \+ LS_SHIM\)\);/, 'only the page as the tool serves it, and only for EXTRA');
  assert.match(src, /EXTRA: the page read ' \+ there \+ ' cats back after the reload/);
  // the stand-in is a working Storage over sessionStorage
  const shim = /const LS_SHIM = `<script>([\s\S]*?)<\/script>`;/.exec(src)[1];
  const mem = {}, session = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; }, key: i => Object.keys(mem)[i] || null };
  Object.defineProperty(session, 'length', { get: () => Object.keys(mem).length });
  const win = {};
  new Function('window', 'sessionStorage', shim)(win, session);
  const ls = win.localStorage;
  session.setItem('other', 'x');
  ls.setItem('potomac-crossing.v1', '{"cats":[1,2]}'); ls.setItem('n', 5);
  assert.deepEqual([ls.getItem('potomac-crossing.v1'), ls.getItem('n'), ls.getItem('nope'), ls.length, ls.key(0)], ['{"cats":[1,2]}', '5', null, 2, 'potomac-crossing.v1']);
  ls.removeItem('n'); assert.equal(ls.length, 1);
  ls.clear(); assert.deepEqual([ls.length, session.getItem('other')], [0, 'x'], 'clear leaves what is not the page’s');
});
