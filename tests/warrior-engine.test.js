/* The Warrior Counts, the engine (docs/warrior-counts.md v0.4: sections 2 to 7, and section 8's
 * engine tests; README decisions 48 and 49).
 *
 * On stand-ins only for what is not built yet: chapter 9 (the 8s) is the real one since the merge onto it
 * (2026-10-31); chapter 10 (the 7s) is a stub chapter with one Counts set until it lands (and chapter 9's
 * stub stays here for a tree without it); the Ceremony is a stub chapter with `opensWhen: 'warrior'`, and
 * PC.warrior a stand-in in section 7's shape (the story owner's app/story/warrior.js, when it is loaded,
 * is checked against the engine in a test of its own). Chapters 1 to 9 are the real ones. Sittings are driven as the page drives them: E.warriorBegin, each
 * question asked as E.warriorAsk says and answered through E.counts.answer, logged (E.logAnswer), kept
 * (E.warriorKeep) or, on the last, recorded through E.recordLesson, the pauses taken (E.warriorBeat). */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const PC = require('./_load.js').load();
const E = PC.engine;
const V1 = require('./fixtures/v1.js');
const V1SAVES = require('./fixtures/v1-saves.json');

const clone = (o) => JSON.parse(JSON.stringify(o));
const REAL = PC.warrior || null;   // app/story/warrior.js, when index.html loads it
const MISS4 = ['There. Now you’ve seen it. On we go.', 'That’s a tricky one. On to the next.', 'There it is. You’re doing fine. Keep going.', 'Now it’s in the sand. On we go.'];
const FINALE_MISS = 'There. A hundred. And that’s every Count!';
const HUNDRED = [{ who: 'player', text: 'A HUNDRED!', kind: 'shout' }];
const STANDIN = {
  after: 'ch10',
  counts: {
    praise: ['Yes.', '', '', '', '', 'Good.', '', '', '', ''],
    fast: ['Quick as a pounce!', '', '', '', ''],
    remembered: 'Last time {a} × {b} made you stop and think. Not today!',
    rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.',
    missLast: MISS4,
    last: { prompt: [{ text: 'At last:', kind: 'caption' }, { who: 'glintstar', text: 'Ten times ten.' }], right: HUNDRED, missLast: FINALE_MISS }
  }
};
PC.warrior = STANDIN;

/* The stand-in chapters: 9 teaches the 8s (used only in a tree without the real chapter 9), 10 the 7s
 * (each in a voice of its own the sitting must never borrow), 11 is the Ceremony. */
function stub(id, number, set, table, def) {
  const facts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => [n, table]);
  return {
    id, number, title: 'Stand-in ' + number, start: 'f001',
    frames: { f001: { board: 'STUB.', counts: { set, next: 'f002' } }, f002: { board: 'STUB.', end: true } },
    counts: { [set]: Object.assign({ table, teacher: 'tallyheart', ask: '{a} × {b}', praise: ['Yes!'], fast: ['Quick!'], miss: 'There. We’ll come back to that one.',
      missLast: 'There. Now you’ve seen it counted.', helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.', facts }, def) }
  };
}
const CH09 = stub('ch09', 9, 'ch09-eights', 8, { thing: 'leg', things: 'legs', unit: 'spider', units: 'spiders', remembered: 'THE EIGHTS’ OWN VOICE', fastAfterMiss: ['THE EIGHTS AFTER A MISS'], again: ['THE EIGHTS AGAIN'] });
const CH10 = stub('ch10', 10, 'ch10-sevens', 7, { thing: 'dragonet', things: 'dragonets', unit: 'clutch', units: 'clutches', helpCounter: 'you', remembered: 'THE SEVENS’ OWN VOICE', prompt: 'THE SEVENS’ PROMPT', miss: 'THE SEVENS’ MISS', missLast: 'THE SEVENS’ MISS LAST' });
const CH11 = { id: 'ch11', number: 11, title: 'Stand-in ceremony', opensWhen: 'warrior', start: 'f001', frames: { f001: { board: 'STUB.', next: 'f002' }, f002: { board: 'STUB.', end: true } } };
const CH8 = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08'];
// chapters 1 to 8 as they shipped (the anchor of a table no chapter teaches yet: neither the 7s nor the 8s)
const UPTO8 = CH8.map(id => PC.story[id]);
// chapters 1 to 9 as built (nine Counts: chapter 9 teaches the 8s; the 7s are chapter 10's)
const UPTO9 = CH8.concat(['ch09']).map(id => PC.story[id]);
// every real chapter in the tree (chapter 9's 8s and chapter 10's 7s once they land), the stand-ins only
// for what is not built yet: so the sitting is checked against the real sets, voices and help styles
const BUILT = E.chapters(PC.story);
const STORIES = BUILT.concat(PC.story.ch09 ? [] : [CH09]).concat(PC.story.ch10 ? [] : [CH10]);
const WITH_CEREMONY = STORIES.concat([CH11]);

const T0 = Date.UTC(2026, 10, 1, 16, 0, 0);   // a Sunday afternoon
const MIN = 60000, HOUR = 3600000;
const pk = (a, b) => Math.min(a, b) + 'x' + Math.max(a, b);
const qk = (q) => pk(q.a, q.b);
const nums = (q) => q.a === q.b ? [q.a] : [q.a, q.b];
const shares = (p, q) => nums(p).some(n => nums(q).includes(n));
const GENTLE = (q) => ([1, 2, 10].includes(q.a) && q.b <= 5) || ([1, 2, 10].includes(q.b) && q.a <= 5);
const EASY = (q) => [1, 2, 5, 10].some(n => q.a === n || q.b === n);
const TIER = (q) => !EASY(q);
const ten = (q) => q.a === 10 && q.b === 10;
const AFTER_PAUSE = [15, 29, 43];
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* A cat who has finished chapters 1 to 10 and learned every Count (each Count's own set finished). */
function readyCat(id) {
  const cat = E.blankCat({ now: 1, id: id || 'warrior-cat' });
  cat.name = 'Minnow'; cat.petname = 'Pickle';
  E.chapters(STORIES).forEach(s => { cat.finished[s.id] = 1; });
  E.countSets(STORIES).forEach(c => { cat.lessons[c.setId] = { set: c.setId, mode: 'chapter', answers: 10, correct: 10, fast: 10, facts: 10, firstTry: 10, helped: 0, noHelp: true, finished: true }; });
  return cat;
}
/* A Counts answer as the runner logs one. */
function entry(set, a, b, correct, ms, at) {
  return { set, a, b, answer: correct ? a * b : a * b + 1, correct, ms, helped: !correct, retry: false, at };
}
/* Her history: each "axb" missed in a Hollow round (in order), or right but slow with `slow`. */
function history(cat, keys, o) {
  o = o || {};
  keys.forEach((k, i) => {
    const [a, b] = k.split('x').map(Number);
    cat.counts.push(entry('hollow-' + Math.max(a, b) + 's', a, b, !!o.slow, o.slow || 3000, (o.at || 1000) + i));
  });
  return cat;
}

/* One sitting as the page runs it (see the header). `wrong(q, i)`: she answers it wrong (`typed(q)` what
 * she types then, else one more than the answer); `ms(q, i)`; `stop`: she leaves after that many
 * answers; `noRecord`: the last answer is kept but never recorded (a page closed at the wrong moment). */
function sit(cat, o) {
  o = o || {};
  let t = o.at != null ? o.at : T0;
  const begin = E.warriorBegin(cat, o.stories || STORIES, t);
  const st = begin.state, results = [], beats = [];
  let rec = null, n = 0;
  while (!E.counts.done(st) && (o.stop == null || n < o.stop)) {
    const q = E.counts.question(st), i = st.pos, D = E.warriorAsk(begin.def, st, q, o.stories || STORIES);
    const bad = o.wrong ? o.wrong(q, i) : false;
    const typed = bad ? (o.typed ? o.typed(q) : q.answer + 1) : q.answer;
    const res = E.counts.answer(st, D, typed, o.ms ? o.ms(q, i) : 3000, t += (o.step || 8000));
    E.logAnswer(cat, res.entry);
    results.push({ q, D, res, i });
    if (res.done && !o.noRecord) rec = E.recordLesson(cat, st);
    else { E.warriorKeep(cat, st, t); const b = E.warriorBeat(st); if (b) beats.push(b); }
    n++;
  }
  return { begin, st, results, rec, beats, t };
}
// she gets the first k questions wrong (never 10 × 10, which is always last)
const firstWrong = (k) => (q, i) => i < k;
const lastOf = (cat) => cat.warrior.attempts[cat.warrior.attempts.length - 1];
function memStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); } };
}

/* ------------------------------------------------------------ the shipped chapter-8 rules, for comparison
 * E.hardFacts, E.hollowLines and E.isOpen exactly as chapter 8 shipped them (app/engine.js, 0.8.0), with
 * the private helpers they used, so a test can show that the changed functions give what they gave. */
const OLD = (function () {
  const pairKey = (a, b) => Math.min(a, b) + 'x' + Math.max(a, b);
  function andList(a) { return a.length > 2 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a.join(' and '); }
  function hardFacts(cat, table, stories) {
    table = table || 1;
    const mine = {};
    for (let n = 1; n <= 10; n++) mine[pairKey(n, table)] = true;
    const last = {}, memo = {};
    (cat && cat.counts || []).forEach(function (e, i, log) {
      if (!e || e.retry || e.filler || (e.check && e.correct)) return;
      const opener = !(i > 0 && log[i - 1] && log[i - 1].set === e.set);
      if (e.correct && mine[pairKey(e.a, e.b)] && E.readFirst(e, stories, memo, opener)) return;
      const k = pairKey(e.a, e.b);
      if (mine[k]) last[k] = { e: e, i: i };
    });
    return Object.keys(last).map(function (k) { return last[k]; }).filter(function (x) {
      return !x.e.correct || !(typeof x.e.ms === 'number' && x.e.ms < E.FAST_MS);
    }).sort(function (x, y) {
      return (x.e.correct ? 1 : 0) - (y.e.correct ? 1 : 0) || (y.e.ms || 0) - (x.e.ms || 0) || y.i - x.i;
    }).map(function (x) { return [x.e.a, x.e.b]; });
  }
  function hollowLines(cat, stories, opts) {
    const counts = E.learnedCounts(cat, stories).map(function (c) {
      const def = E.hollowDef(stories, c.table);
      return { table: c.table, def: def, glow: E.hollowTable(cat, c.table).glow, name: E.countName(def, c.table) };
    });
    const one = counts.length === 1 ? counts[0] : null;
    const glowing = counts.filter(function (d) { return d.glow; });
    const greet = opts && opts.reward ? 'Another round? I’ve got all evening.'
      : one ? 'Back for more ' + E.hollowWord(one.def) + '? A full round earns a treasure for your nest.'
        : counts.length ? 'Which Count today? A full round earns a treasure for your nest.' : 'Finish a Count in your story first. Then come back and practise it.';
    const glow = one && one.glow ? 'Look at your claw mark. It glows now. You know your ' + E.hollowWord(one.def) + '.'
      : glowing.length ? 'Look at your claw marks. Your ' + andList(glowing.map(function (d) { return E.hollowWord(d.def); })) + ' ' + (glowing.length === 1 ? 'mark glows' : 'marks glow') + ' now.' : null;
    return { counts: counts, one: one, greet: greet, glow: glow };
  }
  function isOpen(cat, story, stories) {
    const list = E.chapters(stories);
    for (let i = 0; i < list.length; i++) {
      if (list[i].id !== story.id) continue;
      return i === 0 || E.isFinished(cat, list[i - 1].id) || E.isFinished(cat, story.id);
    }
    return false;
  }
  return { hardFacts, hollowLines, isOpen };
}());
/* With E.hardFacts swapped for the shipped rule (E.lessonFacts and E.hollowStart call it by name). */
function withOldHardFacts(fn) {
  const now = E.hardFacts;
  E.hardFacts = OLD.hardFacts;
  try { return fn(); } finally { E.hardFacts = now; }
}

/* The chapter-7 golden's twelve readings (tests/fixtures/make-ch07-golden.js), run once in this
 * process: their end cats are the goldens' cats for the migration and hard-fact tests. */
let GOLD = null;
function golden() {
  if (GOLD) return GOLD;
  require('../app/ui.js');
  const G7 = require('./fixtures/make-ch07-golden.js');
  const ctx = G7.context7(PC);
  GOLD = { G7, runs: G7.SCRIPTS7.map(s => G7.run7(ctx, s)) };
  return GOLD;
}

/* ================================================================ 1. the 55 and the numbers */
test('the 55: every pair {a, b} with 1 ≤ a ≤ b ≤ 10 once, ten squares among them; the numbers section 7 names', () => {
  const P = E.warriorPairs();
  assert.equal(P.length, 55);
  assert.equal(new Set(P.map(p => pk(p[0], p[1]))).size, 55, 'each pair once');
  assert.ok(P.every(p => p[0] >= 1 && p[0] <= p[1] && p[1] <= 10), 'a ≤ b, 1 to 10');
  assert.equal(P.filter(p => p[0] === p[1]).length, 10, 'ten squares');
  for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) assert.ok(P.some(p => pk(p[0], p[1]) === pk(a, b)), a + ' × ' + b + ' is one of them, one way round');
  assert.notStrictEqual(E.warriorPairs(), E.warriorPairs(), 'a fresh list each time');
  assert.equal(E.WARRIOR_PASS, 50, 'nine in every ten of 55 is 49.5, so 50');
  assert.deepEqual(E.WARRIOR_BEATS, [14, 28, 42]);
  assert.equal(E.WARRIOR_PAUSE_MS, 2 * HOUR);
  assert.equal(E.WARRIOR_TRICKY, 12);
  assert.deepEqual(E.WARRIOR_NEW, [[7, 7], [7, 8], [8, 8]]);
  assert.equal(E.WARRIOR_KEEP, 100);
  assert.deepEqual(E.WARRIOR_STARTS, [100, 200]);
});

test('the anchor Count: of a pair\'s two numbers, the one taught first (1, 2, 5, 10, 9, 3, 6, 4, 8, 7); a table with no set yet comes after every taught one, two such the smaller', () => {
  assert.ok(STORIES.includes(PC.story.ch09) && !STORIES.includes(CH09), 'the 8s are the real chapter 9’s');
  assert.deepEqual(E.countSets(STORIES).map(c => c.table), [1, 2, 5, 10, 9, 3, 6, 4, 8, 7], 'the order chapter 9 and the stand-in chapter 10 complete');
  const A = (a, b) => E.warriorAnchor(a, b, STORIES);
  assert.equal(A(3, 8), 3, '3 × 8 is eight patrols of three');
  assert.equal(A(9, 7), 9, '9 × 7 is seven cats’ nine lives');
  assert.equal(A(7, 8), 8, '7 × 8 is seven spiders');
  assert.equal(A(4, 6), 6, '4 × 6 is four cheeks');
  assert.equal(A(10, 3), 10, '10 × 3 is forepaws in pairs');
  assert.equal(A(5, 8), 5);
  assert.equal(A(7, 7), 7);
  for (const [a, b] of E.warriorPairs()) assert.equal(A(a, b), A(b, a), a + ' × ' + b + ' either way round');
  // chapters 1 to 9 as built (the 8s taught, the 7s not yet): a taught table before one with no set
  assert.deepEqual(E.countSets(UPTO9).map(c => c.table), [1, 2, 5, 10, 9, 3, 6, 4, 8], 'nine Counts, the 8s last');
  assert.equal(E.warriorAnchor(8, 7, UPTO9), 8, '7 × 8 is seven spiders already: chapter 9 taught the 8s');
  assert.equal(E.warriorAnchor(7, 9, UPTO9), 9, 'a taught table before one with no set');
  assert.equal(E.warriorAnchor(3, 8, UPTO9), 3);
  assert.equal(E.warriorAnchor(7, 7, UPTO9), 7);
  // chapters 1 to 8 alone (the tree the Counts were built on): the 7s and the 8s have no set
  assert.equal(E.warriorAnchor(7, 9, UPTO8), 9, 'a taught table before one with no set');
  assert.equal(E.warriorAnchor(8, 7, UPTO8), 7, 'neither taught: the smaller');
  assert.equal(E.warriorAnchor(1, 8, UPTO8), 1);
});

/* ================================================================ 2. every order */
const KINDS = {
  none: [],
  four: ['6x7', '4x8', '3x7', '6x8'],
  fifteen: ['6x7', '4x8', '3x7', '6x8', '7x9', '3x8', '4x7', '6x9', '8x9', '3x6', '4x6', '6x6', '4x9', '7x7', '9x9'],
  sevens: ['1x7', '2x7', '3x7', '4x7', '5x7', '6x7', '7x9', '7x10', '7x7', '7x8'],
  tens: ['1x10', '2x10', '3x10', '4x10', '5x10', '6x10', '7x10', '8x10', '9x10'],
  easy: ['1x1', '1x2', '1x3', '1x4', '1x5', '2x2', '2x3', '2x4', '2x5', '1x10', '2x10', '5x10']
};
function kindCat(name) {
  const cat = readyCat('kind-' + name);
  if (name === 'tenSlow') { history(cat, ['6x7', '4x8']); cat.counts.push(entry('hollow-10s', 10, 10, true, 5000, 2000)); }
  else if (name === 'tenMissed') { history(cat, ['6x7']); cat.counts.push(entry('hollow-10s', 10, 10, false, 3000, 2000)); }
  else history(cat, KINDS[name]);
  return cat;
}
/* Section 2's rules, checked from outside; returns the tricky ones' places. */
function checkOrder(Q, cat, info, where) {
  assert.equal(Q.length, 55, where + ': 55 questions');
  assert.equal(new Set(Q.map(qk)).size, 55, where + ': each pair once');
  const hard = E.warriorHard(cat, STORIES).slice(0, 12).map(p => pk(p[0], p[1]));
  const tricky = [...new Set(hard.concat(['7x7', '7x8', '8x8']))];
  assert.deepEqual([...info.tricky].sort(), [...tricky].sort(), where + ': her twelve hardest and 7 × 7, 7 × 8 and 8 × 8');
  assert.ok(!tricky.includes('10x10'), where + ': 10 × 10 is never one of the tricky ones');
  // 1. 10 × 10 last, never tricky, never hard
  const L = Q[54];
  assert.ok(ten(L), where + ': 10 × 10 is last');
  assert.ok(!L.hard, where + ': 10 × 10 never carries hard');
  assert.deepEqual(L.prompt, STANDIN.counts.last.prompt, where + ': "At last:" and "Ten times ten."');
  assert.deepEqual([L.right, L.missLast], [HUNDRED, FINALE_MISS], where + ': her shout, and its own miss line');
  // 2. a gentle first, easy openers
  assert.ok(GENTLE(Q[0]), where + ': question 1 is gentle (' + qk(Q[0]) + ')');
  [2, 3, 15, 29, 43].forEach(p => assert.ok(EASY(Q[p - 1]), where + ': question ' + p + ' is easy (' + qk(Q[p - 1]) + ')'));
  // 3. the tricky ones spread
  const at = Q.map((q, i) => (tricky.includes(qk(q)) ? i + 1 : 0)).filter(Boolean);
  assert.equal(at.length, tricky.length, where + ': every tricky fact is there');
  at.forEach((p, i) => {
    assert.ok(p >= 4 && p <= 54 && !AFTER_PAUSE.includes(p), where + ': a tricky one at ' + p + ' (never 1 to 3, right after a pause, or last)');
    if (i) assert.ok(p - at[i - 1] >= 2, where + ': two tricky ones in a row at ' + at[i - 1] + ' and ' + p);
  });
  const sorted = [...info.slots].sort((x, y) => x - y), k = sorted.length, gap = 51 / k;
  sorted.forEach((p, i) => assert.ok(Math.abs(p - (3.5 + (i + 0.5) * gap)) <= gap / 4 + 4, where + ': even spacing (the ' + (i + 1) + 'th of ' + k + ' at ' + p + ')'));
  // her own hard ones carry `hard: true`, and nothing else does
  assert.deepEqual(Q.filter(q => q.hard).map(qk).sort(), [...hard].sort(), where + ': her hard ones carry hard');
  // 4. no table runs
  if (!info.lastResort) for (let i = 1; i < 55; i++) assert.ok(!shares(Q[i], Q[i - 1]), where + ': ' + qk(Q[i - 1]) + ' then ' + qk(Q[i]) + ' share a number');
  if (!info.lastResort && !info.relaxed) {
    for (let s = 0; s + 5 <= 55; s++) {
      const c = {};
      Q.slice(s, s + 5).forEach(q => nums(q).forEach(n => { c[n] = (c[n] || 0) + 1; }));
      assert.ok(Object.values(c).every(v => v <= 2), where + ': a number in three of questions ' + (s + 1) + ' to ' + (s + 5));
    }
    for (let i = 2; i < 55; i++) assert.ok(!(TIER(Q[i]) && TIER(Q[i - 1]) && TIER(Q[i - 2])), where + ': three hard-tier pairs in a row at ' + (i - 1) + ' to ' + (i + 1));
  }
  // each question: its anchor, and Glintstar's few words
  Q.forEach((q, i) => {
    assert.equal(q.table, E.warriorAnchor(q.a, q.b, STORIES), where + ': ' + qk(q) + ' pictured by its anchor');
    if (i < 54) assert.deepEqual(q.prompt, [{ who: 'glintstar', text: cap(WORDS[q.a]) + ' times ' + WORDS[q.b] + '.' }], where + ': Glintstar asks ' + qk(q) + ' in words');
    assert.deepEqual(Object.keys(q).filter(x => !['a', 'b', 'table', 'prompt', 'hard', 'right', 'missLast'].includes(x)), [], where + ': only a, b, table, prompt, hard (and 10 × 10\'s right and missLast)');
  });
  return at;
}

test('every order, for 1,000 values of `now` and five cats (no history; four hard facts; fifteen; a 10 × 10 right but slow, at 5 s; a 10 × 10 missed), and 300 more for three others (all the 7s, all the 10s, twelve easy pairs): every rule of section 2, never relaxed and never the last resort', () => {
  const cats = { none: 1000, four: 1000, fifteen: 1000, tenSlow: 1000, tenMissed: 1000, sevens: 300, tens: 300, easy: 300 };
  let starts = 0, worst = 0, orders = 0;
  for (const [name, n] of Object.entries(cats)) {
    const cat = kindCat(name), before = clone(cat);
    if (name === 'tenSlow') {
      assert.ok(E.hardFacts(cat, 10, STORIES).some(p => ten({ a: p[0], b: p[1] })), 'a slow right 10 × 10 is hard by E.hardFacts’ rule (the 10s in the Hollow)…');
      assert.ok(!E.warriorHard(cat, STORIES).some(p => ten({ a: p[0], b: p[1] })), '…and never by E.warriorHard’s');
    }
    for (let s = 0; s < n; s++) {
      const now = T0 + s * 7919 * 1000 + s, info = {};
      const Q = E.warriorFacts(cat, STORIES, now, { info });
      checkOrder(Q, cat, info, name + ' at ' + now);
      assert.ok(!info.relaxed && !info.lastResort, name + ': kept every rule without relaxing (' + info.starts + ' starts)');
      starts += info.starts; worst = Math.max(worst, info.starts); orders++;
    }
    assert.deepEqual(cat, before, name + ': making an order changes nothing on the cat');
  }
  assert.ok(starts / orders < 8 && worst <= 60, 'a few starts on average (' + (starts / orders).toFixed(2) + '), ' + worst + ' at worst');
});

test('the same `now`, the same order; another `now`, another; each pair not a square shown each way round 40% to 60% of the time; a sitting\'s number is in the seed too', () => {
  const cat = kindCat('four');
  const order = (now, c) => E.warriorFacts(c || cat, STORIES, now).map(q => q.a + '×' + q.b);
  for (let s = 0; s < 40; s++) {
    const now = T0 + s * 86400000;
    assert.deepEqual(order(now), order(now), 'the same now, the same order');
    assert.notDeepEqual(order(now), order(now + 1), 'another now (a millisecond later), another order');
  }
  const ways = {};
  for (let s = 0; s < 1000; s++) E.warriorFacts(cat, STORIES, T0 + s * 1234567).forEach(q => { if (q.a !== q.b) ways[qk(q)] = (ways[qk(q)] || 0) + (q.a < q.b ? 1 : 0); });
  assert.equal(Object.keys(ways).length, 45, 'the 45 pairs that are not squares');
  Object.entries(ways).forEach(([k, n]) => assert.ok(n >= 400 && n <= 600, k + ' smaller first ' + n + ' times in 1,000'));
  // the sitting's number: after one attempt, the same now gives another order
  const two = clone(cat);
  two.warrior = { sitting: null, attempts: [{ n: 1, at: T0, done: T0 + 1, finished: false, answered: 3, right: 3, passed: false, missed: [], ms: 3000, seen: true, aside: 'late' }], passedAt: 0 };
  assert.notDeepEqual(order(T0, two), order(T0, cat), 'sitting 2 at the same now is not sitting 1');
});

test('the last resort, forced (opts.giveUp) for 500 values of `now`: 55 distinct pairs, 10 × 10 last and never hard, a gentle first, the easy openers, every tricky one in a slot of its own', () => {
  for (const name of ['fifteen', 'easy', 'none']) {
    const cat = kindCat(name);
    for (let s = 0; s < (name === 'fifteen' ? 500 : 100); s++) {
      const info = {}, Q = E.warriorFacts(cat, STORIES, T0 + s * 3001, { giveUp: true, info });
      assert.ok(info.lastResort, 'forced');
      checkOrder(Q, cat, info, name + ' (last resort) ' + s);
    }
  }
  // twelve gentle pairs hard: two of the fourteen are always free for question 1
  const gentle = readyCat('gentle');
  history(gentle, ['1x1', '1x2', '1x3', '1x4', '1x5', '2x2', '2x3', '2x4', '2x5', '1x10', '2x10', '3x10']);
  for (let s = 0; s < 100; s++) {
    const info = {}, Q = E.warriorFacts(gentle, STORIES, T0 + s, { giveUp: true, info });
    checkOrder(Q, gentle, info, 'twelve gentle pairs hard, last resort ' + s);
    assert.ok(['4x10', '5x10'].includes(qk(Q[0])), 'the gentle first is one of the two left');
  }
});

/* ================================================================ 3. the mark */
test('the mark, through E.counts.answer and E.recordLesson (the page\'s path to E.warriorFinish): 49 right is not yet, 50 passes, 55 passes clean, the first pass sets passedAt; 0 right finishes without a throw; 50 or more right of fewer than 55, set aside, is not a pass', () => {
  const run = (wrong) => { const cat = readyCat(); const s = sit(cat, { wrong: firstWrong(wrong) }); return { cat, s, a: lastOf(cat) }; };
  const r49 = run(6);
  assert.equal(r49.a.right, 49);
  assert.deepEqual([r49.a.finished, r49.a.passed, r49.s.rec.warrior.passed, r49.s.rec.warrior.firstPass, r49.cat.warrior.passedAt], [true, false, false, false, 0], '49 is a not-yet');
  const r50 = run(5);
  assert.equal(r50.a.right, 50);
  assert.deepEqual([r50.a.passed, r50.s.rec.warrior.passed, r50.s.rec.warrior.firstPass, r50.s.rec.warrior.clean], [true, true, true, false], '50 passes');
  assert.ok(r50.cat.warrior.passedAt > 0, 'passedAt set');
  assert.equal(r50.cat.warrior.passedAt, r50.a.done, 'when she passed: the last answer’s time');
  const r55 = run(0);
  assert.deepEqual([r55.a.right, r55.a.passed, r55.s.rec.warrior.clean, r55.s.rec.warrior.firstPass], [55, true, true, true], '55 passes clean');
  assert.equal(r55.s.rec.mode, 'warrior');
  assert.equal(r55.s.rec.hollow, null);
  assert.equal(r55.s.rec.summary.firstTry, 55);
  let r0;
  assert.doesNotThrow(() => { r0 = run(55); });
  assert.deepEqual([r0.a.right, r0.a.finished, r0.a.passed, r0.a.missed.length, r0.a.ms], [0, true, false, 55, null], '0 right finishes, with no typical time');
  // set aside with 54 of 54 right: never a pass
  const cat = readyCat();
  sit(cat, { stop: 54 });
  E.warriorBegin(cat, STORIES, T0 + 54 * 8000 + 2 * HOUR);
  const aside = cat.warrior.attempts[0];
  assert.deepEqual([aside.answered, aside.right, aside.finished, aside.passed, aside.aside, cat.warrior.passedAt], [54, 54, false, false, 'late', 0]);
  assert.equal(E.warriorResult(cat, STORIES), null, 'a set-aside sitting has no result');
});

test('the attempt as section 6 shapes it: { n, at, done, finished, answered, right, passed, missed, ms, seen }, timed by its own answers; recorded once; never `lessons` or `lesson`', () => {
  const cat = readyCat();
  const lessons = clone(cat.lessons);
  const s = sit(cat, { at: T0, step: 9000, wrong: (q, i) => i === 3 || i === 20, ms: (q, i) => 2000 + i * 10 });
  const a = lastOf(cat);
  assert.deepEqual(Object.keys(a), ['n', 'at', 'done', 'finished', 'answered', 'right', 'passed', 'missed', 'ms', 'seen']);
  assert.deepEqual([a.n, a.at, a.done, a.finished, a.answered, a.right, a.passed, a.seen], [1, T0, T0 + 55 * 9000, true, 55, 53, true, false]);
  assert.deepEqual(a.missed, [[s.results[3].q.a, s.results[3].q.b], [s.results[20].q.a, s.results[20].q.b]], 'the pairs as asked');
  const rights = s.results.filter(r => r.res.correct).map(r => 2000 + r.i * 10).sort((x, y) => x - y);
  assert.equal(rights.length, 53);
  assert.equal(a.ms, rights[26], 'her typical time on a right answer (the median)');
  assert.deepEqual(cat.lessons, lessons, 'no `lessons` entry');
  assert.equal(cat.lesson, null);
  assert.equal(cat.warrior.sitting, null, 'the sitting cleared');
  assert.equal(E.recordLesson(cat, s.st), null, 'recorded once');
  assert.equal(cat.warrior.attempts.length, 1);
  assert.equal(E.warriorFinish(cat, s.st), null);
  assert.equal(E.warriorFinish(cat, { queue: [], pos: 0, log: [], requeues: {} }), null, 'not a sitting: nothing to finish');
  assert.equal(E.warriorFinish(cat, null), null);
  assert.equal(E.okLesson({ mode: 'warrior', state: s.st }), false, 'a sitting can never sit in `lesson`');
});

/* ================================================================ 4. a miss counts once */
test('a miss counts once: the queue stays 55 (from `requeues` alone: the runner gains no key), one log entry, helped, once in `missed`, never asked again', () => {
  const cat = readyCat();
  const s = sit(cat, { wrong: (q, i) => i === 4 || i === 30 });
  const fresh = E.counts.start(s.begin.def, { facts: [[1, 1]], set: 'warrior', mode: 'warrior', now: T0 });
  assert.deepEqual(Object.keys(s.st).filter(k => !(k in fresh)).sort(), ['aside', 'beats', 'crowd', 'recorded', 'shown'], 'the sitting’s own keys on its own state, and nothing the runner reads but `shown`');
  assert.equal(s.st.queue.length, 55);
  assert.ok(Object.values(s.st.requeues).every(v => v === E.MAX_REQUEUE) && Object.keys(s.st.requeues).length === 55, 'every queued fact at E.MAX_REQUEUE');
  [4, 30].forEach(i => {
    const r = s.results[i];
    assert.equal(r.res.requeued, false, 'never requeued');
    assert.equal(r.res.lineKind, 'miss');
    const log = cat.counts.filter(e => e.set === 'warrior' && qk(e) === qk(r.q));
    assert.equal(log.length, 1, qk(r.q) + ': one log entry');
    assert.deepEqual([log[0].correct, log[0].helped, log[0].retry, log[0].table], [false, true, false, r.q.table], 'helped, its anchor as its table');
    assert.equal(lastOf(cat).missed.filter(p => pk(p[0], p[1]) === qk(r.q)).length, 1, 'once in missed');
  });
  assert.equal(cat.counts.filter(e => e.set === 'warrior').length, 55, 'fifty-five answers, no retry, no filler');
  assert.ok(cat.counts.every(e => !e.retry && !e.filler));
});

test('the miss lines take turns (four, in order, never one twice running); 10 × 10 has its own; none says "wrong" or counts what is left', () => {
  const cat = readyCat();
  const s = sit(cat, { wrong: (q, i) => i % 2 === 0 });
  const lines = s.results.filter(r => !r.res.correct).map(r => r.res.line);
  assert.equal(lines.length, 28);
  lines.slice(0, 27).forEach((l, k) => assert.equal(l, MISS4[k % 4], 'miss ' + (k + 1)));
  for (let k = 1; k < lines.length; k++) assert.notEqual(lines[k], lines[k - 1], 'never the same line twice running');
  assert.equal(lines[27], FINALE_MISS, 'the last, 10 × 10');
  assert.ok(lines.every(l => !/wrong|left|more to go/i.test(l)));
  // E.warriorAsk's line is the one in turn by the misses so far, however the questions fall
  const st = E.warriorBegin(readyCat('x'), STORIES, T0).state;
  const def = E.warriorDef(STORIES);
  assert.equal(E.warriorAsk(def, st, E.counts.question(st), STORIES).missLast, MISS4[0]);
  st.log.push({ correct: false }, { correct: true }, { correct: false });
  assert.equal(E.warriorAsk(def, st, E.counts.question(st), STORIES).missLast, MISS4[2]);
});

test('the help, for all 55 pairs (E.helpPlan with E.warriorAsk): on sand, Tallyheart’s, in the anchor’s style (9 × 7 tucks, 10 × 3 in pairs, 5 × 8 swipes), its count ending on the answer, its first line one of the anchor’s openings and its last the sitting’s, nothing from the anchor’s own voice', () => {
  for (const flip of [false, true]) {
    const cat = readyCat();
    // (the second time, a sitting at another now: the pairs the other way round for many)
    const s = sit(cat, { at: T0 + (flip ? 77777 : 0), wrong: () => true });
    assert.equal(s.results.length, 55);
    s.results.forEach(({ q, D, res }) => {
      const where = q.a + ' × ' + q.b + ' (anchor ' + q.table + ')';
      const plan = E.helpPlan(s.begin.def, D, q, res), A = E.hollowDef(STORIES, q.table);
      assert.equal(plan.ground, 'sand', where + ': on sand');
      assert.equal(plan.teacher, 'tallyheart', where);
      assert.equal(plan.counter, 'tallyheart', where + ': Tallyheart keeps the count (never the 7s’ helpCounter)');
      assert.equal(plan.says, undefined, where);
      assert.equal(plan.nums[plan.nums.length - 1], q.answer, where + ': the count ends on the answer');
      assert.equal(plan.answer, q.answer);
      const openings = ['helpIntro', 'helpIntroFar', 'helpIntroNotFive', 'helpIntroNotTen', 'helpIntroTens', 'helpIntroOneTuck', 'helpIntroNotNine'].map(k => A[k]).filter(Boolean);
      assert.ok(openings.includes(plan.intro) || (A.helpIntro && plan.intro === A.helpIntro.replace(/^Close\.\s*/, '')), where + ': its first line is the anchor’s (' + plan.intro + ')');
      assert.ok(MISS4.includes(plan.line) || (ten(q) && plan.line === FINALE_MISS), where + ': the sitting’s miss line');
      if (q.table === 9) assert.ok(plan.tuck && plan.style === 'swipe', where + ': the 9s tuck');
      else if (q.table === 10) assert.ok(plan.pair && plan.style === 'swipe', where + ': the 10s in pairs');
      else if (q.table === 5) assert.ok(plan.style === 'swipe' && !plan.pair, where + ': the 5s swipe');
      else assert.ok(!plan.style && !plan.pair && !plan.tuck, where + ': hopped');
      assert.equal(plan.per, q.table, where + ': groups of the anchor (' + plan.groups + ' of ' + plan.per + ')');
      // nothing of the anchor's but its picture and its openings
      ['remembered', 'fastAfterMiss', 'miss', 'again', 'prompt', 'helpCounter', 'firstPrompt', 'done', 'facts', 'label', 'hollowThings'].forEach(k => {
        assert.equal(D[k], s.begin.def[k], where + ': ' + k + ' is the sitting’s, or none');
      });
      assert.equal(D.id, 'warrior');
      assert.equal(D.remembered, STANDIN.counts.remembered);
    });
    const find = (key) => s.results.find(r => qk(r.q) === key);
    assert.ok(E.helpPlan(s.begin.def, find('7x9').D, find('7x9').q, find('7x9').res).tuck, '9 × 7 tucks');
    assert.ok(E.helpPlan(s.begin.def, find('3x10').D, find('3x10').q, find('3x10').res).pair, '10 × 3 in pairs');
    assert.equal(E.helpPlan(s.begin.def, find('5x8').D, find('5x8').q, find('5x8').res).style, 'swipe', '5 × 8 swipes');
    const r = find('3x8');
    assert.deepEqual([r.q.table, r.res.help.groups, r.res.help.per], [3, 8, 3], '3 × 8 is eight patrols of three');
  }
});

test('a 9s answer whose numbers don\'t make nine gets that opening from the first question (the sitting is `shown`); the 5s’ five-or-zero and the 10s’ zero come with their anchors', () => {
  const nines = E.hollowDef(STORIES, 9), fives = E.hollowDef(STORIES, 5), tens = E.hollowDef(STORIES, 10);
  const cat = readyCat();
  const typed = (q) => qk(q) === '4x9' ? 35 : qk(q) === '5x7' ? 34 : qk(q) === '3x10' ? 31 : q.answer + 1;
  const s = sit(cat, { wrong: (q) => ['4x9', '5x7', '3x10'].includes(qk(q)), typed });
  const plan = (key) => { const r = s.results.find(x => qk(x.q) === key); return E.helpPlan(s.begin.def, r.D, r.q, r.res); };
  assert.equal(plan('4x9').intro, nines.helpIntroNotNine, '35 for 4 × 9: the two numbers make nine');
  assert.equal(plan('5x7').intro, fives.helpIntroNotFive, '34 for 5 × 7: five or zero');
  assert.equal(plan('3x10').intro, tens.helpIntroNotTen, '31 for 3 × 10: the zero');
  assert.equal(s.st.shown, true);
});

/* ================================================================ 5. the finale */
test('the finale: for a cat whose last 10 × 10 was right but slow and one who missed it, a right 10 × 10 is her own "A HUNDRED!" (never the remembered line); a missed one says its own line, never "On we go"', () => {
  for (const name of ['tenSlow', 'tenMissed']) {
    const right = sit(kindCat(name)), last = right.results[54];
    assert.ok(ten(last.q), name + ': last');
    assert.equal(last.q.hard, false, name + ': never hard');
    assert.deepEqual(last.res.balloons, HUNDRED, name + ': "A HUNDRED!", the player’s');
    assert.equal(last.res.lineKind, 'right');
    assert.deepEqual(E.promptLines(right.begin.def, last.D, last.q), [{ text: 'At last:', kind: 'caption' }, { who: 'glintstar', text: 'Ten times ten.', kind: undefined }], name + ': "At last:" and "Ten times ten."');
    const missed = sit(kindCat(name), { wrong: (q) => ten(q) }), m = missed.results[54];
    assert.equal(m.res.line, FINALE_MISS, name + ': its own miss line');
    assert.ok(!/On we go/.test(m.res.line));
    assert.equal(m.res.requeued, false);
  }
  // a question before it is Glintstar's few words
  const s = sit(readyCat(), { stop: 1 }), q = s.results[0];
  assert.deepEqual(E.promptLines(s.begin.def, q.D, q.q), [{ who: 'glintstar', text: cap(WORDS[q.q.a]) + ' times ' + WORDS[q.q.b] + '.', kind: undefined }]);
});

test('right answers: mostly nothing, now and then a word (the set\'s praise and fast, with blanks between), her hard facts the remembered line; no "after a miss" lines', () => {
  const cat = history(readyCat(), ['6x7', '4x8']);
  const s = sit(cat, { wrong: (q, i) => i === 2, ms: (q) => (qk(q) === '6x7' ? 2000 : 2500) });
  const right = s.results.filter(r => r.res.correct && !ten(r.q));
  const said = right.filter(r => r.res.line);
  assert.ok(said.length >= 5 && said.length <= 20, 'about one in five gets a word (' + said.length + ' of ' + right.length + ')');
  const hard = right.filter(r => r.q.hard);
  assert.deepEqual(hard.map(r => qk(r.q)).sort(), ['4x8', '6x7']);
  hard.forEach(r => { assert.equal(r.res.lineKind, 'remembered'); assert.equal(r.res.line, 'Last time ' + r.q.a + ' × ' + r.q.b + ' made you stop and think. Not today!'); });
  assert.ok(!right.some(r => /sand|didn’t even/i.test(r.res.line)), 'nothing about the sand after a miss');
  assert.equal(s.begin.def.fastAfterMiss, undefined);
  assert.deepEqual(Object.keys(s.begin.def).sort(), ['ask', 'fast', 'ground', 'id', 'missLast', 'praise', 'remembered', 'rememberedSlow', 'teacher']);
  assert.equal(s.begin.def.table, undefined, 'no table: every answer logs its anchor');
  assert.ok(cat.counts.filter(e => e.set === 'warrior').every(e => typeof e.table === 'number'));
});

/* ================================================================ 6. again */
test('again: a second sitting is a new order; the first\'s misses are tricky and hard; attempts numbered; the crowd until a finished sitting; which not-yet, never counting a set-aside one', () => {
  const cat = readyCat();
  const one = sit(cat, { at: T0, wrong: firstWrong(7) });
  assert.equal(one.st.crowd, true, 'the whole Clan watches her first sitting');
  assert.equal(one.begin.opening.kind, 'first');
  const missed = lastOf(cat).missed.map(p => pk(p[0], p[1]));
  const two = sit(cat, { at: T0 + 3 * HOUR, wrong: firstWrong(8) });
  assert.notDeepEqual(two.st.queue.map(qk), one.st.queue.map(qk), 'a new order');
  assert.equal(two.st.crowd, false, 'quiet after a finished sitting');
  assert.equal(two.begin.opening.kind, 'quiet');
  missed.forEach(k => assert.ok(two.st.queue.find(q => qk(q) === k).hard, k + ': hard, and so tricky'));
  assert.deepEqual(cat.warrior.attempts.map(a => a.n), [1, 2]);
  assert.equal(E.warriorResult(cat, STORIES).variant.nth, 'second');
  // a set-aside sitting is no not-yet, and the crowd stays until one is finished
  const c2 = readyCat('c2');
  sit(c2, { at: T0, stop: 10 });
  const b = E.warriorBegin(c2, STORIES, T0 + 5 * HOUR);
  assert.deepEqual([b.opening.kind, b.opening.aside, b.state.crowd], ['again', 'late', true], 'the Clan gathers again, and Tallyheart says why we start fresh');
  sit(c2, { at: T0 + 5 * HOUR, wrong: firstWrong(9) });
  assert.equal(E.warriorResult(c2, STORIES).variant.nth, 'first', 'her first not-yet, though it is her second sitting');
  assert.deepEqual(c2.warrior.attempts.map(a => [a.n, a.finished]), [[1, false], [2, true]]);
  sit(c2, { at: T0 + 10 * HOUR, wrong: firstWrong(9) });
  sit(c2, { at: T0 + 15 * HOUR, wrong: firstWrong(9) });
  sit(c2, { at: T0 + 20 * HOUR, wrong: firstWrong(9) });
  assert.equal(E.warriorResult(c2, STORIES).variant.nth, 'later');
  assert.equal(E.warriorResult(c2, STORIES).variant.keys.filter(k => /first|second/.test(k)).length, 0, 'the old tom only once');
});

/* ================================================================ 7. the result's variants */
test('the result\'s variants: 55 and 54; 49, 47, 46 and 44, each better and worse than last time (better, close, plain; no number under 45 unless better); after a pass no not-yet, passedAt kept, and a sitting after it never moves it', () => {
  const cat55 = readyCat(); sit(cat55);
  let R = E.warriorResult(cat55, STORIES);
  assert.deepEqual([R.right, R.variant.kind, R.variant.clean, R.variant.quiet, R.variant.keys], [55, 'pass', true, false, ['pass', 'pass.clean']]);
  assert.deepEqual([R.tokens.right, R.tokens.Right, R.missed, R.tricky], ['fifty-five', 'Fifty-five', [], []]);
  const cat54 = readyCat(); sit(cat54, { wrong: firstWrong(1) });
  R = E.warriorResult(cat54, STORIES);
  assert.deepEqual([R.right, R.variant.kind, R.variant.clean, R.variant.keys], [54, 'pass', false, ['pass']]);
  // a not-yet, then this many right
  const then = (last, right) => {
    const cat = readyCat();
    if (last != null) sit(cat, { at: T0, wrong: firstWrong(55 - last) });
    sit(cat, { at: T0 + 3 * HOUR, wrong: firstWrong(55 - right) });
    return E.warriorResult(cat, STORIES);
  };
  const want = {
    // right: [better, not better (worse, or the same), first]
    49: [['better', true], ['close', true], ['close', true]],
    47: [['better', true], ['close', true], ['close', true]],
    46: [['better', true], [null, true], [null, true]],
    44: [['better', true], ['plain', false], ['plain', false]]
  };
  Object.entries(want).forEach(([r, [b, w, f]]) => {
    const right = +r;
    const better = then(right - 3, right), worse = then(Math.min(49, right + 2), right), same = then(right, right), first = then(null, right);
    assert.deepEqual([better.variant.tone, better.variant.number], b, right + ' after ' + (right - 3));
    assert.deepEqual([worse.variant.tone, worse.variant.number], w, right + ' after ' + Math.min(49, right + 2));
    assert.deepEqual([same.variant.tone, same.variant.number], w, right + ' after the same');
    assert.deepEqual([first.variant.tone, first.variant.number], f, right + ' the first time');
    assert.deepEqual([better.last, better.tokens.last, better.tokens.Last], [right - 3, E.countWords(right - 3), cap(E.countWords(right - 3))]);
    assert.equal(better.short, 50 - right);
    assert.equal(worse.tokens.short, E.countWords(50 - right));
    [better, worse, same, first].forEach(x => {
      assert.equal(x.variant.kind, 'notYet');
      assert.ok(x.variant.keys.includes('notYet.' + x.variant.nth));
      assert.equal(x.variant.keys.includes('notYet.number'), x.variant.number);
      if (x.variant.tone) assert.ok(x.variant.keys.includes('notYet.' + x.variant.tone));
      if (right < 45 && x.variant.tone !== 'better') assert.equal(x.variant.number, false, 'no number under 45 unless better');
    });
    assert.equal(first.last, null);
  });
  // after the pass
  const cat = readyCat();
  sit(cat, { at: T0, wrong: firstWrong(8) });
  sit(cat, { at: T0 + 3 * HOUR, wrong: firstWrong(3) });
  R = E.warriorResult(cat, STORIES);
  assert.deepEqual([R.variant.kind, R.variant.quiet, R.variant.keys], ['pass', true, ['pass', 'pass.quiet']], 'a pass in a quiet sitting: the Clan comes running');
  const passedAt = cat.warrior.passedAt;
  assert.ok(passedAt > T0 + 3 * HOUR);
  sit(cat, { at: T0 + 30 * HOUR, wrong: firstWrong(20) });
  R = E.warriorResult(cat, STORIES);
  assert.deepEqual([R.variant.kind, R.variant.nth, R.variant.tone, R.variant.number, R.variant.keys], ['afterPass', null, null, false, ['afterPass']], 'never a not-yet after the pass; 35 right: no number (decision 49)');
  assert.equal(lastOf(cat).passed, false, 'its own mark kept as it was');
  sit(cat, { at: T0 + 35 * HOUR, wrong: firstWrong(3) });
  R = E.warriorResult(cat, STORIES);
  assert.deepEqual([R.variant.kind, R.variant.number, R.variant.keys, R.tokens.Right], ['afterPass', true, ['afterPass', 'afterPass.number'], 'Fifty-two'], '52 after the pass: a passing score, good news, her number');
  sit(cat, { at: T0 + 40 * HOUR });
  R = E.warriorResult(cat, STORIES);
  assert.deepEqual([R.variant.kind, R.variant.clean, R.variant.keys], ['afterPass', true, ['afterPass', 'afterPass.clean']], 'a clean sweep like {Murmur}chime’s');
  assert.equal(cat.warrior.passedAt, passedAt, 'passedAt never moves');
  assert.equal(lastOf(cat).passed, true);
  assert.equal(E.warriorState(cat, STORIES, T0 + 41 * HOUR).notYet, false);
});

test('the tricky Counts and the six shown: each missed pair counts for both its numbers (a square once); the one or two with the most are named, ties to the one taught later, never the 1s; the named Counts\' misses first', () => {
  const tricky = (keys) => {
    const cat = readyCat();
    sit(cat, { wrong: (q) => keys.includes(qk(q)) });
    return E.warriorResult(cat, STORIES);
  };
  let R = tricky(['7x8', '6x7']);
  assert.deepEqual(R.tricky, [7, 8], '7 × 8 and 6 × 7: the 7s, then the 8s (taught after the 6s)');
  assert.equal(R.tokens.tricky, 'the 7s and the 8s');
  assert.equal(R.tokens.Tricky, 'The 7s and the 8s');
  R = tricky(['7x7']);
  assert.deepEqual(R.tricky, [7], 'one Count');
  R = tricky(['1x1', '1x3']);
  assert.deepEqual(R.tricky, [3], 'never the 1s');
  R = tricky(['1x1']);
  assert.deepEqual(R.tricky, []);
  assert.equal(R.tokens.tricky, '');
  R = tricky(['3x4', '3x6', '4x6', '2x2', '2x5', '1x5', '5x5', '9x9']);
  assert.deepEqual(R.tricky, [5, 4], 'the 5s (three), then the 4s over the 3s and the 6s (all two): the 4s are taught last of them');
  assert.equal(R.missed.length, 6, 'six shown');
  const named = R.missed.filter(p => p.includes(5) || p.includes(4)).length;
  assert.equal(named, 5, 'the named Counts’ misses first');
  assert.ok(R.missed.slice(0, 5).every(p => p.includes(5) || p.includes(4)));
  // within each, a pair with a 1 last: 1 × 5 (a slip more than a tricky one) after the 5s’ and 4s’ real misses
  assert.deepEqual(R.missed.slice(0, 5).map(p => p.includes(1)), [false, false, false, false, true], R.missed.map(p => p.join('x')).join(' '));
  R = tricky(['1x8', '8x9', '1x3', '6x7', '4x9', '2x2', '3x3']);
  assert.ok(R.missed.findIndex(p => p.includes(1)) > R.missed.findIndex(p => !p.includes(1)), 'never a 1s pair ahead of a real miss in its group: ' + R.missed.map(p => p.join('x')).join(' '));
  const groups = [R.missed.filter(p => R.tricky.some(t => p.includes(t))), R.missed.filter(p => !R.tricky.some(t => p.includes(t)))];
  groups.forEach(g => { const k = g.findIndex(p => p.includes(1)); if (k >= 0) assert.ok(g.slice(k).every(p => p.includes(1)), 'the 1s last in a group'); });
});

test('after the pass, her number is said exactly when it is good news (decision 49): every sitting again from 0 to 54 right says it only at 50 or more; 55 is clean, its own words', () => {
  const cat = readyCat('again');
  sit(cat, { at: T0 });
  const passedAt = cat.warrior.passedAt;
  let t = T0 + 3 * HOUR;
  for (let right = 0; right <= 55; right++) {
    sit(cat, { at: t, wrong: firstWrong(55 - right) });
    t += 3 * HOUR;
    const R = E.warriorResult(cat, STORIES), v = R.variant;
    assert.equal(R.right, right);
    assert.equal(v.kind, 'afterPass', right + ': after the pass');
    assert.equal(v.number, right >= 50 && right < 55, right + ': number');
    assert.equal(v.keys.includes('afterPass.number'), right >= 50 && right < 55, right + ': afterPass.number');
    assert.equal(v.clean, right === 55);
    assert.equal(v.tone, null);
  }
  assert.equal(cat.warrior.passedAt, passedAt, 'never moves');
});

/* ================================================================ 8. the pause */
test('the pause, through the store: within two hours a sitting picks up at the same question, queue and paws; after, it is an unfinished attempt (aside: late) and a new one starts; one Hollow answer in between sets it aside too (practice), a Hollow visit with no answer does not', () => {
  const store = E.createStore(memStorage());
  const save = E.newSave();
  const cat = readyCat('paused');
  save.cats.push(cat); save.current = cat.id;
  const s = sit(cat, { at: T0, stop: 20 });
  store.save(save);
  let back = E.currentCat(store.load());
  assert.deepEqual(back, clone(cat), 'through the store unchanged');
  let ws = E.warriorState(back, STORIES, s.t + 90 * MIN);
  assert.deepEqual([ws.sitting.answered, ws.sitting.paw, ws.stale], [20, 2, null]);
  assert.deepEqual(ws.sitting.paws, [1, 6 / 14, 0, 0]);
  // a Hollow visit, no answer
  E.hollowLines(back, STORIES, { now: s.t + MIN });
  E.hollowRound(back);
  const b = E.warriorBegin(back, STORIES, s.t + 119 * MIN);
  assert.deepEqual(b.state.queue.map(qk), s.st.queue.map(qk), 'the same queue');
  assert.deepEqual([b.state.pos, b.opening.kind, b.opening.aside], [20, 'resume', null], 'the same question, “Where were we? Ah, yes.”');
  assert.deepEqual(E.warriorPaws(b.state), E.warriorPaws(s.st), 'the same paws');
  assert.equal(back.warrior.attempts.length, 0);
  // (picked up at +119 min: the two hours run from when she was last there, so two hours after her last
  // answer it is still hers; two hours after the pick-up, it is stale)
  store.save({ version: 2, cats: [back], current: back.id, settings: { readAloud: false, bigText: false } });
  back = E.currentCat(store.load());
  assert.equal(back.warrior.sitting.at, s.t + 119 * MIN, 'the pick-up is saved as her last time there');
  ws = E.warriorState(back, STORIES, s.t + 2 * HOUR);
  assert.deepEqual([ws.sitting && ws.sitting.answered, ws.stale], [20, null], 'two hours after her last answer, a minute after the pick-up: still hers');
  const away = s.t + 119 * MIN + 2 * HOUR;
  ws = E.warriorState(back, STORIES, away);
  assert.deepEqual([ws.sitting, ws.stale], [null, 'late'], 'no "Keep going" for a stale sitting');
  const late = E.warriorBegin(back, STORIES, away);
  assert.deepEqual(back.warrior.attempts.map(a => [a.n, a.finished, a.answered, a.passed, a.aside, a.seen]), [[1, false, 20, false, 'late', true]]);
  assert.deepEqual([late.state.pos, late.opening.kind, late.opening.aside, late.state.crowd], [0, 'again', 'late', true], 'a new sitting, the Clan again, "It’s been a while, so we start fresh."');
  // one Hollow answer in between
  const c2 = readyCat('practiced');
  const s2 = sit(c2, { at: T0, stop: 30 });
  const h = E.hollowStart(c2, STORIES, s2.t + 5 * MIN, 7);
  c2.lesson = { mode: 'hollow', state: h.state };
  const hq = E.counts.question(h.state);
  E.logAnswer(c2, E.counts.answer(h.state, h.def, hq.answer, 2000, s2.t + 6 * MIN).entry);
  assert.equal(E.warriorState(c2, STORIES, s2.t + 7 * MIN).stale, 'practice');
  assert.equal(E.hollowLines(c2, STORIES, { now: s2.t + 7 * MIN }).waiting, undefined, 'the Hollow no longer says the Counts are waiting');
  const p = E.warriorBegin(c2, STORIES, s2.t + 10 * MIN);
  assert.deepEqual([lastOf(c2).aside, lastOf(c2).answered, p.opening.aside, p.state.pos], ['practice', 30, 'practice', 0], '"You’ve been practicing, so we start fresh."');
  assert.equal(c2.lesson.state, h.state, 'the Hollow round is where it was');
  // an empty sitting set aside is dropped
  const c3 = readyCat('empty');
  E.warriorBegin(c3, STORIES, T0);
  const again = E.warriorBegin(c3, STORIES, T0 + 3 * HOUR);
  assert.deepEqual([c3.warrior.attempts.length, again.opening.kind], [0, 'first'], 'a sitting set aside with no answer is no attempt');
  // picked up before its first answer: its own opening again
  const c4 = readyCat('opened');
  E.warriorBegin(c4, STORIES, T0);
  assert.equal(E.warriorBegin(c4, STORIES, T0 + 30 * MIN).opening.kind, 'first', 'she never misses the rule');
  // a chapter read again in between is practice too (any set that is not the sitting's), not only a Hollow round
  const c5 = readyCat('chapter-practice');
  const s5 = sit(c5, { at: T0, stop: 10 });
  c5.counts.push(entry('ch02-ears', 2, 5, true, 2000, s5.t + MIN));
  assert.equal(E.warriorState(c5, STORIES, s5.t + 2 * MIN).stale, 'practice', 'a chapter’s Counts answer since');
  E.warriorBegin(c5, STORIES, s5.t + 3 * MIN);
  assert.equal(lastOf(c5).aside, 'practice');
  // the edges between practice and a late return: an answer elsewhere two hours on, or the next day, is
  // after the pause was over: late ("It’s been a while"), never practice
  const c6 = readyCat('edge-two-hours');
  const s6 = sit(c6, { at: T0, stop: 10 });
  c6.counts.push(entry('hollow-3s', 3, 4, true, 2000, s6.t + 2 * HOUR));
  assert.equal(E.warriorState(c6, STORIES, s6.t + 2 * HOUR + MIN).stale, 'late', 'an answer exactly two hours on');
  const c7 = readyCat('edge-next-day');
  const s7 = sit(c7, { at: T0, stop: 10 });
  c7.counts.push(entry('hollow-3s', 3, 4, true, 2000, s7.t + 20 * HOUR));
  E.warriorBegin(c7, STORIES, s7.t + 20 * HOUR + MIN);
  assert.equal(lastOf(c7).aside, 'late', 'a Hollow round the next day, then the Counts: late');
  // one minute inside the two hours: practice
  const c8 = readyCat('edge-inside');
  const s8 = sit(c8, { at: T0, stop: 10 });
  c8.counts.push(entry('hollow-3s', 3, 4, true, 2000, s8.t + 2 * HOUR - MIN));
  assert.equal(E.warriorState(c8, STORIES, s8.t + 2 * HOUR - 30000).stale, 'practice');
});

test('picked up, the two hours run from the pick-up (her coming back counts as being there): a sitting picked up late in its two hours takes her next answer, never sent to the hub; one with no answer, picked up, keeps its place; practice after the pick-up still sets it aside', () => {
  const cat = readyCat('picked-late');
  const s = sit(cat, { at: T0, stop: 20 });
  const b = E.warriorBegin(cat, STORIES, s.t + 118 * MIN);
  assert.deepEqual([b.opening.kind, b.state.pos, cat.warrior.sitting.at], ['resume', 20, s.t + 118 * MIN], '“Where were we? Ah, yes.”, and the pick-up is her last time there');
  let ws = E.warriorState(cat, STORIES, s.t + 121 * MIN);
  assert.deepEqual([ws.stale, ws.sitting && ws.sitting.answered], [null, 20], 'three minutes on (two hours and one after her last answer): still hers');
  // her answer then goes into the same sitting, as the page puts it in (E.counts.answer, E.warriorKeep)
  const q = E.counts.question(b.state), D = E.warriorAsk(b.def, b.state, q, STORIES);
  const res = E.counts.answer(b.state, D, q.answer, 3000, s.t + 121 * MIN);
  E.logAnswer(cat, res.entry);
  E.warriorKeep(cat, b.state, s.t + 121 * MIN);
  assert.deepEqual([cat.warrior.sitting.state.pos, cat.warrior.attempts.length], [21, 0]);
  assert.equal(E.warriorBegin(cat, STORIES, s.t + 125 * MIN).state, b.state, 'the same sitting');
  // the edge, from the last time she was there: one minute inside, hers; two hours, set aside late
  assert.equal(E.warriorState(cat, STORIES, s.t + 125 * MIN + 2 * HOUR - MIN).stale, null);
  assert.equal(E.warriorState(cat, STORIES, s.t + 125 * MIN + 2 * HOUR).stale, 'late');
  // no answer yet: picked up at 1 h 59 min, its opening plays again; at 2 h 1 min it is the same sitting,
  // so she never hears that opening twice for one sitting
  const c2 = readyCat('opened-late');
  const first = E.warriorBegin(c2, STORIES, T0);
  const again = E.warriorBegin(c2, STORIES, T0 + 119 * MIN);
  assert.deepEqual([again.state === first.state, again.opening.kind], [true, 'first']);
  assert.equal(E.warriorState(c2, STORIES, T0 + 121 * MIN).stale, null);
  assert.equal(E.warriorBegin(c2, STORIES, T0 + 121 * MIN).state, first.state);
  // practice after a pick-up: set aside (nothing between her last answer and the pick-up was skipped:
  // a pick-up means no other Counts answer came in since)
  const c3 = readyCat('picked-then-practice');
  const s3 = sit(c3, { at: T0, stop: 10 });
  E.warriorBegin(c3, STORIES, s3.t + 60 * MIN);
  c3.counts.push(entry('hollow-3s', 3, 4, true, 2000, s3.t + 61 * MIN));
  assert.equal(E.warriorState(c3, STORIES, s3.t + 62 * MIN).stale, 'practice');
  // through the store: the pick-up's time is saved (E.migrate keeps the sitting's `at`)
  const store = E.createStore(memStorage()), save = E.newSave();
  save.cats.push(c2); save.current = c2.id;
  store.save(save);
  assert.equal(E.currentCat(store.load()).warrior.sitting.at, T0 + 121 * MIN);
});

/* The merge's review (2026-10-31): practice is told by clock stamps alone, so a device clock set back after she
 * played (her chapter answers stamped an hour after the device's `now`) made every new sitting stale as
 * 'practice' from its first answer: the page sent her to the hub at every answer, and she could not take the
 * Counts until the clock passed those stamps. A sitting's `at` is never earlier than her latest answer. */
test('a device clock set back after she played (her chapter answers stamped after `now`): a new sitting starts no earlier than her latest answer, so it takes her answers and picks up; a real Hollow answer stamped after it still sets it aside as practice; late runs two hours from the later time', () => {
  const ahead = T0 + HOUR;
  const setBack = () => {
    const c = readyCat('clock-set-back');
    c.counts.push(entry('ch09-eights', 7, 8, true, 2000, ahead - MIN), entry('ch09-eights', 8, 8, true, 2000, ahead));
    return c;
  };
  const cat = setBack();
  const s = sit(cat, { at: T0, stop: 3 });
  assert.equal(cat.warrior.sitting.at, ahead, 'begun and kept at her latest answer, never before it');
  let ws = E.warriorState(cat, STORIES, s.t + MIN);
  assert.deepEqual([ws.stale, ws.sitting && ws.sitting.answered], [null, 3], 'still hers: three answers in');
  const b = E.warriorBegin(cat, STORIES, s.t + 2 * MIN);
  assert.deepEqual([b.state === s.st, b.opening.kind, b.state.pos], [true, 'resume', 3], 'picked up, the same sitting');
  // and through the store, as the page keeps it
  const store = E.createStore(memStorage()), save = E.newSave();
  save.cats.push(cat); save.current = cat.id;
  store.save(save);
  const back = E.currentCat(store.load());
  assert.equal(back.warrior.sitting.at, ahead);
  assert.equal(E.warriorState(back, STORIES, s.t + 3 * MIN).stale, null);
  // a real Hollow answer stamped after her stamps: practice, as ever
  cat.counts.push(entry('hollow-3s', 3, 4, true, 2000, ahead + 5 * MIN));
  assert.equal(E.warriorState(cat, STORIES, s.t + 6 * MIN).stale, 'practice');
  // late: two hours from the later of the two (her latest answer here), not from the device's `now`
  const c2 = setBack();
  sit(c2, { at: T0, stop: 3 });
  assert.equal(E.warriorState(c2, STORIES, T0 + 2 * HOUR + 30 * MIN).stale, null);
  assert.equal(E.warriorState(c2, STORIES, ahead + 2 * HOUR).stale, 'late');
  // a clock that was never set back: the sitting's `at` is her last answer's time, as before
  const c3 = readyCat('clock-right');
  const s3 = sit(c3, { at: T0, stop: 3 });
  assert.equal(c3.warrior.sitting.at, s3.t);
});

test('a sitting with no answer yet is not one in progress: E.warriorState offers none to pick up, and the Hollow does not say it is waiting; E.warriorBegin still picks it up within its two hours and plays its opening; one answer, and it is', () => {
  const cat = readyCat('no-answer-yet');
  const b = E.warriorBegin(cat, STORIES, T0);
  let ws = E.warriorState(cat, STORIES, T0 + 5 * MIN);
  assert.deepEqual([ws.sitting, ws.stale, ws.sat], [null, null, true]);
  assert.equal(E.hollowLines(cat, STORIES, { now: T0 + 5 * MIN }).waiting, undefined, 'setting it aside loses nothing');
  const again = E.warriorBegin(cat, STORIES, T0 + 10 * MIN);
  assert.deepEqual([again.state === b.state, again.opening.kind], [true, 'first'], 'the same sitting, its own opening again');
  const q = E.counts.question(b.state);
  const res = E.counts.answer(b.state, E.warriorAsk(b.def, b.state, q, STORIES), q.answer, 3000, T0 + 12 * MIN);
  E.logAnswer(cat, res.entry);
  E.warriorKeep(cat, b.state, T0 + 12 * MIN);
  ws = E.warriorState(cat, STORIES, T0 + 13 * MIN);
  assert.deepEqual([ws.sitting.answered, ws.sitting.paw], [1, 1]);
  assert.equal(E.hollowLines(cat, STORIES, { now: T0 + 13 * MIN }).waiting, E.WARRIOR_WAITING);
  // stale with no answer: still told (`stale`), so a page left open on its opening goes to the hub
  const c2 = readyCat('no-answer-stale');
  E.warriorBegin(c2, STORIES, T0);
  assert.deepEqual([E.warriorState(c2, STORIES, T0 + 2 * HOUR).sitting, E.warriorState(c2, STORIES, T0 + 2 * HOUR).stale], [null, 'late']);
});

test('the opening says why the sitting before it was set aside, once, and its own reason (`st.aside`, put there by E.warriorBegin): late, then a sitting with no answer dropped for practice, says “practice”; one with no answer picked up says its own again; after a finished attempt none; the first opening never', () => {
  const cat = readyCat('asides');
  const s1 = sit(cat, { at: T0, stop: 5 });
  const b2 = E.warriorBegin(cat, STORIES, s1.t + 3 * HOUR);
  assert.deepEqual([b2.opening.kind, b2.opening.aside, b2.state.aside, cat.warrior.attempts.length], ['again', 'late', 'late', 1]);
  // picked up before its first answer: its opening again, with its own reason
  const b2b = E.warriorBegin(cat, STORIES, s1.t + 3 * HOUR + 10 * MIN);
  assert.deepEqual([b2b.state === b2.state, b2b.opening.kind, b2b.opening.aside], [true, 'again', 'late']);
  // she leaves at its first question and answers in the Hollow: that sitting, with no answer, is dropped
  // (never recorded) for practice, and the next opening says so, not the older 'late'
  const t = s1.t + 3 * HOUR + 20 * MIN;
  const h = E.hollowStart(cat, STORIES, t, 7);
  cat.lesson = { mode: 'hollow', state: h.state };
  const hq = E.counts.question(h.state);
  E.logAnswer(cat, E.counts.answer(h.state, h.def, hq.answer, 2000, t + MIN).entry);
  const b3 = E.warriorBegin(cat, STORIES, t + 5 * MIN);
  assert.deepEqual([b3.opening.kind, b3.opening.aside, b3.state.aside, cat.warrior.attempts.length], ['again', 'practice', 'practice', 1]);
  // through the store, the reason stays with the sitting
  const store = E.createStore(memStorage()), save = E.newSave();
  save.cats.push(cat); save.current = cat.id;
  store.save(save);
  const back = E.currentCat(store.load());
  assert.equal(back.warrior.sitting.state.aside, 'practice');
  assert.equal(E.warriorOpen(back, back.warrior.sitting.state).aside, 'practice');
  // finished (picked up at once, all 55): the next sitting says none
  const s4 = sit(cat, { at: t + 5 * MIN });
  assert.equal(s4.st, b3.state, 'the same sitting, finished');
  const b5 = E.warriorBegin(cat, STORIES, s4.t + HOUR);
  assert.deepEqual([b5.opening.kind, b5.opening.aside, b5.state.aside], ['quiet', null, null]);
  // the first opening never says one: an empty sitting dropped late is no attempt, and she had begun nothing
  const c2 = readyCat('first-dropped');
  E.warriorBegin(c2, STORIES, T0);
  const f2 = E.warriorBegin(c2, STORIES, T0 + 3 * HOUR);
  assert.deepEqual([f2.opening.kind, f2.opening.aside, f2.state.aside, c2.warrior.attempts.length], ['first', null, 'late', 0]);
  // a sitting saved before the key existed: the last attempt's reason, as before
  const old = clone(b2.state);
  delete old.aside;
  assert.equal(E.warriorOpen(cat, Object.assign(old, { log: [] })).aside, null, 'the last attempt here is finished: none');
  const c3 = readyCat('old-save');
  c3.warrior = { sitting: null, attempts: [{ n: 1, at: T0, done: T0 + 1, finished: false, answered: 3, right: 3, passed: false, missed: [], ms: 3000, seen: true, aside: 'late' }], passedAt: 0 };
  assert.equal(E.warriorOpen(c3, old).aside, 'late');
});

test('the last answer in, never recorded: inside and after the two hours, one finished attempt (never set aside), and 50 right passes; settled by E.warriorState, E.warriorBegin and the store alike', () => {
  for (const later of [MIN, 3 * HOUR, 30 * 24 * HOUR]) {
    const make = () => { const cat = readyCat('unrecorded'); const s = sit(cat, { at: T0, wrong: firstWrong(5), noRecord: true }); return { cat, s }; };
    let { cat, s } = make();
    assert.ok(E.counts.done(cat.warrior.sitting.state), 'the sitting is done and kept');
    assert.equal(cat.warrior.attempts.length, 0);
    const ws = E.warriorState(cat, STORIES, s.t + later);
    assert.deepEqual(cat.warrior.attempts.map(a => [a.finished, a.right, a.passed, a.aside, a.done]), [[true, 50, true, undefined, s.t]], 'E.warriorState: one finished attempt, timed by its last answer');
    assert.deepEqual([cat.warrior.sitting, ws.passed, ws.unseen, cat.warrior.passedAt], [null, true, true, s.t]);
    ({ cat, s } = make());
    const b = E.warriorBegin(cat, STORIES, s.t + later);
    assert.deepEqual(cat.warrior.attempts.map(a => [a.finished, a.passed]), [[true, true]], 'E.warriorBegin');
    assert.deepEqual([b.state.pos, b.opening.kind], [0, 'quiet']);
    ({ cat, s } = make());
    const store = E.createStore(memStorage());
    store.save({ version: 2, cats: [cat], current: cat.id, settings: {} });
    const back = E.currentCat(store.load());
    assert.deepEqual(back.warrior.attempts.map(a => [a.finished, a.right, a.passed]), [[true, 50, true]], 'the store, on load');
    assert.deepEqual([back.warrior.sitting, back.warrior.passedAt], [null, s.t]);
    assert.deepEqual(E.migrate({ cats: [back] }).cats[0], back, 'and once settled, settled');
  }
});

test('the pauses: after the 14th answer, the halfway page after the 28th, after the 42nd; each once a sitting, even picked up; never after the last; the paws fill a little at every answer, a miss the same as a right one', () => {
  const cat = readyCat();
  const s = sit(cat, { wrong: (q, i) => i % 3 === 0 });
  assert.deepEqual(s.beats, [14, 28, 42]);
  assert.deepEqual(s.st.beats, [14, 28, 42]);
  // picked up right after a pause: never twice
  const c2 = readyCat('p2');
  const a = sit(c2, { stop: 14 });
  assert.deepEqual(a.beats, [14]);
  const b = E.warriorBegin(c2, STORIES, a.t + MIN);
  assert.equal(E.warriorBeat(b.state), 0, 'not again');
  // peek only looks
  const st = { pos: 28, queue: new Array(55).fill({ a: 1, b: 1 }), log: [], beats: [] };
  assert.equal(E.warriorBeat(st, { peek: true }), 28);
  assert.deepEqual(st.beats, []);
  assert.equal(E.warriorBeat(st), 28);
  assert.equal(E.warriorBeat(st), 0);
  assert.equal(E.warriorBeat({ pos: 55, queue: st.queue, log: [], beats: [] }), 0, 'never after the last answer');
  // the paws: 14, 14, 14 and 13
  const paws = (n) => E.warriorPaws({ pos: n, queue: st.queue });
  assert.deepEqual(paws(0), [0, 0, 0, 0]);
  assert.deepEqual(paws(7), [0.5, 0, 0, 0]);
  assert.deepEqual(paws(14), [1, 0, 0, 0]);
  assert.deepEqual(paws(42), [1, 1, 1, 0]);
  assert.deepEqual(paws(55), [1, 1, 1, 1]);
  for (let n = 1; n <= 55; n++) {
    const p = paws(n), q = paws(n - 1);
    assert.ok(p.some((x, i) => x > q[i]) && p.every((x, i) => x >= q[i]), 'every answer fills a little, and full ones stay full (' + n + ')');
  }
  assert.deepEqual(E.warriorPaws(null), [0, 0, 0, 0]);
});

/* ================================================================ 9. the slots */
test('the slots: random walks through a chapter lesson parked in its place, Hollow rounds and sittings, with reloads and time passing: nothing lost; a sitting never writes `lesson`, `places`, `hollowWaiting` or `lessons`', () => {
  const ch02 = PC.story.ch02, frame = Object.keys(ch02.frames).find(id => ch02.frames[id].counts && ch02.frames[id].counts.set === 'ch02-ears');
  const seenKinds = { finished: 0, aside: 0, passed: 0, resumed: 0 };
  for (let seed = 1; seed <= 8; seed++) {
    const rnd = E.util.rng(seed * 104729);
    const store = E.createStore(memStorage());
    let save = E.newSave();
    const first = readyCat('walker');
    const L = E.chapterLesson(first, ch02, 'ch02-ears', T0, STORIES);
    first.places = { ch02: { frame, history: [], lesson: { mode: 'chapter', frame, chapter: 'ch02', state: L.state } } };
    save.cats.push(first); save.current = first.id;
    store.save(save);
    save = store.load();
    const parked = clone(E.currentCat(save).places);
    const sittingDef = E.warriorDef(STORIES);
    let t = T0, warriorAnswers = 0, hollowAnswers = 0;
    const reload = (where) => {
      const before = clone(save);
      store.save(save);
      save = store.load();
      assert.deepEqual(clone(save), before, where + ': a reload changes nothing');
    };
    // episodes: a run of sitting answers, a run of Hollow answers, time going by; reloads anywhere
    for (let ep = 0; ep < 50; ep++) {
      const r = rnd(), where = 'seed ' + seed + ', episode ' + ep;
      if (r < 0.45) {
        const n = 1 + Math.floor(rnd() * 60);
        for (let k = 0; k < n; k++) {
          const cat = E.currentCat(save);
          const keep = clone({ lesson: cat.lesson, places: cat.places, hollowWaiting: cat.hollowWaiting, lessons: cat.lessons });
          const b = E.warriorBegin(cat, STORIES, t), st = b.state;
          if (b.opening.kind === 'resume') seenKinds.resumed++;
          const q = E.counts.question(st), res = E.counts.answer(st, E.warriorAsk(sittingDef, st, q, STORIES), rnd() < 0.08 ? q.answer + 1 : q.answer, 1000 + rnd() * 6000, t);
          E.logAnswer(cat, res.entry); warriorAnswers++;
          if (res.done) E.recordLesson(cat, st); else { E.warriorKeep(cat, st, t); E.warriorBeat(st); }
          if (rnd() < 0.3) E.warriorSeen(cat);
          E.warriorState(cat, STORIES, t); E.warriorResult(cat, STORIES); E.hollowLines(cat, STORIES, { now: t });
          assert.deepEqual(clone({ lesson: cat.lesson, places: cat.places, hollowWaiting: cat.hollowWaiting, lessons: cat.lessons }), keep, where + ': the sitting keeps to its own slot');
          t += 2000 + Math.floor(rnd() * 12000);
          if (rnd() < 0.08) reload(where);
          if (res.done) break;
        }
      } else if (r < 0.7) {
        const n = 1 + Math.floor(rnd() * 12);
        for (let k = 0; k < n; k++) {
          const cat = E.currentCat(save);
          let round = E.hollowRound(cat);
          if (!round) {
            const tables = E.learnedCounts(cat, STORIES).map(c => c.table), table = tables[Math.floor(rnd() * tables.length)];
            cat.lesson = round = { mode: 'hollow', state: E.hollowStart(cat, STORIES, t, table).state };
          }
          const st = round.state, q = E.counts.question(st);
          const res = E.counts.answer(st, E.hollowDef(STORIES, st.table), rnd() < 0.2 ? q.answer + 1 : q.answer, 1000 + rnd() * 6000, t);
          E.logAnswer(cat, res.entry); hollowAnswers++;
          if (res.done) E.recordLesson(cat, st); else cat.lesson = { mode: 'hollow', state: st };
          t += 3000 + Math.floor(rnd() * 9000);
          if (rnd() < 0.1) reload(where);
        }
      } else if (r < 0.85) t += Math.floor(rnd() * 5 * HOUR);
      else reload(where);
    }
    const cat = E.currentCat(save), W = cat.warrior;
    const inLog = cat.counts.filter(e => e.set === 'warrior').length;
    const kept = W.attempts.reduce((n, a) => n + a.answered, 0) + (W.sitting ? W.sitting.state.log.length : 0);
    if (cat.counts.length < E.LOG_CAP) {
      assert.equal(inLog, warriorAnswers, 'seed ' + seed + ': every sitting answer is in the log');
      assert.equal(cat.counts.filter(e => /^hollow-/.test(e.set)).length, hollowAnswers, 'seed ' + seed + ': every Hollow answer');
    }
    if (W.attempts.length < E.WARRIOR_KEEP) assert.equal(kept, warriorAnswers, 'seed ' + seed + ': every sitting answer in an attempt or the sitting, once');
    assert.deepEqual(cat.places, parked, 'the parked chapter lesson where it was');
    assert.equal(cat.hollowWaiting, null);
    seenKinds.finished += W.attempts.filter(a => a.finished).length;
    seenKinds.aside += W.attempts.filter(a => a.aside).length;
    seenKinds.passed += W.attempts.filter(a => a.passed).length;
  }
  assert.ok(seenKinds.finished && seenKinds.aside && seenKinds.passed && seenKinds.resumed, 'the walks finished sittings, passed, set some aside and picked some up: ' + JSON.stringify(seenKinds));
});

/* ================================================================ 10. the Hollow */
// (a not-yet has six misses at least: four of the 1s beside them, which are never named)
const ONES = ['1x1', '1x2', '1x3', '1x4'];
test('the Hollow after a not-yet missing 7 × 8 and 6 × 7: the 7s\' round asks both at 2 to 4 and the greeting names the 7s and the 8s, with a paw on each; right and quick there, they leave E.warriorHard, and the paws and the greeting go with them', () => {
  const cat = readyCat();
  sit(cat, { wrong: (q) => ['7x8', '6x7'].concat(ONES).includes(qk(q)) });
  assert.equal(lastOf(cat).right, 49);
  assert.deepEqual(E.warriorResult(cat, STORIES).tricky, [7, 8]);
  const t = T0 + 2 * HOUR;
  // (the result not seen yet, a page closed after the 55th answer: the Hollow gives nothing away before
  // Glintstar says it, its plain greeting and no paws; the result's Hollow button marks it seen first)
  let H = E.hollowLines(cat, STORIES, { now: t });
  assert.equal(lastOf(cat).seen, false);
  assert.equal(H.greet, 'Which Count today? A full round earns a treasure for your nest.', 'an unseen not-yet: the plain greeting');
  assert.ok(H.counts.every(c => !('tricky' in c)) && !('tricky' in H), 'and no paws');
  assert.ok(E.warriorSeen(cat));
  H = E.hollowLines(cat, STORIES, { now: t });
  assert.equal(H.greet, 'The 7s and the 8s first? I’ve got the tricky ones ready.');
  assert.deepEqual(H.tricky, [7, 8]);
  assert.deepEqual(H.counts.filter(c => c.tricky).map(c => c.table), [8, 7]);
  assert.ok(H.counts.filter(c => !c.tricky).every(c => !('tricky' in c)), 'the key only when true');
  assert.equal(H.waiting, undefined);
  assert.equal(E.hollowLines(cat, STORIES, { reward: true, now: t }).greet, 'Another round? I’ve got all evening.', 'after a round, her reward line');
  const r7 = E.hollowStart(cat, STORIES, t, 7);
  const early = r7.state.queue.slice(1, 4).filter(q => q.hard).map(qk).sort();
  assert.deepEqual(early, ['6x7', '7x8'], 'both at 2 to 4');
  assert.ok(E.hollowStart(cat, STORIES, t, 8).state.queue.slice(1, 4).some(q => q.hard && qk(q) === '7x8'), 'the 8s lead with 7 × 8');
  // a quick right 7 × 8 in the Hollow: the 8s' paw goes
  cat.counts.push(entry('hollow-8s', 8, 7, true, 1800, t + 1000));
  H = E.hollowLines(cat, STORIES, { now: t + 2000 });
  assert.equal(H.greet, 'The 7s first? I’ve got the tricky one ready.', 'one pair left in the 7s (6 × 7): the tricky one');
  assert.deepEqual(H.counts.filter(c => c.tricky).map(c => c.table), [7]);
  // and 6 × 7: no paw, no tricky greeting
  cat.counts.push(entry('hollow-7s', 6, 7, true, 1900, t + 3000));
  H = E.hollowLines(cat, STORIES, { now: t + 4000 });
  assert.equal(H.greet, 'Which Count today? A full round earns a treasure for your nest.');
  assert.ok(H.counts.every(c => !('tricky' in c)) && !('tricky' in H));
  assert.ok(!E.warriorHard(cat, STORIES).some(p => p.includes(7) || p.includes(8)), 'nothing of the 7s or the 8s hard any more');
  // slow is still hard: a slow right 6 × 7 keeps the 7s' paw, a quick one takes it off
  const c2 = readyCat('slow'), at = T0 + 3 * HOUR;
  sit(c2, { wrong: (q) => ['6x7', '1x5'].concat(ONES).includes(qk(q)) });
  E.warriorSeen(c2);
  assert.deepEqual(E.hollowLines(c2, STORIES, { now: at }).tricky, [7, 4], '6 × 7 and the 1s: the 7s, then the 4s (one miss each for the 2s to the 7s; the 4s taught after the 2s, 3s, 5s and 6s)');
  c2.counts.push(entry('hollow-7s', 6, 7, true, 6000, at));
  assert.deepEqual(E.hollowLines(c2, STORIES, { now: at + 1 }).tricky, [7, 4], 'a slow right 6 × 7 is still hard: the 7s keep their paw');
  c2.counts.push(entry('hollow-7s', 7, 6, true, 2000, at + 2));
  const H2 = E.hollowLines(c2, STORIES, { now: at + 3 });
  assert.deepEqual([H2.tricky, H2.greet], [[4], 'The 4s first? I’ve got the tricky one ready.'], 'a quick one takes it off; the 4s’ 1 × 4 is still hard: one pair, the tricky one');
  // passed: no paws, even after a sitting again that did not pass (never a not-yet after the pass)
  const c3 = readyCat('passed');
  sit(c3, { wrong: (q) => ['7x8', '6x7'].includes(qk(q)) });
  assert.ok(c3.warrior.passedAt > 0);
  assert.equal(E.hollowLines(c3, STORIES, { now: T0 + 3 * HOUR }).tricky, undefined, 'after a pass, the Hollow as it was');
  sit(c3, { at: T0 + 4 * HOUR, wrong: (q) => ['7x8', '6x7', '6x8', '4x7', '3x7', '7x9', '8x9'].concat(ONES).includes(qk(q)) });
  assert.equal(lastOf(c3).passed, false, 'a sitting again under 50');
  const H3 = E.hollowLines(c3, STORIES, { now: T0 + 6 * HOUR });
  assert.deepEqual([H3.tricky, H3.greet], [undefined, 'Which Count today? A full round earns a treasure for your nest.'], 'passed: no paws, no tricky greeting');
});

/* The Hollow of chapters 1 to 9 as built (since the merge onto chapter 9, 2026-10-31): nine Counts, the 8s
 * the last, and no button for the 7s until chapter 10 teaches them. The result names the 7s and the 8s (its
 * tables are her misses'), and the Hollow marks only the Counts it has: a paw on the 8s, the greeting about
 * them alone. In the game the Counts open after chapter 10, so its Hollow has the 7s too; this is the tree's
 * own Hollow, and the Safari tool's test cat's. */
test('the Hollow with nine Counts (chapters 1 to 9 as built): after a not-yet missing 7 × 8 and 6 × 7, a paw on chapter 9’s 8s alone and the greeting names them, the 8s’ round leads with 7 × 8; right and quick there, the paw and the greeting go', () => {
  const cat = E.blankCat({ now: 1, id: 'nine-counts' });
  cat.name = 'Minnow';
  UPTO9.forEach(s => { cat.finished[s.id] = 1; });
  cat.finished.ch10 = 1;
  E.countSets(UPTO9).forEach(c => { cat.lessons[c.setId] = { set: c.setId, mode: 'chapter', answers: 10, correct: 10, fast: 10, facts: 10, firstTry: 10, helped: 0, noHelp: true, finished: true }; });
  sit(cat, { stories: UPTO9, wrong: (q) => ['7x8', '6x7'].concat(ONES).includes(qk(q)) });
  assert.equal(lastOf(cat).right, 49);
  assert.deepEqual(E.warriorResult(cat, UPTO9).tricky, [7, 8], 'the result: the 7s and the 8s (two misses in the 7s, one in the 8s)');
  E.warriorSeen(cat);
  const t = T0 + 2 * HOUR;
  let H = E.hollowLines(cat, UPTO9, { now: t });
  assert.deepEqual(H.counts.map(c => c.table), [1, 2, 5, 10, 9, 3, 6, 4, 8], 'nine Counts');
  assert.deepEqual(H.counts.filter(c => c.tricky).map(c => c.table), [8], 'a paw on the 8s, the only Count of the two it has');
  assert.deepEqual(H.tricky, [8]);
  assert.equal(H.greet, 'The 8s first? I’ve got the tricky one ready.', 'one missed pair in the 8s (7 × 8)');
  const r8 = E.hollowStart(cat, UPTO9, t, 8);
  assert.equal(r8.def.id, 'hollow-8s');
  assert.ok(r8.state.queue.slice(1, 4).some(q => q.hard && qk(q) === '7x8'), 'the 8s lead with 7 × 8');
  cat.counts.push(entry('hollow-8s', 8, 7, true, 1800, t + 1000));
  H = E.hollowLines(cat, UPTO9, { now: t + 2000 });
  assert.equal(H.greet, 'Which Count today? A full round earns a treasure for your nest.', 'nothing marked in the Counts it has');
  assert.ok(H.counts.every(c => !('tricky' in c)) && !('tricky' in H));
});

test('the tricky greeting after a round: the reward line keeps its place (“Another round?”), unless the page asks for the greeting (`tricky`: the first Hollow page after a round she went back to from a not-yet); with nothing marked, the reward line either way', () => {
  const cat = readyCat('reward');
  sit(cat, { wrong: (q) => ['7x8', '6x7'].concat(ONES).includes(qk(q)) });
  assert.equal(E.hollowLines(cat, STORIES, { reward: true, tricky: true, now: T0 + 2 * HOUR }).greet, 'Another round? I’ve got all evening.', 'unseen: not yet');
  E.warriorSeen(cat);
  const t = T0 + 2 * HOUR;
  assert.equal(E.hollowLines(cat, STORIES, { reward: true, now: t }).greet, 'Another round? I’ve got all evening.');
  const H = E.hollowLines(cat, STORIES, { reward: true, tricky: true, now: t });
  assert.equal(H.greet, 'The 7s and the 8s first? I’ve got the tricky ones ready.');
  assert.deepEqual(H.tricky, [7, 8]);
  assert.equal(E.hollowLines(cat, STORIES, { tricky: true, now: t }).greet, H.greet, 'and with no round before, as always');
  // nothing marked any more: the reward line, `tricky` or not
  cat.counts.push(entry('hollow-8s', 8, 7, true, 1800, t + 1000), entry('hollow-7s', 6, 7, true, 1900, t + 2000));
  assert.equal(E.hollowLines(cat, STORIES, { reward: true, tricky: true, now: t + 3000 }).greet, 'Another round? I’ve got all evening.');
  // a cat with no Counts: `tricky` changes nothing
  const plain = readyCat('none');
  assert.deepEqual(E.hollowLines(plain, STORIES, { reward: true, tricky: true }), E.hollowLines(plain, STORIES, { reward: true }));
});

test('the Hollow while a sitting is paused: the waiting line before she picks a Count, until it goes stale (two hours, or a practice answer)', () => {
  const cat = readyCat();
  const s = sit(cat, { stop: 10 });
  const H = E.hollowLines(cat, STORIES, { now: s.t + MIN });
  assert.equal(H.waiting, 'Your Warrior Counts are waiting at the fountain. Finish them first, or practice now and start them fresh later.');
  assert.equal(H.greet, 'Which Count today? A full round earns a treasure for your nest.', 'the greeting as it was: no not-yet yet');
  assert.equal(E.hollowLines(cat, STORIES, { now: s.t + 2 * HOUR }).waiting, undefined, 'stale: not waiting any more');
  assert.equal(E.hollowLines(cat, STORIES).waiting, H.waiting, 'without a clock, a sitting with no practice since is waiting');
  cat.counts.push(entry('hollow-3s', 3, 4, true, 2000, s.t + 2 * MIN));
  assert.equal(E.hollowLines(cat, STORIES, { now: s.t + 3 * MIN }).waiting, undefined, 'one practice answer: start them fresh later');
});

/* ================================================================ 11. opening */
test('opening: closed before chapter 10 is finished, open after; a stand-in Ceremony (`opensWhen: \'warrior\'`) closed (E.upNext null) until the pass, then next; an unseen result comes first', () => {
  const cat = readyCat();
  delete cat.finished.ch10;
  let ws = E.warriorState(cat, STORIES, T0);
  assert.deepEqual([ws.open, ws.passed, ws.sat, ws.sitting, ws.unseen, ws.last], [false, false, false, null, false, null]);
  assert.ok(!('warrior' in cat), 'reading the state stores nothing');
  assert.equal(E.upNext(cat, STORIES).id, 'ch10');
  cat.finished.ch10 = 2;
  ws = E.warriorState(cat, STORIES, T0);
  assert.equal(ws.open, true);
  assert.equal(E.upNext(cat, WITH_CEREMONY), null, 'the Ceremony waits: the big button is free');
  assert.equal(E.isOpen(cat, CH11, WITH_CEREMONY), false);
  const p = E.progress(cat, WITH_CEREMONY);
  assert.deepEqual([p.next, p.soon], [null, null], 'no chapter, no "coming soon"');
  sit(cat, { wrong: firstWrong(10) });
  assert.equal(E.isOpen(cat, CH11, WITH_CEREMONY), false, 'a not-yet opens nothing');
  ws = E.warriorState(cat, STORIES, T0 + HOUR);
  assert.deepEqual([ws.unseen, ws.notYet, ws.sat, ws.last.right], [true, true, true, 45], 'the result first on the hub, until seen');
  assert.equal(E.warriorSeen(cat), true);
  assert.equal(E.warriorSeen(cat), false, 'seen once');
  ws = E.warriorState(cat, STORIES, T0 + HOUR);
  assert.deepEqual([ws.unseen, ws.notYet], [false, true], '"Try again whenever you like"');
  sit(cat, { at: T0 + 5 * HOUR });
  assert.equal(E.isOpen(cat, CH11, WITH_CEREMONY), true, 'passed: the Ceremony opens');
  assert.equal(E.upNext(cat, WITH_CEREMONY).id, 'ch11');
  assert.equal(E.chapters(WITH_CEREMONY).filter(s => !E.isOpen(cat, s, WITH_CEREMONY)).length, 0);
  ws = E.warriorState(cat, STORIES, T0 + 6 * HOUR);
  assert.deepEqual([ws.passed, ws.unseen, ws.notYet], [true, true, false]);
  // a finished Ceremony stays open (read again), passed or not
  const c2 = readyCat('c2');
  c2.finished.ch11 = 3;
  assert.equal(E.isOpen(c2, CH11, WITH_CEREMONY), true);
  // the opening's kinds
  const c3 = readyCat('c3');
  assert.deepEqual(E.warriorBegin(c3, STORIES, T0).opening, { kind: 'first', aside: null, crowd: true });
  assert.ok(isFinite(c3.updated) && c3.updated === T0);
});

test('a sitting\'s paw on the hub ("Keep going · third paw"), the attempts and the last for the corner; E.warriorState settles a done sitting first', () => {
  const cat = readyCat();
  const s = sit(cat, { stop: 30 });
  const ws = E.warriorState(cat, STORIES, s.t + MIN);
  assert.deepEqual([ws.sitting.answered, ws.sitting.paw, ws.sitting.at], [30, 3, s.t]);
  assert.deepEqual(E.warriorState(cat, STORIES, s.t + 3 * HOUR).stale, 'late');
  ws.attempts.push('x');
  assert.equal(cat.warrior.attempts.length, 0, 'a copy');
});

/* ================================================================ 12. migration */
test('migration: every version-1 fixture save migrates as before, with no `warrior` key, idempotently', () => {
  for (const [name, save] of Object.entries(V1SAVES)) {
    const m = E.migrate(clone(save));
    m.cats.forEach(c => assert.ok(!('warrior' in c), name + '/' + c.id + ': no warrior key'));
    assert.deepEqual(E.migrate(clone(m)), m, name + ': idempotent');
    m.cats.forEach(c => assert.deepEqual(Object.keys(c).sort(), Object.keys(E.blankCat({ id: 'k' })).sort(), name + ': blankCat’s keys, no more'));
  }
});

test('migration: the goldens\' end cats (the chapter-7 golden\'s twelve readings) migrate as before, with no `warrior` key, idempotently, and through the store unchanged', () => {
  const { runs } = golden();
  runs.forEach(r => {
    const cat = clone(r.end);
    assert.ok(!('warrior' in cat), r.name);
    const m = E.migrate({ version: 2, cats: [cat], current: cat.id, settings: { readAloud: false, bigText: false } });
    assert.deepEqual(m.cats[0], cat, r.name + ': migrates to itself');
    assert.deepEqual(E.migrate(clone(m)), m, r.name + ': idempotent');
    const store = E.createStore(memStorage());
    store.save(m);
    assert.deepEqual(store.load(), m, r.name + ': through the store');
  });
});

function sampleWarriorCat(id) {
  const cat = readyCat(id);
  sit(cat, { at: T0, wrong: firstWrong(9) });
  sit(cat, { at: T0 + 3 * HOUR, stop: 12 });
  E.warriorBegin(cat, STORIES, T0 + 9 * HOUR);
  sit(cat, { at: T0 + 10 * HOUR, wrong: firstWrong(2) });
  sit(cat, { at: T0 + 20 * HOUR, stop: 25 });
  return cat;
}
test('migration: a cat with `warrior` goes through the store unchanged (a passed one, with a set-aside attempt and a sitting partway), idempotently', () => {
  const cat = sampleWarriorCat('sat');
  assert.deepEqual(cat.warrior.attempts.map(a => [a.n, a.finished, a.passed, a.aside || null]), [[1, true, false, null], [2, false, false, 'late'], [3, true, true, null]]);
  assert.equal(cat.warrior.sitting.state.log.length, 25);
  const save = { version: 2, cats: [cat], current: cat.id, settings: { readAloud: true, bigText: false } };
  const m = E.migrate(clone(save));
  assert.deepEqual(m, clone(save));
  assert.deepEqual(E.migrate(clone(m)), m);
  const store = E.createStore(memStorage());
  store.save(save);
  assert.deepEqual(store.load(), clone(save));
});

test('migration: junk is dropped (not an object: no key; a bad sitting: null; bad attempts out; a stored `passed` kept; `passedAt` never lost)', () => {
  const good = sampleWarriorCat('junk');
  const mig = (w) => { const c = clone(good); c.warrior = w; return E.migrate({ cats: [c] }).cats[0]; };
  [5, 'yes', [], null, true].forEach(w => assert.ok(!('warrior' in mig(w)), JSON.stringify(w) + ': no key'));
  assert.deepEqual(mig({}).warrior, { sitting: null, attempts: [], passedAt: 0 });
  const S = good.warrior.sitting;
  const bad = (f) => { const s = clone(S); f(s); return mig(Object.assign(clone(good.warrior), { sitting: s })).warrior.sitting; };
  assert.deepEqual(bad(() => {}), clone(S), 'a good sitting kept');
  assert.equal(bad(s => { s.at = 'later'; }), null, 'a non-number at');
  assert.equal(bad(s => { delete s.at; }), null);
  assert.equal(bad(s => { s.state.queue.pop(); }), null, 'a short queue');
  assert.equal(bad(s => { s.state.queue[3] = clone(s.state.queue[4]); }), null, 'a repeated pair');
  assert.equal(bad(s => { s.state.queue[3] = { a: s.state.queue[3].b, b: s.state.queue[3].a }; s.state.queue[4] = { a: 11, b: 1 }; }), null, 'a pair out of 1 to 10');
  assert.equal(bad(s => { s.state.queue[0].a = 2.5; }), null);
  assert.equal(bad(s => { delete s.state.beats; }), null, 'no beats');
  assert.equal(bad(s => { s.state.beats = ['14']; }), null, 'bad beats');
  assert.equal(bad(s => { s.state.mode = 'hollow'; }), null, 'not a warrior sitting');
  assert.equal(bad(s => { s.state.pos = 99; }), null, 'E.okLesson says no');
  assert.equal(bad(s => { s.state = null; }), null);
  assert.equal(mig(Object.assign(clone(good.warrior), { sitting: 'x' })).warrior.sitting, null);
  // attempts
  const A = good.warrior.attempts;
  const w = mig({ sitting: null, passedAt: 0, attempts: [5, null, { right: 'x', at: 1 }, { right: 56, at: 1 }, { right: -1, at: 1 }, { right: 40 }, { right: 40, at: 'x' }].concat(clone(A)) }).warrior;
  assert.deepEqual(w.attempts, clone(A), 'bad attempts out, good ones kept as they were');
  assert.equal(w.passedAt, A[2].done, 'passedAt from the first passed attempt’s done when it is missing');
  const kept = mig({ attempts: [{ n: 1, at: 5, done: 9, finished: true, answered: 55, right: 40, passed: true, missed: [], ms: 3000, seen: true }, { n: 2, at: 10, done: 20, finished: true, answered: 55, right: 52, passed: false, missed: [], ms: 3000, seen: true }], passedAt: 0 }).warrior;
  assert.deepEqual(kept.attempts.map(a => a.passed), [true, false], 'a stored passed is kept as stored (a later change to the mark never rewrites history)');
  assert.equal(kept.passedAt, 9);
  const sparse = mig({ attempts: [{ right: 51, at: 100, missed: [[7, 8], [0, 3], [7], 'x', [11, 2], [3, 3]], aside: 'bored', seen: 'no', finished: true }, { right: 30, at: 200, n: 'two' }] }).warrior;
  assert.deepEqual(sparse.attempts, [
    { n: 1, at: 100, done: 100, finished: true, answered: 55, right: 51, passed: true, missed: [[7, 8], [3, 3]], ms: null, seen: true },
    { n: 2, at: 200, done: 200, finished: false, answered: 30, right: 30, passed: false, missed: [], ms: null, seen: true }
  ], 'the shape filled in: passed recomputed only when missing, bad pairs out, seen true, no bad aside');
  assert.equal(sparse.passedAt, 100);
  assert.deepEqual(mig({ attempts: [{ right: 20, at: 1, aside: 'late', finished: false }], passedAt: 0 }).warrior.attempts[0].aside, 'late');
  assert.equal(mig({ attempts: [], passedAt: 12345 }).warrior.passedAt, 12345, 'passedAt never lost');
  assert.equal(mig({ attempts: clone(A), passedAt: -4 }).warrior.passedAt, A[2].done);
  assert.equal(mig({ attempts: clone(A), passedAt: 'x' }).warrior.passedAt, A[2].done);
  const many = mig({ attempts: Array.from({ length: 130 }, (_, i) => ({ n: i + 1, at: i, done: i, finished: true, answered: 55, right: 30, passed: false, missed: [], ms: 1, seen: true })) }).warrior;
  assert.deepEqual([many.attempts.length, many.attempts[0].n, many.attempts[99].n], [100, 31, 130], 'the last 100');
  // every result of these is itself a fixed point
  [mig({}), kept, sparse, many].forEach(x => { const c = clone(good); c.warrior = x.warrior || x; const once = E.migrate({ cats: [c] }); assert.deepEqual(E.migrate(clone(once)), once); });
  // a missing `passed` recomputed at exactly 50 right: a pass
  assert.equal(mig({ attempts: [{ right: 50, at: 1, finished: true }] }).warrior.attempts[0].passed, true, '50 right, finished: passed');
  assert.equal(mig({ attempts: [{ right: 49, at: 1, finished: true }] }).warrior.attempts[0].passed, false);
  // a done sitting with a junk log entry, settled at load: its `missed` holds real pairs only, so a second
  // migrate changes nothing (section 6)
  const jc = readyCat('junk-log');
  sit(jc, { at: T0, wrong: firstWrong(3), noRecord: true });
  jc.warrior.sitting.state.log[0].a = '7';
  const once = E.migrate({ cats: [clone(jc)] });
  assert.equal(once.cats[0].warrior.attempts.length, 1, 'settled on load');
  assert.ok(once.cats[0].warrior.attempts[0].missed.every(p => p.every(n => Number.isInteger(n) && n >= 1 && n <= 10)), JSON.stringify(once.cats[0].warrior.attempts[0].missed));
  assert.deepEqual(E.migrate(clone(once)), once, 'idempotent');
});

/* The merge's review (2026-10-31, saves): two hand-edited saves let the engine invent `warrior` data that chapter
 * 9's engine never sees. A `__proto__` key in a cat with no `finished` (version 1's path, whose copy makes it the
 * cat's prototype) is never hers: `warrior` is read as her own key only, as every other key is. And a saved
 * lesson whose state is a sitting's (`mode: 'warrior'`) is no lesson (a sitting lives in `warrior`, never
 * `lesson`, `hollowWaiting` or a place): dropped like any bad lesson, so E.recordLesson never takes it for one. */
test('migration: a `__proto__` holding `warrior` makes no Warrior Counts data; a lesson whose state is a sitting\'s is dropped from `lesson`, `hollowWaiting` and a place, never recorded as a sitting', () => {
  const junk = '{"cats":[{"id":"p","__proto__":{"warrior":{"attempts":[{"right":55,"at":1,"finished":true}],"passedAt":5}}}]}';
  const m = E.migrate(JSON.parse(junk)), plain = E.migrate({ cats: [{ id: 'p' }] });
  assert.ok(!Object.prototype.hasOwnProperty.call(m.cats[0], 'warrior') && m.cats[0].warrior === undefined, 'no `warrior`');
  assert.deepEqual(clone(m), clone(plain), 'the plain cat chapter 9’s engine loads');
  assert.equal(E.warriorState(m.cats[0], STORIES, T0).open, false, 'nothing finished: the Counts closed');
  const store = E.createStore(memStorage());
  store.save(JSON.parse(junk));
  assert.ok(!('warrior' in store.load().cats[0]), 'through the store');
  // a chapter lesson whose state says 'warrior', parked as `lesson`, in a place, and a Hollow round as `hollowWaiting`
  const cat = readyCat('lesson-mode-warrior');
  const ch09 = STORIES.find(s => s.id === 'ch09');
  const L = E.chapterLesson(cat, ch09, 'ch09-eights', T0, STORIES);
  const good = { mode: 'chapter', frame: 'f027', chapter: 'ch09', state: clone(L.state) };
  const bad = clone(good); bad.state.mode = 'warrior';
  const hw = { mode: 'hollow', state: clone(E.hollowStart(cat, STORIES, T0, 3).state) };
  const hwBad = clone(hw); hwBad.state.mode = 'warrior';
  const load = (c) => E.migrate({ cats: [c] }).cats[0];
  const c1 = clone(cat); c1.lesson = good; c1.hollowWaiting = hw; c1.places = { ch09: { frame: null, history: [], lesson: good } };
  const k1 = load(c1);
  assert.deepEqual([k1.lesson, k1.hollowWaiting, k1.places.ch09 && k1.places.ch09.lesson], [good, hw, good], 'good lessons kept');
  const c2 = clone(cat); c2.lesson = bad; c2.hollowWaiting = hwBad; c2.places = { ch09: { frame: null, history: [], lesson: bad } };
  const k2 = load(c2);
  assert.deepEqual([k2.lesson, k2.hollowWaiting, k2.places.ch09], [null, null, undefined], 'dropped, as a bad lesson is');
  assert.ok(!('warrior' in k2), 'no `warrior`');
  assert.deepEqual(load(clone(k2)), k2, 'idempotent');
});

test('the last 100 attempts, kept during play too (not only on load): the oldest goes as the 101st is recorded', () => {
  const c = readyCat('cap');
  c.warrior = { sitting: null, attempts: Array.from({ length: 100 }, (_, i) => ({ n: i + 1, at: i + 1, done: i + 1, finished: false, answered: 3, right: 3, passed: false, missed: [], ms: 1, seen: true, aside: 'late' })), passedAt: 0 };
  sit(c, { at: T0 });
  assert.deepEqual([c.warrior.attempts.length, c.warrior.attempts[0].n, lastOf(c).n, lastOf(c).finished], [100, 2, 101, true]);
});

test('migration: four cats on one device (one who never sat, one partway, one passed, one with junk), each her own; the current cat and the settings kept; through the store unchanged once migrated', () => {
  const never = readyCat('never');
  const partway = readyCat('partway'); sit(partway, { at: T0, stop: 33 });
  const passed = readyCat('passed'); sit(passed, { at: T0 + HOUR, wrong: firstWrong(4) });
  const junk = readyCat('junk'); junk.warrior = { sitting: { at: 'x', state: {} }, attempts: [{ right: 'no' }, { right: 47, at: T0, finished: true }], passedAt: null };
  const save = { version: 2, cats: [never, partway, passed, junk], current: 'partway', settings: { readAloud: false, bigText: true } };
  const m = E.migrate(clone(save));
  assert.equal(m.cats.length, 4);
  assert.equal(m.current, 'partway');
  assert.deepEqual(m.settings, save.settings);
  assert.ok(!('warrior' in m.cats[0]));
  assert.deepEqual(m.cats[1], clone(partway));
  assert.deepEqual(m.cats[2], clone(passed));
  assert.deepEqual(m.cats[3].warrior, { sitting: null, attempts: [{ n: 1, at: T0, done: T0, finished: true, answered: 55, right: 47, passed: false, missed: [], ms: null, seen: true }], passedAt: 0 });
  assert.deepEqual(m.cats.map(c => c.id), ['never', 'partway', 'passed', 'junk']);
  assert.deepEqual(E.migrate(clone(m)), m, 'idempotent');
  const store = E.createStore(memStorage());
  store.save(m);
  assert.deepEqual(store.load(), m);
  // a sitting on one cat is never another's
  const b = E.warriorBegin(E.getCat(m, 'never'), STORIES, T0 + 2 * HOUR);
  assert.equal(b.opening.kind, 'first');
  assert.equal(E.getCat(m, 'partway').warrior.sitting.state.log.length, 33);
});

/* ================================================================ 13. chapters 1 to 8 unchanged */
test('chapters 1 to 7 play and render exactly as they shipped with PC.warrior loaded and the Warrior Counts\' engine: the chapter-7 golden, run by run (tests/fixtures/ch07-golden.json)', () => {
  const { G7, runs } = golden();
  const GOLDEN7 = require('./fixtures/ch07-golden.json');
  assert.equal(PC.warrior, STANDIN);
  assert.equal(runs.length, GOLDEN7.runs.length);
  runs.forEach((r, i) => {
    const now = G7.compact7(r), then = GOLDEN7.runs[i].run;
    assert.equal(r.name, GOLDEN7.runs[i].name);
    ['readings', 'hollow', 'teaser', 'tables', 'hub', 'book', 'corner', 'extra', 'cat', 'flags', 'status'].forEach(k => assert.deepEqual(now[k], then[k], r.name + ': ' + k));
    assert.ok(!('warrior' in r.end), r.name + ': no warrior on her cat');
  });
});

test('E.hardFacts gives what chapter 8\'s gave, for every golden cat and for random logs of every kind of answer (the warrior\'s too); E.warriorHard is the same rule over the 54 pairs', () => {
  const { runs } = golden();
  const lists = [undefined, BUILT, STORIES];
  const cats = runs.map(r => r.end);
  // random logs: chapter sets, Hollow rounds, checks, retries, fillers, read-first openers, and sittings
  const sets = [].concat(...BUILT.map(s => Object.keys(s.counts || {}))).concat(['hollow-1s', 'hollow-7s', 'hollow-9s', 'warrior']);
  for (let seed = 1; seed <= 60; seed++) {
    const rnd = E.util.rng(seed), cat = E.blankCat({ id: 'r' + seed });
    let set = sets[0];
    for (let i = 0; i < 40 + seed * 3; i++) {
      if (rnd() < 0.3) set = sets[Math.floor(rnd() * sets.length)];
      const a = 1 + Math.floor(rnd() * 10), b = 1 + Math.floor(rnd() * 10), correct = rnd() < 0.7;
      const e = entry(set, a, b, correct, Math.floor(rnd() * 9000), i);
      if (rnd() < 0.1) e.retry = true;
      if (rnd() < 0.05) e.filler = true;
      if (rnd() < 0.05) e.check = true;
      cat.counts.push(e);
    }
    cats.push(cat);
  }
  cats.forEach((cat, n) => lists.forEach(list => {
    for (let t = 1; t <= 10; t++) assert.deepEqual(E.hardFacts(cat, t, list), OLD.hardFacts(cat, t, list), 'cat ' + n + ', the ' + t + 's');
    const W = E.warriorHard(cat, list);
    assert.ok(!W.some(p => p[0] === 10 && p[1] === 10), 'never 10 × 10');
    for (let t = 1; t <= 10; t++) assert.deepEqual(W.filter(p => p[0] === t || p[1] === t), OLD.hardFacts(cat, t, list).filter(p => !(p[0] === 10 && p[1] === 10)), 'cat ' + n + ': E.warriorHard’s ' + t + 's are E.hardFacts’ (but 10 × 10), in its order');
  }));
});

test('every existing set\'s start state, every Hollow round, the Hollow\'s lines and every chapter\'s opening are what chapter 8\'s engine made, for every golden cat (no `warrior` data)', () => {
  const { runs } = golden();
  runs.forEach(r => {
    const cat = r.end;
    BUILT.forEach(story => Object.keys(story.counts || {}).forEach(setId => {
      const now = clone(E.chapterLesson(clone(cat), story, setId, 5000, BUILT));
      const then = clone(withOldHardFacts(() => E.chapterLesson(clone(cat), story, setId, 5000, BUILT)));
      assert.deepEqual(now, then, r.name + ': ' + setId + '’s start state');
    }));
    E.learnedCounts(cat, BUILT).forEach(c => {
      assert.deepEqual(clone(E.hollowStart(clone(cat), BUILT, 5000, c.table)), clone(withOldHardFacts(() => E.hollowStart(clone(cat), BUILT, 5000, c.table))), r.name + ': the ' + c.table + 's’ round');
    });
    [undefined, { reward: true }, { now: T0 }].forEach(o => assert.deepEqual(clone(E.hollowLines(cat, BUILT, o)), clone(OLD.hollowLines(cat, BUILT, o)), r.name + ': the Hollow’s lines'));
    BUILT.forEach(s => assert.equal(E.isOpen(cat, s, BUILT), OLD.isOpen(cat, s, BUILT), r.name + ': ' + s.id + ' open'));
    STORIES.forEach(s => assert.equal(E.isOpen(cat, s, STORIES), OLD.isOpen(cat, s, STORIES)));
    assert.equal(E.warriorState(clone(cat), STORIES, T0).open, false, r.name + ': the Counts closed before chapter 10');
  });
  // a cat partway through her first sitting reads her chapters' hard facts as any Hollow answers would
  const cat = readyCat();
  sit(cat, { stop: 20, wrong: firstWrong(4) });
  for (let t = 1; t <= 10; t++) assert.deepEqual(E.hardFacts(cat, t, STORIES), OLD.hardFacts(cat, t, STORIES));
});

test('after forty sittings fill the log, every chapter read again still runs to its end, and every Count\'s Hollow round', () => {
  const cat = readyCat('forty');
  BUILT.forEach(s => { cat.finished[s.id] = 1; });
  for (let k = 0; k < 40; k++) sit(cat, { at: T0 + k * 3 * HOUR, wrong: (q, i) => (i + k) % 7 === 0, step: 1000 });
  assert.equal(cat.counts.length, E.LOG_CAP, 'the log is full');
  assert.ok(cat.counts.every(e => e.set === 'warrior'), 'of sittings only: every chapter answer pushed out');
  assert.equal(cat.warrior.attempts.length, 40);
  const script = V1.script({ miss: ['3x1', '2x5', '5x4', '7x10', '9x3', '3x7', '6x4', '4x8'], t: T0 + 200 * HOUR });
  BUILT.forEach(story => {
    E.startChapter(cat, story, script.t += 1000);
    const seen = V1.play(E, story, cat, script);
    assert.equal(E.kindOf(story.frames[seen[seen.length - 1]]), 'end', story.id + ' runs to its end');
    assert.equal(cat.lesson, null, story.id + ': every lesson recorded');
  });
  E.learnedCounts(cat, STORIES).forEach(c => {
    const r = E.hollowStart(cat, STORIES, script.t += 1000, c.table);
    cat.lesson = { mode: 'hollow', state: r.state };
    const rec = V1.runLesson(E, cat, r.def, r.state, { miss: [], ms: 2000, t: script.t });
    assert.ok(rec && rec.hollow && rec.hollow.summary.finished, 'the ' + c.table + 's’ round finishes');
  });
  assert.ok(cat.counts.length <= E.LOG_CAP);
});

/* ================================================================ 14. words */
test('E.countWords: number words from zero to one hundred ("fifty-two"); E.numWord unchanged; the result\'s tokens fill {Right} capitalised and {right} not, before the cat\'s own', () => {
  const want = { 0: 'zero', 1: 'one', 9: 'nine', 12: 'twelve', 13: 'thirteen', 19: 'nineteen', 20: 'twenty', 21: 'twenty-one', 40: 'forty', 45: 'forty-five', 47: 'forty-seven', 49: 'forty-nine',
    50: 'fifty', 52: 'fifty-two', 55: 'fifty-five', 77: 'seventy-seven', 99: 'ninety-nine', 100: 'one hundred' };
  Object.entries(want).forEach(([n, w]) => assert.equal(E.countWords(+n), w));
  const all = [];
  for (let n = 0; n <= 100; n++) { const w = E.countWords(n); all.push(w); assert.match(w, /^([a-z]+(-[a-z]+)?|one hundred)$/, n + ': ' + w); }
  assert.equal(new Set(all).size, 101);
  for (let n = 0; n <= 12; n++) assert.equal(E.countWords(n), E.numWord(n));
  assert.equal(E.numWord(13), '13', 'E.numWord still stops at twelve');
  assert.equal(E.countWords(101), '101');
  assert.equal(E.countWords(2.5), '2.5');
  const cat = readyCat();
  sit(cat, { at: T0, wrong: firstWrong(14) });
  sit(cat, { at: T0 + 3 * HOUR, wrong: firstWrong(9) });
  const R = E.warriorResult(cat, STORIES);
  assert.equal(E.fill('{Right} right today. Fifty is a pass. Last time it was {last}!', cat, R.tokens), 'Forty-six right today. Fifty is a pass. Last time it was forty-one!');
  assert.equal(E.fill('{Last}, then {right}. Just {short} more, {name}paw.', cat, R.tokens), 'Forty-one, then forty-six. Just four more, Minnowpaw.');
  assert.equal(E.fill('{tricky}: {Tricky}.', cat, R.tokens), R.tokens.tricky + ': ' + cap(R.tokens.tricky) + '.');
});

/* ================================================================ the story file, when it is loaded */
test('the story owner\'s PC.warrior (app/story/warrior.js), when loaded: the engine finds its lines (praise, fast, remembered, four miss lines, and 10 × 10\'s under counts.last), and every line it holds fills with the result\'s and the cat\'s tokens, she-cat and tom, with no { left', (t) => {
  if (!REAL) { t.skip('app/story/warrior.js is not loaded in this tree'); return; }
  PC.warrior = REAL;
  try {
    const def = E.warriorDef(STORIES);
    assert.equal(asArray(def.missLast).length, 4, 'four miss lines, in turn');
    ['praise', 'fast', 'remembered', 'rememberedSlow'].forEach(k => assert.ok(def[k] != null, k));
    assert.equal(def.fastAfterMiss, undefined);
    const cat = readyCat('real');
    const s = sit(cat, { wrong: (q) => ten(q) || qk(q) === '7x8' });
    const L = s.results[54];
    assert.ok(Array.isArray(L.q.prompt) && L.q.prompt.some(b => b.kind === 'caption'), '10 × 10’s caption from the story');
    assert.ok(typeof L.res.line === 'string' && L.res.line && !/On we go/.test(L.res.line), '10 × 10’s own miss line');
    const right = sit(readyCat('real2'));
    assert.ok(right.results[54].res.balloons && right.results[54].res.balloons.length, '10 × 10’s shout');
    const R = E.warriorResult(cat, STORIES);
    const strings = [];
    (function walk(x) {
      if (typeof x === 'string') strings.push(x);
      else if (Array.isArray(x)) x.forEach(walk);
      else if (x && typeof x === 'object') Object.keys(x).forEach(k => { if (!['scene', 'board', 'who', 'kind', 'set', 'opts', 'cast', 'shot', 'look', 'overlay', 'by'].includes(k)) walk(x[k]); });
    })({ open: REAL.open, aside: REAL.aside, halfway: REAL.halfway, beats: REAL.beats, pass: REAL.pass, notYet: REAL.notYet, afterPass: REAL.afterPass, counts: REAL.counts });
    assert.ok(strings.length > 20);
    ['she', 'tom'].forEach(sex => {
      const c = clone(cat); c.look.sex = sex;
      const tokens = Object.assign({ a: 7, b: 8 }, R.tokens, { last: 'forty-one', Last: 'Forty-one' });
      strings.forEach(x => { const f = E.fill(x, c, tokens); assert.ok(!/[{}]/.test(f), sex + ': ' + x + ' -> ' + f); });
    });
  } finally { PC.warrior = STANDIN; }
});
function asArray(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
