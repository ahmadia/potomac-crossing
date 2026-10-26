/* Chapters 1 to 8 as they shipped (chapter 9's spec, section 7, item 2): fourteen whole readings recorded
 * from the shipped chapter-8 tree in a process of its own (tests/fixtures/make-ch08-golden.js, from the
 * snapshot taken before chapter 9's build, commit b6a8d4f, engine 0.8.0; re-recorded 2026-10-26 with the
 * live depth hotfix, 83313a1, in it: ch06 f004, f107, f109, ch07 f018, f021, f077, f079 to f082 and ch08
 * f009, f030 list the cat at `crowd-2` first, and only those twelve frames moved), compared digest by digest with
 * today's tree: (a) with chapters 1 to 8 handed to the engine, exactly; (b) with every loaded story handed
 * to the engine, as the page does (ui.js: `stories()` is `PC.story`), exactly but for what is about the
 * chapter after chapter 8, each delta by name: chapter 8's teaser in her book is built and leads to
 * chapter 9 (its words as they were), and the hub offers chapter 9. Chapter 9 may be the orchestrator's
 * STUB (every frame's board 'STUB.') or built: E.chapters keeps a stub, so both deltas show in both states,
 * and the test says which state it ran in. No chapter 1 to 8 cat logs a table-8 answer, so E.factTables
 * gains no heading: its tables stay as recorded in both states. Beside them, by name: every golden cat's
 * chapter 4 page and Squall's page read as recorded (chapter 9's edit to chapter 4's page, `ch9Roof: false`
 * beside `ch5Roof: false`, must not move them), and the grown-ups corner's kept words for ch3Told stay
 * (spec section 7, item 16). Today's runs are made once and shared (the drawings memoized by what is drawn,
 * which no list touches). tests/golden-ch07.test.js, ch06's and ch04's goldens stand beside this one. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const G8 = require('./fixtures/make-ch08-golden.js');
const GOLDEN8 = require('./fixtures/ch08-golden.json');

let NOW8 = null;
function now8() {
  if (NOW8) return NOW8;
  const PC = require('./_load.js').load();
  require('../app/ui.js');
  const ctx = G8.context8(PC);
  NOW8 = { PC, ctx, runs: G8.SCRIPTS8.map(s => G8.run8(ctx, s)) };
  return NOW8;
}
let ALL8 = null;
function all8() {
  if (ALL8) return ALL8;
  const { PC, ctx } = now8();
  const all = Object.assign({}, ctx, { read: G8.CH8.map(id => PC.story[id]), list: PC.story });
  ALL8 = G8.SCRIPTS8.map(s => G8.run8(all, s));
  return ALL8;
}
/* Chapter 9 as loaded: 'absent', the orchestrator's 'stub' (every frame's board "STUB.", as
 * tests/engine.test.js's teaser test tells a placeholder), or 'built'. */
function chapter9(PC) {
  const s = PC.story.ch09;
  if (!s || !s.frames) return 'absent';
  return Object.values(s.frames).every(f => /^STUB\b/.test(f.board || '')) ? 'stub' : 'built';
}
const firstAsks = (cat, re) => (cat.counts || []).filter(e => e && re.test(e.set || '') && !e.retry && !e.filler);
const key = (q) => q.a + 'x' + q.b;
const DIFF = '; `node tests/fixtures/make-ch08-golden.js --diff DIR` writes it whole';

/* One run, today's (compacted) against the golden's: every reading frame by frame, every lesson, the Hollow,
 * and the cat; `moved` names what this pass lets move (the teaser and the hub), compared by the caller. */
function same(now, then, name, moved) {
  assert.deepEqual(now.readings.map(x => x.chapter), then.readings.map(x => x.chapter), name + ': the same readings');
  then.readings.forEach((R, k) => {
    const N = now.readings[k], where = name + ', reading ' + (k + 1) + ' (' + R.chapter + ')';
    assert.equal(N.frames, R.frames, where + ': the same frames, in the same order');
    assert.equal(N.picked, R.picked, where + ': the same choices');
    assert.deepEqual([N.left, N.resumed], [R.left, R.resumed], where + ': left and picked up where it was');
    const a = N.shown.split(' '), b = R.shown.split(' '), ids = R.frames.split(' ');
    assert.equal(a.length, b.length, where + ': as many frames shown');
    b.forEach((h, n) => assert.equal(a[n], h, where + ': what ' + ids[n] + ' shows (its scene and drawing, captions and what Read to me says, balloons and their labels and voices, options, its card, her Case File with every card drawn and its rows, its skip-count tap by tap, the page she taps)' + DIFF));
    assert.equal(N.said, R.said, where + ': what the page says over each Counts frame’s first question and after its last' + DIFF);
    assert.deepEqual(N.lessons, R.lessons, where + ': every lesson, question by question (its pictures and their drawings, its words, its result, its line, its whole help hop by hop)' + DIFF);
  });
  assert.deepEqual(now.hollow, then.hollow, name + ': the Training Hollow, its rounds (the 4s among them) and its lines' + DIFF);
  assert.deepEqual(now.pages, then.pages, name + ': her book’s chapter 4 page and Squall’s page, word for word');
  assert.deepEqual(now.told, then.told, name + ': the grown-ups corner’s words for her chapter 3 choice');
  assert.deepEqual([now.book, now.corner, now.extra, now.cat, now.flags, now.status], [then.book, then.corner, then.extra, then.cat, then.flags, then.status],
    name + ': her book but its teaser (every page and dragonet), the grown-ups corner, her cards, file and learned Counts, the cat at the end (her status too), the flags' + DIFF);
  if (!moved) {
    assert.deepEqual(now.teaser, then.teaser, name + ': chapter 8’s teaser, the last chapter');
    assert.deepEqual(now.hub, then.hub, name + ': the hub');
  }
  assert.deepEqual(now.tables, then.tables, name + ': the grown-ups corner’s tables (E.factTables), their headings and rows');
}

test('chapters 1 to 8 play and render exactly as they shipped: every frame and what it shows (its scene and its drawing, its captions and what Read to me says, its balloons with their labels and voices, its options, its card and its drawing, her whole Case File with every card drawn, the brag’s row of four, the pages she taps), every skip-count tap by tap, what the page says round each lesson, every question, picture, line and help hop by hop, the Hollow, the book with its dragonets, the grown-ups corner and E.factTables, the hub and the cat, for fourteen readings (tests/fixtures/ch08-golden.json)', () => {
  assert.equal(GOLDEN8.engine, G8.VERSION8, 'recorded with the engine chapter 8 shipped with');
  assert.equal(GOLDEN8.engine, '0.8.0 (chapter 8, 2026-10-21)');
  assert.equal(GOLDEN8.runs.length, G8.SCRIPTS8.length);
  const { runs } = now8();
  runs.forEach((r, i) => {
    assert.equal(r.name, GOLDEN8.runs[i].name);
    same(G8.compact8(r), GOLDEN8.runs[i].run, GOLDEN8.runs[i].name, false);
  });
});

test('the chapter 8 golden’s readings cover what chapters 1 to 8 can make of a cat: every frame of every chapter; every specialty and worry, told and kept, both chapter 2 paths, the roofs and “Not today”, Puddle, Wisp, Sleet and Hail found and not, a tom, slow and quick; chapter 8’s two routes on both paths, every choice’s every option, every specialty’s way past the dogs, Hail found by a cat who has found every dragonet, some and none, a reread by the other route, the brag’s row of four; misses of every kind in chapter 8’s sets', () => {
  const { PC, runs } = now8();
  const E = PC.engine, flags = runs.map(r => r.end.flags);
  // every frame of chapters 1 to 8 is shown by some reading
  G8.CH8.forEach(ch => {
    const seen = new Set();
    runs.forEach(r => r.readings.filter(x => x.chapter === ch).forEach(x => x.frames.forEach(id => seen.add(id))));
    assert.deepEqual(Object.keys(PC.story[ch].frames).filter(id => !seen.has(id)), [], ch + ': every frame is in some reading');
  });
  assert.deepEqual([...new Set(runs.map(r => r.readings[0].picked.find(p => p.startsWith('f014:'))))].sort(), ['f014:0', 'f014:1', 'f014:2', 'f014:3', 'f014:4'], 'every specialty');
  assert.deepEqual([...new Set(flags.map(f => f.worry))].sort(), ['shiny', 'small', 'talk', 'water'], 'every worry');
  for (const k of ['ch3Told', 'foundSquall', 'ch4CaughtFly', 'ch5Roof', 'foundPuddle', 'foundWisp', 'foundSleet', 'foundHail']) {
    assert.ok(flags.some(f => f[k] === true) && flags.some(f => f[k] !== true), k + ': with it and without it');
  }
  assert.deepEqual([...new Set(flags.map(f => f.ch2Path))].sort(), ['bridge', 'river']);
  assert.deepEqual([...new Set(flags.map(f => f.ch5First))].sort(), ['heron', 'otters']);
  assert.ok(flags.some(f => !f.foundSquall && !f.ch5Roof), '“Not today” twice');
  assert.ok(flags.every(f => f.ch7Flew === true), 'every reading of chapter 7 sets ch7Flew');
  assert.ok(runs.some(r => r.end.look.sex === 'tom' && r.end.petname === 'Snickerdoodle' && r.end.name === 'Murmur'), 'a tom, his own names');
  // chapter 8's readings: each told or kept by the choices it saw
  const eight = runs.reduce((a, r, i) => a.concat(r.readings.filter(x => x.chapter === 'ch08').map(x => ({ i, x, told: x.picked.some(p => /^f(045|118):/.test(p)), field: x.picked.includes('f036:1') }))), []);
  eight.forEach(({ i, x }) => assert.ok(x.picked.some(p => /^f(118|120):/.test(p)), runs[i].name + ': the fox, told or kept'));
  assert.deepEqual([...new Set(eight.map(e => (e.told ? 'told ' : 'kept ') + (e.field ? 'field' : 'tunnel')))].sort(), ['kept field', 'kept tunnel', 'told field', 'told tunnel'], 'both routes on both paths');
  assert.deepEqual([...new Set(eight.reduce((a, e) => a.concat(e.x.picked), []))].sort(),
    ['f036:0', 'f036:1', 'f045:0', 'f045:1', 'f047:0', 'f047:1', 'f062:0', 'f062:1', 'f118:0', 'f118:1', 'f120:0', 'f120:1', 'f152:0', 'f152:1'], 'every option of chapter 8’s choices');
  // every specialty's way past the dogs, told and kept ("Not tonight."): sneaking, climbing, friends, noticing or swimming
  for (const [way, told, kept] of [['sneaking', 'f064', 'f065'], ['climbing', 'f066', 'f067'], ['friends', 'f068', 'f071'], ['noticing or swimming', 'f074', 'f077']]) {
    assert.ok(eight.some(e => e.told && e.x.picked.includes('f062:1') && e.x.frames.includes(told)), way + ', told');
    assert.ok(eight.some(e => !e.told && e.x.picked.includes('f062:1') && e.x.frames.includes(kept)), way + ', kept');
  }
  const noticingWay = runs.some(r => r.readings.some(x => x.chapter === 'ch08' && x.frames.includes('f074')) && r.readings[0].picked.includes('f014:0'));
  const swimmingWay = runs.some(r => r.readings.some(x => x.chapter === 'ch08' && x.frames.includes('f077')) && r.readings[0].picked.includes('f014:3'));
  assert.ok(noticingWay && swimmingWay, 'a noticing cat and a swimmer past the dogs');
  // Hail: found on both paths, by a cat who has found every dragonet before her, some, and none (her news to Hail, f086, both ways)
  const hail = eight.filter(e => e.x.picked.includes('f062:0'));
  assert.ok(hail.some(e => e.told) && hail.some(e => !e.told), 'Hail found, told and kept');
  assert.ok(hail.some(e => e.x.frames.includes('f086')) && hail.some(e => !e.x.frames.includes('f086')), 'her news to Hail, and none to give');
  assert.ok(runs.some(r => ['foundSquall', 'foundPuddle', 'foundWisp', 'foundSleet', 'foundHail'].every(k => r.end.flags[k] === true)), 'a cat with every dragonet so far');
  assert.ok(runs.some(r => r.end.flags.foundHail && r.end.flags.ch5Roof) && runs.some(r => r.end.flags.foundHail && !r.end.flags.foundSquall), 'Hail with Squall from chapter 5’s roof, and Hail with no Squall (“Just what Squall saw from his roof!” both ways)');
  // a reread of chapter 8 by the other route: Hail stays found, and the log offers her again
  const again = runs.find(r => r.readings.filter(x => x.chapter === 'ch08').length === 3);
  const [h1, h2, h3] = again.readings.filter(x => x.chapter === 'ch08');
  assert.ok(h1.picked.includes('f036:1') && h1.picked.includes('f062:0') && h2.picked.includes('f036:0') && h3.picked.includes('f062:1'), 'Hail, then the tunnel, then “Not tonight.”');
  assert.equal(again.end.flags.foundHail, true, 'foundHail stays');
  assert.equal(E.optionLabel(PC.story.ch08.frames.f062.choice.options[0], again.end), '“Go and see Hail again.”', 'the log’s label for a cat who has found her');
  // a Sleet cat's file: the brag's row of four, FLEW's line and the brag's two; without Sleet, three
  const brag = (r) => r.extra.file.links.find(L => L.cards.some(c => c.id === 'fox-brag'));
  const sleet = runs.filter(r => r.end.flags.foundSleet), dry = runs.filter(r => !r.end.flags.foundSleet);
  assert.ok(sleet.length && dry.length);
  sleet.forEach(r => assert.deepEqual([brag(r).cards.map(c => c.id), brag(r).lines.length], [['cant-fly', 'fox-flew', 'fox-brag', 'sleet-den'], 3], r.name + ': the row of four'));
  dry.forEach(r => assert.deepEqual(brag(r).cards.map(c => c.id), ['cant-fly', 'fox-flew', 'fox-brag'], r.name + ': the brag over FLEW’s row'));
  // the Training Hollow offers the 4s to every cat, and asks a round of them
  runs.forEach(r => assert.ok(r.hollow.some(h => h.table === 4 && h.setId === 'ch08-fours' && h.rows.length), r.name + ': a round of the 4s'));
  // slow and quick in chapter 8
  const answers = runs.map(r => firstAsks(r.end, /^ch08-/));
  assert.ok(answers.some(a => a.some(e => e.correct && e.ms >= E.FAST_MS)) && answers.some(a => a.some(e => e.correct && e.ms < E.FAST_MS)), 'slow and quick');
  // misses of every kind in chapter 8's sets
  const rows = runs.map(r => r.readings.filter(x => x.chapter === 'ch08').slice(0, 1).reduce((a, x) => a.concat(...Object.keys(x.lessons).map(k => x.lessons[k].map(rw => Object.assign({ set: k }, rw)))), []));
  const missed = (pred) => rows.some(rs => rs.some(rw => !rw.res.correct && pred(rw)));
  for (const set of ['ch08-pile', 'ch08-sixes', 'ch08-fours', 'ch08-gone', 'ch08-hail', 'ch08-snip', 'ch08-riffle']) assert.ok(missed(rw => rw.set === set && !rw.q.retry && !rw.q.filler), set + ': a first ask missed');
  assert.ok(missed(rw => rw.set === 'ch08-pile' && rw.q.retry), 'the pile missed twice');
  assert.ok(missed(rw => rw.set === 'ch08-pile' && rw.q.filler), 'a filler of the pile’s missed');
  // the warm-up's hard pick: from a chapter-7 miss, from a slow 5 × 6, and missed; 6 × 8 when nothing was hard
  const opener = rows.map((rs, i) => [i, rs.find(rw => rw.set === 'ch08-sixes')]);
  const hard = opener.filter(([, rw]) => rw.q.hard);
  assert.ok(hard.some(([i, rw]) => firstAsks(runs[i].end, /^ch07-sixes$/).some(e => !e.correct && key(e) === key(rw.q))), 'the warm-up asks her chapter-7 miss first');
  assert.ok(hard.some(([i, rw]) => key(rw.q) === '5x6' && firstAsks(runs[i].end, /^ch07-sixes$/).some(e => e.correct && e.ms >= E.FAST_MS && key(e) === '5x6')), 'or her slow 5 × 6');
  assert.ok(hard.some(([, rw]) => !rw.res.correct) && hard.some(([, rw]) => rw.res.correct), 'the hard pick missed, and remembered');
  assert.ok(opener.some(([, rw]) => !rw.q.hard && key(rw.q) === '6x8'), 'and 6 × 8 when nothing was hard');
  const lent = rows.reduce((a, rs) => a.concat(rs.filter(rw => rw.set === 'ch08-sixes' && rw.q.filler && key(rw.q) === '2x6')), []);
  assert.ok(lent.length, 'the warm-up lends its own 2 × 6 back (chapter 8’s known slip)');
  lent.forEach(rw => assert.match(rw.prompt.map(l => l.text).join(' '), /^One from yesterday\. /, 'as “One from yesterday.”'));
  // the fours: a twin's retry before its twin; the 8 × 4 check after a missed 4 × 8 (asked again first), and missed itself
  const fours = rows.map(rs => rs.filter(rw => rw.set === 'ch08-fours').map(rw => key(rw.q) + (rw.q.retry ? 'R' : rw.q.filler ? 'F' : '') + (rw.res.correct ? '' : '✗')));
  const before = (s, a, b) => s.indexOf(a) >= 0 && s.indexOf(b) > s.indexOf(a);
  assert.ok(fours.some(s => s.includes('4x7✗') && before(s, '4x7R', '7x4')), 'a missed 4 × 7 asked again before its 7 × 4');
  assert.ok(fours.some(s => s.includes('4x8✗') && before(s, '4x8R', '8x4')), 'a missed 4 × 8 asked again before the 8 × 4 check');
  assert.ok(fours.some(s => s.includes('4x7✗') && s.includes('4x8✗') && before(s, '4x8✗', '4x7R')), 'the twins missed in a row');
  assert.ok(runs.some(r => firstAsks(r.end, /^ch08-fours$/).some(e => key(e) === '8x4' && e.check && !e.correct)), 'the 8 × 4 check missed');
  assert.ok(missed(rw => rw.set === 'ch08-fours' && rw.q.retry), 'a retry of the fours missed');
  // the twenty-eight twice; Hail's riddle three times, and the three misses that make it lend its own 4 × 4 back
  assert.ok(missed(rw => rw.set === 'ch08-gone' && rw.q.retry && key(rw.q) === '4x7'), 'the twenty-eight missed twice');
  assert.ok(rows.some(rs => rs.filter(rw => rw.set === 'ch08-hail' && key(rw.q) === '4x4' && !rw.q.filler && !rw.res.correct).length === 3), 'Hail’s riddle missed three times');
  const slip = rows.reduce((a, rs) => a.concat(rs.filter(rw => rw.set === 'ch08-hail' && rw.q.filler && key(rw.q) === '4x4')), []);
  assert.ok(slip.length, 'Hail lends her own 4 × 4 back');
  slip.forEach(rw => assert.equal(rw.prompt.map(l => l.text).join(' '), 'An easy one! Four dogs. How many paws?', 'as chapter 8’s spec recorded it'));
  // Snip's share, told and kept, with a missed one-night filler (2 × 1) on both paths
  for (const set of ['ch08-snip', 'ch08-riffle']) assert.ok(missed(rw => rw.set === set && rw.q.filler && key(rw.q) === '2x1'), set + ': a missed one-night filler');
  // every cat's log holds no table-8 or table-7 answer (so no later chapter's heading can appear in her tables)
  runs.forEach(r => assert.ok((r.end.counts || []).every(e => ![7, 8].includes(E.tableOf(e, G8.CH8.map(id => PC.story[id])))), r.name + ': nothing on the 7s or the 8s'));
});

/* The page hands the engine every story it has loaded (ui.js: `stories()` is `PC.story`), not chapters 1
 * to 8 alone. So the same fourteen readings again, chapters 1 to 8 read as before but every loaded story
 * handed to the engine everywhere else (the scenes, the cards, the Case File, the lessons, the Hollow, the
 * book, the hub, the tables): what chapters 1 to 8 show must not move. Only what is about the chapter after
 * chapter 8 may, each by name, in both of chapter 9's states (the STUB and the built chapter; E.chapters
 * keeps a stub, since its storyList keeps every story with frames): chapter 8's teaser in her book is built
 * and leads to chapter 9 (its words as they were), and the hub offers chapter 9 instead of “coming soon”
 * (E.progress().next, `soon` null; E.upNext). E.factTables does not move: no golden cat logs a table-8
 * answer, so chapter 9's 8s (E.countFor(8), once built) head no table of hers. Any other difference is a
 * later chapter changing an earlier one. */
test('chapters 1 to 8 with every loaded story handed to the engine, as the page does: every reading (frame by frame, every lesson), every Hollow round, the corner and E.factTables, her cards and file, her book and the cat exactly as shipped; only chapter 8’s teaser (built, leading to chapter 9) and the hub’s next chapter move', (t) => {
  const { PC, runs } = now8();
  const E = PC.engine, eight = G8.CH8.map(id => PC.story[id]), state = chapter9(PC);
  t.diagnostic('chapter 9 is ' + state);
  assert.deepEqual(E.chapters(PC.story).slice(0, 8).map(s => s.id), G8.CH8, 'chapters 1 to 8 first, in order');
  const next = E.nextChapter(PC.story.ch08, PC.story);
  if (state === 'absent') assert.equal(next, null, 'nothing after chapter 8');
  else assert.equal(next && next.id, 'ch09', 'E.chapters keeps chapter 9 (' + state + ') after chapter 8');
  const eights = E.countFor(8, PC.story);
  if (state === 'built') assert.equal(eights && eights.chapter, 'ch09', 'chapter 9 teaches the 8s');
  else assert.equal(eights, null, 'no chapter teaches the 8s yet (' + state + ')');
  all8().forEach((r, i) => {
    const now = G8.compact8(r), then = GOLDEN8.runs[i].run, base = runs[i], name = GOLDEN8.runs[i].name + ' (chapter 9 ' + state + ')';
    assert.equal(G8.compact8(base).book, then.book, name + ': the first pass is the golden');
    same(now, then, name, true);
    // her book's teaser: as shipped, chapter 8 was the last; its words as they were, built and leading on
    assert.deepEqual([then.teaser.title, then.teaser.built, then.teaser.next], ['Chapter 9: Featherlight', false, null], name + ': as shipped, chapter 8 was the last');
    assert.deepEqual(now.teaser, next ? Object.assign({}, then.teaser, { built: true, next: next.id }) : then.teaser, name + ': chapter 8’s teaser, its words as they were' + (next ? ', leads to chapter 9' : ''));
    // the hub: chapter 9 up next instead of “coming soon”
    assert.deepEqual([then.hub.upNext, then.hub.next, then.hub.soon && then.hub.soon.built, then.hub.latest], [null, null, false, 'ch08'], name + ': as shipped, nothing next but the teaser');
    assert.deepEqual(now.hub, next ? Object.assign({}, then.hub, { upNext: next.id, next: next.id, soon: null }) : then.hub, name + ': the hub' + (next ? ': chapter 9 is next, nothing else moves' : ''));
    const p = E.progress(r.end, PC.story), p8 = E.progress(r.end, eight);
    assert.deepEqual([p8.next, p8.soon && p8.soon.built], [null, false], name + ': with chapters 1 to 8, nothing next but the teaser');
    if (next) assert.deepEqual([p.next && p.next.id, p.soon, p.latest.id], ['ch09', null, 'ch08'], name + ': with every chapter, chapter 9 is next');
    // the grown-ups corner's tables: no table-8 answer in her log, so no heading of chapter 9's
    assert.ok((r.end.counts || []).every(e => E.tableOf(e, PC.story) !== 8), name + ': no table-8 answer in her log');
    assert.ok(!now.tables.some(x => x[0] === 8), name + ': no 8s table');
    assert.deepEqual(E.factTables(r.end, eight).map(x => x.name), then.tables.map(x => x[1]), name + ': with chapters 1 to 8, the headings as shipped');
  });
});

/* Chapter 9's one edit to shipped story code is chapter 4's page (`book.recap`): its "found Squall" lines take
 * `ch9Roof: false` beside their `ch5Roof: false` (spec section 1 and 5). No golden cat holds `ch9Roof`, so her
 * chapter 4 page must read exactly as it did, and so must Squall's page; and the grown-ups corner keeps its
 * kept words for ch3Told (spec section 7, item 16: they describe the chapter 3 choice). Named here on their own,
 * in both passes, though the readings above hold them too. */
test('every golden cat’s chapter 4 page and Squall’s page read as recorded, with chapters 1 to 8 and with every loaded story (chapter 9’s ch9Roof edit to chapter 4’s page moves neither); the grown-ups corner’s kept words for ch3Told stay as recorded', () => {
  const { runs } = now8();
  const pass = [['chapters 1 to 8', runs], ['every loaded story', all8()]];
  const kept = GOLDEN8.runs.filter(g => g.run.flags.ch3Told === false);
  assert.ok(kept.length >= 4, 'kept cats in the golden');
  kept.forEach(g => assert.deepEqual(g.run.told, ['ch3Told', 'kept Sprinkle’s secret: only Riffle knows too (later chapters remember)', false], g.name + ': the kept words, as recorded'));
  const roofs = GOLDEN8.runs.map(g => [g.run.flags.foundSquall === true, g.run.flags.ch5Roof === true]);
  assert.ok(roofs.some(([s, r]) => s && !r) && roofs.some(([s, r]) => s && r) && roofs.some(([s]) => !s), 'Squall from chapter 4’s roof, from chapter 5’s, and not met');
  pass.forEach(([label, list]) => list.forEach((r, i) => {
    const g = GOLDEN8.runs[i], name = g.name + ' (' + label + ')';
    assert.ok(g.run.pages.ch04 && g.run.pages.ch04.recap.length, g.name + ': a chapter 4 page');
    assert.equal(!!g.run.pages.squall, g.run.flags.foundSquall === true, g.name + ': Squall’s page exactly when she has met him');
    assert.ok(r.end.flags.ch9Roof === undefined, name + ': no ch9Roof');
    assert.deepEqual(r.pages.ch04, g.run.pages.ch04, name + ': her chapter 4 page, word for word');
    assert.deepEqual(r.pages.squall, g.run.pages.squall, name + ': Squall’s page, word for word');
    assert.deepEqual(r.told, g.run.told, name + ': the grown-ups corner’s words for ch3Told');
  }));
});
