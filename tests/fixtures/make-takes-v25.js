/* Records tests/fixtures/takes-v25-entries.json: the take-aways kit as v25 plays it (decision 57's build, plan.md's
 * phase 0), recorded from the tree as it was before the kit v0.4 touched anything (v25's app/engine.js, with chapter
 * 13's stub and art beside it), so the new engine can be held to it: every case below, played on today's engine, must
 * give deep-equal entries, states and lines (plan.md's proof L2; L3 and L4 read `lines`, `slips`, `resume` and
 * `tapState`). Everything the kit v0.4 adds is behind `movesOn(st)` (a `taught` list holding a step from `ones2` on),
 * so none of these cases reaches it: chapter 12's lesson and store (`taught: ['none']`), a chapter-12-only cat's store
 * round, and `T.start` with no `taught` at all.
 *
 * The cases (the case list is code, `CASES`; each a script for `drive`):
 *   - chapter 12's lesson (`E.takeLesson(cat, ch12, 'ch12-take')`) played right; and with the slips that set can
 *     raise: a `fact` (254 − 131's ones, 'show', so its twin is 'tap'), the ones-first pointer (58 − 23's ones typed 3),
 *     a `fact` where `extra`'s digit stands (76 − 42's tens typed 2: no row is taught, so "Let's scratch it out."), the
 *     leading-zero box (475 − 132's hundreds OK'd empty), the guard and the empty box ignored; a `kept` is not one of
 *     them (no column of a `none` set lends: 43 − 16 and the others below carry it); its state at the third problem
 *     (`resume`) and the rest played from it;
 *   - chapter 12's store set, right and missed (`twins: false`);
 *   - a store round from `E.takeRoundStart` for a cat that has finished chapter 12 only (round 1, `taught: ['none']`),
 *     right; and round 2 with a miss (its twin in the round) and `extra`'s digit (`fact`), then E.takeRoundFinish,
 *     E.takeTable and E.hardTakes;
 *   - `T.start` with no `taught` on 43 − 16, 503 − 278, 811 − 356 and 52 − 27: 'hers' right; 'hers' with v0.3's
 *     slips at their places (`flip`, `nospread`, `kept`, `zero`); 'tap' through `T.tap` (a digit before the tap, two
 *     taps off the zone, the guard, a `kept` and its 'hers' twin); 'show' right and with a slip; 43 − 16 with no
 *     `logged` (the ones-first pointer of her first five);
 *   - `tapState`: a v25 'tap' state of 702 − 345 with every step `taught` and one spread tapped (L4: it resumes at
 *     `move` 3 on the new engine).
 * Each step records the question (T.question, its `plan` left out: E.takePlan is untouched), the column's line
 * (E.takeLine as the page asks it), before a problem its words (E.takeQuestion), on a 'show' or 'tap' column that
 * spreads E.takeShow and the line after, the store picture at 'before', 'after' and 'taken', and every call's result
 * as returned (the help, the marks, the entry, the twin and the end line among them); each case ends with the entries
 * (as logged on its cat), T.summary, the state and the cat's `takes`.
 *
 *   node tests/fixtures/make-takes-v25.js        records, on a v25 engine only (it refuses one with E.takeMoves)
 *
 * Record it once, from v25's tree (phase 0), never again. Not a test file.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'takes-v25-entries.json');
const T0 = 1762700000000;   // a fixed clock: the lessons' seeds and every `at`
const clone = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));
const PLAIN = { id: 'v25-plain', op: '-', teacher: 'tallyheart', picture: { kind: 'store' } };

function strip(q) { if (!q) return q; const o = clone(Object.assign({}, q, { plan: undefined })); delete o.plan; return o; }
function hmap(q) { const h = {}; (q.helped || []).forEach((c) => { h[c] = true; }); return h; }

/* Play a take state to its end. `script`: `miss` { 'a-b:col': digit } typed the first time that column of that problem
 * (not a twin) is asked, then the right digit; `pre` { 'a-b:col': [act…] } acts made once before the column's own
 * (`{ d: v }` a digit, `{ guard: v }` a digit 100 ms after the last OK, `'tap'`, `'off'` a tap off the zone); `ms`.
 * Each column's own act: a 'tap' turn's spreads tapped, else the digit ('' for a blank box). */
function drive(E, def, st, script, cat, t0) {
  const T = E.takes, steps = [], entries = [], used = {};
  let t = t0 || T0, lastOk = 0, asked = -1;
  const act = (a, q) => {
    if (a === 'tap') return { act: 'tap', res: clone(T.tap(st)) };
    if (a === 'off') return { act: 'off', res: clone(T.tap(st, true)) };
    const guard = a && a.guard != null, v = guard ? a.guard : a.d;
    const at = guard ? lastOk + 100 : (t += 1000);
    const res = T.digit(st, def, v, (script.ms || 2500) + steps.length, at);
    if (res && !res.ignored) lastOk = at;
    if (res && res.entry) { entries.push(clone(res.entry)); if (cat) E.logTake(cat, res.entry); }
    return { act: guard ? 'guard' : 'digit', given: v, res: clone(res) };
  };
  for (let n = 0; n < 400 && !T.done(st); n++) {
    const q = T.question(st), c = q.plan.cols[q.col], key = q.a + '-' + q.b + ':' + q.col;
    const step = { q: strip(q), line: E.takeLine(def, q.plan, q.col, q.stage, q.mode, q.full) };
    if (asked !== st.pos) { asked = st.pos; step.ask = clone(E.takeQuestion(def, q)); }
    if (q.mode !== 'hers' && c.spreads.length) {
      step.show = clone(E.takeShow(def, q.plan, q.col, { mode: q.mode, helped: hmap(q), picture: q.picture }));
      step.after = E.takeLine(def, q.plan, q.col, 'after', q.mode, q.full);
    }
    step.pictures = ['before', 'after', 'taken'].map((s) => clone(E.takePicture(def, q, s)));
    step.acts = [];
    if (!q.twin && script.pre && script.pre[key] && !used['pre ' + key]) {
      used['pre ' + key] = true;
      script.pre[key].forEach((a) => step.acts.push(act(a, q)));
    }
    if (T.question(st).tap > 0) step.acts.push(act('tap', q));
    else {
      const mk = !q.twin && script.miss && Object.prototype.hasOwnProperty.call(script.miss, key) && !used['miss ' + key];
      if (mk) used['miss ' + key] = true;
      step.acts.push(act({ d: mk ? script.miss[key] : c.blank ? '' : c.digit }, q));
    }
    steps.push(step);
  }
  return { steps, entries, summary: clone(T.summary(st)), state: clone(st), t, lastOk };
}

function catOf(E) { return E.blankCat({ id: 'v25-cat', now: T0, index: 0 }); }

/* A cat that has finished chapter 12 (its lesson and its store played right), as the store round's cases need. */
function ch12Cat(E, PC) {
  const cat = catOf(E), ch12 = PC.story.ch12;
  ['ch12-take', 'ch12-store'].forEach((id, i) => {
    const L = E.takeLesson(cat, ch12, id, T0 + i * 1e6);
    drive(E, L.def, L.state, {}, cat, T0 + i * 1e6);
    E.recordLesson(cat, L.state);
  });
  cat.finished.ch12 = T0 + 3e6;
  return cat;
}

const CH12_SLIPS = {
  miss: { '254-131:0': 2, '58-23:0': 3, '76-42:1': 2, '475-132:2': '' },
  pre: { '76-42:1': [{ guard: 9 }], '368-145:0': [{ d: '' }] }
};
const PLAIN_SLIPS = {
  '43-16': { '43-16:0': 3, '43-16:1': 3 },                       // flip at the ones (6 − 3), kept at the tens (4 − 2)
  '503-278': { '503-278:0': 0, '503-278:1': 3, '503-278:2': 3 }, // zero at the chain (0), zero at the lent zero (10 − 7), kept (5 − 2)
  '811-356': { '811-356:0': 0, '811-356:1': 6, '811-356:2': 5 }, // nospread (0), kept at the lent-then-got tens (11 − 5), kept (8 − 3)
  '52-27': { '52-27:1': 3 }                                      // its flip lands at the ones (right); kept at the tens (5 − 2)
};
const PLAIN_PROBLEMS = [[43, 16], [503, 278], [811, 356], [52, 27]];

function plainCase(E, a, b, regroup, script, opts) {
  const def = Object.assign({}, PLAIN), cat = catOf(E);
  const st = E.takes.start(def, Object.assign({ facts: [{ a, b, regroup }], set: def.id, mode: 'chapter', now: T0, logged: 10 }, opts || {}));
  const r = drive(E, def, st, script, cat, T0);
  return { steps: r.steps, entries: r.entries, summary: r.summary, state: r.state, takes: clone(cat.takes) };
}

/* The cases, by name: what `run` records. */
function run(PC) {
  const E = PC.engine, T = E.takes, ch12 = PC.story.ch12, out = { cases: {} };
  const C = out.cases;
  // chapter 12's lesson: right, then the slips its set can raise
  ['right', 'slips'].forEach((k) => {
    const cat = catOf(E), L = E.takeLesson(cat, ch12, 'ch12-take', T0);
    const r = drive(E, L.def, L.state, k === 'slips' ? CH12_SLIPS : {}, cat, T0);
    C['ch12-lesson-' + k] = { steps: r.steps, entries: r.entries, summary: r.summary, state: r.state, takes: clone(cat.takes),
      recorded: clone(E.recordLesson(cat, L.state)), lessons: clone(cat.lessons) };
  });
  // the slips' lesson, saved at its third problem (in the slot, as the page saves it), and the rest played from there
  {
    const cat = catOf(E), L = E.takeLesson(cat, ch12, 'ch12-take', T0), T2 = E.takes;
    // play to the third problem: the same script, stopped where `pos` reaches 2
    const script = JSON.parse(JSON.stringify(CH12_SLIPS));
    const used = {};
    let t = T0, lastOk = 0;
    while (L.state.pos < 2) {
      const q = T2.question(L.state), c = q.plan.cols[q.col], key = q.a + '-' + q.b + ':' + q.col;
      let v = c.blank ? '' : c.digit;
      if (!q.twin && script.miss[key] != null && !used[key]) { used[key] = true; v = script.miss[key]; }
      t += 1000;
      const res = T2.digit(L.state, L.def, v, 2500, t);
      if (!res.ignored) lastOk = t;
      if (res.entry) E.logTake(cat, res.entry);
    }
    const saved = clone(L.state);
    delete script.miss['254-131:0']; delete script.miss['58-23:0'];
    const r = drive(E, L.def, L.state, script, cat, t);
    C['ch12-lesson-resume'] = { saved, t, lastOk, steps: r.steps, entries: r.entries, summary: r.summary, state: r.state };
  }
  // chapter 12's store set, right and missed (no twins)
  ['right', 'miss'].forEach((k) => {
    const cat = catOf(E), L = E.takeLesson(cat, ch12, 'ch12-store', T0);
    const r = drive(E, L.def, L.state, k === 'miss' ? { miss: { '175-42:0': 4 } } : {}, cat, T0);
    C['ch12-store-' + k] = { steps: r.steps, entries: r.entries, summary: r.summary, state: r.state, takes: clone(cat.takes) };
  });
  // a store round for a cat that has finished chapter 12 only: round 1 right; round 2 with a miss and extra's digit
  {
    const cat = ch12Cat(E, PC);
    const R1 = E.takeRoundStart(cat, undefined, T0 + 5e6);
    const first = clone(R1.state);
    const r1 = drive(E, R1.def, R1.state, {}, cat, T0 + 5e6);
    const fin1 = clone(E.takeRoundFinish(cat, R1.state));
    const R2 = E.takeRoundStart(cat, undefined, T0 + 6e6);
    const first2 = clone(R2.state);
    const q0 = R2.state.queue, miss = {};
    // the second problem's ones missed (a `fact` and its twin); the third's tens typed as `extra` would be (top − 1 − bottom)
    const p1 = E.takePlan(q0[1].a, q0[1].b), p2 = E.takePlan(q0[2].a, q0[2].b);
    miss[q0[1].a + '-' + q0[1].b + ':0'] = (p1.cols[0].digit + 1) % 10;
    const c2 = p2.cols[1];
    miss[q0[2].a + '-' + q0[2].b + ':1'] = c2.before - 1 - (c2.bottom || 0) >= 0 && c2.before - 1 - (c2.bottom || 0) !== c2.digit ? c2.before - 1 - (c2.bottom || 0) : (c2.digit + 2) % 10;
    const r2 = drive(E, R2.def, R2.state, { miss }, cat, T0 + 6e6);
    const fin2 = clone(E.takeRoundFinish(cat, R2.state));
    C['round-ch12-only'] = {
      steps: { 'ch12-steps': clone(E.takeSteps(cat)) }, start1: first, start2: first2,
      round1: { steps: r1.steps, entries: r1.entries, summary: r1.summary, state: r1.state, finish: fin1 },
      round2: { miss, steps: r2.steps, entries: r2.entries, summary: r2.summary, state: r2.state, finish: fin2 },
      takes: clone(cat.takes), table: clone(E.takeTable(cat)), hard: clone(E.hardTakes(cat)), nest: clone(cat.nest),
      shelf: clone(E.hollowShelf(cat, undefined, { now: T0 + 7e6 }))
    };
  }
  // T.start with no `taught`
  PLAIN_PROBLEMS.forEach(([a, b]) => {
    const k = a + '-' + b;
    C['plain-' + k + '-hers-right'] = plainCase(E, a, b, 'hers', {});
    C['plain-' + k + '-hers-slips'] = plainCase(E, a, b, 'hers', { miss: PLAIN_SLIPS[k] });
    const p = E.takePlan(a, b), last = p.n - 1, tens = k + ':1';
    const pre = {};
    pre[k + ':0'] = [{ d: p.cols[0].digit }, 'off', 'off'];
    pre[tens] = [{ guard: 9 }].concat(last > 1 ? [{ d: '' }] : []);
    const miss = {};
    if (p.cols[1].lent) miss[tens] = p.cols[1].top >= (p.cols[1].bottom || 0) ? p.cols[1].top - (p.cols[1].bottom || 0) : p.cols[1].top + 10 - (p.cols[1].bottom || 0);
    if (miss[tens] === p.cols[1].digit) delete miss[tens];
    C['plain-' + k + '-tap'] = plainCase(E, a, b, 'tap', { pre, miss });
    C['plain-' + k + '-show'] = plainCase(E, a, b, 'show', {});
    const sm = {};
    sm[k + ':0'] = (p.cols[0].digit + 1) % 10;
    C['plain-' + k + '-show-slip'] = plainCase(E, a, b, 'show', { miss: sm });
  });
  C['plain-43-16-first-five'] = plainCase(E, 43, 16, 'hers', { miss: { '43-16:0': 2 } }, { logged: 0 });
  // a v25 'tap' state with every step taught and one spread tapped (702 − 345's square), as the slot would hold it
  {
    const def = Object.assign({}, PLAIN);
    const st = T.start(def, { facts: [{ a: 702, b: 345, regroup: 'tap' }], set: def.id, mode: 'chapter', now: T0, logged: 10, taught: E.TAKE_STEPS.slice() });
    const tap = clone(T.tap(st));
    out.tapState = { tap, state: clone(st), question: strip(T.question(st)) };
  }
  out.lines = clone(E.TAKE_LINES);
  out.slips = clone(E.TAKE_SLIPS);
  out.words = clone(E.TAKE_WORDS);
  return out;
}

module.exports = { run, drive, strip, hmap, T0, PLAIN, CH12_SLIPS, PLAIN_SLIPS, PLAIN_PROBLEMS };

if (require.main === module) {
  const PC = require('../_load.js').load();
  const E = PC.engine;
  if (typeof E.takeMoves === 'function' || typeof E.takeMovesOn === 'function') {
    console.error('make-takes-v25: this engine has the kit v0.4 (E.takeMoves): the fixture is v25\'s, recorded once before phase 1. Not written.');
    process.exit(1);
  }
  const rec = run(PC);
  rec.recorded = { engine: E.VERSION, note: 'phase 0 of decision 57\'s build: v25\'s engine, before the kit v0.4' };
  fs.writeFileSync(OUT, JSON.stringify(rec) + '\n');
  console.log('wrote ' + OUT + ' (' + fs.statSync(OUT).size + ' bytes, ' + Object.keys(rec.cases).length + ' cases)');
}
