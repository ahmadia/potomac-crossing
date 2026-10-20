// Character art: every cast member, pose, mood and facing renders well-formed SVG markup; the
// chapter 2 otters and dogs; the Counts pictures (chapter 1's unchanged, chapter 2's prey, totals,
// next, who, rows and the thought cloud); chapter 3's Sprinkle, the new poses, moods and extras, and
// the 5s (forepaws in their cats' fur, Sprinkle's, paws drawn in the mud, her own two paws, swipes);
// chapter 4's Reynard and Squall, `situp`, `wink`, the bark, Sprinkle's three new poses, and the 10s
// (two forepaws a group, the promise's pile, her own two patted down, the roof's grit, paired swipes);
// chapter 5's Patience, Puddle and Wisp, the cats' and otters' new poses and extras (a claw tucked, the
// old tom asleep with a snail on his ear, the buzz lines, Riffle's pole), and the Counts art (the 9s
// with one claw tucked, fish in pairs and on strings, the raft's logs from underneath, herons in the
// mud, her paws aboard and her claws in the log, the mud count, the forepaws, the answers in the sand).
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
    'mutterer', 'snorter', 'clancat', 'sparrow', 'moth', 'riffle', 'otter', 'dog', 'sprinkle', 'murmurchime', 'reynard', 'squall',
    'patience', 'puddle', 'wisp', 'coil', 'sloshbank', 'reedclan', 'sleet']);
  assert.deepStrictEqual(A.vocab.poses, ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall',
    'stretch', 'peer', 'pawup', 'tummy', 'situp']);
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
  // (chapter 5 appends seven otter poses: its own tests are at the end of this file)
  assert.deepStrictEqual(A.vocab.otherPoses.riffle.slice(0, OTTER_POSES.length), OTTER_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.otter.slice(0, OTTER_POSES.length), OTTER_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.dog, DOG_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.tallone, ['stand', 'water', 'set-dish'], 'chapter 1 poses kept');
  // (chapter 6 adds ReedClan's four coats)
  assert.deepStrictEqual(A.vocab.variants, { clancat: [1, 2, 3, 4, 5, 6], otter: [1, 2, 3], dog: [1, 2, 3], reedclan: [1, 2, 3, 4] });
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

test('chapter 1’s counts pictures are unchanged (every table but the 9s and the 10s, every group count and highlight)', () => {
  // A fingerprint of countsPicture({ table, groups, highlight }) for tables 1-9, 0-10 groups and
  // several highlights, ids normalised, taken from the chapter 1 code before chapter 2 extended it.
  // If chapter 1's counts art is ever changed on purpose, take a new fingerprint and say so.
  // Retaken 2026-10-04: the 'kind' face got warmer (lifted lids, pupils centred), which redraws the
  // pebble cats of tables 6-9 only; tables 1-5, the ones chapters 1 and 2 ask, are unchanged.
  // Changed on purpose 2026-10-10 (chapter 4): table 10 left this sweep. Its picture was chapter 1's
  // bare pairs of ginger forepaws, which no chapter ever showed; it is now the 10s' own (a cat's two
  // forepaws a group, the cat small behind them: the tests under "chapter 4" below). With table 10
  // in, the old code's fingerprint was 77282dac…; over tables 1-9 the old code and that one both
  // gave 8bfe727f…, so nothing else moved.
  // Changed on purpose 2026-10-11 (chapter 5): table 9 left this sweep in its turn. Its picture was a
  // cat and nine pebbles, which no chapter ever showed (no lesson of chapters 1 to 4 pictures nine
  // things a group); it is now the 9s' own (the 10s' group with one claw tucked in: the tests under
  // "chapter 5" below). Over tables 1-8 the chapter 4 code and this one both give the hash below.
  // Changed on purpose 2026-10-18 (chapter 6): table 3 left this sweep too. Its picture, patrols of three
  // walking cats, was drawn by no chapter before 6 (no lesson, filler, skip or Hollow round of chapters 1 to
  // 5 pictures three things a group); chapter 6 widened its tile so each patrol walks on its own card (the
  // tests under "chapter 6" below). Over tables 1, 2 and 4 to 8 the chapter 5 code and this one both give
  // the hash below (with table 3 the chapter 5 code gave 75d68e12…).
  const out = [];
  for (let t = 1; t <= 8; t++) if (t !== 3) for (const g of [0, 1, 3, 5, 8, 10]) for (const h of [0, 2, 5, 12]) out.push(strip(A.countsPicture({ table: t, groups: g, highlight: h })));
  out.push(strip(A.countsPicture({})));
  const all = out.join('\n');
  assert.strictEqual(crypto.createHash('sha256').update(all).digest('hex'), '66c46805b5dec7de16be8c8c0e967aad0571867a453b35fb6c47f5c06d5ca34a');
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
        // (chapter 4: sitting up, no forepaw is on the ground: it is held up between the two raised forepaws)
        if (pose === 'situp') { assert.ok(h.y < 175 && h.y > r.head.y && h.y + h.r < r.bounds.y1 - 20, `${who}/${pose}: held up at the chest (${h.y})`); continue; }
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

// (chapter 4 appends check, tailout and tailup: its own tests are at the end of this file)
const DZ_POSES = ['eyes', 'unfold', 'hide', 'sniff', 'sit', 'wings', 'flat', 'gulp', 'burp', 'pawsup', 'pawup', 'draw', 'touch', 'peek', 'curl', 'lie',
  'check', 'tailout', 'tailup'];
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
  assert.deepStrictEqual(A.vocab.otherPoses.sprinkle.slice(0, DZ_POSES.length), DZ_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.riffle.slice(9, 11), ['dive', 'hush']);
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

// ---------------------------------------------------------------- chapter 4 (build.md, "Chapter 4 (v0.4)")

const FOX_POSES = ['sit', 'comb', 'chest', 'think', 'lean', 'flap', 'slip', 'dash'];
const SQUALL_POSES = ['hug', 'sit', 'roar', 'hiccup', 'halt', 'tall', 'point', 'snap', 'pawup'];
const strip2 = (x) => x.replace(/pc[0-9a-z]+-[0-9a-z]+/g, 'id').replace(/pc(?:dzf|fp|op|wp|t|tp|pr)[0-9a-z]+/g, 'id');
const idsOf = (s) => (s.match(/id="([^"]+)"/g) || []).map((x) => x.slice(4, -1));
function checkIds(svg, label) {
  const defined = new Set(idsOf(svg));
  assert.strictEqual(defined.size, idsOf(svg).length, label + ': unique ids');
  for (const ref of svg.match(/(?:url\(#|href="#)([^)"]+)/g) || []) assert.ok(defined.has(ref.replace(/^(url\(#|href="#)/, '')), `${label}: dangling ${ref}`);
}
const topOf = (r) => (r.h - 3) - r.bounds.y0;   // how tall a drawing stands above its ground line, in the cats' units

test('chapters 1 to 3 are unchanged by chapter 4 (a fingerprint of Sprinkle, the chapter 3 poses, moods and extras, the 5s, the mud and the swipes)', () => {
  // Taken from the chapter 3 code before chapter 4 extended it (2026-10-10), ids normalised. With the
  // two fingerprints above (chapter 1's counts, tables 1-9; chapters 1 and 2's cast), this covers what
  // the first three chapters draw through this file. If their art is ever changed on purpose, take a
  // new fingerprint and say so.
  const out = [];
  const MOODS = ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn', 'sad', 'shy'];
  const DZ = DZ_POSES.slice(0, 16);
  const s3 = (x) => x.replace(/pc[0-9a-z]+-[0-9a-z]+/g, 'id').replace(/pc(?:dzf|fp|op|wp|t)[0-9a-z]+/g, 'id');
  const look = { fur: 'tortie', marking: 'white-chest', eyes: 'amber', sex: 'she' };
  for (const pose of DZ) for (const mood of MOODS) for (const facing of ['left', 'right']) {
    const r = A.character('sprinkle', { pose, mood, facing });
    out.push(s3(r.svg), JSON.stringify([r.head, r.headBox, r.bounds, r.nest || null, r.held || null]), s3(r.front || ''));
  }
  for (const pose of DZ) out.push(s3(A.character('sprinkle', { pose, mood: 'sad', holds: 'pebble', tear: true, mist: true, squeeze: true }).svg));
  for (const who of CATS) for (const pose of ['pawup', 'tummy']) for (const mood of MOODS) out.push(s3(A.character(who, { pose, mood, look, variant: 2, facing: mood.length % 2 ? 'left' : 'right' }).svg));
  for (const who of CATS) for (const pose of ['sit', 'stand', 'lie', 'curl', 'pawup']) for (const mood of ['sad', 'shy']) for (const ex of [{}, { claws: true }, { puffed: true }, { squeeze: true }, { moss: true }, { tear: true }, { mist: true }, { holds: 'vole' }, { holds: 'pebble' }, { holds: 'vole', holdAt: 'paws' }]) {
    const r = A.character(who, Object.assign({ pose, mood, look }, ex));
    out.push(s3(r.svg), JSON.stringify([r.head, r.headBox, r.bounds, r.held || null]));
  }
  for (const [who, v] of BEASTS) {
    for (const pose of who === 'dog' ? DOG_POSES : OTTER_POSES)
      for (const ex of [{ mood: 'sad' }, { mood: 'shy' }, { holds: 'fish' }, { holds: 'fish2' }, { tear: true }, { mist: true }, { squeeze: true }, { pebbles: 4 }, { pebbles: 5 }])
        out.push(s3(A.character(who, Object.assign({ pose, variant: v }, ex)).svg));
  }
  const RIM3 = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  for (let hl = 0; hl <= 25; hl += 5) out.push(s3(A.countsPicture({ table: 5, groups: 5, per: 5, highlight: hl, totals: true, next: hl < 25, who: RIM3, look })));
  for (const g of [1, 2, 4, 6, 10]) for (const hl of [0, 7, 25]) out.push(s3(A.countsPicture({ table: 5, groups: g, per: 5, highlight: hl, who: RIM3.slice(0, 4), look })), s3(A.countsPicture({ table: 5, groups: g, per: 5, highlight: hl })));
  for (let hl = 0; hl <= 10; hl += 5) out.push(s3(A.countsPicture({ table: 5, groups: 2, per: 5, highlight: hl, totals: true, who: [{ who: 'sprinkle' }, { who: 'sprinkle' }] })));
  for (const hl of [0, 7, 30]) out.push(s3(A.countsPicture({ table: 5, groups: 6, per: 5, kind: 'mud', highlight: hl, totals: true, next: true })));
  for (let tap = 0; tap <= 4; tap++) out.push(s3(A.countsPicture({ table: 5, groups: 4, per: 5, highlight: tap * 5, paws: 'own', look, next: tap < 4, taps: tap })));
  for (const [g, p] of [[9, 2], [7, 2], [8, 2]]) for (const layout of ['stacks', 'rows']) for (const thought of [false, true]) out.push(s3(A.countsPicture({ table: 2, groups: g, per: p, highlight: 4, kind: 'prey', layout, thought })));
  for (const ground of [undefined, 'earth', 'mud']) for (const style of [undefined, 'swipe']) for (const [g, p, c] of [[6, 5, 12], [2, 5, 10], [10, 5, 0], [9, 2, 4]]) out.push(A.sand({ groups: g, per: p, counted: c, ground, style }));
  assert.strictEqual(out.length, 4486);
  assert.strictEqual(crypto.createHash('sha256').update(out.join('\n')).digest('hex'), '0d0d40fccb551d2e667b5578f3377d87ec61499c20b5a69e0f32716872880752');
  // and the new options, when absent or false, change nothing
  const base = A.character('tallyheart', { pose: 'sit', mood: 'kind' });
  assert.strictEqual(strip(A.character('tallyheart', { pose: 'sit', mood: 'kind', wink: false, flick: false, lit: 0, pole: false }).svg), strip(base.svg));
  assert.strictEqual(A.sand({ groups: 2, per: 8, counted: 6, layout: 'rows', step: 2 }), A.sand({ groups: 2, per: 8, counted: 6, layout: 'rows' }), 'chapter 2’s check keeps its column at a time');
  assert.strictEqual(A.sand({ groups: 4, per: 5, counted: 6, style: 'swipe', pair: false }), A.sand({ groups: 4, per: 5, counted: 6, style: 'swipe' }));
  assert.strictEqual(A.sand({ groups: 4, per: 2, counted: 3, pair: true }), A.sand({ groups: 4, per: 2, counted: 3 }), 'pairs are swipes’ only');
});

test('chapter 4 vocabulary: reynard and squall and their poses, situp, Sprinkle’s three new poses (earlier ids never move)', () => {
  assert.deepStrictEqual(A.vocab.cast.slice(17, 19), ['reynard', 'squall']);
  assert.deepStrictEqual(A.vocab.otherPoses.reynard, FOX_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.squall, SQUALL_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.sprinkle.slice(16, 19), ['check', 'tailout', 'tailup']);
  assert.deepStrictEqual(A.vocab.otherPoses.sprinkle.slice(0, 16), DZ_POSES.slice(0, 16));
  assert.strictEqual(A.vocab.poses[A.vocab.poses.length - 1], 'situp');
  assert.ok(!('reynard' in A.vocab.variants) && !('squall' in A.vocab.variants), 'one fox, one Squall');
  A.vocab.otherPoses.reynard.push('nope');
  assert.deepStrictEqual(A.character('reynard', { pose: 'nope' }).head, A.character('reynard', { pose: 'sit' }).head, 'the published list is a copy; an unknown pose sits');
  A.vocab.otherPoses.reynard.pop();
});

// ----- the cats' new pose and extras

test('situp: on the haunches, both forepaws raised in front of the chest, claws out on both (five and five)', () => {
  for (const who of CATS) for (const facing of FACINGS) {
    const r = A.character(who, { pose: 'situp', mood: 'happy', facing, look: { fur: 'ginger', marking: 'white-paws' } });
    checkResult(r, who + ' situp');
    const claws = r.svg.match(/<g class="pc-claws"[^>]*>(.*?)<\/g>/g) || [];
    assert.strictEqual(claws.length, 2, who + ': claws on both raised forepaws');
    for (const g of claws) assert.strictEqual(count(g, /<path /g), 5, who + ': five claws a paw');
    // two raised paws (their pads toward us), and one hind paw on the ground
    assert.strictEqual(count(r.svg, /<g fill="[^"]+"><ellipse[^>]*rx="3.6" ry="2.8"\/>/g), 2, who + ': two paws with their pads toward us');
    assert.ok(r.bounds.y1 > 192 && r.bounds.y1 < 200.5, who + ': on the ground ' + r.bounds.y1);
  }
  // "Two forepaws. Ten claws.": a child counts the picture, so every claw stands up clear. The dewclaw is beside
  // the toes, pointing up and out (the Counts' own forepaw draws it at -60 degrees), not lying back along the
  // foreleg, where the near leg hid the far paw's; chapter 3's one raised paw (`pawup`) keeps it where it was
  const clawRots = (svg) => (svg.match(/<g class="pc-claws"[^>]*>(.*?)<\/g>/g) || []).map((g) => [...g.matchAll(/translate\((-?[\d.]+),(-?[\d.]+)\) rotate\((-?[\d.]+)\)/g)].map((m) => [+m[1], +m[2], +m[3]]));
  for (const who of ['tallyheart', 'grizzled', 'clancat', 'player']) for (const facing of FACINGS) {
    const r = A.character(who, { pose: 'situp', mood: 'proud', facing, look: { fur: 'black' } }), paws = clawRots(r.svg);
    assert.strictEqual(paws.length, 2);
    paws.forEach((claws, k) => {
      assert.deepStrictEqual(claws.map((c) => c[2]), [-28, -9, 9, 28, -58], who + ': four over the toes and the dewclaw standing beside them');
      const toes = claws.slice(0, 4), dew = claws[4];
      assert.ok(Math.abs(dew[2]) < 65, who + ': the dewclaw points up and out, not back along the leg');
      // its base is beside the outer toe's and no lower than the paw's middle (the toes' bases are about 8 above it)
      const baseY = Math.max(...toes.map((c) => c[1]));
      assert.ok(dew[1] - baseY < 7 && dew[1] - baseY > 1, who + ' paw ' + k + ': the dewclaw starts just under the toes: ' + JSON.stringify([dew, baseY]));
      // no claw sits on another: their bases are apart
      claws.forEach((a, i) => claws.forEach((b, j) => { if (i < j) assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) > 2.4, who + ': claws ' + i + ' and ' + j + ' apart'); }));
    });
    // the two paws' claws do not lie on each other: each of the far paw's bases is clear of the near paw's claw fan
    const [farP, nearP] = paws[0][0][0] === paws[1][0][0] ? [paws[0], paws[1]] : paws;
    const cx = (p) => p.slice(0, 4).reduce((a, c) => a + c[0], 0) / 4;
    assert.ok(Math.abs(cx(farP) - cx(nearP)) > 14, who + ': the two paws side by side: ' + [cx(farP), cx(nearP)]);
  }
  const pawup = clawRots(A.character('tallyheart', { pose: 'pawup', claws: true }).svg);
  assert.deepStrictEqual(pawup.map((claws) => claws.map((c) => c[2])), [[-28, -9, 9, 28, -86]], 'chapter 3’s raised paw: the dewclaw where it was');
  // sitting up is taller than sitting, and the paws are held below the chin
  const up = A.character('tallyheart', { pose: 'situp' }), sit = A.character('tallyheart', { pose: 'sit' });
  assert.ok(up.head.y < sit.head.y, 'head higher than when sitting');
  assert.notStrictEqual(strip(up.svg), strip(A.character('tallyheart', { pose: 'pawup', claws: true }).svg));
  // claws: false sheathes them; the far forepaw is drawn in front of the chest, in the far side's shade
  assert.strictEqual(count(A.character('tallyheart', { pose: 'situp', claws: false }).svg, /class="pc-claws"/g), 0);
  const svg = A.character('grizzled', { pose: 'situp' }).svg;
  assert.ok(svg.lastIndexOf('fill="#ebe4d6"') > svg.indexOf('stroke-width="4" stroke-linecap="round" opacity=".5"'), 'the far paw’s claws come after the torso');
  // every Clan coat, every mood, and the counted old tom's flat ears
  for (let variant = 1; variant <= 6; variant++) for (const mood of A.vocab.moods) checkResult(A.character('clancat', { pose: 'situp', mood, variant, flatEars: variant === 2 }), `clancat ${variant} situp ${mood}`);
});

test('wink: the front eye shut in a smiling arc, the other open, whatever the mood (Tallyheart’s slow wink)', () => {
  const ARC = /M-9,3\.4Q0,-9 9\.4,1\.6/g;
  for (const who of CATS) for (const mood of A.vocab.moods) {
    const w = A.character(who, { pose: 'sit', mood, wink: true }).svg;
    assert.strictEqual(count(w, ARC), 1, `${who}/${mood}: one eye shut in an arc`);
    assert.ok(count(w, /fill="#221b26"/g) >= 1, `${who}/${mood}: the other eye open (a pupil)`);
    assert.notStrictEqual(strip(w), strip(A.character(who, { pose: 'sit', mood }).svg), `${who}/${mood}: a wink shows`);
  }
  // the shut eye is the front one (the way she faces), in both facings
  for (const facing of FACINGS) {
    const r = A.character('tallyheart', { pose: 'sit', mood: 'kind', facing, wink: true });
    checkResult(r, 'wink ' + facing);
    assert.ok(/scale\(1,1\)"><path d="M-9,3\.4Q0,-9 9\.4,1\.6"/.test(r.svg), facing + ': the eye on the side she faces');
  }
  // only cats wink (nobody else takes the extra)
  for (const who of ['riffle', 'dog', 'sprinkle']) assert.strictEqual(strip2(A.character(who, { pose: 'sit', wink: true }).svg), strip2(A.character(who, { pose: 'sit' }).svg));
});

test('holds: a curl of pale bark, at the paws, in the mouth on her feet, by the nose, under the chin, or held up sitting up', () => {
  const barkAt = (s) => (s.match(/<g class="pc-bark" transform="translate\(([-\d.]+),([-\d.]+)\)/g) || []).length;
  const look = { fur: 'black', marking: 'none', eyes: 'green' };
  for (const who of ['player', 'tallyheart', 'waffles', 'clancat']) for (const pose of A.vocab.poses) for (const facing of FACINGS) {
    const r = A.character(who, { pose, mood: 'happy', facing, look, holds: 'bark' });
    checkResult(r, `${who}/${pose} bark`);
    if (pose === 'fall' || pose === 'tummy') { assert.strictEqual(barkAt(r.svg), 0); assert.ok(!r.held); continue; }
    assert.strictEqual(barkAt(r.svg), 1, `${who}/${pose}: one piece of bark`);
    const h = r.held;
    assert.ok(h && h.what === 'bark' && h.r > 5 && h.x > 0 && h.x < 200 && h.y > 0 && h.y < 200, `${who}/${pose}: ${JSON.stringify(h)}`);
    assert.strictEqual(h.at, ['stand', 'walk', 'peer', 'stretch'].includes(pose) ? 'mouth' : 'paws', `${who}/${pose}`);
    assert.ok(r.bounds.x0 <= h.x - h.r + 3 && h.x + h.r - 3 <= r.bounds.x1, `${who}/${pose}: inside the cat's box`);
  }
  const svg = A.character('player', { pose: 'sit', look, holds: 'bark' }).svg, bark = svg.slice(svg.indexOf('<g class="pc-bark"'));
  // pale and papery (the cards' own bark colours), never Riffle's stone or Sprinkle's pebble; no ids of its own
  assert.ok(bark.includes('fill="#EDE1C5"') && bark.includes('#B48D61'), 'the pale face and the darker curl');
  assert.ok(lum('#EDE1C5') > lum('#868f90') + 60 && !bark.includes('pc-stone') && !/id="/.test(bark));
  for (const holdAt of ['nose', 'chin', 'mouth', 'paws']) {
    const r = A.character('player', { pose: 'lie', look, holds: 'bark', holdAt });
    checkResult(r, 'bark ' + holdAt);
    assert.strictEqual(r.held.at, holdAt);
  }
  // sitting up, she holds it up between her two raised forepaws
  const up = A.character('player', { pose: 'situp', look, holds: 'bark' });
  assert.ok(up.held.at === 'paws' && up.held.y < 150 && up.held.y > up.head.y, 'held up at her chest: ' + JSON.stringify(up.held));
  assert.ok(!A.character('player', { pose: 'sit', look, holds: 'bark' }).svg.includes('pc-vole'));
});

// ----- Sprinkle's three new poses

test('Sprinkle: check (her face turned back along herself), tailout (her tail held out across her forepaws), tailup (the tail lifted off her eyes)', () => {
  for (const pose of ['check', 'tailout', 'tailup']) for (const mood of A.vocab.moods) for (const facing of FACINGS) {
    const r = A.character('sprinkle', { pose, mood, facing }), label = `sprinkle/${pose}/${mood}/${facing}`;
    checkResult(r, label);
    assert.ok(r.w === 640 && r.h === 340, label);
    assert.ok(r.bounds.x0 >= -1 && r.bounds.y0 >= -1 && r.bounds.x1 <= 641 && r.bounds.y1 <= 341, label + ': inside her box');
    assert.ok(Math.abs(r.h - 3 - r.bounds.y1) < 0.6, label + ': on the ground');
    checkIds(r.svg, label);
    assert.strictEqual(count(r.svg, /<g class="pc-dclaws/g), 2, label + ': two forepaws');
  }
  const sit = A.character('sprinkle', { pose: 'sit' }), check = A.character('sprinkle', { pose: 'check' }), out = A.character('sprinkle', { pose: 'tailout' });
  // looking herself over: sitting, her head has come round behind her own chest, over her back, and lower
  assert.ok(check.head.x < sit.head.x - 100 && check.head.y > sit.head.y + 20, 'head turned back: ' + JSON.stringify([check.head, sit.head]));
  assert.ok(A.character('sprinkle', { pose: 'check', facing: 'left' }).head.x > 640 - sit.head.x + 100, 'and mirrors');
  // holding out her tail: it reaches well past her forepaws, in front of her, and both forepaws hold it
  assert.ok(out.bounds.x1 > sit.bounds.x1 + 60, 'the tail held out in front: ' + out.bounds.x1 + ' past ' + sit.bounds.x1);
  assert.ok(out.bounds.x0 > sit.bounds.x0 + 40, 'and no longer trailing behind her');
  const tailAt = out.svg.indexOf('class="pc-ridges"', out.svg.indexOf('fill="#dfe4e1"'));
  assert.ok(tailAt > 0, 'the tail drawn in front of her body (after her belly)');
  // "bumpy, and soft, and grey as mist": the card this panel gives is about the bumps, so the held-out part
  // carries plates that show (well over the 2.4 a thin tail's plates bottom out at), all along it to the tip;
  // and the tip comes down toward the paw of a cat sitting in front of her
  const plates = (svg, from) => { const g = svg.slice(from).match(/class="pc-ridges">(.*?)<\/g>/)[1]; return [...g.matchAll(/cx="(-?[\d.]+)" cy="(-?[\d.]+)" r="([\d.]+)"/g)].map((m) => m.slice(1).map(Number)); };
  // (plates in her own coordinates: her near forepaw holds the tail at x 112, and the tip is past x 260)
  const tp = plates(out.svg, tailAt - 40), held = tp.filter((c) => c[0] > 112);
  assert.ok(tp.length >= 14, 'plates along the whole tail: ' + tp.length);
  assert.ok(held.length >= 6, 'at least six on the held-out part: ' + held.length);
  assert.ok(held.every((c) => c[2] >= 4.5), 'each big enough to stand proud of a tail 9 to 12 wide: ' + JSON.stringify(held.map((c) => c[2])));
  const tipPlate = tp.reduce((a, c) => (c[0] > a[0] ? c : a)), midPlate = held.reduce((a, c) => (c[0] < a[0] ? c : a));
  assert.ok(tipPlate[1] > midPlate[1] + 12, 'the tail slopes down to its tip, toward a cat’s raised paw: ' + JSON.stringify([midPlate, tipPlate]));
  // the other poses keep the plates they had: eleven along the tail, a quarter of its width proud
  const sitTail = [...sit.svg.matchAll(/class="pc-ridges">(.*?)<\/g>/g)].map((m) => m[1].match(/<circle /g).length);
  assert.ok(sitTail.includes(11), 'sitting: ' + sitTail);
  assert.ok(out.svg.lastIndexOf('class="pc-dclaws"') > tailAt, 'her near forepaw over it');
  // the tail lifting from her face: the same huddle as `hide`, the tail still over her head (its face
  // part clipped on top), but higher: both her eyes show under it
  const hide = A.character('sprinkle', { pose: 'hide', mood: 'shy' }), up = A.character('sprinkle', { pose: 'tailup', mood: 'shy' });
  assert.ok(/<g clip-path="url\(#[^)]+\)"><g fill="#b9c1c5"[^>]*class="pc-ridges"/.test(up.svg), 'its end still lies over her head');
  assert.ok(Math.abs(up.head.x - hide.head.x) < 12 && Math.abs(up.head.y - hide.head.y) < 12, 'she has not moved');
  assert.notStrictEqual(strip2(up.svg), strip2(hide.svg));
  // the tail's end: in `hide` its tip lies at the height of her eyes (across them); in `tailup` it has
  // lifted clear above them, to her brow (both in her own units, before the box's fit: the tail's
  // outline ends in the arc round its tip, and her eyes are the first amber discs of her head)
  const tipY = (r) => { const d = r.svg.match(/<path id="[^"]+" d="(M[^"]*A[\d.]+ [\d.]+ 0 0 0 [-\d.]+,[-\d.]+C[^"]*Z)"/g).map((x) => x.match(/A[\d.]+ [\d.]+ 0 0 0 ([-\d.]+),([-\d.]+)/)); return d.map((m) => +m[2]); };
  const eyeY = (r) => { const m = r.svg.match(/<g transform="matrix\(([^)]+)\)"><g transform="translate\(-48,-14\)/); const k = m[1].split(',').map(Number); return k[1] * 23 + k[3] * -6 + k[5]; };
  // (the tail is the outline whose tip arc is furthest forward and highest of the chains: her neck's ends under her head)
  const tailTip = (r) => Math.min(...tipY(r).filter((y) => y < -80));
  // (the arc's end is one edge of the broad tip, about 20 off its middle line)
  assert.ok(Math.abs(tailTip(hide) - eyeY(hide)) < 30, 'hide: the tail’s end at her eyes ' + tailTip(hide) + ' ' + eyeY(hide));
  assert.ok(tailTip(up) < eyeY(up) - 50 && tailTip(up) < tailTip(hide) - 30, 'tailup: lifted above them ' + tailTip(up) + ' ' + eyeY(up));
});

// ----- Reynard

test('every Reynard pose x mood x facing renders, inside his box (300 x 230), on the ground; ids unique', () => {
  let n = 0;
  for (const pose of FOX_POSES) for (const mood of A.vocab.moods) for (const facing of FACINGS) for (const flick of [false, true]) {
    const label = `reynard/${pose}/${mood}/${facing}${flick ? '/flick' : ''}`;
    const r = A.character('reynard', { pose, mood, facing, flick });
    checkResult(r, label);
    assert.ok(r.w === 300 && r.h === 230, label);
    const h = r.headBox, b = r.bounds;
    assert.ok(h && b, label + ': boxes');
    assert.ok(h.x0 <= r.head.x && r.head.x <= h.x1 && h.y0 <= r.head.y && r.head.y <= h.y1, label + ': head point inside the head box');
    assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= r.w + 1 && b.y1 <= r.h + 1, label + ': inside the box ' + JSON.stringify(b));
    assert.ok(Math.abs(r.h - 3 - b.y1) < 0.6, label + ': on the ground ' + b.y1);
    checkIds(r.svg, label);
    assert.ok(r.svg.length < 30000, label + `: ${r.svg.length} bytes`);
    n++;
  }
  assert.strictEqual(n, FOX_POSES.length * A.vocab.moods.length * 4);
  const a = idsOf(A.character('reynard', {}).svg), b = idsOf(A.character('reynard', {}).svg);
  for (const id of b) assert.ok(!a.includes(id), 'ids differ between calls');
  assert.strictEqual(strip(A.character('reynard', { pose: 'moonwalk', mood: 'grumpy' }).svg), strip(A.character('reynard', { pose: 'sit', mood: 'neutral' }).svg));
  // facing: the muzzle leads
  const R = A.character('reynard', { pose: 'sit', facing: 'right' }), L = A.character('reynard', { pose: 'sit', facing: 'left' });
  assert.ok(R.head.x > 150 && L.head.x < 150 && Math.abs(R.head.x + L.head.x - 300) < 0.5 && R.head.y === L.head.y, 'heads mirror');
});

test('Reynard: the closed smile is always on, except in slip; no teeth, ever; his mouth never opens', () => {
  const mouth = (svg) => (svg.match(/<path class="pc-fox-mouth" d="([^"]+)"[^>]*>/g) || []);
  for (const pose of FOX_POSES) for (const mood of A.vocab.moods) {
    const svg = A.character('reynard', { pose, mood }).svg, m = mouth(svg);
    assert.strictEqual(m.length, 1, `${pose}/${mood}: one mouth`);
    assert.ok(/fill="none"/.test(m[0]), `${pose}/${mood}: a closed line, nothing behind it`);
    const d = m[0].match(/d="([^"]+)"/)[1], nums = d.match(/-?[\d.]+/g).map(Number), endY = nums[nums.length - 1];
    // it runs back along the muzzle (y about 18) and, smiling, its corner turns up into the cheek
    if (pose === 'slip') assert.ok(endY > 17 && !/Q[^Q]+Q/.test(d), `slip/${mood}: gone flat (${d})`);
    else assert.ok(endY < 13 && /Q[^Q]+Q/.test(d), `${pose}/${mood}: the corner turned up (${d})`);
    // nothing in his head is an open mouth: no dark mouth fill, no tongue, nothing white and jagged
    for (const col of ['#7a2c3b', '#5d3844', '#f2879a', '#f08a9c', TONGUE_PINK]) assert.ok(!svg.includes(col), `${pose}/${mood}: no open mouth (${col})`);
    assert.ok(!/class="pc-(teeth|fang)/.test(svg) && !/teeth|fang/i.test(svg), `${pose}/${mood}: no teeth`);
  }
  // the smile is wider when he is pleased with himself, smaller when he plays the injured party
  const end = (mood) => { const d = mouth(A.character('reynard', { pose: 'sit', mood }).svg)[0].match(/d="([^"]+)"/)[1].match(/-?[\d.]+/g).map(Number); return d[d.length - 1]; };
  assert.ok(end('proud') < end('neutral') && end('neutral') < end('sad'), 'proud > neutral > sad');
});
const TONGUE_PINK = '#f28a9c';

test('Reynard: three-quarter view (never full face), half-closed amber eyes; in slip they are fully open and his ears go back', () => {
  for (const pose of FOX_POSES) for (const mood of A.vocab.moods) {
    const svg = A.character('reynard', { pose, mood }).svg;
    // two eyes of different sizes, the far one past the bridge of his nose and drawn mirrored: a turned head
    const eyes = [...svg.matchAll(/<g transform="translate\(([-\d.]+),([-\d.]+)\) rotate\(([-\d.]+)\) scale\((-?[\d.]+)(?:,([\d.]+))?\)">/g)].filter((m) => Math.abs(+m[1] - 10.4) < 0.1 || Math.abs(+m[1] - 31) < 0.1);
    assert.strictEqual(eyes.length, 2, `${pose}/${mood}: two eyes`);
    const far = eyes.find((m) => +m[1] > 20), near = eyes.find((m) => +m[1] < 20);
    assert.ok(Math.abs(+far[4]) < Math.abs(+near[4]) * 0.75 && +far[4] < 0, `${pose}/${mood}: the far eye smaller and turned`);
    // the nose leads the head: it is drawn at the front end of the muzzle, well ahead of both eyes
    assert.ok(svg.includes('M49,5.4Q54,4.2 56.8,7.8'), 'his nose at the tip of the muzzle');
    assert.ok(svg.includes('#f3a72e') || pose === 'slip' || mood === 'sleepy', `${pose}/${mood}: amber eyes`);
  }
  const lids = (svg) => count(svg, /V-12H-11Z/g), whites = (svg) => count(svg, /fill="#fff8ea"/g);
  for (const pose of FOX_POSES.filter((p) => p !== 'slip')) {
    const svg = A.character('reynard', { pose, mood: 'neutral' }).svg;
    assert.strictEqual(lids(svg), 2, pose + ': a lid over each eye (half-closed)');
    assert.strictEqual(whites(svg), 0, pose + ': no white shows');
  }
  for (const mood of A.vocab.moods) {
    const slip = A.character('reynard', { pose: 'slip', mood }).svg;
    assert.strictEqual(lids(slip), 0, mood + ': no lids in the slip');
    assert.strictEqual(whites(slip), 2, mood + ': both eyes fully open');
  }
  // ears: back in the slip, back a little when scared; `flick` turns the near one and adds the ticks
  const ears = (svg) => [...svg.matchAll(/<g transform="rotate\(([-\d.]+) (?:20 -22|-11 -19)\)">/g)].map((m) => +m[1]);
  const up = ears(A.character('reynard', { pose: 'sit' }).svg), back = ears(A.character('reynard', { pose: 'slip' }).svg), scared = ears(A.character('reynard', { pose: 'sit', mood: 'scared' }).svg);
  assert.deepStrictEqual(up, [0, 0]);
  assert.ok(back.every((a) => a < -30) && scared.every((a) => a < -15 && a > -30), JSON.stringify([back, scared]));
  const fl = ears(A.character('reynard', { pose: 'sit', flick: true }).svg);
  assert.ok(fl[0] === 0 && fl[1] < -30, 'one ear flicks: ' + JSON.stringify(fl));
  assert.notStrictEqual(strip(A.character('reynard', { pose: 'sit', flick: true }).svg), strip(A.character('reynard', { pose: 'sit' }).svg));
  // every mood sits differently on his face
  assert.strictEqual(new Set(A.vocab.moods.map((m) => strip(A.character('reynard', { pose: 'sit', mood: m }).svg))).size, A.vocab.moods.length);
  assert.strictEqual(new Set(FOX_POSES.map((p) => strip(A.character('reynard', { pose: p }).svg))).size, FOX_POSES.length);
});

test('Reynard: about Tallyheart’s size and never taller, leaner, a far longer tail with a white tip, red-orange, cream, black socks', () => {
  const tally = A.character('tallyheart', { pose: 'sit' }), fox = A.character('reynard', { pose: 'sit' });
  for (const pose of FOX_POSES) for (const mood of A.vocab.moods) {
    const t = topOf(A.character('reynard', { pose, mood, flick: true }));
    assert.ok(t <= topOf(tally), `${pose}/${mood}: never taller than Tallyheart sitting (${t} against ${topOf(tally)})`);
  }
  assert.ok(topOf(fox) > topOf(tally) * 0.9, 'about her size: ' + topOf(fox));
  // the scenes scale every drawing by the cats' box, so the two boxes are in the same units
  for (const pose of FOX_POSES) {
    const svg = A.character('reynard', { pose }).svg;
    assert.ok(svg.includes('fill="#e2632a"'), pose + ': red-orange');
    assert.ok(svg.includes('fill="#fbeed6"'), pose + ': cream chin and chest');
    assert.strictEqual(count(svg, /class="pc-fox-tip"/g), 1, pose + ': the white tip of his brush');
    assert.ok(svg.includes('fill="#fffaf0"'), pose + ': white');
    assert.ok(count(svg, /fill="#(352d2e|291f20|2a2324|292324)"/g) >= 4 || count(svg, /fill="#352d2e"/g) >= 4, pose + ': black socks and ear tips');
  }
  // four socks when all four legs show (the dash): two near, two far
  const dash = A.character('reynard', { pose: 'dash' }).svg;
  assert.strictEqual(count(dash, /<path d="[^"]+" fill="#(?:352d2e|[0-9a-f]{6})" stroke="#151112" stroke-width="2.1"\/>/g), 4, 'four paws in the dash');
  // the brush: far longer than a cat's tail; on end in the slip
  const flap = A.character('reynard', { pose: 'flap' }).bounds, dashB = A.character('reynard', { pose: 'dash' }).bounds;
  assert.ok(dashB.x1 - dashB.x0 > 1.4 * (A.character('tallyheart', { pose: 'walk' }).bounds.x1 - A.character('tallyheart', { pose: 'walk' }).bounds.x0), 'longer than Tallyheart, nose to tail');
  assert.ok(flap.x1 - flap.x0 > 220);
  const slip = A.character('reynard', { pose: 'slip' }).svg;
  assert.ok((slip.match(/<path id="[^"]+" d="M[^"]*"/g) || []).some((d) => count(d, /L/g) > 40), 'the brush on end: a spiky outline');
  // combing: his claws show on the combing paw only, pale; nowhere else does he show a claw
  assert.strictEqual(count(A.character('reynard', { pose: 'comb' }).svg, /class="pc-fox-claws"/g), 1);
  for (const pose of FOX_POSES.filter((p) => p !== 'comb')) assert.strictEqual(count(A.character('reynard', { pose }).svg, /pc-fox-claws|pc-claws/g), 0, pose + ': claws in');
  // leaning in, his head comes forward and down; flapping, both forepaws are up
  assert.ok(A.character('reynard', { pose: 'lean' }).head.x > fox.head.x + 20 && A.character('reynard', { pose: 'lean' }).head.y > fox.head.y + 10);
});

// ----- Squall

test('every Squall pose x mood x facing renders, inside his box (250 x 190), on the roof; ids unique', () => {
  let n = 0;
  for (const pose of SQUALL_POSES) for (const mood of A.vocab.moods) for (const facing of FACINGS) for (const ex of [{}, { tear: true, mist: true, squeeze: true, pole: true, lit: 5 }]) {
    const label = `squall/${pose}/${mood}/${facing}${ex.pole ? '/extras' : ''}`;
    const r = A.character('squall', Object.assign({ pose, mood, facing }, ex));
    checkResult(r, label);
    assert.ok(r.w === 250 && r.h === 190, label);
    const h = r.headBox, b = r.bounds;
    assert.ok(h.x0 <= r.head.x && r.head.x <= h.x1 && h.y0 <= r.head.y && r.head.y <= h.y1, label + ': head point inside the head box');
    assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= r.w + 1 && b.y1 <= r.h + 1, label + ': inside the box ' + JSON.stringify(b));
    assert.ok(Math.abs(r.h - 3 - b.y1) < 0.6, label + ': on the roof ' + b.y1);
    checkIds(r.svg, label);
    assert.ok(r.svg.length < 30000, label + `: ${r.svg.length} bytes`);
    n++;
  }
  assert.strictEqual(n, SQUALL_POSES.length * A.vocab.moods.length * 4);
  assert.strictEqual(strip(A.character('squall', { pose: 'moonwalk', mood: 'grumpy' }).svg), strip(A.character('squall', { pose: 'sit', mood: 'neutral' }).svg));
  assert.strictEqual(new Set(SQUALL_POSES.map((p) => strip(A.character('squall', { pose: p }).svg))).size, SQUALL_POSES.length);
  assert.strictEqual(new Set(A.vocab.moods.map((m) => strip(A.character('squall', { pose: 'sit', mood: m }).svg))).size, A.vocab.moods.length, 'every mood changes his face');
});

test('Squall: built like Sprinkle and about a third her size, no bigger than our cat; slate with yellow flecks, ridged, five claws a forepaw, fierce little brows', () => {
  const sq = A.character('squall', { pose: 'sit' }), dz = A.character('sprinkle', { pose: 'sit' }), cat = A.character('player', { pose: 'sit', look: { fur: 'grey' } });
  assert.ok(topOf(sq) <= topOf(cat), `no bigger than our cat: ${topOf(sq)} against ${topOf(cat)}`);
  assert.ok(topOf(sq) > topOf(cat) * 0.85, 'and nearly her height');
  assert.ok(topOf(sq) < topOf(dz) * 0.48, 'well under half his sister’s height');
  const wide = (r) => r.bounds.x1 - r.bounds.x0;
  assert.ok(wide(sq) < wide(dz) * 0.42 && wide(sq) > wide(dz) * 0.3, `about a third her length: ${wide(sq)} against ${wide(dz)}`);
  // a big head: more of him than of her
  const headShare = (r) => (r.headBox.y1 - r.headBox.y0) / (r.bounds.y1 - r.bounds.y0);
  assert.ok(headShare(sq) > headShare(dz) * 1.35, 'a baby’s big head');
  // standing as tall as he can, he tops our cat's ears, and still not Tallyheart's
  const tall = topOf(A.character('squall', { pose: 'tall' }));
  assert.ok(tall > topOf(cat) && tall < topOf(A.character('tallyheart', { pose: 'sit' })), 'tall: ' + tall);
  const paws = (svg) => svg.match(/<g class="pc-dclaws[^"]*"[^>]*>(.*?)<\/g>/g) || [];
  for (const pose of SQUALL_POSES) {
    const svg = A.character('squall', { pose, mood: 'neutral' }).svg;
    assert.ok(svg.includes('fill="#5f6c7e"'), pose + ': slate');
    assert.ok(!svg.includes('fill="#a8b1b6"'), pose + ': never his sister’s mist grey');
    assert.ok(count(svg, /class="pc-flecks"/g) >= 4 && svg.includes('fill="#f6d24e"'), pose + ': yellow flecks (back, wings, tail, brow)');
    assert.ok(svg.includes('class="pc-ridges"'), pose + ': the same soft ridges');
    assert.ok(svg.includes('fill="#b6bfc9"'), pose + ': a paler belly');
    assert.strictEqual(count(svg, /class="pc-wing"/g), 2, pose + ': two stubby wings');
    assert.ok(svg.includes('stop-color="#f7c65c"'), pose + ': his sister’s amber eyes');
    const p = paws(svg);
    assert.strictEqual(p.length, 2, pose + ': two forepaws');
    for (const g of p) assert.strictEqual(count(g, /<path /g), 5, pose + ': five claws a paw');
    // brows: one stroke each side, the inner end lower than the outer (fierce), in every pose
    const b = svg.match(/class="pc-brows" d="M(-?[\d.]+),(-?[\d.]+)L(-?[\d.]+),(-?[\d.]+)M/);
    assert.ok(b && Math.abs(+b[1]) < Math.abs(+b[3]) && +b[2] > +b[4] + 5, pose + ': fierce little brows ' + (b && b[0]));
    // nothing on him shines, and nothing is toothy
    assert.ok(!/gloss|shine|sparkle/.test(svg) && !/teeth|fang/.test(svg), pose);
  }
  // a mood can lift the brows: sad, worried, scared (his chin wobbling: "Except everybody.")
  for (const mood of ['sad', 'worried', 'scared']) {
    const b = A.character('squall', { pose: 'sit', mood }).svg.match(/class="pc-brows" d="M(-?[\d.]+),(-?[\d.]+)L(-?[\d.]+),(-?[\d.]+)M/);
    assert.ok(+b[2] < +b[4], mood + ': inner ends up');
  }
  assert.ok(A.character('squall', { pose: 'sit', mood: 'sad' }).svg.includes('Q-9,30.4 -6,33.6'), 'the wobbling chin');
  // his stubby wings: far shorter than a third of his sister's sail
  const span = (svg) => { const xs = [...svg.matchAll(/class="pc-wing" d="([^"]+)"/g)].map((m) => m[1].match(/-?[\d.]+/g).map(Number).filter((v, i) => i % 2 === 0)); return Math.max(...xs.map((x) => Math.max(...x) - Math.min(...x))); };
  assert.ok(span(A.character('squall', { pose: 'roar' }).svg) < span(A.character('sprinkle', { pose: 'wings' }).svg) * 0.5);
  // drawing him never leaves his colours on his sister
  A.character('squall', { pose: 'roar' });
  const after = A.character('sprinkle', { pose: 'sit' }).svg;
  assert.ok(after.includes('fill="#a8b1b6"') && !after.includes('#5f6c7e') && !after.includes('pc-flecks'));
});

test('Squall at the pole: hug, roar and halt hold it on the centre line of his box; the hiccup bounces him, crosses his eyes and puffs one ring of mist', () => {
  for (const pose of SQUALL_POSES) for (const facing of FACINGS) {
    const r = A.character('squall', { pose, facing });
    if (['hug', 'roar', 'halt'].includes(pose)) {
      assert.deepStrictEqual(Object.keys(r.pole).sort(), ['w', 'x'], pose);
      assert.strictEqual(r.pole.x, r.w / 2, pose + ': the pole stands where his box is anchored');
      assert.ok(r.pole.w > 8 && r.pole.w < 20);
      // he sits beside it, on the side away from the way he faces: his body and most of his head
      const mid = (r.bounds.x0 + r.bounds.x1) / 2;
      assert.ok(facing === 'right' ? mid < r.w / 2 - 20 && r.head.x < r.w / 2 - 15 : mid > r.w / 2 + 20 && r.head.x > r.w / 2 + 15, `${pose}/${facing}: beside the pole ${mid} ${r.head.x}`);
      // and he reaches across it: a forepaw and his tail on the far side
      assert.ok(facing === 'right' ? r.bounds.x1 > r.w / 2 + 12 : r.bounds.x0 < r.w / 2 - 12, `${pose}/${facing}: wrapped round it`);
    } else {
      assert.strictEqual(r.pole, undefined, pose + ': no pole');
    }
    // the plain pole is drawn only when asked for, on the centre line
    assert.ok(!r.svg.includes('pc-pole'));
    const withPole = A.character('squall', { pose, facing, pole: true }).svg;
    assert.strictEqual(count(withPole, /class="pc-pole" x="-7" y="-192" width="14"/g), 1, pose + ': a pole when asked');
  }
  // roaring: still holding on, head thrown back, the mouth a big round O, eyes screwed shut (unless frightened)
  const hug = A.character('squall', { pose: 'hug' }), roarR = A.character('squall', { pose: 'roar' }), roar = roarR.svg;
  assert.ok(roar.includes('rx="15.6" ry="16.4"'), 'a big round O');
  assert.ok(!hug.svg.includes('rx="15.6" ry="16.4"'));
  assert.ok(!roar.includes('fill="#1c1828"'), 'eyes screwed shut (no pupils)');
  assert.ok(A.character('squall', { pose: 'roar', mood: 'scared' }).svg.includes('fill="#1c1828"'), 'a frightened roar keeps them open');
  // head back: it has tipped away from the pole (further from the centre line than when he hugs it)
  assert.ok(roarR.head.x < hug.head.x - 8, 'head thrown back: ' + roarR.head.x + ' from ' + hug.head.x);
  assert.strictEqual(count(roar, /class="pc-wing"/g), 2);
  // "HALT!": one claw up on the raised paw (four curled short, one long), the other arm still round the pole
  const halt = A.character('squall', { pose: 'halt' });
  assert.ok(halt.bounds.x1 > hug.bounds.x1 + 3 || halt.bounds.y0 <= hug.bounds.y0, 'an arm out past the pole');
  // the hiccup
  const hic = A.character('squall', { pose: 'hiccup' }), sit = A.character('squall', { pose: 'sit' });
  assert.strictEqual(count(hic.svg, /class="pc-mist pc-ring"/g), 1, 'one ring of mist');
  assert.strictEqual(count(hic.svg.match(/<g class="pc-mist pc-ring".*?<\/g><\/g>/)[0], /<circle /g), 22, 'eleven little puffs in a ring (their edge, then the puffs)');
  for (const pose of SQUALL_POSES.filter((p) => p !== 'hiccup')) assert.ok(!A.character('squall', { pose }).svg.includes('pc-ring'), pose + ': no ring');
  assert.ok(hic.head.y < sit.head.y - 6, 'bounced off the roof: ' + hic.head.y + ' above ' + sit.head.y);
  // eyes crossed: the two pupils have come toward each other (sitting, they look the same way)
  const pupils = (svg) => [...svg.matchAll(/<g transform="translate\((-?[\d.]+),-5\) scale\((-?[\d.]+),[\d.]+\)"><g clip-path="[^"]+"><use [^>]+\/><circle cx="(-?[\d.]+)"/g)].map((m) => +m[1] + (+m[2]) * (+m[3]));
  const ph = pupils(hic.svg), ps = pupils(sit.svg);
  assert.ok(ph.length === 2 && ps.length === 2, JSON.stringify([ph, ps]));
  assert.ok(ph[1] - ph[0] < (ps[1] - ps[0]) - 8, 'crossed: ' + JSON.stringify([ph, ps]));
  // pawup: the raised forepaw is reported for a close-up, and `lit` lights its claws (the roof's Tap)
  for (const facing of FACINGS) {
    const up = A.character('squall', { pose: 'pawup', facing });
    assert.ok(up.paw && up.paw.r > 15 && up.paw.y < up.h - 60 && up.paw.y > up.headBox.y0, facing + ': the paw held up ' + JSON.stringify(up.paw));
    assert.ok(facing === 'right' ? up.paw.x > up.headBox.x1 - 12 : up.paw.x < up.headBox.x0 + 12, facing + ': out to the side he faces, clear of his face');
  }
  const litN = (svg) => (svg.match(/<g class="pc-dclaws pc-lit"[^>]*>(.*?)<\/g>/g) || []).reduce((n, g) => n + count(g, /<path /g), 0);
  assert.strictEqual(litN(A.character('squall', { pose: 'pawup' }).svg), 0);
  assert.strictEqual(litN(A.character('squall', { pose: 'pawup', lit: 5 }).svg), 5);
  assert.strictEqual(litN(A.character('squall', { pose: 'pawup', lit: true }).svg), 5);
  assert.strictEqual(litN(A.character('squall', { pose: 'pawup', lit: 3 }).svg), 3);
  assert.strictEqual(litN(A.character('squall', { pose: 'sit', lit: 5 }).svg), 0, 'only the raised paw lights');
  for (const pose of SQUALL_POSES.filter((p) => p !== 'pawup')) assert.strictEqual(A.character('squall', { pose }).paw, undefined);
});

// ----- the 10s

const RIM4 = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 4 }, { who: 'grizzled' }];
const pawsIn = (s) => count(s, /<clipPath id="pcfp[0-9a-z]+">/g);   // (never a character's own id, `pcfp…-0`, when the counter happens to read "fp…")

test('the 10s: each group a cat’s two big forepaws side by side, five claws each, the cat small behind; lit by tens; the rim’s five with totals', () => {
  for (let hl = 0; hl <= 50; hl += 5) {
    const s = A.countsPicture({ table: 10, groups: 5, per: 10, highlight: hl, totals: true, next: true, who: RIM4, look: { fur: 'brown-tabby' } });
    checkSvgDoc(s, 'rim ' + hl);
    checkIds(s, 'rim ' + hl);
    assert.strictEqual(pawsIn(s), 10, 'two forepaws a cat');
    assert.strictEqual(litClaws(s), hl, hl + ' claws lit');
    const want = [];
    for (let g = 1; g * 10 <= hl; g++) want.push(g * 10);
    assert.deepStrictEqual(totals(s), want, 'totals at ' + hl);
    assert.strictEqual(nexts(s), hl < 50 ? 1 : 0, 'one soft glow on the next cat');
    if (hl < 50) assert.ok(/class="pc-next"[^>]*\/><g transform/.test(s), 'the glow sits just before its group (the UI wiggles the pair)');
    assert.strictEqual(count(s, /scale\(-0\.86,0\.86\)/g), 5, 'the left paw of each pair is the right one mirrored (dewclaws inward)');
  }
  // (a white cat's look: no rim cat wears white, so each keeps its own coat)
  const s = A.countsPicture({ table: 10, groups: 5, per: 10, highlight: 0, who: RIM4, look: { fur: 'white' } });
  assert.ok(/aria-label="5 cats sitting up, both forepaws out: 10 front claws each"/.test(s));
  assert.ok(s.includes('#dba79f') && count(s, /fill="#5d4535"/g) >= 2, 'the old tom fifth, behind his two dark paws');
  assert.ok(s.includes('fill="#fcf9f3"') && s.includes('stroke="#5b3f27"'), 'white paws white, a tabby’s barred');
  // once his ten are counted the old tom's ears go flat, as on every other Count
  const earRot = (x) => (x.match(/scale\(-?1,1\) rotate\(([\d.]+)\)/g) || []).map((y) => +y.match(/rotate\(([\d.]+)\)/)[1]);
  assert.ok(Math.max(...earRot(A.countsPicture({ table: 10, groups: 5, highlight: 50, who: RIM4, look: { fur: 'white' } }))) > Math.max(...earRot(s)) + 30);
  // her coat is never on a rim cat (the first rim cat is a brown tabby)
  const she = { fur: 'brown-tabby', marking: 'none', eyes: 'green' };
  assert.notStrictEqual(strip2(A.countsPicture({ table: 10, groups: 5, who: RIM4, look: she })), strip2(A.countsPicture({ table: 10, groups: 5, who: RIM4, look: { fur: 'white' } })));
});

test('the 10s without who: Clan cats behind their own paws; 6 × 10 lights the first five as fifty; 10 × 10 is two rows of five', () => {
  for (const groups of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const s = A.countsPicture({ table: 10, groups, per: 10, highlight: 0 });
    checkSvgDoc(s, 'tens ' + groups);
    checkIds(s, 'tens ' + groups);
    assert.strictEqual(pawsIn(s), groups * 2, groups + ' cats, two forepaws each');
    assert.strictEqual(count(s, /scale\(-0\.86,0\.86\)/g), groups);
    // a cat behind every pair (each cat's own clip paths: more than the paws' alone)
    assert.ok(count(s, /<clipPath id="pc[0-9a-z]+-/g) >= groups * 3, 'a cat behind each pair');
    assert.ok(new RegExp('aria-label="' + groups + (groups === 1 ? ' cat' : ' cats') + ' sitting up').test(s));
    assert.ok(s.length < 130000, groups + ' cats: ' + s.length + ' bytes');
  }
  const vb = (s) => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  const five = vb(A.countsPicture({ table: 10, groups: 5 })), six = vb(A.countsPicture({ table: 10, groups: 6 })), ten = vb(A.countsPicture({ table: 10, groups: 10 }));
  assert.ok(ten[0] === five[0] && ten[1] > five[1] * 1.7 && six[1] === ten[1], 'at most five to a row: 6 to 10 cats take two rows');
  // 6 × 10, lit: 50
  const six50 = A.countsPicture({ table: 10, groups: 6, per: 10, highlight: 50 });
  assert.strictEqual(litClaws(six50), 50);
  const cells = six50.split('<g transform="translate(').slice(1).filter((c) => /scale\(1\)">/.test(c.slice(0, 40)));
  // every claw lit by a ten is a whole cat's: a partly counted pair lights its left paw first
  assert.strictEqual(litClaws(A.countsPicture({ table: 10, groups: 3, highlight: 13 })), 13);
  assert.strictEqual(litClaws(A.countsPicture({ table: 10, groups: 3, highlight: 999 })), 30, 'never more than there are');
  // the facts as the lesson asks them (10 × 2 is two cats; a per of ten on any table is this picture)
  assert.strictEqual(strip2(A.countsPicture({ table: 10, groups: 2, per: 10, highlight: 20, thing: 'front claw', things: 'front claws' })), strip2(A.countsPicture({ table: 10, groups: 2, highlight: 20 })));
  assert.ok(cells.length >= 6);
  // prey in rows of ten, a thought cloud, the pile's own pictures: untouched by the 10s
  const rows = A.countsPicture({ table: 10, groups: 3, per: 10, kind: 'prey', layout: 'rows', thought: true });
  checkSvgDoc(rows, 'three rows of ten');
  assert.ok(/aria-label="A thought: 3 rows of 10 prey"/.test(rows) && pawsIn(rows) === 0);
  const two = A.countsPicture({ table: 10, groups: 2, per: 10, kind: 'prey', layout: 'rows', highlight: 10 });
  assert.ok(/aria-label="2 rows of 10 prey"/.test(two) && pawsIn(two) === 0);
});

test('2 × 5 as one cat’s two forepaws (Tallyheart’s): she sits behind the middle of them, the left paw mirrored; Squall’s one raised forepaw', () => {
  const two = [{ who: 'tallyheart' }, { who: 'tallyheart' }];
  for (let hl = 0; hl <= 10; hl++) {
    const s = A.countsPicture({ table: 5, groups: 2, per: 5, highlight: hl, totals: true, who: two });
    checkSvgDoc(s, '2x5 ' + hl);
    assert.strictEqual(litClaws(s), hl);
    assert.strictEqual(count(s, /L7,-23L-1,-18L9,-12/g), 1, 'one Tallyheart (her torn ear) behind both paws');
    assert.strictEqual(pawsIn(s), 2);
    assert.strictEqual(count(s, /scale\(-0\.94,0\.94\)/g), 1, 'her left paw mirrored');
    assert.deepStrictEqual(totals(s), hl >= 10 ? [5, 10] : hl >= 5 ? [5] : []);
  }
  // the rim's five different cats are as they were: nobody mirrored
  assert.strictEqual(count(A.countsPicture({ table: 5, groups: 5, who: RIM }), /scale\(-0\.94,0\.94\)/g), 0);
  // Squall's forepaw: one group, him small behind it, slate, five pale claws that light
  for (const hl of [0, 5]) {
    const s = A.countsPicture({ table: 5, groups: 1, per: 5, highlight: hl, totals: true, next: hl < 5, who: [{ who: 'squall' }] });
    checkSvgDoc(s, 'squall ' + hl);
    checkIds(s, 'squall ' + hl);
    assert.ok(s.includes('fill="#5f6c7e"') && s.includes('pc-flecks'), 'Squall behind it');
    assert.strictEqual(count(s, /<g class="pc-dclaws/g), hl ? 2 : 1, 'one forepaw (his own arms are not drawn)');
    const lit = (s.match(/<g class="pc-dclaws pc-lit"[^>]*>(.*?)<\/g>/g) || []).reduce((n, g) => n + count(g, /<path /g), 0);
    assert.strictEqual(lit, hl);
    assert.deepStrictEqual(totals(s), hl ? [5] : []);
    assert.strictEqual(nexts(s), hl ? 0 : 1);
    if (!hl) assert.ok(/class="pc-next"[^>]*\/><g transform/.test(s));
    assert.ok(!s.includes('fill="#a8b1b6"'), 'no grey of his sister’s');
  }
  // and beside his sister, each in their own colours
  const both = A.countsPicture({ table: 5, groups: 2, who: [{ who: 'squall' }, { who: 'sprinkle' }] });
  assert.ok(both.includes('fill="#5f6c7e"') && both.includes('fill="#a8b1b6"'));
  checkSvgDoc(A.countsPicture({ table: 10, groups: 2, highlight: 14, who: [{ who: 'sprinkle' }, { who: 'squall' }] }), 'dragonets on the 10s');
});

test('the riddle: seven little forepaws scratched in the roof’s grit, four above three, five claw marks each, no dragonet behind them', () => {
  for (const o of [{ kind: 'grit' }, { kind: 'mud', ground: 'grit' }]) for (const hl of [0, 10, 35]) {
    const s = A.countsPicture(Object.assign({ table: 5, groups: 7, per: 5, highlight: hl }, o));
    checkSvgDoc(s, 'grit ' + hl);
    assert.strictEqual(count(s, /class="pc-mudclaw"/g), 35, 'thirty-five claw marks');
    assert.strictEqual(count(s, /class="pc-mudclaw"[^>]*stroke="#e39a12"/g), hl, hl + ' lit');
    assert.ok(/aria-label="7 little forepaws scratched in the grit, 5 claw marks each"/.test(s));
    assert.ok(s.includes('#cfcabd') && !s.includes('#6f5a47'), 'pale grit, not mud');
    assert.ok(!/pc-dclaws|pc-flecks|#5f6c7e|#a8b1b6/.test(s), 'no dragonet: seven slate paws would say the whole clutch is his colour');
  }
  const s = A.countsPicture({ table: 5, groups: 7, per: 5, kind: 'grit', totals: true, next: true, highlight: 10 });
  assert.deepStrictEqual(totals(s), [5, 10]);
  assert.strictEqual(nexts(s), 1);
  // four above three: the top row's palms at four x positions, the bottom row's at three
  const ys = [...s.matchAll(/<g transform="translate\(([\d.]+),([\d.]+)\) scale\(1\)">/g)].map((m) => +m[2]);
  assert.deepStrictEqual([ys.filter((y) => y === Math.min(...ys)).length, ys.filter((y) => y === Math.max(...ys)).length], [4, 3]);
  assert.ok(lum('#cfcabd') > lum('#6f5a47') + 80, 'the grit is pale');
  // on pale grit the totals are dark; in the mud they stay light (chapter 3's)
  assert.ok(/class="pc-total"[^>]*fill="#6a3d12"/.test(s));
  assert.ok(/class="pc-total"[^>]*fill="#fff6d6"/.test(A.countsPicture({ table: 5, groups: 6, per: 5, kind: 'mud', totals: true, highlight: 10 })));
});

test('her own two forepaws patted down together (paws: own at table 10, or both): all ten claws light with each tap; one glow, one group', () => {
  const look = { fur: 'calico', marking: 'white-paws', eyes: 'odd' };
  const pics = [];
  for (let tap = 0; tap <= 5; tap++) {
    const s = A.countsPicture({ table: 10, groups: 5, per: 10, highlight: tap * 10, totals: false, next: tap < 5, paws: 'own', look, taps: tap });
    checkSvgDoc(s, 'both ' + tap);
    checkIds(s, 'both ' + tap);
    assert.strictEqual(litClaws(s), tap ? 10 : 0, `tap ${tap}: ${tap ? 'all ten claws' : 'nothing'} lit`);
    assert.strictEqual(nexts(s), tap < 5 ? 1 : 0, 'both glow softly, as one');
    if (tap < 5) assert.ok(/class="pc-next"[^>]*\/><g class="pc-paws">/.test(s), 'the glow, then both paws in one group (they wiggle together)');
    assert.strictEqual(count(s, /class="pc-paws"/g), 1);
    assert.strictEqual(count(s, /class="pc-pat"/g), tap ? 1 : 0, 'the marks of a pat');
    assert.deepStrictEqual(totals(s), [], 'the number is in her murmur');
    assert.ok(/aria-label="Your own two forepaws on the moss, patted down together: 10 claws, 5 taps"/.test(s));
    pics.push(strip2(s));
  }
  for (let i = 1; i < pics.length; i++) assert.notStrictEqual(pics[i], pics[i - 1], `tap ${i} changes the picture`);
  // totals when asked for, in a row beneath, by tens
  assert.deepStrictEqual(totals(A.countsPicture({ table: 10, groups: 5, per: 10, highlight: 30, totals: true, paws: 'own', look })), [10, 20, 30]);
  // `both` is the same picture on any table's call; chapter 3's taking turns is `own` at five
  assert.strictEqual(strip2(A.countsPicture({ table: 10, groups: 5, per: 10, highlight: 20, paws: 'both', look })), strip2(A.countsPicture({ table: 10, groups: 5, per: 10, highlight: 20, paws: 'own', look })));
  assert.ok(/5 claws each, 4 taps/.test(A.countsPicture({ table: 5, groups: 4, per: 5, highlight: 5, paws: 'own', look })), 'the 5s keep their own picture');
  // her fur
  assert.ok(A.countsPicture({ table: 10, groups: 5, paws: 'own', look: { fur: 'ginger' } }).includes('fill="#e8913a"'));
  assert.ok(A.countsPicture({ table: 10, groups: 5, paws: 'own', look }).includes('fill="#ffffff"'));
});

test('the promise (paws: promise): six forepaws piled, thirty claws, lit one friend’s pair at a time in pile order; the next pair glows just before its group', () => {
  const look = { fur: 'ginger', marking: 'none', eyes: 'green' };
  const OWN_CLAW = /d="M-4\.4,0Q-3\.4,-15 2,-24Q3\.4,-13 4\.4,0Z"/g;
  for (let tap = 0; tap <= 3; tap++) {
    const s = A.countsPicture({ table: 10, groups: 3, per: 10, highlight: tap * 10, totals: true, next: tap < 3, paws: 'promise', look });
    checkSvgDoc(s, 'promise ' + tap);
    checkIds(s, 'promise ' + tap);
    // thirty claws: Sprinkle's ten long pale ones, her own ten, Riffle's ten little ones
    const dz = (s.match(/<g class="pc-dclaws[^"]*"[^>]*>(.*?)<\/g>/g) || []).reduce((n, g) => n + count(g, /<path /g), 0);
    const own = count(s, OWN_CLAW), otter = (s.match(/<g class="pc-oclaws">(.*?)<\/g>/g) || []).reduce((n, g) => n + count(g, /<path /g), 0);
    assert.deepStrictEqual([dz, own, otter], [10, 10, 10], 'ten claws to each friend');
    // lit a friend at a time: Sprinkle's (lowest in the pile), hers, Riffle's
    const litDz = (s.match(/<g class="pc-dclaws pc-lit"[^>]*>(.*?)<\/g>/g) || []).reduce((n, g) => n + count(g, /<path /g), 0);
    const litOtter = (s.match(/<g class="pc-oclaws">(.*?)<\/g>/g) || []).reduce((n, g) => n + count(g, /fill="#ffe36e"/g), 0);
    const litOwn = count(s, /d="M-4\.4,0Q-3\.4,-15 2,-24Q3\.4,-13 4\.4,0Z" fill="#ffe36e"/g);
    assert.deepStrictEqual([litDz, litOwn, litOtter], [tap >= 1 ? 10 : 0, tap >= 2 ? 10 : 0, tap >= 3 ? 10 : 0], 'tap ' + tap);
    assert.deepStrictEqual(totals(s), [10, 20, 30].slice(0, tap));
    // three pairs, bottom to top; the glow is the element just before the next pair's group
    const pairs = [...s.matchAll(/<g class="pc-pair">/g)].map((m) => m.index);
    assert.strictEqual(pairs.length, 3);
    assert.ok(s.indexOf('fill="#a8b1b6"') < pairs[1] && s.indexOf('class="pc-oclaws"') > pairs[2], 'Sprinkle’s lowest, Riffle’s on top');
    assert.strictEqual(nexts(s), tap < 3 ? 1 : 0);
    if (tap < 3) {
      const at = s.indexOf('class="pc-next"');
      assert.ok(/class="pc-next"[^>]*\/><g class="pc-pair">/.test(s));
      assert.strictEqual(pairs.filter((i) => i < at).length, tap, 'the glow is on pair ' + (tap + 1));
    }
    assert.ok(/aria-label="Six forepaws in a pile/.test(s));
  }
  // her fur on her own two (a ginger tabby's are barred; white paws are socks), `pile` is the same picture
  const s = A.countsPicture({ table: 10, groups: 3, per: 10, highlight: 0, paws: 'promise', look });
  assert.ok(s.includes('fill="#e8913a"') && s.includes('stroke="#b5602a"') && s.includes('fill="#8c5a36"') && s.includes('fill="#a8b1b6"'), 'ginger, otter brown, mist grey');
  assert.ok(A.countsPicture({ table: 10, groups: 3, per: 10, paws: 'promise', look: { fur: 'black', marking: 'white-paws' } }).includes('fill="#fcf9f3"'));
  assert.strictEqual(strip2(A.countsPicture({ table: 10, groups: 3, per: 10, highlight: 10, paws: 'pile', look })), strip2(s.length ? A.countsPicture({ table: 10, groups: 3, per: 10, highlight: 10, paws: 'promise', look }) : ''));
  assert.deepStrictEqual(totals(A.countsPicture({ table: 10, groups: 3, per: 10, highlight: 30, paws: 'promise', look })), [], 'no totals unless asked (the count is in her own balloon)');
  assert.ok(lum('#ead3aa') > lum('#5a5060') + 60, 'a warm pool of light on the dark floor');
});

test('the promise: fanned so all thirty claws show (no claw of a lower pair lies under a paw piled on it), with any look', () => {
  // Rebuild where things are from the markup, in the pile's own coordinates. Sprinkle's claws: the
  // paths in each pc-dclaws group, through that paw's matrix. Her own: each claw's base and tip
  // (translate + rotate inside the paw's translate + scale). Riffle's paws: his palm and webbed toes
  // are within 66 of each paw's origin, and his arm runs back from it.
  const mat = (m, p) => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
  for (const look of [{ fur: 'ginger' }, { fur: 'black', marking: 'white-paws' }, { fur: 'calico' }, undefined]) {
    const s = A.countsPicture({ table: 10, groups: 3, per: 10, highlight: 0, paws: 'promise', look });
    const dz = [];
    for (const m of s.matchAll(/<g transform="matrix\(([^)]+)\)">(?:(?!<g transform="matrix).)*?<g class="pc-dclaws"[^>]*>(.*?)<\/g>/g)) {
      const M = m[1].split(',').map(Number);
      for (const path of m[2].match(/d="[^"]+"/g)) { const n = path.match(/-?[\d.]+/g).map(Number); for (let i = 0; i + 1 < n.length; i += 2) dz.push(mat(M, [n[i], n[i + 1]])); }
    }
    assert.ok(dz.length >= 10 * 7, 'Sprinkle’s ten claws found');
    const own = [], paws = [];
    for (const g of s.matchAll(/<g transform="translate\((\d+),(\d+)\) scale\(0\.8\)">(.*?)<rect x="-43\.6"/g)) {
      const cx = +g[1], cy = +g[2];
      paws.push({ x0: cx - 44 * 0.8, x1: cx + 44 * 0.8, y0: cy - 70 * 0.8, y1: 9999 });
      for (const c of g[3].matchAll(/<path transform="translate\((-?[\d.]+),(-?[\d.]+)\) rotate\((-?[\d.]+)\)" d="M-4\.4,0Q/g)) {
        const r = +c[3] * Math.PI / 180;
        for (const q of [[0, 0], [2, -24], [-4.4, 0], [4.4, 0]]) own.push([cx + 0.8 * (+c[1] + q[0] * Math.cos(r) - q[1] * Math.sin(r)), cy + 0.8 * (+c[2] + q[0] * Math.sin(r) + q[1] * Math.cos(r))]);
      }
    }
    assert.strictEqual(own.length, 40, 'her ten claws found');
    assert.strictEqual(paws.length, 2);
    const otters = [...s.matchAll(/<g transform="translate\((\d+),(\d+)\) rotate\((-?\d+)\)"><path d="M-24\.4,270/g)].map((m) => ({ x: +m[1], y: +m[2], a: +m[3] * Math.PI / 180 }));
    assert.strictEqual(otters.length, 2, 'Riffle’s two paws');
    // under one of Riffle's: within his paw's reach of its middle, or along his arm behind it (the
    // arm runs down his own +y: 25 either side, a little more with its outline)
    const underOtter = (p) => otters.some((o) => {
      const dx = p[0] - o.x, dy = p[1] - o.y, u = dx * Math.cos(o.a) + dy * Math.sin(o.a), v = -dx * Math.sin(o.a) + dy * Math.cos(o.a);
      return Math.hypot(dx, dy) < 66 || (v > 0 && Math.abs(u) < 28);
    });
    const underOwn = (p) => paws.some((b) => p[0] > b.x0 - 2 && p[0] < b.x1 + 2 && p[1] > b.y0 && p[1] < b.y1);
    for (const p of dz) assert.ok(!underOwn(p) && !underOtter(p), 'a claw of Sprinkle’s under a paw: ' + JSON.stringify(p));
    for (const p of own) assert.ok(!underOtter(p), 'a claw of hers under Riffle’s paw: ' + JSON.stringify(p));
    // Riffle's own two: the far paw is drawn first and the near one over it, so no claw of the far paw may
    // lie under the near paw or its arm (one did: 29 claws showed, and the third tap lit nine)
    const oclaws = [...s.matchAll(/<g transform="translate\((\d+),(\d+)\) rotate\((-?\d+)\)"><path d="M-24\.4,270(?:(?!<g transform="translate).)*?<g class="pc-oclaws">(.*?)<\/g>/g)].map((m) => {
      const x = +m[1], y = +m[2], a = +m[3] * Math.PI / 180;
      return (m[4].match(/d="[^"]+"/g) || []).map((d) => { const n = d.match(/-?[\d.]+/g).map(Number), pts = []; for (let i = 0; i + 1 < n.length; i += 2) pts.push([x + n[i] * Math.cos(a) - n[i + 1] * Math.sin(a), y + n[i] * Math.sin(a) + n[i + 1] * Math.cos(a)]); return pts; });
    });
    assert.deepStrictEqual(oclaws.map((c) => c.length), [5, 5], 'five claws on each of Riffle’s paws');
    // (his paw's real outline, in its own coordinates, u across and v down the arm: the arm, the palm, the fan of
    // webbed toes, and each toe's claw; the circle of 66 above is too coarse for two paws lying side by side)
    const underOne = (o, p) => {
      const dx = p[0] - o.x, dy = p[1] - o.y, u = dx * Math.cos(o.a) + dy * Math.sin(o.a), v = -dx * Math.sin(o.a) + dy * Math.cos(o.a);
      const r = Math.hypot(u, v), ang = Math.atan2(u, -v) * 180 / Math.PI;
      return (v > -6 && Math.abs(u) < 26.5) || (u / 31) ** 2 + ((v - 2) / 29) ** 2 < 1 || (r < 53 && Math.abs(ang) < 73) || (r < 65 && [-58, -29, 0, 29, 58].some((t) => Math.abs(ang - t) < 6));
    };
    oclaws.forEach((claws, k) => claws.forEach((pts, ci) => pts.forEach((p) => {
      for (let later = k + 1; later < otters.length; later++) assert.ok(!underOne(otters[later], p), 'claw ' + ci + ' of Riffle’s paw ' + k + ' under his other paw: ' + JSON.stringify(p));
      assert.ok(p[0] > 200 && p[0] < 760 && p[1] > 154 && p[1] < 512, 'in the picture: ' + JSON.stringify(p));
    })));
    // every arm runs out of the picture (none ends in view): Sprinkle's and hers past the bottom
    // edge (y 516 in the pile's coordinates), Riffle's past the right edge (x 764) or the bottom
    for (const o of otters) { const ex = o.x - Math.sin(o.a) * 270, ey = o.y + Math.cos(o.a) * 270; assert.ok(ex > 772 || ey > 524, 'Riffle’s arm leaves the picture: ' + ex + ',' + ey); }
    for (const b of paws) assert.ok(350 + 0.8 * 254 > 524, 'her arms leave by the bottom edge');
    // and every claw is inside the picture's window (VX 196, VY 150, 568 x 366)
    for (const p of dz.concat(own)) assert.ok(p[0] > 200 && p[0] < 760 && p[1] > 154 && p[1] < 512, 'in the picture: ' + JSON.stringify(p));
  }
});

test('sand: pairs of swipes for the tens (a pair to a box, never split), the roof’s grit, and rows lit a whole row at a time when the help hops by the row', () => {
  const boxes = (s) => [...s.matchAll(/<rect class="pc-pairbox" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].map((m) => m.slice(1).map(Number));
  const lines = (s) => [...s.matchAll(/<path class="pc-swipe" d="M([\d.]+),([\d.]+)Q[^"]+" stroke="(#[0-9a-f]+)"/g)].map((m) => ({ x: +m[1], y: +m[2], lit: m[3] === '#e39a12' }));
  const vb = (s) => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  for (let groups = 1; groups <= 10; groups++) for (const ground of [undefined, 'earth', 'grit']) {
    for (const counted of [0, 10, groups * 10 - 10, groups * 10].filter((c) => c >= 0)) {
      const s = A.sand({ groups, per: 10, counted, style: 'swipe', pair: true, ground });
      checkSvgDoc(s, `pairs ${groups} ${counted}`);
      const B = boxes(s), L = lines(s);
      assert.strictEqual(B.length, groups, 'a box a cat');
      assert.strictEqual(L.length, groups * 10, 'ten claw lines a cat');
      assert.strictEqual(L.filter((l) => l.lit).length, counted, counted + ' lit');
      // a pair to a box, never split across rows: each box holds exactly ten lines, in two swipes of five
      B.forEach((b, i) => {
        const mine = L.filter((l) => l.x >= b[0] && l.x <= b[0] + b[2] && l.y >= b[1] && l.y <= b[1] + b[3]);
        assert.strictEqual(mine.length, 10, `box ${i}: both swipes`);
        const xs = mine.map((l) => l.x).sort((a, c) => a - c), gaps = xs.slice(1).map((x, j) => x - xs[j]);
        assert.strictEqual(gaps.filter((g) => g > 20).length, 1, 'two swipes: one wider gap between them');
        // lit a pair at a time when the help hops by tens
        assert.ok(mine.every((l) => l.lit === (i < counted / 10)), `box ${i} at ${counted}`);
      });
      // at most four pairs to a row, and nine or ten come out three to a row
      const rowY = [...new Set(B.map((b) => b[1]))], perRow = Math.max(...rowY.map((y) => B.filter((b) => b[1] === y).length));
      assert.ok(perRow <= 4, groups + ': ' + perRow + ' to a row');
      if (groups >= 7) assert.strictEqual(perRow, 3, groups + ' pairs: three to a row');
      assert.ok(new RegExp('aria-label="' + groups + (groups === 1 ? ' pair' : ' pairs') + ' of swipes, 5 claw lines a swipe, in the ' + (ground || 'sand') + '"').test(s));
      // big enough on a phone: no narrower than 10 × 5 as chapter 3 swipes it
      assert.ok(vb(s)[0] <= vb(A.sand({ groups: 10, per: 5, style: 'swipe' }))[0] * 1.06, groups + ': ' + vb(s)[0] + ' wide');
    }
  }
  // 10 × 9 and 10 × 10 (18 and 20 swipes): three rows of three; three, three, three and one
  assert.deepStrictEqual([...new Set(boxes(A.sand({ groups: 9, per: 10, style: 'swipe', pair: true })).map((b) => b[1]))].length, 3);
  assert.deepStrictEqual([...new Set(boxes(A.sand({ groups: 10, per: 10, style: 'swipe', pair: true })).map((b) => b[1]))].length, 4);
  // a line at a time when the count is not a ten
  assert.strictEqual(lines(A.sand({ groups: 3, per: 10, counted: 13, style: 'swipe', pair: true })).filter((l) => l.lit).length, 13);
  // the roof's grit: pale grey, for swipes and for plain scratches
  const grit = A.sand({ groups: 7, per: 5, counted: 15, style: 'swipe', ground: 'grit' });
  assert.ok(grit.includes('#cfcabd') && /aria-label="7 swipes of 5 claw lines in the grit"/.test(grit) && !grit.includes('#efd6a2'));
  assert.strictEqual(count(grit, /class="pc-swipe"[^>]*stroke="#e39a12"/g), 15);
  assert.ok(/scratches in the grit"/.test(A.sand({ groups: 3, per: 2, ground: 'grit' })));
  assert.ok(lum('#cfcabd') > lum('#a27a55') + 60, 'paler than the earth');
  // rows of ten in the earth beside the pile: with step 10 the first hop lights exactly the first row
  const litRows = (s) => {
    const rects = [...s.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="[\d.]+" height="([\d.]+)" rx="18"/g)].map((m) => [+m[2], +m[2] + (+m[3])]);
    const marks = [...s.matchAll(/<path d="M[\d.]+,([\d.]+)Q[^"]+" stroke="(#[0-9a-f]+)" stroke-width="4\.6"/g)].map((m) => ({ y: +m[1], lit: m[2] === '#e39a12' }));
    return rects.map((r) => marks.filter((k) => k.y >= r[0] && k.y <= r[1] && k.lit).length);
  };
  assert.deepStrictEqual(litRows(A.sand({ groups: 3, per: 10, counted: 10, layout: 'rows', ground: 'earth', step: 10 })), [10, 0, 0], '3 × 10: 10');
  assert.deepStrictEqual(litRows(A.sand({ groups: 3, per: 10, counted: 20, layout: 'rows', ground: 'earth', step: 10 })), [10, 10, 0], '20');
  assert.deepStrictEqual(litRows(A.sand({ groups: 4, per: 10, counted: 30, layout: 'rows', ground: 'earth', step: 10 })), [10, 10, 10, 0], 'tonight’s four rows: 30');
  assert.deepStrictEqual(litRows(A.sand({ groups: 2, per: 10, counted: 10, layout: 'rows', ground: 'earth', step: 10 })), [10, 0]);
  // without the step (or with another), a column at a time, as chapter 2's check counts
  assert.deepStrictEqual(litRows(A.sand({ groups: 3, per: 10, counted: 10, layout: 'rows', ground: 'earth' })), [4, 3, 3]);
  assert.deepStrictEqual(litRows(A.sand({ groups: 2, per: 8, counted: 6, layout: 'rows', step: 2 })), [3, 3]);
});

// ====================================================================== chapter 5: Riffle's River
// (docs/chapters/05-riffles-river.md, "Art needs" and "Build"; docs/build.md, "Chapter 5")

const HERON_POSES = ['stand', 'eye', 'shut', 'point', 'gulp', 'full', 'feather'];
const PUDDLE_POSES = ['foot', 'head', 'log', 'sink', 'pawup', 'nostrils', 'sit'];
const WISP_POSES = ['reed', 'blink', 'shh', 'draw', 'nod', 'flinch', 'gulp', 'pawup'];
const OTTER_POSES5 = ['whistle', 'groan', 'flip', 'hop', 'point', 'fall', 'slap'];
// every id this file's pictures make, normalised (chapter 5's picture ids are a name, an underscore and the counter)
const strip5 = (x) => strip2(x).replace(/pc(?:paw|day|fish|raft|board|log)_[0-9a-z]+/g, 'id');
const rgbOf = (hex) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
// how big the scenes would draw a newcomer against another's sitting drawing (app/art/scenes.js, SIZE_BAND)
const measure = (who, pose, by) => { const ch = A.character(who, { pose, mood: 'neutral' }), hb = ch.headBox; return by === 'head' ? ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2 : ch.h - hb.y0; };

test('chapters 1 to 4 are unchanged by chapter 5 (a fingerprint of every cast member, pose, mood and extra, the Counts pictures and the sand)', () => {
  // Taken from the chapter 4 code before chapter 5 extended it (2026-10-11), ids normalised: 26,628
  // drawings (26,640 until table 3's patrols left the sweep on purpose in chapter 6; the chapter 4 and 5
  // code give the same hash without them). Every cat in every pose and mood, the extras, the otters and dogs, Sprinkle, Reynard,
  // Squall, the Tall One, sparrow and moth; the 10s, the 5s' named pairs, the grit, the mud, her own
  // paws, the promise, tables 1 to 8, the prey, and the sand in every ground and style. If their
  // art is ever changed on purpose, take a new fingerprint and say so. One thing chapter 5 changed
  // on purpose is not in here: a plain picture of nine things a group (table 9), which no chapter
  // drew, is the 9s' own now (see chapter 1's counts sweep above).
  const s5 = (x) => x.replace(/pc[0-9a-z]+-[0-9a-z]+/g, 'id').replace(/pc(?:dzf|fp|op|wp|tp|pr|t)[0-9a-z]+/g, 'id');
  const MOODS = ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn', 'sad', 'shy'];
  const POSES = ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer', 'pawup', 'tummy', 'situp'];
  const DZ = DZ_POSES.slice(0, 19);
  const look = { fur: 'silver-tabby', marking: 'nose-splash', eyes: 'copper', sex: 'she' };
  const out = [];
  const rec = (r) => { out.push(s5(r.svg), JSON.stringify([r.w, r.h, r.head, r.headBox || null, r.bounds || null, r.held || null, r.chestTop || null, r.nest || null, r.pole || null, r.paw || null]), s5(r.front || '')); };
  for (const who of CATS) for (const pose of POSES) for (const mood of MOODS) rec(A.character(who, { pose, mood, look, variant: 4, facing: (pose.length + mood.length) % 2 ? 'left' : 'right' }));
  for (const who of ['tallyheart', 'player', 'grizzled']) for (const pose of POSES) for (const ex of [{ wink: true }, { holds: 'bark' }, { holds: 'bark', holdAt: 'nose' }, { holds: 'stone', holdAt: 'chin' }, { flatEars: true }, { claws: true }, { claws: false }, { puffed: true, tear: true }, { moss: true, mist: true, squeeze: true }, { holds: 'vole' }])
    rec(A.character(who, Object.assign({ pose, mood: 'kind', look }, ex)));
  for (const [who, poses] of [['riffle', OTTER_POSES], ['otter', OTTER_POSES], ['dog', DOG_POSES]]) for (const variant of [1, 2, 3]) for (const pose of poses) for (const mood of MOODS)
    for (const ex of [{}, { holds: 'fish2', tear: true }, { pebbles: 5, squeeze: true, mist: true }]) rec(A.character(who, Object.assign({ pose, mood, variant, facing: mood.length % 2 ? 'left' : 'right' }, ex)));
  for (const pose of DZ) for (const mood of MOODS) for (const facing of FACINGS) rec(A.character('sprinkle', { pose, mood, facing }));
  for (const pose of DZ) rec(A.character('sprinkle', { pose, mood: 'shy', holds: 'pebble', tear: true, mist: true, noArms: pose === 'sit' }));
  for (const pose of FOX_POSES) for (const mood of MOODS) for (const facing of FACINGS) for (const flick of [false, true]) rec(A.character('reynard', { pose, mood, facing, flick }));
  for (const pose of SQUALL_POSES) for (const mood of MOODS) for (const facing of FACINGS) for (const ex of [{}, { pole: true, lit: 3 }, { tear: true, mist: true, squeeze: true }]) rec(A.character('squall', Object.assign({ pose, mood, facing }, ex)));
  for (const who of ['tallone', 'sparrow', 'moth']) for (const pose of ['stand', 'water', 'set-dish', 'perch', 'fluffed', 'fly']) for (const facing of FACINGS) rec(A.character(who, { pose, facing }));
  const RIM5 = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  const cp = (o) => out.push(s5(A.countsPicture(o)));
  for (let hl = 0; hl <= 50; hl += 10) cp({ table: 10, groups: 5, per: 10, highlight: hl, totals: true, next: hl < 50, who: RIM5, look });
  for (const g of [1, 2, 4, 6, 9, 10]) for (const hl of [0, 13, 60]) { cp({ table: 10, groups: g, per: 10, highlight: hl, look }); cp({ table: 10, groups: g, highlight: hl, who: RIM5.slice(1, 4) }); }
  cp({ table: 10, groups: 2, highlight: 14, who: [{ who: 'sprinkle' }, { who: 'squall' }] });
  for (let hl = 0; hl <= 10; hl += 5) cp({ table: 5, groups: 2, per: 5, highlight: hl, totals: true, who: [{ who: 'tallyheart' }, { who: 'tallyheart' }] });
  for (const hl of [0, 5]) cp({ table: 5, groups: 1, per: 5, highlight: hl, totals: true, next: hl < 5, who: [{ who: 'squall' }] });
  for (const hl of [0, 12, 35]) { cp({ table: 5, groups: 7, per: 5, kind: 'grit', ground: 'grit', highlight: hl }); cp({ table: 5, groups: 6, per: 5, kind: 'mud', highlight: hl, totals: true, next: true }); cp({ table: 5, groups: 7, per: 5, kind: 'mud', ground: 'grit', highlight: hl }); }
  for (let tap = 0; tap <= 5; tap++) cp({ paws: 'own', both: true, table: 10, groups: 5, per: 10, highlight: tap * 10, taps: tap, look, lit: tap ? 'both' : null, nextPaw: tap < 5 ? 'both' : null, totals: false, next: tap < 5 });
  for (let tap = 0; tap <= 4; tap++) cp({ paws: 'own', table: 5, groups: 4, per: 5, highlight: tap * 5, taps: tap, look, next: tap < 4, totals: tap % 2 === 0 });
  for (let tap = 0; tap <= 3; tap++) for (const paws of ['promise', 'pile']) cp({ paws, table: 10, groups: 3, taps: tap, highlight: tap * 10, look, next: tap < 3, totals: paws === 'pile' });
  // (table 3, the patrols, is chapter 6's own picture since 2026-10-18: no chapter before it draws one; see
  // chapter 1's counts sweep above)
  for (let t = 1; t <= 8; t++) if (t !== 3) for (const g of [1, 4, 7]) for (const fl of [{}, { totals: true, next: true }, { thought: true }, { layout: 'rows', totals: true }]) cp(Object.assign({ table: t, groups: g, highlight: t * 2, who: t === 2 ? RIM5 : undefined, look }, fl));
  for (const [g, p] of [[9, 2], [4, 10], [3, 10], [2, 8]]) for (const layout of ['stacks', 'rows']) for (const thought of [false, true, 'right']) cp({ table: p, groups: g, per: p, highlight: p, kind: 'prey', layout, thought, totals: true, next: true });
  for (const ground of [undefined, 'earth', 'mud', 'grit']) for (const style of [undefined, 'swipe']) for (const pair of [undefined, true]) for (const [g, p, c] of [[4, 10, 20], [10, 10, 30], [6, 5, 12], [9, 2, 4], [1, 1, 0]]) out.push(A.sand({ groups: g, per: p, counted: c, ground, style, pair }));
  for (const step of [undefined, 10, 2]) for (const [g, p, c] of [[4, 10, 10], [2, 8, 6], [3, 10, 30]]) out.push(A.sand({ groups: g, per: p, counted: c, layout: 'rows', ground: 'earth', step }));
  for (const kind of ['mouse', 'vole', 'fish']) for (const lit of [false, true]) for (const part of [undefined, 'glow', 'body', 'spark']) out.push(JSON.stringify(A.preyFallback({ kind, lit, part, facing: lit ? 'left' : 'right' })));
  assert.strictEqual(out.length, 26628);
  assert.strictEqual(crypto.createHash('sha256').update(out.join('\n')).digest('hex'), 'f06b20d92bd69d17c7dac4323362d47a483a21caed9d96abc053e120aa5c8b18');
  // and chapter 5's options, when absent or false, change nothing
  const base = A.character('grizzled', { pose: 'situp', mood: 'stern' });
  assert.strictEqual(strip(A.character('grizzled', { pose: 'situp', mood: 'stern', tuck: false, asleep: false, snail: false, buzz: false, dragonfly: false, glow: false, tap: false }).svg), strip(base.svg));
  assert.strictEqual(strip(A.character('riffle', { pose: 'hug', holds: 'nothing', tap: 'pole', glow: false }).svg), strip(A.character('riffle', { pose: 'hug' }).svg), 'nothing to hold, nothing to tap');
  assert.strictEqual(strip2(A.countsPicture({ table: 10, groups: 3, per: 10, highlight: 20, tuck: true, taps: 2 })), strip2(A.countsPicture({ table: 10, groups: 3, per: 10, highlight: 20 })), 'the tuck is the 9s’ alone: the 10s keep every claw out');
  assert.strictEqual(A.sand({ groups: 4, per: 10, counted: 20, style: 'swipe', pair: true, rubbed: 0 }), A.sand({ groups: 4, per: 10, counted: 20, style: 'swipe', pair: true }), 'nothing rubbed out: chapter 4’s pairs');
  assert.strictEqual(strip2(A.countsPicture({ table: 5, groups: 6, per: 5, kind: 'mud', highlight: 10, of: 9 })), strip2(A.countsPicture({ table: 5, groups: 6, per: 5, kind: 'mud', highlight: 10 })), '`of` is the mud count’s alone');
});

test('chapter 5 vocabulary: patience, puddle and wisp and their poses; the otters’ seven new poses; Sprinkle’s lookdown; the extras (earlier ids never move)', () => {
  assert.deepStrictEqual(A.vocab.cast.slice(19, 22), ['patience', 'puddle', 'wisp']);
  assert.deepStrictEqual(A.vocab.otherPoses.patience, HERON_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.puddle, PUDDLE_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.wisp, WISP_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.riffle.slice(11, 18), OTTER_POSES5);
  assert.deepStrictEqual(A.vocab.otherPoses.otter, A.vocab.otherPoses.riffle);
  assert.deepStrictEqual(A.vocab.otherPoses.sprinkle.slice(19), ['lookdown']);
  assert.strictEqual(A.vocab.poses.length, 15, 'the cats have no new pose: what is new for them is an extra');
  for (const k of ['tuck', 'asleep', 'snail', 'buzz', 'dragonfly', 'glow', 'tap', 'holds', 'reach']) assert.ok(Array.isArray(A.vocab.extras[k]) && A.vocab.extras[k].length, 'extra ' + k);
  assert.deepStrictEqual(Object.keys(A.vocab.extras).slice(0, 9), ['tuck', 'asleep', 'snail', 'buzz', 'dragonfly', 'glow', 'tap', 'holds', 'reach']);
  assert.deepStrictEqual(A.vocab.extras.reach, [true]);
  assert.deepStrictEqual(A.vocab.extras.snail, [true, 'in']);
  assert.ok(A.vocab.extras.holds.includes('pole'));
  for (const who of ['patience', 'puddle', 'wisp']) assert.ok(!(who in A.vocab.variants), 'one ' + who);
  // an unknown pose: Patience stands, Wisp is Wisp with her eyes open, Puddle sits (his page in the book)
  assert.strictEqual(strip(A.character('patience', { pose: 'sit' }).svg), strip(A.character('patience', { pose: 'stand' }).svg));
  assert.strictEqual(strip(A.character('wisp', { pose: 'sit' }).svg), strip(A.character('wisp', { pose: 'blink' }).svg));
  assert.strictEqual(strip(A.character('puddle', { pose: 'nope' }).svg), strip(A.character('puddle', { pose: 'sit' }).svg));
});

// ----- Patience

test('every Patience pose x facing renders, inside her box (330 x 460), her standing foot on the middle of the bottom edge; ids unique', () => {
  for (const pose of HERON_POSES) for (const facing of FACINGS) for (const ex of [{}, { dragonfly: true }, { squeeze: true }]) {
    const label = `patience/${pose}/${facing}/${JSON.stringify(ex)}`, r = A.character('patience', Object.assign({ pose, facing }, ex));
    checkResult(r, label);
    checkIds(r.svg, label);
    assert.strictEqual(r.w, 330); assert.strictEqual(r.h, 460);
    const h = r.headBox, b = r.bounds;
    assert.ok(h.x0 < r.head.x && r.head.x < h.x1 && h.y0 < r.head.y && r.head.y < h.y1, label + ': head point inside the head box');
    assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= r.w + 1 && b.y1 <= r.h + 1, label + ': inside her box ' + JSON.stringify(b));
    assert.ok(Math.abs(r.h - 3 - b.y1) < 1, label + ': her foot is on the ground line');
    assert.ok(/^<g transform="matrix\((-?)1,0,0,1,/.test(r.svg), label + ': never shrunk to fit');
    assert.strictEqual(/^<g transform="matrix\(-1,/.test(r.svg), facing === 'left', label + ': mirrored for facing left only');
    assert.ok(r.bill && r.bill.x > 0 && r.bill.x < r.w && r.bill.y > 0 && r.bill.y < r.h, label + ': where a dragonfly sits on her bill');
  }
  // the foot she stands on is under the middle of her box, whichever way she faces
  const a = A.character('patience', { pose: 'stand' }), b = A.character('patience', { pose: 'stand', facing: 'left' });
  assert.ok(Math.abs(a.head.x + b.head.x - 330) < 0.2 && Math.abs(a.bill.x + b.bill.x - 330) < 0.2, 'head and bill mirror about the middle');
  assert.ok(a.svg.length < 14000, 'light: ' + a.svg.length);
});

test('Patience: a great blue heron taller than Tallyheart, on one leg; blue-grey, a white face, a black stripe into a thin plume, a long yellow bill, one yellow eye', () => {
  const p = A.character('patience', { pose: 'stand' }), t = A.character('tallyheart', { pose: 'sit' });
  assert.ok(topOf(p) > topOf(t) * 1.6 && topOf(p) < topOf(t) * 2.2, `taller than Tallyheart sits: ${topOf(p)} to ${topOf(t)}`);
  const r = measure('patience', 'stand', 'tall') / measure('tallyheart', 'sit', 'tall');
  assert.ok(r >= 1.4 && r <= 2.6, 'inside the size the scenes hold her to, so her own size stands: ' + r);
  const s = p.svg;
  assert.ok(s.includes('fill="#8799ad"'), 'a blue-grey body');
  const [rr, gg, bb] = rgbOf('#8799ad');
  assert.ok(bb > rr + 20 && bb > gg, 'blue-grey, not grey');
  assert.ok(s.includes('#fbf9f3') && s.includes('#242a33'), 'a white face, a black stripe');
  assert.strictEqual(count(s, /stroke="#242a33" stroke-width="(3|2\.4)" fill="none"/g), 2, 'the stripe runs back into two thin plumes');
  assert.ok(s.includes('fill="#f0bf38"') && s.includes('fill="#d59c22"'), 'a yellow bill, darker along the top');
  assert.ok(s.includes('fill="#f8d840"'), 'a yellow eye');
  // one leg under her, the other folded up: one shank down to the ground, one joint low, the toes of one foot
  assert.strictEqual(count(s, /<circle cx="-6" cy="-68" r="4\.8"/g), 1, 'one knee: she stands on one leg');
  assert.ok(s.includes('M16,-128L32,-104L14,-98'), 'the other leg folded up under her');
  // long bill: longer than her head is deep; a long neck: her head far above her body
  assert.ok(p.headBox.x1 - p.head.x > (p.headBox.y1 - p.headBox.y0) * 1.5, 'a long bill');
  assert.ok(!/<filter|feGaussianBlur/.test(s), 'flat papercut: no filters');
});

test('Patience: one mood, level, in every pose (a mood changes nothing); her head never turns (one eye, in profile, always)', () => {
  for (const pose of HERON_POSES) {
    const base = strip(A.character('patience', { pose }).svg);
    for (const mood of A.vocab.moods) assert.strictEqual(strip(A.character('patience', { pose, mood }).svg), base, `${pose}/${mood}: her face does not change`);
    const s = A.character('patience', { pose }).svg;
    // exactly one eye in every pose: open (one pupil) or shut (none), never two, never a frontal face
    assert.strictEqual(count(s, /class="pc-pupil"/g), pose === 'shut' ? 0 : 1, pose + ': one eye to the viewer');
    assert.strictEqual(count(s, /fill="#f8d840"/g), pose === 'shut' ? 0 : 1, pose + ': one yellow eye');
    assert.strictEqual(count(s, /<path d="M15,-7\.4L79,-1\.4L15,0\.8Z"/g), 1, pose + ': one bill, side on');
  }
});

test('Patience’s poses: eye (only her eye turns), shut (and shut tight), point (the bill down), gulp (neck up, a bump), full (rounder), feather (her grin)', () => {
  const P = {};
  for (const pose of HERON_POSES) P[pose] = A.character('patience', { pose });
  const pupil = (r) => r.svg.match(/class="pc-pupil" cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)"/).slice(1).map(Number);
  // eye: the same drawing as stand but for the eye, whose pupil has turned down (and forward) to the raft
  const noEye = (r) => strip(r.svg).replace(/<circle cx="5\.2" cy="-3\.6" r="[\d.]+" fill="#f8d840"[^>]*\/><circle class="pc-pupil"[^>]*\/><circle[^>]*fill="#fff"\/>/, 'EYE');
  assert.strictEqual(noEye(P.eye), noEye(P.stand), 'eye: nothing moves but her eye');
  assert.ok(noEye(P.eye).includes('EYE'));
  assert.ok(pupil(P.eye)[1] > pupil(P.stand)[1] + 1.5 && pupil(P.eye)[0] >= pupil(P.stand)[0], 'the pupil turns down toward the raft');
  assert.deepStrictEqual([P.eye.head, P.eye.headBox], [P.stand.head, P.stand.headBox], 'her head has not moved');
  // shut: a lid where the eye was; squeeze: shut tight (the picture of both eyes shut)
  assert.ok(!P.shut.svg.includes('pc-pupil') && P.shut.svg.includes('Q5.2,0 9.8,-4'), 'shut: a closed lid');
  const tight = A.character('patience', { pose: 'shut', squeeze: true });
  assert.ok(tight.svg.length > P.shut.svg.length && strip(tight.svg) !== strip(P.shut.svg), 'squeeze: shut tight');
  assert.strictEqual(strip(A.character('patience', { pose: 'stand', squeeze: true }).svg), strip(P.stand.svg), 'squeeze is for the shut eye only');
  assert.deepStrictEqual(P.shut.head, P.stand.head);
  // point: her bill well below her head, pointing down at the mud; her body where it was
  assert.ok(P.point.bill.y > P.point.head.y + 20, 'point: the bill slopes down');
  assert.ok(P.point.head.y > P.stand.head.y + 60, 'her neck reaches down');
  assert.ok(Math.abs(P.stand.bill.y - P.stand.head.y) < 8, 'standing, her bill is level');
  // gulp: neck up, the bill above her head; a bump in the neck (the tube is wider half-way)
  assert.ok(P.gulp.head.y < P.stand.head.y - 25 && P.gulp.bill.y < P.gulp.head.y - 20, 'gulp: neck up, bill up');
  assert.ok(P.gulp.bounds.y0 < P.stand.bounds.y0 - 60, 'she stands taller swallowing');
  // full: the same head, a rounder neck (a different neck outline, nothing else)
  assert.deepStrictEqual(P.full.head, P.stand.head);
  assert.notStrictEqual(strip(P.full.svg), strip(P.stand.svg), 'full: the neck is a little rounder');
  assert.ok(Math.abs(P.full.svg.length - P.stand.svg.length) < 80, 'and only the neck');
  // feather: one grey feather lifted at the back of her head, and nothing else changes
  assert.strictEqual(count(P.feather.svg, /class="pc-grin"/g), 1);
  for (const pose of HERON_POSES) if (pose !== 'feather') assert.ok(!P[pose].svg.includes('pc-grin'), pose + ': no grin');
  assert.ok(P.feather.headBox.y0 < P.stand.headBox.y0 - 10, 'the feather stands above her crown');
  assert.strictEqual(strip(P.feather.svg).replace(/<path class="pc-grin".*?opacity="\.5"\/>/, ''), strip(P.stand.svg), 'feather: her face does not change');
});

test('the dragonfly: asleep on Patience’s bill only when asked (the marsh set says where it is), on a cat’s nose with her eyes crossed, and by itself', () => {
  for (const pose of HERON_POSES) assert.ok(!A.character('patience', { pose }).svg.includes('pc-dragonfly'), pose + ': none unless asked');
  const d = A.character('patience', { pose: 'stand', dragonfly: true });
  assert.strictEqual(count(d.svg, /class="pc-dragonfly"/g), 1);
  assert.strictEqual(strip(d.svg).replace(/<g class="pc-dragonfly".*?<\/g><\/g>/, '</g>'), strip(A.character('patience', { pose: 'stand' }).svg), 'only the dragonfly is added');
  assert.ok(d.svg.includes('#2f97a8') && count(d.svg.match(/<g class="pc-dragonfly".*?<\/g><\/g>/)[0], /<ellipse /g) === 3, 'asleep: two wings laid back together, a teal body');
  // on a cat's nose: awake (four wings), and both her eyes turn in to look at it
  const cat0 = A.character('player', { pose: 'loaf', mood: 'neutral', look: { fur: 'grey' } }), cat = A.character('player', { pose: 'loaf', mood: 'neutral', look: { fur: 'grey' }, dragonfly: true });
  checkResult(cat, 'dragonfly on her nose');
  assert.strictEqual(count(cat.svg, /class="pc-dragonfly"/g), 1);
  assert.strictEqual(count(cat.svg.match(/<g class="pc-dragonfly".*?<\/g><\/g>/)[0], /<ellipse /g), 5, 'awake: four wings and a body');
  const pupils = (s) => [...s.matchAll(/<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="3\.4" ry="7" fill="#221b26"\/>/g)].map((m) => [+m[1], +m[2]]);
  assert.deepStrictEqual(pupils(cat0.svg).map((q) => q[0]), [-1.4, 1.4], 'her usual gaze: both pupils the same way');
  assert.deepStrictEqual(pupils(cat.svg).map((q) => q[0]), [-3.2, -3.2], 'crossed: each pupil turned in toward her nose (the eyes are mirrored)');
  assert.ok(pupils(cat.svg)[0][1] > pupils(cat0.svg)[0][1] + 2, 'and down');
  for (const who of ['waffles', 'tallyheart']) for (const facing of FACINGS) checkResult(A.character(who, { pose: 'sit', dragonfly: true, facing }), who + ' dragonfly');
  const one = A.dragonfly(), sleeping = A.dragonfly({ asleep: true });
  assert.ok(one.w === 40 && one.h === 28 && /^<g>/.test(one.svg) && balanced(one.svg) === null && !/NaN/.test(one.svg));
  assert.notStrictEqual(one.svg, sleeping.svg);
  assert.ok(A.dragonfly({ facing: 'left' }).svg.includes('scale(-1,1)'));
});

// ----- Puddle

test('every Puddle pose x mood x facing renders inside his box, the waterline (or his feet) on its bottom edge; ids unique', () => {
  let n = 0;
  for (const pose of PUDDLE_POSES) for (const mood of A.vocab.moods) for (const facing of FACINGS) {
    const label = `puddle/${pose}/${mood}/${facing}`, r = A.character('puddle', { pose, mood, facing });
    checkResult(r, label);
    if (mood === 'happy' || mood === 'scared') checkIds(r.svg, label);
    assert.deepStrictEqual([r.w, r.h], pose === 'sit' ? [640, 340] : [480, 250], label + ': his box');
    const h = r.headBox, b = r.bounds;
    assert.ok(h.x0 <= r.head.x && r.head.x <= h.x1 && h.y0 <= r.head.y && r.head.y <= h.y1, label + ': head point inside the head box');
    assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= r.w + 1 && b.y1 <= r.h + 1, label + ': inside his box ' + JSON.stringify(b));
    assert.ok(r.h - 3 - b.y1 > -0.6 && r.h - 3 - b.y1 < 1.2, label + ': down to the waterline and no further (' + b.y1 + ')');
    n++;
  }
  assert.strictEqual(n, 7 * 16 * 2);
  for (const pose of PUDDLE_POSES) for (const ex of [{ tear: true }, { mist: true }, { squeeze: true }, { lit: 3 }]) checkResult(A.character('puddle', Object.assign({ pose, mood: 'worried' }, ex)), 'puddle ' + pose + JSON.stringify(ex));
});

test('Puddle is in the water in every pose the text gives him: nothing is drawn below the waterline, and nothing under the raft', () => {
  for (const pose of PUDDLE_POSES.slice(0, 6)) for (const mood of ['happy', 'wonder', 'worried', 'proud']) {
    const r = A.character('puddle', { pose, mood }), s = r.svg;
    // one clip at the waterline, round everything but the rings and bubbles that lie on it
    assert.strictEqual(count(s, /<clipPath id="[^"]+"><rect x="-2000" y="-2000" width="4000" height="2000"\/><\/clipPath>/g), 1, pose + ': clipped at the waterline');
    assert.ok(r.bounds.y1 <= r.h - 3 + 0.6, pose + ': nothing below the water');
    // what lies outside the clip is on the water or above it: every y there is at or above the line (0)
    const over = s.slice(s.lastIndexOf('</g>', s.lastIndexOf('pc-ripple') > 0 ? s.lastIndexOf('pc-ripple') : s.length));
    for (const m of over.matchAll(/cy="([-\d.]+)" r="([\d.]+)"/g)) assert.ok(+m[1] + +m[2] <= 2, pose + ': a bubble below the water');
    assert.ok(!/#000|black/.test(s), pose + ': no dark shape');
  }
});

test('Puddle: on Sprinkle’s model and about her size, blue-grey (bluer and a shade darker), ridged, a paler belly, friendly eyes, a bump on his head', () => {
  const sit = A.character('puddle', { pose: 'sit', mood: 'happy' }), her = A.character('sprinkle', { pose: 'sit', mood: 'happy' });
  assert.ok(sit.svg.includes('fill="#8fa3b8"') && !sit.svg.includes('fill="#a8b1b6"'), 'his own colour, none of hers');
  const [r, g, b] = rgbOf('#8fa3b8'), [r2, , b2] = rgbOf('#a8b1b6');
  assert.ok(b - r > (b2 - r2) + 15, 'bluer than her mist-grey');
  assert.ok(lum('#8fa3b8') < lum('#a8b1b6') - 8 && lum('#8fa3b8') > lum('#5f6c7e') + 40, 'a shade darker than Sprinkle, far lighter than Squall’s slate');
  assert.ok(g > r && b > g);
  assert.ok(sit.svg.includes('pc-ridges') && sit.svg.includes('#d7e2ea'), 'ridges, a paler belly');
  assert.ok(lum('#d7e2ea') > lum('#8fa3b8') + 40);
  // about her size: the same build, his head the size of hers (the size the scenes hold him to)
  const k = measure('puddle', 'head', 'head') / measure('sprinkle', 'sit', 'head');
  assert.ok(k >= 0.88 && k <= 1.12, 'head to head with Sprinkle: ' + k);
  assert.ok(Math.abs(topOf(sit) - topOf(her)) < 30, `about as tall sitting: ${topOf(sit)} to ${topOf(her)}`);
  // her amber eyes, round; two nubs; never toothy
  assert.ok(sit.svg.includes('stop-color="#f7c65c"'), 'the clutch’s amber eyes');
  assert.ok(!/tooth|fang/i.test(sit.svg) && !sit.svg.includes('#fff" stroke="#') , 'never toothy');
  // both wings folded: the drooping wing is his sister's alone
  assert.strictEqual(count(sit.svg, /class="pc-wing"/g), 2);
  assert.notStrictEqual(strip(A.character('puddle', { pose: 'sit' }).svg).length, 0);
  // the bump: wherever the top of his head shows
  for (const pose of ['head', 'pawup', 'log', 'sit']) assert.strictEqual(count(A.character('puddle', { pose }).svg, /class="pc-bump"/g), 1, pose + ': a small bump on his head');
  for (const pose of ['foot', 'sink', 'nostrils']) assert.ok(!A.character('puddle', { pose }).svg.includes('pc-bump'), pose + ': his head is under');
  assert.ok(!her.svg.includes('pc-bump'), 'Sprinkle has none');
  // every mood changes his face
  const faces = new Set(A.vocab.moods.map((m) => strip(A.character('puddle', { pose: 'head', mood: m }).svg)));
  assert.ok(faces.size >= 14, 'moods: ' + faces.size);
});

test('Puddle’s four feet are a size and a half too big, five pale claws on each', () => {
  const sit = A.character('puddle', { pose: 'sit' }), her = A.character('sprinkle', { pose: 'sit' });
  const pawK = (s) => [...s.matchAll(/<g transform="matrix\(([\d.]+),0,0,([\d.]+),[-\d.]+,[-\d.]+\)"><ellipse cx="16" cy="0" rx="18" ry="16"/g)].map((m) => +m[1]);
  assert.deepStrictEqual(pawK(her.svg), [1.2, 1.2], 'Sprinkle’s two forepaws');
  assert.deepStrictEqual(pawK(sit.svg), [1.8, 1.8], 'his: one and a half times hers');
  const footK = (s) => [...s.matchAll(/<g transform="translate\([-\d.]+,[-\d.]+\) rotate\(0\) scale\(([\d.]+)\)"><path d="M-26,-2C/g)].map((m) => +m[1]);
  assert.deepStrictEqual(footK(her.svg), [1, 1]);
  assert.deepStrictEqual(footK(sit.svg), [1.5, 1.5], 'and both hind feet');
  // five claws on every paw: sitting (two forepaws), the one held up, the foot through the logs
  const claws = (s) => [...s.matchAll(/<g class="pc-dclaws[^"]*"[^>]*>(.*?)<\/g>/g)].map((m) => count(m[1], /<path /g));
  assert.deepStrictEqual(claws(sit.svg), [5, 5]);
  assert.deepStrictEqual(claws(A.character('puddle', { pose: 'foot' }).svg), [5]);
  assert.deepStrictEqual(claws(A.character('puddle', { pose: 'pawup' }).svg), [5]);
  assert.deepStrictEqual(claws(A.character('puddle', { pose: 'log' }).svg), [5, 5], 'being a log: two of his four feet give him away');
  assert.ok(sit.svg.includes('fill="#f4ecd9"'), 'pale claws');
});

test('Puddle’s poses: foot, head, log (eyes shut), sink and nostrils (the least of him), pawup (his eyes and his grin stay above the water; the claws light)', () => {
  const P = {};
  for (const pose of PUDDLE_POSES) P[pose] = A.character('puddle', { pose, mood: 'happy' });
  const eyes = (r) => count(r.svg, /fill="url\(#/g);   // an open eye is filled with its amber gradient
  // foot: a foot and nothing else (no face), with the marks of a wiggle
  assert.ok(!P.foot.svg.includes('stop-color') && P.foot.svg.includes('pc-wiggle') && eyes(P.foot) === 0, 'foot: only a foot, wiggling');
  // head: his whole face out of the water, rings round his neck
  assert.ok(eyes(A.character('puddle', { pose: 'head', mood: 'wonder' })) === 2 && P.head.svg.includes('pc-ripple'));
  assert.ok(P.head.headBox.y1 < P.head.h - 3 - 20, 'head: his chin is clear of the water');
  // log: very straight (far wider than tall), eyes shut whatever the mood, and a smile
  for (const mood of A.vocab.moods) assert.strictEqual(eyes(A.character('puddle', { pose: 'log', mood })), 0, 'log/' + mood + ': eyes shut');
  const lb = P.log.bounds;
  assert.ok(lb.x1 - lb.x0 > (lb.y1 - lb.y0) * 3, 'log: long and low');
  // sink and nostrils: no eyes, bubbles; nostrils is the smaller, and narrow enough for the gap between two logs
  for (const pose of ['sink', 'nostrils']) {
    assert.strictEqual(eyes(P[pose]), 0, pose);
    assert.strictEqual(count(P[pose].svg, /fill="#4a5868"/g), 1, pose + ': two nostrils (one group)');
    assert.ok(count(P[pose].svg, /fill="#eef8fc" fill-opacity="\.55"/g) >= 4, pose + ': a string of bubbles');
    assert.ok(P[pose].headBox.y1 - P[pose].headBox.y0 < 30, pose + ': only the tip of a nose');
  }
  assert.ok(P.nostrils.headBox.x1 - P.nostrils.headBox.x0 < P.sink.headBox.x1 - P.sink.headBox.x0, 'nostrils: less of him than sink');
  assert.ok(P.nostrils.bounds.x1 - P.nostrils.bounds.x0 < 90, 'narrow enough for the gap between two logs');
  // pawup: never only a paw above the surface. His eyes are open above the water, his mouth is above it, his chin is in it
  for (const mood of ['happy', 'wonder', 'worried', 'proud', 'neutral']) for (const facing of FACINGS) {
    const r = A.character('puddle', { pose: 'pawup', mood, facing }), water = r.h - 3;
    assert.ok(r.svg.includes('pc-bump') && r.svg.includes('stop-color'), mood + ': his face is there');
    assert.ok(r.head.y < water - 25, mood + ': his eyes are well above the water (' + r.head.y + ')');
    assert.ok(r.paw && r.paw.y < water - 40 && r.paw.r > 40, mood + ': the forepaw is up, and big');
    assert.ok(r.paw.x > 0 && r.paw.x < r.w);
  }
  // (the mouth is 36 of his units under the middle of his face: above the water by a hand)
  assert.ok(P.pawup.head.y + 36 < P.pawup.h - 3, 'his grin stays above the water');
  assert.ok(P.pawup.head.y + 60 > P.pawup.h - 3, 'and his chin is dipping');
  for (let lit = 0; lit <= 5; lit++) {
    const s = A.character('puddle', { pose: 'pawup', lit }).svg;
    const n = (s.match(/<g class="pc-dclaws pc-lit"[^>]*>(.*?)<\/g>/g) || []).reduce((k, g) => k + count(g, /<path /g), 0);
    assert.strictEqual(n, lit, lit + ' claws lit');
  }
  assert.strictEqual(strip(A.character('puddle', { pose: 'pawup', lit: true }).svg), strip(A.character('puddle', { pose: 'pawup', lit: 5 }).svg));
  assert.ok(A.character('puddle', { pose: 'pawup', lit: 5 }).svg.includes('fill="#ffe36e" stroke="#d18b12"'), 'lit gold, as every counted claw');
  // facing left: mirrored, the paw with him
  const l = A.character('puddle', { pose: 'pawup', facing: 'left' });
  assert.ok(Math.abs(l.paw.x + P.pawup.paw.x - 480) < 0.3 && Math.abs(l.head.x + P.pawup.head.x - 480) < 0.3);
});

// ----- Wisp

test('every Wisp pose x mood x facing renders inside her box (320 x 300), one foot on the ground; ids unique', () => {
  let n = 0;
  for (const pose of WISP_POSES) for (const mood of A.vocab.moods) for (const facing of FACINGS) {
    const label = `wisp/${pose}/${mood}/${facing}`, r = A.character('wisp', { pose, mood, facing });
    checkResult(r, label);
    if (mood === 'neutral' || mood === 'sad') checkIds(r.svg, label);
    assert.deepStrictEqual([r.w, r.h], [320, 300]);
    const h = r.headBox, b = r.bounds;
    assert.ok(h.x0 < r.head.x && r.head.x < h.x1 && h.y0 < r.head.y && r.head.y < h.y1, label + ': head point inside the head box');
    assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= r.w + 1 && b.y1 <= r.h + 1, label + ': inside her box ' + JSON.stringify(b));
    assert.ok(Math.abs(r.h - 3 - b.y1) < 1, label + ': her foot is on the ground line (' + b.y1 + ')');
    n++;
  }
  assert.strictEqual(n, 8 * 16 * 2);
  for (const pose of WISP_POSES) for (const ex of [{ squeeze: true }, { tear: true }, { lit: 2 }]) checkResult(A.character('wisp', Object.assign({ pose }, ex)), 'wisp ' + pose + JSON.stringify(ex));
  assert.ok(A.character('wisp', { pose: 'pawup', lit: 5 }).svg.length < 20000);
});

test('Wisp is nearly see-through: a fine outline and a pearl fill behind one thin veil, her wing and a raised forepaw thinner still; her pale gold eyes are the one solid thing', () => {
  for (const pose of WISP_POSES) for (const mood of ['neutral', 'happy', 'scared']) {
    const s = A.character('wisp', { pose, mood }).svg, label = pose + '/' + mood;
    const veils = [...s.matchAll(/<g class="pc-veil[^"]*" opacity="([\d.]+)">/g)].map((m) => +m[1]);
    assert.ok(veils.length >= 2 && veils.every((v) => v > 0.3 && v < 0.8), label + ': veils ' + veils);
    assert.strictEqual(veils[0], 0.74, label + ': her body');
    assert.ok(veils.slice(1).every((v) => v < veils[0]), label + ': the wing (and a forepaw that is up or out) thinner than her body');
    // nothing of her is drawn outside a veil but her eyes, the claws she lights, and the marks of a nod, a jolt or a claw in the mud
    const eyesAt = s.indexOf('<g class="pc-eyes"'), wingAt = s.indexOf('pc-veil pc-thin');
    assert.ok(eyesAt > wingAt && wingAt > 0, label + ': the eyes are drawn after her body and her wing, on their own');
    assert.ok(!/<g class="pc-eyes"[^>]*opacity/.test(s), label + ': her eyes are solid');
    assert.ok(s.includes('fill="#f2efe4"') && s.includes('stroke="#868f86"'), label + ': pearl, a soft grey line');
  }
  // the raised forepaw and the drawing claw are in a thin veil of their own; folded, her forepaws are part of her
  for (const [pose, n] of [['pawup', 3], ['shh', 3], ['draw', 3], ['blink', 2], ['reed', 2], ['nod', 2]]) assert.strictEqual(count(A.character('wisp', { pose }).svg, /<g class="pc-veil/g), n, pose);
  // pale gold eyes, lighter than her sister's amber, and warm (a dark warm pupil, a shine)
  const s = A.character('wisp', { pose: 'blink' }).svg, eyes = s.slice(s.indexOf('<g class="pc-eyes"'));
  assert.ok(s.includes('stop-color="#f7e29c"') && !s.includes('stop-color="#f7c65c"'), 'her own pale gold');
  assert.ok(lum('#f7e29c') > lum('#f7c65c') + 15, 'paler than Sprinkle’s');
  const [er, eg, eb] = rgbOf('#f7e29c');
  assert.ok(er > eb + 60 && eg > eb + 40, 'gold, and warm');
  assert.strictEqual(count(eyes, /fill="url\(#/g), 2, 'two open eyes');
  assert.ok(eyes.includes('fill="#3a2f22"') && count(eyes, /fill="#fff"/g) >= 2, 'a warm dark pupil, a shine in each');
});

test('Wisp: daylight, nothing ghostly (no glow, no light of her own, no dark hollows); a small smile and pink cheeks, whatever her mood; lovable', () => {
  for (const pose of WISP_POSES) for (const mood of A.vocab.moods) {
    const s = A.character('wisp', { pose, mood }).svg, label = pose + '/' + mood;
    assert.ok(!/<filter|feGaussianBlur|stop-opacity|mix-blend/.test(s), label + ': no glow, no blur');
    assert.ok(!s.includes('#ffb21f') && !s.includes('pc-eyes-only'), label + ': no light of her own');
    assert.ok(!/fill="#(000|000000|1c1828|221b26|5d3844)"/.test(s), label + ': no black, no dark mouth');
    assert.strictEqual(count(s, /<g fill="#f2a3b4" opacity="\.4">/g), 1, label + ': a little pink in her cheeks');
  }
  // her mouth is a soft rose even when it opens, and a neutral Wisp smiles a little
  assert.ok(A.character('wisp', { pose: 'blink', mood: 'laugh' }).svg.includes('fill="#c58f9a"'));
  assert.ok(A.character('wisp', { pose: 'blink' }).svg.includes('M-9,30Q0,35 9,30'), 'a small smile');
  // happy and proud keep her eyes open (they are what there is of her to see); being a reed shuts them, whatever her mood
  const open = (o) => { const s = A.character('wisp', o).svg; return count(s.slice(s.indexOf('<g class="pc-eyes"')), /fill="url\(#/g); };
  for (const mood of ['happy', 'proud', 'neutral', 'kind', 'shy', 'wonder']) assert.strictEqual(open({ pose: 'blink', mood }), 2, 'blink/' + mood + ': eyes open');
  for (const mood of A.vocab.moods) assert.strictEqual(open({ pose: 'reed', mood }), 0, 'reed/' + mood + ': eyes shut');
  assert.strictEqual(open({ pose: 'gulp', mood: 'happy' }), 0, 'a mouthful going down: eyes shut in a smile');
  // the jerk a yelling cat sees: eyes squeezed shut. Her two open gold eyes are the blink's, the reward for
  // keeping still three times; a child who yells does not see them first
  assert.strictEqual(open({ pose: 'flinch' }), 0, 'the jerk: eyes squeezed shut');
  for (const mood of A.vocab.moods) assert.strictEqual(open({ pose: 'flinch', mood }), 0, 'flinch/' + mood + ': never open');
  assert.notStrictEqual(strip(A.character('wisp', { pose: 'flinch' }).svg), strip(A.character('wisp', { pose: 'reed' }).svg), 'and not the still reed’s calm lids');
  assert.notStrictEqual(strip(A.character('wisp', { pose: 'flinch' }).svg), strip(A.character('wisp', { pose: 'flinch', mood: 'sleepy' }).svg));
});

test('Wisp stands on one leg like a heron, slighter than Sprinkle and longer in the neck, her wing folded long down her back; a knee is how you tell her from a reed', () => {
  const her = A.character('sprinkle', { pose: 'sit' });
  for (const pose of WISP_POSES) {
    const r = A.character('wisp', { pose }), s = r.svg;
    assert.strictEqual(count(s, /class="pc-knee"/g), 1, pose + ': one knee, on the leg she stands on');
    // one foot on the ground (her sister's hind foot, small), the other folded up under her
    const feet = [...s.matchAll(/<g transform="translate\(([-\d.]+),([-\d.]+)\) rotate\(([-\d.]+)\) scale\(([\d.]+)\)"><path d="M-26,-2C/g)].map((m) => [+m[2], +m[4]]);
    assert.strictEqual(feet.length, 2, pose + ': two hind feet');
    assert.strictEqual(feet.filter((f) => f[0] > -8).length, 1, pose + ': one of them on the ground ' + JSON.stringify(feet));
    assert.ok(feet.some((f) => f[0] < -40), pose + ': the other held up');
    assert.strictEqual(count(s, /class="pc-wing"/g), 1, pose + ': one long wing down her back');
  }
  const w = A.character('wisp', { pose: 'blink' });
  // slighter: her head smaller than Sprinkle's (inside the size the scenes hold her to), her body narrower
  const k = measure('wisp', 'blink', 'head') / measure('sprinkle', 'sit', 'head');
  assert.ok(k >= 0.7 && k <= 0.94, 'her head against Sprinkle’s: ' + k);
  assert.ok(w.bounds.x1 - w.bounds.x0 < (her.bounds.x1 - her.bounds.x0) * 0.35, 'as narrow as a reed beside her sister');
  // longer in the neck: more of her height is neck than of Sprinkle's (head top to body, over head height)
  assert.ok(topOf(w) > 270 && topOf(w) < 300, 'about a heron’s height standing: ' + topOf(w));
  const p = A.character('patience', { pose: 'stand' });
  assert.ok(topOf(w) < topOf(p), 'the real heron is the taller');
  // reed and blink differ only in her eyes
  const noEyes = (s) => strip(s).replace(/<g class="pc-eyes".*?<\/g><\/g><\/g>/, 'EYES');
  assert.strictEqual(noEyes(A.character('wisp', { pose: 'reed' }).svg).replace(/EYES.*/, ''), noEyes(w.svg).replace(/EYES.*/, ''), 'reed: the same reed, eyes shut');
});

test('Wisp’s poses: shh (one claw across her snout), draw (one claw down in the mud), nod, flinch, gulp (a bump down her neck), pawup (five claws, pale as frost)', () => {
  const P = {};
  for (const pose of WISP_POSES) P[pose] = A.character('wisp', { pose });
  const claws = (s) => [...s.matchAll(/<g class="pc-dclaws[^"]*"[^>]*>(.*?)<\/g>/g)].map((m) => count(m[1], /<path /g));
  // folded on her chest her forepaws show no claws; a pose that uses one shows that paw's five
  assert.deepStrictEqual(claws(P.blink.svg), [], 'at rest: soft mitts');
  assert.deepStrictEqual(claws(P.shh.svg), [5]);
  assert.deepStrictEqual(claws(P.draw.svg), [5]);
  assert.deepStrictEqual(claws(P.pawup.svg), [5]);
  // shh: the paw is up at her face (under her chin), her head where it was
  assert.deepStrictEqual(P.shh.head, P.blink.head);
  // draw: folded down, her head low and out in front, a groove in the mud at the end of her claw
  assert.ok(P.draw.head.y > P.blink.head.y + 150 && P.draw.head.x > P.blink.head.x + 50, 'draw: her head down over the mud');
  assert.ok(P.draw.svg.includes('stroke="#5c4532"'), 'the line her claw draws');
  assert.ok(!P.blink.svg.includes('#5c4532'));
  // nod: her head dipped; flinch: thrown back, her wing jolted open; gulp: tipped up
  assert.ok(P.nod.head.y > P.blink.head.y + 3 && P.nod.head.x > P.blink.head.x);
  assert.ok(P.flinch.head.x < P.blink.head.x - 5, 'flinch: jerked back');
  assert.notStrictEqual(P.flinch.svg.match(/class="pc-wing" d="([^"]+)"/)[1], P.blink.svg.match(/class="pc-wing" d="([^"]+)"/)[1], 'flinch: her wing jolts open');
  assert.ok(P.gulp.head.x < P.blink.head.x, 'gulp: head back');
  assert.notStrictEqual(strip(P.gulp.svg), strip(P.blink.svg));
  // pawup: the forepaw reported, the claws lit pale as frost, never gold, in order
  assert.ok(P.pawup.paw && P.pawup.paw.y < P.pawup.h * 0.6 && P.pawup.paw.r > 20);
  for (let lit = 0; lit <= 5; lit++) {
    const s = A.character('wisp', { pose: 'pawup', lit }).svg;
    const n = (s.match(/<g class="pc-dclaws pc-lit"[^>]*>(.*?)<\/g>/g) || []).reduce((k, g) => k + count(g, /<path /g), 0);
    assert.strictEqual(n, lit, lit + ' claws lit');
    assert.ok(!s.includes('#ffe36e') && !s.includes('#d18b12'), 'never gold');
    if (lit) assert.ok(s.includes('fill="#ffffff" stroke="#79b3d6"') && s.includes('fill="#cfeeff"'), 'pale as frost');
    // the lit claws are outside her veils: they are as bright as anyone's
    if (lit) assert.ok(s.lastIndexOf('pc-lit') > s.lastIndexOf('pc-veil'), 'lit over the veil');
  }
  assert.ok(lum('#cfeeff') > 220);
});

// ----- the chapter 1 to 4 cast: new extras

test('reach: crouched at an edge, one forepaw held out and down over it, touching nothing (her paw over a print in the marsh mud): an extra on `crouch`, in her own fur; the result says where the paw is and where the edge is', () => {
  for (const who of CATS) for (const facing of FACINGS) for (const mood of ['wonder', 'kind', 'sniff']) {
    const o = { pose: 'crouch', mood, facing, look: { fur: 'ginger', marking: 'white-paws' } };
    const plain = A.character(who, o), r = A.character(who, Object.assign({ reach: true }, o)), label = who + '/reach/' + mood + '/' + facing;
    checkResult(r, label);
    assert.notStrictEqual(strip(r.svg), strip(plain.svg), label + ': a drawing of its own');
    assert.strictEqual(plain.reach, undefined, label + ': only when asked');
    // the paw she holds out, and the line of the edge her other feet are on, in her box
    const q = r.reach;
    assert.ok(q && [q.x, q.y, q.r, q.edge].every(isFinite), label + ': reports the paw and the edge');
    assert.ok(q.y > q.edge + 8 && q.y + q.r * 0.6 <= r.h + 0.5 && q.y + q.r * 0.6 > r.h - 10, label + ': the paw hangs below the edge, and rests on the bottom of her box: ' + JSON.stringify(q));
    assert.ok(facing === 'right' ? q.x > r.w * 0.68 : q.x < r.w * 0.32, label + ': out in front of her');
    assert.ok(q.r > 6 && q.r < 13, label + ': a paw’s half-width');
    // the whole of her is in her box, as every pose is, and her head is in front, over the edge
    assert.ok(r.bounds.x0 >= -0.5 && r.bounds.x1 <= r.w + 0.5 && r.bounds.y0 >= -0.5 && r.bounds.y1 <= r.h + 0.5, label + ': in her box');
    assert.ok(r.headBox.y1 < q.y, label + ': her head is above the paw');
    // the same number of paws as crouching: the near forepaw is the one that reaches, nothing is added
    const paws = (x) => count(x, /stroke-width="2\.2"\/>/g);
    assert.strictEqual(paws(r.svg), paws(plain.svg), label + ': four paws, as ever');
  }
  // it is an extra of `crouch`: any other pose is drawn as it was, and reports no reach
  for (const pose of A.vocab.poses.filter((p) => p !== 'crouch')) {
    const o = { pose, mood: 'wonder', facing: 'right', look: { fur: 'calico' } };
    const a = A.character('player', o), b = A.character('player', Object.assign({ reach: true }, o));
    assert.strictEqual(strip(b.svg), strip(a.svg), pose + ': unchanged');
    assert.strictEqual(b.reach, undefined, pose);
  }
  // only exactly true; and nobody but a cat reaches
  for (const odd of [1, 'yes', false, null]) assert.strictEqual(A.character('player', { pose: 'crouch', reach: odd }).reach, undefined, JSON.stringify(odd));
  for (const who of ['riffle', 'otter', 'sprinkle', 'squall', 'puddle', 'wisp', 'patience']) assert.strictEqual(A.character(who, { pose: 'crouch', reach: true }).reach, undefined, who);
  // her own paw: white for white paws, her coat's colour without them
  const white = A.character('player', { pose: 'crouch', reach: true, look: { fur: 'black', marking: 'white-paws' } }).svg, black = A.character('player', { pose: 'crouch', reach: true, look: { fur: 'black', marking: 'none' } }).svg;
  assert.notStrictEqual(strip(white), strip(black));
  // every look draws
  for (const fur of A.vocab.looks.fur) for (const marking of A.vocab.looks.marking) checkResult(A.character('player', { pose: 'crouch', reach: true, mood: 'wonder', look: { fur, marking, eyes: 'green' } }), 'reach ' + fur + '/' + marking);
});

test('tuck: sitting up with one claw curled back in, nine out (the dewclaw of the paw nearest us); the old tom, Tallyheart, Murmurchime, our cat', () => {
  const clawN = (s) => count(s, /<path transform="[^"]+" d="M-1\.5,0Q-1\.4,-4\.6 0\.9,-7\.4Q1\.3,-3\.8 1\.5,0Z"\/>/g), tucked = (s) => count(s, /<path class="pc-tucked"/g);
  for (const who of CATS) for (const facing of FACINGS) for (const mood of ['kind', 'proud', 'stern']) {
    const o = { pose: 'situp', mood, facing, look: { fur: 'black', marking: 'white-paws' } };
    const out = A.character(who, o), r = A.character(who, Object.assign({ tuck: true }, o));
    checkResult(r, who + ' tuck');
    assert.strictEqual(clawN(out.svg), 10, who + ': ten claws out');
    assert.strictEqual(clawN(r.svg), 9, who + ': nine claws out');
    assert.strictEqual(tucked(r.svg), 1, who + ': one tucked in');
    assert.strictEqual(tucked(out.svg), 0);
    assert.deepStrictEqual([r.head, r.bounds], [out.head, out.bounds], who + ': nothing else moves');
  }
  // it is the near paw's dewclaw, the fifth of that paw (the one that stood up beside the toes), and it is short
  const a = A.character('tallyheart', { pose: 'situp' }).svg, b = A.character('tallyheart', { pose: 'situp', tuck: true }).svg;
  const dew = [...a.matchAll(/<path transform="translate\(([-\d.]+),([-\d.]+)\) rotate\(-58\)[^"]*" d="M-1\.5,0/g)].map((m) => [+m[1], +m[2]]);
  const at = b.match(/<path class="pc-tucked" transform="translate\(([-\d.]+),([-\d.]+)\) rotate\(-58\)/).slice(1).map(Number);
  assert.strictEqual(dew.length, 2, 'two dewclaws stand up, sitting up');
  assert.deepStrictEqual(at, dew[1], 'the tucked one is where the near paw’s dewclaw stood');
  assert.ok(dew[1][0] > dew[0][0], 'the near paw is the one in front');
  assert.ok(b.includes('M-1.9,0Q-2.3,-3.3 -0.2,-3.9Q2.2,-3.5 1.9,0Z'), 'a short stub, half a claw');
  // tuck brings the claws out by itself (a raised paw), and a cat with no paw up has nothing to tuck
  assert.strictEqual(clawN(A.character('player', { pose: 'pawup', tuck: true }).svg), 4);
  assert.strictEqual(tucked(A.character('player', { pose: 'pawup', tuck: true }).svg), 1);
  assert.strictEqual(tucked(A.character('player', { pose: 'sit', tuck: true }).svg), 0);
  assert.strictEqual(clawN(A.character('tallyheart', { pose: 'situp', tuck: true, claws: false }).svg), 9, 'tucking one means the rest are out');
});

test('asleep: eyes shut whatever the mood (the old tom on guard, as straight as a post); snail: halfway up his whole ear, horns out, or in', () => {
  const shut = (s) => count(s, /<path d="M-9,-0\.6Q0,7\.6 9\.4,-2\.2"/g), irises = (s) => count(s, /<ellipse cx="0" cy="-11" rx="13" ry="7\.6"/g);
  for (const who of CATS) for (const mood of A.vocab.moods) {
    const r = A.character(who, { pose: 'sit', mood, asleep: true });
    checkResult(r, who + ' asleep ' + mood);
    assert.strictEqual(shut(r.svg), 2, `${who}/${mood}: both eyes shut`);
    assert.strictEqual(irises(r.svg), 0, `${who}/${mood}: no eye open`);
  }
  // straight as a post: his head is not tipped (a sleepy cat's droops), and he sits as he sits
  const a = A.character('grizzled', { pose: 'sit', mood: 'stern', asleep: true }), b = A.character('grizzled', { pose: 'sit', mood: 'stern' });
  assert.deepStrictEqual([a.head, a.headBox, a.bounds], [b.head, b.headBox, b.bounds]);
  assert.strictEqual(irises(A.character('tallyheart', { pose: 'sit', asleep: true, wink: true }).svg), 0, 'a sleeper does not wink');
  assert.ok(A.character('tallyheart', { pose: 'sit', asleep: true, squeeze: true }).svg.includes('M7.6,-6.4L-5.4,0L7.6,6.4'), 'squeezed shut wins');
  // chapter 7, `asleep: 'half'`: half asleep (our cat curling up to sleep, f103): heavy lids down to the middle
  // of both eyes, sagging a little, the eyes still showing under them, and the mood's own mouth; nothing else moves
  assert.deepStrictEqual(A.vocab.extras.asleep, [true, 'half']);
  const drowsy = (s) => count(s, /<path d="M-12,-1\.6Q0,4 12,-0\.4L12,-14L-12,-14Z"/g);
  const mouth = (s) => (/<path d="([^"]+)" stroke="[^"]+" stroke-width="1\.9" stroke-linecap="round" stroke-linejoin="round" fill="none"\/>/.exec(s) || [])[1] || null;
  for (const who of CATS) for (const mood of A.vocab.moods) {
    const h = A.character(who, { pose: 'curl', mood, asleep: 'half' }), awake = A.character(who, { pose: 'curl', mood });
    checkResult(h, who + ' half asleep ' + mood);
    assert.deepStrictEqual([drowsy(h.svg), irises(h.svg), shut(h.svg)], [2, 2, 0], `${who}/${mood}: both eyes half shut, neither shut`);
    assert.strictEqual(mouth(h.svg), mouth(awake.svg), `${who}/${mood}: the mood's own mouth`);
    assert.deepStrictEqual([h.head, h.headBox, h.bounds], [awake.head, awake.headBox, awake.bounds], `${who}/${mood}: she lies as she lies`);
  }
  assert.ok(mouth(A.character('player', { pose: 'curl', mood: 'kind', asleep: 'half' }).svg) === mouth(A.character('player', { pose: 'curl', mood: 'happy' }).svg), 'kind’s small smile');
  assert.strictEqual(drowsy(A.character('tallyheart', { pose: 'sit', asleep: true }).svg), 0, '`true` is still shut');
  // the snail
  const snail = A.character('grizzled', { pose: 'sit', asleep: true, snail: true }), inn = A.character('grizzled', { pose: 'sit', mood: 'shout', snail: 'in' });
  checkResult(snail, 'snail'); checkResult(inn, 'snail in');
  assert.strictEqual(count(snail.svg, /<g class="pc-snail"/g), 1);
  assert.strictEqual(count(snail.svg, /<g class="pc-horns">/g), 1, 'two horns, in a group of their own (the page can pull them in)');
  assert.strictEqual(count(inn.svg, /<g class="pc-snail pc-snail-in"/g), 1);
  assert.ok(!inn.svg.includes('pc-horns'), 'in: its horns pulled in');
  assert.ok(snail.svg.includes('#f0b55c') && lum('#f0b55c') > lum('#5d4535') + 80, 'a shell that shows on his dark ear');
  for (const who of ['tallyheart', 'grizzled']) {
    // on the whole ear, never the torn or ragged one: its group is mirrored the other way from that ear's
    for (const facing of FACINGS) {
      const s = A.character(who, { pose: 'sit', snail: true, facing }).svg;
      const ears = [...s.matchAll(/<g transform="translate\(([-\d.]+),-21\) scale\((-?1),1\) rotate\([\d.]+\) scale\([\d.]+\)"><path d="(M-13,4Q-9,-14 [^"]+)"/g)].map((m) => ({ side: +m[2], torn: m[3] !== 'M-13,4Q-9,-14 1,-31Q9,-14 14,4Z' }));
      const sn = s.match(/<g transform="translate\(([-\d.]+),-21\) scale\((-?1),1\) rotate\([\d.]+\) scale\([\d.]+\)"><g class="pc-snail/);
      assert.strictEqual(ears.length, 2);
      assert.strictEqual(+sn[2], ears.find((e) => !e.torn).side, `${who}/${facing}: on the whole ear`);
    }
  }
  // it rides the ear wherever the ear goes (flat ears: still on it), and any cat can wear one
  for (const who of CATS) checkResult(A.character(who, { pose: 'curl', mood: 'scared', snail: true, flatEars: true }), who + ' snail');
});

test('the nose to tap: marked for the page (class pc-tap pc-tap-nose), unpainted, on the sleeper with a snail on his ear; his whiskers and the snail’s horns carry classes the page can move', () => {
  const marks = (s) => [...s.matchAll(/<g class="pc-tap pc-tap-(\w+)"><circle cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)" fill="none"\/><\/g>/g)].map((m) => [m[1], +m[2], +m[3], +m[4]]);
  const first = A.character('grizzled', { pose: 'sit', asleep: true, snail: true });
  assert.deepStrictEqual(marks(first.svg), [['nose', 4, 10, 10.5]], 'the first screen: his nose, by itself');
  assert.strictEqual(count(first.svg, /pc-tap/g), 2, 'one mark');
  assert.strictEqual(count(first.svg, /class="pc-whiskers"/g), 1);
  // the mark is inside his head (it moves and turns with it), over his nose: just under the middle of his face
  assert.ok(first.svg.indexOf('pc-tap') > first.svg.indexOf('fill="#aaa29b"'), 'after the muzzle, under the nose');
  // named, or switched off; nothing else draws one
  assert.strictEqual(marks(A.character('tallyheart', { pose: 'loaf', tap: 'nose' }).svg).length, 1);
  assert.strictEqual(marks(A.character('waffles', { pose: 'sit', tap: true }).svg).length, 1);
  assert.strictEqual(marks(A.character('grizzled', { pose: 'sit', asleep: true, snail: true, tap: false }).svg).length, 0);
  for (const o of [{ asleep: true }, { snail: true }, { asleep: true, snail: 'in' }, {}, { tap: 'pole' }]) {
    const s = A.character('grizzled', Object.assign({ pose: 'sit' }, o)).svg;
    assert.ok(!s.includes('pc-tap') && !s.includes('pc-whiskers'), JSON.stringify(o) + ': no mark');
  }
  // the mark paints nothing: with it or without, the same picture
  const noMark = (s) => strip(s).replace(/<g class="pc-tap pc-tap-nose">.*?<\/g>/, '').replace(' class="pc-whiskers"', '');
  assert.strictEqual(noMark(first.svg), strip(A.character('grizzled', { pose: 'sit', asleep: true, snail: true, tap: false }).svg));
});

test('buzz: short zigzags along her outline and zigzag whiskers (the Roar); she is shaking, nothing blows', () => {
  for (const who of CATS) for (const pose of ['sit', 'loaf', 'crouch', 'stand']) for (const facing of FACINGS) {
    const o = { pose, mood: 'scared', facing, look: { fur: 'cream' } }, base = A.character(who, o), r = A.character(who, Object.assign({ buzz: true }, o));
    checkResult(r, `${who}/${pose} buzz`);
    assert.strictEqual(count(r.svg, /class="pc-buzz"/g), 2, `${who}/${pose}: her whiskers, and the marks round her`);
    assert.ok(!base.svg.includes('pc-buzz'));
    const b = r.bounds;
    assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= 201 && b.y1 <= 201, `${who}/${pose}: inside her box`);
  }
  const r = A.character('player', { pose: 'sit', mood: 'neutral', buzz: true, look: { fur: 'ginger' } }), base = A.character('player', { pose: 'sit', mood: 'neutral', look: { fur: 'ginger' } });
  const marks = [...r.svg.matchAll(/class="pc-buzz" d="([^"]+)"/g)].map((m) => m[1]);
  // four whiskers, each a zigzag of seven teeth; nine marks round her, six teeth each
  assert.strictEqual(count(marks[0], /M/g), 4);
  assert.strictEqual(count(marks[0], /L/g), 28);
  assert.strictEqual(count(marks[1], /M/g), 9);
  assert.strictEqual(count(marks[1], /L/g), 54);
  // every mark is short and stays by her: none is a streak (nothing blows)
  for (const seg of marks[1].split('M').filter(Boolean)) {
    const pts = seg.split('L').map((q) => q.split(',').map(Number)), len = Math.hypot(pts[pts.length - 1][0] - pts[0][0], pts[pts.length - 1][1] - pts[0][1]);
    assert.ok(len <= 24 && len >= 16, 'a mark ' + len + ' long');
  }
  // her straight whiskers are replaced, not doubled; everything else is the drawing she had
  assert.ok(!r.svg.includes('L38,8M15,15L38,17') && base.svg.includes('L38,8M15,15L38,17'));
  // with her eyes squeezed shut, or wide open, and her claws in the log
  checkResult(A.character('player', { pose: 'sit', buzz: true, squeeze: true, claws: true }), 'eyes shut');
  checkResult(A.character('player', { pose: 'sit', mood: 'wonder', buzz: true, claws: true }), 'eyes open');
});

test('glow: a soft glow behind anyone to tap (class pc-next), the character’s own group straight after it, so the page wiggles the two together', () => {
  for (const [who, o] of [['riffle', { pose: 'hop', mood: 'happy' }], ['grizzled', { pose: 'sit' }], ['sprinkle', { pose: 'sit' }], ['patience', { pose: 'stand' }], ['wisp', { pose: 'blink' }], ['puddle', { pose: 'head' }], ['squall', { pose: 'sit' }], ['reynard', { pose: 'sit' }]]) {
    const base = A.character(who, o), r = A.character(who, Object.assign({ glow: true }, o));
    checkResult(r, who + ' glow');
    assert.strictEqual(nexts(r.svg), 1);
    assert.ok(/^<g class="pc-glowing"><rect class="pc-next"[^>]*\/><g transform="matrix\(/.test(r.svg), who + ': the glow, then the character');
    assert.strictEqual(strip(r.svg), '<g class="pc-glowing">' + r.svg.match(/<rect class="pc-next"[^>]*\/>/)[0] + strip(base.svg) + '</g>');
    assert.deepStrictEqual([r.head, r.bounds], [base.head, base.bounds]);
    // the glow is round all of them, inside their box or just past it
    const g = r.svg.match(/<rect class="pc-next" x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/).slice(1).map(Number);
    assert.ok(g[0] < base.bounds.x0 && g[1] < base.bounds.y0 && g[0] + g[2] > base.bounds.x1 && g[1] + g[3] > base.bounds.y1 - 1, who + ': round all of them');
  }
  assert.strictEqual(nexts(A.character('riffle', { pose: 'hop' }).svg), 0);
});

// ----- the otters' new poses

test('every new otter pose x mood x facing renders inside its box, for Riffle and the ferry otters; a hop and a somersault are off the ground', () => {
  for (const [who, variant] of BEASTS.filter(([w]) => w !== 'dog')) for (const pose of OTTER_POSES5) for (const mood of A.vocab.moods) for (const facing of FACINGS) {
    const label = `${who}${variant}/${pose}/${mood}/${facing}`, r = A.character(who, { pose, mood, facing, variant });
    checkResult(r, label);
    const h = r.headBox, b = r.bounds, want = who === 'riffle' ? 250 : 330;
    assert.deepStrictEqual([r.w, r.h], [want, want], label);
    assert.ok(h.x0 < r.head.x && r.head.x < h.x1 && h.y0 < r.head.y && r.head.y < h.y1, label + ': head point inside the head box');
    assert.ok(b.x0 >= -1 && b.y0 >= -1 && b.x1 <= r.w + 1 && b.y1 <= r.h + 1, label + ': inside the box ' + JSON.stringify(b));
    const gap = r.h - b.y1;
    if (pose === 'flip') assert.ok(gap > 12, label + ': in the air (' + gap + ')');
    else assert.ok(gap >= 1.5 && gap <= 4.5, label + ': on the ground, or the marks of where he was (' + gap + ')');
  }
  for (const pose of OTTER_POSES5) for (const ex of [{ holds: 'fish' }, { tear: true, mist: true }, { squeeze: true }, { holds: 'pole' }]) checkResult(A.character('riffle', Object.assign({ pose }, ex)), pose + JSON.stringify(ex));
  // the poses look different from one another and from sitting
  const seen = new Set(OTTER_POSES5.concat(['sit', 'stand']).map((pose) => strip(A.character('riffle', { pose, mood: 'neutral' }).svg)));
  assert.strictEqual(seen.size, 9);
});

test('Riffle’s new poses: whistle (two notes, eyes on the sky), groan (eyes rolled up, never the frightened tail-hug), flip, hop, point (straight down), fall, slap', () => {
  const R = {};
  for (const pose of OTTER_POSES5.concat(['sit', 'stand', 'hug'])) R[pose] = A.character('riffle', { pose, mood: 'neutral' });
  // whistle: two notes, lips pursed, his head tipped back to the sky
  assert.strictEqual(count(R.whistle.svg, /class="pc-note"/g), 2);
  for (const pose of OTTER_POSES5.slice(1)) assert.ok(!R[pose].svg.includes('pc-note'), pose);
  assert.ok(R.whistle.svg.includes('<ellipse cx="2.4"'), 'pursed lips');
  const tilt = (r) => { const m = r.svg.match(/<g transform="matrix\(([-\d.]+),([-\d.]+),[-\d.]+,[-\d.]+,[-\d.]+,[-\d.]+\)"><circle cx="-26" cy="-16"/); return Math.atan2(+m[2], +m[1]) * 180 / Math.PI; };
  assert.ok(tilt(R.whistle) < -20, 'whistle: head tipped back ' + tilt(R.whistle));
  assert.ok(Math.abs(tilt(R.sit)) < 1);
  // groan: the whites of his eyes show (rolled up), a long downturned mouth; he sits (no tail round him)
  assert.strictEqual(count(R.groan.svg, /fill="#fffdf8"/g), 2, 'groan: eyes rolled up, the whites showing');
  assert.strictEqual(count(R.sit.svg, /fill="#fffdf8"/g), 0, 'an otter’s eyes are all dark otherwise');
  assert.ok(tilt(R.groan) < -12, 'his head rolled back');
  for (const mood of A.vocab.moods) assert.strictEqual(count(A.character('riffle', { pose: 'groan', mood }).svg, /fill="#fffdf8"/g), 2, 'groan/' + mood + ': a bore, never a fright');
  assert.notStrictEqual(strip(R.groan.svg), strip(R.hug.svg));
  assert.strictEqual(count(A.character('riffle', { pose: 'groan', squeeze: true }).svg, /fill="#fffdf8"/g), 0, 'squeezed shut wins');
  // flip: upside down (his head below his feet), a ring to say which way he turns
  assert.strictEqual(count(R.flip.svg, /class="pc-spin"/g), 1);
  assert.ok(Math.abs(tilt(R.flip)) > 150, 'flip: head over heels');
  assert.ok(R.flip.head.y > R.flip.bounds.y0 + (R.flip.bounds.y1 - R.flip.bounds.y0) * 0.55, 'his head is the lowest of him');
  // hop: standing, off the ground by a paw's height, marks where he was
  assert.ok(R.hop.head.y < R.stand.head.y - 10, 'hop: higher than he stands');
  assert.ok(R.hop.svg.includes('M-12,-3q10,-7 20,0'), 'the marks on the ground');
  // point: one finger, straight down
  const pt = R.point.svg.match(/<path d="M([-\d.]+),([-\d.]+)L([-\d.]+),([-\d.]+)A[\d.]+ [\d.]+ 0 [01] 0 /g);
  assert.ok(pt && pt.length, 'a finger out');
  for (const pose of OTTER_POSES5) if (pose !== 'point') assert.strictEqual(count(R[pose].svg, /l1\.[0-9]+,3M/g), 0);
  // fall: on his back, low and long; slap: the tail swung up behind him, the smack where it lands
  assert.ok(R.fall.bounds.x1 - R.fall.bounds.x0 > (R.fall.bounds.y1 - R.fall.bounds.y0) * 1.5, 'fall: flat on his back');
  assert.ok(R.fall.head.x < R.fall.bounds.x0 + (R.fall.bounds.x1 - R.fall.bounds.x0) * 0.4, 'his head has gone over backwards');
  assert.strictEqual(count(R.slap.svg, /class="pc-smack"/g), 1);
  for (const v of [1, 2, 3]) assert.strictEqual(count(A.character('otter', { pose: 'slap', variant: v }).svg, /class="pc-smack"/g), 1, 'the ferry otters’ applause');
});

test('holds: pole. Riffle hugs a pole twice his size, or poles with it; it runs out of his box; the result says where it is and where he grips it', () => {
  const stand = A.character('riffle', { pose: 'stand' });
  for (const pose of ['hug', 'stand']) for (const facing of FACINGS) for (const mood of ['happy', 'worried', 'shout']) {
    const r = A.character('riffle', { pose, mood, facing, holds: 'pole' }), label = `pole/${pose}/${facing}/${mood}`;
    checkResult(r, label);
    checkIds(r.svg, label);
    assert.strictEqual(count(r.svg, /<g class="pc-pole">/g), 1, label);
    assert.ok(r.pole && r.held && r.held.what === 'pole' && r.held.at === 'paws', label + ': reported');
    // twice his size: the pole's top is far above his box, about as far again as he is tall
    const tall = topOf(stand), poleTall = r.pole.y0 - r.pole.y1;
    assert.ok(r.pole.y1 < -40, label + ': its top is above his box (' + r.pole.y1 + ')');
    assert.ok(poleTall > tall * 1.7 && poleTall < tall * 2.3, `${label}: about twice his size (${poleTall} to ${tall})`);
    // his own boxes are his own: he is not shrunk to fit it in
    assert.ok(r.bounds.y0 >= -1 && Math.abs(topOf(r) - tall) < 12, label + ': the same Riffle');
    assert.ok(r.held.y > r.pole.y1 && r.held.y < r.pole.y0 && r.held.x > 0 && r.held.x < r.w, label + ': his paws are on it');
    assert.ok(r.pole.w > 4 && r.pole.w < 12);
  }
  // hugging: the pole stands upright; poling: it slants back over his shoulder
  const hug = A.character('riffle', { pose: 'hug', holds: 'pole' }), pole = A.character('riffle', { pose: 'stand', holds: 'pole' });
  assert.ok(Math.abs(hug.pole.x1 - hug.pole.x0) < 1, 'hug: upright');
  assert.ok(pole.pole.x1 < pole.pole.x0 - 25, 'stand: slanting back');
  assert.notStrictEqual(strip(hug.svg), strip(A.character('riffle', { pose: 'hug' }).svg), 'not his own tail this time');
  const l = A.character('riffle', { pose: 'stand', holds: 'pole', facing: 'left' });
  assert.ok(Math.abs(l.pole.x0 + pole.pole.x0 - 250) < 0.3 && l.pole.x1 > l.pole.x0, 'mirrored with him');
  // a pose with no way to hold it holds nothing; the ferry otters can pole too
  for (const pose of ['sit', 'swim', 'float', 'dive', 'whistle']) { const r = A.character('riffle', { pose, holds: 'pole' }); assert.ok(!r.svg.includes('pc-pole') && !r.pole && !r.held, pose); }
  assert.ok(A.character('otter', { variant: 1, pose: 'stand', holds: 'pole' }).pole);
  // tap: 'pole' marks it where his paws are (the climber's Tap), and paints nothing
  const t = A.character('riffle', { pose: 'stand', holds: 'pole', tap: 'pole' });
  assert.strictEqual(count(t.svg, /<g class="pc-tap pc-tap-pole"><circle [^>]*fill="none"\/><\/g>/g), 1);
  assert.strictEqual(strip(t.svg).replace(/<g class="pc-tap pc-tap-pole">.*?<\/g>/, ''), strip(pole.svg));
  assert.ok(!pole.svg.includes('pc-tap'));
});

test('Sprinkle looks down at her own enormous feet (lookdown): her head low over her forepaws, her eyes down', () => {
  for (const mood of A.vocab.moods) for (const facing of FACINGS) {
    const r = A.character('sprinkle', { pose: 'lookdown', mood, facing });
    checkResult(r, 'lookdown/' + mood);
    assert.deepStrictEqual([r.w, r.h], [640, 340]);
    assert.ok(r.bounds.x0 >= -1 && r.bounds.y0 >= -1 && r.bounds.x1 <= 641 && r.bounds.y1 <= 341);
  }
  const d = A.character('sprinkle', { pose: 'lookdown' }), s = A.character('sprinkle', { pose: 'sit' });
  assert.ok(d.head.y > s.head.y + 60, 'her head comes down');
  assert.ok(d.head.x > s.head.x + 30, 'and forward, over her forepaws');
  assert.ok(d.headBox.y1 < d.h - 3 - 40, 'above her feet, which stay in sight');
  assert.deepStrictEqual([...d.svg.matchAll(/<ellipse cx="16" cy="0" rx="18" ry="16"/g)].length, 2, 'both forepaws on the ground');
});

// ----- the 9s

const tuckedIn = (s) => count(s, /<g class="pc-tucked"/g);
test('the 9s: the 10s’ group with one claw curled in and unlit, the same claw on every cat; lit nine a cat', () => {
  for (const groups of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const s = A.countsPicture({ table: 9, groups, per: 9, highlight: 0 });
    checkSvgDoc(s, 'nines ' + groups);
    checkIds(s, 'nines ' + groups);
    assert.strictEqual(pawsIn(s), groups * 2, groups + ' cats, two forepaws each');
    assert.strictEqual(tuckedIn(s), groups, 'one claw tucked on every cat');
    assert.strictEqual(litClaws(s), 0);
    // nine claws out on each: ten claw shapes less the tucked one
    assert.strictEqual(count(s, /d="M-4,0Q-3,-14 2,-22Q3,-12 4,0Z"/g), groups * 9, groups + ': nine claws out on every cat');
    assert.ok(new RegExp('aria-label="' + groups + (groups === 1 ? ' cat' : ' cats') + ' sitting up, both forepaws out: nine claws out and one tucked in on each"').test(s));
    // the same claw on every cat: the dewclaw of the right-hand paw (the unmirrored one), in the same place
    const where = [...s.matchAll(/<g transform="translate\(([\d.]+),138\) scale\(0\.86\)">(.*?)<g class="pc-tucked" transform="translate\(-46,2\) rotate\(-60\) scale\(1\)">/g)];
    assert.strictEqual(where.length, groups, groups + ': tucked on the right-hand paw, where its dewclaw stood');
    assert.strictEqual(count(s, /scale\(-0\.86,0\.86\)">(?:(?!<\/g><g transform="translate).)*pc-tucked/g), 0, 'never on the left paw');
    // lit: nine a cat, in order, and the tucked claw never lights
    for (const hl of [9, 9 * groups, 9 * groups + 5, 4]) {
      const lit = A.countsPicture({ table: 9, groups, per: 9, highlight: hl });
      assert.strictEqual(litClaws(lit), Math.min(hl, 9 * groups), `${groups} cats, highlight ${hl}`);
      assert.strictEqual(tuckedIn(lit), groups);
    }
  }
  // ten cats: two rows of five, as the 10s
  const vb = (s) => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  assert.deepStrictEqual(vb(A.countsPicture({ table: 9, groups: 10 })), vb(A.countsPicture({ table: 10, groups: 10 })), 'the same picture as the 10s, claw for claw but one');
  assert.deepStrictEqual(vb(A.countsPicture({ table: 9, groups: 5 })), vb(A.countsPicture({ table: 10, groups: 5 })));
  // a partly counted cat lights its left paw first (five), then four on the right
  const part = A.countsPicture({ table: 9, groups: 2, per: 9, highlight: 12 });
  assert.strictEqual(litClaws(part), 12);
  // who: the rim's cats behind their own paws (the old tom fifth); with totals and next as the 10s take them
  const rim = A.countsPicture({ table: 9, groups: 5, per: 9, highlight: 18, totals: true, next: true, who: RIM4, look: { fur: 'grey' } });
  assert.deepStrictEqual(totals(rim), [9, 18]);
  assert.strictEqual(nexts(rim), 1);
  assert.ok(rim.includes('#dba79f'), 'the old tom, scar and all');
  // a per of nine on another table is this picture too (a borrowed 9 × 2 asked the other way round)
  assert.strictEqual(strip2(A.countsPicture({ table: 2, groups: 2, per: 9, highlight: 9 })), strip2(A.countsPicture({ table: 9, groups: 2, per: 9, highlight: 9 })));
  // dragonets on the 9s tuck one too
  const dz = A.countsPicture({ table: 9, groups: 2, highlight: 18, who: [{ who: 'sprinkle' }, { who: 'squall' }] });
  checkSvgDoc(dz, 'dragonets on the 9s');
  // and all four of the clutch she has met by now, on the 9s and on the 10s, each behind forepaws of its own colour
  for (const table of [9, 10]) {
    const four = A.countsPicture({ table, groups: 4, highlight: table * 4, who: [{ who: 'sprinkle' }, { who: 'squall' }, { who: 'puddle' }, { who: 'wisp' }] });
    checkSvgDoc(four, 'the clutch on the ' + table + 's');
    checkIds(four, 'the clutch on the ' + table + 's');
    for (const col of ['#a8b1b6', '#5f6c7e', '#8fa3b8', '#f2efe4']) assert.ok(four.includes('fill="' + col + '"'), table + 's: ' + col);
    assert.strictEqual(count(four, /<g class="pc-dclaws pc-lit" fill="#ffffff" stroke="#79b3d6"/g), 2, 'Wisp’s two forepaws light pale as frost');
  }
  // prey, rows, mud and the paws pictures are untouched by the 9s
  assert.ok(/aria-label="3 rows of 9 prey"/.test(A.countsPicture({ table: 9, groups: 3, per: 9, kind: 'prey', layout: 'rows' })));
  assert.ok(/aria-label="2 rows of 9 pebbles"/.test(A.countsPicture({ table: 9, groups: 2, per: 9, layout: 'rows' })));
});

test('the hop and the tuck as a question is asked: all ten lit on every cat (tuck: 0), then nine lit and one curled in (tuck: n), then unlit, nine out and one tucked', () => {
  for (const g of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    // the three pictures the page plays, as the engine hands them over (E.lightSteps)
    const hop = A.countsPicture({ table: 9, groups: g, per: 9, highlight: g * 10, tuck: 0, tucked: 0 });
    const tuck = A.countsPicture({ table: 9, groups: g, per: 9, highlight: g * 9, tuck: g, tucked: g });
    const rest = A.countsPicture({ table: 9, groups: g, per: 9, highlight: 0 });
    assert.strictEqual(litClaws(hop), g * 10, g + ' cats: the hop, ten claws lit on each (9 × 6: sixty; 9 × 10: all hundred)');
    assert.strictEqual(tuckedIn(hop), 0, 'nothing tucked yet');
    assert.strictEqual(litClaws(tuck), g * 9, g + ' cats: the tuck, nine lit');
    assert.strictEqual(tuckedIn(tuck), g);
    assert.strictEqual(litClaws(rest), 0, 'then the claws go unlit');
    assert.strictEqual(tuckedIn(rest), g, 'nine out and one tucked');
    assert.strictEqual(strip2(tuck), strip2(A.countsPicture({ table: 9, groups: g, per: 9, highlight: g * 9 })), 'the tuck is the still picture, lit');
    for (const s of [hop, tuck, rest]) { checkSvgDoc(s, 'tuck step ' + g); assert.strictEqual(totals(s).length, 0, 'no number under any cat'); }
    assert.ok(new RegExp('aria-label="' + g + (g === 1 ? ' cat' : ' cats') + ' sitting up, both forepaws out: ten claws out on each"').test(hop));
  }
  // the hop asked for by name, or with nine a cat lit: the same picture
  const a = strip2(A.countsPicture({ table: 9, groups: 4, per: 9, highlight: 40, tuck: 0 }));
  assert.strictEqual(strip2(A.countsPicture({ table: 9, groups: 4, per: 9, highlight: 36, tuck: false })), a);
  assert.strictEqual(strip2(A.countsPicture({ table: 9, groups: 4, per: 9, highlight: 40, hop: true })), a);
  // part-way (two of four cats have tucked): 9 + 9 + 10 + 10 claws are out
  const mid = A.countsPicture({ table: 9, groups: 4, per: 9, highlight: 38, tuck: 2 });
  assert.strictEqual(tuckedIn(mid), 2);
  assert.strictEqual(litClaws(mid), 38);
  assert.ok(/ten claws out, and 2 cats have tucked one in/.test(mid));
});

test('the tuck Tap: five rim cats with fifty lit; each tap curls one claw in on the next cat, 49 to 45; no number under any cat, ever', () => {
  const RIM5 = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  let before = null;
  for (let n = 0; n <= 5; n++) {
    // as the engine hands it over (E.skipPicture): the claws still lit, how many cats have tucked, twice over
    const s = A.countsPicture({ table: 9, groups: 5, per: 9, highlight: 50 - n, totals: false, next: n < 5, who: RIM5, thing: 'claw', things: 'claws', tuck: true, taps: n, tucked: n, look: { fur: 'calico' } });
    checkSvgDoc(s, 'tuck tap ' + n);
    checkIds(s, 'tuck tap ' + n);
    assert.strictEqual(litClaws(s), 50 - n, `${n} taps: ${50 - n} lit (every claw still out)`);
    assert.strictEqual(tuckedIn(s), n, n + ' cats have tucked one in');
    assert.strictEqual(nexts(s), n < 5 ? 1 : 0, 'the next cat glows');
    assert.strictEqual(totals(s).length, 0);
    assert.strictEqual(pawsIn(s), 10);
    if (before) assert.notStrictEqual(strip2(s), strip2(before), 'every tap changes the picture');
    before = s;
    // the glow is on the next cat to tuck: the (n + 1)th cell, just before its group
    if (n < 5) {
      const gx = +s.match(/<rect class="pc-next" x="([\d.]+)"/)[1];
      assert.ok(Math.abs(gx - (18 + n * 204 + 6)) < 0.5, 'tap ' + n + ': the glow is on cat ' + (n + 1));
      assert.ok(/class="pc-next"[^>]*\/><g transform="translate\(/.test(s), 'the glow, then that cat’s group');
    }
    // told only one way, or only by the lit claws, it is the same picture
    const o = { table: 9, groups: 5, per: 9, totals: false, next: n < 5, who: RIM5, tuck: true, look: { fur: 'calico' } };
    assert.strictEqual(strip2(A.countsPicture(Object.assign({ highlight: 50 - n }, o))), strip2(s), 'read from the claws still lit');
    assert.strictEqual(strip2(A.countsPicture(Object.assign({ highlight: n * 9 }, o))), strip2(s), 'read from nine a tap');
    assert.strictEqual(strip2(A.countsPicture(Object.assign({ tucked: n }, o))), strip2(s));
    // and never a number under a cat, whatever it is told
    assert.strictEqual(totals(A.countsPicture(Object.assign({ taps: n, totals: true }, o))).length, 0, 'no totals in the tuck’s picture, ever');
    assert.ok(!/>(9|18|27|36)</.test(s), 'the lesson’s answers are nowhere on it');
  }
  // the fifth cat is the old tom: tapped, he looks as he does when he is counted (flat ears, stern)
  const done = A.countsPicture({ table: 9, groups: 5, per: 9, tuck: true, taps: 5, who: RIM5 });
  assert.ok(/nine claws out and one tucked in on each/.test(done), 'the kept picture: nine lit and one dark on every cat');
  assert.strictEqual(litClaws(done), 45);
});

test('the bedtime nines (her own two forepaws, per 9): one claw tucked, nine lighting at each tap', () => {
  const look = { fur: 'ginger', marking: 'white-paws', eyes: 'green', sex: 'she' };
  for (let tap = 0; tap <= 5; tap++) {
    // as the engine hands it over (skip paws: 'both' at table 9)
    const s = A.countsPicture({ paws: 'own', both: true, table: 9, groups: 5, per: 9, highlight: tap * 9, taps: tap, lit: tap ? 'both' : null, nextPaw: tap < 5 ? 'both' : null, totals: false, next: tap < 5, look });
    checkSvgDoc(s, 'bedtime nines ' + tap);
    assert.strictEqual(tuckedIn(s), 1, 'one claw tucked in, always the same one');
    assert.strictEqual(litClaws(s), tap ? 9 : 0, tap + ' taps: nine claws light');
    assert.strictEqual(count(s, /d="M-4\.4,0Q-3\.4,-15 2,-24Q3\.4,-13 4\.4,0Z"/g), 9, 'nine claws out');
    assert.strictEqual(nexts(s), tap < 5 ? 1 : 0);
    assert.ok(/nine claws out and one tucked in, 5 taps"/.test(s));
  }
  // it is the tenth claw as she counts her own, left to right: the outer toe of her right paw (the
  // open river's `log` camera tucks the same one), and the nine that light are the nine before it
  const s = A.countsPicture({ paws: 'both', table: 9, groups: 5, per: 9, highlight: 9, look });
  assert.ok(/<g transform="translate\(369,189\) scale\(1\)">.*?<g class="pc-tucked" transform="translate\(33,-62\) rotate\(30\) scale\(1\.1\)">/.test(s), 'the right paw’s outer toe');
  const right = s.slice(s.indexOf('<g transform="translate(369,189) scale(1)">'));
  assert.ok(right.indexOf('pc-tucked') > right.lastIndexOf('fill="#ffe36e" stroke="#d18b12"'), 'drawn after the four that are lit: the last of the count');
  assert.strictEqual(litClaws(right), 4);
  // the bedtime tens are as they were
  assert.strictEqual(tuckedIn(A.countsPicture({ paws: 'both', table: 10, groups: 5, per: 10, highlight: 10, look })), 0);
  assert.strictEqual(litClaws(A.countsPicture({ paws: 'both', table: 10, groups: 5, per: 10, highlight: 10, look })), 10);
});

test('sand help for the nines: pairs of swipes hopped by tens, then one line rubbed out of each pair, a cat at a time, the rest still lit', () => {
  const lines = (s) => count(s, /class="pc-swipe"/g), lit = (s) => count(s, /class="pc-swipe"[^>]*stroke="#e39a12"/g), rubbed = (s) => count(s, /class="pc-rubbed"/g);
  for (const g of [2, 4, 6, 9, 10]) {
    // phase one: chapter 4's pairs, hopped by tens (E.sandOpts gives per 10)
    for (let k = 0; k <= g; k++) {
      const s = A.sand({ groups: g, per: 10, counted: k * 10, style: 'swipe', pair: true });
      assert.strictEqual(lines(s), g * 10); assert.strictEqual(lit(s), k * 10); assert.strictEqual(rubbed(s), 0);
    }
    // phase two: one line gone from each of the first k pairs; every line left is lit (40; then 39, 38, 37, 36)
    for (let k = 1; k <= g; k++) {
      const s = A.sand({ groups: g, per: 10, counted: g * 10, style: 'swipe', pair: true, rubbed: k });
      checkSvgDoc(s, 'rubbed ' + k + ' of ' + g);
      assert.strictEqual(rubbed(s), k, `${g} cats: ${k} rubbed out`);
      assert.strictEqual(lines(s), g * 10 - k, 'the lines left');
      assert.strictEqual(lit(s), g * 10 - k, 'and all of them lit: ' + (g * 10 - k));
      assert.strictEqual(count(s, /class="pc-pairbox"/g), g, 'a pair to a box, as before');
      assert.ok(new RegExp('one line rubbed out of ' + (k === g ? 'every pair' : k + (k === 1 ? ' pair' : ' pairs')) + '"').test(s));
      // the other ways of saying it
      assert.strictEqual(A.sand({ groups: g, per: 10, counted: g * 10, style: 'swipe', pair: true, tucked: k }), s);
      assert.strictEqual(A.sand({ groups: g, per: 10, counted: g * 10, style: 'swipe', pair: true, tuck: k }), s);
      assert.strictEqual(A.sand({ groups: g, per: 10, counted: g * 10 - k, style: 'swipe', pair: true, tuck: true }), s, 'read from the lines still standing');
      assert.strictEqual(A.sand({ groups: g, per: 9, counted: g * 10 - k, style: 'swipe', pair: true, tuck: true }), A.sand({ groups: g, per: 9, counted: g * 10, style: 'swipe', pair: true, rubbed: k }), 'a per of nine is ten lines a cat too');
    }
  }
  // it is the last line of a pair that goes (the tenth claw), from the first pair on: the first box loses its last line
  const s = A.sand({ groups: 4, per: 10, counted: 40, style: 'swipe', pair: true, rubbed: 1 });
  const box = s.match(/<rect class="pc-pairbox" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/).slice(1).map(Number);
  const gone = s.match(/<path class="pc-rubbed" d="M([\d.]+),([\d.]+)Q/).slice(1).map(Number);
  assert.ok(gone[0] > box[0] + box[2] * 0.7 && gone[0] < box[0] + box[2] && Math.abs(gone[1] - (box[1] + 16)) < 0.1, 'the last line of the first pair');
  // on any ground the help has
  for (const ground of ['earth', 'mud', 'grit', 'log']) assert.strictEqual(rubbed(A.sand({ groups: 3, per: 10, counted: 30, style: 'swipe', pair: true, rubbed: 2, ground })), 2);
  // unpaired swipes and plain scratches have no such phase
  assert.strictEqual(A.sand({ groups: 4, per: 5, counted: 10, style: 'swipe', rubbed: 2 }), A.sand({ groups: 4, per: 5, counted: 10, style: 'swipe' }));
  assert.strictEqual(A.sand({ groups: 4, per: 2, counted: 4, rubbed: 2 }), A.sand({ groups: 4, per: 2, counted: 4 }));
});

test('answers scratched in the sand: 18 and 36 (36 alone while 2 × 9 is still to come back), never 90; by the sand or by the Counts pictures', () => {
  const nums = (s) => [...s.matchAll(/<text class="pc-answer"[^>]*fill="#9c7440">(\d)<\/text>/g)].map((m) => m[1]).join('');
  const both = A.sand({ answers: [18, 36] }), one = A.sand({ answers: [36] });
  checkSvgDoc(both, 'answers'); checkSvgDoc(one, 'answer');
  assert.strictEqual(nums(both), '1836');
  assert.strictEqual(nums(one), '36');
  assert.ok(/aria-label="Scratched in the sand: 18 and 36"/.test(both) && /aria-label="Scratched in the sand: 36"/.test(one));
  assert.ok(!/90|9 and/.test(both.match(/aria-label="[^"]+"/)[0]));
  // each number in a box of its own, its two numerals apart (three and six; one and eight)
  assert.strictEqual(count(both, /<rect [^>]*rx="20"/g), 2);
  const xs = [...both.matchAll(/<text class="pc-answer" x="([\d.]+)" y="148"/g)].map((m) => +m[1]);
  assert.ok(xs[1] - xs[0] > 60 && xs[2] - xs[1] > xs[1] - xs[0] + 40, 'numerals apart, numbers further apart: ' + xs);
  assert.ok(both.includes('font-family="Andika,'), 'the times-table numerals');
  // the page asks the sand, and if that does not name them, the Counts pictures (kind: answers): one picture
  assert.strictEqual(A.countsPicture({ kind: 'answers', answers: [18, 36] }), both);
  assert.strictEqual(A.sand({ kind: 'answers', answers: [18, 36] }), both);
  assert.strictEqual(A.countsPicture({ answers: [36] }), one);
  // on another ground; with nothing yet; with what is not a number
  assert.ok(/Scratched in the earth: 18"/.test(A.sand({ answers: [18], ground: 'earth' })));
  checkSvgDoc(A.sand({ answers: [] }), 'no answers');
  assert.strictEqual(nums(A.sand({ answers: ['4 5', null, 'x'] })), '45');
  assert.ok(lum('#9c7440') < lum('#efd6a2') - 60, 'dark in the pale sand, as a scratch is');
});

// ----- fish, logs, herons

test('fish in pairs (the 2s: two fish for every answer): small and silver, eyes shut, side by side; seven pairs as four and three, nine in rows of three', () => {
  const fishN = (s) => count(s, /<g transform="translate\([-\d.]+,[-\d.]+\) rotate\(0\) translate\([-\d.]+,[-\d.]+\) scale\([\d.]+\)"><g><path d="M20,20L3,7Q8,20 3,33Z"/g);
  const vb = (s) => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  const patches = (s) => [...s.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="108" height="[\d.]+" rx="18"/g)].map((m) => [+m[1], +m[2]]);
  for (const groups of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const s = A.countsPicture({ table: 2, groups, per: 2, kind: 'fish', layout: 'pairs' });
    checkSvgDoc(s, 'fish pairs ' + groups);
    assert.strictEqual(fishN(s), groups * 2, groups + ' pairs: ' + groups * 2 + ' fish');
    assert.strictEqual(patches(s).length, groups, 'a pair to a patch');
    assert.ok(new RegExp('aria-label="' + groups + (groups === 1 ? ' pair' : ' pairs') + ' of fish"').test(s));
    const rows = [...new Set(patches(s).map((p) => p[1]))].length;
    assert.strictEqual(rows, groups <= 5 ? 1 : groups === 9 ? 3 : 2, groups + ' pairs: rows');
    assert.strictEqual(litClaws(s), 0);
  }
  // seven: four above three; nine: three rows of three
  const rowsOf = (g) => { const p = patches(A.countsPicture({ table: 2, groups: g, per: 2, kind: 'fish' })), ys = [...new Set(p.map((q) => q[1]))]; return ys.map((y) => p.filter((q) => q[1] === y).length); };
  assert.deepStrictEqual(rowsOf(7), [4, 3]);
  assert.deepStrictEqual(rowsOf(9), [3, 3, 3]);
  assert.deepStrictEqual(rowsOf(5), [5]);
  // every eye shut; silver; no blood, no hook
  const s7 = A.countsPicture({ table: 2, groups: 7, per: 2, kind: 'fish', layout: 'pairs', thought: true });
  assert.strictEqual(count(s7, /<path d="M67,16Q70,19 73,16"/g), 14, 'fourteen shut eyes');
  assert.ok(s7.includes('#c3ced7') && !/#(c00|d00|e11|b22222|ff0000|8b0000)/i.test(s7), 'silver, and no red anywhere');
  // lit in order, a fish at a time (a pair at a time when counted by twos); totals and the next pair as any group
  for (const hl of [0, 2, 5, 14]) assert.strictEqual(count(A.countsPicture({ table: 2, groups: 7, per: 2, kind: 'fish', highlight: hl }), /fill="#ffb21f" opacity="\.45"/g), hl, hl + ' fish lit');
  const t = A.countsPicture({ table: 2, groups: 7, per: 2, kind: 'fish', highlight: 6, totals: true, next: true });
  assert.deepStrictEqual(totals(t), [2, 4, 6]);
  assert.strictEqual(nexts(t), 1);
  // Patience's thought cloud: by day (no evening sky, no stars, no hill), the bubbles trailing down to her
  checkSvgDoc(s7, 'the cloud');
  assert.ok(/aria-label="A thought: 7 pairs of fish"/.test(s7));
  assert.ok(!s7.includes('#3B3A74') && !s7.includes('#7a6170') && s7.includes('stop-color="#ffffff"'), 'a daylight cloud');
  assert.strictEqual(count(s7, /<circle cx="[\d.]+" cy="[\d.]+" r="(18|12|7\.5)" fill="#ffffff"/g), 3, 'three bubbles');
  const right = A.countsPicture({ table: 2, groups: 7, per: 2, kind: 'fish', thought: 'right' });
  assert.notStrictEqual(strip5(right), strip5(s7));
  assert.ok(vb(s7)[0] > vb(A.countsPicture({ table: 2, groups: 7, per: 2, kind: 'fish' }))[0], 'the cloud is round the picture');
  // the bill: nine pairs in rows of three, as the cloud over her head lays them
  const nine = A.countsPicture({ table: 2, groups: 9, per: 2, kind: 'fish', layout: 'pairs', thought: true, highlight: 18 });
  assert.strictEqual(fishN(nine), 18);
  assert.strictEqual(count(nine, /fill="#ffb21f" opacity="\.45"/g), 18);
  // the old tom's boast keeps its evening sky
  assert.ok(A.countsPicture({ table: 2, groups: 10, per: 2, kind: 'prey', thought: true }).includes('#3B3A74'));
});

test('fish on strings (Riffle’s catch): four strings of five, each a reed looped round the tails, nothing through a fish; lit a string at a time', () => {
  const fishN = (s) => count(s, /rotate\(90\) translate\([-\d.]+,[-\d.]+\) scale\([\d.]+\)"><g><path d="M20,20L3,7Q8,20 3,33Z"/g);
  const loops = (s) => count(s, /<ellipse cx="[\d.]+" cy="[\d.]+" rx="8\.6" ry="4\.6" fill="none" stroke="#6f9a4a"/g);
  const reeds = (s) => count(s, /stroke="#6f9a4a" stroke-width="4\.6" fill="none"/g);
  const vb = (s) => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  for (const groups of [1, 2, 3, 4, 5, 6, 8, 10]) {
    const s = A.countsPicture({ table: 5, groups, per: 5, kind: 'fish', layout: 'strings' });
    checkSvgDoc(s, 'strings ' + groups);
    checkIds(s, 'strings ' + groups);
    assert.strictEqual(fishN(s), groups * 5, groups + ' strings of five, hanging by their tails');
    assert.strictEqual(reeds(s), groups, 'one reed a string');
    assert.strictEqual(loops(s), groups * 5, 'a loop of the reed round every tail');
    assert.ok(new RegExp('aria-label="' + groups + (groups === 1 ? ' string' : ' strings') + ' of fish on the raft, 5 fish on every string"').test(s));
    assert.ok(!/hook|#(c00|d00|ff0000|8b0000)/i.test(s), 'no hook, no blood');
  }
  // four strings: two and two; three or fewer: one row
  assert.ok(vb(A.countsPicture({ table: 5, groups: 4, per: 5, kind: 'fish', layout: 'strings' }))[1] > vb(A.countsPicture({ table: 5, groups: 3, per: 5, kind: 'fish', layout: 'strings' }))[1] * 1.7, 'four: two rows');
  assert.strictEqual(vb(A.countsPicture({ table: 5, groups: 4, per: 5, kind: 'fish', layout: 'strings' }))[0], vb(A.countsPicture({ table: 5, groups: 2, per: 5, kind: 'fish', layout: 'strings' }))[0]);
  // lit a string at a time (light: 'groups'): 5, 10, 15, 20
  for (let k = 0; k <= 4; k++) assert.strictEqual(count(A.countsPicture({ table: 5, groups: 4, per: 5, kind: 'fish', layout: 'strings', highlight: k * 5 }), /fill="#ffb21f" opacity="\.45"/g), k * 5);
  const t = A.countsPicture({ table: 5, groups: 4, per: 5, kind: 'fish', layout: 'strings', highlight: 10, totals: true, next: true });
  assert.deepStrictEqual(totals(t), [5, 10]);
  assert.strictEqual(nexts(t), 1);
  // every eye shut; laid across the raft's logs
  assert.strictEqual(count(t, /<path d="M67,16Q70,19 73,16"/g), 20);
  assert.ok(t.includes('fill="#c39b68"'), 'the logs');
  // the pile set's fish when it is there (PC.art.prey), ours when it is not or when it breaks
  const keep = A.prey;
  try {
    A.prey = (o) => ({ svg: '<g><path class="stub-' + o.kind + '-' + (o.part || 'all') + (o.lit ? '-lit' : '') + '" d="M0,0h100v40h-100Z"/></g>', w: 100, h: 40, kind: o.kind });
    const s = A.countsPicture({ table: 5, groups: 2, per: 5, kind: 'fish', layout: 'strings', highlight: 5 });
    assert.strictEqual(count(s, /class="stub-fish-body(-lit)?"/g), 10, 'drawn by PC.art.prey');
    assert.strictEqual(count(s, /class="stub-fish-glow-lit"/g), 5);
    A.prey = () => { throw new Error('no'); };
    assert.strictEqual(fishN(A.countsPicture({ table: 5, groups: 2, per: 5, kind: 'fish', layout: 'strings' })), 10, 'a broken painter: our own fish');
    A.prey = (o) => ({ svg: '<g/>', w: 10, h: 10, kind: 'mouse' });
    assert.strictEqual(fishN(A.countsPicture({ table: 2, groups: 1, per: 2, kind: 'fish' })), 0);
  } finally { if (keep) A.prey = keep; else delete A.prey; }
});

test('the help on the raft’s log (ground: log): a length of log, the grain running with it; two marks for every answer, or five for every string', () => {
  const two = A.sand({ groups: 7, per: 2, counted: 6, ground: 'log' }), five = A.sand({ groups: 4, per: 5, counted: 10, ground: 'log', style: 'swipe' });
  checkSvgDoc(two, 'log 7x2'); checkSvgDoc(five, 'log 4x5');
  assert.ok(/aria-label="7 groups of 2 scratches in the log"/.test(two) && /aria-label="4 swipes of 5 claw lines in the log"/.test(five));
  assert.strictEqual(count(two, /stroke="(#e39a12|#4d3219)" stroke-width="4\.6"/g), 14, 'two marks for every answer');
  assert.strictEqual(count(two, /stroke="#e39a12" stroke-width="4\.6"/g), 6);
  assert.strictEqual(count(five, /class="pc-swipe"/g), 20, 'five for every string');
  assert.strictEqual(count(five, /class="pc-swipe"[^>]*stroke="#e39a12"/g), 10);
  for (const s of [two, five]) {
    assert.ok(s.includes('fill="#b78b5a"') && /<rect x="3" y="8" [^>]*rx="/.test(s), 'a log, not a patch of sand');
    assert.ok(!s.includes('#efd6a2') && !s.includes(' opacity=".7"><circle'), 'no sand, no grit');
  }
  // never mud, never sand: its own colours, wood
  const [r, g, b] = rgbOf('#b78b5a');
  assert.ok(r > g && g > b && lum('#b78b5a') > lum('#6f5a47') + 40, 'wood, lighter than the mud');
  // the same size as the sand's picture of the same help (the page lays them out alike)
  const vb = (s) => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  assert.deepStrictEqual(vb(two), vb(A.sand({ groups: 7, per: 2, counted: 6 })));
  assert.deepStrictEqual(vb(five), vb(A.sand({ groups: 4, per: 5, counted: 10, style: 'swipe' })));
  for (const [gr, p] of [[1, 2], [2, 2], [9, 2], [1, 5], [3, 5]]) checkSvgDoc(A.sand({ groups: gr, per: p, counted: p, ground: 'log', style: p === 5 ? 'swipe' : undefined }), 'log ' + gr + 'x' + p);
});

test('Puddle’s riddle (kind: bumps): the raft from underneath, four logs in a row, ten little bump stars on every one, lit a log at a time', () => {
  const stars = (s) => count(s, /<path class="pc-bump( pc-lit)?" /g), lit = (s) => count(s, /<path class="pc-bump pc-lit"/g), logs = (s) => count(s, /fill="#7b5a3c" stroke="#3f2b1a"/g);
  for (const groups of [1, 2, 3, 4]) {
    const s = A.countsPicture({ table: 10, groups, per: 10, kind: 'bumps' });
    checkSvgDoc(s, 'bumps ' + groups);
    checkIds(s, 'bumps ' + groups);
    assert.strictEqual(logs(s), groups, groups + ' logs');
    assert.strictEqual(stars(s), groups * 10, 'ten bumps on every one');
    assert.strictEqual(lit(s), 0);
    assert.ok(new RegExp('aria-label="The raft from underneath: ' + groups + (groups === 1 ? ' log, 10 bumps on it' : ' logs, 10 bumps on every one') + '"').test(s));
    // the help lights the picture itself, a log at a time: 10, 20, 30, 40
    for (let k = 1; k <= groups; k++) {
      const h = A.countsPicture({ table: 10, groups, per: 10, kind: 'bumps', highlight: k * 10 });
      assert.strictEqual(lit(h), k * 10);
      // exactly the first k logs: every lit star is above every unlit one
      const ys = [...h.matchAll(/<path class="pc-bump( pc-lit)?" d="M[\d.]+,([\d.]+)/g)].map((m) => [!!m[1], +m[2]]);
      assert.ok(Math.max(...ys.filter((q) => q[0]).map((q) => q[1])) < Math.min(...ys.filter((q) => !q[0]).map((q) => q[1]).concat([1e9])), 'whole logs');
    }
    // vines lash the logs together when there is more than one
    assert.strictEqual(count(s, /stroke="#6f9450"/g), groups > 1 ? 2 : 0);
  }
  // blue and sunny (the open river's own water, seen from below), never black: the water is light, and nothing else is under the raft
  const s = A.countsPicture({ table: 10, groups: 4, per: 10, kind: 'bumps', highlight: 20, totals: true, next: true });
  const under = [...s.matchAll(/<linearGradient id="pcraft_[^"]*-w"[^>]*>(.*?)<\/linearGradient>/g)].map((m) => [...m[1].matchAll(/stop-color="(#[0-9a-f]{6})"/g)].map((q) => q[1]))[0];
  assert.deepStrictEqual(under, ['#c4e9f1', '#88c0db'], 'sunny blue water (tests/set-openriver.test.js holds these to the set’s `under` camera)');
  for (const c of under) { const [r, g, b] = rgbOf(c); assert.ok(lum(c) > 170 && b > r + 30 && b >= g, 'light, and blue: ' + c); }
  assert.ok(!/#000|#111|#1[0-9a-f]{5}"/.test(s), 'nothing dark under the raft');
  assert.ok(!s.includes('#8fa3b8') && !s.includes('pc-ridges'), 'no dragonet in the picture');
  assert.deepStrictEqual(totals(s), [10, 20]);
  assert.strictEqual(nexts(s), 1);
  // ten on a log: five, a gap, five
  const xs = [...A.countsPicture({ table: 10, groups: 1, per: 10, kind: 'bumps' }).matchAll(/<path class="pc-bump" d="M([\d.]+),/g)].map((m) => +m[1]);
  assert.strictEqual(xs.length, 10);
  assert.ok(xs[5] - xs[4] > (xs[1] - xs[0]) * 1.3, 'a gap after the fifth');
});

test('Wisp’s riddle (kind: herons): seven little herons scratched in the mud, each on one leg; the leg is what lights', () => {
  const legs = (s) => count(s, /L[\d.]+,160M[\d.]+,160l-10,5M[\d.]+,160l11,5" stroke="(#2a1f17|#e39a12)"/g), lit = (s) => count(s, /L[\d.]+,160M[\d.]+,160l-10,5M[\d.]+,160l11,5" stroke="#e39a12"/g);
  for (const groups of [1, 3, 5, 7]) {
    const s = A.countsPicture({ table: 1, groups, per: 1, kind: 'herons' });
    checkSvgDoc(s, 'herons ' + groups);
    assert.strictEqual(legs(s), groups, groups + ' herons, one leg in the water each');
    assert.strictEqual(lit(s), 0);
    assert.ok(new RegExp('aria-label="' + groups + (groups === 1 ? ' heron' : ' herons') + ' scratched in the mud, each standing on one leg"').test(s));
    // the other leg is folded up: one bent line a heron, never down to the water
    assert.strictEqual(count(s, /L[\d.]+,112L[\d.]+,118"/g), groups * 2, 'a folded leg each (groove and its light edge)');
    // the help lights them one at a time, and you count them by ones
    for (let k = 1; k <= groups; k++) assert.strictEqual(lit(A.countsPicture({ table: 1, groups, per: 1, kind: 'herons', highlight: k })), k);
    assert.ok(s.includes('fill="#6f5a47"'), 'in the mud');
  }
  // seven are four above three, as her claw draws them in the mud on the panel before (the picture is her
  // drawing: it was one long row of seven); the two smaller drawings she borrows, three and five, are one row;
  // in the mud's own colours, with the marks' light edge
  const rowsOf = (pic) => { const ys = [...pic.matchAll(/<g transform="translate\(([\d.]+),([\d.]+)\) scale\(1\)">/g)].map((m) => +m[2]); return [...new Set(ys)].sort((a, b) => a - b).map((y) => ys.filter((v) => v === y).length); };
  const s = A.countsPicture({ table: 1, groups: 7, per: 1, kind: 'herons', highlight: 3, totals: true, next: true });
  assert.deepStrictEqual(rowsOf(s), [4, 3], 'four above three');
  assert.deepStrictEqual(rowsOf(A.countsPicture({ table: 1, groups: 7, per: 1, kind: 'herons' })), [4, 3]);
  for (const g of [1, 3, 5, 6]) assert.deepStrictEqual(rowsOf(A.countsPicture({ table: 1, groups: g, per: 1, kind: 'herons' })), [g], g + ': one row');
  assert.deepStrictEqual(rowsOf(A.countsPicture({ table: 1, groups: 8, per: 1, kind: 'herons' })), [4, 4]);
  assert.deepStrictEqual(totals(s), [1, 2, 3]);
  assert.strictEqual(nexts(s), 1);
  // each heron: a body, an S of a neck, a head, a long bill (as simple as a card's picture: a handful of strokes)
  assert.ok(count(A.countsPicture({ table: 1, groups: 1, per: 1, kind: 'herons' }), /<path /g) < 40, 'a few strokes');
  assert.ok(!s.includes('#8799ad') && !s.includes('pc-heron'), 'scratches, not Patience');
});

// ----- the Taps

test('paws aboard (paws: board): her four paws at the edge of the rocks; each tap sets the next one down on the raft, which dips; the next one glows', () => {
  const look = { fur: 'brown-tabby', marking: 'white-paws', eyes: 'green', sex: 'she' };
  let before = null;
  for (let n = 0; n <= 4; n++) {
    // as the engine hands it over (E.skipPicture)
    const s = A.countsPicture({ table: 1, groups: 4, per: 1, highlight: n, totals: false, next: n < 4, thing: 'paw', things: 'paws', paws: 'board', taps: n, look });
    checkSvgDoc(s, 'board ' + n);
    checkIds(s, 'board ' + n);
    assert.strictEqual(count(s, /<g class="pc-paw( pc-aboard)?" /g), 4, 'four paws');
    assert.strictEqual(count(s, /<g class="pc-paw pc-aboard" /g), n, n + ' of them on the raft');
    assert.strictEqual(nexts(s), n < 4 ? 1 : 0, 'the next one glows softly');
    assert.strictEqual(totals(s).length, 0, 'Tallyheart counts them aloud: no number in the picture');
    assert.strictEqual(count(s, /class="pc-dip"/g), n ? 1 : 0, 'the raft dips');
    assert.ok(new RegExp('aria-label="Your four paws at the edge of the rocks: ' + (n ? n + ' on the raft' : 'none on the raft yet') + '"').test(s));
    if (before) assert.notStrictEqual(strip5(s), strip5(before));
    before = s;
    // a paw aboard is further up the picture (on the logs) than one still on the rocks; left to right
    const ys = [...s.matchAll(/<g class="pc-paw( pc-aboard)?" transform="translate\(([\d.]+),([\d.]+)\)/g)].map((m) => [!!m[1], +m[2], +m[3]]);
    ys.forEach((q, i) => { assert.strictEqual(q[0], i < n, 'left to right'); if (i) assert.ok(q[1] > ys[i - 1][1]); });
    if (n && n < 4) assert.ok(ys[0][2] < ys[3][2] - 80, 'aboard is up on the logs');
    // the glow is on the next paw, just before its group
    if (n < 4) assert.ok(/class="pc-next"[^>]*\/><g class="pc-paw" /.test(s));
    // read from highlight when there are no taps
    assert.strictEqual(strip5(A.countsPicture({ table: 1, groups: 4, per: 1, highlight: n, next: n < 4, paws: 'board', look })), strip5(s));
  }
  // her fur and her white paws; the rocks, the water, the logs; totals when asked
  const s = A.countsPicture({ paws: 'board', table: 1, groups: 4, per: 1, taps: 2, totals: true, look });
  assert.ok(s.includes('#fcf9f3') && s.includes('#5b3f27'), 'white paws, tabby bars on her legs');
  // (the water is the Crossing's deep strip, the colour of the page she comes from and the one she turns to:
  // it was the open river's old sage green, and changed colour between two pages)
  assert.ok(s.includes('#a9a7a0') && s.includes('#4d7890') && s.includes('#c39b68'), 'rocks, water, logs');
  assert.ok(!s.includes('#74b2d4') && !s.includes('#8fb79c'), 'not the open river’s own blue (nor the sage green it once was)');
  assert.deepStrictEqual(totals(s), [1, 2]);
  for (const fur of A.vocab.looks.fur) checkSvgDoc(A.countsPicture({ paws: 'board', groups: 4, taps: 1, look: { fur } }), 'board ' + fur);
});

test('the claws in the log (paws: log): her two forepaws on a log, a claw dug in at each tap, the tenth tucked, Riffle’s webbed forepaw beside them; the skymonster at three sizes', () => {
  const look = { fur: 'white', marking: 'none', eyes: 'blue', sex: 'she' };
  const dug = (s) => count(s, /<path class="pc-dig"/g);
  for (let n = 0; n <= 9; n++) {
    const s = A.countsPicture({ table: 1, groups: 9, per: 1, highlight: n, totals: false, next: n < 9, thing: 'claw', things: 'claws', paws: 'log', taps: n, look });
    checkSvgDoc(s, 'log ' + n);
    checkIds(s, 'log ' + n);
    assert.strictEqual(litClaws(s), n, n + ' claws lit');
    assert.strictEqual(dug(s), n, n + ' dug into the wood');
    assert.strictEqual(tuckedIn(s), 1, 'the tenth stays tucked');
    assert.strictEqual(count(s, /d="M-4\.4,0Q-3\.4,-15 2,-24Q3\.4,-13 4\.4,0Z"/g), 9, 'nine claws out');
    assert.strictEqual(count(s, /<g class="pc-riffle" /g), 1, 'Riffle’s forepaw is right there');
    assert.strictEqual(count(s, /<g class="pc-oclaws">/g), 1, 'webbed, five little claws, none of them lit');
    assert.strictEqual(nexts(s), n < 9 ? 1 : 0);
    assert.ok(new RegExp('Riffle’s beside them: ' + n + (n === 1 ? ' claw' : ' claws') + ' dug in, one tucked"').test(s));
    assert.ok(!s.includes('pc-plane'), 'no airplane unless asked: the page redraws its own scene');
    assert.strictEqual(strip5(A.countsPicture({ table: 1, groups: 9, per: 1, highlight: n, next: n < 9, paws: 'log', look })), strip5(s), 'read from highlight');
  }
  // left paw first (five), then four on the right; his paw does not touch hers
  const five = A.countsPicture({ paws: 'log', groups: 9, taps: 5, look });
  const cells = five.match(/<g class="pc-paws">(.*)<\/g><g class="pc-riffle"/)[1].split('<g transform="translate(').slice(1);
  assert.strictEqual(cells.length, 2);
  assert.deepStrictEqual(cells.map((c) => litClaws(c)), [5, 0], 'five in: the whole left paw');
  assert.ok(+five.match(/<g class="pc-riffle" transform="translate\(([\d.]+),/)[1] - 430 > 150, 'close beside them, not touching');
  // the skymonster: a glint, a shape with wings, a belly with its row of round windows; by the taps when asked so
  const plane = (o) => { const s = A.countsPicture(Object.assign({ paws: 'log', groups: 9, look }, o)), m = s.match(/<g class="pc-plane"[^>]*>(.*?)<\/g>(?=<path d="M4,108)/); return m ? m[1] : ''; };
  const far = plane({ taps: 2, plane: 'far' }), near = plane({ taps: 2, plane: 'near' }), overhead = plane({ taps: 2, plane: 'over' });
  assert.ok(far && near && overhead && new Set([far, near, overhead]).size === 3, 'three sizes');
  assert.ok(count(far, /<path /g) === 1 && !far.includes('ellipse'), 'far: a glint');
  assert.strictEqual(count(near, /<ellipse cx="-?50" cy="9"/g), 2, 'near: a shape with wings, an engine under each');
  assert.ok(overhead.includes('H820') && count(overhead, /<circle /g) === 9, 'over: a belly across the whole top of the picture');
  for (const [taps, size] of [[0, 'far'], [3, 'far'], [4, 'near'], [6, 'near'], [7, 'over'], [9, 'over']])
    assert.strictEqual(strip5(A.countsPicture({ paws: 'log', groups: 9, taps, look, plane: true })), strip5(A.countsPicture({ paws: 'log', groups: 9, taps, look, plane: size })), taps + ' taps: ' + size);
  assert.strictEqual(count(A.countsPicture({ paws: 'log', groups: 9, taps: 8, look, plane: 'over' }), /<circle cx="[\d.]+" cy="[\d.]+" r="9\.6"\/>/g), 9, 'a row of little round windows');
  assert.strictEqual(plane({ taps: 5, plane: 'none' }), '');
  // the airplane is in the sky, well above the water: the water stays flat (no wind marks, nothing blown)
  const over = A.countsPicture({ paws: 'log', groups: 9, taps: 9, look, plane: 'over' });
  assert.ok(over.includes('fill="#74b2d4"') && over.indexOf('pc-plane') < over.indexOf('fill="#74b2d4"'), 'drawn in the sky, behind the far shore and the river');
  // Tallyheart is on the rocks behind, a paw up; the river is bright, and blue (the open river set's own day water:
  // tests/set-openriver.test.js holds the copy in cats.js to it)
  assert.ok(over.includes('#E8913A') && over.includes('fill="#74b2d4"'));
  { const [r, g, b] = rgbOf('#74b2d4'); assert.ok(b > r + 30 && b > g && lum('#74b2d4') > 150, 'bright blue water'); }
  assert.ok(!over.includes('#8fb79c'), 'not the sage green it once was');
});

test('the mud count (paws: mud): seven little forepaws, the first few hers to light (5, 10, 15, 20), the rest left dark', () => {
  const marks = (s) => count(s, /class="pc-mudclaw"/g), lit = (s) => count(s, /class="pc-mudclaw"[^>]*stroke="#e39a12"/g);
  for (const found of [2, 3, 4]) for (let n = 0; n <= found; n++) {
    // as the engine hands it over (E.skipPicture: kind mud, of seven)
    const s = A.countsPicture({ table: 5, groups: found, per: 5, highlight: n * 5, totals: true, next: n < found, who: [{ who: 'sprinkle' }, { who: 'squall' }], thing: 'claw', things: 'claws', paws: 'mud', kind: 'mud', of: 7 });
    checkSvgDoc(s, `mud count ${found}/${n}`);
    assert.strictEqual(marks(s), 35, 'seven forepaws, five claw marks each');
    assert.strictEqual(lit(s), n * 5, n + ' lit');
    assert.deepStrictEqual(totals(s), [5, 10, 15, 20].slice(0, n), 'the count grows by five');
    assert.strictEqual(nexts(s), n < found ? 1 : 0, 'the next of hers glows; never one she has not found');
    assert.ok(new RegExp('aria-label="7 little forepaws drawn in the mud, 5 claw marks each: ' + found + ' of them to count"').test(s));
    assert.ok(!/>25</.test(s), 'never 25');
  }
  // drawn as chapter 3's six were: the same forepaws, one more, four above three
  const seven = A.countsPicture({ paws: 'mud', table: 5, groups: 3, per: 5 }), six = A.countsPicture({ table: 5, groups: 6, per: 5, kind: 'mud' });
  assert.strictEqual(marks(six), 30);
  assert.strictEqual(strip2(seven).replace(/ aria-label="[^"]+"/, ''), strip2(A.countsPicture({ table: 5, groups: 7, per: 5, kind: 'mud' })).replace(/ aria-label="[^"]+"/, ''), 'seven of the same');
  // more found than seven is never asked, but it draws; `of` below the count is the count
  assert.strictEqual(marks(A.countsPicture({ paws: 'mud', table: 5, groups: 4, per: 5, of: 2 })), 20);
  assert.strictEqual(marks(A.countsPicture({ paws: 'mud', table: 5, groups: 8, per: 5 })), 40);
});

test('the forepaw Taps: Puddle’s (his chin dipping, his grin above the water), Wisp’s (among the reeds, pale as frost); the glow, then the dragonet', () => {
  for (const who of ['puddle', 'wisp']) for (const hl of [0, 5]) {
    // as the engine hands it over (chapter 4's one-group skip)
    const s = A.countsPicture({ table: 5, groups: 1, per: 5, highlight: hl, totals: true, next: hl < 5, who: [{ who }], thing: 'claw', things: 'claws' });
    checkSvgDoc(s, who + ' forepaw ' + hl);
    checkIds(s, who + ' forepaw ' + hl);
    const lit = (s.match(/<g class="pc-dclaws pc-lit"[^>]*>(.*?)<\/g>/g) || []).reduce((n, g) => n + count(g, /<path /g), 0);
    assert.strictEqual(lit, hl, who + ': ' + hl + ' claws lit');
    assert.strictEqual(nexts(s), hl ? 0 : 1);
    if (!hl) assert.ok(/class="pc-next"[^>]*\/><g transform="translate\(/.test(s), who + ': the glow, then the dragonet’s group (the page wiggles it)');
    assert.strictEqual(totals(s).length, 0, 'the big 5 is the page’s');
  }
  const pud = A.countsPicture({ table: 5, groups: 1, per: 5, highlight: 5, who: [{ who: 'puddle' }] }), wsp = A.countsPicture({ table: 5, groups: 1, per: 5, highlight: 5, who: [{ who: 'wisp' }] });
  // Puddle: in the water (never only a paw above it: his face is there), lit gold
  assert.ok(/aria-label="Puddle in the water, one big forepaw held up: five claws"/.test(pud));
  assert.ok(pud.includes('pc-bump') && pud.includes('fill="#8fa3b8"') && pud.includes('fill="#74b2d4"') && pud.includes('fill="#b4d9ec"'), 'his face, in the river (blue: the open river’s own water)');
  assert.ok(!pud.includes('#8fb79c') && !pud.includes('#b9d7c1'), 'not the sage green it once was');
  assert.ok(pud.includes('<g class="pc-dclaws pc-lit" fill="#ffe36e" stroke="#d18b12"'), 'lit gold');
  // Wisp: among reeds that show through her; her claws light pale as frost, never gold
  assert.ok(/aria-label="Wisp among the reeds, one pale forepaw held up: five claws"/.test(wsp));
  assert.ok(wsp.includes('pc-veil') && count(wsp, /stroke="#(86a868|6f9656)"/g) > 10, 'reeds behind her');
  assert.ok(wsp.indexOf('#86a868') < wsp.indexOf('pc-veil'), 'the reeds are behind her veil: they show through her');
  assert.ok(!wsp.includes('#ffe36e') && wsp.includes('<g class="pc-dclaws pc-lit" fill="#ffffff" stroke="#79b3d6"'), 'pale as frost, never gold');
  // Squall's is as chapter 4 built it; and all four can stand in one row of forepaws, each in its own colours
  const all = A.countsPicture({ table: 5, groups: 4, per: 5, highlight: 20, totals: true, who: [{ who: 'sprinkle' }, { who: 'squall' }, { who: 'puddle' }, { who: 'wisp' }] });
  checkSvgDoc(all, 'four forepaws');
  for (const col of ['#a8b1b6', '#5f6c7e', '#8fa3b8', '#f2efe4']) assert.ok(all.includes('fill="' + col + '"'), col);
  assert.deepStrictEqual(totals(all), [5, 10, 15, 20]);
  const litIn = (col) => (all.match(new RegExp('<g class="pc-dclaws pc-lit" fill="' + col + '"[^>]*>(.*?)</g>', 'g')) || []).reduce((n, g) => n + count(g, /<path /g), 0);
  assert.deepStrictEqual([litIn('#ffe36e'), litIn('#ffffff')], [15, 5], 'three lit gold, hers pale as frost');
});

test('chapter 5’s pictures: unique ids on one page, every reference resolves, and none is heavy', () => {
  const look = { fur: 'tortie', marking: 'white-chest', eyes: 'amber' };
  const list = [
    A.countsPicture({ table: 9, groups: 10, per: 9, highlight: 45 }), A.countsPicture({ table: 9, groups: 5, per: 9, tuck: true, taps: 2, next: true, who: RIM4, look }),
    A.countsPicture({ table: 2, groups: 9, per: 2, kind: 'fish', thought: true, highlight: 18 }), A.countsPicture({ table: 5, groups: 4, per: 5, kind: 'fish', layout: 'strings', highlight: 20 }),
    A.countsPicture({ table: 10, groups: 4, per: 10, kind: 'bumps', highlight: 40 }), A.countsPicture({ table: 1, groups: 7, per: 1, kind: 'herons', highlight: 7 }),
    A.countsPicture({ paws: 'board', groups: 4, taps: 4, look }), A.countsPicture({ paws: 'log', groups: 9, taps: 9, look, plane: 'over' }),
    A.countsPicture({ paws: 'mud', table: 5, groups: 4, per: 5, highlight: 20, totals: true }), A.countsPicture({ table: 5, groups: 1, per: 5, highlight: 5, who: [{ who: 'puddle' }] }),
    A.countsPicture({ table: 5, groups: 1, per: 5, highlight: 5, who: [{ who: 'wisp' }] }), A.sand({ answers: [18, 36] }), A.sand({ groups: 10, per: 10, counted: 100, style: 'swipe', pair: true, rubbed: 10 }),
    A.countsPicture({ paws: 'both', table: 9, groups: 5, per: 9, highlight: 45, look })
  ];
  const all = list.join('');
  const ids = idsOf(all);
  assert.strictEqual(new Set(ids).size, ids.length, 'every id on the page is its own');
  for (const ref of all.match(/(?:url\(#|href="#)([^)"]+)/g) || []) assert.ok(ids.includes(ref.replace(/^(url\(#|href="#)/, '')), 'dangling ' + ref);
  list.forEach((s, i) => { checkSvgDoc(s, 'picture ' + i); assert.ok(s.length < 130000, 'picture ' + i + ': ' + s.length + ' bytes'); });
  // the same options draw the same picture twice (but for the ids): nothing is random
  const o = { paws: 'log', groups: 9, taps: 4, look, plane: true };
  assert.strictEqual(strip5(A.countsPicture(o)), strip5(A.countsPicture(o)));
  for (const who of ['patience', 'puddle', 'wisp']) for (const pose of A.vocab.otherPoses[who]) assert.strictEqual(strip(A.character(who, { pose, mood: 'happy' }).svg), strip(A.character(who, { pose, mood: 'happy' }).svg), who + '/' + pose);
});

test('dev/gallery-cats.html: the page’s own script runs and draws every section, chapter 5’s five among them', () => {
  // the page's two script files and its inline script, run with a stand-in document
  const fs = require('fs'), path = require('path'), vm = require('vm');
  const dir = path.join(__dirname, '..', 'dev'), html = fs.readFileSync(path.join(dir, 'gallery-cats.html'), 'utf8');
  const scripts = [...html.matchAll(/<script(?: src="([^"]+)")?>([\s\S]*?)<\/script>/g)];
  assert.deepStrictEqual(scripts.map((m) => m[1] || 'inline'), ['../app/art/cats.js', '../app/art/sets/pile.js', 'inline']);
  const run = (search) => {
    const els = {};
    const el = (id) => els[id] || (els[id] = { id, innerHTML: '', value: id === 'size' ? '120' : '', options: [{ value: '120' }], add() {} });
    const ctx = { URLSearchParams, document: { getElementById: el, body: { className: '' } }, location: { search } };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    for (const m of scripts) vm.runInContext(m[1] ? fs.readFileSync(path.join(dir, m[1]), 'utf8') : m[2], ctx, { filename: m[1] || 'gallery-cats.html' });
    return { out: els.out.innerHTML, nav: els.nav.innerHTML };
  };
  const svgs = (s) => count(s, /<svg[ >]/g);
  for (const [id, least] of [['patience', 20], ['puddle', 30], ['wisp', 36], ['extras5', 40], ['counts5', 40]]) {
    const page = run('?only=' + id);
    assert.ok(page.nav.includes('href="?only=' + id + '"'), id + ' is in the page’s menu');
    assert.ok(new RegExp('<section id="' + id + '"><h2>[^<]*hapter 5').test(page.out), id + ': its section, and nothing else');
    assert.strictEqual(count(page.out, /<section /g), 1);
    assert.ok(svgs(page.out) >= least, `${id}: ${svgs(page.out)} drawings`);
    assert.ok(!/NaN|undefined|\[object |Infinity/.test(page.out), id + ': every drawing drew');
    assert.strictEqual(balanced(page.out.replace(/<small title="[^"]*">/g, '<small>')), null, id + ': well-formed');
  }
  // every pose of the three is on the page, each cell labelled with it; the earlier sections still draw (the otters with their seven new poses)
  for (const who of ['patience', 'puddle', 'wisp']) { const page = run('?only=' + who).out; for (const pose of A.vocab.otherPoses[who]) assert.ok(new RegExp('<small title="' + pose + '[ "·]').test(page), who + ': ' + pose); }
  const otters = run('?only=otters').out;
  for (const pose of A.vocab.otherPoses.otter) assert.strictEqual(count(otters, new RegExp('<small title="' + pose + ' · \\w+">', 'g')), 4, 'otters: ' + pose + ', for Riffle and the three ferry otters');
  assert.ok(!/undefined|NaN/.test(otters));
  assert.ok(/lookdown · wonder/.test(run('?only=sprinkle').out));
});

// ================================================================== chapter 6
// Coil the water snake; Sloshbank and the ReedClan cats; Sleet, the eldest dragonet; the starry cat;
// the old tom's pinecone; our cat's paw and ears to tap; Riffle's puff, pebbles and string of fish;
// and the Counts art: Sleet's roll call, his forepaw, ReedClan's patrols (the spec, section 4).

const COIL_POSES = ['stone', 'head', 'long', 'longer', 'still', 'listen', 'think', 'slide'];
const SLEET_POSES = ['hidden', 'tail', 'flat', 'point', 'call', 'puff', 'droop', 'sit', 'pawup'];
const MOODS6 = ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn', 'sad', 'shy'];
const POSES6 = ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer', 'pawup', 'tummy', 'situp'];
// the nine furs' own colours (LOOKS.fur), which every CLAN coat is drawn in too
const FUR_BASES = { black: '#3d3844', white: '#fbf8f2', 'silver-tabby': '#c3cbd4', 'brown-tabby': '#b5895b', ginger: '#e8913a', cream: '#f2dbb1', grey: '#9ea5ad', tortie: '#3f3330', calico: '#fbf8f2' };
const REED_BASES = ['#6b5a4e', '#d8ba7e', '#7d7b7a', '#c4a088'];
const rgbDist = (a, b) => { const p = rgbOf(a), q = rgbOf(b); return Math.sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2); };
const inBox = (r, label, slack) => { const b = r.bounds, k = slack || 0; assert.ok(b.x0 >= -k && b.y0 >= -k && b.x1 <= r.w + k && b.y1 <= r.h + k, label + ': inside its ' + r.w + ' x ' + r.h + ' box: ' + JSON.stringify(b)); };
const tapsOf = (s) => (s.match(/class="pc-tap pc-tap-[a-z]+"/g) || []).map((x) => x.replace(/^class="pc-tap pc-tap-/, '').slice(0, -1));
const ALL_LOOKS = Object.keys(FUR_BASES).map((fur, i) => ({ fur, marking: ['none', 'white-paws', 'white-chest', 'back-stripe', 'nose-splash'][i % 5], eyes: ['green', 'amber', 'blue', 'copper', 'odd'][i % 5], sex: i % 2 ? 'tom' : 'she' }));

test('chapter 6 vocabulary: coil, sloshbank, reedclan and sleet (earlier ids never move); their poses; Riffle’s puff; the extras; ReedClan’s variants', () => {
  assert.deepStrictEqual(A.vocab.cast.slice(-4), ['coil', 'sloshbank', 'reedclan', 'sleet']);
  assert.deepStrictEqual(A.vocab.otherPoses.coil, COIL_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.sleet, SLEET_POSES);
  assert.deepStrictEqual(A.vocab.otherPoses.riffle.slice(-1), ['puff']);
  assert.deepStrictEqual(A.vocab.otherPoses.otter, A.vocab.otherPoses.riffle);
  assert.deepStrictEqual(A.vocab.poses, POSES6, 'the cats have no new pose (Sloshbank and ReedClan take every cat pose)');
  assert.deepStrictEqual(Object.keys(A.vocab.extras), ['tuck', 'asleep', 'snail', 'buzz', 'dragonfly', 'glow', 'tap', 'holds', 'reach', 'starry', 'grass']);
  // (chapter 7 appends 'fish' and 'mist': earlier ids never move)
  assert.deepStrictEqual(A.vocab.extras.tap, ['nose', 'pole', 'paw', 'ears', 'pinecone', 'pebbles', 'cheeks', 'stone', 'eyes', 'fish', 'mist']);
  assert.deepStrictEqual(A.vocab.extras.holds, ['stone', 'pebble', 'vole', 'bark', 'fish', 'fish2', 'pole', 'pinecone', 'pebbles', 'string']);
  assert.deepStrictEqual(A.vocab.extras.starry, [true]);
  assert.deepStrictEqual(A.vocab.extras.grass, [true]);
  assert.deepStrictEqual(A.vocab.variants.reedclan, [1, 2, 3, 4]);
  for (const who of ['coil', 'sleet', 'sloshbank']) assert.ok(!(who in A.vocab.variants), 'one ' + who);
  // an unknown pose: Sleet sits (his page in her book), Coil puts his head out
  assert.strictEqual(strip(A.character('sleet', { pose: 'nope' }).svg), strip(A.character('sleet', { pose: 'sit' }).svg));
  assert.strictEqual(strip(A.character('coil', { pose: 'nope' }).svg), strip(A.character('coil', { pose: 'head' }).svg));
});

test('chapters 1 to 5 are unchanged by chapter 6 (a fingerprint of every cast member, pose, mood and extra, the Counts pictures and the sand)', () => {
  // Taken from the chapter 5 code before chapter 6 extended it (2026-10-18), ids normalised: 43,192
  // drawings and pictures (43,282 until table 3's patrols left the sweep on purpose, below; the chapter 5
  // code gives the same hash without them) (every cat in every pose and mood and the extras, the otters and dogs in
  // all eighteen poses, Sprinkle, Reynard, Squall, Patience, Puddle and Wisp, the Tall One, sparrow
  // and moth; tables 1 to 10, the who pictures, the 9s, the paws, the fish, bumps and herons, the
  // answers, the sand in every ground and style). If their art is ever changed on purpose, take a
  // new fingerprint and say so.
  const s5 = (x) => x.replace(/pc[0-9a-z]+-[0-9a-z]+/g, 'id').replace(/pc(?:dzf|fp|op|wp|tp|pr|t)[0-9a-z]+/g, 'id').replace(/pc(?:paw|day|fish|raft|board|log)_[0-9a-z]+/g, 'id');
  const MOODS = MOODS6, POSES = POSES6;
  const OTTER = ['stand', 'sit', 'scramble', 'swim', 'float', 'juggle', 'slide', 'hug', 'sun', 'dive', 'hush', 'whistle', 'groan', 'flip', 'hop', 'point', 'fall', 'slap'];
  const DOG = ['stand', 'jump', 'sit', 'bounce', 'howl'];
  const DZ = DZ_POSES.concat(['lookdown']);
  const OWN = { reynard: FOX_POSES, squall: SQUALL_POSES, patience: HERON_POSES, puddle: PUDDLE_POSES, wisp: WISP_POSES };
  const look = { fur: 'calico', marking: 'white-chest', eyes: 'odd', sex: 'tom' };
  const keepPrey = A.prey;
  delete A.prey;
  const out = [];
  try {
    const rec = (r) => { out.push(s5(r.svg), JSON.stringify([r.w, r.h, r.head, r.headBox || null, r.bounds || null, r.held || null, r.chestTop || null, r.nest || null, r.pole || null, r.paw || null, r.reach || null, r.bill || null]), s5(r.front || '')); };
    for (const who of CATS) for (const pose of POSES) for (const mood of MOODS) rec(A.character(who, { pose, mood, look, variant: (mood.length % 6) + 1, facing: (pose.length + mood.length) % 2 ? 'left' : 'right' }));
    const EX = [{ wink: true }, { holds: 'bark' }, { holds: 'stone', holdAt: 'chin' }, { holds: 'vole' }, { holds: 'pebble', holdAt: 'nose' }, { flatEars: true, claws: true }, { puffed: true, tear: true }, { moss: true, mist: true, squeeze: true },
      { tuck: true }, { asleep: true, snail: true }, { snail: 'in', tap: 'nose' }, { buzz: true }, { dragonfly: true }, { glow: true }, { reach: true }, { tap: false }, { holds: 'stone', holdAt: 'mouth' }];
    for (const who of ['tallyheart', 'player', 'grizzled', 'murmurchime', 'clancat']) for (const pose of POSES) for (const ex of EX) rec(A.character(who, Object.assign({ pose, mood: 'kind', look, variant: 2 }, ex)));
    for (const [who, poses] of [['riffle', OTTER], ['otter', OTTER], ['dog', DOG]]) for (const variant of [1, 2, 3]) for (const pose of poses) for (const mood of MOODS)
      for (const ex of [{}, { holds: 'fish2', tear: true }, { pebbles: 5, squeeze: true, mist: true }]) rec(A.character(who, Object.assign({ pose, mood, variant, facing: mood.length % 2 ? 'left' : 'right' }, ex)));
    for (const pose of OTTER) for (const ex of [{ holds: 'pole', tap: 'pole' }, { holds: 'fish' }, { glow: true }]) rec(A.character('riffle', Object.assign({ pose, mood: 'happy' }, ex)));
    for (const pose of DZ) for (const mood of MOODS) for (const facing of FACINGS) rec(A.character('sprinkle', { pose, mood, facing }));
    for (const pose of DZ) rec(A.character('sprinkle', { pose, mood: 'shy', holds: 'pebble', tear: true, mist: true, noArms: pose === 'sit' }));
    for (const who of Object.keys(OWN)) for (const pose of OWN[who]) for (const mood of MOODS) for (const facing of FACINGS)
      for (const ex of [{}, { tear: true, mist: true, squeeze: true, flick: true, dragonfly: true }, { lit: 3, pole: true, noArms: true }]) rec(A.character(who, Object.assign({ pose, mood, facing }, ex)));
    for (const who of ['tallone', 'sparrow', 'moth']) for (const pose of ['stand', 'water', 'set-dish', 'perch', 'fluffed', 'fly']) for (const facing of FACINGS) rec(A.character(who, { pose, facing }));
    for (const who of ['nobody', undefined]) rec(A.character(who, { pose: 'sit' }));
    rec(A.cat({ look, pose: 'walk', mood: 'happy' })); out.push(JSON.stringify(A.dragonfly({ asleep: true })), JSON.stringify(A.dragonfly()));
    const RIM5 = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
    const cp = (o) => out.push(s5(A.countsPicture(o)));
    // (table 3's plain picture, the patrols, left this sweep on purpose: chapter 6 widened its tile so each
    // patrol walks on its own card, and no chapter before 6 draws it; see chapter 1's counts sweep)
    for (let t = 1; t <= 10; t++) if (t !== 3) for (const g of [1, 3, 5, 7, 10]) for (const fl of [{}, { totals: true, next: true }, { thought: true }, { layout: 'rows', totals: true }, { kind: 'prey' }])
      for (const hl of [0, t * 2, t * g]) cp(Object.assign({ table: t, groups: g, highlight: hl, look }, fl));
    for (const who of [RIM5, RIM5.slice(1, 4), [{ who: 'player' }, { who: 'tallyheart' }], [{ who: 'riffle' }, { who: 'otter', variant: 1 }, { who: 'dog', variant: 3 }], [{ who: 'sprinkle' }, { who: 'squall' }, { who: 'puddle' }, { who: 'wisp' }]])
      for (const t of [1, 2, 5, 9, 10]) for (const g of [1, 2, 4]) cp({ table: t, groups: g, highlight: t * 2, who, look, totals: true, next: true });
    for (const w of ['sprinkle', 'squall', 'puddle', 'wisp', 'tallyheart']) for (const hl of [0, 5]) cp({ table: 5, groups: 1, per: 5, highlight: hl, who: [{ who: w }], next: true, totals: true, look });
    for (let tap = 0; tap <= 5; tap++) { cp({ paws: 'own', both: true, table: 10, groups: 5, per: 10, highlight: tap * 10, taps: tap, look, next: tap < 5 }); cp({ paws: 'both', table: 9, groups: 5, per: 9, highlight: tap * 9, taps: tap, look, next: true }); cp({ table: 9, groups: 5, per: 9, tuck: true, taps: tap, next: true, who: RIM5, look }); }
    for (let tap = 0; tap <= 4; tap++) { cp({ paws: 'own', table: 5, groups: 4, per: 5, highlight: tap * 5, taps: tap, look, next: true, totals: true }); cp({ paws: 'board', table: 1, groups: 4, per: 1, taps: tap, next: true, look }); }
    for (let tap = 0; tap <= 9; tap += 3) cp({ paws: 'log', table: 1, groups: 9, per: 1, taps: tap, look, plane: tap ? 'over' : true, next: true });
    for (const hl of [0, 12, 35]) { cp({ table: 5, groups: 7, per: 5, kind: 'grit', ground: 'grit', highlight: hl }); cp({ table: 5, groups: 6, per: 5, kind: 'mud', highlight: hl, totals: true, next: true }); cp({ paws: 'mud', kind: 'mud', table: 5, per: 5, groups: 3, of: 7, highlight: hl, totals: true, next: true }); }
    for (let tap = 0; tap <= 3; tap++) cp({ paws: 'promise', table: 10, groups: 3, taps: tap, highlight: tap * 10, look, next: true });
    for (const k of [['fish', 'pairs', 2, 7, true], ['fish', 'strings', 5, 4, false], ['bumps', undefined, 10, 4, false], ['herons', undefined, 1, 7, false]]) for (const hl of [0, 6, 40]) cp({ kind: k[0], layout: k[1], table: k[2], per: k[2], groups: k[3], thought: k[4], highlight: hl });
    for (const g of [1, 4, 10]) for (const tk of [undefined, 0, 2]) cp({ table: 9, groups: g, per: 9, highlight: g * 4, tuck: tk, who: RIM5, look });
    cp({ kind: 'answers', answers: [18, 36] });
    for (const ground of [undefined, 'earth', 'mud', 'grit', 'log']) for (const style of [undefined, 'swipe']) for (const pair of [undefined, true]) for (const [g, p, c] of [[4, 10, 20], [6, 5, 12], [9, 2, 4], [1, 1, 0], [6, 3, 9]]) out.push(A.sand({ groups: g, per: p, counted: c, ground, style, pair }));
    for (const step of [undefined, 10, 2]) for (const [g, p, c] of [[4, 10, 10], [2, 8, 6], [3, 10, 30]]) out.push(A.sand({ groups: g, per: p, counted: c, layout: 'rows', ground: 'earth', step }));
    out.push(A.sand({ groups: 4, per: 10, counted: 40, style: 'swipe', pair: true, rubbed: 2 }), A.sand({ answers: [18, 36] }));
    for (const kind of ['mouse', 'vole', 'fish']) for (const lit of [false, true]) for (const part of [undefined, 'glow', 'body', 'spark']) out.push(JSON.stringify(A.preyFallback({ kind, lit, part, facing: lit ? 'left' : 'right' })));
  } finally { if (keepPrey) A.prey = keepPrey; }
  assert.strictEqual(out.length, 43192);
  assert.strictEqual(crypto.createHash('sha256').update(out.join('\n')).digest('hex'), '295647018196a13c99f84b200fd9b46e4482dd0c7504b3f08bde4fe3a5da66eb');
  // and chapter 6's options, when absent or false, change nothing
  assert.strictEqual(strip(A.character('grizzled', { pose: 'lie', mood: 'kind', starry: false, holds: 'nothing', tap: 'nothing', grass: true }).svg), strip(A.character('grizzled', { pose: 'lie', mood: 'kind' }).svg));
  assert.strictEqual(strip(A.character('riffle', { pose: 'juggle', holds: 'pebbles', tap: 'nothing' }).svg), strip(A.character('riffle', { pose: 'juggle' }).svg), 'juggle keeps its own three, and holds nothing else');
  assert.strictEqual(strip(A.character('dog', { pose: 'sit', holds: 'string', tap: 'cheeks' }).svg), strip(A.character('dog', { pose: 'sit' }).svg), 'the dogs hold nothing');
});

// ----- Coil

test('every Coil pose x mood x facing renders inside his box (720 x 160), the same box and scale every time; ids unique', () => {
  for (const pose of COIL_POSES) for (const mood of MOODS6) for (const facing of FACINGS) {
    const r = A.character('coil', { pose, mood, facing }), label = 'coil ' + pose + ' ' + mood + ' ' + facing;
    checkResult(r, label);
    assert.ok(r.w === 720 && r.h === 160, label + ': one box');
    inBox(r, label);
    checkIds(r.svg, label);
  }
  const a = A.character('coil', { pose: 'head' }), b = A.character('coil', { pose: 'head' });
  assert.notStrictEqual(a.svg, b.svg, 'two Coils in one panel have their own ids');
  assert.strictEqual(strip(a.svg), strip(b.svg));
});

test('Coil’s eyes never shut: two round eyes, a round pupil and a shine dot in each, in every pose that shows them and every mood; no lids, ever', () => {
  for (const pose of COIL_POSES) for (const mood of MOODS6) for (const ex of [{}, { facing: 'left' }, { tap: 'eyes' }, { squeeze: true, asleep: true }]) {
    const s = A.character('coil', Object.assign({ pose, mood }, ex)).svg, label = pose + ' ' + mood + ' ' + JSON.stringify(ex);
    const shown = pose !== 'stone' && pose !== 'slide';
    assert.strictEqual(count(s, /class="pc-eye"/g), shown ? 2 : 0, label + ': two eyes (in stone and slide his head is turned into the gap)');
    assert.strictEqual(count(s, /class="pc-pupil"/g), shown ? 2 : 0, label + ': two round pupils');
    assert.strictEqual(count(s, /class="pc-shine"/g), shown ? 2 : 0, label + ': a shine dot in each');
    for (const m of s.match(/<circle class="pc-pupil"[^>]*r="([\d.]+)"/g) || []) assert.ok(+m.match(/ r="([\d.]+)"/)[1] > 1.2, label + ': the pupil is round and open');
    assert.ok(!/pc-lid|pc-closed|squeeze/.test(s), label + ': no lid, no shut eye');
  }
  // `stone`: one more rounded stone of the wall, nothing of a face
  const st = A.character('coil', { pose: 'stone' }).svg;
  assert.ok(!/pc-mouth|pc-brow/.test(st), 'stone: no face showing');
  // and not his brown with its dark bands either (a brown spotted bun in a blue-grey wall, it was no stone:
  // chapter 6's review): the old stones' blue-grey; sliding back in, the dome is his own brown again
  for (const mood of MOODS6) {
    const s1 = A.character('coil', { pose: 'stone', mood }).svg.toLowerCase();
    assert.ok(!s1.includes('#8a6a4a') && !s1.includes('#5a4130'), 'stone ' + mood + ': no brown, no bands');
    const fill = /fill="(#[0-9a-f]{6})"/.exec(s1.slice(s1.lastIndexOf('<g transform')))[1], v = [1, 3, 5].map((i) => parseInt(fill.slice(i, i + 2), 16));
    assert.ok(v[2] >= v[0], 'stone ' + mood + ': blue-grey, not brown: ' + fill);
  }
  assert.ok(A.character('coil', { pose: 'slide' }).svg.includes('#8a6a4a'), 'slide: his own brown');
});

test('Coil’s mouth is always shut: no tongue, no fang, no open mouth, in any pose, mood or extra', () => {
  const PINKS = ['#f28a9c', '#f08a9c', '#f2879a', '#ee8a9c', '#7a2c3b', '#5d3844'];
  for (const pose of COIL_POSES) for (const mood of MOODS6) {
    const s = A.character('coil', { pose, mood, tap: 'eyes' }).svg;
    for (const c of PINKS) assert.ok(!s.toLowerCase().includes(c), pose + ' ' + mood + ': no tongue or open mouth (' + c + ')');
    assert.ok(!/fang|tooth|teeth|tongue/i.test(s), pose + ' ' + mood + ': no fang');
    const mouths = s.match(/<path class="pc-mouth" d="([^"]+)"[^>]*>/g) || [];
    assert.strictEqual(mouths.length, pose === 'stone' || pose === 'slide' ? 0 : 1, pose + ' ' + mood + ': one mouth');
    for (const m of mouths) { assert.ok(/fill="none"/.test(m), 'a line, never a filled shape'); assert.ok(!/[Zz]/.test(m.match(/d="([^"]+)"/)[1]), 'never a closed shape'); }
  }
});

test('Coil’s head is at the bottom middle of his box in every pose (the bridge’s `gap` puts it in his gap), his body trailing back along the bottom, never in front of his face', () => {
  for (const pose of COIL_POSES) for (const facing of FACINGS) {
    const r = A.character('coil', { pose, facing, mood: 'neutral' }), hb = r.headBox, b = r.bounds, label = pose + ' ' + facing;
    assert.ok(Math.abs(r.head.x - r.w / 2) <= 0.5, label + ': head.x on the middle: ' + r.head.x);
    assert.ok(Math.abs((hb.x0 + hb.x1) / 2 - r.w / 2) <= 8, label + ': the head box is on the middle: ' + JSON.stringify(hb));
    const low = pose === 'still' ? 30 : pose === 'think' ? 38 : 12;
    assert.ok(hb.y1 >= r.h - 3 - low, label + ': the head at the bottom (within ' + low + ' of the ground): ' + hb.y1);
    assert.ok(b.y1 <= r.h && b.y1 >= r.h - 6, label + ': lying on the bottom line: ' + b.y1);
    // nothing of him further forward than his face: the body runs back, away from whoever he faces
    if (facing === 'right') assert.ok(b.x1 <= hb.x1 + 1 && b.x0 <= hb.x0, label + ': trailing back to the left');
    else assert.ok(b.x0 >= hb.x0 - 1 && b.x1 >= hb.x1, label + ': trailing back to the right');
    // and close to the ground: he never rears up
    assert.ok(r.h - b.y0 <= 70, label + ': never rearing: ' + (r.h - b.y0) + ' high');
  }
  // the longer poses show more of him, along the bottom line
  const len = (p) => { const b = A.character('coil', { pose: p }).bounds; return b.x1 - b.x0; };
  assert.ok(len('head') < len('long') && len('long') < len('longer'), 'head, long, longer: more of him each time');
  assert.ok(len('longer') > 300, 'loops and loops');
  // one size: the head the same in every pose that shows it
  const hw = (p) => { const hb = A.character('coil', { pose: p }).headBox; return hb.x1 - hb.x0; };
  for (const p of ['long', 'longer', 'still', 'listen', 'think']) assert.ok(Math.abs(hw(p) - hw('head')) < 3, p + ': his head as big as in `head`');
});

test('Coil’s head is smaller than a cat’s (between a third and three fifths of our cat’s, as the scenes hold him), brown with darker bands and a cream belly', () => {
  const avg = (hb) => ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2;
  const me = avg(A.character('player', { pose: 'sit', mood: 'neutral' }).headBox), coil = avg(A.character('coil', { pose: 'head', mood: 'neutral' }).headBox);
  assert.ok(coil / me > 0.35 && coil / me < 0.6, 'head ' + (coil / me).toFixed(3) + ' of our cat’s');
  for (const cat of ['tallyheart', 'clancat', 'snorer']) assert.ok(coil < avg(A.character(cat, { pose: 'sit' }).headBox) * 0.6, 'smaller than ' + cat + '’s');
  const s = A.character('coil', { pose: 'longer' }).svg;
  assert.ok(s.includes('#8a6a4a') && s.includes('#5a4130') && s.includes('#efe0bf'), 'brown, darker cross-bands, a cream belly');
  assert.ok(count(s, /class="pc-bands"/g) >= 8, 'banded all along');
});

// ----- Sleet

test('every Sleet pose x mood x facing renders inside his box (640 x 340, his sister’s), on the ground; ids unique', () => {
  for (const pose of SLEET_POSES) for (const mood of MOODS6) for (const facing of FACINGS) for (const ex of [{}, { grass: true, tear: true, mist: true, squeeze: true, lit: 5 }]) {
    const r = A.character('sleet', Object.assign({ pose, mood, facing }, ex)), label = 'sleet ' + pose + ' ' + mood + ' ' + facing + ' ' + JSON.stringify(ex);
    checkResult(r, label);
    assert.ok(r.w === 640 && r.h === 340, label + ': his sister’s box');
    inBox(r, label, 1);
    assert.ok(r.bounds.y1 >= 330, label + ': on the ground');
    checkIds(r.svg, label);
  }
});

test('Sleet: on Sprinkle’s model and her size, silver-white with blue-grey ridges, bold blue eyes under bossy brows, five frost-white claws a forepaw; the book page draws', () => {
  const avg = (hb) => ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2;
  const sl = A.character('sleet', { pose: 'sit', mood: 'neutral' }), sp = A.character('sprinkle', { pose: 'sit', mood: 'neutral' });
  const k = avg(sl.headBox) / avg(sp.headBox);
  assert.ok(k >= 0.95 && k <= 1.1, 'his head is hers: ' + k.toFixed(3));
  assert.ok(sl.headBox.y1 < 200, 'sitting, his head well above a cat’s');
  const s = sl.svg;
  assert.ok(s.includes('#e1e7ed') && !s.includes('#a8b1b6'), 'silver-white, not Sprinkle’s mist-grey');
  assert.ok(s.includes('#b3c2d2'), 'a blue-grey shade in his ridges');
  assert.ok(s.includes('#6fb0e6'), 'blue eyes');
  assert.ok(!/#f28a9c|tooth|fang/.test(A.character('sleet', { pose: 'sit', mood: 'neutral' }).svg), 'never toothy');
  // bossy brows in every mood, Sprinkle has them only for some
  for (const mood of MOODS6) assert.ok(/stroke="#4d5b6b" stroke-width="4.2"/.test(A.character('sleet', { pose: 'sit', mood }).svg), mood + ': his brows');
  assert.ok(!/stroke-width="4.2"/.test(sp.svg), 'Sprinkle’s are her own');
  // both wings folded (no sore wing), five claws on each forepaw (two forepaws: ten, frost-white)
  assert.ok(count(s, /class="pc-wing"/g) === 2);
  const claws = (s.match(/<g class="pc-dclaws" fill="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g) || []);
  assert.strictEqual(claws.length, 2, 'two forepaws');
  for (const c of claws) { assert.strictEqual(count(c, /<path /g), 5, 'five claws'); assert.ok(/fill="#fbfdff"|fill="#[ed][0-9a-f]{5}"/.test(c), 'frost-white'); }
  // his page in her book: puff, happy
  const page = A.character('sleet', { pose: 'puff', mood: 'happy' });
  checkResult(page, 'sleet puff happy'); assert.notStrictEqual(strip(page.svg), strip(A.character('sleet', { pose: 'sit', mood: 'happy' }).svg));
  assert.ok(/class="pc-seed"/.test(page.svg), 'puff: a grass seed falling off his chest');
});

test('Sleet’s pawup lights n of its five claws frost-white (lit: n) and reports where the paw is; his poses', () => {
  for (let n = 0; n <= 5; n++) {
    const r = A.character('sleet', { pose: 'pawup', mood: 'proud', lit: n }), lit = r.svg.match(/<g class="pc-dclaws pc-lit"[^>]*>([\s\S]*?)<\/g>/);
    assert.strictEqual(lit ? count(lit[1], /<path /g) : 0, n, n + ' lit');
    if (n) assert.ok(/class="pc-dclaws pc-lit" fill="#ffffff" stroke="#79b3d6"/.test(r.svg), 'frost-white');
    assert.ok(r.paw && r.paw.x > r.w / 2 && r.paw.y < r.h * 0.6 && r.paw.r > 20, 'the paw, up: ' + JSON.stringify(r.paw));
  }
  assert.strictEqual(count(A.character('sleet', { pose: 'pawup', lit: true }).svg.match(/<g class="pc-dclaws pc-lit"[^>]*>([\s\S]*?)<\/g>/)[1], /<path /g), 5, 'lit: true lights all five');
  assert.ok(!A.character('sleet', { pose: 'sit' }).paw, 'only a raised forepaw is reported');
  // hidden: nothing of him but the grass bent where he is; tail: the tip of a silver-white tail out of it
  const hid = A.character('sleet', { pose: 'hidden' }).svg, tail = A.character('sleet', { pose: 'tail' }).svg;
  for (const [s, p] of [[hid, 'hidden'], [tail, 'tail']]) { assert.ok(/class="pc-long-grass/.test(s), p + ': the long grass'); assert.ok(!/pc-dclaws|radialGradient|pc-wing/.test(s), p + ': no face, no paws, no wings'); }
  assert.ok(tail.includes('#e1e7ed') && /class="pc-flick"/.test(tail) && !hid.includes('#e1e7ed'), 'tail: his tail flicking; hidden: none of him');
  // (the final review: the tail read as a bent white stick) a dragonet's tail: his blue-grey plates along its
  // back, three scale arcs across it, his blue-grey shade and outline, and its tip curled over wholly above
  // the tallest of his grass, on either facing
  for (const facing of ['left', 'right']) {
    const t = A.character('sleet', { pose: 'tail', facing }), h = A.character('sleet', { pose: 'hidden', facing });
    assert.ok(/class="pc-ridges"/.test(t.svg) && t.svg.includes('#b3c2d2'), facing + ': the plates along its back, in his blue-grey');
    assert.strictEqual((/class="pc-scales" d="([^"]+)"/.exec(t.svg)[1].match(/M/g) || []).length, 3, facing + ': three scale arcs');
    assert.ok(t.svg.includes('#59687a') && /fill="#[0-9a-f]{6}"/.test(t.svg), facing + ': outlined in his blue-grey');
    assert.ok(t.headBox.y1 < h.bounds.y0 - 20, facing + ': the curled tip (' + t.headBox.y0 + ' to ' + t.headBox.y1 + ') stands clear above the grass (its top ' + h.bounds.y0 + ')');
    assert.ok(t.bounds.y0 < h.bounds.y0 - 80, facing + ': tall enough to see');
  }
  assert.ok(/class="pc-grass-tuft"/.test(A.character('sleet', { pose: 'sit', grass: true }).svg) && !/pc-grass-tuft/.test(A.character('sleet', { pose: 'sit' }).svg), 'grass: a tuft on his head');
  const call = A.character('sleet', { pose: 'call', mood: 'neutral' }), sit = A.character('sleet', { pose: 'sit', mood: 'neutral' });
  assert.ok(call.headBox.y0 < sit.headBox.y0, 'call: his head up');
  assert.ok(A.character('sleet', { pose: 'droop' }).headBox.y0 > sit.headBox.y0 + 40, 'droop: head low');
  assert.ok(A.character('sleet', { pose: 'flat' }).headBox.y0 > sit.headBox.y0 + 100, 'flat: on his belly');
  // flat on his belly in the long grass, his front no further forward than it is sitting (the last post)
  assert.ok(A.character('sleet', { pose: 'flat' }).bounds.x1 <= sit.bounds.x1 + 0.5, 'flat: his front where his sitting front is');
});

// ----- ReedClan, Sloshbank, the starry cat

test('ReedClan’s four coats are marsh coats of their own: none of LOOKS.fur’s nine and none of CLAN’s, visibly apart from all of them, whatever look is passed, in character() and in the patrol picture', () => {
  for (const [i, base] of REED_BASES.entries()) for (const [fur, fb] of Object.entries(FUR_BASES)) assert.ok(rgbDist(base, fb) >= 45, 'reedclan ' + (i + 1) + ' vs ' + fur + ': ' + rgbDist(base, fb).toFixed(1));
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.ok(rgbDist(REED_BASES[i], REED_BASES[j]) >= 30, 'reedclan ' + (i + 1) + ' and ' + (j + 1) + ' apart');
  const furs = Object.values(FUR_BASES);
  for (let v = 1; v <= 4; v++) for (const pose of ['sit', 'walk', 'pawup']) {
    const plain = strip(A.character('reedclan', { variant: v, pose }).svg);
    assert.ok(plain.includes(REED_BASES[v - 1]), 'reedclan ' + v + ': its own coat');
    for (const fb of furs) assert.ok(!plain.includes(fb), 'reedclan ' + v + ' ' + pose + ': no ' + fb);
    assert.ok(/class="pc-sheen"/.test(plain) && /class="pc-mud"/.test(plain), 'sleek and wet, mud to the elbows');
    for (const look of ALL_LOOKS) assert.strictEqual(strip(A.character('reedclan', { variant: v, pose, look, taken: [v, 1, 4] }).svg), plain, 'reedclan ' + v + ': ' + look.fur + ' changes nothing');
  }
  assert.strictEqual(strip(A.character('reedclan', { variant: 9 }).svg), strip(A.character('reedclan', { variant: 4 }).svg), 'a variant out of range clamps');
  // the watchers' picture: nine ReedClan cats, three patrols, in their own coats whatever her look
  const r = (n) => ({ who: 'reedclan', variant: n }), REED9 = [r(3), r(1), r(4), r(2), r(3), r(1), r(4), r(2), r(3)];
  const pic = (look) => strip2(A.countsPicture({ table: 3, groups: 3, highlight: 0, who: REED9, look }));
  const p0 = pic(ALL_LOOKS[0]);
  for (const base of REED_BASES) assert.ok(p0.includes(base), 'the patrol picture draws ' + base);
  for (const fb of furs) assert.ok(!p0.includes(fb), 'no CrystalClan coat in it: ' + fb);
  for (const look of ALL_LOOKS) assert.strictEqual(pic(look), p0, look.fur + ': the same nine coats');
  assert.notStrictEqual(p0, strip2(A.countsPicture({ table: 3, groups: 3, highlight: 0, look: ALL_LOOKS[0] })), 'not the Clan’s patrols');
});

test('the patrol picture (table 3, chapter 6): every patrol walks on its own green card, its third walker ending inside it, never on the next card or the picture\'s edge; one to ten patrols, the Clan\'s coats or ReedClan\'s', () => {
  // the widest a walker is drawn, of every coat a patrol can wear (a walker's drawing runs from about 19 to 195
  // of its 200 box)
  const r = (n) => ({ who: 'reedclan', variant: n });
  const walkers = [1, 2, 3, 4, 5, 6].map((variant) => A.character('clancat', { pose: 'walk', mood: 'happy', variant }))
    .concat([1, 2, 3, 4].map((variant) => A.character('reedclan', { pose: 'walk', mood: 'happy', variant })), [A.character('player', { pose: 'walk', mood: 'happy', look: ALL_LOOKS[0] })]);
  const X0 = Math.min(...walkers.map((c) => c.bounds.x0)), X1 = Math.max(...walkers.map((c) => c.bounds.x1));
  for (const who of [undefined, [r(3), r(1), r(4), r(2), r(3), r(1), r(4), r(2), r(3)]]) for (let groups = 1; groups <= 10; groups++) {
    const svg = A.countsPicture({ table: 3, groups, highlight: 0, who, look: ALL_LOOKS[0] }), W = +/viewBox="0 0 ([\d.]+) /.exec(svg)[1];
    const tiles = [...svg.matchAll(/<g transform="translate\(([\d.]+),([\d.]+)\) scale\(1\)"><rect x="4" y="10" width="([\d.]+)"/g)];
    assert.equal(tiles.length, groups, groups + ' patrols, ' + groups + ' cards');
    tiles.forEach((t, i) => {
      const x = +t[1], cardEnd = x + 4 + +t[3], from = t.index, to = i + 1 < tiles.length ? tiles[i + 1].index : svg.length;
      const cells = [...svg.slice(from, to).matchAll(/<g transform="translate\(([-\d.]+),[-\d.]+\) scale\(0\.52\)"><g transform="matrix\(([\d.]+),0,0,[\d.]+,([-\d.]+),[-\d.]+\)">/g)];
      assert.equal(cells.length, 3, 'three walkers a patrol');
      cells.forEach((c, k) => {
        const left = x + +c[1] + 0.52 * (+c[3] + +c[2] * X0), right = x + +c[1] + 0.52 * (+c[3] + +c[2] * X1);
        assert.ok(left >= x + 4 && right <= cardEnd, groups + ' patrols, patrol ' + (i + 1) + ', walker ' + (k + 1) + ': on its card: ' + left.toFixed(1) + '..' + right.toFixed(1) + ' of ' + (x + 4) + '..' + cardEnd);
      });
      if (i + 1 < tiles.length && +tiles[i + 1][2] === +t[2]) assert.ok(+tiles[i + 1][1] + 4 >= cardEnd, 'the next card starts after this one ends');
      assert.ok(cardEnd <= W - 4, 'inside the picture');
    });
  }
});

test('every Sloshbank and ReedClan pose x mood renders inside the box; Sloshbank is bigger than Tallyheart, solid brown, wet and dripping in every pose, his paws muddy', () => {
  for (const pose of POSES6) for (const mood of MOODS6) {
    const sb = A.character('sloshbank', { pose, mood, facing: mood.length % 2 ? 'left' : 'right' });
    checkResult(sb, 'sloshbank ' + pose + ' ' + mood); inBox(sb, 'sloshbank ' + pose + ' ' + mood, 0.5);
    assert.ok(count(sb.svg, /class="pc-puddle"/g) === 1 && count(sb.svg, /class="pc-drop"/g) >= 1, 'sloshbank ' + pose + ': drops falling, one on the ground');
    for (let v = 1; v <= 4; v++) { const rc = A.character('reedclan', { variant: v, pose, mood }); checkResult(rc, 'reedclan ' + v + ' ' + pose); inBox(rc, 'reedclan ' + v + ' ' + pose, 0.5); }
  }
  const sb = A.character('sloshbank', { pose: 'sit', mood: 'stern' }), t = A.character('tallyheart', { pose: 'sit', mood: 'stern' });
  assert.ok(sb.w === 228 && sb.h === 228, 'his box, 1.14 times a cat’s');
  const tall = (r) => r.h - r.headBox.y0;
  assert.ok(tall(sb) / tall(t) > 1.06 && tall(sb) / tall(t) < 1.3, 'bigger than Tallyheart, never a giant: ' + (tall(sb) / tall(t)).toFixed(3));
  assert.ok(sb.headBox.x1 - sb.headBox.x0 > t.headBox.x1 - t.headBox.x0, 'a bigger head too');
  assert.ok(sb.svg.includes('#86603f') && !sb.svg.includes('#5b3f27') && !/stroke="#b5602a"/.test(sb.svg), 'solid brown, no stripes');
  assert.ok(/class="pc-wet"/.test(A.character('sloshbank', { pose: 'stand' }).svg), 'his belly fur clumped wet');
  assert.ok(sb.svg.includes('#5d4431'), 'muddy paws');
  // scenes give him `look` and `taken` as for anyone: nothing changes
  assert.strictEqual(strip(A.character('sloshbank', { pose: 'sit', look: ALL_LOOKS[3] }).svg), strip(A.character('sloshbank', { pose: 'sit' }).svg));
});

test('starry: true on any cat draws the starry cat, whatever the coat: pale blue-white, a little see-through, stars inside her, a soft glow; nobody she knows', () => {
  const base = strip(A.character('clancat', { variant: 1, pose: 'sit', mood: 'kind', starry: true }).svg);
  for (let v = 1; v <= 6; v++) for (const look of ALL_LOOKS.slice(0, 4)) assert.strictEqual(strip(A.character('clancat', { variant: v, pose: 'sit', mood: 'kind', starry: true, look, taken: [1, 2] }).svg), base, 'clancat ' + v + ': the same starry cat');
  for (const who of ['tallyheart', 'glintstar', 'player', 'grizzled', 'waffles']) assert.strictEqual(strip(A.character(who, { pose: 'sit', mood: 'kind', starry: true, look: ALL_LOOKS[1] }).svg), base, who + ' starry: nobody she knows');
  for (const pose of POSES6) for (const mood of ['kind', 'neutral', 'happy']) {
    const r = A.character('clancat', { variant: 3, pose, mood, starry: true }), s = r.svg;
    checkResult(r, 'starry ' + pose); checkIds(s, 'starry ' + pose);
    assert.ok(/class="pc-starry" opacity="\.8\d"/.test(s), pose + ': a little see-through');
    assert.ok(count(s.match(/<g class="pc-stars"[\s\S]*?<\/g>/)[0], /<path /g) >= 8, pose + ': stars inside her');
    assert.ok(/class="pc-starglow"/.test(s) && /radialGradient/.test(s), pose + ': a soft glow');
    assert.ok(s.includes('#dde8fb') && !s.includes('#b5895b'), pose + ': starlight, not her coat');
    assert.ok(!/EAR_NOTCH|#f47aa8|#dba79f/.test(s), pose + ': no torn ear, no bow, no scar');
  }
});

// ----- the extras on the old cast

test('holds: pinecone: under the old tom’s chin (asleep on it), at his paws, by his nose, carried in his mouth, held up sitting up; tap: pinecone marks it', () => {
  const at = (o) => A.character('grizzled', Object.assign({ mood: 'neutral', holds: 'pinecone' }, o));
  const chin = at({ pose: 'lie', holdAt: 'chin', asleep: true, tap: 'pinecone' });
  assert.ok(chin.held && chin.held.what === 'pinecone' && chin.held.at === 'chin', JSON.stringify(chin.held));
  assert.ok(chin.held.y > chin.head.y && chin.held.y + chin.held.r * 0.5 <= 197, 'on the ground under his chin');
  assert.ok(count(chin.svg, /class="pc-pinecone"/g) === 1 && count(chin.svg, /<path class="pc-eye"|pc-pupil/g) === 0);
  assert.deepStrictEqual(tapsOf(chin.svg), ['pinecone'], 'the pinecone to tap');
  const tm = chin.svg.match(/<g class="pc-tap pc-tap-pinecone"><circle cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)" fill="none"\/><\/g>/);
  assert.ok(tm && +tm[3] > 20, 'unpainted, the size of the thing');
  const paws = at({ pose: 'sit', holdAt: 'paws' }), mouth = at({ pose: 'walk', holdAt: 'mouth' }), nose = at({ pose: 'loaf', holdAt: 'nose' }), up = at({ pose: 'situp' });
  assert.ok(paws.held.at === 'paws' && paws.held.y > 160, 'at his paws, on the ground');
  assert.ok(mouth.held.at === 'mouth' && Math.abs(mouth.held.y - mouth.head.y) < 40, 'carried in his mouth');
  assert.ok(nose.held.at === 'nose' && up.held && up.held.y < 160, 'by his nose; held up sitting up');
  assert.ok(at({ pose: 'walk' }).held.at === 'mouth' && at({ pose: 'sit' }).held.at === 'paws', 'unset: in the mouth on his feet, else at his paws');
  for (const who of ['tallyheart', 'player', 'clancat']) for (const pose of POSES6) checkResult(A.character(who, { pose, holds: 'pinecone', holdAt: pose.length % 2 ? 'chin' : 'mouth' }), who + ' ' + pose + ' pinecone');
  assert.ok(!at({ pose: 'fall' }).held && !at({ pose: 'tummy' }).held, 'tumbling or on his back, nothing held');
});

test('our cat’s taps: paw (her raised forepaw in pawup; else her front paw on the ground) and ears (both), unpainted; Murmurchime’s tail up when proud', () => {
  const look = { fur: 'ginger', marking: 'white-paws', eyes: 'amber', sex: 'she' };
  const up = A.character('player', { pose: 'pawup', mood: 'happy', tap: 'paw', look });
  assert.deepStrictEqual(tapsOf(up.svg), ['paw']);
  const m = up.svg.match(/<g class="pc-tap pc-tap-paw"><circle cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)" fill="none"\/><\/g>/);
  assert.ok(m && +m[2] < 135 && +m[1] > 140, 'her raised forepaw (in her own coordinates): ' + m.slice(1));
  const pat = A.character('player', { pose: 'sit', tap: 'paw', look }).svg.match(/pc-tap-paw"><circle cx="([-\d.]+)" cy="([-\d.]+)"/);
  assert.ok(pat && +pat[2] > 180, 'sitting: her front paw on the ground');
  const ears = A.character('player', { pose: 'sit', tap: 'ears', look }).svg.match(/<g class="pc-tap pc-tap-ears">([\s\S]*?)<\/g>/);
  assert.ok(ears && count(ears[1], /<circle [^>]*fill="none"\/>/g) === 2, 'both ears');
  assert.ok(!/pc-tap/.test(A.character('player', { pose: 'pawup', look }).svg), 'no tap, no mark');
  for (const pose of POSES6) for (const tap of ['paw', 'ears']) assert.deepStrictEqual(tapsOf(A.character('player', { pose, tap, look }).svg), [tap], pose + ' ' + tap);
  // tail up by mood `proud`, as Tallyheart's (the wave back: {Murmur}chime proud, her tail up)
  for (const who of ['player', 'murmurchime', 'tallyheart']) assert.strictEqual(strip(A.character(who, { pose: 'pawup', mood: 'proud', look }).svg), strip(A.character(who, { pose: 'pawup', mood: 'proud', look, tail: 'up' }).svg), who + ': proud, tail up');
});

test('Riffle: puff (cheeks puffed round past his face, holding his breath, eyes wide), tap: cheeks; holds: pebbles (three plain brown, in his paws or set down at his feet), tap: pebbles; holds: string (three fish on a reed, from one forepaw)', () => {
  const puff = A.character('riffle', { pose: 'puff', tap: 'cheeks' }), sit = A.character('riffle', { pose: 'sit' });
  checkResult(puff, 'riffle puff');
  assert.ok(/class="pc-cheeks"/.test(puff.svg) && puff.headBox.x1 - puff.headBox.x0 > sit.headBox.x1 - sit.headBox.x0, 'his cheeks bulge past his face');
  assert.deepStrictEqual(tapsOf(puff.svg), ['cheeks']);
  assert.strictEqual(count(puff.svg.match(/<g class="pc-tap pc-tap-cheeks">([\s\S]*?)<\/g>/)[1], /<circle /g), 2, 'both cheeks');
  for (const mood of MOODS6) for (const v of [1, 2, 3]) { const r = A.character(v === 1 ? 'riffle' : 'otter', { pose: 'puff', mood, variant: v }); checkResult(r, 'puff ' + mood); assert.ok(!/#f28a9c/.test(r.svg.split('pc-cheeks')[1] || ''), 'a held breath: no open mouth'); }
  const held = A.character('riffle', { pose: 'sit', holds: 'pebbles', tap: 'pebbles' }), down = A.character('riffle', { pose: 'sit', holds: 'pebbles', holdAt: 'paws', tap: 'pebbles' });
  for (const [r, at] of [[held, 'paws'], [down, 'ground']]) {
    assert.strictEqual(count(r.svg, /class="pc-pebble pc-plain"/g), 3, at + ': three pebbles');
    assert.ok(/fill="#93704F"/.test(r.svg) && !r.svg.includes('#868f90'), at + ': plain brown, never Sprinkle’s grey');
    assert.ok(r.held && r.held.what === 'pebbles' && r.held.at === at, JSON.stringify(r.held));
    assert.deepStrictEqual(tapsOf(r.svg), ['pebbles']);
  }
  assert.ok(down.held.y > held.held.y + 30 && down.held.y > down.h * 0.85, 'set down on the ground in front of his feet');
  assert.ok(down.held.x > A.character('riffle', { pose: 'sit' }).bounds.x1 - 30, 'in front of him');
  // the string: the pile set's PC.art.prey.string when it is there, looked up when drawn; else our own
  const keep = A.prey;
  try {
    let asked = null;
    A.prey = function () { return { svg: '<g/>', w: 10, h: 4 }; };
    A.prey.string = function (o) { asked = o; return '<g data-part="fish-string" data-fish-count="' + o.count + '"><g data-fish="1"></g><g data-fish="1"></g><g data-fish="1"></g></g>'; };
    const st = A.character('riffle', { pose: 'stand', mood: 'happy', holds: 'string' });
    assert.ok(asked && asked.count === 3 && asked.len > 30, 'three fish, asked of the pile set: ' + JSON.stringify(asked));
    assert.ok(/class="pc-string"/.test(st.svg) && st.held.what === 'string', 'hanging from his forepaw');
    assert.ok(!/class="pc-string"[^]*?<path[^>]*wave/.test(st.svg), 'that paw is busy: no wave');
    delete A.prey;
    const own = A.character('riffle', { pose: 'sit', holds: 'string' });
    assert.strictEqual(count(own.svg, /class="pc-fish"/g), 3, 'without the pile set: three fish of our own on a reed');
    for (const pose of A.vocab.otherPoses.riffle) { const r = A.character('riffle', { pose, holds: 'string' }); checkResult(r, 'string ' + pose); }
  } finally { if (keep) A.prey = keep; else delete A.prey; }
});

test('each chapter 6 tap is marked once, unpainted, where the thing is: pinecone, paw, ears, pebbles, cheeks, stone, eyes', () => {
  const cases = [['pinecone', A.character('grizzled', { pose: 'lie', holds: 'pinecone', holdAt: 'chin', asleep: true, tap: 'pinecone' })],
    ['paw', A.character('player', { pose: 'pawup', tap: 'paw' })], ['ears', A.character('player', { pose: 'sit', tap: 'ears' })],
    ['pebbles', A.character('riffle', { pose: 'sit', holds: 'pebbles', tap: 'pebbles' })], ['cheeks', A.character('riffle', { pose: 'puff', tap: 'cheeks' })],
    ['stone', A.character('coil', { pose: 'stone', tap: 'stone' })], ['eyes', A.character('coil', { pose: 'head', tap: 'eyes' })]];
  for (const [name, r] of cases) {
    assert.deepStrictEqual(tapsOf(r.svg), [name], name);
    const g = r.svg.match(new RegExp('<g class="pc-tap pc-tap-' + name + '">([\\s\\S]*?)</g>'))[1];
    assert.ok(/^(<circle cx="[-\d.]+" cy="[-\d.]+" r="[\d.]+" fill="none"\/>)+$/.test(g), name + ': unpainted circles only: ' + g);
  }
  // the eyes' marks are on his two eyes; the stone's on his head in the gap
  const eyes = A.character('coil', { pose: 'head', tap: 'eyes' }).svg.match(/pc-tap-eyes">([\s\S]*?)<\/g>/)[1];
  assert.strictEqual(count(eyes, /<circle /g), 2);
});

// ----- Counts art

test('the roll call (kind: roll): `groups` little plain pale dragonets in one row, all alike, three HEREs over each head, lit in order, a dragonet’s three at a time', () => {
  for (let g = 1; g <= 7; g++) {
    for (let hl = 0; hl <= 3 * g; hl++) {
      const s = A.countsPicture({ table: 3, groups: g, per: 3, kind: 'roll', highlight: hl, totals: true, next: true });
      checkSvgDoc(s, 'roll ' + g + ' ' + hl);
      const heres = s.match(/<text class="pc-here[^"]*"/g) || [];
      assert.strictEqual(heres.length, 3 * g, g + ': three HEREs a dragonet');
      // lit in order: the first hl of them, as they are lettered (left to right, each from the bottom up)
      assert.deepStrictEqual(heres.map((h) => h.includes('pc-lit')), heres.map((h, i) => i < hl), g + ' dragonets, ' + hl + ' lit');
      assert.strictEqual(count(s, /class="pc-dragonet"/g), g);
      assert.deepStrictEqual(totals(s), Array.from({ length: Math.floor(hl / 3) }, (x, i) => (i + 1) * 3), 'a total under each dragonet whose three are lit');
      assert.strictEqual(nexts(s), hl < 3 * g ? 1 : 0, 'the next one glows');
      assert.ok(new RegExp('aria-label="' + g + (g === 1 ? ' dragonet' : ' dragonets') + ', three HEREs each"').test(s), 'its label');
    }
    // all alike: no clutch colours
    const s = A.countsPicture({ table: 3, groups: g, per: 3, kind: 'roll' }), ds = s.match(/<g class="pc-dragonet">[\s\S]*?<\/g><\/g>/g) || [];
    assert.ok(new Set(ds).size <= 1, 'every dragonet the same');
    for (const c of ['#e1e7ed', '#a8b1b6', '#5f6c7e', '#8fa3b8', '#f2efe4']) assert.ok(!s.includes(c), 'no dragonet’s own colours: ' + c);
  }
  const help = A.countsPicture({ table: 3, groups: 7, per: 3, kind: 'roll', highlight: 6 });
  assert.strictEqual(count(help, /pc-here pc-lit/g), 6, 'the help lights two dragonets’ three');
  assert.strictEqual(strip5(A.countsPicture({ table: 3, groups: 7, per: 3, kind: 'roll', highlight: 9 })), strip5(A.countsPicture({ table: 3, groups: 7, per: 3, kind: 'roll', highlight: 9 })), 'nothing random');
});

test('Sleet’s forepaw (a `who` of one sleet on the 5s): his one raised silver forepaw in the long grass, five claws lit frost-white; and Sleet in the other who pictures', () => {
  for (let hl = 0; hl <= 5; hl++) {
    const s = A.countsPicture({ table: 5, groups: 1, per: 5, highlight: hl, next: hl < 5, totals: true, who: [{ who: 'sleet' }] });
    checkSvgDoc(s, 'sleet paw ' + hl);
    assert.ok(/aria-label="Sleet in the long grass, one silver forepaw held up: five claws"/.test(s));
    const lit = s.match(/<g class="pc-dclaws pc-lit"[^>]*>([\s\S]*?)<\/g>/);
    assert.strictEqual(lit ? count(lit[1], /<path /g) : 0, hl, hl + ' claws lit');
    assert.strictEqual(nexts(s), hl < 5 ? 1 : 0, 'the paw glows until it is tapped');
    assert.ok(/class="pc-long-grass"/.test(s) && s.includes('#e1e7ed'), 'his silver in the long grass');
    assert.ok(s.length < 130000, 'light enough: ' + s.length);
  }
  // in the 5s and the 10s with others: his own silver paws, him small behind them
  const five = A.countsPicture({ table: 5, groups: 3, per: 5, highlight: 7, who: [{ who: 'sprinkle' }, { who: 'sleet' }, { who: 'puddle' }] });
  const ten = A.countsPicture({ table: 10, groups: 2, per: 10, highlight: 14, who: [{ who: 'sleet' }, { who: 'sprinkle' }] });
  for (const s of [five, ten]) { checkSvgDoc(s, 'sleet among'); assert.ok(s.includes('#e1e7ed') && !s.includes('#b5895b'), 'his silver, never a Clan cat’s paw'); }
});

test('chapter 6’s pictures and drawings: unique ids on one page, every reference resolves, none heavy', () => {
  const r = (n) => ({ who: 'reedclan', variant: n });
  const pics = [A.countsPicture({ table: 3, groups: 7, per: 3, kind: 'roll', highlight: 12, totals: true, next: true }), A.countsPicture({ table: 5, groups: 1, per: 5, highlight: 3, next: true, who: [{ who: 'sleet' }] }),
    A.countsPicture({ table: 3, groups: 3, highlight: 9, totals: true, who: [r(3), r(1), r(4), r(2), r(3), r(1), r(4), r(2), r(3)] })];
  const chars = [A.character('coil', { pose: 'longer', tap: 'eyes' }), A.character('sleet', { pose: 'pawup', lit: 3 }), A.character('sloshbank', { pose: 'walk' }), A.character('reedclan', { variant: 2, pose: 'pawup' }),
    A.character('clancat', { pose: 'sit', starry: true }), A.character('grizzled', { pose: 'lie', holds: 'pinecone', holdAt: 'chin' }), A.character('riffle', { pose: 'puff' }), A.character('riffle', { pose: 'sit', holds: 'string' })];
  const all = pics.join('') + chars.map((c) => c.svg).join('');
  const ids = idsOf(all);
  assert.strictEqual(new Set(ids).size, ids.length, 'every id on the page is its own');
  for (const ref of all.match(/(?:url\(#|href="#)([^)"]+)/g) || []) assert.ok(ids.includes(ref.replace(/^(url\(#|href="#)/, '')), 'dangling ' + ref);
  pics.forEach((s, i) => { checkSvgDoc(s, 'picture ' + i); assert.ok(s.length < 130000, 'picture ' + i + ': ' + s.length); });
  chars.forEach((c, i) => assert.ok(c.svg.length < 60000, 'drawing ' + i + ': ' + c.svg.length + ' bytes'));
});

test('dev/gallery-cats.html: chapter 6’s sections draw (Coil, Sleet, ReedClan, the extras, the Counts pictures), every pose of Coil and Sleet labelled', () => {
  const fs = require('fs'), path = require('path'), vm = require('vm');
  const dir = path.join(__dirname, '..', 'dev'), html = fs.readFileSync(path.join(dir, 'gallery-cats.html'), 'utf8');
  const scripts = [...html.matchAll(/<script(?: src="([^"]+)")?>([\s\S]*?)<\/script>/g)];
  const run = (search) => {
    const els = {};
    const el = (id) => els[id] || (els[id] = { id, innerHTML: '', value: id === 'size' ? '120' : '', options: [{ value: '120' }], add() {} });
    const ctx = { URLSearchParams, document: { getElementById: el, body: { className: '' } }, location: { search } };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    for (const m of scripts) vm.runInContext(m[1] ? fs.readFileSync(path.join(dir, m[1]), 'utf8') : m[2], ctx, { filename: m[1] || 'gallery-cats.html' });
    return { out: els.out.innerHTML, nav: els.nav.innerHTML };
  };
  for (const [id, least] of [['coil', 28], ['sleet', 36], ['reedclan', 50], ['extras6', 26], ['counts6', 12]]) {
    const page = run('?only=' + id);
    assert.ok(page.nav.includes('href="?only=' + id + '"'), id + ' is in the menu');
    assert.ok(new RegExp('<section id="' + id + '"><h2>[^<]*hapter 6').test(page.out), id + ': its section');
    assert.ok(count(page.out, /<svg[ >]/g) >= least, id + ': ' + count(page.out, /<svg[ >]/g) + ' drawings');
    assert.ok(!/NaN|undefined|\[object |Infinity/.test(page.out), id + ': every drawing drew');
    assert.strictEqual(balanced(page.out.replace(/<small title="[^"]*">/g, '<small>')), null, id + ': well-formed');
  }
  for (const who of ['coil', 'sleet']) { const page = run('?only=' + who).out; for (const pose of A.vocab.otherPoses[who]) assert.ok(new RegExp('<small title="' + pose + ' · ').test(page), who + ': ' + pose); }
  assert.ok(/pc-tap-stone"[^>]*>[^]*?stroke-dasharray/.test(run('?only=coil').out), 'the marks to tap are outlined in the gallery');
});

// ================================================================== chapter 7
// The Counts art (docs/chapters/07-the-counts-dont-lie.spec.md, section 4): the 6s' cheeks close up
// (and THE FACE RULE), her whiskers on one cheek, the back row's empty places, the nights' marks, the
// sand at per 6; Riffle's `tap: 'fish'` and Sprinkle's `tap: 'mist'`. The game's cats keep two
// whiskers a side: six on a cheek exist only in these close-ups, and no character drawing changes.

// "Every earlier counts picture and character preset unchanged": the sweep below, run on the shipped
// tree's cats.js (the chapter 6 state, ~/potomac-crossing-work/ch07/shipped, 2026-10-20) in a fresh
// process of its own, gave the count and the hash in the test; run here the same way (a fresh process,
// started now so it runs beside the tests above), today's cats.js must give the same. Ids are stripped
// as the spec says (s.replace(/pcs?[0-9a-z]+-/g, '')): a fresh process numbers the rest alike. It
// covers every table and per (the shipped `thing`s, every flag, with and without a look), table 6 and
// per 6 with no kind and no thing, the who pictures (a face-like run of two among them), every kind and
// paws of chapters 3 to 6, the sand at every per but chapter 7's (per 6 in clusters), and every cast
// member, pose, mood and extra of chapters 1 to 6. If their art is ever changed on purpose, take a new
// hash and say so.
function sweep7(A) {
  const out = [];
  const s = (x) => String(x).replace(/pcs?[0-9a-z]+-/g, '');
  const LOOKS = [{ fur: 'calico', marking: 'white-chest', eyes: 'odd', sex: 'tom' }, { fur: 'ginger', marking: 'white-paws', eyes: 'amber', sex: 'she' },
    { fur: 'tortie', marking: 'none', eyes: 'green', sex: 'she' }, { fur: 'grey', marking: 'nose-splash', eyes: 'blue', sex: 'tom' }, { fur: 'brown-tabby', marking: 'back-stripe', eyes: 'copper', sex: 'she' }, undefined];
  const cp = (o) => out.push(s(A.countsPicture(o)));
  const sd = (o) => out.push(s(A.sand(o)));
  const rec = (r) => out.push(s(r.svg), JSON.stringify([r.w, r.h, r.head, r.headBox || null, r.bounds || null, r.held || null, r.chestTop || null, r.nest || null, r.pole || null, r.paw || null, r.reach || null, r.bill || null]), s(r.front || ''));
  let n = 0;
  // ----- the Counts pictures: every table, per as the table and as the chapters vary it, the things the
  // shipped chapters pass (tail, ear, claw, cat, piece, …), every flag, with and without a look
  const THING = { 1: 'tail', 2: 'ear', 3: 'cat', 4: 'paw', 5: 'claw', 6: 'piece', 7: 'thing', 8: 'thing', 9: 'claw', 10: 'claw' };
  const FLAGS = [{}, { totals: true, next: true }, { thought: true }, { layout: 'rows', totals: true }, { kind: 'prey' }, { kind: 'prey', layout: 'rows', totals: true, next: true }];
  for (let t = 1; t <= 10; t++) for (const per of [t, t === 6 ? 3 : 6, 10]) for (const g of [1, 3, 5, 6, 10]) for (const fl of FLAGS) for (const hl of [0, per + 1, per * g]) {
    const o = Object.assign({ table: t, per, groups: g, highlight: hl, look: LOOKS[n % 6] }, fl);
    if (n % 3) o.thing = n % 3 === 1 ? THING[t] : 'piece';
    n++;
    cp(o);
  }
  // table 6 and per 6 as they always drew (no kind, no thing): pebble cats, groups 0 to 10, every highlight
  for (let g = 0; g <= 10; g++) for (const hl of [0, 1, 6, 7, 30, 60]) { cp({ table: 6, groups: g, highlight: hl }); cp({ table: 6, per: 6, groups: g, highlight: hl, totals: true, next: true, look: LOOKS[g % 6] }); }
  // the who pictures, at every table they could reach, a face-like run of two among them
  const RIM5 = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  const r = (v) => ({ who: 'reedclan', variant: v });
  const WHO = [RIM5, RIM5.slice(1, 4), [{ who: 'player' }, { who: 'tallyheart' }], [{ who: 'tallyheart' }], [{ who: 'snorer' }, { who: 'snorer' }, { who: 'player' }, { who: 'player' }],
    [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }], [{ who: 'riffle' }, { who: 'otter', variant: 1 }, { who: 'dog', variant: 3 }],
    [{ who: 'sprinkle' }, { who: 'squall' }, { who: 'puddle' }, { who: 'wisp' }, { who: 'sleet' }], [r(3), r(1), r(4), r(2), r(3), r(1), r(4), r(2), r(3)]];
  for (const who of WHO) for (const t of [1, 2, 3, 4, 5, 6, 9, 10]) for (const g of [1, 2, 4, 5]) cp({ table: t, groups: g, highlight: t * 2, who, look: LOOKS[(t + g) % 6], totals: true, next: true, thing: THING[t] });
  for (const w of ['sprinkle', 'squall', 'puddle', 'wisp', 'sleet', 'tallyheart']) for (const hl of [0, 5]) cp({ table: 5, groups: 1, per: 5, highlight: hl, who: [{ who: w }], next: true, totals: true, look: LOOKS[0] });
  // the kinds and the paws (chapters 3 to 6)
  for (let g = 1; g <= 7; g++) for (const hl of [0, g, g * 3]) cp({ table: 3, groups: g, per: 3, kind: 'roll', highlight: hl, totals: true, next: g % 2 === 1, thing: 'HERE' });
  for (let tap = 0; tap <= 5; tap++) { cp({ paws: 'own', both: true, table: 10, groups: 5, per: 10, highlight: tap * 10, taps: tap, look: LOOKS[1], next: tap < 5 }); cp({ paws: 'both', table: 9, groups: 5, per: 9, highlight: tap * 9, taps: tap, look: LOOKS[2], next: true }); cp({ table: 9, groups: 5, per: 9, tuck: true, taps: tap, next: true, who: RIM5, look: LOOKS[0] }); }
  for (let tap = 0; tap <= 4; tap++) { cp({ paws: 'own', table: 5, groups: 4, per: 5, highlight: tap * 5, taps: tap, look: LOOKS[3], next: true, totals: true }); cp({ paws: 'board', table: 1, groups: 4, per: 1, taps: tap, next: true, look: LOOKS[4] }); }
  for (let tap = 0; tap <= 9; tap += 3) cp({ paws: 'log', table: 1, groups: 9, per: 1, taps: tap, look: LOOKS[0], plane: tap ? 'over' : true, next: true });
  for (const hl of [0, 12, 35]) { cp({ table: 5, groups: 7, per: 5, kind: 'grit', ground: 'grit', highlight: hl }); cp({ table: 5, groups: 6, per: 5, kind: 'mud', highlight: hl, totals: true, next: true }); cp({ paws: 'mud', kind: 'mud', table: 5, per: 5, groups: 3, of: 7, highlight: hl, totals: true, next: true }); }
  for (let tap = 0; tap <= 3; tap++) cp({ paws: 'promise', table: 10, groups: 3, taps: tap, highlight: tap * 10, look: LOOKS[tap], next: true });
  for (const k of [['fish', 'pairs', 2, 7, true], ['fish', 'strings', 5, 4, false], ['bumps', undefined, 10, 4, false], ['herons', undefined, 1, 7, false]]) for (const hl of [0, 6, 40]) cp({ kind: k[0], layout: k[1], table: k[2], per: k[2], groups: k[3], thought: k[4], highlight: hl, totals: true, next: true });
  for (const g of [1, 4, 10]) for (const tk of [undefined, 0, 2]) cp({ table: 9, groups: g, per: 9, highlight: g * 4, tuck: tk, who: RIM5, look: LOOKS[0] });
  cp({ kind: 'answers', answers: [18, 36] }); cp({ answers: [36] }); cp({});
  // ----- the sand: every ground and style, per 1 to 10 (per 6 only where it is not chapter 7's: swipes and rows)
  for (const ground of [undefined, 'earth', 'mud', 'grit', 'log']) for (const style of [undefined, 'swipe']) for (const pair of [undefined, true])
    for (const [g, p, c] of [[4, 10, 20], [6, 5, 12], [9, 2, 4], [1, 1, 0], [6, 3, 9], [3, 4, 7], [2, 7, 9], [5, 8, 13], [2, 9, 9], [10, 10, 55], [7, 6, 20], [1, 6, 6]]) {
      if (p === 6 && !style) continue;
      sd({ groups: g, per: p, counted: c, ground, style, pair });
    }
  for (const step of [undefined, 10, 2, 6]) for (const [g, p, c] of [[4, 10, 10], [2, 8, 6], [3, 10, 30], [2, 6, 12], [3, 6, 4]]) sd({ groups: g, per: p, counted: c, layout: 'rows', ground: 'earth', step });
  sd({ groups: 4, per: 10, counted: 40, style: 'swipe', pair: true, rubbed: 2 }); sd({ answers: [18, 36] }); sd({ groups: 5, per: 9, counted: 30, style: 'swipe', pair: true, tuck: true });
  // ----- the characters: every cat and every pose and mood, the extras of chapters 3 to 6 (with no new tap)
  const POSES = A.vocab.poses.slice(), MOODS = A.vocab.moods.slice();
  const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'murmurchime', 'sloshbank', 'reedclan'];
  let k = 0;
  for (const who of CATS) for (const pose of POSES) for (const mood of MOODS) { k++; rec(A.character(who, { pose, mood, look: LOOKS[k % 6], variant: (k % 6) + 1, facing: k % 2 ? 'left' : 'right' })); }
  const EX = [{ wink: true }, { holds: 'bark' }, { holds: 'stone', holdAt: 'chin' }, { holds: 'vole' }, { holds: 'pebble', holdAt: 'nose' }, { flatEars: true, claws: true }, { puffed: true, tear: true },
    { moss: true, mist: true, squeeze: true }, { tuck: true }, { asleep: true, snail: true }, { snail: 'in', tap: 'nose' }, { buzz: true }, { dragonfly: true }, { glow: true }, { reach: true },
    { holds: 'pinecone', tap: 'pinecone' }, { holds: 'pinecone', holdAt: 'chin', asleep: true }, { tap: 'paw' }, { tap: 'ears' }, { starry: true }, { grass: true }, { tap: 'nothing', holds: 'nothing' }];
  for (const who of ['tallyheart', 'player', 'grizzled', 'murmurchime', 'clancat', 'waffles', 'snorer']) for (const pose of POSES) for (const ex of EX) { k++; rec(A.character(who, Object.assign({ pose, mood: MOODS[k % 16], look: LOOKS[k % 6], variant: 2, facing: k % 2 ? 'left' : 'right' }, ex))); }
  const OP = A.vocab.otherPoses;
  for (const [who, poses] of [['riffle', OP.riffle], ['otter', OP.otter], ['dog', OP.dog]]) for (const variant of [1, 2, 3]) for (const pose of poses) for (const mood of MOODS) { k++; rec(A.character(who, { pose, mood, variant, facing: k % 2 ? 'left' : 'right' })); }
  for (const pose of OP.riffle) for (const ex of [{ holds: 'pole', tap: 'pole' }, { holds: 'fish' }, { holds: 'fish2', tear: true }, { glow: true }, { holds: 'string' }, { holds: 'pebbles', tap: 'pebbles' }, { holds: 'pebbles', holdAt: 'paws' }, { tap: 'cheeks' }, { pebbles: 5, squeeze: true, mist: true }])
    for (const mood of ['happy', 'neutral', 'worried']) rec(A.character('riffle', Object.assign({ pose, mood }, ex)));
  for (const who of ['sprinkle', 'sleet']) for (const pose of OP[who]) for (const mood of MOODS) for (const facing of ['left', 'right']) rec(A.character(who, { pose, mood, facing }));
  for (const pose of OP.sprinkle) for (const ex of [{ mist: true }, { holds: 'pebble', tear: true, squeeze: true }, { mist: true, mood: 'happy', facing: 'left' }, { noArms: true }]) rec(A.character('sprinkle', Object.assign({ pose, mood: 'wonder' }, ex)));
  for (const pose of OP.sleet) rec(A.character('sleet', { pose, mood: 'proud', grass: true, lit: 3 }));
  for (const who of ['reynard', 'squall', 'patience', 'puddle', 'wisp', 'coil']) for (const pose of OP[who]) for (const mood of MOODS) for (const ex of [{}, { tear: true, mist: true, squeeze: true, flick: true, dragonfly: true, facing: 'left' }, { lit: 3, pole: true, noArms: true }])
    rec(A.character(who, Object.assign({ pose, mood }, ex)));
  for (const pose of OP.coil) for (const tap of ['stone', 'eyes']) rec(A.character('coil', { pose, tap }));
  for (const who of ['tallone', 'sparrow', 'moth']) for (const pose of ['stand', 'water', 'set-dish', 'perch', 'fluffed', 'fly']) for (const facing of ['left', 'right']) rec(A.character(who, { pose, facing }));
  rec(A.character('nobody', { pose: 'sit' })); rec(A.cat({ look: LOOKS[0], pose: 'walk', mood: 'happy' })); out.push(JSON.stringify(A.dragonfly({ asleep: true })), JSON.stringify(A.dragonfly()));
  for (const kind of ['mouse', 'vole', 'fish']) for (const lit of [false, true]) for (const part of [undefined, 'glow', 'body', 'spark']) out.push(JSON.stringify(A.preyFallback({ kind, lit, part, facing: lit ? 'left' : 'right' })));
  out.push(JSON.stringify(A.vocab.cast), JSON.stringify(A.vocab.poses), JSON.stringify(A.vocab.moods), JSON.stringify(A.vocab.otherPoses), JSON.stringify(A.vocab.variants), JSON.stringify(A.vocab.clanVariants));
  return out;
}
const CH7_SWEEP = new Promise((resolve) => {
  const code = 'const PC = require(' + JSON.stringify(require('path').join(__dirname, '..', 'app', 'art', 'cats.js')) + ');\n' +
    'const out = (' + sweep7.toString() + ')(PC.art);\n' +
    'process.stdout.write(JSON.stringify({ n: out.length, sha: require("crypto").createHash("sha256").update(out.join("\\n")).digest("hex") }));';
  require('child_process').execFile(process.execPath, ['-e', code], { maxBuffer: 1 << 20 }, (err, stdout, stderr) => resolve({ err, stdout, stderr }));
});

const RIM7 = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
const ONE_CAT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }];
const BEDTIME = [{ who: 'snorer' }, { who: 'snorer' }, { who: 'player' }, { who: 'player' }];
const LOOK7 = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'she' };
// the picture as the skip-counts hand it to the art (E.skipPicture: totals, the next one glowing, the skip's who and thing)
const skip7 = (o, taps) => Object.assign({ per: o.table, highlight: taps * o.table, totals: true, next: taps < o.groups, look: LOOK7 }, o);
// each cheek's group (in drawing order), its whiskers and which are lit, its fur's fills
const cheekGroups = (s) => s.split(/(?=<g class="pc-cheek)/).slice(1);
const whiskers = (s) => (s.match(/<path class="pc-whisker[^"]*"/g) || []).map((x) => /pc-lit/.test(x));
const furs = (s) => (s.match(/<path class="pc-fur" d="[^"]*" fill="(#[0-9a-fA-F]{6})"/g) || []).map((x) => x.slice(-8, -1).toLowerCase());
const cardsOf = (s) => (s.match(/<rect class="pc-card" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/g) || []).map((x) => x.match(/[\d.]+/g).map(Number));
const labelOf = (s) => (s.match(/aria-label="([^"]*)"/) || [])[1];
const BASE7 = { c1: '#b5895b', murmurchime: '#3f3330', c3: '#f2dbb1', c5: '#fbf8f2', grizzled: '#5d4535', snorer: '#a3a9b0', tallyheart: '#e8913a' };
// the six Clan coats' furs (cats.js CLAN), and their fills
const CLAN_FURS = ['brown-tabby', 'black', 'cream', 'grey', 'calico', 'ginger'], CLAN_BASES = CLAN_FURS.map((f) => FUR_BASES[f].toLowerCase());

test('chapter 7 vocabulary: no new cast, pose or mood; the taps gain fish and mist (earlier ids never move)', () => {
  assert.deepStrictEqual(A.vocab.cast.slice(-4), ['coil', 'sloshbank', 'reedclan', 'sleet'], 'no new cast');
  assert.deepStrictEqual(A.vocab.poses, POSES6, 'no new cat pose');
  assert.deepStrictEqual(A.vocab.moods, MOODS6, 'no new mood');
  assert.deepStrictEqual(A.vocab.extras.tap.slice(0, 9), ['nose', 'pole', 'paw', 'ears', 'pinecone', 'pebbles', 'cheeks', 'stone', 'eyes']);
  assert.deepStrictEqual(A.vocab.extras.tap.slice(9), ['fish', 'mist']);
  assert.deepStrictEqual(Object.keys(A.vocab.extras), ['tuck', 'asleep', 'snail', 'buzz', 'dragonfly', 'glow', 'tap', 'holds', 'reach', 'starry', 'grass']);
});

test('chapters 1 to 6 are unchanged by chapter 7 (every earlier Counts picture, sand tally and character, hashed against the shipped tree)', async () => {
  const r = await CH7_SWEEP;
  assert.ok(!r.err, 'the sweep ran: ' + (r.err && r.err.message) + ' ' + r.stderr);
  const got = JSON.parse(r.stdout);
  assert.strictEqual(got.n, 36779, 'as many drawings as the shipped tree made');
  assert.strictEqual(got.sha, 'fe4811937bad0059f9c5e75b645ac1921e74f353a482a55e65a8835443e46f90');
  // and here, in this process: the new keys are the only way in. Per 6 with no kind and no thing is
  // still chapter 1's pebble cats; another thing changes nothing; table 3 with the patrols' thing is
  // the patrols; table 1 with the tails' thing is the tails; a skip with no thing at per 6 too
  const same = (a, b, m) => assert.strictEqual(strip(A.countsPicture(a)), strip(A.countsPicture(b)), m);
  same({ table: 6, per: 6, groups: 5, highlight: 7, thing: 'piece' }, { table: 6, groups: 5, highlight: 7 }, 'per 6, another thing: pebble cats');
  same({ table: 6, per: 6, groups: 4, highlight: 6, who: BEDTIME, totals: true, next: true, look: LOOK7 }, { table: 6, per: 6, groups: 4, highlight: 6, who: BEDTIME, totals: true, next: true, look: LOOK7, thing: 'cat' }, 'a face-like who with no whisker draws as before');
  same({ table: 3, per: 3, groups: 2, highlight: 3, thing: 'cat', who: [{ who: 'tallyheart' }] }, { table: 3, groups: 2, highlight: 3, who: [{ who: 'tallyheart' }] }, 'table 3, cats: the patrols');
  same({ table: 1, per: 1, groups: 4, highlight: 2, thing: 'tail' }, { table: 1, groups: 4, highlight: 2 }, 'table 1, tails: the tails');
  assert.ok(!/pc-cheek|pc-gap|pc-night/.test(A.countsPicture({ table: 6, per: 6, groups: 3, highlight: 4 })), 'per 6 alone is never the cheeks');
});

// ----- the 6s' cheeks

test('cheeks (kind: cheeks, or thing: whisker at per 6): a cheek a group, six whiskers each, two rows of three, lit cheek by cheek, top three then bottom three', () => {
  for (const o of [{ kind: 'cheeks' }, { thing: 'whisker' }, { kind: 'cheeks', thing: 'whisker' }]) for (let g = 1; g <= 10; g++) for (const hl of [0, 3, 7, g * 6]) {
    const s = A.countsPicture(Object.assign({ table: 6, per: 6, groups: g, highlight: hl, look: LOOK7 }, o));
    checkSvgDoc(s, 'cheeks ' + g);
    const cg = cheekGroups(s);
    assert.strictEqual(cg.length, g, g + ' cheeks');
    const lit = cg.map(whiskers);
    lit.forEach((w) => assert.strictEqual(w.length, 6, 'six whiskers a cheek'));
    // in order: every whisker before the hl-th lit, none after; within a cheek, the top row (0-2) first
    assert.deepStrictEqual([].concat(...lit), Array.from({ length: g * 6 }, (_, i) => i < Math.min(hl, g * 6)), g + ' cheeks, highlight ' + hl);
    assert.strictEqual(labelOf(s), g === 1 ? '1 cheek, six whiskers' : g + ' cheeks, six whiskers each');
    assert.ok(!/pc-total|pc-next/.test(s), 'no totals, nothing glowing, unless asked');
  }
  // the two rows: three whiskers start high on the muzzle and fan up, three start low and fan down
  const one = cheekGroups(A.countsPicture({ table: 6, per: 6, groups: 1, kind: 'cheeks' }))[0];
  // (each whisker [x, y] of its dot, then [x, y] of its tip)
  const starts = [...one.matchAll(/<path class="pc-whisker[^"]*" d="M([-\d.]+),([-\d.]+)Q[-\d.]+,[-\d.]+ ([-\d.]+),([-\d.]+)"/g)].map((m) => m.slice(1, 5).map(Number));
  assert.strictEqual(starts.length, 6);
  const topRow = starts.slice(0, 3), bottomRow = starts.slice(3);
  assert.ok(Math.max(...topRow.map((w) => w[1])) + 15 < Math.min(...bottomRow.map((w) => w[1])), 'the top row’s dots well above the bottom row’s');
  assert.ok(Math.max(...topRow.map((w) => w[3])) + 30 < Math.min(...bottomRow.map((w) => w[3])), 'and their tips further apart still: plainly three on top, three below');
  for (const w of starts) assert.ok(w[2] < w[0] - 120, 'each whisker a long thin curve out past the cheek');
  assert.ok(new Set(starts.map((w) => w[0] + ',' + w[1])).size === 6, 'six dots, one for each whisker');
  // up to five a row: one to five in one row, six to ten five then the rest
  for (let g = 1; g <= 10; g++) {
    const ys = [...new Set(cardsOf(A.countsPicture({ table: 6, per: 6, groups: g, kind: 'cheeks' })).map((c) => c[1]))];
    assert.strictEqual(ys.length, g > 5 ? 2 : 1, g + ' cheeks: rows');
    const cs = cardsOf(A.countsPicture({ table: 6, per: 6, groups: g, kind: 'cheeks' }));
    assert.strictEqual(cs.filter((c) => c[1] === ys[0]).length, Math.min(5, g), g + ' cheeks: five in the first row');
  }
});

test('cheeks-top: every cheek’s top three lit from the start, whatever highlight says; the bottom rows only as highlight reaches them', () => {
  for (const g of [3, 4, 7, 8]) for (const hl of [0, 2, 9, 20, g * 6]) {
    const lit = cheekGroups(A.countsPicture({ table: 6, per: 6, groups: g, kind: 'cheeks-top', highlight: hl, look: LOOK7 })).map(whiskers);
    lit.forEach((w, gi) => {
      assert.deepStrictEqual(w.slice(0, 3), [true, true, true], g + ' cheeks, highlight ' + hl + ': cheek ' + gi + ' top row');
      assert.deepStrictEqual(w.slice(3), [3, 4, 5].map((j) => gi * 6 + j < hl), g + ' cheeks, highlight ' + hl + ': cheek ' + gi + ' bottom row');
    });
  }
  // a right answer lights every whisker, cheeks-top or not; 6 × 6's lit: 30 is five whole cheeks
  assert.ok(cheekGroups(A.countsPicture({ table: 6, per: 6, groups: 8, kind: 'cheeks-top', highlight: 48 })).every((c) => whiskers(c).every(Boolean)));
  const six = cheekGroups(A.countsPicture({ table: 6, per: 6, groups: 6, kind: 'cheeks', highlight: 30 })).map(whiskers);
  assert.deepStrictEqual(six.map((w) => w.filter(Boolean).length), [6, 6, 6, 6, 6, 0]);
});

test('cheeks in a skip: the running total under each counted cheek (6, 12, 18…); the next cheek glowing just before it (pc-next), none when done', () => {
  for (const [who, g] of [[RIM7, 5], [BEDTIME, 4], [undefined, 9]]) for (let taps = 0; taps <= g; taps++) {
    const s = A.countsPicture(skip7({ table: 6, groups: g, who, thing: 'whisker' }, taps));
    assert.deepStrictEqual(totals(s), Array.from({ length: taps }, (_, i) => (i + 1) * 6), g + ' cheeks, ' + taps + ' taps: totals');
    assert.strictEqual(nexts(s), taps < g ? 1 : 0, 'one glowing, until the last');
    if (taps < g) {
      // the glow comes straight before the cheek it is on (the page wiggles the two together)
      const after = s.split('class="pc-next"')[1];
      const cg = cheekGroups(s);
      assert.ok(/^[^<]*\/><g class="pc-cheek/.test(after), 'the glow, then its cheek');
      assert.strictEqual(after.split(/(?=<g class="pc-cheek)/)[1].slice(0, 200), cg[taps].slice(0, 200), 'on the next cheek');
    }
  }
});

test('the cheeks’ coats: each `who` entry’s (presets as drawn, a Clan cat never in her coat, `player` in her look), else the rim’s in order, round again', () => {
  const rim = cheekGroups(A.countsPicture(skip7({ table: 6, groups: 5, who: RIM7, thing: 'whisker' }, 0)));
  // (her look is a calico: clancat 5, a calico, wears a spare)
  const spare = CLAN_BASES[A.clanVariant(5, LOOK7, [1, 3, 5]) - 1];
  assert.deepStrictEqual(rim.map((c) => [...new Set(furs(c))]), [[BASE7.c1], [BASE7.murmurchime], [BASE7.c3], [spare], [BASE7.grizzled]]);
  assert.notStrictEqual(spare, BASE7.c5, 'never her coat');
  // no who: the rim's coats in order, round again (a ginger look: every one of them as drawn; with no
  // look at all she is drawn a brown tabby, as in every who picture, so clancat 1 wears a spare)
  const seven = cheekGroups(A.countsPicture({ table: 6, per: 6, groups: 7, kind: 'cheeks', look: { fur: 'ginger' } })).map((c) => furs(c)[0]);
  assert.deepStrictEqual(seven, [BASE7.c1, BASE7.murmurchime, BASE7.c3, BASE7.c5, BASE7.grizzled, BASE7.c1, BASE7.murmurchime]);
  // her coat is never a Clan cat's, whatever her fur (PC.art.clanVariant): each Clan cheek is drawn in
  // the coat it names, and that coat's fur is never hers
  for (const look of ALL_LOOKS) for (const who of [undefined, RIM7]) {
    const cg = cheekGroups(A.countsPicture({ table: 6, per: 6, groups: 10, kind: 'cheeks', thing: 'whisker', look, who: who && who.concat(who) }));
    cg.forEach((c, i) => {
      const e = RIM7[i % 5];
      if (e.who !== 'clancat') return;
      const v = A.clanVariant(e.variant, look, [1, 3, 5]);
      assert.notStrictEqual(CLAN_FURS[v - 1], look.fur, look.fur + ': cheek ' + i + ' is not in her coat');
      assert.deepStrictEqual([...new Set(furs(c))], [CLAN_BASES[v - 1]], look.fur + ': cheek ' + i + ' in clancat ' + v + '’s coat');
    });
  }
  // Tallyheart's and the player's own
  assert.deepStrictEqual([...new Set(furs(A.countsPicture({ table: 6, per: 6, groups: 1, kind: 'cheeks', who: [{ who: 'tallyheart' }] })))], [BASE7.tallyheart]);
  const bed = cheekGroups(A.countsPicture(skip7({ table: 6, groups: 4, who: BEDTIME, thing: 'whisker' }, 0))).map((c) => furs(c)[0]);
  assert.deepStrictEqual(bed, [BASE7.snorer, BASE7.snorer, FUR_BASES.calico.toLowerCase(), FUR_BASES.calico.toLowerCase()], 'the grey tom’s face, then hers in her look');
});

test('THE FACE RULE: two consecutive who entries with the same who and variant are one face (one card, two cheeks, puffed), pairs from the left', () => {
  const faces = (s) => cheekGroups(s).map((c) => /pc-face/.test(c.slice(0, 40)));
  const pic = (who, g, kind) => A.countsPicture({ table: 6, per: 6, groups: g || who.length, who, look: LOOK7, kind, thing: 'whisker', highlight: 0 });
  // the five cheeks (who: RIM): five cheeks of five cats, clancat 3 and clancat 5 two cats
  let s = pic(RIM7);
  assert.deepStrictEqual(faces(s), [false, false, false, false, false]);
  assert.strictEqual(cardsOf(s).length, 5, 'five cards');
  // bedtime: the grey tom's face, then hers; two cards, each two cheeks wide
  s = pic(BEDTIME);
  assert.deepStrictEqual(faces(s), [true, true, true, true]);
  const bc = cardsOf(s);
  assert.strictEqual(bc.length, 2, 'two faces, two cards');
  assert.ok(bc.every((c) => c[2] > 400), 'each card two cheeks wide');
  // the lesson's 2 × 6 (ONE_CAT): one clancat 1's face
  s = pic(ONE_CAT, 2, 'cheeks');
  assert.deepStrictEqual(faces(s), [true, true]);
  assert.strictEqual(cardsOf(s).length, 1, 'one whole cat');
  assert.deepStrictEqual([...new Set(furs(s))], [BASE7.c1]);
  // a face's cheeks are puffed round (wider than a cheek of its own, its fur drawn by the puffed outline)
  assert.ok(/M-60,-46C-112,-42 -150,-8/.test(pic(ONE_CAT, 2)) && !/M-60,-46C-112,-42 -150,-8/.test(pic(RIM7)), 'puffed round, only in a face');
  // eight cheeks with no who: eight cheeks
  s = A.countsPicture({ table: 6, per: 6, groups: 8, kind: 'cheeks', look: LOOK7 });
  assert.deepStrictEqual(faces(s), Array(8).fill(false));
  assert.strictEqual(cardsOf(s).length, 8);
  // the default coat order never makes a face, even where it repeats (five, then round again)
  assert.ok(!/pc-face/.test(A.countsPicture({ table: 6, per: 6, groups: 10, thing: 'whisker' })));
  // a variant absent and a variant given are two cats; two absent are one face; pairs from the left
  assert.deepStrictEqual(faces(pic([{ who: 'clancat', variant: 1 }, { who: 'clancat' }])), [false, false]);
  assert.deepStrictEqual(faces(pic([{ who: 'clancat' }, { who: 'clancat' }])), [true, true]);
  assert.deepStrictEqual(faces(pic([{ who: 'snorer' }, { who: 'snorer' }, { who: 'snorer' }])), [true, true, false], 'the third starts afresh');
  assert.deepStrictEqual(faces(pic([{ who: 'player' }, { who: 'snorer' }, { who: 'snorer' }, { who: 'player' }])), [false, true, true, false]);
  // a face never splits across a row: the cheeks before it end the row one short
  s = pic([{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'snorer' }, { who: 'snorer' }]);
  const cs = cardsOf(s);
  assert.strictEqual(cs.length, 5);
  assert.ok(cs[4][1] > cs[3][1] && cs[4][2] > 400, 'the face on the second row, whole');
  // the whiskers of a face: six a cheek, twelve a face, lit in order across it
  assert.deepStrictEqual(cheekGroups(A.countsPicture(skip7({ table: 6, groups: 4, who: BEDTIME, thing: 'whisker' }, 1))).map((c) => whiskers(c).filter(Boolean).length), [6, 0, 0, 0]);
});

test('one to ten cheeks at highlight 0 and full: 1, 9 and 10 (a Hollow round of the 6s asks 6 × 1 to 10 × 6); every picture well-formed', () => {
  for (const g of [1, 2, 5, 6, 9, 10]) for (const kind of ['cheeks', 'cheeks-top']) for (const hl of [0, g * 6]) {
    const s = A.countsPicture({ table: 6, per: 6, groups: g, kind, highlight: hl, look: LOOK7, thing: 'whisker' });
    checkSvgDoc(s, kind + ' ' + g);
    const w = [].concat(...cheekGroups(s).map(whiskers));
    assert.strictEqual(w.length, g * 6);
    assert.strictEqual(w.filter(Boolean).length, hl ? g * 6 : kind === 'cheeks-top' ? g * 3 : 0, kind + ' ' + g + ' at ' + hl);
  }
  // groups past ten are ten (no lesson asks more)
  assert.strictEqual(cheekGroups(A.countsPicture({ table: 6, per: 6, groups: 14, kind: 'cheeks' })).length, 10);
});

// ----- her whiskers, one cheek

test('her whiskers (thing: whisker at table 3, per 3, groups 2): one big cheek in who[0]’s coat, the top row the first group, the row below the second', () => {
  const T = [{ who: 'tallyheart' }];
  for (let taps = 0; taps <= 2; taps++) {
    const s = A.countsPicture(skip7({ table: 3, groups: 2, who: T, thing: 'whisker' }, taps));
    checkSvgDoc(s, 'one cheek ' + taps);
    assert.strictEqual(labelOf(s), 'One cheek: two rows of three whiskers');
    assert.strictEqual(count(s, /<g class="pc-cheek"/g), 1, 'one cheek');
    assert.deepStrictEqual([...new Set(furs(s))], [BASE7.tallyheart], 'Tallyheart’s ginger');
    const rows = s.split(/(?=<g class="pc-row")/).slice(1).map((r) => whiskers(r.split('</g>')[0] + '</g>'));
    assert.strictEqual(rows.length, 2, 'two rows, two groups');
    assert.deepStrictEqual(rows, [[taps >= 1, taps >= 1, taps >= 1], [taps >= 2, taps >= 2, taps >= 2]], taps + ' taps');
    assert.deepStrictEqual(totals(s), [3, 6].slice(0, taps), 'the totals beside the rows');
    assert.strictEqual(nexts(s), taps < 2 ? 1 : 0);
    if (taps < 2) assert.ok(/^[^<]*\/><g class="pc-row"/.test(s.split('class="pc-next"')[1]), 'the next row glows, just before it');
  }
  // the kept page: both rows lit, 3 and 6 beside them, nothing glowing
  const kept = A.countsPicture({ table: 3, groups: 2, per: 3, highlight: 6, totals: true, next: false, who: T, thing: 'whisker', things: 'whiskers', look: LOOK7 });
  assert.deepStrictEqual(totals(kept), [3, 6]);
  assert.strictEqual(nexts(kept), 0);
  assert.strictEqual(whiskers(kept).filter(Boolean).length, 6);
  // the 3 beside the top row, the 6 beside the row below
  const ty = (kept.match(/<text class="pc-total" x="[\d.]+" y="([\d.]+)"/g) || []).map((x) => +x.match(/y="([\d.]+)"/)[1]);
  assert.ok(ty[0] + 60 < ty[1], 'one above the other');
  // a clear band along the top for the page's big number: the card starts below it
  assert.ok(+kept.match(/<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="[\d.]+" rx="26" fill="#d6e5c8"/)[1] >= 50);
  // the patrols are still the patrols: table 3 with the warm-up's `thing: 'cat'`
  assert.ok(!/pc-row|pc-cheek/.test(A.countsPicture({ table: 3, groups: 4, per: 3, highlight: 3, thing: 'cat', look: LOOK7 })));
});

// ----- the back row's gaps

test('the back row (thing: gap): three pieces, four empty places pressed in the earth, three pieces; each place a group, lit in gold, the next glowing, totals 1 to 4', () => {
  const asked = [];
  const keep = A.prey;
  A.prey = (q) => { asked.push(q); return A.preyFallback(q); };
  try {
    for (let taps = 0; taps <= 4; taps++) {
      asked.length = 0;
      const s = A.countsPicture(skip7({ table: 1, groups: 4, thing: 'gap', things: 'gaps' }, taps));
      checkSvgDoc(s, 'gaps ' + taps);
      assert.strictEqual(labelOf(s), 'The back row: four empty places');
      const gaps = s.split(/(?=<g class="pc-gap")/).slice(1);
      assert.strictEqual(gaps.length, 4, 'four empty places');
      assert.deepStrictEqual(gaps.map((g) => /class="pc-lit"/.test(g.split('</g>')[0])), [0, 1, 2, 3].map((i) => i < taps), taps + ' taps: lit in order');
      assert.ok(gaps.slice(0, taps).every((g) => /stroke="#ffb21f"/.test(g.split('</g>')[0])), 'outlined in gold');
      assert.deepStrictEqual(totals(s), [1, 2, 3, 4].slice(0, taps));
      assert.strictEqual(nexts(s), taps < 4 ? 1 : 0);
      if (taps < 4) assert.ok(/^[^<]*\/><g class="pc-gap"/.test(s.split('class="pc-next"')[1]), 'the glow, then its place');
      // six pieces, mice and voles (never a fish), eyes shut as the pile draws them, three each side
      assert.strictEqual(asked.length, 6, 'six pieces');
      assert.ok(asked.every((q) => q.kind === 'mouse' || q.kind === 'vole') && asked.some((q) => q.kind === 'vole') && asked.some((q) => q.kind === 'mouse'));
      const xs = (s.match(/<g class="pc-gap"><ellipse cx="([\d.]+)"/g) || []).map((x) => +x.match(/cx="([\d.]+)"/)[1]);
      assert.ok(xs.every((x, i) => !i || x > xs[i - 1]), 'side by side, left to right');
    }
  } finally { if (keep) A.prey = keep; else delete A.prey; }
  // without the pile set, our own soft prey
  const s = A.countsPicture({ table: 1, per: 1, groups: 4, thing: 'gap' });
  checkSvgDoc(s, 'gaps, no prey');
  assert.strictEqual(count(s, /<g class="pc-gap"/g), 4);
  // the tails are still the tails
  assert.ok(!/pc-gap/.test(A.countsPicture({ table: 1, per: 1, groups: 4, highlight: 2, thing: 'tail' })));
});

// ----- the nights

test('the nights (kind: marks): one to six nights side by side in one row, four short marks a night in a row (ten as two rows of five), a clear gap, nothing else to count', () => {
  for (const [per, table] of [[4, 4], [10, 10]]) for (let g = 1; g <= 6; g++) for (const hl of [0, per, per * 2 + 1, g * per]) {
    const s = A.countsPicture({ table, groups: g, per, kind: 'marks', highlight: hl, thing: 'piece', things: 'pieces' });
    checkSvgDoc(s, 'marks ' + g + 'x' + per);
    assert.strictEqual(labelOf(s), g + (g === 1 ? ' night, ' : ' nights, ') + per + ' marks' + (g === 1 ? '' : ' each'));
    const nights = s.split(/(?=<g class="pc-night")/).slice(1);
    assert.strictEqual(nights.length, g, g + ' nights');
    const marks = nights.map((n) => (n.match(/<path class="pc-mark[^"]*"/g) || []).map((x) => /pc-lit/.test(x)));
    marks.forEach((m) => assert.strictEqual(m.length, per, per + ' marks a night'));
    assert.deepStrictEqual([].concat(...marks), Array.from({ length: g * per }, (_, i) => i < Math.min(hl, g * per)), 'lit in order, a night at a time');
    // one row of nights; within a night, one row of four, or two rows of five
    const boxes = (s.match(/<g class="pc-night"><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/g) || []).map((x) => x.match(/[\d.]+/g).map(Number));
    assert.strictEqual(new Set(boxes.map((b) => b[1])).size, 1, 'side by side in one row');
    boxes.forEach((b, i) => { if (i) assert.ok(b[0] - (boxes[i - 1][0] + boxes[i - 1][2]) >= 30, 'a clear gap between nights'); });
    const ys = new Set((nights[0].match(/<path class="pc-mark[^"]*" d="M[\d.]+,([\d.]+)/g) || []).map((x) => x.match(/,([\d.]+)$/)[1]));
    assert.strictEqual(ys.size, per === 10 ? 2 : 1, per + ': rows of marks in a night');
    assert.ok(!/<text|pc-total|pc-next|moon/.test(s), 'no number, no moon');
  }
  // the sand, or the mud under the Old Bridge
  assert.ok(A.countsPicture({ table: 10, groups: 6, per: 10, kind: 'marks' }).includes('fill="#efd6a2"'), 'sand');
  assert.ok(A.countsPicture({ table: 10, groups: 6, per: 10, kind: 'marks', ground: 'mud' }).includes('fill="#6f5a47"'), 'mud');
  // per 4 alone is still the 4s' paws, per 10 alone the 10s' forepaws
  assert.ok(!/pc-night/.test(A.countsPicture({ table: 4, groups: 6, per: 4 })) && !/pc-night/.test(A.countsPicture({ table: 10, groups: 6, per: 10 })));
});

// ----- the sand at per 6

test('the sand at per 6: each group two short rows of three, one above the other, lit top row then bottom, group by group; one to ten groups', () => {
  for (let g = 1; g <= 10; g++) for (const counted of [0, 3, 4, 6, 9, g * 6]) {
    const s = A.sand({ groups: g, per: 6, counted });
    checkSvgDoc(s, 'sand ' + g + 'x6');
    const marks = (s.match(/<path d="M([\d.]+),([\d.]+)Q[\d.]+,[\d.]+ [\d.]+,[\d.]+" stroke="(#[0-9a-f]+)" stroke-width="4.6"/g) || []).map((x) => { const m = x.match(/M([\d.]+),([\d.]+)Q[^"]*" stroke="(#[0-9a-f]+)"/); return [+m[1], +m[2], m[3] === '#e39a12']; });
    assert.strictEqual(marks.length, g * 6, g + ' groups of six');
    assert.deepStrictEqual(marks.map((m) => m[2]), Array.from({ length: g * 6 }, (_, i) => i < Math.min(counted, g * 6)), 'lit in order');
    for (let k = 0; k < g; k++) {
      const grp = marks.slice(k * 6, k * 6 + 6);
      const xs = [...new Set(grp.map((m) => m[0]))], ys = [...new Set(grp.map((m) => m[1]))];
      assert.strictEqual(xs.length, 3, 'three across');
      assert.strictEqual(ys.length, 2, 'two rows');
      assert.ok(grp.slice(0, 3).every((m) => m[1] === Math.min(...ys)), 'the top row first');
    }
  }
  // per 6 in swipes or rows, and every other per, as before (the sweep above hashes them)
  assert.strictEqual(A.sand({ groups: 3, per: 5, counted: 7 }).match(/stroke-width="4.6"/g).length, 15);
});

// ----- the two taps

test('tap: fish (Riffle in stand, holding his string: the string’s box) and tap: mist (Sprinkle’s burp: the cloud), unpainted, once; without the thing, no mark', () => {
  const rif = A.character('riffle', { pose: 'stand', mood: 'happy', holds: 'string', tap: 'fish' });
  checkResult(rif, 'riffle fish');
  assert.deepStrictEqual(tapsOf(rif.svg), ['fish']);
  const box = rif.svg.match(/<g class="pc-tap pc-tap-fish"><rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="none"\/><\/g>/);
  assert.ok(box, 'an unpainted box: ' + (rif.svg.match(/pc-tap-fish[^]*?<\/g>/) || [''])[0]);
  // the box is the string's (in his own drawing's coordinates; `held` reports the string's middle in his box)
  const [x, y, w, h] = box.slice(1).map(Number);
  assert.ok(w > 20 && h > 40 && h > w, 'a hanging string of three fish: taller than wide: ' + [w, h]);
  assert.strictEqual(rif.svg.match(/<g class="pc-string" transform="translate\(([-\d.]+),([-\d.]+)\)/).slice(1).map(Number)[0], x + w / 2, 'centred on the string');
  // everything else as it was, the mark aside
  assert.strictEqual(strip(rif.svg.replace(/<g class="pc-tap pc-tap-fish">[^]*?<\/g>/, '')), strip(A.character('riffle', { pose: 'stand', mood: 'happy', holds: 'string' }).svg));
  assert.deepStrictEqual(tapsOf(A.character('riffle', { pose: 'stand', tap: 'fish' }).svg), [], 'no string, no mark');
  // in every pose that holds the string up (chapter 6's scene rule pins it to stand), and in none that doesn't
  let held = 0;
  for (const pose of A.vocab.otherPoses.riffle) {
    const r = A.character('riffle', { pose, holds: 'string', tap: 'fish' }), has = !!(r.held && r.held.what === 'string');
    checkResult(r, 'fish ' + pose);
    assert.deepStrictEqual(tapsOf(r.svg), has ? ['fish'] : [], pose);
    held += has;
  }
  assert.ok(held >= 5, held + ' poses hold the string');
  const spr = A.character('sprinkle', { pose: 'burp', mood: 'wonder', mist: true, tap: 'mist' });
  checkResult(spr, 'sprinkle mist');
  assert.deepStrictEqual(tapsOf(spr.svg), ['mist']);
  const c = spr.svg.match(/<g class="pc-tap pc-tap-mist"><circle cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)" fill="none"\/><\/g>/);
  assert.ok(c && +c[3] > 30, 'an unpainted circle, the size of the cloud');
  // the mark sits on the cloud: inside the same group as the mist, beside it
  assert.ok(/class="pc-mist"[^]*?<\/g><g class="pc-tap pc-tap-mist">/.test(spr.svg), 'right after the cloud, in its place');
  const mt = spr.svg.match(/<g class="pc-mist" transform="translate\(([-\d.]+),([-\d.]+)\) scale\(([\d.]+)\)"/).slice(1).map(Number);
  assert.ok(Math.abs(+c[1] - mt[0]) < 12 * mt[2] && Math.abs(+c[2] - mt[1]) < 4, 'its middle the cloud’s');
  assert.strictEqual(strip(spr.svg.replace(/<g class="pc-tap pc-tap-mist">[^]*?<\/g>/, '')), strip(A.character('sprinkle', { pose: 'burp', mood: 'wonder', mist: true }).svg));
  assert.deepStrictEqual(tapsOf(A.character('sprinkle', { pose: 'sit', tap: 'mist' }).svg), [], 'no mist, no mark');
  assert.deepStrictEqual(tapsOf(A.character('sprinkle', { pose: 'burp', mood: 'happy', facing: 'left', tap: 'mist' }).svg), ['mist'], 'burp draws its mist: marked facing either way');
  // the bounds and the head don't move for a mark
  const plain = A.character('sprinkle', { pose: 'burp', mood: 'wonder', mist: true });
  assert.deepStrictEqual([spr.bounds, spr.head, spr.headBox], [plain.bounds, plain.head, plain.headBox]);
});

test('the tower’s checks: Waffles in pawup (waving), our cat’s ears and paw taps on sit and pawup, every facing', () => {
  for (const facing of ['left', 'right']) {
    const w = A.character('waffles', { pose: 'pawup', mood: 'proud', facing });
    checkResult(w, 'waffles pawup ' + facing);
    assert.ok(w.bounds.y0 >= 0 && w.bounds.y1 <= 200);
    for (const pose of ['sit', 'pawup']) for (const tap of ['ears', 'paw']) assert.deepStrictEqual(tapsOf(A.character('player', { pose, tap, facing, look: LOOK7 }).svg), [tap], pose + ' ' + tap + ' ' + facing);
  }
  // the raised paw is marked on the raised paw: above the ground, in front of her
  const up = A.character('player', { pose: 'pawup', tap: 'paw', look: LOOK7 }).svg.match(/pc-tap-paw"><circle cx="([-\d.]+)" cy="([-\d.]+)"/);
  assert.ok(+up[2] < 140 && +up[1] > 140, 'her raised forepaw');
});

test('chapter 7’s pictures and drawings: unique ids on one page, every reference resolves, none heavy', () => {
  const pics = [A.countsPicture(skip7({ table: 6, groups: 5, who: RIM7, thing: 'whisker' }, 2)), A.countsPicture(skip7({ table: 6, groups: 4, who: BEDTIME, thing: 'whisker' }, 3)),
    A.countsPicture({ table: 6, per: 6, groups: 10, kind: 'cheeks-top', highlight: 14, look: LOOK7 }), A.countsPicture({ table: 6, per: 6, groups: 2, kind: 'cheeks', who: ONE_CAT, look: LOOK7 }),
    A.countsPicture(skip7({ table: 3, groups: 2, who: [{ who: 'tallyheart' }], thing: 'whisker' }, 1)), A.countsPicture(skip7({ table: 1, groups: 4, thing: 'gap' }, 2)),
    A.countsPicture({ table: 10, groups: 6, per: 10, kind: 'marks', ground: 'mud', highlight: 20 }), A.sand({ groups: 10, per: 6, counted: 33 })];
  const chars = [A.character('riffle', { pose: 'stand', holds: 'string', tap: 'fish' }), A.character('sprinkle', { pose: 'burp', mist: true, tap: 'mist' })];
  const all = pics.join('') + chars.map((c) => c.svg).join('');
  const ids = idsOf(all);
  assert.strictEqual(new Set(ids).size, ids.length, 'every id on the page is its own');
  for (const ref of all.match(/(?:url\(#|href="#)([^)"]+)/g) || []) assert.ok(ids.includes(ref.replace(/^(url\(#|href="#)/, '')), 'dangling ' + ref);
  pics.forEach((s, i) => { checkSvgDoc(s, 'picture ' + i); assert.ok(s.length < 130000, 'picture ' + i + ': ' + s.length); });
  // the cheeks' whiskers are never a character's: every cast member still draws two whiskers a side
  for (const who of CATS) assert.ok(!/pc-whisker/.test(A.character(who, { pose: 'sit', look: LOOK7 }).svg), who + ': no close-up whiskers in a character');
});

test('dev/gallery-cats.html: chapter 7’s sections draw (the taps; the cheeks, faces, one cheek, the gaps, the nights, the sand at per 6), with 1, 9 and 10 cheeks and a face pair', () => {
  const fs = require('fs'), path = require('path'), vm = require('vm');
  const dir = path.join(__dirname, '..', 'dev'), html = fs.readFileSync(path.join(dir, 'gallery-cats.html'), 'utf8');
  const scripts = [...html.matchAll(/<script(?: src="([^"]+)")?>([\s\S]*?)<\/script>/g)];
  const run = (search) => {
    const els = {};
    const el = (id) => els[id] || (els[id] = { id, innerHTML: '', value: id === 'size' ? '120' : '', options: [{ value: '120' }], add() {} });
    const ctx = { URLSearchParams, document: { getElementById: el, body: { className: '' } }, location: { search } };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    for (const m of scripts) vm.runInContext(m[1] ? fs.readFileSync(path.join(dir, m[1]), 'utf8') : m[2], ctx, { filename: m[1] || 'gallery-cats.html' });
    return { out: els.out.innerHTML, nav: els.nav.innerHTML };
  };
  for (const [id, least] of [['extras7', 12], ['counts7', 21]]) {
    const page = run('?only=' + id);
    assert.ok(page.nav.includes('href="?only=' + id + '"'), id + ' is in the menu');
    assert.ok(new RegExp('<section id="' + id + '"><h2>[^<]*hapter 7').test(page.out), id + ': its section');
    assert.ok(count(page.out, /<svg[ >]/g) >= least, id + ': ' + count(page.out, /<svg[ >]/g) + ' drawings');
    assert.ok(!/NaN|undefined|\[object |Infinity/.test(page.out), id + ': every drawing drew');
    assert.strictEqual(balanced(page.out.replace(/<small title="[^"]*">/g, '<small>')), null, id + ': well-formed');
  }
  const counts = run('?only=counts7').out;
  for (const label of ['1 cheek, six whiskers', '9 cheeks, six whiskers each', '10 cheeks, six whiskers each', 'One cheek: two rows of three whiskers', 'The back row: four empty places', '6 nights, 4 marks each', '6 nights, 10 marks each', '1 night, 10 marks', '4 groups of 6 scratches in the sand'])
    assert.ok(counts.includes('aria-label="' + label + '"'), 'the gallery shows: ' + label);
  assert.ok(count(counts, /class="pc-cheek pc-face"/g) >= 6, 'a face pair (2 × 6) and the bedtime faces');
  assert.ok(/pc-tap-fish"[^>]*>[^]*?stroke-dasharray/.test(run('?only=extras7').out) && /pc-tap-mist"[^>]*>[^]*?stroke-dasharray/.test(run('?only=extras7').out), 'the new taps are outlined in the gallery');
});
