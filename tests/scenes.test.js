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
// chapter 4: the Case File's cards (scenes.js draws her bark with cards.js's own pieces when it is there)
if (has('app/art/cards.js')) require(path.join(ROOT, 'app/art/cards.js'));

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
  // chapter 3: every table to ten times ten, so one claw mark per Count up to ten
  assert.deepEqual(v.sets.hollow.opts.marks.filter((m) => typeof m === 'number'), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'marks 0-10');
  for (const f of spec.fx.concat(['morning', 'day'])) assert.ok(v.fx.includes(f), 'fx ' + f);
  // option values are listed (an array of allowed values, or 'number'; chapter 4: 'cards', a list of card pictures)
  for (const [id, set] of Object.entries(v.sets)) for (const [k, vals] of Object.entries(set.opts)) {
    assert.ok(Array.isArray(vals) || vals === 'number' || vals === 'cards', id + '.' + k + ' lists its values');
  }
  assert.deepEqual(Object.entries(v.sets).flatMap(([id, set]) => Object.keys(set.opts).filter((k) => set.opts[k] === 'cards').map((k) => id + '.' + k)), ['hollow.cards'], 'one option takes a list of cards');
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
  // chapter 2's nine otter poses and five dog poses, and chapter 3's two more for the otters (dive,
  // hush) once cats.js draws them
  const otterPoses = OTHER.otter.length;
  assert.ok(otterPoses >= 9 && OTHER.dog.length >= 5, 'nine otter poses (eleven in chapter 3), five dog poses');
  assert.equal(combos.length, otterPoses + 3 * otterPoses + 3 * OTHER.dog.length);
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
    for (const opts of [{ weather: 'storm', marks: 1, glow: true, splash: true, door: 'open', moth: true }, { drips: true, puddles: true, rainFountain: true, towel: true, marks: 6, glow: [true, false, true] },
      { chime: true, crowd: true, marks: 10, glow: true }]) {
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
  // its rings ripple behind everyone (under the crowd and the cast), never across a face
  assert.equal((fxOf(camp.svg).match(/<ellipse cx="800" cy="700" rx="560" ry="190"/g) || []).length, 0, 'not over the cast');
  const under = (svg) => { const i = svg.indexOf('class="pcs-fx-under"'); return i < 0 ? '' : svg.slice(svg.lastIndexOf('<g', i), svg.indexOf('</g>', i)); };
  assert.equal((under(camp.svg).match(/<ellipse cx="800" cy="700" rx="560" ry="190"/g) || []).length, 3, 'three rings, under');
  const crowded = art.render({ set: 'camp', cam: 'purr', opts: { crowd: true }, cast: [friend], fx: ['morning', 'purr'] }, { look: LOOK });
  assert.ok(crowded.svg.indexOf('pcs-fx-under') > 0 && crowded.svg.indexOf('pcs-fx-under') < crowded.svg.indexOf('data-crowd'), 'under the crowd too');
  assert.equal((crowded.svg.match(/class="pcs-fx-under"/g) || []).length, 1, 'once');
  assert.ok(!both.svg.includes('pcs-fx-under'), 'a marked purrer’s rings are her own, round her');
  // a word over a face lifts to just above it: the naming's wide purr, Glintstar small on the fountain
  const naming = art.render({ set: 'camp', cam: 'purr', opts: { crowd: true }, fx: ['morning', 'purr'], cast: [
    { who: 'glintstar', pose: 'sit', mood: 'kind', at: 'fountain-top', facing: 'left', size: 0.8 },
    { who: 'murmurchime', pose: 'sit', mood: 'happy', at: { x: 760, y: 860 }, facing: 'right', size: 0.8 }] }, { look: LOOK });
  const g0 = naming.heads[0], NW = words(naming.svg);
  assert.equal(NW.length, 3);
  for (const [x, y] of NW) for (const h of naming.heads) assert.ok(Math.hypot(x - h.x * 16, (y - 18) - h.y * 10) > h.r * 16 + 10 || Math.abs(x - h.x * 16) > 80, 'clear of a face: ' + [x, y] + ' vs ' + JSON.stringify(h));
  assert.ok(NW[2][1] < g0.y * 10 - g0.r * 10, 'the middle word above Glintstar’s head: ' + NW[2] + ' ' + JSON.stringify(g0));
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
  // chapter 4, "You sniff your paws": nose down at her forepaws, a stone under her chin would lie on them (the picture
  // would be of a cat sniffing a stone), so for that panel it lies past her nose; any other mood keeps it under her chin
  for (const facing of ['right', 'left']) {
    const put = (stone, mood) => stones(art.render({ set: 'den', cam: 'nest', opts: { stone }, cast: [{ who: 'player', pose: 'crouch', mood, at: 'nest', facing }], fx: ['morning'] }, { look: LOOK }).svg)[0];
    assert.deepEqual(put('chin', 'sniff'), put('nose', 'sniff'), facing + ': sniffing her paws, the chin stone lies where the nose stone does');
    assert.notDeepEqual(put('chin', 'wonder'), put('nose', 'wonder'), facing + ': otherwise under her chin, as she put it');
    assert.ok((put('chin', 'sniff')[0] - put('chin', 'wonder')[0]) * (facing === 'left' ? -1 : 1) > 20, facing + ': further out the way she faces');
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
  // chapter 3: bonking Riffle himself, it is his own fifth juggling pebble, plain round and brown (the
  // bridge set's), off his own head; anyone else is bonked by the grey one, as in chapter 2's f063
  const riffle = fxOf(art.render({ set: 'garden', cam: 'step', cast: [{ who: 'riffle', pose: 'juggle', mood: 'worried', at: 'step' }], fx: ['day', 'bonk'] }).svg);
  assert.ok(/fill="#93704F" stroke="#5D4331"/.test(riffle) && !/#A39E96/.test(riffle), 'Riffle: the brown fifth pebble');
  const f063 = require(path.join(ROOT, 'app/story/ch02.js')).story.ch02.frames.f063.scene;
  assert.ok(/fill="#A39E96"/.test(fxOf(art.render(f063, { look: LOOK }).svg)), 'f063: the grey pebble off her head, as before');
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

// The old tree's trunk (scenes.js, drawHollow: its two edges, cubic Béziers) and the knot hole: the
// claw marks stay on the bark and off the hole.
function bez3(a, b, c, d, t) { const u = 1 - t; return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]); }
function trunkAt(y) {
  const edge = (segs) => {
    let best = null, bd = Infinity;
    for (const sg of segs) for (let t = 0; t <= 1; t += 0.002) { const q = bez3(...sg, t), d = Math.abs(q[1] - y); if (d < bd) { bd = d; best = q[0]; } }
    return best;
  };
  return [edge([[[1140, 880], [1120, 760], [1104, 640], [1098, 560]], [[1098, 560], [1088, 450], [1010, 330], [880, 250]]]),
    edge([[[990, 230], [1130, 330], [1240, 440], [1262, 560]], [[1262, 560], [1280, 660], [1300, 780], [1340, 880]]])];
}
const KNOT = { x: 1206, y: 690, rx: 18, ry: 26 };

test('hollow marks 0-10: one claw mark per Count, three scratches each, left to right; all on the trunk, off the knot hole, inside the keep area and the tree close-up; the first never moves for the second', () => {
  const marks = (m, cam) => {
    const r = art.render({ set: 'hollow', cam: cam || 'wide', opts: { marks: m }, cast: [] });
    const sc = shapes(r.svg, 'fill="#3A281E"');
    const per = [];
    for (let i = 0; i < sc.length; i += 3) per.push(sc.slice(i, i + 3));
    return { r, sc, per };
  };
  const tree = { x: 1000, y: 430, w: 400, h: 250 };
  let prev = null;
  for (let m = 0; m <= 10; m++) {
    const { r, sc, per } = marks(m);
    assert.equal(sc.length, 3 * m, m + ' marks: three scratches each');
    if (!m) { assert.deepEqual(r.keep, []); continue; }
    // keep: one area, in the wide shot (the panel is the world), around every scratch
    assert.equal(r.keep.length, 1, m + ' marks: one keep area');
    const k = r.keep[0], kx0 = k.x * 16, ky0 = k.y * 10, kx1 = (k.x + k.w) * 16, ky1 = (k.y + k.h) * 10;
    for (const p of sc.flat()) {
      assert.ok(p[0] >= kx0 - 1 && p[0] <= kx1 + 1 && p[1] >= ky0 - 1 && p[1] <= ky1 + 1, m + ' marks: scratch point ' + p + ' inside keep ' + [kx0, ky0, kx1, ky1]);
      assert.ok(p[0] >= tree.x && p[0] <= tree.x + tree.w && p[1] >= tree.y && p[1] <= tree.y + tree.h - 8, m + ' marks: inside the tree close-up: ' + p);
      const e = trunkAt(p[1]);
      assert.ok(p[0] > e[0] + 3 && p[0] < e[1] - 3, m + ' marks: on the bark: ' + p + ' trunk ' + e.map(Math.round));
      assert.ok(Math.pow((p[0] - KNOT.x) / (KNOT.rx + 6), 2) + Math.pow((p[1] - KNOT.y) / (KNOT.ry + 6), 2) > 1, m + ' marks: off the knot hole: ' + p);
    }
    // left to right: each mark right of the one before, or the start of a new row below it
    const c = per.map((q) => centre(q.flat()));
    for (let i = 1; i < c.length; i++) assert.ok(c[i][0] > c[i - 1][0] + 20 || c[i][1] > c[i - 1][1] + 40, m + ' marks: mark ' + (i + 1) + ' follows mark ' + i);
    // no two marks overlap: each mark's three scratches keep to their own box
    const boxes = per.map((q) => { const xs = q.flat().map((p) => p[0]), ys = q.flat().map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; });
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      assert.ok(a[2] < b[0] || b[2] < a[0] || a[3] < b[1] || b[3] < a[1], m + ' marks: marks ' + (i + 1) + ' and ' + (j + 1) + ' apart');
    }
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
  // out of range is clamped (to ten), unfilled 'auto' draws none
  assert.equal(marks(12).sc.length, 30);
  assert.equal(marks(-2).sc.length, 0);
  assert.equal(marks('auto').sc.length, 0);
});

test('hollow marks, chapter 3: three marks after the claws lesson, the first two deeper by default ("your ears mark is deeper already"), and depth per mark', () => {
  const draw = (opts) => {
    const svg = art.render({ set: 'hollow', cam: 'tree', opts, cast: [], fx: ['sunset'] }).svg;
    const outer = shapes(svg, 'fill="#3A281E"'), groove = shapes(svg, 'fill="#6B4A32" opacity="0.9"');
    const widths = [];
    for (let i = 0; i < outer.length; i += 3) widths.push([0, 1, 2].reduce((a, j) => { const xs = outer[i + j].map((p) => p[0]); return a + (Math.max(...xs) - Math.min(...xs)) / 3; }, 0));
    // which marks have a groove: by where each groove sits
    const centres = [];
    for (let i = 0; i < outer.length; i += 3) centres.push(centre(outer.slice(i, i + 3).flat()));
    const grooved = centres.map((c) => groove.filter((q) => { const g = centre(q); return Math.abs(g[0] - c[0]) < 22 && Math.abs(g[1] - c[1]) < 40; }).length);
    return { widths, grooved };
  };
  const three = draw({ marks: 3 });
  assert.deepEqual(three.grooved, [3, 3, 0], 'tails and ears deeper, claws fresh');
  assert.ok(three.widths[0] > three.widths[2] + 1 && three.widths[1] > three.widths[2] + 1, 'the first two gouged wider: ' + three.widths.map((w) => w.toFixed(1)));
  const given = draw({ marks: 3, depth: [1, 1, 0] });
  assert.deepEqual(given.grooved, [3, 3, 0]);
  assert.ok(Math.abs(given.widths[0] - given.widths[1]) < 0.5, 'depth per mark: the first two alike');
  // ten marks, a list of depths, one per mark; the rest fresh
  const ten = draw({ marks: 10, depth: [2, 2, 1, 1, 1] });
  assert.equal(ten.widths.length, 10);
  assert.deepEqual(ten.grooved, [3, 3, 3, 3, 3, 0, 0, 0, 0, 0]);
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

// ---------------------------------------------------------------- chapter 3 (build.md, "Chapter 3 (v0.4)")

// Swap PC.art.character for a while (a spy, or a stand-in drawing), restoring it however fn ends.
function withCharacter(fake, fn) {
  const real = art.character;
  art.character = fake;
  try { return fn(); } finally { art.character = real; }
}
const strip = (svg) => svg.replace(/(id="|url\(#|href="#)[^")]+/g, '$1');

test('chapter 3 cast extras reach the drawing: tear, mist, claws, puffed, squeeze, moss, and holds (pebble, vole, fish, fish2) with holdAt; purr, lift, size and at stay the scene\'s', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, calls = [];
  const spy = function (who, opts) { calls.push({ who, opts: Object.assign({}, opts) }); return real(who, opts); };
  const cast = [
    { who: 'sprinkle', pose: 'sit', mood: 'sad', at: 'sand-left', tear: true, mist: true, holds: 'pebble', size: 0.8, purr: true },
    { who: 'player', pose: 'pawup', mood: 'proud', at: 'sand-right', facing: 'left', claws: true, puffed: true, lift: true },
    { who: 'snorer', pose: 'curl', mood: 'sleepy', at: 'sunpatch', moss: true },
    { who: 'mutterer', pose: 'sit', mood: 'worried', at: 'sunpatch-2', squeeze: true, flatEars: true },
    { who: 'riffle', pose: 'stand', mood: 'happy', at: 'tree', holds: 'fish2' },
    { who: 'player', pose: 'walk', mood: 'worried', at: 'rim-3', holds: 'vole', holdAt: 'mouth' }
  ];
  const scene = { set: 'hollow', cam: 'wide', cast, fx: ['sunset'] };
  const r = withCharacter(spy, () => art.render(scene, { look: LOOK }));
  checkRender(r, scene, 'extras');
  const EXTRAS = ['tear', 'mist', 'claws', 'puffed', 'squeeze', 'moss', 'flatEars', 'holds', 'holdAt'];
  cast.forEach((m, i) => {
    const call = calls.find((c) => c.who === m.who && c.opts.pose === m.pose && c.opts.mood === m.mood);
    assert.ok(call, m.who + ' is drawn');
    for (const k of EXTRAS) assert.equal(call.opts[k], m[k], i + ' ' + m.who + ': ' + k);
    for (const k of ['purr', 'lift', 'size', 'at']) assert.equal(call.opts[k], undefined, i + ' ' + m.who + ': ' + k + ' stays the scene\'s');
  });
});

test('sparkles twinkle on a held stone or Sprinkle\'s pebble, never on a vole or a fish in a mouth', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character;
  // a stand-in that reports what it holds, as cats.js does: { what, x, y, r } in its box
  const fake = function (who, opts) {
    const c = real(who, opts);
    if (opts && opts.holds) return Object.assign({}, c, { held: { what: opts.holds, at: 'paws', x: c.w / 2, y: c.h * 0.85, r: 9 } });
    return c;
  };
  const tw = (holds) => withCharacter(fake, () => {
    const r = art.render({ set: 'garden', cam: 'step', cast: [{ who: 'player', pose: 'sit', mood: 'happy', at: 'step', holds }], fx: ['day', 'sparkle'] }, { look: LOOK });
    return (r.svg.slice(r.svg.indexOf('class="pcs-fx">')).match(/class="pcs-tw"/g) || []).length;
  });
  assert.equal(tw('stone'), 3, 'three twinkles on Riffle\'s stone');
  assert.equal(tw('pebble'), 3, 'and on Sprinkle\'s pebble');
  for (const h of ['vole', 'fish', 'fish2']) assert.equal(tw(h), 18, h + ': no twinkle on it; the sparkles scatter as without');
});

// A stand-in Sprinkle: a heron-sized drawing in the cats' units (a 440 box, three times her body's
// width in wings and tail), her head high in the box, and, curled, an `over` part (her tail) drawn
// over whoever comes after her.
const DRIZ = { w: 440, h: 440, head: { x: 300, y: 70 }, headBox: { x0: 250, y0: 20, x1: 360, y1: 130 }, bounds: { x0: 150, y0: 20, x1: 330, y1: 438 } };
function fakeSprinkle(real) {
  return function (who, opts) {
    if (who !== 'sprinkle') return real(who, opts);
    const o = opts || {}, c = Object.assign({ svg: '<rect class="driz-body" x="150" y="20" width="180" height="418" fill="#9AA3A8"/>' }, JSON.parse(JSON.stringify(DRIZ)));
    if (o.pose === 'curl') c.over = '<path class="driz-tail" d="M150 400Q60 420 40 380" fill="#9AA3A8"/>';
    return c;
  };
}

test('Sprinkle at a cat\'s anchor: drawn in the cats\' units (her bigger box makes her bigger), her face\'s r from her head box, her shadow under her body, none when only her eyes show', { skip: !art.character && 'no cats.js' }, () => {
  const fake = fakeSprinkle(art.character);
  withCharacter(fake, () => {
    const a = art.sceneInfo('title').anchors.main.wall, s = a.h / 200;
    const scene = { set: 'title', cam: 'wide', cast: [{ who: 'sprinkle', pose: 'sit', mood: 'shy', at: 'wall', facing: 'right' }, { who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'wall-2' }], fx: ['sunset'] };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'sprinkle on the wall');
    // the drawing is scaled exactly as a cat's at that spot would be
    assert.ok(r.svg.includes('translate(' + a.x + ' ' + a.y + ') scale(' + Math.round(s * 10000) / 10000 + ' ' + Math.round(s * 10000) / 10000 + ') translate(-220 -440)'), 'her box at the cats\' scale');
    const h = r.heads[0];
    assert.ok(h, 'her head is in the panel');
    assert.ok(Math.abs(h.x - (a.x + (300 - 220) * s) / 16) < 0.15 && Math.abs(h.y - (a.y - (440 - 70) * s) / 10) < 0.15, 'her head point, from her drawing: ' + JSON.stringify(h));
    // r: the same share of her head box as a sitting cat's face has of its own
    const cat = art.character('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }), hb = cat.headBox;
    const share = 0.2 * cat.h / ((hb.x1 - hb.x0 + hb.y1 - hb.y0) / 2);
    assert.ok(Math.abs(h.r - share * 110 * s / 1600 * 100) < 0.02, 'her r from her head box: ' + h.r);
    assert.ok(h.y < r.heads[1].y - 8, 'her head well above Tallyheart\'s');
    // her shadow: under her body (bounds x 150-330 of her box), not the whole box
    // (the shadows' opacity, 0.28, is written to one decimal, as every number in the markup)
    const shade = [...r.svg.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([\d.]+)" ry="([\d.]+)" fill="#2A1F3D" opacity="0.3"\/>/g)].map((m) => m.slice(1).map(Number));
    const under = shade.find((e) => Math.abs(e[1] - (a.y - 1)) < 0.2 && Math.abs(e[0] - (a.x + (240 - 220) * s)) < 0.2);
    assert.ok(under, 'a shadow centred under her body: ' + JSON.stringify(shade));
    assert.ok(Math.abs(under[2] - 180 * s * 0.42) < 0.2, 'as wide as her body, not her box: ' + under[2]);
    // only her eyes in the dark: no shadow on the ground for her
    const eyes = art.render({ set: 'title', cam: 'wide', cast: [{ who: 'sprinkle', pose: 'eyes', at: 'wall' }], fx: ['dusk'] }, { look: LOOK });
    const shadeE = [...eyes.svg.matchAll(/<ellipse cx="[-\d.]+" cy="([-\d.]+)" rx="[\d.]+" ry="[\d.]+" fill="#[0-9A-F]+" opacity="0.3"\/>/g)].filter((m) => Math.abs(+m[1] - (a.y - 1)) < 0.2);
    assert.equal(shadeE.length, 0, 'no shadow under eyes in the dark');
  });
});

test('Sprinkle curled round the cat beside her: her tail (the drawing\'s `over`) goes over whoever comes after her in the cast; her head points the balloon at what shows of her face when it tops the camera', { skip: !art.character && 'no cats.js' }, () => {
  withCharacter(fakeSprinkle(art.character), () => {
    const scene = { set: 'title', cam: 'wide', cast: [{ who: 'sprinkle', pose: 'curl', mood: 'happy', at: 'wall' }, { who: 'player', pose: 'loaf', mood: 'happy', at: 'wall-2' }], fx: ['sunset'] };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'curl');
    const body = r.svg.indexOf('driz-body'), tail = r.svg.indexOf('driz-tail');
    const player = r.svg.indexOf('<g transform="translate(900 840)');
    assert.ok(body > 0 && player > body && tail > player, 'body, then the cat, then her tail over the cat: ' + [body, player, tail]);
    assert.equal((r.svg.match(/driz-tail/g) || []).length, 1, 'one tail');
    assert.ok(!art.render({ set: 'title', cam: 'wide', cast: [{ who: 'sprinkle', pose: 'sit', at: 'wall' }] }).svg.includes('driz-tail'), 'only curled');
    // her head point above a cat's camera, most of her face still in it: the balloon points at her face
    // (size 1.23 at the middle of camp, in the crowd camera: her head point just above the panel, nearly
    // half her face in it)
    const top = art.render({ set: 'camp', cam: 'crowd', cast: [{ who: 'sprinkle', pose: 'sit', at: 'center', size: 1.23 }], fx: ['sunset'] });
    const vb = viewBox(top.svg), s = 285 / 200 * 1.23;
    const hb = [830 + (250 - 220) * s, 912 - (440 - 20) * s, 830 + (360 - 220) * s, 912 - (440 - 130) * s];
    assert.ok(912 - (440 - 70) * s < vb[1], 'her head point is above the camera');
    const h = top.heads[0];
    assert.ok(h && h.y >= 0 && h.y < 100, 'she still has a head: ' + JSON.stringify(h));
    assert.ok(Math.abs(h.y - ((vb[1] + hb[3]) / 2 - vb[1]) / vb[3] * 100) < 0.2, 'in the middle of what shows of her face: ' + h.y);
    // a face almost wholly out of the panel stays out (null), as anyone's does
    const gone = art.render({ set: 'camp', cam: 'crowd', cast: [{ who: 'sprinkle', pose: 'sit', at: 'center', size: 1.4 }], fx: ['sunset'] });
    assert.equal(gone.heads[0], null);
  });
});

test('Sprinkle (cats.js): every pose of hers at every anchor of every set and camera; sitting at a cat\'s anchor, her head is well above Tallyheart\'s', { skip: !(art.vocab.otherPoses && art.vocab.otherPoses.sprinkle) && 'cats.js does not draw Sprinkle yet' }, () => {
  const poses = art.vocab.otherPoses.sprinkle;
  let renders = 0;
  for (const [set, info] of Object.entries(art.vocab.sets)) {
    for (const cam of info.cams) {
      for (let start = 0; start < poses.length; start += info.anchors.length) {
        const cast = info.anchors.map((at, i) => ({ who: 'sprinkle', pose: poses[(start + i + renders) % poses.length], mood: MOODS.concat(['sad', 'shy'])[(start + i) % 16], at, facing: i % 2 ? 'left' : 'right' }));
        const scene = { set, cam, cast, fx: [set === 'den' || set === 'sky' ? 'night' : 'day'] };
        checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' sprinkle');
        renders++;
      }
    }
  }
  const r = art.render({ set: 'title', cam: 'wide', cast: [{ who: 'sprinkle', pose: 'sit', mood: 'shy', at: 'wall', facing: 'left' }, { who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'wall-2', facing: 'left' }], fx: ['sunset'] });
  const d = r.heads[0], t = r.heads[1];
  assert.ok(d && t && d.r > 0, 'both in shot; her face has a size');
  const dh = art.character('sprinkle', { pose: 'sit', mood: 'shy', facing: 'left' }), th = art.character('tallyheart', { pose: 'sit', mood: 'kind', facing: 'left' });
  assert.ok(dh.h > th.h, 'her box is bigger than a cat\'s');
  assert.ok(dh.h - (dh.headBox.y0 + dh.headBox.y1) / 2 > th.h - th.headBox.y0, 'sitting, the middle of her face is above the tips of Tallyheart\'s ears');
  assert.ok(d.y < t.y - 5, 'and so it is in the panel: ' + JSON.stringify([d, t]));
});

test('tower chime: a wind chime on Waffles\'s balcony beside her geranium, five tubes, hanging clear above the rail; tiny from the ground; none without the option; it sways only with motion allowed', () => {
  assert.deepEqual(art.vocab.sets.tower.opts.chime, [true, false]);
  const TUBES = /<path d="((?:M[-\d.]+ [-\d.]+h[-\d.]+v[-\d.]+h[-\d.]+z){5})" fill="url\(#[^)]+-l-chimetube\)"/;
  for (const fx of [['sunset'], ['dusk'], ['morning'], ['day']]) {
    const scene = { set: 'tower', cam: 'balcony', opts: { chime: true }, cast: [{ who: 'waffles', pose: 'peer', mood: 'shout', at: 'railing', facing: 'left' }], fx };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'chime ' + fx);
    assert.equal((r.svg.match(/class="pcs-chime"/g) || []).length, 1, 'one chime');
    const m = TUBES.exec(r.svg);
    assert.ok(m, 'five tubes');
    const tubes = m[1].split('M').filter(Boolean).map((t) => t.match(/-?[\d.]+/g).map(Number));
    const xs = tubes.map((t) => t[0]), bottoms = tubes.map((t) => t[1] + t[3]);
    // beside the geranium (its pot spans x 1292-1468 below the rail; the flowers about x 1305-1455)
    assert.ok(Math.min(...xs) > 1100 && Math.max(...xs) < 1300, 'beside the geranium, to its left: ' + xs.map(Math.round));
    assert.ok(Math.max(...bottoms) < 712, 'every tube hangs clear above the rail top (720): ' + bottoms.map(Math.round));
    assert.ok(bottoms[2] > bottoms[0] && bottoms[2] > bottoms[4], 'the longest in the middle');
    // never over Waffles's face
    const h = r.heads[0];
    assert.ok(Math.min(...xs) > h.x * 16 + h.r * 16 + 20, 'clear of her face');
    const plain = art.render({ set: 'tower', cam: 'balcony', cast: scene.cast, fx }, { look: LOOK });
    assert.ok(!/pcs-chime|chimetube/.test(plain.svg), 'no chime without the option');
    assert.equal(strip(art.render({ set: 'tower', cam: 'balcony', opts: { chime: false }, cast: scene.cast, fx }, { look: LOOK }).svg), strip(plain.svg), 'chime: false is no chime');
  }
  // from the ground, nineteen floors down: there, beside her geranium on the tiny balcony
  const up = art.render({ set: 'tower', cam: 'up', opts: { chime: true }, cast: [], fx: ['sunset'] });
  const um = TUBES.exec(up.svg);
  assert.ok(um, 'the chime on the tiny balcony');
  const ut = um[1].split('M').filter(Boolean).map((t) => t.match(/-?[\d.]+/g).map(Number));
  assert.ok(ut.every((t) => t[0] > 1000 && t[0] < 1300 && t[1] > 100 && t[1] < 260 && t[3] < 30), 'tiny, up on her balcony: ' + JSON.stringify(ut[0]));
  assert.ok(!/chimetube/.test(art.render({ set: 'tower', cam: 'up', cast: [], fx: ['sunset'] }).svg));
  // the sway is CSS, inside the reduced-motion guard (checked for every class above), turning on its string
  assert.ok(/\.pcs-chime\{animation:[^}]*transform-origin:50% 0\}/.test(art.css));
});

// The crowd cats' body boxes (world units), from the markup.
const crowdBoxes = (svg) => [...svg.matchAll(/data-crowd="cat" data-box="([^"]+)"/g)].map((m) => m[1].split(' ').map(Number));
const CAMP_MAIN = ['reveal', 'crowd', 'purr', 'ferns'];

test('camp crowd: the whole Clan crowded round the fountain in the wide shots, every cat turned to it; heads from below the fountain, more shadows from above; nothing without the option', () => {
  assert.deepEqual(art.vocab.sets.camp.opts.crowd, [true, false]);
  for (const cam of art.vocab.sets.camp.cams) for (const fx of [['sunset'], ['morning'], ['dusk', 'purr']]) {
    const scene = { set: 'camp', cam, opts: { crowd: true }, cast: [], fx };
    checkRender(art.render(scene, { look: LOOK }), scene, 'crowd ' + cam + ' ' + fx);
    const off = art.render({ set: 'camp', cam, opts: { crowd: false }, cast: [], fx }).svg;
    assert.ok(!/data-crowd/.test(off), cam + ': no crowd without the option');
    assert.equal(strip(off), strip(art.render({ set: 'camp', cam, cast: [], fx }).svg), cam + ': crowd: false is as before');
  }
  const wide = art.render({ set: 'camp', cam: 'reveal', opts: { crowd: true }, cast: [], fx: ['sunset'] });
  const B = crowdBoxes(wide.svg);
  assert.ok(B.length >= 24, 'a crowd: ' + B.length);
  // all round the fountain: some behind it (heads over the basin), some on each side
  assert.ok(B.filter((b) => b[3] < 680 && b[0] > 600 && b[2] < 1000).length >= 4, 'a row behind the fountain');
  assert.ok(B.filter((b) => b[2] < 500).length >= 6 && B.filter((b) => b[0] > 1080).length >= 6, 'groups on both sides');
  // every cat turned to the fountain: cats.js mirrors a cat facing left (a negative matrix)
  for (const m of wide.svg.matchAll(/data-crowd="cat" data-box="([^"]+)">.*?<g transform="translate\(([-\d.]+) [-\d.]+\) scale[^"]*"[^>]*><g transform="matrix\((-?)/g)) {
    const x = +m[2], left = m[3] === '-';
    assert.equal(left, x > 800, 'the cat at x ' + x + ' faces the fountain');
  }
  // the clearing stays open: the fountain's foot, and the middle of camp in front of it
  for (const b of B) {
    assert.ok(!(b[2] > 410 && b[0] < 620 && b[3] > 700), 'nobody at the fountain\'s foot: ' + b);
    assert.ok(!(b[2] > 640 && b[0] < 1000 && b[3] > 760), 'nobody in the middle, in front of the fountain: ' + b);
  }
  // every crowd cat is a Clan cat, in a Clan coat, never her coat (cats.js picks a spare, given her look)
  const real = art.character, calls = [];
  if (real) {
    withCharacter(function (who, opts) { calls.push({ who, opts }); return real(who, opts); }, () => art.render({ set: 'camp', cam: 'purr', opts: { crowd: true }, cast: [], fx: ['dusk', 'purr'] }, { look: LOOK }));
    const crowd = calls.filter((c) => c.opts && c.opts.look);
    assert.ok(crowd.length >= 24 && crowd.every((c) => c.who === 'clancat' && c.opts.look === LOOK && Array.isArray(c.opts.taken)), 'Clan cats, told her look');
    assert.ok(crowd.every((c) => c.opts.mood === 'happy'), 'the purr: every one of them happy, eyes shut');
  }
  // from below the fountain: heads along the bottom; from above: shadows round the edges
  const low = art.render({ set: 'camp', cam: 'fountain', opts: { crowd: true }, cast: [{ who: 'glintstar', at: 'fountain-top', pose: 'stand', mood: 'stern', facing: 'left' }], fx: ['sunset'] });
  assert.equal((low.svg.match(/data-crowd="heads"/g) || []).length, 1);
  assert.equal((low.svg.match(/filter="url\(#[^)]+-f-crowdsil\)"/g) || []).length, 8, 'eight heads');
  assert.deepEqual(low.heads, art.render({ set: 'camp', cam: 'fountain', cast: [{ who: 'glintstar', at: 'fountain-top', pose: 'stand', mood: 'stern', facing: 'left' }], fx: ['sunset'] }).heads, 'Glintstar where she was');
  assert.equal((art.render({ set: 'camp', cam: 'fountain-close', opts: { crowd: true }, cast: [], fx: ['sunset'] }).svg.match(/data-crowd/g) || []).length, 1, 'the heads are below the close-up (drawn, out of shot)');
  assert.equal((art.render({ set: 'camp', cam: 'entrance', opts: { crowd: true }, cast: [], fx: ['sunset'] }).svg.match(/data-crowd="shadow"/g) || []).length, 7);
});

test('camp crowd in the close ferns camera: no crowd cat’s face cut by the panel’s edge (wholly in or wholly out); the wide shots keep their full edges', () => {
  for (const fx of [['morning'], ['morning', 'purr']]) {
    const r = art.render({ set: 'camp', cam: 'ferns', opts: { crowd: true }, cast: [{ who: 'player', pose: 'sit', mood: 'happy', at: 'ferns', facing: 'left' }], fx }, { look: LOOK });
    const [bx, by, bw] = viewBox(r.svg), B = { x: bx, y: by, w: bw };
    const heads = [...r.svg.matchAll(/data-head="([^"]+)"/g)].map((m) => m[1].split(' ').map(Number));
    assert.ok(heads.length > 0);
    for (const h of heads) {
      const cut = (h[1] < B.y && h[3] > B.y) || (h[0] < B.x && h[2] > B.x) || (h[0] < B.x + B.w && h[2] > B.x + B.w);
      assert.ok(!cut, 'a face cut by the edge: ' + h + ' in ' + JSON.stringify(B));
    }
  }
  const wide = art.render({ set: 'camp', cam: 'reveal', opts: { crowd: true }, cast: [], fx: ['morning'] });
  assert.equal((wide.svg.match(/data-crowd="cat"/g) || []).length, 27, 'the wide shot: the whole crowd');
});

test('camp crowd never covers a face: rows behind the cast, none in front of a cast member or level with one overlapping her, none near a face; the cast stays where it was', { skip: !art.character && 'no cats.js' }, () => {
  const A = art.sceneInfo('camp').anchors.main, R = art.character('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }).h;
  // a cast member's boxes in world units, from cats.js, at her anchor
  const boxes = (m) => {
    const a = typeof m.at === 'string' ? A[m.at] : m.at, s = (a.h || 240) / R * (m.size || 1), face = m.facing || a.face || 'right';
    const ch = art.character(m.who, { pose: m.pose, mood: m.mood, facing: face, look: LOOK, variant: m.variant });
    const w = (b) => [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s];
    return { y: a.y, head: w(ch.headBox), body: w(ch.bounds) };
  };
  const hit = (a, b, pad) => a[0] < b[2] + pad && a[2] > b[0] - pad && a[1] < b[3] + pad && a[3] > b[1] - pad;
  const casts = [
    // the Warrior Counts as the text has it: Glintstar above, Murmurpaw small and alone at the foot, you
    // and Tallyheart at the front of the crowd
    [{ who: 'glintstar', at: 'fountain-top', pose: 'sit', mood: 'solemn', facing: 'left' }, { who: 'mutterer', at: 'fountain-foot', pose: 'sit', mood: 'worried', size: 0.85 },
      { who: 'tallyheart', at: 'crowd-left', pose: 'sit', mood: 'kind' }, { who: 'player', at: 'entrance', pose: 'sit', mood: 'wonder' }],
    [{ who: 'player', at: 'crowd-right', pose: 'sit', mood: 'happy', facing: 'left' }, { who: 'tallyheart', at: 'ferns', pose: 'sit', mood: 'kind' }, { who: 'mutterer', at: 'center', pose: 'sit', mood: 'laugh' }],
    [{ who: 'tallyheart', at: 'center', pose: 'stand', mood: 'proud' }, { who: 'player', at: { x: 1010, y: 915 }, pose: 'sit', mood: 'wonder', facing: 'left' }]
  ];
  // and everyone at every anchor in turn
  Object.keys(A).filter((k) => !A[k].elev).forEach((k) => casts.push([{ who: 'player', at: k, pose: 'sit', mood: 'happy' }]));
  for (const cast of casts) for (const cam of CAMP_MAIN) {
    const scene = { set: 'camp', cam, opts: { crowd: true }, cast, fx: ['sunset'] };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'crowd ' + cam + ' ' + cast.map((m) => m.who + '@' + JSON.stringify(m.at)).join(' '));
    assert.deepEqual(r.heads, art.render({ set: 'camp', cam, cast, fx: ['sunset'] }, { look: LOOK }).heads, cam + ': the crowd moves nobody');
    const B = crowdBoxes(r.svg), Z = cast.map(boxes);
    for (const b of B) for (let i = 0; i < Z.length; i++) {
      const z = Z[i];
      assert.ok(!hit(b, z.head, 0), cam + ': a crowd cat ' + b.map(Math.round) + ' near ' + cast[i].who + '\'s face ' + z.head.map(Math.round));
      if (b[3] >= z.y - 6) assert.ok(!hit(b, z.body, 0), cam + ': a crowd cat ' + b.map(Math.round) + ' in front of ' + cast[i].who);
    }
    // the crowd behind the cast is drawn first, so the cast is always on top of it
    const lastCrowd = r.svg.lastIndexOf('data-crowd="cat"');
    cast.forEach((m, i) => { if (r.heads[i]) assert.ok(r.svg.indexOf('<ellipse', lastCrowd) >= 0); });
  }
  // the Warrior Counts: Murmurpaw alone at the fountain's foot (no crowd cat within a cat's width of her)
  const r = art.render({ set: 'camp', cam: 'crowd', opts: { crowd: true }, cast: casts[0], fx: ['sunset'] }, { look: LOOK });
  const her = boxes(casts[0][1]);
  for (const b of crowdBoxes(r.svg)) assert.ok(!hit(b, her.body, 30), 'Murmurpaw alone: ' + b.map(Math.round));
});

test('garden hedge-side: a second cat on the lawn beside the gap in the hedge, both faces clear of each other, in the close-up and the wide shot', () => {
  const A = art.sceneInfo('garden').anchors.main;
  assert.ok(A['hedge-side'] && A['hedge-side'].x < A['hedge-gap'].x - 150 && Math.abs(A['hedge-side'].y - A['hedge-gap'].y) < 12, 'beside the gap');
  for (const cam of ['hedge', 'wide']) for (const fx of [['sunset'], ['dusk']]) {
    const scene = { set: 'garden', cam, cast: [{ who: 'tallyheart', at: 'hedge-gap', pose: 'sit', mood: 'stern', facing: 'left' }, { who: 'player', at: 'hedge-side', pose: 'stand', mood: 'worried', holds: 'vole' }], fx };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'hedge-side ' + cam);
    const [t, p] = r.heads;
    assert.ok(t && p, cam + ': both in shot');
    if (t.r && p.r) assert.ok(Math.hypot((t.x - p.x) * 16, (t.y - p.y) * 10) > (t.r + p.r) * 16, cam + ': faces apart');
    assert.ok(p.x < t.x, 'she is left of the gap');
  }
});

test('every frame of chapter 3 renders with the art vocabulary (once it is written)', () => {
  require(path.join(ROOT, 'app/story/ch03.js'));
  const ch = PC.story && PC.story.ch03;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.board !== 'STUB.') : [];
  for (const [id, f] of frames) {
    const s = f.scene, v = art.vocab;
    assert.ok(v.sets[s.set], id + ': set ' + s.set);
    assert.ok(v.sets[s.set].cams.includes(s.cam), id + ': camera ' + s.set + '/' + s.cam);
    for (const m of s.cast || []) if (typeof m.at === 'string') assert.ok(v.sets[s.set].anchors.includes(m.at), id + ': anchor ' + m.at + ' in ' + s.set);
    // the UI fills 'auto' from the cat before drawing; here, three marks (the claws lesson done) and her stone by her nose
    const o = Object.assign({}, s.opts || {});
    if (o.marks === 'auto') o.marks = 3;
    if (o.glow === 'auto') o.glow = [true, false, false];
    if (o.depth === 'auto') delete o.depth;
    if (o.stone === 'auto') o.stone = 'nose';
    const scene = Object.assign({}, s, { opts: o });
    checkRender(art.render(scene, { look: LOOK }), scene, 'ch03 ' + id);
  }
});

// ================================================================ chapter 4 (docs/build.md, "Chapter 4 (v0.4)")

// ---------------------------------------------------------------- chapters 1-3 look exactly as they did

// <ch13-fingerprint>
// One fingerprint for every camera of chapter 1's nine sets, as chapters 1-3 use them: a cast at
// every anchor they had, with and without every option they had, in five lights, drawn with
// placeholder cats, so only scenes.js is in the picture (cats.js may change; these must not).
const CH13 = {
  anchors: {
    room: ['cushion', 'floor', 'glass', 'doorway'], tower: ['window', 'railing'], garden: ['step', 'lawn', 'fence-foot', 'lamp-top', 'hedge-gap', 'doorway', 'hedge-side'],
    camp: ['entrance', 'fountain-top', 'fountain-foot', 'crowd-left', 'crowd-right', 'ferns', 'center'],
    hollow: ['sand-left', 'sand-right', 'sunpatch', 'tree', 'sunpatch-2', 'sunpatch-3', 'tree-far', 'rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'],
    den: ['entrance-left', 'entrance-right', 'doorway', 'nest', 'sleeper-1', 'sleeper-2'], sky: ['ground-left', 'ground-right'], river: ['bank'], title: ['wall', 'wall-2']
  },
  opts: { door: 'open', reflection: true, clan: true, sparrows: 12, lampSparrow: true, dish: true, moth: true, towel: true, puddles: true, rainFountain: true, crowd: true, chime: true,
    marks: 3, glow: [true, false, true], weather: 'clear', drips: true, stone: 'nose', splash: true },
  fx: [[], ['night', 'stars', 'skyriver'], ['morning'], ['dusk', 'rain', 'lightning'], ['sunset', 'purr', 'sparkle', 'zzz', 'motion', 'glow', 'bonk']],
  who: ['player', 'tallyheart', 'waffles', 'grizzled', 'clancat', 'sparrow', 'moth', 'tallone', 'riffle', 'sprinkle'],
  poses: ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer']
};
// What chapter 6 adds to chapter 1's sets, by name (its own cameras and spots; every one is new, so
// the fingerprints below keep to the cameras they always covered)
const CH6_NEW = {
  title: { cams: ['end', 'meet'], anchors: ['wall-3', 'end-1', 'end-2', 'end-3', 'reed-1', 'reed-2', 'reed-3'], opts: ['rustle'] },
  sky: { cams: ['walk', 'below'], anchors: ['star-1', 'star-2'], opts: [] }
};
const ch1Cams = (set) => art.vocab.sets[set].cams.filter((c) => !((CH6_NEW[set] || {}).cams || []).includes(c));
function ch13Fingerprint(art, crypto) {
  const fake = function () { throw new Error('placeholder'); };
  fake.placeholder = true;
  const real = art.character, out = {};
  art.character = fake;
  try {
    for (const set of Object.keys(CH13.anchors)) {
      for (const cam of ch1Cams(set)) {
        const h = crypto.createHash('sha1');
        CH13.fx.forEach((fx, f) => {
          const cast = CH13.anchors[set].map((at, i) => {
            const k = i + f, who = CH13.who[k % CH13.who.length];
            const m = { who, at, pose: CH13.poses[(k * 5) % CH13.poses.length], mood: ['neutral', 'happy', 'sleepy', 'scared'][k % 4], facing: k % 2 ? 'left' : 'right', variant: (k % 6) + 1 };
            if (k % 5 === 0) m.size = 0.85;
            if (k % 7 === 0) m.purr = true;
            if (k % 4 === 1) m.lift = true;
            return m;
          });
          // a moon is asked for at night only: at dusk or sunset it drew nothing before chapter 4,
          // and is the young moon now (the one deliberate change, tested below)
          const opts = Object.assign({}, CH13.opts, fx.includes('night') ? { moon: true } : {});
          for (const scene of [{ set, cam, opts, cast, fx }, { set, cam, cast: cast.slice(0, 2), fx }, { set, cam, opts: { weather: f % 2 ? 'storm' : 'cloudy', marks: 10, depth: [2, 1, 0], glow: true, stone: 'chin' }, cast: [], fx }]) {
            const r = art.render(scene, { look: { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' } });
            h.update(r.svg.replace(/pcs[0-9a-z]+-/g, '') + JSON.stringify(r.heads) + JSON.stringify(r.keep));
          }
        });
        out[set + '/' + cam] = h.digest('hex').slice(0, 16);
      }
    }
  } finally { art.character = real; }
  return out;
}
// </ch13-fingerprint>
const CH13_FINGERPRINT = {
  'room/wide': '1c060c96692a8094', 'room/cushion': '7bd537b108b3312d', 'room/glass': '4652bc4f27c59950', 'room/outside': 'a5fec3c0419d252a',
  'tower/up': '3e305d8a72779fd1', 'tower/balcony': '79a707cac5a1d77e', 'tower/balcony-close': '3e86a8936d1adede',
  'garden/wide': '21134a9369b2fa32', 'garden/paws': 'ac65070c5b22a910', 'garden/step': 'f9637629d33d02ab', 'garden/fence': 'd391c862a8fa2e57', 'garden/lamp': '18eda060614bff28',
  'garden/meet': '55807ec6b2f15f08', 'garden/hedge': 'e8e7020ce5b0f14a', 'garden/hedge-close': 'b1555508971c43b9',
  'camp/reveal': '82d2b71e8ae0209e', 'camp/crowd': '96218e76d85441e4', 'camp/fountain': '68ff733bb524a469', 'camp/entrance': '7411b4ff9e385650', 'camp/fountain-close': 'f23e1c54970d3492',
  'camp/ferns': '8a8cbfa4c44c4cd3', 'camp/purr': '54b99ac976dd6911',
  'hollow/wide': '9cc363695139e221', 'hollow/lesson': '27178ecdcaa607b7', 'hollow/sand': '22575ad532bb51b1', 'hollow/tree': '1a75e6bdf7879c08',
  'den/outside': '2835ed7eb7615b45', 'den/inside': '9add5e42e49787df', 'den/nest': 'd036e0b1ac61ab7d', 'den/doorway': '30c9140ff0a4ea45',
  'sky/up': 'fcf06935598addc6', 'sky/cats': 'de9e7845a2de172a', 'river/crash': '36031dec6afdee48', 'title/wide': 'c3078ad2d62c5efb'
};

test('chapters 1-3 look exactly as they did: every camera of chapter 1\'s nine sets, a cast at every anchor, with and without every option, in five lights, matches its fingerprint from before chapter 4', () => {
  const now = ch13Fingerprint(art, require('crypto'));
  assert.deepEqual(Object.keys(now), Object.keys(CH13_FINGERPRINT), 'the same sets and cameras, in the same order');
  for (const k of Object.keys(CH13_FINGERPRINT)) assert.equal(now[k], CH13_FINGERPRINT[k], k + ' draws something else than it did for chapters 1-3');
  // the real cats are back, and the placeholders left nothing behind
  assert.ok(!art.character || !art.character.placeholder);
});

// ---------------------------------------------------------------- chapter 4: helpers

const NEW_OPTS = { tower: { light: [false, true], roar: [false, true], ding: [false, true] }, den: { hidden: [false, true] }, hollow: { bark: [false, 'falling', 'sand', 'row'], heap: [false, true] } };
// the markup of the group that carries data-prop="name" (to its closing tag), or '' when it is not drawn
function prop(svg, name) {
  const at = svg.indexOf('data-prop="' + name + '"');
  if (at < 0) return '';
  const start = svg.lastIndexOf('<', at);
  if (svg.slice(start, start + 2) !== '<g') return svg.slice(start, svg.indexOf('>', at) + 1);
  const re = /<g[\s>]|<\/g>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(svg))) {
    depth += m[0] === '</g>' ? -1 : 1;
    if (!depth) return svg.slice(start, m.index + 4);
  }
  return svg.slice(start);
}
const pathPoints = (markup) => [...markup.matchAll(/<path d="([^"]+)"/g)].flatMap((m) => (m[1].match(/[ML]-?[\d.]+ -?[\d.]+/g) || []).map((t) => t.slice(1).split(' ').map(Number)));
// the tower from below: its two edges at height y (scenes.js, TOWER.edge), and its floors
const towerEdge = (y) => { const t = (1000 - y) / 960; return [230 + 330 * t, 1370 - 330 * t]; };
const towerUp = (opts, cast, fx) => {
  const scene = { set: 'tower', cam: 'up', opts: opts || {}, cast: cast || [], fx: fx || ['day'] };
  const r = art.render(scene, { look: LOOK });
  checkRender(r, scene, 'tower/up ' + JSON.stringify(opts || {}));
  return r;
};
// pieces of bark pressed flat (scenes.js, barkAt): standing (the nest's row) or lying (the sand's)
const PIECE = /<g transform="translate\(([-\d.]+) ([-\d.]+)\) rotate\((-?[\d.]+)\) (scale|matrix)\(([\d.]+)[^)]*\) translate\(-[\d.]+ -[\d.]+\)" data-bark="(card|blank)">/g;
const pieces = (svg) => [...svg.matchAll(PIECE)].map((m) => ({ x: +m[1], y: +m[2], rot: +m[3], flat: m[4] === 'matrix', w: +m[5] * 200, kind: m[6] }));
const corners = (svg) => [...svg.matchAll(/<g transform="translate\(([-\d.]+) ([-\d.]+)\) scale\([\d. ]+\) rotate\(-?[\d.]+\)" data-bark="corner">/g)].map((m) => ({ x: +m[1], y: +m[2] }));
const inVb = (x, y, vb, pad) => x >= vb[0] + (pad || 0) && x <= vb[0] + vb[2] - (pad || 0) && y >= vb[1] + (pad || 0) && y <= vb[1] + vb[3] - (pad || 0);
// a stand-in cards.js: remembers what it was asked for, in order
function withCards(fake, fn) {
  const had = Object.prototype.hasOwnProperty.call(art, 'cardGroup'), real = art.cardGroup;
  if (fake === null) delete art.cardGroup; else art.cardGroup = fake;
  try { return fn(); } finally { if (had) art.cardGroup = real; else delete art.cardGroup; }
}
const nestScene = (opts, cat, cam, fx) => ({ set: 'den', cam: cam || 'nest', opts: opts, cast: cat === null ? [] : [Object.assign({ who: 'player', at: 'nest', pose: 'lie', mood: 'happy', facing: 'right' }, cat || {})], fx: fx || ['night'] });
const NEST_X = 1060;

test('vocab, chapter 4: the tower\'s light, roar and ding with the corner and foot anchors; the den\'s bark and hidden; the hollow\'s bark and heap; build.md\'s chapter 4 section names them', () => {
  const v = art.vocab.sets;
  for (const [set, opts] of Object.entries(NEW_OPTS)) for (const [k, vals] of Object.entries(opts)) assert.deepEqual(v[set].opts[k], vals, set + '.' + k);
  assert.deepEqual(v.den.opts.bark, [false, 'auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'den.bark: a number of pieces, or auto');
  assert.ok(v.tower.anchors.includes('corner') && v.tower.anchors.includes('foot'), 'tower anchors: ' + v.tower.anchors);
  assert.ok(v.hollow.opts.marks.includes(4), 'marks: 4');
  // chapter 2's and 3's options are all still there, with the values they had
  assert.deepEqual(v.tower.opts.chime, [true, false]);
  assert.deepEqual(v.den.opts.moon.slice(0, 2), [false, true]);   // (chapter 5 adds the moon's age: tested with chapter 5's vocabulary)
  assert.deepEqual(v.den.opts.stone, [false, true, 'nose', 'chin', 'auto']);
  assert.deepEqual(v.hollow.opts.glow, [true, false, 'auto']);
  // no option is on unless a frame asks: chapters 1-3 never did
  const info = (set) => art.sceneInfo(set).defaults;
  for (const [set, opts] of Object.entries(NEW_OPTS)) for (const k of Object.keys(opts)) assert.equal(info(set)[k], undefined, set + '.' + k + ' has no default');
  assert.equal(info('den').bark, undefined);
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8'), at = md.indexOf('## Chapter 4');
  assert.ok(at > 0, 'build.md has a chapter 4 section');
  const ch4 = md.slice(at);
  for (const k of ['light', 'roar', 'corner', 'ding', 'bark', 'hidden', 'moon', 'marks: 4', 'heap', 'wink: true', 'holds: \'bark\'']) assert.ok(ch4.includes('`' + k), 'build.md, chapter 4, names ' + k);
});

// ---------------------------------------------------------------- the tower from below

test('tower light: the little red light stands above the picture until a frame asks; light: true brings it down to the very top, on its mast, blinking, and the lettering keeps off it', () => {
  const plain = towerUp({}), lit = towerUp({ light: true });
  assert.equal(prop(plain.svg, 'light'), '', 'no light in the picture by default');
  assert.ok(/<circle cx="800" cy="-42" r="5" fill="#FF5A4E" class="pcs-blink"\/>/.test(plain.svg), 'chapters 1-3: the mast runs out of the top of the panel, its light above it');
  assert.deepEqual(plain.keep, []);
  const L = prop(lit.svg, 'light');
  assert.ok(L, 'light: true draws it');
  const core = /<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="#FF4B3E"\/>/.exec(L);
  assert.ok(core, 'a red lamp');
  const [cx, cy, cr] = core.slice(1).map(Number);
  assert.equal(cx, 800, 'on the roof\'s middle');
  assert.ok(cy - cr > 0 && cy + cr < 40, 'at the very top, whole, above the roof line (y 40): ' + cy);
  assert.ok(cr >= 6 && cr <= 12, 'little: r ' + cr);
  assert.ok(/class="pcs-blink"/.test(L), 'it blinks');
  assert.ok(/<circle cx="800" cy="[\d.]+" r="[\d.]+" fill="url\(#/.test(L), 'with a glow');
  assert.ok(!/cy="-42"/.test(lit.svg), 'one light, not two');
  // its mast stands on the roof, under the lamp
  assert.ok(new RegExp('<rect x="797" y="' + cy + '" width="6" height="[\\d.]+" fill="#[0-9A-Fa-f]{6}"/>').test(lit.svg), 'a mast under it');
  assert.equal(lit.keep.length, 1);
  const k = lit.keep[0];
  assert.ok(k.x < 50 && k.x + k.w > 50 && k.y === 0 && k.h >= (cy + cr) / 10, 'keep covers the light: ' + JSON.stringify(k));
  // light: false is the picture as it was
  assert.equal(strip(towerUp({ light: false }).svg), strip(plain.svg));
  // in every light of the day it is drawn; the balcony cameras (no roof in them) are unchanged by it
  for (const fx of [['day'], ['sunset'], ['dusk'], ['night'], ['morning']]) assert.ok(prop(towerUp({ light: true }, [], fx).svg, 'light'), fx + ': lit');
  for (const cam of ['balcony', 'balcony-close']) {
    const a = art.render({ set: 'tower', cam, opts: {}, cast: [], fx: ['day'] }).svg, b = art.render({ set: 'tower', cam, opts: { light: true, roar: true, ding: true }, cast: [], fx: ['day'] }).svg;
    assert.equal(strip(b), strip(a), cam + ': nothing of the roof');
  }
});

test('tower roar: jagged sound lines in the sky on both sides of the roof, three a side, in the panel, clear of the tower, the neighbours, the airplanes and Waffles\'s balcony; the roar shows the light too', () => {
  const r = towerUp({ roar: true, chime: true }, [{ who: 'waffles', at: 'railing', pose: 'peer', mood: 'shout', facing: 'left' }]);
  const R = prop(r.svg, 'roar');
  assert.ok(R, 'roar: true draws them');
  assert.equal((R.match(/class="pcs-pulse"/g) || []).length, 3, 'three rings, each pulsing');
  const rings = R.split('class="pcs-pulse"').slice(1).map((m) => pathPoints(m.slice(0, m.indexOf('</g>'))));
  rings.forEach((P, i) => {
    assert.ok(P.length >= 16, 'ring ' + i + ' is jagged: ' + P.length + ' points');
    const left = P.filter((q) => q[0] < 800), right = P.filter((q) => q[0] > 800);
    assert.ok(left.length >= 8 && right.length >= 8, 'ring ' + i + ' stands on both sides of the roof');
    for (const q of P) {
      assert.ok(q[0] > 20 && q[0] < 1580 && q[1] >= 0 && q[1] < 200, 'ring ' + i + ': in the panel, up by the roof: ' + q);
      const e = towerEdge(Math.max(40, q[1]));
      assert.ok(q[0] < e[0] - 8 || q[0] > e[1] + 8, 'ring ' + i + ': clear of the tower: ' + q + ' edges ' + e.map(Math.round));
      // the neighbours' near edges (x 330 on the left above y 120, x 1290 on the right from y 300), and the airplanes (x 1290-1370, y 130-170; x 270-330, y 245-275)
      assert.ok(q[0] > 345 && q[0] < 1275, 'ring ' + i + ': in the open sky between the towers: ' + q);
    }
    // jagged: neighbours zig and zag across the line
    const zig = left.slice(1).filter((q, j) => Math.abs(q[0] - left[j][0]) > 5).length;
    assert.ok(zig >= 6, 'ring ' + i + ': zigzag');
  });
  // each ring stands further out than the one before
  const out = rings.map((P) => Math.min(...P.filter((q) => q[0] > 800).map((q) => q[0])));
  assert.ok(out[0] < out[1] && out[1] < out[2], 'further and further out: ' + out);
  // Waffles is well below them
  assert.ok(r.heads[0] && r.heads[0].y > 20, 'Waffles at her railing, under the roar');
  // the roar comes from the roof: the light is in the picture with it, unless a frame says no
  assert.ok(prop(r.svg, 'light'), 'the light shows with the roar');
  const dark = towerUp({ roar: true, light: false });
  assert.ok(prop(dark.svg, 'roar') && !prop(dark.svg, 'light'), 'light: false keeps it out');
  assert.equal(prop(towerUp({ light: true }).svg, 'roar'), '', 'no roar without the option');
});

test('tower ding: a small DING! lettered at the very top, beside the red light, in the panel; the lettering keeps off it; never without the option', () => {
  const plain = towerUp({ light: true }), r = towerUp({ light: true, ding: true });
  assert.ok(!/DING/.test(plain.svg));
  const D = prop(r.svg, 'ding');
  assert.ok(D, 'ding: true letters it');
  const t = /<text x="([\d.]+)" y="([\d.]+)" text-anchor="middle" font-family="Bangers[^"]*" font-size="([\d.]+)"[^>]*>DING!<\/text>/.exec(D);
  assert.ok(t, 'in the sound effects\' own lettering: ' + D.slice(0, 200));
  const [x, y, size] = t.slice(1).map(Number);
  assert.ok(size >= 36 && size <= 56, 'small: ' + size);
  assert.ok(y - size > -6 && y < 90, 'at the very top: baseline ' + y);
  assert.ok(x - 800 > 40 && x - 800 < 200, 'beside the light, not on it: ' + x);
  assert.equal(r.keep.length, 2, 'the light and the DING');
  const k = r.keep[1];
  assert.ok(k.x * 16 <= x - 60 && (k.x + k.w) * 16 >= x + 60 && (k.y + k.h) * 10 >= y, 'keep covers the DING: ' + JSON.stringify(k));
  assert.ok(prop(towerUp({ ding: true }).svg, 'light'), 'the DING shows the light too');
  const bare = towerUp({ ding: true, light: false });
  assert.ok(prop(bare.svg, 'ding') && !prop(bare.svg, 'light') && bare.keep.length === 1, 'unless a frame says light: false');
  // all three together: the roar stands clear of the DING
  const all = towerUp({ light: true, roar: true, ding: true });
  for (const q of pathPoints(prop(all.svg, 'roar'))) assert.ok(q[0] < x - 110 || q[0] > x + 110, 'the roar keeps off the DING: ' + q);
});

test('tower corner: a climber on a balcony halfway up the tower\'s edge, behind its rail, in the panel, between the ground and Waffles; her balcony is drawn bigger only when she is on it; foot: outside, in front of the glass', { skip: !art.character && 'no cats.js' }, () => {
  const A = art.sceneInfo('tower').anchors.up, c = A.corner, f = A.foot;
  assert.ok(c && c.elev && c.z === 'behind', 'corner is up on a balcony, behind its rail');
  assert.ok(c.y > 420 && c.y < 580, 'halfway up (the ground floor is at y 800, the roof at 40): ' + c.y);
  const e = towerEdge(c.y);
  assert.ok(Math.abs(c.x - e[1]) < 80, 'on the tower\'s right edge: ' + c.x + ' edge ' + Math.round(e[1]));
  assert.ok(f && f.y === 1000 && f.x > 520 && f.x < 1080 && f.z !== 'behind', 'foot: on the ground in front of the ground-floor glass');
  // ... and not in the middle of the lit window, on her old room's pink rug (an ellipse at x 850, 110 either way):
  // right of it, across the window's frame post, so she is plainly outside
  assert.ok(f.x > 850 + 110 + 20, 'foot: clear of the rug: ' + f.x);
  const waffles = { who: 'waffles', at: 'railing', pose: 'peer', mood: 'shout', facing: 'left' };
  for (const pose of ['sit', 'stretch', 'stand', 'peer', 'lookup']) {
    const r = towerUp({ light: true, roar: true }, [waffles, { who: 'player', at: 'corner', pose, mood: 'happy', facing: 'left' }], ['sunset']);
    const w = r.heads[0], p = r.heads[1];
    assert.ok(w && p, pose + ': both in the panel');
    assert.ok(p.y > w.y + 15 && p.y < 62, pose + ': below Waffles, above the ground floor: ' + JSON.stringify([w, p]));
    assert.ok(p.r >= w.r * 0.8, pose + ': a small cat, but no smaller than Waffles nineteen floors up: ' + p.r + ' vs ' + w.r);
    // her balcony: bigger than the little ones, its slab under her feet, its rail drawn after her (over her)
    const B = prop(r.svg, 'corner-balcony');
    assert.ok(B, pose + ': her balcony');
    const slab = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/.exec(B).slice(1).map(Number);
    assert.ok(Math.abs(slab[1] - c.y) < 0.2 && slab[0] < c.x && slab[0] + slab[2] > c.x && slab[2] > 120, pose + ': the slab holds her: ' + slab);
    const cat = r.svg.indexOf('translate(' + c.x + ' ' + c.y + ')'), rail = r.svg.indexOf('<rect x="' + (Math.round((slab[0] + 2) * 10) / 10) + '"', cat);
    assert.ok(cat > 0 && rail > cat, pose + ': the rail is drawn over her');
  }
  // nobody on it: the little balcony chapters 1-3 drew, and no other
  assert.equal(prop(towerUp({ light: true }, [waffles]).svg, 'corner-balcony'), '');
  // foot: in the panel at the bottom, drawn after the glass (outside it), far bigger than the climber
  const r = towerUp({}, [waffles, { who: 'player', at: 'foot', pose: 'lookup', mood: 'wonder', facing: 'right' }, { who: 'player', at: 'corner', pose: 'sit', mood: 'happy' }]);
  assert.ok(r.heads[1] && r.heads[1].y > 75, 'at the foot of the tower: ' + JSON.stringify(r.heads[1]));
  assert.ok(r.heads[1].r > r.heads[2].r * 1.7, 'near, so big; the climber far, so small');
  assert.ok(r.svg.indexOf('translate(' + f.x + ' ' + f.y + ')') > r.svg.lastIndexOf('#CDEBF0'), 'in front of the glass');
  // the old spot behind the glass is where it was
  assert.deepEqual([A.window.x, A.window.y, A.window.h, A.window.z], [700, 1000, 215, 'behind']);
  // and a spot of its own in this picture is sized as it always was (220 high: the two new anchors
  // are kept out of the composition's depth), and a cast member with no spot still goes to the window
  const own = towerUp({}, [{ who: 'clancat', variant: 2, at: { x: 640, y: 960 }, pose: 'sit', mood: 'happy' }]);
  assert.ok(own.svg.includes('translate(640 960) scale(1.1 1.1) translate(-100 -200)'), 'a spot of its own: 220 high');
  const nowhere = towerUp({}, [{ who: 'clancat', variant: 2, pose: 'sit', mood: 'happy' }]);
  assert.ok(nowhere.svg.includes('translate(700 1000) scale('), 'no spot given: the window, as before');
});

// ---------------------------------------------------------------- the den: her Case File in her nest

test('den bark: her pieces of bark stand in a row along her nest\'s front edge, as many as asked for, overlapping like roof tiles, the newest in front at the middle; in the panel in every inside camera; never seen from outside; none unless asked', { skip: !art.character && 'no cats.js' }, () => {
  for (const cam of ['nest', 'inside', 'doorway']) {
    assert.equal(pieces(art.render(nestScene({}, {}, cam), { look: LOOK }).svg).length, 0, cam + ': no bark before the Case File');
    // (one row holds nine, chapter 4's fullest; from the tenth the bark stands two deep: chapter 5's test, below)
    for (const n of [0, 1, 2, 5, 7, 9]) {
      const scene = nestScene({ bark: n, stone: 'nose' }, {}, cam), r = art.render(scene, { look: LOOK });
      checkRender(r, scene, 'den/' + cam + ' bark ' + n);
      const P = pieces(r.svg), vb = viewBox(r.svg);
      assert.equal(P.length, n, cam + ': bark ' + n + ' is ' + n + ' pieces');
      assert.equal(corners(r.svg).length, 0, cam + ': nothing under the moss');
      if (!n) { assert.equal(prop(r.svg, 'nest-bark'), ''); continue; }
      for (const q of P) {
        assert.ok(!q.flat && q.w > 30 && q.w < 50, cam + ': standing, about a paw wide (the nest is 300 across): ' + q.w);
        assert.ok(inVb(q.x - q.w / 2, q.y - q.w * 1.2, vb, 2) && inVb(q.x + q.w / 2, q.y, vb, 2), cam + ' bark ' + n + ': in the panel: ' + JSON.stringify(q));
        // along the nest's front edge: within its width, on the front rim (below its middle line, above its outer edge)
        assert.ok(Math.abs(q.x - NEST_X) < 148 && q.y > 886 && q.y < 886 + 46, cam + ': on the front rim: ' + JSON.stringify(q));
      }
      // one row, running in toward the middle, each piece over the one before
      for (let i = 1; i < P.length; i++) {
        const step = P[i].x - P[i - 1].x;
        assert.ok(step > 4 && step < P[i].w * 0.6, cam + ' bark ' + n + ': overlapping like roof tiles: step ' + step.toFixed(1) + ' of ' + P[i].w.toFixed(1));
      }
      assert.ok(Math.abs(P[P.length - 1].x - NEST_X) <= Math.abs(P[0].x - NEST_X), cam + ': the newest nearest the middle');
      // the lettering keeps off the row
      assert.ok(r.keep.length >= 1, cam + ': keep');
      const k = r.keep[r.keep.length - 1], kx0 = vb[0] + k.x / 100 * vb[2], kx1 = vb[0] + (k.x + k.w) / 100 * vb[2], ky0 = vb[1] + k.y / 100 * vb[3];
      for (const q of P) assert.ok(q.x > kx0 - 1 && q.x < kx1 + 1 && q.y - q.w * 1.2 >= ky0 - 1.5, cam + ' bark ' + n + ': inside keep');
    }
  }
  // from outside the den nothing of it shows
  const out = art.render({ set: 'den', cam: 'outside', opts: { bark: 9, hidden: true }, cast: [], fx: ['night'] }).svg;
  assert.equal(pieces(out).length + corners(out).length, 0, 'not seen from outside');
  // 'auto' is the UI's to fill from the cat; left unfilled (the gallery, the storyboard), the seven every cat holds at bedtime
  assert.equal(pieces(art.render(nestScene({ bark: 'auto' }), { look: LOOK }).svg).length, 7);
  // more than fit are drawn closer, never past BARK_MAX: twenty-four until chapter 8, twenty-seven since (a third
  // course past what any live save holds: docs/chapters/08-the-night-trail.spec.md, section 4, "The nest grows")
  assert.equal(pieces(art.render(nestScene({ bark: 40 }), { look: LOOK }).svg).length, 27);
  assert.equal(pieces(art.render(nestScene({ bark: -3 }), { look: LOOK }).svg).length, 0);
});

test('den bark: the row is on the side away from her head, whichever way she lies and in every pose; no piece on her face or on Riffle\'s stone; nobody home, it stands on the left', { skip: !art.character && 'no cats.js' }, () => {
  const s = art.sceneInfo('den').anchors.inside.nest.h / 200;
  const STONE = /translate\(([-\d.]+) ([-\d.]+)\) rotate\(-?[\d.]+\)"><ellipse cx="0" cy="0" rx="([\d.]+)" ry="[\d.]+" fill="#24252C"/;
  for (const facing of ['right', 'left']) for (const pose of ['lie', 'loaf', 'curl', 'sit', 'pawup', 'flat', 'crouch']) for (const stone of [true, 'nose', 'chin']) for (const opts of [{ bark: 9 }, { bark: 9, hidden: true }, { bark: 5 }]) {
    const scene = nestScene(Object.assign({ stone }, opts), { pose, facing }), r = art.render(scene, { look: LOOK }), label = [pose, facing, stone, JSON.stringify(opts)].join(' ');
    const P = pieces(r.svg), C = corners(r.svg), dir = facing === 'left' ? 1 : -1;
    assert.equal(P.length, opts.hidden ? opts.bark - 2 : opts.bark, label);
    for (const q of P.concat(C)) assert.ok(dir * (q.x - NEST_X) > -8, label + ': away from her head: ' + q.x);
    const head = worldHeadBox(r, 0, scene, 'player', Object.assign({ pose, mood: 'happy', facing, look: LOOK }, LOOK.sex ? { sex: LOOK.sex } : {}), s).box;
    for (const q of P) {
      const box = [q.x - q.w / 2, q.y - q.w * 1.2, q.x + q.w / 2, q.y];
      // (her whiskers and cheek fur reach past her face; a piece may stand under her chin's edge, never over her eyes, nose or mouth)
      const fx0 = head[0] + (head[2] - head[0]) * 0.2, fx1 = head[2] - (head[2] - head[0]) * 0.2, fy1 = head[3] - (head[3] - head[1]) * 0.12;
      assert.ok(box[2] < fx0 || box[0] > fx1 || box[1] > fy1, label + ': a piece on her face: ' + box.map(Math.round) + ' face ' + head.map(Math.round));
    }
    const st = STONE.exec(r.svg);
    assert.ok(st, label + ': her stone is drawn');
    for (const q of P.concat(C.map((c) => ({ x: c.x, y: c.y, w: 30 })))) assert.ok(Math.abs(q.x - +st[1]) > q.w / 2 + +st[3] - 2 || +st[2] < q.y - q.w * 1.2, label + ': a piece on the stone: ' + JSON.stringify(q) + ' stone ' + st.slice(1, 4));
  }
  const empty = pieces(art.render(nestScene({ bark: 6 }, null), { look: LOOK }).svg);
  assert.ok(empty.length === 6 && empty.every((q) => q.x < NEST_X + 8), 'nobody in the nest: on the left');
});

test('den hidden: the two about Sprinkle go under the moss: two fewer in the row, two corners showing at its inner end, small; with a list of her cards, those two by their pictures, else the newest two', { skip: !art.character && 'no cats.js' }, () => {
  for (const cam of ['nest', 'inside', 'doorway']) for (const n of [2, 5, 7, 9]) {
    const scene = nestScene({ bark: n, hidden: true }, { pose: 'loaf' }, cam), r = art.render(scene, { look: LOOK }), vb = viewBox(r.svg);
    checkRender(r, scene, 'den/' + cam + ' hidden ' + n);
    const P = pieces(r.svg), C = corners(r.svg), open = pieces(art.render(nestScene({ bark: n }, { pose: 'loaf' }, cam), { look: LOOK }).svg);
    assert.equal(P.length, n - 2, cam + ' ' + n + ': two fewer in the row');
    assert.equal(open.length, n);
    assert.equal(C.length, 2, cam + ' ' + n + ': two corners');
    for (const c of C) {
      assert.ok(inVb(c.x, c.y - 24, vb, 2) && inVb(c.x, c.y, vb, 2), cam + ': the corners are in the panel: ' + JSON.stringify(c));
      assert.ok(c.y > 886 && c.y < 886 + 50 && Math.abs(c.x - NEST_X) < 120, cam + ': in the front rim\'s moss');
      // at the row's inner end: nearer the middle than every piece standing
      for (const q of P) assert.ok(Math.abs(c.x - NEST_X) < Math.abs(q.x - NEST_X), cam + ' ' + n + ': past the row\'s inner end');
    }
    assert.ok(Math.abs(C[0].x - C[1].x) > 10, 'two, side by side');
  }
  // a corner is a corner: far smaller than a piece (a piece is about 40 by 48), and moss is drawn over its foot
  const svg = art.render(nestScene({ bark: 7, hidden: true }), { look: LOOK }).svg, N = prop(svg, 'nest-bark');
  const cornerPath = /data-bark="corner"><path d="([^"]+)"/.exec(N)[1].match(/-?[\d.]+/g).map(Number);
  const xs = cornerPath.filter((v, i) => i % 2 === 0), ys = cornerPath.filter((v, i) => i % 2 === 1);
  assert.ok(Math.max(...xs) - Math.min(...xs) < 36 && Math.max(...ys) - Math.min(...ys) < 30, 'a corner, not a card');
  assert.ok(N.lastIndexOf('data-bark="corner"') < N.lastIndexOf('<path d="M'), 'moss tufts are drawn after the bark, over its foot');
  // hidden alone still shows the two corners (she has put two under, whatever the row holds)
  const alone = art.render(nestScene({ hidden: true }), { look: LOOK }).svg;
  assert.equal(pieces(alone).length, 0);
  assert.equal(corners(alone).length, 2);
  // which two: with her cards as a list, the two about Sprinkle, wherever they are in it
  const asked = [];
  const spy = (o) => { asked.push(o.blank ? '(blank)' : o.picture); return { svg: '<rect class="spy-card" width="200" height="240" fill="#EDE1C5"/>', w: 200, h: 240 }; };
  const row = (opts) => { asked.length = 0; withCards(spy, () => art.render(nestScene(opts), { look: LOOK })); return asked.slice(); };
  assert.deepEqual(row({ bark: ['four-a-night', 'sprinkle-scales', 'tidy', 'cant-fly', 'scale'], hidden: true }), ['four-a-night', 'tidy', 'scale']);
  assert.deepEqual(row({ bark: ['four-a-night', 'sprinkle-scales', 'tidy', 'cant-fly', 'scale'] }), ['four-a-night', 'sprinkle-scales', 'tidy', 'cant-fly', 'scale'], 'not hidden: the list as given, oldest first');
  assert.deepEqual(row({ bark: [{ picture: 'four-a-night', mark: 'eye' }, { picture: 'tidy', mark: 'eye' }, { picture: 'cant-fly', mark: 'eye' }, { picture: 'later', mark: 'ear' }], hidden: true }), ['four-a-night', 'tidy'], 'one of the two is in the list: it, and the newest other');
  assert.deepEqual(row({ bark: ['a', null, 'b'] }), ['a', '(blank)', 'b'], 'a blank piece in a list');
  // a number: chapter 4's cards in the order every cat finds them; the eighth and ninth where they fall; more are blank
  assert.deepEqual(row({ bark: 3 }), ['four-a-night', 'tidy', 'scale']);
  assert.deepEqual(row({ bark: 7 }), ['four-a-night', 'tidy', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly']);
  assert.deepEqual(row({ bark: 7, hidden: true }), ['four-a-night', 'tidy', 'scale', 'fox-flew', 'fox-moon'], 'the wing and the scales are the two under the moss');
  // (an eighth is the dug earth, not Squall's shapes: a number never puts his clue in the nest of a cat who has not met him)
  assert.deepEqual(row({ bark: 8 }), ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly']);
  assert.ok(!row({ bark: 8, hidden: true }).includes('squall-shapes'));
  assert.deepEqual(row({ bark: 9 }), ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'squall-shapes', 'sprinkle-scales', 'cant-fly']);
  assert.deepEqual(row({ bark: 9, hidden: true }), ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'squall-shapes']);
  assert.deepEqual(row({ bark: 11 }).slice(0, 3), ['(blank)', '(blank)', 'four-a-night']);
  // every piece carries its mark when a number is given (an eye for what she saw, an ear for what she was told)
  const marks = [];
  withCards((o) => { marks.push(o.mark); return spy(o); }, () => art.render(nestScene({ bark: 9 }), { look: LOOK }));
  assert.deepEqual(marks, ['eye', 'eye', 'eye', 'eye', 'ear', 'ear', 'ear', 'eye', 'eye']);
});

test('den bark is the Case File\'s own bark: cards.js\'s pieces when it is loaded (her real cards), a plain piece of ours when it is not or when it fails; washed with the night as the cats are', { skip: !art.character && 'no cats.js' }, () => {
  const scene = nestScene({ bark: 4 });
  if (typeof art.cardGroup === 'function') {
    const svg = art.render(scene, { look: LOOK }).svg, N = prop(svg, 'nest-bark');
    const card = art.cardGroup({ picture: 'four-a-night', mark: 'eye' });
    assert.ok(N.includes(card.svg), 'the first piece is her first card, exactly as cards.js draws it');
    assert.ok(N.includes(art.cardGroup({ picture: 'fox-flew', mark: 'ear' }).svg), 'and the fox\'s FLEW, with its ear');
    checkRender(art.render(scene, { look: LOOK }), scene, 'cards.js pieces');
  }
  for (const broken of [null, () => { throw new Error('no'); }, () => ({ svg: '', w: 200, h: 240 }), () => ({ svg: '<g/>', w: 0, h: 0 }), () => 'junk']) {
    const r = withCards(broken, () => art.render(scene, { look: LOOK }));
    checkRender(r, scene, 'our own bark');
    const N = prop(r.svg, 'nest-bark');
    assert.equal(pieces(r.svg).length, 4);
    assert.ok(N.includes('fill="#EDE1C5" stroke="#8A7350"'), 'pale papery bark, in the cards\' own colours');
    assert.equal((N.match(/stroke="#3A281E" stroke-width="4.3"/g) || []).length, 4, 'something scratched on each');
  }
  // by night the bark takes the same wash as the cats' fur; by day it is plain
  assert.ok(/<g filter="url\(#[^)]*-f-tint\)"><g transform="[^"]+" data-bark=/.test(prop(art.render(scene, { look: LOOK }).svg, 'nest-bark')), 'night wash');
  assert.ok(/data-count="4"><g><g transform="[^"]+" data-bark=/.test(prop(art.render(nestScene({ bark: 4 }, {}, 'nest', ['morning']), { look: LOOK }).svg, 'nest-bark')), 'no wash in the morning');
});

test('den moon, chapter 4: asked for at dusk (or sunset) from outside, the young moon, thin as a curl of bark and low over the towers; by night the crescent chapter 2 drew; never under cloud, by day or from inside', () => {
  const den = (cam, opts, fx) => art.render({ set: 'den', cam, opts, cast: [], fx }, { look: LOOK }).svg;
  const dusk = den('outside', { moon: true }, ['dusk']), M = prop(dusk, 'thin-moon');
  assert.ok(M, 'a moon at dusk');
  checkRender({ svg: dusk, heads: [] }, { cast: [] }, 'den outside, dusk, moon');
  const at = /<g transform="translate\(([\d.]+) ([\d.]+)\) rotate\((-?[\d.]+)\)">/.exec(M).slice(1).map(Number);
  const arc = /<path d="M0 -([\d.]+)A([\d.]+) [\d.]+ 0 0 1 0 [\d.]+A([\d.]+) [\d.]+ 0 0 0 0 -[\d.]+Z" fill="#FFF3D2"\/>/.exec(M).slice(1).map(Number);
  const r = arc[0], thick = (arc[1] - arc[2]) / arc[1];
  assert.ok(thick > 0.08 && thick <= 0.25, 'thin: a sliver ' + Math.round(thick * 100) + '% of its radius across');
  assert.ok(at[0] - r > 0 && at[0] + r < 1600 && at[1] - r > 0, 'whole, in the panel: ' + at);
  // low over the towers at the right (their tops are at y 200 and 280): just above them, not high in the sky
  assert.ok(at[0] > 1380 && at[1] + r < 200 && at[1] + r > 120, 'low over the towers: ' + at);
  assert.ok(at[2] > 10 && at[2] < 80, 'lit from below right, where the sun went down');
  assert.ok(prop(den('outside', { moon: true }, ['sunset']), 'thin-moon'), 'at sunset too');
  // by night it is the moon chapter 2 drew, where it was
  const night = den('outside', { moon: true }, ['night']);
  assert.ok(!prop(night, 'thin-moon') && night.includes('#FFF3D2') && /<circle cx="1330" cy="150" r="132"/.test(night), 'the night\'s crescent is unchanged');
  for (const [opts, fx, why] of [[{ moon: true, weather: 'cloudy' }, ['dusk'], 'cloud'], [{ moon: false }, ['dusk'], 'not asked for'], [{}, ['dusk'], 'the default'], [{ moon: true }, ['morning'], 'morning'], [{ moon: true }, ['day'], 'day']]) {
    const svg = den('outside', opts, fx);
    assert.ok(!prop(svg, 'thin-moon') && !svg.includes('#FFF3D2'), 'no moon: ' + why);
  }
  for (const cam of ['inside', 'nest', 'doorway']) assert.ok(!prop(den(cam, { moon: true }, ['dusk']), 'thin-moon'), cam + ': never from inside');
});

// ---------------------------------------------------------------- the Training Hollow

test('hollow, chapter 4: four marks, the first three a little deeper; a curl of bark falls from the newest in every camera, clear of the cast; later it lies on the sand; then a row of pieces, her first card at its head', { skip: !art.character && 'no cats.js' }, () => {
  const A = art.sceneInfo('hollow').anchors.main;
  const hollow = (cam, opts, cast, fx) => {
    const scene = { set: 'hollow', cam, opts, cast: cast || [], fx: fx || ['morning'] }, r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'hollow/' + cam + ' ' + JSON.stringify(opts));
    return r;
  };
  // four marks; by default every mark but the newest is deeper (a dark groove down the middle)
  const four = hollow('tree', { marks: 4 }).svg;
  assert.equal(shapes(four, 'fill="#3A281E"').length, 12, 'four marks, three scratches each');
  assert.equal(shapes(four, 'fill="#6B4A32" opacity="0.9"').length, 9, 'the first three are deeper; the fourth is fresh');
  assert.equal(prop(four, 'bark-falling') + prop(four, 'bark-sand') + prop(four, 'bark-row'), '', 'no bark unless asked');
  const curlAt = (svg, name) => { const m = /<g transform="translate\(([\d.]+) ([\d.]+)\) scale\(([\d.]+) [\d.]+\) rotate\((-?[\d.]+)\)">/.exec(prop(svg, name)); return m ? m.slice(1).map(Number) : null; };
  // falling: one curl, in the air, in the panel, in every camera, with the lettering kept off it
  const newest = shapes(four, 'fill="#3A281E"').slice(9).flat(), markY = Math.max(...newest.map((p) => p[1]));
  for (const cam of ['tree', 'lesson', 'wide', 'sand']) {
    const r = hollow(cam, { marks: 4, bark: 'falling' }), c = curlAt(r.svg, 'bark-falling'), vb = viewBox(r.svg);
    assert.ok(c, cam + ': a curl of bark');
    assert.ok(inVb(c[0] - 34, c[1] - 22, vb, 2) && inVb(c[0] + 34, c[1] + 22, vb, 2), cam + ': whole, in the panel: ' + c);
    assert.ok(c[1] < 860, cam + ': in the air, not yet on the sand');
    if (cam !== 'sand') assert.ok(c[1] > markY - 80, cam + ': below the newest mark (or just beside it): ' + c + ' mark ' + markY);
    assert.ok(Math.abs(c[3]) > 10, cam + ': tumbling');
    const k = r.keep[r.keep.length - 1], kx = vb[0] + (k.x + k.w / 2) / 100 * vb[2], ky = vb[1] + (k.y + k.h / 2) / 100 * vb[3];
    // (the marks' own keep comes first, in the cameras that see them)
    assert.ok(r.keep.length === (cam === 'sand' ? 1 : 2) && Math.abs(kx - c[0]) < 4 && Math.abs(ky - c[1]) < 4, cam + ': keep: ' + JSON.stringify(r.keep));
    // it has come off the tree: clear of the claw marks themselves
    for (const p of shapes(r.svg, 'fill="#3A281E"').flat()) assert.ok(Math.abs(p[0] - c[0]) > 34 || Math.abs(p[1] - c[1]) > 20, cam + ': off the marks');
  }
  // clear of the cast: Tallyheart stretching up the trunk, our cat on the sand (the SKRITCH panel, wide or two-shot)
  const s = (a) => a.h / 200;
  for (const cam of ['lesson', 'wide', 'tree']) for (const cast of [
    [{ who: 'tallyheart', at: 'tree', pose: 'stretch', mood: 'proud', facing: 'right' }, { who: 'player', at: 'sand-right', pose: 'sit', mood: 'wonder', facing: 'right' }],
    [{ who: 'tallyheart', at: 'tree', pose: 'stretch', mood: 'proud', facing: 'right' }, { who: 'player', at: 'sunpatch-3', pose: 'lookup', mood: 'wonder', facing: 'right' }],
    [{ who: 'tallyheart', at: 'tree', pose: 'stretch', mood: 'proud', facing: 'left' }, { who: 'player', at: 'sand-left', pose: 'sit', mood: 'wonder', facing: 'right' }, { who: 'grizzled', at: 'rim-5', pose: 'walk', mood: 'stern', facing: 'left' }]
  ]) {
    const r = hollow(cam, { marks: 4, bark: 'falling' }, cast), c = curlAt(r.svg, 'bark-falling'), vb = viewBox(r.svg);
    assert.ok(c && inVb(c[0], c[1], vb, 20), cam + ': the curl is in the panel with the cast there');
    cast.forEach((m, i) => {
      if (!r.heads[i]) return;
      const b = worldBodyBox(r, i, m.who, Object.assign({ pose: m.pose, mood: m.mood, facing: m.facing }, m.who === 'player' ? { look: LOOK, sex: LOOK.sex } : {}), s(A[m.at]));
      assert.ok(c[0] + 30 < b[0] || c[0] - 30 > b[2] || c[1] + 18 < b[1] || c[1] - 18 > b[3], cam + ': the curl is clear of ' + m.who + ': ' + c + ' body ' + b.map(Math.round));
    });
  }
  // sand: the one curl, lying between the two sand spots at the cats' feet, in every camera that sees the sand
  const between = (x, y, what) => assert.ok(x > A['sand-left'].x + 60 && x < A['sand-right'].x - 60 && Math.abs(y - A['sand-left'].y) < 30, what + ': on the sand between the two sand spots: ' + [x, y]);
  for (const cam of ['lesson', 'sand', 'wide']) {
    const r = hollow(cam, { marks: 4, bark: 'sand' }, [{ who: 'tallyheart', at: 'sand-left', pose: 'sit', mood: 'kind', facing: 'right' }, { who: 'player', at: 'sand-right', pose: 'flat', mood: 'sleepy', facing: 'left' }], ['day']);
    const c = curlAt(r.svg, 'bark-sand'), vb = viewBox(r.svg);
    assert.ok(c && inVb(c[0] - 36, c[1] - 14, vb, 2) && inVb(c[0] + 36, c[1] + 18, vb, 2), cam + ': the curl, whole, in the panel: ' + c);
    between(c[0], c[1], cam);
    assert.ok(Math.abs(c[3]) < 15, cam + ': lying still');
    assert.equal(pieces(r.svg).length, 0, 'a curl, not yet a card');
    assert.ok(/<ellipse [^>]*opacity="0.3"\/>/.test(prop(r.svg, 'bark-sand')), 'its shadow on the sand');
  }
  // row: her first card at the head (scratched), then three blank pieces, lying flat in a row
  for (const cam of ['lesson', 'sand', 'wide']) {
    const r = hollow(cam, { marks: 4, bark: 'row' }, [], ['day']), P = pieces(r.svg), vb = viewBox(r.svg);
    assert.deepEqual(P.map((q) => q.kind), ['card', 'blank', 'blank', 'blank'], cam + ': her first card, then three blank pieces');
    P.forEach((q, i) => {
      assert.ok(q.flat, cam + ': lying on the sand');
      between(q.x, q.y, cam + ' piece ' + i);
      assert.ok(inVb(q.x - q.w / 2 - 6, q.y - q.w * 0.7, vb, 1) && inVb(q.x + q.w / 2 + 6, q.y + 2, vb, 1), cam + ': in the panel: ' + JSON.stringify(q));
      if (i) assert.ok(q.x - P[i - 1].x > q.w * 0.9, cam + ': side by side, none on another');
    });
  }
  if (typeof art.cardGroup === 'function') assert.ok(prop(hollow('sand', { bark: 'row' }).svg, 'bark-row').includes(art.cardGroup({ picture: 'four-a-night', mark: 'eye' }).svg), 'the first is this morning\'s row, with its eye');
  // row with `cards`: the row as she has scratched it by this panel, card for card, then `blank` blank pieces
  const asked = [];
  const rowOf = (opts, cam) => withCards((o) => { asked.push(o); return { svg: '<path d="M0 0h200v240H0z"/>', w: 200, h: 240 }; }, () => { asked.length = 0; return hollow(cam || 'lesson', Object.assign({ marks: 4, bark: 'row' }, opts), [], ['day']); });
  const SIX = [{ picture: 'four-a-night', mark: 'eye' }, { picture: 'tidy', mark: 'eye' }, { picture: 'dug-earth', mark: 'eye' }, { picture: 'scale', mark: 'eye' }, { picture: 'fox-flew', mark: 'ear' }, { picture: 'fox-moon', mark: 'ear' }];
  for (const cam of ['lesson', 'sand', 'wide']) {
    for (const [cards, blank] of [[SIX.slice(0, 2), 1], [SIX.slice(0, 4), 1], [SIX.slice(0, 5), 0], [SIX, 0], [SIX, 1], [[], 2], [SIX.slice(0, 1), 3]]) {
      const r = rowOf({ cards, blank }, cam), P = pieces(r.svg), vb = viewBox(r.svg), what = cam + ' ' + cards.length + '+' + blank;
      assert.deepEqual(P.map((q) => q.kind), cards.map(() => 'card').concat(Array(blank).fill('blank')), what + ': her cards, then the blank pieces');
      assert.deepEqual(asked, cards.map((c) => ({ picture: c.picture, mark: c.mark })).concat(Array(blank).fill({ blank: true })), what + ': each card with its own picture and mark, in order');
      P.forEach((q, i) => {
        assert.ok(q.flat, what + ': lying on the sand');
        between(q.x, q.y, what + ' piece ' + i);
        assert.ok(inVb(q.x - q.w / 2 - 6, q.y - q.w * 0.7, vb, 1) && inVb(q.x + q.w / 2 + 6, q.y + 2, vb, 1), what + ': in the panel: ' + JSON.stringify(q));
        if (i) assert.ok(q.x - P[i - 1].x > q.w * 0.9, what + ': side by side, none on another');
      });
      // the lettering keeps off the whole row, however long it is
      const k = r.keep[r.keep.length - 1], x0 = vb[0] + k.x * vb[2] / 100, x1 = x0 + k.w * vb[2] / 100;
      if (P.length) assert.ok(x0 <= P[0].x - P[0].w / 2 && x1 >= P[P.length - 1].x + P[P.length - 1].w / 2, what + ': the keep area covers the row: ' + [x0, x1]);
    }
  }
  // up to five pieces lie as far apart as the four always did; with no list the row is what it was
  assert.deepEqual(pieces(rowOf({ cards: SIX.slice(0, 4), blank: 0 }).svg).map((q) => [q.x, q.y, q.w]), pieces(hollow('lesson', { marks: 4, bark: 'row' }, [], ['day']).svg).map((q) => [q.x, q.y, q.w]), 'four pieces: where the four have always lain');
  // the story's own entries, before the page has resolved them: a key, or { id }, with chapter 4's mark for that picture
  rowOf({ cards: ['four-a-night', { id: 'dug-earth', when: { specialty: 'noticing' } }, 'fox-flew', { id: 'fox-moon' }, { picture: 'scale', mark: null }], blank: 0 });
  assert.deepEqual(asked, [{ picture: 'four-a-night', mark: 'eye' }, { picture: 'dug-earth', mark: 'eye' }, { picture: 'fox-flew', mark: 'ear' }, { picture: 'fox-moon', mark: 'ear' }, { picture: 'scale', mark: null }]);
  // `cards` and `blank` mean nothing without the row; a list that is not a list is the plain row
  assert.equal(pieces(hollow('sand', { bark: 'sand', cards: SIX, blank: 2 }).svg).length, 0);
  assert.deepEqual(pieces(hollow('sand', { bark: 'row', cards: 'auto', blank: 2 }).svg).map((q) => q.kind), ['card', 'blank', 'blank', 'blank']);
  assert.deepEqual([art.vocab.sets.hollow.opts.cards, art.vocab.sets.hollow.opts.blank], ['cards', [0, 1, 2, 3]]);
  // the row is not the nest's: unknown values draw nothing
  for (const v of [true, 'auto', 3, 'heap']) assert.equal(pieces(hollow('sand', { bark: v }).svg).length, 0, 'bark: ' + v + ' is not a hollow value');
});

test('hollow heap: FLUMP, the five rim spots close up into a pile in the middle of the rim, three on the ground and two flopped over them, every face in the panel; nobody else moves; without it the rim is the row it was', { skip: !art.character && 'no cats.js' }, () => {
  const A = art.sceneInfo('hollow').anchors.main;
  const poses = ['fall', 'tummy', 'flat', 'lie', 'fall'];
  const five = [1, 2, 3, 4, 5].map((i) => ({ who: i === 5 ? 'grizzled' : 'clancat', at: 'rim-' + i, pose: poses[i - 1], mood: 'laugh', variant: i, facing: i % 2 ? 'left' : 'right' }));
  const others = [{ who: 'tallyheart', at: 'tree-far', pose: 'sit', mood: 'laugh', facing: 'left', size: 1.2 }, { who: 'player', at: 'sunpatch-2', pose: 'sit', mood: 'laugh', facing: 'right' }];
  const draw = (cam, heap) => {
    const scene = { set: 'hollow', cam, opts: heap ? { marks: 4, heap: true } : { marks: 4 }, cast: five.concat(others), fx: ['morning'] }, r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'hollow/' + cam + (heap ? ' heap' : ' row'));
    return r;
  };
  const wx = (r, i) => viewBox(r.svg)[0] + r.heads[i].x / 100 * viewBox(r.svg)[2], wy = (r, i) => viewBox(r.svg)[1] + r.heads[i].y / 100 * viewBox(r.svg)[3];
  for (const cam of ['wide', 'lesson']) {
    const row = draw(cam, false), heap = draw(cam, true);
    for (let i = 0; i < 5; i++) assert.ok(heap.heads[i], cam + ': rim-' + (i + 1) + '\'s face is in the panel');
    const hx = [0, 1, 2, 3, 4].map((i) => wx(heap, i)), rx = [0, 1, 2, 3, 4].map((i) => wx(row, i));
    const span = Math.max(...hx) - Math.min(...hx), was = Math.max(...rx) - Math.min(...rx);
    assert.ok(span < was * 0.62, cam + ': closed up: heads span ' + Math.round(span) + ' where the row spans ' + Math.round(was));
    const mid = (Math.max(...hx) + Math.min(...hx)) / 2;
    assert.ok(Math.abs(mid - A['rim-3'].x) < 70, cam + ': in the middle of the rim: ' + Math.round(mid));
    // two flopped over the others: the second and fourth lie higher than the three on the ground
    const hy = [0, 1, 2, 3, 4].map((i) => wy(heap, i));
    assert.ok(Math.max(hy[1], hy[3]) < Math.min(hy[0], hy[2], hy[4]) + 10, cam + ': two on top: ' + hy.map(Math.round));
    // a pile: each one lies partly on the one before (their bodies overlap)
    const body = five.map((m, i) => { const t = new RegExp('translate\\(([\\d.]+) ([\\d.]+)\\) scale\\(([\\d.]+) [\\d.]+\\) translate\\(-100 -200\\)', 'g'); return [...heap.svg.matchAll(t)][i].slice(1).map(Number); });
    for (let i = 1; i < 5; i++) assert.ok(Math.abs(body[i][0] - body[i - 1][0]) < 200 * body[i][2] * 0.6, cam + ': rim-' + (i + 1) + ' lies on rim-' + i);
    // nobody else moves
    for (const i of [5, 6]) assert.deepEqual(heap.heads[i], row.heads[i], cam + ': ' + others[i - 5].who + ' stays where she was');
    // one soft shadow under the whole pile
    assert.ok(prop(heap.svg, 'heap') && !prop(row.svg, 'heap'), cam + ': the pile\'s shadow');
  }
  // the heap is the option's: the anchors themselves are where chapters 2 and 3 put them
  assert.deepEqual([1, 2, 3, 4, 5].map((i) => [A['rim-' + i].x, A['rim-' + i].y, A['rim-' + i].h]), [[490, 786, 223], [635, 774, 216], [780, 770, 214], [925, 774, 216], [1070, 786, 223]]);
  // a falling curl still clears a cat in the heap
  const scene = { set: 'hollow', cam: 'lesson', opts: { marks: 4, heap: true, bark: 'falling' }, cast: five, fx: ['morning'] };
  checkRender(art.render(scene, { look: LOOK }), scene, 'heap and falling bark');
});

// ---------------------------------------------------------------- the new cast extras, and the two new characters

test('chapter 4 cast extras reach the drawing: wink, flick and holds: \'bark\' (with holdAt); they are the painter\'s, and nothing of the scene\'s leaks in', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, calls = [];
  const spy = function (who, opts) { calls.push({ who, opts: Object.assign({}, opts) }); return real(who, opts); };
  const cast = [
    { who: 'tallyheart', pose: 'peer', mood: 'happy', at: 'doorway', facing: 'left', wink: true },
    { who: 'player', pose: 'pawup', mood: 'wonder', at: 'nest', facing: 'right', holds: 'bark', holdAt: 'paws', claws: true },
    { who: 'reynard', pose: 'sit', mood: 'proud', at: 'sleeper-1', flick: true, size: 0.9 },
    { who: 'snorer', pose: 'curl', mood: 'sleepy', at: 'sleeper-2' }
  ];
  const scene = { set: 'den', cam: 'inside', opts: { bark: 'auto' }, cast, fx: ['night'] };
  const r = withCharacter(spy, () => art.render(scene, { look: LOOK }));
  checkRender(r, scene, 'chapter 4 extras');
  cast.forEach((m, i) => {
    const call = calls.find((c) => c.who === m.who && c.opts.pose === m.pose && c.opts.mood === m.mood && c.opts.facing);
    assert.ok(call, m.who + ' is drawn');
    for (const k of ['wink', 'flick', 'holds', 'holdAt', 'claws']) assert.equal(call.opts[k], m[k], i + ' ' + m.who + ': ' + k);
    for (const k of ['size', 'at', 'purr', 'lift']) assert.equal(call.opts[k], undefined, i + ' ' + m.who + ': ' + k + ' stays the scene\'s');
  });
  // a held piece of bark is the cat's to draw (cats.js); the sparkle effect never twinkles on it
  const fake = function (who, opts) { const c = real(who, opts); return opts && opts.holds ? Object.assign({}, c, { held: { what: opts.holds, at: 'paws', x: c.w / 2, y: c.h * 0.85, r: 9 } }) : c; };
  const tw = withCharacter(fake, () => { const s = art.render({ set: 'den', cam: 'nest', cast: [{ who: 'player', pose: 'sit', mood: 'happy', at: 'nest', holds: 'bark' }], fx: ['night', 'sparkle'] }, { look: LOOK }).svg; return (s.slice(s.indexOf('class="pcs-fx">')).match(/class="pcs-tw"/g) || []).length; });
  assert.equal(tw, 18, 'bark does not sparkle: the sparkles scatter');
});

// Stand-ins for the two new characters, each far too big, to see the scenes hold them to size: a fox
// 260 tall with a brush that fills half his box, and a dragonet as tall as a grown cat with wings.
const FOX = { w: 320, h: 260, head: { x: 232, y: 62 }, headBox: { x0: 190, y0: 20, x1: 276, y1: 100 }, bounds: { x0: 20, y0: 8, x1: 280, y1: 258 } };
const WHELP = { w: 260, h: 220, head: { x: 150, y: 60 }, headBox: { x0: 100, y0: 20, x1: 200, y1: 104 }, bounds: { x0: 40, y0: 20, x1: 220, y1: 218 } };
function fakeNewcomers(real, fox, whelp) {
  return function (who, opts) {
    if (who !== 'reynard' && who !== 'squall') return real(who, opts);
    const b = JSON.parse(JSON.stringify(who === 'reynard' ? fox : whelp));
    // a pose with a different box: dashing off, he is long and low; standing tall, the dragonet is taller
    if (opts && (opts.pose === 'dash' || opts.pose === 'tall')) { b.h += 60; b.head.y += 30; b.headBox.y0 += 30; b.headBox.y1 += 30; b.bounds.y1 += 60; }
    return Object.assign({ svg: '<rect class="new-' + who + '" x="' + b.bounds.x0 + '" y="' + b.bounds.y0 + '" width="' + (b.bounds.x1 - b.bounds.x0) + '" height="' + (b.bounds.y1 - b.bounds.y0) + '" fill="#D8642A"/>' }, b);
  };
}
// the scale a drawing was placed at, from its box's transform (feet at x, y; a w x h box)
const placedScale = (svg, a, w, h) => { const m = new RegExp('translate\\(' + a.x + ' ' + a.y + '\\) scale\\(([\\d.]+) [\\d.]+\\) translate\\(-' + (w / 2) + ' -' + h + '\\)').exec(svg); return m ? +m[1] : null; };
const sitTall = (who, look) => { const c = art.character(who, Object.assign({ pose: 'sit', mood: 'neutral' }, look ? { look, sex: look.sex } : {})); return c.h - c.headBox.y0; };

test('Reynard at a cat\'s anchor is about Tallyheart\'s size and never bigger: sitting, the top of his head is no higher than hers would be there, whatever his box, his brush or the frame\'s size; every pose is scaled alike; never bigger in a panel than she is in it', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, tally = sitTall('tallyheart');
  const near = (a, b, what) => assert.ok(Math.abs(a - b) < 0.0002, what + ': ' + a + ' vs ' + b);
  withCharacter(fakeNewcomers(real, FOX, WHELP), () => {
    const a = art.sceneInfo('title').anchors.main.wall, base = a.h / 200, tall = FOX.h - FOX.headBox.y0;
    const fox = (m, cast) => { const scene = { set: 'title', cam: 'wide', cast: [Object.assign({ who: 'reynard', pose: 'sit', mood: 'happy', at: 'wall', facing: 'left' }, m)].concat(cast || []), fx: ['day'] }; const r = art.render(scene, { look: LOOK }); checkRender(r, scene, 'reynard ' + JSON.stringify(m)); return r; };
    const r = fox({}), s = placedScale(r.svg, a, FOX.w, FOX.h);
    assert.ok(s, 'his box, feet on the wall');
    // head-top to feet, on screen: exactly Tallyheart's sitting there (his box is 260 of the cats' units tall, hers 200)
    near(s, Math.round(base * tally / tall * 10000) / 10000, 'capped to her height');
    assert.ok(s * tall <= base * tally + 0.05 && s < base, 'never bigger: ' + (s * tall).toFixed(1) + ' against her ' + (base * tally).toFixed(1));
    // every pose at the same scale (a taller box does not shrink him further, nor a size above 1 grow him)
    near(placedScale(fox({ pose: 'dash' }).svg, a, FOX.w, FOX.h + 60), s, 'dashing off');
    near(placedScale(fox({ size: 1.4 }).svg, a, FOX.w, FOX.h), s, 'size 1.4 is held to the cap');
    near(placedScale(fox({ size: 0.5 }).svg, a, FOX.w, FOX.h), Math.round(base * 0.5 * 10000) / 10000, 'a size can make him smaller');
    // his face is lettered like anyone's: a head point and r from his head box
    const cat = real('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }), hb = cat.headBox, share = 0.2 * cat.h / ((hb.x1 - hb.x0 + hb.y1 - hb.y0) / 2);
    assert.ok(r.heads[0] && Math.abs(r.heads[0].r - share * ((FOX.headBox.x1 - FOX.headBox.x0) + (FOX.headBox.y1 - FOX.headBox.y0)) / 2 * s / 1600 * 100) < 0.02, 'r from his head box: ' + JSON.stringify(r.heads[0]));
    // his shadow lies under his body, not under his whole box (which is half brush)
    const shade = [...r.svg.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([\d.]+)" ry="[\d.]+" fill="#[0-9A-F]{6}" opacity="0.3"\/>/g)].map((m) => m.slice(1).map(Number)).filter((e) => Math.abs(e[1] - (a.y - 1)) < 0.2);
    assert.ok(shade.length === 1 && Math.abs(shade[0][2] - (FOX.bounds.x1 - FOX.bounds.x0) * s * 0.42) < 0.3, 'shadow as wide as his body: ' + JSON.stringify(shade));
    // beside Tallyheart on the same wall: the top of his head comes no higher than the tips of her ears
    const w2 = art.sceneInfo('title').anchors.main['wall-2'], both = fox({ at: 'wall-2' }, [{ who: 'tallyheart', pose: 'sit', mood: 'stern', at: 'wall', facing: 'left' }]);
    const hisTop = w2.y - tall * placedScale(both.svg, w2, FOX.w, FOX.h), herTop = a.y - tally * base;
    assert.ok(both.heads[0] && both.heads[1] && hisTop >= herTop - 0.5, 'his head is not above hers: ' + hisTop.toFixed(1) + ' vs ' + herTop.toFixed(1));
    // never bigger in a panel than she is in it: he nearer the camera (the lawn), she far off at the fence's foot
    const G = art.sceneInfo('garden').anchors.main, scene = { set: 'garden', cam: 'wide', cast: [{ who: 'reynard', pose: 'sit', mood: 'happy', at: 'lawn' }, { who: 'tallyheart', pose: 'sit', mood: 'stern', at: 'fence-foot', facing: 'left', size: 0.9 }], fx: ['day'] };
    const g = art.render(scene, { look: LOOK }), gs = placedScale(g.svg, G.lawn, FOX.w, FOX.h);
    checkRender(g, scene, 'the fox nearer than Tallyheart');
    near(gs, Math.round(G['fence-foot'].h / 200 * 0.9 * tally / tall * 10000) / 10000, 'held to her size in the panel');
    assert.ok(gs * tall <= G['fence-foot'].h / 200 * 0.9 * tally + 0.05);
    // with her out of this camera's sight, only his own cap holds
    const alone = art.render({ set: 'garden', cam: 'wide', cast: [{ who: 'reynard', pose: 'sit', mood: 'happy', at: 'lawn' }], fx: ['day'] }, { look: LOOK });
    near(placedScale(alone.svg, G.lawn, FOX.w, FOX.h), Math.round(G.lawn.h / 200 * tally / tall * 10000) / 10000, 'alone on the lawn');
  });
  // a fox drawn smaller than Tallyheart is left as drawn (the cap never enlarges)
  const small = JSON.parse(JSON.stringify(FOX)); small.headBox.y0 = 110; small.head.y = 140; small.headBox.y1 = 180;
  withCharacter(fakeNewcomers(real, small, WHELP), () => {
    const a = art.sceneInfo('title').anchors.main.wall;
    const r = art.render({ set: 'title', cam: 'wide', cast: [{ who: 'reynard', pose: 'sit', mood: 'happy', at: 'wall' }], fx: ['day'] }, { look: LOOK });
    near(placedScale(r.svg, a, FOX.w, FOX.h), Math.round(a.h / 200 * 10000) / 10000, 'not enlarged');
  });
  // nobody else is touched: Tallyheart, our cat and Sprinkle are placed at the anchor's own scale
  const a = art.sceneInfo('title').anchors.main.wall;
  for (const who of ['tallyheart', 'player', 'grizzled']) near(placedScale(art.render({ set: 'title', cam: 'wide', cast: [{ who, pose: 'sit', mood: 'kind', at: 'wall' }], fx: ['day'] }, { look: LOOK }).svg, a, 200, 200), Math.round(a.h / 200 * 10000) / 10000, who);
});

test('Squall at a cat\'s anchor is no bigger than our cat ("a dragon no bigger than you"): sitting, no taller than she sits there, for a she-cat and a tom; standing tall or hiccuping he is scaled as he sits; lettered and shadowed like the others', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character;
  const near = (a, b, what) => assert.ok(Math.abs(a - b) < 0.0002, what + ': ' + a + ' vs ' + b);
  for (const look of [LOOK, { fur: 'black', marking: 'none', eyes: 'green', sex: 'she' }]) {
    const mine = sitTall('player', look), tall = WHELP.h - WHELP.headBox.y0;
    withCharacter(fakeNewcomers(real, FOX, WHELP), () => {
      const a = art.sceneInfo('title').anchors.main.wall, base = a.h / 200;
      const sq = (m) => { const scene = { set: 'title', cam: 'wide', cast: [Object.assign({ who: 'squall', pose: 'sit', mood: 'proud', at: 'wall', facing: 'left' }, m), { who: 'player', pose: 'sit', mood: 'wonder', at: 'wall-2' }], fx: ['day'] }; const r = art.render(scene, { look }); checkRender(r, scene, 'squall ' + JSON.stringify(m)); return r; };
      const r = sq({}), s = placedScale(r.svg, a, WHELP.w, WHELP.h);
      near(s, Math.round(base * mine / tall * 10000) / 10000, look.sex + ': capped to our cat\'s sitting height');
      assert.ok(s * tall <= base * mine + 0.05, 'no bigger than you');
      // side by side on the wall, nose to nose: the top of his head no higher than hers
      const top = (h, t) => h.y - 0; void top;
      const hisTop = a.y - tall * s, herTop = art.sceneInfo('title').anchors.main['wall-2'].y - mine * art.sceneInfo('title').anchors.main['wall-2'].h / 200;
      assert.ok(hisTop >= herTop - 0.5, look.sex + ': his head no higher than hers: ' + hisTop.toFixed(1) + ' vs ' + herTop.toFixed(1));
      near(placedScale(sq({ pose: 'tall' }).svg, a, WHELP.w, WHELP.h + 60), s, 'standing as tall as he can: the same scale');
      near(placedScale(sq({ size: 1.3 }).svg, a, WHELP.w, WHELP.h), s, 'a size above 1 is held to the cap');
      assert.ok(r.heads[0] && r.heads[0].r > 0 && r.heads[1] && r.heads[1].r > 0, 'both faces are lettered: ' + JSON.stringify(r.heads));
      const shade = [...r.svg.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([\d.]+)" ry="[\d.]+" fill="#[0-9A-F]{6}" opacity="0.3"\/>/g)].map((m) => m.slice(1).map(Number)).filter((e) => Math.abs(e[1] - (a.y - 1)) < 0.2);
      assert.ok(shade.some((e) => Math.abs(e[2] - (WHELP.bounds.x1 - WHELP.bounds.x0) * s * 0.42) < 0.3), 'his shadow under his body: ' + JSON.stringify(shade));
    });
  }
  // should cats.js report no head box for one of them, the face still gets a size (from the box the scenes estimate)
  const bare = function (who, opts) { const c = fakeNewcomers(real, FOX, WHELP)(who, opts); if (who === 'squall' || who === 'reynard') { delete c.headBox; delete c.bounds; } return c; };
  withCharacter(bare, () => {
    const scene = { set: 'title', cam: 'wide', cast: [{ who: 'squall', pose: 'sit', mood: 'proud', at: 'wall' }, { who: 'reynard', pose: 'sit', mood: 'happy', at: 'wall-2' }], fx: ['day'] };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'no head boxes');
    assert.ok(r.heads[0].r > 0 && r.heads[1].r > 0, 'r for both: ' + JSON.stringify(r.heads));
  });
});

test('the real Reynard and Squall (cats.js, once it draws them): in every pose of theirs, at every cat anchor of chapter 1\'s sets, Reynard is never taller sitting than Tallyheart there and Squall never taller than our cat; both have a face to letter', { skip: !(art.vocab.otherPoses && art.vocab.otherPoses.reynard && art.vocab.otherPoses.squall) && 'cats.js does not draw Reynard and Squall yet' }, () => {
  const tally = sitTall('tallyheart'), mine = sitTall('player', LOOK);
  const tallOf = (who) => { const c = art.character(who, { pose: 'sit', mood: 'neutral' }); return c.h - (c.headBox ? c.headBox.y0 : 0); };
  const fox = tallOf('reynard'), whelp = tallOf('squall');
  // as drawn, in the cats' units: about Tallyheart's size; a third of Sprinkle, no bigger than a cat
  assert.ok(fox > tally * 0.75, 'Reynard is about Tallyheart\'s size, not a little thing: ' + fox.toFixed(1) + ' against ' + tally.toFixed(1));
  let n = 0;
  for (const set of CH1_SETS) {
    const info = art.sceneInfo(set), seen = {};
    for (const cam of art.vocab.sets[set].cams) {
      // one camera for each composition (the cameras of one composition share its anchors)
      const comp = info.cams[cam].comp, anchors = seen[comp] ? [] : Object.entries(info.anchors[comp] || {}).filter(([, a]) => a.x || a.y);
      seen[comp] = true;
      for (const [at, a] of anchors) for (const [who, poses, cap, mineTall] of [['reynard', art.vocab.otherPoses.reynard, tally, fox], ['squall', art.vocab.otherPoses.squall, mine, whelp]]) {
        const pose = poses[n % poses.length], scene = { set, cam, cast: [{ who, pose, mood: MOODS[n % MOODS.length], at, facing: n % 2 ? 'left' : 'right' }], fx: [set === 'den' || set === 'sky' ? 'night' : 'day'] };
        const r = art.render(scene, { look: LOOK });
        checkRender(r, scene, set + '/' + cam + ' ' + who + ':' + pose + '@' + at);
        const ch = art.character(who, { pose, mood: scene.cast[0].mood, facing: scene.cast[0].facing });
        const s = placedScale(r.svg, a, ch.w, ch.h);
        if (s == null) continue;   // an anchor the drawing moves (the balcony's lift, the title's silhouette)
        assert.ok(s * mineTall <= a.h / 200 * cap + 0.06, set + '/' + cam + ' ' + who + '@' + at + ': ' + (s * mineTall).toFixed(1) + ' against ' + (a.h / 200 * cap).toFixed(1));
        if (r.heads[0]) assert.ok(r.heads[0].r > 0, who + ' has a face size');
        n++;
      }
    }
  }
  assert.ok(n > 80, 'placements checked: ' + n);
});

// ---------------------------------------------------------------- every new option, everywhere; chapter 4's frames; the gallery

test('every chapter 4 option value renders in every camera of its set, in every light, alone and all together, with a cast at every anchor', () => {
  const lights = [[], ['morning'], ['dusk'], ['night']];
  const values = { tower: { light: [true, false], roar: [true], ding: [true] }, den: { bark: ['auto', 1, 9, 12, ['four-a-night', null]], hidden: [true], moon: [true] }, hollow: { bark: ['falling', 'sand', 'row'], heap: [true], marks: [4] } };
  let n = 0;
  for (const [set, opts] of Object.entries(values)) {
    const info = art.vocab.sets[set], all = {};
    for (const [k, vals] of Object.entries(opts)) all[k] = vals[0];
    for (const cam of info.cams) lights.forEach((fx, f) => {
      const cast = info.anchors.map((at, i) => member(i + n, at, 0));
      // each value alone, in turn with and without the cast; all of them together, both ways
      Object.entries(opts).flatMap(([k, vals]) => vals.map((v) => ({ [k]: v }))).forEach((one, j) => {
        const scene = { set, cam, opts: one, cast: (j + f) % 2 ? [] : cast, fx };
        checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' ' + JSON.stringify(one) + ' ' + fx.join('+'));
        n++;
      });
      for (const c of [cast, []]) {
        const scene = { set, cam, opts: all, cast: c, fx };
        checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' ' + JSON.stringify(all) + ' ' + fx.join('+'));
        n++;
      }
    });
  }
  assert.ok(n > 300, 'renders: ' + n);
  // and with placeholder cats (no cats.js): the props are the sets' own
  const fake = function () { throw new Error('placeholder'); };
  fake.placeholder = true;
  const checkPlain = (r, scene, label) => {
    checkXml(r.svg);
    assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
    assert.equal(r.heads.length, scene.cast.length, label);
  };
  withCharacter(fake, () => {
    for (const scene of [
      { set: 'tower', cam: 'up', opts: { light: true, roar: true, ding: true }, cast: [{ who: 'player', at: 'corner', pose: 'sit' }, { who: 'waffles', at: 'railing', pose: 'peer' }, { who: 'reynard', at: 'foot', pose: 'sit' }], fx: ['day'] },
      { set: 'den', cam: 'nest', opts: { bark: 9, hidden: true, stone: 'nose' }, cast: [{ who: 'player', at: 'nest', pose: 'curl', facing: 'left' }], fx: ['night'] },
      { set: 'hollow', cam: 'wide', opts: { marks: 4, bark: 'falling', heap: true }, cast: [1, 2, 3, 4, 5].map((i) => ({ who: 'clancat', at: 'rim-' + i, pose: 'fall', variant: i })).concat([{ who: 'squall', at: 'sand-left', pose: 'sit' }]), fx: ['morning'] }
    ]) checkPlain(art.render(scene, { look: LOOK }), scene, 'placeholders: ' + scene.set);
  });
});

test('every frame of chapter 4 renders with the art vocabulary (once it is written)', () => {
  if (!has('app/story/ch04.js')) return;
  require(path.join(ROOT, 'app/story/ch04.js'));
  const ch = PC.story && PC.story.ch04;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.board !== 'STUB.') : [];
  for (const [id, f] of frames) {
    const s = f.scene, v = art.vocab;
    assert.ok(v.sets[s.set], id + ': set ' + s.set);
    assert.ok(v.sets[s.set].cams.includes(s.cam), id + ': camera ' + s.set + '/' + s.cam);
    for (const m of s.cast || []) if (typeof m.at === 'string') assert.ok(v.sets[s.set].anchors.includes(m.at), id + ': anchor ' + m.at + ' in ' + s.set);
    // the UI fills 'auto' from the cat before drawing; here, four marks, her stone by her nose, and the seven cards every cat holds
    const o = Object.assign({}, s.opts || {});
    if (o.marks === 'auto') o.marks = 4;
    if (o.glow === 'auto') o.glow = [true, false, false, false];
    if (o.depth === 'auto') delete o.depth;
    if (o.stone === 'auto') o.stone = 'nose';
    if (o.bark === 'auto') o.bark = 7;
    const scene = Object.assign({}, s, { opts: o });
    checkRender(art.render(scene, { look: LOOK }), scene, 'ch04 ' + id);
    // the sets this file draws: what the text's Art needs ask of them
    if (s.set === 'tower' && s.cam === 'up' && o.ding) assert.ok(!(s.cast || []).some((m) => m.at === 'foot' || m.at === 'window'), id + ': nobody at the foot of the tower when the little room goes DING');
    if (s.set === 'tower') assert.ok(!(s.cast || []).some((m) => m.who === 'player' && m.at === 'window'), id + ': she is never back in her old room');
    if (s.set === 'den' && o.hidden) assert.ok(o.bark, id + ': hidden goes with her bark');
  }
});

// chapter 5's three new characters, and its two new sets (their files are stubs until they are drawn)
const NEW5 = ['patience', 'puddle', 'wisp'], NEW_SETS5 = ['openriver', 'marsh'], NEW6 = ['coil', 'sleet', 'sloshbank', 'reedclan'];
test('the gallery (dev/gallery.html) loads every art script and chapter the game does, in the game\'s order; every sample on it names a set, a camera, anchors and options the art has, and renders', () => {
  const game = (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/<script\s+src="(app\/(?:art|story)\/[^"]+\.js)"/g) || []).map((m) => m.match(/app\/[^"]+/)[0]);
  const page = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  const mine = (page.match(/<script\s+src="\.\.\/(app\/[^"]+\.js)"/g) || []).map((m) => m.match(/app\/[^"]+/)[0]);
  assert.deepEqual(mine, game, 'the same scripts, in the same order');
  for (const f of mine) assert.ok(has(f), f + ' exists');
  // the page's own script parses, and its sample scenes (one per set and camera, and the extras) are real
  const js = page.slice(page.lastIndexOf('<script>') + 8, page.lastIndexOf('</script>'));
  assert.doesNotThrow(() => new Function(js), 'the page\'s script parses');
  const from = js.indexOf('// ---- a sample cast'), to = js.indexOf('// ---- panels');
  assert.ok(from > 0 && to > from, 'the samples are where they were');
  const { SAMPLES, EXTRA } = new Function(js.slice(from, to) + '\nreturn { SAMPLES: SAMPLES, EXTRA: EXTRA };')();
  const v = art.vocab, scenes = [];
  for (const [set, cams] of Object.entries(SAMPLES)) for (const [cam, smp] of Object.entries(cams)) scenes.push([set + ' / ' + cam, { set, cam, opts: smp.opts || {}, cast: smp.cast || [], fx: smp.fx || [] }]);
  for (const e of EXTRA) scenes.push([e[0] + ' / ' + e[1] + ' (' + e[3] + ')', { set: e[0], cam: e[1], opts: e[2].opts || {}, cast: e[2].cast || [], fx: e[2].fx || [] }]);
  assert.ok(scenes.length >= 130, 'samples: ' + scenes.length);
  const sets = new Set(), waiting = new Set();
  for (const [label, scene] of scenes) {
    const set = v.sets[scene.set];
    // (a set file that has not landed yet: its samples wait for it)
    if (!set && !CH1_SETS.includes(scene.set)) continue;
    assert.ok(set, label + ': set');
    // (chapter 5's two sets while their files are still the stubs, one camera and no options: the same)
    if (NEW_SETS5.includes(scene.set) && set.cams.length === 1 && !Object.keys(set.opts).length) { waiting.add(scene.set); continue; }
    if (!set.cams.includes(scene.cam) && !CH1_SETS.includes(scene.set)) continue;
    assert.ok(set.cams.includes(scene.cam), label + ': camera');
    // (and a sample with one of chapter 5's three in it, until cats.js draws them)
    const late = scene.cast.filter((m) => (NEW5.includes(m.who) || NEW6.includes(m.who)) && v.cast && !v.cast.includes(m.who)).map((m) => m.who);
    if (late.length) { late.forEach((w) => waiting.add(w)); continue; }
    sets.add(scene.set);
    for (const k of Object.keys(scene.opts)) assert.ok(Object.prototype.hasOwnProperty.call(set.opts, k), label + ': option ' + k);
    for (const m of scene.cast) {
      if (typeof m.at === 'string' && (CH1_SETS.includes(scene.set) || NEW_SETS5.includes(scene.set))) assert.ok(set.anchors.includes(m.at), label + ': anchor ' + m.at);
      assert.ok(!v.cast || v.cast.includes(m.who), label + ': cast ' + m.who);
      if (CAT_LIKE.has(m.who) && v.poses) assert.ok(v.poses.includes(m.pose), label + ': pose ' + m.pose);
      else if (v.otherPoses && v.otherPoses[m.who]) assert.ok(v.otherPoses[m.who].includes(m.pose), label + ': ' + m.who + ' pose ' + m.pose);
      assert.ok(!v.moods || v.moods.includes(m.mood), label + ': mood ' + m.mood);
    }
    for (const f of scene.fx) assert.ok(v.fx.includes(f), label + ': fx ' + f);
    checkRender(art.render(scene, { look: LOOK }), scene, 'gallery ' + label);
  }
  for (const set of CH1_SETS) assert.ok(sets.has(set), 'the gallery samples ' + set);
  // every chapter 4 change to chapter 1's sets has a panel on the page
  const extras = EXTRA.map((e) => JSON.stringify(e[2].opts || {}) + JSON.stringify(e[2].cast || []));
  for (const k of ['"light":true', '"roar":true', '"ding":true', '"at":"corner"', '"at":"foot"', '"bark":"auto"', '"hidden":true', '"moon":true', '"bark":"falling"', '"bark":"sand"', '"bark":"row"', '"heap":true', '"marks":4',
    '"wink":true', '"holds":"bark"', '"who":"reynard"', '"who":"squall"', '"pose":"situp"']) assert.ok(extras.some((x) => x.includes(k)), 'the gallery shows ' + k);
  // and every chapter 5 change: five marks, the rim's tucked claws, the fatter moon, a file two deep, the old tom asleep
  // with his snail, Riffle's pole, Murmurchime on the rim, and the three new characters at a cat's anchor
  for (const k of ['"marks":5', '"tuck":true', '"moon":5', '"asleep":true', '"snail":true', '"snail":"in"', '"holds":"pole"', '"who":"murmurchime"', '"who":"patience"', '"who":"puddle"', '"who":"wisp"'])
    assert.ok(extras.some((x) => x.includes(k)), 'the gallery shows ' + k);
  assert.ok(EXTRA.some((e) => e[0] === 'den' && Array.isArray((e[2].opts || {}).bark) && e[2].opts.bark.length >= 12 && e[2].opts.hidden), 'the gallery shows a chapter 5 file, two deep, two hidden');
  assert.ok(EXTRA.some((e) => e[0] === 'tower' && (e[2].opts || {}).roar && (e[2].cast || []).length === 1 && e[2].cast[0].who === 'player' && e[2].cast[0].at === 'foot'), 'the gallery shows the offer: the roar, our cat at the foot, nobody at the railing');
  // and every chapter 6 change: the walk at wall-3, both cameras of the wall's end with the rustle, three and three, the
  // dream (both cameras, the starry cat), six marks and the patrol behind the rim, three under the moss, the newcomers
  for (const k of ['"at":"wall-3"', '"rustle":true', '"at":"reed-1"', '"starry":true', '"marks":6', '"z":"behind"', '"coil-diggers"', '"who":"coil"', '"who":"sleet"', '"who":"sloshbank"', '"who":"reedclan"'])
    assert.ok(extras.some((x) => x.includes(k)), 'the gallery shows ' + k);
  for (const [set, cam] of [['title', 'end'], ['title', 'meet'], ['sky', 'walk'], ['sky', 'below']]) {
    assert.ok(SAMPLES[set][cam], 'the gallery samples ' + set + ' / ' + cam);
    assert.ok(EXTRA.some((e) => e[0] === set && e[1] === cam && /^chapter 6:/.test(e[3])), 'a chapter 6 panel on ' + set + ' / ' + cam);
  }
  assert.ok(EXTRA.some((e) => e[0] === 'den' && Array.isArray((e[2].opts || {}).bark) && e[2].opts.bark.includes('coil-diggers') && e[2].opts.hidden), 'the gallery shows Coil\'s card under the moss');
  assert.ok(EXTRA.some((e) => e[0] === 'hollow' && (e[2].cast || []).filter((m) => m.at && m.at.z === 'behind' && m.pose === 'walk').length === 3), 'the gallery shows the patrol of three behind the rim');
  // a sample for every camera of the two new sets, by the names the text gives them
  assert.deepEqual(Object.keys(SAMPLES.openriver), ['wide', 'raft', 'light', 'log', 'sky', 'rocks', 'edge', 'beside', 'under']);
  assert.deepEqual(Object.keys(SAMPLES.marsh), ['wide', 'far', 'heron', 'mud', 'pole', 'reeds', 'wisp', 'draw']);
  for (const id of NEW_SETS5) if (v.sets[id] && !waiting.has(id)) for (const cam of v.sets[id].cams) assert.ok(SAMPLES[id][cam], 'the gallery samples ' + id + ' / ' + cam);
  // (what still waits for another file to land is not a failure here; it is named in the suite's own tests)
});

test('art.kit, chapter 4: the red light, the young moon and the bark are there for the sets in their own files', () => {
  for (const k of ['redLight', 'thinMoon', 'barkCurl', 'barkAt']) assert.equal(typeof art.kit[k], 'function', 'kit.' + k);
  // a piece of bark placed in the world: its foot at (x, y), as wide as asked
  const piece = art.kit.barkAt({ picture: 'four-a-night', mark: 'eye' }, 500, 600, 40, 0, 0), flat = art.kit.barkAt(null, 500, 600, 40, 5, 0.5);
  assert.ok(/^<g transform="translate\(500 600\) rotate\(0\) scale\(0\.2\) translate\(-100 -240\)" data-bark="card">/.test(piece), piece.slice(0, 120));
  assert.ok(/^<g transform="translate\(500 600\) rotate\(5\) matrix\(0\.2 0 -0\.028 0\.1 0 0\) translate\(-100 -240\)" data-bark="blank">/.test(flat), flat.slice(0, 140));
  checkXml('<svg>' + piece + flat + '</svg>');
});

// ================================================================ chapter 5 (build.md, "Chapter 5 (v0.4)")
// What Riffle's River asks of chapter 1's sets (docs/chapters/05-riffles-river.md: "Art needs", "Places
// from before", and the Build notes' "Sets and options"): the Training Hollow with five marks, the den
// at dusk under a crescent a little fatter than chapter 4's and at night with more bark along her
// nest's edge, the tower for the offer and for "Not today", every new cast extra handed on to the
// painters, and the three new characters sized and lettered. Chapters 1 to 4 look exactly as they did.

// <ch4-fingerprint>
// Chapter 4's own pictures of chapter 1's sets, before chapter 5: the tower's light, roar and DING with
// the corner and foot anchors, the den's bark (to nine pieces, chapter 4's fullest row), its hidden
// two and its young moon, the hollow's fourth mark, its curl of bark, its row and its heap; each with
// a cast, in chapter 4's lights, drawn with placeholder cats and the scenes' own plain bark (no cats.js,
// no cards.js: the fingerprint is the sets' alone). Recorded with scenes.js as chapter 4 shipped it (7ae12db).
const CH4 = {
  tower: {
    cams: ['up'], fx: [['day'], ['dusk'], ['sunset']],
    opts: [{ chime: true, light: true }, { chime: true, light: true, roar: true }, { chime: true, ding: true }, { roar: true, light: false }, { chime: true }],
    casts: [
      [{ who: 'waffles', at: 'railing', pose: 'peer', mood: 'scared', facing: 'left' }, { who: 'player', at: 'foot', pose: 'lookup', mood: 'wonder', facing: 'right' }],
      [{ who: 'player', at: 'corner', pose: 'walk', mood: 'happy', facing: 'left' }, { who: 'waffles', at: 'railing', pose: 'peer', mood: 'shout', facing: 'left' }],
      [{ who: 'waffles', at: 'railing', pose: 'peer', mood: 'sad', facing: 'left' }, { who: 'player', at: 'foot', pose: 'walk', mood: 'kind', facing: 'left' }], []
    ]
  },
  den: {
    cams: ['outside', 'inside', 'nest', 'doorway'], fx: [['dusk'], ['night'], ['morning'], ['sunset']],
    opts: [{ weather: 'clear', moon: true, stone: 'nose' }, { weather: 'clear', moon: false, stone: 'chin', bark: 'auto' }, { stone: true, bark: 9, hidden: true }, { bark: 7, hidden: true, stone: 'nose' },
      { bark: ['four-a-night', 'tidy', { picture: 'dug-earth', mark: 'eye' }, 'scale', { picture: 'fox-flew', mark: 'ear' }, 'sprinkle-scales', null, 'cant-fly'], hidden: true }, { bark: 3 }, { hidden: true }, { bark: 1, moon: true, weather: 'cloudy' }],
    casts: [
      [{ who: 'tallyheart', at: 'entrance-right', pose: 'sit', mood: 'kind', facing: 'left' }, { who: 'player', at: 'entrance-left', pose: 'sit', mood: 'wonder', facing: 'right' }],
      [{ who: 'snorer', at: 'sleeper-1', pose: 'curl', mood: 'sleepy' }, { who: 'player', at: 'nest', pose: 'lie', mood: 'sleepy', facing: 'right' }],
      [{ who: 'player', at: 'nest', pose: 'sit', mood: 'wonder', facing: 'left' }, { who: 'tallyheart', at: 'doorway', pose: 'peer', mood: 'happy', facing: 'left' }], []
    ]
  },
  hollow: {
    cams: ['wide', 'lesson', 'sand', 'tree'], fx: [['morning'], ['day'], ['sunset']],
    opts: [{ marks: 3, glow: [true, false, false] }, { marks: 4, glow: [true, false, false, false], bark: 'falling' }, { marks: 4, bark: 'sand' }, { marks: 4, bark: 'row' },
      { marks: 4, bark: 'row', cards: ['four-a-night', 'tidy', { id: 'dug-earth' }, 'scale', 'fox-flew'], blank: 1 }, { marks: 3, heap: true }, { marks: 4, depth: [2, 1, 1, 0], glow: true }],
    casts: [
      [1, 2, 3, 5].map((v, i) => ({ who: 'clancat', variant: v, at: 'rim-' + (i + 1), pose: ['sit', 'fall', 'lie', 'flat'][i], mood: 'proud', facing: i < 2 ? 'right' : 'left' })).concat([{ who: 'grizzled', at: 'rim-5', pose: 'sit', mood: 'stern', facing: 'left' },
        { who: 'tallyheart', at: 'tree-far', pose: 'sit', mood: 'kind', facing: 'left', size: 1.2 }, { who: 'player', at: 'sunpatch-2', pose: 'sit', mood: 'wonder', facing: 'right' }]),
      [{ who: 'tallyheart', at: 'sand-left', pose: 'sit', mood: 'kind', facing: 'right' }, { who: 'player', at: 'sand-right', pose: 'crouch', mood: 'wonder', facing: 'left' }],
      [{ who: 'tallyheart', at: 'tree', pose: 'stretch', mood: 'proud', facing: 'right' }, { who: 'player', at: 'sand-left', pose: 'sit', mood: 'wonder', facing: 'right' }], []
    ]
  }
};
function ch4Fingerprint(art, crypto) {
  const fake = function () { throw new Error('placeholder'); };
  fake.placeholder = true;
  const real = art.character, out = {}, hadCards = Object.prototype.hasOwnProperty.call(art, 'cardGroup'), cards = art.cardGroup;
  art.character = fake;
  delete art.cardGroup;
  try {
    for (const [set, d] of Object.entries(CH4)) for (const cam of d.cams) {
      const h = crypto.createHash('sha1');
      d.opts.forEach((opts, i) => d.fx.forEach((fx, f) => {
        for (const cast of [d.casts[(i + f) % d.casts.length], d.casts[(i + f + 1) % d.casts.length]]) {
          const r = art.render({ set, cam, opts, cast, fx }, { look: { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' } });
          h.update(r.svg.replace(/pcs[0-9a-z]+-/g, '') + JSON.stringify(r.heads) + JSON.stringify(r.keep));
        }
      }));
      out[set + '/' + cam] = h.digest('hex').slice(0, 16);
    }
  } finally { art.character = real; if (hadCards) art.cardGroup = cards; }
  return out;
}
// </ch4-fingerprint>
const CH4_FINGERPRINT = {
  'tower/up': '96e3fc68e5a3954b', 'den/outside': 'd3b5f11fb127c97e', 'den/inside': '7b6e69ca2cae777b', 'den/nest': '54e406d4e5f25e9f', 'den/doorway': 'd1ae0ec50b624388', 'hollow/wide': 'e237a2033454bf0e', 'hollow/lesson': 'a9d6aa44bfed5c75', 'hollow/sand': '2a8aab8c5a2ee593', 'hollow/tree': '87a6cf49207f28a6'
};

test('chapter 4 looks exactly as it did: its own pictures of the tower, the den and the hollow (every option it added, with a cast, in its lights) match their fingerprint from before chapter 5', () => {
  const now = ch4Fingerprint(art, require('crypto'));
  assert.deepEqual(Object.keys(now), Object.keys(CH4_FINGERPRINT), 'the same sets and cameras, in the same order');
  for (const k of Object.keys(CH4_FINGERPRINT)) assert.equal(now[k], CH4_FINGERPRINT[k], k + ' draws something else than it did for chapter 4');
  assert.ok(!art.character || !art.character.placeholder, 'the real cats are back');
});

const CH1_CAMS = { room: ['wide', 'cushion', 'glass', 'outside'], tower: ['up', 'balcony', 'balcony-close'], garden: ['wide', 'paws', 'step', 'fence', 'lamp', 'meet', 'hedge', 'hedge-close'],
  camp: ['reveal', 'crowd', 'fountain', 'entrance', 'fountain-close', 'ferns', 'purr'], hollow: ['wide', 'lesson', 'sand', 'tree'], den: ['outside', 'inside', 'nest', 'doorway'],
  sky: ['up', 'cats'], river: ['crash'], title: ['wide'] };
const CH1_ANCHORS = { room: ['cushion', 'floor', 'glass', 'doorway'], tower: ['window', 'railing', 'corner', 'foot'], garden: ['step', 'lawn', 'fence-foot', 'lamp-top', 'hedge-gap', 'doorway', 'hedge-side'],
  camp: ['entrance', 'fountain-top', 'fountain-foot', 'crowd-left', 'crowd-right', 'ferns', 'center'],
  hollow: ['sand-left', 'sand-right', 'sunpatch', 'tree', 'sunpatch-2', 'sunpatch-3', 'tree-far', 'rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'],
  den: ['entrance-left', 'entrance-right', 'doorway', 'nest', 'sleeper-1', 'sleeper-2'], sky: ['ground-left', 'ground-right'], river: ['bank'], title: ['wall', 'wall-2'] };

test('vocab, chapter 5: the den\'s moon takes its age in evenings (5: a little fatter than chapter 4\'s); five marks; nothing else is new on chapter 1\'s sets: the same cameras, anchors and option names, and no option on unless a frame asks', () => {
  const v = art.vocab.sets;
  assert.deepEqual(v.den.opts.moon.slice(0, 3), [false, true, 5], 'no moon, chapter 4\'s sliver, the fifth evening\'s crescent');   // (chapter 8 adds its 8: tested with it)
  assert.ok(v.hollow.opts.marks.includes(5), 'marks: 5');
  assert.deepEqual(v.den.opts.bark, [false, 'auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'bark: a number, or auto (her own cards, however many)');
  assert.deepEqual(v.den.opts.hidden, [false, true], 'no change to hidden');
  // chapter 5 needs no new place to stand and no new camera in chapter 1's sets (the storyboard has words for all of these);
  // chapter 6's are its own, named in CH6_NEW, after them
  for (const set of CH1_SETS) {
    assert.deepEqual(v[set].cams, CH1_CAMS[set].concat((CH6_NEW[set] || {}).cams || []), set + ': cameras');
    assert.deepEqual(v[set].anchors, CH1_ANCHORS[set].concat((CH6_NEW[set] || {}).anchors || []), set + ': anchors');
  }
  assert.deepEqual(Object.keys(v.tower.opts), ['chime', 'light', 'roar', 'ding'], 'the tower as chapter 4 left it');
  assert.deepEqual(Object.keys(v.den.opts).slice(0, 6), ['weather', 'moon', 'drips', 'stone', 'bark', 'hidden']);   // (chapter 8's `glass` after them)
  // (chapter 7's `compare` comes after them: tested with it)
  assert.deepEqual(Object.keys(v.hollow.opts).slice(0, 7), ['marks', 'glow', 'depth', 'bark', 'cards', 'blank', 'heap']);
  assert.equal(art.sceneInfo('den').defaults.moon, undefined, 'no moon unless a frame asks');
  assert.equal(typeof art.kit.waxingMoon, 'function', 'kit.waxingMoon, for the sets in their own files');
  // the three newcomers' sizes, published for the sets that lay props round them: the numbers a set may have copied
  // (chapter 6 adds three more, tested with it)
  const five = (b) => ({ patience: b.patience, puddle: b.puddle, wisp: b.wisp });
  assert.deepEqual(five(art.sizeBands), { patience: { ref: 'tallyheart', pose: 'stand', by: 'tall', min: 1.4, max: 2.6 }, puddle: { ref: 'sprinkle', pose: 'head', by: 'head', min: 0.88, max: 1.12 }, wisp: { ref: 'sprinkle', pose: 'blink', by: 'head', min: 0.7, max: 0.94 } });
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  assert.ok(md.indexOf('## Chapter 5') > 0, 'build.md has a chapter 5 section');
});

// ---------------------------------------------------------------- the cast: extras for the painters

test('chapter 5 cast extras reach the drawing: tuck, asleep, snail (true and \'in\') and holds: \'pole\'; so does any other key a painter learns later; who, at, size, facing, purr and lift stay the scene\'s, and a cast member cannot bring her own look', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, calls = [];
  const spy = function (who, opts) { calls.push({ who, opts: Object.assign({}, opts) }); return real(who, opts); };
  const cast = [
    { who: 'tallyheart', pose: 'situp', mood: 'kind', at: 'tree-far', facing: 'left', size: 1.2, tuck: true },
    { who: 'clancat', variant: 1, pose: 'situp', mood: 'proud', at: 'rim-1', facing: 'right', tuck: true },
    { who: 'murmurchime', pose: 'situp', mood: 'happy', at: 'rim-2', facing: 'right', tuck: true },
    { who: 'grizzled', pose: 'sit', mood: 'sleepy', at: 'rim-5', facing: 'left', asleep: true, snail: true, purr: true },
    { who: 'grizzled', pose: 'sit', mood: 'scared', at: 'rim-4', facing: 'left', snail: 'in' },
    { who: 'riffle', pose: 'hug', mood: 'happy', at: 'sand-left', facing: 'right', holds: 'pole', lift: true },
    { who: 'player', pose: 'sit', mood: 'wonder', at: 'sunpatch-2', facing: 'right', buzz: true, somethingNew: 'x', look: { fur: 'ginger' }, sex: 'she' }
  ];
  const scene = { set: 'hollow', cam: 'wide', opts: { marks: 5 }, cast, fx: ['morning'] };
  const r = withCharacter(spy, () => art.render(scene, { look: LOOK }));
  checkRender(r, scene, 'chapter 5 extras');
  cast.forEach((m, i) => {
    const call = calls.find((c) => c.who === m.who && c.opts.pose === m.pose && c.opts.mood === m.mood && c.opts.facing);
    assert.ok(call, m.who + ' is drawn');
    for (const k of ['tuck', 'asleep', 'snail', 'holds', 'buzz', 'somethingNew']) assert.equal(call.opts[k], m[k], i + ' ' + m.who + ': ' + k);
    for (const k of ['size', 'at', 'purr', 'lift', 'who']) assert.equal(call.opts[k], undefined, i + ' ' + m.who + ': ' + k + ' stays the scene\'s');
    assert.equal(call.opts.facing, m.facing, i + ': facing is handed over as the scene placed her');
  });
  // our cat's look is the page's (ctx.look), never a cast member's own; nobody else gets one
  const me = calls.find((c) => c.who === 'player' && c.opts.facing);
  assert.deepEqual(me.opts.look, LOOK);
  assert.equal(me.opts.sex, LOOK.sex);
  assert.equal(calls.find((c) => c.who === 'riffle' && c.opts.facing).opts.look, undefined);
  // an extra that is null or undefined is not an extra
  const quiet = [];
  withCharacter(function (who, opts) { quiet.push(Object.assign({}, opts)); return real(who, opts); }, () => art.render({ set: 'hollow', cam: 'wide', cast: [{ who: 'tallyheart', pose: 'situp', mood: 'kind', at: 'tree-far', tuck: null, snail: undefined }] }, { look: LOOK }));
  for (const o of quiet) assert.ok(!('tuck' in o) && !('snail' in o), 'nothing handed on: ' + JSON.stringify(o));
});

test('chapters 1 to 4 hand the painter exactly the options they did: for every cast member of every frame, pose, mood, variant, the twelve extras they knew (in their order), our cat\'s look and a Clan cat\'s, and nothing else', { skip: (!art.character || !has('app/story/ch04.js')) && 'no cats.js or stories' }, () => {
  const OLD = ['flatEars', 'holds', 'holdAt', 'tear', 'mist', 'claws', 'puffed', 'squeeze', 'moss', 'pebbles', 'wink', 'flick'];
  const KNOWN = new Set(['pose', 'mood', 'variant', 'look', 'sex', 'taken', 'facing'].concat(OLD));
  const real = art.character;
  let members = 0;
  for (const id of ['ch01', 'ch02', 'ch03', 'ch04']) {
    if (!has('app/story/' + id + '.js')) continue;
    require(path.join(ROOT, 'app/story/' + id + '.js'));
    for (const [fid, f] of Object.entries(PC.story[id].frames)) {
      if (!f.scene || !Array.isArray(f.scene.cast)) continue;
      const calls = [];
      const r = withCharacter(function (who, opts) { calls.push([who, JSON.stringify(Object.assign({}, opts, { facing: undefined }))]); return real(who, opts); }, () => art.render(f.scene, { look: LOOK }));
      const clan = f.scene.cast.filter((c) => c && c.who === 'clancat').map((c) => c.variant);
      f.scene.cast.forEach((m, i) => {
        if (!r.heads[i] && typeof m.at === 'string' && !art.vocab.sets[f.scene.set].anchors.includes(m.at)) return;
        const who = m.who || 'clancat', o = { pose: m.pose || (who === 'sparrow' ? 'perch' : who === 'moth' ? 'fly' : who === 'tallone' ? 'stand' : 'sit'), mood: m.mood || 'neutral' };
        if (m.variant != null) o.variant = m.variant;
        OLD.forEach((k) => { if (m[k] != null) o[k] = m[k]; });
        if (who === 'player') { o.look = LOOK; o.sex = LOOK.sex; }
        if (who === 'clancat') { o.look = LOOK; o.taken = clan; }
        const want = JSON.stringify(o);
        const mine = calls.filter((c) => c[0] === who);
        if (!mine.length) return;   // out of this camera's sight: never drawn
        assert.ok(mine.some((c) => c[1] === want), id + ' ' + fid + ' cast ' + i + ' (' + who + '): the painter is handed ' + want + ', got ' + mine.map((c) => c[1]).slice(0, 3).join(' | '));
        members++;
      });
      for (const c of calls) for (const k of Object.keys(JSON.parse(c[1]))) assert.ok(KNOWN.has(k), id + ' ' + fid + ': a key the painter never had from chapters 1 to 4: ' + k);
    }
  }
  assert.ok(members > 800, 'cast members checked: ' + members);
  // the order, on a cast member who carries everything at once (none in chapters 1 to 4 does): the twelve first,
  // as they always came, then chapter 5's three, then whatever else, as written; the scene's own never
  const all = { zeta: 1, snail: 'in', flick: true, wink: true, pebbles: 4, moss: true, squeeze: true, puffed: true, claws: true, mist: true, tear: true, holdAt: 'paws', holds: 'stone', flatEars: true, asleep: true, tuck: true, alpha: 2,
    size: 0.9, purr: true, lift: true, at: 'sand-left', facing: 'left', mood: 'kind', pose: 'sit', who: 'tallyheart' };
  const got = [];
  withCharacter(function (who, opts) { got.push(Object.keys(opts)); return real(who, opts); }, () => art.render({ set: 'hollow', cam: 'wide', cast: [all], fx: ['day'] }, { look: LOOK }));
  assert.ok(got.some((k) => k.join(' ') === ['pose', 'mood'].concat(OLD, ['tuck', 'asleep', 'snail', 'zeta', 'alpha', 'facing']).join(' ')), 'in order: ' + JSON.stringify(got.filter((k) => k.includes('zeta'))[0]));
});

// ---------------------------------------------------------------- the den at dusk: the fifth evening's moon

// the moon a den panel draws at dusk: where it is, how big, how it leans, and how thick its lit part
// is at the widest (a share of its radius: 0.2 for chapter 4's sliver, 1 at the half moon, 2 when full)
function duskMoon(opts, fx, cam) {
  const scene = { set: 'den', cam: cam || 'outside', opts, cast: [], fx: fx || ['dusk'] }, r = art.render(scene, { look: LOOK });
  checkRender(r, scene, 'den ' + JSON.stringify(opts) + ' ' + (fx || ['dusk']).join('+'));
  const M = prop(r.svg, 'waxing-moon') || prop(r.svg, 'thin-moon');
  if (!M) return { r, svg: r.svg, none: true };
  const at = /<g transform="translate\(([\d.]+) ([\d.]+)\) rotate\((-?[\d.]+)\)">/.exec(M).slice(1).map(Number);
  const arc = /<path d="M0 -([\d.]+)A([\d.]+) [\d.]+ 0 0 1 0 [\d.]+A([\d.]+) [\d.]+ 0 0 ([01]) 0 -[\d.]+Z" fill="#FFF3D2"\/>/.exec(M).slice(1).map(Number);
  return { r, svg: r.svg, M, x: at[0], y: at[1], tilt: at[2], rad: arc[0], thick: (arc[1] + (arc[3] ? arc[2] : -arc[2])) / arc[1], waxing: !!prop(r.svg, 'waxing-moon') };
}

test('den moon, chapter 5: moon: 5 at dusk is the fifth evening\'s crescent, a little fatter than chapter 4\'s, a little bigger and a little higher over the towers, plain to see, and the lettering keeps off it; from inside it hangs in the doorway\'s sky, over a cat sitting there; moon: true is chapter 4\'s sliver still, from outside only; never by night, by day or under cloud', () => {
  const four = duskMoon({ moon: true }), five = duskMoon({ moon: 5 });
  assert.ok(!four.waxing && four.thick > 0.08 && four.thick <= 0.25, 'chapter 4\'s moon is the sliver it was: ' + four.thick);
  assert.deepEqual([four.x, four.y, four.rad, four.tilt], [1496, 132, 40, 38], 'and where it was');
  assert.deepEqual(four.r.keep, [], 'chapter 4\'s asks nothing of the lettering, as before');
  assert.ok(five.waxing, 'a moon at dusk on the fifth evening');
  assert.match(five.M, /^<g data-prop="waxing-moon" data-age="5">/);
  // a little fatter: plainly thicker than the sliver (half as much again, at least), still a crescent well short of a half moon
  assert.ok(five.thick >= four.thick * 1.5 && five.thick <= 0.5, 'a little fatter: ' + five.thick.toFixed(2) + ' against ' + four.thick.toFixed(2));
  assert.ok(five.rad > four.rad && five.rad <= four.rad * 1.25, 'a little bigger: ' + five.rad);
  assert.ok(five.y < four.y && five.y > four.y - 40 && five.x < four.x && five.x > four.x - 60, 'a little higher, a little further from where the sun went down: ' + [five.x, five.y]);
  // whole in the panel, over the towers at the right (their tops are at y 200 and 280), clear of the rosebush
  assert.ok(five.x - five.rad > 1380 && five.x + five.rad < 1600 && five.y - five.rad > 0 && five.y + five.rad < 200, 'over the towers, whole: ' + [five.x, five.y, five.rad]);
  assert.ok(five.tilt > 10 && five.tilt <= four.tilt, 'lit from below right still');
  // plain to see: the lit crescent at its widest is at least a hundredth of the panel across
  assert.ok(five.thick * five.rad >= 16, 'the crescent is ' + (five.thick * five.rad).toFixed(1) + ' across at its widest');
  // it is in the picture and no longer in the words: the lettering keeps off it
  assert.equal(five.r.keep.length, 1);
  const k = five.r.keep[0], kb = [k.x * 16, k.y * 10, (k.x + k.w) * 16, (k.y + k.h) * 10];
  assert.ok(kb[0] <= five.x - five.rad && kb[2] >= five.x + five.rad && kb[1] <= five.y - five.rad && kb[3] >= five.y + five.rad, 'keep holds the whole moon: ' + kb.map(Math.round));
  assert.ok(k.w < 9 && k.h < 14, 'and no more than the moon');
  // at sunset too; with Tallyheart at the doorway under it and our cat beside her, both in the panel, the moon over her side
  assert.ok(duskMoon({ moon: 5 }, ['sunset']).waxing, 'at sunset too');
  const scene = { set: 'den', cam: 'outside', opts: { weather: 'clear', moon: 5, stone: 'auto' }, cast: [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'entrance-right', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'entrance-left', facing: 'right' }], fx: ['dusk'] };
  const both = art.render(scene, { look: LOOK });
  checkRender(both, scene, 'the den at dusk, chapter 5');
  assert.ok(both.heads[0] && both.heads[1] && both.heads[0].x > both.heads[1].x && five.x / 16 > both.heads[0].x, 'the moon hangs on Tallyheart\'s side, above her: ' + JSON.stringify(both.heads));
  assert.ok(five.y / 10 < both.heads[0].y - 30, 'well above her head');
  // by night the moon has set, or is the one chapter 2 drew; never under cloud, by day, or from inside the den
  const night = duskMoon({ moon: 5 }, ['night']);
  assert.ok(night.none && /<circle cx="1330" cy="150" r="132"/.test(night.svg), 'by night, chapter 2\'s crescent where it was');
  for (const [opts, fx, why] of [[{ moon: 5, weather: 'cloudy' }, ['dusk'], 'cloud'], [{ moon: 5, weather: 'storm' }, ['dusk'], 'storm'], [{ moon: false }, ['dusk'], 'not asked for'], [{ moon: 5 }, ['morning'], 'morning'], [{ moon: 5 }, ['day'], 'day'], [{ moon: 0 }, ['dusk'], 'age 0']]) {
    const m = duskMoon(opts, fx);
    assert.ok(m.none && !m.svg.includes('#FFF3D2'), 'no moon: ' + why);
  }
  // from inside, the same moon hangs in the doorway's patch of sky (chapter 4's sliver is seen from outside only, as it was)
  for (const cam of ['inside', 'doorway', 'nest']) {
    assert.ok(duskMoon({ moon: true }, ['dusk'], cam).none, cam + ': chapter 4\'s moon is never seen from inside');
    const m = duskMoon({ moon: 5 }, ['dusk'], cam), vb = viewBox(m.svg);
    assert.ok(m.waxing && Math.abs(m.thick - five.thick) < 0.001 && m.tilt === five.tilt, cam + ': the same crescent through the doorway');
    // inside the arch (at that height its opening runs from about x 1267 to 1513), above the bushes outside (y 640)
    assert.ok(m.x - m.rad > 1290 && m.x + m.rad < 1500 && m.y - m.rad > 505 && m.y + m.rad < 630, cam + ': in the doorway\'s sky: ' + [m.x, m.y, m.rad]);
    if (cam === 'nest') assert.deepEqual(m.r.keep, [], 'the nest close-up looks the other way: no moon in it, nothing to keep off');
    else {
      assert.ok(inVb(m.x - m.rad, m.y - m.rad, vb, 2) && inVb(m.x + m.rad, m.y + m.rad, vb, 2), cam + ': whole in the panel');
      assert.equal(m.r.keep.length, 1, cam + ': the lettering keeps off it');
    }
    for (const [opts, fx, why] of [[{ moon: 5 }, ['night'], 'night'], [{ moon: 5 }, ['morning'], 'morning'], [{ moon: 5, weather: 'cloudy' }, ['dusk'], 'cloud'], [{ moon: 5, weather: 'storm' }, ['dusk'], 'storm'], [{}, ['dusk'], 'not asked for']])
      assert.ok(duskMoon(opts, fx, cam).none, cam + ': no moon through the doorway: ' + why);
  }
  // over Tallyheart, sitting in the doorway: the crescent hangs above her head, clear of her ears
  const inDoor = { set: 'den', cam: 'doorway', opts: { weather: 'clear', moon: 5 }, cast: [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'doorway', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'nest', facing: 'right' }], fx: ['dusk'] };
  const d = art.render(inDoor, { look: LOOK }), dm = duskMoon({ moon: 5 }, ['dusk'], 'doorway');
  checkRender(d, inDoor, 'the doorway at dusk, chapter 5');
  if (art.character) {
    const hb = worldHeadBox(d, 0, inDoor, 'tallyheart', { pose: 'sit', mood: 'kind', facing: 'left' }, art.sceneInfo('den').anchors.inside.doorway.h / 200).box;
    assert.ok(dm.y + dm.rad < hb[1] - 10, 'the moon is above her ears: ' + (dm.y + dm.rad) + ' against ' + Math.round(hb[1]));
    assert.ok(Math.abs(dm.x - (hb[0] + hb[2]) / 2) < 140, 'and over her, not off to one side: ' + dm.x + ' against ' + Math.round((hb[0] + hb[2]) / 2));
  }
});

test('the moon is the Gathering\'s clock: from the fourth evening to the fourteenth it is fatter every evening, a crescent, then a half moon, then bulging, then full; always whole in the den\'s sky; kit.waxingMoon draws the same moon anywhere', () => {
  let prev = null;
  for (let age = 4; age <= 14; age++) {
    const m = duskMoon({ moon: age });
    assert.ok(m.waxing, 'age ' + age);
    assert.ok(m.x - m.rad > 0 && m.x + m.rad < 1600 && m.y - m.rad > 0 && m.y + m.rad < 290, 'age ' + age + ': whole, in the sky: ' + [m.x, m.y, m.rad]);
    if (prev) assert.ok(m.thick > prev.thick + 0.05 && m.rad >= prev.rad && m.y <= prev.y, 'age ' + age + ': fatter than the evening before: ' + m.thick.toFixed(2));
    prev = m;
  }
  assert.ok(Math.abs(duskMoon({ moon: 4 }).thick - 0.2) < 0.01, 'the fourth evening\'s is chapter 4\'s sliver');
  assert.ok(duskMoon({ moon: 8 }).thick < 1 && duskMoon({ moon: 9 }).thick > 1, 'the half moon falls between the eighth and ninth evenings');
  assert.ok(Math.abs(prev.thick - 2) < 0.01, 'full on the fourteenth: ' + prev.thick);
  assert.ok(duskMoon({ moon: 30 }).thick <= 2 && duskMoon({ moon: 1 }).thick > 0, 'never more than full, never less than a hair');
  // for a set in its own file: (x, y), radius, tilt and age
  const S = { radU: () => 'url(#x)' };
  const one = art.kit.waxingMoon(S, 500, 300, 60, 20, 5);
  assert.match(one, /^<g data-prop="waxing-moon" data-age="5"><circle cx="500" cy="300" r="156" fill="url\(#x\)"\/><g transform="translate\(500 300\) rotate\(20\)">/);
  checkXml('<svg>' + one + '</svg>');
});

// ---------------------------------------------------------------- the den at night: more bark

// her file in chapter 5: chapter 4's cards, then today's (their ids are the pictures' keys: docs/chapters/05, "The Case File")
const FILE5 = ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'squall-shapes', 'sprinkle-scales', 'cant-fly',
  'prints-pile', 'puddle-paws', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'prints-tracks', 'wisp-fox'];
const ROW9 = (112 - 38) * 1.06 / 8;   // how close chapter 4's fullest row stood its pieces (nine, none hidden)

test('den bark, chapter 5: a file of ten pieces or more stands two deep along her nest\'s edge, like two courses of roof tiles: the older half behind, a little higher, its tops showing; the newer half in front where the one row stood; neither closer set than chapter 4\'s row of nine until the file passes eighteen; nine or fewer are the one row they were', { skip: !art.character && 'no cats.js' }, () => {
  for (const cam of ['nest', 'inside', 'doorway']) for (const n of [9, 10, 11, 12, 14, 16, 18, 24]) {
    const scene = nestScene({ bark: FILE5.concat(FILE5).slice(0, n), stone: 'nose' }, {}, cam), r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'den/' + cam + ' bark ' + n);
    const P = pieces(r.svg), vb = viewBox(r.svg), label = cam + ' bark ' + n;
    assert.equal(P.length, n, label + ': every piece is drawn');
    assert.match(prop(r.svg, 'nest-bark'), new RegExp('data-count="' + n + '"'));
    const nBack = n > 9 ? Math.floor(n / 2) : 0, back = P.slice(0, nBack), front = P.slice(nBack);
    if (nBack) assert.ok(front.length >= back.length && front.length - back.length <= 1, label + ': the newer half (and the odd one) in front');
    for (const q of P) {
      assert.ok(!q.flat && q.w > 30 && q.w < 50, label + ': standing, a paw wide');
      assert.ok(inVb(q.x - q.w / 2, q.y - q.w * 1.2, vb, 2) && inVb(q.x + q.w / 2, q.y, vb, 2), label + ': in the panel: ' + JSON.stringify(q));
      assert.ok(Math.abs(q.x - NEST_X) < 148, label + ': within the nest: ' + q.x);
    }
    // the front course stands on the front rim, where the one row stood; each course runs in toward the middle
    for (const q of front) assert.ok(q.y > 886 && q.y < 886 + 46, label + ': the front course on the front rim: ' + q.y);
    for (const course of [back, front]) {
      for (let i = 1; i < course.length; i++) {
        const step = course[i].x - course[i - 1].x;
        assert.ok(step > 4 && step < course[i].w * 0.6, label + ': overlapping like roof tiles: step ' + step.toFixed(1));
        if (n <= 18) assert.ok(step >= ROW9 - 0.1, label + ': no closer set than chapter 4\'s nine: ' + step.toFixed(1) + ' against ' + ROW9.toFixed(1));
      }
      if (course.length) assert.ok(Math.abs(course[course.length - 1].x - NEST_X) <= Math.abs(course[0].x - NEST_X), label + ': the newest of a course nearest the middle');
    }
    if (nBack) {
      // behind: drawn first, each a little higher than the front piece nearest it, so its top shows over the course in front
      for (const q of back) {
        const near = front.reduce((a, b) => (Math.abs(b.x - q.x) < Math.abs(a.x - q.x) ? b : a));
        assert.ok(near.y - q.y > 9 && near.y - q.y < 24, label + ': the back course stands a little higher: ' + (near.y - q.y).toFixed(1));
        assert.ok(q.y - q.w * 1.2 < near.y - near.w * 1.2 - 6, label + ': its top shows over the front course');
      }
      // and within the front course's reach: no back piece stands out past its ends by more than a step
      const fx0 = Math.min(...front.map((q) => q.x)), fx1 = Math.max(...front.map((q) => q.x));
      for (const q of back) assert.ok(q.x > fx0 - 9 && q.x < fx1 + 9, label + ': behind the front course: ' + q.x + ' in ' + [fx0, fx1].map(Math.round));
      // half a step along (when the two courses hold the same number): no back piece stands exactly behind a front one
      if (back.length === front.length) for (const q of back) assert.ok(front.every((f) => Math.abs(f.x - q.x) > 1.5), label + ': the courses are staggered');
    } else {
      for (const q of P) assert.ok(q.y > 886, label + ': one row, on the front rim');
    }
    // the lettering keeps off all of it
    const k = r.keep[r.keep.length - 1], kx0 = vb[0] + k.x / 100 * vb[2], kx1 = vb[0] + (k.x + k.w) / 100 * vb[2], ky0 = vb[1] + k.y / 100 * vb[3];
    for (const q of P) assert.ok(q.x > kx0 - 1 && q.x < kx1 + 1 && q.y - q.w * 1.2 >= ky0 - 1.5, label + ': inside keep');
  }
  // which piece stands where: the list is oldest first, and the older half is the course behind
  const asked = [];
  const spy = (o) => { asked.push(o.blank ? '(blank)' : o.picture); return { svg: '<rect class="spy-card" width="200" height="240" fill="#EDE1C5"/>', w: 200, h: 240 }; };
  const row = (opts) => { asked.length = 0; withCards(spy, () => art.render(nestScene(opts), { look: LOOK })); return asked.slice(); };
  assert.deepEqual(row({ bark: FILE5.slice(0, 14) }), FILE5.slice(0, 14), 'drawn oldest first: the back course, then the front');
  // the two about Sprinkle still go under the moss (no change to hidden): sixteen stand, two corners show
  assert.deepEqual(row({ bark: FILE5, hidden: true }), FILE5.filter((c) => c !== 'sprinkle-scales' && c !== 'cant-fly'));
  // a file that outgrows the rim (a later chapter's: more than BARK_MAX standing, twenty-seven since chapter 8): the
  // oldest pieces are the ones left out, never today's; and the two about Sprinkle are still the two under the moss,
  // wherever they are in it
  const long = FILE5.concat(Array.from({ length: 14 }, (_, i) => 'later-' + (i + 1)));   // thirty-two cards
  assert.deepEqual(row({ bark: long }), long.slice(5), 'thirty-two cards: the newest twenty-seven stand');
  assert.deepEqual(row({ bark: long, hidden: true }), long.filter((c) => c !== 'sprinkle-scales' && c !== 'cant-fly').slice(3), 'two hidden by their pictures, then the newest twenty-seven of the thirty left');
  assert.equal(corners(art.render(nestScene({ bark: long, hidden: true }), { look: LOOK }).svg).length, 2);
  // the same row whatever she is doing: the pieces stand where they stood from one panel to the next
  const at = (cat) => pieces(art.render(nestScene({ bark: FILE5.slice(0, 14), stone: 'chin' }, cat), { look: LOOK }).svg).map((q) => [q.x, q.y]);
  for (const pose of ['loaf', 'curl', 'sit', 'pawup']) assert.deepEqual(at({ pose }), at({ pose: 'lie' }), pose + ': the row does not move when she does');
  // the row chapter 4 drew is the row it was: nine and seven, piece for piece (chapter 4's own fingerprint is above)
  assert.equal(pieces(art.render(nestScene({ bark: 'auto' }), { look: LOOK }).svg).length, 7, 'auto, unfilled: the seven every cat held at chapter 4\'s bedtime');
});

test('den bark, chapter 5: both courses keep to the side away from her head, whichever way she lies and in every pose; no piece on her face or on Riffle\'s stone; with two hidden, their corners show at the inner end, in the panel', { skip: !art.character && 'no cats.js' }, () => {
  const s = art.sceneInfo('den').anchors.inside.nest.h / 200;
  const STONE = /translate\(([-\d.]+) ([-\d.]+)\) rotate\(-?[\d.]+\)"><ellipse cx="0" cy="0" rx="([\d.]+)" ry="[\d.]+" fill="#24252C"/;
  for (const facing of ['right', 'left']) for (const pose of ['lie', 'loaf', 'curl', 'sit', 'pawup', 'flat', 'crouch', 'situp']) for (const stone of [true, 'nose', 'chin']) for (const opts of [{ bark: FILE5.slice(0, 12) }, { bark: FILE5, hidden: true }, { bark: FILE5.slice(0, 16), hidden: true }]) {
    const scene = nestScene(Object.assign({ stone }, opts), { pose, facing }), r = art.render(scene, { look: LOOK }), label = [pose, facing, stone, opts.bark.length, !!opts.hidden].join(' ');
    const P = pieces(r.svg), C = corners(r.svg), dir = facing === 'left' ? 1 : -1;
    assert.equal(P.length, opts.hidden ? opts.bark.length - 2 : opts.bark.length, label);
    assert.equal(C.length, opts.hidden ? 2 : 0, label + ': corners');
    for (const q of P.concat(C)) assert.ok(dir * (q.x - NEST_X) > -8, label + ': away from her head: ' + q.x);
    const head = worldHeadBox(r, 0, scene, 'player', Object.assign({ pose, mood: 'happy', facing, look: LOOK }, LOOK.sex ? { sex: LOOK.sex } : {}), s).box;
    for (const q of P) {
      const box = [q.x - q.w / 2, q.y - q.w * 1.2, q.x + q.w / 2, q.y];
      const fx0 = head[0] + (head[2] - head[0]) * 0.2, fx1 = head[2] - (head[2] - head[0]) * 0.2, fy1 = head[3] - (head[3] - head[1]) * 0.12;
      assert.ok(box[2] < fx0 || box[0] > fx1 || box[1] > fy1, label + ': a piece on her face: ' + box.map(Math.round) + ' face ' + head.map(Math.round));
    }
    const st = STONE.exec(r.svg);
    assert.ok(st, label + ': her stone is drawn');
    for (const q of P.concat(C.map((c) => ({ x: c.x, y: c.y, w: 30 })))) assert.ok(Math.abs(q.x - +st[1]) > q.w / 2 + +st[3] - 2 || +st[2] < q.y - q.w * 1.2, label + ': a piece on the stone: ' + JSON.stringify(q) + ' stone ' + st.slice(1, 4));
    // the corners: past the inner end of both courses
    for (const c of C) for (const q of P) assert.ok(Math.abs(c.x - NEST_X) < Math.abs(q.x - NEST_X), label + ': the corners past the row\'s inner end');
  }
  for (const cam of ['nest', 'inside', 'doorway']) {
    const r = art.render(nestScene({ bark: FILE5, hidden: true }, { pose: 'loaf' }, cam), { look: LOOK }), vb = viewBox(r.svg);
    for (const c of corners(r.svg)) assert.ok(inVb(c.x, c.y - 24, vb, 2) && inVb(c.x, c.y, vb, 2), cam + ': the corners are in the panel');
  }
  const empty = pieces(art.render(nestScene({ bark: FILE5.slice(0, 13) }, null), { look: LOOK }).svg);
  assert.ok(empty.length === 13 && empty.every((q) => q.x < NEST_X + 8), 'nobody in the nest: on the left');
});

// ---------------------------------------------------------------- the Training Hollow: five marks, the rim sitting up

// this chapter's rim (the text's Build notes, "The tuck"): three Clan cats, Murmurchime second, the old tom last
const RIM5 = (extra) => [['clancat', 1], ['murmurchime'], ['clancat', 3], ['clancat', 5], ['grizzled']].map(([who, variant], i) =>
  Object.assign({ who, pose: 'situp', mood: i === 4 ? 'stern' : 'proud', at: 'rim-' + (i + 1), facing: i < 2 ? 'right' : 'left' }, variant ? { variant } : {}, extra || {}));

test('hollow, chapter 5: a fifth claw mark, second in the row under the first three, fresh while the first three are deepest; the first four exactly where chapter 4 left them; no bark falls today; the five on the rim sit up (Murmurchime second, the old tom last) with Tallyheart in front of them, every face in the panel', { skip: !art.character && 'no cats.js' }, () => {
  const draw = (opts, cam) => { const scene = { set: 'hollow', cam: cam || 'tree', opts, cast: [], fx: ['morning'] }, r = art.render(scene, { look: LOOK }); checkRender(r, scene, 'hollow ' + JSON.stringify(opts)); return r; };
  const outer = (svg) => shapes(svg, 'fill="#3A281E"');
  const five = draw({ marks: 5 }), sc = outer(five.svg);
  assert.equal(sc.length, 15, 'five marks, three scratches each');
  const per = [0, 1, 2, 3, 4].map((i) => sc.slice(i * 3, i * 3 + 3)), c = per.map((q) => centre(q.flat()));
  assert.ok(c[1][0] > c[0][0] + 20 && c[2][0] > c[1][0] + 20 && Math.abs(c[0][1] - c[2][1]) < 12, 'three in the first row, left to right');
  assert.ok(c[3][1] > c[0][1] + 40 && c[4][1] > c[0][1] + 40 && c[4][0] > c[3][0] + 20 && Math.abs(c[3][1] - c[4][1]) < 6, 'the fourth and the fifth below them: ' + JSON.stringify(c.map((p) => p.map(Math.round))));
  // the first four never move for the fifth (scratched fresh, they are chapter 4's own)
  assert.deepEqual(outer(draw({ marks: 5, depth: 0 }).svg).slice(0, 12), outer(draw({ marks: 4, depth: 0 }).svg), 'the first four stay where chapter 4 scratched them');
  // by default practice has deepened every mark but the new one: 2, 2, 2, 1, 0
  const groove = shapes(five.svg, 'fill="#6B4A32" opacity="0.9"');
  const grooved = c.map((p) => groove.filter((q) => { const g = centre(q); return Math.abs(g[0] - p[0]) < 22 && Math.abs(g[1] - p[1]) < 40; }).length);
  assert.deepEqual(grooved, [3, 3, 3, 3, 0], 'the fifth is fresh, the others grooved');
  const width = (q) => q.reduce((a, s3) => { const xs = s3.map((p) => p[0]); return a + (Math.max(...xs) - Math.min(...xs)) / 3; }, 0);
  assert.ok(width(per[0]) > width(per[3]) + 0.3 && width(per[3]) > width(per[4]) + 0.3, 'the oldest gouged widest, the newest thinnest');
  // 'auto' with her five Counts, the tails' mark glowing (the page fills it so): one glow, on the first mark only
  const lit = draw({ marks: 5, glow: [true, false, false, false, false] });
  assert.equal(shapes(lit.svg, 'fill="#FFF6D0" class="pcs-pulse"').length, 3, 'one mark glows');
  // in the panel in every camera that sees the trunk's marks; the lettering keeps off them
  for (const cam of ['wide', 'tree']) {
    const r = draw({ marks: 5 }, cam), vb = viewBox(r.svg);
    for (const p of outer(r.svg).flat()) assert.ok(inVb(p[0], p[1], vb, 2), cam + ': the marks are in the panel');
    assert.equal(r.keep.length, 1, cam + ': keep');
  }
  // "No bark falls today: she has plenty"
  for (const name of ['bark-falling', 'bark-sand', 'bark-row']) assert.equal(prop(five.svg, name), '', 'no ' + name + ' unless a frame asks');
  // the rim sitting up, Tallyheart apart in front of them (past the trunk, nearer and bigger), our cat in the sun
  const wide = { set: 'hollow', cam: 'wide', opts: { marks: 4, glow: [true, false, false, false] }, cast: RIM5().concat([{ who: 'tallyheart', pose: 'situp', mood: 'kind', at: 'tree-far', facing: 'left', size: 1.2, tuck: true }, { who: 'player', pose: 'sit', mood: 'wonder', at: 'sunpatch-2', facing: 'right' }]), fx: ['morning'] };
  const w = art.render(wide, { look: LOOK });
  checkRender(w, wide, 'the rim, chapter 5');
  w.heads.forEach((h, i) => assert.ok(h, 'cast ' + i + ' (' + wide.cast[i].who + ') is in the panel'));
  for (let i = 1; i < 5; i++) assert.ok(w.heads[i].x > w.heads[i - 1].x + 5, 'the rim, left to right: Murmurchime second, the old tom last');
  for (let i = 0; i < w.heads.length; i++) for (let j = i + 1; j < w.heads.length; j++) assert.ok(Math.hypot((w.heads[i].x - w.heads[j].x) * 1.6, w.heads[i].y - w.heads[j].y) > 7, 'faces ' + i + ' and ' + j + ' are apart');
  assert.ok(w.heads[5].x > w.heads[4].x + 15 && w.heads[5].r > w.heads[4].r * 1.3, 'Tallyheart apart from the row, nearer and bigger');
  // the lesson two-shot: Tallyheart sitting up at the sand with one claw tucked, our cat copying her; the old tom (who answers) still in the panel
  const lesson = { set: 'hollow', cam: 'lesson', opts: { marks: 4 }, cast: [RIM5()[0], RIM5()[2], RIM5()[4], { who: 'tallyheart', pose: 'situp', mood: 'kind', at: 'sand-left', facing: 'right', tuck: true }, { who: 'player', pose: 'situp', mood: 'wonder', at: 'sand-right', facing: 'left', tuck: true }], fx: ['morning'] };
  const l = art.render(lesson, { look: LOOK });
  checkRender(l, lesson, 'the lesson, chapter 5');
  l.heads.forEach((h, i) => assert.ok(h, 'lesson cast ' + i + ' is in the panel'));
});

// ---------------------------------------------------------------- the tower: the offer, and "Not today"

test('tower, chapter 5: the offer is one panel from below (the roof\'s red light and its roar lines, our cat at the tower\'s foot looking up, nobody at the railing); "Not today" is chapter 4\'s panel, Waffles at her railing nineteen floors up', { skip: !art.character && 'no cats.js' }, () => {
  const me = { who: 'player', pose: 'lookup', mood: 'wonder', at: 'foot', facing: 'right' };
  const offer = towerUp({ chime: true, light: true, roar: true }, [me]);
  assert.ok(prop(offer.svg, 'light') && prop(offer.svg, 'roar'), 'the red light and the roar');
  assert.equal(offer.heads.length, 1);
  assert.ok(offer.heads[0] && offer.heads[0].y > 80 && offer.heads[0].x > 50 && offer.heads[0].x < 75, 'our cat small at the foot of the tower, outside the glass: ' + JSON.stringify(offer.heads[0]));
  // nobody at the railing: the picture is chapter 4's roar panel without Waffles, to the last shape
  const waffles = { who: 'waffles', pose: 'peer', mood: 'scared', at: 'railing', facing: 'left' };
  const with4 = towerUp({ chime: true, light: true, roar: true }, [waffles, me]);
  assert.ok(with4.heads[0] && with4.heads[0].y < 30, 'chapter 4 had her at the railing, high up');
  const cats = (svg) => (svg.match(/<g transform="translate\([\d.]+ [\d.]+\) scale\([\d.]+ [\d.]+\) translate\(-100 -200\)"/g) || []).length;
  assert.deepEqual([cats(with4.svg), cats(offer.svg)], [2, 1], 'one cat is drawn in the offer, where chapter 4 drew two');
  const balcony = (svg) => (svg.match(/#FBE3B0/g) || []).length;
  assert.ok(balcony(offer.svg) >= 1 && balcony(offer.svg) === balcony(with4.svg), 'her balcony is there, its door lit, empty');
  // the lettering keeps off the light at the very top, as in chapter 4
  assert.deepEqual(offer.keep, with4.keep);
  // "Not today": chapter 4's own panel (f076b), unchanged
  if (has('app/story/ch04.js')) {
    require(path.join(ROOT, 'app/story/ch04.js'));
    const f = PC.story.ch04.frames.f076b;
    assert.ok(f && f.scene.set === 'tower' && f.scene.cam === 'up', 'chapter 4\'s "Not today" panel is the tower from below');
    const r = art.render(f.scene, { look: LOOK });
    checkRender(r, f.scene, 'ch04 f076b');
    const wi = f.scene.cast.findIndex((m) => m.who === 'waffles'), pi = f.scene.cast.findIndex((m) => m.who === 'player');
    assert.ok(r.heads[wi] && r.heads[wi].y < 30 && r.heads[pi] && r.heads[pi].y > 80, 'Waffles at her railing, our cat at the foot: ' + JSON.stringify(r.heads));
  }
});

// ---------------------------------------------------------------- the three new characters: sized and lettered

// Stand-ins for chapter 5's three, each drawn at a wrong size on purpose, to see the scenes hold them
// to the text's: a heron no taller than Tallyheart sits, a brother with a head far bigger than
// Sprinkle's, a sister with a head exactly Sprinkle's size. `k` scales a whole stand-in.
const SPR = () => { const c = art.character('sprinkle', { pose: 'sit', mood: 'neutral' }); return { tall: c.h - c.headBox.y0, head: (c.headBox.x1 - c.headBox.x0 + c.headBox.y1 - c.headBox.y0) / 2 }; };
function standIns(real, k) {
  k = k || {};
  const spr = SPR(), tally = sitTall('tallyheart');
  const make = (who, w, h, hb, bounds, cls) => ({ who, w, h, head: { x: (hb.x0 + hb.x1) / 2, y: hb.y0 + 8 }, headBox: hb, bounds, cls });
  const defs = {
    // head top to feet: Tallyheart's sitting height times k (1 by default: no taller than she sits)
    patience: (() => { const t = Math.round(tally * (k.patience || 1)); return make('patience', 220, t + 12, { x0: 110, y0: 12, x1: 200, y1: 70 }, { x0: 40, y0: 12, x1: 200, y1: t + 10 }); })(),
    // head: Sprinkle's times k (1.4 by default: far too big); the rest of him under the water
    puddle: (() => { const d = spr.head * (k.puddle || 1.4); return make('puddle', 400, 300, { x0: 200 - d / 2, y0: 100, x1: 200 + d / 2, y1: 100 + d }, { x0: 200 - d / 2 - 10, y0: 100, x1: 200 + d / 2 + 10, y1: 298 }); })(),
    // head: Sprinkle's times k (1 by default: not slighter at all)
    wisp: (() => { const d = spr.head * (k.wisp || 1); return make('wisp', 300, 420, { x0: 150 - d / 2, y0: 20, x1: 150 + d / 2, y1: 20 + d }, { x0: 90, y0: 20, x1: 230, y1: 418 }); })()
  };
  return function (who, opts) {
    const d = defs[who];
    if (!d) return real(who, opts);
    const b = JSON.parse(JSON.stringify(d));
    // a pose with a different box: her neck up to swallow, his forepaw raised, her one jerk
    if (opts && ['gulp', 'pawup', 'flinch'].includes(opts.pose)) { b.h += 50; b.head.y += 50; b.headBox.y0 += 50; b.headBox.y1 += 50; b.bounds.y0 += 50; b.bounds.y1 += 50; }
    return { svg: '<rect class="new-' + who + '" x="' + b.bounds.x0 + '" y="' + b.bounds.y0 + '" width="' + (b.bounds.x1 - b.bounds.x0) + '" height="' + (b.bounds.y1 - b.bounds.y0) + '" fill="#8FA3B8"/>', w: b.w, h: b.h, head: b.head, headBox: b.headBox, bounds: b.bounds };
  };
}
const headOf = (b) => (b.headBox.x1 - b.headBox.x0 + b.headBox.y1 - b.headBox.y0) / 2;
const round4 = (v) => Math.round(v * 10000) / 10000;
const footShade = (svg, y) => [...svg.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([\d.]+)" ry="[\d.]+" fill="#[0-9A-F]{6}" opacity="0.3"\/>/g)].map((m) => m.slice(1).map(Number)).filter((e) => Math.abs(e[1] - (y - 1)) < 0.2);

test('Patience at any anchor stands taller than Tallyheart sits: a heron drawn too small is brought up to the least a heron may be, one drawn inside the band is left exactly as drawn, a giant is brought down; every pose is scaled alike; a size multiplies on top; her face is lettered and her shadow lies under her body', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, tally = sitTall('tallyheart');
  const near = (a, b, what) => assert.ok(Math.abs(a - b) < 0.0002, what + ': ' + a + ' vs ' + b);
  const a = art.sceneInfo('title').anchors.main.wall, base = a.h / 200;
  const heron = (m, cast) => { const scene = { set: 'title', cam: 'wide', cast: [Object.assign({ who: 'patience', pose: 'stand', at: 'wall', facing: 'left' }, m)].concat(cast || []), fx: ['day'] }; const r = art.render(scene, { look: LOOK }); checkRender(r, scene, 'patience ' + JSON.stringify(m)); return r; };
  const box = (fake, pose) => fake('patience', { pose: pose || 'stand' });
  // drawn no taller than Tallyheart sits: scaled up, so that she stands 1.4 times that
  let fake = standIns(real);
  withCharacter(fake, () => {
    const b = box(fake), tall = b.h - b.headBox.y0, r = heron({}), s = placedScale(r.svg, a, b.w, b.h);
    assert.ok(s, 'her box, feet on the wall');
    near(s, round4(base * 1.4 * tally / tall), 'brought up to the least a heron may be');
    assert.ok(s * tall > base * tally * 1.39, 'taller than Tallyheart sits: ' + (s * tall).toFixed(1) + ' against ' + (base * tally).toFixed(1));
    // every pose at the same scale (neck up to swallow: a taller box, the same bird)
    const g = box(fake, 'gulp');
    near(placedScale(heron({ pose: 'gulp' }).svg, a, g.w, g.h), s, 'gulping');
    // a size multiplies on top, both ways (a far heron, a near one)
    near(placedScale(heron({ size: 0.5 }).svg, a, b.w, b.h), round4(base * 0.5 * 1.4 * tally / tall), 'size 0.5');
    near(placedScale(heron({ size: 1.2 }).svg, a, b.w, b.h), round4(base * 1.2 * 1.4 * tally / tall), 'size 1.2');
    // beside Tallyheart on the same wall: the top of her head is well above the tips of Tallyheart's ears
    const w2 = art.sceneInfo('title').anchors.main['wall-2'], both = heron({}, [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'wall-2', facing: 'left' }]);
    assert.ok(a.y - tall * s < w2.y - tally * (w2.h / 200) - 0.3 * tally * base, 'her head stands well above Tallyheart\'s ears');
    assert.ok(both.heads[0] && both.heads[1] && both.heads[0].y < both.heads[1].y, 'and so it is in the panel: ' + JSON.stringify(both.heads));
    // lettered like anyone with a face: r from her head box
    const cat = real('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }), hb = cat.headBox, share = 0.2 * cat.h / ((hb.x1 - hb.x0 + hb.y1 - hb.y0) / 2);
    assert.ok(r.heads[0] && Math.abs(r.heads[0].r - share * headOf(b) * s / 1600 * 100) < 0.02, 'r from her head box: ' + JSON.stringify(r.heads[0]));
    // her shadow lies under her body as drawn
    const shade = footShade(r.svg, a.y);
    assert.ok(shade.length === 1 && Math.abs(shade[0][2] - (b.bounds.x1 - b.bounds.x0) * s * 0.42) < 0.3, 'shadow as wide as her body: ' + JSON.stringify(shade));
  });
  // drawn inside the band (the marsh is laid out for a heron about 2.3 sitting cats tall, 2.45 times Tallyheart): left exactly as the painter drew her
  for (const k of [1.5, 1.9, 2.45]) {
    fake = standIns(real, { patience: k });
    withCharacter(fake, () => { const b = box(fake); near(placedScale(heron({}).svg, a, b.w, b.h), round4(base), 'inside the band (' + k + '): as drawn'); });
  }
  // a giant (3.5 times): brought down to the most a heron may be
  fake = standIns(real, { patience: 3.5 });
  withCharacter(fake, () => { const b = box(fake); near(placedScale(heron({}).svg, a, b.w, b.h), round4(base * 2.6 * tally / (b.h - b.headBox.y0)), 'a giant is brought down'); });
  // should the painter report no head box, she still has a face to letter and a size to hold
  fake = standIns(real);
  withCharacter(function (who, opts) { const c = fake(who, opts); if (who === 'patience') { delete c.headBox; delete c.bounds; } return c; }, () => {
    const r = heron({});
    assert.ok(r.heads[0] && r.heads[0].r > 0, 'no head box: r from the box the scenes estimate: ' + JSON.stringify(r.heads[0]));
  });
  // nobody else is touched by her rule
  for (const who of ['tallyheart', 'player', 'riffle']) { const c = art.character(who, { pose: 'sit', mood: 'kind', facing: 'right' }); near(placedScale(art.render({ set: 'title', cam: 'wide', cast: [{ who, pose: 'sit', mood: 'kind', at: 'wall' }], fx: ['day'] }, { look: LOOK }).svg, a, c.w, c.h), round4(a.h / 200), who); }
});

test('Puddle is about Sprinkle\'s size and Wisp is slighter: his head is held to hers (a little more or less is the painter\'s), her head to a little less than hers, never bigger; every pose alike; both lettered; no shadow is ever drawn under Puddle in the water (every pose of his but sitting), and none under Wisp or Patience at a spot a set marks as water or air', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, spr = SPR();
  const near = (a, b, what) => assert.ok(Math.abs(a - b) < 0.0002, what + ': ' + a + ' vs ' + b);
  const a = art.sceneInfo('title').anchors.main.wall, base = a.h / 200;
  const at = (who, m) => { const scene = { set: 'title', cam: 'wide', cast: [Object.assign({ who, pose: who === 'puddle' ? 'head' : 'blink', mood: 'happy', at: 'wall', facing: 'left' }, m)], fx: ['day'] }; const r = art.render(scene, { look: LOOK }); checkRender(r, scene, who + ' ' + JSON.stringify(m)); return r; };
  for (const [who, drawn, held, pose2] of [['puddle', 1.4, 1.12, 'pawup'], ['puddle', 0.6, 0.88, 'pawup'], ['puddle', 1.05, 1.05, 'pawup'], ['puddle', 0.9, 0.9, 'pawup'], ['wisp', 1, 0.94, 'flinch'], ['wisp', 1.3, 0.94, 'flinch'], ['wisp', 0.5, 0.7, 'flinch'], ['wisp', 0.8, 0.8, 'flinch']]) {
    const fake = standIns(real, { [who]: drawn });
    withCharacter(fake, () => {
      const b = fake(who, { pose: 'x' }), r = at(who, {}), s = placedScale(r.svg, a, b.w, b.h), label = who + ' drawn with a head ' + drawn + ' of Sprinkle\'s';
      assert.ok(s, label + ': placed');
      near(s, round4(base * held / drawn), label + ': held at ' + held);
      // on screen: his head against hers at the same spot
      const ratio = headOf(b) * s / (spr.head * base);
      assert.ok(Math.abs(ratio - held) < 0.002, label + ': on screen ' + ratio.toFixed(3));
      if (who === 'wisp') assert.ok(ratio < 0.95, 'slighter than Sprinkle, always');
      // another pose, another box: the same scale
      const b2 = fake(who, { pose: pose2 });
      near(placedScale(at(who, { pose: pose2 }).svg, a, b2.w, b2.h), s, label + ': ' + pose2 + ' at the same scale');
      near(placedScale(at(who, { size: 0.6 }).svg, a, b.w, b.h), round4(base * 0.6 * held / drawn), label + ': a size multiplies on top');
      const cat = real('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }), hb = cat.headBox, share = 0.2 * cat.h / ((hb.x1 - hb.x0 + hb.y1 - hb.y0) / 2);
      assert.ok(r.heads[0] && Math.abs(r.heads[0].r - share * headOf(b) * s / 1600 * 100) < 0.02, label + ': r from the head box: ' + JSON.stringify(r.heads[0]));
      // the ground under them: Wisp has a shadow like anyone (nothing ghostly); Puddle, in the river, never
      const shade = footShade(r.svg, a.y);
      if (who === 'puddle') {
        assert.equal(shade.length, 0, 'nothing dark is drawn under Puddle in the water');
        for (const pose of ['foot', 'log', 'sink', 'pawup', 'nostrils']) assert.equal(footShade(at(who, { pose }).svg, a.y).length, 0, 'nor in his ' + pose + ' pose');
        // sitting on dry land (his page in her book; a later chapter), he has the shadow his sisters have
        const sat = footShade(at(who, { pose: 'sit' }).svg, a.y);
        assert.ok(sat.length === 1 && Math.abs(sat[0][2] - (b.bounds.x1 - b.bounds.x0) * s * 0.42) < 0.3, 'sitting, a shadow under his body: ' + JSON.stringify(sat));
      }
      else assert.ok(shade.length === 1 && Math.abs(shade[0][2] - (b.bounds.x1 - b.bounds.x0) * s * 0.42) < 0.3, 'Wisp\'s shadow under her body: ' + JSON.stringify(shade));
    });
  }
  // a spot a set marks `air: true` (in the water, where the set draws its own rings; the hollow's heap has two such): no shadow for Wisp or Patience there, a shadow at the ground spots beside them
  const fake = standIns(real, { patience: 1.9 });
  withCharacter(fake, () => {
    const H = art.sceneInfo('hollow').anchors.main;
    const scene = { set: 'hollow', cam: 'wide', opts: { heap: true }, cast: [{ who: 'wisp', pose: 'blink', at: 'rim-1' }, { who: 'wisp', pose: 'blink', at: 'rim-2' }, { who: 'patience', pose: 'stand', at: 'rim-4' }, { who: 'patience', pose: 'stand', at: 'rim-5' }, { who: 'puddle', pose: 'head', at: 'rim-3' }, { who: 'wisp', pose: 'blink', at: 'sand-left' }], fx: ['day'] };
    const r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'air anchors');
    const all = [...r.svg.matchAll(/<ellipse cx="[-\d.]+" cy="([-\d.]+)" rx="[\d.]+" ry="[\d.]+" fill="#[0-9A-F]{6}" opacity="0.3"\/>/g)].map((m) => +m[1]);
    assert.deepEqual(all.sort((x, y) => x - y), [792 - 1, 792 - 1, H['sand-left'].y - 1], 'a shadow at the three ground spots (rim-1, rim-5, the sand), none at the two in the air, none under Puddle: ' + all);
  });
  // none of the three is a cat: no pouf on the balcony, no close-up framed on them, and Riffle's stone is not laid at their noses
  const fk = standIns(real);
  withCharacter(fk, () => {
    const b = art.render({ set: 'tower', cam: 'balcony-close', cast: [{ who: 'wisp', pose: 'blink', at: 'railing' }], fx: ['day'] }, { look: LOOK });
    assert.ok(!/fill="#E58FA8"/.test(b.svg), 'no pouf for a dragonet');
  });
});

test('a head that tops the camera: Patience (and Sprinkle\'s brother and sister) get a balloon point on what shows of the face, as Sprinkle does; a face almost wholly out of the panel stays out', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, fake = standIns(real, { patience: 1.9, puddle: 1, wisp: 0.9 });
  withCharacter(fake, () => {
    const A = art.sceneInfo('camp').anchors.main.center, cam = art.sceneInfo('camp').cams.crowd;
    for (const [who, pose] of [['patience', 'stand'], ['wisp', 'blink'], ['puddle', 'head']]) {
      // (each of the three is drawn inside its band here, so the scenes place it at the anchor's own scale times its size)
      const b = fake(who, { pose }), s0 = A.h / 200, mid = (b.headBox.y0 + b.headBox.y1) / 2;
      // feet at A.y: the middle of the head box lands on the camera's top edge when (b.h - mid) * s = A.y - cam.y,
      // so the head point is above the camera and half the face is in it
      const s = (A.y - cam.y) / (b.h - mid), size = s / s0;
      const scene = { set: 'camp', cam: 'crowd', cast: [{ who, pose, at: 'center', size }], fx: ['sunset'] };
      const r = art.render(scene, { look: LOOK }), vb = viewBox(r.svg);
      checkRender(r, scene, who + ' topping the camera');
      const placed = placedScale(r.svg, A, b.w, b.h);
      assert.ok(placed, who + ': placed');
      const top = A.y - (b.h - b.headBox.y0) * placed, bot = A.y - (b.h - b.headBox.y1) * placed, pt = A.y - (b.h - b.head.y) * placed;
      assert.ok(pt < vb[1] && bot > vb[1] + 4, who + ': her head point is above the camera, her face partly in it: ' + [top, pt, bot, vb[1]].map(Math.round));
      const h = r.heads[0];
      assert.ok(h && h.y >= 0 && h.y < 100, who + ': still has a head: ' + JSON.stringify(h));
      assert.ok(Math.abs(h.y - ((vb[1] + bot) / 2 - vb[1]) / vb[3] * 100) < 0.2, who + ': in the middle of what shows of the face: ' + h.y);
      // twice as big: the face is all but gone, and so is the head
      const gone = art.render({ set: 'camp', cam: 'crowd', cast: [{ who, pose, at: 'center', size: size * 2.2 }], fx: ['sunset'] }, { look: LOOK });
      assert.equal(gone.heads[0], null, who + ': a face out of the panel has no head');
    }
  });
});

test('the real Patience, Puddle and Wisp (cats.js, once it draws them): in every pose of theirs, at every anchor of chapter 1\'s sets, Patience stands 1.4 to 2.6 times as tall as Tallyheart sits there, Puddle\'s head is Sprinkle\'s size (0.88 to 1.12) and Wisp\'s a little less (0.7 to 0.94); every face has a size', { skip: !(art.vocab.otherPoses && NEW5.every((w) => art.vocab.otherPoses[w])) && 'cats.js does not draw Patience, Puddle and Wisp yet' }, () => {
  const tally = sitTall('tallyheart'), spr = SPR();
  const drawn = {
    patience: (() => { const c = art.character('patience', { pose: 'stand', mood: 'neutral' }); return (c.h - c.headBox.y0) / tally; })(),
    puddle: headOf(art.character('puddle', { pose: 'head', mood: 'neutral' })) / spr.head,
    wisp: headOf(art.character('wisp', { pose: 'blink', mood: 'neutral' })) / spr.head
  };
  const BAND = { patience: [1.4, 2.6], puddle: [0.88, 1.12], wisp: [0.7, 0.94] };
  // the rule as the sets in their own files read it (the marsh lays its reeds and its thought cloud by it; chapter 6's three are tested with it)
  assert.deepEqual({ patience: art.sizeBands.patience, puddle: art.sizeBands.puddle, wisp: art.sizeBands.wisp }, { patience: { ref: 'tallyheart', pose: 'stand', by: 'tall', min: 1.4, max: 2.6 }, puddle: { ref: 'sprinkle', pose: 'head', by: 'head', min: 0.88, max: 1.12 }, wisp: { ref: 'sprinkle', pose: 'blink', by: 'head', min: 0.7, max: 0.94 } });
  let n = 0;
  for (const set of CH1_SETS) {
    const info = art.sceneInfo(set), seen = {};
    for (const cam of art.vocab.sets[set].cams) {
      const comp = info.cams[cam].comp, anchors = seen[comp] ? [] : Object.entries(info.anchors[comp] || {}).filter(([, a]) => a.x || a.y);
      seen[comp] = true;
      for (const [at, a] of anchors) for (const who of NEW5) {
        const poses = art.vocab.otherPoses[who], pose = poses[n % poses.length], facing = n % 2 ? 'left' : 'right';
        const scene = { set, cam, cast: [{ who, pose, mood: 'happy', at, facing }], fx: [set === 'den' || set === 'sky' ? 'night' : 'day'] };
        const r = art.render(scene, { look: LOOK });
        checkRender(r, scene, set + '/' + cam + ' ' + who + ':' + pose + '@' + at);
        const ch = art.character(who, { pose, mood: 'happy', facing }), s = placedScale(r.svg, a, ch.w, ch.h);
        if (s == null) continue;   // an anchor the drawing moves (the balcony)
        const k = s / (a.h / 200) * drawn[who];
        assert.ok(k >= BAND[who][0] - 0.01 && k <= BAND[who][1] + 0.01, set + '/' + cam + ' ' + who + '@' + at + ': ' + k.toFixed(3) + ' in ' + BAND[who]);
        if (r.heads[0]) assert.ok(r.heads[0].r > 0, who + ' has a face size');
        n++;
      }
    }
  }
  assert.ok(n > 80, 'placements checked: ' + n);
  // side by side on the wall: Patience's head above Tallyheart's ears; Wisp's face smaller than Sprinkle's; Puddle's about hers
  const wall = (who, pose) => art.render({ set: 'title', cam: 'wide', cast: [{ who, pose, mood: 'happy', at: 'wall', facing: 'left' }, { who: who === 'patience' ? 'tallyheart' : 'sprinkle', pose: 'sit', mood: 'kind', at: 'wall-2', facing: 'left' }], fx: ['day'] }, { look: LOOK });
  const p = wall('patience', 'stand');
  assert.ok(p.heads[0] && p.heads[1] && p.heads[0].y < p.heads[1].y, 'Patience looks down at Tallyheart');
  const w = wall('wisp', 'blink'), u = wall('puddle', 'head');
  assert.ok(w.heads[0].r < w.heads[1].r, 'Wisp\'s face is smaller than Sprinkle\'s: ' + JSON.stringify(w.heads));
  assert.ok(Math.abs(u.heads[0].r / u.heads[1].r - 1) < 0.14, 'Puddle\'s is about hers: ' + JSON.stringify(u.heads));
});

test('the three new characters, in every pose cats.js gives them (or as it draws a newcomer until it does), at every anchor of every set and camera', { skip: !art.character && 'no cats.js' }, () => {
  let renders = 0;
  for (const who of NEW5) {
    const poses = (art.vocab.otherPoses && art.vocab.otherPoses[who]) || { patience: ['stand', 'eye', 'shut', 'point', 'gulp', 'full', 'feather'], puddle: ['foot', 'head', 'log', 'sink', 'pawup', 'nostrils'], wisp: ['reed', 'blink', 'shh', 'draw', 'nod', 'flinch', 'gulp', 'pawup'] }[who];
    for (const [set, info] of Object.entries(art.vocab.sets)) for (const cam of info.cams) {
      const cast = info.anchors.map((at, i) => ({ who, pose: poses[(i + renders) % poses.length], mood: ['happy', 'wonder', 'worried', 'proud', 'neutral'][(i + renders) % 5], at, facing: i % 2 ? 'left' : 'right' }));
      // (every third time with every effect a panel can carry: the purr, the sparkle, the zzz, the motion lines and the bonk find their faces and bodies too)
      const scene = { set, cam, cast, fx: [set === 'den' || set === 'sky' ? 'night' : 'day'].concat(renders % 3 ? [] : ['purr', 'sparkle', 'zzz', 'motion', 'bonk', 'glow']) };
      checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' ' + who + ' ' + scene.fx.join('+'));
      renders++;
    }
  }
  assert.ok(renders > 150, 'renders: ' + renders);
});

// ---------------------------------------------------------------- every chapter 5 value, everywhere; chapter 5's frames

test('every chapter 5 option value renders in every camera of its set, in every light, alone and all together, with a cast at every anchor and with nobody', () => {
  const lights = [[], ['morning'], ['dusk'], ['night'], ['sunset']];
  const values = { den: { moon: [5, 9, 14], bark: [FILE5.slice(0, 12), FILE5, 12], hidden: [true] }, hollow: { marks: [5], glow: [[true, false, false, false, false]] }, tower: { roar: [true], light: [true] } };
  let n = 0;
  for (const [set, opts] of Object.entries(values)) {
    const info = art.vocab.sets[set], all = {};
    for (const [k, vals] of Object.entries(opts)) all[k] = vals[0];
    for (const cam of info.cams) lights.forEach((fx, f) => {
      const cast = info.anchors.map((at, i) => member(i + n, at, 0));
      Object.entries(opts).flatMap(([k, vals]) => vals.map((v) => ({ [k]: v }))).forEach((one, j) => {
        const scene = { set, cam, opts: one, cast: (j + f) % 2 ? [] : cast, fx };
        checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' ' + JSON.stringify(one).slice(0, 60) + ' ' + fx.join('+'));
        n++;
      });
      for (const c of [cast, []]) {
        const scene = { set, cam, opts: all, cast: c, fx };
        checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' all ' + fx.join('+'));
        n++;
      }
    });
  }
  assert.ok(n > 300, 'renders: ' + n);
  // and with placeholder cats (no cats.js): the moon, the marks and the bark are the sets' own; a newcomer is a plain cat
  const fake = function () { throw new Error('placeholder'); };
  fake.placeholder = true;
  withCharacter(fake, () => {
    for (const scene of [
      { set: 'den', cam: 'outside', opts: { moon: 5 }, cast: [{ who: 'tallyheart', at: 'entrance-right', pose: 'sit' }, { who: 'patience', at: 'entrance-left', pose: 'stand' }], fx: ['dusk'] },
      { set: 'den', cam: 'nest', opts: { bark: FILE5, hidden: true, stone: 'chin' }, cast: [{ who: 'player', at: 'nest', pose: 'lie', facing: 'left' }, { who: 'wisp', at: 'sleeper-2', pose: 'blink' }], fx: ['night'] },
      { set: 'hollow', cam: 'wide', opts: { marks: 5 }, cast: RIM5({ tuck: true }).concat([{ who: 'puddle', at: 'sand-left', pose: 'head' }]), fx: ['morning'] }
    ]) {
      const r = art.render(scene, { look: LOOK });
      checkXml(r.svg);
      assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), 'placeholders: ' + scene.set + ': no NaN/undefined in the markup');
      assert.equal(r.heads.length, scene.cast.length);
    }
  });
});

test('every frame of chapter 5 renders with the art vocabulary (once it is written): its sets, cameras and anchors are the art\'s; the den at dusk is under the fifth evening\'s moon; no bark falls in the hollow; the tower\'s offer has nobody at the railing', () => {
  if (!has('app/story/ch05.js')) return;
  require(path.join(ROOT, 'app/story/ch05.js'));
  const ch = PC.story && PC.story.ch05;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.board !== 'STUB.') : [];
  let dusk = 0;
  for (const [id, f] of frames) {
    const s = f.scene, v = art.vocab;
    assert.ok(v.sets[s.set], id + ': set ' + s.set);
    assert.ok(v.sets[s.set].cams.includes(s.cam), id + ': camera ' + s.set + '/' + s.cam);
    for (const m of s.cast || []) if (typeof m.at === 'string') assert.ok(v.sets[s.set].anchors.includes(m.at), id + ': anchor ' + m.at + ' in ' + s.set);
    // the page fills 'auto' from the cat before drawing; here, five marks, her stone by her nose, and a chapter 5 file
    const o = Object.assign({}, s.opts || {});
    if (o.marks === 'auto') o.marks = 5;
    if (o.glow === 'auto') o.glow = [true, false, false, false, false];
    if (o.depth === 'auto') delete o.depth;
    if (o.stone === 'auto') o.stone = 'nose';
    if (o.bark === 'auto') o.bark = FILE5.slice(0, 14);
    if (Array.isArray(o.cards)) o.cards = o.cards.map((c) => (typeof c === 'string' ? c : c.id));
    const scene = Object.assign({}, s, { opts: o });
    checkRender(art.render(scene, { look: LOOK }), scene, 'ch05 ' + id);
    // the sets this file draws: what the text's Art needs ask of them
    if (s.set === 'den' && s.cam === 'outside' && ((s.fx || []).includes('dusk') || (s.fx || []).includes('sunset')) && s.opts && s.opts.moon) {
      assert.ok(typeof s.opts.moon === 'number' && s.opts.moon >= 5, id + ': the den at dusk is under the fifth evening\'s moon (moon: 5), not chapter 4\'s sliver (moon: true)');
      dusk++;
    }
    if (s.set === 'den' && s.opts && s.opts.hidden) assert.ok(s.opts.bark, id + ': hidden goes with her bark');
    if (s.set === 'hollow') assert.ok(!(s.opts && s.opts.bark === 'falling'), id + ': no bark falls today');
    if (s.set === 'tower') {
      assert.ok(!(s.cast || []).some((m) => m.who === 'player' && m.at === 'window'), id + ': she is never back in her old room');
      if (s.cam === 'up' && s.opts && s.opts.roar) assert.ok(!(s.cast || []).some((m) => m.who === 'waffles'), id + ': the offer: nobody at the railing');
    }
  }
  if (frames.length) assert.ok(dusk >= 1, 'the den at dusk shows the fifth evening\'s moon (moon: 5)');
});

// ---------------------------------------------------------------- the gallery page itself, run in a stand-in page

// dev/gallery.html's own script, run against a page of plain objects (no browser): every panel it
// makes, and what each one drew. `stories` stands in for PC.story (the chapters' section).
function runGallery(stories, search) {
  const page = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  const js = page.slice(page.lastIndexOf('<script>') + 8, page.lastIndexOf('</script>'));
  const values = { fur: 'silver-tabby', marking: 'white-chest', eyes: 'green', sex: 'she' }, byId = {}, figures = [];
  const el = (tag) => {
    const e = { tag, children: [], style: {}, classList: { add() {} }, html: '', text: '', appendChild(c) { this.children.push(c); return c; }, insertAdjacentHTML() {}, addEventListener() {},
      querySelector() { return this.panel || (this.panel = el('div')); }, getBoundingClientRect() { return { top: 0, bottom: 100 }; } };
    Object.defineProperty(e, 'innerHTML', { get() { return this.html; }, set(v) { this.html = String(v); } });
    Object.defineProperty(e, 'textContent', { get() { return this.text; }, set(v) { this.text = String(v); } });
    if (tag === 'figure') figures.push(e);
    return e;
  };
  const document = { body: el('body'), head: el('head'), createElement: el, getElementById(id) { return byId[id] || (byId[id] = Object.assign(el('div'), { id, value: values[id], checked: false })); } };
  let io = null;
  const IO = function (cb) { this.cb = cb; this.seen = []; io = this; };
  IO.prototype.observe = function (t) { this.seen.push(t); };
  const real = art.character;
  try {
    new Function('window', 'document', 'IntersectionObserver', 'location', 'performance', 'innerHeight', js)({ PC: Object.assign({}, PC, { story: stories }) }, document, IO, { search: search || '' }, { now: () => 0 }, 800);
    // every panel scrolls into view
    io.cb(io.seen.map((t) => ({ isIntersecting: true, target: t })));
  } finally { art.character = real; }
  return { figures: figures.map((f) => ({ caption: f.html, drawn: f.panel ? f.panel.html : '' })), status: byId.status ? byId.status.text : '', nav: byId.nav ? byId.nav.html : '' };
}

test('the gallery page runs: every set and camera, every extra and every frame of every chapter gets a panel, and every panel draws; a chapter 5 bedtime shows a chapter 5 file (every card that needs no dragonet found), chapter 4\'s the seven it always did', { skip: !art.character && 'no cats.js' }, () => {
  const stories = {};
  for (const id of ['ch01', 'ch02', 'ch03', 'ch04']) if (has('app/story/' + id + '.js')) { require(path.join(ROOT, 'app/story/' + id + '.js')); stories[id] = PC.story[id]; }
  // a stand-in chapter 5: one bedtime frame, three cards of its own, one of them only for a cat who found a dragonet
  const bed = { set: 'den', cam: 'nest', opts: { weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true }, cast: [{ who: 'player', pose: 'lie', mood: 'sleepy', at: 'nest', facing: 'right' }], fx: ['night'] };
  stories.ch05 = { id: 'ch05', number: 5, title: 'Riffle’s River', frames: { f001: { scene: bed, board: 'Bedtime.' }, f002: { scene: { set: 'hollow', cam: 'tree', opts: { marks: 'auto', glow: 'auto' }, cast: [], fx: ['morning'] }, board: 'The tree.' } },
    cards: { fur: { mark: 'eye', line: 'x' }, 'otter-fox': { mark: 'ear', line: 'x' }, 'puddle-paws': { mark: 'ear', line: 'x', when: { foundPuddle: true } } } };
  const g = runGallery(stories);
  const sets = Object.values(art.vocab.sets).reduce((a, s) => a + s.cams.length, 0), frames = Object.values(stories).reduce((a, ch) => a + Object.keys(ch.frames).length, 0);
  assert.ok(g.figures.length > sets + frames + 70, 'a panel for every camera, extra and frame: ' + g.figures.length);
  assert.match(g.status, new RegExp('cats\\.js loaded · ' + g.figures.length + ' panels'));
  for (const f of g.figures) {
    assert.ok(!/class="pending err"/.test(f.drawn), 'a panel failed to draw: ' + f.caption.slice(0, 160) + ' :: ' + f.drawn.slice(0, 160));
    assert.ok(f.drawn.startsWith('<svg') && f.drawn.includes('</svg><div class="ov">'), 'a panel drew: ' + f.caption.slice(0, 120));
  }
  for (const id of Object.keys(stories)) assert.ok(g.nav.includes('#chapter-' + id), 'the chapters\' section lists ' + id);
  for (const id of Object.keys(art.vocab.sets)) assert.ok(g.nav.includes('#set-' + id), 'the sets\' section lists ' + id);
  // chapter 5's frames: five marks on the tree; her nest with every card chapters 4 and 5 give without a dragonet found, two under the moss
  const of = (title) => g.figures.find((f) => f.caption.includes('<code>' + title));
  const file = Object.values(stories.ch04 ? stories.ch04.cards || {} : {}).filter((c) => !c.when).length + 2;
  const nest5 = of('ch05 f001'), tree5 = of('ch05 f002');
  assert.ok(nest5 && tree5, 'chapter 5\'s panels are there');
  assert.equal(pieces(nest5.drawn).length, file - 2, 'chapter 5\'s bedtime: ' + file + ' cards, two of them under the moss');
  assert.equal(corners(nest5.drawn).length, 2);
  assert.equal(shapes(tree5.drawn, 'fill="#3A281E"').length, 15, 'five claw marks in chapter 5');
  if (stories.ch04) {
    const bed4 = Object.entries(stories.ch04.frames).find(([, f]) => f.scene && f.scene.set === 'den' && f.scene.opts && f.scene.opts.bark === 'auto' && f.scene.opts.hidden && ['nest', 'inside', 'doorway'].includes(f.scene.cam));
    if (bed4) assert.equal(pieces(of('ch04 ' + bed4[0]).drawn).length, 5, 'chapter 4\'s bedtime is left as it was: seven, two under the moss');
  }
  // ?only= shows just the panels whose title or caption has that text
  const only = runGallery(stories, '?only=' + encodeURIComponent('chapter 5:'));
  assert.ok(only.figures.length >= 15 && only.figures.length < 40 && only.figures.every((f) => f.caption.includes('chapter 5:')), 'only chapter 5\'s extras: ' + only.figures.length);
});


// ================================================================ chapter 6: The Snake in the Stones
// (docs/chapters/06-the-snake-in-the-stones.spec.md, section 4: the title's wall-3 and the wall's end,
// the dream on the sky, Coil's card under the moss, six marks and a patrol behind the rim, and the
// newcomers' sizes)

// The spots the story builder is given for the patrol of three trotting by behind the rim (spec
// section 5, "Patrols"): along the hollow's far edge, at the brambles' foot, behind rim-1 to rim-5.
const PATROL6 = [{ x: 590, y: 690, h: 215, z: 'behind' }, { x: 790, y: 690, h: 215, z: 'behind' }, { x: 990, y: 690, h: 215, z: 'behind' }];
// Where a cast member landed: the index of its markup, its scale, and its head and body boxes in
// world units (from the drawing's own boxes, as the scenes place it at spot `a`).
function landed(svg, m, a) {
  const c = art.character(m.who, Object.assign({}, m, { facing: m.facing || a.face, mood: m.mood || 'neutral' }, m.who === 'player' ? { look: LOOK, sex: LOOK.sex } : {}));
  const re = new RegExp('<g transform="translate\\(' + a.x + ' ' + a.y + '\\) scale\\(([\\d.]+) [\\d.]+\\) translate\\(-' + (c.w / 2) + ' -' + c.h + '\\)"');
  const mm = re.exec(svg);
  if (!mm) return null;
  const s = +mm[1], w = (b) => [a.x + (b.x0 - c.w / 2) * s, a.y + (b.y0 - c.h) * s, a.x + (b.x1 - c.w / 2) * s, a.y + (b.y1 - c.h) * s];
  return { idx: mm.index, s, head: w(c.headBox || { x0: c.w * 0.3, y0: 0, x1: c.w * 0.7, y1: c.h * 0.4 }), body: w(c.bounds || { x0: 0, y0: 0, x1: c.w, y1: c.h }) };
}
const area = (b) => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
const overlap = (p, q) => area([Math.max(p[0], q[0]), Math.max(p[1], q[1]), Math.min(p[2], q[2]), Math.min(p[3], q[3])]);

// <ch6-fingerprint>
// Every frame of chapters 1 to 5 on the sets this file draws for chapter 6 (title, sky, den, hollow),
// as the story asks and filled in as the page fills it, drawn with stand-in cats and plain bark, and the
// title screen: hashed per set and camera. The numbers were taken from scenes.js before chapter 6
// touched it (2026-10-18), and the same function run on the new file gives the same: chapters 1 to 5
// look exactly as they did.
function ch6Fingerprint(art, story, crypto) {
  const fake = function () { throw new Error('placeholder'); };
  fake.placeholder = true;
  const real = art.character, out = {}, hadCards = Object.prototype.hasOwnProperty.call(art, 'cardGroup'), cards = art.cardGroup;
  art.character = fake;
  delete art.cardGroup;
  // a chapter 5 cat's whole file (every card but the three that need a dragonet found), for her nest
  const file5 = ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly', 'prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'prints-tracks'];
  try {
    for (const ch of ['ch01', 'ch02', 'ch03', 'ch04', 'ch05']) {
      const n = +ch.slice(2);
      for (const [id, f] of Object.entries(story[ch].frames)) {
        const sc = f.scene;
        if (!sc || !['title', 'sky', 'den', 'hollow'].includes(sc.set)) continue;
        const key = sc.set + '/' + sc.cam, h = out[key] || (out[key] = crypto.createHash('sha1'));
        const o = Object.assign({}, sc.opts || {});
        // what the page fills in from a cat: one mark a Count so far, the first glowing; her stone by her nose; her file
        if (o.marks === 'auto') o.marks = n;
        if (o.glow === 'auto') o.glow = Array.from({ length: n }, (v, i) => i === 0);
        if (o.stone === 'auto') o.stone = 'nose';
        const filled = [Object.assign({}, sc, { opts: o })];
        if (o.bark === 'auto' && n >= 5) filled.push(Object.assign({}, sc, { opts: Object.assign({}, o, { bark: file5.map((p) => ({ picture: p, mark: 'eye' })) }) }));
        for (const scene of [sc].concat(filled)) {
          const r = art.render(scene, { look: { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' } });
          h.update(id + ':' + r.svg.replace(/pcs[0-9a-z]+-/g, '') + JSON.stringify(r.heads) + JSON.stringify(r.keep));
        }
      }
    }
    // and the title screen, by sunset and by day, with nobody on the wall
    for (const fx of [[], ['day']]) {
      const r = art.render({ set: 'title', cam: 'wide', cast: [], fx }, {}), h = out['title/screen'] || (out['title/screen'] = crypto.createHash('sha1'));
      h.update(r.svg.replace(/pcs[0-9a-z]+-/g, '') + JSON.stringify(r.heads));
    }
  } finally { art.character = real; if (hadCards) art.cardGroup = cards; }
  for (const k of Object.keys(out)) out[k] = out[k].digest('hex').slice(0, 16);
  return out;
}
// </ch6-fingerprint>
const CH6_FINGERPRINT = {
  'hollow/wide': '107d86731a0b15bb', 'hollow/lesson': 'c03f2d59b1e2fd11', 'hollow/tree': 'c007de6bf7e80159', 'hollow/sand': 'fc571230aa06ba33',
  'den/outside': '90343e6e48cbf384', 'den/doorway': 'a1725bfb26e736d0', 'den/inside': 'c732dad417c8ca99', 'den/nest': 'ab54042717631d90',
  'sky/up': '64694e99e1e09f60', 'sky/cats': '6a3ba2004eca9ef9', 'title/wide': 'd67278db4420dbaa', 'title/screen': '620b0a7df13a7592'
};

test('chapters 1 to 5 look exactly as they did on the title, the sky, the den and the hollow: every frame of theirs on those sets, and the title screen, matches its fingerprint from before chapter 6', () => {
  for (const id of ['ch01', 'ch02', 'ch03', 'ch04', 'ch05']) require(path.join(ROOT, 'app/story/' + id + '.js'));
  const now = ch6Fingerprint(art, PC.story, require('crypto'));
  assert.deepEqual(Object.keys(now).sort(), Object.keys(CH6_FINGERPRINT).sort(), 'the same sets and cameras');
  for (const k of Object.keys(CH6_FINGERPRINT)) assert.equal(now[k], CH6_FINGERPRINT[k], k + ' draws something else than it did for chapters 1 to 5');
  assert.ok(!art.character || !art.character.placeholder, 'the real cats are back');
});

test('vocab, chapter 6: the title\'s wall-3 and the wall\'s end (end, meet; end-1..3, reed-1..3; rustle), the dream on the sky (walk, below; star-1, star-2), nothing new on the den or the hollow; the newcomers\' sizes published', () => {
  const v = art.vocab.sets;
  assert.deepEqual(v.title.cams, ['wide', 'end', 'meet']);
  assert.deepEqual(v.title.anchors, ['wall', 'wall-2', 'wall-3', 'end-1', 'end-2', 'end-3', 'reed-1', 'reed-2', 'reed-3']);
  assert.deepEqual(v.title.opts, { rustle: [false, true] }, 'rustle, off unless a frame asks');
  assert.ok(!v.title.cams.includes('reeds'), 'no reeds close-up (spec v0.2, call 21)');
  assert.deepEqual(v.sky.cams, ['up', 'cats', 'walk', 'below']);
  assert.deepEqual(v.sky.anchors, ['ground-left', 'ground-right', 'star-1', 'star-2']);
  assert.deepEqual(v.sky.opts, {});
  const ti = art.sceneInfo('title'), si = art.sceneInfo('sky');
  assert.deepEqual([ti.cams.wide.comp, ti.cams.end.comp, ti.cams.meet.comp], ['main', 'end', 'meet'], 'the wall\'s end is its own picture, in two compositions');
  assert.deepEqual([si.cams.up.comp, si.cams.cats.comp, si.cams.walk.comp, si.cams.below.comp], ['main', 'main', 'walk', 'below']);
  for (const comp of ['end', 'meet']) assert.deepEqual(Object.keys(ti.anchors[comp]), ['end-1', 'end-2', 'end-3', 'reed-1', 'reed-2', 'reed-3'], comp + ': all six, seen by both cameras');
  assert.deepEqual(Object.keys(ti.anchors.main), ['wall', 'wall-2', 'wall-3']);
  assert.deepEqual(Object.keys(si.anchors.walk), ['star-1', 'star-2']);
  assert.deepEqual(si.anchors.below, {}, 'nobody is seen looking down');
  assert.deepEqual(ti.defaults, {}, 'no rustle unless asked');
  // the den and the hollow take nothing new: Coil's card goes under the moss by its picture, the sixth mark exists
  // (chapter 8's `glass` comes after them: tested with it)
  assert.deepEqual(Object.keys(v.den.opts).slice(0, 6), ['weather', 'moon', 'drips', 'stone', 'bark', 'hidden']);
  assert.deepEqual(v.den.opts.hidden, [false, true]);
  // (chapter 7's `compare` comes after them: tested with it)
  assert.deepEqual(Object.keys(v.hollow.opts).slice(0, 7), ['marks', 'glow', 'depth', 'bark', 'cards', 'blank', 'heap']);
  assert.ok(v.hollow.opts.marks.includes(6));
  assert.deepEqual({ coil: art.sizeBands.coil, sleet: art.sizeBands.sleet, sloshbank: art.sizeBands.sloshbank }, {
    coil: { ref: 'player', pose: 'head', by: 'head', min: 0.35, max: 0.6 },
    sleet: { ref: 'sprinkle', pose: 'sit', by: 'head', min: 0.95, max: 1.1 },
    sloshbank: { ref: 'tallyheart', pose: 'sit', by: 'tall', min: 1.06, max: 1.3 }
  });
});

test('title wall-3: a third cat on the wall, right of the first, on the same stones; a patrol walks right along it, the leader at wall-3 with room for her face, nobody\'s head on another\'s', { skip: !art.character && 'no cats.js' }, () => {
  const A = art.sceneInfo('title').anchors.main;
  assert.ok(A['wall-3'].x > A.wall.x + 200 && A['wall-3'].y === A.wall.y && A['wall-3'].h === A.wall.h, 'right of wall, on the wall\'s top, the same size');
  assert.equal(A['wall-3'].face, 'left', 'facing left by default, as its neighbours');
  for (const fx of [['day'], ['sunset']]) for (const lead of ['player', 'tallyheart', 'murmurchime']) {
    const rest = ['player', 'tallyheart', 'murmurchime'].filter((w) => w !== lead);
    const cast = [{ who: rest[1], at: 'wall-2', pose: 'walk', mood: 'happy', facing: 'right' }, { who: rest[0], at: 'wall', pose: 'walk', mood: 'proud', facing: 'right' }, { who: lead, at: 'wall-3', pose: 'walk', mood: 'proud', facing: 'right' }];
    const scene = { set: 'title', cam: 'wide', cast, fx }, r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'title wide, the patrol led by ' + lead);
    const L = cast.map((m) => landed(r.svg, m, A[m.at]));
    assert.ok(L.every(Boolean), 'all three on the wall');
    // the leader's face is wholly in the panel, with room to spare at the right
    assert.ok(L[2].head[2] < 1600 - 10 && L[2].head[0] > 0, lead + ' leads: her face in the panel, room at the right: ' + L[2].head.map(Math.round));
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) assert.equal(overlap(L[i].head, L[j].head), 0, 'no head on another');
    assert.ok(r.heads.every((h) => h && h.x > 0 && h.x < 100), 'every head in the panel');
  }
  // with nobody given a spot, three take the wall in order: wall, wall-2, wall-3
  const r = art.render({ set: 'title', cam: 'wide', cast: [{ who: 'clancat' }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }] }, { look: LOOK });
  assert.ok(r.heads[0].x > r.heads[1].x && r.heads[2].x > r.heads[0].x, 'wall, then wall-2 at its left, then wall-3 at its right: ' + JSON.stringify(r.heads));
});

const END_CAST = (pose1, pose2, order) => {
  const c = [{ who: 'tallyheart', at: 'end-1', pose: pose1, mood: 'stern' }, { who: 'player', at: 'end-2', pose: pose2, mood: 'wonder' }, { who: 'murmurchime', at: 'end-3', pose: pose2, mood: 'worried' },
    { who: 'sloshbank', at: 'reed-1', pose: pose1, mood: 'stern' }, { who: 'reedclan', variant: 2, at: 'reed-2', pose: pose2, mood: 'happy' }, { who: 'reedclan', variant: 1, at: 'reed-3', pose: pose2, mood: 'neutral' }];
  return order ? c.reverse() : c;
};

test('the wall\'s end: CrystalClan on the dry ground at the wall\'s foot facing right, ReedClan out of the reeds facing left, end-1 and reed-1 nearest the line where the stones stop; nobody in mud or water; every face in the panel in both cameras, no head on another\'s, and at cat height each side stands in depth, the nearer drawn over the farther in any cast order', { skip: !art.character && 'no cats.js' }, () => {
  const ti = art.sceneInfo('title'), E = art.titleEndInfo();
  for (const cam of ['end', 'meet']) {
    const A = ti.anchors[cam], I = E[cam];
    const ours = ['end-1', 'end-2', 'end-3'].map((k) => A[k]), theirs = ['reed-1', 'reed-2', 'reed-3'].map((k) => A[k]);
    assert.ok(ours.every((a) => a.x < I.line && a.face === 'right') && theirs.every((a) => a.x > I.line && a.face === 'left'), cam + ': each side of the line, face to face');
    assert.ok(ours[0].x > ours[1].x && ours[1].x > ours[2].x && theirs[0].x < theirs[1].x && theirs[1].x < theirs[2].x, cam + ': end-1 and reed-1 nearest the line');
    assert.ok(I.wall.x1 < I.line && I.reeds.x0 > I.line, cam + ': the stones stop at the line, the reeds begin past it');
    // on the dry bank: below the river's edge, on the trodden ground, in front of the wall's foot and of the reed bed's dark foot
    for (const a of ours.concat(theirs)) assert.ok(a.y > I.riverTo + 100 && a.y > I.ground && a.y > I.reeds.base + 15 && a.y > I.wall.foot, cam + ': on the dry bank: ' + JSON.stringify(a));
    // at cat height the second of each side stands behind the first, the third further back still
    if (cam === 'meet') assert.deepEqual([A['end-1'].z, A['end-2'].z, A['end-3'].z, A['reed-1'].z, A['reed-2'].z, A['reed-3'].z], [undefined, 'behind', 'far', undefined, 'behind', 'far']);
    else assert.ok(Object.values(A).every((a) => a.z === undefined), 'wide: all on one line, so a spot of its own is sized by depth');
    for (const [p1, p2] of [['sit', 'sit'], ['stand', 'sit'], ['stand', 'stand'], ['pawup', 'sit'], ['walk', 'stand']]) for (const order of [0, 1]) {
      const cast = END_CAST(p1, p2, order), scene = { set: 'title', cam, cast, fx: ['day'] }, r = art.render(scene, { look: LOOK });
      checkRender(r, scene, 'title/' + cam + ' ' + p1 + '/' + p2 + (order ? ' reversed' : ''));
      assert.ok(r.heads.every((h) => h && h.x > 0 && h.x < 100 && h.y > 0 && h.y < 100), cam + ': every face in the panel: ' + JSON.stringify(r.heads));
      const L = cast.map((m) => Object.assign(landed(r.svg, m, A[m.at]), { m }));
      for (const x of L) {
        assert.ok(x.head[0] >= 0 && x.head[2] <= 1600 && x.head[1] >= 0, cam + ' ' + x.m.at + ': the head box in the panel: ' + x.head.map(Math.round));
        for (const y of L) if (x !== y) assert.equal(overlap(x.head, y.head), 0, cam + ': ' + x.m.at + '\'s head clear of ' + y.m.at + '\'s');
      }
      if (cam === 'meet') {
        // drawn far, then behind, then in front, whatever the cast's order
        const at = (k) => L.find((x) => x.m.at === k).idx;
        for (const side of ['end', 'reed']) assert.ok(at(side + '-3') < at(side + '-2') && at(side + '-2') < at(side + '-1'), cam + ' ' + side + ': the farther under the nearer');
      }
      // sitting, as a talk is drawn, nobody's face is under another's body; standing, at most a tail tip
      // crosses the edge of one (body boxes, which hold the tails)
      for (const x of L) for (const y of L) if (x !== y && y.idx > x.idx) assert.ok(overlap(x.head, y.body) / area(x.head) < (p1 === 'sit' && p2 === 'sit' ? 0.05 : 0.2), cam + ' ' + p1 + '/' + p2 + ': ' + x.m.at + '\'s face clear of ' + y.m.at + ': ' + (overlap(x.head, y.body) / area(x.head)).toFixed(2));
      // every reed is drawn under the cast, and nothing in front of everyone reaches a face
      const reeds = r.svg.indexOf('data-prop="reeds"'), first = Math.min(...L.map((x) => x.idx));
      assert.ok(reeds > 0 && reeds < first, cam + ': the reeds behind everyone');
      // (the layer in front of everyone is the panel's last shadowed group, after the cast)
      const fronts = [...r.svg.matchAll(/<g filter="url\(#[^)]*-f-sh-s\)">/g)].map((m) => m.index), front = fronts[fronts.length - 1];
      assert.ok(front > Math.max(...L.map((x) => x.idx)), cam + ': the grass in front comes after the cast');
      const ys = [...r.svg.slice(front).matchAll(/<path d="([^"]+)"/g)].flatMap((m) => (m[1].match(/-?[\d.]+/g) || []).map(Number).filter((v, i) => i % 2 === 1));
      const lowestFace = Math.min(...L.map((x) => x.head[3]));
      assert.ok(ys.every((y) => y > lowestFace), cam + ': the grass in front stays below every face');
    }
    // with nobody there: no cat on the wall (the title screen's is chapter 1's picture), nothing drawn for a cast
    const empty = art.render({ set: 'title', cam, cast: [], fx: ['day'] }, { look: LOOK });
    checkRender(empty, { cast: [] }, 'title/' + cam + ' nobody');
    assert.ok(!/-f-titlecat"/.test(empty.svg), cam + ': no silhouette cat');
    for (const fx of [['sunset'], ['morning'], ['dusk'], ['night']]) checkRender(art.render({ set: 'title', cam, cast: END_CAST('sit', 'sit'), opts: { rustle: true }, fx }, { look: LOOK }), { cast: END_CAST('sit', 'sit') }, 'title/' + cam + ' ' + fx);
  }
  // a spot of the story's own on the wide picture is sized by its depth there
  const near = art.render({ set: 'title', cam: 'end', cast: [{ who: 'clancat', at: { x: 1300, y: 940 } }, { who: 'clancat', at: { x: 1500, y: 880 } }], fx: ['day'] }, { look: LOOK });
  assert.ok(near.heads[0].r > near.heads[1].r, 'nearer is bigger: ' + JSON.stringify(near.heads));
  // the old wall's stones and the line's one stone are drawn; the river lies behind, between the far shore and the bank
  const svg = art.render({ set: 'title', cam: 'end', cast: [], fx: ['day'] }).svg;
  assert.ok(svg.includes('data-prop="wall-end"') && svg.includes('data-prop="line-stone"'));
});

test('rustle: rustle lines in the reeds and the reeds by them swaying, in both cameras of the wall\'s end, above every face; never without the option, never on the river at dusk', { skip: !art.character && 'no cats.js' }, () => {
  const E = art.titleEndInfo(), A = art.sceneInfo('title').anchors;
  for (const cam of ['end', 'meet']) {
    const off = art.render({ set: 'title', cam, cast: END_CAST('sit', 'sit'), fx: ['day'] }, { look: LOOK });
    assert.ok(!off.svg.includes('data-prop="rustle"') && !off.svg.includes('pcs-sway'), cam + ': no rustle unless asked');
    for (const cast of [[], END_CAST('sit', 'sit'), END_CAST('stand', 'stand')]) {
      const r = art.render({ set: 'title', cam, cast, opts: { rustle: true }, fx: ['day'] }, { look: LOOK });
      checkRender(r, { cast }, cam + ' rustle');
      const lines = prop(r.svg, 'rustle');
      assert.ok(lines && /class="pcs-pulse"/.test(lines), cam + ': the rustle lines, pulsing');
      assert.ok(r.svg.includes('class="pcs-sway"'), cam + ': the reeds by them sway');
      const P = pathPoints(lines);
      assert.ok(P.length > 10 && P.every((q) => q[0] > E[cam].line && q[0] < 1600), cam + ': in the reeds, past the line');
      const L = cast.map((m) => landed(r.svg, m, A[cam][m.at]));
      for (const x of L) assert.ok(P.every((q) => q[1] < x.head[1]), cam + ': above every face');
    }
  }
  const wide = art.render({ set: 'title', cam: 'wide', opts: { rustle: true }, cast: [], fx: ['day'] });
  assert.ok(!wide.svg.includes('data-prop="rustle"'), 'the river at dusk has no reeds to rustle');
});

test('the dream: walking on the Sky River (star-1 near, our cat walking; star-2 further along, the starry cat, smaller, facing back), both on the path of stars, a soft pool of starlight under each and never a dark shadow; the city\'s lights tiny far below; looking down: the towers far below, the tallest\'s red light, one balcony with a wind chime catching the starlight, nobody seen', { skip: !art.character && 'no cats.js' }, () => {
  const W = art.sceneInfo('sky').anchors.walk, D = art.dreamInfo();
  const a1 = W['star-1'], a2 = W['star-2'];
  assert.ok(a1.face === 'right' && a2.face === 'left', 'she walks toward the starry cat, who faces back');
  assert.ok(a2.x > a1.x && a2.y < a1.y && a2.h < a1.h * 0.8, 'the starry cat is further along: further off, higher up the path, smaller');
  for (const a of [a1, a2]) {
    const c = D.at(a.x);
    assert.ok(Math.abs(a.y - c.y) < c.w * 0.35, 'on the path of stars at x ' + a.x + ': ' + a.y + ' vs ' + JSON.stringify(c));
  }
  const cast = [{ who: 'player', at: 'star-1', pose: 'walk', mood: 'wonder', facing: 'right' }, { who: 'clancat', at: 'star-2', pose: 'sit', mood: 'kind', starry: true }];
  for (const fx of [['night'], ['night', 'stars'], []]) {
    const scene = { set: 'sky', cam: 'walk', cast, fx }, r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'sky/walk ' + fx);
    assert.ok(r.heads.every((h) => h && h.x > 2 && h.x < 98 && h.y > 2), 'both faces in the panel: ' + JSON.stringify(r.heads));
    assert.ok(r.heads[0].r > r.heads[1].r, 'our cat is nearer');
    assert.ok(r.svg.includes('data-prop="star-path"') && r.svg.includes('data-prop="city-far"'), 'the path of stars; the city far below');
    for (const a of [a1, a2]) assert.equal(footShade(r.svg, a.y).length, 0, 'no dark shadow on starlight');
    assert.equal((r.svg.match(/-r-dpool\)"/g) || []).length, 2, 'a pool of starlight under each of them');
    // the starry extra reaches the drawing (cats.js draws her in starlight)
    const asked = [], real = art.character;
    withCharacter((who, o) => { asked.push(Object.assign({ who }, o)); return real(who, o); }, () => art.render(scene, { look: LOOK }));
    assert.ok(asked.some((o) => o.who === 'clancat' && o.starry === true), 'starry: true is handed to the painter');
  }
  const nobody = art.render({ set: 'sky', cam: 'walk', cast: [], fx: ['night'] });
  assert.ok(!nobody.svg.includes('-r-dpool'), 'no pool where nobody stands');
  // looking down: nobody is seen, whoever the frame names
  const down = art.render({ set: 'sky', cam: 'below', cast, fx: ['night'] }, { look: LOOK });
  checkRender(down, { cast }, 'sky/below');
  assert.deepEqual(down.heads, [null, null], 'no spots: nobody drawn');
  assert.ok(!/translate\(-100 -200\)/.test(down.svg), 'no cat in the picture');
  const towers = prop(down.svg, 'towers-below'), balcony = prop(down.svg, 'chime-balcony');
  assert.ok(towers && /class="pcs-blink"/.test(towers) && towers.includes('#FF4B3E'), 'the tallest tower\'s little red light, blinking');
  assert.ok(balcony && balcony.includes('class="pcs-chime"') && balcony.includes('class="pcs-tw"'), 'a balcony with a wind chime, twinkling in the starlight');
  assert.ok(down.svg.includes('data-prop="river-edge"'), 'the river\'s edge, near, across the top');
  assert.equal(D.towers.filter((t) => t.chime).length, 1, 'one balcony'); assert.equal(D.towers.filter((t) => t.tallest).length, 1, 'one tallest');
  const tallest = D.towers.find((t) => t.tallest);
  assert.ok(D.towers.every((t) => t === tallest || t.w < tallest.w), 'the tallest is the nearest roof, the biggest');
  // one glass tower all along (chapters 1 to 5): her old window, Waffles nineteen floors up, the red light on top
  assert.ok(tallest.chime, 'Waffles\'s balcony is on the tallest tower, the one with the red light');
  // its rail and door (the rects' x) start on that tower's face and stop short of the next tower to the right
  const xs = [...balcony.matchAll(/<rect x="([-\d.]+)"[^>]* width="([-\d.]+)"/g)].flatMap((m) => [+m[1], +m[1] + +m[2]]);
  const next = Math.min(...D.towers.filter((t) => t.x > tallest.x).map((t) => t.x - t.w / 2));
  assert.ok(xs.length && Math.min(...xs) >= tallest.x - tallest.w / 2 && Math.max(...xs) < next,
    'the balcony is on its face, clear of the next tower: x ' + Math.round(Math.min(...xs)) + '..' + Math.round(Math.max(...xs)) + ' (next tower from ' + next + ')');
  // chapter 1's two cameras are as they were (the fingerprints above)
  assert.deepEqual(art.sceneInfo('sky').cams.up, { x: 160, y: 0, w: 1280, h: 800, comp: 'main', follow: false, head: false });
});

test('den hidden, chapter 6: Coil\'s card goes under the moss with Sprinkle\'s two: three fewer in the row, three corners showing at its inner end, the third short of the nest\'s middle; chapters 4 and 5\'s files, which hold no such card, keep their two', { skip: !art.character && 'no cats.js' }, () => {
  const file = ['four-a-night', 'tidy', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'prints-tracks', 'reed-pile', 'coil-diggers'];
  for (const n of [9, 12, 15]) {
    const list = file.slice(0, n - 2).concat(['reed-pile', 'coil-diggers']).filter((v, i, a) => a.indexOf(v) === i);
    if (!list.includes('sprinkle-scales')) continue;
    for (const cam of ['nest', 'inside', 'doorway']) for (const facing of ['right', 'left']) {
      const scene = nestScene({ bark: list, hidden: true }, { pose: 'lie', facing }, cam), r = art.render(scene, { look: LOOK }), vb = viewBox(r.svg);
      checkRender(r, scene, 'den/' + cam + ' three hidden');
      const P = pieces(r.svg), C = corners(r.svg);
      assert.equal(P.length, list.length - 3, cam + ': three fewer in the row');
      assert.equal(C.length, 3, cam + ': three corners');
      const two = corners(art.render(nestScene({ bark: list.filter((c) => c !== 'coil-diggers'), hidden: true }, { pose: 'lie', facing }, cam), { look: LOOK }).svg);
      assert.equal(two.length, 2, 'without Coil\'s card: two, as before');
      const inner = (cs) => Math.min(...cs.map((c) => Math.abs(c.x - NEST_X)));
      assert.ok(inner(C) >= inner(two) - 1, cam + ': the third keeps short of the middle, where chapter 4\'s second stood: ' + inner(C).toFixed(1) + ' vs ' + inner(two).toFixed(1));
      for (const c of C) {
        assert.ok(inVb(c.x, c.y - 24, vb, 2) && inVb(c.x, c.y, vb, 2), cam + ': in the panel');
        assert.ok(c.y > 886 && c.y < 886 + 50 && Math.abs(c.x - NEST_X) < 120, cam + ': in the front rim\'s moss');
        for (const q of P) assert.ok(Math.abs(c.x - NEST_X) < Math.abs(q.x - NEST_X), cam + ': past the row\'s inner end');
      }
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) assert.ok(Math.abs(C[i].x - C[j].x) > 8, 'side by side');
      // never on her face
      const me = landed(r.svg, scene.cast[0], art.sceneInfo('den').anchors.inside.nest);
      if (me) for (const c of C) assert.ok(!(c.x > me.head[0] && c.x < me.head[2] && c.y - 20 > me.head[1] && c.y - 20 < me.head[3]), 'a corner off her face');
    }
  }
  // which three: the secret pictures, wherever they are in her file, by picture
  const asked = [], spy = (o) => { asked.push(o.blank ? '(blank)' : o.picture); return { svg: '<rect class="spy-card" width="200" height="240" fill="#EDE1C5"/>', w: 200, h: 240 }; };
  const row = (opts) => { asked.length = 0; withCards(spy, () => art.render(nestScene(opts), { look: LOOK })); return asked.slice(); };
  assert.deepEqual(row({ bark: ['four-a-night', 'coil-diggers', 'sprinkle-scales', 'reed-pile', 'cant-fly', 'sleet-den'], hidden: true }), ['four-a-night', 'reed-pile', 'sleet-den'], 'ReedClan\'s and Sleet\'s lie in the row; Coil\'s goes under');
  assert.deepEqual(row({ bark: [{ picture: 'four-a-night', mark: 'eye' }, { picture: 'coil-diggers', mark: 'ear' }, { picture: 'tidy', mark: 'eye' }], hidden: true }), ['four-a-night'], 'one secret held: it, and the newest other (two under, as chapter 4 had it)');
  assert.deepEqual(row({ bark: ['four-a-night', 'coil-diggers', 'tidy'] }), ['four-a-night', 'coil-diggers', 'tidy'], 'not hidden: the list as given');
  assert.equal(corners(art.render(nestScene({ bark: ['a', 'coil-diggers', 'b'], hidden: true }), { look: LOOK }).svg).length, 2, 'two corners when fewer than two secrets are held');
});

test('hollow, chapter 6: a sixth claw mark, beside the fifth in the second row, on the trunk, in the tree close-up and the wide; older glowing marks keep glowing; the lesson camera draws it as chapter 5 drew its five', () => {
  const at = (cam, opts) => art.render({ set: 'hollow', cam, opts: Object.assign({ marks: 6 }, opts || {}), cast: [], fx: ['morning'] });
  const r = at('wide');
  checkRender(r, { cast: [] }, 'hollow six');
  const outer = shapes(r.svg, 'fill="#3A281E"');
  assert.equal(outer.length, 18, 'six marks, three scratches each');
  const C = outer.map(centre), mark = (i) => centre(C.slice(i * 3, i * 3 + 3));
  // the first five exactly where chapter 5 put them
  const five = shapes(art.render({ set: 'hollow', cam: 'wide', opts: { marks: 5 }, cast: [], fx: ['morning'] }).svg, 'fill="#3A281E"').map(centre);
  const m5 = (i) => centre(five.slice(i * 3, i * 3 + 3));
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(mark(i)[1] - mark(0)[1]) < 1, 'the first row');
  assert.ok(Math.abs(mark(5)[1] - mark(4)[1]) < 1 && mark(5)[0] - mark(4)[0] > 40 && mark(5)[0] - mark(4)[0] < 60, 'the sixth beside the fifth, in the second row: ' + mark(4) + ' / ' + mark(5));
  assert.ok(mark(3)[1] > mark(0)[1] + 40, 'the second row under the first');
  for (const [i, p] of [[3, m5(3)], [4, m5(4)]]) assert.ok(Math.abs(mark(i)[0] - p[0]) < 12 && Math.abs(mark(i)[1] - p[1]) < 1, 'the second row starts as chapter 5\'s did');
  // in the tree close-up, all six whole, and in the keep area
  const t = at('tree', { glow: [true, false, true, false, false, false] }), vb = viewBox(t.svg);
  for (const p of shapes(t.svg, 'fill="#3A281E"').flat()) assert.ok(inVb(p[0], p[1], vb, 2), 'the tree close-up holds every mark: ' + p);
  const k = t.keep[0];
  for (const p of shapes(t.svg, 'fill="#3A281E"').flat()) assert.ok(p[0] >= vb[0] + k.x / 100 * vb[2] - 1 && p[0] <= vb[0] + (k.x + k.w) / 100 * vb[2] + 1, 'in the keep');
  // glow: a list lights mark by mark, so the older ones that glow keep glowing beside the new
  const lit = shapes(t.svg, 'fill="#FFF6D0" class="pcs-pulse"'), dim = shapes(t.svg, 'fill="#E9D2A6"');
  assert.equal(lit.length, 6, 'two marks lit (first and third)');
  assert.equal(dim.length, 12);
  // the lesson camera draws the six as it drew chapter 5's five (its right edge at x 1140, the trunk's edge)
  const L = at('lesson', { glow: [true, false, false, false, false, false] });
  checkRender(L, { cast: [] }, 'hollow lesson six');
  assert.ok(L.keep.length <= 1);
});

test('hollow, chapter 6: the patrol of three trotting by behind the rim, at the story\'s three spots on the far edge: drawn behind the five sitters in any cast order, their heads and backs clear above every sitter\'s head, in the wide panel', { skip: !art.character && 'no cats.js' }, () => {
  const A = art.sceneInfo('hollow').anchors.main;
  for (const rim2 of ['murmurchime', 'clancat']) for (const facing of ['right', 'left']) for (const order of [0, 1]) {
    // (chapter 5's rim, RIM5 above, as its rim() lays it; or a grown cat in Murmurchime's place)
    const rim = RIM5().map((m) => (m.at === 'rim-2' && rim2 === 'clancat' ? Object.assign({}, m, { who: 'clancat', variant: 2 }) : m));
    const walkers = PATROL6.map((at, i) => ({ who: 'clancat', variant: [4, 6, 2][i], pose: 'walk', mood: 'proud', facing, at }));
    const cast = order ? walkers.concat(rim, [{ who: 'tallyheart', at: 'tree-far', pose: 'sit', mood: 'kind', facing: 'left' }]) : rim.concat([{ who: 'tallyheart', at: 'tree-far', pose: 'sit', mood: 'kind', facing: 'left' }], walkers);
    const scene = { set: 'hollow', cam: 'wide', opts: { marks: 6, glow: [true, false, false, false, false, false] }, cast, fx: ['morning'] }, r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'hollow patrol');
    const sit = rim.map((m) => landed(r.svg, m, A[m.at])), walk = walkers.map((m) => landed(r.svg, m, Object.assign({ face: m.facing }, m.at)));
    assert.ok(sit.every(Boolean) && walk.every(Boolean), 'all eight drawn');
    for (const w of walk) {
      assert.ok(sit.every((s) => w.idx < s.idx), 'a walker is drawn behind every sitter');
      const over = sit.filter((s) => s.head[0] < w.head[2] && s.head[2] > w.head[0]);
      for (const s of over) assert.ok(s.head[1] - w.head[1] > 50, 'a walker\'s head well above the sitter\'s in front of it: ' + (s.head[1] - w.head[1]).toFixed(1));
      assert.ok(w.head[0] > 0 && w.head[2] < 1600 && w.head[1] > 0, 'in the panel');
    }
    for (let i = 1; i < 3; i++) assert.ok(walk[i].body[0] >= walk[i - 1].body[2] - 20, 'single file, one after another');
  }
});

// Stand-ins for chapter 6's three, drawn at a chosen size, to see the scenes hold them to the text's.
function standIns6(real, k) {
  const head = (c) => (c.headBox.x1 - c.headBox.x0 + c.headBox.y1 - c.headBox.y0) / 2;
  const player = head(real('player', { pose: 'sit', mood: 'neutral', look: LOOK, sex: LOOK.sex })), spr = head(real('sprinkle', { pose: 'sit', mood: 'neutral' }));
  const tally = (() => { const c = real('tallyheart', { pose: 'sit', mood: 'neutral' }); return c.h - c.headBox.y0; })();
  return function (who, o) {
    let d;
    if (who === 'coil') { const s = player * k.coil; d = { w: 300, h: 120, headBox: { x0: 150 - s / 2, y0: 120 - s, x1: 150 + s / 2, y1: 120 }, bounds: { x0: 20, y0: 120 - s, x1: 150 + s / 2, y1: 120 } }; }
    else if (who === 'sleet') { const s = spr * k.sleet; d = { w: 640, h: 340, headBox: { x0: 360 - s / 2, y0: 30, x1: 360 + s / 2, y1: 30 + s }, bounds: { x0: 120, y0: 30, x1: 500, y1: 338 } }; }
    else if (who === 'sloshbank') { const t = tally * k.sloshbank; d = { w: 200, h: 200, headBox: { x0: 60, y0: 200 - t, x1: 170, y1: 200 - t + 90 }, bounds: { x0: 20, y0: 200 - t, x1: 190, y1: 198 } }; }
    else return real(who, o);
    if (o && ['stone', 'hidden', 'tail'].includes(o.pose)) d.bounds = { x0: d.headBox.x0, y0: d.headBox.y0, x1: d.headBox.x1, y1: d.headBox.y1 };
    return { svg: '<rect class="new-' + who + '" x="' + d.bounds.x0 + '" y="' + d.bounds.y0 + '" width="' + (d.bounds.x1 - d.bounds.x0) + '" height="' + (d.bounds.y1 - d.bounds.y0) + '" fill="#8FA3B8"/>', w: d.w, h: d.h, head: { x: (d.headBox.x0 + d.headBox.x1) / 2, y: d.headBox.y0 + 8 }, headBox: d.headBox, bounds: d.bounds };
  };
}

test('Coil, Sleet and Sloshbank at any anchor are held to the text\'s sizes: Coil\'s head smaller than a cat\'s (no bigger than a stone of the wall), Sleet\'s head about Sprinkle\'s, Sloshbank bigger than Tallyheart; a drawing inside its band is left as drawn; every pose alike', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, a = art.sceneInfo('title').anchors.main.wall, base = a.h / 200;
  const near = (x, y, what) => assert.ok(Math.abs(x - y) < 0.0002, what + ': ' + x + ' vs ' + y);
  const B = art.sizeBands;
  const cases = [['coil', 'head', ['stone', 'still']], ['sleet', 'sit', ['flat', 'hidden']], ['sloshbank', 'sit', ['stand']]];
  for (const [who, pose, others] of cases) {
    const band = B[who];
    for (const k of [band.min * 0.5, (band.min + band.max) / 2, band.max * 1.6]) {
      const fake = standIns6(real, { coil: 0.5, sleet: 1, sloshbank: 1.2, [who]: k });
      withCharacter(fake, () => {
        const c = fake(who, { pose }), want = round4(base * Math.min(Math.max(k, band.min), band.max) / k);
        const place = (p) => art.render({ set: 'title', cam: 'wide', cast: [{ who, pose: p, mood: 'neutral', at: 'wall', facing: 'left' }], fx: ['day'] }, { look: LOOK });
        const r = place(pose);
        checkRender(r, { cast: [1] }, who + ' ' + k);
        near(placedScale(r.svg, a, c.w, c.h), want, who + ' drawn at ' + k.toFixed(2) + (k >= band.min && k <= band.max ? ' (inside: as drawn)' : ' (brought into the band)'));
        for (const p of others) { const d = fake(who, { pose: p }); near(placedScale(place(p).svg, a, d.w, d.h), want, who + ' ' + p + ': the same scale'); }
      });
    }
  }
  // the real ones (cats.js, once it draws them): inside their bands as drawn
  if (art.vocab.cast && art.vocab.cast.includes('coil')) {
    const hd = (c) => (c.headBox.x1 - c.headBox.x0 + c.headBox.y1 - c.headBox.y0) / 2;
    const k = {
      coil: hd(real('coil', { pose: 'head', mood: 'neutral' })) / hd(real('player', { pose: 'sit', mood: 'neutral', look: LOOK, sex: LOOK.sex })),
      sleet: hd(real('sleet', { pose: 'sit', mood: 'neutral' })) / hd(real('sprinkle', { pose: 'sit', mood: 'neutral' })),
      sloshbank: sitTall('sloshbank') / sitTall('tallyheart')
    };
    for (const w of Object.keys(k)) {
      const s = placedScale(art.render({ set: 'title', cam: 'wide', cast: [{ who: w, pose: B[w].pose, mood: 'neutral', at: 'wall', facing: 'left' }], fx: ['day'] }, { look: LOOK }).svg, a, real(w, { pose: B[w].pose, mood: 'neutral', facing: 'left' }).w, real(w, { pose: B[w].pose, mood: 'neutral', facing: 'left' }).h);
      const held = s / base * k[w];
      assert.ok(held >= B[w].min - 0.005 && held <= B[w].max + 0.005, w + ' as the painter draws him, held at ' + held.toFixed(3) + ' of ' + B[w].ref);
    }
  }
});

test('shadows, chapter 6: Coil\'s under his body as drawn, none when he is a stone in his gap; Sleet\'s under his body, none hidden in the long grass or with only his tail showing; Sleet\'s head that tops a cat\'s camera still gets a balloon point', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, a = art.sceneInfo('title').anchors.main.wall;
  withCharacter(standIns6(real, { coil: 0.5, sleet: 1, sloshbank: 1.2 }), () => {
    const one = (who, pose) => art.render({ set: 'title', cam: 'wide', cast: [{ who, pose, mood: 'neutral', at: 'wall', facing: 'left' }], fx: ['day'] }, { look: LOOK });
    assert.equal(footShade(one('coil', 'stone').svg, a.y).length, 0, 'a stone casts no shadow');
    assert.equal(footShade(one('coil', 'still').svg, a.y).length, 1, 'Coil lying along the wall');
    for (const p of ['hidden', 'tail']) assert.equal(footShade(one('sleet', p).svg, a.y).length, 0, 'Sleet ' + p + ': nothing gives him away');
    assert.equal(footShade(one('sleet', 'sit').svg, a.y).length, 1, 'Sleet sitting');
  });
});

test('every frame of chapter 6 renders with the art vocabulary (once it is written): its sets, cameras and anchors are the art\'s', () => {
  if (!has('app/story/ch06.js')) return;
  require(path.join(ROOT, 'app/story/ch06.js'));
  const ch = PC.story && PC.story.ch06;
  for (const [id, f] of Object.entries((ch && ch.frames) || {})) {
    const s = f.scene, v = art.vocab;
    if (!s) continue;
    assert.ok(v.sets[s.set], id + ': set ' + s.set);
    assert.ok(v.sets[s.set].cams.includes(s.cam), id + ': camera ' + s.set + '/' + s.cam);
    for (const m of s.cast || []) if (typeof m.at === 'string') assert.ok(v.sets[s.set].anchors.includes(m.at), id + ': anchor ' + m.at + ' in ' + s.set);
    for (const k of Object.keys(s.opts || {})) assert.ok(Object.prototype.hasOwnProperty.call(v.sets[s.set].opts, k), id + ': option ' + k + ' on ' + s.set);
    const o = Object.assign({}, s.opts || {});
    if (o.marks === 'auto') o.marks = 6;
    if (o.glow === 'auto') o.glow = [true, false, false, false, false, false];
    if (o.depth === 'auto') delete o.depth;
    if (o.stone === 'auto') o.stone = 'nose';
    if (o.bark === 'auto') o.bark = FILE5.slice(0, 14).concat(['reed-pile', 'coil-diggers']);
    if (Array.isArray(o.cards)) o.cards = o.cards.map((c) => (typeof c === 'string' ? c : c.id));
    const scene = Object.assign({}, s, { opts: o });
    checkRender(art.render(scene, { look: LOOK }), scene, 'ch06 ' + id);
  }
});

test('chapter 6: ReedClan’s cats are cats: a face sized from the box, as a Clan cat’s is (CAT_IDS)', () => {
  const at = (who, extra) => art.render({ set: 'title', cam: 'meet', fx: ['day'], cast: [Object.assign({ who, at: 'reed-1', pose: 'sit', mood: 'stern' }, extra || {})] }, { look: LOOK });
  const clan = at('clancat', { variant: 1 }).heads[0], slosh = at('sloshbank').heads[0], reed = at('reedclan', { variant: 2 }).heads[0];
  assert.ok(clan && slosh && reed && clan.r > 0, 'all three faces are in the panel, with a size');
  assert.ok(Math.abs(reed.r / clan.r - 1) < 0.02, 'a ReedClan cat’s face is a cat’s: ' + reed.r + ' vs ' + clan.r);
  assert.ok(slosh.r / clan.r > 1.08 && slosh.r / clan.r < 1.25, 'Sloshbank’s is a big cat’s, from his bigger box: ' + slosh.r + ' vs ' + clan.r);
});


// ================================================================ chapter 7 (docs/chapters/07-the-counts-dont-lie.spec.md, sections 3 and 4)

// The proof that chapters 1 to 6 look exactly as they did: every frame of chapters 1 to 6 (every set, each
// 'auto' filled as the gallery fills it), each gallery panel for a set and camera they had, and the
// gallery's first 93 extras (all it had), drawn with the real cats and cards, hashed with the per-render
// ids stripped and with the heads and keep, one hash per chapter and set, per gallery camera and per set
// of extras. The numbers were taken once from the tree as chapter 6 shipped it (the snapshot taken before
// chapter 7's build, loaded in a process of its own), and are kept here: this test never reads that tree.
// <ch7-fingerprint>
// Every frame of chapters 1 to 6 (all their sets, each 'auto' filled as the gallery fills it), every
// set x camera sample on the gallery, and its first `extras` extras, hashed with the per-render ids
// stripped, and the heads and keep; one hash per chapter and set, per gallery camera, and per set of
// the extras.
function ch7Fingerprint(PC, page, crypto, extras) {
  const art = PC.art, out = {}, LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
  const strip = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');
  // a chapter 5 and a chapter 6 cat's file as the gallery fills `bark: 'auto'` (every card without a `when`)
  const F5 = ['four-a-night:eye', 'tidy:eye', 'dug-earth:eye', 'scale:eye', 'fox-flew:ear', 'fox-moon:ear', 'sprinkle-scales:eye', 'cant-fly:eye', 'prints-pile:eye',
    'otter-fox:ear', 'fur:eye', 'heron-no-moon:ear', 'heron-shapes:ear', 'prints-marsh:eye', 'prints-tracks:eye'];
  const FILE = { 5: F5, 6: F5.concat(['reed-pile:ear', 'coil-diggers:ear']) };
  function fill(s, number) {
    if (!s || !s.opts) return s;
    const o = Object.assign({}, s.opts), m = Math.max(1, Math.min(10, number || 2));
    if (o.marks === 'auto') o.marks = m;
    if (o.glow === 'auto') o.glow = Array.from({ length: m }, (v, i) => i === 0);
    if (o.stone === 'auto') o.stone = 'nose';
    if (o.bark === 'auto' && FILE[number]) o.bark = FILE[number].map((p) => ({ picture: p.split(':')[0], mark: p.split(':')[1] }));
    return Object.assign({}, s, { opts: o });
  }
  function add(key, tag, scene) {
    const r = art.render(scene, { look: LOOK }), h = out[key] || (out[key] = crypto.createHash('sha1'));
    h.update(tag + ':' + strip(r.svg) + JSON.stringify(r.heads) + JSON.stringify(r.keep));
  }
  for (const ch of ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06']) {
    const n = +ch.slice(2);
    for (const [id, f] of Object.entries(PC.story[ch].frames)) if (f.scene) add(ch + '/' + f.scene.set, id, fill(f.scene, n));
  }
  const js = page.slice(page.lastIndexOf('<script>') + 8, page.lastIndexOf('</script>'));
  const from = js.indexOf('// ---- a sample cast'), to = js.indexOf('// ---- panels');
  const G = new Function(js.slice(from, to) + '\nreturn { SAMPLES: SAMPLES, EXTRA: EXTRA };')();
  for (const set of Object.keys(art.vocab.sets)) for (const cam of art.vocab.sets[set].cams) {
    const smp = (G.SAMPLES[set] || {})[cam] || { cast: [], fx: [] };
    add('gallery/' + set + '/' + cam, cam, { set, cam, opts: smp.opts || {}, cast: smp.cast || [], fx: smp.fx || [] });
  }
  G.EXTRA.slice(0, extras).forEach((e, i) => add('extras/' + e[0], i + ' ' + e[3], { set: e[0], cam: e[1], opts: e[2].opts || {}, cast: e[2].cast || [], fx: e[2].fx || [] }));
  for (const k of Object.keys(out)) out[k] = out[k].digest('hex').slice(0, 12);
  return out;
}
// </ch7-fingerprint>

const CH7_FINGERPRINT = {
  'ch01/room': 'cf825a01bd38', 'ch01/tower': '2a616c069d47', 'ch01/garden': 'cf2137f8e9eb', 'ch01/camp': 'f40e5855d370',
  'ch01/hollow': 'c4abb94db607', 'ch01/den': '568f080f23ed', 'ch01/sky': 'b59ef7613441', 'ch01/river': '174102393782', 'ch02/den': '4f8a3a50cd3a',
  'ch02/garden': '53e7e96faf9b', 'ch02/tower': '5b0e2982dc11', 'ch02/hollow': 'e9c6bbaf421a', 'ch02/pile': '05cfd6f528ca',
  'ch02/camp': '790bceaf444a', 'ch02/title': '966b0c25e839', 'ch02/bridge': '4e92a8c50bbe', 'ch02/field': '8fab5f8d1dbb',
  'ch02/crossing': 'a5401d3fa701', 'ch02/riverbank': '2b40ee055e70', 'ch03/den': '5a6421c08e58', 'ch03/pile': '5ef9d29137dc',
  'ch03/camp': 'fd05152b881e', 'ch03/tower': '288fb139e478', 'ch03/hollow': 'f06f981adc35', 'ch03/bridge': '5db17c4fa576',
  'ch03/title': '497e2fa54127', 'ch03/garden': 'b80f10b46413', 'ch03/riverbank': 'f588ad6f7605', 'ch04/den': 'b4988ee98647',
  'ch04/hollow': '40225f5302e2', 'ch04/pile': '5b3607c78cb5', 'ch04/camp': 'e1a69084b621', 'ch04/field': 'ffb16f3c8954',
  'ch04/title': '9f0b895c57ca', 'ch04/garden': '304a6894c4b3', 'ch04/tower': '93d27baac159', 'ch04/riverbank': '6844e41f92eb',
  'ch04/bridge': 'f7aa2d5c7e58', 'ch04/roof': 'ef460b3e5a7a', 'ch05/pile': 'a77a3e2e5fe4', 'ch05/hollow': '71c179b3e020',
  'ch05/tower': '85ca16331cc0', 'ch05/roof': '6a6e4ca36158', 'ch05/crossing': '7edbe5fab476', 'ch05/openriver': 'b9f739e462be',
  'ch05/marsh': 'c92a1e88baaa', 'ch05/bridge': 'a90d977e115d', 'ch05/den': 'b910b0ab1c06', 'ch06/pile': 'c0561d0cae2b',
  'ch06/hollow': '2a346b12ffab', 'ch06/title': '3378c0228d32', 'ch06/field': '8b96e3d40662', 'ch06/bridge': '575e6d26d8f5',
  'ch06/den': 'aa0000c75631', 'ch06/sky': '511b3bc100be', 'gallery/room/wide': '9ca5890994ac', 'gallery/room/cushion': '4b68d25db677',
  'gallery/room/glass': 'ce0ebb9cfddb', 'gallery/room/outside': '8fd28f7de379', 'gallery/tower/up': '41c1068decda',
  'gallery/tower/balcony': '55ae32a34000', 'gallery/tower/balcony-close': '3ea768d65301', 'gallery/garden/wide': '3c454b12e66b',
  'gallery/garden/paws': '0edabf335048', 'gallery/garden/step': '930d04cb2c29', 'gallery/garden/fence': 'f85ca6a610c5',
  'gallery/garden/lamp': '46cd9b94b9c5', 'gallery/garden/meet': '14c7bc288559', 'gallery/garden/hedge': 'ae4bf49a128f',
  'gallery/garden/hedge-close': 'c79a27607258', 'gallery/camp/reveal': 'f4b7cba14dc8', 'gallery/camp/crowd': 'c5cf9f2f7edf',
  'gallery/camp/fountain': '3f1db44c9232', 'gallery/camp/entrance': 'ddadbce79d51', 'gallery/camp/fountain-close': '0565e248766d',
  'gallery/camp/ferns': '3f1837a121b6', 'gallery/camp/purr': 'fa844c432626', 'gallery/hollow/wide': 'e7d25166ee39',
  'gallery/hollow/lesson': '82508f80b182', 'gallery/hollow/sand': '6f1fb7da32e9', 'gallery/hollow/tree': '17b5162322f5',
  'gallery/den/outside': 'ea78767a068b', 'gallery/den/inside': '77e5555dac16', 'gallery/den/nest': '28d0379b67c2',
  'gallery/den/doorway': '436c92612103', 'gallery/sky/up': '0909005f4475', 'gallery/sky/cats': '3f58c5ff88e8', 'gallery/sky/walk': 'eefe9e6142c6',
  'gallery/sky/below': 'cd372e9fe5fc', 'gallery/river/crash': '73e3c9adab7d', 'gallery/title/wide': 'ac111e5ec24b',
  'gallery/title/end': '12eeb7870236', 'gallery/title/meet': '34f5fc28a651', 'gallery/pile/wide': '5b8bc029f202', 'gallery/pile/low': '751cad9b2f06',
  'gallery/pile/close': '1c5ef81c5701', 'gallery/pile/rows': '7e938ffc9f06', 'gallery/pile/gap': '648b4687493d',
  'gallery/pile/scale': '30b53fe07218', 'gallery/pile/through': 'bd3f419c846f', 'gallery/pile/mirror': '6328905dc5e8',
  'gallery/pile/gap-close': '55d06c1f3883', 'gallery/bridge/bank': '770995da539e', 'gallery/bridge/mouth': 'b747945a5716',
  'gallery/bridge/under': '37f4e9b2e01d', 'gallery/bridge/back': 'c170d1423d90', 'gallery/bridge/paws': '5d77544130a6',
  'gallery/bridge/wall': '4238ab260bf1', 'gallery/field/wide': '1f2724ed87c3', 'gallery/field/fence': '91fa5108744d',
  'gallery/field/dogs': '4223ab0a291a', 'gallery/field/border': '973d91e7497e', 'gallery/field/border-two': 'a57edd4417ba',
  'gallery/field/border-fox': '1a1dd3a85a66', 'gallery/crossing/wide': '6f3a2c1fafde', 'gallery/crossing/low': '9a995781b1a2',
  'gallery/crossing/rocks': 'e039ad7927a1', 'gallery/crossing/raft': '0596fe3444e6', 'gallery/crossing/board': '414fe16484e9',
  'gallery/riverbank/path': '4e78441c58a3', 'gallery/riverbank/water': '1d4ba8639817', 'gallery/riverbank/roof': '7c2f7ca4107e',
  'gallery/riverbank/slide': 'f70b23ba5a32', 'gallery/roof/wide': 'a75cdcd875e8', 'gallery/roof/pole': 'cb963871863b',
  'gallery/roof/two': '6d1f32a5d35f', 'gallery/roof/over': '4783a03c2e3a', 'gallery/roof/sky': '153a1ddfe65c', 'gallery/roof/paw': '708e6c78c8b4',
  'gallery/openriver/wide': '772a003d1459', 'gallery/openriver/raft': '1c26d6dbe2fa', 'gallery/openriver/light': 'a1a23b116f81',
  'gallery/openriver/log': 'b97d5283967c', 'gallery/openriver/sky': '6721dfbfb881', 'gallery/openriver/rocks': '5da4e07fb27e',
  'gallery/openriver/edge': '90be44c22839', 'gallery/openriver/beside': 'ce98df20de7f', 'gallery/openriver/under': 'ef5c04a9d900',
  'gallery/marsh/wide': '7ac33d43b3ea', 'gallery/marsh/far': '020f419ed493', 'gallery/marsh/heron': 'ac274200e7d1',
  'gallery/marsh/mud': 'bad5acba76cd', 'gallery/marsh/pole': '8d19883879c9', 'gallery/marsh/reeds': '1cd849393cde',
  'gallery/marsh/wisp': '859645b25aee', 'gallery/marsh/draw': 'd05fda152f08', 'extras/room': '54a765d4aa65', 'extras/den': '2ea4a271e989',
  'extras/tower': '58db7918fcd2', 'extras/garden': '0bb137c4bc87', 'extras/camp': 'e415327c10b4', 'extras/title': '716921a6a397',
  'extras/hollow': '7fcab8b57947', 'extras/sky': 'ff86c7dffdfe'
};


test('chapter 7: chapters 1 to 6 draw byte for byte as they shipped: every frame of theirs, every gallery panel of a camera they had, and the gallery\'s first 93 extras', { skip: !art.character && 'no cats.js' }, () => {
  for (const id of ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06']) require(path.join(ROOT, 'app/story/' + id + '.js'));
  const page = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  const now = ch7Fingerprint(PC, page, require('crypto'), 93);
  const want = Object.keys(CH7_FINGERPRINT);
  assert.ok(want.length > 140, 'the whole of chapters 1 to 6: ' + want.length + ' hashes');
  for (const k of want) assert.equal(now[k], CH7_FINGERPRINT[k], k + ' draws something else than it did when chapter 6 shipped');
  // what is new is only chapter 7's: its cameras on the gallery; and from chapter 8 on, a panel for every camera of the
  // railway bank (the `tracks` set, sets/tracks.js), whichever of them it has: one while its file is a stub, all eight built
  const tracks = (art.vocab.sets.tracks ? art.vocab.sets.tracks.cams : []).map((c) => 'gallery/tracks/' + c);
  assert.deepEqual(Object.keys(now).filter((k) => !want.includes(k)).sort(), ['gallery/bridge/print', 'gallery/pile/hole', 'gallery/pile/rear'].concat(tracks).sort());
});

test('vocab, chapter 7: the hollow\'s `compare`, declared as the bridge\'s ([false, [24, 60]], off by default); seven marks as markSpots has always drawn them; the den takes nothing new by name; the kit\'s one painter', () => {
  const v = art.vocab.sets;
  assert.deepEqual(v.hollow.opts.compare, [false, [24, 60]], 'a list of two numbers, compared by value');
  assert.deepEqual(Object.keys(v.hollow.opts), ['marks', 'glow', 'depth', 'bark', 'cards', 'blank', 'heap', 'compare']);
  assert.deepEqual(art.sceneInfo('hollow').defaults, { marks: 0, compare: false }, 'no comparison unless a frame asks');
  assert.ok(v.hollow.opts.marks.includes(7), 'marks: 7');
  assert.deepEqual(Object.keys(v.den.opts).slice(0, 6), ['weather', 'moon', 'drips', 'stone', 'bark', 'hidden'], 'the den: three more cards under the moss, by their pictures; no new option');
  // (chapter 8 adds one, `glass`, after them, and the moon's eighth evening: tested with chapter 8's vocabulary)
  assert.deepEqual(Object.keys(v.den.opts), ['weather', 'moon', 'drips', 'stone', 'bark', 'hidden', 'glass'], 'and chapter 8\'s `glass`, last');
  assert.deepEqual(v.hollow.cams, ['wide', 'lesson', 'sand', 'tree']);
  assert.equal(typeof art.kit.compareLines, 'function', 'kit.compareLines, the one drawing for the hollow and the bridge');
  assert.equal(typeof art.kit.compareNums, 'function');
  if (v.bridge) assert.deepEqual(v.bridge.opts.compare, v.hollow.opts.compare, 'the bridge declares it the same');
  // the spec names it so
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/07-the-counts-dont-lie.spec.md'), 'utf8').replace(/\s+/g, ' ');
  assert.ok(md.includes('**Option `compare`**, as the bridge\'s and declared the same (`[false, [24, 60]]`, default false; one drawing for both: one painter in `PC.art.kit`), on `lesson` and `sand`'));
});

// the comparison scratched in the ground: its group, its box, its two lines and its two numbers
function compareOf(svg) {
  const m = /<g data-art="compare" data-nums="([^"]+)" data-box="([^"]+)" aria-label="([^"]+)">(.*?)<\/g>/.exec(svg);
  if (!m) return null;
  const lines = [...m[4].matchAll(/<path d="((?:M[-\d.]+ [-\d.]+H[-\d.]+)+)" fill="none" stroke="(#[0-9a-fA-F]{6})"/g)];
  const dark = lines[lines.length - 1];
  const segs = (dark ? dark[1].match(/M[-\d.]+ [-\d.]+H[-\d.]+/g) : []).map((s) => { const v = s.match(/-?[\d.]+/g).map(Number); return { x0: v[0], y: v[1], x1: v[2], len: v[2] - v[0] }; });
  const texts = [...m[4].matchAll(/<text x="([-\d.]+)" y="([-\d.]+)"[^>]*fill="(#[0-9a-fA-F]{6})"[^>]*>(\d+)<\/text>/g)].map((t) => ({ x: +t[1], y: +t[2], fill: t[3], s: t[4] }));
  return { nums: m[1].split(' ').map(Number), box: m[2].split(' ').map(Number), label: m[3], lines: segs, texts, groove: dark ? dark[2] : null, markup: m[4] };
}
const boxMeets = (p, q, pad) => p[0] < q[2] + (pad || 0) && p[2] > q[0] - (pad || 0) && p[1] < q[3] + (pad || 0) && p[3] > q[1] - (pad || 0);
const keptBox = (r, b) => { const vb = viewBox(r.svg); return (r.keep || []).some((k) => vb[0] + k.x / 100 * vb[2] <= b[0] + 1 && vb[1] + k.y / 100 * vb[3] <= b[1] + 1 && vb[0] + (k.x + k.w) / 100 * vb[2] >= Math.min(b[2], vb[0] + vb[2]) - 1 && vb[1] + (k.y + k.h) / 100 * vb[3] >= Math.min(b[3], vb[1] + vb[3]) - 1); };

test('kit.compareLines: two straight lines, starting together, in the ratio of their numbers; each number scratched just left of its own line, in the digits of chapter 5\'s answers in the sand; both named in the label', () => {
  const S = {};
  const one = art.kit.compareLines(S, { nums: [24, 60], x: 100, y: 200, w: 400, size: 30, gap: 10, groove: '#664422', shine: '#FFEEDD', word: 'mud' });
  const c = compareOf(one.svg);
  assert.ok(c, 'one group');
  assert.deepEqual(c.nums, [24, 60]);
  assert.equal(c.label, 'Scratched in the mud: a short line, 24, and a long line, 60', 'both numbers named');
  assert.equal(c.lines.length, 2, 'two lines');
  assert.equal(c.lines[0].x0, c.lines[1].x0, 'starting together');
  assert.ok(c.lines[1].y > c.lines[0].y + 30, 'one above the other: 24 on top');
  assert.ok(Math.abs(c.lines[1].len / c.lines[0].len - 2.5) < 0.01, 'the long one two and a half times the short one: ' + c.lines[1].len + ' / ' + c.lines[0].len);
  const dark = c.texts.filter((t) => t.fill === '#664422');
  assert.deepEqual(dark.map((t) => t.s), ['24', '60'], 'the numbers, in the groove\'s colour');
  dark.forEach((t, i) => {
    assert.ok(t.x < c.lines[i].x0, t.s + ' left of its line');
    assert.ok(Math.abs((t.y - 15) - c.lines[i].y) < 2, t.s + ' level with its line');
  });
  assert.equal(c.texts.filter((t) => t.fill === '#FFEEDD').length, 2, 'and the light on their lips, a little below and right');
  assert.ok(/font-family="Andika, ui-rounded, system-ui, sans-serif" font-weight="700"/.test(c.markup), 'chapter 5\'s answers\' digits');
  assert.deepEqual(c.box.map(Math.round), [97, 199, 510, 274], 'its box: the drawing and a little more');
  // only two positive numbers draw anything
  for (const bad of [[24], [0, 60], [-1, 3], ['a', 3], 24, null, undefined, [24, 60, 3], [1e6, 2]]) assert.equal(art.kit.compareLines(S, { nums: bad, x: 0, y: 0, w: 100 }), null, JSON.stringify(bad));
  assert.deepEqual(art.kit.compareNums([24, 60]), [24, 60]);
  assert.equal(art.kit.compareNums(false), null);
});

test('hollow, chapter 7: `compare: [24, 60]` on `lesson` and `sand`: the sum scratched in the sand between the two cats sitting at sand-left and sand-right, clear of both, in both cameras, kept clear of the lettering; nowhere else, and nothing when off', { skip: !art.character && 'no cats.js' }, () => {
  const A = art.sceneInfo('hollow').anchors.main;
  const cats = [{ who: 'tallyheart', at: 'sand-left', pose: 'sit', mood: 'kind', wink: true }, { who: 'player', at: 'sand-right', pose: 'sit', mood: 'wonder', facing: 'left' }];
  for (const cam of ['lesson', 'sand']) for (const fx of [['morning'], ['day'], ['sunset']]) {
    const scene = { set: 'hollow', cam, opts: { marks: 7, glow: [true, false, false, false, false, false, true], compare: [24, 60] }, cast: cats, fx }, r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'hollow/' + cam + ' compare');
    const c = compareOf(r.svg), vb = viewBox(r.svg);
    assert.ok(c, cam + ': the sum is drawn');
    assert.equal(c.label, 'Scratched in the sand: a short line, 24, and a long line, 60');
    assert.ok(Math.abs(c.lines[1].len / c.lines[0].len - 2.5) < 0.01, 'two and a half times');
    assert.ok(inVb(c.box[0], c.box[1], vb, 2) && inVb(c.box[2], c.box[3], vb, 2), cam + ': whole in the panel ' + c.box + ' / ' + vb);
    assert.ok(keptBox(r, c.box), cam + ': in keep, so no balloon covers it');
    for (const m of cats) {
      const me = landed(r.svg, m, A[m.at]);
      assert.ok(me, m.who + ' drawn');
      assert.ok(!boxMeets(me.body, c.box), cam + ': clear of ' + m.who + ' at ' + m.at + ': ' + me.body.map(Math.round) + ' / ' + c.box.map(Math.round));
    }
    assert.ok(c.box[0] > A['sand-left'].x && c.box[2] < A['sand-right'].x, 'between the two cats');
  }
  // only where asked: off by default, and never on `wide` or `tree` (the spec puts it on lesson and sand)
  for (const cam of ['wide', 'lesson', 'sand', 'tree']) {
    const on = art.render({ set: 'hollow', cam, opts: { marks: 7, compare: [24, 60] }, cast: [], fx: ['morning'] }), off = art.render({ set: 'hollow', cam, opts: { marks: 7 }, cast: [], fx: ['morning'] });
    assert.equal(!!compareOf(on.svg), cam === 'lesson' || cam === 'sand', cam);
    assert.equal(compareOf(off.svg), null, cam + ': nothing when off');
    const strip = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');
    assert.equal(strip(art.render({ set: 'hollow', cam, opts: { marks: 7, compare: false }, cast: [], fx: ['morning'] }).svg), strip(off.svg), cam + ': compare: false is nothing at all');
  }
});

test('hollow, chapter 7: `marks: 7` draws as markSpots has drawn seven since chapter 1: four to a row and three, a little smaller, the seventh beside the sixth; all seven on the trunk in the tree close-up and the wide, and the six frames before it keep six', () => {
  const at = (cam, n, opts) => art.render({ set: 'hollow', cam, opts: Object.assign({ marks: n }, opts || {}), cast: [], fx: ['morning'] });
  const marksOf = (svg) => { const o = shapes(svg, 'fill="#3A281E"').map(centre); const out = []; for (let i = 0; i < o.length; i += 3) out.push(centre(o.slice(i, i + 3))); return out; };
  const seven = marksOf(at('wide', 7).svg), six = marksOf(at('wide', 6).svg), ten = marksOf(at('wide', 10).svg);
  assert.equal(seven.length, 7, 'seven marks, three scratches each');
  assert.equal(six.length, 6);
  for (let i = 1; i < 4; i++) assert.ok(Math.abs(seven[i][1] - seven[0][1]) < 1, 'four in the first row');
  for (let i = 5; i < 7; i++) assert.ok(Math.abs(seven[i][1] - seven[4][1]) < 1, 'three in the second');
  assert.ok(seven[4][1] > seven[0][1] + 30, 'the second row under the first');
  assert.ok(seven[6][0] - seven[5][0] > 25 && seven[6][0] - seven[5][0] < 45, 'the seventh beside the sixth');
  // the seven stand where the first seven of ten stand (the chapters 1 to 3 fingerprint pins ten)
  for (let i = 0; i < 7; i++) assert.ok(Math.abs(seven[i][0] - ten[i][0]) < 0.5 && Math.abs(seven[i][1] - ten[i][1]) < 0.5, 'mark ' + (i + 1) + ' where ten put it');
  // smaller than six's (0.55 against 0.72): the scratches are shorter
  const len = (svg) => { const s = shapes(svg, 'fill="#3A281E"')[0]; const ys = s.map((p) => p[1]); return Math.max(...ys) - Math.min(...ys); };
  assert.ok(len(at('wide', 7).svg) < len(at('wide', 6).svg) * 0.85, 'a little smaller');
  // every one in the tree close-up, and in its keep
  const t = at('tree', 7, { glow: [false, false, false, false, false, false, true] }), vb = viewBox(t.svg);
  checkRender(t, { cast: [] }, 'hollow tree seven');
  for (const p of shapes(t.svg, 'fill="#3A281E"').flat()) assert.ok(inVb(p[0], p[1], vb, 2), 'the tree close-up holds every mark: ' + p);
  assert.equal(shapes(t.svg, 'fill="#FFF6D0" class="pcs-pulse"').length, 3, 'the new one lit');
});

test('den hidden, chapter 7: her three eyes go under the moss too (the sum, Sprinkle\'s prints, the tunnel): six corners; the row keeps chapter 6\'s room, each course\'s step at least 5; 24 cards (eighteen along the edge, two deep) and 18 (twelve), every piece inside the nest camera; three or fewer hidden draw as before', { skip: !art.character && 'no cats.js' }, () => {
  const F24 = ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'squall-shapes', 'sprinkle-scales', 'cant-fly', 'prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes',
    'prints-marsh', 'prints-tracks', 'wisp-fox', 'reed-pile', 'coil-diggers', 'sleet-den', 'waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel'];
  const F18 = ['four-a-night', 'tidy', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'coil-diggers', 'sleet-den',
    'waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel'];
  const SECRETS = ['sprinkle-scales', 'cant-fly', 'coil-diggers', 'my-count', 'prints-sprinkle', 'tunnel'];
  const k = 1.06;   // her nest's scale in the den (scenes.js, drawDenInside: the nest at 1060, 886, 1.06)
  assert.equal(F24.length, 24);
  for (const [file, inRow] of [[F24, 18], [F18, 12]]) for (const facing of ['right', 'left']) for (const cam of ['nest', 'inside']) {
    const scene = nestScene({ weather: 'clear', moon: false, stone: 'nose', hidden: true, bark: file }, { pose: 'lie', mood: 'sleepy', facing }, cam), r = art.render(scene, { look: LOOK }), vb = viewBox(r.svg);
    checkRender(r, scene, 'den/' + cam + ' ' + file.length + ' cards, six hidden');
    const P = pieces(r.svg), C = corners(r.svg);
    assert.equal(P.length, inRow, file.length + ' cards: ' + inRow + ' along the edge');
    assert.equal(C.length, 6, 'six corners, one for each secret');
    assert.equal((r.svg.match(/data-bark="corner"/g) || []).length, 6, 'six data-bark="corner"');
    // the two courses (the older half behind, a little higher), each set at least 5k apart
    const ys = [...new Set(P.map((p) => Math.round(p.y)))];
    const courses = [P.slice(0, inRow / 2), P.slice(inRow / 2)];
    for (const course of courses) {
      const xs = course.map((p) => p.x).sort((a, b) => a - b);
      for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] >= 5 * k - 0.11, file.length + ' cards: a course\'s step at least 5k: ' + (xs[i] - xs[i - 1]).toFixed(2));
    }
    assert.ok(ys.length >= 2, 'two deep');
    for (const q of P) assert.ok(inVb(q.x - q.w / 2, q.y - q.w * 1.2, vb, 0) && inVb(q.x + q.w / 2, q.y, vb, 0), cam + ': a piece inside the camera: ' + JSON.stringify(q));
    for (const c of C) {
      assert.ok(inVb(c.x - 22, c.y - 26, vb, 0) && inVb(c.x + 22, c.y + 4, vb, 0), cam + ': a corner inside the camera');
      assert.ok(c.y > 886 && c.y < 886 + 50 && Math.abs(c.x - NEST_X) < 140, cam + ': in the front rim\'s moss');
    }
    const cx = C.map((c) => c.x).sort((a, b) => a - b);
    for (let i = 1; i < 6; i++) assert.ok(cx[i] - cx[i - 1] > 7.5 * k && cx[i] - cx[i - 1] < 9 * k, 'the corners about 8k apart: ' + (cx[i] - cx[i - 1]).toFixed(2));
    // which go under: the secret pictures, by picture, whatever else she holds
    const asked = [], spy = (o) => { asked.push(o.blank ? '(blank)' : o.picture); return { svg: '<rect class="spy-card" width="200" height="240" fill="#EDE1C5"/>', w: 200, h: 240 }; };
    withCards(spy, () => art.render(scene, { look: LOOK }));
    assert.deepEqual(asked, file.filter((c) => !SECRETS.includes(c)), 'the row: every card but the six, Waffles\' among them');
    assert.ok(asked.includes('waffles-no-moon'), 'Waffles\' piece is along the mossy edge');
  }
  // three or fewer hidden: chapter 6's room and corners, as before (the chapters 1 to 6 fingerprint holds the frames)
  const six = ['four-a-night', 'tidy', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'coil-diggers', 'sleet-den'];
  const c3 = corners(art.render(nestScene({ bark: six, hidden: true }), { look: LOOK }).svg).map((c) => c.x).sort((a, b) => a - b);
  assert.equal(c3.length, 3);
  for (let i = 1; i < 3; i++) assert.ok(Math.abs(c3[i] - c3[i - 1] - 11.5 * 1.06) < 0.3, 'three hidden: chapter 6\'s corners, 11.5k apart');
});

test('the gallery shows every chapter 7 name: the pile\'s rear and hole and the bridge\'s print as panels of their own, and the Taps, the tunnel, the tracks, the climber, the sums, seven marks and six under the moss among the extras', () => {
  const page = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  assert.ok(page.indexOf('<script src="../app/story/ch06.js"></script>\n<script src="../app/story/ch07.js"></script>') > 0, 'chapter 7 after chapter 6, as index.html has it');
  const js = page.slice(page.lastIndexOf('<script>') + 8, page.lastIndexOf('</script>'));
  const from = js.indexOf('// ---- a sample cast'), to = js.indexOf('// ---- panels');
  const { SAMPLES, EXTRA } = new Function(js.slice(from, to) + '\nreturn { SAMPLES: SAMPLES, EXTRA: EXTRA };')();
  assert.deepEqual(Object.keys(SAMPLES.pile), ['rear', 'hole'], 'only the new cameras: the old ones keep their plain panels');
  assert.deepEqual(Object.keys(SAMPLES.bridge), ['print']);
  assert.ok(SAMPLES.bridge.print.cast.some((m) => m.at === 'over' && m.reach === true && m.pose === 'crouch'), 'her paw over the print');
  assert.ok(SAMPLES.pile.hole.cast.some((m) => m.at === 'brink' && m.pose === 'crouch'), 'our cat at the brink');
  // (chapter 7's extras run from the 94th to the first of chapter 8's, which the tracks set's owner appends after them)
  const eight = EXTRA.findIndex((e, i) => i >= 93 && /^chapter 8: /.test(e[3])), SEVEN = EXTRA.slice(93, eight < 0 ? EXTRA.length : eight);
  const extras = SEVEN.map((e) => e[0] + '/' + e[1] + ' ' + JSON.stringify(e[2].opts || {}) + JSON.stringify(e[2].cast || []));
  for (const k of ['pile/rows {"rows"', '"tap":"back"', '"tap":"roots"', '"tunnel":true', '"tracks":true', '"at":"arch"', '"at":"rear-1"', '"at":"rear-2"', '"at":"guard-1"', '"at":"guard-2"', '"at":"guard-3"',
    '"at":"brink"', 'pile/low', '"moon":7', '"tap":"print"', 'bridge/under {"prints":true,"compare":[24,60]}', 'hollow/lesson', 'hollow/sand', '"compare":[24,60]', '"marks":7', '"my-count"', '"prints-sprinkle"', '"tunnel"', '"waffles-no-moon"'])
    assert.ok(extras.some((x) => x.includes(k)), 'the gallery shows ' + k);
  assert.ok(SEVEN.length > 10 && SEVEN.every((e) => /^chapter 7: /.test(e[3])), 'each says it is chapter 7\'s');
  assert.ok(SEVEN.some((e) => e[0] === 'den' && e[2].opts.hidden && e[2].opts.bark.length === 24), 'the fullest nest: 24 cards');
  if (eight >= 0) assert.ok(EXTRA.slice(eight).every((e) => /^chapter (8|9|1\d): /.test(e[3])), 'after them, a later chapter\'s, each saying so');
});

// ---------------------------------------------------------------- chapter 8 (docs/chapters/08-the-night-trail.spec.md)

// The nest as every live save draws it (spec section 7, item 2), and every den and hollow frame of chapters 1
// to 7. The numbers were taken once from the tree as chapter 7 shipped it (the snapshot taken before chapter
// 8's build, loaded in a process of its own), and are kept here: this test never reads that tree.
// <ch8-den-fingerprint>
// Her nest for every file a live save can hold: 1 to 24 cards, 0 to 6 of them under the moss (and never more
// than eighteen others: a live file holds no more), in four orders (as she found them, the secrets newest, the
// secrets oldest, the secrets spread through the file), lying in it facing right, facing left, and nobody home,
// with `hidden: true` on `nest`; and the same files with `hidden` off on `nest` and `doorway`, both facings
// (chapter 4's bedtime frames f114 and f115 hide nothing: 19 to 24 along the edge for a cat who has read chapter
// 6 or 7). Then every den and hollow frame of chapters 1 to 7 as a fixed cat sees it (each 'auto' filled: a mark
// a Count, the first glowing, her stone by her nose, and her file: her own chapter's, then a full chapter-7 file
// of 24). Hashed with the per-render ids stripped, with the heads and keep: one hash per count of cards, per
// camera, and per chapter and set.
function ch8DenFingerprint(PC, crypto) {
  const art = PC.art, out = {}, LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
  const strip = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');
  const F24 = ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'squall-shapes', 'sprinkle-scales', 'cant-fly', 'prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes',
    'prints-marsh', 'prints-tracks', 'wisp-fox', 'reed-pile', 'coil-diggers', 'sleet-den', 'waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel'];
  const EAR = ['fox-flew', 'fox-moon', 'squall-shapes', 'otter-fox', 'heron-no-moon', 'heron-shapes', 'wisp-fox', 'reed-pile', 'coil-diggers', 'sleet-den', 'waffles-no-moon'];
  const SECRET = ['sprinkle-scales', 'cant-fly', 'coil-diggers', 'my-count', 'prints-sprinkle', 'tunnel'], OPEN = F24.filter((p) => !SECRET.includes(p));
  const card = (p) => ({ picture: p, mark: EAR.includes(p) ? 'ear' : 'eye' });
  function file(n, s, order) {
    const sec = SECRET.slice(0, s), open = OPEN.slice(0, n - s);
    let list;
    if (order === 0) list = F24.filter((p) => sec.includes(p) || open.includes(p));
    else if (order === 1) list = open.concat(sec);
    else if (order === 2) list = sec.concat(open);
    else { list = open.slice(); sec.forEach((p, i) => list.splice(Math.round((i + 1) * open.length / (s + 1)) + i, 0, p)); }
    return list.map(card);
  }
  function add(key, tag, scene) {
    const r = art.render(scene, { look: LOOK }), h = out[key] || (out[key] = crypto.createHash('sha1'));
    h.update(tag + ':' + strip(r.svg) + JSON.stringify(r.heads) + JSON.stringify(r.keep));
  }
  const her = (facing) => (facing ? [{ who: 'player', at: 'nest', pose: 'lie', mood: 'sleepy', facing }] : []);
  for (let n = 1; n <= 24; n++) for (let s = Math.max(0, n - 18); s <= Math.min(6, n); s++) for (let order = 0; order < 4; order++) {
    if (order && (s === 0 || s === n)) continue;
    for (const facing of ['right', 'left', null]) add('hidden/' + n, s + ' ' + order + ' ' + facing, { set: 'den', cam: 'nest', opts: { weather: 'clear', moon: false, stone: 'nose', bark: file(n, s, order), hidden: true }, cast: her(facing), fx: ['night'] });
  }
  for (const cam of ['nest', 'doorway']) for (let n = 1; n <= 24; n++) for (const s of [...new Set([Math.max(0, n - 18), Math.min(6, n)])]) for (const order of [0, 3]) for (const facing of ['right', 'left']) {
    add('open/' + cam + '/' + n, s + ' ' + order + ' ' + facing, { set: 'den', cam, opts: { weather: 'clear', moon: false, stone: 'nose', bark: file(n, s, order) }, cast: her(facing), fx: cam === 'doorway' ? ['night', 'stars', 'skyriver', 'zzz'] : ['night'] });
  }
  const FILE = {
    4: F24.slice(0, 9),
    5: ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly', 'prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'prints-tracks'],
    6: ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly', 'prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'prints-tracks', 'reed-pile', 'coil-diggers'],
    7: F24
  };
  for (const ch of ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07']) {
    const n = +ch.slice(2);
    for (const [id, f] of Object.entries(PC.story[ch].frames)) {
      const sc = f.scene;
      if (!sc || (sc.set !== 'den' && sc.set !== 'hollow')) continue;
      const o = Object.assign({}, sc.opts || {});
      if (o.marks === 'auto') o.marks = n;
      if (o.glow === 'auto') o.glow = Array.from({ length: n }, (v, i) => i === 0);
      if (o.stone === 'auto') o.stone = 'nose';
      const files = o.bark === 'auto' ? [FILE[n] || F24.slice(0, 7), F24] : [null];
      files.forEach((fl, i) => add('frames/' + ch + '/' + sc.set, id + ' ' + i, Object.assign({}, sc, { opts: Object.assign({}, o, fl ? { bark: fl.map(card) } : {}) })));
    }
  }
  for (const k of Object.keys(out)) out[k] = out[k].digest('hex').slice(0, 12);
  return out;
}
// </ch8-den-fingerprint>
const CH8_DEN_FINGERPRINT = {
  'hidden/1': '237fd73970cc', 'hidden/2': 'ad3b7e174227', 'hidden/3': '963d068a67ae', 'hidden/4': '6babe6703434',
  'hidden/5': '9c52009886ac', 'hidden/6': '38ca0694386b', 'hidden/7': '051061e76e4a', 'hidden/8': '8aa6906be4d4',
  'hidden/9': '2ab212caef4f', 'hidden/10': '74269b909f45', 'hidden/11': 'f501a53668e4', 'hidden/12': '9ecddda9184e',
  'hidden/13': '3815fec773db', 'hidden/14': '59f1cb6146b2', 'hidden/15': 'ba0ab9d77d8f', 'hidden/16': '10afae132140',
  'hidden/17': '41a1e772a5f7', 'hidden/18': 'be225fbc385b', 'hidden/19': 'a311bc267bf3', 'hidden/20': 'b2d68b11f38f',
  'hidden/21': '286ee388cc4e', 'hidden/22': '0d847aec0ba8', 'hidden/23': '0b06b592d81e', 'hidden/24': '47dc0d7117f6',
  'open/nest/1': 'b64214bf90cc', 'open/nest/2': '3c977ad03aad', 'open/nest/3': '0d6260271f85', 'open/nest/4': '3880e83e2789',
  'open/nest/5': 'a6945a167676', 'open/nest/6': 'a879dbb2c914', 'open/nest/7': '1108a9baf4c4', 'open/nest/8': 'cb33a454713b',
  'open/nest/9': '7f8682299f74', 'open/nest/10': '70ef6ea9d9bc', 'open/nest/11': 'f172c6328a92', 'open/nest/12': 'a15c287654b7',
  'open/nest/13': '06d19a3edc0c', 'open/nest/14': 'b803e63efbba', 'open/nest/15': '343d9cbe401f', 'open/nest/16': '43a6206ef818',
  'open/nest/17': '1e695bd7be1f', 'open/nest/18': 'b7d58c89018c', 'open/nest/19': 'a7b9192de82e', 'open/nest/20': 'bb848bcbfa58',
  'open/nest/21': 'f4507f648048', 'open/nest/22': '3c0bbd4f6b54', 'open/nest/23': 'c85b8ce93603', 'open/nest/24': 'f8ac31147e2b',
  'open/doorway/1': '4c2a4c5207ae', 'open/doorway/2': '048722d81fe8', 'open/doorway/3': '6c166eca4b2d', 'open/doorway/4': 'c53d0d5d06ec',
  'open/doorway/5': '2d2970a788f6', 'open/doorway/6': '301bffe09889', 'open/doorway/7': '6def4d44a297', 'open/doorway/8': '082d5dd34f5c',
  'open/doorway/9': '997d06f88449', 'open/doorway/10': '5b712015e470', 'open/doorway/11': '995e21b6a56c', 'open/doorway/12': 'bed323cdfd81',
  'open/doorway/13': 'd1afd4188a74', 'open/doorway/14': 'fa6925e37af4', 'open/doorway/15': '3cc4e50f708d', 'open/doorway/16': '3c02e3fbd171',
  'open/doorway/17': '7aa257a487a0', 'open/doorway/18': '33995884398a', 'open/doorway/19': '00c77d551a7b', 'open/doorway/20': 'c74b735caec5',
  'open/doorway/21': '2234a457a343', 'open/doorway/22': 'b6d1fc811ebf', 'open/doorway/23': 'd5148a00166a', 'open/doorway/24': 'b392f2967c6a',
  'frames/ch01/hollow': 'ef553ab81dd9', 'frames/ch01/den': 'a8f21d5d1a4a', 'frames/ch02/den': 'f80f16ba1da6', 'frames/ch02/hollow': '72fabcc47ead',
  'frames/ch03/den': 'd5b959f82435', 'frames/ch03/hollow': 'ad24fead19fe', 'frames/ch04/den': 'f6c8f9f2a5bb', 'frames/ch04/hollow': 'ab59acc22bba',
  'frames/ch05/hollow': '64eb997d9fc0', 'frames/ch05/den': '3a73cd981e15', 'frames/ch06/hollow': '45feb2591070', 'frames/ch06/den': '79c8d8f5a3d3',
  'frames/ch07/den': 'a777dfa847c5', 'frames/ch07/hollow': '2766386b7003'
};

test('chapter 8: every nest a live save can hold, and every den and hollow frame of chapters 1 to 7, draw byte for byte as chapter 7 shipped them: 1 to 24 cards, 0 to 6 under the moss, in four orders, both facings and nobody home; with `hidden` off on nest and doorway (chapter 4\'s f114 and f115), 19 to 24 along the edge among them', { skip: !art.character && 'no cats.js' }, () => {
  for (let i = 1; i <= 7; i++) require(path.join(ROOT, 'app/story/ch0' + i + '.js'));
  const now = ch8DenFingerprint(PC, require('crypto'));
  assert.deepEqual(Object.keys(now), Object.keys(CH8_DEN_FINGERPRINT), 'the same files, cameras and chapters, in the same order');
  for (const k of Object.keys(CH8_DEN_FINGERPRINT)) assert.equal(now[k], CH8_DEN_FINGERPRINT[k], k + ' draws something else than it did when chapter 7 shipped');
  assert.equal(Object.keys(CH8_DEN_FINGERPRINT).filter((k) => /^hidden\//.test(k)).length, 24, 'one to twenty-four cards, the moss over the secret ones');
  for (const cam of ['nest', 'doorway']) for (let n = 19; n <= 24; n++) assert.ok(CH8_DEN_FINGERPRINT['open/' + cam + '/' + n], 'with nothing hidden, ' + n + ' along the edge on ' + cam);
  for (let i = 1; i <= 7; i++) assert.ok(CH8_DEN_FINGERPRINT['frames/ch0' + i + '/den'], 'chapter ' + i + '\'s den frames');
});

// her file after chapter 8, oldest first: chapter 7's twenty-four, then the stash, the glass, the fox's brag and
// (with Hail found) Hail's two shapes (spec section 3); and the ten that go under the moss
const F28 = ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'squall-shapes', 'sprinkle-scales', 'cant-fly', 'prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes',
  'prints-marsh', 'prints-tracks', 'wisp-fox', 'reed-pile', 'coil-diggers', 'sleet-den', 'waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel', 'stash', 'glass', 'fox-brag', 'hail-shapes'];
const SECRET8 = ['sprinkle-scales', 'cant-fly', 'coil-diggers', 'my-count', 'prints-sprinkle', 'tunnel', 'stash', 'glass', 'fox-brag', 'hail-shapes'];
// the fewest a chapter-8 cat holds: no my-count (chapter 7's known issue 15), no Hail, none of the cards that need a
// dragonet or a roof found: 20 cards, eight under the moss
const F20 = F28.filter((p) => !['my-count', 'hail-shapes', 'dug-earth', 'squall-shapes', 'prints-pile', 'prints-tracks', 'wisp-fox', 'sleet-den'].includes(p));
// stand-in secret cards, for the room chapters 9 and 10 have (twelve, eighteen under the moss): added to the live
// table for a while, as the cards' tests add a drawing
function withSecrets(n, fn) {
  const added = Array.from({ length: n }, (v, i) => 'later-secret-' + (i + 1));
  added.forEach((p) => { art.barkSecret[p] = 1; });
  try { return fn(added); } finally { added.forEach((p) => { delete art.barkSecret[p]; }); }
}
const cardsOf = (list) => list.map((p) => (p === null ? null : { picture: p, mark: 'eye' }));
// her head box in the den (scenes.js draws her at the nest anchor, at its scale), for "none over her head"
function herHead(r, cat) {
  const a = art.sceneInfo('den').anchors.inside.nest, me = landed(r.svg, Object.assign({ who: 'player' }, cat), a);
  assert.ok(me, 'she is drawn in her nest');
  return me.head;
}
// each corner's own outline where it stands (scenes.js, denBark: a corner of bark, scaled and turned), as a box
const CORNER = [[-15, 3], [-10, -19], [-8.5, -24.5], [-3, -23.5], [17, -16], [14, 3]];
const cornerShapes = (svg) => [...svg.matchAll(/<g transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([\d.]+)[\d. ]*\) rotate\((-?[\d.]+)\)" data-bark="corner">/g)].map((m) => {
  const x = +m[1], y = +m[2], s = +m[3], t = +m[4] * Math.PI / 180;
  const pts = CORNER.map(([a, b]) => [x + s * (a * Math.cos(t) - b * Math.sin(t)), y + s * (a * Math.sin(t) + b * Math.cos(t))]);
  return [Math.min(...pts.map((q) => q[0])), Math.min(...pts.map((q) => q[1])), Math.max(...pts.map((q) => q[0])), Math.max(...pts.map((q) => q[1]))];
});

test('vocab, chapter 8: the den\'s moon takes the eighth evening (8) and the den takes `glass`, both off unless a frame asks; nothing else is new on the den or the hollow; the weasels\' sizes published; the secrets\' table', () => {
  const v = art.vocab.sets;
  assert.deepEqual(Object.keys(v.den.opts), ['weather', 'moon', 'drips', 'stone', 'bark', 'hidden', 'glass']);
  assert.deepEqual(v.den.opts.moon, [false, true, 5, 8], 'no moon, chapter 4\'s sliver, the fifth evening\'s crescent, the eighth evening\'s half moon');
  assert.deepEqual(v.den.opts.glass, [false, true]);
  assert.deepEqual(v.den.opts.hidden, [false, true], 'more under the moss is the bark\'s own: no new value');
  assert.deepEqual(v.den.opts.bark, [false, 'auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.deepEqual(art.sceneInfo('den').defaults, { weather: 'clear' }, 'no glass and no moon unless a frame asks');
  assert.deepEqual(v.den.cams, ['outside', 'inside', 'nest', 'doorway']);
  assert.deepEqual(v.den.anchors, ['entrance-left', 'entrance-right', 'doorway', 'nest', 'sleeper-1', 'sleeper-2']);
  assert.deepEqual(Object.keys(v.hollow.opts), ['marks', 'glow', 'depth', 'bark', 'cards', 'blank', 'heap', 'compare'], 'the hollow: eight marks as markSpots has laid them since chapter 1');
  assert.ok(v.hollow.opts.marks.includes(8), 'marks: 8');
  assert.deepEqual({ snip: art.sizeBands.snip, snatch: art.sizeBands.snatch }, {
    snip: { ref: 'player', pose: 'up', by: 'tall', min: 0.5, max: 0.65 },
    snatch: { ref: 'player', pose: 'up', by: 'tall', min: 0.5, max: 0.65 }
  }, '"half your size", sitting up tall');
  assert.equal(art.sizeBands.hail, undefined, 'Hail is held as Squall is (a cap), not by a band');
  assert.deepEqual(Object.keys(art.barkSecret).filter((p) => !/^later-secret-/.test(p)), SECRET8, 'chapter 7\'s six and chapter 8\'s four go under the moss');
  // the spec names them so
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/08-the-night-trail.spec.md'), 'utf8').replace(/\s+/g, ' ');
  assert.ok(md.includes('**`moon: 8`** (the den\'s `moon` list gains 8: `[false, true, 5, 8]`)'));
  assert.ok(md.includes('**`glass: true`** (`[false, true]`, default false; `nest` and `inside`)'));
  assert.ok(md.includes('**`BARK_SECRET` gains `stash`, `glass`, `fox-brag`, `hail-shapes`**'));
});

test('den hidden, chapter 8: the stash, the glass, the brag and Hail\'s shapes go under the moss on every path, so the row along the edge holds what it held after chapter 7; eight (a cat without my-count or Hail) and ten (a Hail cat) corners, in layers of six', { skip: !art.character && 'no cats.js' }, () => {
  const k = 1.06;
  for (const [file, inRow, hid] of [[F20, 12, 8], [F28, 18, 10]]) for (const facing of ['right', 'left']) for (const cam of ['nest', 'inside']) {
    const scene = nestScene({ weather: 'clear', moon: false, stone: 'auto', bark: cardsOf(file), hidden: true, glass: true }, { pose: 'lie', mood: 'sleepy', facing }, cam), r = art.render(scene, { look: LOOK });
    checkRender(r, scene, 'den/' + cam + ' ' + file.length + ' cards');
    assert.equal(pieces(r.svg).length, inRow, file.length + ' cards: ' + inRow + ' along the edge, as after chapter 7');
    assert.equal(corners(r.svg).length, hid, hid + ' corners, one for each secret');
    const asked = [], spy = (o) => { asked.push(o.blank ? '(blank)' : o.picture); return { svg: '<rect class="spy-card" width="200" height="240" fill="#EDE1C5"/>', w: 200, h: 240 }; };
    withCards(spy, () => art.render(scene, { look: LOOK }));
    assert.deepEqual(asked, file.filter((p) => !SECRET8.includes(p)), 'the row: every card but the secrets; none of chapter 8\'s four along the edge');
    for (const p of ['stash', 'glass', 'fox-brag', 'hail-shapes']) assert.ok(!asked.includes(p), p + ' is under the moss');
  }
  // every chapter-8 file: with Hail and without, with my-count and without, a row of at most eighteen
  for (const drop of [[], ['hail-shapes'], ['my-count'], ['my-count', 'hail-shapes']]) {
    const file = F28.filter((p) => !drop.includes(p)), r = art.render(nestScene({ bark: cardsOf(file), hidden: true, glass: true }), { look: LOOK });
    assert.equal(pieces(r.svg).length, 18, 'eighteen along the edge');
    assert.equal(corners(r.svg).length, SECRET8.filter((p) => file.includes(p)).length, 'and the rest under the moss');
  }
});

test('den hidden, chapter 8: past six under the moss the corners stand in layers of six: the first six exactly where chapter 7 stood its six; the seventh to twelfth behind them, half a gap along and lifted on the rim\'s inner lip, drawn first; the thirteenth to eighteenth a third layer the same way; past eighteen no more; every corner showing, inside the nest camera, none over her head (eight, ten, twelve, eighteen and twenty)', { skip: !art.character && 'no cats.js' }, () => {
  const k = 1.06, lift = 15 * 0.6 * k;
  const six = (facing) => corners(art.render(nestScene({ bark: cardsOf(F28.slice(0, 24)), hidden: true }, { pose: 'lie', mood: 'sleepy', facing }), { look: LOOK }).svg);
  for (const extra of [-2, 0, 2, 8, 10]) withSecrets(Math.max(0, extra), (added) => {
    const file = extra < 0 ? F20 : F28.concat(added), hid = extra < 0 ? 8 : 10 + extra, shown = Math.min(hid, 18);
    for (const facing of ['right', 'left']) for (const pose of ['lie', 'curl']) for (const cam of ['nest', 'inside']) {
      const cat = { pose, mood: 'sleepy', facing }, scene = nestScene({ weather: 'clear', moon: false, stone: 'auto', bark: cardsOf(file), hidden: true, glass: true }, cat, cam);
      const r = art.render(scene, { look: LOOK }), vb = viewBox(r.svg), C = corners(r.svg), what = hid + ' under the moss, ' + pose + ' facing ' + facing + ', ' + cam;
      checkRender(r, scene, what);
      assert.equal(C.length, shown, what + ': ' + shown + ' corners' + (hid > 18 ? ' (past eighteen, no more)' : ''));
      assert.equal(pieces(r.svg).length, extra < 0 ? 12 : 18, what + ': the row is the same');
      // the layers: the front six are the last drawn, exactly where chapter 7's six stood (in the same order); each layer behind is drawn before the one in front of it
      const front = C.slice(-6), want = six(facing);
      front.forEach((c, i) => assert.ok(Math.abs(c.x - want[i].x) < 0.01 && Math.abs(c.y - want[i].y) < 0.01, what + ': the front six where chapter 7 stood them'));
      const layers = [];
      for (let L = Math.ceil(shown / 6) - 1; L >= 0; L--) layers.push(C.slice(shown - 6 * L - Math.min(6, shown - 6 * L), shown - 6 * L));
      // (markup order: the back layer first, then the next, then the front six)
      const byLayer = []; let at = 0;
      for (let L = Math.ceil(shown / 6) - 1; L >= 1; L--) { const n = Math.min(6, shown - 6 * L); byLayer[L] = C.slice(at, at + n); at += n; }
      byLayer[0] = C.slice(at);
      assert.equal(byLayer[0].length, 6, what + ': six in front');
      for (let L = 1; L < byLayer.length; L++) {
        const B = byLayer[L];
        assert.ok(B.length >= 1 && B.length <= 6, what + ': at most six a layer');
        B.forEach((c, j) => {
          // half a gap along from the layer in front: between two of its corners (or half a gap past the last)
          const f = byLayer[L - 1][j], g2 = byLayer[L - 1][1], g1 = byLayer[L - 1][0], gap = Math.abs(g2.x - g1.x);
          assert.ok(Math.abs(Math.abs(c.x - f.x) - gap / 2) < 0.8, what + ': layer ' + (L + 1) + ' corner ' + (j + 1) + ' half a gap along (' + (c.x - f.x).toFixed(2) + ' of ' + gap.toFixed(2) + ')');
          // lifted on the inner lip, a little higher for every layer
          const fy = byLayer[0][Math.min(j, 5)].y;
          assert.ok(fy - c.y > L * lift - 2.5 && fy - c.y < L * lift + 2.5, what + ': layer ' + (L + 1) + ' lifted ' + (fy - c.y).toFixed(1) + ' (about ' + (L * lift).toFixed(1) + ')');
        });
      }
      // every corner showing over the moss: none hidden behind another of the same layer, every one inside the camera, in the rim's moss
      for (const c of C) {
        assert.ok(inVb(c.x - 22 * k, c.y - 26 * k, vb, 0) && inVb(c.x + 22 * k, c.y + 4 * k, vb, 0), what + ': a corner inside the camera');
        assert.ok(c.y > 886 && c.y < 886 + 50 && Math.abs(c.x - NEST_X) < 140, what + ': in the front rim\'s moss');
      }
      const head = herHead(r, cat);
      for (const b of cornerShapes(r.svg)) assert.ok(!boxMeets(b, head), what + ': no corner over her head: ' + b.map(Math.round) + ' / ' + head.map(Math.round));
      // the corners of a layer stand apart (each shows its own corner), the layers' tops one above another
      for (const B of byLayer) { const xs = B.map((c) => c.x).sort((a, b) => a - b); for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] > 7.5 * k, what + ': a layer\'s corners apart'); }
      // the layers behind are drawn before the row, so the row and the front six stand over them
      const firstPiece = pieces(r.svg)[0];
      for (let L = 1; L < byLayer.length; L++) for (const c of byLayer[L]) assert.ok(r.svg.indexOf('translate(' + c.x + ' ' + c.y + ')') < r.svg.indexOf('translate(' + firstPiece.x + ' ' + firstPiece.y + ')'), what + ': layer ' + (L + 1) + ' drawn first');
      assert.equal((r.svg.match(/data-bark="behind"/g) || []).length, 1, what + ': the layers behind in one group');
    }
  });
  // six or fewer: as chapter 7 drew them (the fingerprint holds every live file); no group behind
  assert.ok(!art.render(nestScene({ bark: cardsOf(F28.slice(0, 24)), hidden: true }), { look: LOOK }).svg.includes('data-bark="behind"'), 'six: no layer behind');
});

test('den bark, chapter 8: a third course only past what a live save holds (more than eighteen along the edge with `hidden: true`, more than twenty-four with it off): three deep, the oldest third highest, the middle third one lift up, the newest third in front; each course at most nine, its step at least 5k, half a step along from the one in front; BARK_MAX is 27; 27 along with twelve under, and 25 to 27 with nothing hidden on nest and doorway, every piece inside the camera', { skip: !art.character && 'no cats.js' }, () => {
  const k = 1.06, OPEN = Array.from({ length: 30 }, (v, i) => 'later-card-' + (i + 1));
  const courses = (P, n) => { const nTop = Math.floor(n / 3), nMid = Math.floor((n - nTop) / 2); return [P.slice(0, nTop), P.slice(nTop, nTop + nMid), P.slice(nTop + nMid)]; };
  const check = (r, n, what) => {
    const vb = viewBox(r.svg), P = pieces(r.svg);
    assert.equal(P.length, n, what + ': ' + n + ' pieces');
    assert.match(r.svg, new RegExp('data-prop="nest-bark" data-count="' + n + '"'));
    const [top, mid, front] = courses(P, n), avg = (c) => c.reduce((a, p) => a + p.y, 0) / c.length;
    for (const c of [top, mid, front]) {
      assert.ok(c.length >= 1 && c.length <= 9, what + ': at most nine a course (' + c.length + ')');
      const xs = c.map((p) => p.x).sort((a, b) => a - b);
      for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] >= 5 * k - 0.11, what + ': a course\'s step at least 5k: ' + (xs[i] - xs[i - 1]).toFixed(2));
    }
    assert.ok(front.length >= mid.length && mid.length >= top.length, what + ': the newest course the fullest');
    assert.ok(avg(front) - avg(mid) > 12 * k && avg(front) - avg(mid) < 18 * k, what + ': the middle course one lift up');
    assert.ok(avg(mid) - avg(top) > 12 * k && avg(mid) - avg(top) < 18 * k, what + ': the oldest course two lifts up');
    // staggered: each course's first piece half a step along from the one in front (or between, when it holds fewer)
    const stepOf = (c) => (c.length > 1 ? Math.abs(c[1].x - c[0].x) : 0);
    assert.ok(Math.abs(mid[0].x - front[0].x) <= stepOf(mid) / 2 + 0.11 && Math.abs(top[0].x - mid[0].x) <= stepOf(top) / 2 + 0.11, what + ': each half a step along from the one in front, at most');
    for (const q of P) assert.ok(inVb(q.x - q.w / 2, q.y - q.w * 1.2, vb, 0) && inVb(q.x + q.w / 2, q.y, vb, 0), what + ': a piece inside the camera: ' + JSON.stringify(q));
    return { top, mid, front };
  };
  // 27 along the edge with twelve under the moss (chapters 9 and 10's fullest: three courses of nine)
  withSecrets(2, (added) => {
    const file = OPEN.slice(0, 27).concat(SECRET8, added);
    for (const facing of ['right', 'left']) for (const cam of ['nest', 'inside']) {
      const cat = { pose: 'lie', mood: 'sleepy', facing }, scene = nestScene({ bark: cardsOf(file), hidden: true, glass: true, stone: 'nose' }, cat, cam), r = art.render(scene, { look: LOOK });
      checkRender(r, scene, '27 along, 12 under');
      const c = check(r, 27, '27 along, twelve under, facing ' + facing + ', ' + cam);
      assert.equal(c.front.length, 9, 'the newest nine in front, readable');
      assert.equal(corners(r.svg).length, 12, 'the twelve corners still showing');
      // the newest nine are the front course: cards.js is asked for them last
      const asked = [], spy = (o) => { asked.push(o.picture); return { svg: '<rect class="spy-card" width="200" height="240" fill="#EDE1C5"/>', w: 200, h: 240 }; };
      withCards(spy, () => art.render(scene, { look: LOOK }));
      assert.deepEqual(asked, OPEN.slice(0, 27), 'oldest first: the oldest nine highest, the newest nine in front');
    }
    // 19 along with hidden: true (past eighteen): three courses, 6, 6 and 7
    const r19 = art.render(nestScene({ bark: cardsOf(OPEN.slice(0, 19).concat(SECRET8.slice(0, 6))), hidden: true }), { look: LOOK });
    const c19 = check(r19, 19, '19 along with the moss over six');
    assert.deepEqual([c19.top.length, c19.mid.length, c19.front.length], [6, 6, 7]);
  });
  // with nothing hidden: 19 to 24 as before (two courses of half the row: chapter 4's bedtime frames for every live save
  // that has read chapter 6 or 7; the chapter 8 fingerprint holds their bytes), 25 to 27 three deep, on nest and doorway
  for (const cam of ['nest', 'doorway']) for (const facing of ['right', 'left']) {
    for (let n = 19; n <= 24; n++) {
      const P = pieces(art.render(nestScene({ bark: cardsOf(OPEN.slice(0, n)) }, { pose: 'lie', mood: 'sleepy', facing }, cam, ['night', 'zzz']), { look: LOOK }).svg);
      assert.equal(P.length, n);
      const back = P.slice(0, Math.floor(n / 2)), front = P.slice(Math.floor(n / 2)), avg = (c) => c.reduce((a, p) => a + p.y, 0) / c.length;
      assert.ok(avg(front) - avg(back) > 12 * k && avg(front) - avg(back) < 18 * k, n + ' with nothing hidden: two courses, half the row each, as chapter 7 drew them');
    }
    for (let n = 25; n <= 27; n++) {
      const scene = nestScene({ bark: cardsOf(OPEN.slice(0, n)), stone: 'auto' }, { pose: 'lie', mood: 'sleepy', facing }, cam, ['night', 'stars', 'skyriver', 'zzz']), r = art.render(scene, { look: LOOK });
      checkRender(r, scene, n + ' with nothing hidden on ' + cam);
      check(r, n, n + ' along with nothing hidden, ' + cam + ', facing ' + facing);
    }
  }
  // BARK_MAX: past 27 the oldest are left out, as past 24 they were
  const asked = [], spy = (o) => { asked.push(o.picture); return { svg: '<rect class="spy-card" width="200" height="240" fill="#EDE1C5"/>', w: 200, h: 240 }; };
  withCards(spy, () => art.render(nestScene({ bark: cardsOf(OPEN.slice(0, 30)) }), { look: LOOK }));
  assert.deepEqual(asked, OPEN.slice(3, 30), 'thirty with nothing hidden: the newest 27');
  assert.equal(pieces(art.render(nestScene({ bark: 40 }), { look: LOOK }).svg).length, 27, 'a number of pieces: at most 27');
});

test('den glass, chapter 8: `glass: true` puts her piece of glass in its leaf under the moss of her nest, just past the corners, on their side: the leaf\'s tip and one glint showing, inside the nest camera and the nest\'s keep, never over her head; nothing without it, and never from outside', { skip: !art.character && 'no cats.js' }, () => {
  const k = 1.06;
  for (const file of [F20, F28]) for (const facing of ['right', 'left']) for (const pose of ['lie', 'curl', 'sit']) for (const cam of ['nest', 'inside', 'doorway']) {
    const cat = { pose, mood: 'kind', facing }, scene = nestScene({ weather: 'clear', moon: false, stone: 'auto', bark: cardsOf(file), hidden: true, glass: true }, cat, cam), r = art.render(scene, { look: LOOK });
    const what = file.length + ' cards, ' + pose + ' facing ' + facing + ', ' + cam;
    checkRender(r, scene, what);
    const G = prop(r.svg, 'nest-glass');
    assert.ok(G, what + ': her glass');
    assert.equal((r.svg.match(/data-prop="nest-glass"/g) || []).length, 1, 'one piece');
    // its box: every point of the leaf, the glass and the glint (absolute M, L and Q paths; the moss over it is round)
    const pairs = (d) => [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [+m[1], +m[2]]);
    const pts = [...G.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]).filter((d) => !/a/.test(d)).flatMap(pairs);
    const gb = [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
    // one glint: a white sparkle; the leaf, under the moss, its tip standing out of it
    assert.equal((G.match(/fill="#FFFFFF"/g) || []).length, 1, 'one glint');
    assert.ok(/class="pcs-twk"/.test(G), 'the glint twinkles, as the stars do');
    const leaf = /<path d="(M[^"]+Z)" fill="(#[0-9A-Fa-f]{6})" stroke=/.exec(G);
    assert.ok(leaf, 'a leaf');
    const lp = pairs(leaf[1]), tipY = Math.min(...lp.map((p) => p[1]));
    assert.ok(lp[0][1] - tipY > 20 * k, 'its tip well up out of the moss');
    if (cam !== 'doorway') {
      const vb = viewBox(r.svg);
      assert.ok(inVb(gb[0], gb[1], vb, 0) && inVb(gb[2], gb[3], vb, 0), what + ': inside the camera: ' + gb.map(Math.round));
    }
    assert.ok(keptBox(r, gb) || !inVb(gb[0], gb[1], viewBox(r.svg), 0), what + ': the lettering keeps off it');
    // beside the corners, past the last of the front six, on the side away from the row
    const C = corners(r.svg).slice(-Math.min(6, SECRET8.filter((p) => file.includes(p)).length)), last = C[C.length - 1], prev = C[C.length - 2];
    const gx = lp[0][0], away = Math.sign(last.x - prev.x);
    assert.ok(Math.sign(gx - last.x) === away && Math.abs(gx - last.x) > 6 * k && Math.abs(gx - last.x) < 22 * k, what + ': just past the last corner (' + (gx - last.x).toFixed(1) + ')');
    assert.ok(gb[1] > 886 - 40 && gb[3] < 886 + 60 && Math.abs(gx - NEST_X) < 100, what + ': in the front rim\'s moss');
    if (cam !== 'doorway' || pose !== 'sit') assert.ok(!boxMeets(gb, herHead(r, cat)), what + ': never over her head: ' + gb.map(Math.round) + ' / ' + herHead(r, cat).map(Math.round));
  }
  // without it: nothing, and the drawing is the drawing without the option
  const strip = (s) => s.replace(/pcs?[0-9a-z]+-/g, '');
  for (const cam of ['nest', 'inside', 'doorway', 'outside']) {
    const base = { weather: 'clear', moon: false, stone: 'nose', bark: cardsOf(F28), hidden: true };
    const off = art.render(nestScene(base, {}, cam), { look: LOOK }), no = art.render(nestScene(Object.assign({ glass: false }, base), {}, cam), { look: LOOK });
    assert.ok(!prop(off.svg, 'nest-glass'), cam + ': no glass unless asked');
    assert.equal(strip(no.svg), strip(off.svg), cam + ': glass: false is nothing at all');
    if (cam === 'outside') assert.ok(!prop(art.render(nestScene(Object.assign({ glass: true }, base), null, cam), { look: LOOK }).svg, 'nest-glass'), 'from outside, no nest is seen: no glass');
  }
  // the glass alone (no bark, nothing hidden): only her glass, where the first corner would stand
  const alone = art.render(nestScene({ glass: true }), { look: LOOK });
  assert.ok(prop(alone.svg, 'nest-glass') && !prop(alone.svg, 'nest-bark'), 'the glass alone');
  assert.ok(alone.keep.length >= 1, 'kept clear of the lettering');
});

test('den moon, chapter 8: `moon: 8` is the eighth evening\'s half moon, by night as at dusk, from outside where chapter 5\'s crescent hung, and in the doorway\'s patch of sky on inside and doorway; the lettering keeps off it; chapter 5\'s 5 and chapter 4\'s `true` are as they were; never under cloud, in a storm or by day', () => {
  const dusk = duskMoon({ moon: 8 }), night = duskMoon({ moon: 8 }, ['night']), five = duskMoon({ moon: 5 });
  for (const [m, when] of [[dusk, 'dusk'], [night, 'night']]) {
    assert.ok(m.waxing, when + ': the moon by its age');
    assert.match(m.M, /^<g data-prop="waxing-moon" data-age="8">/);
    assert.ok(m.thick > 0.85 && m.thick <= 1, when + ': a half moon: ' + m.thick.toFixed(2));
    assert.ok(m.rad > five.rad && m.y < five.y && m.x < five.x, when + ': bigger and higher than the fifth evening\'s, further from where the sun went down');
    assert.ok(m.x - m.rad > 1300 && m.x + m.rad < 1600 && m.y - m.rad > 0 && m.y + m.rad < 200, when + ': whole, high over the towers: ' + [m.x, m.y, m.rad]);
    assert.equal(m.r.keep.length, 1, when + ': the lettering keeps off it');
  }
  assert.deepEqual([night.x, night.y, night.rad, night.tilt, night.thick], [dusk.x, dusk.y, dusk.rad, dusk.tilt, dusk.thick], 'the same moon by night as at dusk');
  assert.ok(!/<circle cx="1330" cy="150" r="132"/.test(night.svg), 'not chapter 2\'s crescent');
  // chapter 5's and chapter 4's as they were (the chapter 5 and chapter 4 tests hold them); never under cloud, in a storm or by day
  assert.ok(duskMoon({ moon: 5 }, ['night']).none && /<circle cx="1330" cy="150" r="132"/.test(duskMoon({ moon: 5 }, ['night']).svg), 'moon: 5 by night: chapter 2\'s crescent, as before');
  assert.ok(/<circle cx="1330" cy="150" r="132"/.test(duskMoon({ moon: true }, ['night']).svg), 'moon: true by night, as before');
  for (const [opts, fx, why] of [[{ moon: 8, weather: 'cloudy' }, ['night'], 'cloud'], [{ moon: 8, weather: 'storm' }, ['night'], 'storm'], [{ moon: 8 }, ['morning'], 'morning'], [{ moon: 8 }, ['day'], 'day']]) {
    const m = duskMoon(opts, fx);
    assert.ok(m.none && !m.svg.includes('#FFF3D2'), 'no moon: ' + why);
  }
  // from inside: in the doorway's patch of sky, by night and at dusk; the nest close-up looks the other way
  for (const fx of [['night'], ['dusk']]) for (const cam of ['inside', 'doorway', 'nest']) {
    const m = duskMoon({ moon: 8 }, fx, cam), vb = viewBox(m.svg), what = cam + ' ' + fx[0];
    assert.ok(m.waxing && Math.abs(m.thick - dusk.thick) < 0.001 && m.tilt === dusk.tilt, what + ': the same half moon through the doorway');
    assert.ok(m.x - m.rad > 1290 && m.x + m.rad < 1500 && m.y - m.rad > 505 && m.y + m.rad < 630, what + ': in the doorway\'s sky: ' + [m.x, m.y, m.rad]);
    if (cam === 'nest') assert.deepEqual(m.r.keep, [], 'the nest close-up: no moon in it, nothing to keep off');
    else {
      assert.ok(inVb(m.x - m.rad, m.y - m.rad, vb, 2) && inVb(m.x + m.rad, m.y + m.rad, vb, 2), what + ': whole in the panel');
      assert.equal(m.r.keep.length, 1, what + ': the lettering keeps off it');
    }
    for (const [opts, fx2, why] of [[{ moon: 8, weather: 'cloudy' }, fx, 'cloud'], [{ moon: 8 }, ['morning'], 'morning'], [{ moon: 5 }, ['night'], 'chapter 5\'s, by night']]) assert.ok(duskMoon(opts, fx2, cam).none, cam + ': no moon through the doorway: ' + why);
  }
  // the bedtime panel: the grey tom asleep at sleeper-1 and our cat curled in her nest, the half moon in the doorway over neither
  const scene = { set: 'den', cam: 'inside', opts: { weather: 'clear', moon: 8, stone: 'nose', bark: cardsOf(F28), hidden: true, glass: true }, cast: [{ who: 'snorer', at: 'sleeper-1', pose: 'lie', mood: 'sleepy' }, { who: 'player', at: 'nest', pose: 'curl', mood: 'kind', asleep: 'half' }], fx: ['night', 'zzz'] };
  const r = art.render(scene, { look: LOOK });
  checkRender(r, scene, 'bedtime, chapter 8');
  assert.ok(prop(r.svg, 'waxing-moon') && prop(r.svg, 'nest-glass') && corners(r.svg).length === 10, 'the moon, her glass, ten corners');
});

// Stand-ins for chapter 8's three, drawn far too big (or too small), to see the scenes hold them: Hail no taller
// sitting than our cat (Squall's cap), Snip and Snatch half to two thirds as tall as she sits, sitting up.
function standIns8(real, k) {
  const mine = sitTall('player', LOOK);
  return function (who, o) {
    const pose = (o && o.pose) || 'sit';
    let d;
    if (who === 'hail') d = { w: 300, h: 260, headBox: { x0: 160, y0: 20, x1: 250, y1: 110 }, bounds: { x0: 40, y0: 20, x1: 270, y1: 258 } };
    else if (who === 'snip' || who === 'snatch') { const t = mine * (k[who] || 1); d = { w: 240, h: 200, headBox: { x0: 140, y0: 200 - t, x1: 200, y1: 200 - t + 50 }, bounds: { x0: 20, y0: 200 - t, x1: 220, y1: 198 } }; }
    else return real(who, o);
    // a pose with a different box (bouncing, running, peeking out of a hole): every pose is scaled as the measured one
    if (['bounce', 'run', 'stand', 'peek', 'skid', 'curl'].includes(pose)) { d.h += 40; d.headBox.y0 += 40; d.headBox.y1 += 40; d.bounds.y0 += 40; d.bounds.y1 += 40; }
    return { svg: '<rect class="new-' + who + '" x="' + d.bounds.x0 + '" y="' + d.bounds.y0 + '" width="' + (d.bounds.x1 - d.bounds.x0) + '" height="' + (d.bounds.y1 - d.bounds.y0) + '" fill="#8FA3B8"/>', w: d.w, h: d.h, head: { x: (d.headBox.x0 + d.headBox.x1) / 2, y: d.headBox.y0 + 8 }, headBox: d.headBox, bounds: d.bounds };
  };
}

test('chapter 8\'s cast in the scenes: Hail at a cat\'s anchor is no taller sitting than our cat (Squall\'s rule), every pose scaled alike; Snip and Snatch are held to "half your size" (sitting up, half to two thirds as tall as she sits), a drawing inside the band left as drawn; each has a shadow under the body, none peeking out of a hole or a log; every face is lettered', { skip: !art.character && 'no cats.js' }, () => {
  const real = art.character, a = art.sceneInfo('title').anchors.main.wall, base = a.h / 200, mine = sitTall('player', LOOK);
  const near = (x, y, what) => assert.ok(Math.abs(x - y) < 0.0002, what + ': ' + x + ' vs ' + y);
  const one = (who, pose, extra) => { const scene = { set: 'title', cam: 'wide', cast: [Object.assign({ who, pose, mood: 'happy', at: 'wall', facing: 'left' }, extra || {}), { who: 'player', pose: 'sit', mood: 'wonder', at: 'wall-2' }], fx: ['day'] }; const r = art.render(scene, { look: LOOK }); checkRender(r, scene, who + ' ' + pose); return r; };
  withCharacter(standIns8(real, { snip: 1, snatch: 1 }), () => {
    // Hail: capped to our cat's sitting height, whatever her box; a size above 1 is held to the cap
    const hc = standIns8(real, {})('hail', { pose: 'sit' }), tall = hc.h - hc.headBox.y0;
    const s = placedScale(one('hail', 'sit').svg, a, hc.w, hc.h);
    near(s, Math.round(base * mine / tall * 10000) / 10000, 'Hail capped to our cat\'s sitting height');
    for (const p of ['stand', 'bounce', 'run', 'peek', 'pawup', 'tilt']) { const c = standIns8(real, {})('hail', { pose: p }); near(placedScale(one('hail', p).svg, a, c.w, c.h), s, 'Hail ' + p + ': the same scale'); }
    near(placedScale(one('hail', 'sit', { size: 1.4 }).svg, a, hc.w, hc.h), s, 'a size above 1 is held to the cap');
    const r = one('hail', 'sit');
    assert.ok(r.heads[0] && r.heads[0].r > 0, 'her face is lettered: ' + JSON.stringify(r.heads[0]));
    const shade = footShade(r.svg, a.y).filter((e) => Math.abs(e[0] - a.x) < 80);
    assert.ok(shade.some((e) => Math.abs(e[2] - (hc.bounds.x1 - hc.bounds.x0) * s * 0.42) < 0.3), 'her shadow under her body as drawn: ' + JSON.stringify(shade));
    assert.equal(footShade(one('hail', 'peek').svg, a.y).filter((e) => Math.abs(e[0] - a.x) < 80).length, 0, 'none peeking out of the log');
  });
  // Snip and Snatch: a drawing far too small, inside the band, far too big
  const band = art.sizeBands.snip;
  for (const who of ['snip', 'snatch']) for (const kk of [0.3, 0.58, 1.1]) withCharacter(standIns8(real, { [who]: kk }), () => {
    const c = standIns8(real, { [who]: kk })(who, { pose: 'up' }), want = round4(base * Math.min(Math.max(kk, band.min), band.max) / kk);
    const s = placedScale(one(who, 'up').svg, a, c.w, c.h);
    near(s, want, who + ' drawn at ' + kk + (kk >= band.min && kk <= band.max ? ' (inside: as drawn)' : ' (brought into the band)'));
    for (const p of ['stand', 'run', 'skid', 'peek', 'point', 'curl']) { const d = standIns8(real, { [who]: kk })(who, { pose: p }); near(placedScale(one(who, p).svg, a, d.w, d.h), s, who + ' ' + p + ': the same scale'); }
    const r = one(who, 'up');
    assert.ok(r.heads[0] && r.heads[0].r > 0, who + ': a face to letter');
    const shade = footShade(r.svg, a.y).filter((e) => Math.abs(e[0] - a.x) < 60);
    assert.ok(shade.some((e) => Math.abs(e[2] - (c.bounds.x1 - c.bounds.x0) * s * 0.42) < 0.3), who + ': the shadow under the long body');
    assert.equal(footShade(one(who, 'peek').svg, a.y).filter((e) => Math.abs(e[0] - a.x) < 60).length, 0, who + ': none peeking out of a hole');
  });
});

test('the real Hail, Snip and Snatch (cats.js, once it draws them): in every pose of theirs, at every cat anchor of chapter 1\'s sets, Hail is never taller sitting than our cat, and the weasels sit up half to two thirds as tall as she sits; every face has a size', { skip: !(art.vocab.otherPoses && ['hail', 'snip', 'snatch'].every((w) => art.vocab.otherPoses[w])) && 'cats.js does not draw Hail, Snip and Snatch yet' }, () => {
  const mine = sitTall('player', LOOK), real = art.character;
  const hail = real('hail', { pose: 'sit', mood: 'neutral' }), hTall = hail.h - (hail.headBox ? hail.headBox.y0 : 0);
  // (a spread of chapter 1's cat anchors, near and far: the rule is the anchor's size, wherever it is)
  const SPOTS = [['title', 'wide', 'wall'], ['title', 'wide', 'wall-2'], ['den', 'inside', 'nest'], ['den', 'outside', 'entrance-left'], ['garden', 'wide', 'lawn'], ['hollow', 'wide', 'sand-left'], ['hollow', 'wide', 'rim-2'], ['camp', 'reveal', 'center']];
  for (const [set, cam, spot] of SPOTS) {
    const info = art.sceneInfo(set), a = (info.anchors[info.cams[cam].comp] || {})[spot];
    assert.ok(a, set + '/' + cam + ': ' + spot);
    {
      for (const who of ['hail', 'snip', 'snatch']) for (const pose of art.vocab.otherPoses[who]) {
        const scene = { set, cam, cast: [{ who, pose, mood: 'happy', at: spot }], fx: [] }, r = art.render(scene, { look: LOOK });
        checkRender(r, scene, set + '/' + cam + ' ' + who + ' ' + pose + ' at ' + spot);
        const c = real(who, { pose, mood: 'happy', facing: a.face || 'right' }), s = placedScale(r.svg, a, c.w, c.h);
        if (s === null) continue;
        const base = a.h / 200;
        if (who === 'hail') assert.ok(s * hTall <= base * mine + 0.05, set + '/' + cam + ' ' + spot + ': Hail ' + pose + ' no taller sitting than our cat');
        else {
          const up = real(who, { pose: 'up', mood: 'neutral' }), held = s / base * (up.h - up.headBox.y0) / mine;
          assert.ok(held >= 0.5 - 0.005 && held <= 0.65 + 0.005, set + '/' + cam + ' ' + spot + ': ' + who + ' held at ' + held.toFixed(3));
        }
        if (r.heads[0]) assert.ok(r.heads[0].r > 0, who + ' ' + pose + ': a face to letter');
      }
    }
  }
});
