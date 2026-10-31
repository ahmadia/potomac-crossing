// The otters' Moon Ferry (app/art/sets/ferry.js, chapter 10): node --test tests/set-ferry.test.js
// docs/chapters/10-the-gathering.spec.md, section 4, "The new set, ferry"
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['shore', 'deck', 'back', 'low', 'under', 'river'];
const COMP = { shore: 'shore', deck: 'main', back: 'back', low: 'low', under: 'under', river: 'river' };
// the spec's table, camera by camera
const ANCHORS = {
  shore: ['bank-1', 'bank-2', 'bank-3', 'edge', 'log-1', 'log-2', 'pole'],
  deck: ['seat-1', 'seat-2', 'seat-3', 'seat-4', 'seat-5', 'seat-6', 'front', 'beside', 'pole', 'back'],
  back: ['heap', 'back-1', 'back-2', 'back-3'],
  low: ['gap', 'lie', 'sit-1', 'sit-2', 'sit-3'],
  under: ['water', 'lip'],
  river: ['raft-1', 'raft-2', 'pole']
};
const OPTS = { moon: 'number', clan: [false, true], luggage: [false, true], puff: [false, true], low: [false, true], home: [false, true] };
// the options each camera's row in the spec's table names
const CAM_OPTS = { shore: ['moon', 'clan'], deck: ['moon', 'clan', 'luggage'], back: ['moon', 'luggage', 'puff'], low: ['moon', 'low'], under: ['moon'], river: ['moon', 'clan', 'luggage', 'home'] };
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
  for (const ref of r.svg.match(/href="#([^"]+)"/g) || []) assert.ok(idset.has(ref.slice(7, -1)), label + ': dangling ' + ref);
  assert.equal(r.heads.length, cast.length, label + ': one head per cast member');
  r.heads.forEach((h) => { if (h) assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ': head in the panel'); });
  (r.keep || []).forEach((k) => assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, label + ': keep inside the panel'));
}
const render = (cam, opts, cast, fx) => art.render({ set: 'ferry', cam, opts: opts || {}, cast: cast || [], fx: fx || ['night'] }, { look: LOOK });
const strip = (s) => s.replace(/\bpcs?[0-9a-z]+-/g, '');
const lum = (h) => { const v = parseInt(h.slice(1), 16); return 0.3 * (v >> 16) + 0.59 * ((v >> 8) & 255) + 0.11 * (v & 255); };
const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const spots = (cam) => art.sceneInfo('ferry').anchors[COMP[cam]];
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
// a stand-in for the kit's crowd helper (scenes.js, the nest owner's): records what the set hands it
function withCrowd(fn, ret) {
  const K = art.kit, had = Object.prototype.hasOwnProperty.call(K, 'crowd'), keep = K.crowd, calls = [];
  K.crowd = function (S, seats, k0) { calls.push({ seats: JSON.parse(JSON.stringify(seats)), k0, cam: S.cam, opts: S.opts }); return ret == null ? '<g data-crowd="stand-in"></g>' : ret; };
  try { fn(calls); } finally { if (had) K.crowd = keep; else delete K.crowd; }
  return calls;
}
function withoutCrowd(fn) {
  const K = art.kit, had = Object.prototype.hasOwnProperty.call(K, 'crowd'), keep = K.crowd;
  delete K.crowd;
  try { fn(); } finally { if (had) K.crowd = keep; }
}

// ---------------------------------------------------------------- the vocabulary

test('ferry: the spec names the set, its six cameras, their anchors and its options; the set has exactly them, every option off by default', () => {
  const md = fs.readFileSync(SPEC, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['#### The new set, `ferry` (`app/art/sets/ferry.js`)', "`PC.art.defineSet('ferry', { label: 'the otters’ Moon Ferry: a line of log rafts on the moonlit river', tod: 'night', … })`",
    "Declared: `opts: { moon: 'number', clan: [false, true], luggage: [false, true], puff: [false, true], low: [false, true], home: [false, true] }`", '**No otter is drawn by the set**'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  for (const cam of CAMS) assert.ok(md.includes('| `' + cam + '` |'), 'the spec\'s table has `' + cam + '`');
  const v = art.vocab.sets.ferry, info = art.sceneInfo('ferry');
  assert.ok(v, 'vocab.sets.ferry');
  assert.deepEqual(v.cams, CAMS, 'exactly the six cameras, in the spec\'s order');
  assert.deepEqual(v.opts, OPTS, 'the options exactly as declared');
  assert.deepEqual(info.defaults, {}, 'every option off by default');
  assert.equal(info.label, 'the otters’ Moon Ferry: a line of log rafts on the moonlit river');
  for (const cam of CAMS) {
    assert.equal(info.cams[cam].comp, COMP[cam], cam + ': a composition of its own');
    assert.deepEqual([info.cams[cam].x, info.cams[cam].y, info.cams[cam].w], [0, 0, 1600], cam + ' looks at all of it');
    assert.deepEqual(Object.keys(info.anchors[COMP[cam]]), ANCHORS[cam], cam + ': exactly the spec\'s anchors');
  }
  assert.deepEqual(Object.keys(info.anchors).sort(), Object.values(COMP).sort(), 'no composition beyond the six');
  // each camera's row names its options, and those are declared
  for (const [cam, list] of Object.entries(CAM_OPTS)) for (const k of list) assert.ok(Object.prototype.hasOwnProperty.call(v.opts, k), cam + ': ' + k);
});

test('ferry: `gap` and `water` are in the water (`air`: no ground shadow); `lip` is elevated (`elev`, as grove\'s); every other spot stands on the logs or the stones; facings as the spec has them', () => {
  const A = (c) => art.sceneInfo('ferry').anchors[c];
  assert.ok(A('low').gap.air === true && !A('low').gap.elev, 'gap: { air: true }');
  assert.ok(A('under').water.air === true && !A('under').water.elev, 'water: { air: true }');
  assert.ok(A('under').lip.elev === true && !A('under').lip.air, 'lip: { elev: true }');
  for (const c of Object.keys(art.sceneInfo('ferry').anchors)) for (const [k, a] of Object.entries(A(c))) {
    if (!(c === 'low' && k === 'gap') && !(c === 'under' && (k === 'water' || k === 'lip'))) assert.ok(!a.elev && !a.air, c + ' ' + k + ': on the logs or the stones');
    assert.ok(a.h > 0, c + ' ' + k + ': a height');
    assert.ok(a.z == null, c + ' ' + k + ': no z (no depth rule in the art)');
  }
  for (const k of ['bank-1', 'bank-2', 'bank-3', 'edge']) assert.equal(A('shore')[k].face, 'right', k + ': walking down to the rafts');
  assert.equal(A('main').front.face, 'right', 'front: facing right');
  for (const k of ['back-1', 'back-2', 'back-3']) assert.equal(A('back')[k].face, 'right', k + ': at the left, facing right');
  assert.equal(A('back').heap.face, 'left', 'heap: beside the heap, facing the others');
  // three a side on the deck, the near ones bigger
  const D = A('main');
  assert.ok(D['seat-1'].h > D['seat-2'].h && D['seat-2'].h > D['seat-3'].h, 'the left side, near to far');
  assert.ok(D['seat-6'].h > D['seat-5'].h && D['seat-5'].h > D['seat-4'].h, 'the right side, far to near');
  for (const k of ['seat-1', 'seat-2', 'seat-3']) assert.ok(D[k].x < 800, k + ' on the left');
  for (const k of ['seat-4', 'seat-5', 'seat-6']) assert.ok(D[k].x > 800, k + ' on the right');
  assert.ok(D.front.x < 800 && Math.abs(D.beside.x - D.front.x) < 300, 'front at the left, beside her');
  assert.ok(D.pole.y < Math.min(...Object.values(D).filter((a) => a !== D.pole).map((a) => a.y)), 'the poler at the front end, farthest');
  assert.ok(D.back.x > 1000 && D.back.y > 900, 'back: at the near right corner');
  // the low raft: three spots to sit on, beside the gap
  const L = A('low');
  assert.ok(L['sit-1'].x < L.gap.x && L['sit-2'].x > L.gap.x, 'sit-1 and sit-2 either side of the gap');
  assert.ok(L.lie.x < L.gap.x, 'lie at the gap\'s left edge');
  // anchors' heights grow toward us on every ground composition (one depth scale per camera)
  for (const c of ['shore', 'main', 'back', 'low']) {
    const g = Object.values(A(c)).filter((a) => !a.elev).sort((p, q) => p.y - q.y);
    for (let i = 1; i < g.length; i++) assert.ok(g[i].h >= g[i - 1].h - 24, c + ': nearer is not smaller: ' + JSON.stringify([g[i - 1], g[i]]));
  }
});

// ---------------------------------------------------------------- every camera, every spot, every option, both lights

test('ferry: every anchor is inside its camera, and every camera renders well-formed with a cast member at each anchor, each head in the panel, at dusk and at night', { skip: !hasCats && 'no cats.js' }, () => {
  for (const cam of CAMS) {
    const A = spots(cam);
    for (const [k, a] of Object.entries(A)) assert.ok(a.x > 40 && a.x < 1560 && a.y > 0 && a.y <= 1000, cam + ' ' + k + ' inside: ' + [a.x, a.y]);
    const who = ['player', 'tallyheart', 'riffle', 'clancat', 'glintstar', 'grizzled', 'otter', 'murmurchime', 'snorer', 'thymeleaf'];
    const cast = Object.keys(A).map((at, i) => ({ who: at === 'gap' || at === 'water' ? 'puddle' : who[i % who.length], at, pose: at === 'gap' ? 'foot' : at === 'water' ? 'head' : at === 'lie' ? 'flat' : at === 'lip' ? 'crouch' : at === 'pole' ? 'stand' : 'sit', variant: at === 'pole' ? 3 : 2, holds: at === 'pole' ? 'pole' : undefined }));
    for (const fx of [['night'], ['dusk'], []]) {
      const r = render(cam, { moon: 14 }, cast, fx);
      checkRender(r, cast, cam + ' ' + fx);
      r.heads.forEach((h, i) => assert.ok(h && h.x > 1 && h.x < 99 && h.y > 1 && h.y < 99, cam + ': a head at ' + cast[i].at + ' in the panel: ' + JSON.stringify(h)));
    }
    for (const at of Object.keys(A)) for (const w of ['player', 'tallyheart', 'riffle']) {
      const c = [{ who: w, at, pose: 'sit' }];
      const r = render(cam, {}, c);
      checkRender(r, c, cam + ' ' + w + '@' + at);
      assert.ok(r.heads[0], cam + ': ' + w + ' at ' + at + ' is in shot');
    }
  }
});

test('ferry: every option value renders on every camera, alone and all together, at dusk and at night (and off draws exactly as left out)', () => {
  const values = { moon: [14, 13, 8], clan: [false, true], luggage: [false, true], puff: [false, true], low: [false, true], home: [false, true] };
  for (const cam of CAMS) for (const fx of [['dusk'], ['night']]) {
    const plain = strip(render(cam, {}, [], fx).svg);
    for (const [k, vals] of Object.entries(values)) for (const v of vals) {
      const r = render(cam, { [k]: v }, [], fx);
      checkRender(r, [], cam + ' ' + k + '=' + v + ' ' + fx);
      if (v === false) assert.equal(strip(r.svg), plain, cam + ' ' + k + ': false draws as left out');
    }
    const all = render(cam, { moon: 14, clan: true, luggage: true, puff: true, low: true, home: true }, [{ who: 'player', at: Object.keys(spots(cam))[0] }], fx);
    checkRender(all, [1], cam + ' everything ' + fx);
  }
});

test('ferry: two lights only: dusk (the boarding) and night; sunset draws dusk, the day\'s hours night; the same scene draws the same picture', () => {
  for (const cam of CAMS) {
    const dusk = strip(render(cam, { moon: 14 }, [], ['dusk']).svg), night = strip(render(cam, { moon: 14 }, [], ['night']).svg);
    if (cam !== 'under') assert.notEqual(dusk, night, cam + ': dusk is its own light');
    assert.equal(strip(render(cam, { moon: 14 }, [], ['sunset']).svg), dusk, cam + ' sunset: dusk');
    for (const fx of [['day'], ['morning'], []]) assert.equal(strip(render(cam, { moon: 14 }, [], fx).svg), night, cam + ' ' + fx + ': night');
    assert.equal(strip(render(cam, { moon: 14, clan: true, luggage: true }).svg), strip(render(cam, { moon: 14, clan: true, luggage: true }).svg), cam + ': the same each time');
  }
  assert.ok(/#F1B5A2|#CF90AE/.test(render('shore', { moon: 14 }, [], ['dusk']).svg), 'rose and lilac at dusk');
});

// ---------------------------------------------------------------- never dark

test('ferry: the river is silver-blue under the moon, bright and clear, NEVER dark or black: every colour of its water is light, in both lights, on every camera that shows it', () => {
  const I = art.ferryInfo();
  for (const light of ['night', 'dusk']) for (const c of I.colours[light].water) assert.ok(lum(c) >= 140, light + ' water ' + c + ': ' + lum(c).toFixed(0));
  for (const c of I.colours.night.water) { const q = rgb(c); assert.ok(q[2] > q[0] && q[2] >= q[1], 'night water silver-blue: ' + c); }
  for (const cam of CAMS) for (const fx of [['night'], ['dusk']]) {
    const svg = render(cam, { moon: 14, low: true }, [], fx).svg;
    const river = cam === 'under' ? svg.slice(svg.indexOf('</defs>'), svg.indexOf('data-art="log"')) : group(svg, 'data-art="river"');
    assert.ok(river, cam + ': the river is drawn');
    const ps = groupPaints(svg, river).filter((p) => p.op >= 0.5);
    assert.ok(ps.length >= 3, cam + ': painted');
    for (const p of ps) assert.ok(lum(p.c) >= 140, cam + ' ' + fx + ': the water\'s colour ' + p.c + ' is light (' + lum(p.c).toFixed(0) + ')');
    // and nothing anywhere near black
    const body = svg.slice(svg.indexOf('</defs>'));
    assert.ok(!/#000000|#111111|"black"/i.test(body), cam + ': no black');
    const darkest = paints(svg).filter((p) => p.op >= 0.3).reduce((m, p) => Math.min(m, lum(p.c)), 255);
    assert.ok(darkest >= 40, cam + ' ' + fx + ': the darkest colour is ' + darkest.toFixed(0));
  }
  // the gap in the low raft: silver water, light, with or without `low`
  for (const low of [false, true]) {
    const svg = render('low', { moon: 14, low }).svg, gap = group(svg, 'data-art="gap"');
    const water = groupPaints(svg, gap).filter((p) => p.op >= 0.5 && !['#766A6C', '#82685C'].includes(p.c));
    assert.ok(water.length >= 2 && water.every((p) => lum(p.c) >= 140), 'the gap\'s water light (low ' + low + '): ' + water.map((p) => p.c).join(' '));
  }
});

test('ferry: nothing dark in the water under a cat (chapter 5\'s rule): no ground shadow at `gap` or `water` for anyone there, Puddle in every pose (`eyes` among them)', { skip: !hasCats && 'no cats.js' }, () => {
  const shade = art.kit.PAL.night.shade;
  for (const [cam, at] of [['low', 'gap'], ['under', 'water']]) for (const who of ['puddle', 'player', 'riffle']) for (const pose of ['eyes', 'foot', 'head', 'log', 'pawup', 'sit']) {
    const a = spots(cam)[at], svg = render(cam, { moon: 14, low: true }, [{ who, at, pose }]).svg;
    const under = [...svg.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([\d.]+)" ry="([\d.]+)" fill="(#[0-9A-Fa-f]{6})"[^>]*>/g)]
      .filter((m) => m[5].toUpperCase() === shade.toUpperCase() && Math.abs(+m[2] - a.y) < 12 && Math.abs(+m[1] - a.x) < a.h);
    assert.equal(under.length, 0, cam + ' ' + who + ' ' + pose + ' at ' + at + ': no shade ellipse in the water');
    // the set's own rings over whoever is in the water: silver, light
    const ring = group(svg, 'data-part="cover-' + at + '"');
    assert.ok(ring, cam + ': rings over ' + who + ' at ' + at);
    for (const p of paints(ring)) assert.ok(lum(p.c) >= 180, cam + ': the rings are silver: ' + p.c);
  }
});

// ---------------------------------------------------------------- the set draws no otter and no named cat

test('ferry: the set draws no otter and no cat of its own (every otter is cast); the Clan\'s crowd is the kit\'s, and only with `clan: true`', () => {
  const keep = art.character;
  let calls = 0;
  try {
    // (scenes.js measures its reference, a sitting Clan cat, once for a new drawing function: not the set's)
    art.character = function (who, o) { if (!(who === 'clancat' && o && o.pose === 'sit' && o.variant === 1 && o.mood === 'neutral' && !o.look)) calls++; return keep.apply(this, arguments); };
    withoutCrowd(() => {
      for (const cam of CAMS) {
        const svg = render(cam, { moon: 14, clan: true, luggage: true, puff: true, low: true }).svg;
        assert.ok(!/data-crowd/.test(svg), cam + ': no crowd until the kit can draw it (K.crowd called guarded)');
      }
    });
    for (const cam of CAMS) render(cam, { moon: 14, luggage: true, puff: true, low: true, home: true });
  } finally { art.character = keep; }
  assert.equal(calls, 0, 'the set never draws a character itself');
});

test('ferry `clan`: the rest of CrystalClan seated along the logs of the front raft and the rafts behind, through K.crowd: seats [x, y, facing, pose, size] with no who and no variant (the camp\'s CROWD_COATS), on the rafts\' logs, never in open water', () => {
  const I = art.ferryInfo();
  const decks = { shore: [], river: [] };
  // the rafts' decks, from the geometry: [p0, p1, p1 + (dx, -dy), p0 + (dx, -dy)]
  const deckOf = (q) => [q.p0, q.p1, [q.p1[0] + q.dx, q.p1[1] - q.dy], [q.p0[0] + q.dx, q.p0[1] - q.dy]];
  decks.shore = [deckOf(I.shore.front)].concat(I.shore.behind.map(deckOf));
  decks.river = [deckOf(I.river.front)].concat(I.river.behind.map(deckOf));
  const near = (P, x, y) => I.inPoly(P, x, y) || I.inPoly(P, x, y + 30) || I.inPoly(P, x, y - 30);
  const calls = withCrowd((c) => {
    for (const cam of ['shore', 'deck', 'river']) {
      const off = render(cam, { moon: 14 });
      assert.ok(!/data-crowd="stand-in"/.test(off.svg), cam + ': no crowd without `clan`');
      const on = render(cam, { moon: 14, clan: true }, [{ who: 'player', at: Object.keys(spots(cam))[0] }]);
      assert.ok(/data-crowd="stand-in"/.test(on.svg), cam + ': the kit\'s crowd in the picture');
    }
    for (const cam of ['back', 'low', 'under']) render(cam, { moon: 14, clan: true });
  });
  assert.deepEqual(calls.map((c) => c.cam), ['shore', 'deck', 'river'], 'called once on each camera that has `clan`, only with it');
  for (const c of calls) {
    assert.ok(c.seats.length >= 5, c.cam + ': a Clan of them');
    for (const st of c.seats) {
      assert.equal(st.length, 5, c.cam + ': no who and no variant: CrystalClan in the camp\'s coats: ' + JSON.stringify(st));
      assert.ok(['left', 'right'].includes(st[2]) && st[3] === 'sit' && st[4] > 0.3 && st[4] <= 1, c.cam + ': seated, side-on, small: ' + JSON.stringify(st));
      assert.ok(st[0] > -40 && st[0] < 1640 && st[1] > 300 && st[1] < 1000, c.cam + ': in the picture');
      if (c.cam === 'deck') assert.ok(st[0] > I.deckEdgeAt(-1, st[1]) && st[0] < I.deckEdgeAt(1, st[1]), 'deck: on the logs: ' + JSON.stringify(st));
      else assert.ok(decks[c.cam].some((P) => near(P, st[0], st[1])), c.cam + ': on a raft\'s logs: ' + JSON.stringify(st));
    }
  }
  // home turns the raft round: its seats face the other way
  const home = withCrowd(() => render('river', { moon: 14, clan: true, home: true }))[0];
  assert.ok(home && home.seats.length >= 5, 'home: seated too');
});

test('ferry `clan` with the kit\'s own crowd helper (once scenes.js has it): small seated Clan cats, none on a face of the cast', { skip: (!hasCats || typeof art.kit.crowd !== 'function') && 'no K.crowd yet' }, () => {
  const meets = (p, q) => p[0] < q[2] && p[2] > q[0] && p[1] < q[3] && p[3] > q[1];
  for (const cam of ['shore', 'deck', 'river']) {
    const cast = Object.keys(spots(cam)).map((at, i) => ({ who: ['player', 'tallyheart', 'riffle'][i % 3], at, pose: 'sit' }));
    const r = render(cam, { moon: 14, clan: true }, cast);
    checkRender(r, cast, cam + ' clan');
    const boxes = [...r.svg.matchAll(/data-crowd="cat" data-box="([^"]+)"/g)].map((m) => m[1].split(' ').map(Number));
    assert.ok(boxes.length >= 1, cam + ': some of the Clan in the picture');
    for (const h of r.heads) if (h) {
      const f = [h.x * 16 - (h.r || 3) * 12, h.y * 10 - (h.r || 3) * 12, h.x * 16 + (h.r || 3) * 12, h.y * 10 + (h.r || 3) * 12];
      for (const b of boxes) assert.ok(!meets(b, f), cam + ': a crowd cat on a face: ' + b + ' / ' + f.map(Math.round));
    }
  }
});

// ---------------------------------------------------------------- the luggage, the puff, the low raft

test('ferry `luggage` and `puff`: the heap of reeds at the back of the front raft (deck, back, river), round and lumpy, green-gold, nothing of Sprinkle showing; on `back` it takes the right half, a cat\'s height and more; the puff of mist only with the heap', () => {
  for (const cam of ['deck', 'back', 'river']) {
    assert.ok(!/data-art="luggage"/.test(render(cam, { moon: 14 }).svg), cam + ': no heap by default');
    const svg = render(cam, { moon: 14, luggage: true }).svg, heap = group(svg, 'data-art="luggage"');
    assert.ok(heap, cam + ': the heap');
    const cols = groupPaints(svg, heap).filter((p) => p.op >= 0.6).map((p) => rgb(p.c));
    assert.ok(cols.some((q) => q[1] >= q[0] && q[1] > q[2] + 20), cam + ': green reeds');
    assert.ok(cols.some((q) => q[0] > 190 && q[1] > 170 && q[2] < 150), cam + ': gold ones');
    assert.ok(!/data-crowd|translate\(/.test(heap), cam + ': nothing of anyone in it');
  }
  const svg = render('back', { moon: 14, luggage: true }).svg, b = boxOf(svg, 'data-art="luggage"'), A = spots('back');
  assert.ok(b[0] >= 800 && b[2] >= 1500, 'back: the heap takes the right half: ' + b);
  assert.ok(b[3] - b[1] > A.heap.h * 1.2, 'a cat\'s height and more');
  assert.ok(A.heap.x < b[0] && b[0] - A.heap.x < A.heap.h, 'heap: Riffle beside it');
  for (const k of ['back-1', 'back-2', 'back-3']) assert.ok(A[k].x < b[0] - A[k].h * 0.4, k + ': at the left, clear of the heap');
  assert.ok(!/data-art="puff"/.test(render('back', { moon: 14, puff: true }).svg), 'no puff without the heap');
  const puff = render('back', { moon: 14, luggage: true, puff: true }).svg, pb = boxOf(puff, 'data-art="puff"');
  assert.ok(pb, 'a little cloud of mist');
  assert.ok(pb[0] < b[2] && pb[2] > b[0] && pb[3] >= b[1] - 10 && pb[1] < b[1], 'puffing out of the heap\'s top: ' + pb + ' / ' + b);
  for (const p of groupPaints(puff, group(puff, 'data-art="puff"'))) assert.ok(lum(p.c) > 200, 'soft, light mist: ' + p.c);
});

test('ferry `low`: the front raft riding low, the water at the logs\' tops and never over them; the gap a wedge of silver water between the two middle logs; `gap` in it, `lie` at its left edge with her chin over it, the three sitting spots on the logs beside it', { skip: !hasCats && 'no cats.js' }, () => {
  const I = art.ferryInfo(), G = I.gap, A = spots('low');
  assert.notEqual(strip(render('low', { moon: 14, low: true }).svg), strip(render('low', { moon: 14 }).svg), 'low changes the picture');
  assert.ok(I.inPoly(G, A.gap.x, A.gap.y - 4), 'gap: in the water between the logs');
  for (const k of ['lie', 'sit-1', 'sit-2', 'sit-3']) assert.ok(!I.inPoly(G, A[k].x, A[k].y - 4), k + ': on the logs');
  // lying flat, chin over the gap: her head reaches past its left edge
  for (const pose of ['flat', 'lie']) {
    const r = render('low', { moon: 14, low: true }, [{ who: 'player', at: 'lie', pose, facing: 'right' }]), h = r.heads[0];
    const hx = h.x * 16 + h.r * 16, hy = h.y * 10;
    let left = Infinity;
    for (const q of G) if (Math.abs(q[1] - hy) < 40) left = Math.min(left, q[0]);
    assert.ok(hx > left, pose + ': her chin over the gap: ' + hx.toFixed(0) + ' / ' + left);
  }
  // the gap's box opens toward us and stays between the two middle logs
  const b = boxOf(render('low', { moon: 14 }).svg, 'data-art="gap"');
  assert.ok(b && b[3] >= 990 && b[2] - b[0] < 320 && Math.abs((b[0] + b[2]) / 2 - 800) < 60, 'a wedge in the middle: ' + b);
});

test('ferry `under`: straight down into the gap: the logs\' wet tops at the left and right edges, silver water between; `water` in the middle; `lip` on the left log at the top edge, her head over the water; the moon\'s reflection with `moon`', { skip: !hasCats && 'no cats.js' }, () => {
  const svg = render('under').svg, A = spots('under');
  assert.equal((svg.match(/data-art="log"/g) || []).length, 2, 'two logs, at the edges');
  assert.ok(!/data-art="moon"/.test(svg), 'no moon without `moon`');
  const m = render('under', { moon: 14 }).svg;
  assert.ok(/data-art="moon" data-age="14"/.test(m), 'the moon\'s reflection, round');
  assert.ok(A.water.x > 600 && A.water.x < 1000, 'water: the middle');
  assert.ok(A.lip.y <= 340 && A.lip.x < 400, 'lip: at the top edge, on the left log');
  for (const pose of ['crouch', 'flat', 'sit', 'peer']) {
    const r = render('under', { moon: 14 }, [{ who: 'player', at: 'lip', pose, mood: 'wonder' }]);
    assert.ok(r.heads[0] && r.heads[0].y < 40, pose + ': her face up at the top edge: ' + JSON.stringify(r.heads[0]));
  }
});

test('ferry `river` and `home`: the ferry gliding upriver with the line of rafts behind it; `home` turns the raft round at the Crossing\'s stones, its spots with it', { skip: !hasCats && 'no cats.js' }, () => {
  const I = art.ferryInfo(), A = spots('river');
  const deck = (q) => [q.p0, q.p1, [q.p1[0] + q.dx, q.p1[1] - q.dy], [q.p0[0] + q.dx, q.p0[1] - q.dy]];
  const F = deck(I.river.front);
  for (const k of ['raft-1', 'raft-2', 'pole']) assert.ok(I.inPoly(F, A[k].x, A[k].y), k + ': on the front raft');
  assert.ok(A.pole.x > A['raft-2'].x && A['raft-2'].x > A['raft-1'].x, 'the poler at the front, upriver (right)');
  assert.equal((render('river', { moon: 14 }).svg.match(/data-art="raft-behind"/g) || []).length, 2, 'a line of rafts behind');
  assert.ok(!/data-art="stones"/.test(render('river', { moon: 14 }).svg), 'no stones mid-river');
  const cast = [{ who: 'riffle', at: 'raft-1', pose: 'stand' }, { who: 'player', at: 'raft-2' }, { who: 'otter', variant: 3, at: 'pole', pose: 'stand', holds: 'pole' }];
  const out = render('river', { moon: 14 }, cast), home = render('river', { moon: 14, home: true }, cast);
  checkRender(home, cast, 'home');
  assert.ok(/data-art="stones"/.test(home.svg) && /data-art="bump"/.test(home.svg), 'home: the Crossing\'s stones, the bump');
  // turned round: each spot at the mirror of its place, facing the other way; the poler at the front, now the left
  for (let i = 0; i < 3; i++) assert.ok(Math.abs((out.heads[i].x + home.heads[i].x) - 100) < 4, cast[i].at + ': mirrored: ' + out.heads[i].x + ' / ' + home.heads[i].x);
  assert.ok(home.heads[2].x < home.heads[1].x, 'home: the poler at the front end, by the stones');
  assert.ok(/data-art="moon"/.test(home.svg), 'the moon high');
});

test('ferry `shore`: the Crossing\'s stones at the left; the bank spots on them, `edge` at their edge by the front raft; `log-1`, `log-2` and `pole` on the front raft; the rafts behind going off upriver; the moon rising at dusk', () => {
  const I = art.ferryInfo(), A = spots('shore');
  const deck = (q) => [q.p0, q.p1, [q.p1[0] + q.dx, q.p1[1] - q.dy], [q.p0[0] + q.dx, q.p0[1] - q.dy]];
  for (const k of ['bank-1', 'bank-2', 'bank-3', 'edge']) assert.ok(I.inPoly(I.shore.stones, A[k].x, A[k].y - 4), k + ': on the stones');
  assert.ok(A.edge.x > Math.max(A['bank-1'].x, A['bank-2'].x, A['bank-3'].x), 'edge: nearest the raft');
  assert.ok(Math.abs(A.edge.x - I.shore.front.p0[0]) < 140, 'edge: by the front raft\'s near end');
  for (const k of ['log-1', 'log-2', 'pole']) assert.ok(I.inPoly(deck(I.shore.front), A[k].x, A[k].y), k + ': on the front raft');
  assert.ok(A.pole.x > A['log-2'].x && A['log-2'].x > A['log-1'].x, 'the poler at its far end');
  // the rafts behind: off upriver, each smaller and further
  const R = [I.shore.front].concat(I.shore.behind);
  for (let i = 1; i < R.length; i++) assert.ok(R[i].p0[0] > R[i - 1].p1[0] && R[i].dy < R[i - 1].dy && R[i].p0[1] < R[i - 1].p0[1], 'raft ' + i + ': further off upriver');
  const svg = render('shore', { moon: 14 }, [], ['dusk']).svg, moon = /data-art="moon" data-age="14" data-at="([-\d.]+) ([-\d.]+) ([-\d.]+)"/.exec(svg);
  assert.ok(moon && +moon[2] > 200 && +moon[2] < I.shore.horizon, 'the full moon just up over the water');
});

test('ferry `moon`: the moon n evenings old (14 round) in the sky of every camera but `under` (there, its reflection), kept clear of the lettering; none without it', () => {
  for (const cam of CAMS) for (const age of [14, 13]) {
    const r = render(cam, { moon: age }), m = new RegExp('data-art="moon" data-age="' + age + '" data-at="([-\\d.]+) ([-\\d.]+) ([-\\d.]+)"').exec(r.svg);
    assert.ok(m, cam + ': the moon at ' + age);
    const x = +m[1] / 16, y = +m[2] / 10;
    assert.ok(r.keep.some((k) => k.x <= x && k.x + k.w >= x && k.y <= y && k.y + k.h >= y), cam + ': the moon is kept');
    assert.ok(!/data-art="moon"/.test(render(cam, {}).svg), cam + ': no moon without `moon`');
  }
  assert.ok(/data-art="moon-path"/.test(render('deck', { moon: 14 }).svg), 'its path of light on the water');
});

test('ferry: odd input never throws: unknown cameras and spots, custom spots, odd option values, no character drawings', () => {
  const cases = [{ set: 'ferry' }, { set: 'ferry', cam: 'nowhere' }, { set: 'ferry', cam: 'low', cast: [{ who: 'player', at: 'nowhere' }] },
    { set: 'ferry', cam: 'deck', cast: [{ who: 'player', at: { x: 700, y: 900 } }, null, {}] }, { set: 'ferry', cam: 'river', opts: { nope: true, moon: 'full', home: 'yes' }, fx: art.vocab.fx.slice() },
    { set: 'ferry', cam: 'back', opts: { moon: -3, luggage: 1, puff: true } }];
  for (const c of cases) checkRender(art.render(c, { look: LOOK }), (c.cast || []).filter((m) => m && typeof m === 'object'), JSON.stringify(c));
  const keep = art.character;
  try {
    art.character = undefined;
    for (const cam of CAMS) {
      const cast = Object.keys(spots(cam)).map((at) => ({ who: 'player', at }));
      checkRender(render(cam, { moon: 14, luggage: true, low: true }, cast), cast, cam + ' without cats.js');
    }
  } finally { art.character = keep; }
});

test('ferry: every animation class it uses is defined in PC.art.css', () => {
  const used = new Set();
  for (const cam of CAMS) {
    const svg = render(cam, { moon: 14, luggage: true, puff: true, low: true }).svg;
    for (const m of svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => used.add(c));
  }
  for (const c of used) if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') assert.ok(art.css.includes('.' + c + '{'), 'css defines .' + c);
});

// ---------------------------------------------------------------- the gallery (dev/gallery.html)

test('the gallery: SAMPLES.ferry has every camera, each with a cast at its spots and its options; between them the samples show every anchor and option', () => {
  const page = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  const js = page.slice(page.lastIndexOf('<script>') + 8, page.lastIndexOf('</script>'));
  const from = js.indexOf('// ---- a sample cast'), to = js.indexOf('// ---- panels');
  const { SAMPLES, EXTRA } = new Function(js.slice(from, to) + '\nreturn { SAMPLES: SAMPLES, EXTRA: EXTRA };')();
  assert.deepEqual(Object.keys(SAMPLES.ferry || {}), CAMS, 'a sample for every camera, in order');
  const seen = new Set(), opts = new Set();
  const look = (set, cam, s) => { if (set !== 'ferry') return; for (const m of s.cast || []) seen.add(cam + ':' + m.at); for (const [k, v] of Object.entries(s.opts || {})) opts.add(k + ':' + JSON.stringify(v)); };
  for (const cam of CAMS) {
    const s = SAMPLES.ferry[cam];
    assert.ok(s.cast.length >= 1, cam + ': a cast');
    for (const m of s.cast) assert.ok(ANCHORS[cam].includes(m.at), cam + ': ' + m.at + ' is its spot');
    look('ferry', cam, s);
  }
  for (const e of EXTRA) look(e[0], e[1], e[2]);
  for (const cam of CAMS) for (const at of ANCHORS[cam]) assert.ok(seen.has(cam + ':' + at), 'someone at ' + cam + ' ' + at);
  for (const want of ['moon:14', 'clan:true', 'luggage:true', 'puff:true', 'low:true', 'home:true']) assert.ok(opts.has(want), 'the gallery shows ' + want);
  assert.ok(Object.values(SAMPLES.ferry).some((s) => s.fx.includes('dusk')) && Object.values(SAMPLES.ferry).some((s) => s.fx.includes('night')), 'both lights');
});

// ---------------------------------------------------------------- chapter 10's review

// The Moon Ferry's front raft is the otters' ferry raft, chapter 5's "four logs and a long pole" (continuity), and Puddle's
// riddle is told on it ("Four logs in this raft."): four logs on every camera that draws it, the gap between the two middle
// ones; the rafts behind as they were.
test('ferry: the front raft has four logs on every camera (chapter 5’s ferry raft, Puddle’s riddle), the gap between the two middle ones; Gathering Island’s shore draws the same raft', () => {
  const I = art.ferryInfo();
  assert.deepEqual([I.shore.front.logs, I.deck.logs, I.low.logs, I.river.front.logs], [4, 4, 4, 4]);
  assert.equal(I.low.gapLog, 2, 'the gap between the second and third logs');
  assert.deepEqual(I.shore.behind.map((q) => q.logs).concat(I.river.behind.map((q) => q.logs)), [5, 4, 4, 4], 'the rafts behind as they were');
  if (art.islandInfo) assert.equal(art.islandInfo().shore.raft.logs, 4, 'the Moon Ferry at the island’s shore');
  // the deck seen from aboard: one round cut end a log at the front
  const deck = render('deck', { moon: 14 }).svg, at = deck.indexOf('data-art="deck"'), grp = deck.slice(deck.lastIndexOf('<g', at), deck.indexOf('data-art="lashing"', at));
  assert.equal((grp.match(new RegExp('fill="' + I.colours.night.logEnd + '"', 'gi')) || []).length, 4, 'four log ends');
});

// `lip`: her head and forepaws over the silver water at the left log's edge, the rest of her under the log drawn again (the
// cover), as grove's rim; it never cuts across her head.
test('ferry `lip`: her head and forepaws past the left log’s edge over the water; the log drawn again over the rest of her, cut behind her head (`data-cut`); no cover with nobody there', { skip: !hasCats && 'no cats.js' }, () => {
  const U = art.ferryInfo().under, edge = Math.max(...U.left.filter((q) => q[1] >= 100 && q[1] <= 360).map((q) => q[0]));
  assert.ok(!/data-part="cover-lip"/.test(render('under', { moon: 14 }).svg), 'no cover with nobody at lip');
  for (const pose of ['crouch', 'flat']) {
    const r = render('under', { moon: 14 }, [{ who: 'player', at: 'lip', pose, mood: 'wonder', facing: 'right' }]);
    const m = /data-part="cover-lip" data-box="([^"]+)" data-cut="([^"]+)"/.exec(r.svg);
    assert.ok(m, pose + ': the cover');
    const cut = +m[2], h = r.heads[0], hx = h.x * 16, hr = h.r * 16;
    assert.ok(hx > edge, pose + ': her head past the log’s edge, over the water: ' + hx.toFixed(0) + ' / ' + edge);
    assert.ok(cut < hx - hr * 0.5, pose + ': the cut behind her head: ' + cut + ' / ' + hx.toFixed(0));
    assert.ok(r.svg.indexOf('data-part="cover-lip"') > r.svg.indexOf('<g transform="translate(' + spots('under').lip.x + ' '), pose + ': drawn over her');
  }
});
