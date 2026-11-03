/* The tools that keep the mini from being overwhelmed (2026-11-02): the render lock (tools/lock.mjs), the shared
 * render and measure cache (tools/sweep.mjs), the test tiers (tools/test.mjs) and the one offscreen WebKit tool
 * (dev/webkit/). No WebKit, Safari or Quick Look runs here, and nothing touches the real lock or cache: every lock
 * and cache is a scratch directory of its own. node --test */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const T = (f) => path.join(ROOT, f);
const scratch = (name) => fs.mkdtempSync(path.join(os.tmpdir(), 'pc-' + name + '-'));
const imp = (f) => import(pathToFileURL(T(f)).href);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const env = (more) => Object.assign({}, process.env, { PC_RENDER_LOCK: '' }, more);
const node = (args, more, opts) => spawnSync(process.execPath, args, Object.assign({ encoding: 'utf8', cwd: ROOT, env: env(more), timeout: 60000 }, opts || {}));

/* A process holding the lock in DIR for `ms`, through the lock's own command; resolves once it holds it. */
async function holder(dir, ms) {
  const p = spawn(process.execPath, [T('tools/lock.mjs'), '--', process.execPath, '-e', 'setTimeout(() => {}, ' + ms + ')'], { env: env({ PC_LOCK_DIR: dir }), stdio: 'ignore' });
  for (let i = 0; i < 100 && !fs.existsSync(path.join(dir, 'render.lock/holder.json')); i++) await sleep(50);
  assert.ok(fs.existsSync(path.join(dir, 'render.lock/holder.json')), 'the holder took the lock');
  return p;
}
const gone = async (p) => { if (p.exitCode == null && p.signalCode == null) await new Promise((r) => p.on('exit', r)); };

// ---------------------------------------------------------------- the render lock

test('lock.mjs: a command run under the lock holds it (its pid, what, since) and lets it go; the lock is free before and after', () => {
  const dir = scratch('lock');
  assert.equal(node([T('tools/lock.mjs')], { PC_LOCK_DIR: dir }).stdout.trim(), 'free');
  const r = node([T('tools/lock.mjs'), '--', process.execPath, T('tools/lock.mjs')], { PC_LOCK_DIR: dir });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^held by pid \d+ \(.*tools\/lock\.mjs.*, since \d{4}-\d\d-\d\d \d\d:\d\d\)/);
  assert.equal(node([T('tools/lock.mjs')], { PC_LOCK_DIR: dir }).stdout.trim(), 'free');
  assert.equal(node([T('tools/lock.mjs'), '--', process.execPath, '-e', 'process.exit(3)'], { PC_LOCK_DIR: dir }).status, 3, 'the command\'s own exit');
});

test('lock.mjs: anyone else waits at most LOCK_WAIT, then says who holds it and exits 75; the holder\'s children never wait on it', async () => {
  const dir = scratch('lock');
  const h = await holder(dir, 8000);
  try {
    const t0 = Date.now();
    const r = node([T('tools/lock.mjs'), '--', process.execPath, '-e', 'console.log("ran")'], { PC_LOCK_DIR: dir, LOCK_WAIT: '1' });
    assert.equal(r.status, 75);
    assert.ok(Date.now() - t0 >= 900, 'it waited');
    assert.doesNotMatch(r.stdout, /ran/, 'the command never ran');
    assert.match(r.stderr, new RegExp('the render lock is busy: pid ' + h.pid + ' [\\s\\S]*Nothing was rendered'));
    // a child of the holder (PC_RENDER_LOCK names it) goes straight through, even with no wait at all
    const kid = node([T('tools/lock.mjs'), '--', process.execPath, '-e', 'console.log("ran")'], { PC_LOCK_DIR: dir, LOCK_WAIT: '0', PC_RENDER_LOCK: String(h.pid) });
    assert.equal(kid.status, 0, kid.stderr);
    assert.match(kid.stdout, /ran/);
  } finally { h.kill('SIGTERM'); await gone(h); }
  for (let i = 0; i < 40 && fs.existsSync(path.join(dir, 'render.lock')); i++) await sleep(50);
  assert.ok(!fs.existsSync(path.join(dir, 'render.lock')), 'a holder stopped with SIGTERM lets the lock go');
});

test('lock.mjs: a lock whose holder is gone (a dead pid, or a pid now another process) is taken over', () => {
  const dir = scratch('lock');
  for (const h of [{ pid: 999999, what: 'a killed agent' }, { pid: process.pid, what: 'a reused pid', start: 'Thu Jan  1 00:00:00 1970' }]) {
    fs.mkdirSync(path.join(dir, 'render.lock'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'render.lock/holder.json'), JSON.stringify(h));
    assert.match(node([T('tools/lock.mjs')], { PC_LOCK_DIR: dir }).stdout, /^stale/);
    const r = node([T('tools/lock.mjs'), '--', process.execPath, '-e', 'console.log("ran")'], { PC_LOCK_DIR: dir, LOCK_WAIT: '2' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stderr, /took over from pid/);
    assert.ok(!fs.existsSync(path.join(dir, 'render.lock')));
  }
});

test('frames.mjs and shots.mjs take the render lock before Quick Look or Safari: kept waiting, they stop with exit 75 and render nothing', async () => {
  const dir = scratch('lock'), out = scratch('out');
  const h = await holder(dir, 20000);
  try {
    const f = node([T('tools/frames.mjs'), 'ch01', out, 'f001'], { PC_LOCK_DIR: dir, LOCK_WAIT: '1' });
    assert.equal(f.status, 75, f.stderr);
    assert.match(f.stderr, /render lock is busy/);
    const s = node([T('tools/shots.mjs'), out, 'hub'], { PC_LOCK_DIR: dir, LOCK_WAIT: '1', LOCKED: '1' });
    assert.equal(s.status, 75, s.stderr);
    assert.match(s.stderr, /render lock is busy/);
    assert.deepEqual(fs.readdirSync(out), [], 'nothing rendered');
  } finally { h.kill('SIGTERM'); await gone(h); }
  // the checks that start nothing never wait
  assert.equal(node([T('tools/shots.mjs'), '--lock'], { PC_LOCK_DIR: dir, LOCK_WAIT: '0', LOCKED: '1' }).status, 0);
  const src = fs.readFileSync(T('tools/shots.mjs'), 'utf8');
  assert.ok(src.indexOf('await holdOrExit(') < src.indexOf("spawn('safaridriver'") && src.indexOf('await holdOrExit(') < src.indexOf('const server = createServer('), 'shots.mjs: the lock before the server and Safari');
  const fsrc = fs.readFileSync(T('tools/frames.mjs'), 'utf8');
  assert.ok(fsrc.indexOf('await holdOrExit(') > 0 && fsrc.indexOf('await holdOrExit(') < fsrc.indexOf("if (argv[0] === '--scene')"), 'frames.mjs: the lock before any render');
});

// ---------------------------------------------------------------- the test tiers

test('test.mjs: --full is every test file; --fast every one but the slow ones (each a real file), plus any named; at most four files at a time', async () => {
  const all = fs.readdirSync(T('tests')).filter((f) => f.endsWith('.test.js')).sort().map((f) => 'tests/' + f);
  const list = (...a) => node([T('tools/test.mjs'), '--list', ...a]).stdout.trim().split('\n');
  assert.deepEqual(list('--full'), all);
  const { SLOW, MAX_CONCURRENCY } = await imp('tools/test.mjs');
  for (const f of SLOW) assert.ok(all.includes('tests/' + f), f + ' is a test file');
  assert.deepEqual(list('--fast'), all.filter((f) => !SLOW.includes(path.basename(f))));
  assert.ok(list('--fast', 'tests/scenes.test.js').includes('tests/scenes.test.js'), 'a slow file named is added');
  assert.ok(list('--fast').includes('tests/render-tools.test.js') && list('--fast').includes('tests/workflows.test.js'));
  assert.equal(MAX_CONCURRENCY, 4);
  const src = fs.readFileSync(T('tools/test.mjs'), 'utf8');
  assert.match(src, /'--test-concurrency=' \+ conc/);
  assert.match(src, /Math\.min\(MAX_CONCURRENCY,/, 'TEST_CONCURRENCY can lower it, never raise it');
  assert.ok(!fs.existsSync(T('package.json')), '`node --test` is unchanged: no package.json, no test script');
});

// ---------------------------------------------------------------- the shared cache

function fakeTree() {
  const d = scratch('tree');
  for (const [f, s] of [['index.html', '<html><head></head><body><script src="app/x.js"></script></body></html>'], ['app/x.js', 'var x = 1;'], ['app/art/y.js', 'var y = 2;'], ['fonts/a.css', 'a{}'], ['tools/shots.mjs', '// shots'], ['docs/notes.md', 'not in the key']]) {
    fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true });
    fs.writeFileSync(path.join(d, f), s);
  }
  return d;
}

test('sweep.mjs: the cache key is the tree\'s index.html, app/**, fonts/** and tools/shots.mjs and the renderer\'s own source; nothing else moves it', async () => {
  const { cacheKey, treeFiles } = await imp('tools/sweep.mjs');
  const t = fakeTree();
  assert.deepEqual(treeFiles(t), ['index.html', 'tools/shots.mjs', 'app/art/y.js', 'app/x.js', 'fonts/a.css']);
  const k = cacheKey(t);
  assert.match(k, /^[0-9a-f]{16}$/);
  assert.equal(cacheKey(t), k, 'the same tree, the same key');
  fs.writeFileSync(path.join(t, 'docs/notes.md'), 'changed');
  assert.equal(cacheKey(t), k, 'docs are not in it');
  for (const f of ['app/art/y.js', 'index.html', 'fonts/a.css', 'tools/shots.mjs']) {
    const was = fs.readFileSync(path.join(t, f));
    fs.writeFileSync(path.join(t, f), was + ' ');
    assert.notEqual(cacheKey(t), k, f + ' is in it');
    fs.writeFileSync(path.join(t, f), was);
  }
  fs.writeFileSync(path.join(t, 'app/new.js'), '');
  assert.notEqual(cacheKey(t), k, 'a new file under app/ is in it');
  fs.rmSync(path.join(t, 'app/new.js'));
  // the renderer: a copy of its four files, one changed
  const r = scratch('renderer');
  for (const f of ['tools/sweep.mjs', 'dev/webkit/snap.swift', 'dev/webkit/run.mjs', 'dev/webkit/measure.js']) { fs.mkdirSync(path.dirname(path.join(r, f)), { recursive: true }); fs.copyFileSync(T(f), path.join(r, f)); }
  assert.equal(cacheKey(t, r), k);
  fs.appendFileSync(path.join(r, 'dev/webkit/measure.js'), '\n');
  assert.notEqual(cacheKey(t, r), k, 'the renderer\'s source is in it');
});

test('sweep.mjs --path: where a tree\'s cache is and what it holds, building nothing', () => {
  const cache = scratch('cache');
  const r = node([T('tools/sweep.mjs'), '--path'], { PC_CACHE_DIR: cache });
  assert.equal(r.status, 0, r.stderr);
  const [dir, what] = r.stdout.trim().split('\n');
  assert.ok(dir.startsWith(cache + path.sep) && /[0-9a-f]{16}$/.test(dir));
  assert.equal(what, 'art: not built; pages: not built');
  assert.deepEqual(fs.readdirSync(cache), [], 'nothing made');
  const other = node([T('tools/sweep.mjs'), '--path', '--root', fakeTree()], { PC_CACHE_DIR: cache });
  assert.notEqual(other.stdout.split('\n')[0], dir, 'another tree, another cache');
});

function fakePages(dir, rows) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '1080x720-aa1-plain.json'), JSON.stringify({ size: [1080, 720], big: true, jobs: [{ name: 'plain', big: true, notes: ['STEPERR step 9: boom'], rows }] }));
}
const ROW = (t, more) => Object.assign({ t, vw: 1080, vh: 720, sw: 1080, bad: [], spill: [], broken: [], errs: 0, said: 0, read: false, silent: true, fp: 'a', pfp: 'b' }, more);

test('sweep.mjs: the pages\' problems, by kind: off the screen (as it opens, tapping through, on a keypad), spilling, broken words, sideways, page errors, anything said; the screens that scroll by design apart', async () => {
  const { summarize } = await imp('tools/sweep.mjs');
  const d = scratch('pages');
  fakePages(d, [ROW('ch05:f010'), ROW('ch05:f011', { bad: ['#nextBtn"Next"@700-760:b'] }), ROW('ch01:f011', { bad: ['.sw"Green"@726-821:b'] }), ROW('screen:book', { bad: ['.btn"Camp"@900-950:B'] }),
    ROW('ch05:f049@tapped', { worst: [-40, '#backBottom"Back"'] }), ROW('ch05:f060@lesson', { bad: ['.key"0"@700-760:b'] }), ROW('ch05:f012', { spill: ['.btext"HALT": right 6'], broken: ['FOR|TY in .caption'] }),
    ROW('ch05:f013', { sw: 1200 }), ROW('ch05:f014', { errs: 2 }), ROW('ch05:f015', { said: 1 }), ROW('ch05:f016', { read: true }), ROW('ch05:f017', { silent: false })]);
  const s = summarize(d);
  assert.equal(s.measured, 12);
  assert.deepEqual(s.counts, { 'page-error': 2, 'off-screen': 1, 'off-screen-tapping': 1, 'off-screen-keypad': 1, spill: 1, 'broken-word': 1, sideways: 1, 'said-aloud': 3 });
  assert.deepEqual(s.scrolls.map((x) => x.at), ['ch01:f011', 'screen:book'], 'the look chooser and the book scroll by design');
  assert.ok(s.problems.every((p) => p.size === '1080x720' && p.aa === 'on'));
  assert.ok(!s.problems.some((p) => p.at === 'ch05:f010'), 'a clean page has none');
});

test('sweep.mjs --compare: the frames whose art differs, the pages whose boxes or panel moved, and the problems new and gone', async () => {
  const { compareCaches } = await imp('tools/sweep.mjs');
  const make = (pics, rows, problems) => {
    const d = scratch('cachedir');
    fs.mkdirSync(path.join(d, 'art/ch01'), { recursive: true });
    fs.writeFileSync(path.join(d, 'art/index.json'), '{}');
    fs.writeFileSync(path.join(d, 'art/ch01/index.json'), JSON.stringify({ frames: Object.keys(pics).map((id) => ({ id, jpg: 'ch01/' + id + '.jpg' })) }));
    for (const [id, b] of Object.entries(pics)) fs.writeFileSync(path.join(d, 'art/ch01', id + '.jpg'), b);
    fakePages(path.join(d, 'pages'), rows);
    fs.writeFileSync(path.join(d, 'pages/summary.json'), JSON.stringify({ problems }));
    return d;
  };
  const p = (at) => ({ kind: 'spill', size: '1080x720', aa: 'on', at, detail: 'x' });
  const now = make({ f001: 'same', f002: 'new art', f003: 'only here' }, [ROW('ch01:f001'), ROW('ch01:f002', { fp: 'moved' }), ROW('ch01:f003', { pfp: 'changed' }), ROW('warrior:q', { fp: 'another question' }), ROW('warrior:open', { fp: 'moved too' })], [p('ch01:f002')]);
  const live = make({ f001: 'same', f002: 'old art', f004: 'only there' }, [ROW('ch01:f001'), ROW('ch01:f002'), ROW('ch01:f003'), ROW('warrior:q'), ROW('warrior:open')], [p('ch01:f009')]);
  const c = compareCaches(now, live);
  assert.deepEqual(c.art, { frames: 3, differ: ['ch01:f002'], onlyHere: ['ch01:f003'], onlyThere: ['ch01:f004'] });
  assert.deepEqual(c.pages.boxesMoved, ['1080x720 on ch01:f002', '1080x720 on warrior:open']);
  assert.deepEqual(c.pages.variesRunToRun, ['1080x720 on warrior:q'], 'a new sitting each run (seeded by the clock): apart, not a move');
  assert.deepEqual(c.pages.panelChanged, ['1080x720 on ch01:f003']);
  assert.deepEqual(c.pages.newProblems.map((x) => x.at), ['ch01:f002']);
  assert.deepEqual(c.pages.goneProblems.map((x) => x.at), ['ch01:f009']);
});

test('sweep.mjs: one WebKit process at a time, the lock let go between chapters and sizes, a low priority, and a tree that changed under the sweep is never cached', () => {
  const src = fs.readFileSync(T('tools/sweep.mjs'), 'utf8');
  assert.ok(!/Promise\.all|parallel\(/.test(src), 'nothing in parallel');
  assert.equal((src.match(/await runJobs\(/g) || []).length, 2, 'the art (a chapter a run) and the pages (a size, Aa and group a run)');
  assert.equal((src.match(/await sleep\(1500\);/g) || []).length, 2, 'a pause after each run, so a waiting renderer gets the lock');
  assert.match(src, /setPriority\(10\)/);
  assert.match(src, /if \(cacheKey\(root\) !== key\) \{ rmSync\(dir/);
  const run = fs.readFileSync(T('dev/webkit/run.mjs'), 'utf8');
  assert.match(run, /spawn\('taskpolicy', \['-c', 'utility', bin, jf\]/);
  assert.match(run, /const release = await acquire\(what\);[\s\S]*finally \{\s*release\(\);/);
});

// ---------------------------------------------------------------- the one WebKit tool

test('dev/webkit: the binary is built from the repo\'s source only when it is stale; one copy, outside the repo', async () => {
  const dir = scratch('webkit');
  const r = node([T('dev/webkit/build.mjs'), '--check'], { PC_WEBKIT_DIR: dir });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /^stale: no binary/);
  fs.writeFileSync(path.join(dir, 'snap'), 'old');
  fs.utimesSync(path.join(dir, 'snap'), new Date(), new Date(Date.now() + 60000));
  assert.match(node([T('dev/webkit/build.mjs'), '--check'], { PC_WEBKIT_DIR: dir }).stdout, /^stale: built from another source/, 'newer than the source but not built from it');
  const { BIN_DIR } = await imp('dev/webkit/build.mjs');
  assert.ok(BIN_DIR.endsWith(path.join('potomac-crossing-work', 'tools', 'webkit')) || process.env.PC_WEBKIT_DIR, 'the binary lives in the work folder');
  assert.ok(!fs.readdirSync(T('dev/webkit')).some((f) => f === 'snap' || f.endsWith('.o')), 'no binary in the repo');
});

test('dev/webkit/snap.swift is silent and safe by construction: a non-persistent store, media never plays, SILENT at document start, and it refuses to run without the render lock', () => {
  const src = fs.readFileSync(T('dev/webkit/snap.swift'), 'utf8');
  for (const re of [/websiteDataStore = WKWebsiteDataStore\.nonPersistent\(\)/, /mediaTypesRequiringUserActionForPlayback = \.all/, /setAllMediaPlaybackSuspended\(true/,
    /WKUserScript\(source: silent, injectionTime: \.atDocumentStart, forMainFrameOnly: false\)/, /environment\["PC_RENDER_LOCK"\][\s\S]*exit\(3\)/])
    assert.match(src, re);
  assert.ok(src.indexOf('PC_RENDER_LOCK') < src.indexOf('class Runner'), 'the lock is checked before anything starts');
  assert.doesNotMatch(src, /AVSpeech|NSSpeech|AVAudio|NSSound|"say"/, 'nothing that can sound');
});

test('dev/webkit/run.mjs drives the page with the tree\'s own shots.mjs scripts, verbatim: SILENT first in every served page, STILL, SETUP with Read to me off and checked', async () => {
  const { pageScripts, serve, measureJobs, call } = await imp('dev/webkit/run.mjs');
  const S = pageScripts(ROOT);
  const shots = fs.readFileSync(T('tools/shots.mjs'), 'utf8');
  for (const k of ['STILL', 'QUIET']) assert.ok(shots.includes('const ' + k + ' = `' + S[k] + '`;'), k + ' is shots.mjs\'s, verbatim');
  assert.match(S.SETUP, /localStorage\.clear\(\); PC\.debug\.reset\(\);/);
  assert.ok(S.SETUP.includes(S.QUIET), 'SETUP ends with QUIET, as shots.mjs builds it');
  const page = node([T('tools/shots.mjs'), '--page']).stdout;
  const srv = await serve(ROOT, S.SILENT);
  try {
    const html = await (await fetch(srv.site)).text();
    assert.equal(html, page, 'the page as shots.mjs serves it');
    assert.ok(html.indexOf(S.SILENT) > 0 && html.indexOf(S.SILENT) < html.indexOf('<script src='), 'SILENT before any script of the game');
    assert.equal((await fetch(srv.site + '../../../etc/hosts')).status, 404);
  } finally { await srv.close(); }
  const jobs = measureJobs(S, 'http://localhost:1/', ['plain', 'screens', 'warrior']);
  assert.ok(jobs.length > 6);
  for (const j of jobs) {
    assert.equal(j.steps[1].js, call(S.STILL), j.name + ': stills first');
    const head = '(function(){' + S.SETUP + '\n}).apply(null, ', setup = j.steps.find((s) => s.js.startsWith(head));
    assert.ok(setup, j.name + ': SETUP');
    const args = JSON.parse(setup.js.slice(head.length, -1));
    assert.equal(args[2], false, j.name + ': Read to me off (SETUP\'s third argument, checked by QUIET)');
    assert.equal(setup.js, call(S.SETUP, args));
    assert.ok(!j.steps.some((s) => /readBtn/.test(s.js) && !/QUIET|readAloud !== want/.test(s.js)), j.name + ': nothing taps Read to me');
  }
});
