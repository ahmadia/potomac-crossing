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

test('shots.mjs: STORY=fixture5 stands the fixture chapter 5 in (the river’s screens before chapter 5’s story is written), alone or with the others', () => {
  const run = (story) => spawnSync(process.execPath, [SHOTS, '--lock'], { encoding: 'utf8', env: Object.assign({}, process.env, { LOCKED: '1', STORY: story }) });
  assert.match(run('fixture5').stdout, /stories from tests\/fixtures\/chapters\.js: ch05$/m);
  assert.match(run('fixture4,fixture5').stdout, /: ch04, ch05$/m);
  assert.match(run('fixture,fixture3,fixture4,fixture5').stdout, /: ch02, ch03, ch04, ch05$/m);
  assert.doesNotMatch(run('fixture6').stdout, /stories from/, 'no such fixture: the real chapters');
});

test('shots.mjs: the fixture chapter 5 it stands in is sound beside the real chapters 1 to 4, and has every screen the tool is asked for (a thing she taps, the questions she taps out, the tuck, her paws aboard, the claws in the log, the mud count, the nines, the cards that touch)', () => {
  const { load } = require('./_load.js');
  const PC = load(), E = PC.engine, fx = require('./fixtures/chapters.js')().ch05;
  const real = ['ch01', 'ch02', 'ch03', 'ch04'].map(k => PC.story[k]);
  assert.deepEqual(E.checkStory(fx, real.concat([fx])), []);
  const kinds = Object.values(fx.frames).map(f => E.kindOf(f) + (f.scratch ? ':' + E.tapWords(f).kind + (f.scratch.miss ? '+miss' : '') : '') +
    (f.skip ? ':' + (f.skip.tuck ? 'tuck' : f.skip.paws || 'cats') : '') + (f.card ? '+card' : ''));
  for (const want of ['scratch:tap+miss', 'scratch:tap+miss+card', 'ask', 'skip:tuck', 'skip:board', 'skip:log', 'skip:mud', 'skip:both', 'skip:cats', 'counts', 'choice', 'input', 'next+card', 'end']) assert.ok(kinds.includes(want), want + ' in ' + Array.from(new Set(kinds)).join(' '));
  // a Count for each picture the river brings, and the cards that touch other cards
  for (const want of ['ch05-pile', 'ch05-tens', 'ch05-nines', 'ch05-otter', 'ch05-bill', 'ch05-catch', 'ch05-puddle', 'ch05-wisp']) assert.ok(fx.counts[want], want);
  assert.ok(Object.values(fx.cards).filter(c => c.link && c.link.with).length >= 4);
  assert.equal(fx.book.dragonet.length, 2);
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

test('shots.mjs is silent by construction: every page it serves has speech and audio switched off before the game’s first script; Read to me stays off, a tap on its button is refused before Safari starts, and READ=1 switches it on in a page that still says nothing (no Safari needed)', async () => {
  const fs = require('node:fs'), vm = require('node:vm');
  const src = fs.readFileSync(SHOTS, 'utf8');
  const run = (args, env) => spawnSync(process.execPath, [SHOTS].concat(args), { encoding: 'utf8', env: Object.assign({}, process.env, { LOCKED: '1', READ: '' }, env || {}) });

  // 1. the page as served: the silencing script is the first thing in its head, before every script of the game
  const page = run(['--page']);
  assert.equal(page.status, 0, page.stderr);
  const html = page.stdout, index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const head = html.indexOf('<head>') + '<head>'.length;
  assert.ok(html.startsWith('<script>(function(w){var said=w.__shotsSaid=[];', head), 'first in the head');
  const end = html.indexOf('</script>', head) + '</script>'.length, shim = html.slice(head + '<script>'.length, end - '</script>'.length);
  assert.equal(html.slice(0, head) + html.slice(end), index, 'the game’s own page, and nothing else added');
  assert.ok(/<script\b[^>]*\bsrc=/.test(html.slice(end)) && !/<script\b/.test(html.slice(0, head)), 'every script of the game comes after it');
  // the server puts it in every HTML file it serves, and a page with no <head> gets it at its very top
  assert.match(src, /if \(extname\(file\) === '\.html'\) body = Buffer\.from\(silenced\(String\(body\)\)\);/);
  const silenced = new Function('SILENT', 'return ' + /function silenced\(html\) \{[\s\S]*?\n\}/.exec(src)[0])('<S>');
  assert.deepEqual([silenced('<html><head><title>x</title></head></html>'), silenced('<html><HEAD lang="en"><b>'), silenced('<p>bare</p>')],
    ['<html><head><S><title>x</title></head></html>', '<html><HEAD lang="en"><S><b>', '<S><p>bare</p>']);

  // 2. the stand-in, run in a page that has a real synthesizer: nothing reaches it, by any name
  const calls = [];
  class SpeechSynthesis { speak(u) { calls.push('speak ' + (u && u.text)); } cancel() { calls.push('cancel'); } pause() { calls.push('pause'); } resume() { calls.push('resume'); } getVoices() { return [{ name: 'Samantha', lang: 'en-US' }]; } }
  class HTMLMediaElement { play() { calls.push('play'); return Promise.resolve(); } pause() { calls.push('media pause'); } }
  const real = new SpeechSynthesis(), listeners = {};
  const win = { SpeechSynthesis, HTMLMediaElement, AudioContext: function () { calls.push('AudioContext'); }, webkitAudioContext: function () { calls.push('webkitAudioContext'); },
    Audio: function () { calls.push('Audio'); }, document: { createElement: () => new HTMLMediaElement() }, addEventListener: (k, fn) => { listeners[k] = fn; }, setTimeout, Promise };
  Object.defineProperty(win, 'speechSynthesis', { configurable: true, get: () => real });
  win.window = win;
  vm.runInNewContext(shim, win);
  assert.equal(win.__shotsSilent, true);
  const synth = win.speechSynthesis;
  assert.notEqual(synth, real, 'the page’s synthesizer is the stand-in');
  assert.ok('speechSynthesis' in win, 'still there for the page to find: the Read to me button shows as on an iPad');
  // as app/ui.js speaks: cancel, an utterance for each line, speak, and the last one's end
  const said = [];
  const done = new Promise((resolve) => {
    synth.cancel();
    ['Hello, Moonpaw.', 'Nine. Eighteen.'].forEach((t, i) => {
      const u = new win.SpeechSynthesisUtterance(t);
      u.rate = 0.95; u.pitch = 1.1; u.lang = 'en-US';
      synth.speak(u);
      said.push(u);
      if (i === 1) u.onend = resolve;
    });
  });
  await done;   // a page that waits for the end of a line goes on
  assert.deepEqual(Array.from(win.__shotsSaid), ['Hello, Moonpaw.', 'Nine. Eighteen.'], 'what would have been read is noted');
  assert.deepEqual(Array.from(synth.getVoices()), []);
  synth.pause(); synth.resume(); synth.cancel();
  // …and the real one is mute by every route a page has to it
  real.speak({ text: 'direct' }); real.cancel(); real.pause(); real.resume();
  SpeechSynthesis.prototype.speak.call(real, { text: 'by the prototype' });
  new SpeechSynthesis().speak({ text: 'a new one' });
  try { win.speechSynthesis = real; } catch (e) { /* strict pages throw; either way it does not come back */ }
  assert.equal(win.speechSynthesis, synth, 'the stand-in cannot be put aside');
  win.speechSynthesis.speak({ text: 'after' });
  // media: play() starts nothing, a playing element is stopped, there is no audio context to make
  const el = new HTMLMediaElement();
  await el.play();
  assert.equal(el.muted, true);
  const a2 = new win.Audio('x.mp3'); await a2.play();
  const playing = { muted: false, pause() { calls.push('stopped'); } };
  listeners.play({ target: playing });
  assert.deepEqual([playing.muted, win.AudioContext, win.webkitAudioContext], [true, undefined, undefined]);
  assert.deepEqual(calls, ['stopped'], 'no call ever reached a real synthesizer, a player or an audio context');
  // the game has no other way to make a sound than the ones the stand-in covers
  const game = index + ['app/ui.js', 'app/engine.js'].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  const used = Array.from(new Set(game.match(/\b(speechSynthesis|SpeechSynthesisUtterance|AudioContext|webkitAudioContext|new Audio|HTMLMediaElement)\b|<(audio|video)\b|\.play\(\)/g) || []));
  assert.ok(used.includes('speechSynthesis'), 'Read to me speaks through speechSynthesis');
  used.forEach(u => assert.ok(shim.includes(u.replace(/^new /, '').replace(/^<(audio|video)$/, 'HTMLMediaElement').replace('.play()', 'HTMLMediaElement')), 'the stand-in covers ' + u));

  // 3. Read to me stays off: a tap on its button is refused before any server or Safari is started
  const tap = run([path.join(require('node:os').tmpdir(), 'pc-shots-never'), 'hub', 'ch05:f010@nextBtn@readBtn']);
  assert.deepEqual([tap.status, tap.stdout], [1, '']);
  assert.match(tap.stderr, /^@readBtn: Read to me stays off in this tool/);
  assert.ok(src.indexOf("includes('readBtn')") < src.indexOf('createServer(') && src.indexOf("includes('readBtn')") < src.indexOf("spawn('safaridriver'"), 'refused before the server and the driver exist');
  // the tool says which way it runs
  assert.match(run(['--lock']).stdout, /^silent: speech and audio are switched off in every page before the game boots; Read to me is off$/m);
  assert.match(run(['--lock'], { READ: '1' }).stdout, /Read to me is on \(READ=1\), and still says nothing$/m);
  assert.match(run(['--lock'], { READ: 'yes' }).stdout, /Read to me is off$/m, 'only READ=1 opts in');

  // 4. the check every page gets once its test cat is set up (and every pane of a sheet, and the page after EXTRA's reload)
  const QUIET = /const QUIET = `([\s\S]*?)`;/.exec(src)[1];
  const pageWith = (readAloud, o) => {
    const st = { settings: { readAloud } }, w = Object.assign({ __shotsSilent: true, __shotsSaid: [] }, o || {});
    const btn = { clicks: 0, click() { this.clicks++; st.settings.readAloud = !st.settings.readAloud; } };
    // (run as the tool runs it: its `arguments[0]` is the caller's READ)
    const res = new Function('window', 'document', 'PC', 'want', 'return (function () { ' + QUIET + ' }).call(null, want);');
    return (want) => [res.call(null, w, { getElementById: (id) => (id === 'readBtn' ? (o && o.noBtn ? null : btn) : null) }, { debug: { state: () => JSON.parse(JSON.stringify(st)) } }, want), st.settings.readAloud, btn.clicks];
  };
  assert.deepEqual(pageWith(false)(), [true, false, 0], 'off, as a new device is: nothing to do');
  assert.deepEqual(pageWith(true)(), [true, false, 1], 'a save that had it on: switched off');
  assert.deepEqual(pageWith(false)(true), [true, true, 1], 'READ=1: on');
  assert.deepEqual(pageWith(true)(true), [true, true, 0]);
  assert.equal(pageWith(false, { __shotsSilent: undefined })()[0], 'this page was not silenced before the game booted');
  assert.equal(pageWith(true, { noBtn: true })()[0], 'Read to me is on and would not change');
  // QUIET's own `arguments[0]` is the caller's READ: the page's setup hands it on, in a single page, in a pane, after a reload
  assert.match(src, /return \(function \(\) \{ ` \+ QUIET \+ ` \}\)\.call\(null, arguments\[2\]\);`;/);
  assert.match(src, /await run\(SETUP, \[CAT, FIXTURE, READ\]\)/);
  assert.match(src, /new w\.Function\(setup\)\.apply\(null, \[cat, fixture, read\]\)/);
  assert.match(src, /const quiet = await run\(QUIET, \[READ\]\);/);
  // and the tool itself runs nothing that sounds
  // (the only programs it starts are Safari's driver and the lock check: no `say`, no `afplay`, no volume)
  const started = Array.from(src.matchAll(/\b(?:spawn|spawnSync|exec|execSync|execFile|execFileSync)\(\s*(['"`])([^'"`]*)\1/g), m => m[2]);
  assert.deepEqual(started.sort(), ['ioreg', 'safaridriver']);
  assert.doesNotMatch(src, /\\x07|\\u0007|\\a\b/, 'no bell');
});

test('shots.mjs DRY=1 prints what Read to me would say on each screen from the page’s own list, with Read to me off: PC.debug.speech hands the lines over and says nothing (no Safari needed)', () => {
  const fs = require('node:fs');
  const src = fs.readFileSync(SHOTS, 'utf8'), ui = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
  // the page: the list it keeps for Read to me, as text; the hook reads no setting and calls nothing that speaks
  const hook = /\n      speech: function \(\) \{ return ([^\n]*) \},\n/.exec(ui);
  assert.ok(hook, 'PC.debug.speech');
  assert.match(hook[1], /^\(currentSpeech \|\| \[\]\)\.map\(/);
  assert.doesNotMatch(hook[1], /speechSynthesis|speakItems|Utterance|readAloud/);
  // the same words speakItems would hand the synthesizer (emphasis marks off, × said as "times")
  assert.ok(ui.includes("var txt = plain(String(it.text || '').replace(/<[^>]+>/g, ' ')).trim();"), 'speakItems’ own line');
  assert.ok(hook[1].includes("plain(String((it && it.text) || '').replace(/<[^>]+>/g, ' ')).trim()"), 'and the hook’s, the same');
  // the tool: a DRY run prints it for every target, whether or not READ=1 was asked for
  const dry = /if \(DRY\) \{\n    console\.log\(t \+ ': '[^\n]*\n([\s\S]*?)\n    return;\n  \}/.exec(src);
  assert.ok(dry, 'the single-target DRY branch');
  assert.match(dry[1], /const lines = await run\('return PC\.debug && PC\.debug\.speech \? PC\.debug\.speech\(\) : null;'\);\n    if \(lines\) console\.log\(t \+ ' \(Read to me would say; it is off\): ' \+ lines\.join\(' \| '\)\);/);
  assert.ok(dry[1].indexOf('PC.debug.speech') < dry[1].indexOf('if (READ)'), 'before, and not under, the READ=1 line');
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

test('sheet.mjs: a contact sheet’s grid fits Quick Look’s 1600 square, six 16:10 frames a sheet at two columns, and is centred for the crop', async () => {
  const S = await import(require('node:url').pathToFileURL(path.join(__dirname, '..', 'tools', 'sheet.mjs')).href);
  assert.equal(S.SIDE, 1600);
  const L = S.layout(6, 2, 10 / 16);
  assert.deepEqual([L.cols, L.rows, L.cellW, L.cellH, L.width, L.height], [2, 3, 800, 500, 1600, 1500]);
  assert.deepEqual(L.cells[5], { x: 800, y: 1000 });
  assert.equal(S.perSheet(2, 10 / 16), 6);
  assert.equal(S.perSheet(3, 10 / 16), 12);
  assert.equal(S.layout(7, 2, 10 / 16), null, 'a seventh frame does not fit: the tool asks for a second sheet');
  assert.equal(S.layout(0, 2, 10 / 16), null);
  assert.equal(S.layout(1, 2, 10 / 16).cols, 1, 'one picture is not given an empty column');
  // the grid sits in the middle of the square canvas, so sips' centre crop to width x height is the sheet
  const svg = S.sheetSvg([{ name: 'f001', data: 'AAAA' }, { name: 'a<b', data: 'BBBB' }], S.layout(2, 2, 10 / 16));
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="1600" height="1600"/);
  assert.ok(svg.includes('<image x="0" y="550" width="800" height="500"'), 'the first cell, centred top to bottom');
  assert.ok(svg.includes('<image x="800" y="550"'));
  assert.ok(svg.includes('>f001</text>') && svg.includes('>a&lt;b</text>'), 'each picture carries its name, escaped');
});

/* Chapter 6: the storyboard's words for every new name in the spec's art needs
 * (docs/chapters/06-the-snake-in-the-stones.spec.md, section 4), checked before the art lands: the
 * names are added to the art's own vocabulary (`--check-words more.json`). Once the art owners have
 * landed them, the plain run (tests/storyboard.test.js) checks the real vocabulary. */
test('storyboard.mjs --check-words: words for every name chapter 6’s spec adds to the art (cameras, anchors, options, cast, poses, extras, ReedClan’s coats); a name the spec cut or never gave fails', () => {
  const fs = require('node:fs'), os = require('node:os');
  const TOOL = path.join(ROOT, 'tools/storyboard.mjs');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-words-'));
  try {
    const ch06 = {
      sets: {
        title: { cams: ['end', 'meet'], anchors: ['wall-3', 'end-1', 'end-2', 'end-3', 'reed-1', 'reed-2', 'reed-3'], opts: { rustle: [false, true] } },
        sky: { cams: ['walk', 'below'], anchors: ['star-1', 'star-2'], opts: {} },
        bridge: { cams: ['wall'], anchors: ['gap'], opts: { stones: [false, true] } },
        field: { anchors: ['grass'] },
        pile: { opts: { moon: 'number' } }
      },
      cast: ['coil', 'sloshbank', 'reedclan', 'sleet'],
      otherPoses: { coil: ['stone', 'head', 'long', 'longer', 'still', 'listen', 'think', 'slide'], sleet: ['hidden', 'tail', 'flat', 'point', 'call', 'puff', 'droop', 'sit', 'pawup'], riffle: ['puff'], otter: ['puff'] },
      extras: { holds: ['pinecone', 'pebbles', 'string'], holdAt: ['chin', 'paws', 'mouth'], tap: ['pinecone', 'paw', 'stone', 'eyes', 'pebbles', 'cheeks', 'ears'], starry: [true], grass: [true] },
      variants: { reedclan: [1, 2, 3, 4] }
    };
    const run = (x) => { const f = path.join(tmp, 'more.json'); fs.writeFileSync(f, JSON.stringify(x)); return spawnSync(process.execPath, [TOOL, '--check-words', f], { encoding: 'utf8' }); };
    const ok = run(ch06);
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^Every set, camera, anchor, option, pose, mood, effect, cast member and cast extra has words\.$/m);
    // the title's `reeds` camera was cut (spec v0.2): it has no words, and a name nobody gave has none either
    const bad = run({ sets: { title: { cams: ['reeds'] }, bridge: { opts: { hiss: [true] } } }, cast: ['bogwade'], otherPoses: { coil: ['strike'] }, extras: { tap: ['tongue'] }, variants: { reedclan: [5] } });
    assert.equal(bad.status, 1);
    assert.deepEqual(bad.stderr.trim().split('\n').slice(1).map(l => l.trim()).sort(),
      ['bridge option hiss: true', 'cast bogwade', 'cast extra tap: "tongue"', 'cast reedclan variant 5', 'pose strike', 'title camera reeds'].sort());
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

/* Chapter 7: the same, for every new name in chapter 7's spec (docs/chapters/07-the-counts-dont-lie.spec.md,
 * section 4): the pile's two cameras round the back and their anchors, the tunnel, the tracks and the taps
 * on the back row and the roots; the bridge's print camera, her paw over it, its tap and the comparison
 * (`compare`, declared `[false, [24, 60]]`, the shape the story and the art use); the Hollow's comparison;
 * Riffle's fish and Sprinkle's mist as cast extras. */
test('storyboard.mjs --check-words: words for every name chapter 7’s spec adds to the art (the pile round the back, the print, the comparison, the taps, the fish and the mist); a name the spec never gave fails', () => {
  const fs = require('node:fs'), os = require('node:os');
  const TOOL = path.join(ROOT, 'tools/storyboard.mjs');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-words-'));
  try {
    const ch07 = {
      sets: {
        pile: { cams: ['rear', 'hole'], anchors: ['rear-1', 'rear-2', 'guard-1', 'guard-2', 'guard-3', 'brink', 'arch'], opts: { tunnel: [false, true], tracks: [false, true], tap: ['none', 'back', 'roots'] } },
        bridge: { cams: ['print'], anchors: ['over'], opts: { tap: ['none', 'print'], compare: [false, [24, 60]] } },
        hollow: { opts: { compare: [false, [24, 60]] } }
      },
      extras: { tap: ['fish', 'mist'] }
    };
    const run = (x) => { const f = path.join(tmp, 'more.json'); fs.writeFileSync(f, JSON.stringify(x)); return spawnSync(process.execPath, [TOOL, '--check-words', f], { encoding: 'utf8' }); };
    const ok = run(ch07);
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^Every set, camera, anchor, option, pose, mood, effect, cast member and cast extra has words\.$/m);
    // names nobody gave: a camera, an anchor, a tap on the pile and the bridge, a comparison that is no pair, a cast extra
    const bad = run({ sets: { pile: { cams: ['tunnel'], anchors: ['rear-3'], opts: { tap: ['scale'] } }, bridge: { opts: { tap: ['drag'], compare: [true] } }, hollow: { opts: { compare: [[24]] } } }, extras: { tap: ['whiskers'] } });
    assert.equal(bad.status, 1);
    assert.deepEqual(bad.stderr.trim().split('\n').slice(1).map(l => l.trim()).sort(),
      ['bridge option compare: true', 'bridge option tap: "drag"', 'cast extra tap: "whiskers"', 'hollow option compare: [24]', 'pile anchor rear-3', 'pile camera tunnel', 'pile option tap: "scale"'].sort());
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

/* Chapter 8: the same, for every new name in chapter 8's spec (docs/chapters/08-the-night-trail.spec.md,
 * section 4), with its option declarations exactly as the spec gives them: the new set `tracks` (its eight
 * cameras, its anchors, `moon`, the three taps, `tight`, `worm`); the Barking Field at night (`moon`, the
 * path tapped, the heap, the log, the wire, the ring, the fence top, the trail); the pile's `poke` and the
 * tunnel's mouth tapped; the den's half moon and her glass; Hail, Snip and Snatch and every pose of theirs;
 * the cats' run, the dogs' lie, Reynard's trot; the raised tail, the tail and the leaf tapped, the leaf, the
 * glass and the mouse held. Riffle's taps (`ears`, `paw`) are names chapter 6 gave already. */
test('storyboard.mjs --check-words: words for every name chapter 8’s spec adds to the art (the bank by the tracks and the tunnel’s inside, the field at night, the pile’s poke and mouth, the den’s half moon and glass, Hail, Snip and Snatch, the new poses and extras), declared as the spec has them; a name the spec never gave fails', () => {
  const fs = require('node:fs'), os = require('node:os');
  const TOOL = path.join(ROOT, 'tools/storyboard.mjs');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-words-'));
  try {
    const WEASEL = ['stand', 'up', 'run', 'skid', 'peek', 'point', 'curl'];
    const ch08 = {
      sets: {
        tracks: { cams: ['wide', 'hide', 'holes', 'brag', 'stash', 'stash-close', 'crawl', 'fork'],
          anchors: ['tunnel-end', 'foot-1', 'foot-2', 'hole-1', 'hole-2', 'rails', 'weeds-1', 'weeds-2', 'stash-mouth', 'watch', 'slope-1', 'slope-2', 'stash-in', 'near', 'crawl-1', 'crawl-2', 'fork-1', 'fork-2'],
          opts: { moon: 'number', tap: ['none', 'weeds', 'stash', 'glass'], tight: [false, true], worm: [false, true] } },
        field: { anchors: ['heap-1', 'heap-2', 'heap-3', 'log', 'wire', 'ring-1', 'ring-2', 'ring-3', 'ring-4', 'fence-top', 'trail-1', 'trail-2'], opts: { moon: 'number', tap: ['none', 'path'] } },
        pile: { anchors: ['poke'], opts: { tap: ['none', 'back', 'roots', 'mouth'] } },
        den: { opts: { moon: [false, true, 5, 8], glass: [false, true] } }
      },
      cast: ['hail', 'snip', 'snatch'],
      poses: ['run'],
      otherPoses: { hail: ['sit', 'stand', 'bounce', 'run', 'peek', 'pawup', 'tilt'], snip: WEASEL, snatch: WEASEL, dog: ['lie'], reynard: ['trot'], riffle: ['scramble'] },
      extras: { tailUp: [true], tap: ['tail', 'leaf', 'ears', 'paw'], holds: ['leaf', 'glass', 'mouse'], holdAt: ['mouth', 'paws'], asleep: [true] }
    };
    const run = (x) => { const f = path.join(tmp, 'more.json'); fs.writeFileSync(f, JSON.stringify(x)); return spawnSync(process.execPath, [TOOL, '--check-words', f], { encoding: 'utf8' }); };
    const ok = run(ch08);
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^Every set, camera, anchor, option, pose, mood, effect, cast member and cast extra has words\.$/m);
    // names nobody gave: a camera, anchors, taps, a glass that is no flag, a tight place that is no flag, a cast member, poses, extras
    const bad = run({
      sets: { tracks: { cams: ['tunnel'], anchors: ['hole-3', 'sleeper'], opts: { tap: ['rails'], tight: ['very'] } }, field: { anchors: ['kennel'], opts: { tap: ['log'] } }, pile: { opts: { tap: ['hedge'] } }, den: { opts: { glass: ['heap'] } } },
      // (`spin` was a name nobody gave until chapter 9 gave it to the spider: Hail's never-given pose is `twirl` now)
      cast: ['swipe'], otherPoses: { hail: ['twirl'], snip: ['dig'] }, extras: { tap: ['mouse'], holds: ['shard'], tailUp: ['half'] }
    });
    assert.equal(bad.status, 1);
    assert.deepEqual(bad.stderr.trim().split('\n').slice(1).map(l => l.trim()).sort(),
      ['cast extra holds: "shard"', 'cast extra tailUp: "half"', 'cast extra tap: "mouse"', 'cast swipe', 'den option glass: "heap"', 'field anchor kennel', 'field option tap: "log"', 'pile option tap: "hedge"',
        'pose dig', 'pose twirl', 'tracks anchor hole-3', 'tracks anchor sleeper', 'tracks camera tunnel', 'tracks option tap: "rails"', 'tracks option tight: "very"'].sort());
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

/* Chapter 9: the same, for every new name in chapter 9's spec (docs/chapters/09-featherlight.spec.md, section 4),
 * declared as the spec has them: the new set `grove` (its five cameras and their anchors, no options); the camp's
 * `herbs` (its anchors and `remedy`), the den's `case` (its anchors, `read` a number, the moon at 13), the title's
 * `root` and `tap: 'root'`, the roof's `dew` and `puddle`, the bridge's `shallows` and the bank's new spots;
 * Thymeleaf, Mizzle, GroveClan's two by variant and the spider, with every pose of theirs; Sprinkle's flight,
 * Squall's `hidden`; Riffle's mint, the wing tapped, and the cats' marks this chapter carries. Thymeleaf and
 * GroveClan's cats are cats: their poses are the cats' own names. */
test('storyboard.mjs --check-words: words for every name chapter 9’s spec adds to the art (GroveClan’s woods, Thymeleaf’s den, the case laid out and its rows, the moon at 13, the root, the dew, the shallows and the bank’s spots, Thymeleaf, Mizzle, GroveClan by variant, the spider, Sprinkle in flight, Squall behind the pole, the mint and the wing), declared as the spec has them; a name the spec never gave fails', () => {
  const fs = require('node:fs'), os = require('node:os');
  const TOOL = path.join(ROOT, 'tools/storyboard.mjs');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-words-'));
  try {
    const ch09 = {
      sets: {
        grove: { cams: ['bridge', 'wide', 'meet', 'oak', 'hollow'],
          anchors: ['near-1', 'near-2', 'span-1', 'span-2', 'far', 'edge-1', 'edge-2', 'edge-3', 'elder', 'fern', 'meet-1', 'meet-2', 'meet-3', 'root-1', 'root-2', 'root-3', 'trunk', 'moss', 'nook', 'lip'], opts: {} },
        camp: { cams: ['herbs'], anchors: ['herbs-1', 'herbs-2', 'herbs-3', 'web'], opts: { remedy: ['none', 'four', 'mixed'] } },
        den: { cams: ['case'], anchors: ['case-1', 'case-2', 'case-3'], opts: { read: 'number', moon: [false, true, 5, 8, 13] } },
        title: { opts: { root: [false, true], tap: ['none', 'root'] } },
        roof: { anchors: ['puddle'], opts: { dew: [false, true] } },
        bridge: { anchors: ['run', 'run-2', 'skim', 'air', 'paddle', 'watch-1', 'watch-2', 'watch-3', 'watch-4'], opts: { shallows: [false, true] } }
      },
      cast: ['thymeleaf', 'mizzle', 'groveclan', 'spider'],
      otherPoses: { mizzle: ['curl', 'yawn', 'sit', 'wake', 'pawup'], spider: ['spin', 'wave'], sprinkle: ['hop', 'flap', 'glide', 'fly', 'splash'], squall: ['hidden'] },
      extras: { holds: ['mint', 'leaf', 'glass'], holdAt: ['paws', 'mouth'], tap: ['wing', 'leaf', 'nose', 'paw', 'ears', 'tail'], tailUp: [true], asleep: [true, 'half'] },
      variants: { groveclan: [1, 2] }
    };
    const run = (x) => { const f = path.join(tmp, 'more.json'); fs.writeFileSync(f, JSON.stringify(x)); return spawnSync(process.execPath, [TOOL, '--check-words', f], { encoding: 'utf8' }); };
    const ok = run(ch09);
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^Every set, camera, anchor, option, pose, mood, effect, cast member and cast extra has words\.$/m);
    // every value of the case's `read` the spec uses (0 to 7) has words, not only the check's sample number
    const rows = run({ sets: { den: { cams: ['case'], opts: { read: [0, 1, 2, 3, 4, 5, 6, 7] } } } });
    assert.equal(rows.status, 0, rows.stderr);
    // names nobody gave: a camera, anchors, option values, a cast member, poses, extras, a third GroveClan cat
    const bad = run({
      sets: { grove: { cams: ['canopy'], anchors: ['branch'] }, camp: { opts: { remedy: ['boiled'] } }, den: { opts: { read: [8] } }, title: { opts: { tap: ['reeds'] } },
        roof: { opts: { dew: ['frost'] } }, bridge: { anchors: ['run-3'], opts: { shallows: ['deep'] } } },
      cast: ['thistle'], otherPoses: { mizzle: ['nap'], spider: ['crawl'] }, extras: { holds: ['acorn'], tap: ['web'] }, variants: { groveclan: [3] }
    });
    assert.equal(bad.status, 1);
    assert.deepEqual(bad.stderr.trim().split('\n').slice(1).map(l => l.trim()).sort(),
      ['bridge anchor run-3', 'bridge option shallows: "deep"', 'camp option remedy: "boiled"', 'cast extra holds: "acorn"', 'cast extra tap: "web"', 'cast groveclan variant 3', 'cast thistle',
        'den option read: 8', 'grove anchor branch', 'grove camera canopy', 'pose crawl', 'pose nap', 'roof option dew: "frost"', 'title option tap: "reeds"'].sort());
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
