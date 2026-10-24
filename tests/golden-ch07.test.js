/* Chapters 1 to 7 as they shipped (chapter 8's spec, section 7, item 2): twelve whole readings recorded
 * from the shipped chapter-7 tree in a process of its own (tests/fixtures/make-ch07-golden.js, from the
 * snapshot taken before chapter 8's build), compared digest by digest with today's tree: (a) with
 * chapters 1 to 7 handed to the engine, exactly; (b) with every loaded story handed to the engine, as
 * the page does (ui.js: `stories()` is `PC.story`), exactly but for what is about the chapter after
 * chapter 7, each delta by name. Chapter 8 may be the orchestrator's STUB (every frame's board 'STUB.')
 * or built; the deltas differ, and the test says which state it ran in. Today's runs are made once and
 * shared (the drawings memoized by what is drawn, which no list touches). */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const G7 = require('./fixtures/make-ch07-golden.js');
const GOLDEN7 = require('./fixtures/ch07-golden.json');

let NOW7 = null;
function now7() {
  if (NOW7) return NOW7;
  const PC = require('./_load.js').load();
  require('../app/ui.js');
  const ctx = G7.context7(PC);
  NOW7 = { PC, ctx, runs: G7.SCRIPTS7.map(s => G7.run7(ctx, s)) };
  return NOW7;
}
let ALL7 = null;
function all7() {
  if (ALL7) return ALL7;
  const { PC, ctx } = now7();
  const all = Object.assign({}, ctx, { read: G7.CH7.map(id => PC.story[id]), list: PC.story });
  ALL7 = G7.SCRIPTS7.map(s => G7.run7(all, s));
  return ALL7;
}
/* Chapter 8 as loaded: 'absent', the orchestrator's 'stub' (every frame's board "STUB.", as
 * tests/engine.test.js's teaser test tells a placeholder), or 'built'. */
function chapter8(PC) {
  const s = PC.story.ch08;
  if (!s || !s.frames) return 'absent';
  return Object.values(s.frames).every(f => /^STUB\b/.test(f.board || '')) ? 'stub' : 'built';
}
const firstAsks = (cat, re) => (cat.counts || []).filter(e => e && re.test(e.set || '') && !e.retry && !e.filler);
const ch07Rows = (run) => run.readings.filter(r => r.chapter === 'ch07').reduce((a, r) => a.concat(...Object.keys(r.lessons).map(k => r.lessons[k].map(rw => Object.assign({ set: k }, rw)))), []);
const key = (q) => q.a + 'x' + q.b;

test('chapters 1 to 7 play and render exactly as they shipped: every frame and what it shows (its scene and its drawing, its captions and what Read to me says, its balloons with their labels and voices, its options, its card and its drawing, her whole Case File with every card drawn, the pages she taps), every skip-count tap by tap, every question, picture, line and help hop by hop, the Hollow, the book with its dragonets, the grown-ups corner and E.factTables, the hub and the cat, for twelve readings (tests/fixtures/ch07-golden.json)', () => {
  assert.equal(GOLDEN7.engine, G7.VERSION7, 'recorded with the engine chapter 7 shipped with');
  assert.equal(GOLDEN7.engine, '0.7.0 (chapter 7, 2026-10-20)');
  assert.equal(GOLDEN7.runs.length, G7.SCRIPTS7.length);
  const { runs } = now7();
  runs.forEach((r, i) => {
    const now = G7.compact7(r), then = GOLDEN7.runs[i].run, name = GOLDEN7.runs[i].name;
    assert.equal(r.name, name);
    assert.deepEqual(now.readings.map(x => x.chapter), then.readings.map(x => x.chapter), name + ': the same readings');
    then.readings.forEach((R, k) => {
      const N = now.readings[k], where = name + ', reading ' + (k + 1) + ' (' + R.chapter + ')';
      assert.deepEqual(N.frames, R.frames, where + ': the same frames, in the same order');
      assert.deepEqual(N.picked, R.picked, where + ': the same choices');
      assert.deepEqual([N.left, N.resumed], [R.left, R.resumed], where + ': left and picked up where it was');
      const a = N.shown.split(' '), b = R.shown.split(' ');
      b.forEach((h, n) => assert.equal(a[n], h, where + ': what ' + R.frames[n] + ' shows (its scene and drawing, captions and what Read to me says, balloons and their labels and voices, options, its card, her Case File, its skip-count tap by tap, the page she taps); `node tests/fixtures/make-ch07-golden.js --diff DIR` writes it whole'));
      assert.deepEqual(N.lessons, R.lessons, where + ': every lesson, question by question (its pictures and their drawings, its words, its result, its whole help hop by hop)');
    });
    assert.deepEqual(now.hollow, then.hollow, name + ': the Training Hollow, its rounds and its lines');
    assert.deepEqual(now.teaser, then.teaser, name + ': chapter 7’s teaser, the last chapter');
    assert.deepEqual(now.tables, then.tables, name + ': the grown-ups corner’s tables (E.factTables), their headings and rows');
    assert.deepEqual(now.hub, then.hub, name + ': the hub');
    assert.deepEqual([now.book, now.corner, now.extra, now.cat, now.flags, now.status], [then.book, then.corner, then.extra, then.cat, then.flags, then.status],
      name + ': her book and its dragonets, the grown-ups corner, her cards and her file, the cat at the end, the flags, the status');
  });
});

test('the chapter 7 golden’s readings cover what chapters 1 to 7 can make of a cat: every specialty and worry, told and kept, both chapter 2 paths, the roofs and “Not today”, Puddle, Wisp and Sleet found and not, a tom, FLEW caught, slow and quick, misses of every kind in chapter 7’s sets, and known issue 15', () => {
  const { PC, runs } = now7();
  const E = PC.engine;
  const flags = runs.map(r => r.end.flags);
  assert.deepEqual([...new Set(runs.map(r => r.readings[0].picked.find(p => p.startsWith('f014:'))))].sort(), ['f014:0', 'f014:1', 'f014:2', 'f014:3', 'f014:4'], 'every specialty');
  assert.deepEqual([...new Set(flags.map(f => f.worry))].sort(), ['shiny', 'small', 'talk', 'water'], 'every worry');
  for (const k of ['ch3Told', 'foundSquall', 'ch4CaughtFly', 'ch5Roof', 'foundPuddle', 'foundWisp', 'foundSleet']) {
    assert.ok(flags.some(f => f[k] === true) && flags.some(f => f[k] !== true), k + ': with it and without it');
  }
  assert.ok(flags.every(f => f.ch7Flew === true), 'every reading of chapter 7 sets ch7Flew');
  assert.deepEqual([...new Set(flags.map(f => f.ch2Path))].sort(), ['bridge', 'river']);
  assert.deepEqual([...new Set(flags.map(f => f.ch5First))].sort(), ['heron', 'otters']);
  assert.ok(flags.some(f => !f.foundSquall && !f.ch5Roof), '“Not today” twice');
  // chapter 7 told and kept: the told sum's choice (f039) and the kept one's (f055)
  const seven = runs.map(r => r.readings.filter(x => x.chapter === 'ch07'));
  assert.ok(seven.some(rs => rs.some(x => x.picked.some(p => p.startsWith('f039:')))) && seven.some(rs => rs.some(x => x.picked.some(p => p.startsWith('f055:')))), 'told and kept');
  assert.deepEqual([...new Set(seven.reduce((a, rs) => a.concat(...rs.map(x => x.picked.filter(p => /^f0(05|39|55|69|88|90):/.test(p)))), []))].sort(),
    ['f005:0', 'f005:1', 'f039:0', 'f039:1', 'f055:0', 'f055:1', 'f069:0', 'f069:1', 'f088:0', 'f088:1', 'f090:0', 'f090:1'], 'every option of chapter 7’s six choices');
  // a tom with his own names
  assert.ok(runs.some(r => r.end.look.sex === 'tom' && r.end.petname === 'Snickerdoodle' && r.end.name === 'Murmur'), 'a tom, his own names');
  // FLEW caught as a noticing cat, told and kept (chapter 7's “I KNEW it!”), and one who becomes a climber after
  assert.ok(flags.some(f => f.ch4CaughtFly && f.specialty === 'noticing' && f.ch3Told) && flags.some(f => f.ch4CaughtFly && f.specialty === 'noticing' && !f.ch3Told), 'FLEW caught, told and kept');
  const reread = runs.find(r => r.readings.length > 8 && !r.readings.some(x => x.left));
  assert.deepEqual(reread.readings.map(x => x.chapter), ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch01', 'ch04', 'ch05']);
  assert.ok(reread.end.flags.ch4CaughtFly === true && reread.end.flags.specialty === 'climbing', 'caught FLEW as a noticing cat, then a climber');
  // slow and quick in chapter 7
  const answers = runs.map(r => firstAsks(r.end, /^ch07-/));
  assert.ok(answers.some(a => a.some(e => e.correct && e.ms >= E.FAST_MS)) && answers.some(a => a.some(e => e.correct && e.ms < E.FAST_MS)), 'slow and quick');
  // misses of every kind in chapter 7's sets
  const rows = runs.map(ch07Rows);
  const missed = (pred) => rows.some(rs => rs.some(rw => !rw.res.correct && pred(rw)));
  for (const set of ['ch07-pile', 'ch07-threes', 'ch07-sixes', 'ch07-gone', 'ch07-dragon', 'ch07-riffle']) assert.ok(missed(rw => rw.set === set && !rw.q.retry && !rw.q.filler), set + ': a first ask missed');
  assert.ok(missed(rw => rw.set === 'ch07-pile' && rw.q.retry), 'the pile missed twice');
  assert.ok(missed(rw => rw.q.filler), 'a lent question missed');
  // the warm-up's hard pick, from chapter 6: a miss there, and a slow answer there
  const opener = rows.map((rs, i) => [i, rs.find(rw => rw.set === 'ch07-threes')]);
  const hard = opener.filter(([, rw]) => rw.q.hard);
  assert.ok(hard.some(([i, rw]) => firstAsks(runs[i].end, /^ch06-/).some(e => !e.correct && key(e) === key(rw.q))), 'the warm-up asks her chapter-6 miss first');
  assert.ok(hard.some(([i, rw]) => firstAsks(runs[i].end, /^ch06-/).some(e => e.correct && e.ms >= E.FAST_MS && key(e) === key(rw.q))), 'or her slowest chapter-6 3s fact');
  assert.ok(hard.some(([, rw]) => !rw.res.correct) && hard.some(([, rw]) => rw.res.correct && rw.res.fast), 'the hard pick missed, and remembered quick');
  assert.ok(opener.some(([, rw]) => !rw.q.hard && key(rw.q) === '7x3'), 'and 7 × 3 when nothing was hard');
  // the sixes: the twins in a row, 6 × 6, the 8 × 6 check (missed itself, and right after a missed 6 × 8)
  const sixes = rows.map(rs => rs.filter(rw => rw.set === 'ch07-sixes').map(rw => key(rw.q) + (rw.q.retry ? 'R' : rw.q.filler ? 'F' : '') + (rw.res.correct ? '' : '✗')));
  assert.ok(sixes.some(s => s.join(' ').includes('6x4✗ 6x7✗ 6x8✗ 6x4R 6x7R 6x8R 4x6 7x6 8x6')), 'the twins in a row, each retry before its twin');
  assert.ok(sixes.some(s => s.includes('6x6✗')), '6 × 6 missed');
  assert.ok(sixes.some(s => s.join(' ').includes('6x8R 8x6✗')), 'a missed 6 × 8 asked again just before its 8 × 6 check, missed');
  assert.ok(runs.some(r => firstAsks(r.end, /^ch07-sixes$/).some(e => key(e) === '8x6' && e.check && !e.correct)), 'the 8 × 6 check missed');
  // the twenty-four missed twice; the told and the kept sixty missed
  assert.ok(missed(rw => rw.set === 'ch07-gone' && rw.q.retry && key(rw.q) === '4x6'), 'the twenty-four missed twice');
  assert.ok(missed(rw => rw.set === 'ch07-dragon') && missed(rw => rw.set === 'ch07-riffle'), 'the told sixty and the kept sixty');
  // every cat's log holds the twenty-four, filed under the 4s (the table a later chapter's 4s Count names)
  runs.forEach(r => assert.ok((r.end.counts || []).some(e => e.set === 'ch07-gone' && E.tableOf(e, G7.CH7.map(id => PC.story[id])) === 4), r.name + ': the twenty-four, under the 4s'));
  // chapter 7's known issue 15: kept, she leaves chapter 7 between its two sums, reads chapter 3 again and
  // tells, and picks chapter 7 up where she left it: past both sum panels, fourteen typed answers, no `my-count`
  const i15 = runs.find(r => r.readings.some(x => x.left));
  assert.deepEqual(i15.readings.map(x => x.chapter), ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch03', 'ch07']);
  const [part, again, back] = i15.readings.slice(6);
  assert.equal(part.left, 'f046');
  assert.ok(part.frames.includes('f035') && part.frames.includes('f041') && !part.frames.includes('f053'), 'left between the twenty-four and the sixty, on the kept path');
  assert.ok(again.picked.includes('f086:0'), 'chapter 3 again, told');
  assert.ok(back.resumed && back.frames[0] === 'f048', 'chapter 7 picked up where she left it: the page no longer shows, so she lands on the told path’s next');
  assert.ok(!back.frames.includes('f053') && !back.frames.includes('f056') && !back.frames.includes('f040'), 'past both sum panels');
  assert.equal(i15.end.flags.ch3Told, true);
  assert.ok(E.isFinished(i15.end, 'ch07'));
  assert.equal(firstAsks(i15.end, /^ch07-/).length, 14, 'fourteen typed answers');
  assert.ok(!i15.end.cards.some(c => c.id === 'my-count') && i15.end.cards.some(c => c.id === 'tunnel'), 'no my-count, the rest of chapter 7’s cards');
});

/* The page hands the engine every story it has loaded (ui.js: `stories()` is `PC.story`), not chapters 1
 * to 7 alone. So the same twelve readings again, chapters 1 to 7 read as before but every loaded story
 * handed to the engine everywhere else (the scenes, the cards, the Case File, the lessons, the Hollow, the
 * book, the hub, the tables): what chapters 1 to 7 show must not move. Only what is about the chapter
 * after chapter 7 may, each by name. In both of chapter 8's states (the STUB and the built chapter; E.chapters
 * keeps a stub, since its storyList keeps every story with frames): chapter 7's teaser in her book is built
 * and leads to chapter 8 (its words as they were), and the hub offers chapter 8 instead of “coming soon”
 * (E.progress().next, `soon` null; E.upNext). Only when chapter 8 is built: the grown-ups corner's table-4
 * heading (E.factTables) becomes “Paws · the 4s” for every cat whose log holds chapter 7's twenty-four, since
 * E.countFor(4) finds chapter 8's 4s; in the stub state it stays “The 4s”. Any other difference is a later
 * chapter changing an earlier one. */
test('chapters 1 to 7 with every loaded story handed to the engine, as the page does: every reading (frame by frame, every lesson), every Hollow round, the corner, her cards and file, her book and the cat exactly as shipped; only chapter 7’s teaser (built, leading to chapter 8), the hub’s next chapter and, once chapter 8 is built, the 4s’ heading in E.factTables move', (t) => {
  const { PC, runs } = now7();
  const E = PC.engine, seven = G7.CH7.map(id => PC.story[id]), state = chapter8(PC);
  t.diagnostic('chapter 8 is ' + state);
  assert.deepEqual(E.chapters(PC.story).slice(0, 7).map(s => s.id), G7.CH7, 'chapters 1 to 7 first, in order');
  const next = E.nextChapter(PC.story.ch07, PC.story);
  if (state === 'absent') assert.equal(next, null, 'nothing after chapter 7');
  else assert.equal(next && next.id, 'ch08', 'E.chapters keeps chapter 8 (' + state + ') after chapter 7');
  const four = E.countFor(4, PC.story);
  if (state === 'built') {
    assert.equal(four && four.chapter, 'ch08', 'chapter 8 teaches the 4s');
    assert.equal(E.countName(four.def, 4), 'Paws · the 4s');
  } else assert.equal(four, null, 'no chapter teaches the 4s yet (' + state + ')');
  const heading = (h, table) => (state === 'built' && table === 4 ? 'Paws · the 4s' : h);
  all7().forEach((r, i) => {
    const now = G7.compact7(r), then = GOLDEN7.runs[i].run, base = runs[i], name = GOLDEN7.runs[i].name + ' (chapter 8 ' + state + ')';
    assert.equal(G7.compact7(base).book, then.book, name + ': the first pass is the golden');
    assert.deepEqual(now.readings, then.readings, name + ': every reading, frame by frame and every lesson, as shipped');
    assert.deepEqual(now.hollow, then.hollow, name + ': the Training Hollow, its rounds and its lines, as shipped');
    assert.deepEqual([now.book, now.corner, now.extra, now.cat, now.flags, now.status], [then.book, then.corner, then.extra, then.cat, then.flags, then.status],
      name + ': her book but its teaser (every page and dragonet), the grown-ups corner, her cards, file and learned Counts, the cat at the end (her status too), the flags');
    // her book's teaser: as shipped, chapter 7 was the last; its words as they were, built and leading on
    assert.deepEqual([then.teaser.built, then.teaser.next], [false, null], name + ': as shipped, chapter 7 was the last');
    assert.deepEqual(now.teaser, next ? Object.assign({}, then.teaser, { built: true, next: next.id }) : then.teaser, name + ': chapter 7’s teaser, its words as they were' + (next ? ', leads to chapter 8' : ''));
    // the hub: chapter 8 up next instead of “coming soon”
    assert.deepEqual([then.hub.upNext, then.hub.next, then.hub.soon && then.hub.soon.built], [null, null, false], name + ': as shipped, nothing next but the teaser');
    assert.deepEqual(now.hub, next ? Object.assign({}, then.hub, { upNext: next.id, next: next.id, soon: null }) : then.hub, name + ': the hub' + (next ? ': chapter 8 is next, nothing else moves' : ''));
    const p = E.progress(r.end, PC.story), p7 = E.progress(r.end, seven);
    assert.deepEqual([p7.next, p7.soon && p7.soon.built], [null, false], name + ': with chapters 1 to 7, nothing next but the teaser');
    if (next) assert.deepEqual([p.next && p.next.id, p.soon, p.latest.id], ['ch08', null, 'ch07'], name + ': with every chapter, chapter 8 is next');
    // the grown-ups corner's tables: the 4s' heading moves only for a built chapter 8, and only where her log holds the twenty-four
    const holds = (r.end.counts || []).some(e => e.set === 'ch07-gone' && E.tableOf(e, PC.story) === 4);
    assert.equal(then.tables.some(x => x[0] === 4), holds, name + ': the 4s’ table is there exactly when her log holds the twenty-four');
    assert.deepEqual(now.tables, then.tables.map(([table, h, rows]) => [table, heading(h, table), rows]), name + ': E.factTables' + (state === 'built' ? ', the 4s as “Paws · the 4s”' : ', as shipped'));
    if (holds) assert.equal(now.tables.find(x => x[0] === 4)[1], state === 'built' ? 'Paws · the 4s' : 'The 4s', name);
    assert.deepEqual(E.factTables(r.end, seven).map(x => x.name), then.tables.map(x => x[1]), name + ': with chapters 1 to 7, the headings as shipped');
  });
});
