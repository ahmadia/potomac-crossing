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
const CAMS = ['wide', 'fence', 'dogs'];   // chapter 2's cameras, in build.md's order
const ANCHORS = ['path-left', 'path-right', 'dog-1', 'dog-2', 'dog-3', 'field'];
const INSIDE = ['dog-1', 'dog-2', 'dog-3', 'field'];
const OUTSIDE = ['path-left', 'path-right'];
const TOD = ['day', 'morning', 'sunset', 'dusk', 'night'];
// chapter 4: the border, the fence's far corner (build.md, "Chapter 4")
const BORDER = ['border', 'border-two', 'border-fox'];
const DOGS = ['dog-1', 'dog-2', 'dog-3'];
const FRONT = ['lead', 'left', 'right'];
const BACK = ['back-1', 'back-2', 'back-3', 'back-4'];
// (chapter 6: `grass`, Sleet's spot in the long grass just past the post, in all three border cameras)
const BORDER_ANCHORS = ['fox', ...FRONT, ...BACK, 'grass'];
// chapter 8 (docs/chapters/08-the-night-trail.spec.md, section 4): the field at night's new spots, on chapter 2's
// three compositions only (the border's three cameras unchanged)
const CH8_SPOTS = {
  main: ['heap-1', 'heap-2', 'heap-3', 'log', 'ring-1', 'ring-2', 'ring-3', 'ring-4', 'fence-top', 'trail-1', 'trail-2'],
  dogs: ['log', 'wire', 'trail-1', 'trail-2'],
  fence: ['wire']
};
const CH8_ANCHORS = [...new Set([...CH8_SPOTS.main, ...CH8_SPOTS.dogs, ...CH8_SPOTS.fence])];
// what each border camera sees: the fox's close-up leaves the four at the back out
const SEES = { border: ['fox', ...FRONT, ...BACK, ...DOGS, 'grass'], 'border-two': ['fox', ...FRONT, ...BACK, ...DOGS, 'grass'], 'border-fox': ['fox', ...FRONT, ...DOGS, 'grass'] };
// the Clan at the border, as the text has them: Glintstar in front, Tallyheart and our cat at her
// shoulders (as the panel shows them: Tallyheart between our cat and the fox), four behind
const CLAN = [{ who: 'glintstar', at: 'lead' }, { who: 'player', at: 'left' }, { who: 'tallyheart', at: 'right' },
  { who: 'grizzled', at: 'back-1' }, { who: 'snorter', at: 'back-2' }, { who: 'snorer', at: 'back-3' }, { who: 'murmurchime', at: 'back-4' }];
const FOX = { who: 'reynard', at: 'fox', pose: 'sit' };

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

test('PC.art.vocab lists the field set: chapter 2\'s cameras and anchors, the border\'s after them; the fox\'s tail, and chapter 8\'s moon and path Tap', () => {
  const v = art.vocab.sets.field;
  assert.ok(v, 'vocab.sets.field');
  assert.deepEqual(v.cams, [...CAMS, ...BORDER]);
  assert.deepEqual(v.anchors.slice().sort(), [...new Set([...ANCHORS, ...BORDER_ANCHORS, ...CH8_ANCHORS])].sort());
  // (chapter 8 adds `moon` and `tap` after chapter 4's `foxTail`, on purpose: spec section 4)
  assert.deepEqual(v.opts, { foxTail: [false, true], moon: 'number', tap: ['none', 'path'] });
  const info = art.sceneInfo('field');
  assert.equal(info.label, 'the Barking Field');
  assert.deepEqual(info.defaults, { tap: 'none' }, 'no fox tail, no moon and no Tap target unless a frame asks');
  // chapter 2's cameras each place all six of chapter 2's anchors, exactly as they did, and chapter 8's (only those)
  for (const cam of CAMS) {
    const comp = info.cams[cam].comp;
    assert.deepEqual(Object.keys(info.anchors[comp]).sort(), [...ANCHORS, ...CH8_SPOTS[comp]].sort(), cam + ' (' + comp + ') has every chapter 2 anchor and chapter 8\'s, and only those');
    assert.deepEqual(Object.keys(info.anchors[comp]).slice(0, ANCHORS.length), ANCHORS, cam + ': chapter 2\'s first, in their order (the first free spot is picked as before)');
  }
  // the border's cameras each have their own composition and place what they can see
  for (const cam of BORDER) {
    assert.equal(info.cams[cam].comp, cam, cam + ' has its own composition');
    assert.deepEqual(Object.keys(info.anchors[cam]).sort(), SEES[cam].slice().sort(), cam + ' places ' + SEES[cam].join(', '));
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
    // options that are not this set's are ignored
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

// ================================================================ chapter 4: the border

const fieldInfo = () => art.fieldInfo();
const count = (svg, re) => (svg.match(re) || []).length;
const bRender = (cam, cast, fx, opts) => art.render({ set: 'field', cam, cast: cast || [], fx: fx || ['day'], opts: opts || {} }, { look: LOOK });
// A cast member's body and head, as scenes.js will draw them at anchor `a`: [x0, y0, x1, y1] in the world.
function boxes(m, a) {
  const facing = m.facing || a.face || 'right';
  const o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing };
  if (m.who === 'player') { o.look = LOOK; o.sex = LOOK.sex; }
  const ch = art.character(m.who, o), s = a.h / 200;
  const W = (b) => [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s];
  return { body: W(ch.bounds), head: W(ch.headBox), s };
}
const overlap = (p, q) => Math.max(0, Math.min(p[2], q[2]) - Math.max(p[0], q[0])) * Math.max(0, Math.min(p[3], q[3]) - Math.max(p[1], q[1]));
// the fox is drawn by app/art/cats.js in a 300 x 230 box; until he is, a Clan cat stands in for him
const foxDrawn = () => { const c = art.character('reynard', { pose: 'sit', facing: 'left' }); return !!c && c.w === 300; };

test('build.md: the Chapter 4 section names the border\'s cameras and anchors, and foxTail on the dogs camera', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const sec = md.slice(md.indexOf('## Chapter 4')).replace(/\s+/g, ' ');
  const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  // every name the border answers to is in the section ("`back-1` … `back-4`" names the four)
  const named = new Set(ticks(sec));
  for (const k of [...BORDER, 'fox', 'lead', 'left', 'right', 'back-1', 'back-4', 'foxTail: true']) assert.ok(named.has(k), 'build.md names `' + k + '`');
  assert.ok(/`back-1` … `back-4`/.test(sec));
  // and where it still lists them in one sentence, the lists are exactly the set's
  const m = /`field` gains the \*\*border\*\* composition: cameras ([^;]+); anchors ([^;]+); and (`foxTail: true` on the `dogs` camera)/.exec(sec);
  if (m) {
    assert.deepEqual(ticks(m[1]), BORDER);
    assert.deepEqual(ticks(m[2]), ['fox', 'lead', 'left', 'right', 'back-1', 'back-4']);
    assert.ok(/a white-tipped tail going into the long grass/.test(sec));
  }
});

test('the border: every camera renders well-formed SVG with a cast member at each spot it sees, in every light', () => {
  let n = 0;
  for (const cam of BORDER) {
    for (const at of SEES[cam]) {
      for (const who of ['player', 'tallyheart', 'clancat', 'reynard', 'dog']) {
        const pose = who === 'dog' ? 'jump' : 'sit';
        const scene = { set: 'field', cam, cast: [{ who, at, pose, mood: 'happy', variant: 1 }], fx: ['day'] };
        const r = art.render(scene, { look: LOOK });
        checkRender(r, scene, cam + ' ' + who + '@' + at);
        // the close-up is cut for who belongs where: the fox chest-up at `fox`, a corner of a grown cat
        // at `right`, of any cat at `left`, the edge of a cat's face at `lead`; the dogs' spots show anyone
        const cat = who !== 'reynard' && who !== 'dog';
        const fits = cam !== 'border-fox' || DOGS.includes(at) || (at === 'fox' ? who === 'reynard' : at === 'right' ? who === 'tallyheart' || who === 'clancat' : cat);
        if (fits) assert.ok(r.heads[0], cam + ': ' + who + ' at ' + at + ' is in shot');
        n++;
      }
    }
    for (const t of TOD) {
      const cast = [...DOGS.map((at, i) => ({ who: 'dog', variant: i + 1, at, pose: 'bounce' })), FOX, ...CLAN.filter((m) => SEES[cam].includes(m.at))];
      const scene = { set: 'field', cam, cast, fx: [t] };
      const r = art.render(scene, { look: LOOK });
      checkRender(r, scene, cam + ' ' + t);
      r.heads.forEach((h, i) => assert.ok(h, cam + ' ' + t + ': ' + cast[i].who + ' at ' + cast[i].at + ' is in shot'));
    }
    const odd = { set: 'field', cam, opts: { sparrows: 3, foxTail: true, nope: true }, cast: [], fx: art.vocab.fx.slice() };
    checkRender(art.render(odd, { look: LOOK }), odd, cam + ' with stray options and every effect');
  }
  assert.equal(n, (12 + 12 + 8) * 5);
});

test('the border\'s spots are not in chapter 2\'s cameras, nor chapter 2\'s path spots in the border\'s; the dogs are in all six', () => {
  for (const cam of CAMS) for (const at of BORDER_ANCHORS) assert.equal(bRender(cam, [{ who: 'clancat', at }]).heads[0], null, cam + ': ' + at + ' is out of sight');
  for (const cam of BORDER) {
    for (const at of ['path-left', 'path-right', 'field']) assert.equal(bRender(cam, [{ who: 'clancat', at }]).heads[0], null, cam + ': ' + at + ' is out of sight');
    for (const at of DOGS) assert.ok(bRender(cam, [{ who: 'dog', at, pose: 'jump' }]).heads[0], cam + ': ' + at);
  }
  for (const at of BACK) assert.equal(bRender('border-fox', [{ who: 'grizzled', at }]).heads[0], null, 'the fox\'s close-up does not see ' + at);
});

test('the fox\'s spot is past the last post in the long grass, the Clan\'s on the path: he is never on their side of it', () => {
  const I = fieldInfo().border, anchors = art.sceneInfo('field').anchors;
  assert.deepEqual(Object.keys(I).sort(), BORDER.slice().sort());
  for (const cam of BORDER) {
    const A = anchors[cam], post = I[cam].post, svg = bRender(cam).svg;
    assert.equal(count(svg, /data-part="last-post"/g), 1, cam + ': the last post');
    assert.equal(A.fox.face, 'left', cam + ': he faces the Clan (his eyes are on Glintstar, never out at the reader)');
    for (const at of SEES[cam].filter((k) => k !== 'fox' && k !== 'grass' && !DOGS.includes(k))) {
      // (in the close-up the two corners of cats are this side of everything, nearer than the post)
      const near = cam === 'border-fox' && (at === 'left' || at === 'right');
      assert.ok(near ? A[at].y > post.base + 300 : A[at].x < post.x, cam + ': ' + at + ' is on the Clan\'s side of the post');
      assert.notEqual(A[at].face, 'left', cam + ': ' + at + ' faces the fox');
    }
    assert.ok(A.fox.x > post.x + post.w, cam + ': the fox\'s spot is past the post');
    // all of him, in every pose he has, tail and flapping paws included
    for (const pose of ['sit', 'comb', 'chest', 'think', 'lean', 'flap', 'slip', 'dash']) {
      const b = boxes({ who: 'reynard', pose, facing: 'left' }, A.fox).body;
      assert.ok(b[0] > post.x + post.w / 2, cam + ': ' + pose + ': his nearest whisker is past the post: ' + b[0].toFixed(0) + ' vs ' + post.x);
    }
    // on the panel, left to right: our cat's spot, Tallyheart's, Glintstar's, the post, the fox
    assert.ok(A.left.x < A.right.x && A.right.x < A.fox.x && A.lead.x < post.x && post.x < A.fox.x, cam + ': left, right, the fox; lead, the post, the fox');
    if (cam !== 'border-fox') assert.ok(A.right.x < A.lead.x, cam + ': left, right, lead, the post, the fox');
    // the long golden grass is on his side: its ground starts at the post and the path's end
    assert.equal(count(svg, /data-part="long-grass-ground"/g), 1, cam + ': the ground the long grass stands in');
    assert.equal(count(svg, /data-part="long-grass"/g), 1, cam + ': long grass behind him');
    assert.equal(count(svg, /data-part="long-grass-front"/g), 1, cam + ': and at his feet');
    const gd = /<path d="([^"]+)"[^>]*data-part="long-grass-ground"/.exec(svg)[1];
    const gx = (gd.match(/[ML]([-\d.]+) /g) || []).map((t) => +t.slice(1));
    assert.ok(Math.min(...gx) >= I[cam].pathEnd[0][0] - 1 && Math.min(...gx) <= post.x, cam + ': the gold begins where the path ends: ' + Math.min(...gx));
    for (const at of FRONT) assert.ok(cam === 'border-fox' || A[at].x < I[cam].pathEnd[0][0], cam + ': ' + at + ' is on the mown path, short of its end');
    // long and golden: the blades behind him are gold, and the tallest are a good part of a cat's height
    const lg = svg.slice(svg.indexOf('data-part="long-grass"')), fills = (lg.slice(0, lg.indexOf('</g>')).match(/fill="(#[0-9a-fA-F]{6})"/g) || []).map((t) => t.slice(6, 13));
    const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    assert.ok(fills.length >= 3 && fills.every((h) => { const c = rgb(h); return c[0] > 150 && c[0] >= c[1] && c[1] > 110 && c[2] < c[1] * 0.8; }), cam + ': golden: ' + fills.join(' '));
  }
});

test('the fox is never bigger than the cats beside the post, and never drawn over a cat', () => {
  const anchors = art.sceneInfo('field').anchors;
  for (const cam of BORDER) {
    const A = anchors[cam];
    for (const at of FRONT) assert.ok(A.fox.h <= A[at].h, cam + ': a cat at ' + at + ' (' + A[at].h + ') is drawn at least as big as the fox (' + A.fox.h + ')');
    if (!foxDrawn()) continue;
    const fox = boxes(FOX, A.fox);
    if (cam === 'border-fox') continue;
    for (const pose of ['sit', 'comb', 'flap', 'lean', 'slip', 'dash']) {
      const f = boxes({ who: 'reynard', pose }, A.fox).body;
      for (const m of CLAN) assert.equal(overlap(f, boxes(m, A[m.at]).body), 0, cam + ': the fox (' + pose + ') and the cat at ' + m.at + ' never touch');
    }
    // about Tallyheart's size where they sit: no taller than she is
    const t = boxes({ who: 'tallyheart' }, A.right).body;
    assert.ok(fox.body[3] - fox.body[1] <= (t[3] - t[1]) * 1.02, cam + ': he sits no taller than Tallyheart: ' + (fox.body[3] - fox.body[1]).toFixed(0) + ' vs ' + (t[3] - t[1]).toFixed(0));
  }
});

test('border and border-two: the three in front are drawn over the four behind, in any cast order; nobody\'s face is hidden', () => {
  const anchors = art.sceneInfo('field').anchors;
  for (const cam of ['border', 'border-two']) {
    const A = anchors[cam];
    for (const at of BACK) assert.equal(A[at].z, 'behind', cam + ': ' + at + ' is drawn first');
    for (const at of [...FRONT, 'fox']) assert.notEqual(A[at].z, 'behind', cam + ': ' + at + ' is drawn after them');
    // the front three listed first: cast order alone would put the back four over them
    const cast = [...CLAN, FOX], r = bRender(cam, cast), svg = r.svg;
    const pos = (at) => drawnAt(svg, A[at]);
    for (const b of BACK) for (const f of [...FRONT, 'fox']) assert.ok(pos(b) > 0 && pos(b) < pos(f), cam + ': ' + b + ' is under ' + f);
    // every head shows: the back four look out between and over the front three
    r.heads.forEach((h, i) => assert.ok(h && h.x > 2 && h.x < 98 && h.y > 5 && h.y < 95, cam + ': ' + cast[i].at + ' is well inside the panel: ' + JSON.stringify(h)));
    for (const b of CLAN.filter((m) => BACK.includes(m.at))) {
      const hb = boxes(b, A[b.at]).head, area = (hb[2] - hb[0]) * (hb[3] - hb[1]);
      let hidden = 0;
      for (const f of CLAN.filter((m) => FRONT.includes(m.at))) hidden += overlap(hb, boxes(f, A[f.at]).head);
      // (in the wide camera they are almost clear; at cat height they look out through the gaps between heads)
      assert.ok(hidden < area * (cam === 'border' ? 0.35 : 0.5), cam + ': the face at ' + b.at + ' is not behind a head in front: ' + (hidden / area * 100).toFixed(0) + '% hidden');
    }
    // the four behind are further off: smaller, and higher on the path
    for (const b of BACK) for (const f of FRONT) assert.ok(A[b].h < A[f].h && A[b].y < A[f].y, cam + ': ' + b + ' is behind ' + f);
  }
});

test('border-two: at cat height, two cats shoulder to shoulder; the one at `right` is between the other and the fox', () => {
  const anchors = art.sceneInfo('field').anchors, A = anchors['border-two'], W = anchors.border;
  for (const at of [...FRONT, 'fox']) assert.ok(A[at].h > W[at].h * 1.4, at + ' is drawn much bigger than in the wide camera');
  const cast = [FOX, { who: 'player', at: 'left', mood: 'worried' }, { who: 'tallyheart', at: 'right', mood: 'stern' }];
  const r = bRender('border-two', cast);
  assert.ok(r.heads[1].x < r.heads[2].x && r.heads[2].x < r.heads[0].x, 'our cat, Tallyheart, the fox: ' + JSON.stringify(r.heads.map((h) => h.x)));
  const cat = boxes(cast[1], A.left).body, tally = boxes(cast[2], A.right).body;
  assert.ok(tally[0] - cat[2] < A.left.h * 0.12, 'pressed against her shoulder: the gap between them is ' + (tally[0] - cat[2]).toFixed(0));
  if (foxDrawn()) {
    const fox = boxes(FOX, A.fox).body;
    assert.ok(fox[0] - tally[2] > A.right.h * 0.5, 'and a good way from the fox: ' + (fox[0] - tally[2]).toFixed(0));
    assert.ok(tally[0] < fox[0] && tally[2] > cat[2], 'her shoulder is between the fox and our cat');
  }
  // at cat height: their eyes are near the middle of the panel's height, not down in a corner
  for (const h of r.heads) assert.ok(h.y > 50 && h.y < 80, 'heads at ' + h.y + '%');
});

test('border-fox: the fox chest-up, never a full-face close-up; a corner of a cat in the near edge', () => {
  const anchors = art.sceneInfo('field').anchors, A = anchors['border-fox'];
  assert.ok(A.fox.y > 1100, 'his feet are below the panel: chest up');
  for (const at of ['left', 'right']) assert.ok(A[at].y > 1400 && A[at].h >= A.fox.h, at + ': a cat there is nearer than he is, and mostly below the panel');
  if (!foxDrawn()) return;
  const cast = [FOX, { who: 'tallyheart', at: 'right' }], r = bRender('border-fox', cast);
  const f = boxes(FOX, A.fox), fh = f.head;
  // his whole head is in the panel, with room over his ears, and it does not fill it
  assert.ok(fh[0] > 80 && fh[2] < 1520 && fh[1] > 60 && fh[3] < 900, 'his head is inside the panel: ' + fh.map((v) => v.toFixed(0)));
  const hh = (fh[3] - fh[1]) / 1000, hw = (fh[2] - fh[0]) / 1600;
  assert.ok(hh > 0.35 && hh < 0.62 && hw < 0.4, 'a close shot, never a face that fills the panel: ' + (hh * 100).toFixed(0) + '% high, ' + (hw * 100).toFixed(0) + '% wide');
  assert.ok(f.body[3] > 1000 + (f.body[3] - f.body[1]) * 0.12, 'cut at the chest: his feet and his tail\'s root are out of the panel');
  // three-quarter, looking left: his head is right of the middle, turned to the Clan's side
  assert.ok(r.heads[0].x > 50 && r.heads[0].x < 72 && r.heads[0].y > 35 && r.heads[0].y < 60, 'his head: ' + JSON.stringify(r.heads[0]));
  const ch = art.character('reynard', { pose: 'sit', facing: 'left' }), mid = (ch.headBox.x0 + ch.headBox.x1) / 2;
  assert.ok(Math.abs(ch.head.x - mid) > 1 || ch.headBox.x1 - ch.headBox.x0 < ch.headBox.y1 - ch.headBox.y0, 'cats.js draws his head turned (a muzzle to one side), not square to us');
  // Tallyheart: only a corner of her, in the near (bottom left) corner; her head point just inside the panel
  const t = boxes(cast[1], A.right), th = t.head, area = (th[2] - th[0]) * (th[3] - th[1]);
  const seen = overlap(th, [0, 0, 1600, 1000]) / area;
  assert.ok(seen > 0.25 && seen < 0.85 && th[3] > 1000 && t.body[3] > 1500, 'her ears and eyes show; her chin, her chest and all the rest of her are below the panel: ' + (seen * 100).toFixed(0) + '%');
  assert.ok(r.heads[1] && r.heads[1].x < 35 && r.heads[1].y > 80, 'in the near corner: ' + JSON.stringify(r.heads[1]));
  assert.ok(t.s >= f.s, 'drawn at least as big as the fox: he is never the bigger of the two');
  assert.equal(overlap(t.head, f.body), 0, 'and he is not drawn over her');
  // our cat at `left` is a corner too, further into it; Glintstar at `lead` the edge of a face at the left
  const all = bRender('border-fox', [FOX, { who: 'glintstar', at: 'lead' }, { who: 'player', at: 'left' }, { who: 'tallyheart', at: 'right' }]);
  all.heads.forEach((h, i) => assert.ok(h, 'cast member ' + i + ' is in shot'));
  assert.ok(all.heads[2].x < all.heads[3].x && all.heads[3].x < all.heads[0].x, 'our cat, Tallyheart, the fox');
  assert.ok(all.heads[1].x < 8 && all.heads[1].y > 30 && all.heads[1].y < 75, 'Glintstar at the panel\'s left edge, where he is looking: ' + JSON.stringify(all.heads[1]));
  const p = boxes({ who: 'player', at: 'left' }, A.left).head;
  assert.ok(overlap(p, [0, 0, 1600, 1000]) / ((p[2] - p[0]) * (p[3] - p[1])) < 0.6, 'only a corner of our cat');
});

test('the dogs are behind the wire that runs away behind the fox, in every border camera', () => {
  const anchors = art.sceneInfo('field').anchors, I = fieldInfo().border;
  for (const cam of BORDER) {
    const A = anchors[cam], post = I[cam].post;
    for (const at of DOGS) {
      assert.equal(A[at].z, 'behind', cam + ': ' + at + ' is behind the wire');
      if (cam !== 'border-fox') assert.ok(A[at].x > post.x, cam + ': ' + at + ' is past the post, behind the fox\'s side');
    }
    const cast = [FOX, ...CLAN.filter((m) => SEES[cam].includes(m.at)), ...DOGS.map((at, i) => ({ who: 'dog', variant: i + 1, at, pose: 'jump' }))];
    const r = bRender(cam, cast), svg = r.svg, fence = svg.indexOf('data-part="fence"'), right = svg.indexOf('data-part="fence-right"'), left = svg.indexOf('data-part="fence-left"');
    assert.ok(left > 0 && fence > left && right > fence, cam + ': the fence up the path, then the layer over the field with the fence running away');
    for (const at of DOGS) assert.ok(drawnAt(svg, A[at]) > 0 && drawnAt(svg, A[at]) < right, cam + ': the dog at ' + at + ' is under the wire');
    assert.ok(drawnAt(svg, A.fox) > right, cam + ': the fox is on this side of it');
    // the dogs behind him: at least two of their heads show clear of his
    const fh = r.heads[0];
    const clear = r.heads.slice(-3).filter((h) => h && Math.hypot((h.x - fh.x) * 16, (h.y - fh.y) * 10) > (h.r + fh.r) * 16 * 0.9).length;
    assert.ok(clear >= 2, cam + ': dogs\' heads clear of the fox\'s: ' + clear);
    // the fence turns at the last post: both runs start there
    assert.equal(I[cam].left.near[0], post.x);
    assert.equal(I[cam].right.near[0], post.x);
    assert.ok(I[cam].left.far[0] < 0 && I[cam].right.far[0] > 1600, cam + ': and run off both sides of the panel');
    const hn = I[cam].left.near[2] - I[cam].left.near[1];
    assert.ok(I[cam].left.far[2] - I[cam].left.far[1] < hn && I[cam].right.far[2] - I[cam].right.far[1] < hn, cam + ': the post is the nearest of it: a corner');
  }
});

test('the long grass at the fox\'s feet is short where he sits, so it never hides him', () => {
  const blades = (svg) => {
    const fr = svg.slice(svg.indexOf('data-part="long-grass-front"'));
    return (fr.slice(0, fr.indexOf('</g>')).match(/M[-\d.]+ [-\d.]+Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+Z/g) || []).map((b) => {
      const v = b.match(/[-\d.]+/g).map(Number);
      return { x: v[0], h: v[1] - v[5] };
    });
  };
  // in the close-up the near corner is the cats': no grass is drawn over their faces, and what stands
  // in front of the fox is low
  const close = blades(bRender('border-fox', [FOX, { who: 'tallyheart', at: 'right' }]).svg), A = art.sceneInfo('field').anchors['border-fox'];
  const corner = boxes({ who: 'tallyheart' }, A.right).head;
  assert.ok(close.length > 10 && close.every((b) => b.x > corner[2] + 20), 'border-fox: the grass in front starts past her face: ' + Math.min(...close.map((b) => b.x)).toFixed(0) + ' vs ' + corner[2].toFixed(0));
  assert.ok(Math.max(...close.map((b) => b.h)) < 110, 'border-fox: and stays low: ' + Math.max(...close.map((b) => b.h)).toFixed(0));
  for (const cam of ['border', 'border-two']) {
    const a = art.sceneInfo('field').anchors[cam].fox;
    const empty = blades(bRender(cam).svg), withFox = blades(bRender(cam, [FOX]).svg);
    assert.ok(empty.length > 20 && withFox.length === empty.length, cam + ': the same blades');
    const near = (list) => list.filter((b) => Math.abs(b.x - a.x) < a.h * 0.45), tall = (list) => Math.max(...list.map((b) => b.h));
    assert.ok(near(withFox).length > 4, cam + ': there is grass at his feet');
    assert.ok(tall(near(withFox)) < tall(near(empty)) * 0.75, cam + ': shorter in front of him: ' + tall(near(withFox)).toFixed(0) + ' vs ' + tall(near(empty)).toFixed(0));
    assert.ok(tall(near(withFox)) < a.h * 0.42, cam + ': his chest and face are clear of it');
  }
});

test('the hollow log is far inside the fence in the border\'s two wide cameras too; the fox\'s close-up has none', () => {
  const I = fieldInfo().border;
  for (const cam of BORDER) for (const tod of ['day', 'night']) {
    const svg = bRender(cam, [], [tod]).svg, n = count(svg, /data-part="log"/g);
    assert.equal(n, I[cam].log ? 1 : 0, cam + ' ' + tod);
    if (n) assert.ok(svg.indexOf('data-part="log"') < svg.indexOf('data-part="fence-left"'), cam + ': behind the wire');
  }
  assert.ok(I.border.log && I['border-two'].log && !I['border-fox'].log);
});

// ---------------------------------------------------------------- the fox's exit

test('foxTail: off unless asked; on the dogs camera, a white-tipped tail going into long golden grass', () => {
  const T = fieldInfo().foxTail, dogs = DOGS.map((at, i) => ({ who: 'dog', variant: i + 1, at, pose: 'bounce' }));
  const off = bRender('dogs', dogs).svg, on = bRender('dogs', dogs, ['day'], { foxTail: true }).svg;
  assert.equal(count(off, /data-part="fox-exit"/g), 0, 'no tail by default');
  assert.equal(strip(bRender('dogs', dogs, ['day'], { foxTail: false }).svg), strip(off), 'foxTail false is the default');
  assert.equal(count(on, /data-part="fox-exit"/g), 1, 'one exit');
  assert.equal(count(on, /data-part="fox-tail"/g), 1, 'one tail');
  assert.equal(count(on, /data-fox="tail"/g), 1);
  assert.equal(count(on, /data-fox="tip"/g), 1);
  const tail = new RegExp('fill="(#[0-9a-fA-F]{6})"[^>]*data-fox="tail"').exec(on)[1], tip = new RegExp('fill="(#[0-9a-fA-F]{6})"[^>]*data-fox="tip"').exec(on)[1];
  assert.equal(tail.toLowerCase(), T.base, 'red-orange');
  assert.equal(tip.toLowerCase(), T.tip, 'white-tipped');
  // going IN: the white tip is the end nearest the middle of the panel, the root is toward the edge, in the grass
  const xs = (attr) => (new RegExp('<path d="([^"]+)"[^>]*data-fox="' + attr + '"').exec(on)[1].match(/[ML]([-\d.]+) /g) || []).map((t) => +t.slice(1));
  const body = xs('tail'), tipX = xs('tip');
  assert.ok(Math.max(...body) > 1380 && Math.min(...body) > 1000, 'at the right edge of the panel: ' + [Math.min(...body), Math.max(...body)]);
  assert.ok(Math.max(...tipX) < Math.min(...body) + (Math.max(...body) - Math.min(...body)) * 0.5, 'the tip is its inner end, the last of him');
  // grass in front of its root: blades drawn after the tail, in gold
  const after = on.slice(on.indexOf('data-part="fox-tail"'));
  const blade = /M[-\d.]+ [-\d.]+Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+Z/g;
  assert.ok(count(after.slice(after.indexOf('</g>'), after.indexOf('pcs-whoosh')), blade) >= 20, 'long grass closes over it');
  assert.ok(count(on.slice(on.indexOf('data-part="fox-exit"'), on.indexOf('data-part="fox-tail"')), blade) >= 10, 'and stands behind it');
  // on the path's side of the wire: over the dogs and the wire, under any cat
  const A = art.sceneInfo('field').anchors.dogs, cat = bRender('dogs', [...dogs, { who: 'player', at: 'path-left' }], ['day'], { foxTail: true }).svg;
  const exit = cat.indexOf('data-part="fox-exit"');
  assert.ok(exit > fenceAt(cat), 'inside the fence layer');
  for (const at of DOGS) assert.ok(drawnAt(cat, A[at]) < exit, 'over the dog at ' + at);
  assert.ok(drawnAt(cat, A['path-left']) > exit, 'under the cat on the path: he is never drawn over a cat');
  assert.ok(wireOf(cat).length > 0 && cat.indexOf(wireOf(cat).slice(0, 40)) < exit, 'after the wire');
});

test('foxTail goes out on the side where no cat sits on the path', () => {
  const side = (cast) => {
    const svg = bRender('dogs', cast, ['day'], { foxTail: true }).svg;
    const xs = (/<path d="([^"]+)"[^>]*data-fox="tail"/.exec(svg)[1].match(/[ML]([-\d.]+) /g) || []).map((t) => +t.slice(1));
    return (Math.min(...xs) + Math.max(...xs)) / 2 > 800 ? 'right' : 'left';
  };
  assert.equal(side([]), 'right');
  assert.equal(side([{ who: 'player', at: 'path-left' }]), 'right');
  assert.equal(side([{ who: 'tallyheart', at: 'path-right' }]), 'left', 'a cat on the right: he goes out on the left');
  assert.equal(side([{ who: 'player', at: 'path-left' }, { who: 'tallyheart', at: 'path-right' }]), 'right', 'cats on both sides: right, and under her');
  // either way no cat on the path is under any of it
  const A = art.sceneInfo('field').anchors.dogs;
  for (const cast of [[{ who: 'tallyheart', at: 'path-right' }], [{ who: 'player', at: 'path-left' }, { who: 'tallyheart', at: 'path-right' }]]) {
    const svg = bRender('dogs', cast, ['day'], { foxTail: true }).svg;
    for (const m of cast) assert.ok(drawnAt(svg, A[m.at]) > svg.indexOf('data-part="fox-exit"'), m.at + ' is drawn over it');
  }
});

test('foxTail is the dogs camera\'s alone; the tail is the fox\'s own red and white (app/art/cats.js)', () => {
  for (const cam of ['wide', 'fence', ...BORDER]) {
    const a = bRender(cam, [], ['day'], { foxTail: true }).svg, b = bRender(cam).svg;
    assert.equal(strip(a), strip(b), cam + ': nothing changes');
  }
  if (!foxDrawn()) return;
  const T = fieldInfo().foxTail, fox = art.character('reynard', { pose: 'sit', facing: 'left' }).svg.toLowerCase();
  for (const key of ['base', 'line', 'light', 'tip']) assert.ok(fox.includes(T[key]), 'cats.js still draws him with ' + key + ' ' + T[key]);
});

// ---------------------------------------------------------------- chapter 2's pictures are untouched

test('chapter 2\'s three cameras draw exactly what they drew before the border was added', () => {
  const crypto = require('crypto');
  // the empty panels by day, as app/art/sets/field.js drew them at chapter 3's release (0e695a7)
  const was = { wide: 'c756d9dd2c1aeb1d120100aa43688fa7ad63c807', fence: '8cf51e4e74aa14837ed4edb246215c2cd1dcec1d', dogs: '55919adecfe00f58a3946448fbd25db314b1e0d0' };
  for (const cam of CAMS) {
    const svg = strip(art.render({ set: 'field', cam, cast: [], fx: ['day'] }).svg);
    assert.equal(crypto.createHash('sha1').update(svg).digest('hex'), was[cam], cam + ': the empty panel is byte for byte what it was');
    assert.ok(!/long-grass|fox-|last-post|fence-left|fence-right/.test(svg), cam + ': nothing of the border in it');
  }
});

/* After the picture review: who was hidden behind what at the border. The test above measures heads
 * against heads; a raised tail and the corner post are not heads, so these are pinned where they were
 * looked at (the wide panels f034, f047, f049, f051, f055). */
test('border: Murmurchime at `back-4` looks out between Tallyheart and Glintstar, clear of Glintstar’s raised tail; the shaggy dog’s face is clear of the corner post; no puddle under Glintstar’s chin in the two-shot', () => {
  const A = art.sceneInfo('field').anchors.border;
  assert.deepEqual([A['back-4'].x, A['back-4'].y, A['back-4'].h], [740, 868, 214], 'at 708 Glintstar’s tail ran down her face; at 748 her face is behind sitting Glintstar’s head');
  const cast = [{ who: 'dog', variant: 1, at: 'dog-1', pose: 'bounce', facing: 'left' }, FOX, { who: 'glintstar', at: 'lead', pose: 'stand', facing: 'right' },
    { who: 'player', at: 'left' }, { who: 'tallyheart', at: 'right' }, { who: 'murmurchime', at: 'back-4' }];
  const r = bRender('border', cast), H = (i) => ({ x: r.heads[i].x * 16, y: r.heads[i].y * 10, r: r.heads[i].r * 16 });
  const dog = H(0), glint = H(2), tally = H(4), mur = H(5);
  // her face sits in the gap: a face's width clear of Tallyheart's, and of Glintstar's
  assert.ok(mur.x - tally.x > (mur.r + tally.r) * 0.9 && glint.x - mur.x > (mur.r + glint.r) * 0.9, 'between the two heads: ' + [tally.x, mur.x, glint.x].map(Math.round));
  // the corner post stands at x 1010, 44 wide (it was across the shaggy dog's face: he is the one speaking)
  assert.ok(dog.x - dog.r * 0.4 > 1010 + 22, 'the dog’s face is right of the post: ' + Math.round(dog.x) + ' r ' + Math.round(dog.r));
  assert.ok(A['dog-1'].x < A['dog-2'].x && A['dog-2'].x < A['dog-3'].x && A['dog-3'].x < 1600, 'the three still left to right, inside the field');
  for (const k of DOGS) assert.equal(A[k].z, 'behind', k + ': behind the wire, and behind the fox');
  // the two-shot's field has its mud and no puddle (the one at [760, 780] lay right under Glintstar's chin when she faced left)
  const src = fs.readFileSync(path.join(ROOT, 'app/art/sets/field.js'), 'utf8');
  const two = src.slice(src.indexOf("'border-two': {"), src.indexOf("'border-fox': {"));
  assert.match(two, /mud: \[\[560, 772, 330, 30\], \[1330, 768, 260, 26\]\],/);
  assert.match(two, /\n\s+puddles: \[\],\n\s+prints:/);
});

// ================================================================ chapter 6: Sleet's spot in the long grass
// docs/chapters/06-the-snake-in-the-stones.spec.md, section 4 ("Places", the field row)

const SPEC6 = path.join(ROOT, 'docs/chapters/06-the-snake-in-the-stones.spec.md');
const r1 = (v) => Math.round(v * 10) / 10;
// Sleet, once app/art/cats.js draws him (the eldest dragonet, on Sprinkle's model); until then Sprinkle stands in
const SLEET_POSES = ['hidden', 'tail', 'flat', 'point', 'call', 'puff', 'droop', 'sit', 'pawup'];
const sleetDraws = (() => {
  if (!art.vocab.cast.includes('sleet')) return false;
  try { return SLEET_POSES.every((pose) => { const c = art.character('sleet', { pose, facing: 'left' }); return !!c && !c.placeholder && !!c.headBox; }); } catch (e) { return false; }
})();
const SLEET = sleetDraws ? 'sleet' : 'sprinkle';
const UPRIGHT = sleetDraws ? ['point', 'call', 'puff', 'sit', 'pawup'] : ['sit', 'pawup'];
const LOW = sleetDraws ? ['hidden', 'tail', 'flat', 'droop'] : ['flat', 'lie'];
// His boxes where scenes.js draws him: the cats' units, and the size band PC.art.sizeBands holds him to.
function sleetBoxes(pose, a) {
  const b = boxes({ who: SLEET, pose, facing: 'left' }, a), band = art.sizeBands && art.sizeBands[SLEET];
  if (!band) return b;
  const meas = (w, p) => { const hb = art.character(w, { pose: p, mood: 'neutral' }).headBox; return ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2; };
  const ratio = meas(SLEET, band.pose) / meas(band.ref, 'sit'), k = Math.min(band.max, Math.max(band.min, ratio)) / ratio;
  const sc = (q) => [a.x + (q[0] - a.x) * k, a.y + (q[1] - a.y) * k, a.x + (q[2] - a.x) * k, a.y + (q[3] - a.y) * k];
  return { body: sc(b.body), head: sc(b.head) };
}
// the grass drawn over him: its blades (and the seed heads on some), [the middle of its root, root y, tip y]
function coverBlades(svg) {
  const at = svg.indexOf('data-part="grass-cover"');
  if (at < 0) return null;
  const g = svg.slice(svg.lastIndexOf('<g', at), svg.indexOf('</g>', at));
  return (g.match(/M[-\d.]+ [-\d.]+Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+Z/g) || []).map((b) => { const v = b.match(/[-\d.]+/g).map(Number); return [(v[0] + v[8]) / 2, v[1], Math.min(v[1], v[5])]; });
}

test('chapter 6: the spec names `grass` in the border\'s three cameras, and the set has it there and nowhere else', () => {
  const md = fs.readFileSync(SPEC6, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['**anchor `grass`** in the three border cameras', 'nearer than `fox`', 'Never on the Clan\'s side of the post', 'The fox is never drawn']) assert.ok(md.includes(want), 'the spec says: ' + want);
  const A = art.sceneInfo('field').anchors;
  for (const cam of BORDER) { assert.ok(A[cam].grass, cam + ': grass'); assert.equal(A[cam].grass.face, 'left', cam + ': he faces the Clan across the post'); assert.notEqual(A[cam].grass.z, 'behind', cam + ': in front of the fence that runs away'); }
  for (const comp of ['main', 'dogs', 'fence']) assert.ok(!A[comp].grass, comp + ': chapter 2\'s cameras do not see it');
  // chapter 6 added no option (chapter 8's `moon` and `tap` come after chapter 4's `foxTail`)
  assert.deepEqual(Object.keys(art.vocab.sets.field.opts), ['foxTail', 'moon', 'tap']);
  assert.deepEqual(art.vocab.sets.field.opts.foxTail, [false, true]);
});

test('chapter 6: chapter 2 and 4\'s frames are as they were: no `grass` in them, no grass cover, the spots of their own at the depth they had', () => {
  let n = 0;
  for (const id of ['ch02', 'ch03', 'ch04', 'ch05']) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'field') continue;
    n++;
    assert.ok(!(sc.cast || []).some((m) => m.at === 'grass'), id + ' ' + fid + ': nobody at `grass`');
    assert.ok(!/data-part="grass-cover"/.test(art.render(sc, { look: LOOK }).svg), id + ' ' + fid + ': no grass cover');
  }
  assert.ok(n >= 20, 'chapters 2 and 4 visit the Barking Field: ' + n);
  // with nobody at `grass`, nothing is drawn for it
  for (const cam of BORDER) assert.ok(!/grass-cover/.test(bRender(cam, [FOX, ...CLAN.filter((m) => SEES[cam].includes(m.at))]).svg), cam + ': no cover without him');
  // a spot of its own gets the depth the four ground spots of chapter 4 give it (chapter 4's f035a stands at { x: 352, y: 988 } in
  // border-two): the new spot is on border's line, and out of the sums in the other two
  const A = art.sceneInfo('field').anchors;
  assert.ok(Math.abs(A.border.grass.h - (254 + (A.border.grass.y - 934) / 3)) < 1e-9, 'border: on the line h = 254 + (y - 934) / 3');
  assert.ok(A['border-two'].grass.elev && A['border-fox'].grass.elev, 'border-two, border-fox: out of the depth sums');
  const old = (cam, at) => art.render({ set: 'field', cam, cast: [{ who: 'player', at }], fx: ['day'] }, { look: LOOK }).heads[0];
  // (recorded with app/art/sets/field.js as chapter 5 shipped it)
  assert.deepEqual(old('border-two', { x: 352, y: 988 }), { x: 24.1, y: 76.3, r: 5.39 }, 'chapter 4\'s f035a: our cat where she was, as big as she was');
});

test('chapter 6: `grass` is past the last post in the long grass: Sleet is never on the Clan\'s side of it, in any pose that stands up, and his face is close enough to talk across it', () => {
  const I = fieldInfo().border, A = art.sceneInfo('field').anchors;
  for (const cam of BORDER) {
    const post = I[cam].post, edge = post.x + post.w / 2, g = A[cam].grass;
    assert.ok(g.x > post.x + post.w, cam + ': the spot is past the post');
    for (const pose of UPRIGHT.concat(LOW.filter((p) => p !== 'flat'))) {
      const b = sleetBoxes(pose, g).body;
      assert.ok(b[0] > edge, cam + ': ' + SLEET + ' (' + pose + '): nothing of him is on the Clan\'s side: ' + Math.round(b[0]) + ' vs ' + edge);
    }
    // sitting up, his face is beside the post, within about a head's width of it (in the two wide ones; the
    // close-up has the post at its edge and the cats' corners by it)
    const h = sleetBoxes('sit', g).head, w = h[2] - h[0];
    if (cam !== 'border-fox') assert.ok(h[0] - edge < 1.2 * w, cam + ': his face is close enough to talk across the post: ' + Math.round(h[0] - edge) + ' from it, a head ' + Math.round(w) + ' wide');
    // and every pose's face is inside the panel
    for (const pose of UPRIGHT) {
      const hb = sleetBoxes(pose, g).head;
      assert.ok(hb[0] > 0 && hb[2] <= 1601 && hb[1] > 0 && hb[3] < 1000, cam + ': ' + pose + ': his face is in the panel: ' + hb.map(Math.round));
    }
  }
  // the two wide ones: nearer than the fox's spot, and no smaller than the fox; in front of the wire running away
  for (const cam of ['border', 'border-two']) {
    const g = A[cam].grass, f = A[cam].fox;
    assert.ok(g.y > f.y && g.h >= f.h, cam + ': nearer than the fox\'s spot');
    assert.ok(g.x < 1600, cam + ': in the panel');
  }
});

// The spec's flat on his belly at `grass` (section 4): never on the Clan's side of the post. cats.js's `flat`
// once reached further forward than he sits (his claws and head stretched out ahead of him), so at
// border-two's spot his head was over the path; the cast owner moved it back in its box (`flat`'s front where
// his sitting front is), and this guard is live: chapter 6 draws him flat at `grass` on `border-two` (f066a,
// f067a) on every path that follows the trail.
test('chapter 6: flat on his belly at `grass`, Sleet is past the post too', { skip: sleetDraws ? false : 'no sleet in cats.js yet' }, () => {
  const I = fieldInfo().border, A = art.sceneInfo('field').anchors;
  for (const cam of BORDER) {
    const b = sleetBoxes('flat', A[cam].grass).body, post = I[cam].post;
    assert.ok(b[0] > post.x + post.w / 2, cam + ': flat, nothing of him on the Clan\'s side: ' + Math.round(b[0]));
  }
});

test('chapter 6: at `grass`, Sleet and the cats at the post are clear of each other; in the close-up his face is clear of the two corners', () => {
  const A = art.sceneInfo('field').anchors;
  for (const cam of ['border', 'border-two']) {
    for (const pose of UPRIGHT.concat(LOW)) {
      const s = sleetBoxes(pose, A[cam].grass).body;
      for (const m of [{ who: 'player', at: 'left' }, { who: 'player', at: 'right' }, { who: 'tallyheart', at: 'right' }, { who: 'riffle', at: 'left' }, { who: 'riffle', at: 'right' }]) {
        assert.equal(overlap(s, boxes(m, A[cam][m.at]).body), 0, cam + ': ' + SLEET + ' (' + pose + ') and ' + m.who + ' at ' + m.at + ' do not touch');
      }
    }
  }
  const F = A['border-fox'];
  for (const pose of UPRIGHT.concat(LOW)) {
    const h = sleetBoxes(pose, F.grass).head;
    for (const m of [{ who: 'player', at: 'left' }, { who: 'tallyheart', at: 'right' }]) assert.equal(overlap(h, boxes(m, F[m.at]).head), 0, 'border-fox: his face (' + pose + ') is clear of the corner at ' + m.at);
    assert.ok(h[3] <= 1000 && h[1] >= 0 && h[2] <= 1600, 'border-fox: his face (' + pose + ') is in the panel: ' + h.map(Math.round));
  }
  // and in shot, everyone, in every light
  for (const cam of BORDER) for (const fx of [['day'], ['sunset'], ['dusk']]) {
    const cast = [{ who: 'player', at: cam === 'border-fox' ? 'left' : 'right', pose: 'sit' }, { who: 'riffle', at: 'left' }, { who: SLEET, at: 'grass', pose: 'sit' }];
    const scene = { set: 'field', cam, cast, fx };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, cam + ' with Sleet ' + fx[0]);
    assert.ok(r.heads[2], cam + ': Sleet\'s face is in shot');
  }
});

// The tail flicking out of the long grass is the hook into his scene (f048, f049b, f050b): after the final
// review it is drawn tall enough that its curled tip stands clear above the set's grass over him, in all
// three border cameras, never on the Clan's side of the post.
test('chapter 6: Sleet\'s tail at `grass` stands clear above the long grass over him', { skip: sleetDraws ? false : 'no sleet in cats.js yet' }, () => {
  const I = fieldInfo().border, A = art.sceneInfo('field').anchors;
  for (const cam of BORDER) {
    const g = A[cam].grass, svg = bRender(cam, [{ who: 'player', at: cam === 'border-fox' ? 'left' : 'right' }, { who: 'sleet', at: 'grass', pose: 'tail', facing: 'left' }]).svg;
    const top = +/data-part="grass-cover" data-top="([-\d.]+)"/.exec(svg)[1], tip = sleetBoxes('tail', g).head;
    assert.ok(tip[3] < top, cam + ': the curled tip (' + Math.round(tip[1]) + ' to ' + Math.round(tip[3]) + ') is above the grass over him (its top ' + Math.round(top) + ')');
    assert.ok(sleetBoxes('tail', g).body[0] > I[cam].post.x + I[cam].post.w / 2, cam + ': past the post');
  }
});

test('chapter 6: the long grass over Sleet\'s lower body: sitting up, his chest and head clear it; flat on his belly, it reaches his chin and never his face; never on the Clan\'s side of the post', () => {
  const I = fieldInfo().border, A = art.sceneInfo('field').anchors;
  for (const cam of BORDER) {
    const g = A[cam].grass, edge = I[cam].post.x + I[cam].post.w / 2;
    for (const pose of UPRIGHT.concat(LOW)) {
      const cast = [{ who: 'player', at: cam === 'border-fox' ? 'left' : 'right' }, { who: SLEET, at: 'grass', pose }];
      const svg = bRender(cam, cast).svg, blades = coverBlades(svg), sb = sleetBoxes(pose, g);
      assert.ok(blades && blades.length > 10, cam + ' ' + pose + ': the long grass over him');
      // drawn just after him (and so over him), golden like the rest of the long grass
      const him = svg.indexOf('<g transform="translate(' + num(g.x) + ' ' + num(g.y) + ')'), cover = svg.indexOf('data-part="grass-cover"');
      assert.ok(him > 0 && cover > him, cam + ' ' + pose + ': over him');
      blades.forEach((b) => assert.ok(b[0] > edge + 2, cam + ' ' + pose + ': never on the Clan\'s side: ' + b[0]));
      const H = g.h, chin = sb.head[3], inFace = (x) => x > sb.head[0] - H * 0.06 && x < sb.head[2] + H * 0.06;
      blades.forEach((b) => { if (inFace(b[0])) assert.ok(b[2] >= chin - 1, cam + ' ' + pose + ': no blade over his face: tip ' + r1(b[2]) + ', chin ' + r1(chin)); });
      const tops = blades.map((b) => g.y - b[2]);
      // (his flicking tail, since the final review, stands up out of the grass as tall as he sits, its curled
      // tip well above it: the set gives it a sitting dragonet's grass, a third of a cat's height)
      if (UPRIGHT.includes(pose) || pose === 'tail') {
        // sitting up: legs and haunches; his chest (everything over a third of a cat's height) clear
        assert.ok(Math.max(...tops) <= H * 0.36 + 1, cam + ' ' + pose + ': no higher than his haunches: ' + r1(Math.max(...tops)) + ' of ' + H);
        assert.ok(Math.max(...tops) > H * 0.25, cam + ' ' + pose + ': and long grass, not a lawn');
      } else {
        // lying low: over his lower body, about half as high as he lies, and up to his chin in front of his face
        const over = blades.filter((b) => !inFace(b[0])).map((b) => g.y - b[2]);
        assert.ok(over.length && Math.max(...over) > (g.y - sb.body[1]) * 0.35, cam + ' ' + pose + ': over his lower body');
        assert.ok(Math.max(...over) < (g.y - sb.body[1]) * 0.5 + 1, cam + ' ' + pose + ': and no higher than half of him');
      }
    }
  }
});

test('chapter 6: the fox is never drawn at the last post in this chapter, and whatever chapter 6 puts at the Barking Field renders (once the chapter is written)', (t) => {
  const ch = PC.story && PC.story.ch06;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'field' && f.board !== 'STUB.') : [];
  if (!frames.length) { t.diagnostic('chapter 6 has no frames at the Barking Field yet'); return; }
  const v = art.vocab.sets.field;
  for (const [id, f] of frames) {
    const sc = f.scene;
    assert.ok(v.cams.includes(sc.cam), id + ': camera ' + sc.cam);
    assert.ok(!(sc.cast || []).some((m) => m.who === 'reynard'), id + ': the fox is never drawn');
    for (const m of sc.cast || []) if (m.at === 'grass') assert.ok(BORDER.includes(sc.cam), id + ': `grass` is the border\'s');
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc, 'ch06 ' + id);
  }
  t.diagnostic(frames.length + ' frames at the Barking Field');
});

// ================================================================ chapter 8: the Barking Field at night
// docs/chapters/08-the-night-trail.spec.md, section 4 ("Places", the field row; "The Barking Field at night")
// and section 7, item 2 (the fingerprints, recorded once from the shipped chapter 7 snapshot)

const crypto8 = require('crypto');
const SPEC8 = path.join(ROOT, 'docs/chapters/08-the-night-trail.spec.md');
const COMP8 = { wide: 'main', dogs: 'dogs', fence: 'fence' };
const nRender = (cam, cast, opts, fx) => art.render({ set: 'field', cam, cast: cast || [], fx: fx || ['night'], opts: opts || {} }, { look: LOOK });
const night8 = () => art.fieldInfo().night;
const spots8 = (cam) => art.sceneInfo('field').anchors[COMP8[cam] || cam];
const lum8 = (h) => { const v = parseInt(h.slice(1), 16); return 0.3 * (v >> 16) + 0.59 * ((v >> 8) & 255) + 0.11 * (v & 255); };
const meets8 = (p, q, pad) => p[0] < q[2] + (pad || 0) && p[2] > q[0] - (pad || 0) && p[1] < q[3] + (pad || 0) && p[3] > q[1] - (pad || 0);
const ref8 = () => art.character('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }).h;
// A cast member's body and head where scenes.js draws it, in the world: the cats' units, a dog by its variant, the
// size band PC.art.sizeBands holds a newcomer to (the weasels), and a dragonet held to our cat's size sitting
// (Squall's rule, Hail's: SIZE_CAP in scenes.js).
const charMemo8 = new Map();
function char8(who, o) {
  const k = who + JSON.stringify(o);
  if (!charMemo8.has(k)) { const c = art.character(who, o); charMemo8.set(k, { w: c.w, h: c.h, bounds: c.bounds, headBox: c.headBox }); }
  return charMemo8.get(k);
}
function boxes8(m, a) {
  const facing = m.facing || a.face || 'right', o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing };
  if (m.variant != null) o.variant = m.variant;
  if (m.who === 'player') { o.look = LOOK; o.sex = LOOK.sex; }
  const ch = char8(m.who, o), R = char8('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }).h;
  let s = a.h / R * (m.size || 1);
  if (m.who === 'hail' || m.who === 'squall') {
    const tall = (c) => c.h - (c.headBox ? c.headBox.y0 : 0);
    s = Math.min(s, a.h / R * tall(char8('player', { pose: 'sit', mood: 'neutral', look: LOOK })) / tall(char8(m.who, { pose: 'sit', mood: 'neutral' })));
  }
  const band = art.sizeBands && art.sizeBands[m.who];
  if (band) {
    const meas = (w, pose) => { const c = char8(w, { pose, mood: 'neutral' }), hb = c.headBox; return band.by === 'head' ? ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2 : c.h - hb.y0; };
    const ratio = meas(m.who, band.pose) / meas(band.ref, 'sit');
    s = s * Math.min(band.max, Math.max(band.min, ratio)) / ratio;
  }
  const W = (b) => [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s];
  return { body: W(ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h }), head: W(ch.headBox), s };
}
// the newcomers, once app/art/cats.js draws them (until then it draws a Clan cat for an id it does not know)
const draws8 = (who) => art.vocab.cast.includes(who);
const HAIL = draws8('hail') ? 'hail' : 'squall';
const HAIL_POSES = draws8('hail') ? ['sit', 'stand', 'bounce', 'run', 'peek', 'pawup', 'tilt'] : ['sit', 'pawup', 'hug'];
const WEASELS = ['snip', 'snatch'].filter(draws8);
const WEASEL_POSES = WEASELS.length ? ['stand', 'up', 'run', 'skid', 'point', 'curl'] : ['sit'];
const CAT_POSES = ['sit', 'walk', 'stand', ...(art.vocab.poses.includes('run') ? ['run'] : [])];
// the log as it lies in this panel: [x, y, len, R] -> its open end's ellipse and its foot
function logGeo8(lg, night) {
  const ex = lg[3] * (night ? art.fieldInfo().logTurn.night : art.fieldInfo().logTurn.day);
  return { x0: lg[0] - lg[2] / 2, x1: lg[0] + lg[2] / 2, cy: lg[1] - lg[3], R: lg[3], ex, foot: lg[1], top: lg[1] - 2 * lg[3] };
}
// a keep box (percent) in the world, on a 1600-wide camera
const world8 = (k) => [k.x * 16, k.y * 10, (k.x + k.w) * 16, (k.y + k.h) * 10];

test('chapter 8: the spec names the field\'s night, `moon`, `tap: \'path\'` and the new spots; the set has each on the cameras the spec gives it, the border\'s three unchanged', () => {
  const md = fs.readFileSync(SPEC8, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['**option `moon`**', '**option `tap: \'none\' \\| \'path\'`**', '`heap-1`, `heap-2`, `heap-3` (`wide`)', '`log` (`wide` and `dogs`)', '`wire` (`dogs` and `fence`)',
    '`ring-1`…`ring-4` (`wide`)', '`fence-top` (`wide` only)', '`trail-1`, `trail-2`', 'silver in the moonlight', 'the border\'s three cameras unchanged'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  const A = art.sceneInfo('field').anchors;
  for (const [comp, list] of Object.entries(CH8_SPOTS)) for (const k of list) {
    assert.ok(A[comp][k], comp + ': ' + k);
    assert.ok(A[comp][k].elev, comp + ': ' + k + ' is out of the depth sums and the first-free pick (`elev`), so nobody of chapters 2 to 7 moves');
  }
  for (const k of CH8_ANCHORS) for (const comp of Object.keys(A)) if (!(CH8_SPOTS[comp] || []).includes(k)) assert.ok(!A[comp][k] || ANCHORS.includes(k), comp + ': no ' + k);
  for (const comp of BORDER) assert.deepEqual(Object.keys(A[comp]).sort(), SEES[comp].slice().sort(), comp + ': as chapter 6 left it');
  // which side of the wire: in the field (behind it) or out on the path and on the rail (in front of it)
  for (const [comp, list] of Object.entries(CH8_SPOTS)) for (const k of list) {
    const inside = /^(heap|ring)-|^log$|^wire$/.test(k);
    assert.equal(A[comp][k].z === 'behind', inside, comp + ': ' + k + (inside ? ' is inside the fence, behind the wire' : ' is outside it, in front of the wire'));
  }
  // every older spot exactly where it was
  assert.deepEqual(['path-left', 'path-right', 'dog-1', 'dog-2', 'dog-3', 'field'].map((k) => [A.main[k].x, A.main[k].y, A.main[k].h, A.dogs[k].x, A.dogs[k].y, A.dogs[k].h, A.fence[k].x, A.fence[k].y, A.fence[k].h]),
    [[470, 918, 250, 150, 992, 300, 330, 962, 300], [1050, 936, 262, 1450, 996, 310, 720, 948, 290], [320, 752, 150, 400, 832, 225, 1080, 786, 245],
      [800, 756, 152, 800, 836, 228, 1460, 770, 210], [1290, 752, 150, 1200, 832, 225, 560, 772, 175], [1160, 604, 84, 1150, 562, 110, 900, 534, 110]]);
});

// Every field frame of chapters 2, 4 and 6 (all by day), as the chapter 7 snapshot draws it: the frame's scene
// resolved with E.resolveScene for a fixed cat, rendered with LOOK; sha1 (12 hex) of the markup with the
// per-render ids taken out, the keep list and the heads. Recorded once from
// /Users/aron/potomac-crossing-work/ch08/shipped (engine 0.7.0) in a node process of its own.
const CH8_FIELD_FINGERPRINT = {
  'ch02:f052': '305b7005d9c8', 'ch02:f053': '11cbac433566', 'ch02:f054': 'dc62cdb35809', 'ch02:f055': '9cd9f1016a42',
  'ch02:f056': 'c7fd3724cf50', 'ch02:f057': '681253e82c8a', 'ch02:f058': '8a318c2bb1cb', 'ch04:f033': '53c5bc847024',
  'ch04:f034': '45b1bfe2e23a', 'ch04:f035a': '2c17abb3582e', 'ch04:f035b': '93d652b69e26',
  'ch04:f036': 'ac1e5ff0abf4', 'ch04:f037': 'e4bf0377e530', 'ch04:f038': '85071d6cbfc9', 'ch04:f039': '15d08e08379e',
  'ch04:f040': '211c08c46741', 'ch04:f041': '8ef01c21fc98', 'ch04:f042': '6ce8c5f3cfef', 'ch04:f043': '87c5cf3e064d',
  'ch04:f044': '683f41497a20', 'ch04:f045a': '2a9fc48c4dc4', 'ch04:f045b': '13d5353c0294',
  'ch04:f046': '6d9754879a36', 'ch04:f047': '86812e7a5f10', 'ch04:f048': '7cc6f6e88c1d', 'ch04:f049': '90f0578cf923',
  'ch04:f050': '47369be47f29', 'ch04:f051': '6e0009cbad2b', 'ch04:f052': '22afb9e7e41d', 'ch04:f053': 'de31844d3c35',
  'ch04:f054a': '3ff91589d805', 'ch04:f054b': 'e1eac7a86168', 'ch04:f055': 'fda23662917e',
  'ch04:f056': '37837ce07db0', 'ch04:f057': '40509f6b6ad5', 'ch06:f044': '795e40943820', 'ch06:f045': '91f2d32b7696',
  'ch06:f046': 'b29f297f7ec3', 'ch06:f047': 'e162ced2140d', 'ch06:f048': '7f9aee893efe',
  'ch06:f049a': 'd5646c97574b', 'ch06:f049b': '481190d2fa02', 'ch06:f050a': '24803bdf40ae',
  'ch06:f050b': '2eb778e42009', 'ch06:f051a': 'ae2d897b3810', 'ch06:f052a': 'fd84d136e796',
  'ch06:f053a': '4b48636fd2c3', 'ch06:f054a': 'acf4e9986578', 'ch06:f055a': '42a259060fa9',
  'ch06:f056a': 'e3c4f3b6e4e4', 'ch06:f057a': '5fe8d4370021', 'ch06:f058a': '05a623e54f3e',
  'ch06:f059a': 'a2349c52f3c7', 'ch06:f060a': '3cebfd15784b', 'ch06:f061a': 'eee0e4afc407',
  'ch06:f062a': 'ed664c4a7718', 'ch06:f063a': 'e41081094ab3', 'ch06:f064a': 'b3b1ab703d3c',
  'ch06:f065a': '99114a19d687', 'ch06:f066a': 'ede023a4e7db', 'ch06:f067a': 'cdb511ffc358',
  'ch06:f068a': '1439b52b7743'
};
const fpCat8 = () => { const c = PC.engine.blankCat({ id: 'fingerprint', now: 0, look: LOOK }); c.name = 'Pebble'; c.petname = 'Pebble'; return c; };
function frameHash8(set, ids) {
  const E = PC.engine, cat = fpCat8(), stories = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07'].map((id) => PC.story[id]).filter(Boolean), out = {};
  for (const id of ids) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    if (!f.scene || f.scene.set !== set) continue;
    const r = art.render(E.resolveScene(f.scene, cat, stories), { look: LOOK });
    out[id + ':' + fid] = crypto8.createHash('sha1').update(r.svg.replace(/pcs?[0-9a-z]+-/g, '') + JSON.stringify(r.keep) + JSON.stringify(r.heads)).digest('hex').slice(0, 12);
  }
  return out;
}

test('chapter 8: every field frame of chapters 2, 4 and 6 draws exactly as the chapter 7 snapshot drew it (fingerprints)', () => {
  const now = frameHash8('field', ['ch02', 'ch04', 'ch06']);
  assert.deepEqual(Object.keys(now).sort(), Object.keys(CH8_FIELD_FINGERPRINT).sort(), 'the same frames visit the field');
  for (const [k, want] of Object.entries(CH8_FIELD_FINGERPRINT)) assert.equal(now[k], want, k + ': drawn as it was');
});

// The sweep (recorded once from the snapshot, in a process of its own, with exactly this code)
const SWEEP_LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const sweepStrip = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');
// One hash per camera: every picture the field drew before chapter 8 (by day, morning, sunset and dusk, with and
// without the fox's tail), empty and with someone at every spot chapters 2 to 7 knew, chapter 7's poses only.
function fieldSweep(art) {
  const SPOTS = {
    wide: ['path-left', 'path-right', 'dog-1', 'dog-2', 'dog-3', 'field'], fence: ['path-left', 'path-right', 'dog-1', 'dog-2', 'dog-3', 'field'],
    dogs: ['path-left', 'path-right', 'dog-1', 'dog-2', 'dog-3', 'field'],
    border: ['fox', 'lead', 'left', 'right', 'back-1', 'back-2', 'back-3', 'back-4', 'dog-1', 'dog-2', 'dog-3', 'grass'],
    'border-two': ['fox', 'lead', 'left', 'right', 'back-1', 'back-2', 'back-3', 'back-4', 'dog-1', 'dog-2', 'dog-3', 'grass'],
    'border-fox': ['fox', 'lead', 'left', 'right', 'dog-1', 'dog-2', 'dog-3', 'grass']
  };
  const member = (at, i) => at.startsWith('dog-') ? { who: 'dog', variant: 1 + (i % 3), pose: ['bounce', 'jump', 'sit', 'stand', 'howl'][i % 5], at }
    : at === 'fox' ? { who: 'reynard', pose: 'sit', at } : at === 'grass' ? { who: 'sleet', pose: 'sit', at } : at === 'field' ? { who: 'clancat', variant: 2, at }
      : { who: ['player', 'tallyheart', 'glintstar', 'riffle'][i % 4], pose: ['sit', 'walk', 'stand'][i % 3], mood: ['happy', 'wonder', 'neutral'][i % 3], at };
  const out = {};
  for (const cam of Object.keys(SPOTS)) {
    const h = crypto8.createHash('sha1');
    for (const fx of [['day'], ['morning'], ['sunset'], ['dusk']]) for (const opts of [{}, { foxTail: true }]) for (const cast of [[], SPOTS[cam].map(member)]) {
      const r = art.render({ set: 'field', cam, fx, opts, cast }, { look: SWEEP_LOOK });
      h.update(sweepStrip(r.svg) + JSON.stringify(r.keep) + JSON.stringify(r.heads));
    }
    out[cam] = h.digest('hex').slice(0, 16);
  }
  return out;
}

test('chapter 8: every picture the field drew before, every camera by day, morning, sunset and dusk, empty and with someone at every older spot, is byte for byte the snapshot\'s; the new options off, or where they do not belong, are nothing at all', () => {
  assert.deepEqual(fieldSweep(art), {
    'wide': 'e9a96d74d12b4d6b',
    'fence': '59907105162e47a6',
    'dogs': '0fb6360d2a225b13',
    'border': 'c6c223dcf7095081',
    'border-two': '33166f1c8e06efd5',
    'border-fox': '1cbabc611c73d386'
  }, 'recorded from the chapter 7 snapshot');
  for (const cam of [...CAMS, ...BORDER]) for (const fx of [['day'], ['dusk']]) {
    const cast = cam.startsWith('border') ? [FOX, CLAN[1]] : [{ who: 'player', at: 'path-left', pose: 'walk' }, { who: 'dog', variant: 2, at: 'dog-2', pose: 'bounce' }];
    const plain = bRender(cam, cast, fx), same = (opts, why) => assert.equal(strip(bRender(cam, cast, fx, opts).svg), strip(plain.svg), cam + ' ' + fx + ': ' + why);
    same({ moon: false, tap: 'none' }, 'off is nothing');
    for (const moon of [true, 0, 'x']) same({ moon }, 'a moon that is not a number of evenings draws none');
    if (cam.startsWith('border')) { same({ tap: 'path' }, 'no path Tap at the border'); same({ moon: 8 }, 'no moon at the border'); }
    if (fx[0] === 'day') same({ moon: 8 }, 'no moon by day');
    assert.deepEqual(bRender(cam, cast, fx, { moon: false, tap: 'none' }).keep, plain.keep);
  }
  for (const cam of CAMS) for (const fx of [['morning'], ['sunset']]) assert.equal(strip(bRender(cam, [], fx, { moon: 8 }).svg), strip(bRender(cam, [], fx).svg), cam + ' ' + fx + ': no moon');
});

test('chapter 8: the field at night is silver in the moonlight: the grass, the path and the wire catch a cool silver light, the sky deep blue with stars; nothing of it by day or at dusk', () => {
  const P = art.kit.PAL.night;
  for (const cam of CAMS) {
    const svg = nRender(cam).svg, day = bRender(cam).svg, dusk = bRender(cam, [], ['dusk']).svg;
    checkRender({ svg, heads: [] }, { cast: [] }, cam + ' at night');
    assert.equal(count(svg, /data-part="moonlight"/g), 2, cam + ': moonlight over the field and along the path');
    assert.equal(count(day, /data-part="moonlight"/g) + count(dusk, /data-part="moonlight"/g), 0, cam + ': not by day or at dusk');
    assert.ok(svg.includes(P.sky[0]) && count(svg, /class="pcs-twk"/g) >= 5, cam + ': the night sky, with stars');
    // the wire: its highlight strand silver, light and cool
    const fence = svg.slice(fenceAt(svg)), hi = /<path d="[^"]+" fill="none" stroke="(#[0-9a-f]{6})" stroke-width="[\d.]+"[^>]* opacity="0.6"/.exec(fence);
    assert.ok(hi && lum8(hi[1]) > 200 && parseInt(hi[1].slice(5), 16) >= parseInt(hi[1].slice(1, 3), 16), cam + ': the wire catches a silver light: ' + (hi && hi[1]));
    // the path: its moonlit edge light, its far side brightest
    const stops = [...svg.matchAll(/<stop offset="[\d.]+" stop-color="(#[0-9a-f]{6})"\/>/g)].map((m) => lum8(m[1]));
    assert.ok(Math.max(...stops) > 170, cam + ': a silver path: ' + Math.max(...stops).toFixed(0));
    // the grass's light blades silver, the night palette's own mixed with it (never the dark teal alone)
    assert.ok(!svg.includes('fill="' + P.grassLight + '"'), cam + ': the light blades are not the plain night green');
  }
});

test('chapter 8: the hollow log at night: turned toward the path, its cut end lit and its mouth dark, so it reads; on `dogs` nearer and bigger, its open end between the dogs at `dog-2` and `dog-3`, clear of their faces; by day exactly where it was', () => {
  const N = night8();
  assert.deepEqual(N.main.dayLog, [706, 584, 134, 18]);
  assert.deepEqual(N.dogs.dayLog, [1004, 546, 150, 20]);
  assert.deepEqual(N.fence.dayLog, [1290, 474, 160, 22]);
  for (const cam of CAMS) {
    const comp = COMP8[cam], lg = N[comp].log, G = logGeo8(lg, true), svg = nRender(cam).svg;
    const at = svg.indexOf('data-part="log"'), grp = svg.slice(svg.lastIndexOf('<g', at), svg.indexOf('data-part=', at + 20) > 0 ? svg.indexOf('data-part=', at + 20) : svg.length);
    const ells = [...grp.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([\d.]+)" ry="([\d.]+)" fill="(#[0-9a-f]{6})"/g)].map((m) => ({ cx: +m[1], cy: +m[2], rx: +m[3], ry: +m[4], fill: m[5] }));
    const cut = ells.find((e) => Math.abs(e.cx - G.x0) < 0.2 && Math.abs(e.ry - G.R) < 0.2), hollow = ells.find((e) => Math.abs(e.ry - G.R * 0.7) < 0.2);
    assert.ok(cut && hollow, cam + ': the open end and its hollow');
    assert.ok(Math.abs(cut.rx / cut.ry - 0.8) < 0.02, cam + ': turned toward the path, nearly round: ' + (cut.rx / cut.ry).toFixed(2));
    assert.ok(lum8(cut.fill) > 140 && lum8(hollow.fill) < lum8(cut.fill) * 0.3, cam + ': the cut end lit, the mouth dark: ' + cut.fill + ' / ' + hollow.fill);
    // by day it is the old one, 0.46 of its radius turned
    const dsvg = bRender(cam).svg, dG = logGeo8(N[comp].dayLog, false);
    assert.ok(new RegExp('<ellipse cx="' + num(dG.x0) + '" cy="' + num(dG.cy) + '" rx="' + num(dG.ex) + '" ry="' + num(dG.R) + '"').test(dsvg), cam + ': by day, as ever');
  }
  // wide and fence: where it lies by day; dogs: nearer (lower in the panel) and much bigger, still inside the fence
  assert.ok(Math.abs(N.main.log[0] - N.main.dayLog[0]) < 10 && Math.abs(N.main.log[1] - N.main.dayLog[1]) < 10, 'wide: the same place');
  assert.deepEqual(N.fence.log, N.fence.dayLog);
  const D = N.dogs.log, G = logGeo8(D, true);
  assert.ok(D[3] >= 2.4 * N.dogs.dayLog[3] && D[1] > N.dogs.dayLog[1] + 100 && D[1] < N.dogs.fence.base - 100, 'dogs: nearer and bigger, inside the fence: ' + D);
  const A = spots8('dogs'), mouth = [G.x0 - G.ex, G.cy - G.R, G.x0 + G.ex, G.cy + G.R];
  for (const pose of art.vocab.otherPoses.dog) for (const v of [2, 3]) {
    const b = boxes8({ who: 'dog', variant: v, pose }, A['dog-' + v]);
    assert.ok(!meets8(b.head, mouth), 'dogs: the log\'s open end is clear of the dog at dog-' + v + ' (' + pose + '): ' + b.head.map(Math.round));
  }
});

test('chapter 8: `log` (`wide`, `dogs`): at the night log\'s open end; whoever is there gets its near rim drawn over her lower body, just after her, head and shoulders out; on `dogs` her face is big enough to read; nobody there, nothing', () => {
  const N = night8();
  for (const cam of ['wide', 'dogs']) {
    const a = spots8(cam).log, G = logGeo8(N[COMP8[cam]].log, true);
    assert.ok(Math.abs(a.x - G.x0) <= G.ex * 0.3 && Math.abs(a.y - G.foot) <= G.R * 0.5, cam + ': at the open end');
    for (const pose of HAIL_POSES) {
      const cast = [{ who: HAIL, at: 'log', pose, mood: 'happy' }, { who: 'player', at: 'path-left' }, { who: 'tallyheart', at: 'path-right' }];
      const r = nRender(cam, cast, { moon: 8 });
      checkRender(r, { cast }, cam + ' ' + HAIL + ' ' + pose + ' at log');
      assert.ok(r.heads[0], cam + ': her face in the panel (' + pose + ')');
      assert.equal(count(r.svg, /data-part="log-cover"/g), 1, cam + ': one cover');
      const me = drawnAt(r.svg, a), cov = r.svg.indexOf('data-part="log-cover"'), next = drawnAt(r.svg, spots8(cam)['path-left']);
      assert.ok(me > 0 && cov > me && cov < fenceAt(r.svg) && cov < next, cam + ': drawn just after her, behind the wire');
      const top = +/data-part="log-cover" data-top="([\d.]+)"/.exec(r.svg)[1], b = boxes8(cast[0], a);
      assert.ok(top >= G.cy - G.R * 0.36 && top <= G.cy + G.R * 0.56, cam + ': the rim\'s top is inside the open end: ' + top);
      assert.ok(top > b.head[1] + (b.head[3] - b.head[1]) * 0.5 || top >= G.cy + G.R * 0.55 - 0.1, cam + ' ' + pose + ': her head out over the rim: ' + top + ' head ' + b.head.map(Math.round));
    }
    // nobody there: no cover, at night or by day, with everyone else about
    for (const fx of [['night'], ['day']]) assert.equal(count(nRender(cam, [{ who: 'player', at: 'path-left' }, { who: 'dog', at: 'dog-1', pose: 'sit' }], {}, fx).svg, /log-cover/g), 0, cam + ': no cover without her');
  }
  // big enough on `dogs` for her face to read (an iPad page is about 680 px across: 48 world units are 20 px), and
  // far bigger than in the wide shot
  const hd = (cam) => { const b = boxes8({ who: HAIL, pose: 'sit' }, spots8(cam).log).head; return b[3] - b[1]; };
  assert.ok(hd('dogs') >= 48 && hd('dogs') >= 1.8 * hd('wide'), 'her face on `dogs`: ' + hd('dogs').toFixed(1) + ', in the wide shot ' + hd('wide').toFixed(1));
  assert.equal(nRender('fence', [{ who: HAIL, at: 'log' }]).heads[0], null, 'fence: the log is out of this camera\'s spots');
});

test('chapter 8: `moon: 8` is the eighth evening\'s half moon, high in the sky of `wide`, `dogs` and `fence` (behind the wire in the two close ones), at night or dusk only; in keep; clear of the towers, the trees and every head; each evening bigger and higher', () => {
  const N = night8();
  for (const cam of CAMS) {
    const comp = COMP8[cam], M = N[comp].moon(8);
    for (const fx of [['night'], ['dusk']]) {
      const r = nRender(cam, [], { moon: 8 }, fx);
      assert.equal(count(r.svg, /data-prop="waxing-moon" data-age="8"/g), 1, cam + ' ' + fx + ': one moon');
      if (cam !== 'wide') assert.ok(r.svg.indexOf('waxing-moon') < fenceAt(r.svg), cam + ': behind the wire');
      const box = [M.x - M.r, M.y - M.r, M.x + M.r, M.y + M.r];
      assert.ok(r.keep.map(world8).some((k) => k[0] <= box[0] + 1 && k[1] <= box[1] + 1 && k[2] >= box[2] - 1 && k[3] >= box[3] - 1), cam + ': kept clear of the lettering');
    }
    // a half moon (the terminator nearly straight), lit on the side the sun went down: the kit's waxingMoon
    const svg = nRender(cam, [], { moon: 8 }).svg, g = svg.slice(svg.indexOf('data-prop="waxing-moon"'));
    const arcs = [...g.matchAll(/A([\d.]+) ([\d.]+) 0 0 [01]/g)].map((m) => [+m[1], +m[2]]);
    assert.ok(arcs.length >= 2 && arcs[1][0] <= arcs[0][0] * 0.12, cam + ': a half moon: ' + JSON.stringify(arcs.slice(0, 2)));
    // high in the sky: over the trees, clear of every tower
    const box = [M.x - M.r, M.y - M.r, M.x + M.r, M.y + M.r];
    for (const t of N[comp].towers) assert.ok(!meets8(box, [t.x, t.top, t.x + t.w, t.base], 4), cam + ': clear of the tower at ' + t.x);
    assert.ok(box[3] < { main: 428, dogs: 340, fence: 266 }[comp] - 60 && box[1] > 0, cam + ': high, well over the trees: ' + box.map(Math.round));
    // the ninth evening's is bigger and higher (the art's clock): nothing to change in later chapters
    const M9 = N[comp].moon(9);
    assert.ok(M9.r > M.r && M9.y < M.y, cam + ': each evening bigger and higher');
  }
  // clear of every head in the panels that use it: the cats on the path, the climber on the rail, Hail in the log or at the wire
  const casts = { wide: [[{ who: 'player', at: 'path-left', pose: 'walk' }, { who: 'tallyheart', at: 'path-right', pose: 'walk' }], [{ who: 'player', at: 'fence-top', pose: 'walk' }], [{ who: HAIL, at: 'ring-1', pose: 'sit' }, { who: HAIL, at: 'ring-3', pose: 'sit' }]],
    dogs: [[{ who: HAIL, at: 'log', pose: 'sit' }, { who: HAIL, at: 'wire', pose: 'sit' }, { who: 'dog', variant: 1, at: 'dog-1', pose: 'jump' }]], fence: [[{ who: HAIL, at: 'wire', pose: 'sit' }, { who: 'player', at: 'path-left' }]] };
  for (const [cam, list] of Object.entries(casts)) {
    const M = N[COMP8[cam]].moon(8), box = [M.x - M.r, M.y - M.r, M.x + M.r, M.y + M.r];
    for (const cast of list) for (const m of cast) assert.ok(!meets8(boxes8(m, spots8(cam)[m.at]).head, box, 8), cam + ': the moon is clear of ' + m.who + ' at ' + m.at);
  }
});

test('chapter 8: `tap: \'path\'` on `wide`, `dogs` and `fence`: one unpainted pc-tap rect over the path ahead on the right (the way to the tracks), clear of the cats on the path, first in keep; nothing else changes; not at the border', () => {
  const N = night8();
  for (const cam of CAMS) for (const fx of [['night'], ['day']]) {
    const comp = COMP8[cam], A = spots8(cam);
    const cast = [{ who: 'player', at: 'path-left', pose: 'walk' }, { who: 'tallyheart', at: 'path-right', pose: 'walk' }];
    const r = nRender(cam, cast, { tap: 'path' }, fx), plain = nRender(cam, cast, {}, fx);
    const rects = r.svg.match(/<rect [^>]*class="pc-tap"[^>]*\/>/g) || [];
    assert.equal(rects.length, 1, cam + ': one target');
    assert.ok(/data-tap="path"/.test(rects[0]) && /fill="none"/.test(rects[0]) && /pointer-events="none"/.test(rects[0]), cam + ': named `path`, unpainted');
    assert.equal(strip(r.svg.replace(rects[0], '')), strip(plain.svg), cam + ' ' + fx + ': the only change');
    const T = N[comp].tapPath, box = [T.x, T.y, T.x + T.w, T.y + T.h];
    const k = world8(r.keep[0]);
    assert.ok(k[0] <= box[0] && k[1] <= box[1] && k[2] >= Math.min(1600, box[2]) - 0.5 && k[3] >= Math.min(1000, box[3]) - 0.5, cam + ': first in keep');
    // on the path, toward the right: the way to the tracks (home is to the left)
    assert.ok(box[1] >= N[comp].pathTop - 20 && box[3] >= 995 && (box[0] + box[2]) / 2 > 800, cam + ': on the path, on the right: ' + box);
    // clear of a cat at either spot on the path, in every pose she walks, sits or runs in, facing either way
    for (const pose of CAT_POSES) for (const facing of ['right', 'left']) for (const who of ['player', 'tallyheart']) {
      const L = boxes8({ who, pose, facing }, A['path-left']).body, R = boxes8({ who, pose, facing }, A['path-right']).body;
      assert.ok(box[0] >= L[2] - 2, cam + ': right of ' + who + ' (' + pose + ', ' + facing + ') at path-left');
      if (cam !== 'dogs') assert.ok(box[0] >= R[2] - 2, cam + ': right of ' + who + ' (' + pose + ', ' + facing + ') at path-right: ' + Math.round(R[2]));
      else assert.ok(box[2] <= R[0] + 2, 'dogs: left of ' + who + ' (' + pose + ', ' + facing + ') at path-right, at the panel\'s edge: ' + Math.round(R[0]));
    }
  }
  assert.equal(count(nRender('wide').svg, /pc-tap/g), 0, 'none without it');
});

test('chapter 8: the heap (`heap-1`..`heap-3`, `wide`): three dogs lying close together inside the fence, near it, behind the wire, between the cats\' two spots; every face clear of the cats walking by; Good Boy sitting up at `heap-1` has his head clear of the other two', () => {
  const A = spots8('wide'), F = night8().main.fence, H = ['heap-1', 'heap-2', 'heap-3'].map((k) => A[k]);
  for (const a of H) {
    assert.ok(a.y < F.base && a.y > F.base - 30 && a.z === 'behind', 'near the fence, inside it: ' + a.y);
    assert.ok(a.x > A['path-left'].x && a.x < A['path-right'].x, 'between the cats\' spots: ' + a.x);
  }
  const xs = H.map((a) => a.x).sort((p, q) => p - q);
  assert.ok(xs[1] - xs[0] <= 170 && xs[2] - xs[1] <= 170, 'close together: ' + xs);
  const lying = [1, 2, 3].map((v) => ({ who: 'dog', variant: v, at: 'heap-' + v, pose: 'lie', asleep: true }));
  const cats = [{ who: 'player', at: 'path-left', pose: 'walk', facing: 'right' }, { who: 'tallyheart', at: 'path-right', pose: 'walk', facing: 'right' },
    { who: 'tallyheart', at: 'path-left', pose: 'walk', facing: 'right' }, { who: 'player', at: 'path-right', pose: 'walk', facing: 'right' }];
  for (const d of lying) for (const c of cats) assert.ok(!meets8(boxes8(d, A[d.at]).head, boxes8(c, A[c.at]).head), d.at + ': the dog\'s face is clear of ' + c.who + ' at ' + c.at);
  const r = nRender('wide', [...lying, cats[0], cats[1]], { moon: 8 }, ['night', 'zzz']);
  checkRender(r, { cast: [...lying, cats[0], cats[1]] }, 'the heap');
  for (const d of lying) { const i = drawnAt(r.svg, A[d.at]); assert.ok(i > 0 && i < fenceAt(r.svg), d.at + ': behind the wire'); }
  const up = boxes8({ who: 'dog', variant: 1, pose: 'sit' }, A['heap-1']).head;
  for (const d of lying.slice(1)) assert.ok(!meets8(up, boxes8(d, A[d.at]).body), 'Good Boy\'s head up, clear of the dog at ' + d.at);
});

test('chapter 8: `wire` (`dogs`, `fence`): inside, at the wire; on `dogs` beside the dogs, in the gap between `dog-2` and `dog-3`, and bouncing she stretches the wire; in `fence` face to face with a cat on the path at `path-left`, the diamonds open round her face, which the lettering keeps off', () => {
  for (const cam of ['dogs', 'fence']) {
    const a = spots8(cam).wire, F = night8()[COMP8[cam]].fence;
    assert.ok(a.z === 'behind' && a.y < F.base && a.y > F.base - 20, cam + ': inside, at the wire: ' + a.y);
  }
  const D = spots8('dogs');
  assert.ok(D.wire.x > D['dog-2'].x && D.wire.x < D['dog-3'].x, 'dogs: between dog-2 and dog-3');
  for (const pose of HAIL_POSES) {
    const me = boxes8({ who: HAIL, pose }, D.wire);
    for (const v of [2, 3]) for (const dp of ['sit', 'stand', 'bounce']) assert.ok(!meets8(me.head, boxes8({ who: 'dog', variant: v, pose: dp }, D['dog-' + v]).head), 'dogs: her face (' + pose + ') clear of the dog at dog-' + v + ' (' + dp + ')');
  }
  const still = nRender('dogs', [{ who: HAIL, at: 'wire', pose: 'sit' }]).svg, empty = nRender('dogs').svg;
  assert.equal(wireOf(still), wireOf(empty), 'dogs: sitting at the wire leaves it alone');
  for (const pose of ['bounce', 'jump']) {
    const svg = nRender('dogs', [{ who: HAIL, at: 'wire', pose }]).svg;
    assert.ok(wireOf(svg).length > wireOf(empty).length && count(svg, /pcs-pulse/g) > count(empty, /pcs-pulse/g), 'dogs: ' + pose + ': BOING, the wire stretches and the rail rattles');
  }
  // fence: face to face with our cat on the path
  const Fa = spots8('fence'), cat = { who: 'player', at: 'path-left', pose: 'sit', facing: 'right' };
  assert.ok(Fa.wire.x > Fa['path-left'].x && Fa.wire.face === 'left', 'fence: right of her, facing her');
  const her = boxes8({ who: HAIL, pose: 'sit' }, Fa.wire), mine = boxes8(cat, Fa['path-left']);
  assert.ok(!meets8(her.body, mine.body), 'fence: not on top of each other');
  assert.ok(her.head[0] - mine.head[2] < 260 && her.head[3] > mine.head[1] - 120, 'fence: face to face across the wire: ' + her.head.map(Math.round) + ' / ' + mine.head.map(Math.round));
  const r = nRender('fence', [{ who: HAIL, at: 'wire', pose: 'sit' }, cat]), e = nRender('fence', [cat]);
  const cx = (her.head[0] + her.head[2]) / 2, cy = (her.head[1] + her.head[3]) / 2, cell = night8().fence.fence.cell;
  assert.ok(clearance(e.svg, cx, cy) < cell * 0.45 && clearance(r.svg, cx, cy) > cell * 0.3, 'fence: the wire opens round her face: ' + clearance(e.svg, cx, cy).toFixed(1) + ' -> ' + clearance(r.svg, cx, cy).toFixed(1));
  assert.ok(r.keep.map(world8).some((k) => k[0] <= cx && k[2] >= cx && k[1] <= cy && k[3] >= cy), 'fence: the lettering keeps off her face');
  assert.deepEqual(e.keep, [], 'and nothing without her');
});

test('chapter 8: `ring-1`..`ring-4` (`wide`): four spots round the log inside the fence, the near two running right and the far two back left; clear of the posts and of each other, and `ring-1` of the dogs at the wire', () => {
  const A = spots8('wide'), N = night8().main, G = logGeo8(N.log, true), R = ['ring-1', 'ring-2', 'ring-3', 'ring-4'].map((k) => A[k]);
  for (const a of R) assert.ok(a.z === 'behind' && a.y > 542 && a.y < N.fence.base - 40, 'inside the fence, in the field: ' + a.y);
  assert.ok(R[0].y > G.foot && R[1].y > G.foot && R[0].face === 'right' && R[1].face === 'right' && R[0].x < R[1].x, 'the near two, nearer than the log, running right');
  assert.ok(R[2].y < R[1].y && R[3].y < R[0].y && R[2].face === 'left' && R[3].face === 'left' && R[2].x > R[3].x, 'the far two running back left');
  assert.ok(Math.min(R[0].x, R[3].x) < G.x0 && Math.max(R[1].x, R[2].x) > G.x1, 'round the log');
  // whoever runs where, nobody's face is behind another's, or behind a post (each post 20 wide)
  const runners = [{ who: 'dog', variant: 1, pose: 'bounce' }, { who: 'dog', variant: 2, pose: 'bounce' }, { who: 'dog', variant: 3, pose: 'bounce' }, ...HAIL_POSES.map((pose) => ({ who: HAIL, pose }))];
  for (let i = 0; i < 4; i++) for (const p of runners) {
    const h = boxes8(Object.assign({ facing: R[i].face }, p), R[i]).head;
    for (const x of N.fence.posts) assert.ok(h[0] > x + 12 || h[2] < x - 12, 'ring-' + (i + 1) + ': ' + p.who + (p.variant || '') + ' ' + p.pose + '\'s face clear of the post at ' + x + ': ' + h.map(Math.round));
  }
  const heads = R.map((a) => runners.map((p) => boxes8(Object.assign({ facing: a.face }, p), a).head));
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) runners.forEach((p, pi) => runners.forEach((q, qi) => {
    assert.ok(!meets8(heads[i][pi], heads[j][qi]), 'ring-' + (i + 1) + ' (' + p.who + (p.variant || '') + ' ' + p.pose + ') and ring-' + (j + 1) + ' (' + q.who + (q.variant || '') + ' ' + q.pose + ')');
  }));
  for (const pose of HAIL_POSES) for (let v = 1; v <= 3; v++) for (const dp of art.vocab.otherPoses.dog) {
    assert.ok(!meets8(boxes8({ who: HAIL, pose, facing: 'right' }, R[0]).head, boxes8({ who: 'dog', variant: v, pose: dp }, A['dog-' + v]).head), 'ring-1 (' + pose + ') clear of the dog at dog-' + v + ' (' + dp + ')');
  }
  const cast = [{ who: HAIL, at: 'ring-1', pose: 'sit' }, { who: 'dog', variant: 1, at: 'ring-2', pose: 'bounce' }, { who: 'dog', variant: 2, at: 'ring-3', pose: 'bounce' }, { who: 'dog', variant: 3, at: 'ring-4', pose: 'bounce' }];
  const r = nRender('wide', cast, { moon: 8 }, ['night', 'motion']);
  checkRender(r, { cast }, 'the circle');
  r.heads.forEach((h, i) => { assert.ok(h, cast[i].at + ' in sight'); assert.ok(drawnAt(r.svg, A[cast[i].at]) < fenceAt(r.svg), cast[i].at + ': behind the wire'); });
});

test('chapter 8: `fence-top` on `wide` only: on the top rail between two posts, in front of the wire; a cat of h 180 to 220 walking it is inside the panel, the dogs jumping below her', () => {
  const A = spots8('wide'), F = night8().main.fence, a = A['fence-top'];
  assert.ok(a.h >= 180 && a.h <= 220, 'a cat of h 180 to 220: ' + a.h);
  assert.ok(Math.abs(a.y - (F.top - F.rail / 2)) <= 2, 'standing on the rail: ' + a.y);
  assert.equal(a.face, 'right', 'walking toward the tracks');
  // the night sky's plane (wide's, at x 930, y 150, pinned by the day frames of chapters 2, 4 and 6) never at her
  // nose: the review saw it fly into a climber's face at x 800
  for (const pose of ['walk', 'stand']) assert.ok(boxes8({ who: 'player', pose, facing: 'right' }, a).body[2] < 930 - 200, pose + ': well left of the plane');
  for (const who of ['player', 'tallyheart']) for (const pose of ['walk', 'stand', 'crouch', 'sit']) {
    const b = boxes8({ who, pose, facing: 'right' }, a).body;
    assert.ok(b[0] >= 0 && b[1] >= 0 && b[2] <= 1600 && b[3] <= 1000, who + ' ' + pose + ': inside the panel: ' + b.map(Math.round));
    const i = F.posts.findIndex((p) => p > a.x);
    assert.ok(i > 0 && b[0] > F.posts[i - 1] + 10 && b[2] < F.posts[i] - 10, who + ' ' + pose + ': between two posts');
    for (let v = 1; v <= 3; v++) assert.ok(boxes8({ who: 'dog', variant: v, pose: 'jump' }, A['dog-' + v]).body[1] > a.y + 60, 'the dog at dog-' + v + ' jumps below her');
  }
  const cast = [{ who: 'player', at: 'fence-top', pose: 'walk' }, { who: 'dog', variant: 1, at: 'dog-1', pose: 'jump' }, { who: 'dog', variant: 2, at: 'dog-2', pose: 'jump' }, { who: 'dog', variant: 3, at: 'dog-3', pose: 'jump' }];
  const r = nRender('wide', cast, { moon: 8, tap: 'path' });
  checkRender(r, { cast }, 'on the fence top');
  assert.ok(r.heads[0] && r.heads[0].y > 3 && r.heads[0].y < 50, 'her face in the panel, high up: ' + JSON.stringify(r.heads[0]));
  assert.ok(drawnAt(r.svg, a) > fenceAt(r.svg), 'in front of the wire');
  // not on `dogs` (its rail is at y 74: she would stand almost wholly above the panel) nor on `fence`
  assert.equal(night8().dogs.fence.top, 74);
  for (const cam of ['dogs', 'fence']) { assert.ok(!spots8(cam)['fence-top'], cam + ': no fence-top'); assert.equal(nRender(cam, [{ who: 'player', at: 'fence-top' }]).heads[0], null, cam + ': out of sight'); }
});

test('chapter 8: `trail-1`, `trail-2`: on `wide` on the path right of `path-right`, facing left (home); on `dogs` along the middle of the path, about x 700 and x 1050; the weasels there are inside the panel, in front of the wire', () => {
  const W = spots8('wide'), D = spots8('dogs'), N = night8();
  for (const k of ['trail-1', 'trail-2']) {
    assert.ok(W[k].x > W['path-right'].x + 150 && W[k].y > N.main.pathTop && W[k].z !== 'behind' && W[k].face === 'left', 'wide: ' + k + ' on the path right of path-right, facing home');
    assert.ok(D[k].y > N.dogs.pathTop && D[k].y < 1000 && D[k].z !== 'behind' && D[k].face === 'left', 'dogs: ' + k + ' on the path, facing home');
  }
  assert.ok(Math.abs(D['trail-1'].x - 700) <= 60 && Math.abs(D['trail-2'].x - 1050) <= 60, 'dogs: about x 700 and x 1050');
  assert.ok(W['trail-1'].x < W['trail-2'].x, 'wide: one behind the other');
  const who = WEASELS.length ? WEASELS : ['clancat'];
  for (const cam of ['wide', 'dogs']) for (const w of who) for (const pose of WEASEL_POSES) {
    const cast = [{ who: w, at: 'trail-1', pose, size: WEASELS.length ? 1 : 0.6 }, { who: w === 'snip' ? 'snatch' : w, at: 'trail-2', pose, size: WEASELS.length ? 1 : 0.6 }];
    const r = nRender(cam, cast, { moon: 8 });
    checkRender(r, { cast }, cam + ' weasels ' + pose);
    for (let i = 0; i < 2; i++) {
      const a = (cam === 'wide' ? W : D)['trail-' + (i + 1)], b = boxes8(cast[i], a).body;
      assert.ok(r.heads[i] && b[0] >= 0 && b[2] <= 1600 && b[1] >= 0 && b[3] <= 1000.5, cam + ' ' + pose + ': trail-' + (i + 1) + ' inside the panel: ' + b.map(Math.round));
      assert.ok(drawnAt(r.svg, a) > fenceAt(r.svg), cam + ': in front of the wire');
    }
  }
});

test('chapter 8: whatever chapter 8 puts at the Barking Field renders: at night, on chapter 2\'s cameras, every new spot on a camera that has it (once the chapter is written)', (t) => {
  const ch = PC.story && PC.story.ch08;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'field' && f.board !== 'STUB.') : [];
  if (!frames.length) { t.diagnostic('chapter 8 has no frames at the Barking Field yet'); return; }
  const v = art.vocab.sets.field, A = art.sceneInfo('field').anchors;
  for (const [id, f] of frames) {
    const sc = f.scene;
    assert.ok(CAMS.includes(sc.cam), id + ': one of chapter 2\'s cameras: ' + sc.cam);
    assert.ok((sc.fx || []).includes('night'), id + ': at night');
    for (const k of Object.keys(sc.opts || {})) assert.ok(k in v.opts, id + ': option ' + k);
    for (const m of sc.cast || []) if (typeof m.at === 'string') assert.ok(A[COMP8[sc.cam]][m.at], id + ': ' + m.at + ' is a spot of ' + sc.cam);
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc, 'ch08 ' + id);
    r.heads.forEach((h, i) => assert.ok(h, id + ': ' + (sc.cast[i].who || '?') + ' in sight'));
  }
  t.diagnostic(frames.length + ' frames at the Barking Field');
});

// the grass drawn over a cat lying flat on the path at night, every group of it: its blades, as coverBlades reads them
const meAt0 = (svg) => svg.indexOf('<g transform="translate(470 975)');
function pathGrass8(svg) {
  const out = [];
  for (let at = svg.indexOf('data-part="path-grass"'); at >= 0; at = svg.indexOf('data-part="path-grass"', at + 1)) {
    const g = svg.slice(svg.lastIndexOf('<g', at), svg.indexOf('</g>', at));
    out.push((g.match(/M[-\d.]+ [-\d.]+Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+Z/g) || []).map((b) => { const v = b.match(/[-\d.]+/g).map(Number); return [(v[0] + v[8]) / 2, v[1], Math.min(v[1], v[5])]; }));
  }
  return out;
}

test('chapter 8: at night a cat lying flat on the path lies in the grass at its edge (“You drop flat in the grass.”): over her lower body, up to her chin in front of her face and never over her eyes, in front of everyone; nothing for a cat who is not lying flat, and nothing by day', () => {
  // chapter 8's sneak (f064/f065): our cat flat at a spot of the frame's own, the friend flat at `path-left`
  const FLAT = { x: 470, y: 975, h: 285 }, PL = spots8('dogs')['path-left'];
  const me = { who: 'player', pose: 'flat', mood: 'wonder', at: FLAT, facing: 'right' }, friend = { who: 'tallyheart', pose: 'flat', mood: 'solemn', at: 'path-left', facing: 'right' };
  const dog = { who: 'dog', pose: 'stand', mood: 'sniff', at: 'dog-2', facing: 'left', variant: 2 };
  const svg = nRender('dogs', [dog, friend, me], { moon: 8, tap: 'path' }).svg, grass = pathGrass8(svg);
  assert.equal(grass.length, 2, 'grass over each of them');
  // and the path's near edge is grass under them, from the left of the panel to just past her nose, short of the puddle
  const edge = svg.match(/<path d="M-40 ([\d.]+)L([\d.]+) [\d.]+L([^"]+)"[^>]*data-part="grassy-edge"/);
  assert.ok(edge, 'the grassy edge');
  const xs = edge[3].split('L').map((q) => +q.split(' ')[0]).filter((x) => x > 0), nose = boxes8(me, FLAT).head[2];
  assert.ok(Math.min(...xs) > nose && Math.max(...xs) < 670, 'past her nose (' + r1(nose) + '), short of the puddle at 670: ' + xs.map(r1).join(' '));
  assert.ok(svg.indexOf('data-part="grassy-edge"') < meAt0(svg), 'under her');
  // in front of everyone: after the cast
  const meAt = svg.indexOf('<g transform="translate(' + num(FLAT.x) + ' ' + num(FLAT.y) + ')');
  assert.ok(meAt > 0 && svg.indexOf('data-part="path-grass"') > meAt, 'drawn over her');
  [[friend, PL], [me, FLAT]].forEach(([m, a], i) => {
    const b = boxes8(m, a), blades = grass[i], H = a.h, chin = b.head[3];
    assert.ok(blades.length > 10, m.who + ': long grass, not a few blades');
    blades.forEach((q) => { if (q[0] > b.head[0] - H * 0.1 && q[0] < b.head[2] + H * 0.1) assert.ok(q[2] >= chin - 1, m.who + ': no blade over her face: tip ' + r1(q[2]) + ', chin ' + r1(chin)); });
    blades.forEach((q) => assert.ok(q[0] > b.body[0] - H * 0.2 && q[0] < b.body[2] + H * 0.2, m.who + ': over her, not beside her'));
    const tall = Math.max(...blades.map((q) => a.y - q[2]));
    assert.ok(tall > (a.y - b.body[1]) * 0.35 && tall < (a.y - b.body[1]) * 0.5 + 1, m.who + ': about half as high as she lies: ' + r1(tall));
  });
  // nothing for a cat sitting, standing or crouching there; nothing by day or at dusk; nothing at the wire
  for (const pose of ['sit', 'stand', 'crouch', 'walk']) assert.ok(!/path-grass|grassy-edge/.test(nRender('dogs', [Object.assign({}, me, { pose })]).svg), pose);
  for (const fx of [['day'], ['dusk'], ['morning']]) for (const cam of CAMS) assert.ok(!/path-grass|grassy-edge/.test(nRender(cam, [Object.assign({}, me, { at: 'path-left' })], {}, fx).svg), cam + ' ' + fx[0] + ': by day as ever');
  assert.equal(pathGrass8(nRender('dogs', [{ who: HAIL, pose: 'sit', at: 'wire', facing: 'left' }]).svg).length, 0, 'nobody lying flat, no grass');
});

test('chapter 8: our cat is dry on every page at the Barking Field: no cat of ours sits or lies on the path\'s puddle (“Neither way is wet.”), as chapter 8 places her', () => {
  const ch = PC.story && PC.story.ch08;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'field') : [];
  assert.ok(frames.length > 30);
  const OURS = ['player', 'tallyheart', 'riffle'];
  let n = 0;
  for (const [id, f] of frames) {
    const comp = COMP8[f.scene.cam], pools = night8()[comp].pathPuddles, A = spots8(f.scene.cam);
    for (const m of f.scene.cast) {
      if (!OURS.includes(m.who)) continue;
      const a = typeof m.at === 'string' ? A[m.at] : m.at;
      if (!a || a.y < night8()[comp].pathTop) continue;
      const b = boxes8(m, a), feet = [b.body[0], a.y - a.h * 0.12, b.body[2], a.y + a.h * 0.02];
      for (const [cx, cy, rx, ry] of pools) assert.ok(!meets8(feet, [cx - rx, cy - ry, cx + rx, cy + ry]), id + ': ' + m.who + ' at ' + JSON.stringify(m.at) + ' on the puddle at ' + cx);
      n++;
    }
  }
  assert.ok(n > 40, n + ' cats on the path');
});
