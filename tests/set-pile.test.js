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
const ANCHORS = ['pile-left', 'pile-right', 'beside', 'crowd-1', 'crowd-2', 'crowd-3', 'fountain-edge'];
const OPTS = ['pairs', 'lit', 'dug', 'vole'];
const CH4_OPTS = ['rows', 'back', 'scale', 'glint'];
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
  assert.deepEqual([...v.cams].sort(), [...CAMS, ...CH4_CAMS].sort());
  assert.deepEqual([...v.anchors].sort(), [...ANCHORS].sort());
  assert.deepEqual(Object.keys(v.opts).sort(), [...OPTS, ...CH4_OPTS].sort());
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

// ================================================================ chapter 4 (docs/build.md, "Chapter 4 (v0.4)"; the
// chapter text's Build notes, "Sets and options"): rows of ten, the gap, the "scale"

const crypto = require('crypto');
const ROW_CAMS = ['wide', 'low', 'close', 'rows'];          // the cameras that show the whole pile
const CLOSEUPS = ['scale', 'through', 'mirror'];            // the three close-ups of the "scale"
const MORNING = [10, 10, { n: 10, gap: [3, 4, 5, 6] }];     // the third morning: thirty laid out, four gone from the back row
const FULL = [10, 10, 10], NIGHT = [10, 10, 10, 10];
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
  assert.deepEqual(v.opts.rows, [FULL, MORNING, NIGHT]);
  assert.deepEqual(v.opts.back, ['none', 'shadow']);
  assert.deepEqual(v.opts.scale, [false, true, 'behind']);
  assert.deepEqual(v.opts.glint, [false, true]);
  assert.deepEqual(info.defaults, { pairs: 8, lit: 0, dug: false, vole: false, back: 'none', scale: false, glint: false }, 'nothing of chapter 4 by default; no `rows`: the pile is in pairs');
  // anchors: rows and gap have the pile's own names; the three close-ups have none
  assert.deepEqual(Object.keys(info.anchors.rows).sort(), ['beside', 'crowd-1', 'crowd-2', 'crowd-3', 'pile-left', 'pile-right']);
  assert.deepEqual(Object.keys(info.anchors.gap).sort(), ['beside', 'pile-left', 'pile-right']);
  for (const cam of CLOSEUPS) assert.deepEqual(info.anchors[cam], {}, cam + ': no anchors');
  for (const comp of ['rows', 'gap']) for (const k of Object.keys(info.anchors[comp])) assert.ok(ANCHORS.includes(k), comp + ': ' + k + ' is one of the pile\'s anchors');
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
  const info = art.sceneInfo('pile'), A = info.anchors.gap;
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
