/* The storyboards are generated from the story data, so they must never lag behind it: every
 * chapter in app/story/ has its docs/storyboard/chNN.md (and the Warrior Counts, warrior.js, its warrior.md), exactly as tools/storyboard.mjs writes it
 * now (else run: node tools/storyboard.mjs). Also: the tool prints a chapter-2 frame's skip-count,
 * gift and `when` conditions, chapter 3's new keys, chapter 4's (the Case File, the pages she
 * taps, the 10s) and chapter 5's (the questions she taps out, the skip-count's new forms, the 9s,
 * the river's sets, the open river and the marsh), checked on the fixture chapters. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TOOL = path.join(ROOT, 'tools/storyboard.mjs');
const chapters = fs.readdirSync(path.join(ROOT, 'app/story')).filter(f => /^(ch\d+|warrior)\.js$/.test(f)).sort();

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
    // (chapter 7: the hidden cards in words that never count them: chapter 4 hides two, chapter 6 three, chapter 7 six)
    assert.match(md, /her Case File along the mossy edge of her nest: a piece of bark for each card she holds, overlapping like roof tiles; her secret cards under the moss, a corner showing for each/);
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

test('it prints chapter 5’s keys: the one-tap frames with their small answers, the questions she taps out, the tuck, her paws aboard, the claws in the log with its steps, the mud count, the bedtime nines, the nines and their help, the river’s sets, a silent set, another chapter’s set run here, cards that name what they touch, the two dragonet pages (the fixture chapter 5)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx05.js');
    fs.writeFileSync(file, 'const fx = require(' + JSON.stringify(path.join(ROOT, 'tests/fixtures/chapters.js')) + ')();\n' +
      'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx05 = fx.ch05;\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    // the pages she taps
    assert.match(md, /\*\*Then she taps the old tom’s nose\*\* \(one tap, on this scene\): it glows softly; a tap on it turns the page to p02; a tap anywhere else gets a small answer \(lettered small beside it: “snnnrrk…”\) and nothing more\.[^\n]*The instruction under the panel: “Tap his nose to wake him up\.” For VoiceOver, a hidden button: “Wake him up\.”/);
    assert.match(md, /\*\*Then she taps the tuft of fur\*\*[^\n]*“flutter…”/);
    assert.match(md, /\*\*Then she taps Riffle’s pole\*\*[^\n]*turns the page to m14/);
    assert.match(md, /\*\*Then she taps Riffle, once for each question\*\* \(seven taps, on this scene, counting nothing\): Riffle glows softly; a tap on him letters his next question in his balloon and Patience’s answer in hers[^\n]*No number is shown, nothing can be got wrong, and nothing is logged\. After the last one: Next → m05\. The instruction under the panel: “Tap Riffle to let one out\.”\n\n1\. \*\*Riffle\*\*: “Do you sleep standing up\?” \*\*Patience\*\*: “Yes\.”\n2\./);
    assert.match(md, /7\. \*\*Riffle\*\*: “Am I your favorite\?” \*\*Patience\*\*: “No\.”/);
    assert.match(md, /\| Other things she taps \| the old tom’s nose \(p01\), the freshly dug earth \(p03n\), the tuft of fur \(ha6\), the tuft of fur \(hb6\), Riffle’s seven questions \(m04\), the mud \(m12\), Riffle’s pole \(m13c\) \|/);
    // the skip-count's new forms
    assert.match(md, /\*\*Then she tucks a claw in on each cat\*\* \(the skip-count, backwards\): the five cats sit up with all 50 claws lit and a big 50 over them; 5 taps[^\n]*stepping the number back by one: 49, 48, 47, 46, 45\. No number is ever shown under a cat, only the big one over them all\.[^\n]*Murmurchime, the tortoiseshell warrior[^\n]*the grizzled old tom\. The last tap turns the page to h06, which shows the 45\. The picture stays on the pages after it, up to the lesson: nine claws lit and one dark on every cat, 45 over them, and still no number under any cat\./);
    assert.match(md, /\*\*The picture stays:\*\* in place of this scene, the counting picture from h05, nine claws lit and one tucked in on every cat, 45 over them and no number under any cat, until the lesson starts/);
    assert.doesNotMatch(md, /its running totals \(9, 18, 27, 36, 45\)/, 'the tuck keeps no totals: they would be the lesson’s answers');
    assert.match(md, /\*\*Then she steps aboard, a paw at a time\*\* \(the skip-count, in words\): 4 taps, her own four paws at the edge of the rocks[^\n]*while Tallyheart counts it: One\. Two\. Three\. Four\. Nothing can be got wrong, and nothing is logged\. The last tap turns the page to c07, which does not show the number\./);
    assert.match(md, /\*\*Then she digs her claws into the log, one at a time\*\* \(the skip-count; this scene stays on screen, drawn again at every tap\): 9 taps, anywhere[^\n]*in her own thought: 1, 2, 3, 4, 5, 6, 7, 8, 9\. The tenth claw stays tucked\.[^\n]*As she taps, the scene changes: from tap 1, far down the river, a light low in the sky: the skymonster, a glint \(lettered along the top: rrr…\); from tap 4, the skymonster nearer: a shape with wings \(lettered along the top: RRRrrr…\); from tap 7, the skymonster right overhead, its belly filling the top of the panel \(lettered along the top: RRRRRR…\)\./);
    assert.match(md, /\*\*Then she lights a forepaw for everyone found\*\* \(the skip-count, by 5s\): seven little forepaws drawn in the mud[^\n]*a tap for each of Sprinkle, Squall \(only if foundSquall is true\), Puddle \(only if foundPuddle is true\), Wisp \(only if foundWisp is true\), so up to four taps[^\n]*in Sprinkle’s balloon: 5, 10, 15, 20\. The other forepaws stay dark\.[^\n]*which shows the number she reached \(10, 15 or 20\)\./);
    assert.match(md, /\*\*The count:\*\* the number the skip-count reached for her \(from b04\) shows big over the picture/);
    assert.doesNotMatch(md, /the skip-count’s 25 \(from b04\)/, 'never the 25 of five taps');
    assert.match(md, /\*\*Then she hops by 9s on both forepaws\*\* \(the skip-count\): 5 taps[^\n]*each lighting all nine claws \(one claw stays tucked in\) and putting the next number in her own murmur: 9, 18, 27, 36, 45\./);
    assert.match(md, /\*\*Then she taps the forepaw Puddle holds up\*\*/);
    assert.match(md, /\*\*Then she taps the forepaw Wisp holds up\*\*[^\n]*“Tap her forepaw\.”/);
    assert.match(md, /\| Skip-counts \| 9 \(5 taps, by ones, back from 50; 1 tap, by 5s; 4 taps, by 1s; 9 taps, by 1s; 1 tap, by 5s; 1 tap, by 5s; 1 tap, by 5s; 1 to 4 taps, by 5s; 5 taps, by 9s\) \|/);
    // the Counts
    assert.match(md, /`ch05-tens` \(front claws\)[^\n]*It adapts: a 10s fact that was hard for her last time takes question 1 \(never 5 × 10 or 3 × 10, either way round\)\. None of this frame’s own lines is said again over the first question: it is asked in the engine’s own words, and timed on itself\./);
    assert.match(md, /`ch05-nines` \(lives\): 2 × 9 [^\n]*4 × 9 \(its own question, kept on its retry; its own lines after a right answer; its own lines after a right retry; its own lines after a miss; her answers scratched in the sand with its line\)[^\n]*Every question it asks first, and every retry, plays the two steps in its picture without a word: all ten claws lit on every cat \(the hop\), one curling in on each \(the tuck\), then unlit, and she types\. A question lent to fill a gap shows the still picture\. She types each answer on the keypad; a miss gets the sand count in two steps \(two swipes for every cat, hopped by tens; then one line rubbed out of every pair, stepping back by ones\) and comes back two questions later \(the questions in between are the easiest of her right answers in this lesson, not the latest\)\./);
    assert.match(md, /- After a miss on 4 × 9, when it comes back:\n  - \*\*Tallyheart\*\*: “Thirty-six\. Now look\. Three and six make nine\. \{also\}Every nines answer hides a nine! We’ll come back to that one\.”/);
    assert.match(md, /- With the lines after 4 × 9, right the first time or missed: her answers scratched in the sand, 18 and 36 \(2 × 9 only once she has answered it right with no ask of it still to come; `\{also\}` in those lines is “One and eight make nine\.” when they are all there, and nothing when not\)\./);
    assert.match(md, /- After a miss that is the tens \(the hop without the tuck\): “That’s the hop! Now the tuck: one claw in for every cat\.”\n- After a miss that is the tens less one \(one claw tucked, for two cats or more\): “So close! You tucked ONE claw\. Tuck one in for every cat\.”\n- After a miss whose two numbers don’t make nine, once the lesson has shown her that they should \(in the Training Hollow, always\): “Remember: the two numbers in a nines answer make nine\. Let’s scratch it out together\.”/);
    assert.match(md, /- In the Training Hollow: its button reads “Nine lives · the 9s”, and Tallyheart calls it “nines”\./);
    assert.match(md, /`ch05-otter` \(fish, fish in pairs in a thought cloud\)[^\n]*a miss gets the count scratched on a log of the raft, the player scratching and keeping the count herself, and comes back two questions later \(the questions in between come from `ch02-ears`, the easiest first, never a pair asked already while there is another, each asked as this lesson’s own question, in its picture and its voice after “An easy one!”\)/);
    assert.match(md, /`ch05-catch` \(fish, fish on reed strings\)[^\n]*Its picture lights a group at a time as each question is asked\./);
    assert.match(md, /`ch05-puddle` \(bumps, the raft from underneath, bump stars on its logs\)[^\n]*a miss gets the set’s own picture lit a group at a time, the player keeping the count,/);
    assert.match(md, /`ch05-wisp` \(legs in the water, little herons scratched in the mud\)/);
    assert.match(md, /- Asking 7 × 1 again after a miss:\n  - \*Caption\*: She taps the seven herons again\.\n  - \*Caption\*: Seven herons, each standing on one leg\. How many legs in the water\?/);
    assert.match(md, /- The help’s first line is said by Patience: “Look again\. One leg each\.”\n- Nobody speaks in this set: every line the engine words itself[^\n]*is lettered as a caption\./);
    assert.match(md, /\*\*Then the Counts lesson\*\* `ch04-riddle`, another chapter’s, run here as it is there \(see that chapter’s storyboard\)\. On to r04\./);
    // frames only some readers see, and a second reading's labels
    assert.match(md, /\*\*Shows only if\*\* not \(foundSquall is true and ch5Roof is false or not set\); otherwise the page turns straight on to c01\./);
    assert.match(md, /\*For a reader whose ch5Roof is true, the option reads: “Go up and see Squall again\.”\*/);
    assert.match(md, /\*For a reader whose foundPuddle is true, the option reads: “Lean over, and say hello to Puddle\.”\*/);
    assert.match(md, /\*\*Shows only if\*\* not \(ch5Roof is false or not set and foundPuddle is false or not set and foundWisp is false or not set\); otherwise the page turns straight on to b05\./);
    assert.match(md, /\*\*Set for good:\*\* `foundSquall: true`, `ch5Roof: true`, by reaching this panel\./);
    assert.match(md, /\*\*Set for good:\*\* `foundWisp: true`/);
    // the cards, and the cards they touch
    assert.match(md, /\| `heron-no-moon` \| ear \| Patience says there was NO moon on the storm night\. \| m07 \| drawn touching `fox-moon` from the moment she holds both: “One of them is wrong\.” \|/);
    assert.match(md, /\| `prints-tracks` \| eye \|[^\n]*\| m14 \| drawn touching `squall-shapes` from the moment she holds both: “Both lead toward the tracks\.” \|/);
    assert.match(md, /\| `puddle-paws` \| ear \|[^\n]*\| ua6, ub6 \| her file shows it only once foundPuddle is true \|/);
    assert.match(md, /\| Case File cards \| 9 \(4 eyes, 5 ears\) \|/);
    assert.match(md, /\*\*New card:\*\* `squall-shapes` \(a card another chapter defines\)/);
    // speakers and scenes in words
    assert.match(md, /- \*\*The big-footed dragon \(Puddle\)\*\*: “I’m not here\. I’m a log\.”/);
    assert.match(md, /- \*\*Puddle \(Puddle\)\*\*: “I’m Puddle\./);
    assert.match(md, /- \*\*Patience\*\*: “Seven answers\.”/);
    assert.match(md, /Openriver: the open river, out on the otters’ ferry raft, by day \(wide bright water, the Crossing’s own sunny blue, never dark/);
    assert.doesNotMatch(md, /green-brown/, 'the open river is the Crossing’s blue (README, Claude’s calls under decision 46)');
    assert.match(md, /Marsh: the marsh, seen from the otters’ raft, in the afternoon light/);
    assert.match(md, /Riffle, the otter pup \(standing up on his hind legs, happy, on the raft, hugging the raft’s pole, twice his size\)/);
    assert.match(md, /the grizzled old tom \(sitting, sleepy, lying beside the pile, eyes shut: asleep sitting up, a snail halfway up one ear\)/);
    assert.match(md, /one claw curled back in: nine out, one tucked/);
    assert.match(md, /a thought cloud over the heron, with eight pairs of small silver fish in it \(what she is owed\)/);
    assert.match(md, /Riffle’s pole planted in the mud beside the raft, holding it still/);
    assert.match(md, /one pale reed jerks, once, among reeds that do not/);
    assert.match(md, /three emptied reed strings on the logs, and the fourth with its two spare fish still on it/);
    assert.match(md, /seven little forepaws drawn in the mud, five claw marks each/);
    // her book
    assert.match(md, /\*\*A dragonet page:\*\* Puddle \(`puddle`\), found in this chapter by a reader whose foundPuddle is true \(the page is there only then\)\. Her book gains a page for Puddle \(drawn his head out of the water, a small bump on it\), with room for her own drawing/);
    assert.match(md, /\*\*A dragonet page:\*\* Wisp \(`wisp`\)[^\n]*\(drawn standing on one leg among the reeds, her eyes open\)/);
    assert.doesNotMatch(md, /\[object Object\]|undefined|NaN/);
    assert.doesNotMatch(md, /Not reachable from the start/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('its words for chapter 5’s art: the open river and the marsh with their cameras and options, the heron and the two dragonets in their poses, the otters’ new poses, what the old places gain', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx10.js');
    const c = (who, pose, at, extra) => Object.assign({ who, pose, mood: 'happy', at, facing: 'left' }, extra || {});
    const story = { id: 'fx10', number: 10, title: 'Words', start: 'a', frames: {
      a: { scene: { set: 'openriver', cam: 'raft', opts: { plane: 'near', shiver: true, bubbles: true }, cast: [c('player', 'sit', 'raft-1'), c('riffle', 'flip', 'raft-2'), c('riffle', 'stand', 'pole', { holds: 'pole' }), c('tallyheart', 'sit', 'far-rocks'), c('puddle', 'head', 'beside')], fx: ['day'] }, caption: ['The river.'], next: 'b' },
      b: { scene: { set: 'openriver', cam: 'sky', opts: { plane: 'over', face: true, late: true, foot: true, claws: 7 }, cast: [c('otter', 'slap', 'far-rocks', { variant: 2 }), c('puddle', 'pawup', 'beside'), c('puddle', 'log', 'beside'), c('puddle', 'nostrils', 'beside')], fx: ['sunset'] }, caption: ['The sky.'], next: 'c' },
      c: { scene: { set: 'marsh', cam: 'heron', opts: { prints: true, fish: 'strings', owed: 1, pole: 'planted', dragonfly: 'nose', frogs: 'sit', pale: 'knees', snout: true, drawing: 'herons', tap: 'mud' },
        cast: [c('patience', 'stand', 'shallows'), c('patience', 'feather', 'shallows'), c('patience', 'gulp', 'shallows'), c('wisp', 'reed', 'reed'), c('wisp', 'flinch', 'reed'), c('wisp', 'gulp', 'reed'), c('riffle', 'point', 'raft-2'), c('riffle', 'fall', 'raft-2'), c('player', 'peer', 'pole-top'), c('clancat', 'sit', 'log-2', { variant: 3 })], fx: ['day'] }, caption: ['The marsh.'], next: 'd' },
      d: { scene: { set: 'pile', cam: 'gap', opts: { rows: [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }], prints: true, swept: true }, cast: [c('grizzled', 'walk', 'behind', { snail: 'in' })], fx: ['morning'] }, caption: ['The gap.'], next: 'e' },
      e: { scene: { set: 'crossing', cam: 'board', opts: { tuft: true, late: true }, cast: [c('riffle', 'hop', 'raft-1'), c('riffle', 'whistle', 'raft-2'), c('riffle', 'groan', 'raft-3')] }, caption: ['The rocks.'], next: 'f' },
      f: { scene: { set: 'bridge', cam: 'back', opts: { mudPaws: 7 }, cast: [c('sprinkle', 'lookdown', 'dragon')] }, caption: ['The mud.'], next: 'g' },
      g: { scene: { set: 'den', cam: 'outside', opts: { moon: 5 }, cast: [c('player', 'sit', 'entrance-l', { buzz: true, dragonfly: true }), c('patience', 'stand', 'entrance-r', { dragonfly: true }), c('riffle', 'hop', 'entrance-r', { glow: true }),
        c('grizzled', 'sit', 'entrance-l', { asleep: true, snail: true, tap: 'nose' }), c('riffle', 'hug', 'entrance-r', { holds: 'pole', tap: 'pole' }), c('player', 'situp', 'entrance-l', { tuck: true })], fx: ['dusk'] }, caption: ['The end.'], end: true }
    }, counts: {}, book: { recap: [] } };
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx10 = ' + JSON.stringify(story) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    assert.match(md, /Camera: at cat height on the logs, shoulder to shoulder; the rocks behind, with the otters on them \(`raft`\)\. Cast: you \(sitting, happy, on the raft, facing left\); Riffle, the otter pup \(turning a somersault, happy, on the raft, facing left\); Riffle, the otter pup \(standing up on his hind legs, happy, at the poling spot, at the raft’s end, facing left, holding the raft’s long pole\); Tallyheart \(sitting, happy, far off, on the Crossing’s tall rock, facing left\); Puddle, a Mistscale dragonet[^;]*\(his head out of the water, a small bump on it, happy, in the water beside the raft, facing left\)\. Also: the skymonster nearer: a shape with wings; small rings all round the raft: it is shivering; two nostrils and a string of bubbles between the logs: he is up again\./);
    assert.match(md, /Openriver: the open river, out on the otters’ ferry raft, in the late gold of the way home/);
    assert.match(md, /Camera: straight up from the raft: the airplane’s belly and its row of little round windows \(`sky`\)\. Cast: an otter \(slapping his tail on the water,[^\n]*\(one forepaw raised and his chin dipping, his eyes and his grin still above the water,[^\n]*\(floating very straight, eyes shut: being a log,[^\n]*\(two nostrils and a string of bubbles,[^\n]*Also: the skymonster right overhead, its belly filling the top of the panel; at one of the little round windows, one small face pressed to the glass \(never a wave\); late gold light, for the way home; a blue-grey foot, much too big, poking up between two logs; seven of her claws dug into the log, each lit gold; the tenth stays tucked\./);
    assert.match(md, /Camera: the heron tall in the panel; our cat and Riffle low in the corner, on the logs \(`heron`\)\. Cast: Patience, a great blue heron \(taller than Tallyheart, blue-grey,[^\n]*?her head never turns\) \(standing on one leg, neck folded, happy, in the shallows, facing left\); Patience[^\n]*?\(one grey feather lifted \(for her, a grin\), happy,[^\n]*?\(neck up, a fish going down as a small bump,[^\n]*?; Wisp, a Mistscale dragonet \(slighter than Sprinkle and longer in the neck, so pale the reeds show through her, pale gold eyes; she stands on one leg; she never speaks\) \(standing still among the reeds, eyes shut: one more reed, but paler, and with a knee, happy, among the pale reeds, facing left\); Wisp[^\n]*?\(one jerk, among reeds that do not move,[^\n]*?\(a small bump going down her long neck,[^\n]*?; Riffle, the otter pup \(pointing straight down,[^;]*\); Riffle, the otter pup \(falling over backwards,[^;]*\); you \(peering, happy, at the top of Riffle’s pole, facing left\); a Clan cat \(sitting, happy, on the log across the water, facing left, coat 3\)\./);
    assert.match(md, /Also: a line of tiny prints across the mud, beside one great heron print; four strings of fish on the logs, five on every string \(each string a reed looped round the tails; eyes shut, no hook, no blood\); a thought cloud over the heron, with one pair of small silver fish in it \(what she is owed\); Riffle’s pole planted in the mud beside the raft, holding it still; the dragonfly on our cat’s nose; frogs sitting on the lily pads; one reed is paler than the others, and it has knees; a blue-grey snout poking up between the raft’s logs; her drawing in the mud: seven little herons, each standing on one leg; a patch of the mud beside the raft is what she taps\./);
    assert.match(md, /the grizzled old tom \(walking, happy, behind the back row, having walked round the pile, facing left, a snail on one ear, its horns pulled in\)\. Also: four rows of ten, running back under the brambles; the back row has four empty places side by side, right in its middle \(three pieces, the gap, three pieces\); tiny prints in the dug earth, each half the size of a cat’s; the dug earth swept flat by a tail: the prints are gone\./);
    assert.match(md, /Camera: close on the edge of the rocks and the raft’s first log, from her own eyes: her four paws \(`board`\)\. Cast: Riffle, the otter pup \(hopping on the spot,[^;]*\); Riffle, the otter pup \(whistling, eyes fixed on the sky,[^;]*\); Riffle, the otter pup \(groaning, eyes rolled up,[^\n]*Also: a tuft of thin brown fur caught in the raft’s vine; late gold light, for the way home\./);
    assert.match(md, /Sprinkle, a Mistscale dragonet[^;]*\(looking down at her own enormous feet, happy, in Sprinkle’s spot at the very back, facing left\)\. Also: seven little forepaws drawn in the mud, five claw marks each\./);
    assert.match(md, /Den: the apprentices’ den under an enormous rosebush, at dusk\.[^\n]*Also: a crescent moon, a little fatter than last night’s\./);
    // the cast extras chapter 5 adds
    assert.match(md, /you \(sitting, happy, [^)]*, buzzing all over: short zigzags along the outline \(shaking, with nothing blowing\), a dragonfly on the nose\)/);
    assert.match(md, /Patience, a great blue heron[^\n]*?, a dragonfly asleep on her bill\)/);
    assert.match(md, /Riffle, the otter pup \(hopping on the spot, happy, [^)]*, glowing softly: the one she taps\)/);
    assert.match(md, /the grizzled old tom \(sitting, happy, [^)]*, eyes shut: asleep sitting up, a snail halfway up one ear, the nose is what she taps\)/);
    assert.match(md, /Riffle, the otter pup \([^)]*, hugging the raft’s pole, twice his size, the pole, where the paws hold it, is what she taps\)/);
    assert.match(md, /you \(sitting up[^)]*, one claw curled back in: nine out, one tucked\)/);
    assert.doesNotMatch(md, /\[object Object\]|undefined/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('its words for chapter 6’s art and keys: the wall’s far end, the dream, Coil’s wall and his gap, the last post’s grass, the pile’s moon; Coil, Sloshbank, ReedClan by coat and Sleet in their own poses; the new holds and taps; the starry cat; the roll call; a set’s own cast; the tree’s questions; patrols of three; Sleet’s page', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx11.js');
    const c = (who, pose, at, extra) => Object.assign({ who, pose, mood: 'happy', at, facing: 'left' }, extra || {});
    const r = n => ({ who: 'reedclan', variant: n });
    const story = { id: 'fx11', number: 11, title: 'Words', start: 'a', names: { coil: 'The snake', sleet: 'The silver-white dragon' }, frames: {
      a: { scene: { set: 'title', cam: 'end', opts: { rustle: true }, cast: [c('player', 'walk', 'end-1', { facing: 'right' }), c('tallyheart', 'sit', 'end-2'), c('murmurchime', 'sit', 'end-3')], fx: ['day'] }, caption: ['The reeds rustle.'], next: 'b' },
      b: { scene: { set: 'title', cam: 'meet', cast: [c('player', 'sit', 'end-1'), c('sloshbank', 'stand', 'reed-1', { mood: 'stern' }), c('reedclan', 'sit', 'reed-2', { variant: 2 }), c('reedclan', 'sit', 'reed-3', { variant: 1 })], fx: ['day'] },
        say: [{ who: 'sloshbank', text: 'CrystalClan.' }, { who: 'reedclan', text: 'Except at night.' }], next: 'c' },
      c: { scene: { set: 'title', cam: 'wide', cast: [c('player', 'walk', 'wall-3', { facing: 'right' }), c('tallyheart', 'walk', 'wall', { facing: 'right' }), c('murmurchime', 'walk', 'wall-2', { facing: 'right' })], fx: ['day'] }, caption: ['Along the wall.'], next: 'd' },
      d: { scene: { set: 'bridge', cam: 'back', opts: { prints: true, stones: true }, cast: [c('coil', 'stone', 'gap', { tap: 'stone' }), c('player', 'sit', 'back-left'), c('sprinkle', 'sit', 'dragon')] },
        say: [{ who: 'coil', name: 'A voice', text: 'Hello.' }], scratch: { tap: 'stone', prompt: '**Tap** the stones to find the voice.', label: 'Find the voice.', miss: 'drip…', next: 'e' } },
      e: { scene: { set: 'bridge', cam: 'wall', opts: { train: true }, cast: [c('coil', 'head', 'gap'), c('coil', 'long', 'gap'), c('coil', 'longer', 'gap'), c('coil', 'still', 'gap'), c('coil', 'listen', 'gap'), c('coil', 'think', 'gap'), c('coil', 'slide', 'gap', { tap: 'eyes' }), c('coil', 'still', 'gap', { mood: 'sniff' }), c('sprinkle', 'sit', 'dragon', { mood: 'sniff' }),
        c('player', 'pawup', 'back-left', { tap: 'paw' }), c('riffle', 'puff', 'back-right', { tap: 'cheeks' }), c('riffle', 'stand', 'back-right', { holds: 'pebbles', tap: 'pebbles' }), c('riffle', 'sit', 'back-right', { holds: 'pebbles', holdAt: 'paws' }), c('riffle', 'walk', 'back-right', { holds: 'string' }), c('player', 'sit', 'back-left', { tap: 'ears' })] },
        say: [{ who: 'coil', text: 'How… do… you… do.' }, { who: 'coil', name: 'Coil', text: 'Quiet, please.' }], next: 'f' },
      f: { scene: { set: 'field', cam: 'border', cast: [c('sleet', 'hidden', 'grass'), c('sleet', 'tail', 'grass'), c('sleet', 'flat', 'grass'), c('sleet', 'point', 'grass'), c('sleet', 'call', 'grass'), c('sleet', 'puff', 'grass'), c('sleet', 'droop', 'grass'), c('sleet', 'sit', 'grass', { grass: true }), c('sleet', 'pawup', 'grass')] },
        say: [{ who: 'sleet', name: 'The long grass', text: 'PSST!' }, { who: 'sleet', text: 'Riddle first.' }], next: 'g' },
      g: { scene: { set: 'sky', cam: 'walk', cast: [c('player', 'walk', 'star-1', { facing: 'right' }), c('clancat', 'sit', 'star-2', { starry: true, mood: 'kind' })], fx: ['night', 'stars'] }, say: [{ who: 'clancat', name: 'The starry cat', text: 'Count what’s missing, little one.' }], next: 'h' },
      h: { scene: { set: 'sky', cam: 'below', cast: [] }, caption: ['Far below.'], next: 'i' },
      i: { scene: { set: 'pile', cam: 'wide', opts: { rows: [10, 10, 10, 10], moon: 6 }, cast: [c('grizzled', 'lie', 'pile-left', { holds: 'pinecone', holdAt: 'chin', asleep: true, tap: 'pinecone' }), c('grizzled', 'sit', 'pile-right', { holds: 'pinecone', holdAt: 'paws' }),
        c('grizzled', 'walk', 'crowd-1', { holds: 'pinecone', holdAt: 'mouth' }), c('grizzled', 'sit', 'crowd-2', { holds: 'pinecone' }), c('riffle', 'puff', 'crowd-3'), c('riffle', 'slide', 'crowd-3'), c('puddle', 'head', 'crowd-3')], fx: ['night'] }, caption: ['The moon comes out, a little fatter.'], next: 'j' },
      j: { scene: { set: 'hollow', cam: 'lesson', opts: { marks: 5, glow: 'auto' }, cast: [c('tallyheart', 'sit', 'sand-left'), c('player', 'sit', 'sand-right')] },
        ask: { who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.', pairs: [['Tails?', 'Three cats, three tails!'], ['Ears?', 'Three cats, six ears!']], next: 'k' } },
      k: { scene: { set: 'hollow', cam: 'wide', cast: [c('tallyheart', 'sit', 'tree-far')] }, skip: { table: 3, groups: 5, teacher: 'tallyheart', thing: 'cat', things: 'cats', label: 'Count the next patrol.', prompt: '**Tap** the patrols.', next: 'l' } },
      l: { scene: { set: 'title', cam: 'meet', cast: [c('player', 'sit', 'end-1'), c('sloshbank', 'stand', 'reed-1')] }, counts: { set: 'fx11-watchers', next: 'm' } },
      m: { scene: { set: 'field', cam: 'border-two', cast: [c('sleet', 'call', 'grass')] }, counts: { set: 'fx11-sleet', next: 'n' } },
      n: { scene: { set: 'field', cam: 'border-fox', cast: [c('sleet', 'pawup', 'grass')] }, skip: { table: 5, groups: 1, who: [{ who: 'sleet' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: 'z' }, sets: { foundSleet: true } },
      z: { scene: { set: 'den', cam: 'nest', opts: { hidden: true } }, caption: ['The end.'], end: true }
    }, counts: {
      'fx11-watchers': { table: 3, thing: 'cat', things: 'cats', unit: 'patrol', units: 'patrols', teacher: 'tallyheart', ask: '{a} × {b}', who: [r(3), r(1), r(4), r(2), r(3), r(1), r(4), r(2), r(3)],
        fillFrom: 'fx11-threes', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower',
        facts: [{ a: 3, b: 3, prompt: [{ kind: 'caption', text: 'How many ReedClan cats watched you?' }], retryPrompt: true, right: [{ who: 'player', text: 'NINE? I only saw three!' }, { who: 'sloshbank', text: 'That is the point of reeds.' }], rightAgain: true }],
        ground: 'earth', praise: [], done: null },
      'fx11-sleet': { table: 3, thing: 'HERE', things: 'HEREs', unit: 'dragonet', units: 'dragonets', teacher: 'sleet', ask: '{a} × {b}', picture: { kind: 'roll' },
        facts: [{ a: 7, b: 3, prompt: [{ kind: 'caption', text: 'How many times does Mama hear HERE?' }], retryPrompt: 'Seven of us, three HEREs each. How many HEREs?', right: [{ who: 'sleet', text: 'TWENTY-ONE! You pass.' }], rightAgain: true }],
        help: 'picture', helpCounter: 'you', againIntro: 'My roll call AGAIN!', fillIntro: 'A smaller roll call!', praise: [], done: null }
    }, book: { recap: [{ text: 'Sleet.' }], dragonet: [{ id: 'sleet', name: 'Sleet', when: { foundSleet: true }, pose: 'puff', lines: ['Silver-white, the eldest.'] }] } };
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx11 = ' + JSON.stringify(story) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    // the wall's far end: its own place words, its two cameras, the anchors on both sides, the rustle
    assert.match(md, /\*\*Scene\.\*\* Title: the old stone wall’s far end above the river, where its stones stop and tall reeds begin: the border with ReedClan, by day \(the river behind and below\)\. Camera: wide: the end of the wall at the left, where its stones stop, the tall reeds at the right \(`end`\)\. Cast: you \(walking, happy, at the wall’s end, nearest the line where the stones stop, facing right\); Tallyheart \(sitting, happy, at the wall’s end, second from the line, facing left\); Murmurchime, the tortoiseshell warrior \(sitting, happy, at the wall’s end, furthest from the line, facing left\)\. Also: rustle lines in the reeds; nobody seen\./);
    assert.match(md, /Camera: at cat height: three cats each side, face to face across the line where the stones stop \(`meet`\)\. Cast: you \(sitting, happy, at the wall’s end, nearest the line where the stones stop, facing left\); Sloshbank, the ReedClan tom \(big, heavy and stern[^)]*\) \(standing, stern, stepping out of the reeds, nearest the line, facing left\); the young ReedClan tom \(lanky and sandy, big ears, eager; mud to the elbows\) \(sitting, happy, stepping out of the reeds, second from the line, facing left\); the ReedClan she-cat \(sleek, dark grey-brown, a pale belly, calm amber eyes; mud to the elbows\) \(sitting, happy, stepping out of the reeds, furthest from the line, facing left\)\./);
    assert.doesNotMatch(md, /Camera: two cats, medium \(`meet`\)/, 'the wall’s `meet` is its own, not the garden’s');
    assert.match(md, /- \*\*Sloshbank\*\*: “CrystalClan\.”\n- \*\*Young ReedClan tom\*\*: “Except at night\.”/);
    assert.match(md, /Title: the river, glass towers, a bridge, by day \(one cat on a wall\)\. Camera: wide shot \(`wide`\)\. Cast: you \(walking, happy, on the wall, right, at the front, facing right\); Tallyheart \(walking, happy, on the wall, facing right\); Murmurchime[^;]*\(walking, happy, on the wall, left, facing right\)\./);
    // Coil: the stones on the back of the bridge, his gap, his wall as a picture of its own, all eight poses in his own words
    assert.match(md, /Camera: the very back of the dark \(`back`\)\. Cast: Coil, a northern water snake \(brown with darker cross-bands[^)]*never shut; his mouth always shut: no tongue, no fangs; his body runs sideways along the wall’s foot, away from the cats\) \(only his head, turned into the gap so its top reads as one more rounded stone of the wall; no eyes showing, happy, at the dark gap low in the stone wall, facing left, the head, turned into the gap like one more stone of the wall, is what she taps\);[^\n]*Also: Sprinkle’s big five-claw prints in the mud beside the drag marks; the bridge’s stone leg beside Sprinkle’s nook: a wall of big old fitted stones, its foot on the dry floor, with one dark gap low in it\./);
    assert.match(md, /- \*\*A voice \(Coil\)\*\*: “Hello\.”/);
    assert.match(md, /\*\*Then she taps the stones in the wall \(one of them is the snake’s head\)\*\* \(one tap, on this scene\)[^\n]*“drip…”/);
    assert.match(md, /\*\*Scene\.\*\* Bridge: the Old Bridge’s stone leg, under the bridge beside Sprinkle’s nook, by day \(a wall of big old fitted stones, its foot on the dry floor, one dark gap low in it\)\. Camera: at cat height, close on the stone leg across the middle distance: its dark gap low in it, about a quarter to a third of the way across, the dry floor in front \(`wall`\)\./);
    for (const w of ['his head out of the gap, tilted politely: two round eyes, shiny as wet pebbles, mouth shut', 'his head out and a first loop of body along the wall’s foot', 'loops and loops of him along the wall’s foot, in and out of the stones’ shadow',
      'lying along the wall, head raised a little: talking', 'chin flat on the floor: feeling footsteps', 'head tilted up, eyes open, thinking', 'sliding back into the gap, the tail end last']) assert.ok(md.includes('Coil, a northern water snake') && md.includes('(' + w + ', happy, at the dark gap low in the stone wall'), w);
    assert.ok(md.includes('(lying along the wall, head raised a little: talking, an offended lift of the chin, at the dark gap low in the stone wall, facing left)'), 'Coil’s sniff is his own');
    assert.match(md, /Sprinkle, a Mistscale dragonet[^;]*\(sitting, sniffing, in Sprinkle’s spot at the very back/, 'everyone else’s sniff as before');
    assert.match(md, /- \*\*The snake \(Coil\)\*\*: “How… do… you… do\.”\n- \*\*Coil \(Coil\)\*\*: “Quiet, please\.”/);
    // the global head is Puddle's, slide Riffle's, puff Riffle's cheeks: each keeps its own words
    assert.match(md, /Riffle, the otter pup \(cheeks puffed round, holding his breath, eyes wide, happy, in the crowd, facing left\); Riffle, the otter pup \(belly-sliding, happy, in the crowd, facing left\); Puddle, a Mistscale dragonet[^;]*\(his head out of the water, a small bump on it, happy, in the crowd, facing left\)/);
    assert.match(md, /\(sliding back into the gap, the tail end last, happy, at the dark gap low in the stone wall, facing left, the two round open eyes are what she taps\)/);
    // the new holds and taps
    assert.match(md, /you \(one forepaw raised, happy, at the back, left, facing left, the raised forepaw is what she taps\); Riffle, the otter pup \(cheeks puffed round, holding his breath, eyes wide, happy, at the back, right, facing left, the puffed-up cheeks are what she taps\); Riffle, the otter pup \(standing up on his hind legs, happy, at the back, right, facing left, three plain round brown pebbles held in the forepaws, the pebbles are what she taps\); Riffle, the otter pup \(sitting, happy, at the back, right, facing left, three plain round brown pebbles set down neatly on the ground in front of the feet\); Riffle, the otter pup \(walking, happy, at the back, right, facing left, a reed string of three fish hanging from one forepaw \(eyes shut, nothing through a fish\)\); you \(sitting, happy, at the back, left, facing left, the ears are what she taps\)\. Also: an Ironsnake \(a train\) crossing on top\./);
    assert.match(md, /the grizzled old tom \(lying down, happy, left of the pile, facing left, eyes shut: asleep, a big pinecone under the chin, the pinecone is what she taps\); the grizzled old tom \(sitting, happy, right of the pile, facing left, a big pinecone at the front paws\); the grizzled old tom \(walking, happy, in the crowd, facing left, carrying a big pinecone in the mouth\); the grizzled old tom \(sitting, happy, in the crowd, facing left, holding a big pinecone\)/);
    // the pile's moon is a number, in the words that were there for the den's
    assert.match(md, /Pile: [^\n]*at night[^\n]*Also: four rows of ten, running back under the brambles; a crescent moon, a little fatter than last night’s\./);
    // Sleet at the last post, in all nine poses, in his own words; his tuft; his labels
    assert.match(md, /Camera: wide, both sides of the fence’s last post: the path in front, the long golden grass beyond \(`border`\)\. Cast: Sleet, the eldest dragonet \(a Mistscale about Sprinkle’s size, silver-white[^)]*never toothy\) \(in the long grass: nothing of him showing but the grass bent where he is, happy, low in the long grass just past the last post, close enough to talk across it, facing left\)/);
    for (const w of ['only the tip of a scaly silver-white tail, flicking up out of the grass', 'flat on his belly in the grass, chin down: spying', 'one claw pointing', 'head up, his mouth a round O: the roll call', 'his chest puffed out, a grass seed falling off it',
      'head low, his tail drooping', 'sitting up, all of him, happy, low in the long grass just past the last post, close enough to talk across it, facing left, a tuft of long grass on the head, between the horn nubs', 'one forepaw raised, five frost-white claws out']) assert.ok(md.includes('(' + w), w);
    assert.match(md, /- \*\*The long grass \(Sleet\)\*\*: “PSST!”\n- \*\*The silver-white dragon \(Sleet\)\*\*: “Riddle first\.”/);
    // the dream: its own place words, its cameras and anchors, the starry cat
    assert.match(md, /\*\*Scene\.\*\* Sky: the dream: the Sky River, at night \(a broad soft path of stars underfoot, dark blue all round, the city’s lights tiny far below\)\. Camera: on the Sky River: our cat walking on the stars, the starry cat sitting further along \(`walk`\)\. Cast: you \(walking, happy, on the Sky River, facing right\); a Clan cat \(sitting, kind, further along the Sky River, facing left, drawn in starlight: pale blue-white, a little see-through, small stars inside the outline, a soft glow at the edge, a kind face\)\. Effects: night, stars\./);
    assert.match(md, /- \*\*The starry cat \(A Clan cat\)\*\*: “Count what’s missing, little one\.”/);
    assert.match(md, /Camera: looking down past the Sky River’s edge: the glass towers far below, the tallest with its red light, and one balcony nineteen floors up with a wind chime catching the starlight; nobody on it \(`below`\)\. No one in shot\./);
    // the tree's questions: Tallyheart asks, the answer is hers, and the hollow shows nothing owed
    assert.match(md, /\*\*Then she taps Tallyheart, once for each question\*\* \(two taps, on this scene, counting nothing\): Tallyheart glows softly; a tap on her letters her next question in her balloon and your own answer in your balloon, and the scene stays as it is; the pairs before stay under the panel, small, to read back\. A tap anywhere else makes her hop\./);
    assert.match(md, /1\. \*\*Tallyheart\*\*: “Tails\?” \*\*You\*\*: “Three cats, three tails!”/);
    assert.doesNotMatch(md, /thought cloud over the heron/);
    // patrols of three, the watchers in ReedClan coats, the roll call, Sleet's forepaw
    assert.match(md, /\*\*Then she counts by 3s\*\* \(the skip-count\): 5 taps, one on each patrol in turn \(the next one glows; a tap anywhere else makes it wiggle\), each lighting its three cats and adding its running total: 3, 6, 9, 12, 15\./);
    assert.match(md, /\*\*Then the Counts lesson\*\* `fx11-watchers` \(cats\): 3 × 3 \(its own question, kept on its retry; its own lines after a right answer; its own lines after a right retry\)\. Its picture has its own cast in the places, left to right: a ReedClan cat \(coat 3\), a ReedClan cat \(coat 1\), a ReedClan cat \(coat 4\), a ReedClan cat \(coat 2\), a ReedClan cat \(coat 3\), a ReedClan cat \(coat 1\), a ReedClan cat \(coat 4\), a ReedClan cat \(coat 2\), a ReedClan cat \(coat 3\), the questions it lends included\. She types/);
    assert.match(md, /  - \*\*Sloshbank\*\*: “That is the point of reeds\.”/);
    assert.match(md, /\*\*Then the Counts lesson\*\* `fx11-sleet` \(HEREs, little dragonets in a row, all alike and pale, three HERE!s lettered over every head\): 7 × 3 [^\n]*a miss gets the set’s own picture lit a group at a time, the player keeping the count,/);
    assert.match(md, /  - \*\*Sleet\*\*: “My roll call AGAIN! Seven of us, three HEREs each\. How many HEREs\?”/);
    assert.match(md, /\*\*Then she taps the forepaw Sleet holds up\*\* \(one tap; the forepaw glows, and a tap anywhere else makes it wiggle\): its five claws light and a big 5 grows over them\.[^\n]*which does not show the number\./);
    assert.match(md, /\*\*Set for good:\*\* `foundSleet: true`/);
    // the den's hidden words: chapter 4's until chapter 7 made them count-free (its spec, section 6)
    assert.match(md, /Also: her secret cards under the moss, a corner showing for each\./);
    assert.doesNotMatch(md, /two corners showing/);
    // Sleet's page, in his own puff
    assert.match(md, /\*\*A dragonet page:\*\* Sleet \(`sleet`\), found in this chapter by a reader whose foundSleet is true \(the page is there only then\)\. Her book gains a page for Sleet \(drawn his chest puffed out, a grass seed falling off it\)/);
    assert.doesNotMatch(md, /\[object Object\]|undefined|Set: |Camera: (end|meet|walk|below|wall) |\bat (end-\d|reed-\d|star-\d|gap|grass|wall-3)\b/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('its words for chapter 7’s art and keys: round the back of the pile (`rear`, `hole`, the guards, the arch, the tracks), the tunnel and the roots, her paw over Sprinkle’s print, the comparison, the taps on the back row, the roots, the print, the fish and the mist; the cheeks (a `who` pair as one face), the nights of marks, the empty places, the whiskers on one cheek and the cheek kept, the sand at the 6s, a set’s own question; FLEW’s link read as an or, and every other `not` as it was', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx12.js');
    const c = (who, pose, at, extra) => Object.assign({ who, pose, mood: 'happy', at, facing: 'left' }, extra || {});
    const RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
    const ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }], FULL = [10, 10, 10, 10];
    const story = { id: 'fx12', number: 12, title: 'Words', start: 'a', frames: {
      a: { scene: { set: 'pile', cam: 'rows', opts: { rows: ROWS, back: 'shadow', scale: 'behind', tap: 'back' }, cast: [c('clancat', 'sit', 'pile-left', { variant: 3 })], fx: ['morning'] },
        caption: ['The back row is still in the shadow.'], scratch: { tap: 'back', prompt: '**Tap** to walk round the back.', label: 'Walk round the back.', next: 'b' } },
      b: { scene: { set: 'pile', cam: 'gap', opts: { rows: ROWS, scale: 'behind', dug: 'big' }, cast: [], fx: ['morning'] }, caption: ['Right in the middle of the back row: empty spaces.'],
        skip: { table: 1, groups: 4, thing: 'gap', things: 'gaps', teacher: 'player', label: 'Count the next empty space.', prompt: '**Tap** the empty spaces.', carry: false, next: 'c' } },
      c: { scene: { set: 'hollow', cam: 'lesson', cast: [c('tallyheart', 'sit', 'sand-left'), c('player', 'sit', 'sand-right')] }, caption: ['Up close, you can count her whiskers.'],
        skip: { table: 3, groups: 2, who: [{ who: 'tallyheart' }], thing: 'whisker', things: 'whiskers', teacher: 'player', label: 'Count the next row of whiskers.', prompt: '**Tap** her whiskers.', keep: true, next: 'd' } },
      d: { scene: { set: 'hollow', cam: 'lesson', cast: [c('tallyheart', 'sit', 'sand-left'), c('player', 'sit', 'sand-right')] }, say: [{ who: 'tallyheart', text: 'Six whiskers on one cheek.' }], next: 'e' },
      e: { scene: { set: 'hollow', cam: 'wide', opts: { marks: 6, glow: 'auto' }, cast: [c('tallyheart', 'sit', 'tree-far')] }, say: [{ who: 'tallyheart', text: 'Touch each cheek.' }],
        skip: { table: 6, groups: 5, who: RIM, thing: 'whisker', things: 'whiskers', teacher: 'tallyheart', label: 'Count the next cheek.', prompt: '**Tap** the cheeks.', carry: false, next: 'f' } },
      f: { scene: { set: 'hollow', cam: 'lesson', opts: { marks: 7, glow: 'auto', compare: [24, 60] }, cast: [c('tallyheart', 'sit', 'sand-left', { wink: true }), c('player', 'sit', 'sand-right')] },
        counts: { set: 'fx12-sixes', next: 'g', intro: false } },
      g: { scene: { set: 'bridge', cam: 'under', opts: { prints: true, tap: 'print', compare: [24, 60] }, cast: [c('player', 'sit', 'mud'), c('riffle', 'stand', 'inside', { holds: 'string', tap: 'fish' }), c('sprinkle', 'burp', 'dragon', { mist: true, tap: 'mist' })] },
        caption: ['Her prints are still in the mud.'], scratch: { tap: 'print', prompt: '**Tap** a print to hold your paw over it.', label: 'Hold your paw over a print.', next: 'h' } },
      h: { scene: { set: 'bridge', cam: 'print', cast: [c('player', 'crouch', 'over', { reach: true })] }, caption: ['Room to spare.'], card: 'flew', next: 'i' },
      i: { scene: { set: 'bridge', cam: 'under', opts: { prints: true }, cast: [c('riffle', 'stand', 'mud', { holds: 'string', tap: 'fish' })] }, say: [{ who: 'riffle', text: 'FISH!' }], scratch: { tap: 'fish', prompt: '**Tap** to toss her one.', label: 'Toss her a fish.', next: 'j' } },
      j: { scene: { set: 'bridge', cam: 'under', opts: { prints: true }, cast: [c('sprinkle', 'burp', 'inside', { mist: true, tap: 'mist' })] }, sfx: 'HURP.', scratch: { tap: 'mist', prompt: '**Tap** the little cloud of mist.', label: 'Puff the mist away.', next: 'k' } },
      k: { scene: { set: 'bridge', cam: 'under', opts: { prints: true }, cast: [c('riffle', 'hush', 'mud')] }, counts: { set: 'fx12-riffle', next: 'l' } },
      l: { scene: { set: 'pile', cam: 'rear', opts: { rows: FULL, scale: 'behind', dug: 'big', tunnel: false, tap: 'roots' }, cast: [c('player', 'sit', 'rear-1', { facing: 'right' }), c('tallyheart', 'sit', 'rear-2'), c('clancat', 'sit', 'guard-1', { variant: 1 }), c('clancat', 'sit', 'guard-2', { variant: 3 }), c('clancat', 'sit', 'guard-3', { variant: 5 })], fx: ['dusk'] },
        caption: ['The bramble roots hang low.'], scratch: { tap: 'roots', prompt: '**Tap** the bramble roots.', label: 'Lift the roots.', next: 'm' } },
      m: { scene: { set: 'pile', cam: 'hole', opts: { rows: FULL, scale: 'behind', dug: 'big' }, cast: [c('player', 'crouch', 'brink', { mood: 'wonder' })], fx: ['dusk'] }, caption: ['A tunnel.'], next: 'n' },
      n: { scene: { set: 'pile', cam: 'rear', opts: { rows: FULL, scale: 'behind', dug: 'big', tunnel: true }, cast: [c('player', 'sit', 'rear-1')], fx: ['dusk'] }, caption: ['The roots lifted.'], next: 'o' },
      o: { scene: { set: 'pile', cam: 'wide', opts: { rows: FULL, dug: 'big', tracks: true, moon: 7 }, cast: [c('player', 'stand', 'arch')], fx: ['dusk'] }, caption: ['From the top of the arch.'],
        when: { not: { foundPuddle: false, foundWisp: false } }, next: 'p' },
      p: { scene: { set: 'hollow', cam: 'lesson', cast: [c('tallyheart', 'sit', 'sand-left'), c('player', 'sit', 'sand-right')] }, counts: { set: 'fx12-gone', next: 'q' } },
      q: { scene: { set: 'den', cam: 'nest', opts: { bark: 'auto', hidden: true }, cast: [c('snorer', 'sit', 'sleeper-1'), c('player', 'sit', 'nest')], fx: ['night'] }, caption: ['He puffs out his cheeks. You puff out yours.'],
        skip: { table: 6, groups: 4, who: [{ who: 'snorer' }, { who: 'snorer' }, { who: 'player' }, { who: 'player' }], thing: 'whisker', things: 'whiskers', teacher: 'player', label: 'Count the next cheek.', prompt: '**Tap** the cheeks.', next: 'r' } },
      r: { scene: { set: 'den', cam: 'nest', cast: [c('snorer', 'sit', 'sleeper-1')], fx: ['night'] }, say: [{ who: 'snorer', text: 'TWENTY-FOUR?' }], next: 'z' },
      z: { scene: { set: 'den', cam: 'nest', opts: { hidden: true } }, caption: ['The end.'], end: true }
    }, cards: {
      flew: { mark: 'ear', line: 'The fox says it FLEW.', answers: ['wing'], link: { when: { not: { ch4CaughtFly: false, ch7Flew: false } }, line: 'They can’t both be true.' } },
      wing: { mark: 'eye', line: 'Sprinkle can’t fly.' }
    }, counts: {
      'fx12-sixes': { table: 6, thing: 'whisker', things: 'whiskers', unit: 'cheek', units: 'cheeks', teacher: 'tallyheart', ask: '{a} × {b}', picture: { kind: 'cheeks' }, label: 'Whiskers', hollowThings: 'sixes', prompt: 'How many whiskers?',
        facts: [{ a: 2, b: 6, who: [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }], prompt: 'Two cheeks? That’s one whole cat.', retryPrompt: true },
          { a: 6, b: 4, picture: { kind: 'cheeks-top' }, prompt: 'Four cheeks. Four threes on top.', retryPrompt: true }, { a: 5, b: 6 }],
        praise: ['Two threes make a six!'], helpIntro: 'Close. Let’s hop it together.', done: 'That’s the sixes.' },
      'fx12-gone': { table: 6, thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', teacher: 'tallyheart', ask: '{a} × {b}', picture: { kind: 'marks' },
        facts: [{ a: 4, b: 6, table: 4, prompt: [{ kind: 'caption', text: 'Four gone a night, for six nights. How many gone?' }], retryPrompt: true }],
        help: 'picture', fillFrom: 'fx12-sixes', fillOrder: 'easiest', fillVoice: 'borrower', fillIntro: 'An easy one.', avoid: [[6, 6]], praise: [], done: null },
      'fx12-riffle': { table: 10, thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', teacher: 'riffle', ask: '{a} × {b}', picture: { kind: 'marks', ground: 'mud' },
        facts: [{ a: 10, b: 6, prompt: [{ who: 'riffle', kind: 'whisper', text: 'Six nights. How many would she take?' }], retryPrompt: true }],
        help: 'picture', helpIntro: 'Hop by tens! Ten, twenty…', praise: [], done: null }
    }, book: { recap: [{ text: 'Seven.' }] } };
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx12 = ' + JSON.stringify(story) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    // the walk round the back: the back row is what she taps, and the empty places one at a time
    assert.match(md, /the back row is a dark band in the brambles’ shadow: no gap, no dug earth and no “scale” can be made out; the “scale” where it was found, on the bare earth behind the back row: a small glint under the brambles; the back row is what she taps\./);
    assert.match(md, /\*\*Then she taps the back row of the pile\*\* \(one tap, on this scene\): it glows softly; a tap on it turns the page to b;/);
    assert.match(md, /\*\*Then she counts the empty places\*\* \(the skip-count, by 1s\): the back row close up on the earth, its four empty pressed places among the pieces \(in play they take the panel\); 4 taps, one on each empty place in turn \(the next one glows; a tap anywhere else makes it wiggle\), each outlining it in gold and putting the next number under it and in her own balloon: 1, 2, 3, 4\. Nothing can be got wrong, and nothing is logged\. The last tap turns the page to c, which does not show the number\. The instruction under the panel: “Tap the empty spaces\.” For VoiceOver, a hidden button: “Count the next empty space\.”/);
    // one cheek's whiskers at the 3s, kept on the page after it, and not on the skip that ends the run
    assert.match(md, /\*\*Then she counts the whiskers on one cheek\*\* \(the skip-count, by 3s\): one cheek close up, Tallyheart’s, six whiskers in two rows of three \(in play it takes the panel\); 2 taps, a row at a time from the top[^\n]*each lighting its three whiskers and putting the running total beside it and in her own balloon: 3, 6\.[^\n]*The last tap turns the page to d, which shows the 6\. The cheek stays on the plain pages after it, both rows lit, 3 and 6 beside them\./);
    assert.match(md, /### d · panel 4[^#]*\*\*The cheek stays:\*\* in place of this scene, the cheek from c, both rows of whiskers lit, 3 and 6 beside them; the balloons sit beside it\./);
    assert.doesNotMatch(md.split('### e ·')[1].split('### f ·')[0], /stays:/, 'a skip-count draws its own picture: the kept cheek is not on it');
    // the cheeks at the 6s: the rim's five, one each; at bedtime two faces, puffed round
    assert.match(md, /\*\*Then she counts by 6s on the cheeks\*\* \(the skip-count\): five cheeks close up in a row, six whiskers on each, three on top and three below \(left to right: a cheek of a Clan cat \(coat 1\); a cheek of Murmurchime, the tortoiseshell warrior; a cheek of a Clan cat \(coat 3\); a cheek of a Clan cat \(coat 5\); a cheek of the grizzled old tom\); 5 taps, one on each cheek in turn[^\n]*adding its running total under it and in Tallyheart’s balloon: 6, 12, 18, 24, 30\./);
    assert.match(md, /four cheeks close up in a row, six whiskers on each, three on top and three below \(left to right: the face of the snoring apprentice, its two cheeks puffed round; your face, its two cheeks puffed round\); 4 taps[^\n]*in her own balloon: 6, 12, 18, 24\. [^\n]*The last tap turns the page to r, which shows the 24\./);
    // the lesson: cheeks, the doubling question's top rows, one cat's face, the sand at the 6s, its own question words
    assert.match(md, /\*\*Then the Counts lesson\*\* `fx12-sixes` \(whiskers, cheeks close up, six whiskers on each: three on top, three below\): 2 × 6 \(drawn as the face of a Clan cat \(coat 1\), its two cheeks puffed round; its own question, kept on its retry\), 6 × 4 \(cheeks close up, six whiskers on each, every cheek’s top three lit from the start; its own question, kept on its retry\), 5 × 6\./);
    assert.match(md, /a miss gets the sand count \(six marks for every cheek, scratched three and three: two short rows of three, one above the other\)/);
    assert.match(md, /- Asking a question with no words of its own:\n  - \*\*Tallyheart\*\*: “How many whiskers\?”/);
    assert.match(md, /- In the Training Hollow: its button reads “Whiskers · the 6s”, and Tallyheart calls it “sixes”\./);
    // the nights of marks, in the sand and in the mud, lit a night at a time by whoever hops it
    assert.match(md, /`fx12-gone` \(pieces, nights side by side, scratched in the sand, a cluster of short upright marks for each night and nothing else\): 4 × 6 \(from the 4s; its own question, kept on its retry\)\. She types each answer on the keypad; a miss gets the set’s own picture lit a night at a time, Tallyheart hopping it,/);
    assert.match(md, /`fx12-riffle` \(pieces, nights side by side, scratched in the mud, a cluster of short upright marks for each night and nothing else\): 10 × 6 [^\n]*a miss gets the set’s own picture lit a night at a time, Riffle hopping it,/);
    // the comparison, in the sand and in the mud
    assert.match(md, /Also: 7 claw marks on the trunk; each claw mark glows if its Count glows in the Training Hollow; two straight lines scratched in the sand between them, the long one two and a half times as long as the short one: “24” by the short line and “60” by the long one\./);
    assert.match(md, /Also: Sprinkle’s big five-claw prints in the mud beside the drag marks; the nearest of Sprinkle’s big prints is what she taps; two straight lines scratched in the open mud at the front, the long one two and a half times as long as the short one: “24” by the short line and “60” by the long one\./);
    // the taps under the Old Bridge: the print, the fish, the mist
    assert.match(md, /Riffle, the otter pup \(standing up on his hind legs, happy, inside the dark, facing left, a reed string of three fish hanging from one forepaw \(eyes shut, nothing through a fish\), the string of fish is what she taps\); Sprinkle, a Mistscale dragonet[^;]*\(burping a little cloud of mist, happy, in Sprinkle’s spot at the very back, facing left, a little cloud of mist, the little cloud of mist is what she taps\)/);
    assert.match(md, /\*\*Then she taps the nearest of Sprinkle’s big prints\*\* \(one tap, on this scene\)/);
    assert.match(md, /\*\*Then she taps the reed string of fish in Riffle’s paw\*\* \(one tap, on this scene\)/);
    assert.match(md, /\*\*Then she taps Sprinkle’s little cloud of mist\*\* \(one tap, on this scene\)/);
    // her paw over the print: the camera, the anchor, and the reach the other way round from the marsh's
    assert.match(md, /Camera: at cat height, close on the mud: one of Sprinkle’s big prints in front \(five long claw marks, as big as a heron’s foot\), the drag marks’ edge at one side \(`print`\)\. Cast: you \(crouching, happy, crouched over the print, her near forepaw held just over its heel pad, facing left, one forepaw held out and down, touching nothing: just over the heel pad of one of Sprinkle’s big prints, the pad showing all round it and the five toes and long claws fanned out beyond, toward us, room to spare \(her paw about a fifth of its length\)\)\./);
    assert.doesNotMatch(md, /over a tiny print in the mud/, 'the marsh’s reach is the marsh’s');
    // round the back: its own place words, the roots tapped, the guards, then the mouth on `hole` and the tunnel uncovered
    assert.match(md, /\*\*Scene\.\*\* Pile: round the back of the prey pile, under the bramble arch, at dusk \(the low roots of the arch, the dug earth heaped behind the back row, the back row seen from behind, the camp past the pile’s front; no sky\)\. Camera: round the back, at cat height, from behind the back row: [^\n]*\(`rear`\)\. Cast: you \(sitting, happy, round the back, left of the roots over the tunnel’s mouth, facing right\); Tallyheart \(sitting, happy, round the back, right of the roots over the tunnel’s mouth, facing left\); a Clan cat \(sitting, happy, small, past the rows at the pile’s front: a guard settling in, looking out over the camp, facing left, coat 1\); a Clan cat \(sitting, happy, small, past the rows at the pile’s front: a second guard settling in, facing left, coat 3\); a Clan cat \(sitting, happy, small, past the rows at the pile’s front: a third guard settling in, facing left, coat 5\)\.[^\n]*the low bramble roots are what she taps\./);
    assert.match(md, /\*\*Then she taps the low bramble roots\*\* \(one tap, on this scene\)/);
    assert.match(md, /\*\*Scene\.\*\* Pile: the tunnel’s mouth, round the back of the prey pile, at dusk \(the dug earth, the bramble roots lifted over it, the back row’s backs along the top\)\. Camera: close on the tunnel’s mouth from behind, at cat height: a round dark hole in the dug earth under the lifted roots, going down and in under the pile, its far end dark; much too small for a dragon, about as wide as a small cat’s shoulders \(`hole`\)\. Cast: you \(crouching, full of wonder, crouched at the very edge of the tunnel’s mouth, facing left\)\./);
    assert.match(md, /the roots lifted back, and under them the round dark mouth of a small tunnel in the dug earth, going down and in under the pile\./);
    // the climber on the arch, the tracks far off, the seventh moon
    assert.match(md, /Cast: you \(standing, happy, standing on top of the bramble arch over the pile, as big as a cat by the back row, facing left\)\. Also: four rows of ten, running back under the brambles; a bigger patch of soft, lumpy, dug-up earth behind the pile; far off past the towers, low at the horizon, the train tracks catching the last light: two bright rails on a dark bed, the sleepers across it, running off behind the tallest tower; a crescent moon, a little fatter than last night’s\./);
    // the den's secret cards, count-free
    assert.match(md, /a piece of bark for each card she holds, overlapping like roof tiles; her secret cards under the moss, a corner showing for each\./);
    // FLEW's link reads either flag, as an or; any other `not` reads as it always has (chapter 5's "found today")
    assert.match(md, /\| `flew` \| ear \| The fox says it FLEW\. \| h \| answered by `wing` \(for chapter 10\); drawn touching them once ch4CaughtFly or ch7Flew is true: “They can’t both be true\.” \|/);
    assert.match(md, /\*\*Shows only if\*\* not \(foundPuddle is false or not set and foundWisp is false or not set\); otherwise the page turns straight on to p\./);
    assert.doesNotMatch(md, /\[object Object\]|undefined|Set: |Camera: (rear|hole|print) |\bat (rear-\d|guard-\d|brink|arch|over)\b|\b(tap|compare|tunnel|tracks): (true|false|"|\[)/, 'every new name has words: none prints as its bare id');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('its words for chapter 8’s art and keys: the bank by the tracks (every camera, its anchors, the tunnel’s inside and the stash in place words of their own, the weeds, the holes, the stash and the glass tapped, the tight place, the worm), the Barking Field at night (its moon, the heap, the log, the wire, the ring, the fence top, the trail, the path tapped), the pile’s poke and the tunnel’s mouth tapped, the den’s half moon and her glass; Hail, Snip and Snatch in their own poses and moods, the cats’ run, the dogs lying down, Reynard’s trot, the raised tail, the leaf, the glass, the mouse; a tap mark another carries; one cat’s paws a pair at a time and kept, cats’ paws by fours, the field’s four animals, nights of marks two and two, the sand at the 4s; a card link’s own line for each partner', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx13.js');
    const c = (who, pose, at, extra) => Object.assign({ who, pose, mood: 'happy', at, facing: 'left' }, extra || {});
    const RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
    const FIELD = [{ who: 'dog', variant: 1 }, { who: 'dog', variant: 2 }, { who: 'dog', variant: 3 }, { who: 'hail' }];
    const FULL = [10, 10, 10, 10], T = text => ({ who: 'tallyheart', text });
    const story = { id: 'fx13', number: 13, title: 'Words', start: 'a', names: { snip: 'A weasel', snatch: 'A weasel', hail: 'The speckled dragonet' }, frames: {
      a: { scene: { set: 'hollow', cam: 'lesson', cast: [c('tallyheart', 'stand', 'sand-left'), c('player', 'sit', 'sand-right')], fx: ['morning'] }, say: [T('Count mine.')],
        skip: { table: 2, groups: 2, who: [{ who: 'tallyheart' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next pair of paws.', prompt: '**Tap** her paws.', keep: true, next: 'b' } },
      b: { scene: { set: 'hollow', cam: 'lesson', cast: [c('tallyheart', 'stand', 'sand-left'), c('player', 'sit', 'sand-right')] }, say: [T('A four is two twos.')], next: 'c' },
      c: { scene: { set: 'hollow', cam: 'wide', opts: { marks: 7, glow: 'auto' }, cast: [c('tallyheart', 'sit', 'tree-far')] }, say: [T('Hop by fours.')],
        skip: { table: 4, groups: 5, who: RIM, thing: 'paw', things: 'paws', teacher: 'tallyheart', label: 'Count the next cat’s paws.', prompt: '**Tap** the cats as they go by.', carry: false, next: 'd' } },
      d: { scene: { set: 'hollow', cam: 'lesson', opts: { marks: 7, glow: 'auto' }, cast: [c('tallyheart', 'sit', 'sand-left'), c('player', 'sit', 'sand-right')] }, counts: { set: 'fx13-fours', next: 'e', intro: false } },
      e: { scene: { set: 'hollow', cam: 'sand', cast: [c('tallyheart', 'crouch', 'sand-left', { claws: true })] }, caption: ['Seven nights.'], counts: { set: 'fx13-gone', next: 'f' } },
      f: { scene: { set: 'field', cam: 'dogs', opts: { moon: 8 }, cast: [c('dog', 'sit', 'dog-1', { variant: 1 }), c('dog', 'sit', 'dog-2', { variant: 2 }), c('dog', 'sit', 'dog-3', { variant: 3 }), c('hail', 'tilt', 'wire')], fx: ['night'] },
        say: [{ who: 'hail', text: 'Want a riddle?' }], counts: { set: 'fx13-hail', next: 'g' } },
      g: { scene: { set: 'pile', cam: 'rear', opts: { rows: FULL, scale: 'behind', dug: 'big', tunnel: true, tap: 'mouth' }, cast: [c('player', 'sit', 'rear-1', { facing: 'right' }), c('tallyheart', 'crouch', 'poke', { mood: 'laugh' })], fx: ['night'] },
        caption: ['Her shoulders stick.'], scratch: { tap: 'mouth', prompt: '**Tap** to wriggle in.', label: 'Wriggle in.', next: 'h' } },
      h: { scene: { set: 'tracks', cam: 'crawl', opts: { tight: true }, cast: [c('player', 'crouch', 'crawl-1', { facing: 'right' }), c('riffle', 'scramble', 'crawl-2', { facing: 'right', tap: 'paw' })] },
        say: [{ who: 'riffle', kind: 'whisper', text: 'I’m stuck.' }], scratch: { tap: 'paw', prompt: '**Tap** to pull Riffle through.', label: 'Pull Riffle through.', next: 'i' } },
      i: { scene: { set: 'tracks', cam: 'fork', opts: { worm: true }, cast: [c('player', 'crouch', 'fork-1', { mood: 'sniff' })], fx: ['day'] }, caption: ['Worms. Just worms.'], next: 'j' },
      j: { scene: { set: 'tracks', cam: 'wide', opts: { moon: 8, tap: 'weeds' }, cast: [c('player', 'crouch', 'tunnel-end', { facing: 'right' }), c('tallyheart', 'sit', 'foot-2')] },
        caption: ['Voices!'], scratch: { tap: 'weeds', prompt: '**Tap** to hide in the tall weeds.', label: 'Hide in the weeds.', next: 'k' } },
      k: { scene: { set: 'tracks', cam: 'hide', opts: { moon: 8 }, cast: [c('player', 'crouch', 'weeds-1'), c('tallyheart', 'crouch', 'weeds-2', { tailUp: true, tap: 'tail' }), c('reynard', 'trot', 'rails'),
        c('snip', 'peek', 'hole-1'), c('snatch', 'peek', 'hole-2', { holds: 'mouse' })] },
        caption: ['The tip of her tail is sticking up.'], scratch: { tap: 'tail', prompt: '**Tap** the tail to pull it down.', label: 'Pull the tail down.', next: 'l' } },
      l: { scene: { set: 'tracks', cam: 'holes', cast: [c('snatch', 'point', 'hole-1', { mood: 'shout', holds: 'mouse', holdAt: 'paws' }), c('snip', 'up', 'hole-2', { mood: 'stern' }), c('player', 'crouch', 'stash-mouth'), c('riffle', 'stand', 'watch', { tap: 'ears' })] },
        say: [{ who: 'snip', name: 'Snip', text: 'Seven nights of it!' }, { who: 'snatch', text: 'A HUNDRED.' }], scratch: { tap: 'ears', prompt: '**Tap** to whisper in Riffle’s ear.', label: 'Whisper in Riffle’s ear.', next: 'm' } },
      m: { scene: { set: 'tracks', cam: 'brag', opts: { moon: 8 }, cast: [c('reynard', 'chest', 'rails', { mood: 'laugh' }), c('snip', 'up', 'slope-1', { mood: 'laugh' }), c('snatch', 'up', 'slope-2')] },
        caption: ['He laughs, a soft little yip.'], say: [{ who: 'reynard', text: 'Nobody saw a thing.' }], card: 'brag', next: 'n' },
      n: { scene: { set: 'tracks', cam: 'stash', opts: { tap: 'glass' }, cast: [c('player', 'crouch', 'stash-in', { mood: 'sniff' })] }, caption: ['Proof.'], card: 'stash',
        scratch: { tap: 'glass', prompt: '**Tap** to take one small piece.', label: 'Take one small piece.', next: 'o' } },
      o: { scene: { set: 'tracks', cam: 'stash-close', cast: [c('player', 'crouch', 'near', { mood: 'wonder' })] }, say: [{ who: 'player', kind: 'whisper', text: 'It’s GLASS.' }], card: 'glass', next: 'p' },
      p: { scene: { set: 'tracks', cam: 'holes', cast: [c('player', 'run', 'stash-mouth', { holds: 'leaf', holdAt: 'mouth', tap: 'paw' })] }, caption: ['GET THAT CAT!'], scratch: { tap: 'paw', prompt: '**Tap** to RUN!', label: 'Run!', next: 'q' } },
      q: { scene: { set: 'field', cam: 'wide', opts: { moon: 8, tap: 'path' }, cast: [c('dog', 'lie', 'heap-1', { variant: 1, asleep: true }), c('dog', 'lie', 'heap-2', { variant: 2, asleep: true }), c('dog', 'lie', 'heap-3', { variant: 3, asleep: true }),
        c('hail', 'peek', 'log'), c('player', 'walk', 'path-left', { facing: 'right' }), c('tallyheart', 'walk', 'path-right', { facing: 'right' })], fx: ['night', 'zzz'] },
        caption: ['The Barking Field is silver in the moonlight.'], scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'r' } },
      r: { scene: { set: 'field', cam: 'wide', opts: { moon: 8 }, cast: [c('player', 'walk', 'fence-top', { facing: 'right' }), c('dog', 'jump', 'dog-1', { variant: 1 }), c('hail', 'run', 'ring-1'), c('dog', 'bounce', 'ring-2', { variant: 2 }), c('hail', 'bounce', 'ring-3'), c('dog', 'bounce', 'ring-4', { variant: 3 })], fx: ['night', 'motion'] },
        caption: ['Round. And round.'], next: 's' },
      s: { scene: { set: 'field', cam: 'dogs', opts: { moon: 8 }, cast: [c('snip', 'skid', 'trail-1'), c('snatch', 'run', 'trail-2', { holds: 'mouse' }), c('hail', 'bounce', 'wire')], fx: ['night'] },
        say: [{ who: 'dog', variant: 1, name: 'The dogs', text: 'BYE, RUDE SQUIRRELS!' }], next: 't' },
      t: { scene: { set: 'pile', cam: 'rear', opts: { rows: FULL, scale: 'behind', dug: 'big', tunnel: true }, cast: [c('player', 'crouch', 'rear-1', { facing: 'right', holds: 'leaf', holdAt: 'paws', tap: 'leaf' }), c('tallyheart', 'sit', 'rear-2')], fx: ['night'] },
        caption: ['Through the hedge.'], scratch: { tap: 'leaf', prompt: '**Tap** to put down the glass.', label: 'Put down the glass.', next: 'u' } },
      u: { scene: { set: 'pile', cam: 'rear', opts: { rows: FULL, scale: 'behind', dug: 'big', tunnel: true }, cast: [c('player', 'sit', { x: 1000, y: 960, h: 380 }, { facing: 'right', tailUp: true, mood: 'proud', holds: 'glass' }), c('riffle', 'scramble', 'rear-2', { tailUp: true })], fx: ['night'] },
        caption: ['Your tail goes straight up.'], next: 'v' },
      v: { scene: { set: 'den', cam: 'nest', opts: { weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true, glass: true }, cast: [c('player', 'lie', 'nest')], fx: ['night'] }, caption: ['And under the moss, your glass.'], next: 'w' },
      w: { scene: { set: 'den', cam: 'inside', opts: { moon: 8 }, cast: [c('snorer', 'lie', 'sleeper-1', { mood: 'sleepy' }), c('player', 'lie', 'nest')], fx: ['night'] }, caption: ['“Tonight it really IS the paw thing,” you say.'],
        skip: { table: 4, groups: 2, who: [{ who: 'snorer' }, { who: 'player' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next cat’s paws.', prompt: '**Tap** the paws.', next: 'x' } },
      x: { scene: { set: 'den', cam: 'inside', cast: [c('snorer', 'lie', 'sleeper-1', { mood: 'sleepy' })], fx: ['night'] }, say: [{ who: 'snorer', text: 'EIGHT?' }], next: 'z' },
      z: { scene: { set: 'den', cam: 'nest', opts: { hidden: true } }, caption: ['The end.'], end: true }
    }, cards: {
      flew: { mark: 'ear', line: 'The fox says it FLEW.' },
      den: { mark: 'ear', line: 'Sleet says the fox talks about ‘a fine, dry den’.' },
      piles: { mark: 'ear', line: 'Two piles robbed.' },
      brag: { mark: 'ear', line: 'Reynard calls ‘It FLEW off’ his little story. He wants the dry den.',
        link: { with: ['flew', 'den'], line: 'He said FLEW. Now he calls it a story.', lines: { den: 'The same fine, dry den.' } } },
      stash: { mark: 'eye', line: 'The weasels have a stash: our prey, and ReedClan’s.', link: { with: ['piles'], line: 'Two piles robbed. One stash.' } },
      glass: { mark: 'eye', line: 'A heap of glass in the weasels’ stash, just like the ‘scale’.' }
    }, counts: {
      'fx13-fours': { table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}', label: 'Paws', hollowThings: 'fours', fillOrder: 'easiest', prompt: 'How many paws?',
        facts: [{ a: 4, b: 4, prompt: 'Four cats. Front paws: eight. Back paws: eight more.', retryPrompt: true, right: [T('Sixteen!')], rightAgain: true, miss: 'Eight and eight: sixteen. There. We’ll come back to that one.', missLast: 'Eight and eight: sixteen.' },
          [3, 4], { a: 4, b: 8, lit: 28, prompt: 'Eight cats.', retryPrompt: true }, { a: 8, b: 4, check: true }],
        praise: ['Two twos make a four!'], helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.', done: 'That’s the fours.' },
      'fx13-gone': { table: 4, thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', teacher: 'tallyheart', ask: '{a} × {b}', picture: { kind: 'marks', layout: 'pairs' },
        facts: [{ a: 4, b: 7, prompt: [{ kind: 'caption', text: 'Four gone a night, for seven nights. How many gone?' }], retryPrompt: true }],
        help: 'picture', fillFrom: 'fx13-fours', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.', avoid: [[3, 4], [4, 4]], praise: [], done: null },
      'fx13-hail': { table: 4, thing: 'paw', things: 'paws', unit: 'dog', units: 'dogs', teacher: 'hail', ask: '{a} × {b}', picture: { kind: 'dogs' }, who: FIELD,
        facts: [{ a: 4, b: 4, prompt: [{ who: 'hail', text: 'How many paws go round and round this field?' }], retryPrompt: true }],
        help: 'picture', helpIntro: 'Hop by fours! Four, eight…', fillFrom: 'fx13-fours', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one!', praise: [], done: null }
    }, book: { recap: [{ text: 'Eight.' }], dragonet: { id: 'hail', name: 'Hail', when: { foundHail: true }, lines: ['White with grey speckles.'], pose: 'bounce' } } };
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx13 = ' + JSON.stringify(story) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    const panel = id => md.split('\n### ' + id + ' · panel ')[1].split('\n### ')[0];
    // one cat's paws, a pair at a time, kept on the page after it; the rim's paws by fours; the bedtime paws
    assert.match(md, /\*\*Then she counts one cat’s paws, a pair at a time\*\* \(the skip-count, by 2s\): one cat close up, Tallyheart’s, side-on, standing, four paws plain at the bottom \(in play the cat takes the panel\); 2 taps, the front pair, then the back pair \(the next pair glows; a tap anywhere else makes it wiggle\), each lighting its two paws and putting the running total under it and in her own balloon: 2, 4\. Nothing can be got wrong, and nothing is logged\. The last tap turns the page to b, which shows the 4\. The cat stays on the plain pages after it, both pairs of paws lit, 2 and 4 under them\. The instruction under the panel: “Tap her paws\.” For VoiceOver, a hidden button: “Count the next pair of paws\.”/);
    assert.match(panel('b'), /\*\*The count:\*\* the skip-count’s 4 \(from a\) shows big over the picture, in the times-table font\.\n\n\*\*The paws stay:\*\* in place of this scene, the cat from a, side-on, both pairs of paws lit, 2 and 4 under them; the balloons sit beside it\./);
    assert.doesNotMatch(panel('c'), /stays?:/, 'the skip after it ends the kept run');
    assert.match(md, /\*\*Then she counts by 4s on the cats’ paws\*\* \(the skip-count\): five cats side-on, standing, four paws each \(in play they take the panel\); 5 taps, one on each cat in turn \(the next one glows; a tap anywhere else makes it wiggle\), each lighting its four paws and putting its running total under it and in Tallyheart’s balloon: 4, 8, 12, 16, 20\. Nothing can be got wrong, and nothing is logged\. In the picture, left to right: a Clan cat \(coat 1\), Murmurchime, the tortoiseshell warrior, a Clan cat \(coat 3\), a Clan cat \(coat 5\), the grizzled old tom\. The last tap turns the page to d, which does not show the number\./);
    assert.match(md, /\*\*Then she counts by 4s on the cats’ paws\*\* \(the skip-count\): two cats side-on, standing, four paws each \(in play they take the panel\); 2 taps, one on each cat in turn [^\n]*in her own balloon: 4, 8\. [^\n]*In the picture, left to right: the snoring apprentice, you\. The last tap turns the page to x, which shows the 8\./);
    assert.match(panel('x'), /\*\*The count:\*\* the skip-count’s 8 \(from w\) shows big over the picture/);
    // the 4s lesson: the table-4 cats, seven cats lit, its own lines after a miss, a check, the sand two and two
    assert.match(md, /\*\*Then the Counts lesson\*\* `fx13-fours` \(paws, cats side-on, standing, four paws each, five to a row, lit a cat at a time\): 4 × 4 \(its own question, kept on its retry; its own lines after a right answer; its own lines after a right retry; its own lines after a miss\), 3 × 4, 4 × 8 \(its first seven cats’ paws lit as it is asked \(28\); its own question, kept on its retry\), 8 × 4 \(a check: a right one never makes the fact hard\)\./);
    assert.match(md, /a miss gets the sand count \(four marks for every cat, scratched two and two with a gap between the pairs, hopped by fours from the first\)/);
    assert.match(md, /- In the Training Hollow: its button reads “Paws · the 4s”, and Tallyheart calls it “fours”\./);
    // the twenty-eight's marks two and two, lit a night at a time; Hail's riddle in the field's own four, Hail hopping it
    assert.match(md, /`fx13-gone` \(pieces, nights side by side, scratched in the sand, each night’s short upright marks in pairs, two and two with a gap between, and nothing else\): 4 × 7 \(its own question, kept on its retry\)\. She types each answer on the keypad; a miss gets the set’s own picture lit a night at a time, Tallyheart hopping it,/);
    assert.match(md, /`fx13-hail` \(paws, the animals of the set’s own cast side-on, standing, four paws each \(a dog’s paws marked so they light\), lit an animal at a time\): 4 × 4 \(its own question, kept on its retry\)\. Its picture has its own cast in the places, left to right: the huge shaggy dog, the spotty dog, the tiny dog \(mostly bark\), Hail, a Mistscale dragonet [^\n]*, the questions it lends included\. She types each answer on the keypad; a miss gets the set’s own picture lit an animal at a time, Hail hopping it by 4s,/);
    assert.match(md, /- Asking 4 × 4:\n  - \*\*The speckled dragonet \(Hail\)\*\*: “How many paws go round and round this field\?”/);
    // the pile round the back: Tallyheart at the mouth, the mouth tapped
    assert.match(panel('g'), /Tallyheart \(crouching, laughing, crouched at the tunnel mouth’s right edge, the nose at its rim, the shoulders plainly wider than the mouth, facing left\)\. Also: [^\n]*the roots lifted back, and under them the round dark mouth of a small tunnel[^\n]*; the tunnel’s round dark mouth is what she taps\./);
    assert.match(panel('g'), /\*\*Then she taps the tunnel’s round dark mouth\*\* \(one tap, on this scene\)/);
    // the tunnel's inside: place words of its own, at night whatever the frame says; Riffle's paw is Riffle's
    assert.match(panel('h'), /\*\*Scene\.\*\* Tracks: inside the weasels’ tunnel, under the Barking Field, at night \(dark earth walls close round, roots hanging from a low roof, a soft earth floor with faint tiny prints going both ways; dim blue-grey and readable, no light source; never frightening\)\. Camera: inside the tunnel, at cat height: [^\n]*\(`crawl`\)\. Cast: you \(crouching, happy, crawling at the front, facing right, where the roof just clears a sitting cat’s ears, facing right\); Riffle, the otter pup \(scrambling, happy, behind, at the left, partly cut off by the panel’s edge, facing right, the near forepaw is what she taps\)\. Also: the tunnel narrows at the back: an earth lip and roots drawn over the back half of whoever is there\./);
    assert.match(panel('h'), /\*\*Then she taps Riffle’s near forepaw\*\* \(one tap, on this scene\)/);
    assert.match(panel('i'), /Tracks: inside the weasels’ tunnel, under the Barking Field, at night \(/);
    assert.match(panel('i'), /Camera: inside the tunnel where it splits in two: two dark ways, left and right, a root between them \(`fork`\)\. Cast: you \(crouching, sniffing, at the split, facing the way she sniffs, facing left\)\. Also: one pink worm poking out of the left way’s wall\./);
    // the bank: its own words, its anchors, the half moon, the weeds tapped
    assert.match(panel('j'), /\*\*Scene\.\*\* Tracks: the railway bank by the tracks, past the Barking Field: nobody’s land, the trains own it, at night \(a high grassy bank, [^\n]*\)\. Camera: wide: the whole bank from the tall weeds at its foot to the two rails along its top[^\n]*\(`wide`\)\. Cast: you \(crouching, happy, in the tunnel’s end hole at the bank’s foot, the hole’s lip over the back half: head and shoulders out, wriggling out, facing right\); Tallyheart \(sitting, happy, on the ground at the bank’s foot, beside the first, further right, facing left\)\. Also: a bright half moon, eight evenings old; the tall weeds at the bank’s foot are what she taps\./);
    assert.match(panel('j'), /\*\*Then she taps the tall weeds at the bank’s foot\*\*/);
    // in the weeds: the raised tail tapped is the friend's; the fox on the rails and the weasels at their holes as the weeds see them
    assert.match(panel('k'), /Tallyheart \(crouching, happy, in the tall weeds at the bank’s foot, right: weeds drawn over her up to the eyes \(ears, eyes and the top of the head above\), facing left, the tail held straight up, its tip curled over, the raised tail’s tip is what she taps\); Reynard, the fox .*?\(trotting along on all fours, tail high, his smile on, happy, up on the tracks at the top of the bank, never bigger than a cat’s head in the weeds, facing left\); Snip, the weasel sister .*?\(head and shoulders out of a hole, the hole’s lip over the rest, happy, at the little hole up the bank, mid-distance, smaller than a cat’s head in the weeds, facing left\)/);
    assert.match(panel('k'), /\(head and shoulders out of a hole, the hole’s lip over the rest, happy, at the second small hole up the bank, mid-distance, smaller than a cat’s head in the weeds, facing left, a mouse in the mouth \(eyes shut, its tail dangling\)\)/);
    assert.match(panel('k'), /\*\*Then she taps the tip of Tallyheart’s tail, sticking straight up\*\*/);
    // the holes close up: the weasels' poses and moods their own way, the mouse in his paws, Riffle's ears tapped, the labels
    assert.match(panel('l'), /\(one forepaw out, pointing, squeaking, at the little hole, on the slope in front of it \(a weasel here about half a cat’s height\), facing left, a mouse held in the forepaws \(eyes shut, its tail dangling\)\)/);
    assert.match(panel('l'), /\(sitting up tall on the hind legs, forepaws tucked: a weasel’s look-out, pouting, at the second small hole, just beside the little one and a little higher, on the slope in front of it, facing left\); you \(crouching, happy, crouched at the biggest hole, the head at its mouth \(the mouth about as wide as her shoulders\), facing left\); Riffle, the otter pup \(standing up on his hind legs, happy, a little way off at the left among the weeds, weeds over the legs: keeping watch, facing left, his small round ears are what she taps\)\./);
    assert.match(panel('l'), /- \*\*Snip \(Snip\)\*\*: “Seven nights of it!”\n- \*\*A weasel \(Snatch\)\*\*: “A HUNDRED\.”/);
    assert.match(panel('l'), /\*\*Then she taps Riffle’s small round ears\*\*/);
    // the brag: the fox at a fox's size beside the weasels; the stash and its glass, in place words of their own
    assert.match(panel('m'), /Camera: low angle up the bank from beside the holes: [^\n]*\(`brag`\)\. Cast: Reynard, the fox .*?\(a paw on his chest, laughing, on the rails at the top of the bank, against the moon and stars, at a fox’s size beside the weasels, facing left\); Snip, the weasel sister .*?\(sitting up tall on the hind legs, forepaws tucked: a weasel’s look-out, cheeky, at the foot of the slope, bottom left, looking up, facing left\)/);
    assert.match(panel('n'), /\*\*Scene\.\*\* Tracks: inside the biggest hole in the bank: the weasels’ stash, at night \(a low earthen chamber with roots in its roof, [^\n]*\)\. Camera: inside the chamber, at cat height: [^\n]*\(`stash`\)\. Cast: you \(crouching, sniffing, at the chamber’s left edge, in from the mouth: head, shoulders and forepaws in the chamber, the rest cut off by the mouth’s rim, facing left\)\. Also: one small piece at the near edge of the heap of glass is what she taps\./);
    assert.match(panel('n'), /\*\*Then she taps one small piece of glass at the heap’s near edge\*\*/);
    assert.match(panel('o'), /Tracks: inside the biggest hole in the bank: the weasels’ stash, at night \([^\n]*Camera: close on the heap of glass in the stash: [^\n]*\(`stash-close`\)\. Cast: you \(crouching, full of wonder, the corner of her face and a forepaw at the panel’s left edge, drawn bigger than the panel, facing left\)\./);
    // the RUN Tap: her front paw, mid-stride, the leaf in her mouth
    assert.match(panel('p'), /you \(running flat out, body low and long, forelegs reaching, hind legs pushing, tail streaming behind, happy, crouched at the biggest hole, the head at its mouth \(the mouth about as wide as her shoulders\), facing left, the front paw, mid-stride, is what she taps, a leaf folded round something small, carried in the mouth\)/);
    assert.match(panel('p'), /\*\*Then she taps her own front paw, mid-stride\*\*/);
    // the Barking Field at night: silver, the heap asleep, Hail in the log, the path tapped; the fence top and the ring; the dogs' stretch of the path
    assert.match(panel('q'), /\*\*Scene\.\*\* Field: the Barking Field from the path outside its tall wire fence, at night, silver in the moonlight \(a muddy square of grass\)\./);
    assert.match(panel('q'), /the huge shaggy dog \(lying down, head on forepaws, happy, lying close to the others inside the fence, near it, behind the wire: the first of the heap, facing left, eyes shut: asleep\)/);
    assert.match(panel('q'), /Hail, a Mistscale dragonet .*?\(head and shoulders up, the rest of her below, happy, at the hollow log’s mouth far inside the fence, the log’s near rim over the lower body: head and shoulders out, facing left\)/);
    assert.match(panel('q'), /Also: a bright half moon, eight evenings old; the path ahead, the way to the tracks at the right, is what she taps\. Effects: night, sleepy zzz\./);
    assert.match(panel('q'), /\*\*Then she taps the path ahead, the way to the tracks\*\*/);
    assert.match(panel('r'), /you \(walking, happy, up on the fence’s top rail, in front of the wire, facing right\)/);
    assert.match(panel('r'), /\(running flat out round the field, wings flapping a little, happy, running round the big circle in the field round the hollow log, inside the fence \(the first of four places on it, facing along the loop\), facing left\)/);
    assert.match(panel('r'), /\(mid-hop, all four paws off the ground, wings half out, tail up, happy, on the big circle round the hollow log, the third place, facing left\)/);
    assert.match(panel('s'), /\(skidding to a stop: front paws braced, the back end swinging round, happy, along the middle of the path, the nearer of two places, facing left\); Snatch, the weasel brother .*?\(bounding, the back arched, happy, along the middle of the path, the further of two places, facing left, a mouse in the mouth/);
    assert.match(panel('s'), /\(mid-hop, all four paws off the ground, wings half out, tail up, happy, inside the fence, right up at the wire beside the dogs, facing left\)/);
    assert.match(panel('s'), /- \*\*The dogs \(The shaggy dog\)\*\*: “BYE, RUDE SQUIRRELS!”/);
    // home: the leaf at her paws tapped, then the glass open; the raised tails; the den's half moon and her glass
    assert.match(panel('t'), /you \(crouching, happy, round the back, left of the roots over the tunnel’s mouth, facing right, a leaf folded round something small, at the front paws, the leaf is what she taps\)/);
    assert.match(panel('t'), /\*\*Then she taps the leaf in her paws\*\*/);
    assert.match(panel('u'), /you \(sitting, proud, at a spot of this frame’s own \(x 1000, y 960\), facing right, the tail held straight up, its tip curled over, the leaf open on the ground at the front paws, the small clear piece of glass on it shining\); Riffle, the otter pup \(scrambling, happy, round the back, right of the roots over the tunnel’s mouth, facing left, his thick rudder tail stuck straight up\)/);
    assert.match(panel('v'), /Also: clear weather; no moon; Riffle’s lucky stone in her nest, right where she put it [^\n]*; her secret cards under the moss, a corner showing for each; her piece of glass in its leaf, tucked under the moss beside the corners of bark: the leaf’s tip and one small glint showing\./);
    assert.match(panel('w'), /Also: a bright half moon, eight evenings old\./);
    // the brag's two lines, each partner's own on the card row; a one-line link as it always was
    assert.match(md, /\| `brag` \| ear \| Reynard calls ‘It FLEW off’ his little story\. He wants the dry den\. \| m \| drawn touching `flew` over “He said FLEW\. Now he calls it a story\.”, then `den` over “The same fine, dry den\.” \(its own line\), each from the moment she holds it and this one \|/);
    assert.match(md, /\| `stash` \| eye \| The weasels have a stash: our prey, and ReedClan’s\. \| n \| drawn touching `piles` from the moment she holds both: “Two piles robbed\. One stash\.” \|/);
    // Hail's page in her own pose
    assert.match(md, /\*\*A dragonet page:\*\* Hail \(`hail`\), found in this chapter by a reader whose foundHail is true \(the page is there only then\)\. Her book gains a page for Hail \(drawn mid-hop, all four paws off the ground, wings half out, tail up\)/);
    // the at-a-glance taps, every one in words
    assert.match(md, /\| Other things she taps \| the tunnel’s round dark mouth \(g\), Riffle’s near forepaw \(h\), the tall weeds at the bank’s foot \(j\), the tip of Tallyheart’s tail, sticking straight up \(k\), Riffle’s small round ears \(l\), one small piece of glass at the heap’s near edge \(n\), her own front paw, mid-stride \(p\), the path ahead, the way to the tracks \(q\), the leaf in her paws \(t\) \|/);
    assert.doesNotMatch(md, /\[object Object\]|undefined|Set: |Camera: (wide|hide|holes|brag|stash|stash-close|crawl|fork) \(|\bat (tunnel-end|foot-\d|hole-\d|rails|weeds-\d|stash-mouth|watch|slope-\d|stash-in|near|crawl-\d|fork-\d|poke|heap-\d|log|wire|ring-\d|fence-top|trail-\d)\b|\b(tap|tight|worm|glass|moon): (true|false|"|\[|\d)/, 'every new name has words: none prints as its bare id');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('its words for chapter 9’s art and keys: GroveClan’s woods (every camera, its anchors, the oak and the hollow in place words of their own, the elder by camera), Thymeleaf’s den and the remedy, the case laid out and its rows lit a tap, the moon at 12 and 13, the root at the wall’s end at sunset, the roof’s dew at first light, the shallows and the bank’s spots; Thymeleaf, Mizzle, GroveClan by variant and the spider in their poses, Sprinkle in flight, Squall behind the pole, the mint, the wing, her own nose and tail, a cat’s ears; one spider’s two sides, spiders by eights, the spiders, the doses, the acorns, the sand at the 8s; an asker who answers himself; a recap line read only with ch9Roof; Mizzle’s page', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const file = path.join(tmp, 'fx14.js');
    const c = (who, pose, at, extra) => Object.assign({ who, pose, mood: 'happy', at, facing: 'left' }, extra || {});
    const T = text => ({ who: 'tallyheart', text }), TH = text => ({ who: 'thymeleaf', text });
    const CASE = { weather: 'clear', stone: 'auto', bark: 'auto', glass: true };
    const DOSE = { table: 8, unit: 'row', units: 'rows', ask: '{a} × {b}', picture: { kind: 'dose', layout: 'rows' }, help: 'picture',
      fillFrom: 'fx14-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.', praise: [], done: null };
    const story = { id: 'fx14', number: 14, title: 'Words', start: 'a', names: { mizzle: 'The sleepy dragonet' }, frames: {
      a: { scene: { set: 'hollow', cam: 'sand', cast: [c('tallyheart', 'crouch', 'sand-left', { claws: true })], fx: ['morning'] }, say: [T('Hop by eights.')],
        skip: { table: 8, groups: 5, thing: 'leg', things: 'legs', teacher: 'tallyheart', label: 'Count the next spider’s legs.', prompt: '**Tap** the spiders.', carry: false, next: 'b' } },
      b: { scene: { set: 'camp', cam: 'herbs', opts: { remedy: 'four' }, cast: [c('thymeleaf', 'sit', 'herbs-1', { facing: 'right', mood: 'kind' }), c('player', 'sit', 'herbs-2'), c('tallyheart', 'sit', 'herbs-3'), c('spider', 'wave', 'web')], fx: ['morning'] },
        caption: ['A tiny spider waves a leg at you.'],
        skip: { table: 4, groups: 2, who: [{ who: 'spider' }], thing: 'leg', things: 'legs', teacher: 'player', label: 'Count the next four legs.', prompt: '**Tap** her legs.', next: 'c' } },
      c: { scene: { set: 'camp', cam: 'herbs', opts: { remedy: 'mixed' }, cast: [c('thymeleaf', 'pawup', 'herbs-1', { facing: 'right', glow: true }), c('spider', 'spin', 'web')], fx: ['morning'] }, say: [TH('A wing is a wing.')],
        ask: { who: 'thymeleaf', to: 'thymeleaf', prompt: '**Tap** his claws.', label: 'Hear the next thing.', pairs: [['Reed root, from ReedClan.', 'It holds it all together.'], ['Oak moss, from GroveClan.', 'It calms the hurt.']], next: 'd' } },
      d: { scene: { set: 'hollow', cam: 'lesson', opts: { marks: 8, glow: 'auto' }, cast: [c('tallyheart', 'sit', 'sand-left'), c('player', 'sit', 'sand-right')], fx: ['morning'] }, counts: { set: 'fx14-eights', next: 'e', intro: false } },
      e: { scene: { set: 'grove', cam: 'bridge', cast: [c('player', 'walk', 'span-1', { facing: 'right', tap: 'paw' }), c('riffle', 'stand', 'span-2', { holds: 'mint' }), c('tallyheart', 'sit', 'near-2', { facing: 'right' })], fx: ['day'] },
        caption: ['Riffle is waiting on the bridge.'], scratch: { tap: 'paw', prompt: '**Tap** to cross.', label: 'Cross the bridge.', next: 'f' } },
      f: { scene: { set: 'grove', cam: 'wide', cast: [c('player', 'sit', 'edge-1', { facing: 'right' }), c('groveclan', 'walk', 'elder', { variant: 1 }), c('groveclan', 'sit', 'fern', { variant: 2, mood: 'shy' })], fx: ['day'] },
        say: [{ who: 'groveclan', text: 'CrystalClan.' }], next: 'g' },
      g: { scene: { set: 'grove', cam: 'oak', cast: [c('player', 'crouch', 'moss', { holds: 'leaf', holdAt: 'paws', tap: 'leaf' }), c('groveclan', 'pawup', 'elder', { variant: 1 }), c('riffle', 'sit', 'root-2', { mood: 'proud', holds: 'mint' })], fx: ['day'] },
        caption: ['You gather the soft silver moss.'], scratch: { tap: 'leaf', prompt: '**Tap** to roll it in a leaf.', label: 'Roll the moss in a leaf.', next: 'h' } },
      h: { scene: { set: 'grove', cam: 'hollow', cast: [c('mizzle', 'curl', 'nook', { asleep: true }), c('player', 'crouch', 'lip', { facing: 'right' })], fx: ['day', 'zzz'] }, sfx: 'Zzz… snrk.',
        say: [{ who: 'mizzle', text: 'Want a sleepy question?' }], counts: { set: 'fx14-mizzle', next: 'i' } },
      i: { scene: { set: 'title', cam: 'end', opts: { root: true, tap: 'root' }, cast: [c('player', 'sit', 'end-1', { facing: 'right', holds: 'leaf' }), c('tallyheart', 'sit', 'end-2', { facing: 'right' })], fx: ['sunset'] },
        caption: ['A long, pale root on the dry stones.'], scratch: { tap: 'root', prompt: '**Tap** to take the root.', label: 'Take the root.', next: 'j' } },
      j: { scene: { set: 'tower', cam: 'up', opts: { chime: true, light: true }, cast: [c('player', 'sit', 'foot', { tap: 'nose' }), c('waffles', 'peer', 'railing', { mood: 'shout' })], fx: ['morning'] },
        say: [{ who: 'waffles', text: 'With your NOSE.' }], scratch: { tap: 'nose', prompt: '**Tap** to ride up.', label: 'Ride up.', next: 'k' } },
      k: { scene: { set: 'roof', cam: 'two', opts: { dew: true, plane: true }, cast: [c('player', 'crouch', 'puddle', { holds: 'leaf', holdAt: 'paws' }), c('squall', 'hidden', 'pole')], fx: ['morning'] },
        caption: ['Eight drops a day, for four days, to the full moon.'], say: [{ who: 'squall', name: 'A voice', text: 'AND STAY OUT, giant dragon!' }], sfx: 'Hic!', counts: { set: 'fx14-dew', next: 'l' } },
      l: { scene: { set: 'bridge', cam: 'back', opts: { prints: true, stones: true }, cast: [c('player', 'sit', 'back-left'), c('sprinkle', 'wings', 'dragon', { tap: 'wing' }), c('thymeleaf', 'crouch', 'beside', { holds: 'leaf', mood: 'kind' })], fx: ['day'] },
        say: [TH('Hello, wing. Let’s mend you.')], scratch: { tap: 'wing', prompt: '**Tap** to rub the remedy in.', label: 'Rub the remedy in.', next: 'm' } },
      m: { scene: { set: 'bridge', cam: 'back', opts: { prints: true, stones: true }, cast: [c('thymeleaf', 'sit', 'beside'), c('sprinkle', 'sit', 'dragon')], fx: ['day'] }, say: [TH('Eight rubs, three times a day.')], counts: { set: 'fx14-rubs', next: 'n' } },
      n: { scene: { set: 'bridge', cam: 'bank', opts: { shallows: true, drag: false }, cast: [c('sprinkle', 'glide', 'skim'), c('riffle', 'stand', 'watch-1', { facing: 'right' }), c('player', 'sit', 'watch-2', { facing: 'right' })], fx: ['day'] },
        caption: ['A run along the bank, a glide…'], next: 'o' },
      o: { scene: { set: 'bridge', cam: 'bank', opts: { shallows: true, drag: false }, cast: [c('sprinkle', 'splash', 'paddle'), c('player', 'pawup', 'run-2', { tap: 'paw' })], fx: ['day'] }, sfx: 'SPLASH!',
        caption: ['Up she pops, laughing.'], scratch: { tap: 'paw', prompt: '**Tap** to clap.', label: 'Clap.', next: 'p' } },
      p: { scene: { set: 'bridge', cam: 'bank', opts: { shallows: true, drag: false }, cast: [c('sprinkle', 'flap', 'run'), c('player', 'sit', 'watch-1', { facing: 'right', tailUp: true })], fx: ['day'] },
        caption: ['Harder. HARDER…'], next: 'p2' },
      p2: { scene: { set: 'bridge', cam: 'bank', opts: { shallows: true, drag: false }, cast: [c('player', 'sit', 'watch-1', { facing: 'right', tailUp: true, tap: 'tail' }), c('sprinkle', 'hop', 'run')], fx: ['day'] },
        caption: ['Cheer!'], scratch: { tap: 'tail', prompt: '**Tap** to cheer!', label: 'Cheer!', next: 'q' } },
      q: { scene: { set: 'bridge', cam: 'bank', opts: { shallows: true, drag: false }, cast: [c('sprinkle', 'fly', 'air')], fx: ['day'] }, caption: ['…and she LIFTS.'], next: 'r' },
      r: { scene: { set: 'pile', cam: 'wide', opts: { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 12 }, cast: [c('tallyheart', 'walk', 'behind')], fx: ['dusk'] }, caption: ['Every evening, a rounder moon.'], next: 's' },
      s: { scene: { set: 'den', cam: 'case', opts: Object.assign({ read: 0 }, CASE), cast: [c('player', 'crouch', 'case-1', { facing: 'right' }), c('tallyheart', 'sit', 'case-2')], fx: ['night'] },
        caption: ['You lay out your bark, row by row.'],
        ask: { who: 'tallyheart', to: 'player', opt: 'read', prompt: '**Tap** each row.', label: 'Read the next row.', pairs: [['The moon?', 'Only the fox says moon.'], ['The fox’s little story?', 'He says it FLEW.']], next: 't' } },
      t: { scene: { set: 'den', cam: 'case', opts: Object.assign({ read: 3 }, CASE), cast: [c('tallyheart', 'sit', 'case-2', { tap: 'ears' })], fx: ['night'] }, caption: ['Whisper it.'], scratch: { tap: 'ears', prompt: '**Tap** to whisper it.', label: 'Whisper it.', next: 'u' } },
      u: { scene: { set: 'den', cam: 'case', opts: Object.assign({ read: 7 }, CASE), cast: [c('glintstar', 'walk', 'case-3'), c('tallyheart', 'sit', 'case-2')], fx: ['night'] }, caption: ['Soon Glintstar steps into the den.'], next: 'v' },
      v: { scene: { set: 'den', cam: 'doorway', opts: { weather: 'clear', moon: 13, stone: 'auto', bark: 'auto', hidden: true, glass: true } , fx: ['night'] }, caption: ['Tomorrow, it’s full.'], next: 'z' },
      z: { scene: { set: 'den', cam: 'nest', opts: { hidden: true } }, caption: ['The end.'], end: true }
    }, cards: {}, counts: {
      'fx14-eights': { table: 8, thing: 'leg', things: 'legs', unit: 'spider', units: 'spiders', teacher: 'tallyheart', ask: '{a} × {b}', label: 'Spiders’ legs', hollowThings: 'eights', fillOrder: 'easiest', prompt: 'How many legs?',
        facts: [{ a: 2, b: 8, prompt: 'Two spiders. How many legs?', retryPrompt: true }, [8, 3], { a: 7, b: 8, prompt: 'Seven spiders.', retryPrompt: true, miss: 'Fifty-six. There.', missLast: 'Fifty-six.' }, { a: 8, b: 7, check: true }],
        praise: ['Two fours make an eight!'], helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.', done: 'That’s the eights.' },
      'fx14-mizzle': { table: 8, thing: 'acorn', things: 'acorns', unit: 'twig', units: 'twigs', teacher: 'mizzle', ask: '{a} × {b}', picture: { kind: 'acorns' },
        facts: [{ a: 6, b: 8, prompt: [{ who: 'mizzle', text: 'How many… acorns…' }], retryPrompt: true }],
        help: 'picture', helpIntro: 'Hop by eights! Eight, sixteen…', fillFrom: 'fx14-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one…', avoid: [[6, 8], [7, 8]], praise: [], done: null },
      'fx14-dew': Object.assign({}, DOSE, { thing: 'drop', things: 'drops', teacher: 'caption', againIntro: 'The drops again.',
        facts: [{ a: 8, b: 4, prompt: [{ kind: 'caption', text: 'How many drops must you gather?' }], retryPrompt: true }], helpIntro: 'You count them, a row at a time: eight, sixteen…' }),
      'fx14-rubs': Object.assign({}, DOSE, { thing: 'rub', things: 'rubs', teacher: 'thymeleaf',
        facts: [{ a: 3, b: 8, prompt: [{ kind: 'caption', text: 'How many rubs a day?' }], retryPrompt: true }], helpIntro: 'Let’s count them together.' }),
      'fx14-flaps': Object.assign({}, DOSE, { thing: 'flap', things: 'flaps', teacher: 'thymeleaf',
        facts: [{ a: 8, b: 8, prompt: [{ kind: 'caption', text: 'How many flaps a day?' }], retryPrompt: true }], helpIntro: 'Let’s count them together.' })
    }, book: { recap: [{ text: 'Eight.' }, { when: { ch9Roof: true }, text: 'On the roof of {their} old tower, {name}paw found Squall.' }, { when: { foundSquall: true, ch5Roof: false, ch9Roof: false }, text: 'Found him here.' }],
      dragonet: { id: 'mizzle', name: 'Mizzle', when: { foundMizzle: true }, pose: 'yawn', lines: ['Pearly green, sweet and sleepy.'] } } };
    // (the flaps' set has no frame of its own here: it is printed only where a frame runs it)
    story.frames.m2 = { scene: { set: 'bridge', cam: 'back', cast: [c('thymeleaf', 'sit', 'beside')], fx: ['day'] }, say: [TH('And practice. Eight times a day.')], counts: { set: 'fx14-flaps', next: 'n' } };
    story.frames.m.counts.next = 'm2';
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx14 = ' + JSON.stringify(story) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    const panel = id => md.split('\n### ' + id + ' · panel ')[1].split('\n### ')[0];
    // the five spiders by eights; one spider's two sides
    assert.match(panel('a'), /\*\*Then she counts by 8s on the spiders’ legs\*\* \(the skip-count\): five spiders from above, eight legs each, four on each side \(in play they take the panel\); 5 taps, one on each spider in turn \(the next one glows; a tap anywhere else makes it wiggle\), each lighting her eight legs, four and four, and putting its running total under her and in Tallyheart’s balloon: 8, 16, 24, 32, 40\. Nothing can be got wrong, and nothing is logged\. The last tap turns the page to b, which does not show the number\. The instruction under the panel: “Tap the spiders\.” For VoiceOver, a hidden button: “Count the next spider’s legs\.”/);
    assert.match(panel('b'), /\*\*Then she counts one spider’s legs, a side at a time\*\* \(the skip-count, by 4s\): one spider close up, from above, four legs on each side \(in play she takes the panel\); 2 taps, one side, then the other \(the next side glows; a tap anywhere else makes it wiggle\), each lighting its four legs and putting the running total beside it and in her own balloon: 4, 8\. Nothing can be got wrong, and nothing is logged\. The last tap turns the page to c, which shows the 8\./);
    // Thymeleaf's den: place words of its own, its anchors, the remedy, the spider in her corner
    assert.match(panel('b'), /\*\*Scene\.\*\* Camp: Thymeleaf’s den, a nook of the bramble dens at the camp’s edge, in the morning \(a curtain of drying leaves across the top [^\n]*a small web where a tiny spider lives; green, warm light through the leaves\)\. Camera: from just inside the den’s mouth, at cat height: [^\n]*\(`herbs`\)\. Cast: Thymeleaf, CrystalClan’s medicine cat \(an old, calm tom: [^\n]*a sprig of mint tucked behind one ear\) \(sitting, kind, among the drying leaves at the left, facing right\); you \(sitting, happy, at the right of the den, facing left\); Tallyheart \(sitting, happy, at the right of the den, further right still, facing left\); a tiny garden spider \([^\n]*four legs on each side[^\n]*\) \(one front leg raised, waving, happy, high in the den’s top corner, on the little web \(a spot about the size of a cat’s forepaw\), facing left\)\. Also: on the mixing stone, the four things in a row: a long pale root, a roll of soft silver moss, a bunch of mint and a curled leaf holding dew drops\./);
    assert.match(panel('c'), /\(in her corner on a few threads, spinning,/);
    assert.match(panel('c'), /Also: on the mixing stone, one curled leaf of pale green remedy, the stone smeared green\./);
    // an asker who answers himself: two balloons of his own a tap
    assert.match(panel('c'), /\*\*Then she taps Thymeleaf, once for each pair of his lines\*\* \(two taps, on this scene, counting nothing\): Thymeleaf glows softly; a tap on him letters his next line in his balloon and the one after it in a second balloon of his own, and the scene stays as it is; [^\n]*After the last one: Next → d\. The instruction under the panel: “Tap his claws\.” For VoiceOver, a hidden button: “Hear the next thing\.”\n\n1\. \*\*Thymeleaf\*\*: “Reed root, from ReedClan\.” then “It holds it all together\.”\n2\. \*\*Thymeleaf\*\*: “Oak moss, from GroveClan\.” then “It calms the hurt\.”/);
    // the 8s: spiders, the sand four and four
    assert.match(md, /\*\*Then the Counts lesson\*\* `fx14-eights` \(legs, spiders from above, eight legs each, four on each side, five to a row with space between, never touching, lit a leg at a time \(a spider’s left four, then her right four\)\): 2 × 8 \(its own question, kept on its retry\), 8 × 3, 7 × 8 \(its own question, kept on its retry; its own lines after a miss\), 8 × 7 \(a check: a right one never makes the fact hard\)\./);
    assert.match(md, /`fx14-eights`[^\n]*a miss gets the sand count \(eight marks for every spider, scratched four and four with a gap between the fours, hopped by eights from the first\) and comes back two questions later/);
    assert.match(md, /- In the Training Hollow: its button reads “Spiders’ legs · the 8s”, and Tallyheart calls it “eights”\./);
    // GroveClan's woods: every camera in words of its own, the anchors, the elder by camera, the apprentice by coat, the mint
    assert.match(panel('e'), /\*\*Scene\.\*\* Grove: GroveClan’s woods, over the little bridge from the river path, in the bright afternoon \(a little old footbridge [^\n]*never dark\)\. Camera: the approach: [^\n]*\(`bridge`\)\. Cast: you \(walking, happy, on the little bridge, at its near end, stepping on, facing right, the front paw, mid-step, is what she taps\); Riffle, the otter pup \(standing up on his hind legs, happy, on the little bridge, further across, facing left, a bunch of river mint as big as his head, held in the forepaws\); Tallyheart \(sitting, happy, on the near bank at the bridge’s foot, beside the first, facing right\)\./);
    assert.match(panel('e'), /\*\*Then she taps her own front paw, mid-step\*\*/);
    assert.match(panel('f'), /Camera: wide, over the bridge: [^\n]*\(`wide`\)\. Cast: you \(sitting, happy, at the bridge’s end, waiting to be asked in, first, facing right\); the GroveClan elder \(a she-cat: [^\n]*\) \(walking, happy, stepping out from between the trunks at the right, facing left\); the GroveClan apprentice \(small, apprentice-sized: [^\n]*\) \(sitting, shy \(eyes down, a small smile\), behind the elder, half hidden by a fern: a face and ears showing, facing left\)\./);
    assert.match(panel('f'), /- \*\*A GroveClan elder\*\*: “CrystalClan\.”/);
    assert.match(panel('g'), /\*\*Scene\.\*\* Grove: the old oak in GroveClan’s woods, in the bright afternoon \(an enormous trunk furry with moss, [^\n]*\)\. Camera: the old oak from its foot: [^\n]*\(`oak`\)\. Cast: you \(crouching, happy, crouched low at the soft silver moss on the oak’s shaded north side, facing left, a leaf folded round something small, at the front paws, the leaf is what she taps\); the GroveClan elder [^\n]*\(one forepaw raised, happy, beside the oak, at the right, facing left\); Riffle, the otter pup \(sitting, proud, at the old oak’s foot among the roots, second, facing left, a bunch of river mint as big as his head, held in the forepaws\)\./);
    // the hollow: place words of its own; Mizzle asleep, by the chapter's name; her acorns, Mizzle hopping them
    assert.match(panel('h'), /\*\*Scene\.\*\* Grove: inside the hollow, high in the old oak, in the bright afternoon \(a snug round nook of old wood lined with soft moss, [^\n]*never a dark hole\)\. Camera: inside the hollow, close: [^\n]*\(`hollow`\)\. Cast: Mizzle, the last dragonet \([^\n]*pearly green[^\n]*\) \(curled up on the moss, her tail round her nose, happy, on the moss in the hollow, facing left, eyes shut: asleep\); you \(crouching, happy, at the hollow’s opening: head, shoulders and forepaws in, the rest cut off by the opening’s rim \(below the forepaws\), facing right\)\. Effects: daylight, sleepy zzz\./);
    assert.match(panel('h'), /- \*\*The sleepy dragonet \(Mizzle\)\*\*: “Want a sleepy question\?”/);
    assert.match(md, /`fx14-mizzle` \(acorns, short twigs side by side, each with a leaf or two and eight acorns in two clusters of four, lit an acorn at a time\): 6 × 8 \(its own question, kept on its retry\)\. She types each answer on the keypad; a miss gets the set’s own picture lit a twig at a time, Mizzle hopping it by eights, and comes back two questions later/);
    // the root at the wall's end at sunset, tapped
    assert.match(panel('i'), /Title: the old stone wall’s far end above the river, where its stones stop and tall reeds begin: the border with ReedClan, at sunset[^\n]*Also: a long, pale reed root lying along the dry stones at the wall’s end \(never in the mud or the reeds\), and beside it one wet pawprint, dark on the dry stone; the long pale root on the dry stones is what she taps\./);
    assert.match(panel('i'), /\*\*Then she taps the long pale root on the dry stones\*\*/);
    // her own nose
    assert.match(panel('j'), /\*\*Then she taps her own nose\*\*/);
    // the roof at first light: the dew, the puddle, Squall behind the pole as "A voice"; the dew's drops, her own count
    assert.match(panel('k'), /\*\*Scene\.\*\* Roof: the roof of the tallest tower, flat and wide, at first light \([^\n]*\)\. Camera: two at the same height, by the pole \(`two`\)\. Cast: you \(crouching, happy, crouched at the rain puddle’s edge, clear of the pole and the wall, facing left, a leaf folded round something small, at the front paws\); Squall, the littlest dragonet [^\n]*\(out of sight behind the red light’s pole: nothing of him but the tip of his slate tail with its yellow flecks, curled round the pole’s foot, and a small ring of hiccup mist rising beside it, happy, at the foot of the pole, facing left\)\. Also: the rain puddle silver with dew at first light, [^\n]*catching the low sun; an airplane passing well above the roof\./);
    assert.match(panel('k'), /- \*\*A voice \(Squall\)\*\*: “AND STAY OUT, giant dragon!”/);
    assert.match(md, /`fx14-dew` \(drops, rows of eight round dewdrops, each with a highlight, each row four and four with a gap, stacked top to bottom, lit a mark at a time\): 8 × 4 \(its own question, kept on its retry\)\. She types each answer on the keypad; a miss gets the set’s own picture lit a row at a time, the player keeping the count by eights, and comes back two questions later/);
    // under the Old Bridge: the wing tapped, Thymeleaf's remedy in its leaf; the rubs and the flaps in his count
    assert.match(panel('l'), /\(wings open, the right one drooping, half open, happy, in Sprinkle’s spot at the very back, facing left, her hurt right wing is what she taps\); Thymeleaf, [^\n]*\(crouching, kind, pressed against Sprinkle’s side, facing left, the remedy, pale green, curled in a leaf at the front paws\)/);
    assert.match(panel('l'), /\*\*Then she taps Sprinkle’s hurt right wing\*\*/);
    assert.match(md, /`fx14-rubs` \(rubs, rows of eight small paw marks \(a pad and four toes\), each row four and four with a gap, stacked top to bottom, lit a mark at a time\): 3 × 8 [^\n]*a miss gets the set’s own picture lit a row at a time, Thymeleaf counting it by eights,/);
    assert.match(md, /`fx14-flaps` \(flaps, rows of eight short plain strokes, each row four and four/);
    // the sunny bank: the shallows, Sprinkle in flight at the new spots, the clap, her own tail
    assert.match(panel('n'), /Cast: Sprinkle, a Mistscale dragonet [^\n]*\(gliding low, wings spread wide, paws tucked, happy, low over the sand’s edge by the water, paws just clear of the sand, facing left\); Riffle, the otter pup \(standing up on his hind legs, happy, on the bank at the left, watching, first, facing right\); you \(sitting, happy, on the bank at the left, watching, second, facing right\)\. Also: the water at the bank’s edge bright and clear in the sun: [^\n]*never dark; no drag marks\./);
    assert.match(panel('o'), /\(sitting up in the bright shallows, water to her chest, drops flying, laughing, happy, in the bright shallows at the sand’s edge, the water over the legs, rings and drops all round, facing left\); you \(one forepaw raised, happy, on the sand just left of the first spot, facing left, the raised forepaw is what she taps\)/);
    assert.match(panel('p'), /\(both wings up, flapping hard, her hurt right wing a little lower and stiffer than the good one, happy, on the strip of soft sand at the water’s edge, mid-right, facing left\)/);
    assert.match(panel('p2'), /\(a hop off the sand, all four paws up, wings half open, happy,/);
    assert.match(panel('p2'), /\*\*Then she taps the tip of her own tail, sticking straight up\*\*/);
    assert.match(panel('q'), /\(up in the air, both wings up mid-beat, paws off the ground, joyful, happy, up in the air above the sand, paws a little more than her own leg’s length off it, facing left\)/);
    // the pile's moon at twelve; the den's at thirteen
    assert.match(panel('r'), /Also: four rows of ten, running back under the brambles; [^\n]*the moon more than half and growing, twelve evenings old\./);
    assert.match(panel('v'), /Also: clear weather; the moon nearly round, thirteen evenings old; /);
    // the case: its camera, its anchors, the bark laid out, the glass beside the rows, a row lit a tap
    assert.match(panel('s'), /\*\*Scene\.\*\* Den: the apprentices’ den under an enormous rosebush, at night\. Camera: close, from a little above, on the den floor in front of her nest at night, [^\n]*its moss rolled back \(`case`\)\. Cast: you \(crouching, happy, at the near left of the rows of bark, facing right\); Tallyheart \(sitting, happy, across the rows at the right, facing left\)\. Also: no row lit yet; the first row \(the moon\) glows: the row she taps next; clear weather; Riffle’s lucky stone in her nest, right where she put it [^\n]*; her bark laid out on the floor in six rows, each piece face up, the pieces of a row touching: the moon \(`waffles-no-moon`, `fox-moon`, `heron-no-moon`\), FLEW \(`cant-fly`, `fox-flew`, `fox-brag`, and `sleet-den` at its end if she holds it\), [^\n]*unread; her piece of glass in its leaf, lying open beside the rows, shining\./);
    assert.match(panel('s'), /\*\*Then she taps the rows of her case, one at a time\*\* \(two taps, on this scene, counting nothing\): the next row of bark glows \(the scene marks it; Tallyheart does not glow\); a tap on it letters Tallyheart’s next question in her balloon and your own answer in your balloon, and lights that row \(the scene’s `read` goes up by one, and the row after it glows\); [^\n]*A tap anywhere else makes the glowing row hop\.[^\n]*After the last one: Next → t\. The instruction under the panel: “Tap each row\.” For VoiceOver, a hidden button: “Read the next row\.”\n\n1\. \*\*Tallyheart\*\*: “The moon\?” \*\*You\*\*: “Only the fox says moon\.”/);
    assert.match(panel('t'), /Also: the first three rows lit, the bark warm \(the moon, FLEW and the piles\); the next row \(the scale\) glows: the row she taps next;/);
    assert.match(panel('t'), /\*\*Then she taps Tallyheart’s ears\*\*/, 'a cat’s ears are a cat’s');
    assert.match(panel('u'), /Glintstar \(walking, happy, at the far side, standing by the doorway’s light, facing left\)[^\n]*Also: all six rows lit, and a seventh laid out and lit below them, out of the face-down stack: her own count \(`my-count`\) and Mizzle’s card \(`mizzle-wing`\), each only if she holds it; nothing glowing;/);
    // the bedtime den keeps its words: bark along the nest's edge, the glass under the moss
    assert.match(panel('v'), /her Case File along the mossy edge of her nest[^\n]*her piece of glass in its leaf, tucked under the moss/);
    // the at-a-glance taps
    assert.match(md, /\| Other things she taps \| Thymeleaf’s two pairs of lines \(c\), her own front paw, mid-step \(e\), the leaf in her paws \(g\), the long pale root on the dry stones \(i\), her own nose \(j\), Sprinkle’s hurt right wing \(l\), her own raised forepaw \(o\), the tip of her own tail, sticking straight up \(p2\), the two rows of her case \(s\), Tallyheart’s ears \(t\) \|/);
    // the book: a line read only with ch9Roof, the three "found" lines' ch9Roof false; Mizzle's page in her own pose
    assert.match(md, /- \(if ch9Roof is true\) On the roof of \{their\} old tower, \{name\}paw found Squall\./);
    assert.match(md, /- \(if foundSquall is true and ch5Roof is false or not set and ch9Roof is false or not set\) Found him here\./);
    assert.match(md, /\*\*A dragonet page:\*\* Mizzle \(`mizzle`\), found in this chapter by a reader whose foundMizzle is true \(the page is there only then\)\. Her book gains a page for Mizzle \(drawn head up, one eye open, a big round yawn \(no teeth\)\)/);
    assert.doesNotMatch(md, /\[object Object\]|undefined|Set: |Camera: (bridge|wide|meet|oak|hollow|herbs|case) \(|\bat (near-\d|span-\d|far|edge-\d|elder|fern|meet-\d|root-\d|trunk|moss|nook|lip|herbs-\d|web|case-\d|puddle|run|run-2|skim|air|paddle|watch-\d)\b|(?<![-\w])(remedy|read|root|dew|shallows|tap|moon): (true|false|"|\[|\d)/, 'every new name has words: none prints as its bare id');
    assert.doesNotMatch(md, /\b(spin|wave|yawn|wake|glide|splash|hidden),/, 'no pose prints as its bare name');
    assert.doesNotMatch(md, /small round ears/, 'only Riffle’s ears are small and round');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

/* Chapter 10 (docs/chapters/10-the-gathering.spec.md, sections 4 to 6): the words for its art and its keys, on a fixture
 * chapter in the shape the spec gives them. The card picks' cards are the game's own (the fixture defines none, so the
 * tool reads their lines from the chapters beside it, as chapter 10 does from chapters 4 to 9). */
function fixture10() {
  const c = (who, pose, at, extra) => Object.assign({ who, pose, mood: 'happy', at, facing: 'left' }, extra || {});
  const T = text => ({ who: 'tallyheart', text });
  const CLUTCH = { table: 7, thing: 'dragonet', things: 'dragonets', unit: 'clutch', units: 'clutches', teacher: 'tallyheart', ask: '{a} × {b}' };
  const ROLL = [{ who: 'sprinkle' }, { who: 'squall', when: { foundSquall: true } }, { who: 'squall', shape: true, when: { foundSquall: false } },
    { who: 'hail', when: { foundHail: true } }, { who: 'hail', shape: true, when: { foundHail: false } }];
  return { id: 'fx15', number: 15, title: 'Words', start: 'a', names: { puddle: 'The big-footed dragon', otter: 'Granny' }, frames: {
    a: { scene: { set: 'den', cam: 'inside', opts: { weather: 'clear', moon: 14, miststone: true }, cast: [c('tallyheart', 'peer', 'doorway')], fx: ['morning'] }, say: [{ who: 'tallyheart', kind: 'whisper', text: 'Big day.' }], next: 'b' },
    b: { scene: { set: 'hollow', cam: 'sand', opts: { marks: 9, glow: 'auto' }, cast: [c('tallyheart', 'crouch', 'sand-left', { claws: true })], fx: ['morning'] }, say: [T('Hop by sevens.')],
      skip: { table: 7, groups: 5, thing: 'dragonet', things: 'dragonets', teacher: 'tallyheart', label: 'Count the next clutch.', prompt: '**Tap** the clutches.', carry: false, next: 'c' } },
    c: { scene: { set: 'hollow', cam: 'lesson', opts: { marks: 9, glow: 'auto' }, cast: [c('tallyheart', 'sit', 'sand-left'), c('player', 'sit', 'sand-right')], fx: ['morning'] }, counts: { set: 'fx15-sevens', next: 'd', intro: false } },
    d: { scene: { set: 'hollow', cam: 'tree', opts: { marks: 10, glow: 'auto' }, fx: ['morning'] }, caption: ['A tenth claw mark.'], sfx: 'SKRITCH!', next: 'e' },
    e: { scene: { set: 'ferry', cam: 'shore', opts: { moon: 14, clan: true }, cast: [c('player', 'walk', 'edge', { facing: 'right', tap: 'paw' }), c('otter', 'stand', 'pole', { variant: 3, holds: 'pole', mood: 'kind' }), c('riffle', 'hop', 'log-1', { mood: 'shout' })], fx: ['dusk'] },
      say: [{ who: 'riffle', text: 'Everybody ON!' }, { who: 'otter', variant: 3, text: 'Hop on, little one.' }], scratch: { tap: 'paw', prompt: '**Tap** to step aboard.', label: 'Step aboard.', next: 'f' } },
    f: { scene: { set: 'ferry', cam: 'back', opts: { moon: 14, luggage: true, puff: true }, cast: [c('riffle', 'hush', 'heap'), c('tallyheart', 'lookup', 'back-1', { facing: 'right' }), c('otter', 'sit', 'back-3', { variant: 3, mood: 'kind', facing: 'right' })], fx: ['night'] },
      caption: ['The heap burps.'], next: 'g' },
    g: { scene: { set: 'ferry', cam: 'low', opts: { moon: 14, low: true }, cast: [c('puddle', 'eyes', 'gap'), c('player', 'flat', 'lie', { facing: 'right' }), c('riffle', 'sit', 'sit-2'), c('tallyheart', 'sit', 'sit-3')], fx: ['night'] }, sfx: 'Blub.',
      say: [{ who: 'puddle', name: 'Two big eyes', text: 'Hello.' }], next: 'h' },
    h: { scene: { set: 'ferry', cam: 'under', opts: { moon: 14 }, cast: [c('puddle', 'head', 'water'), c('player', 'peer', 'lip', { facing: 'right' })], fx: ['night'] }, say: [{ who: 'puddle', text: 'On the storm night…' }], card: 'puddle-paws', next: 'i' },
    i: { scene: { set: 'ferry', cam: 'deck', opts: { moon: 14, clan: true, luggage: true }, cast: [c('player', 'sit', 'front', { facing: 'right' }), c('tallyheart', 'sit', 'beside', { facing: 'right' }), c('otter', 'stand', 'pole', { variant: 3, holds: 'pole' }), c('murmurchime', 'sit', 'seat-1')], fx: ['night'] },
      say: [T('So let’s count.')], counts: { set: 'fx15-ferry', next: 'j', intro: false } },
    j: { scene: { set: 'island', cam: 'wide', opts: { crowd: true, luggage: 'heap', tap: 'reeds' }, cast: [c('reedclan', 'sit', 'root-1', { variant: 5, facing: 'right' }), c('groveclan', 'sit', 'root-3', { variant: 3 }), c('reedclan', 'sit', 'crowd-5', { variant: 1 }), c('sloshbank', 'sit', 'crowd-4'), c('player', 'sit', 'centre')], fx: ['night'] },
      say: [{ who: 'reedclan', text: 'THAT’S the dragon?' }, { who: 'groveclan', text: 'Who is Princess Waffles?' }], scratch: { tap: 'reeds', prompt: '**Tap** to pull the reeds off the luggage.', label: 'Pull the reeds off.', next: 'k' } },
    k: { scene: { set: 'island', cam: 'fox', opts: { crowd: true }, cast: [c('reynard', 'bow', 'fox', { wet: true }), c('snip', 'stand', 'weasel-1', { wet: true }), c('snatch', 'stand', 'weasel-2', { wet: true, holds: 'mouse' })], fx: ['night'] },
      caption: ['Reynard bows low.'], say: [{ who: 'reynard', text: 'It FLEW out of your camp!' }],
      pick: { claim: 'It FLEW out of your camp!', right: ['cant-fly', 'fox-brag', 'mizzle-wing'], own: { 'fox-flew': 'Hmm. That’s what HE says. Which card shows what YOU found out?' },
        nudges: ['Hmm. Does that one say if Sprinkle could FLY?', 'Think of Sprinkle, under the bridge. Could she fly?'], flag: 'fx15Flew', next: 'l' } },
    l: { scene: { set: 'island', cam: 'case', opts: { crowd: true, drawing: 'cat' }, cast: [c('player', 'sit', 'speak', { facing: 'right' }), c('sprinkle', 'sit', 'beside'), c('reynard', 'flap', 'fox')], fx: ['night'] },
      say: [{ who: 'player', text: 'Sprinkle can’t fly!', when: { fx15Flew: 'cant-fly' } }, { who: 'player', text: 'Mizzle saw her wing.', when: { fx15Flew: ['mizzle-wing'] } }, { who: 'sprinkle', text: 'I couldn’t even FLAP.', when: { not: { fx15Flew: 'fox-brag' } } }],
      next: 'm' },
    m: { scene: { set: 'island', cam: 'case', opts: { crowd: true }, cast: [c('player', 'sit', 'speak', { facing: 'right' }), c('reynard', 'flap', 'fox')], fx: ['night'] }, say: [{ who: 'reynard', text: 'Only something BIG could take so much!' }],
      pick: { claim: 'Only something BIG could take so much!', right: ['stash', 'tunnel', 'my-count'], nudges: ['Hmm. Does that one say how BIG the thief was?', 'Think of the prints.'], flag: 'fx15Big', next: 'n' } },
    // the stash's twin, and the other: only its `else` reaches it (as chapter 10's twins and chains of counted conditions)
    n: { when: { fx15Big: 'stash' }, else: 'n2', scene: { set: 'island', cam: 'case', cast: [c('player', 'sit', 'speak'), c('sloshbank', 'sit', 'front-1')], fx: ['night'] }, say: [{ who: 'sloshbank', text: 'OURS?' }], sfx: 'Drip.', next: 'n3' },
    n2: { scene: { set: 'island', cam: 'case', cast: [c('player', 'sit', 'speak')], fx: ['night'] }, say: [{ who: 'player', text: 'Tiny prints.' }], next: 'n3' },
    n3: { scene: { set: 'island', cam: 'wide', opts: { crowd: true }, cast: [c('glintstar', 'sit', 'root-2'), c('player', 'sit', 'centre'), c('tallyheart', 'sit', 'crowd-1')], fx: ['night'] },
      say: [{ who: 'glintstar', text: 'I said bring it.', when: { not: { fx15Big: 'my-count' } } }, { who: 'player', text: 'Four a night, for six nights: twenty-four.' }], counts: { set: 'fx15-sixty', next: 'o' } },
    o: { scene: { set: 'island', cam: 'fox', cast: [c('snatch', 'point', 'weasel-1', { glow: true, holds: 'mouse' }), c('snip', 'hidepaws', 'weasel-2'), c('reynard', 'sit', 'fox')], fx: ['night'] }, caption: ['And then it ALL tumbles out.'],
      ask: { who: 'snatch', to: 'snip', prompt: '**Tap** the weasels.', label: 'Hear the next bit.', pairs: [['Two each, every night, he said!', 'Up the TUNNEL!'], ['Keep it TIDY!', 'Leave the shiny bit by the pile!']], next: 'p' } },
    p: { scene: { set: 'island', cam: 'fox', opts: { crowd: 'standing' }, cast: [c('reynard', 'swim', 'water', { wet: true }), c('snip', 'swim', 'water-2', { wet: true }), c('snatch', 'swim', 'water-3', { wet: true })], fx: ['night'] }, sfx: 'BYE, GIANT SQUIRREL!', sfxRead: 'Bye, giant squirrel!', next: 'q' },
    q: { scene: { set: 'island', cam: 'mist', opts: { mist: 'rolling', tap: 'mist' }, cast: [c('player', 'sit', 'speak', { facing: 'right' }), c('sprinkle', 'sniff', 'beside', { facing: 'right' }), c('tallyheart', 'sit', 'mentor', { facing: 'right' })], fx: ['night'] },
      say: [{ who: 'sprinkle', text: 'That’s MY mist.' }], scratch: { tap: 'mist', prompt: '**Tap** the mist.', label: 'Look at the mist.', next: 'r' } },
    r: { scene: { set: 'island', cam: 'mist', opts: { mist: 'thick', tail: true }, cast: [c('mistscale', 'lean', 'mama', { variant: 1, mood: 'kind' })], fx: ['night'] }, say: [{ who: 'mistscale', name: 'A soft voice', text: 'Sprinkle?' }], next: 's' },
    s: { scene: { set: 'island', cam: 'mist', opts: { mist: 'thick', grown: true, small: 'some' }, cast: [c('mistscale', 'lift', 'mama', { variant: 1, mood: 'kind' }), c('sprinkle', 'sit', 'nose'), c('player', 'sit', 'speak', { facing: 'right' })], fx: ['night'] },
      say: [{ who: 'mistscale', name: 'Mama', text: 'Forepaws UP.' }],
      skip: { table: 5, groups: 3, teacher: 'mistscale', thing: 'claw', things: 'claws', label: 'Count the next forepaw.', prompt: '**Tap** each forepaw.', carry: false, who: ROLL, next: 't' } },
    t: { scene: { set: 'island', cam: 'case', opts: { crowd: true, mist: 'thick', small: 'coming' }, cast: [c('player', 'sit', 'speak', { facing: 'right' }), c('squall', 'roar', 'beside', { tap: 'nose' })], fx: ['night'] }, say: [{ who: 'squall', text: 'GOODBYE!' }], sfx: 'Hic!',
      scratch: { tap: 'nose', prompt: '**Tap** to say goodbye.', label: 'Say goodbye.', next: 'u' } },
    u: { scene: { set: 'island', cam: 'mist', opts: { mist: 'thick', grown: true }, cast: [c('mistscale', 'bow', 'eldest', { variant: 2, mood: 'kind' }), c('groveclan', 'sit', 'front-1', { variant: 1, facing: 'right' }), c('player', 'crouch', 'speak', { facing: 'right', mood: 'proud', tap: 'nose' })], fx: ['night'] },
      caption: ['The eldest bows low to you.'], scratch: { tap: 'nose', prompt: '**Tap** to bow back.', label: 'Bow back.', next: 'v' } },
    v: { scene: { set: 'island', cam: 'paws', cast: [c('player', 'sit', 'close', { tap: 'paw' }), c('sprinkle', 'lookdown', 'above', { holds: 'pebble' })], fx: ['night'] }, say: [{ who: 'sprinkle', text: 'This is for you.' }],
      scratch: { tap: 'paw', prompt: '**Tap** to hold out your paws.', label: 'Hold out your paws.', next: 'w' } },
    w: { scene: { set: 'island', cam: 'paws', cast: [c('player', 'sit', 'close', { holds: 'miststone', flash: true, tap: 'stone' })], fx: ['night'] }, caption: ['And it FLASHES.'],
      scratch: { tap: 'stone', prompt: '**Tap** to tilt it.', label: 'Tilt the stone.', next: 'x' } },
    x: { scene: { set: 'island', cam: 'sky', opts: { rising: true, zip: true, grown: true }, cast: [c('sprinkle', 'fly', 'far')], fx: ['night'] }, caption: ['Then they are gone.'], next: 'y' },
    y: { scene: { set: 'island', cam: 'shore', opts: { print: true, ferry: true, tap: 'print' }, cast: [c('player', 'crouch', 'print', { mood: 'sniff' }), c('otter', 'sit', 'raft', { variant: 3 })], fx: ['night'] },
      say: [{ who: 'otter', text: 'Badger. An old track.' }], scratch: { tap: 'print', prompt: '**Tap** to sniff it, very carefully.', label: 'Sniff the print.', next: 'y2' } },
    y2: { scene: { set: 'riverbank', cam: 'roof', opts: { moon: 14, roar: true, flyer: true }, fx: ['night'] }, caption: ['One last roar.'], next: 'y3' },
    y3: { scene: { set: 'tower', cam: 'up', opts: { moon: 14, chime: true, light: true }, cast: [c('player', 'pawup', 'foot', { tap: 'paw' }), c('waffles', 'peer', 'railing', { mood: 'dreamy' })], fx: ['night'] }, say: [{ who: 'waffles', text: 'I have to lie DOWN.' }], next: 'y4' },
    y4: { scene: { set: 'den', cam: 'nest', opts: { weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true, glass: true }, cast: [c('player', 'crouch', 'nest', { holds: 'miststone', holdAt: 'paws', tap: 'stone' })], fx: ['night'] },
      caption: ['Ten claw marks on the tree.'], gift: 'mist-stone', scratch: { tap: 'stone', prompt: '**Tap** to lay the mist stone on the moss.', label: 'Lay the stone on the moss.', next: 'z' } },
    z: { scene: { set: 'den', cam: 'stone', opts: { miststone: 'flash', moon: 14 }, cast: [c('player', 'curl', 'tail', { asleep: true })], fx: ['night'] }, caption: ['On the moss, your mist stone flashes.'], end: true }
  }, cards: {}, counts: {
    'fx15-sevens': Object.assign({}, CLUTCH, { label: 'Clutches of seven', hollowThings: 'sevens', prompt: 'How many dragonets?', fillOrder: 'easiest',
      facts: [{ a: 2, b: 7, prompt: 'Two clutches.', retryPrompt: true }, [7, 3], { a: 7, b: 7, lit: 42, prompt: 'Seven clutches. Six sevens is forty-two. One more seven…', retryPrompt: true, right: [T('Forty-nine! The new one.')], rightAgain: true }],
      praise: ['Seven more, every time!'], helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.', done: 'That’s the sevens.' }),
    'fx15-ferry': { table: 2, thing: 'leg', things: 'legs', teacher: 'tallyheart', ask: '{a} × {b}', ground: 'log',
      facts: [{ a: 8, b: 1, table: 1, prompt: 'Tails! Eight cats.', retryPrompt: true, right: [{ who: 'murmurchime', text: 'Eight!' }], rightAgain: true },
        { a: 9, b: 4, table: 4, prompt: 'Paws! Nine cats.', retryPrompt: true, right: [{ kind: 'caption', text: 'Thump! Granny bangs her pole.' }, { who: 'otter', variant: 3, text: 'Thirty-six!' }], rightAgain: true },
        { a: 6, b: 8, table: 8, prompt: 'Spiders’ legs! Six spiders.', retryPrompt: true },
        { a: 4, b: 6, table: 6, picture: { kind: 'cheeks' }, prompt: 'Whiskers! Four cheeks.', retryPrompt: true },
        { a: 7, b: 7, table: 7, picture: { kind: 'marks', ground: 'log' }, prompt: 'And the new one. Seven sevens!', retryPrompt: 'Seven sevens!' }],
      praise: [], helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.', done: null },
    'fx15-sixty': { table: 10, thing: 'fish', things: 'fish', unit: 'night', units: 'nights', teacher: 'tallyheart', ask: '{a} × {b}', picture: { kind: 'marks' },
      facts: [{ a: 10, b: 6, prompt: [], retryPrompt: [{ who: 'player', text: 'And a dragon who eats ten fish a meal, for six nights?' }], right: [{ who: 'player', text: 'SIXTY!' }], rightAgain: true }],
      help: 'picture', helpIntro: 'Close. Let’s hop it together.', helpIntroFar: 'Let’s hop it together.', praise: [], done: null }
  } };
}
const writeFixture = (dir, story) => {
  const file = path.join(dir, story.id + '.js');
  fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.' + story.id + ' = ' + JSON.stringify(story) + ';\nmodule.exports = PC;\n');
  return file;
};

test('its words for chapter 10’s art and keys: the Moon Ferry and Gathering Island (every camera used, their spots, dusk and the moonlit night), the full moon over the den, the tower and the riverbank, the mist stone and its close-up, the ten marks; the grown Mistscales, the leaders by variant, Granny by the chapter’s name, Puddle’s eyes, Reynard’s bow, the swim, wet fur, the hidden paws, the stone held and tapped, the dragonets’ snouts; the clutches and the sand at the 7s, the mixed Moon Ferry Counts on a log, an empty prompt, the roll call’s forepaws with shapes; the two weasels’ ask; the card pick and a `when` that reads it', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const md = generate(writeFixture(tmp, fixture10()), tmp);
    const panel = id => md.split('\n### ' + id + ' · panel ')[1].split('\n### ')[0];
    // the clutches: five in the sand by sevens; the lesson's clutches, its step-off, its sand four and three
    assert.match(panel('b'), /\*\*Then she counts by 7s on the clutches\*\* \(the skip-count\): five clutches of seven little dragonets, each a row of four over a row of three \(four sisters and three brothers\), [^\n]*\(in play they take the panel\); 5 taps, one on each clutch in turn \(the next one glows; a tap anywhere else makes it wiggle\), each lighting its seven dragonets, the row of four and then the row of three, and putting its running total under it and in Tallyheart’s balloon: 7, 14, 21, 28, 35\. Nothing can be got wrong, and nothing is logged\. The last tap turns the page to c, which does not show the number\. The instruction under the panel: “Tap the clutches\.”/);
    assert.match(panel('c'), /\*\*Then the Counts lesson\*\* `fx15-sevens` \(dragonets, clutches of seven little dragonets, each a row of four over a row of three [^\n]*lit a dragonet at a time \(a clutch’s top four, then its bottom three\)\): 2 × 7 \(its own question, kept on its retry\), 7 × 3, 7 × 7 \(its first six clutches lit as it is asked \(42\); its own question, kept on its retry; its own lines after a right answer; its own lines after a right retry\)\./);
    assert.match(panel('c'), /a miss gets the sand count \(seven marks for every clutch, scratched four and three with a gap between, hopped by sevens from the first\) and comes back two questions later/);
    assert.match(panel('c'), /- In the Training Hollow: its button reads “Clutches of seven · the 7s”, and Tallyheart calls it “sevens”\./);
    // the den by morning under the full moon, the mist stone on the moss; the tree's ten marks
    assert.match(panel('a'), /Also: clear weather; the moon full and round, fourteen evenings old; the mist stone on the moss of her nest, beside her glass in its leaf and the corners of her secret bark: a smooth grey pebble, egg-shaped, the size of her paw\./);
    assert.match(panel('d'), /Also: ten claw marks on the trunk, in rows of four, four and two: one for every Count;/);
    // the Moon Ferry: its place words at dusk and by night, its cameras, its spots, its options, Granny by name
    assert.match(panel('e'), /\*\*Scene\.\*\* Ferry: the otters’ Moon Ferry, a line of log rafts on the moonlit river, at dusk, rose and lilac light on the water, the moon just up \(logs lashed with reeds, [^\n]*never black[^\n]*every otter in it is cast, never drawn by the set\)\. Camera: the Crossing’s edge at dusk: [^\n]*the full moon rising \(`shore`\)\. Cast: you \(walking, happy, at the stones’ edge by the front raft, about to step aboard, facing right, the front paw, mid-step, is what she taps\); Granny, the old otter who poles the Moon Ferry \(standing up on her hind legs, kind, standing at the front raft’s far end with the long pole, facing left, holding the raft’s long pole\); Riffle, the otter pup \(hopping on the spot, shouting, just aboard, on the front raft’s near logs, facing left\)\. Also: the full moon, round and bright, wherever the sky or the water shows it; the rest of CrystalClan seated along the logs of the front raft and the rafts behind, small, in their coats\. Effects: dusk\./);
    assert.match(panel('e'), /- \*\*Granny \(An otter\)\*\*: “Hop on, little one\.”/);
    assert.match(panel('f'), /Ferry: [^\n]*at night, by the light of the full moon \([^\n]*Camera: close on the very back of the front raft: the heap of reeds \(the luggage\)[^\n]*\(`back`\)\. Cast: Riffle, the otter pup \(a paw over his mouth, happy, beside the heap of reeds, facing left\); Tallyheart \(looking up, happy, at the raft’s back end, left of the heap, first, facing right\); Granny, [^\n]*\(sitting, kind, at the raft’s back end, left of the heap, third, facing right\)\. Also: [^\n]*; the heap of reeds at the back of the front raft \(the luggage\), round and lumpy, nothing of Sprinkle showing; a little cloud of mist puffing out of the heap of reeds\./);
    assert.match(panel('g'), /Camera: at cat height on the front raft’s logs, close: [^\n]*\(`low`\)\. Cast: Puddle, a Mistscale dragonet [^\n]*\(only his two big round eyes and the top of his head above the silver water, a ring of ripples round them, happy, in the silver water between two logs \(no ground shadow: the set draws its rings\), facing left\); you \(pressed flat, happy, lying flat on the logs at the gap’s edge, chin over it, facing right\); [^\n]*Also: [^\n]*the front raft riding low: the water lapping right at the logs’ tops, never over them\./);
    assert.match(panel('g'), /- \*\*Two big eyes \(Puddle\)\*\*: “Hello\.”/);
    assert.match(panel('h'), /Camera: looking straight down into the gap between two logs: [^\n]*never dark \(`under`\)\. Cast: [^\n]*in the silver water in the middle of the gap \(no ground shadow\)[^\n]*you \(peering, happy, at the gap’s top edge, looking down: head and forepaws, the rest cut off by the edge, facing right\)/);
    assert.match(panel('i'), /Camera: aboard the front raft, from its back end looking forward, upriver: [^\n]*\(`deck`\)\. Cast: you \(sitting, happy, mid-raft at the left, facing right\); Tallyheart \(sitting, happy, mid-raft, beside her, facing right\); Granny, [^\n]*standing at the front end with her pole, against the moonlit river,[^\n]*Murmurchime, the tortoiseshell warrior \(sitting, happy, seated along the raft’s logs, in the first of six seats \(three down each side, the near ones bigger\), facing left\)\./);
    // the Moon Ferry's Counts: every Count mixed, each fact its own picture, the help on a log in each Count's steps
    assert.match(panel('i'), /\*\*Then the Counts lesson\*\* `fx15-ferry` \(every Count mixed, each fact in its own Count’s picture\): 8 × 1 \(from the 1s; drawn as eight cats’ tails; [^)]*\), 9 × 4 \(from the 4s; drawn as nine cats side-on, standing, four paws each, five to a row; [^)]*\), 6 × 8 \(from the 8s; drawn as six spiders from above, eight legs each, four on each side; [^)]*\), 4 × 6 \(from the 6s; drawn as four cheeks close up, six whiskers on each, three on top and three below; [^)]*\), 7 × 7 \(from the 7s; drawn as seven rows of seven marks scratched on a log’s top, each row four and three with a gap, lit in order; its own question, and another of its own on its retry\)\./);
    assert.match(panel('i'), /a miss gets the fact’s own Count scratched on a log of the raft and hopped together in its own steps \(the 1s one by one; the 4s by fours, two and two; the 8s by eights, four and four; the 6s by sixes, three and three; the 7s by sevens, four and three\), and comes back two questions later\./);
    assert.match(panel('i'), /- After 9 × 4, right the first time:\n {2}- \*Caption\*: Thump! Granny bangs her pole\.\n {2}- \*\*Granny \(An otter\)\*\*: “Thirty-six!”/);
    assert.match(panel('i'), /- Asking 7 × 7 again after a miss:\n {2}- \*\*Tallyheart\*\*: “Here’s that one again\. Seven sevens!”/);
    // Gathering Island: the clearing, the leaders by variant (labels only), the crowd, the reed heap tapped
    assert.match(panel('j'), /\*\*Scene\.\*\* Island: Gathering Island, a round island in the river, at night under the full moon, high and bright silver, never dark \(one great tree in the middle, [^\n]*never in the branches[^\n]*\)\. Camera: wide: the clearing under the great tree, every Clan: [^\n]*\(`wide`\)\. Cast: ReedClan’s leader \(big, broad and grand: [^\n]*\) \(sitting, happy, on the great tree’s left root, facing right\); GroveClan’s leader \(tall and lean: [^\n]*\) \(sitting, happy, on the great tree’s right root, facing left\); the ReedClan she-cat [^\n]*at the front of the ring, ReedClan’s side, second, [^\n]*Also: every Clan in a wide ring round the clearing, small seated cats in their Clans’ coats [^\n]*; the reed heap \(the luggage\), round and lumpy; the heap of reeds over the luggage is what she taps\./);
    assert.match(panel('j'), /- \*\*ReedClan’s leader\*\*: “THAT’S the dragon\?”\n- \*\*GroveClan’s leader\*\*: “Who is Princess Waffles\?”/);
    assert.match(panel('j'), /\*\*Then she taps the heap of reeds over the luggage\*\* \(one tap, on this scene\)/);
    // the fox: his bow, wet; the weasels wet, Snatch's mouse
    assert.match(panel('k'), /Camera: close on the fox at the clearing’s edge, the river behind him; [^\n]*\(`fox`\)\. Cast: Reynard, the fox [^\n]*\(a low sweeping bow, one forepaw forward, his tail flourished up behind: charming, vain, happy, at the clearing’s edge, the river behind, facing left, wet through: a little darker, the fur flattened and spiky at its edges, two or three drips falling\); Snip, [^\n]*at the fox’s heels, first, facing left, wet through[^\n]*Snatch, [^\n]*at the fox’s heels, second, facing left, a mouse in the mouth \(eyes shut, its tail dangling\), wet through/);
    // the card pick, as the spec words it (section 6, "The storyboard words"), and where a right pick turns the page
    assert.ok(panel('k').includes('**Pick a card.** Her Case File opens over the panel, every card face up as her file lays them, under Reynard’s claim “It FLEW out of your camp!” (FLEW lit). Right: Sprinkle can’t fly. (`cant-fly`), Reynard calls ‘It FLEW off’ his little story. He wants the dry den. (`fox-brag`), Mizzle says Sprinkle’s wing was hurt before the rain stopped. (`mizzle-wing`, a card only some cats hold). The fox’s own card (`fox-flew`): “Hmm. That’s what HE says. Which card shows what YOU found out?” Any other card: “Hmm. Does that one say if Sprinkle could FLY?” A second wrong card: “Think of Sprinkle, under the bridge. Could she fly?” After a third, the right cards she holds glow. Her pick is remembered (`fx15Flew`). A right pick turns the page to l.'), panel('k'));
    assert.match(panel('m'), /under Reynard’s claim “Only something BIG could take so much!” \(BIG lit\)\. Right: The weasels have a stash: our prey, and ReedClan’s\. \(`stash`\), [^\n]*\(`tunnel`\), [^\n]*\(`my-count`, a card only some cats hold\)\. Any other card: “Hmm\. Does that one say how BIG the thief was\?” A second wrong card: “Think of the prints\.”/);
    // a `when` that reads a pick's flag: the card's whole line; a list of cards; a `not` of one, "unless"; a frame's
    assert.match(panel('l'), /- \*\*You\*\*: “Sprinkle can’t fly!” \*\(only if she answered with “Sprinkle can’t fly\.”\)\*/);
    assert.match(panel('l'), /- \*\*You\*\*: “Mizzle saw her wing\.” \*\(only if she answered with “Mizzle says Sprinkle’s wing was hurt before the rain stopped\.”\)\*/);
    assert.match(panel('l'), /- \*\*Sprinkle\*\*: “I couldn’t even FLAP\.” \*\(unless she answered with “Reynard calls ‘It FLEW off’ his little story\. He wants the dry den\.”\)\*/);
    assert.match(panel('l'), /Also: [^\n]*a little cat scratched in the earth in front of the dragonet beside her: four legs, two ears and a tail\./);
    assert.match(panel('n'), /^14\n\n\*\*Shot\.\*\* \(no board written\)\n\n\*\*Shows only if\*\* she answered with “The weasels have a stash: our prey, and ReedClan’s\.”; otherwise the page turns straight on to n2\./);
    assert.match(panel('n3'), /- \*\*Glintstar\*\*: “I said bring it\.” \*\(unless she answered with “My count: [^”]*”\)\*/);
    // the sixty's empty prompt: the frame's own balloons ask it
    assert.match(panel('n3'), /10 × 6 \(no words of its own: the frame’s balloons ask it, and its own question on its retry;[^\n]*\n[\s\S]*- Asking 10 × 6: no more words \(the frame’s own balloons, said again over the question, ask it\)\.\n- Asking 10 × 6 again after a miss:\n {2}- \*\*Tallyheart\*\*: “Here’s that one again\.”\n {2}- \*\*You\*\*: “And a dragon who eats ten fish a meal, for six nights\?”/);
    // the two weasels' ask: two balloons a tap, his and hers
    assert.match(panel('o'), /Snip, the weasel sister [^\n]*\(standing up, the tiny forepaws hidden behind the back, eyes wide and innocent, happy, at the fox’s heels, second, facing left\)/);
    assert.match(panel('o'), /\*\*Then she taps the weasels, once for each pair of lines\*\* \(two taps, on this scene, counting nothing\): Snatch glows softly; a tap on him letters his next line in his balloon and Snip’s in hers, two balloons a tap, by turns, and the scene stays as it is; [^\n]*After the last one: Next → p\. The instruction under the panel: “Tap the weasels\.” For VoiceOver, a hidden button: “Hear the next bit\.”\n\n1\. \*\*Snatch\*\*: “Two each, every night, he said!” \*\*Snip\*\*: “Up the TUNNEL!”\n2\. \*\*Snatch\*\*: “Keep it TIDY!” \*\*Snip\*\*: “Leave the shiny bit by the pile!”/);
    // off the island: the swim, the crowd on its feet, the dogs' goodbye said in words
    assert.match(panel('p'), /Reynard, [^\n]*\(swimming away: only his head and the line of his back above the water, ears flat, his tail floating behind \(no splash at anyone\), happy, in the river, swimming away, first \(no ground shadow\), facing left, wet through[^\n]*Snip, [^\n]*\(swimming, the head up, paddling after the fox, [^\n]*Also: every Clan in the ring on its feet: every cat and every otter standing\./);
    // the mist, Mama, her tail, the roll call with the clutch's shapes in her count
    assert.match(panel('q'), /Camera: the clearing’s edge by the great tree, the mist rolling in off the river: [^\n]*\(`mist`\)\. Cast: you \(sitting, happy, at the left, facing the mist, facing right\); Sprinkle, [^\n]*\(sniffing, happy, on the grass beside her, facing the mist, facing right\); Tallyheart \(sitting, happy, behind her at the left, facing right\)\. Also: the mist coming up the river: [^\n]*; the soft silver bank of mist is what she taps\./);
    assert.match(panel('q'), /\*\*Then she taps the soft silver bank of mist rolling in\*\*/);
    assert.match(panel('r'), /Cast: Mama, Sprinkle’s mother, a grown Mistscale \(huge, gentle and misty, never frightening: [^\n]*no teeth, no claws shown\) \(her great face leaning out of the mist, kind, out of the mist at the right, the face about two cats tall, facing left\)\. Also: the mist thick round the great tree too, [^\n]*; the tip of a huge, soft grey tail curling through the mist\./);
    assert.match(panel('r'), /- \*\*A soft voice \(Mama\)\*\*: “Sprinkle\?”/);
    assert.match(panel('s'), /\(her great head lifted high, the mouth a little open in a call \(no teeth\), kind,[^\n]*Sprinkle, [^\n]*\(sitting, happy, on the grass under Mama’s lowered nose, facing left\)[^\n]*Also: [^\n]*; the other grown Mistscales, great soft grey shapes in the mist: gentle, no faces, no teeth or claws; three or four small dragonet shapes in the mist, grey, soft and faceless\./);
    assert.match(panel('s'), /\*\*Then she counts the clutch’s forepaws\*\* \(the skip-count, by 5s\): three forepaws raised in one row, the clutch in a row \(in play they take the panel\), one for each of these that is hers, in order: Sprinkle, small behind a raised forepaw of her own; Squall, small behind a raised forepaw of his own \*\(only if foundSquall is true\)\*; a soft grey dragonet shape, faceless, in a wisp of mist, behind a misty grey forepaw whose five claws light pale silver \*\(only if foundSquall is false or not set\)\*; Hail, small behind a raised forepaw of her own \*\(only if foundHail is true\)\*; [^\n]*; 3 taps, one on each forepaw in turn [^\n]*putting the running total in Mama’s balloon: 5, 10, 15\. Nothing can be got wrong, and nothing is logged\. The last tap turns the page to t, which does not show the number\./);
    // a dragonet's goodbye tapped on the snout; the eldest's bow, bowed back
    assert.match(panel('t'), /Squall, the littlest dragonet [^\n]*\(head back, roaring, his mouth a round O, happy, at her right, between her and the fox, facing left, the snout is what she taps\)\. Also: [^\n]*small dragonet shapes stepping out of the mist toward her, still misty\./);
    assert.match(panel('t'), /\*\*Then she taps Squall’s snout\*\*/);
    assert.match(panel('u'), /Cast: the eldest Mistscale \(as big as Mama, [^\n]*never silver-white; no teeth, no claws shown\) \(the head bowed all the way down to the grass, eyes closed, the neck a long curve, kind, lower and further right, out of the mist, the face bowing to the grass, facing left\)/);
    assert.match(panel('u'), /\*\*Then she taps her own nose\*\*/);
    // her paws, the pebble over them, the mist stone flashing
    assert.match(panel('v'), /Camera: close on our cat’s forepaws held out on the moonlit grass, [^\n]*\(`paws`\)\. Cast: you \(sitting, happy, close in front, the forepaws and chest filling the lower panel, facing left, her two forepaws, held out, are what she taps\); Sprinkle, [^\n]*\(leaning down from above, looking down, happy, leaning down from the top right, her claws over the paws below, facing left, holding her plain grey pebble, smooth as an egg\)\./);
    assert.match(panel('v'), /\*\*Then she taps her own two forepaws, held out in the moonlight\*\*/);
    assert.match(panel('w'), /the mist stone held out in her two forepaws: a smooth grey pebble, egg-shaped, the size of her paw, flashing blue and green in the moonlight \(a band of blue and green light across its face, the rest still grey\), the mist stone is what she taps\)/);
    assert.match(panel('w'), /\*\*Then she taps the mist stone in her paws\*\*/);
    // the sky, the shore and the badger's print, the walk home, Waffles by night
    assert.match(panel('x'), /Island: the sky over Gathering Island, at night under the full moon, high and bright silver, never dark \(the full moon, the great tree’s crown, the top edge of the mist\)\. Camera: looking up past the great tree’s crown into the sky, for the flight and the leaving \(`sky`\)\. Cast: Sprinkle, [^\n]*far up the river, small, in the air, facing left\)\. Also: the Mistscales rising into the mist and away upriver, [^\n]*; one small winged shape zipping off the other way, toward the towers far downriver, a little ring of hiccup mist behind it; the other grown Mistscales/);
    assert.match(panel('y'), /Island: Gathering Island’s shore, at night under the full moon, [^\n]*\(`shore`\)\. Cast: you \(crouching, sniffing, on the mud beside the badger’s print, facing left\); Granny, [^\n]*at the Moon Ferry’s front, at the water’s edge, facing left\)\. Also: the badger’s old track in the mud: one big print, a wide pad and five toes in a row, long digging claw marks, old and dry at its edges, in bright moonlight \(never fresh, and never the animal\); the Moon Ferry’s front raft at the water’s edge; the badger’s print is what she taps\./);
    assert.match(panel('y'), /\*\*Then she taps the badger’s big old print in the mud\*\*/);
    assert.match(panel('y2'), /Riverbank: the river path below a muddy bank, at night [^\n]*Also: the full moon over the towers, and under it the river silver, moonlight on its ripples \(never the black water of a dark night\); the path pale in the moonlight; jagged sound lines from the tower roof; a small winged shape flying off upriver across the sky by the red light, slate-dark, wings out, a tiny ring of hiccup mist behind it\./);
    assert.match(panel('y3'), /Tower: outside, looking up a glass tower, at night, the glass dark blue against a starry sky, many windows lit warm gold, [^\n]*Also: the full moon high over the towers;/);
    // bedtime: the stone laid on the moss (a gift), and the close-up on it, her tail's tip
    assert.match(panel('y4'), /the mist stone in one forepaw over the moss: a smooth grey pebble, egg-shaped, the size of her paw, the mist stone is what she taps\)/);
    assert.match(panel('y4'), /\*\*Gift:\*\* Sprinkle’s mist stone: grey, until the moonlight finds it \(from Sprinkle, `mist-stone`\)/);
    assert.match(panel('z'), /Camera: extreme close on the moss at her nest’s edge in the moonlight from the doorway: the mist stone big in the middle, [^\n]*\(`stone`\)\. Cast: you \(curled up, happy, curled at the panel’s bottom edge: only her tail’s tip, facing left, eyes shut: asleep\)\. Also: [^\n]*flashing blue and green in the moonlight from the doorway [^\n]*; the moon full and round, fourteen evenings old\./);
    // at a glance: the picks a row of their own, never among the things she taps
    assert.match(md, /\| Card picks \| 2 \(k, m\) \|/);
    const taps = md.split('\n').find(l => l.startsWith('| Other things she taps |'));
    assert.match(taps, /the heap of reeds over the luggage \(j\), the weasels’ two pairs of lines \(o\), the soft silver bank of mist rolling in \(q\), Squall’s snout \(t\), [^|]*the badger’s big old print in the mud \(y\)/);
    assert.doesNotMatch(taps, /\((k|m)\)/);
    assert.doesNotMatch(md, /Not reachable from the start/);
    // every new name has words: none prints as its bare id, no pose as its bare name
    assert.doesNotMatch(md, /\[object Object\]|undefined|Set: |Camera: (shore|deck|back|low|under|river|wide|roots|case|fox|mist|sky|paws|stone|tree) \(|\bat (bank-\d|edge|log-\d|pole|seat-\d|front|beside|back|heap|back-\d|gap|lie|sit-\d|water|lip|raft-\d|land-\d|raft|drag|print|root-\d|crowd-\d|elder|centre|edge-\d|bank|luggage|step|near-\d|speak|mentor|root|fox|weasel-\d|front-\d|water-\d|mama|eldest|nose|fly|far|close|above|tail)\b|(?<![-\w])(clan|luggage|puff|low|home|crowd|ferry|print|mist|tail|grown|small|rising|zip|drawing|bubbles|tap|miststone|flyer|moon|marks): (true|false|"|\[|\d)/, 'every new name has words');
    assert.doesNotMatch(md, /\((lean|nuzzle|lift|bow|hidepaws|swim|eyes), /, 'no pose prints as its bare name');
    assert.doesNotMatch(md, /the old tom’s nose|Sprinkle’s little cloud of mist is what|the nearest of Sprinkle’s big prints|the head, turned into the gap|tiny Clan cats in the garden|crowded round the fountain|two nostrils and a string of bubbles|standing up on his hind legs, kind/, 'chapter 10’s names never read as an older chapter’s');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

/* Chapter 10's card pick in the tool's own graph (the spec's section 6, "The tool's own graph"): `exits(f)` follows a pick
 * to its `next`, so the reading order, the panel counts and the read-through run through it, and the stash twin's `when`
 * on its flag is a reader of its own; the picks have their own row at a glance. On the stub (no pick yet) a fixture with
 * picks stands in; once chapter 10 has one, its own storyboard is held to it too. */
test('chapter 10’s card picks are followed by the storyboard’s own graph: everything after a pick is reachable, read in order and counted; docs/storyboard/ch10.md never lists a frame as “Not reachable from the start” once a pick frame exists', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const story = fixture10();
    const md = generate(writeFixture(tmp, story), tmp);
    assert.doesNotMatch(md, /Not reachable from the start/);
    const order = (md.match(/^### [a-z0-9]+ · panel \d+$/gm) || []).map(l => l.split(' ')[1]);
    assert.deepEqual(order.slice(9, 18), ['j', 'k', 'l', 'm', 'n', 'n2', 'n3', 'o', 'p'], 'the pages after each pick are read in order, on the main line, the twin only an else reaches right after the frame whose else it is');
    assert.equal(order.length, 31, 'every frame boarded');
    assert.match(md, /\| Frames \| 31 \(31 on the main line, 0 in branches\) \|/);
    // n and n2 are twins by the pick's flag: a frame `when` on it is a reader of its own (with "stash", or any other card)
    assert.match(md, /\| One read-through \| 30 panels, depending on her choices \|/);
    assert.match(md, /\| Card picks \| 2 \(k, m\) \|/);
    // without the pick in the graph every frame after it would be lost: the tool's own exits read `pick`
    const src = fs.readFileSync(TOOL, 'utf8');
    assert.match(src, /if \(f\.ask\) return \[f\.ask\.next\];\n(\s*\/\/[^\n]*\n)?\s*if \(f\.pick\) return \[f\.pick\.next\];\n\s*return f\.next \? \[f\.next\] : \[\];/);
    // a read-through still counts a frame shown only by a flag read as true or false: both kinds of reader walk it
    const two = { id: 'fx16', number: 16, title: 'Two', start: 'a', frames: {
      a: { next: 'b' }, b: { when: { foundSquall: true }, else: 'c', next: 'c' }, c: { when: { foundSquall: false }, else: 'd', next: 'd' },
      d: { when: { foundHail: true }, else: 'e', next: 'e' }, e: { end: true } }, counts: {} };
    const md2 = generate(writeFixture(tmp, two), tmp);
    assert.match(md2, /\| One read-through \| 3–4 panels, depending on her choices \|/);
    // a chain of counted conditions, each frame's `else` the next (the roll call's): every one boarded, in the chain's order
    const chain = { id: 'fx17', number: 17, title: 'Chain', start: 'a', frames: {
      a: { next: 'b1' }, b1: { when: { foundSquall: true, foundHail: false }, else: 'b2', next: 'g1' }, b2: { when: { foundSquall: false, foundHail: true }, else: 'b3', next: 'g2' },
      b3: { when: { not: { foundSquall: false, foundHail: false } }, else: 'h', next: 'g1' }, g1: { when: { foundSquall: true }, next: 'g2' }, g2: { when: { foundHail: true }, next: 'h' },
      h: { when: { foundSquall: true, foundHail: true }, else: 'h2', next: 'z' }, h2: { next: 'z' }, z: { end: true } }, counts: {} };
    const md3 = generate(writeFixture(tmp, chain), tmp);
    assert.deepEqual((md3.match(/^### [a-z0-9]+ · panel \d+$/gm) || []).map(l => l.split(' ')[1]), ['a', 'b1', 'b2', 'b3', 'g1', 'g2', 'h', 'h2', 'z']);
    assert.doesNotMatch(md3, /Not reachable from the start/);
    assert.match(md3, /\| Frames \| 9 \(9 on the main line, 0 in branches\) \|/);
    assert.match(md3, /\| One read-through \| 3–6 panels, depending on her choices \|/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  // the real chapter, once it has a pick frame
  const real = require(path.join(ROOT, 'app/story/ch10.js'));
  const ch10 = ((real && real.story) || {}).ch10;
  if (ch10 && Object.values(ch10.frames).some(f => f && f.pick)) {
    const board = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch10.md'), 'utf8');
    assert.doesNotMatch(board, /Not reachable from the start/);
    const picks = Object.keys(ch10.frames).filter(id => ch10.frames[id].pick);
    assert.ok(board.includes('| Card picks | ' + picks.length + ' (' + picks.join(', ') + ') |'), 'its own row at a glance');
    picks.forEach(id => assert.ok(board.includes('Her pick is remembered (`' + ch10.frames[id].pick.flag + '`).'), id));
  }
});

test('its words cover the art’s whole vocabulary: every set (with its time of day), camera, anchor, option value, pose, mood, effect, cast member and cast extra', () => {
  const run = spawnSync(process.execPath, [TOOL, '--check-words'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /^Every set, camera, anchor, option, pose, mood, effect, cast member and cast extra has words\.$/m);
  // the check reads the cast extras the art names (chapter 5: `PC.art.vocab.extras`), each value of each
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.match(src, /Object\.keys\(v\.extras \|\| \{\}\)\.forEach\(k => \(v\.extras\[k\] \|\| \[\]\)\.forEach\(val => \{\n\s+if \(!castExtraWords\(\{ who: 'player', pose: 'sit', \[k\]: val \}\)\.length\) missing\.push\('cast extra ' \+ k/);
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
    // (chapter 12: the tool requires module 2's words beside the engine; words.js is never taken for a chapter)
    fs.copyFileSync(path.join(ROOT, 'app/story/words.js'), path.join(tmp, 'app/story/words.js'));
    for (const f of chapters) fs.copyFileSync(path.join(ROOT, 'app/story', f), path.join(tmp, 'app/story', f));
    const run = spawnSync(process.execPath, [path.join(tmp, 'tools/storyboard.mjs')], { encoding: 'utf8', cwd: tmp });
    assert.equal(run.status, 0, run.stderr);
    for (const f of chapters) {
      const id = path.basename(f, '.js');
      const md = fs.readFileSync(path.join(tmp, 'docs/storyboard', id + '.md'), 'utf8');
      assert.match(md, new RegExp(id === 'warrior' ? '^# Storyboard: The Warrior Counts\\n' : '^# Storyboard: Chapter \\d+, '), id);
      assert.match(run.stdout, new RegExp('Wrote docs/storyboard/' + id + '\\.md'));
    }
    assert.ok(!fs.existsSync(path.join(tmp, 'docs/storyboard/words.md')), 'words.js is not a chapter');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const bad = spawnSync(process.execPath, [TOOL, path.join(ROOT, 'no-such-chapter.js')], { encoding: 'utf8' });
  assert.notEqual(bad.status, 0, 'a story file that is not there fails loudly');
});

test('a Counts frame that says none of its lines again (`intro: false`) is worded from its first fact, as the engine times it: the engine’s own words and timed on itself; its own words, read first, so only a miss counts; or a check, never timed (chapter 7 integration round 1: chapter 5’s bill row corrected too, a doc fix, not play)', () => {
  const { load } = require('./_load.js');
  const PC = load(), E = PC.engine, S = chapters.map(f => PC.story[path.basename(f, '.js')]);
  const md = id => fs.readFileSync(path.join(ROOT, 'docs/storyboard', id + '.md'), 'utf8');
  const row = (id, set) => (md(id).split('\n').find(l => l.includes('**Then the Counts lesson** `' + set + '`')) || '');
  const ENGINE = 'it is asked in the engine’s own words, and timed on itself.', OWN = 'it is asked in its own words, read first, so only a miss there counts as hard.', CHECK = 'it is asked in its own words, and as a check it is never timed.';
  const want = { 'ch05:ch05-tens': [ENGINE, 10, 7], 'ch05:ch05-bill': [OWN, 9, 2], 'ch06:ch06-nines': [ENGINE, 7, 9], 'ch07:ch07-pile': [CHECK, 3, 10], 'ch07:ch07-threes': [ENGINE, 7, 3], 'ch07:ch07-sixes': [OWN, 2, 6] };
  for (const [k, [words, a, b]] of Object.entries(want)) {
    const [id, set] = k.split(':'), r = row(id, set);
    assert.ok(r.includes('None of this frame’s own lines is said again over the first question: ' + words), k + ': ' + r.slice(0, 120));
    // and the engine agrees: a first question in its own words is read first (never timed); in the engine's, timed
    assert.equal(E.readFirst({ set, a, b }, S, null, true), words !== ENGINE, k + ': read first');
  }
});

test('chapter 11’s two additions: the `{ending}` sentence (the Warrior Counts’ legend always, a chapter’s only where its story has the token) and the Type screen’s line (refused in place, by the frame’s own lines and speakers); and words for the den’s next nest', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const cast = ['player', 'glintstar', 'tallyheart', 'murmurchime', 'thymeleaf'].map(who => ({ who, pose: 'sit' }));
    const scene = { set: 'camp', cam: 'crowd', cast, fx: ['night'] };
    const fx11 = { id: 'fx11', number: 11, title: 'The Warrior Ceremony', opensWhen: 'warrior', start: 'f024', frames: {
      f024: { scene, board: 'MEDIUM. The choice. Three names.', choice: { options: [
        { label: '{name}mist', when: { offer: 'mist' }, ending: 'mist', sets: { ch11Named: 'offer' }, next: 'f026' },
        { label: '{name}true', when: { offer: 'true' }, ending: 'true', sets: { ch11Named: 'offer' }, next: 'f026' },
        { label: '“I’ll name myself!”', sets: {}, next: 'f025' }] } },
      f025: { scene, board: 'MEDIUM. The Type screen. She types.', say: [{ who: 'glintstar', text: 'Then you choose.' }],
        input: { kind: 'ending', sets: { ch11Named: 'self' }, next: 'f026', refuse: {
          own: { who: 'tallyheart', text: 'That’s your name ALREADY! Give it a new ending.' },
          star: { who: 'glintstar', text: 'Star is for leaders. Try another ending.' },
          paw: { who: 'tallyheart', text: 'Paw? Not any more, you’re not! Try another.' },
          kit: { who: 'murmurchime', text: 'Kit? You’re a WARRIOR now, silly! Try another.' },
          clan: { text: 'That’s MY name! One of me is plenty. Find one all your own.' } } } },
      f026: { scene, board: 'MEDIUM. Her name. The Clan hears it.', say: [{ who: 'glintstar', text: '{name}{ending}.' }], end: true } } };
    const file = path.join(tmp, 'fx11.js');
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx11 = ' + JSON.stringify(fx11) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    assert.ok(md.includes(' `{ending}` is her warrior ending, `paw` until the Ceremony (Fernpaw, then Fernheart).'), 'the chapter legend has it');
    assert.ok(md.includes('**Then she types her own ending** after her name, with a live preview (“You will be: Fernheart”); refused, kindly, with another try on the same screen: ' +
      'her own name or no letter, Tallyheart: “That’s your name ALREADY! Give it a new ending.”; star, Glintstar: “Star is for leaders. Try another ending.”; ' +
      'paw, Tallyheart: “Paw? Not any more, you’re not! Try another.”; kit (kitten, kitty), Murmurchime: “Kit? You’re a WARRIOR now, silly! Try another.”; ' +
      'a Clan cat’s whole name, that cat (Tallyheart, Thymeleaf or {Murmur}chime): “That’s MY name! One of me is plenty. Find one all your own.”. Accepted, it sets `ch11Named: "self"`. On to f026.'), 'the Type screen’s line');
    assert.match(md, /This option shows only if offer is "mist"\./, 'the computed key in the tool’s generic words');
    // a chapter without the token: no sentence (chapters 1 to 10 regenerate byte for byte)
    const ch10 = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch10.md'), 'utf8');
    assert.ok(!ch10.includes('{ending}'));
    // the Warrior Counts: always, after the cat's tokens and before the result's
    const war = fs.readFileSync(path.join(ROOT, 'docs/storyboard/warrior.md'), 'utf8');
    assert.ok(war.includes('the tortoiseshell’s name word (Murmur, or Mutter for a reader whose own Clan name is Murmur). `{ending}` is her warrior ending, `paw` until the Ceremony (Fernpaw, then Fernheart). The result’s own words come first'));
    assert.equal((war.match(/\{name\}\{ending\}/g) || []).length, 3, 'its three re-sit lines');
    // the den's next nest (the scenes owner's names): words for the option and the spot
    const more = path.join(tmp, 'more.json');
    fs.writeFileSync(more, JSON.stringify({ sets: { camp: { opts: { moon: 'number' } }, den: { anchors: ['next-nest'], opts: { moon: [15], nextNest: [false, true] } } } }));
    const run = spawnSync(process.execPath, [TOOL, '--check-words', more], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

/* Chapter 12: Chispapaw's Spanish in the storyboard (docs/chapters/12-a-spark-at-the-hedge.spec.md, section 6, "The storyboard
 * and the tools"): a `lang: 'es'` balloon printed *[es]* with its Spanish and its English (E.esLine's), a {es:key} token as
 * «its Spanish», the paw thing counted in her Spanish, each set's `echo` in a line under its set; and the art's new names. */
test('chapter 12: a Spanish balloon *[es]* with its Spanish and its gloss, a {es:key} token as «its Spanish», the paw thing in Chispapaw’s Spanish, the sets’ echoes; Chispapaw, her collar off, a cat with a mouse, the store under the bridge and its plan in the Hollow, the quick marks, the hedge’s third spot, the den’s moon at 16; chapters 1 to 11 and warrior.md unchanged', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const fx12 = {
  id: 'fx12', number: 12, title: 'Spanish (fixture)', module: 2, start: 'f001', names: { player: '{name}{ending}' },
  frames: {
    f001: { board: 'B', scene: { set: 'garden', cam: 'hedge', cast: [{ who: 'chispapaw', pose: 'crouch', mood: 'shy', at: 'hedge-gap', facing: 'right' }, { who: 'player', pose: 'sit', at: 'hedge-side' }, { who: 'tallyheart', pose: 'sit', at: 'hedge-right', facing: 'left' }] },
      caption: ['She’s counting the Clan, under her breath.'], say: [{ who: 'chispapaw', name: 'The little cat', kind: 'whisper', lang: 'es', text: '…⁠{es:11}, {es:12}. {Es:12} {es:gatos}.' }], next: 'f002' },
    f002: { board: 'B', scene: { set: 'den', cam: 'inside', cast: [{ who: 'snorer', pose: 'curl', asleep: true, at: 'sleeper-1' }] }, caption: ['By {es:50}, the grey tom is snoring.'], say: [{ who: 'chispapaw', text: 'My Tall Ones call me {es:galleta}. It means cookie.' }], next: 'f003' },
    f003: { board: 'B', scene: { set: 'hollow', cam: 'lesson', opts: { marks: 10, store: 500, storeGlow: 'hundreds', tap: 'squares' } }, counts: { set: 'ch12-warm', intro: false, next: 'f004' } },
    f004: { board: 'B', scene: { set: 'hollow', cam: 'lesson', opts: { quick: 3 } }, counts: { set: 'ch12-take', intro: false, next: 'f005' } },
    f005: { board: 'B', scene: { set: 'bridge', cam: 'store', light: 'sunset', opts: { store: 133, tap: 'store' }, cast: [{ who: 'murmurchime', pose: 'walk', holds: 'mouse', at: 'way-in', facing: 'left' }, { who: 'player', pose: 'sit', at: 'store-left', facing: 'right' }, { who: 'chispapaw', pose: 'sit', at: 'store-right', facing: 'left', collar: false }] },
      say: [{ who: 'chispapaw', kind: 'whisper', lang: 'es', text: '¡{Es:133}!' }], next: 'f006' },
    f006: { board: 'B', scene: { set: 'den', cam: 'inside', opts: { moon: 16 } }, say: [{ who: 'chispapaw', lang: 'es', text: '{es:aContar}' }],
      skip: { table: 10, groups: 5, paws: 'both', teacher: 'chispapaw', lang: 'es', carry: false, prompt: '**Tap** your forepaws.', next: 'f007' } },
    f007: { board: 'B', end: true }
  },
  counts: {
    'ch12-warm': { teacher: 'tallyheart', warmHard: { table: 'all', at: [0, 1], alt: [{ a: 3, b: 8, table: 3 }] }, facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }], praise: [], fast: [], done: '',
      echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }, { who: 'chispapaw', text: 'My little Tall One says these every night! I never knew what they MEANT.' }] } },
    'ch12-take': { op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, done: '', facts: [{ a: 254, b: 131, regroup: 'show' }, [58, 23], [475, 132]],
      echo: { on: [[475, 132]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] } }
  },
  cards: {}
};
    const file = path.join(tmp, 'fx12.js');
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx12 = ' + JSON.stringify(fx12) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    // the Spanish: a whole line, a word in a line and in a caption, the count, the echoes
    assert.ok(md.includes('- **The little cat (Chispapaw)**, whispering: *[es]* “…\u2060once, doce. Doce gatos.” (…\u2060eleven, twelve. Twelve cats.)'), 'a whole Spanish line and its English');
    assert.ok(md.includes('- **Chispapaw**: “My Tall Ones call me «Galleta». It means cookie.”'), 'a word in a line');
    assert.ok(md.includes('> By «cincuenta», the grey tom is snoring.'), 'a number in a caption');
    assert.ok(md.includes('- **Chispapaw**, whispering: *[es]* “¡Ciento treinta y tres!” (One hundred thirty-three!)'));
    assert.ok(md.includes('- **Chispapaw**: *[es]* “¡A contar!” (Let’s count!)'));
    assert.ok(md.includes('**Then the paw thing in Chispapaw’s Spanish** (the skip-count, by 10s): Diez, veinte, treinta, cuarenta, ¡cincuenta! (Ten, twenty, thirty, forty, fifty!).'), 'the Spanish count');
    assert.ok(md.includes('the page waits for Next (a Spanish count never turns its own page)') && md.includes('On to f007, which does not show the number.'));
    assert.ok(md.includes('- Chispapaw echoes her first right answer (a retry counts) in Spanish, once: *[es]* “¡Siete por ocho, cincuenta y seis!” (Seven times eight, fifty-six!), then “My little Tall One says these every night! I never knew what they MEANT.” for 7 × 8, after the line that answer earned, all waiting for Next.'), 'the warm-up\'s echo');
    assert.ok(md.includes('- After 475 − 132, right or helped (never its twin), Chispapaw echoes it in Spanish: *[es]* “¡Trescientos cuarenta y tres!” (Three hundred forty-three!).'), 'the lesson\'s echo');
    assert.ok(!/\{[Ee]s:/.test(md), 'no token left as written');
    // the art's new names
    ['Chispapaw, a small cream pillow cat with a dark brown face, ears, paws and tail, big ears, blue eyes and a collar with a tiny bell', 'without her collar and bell',
      'a mouse in the mouth', 'at the front left of the store', 'at the front right of the store', 'at the right, by the way in', 'on the lawn just right of the gap in the hedge',
      'the dry den, the very back of the dark under the Old Bridge where Sprinkle slept', 'the store laid out on the floor: one square, three rows and three loose, 133', 'the store on the floor is what she taps',
      'the store’s plan in the sand: five empty squares', 'the squares of the store’s plan glowing', 'the whole store’s plan in the sand is what she taps (the squares)',
      'three sets of a square, a line and a dot', 'then Chispapaw’s beside it, her square round like a cookie, then yours beside hers', 'the moon one evening past full, waning, sixteen evenings old'
    ].forEach((w) => assert.ok(md.includes(w), w));
    // chapters 1 to 11 and the Warrior Counts: no Spanish in them (every storyboard regenerates byte for byte: the first test)
    fs.readdirSync(path.join(ROOT, 'docs/storyboard')).filter((f) => /^(ch(0\d|1[01])|warrior)\.md$/.test(f)).forEach((f) => {
      const s = fs.readFileSync(path.join(ROOT, 'docs/storyboard', f), 'utf8');
      assert.ok(!/[«»]|\*\[es\]\*|in Chispapaw’s Spanish/.test(s), f);
    });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

/* Chapter 13: the art's new names in words (docs/chapters/13-the-hunters-crouch.spec.md, section 8, "Drawn now"): the camp's
 * first frost and the dawn patrol's trails, the two spots by the ferns, the spread forty-three in the Hollow's sand, Chispapaw's
 * collar in the den, GroveClan's big dig by the old oak (its close-up and the marks' close-up, its spots, the marks and the two
 * Taps), the groundhog in its poses and a curled cat's tail straight up; and the --check-words list of chapter 13's names,
 * checked before the art lands. The grove's `marks` are worded before the Hollow's claw marks: always one long line and eight
 * little pokes, never a claw mark, a dot, a count or a number. */
const WORDS13 = { sets: {
  camp: { anchors: ['ferns-1', 'ferns-2'], opts: { frost: [false, true, 'prints'] } },
  hollow: { opts: { spreadMarks: [false, 'standing', 'spread', 'two'] } },
  den: { opts: { collar: [false, true] } },
  grove: { cams: ['dig', 'marks'], anchors: ['oak-near', 'door-1', 'door-2', 'doorway', 'dig-front', 'marks-1', 'marks-2', 'dig-elder', 'dig-fern'],
    opts: { dig: [false, true], marks: [false, 'leaves', 'bare'], tap: ['none', 'leaves', 'marks'] } } },
  cast: ['groundhog'], otherPoses: { groundhog: ['doze', 'wake', 'sit', 'yawn', 'sleep'] } };
test('chapter 13: the camp’s frost and its trails, the spots by the ferns, the spread forty-three, the collar in the den, the dig by the old oak and its close-ups, spots, marks and Taps, the groundhog, a curled tail straight up; the grove’s marks never claw marks or a number; its names checked; chapters 1 to 12 and warrior.md unchanged', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const more = path.join(tmp, 'words13.json');
    fs.writeFileSync(more, JSON.stringify(WORDS13));
    const run = spawnSync(process.execPath, [TOOL, '--check-words', more], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const c = (who, pose, at, x) => Object.assign({ who, pose, at }, x || {});
    const fx13 = { id: 'fx13', number: 13, title: 'The Hunter’s Crouch (fixture)', module: 2, start: 'f001', names: { player: '{name}{ending}' }, cards: {}, counts: {},
      frames: {
        f001: { board: 'B', scene: { set: 'camp', cam: 'reveal', fx: ['morning'], opts: { frost: 'prints' } }, caption: ['Behind you, three cats’ pawprints march across the white.'], next: 'f002' },
        f002: { board: 'B', scene: { set: 'camp', cam: 'ferns', fx: ['morning'], opts: { frost: true }, cast: [c('player', 'sit', 'ferns-1'), c('chispapaw', 'crouch', 'ferns-2', { tailUp: true, collar: false })] }, next: 'f003' },
        f003: { board: 'B', scene: { set: 'hollow', cam: 'lesson', fx: ['morning'], opts: { marks: 10, glow: 'auto', spreadMarks: 'spread' } }, next: 'f004' },
        f004: { board: 'B', scene: { set: 'hollow', cam: 'lesson', fx: ['morning'], opts: { marks: 10, glow: 'auto', spreadMarks: 'two' } }, next: 'f005' },
        f005: { board: 'B', scene: { set: 'den', cam: 'inside', fx: ['night'], opts: { weather: 'clear', collar: true }, cast: [c('chispapaw', 'curl', 'nest', { asleep: true, collar: false, tailUp: true })] }, next: 'f006' },
        f006: { board: 'B', scene: { set: 'grove', cam: 'oak', opts: { dig: true }, cast: [c('groveclan', 'sit', 'oak-near', { variant: 1 })] }, next: 'f007' },
        f007: { board: 'B', scene: { set: 'grove', cam: 'dig', opts: { marks: 'leaves' }, cast: [c('groundhog', 'doze', 'doorway', { mood: 'sleepy' }), c('player', 'crouch', 'door-1'), c('chispapaw', 'crouch', 'door-2', { collar: false })] }, next: 'f008' },
        f008: { board: 'B', scene: { set: 'grove', cam: 'dig', opts: { marks: 'leaves' }, cast: [c('groundhog', 'yawn', 'doorway')] }, say: [{ who: 'groundhog', name: 'The round brown thing', text: 'What do I LOOK like? A BADGER?' }], next: 'f009' },
        f009: { board: 'B', scene: { set: 'grove', cam: 'dig', opts: { marks: 'leaves', tap: 'leaves' }, cast: [c('player', 'crouch', 'marks-1'), c('chispapaw', 'crouch', 'marks-2', { collar: false })] },
          scratch: { tap: 'leaves', prompt: '**Tap** to brush the leaves away.', label: 'Brush the leaves away.', next: 'f010' } },
        f010: { board: 'B', scene: { set: 'grove', cam: 'marks', opts: { marks: 'bare', tap: 'marks' } }, scratch: { tap: 'marks', prompt: '**Tap** to look one more time.', label: 'Look one more time.', next: 'f011' } },
        f011: { board: 'B', scene: { set: 'grove', cam: 'dig', opts: { marks: 'bare' }, cast: [c('groundhog', 'sleep', 'doorway', { mood: 'happy' }), c('groveclan', 'sit', 'dig-elder', { variant: 1 }), c('groveclan', 'sit', 'dig-fern', { variant: 2 }), c('player', 'crouch', 'dig-front')] }, end: true }
      } };
    const file = path.join(tmp, 'fx13.js');
    fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx13 = ' + JSON.stringify(fx13) + ';\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    const scene = (id) => (md.split('\n### ').find((b) => b.startsWith(id)) || '').split('\n').find((l) => l.startsWith('**Scene.**')) || '';
    [['f001', 'the first frost, at first light: every fern edged and tipped silver-white with rime'], ['f001', 'three trails of small pawprints pressed green through the white'],
      ['f002', 'at the front left, near the ferns'], ['f002', 'at the front middle, toward the ferns, with room before the nose for a pounce'],
      ['f003', 'the same forty-three, spread: one line crossed out, and ten new dots in a scratched frame under the three old ones, five and five'],
      ['f004', 'Tallyheart’s spread forty-three at her paws and yours beside it, nearest you'],
      ['f005', 'Chispapaw’s collar, narrow and red with its tiny round gold bell, lying curled in a little hollow pressed in the moss beside the nest'], ['f005', 'the tail rising straight up out of the curl, its tip soft'],
      ['f006', 'the big dig at the old oak’s roots, on the trunk’s sunny right side'], ['f006', 'on the ground in front of the old oak’s trunk, clear of the dig and the doorway'],
      ['f007', 'Grove: the big dig at the old oak’s roots in GroveClan’s woods'], ['f007', 'Camera: the dig close, at cat height'], ['f007', 'the groundhog (round and brown'],
      ['f007', 'curled up round in its doorway, its back and bottom toward us, the face tucked down out of sight'], ['f007', 'in the small doorway itself, its lower half under the drift of fallen leaves'],
      ['f007', 'in front of the small doorway, crouched facing it'], ['f007', 'beside the first at the doorway, a step back, facing it'],
      ['f008', 'sitting up, an enormous round yawn, eyes squeezed shut (no teeth)'], ['f009', 'the fallen leaves over the marks are what she taps'], ['f009', 'at the front right by the flat earth, facing the marks'],
      ['f010', 'Camera: close on the flat bare earth beside the dig'], ['f010', 'the marks on the flat earth are what she taps'],
      ['f011', 'curled round, side on, its face showing, eyes shut, a little smile: asleep'], ['f011', 'at the back right, facing the dig'], ['f011', 'at the back left, half hidden by a fern'], ['f011', 'at the front middle, before the dig, facing it']
    ].forEach(([id, w]) => assert.ok(scene(id).includes(w), id + ': ' + w + '\n' + scene(id)));
    assert.ok(md.includes('- **The round brown thing (The groundhog)**: “What do I LOOK like? A BADGER?”'), 'its balloon, labelled as the story labels it');
    // the grove's marks: one long line and eight little pokes, half under the leaves or plain; never claw marks, dots, a count or a number
    for (const [id, v] of [['f007', 'half under fallen leaves'], ['f011', 'all of them plain']]) {
      const s = scene(id), m = s.slice(s.indexOf('beyond the dig'));
      assert.ok(m.startsWith('beyond the dig, on the flat bare earth') && m.includes('one long line and eight little pokes scratched in the earth') && m.includes(v), id + ': ' + m);
      assert.doesNotMatch(s, /claw mark|\bdots?\b|count|\d|eighteen|thirty/i, id + ': never a claw mark, a dot, a count or a number');
    }
    // the spread's words never say "rows" (a row is a ten: module 2's amendment 1)
    for (const id of ['f003', 'f004']) { const s = scene(id); assert.doesNotMatch(s.slice(s.search(/the same forty-three|Tallyheart’s spread/)), /\brows?\b/, id); }
    for (const id of ['f007', 'f008', 'f009', 'f010', 'f011']) assert.ok(!scene(id).includes('claw marks on the trunk'), id + ': not the Hollow’s words');
    // chapters 1 to 12 and the Warrior Counts: none of chapter 13's words (every storyboard regenerates byte for byte: the first test)
    fs.readdirSync(path.join(ROOT, 'docs/storyboard')).filter((f) => /^(ch(0\d|1[012])|warrior)\.md$/.test(f)).forEach((f) => {
      const s = fs.readFileSync(path.join(ROOT, 'docs/storyboard', f), 'utf8');
      assert.ok(!/the first frost|eight little pokes|the big dig|the groundhog|out of the curl, its tip soft|forty-three, spread/.test(s), f);
    });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
