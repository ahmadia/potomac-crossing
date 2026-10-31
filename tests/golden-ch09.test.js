/* Chapters 1 to 9 as they are on the tree chapter 10 is built on (chapter 10's spec, section 7, item 3): fifteen
 * whole readings recorded in a process of its own (tests/fixtures/make-ch09-golden.js) from the snapshot of
 * main after the Warrior Counts' merge and the polish release (commit 5bde0c5: chapter 9 as it shipped, the
 * depth hotfix already in it, with the polish release's spots for Thymeleaf under the bridge, ch09 f089 to
 * f100, and Sprinkle's lift, f115; `app/story/warrior.js` loaded as index.html loads it), engine '0.9.1 (the
 * Warrior Counts, 2026-10-31)', compared digest by digest with today's tree: (a) with chapters 1 to 9 handed
 * to the engine, exactly; (b) with every loaded story handed to the engine, as the page does (ui.js:
 * `stories()` is `PC.story`), exactly but for what is about the chapter after chapter 9, each delta by name:
 * chapter 9's teaser in her book is built and leads to chapter 10 (its words as they were), and the hub offers
 * chapter 10. Chapter 10 may be the orchestrator's STUB (every frame's board 'STUB.'; two frames, f001 then
 * f002 the end, so opening it finishes nothing) or built: E.chapters keeps a stub, so both deltas show in both
 * states, and the test says which state it ran in. No golden cat logs a table-7 answer, so chapter 10's 7s
 * head no table of hers: E.factTables stays as recorded in both states. Beside them, by name: every golden
 * cat's chapter 5 page and Puddle's page read as recorded (chapter 10's one edit to shipped story code is
 * chapter 5's `book.recap`, its two lines that read `foundPuddle` taking `ch10Puddle`, and no golden cat holds
 * it); the grown-ups corner's kept words for ch3Told stay (chapter 9's spec, section 7, item 16); no golden cat
 * holds `warrior`, `ch10Puddle`, `ch10Best` or a pick flag, and the Warrior Counts stay closed for every one
 * (the hub's slot empty, the corner's "not open yet"). Today's runs are made once and shared (the drawings
 * memoized by what is drawn, which no list touches). tests/golden-ch08.test.js and the older goldens stand
 * beside this one, as they are. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const G9 = require('./fixtures/make-ch09-golden.js');
const GOLDEN9 = require('./fixtures/ch09-golden.json');

let NOW9 = null;
function now9() {
  if (NOW9) return NOW9;
  const PC = require('./_load.js').load();
  require('../app/ui.js');
  const ctx = G9.context9(PC);
  NOW9 = { PC, ctx, runs: G9.SCRIPTS9.map(s => G9.run9(ctx, s)) };
  return NOW9;
}
let ALL9 = null;
function all9() {
  if (ALL9) return ALL9;
  const { PC, ctx } = now9();
  const all = Object.assign({}, ctx, { read: G9.CH9.map(id => PC.story[id]), list: PC.story });
  ALL9 = G9.SCRIPTS9.map(s => G9.run9(all, s));
  return ALL9;
}
/* Chapter 10 as loaded: 'absent', the orchestrator's 'stub' (every frame's board "STUB.", as
 * tests/engine.test.js's teaser test tells a placeholder), or 'built'. */
function chapter10(PC) {
  const s = PC.story.ch10;
  if (!s || !s.frames) return 'absent';
  return Object.values(s.frames).every(f => /^STUB\b/.test(f.board || '')) ? 'stub' : 'built';
}
const firstAsks = (cat, re) => (cat.counts || []).filter(e => e && re.test(e.set || '') && !e.retry && !e.filler);
const key = (q) => q.a + 'x' + q.b;
const pair = (a, b) => Math.min(a, b) + 'x' + Math.max(a, b);
const DIFF = '; `node tests/fixtures/make-ch09-golden.js --diff DIR` writes it whole';
const SNAPSHOT = '5bde0c5';

/* One run, today's (compacted) against the golden's: every reading frame by frame, every lesson, the Hollow,
 * her two pages, the corner's words for ch3Told, the Warrior Counts and the cat; `moved` names what this pass
 * lets move (the teaser and the hub), compared by the caller. */
function same(now, then, name, moved) {
  assert.deepEqual(now.readings.map(x => x.chapter), then.readings.map(x => x.chapter), name + ': the same readings');
  then.readings.forEach((R, k) => {
    const N = now.readings[k], where = name + ', reading ' + (k + 1) + ' (' + R.chapter + ')';
    assert.equal(N.frames, R.frames, where + ': the same frames, in the same order');
    assert.equal(N.picked, R.picked, where + ': the same choices');
    assert.deepEqual([N.left, N.resumed], [R.left, R.resumed], where + ': left and picked up where it was');
    const a = N.shown.split(' '), b = R.shown.split(' '), ids = R.frames.split(' ');
    assert.equal(a.length, b.length, where + ': as many frames shown');
    b.forEach((h, n) => assert.equal(a[n], h, where + ': what ' + ids[n] + ' shows (its scene and drawing, captions and what Read to me says, balloons and their labels and voices, its sound and where it is lettered, options, its card, her Case File with every card drawn and its rows, its skip-count tap by tap, the page she taps)' + DIFF));
    assert.equal(N.said, R.said, where + ': what the page says over each Counts frame’s first question and after its last' + DIFF);
    assert.deepEqual(N.lessons, R.lessons, where + ': every lesson, question by question (its pictures and their drawings, its words, its result, its line, its whole help hop by hop)' + DIFF);
  });
  assert.deepEqual(now.hollow, then.hollow, name + ': the Training Hollow, its rounds (the 8s among them) and its lines' + DIFF);
  assert.deepEqual(now.pages, then.pages, name + ': her book’s chapter 5 page and Puddle’s page, word for word');
  assert.deepEqual(now.told, then.told, name + ': the grown-ups corner’s words for her chapter 3 choice');
  assert.deepEqual(now.warrior, then.warrior, name + ': the Warrior Counts as the hub and the grown-ups corner show them to her (closed until chapter 10 is finished)');
  assert.deepEqual([now.book, now.corner, now.extra, now.cat, now.flags, now.status], [then.book, then.corner, then.extra, then.cat, then.flags, then.status],
    name + ': her book but its teaser (every page and dragonet), the grown-ups corner, her cards, file and learned Counts, the cat at the end (her status too), the flags' + DIFF);
  if (!moved) {
    assert.deepEqual(now.teaser, then.teaser, name + ': chapter 9’s teaser, the last chapter');
    assert.deepEqual(now.hub, then.hub, name + ': the hub');
  }
  assert.deepEqual(now.tables, then.tables, name + ': the grown-ups corner’s tables (E.factTables), their headings and rows');
}

test('chapters 1 to 9 play and render exactly as on the tree chapter 10 is built on: every frame and what it shows (its scene and its drawing, its captions and what Read to me says, its balloons with their labels and voices, its options, its card and its drawing, her whole Case File with every card drawn, the pages she taps), every skip-count tap by tap, what the page says round each lesson, every question, picture, line and help hop by hop, the Hollow, the book with its dragonets, the grown-ups corner and E.factTables, the hub and the cat, for fifteen readings (tests/fixtures/ch09-golden.json)', () => {
  assert.equal(GOLDEN9.engine, G9.VERSION9, 'recorded with the engine of the merged tree chapter 10 is built on (the Warrior Counts merged onto chapter 9, the polish release in), not chapter 9’s own 0.9.0');
  assert.equal(GOLDEN9.engine, '0.9.1 (the Warrior Counts, 2026-10-31)');
  assert.equal(GOLDEN9.commit, SNAPSHOT, 'recorded from the snapshot of main after the Warrior Counts’ merge and the polish release');
  assert.equal(GOLDEN9.runs.length, G9.SCRIPTS9.length);
  const { runs } = now9();
  runs.forEach((r, i) => {
    assert.equal(r.name, GOLDEN9.runs[i].name);
    same(G9.compact9(r), GOLDEN9.runs[i].run, GOLDEN9.runs[i].name, false);
  });
});

/* Chapter 9's readings, set by set, as rows: "2x8", "F:2x8" (a filler), "R:7x8" (a retry), "✗" a miss. */
const seq = (rows) => (rows || []).map(rw => (rw.q.retry ? 'R:' : rw.q.filler ? 'F:' : '') + key(rw.q) + (rw.res.correct ? '' : '✗')).join(' ');
function nines(runs) {
  return runs.reduce((a, r, i) => a.concat(r.readings.map((x, k) => [x, k]).filter(([x]) => x.chapter === 'ch09').map(([x, k], n) => ({ i, n, k, r, x, L: x.lessons }))), []);
}
/* The flags her readings have set by the end of reading k (a found flag is set by reaching a frame, never by a choice). */
function setBy(PC, r, k) {
  const acc = {};
  r.readings.slice(0, k + 1).forEach(x => x.frames.forEach(id => Object.assign(acc, PC.story[x.chapter].frames[id].sets || {})));
  return acc;
}

test('the chapter 9 golden’s readings cover what chapters 1 to 9 can make of a cat: every frame of every chapter; every specialty and worry, told and kept, both chapter 2 paths, the roofs of chapters 4, 5 and 9 and “Not today”, Puddle, Wisp, Sleet, Hail and Mizzle found and not, both of chapter 8’s routes, a tom, slow and quick; every option of chapter 9’s choices, the roof by a climber and by a noticing cat, a dragonet’s five for the flaps (Squall’s, Hail’s or Mizzle’s alone) and none, the shiny cat’s dew, a reread; the Hollow’s 8s', () => {
  const { PC, runs } = now9();
  const flags = runs.map(r => r.end.flags);
  // every frame of chapters 1 to 9 is shown by some reading
  G9.CH9.forEach(ch => {
    const seen = new Set();
    runs.forEach(r => r.readings.filter(x => x.chapter === ch).forEach(x => x.frames.forEach(id => seen.add(id))));
    assert.deepEqual(Object.keys(PC.story[ch].frames).filter(id => !seen.has(id)), [], ch + ': every frame is in some reading');
  });
  assert.deepEqual([...new Set(runs.map(r => r.readings[0].picked.find(p => p.startsWith('f014:'))))].sort(), ['f014:0', 'f014:1', 'f014:2', 'f014:3', 'f014:4'], 'every specialty');
  assert.deepEqual([...new Set(flags.map(f => f.worry))].sort(), ['shiny', 'small', 'talk', 'water'], 'every worry');
  for (const k of ['ch3Told', 'foundSquall', 'ch4CaughtFly', 'ch5Roof', 'foundPuddle', 'foundWisp', 'foundSleet', 'foundHail', 'foundMizzle', 'ch9Roof']) {
    assert.ok(flags.some(f => f[k] === true) && flags.some(f => f[k] !== true), k + ': with it and without it');
  }
  assert.deepEqual([...new Set(flags.map(f => f.ch2Path))].sort(), ['bridge', 'river']);
  assert.deepEqual([...new Set(flags.map(f => f.ch5First))].sort(), ['heron', 'otters']);
  assert.ok(runs.some(r => r.end.look.sex === 'tom' && r.end.petname === 'Snickerdoodle' && r.end.name === 'Murmur'), 'a tom, his own names');
  // chapter 8's two routes, told and kept
  const eight = runs.reduce((a, r) => a.concat(r.readings.filter(x => x.chapter === 'ch08').map(x => (x.picked.some(p => /^f(045|118):/.test(p)) ? 'told ' : 'kept ') + (x.picked.includes('f036:1') ? 'field' : 'tunnel'))), []);
  assert.deepEqual([...new Set(eight)].sort(), ['kept field', 'kept tunnel', 'told field', 'told tunnel'], 'chapter 8: both routes on both paths');
  // the roofs: Squall from chapter 4's, chapter 5's and chapter 9's, and never met
  assert.ok(flags.some(f => f.foundSquall && !f.ch5Roof && !f.ch9Roof) && flags.some(f => f.ch5Roof) && flags.some(f => f.ch9Roof) && flags.some(f => !f.foundSquall), 'Squall from every roof, and not met');
  // chapter 9: every option of its four choices; the tower's offer only to a cat who has never met Squall
  const nine = nines(runs);
  assert.deepEqual([...new Set(nine.reduce((a, e) => a.concat(e.x.picked), []))].sort(),
    ['f032:0', 'f032:1', 'f043:0', 'f043:1', 'f062:0', 'f062:1', 'f127:0', 'f127:1'], 'every option of chapter 9’s choices');
  nine.forEach(e => {
    const met = setBy(PC, e.r, e.k - 1).foundSquall === true;
    assert.deepEqual([e.x.frames.includes('f062'), e.x.frames.includes('f063')], [!met, met], e.r.name + ': the tower’s offer to a cat who has never met Squall, the line for a cat who knows him');
  });
  // the roof by a climber (f066) and by a cat who is not (f067, f068); Mizzle (f055) and the elder's moss (f044)
  const up = nine.filter(e => e.x.picked.includes('f062:0'));
  assert.ok(up.some(e => e.x.frames.includes('f066')) && up.some(e => e.x.frames.includes('f067')), 'the roof by a climber and by a cat who is not');
  up.forEach(e => assert.ok(e.x.frames.includes('f079') && e.x.lessons['ch04-riddle'], e.r.name + ': the roof copy to its last frame, chapter 4’s riddle on it'));
  assert.ok(nine.some(e => e.x.frames.includes('f055')) && nine.some(e => e.x.frames.includes('f044')), 'Mizzle in the oak, and the elder’s moss');
  // a dragonet's five for the flaps (f098): Squall's, Hail's or Mizzle's alone, and none
  // (the five she brings is what she has found by the remedy: before chapter 9, or in it, on the roof or in the oak)
  const five = (e) => { const f = setBy(PC, e.r, e.k); return ['foundSquall', 'foundHail', 'foundMizzle'].filter(k => f[k] === true); };
  nine.forEach(e => assert.equal(e.x.frames.includes('f098'), five(e).length > 0, e.r.name + ': a dragonet’s five for the flaps exactly when she brings one'));
  for (const k of ['foundSquall', 'foundHail', 'foundMizzle']) assert.ok(nine.some(e => five(e).join() === k && e.x.frames.includes('f098')), 'the flaps with ' + k + ' alone');
  assert.ok(nine.some(e => five(e).length === 0 && !e.x.frames.includes('f098') && e.x.frames.includes('f099')), 'the flaps with no dragonet’s five');
  // the shiny cat's line at the dew (Squall met before, not on this roof)
  assert.ok(nine.some(e => e.x.frames.includes('f083')) && nine.some(e => e.x.frames.includes('f082')), 'the dew: the shiny cat who knows Squall, and the roof cat');
  // a reread of chapter 9: Squall met by then, Mizzle found again
  const again = runs.find(r => r.readings.filter(x => x.chapter === 'ch09').length === 2);
  assert.ok(again, 'chapter 9 read twice');
  const [n1, n2] = again.readings.filter(x => x.chapter === 'ch09');
  assert.ok(n1.picked.includes('f062:0') && !n2.frames.includes('f062') && n2.frames.includes('f063'), 'the roof, then Squall known');
  assert.equal(again.end.flags.foundMizzle, true, 'foundMizzle stays');
  // the Training Hollow offers the 8s to every cat, and asks a round of them
  runs.forEach(r => assert.ok(r.hollow.some(h => h.table === 8 && h.setId === 'ch09-eights' && h.rows.length && h.says.buttons.includes('Spiders’ legs · the 8s')), r.name + ': a round of the 8s'));
  // slow and quick in chapter 9
  const answers = runs.map(r => firstAsks(r.end, /^ch09-/));
  assert.ok(answers.some(a => a.some(e => e.correct && e.ms >= PC.engine.FAST_MS)) && answers.some(a => a.some(e => e.correct && e.ms < PC.engine.FAST_MS)), 'slow and quick');
});

test('the chapter 9 golden’s readings miss in every way chapter 9’s sets allow: the warm-up’s hard pick (from a chapter-8 miss, a slow answer, or none), remembered and missed, its fillers and the slip of known issue 6; the eights’ twins and the 8 × 7 check, their fillers; Mizzle’s riddle once, twice, three times; the three doses once, twice and a filler, the three readings of known issue 14; the roof’s riddle; every answer wrong', () => {
  const { PC, runs } = now9();
  const E = PC.engine, nine = nines(runs).filter(e => e.n === 0), D = PC.story.ch09.counts;
  const all = (set) => nine.map(e => [e, seq(e.L[set])]).filter(x => x[1]);
  const has = (set, s) => all(set).some(([, q]) => q === s);
  const starts = (set, s) => all(set).some(([, q]) => q.startsWith(s));
  for (const set of ['ch09-fours', 'ch09-eights', 'ch09-mizzle', 'ch09-dew', 'ch09-rubs', 'ch09-flaps', 'ch04-riddle']) {
    assert.ok(all(set).some(([, q]) => /^\S+✗/.test(q)), set + ': a first ask missed');
    assert.ok(all(set).some(([, q]) => / R:\S+✗/.test(q)), set + ': a retry missed');
  }
  assert.ok(all('ch09-dew').some(([, q]) => / F:\S+✗/.test(q)), 'a dose’s filler missed');
  assert.ok(nine.some(e => Object.keys(e.L).every(k => e.L[k].every(rw => !rw.res.correct))), 'every answer wrong');
  // the warm-up's hard pick: from a chapter-8 miss, from a slow right answer, and 4 × 7 when nothing was hard (quick and slow)
  const opener = nine.map(e => [e, e.L['ch09-fours'][0]]);
  const hard = opener.filter(([, rw]) => rw.q.hard);
  assert.ok(hard.some(([e, rw]) => firstAsks(e.r.end, /^ch08-fours$/).some(x => !x.correct && key(x) === key(rw.q))), 'the warm-up asks her chapter-8 miss first');
  assert.ok(hard.some(([e, rw]) => !firstAsks(e.r.end, /^ch08-fours$/).some(x => !x.correct) && firstAsks(e.r.end, /^ch08-fours$/).some(x => x.correct && x.ms >= E.FAST_MS && key(x) === key(rw.q))), 'or her slow answer');
  assert.ok(hard.some(([, rw]) => key(rw.q) === '3x4') && hard.some(([, rw]) => key(rw.q) === '10x4'), 'a slow 3 × 4 and a slow 10 × 4');
  assert.ok(hard.some(([, rw]) => rw.res.lineKind === 'remembered') && hard.some(([, rw]) => rw.res.lineKind === 'rememberedSlow') && hard.some(([, rw]) => !rw.res.correct), 'the hard pick remembered quick and slow, and missed');
  const plain = opener.filter(([, rw]) => !rw.q.hard);
  plain.forEach(([e, rw]) => assert.equal(key(rw.q), '4x7', e.r.name + ': 4 × 7 when nothing was hard'));
  assert.ok(plain.some(([, rw]) => rw.res.lineKind === 'fast') && plain.some(([, rw]) => rw.res.lineKind === 'praise'), '4 × 7 quick and slow');
  // its fillers: a miss on the first lends 3 × 4 after 2 × 4; a miss on 2 × 4 lends 3 × 4 then 4 × 5 (chapter 9's spec, section 2)
  assert.ok(has('ch09-fours', '4x7✗ 2x4 F:3x4 R:4x7'), 'a missed first question lends 3 × 4');
  assert.ok(has('ch09-fours', '4x7 2x4✗ F:3x4 F:4x5 R:2x4'), 'a missed 2 × 4 lends 3 × 4, then 4 × 5');
  const lentFours = nine.reduce((a, e) => a.concat(e.L['ch09-fours'].filter(rw => rw.q.filler)), []);
  lentFours.forEach(rw => assert.match(rw.prompt.map(l => l.text).join(' '), /^One from yesterday\. /, 'a filler as “One from yesterday.”'));
  assert.ok(lentFours.some(rw => rw.prompt.map(l => l.text).join(' ') === 'One from yesterday. Three cats. How many paws?'), 'One from yesterday. Three cats. How many paws?');
  // known issue 6: with the hard pick 3 × 4, three misses lend its own 2 × 4 back; with 10 × 4, three misses lend none of its own
  assert.ok(has('ch09-fours', '3x4✗ 2x4 F:4x5✗ R:3x4 F:4x6✗ R:4x5 F:2x4 R:4x6'), 'the slip: 3 × 4 missed three times lends 2 × 4 back (chapter 9’s known issue 6)');
  assert.ok(has('ch09-fours', '10x4✗ 2x4 F:3x4✗ R:10x4 F:4x5✗ R:3x4 F:4x6 R:4x5'), 'three misses with 10 × 4 first: no pair of its own lent');
  nine.forEach(e => {
    const rows = e.L['ch09-fours'], own = [pair(rows[0].q.a, rows[0].q.b), '2x4', '4x4'];
    const slip = rows[0].q.hard && ['3x4', '4x5'].includes(key(rows[0].q)) && rows.filter(rw => !rw.res.correct).length >= 3;
    if (!slip) rows.filter(rw => rw.q.filler).forEach(rw => assert.ok(!own.includes(pair(rw.q.a, rw.q.b)), e.r.name + ': the warm-up lends none of its own (' + key(rw.q) + ')'));
  });
  // the eights: a single miss of 7 × 8 comes back before its twin; 7 × 8 and 8 × 8; the 8 × 7 check missed; 7 × 8 twice, then a quick 8 × 7
  assert.ok(starts('ch09-eights', '2x8 8x5 4x8 7x8✗ 8x3 8x8 R:7x8 8x7'), 'a missed 7 × 8 asked again before 8 × 7');
  assert.ok(starts('ch09-eights', '2x8 8x5 4x8 7x8✗ 8x3 8x8✗ R:7x8 8x7 R:8x8 6x8'), '7 × 8 and 8 × 8 missed');
  assert.ok(starts('ch09-eights', '2x8 8x5 4x8 7x8✗ 8x3 8x8 R:7x8 8x7✗'), 'the 8 × 7 check missed');
  assert.ok(runs.some(r => firstAsks(r.end, /^ch09-eights$/).some(e => key(e) === '8x7' && e.check && !e.correct)), 'logged as a missed check');
  const twice = nine.find(e => seq(e.L['ch09-eights']).startsWith('2x8 8x5 4x8 7x8✗ 8x3 8x8 R:7x8✗ 8x7 '));
  assert.ok(twice, '7 × 8 missed twice, then 8 × 7');
  // her log up to the end of that lesson
  const log = twice.r.end.counts, from = log.findIndex(x => x.set === 'ch09-eights');
  let to = from;
  while (to < log.length && log[to].set === 'ch09-eights') to++;
  const upTo = log.slice(0, to), q87 = upTo.filter(x => x.set === 'ch09-eights' && key(x) === '8x7')[0];
  assert.ok(q87.correct && q87.ms < E.FAST_MS && q87.check, 'the 8 × 7 check right and quick');
  const at9 = G9.CH9.map(id => PC.story[id]);
  assert.deepEqual([E.hardFacts({ counts: upTo }, 8, at9)[0], E.hardFacts({ counts: upTo }, 7, at9)[0]], [[7, 8], [7, 8]], 'a quick right check never hides the miss: 7 × 8 is the hardest 8s and 7s fact');
  // the eights' fillers near the end: 9 × 8 lends 2 × 8, 8 × 3, and again 4 × 8, 8 × 5; 8 × 10 lends 2 × 8
  assert.ok(all('ch09-eights').some(([, q]) => q.endsWith('9x8✗ F:2x8 F:8x3 R:9x8')), '9 × 8 missed once');
  assert.ok(all('ch09-eights').some(([, q]) => q.endsWith('9x8✗ F:2x8 F:8x3 R:9x8✗ F:4x8 F:8x5 R:9x8')), '9 × 8 missed twice');
  assert.ok(all('ch09-eights').some(([, q]) => q.endsWith('8x10✗ 9x8 F:2x8 R:8x10')), '8 × 10 missed');
  // Mizzle's riddle: once, twice, three times, her fillers in her twigs
  assert.ok(has('ch09-mizzle', '6x8✗ F:2x8 F:8x3 R:6x8'), 'Mizzle’s riddle missed once');
  assert.ok(has('ch09-mizzle', '6x8✗ F:2x8 F:8x3 R:6x8✗ F:4x8 F:8x5 R:6x8'), 'twice');
  assert.ok(has('ch09-mizzle', '6x8✗ F:2x8 F:8x3 R:6x8✗ F:4x8 F:8x5 R:6x8✗'), 'three times');
  assert.ok(nine.some(e => (e.L['ch09-mizzle'] || []).some(rw => rw.q.filler && rw.prompt.map(l => l.text).join(' ') === 'An easy one… Two twigs. How many acorns?')), 'An easy one… Two twigs. How many acorns?');
  // the roof's riddle (chapter 4's set, run as chapter 5 ran it): once and three times
  assert.ok(has('ch04-riddle', '7x5✗ F:1x5 F:5x3 R:7x5') && has('ch04-riddle', '7x5✗ F:1x5 F:5x3 R:7x5✗ F:4x5 F:5x5 R:7x5✗'), 'the roof’s riddle once and three times');
  // the doses: twice each, and a filler missed (it comes back as itself)
  assert.ok(has('ch09-dew', '8x4✗ F:2x8 F:8x3 R:8x4✗ F:2x8 F:8x3 R:8x4') && has('ch09-rubs', '3x8✗ F:2x8 F:4x8 R:3x8✗ F:2x8 F:4x8 R:3x8') && has('ch09-flaps', '8x8✗ F:2x8 F:8x5 R:8x8✗ F:2x8 F:8x5 R:8x8'), 'every dose missed twice');
  assert.ok(has('ch09-dew', '8x4✗ F:2x8✗ F:8x3 R:8x4 R:2x8'), 'a missed filler comes back as itself');
  // known issue 14: every dose missed once, with Mizzle not met, right, and missed once (chapter 9's spec, section 2)
  const once = (e, set) => seq(e.L[set]).replace(/ F:\S+/g, '');
  const doses = nine.filter(e => once(e, 'ch09-dew') === '8x4✗ R:8x4' && once(e, 'ch09-rubs') === '3x8✗ R:3x8' && once(e, 'ch09-flaps') === '8x8✗ R:8x8');
  const fill = (e, set) => (e.L[set] || []).filter(rw => rw.q.filler).map(rw => key(rw.q)).join(' ');
  const by = (st) => doses.filter(e => (!e.L['ch09-mizzle'] ? 'none' : once(e, 'ch09-mizzle') === '6x8' ? 'right' : once(e, 'ch09-mizzle') === '6x8✗ R:6x8' ? 'once' : 'other') === st);
  for (const [st, want] of [['none', ['', '2x8 8x3', '8x5 2x8', '6x8 2x8']], ['right', ['', '2x8 8x3', '8x5 2x8', '2x8 8x5']], ['once', ['2x8 8x3', '8x5 2x8', '2x8 4x8', '2x8 8x5']]]) {
    assert.ok(by(st).length, 'every dose missed once, Mizzle ' + st);
    by(st).forEach(e => assert.deepEqual(['ch09-mizzle', 'ch09-dew', 'ch09-rubs', 'ch09-flaps'].map(s => fill(e, s)), want, e.r.name + ': the fillers, Mizzle ' + st + ' (known issue 14)'));
  }
  // the one-fact sets' guarantees: a filler is one of the lesson's facts, never the set's own pair or an avoided one
  const lesson = new Set(D['ch09-eights'].facts.map(f => (Array.isArray(f) ? pair(f[0], f[1]) : pair(f.a, f.b))));
  for (const set of ['ch09-mizzle', 'ch09-dew', 'ch09-rubs', 'ch09-flaps']) {
    const f0 = D[set].facts[0], banned = new Set([pair(f0.a, f0.b)].concat((D[set].avoid || []).map(p => pair(p[0], p[1]))));
    nine.forEach(e => (e.L[set] || []).filter(rw => rw.q.filler).forEach(rw => {
      assert.ok(lesson.has(pair(rw.q.a, rw.q.b)) && !banned.has(pair(rw.q.a, rw.q.b)), e.r.name + ', ' + set + ': lends ' + key(rw.q));
    }));
  }
});

/* The page hands the engine every story it has loaded (ui.js: `stories()` is `PC.story`), not chapters 1
 * to 9 alone. So the same fifteen readings again, chapters 1 to 9 read as before but every loaded story
 * handed to the engine everywhere else (the scenes, the cards, the Case File, the lessons, the Hollow, the
 * book, the hub, the tables, the Warrior Counts): what chapters 1 to 9 show must not move. Only what is about
 * the chapter after chapter 9 may, each by name, in both of chapter 10's states (the STUB and the built
 * chapter; E.chapters keeps a stub, since its storyList keeps every story with frames): chapter 9's teaser in
 * her book is built and leads to chapter 10 (its words as they were), and the hub offers chapter 10 instead of
 * “coming soon” (E.progress().next, `soon` null; E.upNext). E.factTables does not move: no golden cat logs a
 * table-7 answer, so chapter 10's 7s (E.countFor(7), once built) head no table of hers. Any other difference
 * is a later chapter changing an earlier one. */
test('chapters 1 to 9 with every loaded story handed to the engine, as the page does: every reading (frame by frame, every lesson), every Hollow round, the corner and E.factTables, her cards and file, her book, the Warrior Counts and the cat exactly as recorded; only chapter 9’s teaser (built, leading to chapter 10) and the hub’s next chapter move', (t) => {
  const { PC, runs } = now9();
  const E = PC.engine, nine = G9.CH9.map(id => PC.story[id]), state = chapter10(PC);
  t.diagnostic('chapter 10 is ' + state);
  if (state === 'stub') {
    const s = PC.story.ch10;
    assert.deepEqual([s.start, Object.keys(s.frames), s.frames.f001.next, !!s.frames.f002.end], ['f001', ['f001', 'f002'], 'f002', true], 'the stub: two frames, so opening it finishes nothing');
  }
  assert.deepEqual(E.chapters(PC.story).slice(0, 9).map(s => s.id), G9.CH9, 'chapters 1 to 9 first, in order');
  const next = E.nextChapter(PC.story.ch09, PC.story);
  if (state === 'absent') assert.equal(next, null, 'nothing after chapter 9');
  else assert.equal(next && next.id, 'ch10', 'E.chapters keeps chapter 10 (' + state + ') after chapter 9');
  const sevens = E.countFor(7, PC.story);
  if (state === 'built') assert.equal(sevens && sevens.chapter, 'ch10', 'chapter 10 teaches the 7s');
  else assert.equal(sevens, null, 'no chapter teaches the 7s yet (' + state + ')');
  all9().forEach((r, i) => {
    const now = G9.compact9(r), then = GOLDEN9.runs[i].run, base = runs[i], name = GOLDEN9.runs[i].name + ' (chapter 10 ' + state + ')';
    assert.equal(G9.compact9(base).book, then.book, name + ': the first pass is the golden');
    same(now, then, name, true);
    // her book's teaser: on the snapshot, chapter 9 was the last; its words as they were, built and leading on
    assert.deepEqual([then.teaser.title, then.teaser.built, then.teaser.next], ['Chapter 10: The Gathering', false, null], name + ': on the snapshot, chapter 9 was the last');
    assert.deepEqual(now.teaser, next ? Object.assign({}, then.teaser, { built: true, next: next.id }) : then.teaser, name + ': chapter 9’s teaser, its words as they were' + (next ? ', leads to chapter 10' : ''));
    // the hub: chapter 10 up next instead of “coming soon”
    assert.deepEqual([then.hub.upNext, then.hub.next, then.hub.soon && then.hub.soon.built, then.hub.latest], [null, null, false, 'ch09'], name + ': on the snapshot, nothing next but the teaser');
    assert.deepEqual(now.hub, next ? Object.assign({}, then.hub, { upNext: next.id, next: next.id, soon: null }) : then.hub, name + ': the hub' + (next ? ': chapter 10 is next, nothing else moves' : ''));
    const p = E.progress(r.end, PC.story), p9 = E.progress(r.end, nine);
    assert.deepEqual([p9.next, p9.soon && p9.soon.built], [null, false], name + ': with chapters 1 to 9, nothing next but the teaser');
    if (next) assert.deepEqual([p.next && p.next.id, p.soon, p.latest.id], ['ch10', null, 'ch09'], name + ': with every chapter, chapter 10 is next');
    // the grown-ups corner's tables: no table-7 answer in her log, so no heading of chapter 10's
    assert.ok((r.end.counts || []).every(e => E.tableOf(e, PC.story) !== 7), name + ': no table-7 answer in her log');
    assert.ok(!now.tables.some(x => x[0] === 7), name + ': no 7s table');
    assert.deepEqual(E.factTables(r.end, nine).map(x => x.name), then.tables.map(x => x[1]), name + ': with chapters 1 to 9, the headings as recorded');
  });
});

/* Chapter 10's one edit to shipped story code is chapter 5's page (`book.recap`): its "found Puddle" line and
 * its forepaw line leave out a cat whose only Puddle is chapter 10's (`ch10Puddle`: its spec, sections 1 and
 * 5). No golden cat holds `ch10Puddle`, so her chapter 5 page must read exactly as it did, and so must
 * Puddle's page; and the grown-ups corner keeps its kept words for ch3Told (chapter 9's spec, section 7,
 * item 16: they describe the chapter 3 choice). Named here on their own, in both passes, though the readings
 * above hold them too. */
test('every golden cat’s chapter 5 page and Puddle’s page read as recorded, with chapters 1 to 9 and with every loaded story (chapter 10’s ch10Puddle edit to chapter 5’s page moves neither); the grown-ups corner’s kept words for ch3Told stay as recorded', () => {
  const { runs } = now9();
  const pass = [['chapters 1 to 9', runs], ['every loaded story', all9()]];
  const kept = GOLDEN9.runs.filter(g => g.run.flags.ch3Told === false);
  assert.ok(kept.length >= 4, 'kept cats in the golden');
  kept.forEach(g => assert.deepEqual(g.run.told, ['ch3Told', 'kept Sprinkle’s secret: only Riffle knows too (later chapters remember)', false], g.name + ': the kept words, as recorded'));
  const PUDDLE = /^Under the raft .* found Puddle, /, FOREPAW = /^Under the Old Bridge, Sprinkle lit a forepaw for everyone found so far\./;
  const lines = GOLDEN9.runs.map(g => g.run.pages.ch05.recap);
  assert.ok(lines.some(L => L.some(x => PUDDLE.test(x))) && lines.some(L => !L.some(x => PUDDLE.test(x))), 'chapter 5’s Puddle line, and a page without it');
  assert.ok(lines.some(L => L.some(x => FOREPAW.test(x))) && lines.some(L => !L.some(x => FOREPAW.test(x))), 'chapter 5’s forepaw line, and a page without it');
  pass.forEach(([label, list]) => list.forEach((r, i) => {
    const g = GOLDEN9.runs[i], name = g.name + ' (' + label + ')';
    assert.ok(g.run.pages.ch05 && g.run.pages.ch05.recap.length, g.name + ': a chapter 5 page');
    assert.equal(!!g.run.pages.puddle, g.run.flags.foundPuddle === true, g.name + ': Puddle’s page exactly when she has found him');
    assert.equal(g.run.pages.ch05.recap.some(x => PUDDLE.test(x)), g.run.flags.foundPuddle === true, g.name + ': chapter 5’s Puddle line exactly when she found him');
    assert.ok(r.end.flags.ch10Puddle === undefined, name + ': no ch10Puddle');
    assert.deepEqual(r.pages.ch05, g.run.pages.ch05, name + ': her chapter 5 page, word for word');
    assert.deepEqual(r.pages.puddle, g.run.pages.puddle, name + ': Puddle’s page, word for word');
    assert.deepEqual(r.told, g.run.told, name + ': the grown-ups corner’s words for ch3Told');
  }));
});

/* Chapter 10's own save data (its spec, section 1: `ch10Puddle`, `ch10Best` and the five pick flags) and the
 * Warrior Counts' (`warrior`, opened by finishing chapter 10) are in no save that has not read chapter 10, so
 * no golden cat holds any of them, in either pass; and the Warrior Counts stay closed for every golden cat: the
 * hub's slot is empty and the grown-ups corner says they open once chapter 10 is finished. */
test('no golden cat holds warrior, ch10Puddle, ch10Best or a pick flag, with chapters 1 to 9 or with every loaded story; the Warrior Counts stay closed for every one (the hub’s slot empty, the corner’s “not open yet”)', () => {
  const { runs } = now9();
  const TEN = /^ch10/;
  [['chapters 1 to 9', runs], ['every loaded story', all9()]].forEach(([label, list]) => list.forEach((r, i) => {
    const name = GOLDEN9.runs[i].name + ' (' + label + ')';
    assert.ok(!('warrior' in r.end), name + ': no warrior data');
    assert.deepEqual(Object.keys(r.end.flags).filter(k => TEN.test(k)), [], name + ': no flag of chapter 10’s (ch10Puddle, ch10Best, ch10Pick…)');
    assert.ok(!r.end.finished.ch10 && r.end.chapter !== 'ch10', name + ': chapter 10 neither read nor finished');
    assert.deepEqual([r.warrior.held, r.warrior.after, r.warrior.state.open, r.warrior.state.sat, r.warrior.hub], [false, 'ch10', false, false, null], name + ': the Warrior Counts closed, the hub’s slot empty');
    assert.equal(r.warrior.corner.line, 'not open yet: they open once chapter 10 is finished', name + ': the grown-ups corner’s line');
  }));
  GOLDEN9.runs.forEach(g => {
    assert.deepEqual(Object.keys(g.run.flags).filter(k => TEN.test(k)), [], g.name + ': recorded with no flag of chapter 10’s');
    assert.equal(g.run.warrior.held, false, g.name + ': recorded with no warrior data');
  });
});
