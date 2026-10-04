// The Barking Field set (app/art/sets/field.js): node --test tests/set-field.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['wide', 'fence', 'dogs'];   // build.md's order
const ANCHORS = ['path-left', 'path-right', 'dog-1', 'dog-2', 'dog-3', 'field'];
const INSIDE = ['dog-1', 'dog-2', 'dog-3', 'field'];
const OUTSIDE = ['path-left', 'path-right'];
const TOD = ['day', 'morning', 'sunset', 'dusk', 'night'];

// ---------------------------------------------------------------- helpers (as in scenes.test.js)

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
  assert.ok(Math.abs(vb[2] / vb[3] - 1.6) < 0.01, label + ': 16:10 viewBox, got ' + vb.join(' '));
  assert.ok(vb[0] >= -0.5 && vb[1] >= -0.5 && vb[0] + vb[2] <= 1600.5 && vb[1] + vb[3] <= 1000.5, label + ': inside the world: ' + vb.join(' '));
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
  return vb;
}

// The fence layer's markup: everything inside <g data-part="fence"> … up to the cats in front.
function fenceAt(svg) { return svg.indexOf('data-part="fence"'); }
function wireOf(svg) {
  const i = fenceAt(svg);
  const m = /<path d="([^"]+)" fill="none"/.exec(svg.slice(i));
  return m ? m[1] : '';
}
// Where the cast member standing at world point (x, y) is drawn (scenes.js placeChar's transform).
const num = (v) => { const r = Math.round(v * 10) / 10; return r === 0 ? '0' : String(r); };
function drawnAt(svg, a) { return svg.indexOf('<g transform="translate(' + num(a.x) + ' ' + num(a.y) + ')'); }
// render ids carry a per-render prefix (scenes.js) and a per-drawing counter (cats.js)
const strip = (s) => s.replace(/\bpc[0-9a-z]+-/g, '');

// ---------------------------------------------------------------- the vocabulary

test('build.md: the field row of the chapter 2 table names exactly these cameras and anchors, no options', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const row = md.split('\n').find((l) => /^\| `field`/.test(l));
  assert.ok(row, 'build.md has a `field` row');
  const cells = row.split('|').slice(1, -1).map((c) => c.trim());
  const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  assert.deepEqual(ticks(cells[1]), CAMS);
  assert.deepEqual(ticks(cells[2]), ANCHORS);
  assert.deepEqual(ticks(cells[3]), []);
  assert.ok(/by day/.test(cells[0]), 'by day');
});

test('PC.art.vocab lists the field set with its cameras, anchors and no options', () => {
  const v = art.vocab.sets.field;
  assert.ok(v, 'vocab.sets.field');
  assert.deepEqual(v.cams, CAMS);
  assert.deepEqual(v.anchors.slice().sort(), ANCHORS.slice().sort());
  assert.deepEqual(v.opts, {});
  const info = art.sceneInfo('field');
  assert.equal(info.label, 'the Barking Field');
  assert.deepEqual(info.defaults, {});
  // every composition places every anchor, so no spot is ever out of sight in this set
  for (const cam of CAMS) {
    const comp = info.cams[cam].comp;
    assert.deepEqual(Object.keys(info.anchors[comp]).sort(), ANCHORS.slice().sort(), cam + ' (' + comp + ') has every anchor');
  }
});

test('the time of day is day by default; other palettes follow fx', () => {
  const plain = art.render({ set: 'field', cam: 'wide', cast: [] }).svg;
  const day = art.render({ set: 'field', cam: 'wide', cast: [], fx: ['day'] }).svg;
  assert.equal(strip(plain).length, strip(day).length, 'no fx draws the day palette');
  assert.ok(plain.includes(art.kit.PAL.day.sky[0]), 'the day sky');
  const night = art.render({ set: 'field', cam: 'wide', cast: [], fx: ['night'] }).svg;
  assert.ok(night.includes(art.kit.PAL.night.sky[0]) && !night.includes(art.kit.PAL.day.sky[0]), 'fx night redraws it at night');
});

// ---------------------------------------------------------------- every camera, anchor and option

test('every camera renders well-formed SVG with a cast member at each anchor, in every light', () => {
  let n = 0;
  for (const cam of CAMS) {
    for (const at of ANCHORS) {
      for (const who of ['player', 'tallyheart', 'clancat', 'dog']) {
        const pose = who === 'dog' ? 'jump' : 'sit';
        const scene = { set: 'field', cam, cast: [{ who, at, pose, mood: 'happy', variant: 1 }], fx: ['day'] };
        const r = art.render(scene, { look: LOOK });
        checkRender(r, scene, cam + ' ' + who + '@' + at);
        assert.ok(r.heads[0], cam + ': ' + who + ' at ' + at + ' is in shot');
        n++;
      }
    }
    for (const t of TOD) {
      const scene = { set: 'field', cam, cast: [{ who: 'dog', at: 'dog-1', pose: 'stand' }, { who: 'player', at: 'path-left', pose: 'walk' }], fx: [t] };
      checkRender(art.render(scene, { look: LOOK }), scene, cam + ' ' + t);
    }
    // the set has no options; any given are ignored
    const odd = { set: 'field', cam, opts: { sparrows: 3, nope: true }, cast: [], fx: art.vocab.fx.slice() };
    checkRender(art.render(odd, { look: LOOK }), odd, cam + ' with stray options and every effect');
  }
  assert.equal(n, CAMS.length * ANCHORS.length * 4);
});

test('the whole cast at once, in every camera: two cats on the path, three dogs at the wire, one far off', () => {
  for (const cam of CAMS) {
    const scene = {
      set: 'field', cam, fx: ['day'], cast: [
        { who: 'tallyheart', at: 'path-left', pose: 'walk', facing: 'right' }, { who: 'player', at: 'path-right', pose: 'sit', facing: 'left' },
        { who: 'dog', variant: 1, at: 'dog-1', pose: 'jump', facing: 'right' }, { who: 'dog', variant: 2, at: 'dog-2', pose: 'bounce' },
        { who: 'dog', variant: 3, at: 'dog-3', pose: 'howl' }, { who: 'dog', variant: 2, at: 'field', pose: 'stand' }
      ]
    };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, cam + ' full cast');
    r.heads.forEach((h, i) => assert.ok(h, cam + ': ' + scene.cast[i].at + ' is in shot'));
  }
});

test('anchors sit inside their camera boxes, heads and all', () => {
  const info = art.sceneInfo('field');
  for (const cam of CAMS) {
    const c = info.cams[cam], A = info.anchors[c.comp];
    assert.ok(A, cam + ': anchors for its composition ' + c.comp);
    for (const at of ANCHORS) {
      const a = A[at];
      assert.ok(a.x > c.x && a.x < c.x + c.w && a.y > c.y && a.y <= c.y + c.h, cam + ': ' + at + ' at ' + a.x + ',' + a.y + ' is inside ' + [c.x, c.y, c.w, c.h]);
      assert.ok(a.h > 0 && a.y - a.h >= c.y, cam + ': a cat sitting at ' + at + ' fits under the top of the panel');
      const r = art.render({ set: 'field', cam, cast: [{ who: 'clancat', at, pose: 'sit' }] });
      const h = r.heads[0];
      assert.ok(h && h.x > 3 && h.x < 97 && h.y > 3 && h.y < 97, cam + ': the head at ' + at + ' is well inside the panel: ' + JSON.stringify(h));
    }
  }
});

test('depth: the path is nearer than the wire, the wire nearer than the far field, and closer cameras draw bigger', () => {
  const A = art.sceneInfo('field').anchors;
  for (const comp of ['main', 'dogs', 'fence']) {
    const a = A[comp];
    for (const out of OUTSIDE) for (const inn of ['dog-1', 'dog-2', 'dog-3']) {
      assert.ok(a[out].y > a[inn].y && a[out].h > a[inn].h, comp + ': ' + out + ' is in front of ' + inn);
    }
    for (const inn of ['dog-1', 'dog-2', 'dog-3']) assert.ok(a[inn].y > a.field.y && a[inn].h > a.field.h, comp + ': ' + inn + ' is nearer than the far field');
  }
  assert.ok(A.dogs['dog-2'].h > A.main['dog-2'].h, 'the dogs camera is closer than the wide one');
  assert.ok(A.fence['dog-1'].h > A.main['dog-1'].h, 'the fence camera is closer than the wide one');
  assert.ok(A.main['dog-1'].x < A.main['dog-2'].x && A.main['dog-2'].x < A.main['dog-3'].x, 'dog-1 to dog-3, left to right');
  assert.ok(A.main['path-left'].x < A.main['path-right'].x && A.dogs['path-left'].x < A.dogs['path-right'].x && A.fence['path-left'].x < A.fence['path-right'].x, 'path-left is left of path-right');
});

// ---------------------------------------------------------------- the wire between them

test('the wire is drawn over whoever is in the field and under the cats on the path, in any cast order', () => {
  const info = art.sceneInfo('field');
  for (const at of INSIDE) for (const c of CAMS) assert.equal(info.anchors[info.cams[c].comp][at].z, 'behind', c + ': ' + at + ' is behind the fence');
  for (const at of OUTSIDE) for (const c of CAMS) assert.notEqual(info.anchors[info.cams[c].comp][at].z, 'behind', c + ': ' + at + ' is in front of it');
  for (const cam of CAMS) {
    const comp = info.cams[cam].comp, A = info.anchors[comp];
    // the cats are listed first, so drawing in cast order alone would put the dogs over them
    const cast = [
      { who: 'player', at: 'path-right', pose: 'sit' }, { who: 'tallyheart', at: 'path-left', pose: 'walk' },
      { who: 'dog', variant: 1, at: 'dog-1', pose: 'stand' }, { who: 'dog', variant: 2, at: 'dog-2', pose: 'sit' },
      { who: 'dog', variant: 3, at: 'dog-3', pose: 'stand' }, { who: 'dog', at: 'field', pose: 'stand' }
    ];
    const svg = art.render({ set: 'field', cam, cast, fx: ['day'] }, { look: LOOK }).svg;
    const fence = fenceAt(svg);
    assert.ok(fence > 0, cam + ': the fence layer is there');
    for (const at of INSIDE) {
      const i = drawnAt(svg, A[at]);
      assert.ok(i > 0 && i < fence, cam + ': whoever is at ' + at + ' is drawn before (under) the wire');
    }
    for (const at of OUTSIDE) {
      const i = drawnAt(svg, A[at]);
      assert.ok(i > fence, cam + ': the cat at ' + at + ' is drawn after (over) the wire');
    }
  }
});

test('fence: the first dog at the wire pushes its nose through it; the wire opens round the snout', () => {
  const base = { set: 'field', cam: 'fence', fx: ['day'] };
  const none = wireOf(art.render({ ...base, cast: [] }).svg);
  const cat = wireOf(art.render({ ...base, cast: [{ who: 'tallyheart', at: 'dog-1', pose: 'stand' }] }).svg);
  const dog = wireOf(art.render({ ...base, cast: [{ who: 'dog', variant: 1, at: 'dog-1', pose: 'stand', facing: 'left' }] }).svg);
  assert.ok(none.length > 0, 'the wire is drawn');
  assert.equal(cat, none, 'only a dog pushes through the wire');
  assert.ok(dog.length > none.length, 'the dog bends the wire round its nose');
  // the same dog in the wide shot, just standing there, leaves the wire alone
  const wideNone = wireOf(art.render({ set: 'field', cam: 'wide', cast: [] }).svg);
  const wideStand = wireOf(art.render({ set: 'field', cam: 'wide', cast: [{ who: 'dog', at: 'dog-1', pose: 'stand' }] }).svg);
  assert.equal(wideStand, wideNone, 'a standing dog does not touch the wire in the wide shot');
});

// The wire's segments, from the fence layer's first path, in world units.
function wireSegments(svg) {
  const segs = [];
  for (const run of wireOf(svg).split('M').filter(Boolean)) {
    const pts = run.split('L').map((p) => p.trim().split(/\s+/).map(Number));
    for (let i = 1; i < pts.length; i++) segs.push([pts[i - 1], pts[i]]);
  }
  return segs;
}
// How far the nearest wire is from a point.
function clearance(svg, x, y) {
  let best = Infinity;
  for (const [a, b] of wireSegments(svg)) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
    const t = L ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / L)) : 0;
    best = Math.min(best, Math.hypot(a[0] + t * dx - x, a[1] + t * dy - y));
  }
  return best;
}
// A stand-in dog drawing (the real ones are drawn elsewhere): 300 x 260, facing right, its head
// at the front; `nose` is reported only when asked.
function withStandInDog(reportNose, fn) {
  const keep = art.character;
  art.character = function (who, o) {
    if (who !== 'dog') return keep(who, o);
    const left = o && o.facing === 'left', X = (x) => (left ? 300 - x : x);
    const hb = { x0: Math.min(X(190), X(300)), y0: 0, x1: Math.max(X(190), X(300)), y1: 240 };
    const out = { svg: '<rect x="0" y="100" width="300" height="160" fill="#b08850"/>', w: 300, h: 260, head: { x: X(245), y: 110 }, headBox: hb };
    if (reportNose) out.nose = { x: X(290), y: 150 };
    return out;
  };
  try { return fn(); } finally { art.character = keep; }
}

test('fence: the wire opens round the dog\'s nose: the one it reports, else just below its head point', () => {
  const a = art.sceneInfo('field').anchors.fence['dog-1'], s = a.h / 200;   // a sitting cat's drawing is 200 tall
  const scene = { set: 'field', cam: 'fence', cast: [{ who: 'dog', at: 'dog-1', pose: 'stand', facing: 'left' }] };
  const empty = art.render({ set: 'field', cam: 'fence', cast: [] }).svg;
  // the nose this stand-in reports, facing left, in world units (feet bottom-centre at the anchor)
  const nx = a.x + (300 - 290 - 150) * s, ny = a.y + (150 - 260) * s;
  withStandInDog(true, () => {
    const svg = art.render(scene).svg;
    assert.ok(clearance(empty, nx, ny) < 45, 'without a dog, a wire runs close by: ' + clearance(empty, nx, ny).toFixed(1));
    assert.ok(clearance(svg, nx, ny) > 50, 'with the dog, the wire keeps clear of its nose: ' + clearance(svg, nx, ny).toFixed(1));
    assert.ok(clearance(svg, nx + 260, ny) < 45, 'and only there: the wire is whole further off');
  });
  withStandInDog(false, () => {
    const svg = art.render(scene).svg;
    // no nose reported: the faces look out at us, so the nose is just below the head point
    const ex = a.x + (300 - 245 - 150) * s, ey = a.y + (110 + 240 * 0.07 - 260) * s;
    assert.ok(clearance(svg, ex, ey) > 50, 'the hole is at the face: ' + clearance(svg, ex, ey).toFixed(1));
  });
});

test('keep: the lettering stays off the nose through the wire, and only there', () => {
  const r = art.render({ set: 'field', cam: 'fence', cast: [{ who: 'dog', variant: 1, at: 'dog-1', pose: 'stand', facing: 'left' }, { who: 'player', at: 'path-right' }] });
  assert.equal(r.keep.length, 1, 'one keep area');
  const k = r.keep[0];
  assert.ok(k.x >= 0 && k.y >= 0 && k.w > 2 && k.h > 2 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, 'inside the panel: ' + JSON.stringify(k));
  assert.ok(k.w < 20 && k.h < 25, 'and small: the snout, not the whole dog');
  const head = r.heads[0];
  assert.ok(Math.abs(k.x + k.w / 2 - head.x) < 12 && Math.abs(k.y + k.h / 2 - head.y) < 15, 'at the dog\'s face: ' + JSON.stringify(k) + ' head ' + JSON.stringify(head));
  for (const cam of ['wide', 'dogs']) assert.deepEqual(art.render({ set: 'field', cam, cast: [{ who: 'dog', at: 'dog-1', pose: 'jump' }] }).keep, [], cam + ': nothing to keep');
  assert.deepEqual(art.render({ set: 'field', cam: 'fence', cast: [{ who: 'player', at: 'dog-1' }] }).keep, [], 'no dog, no nose');
});

test('BOING: a dog jumping or bouncing at the fence stretches the wire and rattles the rail', () => {
  for (const cam of ['wide', 'dogs']) {
    const still = art.render({ set: 'field', cam, cast: [{ who: 'dog', at: 'dog-2', pose: 'stand' }] }).svg;
    for (const pose of ['jump', 'bounce']) {
      const svg = art.render({ set: 'field', cam, cast: [{ who: 'dog', at: 'dog-2', pose }] }).svg;
      assert.ok(wireOf(svg).length > wireOf(still).length, cam + ' ' + pose + ': the wire stretches');
      assert.ok(svg.slice(fenceAt(svg)).includes('pcs-pulse') && !still.slice(fenceAt(still)).includes('pcs-pulse'), cam + ' ' + pose + ': the rail rattles');
    }
  }
});

test('Tallwalker toys in the mud: a tennis ball and a chewed frisbee in every camera', () => {
  for (const cam of CAMS) {
    const svg = art.render({ set: 'field', cam, cast: [], fx: ['day'] }).svg;
    assert.ok(/#d6e04a/i.test(svg), cam + ': the ball');
    assert.ok(/#f5862e/i.test(svg), cam + ': the frisbee');
  }
});

test('a hollow log lies far inside the fence in every camera and light, behind the wire, clear of the far spot', () => {
  const info = art.sceneInfo('field');
  for (const cam of CAMS) for (const tod of TOD) {
    const svg = art.render({ set: 'field', cam, cast: [], fx: [tod] }).svg;
    const parts = svg.match(/data-part="log"/g) || [];
    assert.equal(parts.length, 1, cam + ' ' + tod + ': one log');
    assert.ok(svg.indexOf('data-part="log"') < svg.indexOf('data-part="fence"'), cam + ' ' + tod + ': drawn before the wire, so the wire is over it');
    if (tod !== 'day') continue;
    // where it lies: its shadow is the group's first shape, centred under it
    const m = /data-part="log"[^>]*>\s*<ellipse cx="([-\d.]+)" cy="([-\d.]+)"/.exec(svg);
    assert.ok(m, cam + ': the log has a ground shadow');
    const x = +m[1], y = +m[2], A = info.anchors[info.cams[cam].comp], far = A.field;
    assert.ok(y > far.y - far.h && y < A['dog-1'].y - A['dog-1'].h * 0.3, cam + ': far in the field, beyond the dogs at the wire: y ' + y);
    assert.ok(Math.abs(x - far.x) > far.h, cam + ': not hidden behind whoever sits at the far spot: x ' + x);
    assert.ok(x > 0 && x < 1600, cam + ': in the panel');
  }
});

// ---------------------------------------------------------------- robustness

test('the same scene draws the same picture each time', () => {
  const s = { set: 'field', cam: 'fence', cast: [{ who: 'dog', at: 'dog-1', pose: 'stand', facing: 'left' }, { who: 'player', at: 'path-right' }], fx: ['day'] };
  assert.equal(strip(art.render(s, { look: LOOK }).svg), strip(art.render(s, { look: LOOK }).svg));
});

test('odd input never throws: unknown spots, custom spots, no character drawings at all', () => {
  const cases = [
    { set: 'field' }, { set: 'field', cam: 'nowhere' }, { set: 'field', cam: 'fence', cast: [{ who: 'dog', at: 'nowhere' }] },
    { set: 'field', cam: 'dogs', cast: [{ who: 'dog', at: { x: 600, y: 700, z: 'behind' }, pose: 'jump' }] },
    { set: 'field', cam: 'fence', cast: [{ who: 'dog', at: 'dog-1', size: 2.5, pose: 'howl' }, { who: 'dog', at: 'dog-2', pose: 'jump' }] }
  ];
  for (const c of cases) checkRender(art.render(c, { look: LOOK }), { cast: c.cast || [] }, JSON.stringify(c));
  const keep = art.character;
  try {
    art.character = undefined;
    const s = { set: 'field', cam: 'fence', cast: [{ who: 'dog', at: 'dog-1', pose: 'stand' }, { who: 'player', at: 'path-left' }] };
    checkRender(art.render(s, { look: LOOK }), s, 'placeholders only');
  } finally {
    art.character = keep;
  }
});
