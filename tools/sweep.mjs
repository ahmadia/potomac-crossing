#!/usr/bin/env node
/* Potomac Crossing: the shared render and measure cache. Whole-tree renders and measurements, made ONCE per state of
 * the tree and read by every agent, instead of every reviewer rendering ~1,400 frames at several sizes into a folder
 * of its own (2026-11-02: 115,000 PNGs, 37 GB, the mini at a load of 60 to 150).
 *
 *   node tools/sweep.mjs              the art: every frame of every chapter and every Warrior Counts scene, drawn once
 *                                     at 800 x 500 (JPEG), and contact sheets of six (labelled with each frame's id and board)
 *   node tools/sweep.mjs --pages      the real page measured: every frame as it opens, every Taps page tapped through,
 *                                     every Counts keypad after the game's own scroll, the other screens, the Warrior
 *                                     Counts' screens, the take-aways kit's and chapter 12's Spanish screens (run.mjs's
 *                                     `spanish` job, since chapter 12's review: the warm-up's echo page had Next under
 *                                     the screen and no sweep saw it), at 1080x720, 1180x820, 820x1180 and 390x844, Aa
 *                                     off and on;
 *                                     pages/summary.json lists the problems (below)
 *   node tools/sweep.mjs --all        both
 *   node tools/sweep.mjs --takes      the take-aways kit's screens (docs/take-aways.md, section 6) and chapter 12's
 *                                     Spanish screens at the page review's four more sizes, 1080x700, 1024x768,
 *                                     768x1024 and 844x390, Aa off and on
 *                                     (takes/summary.json, the same problems; --pages has them at its own four sizes,
 *                                     in its screens group); with --pages or --all, both. The kit v0.4's screens
 *                                     (decision 57: the moves, a move-help, `ahead`, the marks page) are among them
 *   node tools/sweep.mjs --only ch12  the art of these chapters only (a comma list; `warrior` for its scenes): about
 *                                     30 seconds a chapter, into the same cache (a later whole sweep reuses them)
 *   node tools/sweep.mjs --path       where this tree's cache is and what it holds (builds nothing)
 *   node tools/sweep.mjs --compare DIR   this tree against another (a copy of the live tree, say): the frames whose
 *                                     art differs, the pages whose boxes moved, the problems new and gone; builds
 *                                     whichever of the two caches is missing (both need the same parts: add --pages);
 *                                     with --takes, what a chapter-12-only player sees of the kit (take:first and
 *                                     chapter 12's eight Spanish screens, TAKE_COMPARED) byte for byte: its boxes
 *                                     (the fingerprints) and its markup (`hx`), the other tree measured for those
 *                                     alone (its takes-compare/, unless it has takes/ already)
 *   --root DIR      sweep another tree (default: this repo)      --force   build again even if the cache is there
 *   --wait MIN      how long to wait for another sweep of the same tree to finish (default 60)
 *
 * The cache is ~/potomac-crossing-work/cache/<key>/, the key a hash of the tree's index.html, app/**, fonts/** and
 * tools/shots.mjs (whose page scripts drive the page) and of this renderer's own source (this file, dev/webkit/*).
 * A cache with the key is reused as it is; one being built by another sweep is waited for; a sweep that stopped
 * part-way is picked up where it stopped. clean-work.py keeps the two newest caches; this tool keeps at most four.
 *
 * Gentle on the Mac: ONE WebKit process at a time (dev/webkit/run.mjs; the render lock, tools/lock.mjs, held for
 * one chapter or one size at a time and let go between, so a Safari shot can get in), at a low priority (taskpolicy's
 * utility clamp; this process niced). It takes a while (about 5 minutes for the art, 20 for the pages): run it in the
 * background (Bash's run_in_background; a foreground call stops at 10 minutes) and never kill another agent's.
 *
 * Problems (pages/summary.json `problems`, each { kind, size, aa, at, detail }):
 *   off-screen          a control not on the screen without scrolling as the page opens
 *   off-screen-tapping  a control below the fold at the worst moment of a Taps page tapped through
 *   off-screen-keypad   a control off the screen on a Counts keypad after the game's own scroll
 *   spill               lettering outside its box, or cut by a box that clips it (the panel)
 *   broken-word         a word broken across two lines inside itself
 *   sideways            the page scrolls sideways
 *   page-error          an error in the page, or a step of the run that failed
 *   said-aloud          anything said, Read to me on, or a page that was not silenced before the game booted
 *   col-off             on a take page, the column, the outlined box or the stack's first or last balloon not wholly
 *                       between the bar's bottom and the viewport's (measure.js's `tcol`, `tbox`, `tsf`, `tsb`): the
 *                       controls alone would let a page that pushed its column or its line under the bar pass (the
 *                       first balloon since chapter 12's review: 58 − 23 opened with it under the bar, its last in view)
 *                       The kit v0.4 adds: a small box (.tmini) out of the column or meeting the stack's last
 *                       balloon; a front box (the little 1's) nearer the neighbour's mark than its own digit; the
 *                       slot's balloon (measure.js's `tslot`) off the screen like the rest
 *   keypad-moved        on a take page, the keypad's box not the same at a column and the next (`@next`: the right
 *                       digit typed on the page's own keypad), so a finger could land on the wrong key; or at a move and
 *                       the next (take:lend, take:get: the ringed small box's number typed)
 *   hit-small           a live tap target's hit box (measure.js's `ttgt`, the kit v0.4's [role=button] in the column)
 *                       under 44 x 44
 *   marks-small         the marks page's little 1 (measure.js's `tone`) rendered under 16 px, or not found on it
 * The screens that scroll by design (the hub, the book, My nest, her Case File, the grown-ups corner; chapter 1's
 * look chooser, f011) list their off-screen controls under `scrolls`, not as problems.
 */
import { createHash } from 'crypto';
import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, utimesSync, writeFileSync } from 'fs';
import { homedir, setPriority } from 'os';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { REPO, SIZES, TAKE_SIZES, TAKE_NEXT, TAKE_COMPARED, pageScripts, serve, runJobs, measureJobs, sweepCat, collect, call, fontSteps } from '../dev/webkit/run.mjs';
import { EXIT_LOCKED } from './lock.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const CACHE = process.env.PC_CACHE_DIR || join(homedir(), 'potomac-crossing-work/cache');
export const KEEP = 4;
const ART_W = 800, ART_H = 500, CELL_W = 400, CELL_H = 250, LABEL_H = 34, SHEET_ROWS = 3;
const SHEET_H = SHEET_ROWS * (CELL_H + LABEL_H);
export const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };   // tools/frames.mjs's
const RENDERER = ['tools/sweep.mjs', 'dev/webkit/snap.swift', 'dev/webkit/run.mjs', 'dev/webkit/measure.js'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ the key */
function walk(dir, base, out) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out); else if (e.isFile()) out.push(relative(base, p));
  }
  return out;
}
/* The files of a tree the cache depends on, in a fixed order. */
export function treeFiles(root) {
  return ['index.html', 'tools/shots.mjs'].filter((f) => existsSync(join(root, f))).concat(walk(join(root, 'app'), root, []), walk(join(root, 'fonts'), root, []));
}
/* The cache key: the tree's files (names and bytes) and the renderer's own source. */
export function cacheKey(root, renderer = REPO) {
  const h = createHash('sha256');
  for (const f of treeFiles(root)) h.update('tree:' + f + '\0').update(readFileSync(join(root, f))).update('\0');
  for (const f of RENDERER) h.update('tool:' + f + '\0').update(readFileSync(join(renderer, f))).update('\0');
  h.update('look:' + JSON.stringify(LOOK) + ' sizes:' + SIZES.join(','));
  return h.digest('hex').slice(0, 16);
}
export const cacheDir = (key) => join(CACHE, key);

/* A group's art is drawn when its index is there with every picture it lists (a cache thinned by hand is drawn again). */
export function groupDone(dir, g) {
  try { const e = JSON.parse(readFileSync(join(dir, 'art', g, 'index.json'), 'utf8')); return e.frames.concat(e.sheets).every((x) => existsSync(join(dir, 'art', x.jpg))); } catch { return false; }
}
/* What a cache holds: { art: done or not, groups: the groups drawn, pages: done or not, building: pid or null }. */
export function status(dir) {
  const read = (f) => { try { return JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch { return null; } };
  const b = read('building/holder.json'), top = read('art/index.json');
  const groups = existsSync(join(dir, 'art')) ? readdirSync(join(dir, 'art')).filter((g) => groupDone(dir, g)) : [];
  return { art: !!top && top.groups.every((g) => groups.includes(g.id)), groups, pages: existsSync(join(dir, 'pages/summary.json')), takes: existsSync(join(dir, 'takes/summary.json')), building: b && alive(b.pid) ? b : null, tree: read('tree.json') };
}
function alive(pid) { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } }
const atomicWrite = (file, data) => { const tmp = file + '.part-' + process.pid; writeFileSync(tmp, data); renameSync(tmp, file); };

/* ------------------------------------------------------------------ what the tree holds (a child process: two trees never share a PC) */
function enumerate(root) {
  const js = `const PC = require(${JSON.stringify(join(root, 'tests/_load.js'))}).load();
    const chapters = Object.keys(PC.story).map((id) => ({ id, title: PC.story[id].title || '', number: PC.story[id].number,
      frames: Object.keys(PC.story[id].frames).filter((f) => PC.story[id].frames[f].scene).map((f) => ({ id: f, board: String(PC.story[id].frames[f].board || '').replace(/\\s+/g, ' ') })) }));
    // the Warrior Counts: every scene object PC.warrior holds, once each, named by where it was first found
    const warrior = [], seen = new Set();
    (function walk(o, path) {
      if (!o || typeof o !== 'object' || seen.has(o)) return;
      seen.add(o);
      if (typeof o.set === 'string' && o.cam) { warrior.push({ path, board: '' }); return; }
      if (o.scene && typeof o.scene === 'object' && !seen.has(o.scene)) { seen.add(o.scene); warrior.push({ path: path.concat('scene'), board: String(o.board || '').replace(/\\s+/g, ' ') }); }
      for (const k of Object.keys(o)) if (k !== 'scene') walk(o[k], path.concat(k));
    })(PC.warrior || null, []);
    process.stdout.write(JSON.stringify({ chapters, warrior: warrior.map((w) => ({ id: w.path.join('.').replace(/\\.scene$/, '').replace(/[^A-Za-z0-9.-]+/g, '-') || 'scene', path: w.path, board: w.board })) }));`;
  return JSON.parse(execFileSync(process.execPath, ['-e', js], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 }));
}

/* ------------------------------------------------------------------ the art */
const STAGE = `document.documentElement.style.cssText = 'margin:0;padding:0;overflow:hidden;background:#2b2347';
  document.body.innerHTML = ''; document.body.style.cssText = 'margin:0;padding:0;overflow:hidden;background:#2b2347';
  var st = document.createElement('div'); st.id = 'pc-stage';
  st.style.cssText = 'position:fixed;left:0;top:0;width:${ART_W}px;height:${ART_H}px;overflow:hidden;background:#2b2347';
  document.body.appendChild(st);
  var look = arguments[0];
  window.__art = function (ch, id, path) {
    var f = null;
    if (ch === 'warrior') { var o = PC.warrior; path.forEach(function (k) { o = o && o[k]; }); f = { scene: o }; }
    else f = PC.story[ch] && PC.story[ch].frames[id];
    if (!f || !f.scene) return 'no scene ' + ch + ':' + id;
    st.style.display = ''; var sh = document.getElementById('pc-sheet'); if (sh) sh.remove();
    st.innerHTML = PC.art.render(f.scene, { look: look }).svg;
    st.firstChild.setAttribute('width', '${ART_W}'); st.firstChild.setAttribute('height', '${ART_H}');
    return true;
  };
  window.__sheet = function (cells) {
    st.style.display = 'none';
    var old = document.getElementById('pc-sheet'); if (old) old.remove();
    var s = document.createElement('div'); s.id = 'pc-sheet';
    s.style.cssText = 'position:fixed;left:0;top:0;width:${2 * CELL_W}px;height:${SHEET_H}px;background:#fff;font:12px/15px -apple-system,Helvetica,sans-serif;color:#111';
    cells.forEach(function (c, i) {
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;left:' + (i % 2) * ${CELL_W} + 'px;top:' + Math.floor(i / 2) * ${CELL_H + LABEL_H} + 'px;width:${CELL_W}px;height:${CELL_H + LABEL_H}px;overflow:hidden;box-sizing:border-box;border:1px solid #fff';
      var im = document.createElement('img'); im.src = c.src; im.style.cssText = 'display:block;width:${CELL_W - 2}px;height:${CELL_H - 2}px';
      var l = document.createElement('div'); l.style.cssText = 'height:${LABEL_H - 4}px;padding:1px 4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical';
      var b = document.createElement('b'); b.textContent = c.id + ' '; l.appendChild(b); l.appendChild(document.createTextNode(c.board || ''));
      d.appendChild(im); d.appendChild(l); s.appendChild(d);
    });
    document.body.appendChild(s);
    return true;
  };
  window.__sheetReady = function () { var ims = document.querySelectorAll('#pc-sheet img'); for (var i = 0; i < ims.length; i++) if (!ims[i].complete) return 'pending'; for (var j = 0; j < ims.length; j++) if (!ims[j].naturalWidth) return 'a picture did not load: ' + ims[j].src; return true; };
  return true;`;

async function buildArt(root, dir, S, tree, log, only) {
  const art = join(dir, 'art');
  mkdirSync(art, { recursive: true });
  const every = tree.chapters.filter((c) => c.frames.length).map((c) => ({ id: c.id, title: c.title, frames: c.frames.map((f) => ({ id: f.id, board: f.board })) }));
  if (tree.warrior.length) every.push({ id: 'warrior', title: 'The Warrior Counts', frames: tree.warrior });
  const unknown = (only || []).filter((id) => !every.some((g) => g.id === id));
  if (unknown.length) throw new Error('--only: no ' + unknown.join(', ') + ' in this tree (it has ' + every.map((g) => g.id).join(', ') + ')');
  const groups = only ? every.filter((g) => only.includes(g.id)) : every;
  const srv = await serve(root, S.SILENT, { '/__art/': art });
  const index = [];
  try {
    for (const g of groups) {
      const gd = join(art, g.id), done = join(gd, 'index.json');
      if (groupDone(dir, g.id)) { index.push(JSON.parse(readFileSync(done, 'utf8'))); continue; }
      rmSync(gd, { recursive: true, force: true }); mkdirSync(gd, { recursive: true });
      // every font face loaded first: a sound effect's lettering (a 'purrr') drawn before its font came is a different picture
      const steps = [{ js: call(S.STILL), wait: 0.05 }].concat(fontSteps(), [{ js: call(STAGE, [LOOK]), wait: 0.1 }]);
      for (const f of g.frames) steps.push({ js: call('return window.__art(arguments[0], arguments[1], arguments[2]);', [g.id, f.id, f.path || null]), wait: 0.03, out: join(gd, f.id + '.jpg'), rect: [0, 0, ART_W, ART_H] });
      const sheets = [];
      for (let i = 0; i < g.frames.length; i += 2 * SHEET_ROWS) {
        const six = g.frames.slice(i, i + 2 * SHEET_ROWS), name = 'sheet-' + String(sheets.length + 1).padStart(2, '0') + '.jpg';
        sheets.push({ jpg: name, frames: six.map((f) => f.id) });
        steps.push({ js: call('return window.__sheet(arguments[0]);', [six.map((f) => ({ id: f.id, board: f.board.slice(0, 160), src: '/__art/' + g.id + '/' + f.id + '.jpg' }))]), wait: 0.05 },
          { js: call('return window.__sheetReady();'), wait: 0.05, out: join(gd, name), rect: [0, 0, 2 * CELL_W, Math.ceil(six.length / 2) * (CELL_H + LABEL_H)] });
      }
      const t0 = Date.now();
      const run = await runJobs({ width: ART_W, height: SHEET_H, silent: S.SILENT, jobs: [{ url: srv.site + '?art-' + g.id, out: '', steps }] }, { what: 'tools/sweep.mjs art ' + g.id, dir: gd });
      const errs = run.jobs[0].errors.map(([k, v]) => 'step ' + k + ': ' + v).concat(run.jobs[0].results.map(([k, v]) => 'step ' + k + ': ' + v), run.jobs[0].missing, run.warn);
      const missing = g.frames.filter((f) => !existsSync(join(gd, f.id + '.jpg'))).map((f) => f.id);
      if (run.code !== 0 || missing.length) throw new Error('art ' + g.id + ': ' + (missing.length ? missing.length + ' frames not drawn (' + missing.slice(0, 5).join(' ') + '…); ' : '') + 'exit ' + run.code + '; ' + errs.slice(0, 5).join(' | '));
      const entry = { id: g.id, title: g.title, frames: g.frames.map((f) => ({ id: f.id, jpg: g.id + '/' + f.id + '.jpg', board: f.board })), sheets: sheets.map((s) => ({ jpg: g.id + '/' + s.jpg, frames: s.frames })), notes: errs, secs: Math.round((Date.now() - t0) / 1000) };
      const md = ['# ' + g.id + (g.title ? ': ' + g.title : '') + ' (' + g.frames.length + ' frames, ' + sheets.length + ' contact sheets of six)', ''];
      for (const s of sheets) md.push('- ' + s.jpg + ': ' + s.frames.join(' '));
      md.push('', 'Frames (each `<id>.jpg`, 800 x 500, the art only: no lettering):', '');
      for (const f of g.frames) md.push('- ' + f.id + ': ' + (f.board || '(no board)').slice(0, 200));
      writeFileSync(join(gd, 'index.md'), md.join('\n') + '\n');
      atomicWrite(done, JSON.stringify(entry));
      index.push(entry);
      log('art ' + g.id + ': ' + g.frames.length + ' frames, ' + sheets.length + ' sheets in ' + entry.secs + ' s');
      await sleep(1500);   // let a waiting Safari shot or frames render have the lock
    }
  } finally { await srv.close(); }
  if (only) { for (const id of only) log('art ' + id + ': ' + join(art, id, 'index.md')); if (!every.every((g) => groupDone(dir, g.id))) return; }
  const md = ['# The art, every frame (the cache ' + dir + ')', '', 'Each chapter has a folder: `<frame>.jpg` (800 x 500, the art only, the player a calico tom as in tools/frames.mjs), `sheet-NN.jpg` (six a sheet, each labelled with its frame id and board) and `index.md` (which sheet holds which frame).', ''];
  for (const e of index) md.push('- ' + e.id + (e.title ? ' (' + e.title + ')' : '') + ': ' + e.frames.length + ' frames, ' + e.sheets.length + ' sheets');
  writeFileSync(join(art, 'index.md'), md.join('\n') + '\n');
  atomicWrite(join(art, 'index.json'), JSON.stringify({ groups: index.map((e) => ({ id: e.id, title: e.title, frames: e.frames.length, sheets: e.sheets.length })), look: LOOK, size: [ART_W, ART_H] }));
}

/* ------------------------------------------------------------------ the pages */
const SCROLLS = { 'ch01:f011': 'the look chooser scrolls by design', 'screen:hub': 'the hub scrolls', 'screen:book': 'the book scrolls', 'screen:nest': 'My nest scrolls', 'screen:file': 'her Case File scrolls', 'screen:corner': 'the grown-ups corner scrolls' };
// (the screens group runs chapter 12's Spanish screens too, run.mjs's `spanish` job, since chapter 12's review: the warm-up's
// echo page had Next under the screen and only a separate run found it)
const GROUPS = [['plain', ['plain']], ['taps', ['taps', 'lessons']], ['screens', ['screens', 'warrior', 'takes', 'spanish']]];
// the take-aways kit's screens and chapter 12's Spanish screens at the page review's four more sizes (--takes): their own
// folder, `takes/`
const TAKES_RUN = { sub: 'takes', sizes: TAKE_SIZES, groups: [['takes', ['takes', 'spanish']]], title: 'The take-aways kit’s and chapter 12’s Spanish screens at the page review’s four more sizes' };
// another tree's TAKE_COMPARED alone (take:first and chapter 12's eight Spanish screens), for `--takes --compare`: its own
// folder, `takes-compare/`, so a partial run is never read as that tree's takes/
const TAKES_COMPARE_RUN = { sub: 'takes-compare', sizes: TAKE_SIZES, groups: [['takes', ['takes', 'spanish']]], screens: { takeScreens: TAKE_COMPARED.filter((t) => !/^es:/.test(t)), esScreens: TAKE_COMPARED.filter((t) => /^es:/.test(t)) },
  title: 'What a chapter-12-only player sees of the kit (take:first and chapter 12’s eight Spanish screens), for a compare' };
const VARIES = /^warrior:(q|sand|notyet|afterpass)\b/;

/* The pages measured (`pages/`, the four SIZES, every group), or the take screens at the review's four more sizes
 * (`takes/`, TAKES_RUN): a run a size, an Aa and a group, each kept as it lands so a stopped sweep picks up there. */
async function buildPages(root, dir, S, log, { sub = 'pages', sizes = SIZES, groups = GROUPS, title, screens = {} } = {}) {
  const pages = join(dir, sub);
  mkdirSync(pages, { recursive: true });
  const srv = await serve(root, S.SILENT);
  const cat = sweepCat(S);
  try {
    for (const size of sizes) for (const big of [false, true]) for (const [g, what] of groups) {
      const file = join(pages, size + '-aa' + (big ? 1 : 0) + '-' + g + '.json');
      if (existsSync(file)) continue;
      const [W, H] = size.split('x').map(Number);
      const jobs = measureJobs(S, srv.site, what, Object.assign({ aas: [big], cat }, screens));
      // (a tree with no take screens, measured for them: nothing to run, an empty record)
      const run = jobs.length ? await runJobs({ width: W, height: H, silent: S.SILENT, jobs }, { what: 'tools/sweep.mjs ' + sub + ' ' + size + ' Aa ' + (big ? 'on' : 'off') + ' ' + g, dir: pages }) : { jobs: [], warn: [], code: 0, secs: 0 };
      const res = collect(jobs, run);
      if (run.code !== 0 && !res.some((r) => r.rows || r.ms)) throw new Error(sub + ' ' + size + ' ' + g + ': WebKit exit ' + run.code + '; ' + run.warn.join(' | '));
      atomicWrite(file, JSON.stringify({ size: [W, H], big, group: g, secs: run.secs, warn: run.warn, code: run.code, jobs: res }));
      log(sub + ' ' + size + ' Aa ' + (big ? 'on ' : 'off') + ' ' + g + ': ' + res.reduce((n, r) => n + ((r.rows || r.ms || []).length), 0) + ' measured in ' + run.secs + ' s');
      if (jobs.length) await sleep(1500);
    }
  } finally { await srv.close(); }
  const summary = summarize(pages, sizes);
  writeFileSync(join(pages, 'summary.md'), summaryMd(summary, dir, title) + '\n');
  atomicWrite(join(pages, 'summary.json'), JSON.stringify(summary, null, 1));
  return summary;
}

/* Every measured row, as { size, aa, job, row }. */
function rowsOf(pages) {
  const out = [];
  for (const f of readdirSync(pages).filter((x) => /^\d+x\d+-aa[01]-\w+\.json$/.test(x)).sort()) {
    const d = JSON.parse(readFileSync(join(pages, f), 'utf8')), size = d.size.join('x'), aa = d.big ? 'on' : 'off';
    for (const j of d.jobs) {
      for (const n of j.notes) out.push({ size, aa, job: j.name, note: n });
      for (const r of j.rows || j.ms || []) out.push({ size, aa, job: j.name, row: r });
    }
  }
  return out;
}
/* A take page's column, outlined box and stack's first and last balloons (measure.js's `tcol`, `tbox`, `tsf`, `tsb`; a
 * one-balloon stack's first is its last, said once), and the kit v0.4's slot balloon (`tslot`, said only when it is not
 * the stack's last), not wholly between
 * the bar's bottom (`tbar`) and the viewport's: each as a line ("the column 30-180: 18px under the bar"). A take page
 * with no column shown says so (not the marks page, `tpick`, which shows pictures in its place). The kit v0.4's small
 * boxes (`tmini`): one out of the column, one meeting the stack's last balloon, a front box nearer the neighbour's mark
 * (`nb`) than its own digit (`own`). Nothing for a row that is neither a take page nor a marks page. */
const same = (a, b) => Array.isArray(a) && Array.isArray(b) && a.every((v, i) => v === b[i]);
// the gap between two boxes, px (0 when they touch or overlap)
export const boxGap = (a, b) => Math.round(Math.hypot(Math.max(0, b[0] - a[2], a[0] - b[2]), Math.max(0, b[1] - a[3], a[1] - b[3])));
export function colOff(r) {
  if (!r || !(r.take || r.tcol || r.tpick)) return [];
  const out = [], top = Math.max(0, r.tbar || 0);
  if (r.take && !r.tcol && !r.tpick) out.push('no column (.tcol) shown on the take page');
  for (const [k, what] of [['tcol', 'the column'], ['tbox', 'the outlined box'], ['tsf', 'the stack’s first balloon'], ['tsb', 'the stack’s last balloon'], ['tslot', 'the slot’s balloon']]) {
    const b = r[k];
    if (!Array.isArray(b)) continue;
    if ((k === 'tsf' || k === 'tslot') && same(b, r.tsb)) continue;
    const f = [];
    if (b[1] < top - 0.5) f.push((top - b[1]) + 'px under the bar');
    if (b[3] > r.vh + 0.5) f.push((b[3] - r.vh) + 'px below the fold');
    if (b[0] < -0.5 || b[2] > r.vw + 0.5) f.push('off the screen sideways');
    if (f.length) out.push(what + ' ' + b[1] + '-' + b[3] + ': ' + f.join(', '));
  }
  for (const x of Array.isArray(r.tmini) ? r.tmini : []) {
    const b = x && x.b;
    if (!Array.isArray(b)) continue;
    const what = (x.front ? 'the front box' : 'the small box') + (x.on ? ' (ringed)' : '') + ' ' + b[0] + ',' + b[1] + '-' + b[2] + ',' + b[3];
    const c = r.tcol;
    if (Array.isArray(c) && (b[0] < c[0] - 0.5 || b[1] < c[1] - 0.5 || b[2] > c[2] + 0.5 || b[3] > c[3] + 0.5)) {
      const f = [];
      if (b[1] < c[1] - 0.5) f.push((c[1] - b[1]) + 'px above'); if (b[3] > c[3] + 0.5) f.push((b[3] - c[3]) + 'px below');
      if (b[0] < c[0] - 0.5) f.push((c[0] - b[0]) + 'px left'); if (b[2] > c[2] + 0.5) f.push((b[2] - c[2]) + 'px right');
      out.push(what + ': out of the column (' + f.join(', ') + ')');
    }
    const t = r.tsb;
    if (Array.isArray(t) && b[0] < t[2] && t[0] < b[2] && b[1] < t[3] && t[1] < b[3]) out.push(what + ': meets the stack’s last balloon ' + t[1] + '-' + t[3]);
    if (x.front && Array.isArray(x.own) && Array.isArray(x.nb) && boxGap(b, x.nb) < boxGap(b, x.own)) out.push(what + ': nearer the neighbour’s mark (' + boxGap(b, x.nb) + 'px) than its own digit (' + boxGap(b, x.own) + 'px)');
  }
  return out;
}
/* The kit v0.4's live tap targets (measure.js's `ttgt`) whose hit box is under 44 x 44: each as a line. */
export function hitSmall(r) {
  return (r && Array.isArray(r.ttgt) ? r.ttgt : []).filter((g) => g && g.live && Array.isArray(g.b) && (g.b[2] - g.b[0] < 44 || g.b[3] - g.b[1] < 44))
    .map((g) => (g.n ? '“' + g.n + '”' : 'a target') + ' ' + (g.b[2] - g.b[0]) + ' x ' + (g.b[3] - g.b[1]) + ' at ' + g.b[0] + ',' + g.b[1] + ': under 44 x 44');
}
/* The marks page's little 1 (measure.js's `tone`) rendered under 16 px, or not found on a marks page (`tpick`). */
export function marksSmall(r) {
  if (!r || !Array.isArray(r.tpick)) return [];
  if (!r.tone) return ['no little 1 found in the marks page’s “A little 1 in front” picture (a [class*="front"] 1, or a lone 1 that is no digit or box)'];
  return r.tone.fs < 16 - 0.05 ? ['the little 1 is ' + r.tone.fs + 'px: under 16px'] : [];
}
/* The keypad at a column and at the next (`<screen>` and `<screen>@next`, measured in one page): the same box, or what
 * moved. Null when it stayed put. `step`: 'column' (the default), or 'move' (the kit v0.4's take:lend and take:get). */
export function keypadMoved(before, after, step = 'column') {
  if (!before || !after) return null;
  if (!Array.isArray(before.kp) || !Array.isArray(after.kp)) return 'no keypad ' + (!Array.isArray(before.kp) ? 'at the first ' + step : 'at the next ' + step);
  if (before.kp.every((v, i) => v === after.kp[i])) return null;
  return 'the keypad moved from ' + before.kp[1] + '-' + before.kp[3] + ' (x ' + before.kp[0] + '-' + before.kp[2] + ') to ' + after.kp[1] + '-' + after.kp[3] + ' (x ' + after.kp[0] + '-' + after.kp[2] + ') between one ' + step + ' and the next';
}
export function summarize(pages, sizes = SIZES) {
  const problems = [], scrolls = [], counts = {};
  const add = (kind, size, aa, at, detail) => { problems.push({ kind, size, aa, at, detail }); counts[kind] = (counts[kind] || 0) + 1; };
  let measured = 0;
  const all = rowsOf(pages), seen = new Map();
  for (const x of all) if (x.row && x.row.t) seen.set(x.size + ' ' + x.aa + ' ' + x.row.t, x.row);
  for (const x of all) {
    if (x.note) { add('page-error', x.size, x.aa, x.job, x.note); continue; }
    const r = x.row, at = r.t, base = String(at).replace(/@.*$/, '');
    measured++;
    if (r.err) { add('page-error', x.size, x.aa, at, r.err); continue; }
    const offKind = /@tapped$/.test(at) ? 'off-screen-tapping' : /@lesson$/.test(at) ? 'off-screen-keypad' : 'off-screen';
    if (r.bad && r.bad.length) { if (SCROLLS[base]) scrolls.push({ size: x.size, aa: x.aa, at, why: SCROLLS[base], controls: r.bad.length }); else add(offKind, x.size, x.aa, at, r.bad.join(' ')); }
    if (r.worst && r.worst[0] < 0) add('off-screen-tapping', x.size, x.aa, at, r.worst[1] + ' ' + -r.worst[0] + 'px below the fold at the worst moment');
    for (const s of r.spill || []) add('spill', x.size, x.aa, at, s);
    for (const b of r.broken || []) add('broken-word', x.size, x.aa, at, b);
    if (r.sw > r.vw + 1) add('sideways', x.size, x.aa, at, 'the page is ' + r.sw + 'px wide in a ' + r.vw + 'px screen');
    if (r.errs) add('page-error', x.size, x.aa, at, r.errs + ' error(s) in the page');
    if (r.said || r.read || r.silent === false) add('said-aloud', x.size, x.aa, at, 'said ' + r.said + ', Read to me ' + (r.read ? 'on' : 'off') + ', silenced ' + r.silent);
    // the take-aways kit's page: its column and its line on the screen, and the keypad put at the next column
    for (const c of colOff(r)) add('col-off', x.size, x.aa, at, c);
    if (/@next$/.test(at)) { const kp = keypadMoved(seen.get(x.size + ' ' + x.aa + ' ' + base), r, TAKE_NEXT[base] && TAKE_NEXT[base] !== 'column' ? 'move' : 'column'); if (kp) add('keypad-moved', x.size, x.aa, base, kp); }
    // the kit v0.4: a live target too small for a finger; the marks page's little 1 under the marks' floor
    for (const c of hitSmall(r)) add('hit-small', x.size, x.aa, at, c);
    for (const c of marksSmall(r)) add('marks-small', x.size, x.aa, at, c);
  }
  return { measured, sizes, counts, problems, scrolls };
}
function summaryMd(s, dir, title) {
  const md = ['# ' + (title || 'The pages, measured') + ' (' + dir + ')', '', s.measured + ' pages measured at ' + s.sizes.join(', ') + ', Aa off and on. Problems: ' + (s.problems.length ? Object.entries(s.counts).map(([k, n]) => k + ' ' + n).join(', ') : 'none') + '.', ''];
  const by = {};
  for (const p of s.problems) (by[p.kind] = by[p.kind] || []).push(p);
  for (const [k, list] of Object.entries(by)) {
    md.push('## ' + k + ' (' + list.length + ')', '');
    for (const p of list.slice(0, 200)) md.push('- ' + p.size + ' Aa ' + p.aa + ' ' + p.at + ': ' + p.detail);
    if (list.length > 200) md.push('- … ' + (list.length - 200) + ' more in summary.json');
    md.push('');
  }
  return md.join('\n');
}

/* ------------------------------------------------------------------ comparing two caches */
export function compareCaches(a, b) {
  const out = { a, b, art: null, pages: null, takes: null };
  if (existsSync(join(a, 'art/index.json')) && existsSync(join(b, 'art/index.json'))) {
    const list = (d) => { const m = new Map(); for (const g of readdirSync(join(d, 'art'))) { const f = join(d, 'art', g, 'index.json'); if (existsSync(f)) for (const fr of JSON.parse(readFileSync(f, 'utf8')).frames) m.set(g + ':' + fr.id, join(d, 'art', fr.jpg)); } return m; };
    const A = list(a), B = list(b);
    const differ = [], only = [], gone = [];
    for (const [k, p] of A) { if (!B.has(k)) only.push(k); else if (!readFileSync(p).equals(readFileSync(B.get(k)))) differ.push(k); }
    for (const k of B.keys()) if (!A.has(k)) gone.push(k);
    out.art = { frames: A.size, differ, onlyHere: only, onlyThere: gone };
  }
  if (existsSync(join(a, 'pages/summary.json')) && existsSync(join(b, 'pages/summary.json'))) {
    const idx = (d) => { const m = new Map(); for (const x of rowsOf(join(d, 'pages'))) if (x.row) m.set(x.size + ' ' + x.aa + ' ' + x.row.t, x.row); return m; };
    // the Warrior Counts' question, sand and result screens draw a new sitting each run (the engine seeds it with the
    // clock): their boxes differ run to run, so they are listed apart (look at them; a difference there means nothing)
    const A = idx(a), B = idx(b), moved = [], panel = [], varies = [];
    for (const [k, r] of A) {
      const o = B.get(k); if (!o) continue;
      if (VARIES.test(r.t)) { if (o.fp !== r.fp || o.pfp !== r.pfp) varies.push(k); continue; }
      if (o.fp !== r.fp) moved.push(k); if (o.pfp !== r.pfp) panel.push(k);
    }
    const key = (p) => p.kind + ' ' + p.size + ' ' + p.aa + ' ' + p.at + ' ' + p.detail;
    const pa = JSON.parse(readFileSync(join(a, 'pages/summary.json'), 'utf8')).problems, pb = JSON.parse(readFileSync(join(b, 'pages/summary.json'), 'utf8')).problems;
    const sb = new Set(pb.map(key)), sa = new Set(pa.map(key));
    out.pages = { boxesMoved: moved, panelChanged: panel, variesRunToRun: varies, newProblems: pa.filter((p) => !sb.has(key(p))), goneProblems: pb.filter((p) => !sa.has(key(p))) };
  }
  // (--takes: what a chapter-12-only player sees of the kit, TAKE_COMPARED, byte for byte: this tree's takes/ against the
  // other's takes-compare/, or its takes/; each row the same when its boxes (fp, pfp) and its markup (hx) are)
  const theirs = existsSync(join(b, 'takes-compare/summary.json')) ? join(b, 'takes-compare') : existsSync(join(b, 'takes/summary.json')) ? join(b, 'takes') : null;
  if (existsSync(join(a, 'takes/summary.json')) && theirs) {
    const idx = (d) => { const m = new Map(); for (const x of rowsOf(d)) if (x.row && TAKE_COMPARED.includes(x.row.t)) m.set(x.size + ' ' + x.aa + ' ' + x.row.t, x.row); return m; };
    const A = idx(join(a, 'takes')), B = idx(theirs), boxes = [], markup = [], here = [], there = [];
    let same = 0;
    for (const [k, r] of A) {
      const o = B.get(k);
      if (!o) { here.push(k); continue; }
      const moved = o.fp !== r.fp || o.pfp !== r.pfp;
      if (moved) boxes.push(k); else if (o.hx !== r.hx) markup.push(k); else same++;
    }
    for (const k of B.keys()) if (!A.has(k)) there.push(k);
    out.takes = { screens: TAKE_COMPARED, against: theirs, rows: A.size, same, boxesMoved: boxes, markupChanged: markup, onlyHere: here, onlyThere: there };
  }
  return out;
}

/* ------------------------------------------------------------------ one tree's cache, built as asked */
async function ensure(root, want, { force, waitMin, log }) {
  const key = cacheKey(root), dir = cacheDir(key);
  mkdirSync(dir, { recursive: true });
  const artDone = () => (want.only ? want.only.every((g) => groupDone(dir, g)) : status(dir).art);
  // (`takesCompare`: another tree's TAKE_COMPARED alone, for a compare, unless its takes/ has them already)
  const need = () => ({ art: want.art && !artDone(), pages: want.pages && !status(dir).pages, takes: !!want.takes && !status(dir).takes,
    takesCompare: !!want.takesCompare && !status(dir).takes && !existsSync(join(dir, 'takes-compare/summary.json')) });
  const none = () => { const n = need(); return !n.art && !n.pages && !n.takes && !n.takesCompare; };
  if (force) {
    if (want.art) { if (want.only) { for (const g of want.only) rmSync(join(dir, 'art', g), { recursive: true, force: true }); rmSync(join(dir, 'art/index.json'), { force: true }); } else rmSync(join(dir, 'art'), { recursive: true, force: true }); }
    if (want.pages) rmSync(join(dir, 'pages'), { recursive: true, force: true });
    if (want.takes) rmSync(join(dir, 'takes'), { recursive: true, force: true });
    if (want.takesCompare) rmSync(join(dir, 'takes-compare'), { recursive: true, force: true });
  }
  log('cache: ' + dir);
  // a cache in use is a new one, to the pruning here and to clean-work.py
  if (existsSync(join(dir, 'tree.json'))) { const t = new Date(); try { utimesSync(join(dir, 'tree.json'), t, t); } catch {} }
  if (none()) return dir;
  // one builder a tree: another sweep of it is waited for (it may finish what we need), a dead one taken over
  const lock = join(dir, 'building');
  const t0 = Date.now();
  let told = 0;
  for (;;) {
    try { mkdirSync(lock); writeFileSync(join(lock, 'holder.json'), JSON.stringify({ pid: process.pid, since: new Date().toISOString(), want })); break; } catch (e) { if (e.code !== 'EEXIST') throw e; }
    let h = null; try { h = JSON.parse(readFileSync(join(lock, 'holder.json'), 'utf8')); } catch {}
    if (h ? !alive(h.pid) : Date.now() - statSync(lock).mtimeMs > 10000) { rmSync(lock, { recursive: true, force: true }); log('another sweep of this tree stopped part-way: picking it up'); continue; }
    if ((Date.now() - t0) / 60000 > waitMin) { console.error('sweep: another sweep of this tree (pid ' + (h && h.pid) + ') is still building ' + dir + ' after ' + waitMin + ' min; try again later'); process.exit(EXIT_LOCKED); }
    if (Date.now() - told > 60000) { told = Date.now(); log('another sweep of this tree (pid ' + (h && h.pid) + ') is building it; waiting (' + progress(dir) + ')'); }
    await sleep(3000);
    if (none()) return dir;
  }
  const release = () => rmSync(lock, { recursive: true, force: true });
  process.on('exit', release);
  try {
    const n = need();
    if (none()) return dir;
    const S = pageScripts(root);
    if (!existsSync(join(dir, 'tree.json'))) writeFileSync(join(dir, 'tree.json'), JSON.stringify({ key, root, files: treeFiles(root).length, made: new Date().toISOString() }) + '\n');
    const t1 = Date.now();
    if (n.art) await buildArt(root, dir, S, enumerate(root), log, want.only);
    if (n.pages) {
      const s = await buildPages(root, dir, S, log);
      log('pages: ' + s.measured + ' measured; problems: ' + (s.problems.length ? Object.entries(s.counts).map(([k, v]) => k + ' ' + v).join(', ') : 'none') + ' (pages/summary.md)');
    }
    for (const [k, run] of [['takes', TAKES_RUN], ['takesCompare', TAKES_COMPARE_RUN]]) {
      if (!n[k]) continue;
      const s = await buildPages(root, dir, S, log, run);
      log(run.sub + ': ' + s.measured + ' measured at ' + TAKE_SIZES.join(', ') + '; problems: ' + (s.problems.length ? Object.entries(s.counts).map(([k, v]) => k + ' ' + v).join(', ') : 'none') + ' (' + run.sub + '/summary.md)');
    }
    log('built in ' + Math.round((Date.now() - t1) / 1000) + ' s');
    // the tree must not have changed under the sweep, or the cache would lie about it
    if (cacheKey(root) !== key) { rmSync(dir, { recursive: true, force: true }); console.error('sweep: the tree changed while it was swept; nothing kept. Run it again when the tree is still.'); process.exit(1); }
    prune(dir);
    return dir;
  } finally { release(); process.removeListener('exit', release); }
}
function progress(dir) {
  const a = status(dir).groups.length;
  const p = existsSync(join(dir, 'pages')) ? readdirSync(join(dir, 'pages')).filter((f) => /-aa[01]-\w+\.json$/.test(f)).length : 0;
  const t = existsSync(join(dir, 'takes')) ? readdirSync(join(dir, 'takes')).filter((f) => /-aa[01]-\w+\.json$/.test(f)).length : 0;
  return 'art: ' + a + ' chapters done; pages: ' + p + ' of ' + SIZES.length * 2 * GROUPS.length + ' runs' + (t ? '; takes: ' + t + ' of ' + TAKE_SIZES.length * 2 + ' runs' : '');
}
/* Keep the newest KEEP caches (and any being built). */
function prune(keep) {
  if (!existsSync(CACHE)) return;
  // a complete cache (art and pages) is kept before a partial one (an integrator's `--only` runs), so iterating on one
  // chapter never pushes out the live tree's full cache; then newest first
  const full = (d) => (existsSync(join(d, 'art', 'index.json')) ? 1 : 0) + (existsSync(join(d, 'pages', 'summary.json')) ? 1 : 0);
  const all = readdirSync(CACHE).map((k) => join(CACHE, k)).filter((d) => existsSync(join(d, 'tree.json')))
    .sort((x, y) => full(y) - full(x) || statSync(join(y, 'tree.json')).mtimeMs - statSync(join(x, 'tree.json')).mtimeMs);
  for (const d of all.slice(KEEP)) if (d !== keep && !status(d).building) { rmSync(d, { recursive: true, force: true }); console.error('sweep: removed an old cache, ' + d); }
}

/* ------------------------------------------------------------------ the command */
async function main() {
  const argv = process.argv.slice(2);
  const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const root = resolve(opt('--root') || REPO);
  if (!existsSync(join(root, 'index.html'))) { console.error('sweep: no index.html in ' + root); process.exit(2); }
  const all = argv.includes('--all');
  const only = opt('--only') ? opt('--only').split(',').filter(Boolean) : null;
  const takes = argv.includes('--takes');
  const want = { art: all || (!argv.includes('--pages') && !takes) || !!only, pages: all || argv.includes('--pages'), takes, only };
  const log = (s) => console.log(s);
  if (argv.includes('--path')) {
    const dir = cacheDir(cacheKey(root)), s = status(dir);
    console.log(dir);
    console.log('art: ' + (s.art ? 'ready (' + join(dir, 'art/index.md') + ')' : s.groups.length ? 'only ' + s.groups.join(', ') + ' (' + join(dir, 'art') + ')' : 'not built') + '; pages: ' + (s.pages ? 'ready (' + join(dir, 'pages/summary.md') + ')' : 'not built') +
      (s.takes ? '; takes: ready (' + join(dir, 'takes/summary.md') + ')' : '') + (s.building ? '; being built by pid ' + s.building.pid + ' (' + progress(dir) + ')' : ''));
    return;
  }
  try { setPriority(10); } catch {}
  const waitMin = +(opt('--wait') || 60);
  try {
    const dir = await ensure(root, want, { force: argv.includes('--force'), waitMin, log });
    const other = opt('--compare');
    if (other) {
      const o = resolve(other);
      if (!existsSync(join(o, 'index.html'))) { console.error('sweep: --compare needs a tree (a folder with index.html): ' + o); process.exit(2); }
      // (the other tree's take screens: only what a chapter-12-only player sees, TAKE_COMPARED, and only with --takes)
      const odir = await ensure(o, Object.assign({}, want, { takes: false, takesCompare: !!want.takes }), { force: false, waitMin, log });
      const c = compareCaches(dir, odir);
      const file = join(dir, 'compare-' + cacheKey(o) + '.json');
      writeFileSync(file, JSON.stringify(c, null, 1));
      if (c.art) log('art against ' + o + ': ' + c.art.differ.length + ' of ' + c.art.frames + ' frames differ' + (c.art.differ.length ? ' (' + c.art.differ.slice(0, 30).join(' ') + (c.art.differ.length > 30 ? ' …' : '') + ')' : '') + '; only here ' + c.art.onlyHere.length + ', only there ' + c.art.onlyThere.length);
      if (c.pages) log('pages against ' + o + ': boxes moved on ' + c.pages.boxesMoved.length + ', panel changed on ' + c.pages.panelChanged.length + ' (the Warrior Counts\' question and result screens, which vary run to run, apart: ' + c.pages.variesRunToRun.length + '); problems new ' + c.pages.newProblems.length + ', gone ' + c.pages.goneProblems.length);
      if (c.takes && want.takes) log('takes against ' + o + ' (take:first and chapter 12\'s eight Spanish screens): ' + c.takes.same + ' of ' + c.takes.rows + ' byte for byte; boxes moved on ' + c.takes.boxesMoved.length +
        (c.takes.boxesMoved.length ? ' (' + c.takes.boxesMoved.slice(0, 12).join('; ') + ')' : '') + ', markup changed on ' + c.takes.markupChanged.length + (c.takes.markupChanged.length ? ' (' + c.takes.markupChanged.slice(0, 12).join('; ') + ')' : '') +
        '; only here ' + c.takes.onlyHere.length + ', only there ' + c.takes.onlyThere.length);
      log('compare: ' + file);
    }
    const s = status(dir);
    if (s.art) log('art: ' + join(dir, 'art/index.md'));
    if (s.pages) log('pages: ' + join(dir, 'pages/summary.md'));
    if (s.takes && want.takes) log('takes: ' + join(dir, 'takes/summary.md'));
  } catch (e) {
    if (e.code === 'ELOCKED') { console.error(e.message + ' (The sweep keeps what it finished: run it again to go on.)'); process.exit(EXIT_LOCKED); }
    throw e;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
