// The tower roof set (app/art/sets/roof.js, chapter 4): node --test tests/set-roof.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['wide', 'pole', 'two', 'over', 'sky', 'paw'];   // build.md's order
const COMP = { wide: 'main', pole: 'pole', two: 'two', over: 'over', sky: 'sky', paw: 'paw' };
const ANCHORS = ['pole', 'beside', 'door'];
const OPTS = { plane: [false, true], moth: [false, true], grit: ['none', 'paws'], dew: [false, true] };   // (chapter 9: `dew`)
const TOD = ['day', 'morning', 'sunset', 'dusk', 'night'];
const FLOORED = ['wide', 'pole', 'two', 'over'];   // the cameras that see enough floor for the scratches
const PLANED = ['wide', 'pole', 'two', 'sky'];     // the cameras that can show the airplane

// ---------------------------------------------------------------- helpers (as in set-field.test.js)

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

function viewBox(svg) {
  const m = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(svg);
  assert.ok(m, 'svg has a viewBox');
  return m[1].split(/\s+/).map(Number);
}

function checkRender(r, scene, label) {
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg);
  const vb = viewBox(r.svg);
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
  return vb;
}

const render = (cam, opts, cast, fx) => art.render({ set: 'roof', cam, opts: opts || {}, cast: cast || [], fx: fx || [] }, { look: LOOK });
const count = (svg, re) => (svg.match(re) || []).length;
const at = (svg, s) => svg.indexOf(s);
const num = (v) => { const r = Math.round(v * 10) / 10; return r === 0 ? '0' : String(r); };
// where the cast member standing at world point (x, y) is drawn (scenes.js placeChar's transform)
const drawnAt = (svg, a) => svg.indexOf('<g transform="translate(' + num(a.x) + ' ' + num(a.y) + ')');
// render ids carry a per-render prefix (scenes.js) and a per-drawing counter (cats.js)
const strip = (s) => s.replace(/\bpc[0-9a-z]+-/g, '');
const info = () => art.roofInfo();
const spots = (cam) => art.sceneInfo('roof').anchors[COMP[cam]];
// the first number pair of the path that carries this attribute
function firstPoint(svg, attr) {
  const m = new RegExp('<path d="M([-\\d.]+) ([-\\d.]+)[^"]*"[^>]*' + attr).exec(svg);
  return m ? [+m[1], +m[2]] : null;
}
// every "x y" pair in a path's data (M and L only: the polylines this set draws)
function pointsOf(d) { return (d.match(/[ML]([-\d.]+) ([-\d.]+)/g) || []).map((s) => s.slice(1).split(' ').map(Number)); }
// what the dragonet's own drawing says (app/art/cats.js), when it is there
function squall(pose) {
  const c = art.character('squall', { pose, mood: 'neutral', facing: 'right' });
  return c && c.w === 250 ? c : null;   // a Clan cat's 200 box means the dragonet is not drawn yet
}

// ---------------------------------------------------------------- the vocabulary

test('build.md: the Chapter 4 section names this set\'s cameras, anchors and options', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const sec = md.slice(md.indexOf('## Chapter 4')).replace(/\s+/g, ' ');
  assert.ok(sec.length > 100, 'build.md has a Chapter 4 section');
  const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  // every name the set answers to is in the section
  const named = new Set(ticks(sec));
  assert.ok(named.has('roof'), 'the set');
  for (const k of [...CAMS, ...ANCHORS, 'plane: true', 'moth: true']) assert.ok(named.has(k), 'build.md names `' + k + '`');
  assert.ok(/`grit: 'none' \| 'paws'`/.test(sec), 'build.md names the grit option\'s two values');
  // and where it still lists them in one sentence, the lists are exactly the set's
  const m = /one new set, `roof`[^:]*: cameras ([^;]+); anchors ([^;]+); options ([^.]+)\./.exec(sec);
  if (m) {
    assert.deepEqual(ticks(m[1]), CAMS);
    assert.deepEqual(ticks(m[2]), ANCHORS);
    assert.ok(/none at the wall/.test(m[2]), 'none at the wall');
    assert.deepEqual(ticks(m[3]), ['plane: true', 'moth: true', 'grit: \'none\' | \'paws\'']);
  }
});

test('PC.art.vocab lists the roof with its cameras, anchors and options; every composition places every anchor', () => {
  const v = art.vocab.sets.roof;
  assert.ok(v, 'vocab.sets.roof');
  assert.deepEqual(v.cams, CAMS);
  // (chapter 9 adds `puddle`, on `wide` and `two` only: the spec's call; the three of chapter 4 are in every composition)
  assert.deepEqual(v.anchors.slice().sort(), ANCHORS.concat(['puddle']).sort());
  assert.deepEqual(v.opts, OPTS);
  const si = art.sceneInfo('roof');
  assert.equal(si.label, 'the tallest tower’s roof');
  assert.deepEqual(si.defaults, { grit: 'none', dew: false });
  for (const cam of CAMS) {
    assert.equal(si.cams[cam].comp, COMP[cam], cam + ' has its own composition');
    assert.deepEqual([si.cams[cam].x, si.cams[cam].y, si.cams[cam].w], [0, 0, 1600], cam + ' looks at all of it');
    const want = ANCHORS.concat(cam === 'wide' || cam === 'two' ? ['puddle'] : []);
    assert.deepEqual(Object.keys(si.anchors[COMP[cam]]).sort(), want.sort(), cam + ' has every anchor: nobody a frame names is out of sight');
  }
  assert.ok(Object.keys(si.anchors).every((c) => !Object.keys(si.anchors[c]).some((k) => /wall/.test(k))), 'no anchor at the wall');
});

test('afternoon gold by default (and for fx sunset); the other lights follow fx', () => {
  const P = art.kit.PAL;
  for (const cam of CAMS) {
    const plain = render(cam).svg;
    assert.ok(plain.includes(P.golden.sky[0]) && !plain.includes(P.day.sky[0]), cam + ': the golden sky');
    assert.ok(/#7FAADD/i.test(plain), cam + ': still blue overhead: afternoon, not sunset');
    assert.equal(strip(render(cam, {}, [], ['sunset']).svg), strip(plain), cam + ': fx sunset is the same afternoon gold');
    for (const t of ['day', 'morning', 'dusk', 'night']) {
      const s = render(cam, {}, [], [t]).svg;
      assert.ok(s.includes(P[t].sky[0]) && !s.includes(P.golden.sky[0]), cam + ': fx ' + t + ' redraws it');
    }
  }
});

// ---------------------------------------------------------------- every camera, anchor and option

test('every camera renders well-formed SVG with a cast member at each anchor, in every light and with every option', () => {
  let n = 0;
  for (const cam of CAMS) {
    for (const where of ANCHORS) {
      for (const [who, pose] of [['player', 'sit'], ['tallyheart', 'stand'], ['squall', 'hug'], ['squall', 'pawup'], ['squall', 'roar'], ['sprinkle', 'sit'], ['moth', 'fly']]) {
        const scene = { set: 'roof', cam, cast: [{ who, at: where, pose, mood: 'happy' }] };
        const r = art.render(scene, { look: LOOK });
        checkRender(r, scene, cam + ' ' + who + '/' + pose + '@' + where);
        if (who !== 'sprinkle' && who !== 'moth') assert.ok(r.heads[0], cam + ': ' + who + ' (' + pose + ') at ' + where + ' is in shot');
        n++;
      }
    }
    for (const t of TOD) {
      const scene = { set: 'roof', cam, opts: { plane: true, moth: true, grit: 'paws' }, cast: [{ who: 'squall', at: 'pole', pose: 'hug' }, { who: 'player', at: 'beside' }, { who: 'tallyheart', at: 'door' }], fx: [t] };
      const r = art.render(scene, { look: LOOK });
      checkRender(r, scene, cam + ' ' + t);
      r.heads.forEach((h, i) => assert.ok(h, cam + ' ' + t + ': ' + scene.cast[i].at + ' is in shot'));
    }
    for (const plane of OPTS.plane) for (const moth of OPTS.moth) for (const grit of OPTS.grit) {
      const scene = { set: 'roof', cam, opts: { plane, moth, grit }, cast: [] };
      checkRender(art.render(scene, { look: LOOK }), scene, cam + ' ' + JSON.stringify(scene.opts));
    }
    const odd = { set: 'roof', cam, opts: { sparrows: 3, nope: true, grit: 'sand', plane: 'low' }, cast: [], fx: art.vocab.fx.slice() };
    checkRender(art.render(odd, { look: LOOK }), odd, cam + ' with stray options and every effect');
  }
  assert.equal(n, CAMS.length * ANCHORS.length * 7);
});

test('a head at every anchor is well inside its panel, and nobody stands in anybody\'s face', () => {
  for (const cam of CAMS) {
    const A = spots(cam);
    for (const where of ANCHORS) {
      const a = A[where];
      assert.ok(a.x > 0 && a.x < 1600 && a.y > 0 && a.y <= 1000, cam + ': ' + where + ' is in the panel');
      const h = render(cam, {}, [{ who: 'clancat', at: where, pose: 'sit' }]).heads[0];
      assert.ok(h && h.x > 3 && h.x < 97 && h.y > 3 && h.y < 97, cam + ': a cat\'s head at ' + where + ' is well inside the panel: ' + JSON.stringify(h));
    }
    // the dragonet at the pole and our cat beside it: both faces clear of each other
    const r = render(cam, {}, [{ who: 'squall', at: 'pole', pose: 'sit' }, { who: 'player', at: 'beside', pose: 'sit' }]);
    const d = Math.hypot((r.heads[0].x - r.heads[1].x) * 16, (r.heads[0].y - r.heads[1].y) * 10);
    assert.ok(d > (r.heads[0].r + r.heads[1].r) * 16 * 1.1, cam + ': the two faces are apart: ' + d.toFixed(0));
    // next to the pole: on its right, except looking out over the wall, where our cat is out of the way of his claw
    assert.ok(cam === 'over' ? A.beside.x < A.pole.x : A.pole.x < A.beside.x, cam + ': `beside` is ' + (cam === 'over' ? 'left' : 'right') + ' of the pole');
    assert.ok(Math.abs(A.beside.x - A.pole.x) < 760 && Math.abs(A.beside.y - A.pole.y) < 80, cam + ': and near it');
  }
});

// ---------------------------------------------------------------- the wall, and nobody at it

test('a low wall all the way round: nobody is at it, in any camera', () => {
  const I = info();
  for (const cam of CAMS) {
    const W = I[COMP[cam]].wall, A = spots(cam), svg = render(cam).svg;
    assert.equal(count(svg, /data-part="wall"/g), 1, cam + ': the wall is drawn');
    assert.ok(W.top < W.foot && W.foot <= 1000, cam + ': the wall stands on the roof');
    for (const where of ANCHORS) {
      const a = A[where];
      assert.ok(a.y > W.foot, cam + ': ' + where + ' is on this side of the wall');
      // where the floor shows, there is roof between every spot and the wall: a good part of a cat's height
      if (FLOORED.includes(cam) || cam === 'paw') assert.ok(a.y - W.foot >= a.h * 0.25, cam + ': ' + where + ' is ' + (a.y - W.foot) + ' from the wall\'s foot, a cat there is ' + a.h + ' tall');
    }
  }
  // the wide camera shows it running round: the far wall and both sides
  const W = I.main.wall, A = spots('wide'), hz = art.roofInfo.view('main').horizon;
  for (const where of ANCHORS) assert.ok(A[where].x > 240 + 100 && A[where].x < 1360 - 100, 'wide: ' + where + ' is in the middle of the roof, well inside the far wall\'s corners');
  assert.ok(W.foot - W.top > 60 && W.foot - W.top < 140, 'wide: a low wall');
  // low, and still a wall: taller than a cat sitting beside it would be (a cat that far off is this tall)
  const catThere = A.pole.h * (W.foot - hz) / (A.pole.y - hz);
  assert.ok(W.foot - W.top > catThere * 1.1 && W.foot - W.top < catThere * 1.6, 'wide: the wall is ' + (W.foot - W.top) + ' high where a sitting cat would be ' + catThere.toFixed(0));
});

test('the wall is between everyone and the view: the floor and the wall are drawn over it, the cast over them', () => {
  for (const cam of ['wide', 'over']) {
    const A = spots(cam), svg = render(cam, {}, [{ who: 'squall', at: 'pole', pose: 'sit' }, { who: 'player', at: 'beside' }]).svg;
    const order = [at(svg, 'data-part="view"'), at(svg, 'data-part="floor"'), at(svg, 'data-part="wall"'), at(svg, 'data-part="pole"'), drawnAt(svg, A.pole), drawnAt(svg, A.beside)];
    assert.ok(order.every((v) => v > 0), cam + ': view, floor, wall, pole and both cast members are there: ' + order);
    for (let i = 1; i < order.length; i++) assert.ok(order[i] > order[i - 1], cam + ': layer ' + i + ' is over layer ' + (i - 1));
  }
});

// ---------------------------------------------------------------- the pole and its red light

test('the pole stands exactly at `pole`, behind whoever is there, as thick as the pole the dragonet hugs', () => {
  const I = info(), hug = squall('hug');
  for (const cam of CAMS) {
    const P = I[COMP[cam]].pole, a = spots(cam).pole;
    assert.equal(P.x, a.x, cam + ': the pole is at the anchor\'s x');
    assert.ok(Math.abs(P.foot - a.y) <= 12, cam + ': its foot is the anchor\'s y');
    const svg = render(cam, {}, [{ who: 'squall', at: 'pole', pose: 'hug' }]).svg;
    assert.equal(count(svg, /data-part="pole"/g), 1, cam + ': one pole');
    assert.ok(at(svg, 'data-part="pole"') < drawnAt(svg, a), cam + ': drawn before (behind) him, so his paws and tail lie over it');
    if (hug) {
      assert.ok(hug.pole && hug.pole.x === hug.w / 2, 'cats.js: the hug\'s pole is on his box\'s centre line');
      const want = hug.pole.w * a.h / 200;
      assert.ok(Math.abs(P.w - want) < 0.5, cam + ': the pole is ' + P.w.toFixed(1) + ' wide where he holds it; his drawing wants ' + want.toFixed(1));
    }
    assert.ok(P.w >= 8 && P.w < a.h * 0.12, cam + ': a pole, not a pillar: ' + P.w.toFixed(1));
  }
});

test('a small red light on top of the pole, blinking; it is in keep; the close cameras look under it', () => {
  const I = info();
  for (const cam of CAMS) {
    const P = I[COMP[cam]].pole, r = render(cam), svg = r.svg;
    if (P.r > 0) {
      assert.ok(cam === 'wide' || cam === 'sky', cam + ': the top of the pole is in shot');
      assert.equal(count(svg, /data-part="light"/g), 1, cam + ': one light');
      assert.ok(/class="pcs-blink" data-part="light"/.test(svg), cam + ': it blinks');
      assert.ok(/#FF4B3E/i.test(svg), cam + ': red');
      assert.ok(P.r <= 10, cam + ': small');
      assert.ok(P.top > 40 && P.top < P.foot - 400, cam + ': on a tall pole, inside the panel');
      const k = r.keep.find((q) => Math.abs(q.x + q.w / 2 - P.x / 16) < 2 && q.y < P.top / 10);
      assert.ok(k, cam + ': the lettering keeps off the light: ' + JSON.stringify(r.keep));
    } else {
      assert.ok(P.top < 0, cam + ': the pole runs up out of the panel');
      assert.equal(count(svg, /data-part="light"/g), 0, cam + ': no light in shot');
    }
  }
});

// ---------------------------------------------------------------- the hut, the door, the brick, the puddle

test('wide: the little hut with the roof door, propped open with a brick; a rain puddle', () => {
  const svg = render('wide').svg, A = spots('wide');
  for (const part of ['hut', 'door', 'brick', 'puddle']) assert.equal(count(svg, new RegExp('data-part="' + part + '"', 'g')), 1, 'one ' + part);
  // the brick lies on the grit at the foot of the open door, inside the panel
  const b = /data-part="brick"><ellipse[^>]*\/><rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" fill="(#[0-9a-fA-F]{6})"/.exec(svg);
  assert.ok(b, 'the brick is a small block');
  const bx = +b[1], by = +b[2], bw = +b[3], bh = +b[4];
  assert.ok(bx > 0 && bx + bw < 1600 && by > 0 && by + bh < 1000, 'in the panel');
  assert.ok(bw < 80 && bh < 40 && bw > bh, 'brick-sized: ' + bw + ' x ' + bh);
  assert.equal(b[5].toLowerCase(), '#b5553b', 'brick red, in this light');
  const door = /data-part="door"><path d="M([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)Z/.exec(svg);
  assert.ok(door, 'the door is a leaf swung out from its hinge');
  const hinge = +door[1], outer = +door[3], foot = +door[6];
  assert.ok(outer < hinge, 'swung out to the left, toward us');
  assert.ok(Math.abs(bx + bw - outer) < 30 && Math.abs(by - foot) < 30, 'the brick is at the open door\'s foot: brick ' + [bx, by] + ', door ' + [outer, foot]);
  // the door's own anchor is by the door, on the roof in front of the hut, and nowhere near the pole
  assert.ok(A.door.x > hinge && A.door.x - hinge < 260 && A.pole.x - A.door.x > 200, 'the `door` spot is beside the doorway');
  assert.ok(at(svg, 'data-part="hut"') < at(svg, 'data-part="pole"'), 'the hut is behind the pole');
  // his water
  const pud = /data-part="puddle"><path d="M([-\d.]+) ([-\d.]+)/.exec(svg);
  assert.ok(pud && +pud[2] > info().main.wall.foot, 'the puddle is on the floor');
});

test('the hut is at the left in every camera that shows it, and the `door` spot with it', () => {
  const I = info();
  for (const cam of CAMS) {
    const svg = render(cam).svg, A = spots(cam);
    assert.equal(count(svg, /data-part="hut"/g), I[COMP[cam]].hut ? 1 : 0, cam + ': hut ' + I[COMP[cam]].hut);
    if (I[COMP[cam]].hut) assert.ok(A.door.x < A.pole.x, cam + ': the door is on the hut\'s side of the pole');
  }
  assert.ok(I.main.hut && I.two.hut, 'wide and two show it');
});

// ---------------------------------------------------------------- the view beyond the wall

test('beyond the wall, small and bright: the camp behind its hedge, the river, the Old Bridge, two shiny lines of track', () => {
  const I = info();
  for (const cam of CAMS) {
    const svg = render(cam).svg, V = art.roofInfo.view(COMP[cam]);
    assert.equal(!!V, I[COMP[cam]].view, cam);
    if (!V) { assert.equal(count(svg, /data-view=/g), 0, cam + ': the close cameras show wall and sky'); continue; }
    assert.ok(cam === 'wide' || cam === 'over', cam + ' shows the view');
    for (const what of ['river', 'bridge', 'track', 'camp', 'hedge', 'towers']) assert.equal(count(svg, new RegExp('data-view="' + what + '"', 'g')), 1, cam + ': one ' + what);
    const W = I[COMP[cam]].wall;
    // all of it is over the wall's top, inside the panel
    assert.ok(V.horizon < W.top - 100, cam + ': the horizon is well above the wall');
    assert.ok(V.river[0] > V.horizon && V.river[1] < W.top, cam + ': the river');
    for (const end of [V.bridge.near, V.bridge.far]) assert.ok(end[0] > 0 && end[0] < 1600 && end[1] < W.top && end[1] > 0, cam + ': the bridge is in sight: ' + end);
    assert.ok(V.bridge.far[1] < V.river[0] + 4 && V.bridge.near[1] > V.river[1] - 12, cam + ': the bridge crosses the whole river');
    assert.ok(V.camp.x - V.camp.rx > 0 && V.camp.x + V.camp.rx < 1600 && V.camp.y - V.camp.ry > V.river[1] && V.camp.y < W.top, cam + ': the camp is this side of the river, in sight');
    assert.ok(V.hedge > V.camp.y && V.hedge <= W.top + 2, cam + ': the hedge is along the camp\'s near side');
    // the track comes off the bridge's near end and runs away to the right, past the camp and its hedge,
    // never through them; in `wide` it is all beyond the hedge, in `over` it comes down the right of the
    // picture to the wall
    assert.deepEqual(V.track[0], V.bridge.near, cam + ': the track comes off the bridge');
    const run = V.track.filter((q) => q[0] <= 1600 && q[1] <= W.top);
    assert.ok(run.length >= 3, cam + ': a good run of it is over the wall: ' + run.length + ' points');
    assert.ok(run.every((q) => q[0] > V.camp.x + V.camp.rx + 60), cam + ': it passes the camp on the right, never through it');
    if (cam === 'wide') assert.ok(run.every((q) => q[1] < V.hedge), 'wide: all of it beyond the hedge');
    const last = V.track[V.track.length - 1];
    assert.ok(last[0] > 1600 || last[1] > W.top, cam + ': it runs off the panel, or down behind the wall');
    // two lines, and far enough apart to be two
    const r1 = pointsOf((/<path d="([^"]+)"[^>]*data-rail="1"/.exec(svg) || [])[1] || ''), r2 = pointsOf((/<path d="([^"]+)"[^>]*data-rail="2"/.exec(svg) || [])[1] || '');
    assert.ok(r1.length > 8 && r1.length === r2.length, cam + ': two rails');
    const gaps = r1.map((q, i) => Math.hypot(q[0] - r2[i][0], q[1] - r2[i][1])).filter((_, i) => r1[i][0] < 1600);
    assert.ok(Math.min(...gaps) >= 5, cam + ': the rails stay two lines: ' + Math.min(...gaps).toFixed(1));
    // a glint on them, on the stretch this panel shows
    const gl = /<path d="M([-\d.]+) ([-\d.]+)[^"]*"[^>]*data-view="glint"/.exec(svg);
    assert.ok(gl && +gl[1] > 60 && +gl[1] < 1540 && +gl[2] < W.top, cam + ': the sun catches the rails, in the panel');
    const shine = /<path d="[^"]+"[^>]*stroke="(#[0-9a-fA-F]{6})"[^>]*data-rail="1"/.exec(svg)[1];
    const lum = (h) => parseInt(h.slice(1, 3), 16) * 0.3 + parseInt(h.slice(3, 5), 16) * 0.59 + parseInt(h.slice(5, 7), 16) * 0.11;
    assert.ok(lum(shine) > 235, cam + ': shiny: ' + shine);
  }
  // small in the wide camera, the picture itself in `over`
  const wide = art.roofInfo.view('main'), over = art.roofInfo.view('over');
  assert.ok(wide.camp.rx * 2 < 1600 * 0.13 && I.main.wall.top - wide.horizon < 160, 'wide: small');
  assert.ok(over.scale > wide.scale * 2.5 && I.over.wall.top - over.horizon > 480, 'over: the view fills the panel above the wall');
  assert.ok(I.over.wall.top > 640, 'over: the wall\'s top edge runs across the lower part of the panel');
});

test('over: a claw at the pole points out past the hedge to the track, never into camp', () => {
  const V = art.roofInfo.view('over'), a = spots('over').pole, sq = squall('point');
  // his claw is out in front of him, about shoulder high; the line it makes runs right, level or a little up
  const from = [a.x + a.h * 0.35, a.y - a.h * 0.5];
  let onTrack = 0;
  for (let deg = 0; deg <= 30; deg += 2) {
    const dx = Math.cos(deg * Math.PI / 180), dy = -Math.sin(deg * Math.PI / 180);
    let hitCamp = false, hitTrack = false;
    for (let t = 0; t < 1500; t += 4) {
      const x = from[0] + dx * t, y = from[1] + dy * t;
      if (Math.pow((x - V.camp.x) / (V.camp.rx * 1.05), 2) + Math.pow((y - V.camp.y) / (V.camp.ry * 1.05), 2) < 1) hitCamp = true;
      for (let i = 1; i < V.track.length; i++) {
        const p = V.track[i - 1], q = V.track[i], L = Math.hypot(q[0] - p[0], q[1] - p[1]);
        const u = Math.max(0, Math.min(1, ((x - p[0]) * (q[0] - p[0]) + (y - p[1]) * (q[1] - p[1])) / (L * L)));
        if (Math.hypot(p[0] + u * (q[0] - p[0]) - x, p[1] + u * (q[1] - p[1]) - y) < 8 && x < 1600) hitTrack = true;
      }
    }
    assert.ok(!hitCamp, 'pointing ' + deg + '° up: the line never crosses the camp');
    if (hitTrack) onTrack++;
  }
  assert.ok(onTrack >= 3, 'and the track lies where he points: ' + onTrack + ' of the lines reach it');
  // the camp is up and over his head, not ahead of him; our cat is behind him, out of the way; the
  // track comes down to the wall on the right, ahead of his claw
  assert.ok(V.camp.x - V.camp.rx > a.x && V.camp.y + V.camp.ry < from[1], 'the camp is above the wall, the track off to the right of it');
  assert.ok(spots('over').beside.x < a.x - a.h * 0.6, 'our cat is on his other side');
  const W = info().over.wall, foot = V.track.filter((q) => q[1] <= W.top + 60).pop();
  assert.ok(foot[0] > 1400 && foot[1] > W.top - 80, 'the track comes down to the wall at the right: ' + foot.map((v) => v.toFixed(0)));
  if (sq) {
    const r = render('over', {}, [{ who: 'squall', at: 'pole', pose: 'point' }, { who: 'player', at: 'beside', facing: 'right' }]);
    for (const h of r.heads) assert.ok(h && h.y * 10 > W.top, 'both of them are in front of the wall, under its top edge: the view is clear');
  }
});

// ---------------------------------------------------------------- the airplane, well above the roof

test('plane: an airplane well above the roof, never level with it or beside it', () => {
  const I = info();
  for (const cam of CAMS) {
    const C = I[COMP[cam]], off = render(cam).svg, on = render(cam, { plane: true }).svg, no = render(cam, { plane: false }).svg;
    assert.equal(count(no, /data-part="plane"/g), 0, cam + ': no airplane when told none');
    if (!PLANED.includes(cam)) {
      // looking out over the wall or down at a paw, the only sky left is level with the roof: no airplane there
      assert.equal(C.plane, null, cam + ' has no place for one');
      assert.equal(count(on, /data-part="plane"/g), 0, cam + ': never drawn');
      continue;
    }
    assert.equal(count(on, /data-part="plane"/g), 1, cam + ': one airplane with plane: true');
    assert.equal(count(off, /data-part="plane"/g), cam === 'sky' ? 1 : 0, cam + ': by default ' + (cam === 'sky' ? 'overhead (that camera is the airplane overhead)' : 'none'));
    // its lowest point (a wing tip, 13 of its units under its middle as it flies) against the roof's highest things
    const low = C.plane.y + 13 * C.plane.s, a = spots(cam).pole;
    assert.ok(low < C.wall.top - 180, cam + ': far above the wall: ' + low + ' vs ' + C.wall.top);
    if (C.pole.r > 0) assert.ok(low < C.pole.top - C.pole.r * 3 - 30, cam + ': above the red light: ' + low + ' vs ' + C.pole.top);
    // (a sitting cat's ears are 0.94 of its height up)
    assert.ok(low < a.y - a.h * 0.94 - a.h * 0.2, cam + ': well over anybody\'s head: ' + low + ' vs ears at ' + (a.y - a.h * 0.94));
    assert.ok(C.plane.y - 22 * C.plane.s > 0 && C.plane.x - 34 * C.plane.s > 0 && C.plane.x + 34 * C.plane.s < 1600, cam + ': all of it in the panel');
    assert.ok(C.plane.s >= 3, cam + ': near enough to show its windows');
    assert.ok(/stroke-dasharray="1.6 2.6"/.test(on.slice(at(on, 'data-part="plane"'), at(on, 'data-part="plane"') + 2500)), cam + ': a row of windows');
    // in the sky behind everything on the roof
    assert.ok(at(on, 'data-part="plane"') < at(on, 'data-part="floor"') && at(on, 'data-part="plane"') < at(on, 'data-part="wall"'), cam + ': behind the roof');
  }
  assert.ok(I.sky.plane.s > I.main.plane.s * 2, 'sky: the airplane is the picture');
  // sky: the page letters the roar at the top right (its first choice: from 34% across the panel, 6% to 18% down)
  // and the caption in the top left corner. The airplane flies in the upper left, all of it left of the roar
  // and under the caption's line (at [980, 188] the ROOOAAAR lay across its fuselage and its windows)
  const P = I.sky.plane;
  assert.ok(P.x + 34 * P.s < 1600 * 0.34 + 8, 'sky: left of the lettering: its tail ends at ' + (P.x + 34 * P.s));
  assert.ok(P.y - 22 * P.s > 1000 * 0.06, 'sky: under the caption’s line: its top is at ' + (P.y - 22 * P.s));
  assert.ok(P.s >= 6.6, 'sky: still big enough to be his giant dragon');
});

// ---------------------------------------------------------------- moths

test('moth: a moth or two, round the light where the light is in shot, over his head where it is not', () => {
  const I = info();
  for (const cam of CAMS) {
    assert.equal(count(render(cam).svg, /data-part="moth"/g), 0, cam + ': none by default');
    const svg = render(cam, { moth: true }, [{ who: 'squall', at: 'pole', pose: 'snap' }]).svg, a = spots(cam).pole, P = I[COMP[cam]].pole;
    assert.equal(count(svg, /data-part="moth"/g), 2, cam + ': two moths');
    assert.ok(at(svg, 'data-part="moth"') > drawnAt(svg, a), cam + ': in front of him');
    const where = [];
    const re = /data-part="moth"><g class="pcs-(?:hover|drift)"><g class="pcs-flutter"><g transform="translate\(([-\d.]+) ([-\d.]+)\)/g;
    let m;
    while ((m = re.exec(svg))) where.push([+m[1], +m[2]]);
    assert.equal(where.length, 2, cam + ': both placed');
    for (const q of where) {
      assert.ok(q[0] > 20 && q[0] < 1580 && q[1] > 20 && q[1] < 980, cam + ': in the panel: ' + q);
      if (P.r > 0) assert.ok(Math.hypot(q[0] - P.x, q[1] - P.top) < 140, cam + ': round the light: ' + q);
      else assert.ok(q[1] < a.y - a.h * 0.35, cam + ': up in the air: ' + q);
    }
  }
});

// ---------------------------------------------------------------- seven little forepaws in the grit

test('grit: \'paws\' scratches seven little forepaws in the grit, four above three, five claw marks each', () => {
  const I = info();
  for (const cam of CAMS) {
    const none = render(cam), r = render(cam, { grit: 'paws' }), svg = r.svg;
    assert.equal(count(none.svg, /data-part="grit-paws"/g), 0, cam + ': none by default');
    assert.equal(strip(render(cam, { grit: 'none' }).svg), strip(none.svg), cam + ': grit none is the default');
    if (!FLOORED.includes(cam)) {
      assert.equal(I[COMP[cam]].paws, null, cam + ' has no floor to scratch');
      assert.equal(strip(svg), strip(none.svg), cam + ': nothing drawn');
      continue;
    }
    assert.equal(count(svg, /data-part="grit-paws"/g), 1, cam + ': one group of scratches');
    assert.equal(count(svg, /data-paw="grit"/g), 7, cam + ': seven forepaws');
    assert.equal(count(svg, /data-claw="grit"/g), 35, cam + ': thirty-five claw marks');
    const paws = svg.slice(at(svg, 'data-part="grit-paws"')).split('<g data-paw="grit">').slice(1, 8);
    for (const p of paws) assert.equal(count(p.split('</g>')[0], /data-claw="grit"/g), 5, cam + ': five to a paw');
    // four above three: the palms' first points, top row then bottom row
    const ys = paws.map((p) => +/<path d="M[-\d.]+ ([-\d.]+)/.exec(p)[1]), xs = paws.map((p) => +/<path d="M([-\d.]+)/.exec(p)[1]);
    const mid = (Math.min(...ys) + Math.max(...ys)) / 2, top = ys.filter((y) => y < mid).length, bottom = ys.filter((y) => y > mid).length;
    assert.deepEqual([top, bottom], [4, 3], cam + ': four above three');
    for (let i = 1; i < 4; i++) assert.ok(xs[i] > xs[i - 1] + 10, cam + ': the top row runs left to right');
    for (let i = 5; i < 7; i++) assert.ok(xs[i] > xs[i - 1] + 10, cam + ': and the bottom row');
    // on the floor, in front of the pole, clear of the wall; and the lettering keeps off them
    const W = I[COMP[cam]].wall, G = I[COMP[cam]].paws;
    assert.ok(Math.min(...ys) > W.foot + 40 && Math.max(...ys) < 1000, cam + ': on the floor');
    assert.equal(r.keep.length, none.keep.length + 1, cam + ': one more keep area');
    const k = r.keep.find((q) => !none.keep.some((o) => o.x === q.x && o.y === q.y));
    assert.ok(Math.abs(k.x + k.w / 2 - G[0] / 16) < 2 && Math.abs(k.y + k.h / 2 - G[1] / 10) < 3, cam + ': keep is on the scratches: ' + JSON.stringify(k));
    assert.ok(k.w > 8 && k.w < 32 && k.h < 12, cam + ': and no bigger than they are: ' + JSON.stringify(k));
    // drawn on the floor: under the pole and everybody
    const A = spots(cam), cast = render(cam, { grit: 'paws' }, [{ who: 'squall', at: 'pole' }]).svg;
    assert.ok(at(cast, 'data-part="grit-paws"') > at(cast, 'data-part="floor"') && at(cast, 'data-part="grit-paws"') < drawnAt(cast, A.pole), cam + ': scratched in the floor, under his feet');
  }
});

// ---------------------------------------------------------------- the one forepaw he holds up

test('paw: close on the forepaw Squall holds up, in the middle of the panel at our cat\'s nose height, and in keep', () => {
  const sq = squall('pawup');
  if (!sq) return;   // the dragonet is drawn by app/art/cats.js
  assert.ok(sq.paw && sq.paw.r > 0, 'cats.js reports his raised forepaw');
  const a = spots('paw').pole, s = a.h / 200;
  const px = a.x + (sq.paw.x - sq.w / 2) * s, py = a.y + (sq.paw.y - sq.h) * s, pr = sq.paw.r * s;
  assert.ok(Math.abs(px - 800) < 80 && Math.abs(py - 560) < 110, 'his forepaw is in the middle of the panel: ' + [px.toFixed(0), py.toFixed(0)]);
  assert.ok(pr * 2 > 1600 * 0.11, 'and big: ' + (pr * 2).toFixed(0) + ' across');
  const r = render('paw', {}, [{ who: 'squall', at: 'pole', pose: 'pawup', mood: 'proud' }, { who: 'player', at: 'beside', pose: 'sit', mood: 'wonder' }]);
  assert.equal(count(r.svg, /data-part="forepaw"/g), 0, 'the set draws no second forepaw');
  assert.equal(r.keep.length, 1, 'one keep area: ' + JSON.stringify(r.keep));
  const k = r.keep[0];
  assert.ok(Math.abs(k.x + k.w / 2 - px / 16) < 1.5 && Math.abs(k.y + k.h / 2 - py / 10) < 4, 'on his forepaw: ' + JSON.stringify(k));
  assert.ok(k.x < (px - pr) / 16 && k.x + k.w > (px + pr) / 16 && k.y < (py - pr) / 10, 'all of it, claws and all');
  assert.ok(r.heads[0] && r.heads[1], 'both faces are in shot');
  assert.ok(Math.abs(r.heads[1].y - py / 10) < 8, 'at our cat\'s nose height: paw ' + (py / 10).toFixed(0) + '%, her head ' + r.heads[1].y + '%');
  assert.ok(r.heads[1].x > (px + pr) / 16 + 4, 'she is past the claws, not under them');
  // the same close two-shot whatever he does there; only a raised forepaw is kept
  for (const pose of ['sit', 'tall', 'hiccup']) {
    const q = render('paw', {}, [{ who: 'squall', at: 'pole', pose }, { who: 'player', at: 'beside' }]);
    assert.equal(count(q.svg, /data-part="forepaw"/g), 0, pose + ': no forepaw from the set while he is there');
    assert.deepEqual(q.keep, [], pose + ': nothing to keep');
  }
  // the other cameras do not make his paw the picture
  for (const cam of ['wide', 'two', 'pole']) assert.deepEqual(render(cam, {}, [{ who: 'squall', at: 'pole', pose: 'pawup' }]).keep.filter((q) => q.y > 30), [], cam);
});

test('paw: with nobody at the pole the set draws the forepaw itself: five claws, his colours, in keep', () => {
  const D = art.roofInfo.squallPaw, F = info().paw.forepaw;
  const r = render('paw', {}, [{ who: 'player', at: 'beside', pose: 'sit' }]), svg = r.svg;
  assert.equal(count(svg, /data-part="forepaw"/g), 1, 'one forepaw');
  assert.equal(count(svg, /data-claw="squall"/g), 5, 'five claws');
  assert.ok(count(svg, /data-paw="squall"/g) >= 6, 'a palm, five digits and a foreleg');
  assert.equal(count(svg, /data-fleck="squall"/g), 1, 'sparks on it');
  const fp = svg.slice(at(svg, 'data-part="forepaw"'));
  for (const key of ['base', 'line', 'fleck', 'claw']) assert.ok(fp.toLowerCase().includes(D[key]), 'the forepaw is ' + key + ' ' + D[key]);
  // every claw tip is above the palm (he holds it up), and nothing is drawn after the claws but the claws
  const claws = [...fp.matchAll(/<path d="([^"]+)"[^>]*data-claw="squall"/g)].map((m) => pointsOf(m[1]));
  for (const c of claws) assert.ok(Math.min(...c.map((q) => q[1])) < F.palm[1] - F.w * 0.5, 'a claw points up');
  assert.ok(!/data-paw="squall"/.test(fp.slice(fp.indexOf('data-claw="squall"'))), 'no part of the paw covers a claw');
  assert.equal(r.keep.length, 1);
  const k = r.keep[0];
  assert.ok(Math.abs(k.x + k.w / 2 - F.palm[0] / 16) < 4 && k.y < F.palm[1] / 10 && k.y + k.h > F.palm[1] / 10, 'keep is the palm and its claws: ' + JSON.stringify(k));
  assert.ok(Math.abs(r.heads[0].y - F.palm[1] / 10) < 8, 'at our cat\'s nose height');
  assert.ok(at(svg, 'data-part="forepaw"') > drawnAt(svg, spots('paw').beside), 'in front');
  // empty panel too; and never in any other camera
  assert.equal(count(render('paw').svg, /data-part="forepaw"/g), 1, 'the bare camera still has its forepaw');
  for (const cam of CAMS.filter((c) => c !== 'paw')) assert.equal(count(render(cam).svg, /data-part="forepaw"/g), 0, cam);
  // a cat sitting at the pole is not a forepaw held up
  const cat = render('paw', {}, [{ who: 'tallyheart', at: 'pole', pose: 'sit' }]);
  assert.equal(count(cat.svg, /data-part="forepaw"/g), 0);
  assert.deepEqual(cat.keep, []);
});

test('the set\'s forepaw wears Squall\'s scales as app/art/cats.js draws them', () => {
  const sq = squall('pawup');
  if (!sq) return;
  const D = art.roofInfo.squallPaw, svg = sq.svg.toLowerCase();
  for (const key of ['base', 'line', 'light', 'ridge', 'fleck', 'claw', 'clawLine']) assert.ok(svg.includes(D[key].toLowerCase()), 'cats.js still draws him with ' + key + ' ' + D[key]);
});

// ---------------------------------------------------------------- robustness

test('the same scene draws the same picture each time', () => {
  for (const cam of CAMS) {
    const s = { set: 'roof', cam, opts: { plane: true, moth: true, grit: 'paws' }, cast: [{ who: 'squall', at: 'pole', pose: 'hug' }, { who: 'player', at: 'beside' }] };
    assert.equal(strip(art.render(s, { look: LOOK }).svg), strip(art.render(s, { look: LOOK }).svg), cam);
  }
});

test('odd input never throws: unknown spots, custom spots, no character drawings at all', () => {
  const cases = [
    { set: 'roof' }, { set: 'roof', cam: 'nowhere' }, { set: 'roof', cam: 'paw', cast: [{ who: 'squall', at: 'nowhere', pose: 'pawup' }] },
    { set: 'roof', cam: 'two', cast: [{ who: 'squall', at: { x: 600, y: 900 }, pose: 'hiccup' }, { who: 'player', at: { x: 900, y: 940, h: 300 } }] },
    { set: 'roof', cam: 'paw', cast: [{ who: 'squall', at: 'pole', size: 1.4, pose: 'pawup', facing: 'left' }] },
    { set: 'roof', cam: 'over', opts: { grit: 'paws', plane: true, moth: true }, cast: [{ who: 'moth', at: 'pole' }, { who: 'sparrow', at: 'beside' }, { who: 'tallone', at: 'door' }] },
    { set: 'roof', cam: 'sky', cast: [{}, null, { who: 'nobody', at: 'pole' }] }
  ];
  for (const c of cases) checkRender(art.render(c, { look: LOOK }), { cast: (c.cast || []).filter((m) => m && typeof m === 'object') }, JSON.stringify(c));
  const keep = art.character;
  try {
    art.character = undefined;
    for (const cam of CAMS) {
      const s = { set: 'roof', cam, opts: { moth: true }, cast: [{ who: 'squall', at: 'pole', pose: 'pawup' }, { who: 'player', at: 'beside' }] };
      const r = art.render(s, { look: LOOK });
      checkRender(r, s, cam + ' placeholders only');
      assert.ok(info()[COMP[cam]].pole.w > 0, cam + ': the pole still has a width');
    }
  } finally {
    art.character = keep;
  }
  // and the pole's width comes back to the real drawing's afterwards
  const hug = squall('hug');
  if (hug) assert.ok(Math.abs(info().main.pole.w - hug.pole.w * spots('wide').pole.h / 200) < 0.5);
});

// ================================================================ chapter 9: the roof at first light, the dew
// docs/chapters/09-featherlight.spec.md, section 4, "The roof at first light", and section 7, item 2 (the fingerprints, recorded
// once from the shipped chapter 8 snapshot, commit b6a8d4f, engine 0.8.0, in a node process of its own; no test reads that tree)

const crypto = require('crypto');
const SPEC9 = path.join(ROOT, 'docs/chapters/09-featherlight.spec.md');
const strip9 = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');
const hash9 = (r) => crypto.createHash('sha1').update(strip9(r.svg) + JSON.stringify(r.keep) + JSON.stringify(r.heads)).digest('hex').slice(0, 12);
const fpCat9 = () => { const c = PC.engine.blankCat({ id: 'fingerprint', now: 0, look: LOOK }); c.name = 'Pebble'; c.petname = 'Pebble'; return c; };
// <fp9> (the recorder's code, as it ran on the snapshot)
// every roof frame of chapters 4 and 5; with `hour`, chapter 4's run again at that hour, the hour first (as chapter 9's copy does)
function frameHash9(ids, hour) {
  const E = PC.engine, cat = fpCat9(), stories = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08'].map((id) => PC.story[id]), out = {};
  for (const id of ids) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    if (!f.scene || f.scene.set !== 'roof') continue;
    let sc = E.resolveScene(f.scene, cat, stories);
    if (hour) sc = Object.assign({}, sc, { fx: [hour].concat((sc.fx || []).filter((x) => ['day', 'morning', 'sunset', 'dusk', 'night'].indexOf(x) < 0)) });
    out[id + ':' + fid + (hour ? '@' + hour : '')] = hash9(art.render(sc, { look: LOOK }));
  }
  return out;
}
// one hash per camera: every option chapters 4 and 5 gave the roof, in every light, empty and with someone at every older spot
const ROOF_OPTS9 = [{}, { plane: true }, { moth: true, grit: 'paws' }, { plane: true, moth: true, grit: 'paws' }];
function roofSweep9() {
  const info = art.sceneInfo('roof'), out = {}, WHO = ['squall', 'player', 'tallyheart'];
  for (const cam of Object.keys(info.cams)) {
    const spots9 = Object.keys(info.anchors[info.cams[cam].comp] || {}).filter((k) => k !== 'puddle');
    const cast = spots9.map((at, i) => ({ who: WHO[i % WHO.length], variant: 1 + (i % 3), pose: 'sit', at }));
    const h = crypto.createHash('sha1');
    for (const fx of [[], ['day'], ['morning'], ['sunset'], ['dusk'], ['night']]) for (const opts of ROOF_OPTS9) for (const c of [[], cast]) {
      const r = art.render({ set: 'roof', cam, fx, opts, cast: c }, { look: LOOK });
      h.update(strip9(r.svg) + JSON.stringify(r.keep) + JSON.stringify(r.heads));
    }
    out[cam] = h.digest('hex').slice(0, 16);
  }
  return out;
}
// </fp9>
const CH9_ROOF_FRAMES = {
  'ch04:f079a': '2ccee5352830', 'ch04:f080a': '6a3c47c96ac0', 'ch04:f081a': '03bdec674960', 'ch04:f082a': 'ca82e1cc4262',
  'ch04:f083a': '2dcd7d372aae', 'ch04:f084a': '142c20114901', 'ch04:f085a': '947fc73a50ec', 'ch04:f086a': 'eece02974664',
  'ch04:f087a': '786d152cd15e', 'ch04:f088a': 'e259fb105b12', 'ch04:f089a': '67b0681de070', 'ch05:f025a': '38ad418ab868',
  'ch05:f026a': 'ff8e85930f94', 'ch05:f027a': 'aa6c9ce01d75', 'ch05:f028a': 'cb818d2c5ce8', 'ch05:f029a': '16f0c30b32e6',
  'ch05:f030a': 'f8e7876adf02', 'ch05:f031a': '5fb6cfab3e56', 'ch05:f032a': '7cc2b5c588ae', 'ch05:f033a': 'b9df8983ba8c',
  'ch05:f034a': '700b372ca6ca', 'ch05:f035a': '235c42b3bd69'
};
const CH9_ROOF_MORNING = {
  'ch04:f079a@morning': 'a68d48529338', 'ch04:f080a@morning': 'b6e1ba07dec2', 'ch04:f081a@morning': 'c92c4353765e', 'ch04:f082a@morning': 'a9373f4c02eb',
  'ch04:f083a@morning': 'a28d1567e3a4', 'ch04:f084a@morning': 'd05054886ce3', 'ch04:f085a@morning': '19a5fa3ba838', 'ch04:f086a@morning': '44d186ba7174',
  'ch04:f087a@morning': '1d2f0fbb07ff', 'ch04:f088a@morning': '013d1a30f2f6', 'ch04:f089a@morning': 'f943add01588'
};
const CH9_ROOF_SWEEP = {
  'wide': '7107b5b21f0e932d', 'pole': '7ad73cd032abef01',
  'two': 'c1fe459704e67485', 'over': 'b30bf70ac22a891e',
  'sky': '6db791d7b3e2ca64', 'paw': '8ec033f261bb0224'
};

const hasCats9 = typeof art.character === 'function' && !art.character.placeholder;
// the whole of the first <g …> whose opening tag has `attr`, to its own closing tag
function groupOf9(svg, attr) {
  const i = svg.indexOf(attr);
  if (i < 0) return '';
  const start = svg.lastIndexOf('<g', i), tag = /<g[\s>]|<\/g>/g;
  let depth = 0, t;
  tag.lastIndex = start;
  while ((t = tag.exec(svg))) { depth += t[0] === '</g>' ? -1 : 1; if (depth === 0) return svg.slice(start, tag.lastIndex); }
  return '';
}
test('roof, chapter 9: every roof frame of chapters 4 and 5 draws exactly as the shipped chapter 8 drew it; chapter 4\'s run again at first light draws as the roof\'s morning always did (fingerprints)', { skip: !hasCats9 && 'no cats.js' }, () => {
  const now = frameHash9(['ch04', 'ch05']);
  assert.deepEqual(Object.keys(now).sort(), Object.keys(CH9_ROOF_FRAMES).sort(), 'the same frames visit the roof');
  for (const [k, want] of Object.entries(CH9_ROOF_FRAMES)) assert.equal(now[k], want, k + ': drawn as it was');
  const morning = frameHash9(['ch04'], 'morning');
  for (const [k, want] of Object.entries(CH9_ROOF_MORNING)) assert.equal(morning[k], want, k + ': the roof\'s morning as it was');
  assert.equal(Object.keys(morning).length, 11, 'chapter 4\'s eleven roof frames, the copy\'s');
});

test('roof, chapter 9: every camera, with every option chapters 4 and 5 gave it, in every light, empty and with someone at every older spot, is byte for byte the snapshot\'s', { skip: !hasCats9 && 'no cats.js' }, () => {
  assert.deepEqual(roofSweep9(), CH9_ROOF_SWEEP, 'recorded from the chapter 8 snapshot');
});

test('roof, chapter 9: the spec names `dew` and `puddle`; `dew` is declared, off by default, and off draws exactly what it drew', () => {
  const md = fs.readFileSync(SPEC9, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['**Option `dew: true`** (default false; every camera that shows the rain puddle)', '**Anchor `puddle`** (`wide` and `two`)'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  for (const cam of CAMS) for (const opts of [{}, { plane: true, grit: 'paws' }]) for (const fx of [[], ['morning']]) {
    assert.equal(strip(render(cam, Object.assign({ dew: false }, opts), [], fx).svg), strip(render(cam, opts, [], fx).svg), cam + ': off is nothing');
  }
});

test('roof, chapter 9: `dew: true`: the rain puddle silver, pale and bright, with tiny beads of dew on the grit round it, in every camera that shows the puddle; on the floor only; never in the sky or the forepaw\'s close-up', () => {
  const I = info(), lum9 = (h) => parseInt(h.slice(1, 3), 16) * 0.3 + parseInt(h.slice(3, 5), 16) * 0.59 + parseInt(h.slice(5, 7), 16) * 0.11;
  for (const cam of CAMS) for (const fx of [['morning'], [], ['day']]) {
    const r = render(cam, { dew: true }, [], fx), svg = r.svg, has = /data-part="puddle"/.test(svg);
    checkRender(r, { cast: [] }, cam + ' dew ' + fx);
    assert.equal(/data-part="dew"/.test(svg), has, cam + ': the dew wherever the puddle is');
    if (!has) { assert.equal(strip(svg), strip(render(cam, {}, [], fx).svg), cam + ': no puddle, nothing'); continue; }
    assert.ok(['wide', 'pole', 'two', 'over'].includes(cam), cam);
    assert.ok(svg.indexOf('data-part="dew"') > svg.indexOf('data-part="puddle"'), cam + ': over the puddle');
    const dew = groupOf9(svg, 'data-part="dew"');
    const fills = [...dew.matchAll(/ fill="(#[0-9a-fA-F]{6})"/g)].map((m) => m[1]);
    assert.ok(fills.length && fills.every((c) => lum9(c) >= 200), cam + ': silver, pale and bright: ' + fills.filter((c) => lum9(c) < 200).join(' '));
    // the beads: many tiny drops on the grit round it, every one below the wall's foot, a few twinkling
    const W = I[COMP[cam]].wall, beads = (dew.match(/a[\d.]+ [\d.]+ 0 1 0 /g) || []).length / 2;
    assert.ok(beads > 30, cam + ': beads of dew: ' + beads);
    const ys = [...dew.matchAll(/M([-\d.]+) ([-\d.]+)a/g)].map((m) => +m[2]);
    assert.ok(ys.every((y) => y > W.foot), cam + ': on the floor, never on the wall');
    assert.ok(/pcs-twk/.test(dew) && /pcs-glint/.test(dew), cam + ': catching the low sun');
  }
});

test('roof, chapter 9: `puddle` (wide and two): a cat crouched at the puddle\'s edge, her leaf at her paws on its rim; clear of the pole\'s spot and of the wall; in the middle of the roof', { skip: !hasCats9 && 'no cats.js' }, () => {
  const I = info();
  for (const cam of ['wide', 'two']) {
    const A = spots(cam), a = A.puddle, L = I[COMP[cam]], W = L.wall;
    const pq = L.puddle, px0 = pq[0] - pq[2], py0 = pq[1] - pq[3], py1 = pq[1] + pq[3];
    assert.ok(a.y - W.foot >= a.h * 0.25, cam + ': clear of the wall');
    assert.equal(a.face, 'right', cam + ': facing the puddle');
    if (cam === 'wide') assert.ok(a.x > 240 + 100 && a.x < 1360 - 100, 'wide: in the middle of the roof');
    // her crouch: her leaf at her paws on the puddle's near rim, her body off it
    const ch = art.character('player', { pose: 'crouch', mood: 'wonder', holds: 'leaf', holdAt: 'paws', facing: 'right', look: LOOK, sex: LOOK.sex }), ref = art.character('clancat', { pose: 'sit', mood: 'neutral', variant: 1 });
    const k = a.h / ref.h, leaf = [a.x + (ch.held.x - ch.w / 2) * k, a.y + (ch.held.y - ch.h) * k, ch.held.r * k];
    assert.ok(Math.abs(leaf[0] - px0) < leaf[2] * 2.5 && leaf[1] > py0 - leaf[2] && leaf[1] < py1 + leaf[2] * 2, cam + ': her leaf at the puddle\'s rim: ' + leaf.map(Math.round) + ' / ' + [px0, py0, py1].map(Math.round));
    const body = [a.x + (ch.bounds.x0 - ch.w / 2) * k, a.y + (ch.bounds.y0 - ch.h) * k, a.x + (ch.bounds.x1 - ch.w / 2) * k, a.y];
    assert.ok(body[0] < px0, cam + ': she crouches beside it, not in it');
    // clear of the pole's spot: Squall there in any of his poses, the pole itself
    const pole = A.pole, pw = L.pole.w;
    assert.ok(body[0] > pole.x + pw * 3, cam + ': clear of the pole');
    for (const pose of ['roar', 'hidden', 'sit', 'hug']) {
      const r = render(cam, { dew: true }, [{ who: 'squall', at: 'pole', pose, mood: 'shout' }, { who: 'player', at: 'puddle', pose: 'crouch', mood: 'wonder', holds: 'leaf', holdAt: 'paws' }], ['morning']);
      checkRender(r, { cast: [1, 2] }, cam + ' squall ' + pose);
      assert.ok(r.heads[1] && r.heads[1].x > 3 && r.heads[1].x < 97 && r.heads[1].y > 3, cam + ': our cat\'s face in the panel');
      if (pose !== 'hidden') assert.ok(r.heads[0] && Math.hypot((r.heads[0].x - r.heads[1].x) * 16, (r.heads[0].y - r.heads[1].y) * 10) > (r.heads[0].r + r.heads[1].r) * 16, cam + ' (' + pose + '): the two faces apart');
    }
  }
  assert.ok(!spots('pole').puddle && !spots('over').puddle && !spots('sky').puddle && !spots('paw').puddle, 'only on wide and two (the spec)');
  // (chapter 9's review, 2026-10-26) on `two`, the dew's camera, she is about Squall's size at the pole: the panel's
  // co-subject beside him, never a small figure far back behind him
  assert.ok(spots('two').puddle.h >= 0.85 * spots('two').pole.h, 'two: our cat at the puddle about his size: ' + spots('two').puddle.h + ' / ' + spots('two').pole.h);
});

test('roof, chapter 9: the dew\'s frames on `two` at first light read: the silver puddle and its beads, Squall at the pole roaring, and with `hidden` and `plane: true` his tail tip and mist ring (cats.js) and the airplane over the light', { skip: !hasCats9 && 'no cats.js' }, () => {
  const roar = render('two', { dew: true }, [{ who: 'squall', at: 'pole', pose: 'roar', mood: 'shout' }, { who: 'player', at: 'puddle', pose: 'crouch', mood: 'wonder', holds: 'leaf', holdAt: 'paws' }], ['morning']);
  assert.ok(/data-part="dew"/.test(roar.svg) && roar.heads[0] && roar.heads[1], 'roar: the dew, his face and hers');
  const hid = render('two', { dew: true, plane: true }, [{ who: 'squall', at: 'pole', pose: 'hidden', mood: 'shout' }, { who: 'player', at: 'puddle', pose: 'crouch', mood: 'wonder', holds: 'leaf', holdAt: 'paws' }], ['morning']);
  assert.ok(/data-part="dew"/.test(hid.svg) && /data-part="plane"/.test(hid.svg), 'hidden: the dew and the airplane');
  assert.ok(hid.heads[0] && hid.heads[0].x > 0 && hid.heads[0].x < 100, 'his balloon\'s tail points at the tail tip and the mist ring (cats.js\'s headBox)');
  if ((art.vocab.otherPoses.squall || []).includes('hidden')) {
    const P = spots('two').pole, ch = art.character('squall', { pose: 'hidden', mood: 'shout', facing: 'right' });
    assert.ok(ch.headBox && (ch.headBox.y1 - ch.headBox.y0) < ch.h, 'a headBox round the tail tip');
    // at the pole's foot: the tip and the mist low by the pole, not a dragonet's face up at a cat's height
    assert.ok(hid.heads[0].y * 10 > P.y - P.h * 0.9, 'low, by the pole\'s foot: ' + hid.heads[0].y);
  }
});

