/* Records tests/fixtures/ch07-golden.json: chapters 1 to 7 read through the engine, the art and the
 * page's pure words as they were when chapter 7 shipped (0.7.0, commit 0381bc8), before chapter 8's
 * build touched anything. Run once, in a process of its own, against the snapshot of that tree:
 *
 *   GOLDEN_ROOT=/Users/aron/potomac-crossing-work/ch08/shipped node tests/fixtures/make-ch07-golden.js
 *
 * (the snapshot holds app/, index.html and tests/_load.js: chapter 8's spec, section 10, step 1; it
 * refuses any engine but 0.7.0's). tests/golden-ch07.test.js reads the same scripts through today's
 * tree and compares the digests, so chapters 1 to 7 play and render exactly as they did for every live
 * save. What one frame shows is make-ch06-golden.js's record (its `frameRecord`: the scene with her
 * options filled in and a hash of the art's drawing of it, ids stripped; the captions and what Read to
 * me says of them; the balloons with their speakers' labels and voices; the options and their labels;
 * the card under the panel and its drawing; the pages she taps; her whole Case File with every card
 * drawn; every skip-count tap by tap), and so is every lesson (every question, its pictures, words,
 * result and line, the whole help hop by hop, each drawn), the Training Hollow and its lines, her book
 * with its dragonets, the grown-ups corner's words for her flags, E.factTables and the cat. Card links
 * are digested as make-ch06-golden.js digests them ({ with, line, drawn }). Beside them, this file
 * records what a later chapter may move, in the open so the test can name each delta: her book's
 * teaser (`teaser`), the grown-ups corner's tables (`tables`: [table, heading, a hash of its rows]),
 * and the hub (`hub`: E.upNext and E.progress for her, as ids).
 *
 * The scripts are chapter 6's ten (every specialty and worry, told and kept, both chapter 2 paths,
 * the roofs and "Not today", Puddle, Wisp and Sleet found and not, slow and quick, a tom with his own
 * names, a noticing cat who catches FLEW and rereads chapters 1, 4 and 5), each reading chapter 7 too
 * with misses of its own (the pile; the warm-up's hard pick, from a chapter-6 miss or a slow answer, and
 * a miss on it; the sixes' twins in a row, 6 × 6, the 8 × 6 check; the twenty-four twice; the told and
 * the kept sixty), and two more: a quick cat whose chapter-6 miss of 3 × 8 is the warm-up's hard pick,
 * who misses every chapter-7 set answer by answer (the pile twice, 6 × 6, 6 × 8 and then its 8 × 6
 * check, the twenty-four twice, the told sixty twice); and chapter 7's known issue 15:
 * a kept cat who leaves chapter 7 for the hub between its two sums, reads chapter 3 again and tells
 * Tallyheart this time, then picks chapter 7 up where she left it (E.openChapter, as the hub's resume
 * does) and finishes it without `my-count`.
 *
 *   node tests/fixtures/make-ch07-golden.js --diff DIR   writes the whole of each run as today's tree plays
 *   it to DIR/now-N.json (with GOLDEN_ROOT at the snapshot: as that tree plays it, to DIR/then-N.json), to diff.
 *
 * Re-recorded 2026-10-25 for the depth hotfix (Charlie's bug, chapter 8 f030: a cat further back was
 * drawn over a nearer cat's face). The copy of the snapshot had the cast lists of ch06 f004, f107, f109
 * and ch07 f018, f021, f077, f079, f080, f081, f082 put back to front (the cat at `crowd-2` first), as
 * the live tree has them; nothing else. Only those frames' `shown` digests and `recorded` moved.
 * Record again the same way.
 * Not a test file.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { clone, hash } = require('./golden.js');
const G6 = require('./make-ch06-golden.js');
const { frameRecord, readChapter, fileDigest, cardsDigest, strip, treeAt } = G6;

const VERSION7 = '0.7.0 (chapter 7, 2026-10-20)';
const CH7 = G6.CH.concat(['ch07']);

/* ------------------------------------------------------------------ the scripts */
const SPEC = { noticing: 0, sneaking: 1, climbing: 2, swimming: 3, friends: 4 }, WORRY = { small: 0, water: 1, talk: 2, shiny: 3 };
// make-ch06-golden.js's routing picks (chapter 7's six choices set nothing and take the script's `choiceIndex`)
function who(o) {
  const p = { 'ch01:f014': SPEC[o.spec], 'ch01:f066': WORRY[o.worry], 'ch02:f084': o.path === 'river' ? 1 : 0, 'ch03:f086': o.told ? 0 : 1, 'ch04:f075': o.roof4 ? 0 : 1,
    'ch05:f021': o.roof5 ? 0 : 1, 'ch05:f057': o.raft === 'lean' ? 0 : 1, 'ch05:f066': o.first === 'heron' ? 1 : 0, 'ch05:f121': o.raft === 'ask' ? 0 : 1,
    'ch06:f048': o.sleet ? 0 : 1, 'ch06:f034': o.unfair ? 0 : 1 };
  ['ch05:f098', 'ch05:f100a', 'ch05:f101a'].forEach((id, i) => { p[id] = i < (o.wait || 0) ? 0 : 1; });
  return Object.assign(p, o.more || {});
}
const S6 = G6.SCRIPTS6;
// chapter 6's script i, reading chapter 7 as `ch07` says (its name says what chapter 7 adds)
const on6 = (i, more, ch07) => Object.assign({}, S6[i], { name: S6[i].name + '; chapter 7: ' + more, ch07 });
const SCRIPTS7 = [
  on6(0, 'clean and quick', { ms: 2000 }),
  on6(1, 'clean, kept, quick enough', { ms: 3500 }),
  on6(2, 'the warm-up’s hard pick from her chapter-6 misses; one off at the pile, the sixes’ twins in a row (6 × 4, 6 × 7, 6 × 8) and the told sixty',
    { ms: 2000, miss: ['3x10', '6x4', '6x7', '6x8', '10x6'] }),
  on6(3, 'ten off: the pile, 6 × 6, the 8 × 6 check itself, the twenty-four and the kept sixty (Riffle’s), every miss landing on a zero',
    { ms: 2500, wrongBy: 10, miss: ['3x10', '6x6', '8x6', '4x6', '10x6'] }),
  on6(4, 'every answer wrong, the retries and the fillers too', { allWrong: true }),
  on6(5, 'the tom misses the stepping stones and a twin, slow under the long prompts, quick on 5 × 6; misses Riffle’s sixty',
    { miss: ['2x6', '5x6', '6x3', '7x6', '10x6'], ms: 4500, msFor: { '5x6': 2000 } }),
  on6(6, 'answer by answer: the pile’s retry and its fillers, the warm-up’s retry, the sixes’ retries missed again, the twenty-four twice, the dragon’s sixty’s fillers',
    { ms: 2000, plan: { 'ch07-pile': [0, 0, 1, 0, 1, 1, 1], 'ch07-threes': [1, 0, 1, 0, 1, 1, 1], 'ch07-sixes': [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      'ch07-gone': [0, 1, 1, 0, 1, 1, 1, 1], 'ch07-dragon': [0, 0, 1, 1, 1, 1] } }),
  on6(7, 'slow everywhere: the warm-up picks her slowest 3s fact and remembers it slow', { ms: 6500 }),
  on6(8, 'three off: the warm-up’s hard pick (3 × 3), 6 × 6 and the told sixty; the twenty-four missed twice', { ms: 3000, wrongBy: 3, miss: ['3x3', '6x6', '10x6'], plan: { 'ch07-gone': [0, 1, 1, 0, 1, 1, 1] } }),
  on6(9, 'I KNEW it, on the told path, before the rereads', { ms: 2000 }),
  Object.assign({ name: 'quick and sharp: friends, small, bridge, told, up in chapter 4; Puddle, Wisp, Sleet; misses only 3 × 8 in chapter 6, so the warm-up asks it first and remembers it quick; in chapter 7 misses every set answer by answer: the pile twice, 6 × 6, 6 × 8 and then its 8 × 6 check, the twenty-four twice, the told sixty twice',
    pick: who({ spec: 'friends', worry: 'small', path: 'bridge', told: true, roof4: true, raft: 'lean', wait: 3, sleet: true }) },
  (() => { const o = {}; G6.CH.forEach(c => { o[c] = { ms: 1500 }; }); return o; })(), { ch06: { ms: 1500, miss: ['3x8'] } },
  { ch07: { ms: 1500, plan: { 'ch07-pile': [0, 1, 1, 0, 1, 1, 1], 'ch07-threes': [1, 1], 'ch07-sixes': [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    'ch07-gone': [0, 1, 1, 0, 1, 1, 1, 1], 'ch07-dragon': [0, 1, 1, 0, 1, 1, 1, 1] } } }),
  // chapter 7's known issue 15: kept, she leaves chapter 7 at the kept "Back by sunset." (between the twenty-four
  // and the sixty), reads chapter 3 again and tells, and comes back: the page no longer shows, so she lands on
  // the told path's next page and finishes with fourteen typed answers and no `my-count`
  Object.assign({ name: 'chapter 7’s known issue 15: sneaking, small, bridge, kept, up in chapter 4, Puddle, Wisp, Sleet; she leaves chapter 7 between its two sums, reads chapter 3 again and tells this time, then finishes chapter 7 where she left it',
    pick: who({ spec: 'sneaking', worry: 'small', path: 'bridge', told: false, roof4: true, raft: 'lean', wait: 3, sleet: true }),
    leave: { chapter: 'ch07', at: 'f046', then: [{ chapter: 'ch03', pick: { 'ch03:f086': 0 } }] } },
  (() => { const o = {}; CH7.forEach(c => { o[c] = { ms: 2500 }; }); return o; })(), { ch07: { ms: 2500, miss: ['3x10', '6x8'] } })
];

/* ------------------------------------------------------------------ one reading, in parts */
/* make-ch06-golden.js's lesson walk (module-private there), unchanged: one lesson, answer by answer, as
 * the page asks it, every question's words and pictures (each drawn), its result, and after a miss the
 * whole help, hop by hop, drawn at every hop. */
function answerFor(q, s) {
  const by = s.wrongBy || 1;
  if (s.allWrong) return q.answer + by;
  return (s.miss || []).includes(q.a + 'x' + q.b) && !q.retry && !q.filler ? q.answer + by : q.answer;
}
const msFor = (q, s) => { const k = q.a + 'x' + q.b; return s.msFor && s.msFor[k] != null ? s.msFor[k] : (s.ms || 3000); };
function lesson(ctx, cat, story, def, st, s, clock) {
  const { E, draw, list } = ctx, look = clone(cat.look), fill = (t) => E.fill(t == null ? '' : t, cat);
  const rows = [], plan = s.plan && def && s.plan[def.id] ? s.plan[def.id].slice() : null;
  let rec = null;
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), D = E.questionDef(def, q, story, list);
    const asked = E.lessonPicture(D, q, q.lit || 0), light = E.lightSteps(D, q);
    const row = { q: clone(q), as: D.id || null, teacher: E.teacherOf(def, D), ask: E.counts.ask(def, q), generic: E.genericQuestion(D, q),
      prompt: E.promptLines(def, D, q).map(l => Object.assign({}, l, { text: fill(l.text) })),
      asked, askedArt: draw.counts(asked, look), light: clone({ open: light.open, steps: light }),
      lightArt: (light.open ? [light.open] : []).concat(light.map(x => x.picture)).map(p => draw.counts(p, look)) };
    const ok = plan && plan.length ? plan.shift() : null;
    const value = ok == null ? answerFor(q, s) : ok ? q.answer : q.answer + (s.wrongBy || 1);
    const res = E.counts.answer(st, D, value, msFor(q, s), (clock.t += 1000));
    E.logAnswer(cat, res.entry);
    row.res = clone({ correct: res.correct, right: res.right, fast: res.fast, line: res.line, lineKind: res.lineKind, near: res.near, notFive: res.notFive, notTen: res.notTen,
      requeued: res.requeued, done: res.done, balloons: res.balloons, help: res.help, rightPicture: res.rightPicture, shows: res.shows, entry: res.entry });
    row.line = fill(res.line);
    row.balloons = (res.balloons || []).map(b => Object.assign({}, b, { text: fill(b.text) }));
    if (res.correct) {
      const R = res.rightPicture;
      const pic = R ? E.lessonPicture(D, q, (typeof R.groups === 'number' ? R.groups : q.groups) * (typeof R.per === 'number' ? R.per : q.per), R) : E.lessonPicture(D, q, q.groups * q.per);
      row.right = pic; row.rightArt = draw.counts(pic, look);
    } else {
      const hp = E.helpPlan(def, D, q, res), steps = E.helpSteps(hp);
      row.plan = clone(Object.assign({}, hp, { intro: fill(hp.intro), line: fill(hp.line) }));
      row.ground = E.helpGround(def, D, q);
      row.steps = clone(steps);
      row.helpArt = [{ counted: 0 }].concat(steps).map(x => (hp.picture ? draw.counts(E.lessonPicture(D, q, x.counted), look) : draw.sand(E.sandOpts(hp, x.counted, x.rubbed))));
      if (res.shows) row.showsArt = draw.sand(E.answersOpts(hp, res.shows));
    }
    if (res.done) rec = E.recordLesson(cat, st);
    else if (st.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: st };
    else cat.lesson = { mode: st.mode, state: st };
    rows.push(clone(row));
  }
  return { rows, rec };
}
/* make-ch06-golden.js's readChapter, in parts: `how.until` leaves the chapter on that frame (it is
 * recorded, then she goes to the hub without acting on it); `how.open` comes back to the chapter where
 * she left it (E.openChapter, the hub's resume) instead of starting it from its first page. A reading
 * with neither is readChapter's own (and is read by it). */
function readSpan(ctx, cat, story, script, cfg, pick, clock, out, how) {
  if (!how || (!how.until && !how.open)) return readChapter(ctx, cat, story, script, cfg, pick, clock, out);
  const { E } = ctx;
  const reading = { chapter: story.id, frames: [], shown: [], picked: [], lessons: {} };
  if (how.open) { reading.resumed = true; E.openChapter(cat, story, (clock.t += 1000)); }
  else E.startChapter(cat, story, (clock.t += 1000));
  for (let guard = 0; guard < 600; guard++) {
    const id = E.frameId(cat, story), f = story.frames[id], kind = E.kindOf(f), t = (clock.t += 1000);
    reading.frames.push(id);
    const rec = frameRecord(ctx, story, id, cat);
    reading.shown.push(ctx.full ? rec : hash(rec));
    if (ctx.onFrame) ctx.onFrame(cat, story, id);
    if (how.until === id) { reading.left = id; break; }
    if (kind === 'end') break;
    if (kind === 'next' || kind === 'skip' || kind === 'file' || kind === 'ask') E.next(cat, story, t);
    else if (kind === 'scratch') { for (let n = 0; n < 12 && E.scratchTap(cat, story, t); n++); E.next(cat, story, t); }
    else if (kind === 'look') E.confirmLook(cat, story, script.look || { sex: 'she', fur: 'calico', marking: 'white-paws', eyes: 'odd' }, t);
    else if (kind === 'choice') {
      const opts = E.options(f, cat), want = pick[story.id + ':' + id], i = (want != null ? want : (script.choiceIndex || 0)) % opts.length;
      reading.picked.push(id + ':' + i);
      E.choose(cat, story, opts[i].index, t);
    } else if (kind === 'input') {
      const k = f.input.kind;
      const v = k === 'petname' ? (script.petname != null ? script.petname : 'princess sparkle muffin') : k === 'clanname' ? (script.clanname != null ? script.clanname : 'moonpaw')
        : k === 'dream' ? (script.dream != null ? script.dream : 'i dreamed about otters') : '';
      E.submitInput(cat, story, v, t);
    } else if (kind === 'counts') {
      const r = E.chapterLesson(cat, story, f.counts.set, t, ctx.list);
      E.beginLesson(cat, story, id, r.state);
      const L = lesson(ctx, cat, story, r.def, r.state, cfg, clock);
      reading.lessons[f.counts.set] = (reading.lessons[f.counts.set] || []).concat(L.rows);
      E.finishCounts(cat, story, L.rec ? L.rec.summary : E.counts.summary(r.state), (clock.t += 1000));
    } else throw new Error('unknown frame kind at ' + story.id + ' ' + id);
  }
  out.push(reading);
  return reading;
}

/* ------------------------------------------------------------------ one script */
function catSummary(E, cat, list) {
  return clone({ name: cat.name, petname: cat.petname, look: cat.look, flags: cat.flags, choices: cat.choices, finished: Object.keys(cat.finished), dreams: cat.dreams, lessons: cat.lessons,
    counts: cat.counts, nest: cat.nest, hollow: cat.hollow, chapter: cat.chapter, frame: cat.frame, history: cat.history, cards: cat.cards, places: cat.places, status: E.status(cat, list) });
}
const idOf = (s) => (s ? s.id : null);
/* The hub for her: what it offers next, its "coming soon", where she is (E.progress as ids). */
function hubOf(E, cat, list) {
  const p = E.progress(cat, list);
  return clone({ upNext: idOf(E.upNext(cat, list)), next: idOf(p.next), soon: p.soon, latest: idOf(p.latest), reading: idOf(p.reading), atEnd: p.atEnd, page: p.page,
    nextInProgress: p.nextInProgress, nextPage: p.nextPage, finished: p.finished.map(idOf) });
}
/* A whole script: chapters 1 to 7 in order (with chapter 7 left and picked up again where the script
 * says, `leave`), then its rereads, then a Training Hollow round of every Count she has learned (a miss
 * on its first question), her book, the grown-ups corner's words, her cards, file and tables, the hub,
 * the cat: make-ch06-golden.js's run6 over seven chapters. She reads the chapters in `ctx.read` (unset:
 * `ctx.list`, chapters 1 to 7); the engine is handed `ctx.list` everywhere else, so the test's second
 * pass can hand it every story loaded, as the page does (`PC.story`: ui.js, `stories()`). */
function run7(ctx, script) {
  const { E, UI, list } = ctx, read = ctx.read || list, clock = { t: 1000 }, readings = [];
  const cat = E.blankCat({ now: 1, id: 'golden7' });
  const find = (id) => read.find(s => s.id === id);
  read.forEach(story => {
    const L = script.leave && script.leave.chapter === story.id ? script.leave : null, cfg = script[story.id] || {}, pick = script.pick || {};
    if (!L) { readChapter(ctx, cat, story, script, cfg, pick, clock, readings); return; }
    readSpan(ctx, cat, story, script, cfg, pick, clock, readings, { until: L.at });
    L.then.forEach(r => { const s2 = find(r.chapter); readChapter(ctx, cat, s2, script, r.cfg || script[s2.id] || {}, Object.assign({}, pick, r.pick || {}), clock, readings); });
    readSpan(ctx, cat, story, script, cfg, pick, clock, readings, { open: true });
  });
  (script.reread || []).forEach(r => {
    const story = find(r.chapter);
    readChapter(ctx, cat, story, script, r.cfg || script[story.id] || {}, Object.assign({}, script.pick || {}, r.pick || {}), clock, readings);
  });
  const hollow = [];
  E.learnedCounts(cat, list).forEach(c => {
    const r = E.hollowStart(cat, list, (clock.t += 1000), c.table);
    E.holdLesson(cat);
    cat.lesson = { mode: 'hollow', state: r.state };
    const q0 = E.counts.question(r.state);
    const L = lesson(ctx, cat, null, r.def, r.state, { miss: [q0.a + 'x' + q0.b], ms: 2500 }, clock);
    const h = E.hollowLines(cat, list), again = E.hollowLines(cat, list, { reward: true });
    hollow.push({ table: c.table, setId: c.setId, queue: clone(r.state.queue.map(q => [q.a, q.b, !!q.hard, !!q.retry, !!q.filler])), rows: L.rows, awarded: L.rec && L.rec.hollow && L.rec.hollow.awarded && L.rec.hollow.awarded.id,
      says: clone({ greet: h.greet, again: again.greet, glow: h.glow, buttons: h.counts.map(x => x.name), round: E.hollowRoundLine(r.def), glowNote: E.hollowGlowNote(r.def, true), glowNoteOne: E.hollowGlowNote(r.def, false), done: r.def.done }) });
  });
  const b = E.buildFullBook(cat, list);
  const book = clone({ title: b.title, pages: b.pages, teaser: b.teaser, dragonets: b.dragonets });
  const corner = UI ? Object.keys(cat.flags).sort().map(k => [k, UI.flagWords[k] ? E.fill(UI.flagWords[k][String(cat.flags[k])] || '', cat) : null, !!UI.quietFlags[k]]) : null;
  const extra = clone({ all: cardsDigest(E, E.cards(cat, list, { all: true }), cat), file: fileDigest(E, E.caseFile(cat, list), cat),
    learned: E.learnedCounts(cat, list).map(c => [c.table, c.setId]), tables: E.factTables(cat, list), hasFile: E.hasFile(cat) });
  return { name: script.name, readings, hollow, book, corner, extra, hub: hubOf(E, cat, list), cat: catSummary(E, cat, list), end: cat };
}

/* ------------------------------------------------------------------ small */
/* A run, small: make-ch06-golden.js's compact6 (each reading's frames in order with a hash of what each
 * shows, every answer as a readable row and a hash, the Hollow the same way, the rest as hashes beside
 * the flags and the status), with a reading's `left`/`resumed` marks, and what a later chapter may move
 * kept apart and in the open: her book but its teaser (a hash) and the teaser; her cards, file and
 * learned Counts (a hash) and the grown-ups corner's tables as [table, heading, a hash of its rows]; the hub. */
function compact7(run) {
  const c = G6.compact6(run);
  run.readings.forEach((r, i) => { if (r.left) c.readings[i].left = r.left; if (r.resumed) c.readings[i].resumed = true; });
  return clone(Object.assign(c, {
    book: hash(Object.assign({}, run.book, { teaser: null })), teaser: run.book.teaser,
    extra: hash(Object.assign({}, run.extra, { tables: null })), tables: run.extra.tables.map(t => [t.table, t.name, hash(t.rows)]),
    hub: run.hub
  }));
}
/* chapters 1 to 7 of a tree, handed to the engine (opts.list overrides, opts.read is what she reads) */
function context7(PC, opts) { return G6.context(PC, Object.assign({ list: CH7.map(id => PC.story[id]) }, opts || {})); }
function runs7(PC, opts) {
  const ctx = context7(PC, opts);
  return SCRIPTS7.map(s => run7(ctx, s));
}

if (require.main === module) {
  const root = process.env.GOLDEN_ROOT ? path.resolve(process.env.GOLDEN_ROOT) : path.join(__dirname, '..', '..');
  const PC = treeAt(root), E = PC.engine;
  const old = E.VERSION === VERSION7;
  // the drawings are the same however many came before them (the ids stripped)
  const sc0 = E.resolveScene(PC.story.ch07.frames.f029.scene, E.blankCat({ now: 1 }), CH7.map(id => PC.story[id]));
  if (strip(PC.art.render(sc0, { look: E.defaultLook(0) }).svg) !== strip(PC.art.render(sc0, { look: E.defaultLook(0) }).svg)) throw new Error('a drawing differs from itself with its ids stripped');
  const at = process.argv.indexOf('--diff');
  if (at >= 0) {
    const dir = path.resolve(process.argv[at + 1] || '.');
    fs.mkdirSync(dir, { recursive: true });
    runs7(PC, { full: true }).forEach((r, i) => { delete r.end; fs.writeFileSync(path.join(dir, (old ? 'then-' : 'now-') + i + '.json'), JSON.stringify(r, null, 1)); });
    console.log('wrote ' + SCRIPTS7.length + ' runs (' + E.VERSION + ') to ' + dir);
  } else {
    if (!old) { console.error('This tree is not chapter 7’s (' + VERSION7 + ', found ' + E.VERSION + '): record with GOLDEN_ROOT set to the chapter-7 snapshot (see the top of this file).'); process.exit(1); }
    const t0 = Date.now(), ctx = context7(PC), full = SCRIPTS7.map(s => run7(ctx, s));
    const moved = ctx.draw.recheck();
    if (moved.length) { console.error(moved.length + ' drawings hash differently a second time (an id the strip misses), e.g. ' + moved[0].slice(0, 200)); process.exit(1); }
    console.log('every one of ' + ctx.draw.memo.size + ' drawings hashes the same when drawn again');
    const out = { engine: E.VERSION, recorded: new Date().toISOString().slice(0, 10), runs: full.map(r => ({ name: r.name, run: compact7(r) })) };
    fs.writeFileSync(path.join(__dirname, 'ch07-golden.json'), JSON.stringify(out));
    console.log('wrote tests/fixtures/ch07-golden.json: ' + out.runs.length + ' scripts with engine ' + E.VERSION + ' (' + (Date.now() - t0) + ' ms)');
  }
}

module.exports = { SCRIPTS7, VERSION7, CH7, runs7, run7, readSpan, compact7, context7, hubOf };
