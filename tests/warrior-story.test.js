/* Story tests for the Warrior Counts: node --test
 *
 * Checks app/story/warrior.js (`PC.warrior`) against docs/warrior-counts.md (v0.4: sections 1, 3, 4, 5
 * and 7) and README decisions 48 and 49: the shape exactly (section 7, "The story file"); the frame
 * contract (docs/build.md, "The frame") for every frame of every list and every variant; the result's
 * slots and the variant keys E.warriorResult names; every frame drawn through PC.art in the art
 * vocabulary as it is (no new art), with everyone in the picture and the crowd only where the Clan
 * watches; chapter 3's scene at the fountain (Glintstar asks, Tallyheart beside her with the sand, the
 * whole Clan for her first sitting, then Glintstar, Tallyheart and {Murmur}chime, the Clan running in
 * for a pass); the depth rule (casts listed back to front where cats meet, as chapter 9's are); tokens and pronouns for a she-cat, a tom and a cat named Murmur; her number only when it
 * is good news (decision 49), for every score and every last score; the not-yet warm, never shaming,
 * never counting attempts; words a frame for a reader of eight; the lines through the Counts runner
 * (the sparse praise, the remembered lines, the miss lines in turn, 10 × 10's finale); the words the
 * design's; and the chapters untouched by it.
 *
 *   PRINT_WARRIOR=1 node --test tests/warrior-story.test.js   prints every result, filled.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
const E = PC.engine;
const A = PC.art;
// before the page loads it (index.html's tag is the page's), the story is required here
const WARRIOR_JS = path.join(ROOT, 'app/story/warrior.js');
const storyBefore = JSON.stringify(PC.story);
require(WARRIOR_JS);
const W = PC.warrior;
const STORIES = E.chapters(PC.story);
const DOC = fs.readFileSync(path.join(ROOT, 'docs/warrior-counts.md'), 'utf8');

/* ------------------------------------------------------------------ the contract */

const TOP = ['after', 'scene', 'open', 'aside', 'halfway', 'beats', 'pass', 'notYet', 'afterPass', 'counts'];
const RESULTS = {
  pass: ['frames', 'clean', 'quiet'],
  notYet: ['frames', 'first', 'second', 'later', 'better', 'close', 'plain'],
  afterPass: ['frames', 'clean', 'number']
};
const FRAME_KEYS = ['scene', 'board', 'caption', 'say'];
// a chapter frame's interactions and flags: none here (and no `when`: a result varies by its slots)
const NOT_HERE = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end', 'when', 'else', 'sets', 'card', 'gift', 'sfx'];
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper'];
// (chapter 11: and {ending}, her warrior ending, 'paw' until the Ceremony: {name}{ending} in the three re-sit lines only, below)
const CAT_TOKENS = ['name', 'petname', 'Murmur', 'murmur', 'they', 'them', 'their', 'They', 'Them', 'Their', 'ending'];
const RESULT_TOKENS = ['right', 'Right', 'last', 'Last', 'short', 'tricky'];
const FACT_TOKENS = ['a', 'b'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
// who may be in the picture: chapter 3's camp and its cats, the old tom, Waffles far above (no new art)
const WHO = ['player', 'glintstar', 'tallyheart', 'murmurchime', 'grizzled', 'clancat', 'waffles'];
// chapter 3's foot of the fountain, where Murmurpaw sat (ch3 f016), and Tallyheart's point beside it
const CH3_FOOT = PC.story.ch03.frames.f016.scene.cast.find(c => c.who === 'mutterer').at;
const WORDS_MAX = 30, BALLOON_MAX = 25, CAPTION_CHARS = 95;

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', look: { sex: 'she-cat' } },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', look: { sex: 'tom' } },
  murmur: { name: 'Murmur', petname: 'Biscuit', look: { sex: 'she-cat' } }
};

/* ------------------------------------------------------------------ helpers */

const isFrame = x => !!x && typeof x === 'object' && !!x.scene;
const isSlot = x => !!x && typeof x === 'object' && Array.isArray(x.by);
function words(t) { return String(t).split(/\s+/).filter(w => /[\p{L}\p{N}{]/u.test(w)).length; }
function tokensIn(t) { return (String(t).match(/\{[^}]*\}/g) || []).map(s => s.slice(1, -1)); }
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const norm = s => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

/* Number words, the engine's (E.countWords) when it has them. */
const NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
  'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function countWords(n) {
  if (typeof E.countWords === 'function') return E.countWords(n);
  return n < 20 ? NUMW[n] : n === 100 ? 'a hundred' : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + NUMW[n % 10] : '');
}
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
/* The result's tokens: number words, and the Counts her misses fall in. */
function resultTokens(right, last, tricky) {
  const t = tricky || [7, 8];
  return {
    right: countWords(right), Right: cap1(countWords(right)),
    last: last == null ? '' : countWords(last), Last: last == null ? '' : cap1(countWords(last)),
    short: countWords(Math.max(0, 50 - right)),
    tricky: t.map(n => 'the ' + n + 's').join(' and ')
  };
}
const fill = (text, cat, extra) => E.fill(text, cat, extra);

/* The result's frames as the page plays them (section 7, the header of app/story/warrior.js): every
 * entry of `frames` in order; a slot plays the frame under the first of its `by` keys the variant names,
 * else its `else`, else nothing. `has(k)`: whether the variant names k. */
function play(R, has) {
  const out = [];
  R.frames.forEach(x => {
    if (isFrame(x)) { out.push(x); return; }
    const k = x.by.find(has);
    const f = k ? R[k] : x.else;
    if (f) out.push(f);
  });
  return out;
}
/* Section 5's rule for a not-yet, as the design states it: which not-yet, and Tallyheart's number. */
function notYetKeys(right, last, nth) {
  const better = last != null && right > last;
  const tone = better ? 'better' : right >= 47 ? 'close' : right < 45 ? 'plain' : null;
  return { keys: [nth].concat(tone ? [tone] : []), number: right >= 45 || better, better, tone };
}

/* Every frame of PC.warrior, with where it is and whether it is a result's. */
function allFrames() {
  const out = [];
  W.open.first.forEach((f, i) => out.push({ where: 'open.first[' + i + ']', f }));
  W.open.again.forEach((f, i) => out.push({ where: 'open.again[' + i + ']', f }));
  W.open.quiet.forEach((f, i) => out.push({ where: 'open.quiet[' + i + ']', f }));
  out.push({ where: 'halfway', f: W.halfway });
  Object.keys(RESULTS).forEach(r => {
    const R = W[r], seen = new Set();
    const add = (where, f) => { if (!seen.has(f)) { seen.add(f); out.push({ where, f, result: r }); } };
    R.frames.forEach((x, i) => { if (isFrame(x)) add(r + '.frames[' + i + ']', x); else if (x.else) add(r + '.frames[' + i + '].else', x.else); });
    RESULTS[r].filter(k => k !== 'frames').forEach(k => add(r + '.' + k, R[k]));
  });
  return out;
}
const FRAMES = allFrames();
/* Every line she reads, with the tokens it may use. */
function allLines() {
  const out = [];
  FRAMES.forEach(({ where, f, result }) => {
    (f.caption || []).forEach((c, i) => out.push({ where: where + ' caption ' + i, text: c, ok: result ? CAT_TOKENS.concat(RESULT_TOKENS) : CAT_TOKENS, result }));
    (f.say || []).forEach((b, i) => {
      out.push({ where: where + ' say ' + i + ' (' + b.who + ')', text: b.text, who: b.who, ok: result ? CAT_TOKENS.concat(RESULT_TOKENS) : CAT_TOKENS, result });
      // (its words over a single chip)
      if (b.one) out.push({ where: where + ' say ' + i + ' one (' + b.who + ')', text: b.one, who: b.who, ok: CAT_TOKENS, result });
    });
  });
  W.open.resume.forEach((b, i) => out.push({ where: 'open.resume ' + i, text: b.text, who: b.who, ok: CAT_TOKENS }));
  Object.keys(W.aside).forEach(k => out.push({ where: 'aside.' + k, text: W.aside[k], who: 'tallyheart', ok: CAT_TOKENS }));
  Object.keys(W.beats).forEach(k => W.beats[k].forEach((l, i) => out.push({ where: 'beats.' + k + ' ' + i, text: l, who: 'tallyheart', ok: CAT_TOKENS })));
  const C = W.counts;
  ['praise', 'fast'].forEach(k => C[k].forEach((l, i) => { if (l) out.push({ where: 'counts.' + k + ' ' + i, text: l, who: 'tallyheart', ok: FACT_TOKENS, counts: true }); }));
  ['remembered', 'rememberedSlow'].forEach(k => C[k].forEach((l, i) => { if (l) out.push({ where: 'counts.' + k + ' ' + i, text: l, who: 'tallyheart', ok: FACT_TOKENS, counts: true }); }));
  C.missLast.forEach((l, i) => out.push({ where: 'counts.missLast ' + i, text: l, who: 'tallyheart', ok: [], counts: true }));
  C.last.prompt.forEach((b, i) => out.push({ where: 'counts.last.prompt ' + i, text: b.text, who: b.who, ok: [], counts: true }));
  C.last.right.forEach((b, i) => out.push({ where: 'counts.last.right ' + i, text: b.text, who: b.who, ok: [], counts: true }));
  out.push({ where: 'counts.last.missLast', text: C.last.missLast, who: 'tallyheart', ok: [], counts: true });
  return out;
}
const LINES = allLines();
/* The lines on a frame as one reader reads them: captions, then balloons. */
const frameLines = f => (f.caption || []).concat((f.say || []).map(b => b.text));
const frameText = f => frameLines(f).join(' ');

/* ------------------------------------------------------------------ the shape */

test('the shape exactly: section 7’s keys, PC.warrior and never PC.story, the openings, the asides, halfway, the beats, the results’ frames and their variant keys, the sitting’s lines', () => {
  assert.ok(W && typeof W === 'object', 'PC.warrior is defined');
  assert.deepEqual(Object.keys(W), TOP);
  assert.equal(W.after, 'ch10');
  assert.ok(!('warrior' in PC.story), 'not a chapter: no PC.story.warrior');
  // the scene: one scene, the question panel
  assert.deepEqual(Object.keys(W.scene), ['set', 'cam', 'opts', 'cast', 'fx']);
  // the openings: three lists of frames and one line, the runner's intro
  assert.deepEqual(Object.keys(W.open), ['first', 'again', 'quiet', 'resume']);
  assert.equal(W.open.first.length, 4, 'the first opening: four panels');
  assert.equal(W.open.again.length, 1, 'with the crowd again: one panel');
  assert.equal(W.open.quiet.length, 1, 'quiet: one panel');
  ['first', 'again', 'quiet'].forEach(k => W.open[k].forEach(f => assert.ok(isFrame(f), 'open.' + k)));
  assert.deepEqual(W.open.resume, [{ who: 'tallyheart', text: 'Where were we? Ah, yes.' }], 'resume: one line, the runner’s intro, Tallyheart’s');
  assert.deepEqual(Object.keys(W.aside), ['late', 'practice']);
  Object.values(W.aside).forEach(l => assert.equal(typeof l, 'string'));
  assert.ok(isFrame(W.halfway), 'halfway: one frame');
  // the beats: the pauses' own positions, never 28 (the halfway page)
  const BEATS = Array.isArray(E.WARRIOR_BEATS) ? E.WARRIOR_BEATS : [14, 28, 42];
  assert.deepEqual(Object.keys(W.beats), ['14', '42']);
  Object.keys(W.beats).forEach(k => {
    assert.ok(BEATS.includes(+k) && +k !== 28, 'beat ' + k + ' is one of E.WARRIOR_BEATS, not the halfway page');
    assert.ok(Array.isArray(W.beats[k]) && W.beats[k].length >= 1 && W.beats[k].every(l => typeof l === 'string' && l.trim()), 'beat ' + k + ': lines');
  });
  // the results: frames, and the frames that vary, keyed by E.warriorResult's variant (never `when`)
  Object.keys(RESULTS).forEach(r => {
    const R = W[r];
    assert.deepEqual(Object.keys(R), RESULTS[r], r + ': its keys');
    assert.ok(Array.isArray(R.frames) && R.frames.length, r + '.frames');
    const keys = RESULTS[r].filter(k => k !== 'frames'), inSlots = [];
    R.frames.forEach((x, i) => {
      assert.ok(isFrame(x) || isSlot(x), r + '.frames[' + i + '] is a frame or a slot');
      if (isSlot(x)) {
        assert.deepEqual(Object.keys(x).filter(k => k !== 'by' && k !== 'else'), [], r + '.frames[' + i + ']: a slot is { by, else? }');
        assert.ok(x.by.length >= 1, r + ': a slot names its keys');
        x.by.forEach(k => { assert.ok(keys.includes(k), r + ': ' + k + ' is a key of ' + r); inSlots.push(k); });
        if (x.else !== undefined) assert.ok(isFrame(x.else), r + ': a slot’s else is a frame');
      }
    });
    assert.deepEqual(inSlots.slice().sort(), keys.slice().sort(), r + ': every variant key is in exactly one slot');
    keys.forEach(k => assert.ok(isFrame(R[k]), r + '.' + k + ' is a frame'));
  });
  // the slots: pass.clean in place of the named panel, the quiet pass's yowl before the tails; which
  // not-yet, then Tallyheart's number; after a pass, its one page
  assert.deepEqual(W.pass.frames.map(x => isSlot(x) ? x.by : 'frame'), [['clean'], ['quiet'], 'frame', 'frame']);
  assert.deepEqual(W.notYet.frames.map(x => isSlot(x) ? x.by : 'frame'), [['first', 'second', 'later'], ['better', 'close', 'plain'], 'frame']);
  assert.deepEqual(W.afterPass.frames.map(x => isSlot(x) ? x.by : 'frame'), [['clean', 'number']]);
  assert.ok(isFrame(W.afterPass.frames[0].else), 'after the pass, under 50: a page of its own, with no number');
  assert.ok(isFrame(W.pass.frames[0].else) && !W.pass.frames[1].else, 'the named panel has its plain pass; the yowl has none');
  assert.equal(W.notYet.frames[0].else, W.notYet.later, 'a not-yet the variant does not place is a later one (never the old tom’s, never a crowd)');
  assert.ok(isFrame(W.notYet.frames[1].else), 'forty-five or forty-six, no better than last time: the number and nothing more');
  // the sitting's lines: exactly these; no fastAfterMiss, no help openings (each anchor's own)
  assert.deepEqual(Object.keys(W.counts), ['praise', 'fast', 'remembered', 'rememberedSlow', 'missLast', 'last']);
  ['fastAfterMiss', 'helpIntro', 'helpIntroFar', 'helpIntroNotFive', 'helpIntroNotTen', 'helpIntroTens', 'helpIntroOneTuck', 'helpIntroNotNine', 'miss', 'again', 'table', 'facts']
    .forEach(k => assert.ok(!(k in W.counts), 'no ' + k));
  assert.equal(W.counts.missLast.length, 4, 'four miss lines, in turn');
  assert.deepEqual(Object.keys(W.counts.last), ['prompt', 'right', 'missLast'], '10 × 10’s own lines');
});

test('PC.warrior leaves the chapters as they are: requiring it changes nothing in PC.story, adds no chapter, and E.chapters, E.countSets and the stories are what they were', () => {
  assert.equal(JSON.stringify(PC.story), storyBefore, 'PC.story unchanged by app/story/warrior.js');
  const ids = STORIES.map(s => s.id);
  delete require.cache[WARRIOR_JS];
  require(WARRIOR_JS);
  assert.deepEqual(E.chapters(PC.story).map(s => s.id), ids, 'the same chapters');
  assert.deepEqual(Object.keys(PC.story).sort(), ids.slice().sort(), 'PC.story is chapters only');
  assert.ok(ids.every(id => /^ch\d\d$/.test(id)));
  assert.equal(JSON.stringify(PC.warrior), JSON.stringify(W), 'and loading it again gives the same story');
  if (typeof E.countSets === 'function') assert.ok(!E.countSets(E.chapters(PC.story)).some(c => /warrior/.test(c.setId)), 'no Count is the sitting');
});

/* ------------------------------------------------------------------ the frame contract */

test('every frame keeps the frame contract: a scene, a storyboard, captions and balloons only, no interaction (the page plays each list with Next and Back); every balloon’s speaker is in the picture; `chips` only under Tallyheart’s “These were the tricky ones.”', () => {
  assert.ok(FRAMES.length >= 20, FRAMES.length + ' frames');
  FRAMES.forEach(({ where, f }) => {
    assert.deepEqual(Object.keys(f).filter(k => !FRAME_KEYS.includes(k)), [], where + ': only ' + FRAME_KEYS.join(', '));
    NOT_HERE.forEach(k => assert.ok(!(k in f), where + ': no ' + k));
    assert.ok(f.caption || f.say, where + ': something to read');
    if (f.caption) assert.ok(Array.isArray(f.caption) && f.caption.length && f.caption.every(c => typeof c === 'string' && c.trim()), where + ': captions are strings');
    if (f.say) {
      assert.ok(Array.isArray(f.say) && f.say.length, where + ': balloons');
      const cast = f.scene.cast.map(c => c.who);
      f.say.forEach((b, i) => {
        assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'chips', 'one'].includes(k)), [], where + ' balloon ' + i + ': keys');
        assert.ok(typeof b.text === 'string' && b.text.trim(), where + ' balloon ' + i + ': text');
        assert.ok(cast.includes(b.who), where + ': ' + b.who + ' speaks and is in the picture');
        assert.ok(BALLOON_KINDS.includes(b.kind), where + ': kind ' + b.kind);
        if (b.chips !== undefined) assert.deepEqual([b.chips, b.who, b.text], [true, 'tallyheart', 'These were the tricky ones.'], where + ': the chips go under Tallyheart’s tricky ones');
        // a single chip has its own words, on a balloon that can hold one (after the pass, 50 to 54 right)
        if (b.one !== undefined) assert.deepEqual([b.chips, b.one], [true, 'This was the tricky one.'], where + ': one chip, “This was the tricky one.”');
      });
      // a speaker's lines on a panel are one balloon, but for the chips between Tallyheart's two
      const whos = f.say.map(b => b.who);
      whos.forEach((w, i) => { if (i && whos[i - 1] === w) assert.ok(f.say[i - 1].chips, where + ': ' + w + ' twice in a row only around the chips'); });
    }
  });
  // the chips: on the not-yet's tricky page and the after-pass page with misses; never on a clean one
  const chipped = FRAMES.filter(({ f }) => (f.say || []).some(b => b.chips)).map(x => x.where);
  assert.deepEqual(chipped, ['notYet.frames[2]', 'afterPass.frames[0].else', 'afterPass.number']);
  // the one page that can show a single chip says so: after the pass with 50 to 54 right (a not-yet has six or more misses)
  assert.deepEqual(FRAMES.filter(({ f }) => (f.say || []).some(b => b.one)).map(x => x.where), ['afterPass.number']);
  // the runner's own speakers are in the question panel: Glintstar asks, Tallyheart speaks, our cat shouts the hundred
  const cast = W.scene.cast.map(c => c.who);
  ['glintstar', 'tallyheart', 'player'].forEach(w => assert.ok(cast.includes(w), 'the question panel has ' + w));
  W.counts.last.prompt.concat(W.counts.last.right).forEach(b => assert.ok(b.kind === 'caption' || cast.includes(b.who), '10 × 10: ' + b.who + ' is in the question panel'));
});

test('every frame has a storyboard: a shot type in caps, then 2–4 sentences, no tokens, no straight quotes; a frame only some results show says so in its shot line', () => {
  const shot = new RegExp('^(' + SHOTS.join('|') + ')\\b[A-Z ,’\\-]*\\.\\s');
  FRAMES.forEach(({ where, f }) => {
    const b = f.board;
    assert.ok(typeof b === 'string' && b.trim(), where + ': no board');
    assert.match(b, shot, where + ': a shot type in caps first');
    assert.deepEqual(tokensIn(b), [], where + ': tokens in the board');
    assert.doesNotMatch(b, /['"]/, where + ': straight quotes in the board');
    const body = b.replace(shot, '');
    const n = body.split(/(?<=[.!?][”"]?)\s+(?=[A-Z“"(])/).filter(s => s.trim()).length;
    assert.ok(n >= 2 && n <= 4, where + ': ' + n + ' sentences');
    assert.ok(words(body) >= 25, where + ': board too thin');
    assert.doesNotMatch(b, /\b(teeth|fangs?|snarl\w*|blood|wound\w*|twolegs?|kittypets?|thunderpath|ironsnake|STUB)\b/i, where);
  });
  // the variant panels say who sees them
  const head = f => f.board.split('. ')[0];
  ['clean', 'quiet'].forEach(k => assert.match(head(W.pass[k]), /\bONLY\b/, 'pass.' + k));
  ['first', 'second', 'later', 'better', 'close', 'plain'].forEach(k => assert.match(head(W.notYet[k]), /\bONLY\b/, 'notYet.' + k));
  assert.match(head(W.notYet.frames[1].else), /\bONLY\b/);
  assert.match(head(W.afterPass.clean), /\bONLY\b/);
  assert.match(head(W.afterPass.number), /\bONLY\b/);
  assert.match(head(W.afterPass.frames[0].else), /FEWER THAN FIFTY/);
  assert.match(head(W.notYet.first), /FIRST NOT-YET/);
  assert.match(head(W.notYet.second), /SECOND NOT-YET/);
  assert.match(head(W.notYet.later), /THIRD NOT-YET ON/);
});

/* ------------------------------------------------------------------ the art */

const LOOKS = [
  { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' },
  { fur: 'ginger', marking: 'none', eyes: 'green', sex: 'she-cat' },
  { fur: 'black', marking: 'socks', eyes: 'amber', sex: 'she-cat' }
];
/* Every scene she sees: the question panel and halfway with the crowd and quiet (the page draws them
 * with `crowd` as the sitting's), and every frame as written. */
function allScenes() {
  const quiet = s => Object.assign({}, s, { opts: Object.assign({}, s.opts, { crowd: false }) });
  return [['scene (crowd)', W.scene], ['scene (quiet)', quiet(W.scene)], ['halfway (quiet)', quiet(W.halfway.scene)]]
    .concat(FRAMES.map(({ where, f }) => [where, f.scene]));
}

test('scenes use only the art vocabulary as it is (PC.art.vocab), camera by camera: no new art; every anchor one of its camera’s own or a spot in the world; every option by value; the cast, poses, moods and extras, each worn where the art draws it', () => {
  const v = A.vocab;
  allScenes().forEach(([where, s]) => {
    assert.deepEqual(Object.keys(s), ['set', 'cam', 'opts', 'cast', 'fx'], where + ': scene keys');
    const set = v.sets[s.set], info = A.sceneInfo(s.set);
    assert.ok(set, where + ': set ' + s.set);
    assert.ok(['camp', 'tower'].includes(s.set), where + ': the camp, or Waffles’ balcony far above');
    assert.ok(set.cams.includes(s.cam), where + ': camera ' + s.cam);
    const mine = info.anchors[info.cams[s.cam].comp];
    Object.keys(s.opts).forEach(k => {
      assert.ok(set.opts[k], where + ': option ' + k);
      assert.ok(Array.isArray(set.opts[k]) && set.opts[k].some(x => same(x, s.opts[k])), where + ': ' + k + '=' + JSON.stringify(s.opts[k]));
    });
    const used = [];
    s.cast.forEach((c, i) => {
      const at = where + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'variant', 'tailUp'].includes(k)), [], at + ': keys');
      assert.ok(v.cast.includes(c.who) && WHO.includes(c.who), at + ': who');
      const poses = c.who === 'waffles' || v.poses.includes(c.pose) ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), at + ': pose ' + c.pose);
      assert.ok(v.moods.includes(c.mood), at + ': mood ' + c.mood);
      assert.ok(['left', 'right'].includes(c.facing), at + ': facing');
      if (c.tailUp !== undefined) {
        assert.ok(v.extras.tailUp.includes(c.tailUp), at + ': tailUp');
        assert.ok(['sit', 'stand', 'crouch', 'walk'].includes(c.pose), at + ': the art raises a tail in sit, stand, crouch and walk');
      }
      if (c.variant !== undefined) assert.ok(v.variants[c.who] && v.variants[c.who].includes(c.variant), at + ': variant');
      else assert.ok(!v.variants[c.who], at + ': a ' + c.who + ' says which one');
      if (typeof c.at === 'object') {
        assert.deepEqual(Object.keys(c.at), ['x', 'y'], at + ': a spot is { x, y }');
        assert.ok(c.at.x > 0 && c.at.x < 1600 && c.at.y > 0 && c.at.y < 1000, at + ': in the world');
        assert.ok(['main', 'fountain'].includes(info.cams[s.cam].comp) && s.set === 'camp', at + ': spots only on the camp’s ground');
      } else assert.ok(mine[c.at], at + ': ' + s.set + '/' + s.cam + ' has no anchor ' + c.at);
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, where + ': two cast members share a place');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), where + ': fx ' + e));
    // morning, as on Murmurpaw's: never night, dusk or a storm
    assert.ok(s.fx.includes('morning'), where + ': morning');
    assert.ok(!s.fx.some(e => ['night', 'dusk', 'sunset', 'rain', 'lightning', 'stars'].includes(e)), where + ': no other time of day');
  });
  // chapter 3's overlays on the pass until the raised tails are drawn: the glow on Glintstar's words, then the sparkle
  assert.deepEqual(W.pass.frames[0].else.scene.fx, ['morning', 'glow']);
  assert.deepEqual(W.pass.clean.scene.fx, ['morning', 'glow']);
  assert.deepEqual(W.pass.frames[2].scene.fx, ['morning', 'sparkle']);
});

test('every frame renders through PC.art, for three looks: a whole panel, everyone in the cast in the picture; the crowd drawn exactly where the Clan watches', () => {
  allScenes().forEach(([where, s]) => LOOKS.forEach(look => {
    const r = A.render(s, { look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), where + ': a complete svg');
    assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), where + ': no NaN or undefined in the markup');
    assert.ok(Array.isArray(r.heads) && r.heads.length === s.cast.length, where + ': one head per cast member');
    r.heads.forEach((h, i) => {
      assert.ok(h && Number.isFinite(h.x) && Number.isFinite(h.y), where + ': ' + s.cast[i].who + ' has a head');
      assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, where + ': ' + s.cast[i].who + ' is in the picture ' + JSON.stringify(h));
    });
    // the whole Clan (crowd: true) draws seated cats round the fountain in the wide and medium shots; the quiet camp none
    const crowdCats = (r.svg.match(/data-crowd="cat"/g) || []).length;
    if (s.set === 'camp' && A.sceneInfo('camp').cams[s.cam].comp === 'main') {
      if (s.opts.crowd) assert.ok(crowdCats >= 3, where + ': the crowd watches (' + crowdCats + ')');
      else assert.equal(crowdCats, 0, where + ': the camp is quiet');
    }
  }));
});

/* ------------------------------------------------------------------ the staging */

const castOf = (f, who) => f.scene.cast.filter(c => c.who === who);
const fountainPanels = () => FRAMES.filter(({ f }) => f.scene.set === 'camp' && ['reveal', 'crowd'].includes(f.scene.cam));

test('chapter 3’s scene at the fountain: Glintstar on top asks, our cat at Murmurpaw’s foot of the fountain, Tallyheart right beside her by the sand, {Murmur}chime watching; the question panel is all of that, the same for all 55', () => {
  assert.deepEqual(CH3_FOOT, { x: 760, y: 860 }, 'chapter 3’s FOOT');
  const s = W.scene;
  assert.deepEqual([s.set, s.cam, s.opts], ['camp', 'crowd', { crowd: true }], 'the camp’s medium view, written with the crowd (drawn as the sitting’s)');
  assert.deepEqual(castOf({ scene: s }, 'glintstar').map(c => [c.at, c.pose]), [['fountain-top', 'sit']]);
  assert.deepEqual(castOf({ scene: s }, 'player').map(c => c.at), [CH3_FOOT]);
  const t = castOf({ scene: s }, 'tallyheart')[0];
  assert.ok(t && typeof t.at === 'object' && Math.abs(t.at.x - CH3_FOOT.x) <= 250 && Math.abs(t.at.y - CH3_FOOT.y) <= 40, 'Tallyheart beside her');
  assert.equal(castOf({ scene: s }, 'murmurchime').length, 1, '{Murmur}chime at the front');
  assert.deepEqual(s.cast.map(c => c.who).sort(), ['glintstar', 'murmurchime', 'player', 'tallyheart'], 'nobody else: no counting picture, no crowd member in the cast');
  // every fountain panel: Glintstar on top, our cat at the foot, Tallyheart at her one place beside her
  fountainPanels().forEach(({ where, f }) => {
    castOf(f, 'glintstar').forEach(c => assert.deepEqual([c.at, c.facing], ['fountain-top', 'left'], where + ': Glintstar on the fountain'));
    castOf(f, 'player').forEach(c => assert.deepEqual(c.at, CH3_FOOT, where + ': our cat at the fountain’s foot'));
    castOf(f, 'tallyheart').forEach(c => assert.deepEqual(c.at, t.at, where + ': Tallyheart beside her'));
    assert.ok(castOf(f, 'player').length === 1, where + ': our cat is there');
  });
  // close on Glintstar for the rule and the pass, as chapter 3's f018 and f024
  assert.deepEqual([W.open.first[2].scene.cam, W.open.first[2].scene.cast.map(c => c.who)], ['fountain-close', ['glintstar']]);
  assert.match(W.open.first[2].say[0].text, /^To become a warrior/);
  // Glintstar asks; Tallyheart speaks for the sitting; the hundred is our cat's
  assert.deepEqual(W.counts.last.prompt.map(b => b.who || b.kind), ['caption', 'glintstar']);
  assert.deepEqual(W.counts.last.right.map(b => [b.who, b.kind]), [['player', 'shout']]);
  if (typeof E.warriorFacts === 'function') {
    const cat = E.blankCat({ name: 'Moon' });
    const facts = E.warriorFacts(cat, STORIES, Date.UTC(2026, 9, 25, 9));
    assert.ok(facts.every(q => [].concat(q.prompt).some(b => b && b.who === 'glintstar')), 'Glintstar asks every question');
    const last = facts[facts.length - 1];
    assert.deepEqual([last.a, last.b], [10, 10], '10 × 10 last');
    assert.deepEqual([last.prompt, last.right, last.missLast], [W.counts.last.prompt, W.counts.last.right, W.counts.last.missLast], 'the engine takes 10 × 10’s lines from the story');
  }
});

test('the Clan watches her first sitting; after a finished one, only Glintstar, Tallyheart and {Murmur}chime at the fountain, and the Clan comes running for a pass (decision 49)', () => {
  const crowd = s => !!s.opts.crowd;
  // with the crowd: the question panel and halfway as written (drawn as the sitting's), the first opening,
  // the crowd again, the first not-yet (always her first finished sitting), the raised tails of a pass
  [W.scene, W.halfway.scene].concat(W.open.first.map(f => f.scene), W.open.again.map(f => f.scene), [W.notYet.first.scene, W.pass.frames[2].scene])
    .forEach((s, i) => assert.ok(crowd(s), 'crowd ' + i));
  // quiet: the quiet opening, a second and later not-yet, Tallyheart's walk and the tricky ones, after the
  // pass, the named panel (close on Glintstar: either sitting), and the yowl before the Clan runs in
  [W.open.quiet[0], W.notYet.second, W.notYet.later, W.notYet.better, W.notYet.close, W.notYet.plain, W.notYet.frames[1].else,
    W.notYet.frames[2], W.afterPass.frames[0].else, W.afterPass.number, W.afterPass.clean, W.pass.frames[0].else, W.pass.clean, W.pass.quiet]
    .forEach((f, i) => assert.ok(!crowd(f.scene), 'quiet ' + i + ': ' + f.board.slice(0, 40)));
  // a quiet fountain: Glintstar, Tallyheart and {Murmur}chime, nobody else watching (the camp goes about its
  // day: a cat dozing in the ferns, one padding past a den; and for a pass, the Clan running in)
  FRAMES.filter(({ f }) => f.scene.set === 'camp' && !crowd(f.scene)).forEach(({ where, f }) => {
    f.scene.cast.filter(c => c.who === 'clancat').forEach(c => assert.ok(['loaf', 'walk', 'run'].includes(c.pose), where + ': a Clan cat about its day, or running in'));
    assert.ok(!castOf(f, 'grizzled').length, where + ': no old tom in a quiet sitting');
  });
  assert.deepEqual(W.pass.quiet.scene.cast.filter(c => c.who === 'clancat').map(c => c.pose), ['run', 'run', 'run'], 'the Clan comes running');
  assert.deepEqual(castOf(W.pass.quiet, 'murmurchime').map(c => c.mood), ['shout'], '{Murmur}chime yowls');
  assert.equal(castOf(W.open.quiet[0], 'murmurchime').length, 1, '{Murmur}chime has come to watch');
  ['second', 'later'].forEach(k => assert.equal(castOf(W.notYet[k], 'murmurchime').length, 1, k + ': {Murmur}chime close'));
  // the old tom: only on her first not-yet, in the crowd
  const tom = FRAMES.filter(({ f }) => castOf(f, 'grizzled').length).map(x => x.where);
  assert.deepEqual(tom, ['notYet.first']);
  // (a plain balloon, as his capital-word lines are in chapters 3 to 6: a shout is lettered all in capitals,
  // and THREE would stand out from nothing)
  assert.deepEqual(W.notYet.first.say.map(b => [b.who, b.kind]), [['glintstar', undefined], ['grizzled', undefined]], 'Glintstar, then the old tom, loudly, in a plain balloon');
  // halfway: {Murmur}chime's tail straight up, Tallyheart's stretch, front paws out and tail up
  assert.deepEqual(castOf(W.halfway, 'murmurchime').map(c => c.tailUp), [true]);
  assert.deepEqual(castOf(W.halfway, 'tallyheart').map(c => [c.pose, c.tailUp]), [['crouch', true]]);
  // Waffles far above, on the balcony with the wind chime
  assert.deepEqual([W.pass.frames[3].scene.set, W.pass.frames[3].scene.opts, W.pass.frames[3].scene.cast.map(c => c.who)], ['tower', { chime: true }, ['waffles']]);
});

/* ------------------------------------------------------------------ the depth rule */

/* The depth rule (the README's “Casts are listed back to front where cats meet”: the depth hotfix of 2026-10-25,
 * after Charlie found a far cat painted over a near cat's face): scenes.js draws a layer's cast in the order it is
 * listed, never by depth. Chapter 9 is held to it in tests/story-ch09.test.js ('staging, depth'); here every scene
 * the Warrior Counts draw (allScenes: the question panel and halfway with the crowd and quiet, every opening, every
 * result frame and variant), for six looks, she-cat and tom (our cat's box is her look's). For every pair of cast
 * members on the ground in one layer where the one further back (its feet higher up the panel) reaches the nearer
 * one's head, the one further back is drawn first. The warrior's own spots ({ x, y }, no `h`: scenes.js sizes them by
 * depth) are counted: each member's place and size are read from its group in the markup, as drawn. Glintstar on
 * the fountain (`elev`) is out of the depth sums, and listed first in every cast she is in. The pass in a quiet
 * sitting had it the other way round when the branch met chapter 9 (2026-10-31): the runner at `crowd-left` over
 * the face of the runner at the entrance; it is listed first now. The camp's own crowd (`crowd: true`) is drawn in
 * the set's back layer, under the cast: no cast member reaches the head of a crowd cat nearer than it, and no crowd
 * cat's body reaches a cast face. And no scene has `motion`: its streaks trail the first cast member (scenes.js
 * fxMotion), Glintstar on her fountain, never the Clan running in. */
test('staging, depth: on every scene the Warrior Counts draw, for six looks, a cast member further back is never drawn over a nearer one’s head (the Clan running in: `crowd-left` first), nor over a nearer crowd cat’s; Glintstar first wherever she is; no `motion` streaks', { skip: !A.character && 'no cats.js' }, (t) => {
  const LOOKS6 = LOOKS.concat([{ fur: 'silver-tabby', marking: 'white-chest', eyes: 'blue', sex: 'tom' },
    { fur: 'tortie', marking: 'nose-splash', eyes: 'copper', sex: 'she' }, { fur: 'white', marking: 'none', eyes: 'green', sex: 'tom' }]);
  const meets = (p, q) => p[0] < q[2] && p[2] > q[0] && p[1] < q[3] && p[3] > q[1];
  const n1 = v => Math.round(v * 10) / 10;
  // every character group scenes.js draws (placeChar): translate(x y) scale(s s) translate(-w/2 -h), and where it is
  const groups = svg => [...svg.matchAll(/<g transform="translate\((-?[\d.]+) (-?[\d.]+)\) scale\((-?[\d.]+) (-?[\d.]+)\) translate\((-?[\d.]+) (-?[\d.]+)\)"/g)]
    .map(m => ({ at: m.index, x: +m[1], y: +m[2], s: +m[4], w2: -m[5], h: -m[6] }));
  const met = new Set(), bad = new Set(), crowdBad = new Set();
  let pairs = 0;
  allScenes().forEach(([where, s]) => {
    assert.ok(s.cast.findIndex(c => c.who === 'glintstar') <= 0, where + ': Glintstar on her fountain is listed first');
    assert.ok(!s.fx.includes('motion'), where + ': no `motion` (its streaks would trail ' + (s.cast[0] && s.cast[0].who) + ')');
    const info = A.sceneInfo(s.set), anchors = info.anchors[info.cams[s.cam].comp];
    LOOKS6.forEach(look => {
      const svg = A.render(s, { look }).svg, G = groups(svg);
      const ground = s.cast.map(m => {
        const a = typeof m.at === 'object' ? m.at : anchors[m.at];
        if (a.elev) return null;
        // the options scenes.js draws it with (charOpts), so the drawing's w and h are the group's
        const o = { pose: m.pose, mood: m.mood, facing: m.facing || a.face || 'right' };
        if (m.variant !== undefined) o.variant = m.variant;
        if (m.tailUp !== undefined) o.tailUp = m.tailUp;
        if (m.who === 'player') { o.look = look; o.sex = look.sex; }
        if (m.who === 'clancat') { o.look = look; o.taken = s.cast.filter(c => c.who === 'clancat').map(c => c.variant); }
        const ch = A.character(m.who, o);
        const g = G.filter(q => q.x === n1(a.x) && Math.abs(q.w2 - ch.w / 2) < 0.06 && Math.abs(q.h - ch.h) < 0.06);
        assert.equal(g.length, 1, where + ': ' + m.who + ' drawn once at ' + JSON.stringify(m.at));
        const { at, y, s: k } = g[0], box = b => [a.x + (b.x0 - ch.w / 2) * k, y + (b.y0 - ch.h) * k, a.x + (b.x1 - ch.w / 2) * k, y + (b.y1 - ch.h) * k];
        return { m, a, at, body: box(ch.bounds), head: box(ch.headBox) };
      }).filter(Boolean);
      for (const near of ground) for (const far of ground) {
        if (far === near || far.a.y >= near.a.y || (far.a.z || 'front') !== (near.a.z || 'front') || !meets(far.body, near.head)) continue;
        pairs++; met.add(where);
        if (far.at > near.at) bad.add(where + ': ' + far.m.who + ' at ' + JSON.stringify(far.m.at) + ' is drawn over ' + near.m.who + '’s head at ' + JSON.stringify(near.m.at));
      }
      // the camp's own crowd, drawn under the cast (each crowd cat says where its body and head are, in world units)
      for (const c of svg.matchAll(/data-crowd="cat" data-box="([^"]+)" data-head="([^"]+)"/g)) {
        const body = c[1].split(' ').map(Number), head = c[2].split(' ').map(Number);
        for (const x of ground) {
          if (body[3] > x.a.y + 6 && meets(x.body, head)) crowdBad.add(where + ': ' + x.m.who + ' is drawn over a nearer crowd cat’s head at ' + head.map(Math.round));
          if (meets(body, x.head)) crowdBad.add(where + ': a crowd cat reaches ' + x.m.who + '’s face');
        }
      }
    });
  });
  assert.deepEqual([...bad], [], 'listed back to front where they meet');
  assert.deepEqual([...crowdBad], [], 'the crowd under the cast, clear of every face');
  assert.ok(met.has('pass.quiet'), 'the Clan running in: two runners meet, the one further back drawn first');
  assert.deepEqual(W.pass.quiet.scene.cast.filter(c => c.who === 'clancat').map(c => c.at), ['crowd-left', 'entrance', 'ferns'],
    'the runner at `crowd-left`, furthest back, before the one at the entrance');
  t.diagnostic(allScenes().length + ' scenes, ' + LOOKS6.length + ' looks, ' + pairs + ' pairs that meet, in ' + met.size + ' scenes');
});

/* ------------------------------------------------------------------ every variant */

const PASS_CASES = [{ clean: false, quiet: false }, { clean: true, quiet: false }, { clean: false, quiet: true }, { clean: true, quiet: true }];

test('every variant has its lines: the pass (55 or not, with the crowd or quiet), every not-yet (first, second, later; better, close, plain, or the number alone), after the pass (55 or not)', () => {
  PASS_CASES.forEach(v => {
    const fs_ = play(W.pass, k => !!v[k]), text = fs_.map(frameText).join(' | ');
    assert.equal(fs_.length, v.quiet ? 4 : 3, JSON.stringify(v));
    assert.ok(v.clean ? /Every one\. Not one missed\. Like \{Murmur\}chime\./.test(text) && !/\{right\}/.test(text) : /\{name\}paw\. Every Count up to ten times ten, and \{right\} of them right\./.test(text), JSON.stringify(v) + ': ' + text);
    assert.equal(/the whole Clan comes running/.test(text), v.quiet, 'the Clan comes running only in a quiet sitting');
    assert.match(text, /Every tail in the crowd goes straight up\. Tonight, the Clan gathers again\. For your warrior name\./);
    assert.match(frameText(fs_[fs_.length - 1]), /^Far above, .*Did \{petname\} PASS\? Somebody TELL me, darlings!$/, 'Princess Waffles last');
    if (v.quiet) assert.ok(fs_.indexOf(W.pass.quiet) === 1, 'the yowl right after Glintstar’s words, before the raised tails');
  });
  ['first', 'second', 'later'].forEach(nth => [['better'], ['close'], ['plain'], []].forEach(tone => {
    const keys = [nth].concat(tone), fs_ = play(W.notYet, k => keys.includes(k));
    assert.equal(fs_.length, 3, keys.join(' '));
    assert.equal(fs_[0], W.notYet[nth]);
    assert.equal(fs_[1], tone.length ? W.notYet[tone[0]] : W.notYet.frames[1].else);
    assert.equal(fs_[2], W.notYet.frames[2]);
    assert.match(frameText(fs_[0]), /^Not yet, \{name\}paw\. The Counts will wait for you\. /, 'Glintstar first, warm');
  }));
  assert.match(frameText(W.notYet.first), /Took me THREE tries\. Don’t tell anyone\.$/);
  assert.match(frameText(W.notYet.second), /I \{murmur\}ed mine in the den every night, remember\? You heard me\.$/);
  assert.match(frameText(W.notYet.later), /The Counts aren’t going anywhere\. And neither am I\.$/);
  assert.match(frameText(W.notYet.frames[1].else), /\{Right\} right today\. Fifty is a pass\.$/);
  assert.match(frameText(W.notYet.better), /\{Right\} right today\. Fifty is a pass\. Last time it was \{last\}!$/);
  assert.match(frameText(W.notYet.close), /\{Right\} right today\. Fifty is a pass\. So close\. Just \{short\} more next time\.$/);
  assert.match(frameText(W.notYet.plain), /You worked hard on every one\.$/);
  ['better', 'close', 'plain'].concat([null]).forEach(k => assert.match(frameText(k ? W.notYet[k] : W.notYet.frames[1].else), /^Tallyheart walks with you toward the Hollow\./, 'walking her to the Hollow'));
  assert.deepEqual(W.notYet.frames[2].say.map(b => b.text), ['These were the tricky ones.', 'Let’s practice {tricky} in the Training Hollow. I’ll ask those first. Then try again, whenever you like.']);
  // after the pass: 55, its own words; 50 to 54, her number (good news); under 50, none (decision 49)
  [['clean'], ['number'], []].forEach(keys => {
    const fs_ = play(W.afterPass, k => keys.includes(k));
    assert.equal(fs_.length, 1, 'after the pass: one page');
    // (chapter 11: her warrior name on a re-sit, {name}{ending}: {name}paw until the Ceremony, the token reads paw)
    assert.equal(frameText(fs_[0]), keys[0] === 'clean' ? 'Every one. Not one missed. Like {Murmur}chime.'
      : keys[0] === 'number' ? '{Right} right, {name}{ending}. Your pass is yours for good. These were the tricky ones.'
        : 'Your pass is yours for good, {name}{ending}. These were the tricky ones.', keys.join(' '));
  });
});

test('her number only when it is good news (decision 49): for every not-yet score and every last score, a number only at 45 or more or when better than last time; “Last time” only when better; “So close” only on 47 to 49; none of it counts her attempts', (t) => {
  const cat = PROFILES['she-cat'];
  let said = 0, quiet = 0;
  for (let right = 0; right <= 49; right++) for (let last = -1; last <= 49; last++) {
    const lastN = last < 0 ? null : last;
    ['first', 'second', 'later'].forEach(nth => {
      if ((nth === 'first') !== (lastN == null)) return;   // only a first not-yet has no finished sitting before it
      const k = notYetKeys(right, lastN, nth);
      const tok = resultTokens(right, lastN);
      const lines = play(W.notYet, x => k.keys.includes(x)).map(f => frameLines(f).map(l => fill(l, cat, tok)).join(' ')).join(' ');
      const label = right + ' right, last ' + lastN + ', ' + nth + ': ' + lines;
      const numbers = Array.from({ length: 56 }, (_, n) => countWords(n)).filter(w => w !== 'one');
      const hasNumber = /\d/.test(lines.replace(/\d+s\b/g, '')) || /\bFifty\b/.test(lines) || numbers.some(w => new RegExp('\\b' + w + '\\b', 'i').test(lines.replace(/\bTHREE tries\b/, '')));
      if (k.number) {
        said++;
        assert.ok(lines.includes(cap1(countWords(right)) + ' right today. Fifty is a pass.'), label);
      } else {
        quiet++;
        assert.ok(!hasNumber, 'no number: ' + label);
        assert.ok(lines.includes('You worked hard on every one.'), label);
      }
      assert.equal(lines.includes('Last time it was ' + (lastN == null ? '' : countWords(lastN)) + '!'), k.better, 'last time only when better: ' + label);
      assert.equal(/So close\./.test(lines), !k.better && right >= 47, 'so close only on 47 to 49: ' + label);
      if (/So close\./.test(lines)) assert.ok(lines.includes('Just ' + countWords(50 - right) + ' more next time.'), label);
      // warm, never shaming, never counting her attempts (the old tom counts his own: his joke)
      assert.doesNotMatch(lines.replace(/Took me THREE tries\./, ''), /\b(wrong|fail\w*|bad|mistakes?|only|missed \w+ of|tries|attempts?|second time|third time|again and again|score)\b/i, label);
      assert.match(lines, /Then try again, whenever you like\.$/, label);
    });
  }
  t.diagnostic(said + ' not-yets say her number, ' + quiet + ' do not');
  assert.ok(said > 0 && quiet > 0);
  // after the pass, a sitting again: her number only on a passing score (50 to 54; 55 is clean, no number)
  const numbers = Array.from({ length: 56 }, (_, n) => countWords(n)).filter(w => w !== 'one');
  for (let right = 0; right <= 55; right++) {
    const keys = right === 55 ? ['clean'] : right >= 50 ? ['number'] : [];
    const lines = play(W.afterPass, x => keys.includes(x)).map(f => frameLines(f).map(l => fill(l, cat, resultTokens(right, 52))).join(' ')).join(' ');
    const hasNumber = /\d/.test(lines) || numbers.some(w => new RegExp('\\b' + w + '\\b', 'i').test(lines));
    assert.equal(hasNumber, right >= 50 && right < 55, 'after the pass, ' + right + ' right: ' + lines);
    if (right < 55) assert.match(lines, /Your pass is yours for good/, right + ': the pass is hers for good');
  }
});

test('the result’s keys are the ones E.warriorResult names: driven through real attempts, the story plays the variant’s frames', (t) => {
  if (typeof E.warriorResult !== 'function') { t.skip('E.warriorResult is the engine’s, not built yet'); return; }
  const at = (n, right, extra) => Object.assign({ n, at: 1000 * n, done: 1000 * n + 500, finished: true, answered: 55, right, passed: right >= 50, missed: [[7, 8], [6, 7], [8, 8]].slice(0, Math.min(3, 55 - right)), ms: 3000, seen: false }, extra || {});
  const cases = [
    { attempts: [at(1, 44)], want: ['first', 'plain'] },
    { attempts: [at(1, 46)], want: ['first'] },
    { attempts: [at(1, 48)], want: ['first', 'close'] },
    { attempts: [at(1, 30), at(2, 40)], want: ['second', 'better'] },
    { attempts: [at(1, 48), at(2, 44)], want: ['second', 'plain'] },
    { attempts: [at(1, 48), at(2, 46)], want: ['second'] },
    { attempts: [at(1, 40), at(2, 41), at(3, 49)], want: ['later', 'better'] },
    { attempts: [at(1, 52)], kind: 'pass', want: [] },
    { attempts: [at(1, 55)], kind: 'pass', want: ['clean'] },
    { attempts: [at(1, 40), at(2, 51)], kind: 'pass', want: ['quiet'] },
    { attempts: [at(1, 40), at(2, 55)], kind: 'pass', want: ['clean', 'quiet'] },
    { attempts: [at(1, 52), at(2, 53)], kind: 'afterPass', want: ['number'] },
    { attempts: [at(1, 52), at(2, 49)], kind: 'afterPass', want: [] },
    { attempts: [at(1, 52), at(2, 12)], kind: 'afterPass', want: [] },
    { attempts: [at(1, 40), at(2, 52), at(3, 55)], kind: 'afterPass', want: ['clean'] }
  ];
  cases.forEach(c => {
    const cat = E.blankCat({ name: 'Moon' });
    cat.warrior = { sitting: null, attempts: c.attempts, passedAt: 0 };
    const p = c.attempts.find(a => a.passed);   // passedAt: her first pass
    if (p) cat.warrior.passedAt = p.done;
    const r = E.warriorResult(cat, STORIES), v = r && r.variant;
    assert.ok(v && Array.isArray(v.keys), 'E.warriorResult gives variant.keys');
    const kind = c.kind || 'notYet';
    assert.equal(v.kind, kind);
    const has = k => v.keys.includes(kind + '.' + k);
    const keys = RESULTS[kind].filter(k => k !== 'frames' && has(k));
    assert.deepEqual(keys.sort(), c.want.slice().sort(), c.attempts.map(a => a.right).join(', ') + ': ' + v.keys.join(' '));
    const frames = play(W[kind], has);
    assert.ok(r.tokens && typeof r.tokens.tricky === 'string', 'the result’s tokens, {tricky} among them');
    const tok = r.tokens;
    frames.forEach(f => frameLines(f).forEach(l => assert.doesNotMatch(fill(l, cat, tok), /[{}]/, l)));
  });
});

/* ------------------------------------------------------------------ words */

test('text tokens are only the allowed ones: the cat’s anywhere on screen, the result’s only on a result’s pages, {a} and {b} only in the sitting’s remembered lines; each result token only where its news is', () => {
  const bad = [];
  LINES.forEach(x => tokensIn(x.text).forEach(k => { if (!x.ok.includes(k)) bad.push(x.where + ': {' + k + '}'); }));
  assert.deepEqual(bad, []);
  // {Murmur} and {murmur} only as {Murmur}chime and {murmur}ed
  LINES.forEach(x => (String(x.text).match(/\{(Murmur|murmur)\}\w*/g) || []).forEach(m => assert.ok(['{Murmur}chime', '{murmur}ed'].includes(m), x.where + ': ' + m)));
  // where each result token is
  const where = k => FRAMES.filter(({ f }) => frameLines(f).some(l => tokensIn(l).includes(k))).map(x => x.where).sort();
  assert.deepEqual(where('right'), ['pass.frames[0].else']);
  assert.deepEqual(where('Right'), ['afterPass.number', 'notYet.better', 'notYet.close', 'notYet.frames[1].else']);
  assert.deepEqual(where('last'), ['notYet.better']);
  assert.deepEqual(where('Last'), []);
  assert.deepEqual(where('short'), ['notYet.close']);
  assert.deepEqual(where('tricky'), ['notYet.frames[2]']);
  assert.deepEqual(where('petname'), ['pass.frames[3]'], 'Waffles says her petname');
  // (chapter 11: her warrior name where she may have one, a re-sit's halfway and after the pass, and only as {name}{ending})
  assert.deepEqual(where('ending'), ['afterPass.frames[0].else', 'afterPass.number', 'halfway']);
  LINES.forEach(x => (String(x.text).match(/\{\w+\}\{ending\}|\{ending\}/g) || []).forEach(m => assert.equal(m, '{name}{ending}', x.where + ': ' + m)));
  // {Right} and {Last} start a sentence; {right}, {last}, {short} and {tricky} never do
  LINES.forEach(x => {
    const s = String(x.text);
    ['Right', 'Last'].forEach(k => { const i = s.indexOf('{' + k + '}'); if (i >= 0) assert.ok(i === 0 || /[.!?]\s$/.test(s.slice(0, i)), x.where + ': {' + k + '} starts a sentence'); });
    ['right', 'last', 'short', 'tricky'].forEach(k => { const i = s.indexOf('{' + k + '}'); if (i >= 0) assert.ok(i > 0 && !/[.!?]\s$/.test(s.slice(0, i)), x.where + ': {' + k + '} is mid-sentence'); });
  });
  // the remembered lines name the fact, every one
  ['remembered', 'rememberedSlow'].forEach(k => W.counts[k].filter(Boolean).forEach(l => assert.deepEqual(tokensIn(l), ['a', 'b'], k + ': ' + l)));
});

/* Every line she might read, filled for a cat, with stand-in result numbers. */
function filledLines(cat) {
  const tok = resultTokens(47, 41);
  return LINES.map(x => ({ where: x.where, text: x.counts ? E.fill(x.text, cat, { a: 7, b: 8 }) : fill(x.text, cat, tok) }));
}

test('rendered for a she-cat, a tom and a Murmur, every line reads right: no token left, no bare she, her, he, him or his, no stray space or straight quote, every sentence starting with a capital; the tortie is Mutterchime for a cat named Murmur', () => {
  const print = !!process.env.PRINT_WARRIOR, problems = [];
  Object.keys(PROFILES).forEach(kind => filledLines(PROFILES[kind]).forEach(x => {
    if (print) console.log(kind + ' ' + x.where + ': ' + x.text);
    const s = x.text;
    if (/[{}]/.test(s)) problems.push(kind + ' ' + x.where + ': unfilled token: ' + s);
    if (/\s{2,}|\s[,.!?]/.test(s)) problems.push(kind + ' ' + x.where + ': stray space: ' + s);
    if (/['"]/.test(s)) problems.push(kind + ' ' + x.where + ': straight quote: ' + s);
    if (/pawpaw/i.test(s)) problems.push(kind + ' ' + x.where + ': pawpaw');
    if (/^\p{Ll}/u.test(s) || /[.!?]\s+\p{Ll}/u.test(s)) problems.push(kind + ' ' + x.where + ': lowercase start: ' + s);
    if (/\b(\w+)\s+\1\b/i.test(s)) problems.push(kind + ' ' + x.where + ': doubled word: ' + s);
  }));
  assert.deepEqual(problems, []);
  // no pronoun on screen outside a token: she is "you", and Glintstar, Tallyheart and the tortie are named
  LINES.forEach(x => assert.doesNotMatch(String(x.text).replace(/\{[^}]*\}/g, ''), /\b(she|her|hers|herself|he|him|his|himself)\b/i, x.where));
  const m = filledLines(PROFILES.murmur), mt = m.map(x => x.text).join(' ');
  assert.ok(/Mutterchime/.test(mt) && !/Murmurchime/.test(mt), 'Mutterchime, never her own name');
  assert.ok(/I muttered mine in the den every night/.test(mt));
  assert.ok(/Halfway, Murmurpaw\./.test(mt), 'and she is still Murmurpaw herself');
  const tom = filledLines(PROFILES.tom).map(x => x.text).join(' ');
  assert.ok(/Halfway, Stormpaw\./.test(tom) && /Did Sir Pounce-a-lot PASS\?/.test(tom) && /Not yet, Stormpaw\./.test(tom));
  assert.ok(/Moonpaw\. Every Count up to ten times ten, and forty-seven of them right\./.test(filledLines(PROFILES['she-cat']).map(x => x.text).join(' ')));
});

test('words a frame for a reader of eight: at most 30 on any page (an aside included), no balloon over 25, captions she can letter on the panel (95 characters, a whole sentence); the first opening about 70 words; the pauses short', (t) => {
  const tom = PROFILES.tom, tok = resultTokens(48, 47, [7, 8]);
  const count = f => frameLines(f).map(l => fill(l, tom, tok)).reduce((n, l) => n + words(l), 0);
  const rows = [];
  FRAMES.forEach(({ where, f }) => {
    let n = count(f);
    // the opening's one panel after a sitting set aside: the aside goes at the start of Tallyheart's balloon
    if (/^open\.(again|quiet)/.test(where)) n += Math.max(...Object.values(W.aside).map(words));
    rows.push(where + ' ' + n);
    assert.ok(n <= WORDS_MAX, where + ': ' + n + ' words');
    (f.say || []).forEach(b => assert.ok(words(fill(b.text, tom, tok)) <= BALLOON_MAX, where + ': a balloon of ' + words(b.text) + ' words'));
    (f.caption || []).forEach(c => {
      const s = fill(c, tom, tok);
      assert.ok(s.length <= CAPTION_CHARS, where + ': caption of ' + s.length + ' characters');
      assert.ok(E.endsSentence(s), where + ': “' + s + '” ends a sentence');
    });
    assert.ok((f.caption || []).length + (f.say || []).length <= 3, where + ': at most three boxes');
  });
  t.diagnostic(rows.join(', '));
  const first = W.open.first.reduce((n, f) => n + count(f), 0);
  t.diagnostic('the first opening: ' + first + ' words');
  assert.ok(first >= 60 && first <= 80, 'about 70 words: ' + first);
  // the aside sits in Tallyheart's balloon with "Every Count, same as before. I'm right here."
  ['again', 'quiet'].forEach(k => {
    const b = W.open[k][0].say.filter(x => x.who === 'tallyheart');
    assert.deepEqual(b.map(x => x.text), ['Every Count, same as before. I’m right here.'], k + ': Tallyheart’s balloon, where the aside goes first');
    Object.values(W.aside).forEach(a => assert.ok(words(a + ' ' + b[0].text) <= BALLOON_MAX));
  });
  // the pauses come and go (2.5 s, 3.5 s over six words): a line each, short
  Object.keys(W.beats).forEach(k => W.beats[k].forEach(l => assert.ok(words(l) <= 10, 'beat ' + k + ': ' + l)));
  W.open.resume.forEach(b => assert.ok(words(b.text) <= 6, 'resume'));
  Object.values(W.aside).forEach(l => assert.ok(words(l) <= 8, 'aside: ' + l));
});

test('the sitting’s lines are short and kind: about one right answer in five gets a word (blank entries between the lines), never two lines running; the four miss lines take turns, never say wrong, never count what is left, never claim she has it now', () => {
  const C = W.counts;
  ['praise', 'fast'].forEach(k => {
    const L = C[k], full = L.filter(l => l !== '');
    assert.ok(L.every(l => typeof l === 'string'), k + ': strings');
    assert.equal(full.length / L.length, 0.2, k + ': one in five has a word');
    L.forEach((l, i) => assert.ok(!(l && L[(i + 1) % L.length]), k + ': never two lines running (' + i + ')'));
    assert.equal(new Set(full).size, full.length, k + ': each line once');
    full.forEach(l => assert.ok(words(l) <= 5, k + ': ' + l));
  });
  assert.ok(C.praise.includes('Yes.') && C.fast.includes('Quick as a pounce!'), 'the design’s own: “Yes.” and “Quick as a pounce!”');
  // her hard facts: four lines each, in turn, a blank between (every other one she gets right gets a word)
  ['remembered', 'rememberedSlow'].forEach(k => {
    const L = C[k], full = L.filter(Boolean);
    assert.equal(L.length, 8, k + ': four lines, four blanks');
    L.forEach((l, i) => assert.equal(!!l, i % 2 === 0, k + ': a line, then a blank (' + i + ')'));
    assert.equal(new Set(full).size, 4, k + ': four different lines');
    full.forEach(l => assert.ok(words(l) <= 12, k + ': ' + l));
  });
  assert.equal(C.remembered[0], 'Last time, {a} × {b} made you stop and think. Not today!', 'the chapters’ own, with its comma');
  assert.equal(C.rememberedSlow[0], '{a} × {b} again, and you got it. It’s getting easier.');
  assert.deepEqual(C.missLast, [
    'There. Now you’ve seen it. On we go.',
    'That’s a tricky one. On to the next.',
    'There it is. You’re doing fine. Keep going.',
    'Now it’s in the sand. On we go.'
  ]);
  C.missLast.concat([C.last.missLast]).forEach(l => {
    assert.ok(words(l) <= 8, l);
    assert.doesNotMatch(l, /\b(wrong|oops|mistake|bad|left|more to go|remaining|got it|know it now|remember it now|counts? as)\b/i, l);
    assert.doesNotMatch(l, /\d/, l + ': no number of misses or of what is left');
  });
  assert.equal(C.last.missLast, 'There. A hundred. And that’s every Count!');
  assert.doesNotMatch(C.last.missLast, /On we go|next|Keep going/, '10 × 10 is the last: nothing comes next');
});

test('the lines through the Counts runner: Tallyheart’s word on about one right answer in five; her hard facts remembered (quick, “Not today!”; slow, “getting easier”); 10 × 10 asked under “At last:” and Glintstar’s “Ten times ten.”, its right “A HUNDRED!”, its miss its own line', () => {
  const def = { id: 'warrior', teacher: 'tallyheart', ground: 'sand', ask: '{a} × {b}', praise: W.counts.praise, fast: W.counts.fast, remembered: W.counts.remembered, rememberedSlow: W.counts.rememberedSlow, missLast: W.counts.missLast };
  // 54 right answers: a word on about one in five. A child who is always quick, always slow, or quick and
  // slow in any steady turn never hears two words running; a child who mixes them at random seldom does
  const facts = [];
  for (let a = 1; a <= 10; a++) for (let b = a; b <= 10; b++) if (!(a === 10 && b === 10)) facts.push({ a, b });
  const sitting = quick => {
    const st = E.counts.start(def, { facts, set: 'warrior', mode: 'warrior', now: 1 });
    const said = facts.map((q, i) => E.counts.answer(st, def, q.a * q.b, quick(i) ? 2500 : 6000, 1000 + i).line);
    return { n: said.filter(Boolean).length, twice: said.filter((l, i) => l && said[i + 1]).length, said };
  };
  const STEADY = { quick: () => true, slow: () => false, 'quick, slow': i => i % 2 === 0, 'slow, quick': i => i % 2 === 1,
    'quick, quick, slow': i => i % 3 !== 2, 'slow, slow, quick': i => i % 3 === 2, 'quick, slow, slow': i => i % 3 === 0, 'slow, quick, quick': i => i % 3 !== 0 };
  Object.keys(STEADY).forEach(k => {
    const r = sitting(STEADY[k]);
    assert.ok(r.n >= 10 && r.n <= 12, k + ': ' + r.n + ' of 54 right answers get a word');
    assert.equal(r.twice, 0, k + ': never two words running: ' + r.said.map(l => l || '·').join(' '));
  });
  const rnd = E.util.rng(48), runs = [];
  for (let t = 0; t < 300; t++) { const p = rnd(), bits = facts.map(() => rnd() < p); runs.push(sitting(i => bits[i])); }
  runs.forEach(r => assert.ok(r.n >= 9 && r.n <= 13, r.n + ' words'));
  const mean = runs.reduce((m, r) => m + r.twice, 0) / runs.length;
  assert.ok(mean <= 1.2, 'two words running, on average ' + mean.toFixed(2) + ' times a sitting');
  // her hard facts: the runner's remembered lines, in Tallyheart's words, in turn: every other one gets a
  // word (quick, "Not today!"; slow, "getting easier"), and none comes back every few questions. With this
  // mix of quick and slow, no line is said twice in twelve hard facts; a steadily quick (or slow) player
  // hears all four before one comes again, eight hard facts later (below)
  const HARD = [[7, 8], [6, 7], [6, 8], [4, 7], [3, 8], [7, 9], [8, 9], [6, 6], [4, 8], [7, 7], [3, 7], [8, 8]];
  const st2 = E.counts.start(def, { facts: HARD.map(([a, b]) => ({ a, b, hard: true })), set: 'warrior', mode: 'warrior' });
  const heard = HARD.map(([a, b], i) => E.counts.answer(st2, def, a * b, i % 3 === 2 ? 7000 : 2000, i + 1));
  assert.equal(heard[0].line, 'Last time, 7 × 8 made you stop and think. Not today!');
  assert.deepEqual(heard.map(r => !!r.line), HARD.map((_, i) => i % 2 === 0), 'every other hard fact gets a word');
  heard.forEach((r, i) => assert.equal(r.lineKind, i % 3 === 2 ? 'rememberedSlow' : 'remembered'));
  const lines = heard.map(r => r.line).filter(Boolean);
  assert.equal(new Set(lines.map(l => l.replace(/\d+ × \d+/, '·'))).size, lines.length, 'this mix: no line twice in a sitting’s twelve: ' + lines.join(' | '));
  // steadily quick, steadily slow: six words in twelve hard facts, the four lines each once before any
  // comes again, and a line said again only eight hard facts on
  [['quick', 2000, 'remembered'], ['slow', 7000, 'rememberedSlow']].forEach(([how, ms, kind]) => {
    const stS = E.counts.start(def, { facts: HARD.map(([a, b]) => ({ a, b, hard: true })), set: 'warrior', mode: 'warrior' });
    const said = HARD.map(([a, b], i) => E.counts.answer(stS, def, a * b, ms, i + 1)).map(r => r.line ? r.line.replace(/\d+ × \d+/, '·') : null);
    const at = said.map((l, i) => l ? i : -1).filter(i => i >= 0);
    assert.equal(at.length, 6, how + ': six words');
    assert.equal(new Set(at.slice(0, 4).map(i => said[i])).size, 4, how + ': the four lines before any comes again');
    at.forEach((i, k) => at.slice(0, k).forEach(j => { if (said[i] === said[j]) assert.ok(i - j >= 8, how + ': “' + said[i] + '” again only ' + (i - j) + ' hard facts on'); }));
    assert.ok(at.every(i => W.counts[kind].filter(Boolean).map(l => l.replace(/\{a\} × \{b\}/, '·')).includes(said[i])), how + ': its own lines');
  });
  const slow = E.counts.start(def, { facts: [{ a: 6, b: 7, hard: true }], set: 'warrior', mode: 'warrior' });
  assert.equal(E.counts.answer(slow, def, 42, 7000, 1).line, '6 × 7 again, and you got it. It’s getting easier.');
  // 10 × 10, last: its prompt, its shout, its miss line (a sitting never requeues: requeues at the most)
  const fin = Object.assign({ a: 10, b: 10 }, W.counts.last);
  const st3 = E.counts.start(def, { facts: [fin], set: 'warrior', mode: 'warrior' });
  const q = E.counts.question(st3);
  assert.deepEqual(E.promptLines(def, def, q), [{ text: 'At last:', kind: 'caption' }, { who: 'glintstar', text: 'Ten times ten.', kind: undefined }]);
  const right = E.counts.answer(st3, def, 100, 9000, 1);
  assert.deepEqual(right.balloons, [{ who: 'player', text: 'A HUNDRED!', kind: 'shout' }], 'the hundred is hers, right but slow too');
  assert.ok(right.done);
  const st4 = E.counts.start(def, { facts: [fin], set: 'warrior', mode: 'warrior' });
  st4.requeues['10x10'] = E.MAX_REQUEUE;
  const miss = E.counts.answer(st4, def, 90, 9000, 1);
  assert.equal(miss.line, 'There. A hundred. And that’s every Count!');
  assert.equal(st4.queue.length, 1, 'never asked again');
  // the miss lines in turn, through the engine's E.warriorAsk when it is built
  if (typeof E.warriorAsk === 'function' && typeof E.warriorDef === 'function') {
    const D0 = E.warriorDef(STORIES);
    ['praise', 'fast', 'remembered', 'rememberedSlow', 'missLast'].forEach(k => assert.deepEqual(D0[k], W.counts[k], 'E.warriorDef takes ' + k + ' from the story'));
    assert.ok(!('fastAfterMiss' in D0));
    const qs = [[7, 8], [6, 7], [8, 9], [4, 7], [3, 8], [6, 9]].map(([a, b]) => ({ a, b, table: Math.max(a, b) }));
    const s5 = E.counts.start(D0, { facts: qs, set: 'warrior', mode: 'warrior' });
    qs.forEach(f => { s5.requeues[f.a + 'x' + f.b] = E.MAX_REQUEUE; });
    const got = qs.map((f, i) => { const D = E.warriorAsk(D0, s5, E.counts.question(s5), STORIES); return E.counts.answer(s5, D, 1, 3000, i + 1).line; });
    assert.deepEqual(got, W.counts.missLast.concat(W.counts.missLast.slice(0, 2)), 'the four take turns');
  }
});

test('the lettering is the design’s own (sections 1, 3, 4 and 5): every sentence on screen is in docs/warrior-counts.md (or, for the runner’s lines, the chapters’ own), but for the few the story adds (its captions for the walk and Waffles, the sparse praise, the practice line naming her Counts)', () => {
  const chapters = fs.readdirSync(path.join(ROOT, 'app/story')).filter(f => /^ch\d\d\.js$/.test(f)).map(f => fs.readFileSync(path.join(ROOT, 'app/story', f), 'utf8')).join(' ');
  const doc = norm(DOC + ' ' + chapters).replace(/\s+/g, ' ');
  const OWN = new Set([
    'Tallyheart walks with you toward the Hollow.', 'Far above, Princess Waffles leans over the railing.',
    'Good.', 'That’s it.', 'Steady paws.', 'Snap!', 'Just like that.', 'Fast as a sparrow.', 'Sure and quick.',
    'Let’s practice {tricky} in the Training Hollow.'
  ]);
  const missing = [];
  LINES.forEach(x => String(x.counts ? x.text.replace(/\{a\} × \{b\}(?= made)/, '7 × 8') : x.text).split(/(?<=[.!?:])\s+/).forEach(sent => {
    if (OWN.has(sent)) return;
    // (chapter 11: the design's {name}paw, which {name}{ending} reads until the Ceremony)
    const bare = norm(sent).replace(/[.!?:]$/, '').replace(/\{name\}\{ending\}/g, '{name}paw');
    if (!doc.includes(bare)) missing.push(x.where + ': ' + sent);
  }));
  assert.deepEqual(missing, []);
  // and the design's lines are all here
  const all = LINES.map(x => x.text).join(' | ');
  ['The whole Clan crowds around the fountain. This time, you sit at its foot.', 'Tallyheart sits down right beside you.',
    'To become a warrior, a cat answers every Count up to ten times ten, and gets nine in every ten right.',
    'If one gets away from you, we’ll scratch it out together, like always. It won’t count as right. But it won’t stop you, either.',
    'The Clan gathers at the fountain again.', 'The camp is quiet. Glintstar waits on the fountain, and {Murmur}chime comes to watch.',
    'Every Count, same as before. I’m right here.', 'It’s been a while, so we start fresh.', 'You’ve been practicing, so we start fresh.', 'Where were we? Ah, yes.',
    'One paw done. Your whiskers are wide awake now.', 'Three paws done. Just one more paw.', 'Halfway, {name}{ending}.', 'Big stretch first. Front paws out, tail up. Like this.',
    '{name}paw. Every Count up to ten times ten, and {right} of them right.', '{Murmur}chime yowls, and the whole Clan comes running.',
    'Every tail in the crowd goes straight up.', 'Tonight, the Clan gathers again. For your warrior name.', 'Did {petname} PASS? Somebody TELL me, darlings!',
    'Not yet, {name}paw. The Counts will wait for you.', 'Took me THREE tries. Don’t tell anyone.', 'I {murmur}ed mine in the den every night, remember? You heard me.',
    'The Counts aren’t going anywhere. And neither am I.', 'You worked hard on every one.', 'These were the tricky ones.',
    // (chapter 11: the three re-sit lines say her warrior name, {name}{ending}, {name}paw until the Ceremony)
    '{Right} right, {name}{ending}. Your pass is yours for good.', 'Your pass is yours for good, {name}{ending}.', 'This was the tricky one.',
    'Every one. Not one missed. Like {Murmur}chime.', 'At last:', 'Ten times ten.', 'A HUNDRED!',
    'Last time, {a} × {b} made you stop and think. Not today!', '{a} × {b}! That one used to be tricky.', 'No stopping on {a} × {b} this time.',
    'Quick! {a} × {b} used to take a while.', '{a} × {b} again, and you got it. It’s getting easier.', 'You worked out {a} × {b}. Good.',
    '{a} × {b} was tricky last time. You got it.', '{a} × {b}. It gets easier every time.']
    .forEach(l => assert.ok(all.includes(l), 'the design’s line: ' + l));
});

test('our own world and the tone: no Warriors or Wings of Fire words, nothing from the names checks’ lists; “The Warrior Counts” is its only name, never “assessment”, “test” or “score”; nobody says wrong; the not-yet never shames', () => {
  const screen = LINES.map(x => x.text).join(' | ');
  const boards = FRAMES.map(({ f }) => f.board).join(' | ');
  [screen, boards].forEach(s => assert.doesNotMatch(s, /\b(assessment|twolegs?|kittypets?|starclan|fresh-kill|thunderpath|ironsnakes?|whisker-lengths?|warriors’ den|not a whisker|thin as a whisker|skywing|nightwing|seawing|rainwing|mudwing|sandwing|icewing)\b/i));
  assert.doesNotMatch(screen, /\b(test(ed|s)?|exam|quiz|score[sd]?|points?|grade|fail\w*|wrong|bad|lose|lost|stupid)\b/i, 'warm words only');
});
