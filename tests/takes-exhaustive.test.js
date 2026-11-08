/* The take-aways kit, the engine's exhaustive checks (docs/take-aways.md v0.3, section 9: test 1's every
 * problem, test 5's 2,000 helps a kind, test 6's 1,000 twins of every module problem, and test 15 on the
 * goldens' end cats). In tools/test.mjs's SLOW list, so the fast tier stays fast; the cases by value are in
 * tests/takes-engine.test.js. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const PC = require('./_load.js').load();
const E = PC.engine;
const V1 = require('./fixtures/v1.js');
const stub = require('./fixtures/takes-stub.js');

const clone = (o) => JSON.parse(JSON.stringify(o));
const pr = (a, b) => a + ' − ' + b;
const plan = (a, b) => E.takePlan(a, b);
const CH = stub.CH;

/* ================================================================ 1. the plan, every problem */
test('1. the plan against a − b for every top 10 to 999 and every bottom below it with no more digits (498,465): the digits, at most two spreads a turn, every top at a turn 0 to 18, the kinds\' counts as section 3\'s table', () => {
  const kinds = { none: 0, ones: 0, tens: 0, both: 0, zero: 0, zeros: 0 };
  let n = 0;
  for (let a = 10; a <= 999; a++) {
    for (let b = 1; b < a; b++) {
      const p = plan(a, b);
      n++;
      let v = 0, scale = 1;
      p.cols.forEach((c) => {
        if (!(c.spreads.length <= 2 && c.at >= 0 && c.at <= 18 && c.digit >= 0 && c.digit <= 9)) assert.fail(pr(a, b) + ' col ' + c.col);
        v += c.digit * scale; scale *= 10;
      });
      if (v !== a - b) assert.fail(pr(a, b) + ': ' + v);
      const nd = String(a - b).length;
      p.cols.forEach((c, i) => { if (c.blank !== i >= nd || (c.blank && c.digit !== 0)) assert.fail(pr(a, b) + ' blank'); });
      kinds[E.takeKind(p)]++;
    }
  }
  assert.equal(n, 498465);
  assert.deepEqual(kinds, { none: 164340, ones: 111375, tens: 111375, both: 91125, zero: 16200, zeros: 4050 });
});

/* ================================================================ 5. every slip's help, sampled */
// the problems of a kind, three-digit, seeded: a sample of `per`
function sampleOf(kind, per, seed) {
  const rnd = E.util.rng(seed), out = [];
  for (let guard = 0; out.length < per && guard < per * 400; guard++) {
    const a = 100 + Math.floor(rnd() * 900), b = 1 + Math.floor(rnd() * (a - 1)), p = plan(a, b);
    if (p && E.takeKind(p) === kind) out.push(p);
  }
  return out;
}
test('5. for 2,000 three-digit problems of each kind, every column and every wrong digit 0 to 9: the help ends on the right digit, draws the plan\'s spreads, hops to the digit (old marks first), opens on the slip\'s line; zero, extra and flip only where section 2 names them; extra only once its spread is taught; the written top\'s flip at a lent column is flip or kept', () => {
  let helps = 0;
  E.TAKE_KINDS.forEach((kind, ki) => {
    const list = sampleOf(kind, 2000, 101 + ki);
    assert.equal(list.length, 2000, kind);
    list.forEach((p) => {
      p.cols.forEach((c, col) => {
        const bv = c.bottom || 0;
        for (let g = 0; g <= 9; g++) {
          if (g === c.digit) { assert.equal(E.takeSlip(p, col, g), null); continue; }
          const slip = E.takeSlip(p, col, g), tag = pr(p.a, p.b) + ' col ' + col + ' typed ' + g + ' (' + slip + ')';
          // where each slip may be named (section 2's table and its order)
          if (c.spreads.length && c.chain) { if (slip !== ((g === bv - c.before || g === 0) ? 'zero' : 'fact')) assert.fail(tag + ': at a chain'); }
          else if (c.top === 0 && c.lent) { if (slip !== ((g === 10 - bv || g === bv || g === 0) ? 'zero' : 'fact')) assert.fail(tag + ': at a lent zero'); }
          else if (slip === 'zero') assert.fail(tag);
          if (slip === 'extra' && (col === 0 || c.lent || c.spreads.length)) assert.fail(tag + ': extra only left of the ones, where the column did not lend');
          if ((slip === 'flip' || slip === 'nospread') && !c.spreads.length) assert.fail(tag);
          if (slip === 'kept' && !c.lent) assert.fail(tag);
          // extra only where its spread is taught (E.takeSlip's taught): never before ones2, at the hundreds never before tens
          if (E.takeSlip(p, col, g, false, ['none']) === 'extra') assert.fail(tag + ': extra before a row is spread');
          if (col === 2 && E.takeSlip(p, col, g, false, ['none', 'ones2', 'ones']) === 'extra') assert.fail(tag + ': extra at the hundreds before a square is spread');
          if (slip === 'extra' && E.takeSlip(p, col, g, false, ['none', 'ones2', 'ones', 'tens']) !== 'extra') assert.fail(tag + ': extra once tens is taught');
          if (slip === 'extra' && g === 0 && bv === 0) assert.fail(tag + ': a 0 where the bottom is empty or 0');
          // a lent column that needs its own spread: the written top's flip is flip, or kept where the two meet
          if (c.lent && c.spreads.length && !c.chain && c.top > 0 && g === bv - c.top && slip !== 'flip' && slip !== 'kept') assert.fail(tag + ': the written top\'s flip');
          const h = E.takeHelp({}, p, col, slip);
          helps++;
          const steps = h.steps, last = steps[steps.length - 1];
          if (steps[0].say !== h.intro || !h.intro) assert.fail(tag + ': first line');
          if (!last.write || h.digit !== (c.blank ? null : c.digit)) assert.fail(tag + ': the digit');
          // the spreads drawn are the plan's: the sand's spent marks count them, from the first column on
          let sq = 0, ln = 0;
          p.cols.slice(0, col + 1).forEach((d) => d.spreads.forEach((s) => { if (s.from === 2) sq++; else ln++; }));
          if (last.sand.crossed.squares !== sq || last.sand.crossed.lines !== ln || last.sand.fresh.lines !== 10 * sq || last.sand.fresh.dots !== 10 * ln) assert.fail(tag + ': the spreads');
          // the sand's number at each step: the top as it stands (her column's never below its turn's top)
          steps.forEach((s) => {
            const cur = [s.sand.ones, s.sand.tens, s.sand.hundreds];
            if (cur[col] !== c.before && cur[col] !== c.at && !(c.chain && cur[col] === c.before)) assert.fail(tag + ': the sand\'s number');
          });
          if ([last.sand.ones, last.sand.tens, last.sand.hundreds][col] !== c.at) assert.fail(tag + ': the sand ends at the top as it stands');
          // the take: every mark of the bottom digit lit by the end, the hops' counter ending at the digit, lit never past take
          if (last.sand.lit !== bv || last.sand.take !== bv) assert.fail(tag + ': the take');
          steps.forEach((s) => { if (s.sand.lit > s.sand.take) assert.fail(tag + ': lit past take'); });
          const hops = steps.filter((s) => s.n != null);
          if (bv && hops[hops.length - 1].n !== c.digit) assert.fail(tag + ': the hops end at the digit');
          // a teen top's take goes from the old marks first: the first hop takes them all
          if (c.at > 10 && bv > c.at - 10 && hops[0].n !== 10) assert.fail(tag + ': old marks first');
          // the tens and zero forms: flip at the tens says rows, on a 0 "No rows."
          if (slip === 'flip') {
            const zero = c.before === 0, rows = col === 1;
            if (zero !== /\bNo (rows|loose)\. Not enough\./.test(h.intro) || rows !== / rows?\. Not enough\./.test(h.intro)) assert.fail(tag + ': ' + h.intro);
          }
          if (/[{}]|Only zero/.test(steps.map((s) => s.say).join(' '))) assert.fail(tag + ': a line');
        }
      });
    });
  });
  assert.ok(helps > 300000, helps + ' helps');
});

/* ================================================================ 6. the twins, 1,000 seeds */
test('6. for every module problem and 1,000 seeds: the same shape and kind, a new top, no answer of its chapter\'s, at most 400 draws, never the fallback; for \'hers\' no spread turn whose flip lands on its digit', () => {
  let problems = 0, worst = 0, total = 0, draws = 0;
  Object.keys(CH).forEach((n) => {
    const all = [].concat(CH[n].lesson || [], CH[n].story, +n === 12 ? [[589, 267]] : []).map((f) => [f[0], f[1]]);
    const avoid = all.map(([a, b]) => a - b);
    all.forEach(([a, b]) => {
      const p = plan(a, b), shape = JSON.stringify(E.takeShape(p)), kind = E.takeKind(p);
      problems++;
      const seen = new Set();
      for (let s = 1; s <= 1000; s++) {
        const t = E.takeTwin(p, s, avoid, 'hers'), q = plan(t.a, t.b);
        if (t.fallback) assert.fail(pr(a, b) + ' fell back at seed ' + s);
        if (JSON.stringify(E.takeShape(q)) !== shape || E.takeKind(q) !== kind) assert.fail(pr(a, b) + ': its shape, seed ' + s);
        if (t.a === a || avoid.includes(q.answer) || E.takeFlipLands(q) || t.tries > 400) assert.fail(pr(a, b) + ' seed ' + s + ': ' + pr(t.a, t.b));
        worst = Math.max(worst, t.tries); draws += t.tries; total++;
        seen.add(t.a + '-' + t.b);
      }
      assert.ok(seen.size > 1, pr(a, b) + ' has twins');
    });
  });
  assert.equal(problems, 63);
  assert.ok(worst <= 400 && draws / total < 20, 'worst ' + worst + ', average ' + (draws / total).toFixed(2));
  // the made warm-up, and a 'tap' twin (its flip may land: the spread was tapped)
  for (let s = 1; s <= 1000; s++) { const w = E.takeWarm(s, []); if (E.takeFlipLands(plan(w.a, w.b)) || w.a === 43) assert.fail('warm-up seed ' + s); }
});

/* ================================================================ 15. the goldens' end cats */
let GOLD = null;
function golden() {
  if (GOLD) return GOLD;
  require('../app/ui.js');
  const G7 = require('./fixtures/make-ch07-golden.js');
  const ctx = G7.context7(PC);
  GOLD = G7.SCRIPTS7.map((s) => G7.run7(ctx, s));
  return GOLD;
}
test('15. for every golden end cat (the chapter-7 golden\'s twelve readings): it migrates as before with no `takes` key; counts, hollow, warrior and the module-1 nest are the same after a take lesson, and every reader of counts reads the same', () => {
  const runs = golden();
  const REAL = E.chapters(PC.story);
  assert.ok(runs.length >= 12);
  runs.forEach((r) => {
    const cat = clone(r.end);
    assert.ok(!('takes' in cat), r.name);
    const m = E.migrate({ version: 2, cats: [clone(cat)], current: cat.id, settings: { readAloud: false, bigText: false } });
    assert.deepEqual(m.cats[0], cat, r.name + ': migrates to itself');
    const readers = (c) => clone({
      counts: c.counts, hollow: c.hollow, warrior: c.warrior || null, nest: c.nest,
      hard: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tb) => E.hardFacts(c, tb, REAL)), warriorHard: E.warriorHard(c, REAL),
      lines: E.hollowLines(c, REAL), tables: E.factTables(c, REAL), first: ['3x2', '2x6', '10x2', '5x3'].map((k) => E.firstTry(c, k)),
      learned: E.learnedCounts(c, REAL), book: E.buildFullBook(c, REAL)
    });
    const before = readers(cat);
    const S = stub();
    E.startChapter(cat, S.ch16, 9e12);
    V1.play(E, S.ch16, cat, { t: 9e12 + 1000, takeMiss: ['432-178', '645-278', '811-356'] });
    assert.ok(cat.takes.log.length >= 9, r.name);
    const after = readers(cat);
    Object.keys(before).forEach((k) => assert.deepEqual(after[k], before[k], r.name + ': ' + k));
    const m2 = E.migrate(clone({ version: 2, cats: [cat], current: cat.id, settings: {} }));
    assert.deepEqual(m2.cats[0].takes, cat.takes, r.name + ': her takes through a reload');
  });
});
