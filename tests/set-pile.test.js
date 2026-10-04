// The prey pile set and PC.art.prey (app/art/sets/pile.js): node --test tests/set-pile.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['wide', 'close', 'low'];
const ANCHORS = ['pile-left', 'pile-right', 'beside', 'crowd-1', 'crowd-2', 'crowd-3', 'fountain-edge'];
const OPTS = ['pairs', 'lit', 'dug', 'vole'];
const WHO = ['tallyheart', 'player', 'grizzled', 'clancat', 'glintstar', 'snorer', 'mutterer'];

// ---------------------------------------------------------------- helpers

// A small XML well-formedness check: balanced tags, quoted attributes, escaped text.
function checkXml(svg, root) {
  const stack = [];
  const re = /<[^>]*>|[^<]+/g;
  let m, first = null;
  while ((m = re.exec(svg))) {
    const tok = m[0];
    if (tok[0] !== '<') {
      assert.ok(!/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(tok), 'unescaped & in text: ' + tok.slice(0, 60));
      continue;
    }
    if (tok.startsWith('</')) {
      const name = tok.slice(2, -1).trim();
      assert.equal(stack.pop(), name, 'closing tag mismatch at </' + name + '>');
      continue;
    }
    const mm = /^<([a-zA-Z][\w:.-]*)((?:\s+[\w:.-]+="[^"<]*")*)\s*(\/?)>$/.exec(tok);
    assert.ok(mm, 'malformed tag: ' + tok.slice(0, 120));
    const names = (mm[2].match(/[\w:.-]+(?==")/g) || []);
    assert.equal(new Set(names).size, names.length, 'duplicate attribute in ' + tok.slice(0, 80));
    if (!first) first = mm[1];
    if (!mm[3]) stack.push(mm[1]);
  }
  assert.equal(stack.length, 0, 'unclosed tags: ' + stack.slice(-3).join(', '));
  if (root) assert.equal(first, root, 'the root element is <' + root + '>');
}

function viewBox(svg) {
  const m = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(svg);
  assert.ok(m, 'svg has a viewBox');
  return m[1].split(/\s+/).map(Number);
}

function checkRender(r, scene, label) {
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg, 'svg');
  const vb = viewBox(r.svg);
  assert.ok(Math.abs(vb[2] / vb[3] - 1.6) < 0.01, label + ': 16:10 viewBox, got ' + vb.join(' '));
  assert.ok(vb[0] >= -0.5 && vb[1] >= -0.5 && vb[0] + vb[2] <= 1600.5 && vb[1] + vb[3] <= 1000.5, label + ': inside the world: ' + vb.join(' '));
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  const cast = scene.cast || [];
  assert.equal(r.heads.length, cast.length, label + ': one head per cast member');
  r.heads.forEach((h, i) => {
    if (h === null) return;
    assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ' head ' + i + ' in range: ' + JSON.stringify(h));
  });
  assert.ok(Array.isArray(r.keep), label + ': keep is a list');
  r.keep.forEach((k) => assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, label + ': keep inside the panel ' + JSON.stringify(k)));
  return ids;
}

// per-render ids: scenes.js's pcs<n>- and cats.js's pc<n>-
const strip = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');

// The pile row of build.md's "Art vocabulary, chapter 2" table.
function specRow() {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const row = md.split('\n').find((l) => l.startsWith('| `pile`'));
  assert.ok(row, 'build.md has the pile row');
  const cells = row.replace(/\\\|/g, '\u0001').split('|').slice(1, -1).map((c) => c.trim());
  const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  return { cams: ticks(cells[1]), anchors: ticks(cells[2]), opts: ticks(cells[3]).map((t) => t.split(':')[0].trim()) };
}

// ---------------------------------------------------------------- vocabulary

test('vocab: the pile set lists exactly the cameras, anchors and options of the contract', () => {
  const v = art.vocab.sets.pile;
  assert.ok(v, 'PC.art.vocab.sets.pile');
  assert.deepEqual([...v.cams].sort(), [...CAMS].sort());
  assert.deepEqual([...v.anchors].sort(), [...ANCHORS].sort());
  assert.deepEqual(Object.keys(v.opts).sort(), [...OPTS].sort());
  const spec = specRow();
  for (const c of spec.cams) assert.ok(v.cams.includes(c), 'camera ' + c + ' from build.md');
  for (const a of spec.anchors) assert.ok(v.anchors.includes(a), 'anchor ' + a + ' from build.md');
  for (const o of spec.opts) assert.ok(Object.prototype.hasOwnProperty.call(v.opts, o), 'option ' + o + ' from build.md');
  assert.equal(v.opts.pairs, 'number');
  assert.equal(v.opts.lit, 'number');
  assert.deepEqual(v.opts.dug, [true, false]);
  assert.deepEqual(v.opts.vole, [true, false]);
  const info = art.sceneInfo('pile');
  assert.equal(info.defaults.pairs, 8, 'eight pairs by default');
  assert.equal(info.defaults.lit, 0, 'nothing lit by default');
  assert.equal(info.defaults.vole, false, 'no loose vole by default');
});

test('fountain-edge is elevated (Glintstar rises there), the rest stand on the ground', () => {
  const a = art.sceneInfo('pile').anchors.main;
  assert.equal(a['fountain-edge'].elev, true);
  for (const k of ANCHORS) if (k !== 'fountain-edge') assert.ok(!a[k].elev, k + ' is on the ground');
  // depth: nearer spots (lower on the page) are bigger
  assert.ok(a['crowd-3'].h > a['crowd-1'].h && a['crowd-1'].h > a['crowd-2'].h, 'crowd sizes follow depth');
});

// ---------------------------------------------------------------- every camera, anchor and option

test('every camera renders with a cast member at each anchor, one at a time and all together', () => {
  for (const cam of CAMS) {
    ANCHORS.forEach((at, i) => {
      const scene = { set: 'pile', cam, cast: [{ who: WHO[i % WHO.length], at, pose: at === 'beside' ? 'lie' : 'sit', mood: 'neutral', facing: i % 2 ? 'left' : 'right', variant: (i % 6) + 1 }], fx: ['morning'] };
      checkRender(art.render(scene, { look: LOOK }), scene, cam + ' @' + at);
    });
    const all = { set: 'pile', cam, opts: { dug: true, lit: 3 }, cast: ANCHORS.map((at, i) => ({ who: WHO[i], at, pose: at === 'beside' ? 'lie' : 'sit' })), fx: ['morning'] };
    checkRender(art.render(all, { look: LOOK }), all, cam + ' all anchors');
  }
});

test('every option value renders in every camera, and out-of-range values are clamped, never thrown', () => {
  const values = [];
  for (let p = 0; p <= 10; p++) values.push({ pairs: p });
  for (let l = 0; l <= 10; l++) values.push({ lit: l });
  values.push({ dug: true }, { dug: false }, { vole: true }, { vole: false }, { pairs: 0, vole: true }, { pairs: 10, lit: 10, dug: true, vole: true },
    { pairs: 99 }, { pairs: -3 }, { lit: 40 }, { pairs: 'lots' }, { lit: null }, {});
  for (const cam of CAMS) for (const opts of values) {
    const scene = { set: 'pile', cam, opts, cast: [], fx: [] };
    checkRender(art.render(scene, { look: LOOK }), scene, cam + ' ' + JSON.stringify(opts));
  }
});

test('every effect, and every time of day, renders on every camera', () => {
  for (const cam of CAMS) {
    for (const f of art.vocab.fx) {
      const scene = { set: 'pile', cam, cast: [{ who: 'grizzled', at: 'beside', pose: 'lie', mood: 'sleepy' }], fx: [f] };
      checkRender(art.render(scene, { look: LOOK }), scene, cam + ' fx ' + f);
    }
    const every = { set: 'pile', cam, opts: { lit: 4, dug: true }, cast: [{ who: 'player', at: 'pile-left' }], fx: art.vocab.fx.slice() };
    checkRender(art.render(every, { look: LOOK }), every, cam + ' every fx');
  }
});

test('morning by default; sunset is the camp\'s last golden light; the pile only draws classes PC.art.css defines', () => {
  const pal = art.kit.PAL;
  const plain = art.render({ set: 'pile', cam: 'wide' }).svg;
  assert.ok(plain.includes(pal.morning.sky[0]), 'the morning sky by default');
  const eve = art.render({ set: 'pile', cam: 'wide', fx: ['sunset'] }).svg;
  assert.ok(eve.includes(pal.golden.sky[0]) && !eve.includes(pal.morning.sky[0]), 'sunset maps to golden light');
  for (const cam of CAMS) {
    const svg = art.render({ set: 'pile', cam, opts: { lit: 10, pairs: 10, dug: true }, fx: art.vocab.fx }).svg;
    for (const m of svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => {
      if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') assert.ok(art.css.includes('.' + c + '{'), 'css defines .' + c);
    });
  }
});

// ---------------------------------------------------------------- what the options do

test('pairs: one stack per pair, each reported in keep, all inside the close-up', () => {
  for (const cam of CAMS) for (let p = 0; p <= 10; p++) {
    const r = art.render({ set: 'pile', cam, opts: { pairs: p } });
    assert.equal(r.keep.length, p, cam + ': ' + p + ' stacks kept clear of the lettering');
  }
  assert.equal(art.render({ set: 'pile', cam: 'close' }).keep.length, 8, 'eight stacks by default');
  // the close-up shows every stack whole, up to ten
  for (const p of [8, 10]) {
    const raw = art.render({ set: 'pile', cam: 'close', opts: { pairs: p } }).keep;
    raw.forEach((k) => assert.ok(k.x > 0.5 && k.x + k.w < 99.5 && k.y > 0.5 && k.y + k.h < 99.5, 'close, ' + p + ' pairs: a whole stack ' + JSON.stringify(k)));
  }
  // and the wide shot shows them too, left of centre
  const wide = art.render({ set: 'pile', cam: 'wide' }).keep;
  const cx = wide.reduce((s, k) => s + k.x + k.w / 2, 0) / wide.length;
  assert.ok(cx < 50, 'the pile is left of centre in the wide shot: ' + cx.toFixed(1));
});

test('lit: the first n stacks glow (two pieces each, one sparkle per stack); never more than the pairs', () => {
  const glows = (svg) => (svg.match(/class="pcs-pulse"/g) || []).length;
  const sparks = (svg) => (svg.match(/#eea20c/g) || []).length;
  for (const cam of CAMS) {
    for (const lit of [0, 1, 3, 8]) {
      const svg = art.render({ set: 'pile', cam, opts: { lit } }).svg;
      assert.equal(glows(svg), lit, cam + ' lit ' + lit);
      assert.equal(sparks(svg), lit, cam + ' sparkles for lit ' + lit);
      assert.equal((svg.match(/fill="#ffb21f"/g) || []).length, lit * 2, cam + ': the counts glow on both pieces of each lit stack');
    }
    assert.equal(glows(art.render({ set: 'pile', cam, opts: { pairs: 3, lit: 9 } }).svg), 3, 'lit is capped by pairs');
  }
});

test('dug: soft dug-up earth behind the pile, only when asked', () => {
  for (const cam of CAMS) {
    const plain = art.render({ set: 'pile', cam }).svg, dug = art.render({ set: 'pile', cam, opts: { dug: true } }).svg;
    assert.ok(dug.length > plain.length + 2000, cam + ': the earth is drawn');
    assert.equal(art.render({ set: 'pile', cam, opts: { dug: false } }).svg.length, plain.length, cam + ': dug: false is the default');
  }
});

// the prey's own colours (PC.art.prey): a mouse's pink nose, a vole's, and a fish's slate eye-line and fins
const MOUSE_NOSE = '#E58C9C', VOLE_NOSE = '#B8707C', FISH = ['#2F3A48', '#6F8AA6', '#9FB3C6'];
const count = (svg, hex) => (svg.match(new RegExp('fill="' + hex + '"', 'g')) || []).length;

test('the pile is mice and voles only, no fish, in every camera and every size (the text: "mice and voles")', () => {
  for (const cam of CAMS) for (let p = 0; p <= 10; p++) for (const lit of [0, p]) {
    const svg = art.render({ set: 'pile', cam, opts: { pairs: p, lit, dug: true } }).svg;
    for (const hex of FISH) assert.ok(!svg.includes(hex), cam + ', ' + p + ' pairs: no fish (' + hex + ')');
    // two pieces a stack, each a mouse or a vole
    assert.equal(count(svg, MOUSE_NOSE) + count(svg, VOLE_NOSE), p * 2, cam + ', ' + p + ' pairs: every piece is a mouse or a vole');
    if (p >= 2) assert.ok(count(svg, MOUSE_NOSE) > 0 && count(svg, VOLE_NOSE) > 0, cam + ', ' + p + ' pairs: both kinds');
  }
  for (const fx of [['sunset'], ['dusk'], ['night']]) {
    const svg = art.render({ set: 'pile', cam: 'low', fx }).svg;
    for (const hex of FISH) assert.ok(!svg.includes(hex), fx[0] + ': no fish');
  }
});

test('vole: one plump vole on the ground by the cat at pile-left, nudged off the pile, eyes shut, kept clear of the lettering; only when asked', () => {
  for (const cam of CAMS) {
    const plain = art.render({ set: 'pile', cam }).svg, with1 = art.render({ set: 'pile', cam, opts: { vole: true } });
    // it came off the top of a stack (f044: "nudges one plump vole off the pile"), so a child who
    // counts the picture still finds sixteen
    assert.equal(count(with1.svg, VOLE_NOSE), count(plain, VOLE_NOSE), cam + ': the same voles, one of them moved');
    assert.equal(count(with1.svg, MOUSE_NOSE), count(plain, MOUSE_NOSE), cam + ': no mouse more');
    const short = with1.keep.slice(0, 8).filter((k, i) => k.h < art.render({ set: 'pile', cam }).keep[i].h - 1);
    assert.equal(short.length, 1, cam + ': one stack is a piece shorter');
    assert.equal(art.render({ set: 'pile', cam, opts: { vole: false } }).svg.length, plain.length, cam + ': vole: false is the default');
    assert.equal(with1.keep.length, 9, cam + ': the eight stacks and the vole are kept clear');
    // the loose one alone, even with no pile
    const alone = art.render({ set: 'pile', cam, opts: { pairs: 0, vole: true } });
    assert.equal(count(alone.svg, VOLE_NOSE), 1, cam + ': the vole without a pile');
    assert.equal(alone.keep.length, 1, cam + ': and it is kept clear');
  }
  // where it lies: in front of the pile (lower in the panel than every stack's foot), to its left,
  // and just right of the cat crouching at pile-left, under her nose
  for (const cam of ['low', 'wide']) {
    const r = art.render({ set: 'pile', cam, opts: { vole: true }, cast: [{ who: 'player', at: 'pile-left', pose: 'crouch', mood: 'happy', facing: 'right' }] }, { look: LOOK });
    const stacks = art.render({ set: 'pile', cam }).keep, v = r.keep[r.keep.length - 1];
    assert.ok(v, cam + ': the vole has its own keep box');
    const foot = Math.max(...stacks.map((k) => k.y + k.h)), left = Math.min(...stacks.map((k) => k.x)), right = Math.max(...stacks.map((k) => k.x + k.w));
    assert.ok(v.y + v.h > foot, cam + ': the vole lies in front of the pile');
    assert.ok(v.x < left + 2 && v.x + v.w / 2 < left + (right - left) / 4, cam + ': at the pile\'s left end, the cat\'s side: ' + JSON.stringify(v) + ' vs ' + left);
    assert.ok(v.x + v.w / 2 > r.heads[0].x - 4, cam + ': at the crouching cat\'s nose, not behind her: ' + JSON.stringify(v) + ' ' + JSON.stringify(r.heads[0]));
    assert.ok(v.x < r.heads[0].x + 22, cam + ': close by her: ' + JSON.stringify(v) + ' ' + JSON.stringify(r.heads[0]));
  }
  // and it is the same cozy prey: a closed-eye arc facing her (mirrored), no red
  const lone = art.render({ set: 'pile', cam: 'low', opts: { pairs: 0, vole: true } }).svg;
  assert.ok(/scale\(-1 1\)/.test(lone), 'it faces the cat on its left');
  assert.ok(/fill="none" stroke="#3B2C27"/.test(lone), 'eyes shut');
});

test('the same scene draws the same picture (no flicker between frames)', () => {
  const s = { set: 'pile', cam: 'wide', opts: { lit: 2, dug: true }, cast: [{ who: 'grizzled', at: 'beside', pose: 'lie' }], fx: ['morning'] };
  assert.equal(strip(art.render(s, { look: LOOK }).svg), strip(art.render(s, { look: LOOK }).svg));
});

test('unique ids per render, so several panels can share a page', () => {
  const s = { set: 'pile', cam: 'low', opts: { lit: 2 }, cast: [{ who: 'player', at: 'pile-left' }] };
  const a = checkRender(art.render(s, { look: LOOK }), s, 'a'), b = checkRender(art.render(s, { look: LOOK }), s, 'b');
  assert.equal(a.filter((id) => b.includes(id)).length, 0);
});

// ---------------------------------------------------------------- framing

test('anchors sit inside their camera boxes', () => {
  const info = art.sceneInfo('pile');
  const inside = (a, c, pad) => a.x >= c.x + pad && a.x <= c.x + c.w - pad && a.y >= c.y && a.y <= c.y + c.h + 0.5 && a.y - a.h >= c.y;
  // the wide shot sees every spot, whole (a sitting cat's height above its feet stays in the panel)
  for (const [k, a] of Object.entries(info.anchors.main)) assert.ok(inside(a, info.cams.wide, 40), 'wide: ' + k);
  // the low two-shot sees its three spots by the pile
  assert.deepEqual(Object.keys(info.anchors.low).sort(), ['beside', 'pile-left', 'pile-right']);
  for (const [k, a] of Object.entries(info.anchors.low)) assert.ok(inside(a, info.cams.low, 40), 'low: ' + k);
  // the close-up is the low composition, closer: the spots by the pile are just outside its edges
  assert.equal(info.cams.close.comp, 'low');
  const c = info.cams.close;
  assert.ok(c.x >= 0 && c.y >= 0 && c.x + c.w <= 1600 && c.y + c.h <= 1000, 'close box in the world');
});

test('cast at the anchors: heads in the panel in wide and low; Glintstar on the fountain\'s edge, high in the wide shot', () => {
  const cast = ANCHORS.map((at, i) => ({ who: WHO[i], at, pose: at === 'beside' ? 'lie' : 'sit' }));
  const wide = art.render({ set: 'pile', cam: 'wide', cast }, { look: LOOK });
  wide.heads.forEach((h, i) => assert.ok(h && h.x > 2 && h.x < 98 && h.y > 5 && h.y < 95, 'wide: ' + ANCHORS[i] + ' ' + JSON.stringify(h)));
  const gi = ANCHORS.indexOf('fountain-edge');
  assert.ok(wide.heads[gi].x > 80, 'the fountain is at the right');
  assert.ok(wide.heads[gi].y < wide.heads[ANCHORS.indexOf('pile-right')].y, 'Glintstar on the rim stands above the cats on the ground');
  const low = art.render({ set: 'pile', cam: 'low', cast }, { look: LOOK });
  ['pile-left', 'pile-right', 'beside'].forEach((at) => {
    const h = low.heads[ANCHORS.indexOf(at)];
    assert.ok(h && h.x > 2 && h.x < 98 && h.y > 30 && h.y < 90, 'low: ' + at + ' ' + JSON.stringify(h));
  });
  ['crowd-1', 'crowd-2', 'crowd-3', 'fountain-edge'].forEach((at) => assert.equal(low.heads[ANCHORS.indexOf(at)], null, 'low: ' + at + ' is out of the two-shot'));
  // the two-shot is closer than the wide shot: the same cat is bigger
  const big = (r, i) => r.heads[i];
  assert.ok(art.sceneInfo('pile').anchors.low['pile-left'].h > art.sceneInfo('pile').anchors.main['pile-left'].h * 1.3, 'low is a medium shot');
  assert.ok(big(low, 0).y < 75, 'a cat beside the pile has headroom for a balloon');
});

test('a cast member beside the pile does not sit on the stacks', () => {
  for (const cam of ['wide', 'low']) {
    const r = art.render({ set: 'pile', cam, opts: { pairs: 8 }, cast: [{ who: 'grizzled', at: 'beside', pose: 'lie', facing: 'left' }, { who: 'tallyheart', at: 'pile-left' }] }, { look: LOOK });
    const right = Math.max(...r.keep.map((k) => k.x + k.w)), left = Math.min(...r.keep.map((k) => k.x));
    assert.ok(r.heads[0].x > right, cam + ': the old tom\'s head is right of the pile');
    assert.ok(r.heads[1].x < left, cam + ': the cat at pile-left is left of the pile');
  }
});

// ---------------------------------------------------------------- PC.art.prey

// The lowest y a path reaches (absolute M L H V C Q Z only, as the prey use), curves sampled.
function lowestY(d) {
  const tok = d.match(/[MLHVCQZ]|-?\d*\.?\d+/g);
  let i = 0, cmd = '', x = 0, y = 0, low = -Infinity;
  const num = () => +tok[i++];
  while (i < tok.length) {
    if (/[A-Z]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'Z') continue;
    if (cmd === 'M' || cmd === 'L') { x = num(); y = num(); low = Math.max(low, y); }
    else if (cmd === 'H') x = num();
    else if (cmd === 'V') { y = num(); low = Math.max(low, y); }
    else if (cmd === 'Q') {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num();
      for (let t = 0; t <= 1; t += 0.02) low = Math.max(low, (1 - t) * (1 - t) * y + 2 * (1 - t) * t * y1 + t * t * y2);
      x = x2; y = y2;
    } else if (cmd === 'C') {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x3 = num(), y3 = num();
      for (let t = 0; t <= 1; t += 0.02) { const u = 1 - t; low = Math.max(low, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3); }
      x = x3; y = y3;
    } else i++;
  }
  return low;
}

test('PC.art.prey: each kind in its own box, a self-contained, well-formed fragment', () => {
  assert.equal(typeof art.prey, 'function');
  for (const kind of ['mouse', 'vole', 'fish']) for (const lit of [false, true]) for (const facing of ['right', 'left']) {
    const p = art.prey({ kind, lit, seed: 5, facing });
    assert.equal(typeof p.svg, 'string');
    assert.ok(p.w > 0 && p.h > 0 && p.w > p.h, kind + ': a wide, low box ' + p.w + 'x' + p.h);
    assert.ok(!/NaN|undefined|Infinity/.test(p.svg), kind);
    assert.ok(!/\sid=|url\(#|<defs/.test(p.svg), kind + ': no ids or defs, so it drops into any SVG');
    checkXml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + p.w + ' ' + p.h + '">' + p.svg + '</svg>', 'svg');
    assert.equal(/#ffb21f/.test(p.svg), lit, kind + ': the counts glow only when lit');
    assert.equal(/#eea20c/.test(p.svg), lit, kind + ': a sparkle only when lit');
    if (facing === 'left') assert.ok(/scale\(-1 1\)/.test(p.svg), 'facing left mirrors');
  }
  // an unknown kind is a mouse; no options at all still draws
  assert.equal(art.prey({ kind: 'dragon' }).kind, 'mouse');
  assert.ok(art.prey().svg.length > 100);
});

/* A mouse's and a vole's `tail` is a colour, the fish's a shape: the outline (paper shadow and both
 * glow layers) once drew the colour as a path (`d="#D7A39C"`, an SVG parse error Safari logs for
 * every mouse and vole on the pile) and gave every mouse and vole the fish's dorsal fin, a grey wedge
 * behind its head and a bump in its halo. */
test('PC.art.prey: every path is real path data (no colour as `d`), and only the fish has a tail and a fin outlined', () => {
  const FIN = 'M64 8Q78 -2 94 6L90 10Z';
  for (const kind of ['mouse', 'vole', 'fish']) for (const lit of [false, true]) for (const part of [undefined, 'glow', 'body', 'spark']) {
    const svg = art.prey({ kind, lit, seed: 7, part }).svg;
    const ds = [...svg.matchAll(/\sd="([^"]*)"/g)].map(m => m[1]);
    ds.forEach(d => assert.match(d, /^M[-\d. ]/, kind + (lit ? ' lit' : '') + ' ' + (part || 'whole') + ': path data, not ' + JSON.stringify(d.slice(0, 20))));
    if (kind !== 'fish') assert.ok(!ds.includes(FIN), kind + ': no dorsal fin');
  }
  // the fish keeps its tail and fin in the outline: paper shadow, both glow layers, and the drawing
  const fish = art.prey({ kind: 'fish', lit: true, seed: 7 }).svg;
  assert.equal(fish.split('d="' + FIN + '"').length - 1, 4, 'the fin: two glow layers, the paper shadow, the fin itself');
  // and across every pile frame of chapter 2 and both prey pictures, no colour is ever path data
  const ch02 = PC.story.ch02;
  const svgs = Object.values(ch02.frames).filter(f => f.scene.set === 'pile').map(f => art.render(f.scene, { look: LOOK }).svg)
    .concat([art.countsPicture({ table: 2, groups: 8, per: 2, kind: 'prey', highlight: 16 }), art.countsPicture({ table: 2, groups: 2, per: 8, kind: 'prey', layout: 'rows', highlight: 16 })]);
  assert.ok(svgs.length >= 10);
  svgs.forEach(s => assert.ok(!/\sd="#/.test(s), 'a colour as path data'));
});

test('PC.art.prey: the same size whether lit or not, resting on the box\'s bottom centre', () => {
  for (const kind of ['mouse', 'vole', 'fish']) {
    const a = art.prey({ kind }), b = art.prey({ kind, lit: true, seed: 9 });
    assert.equal(a.w, b.w);
    assert.equal(a.h, b.h);
    // the lowest point of the filled shapes is the box's bottom (the drawing is shifted down by its top margin)
    const top = +/translate\((\d+) (\d+)\)/.exec(a.svg)[2];
    const body = art.prey({ kind, part: 'body' }).svg.replace(/<g transform="translate\(0 2.5\)"[\s\S]*?<\/g>/, '');   // not the paper shadow
    let low = 0;
    for (const m of body.matchAll(/<path d="([^"]+)" fill="(?!none)/g)) low = Math.max(low, lowestY(m[1]));
    assert.ok(Math.abs(low + top - a.h) < 1, kind + ': rests on the bottom (' + (low + top).toFixed(1) + ' vs ' + a.h + ')');
  }
});

test('PC.art.prey: seeds vary the fur a little and repeat exactly; parts add up to the whole', () => {
  const a = art.prey({ kind: 'mouse', seed: 1 }).svg, b = art.prey({ kind: 'mouse', seed: 1 }).svg, c = art.prey({ kind: 'mouse', seed: 2 }).svg;
  assert.equal(a, b);
  assert.notEqual(a, c);
  for (const kind of ['mouse', 'vole', 'fish']) {
    const o = { kind, lit: true, seed: 3 };
    const whole = art.prey(o).svg;
    const inner = (s) => s.replace(/^<g transform="[^"]+">/, '').replace(/<\/g>$/, '');
    assert.equal(inner(whole), inner(art.prey({ ...o, part: 'glow' }).svg) + inner(art.prey({ ...o, part: 'body' }).svg) + inner(art.prey({ ...o, part: 'spark' }).svg));
    assert.equal(art.prey({ kind, part: 'glow' }).svg, '', 'no glow when not lit');
  }
});

test('PC.art.prey: cozy, not gory: eyes shut (no round pupils), no red anywhere', () => {
  for (const kind of ['mouse', 'vole', 'fish']) {
    const svg = art.prey({ kind, lit: true, seed: 4 }).svg;
    // the eye is a closed arc: a stroke-only curve in the dark eye-line colour, never a filled dot
    assert.ok(/<path d="M\d+ \d+Q\d+ \d+ \d+ \d+" fill="none" stroke="#(3B2C27|2F3A48)"/.test(svg), kind + ': a closed-eye arc');
    assert.ok(!/<circle[^>]*fill="#(3B2C27|2F3A48|000|000000)"/.test(svg), kind + ': no open eyes');
    for (const hex of svg.match(/#[0-9a-fA-F]{6}\b/g) || []) {
      const v = parseInt(hex.slice(1), 16), r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
      assert.ok(!(r > 150 && g < 90 && b < 90), kind + ': no blood-red ' + hex);
    }
  }
});
