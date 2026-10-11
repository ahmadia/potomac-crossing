/* The service worker: it precaches every file the app shell loads, every precached file exists,
 * and install / activate / fetch behave (run against a small fake of the Cache API). */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const swSrc = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

function loadSw(net) {
  const stores = new Map(), handlers = {}, precacheModes = [];
  const keyOf = r => (typeof r === 'string' ? new URL(r, 'https://x.test/pc/sw.js').href : r.url);
  const store = name => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name);
    return {
      addAll: reqs => (reqs.forEach(r => precacheModes.push(r.cache)), Promise.all(reqs.map(r => net(keyOf(r)).then(res => { if (!res.ok) throw new Error('404 ' + keyOf(r)); m.set(keyOf(r), res); })))),
      put: (r, res) => { m.set(keyOf(r), res); return Promise.resolve(); },
      match: (r, o) => { let k = keyOf(r); if (o && o.ignoreSearch) k = k.split('?')[0]; return Promise.resolve(m.get(k)); }
    };
  };
  const caches = {
    open: n => Promise.resolve(store(n)),
    keys: () => Promise.resolve([...stores.keys()]),
    delete: n => Promise.resolve(stores.delete(n)),
    match: (r, o) => Promise.resolve([...stores.values()].map(m => { let k = keyOf(r); if (o && o.ignoreSearch) k = k.split('?')[0]; return m.get(k); }).find(Boolean))
  };
  class Request { constructor(u, o) { this.url = new URL(u, 'https://x.test/pc/sw.js').href; this.cache = o && o.cache; this.method = 'GET'; this.mode = (o && o.mode) || 'cors'; } }
  class Response { constructor(b, o) { this.body = b; this.status = (o && o.status) || 200; this.ok = this.status < 400; } clone() { return this; } }
  const self = { location: new URL('https://x.test/pc/sw.js'), addEventListener: (t, f) => { handlers[t] = f; }, skipWaiting: () => Promise.resolve(), clients: { claim: () => Promise.resolve() } };
  const ctx = { self, caches, Request, Response, URL, Promise, fetch: u => net(typeof u === 'string' ? u : u.url) };
  vm.runInNewContext(swSrc, ctx);
  const fire = (type, extra) => { let p = null; const e = Object.assign({ waitUntil: x => { p = x; }, respondWith: x => { p = x; } }, extra); handlers[type](e); return p; };
  return { ctx, stores, fire, Request, precacheModes };
}
const ASSETS = (() => { const m = /var ASSETS = (\[[\s\S]*?\]);/.exec(swSrc); return JSON.parse(m[1].replace(/'/g, '"')); })();

test('the precache list covers every same-origin file index.html loads, and each file exists', () => {
  const refs = [];
  html.replace(/<script[^>]+src="([^"]+)"/g, (m, u) => refs.push(u));
  html.replace(/<link[^>]+href="([^"]+)"/g, (m, u) => refs.push(u));
  const local = refs.filter(u => !/^https?:/.test(u)).map(u => './' + u.replace(/^\.\//, ''));
  assert.ok(local.length >= 7, 'found the app shell’s scripts, manifest and icons');
  for (const u of local) assert.ok(ASSETS.includes(u), u + ' is loaded by index.html but not precached');
  for (const u of ASSETS) if (u !== './') assert.ok(fs.existsSync(path.join(ROOT, u)), u + ' is precached but does not exist');
  // the manifest's icons too
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
  for (const i of man.icons) assert.ok(ASSETS.includes('./' + i.src), i.src + ' (manifest icon) is not precached');
});

test('install precaches past the HTTP cache; activate keeps other games’ caches; fetch is cache-first and works offline', async () => {
  let online = true;
  const seen = [];
  const net = u => { seen.push(u); return online ? Promise.resolve({ ok: true, status: 200, url: u, clone() { return this; } }) : Promise.reject(new Error('offline')); };
  const sw = loadSw(net);
  // other games and our own old version share the origin
  await sw.ctx.caches.open('potion-lab-v3'); await sw.ctx.caches.open('potomac-crossing-v0');
  await sw.fire('install');
  const cacheName = [...sw.stores.keys()].find(k => /^potomac-crossing-v\d+$/.test(k) && k !== 'potomac-crossing-v0');
  assert.ok(cacheName, 'install opened the versioned cache');
  assert.equal(sw.stores.get(cacheName).size, ASSETS.length);
  assert.ok(sw.precacheModes.length === ASSETS.length && sw.precacheModes.every(m => m === 'reload'), 'precache bypasses the HTTP cache');
  await sw.fire('activate');
  const keys = [...sw.stores.keys()];
  assert.ok(keys.includes('potion-lab-v3'), 'Potion Lab’s cache survives');
  assert.ok(!keys.includes('potomac-crossing-v0'), 'our old cache goes');
  // offline: the shell and a navigation with a query string come from the cache
  online = false;
  const get = (u, mode) => sw.fire('fetch', { request: Object.assign(new sw.Request(u, { mode }), { method: 'GET' }) });
  assert.ok((await get('https://x.test/pc/app/ui.js')).ok);
  assert.ok((await get('https://x.test/pc/?from=homescreen', 'navigate')).ok);
});

/* Chapter 2 on: every app file is a script index.html loads, in build.md's order, and precached,
 * so a new chapter or set never ships missing offline. */
function appFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = dir + '/' + e.name;
    if (e.isDirectory()) out.push(...appFiles(rel));
    else if (/\.js$/.test(e.name)) out.push(rel);
  }
  return out;
}

test('every app/ script (art, sets, every chapter, engine, ui) is loaded by index.html and precached', () => {
  const scripts = [];
  html.replace(/<script\s+src="(app\/[^"]+\.js)"/g, (m, u) => scripts.push(u));
  for (const f of appFiles('app')) {
    assert.ok(scripts.includes(f), f + ' exists but index.html does not load it');
    assert.ok(ASSETS.includes('./' + f), f + ' is not precached in sw.js (bump CACHE too)');
  }
  assert.ok(scripts.some(s => /^app\/story\/ch02\.js$/.test(s)), 'chapter 2 is loaded');
});

test('load order: art, then sets, then the chapters in number order, then the engine, then the UI', () => {
  const scripts = [];
  html.replace(/<script\s+src="(app\/[^"]+\.js)"/g, (m, u) => scripts.push(u));
  const at = (re) => scripts.findIndex(s => re.test(s));
  const last = (re) => scripts.length - 1 - scripts.slice().reverse().findIndex(s => re.test(s));
  assert.ok(at(/^app\/art\/cats\.js$/) < at(/^app\/art\/scenes\.js$/));
  assert.ok(last(/^app\/art\/scenes\.js$/) < at(/^app\/art\/sets\//), 'sets register with scenes.js');
  assert.ok(last(/^app\/art\//) < at(/^app\/story\//));
  const chapters = scripts.filter(s => /^app\/story\/ch\d+\.js$/.test(s));
  assert.deepEqual(chapters, chapters.slice().sort(), 'chapters in order');
  assert.ok(last(/^app\/story\//) < at(/^app\/engine\.js$/));
  assert.equal(scripts[scripts.length - 1], 'app/ui.js');
});

/* Chapter 4: the app shell carries her Case File's button (hidden until she has it) and the screen it opens. */
test('the app shell has the Case File’s curl of bark in the top bar, hidden until she has it, and the screen it opens over the page', () => {
  assert.match(html, /<button class="iconbtn filebtn" id="fileBtn" type="button" aria-label="My Case File" title="My Case File" hidden>/);
  assert.match(html, /<div class="cfile" id="file" hidden role="dialog" aria-modal="true" aria-label="Case File"><\/div>/);
  // in the bar between the title and Camp, so the name keeps the left and the leaf the far right
  const bar = html.slice(html.indexOf('<header class="bar"'), html.indexOf('</header>'));
  const ids = [];
  bar.replace(/ id="([A-Za-z]+)"/g, (m, id) => ids.push(id));
  assert.deepEqual(ids, ['bar', 'backBtn', 'barTitle', 'fileBtn', 'campBtn', 'readBtn', 'textBtn', 'catsBtn', 'leaf']);
  // never printed with her book, and still when she asks for less motion
  assert.match(html, /\.bar,\.leaf,\.links,\.coming,\.no-print,\.sheet,\.cfile\{display:none!important\}/);
  assert.match(html, /prefers-reduced-motion: reduce[\s\S]*\.tapspot\.flare svg\{animation:none!important/);
});

/* Chapter 4, after the real-screens review: the page's own rules and wiring that only a browser shows
 * (measured in Safari on the mini; pinned here as text, since the suite has no DOM). */
test('the page: 10 × 10 = 100 keeps its last zero in a zoomed Safari; one group’s number sits beside its claws; a page of choices keeps Back under them; the taps that turn a page hold the next one a moment', () => {
  const ui = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
  // the question line: 14cqi, as chapters 1 to 3 have it (the same size on an iPad as before). Safari sizes a cqi
  // font by the page zoom too (at 115% the line overflowed the lesson column): the answer's slot never shrinks under
  // its digits, and the page fits the line to its column when it is wider, measured with the answer's digits
  assert.match(html, /\.q\{[^}]*font-size:52px;font-size:clamp\(40px, 14cqi, 96px\);/);
  assert.match(html, /\.q \.slot\{flex:none;min-width:1\.3em;/);
  assert.match(ui, /function fitQ\(\) \{[\s\S]{0,700}if \(need > room && room > 0\) qline\.style\.fontSize = /);
  assert.match(ui, /okKey\.disabled = !typed \|\| locked;\n      fitQ\(\);/, 'every time the line is drawn');
  assert.match(ui, /relayoutFn = function \(\) \{ fitQ\(\); \};/, 'and when a font loads late or the screen turns');
  // Squall's one raised forepaw: the 5 grows beside the lit claws, not at the top centre (his face)
  assert.match(html, /\.skipnum\.one\{left:71%;right:0;top:24%;text-align:left\}/);
  assert.match(ui, /class="skipnum' \+ \(v\.groups === 1 \? ' one' : ''\)/);
  // a page of choices: Back is not sticky (it floated over the options' words on a tall page)
  assert.match(html, /\.frame\[data-kind="choice"\] \.next-row\{position:static\}/);
  assert.ok(html.indexOf('.frame[data-kind="choice"] .next-row{position:static}') > html.indexOf('.next-row{display:flex'), 'after the rule it overrides');
  // the glitter Tap and the bark Taps turn the page as a skip-count's last tap does: the next page waits before a tap turns it
  assert.equal((ui.match(/go\('frame', \{ fromSkip: true \}\)/g) || []).length, 3, 'the skip-count, the glint, the row of bark');
  assert.match(ui, /var hold = view\.opts && view\.opts\.fromSkip \? 1100 : 280;/);
  // the skip-count's counter carries its speaker's name on that page, and the lesson's intro is the pure helper's
  assert.match(ui, /var tname = nameOn\(intro, teacher\);/);
  assert.equal((ui.match(/who: teacher, name: tname/g) || []).length, 3, 'the whispered count, the plain count, the done line');
  assert.match(ui, /var intro = lessonIntro\(balloonsOf\(f\), !!\(resume \|\| E\.keptSkip\(story, id, cat\)\)\);/);
  // the Case File's legend shows the art's own marks (the ear her cards carry, not a warning triangle)
  assert.match(ui, /function markSvg\(mark\) \{ return artCall\('cardMark', mark\) \|\| MARK\[mark\] \|\| ''; \}/);
  assert.equal((ui.match(/markSvg\((big|g)\.mark\)/g) || []).length, 2);
  assert.ok(!/MARK\[(big|g)\.mark\]/.test(ui));
  const { load } = require('./_load.js');
  const art = load().art;
  ['eye', 'ear'].forEach(m => assert.match(art.cardMark(m), /^<svg [^>]*viewBox="0 0 40 28"[^>]*>.*stroke="currentColor"/, m + ': the art has the mark by itself, in the page’s colour, the size of the page’s own'));
  // the lettering keeps a long band clear along its length, and a tail off other faces
  assert.match(ui, /\(heads\.keep \|\| \[\]\)\.forEach\(function \(k\) \{ faceList = faceList\.concat\(keepCircles\(k, W, H\)\); \}\);/);
  assert.equal((ui.match(/cost \+= tailOverFaces\(cx, y \+ h \/ 2, head, faces\);/g) || []).length, 1, 'a balloon with a tail of its own (a chained one draws none, and is not charged for one)');
  assert.match(ui, /cost \+= tailOverFaces\(cx, y \+ h \/ 2, \{ x: ncx, y: ncy \}, faces\);/, 'and a chained balloon’s neck, the line it does draw');
  // the page tells the placer which balloon is the panel's last (an off-panel voice may then sit by the bottom edge)
  assert.match(ui, /var lastB = bi === bs\.length - 1;/);
  assert.equal((ui.match(/index: bi, last: lastB, margin: 8/g) || []).length, 3);
});
