/* The take-aways kit, the engine (docs/take-aways.md v0.3: sections 1 to 4 and 8, and section 9's engine
 * tests). On the real chapters 1 to 11 and stand-in chapters 12 to 21 (tests/fixtures/takes-stub.js, the
 * design's section 3 table as take sets) until the real ones land. The exhaustive checks (every problem's
 * plan, 2,000 helps a kind, 1,000 twins of every module problem, the goldens' cats) are in
 * tests/takes-exhaustive.test.js, in tools/test.mjs's SLOW list.
 * The kit's second pass (section 10, step 3: the shelf, Count the store, the cross-table warm-up, the waiting
 * re-sit's readers, the grown-ups' corner) brings tests 10, 11's warm-up across both and 12's rounds. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const PC = require('./_load.js').load();
const E = PC.engine;
const T = E.takes;
const V1 = require('./fixtures/v1.js');
const V1SAVES = require('./fixtures/v1-saves.json');
const stub = require('./fixtures/takes-stub.js');

const clone = (o) => JSON.parse(JSON.stringify(o));
const REAL = E.chapters(PC.story);
const STUB = stub();
const ALLCH = REAL.concat(STUB.list);
const CH = stub.CH;
const pr = (a, b) => a + ' − ' + b;
const plan = (a, b) => E.takePlan(a, b);
// every problem of the module (section 3's table, the spare 589 − 267 too): 63
const MODULE = [].concat(...Object.keys(CH).map((n) => [].concat(CH[n].lesson || [], CH[n].story).map((f) => [f[0], f[1]])), [[589, 267]]);
const SPREAD = MODULE.filter(([a, b]) => plan(a, b).cols.some((c) => c.spreads.length));
function memStorage() { const m = {}; return { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: (k) => { delete m[k]; } }; }

/* Answer one problem of a take state column by column: `typer(q, c)` gives her digit ('' for OK on an empty
 * box); taps first on a 'tap' turn. Returns the problem's last result. */
function answerProblem(st, def, typer, clock) {
  const pos = st.pos;
  let res = null;
  for (let guard = 0; guard < 12 && st.pos === pos && !T.done(st); guard++) {
    while (T.question(st).tap > 0) T.tap(st);
    const q = T.question(st), c = q.plan.cols[q.col];
    res = T.digit(st, def, typer(q, c), 2500, clock.t += 1000);
  }
  return res;
}
const rightTyper = (q, c) => (c.blank ? '' : c.digit);
function lessonOf(facts, def, opts) {
  def = Object.assign({ id: 'test-take', op: '-' }, def || {});
  return { def, st: T.start(def, Object.assign({ facts, set: def.id, mode: 'chapter', now: 1000, logged: 10 }, opts || {})) };
}

/* ================================================================ 1. the plan */
test('1. the plan: digits, spreads and marks of the design\'s worked problems; a − b on a sample, its marks 4, 9, 13 and 7, 10, 11', () => {
  const p = plan(503, 278);
  assert.deepEqual(p.cols.map((c) => [c.top, c.before, c.at, c.bottom, c.digit, c.end, c.lent, c.chain, c.blank]),
    [[3, 3, 13, 8, 5, 13, false, true, false], [0, 9, 9, 7, 2, 9, true, false, false], [5, 4, 4, 2, 2, 4, true, false, false]]);
  assert.deepEqual(p.cols[0].spreads, [{ from: 2, to: 1 }, { from: 1, to: 0 }]);
  assert.deepEqual(E.takeMarks(p, 'show', {}, 3, 0).map((m) => m.mark).reverse(), [4, 9, 13], 'the marks of 503 − 278');
  const q = plan(811, 356);
  assert.deepEqual(E.takeMarks(q, 'show', {}, 3, 0).map((m) => m.mark).reverse(), [7, 10, 11], 'the marks of 811 − 356');
  assert.equal(E.takeMarks(q, 'show', {}, 1, 0)[1].mark, 0, '811 − 356: its tens lettered 0 first');
  assert.equal(E.takeMarks(q, 'show', {}, 2, 0)[1].mark, 10, '... then 10');
  // a − b on a seeded sample (the whole range is the exhaustive file's)
  const rnd = E.util.rng(11);
  for (let k = 0; k < 3000; k++) {
    const a = 10 + Math.floor(rnd() * 990), b = 1 + Math.floor(rnd() * (a - 1));
    const p2 = plan(a, b);
    if (String(b).length > String(a).length) { assert.equal(p2, null); continue; }
    const digits = p2.cols.map((c) => (c.blank ? '' : String(c.digit))).reverse().join('');
    assert.equal(+digits, a - b, pr(a, b));
    p2.cols.forEach((c) => { assert.ok(c.spreads.length <= 2); assert.ok(c.at >= 0 && c.at <= 18); });
  }
  [[9, 1], [1000, 1], [50, 50], [50, 0], [5.5, 1], [50, 2.5], [99, 100], ['50', 2], [-10, 1]].forEach(([a, b]) => assert.equal(plan(a, b), null, a + ' − ' + b + ' is not asked'));
});

/* ================================================================ 2. the kinds and flags */
test('2. the kinds and flags of every problem in section 3\'s table, as it says', () => {
  const kinds = { none: [[254, 131], [305, 102]], ones: [[52, 27], [640, 218]], tens: [[735, 391]], both: [[432, 178], [811, 356]], zero: [[503, 278]], zeros: [[500, 412]] };
  Object.keys(kinds).forEach((k) => kinds[k].forEach(([a, b]) => assert.equal(E.takeKind(plan(a, b)), k, pr(a, b))));
  const flag = (f) => MODULE.concat([[512, 107]]).filter(([a, b]) => E.takeFlags(plan(a, b))[f]).map(([a, b]) => pr(a, b)).sort();
  assert.deepEqual(flag('leavesZero'), ['811 − 356', '513 − 248', '710 − 254', '815 − 69', '912 − 468', '410 − 136'].sort());
  assert.deepEqual(flag('toZero'), ['811 − 356', '513 − 248', '710 − 254', '815 − 69', '912 − 468', '410 − 136', '512 − 107'].sort());
  assert.deepEqual(flag('idleZero'), ['305 − 102']);
  assert.deepEqual(flag('noHundreds'), ['731 − 696', '382 − 345', '500 − 412', '503 − 478', '497 − 427', '500 − 467', '500 − 382'].sort().filter((x) => E.takeFlags(plan(...x.split(' − ').map(Number))).noHundreds));
  ['731 − 696', '382 − 345', '500 − 412', '503 − 478', '497 − 427'].forEach((x) => assert.ok(flag('noHundreds').includes(x), x));
  assert.ok(flag('noLoose').includes('70 − 34') && flag('noLoose').includes('640 − 218') && flag('noLoose').includes('400 − 156'));
  // the chapters' rows (section 3's table): kinds as it says
  const want = {
    12: ['none', 'none', 'none', 'none', 'none'], 13: ['ones', 'ones', 'ones', 'none', 'none'], 14: ['ones', 'ones', 'ones', 'none', 'none'],
    15: ['tens', 'tens', 'tens', 'none', 'ones'], 16: ['both', 'both', 'both', 'none', 'tens'], 17: ['none', 'ones', 'tens', 'both', 'both'],
    18: ['zero', 'zero', 'zero', 'none', 'both'], 19: ['zeros', 'zeros', 'zeros', 'none', 'both'], 20: ['zero', 'zeros', 'both', 'both', 'none']
  };
  Object.keys(want).forEach((n) => assert.deepEqual(CH[n].lesson.map(([a, b]) => E.takeKind(plan(a, b))), want[n], 'ch' + n));
  assert.equal(E.takeKind(plan(589, 267)), 'none');
  assert.deepEqual(MODULE.length, 63);
  // the steps: 500 − 412 zeros, 503 − 478 zero, 731 − 696 and 382 − 345 mixed, 43 − 16 ones2 (test 8's five)
  [[500, 412, 'zeros'], [503, 478, 'zero'], [731, 696, 'mixed'], [382, 345, 'mixed'], [43, 16, 'ones2'], [352, 127, 'ones'], [254, 131, 'none']].forEach(([a, b, s]) => assert.equal(E.takeStepOf(plan(a, b)), s, pr(a, b)));
  // the shape keeps what section 3 says
  const sh = E.takeShape(plan(503, 278));
  assert.deepEqual(Object.keys(sh), ['n', 'nb', 'cols', 'flags']);
  assert.deepEqual(Object.keys(sh.cols[0]), ['zero', 'bottom', 'spreads', 'chain', 'toZero', 'digitZero', 'blank']);
});

/* ================================================================ 3. the guards */
test('3. the guards: E.checkTakes refuses each bad fact and set, a step\'s set with the wrong count, an answer twice, noHundreds before mixed; it passes the stand-in chapters 12 to 21, and chapters 1 to 11 are unchanged', () => {
  STUB.list.forEach((s) => assert.deepEqual(E.checkStory(s, ALLCH), [], s.id + ' passes'));
  REAL.forEach((s) => { assert.deepEqual(E.checkTakes(s, PC.story), [], s.id + ': no take set, no error'); assert.deepEqual(E.checkStory(s, PC.story), [], s.id); });
  const with12 = (mut) => { const S = stub(); mut(S.ch12, S); return E.checkTakes(S.ch12, REAL.concat(S.list)); };
  const refuses = (mut, re, label) => { const e = with12(mut); assert.ok(e.some((x) => re.test(x)), label + ': ' + JSON.stringify(e)); };
  const story = (S) => S.ch12.counts['ch12-story'];
  refuses((s, S) => { story(S).facts = [[42, 175]]; }, /not a take-away/, 'a negative');
  refuses((s, S) => { story(S).facts = [[175, 175]]; }, /not a take-away/, 'an answer of 0');
  refuses((s, S) => { story(S).facts = [[1175, 42]]; }, /not a take-away/, 'a four-digit top');
  refuses((s, S) => { story(S).facts = [[75, 142]]; }, /not a take-away/, 'a longer bottom');
  refuses((s, S) => { story(S).facts = [[175.5, 42]]; }, /not a take-away/, 'a decimal');
  refuses((s, S) => { story(S).facts = [[503, 498]]; }, /more than one digit shorter/, 'an answer two digits short');
  refuses((s, S) => { story(S).facts = [{ a: 175, b: 42, table: 3 }]; }, /no table/, 'a table');
  refuses((s, S) => { story(S).facts = [{ a: 175, b: 42, regroup: 'spread' }]; }, /regroup/, 'a bad regroup');
  refuses((s, S) => { story(S).facts = [{ a: 175, b: 42, picture: { kind: 'prey' } }]; }, /picture/, 'a bad picture kind');
  refuses((s, S) => { story(S).facts = [{ a: 175, b: 42, prompt: 'one two three four five six seven eight nine ten eleven twelve thirteen' }]; }, /13 words/, 'a first balloon over 12 words');
  // every balloon of a prompt at most 12 words, captions apart: the page joins the first column's line to the last
  // one when it is the teacher's, and no balloon gets more room than that one
  const words = (n) => Array.from({ length: n }, (_, i) => 'w' + i).join(' ');
  const prompted = (prompt) => with12((s, S) => { story(S).facts = [{ a: 175, b: 42, prompt }]; });
  refuses((s, S) => { story(S).facts = [{ a: 175, b: 42, prompt: [{ who: 'glintstar', text: 'How many stay?' }, { text: words(13) }] }]; }, /balloon 1 is 13 words/, 'a long last balloon, the one the page joins');
  refuses((s, S) => { story(S).facts = [{ a: 175, b: 42, prompt: [{ text: words(13) }, ''] }]; }, /balloon 0 is 13 words/, 'a long balloon before an empty one');
  assert.deepEqual(prompted([{ text: words(12) }, { who: 'chispapaw', kind: 'whisper', text: words(8) }]), [], 'twelve words, then a whisper: chapter 12\'s 58 − 23');
  assert.deepEqual(prompted([{ text: 'How many?' }, { kind: 'caption', text: words(20) }]), [], 'a caption is not a balloon');
  refuses((s, S) => { story(S).facts = [{ a: 175, b: 42, prompt: [{ kind: 'caption', text: 'Dusk.' }] }]; }, /prompt is a line, or balloons and captions/, 'no balloon at all');
  refuses((s, S) => { story(S).teach = 'regrouping'; }, /teach is one of/, 'teach not a step');
  refuses((s, S) => { story(S).twins = 'no'; }, /twins is true or false/, 'twins not a boolean');
  refuses((s, S) => { story(S).warm = 1; }, /warm is true or false/, 'warm not a boolean');
  refuses((s, S) => { story(S).lines = { hello: 'Hi.' }; }, /unknown key hello/, 'an unknown lines key');
  refuses((s, S) => { story(S).fillOrder = 'easiest'; }, /no fillOrder/, 'a multiplication key');
  refuses((s, S) => { s.counts['ch12-pile'] = { table: 2, facts: [[2, 3]], fillFrom: 'ch12-story' }; }, /fills from it/, 'a Counts set lending from a take set');
  refuses((s, S) => { s.counts['ch12-take'].facts.push([52, 27]); }, /every take-away needs no spread/, 'teach none with a spread');
  refuses((s, S) => { story(S).facts = [[176, 42], [175, 42]]; s.counts['ch12-take'].facts[1] = [176, 43]; }, /asked twice/, 'an answer twice in a chapter');
  refuses((s, S) => { story(S).op = '+'; }, /op is "-"/, 'an op that is not a take');
  // a step's set
  const with13 = (mut) => { const S = stub(); mut(S.ch13.counts['ch13-take']); return E.checkTakes(S.ch13, REAL.concat(S.list)); };
  assert.ok(with13((d) => { d.facts[4] = [62, 35]; }).some((x) => /exactly three/.test(x)), 'four of its step');
  assert.ok(with13((d) => { d.facts[3] = [526, 254]; }).some((x) => /earlier step/.test(x)), 'a later step among the rest');
  assert.ok(with13((d) => { d.facts[3] = [62, 35]; d.facts[4] = [64, 37]; d.facts.splice(2, 1); }).some((x) => /no spread/.test(x) || /exactly three/.test(x)), 'none with no spread');
  const with17 = (mut) => { const S = stub(); mut(S.ch17.counts['ch17-take']); return E.checkTakes(S.ch17, REAL.concat(S.list)); };
  assert.ok(with17((d) => { d.facts = [[764, 321], [371, 145], [614, 253], [745, 412], [532, 211]]; }).some((x) => /four kinds/.test(x)), 'a mixed set of three kinds');
  assert.ok(with17((d) => { d.facts[3] = [732, 696 - 300]; }).some((x) => /no hundreds left/.test(x)), 'mixed with no noHundreds problem');
  // noHundreds before the chapter that teaches mixed
  const S = stub();
  S.ch16.counts['ch16-story'].facts.push([382, 345]);
  assert.ok(E.checkTakes(S.ch16, REAL.concat(S.list)).some((x) => /before the chapter that teaches "mixed"/.test(x)));
  // a set with no teach: every step taught by now
  const S2 = stub();
  S2.ch13.counts['ch13-story'].facts.push([503, 278]);
  assert.ok(E.checkTakes(S2.ch13, REAL.concat(S2.list)).some((x) => /step "zero" is taught by no take set/.test(x)));
  // the 12-word balloon passes (chapter 12's worked prompt is the guard's most)
  assert.equal(stub.PROMPT12.split(/\s+/).length, 12);
});

/* ================================================================ 4. a column at a time */
test('4. a column at a time: right digits move a column at a time, ones first; a wrong one names its slip, is logged once, the column done with the right digit; pos moves only at a problem\'s end; one entry a problem, never in counts', () => {
  const { def, st } = lessonOf([[503, 278], [43, 16]]);
  const clock = { t: 5000 };
  let q = T.question(st);
  assert.equal(q.col, 0); assert.equal(q.mode, 'hers'); assert.equal(q.okEmpty, false);
  let r = T.digit(st, def, 5, 2000, clock.t += 1000);
  assert.equal(r.right, true); assert.deepEqual(r.spread, [{ from: 'hundreds', to: 'tens' }, { from: 'tens', to: 'ones' }], 'the picture spreads at a right digit, in hers');
  assert.equal(st.pos, 0); assert.equal(st.col, 1);
  // 'hers': struck lenders, the receiving column lettered; the lenders' values wait for their own digits
  assert.deepEqual(r.marks.map((m) => [m.struck, m.mark]), [[true, 13], [true, null], [true, null]]);
  assert.equal(E.takeLine(def, q.plan, 1, null, 'hers', true), 'Now the tens. Take away seven.', 'a later column names its bottom, never its top');
  assert.equal(E.takeLine(def, q.plan, 2, null, 'hers', true), 'Now the hundreds. Take away two.');
  r = T.digit(st, def, 3, 2000, clock.t += 1000);
  assert.equal(r.right, false); assert.equal(r.slip, 'zero', '3 at 503 − 278\'s tens: the row it gave not taken off');
  assert.equal(r.help.digit, 2); assert.equal(st.got[1], 2, 'the column is done with the right digit');
  assert.equal(st.pos, 0);
  r = T.digit(st, def, 2, 2000, clock.t += 1000);
  assert.equal(r.problemDone, true); assert.equal(st.pos, 1);
  assert.deepEqual(r.entry.slips, [{ col: 1, given: 3, slip: 'zero' }]);
  assert.equal(r.entry.given, '235'); assert.equal(r.entry.correct, false); assert.equal(r.entry.helped, true);
  assert.equal(r.entry.ms, 6000); assert.deepEqual(r.entry.cols, [2000, 2000, 2000]); assert.equal(r.entry.kind, 'zero'); assert.equal(r.entry.digits, 3); assert.equal(r.entry.regroup, 'hers');
  assert.equal(st.log.length, 1);
  assert.equal(r.lineKind, 'miss'); assert.equal(r.line, 'And you finished it. We’ll do one like it soon.');
  assert.equal(st.queue.length, 3, 'its twin queued');
  const cat = E.blankCat({ now: 1 });
  E.logTake(cat, r.entry);
  assert.equal(cat.counts.length, 0, 'never in counts'); assert.equal(cat.takes.log.length, 1);
  // the leftmost blank box is asked: OK lit even when empty, 0 or nothing right, a 1 at 500 − 467 kept
  const b = lessonOf([[500, 467], [382, 345], [731, 696]], { twins: false });
  const ck = { t: 1000 };
  T.digit(b.st, b.def, 3, 1, ck.t += 1000); T.digit(b.st, b.def, 3, 1, ck.t += 1000);
  q = T.question(b.st); assert.equal(q.col, 2); assert.equal(q.okEmpty, true);
  r = T.digit(b.st, b.def, 1, 1, ck.t += 1000);
  assert.equal(r.slip, 'kept'); assert.equal(r.help.blank, true); assert.equal(r.help.digit, null);
  assert.equal(r.help.line, 'No squares left. We don’t write a zero in front.');
  assert.equal(r.entry.given, '133');
  T.digit(b.st, b.def, 7, 1, ck.t += 1000); T.digit(b.st, b.def, 3, 1, ck.t += 1000);
  r = T.digit(b.st, b.def, '', 1, ck.t += 1000);
  assert.equal(r.right, true); assert.equal(r.blankLine, 'No squares left. We don’t write a zero in front.'); assert.equal(r.entry.given, '37');
  T.digit(b.st, b.def, 5, 1, ck.t += 1000); T.digit(b.st, b.def, 3, 1, ck.t += 1000);
  r = T.digit(b.st, b.def, 0, 1, ck.t += 1000);
  assert.equal(r.right, true); assert.equal(r.entry.given, '035'); assert.equal(r.entry.correct, true);
  // every problem's leftmost box takes OK empty, and no other box does
  const c = lessonOf([[475, 132]]);
  assert.deepEqual(T.digit(c.st, c.def, '', 1, 2000), { ignored: 'empty' });
  // an OK within 400 ms of the last is ignored: a double tap at 475 − 132's tens leaves the hundreds empty
  T.digit(c.st, c.def, 3, 1, 3000);
  T.digit(c.st, c.def, 4, 1, 4000);
  assert.deepEqual(T.digit(c.st, c.def, '', 1, 4150), { ignored: 'guard' }, 'the second tap of a double tap');
  assert.equal(c.st.col, 2); assert.equal(c.st.got[2], undefined, 'the hundreds still empty and unanswered');
  r = T.digit(c.st, c.def, 3, 1, 4500);
  assert.equal(r.problemDone, true); assert.equal(r.entry.correct, true);
});

test('4. the help\'s marks in \'hers\': a lender\'s value waits for its own digit unless a help drew its spread (503 − 278\'s ones helped: the 9 and the 4 before the tens; its tens helped: the 4 still waits)', () => {
  const a = lessonOf([[503, 278]]);
  let r = T.digit(a.st, a.def, 0, 1, 2000);
  assert.equal(r.slip, 'zero');
  assert.deepEqual(r.marks.map((m) => m.mark), [13, 9, 4], 'the ones helped: all three lettered');
  assert.deepEqual(T.question(a.st).marks.map((m) => m.mark), [13, 9, 4]);
  const b = lessonOf([[503, 278]]);
  T.digit(b.st, b.def, 5, 1, 2000);
  r = T.digit(b.st, b.def, 7, 1, 3000);
  assert.equal(r.slip, 'zero');
  assert.deepEqual(r.marks.map((m) => m.mark), [13, 9, null], 'the tens helped: the 4 waits for her hundreds');
  r = T.digit(b.st, b.def, 2, 1, 4000);
  assert.deepEqual(r.marks.map((m) => m.mark), [13, 9, 4]);
  // and 'show' letters every spread as it lands
  const s = lessonOf([{ a: 503, b: 278, regroup: 'show' }]);
  const show = E.takeShow(s.def, plan(503, 278), 0);
  assert.deepEqual(show.steps.map((x) => x.marks.map((m) => m.mark)), [[null, null, null], [null, 10, 4], [13, 9, 4], [13, 9, 4]], 'the zero\'s 10, then 9');
});

test('4. the problem\'s end line: again for a right twin, rememberedStep for a round\'s hard step right (never blank), praise in turn with blanks, its own right lines, the miss lines', () => {
  const def = { id: 's', op: '-', praise: ['Yes!', '', 'Good.'], lines: { again: ['', ''], rememberedStep: { zero: '' } } };
  const st = T.start(def, { facts: [[58, 23], [76, 42], [475, 132], { a: 368, b: 145, right: ['Two squares left.'] }, { a: 254, b: 131, of: '58-23' }, { a: 503, b: 278, hard: 'zero' }], now: 1, logged: 9 });
  const clock = { t: 1000 }, lines = [];
  while (!T.done(st)) { const r = answerProblem(st, def, rightTyper, clock); lines.push([r.lineKind, r.lineKind === 'right' ? r.balloons[0].text : r.line]); }
  assert.deepEqual(lines, [['praise', 'Yes!'], ['praise', ''], ['praise', 'Good.'], ['right', 'Two squares left.'],
    ['again', 'There it is. You remembered how.'], ['rememberedStep', 'Across the zero, and no sand needed!']]);
  // a helped one: the miss line when its twin is coming, else missLast; a twins: false set never queues one
  const n = lessonOf([[43, 16]], { twins: false });
  const r = answerProblem(n.st, n.def, (q, c) => (q.col === 0 ? 3 : c.digit), { t: 1 });
  assert.equal(r.requeued, false); assert.equal(r.line, 'And you finished it.'); assert.equal(n.st.queue.length, 1);
});

test('4. the ones-first pointer: a wrong first digit equal to the answer\'s leading digit, in her first five or a teach: \'none\' set, is not checked, not logged, once a problem', () => {
  const run = (def, logged) => {
    const st = T.start(Object.assign({ id: 'p', op: '-' }, def), { facts: [[58, 23], [76, 42]], now: 1, logged });
    return { st, def: Object.assign({ id: 'p', op: '-' }, def) };
  };
  let { st, def } = run({}, 0);
  let r = T.digit(st, def, 3, 1, 2000);
  assert.deepEqual(r, { pointer: true, col: 0, line: 'Ones first: this box, on the right.' });
  assert.equal(st.col, 0); assert.equal(st.slips.length, 0); assert.equal(st.first.length, 0);
  r = T.digit(st, def, 3, 1, 3000);
  assert.equal(r.slip, 'fact', 'once a problem: the second time it is checked');
  ({ st, def } = run({}, 5));
  assert.equal(T.digit(st, def, 3, 1, 2000).slip, 'fact', 'past her first five: checked');
  ({ st, def } = run({ teach: 'none' }, 50));
  assert.equal(T.digit(st, def, 3, 1, 2000).pointer, true, 'in a teach: none set, always');
  ({ st, def } = run({}, 0));
  assert.equal(T.digit(st, def, 4, 1, 2000).slip, 'fact', 'a wrong digit that is not the leading one: checked');
  // her first five count this lesson's take-aways too
  ({ st, def } = run({}, 4));
  answerProblem(st, def, rightTyper, { t: 5000 });
  assert.equal(T.digit(st, def, 3, 1, 90000).slip, 'fact', 'the fifth logged: no pointer');
});

/* the three students (check-v0.3.js): what each types in a column, reading the column as the page shows it
 * in 'hers' (a later column's top as written: its line says only its bottom) */
function student(kind) {
  return (q, c) => {
    const bv = c.bottom == null ? 0 : c.bottom, seen = c.col === 0 ? c.before : c.top;
    if (kind === 'flipper') return Math.abs(seen - bv);
    if (kind === 'nodec') return seen >= bv ? seen - bv : seen + 10 - bv;
    const t = c.col > 0 && !c.lent ? c.before - 1 : c.before;   // 'extra': spreads where nothing needed it
    return t >= bv ? t - bv : t + 10 - bv;
  };
}
test('4. three students on every module problem with a spread, every column asked, the blank box among them: the one who takes the smaller from the bigger and the one who never takes the one off are green on none', () => {
  assert.equal(SPREAD.length, 45);
  ['flipper', 'nodec'].forEach((kind) => {
    const { def, st } = lessonOf(SPREAD, { twins: false });
    const clock = { t: 1000 }, green = [];
    while (!T.done(st)) { const r = answerProblem(st, def, student(kind), clock); if (r.entry.correct) green.push(pr(r.entry.a, r.entry.b)); }
    assert.deepEqual(green, [], kind + ' green on none');
    assert.equal(st.log.length, 45);
  });
  const slipAt = (kind, a, b, col) => { const p = plan(a, b); return E.takeSlip(p, col, student(kind)(null, p.cols[col])); };
  assert.equal(slipAt('nodec', 43, 16, 1), 'kept');
  assert.equal(slipAt('nodec', 503, 278, 1), 'zero');
  assert.equal(slipAt('nodec', 503, 278, 2), 'kept');
  [[731, 696], [500, 412], [503, 478], [500, 467]].forEach(([a, b]) => ['flipper', 'nodec'].forEach((k) => {
    const p = plan(a, b), c = p.cols[p.n - 1];
    assert.equal(student(k)(null, c), 1, pr(a, b) + ' ' + k + ' types 1 at the blank');
    assert.equal(E.takeSlip(p, p.n - 1, 1), 'kept');
  }));
  assert.equal(slipAt('extra', 475, 132, 1), 'extra');
});

/* ================================================================ 5. the slips and their helps */
// section 2's cases (check-v0.2.js, the designer's fourteen re-read), v0.3's four (check-v0.3.js) and the review's
// four at a column that lent and needs its own spread (kept before the written top's flip, then nospread)
const CASES = [
  [43, 16, 0, 3, 'flip'], [43, 16, 0, 0, 'nospread'], [43, 16, 1, 3, 'kept'], [43, 16, 0, 8, 'fact'],
  [503, 278, 0, 0, 'zero'], [503, 278, 0, 4, 'fact'], [503, 278, 0, 6, 'fact'], [702, 345, 0, 3, 'zero'], [702, 345, 0, 0, 'zero'], [702, 345, 0, 6, 'fact'],
  [503, 278, 1, 3, 'zero'], [503, 278, 1, 7, 'zero'], [503, 278, 1, 0, 'zero'], [503, 278, 1, 1, 'fact'], [503, 278, 1, 8, 'fact'],
  [503, 278, 2, 3, 'kept'], [811, 356, 1, 0, 'nospread'], [811, 356, 1, 6, 'kept'], [640, 218, 0, 8, 'flip'], [473, 245, 0, 2, 'flip'],
  [473, 245, 1, 3, 'kept'], [475, 132, 1, 3, 'extra'], [475, 132, 2, 2, 'extra'], [475, 32, 2, 3, 'extra'], [764, 321, 1, 3, 'extra'],
  [500, 467, 2, 1, 'kept'], [500, 467, 2, 0, null], [500, 467, 2, '', null], [731, 696, 2, 1, 'kept'], [403, 57, 2, 4, 'kept'],
  [607, 283, 1, 8, 'flip'], [607, 283, 1, 0, 'nospread'], [607, 283, 2, 4, 'kept'],
  [475, 132, 0, 2, 'fact'], [735, 391, 1, 6, 'flip'],
  [566, 168, 1, 0, 'kept'], [811, 356, 1, 4, 'flip'], [432, 178, 1, 4, 'flip'], [110, 61, 1, 5, 'kept']
];
test('5. every slip of section 2, by value (the 33 cases, v0.3\'s four and the review\'s four), in the table\'s order; 13 − 8 off by one and 9 − 7\'s misses are fact', () => {
  assert.equal(CASES.length, 39);
  CASES.forEach(([a, b, col, g, want]) => assert.equal(E.takeSlip(plan(a, b), col, g), want, pr(a, b) + ' col ' + col + ' typed ' + JSON.stringify(g)));
  [[503, 278, 0, [4, 6]], [702, 345, 0, [6, 8]], [503, 278, 1, [1, 8]]].forEach(([a, b, col, gs]) => gs.forEach((g) => assert.equal(E.takeSlip(plan(a, b), col, g), 'fact')));
  // a turn whose spread she was shown or tapped is never flip, nospread or a chain's zero
  assert.equal(E.takeSlip(plan(43, 16), 0, 3, true), 'fact');
  assert.equal(E.takeSlip(plan(43, 16), 0, 0, true), 'fact');
  assert.equal(E.takeSlip(plan(503, 278), 0, 0, true), 'fact');
  assert.equal(E.takeSlip(plan(503, 278), 1, 3, true), 'zero', 'the lent zero\'s own turn still is');
  assert.deepEqual(E.TAKE_SLIPS, ['zero', 'flip', 'nospread', 'kept', 'extra', 'fact']);
  // a lent column that needs its own spread: the one not taken off is kept (566 − 168's 0, never nospread), the
  // written top's flip is flip (811 − 356's 4, never fact: so the corner's teen row stays empty), and where the two
  // meet (bottom − top = 5) kept wins
  assert.equal(E.takeSlip(plan(811, 356), 1, 4, true), 'fact', 'a spread she was shown: never flip');
  const c811 = E.blankCat({ now: 1 });
  E.logTake(c811, { set: 'x', a: 811, b: 356, answer: 455, given: '445', correct: false, helped: true, slips: [{ col: 1, given: 4, slip: E.takeSlip(plan(811, 356), 1, 4) }], ms: 1, cols: [], at: 1, kind: 'both', digits: 3, regroup: 'hers' });
  assert.deepEqual(E.takeTable(c811).teen, [], 'no teen fact for a flip');
  assert.equal(E.takeHelp({}, plan(811, 356), 1, 'flip').intro, 'Careful: it’s zero take away five, the top take away the bottom. No rows. Not enough.', 'the flip help letters the top as it stands');
});

// a chapter's take set played right in every column up to a − b's column `col`, where she types `g`: that result
function typedInLesson(n, setId, a, b, col, g) {
  const S = stub();
  const L = E.takeLesson(E.blankCat({ now: 1 }), S['ch' + n], setId, 5000, REAL.concat(S.list));
  const clock = { t: 10000 };
  for (let guard = 0; guard < 80 && !T.done(L.state); guard++) {
    while (T.question(L.state).tap > 0) T.tap(L.state);
    const q = T.question(L.state), c = q.plan.cols[q.col], here = q.a === a && q.b === b && q.col === col;
    const r = T.digit(L.state, L.def, here ? g : c.blank ? '' : c.digit, 2000, clock.t += 1000);
    if (here) return r;
  }
  return assert.fail(pr(a, b) + ' is not in ' + setId);
}
test('5. extra only where its spread is taught, the kit\'s rule: a set\'s or a round\'s tens never says "no row went" before a step that spreads a row (ones2), its hundreds never "no square went" before one that spreads a square (tens): "Let\'s scratch it out." in their place; a 0 where the bottom is empty or 0 is fact', () => {
  assert.equal(E.takeSlip(plan(475, 132), 1, 3, false, ['none']), 'fact');
  assert.equal(E.takeSlip(plan(475, 132), 1, 3, false, ['none', 'ones2']), 'extra');
  assert.equal(E.takeSlip(plan(475, 132), 2, 2, false, ['none', 'ones2', 'ones']), 'fact');
  assert.equal(E.takeSlip(plan(475, 132), 2, 2, false, ['none', 'ones2', 'ones', 'tens']), 'extra');
  assert.equal(E.takeSlip(plan(475, 132), 2, 2, false, ['zeros']), 'extra', 'a later step teaches it too');
  assert.equal(E.takeSlip(plan(475, 132), 2, 2), 'extra', 'with no list, every step is taught (the direct calls above)');
  [[175, 42], [152, 28]].forEach(([a, b]) => assert.equal(E.takeSlip(plan(a, b), 2, 0), 'fact', pr(a, b) + ': 1 with nothing to take, typed 0'));
  assert.equal(E.takeSlip(plan(413, 202), 1, 0), 'fact', '1 − 0 typed 0: a fact, not a row taken');
  assert.equal(E.takeSlip(plan(475, 32), 2, 3), 'extra', 'an empty bottom and a digit not 0 is still extra');
  // through a chapter's lesson: the steps of this chapter and the earlier ones
  [[12, 'ch12-take', 58, 23, 1, 2, 'fact'], [12, 'ch12-take', 475, 132, 2, 2, 'fact'], [12, 'ch12-story', 175, 42, 2, 0, 'fact'],
    [13, 'ch13-take', 486, 253, 2, 1, 'fact'], [13, 'ch13-take', 97, 52, 1, 3, 'extra'], [14, 'ch14-take', 768, 315, 2, 3, 'fact'],
    [14, 'ch14-take', 768, 315, 1, 4, 'extra'], [15, 'ch15-take', 879, 346, 2, 4, 'extra']].forEach(([n, set, a, b, col, g, want]) => {
    const r = typedInLesson(n, set, a, b, col, g), tag = 'chapter ' + n + ' ' + pr(a, b) + ' col ' + col + ' typed ' + g;
    assert.equal(r.slip, want, tag);
    if (want === 'fact') assert.equal(r.help.intro, 'Let’s scratch it out.', tag);
  });
  assert.equal(typedInLesson(13, 'ch13-take', 97, 52, 1, 3).help.intro, 'Careful. The loose had enough, so no row went. Nine rows still.');
  assert.equal(typedInLesson(15, 'ch15-take', 879, 346, 2, 4).help.intro, 'Careful. The rows had enough, so no square went. Eight squares still.');
});

test('5. the three helps of section 2, step by step, and every case\'s help: its first line the slip\'s, the plan\'s spreads, hops ending at the digit, the digit written', () => {
  const says = (h) => h.steps.map((s) => s.say + (s.n != null ? ' [' + s.n + ']' : ''));
  const h1 = E.takeHelp({}, plan(503, 278), 0, 'zero');
  assert.deepEqual(says(h1), ['Three take away eight? Not enough loose, and no rows to spread.', 'So a square first: ten rows.', 'Now a row: ten more loose.',
    'Thirteen loose. Take away eight.', 'Take three: ten left. [10]', 'Five more: five left. [5]', 'Five loose.'], 'seven steps');
  assert.deepEqual(h1.steps.map((s) => s.marks.map((m) => m.mark)).slice(1, 3), [[null, 10, 4], [13, 9, 4]], 'the zero\'s "10", then "9"');
  assert.deepEqual(h1.steps[2].sand, { kind: 'quick', hundreds: 4, tens: 9, ones: 13, crossed: { squares: 1, lines: 1 }, fresh: { lines: 10, dots: 10 }, take: 0, lit: 0, col: 0, ground: 'sand' }, 'after the chain: 9 + 1 lines, all fresh, one crossed');
  assert.deepEqual(h1.steps[5].sand.take, 8); assert.deepEqual(h1.steps[5].sand.lit, 8);
  assert.deepEqual(says(E.takeHelp({}, plan(503, 278), 0, 'fact')), ['Across the zero: thirteen loose. Take away eight.', 'Take three: ten left. [10]', 'Five more: five left. [5]', 'Five loose.'], 'fact: the chain drawn, four steps');
  assert.equal(E.takeHelp({}, plan(503, 278), 0, 'fact').steps[0].sand.crossed.squares, 1);
  assert.deepEqual(says(E.takeHelp({}, plan(43, 16), 0, 'flip')), ['Careful: it’s three take away six, the top take away the bottom. Only three loose. Not enough.', 'Spread a row: ten more loose.',
    'Thirteen loose. Take away six.', 'Take three: ten left. [10]', 'Three more: seven left. [7]', 'Seven loose.']);
  const kept = E.takeHelp({}, plan(43, 16), 1, 'kept');
  assert.deepEqual(says(kept), ['Careful. One row went to the loose. Three rows now.', 'Three rows take away one row.', 'Two. [2]', 'Two rows.']);
  assert.equal(kept.steps[0].glow, true); assert.equal(kept.steps[0].marks[1].mark, 3, 'its gold value lettered with the first line');
  assert.equal(kept.steps[2].hop, true);
  // the tens and zero forms (section 2)
  assert.equal(E.takeHelp({}, plan(735, 391), 1, 'flip').intro, 'Careful: it’s three take away nine, the top take away the bottom. Only three rows. Not enough.');
  assert.equal(E.takeHelp({}, plan(607, 283), 1, 'flip').intro, 'Careful: it’s zero take away eight, the top take away the bottom. No rows. Not enough.');
  assert.equal(E.takeHelp({}, plan(607, 283), 1, 'flip').steps[1].say, 'Spread a square: ten rows.');
  assert.equal(E.takeHelp({}, plan(640, 218), 0, 'flip').intro, 'Careful: it’s zero take away eight, the top take away the bottom. No loose. Not enough.');
  assert.equal(E.takeHelp({}, plan(811, 356), 1, 'nospread').intro, 'No rows to take five from? But we can spread a square.');
  assert.equal(E.takeHelp({}, plan(43, 16), 0, 'nospread').intro, 'Three take away six? Not enough loose. But we can spread a row.');
  assert.equal(E.takeHelp({}, plan(503, 278), 1, 'zero').intro, 'Careful. That zero became ten rows, then gave one away. Nine rows now.');
  assert.equal(E.takeHelp({}, plan(503, 278), 2, 'kept').intro, 'Careful. One square became ten rows. Four squares now.');
  const k811 = E.takeHelp({}, plan(811, 356), 1, 'kept');
  assert.deepEqual(says(k811).slice(0, 3), ['Careful. One row went to the loose. No rows now.', 'Spread a square: ten rows.', 'Ten rows. Take away five.']);
  assert.equal(E.takeHelp({}, plan(475, 132), 1, 'extra').intro, 'Careful. The loose had enough, so no row went. Seven rows still.');
  assert.equal(E.takeHelp({}, plan(475, 132), 2, 'extra').intro, 'Careful. The rows had enough, so no square went. Four squares still.');
  assert.equal(E.takeHelp({}, plan(43, 16), 0, 'fact').intro, 'Three take away six: we spread a row, then take six.');
  assert.equal(E.takeHelp({}, plan(503, 278), 1, 'fact').intro, 'Nine take away seven: let’s scratch it out.');
  assert.equal(E.takeHelp({}, plan(58, 23), 0, 'fact').intro, 'Let’s scratch it out.');
  // every case: its help
  CASES.filter((x) => x[4]).forEach(([a, b, col, g, slip]) => {
    const p = plan(a, b), c = p.cols[col], h = E.takeHelp({}, p, col, slip);
    const tag = pr(a, b) + ' col ' + col + ' ' + slip;
    assert.equal(h.steps[0].say, h.intro, tag);
    const last = h.steps[h.steps.length - 1];
    assert.equal(last.write, true); assert.equal(h.digit, c.blank ? null : c.digit, tag);
    const pic = E.takePicture({}, { a, b }, { col, spreads: 9 });
    assert.deepEqual([last.sand.hundreds, last.sand.tens, last.sand.ones], [pic.hundreds, pic.tens, pic.ones], tag + ': the sand\'s number, the top as it stands');
    assert.equal([last.sand.ones, last.sand.tens, last.sand.hundreds][col], c.at, tag);
    assert.equal(last.sand.lit, c.bottom || 0, tag + ': the take ends at the bottom digit, every mark lit');
    const hops = h.steps.filter((s) => s.n != null);
    if (hops.length) assert.equal(hops[hops.length - 1].n, c.digit, tag + ': the hops end at the digit');
  });
});

/* ================================================================ 6. the twin */
test('6. the twin: the design\'s seed-7 twins; the same shape, a new top, no answer of the lesson\'s; forced (TRIES 0) the original; for \'hers\' no flip landing', () => {
  [[503, 278, 405, 227], [52, 27, 57, 28], [811, 356, 911, 168], [500, 412, 700, 623], [640, 218, 570, 134]].forEach(([a, b, ta, tb]) => {
    const t = E.takeTwin(plan(a, b), 7, [], 'hers');
    assert.deepEqual([t.a, t.b], [ta, tb], 'a twin of ' + pr(a, b) + ' (seed 7)');
  });
  SPREAD.concat([[305, 102], [497, 427]]).forEach(([a, b]) => {
    const p = plan(a, b);
    for (let s = 1; s <= 20; s++) {
      const t = E.takeTwin(p, s, [a - b + 1], 'hers'), q = plan(t.a, t.b);
      assert.ok(!t.fallback, pr(a, b));
      assert.deepEqual(E.takeShape(q), E.takeShape(p)); assert.equal(E.takeKind(q), E.takeKind(p));
      assert.notEqual(t.a, a); assert.notEqual(q.answer, a - b); assert.notEqual(q.answer, a - b + 1);
      assert.ok(!E.takeFlipLands(q), 'no flip landing'); assert.ok(t.tries <= 400);
    }
  });
  const keep = E.TAKE_TRIES;
  E.TAKE_TRIES = 0;
  try { assert.deepEqual(E.takeTwin(plan(503, 278), 7, [], 'hers'), { a: 503, b: 278, tries: 0, fallback: true }); }
  finally { E.TAKE_TRIES = keep; }
});

test('6. the twin in a lesson: queued two problems later or next when last, `of` its original\'s key, at most twice by lineage, its entry\'s `twin`, seeded by startedAt, pos and the requeue count; \'show\'\'s twin \'tap\', every other \'hers\'', () => {
  const wrongFirst = (q, c) => (q.col === 0 ? (c.digit + 1) % 10 : c.blank ? '' : c.digit);
  const { def, st } = lessonOf([[43, 16], [58, 23], [76, 42], [475, 132]]);
  answerProblem(st, def, wrongFirst, { t: 1000 });
  assert.equal(st.queue.length, 5);
  assert.equal(st.queue[3].of, '43-16', 'two problems later'); assert.equal(st.queue[3].regroup, 'hers');
  const tw = st.queue[3];
  assert.deepEqual(E.takeShape(plan(tw.a, tw.b)), E.takeShape(plan(43, 16)));
  // the same lesson again, the same twin: seeded by startedAt, pos and the requeue count
  const again = lessonOf([[43, 16], [58, 23], [76, 42], [475, 132]]);
  answerProblem(again.st, again.def, wrongFirst, { t: 99999 });
  assert.deepEqual(again.st.queue[3], tw);
  const other = lessonOf([[43, 16], [58, 23], [76, 42], [475, 132]], {}, { now: 2000 });
  answerProblem(other.st, other.def, wrongFirst, { t: 1000 });
  assert.notDeepEqual([other.st.queue[3].a, other.st.queue[3].b], [tw.a, tw.b], 'another start, another twin');
  // a twin missed brings one more (its `of` the first problem's), and that one's miss is the last
  const L = lessonOf([[43, 16]]);
  const clock = { t: 1000 }, lines = [];
  while (!T.done(L.st)) { const r = answerProblem(L.st, L.def, wrongFirst, clock); lines.push([r.entry.twin || null, r.line]); }
  assert.deepEqual(lines.map((x) => x[0]), [null, '43-16', '43-16'], 'at most twice, counted by lineage');
  assert.deepEqual(lines.map((x) => x[1]), ['And you finished it. We’ll do one like it soon.', 'And you finished it. We’ll do one like it soon.', 'And you finished it.']);
  assert.deepEqual(L.st.requeues, { '43-16': 2 });
  const answers = L.st.queue.map((x) => x.a - x.b);
  assert.equal(new Set(answers).size, 3, 'never an answer the lesson has had');
  // next, when it was the last
  const N = lessonOf([[58, 23], [43, 16]]);
  answerProblem(N.st, N.def, rightTyper, { t: 1000 });
  answerProblem(N.st, N.def, wrongFirst, { t: 5000 });
  assert.equal(N.st.queue.length, 3); assert.equal(N.st.queue[2].of, '43-16');
  // 'show''s twin is 'tap'; a 'tap' problem's is 'hers'
  const S = lessonOf([{ a: 43, b: 16, regroup: 'show' }, { a: 70, b: 34, regroup: 'tap' }]);
  answerProblem(S.st, S.def, wrongFirst, { t: 1000 });
  answerProblem(S.st, S.def, wrongFirst, { t: 9000 });
  assert.deepEqual(S.st.queue.slice(2).map((x) => [x.of, x.regroup]), [['43-16', 'tap'], ['70-34', 'hers']]);
  // a twin keeps its original's picture
  const P = lessonOf([{ a: 43, b: 16, picture: { kind: 'marks' } }]);
  answerProblem(P.st, P.def, wrongFirst, { t: 1000 });
  assert.deepEqual(P.st.queue[1].picture, { kind: 'marks' });
});
test('6. a chapter\'s twins: no twin\'s answer is one its chapter has (its lessons\' and its stories\'), so a story problem is asked once, in the story (section 3); E.takeLesson passes the chapter\'s answers as `avoid`', () => {
  const answersOf = (s) => [].concat(...Object.keys(s.counts).map((id) => s.counts[id].facts.map((f) => (Array.isArray(f) ? f[0] - f[1] : f.a - f.b))));
  const wrongFirst = (q, c) => (q.col === 0 ? (c.digit + 1) % 10 : c.blank ? '' : c.digit);
  let twins = 0;
  for (let now = 1000; now < 1000 + 997 * 100; now += 997) {
    const S = stub(), stories = REAL.concat(S.list);
    S.list.forEach((s) => {
      const ans = answersOf(s);
      Object.keys(s.counts).forEach((id) => {
        const L = E.takeLesson(E.blankCat({ now: 1 }), s, id, now, stories);
        assert.deepEqual(L.state.avoid.slice().sort((x, y) => x - y), ans.slice().sort((x, y) => x - y), s.id + ': its answers avoided');
        const clock = { t: now };
        while (!T.done(L.state)) {
          const r = answerProblem(L.state, L.def, wrongFirst, clock);
          if (r.twin) { twins++; assert.ok(!ans.includes(r.twin.a - r.twin.b), s.id + ' ' + id + ' (start ' + now + '): the twin ' + pr(r.twin.a, r.twin.b) + ' has an answer of its chapter'); }
        }
      });
    });
  }
  assert.ok(twins > 2000, twins + ' twins');
  // T.start keeps `avoid`'s numbers (test 14: a saved state with it is good, a bad one is dropped)
  const { def, st } = lessonOf([[43, 16]], {}, { avoid: [27, 'x'] });
  assert.deepEqual(st.avoid, [27]);
  answerProblem(st, def, wrongFirst, { t: 1000 });
  assert.notEqual(st.queue[1].a - st.queue[1].b, 27);
});

/* ================================================================ 7. 'show' and 'tap' */
test('7. \'show\' and \'tap\': E.takeShow across a row, a square and a zero; T.tap one spread at a time, a digit before it types nothing, a tap off the zone says tapHere once; the line after says the new top', () => {
  const row = E.takeShow({}, plan(43, 16), 0);
  assert.deepEqual(row.steps.map((s) => s.say), ['Three take away six? Only three loose. Not enough.', 'So I spread a row: ten more loose.', 'Thirteen take away six.']);
  assert.deepEqual(row.steps[1].spread, { from: 'tens', to: 'ones' });
  assert.deepEqual(row.steps[1].marks.map((m) => m.mark), [13, 3]);
  assert.equal(row.steps[1].picture.fresh.ones, 10);
  assert.deepEqual(row.taps.map((t) => [t.say, t.glow]), [['Not enough loose. Spread a row: tap it.', 'tens']]);
  assert.equal(row.here.tens, 'The rows: up here.');
  const sq = E.takeShow({}, plan(735, 391), 1);
  assert.deepEqual(sq.steps.map((s) => s.say), ['Three take away nine? Only three rows. Not enough.', 'So I spread a square: ten more rows.', 'Thirteen take away nine.']);
  assert.deepEqual(sq.taps.map((t) => [t.say, t.glow]), [['Not enough rows. Spread a square: tap it.', 'hundreds']]);
  assert.equal(sq.here.hundreds, 'The squares: up here.');
  const z = E.takeShow({}, plan(702, 345), 0);
  assert.deepEqual(z.steps.map((s) => s.say), ['Two take away five? Not enough loose, and no rows to spread.', 'So a square first: ten rows.', 'Now a row: ten more loose.', 'Twelve take away five.']);
  assert.deepEqual(z.taps.map((t) => [t.say, t.glow]), [['Not enough loose, and no rows. Spread a square: tap it.', 'hundreds'], ['Now tap a row.', 'tens']]);
  assert.deepEqual(z.steps.map((s) => s.marks[1].mark), [null, 10, 9, 9]);
  assert.equal(E.takeShow({}, plan(58, 23), 0), null, 'a turn that needs nothing');
  assert.equal(E.takeShow({}, plan(640, 218), 0).steps[0].say, 'Zero take away eight? No loose. Not enough.');
  assert.equal(E.takeShow({}, plan(640, 218), 0).steps[1].say, 'So I spread a row: ten loose.');
  assert.equal(E.takeShow({}, plan(500, 412), 0).steps[0].say, 'Zero take away two? No loose, and no rows to spread.');
  // the column's lines in the scaffold: before a show, the name (its first step says the top); before taps, the top as it
  // stands, as any column says it (the tap line says none: phase 2's check, problem 2); after either, the new top
  assert.equal(E.takeLine({}, plan(43, 16), 0, 'before', 'show', true), 'Ones first.');
  assert.equal(E.takeLine({}, plan(43, 16), 0, 'before', 'tap', true), 'Ones first. Three take away six.');
  assert.equal(E.takeLine({}, plan(43, 16), 0, 'after', 'tap', true), 'Thirteen take away six.');
  assert.equal(E.takeLine({}, plan(735, 391), 1, 'before', 'tap', true), 'Now the tens. Three take away nine.');
  assert.equal(E.takeLine({}, plan(735, 391), 1, 'before', 'show', true), 'Now the tens.');
  assert.equal(E.takeLine({}, plan(607, 283), 1, 'before', 'tap', true), 'Now the tens. Zero take away eight.');
  assert.equal(E.takeLine({}, plan(702, 345), 0, 'before', 'tap', true), 'Ones first. Two take away five.');
  assert.equal(E.takeLine({}, plan(503, 278), 1, null, 'show', true), 'Now the tens. Nine take away seven.');
  assert.equal(E.takeLine({}, plan(403, 57), 2, null, 'show', true), 'Now the hundreds. Nothing to take: three.');
  assert.equal(E.takeLine({}, plan(403, 57), 2, null, 'hers', true), 'Now the hundreds. Nothing to take.');
  // T.tap
  const { def, st } = lessonOf([{ a: 702, b: 345, regroup: 'tap' }]);
  let q = T.question(st);
  assert.equal(q.tap, 2); assert.equal(q.stage, 'before');
  assert.deepEqual(T.digit(st, def, 7, 1, 2000), { ignored: 'tap' }, 'a digit first types nothing');
  assert.deepEqual(T.tap(st, true), { off: true, glow: 'hundreds', say: true });
  assert.deepEqual(T.tap(st, true), { off: true, glow: 'hundreds', say: false }, 'up here once');
  let r = T.tap(st);
  assert.deepEqual([r.spread, r.tapped, r.left, r.glow], [{ from: 'hundreds', to: 'tens' }, 1, 1, 'tens']);
  assert.deepEqual(r.marks.map((m) => m.mark), [null, 10, 6]);
  r = T.tap(st);
  assert.deepEqual([r.left, r.glow], [0, null]); assert.deepEqual(r.marks.map((m) => m.mark), [12, 9, 6]);
  assert.equal(T.tap(st), null, 'nothing left to tap');
  q = T.question(st);
  assert.equal(q.tap, 0); assert.equal(q.stage, 'after');
  assert.equal(E.takeLine(def, q.plan, 0, q.stage, q.mode, q.full), 'Twelve take away five.');
  r = T.digit(st, def, 7, 1, 3000);
  assert.equal(r.right, true); assert.equal(r.spread, null, 'tapped already: nothing spreads now');
  // a shown turn's wrong digit starts its help at the take
  const s = lessonOf([{ a: 43, b: 16, regroup: 'show' }]);
  r = T.digit(s.st, s.def, 3, 1, 2000);
  assert.equal(r.slip, 'fact'); assert.equal(r.help.intro, 'Let’s scratch it out.');
  assert.equal(r.help.steps[0].sand.crossed.lines, 1, 'the spread in the sand already');
  assert.equal(r.help.steps[1].say, 'Thirteen loose. Take away six.');
});

/* ================================================================ 8. the record */
test('8. the record: entries as section 4 says (warm-up entries first asks), E.hardTakes from first asks only, a step leaving once right, E.takeTable (her own first asks, the time of her right \'hers\' answers) and its teen-facts row, the cap at 500 and the table saying so', () => {
  const cat = E.blankCat({ now: 1 });
  const S = stub();
  const stories = REAL.concat(S.list);
  E.startChapter(cat, S.ch14, 1000);
  V1.play(E, S.ch14, cat, { t: 5000, takeMiss: ['462-135', '352-127', '640-218'] });
  const log = cat.takes.log;
  assert.equal(log[0].warm, true, 'the made warm-up first'); assert.ok(!('twin' in log[0]));
  assert.equal(log[0].digits, 2); assert.equal(E.takeKind(plan(log[0].a, log[0].b)), 'ones');
  assert.equal(log[1].worked, true); assert.equal(log[1].regroup, 'show');
  assert.ok(log.some((e) => e.twin === '462-135'));
  log.forEach((e) => assert.deepEqual(Object.keys(e).filter((k) => !['twin', 'warm', 'worked', 'round'].includes(k)),
    ['set', 'a', 'b', 'answer', 'given', 'correct', 'helped', 'slips', 'ms', 'cols', 'at', 'kind', 'digits', 'regroup']));
  // her hard steps: 352 − 127 ('show') and 640 − 218 ('tap') never count; 462 − 135's miss makes ones hard, until a right first ask
  assert.ok(stories.length > 11);
  const hardAfter = E.hardTakes(cat);
  assert.deepEqual(hardAfter, [], 'the story\'s 473 − 245, a first ask of ones answered right, came after: the last ask decides');
  const c2 = E.blankCat({ now: 1 });
  const add = (a, b, over) => E.logTake(c2, Object.assign({ set: 'x', a, b, answer: a - b, given: '', correct: !(over && over.helped), helped: !!(over && over.helped), slips: [], ms: 1, cols: [], at: 1, kind: E.takeKind(plan(a, b)), digits: String(a).length, regroup: 'hers' }, over || {}));
  add(500, 412, { helped: true });
  assert.deepEqual(E.hardTakes(c2), ['zeros'], 'a slip across two zeros marks zeros, not mixed');
  add(43, 16, { helped: true, twin: '43-16' });
  add(43, 16, { helped: true, worked: true, regroup: 'show' });
  add(43, 16, { helped: true, regroup: 'tap' });
  assert.deepEqual(E.hardTakes(c2), ['zeros'], 'twins, worked and tapped problems never count');
  add(731, 696, { helped: true });
  assert.deepEqual(E.hardTakes(c2), ['mixed', 'zeros'], 'the most recent first');
  add(382, 345);
  assert.deepEqual(E.hardTakes(c2), ['zeros'], 'a hard step answered right leaves the list');
  // the table and its teen facts
  E.logTake(c2, { set: 'x', a: 503, b: 278, answer: 225, given: '224', correct: false, helped: true, slips: [{ col: 0, given: 4, slip: 'fact' }], ms: 30000, cols: [], at: 2, kind: 'zero', digits: 3, regroup: 'hers' });
  E.logTake(c2, { set: 'x', a: 413, b: 168, answer: 245, given: '244', correct: false, helped: true, slips: [{ col: 0, given: 4, slip: 'fact' }, { col: 1, given: 1, slip: 'kept' }], ms: 20000, cols: [], at: 3, kind: 'both', digits: 3, regroup: 'hers' });
  const tbl = E.takeTable(c2);
  assert.deepEqual(tbl.rows.map((r) => r.kind), ['ones', 'both', 'zero', 'zeros']);
  // "right first time" is of her own first asks, E.hardTakes' rule: the twin, the worked and the tapped 43 − 16 are not
  const ones = tbl.rows.find((r) => r.kind === 'ones');
  assert.deepEqual([ones.problems, ones.firstAsks, ones.rightFirst], [4, 1, 1], 'the worked and tap 43 − 16 are not her own first asks');
  // the typical time is of her right 'hers' answers only (a missed one, a worked or a tapped one is not)
  const zero = tbl.rows.find((r) => r.kind === 'zero');
  assert.deepEqual([zero.problems, zero.firstAsks, zero.rightFirst, zero.helped, zero.ms, zero.slip], [1, 1, 0, 1, null, 'fact']);
  const c4 = E.blankCat({ now: 1 });
  [[52, 27, 'hers', true, 20000], [62, 35, 'hers', true, 30000], [43, 16, 'show', true, 1000], [70, 34, 'tap', true, 2000], [85, 39, 'hers', false, 90000], [64, 37, 'hers', true, 40000, '85-39']].forEach(([a, b, regroup, correct, ms, twin], i) =>
    E.logTake(c4, Object.assign({ set: 'x', a, b, answer: a - b, given: '', correct, helped: !correct, slips: [], ms, cols: [], at: i, kind: 'ones', digits: 2, regroup }, regroup === 'show' ? { worked: true } : {}, twin ? { twin } : {})));
  const r4 = E.takeTable(c4).rows[0];
  assert.deepEqual([r4.problems, r4.firstAsks, r4.rightFirst, r4.helped, r4.ms], [6, 3, 2, 1, 30000], 'the median of 20, 30 and 40 seconds');
  assert.deepEqual(tbl.teen, [{ top: 13, bottom: 8, n: 2, text: '13 − 8 ×2' }]);
  assert.deepEqual([tbl.capped, tbl.cap], [false, 500], 'under the cap: her whole record');
  // the cap
  const c3 = E.blankCat({ now: 1 });
  for (let i = 0; i < 505; i++) E.logTake(c3, { set: 'x', a: 58, b: 23, at: i });
  assert.equal(c3.takes.log.length, 500); assert.equal(c3.takes.log[0].at, 5);
  assert.equal(E.TAKE_LOG_CAP, 500);
  assert.equal(E.takeTable(c3).capped, true, 'at the cap the table is her last 500');
  assert.deepEqual(E.takeTable(E.blankCat({ now: 1 })), { rows: [], teen: [], capped: false, cap: 500 }, 'a cat with no take-aways');
});

/* ================================================================ 9. the slots */
test('9. the slots: a take lesson saved after every column comes back at its frame, problem and column through a reload, a chapter parked and a Hollow round; a store round never reaches E.hollowFinish; a take state never reaches E.counts.question', () => {
  const S = stub();
  const reload = (cat) => E.migrate(clone({ version: 2, cats: [cat], current: cat.id, settings: {} })).cats[0];
  let cat = E.blankCat({ now: 1 });
  E.startChapter(cat, S.ch13, 1000);
  const ask = E.counts.question;
  E.counts.question = (st) => { if (st && st.op === '-') throw new Error('a take state reached E.counts.question'); return ask(st); };
  try {
    V1.play(E, S.ch13, cat, { t: 5000, stopIn: { f001: 2 } });
    assert.equal(cat.lesson.state.op, '-'); assert.equal(cat.lesson.state.pos, 1); assert.equal(cat.lesson.state.col, 0);
    cat = reload(cat);
    const L = E.lessonAt(cat, S.ch13, 'f001');
    assert.ok(L, 'it comes back at its frame'); assert.equal(L.state.pos, 1);
    // one column into the next problem, then away to another chapter and back
    const def = Object.assign({ id: 'ch13-take' }, S.ch13.counts['ch13-take']);
    while (T.question(L.state).tap) T.tap(L.state);
    T.digit(L.state, def, T.question(L.state).plan.cols[0].digit, 1, 900000);
    cat = reload(cat);
    assert.equal(cat.lesson.state.col, 1); assert.equal(cat.lesson.state.got.length, 1, 'her digit in its box');
    E.openChapter(cat, S.ch12, 990000);
    assert.equal(cat.places.ch13.lesson.state.col, 1, 'parked with its chapter');
    cat = reload(cat);
    E.openChapter(cat, S.ch13, 995000);
    const L2 = E.lessonAt(cat, S.ch13, 'f001');
    assert.equal(L2.state.pos, 1); assert.equal(L2.state.col, 1);
    // a module-1 Hollow round takes the slot: the take lesson waits in its place, and comes back
    const round = E.hollowStart(cat, REAL, 1000000, 1);
    E.holdLesson(cat);
    cat.lesson = { mode: 'hollow', state: round.state };
    assert.equal(cat.places.ch13.lesson.state.op, '-');
    cat = reload(cat);
    const back = E.lessonAt(cat, S.ch13, 'f001');
    assert.ok(back && back.state.op === '-' && back.state.col === 1, 'back at its frame, problem and column');
    assert.equal(cat.hollowWaiting.state.table, 1, 'the round waits in hollowWaiting');
    // finished: Next records it under its set, as any lesson's
    V1.play(E, S.ch13, cat, { t: 2000000 });
    assert.equal(cat.lessons['ch13-take'].op, '-'); assert.equal(cat.lessons['ch13-take'].finished, true);
    assert.equal(cat.counts.length, 0);
  } finally { E.counts.question = ask; }
  // a take state whose last answer is in but was never recorded is settled as a take lesson
  const c = E.blankCat({ now: 1 });
  const { def, st } = lessonOf([[58, 23]]);
  answerProblem(st, def, rightTyper, { t: 1 });
  c.lesson = { mode: 'chapter', frame: 'f001', chapter: 'ch12', state: st };
  const rec = E.settleLesson(c);
  assert.equal(rec.summary.op, '-'); assert.equal(c.lessons['test-take'].answers, 1); assert.equal(c.lesson, null);
  // a store round never reaches E.hollowFinish: module 1's treasures and rounds stay; its own frost treasure, once
  const c2 = E.blankCat({ now: 1 });
  const r = T.start({ id: 'store' }, { facts: [[58, 23]], mode: 'hollow', now: 1, round: 1 });
  answerProblem(r, {}, rightTyper, { t: 1 });
  c2.lesson = { mode: 'hollow', state: r };
  const out = E.recordLesson(c2, r);
  assert.equal(out.mode, 'store'); assert.equal(out.hollow, null); assert.equal(out.store.awarded.id, 'frost-leaf');
  assert.deepEqual(c2.nest, ['frost-leaf']); assert.equal(c2.hollow.rounds, 0); assert.equal(c2.lesson, null);
  assert.equal(E.recordLesson(c2, r).store.awarded, null, 'once');
  assert.deepEqual(c2.nest, ['frost-leaf']);
  assert.equal(r.log[0].round, 1);
});

test('9. random walks through take and Counts lessons, chapters parked and picked up, Hollow rounds and reloads: nothing lost, every saved take state good', () => {
  const S = stub();
  const stories = [PC.story.ch01, S.ch12, S.ch13, S.ch18];
  const counted = (s) => Object.keys(s.frames).filter((id) => s.frames[id].counts);
  let takes = 0, counts = 0, parked = 0;
  for (let seed = 1; seed <= 25; seed++) {
    const rnd = E.util.rng(seed);
    let cat = E.blankCat({ now: 1 }), t = 1000, answered = 0;
    E.startChapter(cat, stories[1], t);
    for (let step = 0; step < 50; step++) {
      const x = rnd();
      t += 1000;
      if (x < 0.15) { cat = E.migrate(clone({ version: 2, cats: [cat], current: cat.id, settings: {} })).cats[0]; continue; }
      if (x < 0.3) { E.openChapter(cat, stories[Math.floor(rnd() * stories.length)], t); continue; }
      if (x < 0.36 && cat.counts.length) {
        // a module-1 Hollow round takes the slot (whatever lesson is in progress waits), a few answers, then gives way
        const r = E.hollowStart(cat, [PC.story.ch01], t, 1);
        E.holdLesson(cat);
        cat.lesson = { mode: 'hollow', state: r.state };
        V1.runLesson(E, cat, r.def, r.state, { t, ms: 3000 }, 1 + Math.floor(rnd() * 3));
        continue;
      }
      const story = stories.find((s) => s.id === cat.chapter);
      if (!story) { E.openChapter(cat, stories[1], t); continue; }
      const before = cat.takes ? cat.takes.log.length : 0;
      const stopIn = {};
      counted(story).forEach((id) => { stopIn[id] = 1 + Math.floor(rnd() * 3); });
      const sc = V1.script({ t, stopIn, takeMiss: ['503-278', '43-16', '76-42'], miss: ['3x1'] });
      V1.play(E, story, cat, sc, null);
      t = sc.t;
      answered += (cat.takes ? cat.takes.log.length : 0) - before;
      [cat.lesson, cat.hollowWaiting].concat(Object.values(cat.places || {}).map((p) => p.lesson)).forEach((L) => {
        if (L && L.state && L.state.op) { assert.ok(E.okLesson(L), 'seed ' + seed); parked += L === cat.lesson ? 0 : 1; }
      });
    }
    assert.equal(cat.takes ? cat.takes.log.length : 0, answered, 'seed ' + seed + ': every problem finished is logged once');
    assert.ok(cat.counts.every((e) => e.a <= 10 && e.b <= 10), 'seed ' + seed + ': no take-away in counts');
    takes += answered; counts += cat.counts.length;
  }
  assert.ok(takes > 200 && counts > 50 && parked > 50, 'the walks played both: ' + [takes, counts, parked]);
});

/* ================================================================ 10. the Warrior Counts */
const ALL = REAL.concat(STUB.list);
const PAUSE = E.WARRIOR_PAUSE_MS;
// a cat who has read chapters 1 to 11 and chapter 12's lesson (the store open), passed the Warrior Counts, and left a
// sitting again with `n` answers in it at `t`: a re-sit waiting
function resitCat(t, n) {
  const c = E.blankCat({ now: 1 });
  c.name = 'Moon';
  REAL.map((s) => s.id).forEach((id, i) => { c.finished[id] = 1000 + i; });
  E.countSets(REAL).forEach((k) => { c.lessons[k.setId] = { set: k.setId, mode: 'chapter', answers: 10, correct: 10, fast: 5, facts: 10, firstTry: 10, helped: 0, noHelp: true, finished: true }; });
  c.lessons['ch12-take'] = { set: 'ch12-take', mode: 'chapter', op: '-', answers: 5, correct: 5, fast: 0, facts: 5, firstTry: 5, helped: 0, noHelp: true, finished: true };
  const sit = (at, stop) => {
    const r = E.warriorBegin(c, ALL, at), st = r.state;
    let k = 0;
    while (!E.counts.done(st) && (stop == null || k < stop)) {
      const q = E.counts.question(st), D = E.warriorAsk(r.def, st, q, ALL);
      at += 8000;
      const res = E.counts.answer(st, D, q.a * q.b, 2500, at);
      E.logAnswer(c, res.entry);
      if (res.done) E.recordLesson(c, st); else E.warriorKeep(c, st, at);
      k++;
    }
    return at;
  };
  const passed = sit(t - 10 * PAUSE);
  assert.ok(E.warriorState(c, ALL, passed).passed, 'passed');
  return { c, at: sit(t, n) };
}
test('10. a Warrior Counts re-sit waiting: a take answer in a chapter lesson, and one in a store round, set it aside (practice); a digit typed with its problem unfinished, or a Hollow visit, does not; the take lesson, the shelf and a store round picked up open on the waiting line; a take answer ahead of a clock set back still sets it aside and lets a new sitting start', () => {
  const t0 = Date.UTC(2026, 10, 9, 15);
  const waiting = (c, now) => E.hollowLines(c, ALL, { now }).waiting;
  // a chapter's take lesson: its first problem's first column typed, nothing set aside; the problem done, practice
  let { c, at } = resitCat(t0, 10);
  assert.equal(waiting(c, at + 60000), E.WARRIOR_WAITING, 'waiting');
  assert.equal(E.hollowShelf(c, ALL, { now: at + 60000 }).line, E.WARRIOR_WAITING, 'the shelf says it in its greeting’s place');
  assert.equal(E.hollowShelf(c, ALL, { now: at + 60000 }).waiting, E.WARRIOR_WAITING);
  const L = E.chapterLesson(c, STUB.ch13, 'ch13-take', at + 60000, ALL);
  E.beginLesson(c, STUB.ch13, 'f001', L.state);
  assert.equal(waiting(c, at + 61000), E.WARRIOR_WAITING, 'a take lesson begun opens on the waiting line (startChapterLesson’s wWait)');
  const q0 = T.question(L.state);
  if (q0.tap) while (T.question(L.state).tap) T.tap(L.state);
  const r0 = T.digit(L.state, L.def, T.question(L.state).plan.cols[0].digit, 2000, at + 62000);
  assert.ok(!r0.problemDone && !r0.entry);
  assert.equal(E.warriorState(c, ALL, at + 63000).stale, null, 'a digit typed, its problem unfinished: nothing set aside');
  assert.equal(waiting(c, at + 63000), E.WARRIOR_WAITING);
  const r1 = answerProblem(L.state, L.def, rightTyper, { t: at + 63000 });
  E.logTake(c, r1.entry);
  assert.equal(E.warriorState(c, ALL, at + 90000).stale, 'practice', 'a take-away is practice, as any lesson answer');
  assert.equal(waiting(c, at + 90000), undefined);
  assert.equal(E.hollowShelf(c, ALL, { now: at + 90000 }).line, E.STORE_LINES.greet, 'the shelf’s own greeting again');
  assert.equal(c.counts.filter((e) => e.set !== 'warrior').length, 0, 'never in counts');
  // a store round: a Hollow visit with no answer sets nothing aside; its round picked up opens on the waiting line; one
  // answer in it, practice
  ({ c, at } = resitCat(t0, 12));
  assert.ok(E.storeOpen(c, ALL));
  E.hollowShelf(c, ALL, { now: at + 1000 }); E.hollowRound(c);
  const R = E.takeRoundStart(c, ALL, at + 2000);
  E.holdLesson(c);
  c.lesson = { mode: 'hollow', state: R.state };
  const qr = T.question(R.state);
  T.digit(R.state, R.def, qr.plan.cols[0].blank ? '' : qr.plan.cols[0].digit, 2000, at + 3000);
  assert.equal(E.warriorState(c, ALL, at + 4000).stale, null, 'a Hollow visit and a digit typed: nothing');
  const back = E.migrate(clone({ version: 2, cats: [c], current: c.id, settings: {} })).cats[0];
  assert.ok(E.hollowRound(back) && E.hollowRound(back).state.op === '-', 'the round picked up');
  assert.equal(waiting(back, at + 5000), E.WARRIOR_WAITING, 'and the page says the waiting line over its next problem');
  const rr = answerProblem(R.state, R.def, rightTyper, { t: at + 5000 });
  E.logTake(c, rr.entry);
  assert.equal(rr.entry.round, 1);
  assert.equal(E.warriorState(c, ALL, at + 30000).stale, 'practice');
  // the clock set back: a take answer stamped ahead of it still sets the sitting aside, and a new sitting starts after it
  ({ c, at } = resitCat(t0, 10));
  const { def, st } = lessonOf([[58, 23]]);
  const e = answerProblem(st, def, rightTyper, { t: at + 20 * 60000 }).entry;
  const ahead = e.at, clock = at + 10 * 60000;
  assert.ok(ahead > clock && ahead - clock < PAUSE);
  E.logTake(c, e);
  assert.equal(E.warriorState(c, ALL, clock).stale, 'practice', 'ahead of the clock, still practice');
  const nb = E.warriorBegin(c, ALL, clock);
  assert.equal(nb.opening.kind === 'resume', false, 'a new sitting');
  assert.equal(c.warrior.sitting.at, ahead, 'it starts no earlier than her latest answer, the take-away’s');
  const q = E.counts.question(nb.state);
  const res = E.counts.answer(nb.state, E.warriorAsk(nb.def, nb.state, q, ALL), q.a * q.b, 2500, ahead + 8000);
  E.logAnswer(c, res.entry); E.warriorKeep(c, nb.state, ahead + 8000);
  assert.equal(E.warriorState(c, ALL, ahead + 9000).stale, null, 'and is not set aside by the take-away before it');
  assert.ok(E.warriorState(c, ALL, ahead + 9000).sitting, 'it picks up');
});

/* ================================================================ 11. the warm-up across both: the Counts */
const WARM = { id: 'ch12-warm', teacher: 'tallyheart', warmHard: { table: 'all', at: [0, 1], alt: [[3, 8], [4, 7]] },
  facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }] };
function missCat(pairs) {
  const c = E.blankCat({ now: 1 });
  pairs.forEach(([a, b, ms], i) => c.counts.push({ set: 'ch10-eights', a, b, answer: a * b, given: a * b + 1, correct: false, ms: ms || 6000, at: 1000 + i, helped: true }));
  return c;
}
test('11. the warm-up across both, its Counts: her two hardest at 0 and 1, `hard`, with their anchor Count as `table`; one hard fact, then the set’s own; none, the set as written; a set pair equal to a pick gives way to `alt`; a take answer never changes it', () => {
  const def = clone(WARM);
  const two = missCat([[9, 6, 5000], [7, 8, 6000]]);
  const f2 = E.lessonFacts(two, def, REAL);
  assert.deepEqual(f2, [{ a: 7, b: 8, hard: true, table: 8 }, { a: 9, b: 6, hard: true, table: 9 }, { a: 3, b: 9, table: 3 }], 'the hardest first (7 × 8 anchored on the 8s, 9 × 6 on the 9s)');
  assert.deepEqual(E.warriorHard(two, REAL).slice(0, 2), [[7, 8], [9, 6]]);
  const one = missCat([[7, 8]]);
  assert.deepEqual(E.lessonFacts(one, def, REAL), [{ a: 7, b: 8, hard: true, table: 8 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }], 'one hard fact: position 1 keeps the set’s own');
  assert.deepEqual(E.lessonFacts(E.blankCat({ now: 1 }), def, REAL), def.facts, 'none: the set as written');
  // a set fact that is the same pair as a pick gives way to `alt` (its first entry that is no pick and not asked)
  const same = missCat([[4, 8]]);
  assert.deepEqual(E.lessonFacts(same, def, REAL), [{ a: 4, b: 8, hard: true, table: 4 }, [3, 8], { a: 3, b: 9, table: 3 }]);
  const both = missCat([[8, 3, 5000], [4, 8, 6000]]);
  assert.deepEqual(E.lessonFacts(both, def, REAL), [{ a: 4, b: 8, hard: true, table: 4 }, { a: 8, b: 3, hard: true, table: 3 }, { a: 3, b: 9, table: 3 }]);
  const alt = missCat([[3, 9]]);
  assert.deepEqual(E.lessonFacts(alt, Object.assign(clone(def), { warmHard: { table: 'all', at: [0, 1], alt: [[3, 8], [4, 7]] } }), REAL)[2], [3, 8], 'the third written fact, the pick’s pair, gives way');
  // `at` as one number: one pick; a pick passes over the set's `avoid`
  assert.deepEqual(E.lessonFacts(two, Object.assign(clone(def), { warmHard: { table: 'all', at: 1 } }), REAL), [{ a: 6, b: 7, table: 6 }, { a: 7, b: 8, hard: true, table: 8 }, { a: 3, b: 9, table: 3 }]);
  assert.deepEqual(E.lessonFacts(two, Object.assign(clone(def), { warmHard: { table: 'all', at: [0, 1], avoid: [[8, 7]] } }), REAL)[0], { a: 9, b: 6, hard: true, table: 9 });
  // a take answer never changes it (the warm-up reads only `counts`)
  const withTakes = clone(two);
  const { def: td, st } = lessonOf([[43, 16], [503, 278]]);
  answerProblem(st, td, (q, c) => (q.col === 0 ? (c.digit + 1) % 10 : c.digit), { t: 5000 });
  answerProblem(st, td, (q, c) => (q.col === 0 ? (c.digit + 1) % 10 : c.digit), { t: 9000 });
  st.log.forEach((e) => E.logTake(withTakes, e));
  assert.ok(withTakes.takes.log.length >= 2 && E.hardTakes(withTakes).length);
  assert.deepEqual(E.lessonFacts(withTakes, def, REAL), f2);
  assert.deepEqual(E.chapterLesson(withTakes, { id: 'chX', frames: { f001: { board: 'X' } }, counts: { 'ch12-warm': def } }, 'ch12-warm', 7000, REAL).state.queue.map((x) => [x.a, x.b, x.table, !!x.hard]),
    [[7, 8, 8, true], [9, 6, 9, true], [3, 9, 3, false]], 'a chapter lesson asks them, each with its anchor');
  // every other set as before: an existing warmHard (a number table) is the old path
  REAL.forEach((s) => Object.keys(s.counts || {}).forEach((id) => {
    const d = s.counts[id];
    if (d.warmHard) assert.notEqual(d.warmHard.table, 'all', id);
  }));
});
test('11. the warm-up across both, its questions: for all 54 pairs as a pick, E.questionDef gives the anchor Count’s words and picture (7 × 8: "Seven spiders. How many legs?"), the help drawn in its way, the set’s own lines kept, on the sand; every other set and question as before', () => {
  const def = Object.assign(clone(WARM), { praise: ['Warm whiskers!'], remembered: ['You remembered it!'] });
  const rank = (a, b) => E.warriorAnchor(a, b, REAL);
  E.warriorPairs().filter((p) => !(p[0] === 10 && p[1] === 10)).forEach(([a, b]) => {
    const c = missCat([[a, b]]);
    const st = E.counts.start(def, { facts: E.lessonFacts(c, def, REAL), set: def.id, mode: 'chapter', now: 1 });
    const q = E.counts.question(st), D = E.questionDef(def, q, null, REAL), A = E.hollowDef(REAL, rank(a, b));
    assert.equal(q.table, rank(a, b), a + ' × ' + b);
    assert.equal(D.table, A.table); assert.deepEqual(D.picture, A.picture, a + ' × ' + b + ': the anchor’s picture');
    ['thing', 'things', 'unit', 'units'].forEach((k) => assert.equal(D[k], A[k], a + ' × ' + b + ' ' + k));
    assert.equal(D.things, A.things, a + ' × ' + b + ': drawn as its anchor’s things, not the set’s generic tails');
    assert.deepEqual(D.praise, ['Warm whiskers!']); assert.deepEqual(D.remembered, ['You remembered it!']); assert.equal(D.ground, 'sand');
    assert.equal(E.promptLines(def, D, q)[0].text, E.genericQuestion(A, q), 'asked in the anchor’s words');
    const help = E.helpPlan(def, D, q, { right: false, given: q.answer + 1 });
    assert.ok(help, a + ' × ' + b + ': its help');
  });
  const c78 = missCat([[7, 8]]);
  const st = E.counts.start(def, { facts: E.lessonFacts(c78, def, REAL), set: def.id, mode: 'chapter', now: 1 });
  const q = E.counts.question(st);
  assert.equal(E.promptLines(def, E.questionDef(def, q, null, REAL), q)[0].text, 'Seven spiders. How many legs?');
  // the set's own written facts are asked the same way (6 × 7 with table 6)
  const st2 = E.counts.start(def, { facts: def.facts, set: def.id, mode: 'chapter', now: 1 });
  const q2 = E.counts.question(st2), D2 = E.questionDef(def, q2, null, REAL);
  assert.deepEqual(D2.picture, E.hollowDef(REAL, 6).picture);
  // every existing set and question as before (and a borrowed one, `from`, as before)
  REAL.forEach((s) => Object.keys(s.counts || {}).forEach((id) => {
    const d = Object.assign({ id }, s.counts[id]), stx = E.counts.start(d, { facts: d.facts || [], set: id, mode: 'chapter', now: 1 });
    for (let k = 0; k < stx.queue.length; k++) { const qq = E.counts.question(Object.assign({}, stx, { pos: k })); assert.equal(E.questionDef(d, qq, s, REAL), d, id + ' question ' + k); }
  }));
});

/* ================================================================ 11. the made warm-up */
test('11. E.takeWarm: a two-digit ones twin of 43 − 16, its flip never landing, avoiding the chapter\'s answers; a warm lesson opens on it, logged as a first ask', () => {
  for (let s = 1; s <= 300; s++) {
    const w = E.takeWarm(s, [27, 36]), p = plan(w.a, w.b);
    assert.equal(p.n, 2); assert.equal(E.takeKind(p), 'ones'); assert.equal(E.takeStepOf(p), 'ones2');
    assert.ok(!E.takeFlipLands(p)); assert.ok(![27, 36].includes(p.answer)); assert.notEqual(w.a, 43);
  }
  const S = stub();
  const answers = Object.values(S.ch17.counts).flatMap((d) => d.facts.map((f) => (Array.isArray(f) ? f[0] - f[1] : f.a - f.b)));
  for (let now = 1000; now < 60000; now += 997) {
    const { state } = E.takeLesson(E.blankCat({ now: 1 }), S.ch17, 'ch17-take', now, REAL.concat(S.list));
    assert.equal(state.queue[0].warm, true); assert.equal(state.queue[0].regroup, 'hers');
    assert.ok(!answers.includes(state.queue[0].a - state.queue[0].b));
    assert.equal(state.queue.length, 6);
  }
  const { state } = E.takeLesson(E.blankCat({ now: 1 }), S.ch12, 'ch12-take', 1000, REAL.concat(S.list));
  assert.ok(!state.queue[0].warm, 'chapters 12 and 13 have none');
  assert.equal(E.chapterLesson(E.blankCat({ now: 1 }), S.ch12, 'ch12-take', 1000, REAL.concat(S.list)).state.op, '-', 'E.chapterLesson sends a take set to E.takeLesson');
});

/* ================================================================ 12. the templates and the treasures */
test('12. each template\'s step is its row (and each is a problem of its step\'s chapter, its lesson or its story, or one of the store\'s own two); the frost treasures\' ids are their own', () => {
  Object.keys(E.TAKE_TEMPLATES).forEach((s) => E.TAKE_TEMPLATES[s].forEach(([a, b]) => assert.equal(E.takeStepOf(plan(a, b)), s, pr(a, b))));
  const own = ['352-28', '403-57'];
  Object.keys(E.TAKE_TEMPLATES).forEach((s) => {
    const n = Object.keys(CH).find((k) => CH[k].teach === s);
    E.TAKE_TEMPLATES[s].forEach(([a, b]) => {
      const inChapter = CH[n].lesson.concat(CH[n].story).some((f) => f[0] === a && f[1] === b);
      assert.ok(inChapter || own.includes(a + '-' + b), pr(a, b) + ' is chapter ' + n + '\'s');
    });
  });
  const ids = E.FROST_TREASURES.map((t) => t.id);
  assert.deepEqual(ids, ['frost-leaf', 'snow-feather', 'acorn-cap', 'river-pebble']);
  const old = E.TREASURES.concat(E.GIFTS).map((t) => t.id);
  ids.forEach((id) => assert.ok(!old.includes(id), id));
  assert.equal(E.TAKE_ROUND, 5); assert.equal(E.TAKE_TRIES, 400);
});

/* ================================================================ 12. Count the store */
function stepsCat(steps) {
  const c = E.blankCat({ now: 1 });
  const byStep = {};
  STUB.list.forEach((s) => Object.keys(s.counts).forEach((id) => { const d = s.counts[id]; if (d.teach) byStep[d.teach] = id; }));
  steps.forEach((st) => { c.lessons[byStep[st]] = { set: byStep[st], mode: 'chapter', op: '-', answers: 5, correct: 5, fast: 0, facts: 5, firstTry: 5, helped: 0, noHelp: true, finished: true }; });
  return c;
}
// a helped first ask of each step in `hard` (the last the most recent): her hard steps, E.hardTakes' order
function withHard(c, hard) {
  hard.slice().reverse().forEach((step, i) => {
    const [a, b] = E.TAKE_TEMPLATES[step][0];
    E.logTake(c, { set: 'x', a, b, answer: a - b, given: '', correct: false, helped: true, slips: [], ms: 30000, cols: [], at: 1000 + i, kind: E.takeKind(plan(a, b)), digits: String(a).length, regroup: 'hers' });
  });
  return c;
}
test('12. Count the store: closed until a teach set is finished, then the shelf (its greeting, the reward line after a round, its buttons); the Hollow of a cat with no take-aways exactly as before', () => {
  const blank = E.blankCat({ now: 1 });
  assert.equal(E.storeOpen(blank, ALL), false); assert.equal(E.hollowShelf(blank, ALL), null); assert.deepEqual(E.takeSteps(blank, ALL), []);
  // a take set started but not finished, or a story's set with no `teach`: still closed
  const part = E.blankCat({ now: 1 });
  part.lessons['ch12-story'] = { set: 'ch12-story', op: '-', finished: true };
  part.lessons['ch12-take'] = { set: 'ch12-take', op: '-', finished: false };
  assert.equal(E.storeOpen(part, ALL), false);
  const c = stepsCat(['none']);
  assert.equal(E.storeOpen(c, ALL), true); assert.equal(E.storeOpen(c, REAL), false, 'chapters 1 to 11 teach no step');
  // (chapter 12: the shelf gains `friend`, Chispapaw's "¡A contar!" through E.esLine, after Tallyheart's greeting; the spanish
  // owner's, spec section 6's kit pins, item 4)
  assert.deepEqual(E.hollowShelf(c, ALL), { greet: E.STORE_LINES.greet, line: E.STORE_LINES.greet, steps: ['none'],
    buttons: [{ id: 'store', label: 'Count the store' }, { id: 'counts', label: 'One Count at a time' }, { id: 'nest', label: 'My nest' }],
    friend: { who: 'chispapaw', text: E.esLine('{es:aContar}') } });
  assert.equal(E.hollowShelf(c, ALL, { reward: true }).line, 'Another round? I’ve got all evening.');
  assert.equal(E.hollowShelf(c, REAL, { stories: ALL }).line, E.STORE_LINES.greet, 'opts.stories in place of the stories');
  assert.equal(E.STORE_LINES.greet, 'Count the store, or one Count at a time? A full round earns a treasure for your nest.');
  assert.deepEqual(E.takeSteps(stepsCat(['zeros', 'none', 'tens']), ALL), ['none', 'tens', 'zeros'], 'in the order taught');
  // the Counts page under it reads exactly as before, for every cat (E.hollowLines is the v23 text)
  assert.deepEqual(E.hollowLines(c, ALL), E.hollowLines(E.blankCat({ now: 1 }), ALL));
});
test('12. a round: five problems, every answer different, the first with no spread, her hard steps at 2 and 3 (else the newest and an older step that spreads), the newest at 4, an older one that spreads at 5 (the newest when there is none), so one none unless none is hard; no flip landing, no answer without hundreds before mixed, never a fallback; seeded by its number; section 5\'s round 1 once the zeros are learned', () => {
  const tries = E.TAKE_TRIES;
  for (let k = 1; k <= E.TAKE_STEPS.length; k++) {
    const learned = E.TAKE_STEPS.slice(0, k), newest = learned[k - 1];
    for (let n = 1; n <= 60; n++) {
      const hard = n % 3 === 0 ? learned.slice(-2).reverse() : n % 3 === 1 ? [learned[0]] : [];
      const c = withHard(stepsCat(learned), hard);
      c.takes = c.takes || { log: [], rounds: 0, cleanRounds: 0 };
      c.takes.rounds = n - 1;
      assert.deepEqual(E.hardTakes(c), hard);
      const { def, state } = E.takeRoundStart(c, ALL, 5000 + n);
      const Q = state.queue, steps = Q.map((x) => E.takeStepOf(plan(x.a, x.b)));
      const tag = learned.join(',') + ' round ' + n;
      assert.equal(Q.length, E.TAKE_ROUND, tag);
      assert.equal(new Set(Q.map((x) => x.a - x.b)).size, 5, tag + ': five answers');
      assert.equal(E.takeKind(plan(Q[0].a, Q[0].b)), 'none', tag + ': the first with no spread');
      Q.forEach((x, i) => {
        const p = plan(x.a, x.b);
        assert.ok(!E.takeFlipLands(p), tag + ' ' + i + ': no flip landing');
        assert.ok(learned.includes(steps[i]), tag + ' ' + i + ': a learned step');
        if (!learned.includes('mixed')) assert.ok(!E.takeFlags(p).noHundreds, tag + ': no answer without hundreds before mixed');
        assert.equal(x.regroup, 'hers');
        assert.ok(!E.TAKE_TEMPLATES[steps[i]].some(([a, b]) => a === x.a && b === x.b), tag + ' ' + i + ': a twin, never a template itself (no fallback)');
      });
      assert.equal(steps[1], hard[0] || newest, tag + ': 2');
      assert.equal(Q[1].hard || null, hard[0] || null);
      if (hard[1]) { assert.equal(steps[2], hard[1], tag + ': 3'); assert.equal(Q[2].hard, hard[1]); } else assert.ok(!Q[2].hard);
      assert.equal(steps[3], newest, tag + ': 4');
      if (k > 2) assert.notEqual(steps[4], newest, tag + ': 5, an older step');
      else if (k === 2) assert.equal(steps[4], newest, tag + ': 5, the newest (no older step spreads)');
      if (k > 1 && !hard.includes('none')) assert.ok(steps.slice(1).every((s) => s !== 'none'), tag + ': one none, place 1\'s');
      assert.equal(state.round, n); assert.equal(state.mode, 'hollow'); assert.equal(state.op, '-'); assert.equal(def.id, 'store');
      assert.deepEqual(E.takeRoundStart(clone(c), ALL, 9).state.queue, Q, tag + ': the same round for the same number');
    }
  }
  assert.equal(E.TAKE_TRIES, tries);
  // section 5's round 1 once the zeros are learned, as built
  const r1 = E.takeRoundStart(stepsCat(E.TAKE_STEPS), ALL, 1000).state.queue;
  assert.deepEqual(r1.map((x) => pr(x.a, x.b)), ['53 − 32', '400 − 317', '517 − 288', '900 − 886', '365 − 184'], 'section 5\'s round 1');
  assert.deepEqual(r1.map((x) => E.takeStepOf(plan(x.a, x.b))), ['none', 'zeros', 'both', 'zeros', 'tens']);
  const d = E.takeRoundDef();
  assert.deepEqual([d.id, d.op, d.teacher, d.picture.kind, d.done, d.intro], ['store', '-', 'tallyheart', 'store', 'The whole store, counted! That deserves a treasure for your nest.', 'Five from the store. Ready? Here we go.']);
  assert.deepEqual(d.praise, E.TAKE_LINES.praise);
  // (chapter 12: a round's def gains `echo`, Chispapaw's Spanish on the round's first problem right in every column; the spanish
  // owner's, spec section 6's kit pins, item 4)
  assert.deepEqual(d.echo, { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] });
});
test('12. a round never says a line about a step she has not learned (the kit\'s rule, E.takeSlip\'s taught): its tens never "no row went" before ones2, its hundreds never "no square went" before tens; "Let\'s scratch it out." in their place, played through the runner', () => {
  const ROW = /no row went/, SQUARE = /no square went/;
  const seen = { tens: 0, hundreds: 0 };
  for (let k = 1; k <= E.TAKE_STEPS.length; k++) {
    const learned = E.TAKE_STEPS.slice(0, k), row = k > 1, square = k > 3;
    for (let n = 1; n <= 30; n++) {
      const c = stepsCat(learned);
      c.takes = { log: [], rounds: n - 1, cleanRounds: 0 };
      const R = E.takeRoundStart(c, ALL, 1000 + n);
      assert.deepEqual(R.state.taught, learned, 'the round knows the steps she has learned');
      R.state.queue.forEach(({ a, b }) => {
        const p = plan(a, b);
        p.cols.forEach((col, i) => {
          for (let g = 0; g <= 9; g++) {
            const slip = E.takeSlip(p, i, g, false, R.state.taught);
            if (!slip) continue;
            const intro = E.takeHelp(R.def, p, i, slip).intro, tag = learned.join(',') + ' ' + pr(a, b) + ' col ' + i + ' typed ' + g;
            if (slip === 'extra') seen[i === 1 ? 'tens' : 'hundreds']++;
            if (!row) assert.ok(!ROW.test(intro), tag + ': ' + intro);
            if (!square) assert.ok(!SQUARE.test(intro), tag + ': ' + intro);
          }
        });
      });
    }
  }
  assert.ok(seen.tens > 0 && seen.hundreds > 0, 'and once learned, extra is named: ' + JSON.stringify(seen));
  // played: a round once chapter 14 is done (none, ones2, ones), a three-digit problem's hundreds typed one less
  let played = 0;
  for (let n = 1; n <= 40 && played < 3; n++) {
    const c = stepsCat(['none', 'ones2', 'ones']);
    c.takes = { log: [], rounds: n - 1, cleanRounds: 0 };
    const R = E.takeRoundStart(c, ALL, 1000 + n), clock = { t: 5000 };
    const target = R.state.queue.findIndex(({ a, b }) => { const h = plan(a, b).cols[2]; return h && !h.lent && h.bottom && !h.spreads.length && h.before - 1 - h.bottom >= 0; });
    if (target < 0) continue;
    for (let guard = 0; guard < 40 && !T.done(R.state); guard++) {
      const q = T.question(R.state), cc = q.plan.cols[q.col], here = q.number === target + 1 && q.col === 2 && !q.twin;
      const r = T.digit(R.state, R.def, here ? cc.before - 1 - cc.bottom : cc.blank ? '' : cc.digit, 2000, clock.t += 1000);
      if (here) { assert.equal(r.slip, 'fact', 'round ' + n); assert.equal(r.help.intro, 'Let’s scratch it out.'); played++; break; }
    }
  }
  assert.equal(played, 3);
});
test('12. a round played: its hard step right earns rememberedStep, a helped problem’s twin comes back within the round, entries `round: n` and first asks; the finish once, as mode \'store\', a frost treasure in turn by the store’s own rounds; hollow.rounds, every Count’s record and module 1’s treasures untouched; it gives way to a chapter lesson and comes back', () => {
  const c = withHard(stepsCat(['none', 'ones2', 'ones', 'tens', 'both', 'mixed', 'zero', 'zeros']), ['zero']);
  c.hollow.rounds = 3; c.hollow.byTable['2'] = { rounds: 3, cleanRounds: 2, glow: false }; c.nest = ['moss', 'feather', 'shell'];
  const before = clone({ hollow: c.hollow, counts: c.counts });
  const got = [];
  for (let n = 1; n <= 6; n++) {
    const R = E.takeRoundStart(c, ALL, 100000 * n);
    E.holdLesson(c);
    c.lesson = { mode: 'hollow', state: R.state };
    let first = true, out = null, clock = 100000 * n;
    const lines = [];
    for (let guard = 0; guard < 80 && !T.done(R.state); guard++) {
      while (T.question(R.state).tap) T.tap(R.state);
      const q = T.question(R.state), col = q.plan.cols[q.col];
      // round 2: a slip on its first problem's ones (a twin comes back); else right
      const miss = n === 2 && first && q.col === 0 && q.number === 1;
      const r = T.digit(R.state, R.def, miss ? (col.digit + 1) % 10 : col.blank ? '' : col.digit, 3000, clock += 1000);
      assert.ok(!r.ignored, 'never ignored: ' + JSON.stringify(r));
      if (r.entry) E.logTake(c, r.entry);
      if (r.problemDone) { lines.push([r.lineKind, r.line]); first = false; }
      if (r.done) out = E.recordLesson(c, R.state);
    }
    assert.ok(T.done(R.state));
    if (n === 2) assert.equal(R.state.log.length, 6, 'the helped problem’s twin within the round');
    else assert.equal(R.state.log.length, 5);
    R.state.log.forEach((e) => { assert.equal(e.round, n); assert.ok(!('twin' in e) || n === 2); assert.ok(!e.warm); });
    if (n === 1) {
      assert.deepEqual(lines[1], ['rememberedStep', 'Across the zero, and no sand needed!'], 'her hard step, right in every column');
      assert.equal(E.hardTakes(c).includes('zero'), false, 'and the step leaves her hard list');
    }
    assert.equal(out.mode, 'store'); assert.equal(out.hollow, null);
    got.push(out.store.awarded.id);
    assert.equal(out.store.rounds, n);
    assert.equal(c.lesson, null);
    assert.equal(E.recordLesson(c, R.state).store.awarded, null, 'the finish once');
  }
  assert.deepEqual(got, ['frost-leaf', 'snow-feather', 'acorn-cap', 'river-pebble', 'frost-leaf', 'snow-feather']);
  assert.equal(c.takes.rounds, 6); assert.equal(c.takes.cleanRounds, 5, 'a round with a help is not clean');
  assert.deepEqual(clone({ hollow: c.hollow, counts: c.counts }), before, 'module 1’s rounds and each Count’s record untouched');
  assert.deepEqual(c.nest.slice(0, 3), ['moss', 'feather', 'shell']);
  got.forEach((id) => assert.equal(E.treasure(id).id, id, 'E.treasure finds the frost treasures'));
  assert.equal(E.treasure('acorn').name, 'An acorn in its little hat', 'and every other as before');
  E.TREASURES.concat(E.GIFTS).forEach((t) => assert.equal(E.treasure(t.id), E.treasure(t.id) && (E.TREASURES.find((x) => x.id === t.id) || E.GIFTS.find((x) => x.id === t.id))));
  assert.deepEqual(E.nestGroups(c).treasures.map((x) => x.treasure.id).slice(-4), ['frost-leaf', 'snow-feather', 'acorn-cap', 'river-pebble']);
  // a round in the slot gives way to a chapter lesson (hollowWaiting) and comes back at its problem and column
  const R = E.takeRoundStart(c, ALL, 9000000);
  c.lesson = { mode: 'hollow', state: R.state };
  T.digit(R.state, R.def, T.question(R.state).plan.cols[0].digit, 3000, 9001000);
  c.chapter = 'ch13'; c.frame = 'f001';
  const L = E.chapterLesson(c, STUB.ch13, 'ch13-take', 9002000, ALL);
  E.beginLesson(c, STUB.ch13, 'f001', L.state);
  assert.equal(c.hollowWaiting.state.op, '-'); assert.equal(c.hollowWaiting.state.col, 1);
  const saved = E.migrate(clone({ version: 2, cats: [c], current: c.id, settings: {} })).cats[0];
  const H = E.hollowRound(saved);
  assert.ok(H && H.state.op === '-' && H.state.col === 1 && H.state.round === 7, 'back through hollowWaiting');
  assert.equal(saved.places.ch13.lesson.state.op, '-', 'the chapter’s lesson waits in its place');
  // a round all answered but never recorded is settled as a store round (the Hollow page and My nest settle it)
  const c3 = stepsCat(['none']);
  const R3 = E.takeRoundStart(c3, ALL, 1000);
  const clk = { t: 2000 };
  for (let g = 0; g < 10 && !T.done(R3.state); g++) answerProblem(R3.state, R3.def, rightTyper, clk);
  assert.ok(T.done(R3.state));
  c3.lesson = { mode: 'hollow', state: R3.state };
  const set = E.settleLesson(c3);
  assert.equal(set.mode, 'store'); assert.equal(set.store.awarded.id, 'frost-leaf'); assert.equal(c3.lesson, null); assert.deepEqual(c3.nest, ['frost-leaf']);
});

/* ================================================================ 13. number words and the words table */
const FORM_RE = /\b(loose|rows?|squares?|ones|tens|hundreds|take away|spread|ones first)\b/i;
function lineValues() {
  const out = [];
  const walk = (key, v) => { if (typeof v === 'string') out.push([key, v]); else if (Array.isArray(v)) v.forEach((x) => walk(key, x)); else Object.keys(v).forEach((k) => walk(key + '.' + k, v[k])); };
  Object.keys(E.TAKE_LINES).forEach((k) => walk(k, E.TAKE_LINES[k]));
  return out;
}
// every line the kit can say for a problem: every column's line in every mode and stage, every show and tap,
// every wrong digit's help, the question, the blank
function allLines(a, b) {
  const p = plan(a, b), out = [];
  const q = E.takeQuestion({}, { a, b, of: 'x' }); out.push(...q.heard.map((x) => x.text));
  p.cols.forEach((c, col) => {
    ['hers', 'show', 'tap'].forEach((m) => ['before', 'after'].forEach((s) => [true, false].forEach((full) => out.push(E.takeLine({}, p, col, s, m, full)))));
    const sh = E.takeShow({}, p, col);
    if (sh) { out.push(...sh.steps.map((x) => x.say), ...sh.taps.map((x) => x.say), ...Object.values(sh.here), sh.line); }
    for (let g = 0; g <= 9; g++) {
      [false, true].forEach((shown) => {
        const slip = E.takeSlip(p, col, g, shown);
        if (slip) out.push(...E.takeHelp({}, p, col, slip, { shown }).steps.map((x) => x.say));
      });
    }
  });
  return out;
}
const NUMS = '(zero|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen)';
function checkLine(s, tag) {
  assert.ok(!/[{}]/.test(s), tag + ': no token left: ' + s);
  assert.ok(!/Only zero/i.test(s), tag + ': "Only zero": ' + s);
  assert.ok(!/\bone (rows|squares)\b/i.test(s), tag + ': one, singular: ' + s);
  assert.ok(!new RegExp('\\b' + NUMS + ' (row|square)\\b(?!s)', 'i').test(s), tag + ': plural: ' + s);
  assert.ok(s.trim() === s && !/ {2}/.test(s), tag + ': spacing: ' + JSON.stringify(s));
}
test('13. number words: 0 to 1,000 (the tricky ones by hand), the same as E.countWords to 100', () => {
  const hand = { 0: 'zero', 13: 'thirteen', 40: 'forty', 99: 'ninety-nine', 100: 'one hundred', 101: 'one hundred one', 110: 'one hundred ten', 118: 'one hundred eighteen',
    225: 'two hundred twenty-five', 503: 'five hundred three', 700: 'seven hundred', 999: 'nine hundred ninety-nine', 1000: 'one thousand' };
  Object.keys(hand).forEach((n) => assert.equal(E.numberWords(+n), hand[n]));
  for (let n = 0; n <= 100; n++) assert.equal(E.numberWords(n), E.countWords(n));
  for (let n = 0; n <= 1000; n++) assert.ok(!/ and |  /.test(E.numberWords(n)));
  assert.equal(E.numberWords(1001), '1001'); assert.equal(E.numberWords(2.5), '2.5');
});

test('13. every kit line filled for every column of every kind, at the ones and the tens, on a top of 0 and not: no token left, singular and plural right, no "Only zero"', () => {
  const sample = MODULE.concat([[352, 28], [403, 57], [100, 1], [910, 819], [111, 99], [201, 2], [19, 9], [990, 9], [532, 178], [610, 291], [150, 75]]);
  const rnd = E.util.rng(5);
  for (let k = 0; k < 150; k++) { const a = 100 + Math.floor(rnd() * 900), b = 1 + Math.floor(rnd() * (a - 1)); sample.push([a, b]); }
  let n = 0;
  sample.forEach(([a, b]) => allLines(a, b).forEach((s) => { checkLine(s, pr(a, b)); n++; }));
  assert.ok(n > 10000);
  // every line in E.TAKE_LINES, every form, filled with ones and with other numbers
  // (a top of 0 only in the forms for it: a line's 'ones' form is never said over a 0, its 'onesZero' is)
  lineValues().forEach(([key, v]) => [/Zero$/.test(key) ? 0 : 1, 2, 13].forEach((x) => checkLine(E.takeFill(v, { top: x, bottom: x, first: x, rest: x, left: x, digit: x, a: 503, b: 278 }), key)));
  assert.equal(E.takeFill('{Top} {rows}', { top: 1 }), 'One row');
  assert.equal(E.takeFill('{Digit} {squares}.', { digit: 2 }), 'Two squares.');
  assert.equal(E.takeFill('{name}paw: {Top}', { top: 3 }), '{name}paw: Three', 'the cat\'s tokens are left for the page');
});

test('13. the words table: a token for every form, no form written into any line, the regrouping word never before a pronoun nor alone; set to "trade", "regroup" and "break apart" every line that says it changes; read at call time from PC.words', () => {
  const W = E.TAKE_WORDS;
  assert.deepEqual(Object.keys(W), ['loose', 'row', 'rows', 'Row', 'square', 'squares', 'ones', 'tens', 'hundreds', 'takeAway', 'TakeAway', 'spread', 'Spread', 'OnesFirst']);
  Object.keys(W).forEach((k) => assert.equal(E.takeFill('{' + k + '}', {}), W[k], 'a token for ' + k));
  lineValues().forEach(([key, v]) => {
    assert.ok(!FORM_RE.test(v.replace(/\{[A-Za-z]+\}/g, '')), key + ': a maths word written into the line: ' + v);
    const re = /\{[Ss]pread\}/g;
    let m;
    while ((m = re.exec(v))) {
      const after = v.slice(m.index + m[0].length), before = v.slice(0, m.index);
      assert.ok(!/^ (it|them|one|him|her)\b/.test(after), key + ': a pronoun after the word: ' + v);
      assert.ok(/^ (a|an|the) /.test(after) || /\{(rows?|squares?)\} to $/.test(before), key + ': the word acts on a row or a square: ' + v);
    }
  });
  const kit = () => lineValues().map(([k, v]) => [k, E.takeFill(v, { top: 3, bottom: 8, first: 3, rest: 5, left: 5, digit: 5, a: 503, b: 278 })]);
  const plainLines = kit();
  const saysIt = plainLines.filter(([, s]) => /\bspread\b/i.test(s)).map(([k]) => k);
  assert.ok(saysIt.length >= 12);
  const keep = PC.words;
  try {
    ['trade', 'regroup', 'break apart'].forEach((word) => {
      PC.words = { spread: word, es: { spread: 'desagrupar' } };
      assert.equal(E.TAKE_WORDS.spread, word); assert.equal(E.TAKE_WORDS.Spread, word.charAt(0).toUpperCase() + word.slice(1));
      const now = kit();
      now.forEach(([k, s], i) => {
        assert.ok(!/\bspread\b/i.test(s), k + ' with ' + word + ': ' + s);
        if (saysIt.includes(k)) assert.notEqual(s, plainLines[i][1], k + ' changes');
      });
      // the lines a help and a show say, on the real problems
      allLines(503, 278).concat(allLines(43, 16)).forEach((s) => assert.ok(!/\bspread\b/i.test(s), s));
    });
    PC.words = { spread: 'break apart' };
    assert.equal(E.takeShow({}, plan(43, 16), 0).taps[0].say, 'Not enough loose. Break apart a row: tap it.');
    assert.equal(E.takeHelp({}, plan(43, 16), 0, 'flip').steps[1].say, 'Break apart a row: ten more loose.');
    assert.equal(E.takeHelp({}, plan(811, 356), 1, 'nospread').intro, 'No rows to take five from? But we can break apart a square.');
    assert.equal(E.takeHelp({}, plan(503, 278), 0, 'zero').intro, 'Three take away eight? Not enough loose, and no rows to break apart.');
    PC.words = { rows: 'decenas', Spread: 'Trade', takeAway: 'minus' };
    assert.equal(E.takeLine({}, plan(503, 278), 0, null, 'hers', true), 'Ones first. Three minus eight.');
    assert.equal(E.takeShow({}, plan(43, 16), 0).taps[0].say, 'Not enough loose. Trade a row: tap it.');
    assert.equal(E.TAKE_WORDS.rows, 'decenas'); assert.equal(E.TAKE_WORDS.TakeAway, 'Minus');
    PC.words = { spread: 7, rows: '' };
    assert.equal(E.TAKE_WORDS.spread, 'spread', 'a word that is not one keeps the English'); assert.equal(E.TAKE_WORDS.rows, 'rows');
  } finally { if (keep === undefined) delete PC.words; else PC.words = keep; }
  assert.equal(E.TAKE_WORDS.spread, 'spread');
  // a set's lines win over the kit's
  const def = { lines: { colHers: 'Your turn: {takeAway} {bottom}.', praise: ['Super!'] } };
  assert.equal(E.takeLine(def, plan(503, 278), 1, null, 'hers', true), 'Now the tens. Your turn: take away seven.');
  const { st } = lessonOf([[58, 23]], def);
  assert.equal(answerProblem(st, Object.assign({ id: 'test-take', op: '-' }, def), rightTyper, { t: 1 }).line, 'Super!');
});

// (chapter 12: the kit's design gives the school words to chapter 12's and 13's worked examples, its section 1 and call 28;
// E.takeLine says them once, before a 'show' problem's tens line in a teach 'none' or 'ones2' set: the kit review's case)
test('13. the school words ("A row is a ten. A square is a hundred."): before the tens line of a \'show\' problem in a teach \'none\' or \'ones2\' set, once; never on the first column, a \'tap\' twin, a \'hers\' problem or any other set; filled from the words table', () => {
  const none = { teach: 'none' }, line = (def, a, b, col, mode) => E.takeLine(def, plan(a, b), col, null, mode, true);
  assert.equal(line(none, 254, 131, 0, 'show'), 'Ones first. Four take away one.', 'not on the first column (the kit\'s longest)');
  assert.equal(line(none, 254, 131, 1, 'show'), 'A row is a ten. A square is a hundred. Now the tens. Five take away three.');
  assert.equal(line(none, 254, 131, 2, 'show'), 'Now the hundreds. Two take away one.');
  assert.equal(line({ teach: 'ones2' }, 43, 16, 1, 'show'), 'A row is a ten. A square is a hundred. Now the tens. Three take away one.', 'chapter 13\'s worked example');
  assert.equal(line(none, 254, 131, 1, 'tap'), 'Now the tens. Five take away three.', 'its twin (\'tap\'): once is enough');
  assert.equal(line(none, 254, 131, 1, 'hers'), 'Now the tens. Take away three.');
  [{}, { teach: 'ones' }, { teach: 'tens' }, { teach: 'mixed' }].forEach((d) => assert.ok(!/A row is a ten/.test(line(d, 254, 131, 1, 'show')), JSON.stringify(d)));
  assert.equal(E.takeLine(none, plan(254, 131), 1, null, 'show', false), 'Now the tens.', 'the name alone stays the name alone');
  const keep = PC.words;
  try {
    PC.words = { row: 'fila', square: 'cuadro' };
    assert.equal(line(none, 254, 131, 1, 'show'), 'A fila is a ten. A cuadro is a hundred. Now the tens. Five take away three.', 'the words table, read at call time');
  } finally { if (keep === undefined) delete PC.words; else PC.words = keep; }
  // through the runner: chapter 12's worked example, column by column (the line each column outlines)
  const def = { id: 'test-take', op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, facts: [{ a: 254, b: 131, regroup: 'show' }] };
  const st = E.takes.start(def, { now: 1 }), said = [];
  [3, 2, 1].forEach((d, k) => { const q = E.takes.question(st); said.push(E.takeLine(def, q.plan, q.col, q.stage, q.mode, q.full)); E.takes.digit(st, def, d, 2000, 1000 * (k + 1)); });
  assert.deepEqual(said.map((x) => /A row is a ten/.test(x)), [false, true, false], 'said once, on the tens');
});

test('13. E.takeQuestion: the prompt\'s balloons, a twin\'s or the warm-up\'s introduction, then the problem in words, said only', () => {
  const q = E.takeQuestion({ teacher: 'tallyheart' }, { a: 254, b: 131, prompt: stub.PROMPT12 });
  assert.deepEqual(q.balloons, [{ who: 'tallyheart', text: stub.PROMPT12 }]);
  assert.deepEqual(q.ask, { who: 'tallyheart', text: 'Two hundred fifty-four take away one hundred thirty-one.' });
  assert.deepEqual(q.heard.map((x) => x.text), [stub.PROMPT12, 'Two hundred fifty-four take away one hundred thirty-one.']);
  assert.deepEqual(E.takeQuestion({}, { a: 405, b: 227, twin: '503-278' }).balloons, [{ who: 'tallyheart', text: 'One like it.' }]);
  assert.deepEqual(E.takeQuestion({}, { a: 62, b: 35, warm: true }).balloons, [{ who: 'tallyheart', text: 'One to warm up your whiskers.' }]);
  assert.deepEqual(E.takeQuestion({}, { a: 175, b: 42, prompt: [{ who: 'glintstar', text: 'How many?' }] }).balloons, [{ who: 'glintstar', text: 'How many?' }]);
  assert.equal(E.takeQuestion({}, { a: 503, b: 278 }).balloons.length, 0, 'no prompt: nothing lettered');
  // the line's form: full on a set's first two problems of her own, every 'show' and 'tap', a twin, the column after a help
  const { def, st } = lessonOf([[58, 23], [76, 42], [475, 132], [368, 145], { a: 52, b: 27, of: '43-16' }]);
  const forms = [];
  const clock = { t: 1 };
  while (!T.done(st)) {
    const q2 = T.question(st);
    forms.push(q2.full);
    T.digit(st, def, q2.number === 4 && q2.col === 0 ? 0 : q2.plan.cols[q2.col].digit, 1, clock.t += 1000);
  }
  // 58, 76: full; 475: short; 368: short, its ones helped, so its tens full, then short; the twins full (52 − 27, then 368's)
  assert.deepEqual(forms, [true, true, true, true, false, false, false, false, true, false, true, true, true, true, true]);
  // the made warm-up is one of the set's first two (section 1): 62 − 35 and 58 − 23 full, 76 − 42 and 475 − 132 short
  const W = lessonOf([{ a: 62, b: 35, warm: true }, [58, 23], [76, 42], [475, 132]]);
  const wf = [];
  while (!T.done(W.st)) { const q3 = T.question(W.st); wf.push(q3.full); T.digit(W.st, W.def, q3.plan.cols[q3.col].digit, 1, clock.t += 1000); }
  assert.deepEqual(wf, [true, true, true, true, false, false, false, false, false]);
  // a warm 'hers' lesson (the stub's chapter 17, as 17 and 20 are) opens on two full problems, the warm-up and one
  const S17 = stub();
  for (let now = 1000; now < 30000; now += 997) {
    const L = E.takeLesson(E.blankCat({ now: 1 }), S17.ch17, 'ch17-take', now, REAL.concat(S17.list));
    assert.ok(L.state.queue.every((x) => x.regroup === 'hers'), 'the stub\'s chapter 17 is all \'hers\'');
    const firstCol = [];
    while (!T.done(L.state)) {
      const q4 = T.question(L.state);
      if (q4.col === 0) firstCol.push(q4.full);
      T.digit(L.state, L.def, q4.plan.cols[q4.col].digit, 1, clock.t += 1000);
    }
    assert.deepEqual(firstCol, [true, true, false, false, false, false], 'full on the warm-up and the first of the set only');
  }
  // only 'hers' problems count toward the first two: a 'show' and a 'tap' one are full anyway and use up neither
  // place, so chapter 13's 85 − 39, her first on her own, hears its full first line, and so does 97 − 52
  const S13 = stub();
  const forms13 = (n, set) => {
    const L = E.takeLesson(E.blankCat({ now: 1 }), S13['ch' + n], set, 7000, REAL.concat(S13.list)), out = [];
    while (!T.done(L.state)) {
      while (T.question(L.state).tap > 0) T.tap(L.state);
      const q5 = T.question(L.state);
      if (q5.col === 0) out.push([pr(q5.a, q5.b), q5.full, E.takeLine(L.def, q5.plan, 0, q5.stage, q5.mode, q5.full)]);
      T.digit(L.state, L.def, q5.plan.cols[q5.col].digit, 1, clock.t += 1000);
    }
    return out;
  };
  const f13 = forms13(13, 'ch13-take');
  assert.deepEqual(f13.map((x) => x[1]), [true, true, true, true, false], pr(43, 16) + ' show, ' + pr(70, 34) + ' tap, then 85 − 39 and 97 − 52 full');
  assert.equal(f13[2][2], 'Ones first. Five take away nine.', '85 − 39 says its first column in full');
  assert.equal(f13[4][2], 'Ones first.', '486 − 253, her third on her own, says the name alone');
  const f14 = forms13(14, 'ch14-take');
  assert.deepEqual(f14.map((x) => x[1]), [true, true, true, true, false, false], 'chapter 14: the made warm-up and 462 − 135 are her first two on her own');
  assert.equal(E.takeLine({}, plan(475, 132), 1, null, 'hers', false), 'Now the tens.');
  assert.equal(E.takeLine({}, plan(475, 132), 0, null, 'hers', false), 'Ones first.');
});

/* ================================================================ the pictures' option objects (section 8) */
test('E.takePicture and E.takeSandOpts give exactly the option objects section 8 pins', () => {
  const p = plan(503, 278), q = { plan: p, col: 0 };
  const start = E.takePicture({}, q, 'start');
  assert.deepEqual(Object.keys(start), ['hundreds', 'tens', 'ones', 'taken', 'fresh', 'spread', 'glow', 'kind', 'small']);
  assert.deepEqual(start, { hundreds: 5, tens: 0, ones: 3, taken: { hundreds: 0, tens: 0, ones: 0 }, fresh: { tens: 0, ones: 0 }, spread: null, glow: null, kind: 'store', small: false });
  const chain = E.takePicture({}, q, { col: 0, spreads: 2, taken: true, flight: 'open' });
  assert.deepEqual(chain, { hundreds: 4, tens: 9, ones: 13, taken: { hundreds: 0, tens: 0, ones: 8 }, fresh: { tens: 9, ones: 10 }, spread: { from: 'tens', to: 'ones', stage: 'open' }, glow: null, kind: 'store', small: false },
    '503 − 278\'s rows after the chain: 9, all of them fresh');
  assert.deepEqual(E.takePicture({}, q, 'done').taken, { hundreds: 2, tens: 7, ones: 8 });
  assert.deepEqual(E.takePicture({ picture: { kind: 'marks' } }, { a: 811, b: 356 }, { col: 1, spreads: 1, glow: 'hundreds' }),
    { hundreds: 7, tens: 10, ones: 11, taken: { hundreds: 0, tens: 0, ones: 6 }, fresh: { tens: 10, ones: 10 }, spread: null, glow: 'hundreds', kind: 'marks', small: false });
  const h = E.takeHelp({ ground: 'earth' }, p, 0, 'zero');
  h.steps.forEach((s) => {
    const o = E.takeSandOpts(s);
    assert.deepEqual(Object.keys(o), ['kind', 'hundreds', 'tens', 'ones', 'crossed', 'fresh', 'take', 'lit', 'col', 'ground']);
    assert.equal(o.ground, 'earth'); assert.equal(o.kind, 'quick');
  });
});

/* ================================================================ 14. migration */
test('14. migration: a cat with `takes` goes through the store unchanged, idempotently; junk dropped; a bad take state dropped from the slot, a place and hollowWaiting', () => {
  const S = stub();
  const cat = E.blankCat({ now: 1, id: 'cat1' });
  E.startChapter(cat, S.ch13, 1000);
  V1.play(E, S.ch13, cat, { t: 5000, takeMiss: ['85-39'], stopIn: { f002: 1 } });
  assert.ok(cat.takes.log.length >= 6);
  const save = { version: 2, cats: [cat], current: cat.id, settings: { readAloud: false, bigText: false } };
  const m = E.migrate(clone(save));
  assert.deepEqual(m.cats[0], cat, 'migrates to itself');
  assert.deepEqual(E.migrate(clone(m)), m, 'idempotent');
  const store = E.createStore(memStorage());
  store.save(m);
  assert.deepEqual(store.load(), m, 'through the store');
  const mig = (c) => E.migrate({ version: 2, cats: [c], current: c.id }).cats[0];
  const base = () => clone(E.blankCat({ now: 1, id: 'j' }));
  assert.ok(!('takes' in mig(Object.assign(base(), { takes: 5 }))), 'not an object: no key');
  assert.ok(!('takes' in mig(Object.assign(base(), { takes: [1] }))));
  const good = clone(cat.takes.log[0]);
  const junk = mig(Object.assign(base(), { takes: { log: [5, null, { a: 5, b: 3, at: 1 }, { a: 58, b: 23 }, Object.assign(clone(good), { kind: 'zeros' }), Object.assign(clone(good), { kind: undefined })], rounds: -2, cleanRounds: 2.7, extra: 1 } }));
  assert.equal(junk.takes.log.length, 2); assert.equal(junk.takes.log[0].kind, good.kind, 'kind recomputed'); assert.equal(junk.takes.log[1].kind, good.kind);
  assert.equal(junk.takes.rounds, 0); assert.equal(junk.takes.cleanRounds, 2); assert.ok(!('extra' in junk.takes));
  const proto = E.migrate(JSON.parse('{"version":2,"cats":[{"id":"p","name":"x","__proto__":{"takes":{"log":[],"rounds":3}}}]}')).cats[0];
  assert.ok(!Object.prototype.hasOwnProperty.call(proto, 'takes'), 'a __proto__ holding takes makes none');
  const long = { log: [], rounds: 1, cleanRounds: 1 };
  for (let i = 0; i < 600; i++) long.log.push(Object.assign(clone(good), { at: i }));
  const capped = mig(Object.assign(base(), { takes: long })).takes.log;
  assert.equal(capped.length, 500); assert.equal(capped[0].at, 100, 'the oldest first out');
  // a lesson whose take state is bad is dropped from the slot, a place and hollowWaiting
  const { st } = lessonOf([[503, 278]]);
  const bads = [
    Object.assign(clone(st), { queue: [{ a: 5, b: 3 }] }), Object.assign(clone(st), { col: 3 }), Object.assign(clone(st), { col: 1.5 }),
    Object.assign(clone(st), { got: 'x' }), Object.assign(clone(st), { slips: [3] }), Object.assign(clone(st), { op: '+' }), Object.assign(clone(st), { cols: null }),
    Object.assign(clone(st), { taught: ['spread'] }), Object.assign(clone(st), { taught: 'none' }), Object.assign(clone(st), { avoid: ['x'] }), Object.assign(clone(st), { avoid: 27 })
  ];
  bads.forEach((bad, i) => {
    const c = Object.assign(base(), { lesson: { mode: 'chapter', frame: 'f001', chapter: 'ch12', state: bad }, chapter: 'ch12', frame: 'f001',
      places: { ch13: { frame: 'f001', history: [], lesson: { mode: 'chapter', frame: 'f001', state: bad } } }, hollowWaiting: { mode: 'hollow', state: bad } });
    const out = mig(c);
    assert.equal(out.lesson, null, 'bad ' + i); assert.equal(out.places.ch13.lesson, null); assert.equal(out.hollowWaiting, null);
  });
  const ok = Object.assign(base(), { lesson: { mode: 'chapter', frame: 'f001', chapter: 'ch12', state: clone(st) }, chapter: 'ch12', frame: 'f001' });
  assert.deepEqual(mig(ok).lesson.state, st, 'a good take state is kept');
  const ok2 = Object.assign(base(), { lesson: { mode: 'chapter', frame: 'f001', chapter: 'ch12', state: Object.assign(clone(st), { taught: ['none', 'ones2'], avoid: [133, 27] }) }, chapter: 'ch12', frame: 'f001' });
  assert.deepEqual([mig(ok2).lesson.state.taught, mig(ok2).lesson.state.avoid], [['none', 'ones2'], [133, 27]], 'and one with `taught` and `avoid`');
});

/* ================================================================ 15. chapters 1 to 11 and the Warrior Counts unchanged */
// the v23 tree's source of the functions section 8 leaves untouched: sha256 of Function.prototype.toString, taken
// from 8195ad1's app/engine.js (E.lessonFacts and E.questionDef change in the second pass, behind their guard)
const PINNED = {
  'counts.start': '731654833299e0d62af7c519aaac36466c4e017fa084bbb231ebb18650357d9a', 'counts.done': '34530665407bda53b4332c206480bc09c88f4d10f5fdc6cb3a5fe78c8679c42f',
  'counts.question': '5238d949dcb358aac029ba12622ec52c71b3d3007c3f55b288b10f8903021135', 'counts.answer': '673a405029557a8c78b364fb44ea6d51bb5f3fcef932c5d64ee9002ebbde1ab4',
  'counts.summary': '10330e5b3852f1badc4ad3fbc7b25b5ecfb7cd87c03d5e64eff2dad964e928a8', 'counts.ask': '04daf315ce65d8c363006126037dda2fddf08fca940a2fef94fd179de30bf67a',
  helpPlan: '499ea94a24624b355181cebb4b2ded0c4c9aed38af82535debea5d42a391681f', hardFacts: 'f73708cf87683e09642faa4e42b0cec9f12f0a68a99745ce61327f6887cee326',
  warriorHard: 'c165d433fa300f27c7c0d3e76b77983d2305f1007fa9fcdc8913caec48d66599', countSets: '1ef48920a0cd265a3a54168ddfd3bb8d2a7709c2890a909ae10baf51995e7447',
  learnedCounts: 'd0f6e9bffd8dacc8aac70ff56d505f103bf3b55ca6c82989ba4536d4097ffacc', hollowLines: 'c761be64f49c2696dceddbdf87becb0878d667d95dde3ea76758607d58532ab0',
  hollowStart: 'f78c5ec3d2433c165437d814f7d779dc2a120854d218a003badbe9b664ae467d', hollowFinish: '2175d136675c5bd4b4216c46331e372e8f8faed950cb3ac8bebc6efb5b856403',
  settleLesson: 'dbd6d74dbbbff200327a459cf0550866f734f07a28b5427c045e5434fbd0fe1e', finishCounts: '88cce52505bd5cb8b98bec2a46125969abb9ad71b5f2d74835f82e96e271fdfa',
  lessonAt: 'e8b5f3affe303e43704d6f96c0a0ae7ef4e6b362d2e5aa95f37541bf1b75ac4a', beginLesson: 'a18caf831ec80b4022e29835229668f6b0fd99b53f10d19572d6ee4d05f76dc9',
  holdLesson: 'd62ed378b510e9b1a90f32a5495d3783bfd225a71bb5ea66011525b4ccd9fe55', hollowRound: '64833222dbe79ca9f8a97da7c187679ed7dad6c8bf1e49efbe3a2834c56f0df6',
  migrate: '489379857db980f99616745528dbd22851a49fef5495476c9d7a628aa666a25f', blankCat: '33bf8ed3b341b002df17f9465f756afa13d790d5597d659d694bf80bdb798aae',
  fillPool: '7ae934b4563e0b3d815fa8ba763444ff6c5ccd303c0bd716a908bcf8a21814cc', siblingAsked: '8e85c2450bc294a6b06dfdd342402ffa73b36880c80159c1a9e42f5f783886d2',
  firstTry: 'c4457e5eadbd6483790058232b8ea5c71aaa34ea52e6df8cf3cfb5eec34a951e'
};
const fnAt = (path) => path.split('.').reduce((o, k) => o[k], E);
test('15. the Counts runner and every function section 8 leaves untouched are the v23 tree\'s, as text', () => {
  Object.keys(PINNED).forEach((k) => assert.equal(crypto.createHash('sha256').update(String(fnAt(k))).digest('hex'), PINNED[k], k + ' unchanged'));
});

test('15. every fixture save migrates as before, with no `takes` key; a take lesson leaves counts, hollow, warrior, the nest and every reader of counts as they were; no U+2212 in chapters 1 to 11 or PC.warrior', () => {
  Object.keys(V1SAVES).forEach((i) => {
    const m = E.migrate(clone(V1SAVES[i]));
    m.cats.forEach((c) => assert.ok(!('takes' in c), 'fixture save ' + i));
    assert.deepEqual(E.migrate(clone(m)), m);
  });
  // a cat that has read chapters 1 to 3, then plays a take lesson
  const cat = E.blankCat({ now: 1, id: 'reader' });
  let t = 1000;
  ['ch01', 'ch02', 'ch03'].forEach((id) => { const s = PC.story[id]; E.startChapter(cat, s, t); const sc = V1.script({ t }); V1.play(E, s, cat, sc); t = sc.t; });
  const readers = (c) => clone({
    counts: c.counts, hollow: c.hollow, warrior: c.warrior || null, nest: c.nest,
    hard: [1, 2, 3, 5].map((tb) => E.hardFacts(c, tb, REAL)), warriorHard: E.warriorHard(c, REAL), lines: E.hollowLines(c, REAL),
    start: E.hollowStart(clone(c), REAL, 5000000, 2).state.queue, tables: E.factTables(c, REAL), book: E.buildFullBook(c, REAL),
    first: E.firstTry(c, '3x2'), learned: E.learnedCounts(c, REAL), sets: REAL.flatMap((s) => Object.keys(s.counts || {}).map((id) => JSON.stringify(E.chapterLesson(clone(c), s, id, 7000000, REAL).state)))
  });
  const before = readers(cat);
  const S = stub();
  E.startChapter(cat, S.ch18, t);
  V1.play(E, S.ch18, cat, { t: t + 1000, takeMiss: ['702-345', '801-263', '503-278'] });
  assert.ok(cat.takes.log.length >= 8);
  const after = readers(cat);
  Object.keys(before).forEach((k) => assert.deepEqual(after[k], before[k], k + ' the same after a take lesson'));
  // no line of chapters 1 to 11 or the Warrior Counts has a minus sign
  const text = JSON.stringify(REAL) + JSON.stringify(PC.warrior || {});
  assert.ok(!text.includes('−'));
});
