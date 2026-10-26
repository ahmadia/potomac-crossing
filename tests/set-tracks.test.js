// The railway bank by the tracks (app/art/sets/tracks.js, chapter 8): node --test tests/set-tracks.test.js
// The spec: docs/chapters/08-the-night-trail.spec.md, section 4 ("The new set, tracks") and section 5.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const SHE = { fur: 'silver-tabby', marking: 'white-chest', eyes: 'green', sex: 'she' };
const LABEL = 'the railway bank by the tracks, its weasel holes, and the weasels’ tunnel';
const CAMS = ['wide', 'hide', 'holes', 'brag', 'stash', 'stash-close', 'crawl', 'fork'];
const COMP = { wide: 'main', hide: 'hide', holes: 'holes', brag: 'brag', stash: 'stash', 'stash-close': 'stash-close', crawl: 'crawl', fork: 'fork' };
// what each camera sees, exactly
const SPOTS = {
  wide: ['tunnel-end', 'foot-1', 'foot-2', 'hole-1', 'hole-2', 'rails'],
  hide: ['weeds-1', 'weeds-2', 'hole-1', 'hole-2', 'rails'],
  holes: ['hole-1', 'hole-2', 'stash-mouth', 'watch'],
  brag: ['rails', 'slope-1', 'slope-2'],
  stash: ['stash-in'],
  'stash-close': ['near'],
  crawl: ['crawl-1', 'crawl-2'],
  fork: ['fork-1', 'fork-2']
};
const ANCHORS = [...new Set(CAMS.flatMap((c) => SPOTS[c]))];
const OPTS = { moon: 'number', tap: ['none', 'weeds', 'stash', 'glass'], tight: [false, true], worm: [false, true] };
const DEFAULTS = { tap: 'none', tight: false, worm: false };
const BANK = ['wide', 'hide', 'holes', 'brag'], STASH = ['stash', 'stash-close'], TUNNEL = ['crawl', 'fork'];
const SKY = ['wide', 'hide', 'brag'];
// where each Tap's mark is (and nowhere else)
const TAPS = { weeds: 'wide', stash: 'holes', glass: 'stash' };

// ---------------------------------------------------------------- helpers (as in set-marsh.test.js)

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

function checkRender(r, scene, label) {
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg);
  const vb = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(r.svg);
  assert.ok(vb, label + ': a viewBox');
  assert.deepEqual(vb[1].split(/\s+/).map(Number), [0, 0, 1600, 1000], label + ': the whole 1600 x 1000 composition');
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
  return ids;
}

const scene = (cam, opts, cast, fx) => ({ set: 'tracks', cam, opts: opts || {}, cast: cast || [], fx: fx || ['night'] });
const render = (cam, opts, cast, fx, look) => art.render(scene(cam, opts, cast, fx), { look: look || LOOK });
// render ids carry a per-render prefix (scenes.js) and a per-drawing counter (cats.js)
const strip = (s) => s.replace(/\bpc[0-9a-z]+-/g, '');
const info = () => art.tracksInfo();
const spots = (cam) => art.sceneInfo('tracks').anchors[COMP[cam]];
const has = (who) => art.vocab.cast.includes(who);   // does app/art/cats.js draw this one yet?
const num = (v) => { const r = Math.round(v * 10) / 10; return r === 0 ? '0' : String(r); };
// the markup of the first <g …> that carries this attribute text, to its matching </g>
function group(svg, attr) {
  const i = svg.indexOf(attr);
  if (i < 0) return '';
  const start = svg.lastIndexOf('<g', i);
  let depth = 0;
  const re = /<g\b[^>]*>|<\/g>/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(svg))) {
    if (m[0] === '</g>') { depth--; if (depth === 0) return svg.slice(start, m.index + 4); } else depth++;
  }
  return svg.slice(start);
}
const boxOf = (svg, part) => { const g = group(svg, 'data-part="' + part + '"'); const m = / data-box="([^"]+)"/.exec(g); return m ? m[1].split(' ').map(Number) : null; };
const attrOf = (svg, part, name) => { const g = group(svg, 'data-part="' + part + '"'); const m = new RegExp(' ' + name + '="([^"]+)"').exec(g); return m ? +m[1] : null; };
// a point inside the markup at `idx`, carried out through every transform of the groups it is in, to the world
function apply(t, p) {
  const ops = [...t.matchAll(/(\w+)\(([^)]*)\)/g)].map((m) => [m[1], m[2].split(/[\s,]+/).filter(Boolean).map(Number)]);
  for (let i = ops.length - 1; i >= 0; i--) {
    const [op, a] = ops[i];
    if (op === 'translate') p = [p[0] + a[0], p[1] + (a[1] || 0)];
    else if (op === 'scale') p = [p[0] * a[0], p[1] * (a[1] == null ? a[0] : a[1])];
    else if (op === 'matrix') p = [a[0] * p[0] + a[2] * p[1] + a[4], a[1] * p[0] + a[3] * p[1] + a[5]];
    else if (op === 'rotate') { const r = a[0] * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); p = [c * p[0] - s * p[1], s * p[0] + c * p[1]]; }
  }
  return p;
}
function toWorld(svg, idx, p) {
  const re = /<g\b[^>]*>|<\/g>/g, stack = [];
  let m;
  while ((m = re.exec(svg)) && m.index < idx) { if (m[0] === '</g>') stack.pop(); else stack.push(m[0]); }
  for (let k = stack.length - 1; k >= 0; k--) { const t = / transform="([^"]+)"/.exec(stack[k]); if (t) p = apply(t[1], p); }
  return p;
}
// the centre of the first tap mark of this name (cats.js's pc-tap-NAME circle) in the world
function tapAt(svg, name, from) {
  const i = svg.indexOf('pc-tap pc-tap-' + name, from || 0);
  if (i < 0) return null;
  const c = /<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([-\d.]+)"/.exec(svg.slice(i));
  const p = toWorld(svg, i + c.index, [+c[1], +c[2]]), q = toWorld(svg, i + c.index, [+c[1] + +c[3], +c[2]]);
  return { x: p[0], y: p[1], r: Math.hypot(q[0] - p[0], q[1] - p[1]) };
}
// where the cast member standing at world point a is drawn (scenes.js placeChar's group) and how big
function drawnAt(svg, a) {
  const key = '<g transform="translate(' + num(a.x) + ' ' + num(a.y) + ') scale(';
  const i = svg.indexOf(key);
  if (i < 0) return null;
  const s = +/scale\(([-\d.]+)/.exec(svg.slice(i))[1];
  return { i, s };
}
// a cast member's body and head boxes in the world, as drawn at its spot in this render
function boxes(svg, m, a, look) {
  const d = drawnAt(svg, a);
  assert.ok(d, 'drawn at ' + m.at);
  const o = Object.assign({}, m, { facing: m.facing || a.face || 'right' });
  delete o.who; delete o.at;
  if (m.who === 'player') { o.look = look || LOOK; o.sex = (look || LOOK).sex; }
  const ch = art.character(m.who, o), s = Math.abs(d.s);
  const W = (b) => [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s];
  return { body: W(ch.bounds), head: W(ch.headBox), s, at: d.i };
}
// the cast member drawn far bigger than a cat (near): its group, wherever the set put its spot
function bigOne(svg, m, look) {
  const re = /<g transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+) /g;
  let x, best = null;
  while ((x = re.exec(svg))) if (+x[3] > 3 && (!best || +x[3] > best.s)) best = { x: +x[1], y: +x[2], s: +x[3] };
  assert.ok(best, 'a big drawing');
  const o = Object.assign({}, m, { facing: m.facing || 'right' });
  delete o.who; delete o.at;
  if (m.who === 'player') { o.look = look || LOOK; o.sex = (look || LOOK).sex; }
  const ch = art.character(m.who, o), s = best.s, a = best;
  const W = (q) => [a.x + (q.x0 - ch.w / 2) * s, a.y + (q.y0 - ch.h) * s, a.x + (q.x1 - ch.w / 2) * s, a.y + (q.y1 - ch.h) * s];
  return { body: W(ch.bounds), head: W(ch.headBox), s };
}
const overlap = (a, b, pad) => a[0] < b[2] - (pad || 0) && a[2] > b[0] + (pad || 0) && a[1] < b[3] - (pad || 0) && a[3] > b[1] + (pad || 0);
const insideBox = (inner, outer, tol) => inner[0] >= outer[0] - tol && inner[1] >= outer[1] - tol && inner[2] <= outer[2] + tol && inner[3] <= outer[3] + tol;
function withCharacter(fn, body) {
  const real = art.character;
  art.character = fn;
  try { body(); } finally { art.character = real; }
}

// ---------------------------------------------------------------- the vocabulary

test('the vocabulary, exactly as the spec names it: eight cameras, their spots, the options and their defaults; registered night', () => {
  const v = art.vocab.sets.tracks;
  assert.ok(v, 'the tracks set is registered');
  assert.deepEqual(v.cams, CAMS);
  assert.deepEqual(v.anchors, ANCHORS);
  assert.deepEqual(v.opts, OPTS);
  const si = art.sceneInfo('tracks');
  assert.equal(si.label, LABEL);
  assert.deepEqual(si.defaults, DEFAULTS);
  for (const cam of CAMS) {
    assert.equal(si.cams[cam].comp, COMP[cam], cam + ': its own composition');
    assert.deepEqual(si.cams[cam], { x: 0, y: 0, w: 1600, h: 1000, comp: COMP[cam], follow: false, head: false }, cam + ': the whole world');
    assert.deepEqual(Object.keys(spots(cam)), SPOTS[cam], cam + ': the spots it sees, exactly');
  }
  // the set's order: after chapter 5's two and the rest of chapter 2 to 7's
  const order = Object.keys(art.vocab.sets);
  assert.ok(order.indexOf('tracks') > order.indexOf('marsh'), 'registered after the marsh: ' + order.join(' '));
});

test('one place, three pictures: the four bank cameras look at the one bank, the stash\'s two at the stash, the tunnel\'s two inside it', () => {
  for (const cam of BANK) {
    const svg = render(cam).svg;
    assert.ok(svg.includes('data-art="bank"'), cam + ': the bank');
    assert.ok(svg.includes('data-art="holes"'), cam + ': its holes');
    assert.ok(!svg.includes('data-art="glass-heap"') && !svg.includes('data-art="root"'), cam + ': not the stash or the tunnel');
  }
  for (const cam of SKY) {
    const svg = render(cam).svg;
    assert.ok(svg.includes('data-art="sky"') && svg.includes('data-art="tracks"'), cam + ': the sky and the tracks');
  }
  for (const cam of STASH) assert.ok(render(cam).svg.includes('data-art="glass-heap"'), cam + ': the heap of glass');
  assert.ok(render('stash').svg.includes('data-art="prey"'), 'stash: the prey in rows');
  for (const cam of TUNNEL) {
    const svg = render(cam).svg;
    assert.ok(svg.includes('data-art="prints"') && !svg.includes('data-art="bank"') && !svg.includes('data-art="sky"'), cam + ': inside the earth, prints on the floor');
  }
  assert.ok(render('fork').svg.includes('data-art="root"'), 'fork: the root between the two ways');
});

test('always night: the set draws the same picture whatever light a frame asks for, and the cast in the night\'s light; nothing is black', () => {
  for (const cam of CAMS) {
    const cast = SPOTS[cam].slice(0, 2).map((at, i) => ({ who: i ? 'tallyheart' : 'player', at, pose: 'sit' }));
    const night = render(cam, { moon: 8 }, cast, ['night']);
    for (const fx of [['day'], ['morning'], ['dusk'], ['sunset'], []]) {
      const r = render(cam, { moon: 8 }, cast, fx);
      assert.equal(strip(r.svg), strip(night.svg), cam + ' ' + fx.join() + ': night all the same');
      assert.deepEqual(r.keep, night.keep);
    }
    assert.ok(!/fill="#0{3}(0{3})?"/i.test(render(cam).svg), cam + ': no black: the night is silver');
    if (cast.length) assert.ok(/<feColorMatrix type="matrix" values="0\.7 0 0 0 0\.015/.test(night.svg), cam + ': the night\'s cast tint');
  }
});

// ---------------------------------------------------------------- every camera, every spot

test('every camera with a cast at every spot renders: ids unique, every head in the panel, the keep inside it', () => {
  const who = ['player', 'tallyheart', 'riffle', 'snip', 'snatch', 'reynard', 'clancat', 'hail'];
  const poses = { player: 'crouch', tallyheart: 'sit', riffle: 'scramble', snip: 'up', snatch: 'peek', reynard: 'trot', clancat: 'stand', hail: 'sit' };
  let n = 0;
  for (const cam of CAMS) {
    for (let k = 0; k < who.length; k++) {
      const cast = SPOTS[cam].map((at, i) => { const w = who[(i + k) % who.length]; return { who: w, at, pose: poses[w], mood: 'happy', variant: 2 }; });
      [{}, { moon: 8, tap: 'weeds', tight: true, worm: true }, { tap: 'stash' }, { tap: 'glass' }].forEach((opts, j) => {
        const sc = scene(cam, opts, cast);
        const r = art.render(sc, { look: (j + k) % 2 ? SHE : LOOK });
        checkRender(r, sc, cam + ' ' + JSON.stringify(opts));
        r.heads.forEach((h, i) => assert.ok(h, cam + ': ' + cast[i].who + ' at ' + cast[i].at + ' has a head in the panel'));
        n++;
      });
    }
    // and the whole vocabulary's spots at once: those out of this camera's sight are out of it
    const all = ANCHORS.map((at) => ({ who: 'clancat', at, pose: 'sit', variant: 1 }));
    const r = render(cam, {}, all);
    checkRender(r, scene(cam, {}, all), cam + ' (every spot)');
    ANCHORS.forEach((at, i) => assert.equal(r.heads[i] !== null, SPOTS[cam].includes(at), cam + ': ' + at + (SPOTS[cam].includes(at) ? ' is' : ' is not') + ' in sight'));
  }
  assert.ok(n >= 250, 'renders: ' + n);
  // without the character drawings (the gallery's placeholder cats), and with a painter that throws
  const fake = function () { throw new Error('placeholder'); };
  fake.placeholder = true;
  for (const fn of [fake, function () { throw new Error('broken'); }]) withCharacter(fn, () => {
    for (const cam of CAMS) {
      const cast = SPOTS[cam].map((at) => ({ who: 'player', at, pose: 'peek' }));
      const sc = scene(cam, { tight: true, worm: true, moon: 8 }, cast);
      checkRender(art.render(sc, { look: LOOK }), sc, cam + ' (placeholders)');
    }
  });
});

test('the same scene draws the same picture each time; unknown spots and custom spots never throw', () => {
  for (const cam of CAMS) {
    const cast = SPOTS[cam].map((at) => ({ who: 'player', at, pose: 'sit' }));
    assert.equal(strip(render(cam, { moon: 8 }, cast).svg), strip(render(cam, { moon: 8 }, cast).svg), cam);
    for (const odd of [[{ who: 'player', at: 'nowhere' }], [{ who: 'player', at: { x: 800, y: 900 } }], [{ who: 'player' }], [{}], [null]]) {
      const sc = scene(cam, { moon: 'big', tap: 'what', tight: 'yes', worm: 1 }, odd);
      assert.doesNotThrow(() => art.render(sc, { look: LOOK }), cam + ' ' + JSON.stringify(odd));
    }
  }
});

// ---------------------------------------------------------------- the options

test('every option off draws exactly as without it (moon: false or 0, tap: none, tight: false, worm: false), with and without a cast', () => {
  for (const cam of CAMS) {
    for (const cast of [[], SPOTS[cam].map((at) => ({ who: 'player', at, pose: 'sit' }))]) {
      const plain = render(cam, {}, cast);
      for (const off of [DEFAULTS, { moon: false }, { moon: 0 }, { tap: 'none' }, { tight: false }, { worm: false }, Object.assign({ moon: false }, DEFAULTS)]) {
        const r = render(cam, off, cast);
        assert.equal(strip(r.svg), strip(plain.svg), cam + ' ' + JSON.stringify(off));
        assert.deepEqual(r.heads, plain.heads);
        assert.deepEqual(r.keep, plain.keep);
      }
    }
  }
});

test('each Tap\'s mark is there only with its value, in its own camera, and unpainted: the picture is the same without it', () => {
  const tapRe = /<rect [^>]*class="pc-tap"[^>]*\/>/g;
  for (const cam of CAMS) {
    const cast = SPOTS[cam].map((at) => ({ who: 'player', at, pose: 'sit' }));
    const plain = render(cam, {}, cast);
    assert.ok(!/class="pc-tap"/.test(plain.svg.replace(/class="pc-tap pc-tap-[a-z]+"/g, '')), cam + ': no Tap mark of the set\'s by default');
    for (const [value, home] of Object.entries(TAPS)) {
      const r = render(cam, { tap: value }, cast), marks = r.svg.match(tapRe) || [];
      if (cam !== home) {
        assert.equal(strip(r.svg), strip(plain.svg), cam + ': tap ' + value + ' is not this camera\'s: nothing changes');
        continue;
      }
      assert.equal(marks.length, 1, cam + ': one mark for ' + value);
      const mk = marks[0];
      assert.ok(mk.includes('data-tap="' + value + '"') && mk.includes('fill="none"') && !/stroke="/.test(mk), cam + ': named, unpainted: ' + mk);
      assert.equal(strip(r.svg.replace(mk, '')), strip(plain.svg), cam + ': the same picture under the mark');
      assert.deepEqual(r.heads, plain.heads);
      // first in keep, so the page's glow and the lettering find it
      const b = /x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)"/.exec(mk).slice(1).map(Number);
      const k = r.keep[0];
      assert.ok(Math.abs(k.x - (b[0] - 4) / 16) < 0.2 && Math.abs(k.w - (b[2] + 8) / 16) < 0.2, cam + ': its box first in keep');
      assert.equal(r.keep.length, plain.keep.length + 1);
    }
  }
  const I = info();
  // weeds: the tall weeds' box along the foot (the main bed, between the tunnel's end and the holes)
  const wr = /<rect [^>]*data-tap="weeds"[^>]*\/>/.exec(render('wide', { tap: 'weeds' }).svg)[0], wb = /x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)"/.exec(wr).slice(1).map(Number);
  const bed = I.main.weeds.reduce((a, w) => (w.x1 - w.x0 > a.x1 - a.x0 ? w : a));
  assert.ok(wb[0] <= bed.x0 + 1 && wb[0] + wb[2] >= bed.x1 - 1 && wb[1] <= bed.base - bed.tall + 1 && wb[1] + wb[3] >= bed.base - 40, 'the weeds Tap covers the tall weed bed: ' + wb);
  // stash: the biggest hole's mouth
  const big = I.holes.holes.find((h) => h.id === 'big');
  assert.deepEqual(I.holes.stashTap, { x: big.cx - big.rx, y: big.cy - big.ry, w: big.rx * 2, h: big.ry * 2 });
  assert.ok(render('holes', { tap: 'stash' }).svg.includes('x="' + num(big.cx - big.rx) + '" y="' + num(big.cy - big.ry) + '" width="' + num(big.rx * 2) + '"'), 'the stash Tap is the mouth\'s box');
  // glass: one small piece at the heap's near edge, painted with or without the Tap
  const S = I.stash, sm = S.small;
  assert.ok(sm.x + sm.w / 2 < S.heap.x0 + (S.heap.x1 - S.heap.x0) * 0.25 && sm.y + sm.h >= S.heap.base - 4, 'the piece is at the heap\'s near edge: ' + JSON.stringify(sm));
  assert.ok(sm.w < (S.heap.x1 - S.heap.x0) * 0.2, 'one small piece');
  for (const opts of [{}, { tap: 'glass' }]) assert.equal((render('stash', opts).svg.match(/data-art="glass-piece"/g) || []).length, 1, 'the piece is painted ' + JSON.stringify(opts));
});

test('the moon only with `moon`, in the cameras with sky: the eighth evening\'s half moon high up, kept clear of lettering; never in the earth', () => {
  for (const cam of CAMS) {
    assert.ok(!render(cam).svg.includes('waxing-moon'), cam + ': no moon without the option');
    const r = render(cam, { moon: 8 });
    if (!SKY.includes(cam)) { assert.ok(!r.svg.includes('waxing-moon'), cam + ': no sky, no moon'); continue; }
    const g = group(r.svg, 'data-prop="waxing-moon"');
    assert.ok(g.includes('data-age="8"'), cam + ': the eighth evening\'s');
    const plain = render(cam);
    assert.equal(r.keep.length, plain.keep.length + 1, cam + ': the moon in keep');
    const mk = r.keep.find((k) => !plain.keep.some((p) => JSON.stringify(p) === JSON.stringify(k)));
    assert.ok(mk.y + mk.h < info()[COMP[cam]].sky / 10 + 1, cam + ': in the sky: ' + JSON.stringify(mk));
    assert.ok(mk.y < 30, cam + ': high in the sky');
    // a half moon: the terminator nearly straight (kit.waxingMoon: moonT(8) is close to 0)
    const arcs = /d="M0 [-\d.]+A([\d.]+) ([\d.]+) 0 0 1 0 [\d.]+A([\d.]+) ([\d.]+)/.exec(g);
    assert.ok(arcs && +arcs[3] / +arcs[1] < 0.15, cam + ': a half moon');
    // each evening a little bigger and higher
    const r12 = render(cam, { moon: 12 }), k12 = r12.keep.find((k) => !plain.keep.some((p) => JSON.stringify(p) === JSON.stringify(k)));
    assert.ok(k12.w >= mk.w && k12.y <= mk.y, cam + ': fatter and higher by the twelfth');
  }
});

// ---------------------------------------------------------------- the covers

test('weeds-1 and weeds-2: tall weeds over whoever is there, up to the eyes across her face and as high as her back beside it; ears, eyes and the top of the head above; a raised tail\'s tip above them', () => {
  const cats = [['player', 'sit'], ['player', 'crouch'], ['player', 'lie'], ['player', 'flat'], ['player', 'loaf'], ['tallyheart', 'crouch'], ['tallyheart', 'sit'], ['riffle', 'stand'], ['riffle', 'scramble']];
  const A = spots('hide');
  for (const at of ['weeds-1', 'weeds-2']) {
    for (const [who, pose] of cats) {
      const m = { who, at, pose, mood: 'wonder' }, other = { who: 'clancat', at: at === 'weeds-1' ? 'weeds-2' : 'weeds-1', pose: 'sit', variant: 3 };
      const r = render('hide', {}, [m, other]), svg = r.svg, label = at + ' ' + who + ' ' + pose;
      const b = boxes(svg, m, A[at]);
      const cover = group(svg, 'data-at="' + at + '"');
      assert.ok(cover.includes('data-part="cover-weeds"'), label + ': the weeds cover');
      // just after her: after her drawing, before the next cast member's
      const ci = svg.indexOf(cover), next = drawnAt(svg, A[other.at]).i;
      assert.ok(ci > b.at && (next < b.at || ci < next), label + ': drawn just after her');
      const eye = attrOf(svg, 'cover-weeds" data-at="' + at, 'data-eye'), top = attrOf(svg, 'cover-weeds" data-at="' + at, 'data-top'), box = boxOf(svg, 'cover-weeds" data-at="' + at);
      const hh = b.head[3] - b.head[1];
      assert.ok(eye > b.head[1] + hh * 0.45 && eye < b.head[3] - hh * 0.15, label + ': the line is her eyes: ' + eye + ' in ' + b.head.map(Math.round));
      // across her face the weeds stop at her eyes; beside it they reach the top of her back (crouched, her back
      // and haunch rise above her eyes: they are in the weeds too), and no blade stands higher than that
      const face = / data-face="([^"]+)"/.exec(group(svg, 'data-at="' + at + '"'))[1].split(' ').map(Number), back = attrOf(svg, 'cover-weeds" data-at="' + at, 'data-back');
      assert.ok(face[0] <= b.head[0] + 1 && face[1] >= b.head[2] - 1 && face[1] - face[0] < (b.head[2] - b.head[0]) * 1.2, label + ': the eye line across her face: ' + face.map(Math.round) + ' vs ' + b.head.map(Math.round));
      assert.ok(back <= eye && back <= b.body[1] + hh * 0.12 + 0.5, label + ': beside her face, up to the top of her back: ' + back + ' vs body top ' + Math.round(b.body[1]));
      assert.ok(top >= back - 0.5, label + ': no blade above her back: ' + top + ' vs ' + back);
      if (pose === 'crouch') assert.ok(back < eye - hh * 0.2, label + ': crouched, her back above her eyes is in the weeds: ' + back + ' vs ' + eye);
      // everything of her below the eyes is in the weeds: the box it fills solid reaches from under her chin past her feet, across her
      assert.ok(box[0] <= b.body[0] && box[2] >= b.body[2] && box[3] >= b.body[3], label + ': across her and under her: ' + box.map(Math.round) + ' vs ' + b.body.map(Math.round));
      assert.ok(box[1] <= b.head[3] + hh * 0.05, label + ': solid from under her chin: ' + Math.round(box[1]) + ' vs chin ' + Math.round(b.head[3]));
      // her head is in the panel
      assert.ok(r.heads[0] && r.heads[0].y < 100, label + ': her face in the panel');
    }
  }
  // the tail's tip stands above the weeds (the tail Tap): Tallyheart crouched, Riffle standing, our cat sitting
  for (const [who, pose, at] of [['tallyheart', 'crouch', 'weeds-2'], ['riffle', 'stand', 'weeds-2'], ['player', 'sit', 'weeds-1'], ['tallyheart', 'crouch', 'weeds-1']]) {
    const m = { who, at, pose, mood: 'worried', tailUp: true, tap: 'tail', facing: at === 'weeds-2' ? 'left' : 'right' };
    const svg = render('hide', {}, [m]).svg, tip = tapAt(svg, 'tail');
    if (!tip) { assert.ok(!art.character(who, { pose, tailUp: true, tap: 'tail' }).svg.includes('pc-tap-tail'), who + ': no tail mark in cats.js yet'); continue; }
    const top = attrOf(svg, 'cover-weeds" data-at="' + at, 'data-top'), nm = / data-notch="([^"]+)"/.exec(group(svg, 'data-at="' + at + '"'));
    // above the weeds; or, a tail held up lower than her eyes (an otter standing), the weeds parted round its tip
    const notch = nm ? nm[1].split(' ').map(Number) : null;
    assert.ok(tip.y < top - 2 || (notch && tip.x > notch[0] && tip.x < notch[1] && tip.y + tip.r * 0.5 < notch[2]),
      who + ' ' + pose + ' at ' + at + ': the tail\'s tip (' + Math.round(tip.y) + ') above the weeds (' + Math.round(top) + (notch ? ', parted to ' + Math.round(notch[2]) : '') + ')');
  }
  // nobody there: nothing of it
  assert.ok(!render('hide', {}, [{ who: 'reynard', at: 'rails', pose: 'trot' }]).svg.includes('cover-weeds'), 'no cover without a cat in the weeds');
});

test('tunnel-end: the tunnel\'s lip over the back half of whoever is there, in any pose, facing either way: head and shoulders out', () => {
  const A = spots('wide')['tunnel-end'];
  const list = art.vocab.poses.map((p) => ['player', p]).concat(art.vocab.poses.map((p) => ['tallyheart', p]), (art.vocab.otherPoses.riffle || []).map((p) => ['riffle', p]));
  assert.ok(list.length > 30);
  for (const [who, pose] of list) for (const facing of ['right', 'left']) {
    const m = { who, at: 'tunnel-end', pose, mood: 'happy', facing }, label = who + ' ' + pose + ' ' + facing;
    const svg = render('wide', {}, [m, { who: 'player', at: 'foot-1', pose: 'sit' }]).svg, b = boxes(svg, m, A);
    const box = boxOf(svg, 'cover-tunnel'), cut = attrOf(svg, 'cover-tunnel', 'data-cut'), w = b.body[2] - b.body[0];
    assert.ok(box, label + ': the lip');
    assert.ok(svg.indexOf('data-part="cover-tunnel"') > b.at, label + ': drawn after her');
    const back = facing === 'right' ? b.body[0] : b.body[2], frac = (cut - back) / (facing === 'right' ? w : -w);
    assert.ok(frac > 0.38 && frac < 0.55, label + ': it covers her back half: ' + frac.toFixed(2));
    assert.ok(box[0] <= Math.min(back, cut) + 0.5 && box[2] >= Math.max(back, cut) - 0.5 && box[1] <= b.body[1] && box[3] >= b.body[3], label + ': top to bottom of her: ' + box.map(Math.round) + ' vs ' + b.body.map(Math.round));
  }
  // the frames' two: our cat crouched wriggling out, Riffle scrambling: head and shoulders out, in front of the lip
  for (const [who, pose] of [['player', 'crouch'], ['riffle', 'scramble'], ['tallyheart', 'crouch']]) for (const facing of ['right', 'left']) {
    const m = { who, at: 'tunnel-end', pose, facing }, svg = render('wide', {}, [m]).svg, b = boxes(svg, m, A), cut = attrOf(svg, 'cover-tunnel', 'data-cut');
    if (facing === 'right') assert.ok(b.head[0] >= cut - 1, who + ' ' + facing + ': her head is out: ' + Math.round(b.head[0]) + ' vs ' + Math.round(cut));
    else assert.ok(b.head[2] <= cut + 1, who + ' ' + facing + ': her head is out');
  }
  assert.ok(!render('wide', {}, [{ who: 'player', at: 'foot-1' }]).svg.includes('cover-tunnel'), 'nobody at the tunnel\'s end: no lip over anyone');
});

test('hole-1 and hole-2: a cast member in `peek` has the hole\'s lip over its back half (head and shoulders out); standing, sitting up or pointing, it stands in front of its hole with nothing over it', () => {
  const peekers = [['snip', 'peek'], ['snatch', 'peek'], ['player', 'peek'], ['hail', 'peek']];
  for (const cam of ['wide', 'hide', 'holes']) {
    const A = spots(cam), I = info()[COMP[cam]];
    for (const at of ['hole-1', 'hole-2']) {
      const H = I.holes.find((h) => h.id === I.holeAt[at]);
      assert.ok(H, cam + ' ' + at + ': at a hole');
      assert.equal(I.holeAt['hole-1'], 'little', cam + ': hole-1 is the little hole');
      assert.equal(I.holeAt['hole-2'], 'second', cam + ': hole-2 is the second small hole');
      // the spot is the hole's lip, at its middle
      assert.ok(Math.abs(A[at].x - H.cx) < H.rx * 0.3 && A[at].y > H.cy && A[at].y < H.cy + H.ry * 1.25, cam + ' ' + at + ': on the hole\'s lip');
      for (const [who, pose] of peekers) {
        const m = { who, at, pose, mood: 'happy', holds: who === 'snatch' ? 'mouse' : undefined };
        const svg = render(cam, {}, [m]).svg, b = boxes(svg, m, A[at]), label = cam + ' ' + at + ' ' + who + ' ' + pose;
        const box = boxOf(svg, 'cover-lip'), line = attrOf(svg, 'cover-lip', 'data-line'), hh = b.head[3] - b.head[1];
        assert.ok(box, label + ': the lip');
        assert.ok(svg.indexOf('data-part="cover-lip"') > b.at, label + ': drawn after it');
        assert.ok(line >= b.head[3] - 0.5 && line <= b.head[3] + hh * 0.6, label + ': head out, the rest under: line ' + Math.round(line) + ', chin ' + Math.round(b.head[3]));
        assert.ok(box[0] <= b.body[0] + 0.5 && box[2] >= b.body[2] - 0.5 && box[3] >= b.body[3], label + ': the lip spans it below the line');
        // a weasel's head is in the mouth of its hole (the dark round it)
        const hy = (b.head[1] + b.head[3]) / 2;
        if (who === 'snip' || who === 'snatch') assert.ok(hy > H.cy - H.ry * 1.3 && hy < H.cy + H.ry, label + ': its head at the hole: ' + Math.round(hy) + ' vs ' + H.cy + '±' + H.ry);
      }
      for (const pose of ['up', 'stand', 'point', 'run', 'skid']) {
        const svg = render(cam, {}, [{ who: 'snip', at, pose }]).svg;
        assert.ok(!svg.includes('cover-lip'), cam + ' ' + at + ' ' + pose + ': nothing over it');
      }
    }
  }
});

test('the weasels at hole-1 and hole-2 on `holes` are clear of the cat at stash-mouth and of the stash Tap\'s box; in the chase all three at once', () => {
  const A = spots('holes'), T = info().holes.stashTap, tap = [T.x, T.y, T.x + T.w, T.y + T.h];
  const cats = ['crouch', 'sit', 'stand'].concat(art.vocab.poses.includes('run') ? ['run'] : []);
  for (const at of ['hole-1', 'hole-2']) for (const who of ['snip', 'snatch']) for (const pose of ['up', 'peek', 'point', 'stand']) for (const facing of ['right', 'left']) {
    const m = { who, at, pose, facing, holds: who === 'snatch' ? 'mouse' : undefined }, label = at + ' ' + who + ' ' + pose + ' ' + facing;
    for (const cp of cats) for (const cf of ['right', 'left']) {
      const c = { who: 'player', at: 'stash-mouth', pose: cp, facing: cf, holds: cp === 'run' ? 'leaf' : undefined };
      const svg = render('holes', {}, [m, c]).svg, w = boxes(svg, m, A[at]), k = boxes(svg, c, A['stash-mouth']);
      assert.ok(!overlap(w.body, k.body, 2), label + ': clear of our cat ' + cp + ' ' + cf + ': ' + w.body.map(Math.round) + ' / ' + k.body.map(Math.round));
      if (cp === 'crouch' && cf === 'right') assert.ok(!overlap(w.body, tap, 2), label + ': clear of the stash Tap');
    }
  }
  // the spots themselves are clear, and the stash Tap is clear of the weasels' holes
  const I = info().holes;
  for (const id of ['little', 'second']) { const H = I.holes.find((h) => h.id === id); assert.ok(!overlap([H.cx - H.rx, H.cy - H.ry, H.cx + H.rx, H.cy + H.ry], tap, 0), id + ' hole clear of the stash'); }
  // the chase: Snatch peeks at hole-1, Snip sits up at hole-2, our cat crouches at stash-mouth, the friend at watch
  for (const friend of [{ who: 'tallyheart', pose: 'sit' }, { who: 'riffle', pose: 'scramble' }]) {
    const cast = [{ who: 'snatch', at: 'hole-1', pose: 'peek', holds: 'mouse' }, { who: 'snip', at: 'hole-2', pose: 'up', mood: 'shout' }, { who: 'player', at: 'stash-mouth', pose: 'crouch' },
      Object.assign({ at: 'watch' }, friend)];
    const r = render('holes', { tap: 'stash' }, cast), B = cast.map((m) => boxes(r.svg, m, A[m.at]));
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.ok(!overlap(B[i].head, B[j].body, 2) && !overlap(B[j].head, B[i].body, 2), 'the chase: no face on anyone: ' + cast[i].who + ' / ' + cast[j].who);
    r.heads.forEach((h, i) => assert.ok(h, cast[i].who + ': a head in the panel'));
  }
});

test('stash-mouth: a cat crouched there has her head at the biggest hole\'s mouth, the mouth about as wide as her shoulders (a tight squeeze)', () => {
  const A = spots('holes')['stash-mouth'], big = info().holes.holes.find((h) => h.id === 'big');
  for (const look of [LOOK, SHE]) {
    const m = { who: 'player', at: 'stash-mouth', pose: 'crouch' }, svg = render('holes', {}, [m], ['night'], look).svg, b = boxes(svg, m, A, look);
    assert.ok(Math.abs(b.head[2] - (big.cx - big.rx)) < 30, 'her nose at the mouth\'s rim: ' + Math.round(b.head[2]) + ' vs ' + (big.cx - big.rx));
    // a tight squeeze: about her head's width and a little more, and lower than she is crouched (the review: at
    // 280 x 188 it was as tall as she is and wider than her head and a half)
    const tall = b.body[3] - b.body[1], hw = b.head[2] - b.head[0];
    assert.ok(big.rx * 2 >= hw && big.rx * 2 < hw * 1.35, 'the mouth\'s width against her head: ' + big.rx * 2 + ' vs ' + Math.round(hw));
    assert.ok(big.ry * 2 > tall * 0.6 && big.ry * 2 < tall * 0.9, 'the mouth\'s height against her crouched height: ' + big.ry * 2 + ' vs ' + Math.round(tall));
    const hy = (b.head[1] + b.head[3]) / 2;
    assert.ok(hy > big.cy - big.ry && hy < big.cy + big.ry, 'her head at the mouth\'s height');
  }
  // and it is still the biggest hole on the bank's face
  for (const h of info().holes.holes) if (h.id !== 'big') assert.ok(h.rx < big.rx && h.ry < big.ry, h.id + ' is smaller than the biggest');
});

test('watch: the friend a little way off at the left, among the weeds, weeds over her legs', () => {
  const A = spots('holes').watch;
  for (const m of [{ who: 'tallyheart', at: 'watch', pose: 'sit' }, { who: 'riffle', at: 'watch', pose: 'scramble' }, { who: 'player', at: 'watch', pose: 'crouch' }]) {
    const r = render('holes', {}, [m]), b = boxes(r.svg, m, A), box = boxOf(r.svg, 'cover-watch'), top = attrOf(r.svg, 'cover-watch', 'data-top');
    assert.ok(box && r.svg.indexOf('data-part="cover-watch"') > b.at, m.who + ': weeds over her');
    assert.ok(top > b.head[3], m.who + ': her face clear of them');
    assert.ok(box[0] <= b.body[0] && box[2] >= b.body[2] && box[3] >= A.y, m.who + ': over her legs');
    assert.ok(A.x < 400 && r.heads[0], m.who + ': at the left, her face in the panel');
  }
});

test('stash-in: the mouth\'s rim crops whoever comes in to head, shoulders and forepaws', () => {
  const A = spots('stash')['stash-in'];
  for (const pose of ['crouch', 'sit', 'stand', 'walk', 'flat', 'pawup', 'peer']) for (const look of [LOOK, SHE]) {
    const m = { who: 'player', at: 'stash-in', pose, mood: 'sniff' }, r = render('stash', {}, [m], ['night'], look), b = boxes(r.svg, m, A, look);
    const box = boxOf(r.svg, 'cover-rim'), cut = attrOf(r.svg, 'cover-rim', 'data-cut'), w = b.body[2] - b.body[0];
    assert.ok(box && r.svg.indexOf('data-part="cover-rim"') > b.at, pose + ': the rim over her');
    const frac = (cut - b.body[0]) / w;
    assert.ok(frac > 0.33 && frac < 0.47, pose + ': all of her behind her shoulders: ' + frac.toFixed(2));
    assert.ok(box[0] <= b.body[0] && box[1] <= b.body[1] && box[3] >= b.body[3], pose + ': top to bottom');
    if (pose === 'crouch') assert.ok(b.head[0] >= cut - 1, 'crouched: her head in the chamber');
    assert.ok(r.heads[0] && r.heads[0].x > 3, pose + ': her face in the panel');
  }
  // she comes in at the left edge, clear of the prey
  const rows = info().stash.rows;
  const m = { who: 'player', at: 'stash-in', pose: 'crouch' }, b = boxes(render('stash', {}, [m]).svg, m, A);
  assert.ok(b.body[2] < rows[0].x - rows[0].step * 0.5 && b.body[2] < rows[1].x - rows[1].step * 0.5, 'her nose short of the rows');
});

test('tight: an earth lip and roots over the back half of whoever is at crawl-2; never without it, nothing with nobody there', () => {
  const A = spots('crawl')['crawl-2'];
  for (const [who, pose] of [['riffle', 'scramble'], ['riffle', 'stand'], ['player', 'crouch'], ['tallyheart', 'crouch']]) {
    const m = { who, at: 'crawl-2', pose, tap: 'paw' }, r = render('crawl', { tight: true }, [m]), b = boxes(r.svg, m, A);
    const box = boxOf(r.svg, 'cover-tight'), cut = attrOf(r.svg, 'cover-tight', 'data-cut'), w = b.body[2] - b.body[0];
    assert.ok(box && r.svg.indexOf('data-part="cover-tight"') > b.at, who + ': the lip over him');
    const frac = (cut - b.body[0]) / w;
    assert.ok(frac > 0.45 && frac < 0.56, who + ': his back half: ' + frac.toFixed(2));
    assert.ok(box[0] <= b.body[0] && box[1] <= b.body[1] && box[3] >= b.body[3], who + ': top to bottom');
    assert.ok(group(r.svg, 'data-part="cover-tight"').includes('stroke="#83767C"'), who + ': roots hanging over its edge');
    // the pull-through Tap's paw is his front one, out in the tunnel
    const paw = tapAt(r.svg, 'paw');
    if (paw) assert.ok(paw.x > cut, who + ': the marked forepaw clear of the lip');
    assert.ok(!render('crawl', {}, [m]).svg.includes('cover-tight'), who + ': nothing without tight');
  }
  assert.equal(strip(render('crawl', { tight: true }, [{ who: 'player', at: 'crawl-1', pose: 'crouch' }]).svg), strip(render('crawl', {}, [{ who: 'player', at: 'crawl-1', pose: 'crouch' }]).svg), 'nobody at crawl-2: nothing');
});

test('crawl: the roof just clears a sitting cat\'s ears at crawl-1, where her raised forepaw (pawup) touches the roots hanging from it; lower behind her toward crawl-2', () => {
  const I = info(), A = spots('crawl'), a1 = A['crawl-1'], a2 = A['crawl-2'];
  assert.ok(I.roofAt(a2.x) > I.roofAt(a1.x) + 20, 'lower toward crawl-2');
  assert.ok(a1.face === 'right' && a1.x > 700, 'the leader crawling on, facing right');
  for (const look of [LOOK, SHE]) {
    for (const pose of ['sit', 'pawup', 'crouch']) {
      const m = { who: 'player', at: 'crawl-1', pose, tap: 'paw' }, r = render('crawl', {}, [m], ['night'], look), b = boxes(r.svg, m, a1, look);
      for (let x = b.body[0]; x <= b.body[2]; x += 10) assert.ok(I.roofAt(x) < b.body[1], pose + ': under the roof at ' + Math.round(x));
      if (pose === 'sit') assert.ok(b.body[1] - I.roofAt((b.head[0] + b.head[2]) / 2) < 45, 'the roof just clears her ears: ' + Math.round(b.body[1] - I.roofAt((b.head[0] + b.head[2]) / 2)));
      if (pose !== 'pawup') continue;
      const paw = tapAt(r.svg, 'paw');
      assert.ok(paw, 'her raised forepaw is marked');
      const near = I.crawl.pawRoots.filter((q) => Math.abs(q.x - paw.x) < paw.r * 2.5);
      assert.ok(near.length >= 2, 'roots hang over her raised forepaw: ' + JSON.stringify(paw));
      for (const q of near) assert.ok(q.tip > paw.y - paw.r * 2.6 && q.tip < paw.y + paw.r * 0.5, 'a root\'s tip at her paw: ' + q.tip + ' vs ' + Math.round(paw.y) + ' r ' + Math.round(paw.r));
      // (the review: they stopped above her cheek, beside her ears) two of them come right down to the paw itself
      assert.ok(near.filter((q) => Math.abs(q.tip - paw.y) < paw.r).length >= 2, 'two roots reach her raised paw: ' + near.map((q) => q.tip) + ' vs ' + Math.round(paw.y));
      assert.ok(near.every((q) => q.top >= I.roofAt(q.x) - 4), 'they hang from the roof');
    }
  }
  // behind her, partly cut by the panel's edge; prints both ways on the floor, always
  const m2 = { who: 'riffle', at: 'crawl-2', pose: 'scramble' }, b2 = boxes(render('crawl', {}, [m2]).svg, m2, a2);
  assert.ok(b2.body[0] < 0 && b2.body[2] > 0, 'crawl-2 cut by the panel\'s left edge');
  for (let x = Math.max(0, b2.body[0]); x <= b2.body[2]; x += 10) assert.ok(I.roofAt(x) < b2.body[1], 'Riffle fits under the roof at ' + Math.round(x));
});

test('prints: faint tiny prints round every hole on wide and holes (and up close from the weeds), with every option off and on; on the tunnel floor both ways, always', () => {
  const pads = (svg) => {
    const g = group(svg, 'data-art="prints"'), d = /d="([^"]+)"/.exec(g)[1], out = [];
    const re = /M([-\d.]+) ([-\d.]+)a([\d.]+) /g;
    let m;
    while ((m = re.exec(d))) out.push([+m[1] + +m[3], +m[2], +m[3]]);
    return { out, op: +/opacity="([\d.]+)"/.exec(g)[1] };
  };
  for (const cam of ['wide', 'holes', 'hide']) {
    for (const opts of [{}, DEFAULTS, { moon: 8, tap: cam === 'wide' ? 'weeds' : 'stash' }]) {
      const { out, op } = pads(render(cam, opts).svg), I = info()[COMP[cam]];
      assert.ok(op <= 0.6, cam + ': faint');
      for (const H of I.holes) {
        const near = out.filter((p) => { const dx = (p[0] - H.cx) / H.rx, dy = (p[1] - H.cy) / H.ry; const d = Math.hypot(dx, dy); return d > 0.9 && d < 3.2; });
        assert.ok(near.length >= 10 * 6, cam + ' ' + H.id + ': prints all round it (' + near.length + ' marks)');
        const left = near.filter((p) => p[0] < H.cx).length, right = near.filter((p) => p[0] > H.cx).length;
        assert.ok(left > 10 && right > 10, cam + ' ' + H.id + ': on both sides');
      }
      // tiny: a pad far smaller than the little hole
      const little = I.holes.find((h) => h.id === 'little'), padR = Math.max(...out.map((p) => p[2]));
      assert.ok(padR < little.ry * 0.2, cam + ': tiny prints');
    }
  }
  for (const cam of TUNNEL) for (const opts of [{}, { tight: true, worm: true }]) {
    const { out } = pads(render(cam, opts).svg);
    const xs = out.map((p) => p[0]);
    assert.ok(Math.min(...xs) < 400 && Math.max(...xs) > 1200, cam + ': along the floor');
  }
  // both ways on the crawl's floor: toes ahead of the pad, to the right in one lane and the left in the other
  const g = group(render('crawl').svg, 'data-art="prints"'), d = /d="([^"]+)"/.exec(g)[1];
  const marks = [...d.matchAll(/M([-\d.]+) ([-\d.]+)a([\d.]+) /g)].map((m) => [+m[1] + +m[3], +m[2], +m[3]]);
  let fwd = 0, back = 0;
  for (let i = 0; i + 5 < marks.length; i += 6) { const pad = marks[i], toes = marks.slice(i + 1, i + 6), tx = toes.reduce((s, t) => s + t[0], 0) / 5; if (tx > pad[0]) fwd++; else back++; }
  assert.ok(fwd > 10 && back > 10, 'prints going both ways: ' + fwd + ' / ' + back);
});

test('no spot but `rails` is on the rails or the sleepers; the fox at `rails` stands on them; nobody of the Clan up there', () => {
  const I = info();
  for (const cam of SKY) {
    const R = I[COMP[cam]].rails, A = spots(cam);
    assert.ok(R && R.width >= 4.5 && R.width <= (cam === 'wide' ? 5.5 : 10), cam + ': two bright rails, about 5 wide on wide: ' + R.width);
    for (const [k, a] of Object.entries(A)) {
      if (k === 'rails') {
        assert.ok(a.y >= R.y0 && a.y <= R.y1, cam + ': the fox\'s spot is on the tracks');
        continue;
      }
      assert.ok(a.y > R.y1 + 20, cam + ' ' + k + ': off the rails and the sleepers (' + a.y + ' vs ' + R.y1 + ')');
      // whoever stands there, sitting or standing, has no paw up there
      for (const pose of ['sit', 'stand', 'up']) {
        const m = { who: pose === 'up' ? 'snip' : 'tallyheart', at: k, pose }, b = boxes(render(cam, {}, [m]).svg, m, a);
        assert.ok(b.body[3] > R.y1 + 10, cam + ' ' + k + ' ' + pose + ': its feet below the tracks');
      }
    }
    const m = { who: 'reynard', at: 'rails', pose: 'trot' }, svg = render(cam, {}, [m]).svg;
    assert.ok(drawnAt(svg, A.rails), cam + ': the fox drawn on the rails');
  }
  // holes and the stash and the tunnel have no rails at all
  for (const cam of ['holes', ...STASH, ...TUNNEL]) assert.ok(!render(cam).svg.includes('data-art="tracks"'), cam + ': no rails');
  assert.ok(!Object.keys(spots('brag')).some((k) => /weeds|foot|stash|watch|near|crawl|fork|tunnel/.test(k)), 'brag: no spot for a cat of the Clan');
});

test('sizes: a weasel at its hole on `holes` is about half a cat\'s height; the fox up on the tracks in `hide` is never bigger than a cat\'s head in the weeds; on `brag` he is a fox beside the weasels', () => {
  // holes: Snip sitting up at hole-1 against our cat sitting at stash-mouth
  const A = spots('holes'), cat = { who: 'player', at: 'stash-mouth', pose: 'sit' };
  for (const who of ['snip', 'snatch']) for (const at of ['hole-1', 'hole-2']) {
    const w = { who, at, pose: 'up' }, svg = render('holes', {}, [w, cat]).svg, bw = boxes(svg, w, A[at]), bc = boxes(svg, cat, A['stash-mouth']);
    const ratio = (bw.body[3] - bw.head[1]) / (bc.body[3] - bc.head[1]);
    assert.ok(ratio > 0.42 && ratio < 0.72, who + ' at ' + at + ': about half her height: ' + ratio.toFixed(2));
  }
  // wide: small at the holes and on the rails, our cats at the foot bigger
  const W = spots('wide');
  for (const [m, at] of [[{ who: 'snip', pose: 'up' }, 'hole-1'], [{ who: 'snatch', pose: 'up' }, 'hole-2'], [{ who: 'reynard', pose: 'trot' }, 'rails']]) {
    const mm = Object.assign({ at }, m), c = { who: 'player', at: 'foot-1', pose: 'sit' }, svg = render('wide', {}, [mm, c]).svg;
    const b = boxes(svg, mm, W[at]), bc = boxes(svg, c, W['foot-1']);
    assert.ok(b.body[3] - b.body[1] < (bc.body[3] - bc.body[1]) * 0.7, 'wide: ' + m.who + ' at ' + at + ' is small');
  }
  // hide: the fox at rails, in every pose of his, against our cat's head (the smallest cat) sitting or crouching in the weeds
  const H = spots('hide');
  for (const pose of art.vocab.otherPoses.reynard) for (const cp of ['sit', 'crouch']) for (const at of ['weeds-1', 'weeds-2']) {
    const f = { who: 'reynard', at: 'rails', pose }, c = { who: 'player', at, pose: cp }, svg = render('hide', {}, [c, f]).svg;
    const bf = boxes(svg, f, H.rails), bc = boxes(svg, c, H[at]);
    const fw = bf.body[2] - bf.body[0], fh = bf.body[3] - bf.body[1], hw = bc.head[2] - bc.head[0], hh = bc.head[3] - bc.head[1];
    assert.ok(fh <= hh && fw * fh <= hw * hh * 1.25, 'hide: the fox ' + pose + ' (' + Math.round(fw) + ' x ' + Math.round(fh) + ') no bigger than her head (' + Math.round(hw) + ' x ' + Math.round(hh) + ')');
  }
  // hide: the weasels at their holes smaller than the cats' heads
  for (const at of ['hole-1', 'hole-2']) {
    const w = { who: 'snip', at, pose: 'up' }, c = { who: 'player', at: 'weeds-1', pose: 'sit' }, svg = render('hide', {}, [w, c]).svg;
    const bw = boxes(svg, w, H[at]), bc = boxes(svg, c, H['weeds-1']);
    assert.ok(bw.body[3] - bw.body[1] < bc.head[3] - bc.head[1], 'hide: the weasel at ' + at + ' smaller than her head');
  }
  // brag: the fox bigger than the weasels sitting up at the bottom corners
  const B = spots('brag');
  for (const pose of ['sit', 'comb', 'chest', 'flap', 'trot']) {
    const f = { who: 'reynard', at: 'rails', pose }, s1 = { who: 'snip', at: 'slope-1', pose: 'up' }, s2 = { who: 'snatch', at: 'slope-2', pose: 'up' };
    const r = render('brag', { moon: 8 }, [f, s1, s2]), bf = boxes(r.svg, f, B.rails), b1 = boxes(r.svg, s1, B['slope-1']), b2 = boxes(r.svg, s2, B['slope-2']);
    assert.ok(bf.body[3] - bf.body[1] > (b1.body[3] - b1.body[1]) * 1.3, 'brag: the fox (' + pose + ') a fox beside the weasels');
    assert.ok(b1.head[0] < 800 && b2.head[2] > 800 && b1.body[3] > 900 && b2.body[3] > 900, 'brag: the weasels at the bottom corners');
    r.heads.forEach((h, i) => assert.ok(h, 'brag: every face in the panel'));
    const moon = r.keep.find((k) => k.w < 50);
    assert.ok(moon && !overlap([moon.x * 16, moon.y * 10, (moon.x + moon.w) * 16, (moon.y + moon.h) * 10], bf.head, 0), 'brag: the moon is clear of his face');
  }
});

test('stash-close: `near` is the corner of her face and a forepaw at the left edge, drawn bigger than the panel, her head point inside it and off the heap\'s keep box', () => {
  const A = spots('stash-close').near, I = info()['stash-close'];
  const plain = render('stash-close');
  assert.ok(plain.keep.length >= 1, 'the heap is kept clear of lettering');
  const heap = plain.keep[plain.keep.length - 1];
  assert.ok(heap.x * 16 <= I.heap.x0 && (heap.x + heap.w) * 16 >= Math.min(1600, I.heap.x1) - 1 && heap.y * 10 <= I.heap.top && (heap.y + heap.h) * 10 >= Math.min(1000, I.heap.base) - 1, 'the keep box is the heap: ' + JSON.stringify(heap));
  for (const look of [LOOK, SHE]) for (const pose of ['crouch', 'sit', 'pawup', 'stand', 'walk', 'lookup', 'loaf', 'lie', 'peer', 'flat']) {
    const m = { who: 'player', at: 'near', pose, mood: 'wonder' }, r = render('stash-close', {}, [m], ['night'], look), h = r.heads[0], label = pose + ' ' + look.sex;
    assert.ok(h && h.x > 0 && h.x < 100 && h.y > 0 && h.y < 100, label + ': her head point in the panel: ' + JSON.stringify(h));
    const k = r.keep[r.keep.length - 1];
    assert.ok(!(h.x >= k.x && h.x <= k.x + k.w && h.y >= k.y && h.y <= k.y + k.h), label + ': off the heap\'s keep box');
    const b = bigOne(r.svg, m, look);
    assert.ok(b.body[0] < 0 || b.body[3] > 1000, label + ': bigger than the panel: ' + b.body.map(Math.round));
    assert.ok(b.head[2] < I.heap.x0 + 60, label + ': her face clear of the heap');
    assert.ok(Math.abs(h.x - 4) < 0.5 && Math.abs(h.y - 72.4) < 0.5, label + ': her head point where it always is: ' + JSON.stringify(h));
  }
  // leaning in (crouched), only a corner of her face, and a forepaw at the bottom-left
  const m = { who: 'player', at: 'near', pose: 'crouch' }, b = bigOne(render('stash-close', {}, [m]).svg, m);
  assert.ok(b.head[0] < 0 && b.head[2] < 560 && b.body[3] > 940 && b.body[3] < 1000, 'the corner of her face and a forepaw at the left edge: ' + b.head.map(Math.round) + ' / ' + b.body.map(Math.round));
  assert.ok(A.x < 0 && A.h > 1000, 'the spot itself is off the panel\'s left edge, a cat bigger than the panel');
});

test('keep: the rails on the bank (where the fox trots), the rows and the heap in the stash, the heap close; nothing in the tunnel', () => {
  for (const cam of SKY) {
    const R = info()[COMP[cam]].rails, k = render(cam).keep;
    assert.ok(k.some((b) => b.x === 0 && b.w === 100 && b.y * 10 <= R.near[1] - R.gap && (b.y + b.h) * 10 >= R.near[0]), cam + ': the rails band: ' + JSON.stringify(k));
  }
  const s = render('stash').keep, I = info().stash;
  assert.equal(s.length, 3, 'stash: two rows and the heap');
  I.rows.forEach((R, i) => assert.ok(s[i].y * 10 < R.y && (s[i].y + s[i].h) * 10 >= R.y, 'row ' + i + ' kept'));
  assert.ok(s[2].x * 16 <= I.heap.x0 && (s[2].x + s[2].w) * 16 >= I.heap.x1, 'the heap kept');
  for (const cam of TUNNEL) assert.deepEqual(render(cam, { tight: true, worm: true }).keep, [], cam + ': nothing to keep clear');
});

test('the stash: mice and voles in tidy rows, about a third of them muddy underneath, every eye shut; a heap of flat clear glass beside them, glittering; moonlight from the mouth', () => {
  const svg = render('stash').svg, I = info().stash, prey = group(svg, 'data-art="prey"');
  const total = I.rows.reduce((t, R) => t + R.count, 0), muddy = I.rows.reduce((t, R) => t + R.mud.length, 0);
  assert.ok(total >= 10, 'rows of them: ' + total);
  assert.ok(muddy / total > 0.25 && muddy / total < 0.45, 'about a third muddy: ' + muddy + ' of ' + total);
  assert.equal(+/data-muddy="(\d+)"/.exec(prey)[1], muddy);
  // the same piece again over each muddy one, darkened, clipped to its belly and feet
  assert.equal((prey.match(/clip-path="url\(#[^)]+trmudrow\d\)"/g) || []).length, I.rows.filter((R) => R.mud.length).length);
  // every piece the pile's own prey (eyes shut: no round eye, no red)
  const n = (prey.match(/translate\(12 12\)|scale\(-1 1\) translate\(12 12\)/g) || []).length;
  assert.equal(n, total + muddy, 'every piece drawn by PC.art.prey (and the muddy ones twice)');
  assert.ok(!/#[cC][cC]0000|#[fF][fF]0000|red/.test(prey), 'no blood');
  // tidy: one facing, evenly spaced, each row on one line
  I.rows.forEach((R, ri) => { assert.ok(R.step > 0 && R.count > 4, 'row ' + ri); });
  assert.ok(I.rows[0].x + I.rows[0].step * (I.rows[0].count - 1) < I.heap.x0, 'the heap beside them, on the right');
  // the glass: clear pieces with a pale blue-green edge, white shine, twinkling stars of light
  const heap = group(svg, 'data-art="glass-heap"');
  assert.ok((heap.match(/fill="#E2F6EC"/g) || []).length >= 20, 'many clear pieces');
  assert.ok(heap.includes('stroke="#8ED4B2"') && heap.includes('stroke="#FFFFFF"'), 'a pale blue-green edge and a white shine (the "scale"\'s look)');
  assert.ok((heap.match(/class="pcs-tw"/g) || []).length >= 5, 'glittering');
  assert.ok(svg.includes('data-art="mouth"') && svg.includes('data-art="moonlight"'), 'the mouth at the left, its shaft of moonlight');
  // close: the same glass, one big piece in front
  const close = render('stash-close').svg;
  assert.ok(group(close, 'data-art="glass-heap"').includes('stroke="#3E9273"'), 'stash-close: the big piece in front');
});

test('fork: a small cat\'s way where it splits: the roof low over her ears, two small ways on, flat on the floor, unequal and offset, a root hanging between them above her ears; `worm: true` puts one pink worm out of the left way\'s wall just in front of her nose; nothing in it a face', () => {
  const I = info().fork, [L, R] = I.ways, A = spots('fork'), a1 = A['fork-1'];
  // the ways: either side of the split, the root between them; each a doorway flat on the floor (its base on the
  // floor line), not a round hole; unequal and offset, so the two never read as a pair of eyes
  assert.ok(L.cx + L.rx < a1.x && R.cx - R.rx > a1.x && I.root.x > L.cx + L.rx && I.root.x < R.cx - R.rx, 'the cat and the root between the two ways');
  for (const W of [L, R]) assert.ok(Math.abs(W.base - I.floor) < 26 && W.base > W.cy, 'flat on the floor: ' + JSON.stringify(W));
  assert.ok(Math.abs(L.rx - R.rx) > 8 && Math.abs(L.base - R.base) > 8 && Math.abs((L.cy - L.ry) - (R.cy - R.ry)) > 4, 'unequal and offset');
  assert.ok(render('fork').svg.includes('data-art="ways"'), 'drawn as ways');
  for (const look of [LOOK, SHE]) for (const facing of ['left', 'right']) {
    const c = { who: 'player', at: 'fork-1', pose: 'crouch', facing }, f = { who: 'riffle', at: 'fork-2', pose: 'scramble' };
    const r = render('fork', { worm: true }, [c, f], ['night'], look), svg = r.svg, bc = boxes(svg, c, a1, look), bf = boxes(svg, f, A['fork-2']);
    const tall = bc.body[3] - bc.body[1], label = facing + ' ' + look.sex;
    // small: each way about as tall as she is crouched, never much more
    for (const W of [L, R]) { const hgt = W.base - (W.cy - W.ry); assert.ok(hgt > tall * 0.6 && hgt < tall * 1.05, label + ': a way as tall as she is crouched: ' + hgt + ' vs ' + Math.round(tall)); }
    // the roof just over her ears, all along her; the root's tip above them
    for (let x = bc.body[0]; x <= bc.body[2]; x += 10) {
      const gap = bc.body[1] - I.roofAt(x);
      assert.ok(gap > 0 && gap < tall * 0.75, label + ': the roof just over her at ' + Math.round(x) + ': ' + Math.round(gap));
    }
    assert.ok(I.root.y1 < bc.body[1] - 20, label + ': the root ends above her ears: ' + I.root.y1 + ' vs ' + Math.round(bc.body[1]));
    // facing a way, her nose at its rim
    const hd = r.heads[0], hx = hd.x * 16, hy = hd.y * 10, hr = hd.r * 16, nose = facing === 'left' ? hx - hr : hx + hr;
    const rim = facing === 'left' ? L.cx + L.rx : R.cx - R.rx;
    assert.ok(Math.abs(nose - rim) < 40, label + ': her nose at the ' + facing + ' way\'s rim: ' + Math.round(nose) + ' vs ' + rim);
    // the friend behind her, clear of her and of both ways
    assert.ok(!overlap(bc.body, bf.body), label + ': the two apart');
    assert.ok(bf.head[0] > R.cx + R.rx, label + ': the friend clear of the right way');
    if (facing === 'left') {
      // the worm: out of the left way's right-hand wall, just in front of her nose, never on her face
      const d = Math.hypot(I.worm.x - hx, I.worm.y - hy);
      assert.ok(Math.abs(I.worm.x - (L.cx + L.rx)) < 20, 'out of the left way\'s wall, by her: ' + I.worm.x);
      assert.ok(d > hr && d < hr * 1.6, label + ': right in front of her face, not on it: ' + Math.round(d) + ' vs r ' + Math.round(hr));
      assert.ok(I.worm.x - I.worm.s * 1.6 > L.cx - L.rx, 'the worm in the left way\'s mouth');
    }
  }
  assert.ok(!render('fork').svg.includes('data-art="worm"'), 'no worm by default');
  assert.ok(group(render('fork', { worm: true }).svg, 'data-art="worm"').includes('#E9A0AE'), 'pink');
});

// ---------------------------------------------------------------- the gallery (dev/gallery.html)

test('the gallery: every tracks camera sampled with a cast and its options; the new extras appended after the old ones, which are untouched; the field at night, the pile\'s poke and mouth, the den\'s moon 8, glass and corners shown', () => {
  const page = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  const mine = (page.match(/<script\s+src="\.\.\/(app\/[^"]+\.js)"/g) || []).map((m) => m.match(/app\/[^"]+/)[0]);
  assert.equal(mine[mine.indexOf('app/art/sets/marsh.js') + 1], 'app/art/sets/tracks.js', 'tracks.js after marsh.js');
  assert.equal(mine[mine.indexOf('app/story/ch07.js') + 1], 'app/story/ch08.js', 'ch08.js after ch07.js');
  const js = page.slice(page.lastIndexOf('<script>') + 8, page.lastIndexOf('</script>'));
  const from = js.indexOf('// ---- a sample cast'), to = js.indexOf('// ---- panels');
  const { SAMPLES, EXTRA } = new Function(js.slice(from, to) + '\nreturn { SAMPLES: SAMPLES, EXTRA: EXTRA };')();
  // append only: chapter 7's 111 extras and every other set's samples are as they were
  const hash = (o) => crypto.createHash('sha1').update(JSON.stringify(o)).digest('hex').slice(0, 12);
  assert.equal(hash(EXTRA.slice(0, 111)), 'c7db7dfcff0e', 'the first 111 extras untouched');
  const others = Object.assign({}, SAMPLES);
  delete others.tracks;
  // chapter 9 (2026-10-25) appends SAMPLES.grove after tracks: set aside like tracks, every older set's
  // samples still hash as chapter 8 shipped them
  delete others.grove;
  assert.equal(hash(others), 'bd5a5d0d6b62', 'no other set\'s samples touched');
  const keys = Object.keys(SAMPLES);
  assert.equal(keys[keys.indexOf('tracks') + 1] === undefined || keys.slice(keys.indexOf('tracks') + 1).every((k) => ['grove'].includes(k)), true, 'SAMPLES.tracks last of chapter 8\'s, only later chapters\' sets after it');
  assert.deepEqual(Object.keys(SAMPLES.tracks), CAMS, 'a sample for every camera');
  for (const cam of CAMS) {
    const smp = SAMPLES.tracks[cam];
    assert.ok(smp.cast.length >= 1 && smp.fx.includes('night'), cam + ': a cast, at night');
    for (const m of smp.cast) assert.ok(SPOTS[cam].includes(m.at), cam + ': ' + m.at + ' is its spot');
    for (const k of Object.keys(smp.opts || {})) assert.ok(Object.prototype.hasOwnProperty.call(OPTS, k), cam + ': option ' + k);
    const sc = scene(cam, smp.opts, smp.cast, smp.fx);
    checkRender(art.render(sc, { look: LOOK }), sc, 'gallery ' + cam);
  }
  // chapter 8's extras: the ones after chapter 7's 111, up to the first of a later chapter's (chapter 9 appends its own)
  const later = EXTRA.findIndex((e, i) => i >= 111 && !/^chapter 8:/.test(e[3]));
  const added = EXTRA.slice(111, later < 0 ? undefined : later), opts = new Set(), spotsSeen = new Set();
  if (later >= 0) assert.ok(EXTRA.slice(later).every((e) => /^chapter (9|10):/.test(e[3])), 'only later chapters\' extras after chapter 8\'s');
  for (const e of added) {
    assert.ok(/^chapter 8:/.test(e[3]), 'a chapter 8 extra: ' + e[3]);
    if (e[0] !== 'tracks') continue;
    for (const [k, v] of Object.entries(e[2].opts || {})) opts.add(k + ':' + JSON.stringify(v));
    for (const m of e[2].cast || []) spotsSeen.add(m.at);
    const sc = scene(e[1], e[2].opts, e[2].cast, e[2].fx);
    checkRender(art.render(sc, { look: LOOK }), sc, 'gallery extra ' + e[3]);
  }
  for (const smp of Object.values(SAMPLES.tracks)) { for (const [k, v] of Object.entries(smp.opts || {})) opts.add(k + ':' + JSON.stringify(v)); for (const m of smp.cast) spotsSeen.add(m.at); }
  for (const want of ['moon:8', 'tap:"weeds"', 'tap:"stash"', 'tap:"glass"', 'tight:true', 'worm:true']) assert.ok(opts.has(want), 'the gallery shows ' + want);
  for (const at of ANCHORS) assert.ok(spotsSeen.has(at), 'the gallery has someone at ' + at);
  // the sets owned elsewhere, named as the spec names them
  const str = (e) => JSON.stringify(e[2]);
  const field = added.filter((e) => e[0] === 'field');
  assert.ok(field.some((e) => e[1] === 'wide' && e[2].opts.moon === 8 && e[2].opts.tap === 'path' && ['heap-1', 'heap-2', 'heap-3', 'log'].every((a) => str(e).includes('"at":"' + a + '"')) && e[2].fx.includes('night')), 'the field at night: the heap, Hail at the log, the path Tap');
  assert.ok(field.some((e) => e[1] === 'wide' && str(e).includes('"at":"fence-top"')), 'the climber on the fence top');
  assert.ok(added.some((e) => e[0] === 'pile' && e[1] === 'rear' && e[2].opts.tap === 'mouth' && str(e).includes('"at":"poke"') && e[2].fx.includes('night')), 'the pile\'s rear at night: poke and the mouth Tap');
  assert.ok(added.some((e) => e[0] === 'den' && e[2].opts.moon === 8), 'the den\'s moon: 8');
  const nest = added.find((e) => e[0] === 'den' && e[1] === 'nest' && e[2].opts.glass === true && Array.isArray(e[2].opts.bark));
  assert.ok(nest, 'her glass in her nest');
  const secret = ['sprinkle-scales', 'cant-fly', 'coil-diggers', 'my-count', 'prints-sprinkle', 'tunnel', 'stash', 'glass', 'fox-brag', 'hail-shapes'];
  assert.ok(nest[2].opts.hidden && nest[2].opts.bark.filter((b) => secret.includes(b)).length > 6, 'more than six corners under the moss');
});

// ---------------------------------------------------------------- chapters 1 to 7

test('chapters 1 to 7 never use the tracks set (it is chapter 8\'s), so none of their frames changes with it', () => {
  for (const id of ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07']) {
    const ch = PC.story && PC.story[id];
    assert.ok(ch && ch.frames, id);
    for (const [fid, f] of Object.entries(ch.frames)) assert.notEqual((f.scene || {}).set, 'tracks', id + ' ' + fid);
  }
});

test('the tunnel (`crawl`, `fork`): over the roof solid dark earth up to the top of the panel, no lighter bands in it; a lip of earth along the roof line; its roots short, just above the roof (the final review: the earth read as a far cave wall, the tunnel as a big cave)', () => {
  const lum = (h) => { const v = parseInt(h.slice(1), 16); return 0.3 * (v >> 16) + 0.59 * ((v >> 8) & 255) + 0.11 * (v & 255); };
  const solid = lum('#2A2D42');
  for (const cam of TUNNEL) {
    const svg = art.render({ set: 'tracks', cam, cast: [], fx: ['night'], opts: {} }, { look: LOOK }).svg;
    const at = svg.indexOf('data-art="earth"'), end = svg.indexOf('</g>', svg.indexOf('data-art="lip"', at));
    assert.ok(at > 0 && end > at, cam + ': the earth, with its lip');
    const earth = svg.slice(at, end);
    // its fill: one gradient, no stop lighter than the darkest earth tone
    const fills = earth.match(/fill="url\(#([^)]+)\)"/g) || [];
    assert.equal(fills.length, 1, cam + ': one fill, no bands');
    const id = fills[0].match(/#([^)]+)/)[1], grad = svg.match(new RegExp('<linearGradient id="' + id + '"[^>]*>(.*?)</linearGradient>'));
    const stops = (grad[1].match(/stop-color="(#[0-9A-Fa-f]{6})"/g) || []).map((s) => s.match(/#[0-9A-Fa-f]{6}/)[0]);
    assert.ok(stops.length >= 2 && stops.every((c) => lum(c) <= solid + 0.5), cam + ': dark all the way up: ' + stops.join(' '));
    assert.ok(!/opacity="0\.45"/.test(earth), cam + ': no strata laid over it');
    // the lip along the roof line
    const lip = earth.match(/<path d="([^"]+)"[^>]*stroke-width="([\d.]+)"[^>]*data-art="lip"/);
    assert.ok(lip && +lip[2] >= 16, cam + ': a lip of earth along the roof');
    // the roots in it: each starts no more than 160 above the roof at its x and runs down to it
    const roots = earth.match(/<path d="([^"]+)" fill="none" stroke="#5E525A"/);
    const info = art.tracksInfo()[cam], roofAt = (x) => { const R = info.roof; for (let i = 1; i < R.length; i++) if (x <= R[i][0]) return R[i - 1][1] + (R[i][1] - R[i - 1][1]) * (x - R[i - 1][0]) / (R[i][0] - R[i - 1][0]); return R[R.length - 1][1]; };
    assert.ok(roots, cam + ': roots in the earth');
    roots[1].split('M').filter(Boolean).forEach((d) => {
      const v = d.match(/-?[\d.]+/g).map(Number), x = v[0], y0 = v[1], y1 = v[v.length - 1];
      assert.ok(y0 > roofAt(x) - 160 - 1 && Math.abs(y1 - roofAt(v[v.length - 2])) < 30, cam + ': a short root above the roof at x ' + x + ': ' + y0 + '..' + y1 + ', roof ' + roofAt(x));
    });
  }
});
