/* The storyboards are generated from the story data, so they must never lag behind it: every
 * chapter in app/story/ has its docs/storyboard/chNN.md, exactly as tools/storyboard.mjs writes it
 * now (else run: node tools/storyboard.mjs). Also: the tool prints a chapter-2 frame's skip-count,
 * gift and `when` conditions, chapter 3's new keys and chapter 4's (the Case File, the pages she
 * taps, the 10s), checked on the fixture chapters. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TOOL = path.join(ROOT, 'tools/storyboard.mjs');
const chapters = fs.readdirSync(path.join(ROOT, 'app/story')).filter(f => /^ch\d+\.js$/.test(f)).sort();

function generate(storyFile, tmp) {
  const out = path.join(tmp, path.basename(storyFile, '.js') + '.md');
  const run = spawnSync(process.execPath, [TOOL, storyFile, out], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  return fs.readFileSync(out, 'utf8');
}

test('every chapter in app/story has a storyboard', () => {
  assert.ok(chapters.includes('ch01.js'));
  for (const f of chapters) {
    const md = path.join(ROOT, 'docs/storyboard', path.basename(f, '.js') + '.md');
    assert.ok(fs.existsSync(md), 'docs/storyboard/' + path.basename(md) + ' is missing: run node tools/storyboard.mjs');
  }
});

for (const f of chapters) {
  const id = path.basename(f, '.js');
  test('docs/storyboard/' + id + '.md matches app/story/' + f + ' (else run: node tools/storyboard.mjs)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
    try {
      const fresh = generate(path.join(ROOT, 'app/story', f), tmp);
      const md = path.join(ROOT, 'docs/storyboard', id + '.md');
      const committed = fs.existsSync(md) ? fs.readFileSync(md, 'utf8') : '';
      assert.ok(fresh === committed, 'docs/storyboard/' + id + '.md is stale: run node tools/storyboard.mjs');
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
}

test('it prints a chapter-2 frame’s skip-count, gift and when conditions (the fixture chapter 2)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    // the fixture chapter 2, as a story file of its own
    const file = path.join(tmp, 'fx02.js');
    fs.writeFileSync(file, 'const fx = require(' + JSON.stringify(path.join(ROOT, 'tests/fixtures/chapters.js')) + ')();\n' +
      'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx02 = fx.ch02;\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    assert.match(md, /\*\*Then she counts by 2s\*\* \(the skip-count\): 5 taps, one on each cat in turn \(the next one glows; a tap anywhere else makes it wiggle\).*2, 4, 6, 8, 10\./);
    assert.match(md, /the grizzled old tom\. Then: “TEN! Flat ears still count\.”, and Next\./);
    assert.match(md, /\*\*Gift:\*\* Riffle’s lucky stone: dark and smooth, with a white stripe all the way around \(from Riffle, `riffle-stone`\)/);
    assert.match(md, /> The earth behind the pile is dug up\. \*\(only if specialty is "noticing"\)\*/);
    assert.match(md, /“Psst, it’s deep\.” \*\(only if worry is "water"\)\*/);
    assert.match(md, /“Your first mark is a little deeper\.” \*\(only if the ch02-tails lesson went without help\)\*/);
    assert.match(md, /“Hmph\.” \*\(only if not \(she got 10 × 2 right the first time\)\)\*/);
    assert.match(md, /This option shows only if specialty is "swimming"\./);
    assert.match(md, /- \*\*The old ferry otter\*\*: “WHAT\? SPEAK UP!”/);
    assert.match(md, /2 × 6 \(its own question\)/);
    assert.match(md, /After 5 × 2, right the first time \(the picture regroups as 2 × 5\)/);
    assert.match(md, /It adapts: a 1s fact that was hard for her last time takes question 2, and its twin becomes 1 × 3\./);
    assert.match(md, /comes back two questions later \(the questions in between come from `ch02-ears`, never a pair asked already while there is another, each asked in that lesson’s picture and words\)/);
    assert.match(md, /After 5 × 2, right on its retry \(regrouped again\):/);
    assert.match(md, /one claw mark on the trunk for each Count she has learned/);
    assert.match(md, /## Coming next[\s\S]*\*\*Chapter 3: Under the Old Bridge\*\*/);
    assert.match(md, /\| Skip-counts \| 1 \(5 taps, by 2s\) \|/);
    assert.match(md, /\| Gifts \| Riffle’s lucky stone \(a09\) \|/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('it prints chapter 3’s keys: a frame shown only when, digits, the warm-up’s ordered alt and avoid, ground and who counts, the borrowed questions’ order and voice, the skip-counts on the 5s, the totals that stay, names, the dragonet page (the fixture chapter 3)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx03.js');
    fs.writeFileSync(file, 'const fx = require(' + JSON.stringify(path.join(ROOT, 'tests/fixtures/chapters.js')) + ')();\n' +
      'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx03 = fx.ch03;\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    assert.match(md, /\*\*Shows only if\*\* ch2Path is "river"; otherwise the page turns straight on to d15\./);
    assert.match(md, /- \*\*Glintstar\*\*: “Seven times eight\.” \*\(lettered small beside it, in Andika: 7 × 8\)\*/);
    assert.match(md, /- \*\*\{Murmur\}paw \(Muttering apprentice\)\*\*: “It’s my Warrior Counts today\.”/, 'the chapter’s names for a speaker');
    assert.match(md, /`\{Murmur\}`\/`\{murmur\}` is the tortoiseshell’s name word: Murmur \(Murmurpaw, Murmurchime, murmuring\), or Mutter/);
    assert.match(md, /- \*\*A small voice \(Sprinkle\)\*\*: “You dropped that\.”/);
    assert.match(md, /takes question 2 \(never 9 × 2 or 7 × 2, either way round, while there is another\), and when the opener is one of her hardest facts or that fact’s pair, the first of 2 × 3, 2 × 2, 2 × 1 that is neither opens instead\./);
    assert.match(md, /`ch03-ears`[^\n]*a miss gets the count scratched in the earth, and comes back two questions later/);
    assert.match(md, /`ch03-dinner`[^\n]*a miss gets the count scratched in the mud, Sprinkle swiping and the player keeping the count, and comes back two questions later \(the questions in between come from `ch03-claws`, the easiest first, never a pair asked already while there is another, each asked in that lesson’s picture and this lesson’s own voice after “Count another one with me\.”\)/);
    assert.match(md, /- Asking 2 × 5 again after a miss:\n  - \*\*Sprinkle\*\*: “Let’s count my dinner again! Two forepaws, five claws each\. How many fish at a meal\?”/);
    assert.match(md, /- After a miss that ends in neither a five nor a zero: “Remember: hopping by fives, every number ends in a five or a zero\. Let’s scratch it out together\.”/);
    assert.match(md, /- No closing line: the next frame goes straight on\./);
    assert.match(md, /`ch03-six` \(claws, forepaws drawn in the mud\)/);
    assert.match(md, /\*\*Then she counts by 5s\*\* \(the skip-count\): 5 taps, one on each raised forepaw in turn[^\n]*each lighting its five claws and adding its running total: 5, 10, 15, 20, 25\.[^\n]*The running totals stay under the paws on the pages after it, up to the lesson\./);
    assert.match(md, /\*\*The totals stay:\*\* in place of this scene, the counting picture from d07, every paw lit, its running totals \(5, 10, 15, 20, 25\) under them, until the lesson starts/);
    assert.match(md, /\*\*Then she hops by 5s on her own forepaws\*\* \(the skip-count\): 4 taps on her own two forepaws, left, right, left, right[^\n]*5, 10, 15, 20\./);
    assert.match(md, /Sprinkle, a Mistscale dragonet \(about a heron’s size, mist-grey, her right wing drooping\) \(both forepaws up, claws spread, happy, in Sprinkle’s spot at the very back\); you \(sitting, happy, pressed against Sprinkle’s side\)/);
    assert.match(md, /moss pulled over the ears/);
    assert.match(md, /a misty tear/);
    assert.match(md, /\*\*A dragonet page:\*\* Sprinkle \(`sprinkle`\), found in this chapter\./);
    assert.doesNotMatch(md, /\[object Object\]|undefined/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('it prints chapter 4’s keys: the Case File’s cards, a card a frame gives, flags set for good, the bark Taps, the glitter Tap, the file frame, an option’s other label, the skip-counts on the 10s, the tens’ keys, Squall’s page (the fixture chapter 4)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx04.js');
    fs.writeFileSync(file, 'const fx = require(' + JSON.stringify(path.join(ROOT, 'tests/fixtures/chapters.js')) + ')();\n' +
      'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx04 = fx.ch04;\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    // the cards: a table of all nine, and each where it is given
    assert.match(md, /## The Case File’s cards[\s\S]*\| `four-a-night` \| eye \| Four gone every night\. \| g20 \|  \|/);
    assert.match(md, /\| `fox-flew` \| ear \| The fox says it FLEW\. \| g23a, g23b \| answered by `cant-fly` \(for chapter 10\); drawn touching them once ch4CaughtFly is true: “They can’t both be true\.” \|/);
    assert.match(md, /\| `squall-shapes` \| ear \|[^\n]*\| r05 \| her file shows it only once foundSquall is true \|/);
    assert.match(md, /\| `dug-earth` \| eye \| Freshly dug earth behind the pile\. \| g21 \|/);
    assert.match(md, /\| Case File cards \| 9 \(6 eyes, 3 ears\) \|/);
    assert.match(md, /\*\*New card:\*\* “Four gone every night\.” \(`four-a-night`, an eye: she saw it herself\) goes into her Case File the first time she reaches this panel, and is shown under the panel: its picture, with no mark yet \(its line is a balloon here, so it is lettered once\)\./);
    assert.match(md, /\*\*New card:\*\* “The fox says it FLEW\.” \(`fox-flew`, an ear: she was told\)[^\n]*its picture and its mark, and its line\. Back never takes it away\./);
    assert.match(md, /\*\*New card:\*\* “Squall says two skinny shapes[^\n]*Her Case File shows it only once foundSquall is true \(and on this panel\)\./);
    // flags set for good
    assert.match(md, /\*\*Set for good:\*\* `foundSquall: true`, by reaching this panel\. Nothing unsets it: not Back, not a second reading\./);
    assert.match(md, /\*\*Set for good:\*\* `ch4CaughtFly: true`/);
    // the pages she taps
    assert.match(md, /\*\*Then she taps the bark to scratch it\*\* \(one tap; in play the one curl of bark takes the panel, glowing\): the picture of “Four gone every night\.”[^\n]*no card is given yet, and no line is lettered\. The tap turns the page to g20\. The instruction under the panel: “Tap the bark to scratch it\.”/);
    assert.match(md, /\*\*Then she scratches the bark, a tap for each piece\*\*[^\n]*“Four gone every night\.” \(`four-a-night`, an eye: she saw it herself\) lies at the head of the row, scratched already\.[^\n]*“The thief leaves the pile tidy\.” \(`tidy`, an eye: she saw it herself\); “Freshly dug earth behind the pile\.” \(`dug-earth`, an eye: she saw it herself\) \*\(only if specialty is "noticing"\)\*; “The ‘scale’ is smooth, like glass\.”[^\n]*The last tap turns the page to g22\./);
    assert.match(md, /\*\*Then she taps the glitter\*\* \(one tap, on this scene\): a soft star pulses on it; a tap on it makes it flare and turns the page to g11; a tap anywhere else makes it twinkle\.[^\n]*The instruction under the panel: “Tap the glitter\.”/);
    assert.match(md, /\*\*Then she opens her Case File, for the first time\*\*: its curl of bark has appeared in the top bar, glowing[^\n]*“Tap your Case File\. You can open it any time\.”[^\n]*Closing it turns the page to g27\./);
    assert.match(md, /\| Other things she taps \| the glitter \(g10\), the bark \(g19\), a row of bark \(g21\), her Case File \(g26\) \|/);
    // the tower choice, for a reader who has met him
    assert.match(md, /Branch A \(from g27\): “Go up and find him\. Right now\.”\n\n\*If she chooses this\.[^\n]*\* \*For a reader whose foundSquall is true, the option reads: “Go up and see Squall again\.”\*/);
    assert.match(md, /\*For a reader whose foundSquall is true, the option reads: “Not today\. He’s guarding\.”\*/);
    // the skip-counts
    assert.match(md, /\*\*Then she counts by 10s\*\* \(the skip-count\): 5 taps, one on each cat in turn[^\n]*each lighting the ten claws on its two forepaws and adding its running total: 10, 20, 30, 40, 50\.[^\n]*the grizzled old tom\. The last tap turns the page to g05, which shows the 50\. The running totals stay under the cats on the pages after it, up to the lesson\. The instruction under the panel: “Tap the cats, left to right\.”/);
    assert.match(md, /\*\*The totals stay:\*\* in place of this scene, the counting picture from g04, every cat lit, its running totals \(10, 20, 30, 40, 50\) under them, until the lesson starts/);
    assert.match(md, /\*\*Then she taps the forepaw Squall holds up\*\* \(one tap[^\n]*its five claws light and a big 5 grows over them\.[^\n]*The tap turns the page to b01, which does not show the number\.[^\n]*For VoiceOver, a hidden button: “Tap his forepaw\.”/);
    assert.match(md, /\*\*Then she hops by 10s on the pile of forepaws\*\* \(the skip-count\): 3 taps, one for each friend[^\n]*putting the next number in her own balloon: 10, 20, 30\.[^\n]*which shows the 30\./);
    assert.match(md, /\*\*Then she hops by 10s on both forepaws\*\* \(the skip-count\): 5 taps, her own two forepaws patted down together each time[^\n]*in her own murmur: 10, 20, 30, 40, 50\./);
    assert.match(md, /\| Skip-counts \| 4 \(5 taps, by 10s; 1 tap, by 5s; 3 taps, by 10s; 5 taps, by 10s\) \|/);
    assert.doesNotMatch(md, /\*\*The count:\*\* the skip-count’s 5 \(from r06\)/, 'the roof’s 5 stays on the roof');
    // the Counts sets
    assert.match(md, /`ch04-riddle` \(claws, forepaws scratched in the roof’s grit\)[^\n]*a miss gets the count scratched in the roof’s grit, Squall swiping and the player keeping the count,/);
    assert.match(md, /- After a miss that doesn’t end in a zero: “Remember: hopping by tens, every number ends in a zero\. Let’s scratch it out together\.”/);
    assert.match(md, /- In the Training Hollow: its button reads “Both forepaws · the 10s”, and Tallyheart calls it “tens”\./);
    assert.match(md, /`ch04-pile`[^\n]*the questions in between come from `ch04-tens`, the easiest first[^\n]*after “One from this morning\.”/);
    // the speakers, and the scenes in words
    assert.match(md, /- \*\*The fox \(Reynard\)\*\*: “Ahem\.”/);
    assert.match(md, /- \*\*Reynard \(Reynard\)\*\*: “AT it, dear lady\. Never over it\.”/);
    assert.match(md, /- \*\*The little dragon \(Squall\)\*\*, shouting: “AND STAY OUT, giant dragon!”/);
    assert.match(md, /- \*\*Squall \(Squall\)\*\*: “She IS\? …I’m Squall\./);
    assert.match(md, /laid out in rows\)\. Camera: wide[^\n]*Also: three rows of ten, running back under the brambles; the back row is a dark band in the brambles’ shadow: no gap, no dug earth and no “scale” can be made out\./);
    assert.match(md, /Also: three rows of ten, running back under the brambles; the back row has four empty places side by side, right in its middle \(three pieces, the gap, three pieces\); a bigger patch of soft, lumpy, dug-up earth behind the pile; the “scale” in the gap, leaning on the next piece; the sun reaches the “scale”: it glitters\./);
    assert.match(md, /four rows of ten, running back under the brambles; the “scale” where it was found, on the bare earth behind the back row: a small glint under the brambles/);
    assert.match(md, /her Case File along the mossy edge of her nest: a piece of bark for each card she holds, overlapping like roof tiles; two of the pieces of bark under the moss, two corners showing/);
    assert.match(md, /a curl of pale bark falling from the trunk/);
    assert.match(md, /\*\*Shows only if\*\* not \(ch3Told is true and foundSquall is false or not set\); otherwise the page turns straight on to h02\./);
    // her book
    assert.match(md, /\*\*A dragonet page:\*\* Squall \(`squall`\), found in this chapter by a reader whose foundSquall is true \(the page is there only then\)\./);
    assert.doesNotMatch(md, /\[object Object\]|undefined/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('its words for chapter 4’s art: the roof and its cameras, the border, the fox and the littlest dragonet in their poses, a frame’s else', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx09.js');
    const c = (who, pose, at, extra) => Object.assign({ who, pose, mood: 'happy', at, facing: 'left' }, extra || {});
    const story = { id: 'fx09', number: 9, title: 'Words', start: 'a', frames: {
      a: { scene: { set: 'roof', cam: 'wide', opts: { plane: true, moth: true, grit: 'paws' }, cast: [c('squall', 'hug', 'pole'), c('player', 'situp', 'beside', { holds: 'bark' }), c('tallyheart', 'sit', 'door', { wink: true })] }, caption: ['The roof.'], next: 'b' },
      b: { scene: { set: 'roof', cam: 'paw', opts: {}, cast: [c('squall', 'pawup', 'pole'), c('squall', 'roar', 'beside'), c('squall', 'hiccup', 'door')] }, caption: ['Five.'], next: 'c' },
      c: { scene: { set: 'field', cam: 'border-fox', opts: { foxTail: true }, cast: [c('reynard', 'comb', 'fox', { flick: true }), c('reynard', 'sit', 'fox'), c('glintstar', 'stand', 'lead'), c('tallyheart', 'sit', 'left'), c('player', 'sit', 'right'), c('grizzled', 'sit', 'back-1')], fx: ['day'] },
        caption: ['The border.'], next: 'd' },
      d: { when: { foundSquall: false }, else: 'f', scene: { set: 'tower', cam: 'up', opts: { light: true, roar: true, ding: true }, cast: [c('player', 'stretch', 'corner'), c('waffles', 'peer', 'railing')] }, caption: ['The roar again.'],
        choice: { options: [{ label: 'Go up.', next: 'e' }, { label: 'Not today.', next: 'f' }] } },
      e: { scene: { set: 'bridge', cam: 'paws', opts: { pawsIn: 'both' }, cast: [] }, caption: ['Up.'], next: 'f' },
      f: { scene: { set: 'hollow', cam: 'wide', opts: { marks: 4, heap: true, bark: 'row' }, cast: [c('sprinkle', 'check', 'sand-left'), c('sprinkle', 'tailout', 'sand-right')] }, caption: ['The end.'], end: true }
    }, counts: {}, book: { recap: [] } };
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx09 = ' + JSON.stringify(story) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    assert.match(md, /Roof: the roof of the tallest tower, flat and wide, in the gold of the afternoon \(pale grit underfoot, a low wall all the way round, one pole in the middle with a small red light/);
    assert.match(md, /Camera: wide: the pole in the middle of the roof, the roof door at one side \(`wide`\)\. Cast: Squall, the littlest dragonet[^;]*\(sitting at the foot of the pole, forelegs and tail wrapped round it, happy, at the foot of the pole, facing left\); you \(sitting up on the haunches, both forepaws raised, claws out, happy, beside the pole, facing left, holding a curl of pale bark\); Tallyheart \(sitting, happy, by the roof door, facing left, one slow wink\)\. Also: an airplane passing well above the roof; a moth; seven little forepaws scratched in the grit, five claw marks each\./);
    assert.match(md, /Camera: close on one small forepaw held up, five claws out, at our cat’s nose height \(`paw`\)\. Cast: [^\n]*\(one forepaw raised, five claws out, happy[^\n]*\(head back, roaring, his mouth a round O, happy[^\n]*\(bounced by a hiccup, eyes crossed, one ring of mist/);
    assert.match(md, /Camera: the fox chest-up, in three-quarter view, a corner of Tallyheart in the near edge; never full face \(`border-fox`\)\. Cast: Reynard, the fox \(lean and red-orange/);
    assert.match(md, /no teeth, ever\) \(combing his enormous tail with his claws, happy, in the long grass just past the last post, facing left, one ear flicks\); Reynard, the fox/);
    assert.match(md, /no teeth, ever\) \(sitting very neatly, happy, in the long grass just past the last post, facing left\); Glintstar \(standing, happy, at the front of the Clan, on the path, facing left\); Tallyheart \(sitting, happy, at the leader’s left shoulder, facing left\); you \(sitting, happy, at the leader’s right shoulder, facing left\); the grizzled old tom \(sitting, happy, behind them on the path, facing left\)\. Also: a white-tipped tail going into the long grass\./);
    assert.match(md, /\*\*Shows only if\*\* foundSquall is false or not set; otherwise the page turns straight on to f\./);
    assert.match(md, /small on a balcony halfway up the tower[^\n]*Also: the little red light blinks on the tallest roof; jagged sound lines from the tower roof; a small “DING!” lettered at the very top, beside the red light\./);
    assert.match(md, /six forepaws piled together, fanned so all thirty claws show: two of hers, Sprinkle’s two in grey, Riffle’s two in webbed brown/);
    assert.match(md, /\(looking herself over, nose to tail, happy, on the sand, left, facing left\); Sprinkle[^;]*\(holding out her tail,[^\n]*Also: 4 claw marks on the trunk; the five rim cats all in a heap; blank curls of bark in a row on the sand\./);
    assert.match(md, /\| Frames \| 6 /, 'the frame behind the else is reached');
    assert.doesNotMatch(md, /Not reachable from the start/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('its words cover the art’s whole vocabulary: every set (with its time of day), camera, anchor, option value, pose, mood, effect and cast member', () => {
  const run = spawnSync(process.execPath, [TOOL, '--check-words'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
});

test('a frame’s scene says its own time of day, and the cast extras in words (chapter 2)', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch02.md'), 'utf8');
  const scenes = md.split('\n').filter(l => l.startsWith('**Scene.** Den:'));
  assert.ok(scenes.some(l => /rosebush, in the morning\./.test(l)), 'the den in the morning');
  assert.ok(scenes.some(l => /rosebush, at night\./.test(l)), 'the den at night');
  assert.ok(!scenes.some(l => /in the morning/.test(l) && /at night/.test(l)));
  assert.match(md, /Riffle’s stone at the front paws/);
  assert.match(md, /purring \(the purr lines come from this one alone\)/);
  assert.match(md, /lifted onto a pouf/);
  assert.match(md, /ears laid flat/);
  assert.match(md, /on the far side of the old tree/);
  assert.match(md, /right where she put it/);
  assert.match(md, /- \*Caption\*: You touch your nose to each little stack\./);
  assert.doesNotMatch(md, /\[object Object\]/);
});

test('with no arguments the tool writes a storyboard for every chapter (run in a copy of the repo)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    for (const d of ['tools', 'app/story', 'docs']) fs.mkdirSync(path.join(tmp, d), { recursive: true });
    fs.copyFileSync(TOOL, path.join(tmp, 'tools/storyboard.mjs'));
    fs.copyFileSync(path.join(ROOT, 'app/engine.js'), path.join(tmp, 'app/engine.js'));
    for (const f of chapters) fs.copyFileSync(path.join(ROOT, 'app/story', f), path.join(tmp, 'app/story', f));
    const run = spawnSync(process.execPath, [path.join(tmp, 'tools/storyboard.mjs')], { encoding: 'utf8', cwd: tmp });
    assert.equal(run.status, 0, run.stderr);
    for (const f of chapters) {
      const id = path.basename(f, '.js');
      const md = fs.readFileSync(path.join(tmp, 'docs/storyboard', id + '.md'), 'utf8');
      assert.match(md, new RegExp('^# Storyboard: Chapter \\d+, '), id);
      assert.match(run.stdout, new RegExp('Wrote docs/storyboard/' + id + '\\.md'));
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const bad = spawnSync(process.execPath, [TOOL, path.join(ROOT, 'no-such-chapter.js')], { encoding: 'utf8' });
  assert.notEqual(bad.status, 0, 'a story file that is not there fails loudly');
});
