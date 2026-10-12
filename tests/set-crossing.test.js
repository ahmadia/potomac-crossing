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

const CAMS = ['wide', 'low', 'rocks', 'raft'];              // chapter 2's cameras
const CH5_CAMS = ['board'];                                // chapter 5: at the water's edge, the paws aboard
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
// (cats.js numbers its ids in base 36: pc9-…, pca-…, pc1b-…)
const strip = (svg) => svg.replace(/pcs-cam-[a-z-]+/, '').replace(/\bpcs?[0-9a-z]+-/g, '');
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
  // (chapter 5 adds a camera, `board`, and three options, `tuft`, `late` and `fish`: their tests are at the end)
  assert.deepEqual(v.cams, [...CAMS, ...CH5_CAMS]);
  assert.deepEqual(v.anchors.slice().sort(), ANCHORS.slice().sort());
  assert.deepEqual(Object.keys(v.opts).sort(), ['fish', 'late', 'pebbles', 'plane', 'tuft']);
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

// ================================================================ chapter 5 (docs/chapters/05-riffles-river.md, "Art needs",
// "Places from before", and "Build", "Sets and options": a `board` camera (four paws at the rocks'
// edge and the first log), the `raft` camera's `tuft: true`, Tallyheart on `rock-high`, late light)

const crypto = require('crypto');
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const stripIds = (s) => s.replace(/\bpcs?[0-9a-z]+-/g, '');
const same = (a, b) => stripIds(a) === stripIds(b);   // (assert.ok on this: a failed assert.equal would print both pictures)
const R5 = (cam, opts, cast, fx) => art.render({ set: 'crossing', cam, opts: opts || {}, cast: cast || [], fx: fx || ['day'] }, { look: LOOK });
const BOARD_ANCHORS = ['rock-left', 'rock-right', 'rock-high', 'shore', 'raft-1', 'raft-2', 'raft-3', 'water'];
// the markup of the one <g … data-art="name">…</g> (nesting counted), or ''
function groupOf(svg, name) {
  const at = svg.indexOf('data-art="' + name + '"');
  if (at < 0) return '';
  const start = svg.lastIndexOf('<g', at), re = /<g\b[^>]*>|<\/g>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(svg))) { if (m[0] === '</g>') { if (--depth === 0) return svg.slice(start, re.lastIndex); } else depth++; }
  return '';
}
// the box of every absolute point in a group's path data (its strokes and shapes are drawn in world units)
function boxOf(markup) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const d of markup.match(/ d="[^"]+"/g) || []) {
    const nums = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    for (let i = 0; i + 1 < nums.length; i += 2) { x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]); }
  }
  return { x0, y0, x1, y1 };
}

test('chapter 5: chapter 2\'s Crossing is the Crossing it was: every picture it draws here, with nobody in it, to the byte', () => {
  // sha1 of the markup (ids stripped) and the keep list, recorded from the chapter 4 build; one for each
  // different scene (camera, options, light), under the first frame that uses it
  const GOLD = {
    'ch02:f059': '435f4ffbb752', 'ch02:f060': '90ff4f98ae99', 'ch02:f061': '967f74f3f65b', 'ch02:f062': '2b251cf44b61', 'ch02:f064': '0d5bd6e2ef0a',
    'ch02:f065': 'c802a2b053db', 'ch02:f076': '9d3ee4261e40'
  };
  for (const [key, want] of Object.entries(GOLD)) {
    const [id, fid] = key.split(':'), sc = PC.story[id].frames[fid].scene;
    assert.equal(sc.set, 'crossing', key);
    const fx = (sc.fx || []).filter((f) => ['morning', 'day', 'sunset', 'dusk', 'night'].includes(f));
    const r = art.render({ set: sc.set, cam: sc.cam, opts: sc.opts, cast: [], fx }, { look: LOOK });
    assert.equal(sha(stripIds(r.svg) + JSON.stringify(r.keep)), want, key + ' (' + sc.cam + ' ' + JSON.stringify(sc.opts || {}) + '): drawn as chapter 2 drew it');
  }
  // none of chapters 2 to 4's frames here asks for anything of chapter 5's, and none draws it
  let n = 0;
  for (const id of ['ch02', 'ch03', 'ch04']) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'crossing') continue;
    n++;
    assert.ok(CAMS.includes(sc.cam), id + ' ' + fid + ': one of chapter 2\'s cameras');
    for (const k of ['tuft', 'late']) assert.ok(!(sc.opts && k in sc.opts), id + ' ' + fid + ': no ' + k);
    const svg = art.render(sc, { look: LOOK }).svg;
    assert.ok(!/pc-tap|data-art="(tuft|mooring)"/.test(svg), id + ' ' + fid + ': no tuft, no Tap');
    assert.ok(svg.includes(art.kit.PAL.day.sky[0]), id + ' ' + fid + ': by day');
  }
  assert.ok(n >= 20, 'chapter 2 visits the Crossing: ' + n);
  // chapter 5's options off are nothing at all, and chapter 2's anchors have not moved
  for (const cam of CAMS) assert.ok(same(R5(cam, { tuft: false, late: false }).svg, R5(cam, {}).svg), cam + ': tuft and late off');
  const A = info().anchors;
  assert.deepEqual([A.main['rock-left'], A.main.shore, A.main['raft-1'], A.main.water, A.low['rock-high']].map((a) => [a.x, a.y, a.h]),
    [[214, 902, 295], [940, 860, 268], [1124, 812, 192], [1400, 962, 280], [140, 820, 290]]);
});

test('chapter 5: the text\'s notes name what the set has: a `board` camera, `tuft: true` on the `raft` camera, `rock-high`, late light', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/05-riffles-river.md'), 'utf8').replace(/\s+/g, ' ');
  // (the names the notes fix, short enough to survive an editor's round on the words around them)
  for (const want of ['a `board` camera', 'four paws at the rocks’ edge and the first log', '`tuft: true`', 'Tallyheart on `rock-high`', 'late light']) assert.ok(md.includes(want), 'the notes say: ' + want);
  const v = art.vocab.sets.crossing, I = info();
  assert.ok(v.cams.includes('board'));
  assert.equal(I.cams.board.comp, 'board', 'a composition of its own');
  assert.deepEqual([I.cams.board.x, I.cams.board.y, I.cams.board.w], [0, 0, 1600], 'the whole of it');
  assert.deepEqual(v.opts.tuft, [false, true]);
  assert.deepEqual(v.opts.late, [false, true]);
  assert.deepEqual(I.defaults, { plane: 'high' }, 'no tuft and no late light unless a frame says so');
  // the board composition places every anchor a frame there could want but the heap of pebbles
  assert.deepEqual(Object.keys(I.anchors.board).sort(), BOARD_ANCHORS.slice().sort());
  assert.equal(R5('board', {}, [{ who: 'riffle', at: 'pebbles' }]).heads[0], null, 'pebbles is out of sight at the water\'s edge');
  for (const [k, a] of Object.entries(I.anchors.board)) assert.equal(!!a.elev, k === 'rock-high', 'board ' + k + ' elev');
  assert.equal(typeof art.crossingInfo, 'function');
});

test('chapter 5, board: close at the water\'s edge: the ledge at the left, the raft\'s first log at the right, deep water between, everyone in the panel', () => {
  const I = info(), A = I.anchors.board, G = art.crossingInfo().board;
  // the rocks' edge and the first log, side by side: the same cat is the same size on either, and
  // much bigger than in the wide shot (this is the panel of her four paws)
  assert.ok(Math.abs(A.shore.h - A['raft-1'].h) < 1, 'one size on the ledge and on the log');
  assert.ok(A.shore.h > I.anchors.main.shore.h * 1.5 && A['raft-1'].h > I.anchors.main['raft-1'].h * 2, 'close: ' + A.shore.h);
  assert.ok(A.shore.h / 1000 > 0.38 && A.shore.h / 1000 < 0.5, 'a cat there is about four tenths of the panel high');
  // she steps from left to right across the gap: the ledge ends, then water, then the raft begins
  assert.ok(G.ledge < G.raft.x0 - 80, 'a strip of water between the ledge and the raft: ' + (G.raft.x0 - G.ledge));
  assert.ok(A.shore.x < G.ledge && A.shore.x > G.ledge - A.shore.h * 0.5, 'shore: at the ledge\'s very edge, her front paws at the water');
  assert.ok(A['raft-1'].x > G.raft.x0 + A['raft-1'].h * 0.3, 'raft-1: aboard, all four paws on the logs');
  assert.ok(A['raft-1'].x - A.shore.x < A.shore.h * 1.2, 'one step apart');
  for (const k of ['raft-1', 'raft-2', 'raft-3']) assert.ok(A[k].y > G.raft.top && A[k].y < G.raft.bottom, k + ' stands on the deck');
  // "The raft sits low": its deck lies lower in the panel than the ledge she steps off
  assert.ok(A['raft-1'].y > A.shore.y + 15, 'the raft sits low');
  assert.ok(A['raft-1'].x < A['raft-2'].x && A['raft-2'].x < A['raft-3'].x, 'raft-1..3 left to right, the first log first');
  assert.ok(A['raft-2'].face === 'left' && A['raft-3'].face === 'left', 'whoever is further along the raft looks back at her');
  // on the rocks: one right behind her (near enough to lean to her ear), one further back, the tall rock above them
  assert.ok(A['rock-right'].x < A.shore.x && A.shore.x - A['rock-right'].x < A.shore.h * 0.75, 'rock-right: at her shoulder');
  assert.ok(A['rock-left'].h < A['rock-right'].h && A['rock-left'].y < A['rock-right'].y, 'rock-left: further back');
  assert.ok(A['rock-high'].y < A['rock-left'].y - 150 && A['rock-high'].x < A['rock-right'].x, 'rock-high: the tall rock, up at the left');
  assert.ok(A.water.x > G.raft.x0 && A.water.y > G.raft.bottom, 'the swimmer is in the river in front of the raft, never under it');
  // the horizon is about a cat's eye level: we are down at the water with her
  assert.ok(G.horizon > A.shore.y - A.shore.h - 60 && G.horizon < A.shore.y - A.shore.h * 0.6, 'at cat height: ' + G.horizon);
  // everyone, sitting or standing, has a head well inside the panel and feet in it
  for (const at of BOARD_ANCHORS) for (const m of [{ who: 'player', pose: 'sit' }, { who: 'tallyheart', pose: 'stand' }, { who: 'riffle', pose: 'stand' }, { who: 'otter', variant: 1, pose: 'stand' }]) {
    const pose = at === 'water' ? 'swim' : m.pose, cast = [Object.assign({ at }, m, { pose: m.who === 'riffle' || m.who === 'otter' ? pose : m.pose })];
    const r = R5('board', {}, cast);
    checkRender(r, { cast }, 'board @' + at + ' ' + m.who);
    const h = r.heads[0];
    assert.ok(h && h.x > 3 && h.x < 97 && h.y > 3 && h.y < 96, 'board: ' + m.who + ' at ' + at + ' in the panel: ' + JSON.stringify(h));
    assert.ok(A[at].y <= 1000 && A[at].x > 60 && A[at].x < 1540, at + ': feet in the panel');
  }
  // the tall rock's cat is whole: her box does not leave the left edge
  assert.ok(A['rock-high'].x - A['rock-high'].h * 0.42 > 0, 'rock-high: clear of the panel\'s edge');
});

test('chapter 5, board: renders with every option, light and effect, a cast at every anchor; the swimmer sits in the river', () => {
  const cast = BOARD_ANCHORS.map((at, i) => Object.assign({ at }, WHO[i % WHO.length], at === 'water' ? { who: 'otter', variant: 1, pose: 'swim' } : {}));
  for (const opts of [{}, { plane: 'none' }, { plane: 'low' }, { tuft: true }, { late: true }, { plane: 'low', tuft: true, late: true, pebbles: true }]) {
    for (const fx of [[], ['day'], ['morning'], ['sunset'], ['dusk'], ['night']]) {
      const scene = { set: 'crossing', cam: 'board', opts, cast, fx };
      const r = art.render(scene, { look: LOOK });
      checkRender(r, scene, 'board ' + JSON.stringify(opts) + ' ' + fx);
      r.heads.forEach((h, i) => assert.ok(h, 'board: ' + cast[i].at + ' in sight'));
    }
  }
  const all = { set: 'crossing', cam: 'board', opts: { plane: 'low', tuft: true }, cast, fx: art.vocab.fx.slice() };
  checkRender(art.render(all, { look: LOOK }), all, 'board (everyone, every effect)');
  for (const f of art.vocab.fx) { const one = { set: 'crossing', cam: 'board', cast: cast.slice(3, 5), fx: [f] }; checkRender(art.render(one, { look: LOOK }), one, 'board fx ' + f); }
  // only classes PC.art.css defines (and the Tap's own, pc-tap); no SMIL
  for (const m of art.render(all, { look: LOOK }).svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => {
    if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') assert.ok(art.css.includes('.' + c + '{'), 'css defines .' + c);
  });
  // the options change the picture: the big airliner with plane: 'low', small ones with 'high', none with 'none'
  const none = R5('board', { plane: 'none' }).svg, high = R5('board', { plane: 'high' }).svg, low = R5('board', { plane: 'low' }).svg;
  assert.ok(low.includes('#2B3C56') && !none.includes('#2B3C56') && !high.includes('#2B3C56'), 'only plane: low draws the big airliner');
  assert.ok(!same(high, none), 'plane: high draws its planes');
  assert.ok(same(R5('board', {}).svg, high), 'plane: high by default');
  // whoever is at `water` is in the river (the same cover as chapter 2's), and nobody else is
  const swim = R5('board', {}, [{ who: 'otter', variant: 1, at: 'water', pose: 'swim' }]).svg, dry = R5('board', {}, [{ who: 'otter', variant: 1, at: 'raft-1', pose: 'sun' }]).svg;
  assert.ok(swim.includes('-c-swim-board') && !dry.includes('-c-swim-'), 'the river closes over the swimmer only');
  // deterministic; unique ids per render
  assert.ok(same(R5('board', { tuft: true }, cast).svg, R5('board', { tuft: true }, cast).svg));
  const a = R5('board').svg.match(/\sid="([^"]+)"/g), b = R5('board').svg.match(/\sid="([^"]+)"/g);
  assert.ok(a.every((id) => !b.includes(id)), 'two panels on one page never share an id');
});

test('chapter 5, tuft: a tuft of thin brown fur caught in the raft\'s vine: on the `raft` camera, over the cast, the fur Tap\'s target, kept clear of the lettering', () => {
  const T = art.crossingInfo().tuft, I = info();
  for (const [cam, comp] of [['raft', 'main'], ['wide', 'main'], ['board', 'board']]) {
    const cast = [{ who: 'otter', variant: 1, at: 'shore', pose: 'stand' }, { who: 'player', at: 'raft-1', pose: 'sit' }];
    const r = R5(cam, { tuft: true }, cast), svg = r.svg, t = T[comp];
    checkRender(r, { cast }, cam + ' tuft');
    // one target, and it is the tuft itself: a group of class pc-tap (the page glows it and makes it flutter)
    assert.equal((svg.match(/class="pc-tap"/g) || []).length, 1, cam + ': one Tap target');
    const tuft = groupOf(svg, 'tuft'), vine = groupOf(svg, 'mooring');
    assert.ok(tuft.startsWith('<g class="pc-tap" data-art="tuft">'), cam + ': the tuft is the target');
    assert.ok(vine, cam + ': the vine it is caught in');
    // fine strands, many of them, in three browns, fanned downward from where the vine pinches them
    const strands = (tuft.match(/<path d="M[^"]+" fill="none"/g) || []);
    assert.equal(strands.length, 3, cam + ': dark, mid and pale strands');
    assert.ok((tuft.match(/M-?[\d.]+ -?[\d.]+Q/g) || []).length >= 24, cam + ': a tuft, not a twig: ' + (tuft.match(/M-?[\d.]+ -?[\d.]+Q/g) || []).length + ' strands');
    for (const col of ['#8A5B38', '#C99C6E', '#5B3A22']) assert.ok(tuft.toUpperCase().includes(col.toUpperCase()), cam + ': brown ' + col);
    const b = boxOf(tuft);
    assert.ok(Math.abs((b.x0 + b.x1) / 2 - t.x) < t.r * 0.5 && b.y0 >= t.y - t.r * 0.4 && b.y1 > t.y + t.r * 0.6 && b.y1 < t.y + t.r * 1.6, cam + ': it hangs from the vine: ' + JSON.stringify(b));
    // between the stake and the raft, on the vine, over the water's edge
    assert.ok(t.x > t.stake[0] + 10 && t.x < t.raft[0] - 10, cam + ': between the stake and the raft');
    const vb = boxOf(vine);
    assert.ok(vb.x0 <= t.stake[0] + 1 && vb.x1 >= t.raft[0] - 1, cam + ': the vine runs from the stake to the raft');
    // drawn over the cast: whoever stands at the stake never hides it
    const shore = I.anchors[comp].shore;
    const castAt = svg.indexOf('translate(' + shore.x + ' ' + shore.y + ') scale(');
    assert.ok(castAt > 0 && castAt < svg.indexOf('data-art="mooring"') && svg.indexOf('data-art="mooring"') < svg.indexOf('data-art="tuft"'), cam + ': the cast, then the vine, then the tuft');
    // what the panel is about: one keep box, round the tuft, inside the panel
    const box = I.cams[cam], inPanel = t.x > box.x && t.x < box.x + box.w && t.y > box.y && t.y < box.y + box.h;
    assert.ok(inPanel, cam + ': the tuft is in the picture');
    assert.equal(r.keep.length, 1, cam + ': kept clear of the lettering');
    const k = r.keep[0], kx = box.x + k.x / 100 * box.w, ky = box.y + k.y / 100 * box.h, kw = k.w / 100 * box.w, kh = k.h / 100 * box.h;
    assert.ok(kx < b.x0 + 2 && kx + kw > b.x1 - 2 && ky < b.y0 + 2 && ky + kh > b.y1 - 2, cam + ': the keep box holds the whole tuft');
  }
  // made for the `raft` camera: big enough there to find and to tap (the page's reach is generous beyond it)
  const raft = I.cams.raft, b = boxOf(groupOf(R5('raft', { tuft: true }).svg, 'tuft'));
  assert.ok((b.x1 - b.x0) / raft.w > 0.05 && (b.x1 - b.x0) / raft.w < 0.14, 'raft: the tuft is ' + ((b.x1 - b.x0) / raft.w * 100).toFixed(1) + '% of the panel wide');
  assert.ok((T.main.x - raft.x) / raft.w > 0.15 && (T.main.x - raft.x) / raft.w < 0.5 && (T.main.y - raft.y) / raft.h > 0.4 && (T.main.y - raft.y) / raft.h < 0.75, 'raft: in the left half, below the middle, at a cat\'s nose');
  // the same vine: slack, lying low, without the tuft; lifted taut with it (never both)
  const slack = 'M992 804Q1020 826 1056 812';
  assert.ok(R5('raft', {}).svg.includes(slack) && !R5('raft', { tuft: true }).svg.includes(slack), 'the mooring vine is lifted, not doubled');
  assert.ok(!/pc-tap|data-art="tuft"/.test(R5('raft', {}).svg) && !/pc-tap/.test(R5('raft', { tuft: false }).svg), 'no tuft unless asked');
  // the rocks camera stops just short of the raft: the tuft is at its very edge there, and still renders
  checkRender(R5('rocks', { tuft: true }), { cast: [] }, 'rocks tuft');
  // too far off from the low camera (the raft is small on the river there): nothing drawn, nothing to tap
  assert.ok(!/pc-tap|data-art="tuft"/.test(R5('low', { tuft: true }).svg), 'low: no tuft');
  // heard of, never seen: the set draws fur and a vine, and nothing of whoever left it (no eye, no paw, no print)
  assert.ok(!/data-paw|data-claw|data-print|data-art="print/.test(R5('raft', { tuft: true }).svg));
  // by night it is still there, darker
  const night = groupOf(R5('raft', { tuft: true }, [], ['night']).svg, 'tuft');
  assert.ok(night && !night.toUpperCase().includes('#C99C6E'), 'the fur takes the night');
});

test('chapter 5, late: true: late light, the last gold of the afternoon: the golden palette, a low sun, the cast in it; night stays night', () => {
  const pal = art.kit.PAL, cast = [{ who: 'player', at: 'shore', pose: 'sit' }];
  const sunY = (svg) => { const m = /<circle cx="[\d.]+" cy="([\d.]+)" r="[\d.]+" fill="url/.exec(svg); assert.ok(m, 'a sun'); return +m[1]; };
  for (const cam of [...CAMS, ...CH5_CAMS]) {
    const day = R5(cam, {}, cast, ['day']), late = R5(cam, { late: true }, cast, ['day']), dflt = R5(cam, { late: true }, cast, []);
    checkRender(late, { cast }, cam + ' late');
    assert.ok(late.svg.includes(pal.golden.sky[0]) && !late.svg.includes(pal.day.sky[0]), cam + ': the golden sky');
    assert.ok(day.svg.includes(pal.day.sky[0]) && !day.svg.includes(pal.golden.sky[0]), cam + ': by day without it');
    assert.ok(same(dflt.svg, late.svg), cam + ': the same with no light named (the Crossing\'s day)');
    assert.ok(same(R5(cam, { late: true }, cast, ['morning']).svg, late.svg), cam + ': whatever daylight the frame names');
    // the sun has come down toward the far shore (the raft camera looks below the sky by day and late alike)
    if (cam !== 'raft') assert.ok(sunY(late.svg) > sunY(day.svg) + 150, cam + ': a low sun: ' + sunY(late.svg) + ' vs ' + sunY(day.svg));
    // the cast sit in the same light: the renderer's golden wash on them
    assert.ok(/feColorMatrix type="matrix" values="1 0 0 0 0\.025 {2}0 0\.97/.test(late.svg) && !/feColorMatrix/.test(day.svg), cam + ': the cats are tinted gold');
    // heads and keep do not move with the light
    assert.deepEqual(late.heads, day.heads, cam);
    // dusk and night stay themselves; a frame's own sunset is still the sunset it was
    for (const f of ['dusk', 'night', 'sunset']) assert.ok(same(R5(cam, { late: true }, cast, [f]).svg, R5(cam, {}, cast, [f]).svg), cam + ': late changes nothing at ' + f);
  }
  // the sun comes down with the day, late light or not: low over the far shore at a frame's own sunset, going
  // behind it at dusk; by day it is where chapter 2 had it
  for (const cam of ['wide', 'low', 'rocks', 'board']) {
    const y = (fx) => sunY(R5(cam, {}, [], fx).svg);
    assert.ok(y(['sunset']) > y(['day']) + 150 && y(['dusk']) > y(['sunset']) + 80, cam + ': the sun sets: ' + [y(['day']), y(['sunset']), y(['dusk'])]);
    assert.equal(y(['sunset']), sunY(R5(cam, { late: true }, [], ['day']).svg), cam + ': late light\'s sun is the sunset\'s');
  }
  assert.deepEqual([sunY(R5('wide', {}, [], ['day']).svg), sunY(R5('low', {}, [], ['day']).svg)], [150, 120], 'chapter 2\'s high sun, by day');
  // the same rocks: nothing is moved or added, only lit (the same number of shapes by day and late)
  const count = (svg) => (svg.match(/<(path|rect|ellipse|circle)\b/g) || []).length;
  for (const cam of ['wide', 'rocks', 'raft', 'board']) assert.equal(count(R5(cam, { late: true, plane: 'none' }).svg), count(R5(cam, { plane: 'none' }).svg), cam + ': the same rocks in late light');
  // odd values are not late
  for (const odd of ['yes', 1, null, 'true']) assert.ok(same(R5('wide', { late: odd }).svg, R5('wide', {}).svg), 'late: ' + JSON.stringify(odd));
});

test('chapter 5, fish: \'spare\': the string with its two spare fish lies on the raft on the way home, where `raft-3` is; drawn only when a frame asks; nothing else moves', () => {
  const v = art.vocab.sets.crossing;
  assert.deepEqual(v.opts.fish, ['none', 'spare']);
  assert.equal(info().defaults.fish, undefined, 'none unless a frame says so');
  const fishIn = (svg) => { const i = svg.indexOf('data-part="spare-fish"'); return i < 0 ? null : svg.slice(i, svg.indexOf('data-part="fish-string"', i) + 400); };
  for (const cam of [...CAMS, ...CH5_CAMS]) {
    const cast = cam === 'low' ? [] : [{ who: 'player', at: 'raft-1', pose: 'sit', facing: 'left' }, { who: 'riffle', at: 'raft-2', pose: 'sit', facing: 'left' }];
    const plain = R5(cam, { plane: 'none', late: true }, cast), fish = R5(cam, { plane: 'none', late: true, fish: 'spare' }, cast);
    // the `low` camera (chapter 2's own composition, the raft small on the river) has no logs to lay it on
    if (cam === 'low') { assert.ok(same(plain.svg, fish.svg), 'low: no string'); continue; }
    checkRender(fish, { cast }, cam + ' fish');
    assert.ok(!plain.svg.includes('spare-fish') && fish.svg.includes('data-part="spare-fish"'), cam + ': only when asked');
    assert.equal((fish.svg.match(/data-fish="1"/g) || []).length, 2, cam + ': two fish, no more');
    assert.match(fish.svg, /data-part="fish-string" data-fish-count="2"/);
    // nothing else moves: the picture without the string is the picture as it was
    const at = fish.svg.indexOf('<g'), cut = (svg) => strip(svg);
    assert.equal(cut(fish.svg).length > cut(plain.svg).length, true);
    assert.deepEqual(fish.heads, plain.heads, cam + ': nobody moves for it');
    // odd values are no fish
    for (const odd of [true, 'strings', 1, 'none', null]) assert.ok(same(R5(cam, { plane: 'none', late: true, fish: odd }, cast).svg, plain.svg), cam + ' fish: ' + JSON.stringify(odd));
  }
  // where it lies: on the logs at `raft-3`, in both compositions, between the raft's two edges
  const A0 = info().anchors, at = (svg) => { const m = /data-part="spare-fish"[^>]*>\s*<g transform="translate\(([\d.]+) ([\d.]+)\)/.exec(svg) || /<g transform="translate\(([\d.]+) ([\d.]+)\) rotate\(-84\)"><g data-part="fish-string"/.exec(svg); assert.ok(m, 'the string is placed'); return [+m[1], +m[2]]; };
  for (const [cam, comp] of [['wide', 'main'], ['board', 'board']]) {
    const [x, y] = at(R5(cam, { plane: 'none', fish: 'spare' }, []).svg), r3 = A0[comp]['raft-3'], r2 = A0[comp]['raft-2'];
    assert.ok(x > r2.x + 60 && x < r3.x + 60 && y < r3.y && y > r3.y - r3.h * 0.3, cam + ': on the logs at raft-3: ' + [x, y]);
  }
  // the fish are the pile set's, on its string: eyes shut, a reed loop over the tails, nothing through a fish
  const str = art.prey.string({ count: 2, len: 60 });
  assert.equal((str.match(/data-fish="1"/g) || []).length, 2);
  assert.equal((art.prey.string({ count: 9, len: 60 }).match(/data-fish="1"/g) || []).length, 5, 'never more than a string holds');
  assert.equal((art.prey.string({}).match(/data-fish="1"/g) || []).length, 2, 'two unless it says');
  assert.ok(!/NaN|undefined|url\(#|\sid="/.test(str), 'no defs, no ids: it drops into any picture');
  assert.doesNotMatch(str, /#(c0392b|e74c3c|ff0000|b00)/i, 'no blood');
});

test('chapter 5: Tallyheart on the tall rock, Riffle and the ferry otters, our cat at the edge: the Crossing\'s panels render, everyone in sight', () => {
  // the text's panels on this set, as a story might stage them (the cast extras are the characters' own)
  const RIFFLE = { who: 'riffle', at: 'raft-2', pose: 'hug', mood: 'happy', holds: 'pole' }, OLD = { who: 'otter', variant: 1, at: 'rock-right', pose: 'stand', mood: 'stern' };
  const panels = [
    ['wide', {}, [RIFFLE, OLD, { who: 'otter', variant: 2, at: 'rock-left', pose: 'sit' }, { who: 'otter', variant: 3, at: 'pebbles', pose: 'sit' }, { who: 'player', at: 'shore', pose: 'sit', mood: 'wonder' }]],
    ['rocks', {}, [{ who: 'tallyheart', at: 'rock-high', pose: 'sit', mood: 'proud' }, OLD, { who: 'otter', variant: 2, at: 'rock-left', pose: 'sit' }, { who: 'player', at: 'shore', pose: 'sit' }]],
    ['board', { plane: 'none' }, [{ who: 'tallyheart', at: 'rock-right', pose: 'sit', mood: 'kind' }, { who: 'player', at: 'shore', pose: 'stand', mood: 'worried' }, Object.assign({}, RIFFLE, { at: 'raft-3' })]],
    ['board', { plane: 'none' }, [{ who: 'tallyheart', at: 'shore', pose: 'sit', mood: 'kind' }, { who: 'player', at: 'raft-1', pose: 'crouch', mood: 'scared' }, Object.assign({}, RIFFLE, { at: 'raft-2' })]],
    ['raft', { tuft: true }, [{ who: 'otter', variant: 1, at: 'shore', pose: 'stand' }, { who: 'riffle', at: 'raft-1', pose: 'stand', facing: 'left' }, { who: 'player', at: 'raft-2', pose: 'sit', facing: 'left' }]],
    ['raft', { tuft: true, late: true }, [{ who: 'player', at: 'shore', pose: 'crouch', mood: 'sniff' }, { who: 'otter', variant: 1, at: 'raft-1', pose: 'stand', facing: 'left' }]],
    ['wide', { late: true, plane: 'none' }, [OLD, { who: 'otter', variant: 2, at: 'rock-left', pose: 'sit' }, { who: 'player', at: 'shore', pose: 'sit' }, { who: 'riffle', at: 'water', pose: 'swim' }]]
  ];
  for (const [cam, opts, cast] of panels) {
    const scene = { set: 'crossing', cam, opts, cast, fx: ['day'] }, r = art.render(scene, { look: LOOK });
    checkRender(r, scene, cam + ' ' + JSON.stringify(opts));
    r.heads.forEach((h, i) => assert.ok(h && h.x > 2 && h.x < 98 && h.y > 2 && h.y < 97, cam + ': ' + cast[i].who + ' at ' + cast[i].at + ' in the panel: ' + JSON.stringify(h)));
  }
  // Tallyheart on `rock-high`: above everyone on the rocks, her whole self in the wide shot and on the rocks camera
  const I = info();
  for (const cam of ['wide', 'rocks', 'board']) {
    const comp = I.cams[cam].comp, A = I.anchors[comp], box = I.cams[cam], a = A['rock-high'];
    assert.ok(a.elev && a.y < A['rock-left'].y && a.y < A.shore.y, cam + ': up on the tall rock');
    assert.ok(a.y - a.h > box.y + 10 && a.x - a.h * 0.42 > box.x && a.x + a.h * 0.42 < box.x + box.w, cam + ': whole, in the panel');
  }
});

test('chapter 5: whatever chapter 5 puts at the Crossing renders, and its fur Tap finds the tuft (once the chapter is written)', (t) => {
  const ch = PC.story && PC.story.ch05;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'crossing' && f.board !== 'STUB.') : [];
  if (!frames.length) { t.diagnostic('chapter 5 has no frames at the Crossing yet'); return; }
  const v = art.vocab.sets.crossing;
  let taps = 0;
  for (const [id, f] of frames) {
    const sc = f.scene;
    assert.ok(v.cams.includes(sc.cam), id + ': camera ' + sc.cam);
    for (const k of Object.keys(sc.opts || {})) assert.ok(v.opts[k] && v.opts[k].includes(sc.opts[k]), id + ': ' + k + '=' + JSON.stringify(sc.opts[k]));
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc, 'ch05 ' + id);
    (sc.cast || []).forEach((m, i) => { if (typeof m.at === 'string') assert.ok(r.heads[i], id + ': ' + m.who + ' at ' + m.at + ' is in sight of the ' + sc.cam + ' camera'); });
    // a one-tap frame here is the fur: its scene carries the target, and exactly one
    if (f.scratch && f.scratch.tap) { taps++; assert.equal((r.svg.match(/class="pc-tap"/g) || []).length, 1, id + ': the Tap has its target (tuft: true on the raft camera)'); }
    // nobody but an otter is ever in the water
    for (const m of sc.cast || []) if (m.at === 'water') assert.ok(m.who === 'riffle' || m.who === 'otter', id + ': only an otter swims');
  }
  t.diagnostic(frames.length + ' frames at the Crossing, ' + taps + ' Tap');
});
