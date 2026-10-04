// Set art and the panel renderer (app/art/scenes.js): node --test tests/scenes.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const has = (f) => fs.existsSync(path.join(ROOT, f));
if (has('app/art/cats.js')) require(path.join(ROOT, 'app/art/cats.js'));
const PC = require(path.join(ROOT, 'app/art/scenes.js'));
const art = PC.art;
// chapter 2's sets, as index.html loads them, so every sweep below covers every set
const SET_FILES = (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/<script\s+src="app\/art\/sets\/[^"]+\.js"/g) || []).map((m) => m.match(/app\/[^"]+/)[0]);
SET_FILES.forEach((f) => require(path.join(ROOT, f)));

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const WHO = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'tallone', 'sparrow', 'moth', 'riffle', 'otter', 'dog'];
const POSES = ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer'];
const MOODS = ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn'];
// everyone who isn't a cat, with their own poses (cats.js publishes them; chapter 1's three are here
// too, so the sweeps run on placeholder art as well)
const OTHER = Object.assign({ sparrow: ['perch', 'fluffed'], moth: ['fly'], tallone: ['stand', 'water', 'set-dish'] }, (art.vocab && art.vocab.otherPoses) || {});
const VARIANTS = Object.assign({ clancat: [1, 2, 3, 4, 5, 6], otter: [1, 2, 3], dog: [1, 2, 3] }, (art.vocab && art.vocab.variants) || {});
// the cast member at place j of a sweep: who, a pose of theirs, a mood, a facing, a variant of theirs
function member(j, at, offset) {
  const who = WHO[(j + (offset || 0)) % WHO.length], k = j + (offset || 0);
  const pose = OTHER[who] ? OTHER[who][Math.floor(k / WHO.length) % OTHER[who].length] : POSES[k % POSES.length];
  const vs = VARIANTS[who] || [1];
  return { who, at, pose, mood: MOODS[k % MOODS.length], facing: k % 2 ? 'left' : 'right', variant: vs[Math.floor(k / WHO.length) % vs.length] };
}

// ---------------------------------------------------------------- helpers

// A small XML well-formedness check: balanced tags, quoted attributes, escaped text.
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

const CAT_LIKE = new Set(['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat']);
const FACED = new Set([...CAT_LIKE, 'riffle', 'otter', 'dog']);

function viewBox(svg) {
  const m = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(svg);
  assert.ok(m, 'svg has a viewBox');
  return m[1].split(/\s+/).map(Number);
}

function checkRender(r, scene, label) {
  assert.equal(typeof r, 'object', label);
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(/preserveAspectRatio="xMidYMid slice"/.test(r.svg), label + ': slice');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg);
  const vb = viewBox(r.svg);
  assert.equal(vb.length, 4, label);
  vb.forEach((v) => assert.ok(Number.isFinite(v), label + ': finite viewBox'));
  assert.ok(Math.abs(vb[2] / vb[3] - 1.6) < 0.01, label + ': 16:10 viewBox, got ' + vb.join(' '));
  assert.ok(vb[0] >= -0.5 && vb[1] >= -0.5 && vb[0] + vb[2] <= 1600.5 && vb[1] + vb[3] <= 1000.5, label + ': the camera stays inside the 1600 x 1000 world: ' + vb.join(' '));
  // ids are unique and every url(#…) points at one of them
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  for (const ref of r.svg.match(/href="#([^"]+)"/g) || []) assert.ok(idset.has(ref.slice(7, -1)), label + ': dangling ' + ref);
  // heads: one per cast member, null or a point in the panel
  const cast = scene.cast || [];
  assert.ok(Array.isArray(r.heads), label + ': heads is an array');
  assert.equal(r.heads.length, cast.length, label + ': one head per cast member');
  r.heads.forEach((h, i) => {
    if (h === null) return;
    assert.ok(Number.isFinite(h.x) && Number.isFinite(h.y), label + ' head ' + i);
    assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ' head ' + i + ' in range: ' + JSON.stringify(h));
    // the face's size, for the balloon tails: every cat, otter and dog has one
    const who = cast[i] && cast[i].who;
    if (h.r !== undefined) assert.ok(Number.isFinite(h.r) && h.r > 0 && h.r < 100, label + ' head ' + i + ' r: ' + h.r);
    if (art.character && FACED.has(who)) assert.ok(h.r > 0, label + ' head ' + i + ' (' + who + ') has a face size');
    if (['sparrow', 'moth', 'tallone'].includes(who)) assert.equal(h.r, undefined, label + ' head ' + i + ' (' + who + ') leaves its size to the UI');
  });
  return ids;
}

// ---------------------------------------------------------------- build.md: the art vocabulary

// The set tables in build.md: chapter 1's ("## Art vocabulary") and chapter 2's ("### Art
// vocabulary, chapter 2"), each { id: { cams, anchors, opts } }, plus the effects list.
function parseBuildMd() {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const ch2At = md.indexOf('### Art vocabulary, chapter 2');
  function table(text) {
    const sets = {};
    for (const raw of text.split('\n')) {
      if (!/^\| `[a-z]+`/.test(raw)) continue;
      const cells = raw.replace(/\\\|/g, '\u0001').split('|').slice(1, -1).map((c) => c.trim());
      if (cells.length !== 4) continue;
      const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
      const id = ticks(cells[0])[0];
      sets[id] = {
        cams: ticks(cells[1]),
        anchors: ticks(cells[2]),
        opts: ticks(cells[3]).map((t) => t.split(':')[0].trim())
      };
    }
    return sets;
  }
  const sets = table(ch2At > 0 ? md.slice(0, ch2At) : md);
  const ch2 = ch2At > 0 ? table(md.slice(ch2At)) : {};
  const at = md.indexOf('**Effects**');
  const para = md.slice(at, md.indexOf('\n\n', at));   // the paragraph may wrap
  const fx = (para.split(':').slice(1).join(':').split(';')[0].match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  const ch1At = md.indexOf("Changes to chapter 1's sets");
  const changes = ch1At > 0 ? md.slice(ch1At, md.indexOf('\n\n', ch1At)) : '';
  return { sets, ch2, fx, changes, md };
}

// What chapter 2 adds to chapter 1's sets (build.md, "Changes to chapter 1's sets").
const CH1_CHANGES = {
  den: { opts: ['moon', 'drips'], anchors: [] },
  camp: { opts: ['puddles', 'rainFountain'], anchors: [] },
  garden: { opts: ['towel'], anchors: [] },
  hollow: { opts: ['marks', 'glow'], anchors: ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'] },
  title: { opts: [], anchors: ['wall-2'] }
};

test('build.md parses: nine chapter 1 sets, five chapter 2 sets, twelve effects plus morning and day', () => {
  const spec = parseBuildMd();
  assert.deepEqual(Object.keys(spec.sets), ['room', 'tower', 'garden', 'camp', 'hollow', 'den', 'sky', 'river', 'title']);
  assert.deepEqual(Object.keys(spec.ch2), ['pile', 'bridge', 'field', 'crossing', 'riverbank']);
  assert.equal(spec.fx.length, 12);
  assert.ok(/plus `morning`[^.]*and `day`/.test(spec.md), 'chapter 2 adds the morning and day light');
  // the paragraph still names every change this file implements
  for (const [id, ch] of Object.entries(CH1_CHANGES)) {
    assert.ok(spec.changes.includes('`' + id + '`'), 'build.md changes ' + id);
    // (the rim anchors are written as a range, `rim-1` … `rim-5`)
    for (const k of ch.opts.concat(ch.anchors).filter((k) => !/^rim-[234]$/.test(k))) assert.ok(spec.changes.includes('`' + k), 'build.md names ' + id + ' ' + k);
  }
});

test('PC.art.vocab matches build.md: every chapter 1 set, camera, anchor and option, and chapter 2\'s changes (more allowed, never fewer)', () => {
  const spec = parseBuildMd(), v = art.vocab;
  assert.ok(v && v.sets && Array.isArray(v.fx), 'PC.art.vocab.sets and .fx exist');
  for (const [id, want] of Object.entries(spec.sets)) {
    const got = v.sets[id];
    assert.ok(got, 'set ' + id);
    for (const c of want.cams) assert.ok(got.cams.includes(c), id + ': camera ' + c);
    for (const a of want.anchors) assert.ok(got.anchors.includes(a), id + ': anchor ' + a);
    for (const o of want.opts) assert.ok(Object.prototype.hasOwnProperty.call(got.opts, o), id + ': option ' + o);
  }
  for (const [id, ch] of Object.entries(CH1_CHANGES)) {
    for (const a of ch.anchors) assert.ok(v.sets[id].anchors.includes(a), id + ': anchor ' + a);
    for (const o of ch.opts) assert.ok(Object.prototype.hasOwnProperty.call(v.sets[id].opts, o), id + ': option ' + o);
  }
  assert.deepEqual(v.sets.hollow.opts.marks.filter((m) => typeof m === 'number'), [0, 1, 2, 3, 4, 5, 6], 'marks 0-6');
  for (const f of spec.fx.concat(['morning', 'day'])) assert.ok(v.fx.includes(f), 'fx ' + f);
  // option values are listed (an array of allowed values, or 'number')
  for (const [id, set] of Object.entries(v.sets)) for (const [k, vals] of Object.entries(set.opts)) {
    assert.ok(Array.isArray(vals) || vals === 'number', id + '.' + k + ' lists its values');
  }
});


// ---------------------------------------------------------------- every set x camera

test('every set x camera renders with a cast at every anchor and every effect, everyone in the cast taking a turn', () => {
  const v = art.vocab;
  let n = 0;
  const seen = {};
  for (const [set, info] of Object.entries(v.sets)) {
    for (const cam of info.cams) {
      // enough casts that everyone (the otters and dogs too) stands somewhere in every camera
      for (let pass = 0; pass * info.anchors.length < WHO.length; pass++) {
        const cast = info.anchors.map((at, i) => member(i, at, pass * info.anchors.length));
        cast.forEach((m) => { (seen[set + '/' + cam] || (seen[set + '/' + cam] = new Set())).add(m.who); });
        const opts = { door: 'open', reflection: true, clan: true, sparrows: 12, lampSparrow: true, dish: true, moth: true, marks: 1, glow: true, weather: 'storm', splash: true,
          towel: true, puddles: true, rainFountain: true, drips: true, moon: true,
          pairs: 10, lit: 4, dug: true, train: true, eyes: 'blink', plane: 'low', pebbles: true, roar: true, light: true };
        const scene = { set, cam, opts, cast, fx: v.fx.slice() };
        checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' pass ' + pass);
        // and again, plain: no options, no effects
        if (pass) continue;
        const plain = { set, cam, cast: cast.slice(0, 2) };
        checkRender(art.render(plain, { look: LOOK }), plain, set + '/' + cam + ' (plain)');
      }
      assert.deepEqual([...seen[set + '/' + cam]].sort(), WHO.slice().sort(), set + '/' + cam + ': everyone took a turn');
      n++;
    }
  }
  assert.ok(n >= 31 + 17, 'all cameras covered, chapter 2\'s sets too: ' + n);
  assert.ok(['pile', 'bridge', 'field', 'crossing', 'riverbank'].every((s) => v.sets[s]), 'chapter 2\'s sets are in the sweep');
});

test('Riffle, the otters (1-3) and the dogs (1-3), in every pose of theirs, at every anchor of every set and camera', () => {
  const v = art.vocab;
  const combos = [];
  for (const who of ['riffle', 'otter', 'dog']) {
    for (const variant of who === 'riffle' ? [1] : VARIANTS[who]) for (const pose of OTHER[who]) combos.push({ who, variant, pose });
  }
  assert.equal(combos.length, 9 + 3 * 9 + 3 * 5, 'nine otter poses, five dog poses');
  let renders = 0;
  for (const [set, info] of Object.entries(v.sets)) {
    for (const cam of info.cams) {
      const A = info.anchors.length;
      // every combo once per camera, each at a different anchor from one camera to the next
      for (let start = 0; start < combos.length; start += A) {
        const cast = info.anchors.map((at, i) => {
          const c = combos[(start + i + renders) % combos.length];
          return { who: c.who, variant: c.variant, pose: c.pose, at, mood: MOODS[(start + i) % MOODS.length], facing: (start + i) % 2 ? 'left' : 'right' };
        });
        const scene = { set, cam, cast, fx: [set === 'den' || set === 'sky' ? 'night' : 'day'] };
        const r = art.render(scene, { look: LOOK });
        checkRender(r, scene, set + '/' + cam + ' ' + cast.map((m) => m.who + m.variant + ':' + m.pose).join(' '));
        renders++;
      }
    }
  }
  assert.ok(renders > 300, 'renders: ' + renders);
});

test('each effect alone, on every set', () => {
  for (const [set, info] of Object.entries(art.vocab.sets)) {
    for (const f of art.vocab.fx) {
      const scene = { set, cam: info.cams[0], cast: [{ who: 'player', at: info.anchors[0], pose: 'sit', mood: 'sleepy' }], fx: [f] };
      checkRender(art.render(scene, { look: LOOK }), scene, set + ' fx ' + f);
    }
  }
});

test('every option value renders, in every light', () => {
  const cases = [
    ['room', 'wide', { door: 'closed' }], ['room', 'wide', { door: 'open' }], ['room', 'glass', { reflection: true }], ['room', 'glass', { reflection: true, door: 'open' }],
    ['room', 'outside', { clan: true }], ['garden', 'fence', { sparrows: 0 }], ['garden', 'fence', { sparrows: 1 }], ['garden', 'fence', { sparrows: 13 }],
    ['garden', 'lamp', { lampSparrow: true }], ['garden', 'step', { dish: true }], ['garden', 'wide', { moth: true }],
    ['hollow', 'tree', { marks: 0 }], ['hollow', 'tree', { marks: 1 }], ['hollow', 'tree', { marks: 1, glow: true }], ['hollow', 'tree', { marks: 6, glow: true }],
    ['den', 'outside', { weather: 'clear' }], ['den', 'outside', { weather: 'cloudy' }], ['den', 'outside', { weather: 'storm' }], ['den', 'inside', { weather: 'storm' }], ['river', 'crash', { splash: true }], ['river', 'crash', {}],
    // chapter 2's additions to chapter 1's sets
    ['garden', 'step', { dish: true, towel: true }], ['garden', 'wide', { towel: true }], ['camp', 'reveal', { puddles: true, rainFountain: true }],
    ['camp', 'entrance', { puddles: true }], ['camp', 'fountain', { rainFountain: true }], ['camp', 'fountain-close', { rainFountain: true }],
    ['den', 'inside', { drips: true }], ['den', 'outside', { drips: true }], ['den', 'nest', { drips: true }], ['den', 'doorway', { drips: true }],
    ['den', 'outside', { moon: true }], ['den', 'inside', { drips: true, weather: 'storm' }],
    ['hollow', 'tree', { marks: 2, glow: [true, false] }], ['hollow', 'wide', { marks: 3, glow: [false, true, false] }], ['hollow', 'wide', { marks: 'auto', glow: 'auto' }],
    ['hollow', 'tree', { marks: 9, glow: [] }], ['hollow', 'lesson', { marks: -2 }],
    ['hollow', 'tree', { marks: 2, depth: 0 }], ['hollow', 'tree', { marks: 3, depth: [2, 1, 0] }], ['hollow', 'wide', { marks: 6, depth: 2, glow: true }], ['hollow', 'wide', { marks: 2, depth: 'auto' }],
    ['den', 'nest', { stone: true }], ['den', 'nest', { stone: 'nose' }], ['den', 'inside', { stone: 'chin' }], ['den', 'doorway', { stone: 'auto' }], ['den', 'outside', { stone: true }]
  ];
  for (const fx of [[], ['morning'], ['day'], ['night']]) for (const [set, cam, opts] of cases) {
    const scene = { set, cam, opts, cast: [], fx };
    checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' ' + JSON.stringify(opts) + ' ' + fx.join('+'));
  }
});

test('the sparrow count changes the drawing; the lamp sparrow is the thirteenth', () => {
  const a = art.render({ set: 'garden', cam: 'fence', opts: { sparrows: 12 } }).svg.length;
  const b = art.render({ set: 'garden', cam: 'fence', opts: { sparrows: 3 } }).svg.length;
  const c = art.render({ set: 'garden', cam: 'lamp', opts: { lampSparrow: true } }).svg.length;
  const d = art.render({ set: 'garden', cam: 'lamp', opts: { lampSparrow: false } }).svg.length;
  assert.ok(a > b, 'twelve sparrows draw more than three');
  assert.ok(c > d, 'lampSparrow adds a sparrow');
});

test('the reflection is drawn from ctx.look, so the look chooser can redraw it live', () => {
  const scene = { set: 'room', cam: 'glass', opts: { reflection: true }, cast: [], fx: ['dusk'] };
  const black = art.render(scene, { look: { fur: 'black', eyes: 'amber', marking: 'none', sex: 'she' } }).svg;
  const ginger = art.render(scene, { look: { fur: 'ginger', eyes: 'blue', marking: 'white-chest', sex: 'tom' } }).svg;
  const strip = (s) => s.replace(/pcs[0-9a-z]+-/g, '').replace(/\b(id|href)="[^"]*"/g, '').replace(/url\(#[^)]*\)/g, '');
  assert.notEqual(strip(black), strip(ginger));
  const none = art.render({ set: 'room', cam: 'glass', opts: {}, cast: [], fx: [] }).svg;
  assert.ok(none.length < black.length, 'no reflection without the option');
});

// ---------------------------------------------------------------- placement

test('heads: an on-panel cast member gets a head; one out of sight gets null', () => {
  const r = art.render({ set: 'garden', cam: 'lamp', cast: [{ who: 'tallyheart', at: 'hedge-gap' }, { who: 'sparrow', at: 'lamp-top', pose: 'fluffed' }] });
  assert.equal(r.heads[0], null, 'the hedge is not in the lamp close-up');
  assert.ok(r.heads[1] && r.heads[1].y > 0, 'the sparrow on the lamp is');
  const d = art.render({ set: 'den', cam: 'outside', cast: [{ who: 'player', at: 'nest' }] });
  assert.equal(d.heads[0], null, 'a nest inside the den is out of sight from outside');
});

// The UI's face estimate before the art reported r (from the markup: a character's box and scale,
// matched to the nearest head), kept here as the measure chapter 1's balloons were laid out with.
function oldFaceEstimate(svg, h) {
  const vb = viewBox(svg), box = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] }, cats = [];
  const re = /translate\((-?[\d.]+)[ ,]+(-?[\d.]+)\)\s*scale\((-?[\d.]+)(?:[ ,]+(-?[\d.]+))?\)\s*translate\(-([\d.]+)[ ,]+-([\d.]+)\)/g;
  let m;
  while ((m = re.exec(svg))) { const bh = +m[6]; if (bh > 0 && Math.abs(+m[5] * 2 - bh) <= bh * 0.25) cats.push({ x: +m[1], y: +m[2], s: Math.abs(+(m[4] || m[3])), b: bh }); }
  const hx = box.x + h.x / 100 * box.w, hy = box.y + h.y / 100 * box.h;
  let best = null, bd = Infinity;
  for (const k of cats) { const d = Math.abs(hx - k.x) + Math.abs(hy - (k.y - 0.55 * k.b * k.s)); if (d < bd) { bd = d; best = k; } }
  return best && bd < 1.2 * best.b * best.s ? Math.min(16, Math.max(1.8, 0.2 * best.b * best.s / box.w * 100)) : 6.5;
}

test('face sizes: a cat\'s r is chapter 1\'s measure (a fifth of its 200 box); Riffle\'s, the otters\' and the dogs\' come from their head boxes', { skip: !art.character && 'no cats.js' }, () => {
  const share = (() => { const c = art.character('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }), hb = c.headBox; return 40 / ((hb.x1 - hb.x0 + hb.y1 - hb.y0) / 2); })();
  const rocks = art.sceneInfo('crossing').anchors;
  const comp = Object.keys(rocks).find((k) => rocks[k]['rock-left'] && rocks[k]['rock-right']);
  const A = rocks[comp];
  for (const [who, variants, pose] of [['tallyheart', [1], 'sit'], ['clancat', [1, 4], 'lookup'], ['riffle', [1], 'juggle'], ['otter', [1, 2, 3], 'stand'], ['dog', [1, 2, 3], 'sit']]) {
    for (const variant of variants) {
      for (const at of ['rock-left', 'rock-right']) {
        const scene = { set: 'crossing', cam: 'wide', cast: [{ who, variant, pose, at, facing: 'left' }], fx: ['day'] };
        const r = art.render(scene, { look: LOOK });
        const h = r.heads[0], vb = viewBox(r.svg), s = A[at].h / 200;
        assert.ok(h && h.r > 0, who + variant + ' at ' + at + ' is in shot with a face size');
        const ch = art.character(who, { pose, mood: 'neutral', variant, facing: 'left' }), hb = ch.headBox;
        const want = CAT_LIKE.has(who) ? 0.2 * ch.h * s : share * ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2 * s;
        assert.ok(Math.abs(h.r / 100 * vb[2] - want) < vb[2] * 0.0001 + 0.01, who + variant + ' ' + at + ': r ' + h.r + ' is ' + (h.r / 100 * vb[2]).toFixed(1) + ' world units, want ' + want.toFixed(1));
      }
    }
  }
  // the sizes read right beside each other: the pup's face is smaller than a grown otter's, the
  // shaggy dog's is the biggest, the tiny dog's smaller than a cat's
  const r1 = (who, variant, pose) => art.render({ set: 'crossing', cam: 'wide', cast: [{ who, variant, pose, at: 'rock-left' }], fx: ['day'] }).heads[0].r;
  assert.ok(r1('riffle', 1, 'sit') < r1('otter', 2, 'sit') && r1('otter', 2, 'sit') < r1('otter', 1, 'sit'), 'Riffle < an otter < the old ferry otter (grey whiskers)');
  assert.ok(r1('dog', 3, 'sit') < r1('tallyheart', 1, 'sit') && r1('tallyheart', 1, 'sit') < r1('dog', 2, 'sit') && r1('dog', 2, 'sit') < r1('dog', 1, 'sit'), 'tiny < a cat < spotty < shaggy');
});

test('chapter 1\'s balloons see the same faces as before: every r the art gives is the size the UI used to estimate (but f030\'s Tallyheart, now measured right)', { skip: (!has('app/story/ch01.js') || !art.character) && 'no chapter 1 or no cats.js' }, () => {
  require(path.join(ROOT, 'app/story/ch01.js'));
  const ch = PC.story.ch01;
  let n = 0;
  const changed = [];
  for (const [id, f] of Object.entries(ch.frames)) {
    const r = art.render(f.scene, { look: LOOK });
    (f.scene.cast || []).forEach((m, i) => {
      const h = r.heads[i];
      if (!h || h.r === undefined) return;
      const now = Math.min(16, Math.max(1.8, h.r)), before = oldFaceEstimate(r.svg, h);
      n++;
      if (Math.abs(now - before) > 0.01) changed.push(id + ' ' + m.who + ' ' + before.toFixed(2) + ' -> ' + now.toFixed(2));
    });
  }
  assert.ok(n > 100, 'faces checked: ' + n);
  // f030: the sparrows on the fence sat nearer her head than her own drawing, so the estimate fell
  // back to the default (6.5); the art now measures her face (7.69)
  assert.deepEqual(changed, ['f030 tallyheart 6.50 -> 7.69']);
});

test('facing flips the character; size scales it', () => {
  const base = { set: 'hollow', cam: 'lesson', fx: [] };
  const R = art.render({ ...base, cast: [{ who: 'tallyheart', at: 'sand-left', facing: 'right' }] }).heads[0];
  const L = art.render({ ...base, cast: [{ who: 'tallyheart', at: 'sand-left', facing: 'left' }] }).heads[0];
  assert.ok(R.x > L.x, 'facing right puts the head on the right');
  const big = art.render({ ...base, cast: [{ who: 'tallyheart', at: 'sand-left', size: 1.4 }] }).heads[0];
  const small = art.render({ ...base, cast: [{ who: 'tallyheart', at: 'sand-left', size: 0.7 }] }).heads[0];
  assert.ok(big.y < small.y, 'a bigger cat has its head higher');
});

test('depth: a cat on the cushion is bigger than the tiny Clan cats far off in the garden', () => {
  const info = art.sceneInfo('room');
  const cushion = info.anchors.main.cushion;
  assert.ok(cushion.h > 200, 'cushion cats are big');
  const garden = art.sceneInfo('garden').anchors.main;
  assert.ok(garden.lawn.h > garden['fence-foot'].h, 'the lawn is nearer than the fence');
  const camp = art.sceneInfo('camp').anchors.main;
  assert.ok(camp.entrance.h > camp['crowd-left'].h, 'the entrance is nearer than the crowd');
});

test('a custom spot {x, y, scale} works and scales', () => {
  const s1 = art.render({ set: 'garden', cam: 'wide', cast: [{ who: 'player', at: { x: 900, y: 800, scale: 1 } }] });
  const s2 = art.render({ set: 'garden', cam: 'wide', cast: [{ who: 'player', at: { x: 900, y: 800, scale: 2 } }] });
  checkRender(s1, { cast: [1] }, 'custom spot');
  assert.ok(s2.heads[0].y < s1.heads[0].y, 'scale 2 is taller');
  const bad = art.render({ set: 'garden', cam: 'wide', cast: [{ who: 'player', at: { x: 'no', y: 1 } }] });
  assert.equal(bad.heads[0], null, 'a broken spot draws nothing');
});

test('layering: cast members are drawn in the order given', () => {
  const r = art.render({ set: 'hollow', cam: 'wide', cast: [{ who: 'tallyheart', at: 'sand-left' }, { who: 'glintstar', at: 'sand-right' }] });
  checkRender(r, { cast: [1, 2] }, 'order');
  // both appear; the renderer emits them in order (glintstar's palette after tallyheart's)
  assert.ok(r.svg.length > 0);
});

test('unknown sets, cameras, anchors and missing pieces never throw', () => {
  const cases = [
    {}, { set: 'nowhere' }, { set: 'room', cam: 'nowhere' }, { set: 'room', cast: [{ who: 'nobody', at: 'nowhere' }] },
    { set: 'garden', cam: 'paws' }, { set: 'garden', cam: 'paws', cast: [{ who: 'player' }] }, { set: 'camp', cam: 'reveal', fx: ['shake', 'flash', 'nope'] },
    { set: 'tower', cam: 'up', cast: [null, { who: 'waffles', at: 'railing' }] }
  ];
  for (const c of cases) {
    const r = art.render(c);
    checkRender(r, { cast: (c.cast || []).filter((x) => x && typeof x === 'object') }, JSON.stringify(c));
  }
  checkRender(art.render({ set: 'room', cam: 'glass', opts: { reflection: true } }), { cast: [] }, 'no ctx');
});

test('unique ids per render, so several panels can share a page', () => {
  const s = { set: 'camp', cam: 'reveal', cast: [{ who: 'player', at: 'center' }], fx: ['glow', 'purr'] };
  const a = checkRender(art.render(s, { look: LOOK }), s, 'a');
  const b = checkRender(art.render(s, { look: LOOK }), s, 'b');
  const shared = a.filter((id) => b.includes(id));
  assert.equal(shared.length, 0, 'no id is shared between two renders: ' + shared.slice(0, 3).join(', '));
});

test('the same scene draws the same picture each time (no flicker between frames)', () => {
  const s = { set: 'garden', cam: 'wide', opts: { sparrows: 12 }, cast: [{ who: 'player', at: 'lawn' }], fx: ['dusk'] };
  const strip = (x) => x.replace(/pcs[0-9a-z]+-/g, '').replace(/(cats?|c)\d+-/g, '').replace(/\d+(?=")/g, '');
  const a = art.render(s, { look: LOOK }).svg, b = art.render(s, { look: LOOK }).svg;
  assert.equal(a.length, b.length);
});

// ---------------------------------------------------------------- CSS

test('PC.art.css: animation classes, all inside prefers-reduced-motion: no-preference', () => {
  const css = art.css;
  assert.equal(typeof css, 'string');
  const i = css.indexOf('@media (prefers-reduced-motion: no-preference)');
  assert.ok(i >= 0, 'the motion media query is there');
  const before = css.slice(0, i);
  assert.ok(!/animation|@keyframes/.test(before), 'nothing animates outside the media query');
  // every class used in the art is defined
  const used = new Set();
  for (const [set, info] of Object.entries(art.vocab.sets)) for (const cam of info.cams) {
    for (const opts of [{ weather: 'storm', marks: 1, glow: true, splash: true, door: 'open', moth: true }, { drips: true, puddles: true, rainFountain: true, towel: true, marks: 6, glow: [true, false, true] }]) {
      const svg = art.render({ set, cam, opts, cast: [{ who: 'player', at: info.anchors[0], pose: 'curl', mood: 'sleepy' }], fx: opts.drips ? ['morning'] : art.vocab.fx }).svg;
      for (const m of svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => used.add(c));
    }
  }
  for (const c of used) if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') {
    assert.ok(css.includes('.' + c + '{'), 'css defines .' + c);
  }
});

// ---------------------------------------------------------------- the story's own frames

test('every frame of chapter 1 renders with the art vocabulary', { skip: !has('app/story/ch01.js') && 'no app/story/ch01.js yet' }, () => {
  require(path.join(ROOT, 'app/story/ch01.js'));
  const ch = PC.story && PC.story.ch01;
  assert.ok(ch && ch.frames, 'PC.story.ch01.frames');
  const v = art.vocab;
  let n = 0;
  for (const [id, f] of Object.entries(ch.frames)) {
    const s = f.scene;
    assert.ok(s, id + ' has a scene');
    assert.ok(v.sets[s.set], id + ': set ' + s.set);
    assert.ok(v.sets[s.set].cams.includes(s.cam), id + ': camera ' + s.set + '/' + s.cam);
    for (const m of s.cast || []) if (typeof m.at === 'string') assert.ok(v.sets[s.set].anchors.includes(m.at), id + ': anchor ' + m.at + ' in ' + s.set);
    for (const fx of s.fx || []) assert.ok(v.fx.includes(fx) || fx === 'shake' || fx === 'flash', id + ': fx ' + fx);
    const r = art.render(s, { look: LOOK });
    checkRender(r, s, id);
    // a speaking cast member should be on the panel, so the balloon can point at them
    for (const say of f.say || []) {
      const i = (s.cast || []).findIndex((m) => m.who === say.who);
      if (i >= 0 && say.who !== 'tallone') assert.ok(r.heads[i], id + ': ' + say.who + ' speaks and is in shot');
    }
    n++;
  }
  assert.ok(n > 0);
});

// ---------------------------------------------------------------- close-ups and weather

// A cast member's head box in world units, from cats.js's headBox and the reported head point.
function worldHeadBox(r, i, scene, who, opts, s) {
  const vb = viewBox(r.svg), h = r.heads[i];
  const ch = art.character(who, opts);
  const hx = vb[0] + h.x / 100 * vb[2], hy = vb[1] + h.y / 100 * vb[3];
  return { vb, box: [hx + (ch.headBox.x0 - ch.head.x) * s, hy + (ch.headBox.y0 - ch.head.y) * s, hx + (ch.headBox.x1 - ch.head.x) * s, hy + (ch.headBox.y1 - ch.head.y) * s] };
}
const insideVb = (b, vb) => b[0] >= vb[0] && b[1] >= vb[1] && b[2] <= vb[0] + vb[2] && b[3] <= vb[1] + vb[3];

test('camp fountain-close: Glintstar, solemn on the fountain top, head and ears wholly in the panel', () => {
  assert.ok(art.vocab.sets.camp.cams.includes('fountain-close'));
  const scene = { set: 'camp', cam: 'fountain-close', cast: [{ who: 'glintstar', pose: 'sit', mood: 'solemn', at: 'fountain-top', facing: 'left' }], fx: ['sunset', 'glow'] };
  const r = art.render(scene, { look: LOOK });
  checkRender(r, scene, 'fountain-close');
  const h = r.heads[0];
  assert.ok(h && h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, 'her head is in the panel: ' + JSON.stringify(h));
  const a = art.sceneInfo('camp').anchors.fountain['fountain-top'], s = a.h / 200;
  const { vb, box } = worldHeadBox(r, 0, scene, 'glintstar', { pose: 'sit', mood: 'solemn', facing: 'left' }, s);
  assert.ok(insideVb(box, vb), 'head, ears and whiskers inside: ' + box.map(Math.round) + ' in ' + vb);
  const k = (box[3] - box[1]) / vb[3];
  assert.ok(k > 0.35 && k < 0.6, 'a close-up: the head (with ears) is ' + k.toFixed(2) + ' of the panel height');
  assert.ok(box[3] < vb[1] + vb[3] * 0.75, 'her shoulders show below her chin');
});

test('tower balcony-close: Waffles\'s head and bow in the panel for every pose, the rail top below her chin', () => {
  assert.ok(art.vocab.sets.tower.cams.includes('balcony-close'));
  const RAIL_TOP = 720;
  for (const pose of ['loaf', 'stand', 'crouch', 'peer', 'sit', 'lie', 'flat']) {
    for (const mood of ['dreamy', 'shout', 'neutral']) {
      const scene = { set: 'tower', cam: 'balcony-close', cast: [{ who: 'waffles', pose, mood, at: 'railing', facing: 'left' }], fx: ['dusk'] };
      const r = art.render(scene, { look: LOOK });
      checkRender(r, scene, 'balcony-close ' + pose);
      const h = r.heads[0];
      assert.ok(h && h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, pose + ': head in the panel ' + JSON.stringify(h));
      const vb = viewBox(r.svg), s = art.sceneInfo('tower').anchors.balcony.railing.h / 200;   // the cats' drawings are 200 tall
      const { box } = worldHeadBox(r, 0, scene, 'waffles', { pose, mood, facing: 'left' }, s);
      assert.ok(insideVb(box, vb), pose + '/' + mood + ': head and bow inside: ' + box.map(Math.round) + ' in ' + vb);
      const k = (box[3] - box[1]) / vb[3];
      assert.ok(k > 0.33 && k < 0.5, pose + ': her face is about a third of the panel (head box ' + k.toFixed(2) + ')');
      assert.ok(box[3] < RAIL_TOP && RAIL_TOP < vb[1] + vb[3], pose + ': the rail top shows below her chin');
    }
  }
});

// A cast member's whole-body box in world units, from cats.js's bounds and the reported head point.
function worldBodyBox(r, i, who, opts, s) {
  const vb = viewBox(r.svg), h = r.heads[i];
  const ch = art.character(who, opts), b = ch.bounds;
  const hx = vb[0] + h.x / 100 * vb[2], hy = vb[1] + h.y / 100 * vb[3];
  return [hx + (b.x0 - ch.head.x) * s, hy + (b.y0 - ch.head.y) * s, hx + (b.x1 - ch.head.x) * s, hy + (b.y1 - ch.head.y) * s];
}
const poufTop = (svg) => { const m = /<rect x="[^"]+" y="([^"]+)" width="[^"]+" height="[^"]+" fill="#E58FA8"/.exec(svg); return m ? +m[1] : null; };

test('tower balcony: a lifted cat rests on the pouf (its top meets her body, flopped on her back too); the wide camera lifts only a cast member marked lift: true', { skip: !art.character && 'no cats.js' }, () => {
  const RAIL_TOP = 720, s = art.sceneInfo('tower').anchors.balcony.railing.h / 200;
  const cases = [['balcony-close', 'fall', {}], ['balcony-close', 'loaf', {}], ['balcony-close', 'crouch', {}], ['balcony', 'fall', { lift: true }], ['balcony', 'flat', { lift: true }]];
  for (const [cam, pose, more] of cases) {
    const m = Object.assign({ who: 'waffles', pose, mood: 'dreamy', at: 'railing', facing: 'left' }, more);
    const scene = { set: 'tower', cam, cast: [m], fx: ['morning'] };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, cam + ' ' + pose);
    const o = { pose, mood: 'dreamy', facing: 'left' };
    const head = worldHeadBox(r, 0, scene, 'waffles', o, s).box, body = worldBodyBox(r, 0, 'waffles', o, s);
    assert.ok(head[3] < RAIL_TOP, cam + '/' + pose + ': her face clears the rail: chin ' + Math.round(head[3]));
    const top = poufTop(r.svg);
    assert.ok(top !== null, cam + '/' + pose + ': she sits on a pouf');
    assert.ok(Math.abs(top - (body[3] - 6)) < 2.5, cam + '/' + pose + ': the pouf meets her body, no gap: pouf top ' + top + ', body bottom ' + Math.round(body[3]));
  }
  // unmarked, the wide camera leaves her on the tiles behind the rail, as chapter 1 drew her (her
  // chin on the rail, peering over; flopped behind it)
  for (const pose of ['peer', 'fall', 'sit']) {
    const scene = { set: 'tower', cam: 'balcony', cast: [{ who: 'waffles', pose, mood: 'happy', at: 'railing', facing: 'left' }], fx: ['dusk'] };
    const r = art.render(scene, { look: LOOK });
    assert.equal(poufTop(r.svg), null, 'balcony/' + pose + ': no pouf unless asked');
    const marked = art.render({ set: 'tower', cam: 'balcony', cast: [{ who: 'waffles', pose, mood: 'happy', at: 'railing', facing: 'left', lift: false }], fx: ['dusk'] });
    assert.deepEqual(marked.heads, r.heads, 'lift: false is the same as unmarked');
  }
});

test('purr beside a friend (chapter 2, f077): her sound arcs keep off the side where Riffle leans in, and stay on her own body', { skip: !art.character && 'no cats.js' }, () => {
  const fxOf = (svg) => svg.slice(svg.indexOf('class="pcs-fx">'));
  // the arcs: the bright strokes in the purr groups, as their endpoints
  const arcEnds = (svg) => {
    const out = [];
    for (const m of fxOf(svg).matchAll(/<path d="([^"]+)" fill="none" stroke="#FFF1C8"/g)) {
      for (const p of m[1].matchAll(/[MA]([-\d.]+) ([-\d.]+)(?: 0 0 [01] ([-\d.]+) ([-\d.]+))?/g)) {
        if (p[3] === undefined) out.push([+p[1], +p[2]]); else out.push([+p[3], +p[4]]);
      }
    }
    return out;
  };
  const her = { who: 'player', pose: 'sit', mood: 'happy', at: 'rock-left', facing: 'right', purr: true, holds: 'stone' };
  const riffle = { who: 'riffle', pose: 'stand', mood: 'wonder', at: 'pebbles', facing: 'left' };
  const r = art.render({ set: 'crossing', cam: 'rocks', opts: { pebbles: true }, cast: [her, riffle], fx: ['day', 'purr'] }, { look: LOOK });
  const ends = arcEnds(r.svg), h = r.heads[0], rf = r.heads[1];
  assert.ok(ends.length >= 6, 'she purrs: ' + ends.length);
  ends.forEach(([x, y]) => {
    assert.ok(x < h.x * 16, 'every arc is on her free side, away from Riffle: ' + [x, y] + ' her head ' + h.x * 16);
    assert.ok(Math.hypot(x - rf.x * 16, y - rf.y * 10) > rf.r * 16 * 1.5, 'never near his face');
  });
  // alone, she purrs on both sides
  const alone = arcEnds(art.render({ set: 'crossing', cam: 'rocks', opts: { pebbles: true }, cast: [her], fx: ['day', 'purr'] }, { look: LOOK }).svg);
  assert.ok(alone.some(([x]) => x > h.x * 16) && alone.some(([x]) => x < h.x * 16), 'both sides when nobody is beside her');
});

test('cast extras pass through to the drawing: flatEars (f020) and holds; purr and lift stay the scene\'s', { skip: !art.character && 'no cats.js' }, () => {
  const tom = (extra) => art.render({ set: 'hollow', cam: 'lesson', cast: [Object.assign({ who: 'grizzled', pose: 'sit', mood: 'stern', at: 'rim-5', facing: 'left' }, extra)], fx: ['morning'] }, { look: LOOK });
  const up = tom({}), flat = tom({ flatEars: true });
  assert.notEqual(flat.svg.replace(/pc[a-z0-9]+-/g, ''), up.svg.replace(/pc[a-z0-9]+-/g, ''), 'flatEars changes the old tom');
  const direct = art.character('grizzled', { pose: 'sit', mood: 'stern', facing: 'left', flatEars: true }).svg.replace(/pc[a-z0-9]+-[a-z0-9]+/g, '');
  assert.ok(flat.svg.replace(/pc[a-z0-9]+-[a-z0-9]+/g, '').includes(direct), 'the scene draws exactly the flat-eared tom cats.js draws');
  // the ch02 frame that says he flattens his ears draws them flat
  const f020 = require(path.join(ROOT, 'app/story/ch02.js')).story.ch02.frames.f020.scene, g = f020.cast.find((c) => c.who === 'grizzled');
  assert.equal(g.flatEars, true);
  const shown = art.render(f020, { look: LOOK }).svg.replace(/pc[a-z0-9]+-[a-z0-9]+/g, '');
  assert.ok(shown.includes(art.character('grizzled', { pose: g.pose, mood: g.mood, facing: g.facing, flatEars: true }).svg.replace(/pc[a-z0-9]+-[a-z0-9]+/g, '')), 'f020: his ears are flat on screen');
});

test('purr: cast members marked purr: true purr alone (rings, arcs and words are theirs; the others add nothing); with nobody marked, chapter 1\'s whole-camp purr', () => {
  const fxOf = (svg) => svg.slice(svg.indexOf('class="pcs-fx">'));
  const words = (svg) => [...fxOf(svg).matchAll(/<text x="([^"]+)" y="([^"]+)"[^>]*>purrr<\/text>/g)].map((m) => [+m[1], +m[2]]);
  const purrer = { who: 'player', pose: 'sit', mood: 'happy', at: 'crowd-left', facing: 'right', purr: true };
  const friend = { who: 'tallyheart', pose: 'sit', mood: 'wonder', at: 'crowd-right', facing: 'left' };
  const both = art.render({ set: 'camp', cam: 'crowd', cast: [purrer, friend], fx: ['sunset', 'purr'] }, { look: LOOK });
  const alone = art.render({ set: 'camp', cam: 'crowd', cast: [purrer], fx: ['sunset', 'purr'] }, { look: LOOK });
  assert.equal(fxOf(both.svg), fxOf(alone.svg), 'the friend beside her adds no purring');
  // the words float by the purring cat, never on a face
  const h0 = both.heads[0], h1 = both.heads[1], W = words(both.svg);
  assert.ok(W.length >= 1 && W.length <= 2, 'one or two purrrs: ' + W.length);
  for (const [x, y] of W) {
    assert.ok(x > 0 && x < 1600 && y > 0 && y < 1000, 'in the panel: ' + x + ',' + y);
    for (const h of [h0, h1]) assert.ok(Math.hypot(x - h.x * 16, y - h.y * 10) > h.r * 16 + 10, 'clear of a face: ' + [x, y] + ' vs ' + JSON.stringify(h));
    assert.ok(Math.abs(x - h0.x * 16) < Math.abs(x - h1.x * 16), 'nearer the purring cat');
  }
  // the rings ripple from her, not from the middle of the camp
  const rings = [...fxOf(both.svg).matchAll(/<ellipse cx="([^"]+)" cy="([^"]+)"[^>]*class="pcs-ring"/g)].map((m) => +m[1]);
  assert.equal(rings.length, 3);
  rings.forEach((x) => assert.ok(Math.abs(x - h0.x * 16) < 160, 'ring centred on her: ' + x));
  // nobody marked: every cast member purrs, with the fixed words and the camp-wide rings (chapter 1)
  const camp = art.render({ set: 'camp', cam: 'purr', cast: [Object.assign({}, purrer, { purr: undefined }), friend], fx: ['dusk', 'purr'] }, { look: LOOK });
  assert.deepEqual(words(camp.svg), [[230, 470], [1290, 500], [800, 330]]);
  assert.equal((fxOf(camp.svg).match(/<ellipse cx="800" cy="700" rx="560" ry="190"/g) || []).length, 3);
});

test('den stone: Riffle\'s lucky stone in her nest, between her paws, by her nose or under her chin; small in the wide shots; never outside; held in her paws with holds: \'stone\' (drawn by cats.js, the sparkle on it)', { skip: !art.character && 'no cats.js' }, () => {
  const STONE = /translate\(([-\d.]+) ([-\d.]+)\) rotate\(-?[\d.]+\)"><ellipse cx="0" cy="0" rx="([\d.]+)" ry="[\d.]+" fill="#24252C"/g;
  const stones = (svg) => [...svg.matchAll(STONE)].map((m) => [+m[1], +m[2], +m[3]]);
  const loaf = (facing) => ({ who: 'player', pose: 'loaf', mood: 'wonder', at: 'nest', facing });
  assert.deepEqual(art.vocab.sets.den.opts.stone, [false, true, 'nose', 'chin', 'auto']);
  for (const cam of ['nest', 'inside', 'doorway']) {
    assert.equal(stones(art.render({ set: 'den', cam, opts: {}, cast: [loaf('right')], fx: ['night'] }).svg).length, 0, cam + ': no stone before the gift');
    assert.equal(stones(art.render({ set: 'den', cam, opts: { stone: false }, cast: [loaf('right')], fx: ['night'] }).svg).length, 0, cam + ': stone false');
    for (const stone of [true, 'nose', 'chin', 'auto']) {
      const scene = { set: 'den', cam, opts: { stone }, cast: [loaf('right')], fx: ['night'] };
      const r = art.render(scene, { look: LOOK });
      checkRender(r, scene, 'den/' + cam + ' stone ' + stone);
      const st = stones(r.svg), vb = viewBox(r.svg);
      assert.equal(st.length, 1, cam + ' ' + stone + ': one stone');
      assert.ok(st[0][0] > vb[0] && st[0][0] < vb[0] + vb[2] && st[0][1] > vb[1] && st[0][1] < vb[1] + vb[3], cam + ' ' + stone + ': in the panel');
    }
  }
  assert.equal(stones(art.render({ set: 'den', cam: 'outside', opts: { stone: true }, cast: [], fx: ['night'] }).svg).length, 0, 'not seen from outside');
  // where: in the nest close-up, against her head box
  const s = art.sceneInfo('den').anchors.inside.nest.h / 200;
  for (const facing of ['right', 'left']) {
    const at = (stone) => {
      const scene = { set: 'den', cam: 'nest', opts: { stone }, cast: [loaf(facing)], fx: ['night'] };
      const r = art.render(scene, { look: LOOK });
      return { st: stones(r.svg)[0], head: worldHeadBox(r, 0, scene, 'player', Object.assign({ pose: 'loaf', mood: 'wonder', facing }, LOOK.sex ? { sex: LOOK.sex } : {}), s).box };
    };
    const dir = facing === 'left' ? -1 : 1;
    const paws = at(true), nose = at('nose'), chin = at('chin'), auto = at('auto');
    assert.deepEqual(auto.st, paws.st, "'auto' left unfilled: between her paws");
    assert.ok(dir * (nose.st[0] - (dir > 0 ? nose.head[2] : nose.head[0])) > 0, facing + ': by her nose, just past her face: ' + nose.st + ' head ' + nose.head.map(Math.round));
    assert.ok(chin.st[0] > chin.head[0] && chin.st[0] < chin.head[2] && chin.st[1] > (chin.head[1] + chin.head[3]) / 2, facing + ': under her chin: ' + chin.st + ' head ' + chin.head.map(Math.round));
    assert.ok(paws.st[1] > chin.head[3] && paws.st[0] > paws.head[0] && paws.st[0] < paws.head[2], facing + ': between her paws, below her head: ' + paws.st);
  }
  // small in the wide shot, bigger in the close-up (the same stone)
  const wide = stones(art.render({ set: 'den', cam: 'inside', opts: { stone: true }, cast: [loaf('right')], fx: ['night'] }).svg)[0];
  assert.ok(wide[2] > 10 && wide[2] < 25, 'a pebble, not a boulder: rx ' + wide[2]);
  // nobody in the nest: it still lies in the moss
  assert.equal(stones(art.render({ set: 'den', cam: 'nest', opts: { stone: 'chin' }, cast: [], fx: ['night'] }).svg).length, 1);
  // held: one painter, cats.js's (holds passes through to the drawing), at her front paws; the
  // sparkle effect twinkles on the stone itself (f075), three small stars
  const scene = { set: 'garden', cam: 'step', cast: [{ who: 'player', pose: 'sit', mood: 'happy', at: 'step', holds: 'stone' }], fx: ['day', 'sparkle'] };
  const r = art.render(scene, { look: LOOK });
  checkRender(r, scene, 'holds stone');
  const pcStones = (svg) => (svg.match(/class="pc-stone"/g) || []).length;
  assert.equal(pcStones(r.svg), 1, 'the cat holds one stone');
  assert.equal(stones(r.svg).length, 0, 'and the scene draws no second one');
  const a = art.sceneInfo('garden').anchors.main.step, vb = viewBox(r.svg);
  const fx = r.svg.slice(r.svg.indexOf('class="pcs-fx">'));
  const tw = [...fx.matchAll(/transform="translate\(([-\d.]+) ([-\d.]+)\)"/g)].map((m) => [vb[0] + +m[1] * vb[2] / 1600, vb[1] + +m[2] * vb[3] / 1000]);
  assert.equal(tw.length, 3, 'three twinkles, on the stone');
  assert.ok(Math.abs(tw[0][0] - a.x) < a.h * 0.3 && tw[0][1] < a.y && tw[0][1] > a.y - a.h * 0.25, 'on the stone at her front paws: ' + tw[0].map(Math.round) + ' feet ' + [a.x, a.y]);
  const plain = art.render({ set: 'garden', cam: 'step', cast: [{ who: 'player', pose: 'sit', at: 'step' }], fx: ['day', 'sparkle'] }).svg;
  assert.equal(pcStones(plain) + stones(plain).length, 0, 'not without holds');
  assert.equal((plain.slice(plain.indexOf('class="pcs-fx">')).match(/class="pcs-tw"/g) || []).length, 18, 'and the sparkles scatter as before');
  // her look and pose pass through with it: a stone in the den close-up, held in the paws of a loaf
  const loafHeld = art.render({ set: 'den', cam: 'nest', cast: [Object.assign(loaf('right'), { holds: 'stone' })], fx: ['night'] }, { look: LOOK });
  assert.equal(pcStones(loafHeld.svg), 1);
});

test('bonk: a pebble bounces off the first cast member\'s head, with three stars circling the bump', () => {
  const fxOf = (svg) => svg.slice(svg.indexOf('class="pcs-fx">'));
  assert.ok(art.vocab.fx.includes('bonk'));
  const scene = { set: 'garden', cam: 'step', cast: [{ who: 'player', pose: 'sit', mood: 'worried', at: 'step' }], fx: ['day', 'bonk'] };
  const r = art.render(scene, { look: LOOK });
  checkRender(r, scene, 'bonk');
  const f = fxOf(r.svg), h = r.heads[0];
  const stars = [...f.matchAll(/<path d="M([-\d.]+) ([-\d.]+)[^"]*" fill="#FFE27A"/g)].map((m) => [+m[1], +m[2]]);
  assert.equal(stars.length, 3, 'three stars');
  const hx = h.x * 16, hy = h.y * 10;
  stars.forEach((p) => assert.ok(Math.abs(p[0] - hx) < 200 && p[1] < hy && p[1] > hy - 250, 'a star at the top of her head: ' + p + ' head ' + [hx, hy]));
  assert.ok(/fill="#A39E96"/.test(f), 'the pebble');
  // nobody in the panel: it still draws, mid-panel
  checkRender(art.render({ set: 'garden', cam: 'step', cast: [], fx: ['bonk'] }), { cast: [] }, 'bonk alone');
});

test('den weather: cloudy hides the moon (when there is one) and the stars, with no rain or lightning, in every camera', () => {
  assert.ok(art.vocab.sets.den.opts.weather.includes('cloudy'));
  for (const cam of ['outside', 'inside', 'nest', 'doorway']) {
    const scene = { set: 'den', cam, opts: { weather: 'cloudy' }, cast: [{ who: 'player', at: 'doorway', pose: 'sit', mood: 'sleepy' }], fx: ['night'] };
    checkRender(art.render(scene, { look: LOOK }), scene, 'den/' + cam + ' cloudy');
    const plain = { set: 'den', cam, opts: { weather: 'cloudy' }, cast: [], fx: ['night', 'stars'] };
    const svg = art.render(plain, { look: LOOK }).svg;
    checkRender({ svg, heads: [] }, plain, 'den/' + cam + ' cloudy, stars asked for');
    assert.ok(!/pcs-rain|pcs-bolt|pcs-flash/.test(svg), cam + ': no rain, no lightning');
  }
  const clear = art.render({ set: 'den', cam: 'outside', opts: { weather: 'clear' }, cast: [], fx: ['night'] }).svg;
  const cloudy = art.render({ set: 'den', cam: 'outside', opts: { weather: 'cloudy' }, cast: [], fx: ['night'] }).svg;
  const moonlit = art.render({ set: 'den', cam: 'outside', opts: { weather: 'clear', moon: true }, cast: [], fx: ['night'] }).svg;
  const moonCloud = art.render({ set: 'den', cam: 'outside', opts: { weather: 'cloudy', moon: true }, cast: [], fx: ['night'] }).svg;
  // her first night is moonless (the case: "there was no moon that night"); a moon shows only when asked for, and never under cloud
  assert.ok(!clear.includes('#FFF3D2'), 'no moon unless a frame asks for one');
  assert.ok(moonlit.includes('#FFF3D2') && !moonCloud.includes('#FFF3D2'), 'an asked-for moon is out on a clear night and hidden under cloud');
  // star dots are drawn as relative arcs (scenes.js dot())
  const dots = (svg) => (svg.match(/a[\d.]+ [\d.]+ 0 1 0/g) || []).length;
  // counted in the sky only: everything drawn before the rosebush
  const sky = (svg) => svg.slice(0, svg.indexOf('#B46F8C'));
  assert.ok(dots(sky(cloudy)) < dots(sky(clear)) / 10, 'the star field is gone: ' + dots(sky(cloudy)) + ' vs ' + dots(sky(clear)));
  // the rosebush and the glow in the den mouth are drawn exactly as on a clear night
  const strip = (x) => x.replace(/pcs[0-9a-z]+-/g, '');
  const bush = (x) => strip(x).slice(strip(x).indexOf('#B46F8C'));
  assert.equal(bush(cloudy), bush(clear));
});

test('keep: the claw marks are reported as an area the lettering stays off', () => {
  const none = art.render({ set: 'hollow', cam: 'wide', opts: { marks: 0 }, cast: [] });
  assert.deepEqual(none.keep, []);
  for (const cam of ['wide', 'tree', 'lesson']) {
    const r = art.render({ set: 'hollow', cam, opts: { marks: 1, glow: true }, cast: [] });
    assert.ok(Array.isArray(r.keep) && r.keep.length === 1, cam + ': one keep area');
    const k = r.keep[0];
    assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, cam + ': inside the panel ' + JSON.stringify(k));
  }
  // every other set says nothing
  assert.deepEqual(art.render({ set: 'camp', cam: 'reveal', cast: [] }).keep, []);
});

// ---------------------------------------------------------------- chapter 2's changes to chapter 1's sets

const CH1_SETS = ['room', 'tower', 'garden', 'camp', 'hollow', 'den', 'sky', 'river', 'title'];
// The closed shapes (M…Z) of the path with exactly this fill and attributes, as lists of [x, y].
function shapes(svg, attrsRe) {
  const m = new RegExp('<path d="([^"]+)" ' + attrsRe + '/>').exec(svg);
  if (!m) return [];
  return m[1].split('M').filter(Boolean).map((sp) => (sp.match(/-?[\d.]+/g) || []).map(Number).reduce((a, v, i, all) => (i % 2 ? a : a.concat([[v, all[i + 1]]])), []));
}
const centre = (pts) => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];

test('morning and day on chapter 1\'s sets: every camera renders; no lamp glow, fireflies or twinkling stars by day; chapter 1\'s own light keeps them', () => {
  for (const set of CH1_SETS) {
    const info = art.vocab.sets[set];
    for (const cam of info.cams) for (const fx of ['morning', 'day']) {
      const scene = { set, cam, cast: [{ who: 'player', at: info.anchors[0], pose: 'sit', mood: 'happy' }], fx: [fx] };
      const r = art.render(scene, { look: LOOK });
      checkRender(r, scene, set + '/' + cam + ' ' + fx);
      if (set === 'sky' || set === 'river') continue;   // always night, always the storm
      assert.ok(!r.svg.includes('pcs-lamp'), set + '/' + cam + ' ' + fx + ': no lamp glow by day');
      assert.ok(!r.svg.includes('pcs-twk'), set + '/' + cam + ' ' + fx + ': nothing twinkles by day (stars, fairy lights)');
      assert.ok(!r.svg.includes('pcs-float'), set + '/' + cam + ' ' + fx + ': no fireflies by day');
    }
  }
  // chapter 1's evening and night are as they were
  assert.ok(art.render({ set: 'garden', cam: 'lamp', fx: ['dusk'] }).svg.includes('pcs-lamp'), 'the dusk lamp still glows');
  assert.ok(art.render({ set: 'den', cam: 'inside', fx: ['night'] }).svg.includes('pcs-float'), 'the fireflies are still out at night');
  assert.ok(art.render({ set: 'tower', cam: 'balcony', fx: ['dusk'] }).svg.includes('pcs-twk'), 'the fairy lights still twinkle at dusk');
  // no moon by day, even when one is asked for
  assert.ok(!art.render({ set: 'den', cam: 'outside', opts: { moon: true }, fx: ['morning'] }).svg.includes('#FFF3D2'), 'no moon in the morning sky');
});

test('title by day: the sun stands high and the train\'s windows are not lamplit; by sunset as before', () => {
  const day = art.render({ set: 'title', cam: 'wide', fx: ['day'] }).svg;
  const sun = /<circle cx="([\d.]+)" cy="([\d.]+)" r="[\d.]+" fill="#FFFBE6"/.exec(day);
  assert.ok(sun && +sun[2] < 300, 'the day sun is high: ' + (sun && sun[2]));
  assert.ok(!day.includes('#FFD27F'), 'no lamplit windows by day');
  const sunset = art.render({ set: 'title', cam: 'wide', fx: ['sunset'] }).svg;
  assert.ok(sunset.includes('#FFD27F'), 'the sunset train is lit');
});

test('den drips: drops hang and fall inside and outside, in every camera; sun spots only when there is sun', () => {
  for (const cam of ['outside', 'inside', 'nest', 'doorway']) {
    const wet = art.render({ set: 'den', cam, opts: { drips: true }, fx: ['morning'] });
    const dry = art.render({ set: 'den', cam, opts: {}, fx: ['morning'] });
    assert.ok(wet.svg.includes('class="pcs-drip"'), cam + ': falling drops');
    assert.ok(!dry.svg.includes('pcs-drip'), cam + ': no drips without the option');
    assert.ok(wet.svg.includes('-r-sunspot'), cam + ': sun spots in the morning');
    // some falling drop is in this camera's view (the nest close-up sees the one on her nose)
    const vb = viewBox(wet.svg);
    const tops = [...wet.svg.matchAll(/<g class="pcs-drip"[^>]*><path d="M([\d.]+) ([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
    assert.ok(tops.some(([x, y]) => x > vb[0] && x < vb[0] + vb[2] && y > vb[1] && y < vb[1] + vb[3]), cam + ': a drop falls in view');
  }
  const night = art.render({ set: 'den', cam: 'inside', opts: { drips: true }, fx: ['night'] }).svg;
  assert.ok(night.includes('pcs-drip') && !night.includes('-r-sunspot'), 'at night the drips stay and the sun spots go');
  assert.ok(art.vocab.sets.den.opts.drips.includes(true), 'drips is in the vocabulary');
});

test('den storm: the rain that leaks into the den falls (pcs-drip) and fades; nothing rises (pcs-float is for fireflies)', () => {
  const ys = (name) => {
    const t = '\\{transform:translate\\((-?[\\d.]+)(?:px)?,(-?[\\d.]+)(?:px)?\\)';
    const m = new RegExp('@keyframes ' + name + '\\{0%' + t + '.*?100%' + t).exec(art.css);
    return [+m[2], +m[4]];
  };
  assert.ok(ys('pcs-drip')[1] > ys('pcs-drip')[0], 'pcs-drip moves down');
  assert.ok(ys('pcs-float')[1] < ys('pcs-float')[0], 'pcs-float moves up');
  for (const cam of ['inside', 'nest', 'doorway']) {
    const svg = art.render({ set: 'den', cam, opts: { weather: 'storm' }, cast: [{ who: 'player', at: 'nest', pose: 'curl', mood: 'scared' }], fx: ['night', 'rain'] }).svg;
    const drops = [...svg.matchAll(/<g class="(pcs-[a-z]+)"[^>]*><path d="M0 0q4 8 0 12q-4-4 0-12z"/g)].map((m) => m[1]);
    assert.equal(drops.length, 10, cam + ': ten drops leak through the roof');
    assert.deepEqual([...new Set(drops)], ['pcs-drip'], cam + ': every one falls');
    assert.ok(!svg.includes('pcs-float'), cam + ': nothing floats up in the storm');
  }
});

test('camp puddles: seven in the wide shots (Tallyheart counted them), more seen from above; none without the option', () => {
  for (const cam of ['reveal', 'crowd', 'purr', 'ferns', 'entrance']) {
    assert.ok(art.render({ set: 'camp', cam, opts: { puddles: true }, fx: ['morning'] }).svg.includes('-l-puddle'), cam + ': puddles');
    assert.ok(!art.render({ set: 'camp', cam, opts: {}, fx: ['morning'] }).svg.includes('-l-puddle'), cam + ': no puddles without the option');
  }
  const pud = shapes(art.render({ set: 'camp', cam: 'reveal', opts: { puddles: true }, fx: ['morning'] }).svg, 'fill="url\\(#[^)]*-l-puddle\\)"');
  assert.equal(pud.length, 7, 'seven puddles');
  for (const p of pud) { const [x, y] = centre(p); assert.ok(x > 0 && x < 1600 && y > 780 && y < 1000, 'a puddle on the ground: ' + [x, y].map(Math.round)); }
});

test('camp rainFountain: the dry fountain is full of rain, basin and bowl, and drips; Glintstar can still sit on it', () => {
  const wet = art.render({ set: 'camp', cam: 'reveal', opts: { rainFountain: true }, fx: ['morning'] }).svg;
  const dry = art.render({ set: 'camp', cam: 'reveal', opts: {}, fx: ['morning'] }).svg;
  for (const k of ['-l-basinwater', '-l-bowlwater', 'pcs-drip']) {
    assert.ok(wet.includes(k), 'full of rain: ' + k);
    assert.ok(!dry.includes(k), 'dry without the option: ' + k);
  }
  assert.ok(art.render({ set: 'camp', cam: 'fountain', opts: { rainFountain: true }, fx: ['morning'] }).svg.includes('pcs-drip'), 'dripping, seen from below');
  assert.ok(!art.render({ set: 'camp', cam: 'fountain', opts: {}, fx: ['morning'] }).svg.includes('pcs-drip'), 'dry from below without it');
  for (const cam of ['reveal', 'fountain', 'fountain-close']) {
    const r = art.render({ set: 'camp', cam, opts: { rainFountain: true, puddles: true }, cast: [{ who: 'glintstar', at: 'fountain-top', pose: 'sit', mood: 'solemn', facing: 'left' }], fx: ['morning'] });
    assert.ok(r.heads[0], cam + ': Glintstar on the fountain is in shot');
  }
});

test('garden towel: a folded towel on the patio step, beside the dish, in the step and wide shots', () => {
  const T = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="#6FA8C8"/;
  for (const cam of ['step', 'wide']) {
    const r = art.render({ set: 'garden', cam, opts: { dish: true, towel: true }, fx: ['morning'] });
    const m = T.exec(r.svg);
    assert.ok(m, cam + ': the towel is drawn');
    assert.ok(!T.test(art.render({ set: 'garden', cam, opts: { dish: true }, fx: ['morning'] }).svg), cam + ': no towel without the option');
    const vb = viewBox(r.svg), x0 = +m[1], y0 = +m[2], x1 = x0 + +m[3], y1 = y0 + +m[4];
    assert.ok(x0 >= vb[0] && x1 <= vb[0] + vb[2] && y0 >= vb[1] && y1 <= vb[1] + vb[3], cam + ': in view');
    assert.ok(x0 > -20 && x1 < 452 && y1 > 776 && y1 < 848, cam + ': on the patio, beside the dish: ' + [x0, y0, x1, y1]);
  }
});

test('hollow marks 0-6: one claw mark per Count, three scratches each, left to right; all inside the keep area and the tree close-up; the first never moves for the second', () => {
  const marks = (m, cam) => {
    const r = art.render({ set: 'hollow', cam: cam || 'wide', opts: { marks: m }, cast: [] });
    const sc = shapes(r.svg, 'fill="#3A281E"');
    const per = [];
    for (let i = 0; i < sc.length; i += 3) per.push(sc.slice(i, i + 3));
    return { r, sc, per };
  };
  const tree = { x: 1000, y: 430, w: 400, h: 250 };
  let prev = null;
  for (let m = 0; m <= 6; m++) {
    const { r, sc, per } = marks(m);
    assert.equal(sc.length, 3 * m, m + ' marks: three scratches each');
    if (!m) { assert.deepEqual(r.keep, []); continue; }
    // keep: one area, in the wide shot (the panel is the world), around every scratch
    assert.equal(r.keep.length, 1, m + ' marks: one keep area');
    const k = r.keep[0], kx0 = k.x * 16, ky0 = k.y * 10, kx1 = (k.x + k.w) * 16, ky1 = (k.y + k.h) * 10;
    for (const p of sc.flat()) {
      assert.ok(p[0] >= kx0 - 1 && p[0] <= kx1 + 1 && p[1] >= ky0 - 1 && p[1] <= ky1 + 1, m + ' marks: scratch point ' + p + ' inside keep ' + [kx0, ky0, kx1, ky1]);
      assert.ok(p[0] >= tree.x && p[0] <= tree.x + tree.w && p[1] >= tree.y && p[1] <= tree.y + tree.h, m + ' marks: inside the tree close-up: ' + p);
    }
    // left to right: each mark right of the one before, or the start of a new row below it
    const c = per.map((q) => centre(q.flat()));
    for (let i = 1; i < c.length; i++) assert.ok(c[i][0] > c[i - 1][0] + 20 || c[i][1] > c[i - 1][1] + 40, m + ' marks: mark ' + (i + 1) + ' follows mark ' + i);
    // the tree close-up keeps the lettering off all of them too
    const t = art.render({ set: 'hollow', cam: 'tree', opts: { marks: m }, cast: [] });
    assert.ok(t.keep.length === 1 && t.keep[0].x >= 0 && t.keep[0].x + t.keep[0].w <= 100.1 && t.keep[0].y + t.keep[0].h <= 100.1, m + ' marks: keep inside the tree panel');
    if (m === 2) {
      // the second mark deepens the first (wider), but in place: drawn fresh, it is exactly chapter 1's
      const fresh = shapes(art.render({ set: 'hollow', cam: 'wide', opts: { marks: 2, depth: 0 }, cast: [] }).svg, 'fill="#3A281E"');
      assert.deepEqual(fresh.slice(0, 3), prev[0], 'the first mark stays exactly where chapter 1 scratched it when the second is added');
      const c0 = centre(per[0].flat()), c1 = centre(prev[0].flat());
      assert.ok(Math.abs(c0[0] - c1[0]) < 1.5 && Math.abs(c0[1] - c1[1]) < 1.5, 'deepened in place: ' + c0 + ' vs ' + c1);
    }
    prev = per;
  }
  // out of range is clamped, unfilled 'auto' draws none
  assert.equal(marks(9).sc.length, 18);
  assert.equal(marks('auto').sc.length, 0);
});

test('hollow glow: true lights every mark, a list lights mark by mark, and unfilled or empty lights none', () => {
  const lit = (opts) => {
    const svg = art.render({ set: 'hollow', cam: 'tree', opts, cast: [] }).svg;
    return { on: shapes(svg, 'fill="#FFF6D0" class="pcs-pulse"'), off: shapes(svg, 'fill="#E9D2A6"') };
  };
  const count = (o) => { const l = lit(o); return [l.on.length / 3, l.off.length / 3]; };
  assert.deepEqual(count({ marks: 1, glow: true }), [1, 0]);
  assert.deepEqual(count({ marks: 2, glow: true }), [2, 0]);
  assert.deepEqual(count({ marks: 2, glow: [true, false] }), [1, 1]);
  assert.deepEqual(count({ marks: 6, glow: [true, false, true, false, false, true] }), [3, 3]);
  assert.deepEqual(count({ marks: 2, glow: false }), [0, 2]);
  assert.deepEqual(count({ marks: 2, glow: 'auto' }), [0, 2]);
  assert.deepEqual(count({ marks: 3, glow: [] }), [0, 3]);
  // [false, true]: it is the second mark (the one on the right) that glows
  const l = lit({ marks: 2, glow: [false, true] });
  assert.ok(centre(l.on.flat())[0] > centre(l.off.flat())[0], 'the right-hand mark glows');
});

test('hollow depth: practice deepens a mark (wider, a dark groove down the middle); by default every mark but the newest, so "your first mark is a little deeper"', () => {
  const draw = (opts) => {
    const svg = art.render({ set: 'hollow', cam: 'tree', opts, cast: [] }).svg;
    const outer = shapes(svg, 'fill="#3A281E"');
    // each mark's width: the mean x-spread of its three scratches
    const widths = [];
    for (let i = 0; i < outer.length; i += 3) widths.push([0, 1, 2].reduce((a, j) => { const xs = outer[i + j].map((p) => p[0]); return a + (Math.max(...xs) - Math.min(...xs)) / 3; }, 0));
    return { widths, groove: shapes(svg, 'fill="#6B4A32" opacity="0.9"'), lit: shapes(svg, 'fill="#E3A752" opacity="0.8"'), outer };
  };
  assert.deepEqual(art.vocab.sets.hollow.opts.depth, [0, 1, 2, 'auto']);
  // one mark (chapter 1, and chapter 2 before the second Count): fresh, no groove
  assert.equal(draw({ marks: 1 }).groove.length, 0, 'a lone mark is fresh');
  // two marks (f024, f025): the first is deeper, the new one fresh
  const two = draw({ marks: 2 });
  assert.equal(two.groove.length, 3, 'the first mark has a dark groove in each scratch; the second none');
  assert.ok(centre(two.groove.flat())[0] < centre(two.outer.slice(3).flat())[0], 'the groove is in the left-hand (first) mark');
  assert.ok(two.widths[0] > two.widths[1] + 1, 'the first mark is gouged wider: ' + two.widths.map((w) => w.toFixed(1)));
  assert.deepEqual(draw({ marks: 2, depth: 'auto' }), two, "'auto' left unfilled is the default");
  // three marks: the oldest deepest
  const three = draw({ marks: 3 });
  assert.equal(three.groove.length, 6);
  assert.ok(three.widths[0] > three.widths[1] && three.widths[1] > three.widths[2], 'oldest widest: ' + three.widths.map((w) => w.toFixed(1)));
  // given: a number for every mark, or a list, one per mark (true counts as 1)
  const flat = draw({ marks: 2, depth: 0 });
  assert.equal(flat.groove.length, 0);
  assert.ok(Math.abs(flat.widths[0] - flat.widths[1]) < 0.5, 'depth 0: both fresh, alike');
  const rev = draw({ marks: 2, depth: [0, 2] });
  assert.equal(rev.groove.length, 3);
  assert.ok(rev.widths[1] > rev.widths[0] + 1 && centre(rev.groove.flat())[0] > centre(rev.outer.slice(0, 3).flat())[0], 'the second mark is the deep one');
  assert.equal(draw({ marks: 3, depth: true }).groove.length, 9);
  assert.equal(draw({ marks: 2, depth: [true] }).groove.length, 3, 'a short list: the rest fresh');
  // a glowing deep mark keeps its glow, with a warm groove
  const glowing = draw({ marks: 2, glow: [true, false] });
  assert.equal(glowing.lit.length, 3);
  assert.equal(glowing.groove.length, 0);
  // the claw marks' keep area still holds every (wider) scratch
  for (const m of [2, 6]) {
    const r = art.render({ set: 'hollow', cam: 'wide', opts: { marks: m, depth: 2 }, cast: [] }), k = r.keep[0];
    for (const p of shapes(r.svg, 'fill="#3A281E"').flat()) assert.ok(p[0] >= k.x * 16 - 1 && p[0] <= (k.x + k.w) * 16 + 1 && p[1] >= k.y * 10 - 1 && p[1] <= (k.y + k.h) * 10 + 1, m + ' deep marks: ' + p + ' in keep');
  }
});

test('hollow rim: five cats along the rim, left to right with rim-5 at the right end, all in the wide shot, clear of each other and of two cats in the sun patch', () => {
  const A = art.sceneInfo('hollow').anchors.main, rim = [1, 2, 3, 4, 5].map((i) => A['rim-' + i]);
  rim.forEach((a, i) => {
    assert.ok(a, 'rim-' + (i + 1));
    assert.ok(a.y > 760 && a.y < 800, 'rim-' + (i + 1) + ' sits on the back rim of the hollow: y ' + a.y);
    if (i) assert.ok(a.x > rim[i - 1].x, 'rim-' + (i + 1) + ' is right of rim-' + i);
  });
  const others = Object.keys(A).filter((k) => !/^rim-/.test(k) && k !== 'tree' && k !== 'tree-far');
  assert.ok(others.every((k) => A[k].x < rim[4].x), 'rim-5 is the right end of the row');
  // tree-far: a teacher apart from the row (f019, f021), the old tree's trunk (x 1100–1340 at its
  // foot) between her and the old tom at rim-5, and nearer than the rim
  assert.ok(A['tree-far'] && A['tree-far'].x > 1380 && A['tree-far'].y > rim[4].y + 60, 'tree-far is past the trunk and in front of the rim');
  const five = [1, 2, 3, 4, 5].map((i) => ({ who: i === 5 ? 'grizzled' : 'clancat', at: 'rim-' + i, pose: 'sit', mood: 'stern', variant: i }));
  const scene = { set: 'hollow', cam: 'wide', cast: [{ who: 'tallyheart', at: 'sunpatch', pose: 'sit', mood: 'kind', facing: 'right' }, { who: 'player', at: 'sunpatch-2', pose: 'sit', facing: 'right' }].concat(five), fx: ['morning'] };
  const r = art.render(scene, { look: LOOK });
  checkRender(r, scene, 'the rim');
  r.heads.forEach((h, i) => assert.ok(h, 'cast ' + i + ' in shot'));
  for (let i = 0; i < r.heads.length; i++) for (let j = i + 1; j < r.heads.length; j++) {
    const d = Math.hypot((r.heads[i].x - r.heads[j].x) * 1.6, r.heads[i].y - r.heads[j].y);
    assert.ok(d > 7, 'heads ' + i + ' and ' + j + ' are apart: ' + d.toFixed(1));
  }
  const lesson = art.render({ set: 'hollow', cam: 'lesson', cast: five, fx: ['morning'] });
  lesson.heads.forEach((h, i) => assert.ok(h, 'lesson: rim-' + (i + 1) + ' in shot'));
  // Tallyheart at tree-far, in the wide shot: well right of the old tom's head, and bigger than the rim cats
  const apart = art.render({ set: 'hollow', cam: 'wide', cast: five.concat([{ who: 'tallyheart', at: 'tree-far', pose: 'sit', mood: 'kind', facing: 'left', size: 1.2 }]), fx: ['morning'] }, { look: LOOK });
  const t = apart.heads[5], tom = apart.heads[4];
  assert.ok(t && t.x > 80 && t.x - tom.x > 15, 'tree-far is clearly apart from the row: ' + JSON.stringify([t, tom]));
  assert.ok(t.r > tom.r * 1.3, 'and nearer, so bigger');
});

test('hollow tree close-up: the canopy (far above the panel) is left out, so Quick Look draws the trunk; every other camera keeps it', () => {
  // the canopy's rim is the one path in the hollow moved up 8 (translate(0 -8)); it ends near y 320,
  // and the tree camera starts at y 430, so leaving it out changes nothing on screen
  const canopy = (cam) => (art.render({ set: 'hollow', cam, opts: { marks: 2 }, cast: [], fx: ['morning'] }).svg.match(/translate\(0 -8\)/g) || []).length;
  for (const cam of ['wide', 'lesson', 'sand']) assert.equal(canopy(cam), 1, cam + ' draws the canopy');
  assert.equal(canopy('tree'), 0, 'the tree close-up leaves it out');
  const cam = art.sceneInfo('hollow').cams.tree;
  assert.ok(cam.y > 400, 'the tree camera starts below the canopy: y ' + cam.y);
});

test('title wall-2: a second cat on the wall, left of the first, both in the wide shot', () => {
  const A = art.sceneInfo('title').anchors.main;
  assert.ok(A['wall-2'] && A['wall-2'].x < A.wall.x - 150 && A['wall-2'].y === A.wall.y, 'wall-2 sits on the wall, left of wall');
  for (const fx of [['day'], ['sunset'], ['dusk']]) {
    const scene = { set: 'title', cam: 'wide', cast: [{ who: 'player', at: 'wall', pose: 'sit', facing: 'left' }, { who: 'tallyheart', at: 'wall-2', pose: 'sit', facing: 'left' }], fx };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'title ' + fx);
    assert.ok(r.heads[0] && r.heads[1] && r.heads[1].x < r.heads[0].x - 10, fx + ': both cats on the wall, wall-2 on the left');
  }
});

// ---------------------------------------------------------------- chapter 2's sets

// Chapter 2's own sets live in app/art/sets/*.js (other files, other tests; loaded at the top of
// this one, as the page loads them); this checks them against build.md's chapter 2 table.
test('chapter 2 sets (app/art/sets/*.js, as index.html loads them) match build.md\'s chapter 2 table', () => {
  const spec = parseBuildMd();
  assert.ok(SET_FILES.length >= 5, 'index.html loads the chapter 2 set files: ' + SET_FILES.join(', '));
  const v = art.vocab;
  for (const [id, want] of Object.entries(spec.ch2)) {
    const got = v.sets[id];
    assert.ok(got, 'set ' + id);
    for (const c of want.cams) assert.ok(got.cams.includes(c), id + ': camera ' + c);
    for (const a of want.anchors) assert.ok(got.anchors.includes(a), id + ': anchor ' + a);
    for (const o of want.opts) assert.ok(Object.prototype.hasOwnProperty.call(got.opts, o), id + ': option ' + o);
  }
});
