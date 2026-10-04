// The Crossing at Gravelly Point (app/art/sets/crossing.js): node --test tests/set-crossing.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT, load } = require('./_load.js');

const PC = load();
const art = PC.art;
const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };

const CAMS = ['wide', 'low', 'rocks', 'raft'];
const ANCHORS = ['rock-left', 'rock-right', 'rock-high', 'shore', 'pebbles', 'raft-1', 'raft-2', 'raft-3', 'water'];
const WHO = [
  { who: 'player', pose: 'sit' }, { who: 'tallyheart', pose: 'flat' }, { who: 'clancat', variant: 3, pose: 'lookup' },
  { who: 'riffle', pose: 'juggle' }, { who: 'otter', variant: 1, pose: 'swim' }, { who: 'otter', variant: 2, pose: 'sun' },
  { who: 'otter', variant: 3, pose: 'float' }, { who: 'dog', variant: 1, pose: 'sit' }
];

// ---------------------------------------------------------------- helpers

// A small XML well-formedness check: balanced tags, quoted attributes, escaped text, <svg> at the root.
function checkXml(svg, label) {
  const stack = [];
  const re = /<[^>]*>|[^<]+/g;
  let m, first = null;
  while ((m = re.exec(svg))) {
    const tok = m[0];
    if (tok[0] !== '<') {
      assert.ok(!/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(tok), label + ': unescaped & in text');
      continue;
    }
    if (tok.startsWith('</')) {
      const name = tok.slice(2, -1).trim();
      assert.equal(stack.pop(), name, label + ': closing tag mismatch at </' + name + '>');
      continue;
    }
    const mm = /^<([a-zA-Z][\w:.-]*)((?:\s+[\w:.-]+="[^"<]*")*)\s*(\/?)>$/.exec(tok);
    assert.ok(mm, label + ': malformed tag ' + tok.slice(0, 120));
    const names = mm[2].match(/[\w:.-]+(?==")/g) || [];
    assert.equal(new Set(names).size, names.length, label + ': duplicate attribute in ' + tok.slice(0, 80));
    if (!first) first = mm[1];
    if (!mm[3]) stack.push(mm[1]);
  }
  assert.equal(stack.length, 0, label + ': unclosed tags ' + stack.slice(-3).join(', '));
  assert.equal(first, 'svg', label + ': the root element is <svg>');
}

function checkRender(r, scene, label) {
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  assert.ok(r.svg.includes('pcs-set-crossing'), label + ': drawn by the crossing set, not a fallback');
  checkXml(r.svg, label);
  const vb = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(r.svg)[1].split(/\s+/).map(Number);
  assert.ok(Math.abs(vb[2] / vb[3] - 1.6) < 0.01, label + ': 16:10 viewBox');
  assert.ok(vb[0] >= -0.5 && vb[1] >= -0.5 && vb[0] + vb[2] <= 1600.5 && vb[1] + vb[3] <= 1000.5, label + ': inside the world');
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  assert.equal(r.heads.length, (scene.cast || []).length, label + ': one head per cast member');
  r.heads.forEach((h, i) => {
    if (h === null) return;
    assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ' head ' + i + ' in range: ' + JSON.stringify(h));
  });
}

// ids differ per render (scenes.js uid, cats.js's own counter); compare the drawings without them
const strip = (svg) => svg.replace(/pcs[0-9a-z]+-/g, '').replace(/\bpc[0-9][0-9a-z]*-/g, '').replace(/pcs-cam-[a-z-]+/, '');
const info = () => art.sceneInfo('crossing');
const compOf = (cam) => info().cams[cam].comp;

// the crossing row of build.md's "Art vocabulary, chapter 2" table
function specRow() {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const raw = md.split('\n').find((l) => /^\| `crossing`/.test(l));
  assert.ok(raw, 'build.md has a crossing row');
  const cells = raw.replace(/\\\|/g, '\u0001').split('|').slice(1, -1).map((c) => c.trim());
  const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  return { cams: ticks(cells[1]), anchors: ticks(cells[2]), opts: ticks(cells[3]) };
}

// ---------------------------------------------------------------- the vocabulary

test('crossing: registered, and its vocabulary is exactly build.md\'s', () => {
  const v = art.vocab.sets.crossing;
  assert.ok(v, 'PC.art.vocab.sets.crossing');
  assert.deepEqual(v.cams, CAMS);
  assert.deepEqual(v.anchors.slice().sort(), ANCHORS.slice().sort());
  assert.deepEqual(v.opts.plane, ['none', 'high', 'low']);
  assert.ok(v.opts.pebbles.includes(true), 'pebbles: true');
  assert.equal(info().defaults.plane, 'high', 'plane defaults to high');
  assert.equal(info().label, 'the Crossing at Gravelly Point');
  const spec = specRow();
  assert.deepEqual(spec.cams, CAMS, 'build.md cameras');
  for (const a of spec.anchors) assert.ok(v.anchors.includes(a), 'build.md anchor ' + a);
  for (const o of spec.opts) {
    const [key, val] = o.split(':').map((s) => s.trim());
    assert.ok(Object.prototype.hasOwnProperty.call(v.opts, key), 'build.md option ' + key);
    if (key === 'plane' && val) for (const want of val.match(/'([a-z]+)'/g).map((q) => q.slice(1, -1))) assert.ok(v.opts.plane.includes(want), 'plane ' + want);
  }
  assert.equal(compOf('low'), 'low', 'low has its own composition');
  for (const c of ['wide', 'rocks', 'raft']) assert.equal(compOf(c), 'main', c + ' looks at the main composition');
});

// ---------------------------------------------------------------- rendering

test('crossing: every camera renders well-formed SVG with someone at each anchor', () => {
  for (const cam of CAMS) {
    for (let i = 0; i < ANCHORS.length; i++) {
      for (let j = 0; j < 3; j++) {
        const c = WHO[(i + j * 3) % WHO.length];
        const scene = { set: 'crossing', cam, cast: [Object.assign({ at: ANCHORS[i], mood: 'happy', facing: j % 2 ? 'left' : 'right' }, c)] };
        checkRender(art.render(scene, { look: LOOK }), scene, cam + ' @' + ANCHORS[i] + ' ' + c.who);
      }
    }
    // and everyone at once, with every effect
    const all = { set: 'crossing', cam, opts: { plane: 'low', pebbles: true }, cast: ANCHORS.map((at, i) => Object.assign({ at }, WHO[i % WHO.length])), fx: art.vocab.fx.slice() };
    checkRender(art.render(all, { look: LOOK }), all, cam + ' (everyone, every effect)');
  }
});

test('crossing: every option value renders in every camera, and the options change the picture', () => {
  for (const cam of CAMS) {
    const svgs = {};
    for (const plane of ['none', 'high', 'low']) {
      for (const pebbles of [true, false]) {
        const scene = { set: 'crossing', cam, opts: { plane, pebbles }, cast: [{ who: 'player', at: 'rock-left', pose: 'lookup', mood: 'wonder' }] };
        const r = art.render(scene, { look: LOOK });
        checkRender(r, scene, cam + ' ' + JSON.stringify(scene.opts));
        svgs[plane + pebbles] = strip(r.svg);
      }
    }
    assert.notEqual(svgs.lowfalse, svgs.nonefalse, cam + ': plane low draws something');
    if (cam === 'wide' || cam === 'low') assert.notEqual(svgs.highfalse, svgs.nonefalse, cam + ': plane high draws planes');
    if (compOf(cam) === 'main') assert.notEqual(svgs.nonetrue, svgs.nonefalse, cam + ': pebbles: true draws the heap');
  }
  // the default is plane: 'high'
  const a = art.render({ set: 'crossing', cam: 'wide' }).svg, b = art.render({ set: 'crossing', cam: 'wide', opts: { plane: 'high' } }).svg;
  assert.equal(strip(a), strip(b));
});

test('crossing: each time of day renders (day by default)', () => {
  for (const f of art.vocab.fx) {
    for (const cam of CAMS) {
      const scene = { set: 'crossing', cam, opts: { plane: 'low' }, cast: [{ who: 'otter', variant: 1, at: 'water', pose: 'swim' }], fx: [f] };
      checkRender(art.render(scene, { look: LOOK }), scene, cam + ' fx ' + f);
    }
  }
  const day = art.render({ set: 'crossing', cam: 'wide' }).svg, dayFx = art.render({ set: 'crossing', cam: 'wide', fx: ['day'] }).svg;
  assert.equal(strip(day), strip(dayFx), 'the Crossing is drawn by day unless the frame says otherwise');
});

test('crossing low, plane low: the airliner fills the top of the panel, round windows along its side', () => {
  const svg = art.render({ set: 'crossing', cam: 'low', opts: { plane: 'low' } }).svg;
  const none = art.render({ set: 'crossing', cam: 'low', opts: { plane: 'none' } }).svg;
  const high = art.render({ set: 'crossing', cam: 'low', opts: { plane: 'high' } }).svg;
  // the airliner: its window glass colour, and a row of round windows (relative-arc dots)
  assert.ok(svg.includes('#2B3C56') && !none.includes('#2B3C56') && !high.includes('#2B3C56'), 'only plane: low draws the big airliner');
  const g = /<g transform="translate\(([\d.-]+) ([\d.-]+)\) scale\(([\d.]+) [\d.]+\) rotate\([\d.-]+\)">/.exec(svg);
  assert.ok(g, 'the airliner group');
  const y = +g[2], k = +g[3];
  assert.ok(y < 400, 'its body sits in the top of the panel: y ' + y);
  assert.ok(k * 1000 > 1600, 'it is longer than the panel is wide: ' + k * 1000);
  const wins = /<path d="((?:M-?[\d.]+ -24a9.5 9.5 0 1 0 19 0a9.5 9.5 0 1 0 -19 0)+)"/.exec(svg);
  assert.ok(wins, 'a row of round windows');
  assert.ok(wins[1].split('M').length - 1 >= 18, 'at least 18 windows in the row');
  // at night the windows are lit
  const night = art.render({ set: 'crossing', cam: 'low', opts: { plane: 'low' }, fx: ['night'] }).svg;
  assert.ok(night.includes('#FFD98A'), 'lit windows at night');
});

// ---------------------------------------------------------------- anchors and cameras

test('crossing: every anchor sits inside the cameras that show it, and a cast member there is in the panel', () => {
  const I = info();
  const shows = {
    wide: ANCHORS, rocks: ['rock-left', 'rock-right', 'rock-high', 'shore', 'pebbles'], raft: ['raft-1', 'raft-2', 'raft-3', 'water', 'shore'],
    low: ['rock-left', 'rock-right', 'rock-high', 'shore', 'raft-1', 'raft-2', 'raft-3', 'water']
  };
  for (const cam of CAMS) {
    const box = I.cams[cam], anchors = I.anchors[box.comp];
    assert.ok(anchors, cam + ': anchors for its composition');
    for (const at of shows[cam]) {
      const a = anchors[at];
      assert.ok(a, cam + ' shows ' + at);
      assert.ok(a.x > box.x && a.x < box.x + box.w && a.y > box.y && a.y <= box.y + box.h, cam + ': ' + at + ' inside the box');
      assert.ok(a.h > 0 && a.h < box.h, cam + ': ' + at + ' has a sensible height');
      // a sitting cat there: its feet are in the panel and its head well inside it
      const r = art.render({ set: 'crossing', cam, cast: [{ who: 'clancat', at, pose: 'sit' }] });
      const h = r.heads[0];
      assert.ok(h && h.x > 3 && h.x < 97 && h.y > 3 && h.y < 92, cam + ': ' + at + ' head in the panel: ' + JSON.stringify(h));
      const feetX = (a.x - box.x) / box.w, feetY = (a.y - box.y) / box.h;
      assert.ok(feetX > 0.04 && feetX < 0.96 && feetY > 0.3 && feetY <= 1, cam + ': ' + at + ' feet in the lower panel');
    }
  }
  // every main anchor is in the wide shot; the low camera cannot see the heap of pebbles
  assert.deepEqual(Object.keys(I.anchors.main).sort(), ANCHORS.slice().sort());
  assert.equal(art.render({ set: 'crossing', cam: 'low', cast: [{ who: 'riffle', at: 'pebbles' }] }).heads[0], null, 'pebbles is out of sight from the low camera');
  // rock-high is elevated, everything else stands on rock, raft or river
  for (const comp of ['main', 'low']) for (const [k, a] of Object.entries(I.anchors[comp])) assert.equal(!!a.elev, k === 'rock-high', comp + ' ' + k + ' elev');
});

test('crossing: depth reads right (nearer is bigger; the raft otters are smaller than the cats on the rocks)', () => {
  const A = info().anchors.main;
  assert.ok(A.pebbles.h > A['rock-left'].h && A['rock-left'].h > A['rock-right'].h && A['rock-right'].h > A.shore.h, 'front to back on the rocks');
  for (const k of ['raft-1', 'raft-2', 'raft-3']) {
    assert.ok(A[k].h < A.shore.h && A[k].y < A.shore.y, k + ' is further off than the shore');
    assert.ok(A[k].x > 1000 && A[k].x < 1600, k + ' on the raft');
  }
  assert.ok(A.water.y > A['raft-2'].y && A.water.h > A['raft-2'].h, 'the swimmer is in front of the raft');
  assert.ok(A['raft-1'].x < A['raft-2'].x && A['raft-2'].x < A['raft-3'].x, 'raft-1..3 left to right');
  assert.ok(A['rock-left'].x < A['rock-right'].x && A['rock-right'].x < A.shore.x, 'the rocks run out to the shore');
});

test('crossing: whoever is at water sits in the river; nobody there, no water drawn over the panel', () => {
  for (const cam of ['wide', 'raft', 'low']) {
    const comp = compOf(cam);
    const swim = art.render({ set: 'crossing', cam, cast: [{ who: 'otter', variant: 1, at: 'water', pose: 'swim' }] }).svg;
    const dry = art.render({ set: 'crossing', cam, cast: [{ who: 'otter', variant: 1, at: 'raft-1', pose: 'sun' }] }).svg;
    assert.ok(swim.includes('-c-swim-' + comp), cam + ': the river closes over the swimmer');
    assert.ok(!dry.includes('-c-swim-'), cam + ': no swim patch when nobody swims');
    // the river patch is drawn after the swimmer (a cover): the otter's drawing comes first
    const clip = /id="(pcs[0-9a-z]+-c-swim-[a-z]+)"/.exec(swim)[1];
    const used = swim.indexOf('clip-path="url(#' + clip + ')"');
    assert.ok(used > swim.indexOf('</defs>'), cam + ': the patch is drawn in the panel');
    assert.ok(strip(swim.slice(0, used)).length > strip(dry).length * 0.5, cam + ': after the scenery and the cast');
  }
  // a cat (not swimming) sits deeper than a swimming otter, but never deep enough to cover the raft
  const deep = art.render({ set: 'crossing', cam: 'raft', cast: [{ who: 'player', at: 'water', pose: 'sit' }] }).svg;
  assert.ok(deep.includes('-c-swim-main'));
});

test('crossing: the heap of pebbles is there with pebbles: true or whenever someone is at pebbles', () => {
  const R = (opts, cast) => strip(art.render({ set: 'crossing', cam: 'rocks', opts, cast }).svg);
  const none = R({}, []), heap = R({ pebbles: true }, []);
  assert.notEqual(none, heap, 'pebbles: true draws the heap');
  const riffle = [{ who: 'riffle', at: 'pebbles', pose: 'stand' }];
  assert.equal(R({}, riffle), R({ pebbles: true }, riffle), 'someone digging at pebbles always has the heap');
  // the heap is drawn right after them (they dig in it), not behind the scenery
  const svg = art.render({ set: 'crossing', cam: 'rocks', cast: riffle }).svg;
  assert.ok(svg.length > art.render({ set: 'crossing', cam: 'rocks', cast: [{ who: 'riffle', at: 'rock-left', pose: 'stand' }] }).svg.length, 'the heap adds to the panel');
});

test('crossing: deterministic, unique ids per render, and odd input never throws', () => {
  const scene = { set: 'crossing', cam: 'low', opts: { plane: 'low' }, cast: [{ who: 'player', at: 'rock-left', pose: 'lookup' }] };
  assert.equal(strip(art.render(scene, { look: LOOK }).svg), strip(art.render(scene, { look: LOOK }).svg));
  const a = art.render(scene).svg.match(/\sid="([^"]+)"/g), b = art.render(scene).svg.match(/\sid="([^"]+)"/g);
  assert.ok(a.every((id) => !b.includes(id)), 'two panels on one page never share an id');
  for (const odd of [
    { set: 'crossing' }, { set: 'crossing', cam: 'nope' }, { set: 'crossing', cam: 'raft', opts: { plane: 'banana', pebbles: 'yes' } },
    { set: 'crossing', cam: 'wide', cast: [{ who: 'otter', at: 'nowhere' }, null, { at: { x: 700, y: 900, scale: 1 } }] }
  ]) {
    const r = art.render(odd, { look: LOOK });
    assert.ok(r.svg.startsWith('<svg') && !/NaN|undefined/.test(r.svg), JSON.stringify(odd));
  }
});
