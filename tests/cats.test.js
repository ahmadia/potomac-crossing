// Character art: every cast member, pose, mood and facing renders well-formed SVG markup.
// Run with: node --test tests/cats.test.js   (or all suites: node --test tests/*.test.js)
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const PC = require('../app/art/cats.js');
const A = PC.art;

// Tag balance: every opening tag is closed in order; self-closing tags stand alone.
function balanced(svg) {
  const stack = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(svg))) {
    const [, close, name, , self] = m;
    if (self) continue;
    if (close) {
      const top = stack.pop();
      if (top !== name) return `</${name}> closes <${top}>`;
    } else stack.push(name);
  }
  if (stack.length) return `unclosed <${stack.join('>, <')}>`;
  const stray = svg.replace(re, '');
  if (/[<>]/.test(stray)) return 'stray angle bracket';
  return null;
}

function checkResult(r, label) {
  assert.ok(r && typeof r.svg === 'string' && r.svg.length > 100, `${label}: empty svg`);
  assert.ok(/^<g[\s>]/.test(r.svg), `${label}: svg is not a group`);
  assert.ok(!/<svg/.test(r.svg), `${label}: character markup must not contain an outer <svg>`);
  assert.strictEqual(balanced(r.svg), null, `${label}: ${balanced(r.svg)}`);
  assert.ok(!/NaN|undefined|Infinity|null/.test(r.svg), `${label}: bad number in markup`);
  assert.ok(r.w > 0 && r.h > 0, `${label}: size`);
  assert.ok(r.head && isFinite(r.head.x) && isFinite(r.head.y), `${label}: head`);
  assert.ok(r.head.x >= 0 && r.head.x <= r.w && r.head.y >= 0 && r.head.y <= r.h,
    `${label}: head (${r.head.x}, ${r.head.y}) outside ${r.w}x${r.h}`);
}

const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat'];
const FACINGS = ['left', 'right'];

test('vocabulary lists the contract ids', () => {
  assert.deepStrictEqual(A.vocab.cast, ['player', 'tallyheart', 'glintstar', 'waffles', 'tallone', 'grizzled', 'snorer',
    'mutterer', 'snorter', 'clancat', 'sparrow', 'moth']);
  assert.deepStrictEqual(A.vocab.poses, ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall',
    'stretch', 'peer']);
  assert.deepStrictEqual(A.vocab.moods, ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh',
    'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn']);
  assert.deepStrictEqual(A.vocab.looks.fur, ['black', 'white', 'silver-tabby', 'brown-tabby', 'ginger', 'cream', 'grey',
    'tortie', 'calico']);
  assert.deepStrictEqual(A.vocab.looks.marking, ['none', 'white-paws', 'white-chest', 'back-stripe', 'nose-splash']);
  assert.deepStrictEqual(A.vocab.looks.eyes, ['green', 'amber', 'blue', 'copper', 'odd']);
});

test('every cat x pose x mood x facing renders', () => {
  let n = 0;
  for (const who of CATS) {
    for (const pose of A.vocab.poses) {
      for (const mood of A.vocab.moods) {
        for (const facing of FACINGS) {
          const r = A.character(who, { pose, mood, facing, look: { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'she' } });
          checkResult(r, `${who}/${pose}/${mood}/${facing}`);
          assert.strictEqual(r.w, 200);
          assert.strictEqual(r.h, 200);
          n++;
        }
      }
    }
  }
  assert.strictEqual(n, CATS.length * 12 * A.vocab.moods.length * 2);
});

test('every clan cat variant renders in every pose', () => {
  for (let variant = 1; variant <= 6; variant++) {
    for (const pose of A.vocab.poses) {
      for (const facing of FACINGS) checkResult(A.character('clancat', { variant, pose, mood: 'happy', facing }), `clancat ${variant}/${pose}`);
    }
  }
});

test('every player look renders (fur x marking x eyes x sex), in several poses', () => {
  const poses = ['sit', 'stand', 'walk', 'curl', 'lie'];
  let i = 0;
  for (const fur of A.vocab.looks.fur) {
    for (const marking of A.vocab.looks.marking) {
      for (const eyes of A.vocab.looks.eyes) {
        for (const sex of ['she', 'tom']) {
          const pose = poses[i++ % poses.length];
          const look = { fur, marking, eyes, sex };
          checkResult(A.character('player', { look, pose, mood: 'neutral' }), `player ${fur}/${marking}/${eyes}/${sex}`);
          checkResult(A.cat({ look, pose, mood: 'happy', facing: 'left' }), `cat ${fur}/${marking}/${eyes}/${sex}`);
        }
      }
    }
  }
});

test('looks change the drawing', () => {
  const base = { pose: 'sit', mood: 'neutral' };
  const strip = (s) => s.replace(/pc[0-9a-z]+-/g, 'id-');
  const a = strip(A.cat({ ...base, look: { fur: 'black', marking: 'none', eyes: 'green' } }).svg);
  for (const look of [{ fur: 'ginger', marking: 'none', eyes: 'green' }, { fur: 'black', marking: 'white-chest', eyes: 'green' },
    { fur: 'black', marking: 'none', eyes: 'odd' }, { fur: 'black', marking: 'none', eyes: 'green', sex: 'tom' }]) {
    assert.notStrictEqual(strip(A.cat({ ...base, look }).svg), a, JSON.stringify(look));
  }
  // odd eyes really are two colours
  const odd = A.cat({ ...base, look: { fur: 'white', eyes: 'odd' } }).svg;
  assert.ok(odd.includes('#79b9ee') && odd.includes('#8fca66'), 'odd eyes: one blue, one green');
});

test('a player with no look still renders', () => {
  checkResult(A.character('player', {}), 'player without look');
  checkResult(A.cat(), 'cat without options');
  checkResult(A.character('player', { pose: 'nope', mood: 'nope', facing: 'up', look: { fur: 'plaid' } }), 'unknown values');
});

test('the Tall One, sparrow and moth render in their poses', () => {
  for (const pose of ['stand', 'water', 'set-dish']) {
    for (const facing of FACINGS) {
      const r = A.character('tallone', { pose, facing });
      checkResult(r, `tallone/${pose}/${facing}`);
      assert.strictEqual(r.w, 260);
      assert.strictEqual(r.h, 620);
    }
  }
  for (const pose of ['perch', 'fluffed']) {
    for (const facing of FACINGS) {
      const r = A.character('sparrow', { pose, facing });
      checkResult(r, `sparrow/${pose}/${facing}`);
      assert.ok(r.w >= 40 && r.w <= 48 && r.h >= 36 && r.h <= 44, 'sparrow about 44x40');
    }
  }
  for (const facing of FACINGS) {
    const r = A.character('moth', { pose: 'fly', facing });
    checkResult(r, `moth/${facing}`);
    assert.ok(r.w >= 36 && r.w <= 44 && r.h >= 32 && r.h <= 40, 'moth about 40x36');
  }
});

test('characters face the way they are told', () => {
  for (const who of ['tallyheart', 'tallone', 'sparrow', 'moth']) {
    const r = A.character(who, { facing: 'left' }), l = A.character(who, { facing: 'right' });
    assert.ok(/^<g transform="matrix\(-[\d.]+,/.test(r.svg), `${who} facing left is mirrored`);
    assert.ok(!/^<g transform="matrix\(-/.test(l.svg), `${who} facing right is not mirrored`);
  }
  // heads mirror too
  const a = A.character('glintstar', { pose: 'stand', facing: 'right' }).head, b = A.character('glintstar', { pose: 'stand', facing: 'left' }).head;
  assert.ok(Math.abs(a.x + b.x - 200) < 0.2 && Math.abs(a.y - b.y) < 0.01, 'head mirrors around the box centre');
});

test('ids are unique between calls, so characters can share one panel', () => {
  const ids = (s) => (s.match(/id="([^"]+)"/g) || []).map((x) => x.slice(4, -1));
  const a = ids(A.character('tallyheart', { pose: 'sit' }).svg);
  const b = ids(A.character('tallyheart', { pose: 'sit' }).svg);
  assert.ok(a.length > 0);
  assert.strictEqual(new Set(a).size, a.length, 'unique within one character');
  for (const id of b) assert.ok(!a.includes(id), `id ${id} repeated across calls`);
  // every url(#...) and href points at an id defined in the same markup
  const svg = A.character('mutterer', { pose: 'walk', mood: 'laugh' }).svg;
  const defined = new Set(ids(svg));
  for (const ref of svg.match(/(?:url\(#|href="#)([^)"]+)/g)) {
    const id = ref.replace(/^(url\(#|href="#)/, '');
    assert.ok(defined.has(id), `dangling reference ${id}`);
  }
});

test('characters stay reasonably light', () => {
  let worst = 0, who = '';
  for (const w of CATS) {
    for (const pose of A.vocab.poses) {
      for (const mood of ['neutral', 'scared', 'laugh']) {
        const n = A.character(w, { pose, mood, look: { fur: 'calico', marking: 'back-stripe', eyes: 'odd' } }).svg.length;
        if (n > worst) { worst = n; who = `${w}/${pose}/${mood}`; }
      }
    }
  }
  assert.ok(worst < 14000, `largest character ${who} is ${worst} bytes`);
});

test('Tallyheart has her torn ear, Waffles her bow, Grizzled his scar', () => {
  assert.ok(A.character('tallyheart', {}).svg.includes('L7,-23L-1,-18L9,-12'), 'notch path');
  assert.ok(A.character('waffles', {}).svg.includes('#f47aa8'), 'pink bow');
  assert.ok(A.character('grizzled', {}).svg.includes('#dba79f'), 'scar');
  assert.ok(!A.character('glintstar', {}).svg.includes('L7,-23L-1,-18L9,-12'), 'only Tallyheart is notched');
});

function checkSvgDoc(s, label) {
  assert.ok(typeof s === 'string' && s.startsWith('<svg') && s.endsWith('</svg>'), `${label}: not an <svg> document`);
  assert.ok(/viewBox="0 0 [\d.]+ [\d.]+"/.test(s), `${label}: viewBox`);
  assert.strictEqual(balanced(s), null, `${label}: ${balanced(s)}`);
  assert.ok(!/NaN|undefined|Infinity/.test(s), `${label}: bad number`);
}

test('countsPicture returns an <svg> for tables 1-10', () => {
  for (let table = 1; table <= 10; table++) {
    for (const groups of [1, 3, 5, 8, 10]) {
      checkSvgDoc(A.countsPicture({ table, groups, highlight: Math.min(groups, 3) }), `counts ${table}x${groups}`);
    }
  }
  checkSvgDoc(A.countsPicture({}), 'counts defaults');
  checkSvgDoc(A.countsPicture({ table: 1, groups: 0 }), 'counts zero groups');
});

test('countsPicture for the 1s: one tail per cat, the first `highlight` glow', () => {
  const glows = (s) => (s.match(/stroke-width="28"/g) || []).length;
  for (const [groups, highlight] of [[1, 0], [3, 2], [5, 5], [8, 3], [10, 7], [3, 9]]) {
    const s = A.countsPicture({ table: 1, groups, highlight });
    assert.strictEqual(glows(s), Math.min(groups, highlight), `${groups} cats, ${highlight} lit`);
    assert.ok(s.includes(`aria-label="${groups} cats, 1 tail each"`));
  }
  // rows of at most five
  const one = A.countsPicture({ table: 1, groups: 5 }), two = A.countsPicture({ table: 1, groups: 6 });
  const h = (s) => +s.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1];
  assert.ok(h(two) > h(one), 'six cats take a second row');
});

test('sand returns an <svg> with one scratch per thing and the first `counted` lit', () => {
  for (const [groups, per, counted] of [[3, 1, 2], [1, 5, 3], [6, 1, 6], [9, 1, 0], [1, 10, 7], [4, 2, 5], [10, 1, 10]]) {
    const s = A.sand({ groups, per, counted });
    checkSvgDoc(s, `sand ${groups}x${per}`);
    const grooves = (s.match(/stroke-width="4.6"/g) || []).length;
    const lit = (s.match(/stroke="#e39a12"/g) || []).length;
    assert.strictEqual(grooves, groups * per, 'one scratch per thing');
    assert.strictEqual(lit, Math.min(counted, groups * per), 'lit scratches');
  }
  checkSvgDoc(A.sand({}), 'sand defaults');
});

test('solemn is deadpan: half lids, level brows, a straight mouth, no smile and no blush', () => {
  const strip = (x) => x.replace(/pc[0-9a-z]+-[0-9a-z]+/g, 'id');
  const sol = A.character('glintstar', { pose: 'sit', mood: 'solemn', facing: 'left' }).svg;
  for (const m of ['neutral', 'proud', 'stern']) assert.notStrictEqual(strip(sol), strip(A.character('glintstar', { pose: 'sit', mood: m, facing: 'left' }).svg), 'solemn differs from ' + m);
  assert.ok(!sol.includes('#ff8aa5'), 'no blush');
  assert.ok(!sol.includes('Q-3.8,17.4 0,13.6'), 'no smile');
  assert.ok(sol.includes('M-4.6,14.2H4.6'), 'a small straight mouth');
  assert.ok(!sol.includes('M-9,3.4Q0,-9 9.4,1.6'), 'eyes open (not the closed happy arcs)');
});

test('cats report a head box and body box inside their 200 x 200 box', () => {
  for (const who of CATS) {
    for (const pose of A.vocab.poses) {
      const r = A.character(who, { pose, mood: 'neutral', facing: pose.length % 2 ? 'left' : 'right' });
      const h = r.headBox, b = r.bounds;
      assert.ok(h && b, `${who}/${pose}: boxes`);
      assert.ok(h.x0 < r.head.x && r.head.x < h.x1 && h.y0 < r.head.y && r.head.y < h.y1, `${who}/${pose}: head point inside the head box`);
      assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= 201 && b.y1 <= 201, `${who}/${pose}: body box inside the drawing ${JSON.stringify(b)}`);
    }
  }
  assert.ok(A.character('waffles', { pose: 'sit' }).headBox.y0 < A.character('waffles', { pose: 'sit' }).head.y - 30, 'her bow and ears count');
});

test('a slim cat’s head rests on its chest as a full-built cat’s does, in every pose where it sits on top', () => {
  // Lissa spotted the skinny grey tom's head floating above his body as he slept through the storm
  // (ch01 f077, pose lie): a slim chest sits lower, and the head has to come down with it. Overlap is
  // how far the head box reaches below the top of the chest, over the head box's height.
  const overlap = (who, pose) => {
    const r = A.character(who, { pose, mood: 'sleepy' });
    return (r.headBox.y1 - r.chestTop.y) / (r.headBox.y1 - r.headBox.y0);
  };
  for (const pose of ['sit', 'lookup', 'lie', 'loaf', 'stand', 'walk', 'peer', 'stretch']) {
    const full = overlap('clancat', pose);
    for (const who of ['snorer', 'glintstar', 'snorter', 'mutterer']) {
      const o = overlap(who, pose);
      // three quarters, not all: Glintstar's tall ears make her head box taller, so her ratio reads lower
      assert.ok(o >= full * 0.75, `${who}/${pose}: the head reaches the chest (${o.toFixed(2)}, a full-built cat ${full.toFixed(2)})`);
    }
  }
});

test('white markings show on pale fur (white, cream, calico); mid and dark furs are unchanged', () => {
  const strip = (x) => x.replace(/pc[0-9a-z]+-[0-9a-z]+/g, 'id');
  const svg = (fur, marking) => strip(A.cat({ look: { fur, marking, eyes: 'green', sex: 'she' }, pose: 'sit', mood: 'neutral' }).svg);
  for (const marking of ['white-paws', 'white-chest', 'nose-splash']) {
    for (const fur of ['white', 'cream', 'calico']) {
      const m = svg(fur, marking);
      assert.notStrictEqual(m, svg(fur, 'none'), `${fur}/${marking} differs from no marking`);
      assert.ok(m.includes('stroke="#1b1622"'), `${fur}/${marking}: the marking has a soft ink edge`);
    }
    for (const fur of ['black', 'grey', 'ginger', 'brown-tabby']) assert.ok(!svg(fur, marking).includes('stroke="#1b1622"'), `${fur}/${marking}: plain white, no edge`);
  }
  // the marking on white fur is a touch brighter than the fur
  assert.ok(svg('white', 'white-chest').includes('fill="#ffffff"'));
});

test('loads without a DOM and attaches to the PC global', () => {
  assert.strictEqual(typeof globalThis.PC, 'object');
  assert.strictEqual(globalThis.PC.art, A);
  assert.strictEqual(typeof A.character, 'function');
  assert.strictEqual(typeof A.cat, 'function');
});
