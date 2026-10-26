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
const CAMS = ['wide', 'close', 'low'];                      // chapter 2's cameras (the pile in pairs)
const CH4_CAMS = ['rows', 'gap', 'scale', 'through', 'mirror'];
const CH5_CAMS = ['gap-close'];                             // chapter 5: the dug earth behind the gap, close
const ANCHORS = ['pile-left', 'pile-right', 'beside', 'crowd-1', 'crowd-2', 'crowd-3', 'fountain-edge'];
const CH5_ANCHORS = ['behind'];                             // chapter 5: behind the back row (the old tom, stomping round)
const OPTS = ['pairs', 'lit', 'dug', 'vole'];
const CH4_OPTS = ['rows', 'back', 'scale', 'glint'];
const CH5_OPTS = ['prints', 'swept'];                       // chapter 5: tiny prints in the dug earth; the earth swept flat
const CH6_OPTS = ['moon'];                                  // chapter 6: the moon's age in evenings, in the sky of `wide` and `low`
const CH7_CAMS = ['rear', 'hole'];                          // chapter 7: round the back; close on the tunnel's mouth
const CH7_ANCHORS = ['arch', 'rear-1', 'rear-2', 'guard-1', 'guard-2', 'guard-3', 'brink'];
const CH7_OPTS = ['tap', 'tunnel', 'tracks'];               // chapter 7: the Taps' targets, the tunnel found, the tracks far off
const CH8_ANCHORS = ['poke'];                               // chapter 8: at the tunnel mouth's right edge (and `tap` gains 'mouth')
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
  assert.deepEqual([...v.cams].sort(), [...CAMS, ...CH4_CAMS, ...CH5_CAMS, ...CH7_CAMS].sort());
  assert.deepEqual([...v.anchors].sort(), [...ANCHORS, ...CH5_ANCHORS, ...CH7_ANCHORS, ...CH8_ANCHORS].sort());
  assert.deepEqual(Object.keys(v.opts).sort(), [...OPTS, ...CH4_OPTS, ...CH5_OPTS, ...CH6_OPTS, ...CH7_OPTS].sort());
  const spec = specRow();
  for (const c of spec.cams) assert.ok(v.cams.includes(c), 'camera ' + c + ' from build.md');
  for (const a of spec.anchors) assert.ok(v.anchors.includes(a), 'anchor ' + a + ' from build.md');
  for (const o of spec.opts) assert.ok(Object.prototype.hasOwnProperty.call(v.opts, o), 'option ' + o + ' from build.md');
  assert.equal(v.opts.pairs, 'number');
  assert.equal(v.opts.lit, 'number');
  assert.deepEqual(v.opts.dug, [true, false, 'big']);   // 'big': chapter 3 (docs/build.md, "Chapter 3 (v0.4)")
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
  values.push({ dug: true }, { dug: false }, { dug: 'big' }, { dug: 'big', pairs: 7, vole: true }, { vole: true }, { vole: false }, { pairs: 0, vole: true }, { pairs: 10, lit: 10, dug: true, vole: true },
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

// the earth's paths: every filled path (the lumps, their tops and the crumbs are each one)
const soilPaths = (svg) => (svg.match(/<path d="([^"]+)" fill="#[0-9a-f]{6}"[^>]*>/gi) || []).length;
// what `opts` adds to the plain scene: the markup between the two renders' common start and end
function added(cam, opts) {
  const a = strip(art.render({ set: 'pile', cam, opts: { pairs: 7 } }).svg), b = strip(art.render({ set: 'pile', cam, opts: Object.assign({ pairs: 7 }, opts) }).svg);
  let i = 0, j = 0;
  while (i < a.length && a[i] === b[i]) i++;
  while (j < a.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
  return b.slice(i, b.length - j);
}
// the horizontal reach of the shapes in some markup (their absolute first points)
function reach(markup) {
  const xs = [...markup.matchAll(/<(?:path d="M|ellipse cx=")(-?[\d.]+)/g)].map((m) => +m[1]);
  return [Math.min(...xs), Math.max(...xs)];
}

test('dug: \'big\' (chapter 3, two nights on): the same patch, bigger: wider, fresh earth on top, a second dip', () => {
  for (const cam of CAMS) for (const fx of [['morning'], ['sunset']]) {
    const dug = art.render({ set: 'pile', cam, opts: { dug: true, pairs: 7 }, fx }).svg, big = art.render({ set: 'pile', cam, opts: { dug: 'big', pairs: 7 }, fx }).svg;
    assert.ok(big.length > dug.length + 2500, cam + ' ' + fx + ': more earth');
    assert.ok(soilPaths(big) > soilPaths(dug) + 20, cam + ' ' + fx + ': fresh lumps and crumbs');
    // it stays behind the pile: the stacks are where they were
    assert.deepEqual(art.render({ set: 'pile', cam, opts: { dug: 'big', pairs: 7 }, fx }).keep, art.render({ set: 'pile', cam, opts: { dug: true, pairs: 7 }, fx }).keep, cam + ': the pile itself unchanged');
  }
  for (const cam of ['wide', 'low']) {
    const old = reach(added(cam, { dug: true })), now = reach(added(cam, { dug: 'big' }));
    // (in the low camera it has the arch's legs either side, so it grows more up than out)
    assert.ok(now[1] - now[0] > (old[1] - old[0]) * (cam === 'low' ? 1.04 : 1.08), cam + ': wider than two nights ago: ' + old + ' then, ' + now + ' now');
    if (cam === 'low') assert.ok(now[0] > 150 && now[1] < 1200, 'low: still inside the arch\'s legs: ' + now);
  }
});

test('pairs: seven pairs read right: three stacks behind, four in front, each stack two pieces, the back ones in the gaps and topped above the front row', () => {
  for (const cam of CAMS) {
    const r = art.render({ set: 'pile', cam, opts: { pairs: 7, dug: 'big' } });
    assert.equal(r.keep.length, 7, cam + ': seven stacks');
    const cx = r.keep.map((k) => k.x + k.w / 2), top = r.keep.map((k) => k.y), bottom = r.keep.map((k) => k.y + k.h);
    // the layout lists the back row first (3), then the front row (4)
    const back = [0, 1, 2], front = [3, 4, 5, 6];
    for (const b of back) {
      const left = front.filter((f) => cx[f] < cx[b]), right = front.filter((f) => cx[f] > cx[b]);
      assert.ok(left.length && right.length, cam + ': back stack ' + b + ' sits in a gap of the front row');
      assert.ok(bottom[b] < Math.max(...bottom), cam + ': the back row stands behind');
      const pieceH = (r.keep[b].h) / 2.2;
      assert.ok(top[b] < Math.min(...front.map((f) => top[f])) - pieceH * 0.5, cam + ': its top piece shows above the front row');
    }
    // every stack is two pieces (the prey's noses: a mouse or a vole, twice per stack)
    const noses = (r.svg.match(/fill="#(E58C9C|B8707C)"/gi) || []).length;
    assert.equal(noses, 14, cam + ': fourteen pieces, two a stack');
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
  // the low two-shot sees its three spots by the pile (and, chapter 5, the spot behind the back row)
  assert.deepEqual(Object.keys(info.anchors.low).sort(), ['behind', 'beside', 'pile-left', 'pile-right']);
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

// ================================================================ chapter 4 (docs/build.md, "Chapter 4 (v0.4)"; the
// chapter text's Build notes, "Sets and options"): rows of ten, the gap, the "scale"

const crypto = require('crypto');
const ROW_CAMS = ['wide', 'low', 'close', 'rows'];          // the cameras that show the whole pile
const CLOSEUPS = ['scale', 'through', 'mirror'];            // the three close-ups of the "scale"
const MORNING = [10, 10, { n: 10, gap: [3, 4, 5, 6] }];     // the third morning: thirty laid out, four gone from the back row
const FULL = [10, 10, 10], NIGHT = [10, 10, 10, 10];
const FOURTH = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];  // chapter 5, the fourth count: forty laid out, four gone from the back row again
const renderP = (cam, opts, cast, fx, look) => art.render({ set: 'pile', cam, opts: opts || {}, cast: cast || [], fx: fx || ['morning'] }, { look: look || LOOK });
// the markup of every <g data-art="name" …>…</g> in some markup (nesting counted)
function groupsNamed(svg, name) {
  const out = [], open = '<g data-art="' + name + '"';
  let from = 0;
  for (;;) {
    const start = svg.indexOf(open, from);
    if (start < 0) break;
    const re = /<g\b[^>]*>|<\/g>/g;
    re.lastIndex = start;
    let depth = 0, m, end = -1;
    while ((m = re.exec(svg))) { if (m[0] === '</g>') { if (--depth === 0) { end = re.lastIndex; break; } } else depth++; }
    assert.ok(end > 0, name + ': a closed group');
    out.push(svg.slice(start, end));
    from = end;
  }
  return out;
}
const pieces = (svg) => count(svg, MOUSE_NOSE) + count(svg, VOLE_NOSE);
const countRe = (svg, re) => (svg.match(re) || []).length;
// The pieces of one (unlit) row group, left to right: where each lies (its base's middle, world units), its scale and kind.
function rowPieces(row) {
  const out = [], re = /<g transform="translate\((-?[\d.]+) (-?[\d.]+)\) scale\(([\d.]+) [\d.]+\)"><g transform="translate\(12 12\)">/g;
  let m;
  const hits = [];
  while ((m = re.exec(row))) hits.push({ i: m.index, X: +m[1], Y: +m[2], k: +m[3] });
  hits.forEach((h, j) => {
    const body = row.slice(h.i, j + 1 < hits.length ? hits[j + 1].i : row.length), kind = body.includes('fill="' + MOUSE_NOSE + '"') ? 'mouse' : body.includes('fill="' + VOLE_NOSE + '"') ? 'vole' : '?';
    const bw = kind === 'vole' ? 106 : 110;
    out.push({ x: h.X + (bw + 24) * h.k / 2, y: h.Y + 76 * h.k, k: h.k, kind });
  });
  return out.sort((a, b) => a.x - b.x);
}
// a keep box (percent of the panel) in the world, on a camera that shows its whole composition
const world = (k) => ({ x: k.x * 16, y: k.y * 10, w: k.w * 16, h: k.h * 10 });
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);
// what `opts` adds to `base`: the markup between the two renders' common start and end
function addedTo(cam, base, opts) {
  const a = strip(renderP(cam, base).svg), b = strip(renderP(cam, Object.assign({}, base, opts)).svg);
  let i = 0, j = 0;
  while (i < a.length && a[i] === b[i]) i++;
  while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
  return b.slice(i, b.length - j);
}

test('chapter 4: build.md names the five new cameras and the options, and the set has them', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const sec = md.slice(md.indexOf('## Chapter 4 (v0.4)')).replace(/\s+/g, ' ');
  // (the sentence that names them, while the section is worded as it was when this was built; else the whole section)
  const from = sec.indexOf('`pile` gains the cameras'), to = sec.indexOf('`tower`, `den`, `hollow`, `bridge`');
  const para = from >= 0 && to > from ? sec.slice(from, to) : sec;
  assert.ok(para.length > 100, 'build.md has a chapter 4 section');
  const v = art.vocab.sets.pile, info = art.sceneInfo('pile');
  for (const cam of CH4_CAMS) {
    assert.ok(para.includes('`' + cam + '`'), 'build.md names the camera ' + cam);
    assert.ok(v.cams.includes(cam), 'the set has the camera ' + cam);
    assert.equal(info.cams[cam].comp, cam, cam + ': a composition of its own');
  }
  for (const o of ['rows', "back: 'shadow'", 'scale', 'glint', 'dug']) assert.ok(para.includes('`' + o + '`'), 'build.md names ' + o);
  // `rows` lists its usual values, each a list (compare by value): the text's three
  // (and chapter 5's fourth morning: three full rows and the hole in the back one)
  assert.deepEqual(v.opts.rows, [FULL, MORNING, NIGHT, FOURTH]);
  assert.deepEqual(v.opts.back, ['none', 'shadow']);
  assert.deepEqual(v.opts.scale, [false, true, 'behind']);
  assert.deepEqual(v.opts.glint, [false, true]);
  assert.deepEqual(info.defaults, { pairs: 8, lit: 0, dug: false, vole: false, back: 'none', scale: false, glint: false, prints: false, swept: false, moon: false, tap: 'none', tunnel: false, tracks: false },
    'nothing of chapter 4 (or 5, or 6: no moon; or 7: no Tap, no tunnel, no tracks) by default; no `rows`: the pile is in pairs');
  // anchors: rows and gap have the pile's own names (chapter 5 adds `behind`); the three close-ups have none
  assert.deepEqual(Object.keys(info.anchors.rows).sort(), ['behind', 'beside', 'crowd-1', 'crowd-2', 'crowd-3', 'pile-left', 'pile-right']);
  assert.deepEqual(Object.keys(info.anchors.gap).sort(), ['behind', 'beside', 'pile-left', 'pile-right']);
  for (const cam of CLOSEUPS) assert.deepEqual(info.anchors[cam], {}, cam + ': no anchors');
  for (const comp of ['rows', 'gap']) for (const k of Object.keys(info.anchors[comp])) assert.ok(ANCHORS.includes(k) || CH5_ANCHORS.includes(k), comp + ': ' + k + ' is one of the pile\'s anchors');
});

test('chapter 4: chapters 2 and 3 keep their pile: in pairs, on their three cameras, drawn exactly as before', () => {
  let n = 0;
  for (const id of ['ch01', 'ch02', 'ch03']) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'pile') continue;
    n++;
    assert.ok(CAMS.includes(sc.cam), id + ' ' + fid + ': one of chapter 2\'s cameras');
    for (const k of CH4_OPTS) assert.ok(!(sc.opts && k in sc.opts), id + ' ' + fid + ': no ' + k);
    const r = art.render(sc, { look: LOOK });
    for (const name of ['row', 'places', 'band', 'scale', 'glint', 'glimmer', 'dug']) assert.equal(groupsNamed(r.svg, name).length, 0, id + ' ' + fid + ': no ' + name);
    // chapter 4's options at their defaults draw exactly what leaving them out draws
    const same = art.render(Object.assign({}, sc, { opts: Object.assign({}, sc.opts, { back: 'none', scale: false, glint: false }) }), { look: LOOK });
    assert.equal(strip(same.svg), strip(r.svg), id + ' ' + fid);
    assert.deepEqual(same.keep, r.keep);
  }
  assert.ok(n >= 12, 'chapters 2 and 3 visit the pile: ' + n);
  // in pairs, the "scale", the glint and the shadow are nothing at all: they belong to the rows
  for (const cam of CAMS) assert.equal(strip(renderP(cam, { pairs: 7, scale: true, glint: true, back: 'shadow' }).svg), strip(renderP(cam, { pairs: 7 }).svg), cam + ': no "scale" on a pile of pairs');
  // and what pile.js itself draws for the pairs, the dug earth and the vole is what it drew before chapter 4
  // (sha1 of the markup each option adds, recorded from the chapter 3 build; ids stripped)
  const GOLD = {
    'wide:pairs8': 'd3c46b4a80ae992d', 'wide:pairs7lit3': '4229a6185984b69c', 'wide:pairs10': 'f2301c4c8929a641', 'wide:dug': 'e5aaa02357eb840f', 'wide:dugbig': '08a463ba15aeb2f5', 'wide:vole': '7db9dd826e534543',
    'low:pairs8': 'c3c1379270955c47', 'low:pairs7lit3': '7c8b6aca6d7166c3', 'low:pairs10': 'd51c01d6797673d4', 'low:dug': 'f56743cac26f3b12', 'low:dugbig': 'b7d6bd23ab0daed1', 'low:vole': '7560be67a7f34a9c',
    'close:pairs8': 'c3c1379270955c47', 'close:pairs7lit3': '7c8b6aca6d7166c3', 'close:pairs10': 'd51c01d6797673d4', 'close:dug': 'f56743cac26f3b12', 'close:dugbig': 'b7d6bd23ab0daed1', 'close:vole': '7560be67a7f34a9c'
  };
  const WHAT = { pairs8: { pairs: 8 }, pairs7lit3: { pairs: 7, lit: 3 }, pairs10: { pairs: 10 }, dug: { dug: true }, dugbig: { dug: 'big' }, vole: { vole: true } };
  for (const cam of CAMS) for (const [name, opts] of Object.entries(WHAT)) assert.equal(sha(addedTo(cam, { pairs: 0 }, opts)), GOLD[cam + ':' + name], cam + ' ' + name + ': as chapters 2 and 3 drew it');
});

test('chapter 4: every new camera renders, with every option, light and effect, and a cast at each of its anchors', () => {
  const info = art.sceneInfo('pile');
  const sets = [{}, { rows: FULL }, { rows: MORNING }, { rows: MORNING, back: 'shadow' }, { rows: MORNING, dug: true }, { rows: MORNING, dug: 'big', scale: true, glint: true }, { rows: MORNING, glint: true },
    { rows: NIGHT, scale: 'behind', dug: 'big' }, { rows: NIGHT, lit: 3 }, { rows: NIGHT, scale: 'behind', glint: true }, { rows: FULL, scale: true, glint: true }, { pairs: 6, scale: true }];
  for (const cam of [...CH4_CAMS, ...CAMS]) {
    const anchors = Object.keys(info.anchors[info.cams[cam].comp]);
    const cast = anchors.map((at, i) => ({ who: WHO[i % WHO.length], at, pose: 'sit', mood: 'wonder', variant: (i % 6) + 1 }));
    for (const opts of sets) for (const fx of [['morning'], ['sunset'], ['night']]) {
      const scene = { set: 'pile', cam, opts, cast, fx };
      const r = art.render(scene, { look: LOOK });
      checkRender(r, scene, cam + ' ' + JSON.stringify(opts) + ' ' + fx);
      if (CH4_CAMS.includes(cam)) r.heads.forEach((h, i) => assert.ok(h, cam + ': ' + anchors[i] + ' in sight'));
    }
    const every = { set: 'pile', cam, opts: { rows: MORNING, dug: 'big', scale: true, glint: true, lit: 2 }, cast: cast.slice(0, 1), fx: art.vocab.fx.slice() };
    checkRender(art.render(every, { look: LOOK }), every, cam + ' every fx');
    for (const f of art.vocab.fx) { const one = { set: 'pile', cam, opts: { rows: MORNING, scale: true }, cast: [], fx: [f] }; checkRender(art.render(one, { look: LOOK }), one, cam + ' fx ' + f); }
    // only classes PC.art.css defines; no SMIL
    const svg = renderP(cam, { rows: NIGHT, lit: 4, dug: 'big', scale: true, glint: true }, [], art.vocab.fx).svg;
    for (const m of svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => {
      if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') assert.ok(art.css.includes('.' + c + '{'), cam + ': css defines .' + c);
    });
    assert.ok(!/<animate/.test(svg), cam + ': no SMIL');
  }
});

test('chapter 4: odd `rows` values never throw: a number is that many rows of ten, counts are clamped, at most five rows', () => {
  for (const cam of [...ROW_CAMS, 'gap']) {
    const odd = [[], [0], [99, -4, 'lots'], [10, null, { n: 7 }], [{ n: 10, gap: 'all' }], [{ n: 10, gap: [-1, 3, 3, 40, 2.4] }], [{ n: 4, gap: [0, 1, 2, 3] }], [10, 10, 10, 10, 10, 10, 10], 3, 0, 99, 'three', null, { n: 10 }, true];
    for (const rows of odd) for (const more of [{ back: 'shadow', lit: 40 }, { scale: true, glint: true, dug: 'big' }, { scale: 'behind' }]) {
      const scene = { set: 'pile', cam, opts: Object.assign({ rows }, more), cast: [], fx: [] };
      checkRender(art.render(scene, { look: LOOK }), scene, cam + ' rows ' + JSON.stringify(rows) + ' ' + JSON.stringify(more));
    }
  }
  assert.equal(strip(renderP('rows', { rows: 3 }).svg), strip(renderP('rows', { rows: FULL }).svg), 'rows: 3 is three rows of ten');
  assert.equal(pieces(renderP('rows', { rows: [99, 99] }).svg), 20, 'a row holds ten at most');
  assert.equal(groupsNamed(renderP('rows', { rows: [1, 2, 3, 4, 5, 6, 7] }).svg, 'row').length, 5, 'five rows at most');
  assert.equal(pieces(renderP('rows', { rows: [] }).svg), 0, 'an empty list is an empty floor');
  // not a list (and not a number): the pile stays in pairs on chapter 2's cameras
  for (const bad of ['three', null, true, { n: 10 }]) assert.equal(strip(renderP('wide', { rows: bad }).svg), strip(renderP('wide', {}).svg), 'rows: ' + JSON.stringify(bad) + ' is no rows');
  // the same options draw the same picture
  for (const cam of CH4_CAMS) assert.equal(strip(renderP(cam, { rows: MORNING, dug: 'big', scale: true, glint: true }).svg), strip(renderP(cam, { rows: MORNING, dug: 'big', scale: true, glint: true }).svg), cam + ': deterministic');
});

// ---------------------------------------------------------------- rows of ten

test('chapter 4: `rows` in place of `pairs`: one piece to a place, ten to a row, mice and voles, each row kept clear of the lettering', () => {
  for (const cam of ROW_CAMS) {
    for (const [rows, total] of [[FULL, 30], [NIGHT, 40], [[10, 10], 20], [MORNING, 26]]) {
      const r = renderP(cam, { rows });
      assert.equal(pieces(r.svg), total, cam + ': ' + total + ' pieces in ' + JSON.stringify(rows));
      const groups = groupsNamed(r.svg, 'row');
      assert.equal(groups.length, rows.length, cam + ': a group a row');
      assert.equal(r.keep.length, rows.length, cam + ': each row is what the picture is about');
      for (const hex of FISH) assert.ok(!r.svg.includes(hex), cam + ': no fish');
      // no stacks of two left over from the pairs
      assert.equal(countRe(r.svg, /class="pcs-pulse"/g), 0, cam + ': nothing lit unless asked');
    }
    // rows replace pairs altogether: `pairs` and `vole` say nothing once there are rows
    assert.equal(strip(renderP(cam, { rows: FULL, pairs: 3, vole: true }).svg), strip(renderP(cam, { rows: FULL }).svg), cam + ': rows in place of pairs');
  }
});

test('chapter 4: the rows are tidy: ten in a line, evenly spaced, all facing the same way, mice and voles turn about; each row back is higher and smaller', () => {
  for (const cam of ['rows', 'low', 'wide']) for (const rows of [FULL, NIGHT]) {
    const r = renderP(cam, { rows }), groups = groupsNamed(r.svg, 'row');
    // the markup lists the back row first (so nearer rows are drawn over farther ones)
    const byRow = groups.map((gr) => ({ r: +/data-row="(\d+)"/.exec(gr)[1], p: rowPieces(gr), svg: gr })).sort((a, b) => a.r - b.r);
    assert.deepEqual(groups.map((gr) => +/data-row="(\d+)"/.exec(gr)[1]), rows.map((_, i) => rows.length - 1 - i), cam + ': drawn back to front');
    byRow.forEach((row, i) => {
      assert.equal(row.p.length, 10, cam + ': ten pieces in row ' + i);
      const ys = row.p.map((q) => q.y), gaps = row.p.slice(1).map((q, j) => q.x - row.p[j].x);
      assert.ok(Math.max(...ys) - Math.min(...ys) < 0.5, cam + ': row ' + i + ' on one line');
      // evenly spaced (a vole's box is a hair narrower than a mouse's, so within a twentieth)
      assert.ok(Math.max(...gaps) - Math.min(...gaps) < Math.max(...gaps) * 0.06, cam + ': row ' + i + ' evenly spaced: ' + gaps.map((x) => x.toFixed(1)));
      // no piece overlaps its neighbour: a place is wider than a piece is long
      assert.ok(Math.min(...gaps) > 110 * row.p[0].k, cam + ': row ' + i + ': a place for each piece');
      row.p.forEach((q, j) => { if (j) assert.notEqual(q.kind, row.p[j - 1].kind, cam + ': row ' + i + ': neighbours differ'); assert.ok(q.kind === 'mouse' || q.kind === 'vole'); });
      assert.equal(countRe(row.svg, /scale\(-1 1\)/g), 0, cam + ': row ' + i + ': every piece faces the same way');
      if (i) {
        const front = byRow[i - 1];
        assert.ok(row.p[0].y < front.p[0].y - row.p[0].k * 64, cam + ': row ' + i + ' lies behind row ' + (i - 1) + ', its pieces clear of it');
        assert.ok(row.p[0].k < front.p[0].k, cam + ': and is smaller');
        assert.notEqual(row.p[0].kind, front.p[0].kind, cam + ': the rows are out of step');
      }
      // centred on the same line as the row in front
      const mid = (row.p[0].x + row.p[9].x) / 2, mid0 = (byRow[0].p[0].x + byRow[0].p[9].x) / 2;
      assert.ok(Math.abs(mid - mid0) < 6, cam + ': row ' + i + ' centred with the front row');
    });
    // keep: the front row first, one box each, the pieces inside it
    r.keep.forEach((k, i) => {
      const b = cam === 'close' ? null : world(k);
      if (b) byRow[i].p.forEach((q) => assert.ok(q.x > b.x && q.x < b.x + b.w && q.y > b.y && q.y <= b.y + b.h + 1, cam + ': row ' + i + ' inside its keep box'));
    });
  }
});

test('chapter 4: the back row of the third morning: three pieces, four empty places, three pieces: the hole right in the middle', () => {
  for (const cam of [...ROW_CAMS, 'gap']) {
    const r = renderP(cam, { rows: MORNING }), groups = groupsNamed(r.svg, 'row');
    const back = groups.find((gr) => /data-row="2"/.test(gr));
    assert.ok(back, cam + ': the back row is row 2 of the pile');
    const p = rowPieces(back);
    assert.equal(p.length, 6, cam + ': six pieces in the back row');
    const step = p[1].x - p[0].x;
    assert.ok(Math.abs((p[2].x - p[1].x) - step) < step * 0.06, cam + ': three side by side');
    assert.ok(Math.abs((p[5].x - p[4].x) - step) < step * 0.06 && Math.abs((p[4].x - p[3].x) - step) < step * 0.06, cam + ': and three more');
    assert.ok(Math.abs((p[3].x - p[2].x) - 5 * step) < step * 0.12, cam + ': four places empty between them: ' + ((p[3].x - p[2].x) / step).toFixed(2));
    // four empty places, each a pressed mark in the earth where a piece lay, side by side in the hole
    const marks = groupsNamed(back, 'places');
    assert.equal(marks.length, 1);
    const xs = [...marks[0].matchAll(/<ellipse cx="(-?[\d.]+)"/g)].map((m) => +m[1]).filter((x, i, all) => all.indexOf(x) === i).sort((a, b) => a - b);
    assert.equal(xs.length, 4, cam + ': four empty places');
    xs.forEach((x, i) => assert.ok(Math.abs(x - (p[2].x + (i + 1) * step)) < step * 0.1, cam + ': place ' + i + ' where its piece lay'));
    // right in the middle: the hole's middle is the row's
    assert.ok(Math.abs((xs[0] + xs[3]) / 2 - (p[0].x + p[5].x) / 2) < step * 0.08, cam + ': the hole is in the middle of the row');
    // a full row has no marks at all
    assert.equal(groupsNamed(renderP(cam, { rows: FULL }).svg, 'places').length, 0, cam + ': no empty place in a full row');
  }
  // the `gap` camera draws the back row alone, bigger than the `rows` camera shows it
  const gap = renderP('gap', { rows: MORNING }), rows = renderP('rows', { rows: MORNING });
  assert.equal(groupsNamed(gap.svg, 'row').length, 1, 'gap: the back row alone');
  assert.equal(pieces(gap.svg), 6);
  const kGap = rowPieces(groupsNamed(gap.svg, 'row')[0])[0].k, kRows = rowPieces(groupsNamed(rows.svg, 'row').find((gr) => /data-row="2"/.test(gr)))[0].k;
  assert.ok(kGap > kRows * 1.5, 'gap: she has come to the back row: ' + kGap + ' vs ' + kRows);
  // the same six pieces from every camera (their kinds, left to right)
  const kinds = (cam) => rowPieces(groupsNamed(renderP(cam, { rows: MORNING }).svg, 'row').find((gr) => /data-row="2"/.test(gr))).map((q) => q.kind).join(' ');
  for (const cam of [...ROW_CAMS, 'gap']) assert.equal(kinds(cam), kinds('rows'), cam + ': the same pieces');
  // with no `rows`, the new cameras show the third morning's (they are cameras of the rows)
  for (const cam of ['rows', 'gap']) assert.equal(strip(renderP(cam, {}).svg), strip(renderP(cam, { rows: MORNING }).svg), cam + ': the third morning by default');
});

test('chapter 4: `lit` counts rows once the pile is in rows: the first n glow, the front row first', () => {
  for (const cam of ROW_CAMS) {
    for (const lit of [0, 1, 2, 4, 9]) {
      const svg = renderP(cam, { rows: NIGHT, lit }).svg, n = Math.min(lit, 4);
      assert.equal(countRe(svg, /class="pcs-pulse"/g), n, cam + ' lit ' + lit + ': a glow a lit row');
      assert.equal(countRe(svg, /#eea20c/g), n * 10, cam + ': a sparkle on each of its ten pieces');
      const groups = groupsNamed(svg, 'row');
      groups.forEach((gr) => assert.equal(/class="pcs-pulse"/.test(gr), +/data-row="(\d+)"/.exec(gr)[1] < n, cam + ': the front rows first'));
    }
  }
});

// ---------------------------------------------------------------- back: 'shadow'

test('chapter 4: back: \'shadow\': the back row is a band of shade: no gap, no dug earth, no "scale" can be made out, whatever the options say', () => {
  for (const cam of [...ROW_CAMS, 'gap']) {
    const plain = renderP(cam, { rows: MORNING, back: 'shadow' });
    // the same picture whether the row is full or has its hole, and whatever dug, scale and glint say
    for (const opts of [{ rows: FULL }, { rows: MORNING, dug: true }, { rows: MORNING, dug: 'big', scale: true, glint: true }, { rows: [10, 10, { n: 10, gap: [0, 9] }], scale: true }, { rows: FULL, scale: 'behind', glint: true }]) {
      const r = renderP(cam, Object.assign({}, opts, { back: 'shadow' }));
      assert.equal(strip(r.svg), strip(plain.svg), cam + ': nothing of ' + JSON.stringify(opts) + ' shows');
      assert.deepEqual(r.keep, plain.keep);
    }
    for (const name of ['places', 'dug', 'scale', 'glint', 'glimmer']) assert.equal(groupsNamed(plain.svg, name).length, 0, cam + ': no ' + name + ' in the shade');
    assert.equal(groupsNamed(plain.svg, 'band').length, 1, cam + ': one band');
    // the rows in front are as they were, and the back row is not drawn as a row
    const lit = renderP(cam, { rows: MORNING });
    const front = (r) => groupsNamed(r.svg, 'row').filter((gr) => !/data-row="2"/.test(gr)).map(strip).join('');
    assert.equal(front(plain), front(lit), cam + ': the front rows unchanged');
    assert.ok(!groupsNamed(plain.svg, 'row').some((gr) => /data-row="2"/.test(gr)), cam + ': the back row is the band');
    assert.notEqual(strip(plain.svg), strip(lit.svg), cam + ': the shadow hides what the reveal shows');
    // the band: deep shade (two soft pools of it), and only the row's ends come out of it: three pieces
    // each side, never the middle four
    const band = groupsNamed(plain.svg, 'band')[0];
    assert.equal(pieces(band), 6, cam + ': the row\'s two ends');
    assert.equal(countRe(band, /<ellipse [^>]*fill="url\(#/g), 2, cam + ': the shade, and the deep pool across the middle');
    const kept = plain.keep.length;
    assert.equal(kept, cam === 'gap' ? 1 : 3, cam + ': the band is kept clear like a row');
  }
  // where the band's pieces are: outside the middle four places
  const svg = renderP('rows', { rows: MORNING, back: 'shadow' }).svg, band = groupsNamed(svg, 'band')[0];
  const ends = rowPieces(band), shown = rowPieces(groupsNamed(renderP('rows', { rows: MORNING }).svg, 'row').find((gr) => /data-row="2"/.test(gr)));
  assert.deepEqual(ends.map((q) => Math.round(q.x)), shown.map((q) => Math.round(q.x)), 'the ends of the row are where the row\'s pieces are');
  // the pool is darkest over the hole: its ellipse is centred on the row's middle and covers the four empty places
  const pool = [...band.matchAll(/<ellipse cx="(-?[\d.]+)" cy="(-?[\d.]+)" rx="([\d.]+)" ry="([\d.]+)" fill="url/g)].map((m) => m.slice(1).map(Number))[1];
  const step = shown[1].x - shown[0].x, mid = (shown[0].x + shown[5].x) / 2;
  assert.ok(Math.abs(pool[0] - mid) < 2 && pool[2] > 2.6 * step && pool[2] < 5 * step, 'the deep pool lies across the middle of the row: ' + pool);
  // a shadow on a pile of pairs is nothing (chapters 2 and 3 never ask)
  assert.equal(groupsNamed(renderP('wide', { back: 'shadow' }).svg, 'band').length, 0);
});

// ---------------------------------------------------------------- dug, in rows

test('chapter 4: dug earth behind the back row, right behind its gap; \'big\' heaps it up; the gap\'s floor stays in front of it', () => {
  for (const cam of [...ROW_CAMS, 'gap']) {
    const none = renderP(cam, { rows: MORNING }), dug = renderP(cam, { rows: MORNING, dug: true }), big = renderP(cam, { rows: MORNING, dug: 'big' });
    assert.equal(groupsNamed(none.svg, 'dug').length, 0, cam + ': only when asked');
    const d1 = groupsNamed(dug.svg, 'dug'), d2 = groupsNamed(big.svg, 'dug');
    assert.equal(d1.length, 1); assert.equal(d2.length, 1);
    assert.ok(d2[0].length > d1[0].length + 1500, cam + ': big is more earth');
    assert.deepEqual(big.keep, none.keep, cam + ': the rows are where they were');
    // drawn before the rows (it is behind them)
    assert.ok(big.svg.indexOf('data-art="dug"') < big.svg.indexOf('data-art="row"'), cam + ': behind the back row');
    // centred on the hole, and no lower on the panel than the row's own base
    const back = rowPieces(groupsNamed(big.svg, 'row').find((gr) => /data-row="2"/.test(gr)));
    const mid = (back[2].x + back[3].x) / 2, r = reach(d1[0]);
    assert.ok(Math.abs((r[0] + r[1]) / 2 - mid) < (back[1].x - back[0].x) * 0.8, cam + ': behind the hole: ' + r + ' vs ' + mid);
    const ys = [...d2[0].matchAll(/<ellipse cx="-?[\d.]+" cy="(-?[\d.]+)" rx="[\d.]+" ry="([\d.]+)"/g)].map((m) => +m[1] + +m[2]);
    assert.ok(Math.max(...ys) < back[0].y - back[0].k * 10, cam + ': the heap ends behind the places where the pieces lay');
  }
});

// ---------------------------------------------------------------- the "scale"

// the first path of a group whose data has curves (the "scale"'s outline), its own units' transform ignored
const outlineOf = (group) => /<path d="(M[^"]*C[^"]*Z)"/.exec(group)[1];
// sample an outline (M, Q, C, Z, absolute) into points
function sampleOutline(d) {
  const tok = d.match(/[MQCZ]|-?\d*\.?\d+/g), out = [];
  let i = 0, cmd = '', x = 0, y = 0;
  const num = () => +tok[i++];
  while (i < tok.length) {
    if (/[A-Z]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'Z') continue;
    if (cmd === 'M') { x = num(); y = num(); out.push([x, y]); } else if (cmd === 'Q') {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num();
      for (let t = 0.05; t <= 1.0001; t += 0.05) out.push([(1 - t) * (1 - t) * x + 2 * (1 - t) * t * x1 + t * t * x2, (1 - t) * (1 - t) * y + 2 * (1 - t) * t * y1 + t * t * y2]);
      x = x2; y = y2;
    } else if (cmd === 'C') {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x3 = num(), y3 = num();
      for (let t = 0.05; t <= 1.0001; t += 0.05) { const u = 1 - t; out.push([u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]); }
      x = x3; y = y3;
    } else i++;
  }
  return out;
}

test('chapter 4: the "scale": shaped like a giant fish\'s scale (round at one end, a blunt point at the other), flat, smooth at every edge', () => {
  for (const cam of [...CLOSEUPS, 'gap', 'rows']) {
    const group = groupsNamed(renderP(cam, { rows: MORNING, scale: true }).svg, 'scale')[0];
    assert.ok(group, cam + ': the "scale" is drawn');
    const d = outlineOf(group);
    // smooth: its outline is all curves, never a corner
    assert.ok(/^M[-\d. ]+(?:[QC][-\d. ]+)+Z$/.test(d), cam + ': curves only: ' + d.slice(0, 60));
    assert.ok(!/[LHVlhv]/.test(d), cam + ': no straight edge, no corner');
    const P = sampleOutline(d), xs = P.map((q) => q[0]), ys = P.map((q) => q[1]);
    const top = Math.min(...ys), bottom = Math.max(...ys), H = bottom - top, W = Math.max(...xs) - Math.min(...xs);
    const widthAt = (f) => { const band = P.filter((q) => Math.abs(q[1] - (top + H * f)) < H * 0.06).map((q) => q[0]); return Math.max(...band) - Math.min(...band); };
    // round at one end (broad, near its full width a fifth of the way down), a blunt point at the other
    assert.ok(widthAt(0.2) > W * 0.8, cam + ': a broad round end');
    assert.ok(widthAt(0.95) < W * 0.4 && widthAt(0.95) > W * 0.06, cam + ': a point, but a blunt one: ' + (widthAt(0.95) / W).toFixed(2));
    assert.ok(W / H > 0.75 && W / H < 1.05, cam + ': about as wide as it is long: ' + (W / H).toFixed(2));
    // symmetric, like a scale
    const mid = (Math.max(...xs) + Math.min(...xs)) / 2;
    assert.ok(Math.abs(mid) < W * 0.02, cam + ': symmetric about its own middle');
    // the same shape at every size
    assert.ok(Math.abs(W / H - 52.3 / 60.2) < 0.03, cam + ': one shape, close or far: ' + (W / H).toFixed(3));
  }
});

test('chapter 4: the "scale" is glass: clear, a faint green cast, a white shine; nothing like Sprinkle\'s matte grey ridges', () => {
  const src = fs.readFileSync(path.join(ROOT, 'app/art/sets/bridge.js'), 'utf8');
  const sprinkle = /var SPRINKLE_PAW = \{([^}]+)\}/.exec(src)[1].match(/#[0-9a-f]{6}/gi).map((h) => h.toLowerCase());
  assert.ok(sprinkle.length >= 4, 'Sprinkle\'s own colours, from the bridge set');
  const rgb = (h) => { const v = parseInt(h.slice(1), 16); return [v >> 16, (v >> 8) & 255, v & 255]; };
  for (const cam of [...CLOSEUPS, 'gap', 'rows', 'wide']) {
    const r = renderP(cam, { rows: MORNING, scale: true }), group = groupsNamed(r.svg, 'scale')[0];
    const d = outlineOf(group);
    // clear: the plate itself is drawn see-through (what is behind it shows)
    const body = new RegExp('<path d="' + d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '" fill="(#[0-9A-Fa-f]{6})" opacity="([\\d.]+)"').exec(group);
    assert.ok(body, cam + ': a filled plate');
    assert.ok(+body[2] <= 0.6, cam + ': see-through (' + body[2] + ')');
    const c = rgb(body[1]);
    assert.ok(c[1] > c[0] && c[1] >= c[2] && Math.min(...c) > 200, cam + ': nearly clear, a breath of green: ' + body[1]);
    // every colour on it is white or a green: no grey, nothing of a dragonet's (in `through` and `mirror`
    // the glass holds a whole picture: there, the colours of its own edge)
    const own = cam === 'through' || cam === 'mirror' ? group.slice(group.lastIndexOf('<g transform="translate(')) : group;
    const cols = [...new Set((own.match(/(?:fill|stroke)="(#[0-9A-Fa-f]{6})"/g) || []).map((x) => /#[0-9A-Fa-f]{6}/.exec(x)[0].toLowerCase()))];
    const shadeCol = art.kit.PAL.morning.shade.toLowerCase();   // its own soft shadow on the earth
    for (const col of cols) {
      if (col === shadeCol) continue;
      const v = rgb(col), white = Math.min(...v) > 240, green = v[1] > v[0] && v[1] > v[2];
      assert.ok(white || green, cam + ': ' + col + ' is white or green');
      assert.ok(!sprinkle.includes(col), cam + ': none of Sprinkle\'s colours');
    }
    assert.ok(cols.some((col) => { const v = rgb(col); return v[1] > v[0] + 20 && v[1] > v[2] + 10; }), cam + ': a green edge, where the glass is thickest');
    assert.ok(/stroke="#FFFFFF"/i.test(group), cam + ': a white shine');
    // smooth, not ridged: one outline, used whole (its plate, its edges); no rows of little arcs across it
    const ds = [...new Set((own.match(/ d="([^"]+)"/g) || []).map((x) => x.slice(4, -1)))];
    assert.ok(ds.length <= 8, cam + ': a plain plate, not a pattern of ridges (' + ds.length + ' shapes)');
    // kept clear of the lettering
    assert.ok(r.keep.length >= 1);
  }
});

test('chapter 4: scale: true: in the gap, on the earth, leaning on the next piece in the row; as big as a cat\'s paw', () => {
  for (const cam of [...ROW_CAMS, 'gap']) {
    const r = renderP(cam, { rows: MORNING, scale: true }), groups = groupsNamed(r.svg, 'scale');
    assert.equal(groups.length, 1, cam + ': one "scale"');
    const back = rowPieces(groupsNamed(r.svg, 'row').find((gr) => /data-row="2"/.test(gr))), step = back[1].x - back[0].x, k = back[0].k;
    const t = /transform="translate\((-?[\d.]+) (-?[\d.]+)\) rotate\((-?[\d.]+)\)"/.exec(groups[0]);
    assert.ok(t, cam + ': standing on its point, leaning');
    const x = +t[1], y = +t[2], lean = +t[3];
    // its point on the earth at the row's own line, in the last empty place, by the next piece (place 7)
    assert.ok(Math.abs(y - back[0].y) < 1, cam + ': on the row\'s line');
    const next = back[3].x, lastEmpty = next - step;
    assert.ok(x > lastEmpty && x < next - step * 0.5, cam + ': at the hole\'s end, beside the next piece: ' + x + ' in ' + lastEmpty + '..' + next);
    assert.ok(lean > 10 && lean < 40, cam + ': leaning on it (toward the next piece), not lying flat, never held up: ' + lean);
    // its round end reaches the piece's flank: the outline, leaned, comes within a few units of the piece's near end
    const P = sampleOutline(outlineOf(groups[0])), a = lean * Math.PI / 180;
    const right = Math.max(...P.map((q) => x + q[0] * Math.cos(a) - q[1] * Math.sin(a)));
    assert.ok(right > next - 55 * k - 12 * k && right < next - 55 * k + 22 * k, cam + ': touching the piece\'s near end: ' + right.toFixed(1) + ' vs ' + (next - 55 * k).toFixed(1));
    // as big as a cat's paw: about half a mouse long, a little under a mouse high
    const W = Math.max(...P.map((q) => q[0])) - Math.min(...P.map((q) => q[0])), H = Math.max(...P.map((q) => q[1])) - Math.min(...P.map((q) => q[1]));
    assert.ok(W / (110 * k) > 0.4 && W / (110 * k) < 0.55 && H / (64 * k) > 0.8 && H / (64 * k) < 1.0, cam + ': paw-sized beside a mouse: ' + (W / (110 * k)).toFixed(2) + ' x ' + (H / (64 * k)).toFixed(2));
    // drawn after the back row (it leans on a piece of it), and it is in keep, one box more than the rows
    assert.ok(r.svg.indexOf('data-art="scale"') > r.svg.indexOf('data-row="2"'), cam + ': over the row it leans on');
    assert.equal(r.keep.length, renderP(cam, { rows: MORNING }).keep.length + 1, cam + ': kept clear');
    // only when asked; and a full back row has no gap to lie in, so it leans on the row's end, outside
    assert.equal(groupsNamed(renderP(cam, { rows: MORNING }).svg, 'scale').length, 0, cam + ': only when asked');
    assert.equal(groupsNamed(renderP(cam, { rows: MORNING, scale: false }).svg, 'scale').length, 0);
    assert.equal(groupsNamed(renderP(cam, { rows: FULL, scale: true }).svg, 'scale').length, 1, cam + ': never lost');
  }
});

test('chapter 4: scale: \'behind\' (tonight): where it was found, on the bare earth behind the back row, lying flat, a small glimmer', () => {
  for (const cam of ROW_CAMS) {
    const r = renderP(cam, { rows: NIGHT, scale: 'behind', dug: 'big' }, [], ['sunset']), groups = groupsNamed(r.svg, 'scale');
    assert.equal(groups.length, 1, cam + ': one "scale"');
    assert.equal(pieces(r.svg), 40, cam + ': forty in the rows tonight');
    const rows = groupsNamed(r.svg, 'row').map((gr) => rowPieces(gr)), back = rows[0];
    assert.equal(back.length, 10);
    const t = /transform="translate\((-?[\d.]+) (-?[\d.]+)\) scale\(1 0\.5\) rotate\((-?[\d.]+)\)"/.exec(groups[0]);
    assert.ok(t, cam + ': lying flat on the earth');
    // behind the back row: further up the panel than the tops of its pieces, so it shows over them; right of the middle
    assert.ok(+t[2] < back[0].y - back[0].k * 64, cam + ': behind the back row, clear of its pieces: ' + t[2] + ' vs ' + (back[0].y - back[0].k * 64).toFixed(1));
    assert.ok(+t[1] > (back[0].x + back[9].x) / 2 && +t[1] < back[9].x, cam + ': where the hole\'s end was');
    assert.ok(r.svg.indexOf('data-art="scale"') < r.svg.indexOf('data-art="row"'), cam + ': drawn before the rows: it is behind them');
    assert.ok(r.svg.indexOf('data-art="scale"') > r.svg.indexOf('data-art="dug"'), cam + ': beside the dug earth, not under it');
    // on bare earth: the dug earth's heap ends behind it (further up the panel), so it lies in front of the heap, not on it
    const heap = [...groupsNamed(r.svg, 'dug')[0].matchAll(/<ellipse cx="-?[\d.]+" cy="(-?[\d.]+)" rx="[\d.]+" ry="([\d.]+)"/g)].map((m) => +m[1] + +m[2]);
    assert.ok(Math.max(...heap) <= +t[2] + 2, cam + ': the heap is behind the "scale": ' + Math.max(...heap).toFixed(1) + ' vs ' + t[2]);
    // a small glimmer on it, always; not the Tap's glint (nobody taps tonight)
    assert.equal(groupsNamed(r.svg, 'glimmer').length, 1, cam + ': a small glint under the brambles');
    assert.equal(groupsNamed(r.svg, 'glint').length, 0);
    assert.equal(r.keep.length, 5, cam + ': four rows and the "scale"');
    // nothing in the rows: tonight's rows are full
    assert.equal(groupsNamed(r.svg, 'places').length, 0);
  }
});

test('chapter 4: glint: true: the sun on the "scale": one star of light, pulsing softly, with a generous box for the glitter Tap', () => {
  for (const cam of [...ROW_CAMS, 'gap', ...CLOSEUPS]) {
    const r = renderP(cam, { rows: MORNING, scale: true, glint: true }), gl = groupsNamed(r.svg, 'glint');
    assert.equal(gl.length, 1, cam + ': one glint');
    assert.ok(/class="pcs-pulse"/.test(gl[0]), cam + ': it pulses softly (and holds still under reduced motion)');
    // the Tap's target: an unpainted circle makes the group's box generous; the star's middle is its middle
    const hit = /<circle cx="(-?[\d.]+)" cy="(-?[\d.]+)" r="([\d.]+)" fill="none"\/>/.exec(gl[0]);
    assert.ok(hit, cam + ': a target for the Tap');
    const info = art.sceneInfo('pile').cams[cam], hx = +hit[1], hy = +hit[2], hr = +hit[3];
    assert.ok(hr >= info.w * 0.04, cam + ': a generous target: r ' + hr + ' on a camera ' + info.w + ' wide');
    assert.ok(hy > info.y + 20 && hy < info.y + info.h - 20 && hx > info.x + 20 && hx < info.x + info.w - 20, cam + ': on the panel: ' + [hx, hy]);
    // on the "scale": the star's middle is on its upper part
    const sc = groupsNamed(r.svg, 'scale')[0], t = /transform="translate\((-?[\d.]+) (-?[\d.]+)\) rotate\((-?[\d.]+)\)"/.exec(sc);
    const P = sampleOutline(outlineOf(sc)), a = +t[3] * Math.PI / 180, W = P.map((q) => [+t[1] + q[0] * Math.cos(a) - q[1] * Math.sin(a), +t[2] + q[0] * Math.sin(a) + q[1] * Math.cos(a)]);
    const x0 = Math.min(...W.map((q) => q[0])), x1 = Math.max(...W.map((q) => q[0])), y0 = Math.min(...W.map((q) => q[1])), y1 = Math.max(...W.map((q) => q[1]));
    assert.ok(hx > x0 && hx < x1 && hy > y0 && hy < (y0 + y1) / 2, cam + ': on the "scale", toward its round end: ' + [hx, hy] + ' in ' + [x0, y0, x1, y1].map(Math.round));
    // and the lettering keeps off it: the star's middle is inside a keep box
    assert.ok(r.keep.some((k) => { const b = { x: info.x + k.x / 100 * info.w, y: info.y + k.y / 100 * info.h, w: k.w / 100 * info.w, h: k.h / 100 * info.h }; return hx > b.x && hx < b.x + b.w && hy > b.y && hy < b.y + b.h; }), cam + ': kept clear');
    // drawn last of the pile (light, over everything of it), and inside keep
    assert.ok(r.svg.indexOf('data-art="glint"') > r.svg.lastIndexOf('data-art="scale"'), cam + ': over the "scale"');
    // only when asked
    assert.equal(groupsNamed(renderP(cam, { rows: MORNING, scale: true }).svg, 'glint').length, 0, cam + ': only when asked');
  }
  // something glitters in the gap before anyone has made out what: the glint alone, at the same spot
  for (const cam of [...ROW_CAMS, 'gap']) {
    const both = renderP(cam, { rows: MORNING, scale: true, glint: true }), alone = renderP(cam, { rows: MORNING, glint: true });
    assert.equal(groupsNamed(alone.svg, 'scale').length, 0, cam + ': no "scale" made out');
    assert.equal(strip(groupsNamed(alone.svg, 'glint')[0]).replace(/url\(#[^)]+\)/g, ''), strip(groupsNamed(both.svg, 'glint')[0]).replace(/url\(#[^)]+\)/g, ''), cam + ': the glint where the "scale" is');
    assert.equal(alone.keep.length, both.keep.length, cam + ': and it is kept clear');
  }
  // never in the shade, never on a pile of pairs
  assert.equal(groupsNamed(renderP('rows', { rows: MORNING, glint: true, back: 'shadow' }).svg, 'glint').length, 0);
  assert.equal(groupsNamed(renderP('wide', { glint: true }).svg, 'glint').length, 0);
});

// ---------------------------------------------------------------- the cameras

// a sitting cat's body box at an anchor (world units), from the character drawing's own bounds
function catBox(a) {
  const c = art.character('clancat', { pose: 'sit', variant: 1 }), b = c.bounds, s = a.h / c.h;
  const x0 = (b.x0 - c.w / 2) * s, x1 = (b.x1 - c.w / 2) * s;
  return a.face === 'left' ? { x0: a.x - x1, x1: a.x - x0, y0: a.y + (b.y0 - c.h) * s, y1: a.y } : { x0: a.x + x0, x1: a.x + x1, y0: a.y + (b.y0 - c.h) * s, y1: a.y };
}

test('chapter 4: `rows`: from the front, the rows running back; the cats sit clear of every piece, the old tom at the front', () => {
  const info = art.sceneInfo('pile'), cam = info.cams.rows, A = info.anchors.rows;
  assert.equal(cam.w, 1600, 'the whole composition');
  for (const rows of [MORNING, NIGHT]) {
    const r = renderP('rows', { rows });
    const boxes = groupsNamed(r.svg, 'row').map((gr) => rowPieces(gr)).map((p) => ({ x0: p[0].x - 58 * p[0].k, x1: p[p.length - 1].x + 58 * p[0].k, y0: p[0].y - 66 * p[0].k, y1: p[0].y }));
    for (const [name, a] of Object.entries(A)) {
      const c = catBox(a);
      assert.ok(c.x0 >= -8 && c.x1 <= 1608 && c.y1 <= 1000, name + ': the cat is in the panel: ' + JSON.stringify(c));
      for (const b of boxes) assert.ok(c.x1 < b.x0 + 6 || c.x0 > b.x1 - 6 || c.y1 < b.y0 || c.y0 > b.y1, name + ': clear of every row (' + rows.length + ' rows): ' + JSON.stringify([c, b]));
    }
    // the rows fill the panel's width, in its lower part; the brambles overhead
    const front = boxes[boxes.length - 1];
    assert.ok(front.x1 - front.x0 > 1000, 'ten across, big enough to see as ten');
    assert.ok(Math.min(...boxes.map((b) => b.y0)) > 450, 'the rows lie on the floor, under the arch');
  }
  // depth: cats further back are smaller; the front two sit level, either side
  assert.ok(A['pile-left'].h > A['crowd-1'].h && A['crowd-1'].h > A['crowd-2'].h);
  assert.ok(Math.abs(A['pile-left'].h - A.beside.h) < 1 && A['pile-left'].x < 300 && A.beside.x > 1300, 'one each side at the front');
  assert.equal(A.beside.face, 'left', 'the old tom faces his rows');
  // three cats at the front and middle of the rows all show (the sunset panel: the old tom, Tallyheart and her)
  const cast = [{ who: 'grizzled', at: 'beside' }, { who: 'tallyheart', at: 'pile-right' }, { who: 'player', at: 'pile-left' }];
  const r = renderP('rows', { rows: NIGHT, scale: 'behind' }, cast, ['sunset']);
  r.heads.forEach((h, i) => assert.ok(h && h.x > 2 && h.x < 98 && h.y > 8 && h.y < 92, cast[i].at + ' in sight: ' + JSON.stringify(h)));
  // Glintstar's fountain is not in this picture: a cat placed there is out of sight, not dropped somewhere odd
  assert.deepEqual(renderP('rows', {}, [{ who: 'glintstar', at: 'fountain-edge' }]).heads, [null]);
});

test('chapter 4: `gap`: the back row across the panel, the hole in its middle; the cats sit in front of it, the middle left clear', () => {
  // (the three spots in front of the row; chapter 5's `behind`, round the back of it, has its own test)
  const info = art.sceneInfo('pile'), A = Object.fromEntries(Object.entries(info.anchors.gap).filter(([k]) => k !== 'behind'));
  assert.deepEqual(Object.keys(A).sort(), ['beside', 'pile-left', 'pile-right']);
  const r = renderP('gap', { rows: MORNING, dug: 'big', scale: true, glint: true }, Object.keys(A).map((at, i) => ({ who: ['player', 'tallyheart', 'grizzled'][i], at })));
  const p = rowPieces(groupsNamed(r.svg, 'row')[0]);
  assert.ok(p[5].x - p[0].x > 1200, 'the row runs across the panel: ' + (p[5].x - p[0].x));
  assert.ok(p[0].x - 60 * p[0].k > 0 && p[5].x + 60 * p[0].k < 1600, 'whole, both ends');
  for (const [name, a] of Object.entries(A)) {
    const c = catBox(a);
    assert.ok(c.y0 > p[0].y + 20, name + ': in front of the row, her head below it: ' + c.y0.toFixed(0) + ' vs ' + p[0].y);
    assert.ok(c.x1 < 800 - 1.5 * (p[1].x - p[0].x) || c.x0 > 800 + 1.5 * (p[1].x - p[0].x), name + ': the middle of the hole left clear: ' + JSON.stringify(c));
    assert.ok(c.x0 > 0 && c.x1 < 1600);
  }
  r.heads.forEach((h) => assert.ok(h && h.y > 60, 'the cats sit along the bottom'));
  // nearer the camera than the row, so big beside it: a sitting cat is about three mice tall, as in `rows`
  // (a mouse is 110 long at size 1; at 330 high the big ginger was barely two mice tall in a MEDIUM panel)
  const mouse = 110 * p[0].k, R = info.anchors.rows, rowsK = 108;
  for (const [name, a] of Object.entries(A)) assert.ok(a.h >= mouse * 2.7 && a.h <= mouse * 3.3, name + ': ' + (a.h / mouse).toFixed(2) + ' mice tall');
  assert.ok(Math.abs(A['pile-left'].h / mouse - R['pile-left'].h / rowsK) < 0.35, 'the same cat-to-prey size as the `rows` camera two panels earlier');
  // the dug earth and the brambles' shade behind; the hole is the middle of the panel
  assert.ok(Math.abs((p[2].x + p[3].x) / 2 - 800) < 10, 'the hole is the middle of the picture');
});

test('chapter 4: the three close-ups: no face in them (a balloon there comes from off the panel), the "scale" what they are about', () => {
  const cast = [{ who: 'player', at: 'pile-left' }, { who: 'tallyheart', at: 'beside' }, { who: 'snorter' }];
  for (const cam of CLOSEUPS) {
    const r = renderP(cam, { rows: MORNING, scale: true }, cast);
    assert.deepEqual(r.heads, [null, null, null], cam + ': no cast in the close-up');
    assert.equal(groupsNamed(r.svg, 'scale').length, 1, cam + ': one "scale"');
    assert.equal(r.keep.length, 1, cam + ': it is what the picture is about');
    const k = r.keep[0];
    assert.ok(k.w > 18 && k.h > 30 && k.x > 5 && k.x + k.w < 95, cam + ': big, and whole: ' + JSON.stringify(k));
    // the camera is on it whatever the options say: no `scale` asked, a shadow asked, a pile of pairs
    for (const opts of [{}, { rows: MORNING }, { rows: MORNING, back: 'shadow' }, { pairs: 7 }, { rows: NIGHT, scale: 'behind' }]) assert.equal(groupsNamed(renderP(cam, opts).svg, 'scale').length, 1, cam + ' ' + JSON.stringify(opts));
    // nobody holds it, nobody carries it: no paw, no mouth, no cat at all in the picture's own art
    assert.equal(countRe(r.svg, /data-paw|data-claw/g), 0);
    // no rain under the brambles this close
    assert.ok(!/pcs-rain/.test(renderP(cam, {}, [], ['rain']).svg.replace(/<defs>[\s\S]*?<\/defs>/, '')) || /clip-path/.test(renderP(cam, {}, [], ['rain']).svg), cam + ': rain is clipped away');
  }
});

test('chapter 4: `scale`: close on it where it leans: the one piece it leans on beside it, the empty places, the dug earth behind when asked', () => {
  const r = renderP('scale', { rows: MORNING, scale: true });
  assert.equal(pieces(r.svg), 1, 'the next piece in the row, and no other');
  // that piece is the back row's piece after the hole (place 7), the same kind the other cameras show there
  const back = rowPieces(groupsNamed(renderP('rows', { rows: MORNING }).svg, 'row').find((gr) => /data-row="2"/.test(gr)));
  assert.equal(count(r.svg, back[3].kind === 'mouse' ? MOUSE_NOSE : VOLE_NOSE), 1, 'the same ' + back[3].kind + ' it leans on in the row');
  assert.ok(/fill="none" stroke="#3B2C27"/.test(r.svg), 'its eyes shut, like every piece');
  // whole in the panel, to the right of the "scale"; the "scale" leans toward it
  const sc = groupsNamed(r.svg, 'scale')[0], t = /transform="translate\((-?[\d.]+) (-?[\d.]+)\) rotate\((-?[\d.]+)\)"/.exec(sc);
  assert.ok(+t[3] > 10 && +t[3] < 40, 'leaning');
  const pc = /<g transform="translate\((-?[\d.]+) (-?[\d.]+)\) scale\(([\d.]+) [\d.]+\)"><g transform="translate\(12 12\)">/.exec(r.svg);
  assert.ok(+pc[1] + 12 * +pc[3] > +t[1] && +pc[1] + 122 * +pc[3] < 1600, 'the piece is beside it, nose to tail in the panel: ' + (+pc[1] + 122 * +pc[3]).toFixed(0));
  assert.ok(Math.abs(+pc[2] + 76 * +pc[3] - +t[2]) < 2, 'on the same earth');
  // bigger than in any other view of the pile
  const kGap = rowPieces(groupsNamed(renderP('gap', { rows: MORNING }).svg, 'row')[0])[0].k;
  assert.ok(+pc[3] > kGap * 4, 'close: ' + pc[3] + ' against the gap camera\'s ' + kGap);
  // dug earth behind only when asked; the sun's shaft and star only with glint
  assert.equal(groupsNamed(r.svg, 'dug').length, 0);
  assert.equal(groupsNamed(renderP('scale', { rows: MORNING, dug: 'big' }).svg, 'dug').length, 1);
  assert.ok(renderP('scale', { rows: MORNING, glint: true }).svg.length > r.svg.length + 400, 'the sun on it');
});

// the points of every dense polygon path (M x yL x y … Z, thirty points or more) in some markup
const densePolys = (svg) => [...svg.matchAll(/<path d="(M-?[\d.]+ -?[\d.]+(?:L-?[\d.]+ -?[\d.]+){29,}Z)"/g)].map((m) => m[1].slice(1, -1).split('L').map((q) => q.split(' ').map(Number)));

test('chapter 4: `through`: the camp seen through it: wavy and a little green inside its outline, as it always is outside', () => {
  const r = renderP('through', { rows: MORNING, scale: true }), sc = groupsNamed(r.svg, 'scale')[0];
  const outside = r.svg.slice(0, r.svg.indexOf('<g data-art="scale"'));
  // the camp is drawn twice: as it is, and again in the glass (the Clan's six noses to the sky, each time)
  assert.equal(countRe(outside, /fill="#D98A94"/g), 6, 'the Clan outside the glass');
  assert.equal(countRe(sc, /fill="#D98A94"/g), 6, 'and again inside it');
  assert.ok(/clip-path="url\(#/.test(sc), 'what is in the glass is clipped to its outline');
  // the first glass tower: straight outside (two upright edges), wandering inside
  const straight = densePolys(outside)[0], wavy = densePolys(sc)[0];
  // (the x of the points along its two upright edges: away from its top and its foot)
  const distinctX = (P) => { const ys0 = P.map((q) => q[1]), top = Math.min(...ys0), foot = Math.max(...ys0); return new Set(P.filter((q) => q[1] > top + 40 && q[1] < foot - 40).map((q) => Math.round(q[0]))).size; };
  assert.equal(distinctX(straight), 2, 'outside the glass a tower\'s edges are straight');
  assert.ok(distinctX(wavy) > 20, 'inside it they wander: ' + distinctX(wavy));
  // the same tower, moved only a little: the glass bends the camp, it does not replace it
  const cx = (P) => P.reduce((s, q) => s + q[0], 0) / P.length, cy = (P) => P.reduce((s, q) => s + q[1], 0) / P.length;
  assert.ok(Math.abs(cx(straight) - cx(wavy)) < 80 && Math.abs(cy(straight) - cy(wavy)) < 60, 'the same camp, bent');
  // level lines dip too: the grass's far edge is not level in the glass
  const ys = (P) => { const top = Math.min(...P.map((q) => q[1])); return P.filter((q) => q[1] < top + 60 && q[0] > 100 && q[0] < 1500).map((q) => q[1]); };
  const ground = (svg) => densePolys(svg).find((P) => Math.max(...P.map((q) => q[1])) > 1000 && Math.max(...P.map((q) => q[0])) - Math.min(...P.map((q) => q[0])) > 1500);
  assert.ok(Math.max(...ys(ground(outside))) - Math.min(...ys(ground(outside))) < 1, 'the far edge of the grass is level outside');
  assert.ok(Math.max(...ys(ground(sc))) - Math.min(...ys(ground(sc))) > 12, 'and dips inside');
  // a little green: the cast is in the glass (a green that deepens toward its edge), not over the whole panel
  const defs = /<defs>([\s\S]*?)<\/defs>/.exec(r.svg)[1];
  assert.ok(/stop-color="#8ED4B2"/i.test(defs), 'a green cast');
  assert.ok(/stop-color="#8ED4B2" stop-opacity="0\.[0-4]/i.test(defs), 'a little green, never a green wall');
  assert.ok(!/#8ED4B2/i.test(outside.replace(/<defs>[\s\S]*?<\/defs>/, '')), 'only in the glass');
  // no animation in it (old glass does not move), no filter doing the bending: it is drawn, so it prints
  assert.ok(!/feTurbulence|feDisplacementMap/.test(r.svg));
  // the fountain is full of rain and nobody is hurt or hunting: a calm camp, everyone looking up
  for (const fx of [['sunset'], ['dusk'], ['night']]) checkRender(renderP('through', {}, [], fx), { cast: [] }, 'through ' + fx);
});

test('chapter 4: `mirror`: her own small face in it, in her fur and eyes, from the player\'s look', () => {
  const looks = art.vocab.looks.fur.map((fur, i) => ({ fur, marking: art.vocab.looks.marking[i % art.vocab.looks.marking.length], eyes: art.vocab.looks.eyes[i % art.vocab.looks.eyes.length], sex: i % 2 ? 'tom' : 'she' }));
  const seen = new Set();
  for (const look of looks) {
    const r = renderP('mirror', { rows: MORNING, scale: true }, [], ['morning'], look), sc = groupsNamed(r.svg, 'scale')[0];
    checkRender(r, { cast: [] }, 'mirror ' + look.fur);
    const refl = groupsNamed(sc, 'reflection');
    assert.equal(refl.length, 1, look.fur + ': one reflection, inside the glass');
    // it is her: the same drawing the scenes make of her, sitting, full of wonder
    const her = art.character('player', { pose: 'sit', mood: 'wonder', look, sex: look.sex, facing: 'left' });
    const bare = (s) => strip(s).replace(/\bpc[0-9a-z]+-?/g, '').replace(/url\(#[^)]*\)/g, 'url()').replace(/ id="[^"]*"/g, '');
    assert.ok(bare(refl[0]).includes(bare(her.svg).slice(0, 400)), look.fur + ': her own face and fur');
    seen.add(bare(refl[0]));
    // small: a tiny cat looks back. Her head is about a sixth of the panel's height, in the middle of the glass
    const t = /transform="translate\((-?[\d.]+) (-?[\d.]+)\) scale\(([\d.]+)\)"/.exec(refl[0]);
    const hb = her.headBox, k = +t[3], hx = +t[1] + (hb.x0 + hb.x1) / 2 * k, hy = +t[2] + (hb.y0 + hb.y1) / 2 * k, hh = (hb.y1 - hb.y0) * k;
    assert.ok(hh > 150 && hh < 320, look.fur + ': a small face: ' + hh.toFixed(0) + ' of 1000');
    const kb = world(r.keep[0]);
    assert.ok(hx > kb.x + kb.w * 0.25 && hx < kb.x + kb.w * 0.75 && hy > kb.y + kb.h * 0.3 && hy < kb.y + kb.h * 0.8, look.fur + ': in the middle of the glass');
    // clipped to the glass, under its green cast and shine
    assert.ok(sc.indexOf('data-art="reflection"') > sc.indexOf('clip-path="url(#'), look.fur + ': inside the outline');
  }
  assert.equal(seen.size, looks.length, 'every coat its own reflection');
  // no look given: still a cat's face (the default look), never an error or an empty glass
  const bare = art.render({ set: 'pile', cam: 'mirror', opts: {}, cast: [], fx: ['morning'] });
  assert.equal(groupsNamed(bare.svg, 'reflection').length, 1);
  // only this camera has her reflection
  for (const cam of ['scale', 'through', 'gap', 'rows']) assert.equal(groupsNamed(renderP(cam, { rows: MORNING, scale: true }).svg, 'reflection').length, 0, cam + ': no reflection');
});

test('chapter 4: whatever chapter 4 puts at the pile renders, uses the vocabulary by value, and hides the back row until the reveal', () => {
  const st = PC.story.ch04;
  if (!st || !st.frames) return;
  const v = art.vocab.sets.pile;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  for (const [fid, f] of Object.entries(st.frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'pile') continue;
    assert.ok(v.cams.includes(sc.cam), fid + ': camera ' + sc.cam);
    for (const [k, val] of Object.entries(sc.opts || {})) {
      assert.ok(Object.prototype.hasOwnProperty.call(v.opts, k), fid + ': option ' + k);
      if (v.opts[k] === 'number') assert.ok(Number.isInteger(val) && val >= 0 && val <= 10, fid + ': ' + k + '=' + val);
      else assert.ok(v.opts[k].some((x) => same(x, val)), fid + ': ' + k + '=' + JSON.stringify(val));
    }
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc, 'ch04 ' + fid);
    // a frame in the shade draws no gap, no dug earth and no "scale" (the set sees to it, whatever the frame says)
    if (sc.opts && sc.opts.back === 'shadow' && !CLOSEUPS.includes(sc.cam)) for (const name of ['places', 'dug', 'scale', 'glint']) assert.equal(groupsNamed(r.svg, name).length, 0, fid + ': no ' + name);
    // the "scale" is only ever at the pile, in a row's gap or behind the rows: never with the pile in pairs
    if (sc.opts && (sc.opts.scale || sc.opts.glint)) assert.ok(Array.isArray(sc.opts.rows) || CH4_CAMS.includes(sc.cam), fid + ': the "scale" lies in a row');
  }
});

// ================================================================ chapter 5 (docs/chapters/05-riffles-river.md, "Art needs",
// "Places from before", and "Build", "Sets and options"): the fourth count. Four rows, the "scale"
// behind them, and the dug earth behind the gap: fresh (a noticing cat taps it), with tiny prints in
// it (its close-up, `gap-close`), and swept flat by the old tom's tail (he has an anchor, `behind`).

const CH5 = { rows: FOURTH, dug: true, scale: 'behind' };
const ROWS_CAMS5 = ['gap', 'rows', 'wide', 'low', 'close'];   // the cameras that show the pile in rows with the earth behind it
const TEXT5 = path.join(ROOT, 'docs/chapters/05-riffles-river.md');
const same5 = (a, b) => strip(a) === strip(b);              // (assert.ok on this: a failed assert.equal would print both pictures)
// The box of everything a piece of markup draws, in world units: path data (absolute and relative
// commands, control points counted), ellipses, circles and rects. Transforms are not applied (the
// groups measured here are drawn in world units, give or take a pixel of lit-edge offset).
function pathBox(d, box) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  let i = 0, x = 0, y = 0, sx = 0, sy = 0, cmd = '';
  const num = () => +toks[i++];
  const see = (px, py) => { box.x0 = Math.min(box.x0, px); box.x1 = Math.max(box.x1, px); box.y0 = Math.min(box.y0, py); box.y1 = Math.max(box.y1, py); };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase(), c = cmd.toUpperCase();
    if (c === 'Z') { x = sx; y = sy; continue; }
    if (c === 'H') { x = rel ? x + num() : num(); see(x, y); continue; }
    if (c === 'V') { y = rel ? y + num() : num(); see(x, y); continue; }
    if (c === 'A') { i += 5; const ax = num(), ay = num(); x = rel ? x + ax : ax; y = rel ? y + ay : ay; see(x, y); continue; }
    const pairs = c === 'C' ? 3 : c === 'Q' || c === 'S' ? 2 : 1;
    let nx = x, ny = y;
    for (let k = 0; k < pairs; k++) { const px = num(), py = num(); nx = rel ? x + px : px; ny = rel ? y + py : py; see(nx, ny); }
    x = nx; y = ny;
    if (c === 'M') { sx = x; sy = y; cmd = rel ? 'l' : 'L'; }
  }
  return box;
}
function boxOf(markup) {
  const box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const m of markup.match(/ d="[^"]+"/g) || []) pathBox(m.slice(4, -1), box);
  const attr = (tag, k) => +((new RegExp(' ' + k + '="(-?[\\d.]+)"').exec(tag) || [])[1]);
  for (const tag of markup.match(/<(ellipse|circle|rect)\b[^>]*>/g) || []) {
    const cx = attr(tag, 'cx'), cy = attr(tag, 'cy');
    const q = tag.startsWith('<rect') ? [attr(tag, 'x'), attr(tag, 'y'), attr(tag, 'x') + attr(tag, 'width'), attr(tag, 'y') + attr(tag, 'height')] :
      tag.startsWith('<circle') ? [cx - attr(tag, 'r'), cy - attr(tag, 'r'), cx + attr(tag, 'r'), cy + attr(tag, 'r')] : [cx - attr(tag, 'rx'), cy - attr(tag, 'ry'), cx + attr(tag, 'rx'), cy + attr(tag, 'ry')];
    box.x0 = Math.min(box.x0, q[0]); box.y0 = Math.min(box.y0, q[1]); box.x1 = Math.max(box.x1, q[2]); box.y1 = Math.max(box.y1, q[3]);
  }
  return Object.assign(box, { w: box.x1 - box.x0, h: box.y1 - box.y0, cx: (box.x0 + box.x1) / 2, cy: (box.y0 + box.y1) / 2 });
}
const one = (svg, name) => { const gs = groupsNamed(svg, name); assert.equal(gs.length, 1, 'one ' + name + ' group, found ' + gs.length); return gs[0]; };
// where the "scale" lies (its group is drawn in its own turned frame: its soft shadow on the earth says where)
function scaleOn(svg) {
  const m = /<ellipse cx="(-?[\d.]+)" cy="(-?[\d.]+)" rx="([\d.]+)" ry="([\d.]+)"/.exec(one(svg, 'scale'));
  return { cx: +m[1], cy: +m[2], rx: +m[3], ry: +m[4], flat: /scale\(1 0\.5\)/.test(one(svg, 'scale')) };
}
const tapRects = (svg) => svg.match(/<rect\b[^>]*class="pc-tap"[^>]*>/g) || [];
const tinyOf = (svg) => (svg.match(/<path d="[^"]+" data-print="tiny"\/>/g) || []).map((t) => boxOf(t));

test('chapter 5: chapters 2 to 4 keep their pile: every picture they draw here, with nobody in it, to the byte', () => {
  // sha1 of the markup (ids stripped) and the keep list, recorded from the chapter 4 build; one for each
  // different scene (camera, options, light), under the first frame that uses it
  const GOLD = {
    'ch02:f026': '1e6a5921e203', 'ch02:f027': 'b005eef3b539', 'ch02:f029': '845ccf6e905e', 'ch02:f044': '74d2885d2af9', 'ch02:f107': 'ac91d7408167',
    'ch03:f012': 'c63047ff02d2', 'ch03:f013': '8a2d37035c10', 'ch03:f090b': 'b0dcb8de36ed', 'ch03:f098b': '341a4b01d43c',
    'ch04:f019': '1e94e5f3c7bf', 'ch04:f020': '41f84ff93aba', 'ch04:f021': '27585873ad3a', 'ch04:f023': 'b67dba69e1d1', 'ch04:f024': '6d5e9748f9ce',
    'ch04:f025': 'ceaa3bd48401', 'ch04:f026': '78145d21f448', 'ch04:f028': '39bee1dc1967', 'ch04:f029a': '2a53b7ecfbf1',
    'ch04:f029b': 'bc81fc8891f2', 'ch04:f031': 'd53924a54c5f', 'ch04:f111': 'd3c4e0fc31a1'
  };
  const sha12 = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
  for (const [key, want] of Object.entries(GOLD)) {
    const [id, fid] = key.split(':'), sc = PC.story[id].frames[fid].scene;
    assert.equal(sc.set, 'pile', key);
    const fx = (sc.fx || []).filter((f) => ['morning', 'day', 'sunset', 'dusk', 'night'].includes(f));
    const r = art.render({ set: sc.set, cam: sc.cam, opts: sc.opts, cast: [], fx }, { look: LOOK });
    assert.equal(sha12(r.svg.replace(/\bpcs?[0-9a-z]+-/g, '') + JSON.stringify(r.keep)), want, key + ' (' + sc.cam + ' ' + JSON.stringify(sc.opts || {}) + '): drawn as it was');
  }
  // none of their frames asks for anything of chapter 5's, and none draws it: no prints, no swept earth, no Tap
  // target on the dug earth (chapter 4's Tap is the glint, and it is still the first thing a Tap would find)
  let n = 0, glints = 0;
  for (const id of ['ch02', 'ch03', 'ch04']) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'pile') continue;
    n++;
    assert.ok(!CH5_CAMS.includes(sc.cam), id + ' ' + fid + ': not chapter 5\'s camera');
    for (const k of CH5_OPTS) assert.ok(!(sc.opts && k in sc.opts), id + ' ' + fid + ': no ' + k);
    assert.ok(!(sc.cast || []).some((m) => m.at === 'behind'), id + ' ' + fid + ': nobody behind the back row');
    const svg = art.render(sc, { look: LOOK }).svg;
    for (const name of ['prints', 'swept']) assert.equal(groupsNamed(svg, name).length, 0, id + ' ' + fid + ': no ' + name);
    assert.ok(!/pc-tap|data-print/.test(svg), id + ' ' + fid + ': no Tap target, no prints');
    if (f.scratch && f.scratch.tap) { glints++; assert.ok(/<g data-art="glint">/.test(svg), id + ' ' + fid + ': the glitter Tap still finds its glint'); }
  }
  assert.ok(n >= 30 && glints >= 1, 'chapters 2 to 4 visit the pile: ' + n + ' frames, ' + glints + ' glitter Tap');
  // chapter 5's options off are nothing at all, on every camera, in pairs and in rows
  for (const cam of [...CAMS, ...CH4_CAMS]) for (const base of [{}, { pairs: 7, dug: true }, { rows: MORNING, dug: 'big', scale: true, glint: true }, { rows: NIGHT, scale: 'behind', dug: 'big' }]) {
    // (the `gap` camera with the "scale" behind the row is chapter 5's own state: it gains the Tap's target)
    assert.ok(same5(renderP(cam, Object.assign({ prints: false, swept: false }, base)).svg, renderP(cam, base).svg), cam + ' ' + JSON.stringify(base) + ': prints and swept off');
  }
  // a pile in pairs (chapters 2 and 3) takes neither: they belong to the rows
  for (const cam of CAMS) assert.ok(same5(renderP(cam, { pairs: 7, dug: true, prints: true, swept: true }).svg, renderP(cam, { pairs: 7, dug: true }).svg), cam + ': no prints and no sweeping on a pile of pairs');
  // and the spots chapters 2 to 4 stand on have not moved
  const A = art.sceneInfo('pile').anchors;
  assert.deepEqual([A.main['pile-left'], A.main.beside, A.low['pile-left'], A.rows.beside, A.gap['pile-right']].map((a) => [a.x, a.y, a.h]),
    [[300, 896, 258], [985, 856, 236], [180, 946, 396], [1474, 954, 320], [1400, 998, 430]]);
});

test('chapter 5: the text\'s notes name what the set has: four rows, `prints: true`, `swept: true`, a Tap target on the dug earth, an anchor behind the back row', () => {
  const md = fs.readFileSync(TEXT5, 'utf8').replace(/\s+/g, ' ');
  // (the names the notes fix, short enough to survive an editor's round on the words around them)
  for (const want of ['`rows: [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }]`', 'a `pc-tap` target on the dug earth', '`prints: true`', '`swept: true`', 'an anchor behind the back row', 'its close-up with tiny prints in it'])
    assert.ok(md.includes(want), 'the notes say: ' + want);
  const v = art.vocab.sets.pile, info = art.sceneInfo('pile');
  assert.ok(v.opts.rows.some((x) => JSON.stringify(x) === JSON.stringify(FOURTH)), 'the fourth morning\'s rows are in the vocabulary, by value');
  assert.deepEqual(v.opts.prints, [false, true]);
  assert.deepEqual(v.opts.swept, [false, true]);
  assert.equal(info.defaults.prints, false);
  assert.equal(info.defaults.swept, false);
  // the close-up: a camera of its own, the whole of its own composition, no anchors (a face is never in it)
  assert.ok(v.cams.includes('gap-close'));
  assert.equal(info.cams['gap-close'].comp, 'gapclose');
  assert.deepEqual([info.cams['gap-close'].x, info.cams['gap-close'].y, info.cams['gap-close'].w], [0, 0, 1600]);
  assert.deepEqual(info.anchors.gapclose, {}, 'gap-close: no anchors');
  // `behind`: in every composition that shows the rows; behind everyone (z), on the ground, facing left
  for (const comp of ['main', 'low', 'rows', 'gap']) {
    const a = info.anchors[comp].behind;
    assert.ok(a, comp + ': has `behind`');
    assert.equal(a.z, 'behind', comp + ': drawn behind everyone else');
    assert.equal(a.face, 'left', comp + ': he has come round from the right, his tail out behind him');
    assert.ok(!a.elev, comp + ': on the ground');
  }
  for (const comp of ['scale', 'through', 'mirror', 'gapclose']) assert.ok(!info.anchors[comp].behind, comp + ': no `behind`');
});

test('chapter 5: the fourth count: three full rows to walk along, lit a row at a time, the back row a dark band until she comes to it; then its gap of four where chapter 4\'s was', () => {
  // the Counts frame's own scene: the back row in shadow, however many rows are lit, whatever lies behind it
  for (let lit = 0; lit <= 3; lit++) {
    const r = renderP('rows', Object.assign({}, CH5, { back: 'shadow', lit }), [{ who: 'grizzled', at: 'beside', pose: 'sit', mood: 'sleepy' }, { who: 'player', at: 'pile-left', pose: 'walk' }]);
    checkRender(r, { cast: [1, 2] }, 'rows, shadow, lit ' + lit);
    assert.equal(groupsNamed(r.svg, 'row').length, 3, 'three full rows');
    assert.equal(groupsNamed(r.svg, 'band').length, 1, 'and the band');
    groupsNamed(r.svg, 'row').forEach((row) => assert.equal(pieces(row), 10, 'ten to a row'));
    assert.equal(groupsNamed(r.svg, 'row').filter((row) => /pcs-pulse/.test(row)).length, lit, lit + ' rows glow');
    assert.ok(!/pcs-pulse/.test(one(r.svg, 'band')), 'the band never glows');
    for (const name of ['dug', 'prints', 'swept', 'scale', 'glimmer', 'places']) assert.equal(groupsNamed(r.svg, name).length, 0, 'in the shade: no ' + name);
    assert.equal(tapRects(r.svg).length, 0);
  }
  // the front row lights first, then the second, then the third (the row nearest us is `data-row="0"`)
  const lit2 = groupsNamed(renderP('rows', Object.assign({}, CH5, { back: 'shadow', lit: 2 })).svg, 'row').filter((row) => /pcs-pulse/.test(row)).map((row) => +/data-row="(\d)"/.exec(row)[1]).sort();
  assert.deepEqual(lit2, [0, 1]);
  // the shadow is the same picture whatever the back row holds and whatever is behind it
  const band = renderP('rows', { rows: FOURTH, back: 'shadow' }).svg;
  for (const more of [{ dug: true }, { dug: 'big', scale: 'behind' }, { prints: true }, { swept: true }, { scale: true, glint: true }]) assert.ok(same5(renderP('rows', Object.assign({ rows: FOURTH, back: 'shadow' }, more)).svg, band), 'shadow hides ' + JSON.stringify(more));
  assert.ok(same5(renderP('rows', { rows: NIGHT, back: 'shadow' }).svg, band), 'and what the row holds');
  // she comes to it: thirty-six pieces, the back row three, four empty places, three
  for (const cam of ['rows', 'wide', 'low']) {
    const r = renderP(cam, CH5);
    const rows = groupsNamed(r.svg, 'row');
    assert.equal(rows.length, 4, cam + ': four rows');
    assert.equal(pieces(r.svg), 36, cam + ': forty laid out, four gone');
    const back = rows.find((row) => /data-row="3"/.test(row)), p = rowPieces(back);
    assert.equal(p.length, 6, cam + ': six left in the back row');
    const step = p[1].x - p[0].x;
    assert.ok(Math.abs((p[3].x - p[2].x) - 5 * step) < 1, cam + ': four empty places side by side, right in the middle');
    assert.equal((one(back, 'places').match(/<ellipse/g) || []).length, 8, cam + ': four pressed places (two ellipses each)');
  }
  // "in the same places as chapter 4's": the gap camera's back row is chapter 4's back row, place for place
  const now = rowPieces(one(renderP('gap', CH5).svg, 'row')).map((q) => Math.round(q.x)), then = rowPieces(one(renderP('gap', { rows: MORNING, dug: 'big' }).svg, 'row')).map((q) => Math.round(q.x));
  assert.deepEqual(now, then);
  // the "scale" a small glint on the bare earth behind it, the dug earth behind that
  for (const cam of ['rows', 'gap']) {
    const r = renderP(cam, CH5), dug = boxOf(one(r.svg, 'dug')), row = groupsNamed(r.svg, 'row').map((x) => rowPieces(x)).sort((a, b) => a[0].y - b[0].y)[0];
    const sc = scaleOn(r.svg);
    assert.ok(sc.flat && sc.cy < row[0].y - 60 * row[0].k && sc.cy > dug.y1 - 6, cam + ': the "scale" lies flat on the bare earth between the back row and the dug earth');
    assert.equal(groupsNamed(r.svg, 'glimmer').length, 1, cam + ': it glimmers');
    assert.equal(groupsNamed(r.svg, 'glint').length, 0, cam + ': no glitter Tap on it any more');
    assert.ok(dug.y1 < row[0].y - 60 * row[0].k, cam + ': the earth is behind the back row');
    assert.ok(Math.abs(dug.cx - 800) < 30, cam + ': right behind the gap');
  }
});

test('chapter 5: the noticing cat\'s Tap: on the `gap` camera the fresh dug earth carries an unpainted target (class pc-tap), its box the heap; nothing else does', () => {
  const r = renderP('gap', CH5, [{ who: 'player', at: 'pile-left', pose: 'sit' }, { who: 'tallyheart', at: 'pile-right', pose: 'sit' }]);
  const rects = tapRects(r.svg);
  assert.equal(rects.length, 1, 'one target');
  assert.equal((r.svg.match(/pc-tap/g) || []).length, 1, 'and nothing else of that class in the panel');
  const t = rects[0];
  // unpainted: the page draws the glow on its box (docs/build.md, "One-tap frames")
  assert.ok(/ fill="none"/.test(t) && / pointer-events="none"/.test(t) && !/stroke|opacity|style/.test(t), 'unpainted: ' + t);
  assert.ok(/data-art="dug-tap"/.test(t));
  const tb = boxOf(t), dug = boxOf(one(r.svg, 'dug')), row = rowPieces(one(r.svg, 'row'));
  // its box is the heap: inside the earth as drawn, most of it, and its middle the earth's
  assert.ok(tb.x0 >= dug.x0 - 12 && tb.x1 <= dug.x1 + 12 && tb.y0 >= dug.y0 - 12 && tb.y1 <= dug.y1 + 12, 'on the earth: ' + JSON.stringify([tb, dug]));
  assert.ok(tb.w > dug.w * 0.7 && tb.h > dug.h * 0.6, 'the whole heap, a generous target');
  assert.ok(Math.abs(tb.cx - dug.cx) < dug.w * 0.06 && Math.abs(tb.cy - dug.cy) < dug.h * 0.25, 'its middle is the heap\'s');
  assert.ok(tb.w / 1600 > 0.3 && tb.h / 1000 > 0.1, 'big in the panel: ' + tb.w.toFixed(0) + ' by ' + tb.h.toFixed(0));
  // behind the gap, clear of the row, of the "scale", and of the cats sitting in front
  assert.ok(tb.y1 < row[0].y - 66 * row[0].k - 30, 'above the row\'s pieces');
  const sc = scaleOn(r.svg);
  assert.ok(sc.cy - sc.ry > tb.y1 - 4, 'the "scale" lies in front of it, not on it');
  r.heads.forEach((h) => assert.ok(h.y / 100 * 1000 > tb.y1 + 80, 'the cats\' faces are well below it'));
  // the lettering keeps off it: one of the keep boxes is the target
  assert.ok(r.keep.some((k) => Math.abs(k.x * 16 - (tb.x0 - 4)) < 2 && Math.abs(k.y * 10 - (tb.y0 - 4)) < 2 && Math.abs(k.w * 16 - (tb.w + 8)) < 3), 'the dug earth is in keep: ' + JSON.stringify(r.keep));
  // a bigger heap, a bigger target
  const big = boxOf(tapRects(renderP('gap', Object.assign({}, CH5, { dug: 'big' })).svg)[0]);
  assert.ok(big.w > tb.w * 1.15 && big.h > tb.h * 1.1, 'dug: \'big\' has it too');
  // only the fresh earth, only once the "scale" lies behind the row, only on this camera
  const no = (cam, opts, why) => assert.equal(tapRects(renderP(cam, opts).svg).length, 0, why);
  no('gap', Object.assign({}, CH5, { prints: true }), 'not once the prints are showing (the Tap has been made)');
  no('gap', Object.assign({}, CH5, { swept: true }), 'not on the swept earth');
  no('gap', Object.assign({}, CH5, { back: 'shadow' }), 'not in the shade');
  no('gap', { rows: FOURTH, scale: 'behind' }, 'not without dug earth');
  no('gap', { rows: MORNING, dug: 'big' }, 'not in chapter 4\'s gap (no "scale" behind the row)');
  no('gap', { rows: MORNING, dug: 'big', scale: true, glint: true }, 'not beside chapter 4\'s glint');
  for (const cam of ['rows', 'wide', 'low', 'close', 'gap-close', 'scale', 'through', 'mirror']) no(cam, CH5, cam + ': the Tap is the gap camera\'s');
  // every light: the same target in the same place
  for (const fx of [['morning'], ['day'], ['sunset'], ['night']]) assert.deepEqual(tapRects(renderP('gap', CH5, [], fx).svg), rects, 'the same at ' + fx);
});

test('chapter 5: prints: true: tiny prints in the dug earth: a short line of them in the loose earth at the heap\'s foot, each half a cat\'s paw; big enough to read in the close-up', () => {
  const info = art.sceneInfo('pile');
  const gap = renderP('gap', Object.assign({}, CH5, { prints: true })), close = renderP('gap-close', Object.assign({}, CH5, { prints: true }));
  for (const [cam, r] of [['gap', gap], ['gap-close', close]]) {
    checkRender(r, { cast: [] }, cam + ' prints');
    const group = one(r.svg, 'prints'), dug = boxOf(one(r.svg, 'dug')), P = tinyOf(r.svg);
    assert.equal(groupsNamed(r.svg, 'dug').length, 1, cam + ': the heap is still there');
    assert.ok(P.length >= 3 && P.length <= 7, cam + ': a short line of prints: ' + P.length);
    assert.equal((group.match(/data-print="tiny"/g) || []).length, P.length, cam + ': all in the prints group');
    // each a small pad and four toes
    for (const t of group.match(/<path d="[^"]+" data-print="tiny"\/>/g)) assert.equal((t.match(/M/g) || []).length, 5, cam + ': a pad and four toes');
    // in a line across the earth, left to right, left foot and right taking turns, all much the same size
    for (let i = 1; i < P.length; i++) assert.ok(P[i].cx > P[i - 1].cx + P[0].w * 1.5, cam + ': a line, each print clear of the last');
    const mid = P.reduce((a, q) => a + q.cy, 0) / P.length;
    for (let i = 2; i < P.length; i++) assert.ok((P[i].cy - P[i - 1].cy) * (P[i - 1].cy - P[i - 2].cy) < 0, cam + ': the feet take turns');
    for (const q of P) assert.ok(Math.abs(q.w - P[0].w) < P[0].w * 0.25 && Math.abs(q.cy - mid) < P[0].w, cam + ': one small animal\'s');
    // in the dug earth: within its width, at its foot (the loose earth spilled forward), never up on the lumps' tops
    for (const q of P) assert.ok(q.x0 > dug.x0 && q.x1 < dug.x1 && q.cy > dug.cy && q.y1 < dug.y1 + P[0].w * 1.2, cam + ': in the earth: ' + JSON.stringify([q, dug]));
    // kept clear of the lettering: a keep box holds the whole line
    const world = (k) => ({ x0: k.x * 16, y0: k.y * 10, x1: (k.x + k.w) * 16, y1: (k.y + k.h) * 10 });
    assert.ok(r.keep.map(world).some((k) => k.x0 < P[0].x0 && k.x1 > P[P.length - 1].x1 && k.y0 < Math.min(...P.map((q) => q.y0)) + 1 && k.y1 > Math.max(...P.map((q) => q.y1)) - 1), cam + ': the prints are in keep');
    // pressed dark into paler earth: no claws, no pads of a cat's size, nothing of the animal
    assert.ok(!/data-paw|data-claw/.test(r.svg), cam + ': prints only');
    assert.equal(tapRects(r.svg).length, 0, cam + ': nothing to tap');
  }
  // "Each is half the size of yours": a print is about half a cat's paw at that depth (a sitting cat's paw is
  // near an eighth of its height); in the close-up they are big enough to see what they are
  const G = tinyOf(gap.svg), C = tinyOf(close.svg), tom = info.anchors.gap.behind;
  assert.ok(G[0].w > tom.h * 0.045 && G[0].w < tom.h * 0.09, 'gap: tiny beside a cat: ' + G[0].w.toFixed(1) + ' against a cat ' + tom.h + ' high');
  assert.ok(C[0].w > 40 && C[0].w / 1600 > 0.025 && C[0].w < 80, 'gap-close: readable: ' + C[0].w.toFixed(1));
  assert.ok(C[0].w > G[0].w * 2.5, 'the close-up is close');
  // the same earth from every camera that shows the rows; smaller further off
  for (const cam of ROWS_CAMS5) {
    const r = renderP(cam, Object.assign({}, CH5, { prints: true }));
    checkRender(r, { cast: [] }, cam + ' prints');
    assert.equal(groupsNamed(r.svg, 'prints').length, 1, cam + ': prints');
    assert.ok(tinyOf(r.svg)[0].w <= G[0].w + 0.01, cam + ': never bigger than on the gap camera');
  }
  // `prints` says the earth is there, with or without `dug`; `swept` takes the prints away; the shade hides them
  assert.equal(groupsNamed(renderP('gap', { rows: FOURTH, scale: 'behind', prints: true }).svg, 'dug').length, 1, 'prints draw the earth they are in');
  assert.ok(same5(renderP('gap', { rows: FOURTH, scale: 'behind', prints: true }).svg, gap.svg), 'the same earth as `dug: true`');
  const both = renderP('gap', Object.assign({}, CH5, { prints: true, swept: true })).svg;
  assert.equal(groupsNamed(both, 'prints').length + tinyOf(both).length, 0, 'swept: the prints are gone');
  assert.equal(groupsNamed(renderP('gap', Object.assign({}, CH5, { prints: true, back: 'shadow' })).svg, 'prints').length, 0, 'in the shade: no prints');
  // odd values are not prints
  for (const odd of ['yes', 1, null]) assert.ok(same5(renderP('gap', Object.assign({}, CH5, { prints: odd })).svg, renderP('gap', CH5).svg), 'prints: ' + JSON.stringify(odd));
});

test('chapter 5: swept: true: the same earth a panel later, swept flat by a tail: no heap, no prints, long side-to-side strokes', () => {
  for (const cam of [...ROWS_CAMS5, 'gap-close']) {
    const fresh = renderP(cam, CH5), r = renderP(cam, Object.assign({}, CH5, { swept: true }));
    checkRender(r, { cast: [] }, cam + ' swept');
    assert.equal(groupsNamed(r.svg, 'dug').length, 0, cam + ': no heap');
    assert.equal(groupsNamed(r.svg, 'prints').length, 0, cam + ': no prints');
    const sw = boxOf(one(r.svg, 'swept')), dug = boxOf(one(fresh.svg, 'dug'));
    // the same place, about as wide, and flat: lower, and its top well below where the heap's top was
    assert.ok(Math.abs(sw.cx - dug.cx) < dug.w * 0.08, cam + ': the same earth');
    assert.ok(sw.w > dug.w * 0.75 && sw.w < dug.w * 1.3, cam + ': as wide: ' + sw.w.toFixed(0) + ' vs ' + dug.w.toFixed(0));
    assert.ok(sw.h < dug.h * 0.72, cam + ': flat: ' + sw.h.toFixed(0) + ' vs ' + dug.h.toFixed(0));
    assert.ok(sw.y0 > dug.y0 + dug.h * 0.25, cam + ': the heap is gone from the top down');
    assert.ok(Math.abs(sw.y1 - dug.y1) < dug.h * 0.3, cam + ': it lies where the heap stood');
    assert.equal(tapRects(r.svg).length, 0, cam + ': nothing to tap');
  }
  // the strokes of a tail: several long arcs, each most of the patch wide, side to side
  const sv = one(renderP('gap', Object.assign({}, CH5, { swept: true })).svg, 'swept'), box = boxOf(sv);
  const arcs = (/<path d="((?:M[-\d. ]+Q[-\d. ]+)+)" fill="none"/.exec(sv) || [])[1].split('M').filter(Boolean).map((a) => boxOf(' d="M' + a + '"'));
  assert.ok(arcs.length >= 5, 'five strokes or more: ' + arcs.length);
  for (const a of arcs) assert.ok(a.w > box.w * 0.45 && a.h < a.w * 0.12, 'a long sideways stroke: ' + a.w.toFixed(0) + ' by ' + a.h.toFixed(0));
  // swept is swept, whatever `dug` says, and with no `dug` at all
  assert.ok(same5(renderP('gap', { rows: FOURTH, scale: 'behind', swept: true }).svg, renderP('gap', Object.assign({}, CH5, { swept: true })).svg), 'the same with or without `dug`');
  assert.equal(groupsNamed(renderP('gap', Object.assign({}, CH5, { swept: true, back: 'shadow' })).svg, 'swept').length, 0, 'in the shade: nothing');
  for (const odd of ['yes', 1, null]) assert.ok(same5(renderP('gap', Object.assign({}, CH5, { swept: odd })).svg, renderP('gap', CH5).svg), 'swept: ' + JSON.stringify(odd));
});

test('chapter 5: `gap-close`: the dug earth close, from the gap: the heap across the panel, the pressed places along the bottom edge, the "scale" beside it; no face in it', () => {
  const cast = [{ who: 'player', at: 'pile-left' }, { who: 'grizzled', at: 'behind' }, { who: 'tallyheart' }];
  for (const opts of [{}, CH5, Object.assign({}, CH5, { prints: true }), Object.assign({}, CH5, { swept: true }), { rows: FOURTH, dug: 'big', scale: 'behind', prints: true }, { pairs: 7 }, { rows: FOURTH, back: 'shadow' }]) {
    for (const fx of [['morning'], ['day'], ['sunset'], ['dusk'], ['night'], art.vocab.fx.slice()]) {
      const scene = { set: 'pile', cam: 'gap-close', opts, cast, fx }, r = art.render(scene, { look: LOOK });
      checkRender(r, scene, 'gap-close ' + JSON.stringify(opts) + ' ' + fx.join('+'));
      assert.deepEqual(r.heads, [null, null, null], 'no cast in the close-up');
    }
  }
  // the camera is on the earth whatever the options say (as the "scale" close-ups are on the "scale")
  for (const opts of [{}, { pairs: 7 }, { rows: FOURTH, back: 'shadow' }, { rows: MORNING }]) assert.equal(groupsNamed(renderP('gap-close', opts).svg, 'dug').length, 1, JSON.stringify(opts));
  const r = renderP('gap-close', CH5), dug = boxOf(one(r.svg, 'dug'));
  assert.ok(dug.w / 1600 > 0.7 && dug.h / 1000 > 0.3, 'the heap fills the panel: ' + dug.w.toFixed(0) + ' by ' + dug.h.toFixed(0));
  assert.ok(dug.x0 > -60 && dug.x1 < 1660 && dug.y0 > 150 && dug.y1 < 720, 'and is whole, room above it for a caption and below it for the earth in front');
  assert.ok(Math.abs(dug.cx - 800) < 40, 'in the middle');
  // three times the gap camera's, near enough: it is that earth, closer
  const far = boxOf(one(renderP('gap', CH5).svg, 'dug'));
  assert.ok(dug.w > far.w * 1.8 && dug.w < far.w * 2.6, 'about twice as big as on the gap camera: ' + (dug.w / far.w).toFixed(2));
  // the gap's pressed places along the bottom edge (where the four pieces lay), half out of the panel
  const marks = (r.svg.match(/<ellipse cx="[\d.]+" cy="(9[5-9]\d|10\d\d)[\d.]*" rx="[\d.]+" ry="[\d.]+" fill="#[0-9a-f]{6}" opacity="0.6"\/>/g) || []);
  assert.equal(marks.length, 4, 'four empty places');
  // the "scale" beside it when it lies behind the row: flat, a glimmer on it, kept clear; else no "scale" here
  const sc = scaleOn(r.svg);
  assert.equal(groupsNamed(r.svg, 'glimmer').length, 1);
  assert.ok(sc.cx > dug.cx + dug.w * 0.3 && sc.cy > dug.cy && sc.cx + sc.rx < 1600 && sc.cy < 900, 'beside the heap, in front of it, at the right: ' + JSON.stringify(sc));
  assert.ok(sc.flat, 'lying flat');
  for (const opts of [{ rows: FOURTH, dug: true }, { rows: FOURTH, dug: true, scale: true }, {}]) assert.equal(groupsNamed(renderP('gap-close', opts).svg, 'scale').length, 0, 'no "scale" unless it is behind the row: ' + JSON.stringify(opts));
  assert.equal(groupsNamed(r.svg, 'glint').length, 0, 'never a glitter Tap');
  // keep: the "scale", and the prints when they show
  assert.equal(r.keep.length, 1);
  assert.equal(renderP('gap-close', Object.assign({}, CH5, { prints: true })).keep.length, 2);
  // no rain under the brambles this close; the same picture every time; her look changes nothing
  assert.ok(/clip-path/.test(renderP('gap-close', CH5, [], ['rain']).svg));
  assert.ok(same5(renderP('gap-close', Object.assign({}, CH5, { prints: true })).svg, renderP('gap-close', Object.assign({}, CH5, { prints: true })).svg), 'deterministic');
  assert.ok(same5(renderP('gap-close', CH5, [], ['morning'], { fur: 'black', sex: 'she' }).svg, r.svg), 'nobody is in it');
  // only classes PC.art.css defines; no SMIL
  for (const m of renderP('gap-close', Object.assign({}, CH5, { prints: true }), [], art.vocab.fx).svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => {
    if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') assert.ok(art.css.includes('.' + c + '{'), 'css defines .' + c);
  });
});

test('chapter 5: `behind`: the old tom has stomped round to the back: behind the row, in front of the dug earth, his tail side toward it; behind everyone, and out of the depth sums', () => {
  const info = art.sceneInfo('pile');
  // the gap camera: between the row's gap and the earth, nothing of the row over him
  {
    const A = info.anchors.gap, a = A.behind, swept = renderP('gap', Object.assign({}, CH5, { swept: true })), row = rowPieces(one(swept.svg, 'row')), earth = boxOf(one(swept.svg, 'swept'));
    const rowTop = row[0].y - 66 * row[0].k, sc = scaleOn(swept.svg);
    assert.ok(a.y < rowTop - 20, 'his feet are above the row\'s pieces: he is behind it, whole');
    assert.ok(a.y > earth.cy && a.y < earth.y1 + a.h * 0.35, 'and at the near edge of the earth: ' + a.y + ' vs ' + JSON.stringify(earth));
    assert.ok(a.x > earth.x0 + 60 && a.x < earth.x1 - 60, 'on the earth\'s span: his tail lies out over it');
    assert.ok(a.x > row[2].x && a.x < row[3].x, 'behind the hole, where he can be seen');
    // facing left, his tail goes out to the right: over the earth's middle, and he is clear of the "scale"
    assert.ok(a.x < earth.cx, 'left of the earth\'s middle, so the tail behind him sweeps across it');
    assert.ok(a.x + a.h * 0.42 < sc.cx - sc.rx || a.x - a.h * 0.42 > sc.cx + sc.rx, 'never standing on the "scale"');
    // further off than the cats in front, so smaller: but the same cat, by the floor's own perspective
    // (everything on it shrinks toward y = -190, as the rows do: a cat at y is (y + 190) big)
    assert.ok(a.h < A['pile-left'].h * 0.62 && a.h > A['pile-left'].h * 0.45, 'smaller, behind: ' + a.h);
    const true0 = (q) => q.h / (q.y + 190);
    assert.ok(Math.abs(true0(a) / true0(A['pile-left']) - 1) < 0.1, 'as big as the cats in front, at his own depth: ' + (true0(a) / true0(A['pile-left'])).toFixed(2));
    for (const pose of ['stand', 'walk', 'sit']) {
      const r = renderP('gap', Object.assign({}, CH5, { swept: true }), [{ who: 'grizzled', at: 'behind', pose, mood: 'shout' }, { who: 'player', at: 'pile-left', pose: 'sit' }, { who: 'tallyheart', at: 'pile-right', pose: 'sit' }]);
      checkRender(r, { cast: [1, 2, 3] }, 'gap, ' + pose + ' behind');
      const h = r.heads[0];
      assert.ok(h && h.x > 20 && h.x < 80 && h.y > 12 && h.y < 45, pose + ': his head is in the upper middle of the panel, room over it for his balloon: ' + JSON.stringify(h));
      assert.ok(h.y < r.heads[1].y - 20 && h.y < r.heads[2].y - 20, pose + ': above the two in front');
    }
  }
  // the other cameras that show the rows: behind the back row of the fourth morning, in the panel
  for (const cam of ['rows', 'wide', 'low', 'close']) {
    const comp = info.cams[cam].comp, a = info.anchors[comp].behind, box = info.cams[cam];
    const r = renderP(cam, Object.assign({}, CH5, { swept: true }), [{ who: 'grizzled', at: 'behind', pose: 'stand' }, { who: 'player', at: 'pile-left', pose: 'sit' }]);
    checkRender(r, { cast: [1, 2] }, cam + ', behind');
    const rows = groupsNamed(r.svg, 'row').map((x) => rowPieces(x)), back = rows.sort((p, q) => p[0].y - q[0].y)[0];
    assert.ok(a.y <= back[0].y - 60 * back[0].k * 0.8, cam + ': behind the back row: ' + a.y + ' vs ' + back[0].y);
    assert.ok(a.x > back[0].x && a.x < back[back.length - 1].x, cam + ': behind the row, not beside it');
    assert.ok(a.x > box.x && a.x < box.x + box.w && a.y > box.y && a.y - a.h > box.y, cam + ': whole, in the panel');
    assert.ok(r.heads[0], cam + ': in sight');
    const front = info.anchors[comp]['pile-left'];
    assert.ok(a.h < front.h * 0.72, cam + ': smaller than the cats in front');
  }
  // drawn behind everyone, whatever the cast's order (z: 'behind'): his drawing comes first in the panel
  {
    const a = info.anchors.gap.behind, f = info.anchors.gap['pile-left'];
    const svg = renderP('gap', CH5, [{ who: 'player', at: 'pile-left', pose: 'sit' }, { who: 'grizzled', at: 'behind', pose: 'stand' }]).svg;
    const tom = svg.indexOf('translate(' + a.x + ' ' + a.y + ') scale('), her = svg.indexOf('translate(' + f.x + ' ' + f.y + ') scale(');
    assert.ok(tom > 0 && her > 0 && tom < her, 'the tom, then her');
  }
  // out of the depth sums: a spot of its own is sized from the old anchors only (chapter 3's old tom by the pile, f090b)
  {
    const r0 = art.render({ set: 'pile', cam: 'low', opts: {}, cast: [{ who: 'clancat', variant: 2, pose: 'sit', at: 'pile-left' }, { who: 'clancat', variant: 2, pose: 'sit', at: { x: 760, y: 1000 } }], fx: ['morning'] }, { look: LOOK });
    const L = Object.entries(info.anchors.low).filter(([k]) => k !== 'behind').map(([, a]) => a), mx = L.reduce((s, a) => s + a.y, 0) / L.length, my = L.reduce((s, a) => s + a.h, 0) / L.length;
    const b = L.reduce((s, a) => s + (a.y - mx) * (a.h - my), 0) / L.reduce((s, a) => s + (a.y - mx) * (a.y - mx), 0), want = my + b * (1000 - mx);
    assert.ok(Math.abs(r0.heads[1].r / r0.heads[0].r - want / info.anchors.low['pile-left'].h) < 0.004, 'a spot of its own is as big as it was: ' + (r0.heads[1].r / r0.heads[0].r).toFixed(4) + ' vs ' + (want / info.anchors.low['pile-left'].h).toFixed(4));
  }
});

test('chapter 5: the morning\'s panels at the pile render, everyone in sight, the rows and the earth kept clear of the lettering', () => {
  // the text's screens on this set, as a story might stage them (the cast extras are the characters' own)
  const TOM = { who: 'grizzled', at: 'beside', pose: 'sit', mood: 'sleepy', asleep: true, snail: true };
  const SHADE = Object.assign({}, CH5, { back: 'shadow' });
  const panels = [
    ['rows', SHADE, [TOM]],
    ['rows', SHADE, [Object.assign({}, TOM, { mood: 'shout', asleep: false, snail: 'in' }), { who: 'tallyheart', at: 'pile-right', pose: 'sit', mood: 'stern' }, { who: 'player', at: 'pile-left', pose: 'sit', mood: 'happy' }]],
    ['rows', Object.assign({}, SHADE, { lit: 3 }), [TOM, { who: 'player', at: 'pile-left', pose: 'walk' }]],
    ['gap', CH5, [{ who: 'player', at: 'pile-left', pose: 'sit', mood: 'wonder' }, { who: 'tallyheart', at: 'pile-right', pose: 'sit' }]],
    ['gap-close', Object.assign({}, CH5, { prints: true }), []],
    ['gap', Object.assign({}, CH5, { swept: true }), [{ who: 'grizzled', at: 'behind', pose: 'stand', mood: 'shout' }, { who: 'player', at: 'pile-left', pose: 'sit' }, { who: 'tallyheart', at: 'pile-right', pose: 'sit', mood: 'stern' }]],
    ['wide', Object.assign({}, CH5, { swept: true }), [{ who: 'glintstar', at: 'fountain-edge', pose: 'sit', mood: 'stern' }, { who: 'snorter', at: 'crowd-3', pose: 'sit', mood: 'proud' }, { who: 'player', at: 'pile-left', pose: 'sit' }, { who: 'tallyheart', at: 'pile-right', pose: 'sit' }]],
    ['low', Object.assign({}, CH5, { swept: true }), [{ who: 'tallyheart', at: 'pile-right', pose: 'sit', mood: 'stern' }, { who: 'grizzled', at: 'beside', pose: 'sit' }, { who: 'player', at: 'pile-left', pose: 'sit' }]]
  ];
  for (const [cam, opts, cast] of panels) {
    const scene = { set: 'pile', cam, opts, cast, fx: ['morning'] }, r = art.render(scene, { look: LOOK });
    checkRender(r, scene, cam + ' ' + JSON.stringify(opts));
    r.heads.forEach((h, i) => assert.ok(h && h.x > 2 && h.x < 98 && h.y > 4 && h.y < 96, cam + ': ' + cast[i].who + ' at ' + cast[i].at + ' in the panel: ' + JSON.stringify(h)));
    assert.ok(r.keep.length >= 1, cam + ': something is kept clear');
  }
  // every light and effect on the new states, on every camera that shows them
  for (const cam of [...ROWS_CAMS5, 'gap-close']) for (const more of [{ prints: true }, { swept: true }, {}]) {
    const every = { set: 'pile', cam, opts: Object.assign({}, CH5, more), cast: [{ who: 'grizzled', at: 'behind', pose: 'stand' }], fx: art.vocab.fx.slice() };
    checkRender(art.render(every, { look: LOOK }), every, cam + ' ' + JSON.stringify(more) + ' every fx');
    for (const f of ['sunset', 'night']) checkRender(renderP(cam, Object.assign({}, CH5, more), [], [f]), { cast: [] }, cam + ' ' + f);
  }
});

test('chapter 5: whatever chapter 5 puts at the pile renders, uses the vocabulary by value, and its Tap at the gap finds the dug earth (once the chapter is written)', (t) => {
  const ch = PC.story && PC.story.ch05;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'pile' && f.board !== 'STUB.') : [];
  if (!frames.length) { t.diagnostic('chapter 5 has no frames at the pile yet'); return; }
  const v = art.vocab.sets.pile, eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  let taps = 0;
  for (const [id, f] of frames) {
    const sc = f.scene;
    assert.ok(v.cams.includes(sc.cam), id + ': camera ' + sc.cam);
    for (const [k, val] of Object.entries(sc.opts || {})) {
      assert.ok(Object.prototype.hasOwnProperty.call(v.opts, k), id + ': option ' + k);
      if (v.opts[k] === 'number') assert.ok(Number.isInteger(val) && val >= 0 && val <= 10, id + ': ' + k + '=' + val);
      else assert.ok(v.opts[k].some((x) => eq(x, val)), id + ': ' + k + '=' + JSON.stringify(val));
    }
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc, 'ch05 ' + id);
    (sc.cast || []).forEach((m, i) => { if (typeof m.at === 'string') assert.ok(r.heads[i], id + ': ' + m.who + ' at ' + m.at + ' is in sight of the ' + sc.cam + ' camera'); });
    // a frame in the shade draws no gap, no dug earth and no "scale"
    if (sc.opts && sc.opts.back === 'shadow' && sc.cam !== 'gap-close') for (const name of ['places', 'dug', 'prints', 'swept', 'scale']) assert.equal(groupsNamed(r.svg, name).length, 0, id + ': no ' + name);
    // a one-tap frame whose scene is the gap is the noticing cat's: its scene carries the target, and exactly one
    if (f.scratch && f.scratch.tap && sc.cam === 'gap') { taps++; assert.equal(tapRects(r.svg).length, 1, id + ': the Tap has its target (the gap camera, dug earth, scale: \'behind\', no prints yet)'); }
    // the prints are gone once the earth is swept
    if (sc.opts && sc.opts.swept) assert.equal(tinyOf(r.svg).length, 0, id + ': swept');
  }
  t.diagnostic(frames.length + ' frames at the pile, ' + taps + ' Tap at the gap');
});

// ================================================================ chapter 6: the moon over the pile
// docs/chapters/06-the-snake-in-the-stones.spec.md, section 4 ("Places", the pile row): `moon: 6`

const SPEC6 = path.join(ROOT, 'docs/chapters/06-the-snake-in-the-stones.spec.md');
// the moon in a picture: its age, its middle and radius (the outline of its lit part, in its own frame)
function moonsOf(svg) {
  const out = [], re = /<g data-prop="waxing-moon" data-age="([\d.]+)">/g;
  let m;
  while ((m = re.exec(svg))) {
    const rest = svg.slice(m.index, m.index + 1200);
    const t = /transform="translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)"/.exec(rest), d = /<path d="M0 (-[\d.]+)A([\d.]+) [\d.]+ 0 0 1 0 [\d.]+A([\d.]+) /.exec(rest);
    out.push({ age: +m[1], x: +t[1], y: +t[2], r: +d[2], inner: +d[3] });
  }
  return out;
}
const NIGHT_ROWS = { rows: NIGHT, scale: 'behind', dug: 'big' };

test('chapter 6: the spec asks for `moon: 6` on `wide` and `low`, declared a number as `pairs` is, off by default', () => {
  const md = fs.readFileSync(SPEC6, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['**`moon: 6`**', "in `wide`'s sky and in `low`'s patch of sky through the arch", "Declared in `opts` as `'number'` (default `false`, off), as `pairs` is"]) assert.ok(md.includes(want), 'the spec says: ' + want);
  const v = art.vocab.sets.pile, info = art.sceneInfo('pile');
  assert.equal(v.opts.moon, 'number', 'a number, as `pairs` is: chapter 7\'s `moon: 7` needs no art change');
  assert.equal(v.opts.pairs, 'number');
  assert.equal(info.defaults.moon, false, 'off');
});

test('chapter 6: chapters 2 to 5 have no moon over the pile, and anything but a number of evenings draws none', () => {
  let n = 0;
  for (const id of ['ch02', 'ch03', 'ch04', 'ch05']) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'pile') continue;
    n++;
    assert.ok(!(sc.opts && 'moon' in sc.opts), id + ' ' + fid + ': no moon');
    assert.equal(moonsOf(art.render(sc, { look: LOOK }).svg).length, 0, id + ' ' + fid + ': none drawn');
  }
  assert.ok(n >= 40, 'chapters 2 to 5 visit the pile: ' + n);
  for (const cam of ['wide', 'low']) for (const fx of [['night'], ['dusk'], ['sunset']]) {
    const plain = renderP(cam, NIGHT_ROWS, [], fx).svg;
    for (const off of [false, 0, null, true, '6', -3, NaN, 'moon']) {
      assert.equal(strip(renderP(cam, Object.assign({ moon: off }, NIGHT_ROWS), [], fx).svg), strip(plain), cam + ' ' + fx[0] + ': moon ' + JSON.stringify(off) + ' draws nothing');
    }
  }
});

test('chapter 6: `moon: 6` at night: the sixth evening\'s moon, the kit\'s waxing crescent, in `wide`\'s open sky and in `low`\'s patch of sky through the arch; the lettering keeps off it', () => {
  // wide: over the towers in the open sky, clear of the hedge ring and the brambles below it
  const w = renderP('wide', Object.assign({ moon: 6 }, NIGHT_ROWS), [{ who: 'tallyheart', at: 'behind' }, { who: 'player', at: 'pile-left' }], ['night']);
  checkRender(w, { cast: [{}, {}] }, 'wide at night with the moon');
  const mw = moonsOf(w.svg);
  assert.equal(mw.length, 1, 'one moon');
  assert.equal(mw[0].age, 6, 'six evenings old');
  assert.ok(mw[0].y + mw[0].r < 240 && mw[0].y - mw[0].r > 0, 'high in the sky, whole: ' + JSON.stringify(mw[0]));
  assert.ok(mw[0].x - mw[0].r > 680 && mw[0].x + mw[0].r < 860, 'in the open sky between the towers there');
  assert.ok((w.keep || []).some((k) => k.x <= (mw[0].x - mw[0].r) / 16 && k.x + k.w >= (mw[0].x + mw[0].r) / 16 && k.y <= (mw[0].y - mw[0].r) / 10), 'kept clear of the lettering');
  // the kit's own drawing: the same moon the den has, at the same age
  assert.ok(w.svg.includes('data-prop="waxing-moon" data-age="6"'));
  // low: in the patch of sky right of the canopy, above the towers there
  const l = renderP('low', Object.assign({ moon: 6 }, NIGHT_ROWS), [{ who: 'player', at: 'pile-left' }], ['night']);
  const ml = moonsOf(l.svg);
  assert.equal(ml.length, 1);
  assert.ok(ml[0].x - ml[0].r >= 1520 && ml[0].x + ml[0].r <= 1600 && ml[0].y + ml[0].r < 250, 'through the arch, at its right: ' + JSON.stringify(ml[0]));
  assert.ok(ml[0].r < mw[0].r, 'smaller, through the gap in the leaves');
  // the other cameras have no sky: no moon (`close` is `low` close: its box leaves that corner out)
  for (const cam of ['rows', 'gap', 'scale', 'through', 'mirror', 'gap-close']) assert.equal(moonsOf(renderP(cam, Object.assign({ moon: 6 }, NIGHT_ROWS), [], ['night']).svg).length, 0, cam + ': no sky, no moon');
  const c = renderP('close', Object.assign({ moon: 6 }, NIGHT_ROWS), [], ['night']), vb = /viewBox="([^"]+)"/.exec(c.svg)[1].split(' ').map(Number);
  moonsOf(c.svg).forEach((m) => assert.ok(m.x - m.r > vb[0] + vb[2] || m.y - m.r > vb[1] + vb[3], 'close: out of its box'));
  assert.ok(!(c.keep || []).some((k) => k.x > 90 && k.y < 30), 'and no keep for it there');
});

test('chapter 6: the moon at dusk and sunset if asked, never by day or in the morning; seven evenings old it is fatter and higher, with no change to the art', () => {
  for (const cam of ['wide', 'low']) {
    for (const fx of [['night'], ['dusk'], ['sunset']]) assert.equal(moonsOf(renderP(cam, { moon: 6 }, [], fx).svg).length, 1, cam + ' ' + fx[0]);
    for (const fx of [['day'], ['morning'], []]) assert.equal(moonsOf(renderP(cam, { moon: 6 }, [], fx).svg).length, 0, cam + ' ' + (fx[0] || 'by default (morning)'));
    const six = moonsOf(renderP(cam, { moon: 6 }, [], ['night']).svg)[0], seven = moonsOf(renderP(cam, { moon: 7 }, [], ['night']).svg)[0], five = moonsOf(renderP(cam, { moon: 5 }, [], ['night']).svg)[0];
    assert.equal(seven.age, 7);
    // the terminator: an ellipse narrower each evening toward the half moon, so the lit crescent fattens
    assert.ok(five.inner / five.r > six.inner / six.r && six.inner / six.r > seven.inner / seven.r, cam + ': fatter each evening: ' + [five, six, seven].map((m) => (m.inner / m.r).toFixed(2)).join(' > '));
    assert.ok(seven.r >= six.r && seven.y <= six.y, cam + ': a little bigger and higher');
  }
  // the same moon as over the den: the kit's waxingMoon at that age (chapter 5's `moon: 5`)
  const den = art.render({ set: 'den', cam: 'outside', opts: { moon: 6 }, cast: [], fx: ['dusk'] }, { look: LOOK }).svg;
  const dm = moonsOf(den)[0], pm = moonsOf(renderP('wide', { moon: 6 }, [], ['dusk']).svg)[0];
  assert.ok(dm && pm && Math.abs(dm.inner / dm.r - pm.inner / pm.r) < 0.01, 'the den\'s sixth-evening moon and the pile\'s are one shape');
  // every light and every option renders with it
  for (const cam of ['wide', 'low', 'close']) for (const fx of [['night'], ['dusk'], ['sunset'], ['day'], art.vocab.fx.slice()]) {
    const scene = { set: 'pile', cam, opts: { moon: 6, rows: NIGHT, dug: 'big', scale: 'behind' }, cast: [{ who: 'player', at: 'pile-left' }], fx };
    checkRender(art.render(scene, { look: LOOK }), scene, cam + ' ' + fx.join('+'));
  }
});

test('chapter 6: whatever chapter 6 puts at the pile renders, uses the vocabulary, and asks for the moon only on `wide` or `low` (once the chapter is written)', (t) => {
  const ch = PC.story && PC.story.ch06;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'pile' && f.board !== 'STUB.') : [];
  if (!frames.length) { t.diagnostic('chapter 6 has no frames at the pile yet'); return; }
  const v = art.vocab.sets.pile;
  let moons = 0;
  for (const [id, f] of frames) {
    const sc = f.scene;
    assert.ok(v.cams.includes(sc.cam), id + ': camera ' + sc.cam);
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc, 'ch06 ' + id);
    if (sc.opts && sc.opts.moon) {
      moons++;
      assert.ok(sc.cam === 'wide' || sc.cam === 'low', id + ': the moon is in the sky of `wide` or `low`');
      assert.equal(sc.opts.moon, 6, id + ': the sixth evening');
      assert.equal(moonsOf(r.svg).length, 1, id + ': and it is drawn');
    }
  }
  t.diagnostic(frames.length + ' frames at the pile, ' + moons + ' with the moon');
});

// ================================================================ chapter 7 (docs/chapters/07-the-counts-dont-lie.spec.md, section 4, the pile row)

const NIGHT7 = { rows: NIGHT, scale: 'behind', dug: 'big' };
const SPEC7 = path.join(ROOT, 'docs/chapters/07-the-counts-dont-lie.spec.md');
const tapsOf = (svg) => [...svg.matchAll(/<rect x="(-?[\d.]+)" y="(-?[\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="none" class="pc-tap" data-tap="(\w+)" pointer-events="none"\/>/g)]
  .map((m) => ({ x0: +m[1], y0: +m[2], x1: +m[1] + +m[3], y1: +m[2] + +m[4], name: m[5] }));
const mouthOf = (svg) => { const m = /<g data-art="mouth" data-box="([^"]+)"/.exec(svg); return m ? m[1].split(' ').map(Number) : null; };
const rootsOf = (svg) => { const m = /<g data-art="roots" data-lifted="(true|false)"/.exec(svg); return m ? m[1] === 'true' : null; };
// the box of a group's ellipses only (the pieces' soft shadows lie in world units; the pieces themselves are
// drawn in their own turned frames), and where the "scale" lies (its shadow on the earth) as a box
const ellBox = (markup) => boxOf((markup.match(/<ellipse\b[^>]*>/g) || []).join(''));
const scaleBox = (svg) => { const s = scaleOn(svg); return [s.cx - s.rx * 1.6, s.cy - s.rx * 1.1, s.cx + s.rx * 1.6, s.cy + s.ry * 2]; };
const meets7 = (p, q, pad) => p[0] < q[2] + (pad || 0) && p[2] > q[0] - (pad || 0) && p[1] < q[3] + (pad || 0) && p[3] > q[1] - (pad || 0);
// a keep area (percent of the panel) that holds this world box
const keeps = (r, b) => { const vb = viewBox(r.svg); return r.keep.some((k) => vb[0] + k.x / 100 * vb[2] <= b.x0 + 0.5 && vb[1] + k.y / 100 * vb[3] <= b.y0 + 0.5 && vb[0] + (k.x + k.w) / 100 * vb[2] >= b.x1 - 0.5 && vb[1] + (k.y + k.h) / 100 * vb[3] >= b.y1 - 0.5); };
// where a cast member lands at anchor `a` (cats.js's own boxes, at the size scenes.js gives it): [x0, y0, x1, y1]
function bodyAt(m, a) {
  const o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: m.facing || a.face || 'right' };
  if (m.variant) o.variant = m.variant;
  if (m.who === 'player') { o.look = LOOK; o.sex = LOOK.sex; }
  const ch = art.character(m.who, o), ref = art.character('clancat', { pose: 'sit', variant: 1 }).h, s = a.h * (m.size > 0 ? m.size : 1) / ref;
  const W = (b) => [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s];
  return { body: W(ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h }), head: W(ch.headBox) };
}

test('chapter 7: the spec names the pile\'s new cameras, anchors and options, and the set has them all, each declared (PC.art.vocab), every one off by default', () => {
  const md = fs.readFileSync(SPEC7, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['**Option `tap: \'none\' \\| \'back\' \\| \'roots\'`** (default `\'none\'`)', '**Camera `rear`**, a composition of its own (`comp: \'rear\'`', 'Anchors **`rear-1`**', '**`rear-2`**',
    '**`guard-1`**, **`guard-2`**, **`guard-3`**', '**Option `tunnel: true`** (default false; on `rear`)', '**Camera `hole`** (`comp: \'hole\'`)', 'Anchor **`brink`**', '**Option `tracks: true`** (default false; on `wide`, at dusk or sunset only)', '**Anchor `arch`** on `wide`'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  const v = art.vocab.sets.pile, info = art.sceneInfo('pile');
  for (const cam of CH7_CAMS) { assert.ok(v.cams.includes(cam), cam); assert.equal(info.cams[cam].comp, cam, cam + ': a composition of its own'); assert.deepEqual([info.cams[cam].x, info.cams[cam].y, info.cams[cam].w], [0, 0, 1600]); }
  for (const a of CH7_ANCHORS) assert.ok(v.anchors.includes(a), 'anchor ' + a);
  // (chapter 8 adds 'mouth' at the end, on purpose: spec section 4, the pile row)
  assert.deepEqual(v.opts.tap, ['none', 'back', 'roots', 'mouth']);
  assert.deepEqual(v.opts.tunnel, [false, true]);
  assert.deepEqual(v.opts.tracks, [false, true]);
  assert.equal(v.opts.moon, 'number', '`moon: 7` needs no change: a number');
  for (const cam of ['wide', 'low']) {
    const r = renderP(cam, Object.assign({ moon: 7 }, NIGHT7), [], ['dusk']);
    assert.equal((r.svg.match(/data-prop="waxing-moon" data-age="7"/g) || []).length, 1, cam + ': the seventh evening\'s moon at dusk');
  }
  assert.deepEqual([info.defaults.tap, info.defaults.tunnel, info.defaults.tracks], ['none', false, false], 'off by default');
  // (chapter 8 adds `poke` after them, on purpose)
  assert.deepEqual(Object.keys(info.anchors.rear), ['rear-1', 'rear-2', 'guard-1', 'guard-2', 'guard-3', 'poke']);
  assert.deepEqual(Object.keys(info.anchors.hole), ['brink']);
  assert.ok(info.anchors.main.arch && info.anchors.main.arch.elev, '`arch` on wide, up on the bramble arch');
  assert.ok(!info.anchors.low.arch && !info.anchors.rows.arch, '`arch` only on the main composition');
  // every older anchor where it was (chapters 2 to 6 stand on them)
  assert.deepEqual([info.anchors.main['pile-left'], info.anchors.main.beside, info.anchors.main.behind].map((a) => [a.x, a.y, a.h]), [[300, 896, 258], [985, 856, 236], [566, 732, 132]]);
});

test('chapter 7: every new camera renders with a cast at each of its anchors, with every option, in every light; every new option on every older camera renders, and off is nothing at all', () => {
  const lights = [['dusk'], ['sunset'], ['night'], ['morning'], ['day']];
  for (const cam of CH7_CAMS) {
    const ats = Object.keys(art.sceneInfo('pile').anchors[cam]);
    for (const fx of lights) for (const opts of [NIGHT7, Object.assign({ tunnel: true, tap: 'roots' }, NIGHT7), Object.assign({ tap: 'roots' }, NIGHT7), { rows: FOURTH, dug: true, scale: true }, {}, { rows: 3, tunnel: 'x', tap: 7 }]) {
      const cast = ats.map((at, i) => ({ who: ['player', 'tallyheart', 'clancat', 'clancat', 'grizzled'][i % 5], at, pose: at === 'brink' ? 'crouch' : 'sit', mood: 'wonder', variant: i + 1 }));
      const scene = { set: 'pile', cam, opts, cast, fx }, r = art.render(scene, { look: LOOK });
      checkRender(r, scene, cam + ' ' + JSON.stringify(opts) + ' ' + fx);
      r.heads.forEach((h, i) => assert.ok(h, cam + ': ' + ats[i] + ' in sight'));
    }
  }
  // older cameras: the new options are nothing where they do not belong, and off is nothing at all everywhere
  for (const cam of [...CAMS, ...CH4_CAMS, ...CH5_CAMS]) for (const base of [{}, { pairs: 7, dug: true }, NIGHT7, { rows: FOURTH, back: 'shadow', scale: 'behind' }]) for (const fx of [['morning'], ['dusk']]) {
    const plain = renderP(cam, base, [], fx).svg;
    assert.ok(same5(renderP(cam, Object.assign({ tap: 'none', tunnel: false, tracks: false }, base), [], fx).svg, plain), cam + ' ' + JSON.stringify(base) + ': off is nothing');
    assert.ok(same5(renderP(cam, Object.assign({ tunnel: true, tap: 'roots' }, base), [], fx).svg, plain), cam + ': no tunnel and no roots out front');
    if (cam !== 'wide') assert.ok(same5(renderP(cam, Object.assign({ tracks: true }, base), [], fx).svg, plain), cam + ': tracks only on wide');
    if (cam !== 'rows' && cam !== 'wide') assert.ok(same5(renderP(cam, Object.assign({ tap: 'back' }, base), [], fx).svg, plain), cam + ': the back row\'s Tap only on rows and wide');
  }
  // tracks only at dusk or sunset
  for (const fx of [['morning'], ['day'], ['night']]) assert.ok(same5(renderP('wide', Object.assign({ tracks: true }, NIGHT7), [], fx).svg, renderP('wide', NIGHT7, [], fx).svg), 'no tracks ' + fx);
});

test('chapter 7: `tap: \'back\'` on `rows` and `wide`: one unpainted pc-tap rect on the back row (the band of shade under `back: \'shadow\'`, else the row and the earth behind it), first in keep; nothing else changes', () => {
  for (const [cam, base] of [['rows', { rows: FOURTH, back: 'shadow', scale: 'behind' }], ['rows', NIGHT7], ['wide', NIGHT7], ['wide', { rows: FOURTH, back: 'shadow', scale: 'behind' }]]) for (const fx of [['morning'], ['dusk']]) {
    const r = renderP(cam, Object.assign({ tap: 'back' }, base), [], fx), plain = renderP(cam, base, [], fx), T = tapsOf(r.svg);
    checkRender(r, { cast: [] }, cam + ' tap back');
    assert.equal(T.length, 1, cam + ': one target');
    assert.equal(T[0].name, 'back');
    assert.ok(same5(r.svg.replace(/<rect[^>]*class="pc-tap"[^>]*\/>/, ''), plain.svg), cam + ': unpainted, and the only change');
    assert.ok(keeps(r, T[0]) && keeps({ svg: r.svg, keep: r.keep.slice(0, 1) }, T[0]), cam + ': first in keep');
    // over the back row: the row's own keep box (the last of the rows, from the front) lies inside it, give or take
    // (the back row's line: its pieces' soft shadows on the earth, the band's two ends under the shade)
    const g = base.back === 'shadow' ? one(r.svg, 'band') : groupsNamed(r.svg, 'row').find((q) => /data-row="3"/.test(q));
    const back = boxOf((g.match(/<ellipse\b[^>]*opacity="0.3"\/>/g) || []).join(''));
    assert.ok(back.x0 >= T[0].x0 - 2 && back.x1 <= T[0].x1 + 2 && back.y1 > T[0].y0 && back.y1 < T[0].y1 + 2, cam + ': on the back row, the whole of it: ' + [back.x0, back.y1].map(Math.round) + ' in ' + [T[0].x0, T[0].y0, T[0].x1, T[0].y1].map(Math.round));
    if (base.back !== 'shadow') {
      const dug = boxOf(one(r.svg, 'dug'));
      assert.ok(T[0].y0 <= dug.y0 + 2, cam + ': and the earth behind it');
    }
    assert.equal(tapsOf(plain.svg).length, 0, 'none without it');
  }
});

test('chapter 7: `rear`, round the back at dusk: the rows from behind (the back row nearest), the dug earth heaped, the low roots over its foot hiding the mouth until `tunnel: true` lifts them; the "scale" a glimmer, well clear of the mouth; no sky, no moon', () => {
  const down = renderP('rear', NIGHT7, [], ['dusk']), up = renderP('rear', Object.assign({ tunnel: true }, NIGHT7), [], ['dusk']);
  for (const r of [down, up]) checkRender(r, { cast: [] }, 'rear');
  assert.equal(mouthOf(down.svg), null, 'the roots down: no mouth to be seen');
  assert.equal(rootsOf(down.svg), false);
  const M = mouthOf(up.svg);
  assert.ok(M, '`tunnel: true`: the mouth');
  assert.equal(rootsOf(up.svg), true, 'the roots lifted');
  assert.ok(keeps(up, { x0: M[0], y0: M[1], x1: M[2], y1: M[3] }), 'the mouth kept clear of the lettering');
  // the rows from behind: four, the back row (the pile's row 3) nearest, every piece turned the other way
  const rows = groupsNamed(up.svg, 'row').filter((g) => /data-from="behind"/.test(g));
  assert.equal(rows.length, 4, 'four rows');
  const B = rows.map((g) => ({ row: +/data-row="(\d)"/.exec(g)[1], box: ellBox(g) }));
  assert.deepEqual(B.map((b) => b.row), [0, 1, 2, 3], 'drawn far to near: the front row first');
  for (let i = 1; i < 4; i++) assert.ok(B[i].box.y1 > B[i - 1].box.y1 && B[i].box.w > B[i - 1].box.w, 'each row nearer is lower and wider');
  assert.ok(B[3].box.y1 < M[1], 'the rows beyond the mouth');
  // the "scale" behind the back row, a glimmer, well clear of the mouth (never in it or beside it)
  for (const r of [down, up]) {
    const sb = scaleBox(r.svg), sc = scaleOn(r.svg), mw = M[2] - M[0];
    assert.ok(!meets7(sb, M, mw * 0.5), 'the "scale" well clear of the mouth');
    assert.ok(Math.hypot(sc.cx - (M[0] + M[2]) / 2, sc.cy - (M[1] + M[3]) / 2) > mw * 1.5, 'nowhere beside it');
    assert.ok(sc.cy < B[3].box.y1 + 60 && sc.cy > B[3].box.y1, 'on the bare earth behind the back row: ' + sc.cy + ' / ' + B[3].box.y1);
    assert.equal(groupsNamed(r.svg, 'glimmer').length, 1, 'a glimmer');
  }
  // the dug earth, the mouth at its foot; no sky (the arch overhead), so no moon, whatever a frame says
  const dug = boxOf(one(up.svg, 'dug'));
  assert.ok(M[3] > dug.y1 - 40 && M[0] > dug.x0 && M[2] < dug.x1, 'the mouth at the heap\'s foot');
  assert.ok(same5(renderP('rear', Object.assign({ tunnel: true, moon: 7 }, NIGHT7), [], ['dusk']).svg, up.svg), 'no moon round the back');
  assert.ok(!/data-prop="waxing-moon"/.test(up.svg));
  // the roots' Tap (`tap: 'roots'`), only while they are down
  const t = renderP('rear', Object.assign({ tap: 'roots' }, NIGHT7), [], ['dusk']), T = tapsOf(t.svg);
  assert.equal(T.length, 1);
  assert.equal(T[0].name, 'roots');
  assert.ok(same5(t.svg.replace(/<rect[^>]*class="pc-tap"[^>]*\/>/, ''), down.svg), 'unpainted');
  const roots = boxOf(one(t.svg, 'roots'));
  assert.ok(roots.cx > T[0].x0 && roots.cx < T[0].x1 && T[0].y1 >= roots.y1 - 4 && T[0].x0 <= roots.x0 + 10 && T[0].x1 >= roots.x1 - 10, 'on the low roots, the whole of them: ' + [roots.x0, roots.y0, roots.x1, roots.y1].map(Math.round) + ' / ' + [T[0].x0, T[0].y0, T[0].x1, T[0].y1]);
  assert.ok(keeps({ svg: t.svg, keep: t.keep.slice(0, 1) }, T[0]), 'first in keep');
  assert.equal(tapsOf(renderP('rear', Object.assign({ tap: 'roots', tunnel: true }, NIGHT7), [], ['dusk']).svg).length, 0, 'lifted, there are no roots to tap');
  assert.equal(tapsOf(renderP('rear', Object.assign({ tap: 'back' }, NIGHT7), [], ['dusk']).svg).length, 0, 'no back row to tap from behind it');
});

test('chapter 7: round the back, nobody covers the mouth: our cat at `rear-1` left of it facing right, Tallyheart at `rear-2` right of it facing left, in any pose they take; the guards small past the front row, drawn behind the rows, side-on', { skip: !art.character && 'no cats.js' }, () => {
  const A = art.sceneInfo('pile').anchors.rear, M = mouthOf(renderP('rear', Object.assign({ tunnel: true }, NIGHT7), [], ['dusk']).svg);
  assert.equal(A['rear-1'].face, 'right');
  assert.equal(A['rear-2'].face, 'left');
  assert.ok(A['rear-1'].x < M[0] && A['rear-2'].x > M[2], 'one each side of it');
  for (const [at, who] of [['rear-1', 'player'], ['rear-2', 'tallyheart'], ['rear-2', 'player'], ['rear-1', 'clancat']]) {
    for (const pose of ['sit', 'crouch', 'stand', 'walk', 'loaf', 'lie']) for (const facing of ['right', 'left']) {
      const b = bodyAt({ who, pose, facing, variant: 1 }, A[at]);
      assert.ok(!meets7(b.body, M), who + ' at ' + at + ' (' + pose + ', ' + facing + ') stays off the mouth: ' + b.body.map(Math.round) + ' / ' + M);
    }
  }
  // the mouth: about as wide as our cat's shoulders there, never as wide as she is long
  const me = bodyAt({ who: 'player', pose: 'crouch' }, A['rear-1']), mw = M[2] - M[0];
  assert.ok(mw > 0.7 * (me.head[2] - me.head[0]) && mw < 1.3 * (me.head[2] - me.head[0]), 'as wide as her shoulders: ' + mw + ' / ' + (me.head[2] - me.head[0]).toFixed(1));
  assert.ok(mw < 0.6 * (me.body[2] - me.body[0]), 'much too small for a dragon: not as wide as she is long');
  // the guards: small, past the front row, behind every row; side-on, as every cat is drawn
  const cast = [{ who: 'player', at: 'rear-1', pose: 'crouch' }, { who: 'tallyheart', at: 'rear-2' }, { who: 'clancat', at: 'guard-1', variant: 2 }, { who: 'clancat', at: 'guard-2', variant: 4 }, { who: 'clancat', at: 'guard-3', variant: 6 }];
  const r = renderP('rear', Object.assign({ tunnel: true }, NIGHT7), cast, ['dusk']);
  checkRender(r, { cast }, 'rear with everyone');
  const front = groupsNamed(r.svg, 'row').filter((g) => /data-row="0"/.test(g)).map(ellBox)[0], firstRow = r.svg.indexOf('<g data-art="row"');
  for (const g of ['guard-1', 'guard-2', 'guard-3']) {
    const a = A[g];
    assert.equal(a.z, 'behind', g + ': drawn behind the rows');
    assert.ok(a.h < A['rear-1'].h * 0.25, g + ': small, far off');
    assert.ok(a.y < front.y1 && a.y > front.y1 - 40, g + ': just past the front row');
    assert.ok(a.face === 'left' || a.face === 'right', g + ': side-on');
  }
  const guardAt = (a) => r.svg.indexOf('translate(' + a.x + ' ' + a.y + ')');
  for (const g of ['guard-1', 'guard-2', 'guard-3']) assert.ok(guardAt(A[g]) > 0 && guardAt(A[g]) < firstRow, g + ' is drawn before the rows, so they stand in front of it');
  assert.ok(r.heads.every(Boolean), 'all five in sight');
});

test('chapter 7: `hole`, close on the mouth: the roots always lifted, the round dark hole going down and in, the back row\'s backs along the top edge, the "scale" a glimmer beyond, never in or beside the mouth; our cat at `brink` crouched at its edge, the mouth as wide as her shoulders', { skip: !art.character && 'no cats.js' }, () => {
  for (const opts of [NIGHT7, Object.assign({ tunnel: false, tap: 'roots' }, NIGHT7), Object.assign({ tunnel: true }, NIGHT7)]) {
    const r = renderP('hole', opts, [], ['dusk']);
    checkRender(r, { cast: [] }, 'hole');
    assert.ok(same5(r.svg, renderP('hole', NIGHT7, [], ['dusk']).svg), 'tunnel and tap mean nothing here');
  }
  const r = renderP('hole', NIGHT7, [], ['dusk']), M = mouthOf(r.svg), mw = M[2] - M[0];
  assert.ok(M, 'the mouth');
  assert.equal(rootsOf(r.svg), true, 'the roots lifted');
  assert.equal(tapsOf(r.svg).length, 0);
  assert.ok(keeps(r, { x0: M[0], y0: M[1], x1: M[2], y1: M[3] }), 'kept clear of the lettering');
  // going down and in: darker rings inside it, each smaller and higher, its far end darkest
  const rings = [...one(r.svg, 'mouth').matchAll(/<ellipse cx="([\d.]+)" cy="([\d.]+)" rx="([\d.]+)" ry="([\d.]+)" fill="(#[0-9a-f]{6})"/g)].map((m) => ({ cy: +m[2], rx: +m[3], fill: m[5] }));
  const lum = (h) => { const v = parseInt(h.slice(1), 16); return 0.3 * (v >> 16) + 0.59 * ((v >> 8) & 255) + 0.11 * (v & 255); };
  const inner = rings.filter((q) => q.rx < (mw / 2) + 0.5);
  assert.ok(inner.length >= 5, 'the opening and the rings in it');
  for (let i = 1; i < inner.length; i++) { assert.ok(inner[i].rx < inner[i - 1].rx + 0.01 && inner[i].cy <= inner[i - 1].cy + 0.01, 'in: smaller and higher'); assert.ok(lum(inner[i].fill) <= lum(inner[i - 1].fill) + 0.5, 'and darker'); }
  // the back row's backs along the top edge; the "scale" beyond, clear of the mouth
  const rows = groupsNamed(r.svg, 'row').filter((g) => /data-from="behind"/.test(g)).map(ellBox);
  assert.equal(rows.length, 1, 'the back row alone');
  assert.ok(rows[0].y1 < 200 && rows[0].w > 1000, 'along the top edge, across the panel');
  const sb = scaleBox(r.svg), sc = scaleOn(r.svg);
  assert.ok(!meets7(sb, M, mw * 0.5) && Math.hypot(sc.cx - (M[0] + M[2]) / 2, sc.cy - (M[1] + M[3]) / 2) > mw * 1.5, 'the "scale" beyond, never in or beside the mouth');
  assert.ok(sc.cy > rows[0].y1 && sc.cy < M[1], 'on the earth between the back row and the heap');
  // our cat at its brink, crouched, facing it; never on it; the mouth her shoulders' width, not her length
  const a = art.sceneInfo('pile').anchors.hole.brink;
  assert.equal(a.face, 'right');
  for (const pose of ['crouch', 'sit', 'loaf', 'lie', 'stand']) for (const facing of ['right', 'left']) {
    const b = bodyAt({ who: 'player', pose, facing }, a);
    assert.ok(!meets7(b.body, M), pose + ', ' + facing + ': off the mouth: ' + b.body.map(Math.round) + ' / ' + M);
  }
  const me = bodyAt({ who: 'player', pose: 'crouch' }, a), head = me.head[2] - me.head[0], len = me.body[2] - me.body[0];
  assert.ok(M[0] - me.body[2] > 0 && M[0] - me.body[2] < 90, 'at its edge, her nose a little short of it: ' + (M[0] - me.body[2]).toFixed(1));
  assert.ok(mw > 0.8 * head && mw < 1.25 * head, 'as wide as her shoulders: ' + mw + ' / ' + head.toFixed(1));
  assert.ok(mw < 0.6 * len, 'never as wide as she is long: ' + mw + ' / ' + len.toFixed(1));
  const withHer = renderP('hole', NIGHT7, [{ who: 'player', at: 'brink', pose: 'crouch', mood: 'sniff' }], ['dusk']);
  checkRender(withHer, { cast: [{}] }, 'hole, brink');
  assert.ok(withHer.heads[0] && withHer.heads[0].x > 0 && withHer.heads[0].x < 100, 'her face in the panel');
  // one hole only: this close, the heap's two soft dips (each with a pale root arc over it) would read as two
  // more holes beside the mouth, so `hole` leaves them out; `rear`, a step back, keeps them, as every older
  // camera does (their dug earth is pinned by the fingerprints)
  const dug = (cam) => one(renderP(cam, NIGHT7, [], ['dusk']).svg, 'dug');
  const ells = (gm) => (gm.match(/<ellipse /g) || []).length, arcs = (gm) => (gm.match(/<path d="[^"]+" fill="none" stroke=/g) || []).length;
  assert.deepEqual([ells(dug('hole')), arcs(dug('hole'))], [1, 0], 'the hole\'s heap: its dark foot, no dips, no root arcs');
  assert.deepEqual([ells(dug('rear')), arcs(dug('rear'))], [3, 1], 'round the back, the heap as the wide shots draw it');
});

test('chapter 7: `tracks: true` on `wide` at dusk or sunset: far off, low over the hedge between the towers, two bright rails on a dark bed with sleepers across it, catching the last light, readable on an iPad page; and `arch`: on top of the bramble arch, standing, big enough to see', { skip: !art.character && 'no cats.js' }, () => {
  for (const fx of [['dusk'], ['sunset']]) {
    const r = renderP('wide', Object.assign({ tracks: true, moon: 7 }, NIGHT7), [{ who: 'player', at: 'arch', pose: 'stand', mood: 'wonder' }], fx);
    checkRender(r, { cast: [{}] }, 'wide tracks ' + fx);
    const g = one(r.svg, 'tracks'), lines = (/<path d="((?:M[\d.]+ [\d.]+L[\d.]+ [\d.]+)+)" fill="none"/.exec(g) || [])[1];
    assert.ok(lines, 'drawn ' + fx);
    const segs = lines.match(/M[\d.]+ [\d.]+L[\d.]+ [\d.]+/g).map((s) => s.match(/[\d.]+/g).map(Number));
    assert.equal(segs.length, 2, 'two lines');
    // (the hedge's top is at about y 540 there)
    segs.forEach((q) => { assert.ok(q[2] - q[0] > 250, 'long'); assert.ok(Math.max(q[1], q[3]) < 525 && Math.min(q[1], q[3]) > 440, 'low at the horizon, over the hedge'); });
    assert.ok(Math.abs(segs[1][1] - segs[0][1]) >= 10 && Math.abs(segs[1][1] - segs[0][1]) < 20, 'two rails, apart enough to read as two and close enough to be far off');
    assert.ok(segs[1][2] - segs[1][0] > 400 && segs[0][0] < 920, 'long, and starting near the middle of the panel, right of the climber');
    // readable at iPad size (the panel about 680 px wide): rails at least 5 wide, each over a soft glow; a
    // dark bed under them, nearly opaque; sleepers across the bed, a filled shape of their own
    const sw = [...g.matchAll(/fill="none" stroke="[^"]+" stroke-width="([\d.]+)"/g)].map(m => +m[1]);
    assert.ok(sw.length === 2 && Math.min(...sw) >= 5 && Math.max(...sw) > Math.min(...sw), 'the rails at least 5 wide, over a wider glow: ' + sw);
    const bed = /<path d="M[^"]*Z" fill="[^"]+" opacity="([\d.]+)"/.exec(g);
    assert.ok(bed && +bed[1] >= 0.85, 'a dark bed under the rails');
    const quads = [...g.matchAll(/<path d="((?:M[\d.]+ [\d.]+L[\d.]+ [\d.]+L[\d.]+ [\d.]+L[\d.]+ [\d.]+Z)+)" fill="[^"]+"/g)].map(m => m[1].split('Z').filter(Boolean).length);
    assert.deepEqual([quads.length, quads[0]], [2, 1], 'the bed, one shape, under the sleepers');
    assert.ok(quads[1] >= 15, 'sleepers across the bed: ' + quads[1]);
    assert.ok(keeps(r, boxOf(g)), 'kept clear of the lettering');
    assert.ok(r.heads[0], 'the climber in sight');
    assert.ok(r.svg.indexOf('data-art="tracks"') < r.svg.indexOf('data-prop="waxing-moon"') || r.svg.indexOf('data-prop="waxing-moon"') > 0, 'with the seventh evening\'s moon');
  }
  // `arch`: up on the arch over the pile, as big as a cat by the back row (at 108 she was a speck on an iPad
  // page: final review), smaller than one at the front
  const A = art.sceneInfo('pile').anchors.main, a = A.arch;
  assert.ok(a.elev && a.h >= A['crowd-2'].h * 0.9 && a.h < A['pile-left'].h * 0.75, 'up on the arch, big enough to see: ' + a.h);
  assert.ok(a.x > 335 && a.x < 905 && a.y < 548 - 80, 'over the arch\'s mouth, on top of it');
  assert.equal(a.face, 'right', 'looking out toward the tracks');
});

// ================================================================ chapter 8: `poke`, `tap: 'mouth'`, the night round the back
// docs/chapters/08-the-night-trail.spec.md, section 4 (the pile row) and section 7, item 2 (the fingerprints,
// recorded once from the shipped chapter 7 snapshot)

const SPEC8 = path.join(ROOT, 'docs/chapters/08-the-night-trail.spec.md');
const NIGHT8 = { rows: NIGHT, scale: 'behind', dug: 'big' };
const rear8 = () => art.sceneInfo('pile').anchors.rear;
const lum8 = (h) => { const v = parseInt(h.slice(1), 16); return 0.3 * (v >> 16) + 0.59 * ((v >> 8) & 255) + 0.11 * (v & 255); };

test('chapter 8: the spec names the pile\'s `poke`, `tap: \'mouth\'` and the night on `rear` and `hole`; the set has them, declared, off by default; every older spot where it was', () => {
  const md = fs.readFileSync(SPEC8, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['**Anchor `poke`** on `rear`', '**`tap: \'mouth\'`**', '**`night` on `rear` and `hole`**', 'its height `rear-2`\'s', 'never black'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  const v = art.vocab.sets.pile, info = art.sceneInfo('pile'), R = info.anchors.rear;
  assert.ok(v.anchors.includes('poke') && R.poke, '`poke` on rear');
  for (const comp of Object.keys(info.anchors)) if (comp !== 'rear') assert.ok(!info.anchors[comp].poke, comp + ': no poke');
  assert.equal(R.poke.h, R['rear-2'].h, 'its height rear-2\'s');
  assert.ok(R.poke.elev && R.poke.z !== 'behind' && R.poke.face === 'left', 'facing the mouth, in front of it, out of the depth sums and the first-free pick');
  assert.deepEqual(v.opts.tap, ['none', 'back', 'roots', 'mouth']);
  assert.equal(info.defaults.tap, 'none', 'no Tap target unless a frame asks');
  assert.deepEqual(['rear-1', 'rear-2', 'guard-1', 'guard-2', 'guard-3'].map((k) => [R[k].x, R[k].y, R[k].h, R[k].face]),
    [[436, 964, 380, 'right'], [1172, 958, 380, 'left'], [560, 478, 74, 'left'], [812, 474, 72, 'right'], [1060, 478, 74, 'right']]);
  assert.deepEqual([info.anchors.hole.brink.x, info.anchors.hole.brink.y, info.anchors.hole.brink.h], [424, 958, 470]);
});

// Every pile frame of chapters 2 to 7, as the chapter 7 snapshot draws it: the frame's scene resolved with
// E.resolveScene for a fixed cat, rendered with LOOK; sha1 (12 hex) of the markup with the per-render ids taken
// out, the keep list and the heads. Recorded once from /Users/aron/potomac-crossing-work/ch08/shipped (engine
// 0.7.0) in a node process of its own. Chapter 6's `wide` and `low` at night and chapter 7's dusk frames among them.
// The depth hotfix of 2026-10-25 (Charlie's bug, the last test in this file) moved ten, recorded again on the fixed tree:
// ch06 f004, f107, f109 and ch07 f018, f021, f077, f079, f080, f081, f082 (the cat at `crowd-2` drawn first).
const CH8_PILE_FINGERPRINT = {
  'ch02:f026': '65b61015e604', 'ch02:f027': '611043434b33', 'ch02:f028': '9fd55913383d', 'ch02:f029': '4cd9245479fc',
  'ch02:f031a': '412cc66456de', 'ch02:f031b': 'c85a910173d0', 'ch02:f032': '81d67c0aa92b',
  'ch02:f033': '611043434b33', 'ch02:f034': '317057477d60', 'ch02:f035': '1c0f3f33339e', 'ch02:f036': '6d257400a132',
  'ch02:f037': '7130959f0299', 'ch02:f041': '5f246f057b2b', 'ch02:f044': 'b295c35a10fc', 'ch02:f107': 'ec0fbf7fc553',
  'ch03:f012': '8a7fc7cfe779', 'ch03:f013': 'b65cf356cfb6', 'ch03:f014': '569c1569000e',
  'ch03:f090b': 'd145e7fa74cc', 'ch03:f098b': '241de74f2458', 'ch04:f019': '013b4291bde6',
  'ch04:f020': '5e9a87366bc9', 'ch04:f021': '8f3b89278c1e', 'ch04:f022': 'cdc61316f2b7', 'ch04:f023': 'c9708e0e714e',
  'ch04:f024': '7b7fc590fa08', 'ch04:f025': '2ee346f4483b', 'ch04:f026': '9aeef3efba7b', 'ch04:f028': 'd54f6841fe3d',
  'ch04:f029a': 'd11a253992e2', 'ch04:f029b': '1b5d4e14a88b', 'ch04:f030': '189ce430a023',
  'ch04:f031': 'd5f43c6bba0e', 'ch04:f111': '5df05e238004', 'ch05:f001': '5b004ec20095', 'ch05:f002': '6863f9670b02',
  'ch05:f003': 'ac21e526a2ca', 'ch05:f004': 'ac21e526a2ca', 'ch05:f005': '3a1b59276e70', 'ch05:f006': '8a19c7743774',
  'ch05:f007': 'd5a16c145715', 'ch05:f008': '65b10929dbf3', 'ch05:f009': '6cb83f3509b1', 'ch05:f010': 'aa0dc6227282',
  'ch06:f001': 'a9454a77042a', 'ch06:f002': '8f18f5a0a29a', 'ch06:f003': 'ac21e526a2ca', 'ch06:f004': 'da92fa83ac9e',
  'ch06:f107': '04e89498971c', 'ch06:f108': '55946189ea56', 'ch06:f109': 'ba3e0c03d7b7', 'ch06:f110': 'c44f05431c9e',
  'ch06:f111': '7828dbd5f12b', 'ch06:f112': 'c99bc4ed519c', 'ch06:f113': '2172dc400e8e', 'ch06:f114': '8d3cab23eeb7',
  'ch06:f115': '3146cf5e7647', 'ch06:f116': 'e8221690ff6d', 'ch06:f117': 'a476868dcce0', 'ch06:f118': '97b730d33186',
  'ch07:f014': 'c1629e50c3f2', 'ch07:f015': '6a1acba0d34b', 'ch07:f016': 'ac21e526a2ca', 'ch07:f017': '1e8da37f3199',
  'ch07:f018': '67a7d714e609', 'ch07:f019': '24cbd248111a', 'ch07:f020': '8019a42b6851', 'ch07:f021': '4d54166e24c2',
  'ch07:f022': '7b67f750178a', 'ch07:f077': '4ca2f093fecf', 'ch07:f078': 'a5469ef07f69', 'ch07:f079': '0d205dda7332',
  'ch07:f080': '549ba3e2067b', 'ch07:f081': 'ba49249d24bc', 'ch07:f082': '99dfbca7f20c', 'ch07:f083': 'af81bc33897d',
  'ch07:f084': '23b9b312f0aa', 'ch07:f085': '6da54d065b60', 'ch07:f086': '8e7cce050eed', 'ch07:f087': 'fee28354eb32',
  'ch07:f088': '760b6ac5bdd2', 'ch07:f089a': 'c42b78420e64', 'ch07:f089b': '6da54d065b60',
  'ch07:f090': '4a1f4c0f13c5', 'ch07:f091a': 'c42b78420e64', 'ch07:f091b': '6da54d065b60',
  'ch07:f092': '4b4c44050ea3', 'ch07:f093': '0028bfda7953', 'ch07:f094': '0e6fbde8a328', 'ch07:f095': '4ac806de1aba',
  'ch07:f096': 'b53e33daf6af'
};
const fpCat8 = () => { const c = PC.engine.blankCat({ id: 'fingerprint', now: 0, look: LOOK }); c.name = 'Pebble'; c.petname = 'Pebble'; return c; };
function frameHash8(set, ids) {
  const E = PC.engine, cat = fpCat8(), stories = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07'].map((id) => PC.story[id]).filter(Boolean), out = {};
  for (const id of ids) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    if (!f.scene || f.scene.set !== set) continue;
    const r = art.render(E.resolveScene(f.scene, cat, stories), { look: LOOK });
    out[id + ':' + fid] = crypto.createHash('sha1').update(r.svg.replace(/pcs?[0-9a-z]+-/g, '') + JSON.stringify(r.keep) + JSON.stringify(r.heads)).digest('hex').slice(0, 12);
  }
  return out;
}

test('chapter 8: every pile frame of chapters 2 to 7 draws exactly as the chapter 7 snapshot drew it (fingerprints)', () => {
  const now = frameHash8('pile', ['ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07']);
  assert.deepEqual(Object.keys(now).sort(), Object.keys(CH8_PILE_FINGERPRINT).sort(), 'the same frames visit the pile');
  for (const [k, want] of Object.entries(CH8_PILE_FINGERPRINT)) assert.equal(now[k], want, k + ': drawn as it was');
});

// The sweeps (recorded once from the snapshot, in a process of its own, with exactly this code)
const SWEEP_LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const sweepStrip = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');
// One hash per camera: every picture the pile drew before chapter 8 (every option chapters 2 to 7 gave it, in
// the morning, at dusk and at night, but `rear` and `hole` at night, which chapter 8 draws for the first time),
// empty and with someone at every spot of the camera.
function pileSweep(art) {
  const ROWS = { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 7 };
  const OPTS = [{}, { pairs: 7, dug: true, lit: 3, vole: true }, ROWS, Object.assign({ tunnel: true, tap: 'roots' }, ROWS), Object.assign({ tap: 'back', back: 'shadow', tracks: true }, ROWS),
    Object.assign({ tap: 'roots' }, ROWS), { rows: [10, 10, { n: 10, gap: [3, 4, 5, 6] }], dug: 'big', scale: true, glint: true }, { rows: [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }], scale: 'behind', dug: 'big', prints: true }];
  const info = art.sceneInfo('pile'), out = {};
  for (const cam of Object.keys(info.cams)) {
    const spots = Object.keys(info.anchors[info.cams[cam].comp] || {}).filter((k) => k !== 'poke');
    const cast = spots.map((at, i) => ({ who: ['player', 'tallyheart', 'grizzled', 'clancat'][i % 4], variant: 1 + (i % 3), pose: at === 'brink' ? 'crouch' : at === 'arch' ? 'stand' : 'sit', at }));
    const h = crypto.createHash('sha1');
    for (const fx of [['morning'], ['dusk'], ['night']]) {
      if (fx[0] === 'night' && (cam === 'rear' || cam === 'hole')) continue;
      for (const opts of OPTS) for (const c of [[], cast]) {
        const r = art.render({ set: 'pile', cam, fx, opts, cast: c }, { look: SWEEP_LOOK });
        h.update(sweepStrip(r.svg) + JSON.stringify(r.keep) + JSON.stringify(r.heads));
      }
    }
    out[cam] = h.digest('hex').slice(0, 16);
  }
  return out;
}
// PC.art.prey, every kind, lit or not, each facing, each part, a few seeds; and its string of fish
function preySweep(art) {
  const h = crypto.createHash('sha1');
  for (const kind of ['mouse', 'vole', 'fish', 'other']) for (const lit of [false, true]) for (const facing of ['right', 'left']) for (const part of [undefined, 'glow', 'body', 'spark']) for (const seed of [0, 1, 7, 23, 521]) {
    const p = art.prey({ kind, lit, facing, part, seed });
    h.update(JSON.stringify([p.svg, p.w, p.h, p.kind]));
  }
  for (const count of [1, 2, 3, 4, 5]) for (const len of [40, 60, 90]) h.update(art.prey.string({ count, len }));
  return h.digest('hex').slice(0, 16);
}

test('chapter 8: every picture the pile drew before (every camera, every option chapters 2 to 7 gave it, morning, dusk and night but `rear` and `hole` at night), empty and with someone at every older spot, and PC.art.prey, are byte for byte the snapshot\'s', () => {
  assert.deepEqual(pileSweep(art), {
    'wide': 'bf157490f5ef8fec',
    'low': 'be7f0c1adc8b97c5',
    'close': '41d8639296c7205e',
    'rows': 'f42f19dfbea26342',
    'gap': 'f0cbb58f488ba8c9',
    'scale': 'de80834e0ad3d91f',
    'through': '545f968d618af166',
    'mirror': 'd6838ab5cb525cd8',
    'gap-close': 'e16d8bc99ea556c2',
    'rear': 'f16a4a6b1cc7a824',
    'hole': '18adccc4ad2ced1c'
  }, 'recorded from the chapter 7 snapshot');
  assert.equal(preySweep(art), '8574883cfcd2245e', 'PC.art.prey as chapter 7 drew it (the tracks set draws with it)');
});

test('chapter 8: `poke` on `rear`: a cat crouched there facing left has her nose at the tunnel mouth\'s right rim, her shoulders plainly wider than the mouth, her head clear of the mouth\'s Tap box; Riffle on all fours pokes his head at it', { skip: !art.character && 'no cats.js' }, () => {
  const R = rear8(), a = R.poke;
  const r0 = renderP('rear', Object.assign({ tunnel: true, tap: 'mouth' }, NIGHT8), [], ['night']), M = mouthOf(r0.svg), T = tapsOf(r0.svg)[0];
  assert.ok(M && T && T.name === 'mouth', 'the mouth and its Tap box');
  const tap = [T.x0, T.y0, T.x1, T.y1], mh = M[3] - M[1], cy = (M[1] + M[3]) / 2;
  for (const mood of ['laugh', 'neutral', 'happy']) {
    const t = bodyAt({ who: 'tallyheart', pose: 'crouch', mood, facing: 'left' }, a);
    assert.ok(t.head[0] >= M[2] && t.head[0] - M[2] <= 14, 'Tallyheart (' + mood + '): her nose at the right rim: ' + (t.head[0] - M[2]).toFixed(1));
    assert.ok(t.head[1] < cy && t.head[3] > cy, 'her head level with the mouth');
    assert.ok(!meets7(t.head, tap), 'her head clear of the Tap box: ' + t.head.map(Math.round) + ' / ' + tap.map(Math.round));
    assert.ok(t.head[3] - t.head[1] > 1.5 * mh && t.body[3] - t.body[1] > 2 * mh, 'her shoulders plainly wider than the mouth: ' + Math.round(t.body[3] - t.body[1]) + ' / ' + mh);
  }
  const f = bodyAt({ who: 'riffle', pose: 'scramble', facing: 'left' }, a);
  assert.ok(f.head[0] >= M[2] && f.head[0] - M[2] <= 60 && !meets7(f.head, tap), 'Riffle: his nose near the rim, his head clear of the Tap box: ' + f.head.map(Math.round));
  assert.ok(f.head[3] > M[1] && f.head[1] < M[3], 'Riffle: his head at the mouth\'s height');
  assert.ok(f.body[3] - f.body[1] > 2 * mh, 'Riffle: plainly bigger than the mouth too');
  // the told panel: Tallyheart at `poke`, our cat at `rear-1`, the Tap on the mouth (its glow lands on the mouth, not her face)
  const cast = [{ who: 'tallyheart', at: 'poke', pose: 'crouch', mood: 'laugh' }, { who: 'player', at: 'rear-1', pose: 'sit', mood: 'happy' }];
  for (const fx of [['night'], ['dusk']]) {
    const r = renderP('rear', Object.assign({ tunnel: true, tap: 'mouth' }, NIGHT8), cast, fx);
    checkRender(r, { cast }, 'rear, poke ' + fx);
    const h = r.heads[0], hx = h.x * 16, hy = h.y * 10;
    assert.ok(!(hx > tap[0] && hx < tap[2] && hy > tap[1] && hy < tap[3]), 'her face is not in the Tap box');
    assert.ok(r.svg.indexOf('<g transform="translate(' + a.x + ' ' + a.y + ')') > r.svg.indexOf('data-art="mouth"'), 'in front of the mouth');
  }
  // the panel at the end of chapter 7 (nobody at `poke`) is untouched: the sweep above holds it
});

test('chapter 8: `tap: \'mouth\'`: on `rear` while `tunnel` is true and on `hole`, an unpainted pc-tap rect on the mouth\'s box, first in keep, the only change; nothing anywhere else (and `hole` still ignores `back` and `roots`)', () => {
  for (const [cam, base] of [['rear', Object.assign({ tunnel: true }, NIGHT8)], ['hole', NIGHT8], ['hole', Object.assign({ tunnel: false }, NIGHT8)]]) for (const fx of [['night'], ['dusk']]) {
    const r = renderP(cam, Object.assign({ tap: 'mouth' }, base), [], fx), plain = renderP(cam, base, [], fx), T = tapsOf(r.svg), M = mouthOf(r.svg);
    checkRender(r, { cast: [] }, cam + ' tap mouth');
    assert.equal(T.length, 1, cam + ': one target');
    assert.equal(T[0].name, 'mouth');
    assert.deepEqual([T[0].x0, T[0].y0, T[0].x1, T[0].y1].map(Math.round), M, cam + ': the mouth\'s own box');
    assert.ok(same5(r.svg.replace(/<rect[^>]*class="pc-tap"[^>]*\/>/, ''), plain.svg), cam + ' ' + fx + ': unpainted, and the only change');
    assert.ok(keeps({ svg: r.svg, keep: r.keep.slice(0, 1) }, T[0]), cam + ': first in keep');
  }
  // the roots down: no mouth to tap
  assert.ok(same5(renderP('rear', Object.assign({ tap: 'mouth' }, NIGHT8), [], ['night']).svg, renderP('rear', NIGHT8, [], ['night']).svg), 'rear without the tunnel: nothing');
  for (const t of ['back', 'roots']) assert.equal(tapsOf(renderP('hole', Object.assign({ tap: t }, NIGHT8), [], ['night']).svg).length, 0, 'hole ignores ' + t);
  for (const cam of [...CAMS, ...CH4_CAMS, ...CH5_CAMS]) for (const base of [{}, NIGHT8, Object.assign({ tunnel: true }, NIGHT8)])
    assert.ok(same5(renderP(cam, Object.assign({ tap: 'mouth' }, base), [], ['dusk']).svg, renderP(cam, base, [], ['dusk']).svg), cam + ': no mouth to tap here');
});

test('chapter 8: `rear` and `hole` at night: moonlit, readable, never black; the light through the arch is the moon\'s; the mouth still the darkest thing there; by dusk exactly as chapter 7 drew them, and every other camera at night as before', { skip: !art.character && 'no cats.js' }, () => {
  for (const cam of ['rear', 'hole']) for (const opts of [Object.assign({ tunnel: true }, NIGHT8), NIGHT8, { rows: FOURTH, dug: true }]) {
    const cast = cam === 'rear' ? [{ who: 'player', at: 'rear-1', pose: 'crouch', mood: 'wonder' }, { who: 'tallyheart', at: 'rear-2', pose: 'sit', mood: 'kind' }] : [{ who: 'player', at: 'brink', pose: 'crouch' }];
    const r = renderP(cam, opts, cast, ['night']);
    checkRender(r, { cast }, cam + ' at night');
    r.heads.forEach((h, i) => assert.ok(h, cam + ': ' + cast[i].at + ' in sight'));
    assert.equal(groupsNamed(r.svg, 'moonlit').length, 1, cam + ': the earth in the moon\'s light');
    const M = /<filter id="[^"]*pilemoon"[^>]*>.*?values="([^"]+)"/.exec(r.svg)[1].trim().split(/\s+/).map(Number);
    const map = (h) => { const v = parseInt(h.slice(1), 16), c = [(v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]; const o = [0, 1, 2].map((k) => Math.max(0, Math.min(1, M[k * 5] * c[0] + M[k * 5 + 1] * c[1] + M[k * 5 + 2] * c[2] + M[k * 5 + 4])) * 255); return 0.3 * o[0] + 0.59 * o[1] + 0.11 * o[2]; };
    const L = [...one(r.svg, 'moonlit').matchAll(/fill="(#[0-9a-f]{6})"/g)].map((m) => map(m[1])).sort((p, q) => p - q);
    assert.ok(L[L.length >> 1] >= 65 && L[L.length - 1] >= 100, cam + ': readable, never black: median ' + L[L.length >> 1].toFixed(0) + ', lightest ' + L[L.length - 1].toFixed(0));
    // cool: the earth's warm brown (more red than blue by day) comes out bluer than red in the moon's light
    const rgb = (c) => [0, 1, 2].map((k) => M[k * 5] * c[0] + M[k * 5 + 1] * c[1] + M[k * 5 + 2] * c[2] + M[k * 5 + 4]);
    for (const c of [[0x7a, 0x56, 0x38], [0xa2, 0x7a, 0x55], [0x4e, 0x35, 0x24]].map((q) => q.map((x) => x / 255))) assert.ok(rgb(c)[2] >= rgb(c)[0], cam + ': a cool light on ' + c);
    if (opts.tunnel || cam === 'hole') {
      const far = [...one(r.svg, 'mouth').matchAll(/fill="(#[0-9a-f]{6})"/g)].map((m) => map(m[1]));
      assert.ok(Math.min(...far) < L[L.length >> 2] * 0.5, cam + ': the mouth\'s far end stays dark: ' + Math.min(...far).toFixed(0));
    }
    // by dusk: none of it (chapter 7's panels are pinned by the sweep and the fingerprints)
    assert.equal(groupsNamed(renderP(cam, opts, cast, ['dusk']).svg, 'moonlit').length, 0, cam + ': not at dusk');
  }
  // the light through the arch's open front: silver at night, the sunset's at dusk
  const nightRear = renderP('rear', NIGHT8, [], ['night']).svg, duskRear = renderP('rear', NIGHT8, [], ['dusk']).svg;
  assert.ok(/fill="#b8c8e6" opacity="0.2"/i.test(nightRear) && !/#b8c8e6/i.test(duskRear), 'rear: moonlight through the arch at night only');
  for (const cam of [...CAMS, ...CH4_CAMS, ...CH5_CAMS]) assert.equal(groupsNamed(renderP(cam, NIGHT8, [], ['night']).svg, 'moonlit').length, 0, cam + ': at night as it was');
});

test('chapter 8: whatever chapter 8 puts at the pile renders, uses the vocabulary by value, puts `poke` and `tap: \'mouth\'` only where they belong (once the chapter is written)', (t) => {
  const ch = PC.story && PC.story.ch08;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'pile' && f.board !== 'STUB.') : [];
  if (!frames.length) { t.diagnostic('chapter 8 has no frames at the pile yet'); return; }
  const v = art.vocab.sets.pile, info = art.sceneInfo('pile');
  for (const [id, f] of frames) {
    const sc = f.scene, o = sc.opts || {};
    assert.ok(v.cams.includes(sc.cam), id + ': camera ' + sc.cam);
    for (const k of Object.keys(o)) assert.ok(k in v.opts, id + ': option ' + k);
    if (o.tap != null) assert.ok(v.opts.tap.includes(o.tap), id + ': tap ' + o.tap);
    if (o.tap === 'mouth') assert.ok((sc.cam === 'rear' && o.tunnel === true) || sc.cam === 'hole', id + ': the mouth\'s Tap on `rear` with the tunnel, or `hole`');
    for (const m of sc.cast || []) if (typeof m.at === 'string') assert.ok(info.anchors[info.cams[sc.cam].comp][m.at], id + ': ' + m.at + ' is a spot of ' + sc.cam);
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc, 'ch08 ' + id);
    r.heads.forEach((h, i) => assert.ok(h, id + ': ' + (sc.cast[i].who || '?') + ' in sight'));
    if (f.scratch && f.scratch.tap === 'mouth') assert.equal(tapsOf(r.svg).filter((q) => q.name === 'mouth').length, 1, id + ': the wriggle-in Tap finds the mouth');
  }
  t.diagnostic(frames.length + ' frames at the pile');
});

// ================================================================ the depth hotfix (2026-10-25): Charlie's bug
// Charlie (a player) found it on chapter 8's f030, the pile at dusk: the sitting grey guard at `crowd-2`, further
// back, was drawn over the face of the walking black guard at `beside`, nearer. scenes.js draws a layer's cast in
// the order it is listed and never sorts by depth, so a cast is listed back to front wherever two cats meet. On the
// pile's `wide` camera, for every pair of cats on the ground in the same layer where the one further back (its feet
// higher up the panel) reaches the nearer one's head, the one further back is drawn first: its group comes first in
// the markup. Twelve live frames had it the other way round, each now fixed by putting the `crowd-2` cat first.

const DEPTH_FIXED = ['ch06:f004', 'ch06:f107', 'ch06:f109', 'ch07:f018', 'ch07:f021', 'ch07:f077', 'ch07:f079', 'ch07:f080', 'ch07:f081', 'ch07:f082', 'ch08:f009', 'ch08:f030'];

test('the depth hotfix (Charlie\'s bug, ch08 f030): on the pile\'s `wide` camera a cat further back is never drawn over a nearer cat\'s head; the twelve frames that had it draw the cat at `crowd-2` first', { skip: !art.character && 'no cats.js' }, (t) => {
  const E = PC.engine, cat = fpCat8(), A = art.sceneInfo('pile').anchors.main;
  const stories = Object.keys(PC.story).sort().map((id) => PC.story[id]);
  const met = new Set(), bad = [];
  let frames = 0, pairs = 0;
  for (const st of stories) for (const [fid, f] of Object.entries(st.frames)) {
    if (!f.scene || f.scene.set !== 'pile' || f.scene.cam !== 'wide' || f.board === 'STUB.') continue;
    frames++;
    const sc = E.resolveScene(f.scene, cat, stories), r = art.render(sc, { look: LOOK });
    const ground = (sc.cast || []).filter((m) => m && typeof m.at === 'string' && A[m.at] && !A[m.at].elev).map((m) => {
      const a = A[m.at], at = r.svg.indexOf('<g transform="translate(' + a.x + ' ' + a.y + ')');
      assert.ok(at >= 0, st.id + ' ' + fid + ': ' + m.who + ' drawn at `' + m.at + '`');
      return { m, a, at, box: bodyAt(m, a) };
    });
    for (const near of ground) for (const far of ground) {
      if (far.a.y >= near.a.y || (far.a.z || 'front') !== (near.a.z || 'front') || !meets7(far.box.body, near.box.head)) continue;
      pairs++; met.add(st.id + ':' + fid);
      if (far.at > near.at) bad.push(st.id + ' ' + fid + ': ' + far.m.who + ' at `' + far.m.at + '` is drawn over ' + near.m.who + '\'s head at `' + near.m.at + '`');
    }
  }
  assert.deepEqual(bad, [], 'listed back to front where they meet');
  for (const id of DEPTH_FIXED) assert.ok(met.has(id), id + ': the cat at `crowd-2` reaches a nearer cat\'s head, and is drawn first');
  for (const id of DEPTH_FIXED) {
    const [ch, fid] = id.split(':'), cast = PC.story[ch].frames[fid].scene.cast;
    assert.equal(cast[0].at, 'crowd-2', id + ': the cat further back listed first');
  }
  t.diagnostic(frames + ' frames on `wide`, ' + pairs + ' pairs that meet');
});
