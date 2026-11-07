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
 * phone held sideways's panel on the screen). */
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
  assert.match(html, /class="tbox on" role="img" aria-label="ones: 5" aria-current="true" style="grid-column:4">5<\/span>/);
  assert.match(html, /class="tbox" role="img" aria-label="hundreds" style="grid-column:2"> <\/span>/, 'an empty box keeps its height');
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
  assert.ok(UI_SRC.includes("function plain(s) { return takeMinus(String(s == null ? '' : s).replace(/\\*+/g, '').replace(/×/g, ' times ')); }"));
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
  assert.ok(page.includes("      takeReserve(def, q, { intro: firstAsk ? firstIntro : [], fill: fill, echo: echoAt }).forEach(function (L) {"));
  assert.ok(page.includes("      if (max) stack.style.minHeight = max + 'px';"));
  assert.ok(page.includes("      stack.innerHTML = '';\n      reserve();\n      outline(true);\n      fit();\n      bringPad();"), 'measured on the first column, then the fallbacks, then the keypad into view');
  assert.ok(page.includes("      phase = 'end'; echoLines = []; on = -1; glowCol = -1;\n      stack.style.minHeight = '';"), 'released at the problem\'s end');
  assert.ok(HTML.includes('grid-template-rows:var(--th) .54em 1em 1em 10px auto'), 'every row of the column reserved from the start');
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
  assert.ok(page.includes("      tapZone(d && +d.getAttribute('data-col') === TAKE_ZONES.indexOf(tapWant) ? tapWant : 'off');"));
  assert.ok(page.includes("      if (phase === 'tap') { if (k !== 'del') wiggle(); return; }   // a digit before the spread types nothing"));
  assert.ok(page.includes("      else if (e.key === ' ') { if (phase === 'tap') { e.preventDefault(); tapZone(tapWant); }"));
  assert.ok(HTML.includes('.frame[data-mode="take"] .keypad.dim .key{opacity:.45}'));
  // the engine's side: a tap off the zone says "up here" once; a digit first is ignored
  const def = Object.assign({}, DEF, { facts: [{ a: 43, b: 16, regroup: 'tap' }] }), st = T.start(def, { now: 1 });
  assert.equal(T.tap(st, true).say, true);
  assert.equal(T.tap(st, true).say, false);
  assert.deepEqual(T.digit(st, def, 3, 0, 5000), { ignored: 'tap' });
  assert.deepEqual(E.takeShow(def, plan(43, 16), 0, { mode: 'tap' }).here, { tens: 'The rows: up here.' });
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
  assert.ok(UI_SRC.includes("  var TAKE_DEBUG = { first: 1, q: 1, show: 1, tap: 1, spread: 1, echo: 1, sand: 1, done: 1, shelf: 1, store: 1 };"));
  const dbg = fnSrc(UI_SRC, 'takesDebug');
  assert.ok(dbg.includes("if (what === 'shelf') { go('hollow', { from: 'hub', stories: list }); return $('storeBtn') ? true : 'takes: no shelf drawn (a round in the slot?)'; }"));
  assert.ok(dbg.includes("var r = E.takeRoundStart(cat, stories(), now(), { stories: list });") && dbg.includes('storeLesson(r.state, false, null, true);'), 'the store round in debug mode: nothing saved');
  assert.ok(!dbg.includes('persist()'), 'PC.debug.takes never saves');
  assert.ok(fnSrc(UI_SRC, 'storeLesson').includes("mode: debug ? 'debug' : 'hollow'"));
  // a chapter's take set runs on the take page, with the lesson's options and its end
  const scl = fnSrc(UI_SRC, 'startChapterLesson');
  assert.ok(scl.includes("    if (st && st.op === '-') return runTakes({ def: def, state: st, intro: intro, mode: 'chapter', waitLine: wWait, onDone: onDone });\n    runLesson({ def: def, state: st, intro: intro, mode: 'chapter', waitLine: wWait, onDone: onDone });"));
  assert.ok(scl.indexOf('var wWait') < scl.indexOf('runTakes({'), 'the waiting line over a take lesson too');
});

test('nothing a player can reach changes: runLesson, the keypad and go() as in v23; index.html without its take block is v23\'s byte for byte, and every rule of the block is the take page\'s own', () => {
  assert.equal(sha(fnSrc(UI_SRC, 'runLesson')), 'bb1bc1dcd23ad9e5b34d4d1a0a113faeaef287c9fde99d30ce22f810ed22e3cb');
  assert.equal(sha(fnSrc(UI_SRC, 'keypadPress')), 'b688cdd8019dd93755828b17f11ccfcf37afecb3cd9069b4ab4232bc450c2350');
  assert.equal(sha(fnSrc(UI_SRC, 'go')), '4ea06e5f48bfda23d68d1a0c5726b3038fdcbc13b3c5549fb8494e38ac6d9254');
  const start = HTML.indexOf('/* ---------- the take-aways kit: the take page'), end = HTML.indexOf('</style>');
  assert.ok(start > 0 && end > start);
  // (book two's block, docs/take-aways.md section 7, follows the take block before </style>: tests/book2-ui.test.js has it)
  const two = HTML.indexOf('/* ---------- book two ('), block = HTML.slice(start, two > start ? two : end);
  assert.equal(sha(HTML.slice(0, start) + HTML.slice(end)), 'ed069d652c0b7bea405c26063a7d39cf9459a2a7ac07c01bc22c172fba23a028', 'v23\'s index.html');
  const own = /^(\.frame\[data-mode="take"\]|html:has\(\.frame\[data-mode="take"\]\)|\.tcol|\.thead|\.tmark|\.tdig|\.ttop|\.tbot|\.tsign|\.trule|\.tbox|\.tstruck|\.tshelf|(html\.big )?\.frame\[data-mode="shelf"\])/;
  const sels = [];
  block.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@keyframes [a-z]+\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g, '').replace(/@media[^{]*\{/g, '').split('}').forEach((r) => {
    const sel = r.split('{')[0].trim();
    if (sel) sel.split(/,(?![^(]*\))/).forEach((s) => sels.push(s.trim()));
  });
  assert.ok(sels.length > 30);
  sels.forEach((s) => assert.match(s, own, s));
  (block.match(/@keyframes ([a-z]+)/g) || []).forEach((k) => assert.match(k, /@keyframes t[a-z]+/));
  // and none of the take page's classes is used by any other page
  ['tcol', 'thead', 'tmark', 'tbox', 'tstruck', 'tnohead', 'tkeys', 'tshelf', 'storeicon'].forEach((c) => {
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
    '.tmark{grid-row:2;justify-self:center;align-self:end;font-size:.5em;color:var(--gold);text-shadow:2px 2px 0 var(--ink)}',
    '.tstruck::after{content:"";position:absolute;left:50%;top:-.04em;height:1.08em;width:3px;margin-left:-1.5px;border-radius:2px;background:var(--ink);box-shadow:0 0 0 1.5px var(--cream);transform:rotate(32deg)}',
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
  assert.ok(sh.includes("$('countsBtn').addEventListener('click', function () { go('hollow', { counts: true, from: view.opts.from, stories: opts.stories }); });"));
  assert.ok(sh.includes("      var r = E.takeRoundStart(cat, stories(), now(), { stories: opts.stories });\n      E.holdLesson(cat);"));
  assert.ok(sh.includes("say: [{ who: 'tallyheart', text: SH.line }]"), 'the waiting line in the greeting\'s place (E.hollowShelf)');
  assert.ok(sh.includes('<i class="storeicon" aria-hidden="true">'));
  assert.ok(sh.includes("scr.querySelector('.frame').setAttribute('data-mode', 'shelf');"), 'its own mode, for the phone held sideways');
  const ph = HTML.indexOf('@media (orientation: landscape) and (max-height: 500px){\n  .frame[data-mode="shelf"]{grid-template-areas:"top stack" "int stack" "int panel";');
  assert.ok(ph > 0, 'on a phone held sideways the shelf\'s stack over the panel');
  const back = fnSrc(UI_SRC, 'onBack');
  assert.ok(back.includes("    if (n === 'hollow' && hollowSub === 'counts') return go('hollow', { from: view.opts.from, back: true, stories: view.opts.stories });\n    if (n === 'hollow' || n === 'nest') return go("));
  assert.equal(sha(fnSrc(UI_SRC, 'go')), '4ea06e5f48bfda23d68d1a0c5726b3038fdcbc13b3c5549fb8494e38ac6d9254', 'no new view');
  // a store round on the take page, the slot kept as a Hollow round's; its reward goes back to the shelf
  const sl = fnSrc(UI_SRC, 'storeLesson');
  assert.ok(sl.includes("intro: resume ? (waiting ? [{ who: 'tallyheart', text: waiting }] : []) : [{ who: 'tallyheart', text: def.intro }],"));
  assert.ok(fnSrc(UI_SRC, 'runTakes').includes('      else cat.lesson = { mode: o.mode, state: st };'), 'kept as { mode: \'hollow\', state }');
  const sr = fnSrc(UI_SRC, 'storeReward');
  assert.ok(sr.includes("$('againBtn').addEventListener('click', function () { go('hollow', { from: 'hub', reward: true }); });"));
  assert.ok(sr.includes("hollowScene('tree', [], ['sparkle'])"), 'the tree insert, no glow');
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
  assert.ok(K.html.startsWith('<h4>Take-aways</h4><div class="scroll"><table><thead><tr><th>Kind</th><th>Problems</th><th>Right first time</th><th>Helped</th><th>Typical time</th><th>Commonest slip</th></tr></thead>'));
  assert.ok(K.html.includes('<td>Regroup a ten</td>') && K.html.includes('<td>a fact slipped</td>'), K.html);
  assert.ok(K.html.includes('<td>Across a zero</td>') && K.html.includes('<td>No regrouping</td>'));
  assert.ok(K.html.includes('<p class="muted">Teen facts missed: 13 − 6 ×1</p>'), K.html);
  assert.equal(U.corner({ log: [], rounds: 0, cleanRounds: 0 }, { rows: [], teen: [] }).html, '<h4>Take-aways</h4><p class="muted">No take-aways yet.</p>');
  // the page: only for a cat with `takes`, after the Counts' tables, on the Training Hollow's line
  const og = fnSrc(UI_SRC, 'openGrownups');
  assert.ok(og.includes("      var TC = c.takes && typeof E.takeTable === 'function' ? takeCorner(c.takes, E.takeTable(c), fmtMs) : null;\n      if (TC) hollowTxt += '; ' + TC.line;"));
  assert.ok(og.indexOf("'<p class=\"muted\">No answers yet.</p>') +\n        (TC ? TC.html : '') +") > og.indexOf('E.factTables(c, stories())'));
});
