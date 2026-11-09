// The take-aways kit's pictures (docs/take-aways.md v0.3, section 9, test 16): PC.art.placeValue (the store) for 0 to
// 999 and every spread stage, with and without `fresh` (10, and 9 after a chain), as prey and as marks, glowing and
// small, each drawing within its box with the right number of each piece; PC.art.sand's `kind: 'quick'` (the help's
// sand) for hand-written options, every crossed, fresh, take and lit count a help can make, a crossed line among the
// fresh ones across a zero with them; neither throws; every existing PC.art.sand call draws byte for byte as on v23;
// art.kit.quick and art.quickMarks draw the same marks; and the gallery's take-aways section draws every panel.
// The option objects are section 8's, pinned before phase 1: these tests draw hand-written ones (the cross-check that
// the engine's E.takeHelp steps draw is the UI owner's, tests/takes-ui.test.js, phase 2).
// v0.4 (decision 57; ~/potomac-crossing-work/regroup/plan.md, the art owner, proof A1): placeValue's resting stage,
// `spread.stage: 'out'` (E.takePicture's `half`, between her lend and her get), static, for a row, a square and a zero's
// row, Reduce Motion the same drawing; and every option and stage before it byte for byte (the pin's hash, taken from
// the tree before the change: e000777's cats.js).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
const art = PC.art;

// Tag balance: every opening tag is closed in order; self-closing tags stand alone (as tests/cats.test.js checks)
function balanced(svg) {
  const stack = [], re = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(svg))) { const [, close, name, , self] = m; if (self) continue; if (close) { const top = stack.pop(); if (top !== name) return `</${name}> closes <${top}>`; } else stack.push(name); }
  if (stack.length) return 'unclosed <' + stack.join('>, <') + '>';
  return /[<>]/.test(svg.replace(re, '')) ? 'stray angle bracket' : null;
}
function viewBox(svg) { const m = /^<svg [^>]*viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/.exec(svg); assert.ok(m, 'an <svg> with a viewBox'); return m.slice(1).map(Number); }
// every piece group: its kind, its classes and its box
function pieces(svg) {
  const out = [], re = /<g class="pc-pv-(square|row|loose)([^"]*)" data-box="([-\d. ]+)"/g;
  let m;
  while ((m = re.exec(svg))) { const cls = m[2].trim().split(/\s+/).filter(Boolean), b = m[3].split(' ').map(Number); out.push({ kind: m[1], cls, box: { x: b[0], y: b[1], w: b[2], h: b[3] } }); }
  return out;
}
function marks(svg) {
  const out = [], re = /<g class="pc-quick-(square|line|dot)([^"]*)" data-box="([-\d. ]+)"/g;
  let m;
  while ((m = re.exec(svg))) { const cls = m[2].trim().split(/\s+/).filter(Boolean), b = m[3].split(' ').map(Number); out.push({ what: m[1], cls, box: { x: b[0], y: b[1], w: b[2], h: b[3] } }); }
  return out;
}
const has = (p, c) => p.cls.includes('pc-pv-' + c);
function inside(b, vb, label) {
  const [x0, y0, w, h] = vb;
  assert.ok(b.x >= x0 - 0.05 && b.y >= y0 - 0.05 && b.x + b.w <= x0 + w + 0.05 && b.y + b.h <= y0 + h + 0.05, label + ': a piece at ' + JSON.stringify(b) + ' leaves the picture ' + vb.join(' '));
}
function wellFormed(svg, label) {
  assert.equal(typeof svg, 'string', label);
  assert.ok(svg.startsWith('<svg ') && svg.endsWith('</svg>'), label + ': one <svg>');
  const bad = balanced(svg);
  assert.equal(bad, null, label + ': ' + bad);
  assert.ok(!/NaN|undefined|Infinity|null/.test(svg), label + ': a number went wrong');
  assert.ok(!/ id="/.test(svg), label + ': no ids (many pictures share a page)');
  assert.ok(!/pc-next|pc-tap|data-tap|<script/.test(svg), label + ': nothing the Counts page or the one-tap frames would pick up');
}
const digits = (n) => ({ hundreds: Math.floor(n / 100), tens: Math.floor(n / 10) % 10, ones: n % 10 });

// ---------------------------------------------------------------- PC.art.placeValue

test('the store, 0 to 999 as written: the right number of squares, rows and loose, each within the picture; the squares\' zone only when there are squares', () => {
  for (let n = 0; n <= 999; n++) {
    const d = digits(n), svg = art.placeValue(d), vb = viewBox(svg), ps = pieces(svg);
    if (n % 37 === 0) wellFormed(svg, 'store ' + n);
    assert.deepEqual([ps.filter((p) => p.kind === 'square').length, ps.filter((p) => p.kind === 'row').length, ps.filter((p) => p.kind === 'loose').length], [d.hundreds, d.tens, d.ones], 'store ' + n);
    assert.ok(ps.every((p) => p.cls.length === 0), 'store ' + n + ': nothing fresh, taken or moving');
    for (const p of ps) inside(p.box, vb, 'store ' + n);
    assert.equal(vb[2], 1600, 'one width');
    const zones = (svg.match(/class="pc-zone" data-zone="(\w+)"/g) || []).map((z) => z.match(/"(\w+)"$/)[1]);
    assert.deepEqual(zones, d.hundreds ? ['hundreds', 'tens', 'ones'] : ['tens', 'ones'], 'store ' + n + ': its zones');
  }
});

test('the store as marks, 0 to 999: squares, lines and dots on sand in the same zones, never prey', () => {
  for (let n = 0; n <= 999; n += 7) {
    const d = digits(n), svg = art.placeValue(Object.assign({ kind: 'marks' }, d)), vb = viewBox(svg), ps = pieces(svg);
    if (n % 91 === 0) wellFormed(svg, 'marks ' + n);
    assert.deepEqual([ps.filter((p) => p.kind === 'square').length, ps.filter((p) => p.kind === 'row').length, ps.filter((p) => p.kind === 'loose').length], [d.hundreds, d.tens, d.ones], 'marks ' + n);
    for (const p of ps) inside(p.box, vb, 'marks ' + n);
    assert.ok(!/#AE998A|#8E6448/.test(svg), 'marks ' + n + ': no prey colours');
  }
});

// Every state a problem's store passes through, worked by hand the way section 3's plan goes (ones first; a column
// short of its bottom spreads from the next; a zero there spreads from the one after it first, the square into ten
// rows, then a row), for every top 100 to 999 and a bottom digit that makes each turn spread: a list of
// { o, label } with `fresh`, `taken` and each spread at its three stages.
function storeStates(top) {
  const out = [], h0 = Math.floor(top / 100), t0 = Math.floor(top / 10) % 10, u0 = top % 10;
  let st = { hundreds: h0, tens: t0, ones: u0, fresh: { tens: 0, ones: 0 }, taken: { hundreds: 0, tens: 0, ones: 0 } };
  const snap = (extra, label) => out.push({ o: Object.assign(JSON.parse(JSON.stringify(st)), extra || {}), label: top + ' ' + label });
  const spread = (from, to, label) => { for (const stage of ['slide', 'open', 'end']) snap({ spread: { from, to, stage } }, label + ' ' + stage); };
  snap(null, 'as it opens');
  // the ones' turn: a bottom of 9 always needs a spread unless the ones are 9
  if (u0 < 9) {
    if (st.tens === 0 && st.hundreds > 0) {
      st.hundreds--; st.tens = 10; st.fresh.tens = 10; spread('hundreds', 'tens', 'a square into rows');
      st.tens = 9; st.fresh.tens = 9; st.ones += 10; st.fresh.ones = 10; spread('tens', 'ones', 'a row on, across the zero');
    } else if (st.tens > 0) {
      st.tens--; st.ones += 10; st.fresh.ones = 10; spread('tens', 'ones', 'a row into loose');
    }
  }
  st.taken.ones = Math.min(st.ones, 9); snap(null, 'the ones taken');
  // the tens' turn: a bottom of 9 needs a square unless the tens are 9 or more
  if (st.tens < 9 && st.hundreds > 0) { snap({ glow: 'hundreds' }, 'tap the squares'); st.hundreds--; st.tens += 10; st.fresh.tens = st.fresh.tens || 10; spread('hundreds', 'tens', 'a square into rows at the tens'); }
  st.taken.tens = Math.min(st.tens, 9); snap(null, 'the tens taken');
  st.taken.hundreds = Math.min(st.hundreds, 1); snap(null, 'the hundreds taken');
  return out;
}

test('the store through every problem\'s turns, every other top from 100 to 999: fresh blocks of 10 and of 9 (one place empty), taken old first, each spread sliding then opening, every piece within the picture', () => {
  let n = 0;
  for (let top = 100; top <= 999; top += 2) {
    for (const { o, label } of storeStates(top)) {
      const svg = art.placeValue(o), vb = viewBox(svg), ps = pieces(svg);
      if (top % 61 === 0) wellFormed(svg, label);
      for (const p of ps) inside(p.box, vb, label);
      const moving = ps.filter((p) => has(p, 'moving')), sp = o.spread && o.spread.stage !== 'end' ? o.spread : null;
      const want = { hundreds: o.hundreds, tens: o.tens, ones: o.ones };
      // a spread in flight is the `to` zone's fresh block: one row (or square) sliding, or its ten opening
      if (sp && sp.stage === 'slide') {
        assert.equal(moving.length, 1, label);
        assert.equal(moving[0].kind, sp.from === 'hundreds' ? 'square' : 'row', label);
        want[sp.to] -= o.fresh[sp.to];
        want[sp.from] += 1;
      } else if (sp) {
        assert.equal(moving.length, 10, label);
        assert.ok(moving.every((p) => p.kind === (sp.to === 'tens' ? 'row' : 'loose') && has(p, 'fresh')), label);
      } else assert.equal(moving.length, 0, label);
      const count = (k) => ps.filter((p) => p.kind === k && !has(p, 'empty')).length;
      assert.deepEqual([count('square'), count('row'), count('loose')], [want.hundreds, want.tens, want.ones], label + ': the pieces');
      // fresh and taken, and what is left
      if (!sp) {
        for (const [z, k] of [['tens', 'row'], ['ones', 'loose']]) {
          const fr = ps.filter((p) => p.kind === k && has(p, 'fresh') && !has(p, 'empty'));
          assert.equal(fr.length, o.fresh[z], label + ': ' + z + ' fresh');
          if (z === 'tens' && o.fresh.tens === 9) assert.equal(ps.filter((p) => p.kind === 'row' && has(p, 'empty')).length, 1, label + ': nine, one place empty');
          const tk = ps.filter((p) => p.kind === k && has(p, 'taken'));
          assert.equal(tk.length, o.taken[z], label + ': ' + z + ' taken');
          // the old pieces first: a fresh piece is taken only when every old one is
          const old = ps.filter((p) => p.kind === k && !has(p, 'fresh'));
          if (tk.some((p) => has(p, 'fresh'))) assert.ok(old.every((p) => has(p, 'taken')), label + ': ' + z + ' old first');
        }
        assert.equal(ps.filter((p) => p.kind === 'square' && has(p, 'taken')).length, o.taken.hundreds, label + ': squares taken');
      }
      n++;
    }
  }
  assert.ok(n > 4500, 'states drawn: ' + n);
});

test('a spread\'s end draws what no spread draws; its CSS slide and open are all under prefers-reduced-motion: no-preference, one animation for each moving piece', () => {
  const landed = { hundreds: 4, tens: 9, ones: 13, fresh: { tens: 9, ones: 10 } };
  assert.equal(art.placeValue(Object.assign({ spread: { from: 'tens', to: 'ones', stage: 'end' } }, landed)), art.placeValue(landed));
  assert.equal(art.placeValue(Object.assign({ spread: null }, landed)), art.placeValue(landed));
  assert.ok(!/<style/.test(art.placeValue(landed)), 'nothing moves, no style');
  for (const [o, n, ms] of [[{ hundreds: 4, tens: 10, ones: 3, fresh: { tens: 10 }, spread: { from: 'hundreds', to: 'tens', stage: 'slide' } }, 1, 600],
    [{ hundreds: 4, tens: 10, ones: 3, fresh: { tens: 10 }, spread: { from: 'hundreds', to: 'tens', stage: 'open' } }, 10, 400],
    [Object.assign({ spread: { from: 'tens', to: 'ones', stage: 'slide' } }, landed), 1, 600],
    [Object.assign({ spread: { from: 'tens', to: 'ones', stage: 'open' } }, landed), 10, 400],
    [Object.assign({ kind: 'marks', spread: { from: 'tens', to: 'ones', stage: 'open' } }, landed), 10, 400]]) {
    const svg = art.placeValue(o), label = JSON.stringify(o);
    wellFormed(svg, label);
    const css = /<style>@media \(prefers-reduced-motion: no-preference\)\{(.*)\}<\/style>/.exec(svg);
    assert.ok(css, label + ': the animation is all inside the media query');
    const used = [...svg.matchAll(/<g class="(pcpv-[\w]+)">/g)].map((m) => m[1]);
    assert.equal(used.length, n, label + ': one animated group a moving piece');
    for (const nm of new Set(used)) {
      assert.ok(css[1].includes('.' + nm + '{animation:' + nm + ' ' + ms + 'ms'), label + ': ' + nm + ' runs ' + ms + ' ms');
      assert.ok(css[1].includes('@keyframes ' + nm + '{from{transform:translate('), label + ': ' + nm + '\'s keyframes');
      assert.ok(/to\{transform:translate\(0px,0px\) scale\(1\)\}/.test(css[1]), label + ': it ends where the piece is drawn');
    }
    // the same picture draws the same bytes (names come from the distances, never a counter)
    assert.equal(art.placeValue(o), svg, label + ': the same bytes twice');
  }
});

test('the glow: the zone the tap page asks for, lit over the picture\'s full height; the tap targets cover the picture, one a zone', () => {
  for (const [o, z] of [[{ hundreds: 4, tens: 1, ones: 8, taken: { ones: 2 }, glow: 'hundreds' }, 'hundreds'], [{ hundreds: 0, tens: 4, ones: 3, glow: 'tens' }, 'tens'],
    [{ hundreds: 0, tens: 4, ones: 3, glow: 'tens', kind: 'marks' }, 'tens'], [{ hundreds: 5, tens: 0, ones: 3, glow: 'hundreds', kind: 'marks' }, 'hundreds']]) {
    const svg = art.placeValue(o), vb = viewBox(svg), label = JSON.stringify(o);
    wellFormed(svg, label);
    const g = /<rect class="pc-pv-glow pcs-pulse" x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)"/.exec(svg);
    assert.ok(g, label + ': one glow');
    assert.equal((svg.match(/pc-pv-glow/g) || []).length, 1);
    assert.ok(+g[4] >= vb[3] - 12.5, label + ': the full height');
    const zones = [...svg.matchAll(/<rect class="pc-zone" data-zone="(\w+)" x="([\d.]+)" y="([\d.-]+)" width="([\d.]+)" height="([\d.]+)"/g)].map((m) => ({ id: m[1], x: +m[2], w: +m[4], h: +m[5] }));
    assert.equal(zones[0].x, 0);
    zones.forEach((zz, i) => { assert.equal(zz.h, vb[3]); if (i) assert.ok(Math.abs(zones[i - 1].x + zones[i - 1].w - zz.x) < 0.11, 'no gap between targets'); });
    assert.ok(Math.abs(zones[zones.length - 1].x + zones[zones.length - 1].w - vb[2]) < 0.11, 'to the right edge');
    const zr = zones.find((zz) => zz.id === z);
    assert.ok(+g[1] + +g[3] / 2 > zr.x && +g[1] + +g[3] / 2 < zr.x + zr.w, label + ': over its zone');
  }
  assert.ok(!/pc-pv-glow/.test(art.placeValue({ hundreds: 4, tens: 1, ones: 8 })), 'no glow unless asked');
});

test('small, for a book page: cropped to its pieces, nothing reserved for a spread that did not happen', () => {
  for (const n of [133, 7, 40, 905, 999, 100]) {
    const d = digits(n), big = art.placeValue(d), svg = art.placeValue(Object.assign({ small: true }, d)), vb = viewBox(svg), ps = pieces(svg);
    wellFormed(svg, 'small ' + n);
    assert.ok(vb[3] < viewBox(big)[3], 'small ' + n + ' is shorter: ' + vb[3]);
    assert.equal(ps.length, d.hundreds + d.tens + d.ones);
    for (const p of ps) inside(p.box, vb, 'small ' + n);
    assert.ok(!/pc-pv-tray/.test(svg), 'small ' + n + ': no tray');
  }
});

test('junk in, a picture out: numbers clamped, counts within their zones, never a throw', () => {
  for (const o of [undefined, null, {}, { hundreds: -4, tens: 'x', ones: 1e9 }, { hundreds: 12, tens: 30, ones: 30, taken: { hundreds: 99, tens: -1, ones: 'a' } },
    { tens: 18, ones: 18 }, { hundreds: 3, fresh: { tens: 10, ones: 10 } }, { hundreds: 2, tens: 5, ones: 5, spread: { from: 'ones', to: 'x', stage: 'slide' } },
    { hundreds: 0, tens: 0, ones: 0, spread: { from: 'tens', to: 'ones', stage: 'open' } }, { hundreds: 9, tens: 18, ones: 18, fresh: { tens: 10, ones: 10 }, taken: { hundreds: 9, tens: 18, ones: 18 }, kind: 'marks', small: true }]) {
    const svg = art.placeValue(o), vb = viewBox(svg), label = JSON.stringify(o);
    wellFormed(svg, label);
    for (const p of pieces(svg)) inside(p.box, vb, label);
  }
  // an old block that cannot hold them all: its first ten drawn as a block of ten
  const ps = pieces(art.placeValue({ hundreds: 1, tens: 15, ones: 13 }));
  assert.equal(ps.filter((p) => p.kind === 'row' && has(p, 'fresh')).length, 10);
  assert.equal(ps.filter((p) => p.kind === 'loose' && has(p, 'fresh')).length, 10);
});

// ---------------------------------------------------------------- PC.art.placeValue, v0.4: the resting stage

// The grid every option and stage before the resting stage is pinned on: 0 to 999 as written; every third as marks and
// small; every state of every problem's turns for every top from 10 to 999 (each spread at slide, open and end), some
// as marks, small, and both; the glows; junk, with stages that are not stages. Hashed with PC.engine stood in for
// (English words, whatever the engine's table holds), it is e000777's (cats.js before 'out'), taken before the change.
function pvGrid() {
  const out = [];
  for (let n = 0; n <= 999; n++) out.push(digits(n));
  for (let n = 0; n <= 999; n += 3) out.push(Object.assign({ kind: 'marks' }, digits(n)), Object.assign({ small: true }, digits(n)));
  for (let top = 10; top <= 999; top++) for (const { o } of storeStates(top)) {
    out.push(o);
    if (top % 3 === 0) out.push(Object.assign({ kind: 'marks' }, o));
    if (top % 5 === 0) out.push(Object.assign({ small: true }, o));
    if (top % 7 === 0) out.push(Object.assign({ kind: 'marks', small: true }, o));
  }
  for (const glow of ['hundreds', 'tens']) for (let n = 0; n <= 999; n += 11) out.push(Object.assign({ glow }, digits(n)), Object.assign({ glow, kind: 'marks' }, digits(n)));
  out.push(undefined, null, {}, { hundreds: -4, tens: 'x', ones: 1e9 }, { hundreds: 12, tens: 30, ones: 30, taken: { hundreds: 99, tens: -1, ones: 'a' } },
    { tens: 18, ones: 18 }, { hundreds: 3, fresh: { tens: 10, ones: 10 } }, { hundreds: 2, tens: 5, ones: 5, spread: { from: 'ones', to: 'x', stage: 'slide' } },
    { hundreds: 0, tens: 0, ones: 0, spread: { from: 'tens', to: 'ones', stage: 'open' } }, { hundreds: 0, tens: 0, ones: 0, spread: { from: 'tens', to: 'ones', stage: 'slide' } },
    { hundreds: 0, tens: 3, ones: 13, fresh: { ones: 10 }, spread: { from: 'tens', to: 'ones', stage: 'rest' } },
    { hundreds: 0, tens: 3, ones: 13, fresh: { ones: 10 }, spread: { from: 'tens', to: 'ones', stage: 'half' } },
    { hundreds: 0, tens: 3, ones: 13, fresh: { ones: 10 }, spread: { from: 'tens', to: 'ones', stage: 'OUT' } },
    { hundreds: 0, tens: 3, ones: 13, fresh: { ones: 10 }, spread: 'out' },
    { hundreds: 9, tens: 18, ones: 18, fresh: { tens: 10, ones: 10 }, taken: { hundreds: 9, tens: 18, ones: 18 }, kind: 'marks', small: true });
  return out;
}

test('every placeValue option and stage before the resting stage draws byte for byte as e000777 drew it (19,065 pictures, hashed)', () => {
  const real = PC.engine, h = crypto.createHash('sha1'), list = pvGrid();
  try {
    PC.engine = {};
    for (const o of list) h.update(art.placeValue(o == null ? o : JSON.parse(JSON.stringify(o))) + '\n');
  } finally { PC.engine = real; }
  assert.equal(list.length, 19065);
  assert.ok(!list.some((o) => o && o.spread && o.spread.stage === 'out'), 'the pin holds no resting stage');
  assert.equal(h.digest('hex'), '5054a15412529891284209a3758df80c3ac39fe9', 'an existing store picture changed');
});

// a group's whole <g …>…</g> (nested groups and all), from the first match of `re`, or null
function group(svg, re) {
  const m = re.exec(svg);
  if (!m) return null;
  const tag = /<(\/?)g\b[^>]*?(\/?)>/g;
  let depth = 0, t;
  tag.lastIndex = m.index;
  while ((t = tag.exec(svg))) { if (t[2]) continue; depth += t[1] ? -1 : 1; if (!depth) return svg.slice(m.index, tag.lastIndex); }
  return null;
}
const RESTING = /<g class="pc-pv-(row|square) pc-pv-out"/;
// the k-th spread of a problem's ones turn, resting (the engine's slide stage as v0.3 pins it, its stage made 'out')
function resting(a, b, k, extra) {
  const slide = PC.engine.takePicture(null, { a, b }, { col: 0, spreads: k, flight: 'slide' });
  assert.equal(slide.spread.stage, 'slide', a + ' - ' + b + ': the engine\'s slide stage');
  return Object.assign({}, slide, { spread: Object.assign({}, slide.spread, { stage: 'out' }) }, extra || {});
}
const zoneOf = (svg, id) => { const m = new RegExp('<rect class="pc-zone" data-zone="' + id + '" x="([\\d.]+)" y="[\\d.-]+" width="([\\d.]+)"').exec(svg); return { x: +m[1], w: +m[2] }; };
const trayIn = (svg, z) => [...svg.matchAll(/<rect class="pc-pv-tray" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].map((m) => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] })).find((t) => t.x >= z.x && t.x + t.w <= z.x + z.w);
// the resting picture against the slide's: the same bytes but the label, the slide's <style> gone and its moving piece
// drawn still in the same box, its drawing the same
function asSlideEnds(o, label) {
  const svg = art.placeValue(o), slide = art.placeValue(Object.assign({}, o, { spread: Object.assign({}, o.spread, { stage: 'slide' }) }));
  const still = group(svg, RESTING), moving = group(slide, /<g class="pc-pv-(row|square) pc-pv-moving"/), css = /<style>.*?<\/style>/.exec(slide);
  assert.ok(still && moving && css, label + ': a piece resting, and the slide\'s moving one');
  assert.equal(/data-box="[^"]*"/.exec(still)[0], /data-box="[^"]*"/.exec(moving)[0], label + ': it rests where the slide ends');
  assert.equal(still.replace(/^<g [^>]*>/, '').replace(/<\/g>$/, ''), moving.replace(/^(<g [^>]*>){3}/, '').replace(/(<\/g>){3}$/, ''), label + ': the same piece, drawn the same');
  const noLabel = (s) => s.replace(/aria-label="[^"]*"/, '');
  assert.equal(noLabel(svg), noLabel(slide.replace(css[0], '').replace(moving, () => still)), label + ': everything else as the slide draws it');
  return svg;
}

test('the resting stage (\'out\'): 43 - 16 after the lend, three rows and the row resting unopened by the three loose, in their tray, still', () => {
  const o = resting(43, 16, 1);
  assert.deepEqual([o.tens, o.ones, o.fresh.ones, o.spread.from, o.spread.to], [3, 13, 10, 'tens', 'ones'], 'the counts as the slide\'s: landed, the lender one less');
  const svg = asSlideEnds(o, '43 - 16'), vb = viewBox(svg), ps = pieces(svg);
  wellFormed(svg, '43 - 16 resting');
  for (const p of ps) inside(p.box, vb, '43 - 16 resting');
  const plain = ps.filter((p) => !has(p, 'out'));
  assert.deepEqual([plain.filter((p) => p.kind === 'row').length, plain.filter((p) => p.kind === 'loose').length], [3, 3], 'three rows, three loose');
  assert.ok(plain.every((p) => p.cls.length === 0), 'nothing fresh, taken, empty or moving: the ten not opened');
  const out = ps.filter((p) => has(p, 'out'));
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'row');
  assert.deepEqual(out[0].cls, ['pc-pv-out']);
  const z = zoneOf(svg, 'ones'), tray = trayIn(svg, z), b = out[0].box;
  assert.ok(tray, 'the loose zone\'s tray is drawn');
  assert.ok(b.x >= tray.x && b.x + b.w <= tray.x + tray.w && b.y >= tray.y && b.y + b.h <= tray.y + tray.h, 'resting in the loose zone\'s tray: ' + JSON.stringify(b) + ' in ' + JSON.stringify(tray));
  const loose = plain.filter((p) => p.kind === 'loose');
  assert.ok(loose.every((p) => p.box.y + p.box.h <= tray.y), 'beside the old loose, under them');
  assert.match(svg, /data-art="place-value"/);
});

test('the resting stage: 503 - 278 after its first lend, the square resting unopened in the rows\' tray (no old rows), still', () => {
  const o = resting(503, 278, 1);
  assert.deepEqual([o.hundreds, o.tens, o.ones, o.fresh.tens, o.spread.from, o.spread.to], [4, 10, 3, 10, 'hundreds', 'tens']);
  const svg = asSlideEnds(o, '503 - 278, the square'), vb = viewBox(svg), ps = pieces(svg);
  wellFormed(svg, '503 - 278 square resting');
  for (const p of ps) inside(p.box, vb, '503 - 278 square resting');
  const plain = ps.filter((p) => !has(p, 'out'));
  assert.deepEqual([plain.filter((p) => p.kind === 'square').length, plain.filter((p) => p.kind === 'row').length, plain.filter((p) => p.kind === 'loose').length], [4, 0, 3]);
  const out = ps.filter((p) => has(p, 'out'));
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'square');
  const tray = trayIn(svg, zoneOf(svg, 'tens')), b = out[0].box;
  assert.ok(tray && b.x >= tray.x && b.x + b.w <= tray.x + tray.w && b.y >= tray.y && b.y + b.h <= tray.y + tray.h, 'resting in the rows\' tray');
});

test('the resting stage: 503 - 278 after its second lend, the zero\'s row resting unopened by the three loose (nine rows of the square\'s ten, one place empty), still', () => {
  const o = resting(503, 278, 2);
  assert.deepEqual([o.hundreds, o.tens, o.ones, o.fresh.tens, o.fresh.ones, o.spread.from, o.spread.to], [4, 9, 13, 9, 10, 'tens', 'ones']);
  const svg = asSlideEnds(o, '503 - 278, the zero\'s row'), vb = viewBox(svg), ps = pieces(svg);
  wellFormed(svg, '503 - 278 zero row resting');
  for (const p of ps) inside(p.box, vb, '503 - 278 zero row resting');
  const plain = ps.filter((p) => !has(p, 'out'));
  assert.equal(plain.filter((p) => p.kind === 'square').length, 4);
  assert.equal(plain.filter((p) => p.kind === 'row' && has(p, 'fresh') && !has(p, 'empty')).length, 9, 'nine rows of the square\'s ten');
  assert.equal(plain.filter((p) => p.kind === 'row' && has(p, 'empty')).length, 1, 'one place empty: the row that went');
  assert.equal(plain.filter((p) => p.kind === 'loose').length, 3);
  assert.ok(!plain.some((p) => p.kind === 'loose' && has(p, 'fresh')), 'the ten not opened');
  const out = ps.filter((p) => has(p, 'out'));
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'row');
  const tray = trayIn(svg, zoneOf(svg, 'ones')), b = out[0].box;
  assert.ok(tray && b.x >= tray.x && b.x + b.w <= tray.x + tray.w && b.y >= tray.y && b.y + b.h <= tray.y + tray.h, 'resting in the loose zone\'s tray');
});

test('the resting stage is static: no <style>, no animation, no flight, so Reduce Motion draws the same picture; the same bytes twice; as marks too', () => {
  for (const [o, label] of [[resting(43, 16, 1), '43 - 16'], [resting(503, 278, 1), '503 - 278 square'], [resting(503, 278, 2), '503 - 278 zero row'],
    [resting(43, 16, 1, { kind: 'marks' }), '43 - 16 marks'], [resting(503, 278, 1, { kind: 'marks' }), '503 - 278 square marks'], [resting(503, 278, 2, { kind: 'marks' }), '503 - 278 zero row marks']]) {
    const svg = art.placeValue(o);
    wellFormed(svg, label);
    assert.ok(!/<style|animation|@keyframes|transition|pc-pv-moving|pcpv-|prefers-reduced-motion/.test(svg), label + ': nothing moves, so nothing for Reduce Motion to stop');
    assert.equal(art.placeValue(o), svg, label + ': the same bytes twice');
    assert.equal((svg.match(/pc-pv-out/g) || []).length, 1, label + ': one piece resting');
    if (o.kind === 'marks') {
      assert.ok(!/#AE998A|#8E6448/.test(svg), label + ': no prey colours');
      asSlideEnds(o, label);
    }
  }
});

test('the resting stage, through every problem\'s turns (every other top from 10 to 999, as prey and every sixth as marks): each spread\'s rest is its slide\'s end, still; a caller passing the receiver as it stood draws the same; small keeps the tray', () => {
  let n = 0;
  for (let top = 10; top <= 999; top += 2) {
    for (const { o, label } of storeStates(top)) {
      if (!o.spread || o.spread.stage !== 'slide') continue;
      const r = Object.assign({}, o, { spread: Object.assign({}, o.spread, { stage: 'out' }) });
      const svg = asSlideEnds(r, label + ' (out)');
      if (top % 6 === 0) asSlideEnds(Object.assign({ kind: 'marks' }, r), label + ' (out, marks)');
      const vb = viewBox(svg), ps = pieces(svg);
      for (const p of ps) inside(p.box, vb, label + ' (out)');
      assert.ok(!/<style/.test(svg), label + ': still');
      // the counts with the receiver as it stood (the ten not yet in): the same picture, the same words
      const before = JSON.parse(JSON.stringify(r)), to = r.spread.to;
      before[to] -= 10; before.fresh[to] = 0;
      assert.equal(art.placeValue(before), svg, label + ': the receiver as it stood draws the same');
      if (top % 10 === 0) {
        const sm = art.placeValue(Object.assign({ small: true }, r)), svb = viewBox(sm);
        for (const p of pieces(sm)) inside(p.box, svb, label + ' (out, small)');
        for (const m of sm.matchAll(/<rect class="pc-pv-tray" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) inside({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }, svb, label + ' (out, small): its tray');
      }
      n++;
    }
  }
  assert.ok(n > 700, 'resting stages drawn: ' + n);
});

test('the resting stage\'s words: the store as it stands and the piece resting, not yet opened; junk with \'out\' never throws', () => {
  // (the pictures' objects taken from the engine first; then PC.engine stood in for, as the words test below does)
  const real = PC.engine, r43 = resting(43, 16, 1), r503a = resting(503, 278, 1), r503b = resting(503, 278, 2), r503m = resting(503, 278, 2, { kind: 'marks' });
  try {
    PC.engine = {};
    assert.match(art.placeValue(r43), /aria-label="The store: 3 rows, 3 loose; a row resting by the loose, not yet opened"/);
    assert.match(art.placeValue(r503a), /aria-label="The store: 4 squares, 0 rows, 3 loose; a square resting by the rows, not yet opened"/);
    assert.match(art.placeValue(r503b), /aria-label="The store: 4 squares, 9 rows, 3 loose; a row resting by the loose, not yet opened"/);
    assert.match(art.placeValue(r503m), /aria-label="The quick picture: 4 squares, 9 lines and 3 dots; a line resting by the dots, not yet opened"/);
    PC.engine = { TAKE_WORDS: { squares: 'centenas', square: 'centena', rows: 'decenas', row: 'decena', loose: 'sueltas' } };
    assert.match(art.placeValue(r43), /aria-label="The store: 3 decenas, 3 sueltas; a decena resting by the sueltas, not yet opened"/);
  } finally { PC.engine = real; }
  for (const o of [{ spread: { from: 'tens', stage: 'out' } }, { hundreds: 0, tens: 0, ones: 0, spread: { from: 'tens', to: 'ones', stage: 'out' } },
    { hundreds: 0, tens: 0, ones: 0, spread: { from: 'hundreds', to: 'tens', stage: 'out' } }, { hundreds: 2, tens: 5, ones: 5, spread: { from: 'ones', to: 'x', stage: 'out' } },
    { hundreds: 9, tens: 18, ones: 18, fresh: { tens: 10, ones: 10 }, spread: { from: 'tens', to: 'ones', stage: 'out' }, kind: 'marks', small: true, glow: 'tens' }]) {
    const svg = art.placeValue(o), vb = viewBox(svg), label = JSON.stringify(o);
    wellFormed(svg, label);
    for (const p of pieces(svg)) inside(p.box, vb, label);
    assert.ok(!/<style/.test(svg), label + ': still');
  }
  assert.ok(!/pc-pv-out/.test(art.placeValue({ hundreds: 2, tens: 5, ones: 5, spread: { from: 'ones', to: 'x', stage: 'out' } })), 'no lender, no rest');
});

// The engine's own `half` stage (design section 5: E.takePicture(def, q, { col, spreads: k, half: true }), the engine
// owner's, phase 1) draws these same pictures; until it is built this waits.
const HALF = (() => { try { const o = PC.engine.takePicture(null, { a: 43, b: 16 }, { col: 0, spreads: 1, half: true }); return !!(o && o.spread && o.spread.stage === 'out'); } catch (e) { return false; } })();
test('E.takePicture\'s `half` stage draws the resting pictures: 43 - 16, 503 - 278 after each lend, store and marks', { skip: HALF ? false : 'the engine\'s half stage is not built yet (the engine owner, phase 1)' }, () => {
  for (const [a, b, k] of [[43, 16, 1], [503, 278, 1], [503, 278, 2], [70, 34, 1], [811, 356, 1]]) {
    const o = PC.engine.takePicture(null, { a, b }, { col: 0, spreads: k, half: true });
    assert.equal(o.spread.stage, 'out', a + ' - ' + b);
    assert.equal(art.placeValue(o), art.placeValue(resting(a, b, k)), a + ' - ' + b + ' after lend ' + k);
    const def = { picture: { kind: 'marks' } };
    assert.equal(art.placeValue(PC.engine.takePicture(def, { a, b }, { col: 0, spreads: k, half: true })), art.placeValue(resting(a, b, k, { kind: 'marks' })), a + ' - ' + b + ' as marks');
  }
});

test('the store\'s words: the picture says what it holds, in the engine\'s words table when it has one (read when drawn)', () => {
  // (PC.engine stood in for, so this reads the same whatever the engine's own table holds)
  const real = PC.engine;
  try {
    PC.engine = {};
    assert.match(art.placeValue({ hundreds: 2, tens: 1, ones: 5 }), /aria-label="The store: 2 squares, 1 row, 5 loose"/);
    assert.match(art.placeValue({ tens: 3, ones: 13, fresh: { ones: 10 }, taken: { ones: 6 } }), /aria-label="The store: 3 rows, 13 loose; taken: 6 loose"/);
    PC.engine = { TAKE_WORDS: { squares: 'centenas', rows: 'decenas', row: 'decena', loose: 'sueltas' } };
    assert.match(art.placeValue({ hundreds: 2, tens: 1, ones: 5 }), /aria-label="The store: 2 centenas, 1 decena, 5 sueltas"/);
    PC.engine = { get TAKE_WORDS() { throw new Error('not yet'); } };
    assert.match(art.placeValue({ hundreds: 2, tens: 1, ones: 5 }), /aria-label="The store: 2 squares, 1 row, 5 loose"/, 'a table that throws: English');
  } finally { PC.engine = real; }
});

// ---------------------------------------------------------------- PC.art.sand, kind: 'quick'

// Section 2's helps, step by step, as hand-written sand options
const Q = (h, t, u, cs, cl, fl, fd, take, lit, col, ground) => ({ kind: 'quick', hundreds: h, tens: t, ones: u, crossed: { squares: cs, lines: cl }, fresh: { lines: fl, dots: fd }, take, lit, col, ground });
const HELPS = {
  // 503 - 278, the ones, she typed 0 (zero): the sand opens, the chain (a square crossed, ten lines; a line crossed,
  // ten dots: across a zero the crossed line is one of the square's ten fresh ones), the take in two hops
  '503-278 zero': [Q(5, 0, 3, 0, 0, 0, 0, 0, 0, 0), Q(4, 10, 3, 1, 0, 10, 0, 0, 0, 0), Q(4, 9, 13, 1, 1, 10, 10, 0, 0, 0), Q(4, 9, 13, 1, 1, 10, 10, 8, 0, 0),
    Q(4, 9, 13, 1, 1, 10, 10, 8, 3, 0), Q(4, 9, 13, 1, 1, 10, 10, 8, 8, 0)],
  // 43 - 16, the ones (flip) and the tens (kept)
  '43-16 flip': [Q(0, 4, 3, 0, 0, 0, 0, 0, 0, 0), Q(0, 3, 13, 0, 1, 0, 10, 0, 0, 0), Q(0, 3, 13, 0, 1, 0, 10, 6, 3, 0), Q(0, 3, 13, 0, 1, 0, 10, 6, 6, 0)],
  '43-16 kept': [Q(0, 3, 13, 0, 0, 0, 10, 1, 0, 1), Q(0, 3, 13, 0, 0, 0, 10, 1, 1, 1)],
  // 811 - 356, the tens: no rows now, so a square spreads; the take from the ten
  '811-356 tens': [Q(7, 0, 11, 0, 0, 0, 10, 0, 0, 1), Q(7, 10, 11, 1, 0, 10, 10, 5, 0, 1), Q(7, 10, 11, 1, 0, 10, 10, 5, 5, 1)],
  // 607 - 283, the tens (flip on a 0): a square, ten rows; 640 - 218, the ones on a 0, in the earth
  '607-283 tens': [Q(6, 0, 7, 0, 0, 0, 0, 0, 0, 1), Q(5, 10, 7, 1, 0, 10, 0, 8, 2, 1)],
  '640-218 ones': [Q(6, 4, 0, 0, 0, 0, 0, 0, 0, 0, 'earth'), Q(6, 3, 10, 0, 1, 0, 10, 8, 8, 0, 'earth')],
  // 500 - 467's blank hundreds (kept): 4 take away 4
  '500-467 hundreds': [Q(4, 9, 10, 0, 0, 0, 10, 4, 4, 2)]
};

function checkQuick(o, label) {
  const svg = art.sand(o), vb = viewBox(svg), ms = marks(svg);
  wellFormed(svg, label);
  for (const m of ms) inside(m.box, vb, label);
  const n = (w, c) => ms.filter((m) => m.what === w && (!c || m.cls.includes('pc-quick-' + c))).length;
  const cs = o.crossed.squares, cl = o.crossed.lines;
  assert.deepEqual([n('square'), n('line'), n('dot')], [o.hundreds + cs, o.tens + cl, o.ones], label + ': the marks drawn');
  assert.deepEqual([n('square', 'crossed'), n('line', 'crossed'), n('dot', 'crossed')], [cs, cl, 0], label + ': crossed');
  assert.equal(n('line', 'fresh'), o.fresh.lines, label + ': fresh lines');
  assert.equal(n('dot', 'fresh'), o.fresh.dots, label + ': fresh dots');
  const what = ['dot', 'line', 'square'][o.col];
  assert.equal(ms.filter((m) => m.cls.includes('pc-quick-lit')).length, o.lit, label + ': lit');
  assert.ok(ms.filter((m) => m.cls.includes('pc-quick-lit') || m.cls.includes('pc-quick-wait')).every((m) => m.what === what), label + ': only column ' + o.col + '\'s marks are taken');
  assert.equal(ms.filter((m) => m.cls.includes('pc-quick-wait')).length, o.take - o.lit, label + ': waiting');
  // taken old first: a fresh mark lit only once every standing old one is
  const col = ms.filter((m) => m.what === what && !m.cls.includes('pc-quick-crossed'));
  if (col.some((m) => m.cls.includes('pc-quick-fresh') && m.cls.includes('pc-quick-lit'))) assert.ok(col.filter((m) => !m.cls.includes('pc-quick-fresh')).every((m) => m.cls.includes('pc-quick-lit')), label + ': old first');
  // a crossed line is an old one while there are old lines; past them, a fresh one (across a zero)
  const oldLines = o.tens + cl - o.fresh.lines, xl = ms.filter((m) => m.what === 'line' && m.cls.includes('pc-quick-crossed'));
  if (cl) assert.equal(xl.filter((m) => m.cls.includes('pc-quick-fresh')).length, Math.max(0, cl - oldLines), label + ': a crossed line among the fresh only past the old');
  assert.equal((svg.match(/class="pc-col-on"/g) || []).length, 1, label + ': one column lit');
  return svg;
}

test('the help\'s sand, section 2\'s helps step by step: the marks as they stand, crossed old first (across a zero, one of the ten fresh lines), the ten new ones beside, the take lit old first', () => {
  for (const [name, steps] of Object.entries(HELPS)) steps.forEach((o, i) => checkQuick(o, name + ' step ' + i));
  // 503 - 278 after the chain: ten lines drawn, all fresh, the last crossed; three old dots and ten fresh
  const ms = marks(art.sand(HELPS['503-278 zero'][2])), lines = ms.filter((m) => m.what === 'line');
  assert.equal(lines.length, 10);
  assert.ok(lines.every((m) => m.cls.includes('pc-quick-fresh')));
  assert.ok(lines[9].cls.includes('pc-quick-crossed') && lines.slice(0, 9).every((m) => !m.cls.includes('pc-quick-crossed')), 'the last of the ten crossed');
  assert.match(art.sand(HELPS['503-278 zero'][4]), /aria-label="The quick picture in the sand: 4 squares, 9 lines and 13 dots; crossed out: 1 square, 1 line; taking 8, 3 taken"/);
  assert.match(art.sand(HELPS['640-218 ones'][0]), /in the earth/);
});

test('the help\'s sand, every crossed, fresh, take and lit count a help can make, at every column: never a throw, every count drawn', () => {
  let n = 0;
  // a help crosses at most one square and one line, draws ten new lines and ten new dots or none; the lit column at its
  // fewest and most (the others at one count each), every take of its standing marks, and lit 0, 1, all but one, all
  for (const col of [0, 1, 2]) for (const cs of [0, 1]) for (const cl of [0, 1]) for (const fl of [0, 10]) for (const fd of [0, 10]) {
    for (const h of col === 2 ? [0, 3, 8] : [5]) for (const tOld of col === 1 ? [0, 3, 9] : [4]) for (const uOld of col === 0 ? [0, 3, 8] : [6]) {
      // a crossed line is an old one; with no old lines, one of the square's ten fresh ones (across a zero)
      if (cl > tOld && !fl) continue;
      const o = Q(h, tOld + fl - cl, uOld + fd, cs, cl, fl, fd, 0, 0, col);
      const stand = col === 0 ? o.ones : col === 1 ? o.tens : o.hundreds;
      for (let take = 0; take <= stand; take++) for (const lit of [...new Set([0, 1, take - 1, take])].filter((v) => v >= 0 && v <= take)) {
        checkQuick(Object.assign({}, o, { take, lit }), JSON.stringify(Object.assign({}, o, { take, lit })));
        n++;
      }
    }
  }
  assert.ok(n > 2000, 'drawn: ' + n);
});

test('the help\'s sand: junk in, a picture out; with no hundreds and not on them, two boxes', () => {
  for (const o of [{ kind: 'quick' }, { kind: 'quick', hundreds: 'x', tens: -3, ones: 99, crossed: 5, fresh: null, take: 50, lit: 60, col: 7 },
    { kind: 'quick', tens: 18, ones: 18, crossed: { lines: 1 }, fresh: { lines: 10, dots: 10 }, take: 18, lit: 18, col: 1, ground: 'log' }]) {
    const svg = art.sand(o), vb = viewBox(svg);
    wellFormed(svg, JSON.stringify(o));
    for (const m of marks(svg)) inside(m.box, vb, JSON.stringify(o));
  }
  assert.equal((art.sand(Q(0, 4, 3, 0, 0, 0, 0, 0, 0, 0)).match(/rx="18" fill=/g) || []).length, 2, 'two boxes');
  assert.equal((art.sand(Q(0, 4, 3, 0, 0, 0, 0, 0, 0, 2)).match(/rx="18" fill=/g) || []).length, 3, 'three when the help is at the hundreds');
});

// The grid of PC.art.sand calls every chapter's sand is drawn from (E.sandOpts and E.answersOpts' shapes, on every
// ground), with its sha1 taken from app/art/cats.js as v23 shipped it (8195ad1), before the kit: the new branch is
// `kind: 'quick'` only, so every one of these draws byte for byte as it did.
function sandGrid() {
  const out = [], grounds = [undefined, 'sand', 'earth', 'mud', 'grit', 'log', 'nonsense'];
  for (const ground of grounds) {
    for (const groups of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 20]) for (const per of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      const all = groups * per;
      for (const counted of [0, 1, Math.floor(all / 2), all]) out.push({ groups, per, counted, ground });
    }
    for (const groups of [1, 2, 3]) for (const per of [2, 3, 4, 5, 6, 7, 8, 9, 10]) for (const counted of [0, per, groups * per]) {
      out.push({ groups, per, counted, layout: 'rows', ground });
      out.push({ groups, per, counted, layout: 'rows', step: per, ground });
    }
    for (const groups of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) for (const per of [5, 9, 10]) for (const counted of [0, per, groups * per]) {
      out.push({ groups, per, counted, style: 'swipe', ground });
      out.push({ groups, per, counted, style: 'swipe', pair: true, ground });
    }
    for (const groups of [1, 2, 4, 7, 10]) for (let rubbed = 0; rubbed <= groups; rubbed += Math.max(1, Math.floor(groups / 3))) {
      out.push({ groups, per: 10, counted: groups * 10 - rubbed, style: 'swipe', pair: true, rubbed, ground });
      out.push({ groups, per: 10, counted: groups * 9, style: 'swipe', pair: true, tuck: true, ground });
      out.push({ groups, per: 10, counted: 0, style: 'swipe', pair: true, tucked: rubbed, ground });
    }
    for (const answers of [[18, 36], [27], [9, 18, 27, 36, 45], []]) { out.push({ answers, ground }); out.push({ kind: 'answers', answers, ground }); }
  }
  out.push(undefined, null, {}, { groups: 'x', per: -3 });
  return out;
}

test('every existing PC.art.sand call draws byte for byte as v23 drew it (6,472 calls on every ground, hashed)', () => {
  const h = crypto.createHash('sha1'), list = sandGrid();
  for (const o of list) h.update(art.sand(o == null ? o : JSON.parse(JSON.stringify(o))) + '\n');
  assert.equal(list.length, 6472);
  assert.equal(h.digest('hex').slice(0, 16), '90f95b933c9a8373', 'an existing sand picture changed');
});

// ---------------------------------------------------------------- the quick marks for a set

test('art.kit.quick and art.quickMarks draw the same marks: one group, its middle at (x, y), every square, line and dot', () => {
  assert.equal(typeof art.quickMarks, 'function');
  assert.equal(typeof art.kit.quick, 'function', 'scenes.js\'s kit has quick');
  for (const o of [{ hundreds: 3, tens: 4, ones: 7 }, { hundreds: 0, tens: 0, ones: 1, ground: 'earth' }, { hundreds: 9, tens: 18, ones: 18, ground: 'mud' }, { tens: 2 }, {}, { hundreds: 1, ground: 'log' }]) {
    for (const [x, y, k] of [[0, 0, 1], [640, 820, 0.5], [100.25, 33.3, 2]]) {
      const g = art.quickMarks(x, y, k, o), label = JSON.stringify(o);
      assert.equal(art.kit.quick(x, y, k, o), g, label + ': the kit draws the same');
      assert.ok(g.startsWith('<g class="pc-quick" data-art="quick" transform="translate(') && g.endsWith('</g>'), label);
      assert.equal(balanced(g), null, label);
      assert.ok(!/<svg|NaN|undefined/.test(g), label);
      const sz = art.quickMarks.size(o), m = /translate\(([-\d.]+) ([-\d.]+)\) scale\(([\d.]+)\)/.exec(g);
      assert.ok(Math.abs(+m[1] + sz.w * k / 2 - x) < 0.11 && Math.abs(+m[2] + sz.h * k / 2 - y) < 0.11, label + ': its middle at (x, y)');
      // a square a hundred, a line a ten, a dot a one (each line and square two strokes, groove and shine; each dot two circles)
      const sq = (o.hundreds || 0), ln = (o.tens || 0), dt = (o.ones || 0);
      assert.equal((g.match(/<path d="M[^"]*Z"/g) || []).length, sq * 2, label + ': squares');
      assert.equal((g.match(/<circle /g) || []).length, dt * 2, label + ': dots');
      assert.equal((g.match(/<path /g) || []).length, sq * 2 + ln * 2, label + ': lines');
    }
  }
});

// ---------------------------------------------------------------- the gallery's take-aways section

test('the gallery\'s take-aways section (appended to dev/gallery.html): every panel draws its picture, titled "take-aways:"', () => {
  const page = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  const js = page.slice(page.lastIndexOf('<script>') + 8, page.lastIndexOf('</script>'));
  assert.ok(js.indexOf('// ---- section 3: the take-aways kit') > js.indexOf('$(\'status\').textContent = (realChar'), 'appended after the page\'s own end');
  const byId = {}, figures = [];
  const el = (tag) => {
    const e = { tag, children: [], style: {}, classList: { add() {} }, html: '', text: '', appendChild(c) { this.children.push(c); return c; }, insertAdjacentHTML() {}, addEventListener() {},
      querySelector() { return this.panel || (this.panel = el('div')); }, getBoundingClientRect() { return { top: 0, bottom: 100 }; } };
    Object.defineProperty(e, 'innerHTML', { get() { return this.html; }, set(v) { this.html = String(v); } });
    Object.defineProperty(e, 'textContent', { get() { return this.text; }, set(v) { this.text = String(v); } });
    if (tag === 'figure') figures.push(e);
    return e;
  };
  const document = { body: el('body'), head: el('head'), createElement: el, getElementById(id) { return byId[id] || (byId[id] = Object.assign(el('div'), { id, value: '', checked: false })); } };
  const IO = function (cb) { this.cb = cb; }; IO.prototype.observe = function () {};
  new Function('window', 'document', 'IntersectionObserver', 'location', 'performance', 'innerHeight', js)({ PC }, document, IO, { search: '?only=take-aways' }, { now: () => 0 }, 800);
  const takes = figures.filter((f) => f.html.includes('<code>take-aways: '));
  assert.equal(takes.length, figures.length, 'only the take-aways panels with ?only=take-aways');
  assert.ok(takes.length >= 25, 'panels: ' + takes.length);
  for (const f of takes) {
    const drawn = f.panel ? f.panel.html : '';
    assert.ok(drawn.startsWith('<svg') && drawn.includes('</svg><div class="ov">'), 'drew: ' + f.html.slice(0, 120));
    assert.ok(!/class="pending err"/.test(drawn), 'failed: ' + f.html.slice(0, 120));
  }
  for (const k of ['placeValue', 'sand', 'quickMarks']) assert.ok(takes.some((f) => f.html.includes('PC.art.' + k + '(')), 'the gallery shows ' + k);
  // v0.4's resting stage: three panels (a row, a square, a zero's row), each a piece resting, still
  const rests = takes.filter((f) => f.html.includes('"stage":"out"'));
  assert.equal(rests.length, 3, 'the three resting pictures');
  for (const f of rests) assert.ok(/class="pc-pv-(row|square) pc-pv-out"/.test(f.panel.html) && !/<style/.test(f.panel.html), 'resting, still: ' + f.html.slice(0, 120));
  assert.deepEqual(rests.map((f) => /"from":"(\w+)"/.exec(f.html)[1] + (f.html.includes('"tens":9') ? '9' : '')).sort(), ['hundreds', 'tens', 'tens9']);
  for (const k of ['"stage":"slide"', '"stage":"open"', '"glow":"hundreds"', '"glow":"tens"', '"kind":"marks"', '"small":true', '"tens":9', '"kind":"quick"', '"lines":1', '"ground":"earth"'])
    assert.ok(takes.some((f) => f.html.includes(k)), 'the gallery shows ' + k);
  assert.ok(byId.nav.html.includes('#takes'), 'the nav links the section');
  assert.match(byId.status.text, new RegExp('· ' + figures.length + ' panels'));
});
