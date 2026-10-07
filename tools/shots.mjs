#!/usr/bin/env node
/* Potomac Crossing: screenshots of the real game screens in Safari, for visual checks.
 * macOS only, no dependencies: it serves the repo on localhost, drives Safari through safaridriver
 * (Safari: Develop > Allow Remote Automation, and `safaridriver --enable` once), opens each frame
 * with a test cat through PC.debug, and saves a PNG per frame.
 *
 *   node tools/shots.mjs OUTDIR f077 f034                 chapter 1 frames
 *   node tools/shots.mjs OUTDIR ch02:f010 ch02:f031a      another chapter's frames (PC.debug.goto(frame, chapter))
 *   node tools/shots.mjs OUTDIR ch01:f062@againBtn        open a frame, then tap a button on it (here: the lesson)
 *   WAIT=3500 node tools/shots.mjs OUTDIR ch03:f060@nextBtn@keys=1,2,ok   tap, then type on the keypad (a miss: the help);
 *                                                         locked, a shot taken that late in its session comes back
 *                                                         blank, so use DUMP=1 there (the markup), or shoot unlocked
 *   node tools/shots.mjs OUTDIR hub book hollow nest who title    the other screens
 *   node tools/shots.mjs OUTDIR book#ch03 book#dragonets  the book, scrolled to a chapter's page or the dragonets
 *   node tools/shots.mjs --lock                           is the screen locked (so: a session a shot)? no Safari
 *   SIZE=820x1180 node tools/shots.mjs …                  iPad portrait (default 1180x820, landscape)
 *   CAT='{"name":"Moon","finished":["ch01","ch02"],"at":"ch02:f090",…}' node tools/shots.mjs …
 *   EXTRA=2 node tools/shots.mjs OUTDIR who               two more cats on the device (one partway, one new)
 *   STORY=fixture node tools/shots.mjs …                  chapter 2 replaced by tests/fixtures/chapters.js's (in
 *                                                         the page only), to see chapter-2 screens before it is written;
 *                                                         STORY=fixture3 does the same for chapter 3 (both: fixture,fixture3)
 *   DUMP=1 node tools/shots.mjs OUTDIR …                  no screenshots: each target's screen markup with the art
 *                                                         emptied (OUTDIR/target.html), to diff ui.js's lettering and
 *                                                         layout before and after a change
 *   SHEET=1 node tools/shots.mjs OUTDIR nest who f085 hub four targets to a contact sheet (2 × 2, each a full-size
 *                                                         page shown at half size), one screenshot a sheet; more
 *                                                         targets make more sheets. The panes are fitted to the
 *                                                         page as measured (a scroll bar or page zoom included),
 *                                                         so the right-hand column is never cut off
 *
 * A locked screen (the mini's stays locked, by Aron's choice: never ask to unlock it): Safari's
 * automation window is then hidden (document.visibilityState "hidden") and paints only for the
 * first few seconds of a WebDriver session; later screenshots come back blank grey. The tool reads
 * the lock from `ioreg -n Root -d1` ("CGSSessionScreenIsLocked"=Yes) and then takes every target in
 * a fresh short session of its own: open, set up the test cat, open the target, shoot at once, close
 * (the window size the first session found is reused, so the rest skip the sizing). SHEET=1 does the
 * same per sheet of four. LOCKED=1 or LOCKED=0 overrides the check. Each fresh session costs a few
 * seconds; flows and timing are checked in Node with the engine, not by tapping here.
 *
 * Page zoom: Safari may zoom localhost pages (115% on the mini), so a 1180-wide window shows a
 * 1026-wide page. The window is resized until the page itself is SIZE in CSS pixels; when the
 * screen is too small for that (portrait at 115%), it says so and SHEET scales its panes to fit.
 * Only one Safari automation session can run at a time: a busy one is waited for (about 90 s).
 *
 * The test cat (save version 2): CAT's fields are set on it; `finished` lists finished chapters,
 * `dreams` maps a chapter to her dream, `lessons` lists finished lessons (clean), `nest` her
 * treasures and gifts, `hollow` maps a table to { rounds, cleanRounds, glow }, `at` is where she is
 * ("chapter:frame"; by default chapter 1's last frame, so the hub and the book are chapter 1's), and
 * `lesson` is a lesson in progress, `{ chapter, frame, answers }`: the frame's Count started and these
 * answers given, so a shot of that frame opens on the next question (with `at` on the same frame:
 * CAT='{"at":"ch02:f028","lesson":{"chapter":"ch02","frame":"f028","answers":[20]}}' shows 8 × 2).
 * It lives in this localhost origin's storage only (the server's port), never in a real player's
 * save. The service worker is not registered on localhost.
 */
import { spawn, execFileSync } from 'child_process';
import { createServer } from 'http';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { createRequire } from 'module';
import { join, resolve, dirname, extname, normalize } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
if (!argv.length) { console.error('usage: node tools/shots.mjs OUTDIR target…   (see the comment at the top)'); process.exit(1); }
const outDir = resolve(argv[0]), targets = argv.slice(1);
const [W, H] = (process.env.SIZE || '1180x820').split('x').map(Number);
const CAT = Object.assign({
  name: 'Moon', petname: 'Muffin',
  look: { sex: 'she', fur: 'calico', marking: 'white-paws', eyes: 'odd' },
  flags: { specialty: 'noticing', worry: 'small', stepOut: 'chase', spokeUp: true, joinReason: 'brave' },
  finished: ['ch01'],
  dreams: { ch01: 'I chased a moth all the way to the river.' },
  lessons: ['ch01-tails'],
  nest: ['moss', 'feather'],
  hollow: { 1: { rounds: 2, cleanRounds: 1, glow: false } },
  at: 'ch01:f085'
}, process.env.CAT ? JSON.parse(process.env.CAT) : {});
const EXTRA = Math.max(0, Math.min(3, +(process.env.EXTRA || 0)));
const SHEET = !!process.env.SHEET;
// the screen's lock, from the window server (LOCKED=1 / LOCKED=0 to say so yourself)
function screenLocked() {
  try { return /"CGSSessionScreenIsLocked"=Yes/.test(execFileSync('ioreg', ['-n', 'Root', '-d1'], { encoding: 'utf8' })); } catch { return false; }
}
const LOCKED = process.env.LOCKED != null && process.env.LOCKED !== '' ? process.env.LOCKED === '1' : screenLocked();

const DRY = !!process.env.DRY;   // no screenshots: print what each target's screen says (free to run, nothing to look at)
// DUMP=1: no screenshots: save each target's screen markup with the art emptied (OUTDIR/target.html),
// to compare the lettering and layout ui.js draws before and after a change (cmp or diff the files)
const DUMP = !!process.env.DUMP;
const DUMP_JS = `var s = document.getElementById('screen').cloneNode(true);
  Array.prototype.forEach.call(s.querySelectorAll('.art, .sface, .face, .portrait, .dn-pic'), function (a) { a.innerHTML = ''; });
  return '<!-- ' + innerWidth + 'x' + innerHeight + ' -->\\n' + s.innerHTML.replace(/></g, '>\\n<');`;
// STORY=fixture: chapter 2 replaced by the fixture's; STORY=fixture3: chapter 3 (both: STORY=fixture,fixture3)
const STORIES = String(process.env.STORY || '').split(',');
const FX = STORIES.some(x => /^fixture3?$/.test(x)) ? require(join(ROOT, 'tests/fixtures/chapters.js'))() : null;
const FIXTURE = FX ? Object.assign({}, STORIES.includes('fixture') ? { ch02: FX.ch02 } : {}, STORIES.includes('fixture3') ? { ch03: FX.ch03 } : {}) : null;
// `node tools/shots.mjs --lock`: say which way it would shoot (and which chapters a STORY stands in), and stop (no Safari, no server)
if (argv[0] === '--lock') {
  console.log(LOCKED ? 'locked: a fresh short session for each shot' : 'unlocked: one session for every shot');
  if (FIXTURE) console.log('stories from tests/fixtures/chapters.js: ' + Object.keys(FIXTURE).join(', '));
  process.exit(0);
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  const file = join(ROOT, p.endsWith('/') ? p + 'index.html' : p);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const site = 'http://localhost:' + server.address().port + '/';

const dport = 4500 + Math.floor(Math.random() * 400);
const driver = spawn('safaridriver', ['-p', String(dport)], { stdio: 'ignore' });
const WD = 'http://localhost:' + dport;
async function wd(method, path, body) {
  const r = await fetch(WD + path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json();
  if (j.value && j.value.error) throw new Error(path + ': ' + j.value.message);
  return j.value;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Stills: no entrance animations or transitions. Safari's automation window can be hidden (the
 * mini's display asleep: document.visibilityState is "hidden"), and a hidden page never advances an
 * animation, so every screen would stay at its first keyframe (opacity 0) and shoot blank. */
const STILL = `if (!document.getElementById('shots-still')) document.head.insertAdjacentHTML('beforeend',
  '<style id="shots-still">*,*::before,*::after{animation:none!important;transition:none!important}</style>'); return true;`;

/* Runs in the page: a fresh device with one test cat (save version 2) set up as CAT says. */
const SETUP = `
  var o = arguments[0], fixture = arguments[1], E = PC.engine;
  if (fixture) Object.keys(fixture).forEach(function (k) { PC.story[k] = fixture[k]; });
  localStorage.clear(); PC.debug.reset();
  var first = E.firstChapter(PC.story);
  PC.debug.goto(first.start, first.id);
  var c = PC.debug.cat(), t = Date.now();
  ['name', 'petname'].forEach(function (k) { if (o[k] != null) c[k] = o[k]; });
  if (o.look) Object.keys(o.look).forEach(function (k) { c.look[k] = o.look[k]; });
  if (o.flags) Object.keys(o.flags).forEach(function (k) { c.flags[k] = o.flags[k]; });
  (Array.isArray(o.finished) ? o.finished : Object.keys(o.finished || {})).forEach(function (id, i) { c.finished[id] = t - 86400000 * (5 - i); });
  if (o.dreams) Object.keys(o.dreams).forEach(function (k) { c.dreams[k] = o.dreams[k]; });
  (o.lessons || []).forEach(function (id) { c.lessons[id] = { set: id, mode: 'chapter', answers: 9, correct: 9, fast: 4, facts: 9, firstTry: 9, helped: 0, noHelp: true, finished: true }; });
  if (o.nest) c.nest = o.nest.slice();
  if (o.hollow) Object.keys(o.hollow).forEach(function (k) { c.hollow.byTable[k] = o.hollow[k]; c.hollow.rounds += o.hollow[k].rounds || 0; });
  if (o.at) { var at = String(o.at).split(':'); var r = PC.debug.goto(at[1], at[0]); if (r !== at[1]) return 'at: ' + r; }
  if (o.lesson) {
    // a lesson in progress at a Counts frame, these answers already given (so a shot can open on its
    // second question): { chapter, frame, answers }
    var Ls = o.lesson, sto = PC.story[Ls.chapter || 'ch01'], fr = sto && sto.frames[Ls.frame];
    if (!fr || !fr.counts) return 'lesson: no Counts frame ' + Ls.frame;
    var go = E.chapterLesson(c, sto, fr.counts.set, t, PC.story);
    E.beginLesson(c, sto, Ls.frame, go.state);
    (Ls.answers || []).forEach(function (a) {
      var q = E.counts.question(go.state);
      if (q) E.logAnswer(c, E.counts.answer(go.state, E.questionDef(go.def, q, sto, PC.story), a, 3000, t).entry);
    });
  }
  PC.debug.save();
  return true;`;

/* One WebDriver session: wait for another agent's to end (only one runs at a time), size the window
 * so the page is W × H CSS px whatever Safari's page zoom (`fit` remembers the window that did it, so
 * a later session goes straight there), load the game with the test cat set up, and hand over. */
let fit = null, told = false;
async function session(fn) {
  let sid = null;
  for (let i = 0; i < 180 && !sid; i++) {
    try { sid = (await wd('POST', '/session', { capabilities: { alwaysMatch: { browserName: 'safari' } } })).sessionId; }
    catch (e) { if (i === 179) throw e; await sleep(500); }
  }
  const S = '/session/' + sid;
  const run = (script, args = []) => wd('POST', S + '/execute/sync', { script, args });
  try {
    await wd('POST', S + '/window/rect', fit || { x: 0, y: 0, width: W, height: H + 80 });
    await wd('POST', S + '/url', { url: site });
    await sleep(LOCKED ? 350 : 800);
    let VW = W, VH = H;
    for (let i = 0; i < 4; i++) {
      const [iw, ih] = await run('return [innerWidth, innerHeight];');
      VW = iw; VH = ih;
      if (Math.abs(iw - W) <= 1 && Math.abs(ih - H) <= 1) break;
      const r = await wd('GET', S + '/window/rect');
      const k = r.width / iw, chrome = r.height - ih * k;
      fit = { x: 0, y: 0, width: Math.round(W * k), height: Math.round(H * k + chrome) };
      await wd('POST', S + '/window/rect', fit);
      await sleep(LOCKED ? 150 : 300);
    }
    if (!fit) fit = await wd('GET', S + '/window/rect');
    if ((Math.abs(VW - W) > 1 || Math.abs(VH - H) > 1) && !told) { told = true; console.error('note: the page is ' + VW + 'x' + VH + ' CSS px, not ' + W + 'x' + H + ' (Safari’s page zoom on a small screen)'); }
    await run(STILL);
    const ok0 = await run(SETUP, [CAT, FIXTURE]);
    if (ok0 !== true) throw new Error('setting up the test cat: ' + ok0);
    if (EXTRA) {
      // more cats for "Who's playing?": added beside the test cat, which stays current
      const more = await run(`
        var E = PC.engine, n = arguments[0], first = E.firstChapter(PC.story);
        var looks = [{ sex: 'tom', fur: 'ginger', marking: 'nose-splash', eyes: 'amber' }, { sex: 'she', fur: 'silver-tabby', marking: 'none', eyes: 'blue' }, { sex: 'tom', fur: 'black', marking: 'white-chest', eyes: 'green' }];
        var names = ['Pebble', 'Fern', 'Storm'];
        var raw = JSON.parse(localStorage.getItem(E.STORAGE_KEY));
        for (var i = 0; i < n && raw.cats.length < E.MAX_CATS; i++) {
          var c = E.blankCat({ now: Date.now() + i, index: raw.cats.length, look: looks[i] });
          c.name = i === n - 1 && n > 1 ? '' : names[i];
          if (c.name) { E.startChapter(c, first, 1); for (var k = 0; k < 6 + 7 * i; k++) E.next(c, first, 2) || E.go(c, first, E.exits(E.currentFrame(c, first))[0], 2); }
          raw.cats.push(c);
        }
        localStorage.setItem(E.STORAGE_KEY, JSON.stringify(raw));
        return raw.cats.length;`, [EXTRA]);
      // reload so the page reads the device's cats from storage
      await wd('POST', S + '/url', { url: site });
      await sleep(LOCKED ? 350 : 800);
      await run(STILL);
      if (FIXTURE) await run('var fx = arguments[0]; Object.keys(fx).forEach(function (k) { PC.story[k] = fx[k]; }); return true;', [FIXTURE]);
      if (!told) console.log('cats on the device: ' + more);
    }
    return await fn(S, run);
  } finally {
    await wd('DELETE', S).catch(() => {});
  }
}

/* Up to four targets, each in a full-size frame of the game, on one page: the panes are scaled to the
 * page's own measured size (clientWidth/clientHeight: a scroll bar, page zoom, a window the screen
 * could not make big enough), then checked, so the right-hand column always fits. Each pane sets up
 * its own test cat (SETUP, run in the pane's window): in Safari's automation session here,
 * localStorage does not carry from one document to another, so a pane never sees the cat the
 * outer page saved (it would open on "Who's playing?"). */
async function sheet(S, run, four) {
  const ready = await run(`
    var site = arguments[0], n = arguments[1], W = arguments[2], H = arguments[3];
    document.body.innerHTML = '';
    document.documentElement.style.cssText = 'overflow:hidden;margin:0;padding:0';
    document.body.style.cssText = 'margin:0;padding:0;background:#000;overflow:hidden;position:relative';
    var vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    var k = Math.min(vw / (2 * W), vh / (2 * H), 0.5);
    for (var i = 0; i < n; i++) {
      var f = document.createElement('iframe');
      f.src = site + '?sheet=' + i;
      f.style.cssText = 'position:fixed;border:0;margin:0;padding:0;width:' + W + 'px;height:' + H + 'px;transform:scale(' + k + ');transform-origin:0 0;left:' + (i % 2) * W * k + 'px;top:' + Math.floor(i / 2) * H * k + 'px';
      document.body.appendChild(f);
    }
    return true;`, [site, four.length, W, H]);
  if (ready !== true) throw new Error('sheet: ' + ready);
  for (let k = 0; k < 40; k++) {
    const up = await run('return Array.prototype.every.call(document.querySelectorAll("iframe"), function (f) { try { return !!(f.contentWindow.PC && f.contentWindow.PC.debug); } catch (e) { return false; } });');
    if (up === true) break;
    await sleep(LOCKED ? 80 : 150);
  }
  const res = await run(`
    var out = [], frames = document.querySelectorAll('iframe'), targets = arguments[0], still = arguments[1], fixture = arguments[2];
    var setup = arguments[3], cat = arguments[4];
    for (var i = 0; i < frames.length; i++) {
      var w = frames[i].contentWindow, PC = w.PC, t = targets[i].split('@'), target = t[0];
      try {
        w.eval(still);
        // the test cat, set up in the pane's own window (its PC, its storage), as SETUP does a page
        var made = new w.Function(setup).apply(null, [cat, fixture]);
        if (made !== true) { out.push(targets[i] + ': setting up the test cat: ' + made); continue; }
        if (/^(hub|book|hollow|nest|who|title)$/.test(target)) PC.debug.go(target, { from: 'hub' });
        else { var cf = target.indexOf(':') >= 0 ? target.split(':') : ['ch01', target]; var r = PC.debug.goto(cf[1], cf[0]); if (r !== cf[1]) { out.push(targets[i] + ': ' + r); continue; } }
        out.push(true);
      } catch (e) { out.push(targets[i] + ': ' + e.message); }
    }
    return out;`, [four, '(function(){' + STILL.replace(/return true;$/, '') + '})()', FIXTURE, SETUP, CAT]);
  res.forEach((r) => { if (r !== true) console.error(r); });
  if (four.some(t => t.includes('@'))) {
    await sleep(450);   // past each page's double-tap guard
    const clicks = await run(`
      var out = [], frames = document.querySelectorAll('iframe'), targets = arguments[0];
      for (var i = 0; i < frames.length; i++) {
        var id = targets[i].split('@')[1];
        if (!id) continue;
        var b = frames[i].contentWindow.document.getElementById(id);
        if (b) b.click(); else out.push(targets[i] + ': no #' + id);
      }
      return out;`, [four]);
    clicks.forEach((r) => console.error(r));
  }
  // every pane inside the page, or say so
  const fits = await run(`
    var vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    return Array.prototype.map.call(document.querySelectorAll('iframe'), function (f) { var r = f.getBoundingClientRect(); return r.right <= vw + 1 && r.bottom <= vh + 1 ? true : 'pane ' + Math.round(r.left) + '–' + Math.round(r.right) + ' × ' + Math.round(r.top) + '–' + Math.round(r.bottom) + ' in ' + vw + ' × ' + vh; });`);
  fits.forEach((r, i) => { if (r !== true) console.error(four[i] + ': cut off: ' + r); });
  await sleep(LOCKED ? 450 : 900);
  if (DRY) {
    const txt = await run('return Array.prototype.map.call(document.querySelectorAll("iframe"), function (f) { var d = f.contentWindow.document; return d.getElementById("screen").innerText.replace(/\\s+/g, " ").slice(0, 300) + " [opacity " + f.contentWindow.getComputedStyle(d.getElementById("screen")).opacity + "]"; });');
    txt.forEach((x, i) => console.log(four[i] + ': ' + x));
    return;
  }
  const png = await wd('GET', S + '/screenshot');
  const file = join(outDir, 'sheet-' + four.map(t => t.replace(/[:@#]/g, '-')).join('_') + '.png');
  await writeFile(file, Buffer.from(png, 'base64'));
  console.log(file);
}

/* One target on its own page: open it (and tap a button on it), then shoot. */
async function shoot(S, run, t) {
  const [target0, ...clicks] = t.split('@');
  // book#ch03 or book#dragonets: the book, scrolled to that page
  const [target, anchor] = target0.split('#');
  const screen = /^(hub|book|hollow|nest|who|title)$/.test(target);
  const [ch, fid] = target.includes(':') ? target.split(':') : ['ch01', target];
  const ok = await run(screen
    ? 'if (!PC.debug.cat()) PC.debug.go("who"); else PC.debug.go(arguments[0], { from: "hub" });' +
      'var a = arguments[1] && document.getElementById("book-" + arguments[1]); if (arguments[1] && !a) return "no page " + arguments[1]; if (a) a.scrollIntoView({ block: "start" }); return true;'
    : 'var r = PC.debug.goto(arguments[1], arguments[0]); return r === arguments[1] || r;', screen ? [target, anchor || null] : [ch, fid]);
  if (ok !== true) { console.error(t + ': ' + ok); return; }
  // each @ taps a button by its id, in turn; @keys=3,4,ok presses the lesson's keypad (a wrong answer
  // shows the help: WAIT=ms waits for its count before the shot)
  for (const click of clicks) {
    await sleep(LOCKED ? 420 : 600);   // past the double-tap guard
    const c = await run('var k = /^keys=/.test(arguments[0]) ? arguments[0].slice(5).split(",") : null;' +
      'if (k) { for (var i = 0; i < k.length; i++) { var kb = document.querySelector(".key[data-k=\\"" + k[i] + "\\"]"); if (!kb) return "no key " + k[i]; kb.click(); } return true; }' +
      'var b = document.getElementById(arguments[0]); if (!b) return "no #" + arguments[0]; b.click(); return true;', [click]);
    if (c !== true) { console.error(t + ': ' + c); return; }
  }
  await sleep((LOCKED ? 450 : 900) + (+process.env.WAIT || 0));   // fonts and layout (and, unlocked, the entrance animation)
  if (DRY) { console.log(t + ': ' + await run('return document.getElementById("screen").innerText.replace(/\\s+/g, " ").slice(0, 300);')); return; }
  if (DUMP) {
    // the page's own markup, the lettering laid out over the panel included, with the art's drawings
    // (the panel, the speakers' faces, the portraits) emptied: what ui.js put on the screen
    const html = await run(DUMP_JS);
    const file = join(outDir, t.replace(/[:@#]/g, '-') + '.html');
    await writeFile(file, html);
    console.log(file);
    return;
  }
  const png = await wd('GET', S + '/screenshot');
  const file = join(outDir, t.replace(/[:@#]/g, '-') + '.png');
  await writeFile(file, Buffer.from(png, 'base64'));
  console.log(file);
}

try {
  await mkdir(outDir, { recursive: true });
  if (LOCKED) console.error('the screen is locked: a fresh short session for each ' + (SHEET ? 'sheet' : 'shot'));
  if (SHEET) {
    const groups = [];
    for (let i = 0; i < targets.length; i += 4) groups.push(targets.slice(i, i + 4));
    if (LOCKED) { for (const four of groups) await session((S, run) => sheet(S, run, four)); }
    else await session(async (S, run) => { for (const four of groups) await sheet(S, run, four); });
  } else if (LOCKED) {
    for (const t of targets) await session((S, run) => shoot(S, run, t));
  } else {
    await session(async (S, run) => { for (const t of targets) await shoot(S, run, t); });
  }
} finally {
  driver.kill();
  server.close();
}
