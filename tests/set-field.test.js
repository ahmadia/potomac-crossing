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
const BORDER_ANCHORS = ['fox', ...FRONT, ...BACK];
// what each border camera sees: the fox's close-up leaves the four at the back out
const SEES = { border: ['fox', ...FRONT, ...BACK, ...DOGS], 'border-two': ['fox', ...FRONT, ...BACK, ...DOGS], 'border-fox': ['fox', ...FRONT, ...DOGS] };
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

test('PC.art.vocab lists the field set: chapter 2\'s cameras and anchors, the border\'s after them, one option', () => {
  const v = art.vocab.sets.field;
  assert.ok(v, 'vocab.sets.field');
  assert.deepEqual(v.cams, [...CAMS, ...BORDER]);
  assert.deepEqual(v.anchors.slice().sort(), [...ANCHORS, ...BORDER_ANCHORS].sort());
  assert.deepEqual(v.opts, { foxTail: [false, true] });
  const info = art.sceneInfo('field');
  assert.equal(info.label, 'the Barking Field');
  assert.deepEqual(info.defaults, {}, 'no fox tail unless a frame asks');
  // chapter 2's cameras each place all six of chapter 2's anchors, exactly as they did
  for (const cam of CAMS) {
    const comp = info.cams[cam].comp;
    assert.deepEqual(Object.keys(info.anchors[comp]).sort(), ANCHORS.slice().sort(), cam + ' (' + comp + ') has every chapter 2 anchor, and only those');
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
  assert.equal(n, (11 + 11 + 7) * 5);
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
    for (const at of SEES[cam].filter((k) => k !== 'fox' && !DOGS.includes(k))) {
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
