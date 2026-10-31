/* Records tests/fixtures/ch09-golden.json: chapters 1 to 9 read through the engine, the art and the
 * page's pure words as they are on the tree chapter 10 is built on, before chapter 10's build touched
 * anything (chapter 10's spec, section 7, item 3, and section 10, steps 0 and 1). That tree is main after
 * the Warrior Counts' merge (2026-10-31: decisions 48 and 49, `app/story/warrior.js`, `E.warrior*`) and
 * the polish release (v20: Thymeleaf's spots under the bridge, ch09 f089 to f100, and Sprinkle's lift on
 * the bank, f115), commit 5bde0c5: chapter 9 as it shipped (0.9.0, ba481b7, the depth hotfix already in
 * it, ch09 f112 back to front), with those two releases on it. Run once, in a process of its own, against
 * the snapshot of that tree:
 *
 *   GOLDEN_ROOT=/Users/aron/potomac-crossing-work/ch10/shipped node tests/fixtures/make-ch09-golden.js
 *
 * (the snapshot holds app/, index.html and tests/_load.js, which loads every script index.html lists in
 * its order, `app/story/warrior.js` among them: `PC.warrior` is not in `PC.story`, so nothing recorded
 * here holds it, but the engine and the page's words are read with it loaded, as the page loads it).
 * ITS VERSION CONSTANT is the snapshot's own `E.VERSION`, '0.9.1 (the Warrior Counts, 2026-10-31)', as
 * the merge wrote it (the polish release leaves it), not chapter 9's '0.9.0 (chapter 9, 2026-10-26)': it
 * records only on that engine (and only from a tree with the Warrior Counts loaded, the polish release in
 * and no chapter 10), refuses any other, and never writes into the snapshot. tests/golden-ch09.test.js
 * reads the same scripts through today's tree and compares the digests, so chapters 1 to 9 play and
 * render exactly as they did for every live save.
 *
 * What one frame shows is make-ch06-golden.js's record (its `frameRecord`: the scene with her options
 * filled in and a hash of the art's drawing of it, ids stripped; the captions and what Read to me says of
 * them; the balloons with their speakers' labels and voices; the options and their labels; the card under
 * the panel and its drawing; the pages she taps; her whole Case File with every card drawn, the rows it
 * lays out with their lines; every skip-count tap by tap), with, on the eleven frames that say where their
 * sound is lettered, that place (`sfxAt`); and beside it, on a Counts frame, what the page says over its
 * first question and after its last (make-ch08-golden.js's `countsSaid`). Every lesson is
 * make-ch06-golden.js's walk (every question, its pictures, words, result and line, the whole help hop by
 * hop, each drawn), and so are the Training Hollow and its lines (the 8s' rounds among them), her book
 * with its dragonets, the grown-ups corner's words for her flags, E.factTables and the cat. Every drawing
 * is made twice (once more at the end, the art's counter far along) and must hash the same both times.
 * Beside them, in the open so the test can name each delta, what a later chapter may move: her book's
 * teaser (`teaser`), the grown-ups corner's tables (`tables`) and the hub (`hub`); and, so the test can
 * name it, what chapter 10's one edit to shipped story code must not move (its spec, section 5: chapter
 * 5's `book.recap` reads `ch10Puddle`): her book's chapter 5 page and Puddle's page, word for word
 * (`pages`); and the Warrior Counts as the hub and the grown-ups corner show them to her (`warrior`:
 * closed until chapter 10 is finished, so the hub's slot is empty and the corner says "not open yet").
 *
 * The scripts are chapter 8's fourteen (make-ch08-golden.js: every specialty and worry, told and kept,
 * both chapter 2 paths, the roofs of chapters 4 and 5 and "Not today", Puddle, Wisp, Sleet and Hail found
 * and not, both of chapter 8's routes, slow and quick, a tom, misses of every kind in chapters 2 to 8),
 * each reading chapter 9 too, and one more (a cat slow on 3 × 4 in chapter 8, for chapter 9's known issue
 * 6). Between them, chapter 9: every option of its four choices (the reed root, the oak: Mizzle or the
 * elder's moss, the tower: the roof or “Just the dew today.” for a cat who has never met Squall, and
 * Glintstar's), the roof by a climber and by a noticing cat (chapter 4's riddle missed once and three times),
 * Mizzle found and not, a dragonet's five for the flaps (f098: Squall's, Hail's or Mizzle's alone) and none,
 * the shiny cat's line at the dew, a reread (Squall met by then; Mizzle again), slow and quick, a tom, and
 * misses of every kind in its sets: the warm-up's hard pick (from a chapter-8 miss, a slow answer, or
 * 4 × 7 when nothing was hard, quick and slow; remembered quick and slow; missed) and its fillers (a miss
 * on the first, a miss on 2 × 4, the slip of its known issue 6 when the pick is 3 × 4, and none with a
 * pick of 10 × 4); the eights' twins (7 × 8 missed once, twice before a quick 8 × 7, with 8 × 8; the 8 × 7
 * check missed), their fillers (9 × 8 once and twice, 8 × 10); Mizzle's riddle once, twice and three
 * times; the three doses once, twice and with a missed filler, and the three readings of its known issue
 * 14 (every dose missed once with Mizzle not met, right, and missed once); every answer wrong. Between
 * them, every frame of chapters 1 to 9 is shown by some reading.
 *
 *   node tests/fixtures/make-ch09-golden.js --diff DIR   writes the whole of each run as today's tree plays
 *   it to DIR/now-N.json (with GOLDEN_ROOT at the snapshot: as that tree plays it, to DIR/then-N.json), to diff.
 *
 * Record again the same way (from the same snapshot, never from today's tree).
 * Not a test file.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { clone, hash } = require('./golden.js');
const G6 = require('./make-ch06-golden.js');
const G7 = require('./make-ch07-golden.js');
const G8 = require('./make-ch08-golden.js');
const { strip, treeAt } = G6;

/* The engine of the merged tree chapter 10 is built on (the Warrior Counts merged onto chapter 9, the
 * polish release in), not chapter 9's own 0.9.0. */
const VERSION9 = '0.9.1 (the Warrior Counts, 2026-10-31)';
const CH9 = G8.CH8.concat(['ch09']);
// a fixed "now" for the Warrior Counts' state (it reads a time only to tell a stale sitting, and no golden cat has one)
const NOW = 2e12;

/* ------------------------------------------------------------------ the scripts */
const SPEC = { noticing: 0, sneaking: 1, climbing: 2, swimming: 3, friends: 4 }, WORRY = { small: 0, water: 1, talk: 2, shiny: 3 };
// make-ch06-golden.js's routing picks, for the new cat
function who(o) {
  const p = { 'ch01:f014': SPEC[o.spec], 'ch01:f066': WORRY[o.worry], 'ch02:f084': o.path === 'river' ? 1 : 0, 'ch03:f086': o.told ? 0 : 1, 'ch04:f075': o.roof4 ? 0 : 1,
    'ch05:f021': o.roof5 ? 0 : 1, 'ch05:f057': o.raft === 'lean' ? 0 : 1, 'ch05:f066': o.first === 'heron' ? 1 : 0, 'ch05:f121': o.raft === 'ask' ? 0 : 1,
    'ch06:f048': o.sleet ? 0 : 1, 'ch06:f034': o.unfair ? 0 : 1 };
  ['ch05:f098', 'ch05:f100a', 'ch05:f101a'].forEach((id, i) => { p[id] = i < (o.wait || 0) ? 0 : 1; });
  return Object.assign(p, o.more || {});
}
/* Chapter 9's four choices (none sets anything; the flags come from reaching a frame): the reed root
 * (f032: “For a friend who’s hurt.”, or dip your head), the old oak (f043: climb up to the hollow, where
 * Mizzle is, or ask the elder which moss), the tower at first light (f062, only for a cat who has never
 * met Squall: up to the roof, chapter 4's way at dawn, where she meets him (`foundSquall`, `ch9Roof`), or
 * “Just the dew today.”), and Glintstar (f127: “Me?”, or sit up very straight). Every one is picked by
 * the script, never by `choiceIndex`. */
function nine(o) {
  return { 'ch09:f032': o.dip ? 1 : 0, 'ch09:f043': o.mizzle === false ? 1 : 0, 'ch09:f062': o.roof ? 0 : 1, 'ch09:f127': o.straight ? 1 : 0 };
}
const S8 = G8.SCRIPTS8;
const every = (x) => { const o = {}; CH9.forEach(c => { o[c] = Object.assign({}, x); }); return o; };
// chapter 8's script i, reading chapter 9 as `n` and `ch09` say (its name says what chapter 9 adds)
const on8 = (i, more, n, ch09, extra) => Object.assign({}, S8[i], { name: S8[i].name + '; chapter 9: ' + more, pick: Object.assign({}, S8[i].pick || {}, nine(n)), ch09 }, extra || {});
const DOSES_ONCE = { 'ch09-dew': [0, 1, 1, 1], 'ch09-rubs': [0, 1, 1, 1], 'ch09-flaps': [0, 1, 1, 1] };
const SCRIPTS9 = [
  on8(0, 'Mizzle in the oak; clean and quick (the warm-up opens on 4 × 7, nothing hard)', {}, { ms: 2000 }),
  on8(1, 'the elder’s moss, no Mizzle, dips her head, sits up straight; every dose missed once with Mizzle not met (known issue 14: 2 × 8 three times)',
    { mizzle: false, dip: true, straight: true }, { ms: 3500, plan: DOSES_ONCE }),
  on8(2, 'up to the roof as a climber (Squall at last), Mizzle; one off: the warm-up’s hard pick remembered, the eights’ 7 × 8 and 8 × 8 (and 6 × 8), the roof’s 7 × 5, Mizzle’s riddle, the dew',
    { roof: true }, { ms: 2000, miss: ['7x8', '8x8', '6x8', '7x5', '8x4'] }),
  on8(3, 'Mizzle, dips her head; ten off: the eights’ 9 × 8 (it lends 2 × 8, 8 × 3), the rubs', { dip: true }, { ms: 2500, wrongBy: 10, miss: ['9x8', '3x8'] }),
  on8(4, 'Mizzle; the shiny cat’s line at the dew; every answer wrong, the retries and the fillers too', {}, { allWrong: true }),
  on8(5, 'Mizzle, sits up straight; the tom, slow: the warm-up’s hard pick (his chapter-8 4 × 8) remembered slow; 7 × 8 missed twice, then 8 × 7 quick',
    { straight: true }, { ms: 4500, msFor: { '8x7': 2000 }, plan: { 'ch09-eights': [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1] } }),
  on8(6, 'Mizzle; answer by answer: the warm-up’s hard pick missed (it lends 3 × 4), 9 × 8 missed twice, Mizzle’s riddle twice, every dose twice',
    {}, { ms: 2000, plan: { 'ch09-fours': [0, 1, 1, 1, 1], 'ch09-eights': [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1],
      'ch09-mizzle': [0, 1, 1, 0, 1, 1, 1], 'ch09-dew': [0, 1, 1, 0, 1, 1, 1], 'ch09-rubs': [0, 1, 1, 0, 1, 1, 1], 'ch09-flaps': [0, 1, 1, 0, 1, 1, 1] } }),
  on8(7, '“Just the dew today.” and the elder’s moss: no Squall, Hail or Mizzle, so no dragonet’s five for the flaps; slow everywhere: the warm-up’s hard pick (her slow 10 × 4) and two of its fillers missed, and no slip with that pick',
    { mizzle: false }, { ms: 6500, plan: { 'ch09-fours': [0, 1, 0, 1, 0, 1, 1, 1] } }),
  on8(8, 'Mizzle; three off: the eights’ 4 × 8 (her chapter-8 miss, the warm-up’s remembered pick), Mizzle’s riddle and the flaps missed three times',
    {}, { ms: 3000, wrongBy: 3, miss: ['4x8'], plan: { 'ch09-mizzle': [0, 1, 1, 0, 1, 1, 0, 1, 1, 1], 'ch09-flaps': [0, 1, 1, 0, 1, 1, 0, 1, 1, 1] } }),
  on8(9, 'before the rereads (Hail, no Squall yet): up to the roof as a noticing cat (Squall at last), Mizzle; slow on the warm-up’s 4 × 7 alone (nothing hard); the roof’s riddle missed three times; after the rereads, chapter 9 again, Squall met',
    { roof: true }, { ms: 2000, msFor: { '4x7': 5000 }, plan: { 'ch04-riddle': [0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1] } }, { reread: S8[9].reread.concat([{ chapter: 'ch09', cfg: { ms: 2000 } }]) }),
  on8(10, 'Mizzle: all seven found; the twins: 7 × 8 missed once, then the 8 × 7 check missed', {}, { ms: 1500, plan: { 'ch09-eights': [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1] } }),
  on8(11, 'Mizzle right; 8 × 10 missed (it lends 2 × 8); every dose missed once with Mizzle right (known issue 14: 8 × 5 twice too)', {}, { ms: 2500, miss: ['8x10'], plan: DOSES_ONCE }),
  on8(12, '“Just the dew today.” and the elder’s moss: Hail’s the only five for the flaps; the warm-up’s 2 × 4 missed (it lends 3 × 4, 4 × 5), the dew’s first filler missed; chapter 9 before the rereads',
    { mizzle: false }, { ms: 2500, plan: { 'ch09-fours': [1, 0, 1, 1, 1], 'ch09-dew': [0, 0, 1, 1, 1] } }),
  on8(13, 'Mizzle’s riddle missed once, and every dose once (known issue 14: 2 × 8 four times in the day, the rubs lend 4 × 8)', {}, { ms: 3000, plan: Object.assign({ 'ch09-mizzle': [0, 1, 1, 1] }, DOSES_ONCE) }),
  Object.assign({ name: 'chapter 9’s known issue 6: noticing, shiny, river, kept; not today twice; Puddle after the slip, no Wisp, the heron first, Sleet; the tunnel, the right way; slow on 3 × 4 alone in chapter 8; chapter 9: “Just the dew today.”, Mizzle’s the only five for the flaps; the warm-up’s hard pick, 3 × 4, missed three times, so it lends its own 2 × 4 back',
    pick: Object.assign(who({ spec: 'noticing', worry: 'shiny', path: 'river', told: false, raft: 'ask', first: 'heron', wait: 0, sleet: true }), G8.way({ route: 'tunnel', fork: 'right' }), nine({})) },
  every({ ms: 2500 }), { ch08: { ms: 2500, msFor: { '3x4': 5000 } }, ch09: { ms: 2500, plan: { 'ch09-fours': [0, 1, 0, 1, 0, 1, 1, 1] } } })
];

/* ------------------------------------------------------------------ one reading */
/* Her book's chapter 5 page and Puddle's page, word for word (null where she has none): chapter 10's one
 * edit to shipped story code is chapter 5's `book.recap` (its two lines that read `foundPuddle`). */
function pagesOf9(book) {
  const page = (book.pages || []).find(p => p.id === 'ch05'), puddle = ((book.dragonets && book.dragonets.found) || []).find(d => d.id === 'puddle');
  return clone({ ch05: page || null, puddle: puddle || null });
}
/* The Warrior Counts as the page shows them to her (ui.js: the hub's slot, UI.warrior.hub over
 * E.warriorState and E.progress, and the grown-ups corner's line, UI.warrior.corner, with the chapter
 * after which they open named as the corner names it), and whether her save holds `warrior` at all. */
function warriorOf(ctx, cat) {
  const { E, UI, list } = ctx;
  const ws = E.warriorState(cat, list, NOW), W = UI && UI.warrior;
  const after = ctx.W ? E.chapter(ctx.W.after, list) : null;
  return clone({
    held: cat.warrior !== undefined, after: ctx.W ? ctx.W.after : null,
    state: { open: ws.open, passed: ws.passed, passedAt: ws.passedAt, sat: ws.sat, sitting: ws.sitting, stale: ws.stale, unseen: ws.unseen, notYet: ws.notYet, attempts: ws.attempts.length },
    hub: W ? W.hub(ws, E.progress(cat, list)) : null,
    corner: W ? W.corner(cat, { open: W.open(ws), after: after ? 'chapter ' + (after.number || '') : 'chapter 10', date: (ms) => new Date(ms).toISOString().slice(0, 10) }) : null
  });
}
/* A whole script: make-ch07-golden.js's run7 over chapters 1 to 9 (her readings in order, a chapter left
 * and picked up again where the script says, then her rereads; a Training Hollow round of every Count she
 * has learned; her book; the grown-ups corner; her cards, file and tables; the hub; the cat), with each
 * Counts frame's words round its lesson (`said`), the place of a frame's sound in what it shows, her
 * book's two pages (`pages`), the corner's words for ch3Told (`told`) and the Warrior Counts (`warrior`).
 * She reads the chapters in `ctx.read` (unset: `ctx.list`, chapters 1 to 9); the engine is handed
 * `ctx.list` everywhere else, so the test's second pass can hand it every story loaded, as the page does
 * (`PC.story`). */
function run9(ctx, script) {
  const sink = [], before = ctx.onFrame;
  const c = Object.assign({}, ctx, { onFrame: (cat, story, id) => {
    const f = story.frames[id];
    sink.push([G8.countsSaid(ctx, story, id, cat), f && f.sfxAt != null ? clone(f.sfxAt) : null]);
    if (before) before(cat, story, id);
  } });
  const run = G7.run7(c, script);
  let k = 0;
  run.readings.forEach(r => {
    const seen = r.frames.map(id => [id, sink[k++]]);
    r.said = seen.filter(x => x[1][0]).map(x => [x[0], x[1][0]]);
    // a frame that says where its sound is lettered: that place with what it shows
    r.shown = r.shown.map((x, n) => { const at = seen[n][1][1]; return at == null ? x : typeof x === 'string' ? hash([x, at]) : Object.assign({}, x, { sfxAt: at }); });
  });
  if (k !== sink.length) throw new Error(script.name + ': ' + sink.length + ' frames seen, ' + k + ' read');
  run.pages = pagesOf9(run.book);
  run.told = (run.corner || []).find(x => x[0] === 'ch3Told') || null;
  run.warrior = warriorOf(ctx, run.end);
  return run;
}

/* ------------------------------------------------------------------ small */
/* A run, small: make-ch08-golden.js's compact8 (each reading's frames, choices, a hash of what each frame
 * shows, the words round each lesson, every answer as a readable row and a hash; the Hollow the same way;
 * her book but its teaser, the corner, her cards and file, the cat as hashes beside the flags and the
 * status; in the open her book's teaser, the corner's tables, the hub, her two pages and the corner's words
 * for ch3Told), and the Warrior Counts as she is shown them. */
function compact9(run) { return clone(Object.assign(G8.compact8(run), { warrior: run.warrior })); }
/* chapters 1 to 9 of a tree, handed to the engine (opts.list overrides, opts.read is what she reads) */
function context9(PC, opts) { return G6.context(PC, Object.assign({ list: CH9.map(id => PC.story[id]), draw: G8.drawer8(PC.art), W: PC.warrior || null }, opts || {})); }
function runs9(PC, opts) {
  const ctx = context9(PC, opts);
  return SCRIPTS9.map(s => run9(ctx, s));
}

if (require.main === module) {
  const root = process.env.GOLDEN_ROOT ? path.resolve(process.env.GOLDEN_ROOT) : path.join(__dirname, '..', '..');
  const inside = (p) => { const r = path.relative(root, path.resolve(p)); return process.env.GOLDEN_ROOT && (r === '' || (!r.startsWith('..') && !path.isAbsolute(r))); };
  const PC = treeAt(root), E = PC.engine;
  const old = E.VERSION === VERSION9;
  if (!CH9.every(id => PC.story[id])) { console.error('This tree has no chapter 9 (' + E.VERSION + '): nothing to record or diff.'); process.exit(1); }
  // the drawings are the same however many came before them (the ids stripped)
  const sc0 = E.resolveScene(PC.story.ch09.frames.f112.scene, E.blankCat({ now: 1 }), CH9.map(id => PC.story[id]));
  if (strip(PC.art.render(sc0, { look: E.defaultLook(0) }).svg) !== strip(PC.art.render(sc0, { look: E.defaultLook(0) }).svg)) throw new Error('a drawing differs from itself with its ids stripped');
  const at = process.argv.indexOf('--diff');
  if (at >= 0) {
    const dir = path.resolve(process.argv[at + 1] || '.');
    if (inside(dir)) { console.error('Not into the snapshot: ' + dir); process.exit(1); }
    fs.mkdirSync(dir, { recursive: true });
    runs9(PC, { full: true }).forEach((r, i) => { delete r.end; fs.writeFileSync(path.join(dir, (old ? 'then-' : 'now-') + i + '.json'), JSON.stringify(r, null, 1)); });
    console.log('wrote ' + SCRIPTS9.length + ' runs (' + E.VERSION + ') to ' + dir);
  } else {
    if (!old) { console.error('This tree is not the one chapter 10 is built on (' + VERSION9 + ', found ' + E.VERSION + '): record with GOLDEN_ROOT set to its snapshot (see the top of this file).'); process.exit(1); }
    // the merged tree as the snapshot froze it: the Warrior Counts loaded, the polish release in, no chapter 10 yet
    const ch09src = fs.readFileSync(path.join(root, 'app/story/ch09.js'), 'utf8');
    if (!PC.warrior || PC.warrior.after !== 'ch10') { console.error('No Warrior Counts loaded (PC.warrior.after should be ch10): not the merged tree.'); process.exit(1); }
    if (!/\bMENDER_WING\b/.test(ch09src)) { console.error('No polish release in app/story/ch09.js (MENDER_WING): not the snapshot.'); process.exit(1); }
    if (PC.story.ch10) { console.error('This tree has a chapter 10: record from the snapshot taken before it.'); process.exit(1); }
    const file = path.join(__dirname, 'ch09-golden.json');
    if (inside(file)) { console.error('Not into the snapshot: ' + file); process.exit(1); }
    const commit = fs.existsSync(path.join(root, 'COMMIT')) ? fs.readFileSync(path.join(root, 'COMMIT'), 'utf8').trim() : null;
    const t0 = Date.now(), ctx = context9(PC), full = SCRIPTS9.map(s => run9(ctx, s));
    const moved = ctx.draw.recheck();
    if (moved.length) { console.error(moved.length + ' drawings hash differently a second time (an id the strip misses), e.g. ' + moved[0].slice(0, 200)); process.exit(1); }
    console.log('every one of ' + ctx.draw.memo.size + ' drawings hashes the same when drawn again');
    const out = { engine: E.VERSION, commit, recorded: new Date().toISOString().slice(0, 10), runs: full.map(r => ({ name: r.name, run: compact9(r) })) };
    fs.writeFileSync(file, JSON.stringify(out));
    console.log('wrote tests/fixtures/ch09-golden.json: ' + out.runs.length + ' scripts with engine ' + E.VERSION + ' from ' + commit + ' (' + (Date.now() - t0) + ' ms, ' + fs.statSync(file).size + ' bytes)');
  }
}

module.exports = { SCRIPTS9, VERSION9, CH9, NOW, runs9, run9, compact9, context9, pagesOf9, warriorOf, nine };
