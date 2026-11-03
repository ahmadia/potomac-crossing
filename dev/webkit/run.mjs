#!/usr/bin/env node
/* Potomac Crossing: the offscreen WebKit tool's driver (the canonical copy, 2026-11-02; README.md beside this file).
 * It serves a tree on localhost, builds the binary if it is stale (build.mjs), takes the render lock (tools/lock.mjs),
 * and runs the real page in WebKit, offscreen and silent, driven with the tree's own tools/shots.mjs page scripts
 * taken verbatim (SILENT first in every served page's <head> and at document start, STILL, SETUP with QUIET: Read to
 * me off and checked), every font face loaded before anything is measured. Aa is set with the page's own button.
 *
 *   node dev/webkit/run.mjs OUT.json plain taps lessons screens warrior    the measure sweeps (measure.js)
 *       plain    every frame of every chapter as it opens          taps     every Taps page tapped through
 *       lessons  every Counts frame's keypad after the game scrolls screens  title, who, hub, book, nest, the
 *       warrior  the Warrior Counts' screens (open, a question, the sand, halfway, a pass, a not-yet, after a pass)
 *                Training Hollow and a round in it, her Case File, the grown-ups corner
 *   …  only:ch05:f010,ch05:f011       the plain sweep over those frames alone
 *   …  settle:ch05:f010,…             each frame opened and measured after 0.9 s
 *   …  probe:FILE.js:ch05:f010        open the frame, run FILE (a function body returning something JSON-able)
 *   …  shot:ch05:f010:1:/abs/out.png  open the frame (Aa on: 1), measure it, and take its picture
 *   …  shott:ch05:f049:1:12:/abs/out.png   the frame after 12 taps, then its picture
 *   ROOT_DIR=tree   another tree (its own tools/shots.mjs scripts; default: this repo)
 *   SIZE=1180x820   the page's size in CSS px (default 1080x720)     AA=0,1   Aa off, on, or both (the default)
 *   CAT='{…}'       over the sweep's cat (below)                      CSS=file  a candidate stylesheet, put in after setup
 * OUT.json: { root, size, secs, jobs: [{ name, big, rows | ms, notes }] } (rows: one __JM per frame; notes: step
 * errors). Whole-tree renders and measurements: use tools/sweep.mjs, which caches them; this is for the frames you
 * change. Exit 75 when the render lock stays busy for 5 minutes (LOCK_WAIT).
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, extname, normalize, resolve, dirname, sep } from 'path';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { fileURLToPath, pathToFileURL } from 'url';
import { ensureBuilt } from './build.mjs';
import { acquire, EXIT_LOCKED } from '../../tools/lock.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(HERE, '../..');
export const MEASURE = readFileSync(join(HERE, 'measure.js'), 'utf8');
export const SIZES = ['1080x720', '1180x820', '820x1180', '390x844'];

/* A tree's own page scripts, verbatim from its tools/shots.mjs (as every earlier checker read them). */
export function pageScripts(root) {
  const src = readFileSync(join(root, 'tools/shots.mjs'), 'utf8');
  const lit = (name, need = true) => { const m = src.match(new RegExp('const ' + name + ' = (`[\\s\\S]*?`);\\n')); if (!m) { if (need) throw new Error('no ' + name + ' in ' + root + '/tools/shots.mjs'); return null; } return eval(m[1]); };
  const sm = src.match(/const SETUP = (`[\s\S]*?arguments\[2\]\);`);\n/); if (!sm) throw new Error('no SETUP in ' + root + '/tools/shots.mjs');
  const cm = src.match(/const CAT = Object\.assign\((\{[\s\S]*?\n\}), process\.env\.CAT/); if (!cm) throw new Error('no CAT in ' + root + '/tools/shots.mjs');
  const WARRIOR = lit('WARRIOR', false), QUIET = lit('QUIET');
  // SETUP splices WARRIOR and QUIET in by name (the `+ WARRIOR +` in its source): put them where it does
  const SETUP = eval(sm[1]);
  const fm = src.match(/const PICK_FULL = (\[[\s\S]*?\]);\n/);
  return { SILENT: lit('SILENT'), STILL: lit('STILL'), QUIET, SETUP, WARRIOR, CAT: eval('(' + cm[1] + ')'), PICK_FULL: fm ? eval(fm[1]) : null };
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.webmanifest': 'application/manifest+json' };
/* Serve a tree on 127.0.0.1 (a free port), every HTML page with SILENT first in its <head>. `mounts`: { '/__x/': dir }
 * serves another directory under a prefix (the sweep's contact sheets read its own pictures). */
export async function serve(root, SILENT, mounts = {}) {
  const silenced = (html) => /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + SILENT) : SILENT + html;
  const server = createServer(async (req, res) => {
    const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    const mount = Object.keys(mounts).find((k) => p.startsWith(k));
    const base = mount ? mounts[mount] : root;
    const file = join(base, mount ? p.slice(mount.length) : (p.endsWith('/') ? p + 'index.html' : p));
    if (!file.startsWith(resolve(base) + sep) && file !== resolve(base)) { res.writeHead(403); return res.end(); }
    try {
      let body = await readFile(file);
      if (extname(file) === '.html') body = Buffer.from(silenced(String(body)));
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(body);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { site: 'http://localhost:' + server.address().port + '/', close: () => new Promise((r) => server.close(r)) };
}

export const call = (body, args) => '(function(){' + body + '\n}).apply(null, ' + JSON.stringify(args || []) + ')';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Run one jobs file in WebKit, holding the render lock (taken here unless this process or its parent holds it), at a
 * low priority (taskpolicy's utility clamp). Resolves to { jobs: [{ results: [[step, value]], errors: [[step, msg]],
 * pictures: [path], missing: [line] }], warn: [stderr lines worth reading], code, secs }. */
export async function runJobs({ width, height, silent, jobs }, { what = 'dev/webkit/run.mjs', dir = tmpdir(), timeoutSec = 3600 } = {}) {
  const bin = ensureBuilt();
  mkdirSync(dir, { recursive: true });
  const jf = join(dir, 'jobs-' + process.pid + '-' + Date.now() + '.json');
  writeFileSync(jf, JSON.stringify({ width, height, silent, jobs }));
  const release = await acquire(what);
  const t0 = Date.now();
  try {
    const out = await new Promise((done) => {
      const child = spawn('taskpolicy', ['-c', 'utility', bin, jf], { env: Object.assign({}, process.env, { SNAP_TIMEOUT: String(timeoutSec) }), stdio: ['ignore', 'pipe', 'pipe'] });
      const kill = () => { try { child.kill('SIGKILL'); } catch {} };
      process.once('exit', kill);
      let so = '', se = '';
      child.stdout.on('data', (d) => { so += d; });
      child.stderr.on('data', (d) => { se += d; });
      child.on('close', (code) => { process.removeListener('exit', kill); done({ so, se, code }); });
    });
    const res = jobs.map(() => ({ results: [], errors: [], pictures: [], missing: [] }));
    let cur = 0;
    for (const line of out.so.split('\n')) {
      const m = line.match(/^(RESULT|STEPERR) (\d+) (-?\d+) ([\s\S]*)$/);
      if (m) { cur = +m[2]; (m[1] === 'RESULT' ? res[cur].results : res[cur].errors).push([+m[3], m[4]]); continue; }
      if (/: no snapshot|: not written/.test(line)) { res[cur] && res[cur].missing.push(line); continue; }
      if (line.startsWith('/') && line.endsWith('.png')) { const k = jobs.findIndex((j, i) => i >= cur && (j.out === line || j.steps.some((s) => s.out === line))); if (k >= 0) { cur = k; res[k].pictures.push(line); } }
    }
    const warn = out.se.split('\n').filter((l) => /^no |stalled|terminated|didFail|snap:/.test(l));
    if (/^timeout$/m.test(out.so)) warn.push('timeout: the WebKit run passed ' + timeoutSec + ' s');
    return { jobs: res, warn, code: out.code, secs: Math.round((Date.now() - t0) / 1000) };
  } finally {
    release();
    rmSync(jf, { force: true });
  }
}

/* Every font face the page declares, loaded before anything is measured or drawn (polled: "pending" until then). */
export function fontSteps() {
  const FONTS = 'var n = 0; document.fonts.forEach(function (f) { if (f.status !== "loaded") { n++; f.load().catch(function () {}); } }); window.__fw = (window.__fw || 0) + 1; return n === 0 && document.fonts.status === "loaded" ? true : window.__fw < 60 ? "pending" : "FONTS not loaded: " + n;';
  return [{ js: call('document.fonts.forEach(function (f) { f.load().catch(function () {}); }); return true;'), wait: 0.3 }, { js: call(FONTS), wait: 0.1 }];
}
/* The first steps of every measuring job: page errors caught, stills, the measure, every font face loaded (polled),
 * the cat set up (SETUP: a fresh device, Read to me off and checked), every chapter but the newest finished, Aa set. */
export function setupSteps(S, cat, big, css) {
  const SETBIG = 'var want = !!arguments[0], tb = document.getElementById("textBtn"); if (document.documentElement.classList.contains("big") !== !!PC.debug.state().settings.bigText) { tb.click(); tb.click(); } ' +
    'if (!!PC.debug.state().settings.bigText !== want) tb.click(); ' +
    'if (!!PC.debug.state().settings.bigText !== want || document.documentElement.classList.contains("big") !== want) return "Aa would not set"; ' +
    'if (PC.debug.state().settings.readAloud) return "Read to me is on"; return true;';
  const FINISH = 'var E = PC.engine, c = PC.debug.cat(), t = Date.now(), L = E.chapters(PC.story); if (!c) return "no cat"; L.slice(0, -1).forEach(function (s, i) { if (!c.finished[s.id]) c.finished[s.id] = t - 86400000 * (60 - i); }); PC.debug.save(); return true;';
  const ERRS = 'window.__errs = window.__errs || []; window.addEventListener("error", function (e) { window.__errs.push(String(e.message)); }); window.addEventListener("unhandledrejection", function (e) { window.__errs.push("rejection: " + String(e.reason)); }); return true;';
  return [{ js: call(ERRS), wait: 0.02 }, { js: call(S.STILL), wait: 0.05 }, { js: MEASURE, wait: 0.02 }].concat(fontSteps(), [
    { js: call(S.SETUP, [cat, null, false]), wait: 0.1 }, { js: call(FINISH), wait: 0.02 }, { js: call(SETBIG, [big]), wait: 0.15 }])
    .concat(css ? [{ js: call('document.head.insertAdjacentHTML("beforeend", "<style id=cand></style>"); document.getElementById("cand").textContent = arguments[0]; return true;', [css]), wait: 0.05 }] : []);
}

/* The cat every sweep measures with: shots.mjs's CAT, called Crystal, her Case File open and full (shots.mjs's
 * PICK_FULL, when the tree has it) with the found flags its cards read; every chapter but the newest finished. */
export function sweepCat(S, over) {
  return Object.assign({}, S.CAT, {
    name: 'Crystal', look: { sex: 'she', marking: 'white-chest', fur: 'silver-tabby', eyes: 'green' },
    flags: Object.assign({}, S.CAT.flags, { caseFileOpen: true, caseFile: true, ch7Flew: true, foundSquall: true, foundPuddle: true, foundWisp: true, foundSleet: true, foundHail: true, foundMizzle: true }),
    cards: S.PICK_FULL || ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'prints-pile', 'puddle-paws', 'reed-pile', 'my-count', 'tunnel', 'hail-shapes', 'stash']
  }, over || {});
}

export const M = (tag) => ({ js: call('return JSON.stringify({ J: 1, m: window.__JM(arguments[0]) });', [tag]), wait: 0.05 });
export const gotoF = (ch, f) => ({ js: call('var r = PC.debug.goto(arguments[1], arguments[0]); window.scrollTo(0, 0); return r === arguments[1] || ("goto " + r);', [ch, f]), wait: 0.9 });
const go = (t) => ({ js: call('PC.debug.go(arguments[0], { from: "hub" }); window.scrollTo(0, 0); return true;', [t]), wait: 0.6 });
const SWEEP = (mode, only) => ({ js: call('return JSON.stringify({ J: 1, rows: window.__JSWEEP(arguments[0], arguments[1]) });', [mode, only || null]), wait: 0.1 });

/* The measuring jobs for `what` (run.mjs's words: plain, taps, lessons, screens, warrior, only:…, settle:…, probe:…,
 * shot:…, shott:…), each { name, big, url, out, steps }. */
export function measureJobs(S, site, what, { aas = [false, true], cat = sweepCat(S), css = '' } = {}) {
  const jobs = [];
  const url = () => site + '?' + (jobs.length + 1);
  const job = (name, big, steps, out) => jobs.push({ name, big, url: url(), out: out || '', steps: setupSteps(S, cat, big, css).concat(steps) });
  for (const big of aas) {
    for (const mode of ['plain', 'taps', 'lessons']) if (what.includes(mode)) job(mode, big, [SWEEP(mode)]);
    if (what.includes('screens')) {
      const click = (sel) => ({ js: call('var b = document.querySelector(arguments[0]); if (!b) return "no " + arguments[0]; var n = Date.now, c = n.call(Date) + 5000; Date.now = function () { return c; }; b.click(); Date.now = n; window.scrollTo(0, 0); return true;', [sel]), wait: 0.6 });
      job('screens', big, [].concat(...['title', 'who', 'hub', 'book', 'nest', 'hollow'].map((t) => [go(t), M('screen:' + t)]),
        [{ js: call('return PC.debug.file(null);'), wait: 0.6 }, M('screen:file'), { js: call('return PC.debug.closeFile();'), wait: 0.3 },
          go('hub'), { js: call('document.getElementById("leaf").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })); return true;'), wait: 1.9 }, M('screen:corner')]));
      job('screens', big, [go('hollow'), click('#startBtn, .counts-pick [data-t]'), M('screen:hollow-round')]);
    }
    if (what.includes('warrior') && S.WARRIOR) {
      const W = (recipe, steps) => [{ js: call(S.WARRIOR, [recipe]), wait: 0.1 }].concat(steps);
      const dbg = (w, i, tag) => [{ js: call('var r = PC.debug.warrior(arguments[0], arguments[1]); window.scrollTo(0, 0); return r;', [w, i]), wait: 0.6 }, M(tag)];
      job('warrior', big, W({}, dbg('open', 0, 'warrior:open')));
      job('warrior', big, W({}, dbg('q', 0, 'warrior:q')));
      job('warrior', big, W({}, dbg('sand', 0, 'warrior:sand')));
      job('warrior', big, W({ answers: 28 }, dbg('halfway', 0, 'warrior:halfway')));
      for (const [k, r] of [['pass', { sittings: [52], seen: false }], ['notyet', { sittings: [46], seen: false }], ['afterpass', { sittings: [52, 53], seen: false }]])
        job('warrior', big, W(r, dbg('result', 0, 'warrior:' + k + '#1').concat(dbg('result', -1, 'warrior:' + k + '#-1'))));
    }
    for (const w of what.filter((x) => x.startsWith('only:'))) job('plain', big, [SWEEP('plain', w.slice(5).split(','))]);
    for (const w of what.filter((x) => x.startsWith('settle:'))) job('settle', big, [].concat(...w.slice(7).split(',').map((t) => { const [ch, f] = t.split(':'); return [gotoF(ch, f), M(t)]; })));
  }
  for (const w of what.filter((x) => x.startsWith('probe:'))) {
    const [, file, ch, f] = w.split(':');
    for (const big of aas) job('probe ' + ch + ':' + f, big, [gotoF(ch, f), { js: call('return JSON.stringify({ J: 1, m: (function(){' + readFileSync(resolve(file), 'utf8') + '\n})() });'), wait: 0.1 }]);
  }
  for (const w of what.filter((x) => x.startsWith('shot:'))) { const [, ch, f, b, png] = w.split(':'); job('shot ' + ch + ':' + f, b === '1', [gotoF(ch, f), M(ch + ':' + f)], png); }
  const TAPN = 'var realNow = Date.now, clock = realNow.call(Date); Date.now = function () { clock += 1000; return clock; }; for (var i = 0; i < arguments[0]; i++) PC.debug.tap(); Date.now = realNow; window.scrollTo(0, 0); return true;';
  for (const w of what.filter((x) => x.startsWith('shott:'))) { const [, ch, f, b, n, png] = w.split(':'); job('shott ' + ch + ':' + f, b === '1', [gotoF(ch, f), { js: call(TAPN, [+n]), wait: 0.6 }, M(ch + ':' + f + '@' + n)], png); }
  return jobs;
}

/* Read a run's results back into rows: { name, big, rows | ms, notes }. */
export function collect(jobs, run) {
  return jobs.map((j, i) => {
    const r = { name: j.name, big: j.big, notes: [] }, got = run.jobs[i];
    for (const [step, v] of got.results) {
      if (v.startsWith('{"J":1')) { const o = JSON.parse(v); if (o.rows) r.rows = o.rows; else (r.ms = r.ms || []).push(o.m); }
      else r.notes.push('step ' + step + ': ' + v.slice(0, 300));
    }
    for (const [step, v] of got.errors) r.notes.push('STEPERR step ' + step + ': ' + v.slice(0, 300));
    for (const v of got.missing) r.notes.push(v);
    if (j.out) r.picture = got.pictures.includes(j.out) ? j.out : null;
    return r;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ROOT = resolve(process.env.ROOT_DIR || REPO);
  const outFile = process.argv[2] && resolve(process.argv[2]);
  const what = process.argv.slice(3);
  if (!outFile || !what.length) { console.error('usage: node dev/webkit/run.mjs OUT.json plain taps lessons screens warrior … (see the top of this file)'); process.exit(2); }
  const S = pageScripts(ROOT);
  const [W, H] = (process.env.SIZE || '1080x720').split('x').map(Number);
  const aas = (process.env.AA || '0,1').split(',').map((x) => x === '1');
  const cat = sweepCat(S, process.env.CAT ? JSON.parse(process.env.CAT) : null);
  const srv = await serve(ROOT, S.SILENT);
  try {
    const jobs = measureJobs(S, srv.site, what, { aas, cat, css: process.env.CSS ? readFileSync(process.env.CSS, 'utf8') : '' });
    let run;
    try { run = await runJobs({ width: W, height: H, silent: S.SILENT, jobs }, { what: 'dev/webkit/run.mjs ' + what.join(' ').slice(0, 80), dir: dirname(outFile) }); }
    catch (e) { if (e.code !== 'ELOCKED') throw e; console.error(e.message); process.exitCode = EXIT_LOCKED; }
    if (run) {
      if (run.warn.length) console.error(run.warn.join('\n'));
      const res = collect(jobs, run);
      writeFileSync(outFile, JSON.stringify({ root: ROOT, size: [W, H], secs: run.secs, jobs: res }));
      console.log(outFile + ': ' + res.length + ' jobs in ' + run.secs + ' s; notes: ' + (res.filter((r) => r.notes.length).map((r) => r.name + (r.big ? '(Aa)' : '') + ' ' + r.notes.join(' | ')).join(' ; ') || 'none'));
      if (run.code !== 0) process.exitCode = 1;
    }
  } finally { await srv.close(); }
}
