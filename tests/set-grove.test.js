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
// chapter 13 (docs/chapters/13-the-hunters-crouch.spec.md, section 4): the grove's first options, the dig close and the marks
// close (one new composition, `dig`, with its spots), and one more spot on `oak`
const CH13 = {
  cams: ['dig', 'marks'], comp: 'dig', oak: ['oak-near'],
  dig: ['door-1', 'door-2', 'doorway', 'dig-front', 'marks-1', 'marks-2', 'dig-elder', 'dig-fern'],
  opts: { dig: [false, true], marks: [false, 'leaves', 'bare'], tap: ['none', 'leaves', 'marks'] }
};

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

test('grove: the spec names the set, its five cameras and their anchors; the set has exactly them, no options (chapter 13: and its own, after them)', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/09-featherlight.spec.md'), 'utf8').replace(/\s+/g, ' ');
  for (const want of ['#### The new set, `grove` (`app/art/sets/grove.js`)', 'Declared: `opts: {}`, `defaults: {}`', '`{ elev: true, air: true }`, so no ground shadow is laid on the bark'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  for (const cam of CAMS) assert.ok(md.includes('| `' + cam + '` |'), 'the spec\'s table has `' + cam + '`');
  const v = art.vocab.sets.grove, info = art.sceneInfo('grove');
  assert.ok(v, 'vocab.sets.grove');
  // (chapter 13: and its two cameras after them, and the grove's first options, all off by default)
  assert.deepEqual(v.cams, CAMS.concat(CH13.cams), 'exactly the five cameras, in the spec\'s order');
  assert.deepEqual(v.opts, CH13.opts);
  assert.deepEqual(info.defaults, {});
  assert.equal(info.label, 'GroveClan’s woods: the little bridge, the old trees and the old oak');
  for (const cam of CAMS) {
    assert.equal(info.cams[cam].comp, COMP[cam], cam + ': a composition of its own');
    assert.deepEqual([info.cams[cam].x, info.cams[cam].y, info.cams[cam].w], [0, 0, 1600], cam + ' looks at all of it');
    assert.deepEqual(Object.keys(info.anchors[COMP[cam]]), ANCHORS[cam].concat(cam === 'oak' ? CH13.oak : []), cam + ': exactly the spec\'s anchors');
  }
  assert.deepEqual(Object.keys(info.anchors).sort(), Object.values(COMP).concat([CH13.comp]).sort(), 'no composition beyond the five (and chapter 13\'s)');
  const all = [...new Set([].concat(...Object.values(ANCHORS), CH13.oak, CH13.dig))];
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
    // (chapter 13: the groundhog's doorway is on the ground, but no shadow is laid there: `air`, its lower half under the leaves)
    if (!(c === 'oak' && k === 'trunk') && !(c === 'hollow' && k === 'lip')) assert.ok(!a.elev && (!a.air || (c === 'dig' && k === 'doorway')), c + ' ' + k + ': on the ground');
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

// ================================================================ chapter 13: the dig by the old oak, and the marks
// (docs/chapters/13-the-hunters-crouch.spec.md, section 4, "GroveClan's woods: the dig and the marks")

const G13 = () => art.groveInfo();
const dspots = () => art.sceneInfo('grove').anchors.dig;
const ellBox = (e, k) => [e.cx - e.rx * (k || 1), e.cy - e.ry * (k || 1), e.cx + e.rx * (k || 1), e.cy + e.ry * (k || 1)];
// does a box reach into an ellipse (cx, cy, rx, ry)? (its nearest point to the middle inside it)
const inEll = (b, cx, cy, rx, ry) => { const x = Math.max(b[0], Math.min(cx, b[2])), y = Math.max(b[1], Math.min(cy, b[3])); return Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2) < 1; };
const CHIS = (hasCats && art.vocab.cast.includes('chispapaw')) ? 'chispapaw' : 'clancat';
// the groundhog, or a stand-in until cats.js draws it (the spec's: a curled sleeper)
const HOG = () => (hasCats && art.vocab.cast.includes('groundhog') ? 'groundhog' : 'mizzle');
const hogPose = (p) => (HOG() === 'groundhog' ? p : { doze: 'curl', wake: 'curl', sleep: 'curl', sit: 'sit', yawn: 'sit' }[p]);
// checkRender, for chapter 13's cameras: `marks` looks at a part of its composition, not the whole
function checkRender13(r, cast, label, cam) {
  if (cam !== 'marks') return checkRender(r, cast, label);
  const C = art.sceneInfo('grove').cams.marks, vb = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(r.svg)[1].split(/\s+/).map(Number);
  assert.deepEqual(vb.map((v) => Math.round(v * 10) / 10), [C.x, C.y, C.w, C.h].map((v) => Math.round(v * 10) / 10), label + ': the close-up\'s box');
  checkRender({ svg: r.svg.replace(/viewBox="[^"]+"/, 'viewBox="0 0 1600 1000"'), heads: r.heads, keep: r.keep }, cast, label);
}

test('chapter 13: the grove\'s new names: `dig` on `oak`, the close composition `dig` (cameras `dig` and `marks`) with its eight spots facing as the spec says, `oak-near` placed; every option off by default', () => {
  const info = art.sceneInfo('grove'), D = info.anchors.dig;
  assert.deepEqual(Object.keys(D), CH13.dig, 'the spots, in the spec\'s order');
  assert.equal(info.cams.dig.comp, 'dig');
  assert.deepEqual([info.cams.dig.x, info.cams.dig.y, info.cams.dig.w], [0, 0, 1600], '`dig` is the whole composition');
  assert.equal(info.cams.marks.comp, 'dig', '`marks` is a crop of the same composition');
  const M = info.cams.marks;
  assert.ok(M.x >= 0 && M.y >= 0 && M.x + M.w <= 1600 && M.y + M.h <= 1000 && M.w < 800, '`marks` a close crop inside the world');
  for (const k of ['door-1', 'door-2', 'dig-front', 'dig-elder']) assert.equal(D[k].face, 'left', k + ' faces left');
  for (const k of ['marks-1', 'marks-2', 'dig-fern']) assert.equal(D[k].face, 'right', k + ' faces right');
  assert.ok(D.doorway.z === 'behind' && D.doorway.air === true, 'doorway: behind its cover, no ground shadow');
  assert.equal(D['dig-fern'].z, 'behind', 'dig-fern: behind everyone, as the grove\'s fern');
  assert.ok(D['door-2'].x > D['door-1'].x && D['door-2'].y < D['door-1'].y, 'door-2 beside door-1, a step back');
  assert.ok(D['dig-elder'].y < D['dig-front'].y - 200 && D['dig-fern'].y < D['door-1'].y - 200, 'the elder and the apprentice at the back');
  const on = info.anchors.oak['oak-near'];
  assert.ok(on.placed === true && on.face === 'right' && !on.elev && on.h > 200, 'oak-near: on the ground, facing right, placed (never a depth anchor or a spot given unasked)');
  for (const k of Object.keys(CH13.opts)) assert.ok(!(k in info.defaults), k + ': off by default');
});

test('chapter 13: off, the grove draws byte for byte: `dig` left out or false on `oak`; no option on any of chapter 9\'s cameras but `dig` on `oak`; the close composition\'s options only there', () => {
  for (const cam of CAMS) {
    const plain = strip(render(cam, []).svg);
    for (const o of [{ dig: false }, { marks: 'leaves' }, { marks: 'bare', tap: 'marks' }, { tap: 'leaves' }, { dig: 'yes' }].concat(cam === 'oak' ? [] : [{ dig: true }]))
      assert.equal(strip(render(cam, [], ['day'], o).svg), plain, cam + ' ' + JSON.stringify(o) + ': nothing');
  }
  assert.notEqual(strip(render('oak', [], ['day'], { dig: true }).svg), strip(render('oak', []).svg), '`dig: true` on oak draws the dig');
  for (const cam of CH13.cams) {
    const plain = strip(render(cam, []).svg);
    assert.equal(strip(render(cam, [], ['day'], { dig: true }).svg), plain, cam + ': `dig` is `oak`\'s');
    assert.equal(strip(render(cam, [], ['day'], { marks: 'nope', tap: 'marks' }).svg), plain, cam + ': an unknown `marks`, and no Tap without the marks');
    for (const fx of [[], ['morning'], ['sunset'], ['night']]) assert.equal(strip(render(cam, [], fx, { marks: 'bare' }).svg), strip(render(cam, [], ['day'], { marks: 'bare' }).svg), cam + ' ' + fx + ': the afternoon');
  }
});

test('chapter 13: the dig on `oak`: at the foot\'s sunny right among the roots, its doorway beside it on its left, in keep; root-1, root-2, elder and oak-near clear of both (root-3 stands on the doorway), and four cats at those four touch nobody', { skip: !hasCats && 'no cats.js' }, () => {
  const G = G13(), A = spots('oak'), dig = G.dig.oak, door = G.doorway.oak;
  assert.ok(dig[0] > G.oak.cx && door[2] <= dig[0] + 12 && door[0] < dig[0], 'the dig right of the trunk\'s middle, the doorway on its left: ' + dig.map(Math.round) + ' / ' + door.map(Math.round));
  assert.ok(dig[3] > G.oak.base && dig[1] < G.oak.base + 10, 'at the roots, on the ground at the trunk\'s foot');
  assert.ok((door[2] - door[0]) >= (dig[2] - dig[0]) * 0.22 && (door[2] - door[0]) <= (dig[2] - dig[0]) * 0.6, 'the doorway smaller (about half the hole\'s width)');
  const r = render('oak', [], ['day'], { dig: true });
  checkRender(r, [], 'oak dig');
  assert.ok(/<g data-art="dig" data-box="[^"]+" data-door="[^"]+">/.test(r.svg), 'the dig and its doorway');
  assert.ok(/data-art="scratches" data-count="5"/.test(r.svg), 'five scratches');
  assert.ok(!/data-art="marks"|class="pc-quick"/.test(r.svg), 'never the marks on `oak`');
  const k0 = r.keep[0], kb = [k0.x * 16, k0.y * 10, (k0.x + k0.w) * 16, (k0.y + k0.h) * 10];
  assert.ok(kb[0] <= Math.min(dig[0], door[0]) + 2 && kb[2] >= dig[2] - 2 && kb[1] <= Math.min(dig[1], door[1]) + 2, 'in keep: ' + kb.map(Math.round));
  const clear = ['root-1', 'root-2', 'elder', 'oak-near'];
  for (const at of clear.concat(['root-3'])) for (const pose of ['sit', 'stand', 'walk', 'crouch']) {
    const B = boxesAt({ who: 'clancat', pose }, A[at]);
    const hit = meets(B.body, dig) || meets(B.body, door);
    if (at === 'root-3') { if (pose === 'sit') assert.ok(hit, 'root-3 is on the doorway'); } else assert.ok(!hit, at + ' ' + pose + ': clear of the dig and the doorway');
  }
  // f053 and f056: the elder and our three at the four clear spots, none touching
  for (const pose of ['sit', 'stand']) {
    const cast = [{ who: 'groveclan', variant: 1, at: 'elder', pose, mood: 'kind' }, { who: 'player', at: 'root-2', pose: 'sit', mood: 'wonder' }, { who: CHIS, at: 'oak-near', pose: 'sit', mood: 'wonder', collar: false }, { who: 'tallyheart', at: 'root-1', pose, mood: 'kind' }];
    const rr = render('oak', cast, ['day'], { dig: true });
    checkRender(rr, cast, 'f053 ' + pose);
    const bx = cast.map((m) => boxesAt(m, A[m.at]).body);
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.ok(!meets(bx[i], bx[j]), pose + ': ' + cast[i].at + ' and ' + cast[j].at + ' apart');
    rr.heads.forEach((h, i) => assert.ok(h, cast[i].at + ': in shot'));
  }
});

test('chapter 13: the dig close (`dig`): the oak\'s foot and its doorway at the left, the big dig in the middle with its heaps and five long rakes down its far wall, the flat earth on its far side at the right; soft warm browns, never dark; nothing over the dig, the doorway or the marks in keep', () => {
  const G = G13(), r = render('dig', [], ['day'], { marks: 'bare' });
  checkRender(r, [], 'dig');
  const door = G.doorway.dig, dig = G.dig.dig, marks = G.marks, flat = G.flat;
  assert.ok(door[2] < dig[0] && dig[2] < marks[2] && marks[0] > dig[2] - 40 && flat[0] > dig[0], 'left to right: the doorway, the dig, the marks: ' + [door, dig, marks].map((b) => b.map(Math.round).join(' ')).join(' / '));
  assert.ok((door[2] - door[0]) > (dig[2] - dig[0]) * 0.35 && (door[2] - door[0]) < (dig[2] - dig[0]) * 0.6, 'the doorway about half the dig\'s width');
  assert.ok(marks[3] < dig[3] + 5 && marks[1] < dig[1] + 60, 'the marks on the far side of the dig');
  assert.ok(/data-art="doorway"/.test(r.svg) && /data-art="dig"/.test(r.svg) && /data-art="flat-earth"/.test(r.svg), 'the three drawn');
  const rk = /<g data-art="scratches" data-count="5">([\s\S]*?)<\/g>/.exec(r.svg);
  assert.ok(rk, 'five long rakes');
  // each rake a wide curved gouge (a tapered shape, curved: its path bends), never a straight stroke; the five apart, in a row
  const xs = G.rakes.dig;
  assert.equal(xs.length, 5);
  xs.forEach((x, i) => { if (i) assert.ok(x - xs[i - 1] >= 40, 'rakes apart: ' + (x - xs[i - 1])); });
  assert.ok(xs[0] > dig[0] && xs[4] < dig[2], 'down the dig\'s wall');
  // at 390 x 844 (the 1600-wide picture in 358 px): five rakes apart and the marks' pokes a size to count
  assert.ok((xs[1] - xs[0]) * 358 / 1600 >= 9, 'rakes ' + ((xs[1] - xs[0]) * 358 / 1600).toFixed(1) + ' px apart on a phone');
  assert.ok((marks[2] - marks[0]) / 192.6 * 28 * 358 / 1600 >= 7.5, 'each poke\'s room ' + ((marks[2] - marks[0]) / 192.6 * 28 * 358 / 1600).toFixed(1) + ' px on a phone');
  // in keep: the marks first, then the dig, then the doorway
  const kb = (k) => [k.x * 16, k.y * 10, (k.x + k.w) * 16, (k.y + k.h) * 10];
  const K = r.keep.map(kb);
  assert.ok(K[0][0] <= marks[0] && K[0][2] >= marks[2] && K[0][1] <= marks[1] && K[0][3] >= marks[3], 'the marks in keep first');
  assert.ok(K.some((b) => b[0] <= dig[0] + 1 && b[2] >= dig[2] - 1), 'the dig in keep');
  assert.ok(K.some((b) => b[0] <= door[0] + 1 && b[2] >= door[2] - 1), 'the doorway in keep');
  // never dark: every colour this set paints with is light (the kit's own marks, and its earth groove, are the kit's)
  for (const cam of CH13.cams) for (const o of [{}, { marks: 'leaves' }, { marks: 'bare' }]) {
    const svg = render(cam, [], ['day'], o).svg.replace(/<g class="pc-quick"[\s\S]*?<\/g>(?=<|$)/g, '');
    const ps = paints(svg).filter((p) => p.op >= 0.3), darkest = ps.reduce((m, p) => (lum(p.c) < lum(m.c) ? p : m), ps[0]);
    assert.ok(lum(darkest.c) >= 85, cam + ' ' + JSON.stringify(o) + ': the darkest colour is ' + darkest.c);
    assert.ok(ps.reduce((s, p) => s + lum(p.c), 0) / ps.length > 150, cam + ': bright on the whole');
    assert.ok(!/#000000|#111111|black/i.test(svg), cam + ': no black');
  }
});

test('chapter 13: `marks` on `dig` and `marks`: one long line and eight little pokes, the kit\'s quick picture on earth; \'leaves\' half under fallen leaves (the line\'s top end and four pokes showing), \'bare\' the leaves brushed aside to the edges; in keep', () => {
  if (typeof art.quickMarks !== 'function') return;
  const G = G13(), mb = G.marks, MO = { tens: 1, ones: 8, ground: 'earth' }, sz = art.quickMarks.size(MO);
  const kit = art.kit.quick((mb[0] + mb[2]) / 2, (mb[1] + mb[3]) / 2, (mb[2] - mb[0]) / sz.w, MO);
  for (const cam of CH13.cams) for (const v of ['leaves', 'bare']) {
    const r = render(cam, [], ['day'], { marks: v }), grp = group(r.svg, 'data-art="marks"');
    checkRender13(r, [], cam + ' ' + v, cam);
    assert.ok(grp.includes('data-marks="' + v + '"') && grp.includes(kit), cam + ' ' + v + ': the kit\'s own picture at the marks\' place');
    const after = grp.slice(grp.indexOf(kit) + kit.length);
    if (v === 'leaves') {
      // leaves over the line's lower part and the lower row, and the first poke of the upper row; the rest in the open
      const P = G.marksLeaves;
      assert.ok(/fill="#[0-9A-Fa-f]{6}"/.test(after) && after.length > 2000, cam + ': leaves drawn over the marks');
      const w = mb[2] - mb[0], h = mb[3] - mb[1];
      assert.ok(P[0] <= mb[0] && P[3] >= mb[3] && P[2] < mb[0] + w * 0.8 && P[1] > mb[1] + h * 0.2, cam + ': over half of them, not all: ' + P.map(Math.round));
    } else {
      assert.ok(!/<path d="[^"]+" fill="#D9BE6E"/.test(after.slice(0, 200)), cam + ': no drift over them');
    }
  }
  assert.ok(G.marksLeaves[2] - G.marksLeaves[0] < (mb[2] - mb[0]) * 0.95, 'the leaves\' box over part of the marks');
});

test('chapter 13: `marks`, the close-up: the marks about half the panel, the dig\'s near rim with two of its five rakes at the panel\'s left edge, its rakes curved gouges in the wall, never two more lines', () => {
  const G = G13(), M = art.sceneInfo('grove').cams.marks, mb = G.marks;
  const frac = (mb[2] - mb[0]) / M.w;
  assert.ok(frac > 0.4 && frac < 0.6, 'the marks fill about half the panel: ' + frac.toFixed(2));
  assert.ok(mb[0] > M.x + M.w * 0.2 && mb[2] < M.x + M.w - 20 && mb[1] > M.y && mb[3] < M.y + M.h, 'the marks wholly in the panel, right of its left fifth');
  const inLeft = G.rakes.dig.filter((x) => x > M.x - 10 && x < M.x + M.w * 0.22);
  assert.equal(inLeft.length, 2, 'two of the five rakes at its left edge: ' + G.rakes.dig.join(' ') + ' in ' + M.x);
  assert.ok(G.dig.dig[2] > M.x + 40 && G.dig.dig[2] < mb[0], 'the dig\'s rim at the left, apart from the marks');
  // the marks' line is the kit's one straight groove; the rakes are filled tapered shapes (no stroke), curved
  const r = render('marks', [], ['day'], { marks: 'bare' });
  const rk = /<g data-art="scratches" data-count="5">([\s\S]*?)<\/g>/.exec(r.svg)[1];
  assert.ok(!/stroke=/.test(rk) && (rk.match(/Z/g) || []).length >= 10, 'each rake a filled, tapered gouge (and its light ridge), never a stroke');
});

test('chapter 13: `tap` on the close composition: an unpainted <g class="pc-tap pc-tap-leaves"> over the leaves on the marks, or pc-tap-marks over the marks, each its target\'s box and generous on a phone; nothing without the marks', () => {
  const G = G13();
  for (const [cam, v, t, box] of [['dig', 'leaves', 'leaves', G.marksLeaves], ['marks', 'bare', 'marks', G.marks], ['dig', 'bare', 'marks', G.marks]]) {
    const r = render(cam, [], ['day'], { marks: v, tap: t });
    const m = new RegExp('<g class="pc-tap pc-tap-' + t + '" data-tap="' + t + '"><rect x="([\\d.]+)" y="([\\d.]+)" width="([\\d.]+)" height="([\\d.]+)" fill="none" pointer-events="none"\\/></g>').exec(r.svg);
    assert.ok(m, cam + ' ' + t + ': the target');
    const b = m.slice(1).map(Number), tb = [b[0], b[1], b[0] + b[2], b[1] + b[3]];
    assert.ok(tb[0] < box[0] && tb[1] < box[1] && tb[2] > box[2] && tb[3] > box[3], cam + ' ' + t + ': round its target, with room');
    const C = art.sceneInfo('grove').cams[cam], wpx = b[2] * 358 / C.w, hpx = b[3] * 358 / C.w;
    assert.ok(wpx >= 60 && hpx >= 30, cam + ' ' + t + ': a finger\'s target at 390 x 844: ' + wpx.toFixed(0) + ' x ' + hpx.toFixed(0) + ' px');
  }
  assert.ok(!/pc-tap/.test(render('dig', [], ['day'], { tap: 'leaves' }).svg), 'no marks, no target');
  assert.ok(!/pc-tap/.test(render('dig', [], ['day'], { marks: 'leaves', tap: 'none' }).svg), '`none`: no target');
});

test('chapter 13: the covers, by spot: the leaves over whoever is in the doorway (their lower half, never the face when it is up; over the empty doorway\'s lower half without them), drawn just after them; the fern over the apprentice at dig-fern to her eyes, only when she is there', { skip: !hasCats && 'no cats.js' }, () => {
  const D = dspots(), G = G13();
  // the empty doorway, half under leaves
  const e = render('dig', []), c0 = /<g data-part="cover-leaves" data-box="([^"]+)">/.exec(e.svg);
  assert.ok(c0, 'the leaves over the empty doorway');
  const b0 = c0[1].split(' ').map(Number), door = G.doorway.dig;
  assert.ok(b0[1] > (door[1] + door[3]) / 2 - 10 && b0[3] >= door[3] - 4 && b0[0] <= door[0] && b0[2] >= door[2], 'its lower half: ' + b0.map(Math.round));
  for (const pose of ['doze', 'wake', 'sit', 'yawn', 'sleep']) {
    const m = { who: HOG(), at: 'doorway', pose: hogPose(pose), mood: 'sleepy' }, cast = [m, { who: 'player', at: 'door-1', pose: 'crouch', mood: 'wonder' }];
    const r = render('dig', cast);
    checkRender(r, cast, 'doorway ' + pose);
    const at = r.svg.indexOf('data-part="cover-leaves"'), cb = /<g data-part="cover-leaves" data-box="([^"]+)">/.exec(r.svg)[1].split(' ').map(Number);
    const B = boxesAt(m, D.doorway);
    assert.ok(cb[1] > B.body[1] + (B.body[3] - B.body[1]) * 0.4, pose + ': the leaves over the lower part only');
    assert.ok(cb[3] >= B.body[3], pose + ': down to the ground');
    if (pose !== 'doze') assert.ok(cb[1] >= B.head[3] - 1, pose + ': the face clear of the leaves');
    // drawn after the one in the doorway, before the cat at door-1 (who stands in front)
    const her = r.svg.indexOf('<g transform="translate(' + D.doorway.x + ' ' + D.doorway.y + ')'), you = r.svg.indexOf('<g transform="translate(' + D['door-1'].x + ' ' + D['door-1'].y + ')');
    assert.ok(her > 0 && at > her && you > at, pose + ': just after the one in the doorway');
  }
  // the fern over the apprentice
  assert.ok(!/cover-fern/.test(render('dig', [{ who: 'player', at: 'door-1' }]).svg), 'no fern cover without her');
  for (const pose of ['sit', 'crouch']) {
    const m = { who: 'groveclan', variant: 2, at: 'dig-fern', pose, mood: 'shy' }, r = render('dig', [m, { who: 'player', at: 'door-1', pose: 'sit' }]);
    const c = /<g data-part="cover-fern" data-box="([^"]+)" data-face="([^"]+)">/.exec(r.svg);
    assert.ok(c, pose + ': the fern over her');
    const cb = c[1].split(' ').map(Number), B = boxesAt(m, D['dig-fern']);
    assert.ok(cb[1] >= B.head[1] + (B.head[3] - B.head[1]) * 0.6 && cb[3] >= D['dig-fern'].y, pose + ': to her chin, from the ground');
    assert.ok(r.heads[0], pose + ': her eyes and ears over it, in shot');
  }
});

test('chapter 13: the close composition\'s casts, frame by frame: none touching, nobody over the dig, the doorway or the marks; every face in shot (f054, f055, f058, f059 to f064, f065 to f067)', { skip: !hasCats && 'no cats.js' }, () => {
  const D = dspots(), G = G13(), C = art.sceneInfo('grove').cams.dig;
  const hole = { cx: 960, cy: 770, rx: 200 * 1.08, ry: 58 * 1.2 };   // the hole's lip (grove.js DIG.hole, digHole)
  const heaps = [[812, 712, 88, 44], [1110, 704, 86, 46]];
  const chis = (pose, mood) => ({ who: CHIS, at: null, pose, mood, collar: false });
  const at = (m, a) => Object.assign({}, m, { at: a });
  const frames = {
    f054: [at({ who: 'player', pose: 'crouch', mood: 'sniff' }, 'dig-front'), at(chis('sit', 'wonder'), 'marks-2'), at({ who: 'groveclan', variant: 1, pose: 'sit', mood: 'kind' }, 'dig-elder')],
    f055: [at({ who: 'player', pose: 'sit', mood: 'kind' }, 'dig-front'), at(chis('crouch', 'wonder'), 'marks-2'), at({ who: 'groveclan', variant: 1, pose: 'stand', mood: 'kind' }, 'dig-elder')],
    f058: [at({ who: 'groveclan', variant: 2, pose: 'sit', mood: 'shy' }, 'dig-fern'), at({ who: 'player', pose: 'sit', mood: 'wonder' }, 'door-1'), at(chis('sit', 'wonder'), 'door-2')],
    f059: [at({ who: HOG(), pose: hogPose('doze'), mood: 'sleepy' }, 'doorway'), at({ who: 'player', pose: 'crouch', mood: 'wonder' }, 'door-1'), at(chis('crouch', 'worried'), 'door-2')],
    f061: [at({ who: HOG(), pose: hogPose('sit'), mood: 'shout' }, 'doorway'), at({ who: 'player', pose: 'sit', mood: 'wonder' }, 'door-1'), at(chis('sit', 'wonder'), 'door-2')],
    f063: [at({ who: HOG(), pose: hogPose('yawn'), mood: 'sleepy' }, 'doorway'), at({ who: 'player', pose: 'crouch', mood: 'kind' }, 'door-1'), at(chis('sit', 'kind'), 'door-2')],
    f066: [at({ who: 'player', pose: 'crouch', mood: 'wonder' }, 'marks-1'), at(chis('crouch', 'wonder'), 'marks-2')],
    f067: [at({ who: 'player', pose: 'sit', mood: 'wonder' }, 'marks-1'), at(chis('sit', 'worried'), 'marks-2')]
  };
  for (const [id, cast] of Object.entries(frames)) for (const marks of ['leaves', 'bare']) {
    const r = render('dig', cast, ['day'], { marks });
    checkRender(r, cast, id);
    const bx = cast.map((m) => boxesAt(m, D[m.at]).body);
    for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) assert.ok(!meets(bx[i], bx[j]), id + ': ' + cast[i].at + ' and ' + cast[j].at + ' apart: ' + bx[i].map(Math.round) + ' / ' + bx[j].map(Math.round));
    cast.forEach((m, i) => {
      const b = bx[i];
      if (m.at === 'doorway') return;
      assert.ok(!inEll(b, hole.cx, hole.cy, hole.rx, hole.ry), id + ' ' + m.at + ': not over the dig');
      heaps.forEach((q) => assert.ok(!inEll(b, q[0], q[1], q[2], q[3]), id + ' ' + m.at + ': not over a heap'));
      assert.ok(!meets(b, G.doorway.dig), id + ' ' + m.at + ': not over the doorway');
      assert.ok(!meets(b, G.marks), id + ' ' + m.at + ': not over the marks');
      assert.ok(r.heads[i] && r.heads[i].x > 2 && r.heads[i].x < 98, id + ' ' + m.at + ': in shot');
    });
    assert.ok(C.w === 1600, 'the whole composition');
  }
});

test('chapter 13: odd input never throws on the new names: the close composition without cats.js, unknown options, a cast at every spot', () => {
  const cast = CH13.dig.map((at) => ({ who: 'player', at }));
  for (const cam of CH13.cams) for (const o of [{}, { marks: 'leaves', tap: 'leaves' }, { marks: 'bare', tap: 'marks', dig: true }, { marks: 3, tap: 'x' }]) checkRender13(render(cam, cast, ['day'], o), cast, cam + ' ' + JSON.stringify(o), cam);
  checkRender(render('oak', [{ who: 'player', at: 'oak-near' }], ['day'], { dig: true }), [{}], 'oak-near');
  const keep = art.character;
  try {
    art.character = undefined;
    for (const cam of CH13.cams) checkRender13(render(cam, cast, ['day'], { marks: 'leaves', tap: 'leaves' }), cast, cam + ' without cats.js', cam);
    checkRender(render('oak', [{ who: 'player', at: 'root-1' }], ['day'], { dig: true }), [{}], 'oak dig without cats.js');
  } finally { art.character = keep; }
  const G = G13();
  for (const k of ['dig', 'doorway']) for (const c of ['oak', 'dig']) assert.ok(G[k][c].length === 4 && G[k][c].every(Number.isFinite), k + ' ' + c);
  assert.ok(G.marks.length === 4 && G.marks.every(Number.isFinite) && G.marks[2] > G.marks[0], 'the marks\' box');
});
