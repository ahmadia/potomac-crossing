// GroveClan's woods (app/art/sets/grove.js, chapter 9): node --test tests/set-grove.test.js
// docs/chapters/09-featherlight.spec.md, section 4, "The new set, grove"
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['bridge', 'wide', 'meet', 'oak', 'hollow'];
const COMP = { bridge: 'bridge', wide: 'main', meet: 'meet', oak: 'oak', hollow: 'hollow' };
// the spec's table, camera by camera
const ANCHORS = {
  bridge: ['near-1', 'near-2', 'span-1', 'span-2', 'far'],
  wide: ['edge-1', 'edge-2', 'edge-3', 'elder', 'fern'],
  meet: ['meet-1', 'meet-2', 'meet-3', 'elder', 'fern'],
  oak: ['root-1', 'root-2', 'root-3', 'elder', 'trunk', 'moss'],
  hollow: ['nook', 'lip']
};
const hasCats = typeof art.character === 'function' && !art.character.placeholder;

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
  (r.keep || []).forEach((k) => assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, label + ': keep inside the panel'));
}
const render = (cam, cast, fx, opts) => art.render({ set: 'grove', cam, opts: opts || {}, cast: cast || [], fx: fx || ['day'] }, { look: LOOK });
const strip = (s) => s.replace(/\bpcs?[0-9a-z]+-/g, '');
const lum = (h) => { const v = parseInt(h.slice(1), 16); return 0.3 * (v >> 16) + 0.59 * ((v >> 8) & 255) + 0.11 * (v & 255); };
const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const spots = (cam) => art.sceneInfo('grove').anchors[COMP[cam]];
// the whole of the first <g …> whose opening tag has `attr`, to its own closing tag ('' when there is none)
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
// every colour the markup paints with, with its opacity (a gradient's stops with theirs)
function paints(svg) {
  const out = [];
  for (const m of svg.matchAll(/<(path|rect|ellipse|circle|polygon)\b([^>]*)\/?>/g)) {
    const a = m[2], op = +((/ opacity="([\d.]+)"/.exec(a) || [])[1] || 1);
    for (const k of ['fill', 'stroke']) { const c = new RegExp(' ' + k + '="(#[0-9a-fA-F]{6})"').exec(a); if (c) out.push({ c: c[1], op }); }
  }
  for (const m of svg.matchAll(/<stop [^>]*stop-color="(#[0-9a-fA-F]{6})"([^>]*)\/>/g)) out.push({ c: m[1], op: +((/stop-opacity="([\d.]+)"/.exec(m[2]) || [])[1] || 1) });
  return out;
}
// the colours a group paints with, its gradients' stops among them (the gradients are defined in the whole svg)
function groupPaints(svg, g) {
  const out = paints(g);
  for (const u of new Set((g.match(/url\(#[^)]+\)/g) || []).map((x) => x.slice(5, -1)))) {
    const m = new RegExp('<(?:linear|radial)Gradient id="' + u + '"[^>]*>(.*?)</(?:linear|radial)Gradient>').exec(svg);
    if (m) out.push(...paints(m[1]));
  }
  return out;
}
// a cast member's body and head boxes at a spot, as scenes.js places it (the cats' units: a sitting Clan cat's height to h)
function boxesAt(m, a) {
  const ch = art.character(m.who, Object.assign({ mood: 'neutral', facing: m.facing || a.face, look: LOOK, sex: LOOK.sex }, m)), ref = art.character('clancat', { pose: 'sit', mood: 'neutral', variant: 1 });
  const k = a.h / ref.h, W = (b) => [a.x + (b.x0 - ch.w / 2) * k, a.y + (b.y0 - ch.h) * k, a.x + (b.x1 - ch.w / 2) * k, a.y + (b.y1 - ch.h) * k];
  return { body: W(ch.bounds), head: W(ch.headBox), held: ch.held ? [a.x + (ch.held.x - ch.w / 2) * k, a.y + (ch.held.y - ch.h) * k, ch.held.r * k] : null, ch, k };
}
const meets = (p, q) => p[0] < q[2] && p[2] > q[0] && p[1] < q[3] && p[3] > q[1];

// ---------------------------------------------------------------- the vocabulary

test('grove: the spec names the set, its five cameras and their anchors; the set has exactly them, no options', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/09-featherlight.spec.md'), 'utf8').replace(/\s+/g, ' ');
  for (const want of ['#### The new set, `grove` (`app/art/sets/grove.js`)', 'Declared: `opts: {}`, `defaults: {}`', '`{ elev: true, air: true }`, so no ground shadow is laid on the bark'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  for (const cam of CAMS) assert.ok(md.includes('| `' + cam + '` |'), 'the spec\'s table has `' + cam + '`');
  const v = art.vocab.sets.grove, info = art.sceneInfo('grove');
  assert.ok(v, 'vocab.sets.grove');
  assert.deepEqual(v.cams, CAMS, 'exactly the five cameras, in the spec\'s order');
  assert.deepEqual(v.opts, {});
  assert.deepEqual(info.defaults, {});
  assert.equal(info.label, 'GroveClan’s woods: the little bridge, the old trees and the old oak');
  for (const cam of CAMS) {
    assert.equal(info.cams[cam].comp, COMP[cam], cam + ': a composition of its own');
    assert.deepEqual([info.cams[cam].x, info.cams[cam].y, info.cams[cam].w], [0, 0, 1600], cam + ' looks at all of it');
    assert.deepEqual(Object.keys(info.anchors[COMP[cam]]), ANCHORS[cam], cam + ': exactly the spec\'s anchors');
  }
  assert.deepEqual(Object.keys(info.anchors).sort(), Object.values(COMP).sort(), 'no composition beyond the five');
  const all = [...new Set([].concat(...Object.values(ANCHORS)))];
  assert.deepEqual(v.anchors.slice().sort(), all.sort());
});

test('grove: `trunk` is on the bark (elev and air: no ground shadow there); `lip` is on the opening\'s sill (elev); the apprentice at `fern` is behind everyone; the rest stand on the ground, facing as the spec says', () => {
  const A = (c) => art.sceneInfo('grove').anchors[c];
  const t = A('oak').trunk;
  assert.ok(t.elev === true && t.air === true, 'trunk: { elev: true, air: true }');
  assert.ok(A('hollow').lip.elev === true && !A('hollow').lip.air, 'lip: elev');
  assert.equal(A('main').fern.z, 'behind');
  assert.equal(A('meet').fern.z, 'behind');
  for (const c of Object.keys(art.sceneInfo('grove').anchors)) for (const [k, a] of Object.entries(A(c))) {
    if (!(c === 'oak' && k === 'trunk') && !(c === 'hollow' && k === 'lip')) assert.ok(!a.elev && !a.air, c + ' ' + k + ': on the ground');
    assert.ok(a.h > 0, c + ' ' + k + ': a height');
  }
  // facing: the visitors right, the elder and the apprentice left
  for (const k of ['near-1', 'near-2', 'span-1', 'span-2']) assert.equal(A('bridge')[k].face, 'right', k);
  for (const k of ['edge-1', 'edge-2', 'edge-3']) assert.equal(A('main')[k].face, 'right', k);
  for (const k of ['meet-1', 'meet-2', 'meet-3']) assert.equal(A('meet')[k].face, 'right', k);
  for (const c of ['main', 'meet', 'oak']) assert.equal(A(c).elder.face, 'left', c + ': the elder faces left');
  for (const c of ['main', 'meet']) assert.ok(A(c).fern.x > A(c).elder.x && A(c).fern.y < A(c).elder.y && A(c).fern.h < A(c).elder.h, c + ': the apprentice behind the elder');
  // the visitors left of the elder; on the oak the elder at the right, the climber up the trunk toward the hollow
  for (const k of ['edge-1', 'edge-2', 'edge-3']) assert.ok(A('main')[k].x < A('main').elder.x - 300, k + ' at the bridge\'s end, left');
  for (const k of ['meet-1', 'meet-2', 'meet-3']) assert.ok(A('meet')[k].x < A('meet').elder.x - 300, k + ' left');
  const G = art.groveInfo();
  assert.ok(A('oak').elder.x > G.oak.cx + G.oak.wb, 'the elder beside the oak, at its right');
  assert.ok(t.y < G.oak.base - 150 && t.y > G.hollow.cy + G.hollow.ry + 100, 'trunk: partway up toward the hollow: ' + t.y);
  assert.ok(Math.abs(t.x - G.oak.cx) < G.oak.wb * 0.6, 'on the trunk');
});

// ---------------------------------------------------------------- every camera, every spot

test('grove: every anchor is inside its camera, and every camera renders well-formed with a cast member at each anchor, each head in the panel', { skip: !hasCats && 'no cats.js' }, () => {
  for (const cam of CAMS) {
    const A = spots(cam);
    for (const [k, a] of Object.entries(A)) assert.ok(a.x > 40 && a.x < 1560 && a.y > 0 && a.y <= 1000, cam + ' ' + k + ' inside: ' + [a.x, a.y]);
    const who = ['player', 'tallyheart', 'riffle', 'clancat', 'glintstar', 'grizzled'];
    const cast = Object.keys(A).map((at, i) => ({ who: who[i % who.length], at, pose: at === 'trunk' ? 'stretch' : at === 'moss' || at === 'lip' ? 'crouch' : 'sit', mood: 'happy', variant: 2 }));
    for (const fx of [['day'], [], ['morning']]) {
      const r = render(cam, cast, fx);
      checkRender(r, cast, cam + ' ' + fx);
      r.heads.forEach((h, i) => assert.ok(h && h.x > 2 && h.x < 98 && h.y > 2 && h.y < 98, cam + ': a head at ' + cast[i].at + ' in the panel: ' + JSON.stringify(h)));
    }
    // and each alone, any of the cats
    for (const at of Object.keys(A)) for (const w of ['player', 'tallyheart', 'riffle']) {
      const c = [{ who: w, at, pose: at === 'trunk' ? 'stretch' : 'sit' }];
      const r = render(cam, c);
      checkRender(r, c, cam + ' ' + w + '@' + at);
      assert.ok(r.heads[0], cam + ': ' + w + ' at ' + at + ' is in shot');
    }
  }
});

test('grove: the new cast in the woods (when cats.js draws them): the elder and the apprentice, Mizzle in the nook, Riffle with his mint on the span', { skip: !hasCats && 'no cats.js' }, () => {
  const v = art.vocab, has = (w) => (v.cast || []).includes(w);
  const scenes = [
    ['bridge', [{ who: 'player', at: 'span-1', pose: 'walk', tap: 'paw' }, { who: 'riffle', at: 'span-2', pose: 'stand', holds: 'mint' }, { who: 'tallyheart', at: 'near-2', pose: 'sit' }]],
    ['wide', [{ who: 'groveclan', variant: 1, at: 'elder', pose: 'walk' }, { who: 'groveclan', variant: 2, at: 'fern', pose: 'sit', mood: 'shy' }, { who: 'player', at: 'edge-1' }]],
    ['meet', [{ who: 'groveclan', variant: 1, at: 'elder', pose: 'sit' }, { who: 'groveclan', variant: 2, at: 'fern', pose: 'sit' }, { who: 'tallyheart', at: 'meet-2', pose: 'sit', mood: 'proud' }]],
    ['oak', [{ who: 'player', at: 'trunk', pose: 'stretch' }, { who: 'riffle', at: 'root-2', pose: 'sit', holds: 'mint' }, { who: 'groveclan', variant: 1, at: 'elder', pose: 'pawup' }]],
    ['hollow', [{ who: 'mizzle', at: 'nook', pose: 'curl', asleep: true }, { who: 'player', at: 'lip', pose: 'crouch', holds: 'leaf', holdAt: 'paws', tap: 'leaf' }]]
  ];
  for (const [cam, cast] of scenes) {
    if (cast.some((m) => !has(m.who))) continue;
    const r = render(cam, cast);
    checkRender(r, cast, cam + ' (the cast)');
    r.heads.forEach((h, i) => assert.ok(h, cam + ': ' + cast[i].who + ' in shot'));
  }
});

test('grove: always the bright afternoon: any hour a frame names draws the same woods (todFixed day); the same scene draws the same picture', () => {
  for (const cam of CAMS) {
    const day = strip(render(cam, [], ['day']).svg);
    for (const fx of [[], ['morning'], ['sunset'], ['dusk'], ['night']]) assert.equal(strip(render(cam, [], fx).svg), day, cam + ' ' + fx + ': the afternoon');
    assert.equal(strip(render(cam).svg), strip(render(cam).svg), cam + ': the same each time');
  }
});

test('grove: never dark: every colour the woods are painted with is light (the shade a soft green, the bark a warm grey-brown, nothing near black)', () => {
  for (const cam of CAMS) {
    const svg = render(cam).svg, body = svg.slice(svg.indexOf('</defs>'));
    const ps = paints(svg).filter((p) => p.op >= 0.3);
    assert.ok(ps.length > 30, cam + ': painted');
    const darkest = ps.reduce((m, p) => (lum(p.c) < lum(m.c) ? p : m), ps[0]);
    assert.ok(lum(darkest.c) >= 85, cam + ': the darkest colour is ' + darkest.c + ' (' + lum(darkest.c).toFixed(0) + ')');
    // and mostly bright: the colours the picture is made of, on average, well up
    const mean = ps.reduce((s, p) => s + lum(p.c), 0) / ps.length;
    assert.ok(mean > 150, cam + ': bright on the whole: ' + mean.toFixed(0));
    assert.ok(!/#000000|#111111|black/i.test(body), cam + ': no black');
  }
});

// ---------------------------------------------------------------- the bridge and the channel

test('grove `bridge`: the channel narrow, bright and clear; the footbridge over it; nobody\'s spot is on the water (the two on the span stand on its deck)', () => {
  const G = art.groveInfo(), A = spots('bridge'), r = render('bridge'), ch = group(r.svg, 'data-art="channel"');
  assert.ok(ch, 'the channel is drawn');
  const water = groupPaints(r.svg, ch).filter((p) => p.op >= 0.5);
  assert.ok(water.length > 3 && water.every((p) => lum(p.c) >= 175), 'bright and clear: ' + water.map((p) => p.c).join(' '));
  assert.ok(water.some((p) => { const q = rgb(p.c); return q[1] > q[0] && q[2] > q[0]; }), 'clear water: green-blue');
  assert.ok(/pcs-glint|pcs-twk/.test(ch), 'sparkles');
  // narrow: never wider than a third of the panel
  const xs = G.channel.map((q) => q[0]);
  assert.ok(Math.max(...xs) - Math.min(...xs) < 560, 'narrow: ' + (Math.max(...xs) - Math.min(...xs)));
  assert.ok(group(r.svg, 'data-art="footbridge"'), 'the footbridge');
  for (const [k, a] of Object.entries(A)) {
    if (k.startsWith('span-')) {
      assert.ok(a.x > G.deck.x0 + 60 && a.x < G.deck.x1 - 60, k + ': on the span');
      assert.ok(Math.abs(a.y - (G.deck.at(a.x) - 12)) < 8, k + ': standing on its deck: ' + a.y + ' / ' + G.deck.at(a.x).toFixed(0));
    } else assert.ok(!G.inChannel(a.x, a.y) && !G.inChannel(a.x, a.y - 4), k + ': on dry ground');
  }
  assert.ok(A.far.x > A['span-2'].x && A['span-2'].x > A['span-1'].x && A['span-1'].x > A['near-2'].x && A['near-2'].x > A['near-1'].x, 'from the near bank across the bridge to its far end');
  assert.ok(A['span-1'].x < G.deck.x0 + 200, 'span-1 at its near end: her first steps on it');
  // the deck crosses the channel where the two stand
  for (const k of ['span-1', 'span-2']) assert.ok(A[k].y < 760, k + ' above the water');
  // wide: the bridge's end small at the left with the channel beside it, and nobody in that water either
  const W = art.sceneInfo('grove').anchors.main;
  assert.ok(group(render('wide').svg, 'data-art="bridge-end"'), 'wide: the bridge\'s end');
  for (const [k, a] of Object.entries(W)) assert.ok(!G.inWideWater(a.x, a.y), 'wide ' + k + ': not in the water');
  assert.ok(Math.max(...G.wideWater.map((q) => q[0])) < W['edge-1'].x, 'wide: the water is left of the visitors');
});

// ---------------------------------------------------------------- the oak, its silver moss and its hollow

test('grove `oak`: an enormous trunk furry with moss, green, gold and grey; the soft silver moss always there, low on its shaded (north, left) side', () => {
  const G = art.groveInfo();
  for (const cast of [[], [{ who: 'player', at: 'moss', pose: 'crouch' }], [{ who: 'player', at: 'trunk', pose: 'stretch' }, { who: 'riffle', at: 'root-2' }]]) {
    const r = render('oak', cast), svg = r.svg;
    assert.equal((svg.match(/data-art="silver-moss"/g) || []).length, 1, 'the silver moss, always drawn (' + cast.length + ' cast)');
    const b = boxOf(svg, 'data-art="silver-moss"');
    assert.ok(b, 'its box');
    const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
    assert.ok(cx < G.oak.cx - G.oak.wb * 0.4, 'on the shaded left side: ' + cx);
    assert.ok(cy > 600 && b[3] < G.oak.base + 10, 'low on the trunk: ' + b.map(Math.round));
    const sv = groupPaints(svg, group(svg, 'data-art="silver-moss"')).filter((p) => p.op >= 0.6);
    assert.ok(sv.length >= 3, 'painted');
    for (const p of sv) {
      const q = rgb(p.c);
      assert.ok(lum(p.c) >= 165 && Math.max(...q) - Math.min(...q) <= 40, 'silver: pale and nearly grey: ' + p.c);
    }
    // the rest of the moss: green, gold and grey patches on the bark
    const moss = group(svg, 'data-art="oak-moss"'), cols = paints(moss).map((p) => rgb(p.c));
    const green = cols.some((q) => q[1] > q[0] + 20 && q[1] > q[2] + 40), gold = cols.some((q) => q[0] > 160 && q[1] > 140 && q[2] < 120 && q[0] > q[2] + 60), grey = cols.some((q) => Math.max(...q) - Math.min(...q) < 25 && q[0] > 120);
    assert.ok(green && gold && grey, 'green, gold and grey moss: ' + [green, gold, grey]);
    assert.ok((moss.match(/<path/g) || []).length > 60, 'furry: lots of it');
  }
  // the spot to gather it: at the moss, low, facing it
  const a = spots('oak').moss, sb = boxOf(render('oak').svg, 'data-art="silver-moss"');
  assert.equal(a.face, 'right', 'facing the trunk');
  assert.ok(a.x < sb[0] && sb[0] - a.x < a.h * 0.6, 'just left of it, her nose to it');
  assert.ok(a.y > sb[3] - 20 && a.y - sb[3] < 140, 'low: at the trunk\'s foot below it');
});

test('grove `oak`: the hollow high in the trunk, a round opening, its inside a soft dusk-green, never black', () => {
  const G = art.groveInfo(), svg = render('oak').svg, H = group(svg, 'data-art="hollow"'), b = boxOf(svg, 'data-art="hollow"');
  assert.ok(H && b, 'drawn');
  assert.ok(G.hollow.cy < 450 && Math.abs(G.hollow.cx - G.oak.cx) < G.oak.wb * 0.6, 'high in the trunk');
  assert.ok(Math.abs((b[2] - b[0]) / (b[3] - b[1]) - G.hollow.rx / G.hollow.ry) < 0.05 && b[2] - b[0] > 100, 'round, big enough to see');
  // the inside's gradient: dusk-green, light enough to read
  const stops = [...svg.matchAll(/<radialGradient id="([^"]+)"[^>]*>(.*?)<\/radialGradient>/g)].filter((m) => H.includes('url(#' + m[1] + ')'));
  assert.ok(stops.length >= 1, 'the inside is a gradient');
  for (const m of stops) for (const c of (m[2].match(/stop-color="(#[0-9a-fA-F]{6})"/g) || []).map((s) => s.slice(12, -1))) {
    const q = rgb(c);
    assert.ok(lum(c) >= 100, 'never black: ' + c);
    assert.ok(q[1] > q[0] && q[1] >= q[2], 'green: ' + c);
  }
  // the canopy keeps clear of it
  const canopy = group(svg, 'data-art="canopy"');
  assert.ok(svg.indexOf('data-art="hollow"') > svg.indexOf('data-art="oak-moss"'), 'over the trunk\'s moss');
  assert.ok(canopy && svg.indexOf('data-art="canopy"') > svg.indexOf('data-art="hollow"'), 'the canopy is drawn after');
  const blobs = [...canopy.matchAll(/M([-\d.]+) ([-\d.]+)/g)].map((m) => [+m[1], +m[2]]);
  for (const q of blobs) if (q[0] > b[0] - 30 && q[0] < b[2] + 30) assert.ok(q[1] < b[1] - 20, 'no leaf over the hollow: ' + q);
});

// ---------------------------------------------------------------- the hollow, inside, and the rim at `lip`

test('grove `hollow`: a snug nook of old wood lined with soft moss, the light through the opening at the left; warm, never dark', () => {
  const G = art.groveInfo(), svg = render('hollow').svg;
  assert.ok(group(svg, 'data-art="opening"') && group(svg, 'data-art="rim"'), 'the opening and its rim');
  assert.ok(Math.max(...G.nook.open.map((q) => q[0])) < 400, 'the opening at the left');
  assert.ok(G.nook.sill > 600 && G.nook.jamb < 420, 'its sill low, its rim near the left');
  const A = spots('hollow');
  assert.ok(A.nook.x > 800 && A.nook.h < A.lip.h, 'Mizzle on the moss at the right, a little smaller than our cat at the opening');
  assert.ok(A.lip.y === G.nook.sill, 'our cat\'s forepaws on the sill');
});

test('grove `lip`: the rim cuts her behind her shoulders, as the tracks\' stash-in: her head, shoulders and forepaws in view, and the leaf at her paws (and its Tap box) too; the rim stops below her forepaws', { skip: !hasCats && 'no cats.js' }, () => {
  const A = spots('hollow'), G = art.groveInfo();
  for (const pose of ['crouch', 'sit', 'loaf', 'lookup', 'stand']) for (const mood of ['wonder', 'happy', 'kind']) {
    const m = { who: 'player', at: 'lip', pose, mood, holds: 'leaf', holdAt: 'paws', tap: 'leaf' };
    const r = render('hollow', [m]), svg = r.svg;
    checkRender(r, [m], 'lip ' + pose);
    const cover = /<g data-part="cover-rim" data-box="([^"]+)" data-cut="([-\d.]+)">/.exec(svg);
    assert.ok(cover, pose + ': the rim over her');
    const cb = cover[1].split(' ').map(Number), cut = +cover[2], B = boxesAt(m, A.lip);
    // drawn just after her
    const meAt = svg.indexOf('<g transform="translate(' + A.lip.x + ' ' + A.lip.y + ')');
    assert.ok(meAt > 0 && svg.indexOf('data-part="cover-rim"') > meAt, pose + ': the rim drawn over her');
    // it covers her rear, from her back to the cut, and never her head
    assert.ok(cb[0] <= B.body[0] + 1 && cb[2] === cut, pose + ': from her back to the cut');
    // as far as stash-in's (two fifths of her, from her back), or up to just behind her head when it comes first
    const w = B.body[2] - B.body[0];
    assert.ok(cut >= Math.min(B.body[0] + w * 0.4, B.head[0] - w * 0.03) - 1, pose + ': cut as far as her head allows: ' + ((cut - B.body[0]) / w).toFixed(2));
    assert.ok(cut <= B.head[0] + 1, pose + ': not across her head: ' + cut.toFixed(0) + ' / ' + B.head[0].toFixed(0));
    // the rim stops at the sill: nothing below her forepaws
    assert.ok(Math.abs(cb[3] - (G.nook.sill + 2)) < 1, pose + ': it stops at the sill: ' + cb[3]);
    // the leaf at her paws, and the Tap's mark, in front of the cut
    if (B.held) assert.ok(B.held[0] - B.held[2] > cut, pose + ': the leaf clear of the rim: ' + B.held.map(Math.round) + ' / ' + cut);
    assert.ok(/pc-tap-leaf/.test(svg), pose + ': the leaf\'s Tap mark is drawn');
    assert.ok(r.heads[0] && r.heads[0].x * 16 > cut, pose + ': her face in front of the rim');
  }
  // nobody at the lip: no cover; the sill is the rim's, under where her paws would be
  assert.ok(!/cover-rim/.test(render('hollow').svg), 'no cover without her');
  assert.ok(!/cover-rim/.test(render('hollow', [{ who: 'mizzle', at: 'nook', pose: 'curl' }]).svg), 'nor with only Mizzle');
});

test('grove `fern`: the apprentice behind the elder is half hidden by a fern up to her chin, her face and ears above it; only when she is there', { skip: !hasCats && 'no cats.js' }, () => {
  for (const cam of ['wide', 'meet']) {
    const A = spots(cam);
    assert.ok(!/cover-fern/.test(render(cam, [{ who: 'clancat', at: 'elder' }]).svg), cam + ': no fern cover without her');
    for (const pose of ['sit', 'stand', 'crouch']) {
      const m = { who: 'clancat', variant: 3, at: 'fern', pose }, r = render(cam, [{ who: 'clancat', variant: 1, at: 'elder', pose: 'walk' }, m]);
      const c = /<g data-part="cover-fern" data-box="([^"]+)" data-face="([^"]+)">/.exec(r.svg);
      assert.ok(c, cam + ' ' + pose + ': the fern over her');
      const cb = c[1].split(' ').map(Number), face = c[2].split(' ').map(Number), B = boxesAt(m, A.fern);
      assert.ok(cb[1] >= B.head[1] + (B.head[3] - B.head[1]) * 0.6, cam + ' ' + pose + ': up to her chin, not over her eyes and ears');
      assert.ok(cb[3] >= A.fern.y, cam + ' ' + pose + ': from the ground');
      assert.ok(face[0] <= B.head[0] && face[2] >= B.head[2] && face[1] <= B.head[1], cam + ' ' + pose + ': her face is kept clear of the fronds');
      // every frond that would cross her face was shortened or left out: no leaf's tip inside her face
      const g2 = group(r.svg, 'data-part="cover-fern"'), tips = [...g2.matchAll(/Q[-\d.]+ [-\d.]+ ([-\d.]+) ([-\d.]+)Q/g)].map((q) => [+q[1], +q[2]]);
      assert.ok(tips.length > 20, 'fronds');
      assert.ok(tips.filter((q) => q[0] > face[0] + 6 && q[0] < face[2] - 6 && q[1] > face[1] + 6 && q[1] < face[3] - 6).length === 0, cam + ' ' + pose + ': no frond across her face');
      assert.ok(r.heads[1], cam + ': her face in shot');
    }
  }
});

test('grove: odd input never throws: unknown cameras and spots, custom spots, no character drawings', () => {
  const cases = [{ set: 'grove' }, { set: 'grove', cam: 'nowhere' }, { set: 'grove', cam: 'hollow', cast: [{ who: 'player', at: 'nowhere' }] },
    { set: 'grove', cam: 'oak', cast: [{ who: 'player', at: { x: 700, y: 920 } }, null, {}] }, { set: 'grove', cam: 'wide', opts: { nope: true }, fx: art.vocab.fx.slice() }];
  for (const c of cases) checkRender(art.render(c, { look: LOOK }), (c.cast || []).filter((m) => m && typeof m === 'object'), JSON.stringify(c));
  const keep = art.character;
  try {
    art.character = undefined;
    for (const cam of CAMS) {
      const cast = Object.keys(spots(cam)).map((at) => ({ who: 'player', at }));
      checkRender(render(cam, cast), cast, cam + ' without cats.js');
    }
  } finally { art.character = keep; }
});
