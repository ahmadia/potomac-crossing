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
// chapter 10 (docs/chapters/10-the-gathering.spec.md, section 4, "The riverbank by night: the walk home"): two more, both off
// by default: `moon` (a number) and `flyer` (roof)
const OPTS10 = { moon: 'number', flyer: [false, true] };
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
  // (chapter 10: and its two options, after chapter 2's, declared as the spec declares them)
  assert.deepEqual(Object.keys(v.opts), Object.keys(OPTS).concat(Object.keys(OPTS10)));
  for (const [k, vals] of Object.entries(OPTS)) assert.deepEqual(v.opts[k].slice().sort(), vals.slice().sort(), 'values of ' + k);
  assert.deepEqual(v.opts.moon, 'number', 'moon: a number');
  assert.deepEqual(v.opts.flyer, [false, true], 'flyer: off by default');
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

// ================================================================ chapter 10: the walk home by moonlight
// docs/chapters/10-the-gathering.spec.md, section 4, "The riverbank by night: the walk home": options `moon` and `flyer`,
// both off by default, so chapters 2 to 9's riverbank frames draw byte for byte. The fingerprints were recorded once from
// the snapshot the build froze (main after the Warrior Counts' merge and the polish release, commit 5bde0c5, engine
// '0.9.1 (the Warrior Counts, 2026-10-31)'), in a node process of its own, with the recorder's code below; no test reads
// that tree.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./_load.js');
const SPEC10 = path.join(ROOT, 'docs/chapters/10-the-gathering.spec.md');
// <fp10> (the recorder's code, as it ran on the snapshot)
const LOOK10 = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const strip10 = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');
const hash10 = (r) => crypto.createHash('sha1').update(strip10(r.svg) + JSON.stringify(r.keep) + JSON.stringify(r.heads)).digest('hex').slice(0, 12);
const fpCat10 = () => { const c = PC.engine.blankCat({ id: 'fingerprint', now: 0, look: LOOK10 }); c.name = 'Pebble'; c.petname = 'Pebble'; return c; };
function frameHash10(set, ids) {
  const E = PC.engine, cat = fpCat10(), stories = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09'].map((id) => PC.story[id]), out = {};
  for (const id of ids) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    if (!f.scene || f.scene.set !== set) continue;
    out[id + ':' + fid] = hash10(art.render(E.resolveScene(f.scene, cat, stories), { look: LOOK10 }));
  }
  return out;
}
// one hash per camera: every option value chapters 2 to 9 had (and the defaults), in every light, empty and with someone at every spot
const RB_OPTS10 = [{}, { plane: 'low' }, { roar: true }, { light: false }, { light: true }, { plane: 'low', roar: true, light: false }, { plane: 'none', roar: false }];
const RB_FX10 = [['day'], ['morning'], ['sunset'], ['dusk'], ['night', 'stars'], ['night'], []];
function riverbankSweep10() {
  const info = art.sceneInfo('riverbank'), out = {}, WHO = ['player', 'tallyheart', 'riffle', 'clancat', 'otter'];
  for (const cam of Object.keys(info.cams)) {
    const spots = Object.keys(info.anchors[info.cams[cam].comp] || {});
    const cast = spots.map((at, i) => ({ who: WHO[i % WHO.length], variant: 1 + (i % 3), pose: 'sit', at }));
    const h = crypto.createHash('sha1');
    for (const fx of RB_FX10) for (const opts of RB_OPTS10) for (const c of [[], cast]) {
      const r = art.render({ set: 'riverbank', cam, fx, opts, cast: c }, { look: LOOK10 });
      h.update(strip10(r.svg) + JSON.stringify(r.keep) + JSON.stringify(r.heads));
    }
    out[cam] = h.digest('hex').slice(0, 16);
  }
  return out;
}
// </fp10>
const CH10_RIVERBANK_FRAMES = {
  'ch02:f080': '4c445d95fc5c', 'ch02:f085b': '68fe539548ca', 'ch02:f086b': 'ec2c59d8d278',
  'ch02:f087b': '8c791437d026', 'ch02:f088b': '774303b1bb2b', 'ch02:f089b': '881f83e9fef7',
  'ch02:f090b': '644fafc239eb', 'ch02:f091b': '8634f9f6b036', 'ch02:f092b': 'd4f9df89064d',
  'ch02:f093b': 'ab599eee7b8f', 'ch02:f094b': 'dc7df6386493', 'ch02:f095b': '14d1a8e94c87',
  'ch02:f096b': '05b32b3275ed', 'ch02:f097b': 'ef6c70eb52d4', 'ch02:f102': '25cdfefc0a2b',
  'ch03:f108': 'b09b1963a892', 'ch04:f077b': 'dbe76db7cd7e'
};
const CH10_RIVERBANK_SWEEP = {
  'path': '85fb21cd6c215a6b', 'water': 'fa0e0d11e4aec921',
  'roof': 'ab1c397b0c173aa3', 'slide': '7c80a07b9ac85cfd'
};

test('riverbank, chapter 10: every riverbank frame of chapters 2 to 9 draws exactly as the snapshot drew it (fingerprints)', { skip: !art.character && 'no cats.js' }, () => {
  const now = frameHash10('riverbank', ['ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09']);
  assert.deepEqual(Object.keys(now).sort(), Object.keys(CH10_RIVERBANK_FRAMES).sort(), 'the same frames visit the riverbank');
  for (const [k, want] of Object.entries(CH10_RIVERBANK_FRAMES)) assert.equal(now[k], want, k + ': drawn as it was');
});

test('riverbank, chapter 10: every camera, with every option value chapters 2 to 9 had, in every light, empty and with someone at every spot, is byte for byte the snapshot\'s (neither new option set)', { skip: !art.character && 'no cats.js' }, () => {
  assert.deepEqual(riverbankSweep10(), CH10_RIVERBANK_SWEEP, 'recorded from the snapshot');
  // and the new options, off, draw exactly as left out
  for (const cam of CAMS) for (const fx of [['night', 'stars'], ['day'], ['dusk']]) {
    const plain = art.render({ set: 'riverbank', cam, fx }, { look: LOOK10 }).svg.replace(/pcs?[0-9a-z]+-/g, '');
    for (const o of [{ flyer: false }, { moon: 0 }, { moon: false }]) assert.equal(art.render({ set: 'riverbank', cam, fx, opts: o }, { look: LOOK10 }).svg.replace(/pcs?[0-9a-z]+-/g, ''), plain, cam + ' ' + fx + ' ' + JSON.stringify(o));
  }
});

test('riverbank, chapter 10: the spec names `moon` and `flyer`; the set declares them, off by default', () => {
  const md = fs.readFileSync(SPEC10, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['**Option `moon`** (a number: 14; `path` and `roof`)', '**Option `flyer: true`** (`roof`)', 'Chapters 2 to 9\'s riverbank frames draw as they do.'])
    assert.ok(md.includes(want), 'the spec says: ' + want);
  assert.deepEqual(art.sceneInfo('riverbank').defaults, { plane: 'none', roar: false, light: true }, 'no new default');
});

const rgb10 = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const lum10 = (h) => { const q = rgb10(h); return 0.3 * q[0] + 0.59 * q[1] + 0.11 * q[2]; };
// the river's own gradient (rbwater): its stops' colours
function waterStops(svg) {
  const m = /<linearGradient id="[^"]*-l-rbwater"[^>]*>(.*?)<\/linearGradient>/.exec(svg);
  return m ? (m[1].match(/stop-color="(#[0-9A-Fa-f]{6})"/g) || []).map((s) => s.slice(12, -1)) : [];
}

test('riverbank `moon` at night: the full moon over the towers (path and roof), kept clear of the lettering; under it the river silver-blue, moonlight on its ripples, never the black water of chapter 3\'s night; the path pale', () => {
  const black = waterStops(art.render({ set: 'riverbank', cam: 'path', fx: ['night', 'stars'] }).svg);
  assert.ok(black.length && black.some((c) => lum10(c) < 70), 'chapter 3\'s night: dark water (as shipped): ' + black.join(' '));
  for (const fx of [['night'], ['night', 'stars']]) {
    const r = art.render({ set: 'riverbank', cam: 'path', fx, opts: { moon: 14 } }), silver = waterStops(r.svg);
    assert.ok(silver.length >= 3 && silver.every((c) => lum10(c) >= 120), 'silver water: ' + silver.join(' '));
    for (const c of silver) { const q = rgb10(c); assert.ok(q[2] > q[0] && q[2] > q[1], 'silver-blue: ' + c); }
    assert.ok(/data-art="moon" data-age="14"/.test(r.svg), 'the full moon');
    assert.ok(/data-art="moon-path"/.test(r.svg), 'its path of light on the water');
    const m = /<g data-art="moon"[^>]*>.*?<circle cx="([-\d.]+)" cy="([-\d.]+)"/.exec(r.svg), x = +m[1] / 16, y = +m[2] / 10;
    assert.ok(+m[2] < 300, 'over the towers, high');
    assert.ok(r.keep.some((k) => k.x <= x && k.x + k.w >= x && k.y <= y && k.y + k.h >= y), 'kept clear of the lettering');
    // the path pale in the moonlight
    const path = /<linearGradient id="[^"]*-l-rbpath"[^>]*>(.*?)<\/linearGradient>/.exec(r.svg)[1].match(/#[0-9A-Fa-f]{6}/g);
    assert.ok(path.every((c) => lum10(c) >= 120), 'the path pale: ' + path.join(' '));
  }
  const roof = art.render({ set: 'riverbank', cam: 'roof', fx: ['night'], opts: { moon: 14 } });
  assert.ok(/data-art="moon" data-age="14"/.test(roof.svg), 'roof: the moon');
  // by day, no moon is drawn (it is a night's and a dusk's)
  assert.ok(!/data-art="moon"/.test(art.render({ set: 'riverbank', cam: 'path', fx: ['day'], opts: { moon: 14 } }).svg), 'none by day');
  // the cast keeps the night's light: the same tint as without the moon
  const tint = (svg) => (/<filter id="[^"]*-f-tint"[^>]*>(.*?)<\/filter>/.exec(svg) || [])[1];
  const c = [{ who: 'player', at: 'path-left' }];
  assert.equal(tint(art.render({ set: 'riverbank', cam: 'path', fx: ['night'], opts: { moon: 14 }, cast: c }, { look: LOOK }).svg), tint(art.render({ set: 'riverbank', cam: 'path', fx: ['night'], cast: c }, { look: LOOK }).svg), 'the night\'s tint on the cast');
});

test('riverbank `flyer` (roof): a small winged shape flying off upriver across the sky by the red light, slate-dark with a pale rim, wings out, a tiny ring of hiccup mist behind it; with `roar`, the roar\'s lines first; nowhere else', () => {
  const quiet = art.render({ set: 'riverbank', cam: 'roof', fx: ['night'], opts: { moon: 14 } }).svg;
  assert.ok(!/data-art="flyer"/.test(quiet), 'none by default');
  const svg = art.render({ set: 'riverbank', cam: 'roof', fx: ['night'], opts: { moon: 14, roar: true, flyer: true } }).svg, F = /<g data-art="flyer" data-box="([^"]+)">/.exec(svg);
  assert.ok(F, 'the flyer');
  const b = F[1].split(' ').map(Number), light = [900, 92];
  assert.ok(b[2] - b[0] < 220 && b[3] - b[1] < 120, 'small: ' + b);
  assert.ok(b[0] > light[0] - 60 && Math.abs((b[1] + b[3]) / 2 - light[1]) < 160, 'by the red light, flying off (to the right, upriver)');
  assert.ok(b[3] < 400, 'across the sky');
  assert.ok(svg.indexOf('data-art="flyer"') > svg.lastIndexOf('pcs-pulse'), 'the roar first, then the flyer');
  const f = svg.slice(svg.indexOf('data-art="flyer"'), svg.indexOf('</g>', svg.indexOf('data-art="flyer"')));
  assert.ok(/fill="#55617A"|fill="#3C465C"/.test(f), 'slate-dark');
  assert.ok(/stroke="#DCE5F6"/.test(f), 'a pale rim on the moonlit sky');
  assert.ok(/<ellipse[^>]*fill="none" stroke="#EEF3FF"/.test(f), 'a ring of hiccup mist');
  for (const cam of ['path', 'water', 'slide']) assert.equal(art.render({ set: 'riverbank', cam, fx: ['night'], opts: { flyer: true } }).svg.replace(/pcs?[0-9a-z]+-/g, ''), art.render({ set: 'riverbank', cam, fx: ['night'] }).svg.replace(/pcs?[0-9a-z]+-/g, ''), cam + ': the roof\'s only');
});
