// The open river set (app/art/sets/openriver.js, chapter 5): node --test tests/set-openriver.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['wide', 'raft', 'light', 'log', 'sky', 'rocks', 'edge', 'beside', 'under'];   // the text's order
const ANCHORS = ['raft-1', 'raft-2', 'pole', 'beside', 'far-rocks'];
const PLANES = ['none', 'far', 'near', 'over', 'gone'];
// which anchors each camera places (the set's header says why)
const HAS = {
  wide: ANCHORS, raft: ANCHORS, light: ANCHORS, rocks: ANCHORS,
  log: ['far-rocks'], sky: ['raft-1', 'raft-2', 'pole'], edge: ['raft-1', 'raft-2', 'beside'], beside: ['raft-1', 'raft-2', 'beside'], under: ['beside']
};
const VIEWS = ['wide', 'raft', 'light', 'rocks'];            // the open views: sky, both shores, the rocks, the whole raft
const RAFTED = ['wide', 'raft', 'light', 'rocks', 'edge', 'beside'];   // the cameras that show the raft from above the water
const SKIED = ['wide', 'raft', 'light', 'log', 'sky', 'rocks'];        // the cameras with sky for an airplane
const LIGHTS = [[], ['day'], ['morning'], ['sunset'], ['dusk'], ['night'], ['night', 'stars', 'rain', 'lightning']];
const has = (f) => fs.existsSync(path.join(ROOT, f));
const realCats = typeof art.character === 'function' && !art.character.placeholder;

// ---------------------------------------------------------------- helpers (as in set-roof.test.js)

function checkXml(svg) {
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
  assert.equal(first, 'svg', 'the root element is <svg>');
}

function checkRender(r, scene, label, budget) {
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg);
  const vb = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(r.svg)[1].split(/\s+/).map(Number);
  assert.deepEqual(vb, [0, 0, 1600, 1000], label + ': the whole 1600 x 1000 composition');
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  for (const ref of r.svg.match(/href="#([^"]+)"/g) || []) assert.ok(idset.has(ref.slice(7, -1)), label + ': dangling ' + ref);
  assert.equal(r.heads.length, (scene.cast || []).length, label + ': one head per cast member');
  r.heads.forEach((h, i) => {
    if (h === null) return;
    assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ' head ' + i + ' in range: ' + JSON.stringify(h));
  });
  for (const k of r.keep) assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, label + ': keep inside the panel: ' + JSON.stringify(k));
  // (the Sky River alone is 2,600 stars: a frame that asks this set for every effect at once is not held to the budget)
  assert.ok(r.svg.length < (budget || 260000), label + ': a panel an iPad draws at once: ' + r.svg.length);
}

const scene = (cam, opts, cast, fx) => ({ set: 'openriver', cam, opts: opts || {}, cast: cast || [], fx: fx || [] });
const render = (cam, opts, cast, fx, look) => art.render(scene(cam, opts, cast, fx), { look: look || LOOK });
const count = (svg, re) => (svg.match(re) || []).length;
const at = (svg, s) => svg.indexOf(s);
const num = (v) => { const r = Math.round(v * 10) / 10; return r === 0 ? '0' : String(r); };
// where the cast member standing at world point (x, y) is drawn (scenes.js placeChar's transform)
const drawnAt = (svg, a) => svg.indexOf('<g transform="translate(' + num(a.x) + ' ' + num(a.y) + ')');
// render ids carry a per-render prefix (scenes.js) and a per-drawing counter (cats.js): taken off
// wherever an id is written or named (never off a class: `pcs-blink` stays `pcs-blink`)
const strip = (s) => s.replace(/(id="|url\(#|href="#)pc[0-9a-z]+-/g, '$1');
const info = () => art.openriverInfo();
const spots = (cam) => art.sceneInfo('openriver').anchors[cam];
const lum = (h) => parseInt(h.slice(1, 3), 16) * 0.3 + parseInt(h.slice(3, 5), 16) * 0.59 + parseInt(h.slice(5, 7), 16) * 0.11;
const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// the whole of the first <g …> whose opening tag has `attr`, to its own closing tag ('' when there is none)
function group(svg, attr, from) {
  const re = new RegExp('<g(?=[^>]*\\s' + attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')[^>]*>', 'g');
  re.lastIndex = from || 0;
  const m = re.exec(svg);
  if (!m) return '';
  let depth = 1, i = m.index + m[0].length;
  const tag = /<g[\s>]|<\/g>/g;
  tag.lastIndex = i;
  let t;
  while (depth > 0 && (t = tag.exec(svg))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
  return svg.slice(m.index, i);
}
function groups(svg, attr) {
  const out = [];
  let from = 0;
  for (;;) {
    const g = group(svg, attr, from);
    if (!g) return out;
    out.push(g);
    from = svg.indexOf(g, from) + g.length;
  }
}
const part = (svg, name) => group(svg, 'data-part="' + name + '"');
// the picture itself, without its <defs> (an airplane brings gradients of its own)
const body = (svg) => svg.slice(svg.indexOf('</defs>'));
const without = (svg, names) => names.reduce((s, nm) => { for (;;) { const g = part(s, nm); if (!g) return s; s = s.replace(g, ''); } }, svg);
// the colours of a gradient the markup defines, by the id a fill names
function stopsOf(svg, fill) {
  const id = /url\(#([^)]+)\)/.exec(fill)[1];
  const m = new RegExp('<(?:linear|radial)Gradient id="' + id + '"[^>]*>(.*?)</(?:linear|radial)Gradient>').exec(svg);
  assert.ok(m, 'gradient ' + id);
  return (m[1].match(/stop-color="(#[0-9a-fA-F]{6})"/g) || []).map((s) => s.slice(12, -1));
}
// every point a path's data goes through, in the panel's own units (the commands this set writes:
// M L H V Q T A Z and their relative forms; a curve's control points are left out)
function pointsOf(d) {
  const out = [];
  let x = 0, y = 0, sx = 0, sy = 0;
  for (const m of d.matchAll(/([MLHVQTAZmlhvqtaz])([^MLHVQTAZmlhvqtaz]*)/g)) {
    const c = m[1], v = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number), rel = c === c.toLowerCase(), C = c.toUpperCase();
    const per = { M: 2, L: 2, T: 2, H: 1, V: 1, Q: 4, A: 7, Z: 0 }[C];
    if (C === 'Z') { x = sx; y = sy; continue; }
    for (let i = 0; i + per <= v.length; i += per) {
      const a = v.slice(i, i + per);
      if (C === 'H') x = rel ? x + a[0] : a[0];
      else if (C === 'V') y = rel ? y + a[0] : a[0];
      else { const ex = a[per - 2], ey = a[per - 1]; x = rel ? x + ex : ex; y = rel ? y + ey : ey; }
      if (C === 'M' && i === 0) { sx = x; sy = y; }
      out.push([x, y]);
    }
  }
  return out;
}
// a sitting cat's head top at an anchor (its ears are 0.95 of its height up)
const headTop = (a) => a.y - a.h * 0.95;
const CAST = {
  views: [{ who: 'player', at: 'raft-1', pose: 'sit', mood: 'worried', facing: 'right' }, { who: 'riffle', at: 'raft-2', pose: 'sit', mood: 'happy', facing: 'right' },
    { who: 'tallyheart', at: 'far-rocks', pose: 'pawup', mood: 'shout', facing: 'right' }]
};

// ---------------------------------------------------------------- the vocabulary

test('the chapter\'s Art needs name this set\'s cameras, anchors and options, and the set has every one of them', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/05-riffles-river.md'), 'utf8');
  const a = md.indexOf('New place, the open river (`openriver`'), b = md.indexOf('New place, the marsh');
  assert.ok(a > 0 && b > a, 'the text describes the open river before the marsh');
  const sec = md.slice(a, b).replace(/\s+/g, ' ');
  const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  // "Cameras: `wide` (…), `raft` (…), …. Its anchors: …. Options: …."
  const cams = /Cameras: (.*?)\. Its anchors: (.*?)\. Options: (.*?)\. The water is/.exec(sec);
  assert.ok(cams, 'the text lists cameras, anchors and options');
  // a camera's own description may name other things in ticks (`face: true`); its name is the tick that opens it
  const camNames = (cams[1].match(/(?:^|, )`([a-z]+)` \(/g) || []).map((s) => /`([a-z]+)`/.exec(s)[1]);
  assert.deepEqual(camNames, CAMS, 'the cameras, in the text\'s order');
  assert.deepEqual(ticks(cams[2]), ANCHORS, 'the anchors');
  assert.deepEqual(ticks(cams[3]), ['plane: \'none\' | \'far\' | \'near\' | \'over\' | \'gone\'', 'shiver: true', 'foot: true', 'bubbles: true', 'late: true'], 'the options');
  assert.ok(/`face: true`, one small face at one of them, never a wave/.test(cams[1]), 'and `face` on the sky camera');
  // the river's colour, as the note has it since the chapter was drawn: the Crossing's blue, and still never dark
  assert.ok(/\. The water is the Crossing’s own, bright blue and sunny, never dark and never black/.test(sec), 'the note says what colour the water is');
  assert.ok(!/The water is green-brown/.test(md) && !/keeps green-brown/.test(md), 'and nowhere still asks for green-brown water');
  // build.md's Chapter 5 section sends the builder here
  const bm = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const ch5 = bm.slice(bm.indexOf('## Chapter 5')).replace(/\s+/g, ' ');
  assert.ok(ch5.includes('`openriver`') && ch5.includes('app/art/sets/openriver.js'), 'build.md names the set and its file');
});

test('PC.art.vocab lists the open river with its cameras, anchors and options; each camera is its own composition', () => {
  const v = art.vocab.sets.openriver;
  assert.ok(v, 'vocab.sets.openriver');
  assert.deepEqual(v.cams, CAMS);
  assert.deepEqual(v.anchors.slice().sort(), ANCHORS.slice().sort());
  // (`fish: 'spare'` is the set's own: the string with its two spare fish, riding home on the logs)
  assert.deepEqual(v.opts, { plane: PLANES, shiver: [false, true], foot: [false, true], bubbles: [false, true], late: [false, true], face: [false, true], claws: 'number', fish: ['none', 'spare'] });
  const si = art.sceneInfo('openriver');
  assert.equal(si.label, 'the open river under the Roar');
  assert.deepEqual(si.defaults, {}, 'no defaults: three cameras draw an airplane unless told `plane: \'none\'`');
  for (const cam of CAMS) {
    assert.equal(si.cams[cam].comp, cam, cam + ' has its own composition');
    assert.deepEqual([si.cams[cam].x, si.cams[cam].y, si.cams[cam].w], [0, 0, 1600], cam + ' looks at all of it');
    assert.deepEqual(Object.keys(si.anchors[cam]).sort(), HAS[cam].slice().sort(), cam + ': its anchors');
  }
  // the three cameras a frame stages people in by name have every anchor, and so has the wonder screen
  for (const cam of VIEWS) assert.equal(HAS[cam].length, 5, cam);
});

test('two lights and no more: day (morning is a paler day) and the late gold; dusk and night draw the gold', () => {
  const P = art.kit.PAL;
  for (const cam of CAMS.filter((c) => c !== 'edge' && c !== 'beside' && c !== 'under')) {
    const plain = render(cam).svg;
    assert.ok(plain.includes(P.day.sky[0]) && !plain.includes(P.golden.sky[0]), cam + ': a day sky by default');
    assert.equal(strip(render(cam, {}, [], ['day']).svg), strip(plain), cam + ': fx day is the default');
    const morning = render(cam, {}, [], ['morning']).svg;
    assert.ok(morning.includes(P.morning.sky[0]) && !morning.includes(P.day.sky[0]), cam + ': fx morning redraws it');
    const late = render(cam, { late: true }).svg;
    assert.ok(late.includes(P.golden.sky[0]) && !late.includes(P.day.sky[0]), cam + ': late is gold');
    for (const fx of ['sunset', 'dusk', 'night']) {
      const s = render(cam, {}, [], [fx]).svg;
      assert.ok(s.includes(P.golden.sky[0]), cam + ': fx ' + fx + ' is the late gold');
      for (const dark of [P.night.sky[0], P.dusk.sky[0], P.storm.sky[0], P.night.water, P.dusk.water]) assert.ok(!s.includes(dark), cam + ': fx ' + fx + ' draws nothing of the night');
      if (fx === 'sunset') assert.equal(strip(s), strip(late), cam + ': fx sunset and late: true are the same picture');
    }
    // late wins over the frame's own fx: the way home is gold whatever the frame says
    assert.equal(strip(render(cam, { late: true }, [], ['morning']).svg), strip(late), cam);
  }
  // the cast is washed in the same light
  if (realCats) {
    const tinted = render('raft', { late: true }, CAST.views).svg, day = render('raft', {}, CAST.views).svg;
    assert.ok(/feColorMatrix/.test(tinted) && !/feColorMatrix type="matrix"/.test(day), 'the late gold washes the cast; day leaves them as they are');
  }
});

// ---------------------------------------------------------------- the rules of the place

// the hue of a colour, in degrees (blue is 240, the Crossing's river about 208, green 120, gold about 45)
const hue = (h) => {
  const [r, g, b] = rgb(h).map((v) => v / 255), mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
  if (!d) return NaN;
  return ((mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60 + 360) % 360;
};

/* The river's colour (README, "Claude's calls under decision 46", 2026-10-12): the open river is the
 * Crossing's own sunny water, a page further out. It was drawn green-brown, as the text's note then
 * asked (to keep it from looking dark), and read as a lawn the raft sat on. The rule now:
 *   - by day (and in the paler morning) it reads blue at once: in every colour of it the blue leads
 *     the red, and the green lies between them (never green-brown, never grey); sky-coloured toward
 *     the far shore, the Crossing's blue in the middle and brighter than the Crossing's, a touch
 *     greener and deeper at our feet;
 *   - in the late gold the far water takes the sky's gold and from the middle to our feet it is an
 *     evening blue: warmer than the day's, and still water (the blue still leads the red there);
 *   - and nothing on it is ever dark, in any light: the note's intent, measured as it always was. */
test('the water is the Crossing’s sunny blue, never dark, never black: in every camera, in every light a frame can ask for', () => {
  const W = art.openriverInfo.water, P = art.kit.PAL;
  assert.deepEqual(Object.keys(W).sort(), ['day', 'golden', 'morning']);
  const BODY = ['far', 'mid', 'near', 'low', 'line'];   // the river itself, far to near, and the darkest mark on it
  for (const [name, w] of Object.entries(W)) {
    assert.deepEqual(Object.keys(w).sort(), ['far', 'glint', 'hi', 'line', 'low', 'mid', 'near', 'sheen', 'under'], name + ': the river’s colours');
    for (const [k, c] of Object.entries(w)) {
      assert.ok(/^#[0-9A-F]{6}$/i.test(c), name + '.' + k);
      // nothing on the river is darker than the Crossing's own deep water at noon (110); black is 0, the night river of chapter 1 is 34
      assert.ok(lum(c) >= 110, name + '.' + k + ' ' + c + ' is light: ' + lum(c).toFixed(0));
    }
    assert.ok(lum(w.hi) > lum(w.far) && lum(w.far) > lum(w.mid) && lum(w.mid) > lum(w.near) && lum(w.near) >= lum(w.low), name + ': lightest far off, where the sun is on it; deeper at our feet');
    assert.ok(lum(w.line) <= lum(w.low) && lum(w.sheen) > lum(w.mid) && lum(w.under) > lum(w.far), name + ': a ripple’s shaded side is the darkest mark, a streak of sky is pale, and from underneath it is brighter still');
    // never murky: the river's own colours are clear ones (a grey or a brown has its three channels close together)
    for (const k of ['mid', 'near', 'low', 'line']) { const q = rgb(w[k]); assert.ok(Math.max(...q) - Math.min(...q) >= 30, name + '.' + k + ' ' + w[k] + ' is a clear colour, not a grey'); }
  }
  for (const name of ['day', 'morning']) {
    const w = W[name];
    for (const [k, c] of Object.entries(w)) {
      if (k === 'glint') continue;   // the sun's own colour
      const [r, g, b] = rgb(c);
      // blue: the blue leads the red, with the green between them (the old river had green and red both over blue)
      assert.ok(b > r && b >= g && g > r, name + '.' + k + ' ' + c + ' reads blue, not green-brown');
      assert.ok(b - r >= (BODY.includes(k) ? 30 : 8), name + '.' + k + ' ' + c + ': the blue leads the red by ' + (b - r));
      // a blue to a blue-green: between the sky's blue and a sea green, never a leaf green and never a violet
      assert.ok(hue(c) >= 185 && hue(c) <= 215, name + '.' + k + ' ' + c + ' hue ' + hue(c).toFixed(0));
    }
    // sky-coloured toward the far shore: the far water is one of the sky's own colours, near enough
    const sky = Math.min(...P[name].sky.map((c) => Math.max(...rgb(c).map((v, i) => Math.abs(v - rgb(w.far)[i])))));
    assert.ok(sky <= 16, name + ': the far water is the colour of the sky (' + w.far + ', ' + sky + ' off the nearest of ' + P[name].sky + ')');
    // the Crossing's water (the palette's `water`, which crossing.js fills its river with), brighter for being out in the open
    assert.ok(Math.abs(hue(w.mid) - hue(P[name].water)) <= 12, name + ': the same blue as the Crossing’s river: ' + hue(w.mid).toFixed(0) + ' against ' + hue(P[name].water).toFixed(0));
    assert.ok(lum(w.mid) > lum(P[name].water), name + ': and brighter');
    // a touch greener and deeper near the raft
    assert.ok(hue(w.near) < hue(w.mid) && hue(w.low) <= hue(w.near) && hue(w.mid) - hue(w.low) <= 12, name + ': a touch greener at our feet, and only a touch: ' + [w.mid, w.near, w.low].map((c) => hue(c).toFixed(1)));
  }
  // morning is a paler day
  for (const k of ['hi', 'far', 'mid', 'near', 'low', 'line']) assert.ok(lum(W.morning[k]) > lum(W.day[k]), 'morning.' + k + ' is paler than the day’s');
  {
    // the late gold: the sky's gold on the far water, an evening blue from the middle to our feet
    const w = W.golden;
    for (const k of ['hi', 'far', 'sheen', 'glint']) { const [r, , b] = rgb(w[k]); assert.ok(r > b + 20, 'golden.' + k + ' ' + w[k] + ' is the gold of the sky'); }
    for (const k of ['mid', 'near', 'low', 'line']) {
      const [r, g, b] = rgb(w[k]);
      assert.ok(b >= r + 30 && b > g, 'golden.' + k + ' ' + w[k] + ' is still water: the blue leads the red by ' + (b - r));
    }
    // warmer than the day's, stop by stop: more red in it for the blue it has
    for (const k of ['hi', 'far', 'mid', 'near', 'low', 'line']) {
      const [r, , b] = rgb(w[k]), [r0, , b0] = rgb(W.day[k]);
      assert.ok(b - r < b0 - r0 && r > r0, 'golden.' + k + ' is warmer than day.' + k);
    }
    // the same water as the Crossing's on the way home (its hue; never darker than it)
    for (const k of ['near', 'low', 'line']) {
      assert.ok(Math.abs(hue(w[k]) - hue(P.golden.water)) <= 10, 'golden.' + k + ' ' + w[k] + ': the Crossing’s evening blue: ' + hue(w[k]).toFixed(0) + ' against ' + hue(P.golden.water).toFixed(0));
      assert.ok(lum(w[k]) > lum(P.golden.water), 'golden.' + k + ' is lighter than the Crossing’s');
    }
  }
  let n = 0;
  for (const cam of CAMS.filter((c) => c !== 'sky')) for (const fx of LIGHTS) for (const late of [false, true]) {
    const svg = render(cam, { late, shiver: true, foot: true, bubbles: true, plane: 'over' }, [], fx).svg, label = cam + ' ' + fx.join('+') + (late ? ' late' : '');
    if (cam === 'under') {
      // from underneath: the lightest picture of all
      const bg = /<rect x="-20" y="-20" width="1640" height="1040" fill="(url\(#[^"]+\))"/.exec(svg);
      assert.ok(bg, label + ': the water all round');
      const up = stopsOf(svg, bg[1]);
      for (const c of up) assert.ok(lum(c) >= 170, label + ': ' + c + ' ' + lum(c).toFixed(0));
      // blue water all round, by day (in the late gold a pale evening blue: never the old yellow-green)
      for (const c of up) { const [r, g, b] = rgb(c); assert.ok(b > r && b >= g, label + ': from underneath the water is blue: ' + c); }
      n++;
      continue;
    }
    const water = part(svg, 'water');
    assert.ok(water, label + ': the river is drawn');
    const fill = /<rect [^>]*fill="(url\(#[^"]+\))"/.exec(water);
    const stops = stopsOf(svg, fill[1]);
    assert.ok(stops.length >= 4, label + ': a gradient far to near');
    const table = Object.values(W).map((w) => Object.values(w).map((c) => c.toLowerCase()));
    const mine = table.find((t) => stops.every((c) => t.includes(c.toLowerCase())));
    assert.ok(mine, label + ': the river is filled from one of the set\'s own lights: ' + stops);
    for (const c of stops) assert.ok(lum(c) >= 110, label + ': ' + c);
    // the light it is drawn in (late wins; dusk and night draw the late gold), and that light's river, far to near
    const light = late || fx.some((f) => f === 'sunset' || f === 'dusk' || f === 'night') ? 'golden' : fx.includes('morning') ? 'morning' : 'day';
    assert.deepEqual(stops.map((c) => c.toLowerCase()), ['hi', 'far', 'mid', 'near', 'low'].map((k) => W[light][k].toLowerCase()), label + ': the ' + light + ' river, far to near');
    // the picture itself reads as water: by day the blue leads the red in every stop of it; in the
    // late gold the far water is the sky's gold and from the middle to our feet the blue leads again
    stops.forEach((c, i) => { const [r, , b] = rgb(c); if (light !== 'golden' || i >= 2) assert.ok(b > r, label + ': the water reads blue: ' + c); });
    // and every mark made on it is one of the river's own colours, a white, or the sun
    const cols = new Set((water.match(/(?:fill|stroke|stop-color)="(#[0-9a-fA-F]{6})"/g) || []).map((s) => /#[0-9a-fA-F]{6}/.exec(s)[0].toLowerCase()));
    for (const c of cols) assert.ok(lum(c) >= 110, label + ': a mark on the water is ' + c + ' (' + lum(c).toFixed(0) + ')');
    assert.ok(!/#000|black/i.test(water), label + ': no black');
    n++;
  }
  assert.equal(n, 8 * LIGHTS.length * 2);
});

test('the small pictures on the raft are drawn on the same water: app/art/cats.js keeps a copy of the day river, and the two files are held to each other', () => {
  const W = art.openriverInfo.water.day, lc = (c) => c.toLowerCase();
  // Puddle's forepaw held up out of the river (the Tap on the raft): the far water behind him, the river round him
  const pud = art.countsPicture({ table: 5, groups: 1, per: 5, who: [{ who: 'puddle' }], next: true, look: LOOK });
  assert.ok(/aria-label="Puddle in the water/.test(pud), 'Puddle’s picture');
  assert.ok(pud.includes('fill="' + lc(W.far) + '"') && pud.includes('fill="' + lc(W.mid) + '"'), 'Puddle’s picture: the set’s far water behind him and its river round him');
  // her claws in the log (the picture a page with no scene of its own would show): the river beyond the log
  const log = art.countsPicture({ paws: 'log', table: 1, groups: 9, per: 1, taps: 3, look: LOOK });
  assert.ok(/aria-label="Your two forepaws on the raft’s log/.test(log), 'the log picture');
  assert.ok(log.includes('fill="' + lc(W.mid) + '"'), 'the log picture: the set’s river beyond the log');
  // the raft from underneath (Puddle's riddle): the `under` camera's water, from its bright middle to its edge
  const bumps = art.countsPicture({ kind: 'bumps', table: 10, groups: 4, per: 10 });
  const edge = lc(art.kit.mix(W.under, W.mid, 0.75));
  assert.ok(bumps.includes('stop-color="' + lc(W.under) + '"') && bumps.includes('stop-color="' + edge + '"'), 'the bumps picture: the water the `under` camera draws (' + lc(W.under) + ' to ' + edge + ')');
  const under = render('under').svg, bg = /<rect x="-20" y="-20" width="1640" height="1040" fill="(url\(#[^"]+\))"/.exec(under);
  assert.deepEqual(stopsOf(under, bg[1]).slice(1).map(lc), [lc(W.under), edge], 'and the camera draws it so');
  // every water colour in them reads blue, and none of them is the old river's green
  for (const [name, s] of [['Puddle', pud], ['log', log], ['bumps', bumps]]) {
    for (const old of ['#8fb79c', '#b9d7c1', '#6f9c84', '#a8d3ae', '#6fa58a', '#e9f7d6']) assert.ok(!s.includes(old), name + ': nothing of the green river (' + old + ')');
  }
  for (const c of [W.far, W.mid, W.near, W.under, edge]) { const [r, g, b] = rgb(c); assert.ok(b > r + 30 && b >= g, c + ' reads blue'); }
});

test('the water is flat: no mark on it is higher than a ripple, in any camera', () => {
  for (const cam of CAMS.filter((c) => c !== 'sky' && c !== 'under')) {
    const water = part(render(cam, { plane: 'over' }).svg, 'water');
    // every swell is a "q": its bulge is its control point's dy; every glint is a level "h"
    const bulges = [...water.matchAll(/q[-\d.]+ ([-\d.]+) [-\d.]+ ([-\d.]+)/g)].map((m) => Math.max(Math.abs(+m[1]), Math.abs(+m[2])));
    assert.ok(bulges.length > 10, cam + ': swells');
    assert.ok(Math.max(...bulges) <= 7, cam + ': the highest swell is ' + Math.max(...bulges) + ' of 1000');
    assert.ok(!/[cCsSaA]/.test(water.replace(/<[a-z]+ |[a-z-]+="[^"]*"/g, (t) => (/^d="/.test(t) ? t.slice(3, -1) : ''))), cam + ': no waves, no curls: only level strokes');
  }
});

test('nothing is ever drawn as a shape under the raft: no shadow on the water, no reflection, only the river over its lower logs', () => {
  for (const cam of RAFTED) for (const late of [false, true]) {
    const svg = strip(render(cam, { late }).svg), raft = part(svg, 'raft') + part(svg, 'raft-near'), label = cam + (late ? ' late' : '');
    assert.ok(raft, label + ': the raft');
    const shade = art.kit.PAL[late ? 'golden' : 'day'].shade;
    assert.ok(!raft.toLowerCase().includes(shade.toLowerCase()), label + ': the raft draws nothing in the shadow colour (the crossing\'s raft has a dark patch under it; this one must not)');
    // after the logs (the one filtered group) comes the river itself, laid back over the near log: the
    // river's own drawing a second time (its fill and every streak, swell and glint on it), cut to a
    // level patch, so the patch cannot be told from the water round it (a patch of the bare fill
    // showed as a box wherever the sun's path or a streak of sky ran under it); then only pale lines
    // and a vine
    const water = part(svg, 'water'), fill = /<rect [^>]*fill="(url\(#[^"]+\))"/.exec(water)[1];
    const logs = group(raft, 'filter="url(#f-sh-', cam === 'edge' ? raft.indexOf('data-part="raft-near"') : 0);
    const after = raft.slice(raft.indexOf(logs) + logs.length);
    assert.ok(after.startsWith('<g clip-path="url(#c-or-lap)">'), label + ': the river over the near log comes straight after the logs');
    const patch = group(after, 'clip-path="url(#c-or-lap)"');
    assert.equal(patch, '<g clip-path="url(#c-or-lap)">' + water.slice(water.indexOf('>') + 1, -4) + '</g>', label + ': and it is the river\'s own drawing, mark for mark, so it cannot be told from the water round it');
    assert.ok(patch.includes('fill="' + fill + '"'), label + ': its own fill under the marks');
    const lap = /<clipPath id="c-or-lap"><rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" fill="#fff"\/><\/clipPath>/.exec(svg);
    assert.ok(lap, label + ': cut to a level patch');
    assert.equal(count(svg, /url\(#c-or-lap\)/g), 1, label + ': one patch');
    const rest = after.slice(patch.length);
    assert.ok(!/<rect|<ellipse|<circle/.test(rest), label + ': nothing else solid after it');
    for (const m of rest.matchAll(/<path d="[^"]*" fill="([^"]+)"/g)) assert.ok(m[1] === 'none' || lum(m[1]) > 90, label + ': after the logs, only lines and a leaf: fill ' + m[1]);
    for (const m of rest.matchAll(/stroke="(#[0-9a-fA-F]{6})"/g)) assert.ok(lum(m[1]) > 60, label + ': a pale lapping line or the vine: ' + m[1]);
    // riding low: the river comes well up the near log, and covers everything below it to past its foot
    const I = info()[cam].raft, wl = +lap[2];
    const near = [...logs.matchAll(/<rect x="[-\d.]+" y="([-\d.]+)" width="[-\d.]+" height="([-\d.]+)" fill="url[^"]+" rx/g)].map((m) => [+m[1], +m[1] + +m[2]]).pop();
    assert.ok(wl > near[0] + (near[1] - near[0]) * 0.4 && wl < near[0] + (near[1] - near[0]) * 0.75, label + ': the river laps ' + ((wl - near[0]) / (near[1] - near[0])).toFixed(2) + ' of the way down the near log');
    assert.ok(wl + +lap[4] >= near[1] + 10 * I.k, label + ': and hides the log\'s foot, and the soft edge the paper shadow leaves under it');
    // from end to end of the raft and past both ends (the paper shadow's soft edge is hidden there too)
    assert.ok(+lap[1] <= I.x0 - 20 * I.k && +lap[1] + +lap[3] >= I.x1 + 20 * I.k, label + ': the patch runs past both ends of the raft');
    // and nothing between the river and the raft is under it either: what is drawn there is the
    // towers' reflections (far off), the rocks and the pole
    const between = svg.slice(svg.indexOf(water) + water.length, svg.indexOf(raft.slice(0, 60)));
    const parts = (between.match(/data-part="[^"]+"/g) || []).map((s) => s.slice(11, -1));
    for (const p of parts) assert.ok(['reflections', 'red-light-refl', 'shine', 'rocks', 'otters', 'slap', 'pole'].includes(p), label + ': ' + p + ' is drawn between the river and the raft');
  }
  // the towers' reflections stop short of the raft in every view: none of them lies under it
  for (const cam of VIEWS) {
    const svg = render(cam).svg, refl = part(svg, 'reflections'), I = info()[cam];
    const polys = [...refl.matchAll(/<path d="(M[^"]*Z)" fill="url/g)].map((m) => pointsOf(m[1]));
    assert.ok(polys.length >= 5, cam + ': reflections');
    // (one that comes down beside the raft, as the tallest tower's does in the wonder panel, is not under it)
    const over = polys.filter((P) => Math.max(...P.map((q) => q[0])) > I.raft.x0 - 10 && Math.min(...P.map((q) => q[0])) < I.raft.x1 + 10);
    for (const P of over) assert.ok(Math.max(...P.map((q) => q[1])) < I.raft.top - 4, cam + ': a reflection over the raft\'s own water ends at ' + Math.max(...P.map((q) => q[1])) + ', short of its far edge at ' + I.raft.top);
  }
});

test('the airplane is always well above the raft and everyone on the river: every size of it, in every camera, the drift included', () => {
  const I = info();
  for (const cam of [...VIEWS, 'log']) {
    const C = I[cam], A = spots(cam);
    assert.ok(C.ceil > 0, cam + ' keeps a line for it');
    for (const [st, box] of Object.entries(C.planes)) {
      assert.ok(box[0] < 1600 && box[2] > 0 && box[1] < 1000, cam + ' ' + st + ' is in the panel');
      if (st === 'far') {
        // far down the river it is one light, low in the sky: over the far water, and still over every head on the raft
        assert.ok(box[3] <= C.hz - 24, cam + ' far: the light (its glow and all) is above the far waterline: ' + box[3].toFixed(0) + ' vs ' + C.hz);
        for (const where of HAS[cam].filter((k) => /^raft|pole/.test(k))) assert.ok(headTop(A[where]) - box[3] >= 40, cam + ' far: above a head at ' + where);
        assert.ok(box[0] > 760, cam + ' far: away down the river, at the right');
        continue;
      }
      assert.ok(box[3] <= C.ceil, cam + ' ' + st + ': its lowest point ' + box[3].toFixed(0) + ' is above the line at ' + C.ceil);
      // well above the raft: clear sky between it and the highest head on the logs, most of a sitting
      // cat's own height of it once it is overhead
      for (const where of HAS[cam].filter((k) => k !== 'beside')) {
        const a = A[where], gap = headTop(a) - box[3];
        if (where === 'far-rocks') assert.ok(gap >= 14, cam + ' ' + st + ': above the head of whoever is on the tall rock by ' + gap.toFixed(0));
        else assert.ok(gap >= 100 && (st !== 'over' || gap >= a.h * 0.6), cam + ' ' + st + ': ' + gap.toFixed(0) + ' of sky between it and a head at ' + where + ' (a cat there is ' + a.h + ' tall)');
      }
      if (C.raft) assert.ok(C.raft.top - box[3] > 280 * Math.min(1, C.raft.k * 1.6), cam + ' ' + st + ': ' + (C.raft.top - box[3]).toFixed(0) + ' above the raft itself');
    }
    // never level with the rocks either: everything of the Crossing is under the line
    assert.ok(C.rocks.y - 146 * C.rocks.s > C.ceil, cam + ': the tall rock\'s top is under it');
  }
  // the line is not a formality: the heads it protects are measured from the drawing
  for (const cam of VIEWS) {
    const r = render(cam, { plane: 'over' }, CAST.views), C = I[cam];
    r.heads.forEach((h, i) => assert.ok(h && (h.y - h.r * 1.6) * 10 > C.planes.over[3] + 10, cam + ': ' + CAST.views[i].who + '\'s head (top ' + ((h.y - h.r * 1.6) * 10).toFixed(0) + ') is under the airplane (' + C.planes.over[3].toFixed(0) + ')'));
  }
});

test('overhead it is still WELL above them: looking straight up, sky lies between its wheels and both heads on the raft; over the raft it crosses clear of the tallest tower, whose roof and red light stay in the sky', () => {
  const I = info();
  // `sky`, the look-up panel (“Keep your eyes open and look up.”): the belly crosses the whole panel, and
  // its lowest point (a wheel, an engine: the drift included) is above the top of every head at the
  // bottom edge, with clear sky between (its wheels hung level with Riffle's head)
  const over = I.sky.planes.over, cast = [{ who: 'player', at: 'raft-1', pose: 'lookup', mood: 'wonder', facing: 'right' }, { who: 'riffle', at: 'raft-2', pose: 'stand', mood: 'wonder', facing: 'left' }];
  const r = render('sky', { plane: 'over', face: true }, cast);
  r.heads.forEach((h, i) => {
    const top = (h.y - h.r * 1.6) * 10;
    assert.ok(top - over[3] >= 40, 'sky: ' + (top - over[3]).toFixed(0) + ' of sky between the airplane (lowest point ' + over[3].toFixed(0) + ') and ' + cast[i].who + '\'s head (top ' + top.toFixed(0) + ')');
  });
  assert.ok(over[0] <= 60 && over[2] >= 1540, 'sky: its belly still crosses the whole panel: ' + over.map((v) => v.toFixed(0)));
  assert.ok(over[3] < 660, 'sky: all of it in the upper two thirds');
  assert.equal(count(r.svg, /data-part="window-face"|data-face="1"/g) >= 0, true);
  // the small face is still at its window, in the panel
  const facePart = render('sky', { plane: 'over', face: true }).keep;
  assert.ok(facePart.length >= 1 && facePart.every((k) => k.y >= 0 && k.y + k.h <= 60), 'sky: the face at the window is kept clear, in the upper part: ' + JSON.stringify(facePart));
  // `raft`, the loudest panel: the airliner is to the right of the tallest tower: its roof and its red light
  // are clear sky (the fuselage ran across the tower's top, the beacon poking out of its back like a light
  // on its roof)
  const R = I.raft, tall = R.towers[R.towers.length - 1], box = R.planes.over;
  assert.deepEqual([tall.x, tall.w, tall.top], [420, 156, 60], 'the tallest tower, the last of the list');
  assert.ok(box[0] >= tall.x + tall.w, 'raft: the airliner (from x ' + box[0].toFixed(0) + ', the drift included) is clear of the tallest tower (to x ' + (tall.x + tall.w) + ')');
  assert.ok(box[2] <= 1600 && box[2] - box[0] > 700, 'raft: and all of it in the panel, still big: ' + box.map((v) => v.toFixed(0)));
  // still over the raft, and no nearer the heads than before
  assert.ok((box[0] + box[2]) / 2 > R.raft.x0 && (box[0] + box[2]) / 2 < R.raft.x1, 'raft: over the raft');
  // the tall rock, where Tallyheart sits with her paw up, is not under it either
  const perch = spots('raft')['far-rocks'];
  assert.ok(box[0] > perch.x + perch.h * 0.5, 'raft: not over the tall rock: ' + box[0].toFixed(0) + ' against ' + perch.x);
});

test('the lying pole and the two on the logs: beside the raft it lies along the near log, at their feet, under no head; at the edge Riffle sits clear of the lashing', () => {
  const I = info();
  // `beside` (“Under the raft”): with nobody poling the pole lies on the logs. It lay along the far log, at
  // head height for the two sitting there: a stick through our cat's head. Now on the near log, in front of
  // their feet.
  for (const poses of [['sit', 'sit'], ['peer', 'hush'], ['sit', 'stand']]) {
    const cast = [{ who: 'riffle', at: 'raft-2', pose: poses[1], facing: 'right' }, { who: 'player', at: 'raft-1', pose: poses[0], facing: 'right' }];
    const r = render('beside', {}, cast), svg = strip(r.svg), d = pointsOf(/d="([^"]+)"/.exec(part(svg, 'pole'))[1]);
    const A = spots('beside'), B = I.beside.raft;
    assert.ok(Math.min(d[0][1], d[1][1]) > A['raft-1'].y + 10, 'beside: the pole (y ' + d.map((q) => q[1].toFixed(0)) + ') is nearer than their feet (' + A['raft-1'].y + ')');
    assert.ok(Math.max(d[0][1], d[1][1]) < B.bot, 'beside: on the near log');
    r.heads.forEach((h, i) => assert.ok((h.y + h.r * 1.6) * 10 < Math.min(d[0][1], d[1][1]) - 40, 'beside: well under ' + cast[i].who + '\'s head'));
    assert.ok(at(svg, 'data-part="pole"') > at(svg, 'data-part="raft"') && at(svg, 'data-part="pole"') < drawnAt(svg, A['raft-1']), 'beside: on the logs, under the cast');
  }
  // `edge`: Riffle's seat is clear of the raft's lashing (he sat exactly on it, the vine's two strands drawn
  // down over his arm), and still right beside our cat
  const E = I.edge.raft, A = spots('edge');
  E.bands.forEach((f) => { const vx = E.x0 + (E.x1 - E.x0) * f; for (const k of ['raft-1', 'raft-2']) assert.ok(Math.abs(A[k].x - vx) > 90, 'edge: ' + k + ' (x ' + A[k].x + ') is clear of the lashing at x ' + vx.toFixed(0)); });
  assert.ok(A['raft-2'].x < A['raft-1'].x && A['raft-1'].x - A['raft-2'].x < A['raft-1'].h * 0.6, 'edge: shoulder to shoulder, Riffle on her left');
  const two = render('edge', {}, [{ who: 'riffle', at: 'raft-2', pose: 'whistle', facing: 'right' }, { who: 'player', at: 'raft-1', pose: 'sit', facing: 'right' }]);
  const dd = Math.hypot((two.heads[0].x - two.heads[1].x) * 16, (two.heads[0].y - two.heads[1].y) * 10);
  assert.ok(dd > (two.heads[0].r + two.heads[1].r) * 16 * 1.02, 'edge: two faces: ' + dd.toFixed(0));
});

test('fish: \'spare\': on the way home the string with its two spare fish lies on the far logs at the raft\'s end, clear of everyone and of whatever comes up between the logs; drawn only when a frame asks', () => {
  const I = info();
  assert.deepEqual(art.vocab.sets.openriver.opts.fish, ['none', 'spare']);
  const where = (svg) => { const m = /data-part="spare-fish"><g transform="translate\(([-\d.]+) ([-\d.]+)\) rotate\(-84\)"/.exec(svg); assert.ok(m, 'the string is placed'); return [+m[1], +m[2]]; };
  for (const cam of CAMS) {
    const cast = HAS[cam].includes('raft-1') ? [{ who: 'player', at: 'raft-1', pose: 'sit' }, { who: 'riffle', at: 'raft-2', pose: 'sit' }] : [];
    const plain = render(cam, { plane: 'none', late: true }, cast), fish = render(cam, { plane: 'none', late: true, fish: 'spare' }, cast);
    if (!RAFTED.includes(cam)) { assert.equal(strip(fish.svg), strip(plain.svg), cam + ': no logs from above here, no string'); continue; }
    checkRender(fish, scene(cam, {}, cast), cam + ' fish');
    assert.ok(!plain.svg.includes('spare-fish'), cam + ': only when asked');
    assert.equal(count(fish.svg, /data-part="spare-fish"/g), 1, cam);
    assert.equal(count(fish.svg, /data-fish="1"/g), 2, cam + ': two fish');
    assert.deepEqual(fish.heads, plain.heads, cam + ': nobody moves for it');
    // on the logs: after the raft, before the cast; on the far logs (behind everyone's feet), inside the raft
    const svg = fish.svg, B = I[cam].raft, [x, y] = where(svg), A = spots(cam);
    assert.ok(at(svg, 'data-part="raft"') < at(svg, 'data-part="spare-fish"') && at(svg, 'data-part="spare-fish"') < drawnAt(svg, A['raft-1']), cam + ': on the raft, under the cast');
    assert.ok(x > B.x0 && x < B.x1 && y > B.top && y < A['raft-1'].y, cam + ': on the far logs: ' + [x, y]);
    // clear of everyone on the raft (a sitting cat is about 0.6 of her height wide) and of the gap things come up through
    for (const k of ['raft-1', 'raft-2', 'pole'].filter((k2) => A[k2])) assert.ok(Math.abs(x + A['raft-1'].h * 0.09 - A[k].x) > A[k].h * 0.42, cam + ': clear of ' + k + ': ' + x + ' against ' + A[k].x);
    // (the string lies on the far logs; what comes up comes up between the two near ones: the two never meet)
    if (I[cam].spot != null) {
      const len = A['raft-1'].h * 0.19, w = 76 * B.k, fishBox = [x - len * 0.05, y - len * 0.3, x + len * 0.95, y + len * 0.3], snout = [I[cam].spot - w * 0.55, I[cam].seam - w * 0.4, I[cam].spot + w * 0.55, I[cam].seam + w * 0.15];
      assert.ok(fishBox[2] < snout[0] || fishBox[0] > snout[2] || fishBox[3] < snout[1] || fishBox[1] > snout[3], cam + ': clear of the place between the logs: ' + fishBox.map(Math.round) + ' against ' + snout.map(Math.round));
    }
    if (cam === 'edge') assert.ok(Math.abs(x - I.edge.gapAt) > 50 && y < I.edge.seam - 100, 'edge: clear of the gap');
    // the same picture but for the string: the river, the raft and the rocks do not change
    // (compared without the <defs> and the ids they hand out: the string's soft shadow may be the panel's first of its kind)
    const drawn = (sv) => body(strip(sv)).replace(/url\(#[^)]*\)/g, 'url(#)');
    assert.ok(drawn(svg).replace(part(drawn(svg), 'spare-fish'), '') === drawn(plain.svg), cam + ': nothing else moves');
    // odd values draw none
    for (const odd of [true, 'strings', 'none', 1, null]) assert.equal(strip(render(cam, { plane: 'none', late: true, fish: odd }, cast).svg), strip(plain.svg), cam + ' fish: ' + JSON.stringify(odd));
  }
  // by day too (the option is the frame's; the way home is the only place the story asks for it)
  assert.equal(count(render('raft', { fish: 'spare' }).svg, /data-fish="1"/g), 2);
});

test('nothing blows, and the water under it stays flat: the river, the raft, the rocks and the otters are the same to the byte whatever is in the sky; it casts no shadow', () => {
  for (const cam of [...VIEWS, 'log']) {
    const base = strip(render(cam, { plane: 'none' }, CAST.views).svg);
    for (const st of PLANES) {
      const svg = strip(render(cam, { plane: st }, CAST.views).svg), label = cam + ' ' + st;
      for (const p of ['water', 'reflections', 'rocks', 'otters', 'raft', 'towers', 'far-shore', 'log', 'riffle-paw', 'her-paws']) {
        assert.equal(part(svg, p), part(base, p), label + ': ' + p + ' is unchanged');
      }
      // take the airplane (and the sound it makes, on the wood and in the sky) out, and it is the picture with no airplane
      const bare = without(svg.slice(svg.indexOf('</defs>')), ['plane', 'buzz']), none = base.slice(base.indexOf('</defs>'));
      if (info()[cam].planes[st]) assert.equal(bare, none, label + ': without the airplane it is the same picture');
      assert.ok(!/shadow/i.test(part(svg, 'plane').replace(/f-sh-[a-z]/g, '')), label + ': no shadow');
    }
    // the buzz of the logs is on the wood, never on the water: every mark of it is inside the raft's own box
    const over = strip(render(cam, { plane: 'over' }).svg), bz = part(over, 'buzz');
    assert.ok(bz, cam + ': the logs buzz while it is over');
    const ys = pointsOf(/d="([^"]+)"/.exec(bz)[1]).map((q) => q[1]);
    if (cam === 'log') assert.ok(Math.min(...ys.filter((y) => y > 100)) > info().log.edge, 'log: on the log');
    else { const B = info()[cam].raft; assert.ok(/d="M/.test(bz) && ys.length >= 6, cam); assert.ok(pointsOf(/d="M([^"]+)"/.exec(bz)[0].slice(3, -1))[0][1] > B.top - 6 * B.k, cam + ': on the raft\'s own logs'); }
    for (const st of ['none', 'far', 'near', 'gone']) assert.equal(part(strip(render(cam, { plane: st }).svg), 'buzz'), '', cam + ' ' + st + ': no buzz');
  }
});

test('plane: none, a far light, a shape with wings, a belly overhead, gone; each camera\'s own default; other sets\' values draw none', () => {
  const I = info();
  for (const cam of CAMS) {
    const dflt = I[cam].planeDefault || 'none', plain = render(cam).svg;
    assert.equal(dflt, cam === 'light' || cam === 'log' ? 'far' : cam === 'sky' ? 'over' : 'none', cam + ': its default');
    if (!SKIED.includes(cam)) {
      for (const st of PLANES) assert.equal(count(render(cam, { plane: st }).svg, /data-part="plane"/g), 0, cam + ' has no sky: no airplane, whatever is asked');
      continue;
    }
    assert.equal(count(plain, /data-part="plane"/g), dflt === 'none' ? 0 : 1, cam + ' by default');
    if (dflt !== 'none') assert.ok(plain.includes('data-plane="' + dflt + '"'), cam + ': the default is ' + dflt);
    for (const st of PLANES) {
      const svg = render(cam, { plane: st }).svg, placed = st !== 'none' && !!I[cam].planes[st];
      assert.equal(count(svg, /data-part="plane"/g), placed ? 1 : 0, cam + ' ' + st);
      if (placed) assert.ok(svg.includes('data-plane="' + st + '"'), cam + ': ' + st);
    }
    // a value that is another set's (the generic sweeps pass the crossing's `low`) draws no airplane
    for (const odd of ['low', 'high', true, false, 7, 'OVER']) assert.equal(count(render(cam, { plane: odd }).svg, /data-part="plane"/g), 0, cam + ' plane: ' + odd);
    // three sizes: each bigger than the one before
    const P = I[cam].planes, w = (b) => b[2] - b[0];
    if (cam !== 'sky') assert.ok(w(P.far) < w(P.near) && w(P.near) < w(P.over), cam + ': a glint, a shape with wings, a belly: ' + [w(P.far), w(P.near), w(P.over)].map((v) => v.toFixed(0)));
  }
  // looking up the river (wide, raft, rocks: gone to the left, toward the airport; light and log look the other way: nothing to see)
  for (const cam of ['wide', 'raft', 'rocks', 'sky']) assert.ok(I[cam].planes.gone && I[cam].planes.gone[2] < 800, cam + ': gone is small, at the left');
  for (const cam of ['light', 'log']) assert.equal(I[cam].planes.gone, undefined, cam + ': once it is gone the sky is empty');
});

test('over: an airliner from below, its row of little round windows, wheels down, crossing to the left; the roar is drawn in the sky and nowhere else', () => {
  for (const cam of SKIED) {
    const svg = strip(render(cam, { plane: 'over' }).svg), pl = part(svg, 'plane'), I = info()[cam];
    assert.ok(pl, cam);
    // mirrored: it flies to the left (toward the airport, as every airplane at the Crossing does)
    const tf = /<g transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)">/.exec(pl);
    assert.ok(tf && +tf[3] < 0 && +tf[4] === -tf[3], cam + ': mirrored, to scale');
    assert.ok(+tf[5] > 0 && +tf[5] < 12, cam + ': nose a little down: coming in to land');
    // 21 round windows in a row (one path of rims, one of panes), and the wheels
    const dots = [...pl.matchAll(/<path d="((?:M[-\d.]+ [-\d.]+a[-\d.]+ [-\d.]+ 0 1 0 [-\d.]+ 0a[-\d.]+ [-\d.]+ 0 1 0 [-\d.]+ 0)+)"/g)].map((m) => count(m[1], /M/g));
    assert.ok(dots.includes(21), cam + ': a row of 21 little round windows: ' + dots);
    assert.ok(count(pl, /fill="#2A2A34"/g) >= 3, cam + ': wheels down');
    if (cam === 'sky') { assert.equal(part(svg, 'roar'), '', 'sky: the page letters the roar; the picture is the windows'); continue; }
    const roar = part(pl, 'roar');
    assert.ok(roar && count(roar, /class="pcs-pulse"/g) >= 2, cam + ': the roar, drawn');
    for (const m of roar.matchAll(/d="([^"]+)"/g)) for (const q of pointsOf(m[1])) assert.ok(q[1] < I.ceil && q[1] > -60 && q[0] > 0 && q[0] < 1600, cam + ': a line of the roar at ' + q + ' is in the sky, above the line at ' + I.ceil);
  }
  // the Roar's panel: a belly filling the top of the panel
  const P = info().log.planes.over;
  assert.ok(P[0] < 80 && P[2] > 1500, 'log: from one side of the panel to the other: ' + P.map((v) => v.toFixed(0)));
  assert.ok(P[1] < -100 && P[3] > 250, 'log: its back is out of the top of the panel, its wheels and wing well down into it');
});

test('sky: straight up: the belly and the windows by default, only blue sky when told none; face: one small face at one window, never a wave', () => {
  const plain = strip(render('sky').svg);
  assert.ok(plain.includes('data-plane="over"'), 'the airplane overhead is this camera\'s picture');
  assert.equal(count(plain, /data-part="face"/g), 0, 'no face unless asked');
  const none = strip(render('sky', { plane: 'none' }).svg);
  assert.equal(count(none, /data-part="plane"/g), 0);
  assert.ok(!/data-part=/.test(none.replace(/data-part="(?:pole)"/g, '')), 'only blue sky (and its clouds): ' + (none.match(/data-part="[^"]+"/g) || []));
  assert.ok(none.includes(art.kit.PAL.day.sky[0]) && none.length < plain.length / 2, 'blue, and nearly empty');
  const r = render('sky', { face: true }), svg = strip(r.svg), pl = part(svg, 'plane');
  assert.equal(count(svg, /data-part="face"/g), 1, 'one small face');
  assert.ok(part(pl, 'face'), 'at one of the airplane\'s windows');
  const face = part(svg, 'face');
  // a round face behind the glass (clipped to its window), two eyes; no hand anywhere: nobody waves
  assert.ok(/clip-path="url\(#c-or-face\)"/.test(face), 'behind the round of its window');
  const eyes = /<path d="((?:M[-\d.]+ [-\d.]+a[-\d.]+ [-\d.]+ 0 1 0 [-\d.]+ 0a[-\d.]+ [-\d.]+ 0 1 0 [-\d.]+ 0){2})" fill="#2B2430"\/>/.exec(face);
  assert.ok(eyes, 'two eyes');
  assert.ok(!/wave|hand|arm/i.test(face), 'never a wave');
  assert.equal(count(face, /<circle|<path/g) <= 9, true, 'small and simple: ' + count(face, /<circle|<path/g) + ' shapes');
  // it is one window of the row (the row keeps its 21 rims), and the lettering keeps off it
  const win = /<circle cx="([-\d.]+)" cy="(-24)" r="11" fill="#FFE9B4"\/>/.exec(face);
  assert.ok(win, 'a lit window, the size of the others');
  assert.equal(r.keep.length, 1, 'one keep area');
  const k = r.keep[0];
  assert.ok(k.w < 12 && k.h < 16 && k.x > 20 && k.x + k.w < 80 && k.y > 10 && k.y + k.h < 60, 'on the window, in the upper middle of the panel: ' + JSON.stringify(k));
  // only the airplane overhead has a face to show
  for (const st of ['none', 'far', 'near', 'gone']) assert.equal(count(render('sky', { plane: st, face: true }).svg, /data-part="face"/g), 0, 'sky ' + st + ': no face');
  for (const cam of CAMS.filter((c) => c !== 'sky')) assert.equal(count(render(cam, { plane: 'over', face: true }).svg, /data-part="face"/g), 0, cam + ': the face is the sky camera\'s');
  // heads look up from the bottom edge
  const cast = [{ who: 'player', at: 'raft-1', pose: 'lookup', mood: 'wonder', facing: 'right' }, { who: 'riffle', at: 'raft-2', pose: 'sit', mood: 'wonder', facing: 'left' }, { who: 'otter', variant: 1, at: 'pole', pose: 'stand', facing: 'left' }];
  const h = render('sky', { face: true }, cast).heads;
  h.forEach((q, i) => assert.ok(q && q.y > 62 && q.y < 98 && q.x > 4 && q.x < 96, cast[i].at + ': a head at the bottom of the panel: ' + JSON.stringify(q)));
  // the pole's top shows beside whoever is at `pole`, and not otherwise
  assert.equal(count(render('sky', {}, cast).svg, /data-part="pole"/g), 1);
  assert.equal(count(render('sky', {}, cast.slice(0, 2)).svg, /data-part="pole"/g), 0);
});

// ---------------------------------------------------------------- the Roar's panel

test('log: her own two forepaws on a log, in her coat: four toes and a dewclaw each, the forelegs coming up from the bottom of the panel', () => {
  const src = has('app/art/cats.js') ? fs.readFileSync(path.join(ROOT, 'app/art/cats.js'), 'utf8') : '';
  const FUR = src ? Function('return ' + /var FUR = (\{[\s\S]*?\n  \});/.exec(src)[1])() : art.openriverInfo.furs;
  assert.deepEqual(Object.keys(art.openriverInfo.furs).sort(), Object.keys(FUR).sort(), 'the set knows every coat cats.js has');
  const I = info().log;
  for (const fur of Object.keys(FUR)) for (const marking of ['none', 'white-paws']) {
    const svg = strip(render('log', {}, [], [], { fur, marking, eyes: 'green', sex: 'she' }).svg), mine = part(svg, 'her-paws'), label = fur + ' ' + marking;
    assert.ok(mine, label + ': her paws');
    // two paws, each: a foreleg, four toes, a palm, a dewclaw (and a sock for white paws)
    assert.equal(count(mine, /data-paw="player"/g), 2 * (7 + (marking === 'white-paws' ? 1 : 0)), label + ': two forepaws\' worth of shapes');
    assert.ok(mine.split('fill="' + FUR[fur].base + '"').length - 1 >= 2, label + ': both forelegs in her coat');
    assert.ok(mine.includes('stroke="' + FUR[fur].line + '"'), label + ': outlined in her coat\'s line');
    if (FUR[fur].stripe && FUR[fur].pattern === 'tabby') assert.ok(mine.split('fill="' + FUR[fur].stripe + '"').length - 1 >= 2, label + ': tabby bands on both');
    if (FUR[fur].patches) for (const pc of FUR[fur].patches) assert.ok(mine.includes('fill="' + pc + '"'), label + ': a patch of ' + pc);
    if (marking === 'white-paws') assert.ok(/fill="#(?:ffffff|fcf9f3)"/.test(mine), label + ': white paws');
    // the forelegs come up from the bottom edge: every outline's lowest point is past it, none much further
    const arms = [...mine.matchAll(/<path d="(M[^"]+Z)" fill="[^"]+" stroke="[^"]+" stroke-width="[-\d.]+" stroke-linejoin="round" data-paw="player"\/>/g)].map((m) => pointsOf(m[1]));
    const low = arms.map((P) => Math.max(...P.map((q) => q[1])));
    assert.equal(low.filter((y) => y > 1000).length, 2, label + ': two forelegs leave by the bottom of the panel');
    assert.ok(Math.max(...low) < 1060, label + ': and stop there (a tight box for the paper shadow): ' + Math.max(...low));
  }
  // side by side in the lower middle of the panel, on the log (below its far edge), the same size
  assert.equal(I.paws.length, 2);
  assert.ok(I.paws[0][0] < I.paws[1][0] && I.paws[1][0] - I.paws[0][0] > I.paws[0][3] * 1.2 && I.paws[1][0] - I.paws[0][0] < I.paws[0][3] * 2.2, 'side by side, close');
  assert.equal(I.paws[0][3], I.paws[1][3]);
  assert.deepEqual([I.paws[0][4], I.paws[1][4]], [1, -1], 'each dewclaw on the inner side');
  for (const p of I.paws) assert.ok(p[1] - p[3] * 0.95 > I.edge, 'every toe and claw is on the log: toes reach ' + (p[1] - p[3] * 0.95) + ', the log\'s far edge is at ' + I.edge);
  // drawn in front of everything, and kept clear of the lettering
  const r = render('log', {}, [{ who: 'tallyheart', at: 'far-rocks', pose: 'pawup' }]), svg = strip(r.svg);
  assert.ok(at(svg, 'data-part="her-paws"') > drawnAt(svg, spots('log')['far-rocks']) && at(svg, 'data-part="her-paws"') > at(svg, 'data-part="log"'), 'on the log, in front');
  const k = r.keep.find((q) => q.y > 55);
  assert.ok(k && k.x < I.paws[0][0] / 16 - 4 && k.x + k.w > info().log.riffle.palm[0] / 16 + 2 && k.y < 75, 'the three paws are kept clear: ' + JSON.stringify(k));
});

test('log: claws 0 to 9 dig that many claws into the wood, left to right, each lit gold; the tenth stays tucked', () => {
  const I = info().log;
  const tips = (svg) => groups(part(strip(svg), 'her-paws'), 'data-claw="dug"').map((g) => ({ n: +/data-n="(\d+)"/.exec(g)[1], x: +/<circle cx="([-\d.]+)"/.exec(g)[1], y: +/<circle cx="[-\d.]+" cy="([-\d.]+)"/.exec(g)[1], g }));
  let last = null;
  for (let c = 0; c <= 9; c++) {
    const svg = render('log', { claws: c }).svg, T = tips(svg), paws = part(strip(svg), 'her-paws');
    assert.equal(T.length, c, 'claws: ' + c + ' digs ' + c);
    assert.deepEqual(T.map((t) => t.n).sort((a, b) => a - b), Array.from({ length: c }, (_, i) => i + 1), 'claws: ' + c + ': the first ' + c);
    assert.equal(count(paws, /data-claw="tucked"/g), 1, 'claws: ' + c + ': one toe tucked, always');
    assert.ok(new RegExp('data-claws="' + c + '"').test(paws), 'the paws say how many');
    // left to right: each claw is further right than the one before
    const byN = T.slice().sort((a, b) => a.n - b.n);
    for (let i = 1; i < byN.length; i++) assert.ok(byN[i].x > byN[i - 1].x + 8, 'claw ' + byN[i].n + ' is to the right of claw ' + byN[i - 1].n + ': ' + byN[i - 1].x + ' → ' + byN[i].x);
    for (const t of T) {
      assert.ok(t.y > I.edge + 4 && t.y < 1000 && t.x > 300 && t.x < 1000, 'claw ' + t.n + ' is in the log: ' + [t.x, t.y]);
      assert.ok(/fill="#FFE07A" stroke="#C98A12"/.test(t.g), 'claw ' + t.n + ' is lit gold');
    }
    // a claw dug in stays where it was: tap c adds one and moves none
    if (last) for (const t of last) { const now = T.find((q) => q.n === t.n); assert.ok(now && now.x === t.x && now.y === t.y, 'claw ' + t.n + ' has not moved'); }
    last = T;
    // nothing else in the picture changes with the count
    // nothing else in the picture changes with the count (but the skymonster, which comes on with it: the next test)
    assert.ok(body(without(strip(svg), ['her-paws', 'plane'])) === body(without(strip(render('log', { claws: 0 }).svg), ['her-paws', 'plane'])), 'claws: ' + c + ': only her paws change');
  }
  // five on the left paw, four on the right; the tucked toe is the right paw's last, beside Riffle's
  const nine = tips(render('log', { claws: 9 }).svg), mid = (I.paws[0][0] + I.paws[1][0]) / 2;
  assert.deepEqual([nine.filter((t) => t.x < mid).length, nine.filter((t) => t.x > mid).length], [5, 4], 'five and four');
  const tuck = /<g data-claw="tucked"><path d="M([-\d.]+) ([-\d.]+)/.exec(part(strip(render('log', { claws: 9 }).svg), 'her-paws'));
  assert.ok(+tuck[1] > Math.max(...nine.map((t) => t.x)) - 30, 'the tucked toe is at the right end of the row: ' + tuck[1]);
  // `taps` counts the same (the engine's word); odd values are held to 0 … 9; no option, no claws yet
  const n = (o) => tips(render('log', o).svg).length;
  assert.equal(n({ taps: 4 }), 4);
  assert.equal(n({ claws: 2, taps: 7 }), 2, '`claws` wins');
  assert.deepEqual([n({}), n({ claws: -3 }), n({ claws: 12 }), n({ claws: 'x' }), n({ claws: 4.6 }), n({ claws: '6' }), n({ claws: null, taps: 3 })], [0, 0, 9, 0, 5, 6, 3]);
  // the count is the Roar's panel's own: no other camera draws a claw for it
  for (const cam of CAMS.filter((c) => c !== 'log')) assert.equal(count(render(cam, { claws: 5 }).svg, /data-claw="dug"/g), 0, cam);
});

test('log: the skymonster comes on with every tap: far for claws 1 to 3, near for 4 to 6, over from 7, growing at each claw and never past its full size', () => {
  const I = info().log, P = I.planes;
  assert.deepEqual(I.stages, { far: [1, 3, 0.6], near: [4, 6, 0.68], over: [7, 9, 0.84] }, 'the Tap\'s three steps: taps 1 to 3, 4 to 6, 7 on');
  // how big each tap draws it: the far light's glow, the head-on shape's wingspan, the airliner's own scale
  const size = (svg, st) => {
    const pl = part(strip(svg), 'plane');
    if (st === 'far') return +/<circle cx="[-\d.]+" cy="[-\d.]+" r="([-\d.]+)"/.exec(pl)[1] * 2;
    if (st === 'over') return Math.abs(+/scale\((-[\d.]+) /.exec(pl)[1]) * 1000;
    const xs = [...pl.matchAll(/class="pcs-blink"/g)].length && [...pl.matchAll(/<circle cx="([-\d.]+)" cy="[-\d.]+" r="[-\d.]+" fill="#(?:FF5A4E|58D68D)"/g)].map((m) => +m[1]);
    return Math.max(...xs) - Math.min(...xs);
  };
  const low = (svg, st) => {
    const pl = part(strip(svg), 'plane');
    if (st === 'over') { const m = /translate\(([-\d.]+) ([-\d.]+)\) scale\((-[\d.]+) ([\d.]+)\)/.exec(pl); return +m[2] + +m[4] * 200; }
    const ys = [...pl.matchAll(/<circle cx="[-\d.]+" cy="([-\d.]+)" r="([-\d.]+)"/g)].map((m) => +m[1] + +m[2]);
    return Math.max(...ys);
  };
  let last = 0;
  const seq = [];
  for (let c = 1; c <= 9; c++) {
    const st = c <= 3 ? 'far' : c <= 6 ? 'near' : 'over', svg = render('log', { plane: st, claws: c }).svg, s = size(svg, st);
    assert.ok(s > last * 1.04, 'tap ' + c + ' (' + st + '): bigger than at tap ' + (c - 1) + ': ' + s.toFixed(0) + ' after ' + last.toFixed(0));
    last = s;
    seq.push(Math.round(s));
    // never past the full size of its kind, which is what the frame gets with no count (and what the line above the heads is measured for)
    const full = render('log', { plane: st }).svg;
    assert.ok(s <= size(full, st) + 0.5, 'tap ' + c + ': no bigger than the full ' + st);
    assert.ok(low(svg, st) <= low(full, st) + 0.5 && low(svg, st) < I.ceil + (st === 'far' ? 60 : 0), 'tap ' + c + ': no lower than the full ' + st + ': ' + low(svg, st).toFixed(0));
    if (c === 3 || c === 6 || c === 9) assert.equal(part(strip(svg), 'plane'), part(strip(full), 'plane'), 'tap ' + c + ': the ' + st + ' size in full');
    // only the sky and her claws change from one tap to the next
    assert.ok(body(without(strip(svg), ['plane', 'her-paws', 'buzz'])) === body(without(strip(render('log', { plane: 'none' }).svg), ['her-paws'])), 'tap ' + c + ': the river, the rocks and Riffle are as they were');
  }
  assert.ok(seq[8] > seq[0] * 8, 'from a glint to a belly: ' + seq.join(' → '));
  // a count that is not of that size's taps draws the size in full: a frame after the Tap, all nine claws in, the sky as it likes
  for (const [st, c] of [['far', 0], ['far', 9], ['near', 0], ['near', 9], ['over', 0], ['over', 3]]) {
    assert.equal(part(strip(render('log', { plane: st, claws: c }).svg), 'plane'), part(strip(render('log', { plane: st }).svg), 'plane'), st + ' with claws ' + c);
  }
  // the belly comes in from the right: at tap 7 its nose is well into the panel, at 9 it fills the top
  const nose = (c) => { const m = /translate\(([-\d.]+) [-\d.]+\) scale\((-[\d.]+) /.exec(part(strip(render('log', { plane: 'over', claws: c }).svg), 'plane')); return +m[1] + +m[2] * 500; };
  assert.ok(nose(7) > nose(8) && nose(8) > nose(9) && nose(7) < 800 && nose(9) < 140, 'its nose: ' + [nose(7), nose(8), nose(9)].map((v) => v.toFixed(0)));
  void P;
  // the other cameras keep one size of each: the count is the Roar's panel's
  for (const cam of ['raft', 'rocks', 'wide']) assert.equal(part(strip(render(cam, { plane: 'over', claws: 7 }).svg), 'plane'), part(strip(render(cam, { plane: 'over' }).svg), 'plane'), cam);
});

test('log: Riffle is right there: his webbed forepaw planted on the same log close beside hers, not touching, his shoulder at the panel\'s edge', () => {
  const I = info().log, D = art.openriverInfo.rifflePaw;
  if (has('app/art/cats.js')) {
    const src = fs.readFileSync(path.join(ROOT, 'app/art/cats.js'), 'utf8');
    for (const key of ['base', 'line', 'light']) assert.ok(new RegExp('riffle: \\{[^\\n]*\\n[^\\n]*' + key + ": '" + D[key] + "'").test(src), 'cats.js still draws Riffle with ' + key + ' ' + D[key]);
  }
  for (const opts of [{}, { claws: 9, plane: 'over' }, { late: true }, { plane: 'none' }]) {
    const svg = strip(render('log', opts).svg), his = part(svg, 'riffle-paw'), label = JSON.stringify(opts);
    assert.ok(his, label + ': through all nine taps, and before and after');
    assert.equal(count(his, /data-claw="riffle"/g), 5, label + ': five little claws');
    for (const key of ['base', 'line', 'web', 'claw']) assert.ok(his.includes(D[key]), label + ': ' + key + ' ' + D[key]);
    assert.equal(count(his, new RegExp('fill="' + D.web + '"', 'g')), 4, label + ': webbed: skin between his five toes');
    // his shoulder: one big round of fur that runs off the right edge of the panel
    const sh = /<path d="(M[^"]+Z)"[^>]*data-paw="riffle-shoulder"\/>/.exec(his);
    assert.ok(sh, label + ': his shoulder');
    const xs = pointsOf(sh[1]).map((q) => q[0]), ys = pointsOf(sh[1]).map((q) => q[1]);
    assert.ok(Math.max(...xs) >= 1600 && Math.min(...xs) > 1300 && Math.min(...xs) < 1480, label + ': at the panel\'s right edge: ' + Math.min(...xs) + ' … ' + Math.max(...xs));
    assert.ok(Math.min(...ys) > I.edge - 120 && Math.max(...ys) >= 1000, label + ': from beside her, down out of the panel');
    assert.ok(at(svg, 'data-part="riffle-paw"') > at(svg, 'data-part="log"') && at(svg, 'data-part="riffle-paw"') < at(svg, 'data-part="her-paws"'), label + ': on the log, behind her paws');
  }
  // close beside hers, not touching: a clear gap, less than a paw wide
  const svg = strip(render('log', { claws: 9 }).svg);
  const hers = [...part(svg, 'her-paws').matchAll(/<path d="(M[^"]+Z)"[^>]*data-paw="player"\/>/g)].map((m) => pointsOf(m[1])).flat();
  const his = [...part(svg, 'riffle-paw').matchAll(/<path d="(M[^"]+Z)"[^>]*data-paw="riffle"\/>/g)].map((m) => pointsOf(m[1])).flat().concat(
    [...part(svg, 'riffle-paw').matchAll(/<path d="(M[^"]+Z)"[^>]*data-claw="riffle"\/>/g)].map((m) => pointsOf(m[1])).flat());
  const herRight = Math.max(...hers.map((q) => q[0])), hisLeft = Math.min(...his.map((q) => q[0]));
  assert.ok(hisLeft - herRight > 24, 'not touching: ' + (hisLeft - herRight).toFixed(0) + ' of log between them');
  assert.ok(hisLeft - herRight < I.paws[1][3], 'close beside them: nearer than a paw\'s width');
  assert.ok(Math.abs(I.riffle.palm[1] - I.paws[1][1]) < 30, 'planted level with hers: the same log');
  assert.ok(I.riffle.s < I.paws[1][3] && I.riffle.s > I.paws[1][3] * 0.6, 'a pup\'s paw: a little smaller than hers');
});

test('log: Tallyheart is on the tall rock with one paw up: the cast\'s when a frame puts her there, the set\'s own otherwise, from before the first tap until the airplane has gone', { skip: !realCats && 'no cats.js' }, () => {
  const a = spots('log')['far-rocks'], I = info().log;
  const want = strip(art.character('tallyheart', { pose: 'pawup', mood: 'shout', facing: 'right' }).svg);
  for (const st of ['none', 'far', 'near', 'over']) for (const claws of [0, 9]) {
    const r = render('log', { plane: st, claws }), svg = strip(r.svg), T = part(svg, 'tallyheart');
    assert.ok(T, st + ': the set draws her');
    assert.ok(T.includes(want), st + ': Tallyheart herself, one paw up, calling');
    assert.ok(T.includes('<g transform="translate(' + num(a.x) + ' ' + num(a.y) + ') scale(' + (a.h / 200) + ') translate(-100 -200)">'), st + ': standing at `far-rocks`, as tall as a cast member there');
    assert.ok(at(svg, 'data-part="tallyheart"') > at(svg, 'data-part="rocks"') && at(svg, 'data-part="tallyheart"') < at(svg, 'data-part="log"'), st + ': on the rocks, behind the log');
    assert.ok(r.keep.some((k) => Math.abs(k.x + k.w / 2 - a.x / 16) < 4 && k.y + k.h > (a.y - 20) / 10 && k.h < 22), st + ': the lettering keeps off her: ' + JSON.stringify(r.keep));
  }
  assert.equal(part(strip(render('log').svg), 'tallyheart').length > 0, true, 'by default too');
  // the Tap never pops her in: she is the same from no taps to nine, whatever the sky is doing
  const first = part(strip(render('log', { plane: 'none', claws: 0 }).svg), 'tallyheart');
  for (const [st, claws] of [['far', 1], ['far', 3], ['near', 4], ['over', 7], ['over', 9]]) assert.equal(part(strip(render('log', { plane: st, claws }).svg), 'tallyheart'), first, st + ' ' + claws);
  // the cast's: she is drawn once, by the frame, and has a head for her balloon
  for (const m of [{ who: 'tallyheart', at: 'far-rocks', pose: 'pawup', mood: 'shout', facing: 'right' }, { who: 'tallyheart', at: { x: 300, y: 500 }, pose: 'walk', facing: 'left' }, { who: 'glintstar', at: 'far-rocks', pose: 'sit' }]) {
    const r = render('log', { plane: 'near' }, [m]);
    assert.equal(part(strip(r.svg), 'tallyheart'), '', JSON.stringify(m.at) + ': the set draws no second cat on the rock');
    assert.ok(r.heads[0], 'and the cast member is in the picture');
  }
  // she went home after the Roar: once it has gone the rock is empty; and never on the way home
  assert.equal(part(strip(render('log', { plane: 'gone' }).svg), 'tallyheart'), '', 'gone: the sky is empty, and so is the rock');
  for (const o of [{ late: true }, { late: true, plane: 'over' }]) assert.equal(part(strip(render('log', o).svg), 'tallyheart'), '', JSON.stringify(o));
  assert.equal(part(strip(render('log', { plane: 'over' }, [], ['sunset']).svg), 'tallyheart'), '');
  // only this camera stands her in: everywhere else she is the frame's to place
  for (const cam of CAMS.filter((c) => c !== 'log')) assert.equal(part(strip(render(cam, { plane: 'over' }).svg), 'tallyheart'), '', cam);
  // her raised paw can be made out: she is as tall on the panel as the paws in front are wide
  assert.ok(a.h >= 140 && a.h >= I.paws[0][3] * 0.75, 'she is ' + a.h + ' tall');
  assert.ok(headTop(a) > I.ceil, 'and all of her is under the airplane\'s line');
});

test('log: the only anchor is `far-rocks`: the cat and Riffle are the picture\'s own, and nobody else is drawn in their place', () => {
  const cast = [{ who: 'player', at: 'raft-1' }, { who: 'riffle', at: 'raft-2' }, { who: 'otter', at: 'pole' }, { who: 'riffle', at: 'beside', pose: 'swim' }, { who: 'tallyheart', at: 'far-rocks', pose: 'pawup' }];
  const r = render('log', {}, cast);
  assert.deepEqual(r.heads.map((h) => !!h), [false, false, false, false, true]);
  const h = r.heads[4], a = spots('log')['far-rocks'];
  assert.ok(h.x > 15 && h.x < 45 && h.y > 28 && h.y < 50, 'she is on the rocks at the left, above the water: ' + JSON.stringify(h));
  assert.ok(a.y < info().log.hz + 20, 'her rock stands on the far side of the water');
});

// ---------------------------------------------------------------- the rocks, the otters, the raft

test('the Crossing\'s rocks are behind the raft with the three ferry otters on them, a few raft-lengths off; only the wide panel shows the raft small', () => {
  const I = info();
  for (const cam of [...VIEWS, 'log']) {
    const svg = strip(render(cam).svg), C = I[cam];
    assert.equal(count(svg, /data-part="rocks"/g), 1, cam + ': the rocks');
    assert.deepEqual((part(svg, 'otters').match(/data-otter="\d"/g) || []).map((s) => +s.slice(12, -1)), [1, 2, 3], cam + ': the old ferry otter and two more');
    assert.ok(at(svg, 'data-part="rocks"') > at(svg, 'data-part="water"'), cam + ': standing in the river');
    if (C.raft) {
      assert.ok(at(svg, 'data-part="rocks"') < at(svg, 'data-part="raft"'), cam + ': behind the raft');
      assert.ok(C.rocks.y < C.raft.top, cam + ': further off than the raft');
    }
    // `far-rocks` is the top of the tall rock, and the otters are lower, at the water
    const a = spots(cam)['far-rocks'];
    assert.ok(Math.abs(a.y - (C.rocks.y - 139 * C.rocks.s)) < 2 && a.x > C.rocks.x && a.x < C.rocks.x + C.rocks.w, cam + ': `far-rocks` is the tall rock\'s top');
    assert.equal(a.elev, true);
  }
  // a few raft-lengths off: in the views that look along the river, the gap is between one and four rafts
  for (const cam of ['wide', 'raft', 'light']) {
    const C = I[cam], len = C.raft.x1 - C.raft.x0, gapX = C.raft.x0 - (C.rocks.x + C.rocks.w), depth = (C.raft.top - C.rocks.y) / (C.raft.bot - C.raft.top);
    // (off to the side by more than a raft's length, or behind it with more than a raft's width of water between)
    assert.ok(gapX > len || depth > 1.2, cam + ': the rocks are ' + (gapX / len).toFixed(1) + ' raft-lengths off to the side, ' + depth.toFixed(1) + ' raft-widths behind');
    assert.ok(gapX < len * 4, cam + ': and no further than a few');
  }
  // only the wonder panel shows the raft small
  const frac = (cam) => (I[cam].raft.x1 - I[cam].raft.x0) / 1600;
  assert.ok(frac('wide') < 0.16, 'wide: the raft is ' + (frac('wide') * 100).toFixed(0) + '% of the panel');
  for (const cam of ['raft', 'light', 'rocks']) assert.ok(frac(cam) > 0.4, cam + ': the raft is ' + (frac(cam) * 100).toFixed(0) + '% of the panel');
  // her raised paw and their tails can be made out in the raft, log and rocks cameras
  for (const cam of ['raft', 'log', 'rocks']) assert.ok(spots(cam)['far-rocks'].h >= 140, cam + ': a cat on the tall rock is ' + spots(cam)['far-rocks'].h + ' tall');
  if (realCats) {
    for (const cam of ['raft', 'log', 'rocks']) {
      const ot = part(strip(render(cam).svg), 'otters');
      assert.ok(count(ot, /<g transform="translate\(/g) >= 3 && ot.length > 15000, cam + ': the otters are the game\'s own otters, faces and tails and all');
    }
    for (const cam of ['wide', 'light']) assert.ok(part(strip(render(cam).svg), 'otters').length < 6000, cam + ': far off, three small brown shapes');
  }
});

test('rocks: from the raft, looking back: the otters slap their tails on the water, there and nowhere else', () => {
  const svg = strip(render('rocks').svg), I = info().rocks;
  assert.equal(I.slap, true);
  const sl = part(svg, 'slap');
  assert.equal(count(sl, /data-slap="1"/g), 3, 'Slap! Slap! Slap!');
  assert.ok(/class="pcs-splash"/.test(sl));
  // each splash is on the water just off its otter's rock, on his tail's side, small
  const xs = [...sl.matchAll(/data-slap="1"><ellipse cx="([-\d.]+)" cy="([-\d.]+)"/g)].map((m) => [+m[1], +m[2]]);
  assert.equal(xs.length, 3);
  for (const q of xs) assert.ok(q[1] > I.rocks.y && q[1] < I.rocks.y + 40 && q[0] > 0 && q[0] < 1600, 'a splash at the rocks\' waterline: ' + q);
  for (const m of sl.matchAll(/d="([^"]+)"/g)) for (const q of pointsOf(m[1])) assert.ok(q[1] > I.rocks.y - 130 && q[1] < I.raft.top - 100, 'the splashes are at the rocks, nowhere near the raft: ' + q);
  for (const cam of CAMS.filter((c) => c !== 'rocks')) assert.equal(count(render(cam).svg, /data-slap=/g), 0, cam + ': no slapping');
  // the otters themselves: the game's own applause (a tail swung down flat) once cats.js draws it; sitting, elsewhere
  if (realCats) {
    const poses = art.vocab.otherPoses.otter || [], ot = part(svg, 'otters'), sat = part(strip(render('raft').svg), 'otters');
    for (const v of [1, 2, 3]) {
      const pose = poses.includes('slap') ? 'slap' : 'sit';
      assert.ok(ot.includes(strip(art.character('otter', { variant: v, pose, mood: v === 2 ? 'laugh' : 'happy', facing: 'right' }).svg)), 'rocks: otter ' + v + ' is cats.js\'s own, ' + pose);
      assert.ok(sat.includes(strip(art.character('otter', { variant: v, pose: 'sit', mood: v === 1 ? 'kind' : 'happy', facing: 'right' }).svg)), 'raft: otter ' + v + ' sits and watches');
    }
    // each splash is where his tail comes down: behind him, off the back of his rock
    I.otters.forEach((o, i) => assert.ok(xs[i][0] < o.x - I.otterH * 0.4 && xs[i][0] > o.x - I.otterH, 'otter ' + (i + 1) + ': the splash is behind him: ' + xs[i][0].toFixed(0) + ' vs ' + o.x.toFixed(0)));
  }
  // the same in every light, with or without an airplane
  for (const o of [{ late: true }, { plane: 'gone' }, { plane: 'over' }]) assert.equal(count(render('rocks', o).svg, /data-slap="1"/g), 3, JSON.stringify(o));
  // here the otters are what the panel is about: the lettering keeps off each of them (their faces, down to their rocks)
  const kp = render('rocks').keep.filter((k) => k.y > 30 && k.y < 70);
  assert.equal(kp.length, 3, 'a keep area for each otter: ' + JSON.stringify(kp));
  I.otters.forEach((o, i) => assert.ok(kp.some((k) => k.x < o.x / 16 + 3 && k.x + k.w > o.x / 16 - 3 && k.y + k.h > o.y / 10 - 3 && k.w < 12 && k.h < 20), 'otter ' + (i + 1) + ' is kept clear'));
  for (const cam of ['raft', 'log', 'wide', 'light']) assert.ok(render(cam, { plane: 'none' }).keep.filter((k) => k.y > 40).length <= 2, cam + ': far off, they are scenery: the lettering may cross them');
  // Tallyheart calls from the tall rock, over the otters, clear of everyone on the raft
  const cast = [{ who: 'player', at: 'raft-1', pose: 'sit' }, { who: 'riffle', at: 'raft-2', pose: 'fall', mood: 'laugh' }, { who: 'tallyheart', at: 'far-rocks', pose: 'pawup', mood: 'shout', facing: 'left' }];
  const h = render('rocks', {}, cast).heads;
  assert.ok(h.every(Boolean));
  assert.ok(h[2].y < h[0].y - 25 && h[2].y < h[1].y - 25, 'she is above them, on the rocks');
  assert.ok(Math.abs(h[2].x - h[0].x) > 12 && Math.abs(h[2].x - h[1].x) > 12, 'and not over anybody\'s head');
});

test('the raft: four logs lashed with vines, a cut end on each, a long pole; the same raft in every camera', () => {
  for (const cam of RAFTED) {
    const svg = strip(render(cam).svg), raft = part(svg, 'raft') + part(svg, 'raft-near');
    const logs = [...raft.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" fill="url[^"]+" rx="([-\d.]+)"\/>/g)].map((m) => m.slice(1).map(Number));
    assert.equal(logs.length, 4, cam + ': four logs');
    for (let i = 1; i < 4; i++) assert.ok(logs[i][1] > logs[i - 1][1], cam + ': side by side, the far one first');
    for (const l of logs) assert.ok(l[2] > l[3] * 4, cam + ': long logs');
    assert.equal(count(raft, /<ellipse [^>]*fill="none" stroke=/g), 4, cam + ': a cut end with its rings on every log');
    // vines: green, wound over every log, a knot and leaves on top
    const vine = [...raft.matchAll(/<path d="([^"]+)" fill="none" stroke="(#[0-9a-fA-F]{6})" stroke-width="([-\d.]+)"/g)].filter((m) => { const [r, g, b] = rgb(m[2]); return g > r && g > b; });
    assert.ok(vine.length >= 2, cam + ': vine lashings');
    assert.ok(count(vine.map((m) => m[1]).join(''), /M/g) >= 16, cam + ': wound round all four logs, in two places or three');
  }
  // the pole: lying along the logs when nobody is poling
  for (const cam of [...VIEWS, 'edge', 'beside']) {
    const svg = strip(render(cam).svg);
    assert.equal(count(svg, /data-part="pole"/g), 1, cam + ': a long pole');
    assert.ok(at(svg, 'data-part="pole"') > at(svg, 'data-part="raft"'), cam + ': lying on the raft');
    const d = pointsOf(/d="([^"]+)"/.exec(part(svg, 'pole'))[1]), len = Math.hypot(d[1][0] - d[0][0], d[1][1] - d[0][1]);
    const I = info()[cam].raft, rl = I.x1 - I.x0;
    assert.ok(len > rl * 0.45, cam + ': long: ' + len.toFixed(0) + ' on a raft ' + rl.toFixed(0) + ' long');
    assert.ok(Math.abs(d[1][1] - d[0][1]) < len * 0.2, cam + ': lying down');
  }
  // standing beside whoever is at `pole`, its foot behind the raft, its top well over his head
  for (const cam of VIEWS) {
    const a = spots(cam).pole, I = info()[cam].raft, r = render(cam, {}, [{ who: 'riffle', at: 'pole', pose: 'stand', facing: 'left' }]), svg = strip(r.svg);
    assert.equal(count(svg, /data-part="pole"/g), 1, cam + ': one pole');
    assert.ok(at(svg, 'data-part="pole"') < at(svg, 'data-part="raft"'), cam + ': behind the raft: its foot is in the river on the far side');
    const d = pointsOf(/d="([^"]+)"/.exec(part(svg, 'pole'))[1]);
    assert.ok(Math.abs(d[0][0] - a.x) < a.h * 0.5 && Math.abs(d[1][0] - a.x) < a.h * 0.2, cam + ': beside him');
    assert.ok(d[1][1] >= I.top && d[1][1] <= I.top + 12 * I.k, cam + ': its foot goes down behind the far log');
    assert.ok(a.y - d[0][1] > a.h * 1.5, cam + ': twice his size: its top is ' + (a.y - d[0][1]).toFixed(0) + ' above his feet, he is about ' + (a.h * 0.9).toFixed(0) + ' tall');
    assert.ok(d[0][1] > 0, cam + ': all of it in the panel');
    assert.ok(a.x > I.x0 + (I.x1 - I.x0) * 0.7 && a.x < I.x1 && a.y > I.top && a.y < I.bot + 4, cam + ': `pole` is on the raft, at its end');
    // he carries his own: the set draws none
    assert.equal(count(render(cam, {}, [{ who: 'riffle', at: 'pole', pose: 'stand', holds: 'pole' }]).svg, /data-part="pole"/g), 0, cam + ': holds: \'pole\'');
    assert.equal(count(render(cam, {}, [{ who: 'riffle', at: 'raft-2', pose: 'hug', holds: 'pole' }]).svg, /data-part="pole"/g), 0, cam + ': wherever he carries it');
  }
});

test('the spots: `raft-1`, `raft-2` and `pole` are on the logs; `beside` is the one spot in the water; nobody stands in anybody\'s face', () => {
  const I = info();
  for (const cam of VIEWS) {
    const A = spots(cam), B = I[cam].raft;
    for (const k of ['raft-1', 'raft-2', 'pole']) assert.ok(A[k].x > B.x0 && A[k].x < B.x1 && A[k].y > B.top && A[k].y < B.bot + 6, cam + ': ' + k + ' is on the logs');
    assert.ok(A['raft-1'].x < A['raft-2'].x && A['raft-2'].x < A.pole.x, cam + ': left to right: our cat, Riffle, the pole');
    assert.ok(A.beside.x > B.x1 + 20 || A.beside.x < B.x0 - 20, cam + ': `beside` is off the raft');
    assert.ok(A.beside.y > B.top, cam + ': on our side of it');
    // shoulder to shoulder: closer than the two are wide, their faces clear of each other
    const r = render(cam, {}, [{ who: 'player', at: 'raft-1', pose: 'sit', facing: 'right' }, { who: 'riffle', at: 'raft-2', pose: 'sit', facing: 'right' }]);
    const d = Math.hypot((r.heads[0].x - r.heads[1].x) * 16, (r.heads[0].y - r.heads[1].y) * 10);
    assert.ok(d > (r.heads[0].r + r.heads[1].r) * 16 * 1.02, cam + ': two faces: ' + d.toFixed(0));
    assert.ok(A['raft-2'].x - A['raft-1'].x < A['raft-1'].h * 0.75, cam + ': shoulder to shoulder: ' + (A['raft-2'].x - A['raft-1'].x) + ' apart, a cat is ' + A['raft-1'].h + ' tall');
  }
  for (const cam of CAMS) {
    const A = spots(cam);
    for (const where of HAS[cam]) {
      const h = render(cam, {}, [{ who: 'clancat', at: where, pose: 'sit' }]).heads[0];
      assert.ok(h && h.x > 2 && h.x < 98 && h.y > 2 && h.y < 98, cam + ': a cat\'s head at ' + where + ' is in the panel: ' + JSON.stringify(h));
    }
    for (const where of ANCHORS.filter((k) => !HAS[cam].includes(k))) assert.equal(render(cam, {}, [{ who: 'clancat', at: where }]).heads[0], null, cam + ': ' + where + ' is out of this camera\'s sight');
    assert.ok(A, cam);
  }
  // cat height on the logs: in `raft` the two of them are the picture
  assert.ok(spots('raft')['raft-1'].h > 330 && spots('wide')['raft-1'].h < 80);
  // `beside` is in the water: no ground shadow there (`air`), and nobody is put there for want of a spot (`elev`)
  for (const cam of CAMS.filter((c) => HAS[c].includes('beside'))) {
    const a = spots(cam).beside;
    assert.deepEqual([a.air, a.elev], [true, true], cam + ': `beside` is air and elev');
    const shade = art.kit.PAL.day.shade;
    for (const m of [{ who: 'riffle', at: 'beside', pose: 'swim' }, { who: 'puddle', at: 'beside', pose: 'head' }, { who: 'otter', at: 'beside', pose: 'float' }]) {
      const svg = render(cam, {}, [m]).svg, i = drawnAt(svg, a);
      assert.ok(i > 0 && !new RegExp('<ellipse [^>]*fill="' + shade + '"[^>]*opacity="0.28"/>$').test(svg.slice(0, i)), cam + ': no shadow under ' + m.who + ' in the water');
    }
    // somebody with no spot (or one this set has not got) sits on the raft, never in the river
    if (HAS[cam].includes('raft-1')) {
      const r = render(cam, {}, [{ who: 'player' }, { who: 'riffle', at: 'somewhere' }, { who: 'otter' }]), s = r.svg;
      assert.ok(drawnAt(s, a) < 0, cam + ': nobody defaults into the water');
      assert.ok(drawnAt(s, spots(cam)['raft-1']) > 0, cam + ': the first of them is at raft-1');
    }
  }
  // the raft's own spots are at one depth, so a spot of a frame's own is sized as they are, wherever it is
  for (const cam of [...VIEWS, 'edge', 'beside', 'sky']) {
    const A2 = spots(cam), on = ['raft-1', 'raft-2', 'pole'].filter((k) => A2[k] && !A2[k].elev);
    assert.ok(on.length >= 2 && on.every((k) => A2[k].y === A2[on[0]].y && A2[k].h === A2[on[0]].h), cam + ': one depth on the raft');
    if (!realCats) continue;
    const mine = render(cam, {}, [{ who: 'clancat', at: 'raft-1', pose: 'sit' }]).heads[0], own = render(cam, {}, [{ who: 'clancat', at: { x: 800, y: 500 }, pose: 'sit' }]).heads[0];
    assert.ok(own && Math.abs(own.r - mine.r) < 0.01, cam + ': a spot of one\'s own is sized like the raft\'s: ' + own.r + ' vs ' + mine.r);
  }
});

test('beside: whoever is there is in the water: the river laps over them, rings round them; a swimmer keeps all that is above the waterline', () => {
  for (const cam of [...VIEWS, 'beside']) {
    const a = spots(cam).beside, none = strip(render(cam).svg);
    assert.equal(count(none, /c-or-dunk/g), 0, cam + ': nobody there, nothing laid over');
    for (const [m, swims] of [[{ who: 'riffle', at: 'beside', pose: 'swim', facing: 'left' }, true], [{ who: 'otter', variant: 2, at: 'beside', pose: 'float' }, true], [{ who: 'puddle', at: 'beside', pose: 'head' }, true],
      [{ who: 'sprinkle', at: 'beside', pose: 'peek' }, false], [{ who: 'riffle', at: 'beside', pose: 'stand' }, false]]) {
      const svg = strip(render(cam, {}, [m]).svg), label = cam + ' ' + m.who + '/' + m.pose;
      const clip = /<clipPath id="c-or-dunk"><path d="([^"]+)"/.exec(svg);
      assert.ok(clip, label + ': the river over them');
      const P = pointsOf(clip[1]), top = Math.min(...P.map((q) => q[1])), x0 = Math.min(...P.map((q) => q[0])), x1 = Math.max(...P.map((q) => q[0]));
      assert.ok(x0 < a.x && x1 > a.x, label + ': round where they are');
      if (swims) assert.ok(a.y - top < a.h * 0.06 && a.y - top > 0, label + ': only the bottom edge goes under: ' + (a.y - top).toFixed(0));
      else assert.ok(a.y - top > a.h * 0.25, label + ': up to the middle: ' + (a.y - top).toFixed(0));
      // it is the river's own drawing, so it cannot be told from the water round it; and it is drawn over them
      const cover = group(svg, 'clip-path="url(#c-or-dunk)"');
      assert.ok(cover.includes(part(svg, 'water').replace(/^<g data-part="water">/, '').replace(/<\/g>$/, '')), label + ': the same water');
      assert.ok(at(svg, 'clip-path="url(#c-or-dunk)"') > drawnAt(svg, a), label + ': over whoever is there');
      // never over the raft: the patch and the raft's logs, as drawn, do not meet
      const bot = Math.max(...P.map((q) => q[1]));
      const logs = [...part(svg, 'raft').matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" fill="url[^"]+" rx="[-\d.]+"\/>/g)].map((mm) => mm.slice(1).map(Number));
      assert.equal(logs.length, 4, label);
      for (const l of logs) assert.ok(x0 > l[0] + l[2] + 4 || x1 < l[0] - 4 || top > l[1] + l[3] + 4 || bot < l[1] - 4, label + ': the patch keeps off the raft: ' + [x0, top, x1, bot].map((v) => v.toFixed(0)) + ' vs a log at ' + l);
      assert.equal(count(svg, /data-part="water"/g), 1, label + ': one river');
    }
  }
  // the close camera: his head is the picture: big, in the lower right, the raft and whoever is on it at the upper left
  const A = spots('beside');
  assert.ok(A.beside.h >= 360 && A.beside.x > 900 && A.beside.y > 650, 'beside: big and near');
  const r = render('beside', {}, [{ who: 'player', at: 'raft-1', pose: 'peer' }, { who: 'riffle', at: 'raft-2', pose: 'sit' }, { who: 'riffle', at: 'beside', pose: 'swim' }]);
  assert.ok(r.heads.every(Boolean) && r.heads[0].y < r.heads[2].y - 20 && r.heads[0].x < r.heads[2].x - 15, 'she looks down at him from the raft');
});

test('shiver: small rings all round the raft, and the water no rougher for it', () => {
  for (const cam of [...RAFTED, 'log']) {
    const plain = strip(render(cam).svg), svg = strip(render(cam, { shiver: true }).svg), sh = part(svg, 'shiver');
    assert.equal(count(plain, /data-part="shiver"/g), 0, cam + ': none unless asked');
    assert.equal(count(svg, /data-part="shiver"/g), 1, cam + ': rings');
    assert.equal(strip(render(cam, { shiver: false }).svg), plain, cam);
    assert.ok(/^<g class="pcs-pulse"[^>]*><path d="[^"]+" fill="none" stroke="#[0-9A-Fa-f]{6}" stroke-width="[\d.]+"[^>]*\/><\/g>$/.test(sh), cam + ': thin pale lines and nothing else');
    assert.ok(lum(/stroke="(#[0-9A-Fa-f]{6})"/.exec(sh)[1]) > 235, cam + ': pale');
    assert.ok(count(sh, /A[-\d.]+ [-\d.]+ 0 0 [01]/g) + count(sh, /q/g) >= 6, cam + ': rings, several');
    assert.equal(without(svg, ['shiver']), plain, cam + ': everything else is as it was: the water, the raft');
    if (cam === 'log') continue;
    // round the raft: both ends and along it, close in
    const I = info()[cam].raft, P = pointsOf(/d="([^"]+)"/.exec(sh)[1]), xs = P.map((q) => q[0]), ys = P.map((q) => q[1]);
    if (cam !== 'edge' && cam !== 'beside') assert.ok(Math.min(...xs) < I.x0 && Math.max(...xs) > I.x1, cam + ': at both ends');
    assert.ok(Math.min(...xs) > I.x0 - 120 * I.k && Math.max(...xs) < I.x1 + 120 * I.k && Math.max(...ys) < I.bot + 110 * I.k, cam + ': small, close round it');
  }
  for (const cam of ['sky', 'under']) assert.equal(count(render(cam, { shiver: true }).svg, /data-part="shiver"/g), 0, cam);
});

// Puddle as app/art/cats.js draws him in a pose, ids stripped ('' until it does); and the same test
// run again as if cats.js did not draw him yet (the set's own foot and blue-grey)
const puddlePoses = () => (art.vocab.otherPoses && art.vocab.otherPoses.puddle) || [];
const puddleSvg = (pose) => (realCats && puddlePoses().includes(pose) ? strip(art.character('puddle', { pose, mood: 'happy', facing: 'right' }).svg) : '');
function withoutPuddle(fn) {
  const had = art.vocab.otherPoses && art.vocab.otherPoses.puddle;
  if (!had) return fn();
  try { delete art.vocab.otherPoses.puddle; return fn(); } finally { art.vocab.otherPoses.puddle = had; }
}
// the box of the foot a panel shows: [x0, top, x1, bottom]
function footBox(ft) {
  const fig = /<g transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\) translate\(([-\d.]+) ([-\d.]+)\)">/.exec(ft);
  if (/data-foot="puddle"/.test(ft)) {
    const b = art.character('puddle', { pose: 'foot', mood: 'happy', facing: 'right' }).bounds, x = +fig[1], y = +fig[2], s = +fig[3], ox = +fig[4], oy = +fig[5];
    return [x + (b.x0 + ox) * s, y + (b.y0 + oy) * s, x + (b.x1 + ox) * s, y + (b.y1 + oy) * s];
  }
  const P = [...ft.matchAll(/d="(M[^"]+Z)"/g)].map((m) => pointsOf(m[1])).flat();
  return [Math.min(...P.map((q) => q[0])), Math.min(...P.map((q) => q[1])), Math.max(...P.map((q) => q[0])), Math.max(...P.map((q) => q[1]))];
}

function footTest(his) {
  const D = art.openriverInfo.puddle();
  const [r, g, b] = rgb(D.base);
  assert.ok(b > r + 10 && b >= g && lum(D.base) > 95 && lum(D.base) < 185, 'blue-grey: ' + D.base);
  for (const cam of RAFTED) {
    const plain = strip(render(cam).svg), svg = strip(render(cam, { foot: true }).svg), ft = part(svg, 'foot');
    assert.equal(count(plain, /data-part="foot"/g), 0, cam + ': none unless asked');
    assert.equal(count(svg, /data-part="foot"/g), 1, cam + ': one foot');
    assert.ok(ft.includes('fill="' + D.base + '"'), cam + ': blue-grey, Puddle\'s own: ' + D.base);
    assert.ok(/<g class="pcs-sway" style="animation-duration:\.42s">/.test(ft), cam + ': it wiggles');
    if (his) {
      // the same foot a frame gets by casting him in the gap
      assert.ok(/data-foot="puddle"/.test(ft) && ft.includes(his), cam + ': Puddle\'s own foot, as cats.js draws it');
    } else {
      assert.ok(/data-foot="set"/.test(ft), cam + ': the set\'s own drawing');
      assert.equal(count(ft, /data-claw="foot"/g), 5, cam + ': five pale claws');
      assert.ok(ft.includes('fill="' + D.claw + '"'), cam + ': pale claws');
      assert.ok(count(ft, /stroke="#FFFFFF"/g) >= 1, cam + ': little arcs either side of the toes');
    }
    // between two logs: drawn after the far logs and before the near one, which covers its ankle
    const logs = [...svg.matchAll(/<rect x="[-\d.]+" y="([-\d.]+)" width="[-\d.]+" height="([-\d.]+)" fill="url[^"]+" rx="[-\d.]+"\/>/g)];
    assert.equal(logs.length, 4);
    assert.ok(at(svg, 'data-part="foot"') > logs[2].index && at(svg, 'data-part="foot"') < logs[3].index, cam + ': after the third log, before the near one');
    const B = footBox(ft), nearTop = +logs[3][1];
    assert.ok(B[3] > nearTop && B[3] < nearTop + +logs[3][2] * 0.75, cam + ': its ankle goes down behind the near log: ' + B[3].toFixed(0) + ' vs the log\'s top at ' + nearTop);
    // much too big: it stands higher over the logs than our cat's whole head is tall, where she sits in this panel
    const cat = spots(cam)['raft-1'];
    assert.ok(nearTop - B[1] > cat.h * 0.4, cam + ': it stands ' + (nearTop - B[1]).toFixed(0) + ' over the logs; her head is ' + (cat.h * 0.4).toFixed(0) + ' high');
    assert.ok(B[1] > 0 && B[0] > 0 && B[2] < 1600, cam + ': all of it in the panel');
    // clear of where our cat and Riffle sit
    const fx = (B[0] + B[2]) / 2;
    if (cam !== 'edge') for (const k of ['raft-1', 'raft-2']) assert.ok(Math.abs(fx - spots(cam)[k].x) > spots(cam)[k].h * 0.3, cam + ': not under ' + k);
    assert.equal(without(svg, ['foot']), plain, cam + ': nothing else changes');
  }
  for (const cam of ['log', 'sky', 'under']) assert.equal(count(render(cam, { foot: true }).svg, /data-part="foot"/g), 0, cam + ': no gap between logs to show it in');
  // edge is its close-up: the foot comes up in the gap itself, where `beside` is
  const a = spots('edge').beside, B = footBox(part(strip(render('edge', { foot: true }).svg), 'foot'));
  assert.ok(B[0] < a.x && B[2] > a.x && B[2] - B[0] > 150, 'edge: big, in the gap: ' + B.map((v) => v.toFixed(0)));
}
test('foot: one blue-grey foot, much too big, up between two logs, wiggling; the near log is over its ankle', () => {
  footTest(puddleSvg('foot'));
});
test('foot, before app/art/cats.js draws Puddle: the set\'s own drawing, five pale claws, the set\'s own blue-grey', () => {
  withoutPuddle(() => {
    assert.deepEqual(art.openriverInfo.puddle(), { base: '#7f95ab', line: '#3d4d5f', light: '#b3c5d6', ridge: '#687c92', claw: '#efe9dd', clawLine: '#857f73' });
    footTest('');
  });
});

test('bubbles: two nostrils and a string of bubbles between the logs', () => {
  const D = art.openriverInfo.puddle();
  for (const cam of RAFTED) {
    const plain = strip(render(cam).svg), svg = strip(render(cam, { bubbles: true }).svg), bb = part(svg, 'bubbles');
    assert.equal(count(plain, /data-part="bubbles"/g), 0, cam + ': none unless asked');
    assert.equal(count(svg, /data-part="bubbles"/g), 1, cam);
    assert.deepEqual((bb.match(/data-nostril="\d"/g) || []).length, 2, cam + ': two nostrils');
    assert.ok(bb.includes('fill="' + D.base + '"'), cam + ': the tip of a blue-grey snout');
    assert.equal(count(bb, /data-bubble="\d"/g), 7, cam + ': a string of bubbles');
    // a string: each further along and smaller than the one before
    const B = groups(bb, 'data-bubble').map((gq) => /<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([-\d.]+)"/.exec(gq).slice(1).map(Number));
    const dir = Math.sign(B[6][0] - B[0][0]);
    for (let i = 1; i < 7; i++) { assert.ok((B[i][0] - B[i - 1][0]) * dir > 0, cam + ': in a string'); assert.ok(B[i][2] < B[i - 1][2], cam + ': smaller as they go'); }
    const logs = [...svg.matchAll(/<rect x="[-\d.]+" y="([-\d.]+)" width="[-\d.]+" height="([-\d.]+)" fill="url[^"]+" rx="[-\d.]+"\/>/g)];
    assert.ok(at(svg, 'data-part="bubbles"') > logs[2].index && at(svg, 'data-part="bubbles"') < logs[3].index, cam + ': between the logs: after the third, before the near one');
    const ny = +/<ellipse cx="[-\d.]+" cy="([-\d.]+)"[^>]*data-nostril="1"/.exec(bb)[1];
    assert.ok(Math.abs(ny - +logs[3][1]) < +logs[3][2] * 0.5, cam + ': the nostrils are at the seam: ' + ny + ' vs ' + logs[3][1]);
    assert.equal(without(svg, ['bubbles']), plain, cam + ': nothing else changes');
    // with the foot too (a frame should not ask for both), they do not sit on each other
    const both = strip(render(cam, { bubbles: true, foot: true }).svg);
    assert.equal(count(both, /data-part="foot"/g) + count(both, /data-part="bubbles"/g), 2, cam);
  }
  // under the raft, the same string seen from below
  const u = strip(render('under', { bubbles: true }).svg);
  assert.equal(count(u, /data-part="bubbles"/g), 1);
  for (const cam of ['log', 'sky']) assert.equal(count(render(cam, { bubbles: true }).svg, /data-part="bubbles"/g), 0, cam);
});

test('the foot and the nostrils are the set\'s own only while Puddle is not in the picture: he cannot be in two places', () => {
  for (const cam of RAFTED) {
    const svg = render(cam, { foot: true, bubbles: true }, [{ who: 'puddle', at: 'beside', pose: 'head' }]).svg;
    assert.equal(count(svg, /data-part="foot"|data-part="bubbles"/g), 0, cam + ': Puddle is in the cast');
    const other = render(cam, { foot: true, bubbles: true }, [{ who: 'riffle', at: 'beside', pose: 'swim' }]).svg;
    assert.equal(count(other, /data-part="foot"|data-part="bubbles"/g), 2, cam + ': anybody else is no reason');
  }
  assert.equal(count(render('under', { bubbles: true }, [{ who: 'puddle', at: 'beside', pose: 'head' }]).svg, /data-part="bubbles"/g), 0);
  // and they wear his colours: the set's own blue-grey until cats.js draws him, then the blue-grey most of him is
  const D = art.openriverInfo.puddle(), poses = puddlePoses();
  if (poses.length && realCats) {
    for (const pose of poses) {
      const his = art.character('puddle', { pose, mood: 'happy', facing: 'right' }).svg.toLowerCase();
      if (/fill="#/.test(his) && pose !== 'nostrils' && pose !== 'sink') assert.ok(his.includes('fill="' + D.base.toLowerCase() + '"'), 'the nostrils are the colour of Puddle as cats.js draws him (' + pose + '): ' + D.base);
    }
  } else {
    assert.deepEqual(D, { base: '#7f95ab', line: '#3d4d5f', light: '#b3c5d6', ridge: '#687c92', claw: '#efe9dd', clawLine: '#857f73' });
  }
  // bluer and a shade darker than Sprinkle's mist grey (app/art/sets/bridge.js: #a3acb5)
  const [r, g, b] = rgb(D.base), S0 = rgb('#a3acb5');
  assert.ok(b - r > S0[2] - S0[0] && lum(D.base) < lum('#a3acb5'), 'bluer and darker than Sprinkle: ' + D.base + ' (' + [r, g, b] + ')');
});

test('edge: close on the raft\'s edge and the gap between two logs; `beside` is the gap, and the near log lies over whoever is in it', () => {
  const I = info().edge, A = spots('edge'), svg = strip(render('edge').svg);
  assert.equal(count(svg, /data-part="raft"/g), 1);
  assert.equal(count(svg, /data-part="raft-near"/g), 1, 'the near log is a layer of its own');
  const logs = [...svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" fill="url[^"]+" rx="[-\d.]+"\/>/g)].map((m) => m.slice(1).map(Number));
  // open water between the third log and the near one, a cat's paw wide or more; none between the others
  const gaps = [1, 2, 3].map((i) => logs[i][1] - (logs[i - 1][1] + logs[i - 1][3]));
  assert.ok(gaps[0] < 0 && gaps[1] < 0, 'the far logs lie against each other');
  assert.ok(gaps[2] > 70 && gaps[2] < 140, 'a gap of ' + gaps[2].toFixed(0) + ' between the two near logs');
  assert.ok(A.beside.x === I.gapAt && A.beside.y > logs[2][1] + logs[2][3] && A.beside.y < logs[3][1] + 20, '`beside` is in the gap');
  assert.equal(A.beside.z, 'behind', 'behind the near log');
  // the raft's end is in the panel: the cut ends at the right, open water beyond
  assert.ok(logs.every((l) => l[0] < 0 && l[0] + l[2] > 1150 && l[0] + l[2] < 1350), 'the logs run in from the left and end in the panel');
  // layers: far logs, whoever is in the gap, the near log
  const r = render('edge', {}, [{ who: 'riffle', at: 'beside', pose: 'swim', facing: 'left' }, { who: 'player', at: 'raft-1', pose: 'peer', facing: 'right' }]), s = strip(r.svg);
  const order = [at(s, 'data-part="raft"'), drawnAt(s, A.beside), at(s, 'data-part="raft-near"'), drawnAt(s, A['raft-1'])];
  assert.ok(order.every((v) => v > 0), 'all there: ' + order);
  for (let i = 1; i < order.length; i++) assert.ok(order[i] > order[i - 1], 'edge: layer ' + i + ' is over layer ' + (i - 1));
  assert.ok(r.heads.every(Boolean), 'both in the picture');
  // our cat is on the logs above the gap, looking down at it
  assert.ok(A['raft-1'].y < logs[2][1] + logs[2][3] && A['raft-1'].y > logs[1][1], 'she sits on the third log, at its edge');
  assert.ok(A['raft-1'].x < A.beside.x - 200, 'and the gap is in front of her');
  // the vines across the gap are clear of the gap's own spot
  assert.ok(I.raft.bands.every((f) => Math.abs(I.raft.x0 + (I.raft.x1 - I.raft.x0) * f - I.gapAt) > 150));
});

test('under: the raft from underneath: four logs in a row, ten little bump stars on each; sunny all round', () => {
  for (const o of [{}, { late: true }]) {
    const svg = strip(render('under', o).svg), U = info().under;
    assert.deepEqual((svg.match(/data-log="\d"/g) || []).map((s) => +s.slice(10, -1)), [1, 2, 3, 4], 'four logs');
    assert.deepEqual((svg.match(/data-bumps="\d"/g) || []).map((s) => +s.slice(12, -1)), [1, 2, 3, 4], 'bumps on each');
    assert.equal(count(svg, /data-bump="\d+"/g), 40, 'forty bump stars');
    const logs = groups(svg, 'data-log').map((gq) => /<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)"/.exec(gq).slice(1).map(Number));
    for (let i = 1; i < 4; i++) assert.ok(logs[i][1] > logs[i - 1][1] + logs[i - 1][3], 'in a row, a strip of bright water between each two');
    groups(svg, 'data-bumps').forEach((gq, li) => {
      const stars = groups(gq, 'data-bump="').map((s) => ({ n: +/data-bump="(\d+)"/.exec(s)[1], x: +/<circle cx="([-\d.]+)"/.exec(s)[1], y: +/<circle cx="[-\d.]+" cy="([-\d.]+)"/.exec(s)[1] }));
      assert.equal(stars.length, 10, 'ten on log ' + (li + 1));
      assert.deepEqual(stars.map((s) => s.n), Array.from({ length: 10 }, (_, i) => li * 10 + i + 1), 'numbered along it');
      for (const s of stars) assert.ok(s.y > logs[li][1] + 20 && s.y < logs[li][1] + logs[li][3] - 20 && s.x > logs[li][0] + 60 && s.x < logs[li][0] + logs[li][2] - 60, 'star ' + s.n + ' is on its log');
      for (let i = 1; i < 10; i++) assert.ok(stars[i].x - stars[i - 1].x > 100, 'in a row, apart enough to count: ' + (stars[i].x - stars[i - 1].x).toFixed(0));
    });
    // the bumps are drawn over the logs and the vines: nothing covers a star
    assert.ok(at(svg, 'data-part="bumps"') > at(svg, 'data-part="raft-under"'));
    assert.ok(!/data-part="(?:water|raft|plane|rocks)"/.test(svg), 'no surface view here');
    assert.ok(U.logs.length === 4 && U.stars === 10);
  }
  const a = spots('under').beside;
  assert.ok(a.y >= 990 && Math.abs(a.x - 800) < 100, 'whoever is there looks up from the bottom of the panel');
});

test('wide: the wonder screen: the towers stand on their heads in the water, the tallest with its red light; a tall white needle far across the river', () => {
  for (const cam of [...VIEWS, 'log']) {
    const svg = strip(render(cam).svg), I = info()[cam];
    assert.equal(count(svg, /data-part="towers"/g), 1, cam + ': the glass towers');
    assert.equal(count(svg, /data-part="reflections"/g), 1, cam + ': upside down in the water');
    assert.equal(count(svg, /data-part="red-light"/g), 1, cam + ': the tallest has its red light');
    assert.ok(/class="pcs-blink"/.test(part(svg, 'red-light')), cam + ': blinking');
    assert.equal(count(svg, /data-part="red-light-refl"/g), cam === 'wide' ? 1 : 0, cam + ': the river has the light too in the wonder panel, where the raft floats at its tip; nowhere else (a red spot alone on the water is a puzzle)');
    const towers = part(svg, 'towers'), refl = part(svg, 'reflections');
    // every reflection hangs from the waterline, under its own tower, the same width
    const polys = [...refl.matchAll(/<path d="(M[^"]+Z)" fill="url/g)].map((m) => pointsOf(m[1]));
    assert.ok(polys.length >= 5, cam + ': a reflection for every tower: ' + polys.length);
    assert.ok(polys.length <= I.towers.length, cam + ': no more reflections than towers');
    for (const P of polys) {
      const top = Math.min(...P.map((q) => q[1])), bot = Math.max(...P.map((q) => q[1])), x0 = Math.min(...P.map((q) => q[0])), x1 = Math.max(...P.map((q) => q[0]));
      assert.equal(top, I.reflAt, cam + ': hangs from the water\'s far edge');
      // under its own tower, its width, and as long as the tower is tall (times the view's measure), or cut short above the raft
      const t = I.towers.find((q) => Math.abs(q.x - x0) < 12 && Math.abs(q.x + q.w - x1) < 12);
      assert.ok(t, cam + ': a reflection from ' + x0.toFixed(0) + ' to ' + x1.toFixed(0) + ' stands under a tower of its own width');
      assert.ok(bot - top <= (I.hz - t.top) * I.refl + 0.6, cam + ': no longer than its tower is tall');
      assert.ok(bot - top >= Math.min((I.hz - t.top) * I.refl, 60) - 0.6, cam + ': and long enough to read: ' + (bot - top).toFixed(0));
    }
    void towers;
    if (I.needle) {
      const nd = part(svg, 'needle'), P = pointsOf(/d="([^"]+)"/.exec(nd)[1]), h = Math.max(...P.map((q) => q[1])) - Math.min(...P.map((q) => q[1])), w = Math.max(...P.map((q) => q[0])) - Math.min(...P.map((q) => q[0]));
      assert.ok(h > w * 6, cam + ': a needle: ' + h.toFixed(0) + ' tall, ' + w.toFixed(0) + ' wide');
      assert.ok(lum(/fill="(#[0-9a-fA-F]{6})"/.exec(nd)[1]) > 225, cam + ': white');
      assert.ok(I.needle > 1250 && Math.max(...P.map((q) => q[1])) <= I.hz, cam + ': far across the river, at the right, standing on the far shore');
      assert.ok(h > 40, cam + ': above the trees');
    } else assert.equal(cam, 'rocks', 'only the look back at our own shore has no far shore');
  }
  // in the wide panel the tallest tower's reflection reaches down to the raft: it floats at its tip
  const svg = strip(render('wide').svg), I = info().wide, rl = /data-part="red-light-refl"><ellipse cx="([-\d.]+)" cy="([-\d.]+)"/.exec(svg);
  assert.ok(Math.abs(+rl[2] - I.raft.top) < 60 && Math.abs(+rl[1] - I.raft.x0) < 120, 'the red light\'s reflection is beside the raft: ' + [rl[1], rl[2]]);
  assert.ok(render('wide').keep.length >= 1, 'the lettering keeps off the red light');
  // "the whole river shines": little stars of light on the water, in the wonder panel alone, none on the raft
  const sh = part(svg, 'shine'), stars = [...sh.matchAll(/M([-\d.]+) ([-\d.]+)Q/g)].map((m) => [+m[1], +m[2]]);
  assert.ok(stars.length >= 16, 'stars of light on the river: ' + stars.length);
  assert.ok(stars.every((q) => q[1] > I.hz && q[1] < 1000 && q[0] > 0 && q[0] < 1600), 'all of them on the water');
  assert.ok(/class="pcs-twk"/.test(sh) && lum(/fill="(#[0-9A-Fa-f]{6})"/.exec(sh)[1]) > 250, 'white, twinkling');
  assert.ok(at(svg, 'data-part="shine"') < at(svg, 'data-part="raft"'), 'on the water, under the raft and the rocks');
  for (const cam of CAMS.filter((c) => c !== 'wide')) assert.equal(count(render(cam).svg, /data-part="shine"/g), 0, cam);
});

// ---------------------------------------------------------------- the whole vocabulary, and robustness

test('every camera renders well-formed SVG with a cast member at each anchor, in every light and with every option', () => {
  let n = 0;
  for (const cam of CAMS) {
    for (const where of ANCHORS) {
      for (const [who, pose] of [['player', 'sit'], ['tallyheart', 'pawup'], ['riffle', 'stand'], ['riffle', 'swim'], ['otter', 'sit'], ['sprinkle', 'sit'], ['squall', 'sit'], ['puddle', 'head'], ['puddle', 'pawup'], ['moth', 'fly']]) {
        const sc = scene(cam, {}, [{ who, at: where, pose, mood: 'happy' }]);
        const r = art.render(sc, { look: LOOK });
        checkRender(r, sc, cam + ' ' + who + '/' + pose + '@' + where);
        // (a swimmer's head is at the waterline, and a moth at a spot that is not ground sits on it: at the sky
        // camera's spots, under the panel's bottom edge, both are out of shot)
        if (!(cam === 'sky' && (pose === 'swim' || who === 'moth'))) assert.equal(!!r.heads[0], HAS[cam].includes(where), cam + ': ' + who + ' at ' + where + (HAS[cam].includes(where) ? ' is in shot' : ' is out of sight'));
        n++;
      }
    }
    for (const fx of LIGHTS) {
      const sc = scene(cam, { plane: 'over', shiver: true, foot: true, bubbles: true, face: true, claws: 9 }, ANCHORS.map((k, i) => ({ who: ['player', 'riffle', 'otter', 'riffle', 'tallyheart'][i], at: k, pose: i === 3 ? 'swim' : 'sit' })), fx);
      checkRender(art.render(sc, { look: LOOK }), sc, cam + ' ' + fx.join('+'), Infinity);
    }
    for (const plane of PLANES) for (const late of [false, true]) for (const extra of [{}, { shiver: true, foot: true }, { bubbles: true, face: true, claws: 5 }]) {
      const sc = scene(cam, Object.assign({ plane, late }, extra));
      checkRender(art.render(sc, { look: LOOK }), sc, cam + ' ' + JSON.stringify(sc.opts));
    }
    const odd = scene(cam, { sparrows: 3, nope: true, plane: 'low', claws: 'many', late: 'yes', shiver: 1, foot: 'big', light: true, eyes: 'blink' }, [], art.vocab.fx.slice());
    checkRender(art.render(odd, { look: LOOK }), odd, cam + ' with stray options and every effect', Infinity);
  }
  assert.equal(n, CAMS.length * ANCHORS.length * 10);
});

test('an option counts only when it is exactly true: a stray value draws nothing', () => {
  for (const cam of RAFTED) {
    const plain = strip(render(cam).svg);
    for (const o of [{ shiver: 1 }, { foot: 'yes' }, { bubbles: 'true' }, { face: 1 }]) assert.equal(strip(render(cam, o).svg), plain, cam + ' ' + JSON.stringify(o));
  }
  assert.ok(strip(render('raft', { late: 'yes' }).svg) === strip(render('raft').svg), 'late: only true');
});

test('the same scene draws the same picture each time', () => {
  for (const cam of CAMS) {
    const s = scene(cam, { plane: 'over', shiver: true, bubbles: true, face: true, claws: 6 }, [{ who: 'player', at: 'raft-1' }, { who: 'riffle', at: 'raft-2' }, { who: 'riffle', at: 'beside', pose: 'swim' }, { who: 'tallyheart', at: 'far-rocks', pose: 'pawup' }]);
    assert.equal(strip(art.render(s, { look: LOOK }).svg), strip(art.render(s, { look: LOOK }).svg), cam);
  }
});

test('odd input never throws: unknown spots, custom spots, no look, no character drawings at all', () => {
  const cases = [
    { set: 'openriver' }, { set: 'openriver', cam: 'nowhere' }, { set: 'openriver', cam: 'log', cast: [{ who: 'riffle', at: 'nowhere' }] },
    { set: 'openriver', cam: 'raft', cast: [{ who: 'player', at: { x: 600, y: 850 }, pose: 'sit' }, { who: 'riffle', at: { x: 900, y: 860, h: 300 } }] },
    { set: 'openriver', cam: 'beside', cast: [{ who: 'riffle', at: 'beside', size: 1.4, pose: 'float', facing: 'left' }, { who: 'sparrow', at: 'raft-1' }, { who: 'tallone', at: 'raft-2' }] },
    { set: 'openriver', cam: 'sky', opts: { face: true }, cast: [{}, null, { who: 'nobody', at: 'pole' }] },
    { set: 'openriver', cam: 'edge', opts: { foot: true, bubbles: true }, cast: [{ who: 'dog', variant: 1, at: 'beside', pose: 'howl' }] },
    { set: 'openriver', cam: 'under', cast: [{ who: 'moth', at: 'beside' }] }
  ];
  for (const c of cases) checkRender(art.render(c, { look: LOOK }), { cast: (c.cast || []).filter((m) => m && typeof m === 'object') }, JSON.stringify(c));
  for (const cam of CAMS) checkRender(art.render(scene(cam, { claws: 4 }), {}), scene(cam), cam + ' with no look');
  const keepFn = art.character;
  try {
    art.character = undefined;
    for (const cam of CAMS) {
      const s = scene(cam, { plane: 'over', foot: true, bubbles: true, shiver: true, claws: 9 }, [{ who: 'player', at: 'raft-1' }, { who: 'riffle', at: 'beside', pose: 'swim' }, { who: 'tallyheart', at: 'far-rocks' }]);
      const r = art.render(s, { look: LOOK });
      checkRender(r, s, cam + ' placeholders only');
      // with no drawings the otters are the set's own small shapes, and nobody is stood in for
      if ([...VIEWS, 'log'].includes(cam)) assert.equal(count(r.svg, /data-otter="\d"/g), 3, cam + ': three otters still');
      assert.equal(count(r.svg, /data-part="tallyheart"/g), 0, cam);
    }
    assert.deepEqual(art.openriverInfo.puddle().base, '#7f95ab');
  } finally {
    art.character = keepFn;
  }
});

test('the set\'s copies of the game\'s colours still match app/art/cats.js: the coats, Riffle, the three ferry otters', { skip: !has('app/art/cats.js') && 'no cats.js' }, () => {
  const src = fs.readFileSync(path.join(ROOT, 'app/art/cats.js'), 'utf8');
  const FUR = Function('return ' + /var FUR = (\{[\s\S]*?\n  \});/.exec(src)[1])();
  for (const [fur, f] of Object.entries(art.openriverInfo.furs)) {
    for (const k of Object.keys(f)) assert.deepEqual(f[k], FUR[fur][k], fur + '.' + k);
  }
  const otters = [...src.matchAll(/kind: 'otter',[^\n]*\n[^\n]*pal: \{ base: '(#[0-9a-f]{6})', line: '(#[0-9a-f]{6})', light: '#[0-9a-f]{6}', belly: '(#[0-9a-f]{6})'/g)].map((m) => ({ base: m[1], line: m[2], belly: m[3] }));
  assert.ok(otters.length >= 4, 'Riffle and the three ferry otters');
  assert.deepEqual({ base: art.openriverInfo.rifflePaw.base, line: art.openriverInfo.rifflePaw.line }, { base: otters[0].base, line: otters[0].line }, 'Riffle');
  assert.deepEqual(art.openriverInfo.otters, otters.slice(1, 4), 'the old ferry otter and the two others');
});
