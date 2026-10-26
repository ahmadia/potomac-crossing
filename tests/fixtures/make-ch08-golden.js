/* Records tests/fixtures/ch08-golden.json: chapters 1 to 8 read through the engine, the art and the
 * page's pure words as they were when chapter 8 shipped (0.8.0, commit b6a8d4f, with the depth hotfix of
 * 83313a1: see the end of this comment), before chapter 9's build touched anything. Run once, in a process of its own, against the snapshot of that tree:
 *
 *   GOLDEN_ROOT=/Users/aron/potomac-crossing-work/ch09/shipped node tests/fixtures/make-ch08-golden.js
 *
 * (the snapshot holds app/, index.html and tests/_load.js: chapter 9's spec, section 10, step 1; it
 * refuses any engine but 0.8.0's, and never writes into the snapshot). tests/golden-ch08.test.js reads
 * the same scripts through today's tree and compares the digests, so chapters 1 to 8 play and render
 * exactly as they did for every live save. What one frame shows is make-ch06-golden.js's record (its
 * `frameRecord`: the scene with her options filled in and a hash of the art's drawing of it, ids
 * stripped; the captions and what Read to me says of them; the balloons with their speakers' labels and
 * voices; the options and their labels; the card under the panel and its drawing; the pages she taps; her
 * whole Case File with every card drawn, the rows it lays out with their lines (the brag's row of four
 * among them, with its two lines); every skip-count tap by tap), and beside it, on a Counts frame, what
 * the page says over its first question and after its last (ui.js's `lessonIntro` over the frame's
 * balloons, and the set's `done` line, in its teacher's voice: `said`). Every lesson is make-ch06-golden.js's
 * walk (every question, its pictures, words, result and line, the whole help hop by hop, each drawn),
 * and so are the Training Hollow and its lines (the 4s' rounds among them), her book with its dragonets,
 * the grown-ups corner's words for her flags, E.factTables and the cat. Card links are digested as
 * make-ch06-golden.js digests them ({ with, line, drawn }). Beside them, in the open so the test can name
 * each delta, what a later chapter may move: her book's teaser (`teaser`), the grown-ups corner's tables
 * (`tables`: [table, heading, a hash of its rows]) and the hub (`hub`: E.upNext and E.progress for her, as
 * ids); and, so the test can name it, what chapter 9's one edit to shipped story code must not move: her
 * book's chapter 4 page and Squall's page, word for word (`pages`).
 *
 * The scripts are chapter 7's twelve (make-ch07-golden.js: every specialty and worry, told and kept, both
 * chapter 2 paths, the roofs and "Not today", Puddle, Wisp and Sleet found and not, slow and quick, a tom,
 * FLEW caught and a reread of chapters 1, 4 and 5, chapter 7's misses, its known issue 15), each reading
 * chapter 8 too, and two more (nobody found before Hail, a kept cat, who reads chapter 8 again by the
 * other route; a cat who met Squall in chapter 5 and finds Hail). Between them, chapter 8: both routes, the
 * fork both ways on both paths, every specialty's way past the dogs on the field route ("Not tonight."),
 * Hail found (by a cat who has found every dragonet, some, and none) and "Not tonight.", the fox both ways
 * on both paths, "I’m sorry." and "But I found the THIEVES!", a tom, slow and quick, Sleet cats with the
 * brag's row of four, and misses of every kind in its sets: the pile (once, twice, its fillers); the
 * warm-up's hard pick from a chapter-7 miss or a slow 5 × 6, and a miss on it; the fours' twins and the
 * 8 × 4 check after a missed 4 × 8; the twenty-eight twice; Hail's riddle missed three times; Snip's share
 * told and kept, with a missed one-night filler; and chapter 8's two known slips (its spec, section 7,
 * items 14 and 15): the three misses that make Hail's riddle lend its own 4 × 4 back, and the two that
 * make the warm-up lend its own 2 × 6 back. Between them, every frame of chapters 1 to 8 is shown by some
 * reading.
 *
 *   node tests/fixtures/make-ch08-golden.js --diff DIR   writes the whole of each run as today's tree plays
 *   it to DIR/now-N.json (with GOLDEN_ROOT at the snapshot: as that tree plays it, to DIR/then-N.json), to diff.
 *
 * Re-recorded 2026-10-26 for the depth hotfix (Charlie's bug, chapter 8 f030: a cat further back was
 * drawn over a nearer cat's face; commit 83313a1, live before chapter 9). The snapshot is b6a8d4f plus
 * the depth hotfix: its app/story/ch06.js, ch07.js and ch08.js are the hotfix's (`git show
 * 83313a1:app/story/chNN.js`), so ch06 f004, f107, f109, ch07 f018, f021, f077, f079 to f082 and ch08
 * f009, f030 list the cat at `crowd-2` first, as the live tree has them; nothing else (the hotfix keeps
 * engine 0.8.0). Only those twelve frames' `shown` digests and `recorded` moved. Record again the same way.
 * Not a test file.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { clone, hash } = require('./golden.js');
const G6 = require('./make-ch06-golden.js');
const G7 = require('./make-ch07-golden.js');
const { strip, treeAt } = G6;

const VERSION8 = '0.8.0 (chapter 8, 2026-10-21)';
const CH8 = G7.CH7.concat(['ch08']);

/* ------------------------------------------------------------------ the scripts */
const SPEC = { noticing: 0, sneaking: 1, climbing: 2, swimming: 3, friends: 4 }, WORRY = { small: 0, water: 1, talk: 2, shiny: 3 };
// make-ch06-golden.js's routing picks, for the two new cats
function who(o) {
  const p = { 'ch01:f014': SPEC[o.spec], 'ch01:f066': WORRY[o.worry], 'ch02:f084': o.path === 'river' ? 1 : 0, 'ch03:f086': o.told ? 0 : 1, 'ch04:f075': o.roof4 ? 0 : 1,
    'ch05:f021': o.roof5 ? 0 : 1, 'ch05:f057': o.raft === 'lean' ? 0 : 1, 'ch05:f066': o.first === 'heron' ? 1 : 0, 'ch05:f121': o.raft === 'ask' ? 0 : 1,
    'ch06:f048': o.sleet ? 0 : 1, 'ch06:f034': o.unfair ? 0 : 1 };
  ['ch05:f098', 'ch05:f100a', 'ch05:f101a'].forEach((id, i) => { p[id] = i < (o.wait || 0) ? 0 : 1; });
  return Object.assign(p, o.more || {});
}
/* Chapter 8's choices (none sets anything): the route at the tunnel's mouth (f036: the tunnel, or around the
 * Barking Field), the fork in the tunnel (told f045, kept f047: the left way or the right), the hollow log
 * (f062: “Who’s in the log?”, or “Not tonight.” and her specialty's way past the dogs), the fox (told f118,
 * kept f120: glare, or the tongue), and at home on the kept path (f152: “I’m sorry.”, or “But I found the
 * THIEVES!”). Every one is picked by the script, never by `choiceIndex`. */
function way(o) {
  return { 'ch08:f036': o.route === 'field' ? 1 : 0, 'ch08:f045': o.fork === 'right' ? 1 : 0, 'ch08:f047': o.fork === 'right' ? 1 : 0, 'ch08:f062': o.hail ? 0 : 1,
    'ch08:f118': o.fox === 'tongue' ? 1 : 0, 'ch08:f120': o.fox === 'tongue' ? 1 : 0, 'ch08:f152': o.sorry === false ? 1 : 0 };
}
const S7 = G7.SCRIPTS7;
const every = (x) => { const o = {}; CH8.forEach(c => { o[c] = Object.assign({}, x); }); return o; };
// chapter 7's script i, reading chapter 8 as `w` and `ch08` say (its name says what chapter 8 adds)
const on7 = (i, more, w, ch08, extra) => Object.assign({}, S7[i], { name: S7[i].name + '; chapter 8: ' + more, pick: Object.assign({}, S7[i].pick || {}, way(w)), ch08 }, extra || {});
const SCRIPTS8 = [
  on7(0, 'around the field, told, “Not tonight.” and noticing past the dogs, a glare; clean and quick', { route: 'field', hail: false }, { ms: 2000 }),
  on7(1, 'around the field, kept, “Not tonight.” and sneaking past the dogs; the tongue; “I’m sorry.”; clean', { route: 'field', hail: false, fox: 'tongue' }, { ms: 3500 }),
  on7(2, 'around the field, told, “Not tonight.” and climbing past the dogs; one off: the pile, the warm-up’s hard pick (her chapter-7 miss), the fours’ 4 × 4 and twins (4 × 7, 4 × 8: the 8 × 4 check after a missed 4 × 8), the twenty-eight, Snip’s share',
    { route: 'field', hail: false }, { ms: 2000, miss: ['3x10', '6x7', '6x8', '4x4', '4x7', '4x8', '2x7'] }),
  on7(3, 'around the field, kept, “Not tonight.” and swimming past the dogs; the tongue; ten off: the pile, the fours’ 4 × 4 and 4 × 7, the twenty-eight, Riffle’s share',
    { route: 'field', hail: false, fox: 'tongue' }, { ms: 2500, wrongBy: 10, miss: ['3x10', '4x4', '4x7', '2x7'] }),
  on7(4, 'around the field, kept, “Not tonight.” and friends past the dogs, a glare; every answer wrong, the retries and the fillers too (Riffle’s one-night filler among them, and the 8 × 4 check); “But I found the THIEVES!”',
    { route: 'field', hail: false, sorry: false }, { allWrong: true }),
  on7(5, 'the tunnel, kept, the left way, the tongue, “I’m sorry.”; the tom misses 2 × 4 and 4 × 8, slow under the long prompts, quick on 3 × 4 and 10 × 4; Riffle’s share missed and then its one-night filler',
    { route: 'tunnel', fork: 'left', fox: 'tongue' }, { miss: ['2x4', '4x8'], ms: 4500, msFor: { '3x4': 2000, '10x4': 2000 }, plan: { 'ch08-riffle': [0, 0, 1, 1, 1, 1, 1] } }),
  on7(6, 'the tunnel, told, the left way; answer by answer: the pile twice, the warm-up’s hard pick (5 × 6, her chapter-7 miss) and its filler missed (so it lends its own 2 × 6 back), the fours’ 4 × 4 missed three times and 4 × 7 once, the twenty-eight twice, Snip’s share and its one-night filler',
    { route: 'tunnel', fork: 'left' }, { ms: 2000, plan: { 'ch08-pile': [0, 1, 1, 0, 1, 1, 1], 'ch08-sixes': [0, 1, 0, 1, 1, 1], 'ch08-fours': [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      'ch08-gone': [0, 1, 1, 0, 1, 1, 1], 'ch08-snip': [0, 0, 1, 1, 1, 1, 1] } }),
  on7(7, 'around the field, told, “Not tonight.” and sneaking past the dogs, the tongue; slow everywhere: the warm-up opens on her slow 5 × 6', { route: 'field', hail: false, fox: 'tongue' }, { ms: 6500 }),
  on7(8, 'around the field, told, “Not tonight.” and friends past the dogs; three off: the warm-up’s hard pick (6 × 6), 4 × 8, the twenty-eight twice', { route: 'field', hail: false },
    { ms: 3000, wrongBy: 3, miss: ['6x6', '4x8'], plan: { 'ch08-gone': [0, 1, 1, 0, 1, 1, 1] } }),
  on7(9, 'around the field, told, Hail (with Puddle and Wisp, before Squall); clean, before the rereads', { route: 'field', hail: true }, { ms: 2000 }),
  on7(10, 'around the field, told, Hail (every dragonet before her), the tongue; answer by answer: the pile and its first filler, the warm-up’s hard pick (her chapter-7 8 × 6) missed, the fours’ twins in a row, and Hail’s riddle lends its own 4 × 4 back after three misses',
    { route: 'field', hail: true, fox: 'tongue' }, { ms: 1500, plan: { 'ch08-pile': [0, 0, 1, 1, 1, 1, 1], 'ch08-sixes': [0, 1, 1, 1, 1], 'ch08-fours': [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      'ch08-hail': [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1] } }),
  on7(11, 'told now (chapter 3 again), the tunnel, the right way; misses “YOUR count”, 4 × 6', { route: 'tunnel', fork: 'right' }, { ms: 2500, miss: ['4x6'] }),
  Object.assign({ name: 'nobody found before Hail: swimming, shiny, river, kept, “I’m braver than I look.”; not today twice; no Puddle, no Wisp, the heron first and “Who told you that?”, no Sleet; around the field, Hail, a glare, “But I found the THIEVES!”; Riffle’s share missed twice; then chapter 8 again by the tunnel (the right way, the tongue), chapter 1 again as a climber, and chapter 8 a third time around the field, “Not tonight.” (the log’s “Go and see Hail again.”) and climbing past the dogs: Hail stays found',
    pick: Object.assign(who({ spec: 'swimming', worry: 'shiny', path: 'river', told: false, raft: 'fine', first: 'heron', wait: 0, sleet: false, more: { 'ch01:f045': 2, 'ch05:f132': 0 } }),
      way({ route: 'field', hail: true, sorry: false })) },
  every({ ms: 2500 }), { ch08: { ms: 2500, plan: { 'ch08-riffle': [0, 1, 1, 0, 1, 1, 1] } } },
  { reread: [{ chapter: 'ch08', pick: way({ route: 'tunnel', fork: 'right', fox: 'tongue' }), cfg: { ms: 2500 } }, { chapter: 'ch01', pick: { 'ch01:f014': SPEC.climbing } },
    { chapter: 'ch08', pick: way({ route: 'field', hail: false }), cfg: { ms: 2500 } }] }),
  Object.assign({ name: 'up in chapter 5, then Hail: climbing, talk, bridge, told; not today in chapter 4, up in chapter 5 (the climber’s way up); Puddle under the raft, no Wisp, Sleet; around the field, Hail, the tongue; Hail’s riddle missed three times',
    pick: Object.assign(who({ spec: 'climbing', worry: 'talk', path: 'bridge', told: true, roof5: true, raft: 'lean', wait: 0, sleet: true }), way({ route: 'field', hail: true, fox: 'tongue' })) },
  every({ ms: 3000 }), { ch08: { ms: 3000, plan: { 'ch08-hail': [0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1] } } })
];

/* ------------------------------------------------------------------ one reading, and what the page says round a lesson */
/* A Counts frame's words round its lesson, as the page says them (ui.js): the frame's balloons said again
 * over the first question (`lessonIntro`: none when the frame says `intro: false`, after a kept skip picture,
 * or over a whole conversation), and the set's closing line in its teacher's voice (none when `done` is
 * empty: the next frame answers). Null for any other frame. */
function countsSaid(ctx, story, id, cat) {
  const { E, UI } = ctx, f = story.frames[id];
  if (!f || !f.counts) return null;
  const def = (story.counts || {})[f.counts.set] || {}, fill = (t) => E.fill(t == null ? '' : t, cat);
  const said = E.balloons(f, cat).map(b => [b.who || '', fill(b.text || '')]);
  const skip = f.counts.intro === false || !!E.keptSkip(story, id, cat);
  const intro = UI ? UI.speakers.lessonIntro(said, skip) : (skip || said.length > 2 ? [] : said);
  return { set: f.counts.set, intro, done: def.done === '' || def.done == null ? null : [def.teacher || 'tallyheart', fill(def.done)] };
}
/* Her book's chapter 4 page and Squall's page, word for word (null where she has none). */
function pagesOf(book) {
  const ch4 = (book.pages || []).find(p => p.id === 'ch04'), sq = ((book.dragonets && book.dragonets.found) || []).find(d => d.id === 'squall');
  return clone({ ch04: ch4 || null, squall: sq || null });
}
/* A whole script: make-ch07-golden.js's run7 over chapters 1 to 8 (her readings in order, chapter 7 left and
 * picked up again where the script says, then her rereads; a Training Hollow round of every Count she has
 * learned; her book; the grown-ups corner; her cards, file and tables; the hub; the cat), with each Counts
 * frame's words round its lesson (`said`, on the reading) and her book's two pages (`pages`). She reads the
 * chapters in `ctx.read` (unset: `ctx.list`, chapters 1 to 8); the engine is handed `ctx.list` everywhere
 * else, so the test's second pass can hand it every story loaded, as the page does (`PC.story`). */
function run8(ctx, script) {
  const sink = [], before = ctx.onFrame;
  const c = Object.assign({}, ctx, { onFrame: (cat, story, id) => { sink.push(countsSaid(ctx, story, id, cat)); if (before) before(cat, story, id); } });
  const run = G7.run7(c, script);
  let k = 0;
  run.readings.forEach(r => { r.said = r.frames.map(id => [id, sink[k++]]).filter(x => x[1]); });
  if (k !== sink.length) throw new Error(script.name + ': ' + sink.length + ' frames seen, ' + k + ' read');
  run.pages = pagesOf(run.book);
  // the grown-ups corner's words for her chapter 3 choice, in the open (spec section 7, item 16: the kept words stay)
  run.told = (run.corner || []).find(x => x[0] === 'ch3Told') || null;
  return run;
}

/* ------------------------------------------------------------------ small */
/* A run, small, as make-ch07-golden.js's compact7 has it, made smaller so eight chapters fit in about the
 * room seven took: each reading's frames in order (one string, ids apart by spaces), its choices, a hash of
 * what each frame shows, each Counts frame's words round its lesson as `frame:hash`, and every answer as a
 * row [a × b, what kind of ask, the set it is asked as ('' when it is the lesson's own), right?, the kind of
 * line, a hash of the whole row: its words, pictures, drawings, result, line and help]; the Hollow rounds
 * the same way (their queue as words); her book, the corner, her cards and file, the cat as hashes beside
 * the flags and the status; and in the open what a later chapter may move (her book's teaser, the corner's
 * tables as [table, heading, a hash of its rows], the hub) and what must not (her book's chapter 4 page and
 * Squall's page word for word; the corner's words for ch3Told). */
const tag = (q) => (q.retry ? 'retry' : q.filler ? 'filler' : q.hard ? 'hard' : 'ask');
const rowsOf = (rows, own) => rows.map(r => [r.q.a + ' × ' + r.q.b, tag(r.q), r.as === own ? '' : r.as, r.res.correct ? 1 : 0, r.res.lineKind, hash(r)]);
function compact8(run) {
  return clone({
    readings: run.readings.map(r => Object.assign({ chapter: r.chapter, frames: r.frames.join(' '), picked: r.picked.join(' '),
      shown: r.shown.map(x => (typeof x === 'string' ? x : hash(x))).join(' '), said: r.said.map(([id, s]) => id + ':' + hash(s)).join(' '),
      lessons: Object.keys(r.lessons).map(k => [k, rowsOf(r.lessons[k], k)]) }, r.left ? { left: r.left } : {}, r.resumed ? { resumed: true } : {})),
    hollow: run.hollow.map(h => {
      const own = h.rows.length ? h.rows[0].as : null;
      return { table: h.table, setId: h.setId, as: own, queue: h.queue.map(x => x[0] + '×' + x[1] + (x[2] ? ' hard' : '') + (x[3] ? ' retry' : '') + (x[4] ? ' filler' : '')).join(', '),
        rows: rowsOf(h.rows, own), awarded: h.awarded, says: hash(h.says) };
    }),
    book: hash(Object.assign({}, run.book, { teaser: null })), teaser: run.book.teaser, pages: run.pages,
    corner: hash(run.corner), told: run.told,
    extra: hash(Object.assign({}, run.extra, { tables: null })), tables: run.extra.tables.map(t => [t.table, t.name, hash(t.rows)]),
    hub: run.hub, cat: hash(run.cat), flags: run.cat.flags, status: run.cat.status
  });
}
/* make-ch06-golden.js's drawer, memoized by the drawing's arguments as JSON instead of in canonical order
 * (the canonical form costs more than the drawing's lookup is worth, frame after frame): every drawing
 * hashes exactly as that drawer hashes it, and the same arguments written in another key order are only
 * drawn twice, never merged. */
function drawer8(A) {
  const memo = new Map(), fns = new Map();
  const make = (fn) => {
    let r;
    try { r = fn(); } catch (e) { r = { error: String(e && e.message) }; }
    return r && r.error ? 'error: ' + r.error : hash(typeof r === 'string' ? strip(r) : { svg: strip(r && r.svg), heads: r && r.heads, keep: r && r.keep });
  };
  const once = (kind, arg, fn) => {
    const key = kind + ' ' + JSON.stringify(arg);
    let v = memo.get(key);
    if (v === undefined) { v = make(fn); memo.set(key, v); fns.set(key, fn); }
    return v;
  };
  return {
    memo,
    recheck: () => [...fns.keys()].filter(k => make(fns.get(k)) !== memo.get(k)),
    scene: (scene, look) => (scene ? once('scene', { scene, look }, () => A.render(scene, { look })) : null),
    counts: (po, look) => once('counts', Object.assign({}, po, { look }), () => A.countsPicture(Object.assign({}, po, { look }))),
    sand: (o) => once('sand', o, () => A.sand(o)),
    card: (o) => once('card', o, () => A.card(o))
  };
}
/* chapters 1 to 8 of a tree, handed to the engine (opts.list overrides, opts.read is what she reads) */
function context8(PC, opts) { return G6.context(PC, Object.assign({ list: CH8.map(id => PC.story[id]), draw: drawer8(PC.art) }, opts || {})); }
function runs8(PC, opts) {
  const ctx = context8(PC, opts);
  return SCRIPTS8.map(s => run8(ctx, s));
}

if (require.main === module) {
  const root = process.env.GOLDEN_ROOT ? path.resolve(process.env.GOLDEN_ROOT) : path.join(__dirname, '..', '..');
  const inside = (p) => { const r = path.relative(root, path.resolve(p)); return process.env.GOLDEN_ROOT && (r === '' || (!r.startsWith('..') && !path.isAbsolute(r))); };
  const PC = treeAt(root), E = PC.engine;
  const old = E.VERSION === VERSION8;
  // the drawings are the same however many came before them (the ids stripped)
  const sc0 = E.resolveScene(PC.story.ch08.frames.f093.scene, E.blankCat({ now: 1 }), CH8.map(id => PC.story[id]));
  if (strip(PC.art.render(sc0, { look: E.defaultLook(0) }).svg) !== strip(PC.art.render(sc0, { look: E.defaultLook(0) }).svg)) throw new Error('a drawing differs from itself with its ids stripped');
  const at = process.argv.indexOf('--diff');
  if (at >= 0) {
    const dir = path.resolve(process.argv[at + 1] || '.');
    if (inside(dir)) { console.error('Not into the snapshot: ' + dir); process.exit(1); }
    fs.mkdirSync(dir, { recursive: true });
    runs8(PC, { full: true }).forEach((r, i) => { delete r.end; fs.writeFileSync(path.join(dir, (old ? 'then-' : 'now-') + i + '.json'), JSON.stringify(r, null, 1)); });
    console.log('wrote ' + SCRIPTS8.length + ' runs (' + E.VERSION + ') to ' + dir);
  } else {
    if (!old) { console.error('This tree is not chapter 8’s (' + VERSION8 + ', found ' + E.VERSION + '): record with GOLDEN_ROOT set to the chapter-8 snapshot (see the top of this file).'); process.exit(1); }
    const file = path.join(__dirname, 'ch08-golden.json');
    if (inside(file)) { console.error('Not into the snapshot: ' + file); process.exit(1); }
    const t0 = Date.now(), ctx = context8(PC), full = SCRIPTS8.map(s => run8(ctx, s));
    const moved = ctx.draw.recheck();
    if (moved.length) { console.error(moved.length + ' drawings hash differently a second time (an id the strip misses), e.g. ' + moved[0].slice(0, 200)); process.exit(1); }
    console.log('every one of ' + ctx.draw.memo.size + ' drawings hashes the same when drawn again');
    const out = { engine: E.VERSION, recorded: new Date().toISOString().slice(0, 10), runs: full.map(r => ({ name: r.name, run: compact8(r) })) };
    fs.writeFileSync(file, JSON.stringify(out));
    console.log('wrote tests/fixtures/ch08-golden.json: ' + out.runs.length + ' scripts with engine ' + E.VERSION + ' (' + (Date.now() - t0) + ' ms, ' + fs.statSync(file).size + ' bytes)');
  }
}

module.exports = { SCRIPTS8, VERSION8, CH8, runs8, run8, compact8, context8, drawer8, countsSaid, pagesOf, way };
