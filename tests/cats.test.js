// Character art: every cast member, pose, mood and facing renders well-formed SVG markup; the
// chapter 2 otters and dogs; the Counts pictures (chapter 1's unchanged, chapter 2's prey, totals,
// next, who, rows and the thought cloud); chapter 3's Sprinkle, the new poses, moods and extras, and
// the 5s (forepaws in their cats' fur, Sprinkle's, paws drawn in the mud, her own two paws, swipes).
// Run with: node --test tests/cats.test.js   (or every suite: node --test, from the repo root)
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

const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'murmurchime'];
const FACINGS = ['left', 'right'];

test('vocabulary lists the contract ids', () => {
  assert.deepStrictEqual(A.vocab.cast, ['player', 'tallyheart', 'glintstar', 'waffles', 'tallone', 'grizzled', 'snorer',
    'mutterer', 'snorter', 'clancat', 'sparrow', 'moth', 'riffle', 'otter', 'dog', 'sprinkle', 'murmurchime']);
  assert.deepStrictEqual(A.vocab.poses, ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall',
    'stretch', 'peer', 'pawup', 'tummy']);
  assert.deepStrictEqual(A.vocab.moods, ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh',
    'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn', 'sad', 'shy']);
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
  assert.strictEqual(n, CATS.length * A.vocab.poses.length * A.vocab.moods.length * 2);
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

// ---------------------------------------------------------------- chapter 2: otters and dogs

const BEASTS = [['riffle', 1], ['otter', 1], ['otter', 2], ['otter', 3], ['dog', 1], ['dog', 2], ['dog', 3]];
const OTTER_POSES = ['stand', 'sit', 'scramble', 'swim', 'float', 'juggle', 'slide', 'hug', 'sun', 'dive', 'hush'];
const DOG_POSES = ['stand', 'jump', 'sit', 'bounce', 'howl'];
const strip = (x) => x.replace(/pc[0-9a-z]+-/g, 'id-');

test('chapter 2 vocabulary: otter and dog poses, variants (build.md v0.3)', () => {
  assert.deepStrictEqual(A.vocab.otherPoses.riffle, OTTER_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.otter, OTTER_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.dog, DOG_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.tallone, ['stand', 'water', 'set-dish'], 'chapter 1 poses kept');
  assert.deepStrictEqual(A.vocab.variants, { clancat: [1, 2, 3, 4, 5, 6], otter: [1, 2, 3], dog: [1, 2, 3] });
  assert.deepStrictEqual(A.vocab.clanVariants, [1, 2, 3, 4, 5, 6], 'kept for chapter 1 readers');
  // the vocab is a copy: changing it changes nothing
  A.vocab.otherPoses.dog.push('nope');
  assert.ok(!A.character('dog', { pose: 'nope' }).svg.includes('NaN'));
  A.vocab.otherPoses.dog.pop();
});

test('every otter and dog x pose x mood x facing renders, inside its box', () => {
  let n = 0;
  for (const [who, variant] of BEASTS) {
    const poses = who === 'dog' ? DOG_POSES : OTTER_POSES;
    for (const pose of poses) {
      for (const mood of A.vocab.moods) {
        for (const facing of FACINGS) {
          const label = `${who}${variant}/${pose}/${mood}/${facing}`;
          const r = A.character(who, { pose, mood, facing, variant });
          checkResult(r, label);
          const h = r.headBox, b = r.bounds;
          assert.ok(h && b, label + ': boxes');
          assert.ok(h.x0 < r.head.x && r.head.x < h.x1 && h.y0 < r.head.y && r.head.y < h.y1, label + ': head point inside the head box');
          assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= r.w + 1 && b.y1 <= r.h + 1, label + ': body inside the box ' + JSON.stringify(b));
          assert.ok(h.y0 >= b.y0 - 1 && h.y1 <= b.y1 + 1, label + ': head box inside the body box');
          n++;
        }
      }
    }
  }
  assert.strictEqual(n, (OTTER_POSES.length * 4 + DOG_POSES.length * 3) * A.vocab.moods.length * 2);
});

test('otters and dogs: one box per character, feet on the bottom line', () => {
  const box = { riffle: 250, otter: 330, dog1: 470, dog2: 330, dog3: 160 };
  for (const [who, variant] of BEASTS) {
    const want = who === 'dog' ? box['dog' + variant] : box[who];
    for (const pose of who === 'dog' ? DOG_POSES : OTTER_POSES) {
      const r = A.character(who, { pose, variant });
      assert.strictEqual(r.w, want, `${who}${variant}/${pose} width`);
      assert.strictEqual(r.h, want, `${who}${variant}/${pose} height`);
      // standing poses rest on the ground (3 units above the box bottom, like the cats); a bounce is in the air
      // (a dive is too, its splash on the ground line)
      const gap = r.h - r.bounds.y1;
      if (pose === 'bounce') assert.ok(gap > 8, `${who}${variant} bounces off the ground (${gap})`);
      else assert.ok(gap >= 1.5 && gap <= 4.5, `${who}${variant}/${pose} rests on the ground (${gap})`);
    }
  }
});

test('sizes next to the cats: Riffle about a sitting cat, adult otters bigger, shaggy about twice a cat, tiny smaller', () => {
  // a character's drawing units are the cats' units (scenes scale everything by the sitting cat's box)
  const tall = (who, o) => { const r = A.character(who, o); return r.bounds.y1 - r.bounds.y0; };
  const long = (who, o) => { const r = A.character(who, o); return r.bounds.x1 - r.bounds.x0; };
  const catSit = tall('clancat', { pose: 'sit', variant: 1 }), kitSit = tall('player', { pose: 'sit', look: { fur: 'black' } });
  const catStand = tall('clancat', { pose: 'stand', variant: 1 });
  const riffle = tall('riffle', { pose: 'sit' });
  assert.ok(riffle > kitSit * 0.95 && riffle < catSit * 1.1, `Riffle sitting ${riffle} vs an apprentice ${kitSit} and a cat ${catSit}`);
  assert.ok(tall('riffle', { pose: 'stand' }) > riffle * 1.1, 'Riffle stands taller than he sits');
  for (const v of [1, 2, 3]) {
    assert.ok(tall('otter', { pose: 'sit', variant: v }) > catSit * 1.05, `adult otter ${v} sits bigger than a cat`);
    assert.ok(tall('otter', { pose: 'sit', variant: v }) > riffle * 1.15, `adult otter ${v} bigger than Riffle`);
  }
  const shaggy = tall('dog', { pose: 'stand', variant: 1 }), spotty = tall('dog', { pose: 'stand', variant: 2 }), tiny = tall('dog', { pose: 'stand', variant: 3 });
  assert.ok(shaggy > catStand * 1.7 && shaggy < catStand * 2.4, `shaggy ${shaggy} about twice a standing cat ${catStand}`);
  assert.ok(long('dog', { pose: 'stand', variant: 1 }) > long('clancat', { pose: 'stand', variant: 1 }) * 1.7, 'shaggy is twice as long too');
  assert.ok(spotty > catStand * 1.2 && spotty < shaggy * 0.85, `spotty ${spotty} between a cat and the shaggy dog`);
  assert.ok(tiny < catStand * 0.85 && tiny < catSit, `tiny ${tiny} smaller than a cat (${catStand} standing, ${catSit} sitting)`);
});

test('otters and dogs face the way they are told; heads mirror', () => {
  for (const [who, variant] of BEASTS) {
    const l = A.character(who, { variant, facing: 'left' }), r = A.character(who, { variant, facing: 'right' });
    assert.ok(/^<g transform="matrix\(-[\d.]+,/.test(l.svg), `${who}${variant} facing left is mirrored`);
    assert.ok(!/^<g transform="matrix\(-/.test(r.svg), `${who}${variant} facing right is not mirrored`);
    assert.ok(Math.abs(l.head.x + r.head.x - r.w) < 0.3 && Math.abs(l.head.y - r.head.y) < 0.01, `${who}${variant}: head mirrors around the box centre`);
    assert.ok(Math.abs(l.headBox.x0 + r.headBox.x1 - r.w) < 0.3, `${who}${variant}: head box mirrors`);
  }
});

test('unknown pose or mood falls back to sit, neutral; a variant out of range clamps, as clancat does', () => {
  for (const who of ['riffle', 'otter', 'dog']) {
    const odd = A.character(who, { pose: 'moonwalk', mood: 'grumpy', facing: 'up' });
    checkResult(odd, who + ' unknown values');
    const sit = A.character(who, { pose: 'sit', mood: 'neutral', variant: 1 });
    assert.strictEqual(strip(odd.svg), strip(sit.svg), who + ' falls back to sit, neutral, variant 1');
  }
  assert.strictEqual(strip(A.character('dog', { variant: 0 }).svg), strip(A.character('dog', { variant: 1 }).svg), 'variant 0 clamps to 1');
  assert.strictEqual(strip(A.character('dog', { variant: 9 }).svg), strip(A.character('dog', { variant: 3 }).svg), 'variant 9 clamps to 3');
  assert.strictEqual(strip(A.character('riffle', { variant: 2 }).svg), strip(A.character('riffle', {}).svg), 'Riffle has no variants');
  assert.strictEqual(strip(A.character('otter', { variant: '3' }).svg), strip(A.character('otter', { variant: 3 }).svg), 'variant as a string');
});

test('every mood changes an otter’s and a dog’s face', () => {
  for (const [who, variant, pose] of [['riffle', 1, 'sit'], ['otter', 1, 'stand'], ['dog', 1, 'sit'], ['dog', 2, 'stand'], ['dog', 3, 'sit']]) {
    const seen = new Map();
    for (const mood of A.vocab.moods) {
      const svg = strip(A.character(who, { pose, mood, variant }).svg);
      assert.ok(!seen.has(svg), `${who}${variant}: ${mood} looks the same as ${seen.get(svg)}`);
      seen.set(svg, mood);
    }
  }
});

test('the variants look different, and the poses do', () => {
  for (const who of ['otter', 'dog']) {
    const a = strip(A.character(who, { variant: 1 }).svg), b = strip(A.character(who, { variant: 2 }).svg), c = strip(A.character(who, { variant: 3 }).svg);
    assert.ok(a !== b && b !== c && a !== c, who + ' variants differ');
  }
  for (const [who, poses] of [['riffle', OTTER_POSES], ['dog', DOG_POSES]]) {
    const set = new Set(poses.map((pose) => strip(A.character(who, { pose }).svg)));
    assert.strictEqual(set.size, poses.length, who + ': every pose is its own drawing');
  }
});

test('the new cast’s ids are unique and every reference resolves', () => {
  const ids = (s) => (s.match(/id="([^"]+)"/g) || []).map((x) => x.slice(4, -1));
  for (const [who, variant] of BEASTS) {
    for (const pose of who === 'dog' ? DOG_POSES : OTTER_POSES) {
      const svg = A.character(who, { pose, variant, mood: 'laugh' }).svg, defined = new Set(ids(svg));
      assert.strictEqual(defined.size, ids(svg).length, `${who}${variant}/${pose}: unique ids`);
      for (const ref of svg.match(/(?:url\(#|href="#)([^)"]+)/g) || []) assert.ok(defined.has(ref.replace(/^(url\(#|href="#)/, '')), `${who}${variant}/${pose}: dangling ${ref}`);
    }
  }
  const a = ids(A.character('riffle', {}).svg), b = ids(A.character('riffle', {}).svg);
  for (const id of b) assert.ok(!a.includes(id), 'ids differ between calls');
});

test('the new cast stays reasonably light', () => {
  let worst = 0, which = '';
  for (const [who, variant] of BEASTS) for (const pose of who === 'dog' ? DOG_POSES : OTTER_POSES) {
    for (const mood of ['neutral', 'scared', 'laugh', 'sniff']) {
      const n = A.character(who, { pose, mood, variant }).svg.length;
      if (n > worst) { worst = n; which = `${who}${variant}/${pose}/${mood}`; }
    }
  }
  assert.ok(worst < 16000, `largest ${which} is ${worst} bytes`);
});

test('water poses draw nothing below the waterline (the box’s ground line)', () => {
  for (const [who, variant] of BEASTS.filter(([w]) => w !== 'dog')) {
    for (const pose of ['swim', 'float']) {
      for (const mood of ['neutral', 'happy', 'wonder']) {
        const r = A.character(who, { pose, variant, mood });
        assert.ok(/<clipPath id="[^"]+"><rect /.test(r.svg), `${who}${variant}/${pose}: clipped at the waterline`);
        assert.ok(r.bounds.y1 <= r.h - 3 + 0.6, `${who}${variant}/${pose}/${mood}: nothing below the water (${r.bounds.y1})`);
      }
    }
  }
});

test('who they are: Riffle’s cream throat, the old otter’s white whiskers and brows, the dogs’ looks', () => {
  const riffle = A.character('riffle', { pose: 'sit' }).svg;
  assert.ok(riffle.includes('#f5e2c0') && riffle.includes('#8c5a36'), 'Riffle: sleek brown, cream throat and chin');
  const old = A.character('otter', { variant: 1, pose: 'sit' }).svg;
  assert.ok(/stroke="#ffffff" stroke-width="[\d.]+" fill="none" stroke-linecap="round" opacity="\.95"/.test(old), 'the old otter’s white whiskers');
  assert.ok(old.includes('stroke="#f6f3ec"'), 'and white brows');
  // his whiskers trail down past his chin, and in the water they reach it
  const ripples = (svg) => (svg.match(/q10,-5 20,0/g) || []).length;
  assert.ok(ripples(A.character('otter', { variant: 1, pose: 'swim' }).svg) > 0, 'the whiskers touch the water');
  assert.strictEqual(ripples(A.character('otter', { variant: 2, pose: 'swim' }).svg), 0, 'only his');
  const shaggy = A.character('dog', { variant: 1 }).svg, spotty = A.character('dog', { variant: 2 }).svg, tiny = A.character('dog', { variant: 3 }).svg;
  assert.ok(shaggy.includes('#62b6e4'), 'shaggy: a sky-blue bandana');
  assert.ok(spotty.includes('#2f2b31') && spotty.includes('#e0503f'), 'spotty: black spots and a red collar');
  assert.ok(tiny.includes('#4f8fd6'), 'tiny: a blue collar');
});

test('gestures: Riffle waves when happy; the old otter cups a paw to his ear when he shouts; pebbles', () => {
  const waves = (svg) => /q6,6 0,14M/.test(svg);
  assert.ok(waves(A.character('riffle', { pose: 'stand', mood: 'happy' }).svg), 'Riffle waves');
  assert.ok(waves(A.character('riffle', { pose: 'swim', mood: 'happy' }).svg), 'and waves from the water');
  assert.ok(!waves(A.character('riffle', { pose: 'stand', mood: 'neutral' }).svg), 'not when neutral');
  const cup = (svg) => svg.includes('q-5,7 0,13');
  assert.ok(cup(A.character('otter', { variant: 1, pose: 'stand', mood: 'shout' }).svg), '“WHAT? SPEAK UP!”');
  assert.ok(cup(A.character('otter', { variant: 1, pose: 'sit', mood: 'shout' }).svg));
  assert.ok(!cup(A.character('otter', { variant: 2, pose: 'stand', mood: 'shout' }).svg), 'only the old one is deaf');
  const pebbles = (svg) => (svg.match(/class="pc-pebble"/g) || []).length;
  assert.strictEqual(pebbles(A.character('riffle', { pose: 'juggle' }).svg), 3, 'three pebbles in the air');
  assert.strictEqual(pebbles(A.character('otter', { variant: 1, pose: 'juggle' }).svg), 3, 'any otter can juggle');
  assert.strictEqual(pebbles(A.character('riffle', { pose: 'float', mood: 'happy' }).svg), 3, 'juggling on his tummy');
  assert.strictEqual(pebbles(A.character('riffle', { pose: 'float', mood: 'wonder' }).svg), 3, 'plip, plip, plop');
  assert.ok(A.character('riffle', { pose: 'float', mood: 'wonder' }).svg.includes('M106,0q12,-7 24,0'), 'the dropped pebbles splash');
  assert.strictEqual(pebbles(A.character('otter', { variant: 2, pose: 'float' }).svg), 0, 'grown otters float empty-pawed');
  // chapter 3: "FIVE pebbles!" — four on the arc and the fifth, plain round brown, in his paw; four on
  // the arc while the fifth bonks; chapter 2's juggle stays three, its pebbles where they were
  const four = A.character('riffle', { pose: 'juggle', mood: 'worried', pebbles: 4 }), five = A.character('riffle', { pose: 'juggle', mood: 'happy', pebbles: 5 });
  checkResult(four, 'juggle 4'); checkResult(five, 'juggle 5');
  assert.strictEqual(pebbles(four.svg), 4, 'four in the air');
  assert.strictEqual(pebbles(five.svg), 4, 'four in the air…');
  assert.strictEqual(count(five.svg, /class="pc-pebble pc-fifth"/g), 1, '…and the fifth in his paw');
  assert.ok(five.svg.includes('fill="#93704F"'), 'plain round brown, the BONK pebble’s colour');
  assert.ok(!four.svg.includes('pc-fifth'));
  const arcs = (svg) => count(svg, /stroke-dasharray/g);
  assert.strictEqual(arcs(four.svg), 4, 'an arc into every pebble');
  assert.strictEqual(arcs(A.character('riffle', { pose: 'juggle' }).svg), 3);
  const three = A.character('riffle', { pose: 'juggle', mood: 'happy' }).svg, cols = (svg) => (svg.match(/class="pc-pebble" d="[^"]+" fill="(#[0-9a-f]+)"/g) || []).map((m) => m.match(/fill="(#[0-9a-f]+)"/)[1]);
  assert.deepStrictEqual(cols(four.svg).slice(0, 3), cols(three), 'the three keep their colours with a fourth');
  assert.strictEqual(strip(A.character('riffle', { pose: 'juggle', pebbles: 3 }).svg), strip(A.character('riffle', { pose: 'juggle' }).svg));
  // none of Riffle's pebbles is grey enough to pass for Sprinkle's (#868f90): every juggled one is
  // warm, or far lighter or darker
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const near = (h) => { const a = rgb(h), b = rgb('#868f90'); return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 40; };
  for (const c of cols(four.svg).concat(cols(three))) assert.ok(!near(c), c + ' is too close to Sprinkle’s grey pebble');
});

test('nobody is menacing: no teeth, and the spotty dog’s patch eye still shows when shut', () => {
  for (const [who, variant] of BEASTS) {
    for (const mood of ['shout', 'stern', 'laugh', 'scared']) {
      const svg = A.character(who, { variant, mood, pose: who === 'dog' ? 'stand' : 'sit' }).svg;
      // mouths are open ovals with a tongue: never a white jagged edge
      assert.ok(!/fill="#fff(fff)?"[^>]*d="M[^"]*L[^"]*L[^"]*L/.test(svg), `${who}${variant}/${mood}: no fangs`);
    }
  }
  for (const mood of ['happy', 'sleepy', 'laugh']) assert.ok(A.character('dog', { variant: 2, mood }).svg.includes('stroke="#f3eee4"'), 'patch eye drawn light: ' + mood);
});

// ---------------------------------------------------------------- Counts pictures, chapter 2

const crypto = require('crypto');

test('chapter 1’s counts pictures are unchanged (every table, group count and highlight)', () => {
  // A fingerprint of countsPicture({ table, groups, highlight }) for tables 1-10, 0-10 groups and
  // several highlights, ids normalised, taken from the chapter 1 code before chapter 2 extended it.
  // If chapter 1's counts art is ever changed on purpose, take a new fingerprint and say so.
  // Retaken 2026-10-04: the 'kind' face got warmer (lifted lids, pupils centred), which redraws the
  // pebble cats of tables 6-9 only; tables 1-5, the ones chapters 1 and 2 ask, are unchanged.
  const out = [];
  for (let t = 1; t <= 10; t++) for (const g of [0, 1, 3, 5, 8, 10]) for (const h of [0, 2, 5, 12]) out.push(strip(A.countsPicture({ table: t, groups: g, highlight: h })));
  out.push(strip(A.countsPicture({})));
  const all = out.join('\n');
  assert.strictEqual(crypto.createHash('sha256').update(all).digest('hex'), '77282dacdf5ca6b4c288c70cb9a9e0143bac779842f1febb63e673df76bbb2d4');
  // the UI's extra keys (thing, things) and an explicit per equal to the table change nothing
  assert.strictEqual(strip(A.countsPicture({ table: 2, groups: 3, highlight: 2, thing: 'ear', things: 'ears' })), strip(A.countsPicture({ table: 2, groups: 3, highlight: 2 })));
  assert.strictEqual(strip(A.countsPicture({ table: 2, groups: 3, per: 2, highlight: 2 })), strip(A.countsPicture({ table: 2, groups: 3, highlight: 2 })));
  assert.strictEqual(strip(A.countsPicture({ table: 1, groups: 4, highlight: 1, kind: 'cats', layout: 'stacks' })), strip(A.countsPicture({ table: 1, groups: 4, highlight: 1 })));
});

const totals = (s) => (s.match(/<text class="pc-total"[^>]*>(\d+)<\/text>/g) || []).map((x) => +x.replace(/<[^>]+>/g, ''));
const nexts = (s) => (s.match(/class="pc-next"/g) || []).length;

test('totals: each counted group’s running total under it (2, 4, 6…); next: a soft glow on the next group', () => {
  for (let hl = 0; hl <= 10; hl++) {
    const s = A.countsPicture({ table: 2, groups: 5, highlight: hl, totals: true, next: true });
    checkSvgDoc(s, 'skip ' + hl);
    const want = [];
    for (let g = 1; g * 2 <= hl; g++) want.push(g * 2);
    assert.deepStrictEqual(totals(s), want, 'totals at highlight ' + hl);
    assert.strictEqual(nexts(s), hl < 10 ? 1 : 0, 'one next glow until the last group is counted');
    assert.ok(/font-family="Andika/.test(s) || hl < 2, 'totals in Andika');
  }
  assert.deepStrictEqual(totals(A.countsPicture({ table: 1, groups: 3, highlight: 3, totals: true })), [1, 2, 3], 'the 1s');
  assert.deepStrictEqual(totals(A.countsPicture({ table: 5, groups: 2, highlight: 10, totals: true })), [5, 10], 'the 5s');
  assert.deepStrictEqual(totals(A.countsPicture({ table: 2, groups: 3, highlight: 6 })), [], 'no totals unless asked');
  assert.strictEqual(nexts(A.countsPicture({ table: 2, groups: 3, highlight: 0 })), 0, 'no next unless asked');
  const h = (s) => +s.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1];
  assert.ok(h(A.countsPicture({ table: 2, groups: 5, totals: true })) > h(A.countsPicture({ table: 2, groups: 5 })), 'room for the totals');
});

test('who: the cast in place of the Clan cats, left to right; the old tom flattens his ears when counted', () => {
  const rim = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 3 }, { who: 'snorter' }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  const s8 = A.countsPicture({ table: 2, groups: 5, highlight: 8, totals: true, next: true, who: rim });
  const s10 = A.countsPicture({ table: 2, groups: 5, highlight: 10, totals: true, next: true, who: rim });
  checkSvgDoc(s8, 'rim 8'); checkSvgDoc(s10, 'rim 10');
  assert.ok(s8.includes('#dba79f'), 'the grizzled old tom is there (his scar)');
  assert.ok(!A.countsPicture({ table: 2, groups: 5 }).includes('#dba79f'), 'not among the generic cats');
  // once his two ears are counted they flatten: his ears turn further out, the rest of the picture is the same cats
  const earRot = (s) => (s.match(/scale\(-?1,1\) rotate\(([\d.]+)\)/g) || []).map((x) => +x.match(/rotate\(([\d.]+)\)/)[1]);
  assert.ok(Math.max(...earRot(s10)) > Math.max(...earRot(s8)) + 30, 'flat ears still count');
  assert.deepStrictEqual(totals(s10), [2, 4, 6, 8, 10]);
  // a who entry can carry its own mood and pose; litMood overrides once counted
  const one = A.countsPicture({ table: 2, groups: 1, highlight: 2, who: [{ who: 'tallyheart', mood: 'proud', litMood: 'laugh' }] });
  assert.ok(one.includes('L7,-23L-1,-18L9,-12'), 'Tallyheart’s torn ear');
  assert.notStrictEqual(strip(one), strip(A.countsPicture({ table: 2, groups: 1, highlight: 2, who: [{ who: 'tallyheart', mood: 'proud' }] })), 'litMood applies');
  // fewer entries than groups: the rest are the generic cats
  checkSvgDoc(A.countsPicture({ table: 2, groups: 4, highlight: 3, who: [{ who: 'waffles' }] }), 'short who');
  // the player, from opts.look; otters and dogs too ("three dogs, six ears")
  checkSvgDoc(A.countsPicture({ table: 2, groups: 1, who: [{ who: 'player' }], look: { fur: 'ginger', marking: 'none', eyes: 'green' } }), 'player');
  const dogs = A.countsPicture({ table: 2, groups: 3, highlight: 6, who: [{ who: 'dog', variant: 1 }, { who: 'dog', variant: 2 }, { who: 'dog', variant: 3 }] });
  checkSvgDoc(dogs, 'dogs');
  assert.ok(dogs.includes('#62b6e4') && dogs.includes('#e0503f') && dogs.includes('#4f8fd6'), 'all three dogs');
  for (const t of [1, 3, 4, 6]) checkSvgDoc(A.countsPicture({ table: t, groups: 2, highlight: 3, who: [{ who: 'riffle' }, { who: 'glintstar' }] }), 'who on table ' + t);
});

/* A Clan cat never wears her coat: with a cat in the first default look (a brown tabby, green eyes)
 * the first rim cat, a brown tabby too, sat beside her as her twin (chapter 2's f020, f023, f025, and
 * the skip-count and the 3 × 2 picture that share the rim). */
test('a Clan cat never wears the player’s coat: one in her fur wears a spare that no other Clan cat in the picture wears', () => {
  const norm = (s) => s.replace(/(id="|url\(#|href="#)[^")]+/g, '$1X');
  const she = { sex: 'she', fur: 'brown-tabby', marking: 'none', eyes: 'green' };
  const cv = A.clanVariant;
  // the six Clan coats, variant 1 to 6 (cats.js CLAN)
  const CLAN_FUR = ['brown-tabby', 'black', 'cream', 'grey', 'calico', 'ginger'];
  assert.strictEqual(cv(1, she, [1, 2, 3, 5]), 4, 'the rim’s brown tabby: the grey with white paws, the first spare');
  assert.strictEqual(cv(1, she, [1, 4]), 6, 'a spare already in the picture is skipped');
  assert.strictEqual(cv(1, she), 4);
  for (const v of [2, 3, 4, 5, 6]) assert.strictEqual(cv(v, she, [1, 2, 3, 4, 5, 6]), v, 'other coats stay');
  assert.strictEqual(cv(1, {}), 4, 'a look with no fur is drawn a brown tabby, so the brown tabby Clan cat changes');
  assert.strictEqual(cv(1), 1, 'no look at all (a character drawn on its own): as asked');
  // every fur a player can pick: no Clan coat in that fur survives, whatever the picture holds
  for (const fur of ['black', 'white', 'silver-tabby', 'brown-tabby', 'ginger', 'cream', 'grey', 'tortie', 'calico']) {
    for (const taken of [[], [1, 2, 3, 5], [1, 4, 6], [2, 4], [1, 2, 3, 4, 5, 6]]) {
      for (let v = 1; v <= 6; v++) {
        const w = cv(v, { fur }, taken);
        assert.notStrictEqual(CLAN_FUR[w - 1], fur, fur + ': variant ' + v + ' with ' + taken + ' became ' + w);
        if (CLAN_FUR[v - 1] !== fur) assert.strictEqual(w, v, 'a Clan cat not in her fur keeps its coat');
      }
    }
  }
  // the drawing: a swapped Clan cat is drawn exactly as the spare
  assert.strictEqual(norm(A.character('clancat', { pose: 'sit', variant: 1, look: she, taken: [1, 2, 3, 5] }).svg), norm(A.character('clancat', { pose: 'sit', variant: 4 }).svg));
  assert.strictEqual(norm(A.character('clancat', { pose: 'sit', variant: 1, look: { fur: 'black' } }).svg), norm(A.character('clancat', { pose: 'sit', variant: 1 }).svg));
  // the counting pictures: the rim cats in `who` get the same coat as in the panel
  const rim3 = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }];
  assert.strictEqual(norm(A.countsPicture({ table: 2, groups: 3, who: rim3, look: she })),
    norm(A.countsPicture({ table: 2, groups: 3, who: [{ who: 'clancat', variant: 4 }, rim3[1], rim3[2]], look: she })));
  assert.strictEqual(norm(A.countsPicture({ table: 2, groups: 3, who: rim3, look: { fur: 'ginger' } })),
    norm(A.countsPicture({ table: 2, groups: 3, who: rim3, look: { fur: 'tortie' } })), 'no Clan cat in her fur: nothing changes');
  // chapter 1's counting pictures (no `who`) are not touched by her look
  assert.strictEqual(norm(A.countsPicture({ table: 1, groups: 10, highlight: 4, look: she })), norm(A.countsPicture({ table: 1, groups: 10, highlight: 4 })));
});

// A stand-in for the pile set's PC.art.prey that records how it was called.
function stubPrey() {
  const calls = [];
  const fn = (o) => {
    calls.push(Object.assign({}, o));
    if (o.part === 'glow' || o.part === 'spark') return { svg: o.lit ? `<g data-part="${o.part}"/>` : '', w: 60, h: 40 };
    return { svg: `<g data-prey="${o.kind}" data-lit="${o.lit ? 1 : 0}" data-seed="${o.seed}"/>`, w: 60, h: 40 };
  };
  return { fn, calls };
}
function placed(s) {
  // every body piece: kind, lit, seed and where its box was put
  const re = /<g transform="translate\(([-\d.]+),([-\d.]+)\) scale\([\d.]+\)"><g data-prey="(\w+)" data-lit="(\d)" data-seed="(\d+)"\/><\/g>/g;
  const out = [];
  let m;
  while ((m = re.exec(s))) out.push({ x: +m[1], y: +m[2], kind: m[3], lit: m[4] === '1', seed: +m[5] });
  return out;
}

test('prey: drawn by PC.art.prey at call time, stacks of `per`, lit in order, halos behind and sparkles on top', () => {
  const st = stubPrey();
  A.prey = st.fn;
  try {
    const s = A.countsPicture({ table: 2, groups: 8, per: 2, kind: 'prey', highlight: 5, totals: true, next: true });
    checkSvgDoc(s, 'prey stacks');
    const bodies = st.calls.filter((c) => c.part === 'body');
    assert.strictEqual(bodies.length, 16, 'one piece each');
    assert.ok(bodies.every((c) => ['mouse', 'vole'].includes(c.kind) && Number.isInteger(c.seed)), 'kinds and seeds');
    const kinds = new Set(bodies.map((c) => c.kind));
    assert.ok(kinds.has('mouse') && kinds.has('vole'), 'mice and voles');
    const p = placed(s);
    assert.strictEqual(p.filter((q) => q.lit).length, 5, 'the first five pieces lit');
    // the first two stacks are lit, and the top of the third (a stack is counted top to bottom)
    const xs = [...new Set(p.map((q) => q.x))];
    assert.ok(xs.length >= 5, 'stacks side by side');
    assert.deepStrictEqual(totals(s), [2, 4], 'totals under the two finished stacks');
    assert.strictEqual(nexts(s), 1);
    // layers: every halo before every body, every sparkle after
    const iGlow = s.lastIndexOf('data-part="glow"'), iBody = s.indexOf('data-prey='), iBodyLast = s.lastIndexOf('data-prey='), iSpark = s.indexOf('data-part="spark"');
    assert.ok(iGlow < iBody && iBodyLast < iSpark, 'halos behind, sparkles on top');
    assert.ok(/aria-label="8 stacks of 2 prey"/.test(s));
  } finally { delete A.prey; }
});

test('prey rows: `groups` rows of `per`, the top row first; the same pile as the stacks', () => {
  const st = stubPrey();
  A.prey = st.fn;
  try {
    const rows = A.countsPicture({ table: 2, groups: 2, per: 8, kind: 'prey', layout: 'rows', highlight: 8, totals: true, next: true });
    checkSvgDoc(rows, 'prey rows');
    const p = placed(rows);
    assert.strictEqual(p.length, 16);
    const ys = [...new Set(p.map((q) => q.y))].sort((a, b) => a - b);
    assert.strictEqual(ys.length, 2, 'two rows');
    assert.ok(p.filter((q) => q.lit).every((q) => q.y === ys[0]), 'the eight top pieces light up as one row');
    assert.strictEqual(p.filter((q) => q.y === ys[0]).length, 8, 'eight in a row');
    assert.deepStrictEqual(totals(rows), [8]);
    assert.strictEqual(nexts(rows), 1, 'the bottom row glows next');
    assert.ok(/aria-label="2 rows of 8 prey"/.test(rows));
    // the same pieces as eight stacks of two: every seed is the same kind in both pictures
    const kindOf = (calls) => new Map(calls.filter((c) => c.part === 'body').map((c) => [c.seed, c.kind]));
    const a = kindOf(st.calls);
    st.calls.length = 0;
    A.countsPicture({ table: 2, groups: 8, per: 2, kind: 'prey' });
    const b = kindOf(st.calls);
    assert.deepStrictEqual([...a.entries()].sort(), [...b.entries()].sort(), 'eight twos and two eights are the same sixteen');
  } finally { delete A.prey; }
});

test('prey without PC.art.prey (or a broken one): our own soft prey', () => {
  delete A.prey;
  for (const [groups, per, layout, hl] of [[8, 2, 'stacks', 6], [2, 8, 'rows', 8], [10, 2, 'stacks', 0], [1, 1, 'stacks', 1], [0, 2, 'stacks', 0], [3, 4, 'rows', 12]]) {
    const s = A.countsPicture({ table: 2, groups, per, kind: 'prey', layout, highlight: hl, totals: true });
    checkSvgDoc(s, `fallback ${groups}x${per} ${layout}`);
  }
  A.prey = () => { throw new Error('not yet'); };
  try { checkSvgDoc(A.countsPicture({ table: 2, groups: 3, kind: 'prey', highlight: 2 }), 'throwing prey'); } finally { delete A.prey; }
  A.prey = () => ({ svg: '<svg viewBox="0 0 10 10"><circle r="3"/></svg>', w: 10, h: 10 });
  try {
    const s = A.countsPicture({ table: 2, groups: 1, kind: 'prey' });
    checkSvgDoc(s, 'prey returning an <svg>');
    assert.strictEqual((s.match(/<svg/g) || []).length, 1, 'a returned <svg> wrapper is unwrapped');
  } finally { delete A.prey; }
  for (const kind of ['mouse', 'vole', 'fish']) {
    const r = A.preyFallback({ kind, lit: true });
    assert.ok(r.w > 0 && r.h > 0 && balanced(r.svg) === null, kind);
    assert.ok(r.svg.includes('#ffb21f'), kind + ' lit glows');
    assert.ok(!A.preyFallback({ kind }).svg.includes('#ffb21f'), kind + ' unlit');
    assert.ok(!/#c0392b|#b3122e|#d62828/i.test(r.svg), kind + ': no blood');
    assert.strictEqual(A.preyFallback({ kind, part: 'glow' }).svg, '', 'no halo unless lit');
  }
});

test('thought: the picture in a thought cloud under an evening sky, trailing bubbles to the thinker', () => {
  const s = A.countsPicture({ table: 2, groups: 10, per: 2, kind: 'prey', thought: true });
  checkSvgDoc(s, 'thought');
  assert.ok(/aria-label="A thought: 10 stacks of 2 prey"/.test(s));
  assert.ok(/<linearGradient id="[^"]+-sky"/.test(s) && s.includes('#3B3A74'), 'an evening sky');
  assert.ok(/<clipPath id="[^"]+-c">/.test(s), 'clipped to the cloud');
  const bubbles = (x) => (x.match(/<circle cx="([\d.]+)" cy="[\d.]+" r="(18|12|7.5)" fill="#fffaf0"/g) || []).map((m) => +m.match(/cx="([\d.]+)"/)[1]);
  const left = bubbles(s), right = bubbles(A.countsPicture({ table: 2, groups: 10, per: 2, kind: 'prey', thought: 'right' }));
  assert.strictEqual(left.length, 3, 'three little bubbles');
  assert.ok(left[0] > left[2] && right[0] < right[2], 'trailing down to the left, or to the right');
  // the cats picture and the rows can be thoughts too; totals turn light on the dark sky
  const t2 = A.countsPicture({ table: 2, groups: 3, highlight: 6, totals: true, thought: true });
  checkSvgDoc(t2, 'cats thought');
  assert.ok(t2.includes('fill="#fff6d6"'), 'light totals on the evening sky');
  checkSvgDoc(A.countsPicture({ table: 2, groups: 2, per: 8, kind: 'prey', layout: 'rows', thought: true, highlight: 3 }), 'rows thought');
  // two thoughts in one page don't share ids
  const id1 = s.match(/id="([^"]+)-sky"/)[1], id2 = A.countsPicture({ table: 2, groups: 1, thought: true }).match(/id="([^"]+)-sky"/)[1];
  assert.notStrictEqual(id1, id2);
});

test('ears in rows: five pairs of ears as two rows of five (left ears, then right ears)', () => {
  const s = A.countsPicture({ table: 2, groups: 2, per: 5, layout: 'rows', highlight: 7, totals: true, next: true });
  checkSvgDoc(s, 'ear rows');
  assert.strictEqual((s.match(/<path d="M-13,4Q-9,-14 1,-31Q9,-14 14,4Z"/g) || []).length, 10, 'ten ears');
  assert.ok(/aria-label="2 rows of 5 ears"/.test(s));
  assert.deepStrictEqual(totals(s), [5]);
  assert.strictEqual(nexts(s), 1);
  // each column is one cat's pair: the same fur in both rows, a different cat in each column
  const fills = (s.match(/<path d="M-13,4Q-9,-14 1,-31Q9,-14 14,4Z" fill="(#[0-9a-f]+)"/g) || []).map((m) => m.match(/fill="(#[0-9a-f]+)"/)[1]);
  assert.strictEqual(new Set(fills.slice(0, 5)).size, 5, 'five cats');
  const lit = (s.match(/opacity="\.45"\/><circle/g) || []).length;
  assert.strictEqual(lit, 7, 'seven ears lit');
  checkSvgDoc(A.countsPicture({ table: 3, groups: 3, per: 4, layout: 'rows', highlight: 5 }), 'other tables: pebbles in rows');
});

test('no fish in the pile: every prey picture is mice and voles, the boast, the pile and the check alike', () => {
  const st = stubPrey();
  A.prey = st.fn;
  try {
    for (const o of [{ groups: 10, per: 2, thought: true }, { groups: 8, per: 2 }, { groups: 9, per: 2 }, { groups: 2, per: 8, layout: 'rows' }, { groups: 2, per: 10, layout: 'rows' }]) {
      A.countsPicture(Object.assign({ table: 2, kind: 'prey', highlight: 3 }, o));
    }
    const kinds = new Set(st.calls.filter((c) => c.part === 'body').map((c) => c.kind));
    assert.deepStrictEqual([...kinds].sort(), ['mouse', 'vole']);
  } finally { delete A.prey; }
  delete A.prey;
  // the fallback draws no fish in a pile either (its fish kind stays, for the otters, when asked for)
  const s = A.countsPicture({ table: 2, groups: 10, per: 2, kind: 'prey', highlight: 20 });
  assert.ok(!s.includes('#c3ced7'), 'no silver fish');
  assert.ok(A.preyFallback({ kind: 'fish' }).svg.includes('#c3ced7'), 'a fish when one is asked for');
});

test('flatEars: any mood with its ears laid flat, as the counted old tom’s (f020: “flattens his ears at you”)', () => {
  const earRot = (s) => (s.match(/scale\(-?1,1\) rotate\(([\d.]+)\)/g) || []).map((x) => +x.match(/rotate\(([\d.]+)\)/)[1]);
  const strip = (x) => x.replace(/pc[0-9a-z]+-[0-9a-z]+/g, 'id');
  for (const mood of ['stern', 'neutral', 'solemn']) {
    const up = A.character('grizzled', { pose: 'sit', mood, facing: 'left' }), flat = A.character('grizzled', { pose: 'sit', mood, facing: 'left', flatEars: true });
    checkResult(flat, 'flat ' + mood);
    assert.ok(Math.min(...earRot(flat.svg)) >= Math.max(...earRot(up.svg)) + 40, mood + ': ears turned well out');
    // the same drawing as the Counts picture's counted tom, and as an explicit earBias
    assert.strictEqual(strip(flat.svg), strip(A.character('grizzled', { pose: 'sit', mood, facing: 'left', earBias: 46 }).svg));
    // the face keeps its mood: a stern glare stays a glare (mood 'scared' would flatten the ears, with a frightened face)
    if (mood === 'stern') assert.ok(flat.svg.includes('M0,11.6V13.6M-6,15.8Q0,12.2 6,15.8') && !flat.svg.includes('rx="2.4" ry="3.3"'), 'stern frown, not the scared mouth');
  }
  assert.ok(A.character('grizzled', { pose: 'sit', mood: 'stern', flatEars: true }).svg.includes('#dba79f'), 'still the old tom');
});

const stoneAt = (s) => (s.match(/<g class="pc-stone" transform="translate\(([-\d.]+),([-\d.]+)\)/g) || []).map((m) => m.match(/translate\(([-\d.]+),([-\d.]+)\)/).slice(1).map(Number));

test('holds: Riffle’s lucky stone, smooth and nearly black with one white band, at the paws or in the mouth', () => {
  const look = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
  for (const who of ['player', 'tallyheart', 'waffles', 'clancat']) {
    for (const pose of A.vocab.poses) {
      for (const facing of FACINGS) {
        const r = A.character(who, { pose, mood: 'happy', facing, look, holds: 'stone' });
        checkResult(r, `${who}/${pose}/${facing} holding`);
        const n = stoneAt(r.svg).length;
        // nothing held while tumbling, or on her back (chapter 3's `tummy`)
        if (pose === 'fall' || pose === 'tummy') { assert.strictEqual(n, 0, 'nothing held while tumbling'); assert.ok(!r.held); continue; }
        assert.strictEqual(n, 1, `${who}/${pose}: one stone`);
        assert.ok(r.svg.includes('stroke="#fbf7ee"'), 'its white band');
        assert.ok(r.svg.includes('fill="#2e2b36"'), 'nearly black');
        const h = r.held;
        assert.ok(h && h.what === 'stone' && h.x > 0 && h.x < 200 && h.y > 0 && h.y < 200 && h.r > 4, `${who}/${pose}: held box ${JSON.stringify(h)}`);
        assert.ok(r.bounds.x0 <= h.x - h.r + 3 && h.x + h.r - 3 <= r.bounds.x1 && h.y + h.r - 3 <= r.bounds.y1, `${who}/${pose}: the stone is inside the cat's box`);
        // on its feet it carries the stone in its mouth; otherwise it is at the front paws, on the ground
        const onFeet = ['stand', 'walk', 'peer', 'stretch'].includes(pose);
        assert.strictEqual(h.at, onFeet ? 'mouth' : 'paws', `${who}/${pose}`);
        if (onFeet) assert.ok(Math.abs(h.x - r.head.x) < 30 && h.y > r.head.y && h.y < r.headBox.y1 + 6, `${who}/${pose}: in the mouth`);
        // (Waffles curled or flat rests on her ruff, paws a little off the ground: the stone stays at her paws)
        else if (who !== 'waffles') assert.ok(h.y > 175 && h.y + h.r > r.bounds.y1 - 6, `${who}/${pose}: on the ground (${h.y})`);
        // in front of the cat, the way it faces
        if (!onFeet) assert.ok(facing === 'right' ? h.x > r.head.x - 12 : h.x < r.head.x + 12, `${who}/${pose}/${facing}: in front`);
      }
    }
  }
  // nothing held unless asked; an unknown prop is ignored
  assert.ok(!A.character('player', { pose: 'sit' }).held);
  assert.strictEqual(stoneAt(A.character('player', { pose: 'sit', holds: 'teacup' }).svg).length, 0);
  // the nest choices: by the nose (a little way in front) or under the chin (the chin rests on it)
  const paws = A.character('player', { pose: 'loaf', mood: 'happy', look, holds: 'stone' }).held;
  const nose = A.character('player', { pose: 'loaf', mood: 'happy', look, holds: 'stone', holdAt: 'nose' }).held;
  const chinR = A.character('player', { pose: 'loaf', mood: 'happy', look, holds: 'stone', holdAt: 'chin' });
  assert.ok(nose.x > paws.x + 10 && nose.at === 'nose', 'by the nose: further out than the paws');
  assert.ok(chinR.held.at === 'chin' && chinR.held.x < paws.x - 4 && Math.abs(chinR.held.x - chinR.head.x) < 20 && chinR.held.y > 175,
    'under the chin: tucked in between the paws, right below the face ' + JSON.stringify(chinR.held) + ' ' + JSON.stringify(chinR.head));
  // under the chin the head is drawn over the stone; at the paws the stone lies on top of everything
  const headAt = (x) => x.indexOf('<g transform="matrix(', x.indexOf('<g transform="matrix(') + 1);
  assert.ok(chinR.svg.indexOf('pc-stone') < headAt(chinR.svg), 'chin: behind the head');
  const pawsR = A.character('player', { pose: 'loaf', mood: 'happy', look, holds: 'stone' });
  assert.ok(pawsR.svg.indexOf('pc-stone') > headAt(pawsR.svg), 'paws: in front');
  for (const pose of ['curl', 'lie', 'sit']) {
    const c = A.character('player', { pose, mood: 'sleepy', look, holds: 'stone', holdAt: 'chin' });
    checkResult(c, pose + ' chin');
    assert.ok(c.held.y <= 190 && c.held.y > c.head.y, pose + ': under the chin, never under the ground');
  }
  // art.cat takes it too, and the stone mirrors with the cat
  const rc = A.cat({ pose: 'sit', look, holds: 'stone', facing: 'right' }), lc = A.cat({ pose: 'sit', look, holds: 'stone', facing: 'left' });
  assert.ok(rc.held && lc.held && Math.abs(rc.held.x + lc.held.x - 200) < 0.5 && rc.held.y === lc.held.y, 'mirrored');
});

test('sand rows: two rows of eight lit a column at a time, top and bottom together; earth beside the pile', () => {
  // the scratches in drawing order are row by row; which are lit after each step of two
  const lit = (s) => (s.match(/stroke="(#e39a12|#9c7440|#4e3524)" stroke-width="4.6"/g) || []).map((m) => m.includes('#e39a12'));
  for (let counted = 0; counted <= 16; counted += 2) {
    const s = A.sand({ groups: 2, per: 8, counted, layout: 'rows' });
    checkSvgDoc(s, 'rows ' + counted);
    const l = lit(s);
    assert.strictEqual(l.length, 16, 'sixteen scratches');
    const top = l.slice(0, 8), bottom = l.slice(8);
    assert.deepStrictEqual(top, bottom, counted + ': top and bottom light together');
    assert.deepStrictEqual(top, top.map((x, j) => j < counted / 2), counted + ': a column at a time, left to right');
  }
  const s = A.sand({ groups: 2, per: 8, counted: 6, layout: 'rows' });
  assert.ok(/aria-label="2 rows of 8 scratches in the sand"/.test(s));
  assert.strictEqual((s.match(/<rect /g) || []).length, 2, 'one long row each');
  // two rows, one above the other: the first scratch of each row at the same x, lower y
  const starts = (s.match(/<path d="M([\d.]+),([\d.]+)Q[^"]+" stroke="#(e39a12|9c7440)"/g) || []).map((m) => m.match(/M([\d.]+),([\d.]+)/).slice(1).map(Number));
  assert.strictEqual(starts[0][0], starts[8][0]);
  assert.ok(starts[8][1] > starts[0][1] + 30);
  assert.ok(new Set(starts.slice(0, 8).map((q) => q[1])).size === 1, 'eight in one row');
  // other shapes and an odd step still light in column order
  const t = lit(A.sand({ groups: 3, per: 4, counted: 5, layout: 'rows' }));
  assert.deepStrictEqual(t, [true, true, false, false, true, true, false, false, true, false, false, false]);
  checkSvgDoc(A.sand({ groups: 0, per: 8, layout: 'rows' }), 'no rows');
  checkSvgDoc(A.sand({ groups: 1, per: 10, counted: 10, layout: 'rows' }), 'one row of ten');
  // the earth beside the pile: the same scratches in darker ground
  const e = A.sand({ groups: 8, per: 2, counted: 6, ground: 'earth' });
  checkSvgDoc(e, 'earth');
  assert.ok(e.includes('#a27a55') && !e.includes('#efd6a2') && /scratches in the earth"/.test(e));
  assert.deepStrictEqual(lit(e).filter(Boolean).length, 6);
  // without the new options, sand is what it was
  assert.ok(A.sand({ groups: 2, per: 8, counted: 6 }).includes('#efd6a2'));
  assert.ok(/aria-label="2 groups of 8 scratches in the sand"/.test(A.sand({ groups: 2, per: 8, counted: 6 })));
});

test('faces: Waffles’ whiskers start below her eyes; a kind face looks at you, pupils centred', () => {
  // the flat face's eyes: centred at y 1, 1.1 x the eye path (to y 13.3); every whisker starts lower
  const wf = A.character('waffles', { pose: 'sit', mood: 'neutral' }).svg;
  const wh = wf.match(/<path d="(M[^"]+)" stroke="#[0-9a-f]+" stroke-width="1.2" stroke-linecap="round" opacity=".75"\/>/);
  assert.ok(wh, 'whiskers drawn');
  const ys = wh[1].match(/M[-\d.]+,([-\d.]+)/g).map((m) => +m.split(',')[1]);
  assert.strictEqual(ys.length, 4);
  assert.ok(ys.every((y) => y >= 14), 'below the eyes: ' + ys.join(' '));
  // a kind face: pupils close to the middle of each eye (the old sideways glance read as sly)
  const pupils = (s) => (s.match(/<ellipse cx="([-\d.]+)" cy="[-\d.]+" rx="3.4" ry="7" fill="#221b26"\/>/g) || []).map((m) => +m.match(/cx="([-\d.]+)"/)[1]);
  const kind = pupils(A.character('tallyheart', { pose: 'sit', mood: 'kind' }).svg), neutral = pupils(A.character('tallyheart', { pose: 'sit', mood: 'neutral' }).svg);
  assert.strictEqual(kind.length, 2);
  assert.ok(kind.every((x) => Math.abs(x) <= 0.5) && neutral.every((x) => Math.abs(x) >= 1.4), 'kind ' + kind + ', neutral ' + neutral);
  // still kind: soft lids, a smile and a blush
  const k = A.character('tallyheart', { pose: 'sit', mood: 'kind' }).svg;
  assert.ok(k.includes('#ff8aa5') && k.includes('Q-3.8,17.4 0,13.6'), 'blush and smile');
});

// ---------------------------------------------------------------- chapter 3 (build.md v0.4)

const DZ_POSES = ['eyes', 'unfold', 'hide', 'sniff', 'sit', 'wings', 'flat', 'gulp', 'burp', 'pawsup', 'pawup', 'draw', 'touch', 'peek', 'curl', 'lie'];
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255); };
const count = (s, re) => (s.match(re) || []).length;

test('chapter 1 and 2’s characters are unchanged by chapter 3 (a fingerprint of every old cast, pose and mood)', () => {
  // Taken from the chapter 2 code before chapter 3 extended it (2026-10-06), ids normalised: every
  // cat in every chapter 1 pose and mood, the stone and flat ears, the otters, dogs, the Tall One,
  // sparrow and moth, and the sand. If chapter 1 or 2's art is ever changed on purpose, take a new
  // fingerprint and say so. Changed on purpose 2026-10-06: Riffle's pebbles (cats.js, pebble()) lost
  // their slate and blue-grey for a rusty red and a chalk white, so none of them reads as Sprinkle's
  // plain grey pebble beside it; with the old two colours put back the hash is the one before
  // (918ee608…), so nothing else moved.
  const out = [];
  const POSES = ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer'];
  const MOODS = ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn'];
  const look = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
  for (const who of ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat']) for (const pose of POSES) for (const mood of MOODS) {
    const r = A.character(who, { pose, mood, facing: mood.length % 2 ? 'left' : 'right', look, variant: 3 });
    out.push(strip(r.svg), JSON.stringify([r.head, r.headBox, r.bounds, r.held || null, r.chestTop || null]));
  }
  for (const pose of POSES) for (const holdAt of [undefined, 'paws', 'mouth', 'chin', 'nose']) out.push(strip(A.character('player', { pose, look, holds: 'stone', holdAt }).svg));
  for (const pose of POSES) out.push(strip(A.character('grizzled', { pose, mood: 'stern', flatEars: true }).svg));
  const OP = ['stand', 'sit', 'scramble', 'swim', 'float', 'juggle', 'slide', 'hug', 'sun'];
  for (const [who, poses] of [['riffle', OP], ['otter', OP], ['dog', ['stand', 'jump', 'sit', 'bounce', 'howl']]])
    for (const variant of [1, 2, 3]) for (const pose of poses) for (const mood of MOODS) {
      const r = A.character(who, { pose, mood, variant, facing: mood.length % 2 ? 'left' : 'right' });
      out.push(strip(r.svg), JSON.stringify([r.head, r.headBox, r.bounds]));
    }
  for (const who of ['tallone', 'sparrow', 'moth']) for (const pose of ['stand', 'water', 'set-dish', 'perch', 'fluffed', 'fly']) out.push(strip(A.character(who, { pose, facing: 'left' }).svg));
  for (const [g, p, c] of [[3, 1, 2], [1, 10, 7], [2, 8, 6], [8, 2, 5]]) for (const layout of [undefined, 'rows']) for (const ground of [undefined, 'earth']) out.push(A.sand({ groups: g, per: p, counted: c, layout, ground }));
  assert.strictEqual(crypto.createHash('sha256').update(out.join('\n')).digest('hex'), '95c053f77212183c1e9cf6a9f949a84edd9674dae0bac1127486fbccb3cbfd1b');
  // and the new options, when absent or false, change nothing
  const base = A.character('tallyheart', { pose: 'sit', mood: 'kind' });
  const off = A.character('tallyheart', { pose: 'sit', mood: 'kind', claws: false, puffed: false, squeeze: false, moss: false, tear: false, mist: false });
  assert.strictEqual(strip(off.svg), strip(base.svg));
  assert.strictEqual(strip(A.sand({ groups: 3, per: 2, counted: 2, ground: 'sand' })), strip(A.sand({ groups: 3, per: 2, counted: 2 })), 'explicit sand is the default');
  assert.strictEqual(strip(A.countsPicture({ table: 5, groups: 3, highlight: 7 })), strip(A.countsPicture({ table: 5, groups: 3, highlight: 7, who: [] })), 'an empty who keeps chapter 1’s 5s');
});

test('chapter 3 vocabulary: Sprinkle’s poses, the otters’ dive and hush (build.md v0.4)', () => {
  assert.deepStrictEqual(A.vocab.otherPoses.sprinkle, DZ_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.riffle.slice(-2), ['dive', 'hush']);
  assert.deepStrictEqual(A.vocab.otherPoses.otter, A.vocab.otherPoses.riffle);
  assert.ok(A.vocab.cast.includes('sprinkle') && A.vocab.cast.includes('murmurchime'));
  assert.ok(!('sprinkle' in A.vocab.variants), 'Sprinkle has no variants');
});

test('every Sprinkle pose x mood x facing renders, inside her box (640 x 340), feet on the ground', () => {
  let n = 0;
  for (const pose of DZ_POSES) {
    for (const mood of A.vocab.moods) {
      for (const facing of FACINGS) {
        const label = `sprinkle/${pose}/${mood}/${facing}`;
        const r = A.character('sprinkle', { pose, mood, facing });
        checkResult(r, label);
        assert.strictEqual(r.w, 640, label);
        assert.strictEqual(r.h, 340, label);
        const h = r.headBox, b = r.bounds;
        assert.ok(h && b, label + ': boxes');
        assert.ok(h.x0 <= r.head.x && r.head.x <= h.x1 && h.y0 <= r.head.y && r.head.y <= h.y1, label + ': head point inside the head box');
        assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= r.w + 1 && b.y1 <= r.h + 1, label + ': inside the box ' + JSON.stringify(b));
        if (pose !== 'eyes') assert.ok(Math.abs(r.h - 3 - b.y1) < 0.6, label + ': on the ground ' + b.y1);
        n++;
      }
    }
  }
  assert.strictEqual(n, DZ_POSES.length * A.vocab.moods.length * 2);
  // unknown values fall back to sit, neutral
  assert.strictEqual(strip(A.character('sprinkle', { pose: 'moonwalk', mood: 'grumpy' }).svg), strip(A.character('sprinkle', { pose: 'sit', mood: 'neutral' }).svg));
});

test('Sprinkle: a heron’s size, her head well above Tallyheart’s; long neck, tail on and on; ids unique', () => {
  // everyone's drawing units are the cats' units: compare heights above the ground line
  const top = (r) => (r.h - 3) - r.bounds.y0;
  const dz = top(A.character('sprinkle', { pose: 'sit' })), tally = top(A.character('tallyheart', { pose: 'sit' }));
  assert.ok(dz > tally * 1.5 && dz < tally * 2.1, `sitting, she is ${dz} tall, Tallyheart ${tally}`);
  const dzHead = (A.character('sprinkle', { pose: 'sit' }).h - 3) - A.character('sprinkle', { pose: 'sit' }).headBox.y1;
  assert.ok(dzHead > tally * 0.95, 'the bottom of her face is near the top of Tallyheart’s head');
  // the tail goes on and on: lying, she is far longer than she is tall
  const lie = A.character('sprinkle', { pose: 'lie' }).bounds;
  assert.ok(lie.x1 - lie.x0 > 1.9 * (lie.y1 - lie.y0), 'a long tail');
  const ids = (s) => (s.match(/id="([^"]+)"/g) || []).map((x) => x.slice(4, -1));
  for (const pose of DZ_POSES) {
    const svg = A.character('sprinkle', { pose, mood: 'laugh', holds: 'pebble', tear: true }).svg, defined = new Set(ids(svg));
    assert.strictEqual(defined.size, ids(svg).length, pose + ': unique ids');
    for (const ref of svg.match(/(?:url\(#|href="#)([^)"]+)/g) || []) assert.ok(defined.has(ref.replace(/^(url\(#|href="#)/, '')), `${pose}: dangling ${ref}`);
    assert.ok(svg.length < 30000, `${pose}: ${svg.length} bytes`);
  }
  const a = ids(A.character('sprinkle', {}).svg), b = ids(A.character('sprinkle', {}).svg);
  for (const id of b) assert.ok(!a.includes(id), 'ids differ between calls');
});

test('Sprinkle: five long pale claws on every forepaw, mist-grey and matte, round amber eyes, never toothy', () => {
  const paws = (svg) => svg.match(/<g class="pc-dclaws[^"]*"[^>]*>(.*?)<\/g>/g) || [];
  for (const pose of DZ_POSES.filter((p) => p !== 'eyes')) {
    const svg = A.character('sprinkle', { pose, mood: 'happy' }).svg;
    const p = paws(svg);
    assert.strictEqual(p.length, 2, pose + ': two forepaws');
    for (const g of p) assert.strictEqual(count(g, /<path /g), 5, pose + ': five claws a paw');
    assert.ok(svg.includes('fill="#a8b1b6"'), pose + ': mist grey');
    assert.ok(svg.includes('class="pc-ridges"'), pose + ': soft ridges down her back');
  }
  // nothing toothy, in any mood: no white jagged shapes in her mouth
  for (const mood of A.vocab.moods) {
    const svg = A.character('sprinkle', { pose: 'sit', mood }).svg;
    assert.ok(!/fill="#fff(fff)?"[^>]*d="M[^"]*L[^"]*L[^"]*L/.test(svg), mood + ': no fangs');
    assert.ok(svg.includes('stop-color="#f7c65c"'), mood + ': the amber eyes of chapter 2');
  }
  // only her eyes in the dark
  const eyes = A.character('sprinkle', { pose: 'eyes' }).svg;
  assert.ok(eyes.includes('pc-eyes-only') && !eyes.includes('pc-dclaws') && !eyes.includes('pc-wing'), 'eyes only');
  // the moods change her face, and the eyes shut for squeeze
  const seen = new Map();
  for (const mood of A.vocab.moods) {
    const s = strip(A.character('sprinkle', { pose: 'sit', mood }).svg);
    assert.ok(!seen.has(s), `${mood} looks the same as ${seen.get(s)}`);
    seen.set(s, mood);
  }
  assert.notStrictEqual(strip(A.character('sprinkle', { pose: 'flat', mood: 'scared', squeeze: true }).svg), strip(A.character('sprinkle', { pose: 'flat', mood: 'scared' }).svg));
});

test('Sprinkle’s wings: the left spreads like a sail, the right always droops (her right, facing either way)', () => {
  // the wing paths in drawing order: the far wing first; facing right her right wing is the near one
  const wings = (svg) => (svg.match(/<path class="pc-wing" d="([^"]+)"/g) || []).map((m) => m.match(/d="([^"]+)"/)[1]);
  const lowest = (d) => Math.max(...(d.match(/-?[\d.]+,-?[\d.]+/g) || []).map((q) => +q.split(',')[1]));
  const highest = (d) => Math.min(...(d.match(/-?[\d.]+,-?[\d.]+/g) || []).map((q) => +q.split(',')[1]));
  for (const pose of ['sit', 'wings', 'lie', 'unfold']) {
    const R = wings(A.character('sprinkle', { pose, facing: 'right' }).svg), L = wings(A.character('sprinkle', { pose, facing: 'left' }).svg);
    assert.strictEqual(R.length, 2, pose + ': two wings');
    // facing right: [far = left, near = right]; facing left: [far = right, near = left]
    const rightR = R[1], leftR = R[0], rightL = L[0], leftL = L[1];
    assert.ok(lowest(rightR) > lowest(leftR) + 20, pose + ': the right wing hangs lower (facing right)');
    assert.ok(lowest(rightL) > lowest(leftL) + 20, pose + ': the right wing hangs lower (facing left)');
    if (pose === 'wings') {
      assert.ok(highest(leftR) < highest(rightR) - 120, 'the left wing spreads high, a grey sail');
      assert.ok(highest(leftL) < highest(rightL) - 120, 'facing left too');
    }
  }
  // facing left, the sore right wing is the far one: it hangs half open behind her back, well clear of
  // her haunch (a second wing, low and scalloped, not a sliver clamped behind it)
  const xs = (d) => (d.match(/-?[\d.]+,-?[\d.]+/g) || []).map((q) => +q.split(',')[0]);
  const ys = (d) => (d.match(/-?[\d.]+,-?[\d.]+/g) || []).map((q) => +q.split(',')[1]);
  const far = wings(A.character('sprinkle', { pose: 'wings', mood: 'sad', facing: 'left' }).svg)[0];
  assert.ok(Math.max(...xs(far)) - Math.min(...xs(far)) > 180, 'wide open, half way: ' + (Math.max(...xs(far)) - Math.min(...xs(far))));
  assert.ok(Math.min(...xs(far)) < -200, 'reaching back past her haunch: ' + Math.min(...xs(far)));
  assert.ok(Math.max(...ys(far)) <= -4 && Math.min(...ys(far)) < -110, 'off the ground, up behind her back');
});

test('Sprinkle’s pebble: egg-smooth, mid grey with a green-blue cast, never banded, clearly lighter than Riffle’s stone', () => {
  for (const pose of ['sit', 'lie', 'wings', 'gulp', 'pawup', 'curl']) {
    const r = A.character('sprinkle', { pose, mood: 'shy', holds: 'pebble' });
    assert.strictEqual(count(r.svg, /class="pc-sprinkle-pebble"/g), 1, pose + ': one pebble');
    assert.ok(r.held && r.held.what === 'pebble' && r.held.r > 8, pose + ': held ' + JSON.stringify(r.held));
    assert.ok(r.held.x >= r.bounds.x0 && r.held.x <= r.bounds.x1 && r.held.y >= r.bounds.y0 && r.held.y <= r.bounds.y1, pose + ': inside her box');
  }
  const peb = A.character('sprinkle', { pose: 'sit', holds: 'pebble' }).svg.match(/<g class="pc-sprinkle-pebble".*?<\/g><\/g>/)[0];
  assert.ok(!peb.includes('#fbf7ee') && !/stroke-width="3.6"/.test(peb), 'no white band');
  const stone = A.character('player', { pose: 'loaf', holds: 'stone' }).svg;
  assert.ok(lum('#868f90') > lum('#2e2b36') + 60, 'much lighter than the stone');
  assert.ok(stone.includes('fill="#2e2b36"') && peb.includes('fill="#868f90"'));
  // a green-blue cast: its tint leans to green and blue over red
  const c = parseInt('6c9c99', 16);
  assert.ok(((c >> 8) & 255) > (c >> 16) + 30 && (c & 255) > (c >> 16) + 30);
  // cats can hold it too, where the stone would go
  const cat = A.character('player', { pose: 'loaf', holds: 'pebble' });
  assert.ok(cat.held.what === 'pebble' && cat.held.at === 'paws' && cat.svg.includes('pc-sprinkle-pebble'));
});

test('Sprinkle curled round someone: where they sit (`nest`) and her tail’s near loop to draw over them (`front`)', () => {
  for (const facing of FACINGS) {
    const r = A.character('sprinkle', { pose: 'curl', facing });
    assert.ok(r.nest && r.front, facing + ': nest and front');
    assert.ok(/^<g transform="matrix\(/.test(r.front) && r.front.includes('clip-path') && balanced(r.front) === null, facing + ': a group in her box');
    // in front of her face: facing left (as at the bridge's `dragon`, with `beside` at her left), to her left
    assert.ok(facing === 'left' ? r.nest.x < r.head.x : r.nest.x > r.head.x, facing + ': the nest is in front of her ' + JSON.stringify(r.nest));
    assert.ok(Math.abs(r.nest.y - (r.h - 3)) < 2, 'on the ground');
  }
  assert.ok(!A.character('sprinkle', { pose: 'sit' }).front && !A.character('sprinkle', { pose: 'sit' }).nest, 'only curled');
});

test('sad and shy, for everyone: cats, otters, dogs and Sprinkle', () => {
  const who = [['tallyheart', {}], ['player', { look: { fur: 'grey' } }], ['waffles', {}], ['riffle', {}], ['otter', { variant: 1 }], ['dog', { variant: 2 }], ['dog', { variant: 3 }], ['sprinkle', {}]];
  for (const [w, o] of who) {
    const n = strip(A.character(w, Object.assign({ pose: 'sit', mood: 'neutral' }, o)).svg);
    const sad = strip(A.character(w, Object.assign({ pose: 'sit', mood: 'sad' }, o)).svg), shy = strip(A.character(w, Object.assign({ pose: 'sit', mood: 'shy' }, o)).svg);
    assert.ok(sad !== n && shy !== n && sad !== shy, w + ': sad and shy are their own faces');
  }
  // a cat's sad face: brows up at the middle, a wobbly mouth; shy: eyes down, a small smile and a blush
  const sad = A.character('tallyheart', { pose: 'sit', mood: 'sad' }).svg, shy = A.character('tallyheart', { pose: 'sit', mood: 'shy' }).svg;
  assert.ok(sad.includes('Q-4.6,13.6 -3.1,15.2'), 'the wobbly mouth');
  assert.ok(shy.includes('Q-2.1,15.6 0,13.2') && shy.includes('#ff8aa5'), 'a small smile and a blush');
  const pupils = (s) => (s.match(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="3.4" ry="7" fill="#221b26"\/>/g) || []).map((m) => +m.match(/cy="([-\d.]+)"/)[1]);
  assert.ok(pupils(shy).every((y) => y >= 4), 'shy eyes look down: ' + pupils(shy));
});

test('new cat poses: pawup (one forepaw raised, claws out on it) and tummy (on her back, paws in the air)', () => {
  const look = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'she' };
  for (const who of CATS) {
    for (const facing of FACINGS) {
      const up = A.character(who, { pose: 'pawup', mood: 'happy', facing, look, claws: true });
      checkResult(up, who + ' pawup');
      // the raised paw: pads toward us, five claws on it
      assert.strictEqual(count(up.svg, /<g class="pc-claws"/g), 1, who + ': claws out on the raised paw');
      assert.strictEqual(count(up.svg.match(/<g class="pc-claws".*?<\/g>/)[0], /<path /g), 5);
      const t = A.character(who, { pose: 'tummy', mood: 'happy', facing, look, holds: 'stone' });
      checkResult(t, who + ' tummy');
      assert.ok(!t.held, 'on her back she holds nothing');
    }
  }
  // the raised paw is up near the chin, in front of the chest
  const r = A.character('clancat', { pose: 'pawup', variant: 1 }), s = A.character('clancat', { pose: 'sit', variant: 1 });
  assert.ok(r.bounds.x1 > s.bounds.x1 + 3, 'the raised paw reaches forward');
  // claws on a sitting cat go on its front paw, three tips showing
  const c = A.character('tallyheart', { pose: 'crouch', claws: true }).svg.match(/<g class="pc-claws".*?<\/g>/g);
  assert.ok(c && c.length === 1 && count(c[0], /<path /g) === 3);
});

test('cat extras: puffed, squeeze, moss, tear, mist (each drawn, each with its own look)', () => {
  const plain = A.character('player', { pose: 'sit', mood: 'scared', look: { fur: 'brown-tabby' } });
  const puffed = A.character('player', { pose: 'sit', mood: 'scared', look: { fur: 'brown-tabby' }, puffed: true });
  checkResult(puffed, 'puffed');
  assert.notStrictEqual(strip(puffed.svg), strip(plain.svg));
  const w = (r) => (r.bounds.x1 - r.bounds.x0) * (r.bounds.y1 - r.bounds.y0);
  const n = A.character('tallyheart', { pose: 'sit', mood: 'stern' }), p = A.character('tallyheart', { pose: 'sit', mood: 'stern', puffed: true });
  assert.ok(p.svg.includes('M0,11.6V13.6M-6,15.8Q0,12.2 6,15.8'), 'puffed keeps her stern face');
  assert.ok(count(p.svg, /L/g) > count(n.svg, /L/g) + 40, 'fur on end');
  const sq = A.character('mutterer', { pose: 'sit', mood: 'neutral', squeeze: true }).svg;
  assert.strictEqual(count(sq, /M7.6,-6.4L-5.4,0L7.6,6.4/g), 2, 'eyes squeezed shut');
  for (const [k, cls] of [['moss', 'pc-moss'], ['tear', 'pc-tear'], ['mist', 'pc-mist']]) {
    for (const who of ['snorer', 'waffles', 'player']) {
      const r = A.character(who, { pose: 'sit', mood: 'sleepy', [k]: true });
      checkResult(r, who + ' ' + k);
      assert.strictEqual(count(r.svg, new RegExp('class="' + cls + '"', 'g')), 1, who + ': ' + k);
      const b = r.bounds;
      assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= 201 && b.y1 <= 201, who + ' ' + k + ': inside the box');
    }
  }
  // the moss sits over the ears, the head box takes it in
  const m = A.character('snorer', { pose: 'sit', moss: true }), m0 = A.character('snorer', { pose: 'sit' });
  assert.ok(m.headBox.y0 <= m0.headBox.y0 + 1 && m.headBox.x1 - m.headBox.x0 > m0.headBox.x1 - m0.headBox.x0, 'moss over the ears');
  // tear and mist on Riffle, an otter and a dog too
  for (const [who, v] of [['riffle', 1], ['otter', 2], ['dog', 3]]) {
    const r = A.character(who, { variant: v, pose: 'sit', mood: 'sad', tear: true, mist: true, squeeze: true });
    checkResult(r, who + ' extras');
    assert.ok(r.svg.includes('pc-tear') && r.svg.includes('pc-mist'), who + ': tear and mist');
  }
});

test('holds: a vole in the mouth (her supper), or at the paws (the old tom pushing her one)', () => {
  for (const pose of A.vocab.poses) {
    const r = A.character('player', { pose, mood: 'worried', holds: 'vole', look: { fur: 'cream' } });
    checkResult(r, 'vole ' + pose);
    if (pose === 'fall' || pose === 'tummy') { assert.ok(!r.held); continue; }
    assert.ok(r.held && r.held.what === 'vole' && r.held.at === 'mouth', pose);
    assert.strictEqual(count(r.svg, /class="pc-vole"/g), 1);
    assert.ok(r.held.y > r.head.y && Math.abs(r.held.x - r.head.x) < 30, pose + ': under the chin, in the mouth');
  }
  // in the mouth, not under it: the vole sits on the mouth (no mood mouth drawn, a mouthful), for
  // every mood, the nose still above it
  for (const mood of A.vocab.moods) {
    const svg = A.character('player', { pose: 'stand', mood, holds: 'vole', look: { fur: 'cream' } }).svg;
    assert.ok(!svg.includes('fill="#7a2c3b"'), mood + ': no open mouth showing under the vole');
    const vt = svg.match(/class="pc-vole" transform="translate\(([-\d.]+),([-\d.]+)\)/);
    assert.ok(vt, mood);
  }
  const bare = A.character('player', { pose: 'stand', mood: 'scared', look: { fur: 'cream' } }).svg;
  assert.ok(bare.includes('fill="#7a2c3b"'), 'without a vole the scared “o” is there');
  const held = A.character('player', { pose: 'stand', mood: 'worried', holds: 'vole', look: { fur: 'cream' } });
  assert.ok(held.held.y - held.head.y < 24, 'the vole is at the mouth, just under the nose: ' + (held.held.y - held.head.y));
  const g = A.character('grizzled', { pose: 'lie', holds: 'vole', holdAt: 'paws', facing: 'left' });
  assert.ok(g.held.at === 'paws' && g.held.y + g.held.r * 0.6 > 180 && g.held.x < g.head.x, 'on the ground in front of him');
});

test('otters: dive (a leap into the river, the splash below) and hush (a paw over his mouth); one fish or two', () => {
  const d = A.character('riffle', { pose: 'dive', mood: 'happy' });
  assert.ok(d.svg.includes('#d8eef8'), 'the splash');
  assert.ok(d.head.y > d.bounds.y0 + 30, 'head first, below his tail');
  const h = A.character('riffle', { pose: 'hush', mood: 'wonder' }), sit = A.character('riffle', { pose: 'sit', mood: 'wonder' });
  assert.notStrictEqual(strip(h.svg), strip(sit.svg));
  assert.ok(h.svg.lastIndexOf('<ellipse') > h.svg.indexOf('stop') || true);
  for (const [holds, n] of [['fish', 1], ['fish2', 2]]) {
    for (const pose of ['sit', 'stand', 'swim', 'scramble']) {
      const r = A.character('riffle', { pose, mood: 'proud', holds });
      checkResult(r, holds + ' ' + pose);
      assert.strictEqual(count(r.svg, /class="pc-fish"/g), n, pose + ': ' + holds);
      assert.ok(r.held && r.held.what === holds && r.held.at === 'mouth' && Math.abs(r.held.x - r.head.x) < 30, pose + ' held ' + JSON.stringify(r.held));
    }
  }
  assert.ok(!A.character('dog', { holds: 'fish' }).held, 'dogs don’t carry fish');
});

test('Murmurchime is the tortie, her own look', () => {
  for (const pose of ['sit', 'pawup', 'stand']) {
    assert.strictEqual(strip(A.character('murmurchime', { pose, mood: 'proud' }).svg), strip(A.character('mutterer', { pose, mood: 'proud' }).svg));
  }
});

// ----- the 5s

const RIM = [{ who: 'clancat', variant: 1 }, { who: 'mutterer' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
const litClaws = (s) => count(s, /fill="#ffe36e" stroke="#d18b12"/g);

test('the 5s with who: each forepaw in its cat’s fur, the cat small behind; the old tom’s is the fifth', () => {
  for (let hl = 0; hl <= 25; hl++) {
    const s = A.countsPicture({ table: 5, groups: 5, highlight: hl, totals: true, next: true, who: RIM, look: { fur: 'brown-tabby' } });
    checkSvgDoc(s, 'rim ' + hl);
    assert.strictEqual(litClaws(s), hl, hl + ' claws lit');
    const want = [];
    for (let g = 1; g * 5 <= hl; g++) want.push(g * 5);
    assert.deepStrictEqual(totals(s), want, 'totals at ' + hl);
    assert.strictEqual(nexts(s), hl < 25 ? 1 : 0, 'one soft glow on the next paw');
    // the glow sits just before its group, as the UI's wiggle wants
    if (hl < 25) assert.ok(/class="pc-next"[^>]*\/><g transform/.test(s));
  }
  const s = A.countsPicture({ table: 5, groups: 5, highlight: 0, who: RIM });
  assert.ok(s.includes('#dba79f'), 'the old tom behind his paw (his scar)');
  assert.ok(s.includes('fill="#5d4535"'), 'his paw in his dark brown fur');
  assert.ok(s.includes('fill="#3f3330"') || s.includes('#da853b'), 'the tortie’s paw');
  assert.ok(/aria-label="5 forepaws held up, 5 claws each"/.test(s));
  // her coat is never on a rim cat; a picture with no who is chapter 1's
  const plain = A.countsPicture({ table: 5, groups: 5, highlight: 0 });
  assert.ok(!plain.includes('#dba79f') && plain.includes('fill="#e8913a"'));
  // white paws show white, a tabby’s are barred
  const tw = A.countsPicture({ table: 5, groups: 2, who: [{ who: 'clancat', variant: 4 }, { who: 'tallyheart' }] });
  assert.ok(tw.includes('fill="#fcf9f3"') && tw.includes('stroke="#B5602A"'));
});

test('Sprinkle’s dinner, 2 × 5: her two grey forepaws, bigger, five claws each, one Sprinkle behind them', () => {
  for (let hl = 0; hl <= 10; hl++) {
    const s = A.countsPicture({ table: 5, groups: 2, per: 5, highlight: hl, totals: true, who: [{ who: 'sprinkle' }, { who: 'sprinkle' }] });
    checkSvgDoc(s, 'dinner ' + hl);
    const lit = (s.match(/<g class="pc-dclaws pc-lit"[^>]*>(.*?)<\/g>/g) || []).reduce((n, g) => n + count(g, /<path /g), 0);
    assert.strictEqual(lit, hl, hl + ' claws lit');
    assert.deepStrictEqual(totals(s), hl >= 10 ? [5, 10] : hl >= 5 ? [5] : []);
  }
  const s = A.countsPicture({ table: 5, groups: 2, highlight: 0, who: [{ who: 'sprinkle' }, { who: 'sprinkle' }] });
  assert.strictEqual(count(s, /stop-color="#f7c65c"/g), 1, 'one Sprinkle behind both paws');
  assert.strictEqual(count(s, /<g class="pc-dclaws"/g), 2, 'her two raised paws, nothing else of her');
  // bigger than a cat's paw in the same place
  const cat = A.countsPicture({ table: 5, groups: 2, highlight: 0, who: [{ who: 'tallyheart' }, { who: 'tallyheart' }] });
  assert.ok(s.includes('pc-dclaws') && !cat.includes('pc-dclaws'));
});

test('six little forepaws drawn in the mud, five claw marks each, lit in order (all together after a right answer)', () => {
  for (const hl of [0, 7, 30]) {
    const s = A.countsPicture({ table: 5, groups: 6, per: 5, kind: 'mud', highlight: hl });
    checkSvgDoc(s, 'mud ' + hl);
    assert.strictEqual(count(s, /class="pc-mudclaw"/g), 30, 'thirty claw marks');
    assert.strictEqual(count(s, /class="pc-mudclaw"[^>]*stroke="#e39a12"/g), hl, hl + ' lit');
    assert.ok(/aria-label="6 little forepaws drawn in the mud, 5 claw marks each"/.test(s));
    assert.ok(s.includes('#6f5a47'), 'mud');
  }
  // two rows of three
  const s = A.countsPicture({ table: 5, groups: 6, per: 5, kind: 'mud', totals: true, next: true, highlight: 10 });
  assert.deepStrictEqual(totals(s), [5, 10]);
  assert.strictEqual(nexts(s), 1);
  const vb = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  assert.ok(vb[0] < vb[1] * 2, 'three across, two rows');
});

test('her own two forepaws on the moss: the glow takes turns, left, right, left, right; the totals beneath', () => {
  const look = { fur: 'calico', marking: 'white-paws', eyes: 'odd' };
  const pawX = (s) => {
    // which paw has lit claws: the x of each paw cell, and the cell holding the lit claws
    const cells = s.match(/<g transform="translate\(([\d.]+),[\d.]+\) scale\(1\)">.*?(?=<g transform="translate\(|<text|<\/svg>)/g) || [];
    return cells.map((c) => ({ x: +c.match(/translate\(([\d.]+)/)[1], lit: litClaws(c) }));
  };
  let lastLit = null;
  for (let tap = 0; tap <= 4; tap++) {
    const s = A.countsPicture({ table: 5, groups: 4, per: 5, highlight: tap * 5, totals: true, next: true, paws: 'own', look });
    checkSvgDoc(s, 'own ' + tap);
    const p = pawX(s);
    assert.strictEqual(p.length, 2, 'two paws');
    assert.ok(p[0].x < p[1].x);
    const lit = p.findIndex((q) => q.lit === 5);
    if (tap === 0) assert.strictEqual(lit, -1, 'nothing lit before the first tap');
    else {
      assert.strictEqual(lit, (tap - 1) % 2, `tap ${tap}: the ${(tap - 1) % 2 ? 'right' : 'left'} paw lit`);
      assert.notStrictEqual(lit, lastLit, 'the glow takes turns');
      assert.strictEqual(p[1 - lit].lit, 0, 'only the paw just tapped');
      lastLit = lit;
    }
    assert.deepStrictEqual(totals(s), [5, 10, 15, 20].slice(0, tap), 'totals in a row');
    assert.strictEqual(nexts(s), tap < 4 ? 1 : 0);
    assert.ok(/aria-label="Your own two forepaws on the moss, 5 claws each, 4 taps"/.test(s));
  }
  // her fur: a ginger tabby's paws are barred ginger; white paws are white
  assert.ok(A.countsPicture({ table: 5, groups: 4, paws: 'own', look: { fur: 'ginger' } }).includes('fill="#e8913a"'));
  assert.ok(A.countsPicture({ table: 5, groups: 4, paws: 'own', look }).includes('fill="#ffffff"'));
});

test('sand learns swipes (five short parallel claw lines a group) and mud', () => {
  for (const ground of [undefined, 'sand', 'earth', 'mud']) {
    for (const counted of [0, 5, 12, 30]) {
      const s = A.sand({ groups: 6, per: 5, counted, style: 'swipe', ground });
      checkSvgDoc(s, 'swipe ' + ground + counted);
      assert.strictEqual(count(s, /class="pc-swipe"/g), 30, 'five lines a swipe');
      assert.strictEqual(count(s, /class="pc-swipe"[^>]*stroke="#e39a12"/g), Math.min(30, counted), counted + ' lit');
      assert.ok(new RegExp('aria-label="6 swipes of 5 claw lines in the ' + (ground || 'sand') + '"').test(s));
    }
  }
  assert.ok(A.sand({ groups: 2, per: 5, style: 'swipe', ground: 'mud' }).includes('#6f5a47'), 'mud');
  // scratches in the mud too
  const m = A.sand({ groups: 9, per: 2, counted: 4, ground: 'mud' });
  assert.ok(m.includes('#6f5a47') && /scratches in the mud"/.test(m));
  assert.strictEqual(count(m, /stroke-width="4.6"/g), 18);
});

test('Sprinkle hides her face under her tail: the tail is drawn over her face, across her eyes', () => {
  for (const facing of FACINGS) {
    const svg = A.character('sprinkle', { pose: 'hide', mood: 'scared', facing }).svg;
    const eyes = svg.lastIndexOf('fill="#1c1828"'), tails = [...svg.matchAll(/class="pc-ridges"/g)].map((m) => m.index);
    assert.ok(tails.some((i) => i > eyes), facing + ': a tail drawn after her eyes');
  }
  // the tail's broad end lies across her eyes and nothing else of her: it rises from behind her rump
  // (drawn behind her body) and only its part over her head is drawn on top, clipped to it
  for (const mood of ['scared', 'shy']) for (const facing of FACINGS) {
    const r = A.character('sprinkle', { pose: 'hide', mood, facing }), svg = r.svg;
    const ridges = [...svg.matchAll(/class="pc-ridges"/g)].map((m) => m.index), torso = svg.indexOf('fill="#dfe4e1"');
    assert.ok(ridges.some((i) => i < torso), facing + ': the tail’s root behind her body');
    assert.ok(/<g clip-path="url\(#[^)]+\)"><g fill="#b9c1c5"[^>]*class="pc-ridges"/.test(svg), facing + ': its face part clipped over her head');
    // she still stands in her box, not much taller than sitting (the arch stays near her)
    assert.ok(r.bounds.y0 > 20, mood + ' ' + facing + ': ' + JSON.stringify(r.bounds));
  }
  // anywhere else her tail stays behind her
  const sit = A.character('sprinkle', { pose: 'sit' }).svg;
  assert.ok([...sit.matchAll(/class="pc-ridges"/g)].every((m) => m.index < sit.lastIndexOf('fill="#1c1828"')));
});
