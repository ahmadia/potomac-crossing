// Gathering Island (app/art/sets/island.js, chapter 10): node --test tests/set-island.test.js
// docs/chapters/10-the-gathering.spec.md, section 4, "The new set, island"
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['shore', 'wide', 'roots', 'case', 'fox', 'mist', 'sky', 'paws'];
const COMP = { shore: 'shore', wide: 'main', roots: 'roots', case: 'case', fox: 'fox', mist: 'mist', sky: 'sky', paws: 'paws' };
// the spec's table, camera by camera
const ANCHORS = {
  shore: ['land-1', 'land-2', 'land-3', 'raft', 'drag', 'print'],
  wide: ['root-1', 'root-2', 'root-3', 'crowd-1', 'crowd-2', 'crowd-3', 'crowd-4', 'crowd-5', 'crowd-6', 'elder', 'centre', 'beside', 'edge', 'edge-2', 'edge-3', 'bank', 'luggage'],
  roots: ['root-1', 'root-2', 'root-3', 'step', 'near-1', 'near-2'],
  case: ['speak', 'beside', 'mentor', 'root', 'fox', 'weasel-1', 'weasel-2', 'front-1', 'front-2', 'front-3', 'front-4'],
  fox: ['fox', 'weasel-1', 'weasel-2', 'water', 'water-2', 'water-3'],
  mist: ['mama', 'eldest', 'nose', 'beside', 'speak', 'mentor', 'front-1', 'front-2'],
  sky: ['fly', 'nose', 'far'],
  paws: ['close', 'above']
};
const OPTS = { crowd: [false, true, 'standing'], luggage: ['none', 'heap', 'open'], ferry: [false, true], print: [false, true], mist: ['none', 'rolling', 'thick'],
  tail: [false, true], grown: [false, true], small: ['none', 'one', 'some', 'coming'], rising: [false, true], zip: [false, true], drawing: ['none', 'cat'],
  bubbles: [false, true], tap: ['none', 'reeds', 'mist', 'print'] };
// the options each camera's row in the spec's table names
const CAM_OPTS = { shore: ['ferry', 'luggage', 'print', 'tap'], wide: ['crowd', 'luggage', 'mist', 'tap', 'bubbles'], roots: ['crowd', 'mist'], case: ['crowd', 'mist', 'small', 'drawing', 'tap'],
  fox: ['crowd', 'mist'], mist: ['mist', 'tail', 'grown', 'small', 'tap'], sky: ['mist', 'grown', 'rising', 'zip'], paws: ['tap'] };
// the elevated and the airborne spots, as the table marks them
const ELEV = { 'case:root': [true, false], 'mist:mama': [true, false], 'mist:eldest': [true, false], 'sky:fly': [true, true], 'sky:nose': [true, true], 'sky:far': [true, true], 'paws:above': [true, false],
  'fox:water': [false, true], 'fox:water-2': [false, true], 'fox:water-3': [false, true] };
// the cast's own coats: never a crowd seat's (cats.js variants; spec section 4, "New cast")
const NAMED = { groveclan: [1, 2, 3], reedclan: [1, 2, 5], otter: [3] };
const ANON = { reedclan: [3, 4], groveclan: [4, 5], otter: [1, 2] };
const hasCats = typeof art.character === 'function' && !art.character.placeholder;
const SPEC = path.join(ROOT, 'docs/chapters/10-the-gathering.spec.md');

// ---------------------------------------------------------------- helpers

function checkXml(svg, label) {
  const stack = [];
  const re = /<[^>]*>|[^<]+/g;
  let m;
  while ((m = re.exec(svg))) {
    const tok = m[0];
    if (tok[0] !== '<') { assert.ok(!/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(tok), label + ': unescaped & in text'); continue; }
    if (tok.startsWith('</')) { assert.equal(stack.pop(), tok.slice(2, -1).trim(), label + ': closing tag mismatch'); continue; }
    const mm = /^<([a-zA-Z][\w:.-]*)((?:\s+[\w:.-]+="[^"<]*")*)\s*(\/?)>$/.exec(tok);
    assert.ok(mm, label + ': malformed tag ' + tok.slice(0, 100));
    const names = mm[2].match(/[\w:.-]+(?==")/g) || [];
    assert.equal(new Set(names).size, names.length, label + ': duplicate attribute in ' + tok.slice(0, 80));
    if (!mm[3]) stack.push(mm[1]);
  }
  assert.equal(stack.length, 0, label + ': unclosed tags');
}
function checkRender(r, cast, label) {
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg, label);
  const vb = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(r.svg)[1].split(/\s+/).map(Number);
  assert.deepEqual(vb, [0, 0, 1600, 1000], label + ': the whole composition');
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  assert.equal(r.heads.length, cast.length, label + ': one head per cast member');
  r.heads.forEach((h) => { if (h) assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ': head in the panel'); });
  (r.keep || []).forEach((k) => assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, label + ': keep inside the panel'));
}
const render = (cam, opts, cast, fx) => art.render({ set: 'island', cam, opts: opts || {}, cast: cast || [], fx: fx || ['night'] }, { look: LOOK });
const strip = (s) => s.replace(/\bpcs?[0-9a-z]+-/g, '');
const lum = (h) => { const v = parseInt(h.slice(1), 16); return 0.3 * (v >> 16) + 0.59 * ((v >> 8) & 255) + 0.11 * (v & 255); };
const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const spots = (cam) => art.sceneInfo('island').anchors[COMP[cam]];
function group(svg, attr) {
  const i = svg.indexOf(attr);
  if (i < 0) return '';
  const start = svg.lastIndexOf('<g', i);
  let depth = 0;
  const tag = /<g[\s>]|<\/g>/g;
  tag.lastIndex = start;
  let t;
  while ((t = tag.exec(svg))) { depth += t[0] === '</g>' ? -1 : 1; if (depth === 0) return svg.slice(start, tag.lastIndex); }
  return '';
}
const boxOf = (svg, attr) => { const m = new RegExp(attr + '[^>]*data-box="([^"]+)"').exec(svg) || new RegExp('data-box="([^"]+)"[^>]*' + attr).exec(svg); return m ? m[1].split(' ').map(Number) : null; };
function paints(svg) {
  const out = [];
  for (const m of svg.matchAll(/<(path|rect|ellipse|circle|polygon)\b([^>]*)\/?>/g)) {
    const a = m[2], op = +((/ opacity="([\d.]+)"/.exec(a) || [])[1] || 1);
    for (const k of ['fill', 'stroke']) { const c = new RegExp(' ' + k + '="(#[0-9a-fA-F]{6})"').exec(a); if (c) out.push({ c: c[1], op }); }
  }
  for (const m of svg.matchAll(/<stop [^>]*stop-color="(#[0-9a-fA-F]{6})"([^>]*)\/>/g)) out.push({ c: m[1], op: +((/stop-opacity="([\d.]+)"/.exec(m[2]) || [])[1] || 1) });
  return out;
}
function groupPaints(svg, g) {
  const out = paints(g);
  for (const u of new Set((g.match(/url\(#[^)]+\)/g) || []).map((x) => x.slice(5, -1)))) {
    const m = new RegExp('<(?:linear|radial)Gradient id="' + u + '"[^>]*>(.*?)</(?:linear|radial)Gradient>').exec(svg);
    if (m) out.push(...paints(m[1]));
  }
  return out;
}
const meets = (p, q) => p[0] < q[2] && p[2] > q[0] && p[1] < q[3] && p[3] > q[1];
// a stand-in for the kit's crowd helper (scenes.js, the nest owner's): records the seats the set hands it, and
// answers with one marked crowd cat per seat (a head box, as the kit marks each)
function withCrowd(fn) {
  const K = art.kit, had = Object.prototype.hasOwnProperty.call(K, 'crowd'), keep = K.crowd, calls = [];
  K.crowd = function (S, seats, k0) {
    calls.push({ seats: JSON.parse(JSON.stringify(seats)), k0, cam: S.cam, opts: S.opts });
    return seats.map((st) => '<g data-crowd="cat" data-who="' + (st[5] || 'clancat') + '" data-box="' + [st[0] - 40, st[1] - 90, st[0] + 40, st[1]].join(' ') + '" data-head="' + [st[0] - 24, st[1] - 90, st[0] + 24, st[1] - 50].join(' ') + '"></g>').join('');
  };
  try { fn(calls); } finally { if (had) K.crowd = keep; else delete K.crowd; }
  return calls;
}
function withoutCrowd(fn) {
  const K = art.kit, had = Object.prototype.hasOwnProperty.call(K, 'crowd'), keep = K.crowd;
  delete K.crowd;
  try { fn(); } finally { if (had) K.crowd = keep; }
}

// ---------------------------------------------------------------- the vocabulary

test('island: the spec names the set, its eight cameras, their anchors and its options; the set has exactly them, every option off by default, no `moon`', () => {
  const md = fs.readFileSync(SPEC, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['#### The new set, `island` (`app/art/sets/island.js`)', "`PC.art.defineSet('island', { label: 'Gathering Island: the clearing under the great tree', tod: 'night', … })`",
    "Declared: `opts: { crowd: [false, true, 'standing'], luggage: ['none', 'heap', 'open'], ferry: [false, true], print: [false, true], mist: ['none', 'rolling', 'thick'], tail: [false, true], grown: [false, true], small: ['none', 'one', 'some', 'coming'], rising: [false, true], zip: [false, true], drawing: ['none', 'cat'], bubbles: [false, true], tap: ['none', 'reeds', 'mist', 'print'] }`",
    '**no `moon`**', '**Depth on `wide`** (the places owner\'s)'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  for (const cam of CAMS) assert.ok(md.includes('| `' + cam + '` |'), 'the spec\'s table has `' + cam + '`');
  const v = art.vocab.sets.island, info = art.sceneInfo('island');
  assert.ok(v, 'vocab.sets.island');
  assert.deepEqual(v.cams, CAMS, 'exactly the eight cameras, in the spec\'s order');
  assert.deepEqual(v.opts, OPTS, 'the options exactly as declared');
  assert.ok(!('moon' in v.opts), 'no moon option: always the full moon');
  assert.deepEqual(info.defaults, {}, 'every option off by default');
  assert.equal(info.label, 'Gathering Island: the clearing under the great tree');
  for (const cam of CAMS) {
    assert.equal(info.cams[cam].comp, COMP[cam], cam + ': a composition of its own');
    assert.deepEqual([info.cams[cam].x, info.cams[cam].y, info.cams[cam].w], [0, 0, 1600], cam + ' looks at all of it');
    assert.deepEqual(Object.keys(info.anchors[COMP[cam]]), ANCHORS[cam], cam + ': exactly the spec\'s anchors');
  }
  assert.deepEqual(Object.keys(info.anchors).sort(), Object.values(COMP).sort(), 'no composition beyond the eight');
  for (const [cam, list] of Object.entries(CAM_OPTS)) for (const k of list) assert.ok(Object.prototype.hasOwnProperty.call(v.opts, k), cam + ': ' + k);
});

test('island: the elevated and airborne spots as the table marks them (`root` on case, `mama`, `eldest`, the sky\'s three, `above`; the fox\'s water spots `air`); every other spot on the ground; facings as the spec has them', () => {
  const info = art.sceneInfo('island');
  for (const cam of CAMS) for (const [k, a] of Object.entries(info.anchors[COMP[cam]])) {
    const want = ELEV[cam + ':' + k] || [false, false];
    assert.equal(!!a.elev, want[0], cam + ' ' + k + ': elev ' + want[0]);
    assert.equal(!!a.air, want[1], cam + ' ' + k + ': air ' + want[1]);
    assert.ok(a.h > 0 && a.z == null, cam + ' ' + k + ': a height, no z');
  }
  const A = (c) => info.anchors[COMP[c]];
  for (const k of ['land-1', 'land-2', 'land-3']) assert.equal(A('shore')[k].face, 'right', k + ': up the slope');
  assert.ok(A('shore')['land-3'].x > A('shore')['land-2'].x && A('shore')['land-2'].x > A('shore')['land-1'].x && A('shore')['land-3'].y < A('shore')['land-1'].y, 'stepping up the slope');
  for (const k of ['edge', 'edge-2', 'edge-3', 'bank']) assert.equal(A('wide')[k].face, 'left', 'wide ' + k + ': at the river edge, facing left');
  for (const k of ['crowd-1', 'crowd-2', 'crowd-3']) assert.ok(A('wide')[k].x < 800, k + ': CrystalClan\'s, at the left');
  for (const k of ['crowd-4', 'crowd-5', 'crowd-6']) assert.ok(A('wide')[k].x > 800, k + ': ReedClan\'s, at the right');
  assert.ok(A('wide')['root-1'].x < A('wide')['root-2'].x && A('wide')['root-2'].x < A('wide')['root-3'].x, 'the roots left to right');
  assert.ok(Math.abs(A('wide')['root-2'].x - 800) < 60 && A('wide').luggage.x < 300, 'Glintstar\'s root in the middle; the heap\'s place at the left edge');
  for (const k of ['edge', 'edge-2', 'edge-3', 'bank']) assert.ok(A('wide')[k].x > 1300, k + ': at the right');
  assert.ok(A('wide').bank.y > A('wide').edge.y, 'bank: in front of edge');
  assert.equal(A('case').speak.face, 'right', 'speak: facing right');
  for (const k of ['fox', 'weasel-1', 'weasel-2']) { assert.equal(A('case')[k].face, 'left', 'case ' + k); assert.ok(A('case')[k].x > A('case').beside.x, 'case ' + k + ': beyond beside'); }
  assert.ok(A('case').beside.x > A('case').speak.x && A('case').mentor.x < A('case').speak.x, 'beside at her right, mentor at her left');
  assert.equal(A('fox').fox.face, 'left');
  for (const k of ['weasel-1', 'weasel-2']) assert.ok(A('fox')[k].x > A('fox').fox.x, k + ': at his heels, behind him');
  for (const k of ['speak', 'mentor', 'front-1', 'front-2', 'beside', 'nose']) assert.equal(A('mist')[k].face, 'right', 'mist ' + k + ': facing the mist');
  assert.ok(A('mist').mama.x > 1000 && A('mist').eldest.x > A('mist').mama.x, 'Mama at the right; the eldest further right');
  assert.ok(A('mist').mama.h > A('mist').speak.h, 'Mama\'s face bigger than a cat');
  assert.ok(A('sky').far.h < A('sky').fly.h / 2, 'far: small, far up the river');
  assert.ok(A('paws').close.h > 900, 'close: our cat very big');
});

// ---------------------------------------------------------------- the depth rule on `wide`

test('island DEPTH on `wide` (the places owner\'s): root-1, root-2 and root-3 lie further up the panel (a smaller y) than every crowd-1 … crowd-6 and the elder, so a leader is the farther of two cats of the same Clan; the elder at the ring\'s back left, in front of the roots', () => {
  const A = spots('wide');
  const roots = ['root-1', 'root-2', 'root-3'].map((k) => A[k]), ring = ['crowd-1', 'crowd-2', 'crowd-3', 'crowd-4', 'crowd-5', 'crowd-6', 'elder'];
  for (const r of roots) for (const k of ring) assert.ok(r.y < A[k].y, 'root at y ' + r.y + ' behind ' + k + ' at y ' + A[k].y);
  const back = Math.max(...roots.map((r) => r.y));
  assert.ok(A.elder.y > back && A.elder.y <= Math.min(...['crowd-1', 'crowd-2', 'crowd-3', 'crowd-4', 'crowd-5', 'crowd-6'].map((k) => A[k].y)), 'the elder at the ring\'s back, in front of the roots');
  assert.ok(A.elder.x < A['root-1'].x, 'the elder at the left');
  // and every other spot on `wide` is in front of the roots too, so back to front always lists a leader first
  for (const [k, a] of Object.entries(A)) if (!k.startsWith('root-')) assert.ok(a.y > back, k + ': in front of the roots');
  // the leaders a little bigger than the ring's depth there, sitting up
  for (const r of roots) assert.ok(r.h > 170 && r.h < A.elder.h, 'a leader on a root, a little bigger: ' + r.h);
});

test('island: the three leaders sit on three big roots, never in the branches: each root spot\'s feet on its root\'s top (wide and roots); `step` below root-2; the case\'s `root` on the low root', () => {
  const I = art.islandInfo();
  for (const [cam, R] of [['wide', I.wide.roots], ['roots', I.roots.roots]]) {
    const A = spots(cam);
    for (const k of ['root-1', 'root-3']) assert.ok(Math.abs(I.rootTop(R[k], A[k].x) - A[k].y) < 2, cam + ' ' + k + ': on its root\'s top');
    const r2 = R['root-2'], mid = r2[1];
    assert.ok(Math.abs(mid[1] - mid[2] / 2 - A['root-2'].y) < 2, cam + ' root-2: on its root\'s top');
    const crown = boxOf(render(cam).svg, 'data-art="crown"');
    for (const k of ['root-1', 'root-2', 'root-3']) assert.ok(A[k].y > crown[3], cam + ' ' + k + ': below the crown (never in the branches)');
  }
  const R = spots('roots');
  assert.ok(R.step.y > R['root-2'].y && Math.abs(R.step.x - R['root-2'].x) < 40, 'step: below root-2');
  assert.ok(R['near-1'].x < R.step.x && R['near-2'].x > R.step.x, 'near-1, near-2: either side of step');
  const C = spots('case');
  assert.ok(Math.abs(I.rootTop(I.case.root, C.root.x) - C.root.y) < 2, 'case root: on the low root');
  assert.ok(C.root.y < C.speak.y && C.root.x < C.speak.x, 'behind her, at the left');
});

// ---------------------------------------------------------------- every camera, every spot, every option

test('island: every anchor is inside its camera, and every camera renders well-formed with a cast member at each anchor, each head in the panel', { skip: !hasCats && 'no cats.js' }, () => {
  for (const cam of CAMS) {
    const A = spots(cam);
    // (Mama's spot is the foot of her neck, down in the mist under the panel's bottom edge: her face is what shows)
    for (const [k, a] of Object.entries(A)) assert.ok(a.x > 40 && a.x < 1560 && a.y > 0 && a.y <= (cam === 'mist' && k === 'mama' ? 1080 : 1010), cam + ' ' + k + ' inside: ' + [a.x, a.y]);
    const who = ['player', 'tallyheart', 'glintstar', 'riffle', 'clancat', 'grizzled', 'sloshbank', 'thymeleaf', 'snorer', 'murmurchime'];
    const cast = Object.keys(A).map((at, i) => ({ who: cam === 'sky' || at === 'above' || at === 'nose' && cam === 'mist' ? 'sprinkle' : at.startsWith('water') ? 'reynard' : who[i % who.length], at, pose: cam === 'sky' ? 'fly' : at === 'above' ? 'lookdown' : 'sit', variant: 2 }));
    const r = render(cam, {}, cast);
    checkRender(r, cast, cam);
    r.heads.forEach((h, i) => assert.ok(h && h.x > 1 && h.x < 99 && h.y > 1 && h.y < 99, cam + ': a head at ' + cast[i].at + ' in the panel: ' + JSON.stringify(h)));
    for (const at of Object.keys(A)) for (const w of ['player', 'tallyheart', 'riffle']) {
      const c = [{ who: w, at, pose: 'sit' }];
      const r1 = render(cam, {}, c);
      checkRender(r1, c, cam + ' ' + w + '@' + at);
      assert.ok(r1.heads[0], cam + ': ' + w + ' at ' + at + ' is in shot');
    }
  }
});

test('island: every option value renders on every camera, alone and all together (and off draws exactly as left out); always the same night (todFixed): any hour a frame names draws it', () => {
  for (const cam of CAMS) {
    const plain = strip(render(cam).svg);
    for (const [k, vals] of Object.entries(OPTS)) for (const v of vals) {
      const r = render(cam, { [k]: v });
      checkRender(r, [], cam + ' ' + k + '=' + v);
      if (v === false || v === 'none') assert.equal(strip(r.svg), plain, cam + ' ' + k + ': ' + v + ' draws as left out');
    }
    const all = { crowd: 'standing', luggage: 'heap', ferry: true, print: true, mist: 'thick', tail: true, grown: true, small: 'coming', rising: true, zip: true, drawing: 'cat', bubbles: true, tap: 'reeds' };
    checkRender(render(cam, all, [{ who: 'player', at: Object.keys(spots(cam))[0] }]), [1], cam + ' everything');
    for (const fx of [['day'], ['dusk'], ['sunset'], ['morning'], []]) assert.equal(strip(render(cam, {}, [], fx).svg), plain, cam + ' ' + fx + ': the night');
    assert.equal(strip(render(cam, { mist: 'rolling', crowd: true }).svg), strip(render(cam, { mist: 'rolling', crowd: true }).svg), cam + ': the same each time');
  }
});

// ---------------------------------------------------------------- never dark

test('island: always bright silver under the full moon, NEVER dark: the water silver-blue, the grass and the bark light, nothing near black; the full moon round and high on every camera with sky, kept clear of the lettering', () => {
  const I = art.islandInfo();
  for (const c of I.colours.water) { assert.ok(lum(c) >= 140, 'water ' + c); const q = rgb(c); assert.ok(q[2] > q[0], 'silver-blue ' + c); }
  for (const k of ['grass', 'grassFar', 'grassNear', 'bark', 'barkLt', 'mud', 'mist', 'mistMid', 'shape']) assert.ok(lum(I.colours[k]) >= 110, k + ' light: ' + I.colours[k]);
  for (const cam of CAMS) {
    const svg = render(cam, { mist: 'rolling', luggage: 'heap', print: true, ferry: true }).svg, body = svg.slice(svg.indexOf('</defs>'));
    assert.ok(!/#000000|#111111|"black"/i.test(body), cam + ': no black');
    const ps = paints(svg).filter((p) => p.op >= 0.3);
    const darkest = ps.reduce((m, p) => Math.min(m, lum(p.c)), 255), mean = ps.reduce((s, p) => s + lum(p.c), 0) / ps.length;
    assert.ok(darkest >= 45, cam + ': the darkest colour ' + darkest.toFixed(0));
    assert.ok(mean >= 120, cam + ': bright on the whole: ' + mean.toFixed(0));
    for (const w of svg.matchAll(/data-art="water"/g)) {
      const g = group(svg.slice(w.index - 4), 'data-art="water"');
      for (const p of groupPaints(svg, g).filter((p) => p.op >= 0.5)) assert.ok(lum(p.c) >= 140, cam + ': the water is light: ' + p.c);
    }
    if (cam !== 'paws') {
      const r = render(cam), m = /data-art="moon" data-age="14" data-at="([-\d.]+) ([-\d.]+) ([-\d.]+)"/.exec(r.svg);
      assert.ok(m, cam + ': the full moon');
      assert.ok(+m[2] < 400, cam + ': high');
      const x = +m[1] / 16, y = +m[2] / 10;
      assert.ok(r.keep.some((k) => k.x <= x && k.x + k.w >= x && k.y <= y && k.y + k.h >= y), cam + ': kept');
    }
  }
});

// ---------------------------------------------------------------- the crowd

test('island `crowd`: every Clan round the clearing through K.crowd (wide, roots, case, fox), its seats only anonymous coats, never a named cat\'s: clancat with no who and no variant, reedclan 3 and 4, groveclan 4 and 5, otter 1 and 2; `standing` stands every seat up; none without it, and none on the other cameras', () => {
  const calls = withCrowd(() => {
    for (const cam of CAMS) {
      assert.ok(!/data-crowd/.test(render(cam).svg), cam + ': no crowd by default');
      render(cam, { crowd: true });
      render(cam, { crowd: 'standing' });
    }
  });
  const seen = {};
  for (const c of calls) {
    assert.ok(['wide', 'roots', 'case', 'fox'].includes(c.cam), 'only where the table has `crowd`: ' + c.cam);
    for (const st of c.seats) {
      assert.ok(st[0] > -60 && st[0] < 1660 && st[1] > 400 && st[1] <= 1010, c.cam + ': a seat in the clearing: ' + JSON.stringify(st));
      assert.ok(['left', 'right'].includes(st[2]) && st[4] > 0.5 && st[4] <= 1, c.cam + ': side-on and small: ' + JSON.stringify(st));
      assert.equal(st[3], c.opts.crowd === 'standing' ? 'stand' : 'sit', c.cam + ': ' + c.opts.crowd + ': ' + JSON.stringify(st));
      if (st.length === 5) { (seen.clancat = seen.clancat || new Set()).add(c.cam); continue; }
      assert.equal(st.length, 7, c.cam + ': who and variant both, or neither: ' + JSON.stringify(st));
      const [who, variant] = [st[5], st[6]];
      assert.ok(ANON[who] && ANON[who].includes(variant), c.cam + ': an anonymous coat: ' + who + ' ' + variant);
      assert.ok(!(NAMED[who] || []).includes(variant), c.cam + ': never a named cat\'s coat: ' + who + ' ' + variant);
      (seen[who] = seen[who] || new Set()).add(c.cam);
    }
  }
  for (const cam of ['wide', 'roots', 'case', 'fox']) assert.equal(calls.filter((c) => c.cam === cam).length > 0, true, cam + ': the crowd');
  for (const who of ['clancat', 'reedclan', 'groveclan', 'otter']) assert.ok(seen[who] && seen[who].has('wide'), 'every Clan, and the otters, round the clearing on wide: ' + who);
  // standing: the same seats, every one standing (wide and fox)
  const sit = calls.filter((c) => c.cam === 'wide' && c.opts.crowd === true).flatMap((c) => c.seats), stand = calls.filter((c) => c.cam === 'wide' && c.opts.crowd === 'standing').flatMap((c) => c.seats);
  assert.deepEqual(stand.map((st) => st.filter((v, i) => i !== 3)), sit.map((st) => st.filter((v, i) => i !== 3)), 'standing: the same seats');
  // the Clans' places in the ring: CrystalClan at the left, ReedClan at the right, GroveClan at the back
  const W = art.islandInfo().seats.wide, xs = (f) => W.filter(f).map((st) => st[0]), ys = (f) => W.filter(f).map((st) => st[1]);
  assert.ok(xs((st) => st.length === 5).every((x) => x < 800), 'CrystalClan at the left');
  assert.ok(xs((st) => st[5] === 'reedclan').every((x) => x > 800), 'ReedClan at the right');
  const mean = (a) => a.reduce((t, v) => t + v, 0) / a.length;
  assert.ok(mean(ys((st) => st[5] === 'groveclan')) < Math.min(mean(ys((st) => st.length === 5)), mean(ys((st) => st[5] === 'reedclan'))) && Math.max(...ys((st) => st[5] === 'groveclan')) < 620, 'GroveClan at the back');
  // and the roots stay behind them all
  for (const st of W) assert.ok(st[1] > spots('wide')['root-1'].y, 'the roots behind the crowd: ' + JSON.stringify(st));
});

test('island `crowd` with the kit\'s own helper (once scenes.js has it): drawn, none on a face of the cast, and a seat in a cast member\'s coat (same who and variant) left out', { skip: (!hasCats || typeof art.kit.crowd !== 'function') && 'no K.crowd yet' }, () => {
  const drawn = (svg) => [...svg.matchAll(/data-crowd="cat" data-box="([^"]+)"/g)].map((m) => m[1].split(' ').map(Number));
  for (const cam of ['wide', 'roots', 'case', 'fox']) for (const crowd of [true, 'standing']) {
    const cast = Object.keys(spots(cam)).slice(0, 4).map((at, i) => ({ who: ['player', 'tallyheart', 'reedclan', 'groveclan'][i], variant: [undefined, undefined, 3, 4][i], at, pose: 'sit' }));
    const r = render(cam, { crowd }, cast), boxes = drawn(r.svg);
    checkRender(r, cast, cam + ' crowd ' + crowd);
    assert.ok(boxes.length >= 1, cam + ': some of every Clan in the picture');
    // none on a face of the cast (the balloons point there)
    for (const h of r.heads) if (h) {
      const f = [h.x * 16 - (h.r || 3) * 12, h.y * 10 - (h.r || 3) * 12, h.x * 16 + (h.r || 3) * 12, h.y * 10 + (h.r || 3) * 12];
      for (const b of boxes) assert.ok(!meets(b, f), cam + ': a crowd cat on a face: ' + b + ' / ' + f.map(Math.round));
    }
  }
  // no cat in the picture twice: a cast ReedClan cat in coat 3 (at the heap's place, far from the ReedClan seats) takes
  // every coat-3 seat out; in coat 1 (a named cat's, never a seat's) nothing is taken out
  const three = art.islandInfo().seats.wide.filter((st) => st[5] === 'reedclan' && st[6] === 3).length;
  const one = drawn(render('wide', { crowd: true }, [{ who: 'reedclan', variant: 1, at: 'luggage', pose: 'sit' }]).svg).length;
  const same = drawn(render('wide', { crowd: true }, [{ who: 'reedclan', variant: 3, at: 'luggage', pose: 'sit' }]).svg).length;
  assert.equal(one - same, three, 'the seats in her coat left out: ' + one + ' / ' + same);
});

test('island `bubbles`: little bubbles rising over the otters in the crowd (wide), only where the kit drew an otter', () => {
  withCrowd(() => {
    const svg = render('wide', { crowd: true, bubbles: true }).svg, b = group(svg, 'data-art="bubbles"');
    assert.ok(b, 'bubbles');
    const otters = art.islandInfo().seats.wide.filter((st) => st[5] === 'otter');
    const circles = [...b.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)"/g)].map((m) => [+m[1], +m[2]]);
    assert.ok(circles.length >= otters.length * 3, 'a few bubbles each');
    for (const c of circles) assert.ok(otters.some((st) => Math.abs(c[0] - st[0]) < 60 && c[1] < st[1] - 50 && c[1] > st[1] - 220), 'over an otter: ' + c);
    assert.ok(!/data-art="bubbles"/.test(render('wide', { bubbles: true }).svg), 'no otters, no bubbles');
  });
  withoutCrowd(() => assert.ok(!/data-art="bubbles"/.test(render('wide', { crowd: true, bubbles: true }).svg), 'nothing over nothing'));
});

// ---------------------------------------------------------------- the luggage, the ferry, the print, the taps

test('island `luggage`: the reed heap, round and lumpy (shore and wide), and \'open\', the reeds pulled off lying in a loose pile; `ferry`: the Moon Ferry\'s front raft at the water\'s edge (shore)', () => {
  for (const cam of ['shore', 'wide']) {
    assert.ok(!/data-art="luggage"|data-art="reeds-open"/.test(render(cam).svg), cam + ': nothing by default');
    assert.ok(/data-art="luggage"/.test(render(cam, { luggage: 'heap' }).svg) && !/data-art="reeds-open"/.test(render(cam, { luggage: 'heap' }).svg), cam + ': heap');
    assert.ok(/data-art="reeds-open"/.test(render(cam, { luggage: 'open' }).svg) && !/data-art="luggage"/.test(render(cam, { luggage: 'open' }).svg), cam + ': open');
  }
  const W = spots('wide'), hb = boxOf(render('wide', { luggage: 'heap' }).svg, 'data-art="luggage"');
  assert.ok(hb[0] <= 20 && W.luggage.x > hb[0] && W.luggage.x < hb[2], 'wide: the heap at the clearing\'s left edge, at `luggage`');
  const S = spots('shore'), sb = boxOf(render('shore', { luggage: 'heap' }).svg, 'data-art="luggage"');
  assert.ok(Math.abs(S.drag.x - sb[2]) < 260 && S.drag.y > sb[1], 'shore: Riffle at `drag` beside the heap');
  const f = render('shore', { ferry: true }).svg;
  assert.ok(/data-art="ferry"/.test(f) && !/data-art="ferry"/.test(render('shore').svg), 'the ferry\'s front raft only with `ferry`');
  const I = art.islandInfo(), raft = S.raft;
  assert.ok(I.inPoly(I.shore.water, raft.x, raft.y + 40), '`raft`: at the Moon Ferry\'s front, at the water\'s edge');
  for (const k of ['land-1', 'land-2', 'land-3', 'drag', 'print']) assert.ok(!I.inPoly(I.shore.water, S[k].x, S[k].y - 4), k + ': on the shore, not in the water');
});

test('island `print`: the badger\'s old track in the mud, one big print: a wide pad, five toes in a row, long digging claw marks, old and dry at its edges (never fresh), never with the animal; `print` beside it, her nose to it', () => {
  const svg = render('shore', { print: true }).svg, P = group(svg, 'data-art="print"'), b = boxOf(svg, 'data-art="print"'), I = art.islandInfo(), A = spots('shore');
  assert.ok(P && /data-old="dry"/.test(P), 'drawn, old and dry');
  assert.ok(!/data-art="print"/.test(render('shore').svg), 'only with `print`');
  assert.equal((P.match(/<ellipse/g) || []).length, 10, 'five toes in a row (each with its dry rim)');
  const toes = [...P.matchAll(new RegExp('<ellipse cx="([-\\d.]+)" cy="([-\\d.]+)" rx="([\\d.]+)" ry="([\\d.]+)" fill="' + I.colours.printIn + '"', 'g'))].map((m) => [+m[1], +m[2]]);
  assert.equal(toes.length, 5);
  assert.ok(Math.max(...toes.map((t) => t[1])) - Math.min(...toes.map((t) => t[1])) < 12, 'in a row');
  assert.ok(/stroke-linecap="round"/.test(P), 'claw marks');
  for (const p of groupPaints(svg, P)) assert.ok(lum(p.c) >= 110, 'in bright moonlight, dry: ' + p.c);
  assert.ok(!I.inPoly(I.shore.water, (b[0] + b[2]) / 2, b[3]), 'in the mud, not the water');
  assert.ok(A.print.x < b[0] + 40 && b[0] - A.print.x < A.print.h, 'print: beside it, facing it');
  assert.equal(A.print.face, 'right');
  assert.ok(!/<g transform="translate\(|data-crowd/.test(P), 'no animal with it');
});

test('island `tap`: unpainted <rect class="pc-tap" data-tap="…"> boxes: reeds on the heap (wide), mist on the mist bank (mist), print on the print (shore); only where the thing is drawn; nothing painted; first in keep', () => {
  const cases = [['wide', { luggage: 'heap', tap: 'reeds' }, 'reeds', 'data-art="luggage"'], ['mist', { mist: 'rolling', tap: 'mist' }, 'mist', 'data-art="mist"'], ['shore', { print: true, tap: 'print' }, 'print', 'data-art="print"']];
  for (const [cam, opts, name, what] of cases) {
    const r = render(cam, opts), m = new RegExp('<rect x="([-\\d.]+)" y="([-\\d.]+)" width="([\\d.]+)" height="([\\d.]+)" fill="none" class="pc-tap" data-tap="' + name + '" pointer-events="none"/>').exec(r.svg);
    assert.ok(m, cam + ': the ' + name + ' box');
    const box = [+m[1], +m[2], +m[1] + +m[3], +m[2] + +m[4]], target = boxOf(r.svg, what);
    assert.ok(target && meets(box, target), cam + ': on the ' + name);
    // nothing painted: without the box, the same picture
    const off = Object.assign({}, opts); delete off.tap;
    assert.equal(strip(r.svg.replace(m[0], '')), strip(render(cam, off).svg), cam + ': the box paints nothing');
    const k = r.keep[0];
    assert.ok(k.x <= box[0] / 16 + 0.5 && k.y <= box[1] / 10 + 0.5, cam + ': first in keep');
    // without its thing, no box
    const bare = Object.assign({}, opts); for (const kk of Object.keys(bare)) if (kk !== 'tap') delete bare[kk];
    assert.ok(!/class="pc-tap"/.test(render(cam, bare).svg), cam + ': no box without the ' + name);
  }
  for (const cam of ['roots', 'fox', 'sky', 'paws']) for (const t of ['reeds', 'mist', 'print']) assert.ok(!/class="pc-tap"/.test(render(cam, { tap: t, mist: 'thick', luggage: 'heap', print: true }).svg), cam + ': no ' + t + ' box');
});

// ---------------------------------------------------------------- the mist and the Mistscales

test('island `mist`: soft and silver, the moon glowing through it: rolling a low bank, thick round the great tree too; never grey-dark', () => {
  for (const cam of ['wide', 'roots', 'case', 'fox', 'mist', 'sky']) {
    assert.ok(!/data-art="mist"/.test(render(cam).svg), cam + ': no mist by default');
    for (const mist of ['rolling', 'thick']) {
      const svg = render(cam, { mist }).svg, M = group(svg, 'data-art="mist"');
      assert.ok(M, cam + ' ' + mist + ': drawn');
      for (const p of groupPaints(svg, M).filter((p) => p.op > 0)) assert.ok(lum(p.c) >= 200, cam + ': silver, never grey-dark: ' + p.c);
      if (cam !== 'sky' && cam !== 'roots') assert.ok(/data-art="moon-glow"/.test(svg), cam + ': the moon glowing through it');
    }
    assert.ok(render(cam, { mist: 'thick' }).svg.length > render(cam, { mist: 'rolling' }).svg.length, cam + ': thick is more of it');
  }
});

test('island: the thin veil with `mist: \'thick\'` (mist, sky) is in the `over` layer at the panel\'s right only, never over a face at speak, mentor, nose or mama', { skip: !hasCats && 'no cats.js' }, () => {
  const casts = {
    mist: [{ who: 'player', at: 'speak', pose: 'sit' }, { who: 'tallyheart', at: 'mentor', pose: 'lookup' }, { who: 'sprinkle', at: 'nose', pose: 'sit' }, { who: 'mistscale', variant: 1, at: 'mama', pose: 'lean' }],
    sky: [{ who: 'sprinkle', at: 'nose', pose: 'fly' }, { who: 'sprinkle', at: 'fly', pose: 'fly' }]
  };
  for (const [cam, cast] of Object.entries(casts)) {
    assert.ok(!/data-art="veil"/.test(render(cam, { mist: 'rolling' }, cast).svg), cam + ': no veil with rolling mist');
    const r = render(cam, { mist: 'thick', grown: true }, cast), V = group(r.svg, 'data-art="veil"');
    assert.ok(V, cam + ': the veil');
    const zone = /data-zone="([^"]+)"/.exec(V)[1].split(' ').map(Number);
    assert.ok(zone[0] >= 1200, cam + ': at the panel\'s right only');
    // it is laid after the set's back layer and before the cast in front (the over layer)
    assert.ok(r.svg.indexOf('data-art="veil"') > r.svg.indexOf('data-art="mist"'), cam + ': over the mist');
    const faces = r.heads.map((h, i) => ({ h, at: cast[i].at })).filter((f) => f.h && ['speak', 'mentor', 'nose', 'mama'].includes(f.at))
      .map((f) => [f.h.x * 16 - (f.h.r || 3) * 16, f.h.y * 10 - (f.h.r || 3) * 16, f.h.x * 16 + (f.h.r || 3) * 16, f.h.y * 10 + (f.h.r || 3) * 16]);
    for (const e of V.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([\d.]+)" ry="([\d.]+)"/g)) {
      const b = [+e[1] - +e[3], +e[2] - +e[4], +e[1] + +e[3], +e[2] + +e[4]];
      assert.ok(b[0] >= zone[0] - 200, cam + ': a wisp at the right: ' + b);
      for (const f of faces) assert.ok(!meets(b, f), cam + ': a wisp over a face: ' + b + ' / ' + f.map(Math.round));
    }
  }
});

test('island `tail`, `grown`, `small`, `rising`, `zip`: soft grey shapes in the mist, gentle and faceless, each where its camera has it', () => {
  const lightGrey = (svg, g) => { for (const p of groupPaints(svg, g)) { const q = rgb(p.c); assert.ok(lum(p.c) >= 140 && Math.max(...q) - Math.min(...q) <= 50, 'soft grey: ' + p.c); } };
  // the tail tip curling through the mist (mist)
  const t = render('mist', { mist: 'thick', tail: true }).svg;
  assert.ok(group(t, 'data-art="tail"'), 'the tail');
  lightGrey(t, group(t, 'data-art="tail"'));
  assert.ok(!/data-art="tail"/.test(render('mist', { mist: 'thick' }).svg), 'only with `tail`');
  // the grown Mistscales: great soft grey shapes, no faces (no eyes, no mouths: nothing but shapes)
  for (const cam of ['mist', 'sky']) {
    const svg = render(cam, { mist: 'thick', grown: true }).svg, G = group(svg, 'data-art="grown"');
    assert.ok(G && +/data-n="(\d+)"/.exec(G)[1] >= 2, cam + ': a few of them');
    lightGrey(svg, G);
    assert.ok(!/#FFFFFF"|eye|mouth|tooth|claw/i.test(G.replace(/data-[a-z]+="[^"]*"/g, '')), cam + ': no faces');
  }
  // the small dragonet shapes: one; three or four; coming toward her (nearer)
  for (const cam of ['case', 'mist']) {
    const count = (v) => { const s = render(cam, { mist: 'rolling', small: v }).svg, G = group(s, 'data-art="small"'); return G ? +/data-n="(\d+)"/.exec(G)[1] : 0; };
    assert.equal(count('none'), 0, cam);
    assert.equal(count('one'), 1, cam + ': one');
    assert.ok(count('some') >= 3 && count('some') <= 4, cam + ': three or four');
    const I = art.islandInfo()[cam].small;
    assert.ok(Math.min(...I.coming.map((q) => q[1])) > Math.max(...I.some.map((q) => q[1])) - 120 && Math.max(...I.coming.map((q) => q[2])) >= Math.max(...I.some.map((q) => q[2])), cam + ': coming: nearer her, bigger');
    // stepping out toward her: on the case camera from the right (she sits at the left); on the mist camera the waiting
    // shapes sit in the left mist band beside Mama, and the coming ones step out of the bank at the right, nearer her
    if (cam === 'case') assert.ok(Math.min(...I.coming.map((q) => q[0])) < Math.min(...I.some.map((q) => q[0])), cam + ': coming: stepping out toward her (left)');
    else assert.ok(Math.min(...I.coming.map((q) => q[1])) > Math.max(...I.some.concat(I.one).map((q) => q[1])), cam + ': coming: nearer her than the waiting shapes');
  }
  // the sky: rising, a small one with them; zip, the other way toward the towers far downriver
  const sky = render('sky', { mist: 'thick', rising: true, zip: true }).svg;
  assert.ok(group(sky, 'data-art="rising"'), 'rising');
  lightGrey(sky, group(sky, 'data-art="rising"'));
  const z = boxOf(sky, 'data-art="zip"'), I = art.islandInfo().sky;
  const towers = boxOf(sky, 'data-art="towers"') || [500, 860, 640, 952];
  assert.ok(z && (z[0] + z[2]) / 2 < 800 && I.rising.every((q) => q[0] > z[2]), 'zip: one small shape the other way (left), the Mistscales rising at the right');
  assert.ok(z[0] < towers[2] + 200 && z[3] < towers[3], 'toward the towers far downriver: ' + z + ' / ' + towers);
  assert.ok(/data-art="towers"/.test(sky), 'the towers far downriver');
  assert.ok(/<ellipse[^>]*fill="none" stroke="#EEF3FF"/.test(group(sky, 'data-art="zip"')), 'a little ring of hiccup mist behind it');
  for (const k of ['rising', 'zip']) assert.ok(!new RegExp('data-art="' + k + '"').test(render('sky').svg), 'no ' + k + ' by default');
});

test('island `drawing: \'cat\'` (case): a little cat scratched in the earth in front of `beside` (Wisp\'s)', () => {
  const svg = render('case', { drawing: 'cat' }).svg, b = boxOf(svg, 'data-art="drawing"'), A = spots('case');
  assert.ok(b, 'drawn');
  assert.ok(!/data-art="drawing"/.test(render('case').svg), 'only with it');
  assert.ok(Math.abs((b[0] + b[2]) / 2 - A.beside.x) < 160 && b[1] > A.beside.y - 80, 'in front of beside: ' + b);
  const lines = group(svg, 'data-art="drawing"');
  assert.ok((lines.match(/M/g) || []).length >= 9, 'four legs, two ears, a body and a tail');
});

// ---------------------------------------------------------------- the case: each dragonet fits at `beside`

test('island `case`: each dragonet fits at `beside` at its own size, between our cat and the fox: Squall, Hail and Mizzle no taller than our cat; Puddle, Wisp and Sleet Sprinkle\'s size; Sprinkle; every face in the panel, none on hers or the fox\'s', { skip: !hasCats && 'no cats.js' }, () => {
  const dragonets = [['squall', 'roar'], ['hail', 'bounce'], ['mizzle', 'yawn'], ['puddle', 'sit'], ['wisp', 'draw'], ['sleet', 'point'], ['sprinkle', 'sit'], ['sprinkle', 'fly']];
  for (const [who, pose] of dragonets) {
    if (!art.vocab.cast.includes(who)) continue;
    const cast = [{ who: 'player', at: 'speak', pose: 'sit', mood: 'happy' }, { who, at: 'beside', pose, mood: 'happy', tap: 'nose' }, { who: 'reynard', at: 'fox', pose: 'sit' }, { who: 'tallyheart', at: 'mentor', pose: 'sit' }];
    const r = render('case', { crowd: true, mist: 'thick' }, cast);
    checkRender(r, cast, who);
    const [me, it, fox] = r.heads;
    assert.ok(me && it && fox, who + ': every face in the panel');
    const d = (p, q) => Math.hypot((p.x - q.x) * 16, (p.y - q.y) * 10);
    assert.ok(d(me, it) > ((me.r || 3) + (it.r || 3)) * 16 * 0.85, who + ': not on her face: ' + d(me, it).toFixed(0));
    assert.ok(d(fox, it) > ((fox.r || 3) + (it.r || 3)) * 16 * 0.85, who + ': not on the fox\'s face');
    assert.ok(it.x > me.x && it.x < fox.x, who + ': between her and the fox');
  }
});

test('island `mist`: Mama\'s spot at the right with room for her face, the anchor\'s height her face\'s height (about two cats tall: more than a cat\'s spot there); `nose` on the grass under her, at the left of her; the eldest bowing lower and further right', () => {
  const A = spots('mist');
  assert.ok(A.mama.h >= 1.2 * A.speak.h, 'her face bigger than a cat');
  assert.ok(A.mama.y - A.mama.h > 0, 'her face below the top of the panel');
  assert.ok(A.mama.y <= 1080, 'the foot of her neck just under the panel, in the mist');
  assert.ok(A.nose.x < A.mama.x && A.nose.x > A.beside.x, 'nose: between our cat\'s friend and Mama');
  for (const k of ['speak', 'mentor', 'front-1', 'front-2']) assert.ok(A[k].x < A.beside.x, k + ': at the left');
  assert.ok(A.eldest.x > A.mama.x, 'the eldest further right');
  // as drawn (once cats.js has her): the eldest's bowed face lower than Mama's, and further right; Sprinkle's face at `nose` by
  // Mama's, never hidden behind it
  if (hasCats && art.vocab.cast.includes('mistscale')) {
    const lean = render('mist', { mist: 'thick' }, [{ who: 'mistscale', variant: 1, at: 'mama', pose: 'lean' }]).heads[0];
    const bow = render('mist', { mist: 'thick' }, [{ who: 'mistscale', variant: 2, at: 'eldest', pose: 'bow' }]).heads[0];
    assert.ok(lean && bow && bow.y > lean.y && bow.x > lean.x, 'the eldest\'s face lower and further right: ' + JSON.stringify([lean, bow]));
    assert.ok(lean.y - lean.r * 1.6 > -2, 'Mama\'s face in the panel: ' + JSON.stringify(lean));
    for (const pose of ['lean', 'nuzzle', 'lift']) {
      const r = render('mist', { mist: 'thick' }, [{ who: 'sprinkle', at: 'nose', pose: 'sit' }, { who: 'mistscale', variant: 1, at: 'mama', pose }]), [sp, ma] = r.heads;
      assert.ok(sp && ma && sp.x < ma.x, pose + ': Sprinkle at Mama\'s nose, at the left of her face');
      assert.ok(Math.hypot((sp.x - ma.x) * 16, (sp.y - ma.y) * 10) > ma.r * 16 * 0.75, pose + ': Sprinkle\'s face not hidden in Mama\'s: ' + JSON.stringify([sp, ma]));
    }
  }
});

test('island `paws`: close on our cat\'s chest and forepaws in the lower panel, her head in the panel; Sprinkle leaning down from the top right above her paws', { skip: !hasCats && 'no cats.js' }, () => {
  const cast = [{ who: 'player', at: 'close', pose: 'sit', mood: 'wonder', tap: 'paw' }, { who: 'sprinkle', at: 'above', pose: 'lookdown', holds: 'pebble' }];
  const r = render('paws', {}, cast);
  checkRender(r, cast, 'paws');
  assert.ok(r.heads[0] && r.heads[1], 'both faces in the panel');
  assert.ok(r.heads[1].x > r.heads[0].x && r.heads[1].y < 60, 'Sprinkle\'s head at the right, up');
  assert.ok(/pc-tap/.test(r.svg), 'the paw Tap is drawn');
  const A = spots('paws');
  assert.ok(A.close.y >= 990 && A.close.h > 1000, 'our cat filling the lower panel');
});

test('island: odd input never throws: unknown cameras and spots, custom spots, odd option values, no character drawings, no ferry painters', () => {
  const cases = [{ set: 'island' }, { set: 'island', cam: 'nowhere' }, { set: 'island', cam: 'case', cast: [{ who: 'player', at: 'nowhere' }] },
    { set: 'island', cam: 'wide', cast: [{ who: 'player', at: { x: 700, y: 900 } }, null, {}] }, { set: 'island', cam: 'mist', opts: { nope: true, mist: 'fog', small: 9, tap: 'x' }, fx: art.vocab.fx.slice() },
    { set: 'island', cam: 'shore', opts: { luggage: true, ferry: 'yes', print: 1, moon: 14 } }];
  for (const c of cases) checkRender(art.render(c, { look: LOOK }), (c.cast || []).filter((m) => m && typeof m === 'object'), JSON.stringify(c));
  const keep = art.character;
  try {
    art.character = undefined;
    for (const cam of CAMS) {
      const cast = Object.keys(spots(cam)).map((at) => ({ who: 'player', at }));
      checkRender(render(cam, { mist: 'thick', luggage: 'heap', print: true, ferry: true }, cast), cast, cam + ' without cats.js');
    }
  } finally { art.character = keep; }
});

test('island: every animation class it uses is defined in PC.art.css', () => {
  const used = new Set();
  withCrowd(() => {
    for (const cam of CAMS) {
      const svg = render(cam, { mist: 'thick', crowd: true, bubbles: true, luggage: 'heap', grown: true, rising: true, zip: true }).svg;
      for (const m of svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => used.add(c));
    }
  });
  for (const c of used) if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') assert.ok(art.css.includes('.' + c + '{'), 'css defines .' + c);
});

// ---------------------------------------------------------------- the gallery (dev/gallery.html)

test('the gallery: SAMPLES.island has every camera, each with a cast at its spots; with the extras, every anchor and every option value shown, and `crowd: \'standing\'` among the chapter 10 extras', () => {
  const page = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  const js = page.slice(page.lastIndexOf('<script>') + 8, page.lastIndexOf('</script>'));
  const from = js.indexOf('// ---- a sample cast'), to = js.indexOf('// ---- panels');
  const { SAMPLES, EXTRA } = new Function(js.slice(from, to) + '\nreturn { SAMPLES: SAMPLES, EXTRA: EXTRA };')();
  assert.deepEqual(Object.keys(SAMPLES.island || {}), CAMS, 'a sample for every camera, in order');
  const seen = new Set(), opts = new Set();
  const look = (cam, s) => { for (const m of s.cast || []) seen.add(cam + ':' + m.at); for (const [k, v] of Object.entries(s.opts || {})) opts.add(k + ':' + JSON.stringify(v)); };
  for (const cam of CAMS) {
    const s = SAMPLES.island[cam];
    assert.ok(s.cast.length >= 1, cam + ': a cast');
    for (const m of s.cast) assert.ok(ANCHORS[cam].includes(m.at), cam + ': ' + m.at + ' is its spot');
    look(cam, s);
  }
  for (const e of EXTRA) if (e[0] === 'island') look(e[1], e[2]);
  for (const cam of CAMS) for (const at of ANCHORS[cam]) assert.ok(seen.has(cam + ':' + at), 'someone at ' + cam + ' ' + at);
  for (const [k, vals] of Object.entries(OPTS)) for (const v of vals) if (v !== false && v !== 'none') assert.ok(opts.has(k + ':' + JSON.stringify(v)), 'the gallery shows ' + k + ': ' + JSON.stringify(v));
  assert.ok(EXTRA.some((e) => e[0] === 'island' && e[2].opts && e[2].opts.crowd === 'standing' && /^chapter 10: /.test(e[3])), 'the island\'s crowd standing, a chapter 10 extra');
});

// ---------------------------------------------------------------- chapter 10's review

test('island, the review’s staging: the case’s fox sits back across the grass with the weasels nearer the river edge, all on the grass; the swim a little row going away from the bank; GroveClan’s leader clear of Sloshbank’s spot; the small shapes clear of Mama; the crowd’s filling seats drawn back to front', { skip: !hasCats && 'no cats.js' }, () => {
  const I = art.islandInfo(), C = spots('case'), F = spots('fox'), W = spots('wide'), M = spots('mist');
  // case: the fox furthest back, the weasels nearer, none in the river; Sprinkle's spot (880, h 240) well short of him
  assert.ok(C.fox.y < C['weasel-1'].y && C.fox.y < C['weasel-2'].y, 'the fox behind the weasels');
  for (const k of ['fox', 'weasel-1', 'weasel-2']) assert.ok(!I.inPoly(I.case.river, C[k].x, C[k].y - 4), k + ': on the grass');
  // fox camera: Reynard furthest out, Snip and Snatch behind him toward the bank, each in the water and the panel
  assert.ok(F.water.y < F['water-2'].y && F['water-2'].y < F['water-3'].y && F.water.x > F['water-2'].x && F['water-2'].x > F['water-3'].x, 'a row going away from the bank');
  for (const k of ['water', 'water-2', 'water-3']) assert.ok(I.inPoly(I.fox.river, F[k].x, F[k].y), k + ': in the water');
  // wide: GroveClan's leader along her root toward the trunk, not over Sloshbank's spot
  assert.ok(Math.abs(W['root-3'].x - W['crowd-4'].x) >= 120, 'root-3 clear of crowd-4: ' + W['root-3'].x + ' / ' + W['crowd-4'].x);
  // mist: the small shapes (one, some) never behind Mama's face and neck, nor at the nose, speak or mentor spots
  const mama = render('mist', { mist: 'thick' }, [{ who: 'mistscale', variant: 1, at: 'mama', pose: 'lean', mood: 'kind', facing: 'left' }]).heads[0];
  const face = [mama.x * 16 - mama.r * 16, mama.y * 10 - mama.r * 16, 1640, 1100];
  for (const q of I.mist.small.one.concat(I.mist.small.some)) {
    assert.ok(!(q[0] > face[0] && q[0] < face[2] && q[1] > face[1]), 'a shape behind Mama: ' + q);
    for (const k of ['nose', 'speak', 'mentor']) assert.ok(Math.abs(q[0] - M[k].x) > 120 || q[1] < M[k].y - M[k].h, 'a shape behind ' + k + ': ' + q);
  }
  // the crowd: a seat further back that meets a nearer one is listed before it (drawn in list order)
  for (const [cam, seats] of [['wide', I.seats.wide], ['case', I.seats.case]]) {
    seats.forEach((a, i) => seats.forEach((b, j) => {
      if (a[1] < b[1] && Math.abs(a[0] - b[0]) < 70 && b[1] - a[1] < 60) assert.ok(i < j, cam + ': ' + JSON.stringify(a) + ' listed after the nearer ' + JSON.stringify(b));
    }));
  }
});
