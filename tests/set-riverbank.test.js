// The riverbank set (app/art/sets/riverbank.js): node --test tests/set-riverbank.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const PC = require('./_load.js').load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['path', 'water', 'roof', 'slide'];
const ANCHORS = ['path-left', 'path-right', 'water', 'bank-top', 'slope'];
const OPTS = { plane: ['none', 'low'], roar: [true, false], light: [true, false] };
const TODS = ['morning', 'day', 'sunset', 'dusk', 'night'];
// which anchors each camera is meant to show (docs/build.md, "Art vocabulary, chapter 2")
const SEES = {
  path: ['path-left', 'path-right', 'water', 'bank-top', 'slope'],
  water: ['water', 'path-left', 'path-right'],
  slide: ['slope', 'bank-top', 'path-left'],
  roof: ['path-left', 'path-right']
};

// ---------------------------------------------------------------- helpers

// A small XML well-formedness check: balanced tags, quoted attributes, escaped text.
function checkXml(svg, label) {
  const stack = [];
  const re = /<[^>]*>|[^<]+/g;
  let m;
  while ((m = re.exec(svg))) {
    const tok = m[0];
    if (tok[0] !== '<') {
      assert.ok(!/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(tok), label + ': unescaped & in text');
      continue;
    }
    if (tok.startsWith('</')) {
      assert.equal(stack.pop(), tok.slice(2, -1).trim(), label + ': closing tag mismatch');
      continue;
    }
    const mm = /^<([a-zA-Z][\w:.-]*)((?:\s+[\w:.-]+="[^"<]*")*)\s*(\/?)>$/.exec(tok);
    assert.ok(mm, label + ': malformed tag ' + tok.slice(0, 100));
    const names = mm[2].match(/[\w:.-]+(?==")/g) || [];
    assert.equal(new Set(names).size, names.length, label + ': duplicate attribute in ' + tok.slice(0, 80));
    if (!mm[3]) stack.push(mm[1]);
  }
  assert.equal(stack.length, 0, label + ': unclosed tags');
}

function viewBox(svg) {
  return /^<svg[^>]*\sviewBox="([^"]+)"/.exec(svg)[1].split(/\s+/).map(Number);
}

function checkRender(r, scene, label) {
  assert.ok(r && typeof r.svg === 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg, label);
  const vb = viewBox(r.svg);
  assert.ok(Math.abs(vb[2] / vb[3] - 1.6) < 0.01, label + ': 16:10');
  assert.ok(vb[0] >= -0.5 && vb[1] >= -0.5 && vb[0] + vb[2] <= 1600.5 && vb[1] + vb[3] <= 1000.5, label + ': inside the world');
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  for (const ref of r.svg.match(/href="#([^"]+)"/g) || []) assert.ok(idset.has(ref.slice(7, -1)), label + ': dangling ' + ref);
  assert.equal(r.heads.length, (scene.cast || []).length, label + ': one head per cast member');
  r.heads.forEach((h) => { if (h) assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ': head in the panel'); });
  (r.keep || []).forEach((k) => assert.ok(k.w > 0 && k.h > 0 && k.x >= 0 && k.y >= 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, label + ': keep box in the panel'));
  return r;
}

const count = (s, needle) => s.split(needle).length - 1;

// ---------------------------------------------------------------- vocabulary

test('vocab: riverbank lists exactly the contract names', () => {
  const v = art.vocab.sets.riverbank;
  assert.ok(v, 'the set is registered');
  assert.deepEqual(v.cams, CAMS);
  assert.deepEqual(v.anchors.slice().sort(), ANCHORS.slice().sort());
  assert.deepEqual(Object.keys(v.opts).sort(), Object.keys(OPTS).sort());
  for (const [k, vals] of Object.entries(OPTS)) assert.deepEqual(v.opts[k].slice().sort(), vals.slice().sort(), 'values of ' + k);
});

test('defaults: by day, no plane, no roar, the light blinking', () => {
  const info = art.sceneInfo('riverbank');
  assert.equal(info.label, 'the riverbank path');
  assert.deepEqual(info.defaults, { plane: 'none', roar: false, light: true });
  const plain = art.render({ set: 'riverbank', cam: 'path' }).svg;
  assert.ok(plain.includes(art.kit.PAL.day.sky[0]), 'the day sky when no time of day is given');
  const sunset = art.render({ set: 'riverbank', cam: 'path', fx: ['sunset'] }).svg;
  assert.ok(sunset.includes(art.kit.PAL.sunset.sky[0]) && !sunset.includes(art.kit.PAL.day.sky[0]), 'fx sets the time of day');
});

// ---------------------------------------------------------------- every camera, anchor and option

test('every camera renders well-formed SVG with a cast member at each anchor', () => {
  const who = ['player', 'tallyheart', 'riffle', 'clancat', 'otter'];
  for (const cam of CAMS) {
    for (let i = 0; i < ANCHORS.length; i++) {
      const at = ANCHORS[i];
      const scene = { set: 'riverbank', cam, cast: [{ who: who[i % who.length], at, pose: 'sit', mood: 'happy', variant: 1 }], fx: ['day'] };
      const r = checkRender(art.render(scene, { look: LOOK }), scene, cam + ' @' + at);
      if (SEES[cam].includes(at)) assert.ok(r.heads[0], cam + ': ' + at + ' is in sight');
    }
    // all five at once, every option on, every effect
    const all = { set: 'riverbank', cam, opts: { plane: 'low', roar: true, light: true }, cast: ANCHORS.map((at, i) => ({ who: who[i], at, variant: i + 1 })), fx: art.vocab.fx.slice() };
    checkRender(art.render(all, { look: LOOK }), all, cam + ' everything');
  }
});

test('every option value renders on every camera, and in every light', () => {
  for (const cam of CAMS) {
    for (const [k, vals] of Object.entries(OPTS)) {
      for (const val of vals) {
        const scene = { set: 'riverbank', cam, opts: { [k]: val }, cast: [], fx: [] };
        checkRender(art.render(scene, { look: LOOK }), scene, cam + ' ' + k + '=' + val);
      }
    }
    for (const tod of TODS) {
      const scene = { set: 'riverbank', cam, opts: { plane: 'low', roar: true }, cast: [{ who: 'player', at: 'path-left' }], fx: [tod] };
      checkRender(art.render(scene, { look: LOOK }), scene, cam + ' ' + tod);
    }
  }
});

test('anchors sit inside their camera boxes', () => {
  const info = art.sceneInfo('riverbank');
  for (const [cam, names] of Object.entries(SEES)) {
    const c = info.cams[cam], spots = info.anchors[c.comp];
    for (const name of names) {
      const a = spots[name];
      assert.ok(a, cam + ' (' + c.comp + ') has ' + name);
      assert.ok(a.x - a.h * 0.3 >= c.x && a.x + a.h * 0.3 <= c.x + c.w, cam + ': ' + name + ' is inside left to right');
      assert.ok(a.y - a.h * 0.9 >= c.y && a.y <= c.y + c.h + 0.5, cam + ': ' + name + ' (a sitting cat there) is inside top to bottom');
      const r = art.render({ set: 'riverbank', cam, cast: [{ who: 'tallyheart', at: name }] });
      assert.ok(r.heads[0] && r.heads[0].y > 3 && r.heads[0].y < 97 && r.heads[0].x > 3 && r.heads[0].x < 97, cam + ': ' + name + "'s head well inside the panel");
    }
  }
  // the bank-top cat is behind the bank's lip; the slope is up on the bank: neither is picked for a cast member with no spot
  const main = info.anchors.main;
  assert.equal(main['bank-top'].z, 'behind');
  assert.ok(main['bank-top'].elev && main.slope.elev);
  assert.ok(main.water.y > main['path-left'].y && main.water.h > main['path-left'].h, 'the water is nearer than the path');
  assert.ok(main['path-left'].x < main['path-right'].x);
});

test('looking up at the roof, the riverside spots are out of sight', () => {
  const r = art.render({ set: 'riverbank', cam: 'roof', cast: [{ who: 'riffle', at: 'water' }, { who: 'tallyheart', at: 'bank-top' }, { who: 'riffle', at: 'slope' }] });
  assert.deepEqual(r.heads, [null, null, null]);
});

// ---------------------------------------------------------------- what the options draw

test('bank-top: the cat is drawn before the bank, so only a head shows over its lip', () => {
  const a = art.sceneInfo('riverbank').anchors.main['bank-top'];
  const r = art.render({ set: 'riverbank', cam: 'path', cast: [{ who: 'tallyheart', at: 'bank-top', pose: 'sit' }] });
  const cat = r.svg.indexOf('translate(' + a.x + ' ' + a.y + ')');
  const bank = r.svg.search(/fill="url\(#[^)]*-l-rbmud\)"/);
  assert.ok(cat > 0 && bank > 0, 'both are drawn');
  assert.ok(cat < bank, 'the bank covers the cat');
  // the head is up on the panel, above where the feet are
  const vb = viewBox(r.svg), headY = vb[1] + r.heads[0].y / 100 * vb[3];
  assert.ok(headY < a.y - a.h * 0.4, 'the head is well above the hidden feet');
});

test('plane: low draws an airplane and its shadow on the water', () => {
  for (const cam of ['path', 'water']) {
    const none = art.render({ set: 'riverbank', cam, opts: { plane: 'none' } }).svg;
    const low = art.render({ set: 'riverbank', cam, opts: { plane: 'low' } }).svg;
    assert.ok(low.length > none.length, cam + ': more is drawn');
    assert.ok(/-f-b-pshadow"/.test(low) && !/-f-b-pshadow"/.test(none), cam + ': the shadow');
  }
  // the default is no low plane
  assert.equal(art.render({ set: 'riverbank', cam: 'path' }).svg.length, art.render({ set: 'riverbank', cam: 'path', opts: { plane: 'none' } }).svg.length);
});

test('roar: jagged sound lines from the tallest roof, and nobody up there', () => {
  for (const cam of ['path', 'roof']) {
    const quiet = art.render({ set: 'riverbank', cam }).svg;
    const roar = art.render({ set: 'riverbank', cam, opts: { roar: true } }).svg;
    assert.equal(count(roar, 'pcs-pulse') - count(quiet, 'pcs-pulse'), 3, cam + ': three rings of sound');
    assert.equal(count(roar, '<g transform="translate('), count(quiet, '<g transform="translate('), cam + ': no extra creature drawn');
  }
});

test('light: the red light blinks by default and holds still with light: false', () => {
  for (const [cam, lights] of [['path', 2], ['roof', 1]]) {
    const on = art.render({ set: 'riverbank', cam }).svg;
    const off = art.render({ set: 'riverbank', cam, opts: { light: false } }).svg;
    assert.equal(count(on, 'pcs-blink') - count(off, 'pcs-blink'), lights, cam + ': the roof light (and its reflection) blink');
    assert.ok(off.includes('#FF4B3E'), cam + ': the light is still there, lit');
  }
});

test('the sun is on the same side in every camera: the roof shot looks the way the path does, so upper left', () => {
  const sun = art.kit.PAL.day.sun;
  const disc = (cam) => {
    const m = new RegExp('<circle cx="([-\\d.]+)" cy="([-\\d.]+)" r="[\\d.]+" fill="' + sun + '"').exec(art.render({ set: 'riverbank', cam, fx: ['day'] }).svg);
    assert.ok(m, cam + ': a sun by day');
    return [+m[1], +m[2]];
  };
  for (const cam of CAMS) {
    const [x, y] = disc(cam);
    assert.ok(x < 800 && y < 400, cam + ': the sun is at the upper left: ' + x + ',' + y);
  }
});

test('the roof shot keeps the lettering off the roof and its light', () => {
  const r = art.render({ set: 'riverbank', cam: 'roof' });
  assert.ok(r.keep.length >= 1);
  const k = r.keep[0];
  assert.ok(k.x < 56 && k.x + k.w > 56 && k.y < 10 && k.y + k.h > 10, 'the light, near the top middle, is kept clear: ' + JSON.stringify(k));
});

test('the towers are upside down in the river: a reflection shown in rippled bands', () => {
  const svg = art.render({ set: 'riverbank', cam: 'path' }).svg;
  const id = /<g id="([^"]+-rbrefl)" transform="translate\(0 [\d.]+\) scale\(1 -[\d.]+\)/.exec(svg);
  assert.ok(id, 'a flipped copy of the skyline in <defs>');
  assert.ok(count(svg, 'href="#' + id[1] + '"') >= 10, 'shown in many bands');
  const xs = new Set((svg.match(new RegExp('href="#' + id[1] + '" x="([^"]+)"', 'g')) || []).map((s) => s.split('x="')[1]));
  assert.ok(xs.size >= 5, 'each band nudged sideways a little');
});

test('the same scene draws the same picture (no flicker between frames)', () => {
  const s = { set: 'riverbank', cam: 'path', opts: { plane: 'low', roar: true }, cast: [{ who: 'player', at: 'path-left' }, { who: 'riffle', at: 'water', pose: 'float' }], fx: ['day'] };
  const strip = (x) => x.replace(/\b(pcs?|cats?|c)[0-9a-z]+-/g, '');   // the render's ids, and the characters' own
  const a = strip(art.render(s, { look: LOOK }).svg), b = strip(art.render(s, { look: LOOK }).svg);
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  assert.equal(i, a.length, 'first difference: ' + a.slice(Math.max(0, i - 80), i + 40) + ' | ' + b.slice(Math.max(0, i - 80), i + 40));
  assert.equal(a.length, b.length);
});

test('every animation class the set uses is defined in PC.art.css', () => {
  const used = new Set();
  for (const cam of CAMS) {
    const svg = art.render({ set: 'riverbank', cam, opts: { plane: 'low', roar: true } }).svg;
    for (const m of svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => used.add(c));
  }
  for (const c of used) if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') {
    assert.ok(art.css.includes('.' + c + '{'), 'css defines .' + c);
  }
});
