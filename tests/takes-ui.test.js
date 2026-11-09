/* The take-aways kit, the page (docs/take-aways.md v0.3: sections 1, 2, 6 and 8's UI table; section 9's test 17):
 * node --test
 *
 * What the take page shows and says, checked in Node through PC.ui.takes and the engine, the way app/ui.js's runTakes
 * runs a problem: one digit a box, the column (its heads, its gold marks by the mode, its boxes and their labels), the
 * first column's lettering and the reading order (the prompt, the question in words, the column's line), the stack
 * held through a problem (every stack she types under is one the page measured for its min-height, the echo's room
 * and the echo itself included), the help's stack, the problem's end, the waits, the store's label, plain()'s minus,
 * and every help of section 2's cases and of a small seeded sample drawn by the art (PC.art.sand's `quick`) with the
 * right counts, beside the store picture (PC.art.placeValue) at every column. The page's own wiring, which needs a
 * browser, is pinned as text, as the suite does for the rest of ui.js: the keys ignored until a column is outlined and
 * for 400 ms after every OK, the next column 0.9 s after the last spread lands or at once, the 'tap' page, "Got it!"
 * at the top of the keypad's place, the keypad brought into view, the slot kept after every column, PC.debug.takes,
 * and the take block's CSS. Nothing a player can reach changes: no chapter 1 to 11 has a take set, runLesson is
 * untouched, and index.html without its take block is v23's byte for byte. (The keypad's box at column 1 and column 2,
 * equal with no echo and with chapter 12's stub echo, is measured in WebKit at every size by the page review; here,
 * the stacks that make it so.) The kit's second pass (section 10, step 3) adds the Hollow's shelf, its ‹, a Count the store
 * round on the take page and its reward, the frost treasures' drawings, the grown-ups' table and PC.debug.takes' shelf and
 * store, with phase 2's three fixes (Read to me's order on a 'tap' or 'show' first column, a 'tap' turn saying its top, the
 * phone held sideways's panel on the screen). The review's (2026-11-07): the 'tap' page's lending column a tap target its
 * full height (S1), the gold marks at least 16 px (S2), Count the store's reward on a phone held sideways (S3), the volume
 * kept through One Count at a time (S4), the slash clear of the marks (S5), a late speech `end` never running a step again
 * nor a page that was left (TR1, TR2: wait, hush and timedWait run here on stand-ins), a 'show' first column's wait (TR3),
 * the corner's note, cap and line (CN1's page line, CN3, CN5, CN6), and the kit's words the engine's alone (F3). */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { load, ROOT } = require('./_load.js');
const PC = load();
require(path.join(ROOT, 'app/ui.js'));
const E = PC.engine, T = E.takes, U = PC.ui.takes;
const UI_SRC = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const plan = (a, b) => E.takePlan(a, b);
const DEF = { id: 'take-test', op: '-', teacher: 'tallyheart', picture: { kind: 'store' } };
const PROMPT = 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.';
const ECHO = '¡Trece menos ocho son cinco! ¡Muy bien, amiga!';
function withWords(w, fn) { const was = PC.words; PC.words = w; try { return fn(); } finally { if (was === undefined) delete PC.words; else PC.words = was; } }
// a source function of ui.js, as written (two-space indent)
function fnSrc(src, name) { const i = src.indexOf('  function ' + name + '('); assert.ok(i >= 0, name); return src.slice(i, src.indexOf('\n  }\n', i) + 4); }
// a problem answered right, column by column, through the engine (taps first on a 'tap' turn); `upto` columns
function answer(st, def, upto, clock) {
  for (let k = 0; k < upto; k++) {
    while (T.question(st).tap > 0) T.tap(st);
    const q = T.question(st), c = q.plan.cols[q.col];
    T.digit(st, def, c.blank ? '' : c.digit, 2000, clock.t += 1000);
  }
}

/* ------------------------------------------------------------------ one digit a box, the column, its marks */

test('17. one digit a box: a new digit replaces the one there, Delete empties it, OK is the caller\'s', () => {
  assert.equal(U.press('', '5'), '5');
  assert.equal(U.press('5', '7'), '7');
  assert.equal(U.press('7', 'del'), '');
  assert.equal(U.press('', 'del'), '');
  assert.equal(U.press('7', 'ok'), '7');
  assert.equal(U.press('7', 'x'), '7');
});

test('17. the column: left to right, the heads labelled in words ("hundreds, squares"), each box by its column and what is in it, the outlined one current; the words read at call time', () => {
  const st = T.start(Object.assign({}, DEF, { facts: [[503, 278]] }), { now: 1 }), q = T.question(st);
  const v = U.view(q.plan, { marks: q.marks, boxes: [{ v: '5', cls: '' }], on: 0, ask: 'Five hundred three take away two hundred seventy-eight.' });
  assert.deepEqual(v.cells.map((c) => c.zone), ['hundreds', 'tens', 'ones']);
  assert.deepEqual(v.cells.map((c) => c.headLabel), ['hundreds, squares', 'tens, rows', 'ones, loose']);
  assert.deepEqual(v.cells.map((c) => c.head), ['square', 'line', 'dot']);
  assert.deepEqual(v.cells.map((c) => [c.top, c.bottom]), [['5', '2'], ['0', '7'], ['3', '8']]);
  assert.deepEqual(v.cells.map((c) => c.boxLabel), ['hundreds', 'tens', 'ones: 5']);
  assert.deepEqual(v.cells.map((c) => c.current), [false, false, true]);
  assert.equal(v.cells[2].boxCls, 'on');
  const html = U.html(v);
  assert.match(html, /^<span class="tsign" aria-hidden="true">−<\/span>/, 'the minus sign U+2212 in its own column');
  assert.equal((html.match(/class="thead"/g) || []).length, 3);
  assert.match(html, /class="tbox on" data-col="0" role="img" aria-label="ones: 5" aria-current="true" style="grid-column:4">5<\/span>/);
  assert.match(html, /class="tbox" data-col="2" role="img" aria-label="hundreds" style="grid-column:2"> <\/span>/, 'an empty box keeps its height');
  assert.match(html, /<span class="trule" aria-hidden="true"><\/span>$/);
  // a two-digit bottom under a three-digit top: no bottom digit in the hundreds
  const p2 = plan(815, 69), v2 = U.view(p2, { marks: E.takeMarks(p2, 'hers', {}, 0, 0) });
  assert.deepEqual(v2.cells.map((c) => c.bottom), ['', '6', '9']);
  // the words table, read when drawn (decision 53: a class word changes in one line)
  withWords({ hundreds: 'centenas', squares: 'cuadrados', ones: 'unidades' }, () => {
    const w = U.view(q.plan, { marks: q.marks, boxes: [], on: 0 });
    assert.equal(w.cells[0].headLabel, 'centenas, cuadrados');
    assert.equal(w.cells[2].boxLabel, 'unidades');
  });
});

test('17. the marks lettered per column by the mode: in \'hers\' the lenders struck and a lender\'s value once its own digit is in; in \'show\' every spread lettered (the zero 10, then 9); a help letters the spreads its sand draws', () => {
  const marksOf = (m, p) => U.view(p, { marks: m }).cells.map((c) => (c.struck ? '/' : '') + c.mark);
  const p = plan(503, 278), clock = { t: 1e6 }, D = Object.assign({}, DEF, { facts: [[503, 278]] });
  const st = T.start(D, { now: 1 });
  assert.deepEqual(marksOf(T.question(st).marks, p), ['', '', '']);
  answer(st, DEF, 1, clock);
  assert.deepEqual(marksOf(T.question(st).marks, p), ['/', '/', '/13'], 'the 3 struck with 13 over it, the 5 and the 0 struck, nothing over them');
  answer(st, DEF, 1, clock);
  assert.deepEqual(marksOf(T.question(st).marks, p), ['/', '/9', '/13'], 'the 9 once the tens digit is in');
  const st2 = T.start(D, { now: 1 });
  answer(st2, D, 2, clock);
  const last = T.digit(st2, D, 2, 2000, clock.t += 1000);
  assert.deepEqual(marksOf(last.marks, p), ['/4', '/9', '/13']);
  // 'show': the zero lettered 10 as the square lands, 9 as the row leaves
  const S = E.takeShow(DEF, p, 0, { mode: 'show' });
  assert.deepEqual(S.steps.map((s) => marksOf(s.marks, p)), [['', '', ''], ['/4', '/10', ''], ['/4', '/9', '/13'], ['/4', '/9', '/13']]);
  // a help at the ones ('hers'): its sand drew both spreads, so it letters the 9 and the 4 before her tens
  const st3 = T.start(D, { now: 1 });
  const miss = T.digit(st3, D, 0, 2000, clock.t += 1000);
  assert.equal(miss.slip, 'zero');
  assert.deepEqual(marksOf(miss.marks, p), ['/4', '/9', '/13']);
  // a help that glows: kept at 43 − 16's tens (the struck digit and its gold one glow)
  const h = E.takeHelp(DEF, plan(43, 16), 1, 'kept', { mode: 'hers' });
  assert.equal(h.steps[0].glow, true);
  const v = U.view(plan(43, 16), { marks: h.steps[0].marks, glow: 1 });
  assert.equal(v.cells[0].glow, true);
  assert.match(U.html(v), /class="tmark tglow"/);
  assert.match(U.html(v), /class="tdig ttop tstruck tglow"/);
});

test('17. OK is lit on an empty box only on the leftmost, on every problem (an empty OK there is a 0); the page dims it everywhere else, and on the \'tap\' page', () => {
  [[503, 278], [500, 467], [43, 16], [382, 345]].forEach(([a, b]) => {
    const st = T.start(Object.assign({}, DEF, { facts: [[a, b]] }), { now: 1 }), clock = { t: 1e6 }, n = plan(a, b).n;
    for (let c = 0; c < n; c++) {
      const q = T.question(st);
      assert.equal(q.okEmpty, c === n - 1, a + ' − ' + b + ' column ' + c);
      answer(st, DEF, 1, clock);
    }
  });
  assert.ok(UI_SRC.includes("okKey.disabled = phase === 'tap' || (typed === '' && !(q.okEmpty && on === q.col));"));
  assert.ok(UI_SRC.includes("if (typed === '' && !q.okEmpty) return;"), 'an empty OK elsewhere does nothing');
});

/* ------------------------------------------------------------------ what is lettered and said */

test('17. the first column: the column\'s line joins a prompt of the teacher\'s, else follows it in her own balloon; nothing past a prompt when the line is short; and the reading order is the prompt, the question in words, the column\'s line', () => {
  const st = T.start(Object.assign({}, DEF, { facts: [{ a: 254, b: 131, regroup: 'show', prompt: PROMPT }, [58, 23], [76, 42], { a: 475, b: 132, prompt: 'Count it.' }] }), { now: 1 });
  const q = T.question(st);
  const F = U.first(DEF, q, { intro: [{ who: 'tallyheart', text: E.WARRIOR_WAITING }] });
  assert.deepEqual(F.lines, [{ who: 'tallyheart', text: E.WARRIOR_WAITING }, { who: 'tallyheart', text: PROMPT + ' Ones first. Four take away one.' }]);
  assert.equal(F.joined, true);
  assert.deepEqual(F.heard.map((h) => h.text), [E.WARRIOR_WAITING, PROMPT, 'Two hundred fifty-four take away one hundred thirty-one.', 'Ones first. Four take away one.']);
  // someone else's prompt (chapter 12's store, Glintstar's): the line in Tallyheart's own balloon after it
  const G = U.first(DEF, Object.assign({}, q, { prompt: [{ who: 'glintstar', text: 'Count the store.' }] }));
  assert.deepEqual(G.lines, [{ who: 'glintstar', text: 'Count the store.' }, { who: 'tallyheart', text: 'Ones first. Four take away one.' }]);
  assert.deepEqual(G.heard.map((h) => h.who), ['glintstar', 'tallyheart', 'tallyheart']);
  // no prompt: the line alone, and the question said only, before it
  const clock = { t: 1e6 };
  answer(st, DEF, 3, clock);
  const q2 = T.question(st), N = U.first(DEF, q2);
  assert.deepEqual(N.lines, [{ who: 'tallyheart', text: 'Ones first. Eight take away three.' }]);
  assert.deepEqual(N.heard.map((h) => h.text), ['Fifty-eight take away twenty-three.', 'Ones first. Eight take away three.']);
  // a third problem's short line under a prompt: nothing past the prompt's balloon
  answer(st, DEF, 2, clock); answer(st, DEF, 2, clock);
  const q4 = T.question(st);
  assert.equal(q4.full, false);
  assert.equal(U.colLine(DEF, q4), '');
  assert.deepEqual(U.first(DEF, q4).lines, [{ who: 'tallyheart', text: 'Count it.' }]);
  // a twin: its introduction, then the line (lettered before it)
  const tw = U.first(DEF, Object.assign({}, q2, { twin: '43-16', full: true }));
  assert.deepEqual(tw.lines.map((l) => l.text), ['One like it.', 'Ones first. Eight take away three.']);
  assert.deepEqual(tw.heard.map((l) => l.text), ['One like it.', 'Fifty-eight take away twenty-three.', 'Ones first. Eight take away three.']);
  // the cat's tokens are the page's to fill
  const filled = U.first(DEF, Object.assign({}, q, { prompt: '{name}paw, count it.' }), { fill: (s) => s.replace('{name}', 'Moon') });
  assert.equal(filled.lines[0].text, 'Moonpaw, count it. Ones first. Four take away one.');
});

test('17. the help\'s stack: the slip\'s line stays above the steps; then the counter in a balloon of its own, growing a hop at a time, and the step\'s line; on a phone held sideways with Aa on the counter joins the step\'s line', () => {
  const h = E.takeHelp(DEF, plan(503, 278), 0, 'zero', { mode: 'hers' });
  const at = (i, join) => U.helpStack(h, i, 'tallyheart', join);
  assert.deepEqual(at(0), [{ who: 'tallyheart', text: 'Three take away eight? Not enough loose, and no rows to spread.', glow: false }]);
  assert.deepEqual(at(1).map((l) => l.counter != null ? '[' + l.counter + ']' : l.text), ['Three take away eight? Not enough loose, and no rows to spread.', '[…]', 'So a square first: ten rows.']);
  assert.deepEqual(at(4).map((l) => l.counter != null ? '[' + l.counter + ']' : l.text).slice(1), ['[10]', 'Take three: ten left.']);
  assert.deepEqual(at(5).map((l) => l.counter != null ? '[' + l.counter + ']' : l.text).slice(1), ['[10 · 5]', 'Five more: five left.']);
  assert.deepEqual(at(6).map((l) => l.counter != null ? '[' + l.counter + ']' : l.text).slice(1), ['[10 · 5]', 'Five loose.']);
  assert.equal(at(6).length, 3, 'three balloons');
  assert.deepEqual(at(6, true).slice(1), [{ who: 'tallyheart', text: 'Five loose.', counter: '10 · 5' }], 'the named fallback: two balloons');
  // a help with nothing to count (a column with no bottom digit): no counter
  const n = E.takeHelp(DEF, plan(403, 57), 2, 'kept', { mode: 'hers' });
  assert.ok(n.steps.every((s) => s.n == null));
  assert.equal(U.helpStack(n, n.steps.length - 1, 'tallyheart').length, 2);
});

test('17. the problem\'s end: its one line (a blank praise letters nothing), or its own right lines, which wait for Next; Chispapaw\'s echo after a right problem', () => {
  assert.deepEqual(U.end(DEF, { line: 'Yes!' }), { lines: [{ who: 'tallyheart', text: 'Yes!' }], next: false });
  assert.deepEqual(U.end(DEF, { line: '' }), { lines: [], next: false });
  assert.deepEqual(U.end(DEF, { balloons: [{ text: 'One square, two rows, three loose left.' }] }), { lines: [{ who: 'tallyheart', text: 'One square, two rows, three loose left.' }], next: true });
  assert.deepEqual(U.end(DEF, { line: 'Yes!' }, { echo: { who: 'chispapaw', text: ECHO } }).lines.map((l) => l.who), ['tallyheart', 'chispapaw']);
});

test('17. the waits: a line stays 0.6 s and 0.38 s a word, 1.8 s at the least at a problem\'s end and 1.6 s for a step, a hop 775 ms; Read to me on, said and 0.4 s (a step 0.3 s) more, at most twice as long', () => {
  assert.deepEqual(U.waits('Yes!', 'end'), { read: 1800, after: 400, cap: 3600 });
  assert.deepEqual(U.waits('Five loose.', 'step'), { read: 1600, after: 300, cap: 3200 });
  assert.equal(U.waits('Three take away eight? Not enough loose, and no rows to spread.', 'step').read, 600 + 380 * 12);
  assert.deepEqual(U.waits('Six.', 'hop'), { read: 775, after: 0, cap: 775 });
  assert.deepEqual([U.MS.outline, U.MS.miss, U.MS.ok, U.MS.slide, U.MS.open], [900, 650, 400, 600, 400]);
});

test('17. the panel\'s label says the store in words, what is left; the \'tap\' page\'s hidden button its spread; both from the words table', () => {
  assert.equal(U.storeLabel(E.takePicture(DEF, { a: 503, b: 278 }, 'start')), 'Five squares, three loose');
  assert.equal(U.storeLabel(E.takePicture(DEF, { a: 503, b: 278 }, 'done')), 'Two squares, two rows, five loose');
  assert.equal(U.storeLabel(E.takePicture(DEF, { a: 43, b: 16 }, 'start')), 'Four rows, three loose');
  assert.equal(U.storeLabel(E.takePicture(DEF, { a: 115, b: 13 }, 'start')), 'One square, one row, five loose');
  assert.equal(U.spreadLabel('tens'), 'Spread a row');
  assert.equal(U.spreadLabel('hundreds'), 'Spread a square');
  withWords({ spread: 'break apart' }, () => assert.equal(U.spreadLabel('tens'), 'Break apart a row'));
});

test('17. plain()\'s minus: U+2212 read as the words table\'s "take away", read at call time; no line of chapters 1 to 11 or the Warrior Counts has one', () => {
  assert.equal(U.minus('503 − 278'), '503 take away 278');
  assert.equal(U.minus('7 × 8'), '7 × 8');
  withWords({ takeAway: 'minus' }, () => assert.equal(U.minus('Five − three'), 'Five minus three'));
  // (chapter 12: plain() also drops the engine's marks for Spanish, « and »; no line of chapters 1 to 11 has one: the spanish
  // owner's, tests/spanish.test.js)
  assert.ok(UI_SRC.includes("function plain(s) { return takeMinus(String(s == null ? '' : s).replace(/\\*+/g, '').replace(/×/g, ' times ').replace(/[«»]/g, '')); }"));
  const texts = JSON.stringify(E.chapters(PC.story)) + JSON.stringify(PC.warrior || {});
  assert.equal(texts.indexOf('−'), -1);
});

/* ------------------------------------------------------------------ the keypad stays put */

/* What the page lettered while she typed each column (runTakes: the first column's lettering, an echo over a later
 * column's line, 'show''s last step or 'tap''s line after the taps), problem by problem, through the engine; and the
 * stacks the page measured on the problem's first column (PC.ui.takes.reserve). */
function typedUnder(def, facts, o) {
  o = o || {};
  const st = T.start(Object.assign({}, def, { facts }), { now: 1, logged: 99 }), clock = { t: 1e6 }, out = [];
  let firstAsk = true;
  const echoAt = (q) => (o.echo ? (c) => ({ who: 'chispapaw', text: o.echo(q.plan.cols[c]) }) : false);
  while (!T.done(st)) {
    let q = T.question(st);
    const intro = firstAsk ? (o.intro || []) : [];
    const cands = U.reserve(def, q, { intro, echo: echoAt(q) });
    firstAsk = false;
    for (let c = q.col; c < q.plan.n; c++) {
      q = T.question(st);
      let base;
      if (c === 0) base = U.first(def, q, { intro }).lines;
      else {
        const lt = U.colLine(def, q), echo = o.echo ? [{ who: 'chispapaw', text: o.echo(q.plan.cols[c - 1]) }] : [];
        base = echo.concat(lt ? [{ who: 'tallyheart', text: lt }] : []);
      }
      let shown = base;
      if (q.show) { const S = E.takeShow(def, q.plan, c, { mode: 'show' }); shown = base.concat([{ who: 'tallyheart', text: S.steps[S.steps.length - 1].say }]); }
      if (q.tap) {
        const S = E.takeShow(def, q.plan, c, { mode: 'tap' });
        out.push({ shown: base.concat([{ who: 'tallyheart', text: S.taps[0].say }]), cands, at: q.a + '−' + q.b + ' col ' + c + ' tap' });
        while (T.question(st).tap > 0) T.tap(st);
        const q2 = T.question(st);
        shown = base.concat([{ who: 'tallyheart', text: E.takeLine(def, q2.plan, c, 'after', 'tap', q2.full) }]);
      }
      if (c === 0 && !q.onesFirst) out.push({ shown: U.first(def, q, { intro, line: E.takeFill(E.TAKE_LINES.onesFirst, {}) }).lines, cands, at: q.a + '−' + q.b + ' pointer' });
      out.push({ shown, cands, at: q.a + '−' + q.b + ' col ' + c });
      const cc = q.plan.cols[c];
      T.digit(st, def, cc.blank ? '' : cc.digit, 2000, clock.t += 1000);
    }
  }
  return out;
}
// a stack the page measured holds this one: the same balloons, by the same speakers, each at least as long
function holds(cand, shown) {
  return cand.length === shown.length && cand.every((b, i) => !b.room && b.who === shown[i].who && String(b.text).length >= String(shown[i].text).length);
}

test('17. the keypad stays put: every stack she types under in a problem is one the page measured on its first column (its min-height the tallest of them), with no echo and with a stub echo, its room and the echo itself among them', () => {
  const sets = [
    { facts: [[503, 278], [811, 356], [500, 467], [52, 27], [403, 57]] },
    { facts: [{ a: 702, b: 345, regroup: 'show' }, { a: 604, b: 137, regroup: 'tap' }, [801, 263], [305, 102], [710, 254]] },
    { facts: [{ a: 254, b: 131, regroup: 'show', prompt: PROMPT }, [58, 23], [76, 42], [475, 132], [368, 145]], intro: [{ who: 'tallyheart', text: E.WARRIOR_WAITING }] },
    { facts: [{ a: 43, b: 16, regroup: 'show' }, { a: 70, b: 34, regroup: 'tap' }, [85, 39], [97, 52], [486, 253]] },
    { facts: [{ a: 526, b: 254, regroup: 'tap' }, { a: 400, b: 156, regroup: 'tap' }, { a: 600, b: 248, regroup: 'show' }] }
  ];
  let n = 0;
  sets.forEach((s) => [null, (c) => ECHO, (c) => '¡' + E.numberWords(c.at) + ' menos ' + E.numberWords(c.bottom || 0) + '!'].forEach((echo) => {
    typedUnder(DEF, s.facts, { intro: s.intro, echo }).forEach((u) => {
      assert.ok(u.cands.some((c) => holds(c, u.shown)), u.at + (echo ? ' (echo)' : '') + ': ' + JSON.stringify(u.shown));
      n++;
    });
    if (echo) {
      // the echo's room (Chispapaw's two lines) stands in every later column's measure
      const q = T.question(T.start(Object.assign({}, DEF, { facts: s.facts }), { now: 1 }));
      const R = U.reserve(DEF, q, { echo: true });
      assert.ok(R.some((L) => L[0] && L[0].room), 'the room');
    }
  }));
  assert.ok(n > 150, n + ' stacks');
  // no echo hook (every chapter before 12): no room, nothing reserved for it
  const q = T.question(T.start(Object.assign({}, DEF, { facts: [[503, 278]] }), { now: 1 }));
  assert.ok(U.reserve(DEF, q, {}).every((L) => L.every((b) => !b.room)));
});

test('17. the keypad stays put, in the page: the stack\'s min-height set on the first column from those stacks and released at the problem\'s end; the marks and heads rows reserved; the column top-aligned sideways; the fallbacks set before she types', () => {
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("      takeReserve(def, q, { intro: firstAsk ? firstIntro : [], fill: fill, echo: echoAt, taught: st.taught }).forEach(function (L) {"));
  assert.ok(page.includes("      if (max) stack.style.minHeight = max + 'px';"));
  // each candidate's height to the next whole pixel, never offsetHeight's rounding: a stack 0.11 px over its held height
  // moved the keypad a pixel between two columns (take:q and take:echo at 1024 x 768, Aa on, the sweep's keypad-moved)
  assert.ok(page.includes("      var tall = function () { return Math.ceil(stack.getBoundingClientRect().height - 0.01); };\n      var was = stack.innerHTML, max = tall();"));
  assert.ok(page.includes('        max = Math.max(max, tall());'));
  assert.ok(!page.slice(page.indexOf('    function reserve() {'), page.indexOf('    function echoInfo(')).includes('stack.offsetHeight'), 'no offsetHeight in reserve()');
  assert.ok(page.includes("      stack.innerHTML = '';\n      reserve();\n      outline(true);\n      fit();\n      bringPad();"), 'measured on the first column, then the fallbacks, then the keypad into view');
  assert.ok(page.includes("      phase = 'end'; echoLines = []; on = -1; glowCol = -1;\n      stack.style.minHeight = '';"), 'released at the problem\'s end');
  assert.ok(HTML.includes('grid-template-rows:var(--th) max(.54em,17px) 1em 1em 10px auto'), 'every row of the column reserved from the start (the marks\' at least 17px)');
  assert.ok(HTML.includes('.frame[data-mode="take"] .col{align-self:start}'));
  assert.ok(HTML.includes('html:has(.frame[data-mode="take"]){overflow-anchor:none}'), 'a scrolled page keeps its scroll when the stack changes');
});

/* ------------------------------------------------------------------ the page's wiring, pinned as text */

test('17. keys ignored until the next column is outlined and for 400 ms after every OK; the next column 0.9 s after the last spread lands, or at once with no spread (after the echo\'s time); a tap draws the end at once', () => {
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("      if (phase !== 'type' || now() < padLockedUntil) return;"), 'a key outside a typing column does nothing');
  assert.ok(page.includes('      padLockedUntil = now() + TAKE_MS.ok;'));
  assert.ok(page.includes("      var e = echoOf(echoInfo(res.col)), d = spread && !hurry ? TAKE_MS.outline : 0;"));
  assert.ok(page.includes('      if (!d && !e) return next();'), 'at once with no spread and no echo');
  assert.ok(page.includes("return timedWait(heard(echoLines), 'step', d ? function () { wait(next, d); } : next); }\n      wait(next, d);"), 'the echo\'s time, then the 0.9 s');
  assert.ok(page.includes("      advance = function () { hurry = true; landNow(); };"), 'a tap during a spread draws its end');
  assert.ok(page.includes("          padLockedUntil = now() + TAKE_MS.ok;   // the double-tap guard after \"Got it!\""));
  assert.ok(page.includes("      wait(function () { help(res); }, TAKE_MS.miss);"));
  // and the engine's own guard: a second OK at the tens within 400 ms never answers an empty hundreds
  const def = Object.assign({}, DEF, { facts: [[475, 132]] }), st = T.start(def, { now: 1 });
  T.digit(st, def, 3, 2000, 10000);
  T.digit(st, def, 4, 2000, 11000);
  assert.deepEqual(T.digit(st, def, '', 0, 11200), { ignored: 'guard' });
  assert.equal(T.question(st).col, 2, 'the hundreds still asked');
  const st2 = T.start(def, { now: 1 });
  assert.deepEqual(T.digit(st2, def, '', 0, 10000), { ignored: 'empty' }, 'an empty OK on a box that is not the leftmost asks nothing');
});

test('17. the \'tap\' page: the keypad dim, the tap target the glowing zone (the panel\'s full height there) or the lending digit, a tap elsewhere "up here", a digit wiggles, Space and the hidden button spread', () => {
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("      pad.classList.remove('away'); pad.classList.add('dim');"));
  assert.ok(page.includes("'<button class=\"sr\" id=\"tspread\" type=\"button\" hidden></button></div>'"));
  assert.ok(page.includes('      spreadBtn.textContent = takeSpreadLabel(cur.glow); spreadBtn.hidden = false;'));
  assert.ok(page.includes("      var rs = art.querySelectorAll('.pc-zone');"), 'the art\'s zones, hit by x alone: the panel\'s full height');
  assert.ok(page.includes("      var w = TAKE_ZONES.indexOf(tapWant), wb = tcol.querySelector('.tbox[data-col=\"' + w + '\"]'), r = wb && wb.getBoundingClientRect();\n      tapZone(r && e.clientX >= r.left - 6 && e.clientX <= r.right + 6 ? tapWant : 'off');"), 'the lending column, its full height, by x against its box');
  assert.ok(page.includes("      if (phase === 'tap') { if (k !== 'del') wiggle(); return; }   // a digit before the spread types nothing"));
  assert.ok(page.includes("      else if (e.key === ' ') { if (phase === 'tap') { e.preventDefault(); tapZone(tapWant); }"));
  assert.ok(HTML.includes('.frame[data-mode="take"] .keypad.dim .key{opacity:.45}'));
  // the engine's side: a tap off the zone says "up here" once; a digit first is ignored
  const def = Object.assign({}, DEF, { facts: [{ a: 43, b: 16, regroup: 'tap' }] }), st = T.start(def, { now: 1 });
  assert.equal(T.tap(st, true).say, true);
  assert.equal(T.tap(st, true).say, false);
  assert.deepEqual(T.digit(st, def, 3, 0, 5000), { ignored: 'tap' });
  // (decision 57: tapHere's words changed, the glow is in the column too now; no live chapter said them)
  assert.deepEqual(E.takeShow(def, plan(43, 16), 0, { mode: 'tap' }).here, { tens: 'The rows: the glowing ones.' });
});

// the page's handler for a click on the column, taken from runTakes' source and run on a stand-in column (screens S1)
function tcolClick(phase, tapWant, boxes) {
  const page = fnSrc(UI_SRC, 'runTakes'), i = page.indexOf("    tcol.addEventListener('click', function (e) {");
  assert.ok(i > 0);
  const src = page.slice(i, page.indexOf('\n    });\n', i) + 8);
  const got = [], adv = [];
  let h = null;
  const tcol = { addEventListener: (t, f) => { h = f; }, querySelector: (sel) => { const m = /^\.tbox\[data-col="(\d)"\]$/.exec(sel); return m && boxes[m[1]] ? { getBoundingClientRect: () => boxes[m[1]] } : null; } };
  // (`mv` false: the v0.3 page; the kit v0.4's column goes to colClickM, below)
  new Function('tcol', 'phase', 'tapWant', 'TAKE_ZONES', 'tapZone', 'advance', 'mv', 'colClickM', src)(tcol, phase, tapWant, U.ZONES, (z) => got.push(z), () => adv.push(1), false, () => { throw new Error('the v0.4 path'); });
  return { click: (x) => { h({ clientX: x, clientY: 0, target: {} }); return got[got.length - 1]; }, got, adv };
}

test('17. the \'tap\' page\'s column (screens S1): the lending column is the tap target its full height, by x against its box 6 px either side; the lending digit alone was 15 x 24 px at 844 x 390, and a tap a little below or beside it said "The rows: up here."', () => {
  // 43 − 16 at 844 x 390, as WebKit measured it: the ones' box (0) and the tens' (1); the lending 4 is 189.2 to 203.7
  const boxes = { 0: { left: 216.9, right: 250.9, top: 153.4, bottom: 187.3 }, 1: { left: 179.4, right: 213.5, top: 153.4, bottom: 187.3 } };
  const C = tcolClick('tap', 'tens', boxes);
  assert.equal(C.click(196), 'tens', 'on the 4 itself, or under it on the 1 of 16 or its box');
  assert.equal(C.click(207.7), 'tens', '4 px right of the 4 (said "up here" before)');
  assert.equal(C.click(173.4), 'tens', '6 px left of the box');
  assert.equal(C.click(219.5), 'tens', '6 px right of it (into the gap: only one thing can be tapped now)');
  assert.equal(C.click(173), 'off', 'past the 6 px: the sign\'s side');
  assert.equal(C.click(234), 'off', 'the ones');
  // a square to spread (the hundreds lend): its own column, nobody else's
  const H = tcolClick('tap', 'hundreds', { 0: boxes[0], 1: boxes[1], 2: { left: 141.9, right: 176 } });
  assert.equal(H.click(159), 'hundreds');
  assert.equal(H.click(196), 'off', 'the tens are not the lending column here');
  // outside the 'tap' phase a tap on the column moves a step on (a show, an echo), never during a help, and taps nothing
  const S = tcolClick('show', null, boxes);
  S.click(196);
  assert.deepEqual([S.got.length, S.adv.length], [0, 1]);
  const Hp = tcolClick('help', null, boxes);
  Hp.click(196);
  assert.deepEqual([Hp.got.length, Hp.adv.length], [0, 0]);
  // and every box carries its column (takeHtml), so the page can find the lending one
  const q = T.question(T.start(Object.assign({}, DEF, { facts: [{ a: 43, b: 16, regroup: 'tap' }] }), { now: 1 }));
  const html = U.html(U.view(q.plan, { marks: q.marks, on: 0 }));
  assert.deepEqual((html.match(/class="tbox[^"]*" data-col="(\d)"/g) || []).map((m) => m.slice(-2, -1)), ['1', '0']);
});

// the page's waits, taken from runTakes' source (wait, hush, timedWait) and run on stand-ins: timers on a clock of the
// test's own (`tick(ms)` runs those due), the speech's `end` hooks handed back, Read to me on (take-page-runtime TR1, TR2)
function takeWaitsHarness(readAloud) {
  const page = fnSrc(UI_SRC, 'runTakes');
  const line = (start) => { const i = page.indexOf(start); assert.ok(i > 0, start); return page.slice(i, page.indexOf('\n', i)); };
  const i = page.indexOf('    function timedWait('), block = page.slice(i, page.indexOf('\n    }\n', i) + 6);
  const src = [line('    function wait(fn, ms)'), line('    var waitGen = 0;'), line('    function hush()'), block].join('\n') +
    '\nreturn { wait: wait, hush: hush, timedWait: timedWait };';
  const timers = [], ends = [], said = [];
  let t = 0;
  const env = {
    later: (fn, ms) => { timers.push({ fn, ms, at: t + ms }); }, clearTimers: () => { timers.length = 0; }, stopSpeech: () => { said.push('stop'); },
    speakItems: (items, onDone) => { said.push(items.map((x) => x.text).join(' ')); if (onDone) ends.push(onDone); },
    save: { settings: { readAloud: readAloud !== false } }, root: { speechSynthesis: {} }, frameEl: { isConnected: true }, frozen: false, quick: false, takeWaits: U.waits
  };
  const f = new Function(...Object.keys(env), src)(...Object.values(env));
  const tick = (ms) => {
    t += ms;
    for (let due; (due = timers.filter((x) => x.at <= t).sort((a, b) => a.at - b.at)[0]);) { timers.splice(timers.indexOf(due), 1); due.fn(); }
  };
  return Object.assign(f, { env, timers, ends, said, tick });
}

test('17. a speech `end` that comes after a step has moved on never runs the step again (take-page-runtime TR1): a tap withdraws every wait begun before it, and a new step\'s wait withdraws the last one\'s', () => {
  const H = takeWaitsHarness(true), ran = [];
  H.timedWait([{ text: 'Take two.' }], 'step', () => ran.push('a'));
  assert.equal(H.ends.length, 1);
  H.hush();                 // a tap on the sand: the timers cleared, the speech stopped...
  H.ends[0]();              // ...and the stopped utterance still says `end` (cancel() does, or it was late)
  H.tick(300);
  assert.deepEqual(ran, [], 'one tap moves one step: the stale end runs nothing');
  // the step the tap went to: its own end runs it once
  H.timedWait([{ text: 'Take three.' }], 'step', () => ran.push('b'));
  H.ends[1](); H.tick(300);
  assert.deepEqual(ran, ['b']);
  H.ends[1](); H.tick(300);
  assert.deepEqual(ran, ['b'], 'and only once');
  // a step's wait begun after another's (no tap between): the older end runs nothing
  H.timedWait([{ text: 'Seven loose.' }], 'step', () => ran.push('c'));
  H.timedWait([{ text: 'Got it!' }], 'step', () => ran.push('d'));
  H.ends[2](); H.tick(300);
  assert.deepEqual(ran, ['b']);
  H.ends[3](); H.tick(300);
  assert.deepEqual(ran, ['b', 'd']);
  // Read to me off: the line's reading time, and a tap's hush withdraws it too
  const O = takeWaitsHarness(false), r2 = [];
  O.timedWait([{ text: 'Take two.' }], 'step', () => r2.push(1));
  assert.deepEqual(O.timers.map((t) => t.ms), [U.waits('Take two.', 'step').read]);
  O.tick(U.waits('Take two.', 'step').read);
  assert.deepEqual(r2, [1]);
  // the page: every tap that moves it on hushes (a show's first column and its steps, the echo, a help's step, the end line)
  const page = fnSrc(UI_SRC, 'runTakes');
  ["        advance = function () { hush(); playShow(); };", "        advance = function () { landNow(); hush(); step(j + 1); };", "      advance = function () { hush(); next(); };",
    "        advance = function () { if (now() - startedAt < TAKE_MS.tapGuard || at >= steps.length - 1) return; hush(); step(at + 1); };", "      advance = function () { hush(); goOn(); };"]
    .forEach((l) => assert.ok(page.includes(l), l));
  assert.equal((page.match(/clearTimers\(\); stopSpeech\(\);/g) || []).length, 1, 'only inside hush()');
});

test('17. after Camp or ‹ the take page that was left does nothing more (take-page-runtime TR2): no step, no line, no done page and no store reward over the next screen', () => {
  const H = takeWaitsHarness(true), ran = [];
  H.timedWait([{ text: 'One like it.' }], 'end', () => ran.push('next problem'));
  H.env.frameEl.isConnected = false;    // go(): the screen redrawn, its timers cleared, its speech stopped
  H.timers.length = 0;
  H.ends[0](); H.tick(400);                // the end of the line that was cut off
  assert.deepEqual(ran, []);
  H.wait(() => ran.push('a wait'), 100); H.tick(100);
  assert.deepEqual(ran, [], 'no wait of a page that is gone runs');
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("    function wait(fn, ms) { return later(function () { if (!frozen && frameEl.isConnected) fn(); }, quick ? 0 : ms); }"));
  assert.ok(page.includes("    function finish() {\n      if (!frameEl.isConnected) return;"), 'the done page and the store\'s reward only from the page on screen');
  assert.ok(page.includes("    var frameEl = scr.querySelector('.frame');"), 'frameEl is the take page\'s own frame');
});

test('17. Read to me off, a \'show\' problem\'s first column waits for what is lettered, not for the question in words that is only said (take-page-runtime TR3): "Ones first." 1.6 s, not 4.4 s', () => {
  const st = T.start(Object.assign({}, DEF, { facts: [{ a: 503, b: 278, regroup: 'show' }] }), { now: 1 }), q = T.question(st), F = U.first(DEF, q);
  const words = (L) => L.map((l) => l.text).join(' ');
  assert.deepEqual(F.lines.map((l) => l.text), ['Ones first.']);
  assert.equal(U.waits(words(F.lines), 'step').read, 1600);
  assert.equal(U.waits(words(F.heard), 'step').read, 4400, 'what the old wait counted: the question in words too');
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("        return timedWait(save.settings.readAloud || !(q.col === 0 && fresh) ? said : heard(lines), 'step', playShow);"), 'only the first column; Read to me on, what is said');
});

test('the kit\'s words are the engine\'s only (integration F3, decision 53): PC.ui.takes.words is E.TAKE_WORDS, read at call time; no second English copy in ui.js', () => {
  assert.deepEqual(U.words(), E.TAKE_WORDS);
  withWords({ rows: 'filas' }, () => assert.equal(U.words().rows, E.TAKE_WORDS.rows));
  assert.ok(!UI_SRC.includes('TAKE_EN'));
  assert.ok(UI_SRC.includes('  function takeWordsNow() { return PC.engine.TAKE_WORDS; }'));
});

test('17. "Got it!" at the top of the keypad\'s place; the keypad and "Got it!" brought into view; the slot kept after every column and the lesson recorded at its last answer; nothing saved by PC.debug.takes', () => {
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(HTML.includes('.frame[data-mode="take"] .gotit{align-items:flex-start}'));
  assert.ok(page.includes('    function bringPad() { bringIn(pad); later(function () { bringIn(pad); }, 0); }'));
  assert.ok(page.includes('        bringGot();'));
  assert.ok(page.includes("      if (o.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: st };"));
  assert.ok(page.includes('        if (res.entry) E.logTake(cat, res.entry);'));
  assert.ok(page.includes('        if (res.done) { o.recorded = E.recordLesson(cat, st); persist(); }\n        else keepSlot();'));
  assert.ok(page.includes("var def = o.def, st = o.state, T = E.takes, teacher = E.teacherOf(def), keep = o.mode !== 'debug';"));
  assert.ok(page.includes('      if (!keep) return;'));
  // PC.debug.takes: the tools' screens (section 8), the Hollow's shelf and a store round among them
  assert.ok(UI_SRC.includes('      takes: function (what, opts) { return takesDebug(what, opts); }\n    };'), 'the last of PC.debug (pick stays right after the Warrior Counts\' entry)');
  assert.ok(UI_SRC.includes("  var TAKE_DEBUG = { first: 1, q: 1, show: 1, tap: 1, spread: 1, echo: 1, sand: 1, done: 1, shelf: 1, store: 1,\n    touch: 1, lend: 1, get: 1, 'get:one': 1, chain: 1, 'help:move': 1, ahead: 1, marks: 1, 'hollow:marks': 1 };"));
  const dbg = fnSrc(UI_SRC, 'takesDebug');
  assert.ok(dbg.includes("if (what === 'shelf') { go('hollow', { from: 'hub', stories: list }); return $('storeBtn') ? true : 'takes: no shelf drawn (a round in the slot?)'; }"));
  assert.ok(dbg.includes("var r = E.takeRoundStart(cat, stories(), now(), { stories: list });") && dbg.includes('storeLesson(r.state, false, null, true);'), 'the store round in debug mode: nothing saved');
  assert.ok(!dbg.includes('persist()'), 'PC.debug.takes never saves');
  assert.ok(!dbg.includes('typeof E.hollowShelf'), 'no check for a function of the same build (integration F2)');
  assert.ok(UI_SRC.includes("  function storeSays(n) { return 'In the store: ' + E.numberWords(n) + '.'; }"));
  assert.ok(fnSrc(UI_SRC, 'storeLesson').includes("mode: debug ? 'debug' : 'hollow'"));
  // a chapter's take set runs on the take page, with the lesson's options and its end
  const scl = fnSrc(UI_SRC, 'startChapterLesson');
  assert.ok(scl.includes("    if (st && st.op === '-') return runTakes({ def: def, state: st, intro: intro, mode: 'chapter', waitLine: wWait, onDone: onDone });\n    runLesson({ def: def, state: st, intro: intro, mode: 'chapter', waitLine: wWait, onDone: onDone });"));
  assert.ok(scl.indexOf('var wWait') < scl.indexOf('runTakes({'), 'the waiting line over a take lesson too');
});

test('nothing a player can reach changes: runLesson, the keypad and go() as in v23; index.html without its take block is v23\'s byte for byte, and every rule of the block is the take page\'s own', () => {
  // (chapter 12: runLesson's one guarded statement after E.counts.answer, the Counts page's echo, and the page's promptLines
  // keeping a Spanish ask's lang: its new hash; the spanish owner's, spec section 6's kit pins, item 1. Then chapter 12's
  // review: the echo page's Next at the top of the keypad's place, brought in if still under the screen, only when the
  // echo shows; ask() clears the inline style, a no-op on every page that never set it)
  assert.equal(sha(fnSrc(UI_SRC, 'runLesson')), '92093b13af18b14fa4aef5c8f187527d99673368c6472595b711c51a32826257');
  const rl = fnSrc(UI_SRC, 'runLesson');
  assert.ok(rl.includes("          if (echoed) {\n            $('lessonNext').style.alignItems = 'flex-start';\n            var eb = $('gotIt').getBoundingClientRect().bottom, evh = root.innerHeight || 0;\n            if (evh && eb > evh) root.scrollBy(0, eb - evh + 8);\n          }"), 'the echo page: Next up, then the backstop scroll, only with an echo');
  assert.ok(rl.includes("$('lessonNext').hidden = true; $('lessonNext').style.alignItems = '';"), 'ask() puts Next back for the next question');
  assert.equal((rl.match(/alignItems/g) || []).length, 2, 'nowhere else');
  assert.ok(fnSrc(UI_SRC, 'runLesson').includes("      var res = E.counts.answer(st, D, typed, ms, now());\n      // (chapter 12: a set's `echo`, Chispapaw's Spanish after the line this answer earned, waiting for Next as a fact's own lines)\n      var echoed = res.correct ? E.countsEcho(def, st, res, teacher) : null; if (echoed) res.balloons = echoed;\n      E.logAnswer(cat, res.entry);"));
  assert.equal(sha(fnSrc(UI_SRC, 'keypadPress')), 'b688cdd8019dd93755828b17f11ccfcf37afecb3cd9069b4ab4232bc450c2350');
  assert.equal(sha(fnSrc(UI_SRC, 'go')), '4ea06e5f48bfda23d68d1a0c5726b3038fdcbc13b3c5549fb8494e38ac6d9254');
  const start = HTML.indexOf('/* ---------- the take-aways kit: the take page'), end = HTML.indexOf('</style>');
  assert.ok(start > 0 && end > start);
  // (book two's block, docs/take-aways.md section 7, follows the take block before </style>: tests/book2-ui.test.js has it)
  const two = HTML.indexOf('/* ---------- book two ('), block = HTML.slice(start, two > start ? two : end);
  // (chapter 12: its Spanish block stands just before the take block and is cut with it; its selectors are its own list:
  // the spanish owner's, spec section 6's kit pins, item 1)
  const es = HTML.indexOf('/* ---------- chapter 12: Spanish (');
  assert.ok(es > 0 && es < start, 'the Spanish block, before the take block');
  const esSels = [];
  HTML.slice(es, start).replace(/\/\*[\s\S]*?\*\//g, '').split('}').forEach((r) => { const sel = r.split('{')[0].trim(); if (sel) sel.split(/,(?![^(]*\))/).forEach((x) => esSels.push(x.trim())); });
  assert.deepEqual(esSels, ['.es', '.gloss', '.sb.whisper:has(.es)', '.ov .btext.whisper:has(.es)']);
  // module 2's script tags (chapter 12 on: words.js and each chapter's story) are cut before hashing
  const v23 = (HTML.slice(0, es) + HTML.slice(end)).replace(/<script src="app\/story\/(words|ch(1[2-9]|2\d))\.js"><\/script>\n/g, '');
  assert.equal(sha(v23), 'ed069d652c0b7bea405c26063a7d39cf9459a2a7ac07c01bc22c172fba23a028', 'v23\'s index.html');
  // (decision 57: the kit v0.4's rules hang on .frame[data-mode="take"].tmoves, and the marks page's pictures on .tpick, its
  // shelf icon .tpickicon)
  const own = /^(\.frame\[data-mode="take"\]|html:has\(\.frame\[data-mode="take"\]\)|\.tcol|\.thead|\.tmark|\.tdig|\.ttop|\.tbot|\.tsign|\.trule|\.tbox|\.tstruck|\.tshelf|\.tpick|(html\.big )?\.frame\[data-mode="shelf"\]|\.frame\[data-mode="store-reward"\])/;
  const sels = [];
  block.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@keyframes [a-z]+\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g, '').replace(/@media[^{]*\{/g, '').split('}').forEach((r) => {
    const sel = r.split('{')[0].trim();
    if (sel) sel.split(/,(?![^(]*\))/).forEach((s) => sels.push(s.trim()));
  });
  assert.ok(sels.length > 30);
  sels.forEach((s) => assert.match(s, own, s));
  (block.match(/@keyframes ([a-z]+)/g) || []).forEach((k) => assert.match(k, /@keyframes t[a-z]+/));
  // and none of the take page's classes is used by any other page
  ['tcol', 'thead', 'tmark', 'tbox', 'tstruck', 'tnohead', 'tkeys', 'tshelf', 'storeicon', 'tmoves', 'tmini', 'ttarget', 'tpick', 'tmkpage', 'tsecond'].forEach((c) => {
    const out = HTML.slice(0, start) + HTML.slice(end);
    assert.ok(!new RegExp('[." ]' + c + '[ "{.:,]').test(out), c);
  });
});

test('17. the take block\'s CSS: the digits\' size, the boxes\' colours, the gold ring, the marks\' 2px shadow, the ink slash, the heads\' sand chip, the fallbacks, and on a phone held sideways the stack over the panel', () => {
  [
    'font-size:clamp(24px, min(8cqi, 4.6vh), 44px)',
    '.tbox.on{box-shadow:0 0 0 3px var(--gold), 5px 5px 0 2px rgba(0,0,0,.5)}',
    '.tbox.right{background:#c9f2c0}',
    '.tbox.miss{background:var(--caption)}',
    '.tbox.blank{background:transparent;border-style:dotted;border-color:var(--cream);box-shadow:none}',
    '.tmark{grid-row:2;justify-self:center;align-self:end;font-size:max(.5em,16px);color:var(--gold);text-shadow:2px 2px 0 var(--ink)}',
    '.tstruck::after{content:"";position:absolute;left:50%;top:.02em;height:1.08em;width:3px;margin-left:-1.5px;border-radius:2px;background:var(--ink);box-shadow:0 0 0 1.5px var(--cream);transform:rotate(32deg)}',
    'background:#e8cf98;border:2px solid var(--ink)',
    '.frame[data-mode="take"].tnohead .tcol{--th:0px}',
    '.frame[data-mode="take"].tkeys .key{min-height:56px}',
    '.frame[data-mode="take"] .panel{aspect-ratio:2/1}'
  ].forEach((s) => assert.ok(HTML.includes(s), s));
  const phone = '@media (orientation: landscape) and (max-height: 500px){\n  .frame[data-mode="take"]{grid-template-areas:"int stack" "int panel";';
  assert.ok(HTML.includes(phone), 'the phone held sideways: the stack over the panel');
  const at = HTML.indexOf(phone), blk = HTML.slice(at, HTML.indexOf('\n}', at));
  ['.frame[data-mode="take"] .col{display:contents}', '.frame[data-mode="take"] .stack{grid-area:stack;', '.frame[data-mode="take"] .interact{grid-area:int;', '.frame[data-mode="take"] .panel-side{grid-area:panel;'].forEach((s) => assert.ok(blk.includes(s), s));
  // the fallbacks in their order: the heads row, then the keys sideways or the panel upright (ui.js's fit)
  const fit = fnSrc(UI_SRC, 'runTakes');
  assert.ok(fit.includes("      frameEl.classList.add('tnohead');\n      var left = over();"));
  assert.ok(fit.includes("        panel.style.height = Math.max(Math.round(ph / 2), Math.floor(ph - left)) + 'px';\n      } else frameEl.classList.add('tkeys');"));
  assert.ok(fit.includes("    var join = !!(root.matchMedia && root.matchMedia(TAKE_PHONE).matches && save.settings.bigText);"), 'the sand\'s named fallback on a phone held sideways with Aa');
});

/* ------------------------------------------------------------------ the help's steps drawn (call 37's small sample) */

function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function count(svg, re) { return (svg.match(re) || []).length; }
// one help's every step: the sand drawn by the art with the right counts, and the page's stack
function drawHelp(p, col, slip, where) {
  const h = E.takeHelp(DEF, p, col, slip, { mode: 'hers' });
  assert.ok(h && h.steps.length >= 2, where);
  h.steps.forEach((s, i) => {
    const o = E.takeSandOpts(s), svg = PC.art.sand(o);
    assert.ok(typeof svg === 'string' && svg.startsWith('<svg'), where + ' step ' + i);
    assert.equal(count(svg, /class="pc-quick-square[" ]/g), o.hundreds + o.crossed.squares, where + ' squares at step ' + i);
    assert.equal(count(svg, /class="pc-quick-line[" ]/g), o.tens + o.crossed.lines, where + ' lines at step ' + i);
    assert.equal(count(svg, /class="pc-quick-dot[" ]/g), o.ones, where + ' dots at step ' + i);
    assert.equal(count(svg, /pc-quick-crossed/g), o.crossed.squares + o.crossed.lines, where + ' crossed at step ' + i);
    assert.equal(count(svg, /pc-quick-lit/g), o.lit, where + ' lit at step ' + i);
    const L = U.helpStack(h, i, 'tallyheart');
    assert.equal(L[0].text, h.intro);
    assert.equal(L[L.length - 1].text, s.say);
  });
  const L = U.helpStack(h, h.steps.length - 1, 'tallyheart'), ns = h.steps.filter((s) => s.n != null).map((s) => s.n);
  if (ns.length) assert.equal(L[1].counter, ns.join(' · '), where + ' the counter');
  assert.ok(h.steps[h.steps.length - 1].write, where + ' ends writing the digit');
  return h.steps.length;
}
// the store picture at a column's stages, with the right counts (taken pale, as they stand)
function drawStore(p, col) {
  ['before', 'taken'].concat(col === p.n - 1 ? ['done'] : []).forEach((stage) => {
    const po = E.takePicture(DEF, { plan: p, col }, stage), svg = PC.art.placeValue(po);
    assert.equal(count(svg, /class="pc-pv-square[" ]/g), po.hundreds, p.a + ' − ' + p.b + ' col ' + col + ' ' + stage + ' squares');
    assert.equal(count(svg, /class="pc-pv-row[" ]/g) - count(svg, /pc-pv-row[^"]*pc-pv-empty/g), po.tens, 'rows');
    assert.equal(count(svg, /class="pc-pv-loose[" ]/g), po.ones, 'loose');
    assert.equal(count(svg, /pc-pv-taken/g), po.taken.hundreds + po.taken.tens + po.taken.ones, 'taken');
  });
}

test('17. every help of section 2\'s cases, step by step, drawn by the art (PC.art.sand\'s quick) without throwing, with the right counts, and its stack', () => {
  const CASES = [
    [43, 16, 0, 3, 'flip'], [43, 16, 0, 0, 'nospread'], [43, 16, 1, 3, 'kept'], [43, 16, 0, 8, 'fact'],
    [503, 278, 0, 0, 'zero'], [503, 278, 0, 4, 'fact'], [503, 278, 0, 6, 'fact'], [702, 345, 0, 3, 'zero'], [702, 345, 0, 0, 'zero'], [702, 345, 0, 6, 'fact'],
    [503, 278, 1, 3, 'zero'], [503, 278, 1, 7, 'zero'], [503, 278, 1, 0, 'zero'], [503, 278, 1, 1, 'fact'], [503, 278, 1, 8, 'fact'],
    [503, 278, 2, 3, 'kept'], [811, 356, 1, 0, 'nospread'], [811, 356, 1, 6, 'kept'], [640, 218, 0, 8, 'flip'], [473, 245, 0, 2, 'flip'],
    [473, 245, 1, 3, 'kept'], [475, 132, 1, 3, 'extra'], [475, 132, 2, 2, 'extra'], [475, 32, 2, 3, 'extra'], [764, 321, 1, 3, 'extra'],
    [500, 467, 2, 1, 'kept'], [731, 696, 2, 1, 'kept'], [403, 57, 2, 4, 'kept'],
    [607, 283, 1, 8, 'flip'], [607, 283, 1, 0, 'nospread'], [607, 283, 2, 4, 'kept'],
    [475, 132, 0, 2, 'fact'], [735, 391, 1, 6, 'flip']
  ];
  assert.equal(CASES.length, 33);
  CASES.forEach(([a, b, col, g, slip]) => {
    const p = plan(a, b);
    assert.equal(E.takeSlip(p, col, g), slip, a + ' − ' + b);
    drawHelp(p, col, slip, a + ' − ' + b + ' col ' + col + ' typed ' + g);
    drawStore(p, col);
  });
});

test('17. the small seeded sample: five three-digit problems of each kind, every column, every wrong digit (810 helps), drawn without throwing, with the right counts; the store picture at every column', () => {
  const r = rng(20261107), by = {};
  E.TAKE_KINDS.forEach((k) => { by[k] = []; });
  for (let guard = 0; guard < 200000 && E.TAKE_KINDS.some((k) => by[k].length < 5); guard++) {
    const a = 100 + Math.floor(r() * 900), b = 1 + Math.floor(r() * (a - 1)), p = plan(a, b);
    if (!p) continue;
    const k = E.takeKind(p);
    if (by[k].length < 5 && !by[k].some((x) => x.a === a && x.b === b)) by[k].push(p);
  }
  let helps = 0, steps = 0;
  E.TAKE_KINDS.forEach((k) => {
    assert.equal(by[k].length, 5, k);
    by[k].forEach((p) => p.cols.forEach((c, col) => {
      drawStore(p, col);
      for (let g = 0; g <= 9; g++) {
        if (g === c.digit) continue;
        const slip = E.takeSlip(p, col, g);
        assert.ok(E.TAKE_SLIPS.includes(slip), p.a + ' − ' + p.b);
        steps += drawHelp(p, col, slip, p.a + ' − ' + p.b + ' col ' + col + ' typed ' + g);
        helps++;
      }
    }));
  });
  assert.equal(helps, 810);
  assert.ok(steps > 3000, steps + ' steps');
});

/* ------------------------------------------------------------------ the kit's second pass: phase 2's three fixes */

test('17. Read to me on a \'tap\' or \'show\' first column: the question in words before the column\'s line, then the tap line or the show\'s steps after it (phase 2\'s check, problem 1); a \'tap\' turn says its top first (problem 2)', () => {
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("      baseHeard = q.col === 0 && fresh ? said : heard(lines);\n      phase = 'line';\n      say(lines); saying(baseHeard);"));
  assert.equal((page.match(/saying\(baseHeard\.concat\(heard\(\[/g) || []).length, 5, 'the show\'s steps, the tap line, "up here", the next tap and the line after the taps');
  assert.ok(!/saying\(heard\(base\b/.test(page), 'nothing rebuilt from the lettering alone');
  assert.ok(page.includes('base = F.lines; baseHeard = F.heard; say(base); saying(F.heard);'), 'the ones-first pointer keeps the order too');
  // what the page says, built as it builds it: 64 − 38 'tap' on a set's first problem
  const def = Object.assign({}, DEF);
  const st = T.start(Object.assign({}, def, { facts: [{ a: 64, b: 38, regroup: 'tap' }] }), { now: 1 });
  const q = T.question(st), F = U.first(def, q);
  const sh = E.takeShow(def, q.plan, 0, { mode: 'tap' });
  const said = F.heard.concat([{ who: 'tallyheart', text: sh.taps[0].say }]).map((h) => h.text);
  assert.deepEqual(said, ['Sixty-four take away thirty-eight.', 'Ones first. Four take away eight.', 'Not enough loose. Spread a row: tap it.']);
  assert.deepEqual(F.lines.map((l) => l.text), ['Ones first. Four take away eight.'], 'lettered: the column\'s line, its top as written');
  // 'show': the column's name, then the show's steps, the question in words still before them
  const ss = T.start(Object.assign({}, def, { facts: [{ a: 64, b: 38, regroup: 'show' }] }), { now: 1 });
  const qs = T.question(ss), Fs = U.first(def, qs), steps = E.takeShow(def, qs.plan, 0, { mode: 'show' }).steps;
  assert.deepEqual(Fs.heard.concat([{ text: steps[0].say }]).map((h) => h.text), ['Sixty-four take away thirty-eight.', 'Ones first.', 'Four take away eight? Only four loose. Not enough.']);
  // the held stack measures the 'tap' column's longer line (the reservation reads E.takeLine)
  const R = U.reserve(def, q, {});
  assert.ok(R.some((L) => L.some((b) => b.text === 'Ones first. Four take away eight.') && L.some((b) => b.text === 'Not enough loose. Spread a row: tap it.')));
});

test('17. a phone held sideways: the take page\'s height allows for the bar as it measures, so the panel ends on the screen (phase 2\'s check, problem 3: 6 px below at 844 x 390)', () => {
  const at = HTML.indexOf('@media (orientation: landscape) and (max-height: 500px){\n  .frame[data-mode="take"]{');
  const blk = HTML.slice(at, HTML.indexOf('\n}', at));
  assert.ok(blk.includes('height:calc(100dvh - var(--bar) - var(--st) - 18px)'));
  assert.ok(!blk.includes('- 12px)'));
});

/* ------------------------------------------------------------------ the kit's second pass: the Hollow and the corner */

test('the Hollow\'s shelf: a branch before `var HW` at its indentation, only with the store open (a cat without it gets the Counts page as before); One Count at a time is go(\'hollow\', { counts: true }) into the unchanged path, its ‹ back to the shelf; no new view; the take pick-up and settle before the pinned lines', () => {
  const rh = fnSrc(UI_SRC, 'renderHollow');
  const shelf = rh.indexOf("    var SH = opts && opts.counts ? null : E.hollowShelf(cat, stories(), { reward: !!(opts && opts.reward), now: now(), stories: opts && opts.stories });\n    if (SH) return renderShelf(SH, opts || {});");
  const hw = rh.indexOf('    var HW = E.hollowLines(');
  assert.ok(shelf > 0 && hw > shelf, 'the shelf before var HW');
  const take = rh.indexOf("    if (HL && HL.state.op === '-') {"), wl = rh.indexOf('        var wl = cat.warrior ? E.hollowLines(cat, stories(), { now: now() }).waiting : null;\n        return hollowLesson(E.hollowDef(stories(), tbl), HL.state, true, wl);');
  assert.ok(take > 0 && wl > take, 'the take pick-up and settle before the pinned two lines');
  assert.ok(rh.includes("      if (!E.takes.done(HL.state)) return storeLesson(HL.state, true, cat.warrior ? E.hollowLines(cat, stories(), { now: now() }).waiting : null);"), 'a round picked up under the waiting line');
  assert.ok(rh.includes('      if (srec && srec.store && srec.store.awarded) return storeReward(srec.store);'));
  assert.ok(rh.includes("    if (opts && opts.counts) hollowSub = 'counts';"), 'opts.counts: only the shelf\'s button sets it');
  assert.equal((UI_SRC.match(/counts: true/g) || []).length, 1, 'One Count at a time is the one way to it');
  const sh = fnSrc(UI_SRC, 'renderShelf');
  assert.ok(sh.includes("$('countsBtn').addEventListener('click', function () { go('hollow', { counts: true, from: view.opts.from, vol: view.opts.vol, stories: opts.stories }); });"), 'the volume she came from kept (Read my book on First Moon, the Hollow, One Count at a time, ‹, ‹: First Moon)');
  assert.ok(sh.includes("      var r = E.takeRoundStart(cat, stories(), now(), { stories: opts.stories });\n      E.holdLesson(cat);"));
  assert.ok(sh.includes("say: [{ who: 'tallyheart', text: SH.line }]"), 'the waiting line in the greeting\'s place (E.hollowShelf)');
  assert.ok(sh.includes('<i class="storeicon" aria-hidden="true">'));
  assert.ok(sh.includes("scr.querySelector('.frame').setAttribute('data-mode', 'shelf');"), 'its own mode, for the phone held sideways');
  const ph = HTML.indexOf('@media (orientation: landscape) and (max-height: 500px){\n  .frame[data-mode="shelf"]{grid-template-areas:"top stack" "int stack" "int panel";');
  assert.ok(ph > 0, 'on a phone held sideways the shelf\'s stack over the panel');
  const back = fnSrc(UI_SRC, 'onBack');
  assert.ok(back.includes("    if (n === 'hollow' && hollowSub === 'counts') return go('hollow', { from: view.opts.from, vol: view.opts.vol, back: true, stories: view.opts.stories });\n    if (n === 'hollow' || n === 'nest') return go("), 'back to the shelf with its volume, so its own ‹ reaches the book she left');
  assert.equal(sha(fnSrc(UI_SRC, 'go')), '4ea06e5f48bfda23d68d1a0c5726b3038fdcbc13b3c5549fb8494e38ac6d9254', 'no new view');
  // a store round on the take page, the slot kept as a Hollow round's; its reward goes back to the shelf
  const sl = fnSrc(UI_SRC, 'storeLesson');
  assert.ok(sl.includes("intro: resume ? (waiting ? [{ who: 'tallyheart', text: waiting }] : []) : [{ who: 'tallyheart', text: def.intro }],"));
  assert.ok(fnSrc(UI_SRC, 'runTakes').includes('      else cat.lesson = { mode: o.mode, state: st };'), 'kept as { mode: \'hollow\', state }');
  const sr = fnSrc(UI_SRC, 'storeReward');
  assert.ok(sr.includes("$('againBtn').addEventListener('click', function () { go('hollow', { from: 'hub', reward: true }); });"));
  assert.ok(sr.includes("hollowScene('tree', [], ['sparkle'])"), 'the tree insert, no glow');
  // (screens S3) on a phone held sideways its stack over the panel and the card laid flat: "Another round" on the screen
  assert.ok(sr.includes("    scr.querySelector('.frame').setAttribute('data-mode', 'store-reward');"), 'its own mode');
  assert.ok(sr.includes("    var lay = function () { layoutText(ctx); if ($('stack').innerHTML && root.matchMedia && root.matchMedia(TAKE_PHONE).matches) layoutText(ctx); };\n    relayoutFn = lay;\n    lay();"), 'laid out again when its line went to the stack');
  const rp = HTML.indexOf('@media (orientation: landscape) and (max-height: 500px){\n  .frame[data-mode="store-reward"]{grid-template-areas:"int stack" "int panel";');
  assert.ok(rp > HTML.indexOf('/* ---------- the take-aways kit: the take page') && rp < HTML.indexOf('/* ---------- book two ('), 'inside the take block');
  const rb = HTML.slice(rp, HTML.indexOf('\n}', rp));
  ['.frame[data-mode="store-reward"] .reward{display:grid;grid-template-columns:64px auto;', '.frame[data-mode="store-reward"] .reward svg{grid-row:1 / span 2;width:64px;height:64px}',
    '.frame[data-mode="store-reward"] .interact{grid-area:int;align-self:center;', 'height:calc(100dvh - var(--bar) - var(--st) - 18px)'].forEach((x) => assert.ok(rb.includes(x), x));
  assert.ok(!fnSrc(UI_SRC, 'hollowReward').includes('data-mode'), 'module 1\'s reward page as it was');
  assert.ok(sr.includes('treasureSvg(t.id)'));
});

test('the frost treasures drawn in treasureSvg, each its own picture, none the fallback nor a module 1 treasure\'s; every other id as before', () => {
  // (treasureSvg is the browser part's: taken from the source, with the one helper it calls)
  const treasureSvg = new Function('f1', fnSrc(UI_SRC, 'treasureSvg') + '\nreturn treasureSvg;')((n) => (Math.round(n * 10) / 10).toString());
  const svgs = E.FROST_TREASURES.map((t) => treasureSvg(t.id));
  const fallback = treasureSvg('no-such-treasure');
  svgs.forEach((x, i) => { assert.ok(x.startsWith('<svg viewBox="0 0 100 100"'), E.FROST_TREASURES[i].id); assert.notEqual(x, fallback, E.FROST_TREASURES[i].id); });
  assert.equal(new Set(svgs).size, 4);
  const old = E.TREASURES.concat(E.GIFTS).map((t) => treasureSvg(t.id));
  svgs.forEach((x) => assert.ok(!old.includes(x)));
  // every id of module 1 and the gifts drawn as in v23 (their source lines untouched)
  const ts = fnSrc(UI_SRC, 'treasureSvg');
  ["case 'acorn': return o + '<path d=\"M30 46 C30 76 50 88 50 88 C50 88 70 76 70 46z\" fill=\"#c9843a\"/>", "case 'pebble': return o + '<ellipse cx=\"50\" cy=\"56\" rx=\"34\" ry=\"24\" fill=\"#8f97a8\"/>"].forEach((l) => assert.ok(ts.includes(l), l));
});

test('the grown-ups corner: with `takes` data, a "Take-aways" table by kind after the Counts\' tables (its teen facts under it) and "Count the store N (M without help)" on the Training Hollow\'s line; nothing for a cat without it', () => {
  assert.equal(U.corner(null), null);
  assert.equal(U.corner(undefined), null);
  const c = E.blankCat({ now: 1 });
  const st = T.start(Object.assign({}, DEF, { facts: [[43, 16], [503, 278], [254, 131]] }), { now: 1, logged: 10 });
  const clock = { t: 5000 };
  // 43 − 16's ones a fact slip (13 − 6 as 8), 503 − 278 right, 254 − 131 right
  for (let k = 0; k < 20 && !T.done(st); k++) {
    while (T.question(st).tap) T.tap(st);
    const q = T.question(st), col = q.plan.cols[q.col];
    const d = q.a === 43 && q.col === 0 && !q.twin ? 8 : col.blank ? '' : col.digit;
    const r = T.digit(st, DEF, d, 3000, clock.t += 1000);
    if (r.entry) E.logTake(c, r.entry);
  }
  c.takes.rounds = 3; c.takes.cleanRounds = 2;
  const K = U.corner(c.takes, E.takeTable(c));
  assert.equal(K.line, 'Count the store 3 (2 without help)');
  // (corner-numbers CN3) a note on what its columns count, between the heading and the table
  assert.ok(K.html.startsWith('<h4>Take-aways</h4><p class="muted">“Right first time” is her own first try at a problem with every column right; worked problems, ones where she was told to regroup, and second goes are left out. “Problems” and “Helped” count them all (“helped”: a column slipped and Tallyheart helped). Typical time is of her right answers to problems she worked herself (not worked examples or ones she was told to regroup).</p>' +
    '<div class="scroll"><table><thead><tr><th>Kind</th><th>Problems</th><th>Right first time</th><th>Helped</th><th>Typical time</th><th>Commonest slip</th></tr></thead>'), K.html);
  assert.match(K.html, /<td>\d+&nbsp;of&nbsp;\d+<\/td>/, 'a ratio never breaks inside (a phone wrapped "36 of" from its "40")');
  assert.ok(K.html.includes('<td>Regroup a ten</td>') && K.html.includes('<td>a fact slipped</td>'), K.html);
  assert.ok(K.html.includes('<td>Across a zero</td>') && K.html.includes('<td>No regrouping</td>'));
  assert.ok(K.html.includes('<p class="muted">Teen facts missed: 13 − 6 ×1</p>'), K.html);
  assert.equal(E.takeTable(c).teen[0].text, '13 − 6 ×1', 'the spaces made fast by the page, not in the engine\'s text');
  // (corner-numbers CN1's page line) no first ask of her own in a row: a dash, never "0 of 0"
  const none = U.corner(c.takes, { rows: [{ kind: 'ones', problems: 2, firstAsks: 0, rightFirst: 0, helped: 0, ms: null, slip: null }], teen: [] });
  assert.ok(none.html.includes('<td>Regroup a ten</td><td>2</td><td>–</td><td>0</td>'), none.html);
  // (corner-numbers CN6) at the log's cap the table is her last E.TAKE_LOG_CAP, and its heading says so; the line counts every round
  assert.equal(E.takeTable(c).capped, false);
  assert.ok(!K.html.includes('her last'));
  const full = E.blankCat({ now: 1 }), e0 = c.takes.log[0];
  for (let i = 0; i < E.TAKE_LOG_CAP; i++) E.logTake(full, Object.assign({}, e0, { at: 100 + i }));
  full.takes.rounds = 440; full.takes.cleanRounds = 150;
  const KF = U.corner(full.takes, E.takeTable(full));
  assert.ok(KF.html.startsWith('<h4>Take-aways <span class="muted">(her last ' + E.TAKE_LOG_CAP + ')</span></h4><p class="muted">'), KF.html.slice(0, 120));
  assert.equal(KF.line, 'Count the store 440 (150 without help)');
  assert.equal(U.corner({ log: [], rounds: 0, cleanRounds: 0 }, { rows: [], teen: [] }).html, '<h4>Take-aways</h4><p class="muted">No take-aways yet.</p>');
  // the page: only for a cat with `takes`, after the Counts' tables, on the Training Hollow's line
  const og = fnSrc(UI_SRC, 'openGrownups');
  // (decision 57: the steps she has learned, for the style line once she has learned to spread a row)
  assert.ok(og.includes("      var TC = c.takes ? takeCorner(c.takes, E.takeTable(c), fmtMs, E.takeSteps(c, stories())) : null;\n      if (TC) hollowTxt += '; ' + TC.line;"), 'no check for a function of the same build (integration F2)');
  // (corner-numbers CN5) the module-1 part led by its name: "One Count at a time 2 rounds: the 1s 2 (…); Count the store 20 (…)"
  assert.ok(og.includes("      if (TC) hollowTxt += '; ' + TC.line;\n      if (TC) hollowTxt = 'One Count at a time ' + hollowTxt;"));
  assert.ok(og.indexOf("var hollowTxt = c.hollow.rounds + ' round'") < og.indexOf("hollowTxt = 'One Count at a time '"));
  assert.ok(og.indexOf("'<p class=\"muted\">No answers yet.</p>') +\n        (TC ? TC.html : '') +") > og.indexOf('E.factTables(c, stories())'));
});

/* ------------------------------------------------------------------ chapter 12: the take page's echo holds no room */

// (chapter 12's spec, section 6, "The take page's echo", and section 7, item 8: a set's `echo` is read at the problem's end by
// runTakes' setEcho, never made into the kit's `o.echo` hook, so reserve() hands takeReserve no echo room: the spanish owner's)
test('chapter 12: a set\'s echo holds no room: takeReserve\'s candidates for every column of chapter 12\'s take lesson and of a Count the store round are the same with and without the set\'s echo; reserve() still passes an echo only for an o.echo hook; the problem\'s end reads the set\'s echo, right or helped', () => {
  const T12 = (t) => ({ who: 'tallyheart', text: t });
  const take = { id: 'ch12-take', op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
    facts: [{ a: 254, b: 131, regroup: 'show', prompt: PROMPT, right: [T12('One square, two rows, three loose left.')] },
      { a: 58, b: 23, prompt: [T12('Now you try, all by yourself. Little take-aways first, then big.')] },
      { a: 76, b: 42, prompt: [{ who: 'chispapaw', kind: 'whisper', text: 'My little Tall One always sighs at homework.' }] }, [475, 132], [368, 145]],
    echo: { on: [[475, 132]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] } };
  const bare = (d) => { const o = Object.assign({}, d); delete o.echo; return o; };
  const fill = (s) => E.fill(s, { name: 'Moon' });
  const round = E.takeRoundStart(Object.assign(E.blankCat({ now: 1 }), { lessons: {} }), [], 1000, { stories: [] });
  assert.ok(round.def.echo, 'a store round\'s def has its echo');
  let n = 0;
  [[take, take.facts.map((f, i) => i)], [round.def, round.state.queue.map((f, i) => i)]].forEach(([def, list]) => {
    list.forEach((i) => {
      const facts = def === take ? [take.facts[i]] : [round.state.queue[i]];
      const st = T.start(def, { facts, now: 1 }), clock = { t: 1e6 };
      const p = T.question(st).plan;
      for (let col = 0; col < p.n; col++) {
        const q = T.question(st);
        const a = U.reserve(def, q, { intro: [], fill, echo: false }), b = U.reserve(bare(def), q, { intro: [], fill, echo: false });
        assert.deepEqual(a, b, def.id + ' ' + q.a + ' − ' + q.b + ' column ' + col);
        assert.ok(!JSON.stringify(a).includes('"room":true'), 'no echo room');
        n++;
        answer(st, def, 1, clock);
      }
    });
  });
  assert.ok(n >= 13);
  // the page: reserve() is untouched (an echo room only for a hook), the problem's end reads the set's echo for every finished
  // problem, right or helped, through setEcho; the kit's stub hook path for a set with no echo exactly as before
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("      var echoAt = typeof o.echo === 'function' ? function (c) { return echoOf(echoInfo(c)); } : false;\n      takeReserve(def, q, { intro: firstAsk ? firstIntro : [], fill: fill, echo: echoAt, taught: st.taught }).forEach(function (L) {"));
  const ri = page.indexOf('    function reserve() {'), rsv = page.slice(ri, page.indexOf('\n    }\n', ri));
  assert.ok(ri > 0 && !/def\.echo/.test(rsv), 'reserve() never reads a set\'s echo');
  assert.ok(page.includes("      var e = res.entry ? (def.echo ? setEcho({ problem: true, a: res.entry.a, b: res.entry.b, answer: res.entry.answer, correct: res.entry.correct, helped: res.entry.helped }) : (res.entry.correct ? echoOf({ problem: true, a: res.entry.a, b: res.entry.b, answer: res.entry.answer }) : null)) : null;"));
  assert.ok(page.includes("    function setEcho(info) { var x = E.takeEcho(def, info, st); return x ? { who: x.who || 'chispapaw', text: fill(x.text), lang: 'es' } : null; }"));
  assert.ok(page.includes('      var e = echoOf(echoInfo(res.col)), d = spread && !hurry ? TAKE_MS.outline : 0;'), 'the column hook as before');
  assert.equal((UI_SRC.match(/o\.echo = /g) || []).length, 1, 'o.echo is set only by PC.debug.takes\' stub, never from a set');
  // and what the end shows: 475 − 132 right, its echo after the kit's end line; helped, the same; its twin, never
  const end = (correct, a, b) => {
    const x = E.takeEcho(take, { problem: true, a, b, answer: a - b, correct, helped: !correct }, { log: [] });
    return U.end(take, { line: correct ? '' : E.TAKE_LINES.miss }, { fill, echo: x ? { who: x.who, text: fill(x.text), lang: 'es' } : null }).lines.map((l) => l.text);
  };
  assert.deepEqual(end(true, 475, 132), ['«¡Trescientos cuarenta y tres!»\n(Three hundred forty-three!)']);
  assert.deepEqual(end(false, 475, 132), [E.TAKE_LINES.miss, '«¡Trescientos cuarenta y tres!»\n(Three hundred forty-three!)']);
  assert.deepEqual(end(false, 565, 411), [E.TAKE_LINES.miss], 'its twin: no echo');
});

test('chapter 12\'s review: a take page opened while a Warrior Counts re-sit waits (a chapter\'s lesson, a store round picked up) says Tallyheart\'s waiting line on a page of its own, with Next, before the first column (over the column it lay under the bar on a sideways iPad); PC.debug.takes(\'first\') passes it with Next, so take:first is the worked example\'s first column as a lesson shows it', () => {
  const page = fnSrc(UI_SRC, 'runTakes');
  const at = page.indexOf('    var wAlone = '), blk = page.slice(at, page.indexOf('    } else ask();', at) + 18);
  assert.ok(at > 0, 'the waiting page, before the first ask');
  assert.ok(blk.includes("var wAlone = o.waitLine && asList(o.intro).some(function (l) { return l.text === o.waitLine; }) ? o.waitLine : null;"), 'whenever the line is in the intro, in any mode');
  assert.ok(blk.includes("o.intro = asList(o.intro).filter(function (l) { return l.text !== wAlone; });"), 'the line taken out of the first column\'s intro, so it is said once');
  assert.ok(blk.includes('say(wl); saying(heard(wl)); speakItems(heard(wl));'), 'lettered, on Read to me\'s button and said');
  assert.ok(blk.includes("pad.classList.add('away'); gotBtn.textContent = 'Next'; nextWrap.hidden = false;"), 'the keypad away and Next on (the take page puts it at the top of the keypad\'s place)');
  assert.ok(blk.includes("gotAct = function () { hush(); pad.classList.remove('away'); ask(); };"), 'Next asks the first problem');
  assert.ok(blk.includes('if (q0) paintStore(E.takePicture(def, { plan: q0.plan, col: q0.col, picture: q0.picture }, { col: q0.col, spreads: 0 }));'), 'the store as the first column will show it');
  assert.ok(page.includes("    } else ask();\n    return { press: press, tap: function (z) { tapZone(z || tapWant); } };\n  }"), 'every other take page asks at once, as before');
  // no answer can be typed on it: press() takes digits only in 'type' (or 'tap') and the phase is 'wait'
  assert.ok(blk.includes("phase = 'wait';") && page.includes("if (phase !== 'type' || now() < padLockedUntil) return;"));
  // who reaches it: startChapterLesson's take branch and a store round picked up pass their waiting line; a new round, and
  // PC.debug.takes('store'), pass none
  assert.ok(fnSrc(UI_SRC, 'startChapterLesson').includes("if (wWait) intro = (intro || []).concat([{ who: 'tallyheart', text: wWait }]);"));
  assert.ok(fnSrc(UI_SRC, 'storeLesson').includes("intro: resume ? (waiting ? [{ who: 'tallyheart', text: waiting }] : []) : [{ who: 'tallyheart', text: def.intro }],"));
  const dbg = fnSrc(UI_SRC, 'takesDebug');
  assert.ok(dbg.includes("if (what === 'first') { o.intro = [{ who: 'tallyheart', text: E.WARRIOR_WAITING }]; o.waitLine = E.WARRIOR_WAITING; }"));
  assert.ok(dbg.includes("    if (what === 'first' && $('lessonNext') && !$('lessonNext').hidden) {\n      renderedAt = now() - UI_GUARD_MS - 1; renderedPerf = perfNow() - UI_GUARD_MS - 1;") && dbg.includes("      $('gotIt').click();\n    }"), 'take:first passes the waiting page with Next, past the double-tap guard (the tap is the tool\'s)');
  assert.ok(dbg.indexOf("$('gotIt').click();") > dbg.indexOf('var h = runTakes('), 'after the page is built');
});

/* ================================================================== the kit v0.4 (decision 57): the page's proofs U1 to U5
 * and L5 (plan.md, "The proofs"), the column's markup under the moves, the slot, the keys, the taps, the marks page, the
 * shelf's My marks, the corner and PC.debug.takes' new screens. What needs a browser (the keypad's box at decide, lend,
 * get and answer; the hit boxes; the marks page's little 1; every new screen at the eight sizes, Aa off and on) was
 * measured in WebKit by the page owner (~/potomac-crossing-work/regroup/build-page/notes.md) and is the page review's
 * T1; here, the logic and the markup that make it so. */
const stub = require('./fixtures/takes-stub.js');
const STEPS = E.TAKE_STEPS.slice();
// a moves state (every step taught unless `taught`), her style
function mst(def, facts, style, taught) { return T.start(Object.assign({}, def, { facts }), { now: 1, logged: 99, taught: taught || STEPS, style: style || 'above' }); }
// moves made through the engine: 't1' a touch on the tens, a number a lend's, a get's or an answer
function walk(st, def, list, clock) { clock = clock || { t: 5000 }; return list.map((x) => (/^t\d$/.test(x) ? T.touch(st, def, +x.slice(1), clock.t += 1000) : T.digit(st, def, x, 2000, clock.t += 1000))); }
// the column the page draws at a moves question
function mcol(q, o) { return U.html(U.view(q.plan, Object.assign({ moves: true, marks: q.marks, boxes: [], on: -1, box: q.box, typed: '', miniOn: true, targets: q.targets, col: q.col }, o || {}))); }

test('L5. chapter 12\'s columns are v25\'s markup, byte for byte (every column of its lesson and store problem, each box state, every help step: hashed with v25\'s own ui.js at e000777), .tmoves is never set on a chapter 12 page, and a chapter-12-only cat\'s corner is as it was', () => {
  const D12 = { id: 'ch12-take', op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, done: '' };
  const FACTS = [{ a: 254, b: 131, regroup: 'show' }, [58, 23], [76, 42], [475, 132], [368, 145], [175, 42], { a: 254, b: 131, regroup: 'tap' }];
  let all = '', n = 0;
  const st = T.start(Object.assign({}, D12, { facts: FACTS }), { now: 1, logged: 99, taught: ['none'] }), clock = { t: 1e6 };
  assert.equal(E.takeMovesOn(st), false, 'chapter 12\'s lesson: no moves');
  while (!T.done(st)) {
    const q = T.question(st), c = q.plan.cols[q.col];
    const boxes = q.plan.cols.map((x, i) => (i < q.col ? { v: String(q.got[i]), cls: 'right' } : { v: '', cls: '' }));
    for (const typed of ['', String(c.digit)]) { const b2 = boxes.slice(); b2[q.col] = { v: typed, cls: '' }; all += U.html(U.view(q.plan, { marks: q.marks, boxes: b2, on: q.col, ask: 'x' })); n++; }
    E.takeHelp(D12, q.plan, q.col, 'fact', { mode: q.mode }).steps.forEach((s) => { all += U.html(U.view(q.plan, { marks: s.marks, boxes, on: -1, glow: q.col })); n++; });
    while (T.question(st).tap > 0) T.tap(st);
    T.digit(st, D12, c.blank ? '' : c.digit, 2000, clock.t += 1000);
  }
  assert.equal(n, 138);
  assert.equal(sha(all), 'cb364aa138d6f69087cd772f0ce835ea27283be4313c5842188a52ca96e8a5a7', 'v25\'s markup');
  assert.ok(!/tmini|ttarget|tm2|tfront|tgone/.test(all));
  assert.equal(E.takeMovesOn(T.start(D12, { now: 1 })), false, 'T.start with no taught (take:first, PC.debug.spanish)');
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("    var mv = E.takeMovesOn(st);\n    if (mv) frameEl.classList.add('tmoves');"), '.tmoves only under the gate');
  assert.equal((UI_SRC.match(/classList\.add\('tmoves'\)/g) || []).length, 1);
  // the corner of a cat who has played only chapter 12 (a slip, two store rounds): v25's, with or without her steps
  const cat = E.blankCat({ now: 1 }), s2 = T.start(Object.assign({}, D12, { facts: [[58, 23], [76, 42], [475, 132]] }), { now: 1, logged: 10, taught: ['none'] });
  for (let k = 0; k < 20 && !T.done(s2); k++) { const q = T.question(s2), c = q.plan.cols[q.col]; const r = T.digit(s2, D12, q.a === 76 && q.col === 0 && !q.twin ? 9 : c.blank ? '' : c.digit, 3000, clock.t += 1000); if (r && r.entry) E.logTake(cat, r.entry); }
  cat.takes.rounds = 2; cat.takes.cleanRounds = 1;
  [U.corner(cat.takes, E.takeTable(cat)), U.corner(cat.takes, E.takeTable(cat), undefined, ['none'])].forEach((K) => assert.equal(sha(K.html + '|' + K.line), '4f3071f01e674ce3b7c2cd0dcb5f7878c6a6cfd5281ba9ac731fef96084daf6c'));
});

test('the column under the moves (design sections 2 and 3): the lend box over the struck lender (one digit), the get box over the struck receiver (two wide, \'above\') or in front of it (\'one\'), the second marks row in the heads row\'s place with the chip\'s words kept, a ¹0 struck as one; each small box labelled by its column and job, aria-current while ringed', () => {
  const def = Object.assign({}, DEF), above = mst(def, [[43, 16]], 'above');
  walk(above, def, ['t1']);
  let q = T.question(above), h = mcol(q, { typed: '3', lit: [q.box.col] });   // (drawColM lights the struck lender while its box is open)
  assert.deepEqual(q.box, { col: 1, kind: 'lend', row: 1 });
  assert.match(h, /<span class="tmark tglow tbx" style="grid-column:2"><span class="tmini on" role="img" aria-label="tens, new number: 3" aria-current="true">3<\/span><\/span><span class="tdig ttop tstruck tglow" data-col="1"/, 'the lend box over the struck 4, which glows');
  walk(above, def, ['3']);
  q = T.question(above); h = mcol(q, { typed: '' });
  assert.match(h, /<span class="tmark" aria-hidden="true" style="grid-column:2"><span class="tmv">3<\/span><\/span>/, 'her gold 3');
  assert.match(h, /<span class="tmini tw2 on" role="img" aria-label="ones, new number" aria-current="true"> <\/span><\/span><span class="tdig ttop tstruck" data-col="0"/, 'the get box two digits wide over the struck 3, empty (never a 0)');
  const one = mst(def, [[43, 16]], 'one');
  walk(one, def, ['t1', '3']);
  q = T.question(one); h = mcol(q, { typed: '1' });
  assert.deepEqual(q.box, { col: 0, kind: 'get', row: 'front' });
  assert.match(h, /<span class="tdig ttop" data-col="0" style="grid-column:3"><span class="tfront tfb"><span class="tmini tw2 on" role="img" aria-label="ones, the little 1: 1" aria-current="true">1<\/span><\/span>3<\/span>/, 'the front box before the unstruck 3');
  // 503 − 278 at the zero's second change: the box in the heads row's place, the chip kept for its words; 'one': ¹0 struck as one
  const z = mst(def, [[503, 278]], 'above');
  walk(z, def, ['t2', '4', '10', 't1']);
  q = T.question(z); h = mcol(q);
  assert.deepEqual(q.box, { col: 1, kind: 'lend', row: 2 });
  assert.match(h, /<span class="thead tgone" role="img" aria-label="tens, rows" style="grid-column:3">/);
  assert.match(h, /<span class="tmark tm2 tbx" style="grid-column:3"><span class="tmini on" role="img" aria-label="tens, new number" aria-current="true">/);
  assert.match(h, /<span class="tgrp tstruck"><span class="tmv">10<\/span><\/span>/, 'the gold 10 struck');
  const z1 = mst(def, [[503, 278]], 'one');
  walk(z1, def, ['t2', '4', '1', 't1', '9']);
  assert.match(mcol(T.question(z1)), /<span class="tgrp tstruck tfs"><span class="tfront">1<\/span>0<\/span>/, 'the ¹0 struck as one');
  // the done marks of 503 − 278 in 'above': a second row on the tens (9), its chip gone, its words kept
  const done = U.html(U.view(plan(503, 278), { moves: true, marks: E.takeMoveMarks(plan(503, 278), 'above', 3, 0), boxes: [], on: -1 }));
  assert.match(done, /<span class="tmark tm2" aria-hidden="true" style="grid-column:3"><span class="tmv">9<\/span><\/span>/);
  // a right number green for 250 ms (the flash), then the gold mark; a help's fix glowing
  q = T.question(above);
  assert.match(mcol(q, { flash: { col: 1, row: 1, v: '3' } }), /<span class="tmini right" aria-hidden="true">3<\/span>/);
});

test('the targets (design section 1): a role="button" over the lender\'s column above the rule (rows 1 to 4: its bottom digit included), labelled from E.TAKE_WORDS, live only at a decide; next to her column it widens into it, else outwards (tfar); at least 44px wide', () => {
  const def = Object.assign({}, DEF), st = mst(def, [[503, 278]]);
  let q = T.question(st);
  assert.deepEqual(q.targets, [1, 2]);
  const h = mcol(q);
  assert.match(h, /<span class="ttarget" role="button" tabindex="0" aria-label="Spread a row" data-col="1" style="grid-column:3"><\/span>/);
  assert.match(h, /<span class="ttarget tfar" role="button" tabindex="0" aria-label="Spread a square" data-col="2" style="grid-column:2"><\/span>/);
  walk(st, def, ['t2']);
  q = T.question(st);
  assert.deepEqual(q.targets, [], 'none at a lend');
  assert.ok(!mcol(q).includes('ttarget'));
  // chapter 13's `taught`: the tens only, at the ones' turn
  const s13 = mst(def, [[486, 253]], 'above', stub.sets().ch13.taught);
  assert.deepEqual(T.question(s13).targets, [1]);
  [
    '.frame[data-mode="take"].tmoves .ttarget{grid-row:1 / 5;align-self:stretch;justify-self:start;margin-left:-.07em;width:max(1.56em, 44px);',
    '.frame[data-mode="take"].tmoves .ttarget.tfar{justify-self:end;margin-left:0;margin-right:-.07em}'
  ].forEach((r) => assert.ok(HTML.includes(r), r));
  // (the narrowest: 844 x 390's 24px digits give 1.56em = 37.4px, so 44px; WebKit measured 44 x 79.4 there)
  assert.ok(1.56 * 24 < 44 && 0.5 * 1.42 * 24 > 44 - 1.56 * 24, 'the widening stays inside the near half of her column');
});

test('U2. taps (takeTapAct): a panel click at a \'hers\' decide is neither a touch nor a move on; a column tap within 400 ms of a phase change, or a press held 0.6 s or slid 12 px, is not a tap; the lender\'s bottom digit is the lender; her own top digit wiggles, with no line; the lend box\'s undo only while it is empty', () => {
  const A = (o) => U.tapAct(Object.assign({ phase: 'type', now: 10000, quiet: 0, her: 0 }, o)).act;
  assert.equal(A({ where: 'panel', zone: 'tens', glow: null }), 'none', 'nothing glows in \'hers\': the panel does nothing');
  assert.equal(A({ where: 'panel', zone: 'tens', glow: 'tens' }), 'touch', 'a lit lender\'s zone is its target');
  assert.equal(A({ where: 'panel', zone: 'ones', glow: 'tens' }), 'none', 'the loose zone is never a lender');
  assert.equal(A({ where: 'panel', zone: 'ones', glow: 'tens', phase: 'tap' }), 'off', '\'tap\': the glowing ones, once');
  assert.equal(A({ where: 'panel', advance: true }), 'advance', 'a line or a help: the panel moves it on');
  assert.equal(A({ where: 'col', target: 1, col: 1, quiet: 10300 }), 'none', 'within 400 ms of a phase change');
  assert.equal(A({ where: 'col', target: 1, col: 1, held: 600 }), 'none', 'held 0.6 s: a finger resting');
  assert.equal(A({ where: 'col', target: 1, col: 1, slide: 12 }), 'none', 'slid 12 px');
  assert.equal(A({ where: 'col', target: 1, col: 1 }), 'touch', 'the target: its bottom digit included (rows 1 to 4)');
  assert.equal(A({ where: 'col', col: 0, onTop: true }), 'wiggle');
  assert.equal(A({ where: 'col', col: 0, onTop: false }), 'none', 'her own column elsewhere: nothing');
  assert.equal(A({ where: 'col', col: 1, kind: 'lend', boxCol: 1, typed: '' }), 'touch', 'the undo, the lend box empty');
  assert.equal(A({ where: 'col', col: 1, kind: 'lend', boxCol: 1, typed: '3' }), 'none', 'not once a digit is in');
  assert.equal(A({ where: 'col', col: 1, advance: true, phase: 'mhelp' }), 'advance', 'a help: the column moves it on (the tap used up)');
  assert.equal(A({ where: 'stack', advance: false }), 'none');
  // the engine's side: her own column is ignored ('own': the page wiggles it, no line); the page calls T.touch only there
  const def = Object.assign({}, DEF), st = mst(def, [[43, 16]]);
  assert.deepEqual(T.touch(st, def, 0, 5000), { ignored: 'own' });
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.equal((page.match(/T\.touch\(/g) || []).length, 2, 'touchCol and Tallyheart\'s \'show\' touch');
  assert.ok(page.includes("      if (r.ignored) { if (r.ignored === 'own') wigCol(col); return; }"));
  assert.ok(page.includes("    panel.addEventListener('click', function (e) { if (mv) return panelClickM(e);"));
  assert.ok(page.includes("    if (mv) [tcol, panel, stack].forEach(function (el) { el.addEventListener('pointerdown', function (e) { press0 = { x: e.clientX, y: e.clientY, t: perfNow() }; }); });"));
  assert.ok(page.includes("    function toPhase(p) { phase = p; quietUntil = now() + TAKE_MS.ok; }"));
  assert.ok(HTML.includes('@keyframes twig{25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}') && HTML.includes('.frame[data-mode="take"].tmoves .ttop.twig{animation:twig .18s ease-in-out}'), 'the wiggle, 180 ms');
});

test('U3. keys (takeKey): "3, OK, 1, 3, OK" typed 150 ms apart gives lend 3 and get 13 with no slip (the 400 ms guard after an OK ignores OK only, never a digit); a two-digit box adds a digit and starts again at two; a move-help\'s reading time dims the keypad and ignores keys', () => {
  const def = Object.assign({}, DEF), st = mst(def, [[43, 16]]);
  walk(st, def, ['t1'], { t: 1000 });
  let typed = '', okLock = 0;
  const press = (k, now) => {
    const q = T.question(st), A = U.key({ phase: 'type', k, typed, kind: q.box.kind, lit: false, now, okLock });
    if (A.act === 'type') typed = A.typed;
    if (A.act === 'ok') { const r = T.digit(st, def, typed, 150, now); okLock = now + U.MS.ok; typed = ''; return r; }
    return A;
  };
  const t0 = 1e5;
  press('3', t0);
  const r1 = press('ok', t0 + 150);
  assert.equal(r1.right, true);
  press('1', t0 + 300);
  assert.equal(typed, '1', 'a digit 150 ms after an OK goes into the box that has just opened');
  press('3', t0 + 450);
  assert.equal(typed, '13');
  const r2 = press('ok', t0 + 600);
  assert.equal(r2.right, true);
  assert.deepEqual(st.slips, []);
  assert.deepEqual(st.moveLog.map((m) => [m[1], m[2]]), [['t', 1], ['l', 3], ['g', 13]]);
  assert.equal(U.key({ phase: 'type', k: 'ok', now: 10, okLock: 300 }).act, 'none', 'a double tap\'s second OK');
  assert.deepEqual(['1', '4', '1', '3'].reduce((t, k) => U.press2(t, k), ''), '13', 'no Delete hunt');
  assert.equal(U.press2('13', 'del'), '');
  assert.equal(U.key({ phase: 'type', k: '7', typed: '3', kind: 'lend' }).typed, '7', 'a lend box holds one digit');
  assert.equal(U.key({ phase: 'mhelp', k: '7' }).act, 'none', 'a move-help\'s reading time');
  assert.equal(U.key({ phase: 'tap', k: '7' }).act, 'wiggle', '\'tap\': the glowing zone wiggles');
  assert.equal(U.key({ phase: 'type', k: '5', lit: true }).act, 'digit', 'a lit lender: the digit goes to the engine, which types nothing');
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("      toPhase('mhelp'); typed = '';") && page.includes("      pad.classList.remove('away'); pad.classList.add('dim');\n      drawCol();\n      moveStore("), 'the help dims the keypad');
  assert.ok(page.includes("      if (stop('mhelp')) return;\n      timedWait([b], 'step', done);"), 'for its reading time (or said), a tap moving it on');
});

test('U5. the \'one\' front box takes 1 or 13 (fitted in its own width while she types) and letters the little 1 alone; a lone 3 there is the `get` slip', () => {
  const def = Object.assign({}, DEF);
  for (const v of ['1', '13']) {
    const st = mst(def, [[43, 16]], 'one');
    walk(st, def, ['t1', '3']);
    const tq = T.question(st);
    if (v === '13') assert.match(mcol(tq, { typed: '13' }), /<span class="tmini tw2 on" role="img" aria-label="ones, the little 1: 13" aria-current="true"><span class="tfit">13<\/span><\/span>/);
    const r = walk(st, def, [v], { t: 20000 })[0];
    assert.equal(r.right, true, v);
    const h = mcol(T.question(st));
    assert.match(h, /<span class="tdig ttop" data-col="0" aria-hidden="true" style="grid-column:3"><span class="tfront">1<\/span>3<\/span>/, v + ': the little 1 lettered, the 3 unstruck');
    assert.ok(!h.includes('>13<'), v + ': never 13');
  }
  const st = mst(def, [[43, 16]], 'one');
  walk(st, def, ['t1', '3']);
  assert.equal(walk(st, def, ['3'], { t: 20000 })[0].slip, 'get');
  assert.ok(HTML.includes('.frame[data-mode="take"].tmoves .tfront.tfb{font-size:.5em;'), 'below 32px digits the front box drops the 16px floor');
  assert.ok(HTML.includes('.frame[data-mode="take"].tmoves .tfit{display:inline-block;font-size:.7em;'));
});

/* the stacks under the moves, as the page shows them (runTakes' slotSay): a 'tap' or 'show' prompt under the lines over the
 * column; a move-help or a pointer in the column line's place (slotBase), the reserve probe's fallback */
function movesUnder(set, style, student) {
  const def = set.def, st = mst(def, set.facts || def.facts, style, set.taught), clock = { t: 1e6 }, out = [];
  while (!T.done(st)) {
    let q = T.question(st);
    const cands = U.reserve(def, q, { taught: set.taught }), at = (w) => q.a + '−' + q.b + ' ' + style + ' col ' + q.col + ' ' + w;
    const fresh = q.col === 0, base = fresh ? U.first(def, q, {}).lines : (U.colLine(def, q) ? [{ who: 'tallyheart', text: U.colLine(def, q) }] : []);
    const slotBase = fresh ? U.first(def, q, { line: '' }).lines : [];
    const show = (r, w) => {
      if (!r || r.ignored) return;
      const say = r.help && r.help.say ? r.help.say.join(' ') : r.line;
      if (!say) return;
      out.push({ shown: (r.help || r.pointer || r.off ? slotBase : base).concat([{ who: 'tallyheart', text: say }]), cands, at: at(w) });
    };
    out.push({ shown: base, cands, at: at('outlined') });
    const col = q.col, c = q.plan.cols[col];
    for (let guard = 0; guard < 30 && !T.done(st) && T.question(st).col === col && T.question(st).a === q.a; guard++) {
      q = T.question(st);
      const m = q.moves[col][q.move];
      if (q.mode === 'tap' && m.move === 'touch') {
        const tp = E.takeShow(def, q.plan, col, { mode: 'tap', style }).taps.find((x) => x.idx === q.move);
        if (tp && tp.say) out.push({ shown: base.concat([{ who: 'tallyheart', text: tp.say }]), cands, at: at('tap prompt') });
        show(T.tap(st, true, def, clock.t += 1000), 'tap off');
        show(T.touch(st, def, m.col, clock.t += 1000), 'touch');
      } else if (q.mode === 'show' && m.move === 'touch') show(T.touch(st, def, m.col, clock.t += 1000), 'Tallyheart\'s touch');
      else if (m.move === 'touch') {
        if (student === 'ahead') show(T.digit(st, def, c.digit, 2000, clock.t += 1000), 'ahead');
        if (student === 'flip' && q.move === 0) show(T.digit(st, def, (c.bottom || 0) - c.before >= 0 ? (c.bottom || 0) - c.before : 0, 2000, clock.t += 1000), 'flip');
        else show(T.touch(st, def, m.col, clock.t += 1000), 'touch');
      } else if (m.move === 'lend') show(T.digit(st, def, student === 'kept' && !m.zero ? m.before : m.value, 2000, clock.t += 1000), 'lend');
      else if (m.move === 'get') show(T.digit(st, def, student === 'get' ? m.before : m.value, 2000, clock.t += 1000), 'get');
      else {
        if (q.move > 0 && col + 1 < q.plan.n) show(T.touch(st, def, col + 1, clock.t += 1000), 'order');
        const r = T.digit(st, def, c.blank ? '' : (student === 'answer' && q.pale == null ? (c.digit + 1) % 10 : q.pale != null ? '' : c.digit), 2000, clock.t += 1000);
        if (r && r.help && r.help.steps) break;   // the sand's help: the page's own stack (helpStack), not the slot
      }
    }
  }
  return out;
}

test('U4. the keypad stays put: every stack she sees under the moves (the column\'s line, each \'tap\' and \'show\' prompt under it, each move-help and pointer in its place: the reserve probe\'s fallback) is one the page measured on the problem\'s first column, both styles, for six students', () => {
  const S = stub.sets(), sets = [S.ch13, S.ch14, S.zero, S.both, { def: Object.assign({ id: 'ahead' }, S.ch13.def, { facts: [[52, 27], [811, 356], [500, 412]] }), taught: STEPS }];
  let n = 0;
  sets.forEach((set) => ['above', 'one'].forEach((style) => ['right', 'ahead', 'kept', 'get', 'flip', 'answer'].forEach((who) => {
    movesUnder(set, style, who).forEach((u) => { assert.ok(u.cands.some((c) => holds(c, u.shown)), u.at + ' (' + who + '): ' + JSON.stringify(u.shown.map((b) => b.text))); n++; });
  })));
  assert.ok(n > 1500, n + ' stacks');
  // the slot's candidate: the longest line the column's moves can bring, in the column line's place (not their sum)
  const def = S.ch13.def, q = T.question(mst(def, [[43, 16]], 'above', S.ch13.taught));
  const lines = U.slotLines(def, q, 0, S.ch13.taught), R = U.reserve(def, q, { taught: S.ch13.taught });
  assert.ok(lines.includes('Careful. One row goes to the loose. Three rows now.') && lines.includes('Right! Now show me your marks.') && lines.includes('Three loose and ten more: thirteen loose.'), JSON.stringify(lines));
  const slots = R.filter((L) => L.some((b) => b.slot));
  assert.equal(slots.length, 1, 'one candidate for the slot on the ones');
  assert.equal(slots[0][slots[0].length - 1].text.length, Math.max(...lines.map((t) => t.length)));
  assert.equal(U.slotLines(def, T.question(mst(def, [{ a: 43, b: 16, regroup: 'show' }], 'above', S.ch13.taught)), 0, S.ch13.taught).length, 0, '\'show\': no slot (a wrong number is lettered)');
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes("      say((help ? slotBase : base).concat([Object.assign({}, b, { slot: true })]));"), 'the slot\'s balloon takes the column line\'s place');
  // a move picked up (a reload, ‹, Camp) between a lend and its get: the store at rest, the lender's piece resting unopened
  const pq = mst(Object.assign({}, DEF), [[43, 16]]);
  walk(pq, DEF, ['t1', '3']);
  const PQ = T.question(pq);
  assert.deepEqual(U.stageAt(PQ), { col: 0, spreads: 1, half: true });
  assert.equal(E.takePicture(DEF, PQ, U.stageAt(PQ)).spread.stage, 'out');
  assert.ok(page.includes("    function storeNowM() { var po = E.takePicture(def, qAt(), takeStageAt(q)); if (po && litZone()) po.glow = litZone(); paintStore(po); }"), 'never a slide replayed');
  assert.ok(page.includes("        var F = takeFirst(def, q, { intro: firstIntro, fill: fill }), F0 = takeFirst(def, q, { intro: firstIntro, fill: fill, line: '' });"));
});

test('U1. the marks page (takeMarksFlow, takeMarksHtml, marksPage): one line at a time, its picture lifting; no button live before the last line; a pick saves and presses (a ring, a check, aria-pressed) and its answer line takes the question\'s place; through it the other switches; a button never goes on, the stack or the panel does; Read to me says the lines, then the labels; stacked on a phone held upright; the shelf\'s My marks opens it', () => {
  const page13 = E.takeMarksPage(stub.sets().ch13.def, null);
  assert.deepEqual(page13.lines.map((b) => b.who + ': ' + b.text), ['chispapaw: My little Tall One writes it like THIS.', 'chispapaw: A little 1 in front!', 'tallyheart: Some write the new number on top instead.', 'tallyheart: Both are right. Which way do YOU like?']);
  assert.deepEqual([0, 1, 2, 3].map((k) => U.marksGlow(page13, k)), ['one', 'one', 'above', 'both'], 'Chispapaw\'s with the little 1, Tallyheart\'s with the top, both with her last');
  const kit = E.takeMarksPage({ teacher: 'tallyheart' }, null);
  assert.deepEqual([0, 1].map((k) => U.marksGlow(kit, k)), ['both', 'both']);
  const log = [];
  let waiting = null, saved = null;
  const h = { show: (L, g) => log.push(['show', L.map((b) => b.text).join(' | '), g]), live: () => log.push(['live']), press: (s) => log.push(['press', s]), save: (s) => { saved = s; },
    wait: (items, fn) => { waiting = fn; }, hush: () => { waiting = null; }, labels: () => log.push(['labels']), goOn: () => log.push(['goOn']) };
  const F = U.marksFlow({ page: page13 }, h);
  F.start();
  assert.deepEqual(log.pop(), ['show', 'My little Tall One writes it like THIS.', 'one']);
  assert.equal(F.pick('one'), false, 'no button live before the last line');
  F.tap();                                   // the stack: the next line at once
  assert.equal(F.state().at, 1);
  waiting(); waiting();                      // two reading times
  assert.equal(F.state().at, 3);
  assert.equal(F.state().live, false, 'the last line shown, its reading time not yet out');
  assert.equal(F.pick('above'), false);
  waiting();
  assert.deepEqual(log.slice(-2), [['live'], ['labels']], 'live, then Read to me\'s labels');
  assert.equal(F.pick('one'), true);
  assert.equal(saved, 'one');
  assert.deepEqual(log.slice(-2), [['press', 'one'], ['show', 'My little Tall One writes it like THIS. | A little 1 in front! | Some write the new number on top instead. | Just like my little Tall One!', 'one']]);
  assert.equal(F.pick('above'), true, 'through the answer line the other switches');
  assert.equal(saved, 'above');
  assert.ok(!log.some((x) => x[0] === 'goOn'), 'a button never goes on');
  F.tap();
  assert.deepEqual(log.pop(), ['goOn'], 'the stack or the panel does');
  // the shelf's: every line and both live at once, a pick never goes on
  const log2 = [], F2 = U.marksFlow({ page: kit, live: true, stay: true }, Object.assign({}, h, { show: () => {}, live: () => log2.push('live'), labels: () => {}, goOn: () => log2.push('goOn'), wait: () => log2.push('wait') }));
  F2.start(); F2.pick('one'); F2.tap();
  assert.deepEqual(log2, ['live']);
  // the pictures: 43 − 16 done in each style, its answer 2 7 in plain boxes, the receiver's mark haloed, the label under it
  const H = U.marksHtml({ options: page13.options, live: false, pressed: null, glow: 'one' });
  assert.deepEqual((H.match(/data-style="(\w+)"/g) || []), ['data-style="one"', 'data-style="above"'], 'the little 1 on the left');
  assert.equal((H.match(/aria-pressed="false"/g) || []).length, 2);
  assert.equal((H.match(/aria-disabled="true"/g) || []).length, 2, 'not live');
  assert.match(H, /<button class="tpb tglowing" type="button" data-style="one"/);
  assert.match(H, /<span class="tfront thalo">1<\/span>3<\/span>/, '¹3, haloed');
  assert.match(H, /<span class="tdig ttop tstruck" data-col="0" aria-hidden="true" style="grid-column:3">3<\/span>/, 'the struck 3 under 13');
  assert.match(H, /<span class="tmv thalo">13<\/span>/);
  assert.equal((H.match(/class="tbox plain" data-col="0" role="img" aria-label="ones: 7"/g) || []).length, 2);
  assert.ok(H.includes('<span class="tlbl">A little 1 in front</span>') && H.includes('<span class="tlbl">The new number on top</span>'));
  const P = U.marksHtml({ options: page13.options, live: true, pressed: 'above' });
  assert.ok(P.includes('<div class="tpick tlive" role="group">') && P.includes('data-style="above" aria-pressed="true"') && !P.includes('aria-disabled'));
  assert.ok(HTML.includes('.tpick .tpb[aria-pressed="true"]{box-shadow:0 0 0 5px var(--gold)') && HTML.includes('.tpick .tpb[aria-pressed="true"] .tcheck{display:block}'), 'the ring and the check');
  assert.ok(HTML.includes('@media (orientation: portrait) and (max-width: 560px){\n  .tpick{flex-direction:column;align-items:center;gap:8px}'), 'stacked on a phone held upright');
  assert.ok(HTML.includes('.tpick .tpb .tcol{font-size:clamp(29px, min(4.2vw, 4.4vh), 40px)}'), 'sized by font-size, at least the phone column\'s 29px');
  // the page's wiring: before the prompt of a problem that spreads, her style unset; Read to me's order; the shelf and its ‹
  const page = fnSrc(UI_SRC, 'runTakes');
  assert.ok(page.includes('        if (needMarks()) return marksPhase(ask);'));
  assert.ok(page.includes("        show: function (list, g) { say(list); saying(heard(list).concat(labels)); mp.glow(g); },"), 'Read to me: the lines, then the labels');
  assert.ok(page.includes("        save: function (s) { st.style = s; if (keep) { E.setTakeStyle(cat, s); persist(); } else { o.style = s; if (dbg) dbg.marks = false; } },"), 'saved in play; PC.debug.takes writes nothing to the test cat');
  assert.ok(page.includes("      pad"), 'the page');
  const mpSrc = fnSrc(UI_SRC, 'marksPage');
  assert.ok(mpSrc.includes("      if (!wrap.classList.contains('tlive') || !pickFn) return;"), 'a button answers only while live');
  const sh = fnSrc(UI_SRC, 'renderShelf');
  assert.ok(sh.includes("    if (marksOn) $('marksBtn').addEventListener('click', function () { go('hollow', { marks: true, from: view.opts.from, vol: view.opts.vol, stories: opts.stories }); });"));
  assert.ok(sh.includes("    var marksOn = E.takeSteps(cat, opts.stories || stories()).indexOf('ones2') >= 0 || !!(cat.takes && (cat.takes.style === 'one' || cat.takes.style === 'above'));"));
  const rh = fnSrc(UI_SRC, 'renderHollow');
  assert.ok(rh.indexOf('    if (opts && opts.marks) return renderMarks(opts);') > 0 && rh.indexOf('    if (opts && opts.marks) return renderMarks(opts);') < rh.indexOf('    var SH = opts && opts.counts'), 'beside { counts: true }, before var HW');
  assert.ok(fnSrc(UI_SRC, 'renderMarks').includes("    var mp = marksPage($('marksPick'), { page: page, live: true, pressed: page.current });"), 'the kit\'s lines, both live, her style pressed');
  assert.ok(fnSrc(UI_SRC, 'onBack').includes("    if (n === 'hollow' && hollowSub === 'marks') return go('hollow', { from: view.opts.from, vol: view.opts.vol, back: true, stories: view.opts.stories });\n    if (n === 'hollow' && hollowSub === 'counts')"), '‹ back to the shelf');
  assert.equal((UI_SRC.match(/counts: true/g) || []).length, 1, 'One Count at a time still the one way to its page');
  const back = [];
  new Function('view', 'hollowSub', 'go', 'E', 'cat', 'story', 'persist', fnSrc(UI_SRC, 'onBack') + 'return onBack;')({ name: 'hollow', opts: { marks: true, from: 'hub' } }, 'marks', (n, o) => back.push([n, o]), E, null, null, () => {})();
  assert.deepEqual(back, [['hollow', { from: 'hub', vol: undefined, back: true, stories: undefined }]]);
});

test('the grown-ups corner under the moves: "Marks right" between "Right first time" and "Helped" and a note on what a mark is, once a row has moves; "In her head first: N"; the move slips\' words; her marks\' line once she has learned to spread a row or has chosen', () => {
  const cat = E.blankCat({ now: 1 }), def = stub.sets().ch13.def, st = mst(def, [[43, 16], [52, 27], [97, 52]], 'one', stub.sets().ch13.taught), clock = { t: 1e6 };
  // 43 − 16 with a `lend` slip, 52 − 27 answered first (`ahead`), 97 − 52 right
  const add = (rs) => rs.forEach((r) => { if (r && r.entry) E.logTake(cat, r.entry); });
  add(walk(st, def, ['t1', '2', '1', '7', '2'], clock));
  add(walk(st, def, ['5', 't1', '4', '1', '', '2'], clock));
  add(walk(st, def, ['5', '4'], clock));
  E.setTakeStyle(cat, 'one');
  const K = U.corner(cat.takes, E.takeTable(cat), undefined, ['none', 'ones2']);
  assert.ok(K.html.includes('<th>Right first time</th><th>Marks right</th><th>Helped</th>'), K.html);
  assert.ok(K.html.includes('“Marks right” is how many of them'), 'what a mark is');
  assert.match(K.html, /<td>Regroup a ten<\/td><td>2<\/td><td>0&nbsp;of&nbsp;2<\/td><td>3&nbsp;of&nbsp;4<\/td><td>1<\/td>/, 'her own first asks\' numbers right first time');
  assert.ok(K.html.includes('<td>new number for the one that gave</td>'), K.html);
  assert.ok(K.html.includes('<p class="muted">In her head first: 1</p>'));
  assert.ok(K.html.endsWith('<p class="muted">Her marks: a little 1 in front (¹3), her choice. She can change it in the Training Hollow (My marks).</p>'));
  delete cat.takes.style;
  assert.ok(U.corner(cat.takes, E.takeTable(cat), undefined, ['none', 'ones2']).html.endsWith('<p class="muted">Her marks: not chosen yet (on top until she does).</p>'));
  assert.ok(!U.corner(cat.takes, E.takeTable(cat), undefined, ['none']).html.includes('Her marks:'), 'not before she learns to spread a row');
});

test('PC.debug.takes\' new screens (the tools\' take:touch … hollow:marks), on definitions of their own (chapter 13\'s marks lines inline, or PC.story.ch13\'s), every step taught; take:first as it was (no taught); its spread screens v0.4; nothing saved', () => {
  const dbg = fnSrc(UI_SRC, 'takesDebug');
  assert.ok(dbg.includes("    var st = E.takes.start(def, v4 ? { set: def.id, mode: 'chapter', now: t, logged: 5, taught: E.TAKE_STEPS.slice(), style: o.style } : { set: def.id, mode: 'chapter', now: t, logged: 5 });"));
  assert.ok(dbg.includes("    var v4 = what !== 'first';"));
  assert.ok(dbg.includes("      if (what === 'hollow:marks') { go('hollow', { from: 'hub', marks: true, stories: list }); return $('marksPick') ? true : 'takes: no marks page drawn (a round in the slot?)'; }"));
  assert.ok(!dbg.includes('persist()'));
  const marks = new Function('return ' + /var TAKE_DEBUG_MARKS = (\{[\s\S]*?\] \});/.exec(UI_SRC)[1])();
  assert.deepEqual(marks, stub.MARKS13, 'chapter 13\'s lines, as its spec has them');
  assert.ok(fnSrc(UI_SRC, 'takeDebugMarks').includes("var ch = PC.story && PC.story.ch13"));
});
