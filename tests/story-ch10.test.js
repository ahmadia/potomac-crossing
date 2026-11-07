/* Story tests for chapter 10: node --test
 *
 * Checks app/story/ch10.js against the frame contract in docs/build.md, against the story
 * (docs/chapters/10-the-gathering.md, Draft v0.5, final) and against its spec
 * (docs/chapters/10-the-gathering.spec.md, v0.4, the build's contract): the frame graph (frames shown only
 * `when` they match, their `else`s, the pairs by `worry`, `foundPuddle` and the fourth pick, the roll call's
 * counted conditions written out as chains of `when` and `else`, the optional scene numbered ahead of the screen
 * it rejoins), one interaction per frame, the choices (only `ch10Best` sets a flag) and the sticky flags
 * (`foundPuddle` with `ch10Puddle` on Puddle's last screen only); the five card picks (their flags, their right
 * cards, their nudges, an answer line for every right card, a right card in every file a cat can hold); the
 * Counts frames and sets exactly as the spec has them, with every test its build notes list (the warm-up's hard
 * pick and fillers and its own-pair slip, the 7s' order, step-offs, words, timing, fillers, giveaways, the Moon
 * Ferry's tables, pictures, cheers and fillers, the sixty, Puddle's riddle, 21 typed answers or 22 with Puddle,
 * the Hollow's “Clutches of seven · the 7s” and the tenth mark only after the lesson); the skip-counts (the five
 * clutches, four paws aboard, the roll call's seven forepaws), the tree's pair and the confession, and the pages
 * she taps once, each with its target in the art; Puddle's card given again; every `when`; the speakers (Puddle
 * “Two big eyes” and “The big-footed dragon” until named, Mama “A soft voice” until named, the leaders by
 * variant and listed first, Granny by the chapter's names, her cheer variant 3's face and voice); tokens,
 * storyboards, word counts, captions and boxes, the art vocabulary camera by camera, the staging (nobody on the
 * Hollow's rim, the river never dark, Sprinkle where the case can be seen), depth (casts back to front), the time
 * of day, the generated storyboard, every frame rendered with everyone in the picture, the beats in order on
 * every path, the book (8 to 10 sentences on every path), chapter 5's page for a cat who met Puddle here, the
 * teaser for the Warrior Ceremony, the Warrior Counts opening when the chapter is finished, and whole
 * play-throughs through the engine, from built cats and from the golden's fifteen readings of chapters 1 to 9.
 *
 *   PRINT_STORY=1 node --test tests/story-ch10.test.js   prints the whole chapter, rendered three ways.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
require('../app/ui.js');   // its pure parts: the speakers' labels and voices, the taps' hit test, the corner, the Warrior Counts' hub
const E = PC.engine;
const A = PC.art;
const UI = PC.ui;
const story = PC.story.ch10;
const frames = story.frames;
const ids = Object.keys(frames);
const ch04 = PC.story.ch04, ch05 = PC.story.ch05, ch06 = PC.story.ch06, ch07 = PC.story.ch07, ch08 = PC.story.ch08, ch09 = PC.story.ch09;
const STORIES = [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05, ch06, ch07, ch08, ch09, story];

/* ------------------------------------------------------------------ the contract */

// The flags a `when` may test: chapters 1 to 9's, and chapter 10's own (the sticky `ch10Puddle`, the choice
// flag `ch10Best`, and the five pick flags, each the card she answered a claim with).
const FLAGS1 = {
  stepOut: ['chase', 'slow'],
  spokeUp: [true, false],
  joinReason: ['learn', 'count', 'brave'],
  specialty: ['noticing', 'sneaking', 'climbing', 'swimming', 'friends'],
  worry: ['small', 'water', 'talk', 'shiny']
};
const FLAGS2 = { ch2SaidAloud: [true, false], ch2Path: ['bridge', 'river'], ch2Stone: ['nose', 'chin'] };
const FLAGS3 = { ch3Told: [true, false] };
const SIX = ['foundSquall', 'foundPuddle', 'foundWisp', 'foundSleet', 'foundHail', 'foundMizzle'];
const FOUND = {}; SIX.forEach(k => { FOUND[k] = [true, false]; });
const FLAGS9 = { ch4CaughtFly: [true, false], ch5First: ['otters', 'heron'], ch5Roof: [true, false], ch7Flew: [true, false], ch9Roof: [true, false] };
const PICK_FLAGS = ['ch10PickFlew', 'ch10PickMoon', 'ch10PickScale', 'ch10PickBig', 'ch10PickOut'];
const BEST = ['sprinkle', 'friends', 'truth', 'counts'];
const FLAGS10 = { ch10Puddle: [true, false], ch10Best: BEST };
const FLAGS = Object.assign({}, FLAGS1, FLAGS2, FLAGS3, FOUND, FLAGS9, FLAGS10, { lessonClean: ['ch10-sevens'] });
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'pick', 'ask', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'sfxAt', 'sfxRead', 'gift', 'when', 'else', 'sets', 'card'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things', 'also']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat', 'sloshbank', 'reedclan', 'thymeleaf', 'groveclan'];
const GROWN = ['tallyheart', 'glintstar', 'thymeleaf', 'grizzled', 'sloshbank', 'waffles', 'groveclan', 'reedclan', 'murmurchime'];
const RIM_ANCHORS = ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'];
const SETS = ['ch10-eights', 'ch10-sevens', 'ch10-ferry', 'ch10-sixty'];
// the warm-up, the lesson, the Moon Ferry and the sixty say none of their frame's lines again over the first question (the sixty
// since the final review's K2: said again, its two balloons ran Glintstar's first line under a 1080 x 720 iPad's top bar with Aa)
const NO_INTRO = ['ch10-eights', 'ch10-sevens', 'ch10-ferry', 'ch10-sixty'];
const TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
const WATER = { worry: 'water' }, NOT_WATER = { not: { worry: 'water' } };
const six = fn => { const o = {}; SIX.forEach(k => { o[k] = fn(k); }); return o; };
const NONE_SIX = six(() => false), ALL_SIX = six(() => true), ANY_SIX = { not: NONE_SIX };
const onlyOne = k => six(x => x === k), allBut = k => six(x => x !== k);
const DRAGONETS = ['squall', 'puddle', 'wisp', 'sleet', 'hail', 'mizzle'];
// the staging's own spots (the header's calls): Sprinkle a step behind our cat on the case's camera; our cat at the
// sky's foot, looking up, as the Mistscales rise
const SIDE = { x: 880, y: 860, h: 240 }, RISE = { x: 1330, y: 1090, h: 470 };
// the staging's other spots: our cat in Sprinkle's tail loop, Tallyheart nose to nose, Sprinkle in the clearing's middle
const LOOP = { x: 560, y: 956, h: 350 }, NOSE = { x: 900, y: 950, h: 352 }, MID = { x: 780, y: 880, h: 240 }, STEP = { x: 960, y: 860, h: 240 };
// (and Sprinkle shuffling out of the reeds, a step right of the heap's place, so her hurt wing shows)
const OUT = { x: 260, y: 960, h: 300 };
// the twenty cards every cat holds at the Gathering (the spec's section 3), and the ten only some do
const TWENTY = ['cant-fly', 'fox-flew', 'fox-brag', 'waffles-no-moon', 'fox-moon', 'heron-no-moon', 'tidy', 'reed-pile', 'stash', 'coil-diggers', 'tunnel', 'scale', 'glass',
  'four-a-night', 'sprinkle-scales', 'fur', 'prints-marsh', 'prints-sprinkle', 'otter-fox', 'heron-shapes'];
const TEN_MORE = ['dug-earth', 'prints-pile', 'prints-tracks', 'sleet-den', 'my-count', 'squall-shapes', 'puddle-paws', 'wisp-fox', 'mizzle-wing', 'hail-shapes'];
const HOME = {};
['ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09'].forEach(c => Object.keys(PC.story[c].cards || {}).forEach(id => { HOME[id] = c; }));

/* ------------------------------------------------------------------ helpers */

function exits(f) { return E.exits(f); }
function ways(f) { return f.else ? exits(f).concat([f.else]) : exits(f); }
function interactions(f) { return INTERACTIONS.filter(k => f[k] !== undefined); }
function capText(c) { return typeof c === 'string' ? c : c.text; }
function capWhen(c) { return typeof c === 'string' ? null : c.when || null; }
/* Every line of a frame, `when` variants included. */
function texts(f) {
  const out = [];
  (f.caption || []).forEach((c, i) => out.push({ where: 'caption ' + i, text: capText(c), when: capWhen(c) }));
  (f.say || []).forEach((b, i) => out.push({ where: 'say ' + i + ' (' + b.who + ')', text: b.text, who: b.who, when: b.when || null }));
  if (f.sfx) out.push({ where: 'sfx', text: f.sfx, sfx: true });
  return out;
}
function words(t) { return String(t).split(/\s+/).filter(w => /[\p{L}\p{N}{]/u.test(w)).length; }
function tokensIn(t) { return (String(t).match(/\{[^}]*\}/g) || []).map(s => s.slice(1, -1)); }
const T = id => texts(frames[id]).map(x => x.text).join(' ');
const castOf = (id, who) => frames[id].scene.cast.filter(c => c.who === who);
const at = id => ids.indexOf(id);
const camOf = id => frames[id].scene.set + '/' + frames[id].scene.cam;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const num = id => +id.slice(1, 4);
const fid = n => 'f' + String(n).padStart(3, '0');
const seq = (from, to) => ids.slice(at(from), at(to) + 1);
const clone = x => JSON.parse(JSON.stringify(x));
/* The frames that say this, in reading order; F: the one frame that does. */
function FF(re) { return ids.filter(id => re.test(T(id))); }
function F(re) {
  const hit = FF(re);
  assert.equal(hit.length, 1, 'exactly one frame says ' + re + ' (' + hit.join(' ') + ')');
  return hit[0];
}

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A mist stone in the moonlight.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'Seven sevens, forty-nine.' },
  // a player whose own Clan name is Murmur: the warrior is Mutterchime
  murmur: { name: 'Murmur', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Riffle juggling fish.' }
};
const FACT = { a: 7, b: 7, answer: 49, groups: 7, per: 7, thing: 'dragonet', things: 'dragonets', also: '' };
function fill(text, p) { return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : k in FACT ? FACT[k] : m)); }

/* Anything that reads badly once the tokens are filled (the chapter 1 rules). */
function badGrammar(text, isSfx) {
  const bad = [];
  if (/[{}]/.test(text)) bad.push('unfilled token');
  if (/(?<!\bif )\b(she|he) (are|were|have|do|don’t|aren’t|weren’t|haven’t)\b/i.test(text)) bad.push('pronoun/verb agreement');
  if (/\b(she|he)’re\b/i.test(text)) bad.push('she’re/he’re');
  if (/\bhisself\b|\btheirselves\b/i.test(text)) bad.push('bad reflexive');
  if (/\ban (tom|she-cat)\b/i.test(text)) bad.push('“an” before tom/she-cat');
  if (!isSfx && /\b(\w+)\s+\1\b/i.test(text)) bad.push('doubled word');
  if (/pawpaw/i.test(text)) bad.push('pawpaw');
  if (/\s{2,}|\s[,.!?]/.test(text)) bad.push('stray space');
  if (/['"]/.test(text.replace(/\*\*/g, ''))) bad.push('straight quote');
  if (!isSfx) {
    const start = text.replace(/\*\*/g, '').replace(/^[“"‘'(—]+/, '');
    if (!start.startsWith('…') && /^\p{Ll}/u.test(start) && !/^—/.test(text)) bad.push('starts lowercase');
    if (/[.!?][”"’']?\s+[“"‘(]?(\p{Ll})/u.test(text)) bad.push('sentence starts lowercase');
  }
  return bad;
}

/* Every Counts line of the chapter's own sets. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast', 'fastAfterMiss', 'again', 'remembered', 'rememberedSlow'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l, ok: FACT_TOKENS })));
    ['miss', 'missLast', 'helpIntro', 'helpIntroFar', 'againIntro', 'done', 'fillIntro'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: FACT_TOKENS }); });
    ['firstPrompt', 'prompt'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: PROMPT_TOKENS }); });
    (d.facts || []).forEach((f, i) => {
      if (Array.isArray(f)) return;
      ['prompt', 'retryPrompt'].forEach(pk => { if (typeof f[pk] === 'string' || Array.isArray(f[pk])) [].concat(f[pk]).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' ' + pk + ' ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS })); });
      [].concat(f.right || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' right ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
      ['miss', 'missLast'].forEach(k => { if (f[k]) out.push({ set: sid, where: 'fact ' + i + ' ' + k, text: f[k], ok: PROMPT_TOKENS }); });
    });
  });
  return out;
}
const pickIds = ids.filter(id => frames[id].pick);
// the two captions that run on by design: the badger print's, split at its colon, and the voice in the stones'
const RUNS_ON = ['five toes in a row, and claws made for digging.'];
function everyText(fn) {
  ids.forEach(id => texts(frames[id]).forEach(x => fn(id, Object.assign(x, { runsOn: RUNS_ON.includes(x.text) }))));
  ids.forEach(id => {
    const f = frames[id];
    if (f.choice) f.choice.options.forEach((o, i) => fn(id, { where: 'option ' + i, text: o.label }));
    if (f.skip && f.skip.prompt) fn(id, { where: 'skip prompt', text: f.skip.prompt });
    if (f.scratch) fn(id, { where: 'tap prompt', text: E.tapWords(f).prompt });
    if (f.ask) {
      fn(id, { where: 'ask prompt', text: E.askWords(f.ask).prompt });
      f.ask.pairs.forEach((p, i) => { fn(id, { where: 'question ' + i, text: p[0], who: f.ask.who }); fn(id, { where: 'answer ' + i, text: p[1], who: f.ask.to }); });
    }
    if (f.pick) {
      fn(id, { where: 'pick prompt', text: E.pickWords(f).prompt });
      fn(id, { where: 'claim', text: f.pick.claim, who: 'reynard' });
      f.pick.nudges.forEach((l, i) => fn(id, { where: 'nudge ' + i, text: l, who: 'tallyheart' }));
      Object.keys(f.pick.own || {}).forEach(k => fn(id, { where: 'own nudge ' + k, text: f.pick.own[k], who: 'tallyheart' }));
    }
  });
  countsLines().forEach(x => fn('counts ' + x.set, x));
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  ['title', 'chapterTitle', 'dream', 'noDream'].forEach(k => { if (story.book[k]) fn('book', { where: k, text: story.book[k] }); });
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* The choices: the low raft's (only a cat who has never found Puddle: peek, or sit tight), Sprinkle's goodbye
 * (light: both to the next screen), and Tallyheart's (`ch10Best`). */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const PEEK = choiceAt(/^Peek between the logs\.$/)[0];
const BYE = choiceAt(/^“Fly SAFE!”$/)[0];
const MOST = choiceAt(/^“The Counts!”$/)[0];
/* The option a reader takes: `peek` (true: under the raft), `light` (0 or 1) at the goodbye, `best` at Tallyheart's. */
function choiceFor(id, o) {
  o = o || {};
  if (id === PEEK) return o.peek ? 0 : 1;
  if (id === MOST) return BEST.indexOf(o.best || 'sprinkle');
  return o.light || 0;
}
/* The card a reader answers a claim with, on a walk: `o.cards[flag]`, else the n-th of the pick's right cards. */
function cardFor(id, o) {
  const pk = frames[id].pick;
  return (o && o.cards && o.cards[pk.flag]) || pk.right[((o && o.n) || 0) % pk.right.length];
}
/* A cat as the walks below take her: these flags, and the 7s learned with no help unless `clean: false`. */
function catFor(flags, o) {
  return { flags: Object.assign({}, flags), look: { sex: 'she' }, lessons: (o || {}).clean === false ? {} : { 'ch10-sevens': { finished: true, noHelp: true } } };
}
/* The frames a reader with these flags walks through, in order (the engine's own E.landing passes over a frame
 * whose `when` doesn't match, or turns it to its `else`); a frame's `sets` are flags from then on, and so is the
 * card a pick takes. The flags as they ended are on the result (`.flags`). */
function walk(flags, o) {
  o = o || {};
  const cat = catFor(flags, o);
  const out = [];
  let id = story.start;
  for (let guard = 0; guard < 600 && id; guard++) {
    id = E.landing(cat, story, id);
    const f = frames[id];
    out.push(id);
    if (f.sets) Object.assign(cat.flags, f.sets);
    if (f.end) { out.flags = cat.flags; return out; }
    if (f.choice) {
      const opt = f.choice.options[choiceFor(id, o)];
      assert.ok(E.options(f, cat).some(x => x.option === opt), id + ': the option she takes is one she sees');
      Object.assign(cat.flags, opt.sets || {});
      id = opt.next;
    } else if (f.pick) {
      cat.flags[f.pick.flag] = cardFor(id, o);
      id = f.pick.next;
    } else id = exits(f)[0];
  }
  throw new Error('no end');
}
/* What a walk put on screen: for each frame, the lines its reader saw there, and what she did. */
function walkLines(flags, o) {
  o = o || {};
  const cat = catFor(flags, o);
  return walk(flags, o).map(id => {
    const f = frames[id];
    const bal = E.balloons(f, cat), caps = E.captions(f, cat);
    const row = { id, kind: E.kindOf(f), lines: caps.concat(bal.map(b => b.text)).concat(f.sfx ? [f.sfx] : []),
      // (an ask letters the frame's captions again beside each tap's question and answer, two balloons: ui.js renderAsk)
      boxes: caps.length + (f.ask ? Math.max(bal.length, 2) : bal.length), balloons: bal };
    if (f.choice) { row.options = E.options(f, cat).map(x => E.optionLabel(x.option, cat)); Object.assign(cat.flags, f.choice.options[choiceFor(id, o)].sets || {}); }
    if (f.scratch) row.tap = E.tapWords(f).prompt;
    if (f.pick) { row.claim = f.pick.claim; cat.flags[f.pick.flag] = cardFor(id, o); }
    if (f.sets) Object.assign(cat.flags, f.sets);
    return row;
  });
}
/* Every combination of told or kept, the specialty, the worry, the dragonets found (none; each one alone; two;
 * each five of the six; all six), and at the low raft, for a cat who has never found Puddle, a peek or sitting tight:
 * 920, her stone by her nose or under her chin by turns, each pick's card and her answer to Tallyheart by turns. */
const FOUND_SETS = [[], ['foundSquall'], ['foundPuddle'], ['foundWisp'], ['foundSleet'], ['foundHail'], ['foundMizzle'], ['foundSquall', 'foundHail']]
  .concat(SIX.map(k => SIX.filter(x => x !== k)), [SIX.slice()]);
const COMBOS = [];
for (const ch3Told of FLAGS3.ch3Told) for (const specialty of FLAGS1.specialty) for (const worry of FLAGS1.worry) for (const found of FOUND_SETS) {
  for (const peek of (found.includes('foundPuddle') ? [false] : [true, false])) {
    const n = COMBOS.length;
    const flags = Object.assign({ ch3Told, specialty, worry, ch2Stone: n % 2 ? 'chin' : 'nose', ch2Path: 'bridge', ch7Flew: true }, six(k => found.includes(k)));
    COMBOS.push({ flags, found, peek, o: { peek, n, best: BEST[n % 4], light: n % 2 } });
  }
}
const comboName = c => JSON.stringify(c.flags) + (c.peek ? ' peek' : '');
// a spread of the combinations for the heavier checks
const SOME = COMBOS.filter((c, i) => i % 9 === 0);
const meetsPuddle = c => !c.flags.foundPuddle && c.peek;

/* ------------------------------------------------------------------ reading through the engine */

const Sp = UI.speakers;
const labelFor = (b, cat, st) => Sp.label(b, { cat, story: st || story, fill: x => E.fill(x, cat) });
function saidOn(st, id, cat) {
  const f = st.frames[id], cast = (f.scene && f.scene.cast) || [];
  return E.balloons(f, cat).map(b => {
    const mine = cast.filter(c => c && c.who === b.who), m = mine[b.nth] || mine[0];
    return { who: b.who, label: labelFor(Object.assign({}, b, { variant: m && m.variant }), cat, st), text: E.fill(b.text, cat), kind: b.kind, variant: m && m.variant,
      pitch: Sp.pitch(b.who, m && m.variant) };
  });
}
function lessonRows(cat, st, def, state, answers, ms) {
  const seen = {}, out = [];
  while (!E.counts.done(state)) {
    const q = E.counts.question(state), k = q.a + 'x' + q.b;
    const i = seen[k] = (seen[k] || 0) + 1;
    const a = answers && answers[k] && answers[k][i - 1] != null ? answers[k][i - 1] : q.answer;
    const t = ms && ms[k] != null ? ms[k] : (ms && ms.all) || 2000;
    const D = E.questionDef(def, q, st, STORIES);
    const prompt = E.promptLines(def, D, q).map(l => Object.assign({}, l, { label: l.who ? labelFor({ who: l.who, variant: l.variant }, cat, st) : null, text: E.fill(l.text, cat) }));
    const picture = E.lessonPicture(D, q, q.lit || 0), light = E.lightSteps(D, q);
    const r = E.counts.answer(state, D, a, t, 1);
    E.logAnswer(cat, r.entry);
    const row = { k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, picture, light, line: E.fill(r.line, cat), kind: r.lineKind,
      balloons: (r.balloons || []).map(b => Object.assign({}, b, { text: E.fill(b.text, cat) })), res: r, teacher: E.teacherOf(def, D), entry: r.entry };
    if (!r.correct) { row.help = E.helpPlan(def, D, q, r); row.steps = E.helpSteps(row.help); }
    out.push(row);
    if (r.done) E.recordLesson(cat, state);
    else cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: st.id, state };
  }
  return out;
}
const homeOf = setId => STORIES.find(s => s.counts && s.counts[setId]);
function play(cat, setId, answers, ms) {
  const home = homeOf(setId);
  const { def, state } = E.chapterLesson(cat, home, setId, 1, STORIES);
  return lessonRows(cat, home, def, state, answers, ms);
}
const ks = rows => rows.map(r => r.k);
const pairKey = k => k.replace(/^[A-Z]:/, '').replace('✗', '').split('x').map(Number).sort((a, b) => a - b).join('x');
function readStory(cat, st, o) {
  o = o || {};
  const rows = [];
  let t = o.t || 1000;
  for (let guard = 0; guard < 800; guard++) {
    const id = E.frameId(cat, st), f = st.frames[id], kind = E.kindOf(f);
    const row = { id, kind, f, caps: E.captions(f, cat).map(c => E.fill(c, cat)), heard: E.captionsRead(f, cat).map(c => E.fill(c, cat)), say: saidOn(st, id, cat),
      cards: E.cardsOn(f, cat, st, STORIES), file: E.cards(cat, STORIES).map(c => c.id), counts: cat.counts.length, sfx: f.sfx || '',
      scene: f.scene ? E.resolveScene(f.scene, cat, STORIES) : null, flags: Object.assign({}, cat.flags) };
    rows.push(row);
    if (o.onRow) o.onRow(row, cat);
    if ((o.stop && id === o.stop) || kind === 'end') break;
    t += 10;
    if (kind === 'skip') { row.skip = E.skipFor(f.skip, cat); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'ask') { row.asked = []; for (let n = 1; n <= E.askView(f.ask, 99).total; n++) row.asked.push(E.askView(f.ask, n).pair); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'next') assert.ok(E.next(cat, st, t), id);
    else if (kind === 'scratch') { row.tap = E.tapWords(f); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'choice') {
      const opts = E.options(f, cat);
      row.options = opts.map(x => E.fill(E.optionLabel(x.option, cat), cat));
      const want = choiceFor(id, o), ix = opts.findIndex(x => x.index === want);
      row.picked = ix >= 0 ? ix : 0;
      assert.ok(E.choose(cat, st, opts[row.picked].index, t), id);
    } else if (kind === 'pick') {
      const v = E.pickView(f, cat, STORIES);
      row.pick = { claim: v.claim, word: v.word, right: v.right.slice(), file: E.fileOrder(cat, STORIES), nudges: [] };
      let wrongs = 0;
      if (o.wrongPicks) {
        const wrong = E.fileOrder(cat, STORIES).filter(cid => !f.pick.right.includes(cid)).slice(0, o.wrongPicks);
        wrong.forEach(cid => { const r = E.pick(cat, st, cid, t, wrongs, STORIES); assert.ok(r && r.right === false, id + ': ' + cid + ' is wrong'); row.pick.nudges.push(r.line); wrongs = r.wrongs; row.pick.glow = r.glow; });
      }
      const card = o.pickCard ? o.pickCard(id, v.right, cat) : v.right[0];
      const r = E.pick(cat, st, card, t, wrongs, STORIES);
      assert.ok(r && r.right === true, id + ': ' + card + ' answers ' + v.claim);
      row.picked = card;
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'a mist stone in the moonlight' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      row.lesson = lessonRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat at chapter 10's first page: chapters 1 to 9 finished, her flags, the Counts she learned (chapter 4's tens to
 * chapter 9's eights and doses, played through the engine, with these answers and times in chapter 9's lesson and
 * its rubs and flaps: what today's warm-up finds hard), and her Case File as chapters 4 to 9 left it (`o.cards`:
 * exactly these, each from its own chapter). */
const CH5_CARDS = ['prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh'];
const CH6_CARDS = ['reed-pile', 'coil-diggers'];
const CH7_CARDS = ['waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel'];
const CH8_CARDS = ['fox-brag', 'stash', 'glass'];
function before10(flags, o) {
  o = o || {};
  const cat = E.blankCat({ now: 1, id: 'c10' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5, ch06: 6, ch07: 7, ch08: 8, ch09: 9 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch2SaidAloud: true, ch3Told: true, caseFileOpen: true, ch5First: 'otters', ch7Flew: true }, flags || {});
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  const ms = { all: 1500 };
  ['ch04-tens', 'ch05-nines', 'ch06-threes', 'ch07-pile', 'ch07-threes', 'ch07-sixes', 'ch07-gone'].forEach(id => play(cat, id, null, ms));
  play(cat, cat.flags.ch3Told === false ? 'ch07-riffle' : 'ch07-dragon', null, ms);
  ['ch08-pile', 'ch08-sixes', 'ch08-fours', 'ch08-gone'].forEach(id => play(cat, id, null, ms));
  play(cat, cat.flags.ch3Told === false ? 'ch08-riffle' : 'ch08-snip', null, ms);
  play(cat, 'ch09-fours', null, ms);
  play(cat, 'ch09-eights', o.eights, o.eightsMs || ms);
  if (cat.flags.foundMizzle) play(cat, 'ch09-mizzle', o.mizzle, ms);
  play(cat, 'ch09-dew', o.dew, ms);
  play(cat, 'ch09-rubs', o.rubs, ms);
  play(cat, 'ch09-flaps', o.flaps, ms);
  const f = cat.flags, give = (list, ch, at0) => list.forEach((cid, i) => E.giveCard(cat, cid, ch, at0 + i));
  if (o.cards) {
    ['ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09'].forEach((ch, k) => give(o.cards.filter(cid => HOME[cid] === ch), ch, 10 + 20 * k));
    return cat;
  }
  give(Object.keys(ch04.cards).filter(cid => !ch04.cards[cid].when || E.matches(ch04.cards[cid].when, cat)), 'ch04', 10);
  give(CH5_CARDS.concat(f.foundPuddle ? ['puddle-paws'] : [], f.foundWisp ? ['wisp-fox'] : [], f.specialty === 'climbing' ? ['prints-tracks'] : []), 'ch05', 30);
  give(CH6_CARDS.concat(f.foundSleet ? ['sleet-den'] : []), 'ch06', 50);
  give(CH7_CARDS.filter(cid => !(o.noMyCount && cid === 'my-count')), 'ch07', 70);
  give((f.foundHail ? ['hail-shapes'] : []).concat(CH8_CARDS), 'ch08', 90);
  if (f.foundMizzle) give(['mizzle-wing'], 'ch09', 110);
  return cat;
}
function fresh(flags, o) {
  const cat = before10(flags, o);
  E.startChapter(cat, story, 500);
  return cat;
}
/* Read chapter 10: `o` is a route (`peek`, `light`, `best`: as choiceFor), with `stop`, `answers`, `ms`, `dream`, `t`,
 * `pickCard` and `wrongPicks` as readStory takes them. */
function read(cat, o) { return readStory(cat, story, o || {}); }
const rowAt = (rows, id) => rows.find(r => r.id === id);
const idsOf = rows => rows.map(r => r.id);
function readWords(rows) {
  const out = [];
  rows.forEach(r => {
    out.push(...r.caps, ...r.say.map(b => b.label + ': ' + b.text), ...(r.options || []), ...r.cards.map(c => c.line), r.sfx);
    (r.asked || []).forEach(p => out.push(...p));
    if (r.pick) out.push('Reynard: ' + r.pick.claim, ...r.pick.nudges.map(n => 'Tallyheart: ' + n));
    (r.lesson || []).forEach(l => out.push(...l.prompt.map(p => (p.label || '') + ': ' + p.text), l.line, ...l.balloons.map(b => (b.who ? labelFor(b, null) : '') + ': ' + b.text), l.help ? l.help.intro : ''));
  });
  return out.join('\n');
}
function reading(flags, o, co) {
  const cat = fresh(flags, co), rows = read(cat, o);
  return { cat, rows, w: readWords(rows), ids: idsOf(rows) };
}
const countsAt = set => ids.filter(id => frames[id].counts && frames[id].counts.set === set);
/* The golden's fifteen readings of chapters 1 to 9 (tests/fixtures/make-ch09-golden.js), each cat as it ended, read
 * with nothing drawn: real files, real Counts, real flags, every specialty and worry, told and kept. */
let goldenCats = null;
function golden() {
  if (goldenCats) return goldenCats.map(clone);
  const G9 = require('./fixtures/make-ch09-golden.js');
  const nod = { memo: new Map(), recheck: () => [], scene: () => 'x', counts: () => 'x', sand: () => 'x', card: () => 'x' };
  const ctx = G9.context9(PC, { draw: nod });
  goldenCats = G9.SCRIPTS9.map(s => { const r = G9.run9(ctx, s); return Object.assign(clone(r.end), { scriptName: s.name }); });
  return goldenCats.map(clone);
}

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch10');
  assert.equal(story.number, 10);
  assert.equal(story.title, 'The Gathering');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.equal(ids.length, 157, 'every panel, the optional scene, the twins and the roll call’s chains');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'names', 'number', 'start', 'teaser', 'title']);
  // Puddle chapter 5's label from his feet to his name; Granny, chapter 5's otter variant 3, the only otter who speaks
  assert.deepEqual(story.names, { puddle: 'The big-footed dragon', otter: 'Granny' });
  assert.equal(story.names.puddle, ch05.names.puddle, 'chapter 5’s own label');
  assert.deepEqual(story.cards, {}, 'no new card: chapter 5’s puddle-paws is given again');
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch10'), order.indexOf('ch09') + 1, 'chapter 10 follows chapter 9');
  assert.ok(Object.values(frames).every(f => !/\bSTUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 920);
  // the page loads it after chapter 9 and before the Warrior Counts, and the offline copy has it
  const scripts = require('./_load.js').scripts();
  assert.ok(scripts.indexOf('app/story/ch09.js') >= 0 && scripts.indexOf('app/story/ch09.js') < scripts.indexOf('app/story/ch10.js'));
  assert.ok(scripts.indexOf('app/story/ch10.js') < scripts.indexOf('app/story/warrior.js'), 'the Warrior Counts’ tag stays after the chapters');
  assert.ok(scripts.indexOf('app/art/sets/ferry.js') >= 0 && scripts.indexOf('app/art/sets/island.js') > scripts.indexOf('app/art/sets/ferry.js'));
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  ['ch10.js', 'warrior.js'].forEach(f => assert.match(sw, new RegExp('\'\\./app/story/' + f.replace('.', '\\.') + '\'')));
  ['ferry.js', 'island.js'].forEach(f => assert.match(sw, new RegExp('\'\\./app/art/sets/' + f.replace('.', '\\.') + '\'')));
  // the Warrior Counts open after this chapter
  assert.equal(PC.warrior && PC.warrior.after, 'ch10');
});

test('frame ids run f001 to f157 in reading order, with no letters; every edge goes forward; the numbers have no gaps; the optional scene sits ahead of the screen it rejoins', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  ids.map(num).forEach((n, i) => assert.equal(n, i + 1, 'frame number ' + (i + 1) + ' is missing'));
  // the low raft: “Peek between the logs.” turns to "Under the raft" at the next number, “Sit tight.” to the push-off,
  // where the scene's last screen leads too
  const [peek, sit] = frames[PEEK].choice.options.map(o => o.next);
  const PUSH = F(/^Granny pushes off with her long pole/);
  assert.deepEqual([peek, sit, frames[PEEK].else], [fid(num(PEEK) + 1), PUSH, PUSH]);
  seq(peek, ids[at(PUSH) - 1]).forEach(id => ways(frames[id]).forEach(n => assert.ok(at(n) <= at(PUSH), id + ': the scene leads on only to the push-off')));
  assert.equal(frames[ids[at(PUSH) - 1]].scratch.next, PUSH);
  assert.deepEqual([num(PUSH) - num(peek), at(PUSH) - at(PEEK) - 1], [9, 9], 'nine panels under the raft');
});

// The frames shown only `when` they match, in reading order, with their `when` (and `else`): each path's own screens,
// the specialty chain, the worry lines, the pairs and the roll call's counted conditions.
const NEXT_OF = (id, k) => fid(num(id) + k);
const WHEN_FRAMES = [
  ['f002', WATER], ['f014', WATER, 'f015'], ['f015', NOT_WATER], ['f016', WATER],
  ['f019', { foundPuddle: true }, 'f020'], ['f020', { foundPuddle: false }], ['f021', WATER], ['f022', { foundPuddle: false }, 'f032'],
  ['f033', WATER, 'f034'], ['f034', NOT_WATER], ['f037', { worry: 'small' }],
  ['f050', { specialty: 'noticing' }], ['f051', { specialty: 'climbing' }], ['f052', { specialty: 'sneaking' }], ['f053', { specialty: 'swimming' }], ['f054', { specialty: 'friends' }],
  ['f055', { worry: 'talk' }], ['f068', { ch10PickBig: 'stash' }, 'f069'], ['f069', { not: { ch10PickBig: 'stash' } }], ['f077', { worry: 'talk' }]
].concat(SIX.map((k, i) => [fid(100 + i), onlyOne(k), fid(101 + i)]), [['f106', ANY_SIX, 'f113']], SIX.map((k, i) => [fid(107 + i), { [k]: true }]),
  [['f113', ALL_SIX, 'f114']], SIX.map((k, i) => [fid(114 + i), allBut(k), fid(115 + i)]), [['f124', { worry: 'shiny' }]]);
// the pairs: [first, second, its when, the twin's]: one picture drawn twice by a flag, side by side
const PAIRS = [['f014', 'f015', WATER, NOT_WATER], ['f019', 'f020', { foundPuddle: true }, { foundPuddle: false }], ['f033', 'f034', WATER, NOT_WATER], ['f068', 'f069', { ch10PickBig: 'stash' }, { not: { ch10PickBig: 'stash' } }]];

test('exactly one interaction per frame (the taps, the picks and the questions included), no unknown keys, and a frame `when`, `else` or `sets` only where the story and the spec have one', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    assert.equal(f.look, undefined, id + ': chapter 10 has no look frame');
    assert.equal(f.file, undefined, id + ': her Case File was opened in chapter 4');
    assert.equal(f.sfxAt, undefined, id + ': every sound is lettered where the page puts it');
  });
  const whens = ids.filter(id => frames[id].when);
  assert.deepEqual(whens.map(id => [id, frames[id].when]), WHEN_FRAMES.map(w => [w[0], w[1]]));
  assert.deepEqual(ids.filter(id => frames[id].else).map(id => [id, frames[id].else]), WHEN_FRAMES.filter(w => w[2]).map(w => [w[0], w[2]]));
  whens.forEach(id => {
    assert.notEqual(id, story.start);
    const keys = w => Object.keys(w).forEach(k => { if (k === 'not') keys(w.not); else assert.ok(FLAGS[k] || PICK_FLAGS.includes(k), id + ': when ' + k); });
    keys(frames[id].when);
    assert.equal(exits(frames[id]).length, frames[id].choice ? 2 : 1, id + ': one way on (a choice some cats never see: its two)');
  });
  PAIRS.forEach(([a, b, wa, wb]) => {
    assert.deepEqual([frames[a].when, frames[b].when], [wa, wb], a + ' ' + b);
    assert.equal(num(b) - num(a), 1, a + ' and ' + b + ': side by side');
    assert.equal(frames[a].else, b, a + ' → ' + b + ' (else)');
  });
  // the flags set by reaching a frame, for good: `foundPuddle` and `ch10Puddle`, on Puddle's last screen only; the
  // gift on the frame that lays the stone on the moss; the one card on Puddle's storm-night panel
  assert.deepEqual(ids.filter(id => frames[id].sets).map(id => [id, frames[id].sets]), [['f031', { foundPuddle: true, ch10Puddle: true }]]);
  assert.deepEqual(ids.filter(id => frames[id].gift).map(id => [id, frames[id].gift]), [[F(/^Ten claw marks on the tree\./), 'mist-stone']]);
  assert.deepEqual(ids.filter(id => frames[id].card).map(id => [id, frames[id].card]), [['f028', 'puddle-paws']]);
  // only Tallyheart's question sets anything among the choices: `ch10Best`, replaced
  ids.filter(id => frames[id].choice).forEach(id => frames[id].choice.options.forEach((o, i) => assert.deepEqual(o.sets, id === MOST ? { ch10Best: BEST[i] } : {}, id + ' option ' + i)));
  assert.deepEqual(E.checkStory(story, STORIES), []);
});

test('a child who listens hears every sentence finished: the two sounds from off the island are said in words (`sfxRead`) on plain frames; every other page is heard as it is lettered', () => {
  assert.deepEqual(ids.filter(id => frames[id].sfxRead !== undefined).map(id => [id, frames[id].sfx, frames[id].sfxRead]),
    [[F(/^Back into the river he slinks/), 'BYE, GIANT SQUIRREL!', 'Bye, giant squirrel!'], [F(/^Out of the mist, from near and far, come small voices\./), 'HERE! HERE! HERE!', 'Here! Here! Here!']]);
  ids.filter(id => frames[id].sfxRead).forEach(id => { assert.equal(E.kindOf(frames[id]), 'next', id + ': a plain frame'); assert.deepEqual(E.captionsRead(frames[id], {}), E.captions(frames[id], {}).concat([frames[id].sfxRead]), id); });
  const some = [{ flags: { ch2Stone: 'nose' } }, { flags: { ch2Stone: 'chin', ch3Told: false, specialty: 'noticing', worry: 'small', foundHail: true, foundWisp: true } }, { flags: { ch3Told: true, worry: 'water', specialty: 'climbing' } }];
  ids.filter(id => !frames[id].sfxRead).forEach(id => {
    const f = frames[id];
    // a caption that does not end a sentence leads on into its balloon (“In camp:”) or into the caption after it (the
    // badger print, split at its colon; the voice in the stones, whose words are the next caption's quote), never into a sound
    (f.caption || []).map(capText).forEach((t, i, all) => {
      if (E.endsSentence(t)) return;
      assert.ok((/:$/.test(t) && ((f.say || []).length || i < all.length - 1)) || (/,$/.test(t) && /^“/.test(all[i + 1] || '')), id + ': “' + t + '” runs on');
    });
    some.forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), id + ': heard as it is lettered'));
  });
});

test('every next / option / else / input / counts / skip / scratch / ask / pick target exists, and every frame is reachable, by its exits or an else, and by some reader', () => {
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const byWay = new Set([story.start]), line = [story.start];
  while (line.length) ways(frames[line.pop()]).forEach(n => { if (!byWay.has(n)) { byWay.add(n); line.push(n); } });
  assert.deepEqual(ids.filter(id => !byWay.has(id)), []);
  // the frames reached only by an `else` (the storyboard boards each right after the frame whose else it is)
  const byExit = new Set([story.start]), line2 = [story.start];
  while (line2.length) exits(frames[line2.pop()]).forEach(n => { if (!byExit.has(n)) { byExit.add(n); line2.push(n); } });
  assert.deepEqual(ids.filter(id => !byExit.has(id)), ['f015', 'f020', 'f034', 'f069', 'f101', 'f102', 'f103', 'f104', 'f105', 'f106', 'f114', 'f115', 'f116', 'f117', 'f118', 'f119', 'f120']);
  const walked = new Set();
  for (const c of COMBOS) walk(c.flags, c.o).forEach(id => walked.add(id));
  assert.deepEqual(ids.filter(id => !walked.has(id)), [], 'frames no reader reaches');
});

test('the end is reachable from every frame, and there is exactly one end, the last frame', () => {
  const ends = ids.filter(id => frames[id].end);
  assert.deepEqual(ends.length, 1);
  const into = {};
  ids.forEach(id => ways(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  const ok = new Set(ends), stack = ends.slice();
  while (stack.length) (into[stack.pop()] || []).forEach(p => { if (!ok.has(p)) { ok.add(p); stack.push(p); } });
  assert.deepEqual(ids.filter(id => !ok.has(id)), [], 'frames that cannot reach the end');
  assert.equal(ends[0], ids[ids.length - 1], 'the end is the last frame');
});

test('every combination reaches the end with no frame that shows nothing; a pair is one picture with the flag’s difference only', () => {
  for (const c of COMBOS) {
    const name = comboName(c), rows = walkLines(c.flags, c.o);
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    rows.forEach(r => { if (r.kind !== 'end') assert.ok(r.lines.length > 0 || (r.options || []).length || r.tap || r.claim, r.id + ' shows nothing to ' + name); });
  }
  // the boarding: one picture, our cat standing still for her four paws, or stepping up for one tap
  assert.deepEqual(Object.assign({}, frames.f014.scene, { cast: null }), Object.assign({}, frames.f015.scene, { cast: null }));
  assert.deepEqual([castOf('f014', 'player')[0].pose, castOf('f015', 'player')[0].pose], ['stand', 'walk']);
  assert.equal(frames.f014.caption[0], frames.f015.caption[0]);
  // the low raft: his foot in the gap, or nobody there and Riffle's LOG thing
  assert.deepEqual([frames.f019.scene.opts, frames.f020.scene.opts], [{ moon: 14, low: true }, { moon: 14, low: true }]);
  assert.deepEqual([castOf('f019', 'puddle').map(c => [c.pose, c.at]), castOf('f020', 'puddle')], [[['foot', 'gap']], []]);
  assert.deepEqual([frames.f019.sfx, frames.f020.sfx, frames.f019.caption[0], frames.f020.caption[0]], ['Blub.', 'Blub.', 'The front raft rides low. Very low.', 'The front raft rides low. Very low.']);
  // the brave look and its twin: one picture, the water cat's two captions before the same two balloons
  assert.deepEqual(frames.f033.scene, frames.f034.scene);
  assert.deepEqual(frames.f033.say, frames.f034.say);
  // the fourth answer: Sloshbank in the picture for the stash, with his OURS? and its drip
  assert.deepEqual([castOf('f068', 'sloshbank').length, castOf('f069', 'sloshbank').length, frames.f068.sfx, frames.f069.sfx], [1, 0, 'Drip.', undefined]);
});

test('choices: three kinds, two or three a reading, labels short; only a cat who has never found Puddle peeks; Tallyheart’s question sets `ch10Best`', () => {
  const choiceIds = ids.filter(id => frames[id].choice);
  assert.deepEqual(choiceIds, [PEEK, BYE, MOST]);
  const L = id => frames[id].choice.options.map(o => o.label);
  assert.deepEqual(L(PEEK), ['Peek between the logs.', 'Sit tight.']);
  assert.deepEqual(L(BYE), ['“Fly SAFE!”', 'Hug her back, tight.']);
  assert.deepEqual(L(MOST), ['“Sprinkle.”', '“My friends.”', '“Finding the truth.”', '“The Counts!”']);
  choiceIds.forEach(id => {
    frames[id].choice.options.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(words(o.label) <= 8, id + ' option ' + i);
    });
    assert.equal(frames[id].choice.prompt, undefined, id);
  });
  // the light ones and Tallyheart's: every option to the next screen
  [BYE, MOST].forEach(id => assert.ok(frames[id].choice.options.every(o => o.next === ids[at(id) + 1]), id));
  assert.match(T(frames[PEEK].choice.options[0].next), /^You lie flat on the logs and peek down between them\./);
  // a spoken option is never echoed as a balloon on its outcome
  choiceIds.forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    if (said) (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    assert.deepEqual(p.filter(id => frames[id].choice), (c.flags.foundPuddle ? [] : [PEEK]).concat([BYE, MOST]), comboName(c));
    assert.equal(p.includes('f031'), meetsPuddle(c), comboName(c) + ': under the raft only for a peek');
    assert.equal(p.flags.ch10Best, c.o.best, comboName(c));
    assert.equal(!!p.flags.ch10Puddle, meetsPuddle(c), comboName(c));
  }
});

test('inputs, counts, skips, taps, asks and picks, in the story’s order, each as the spec has it', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  assert.equal(T(inputs[0]), 'What did {name}paw dream, the night of the Gathering?');
  const ph = frames[inputs[0]].input.placeholder;
  assert.ok(typeof ph === 'string' && ph.length <= 30, ph);
  // the Counts frames: the warm-up, the lesson, Puddle's riddle (optional: chapter 5's set), the Moon Ferry, the sixty
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => [id, frames[id].counts.set]), [['f004', 'ch10-eights'], ['f009', 'ch10-sevens'], ['f026', 'ch05-puddle'], ['f032', 'ch10-ferry'], ['f071', 'ch10-sixty']]);
  counts.forEach(id => {
    const set = frames[id].counts.set;
    assert.deepEqual(Object.keys(frames[id].counts).sort(), NO_INTRO.includes(set) ? ['intro', 'next', 'set'] : ['next', 'set'], id);
    if (NO_INTRO.includes(set)) assert.equal(frames[id].counts.intro, false, id);
    assert.ok(E.countsSet(set, story, STORIES), id + ': the counts set exists');
  });
  // three skip-counts: the five clutches, the four paws aboard (a water-worry cat), the roll call's forepaws
  const skips = ids.filter(id => frames[id].skip);
  assert.deepEqual(skips, ['f007', 'f014', 'f098']);
  const [five, board, roll] = skips.map(id => frames[id].skip);
  assert.deepEqual(five, { table: 7, groups: 5, thing: 'dragonet', things: 'dragonets', teacher: 'tallyheart', label: 'Count the next clutch.', prompt: '**Tap** the clutches.', carry: false, next: 'f008' });
  assert.deepEqual(board, Object.assign({}, ch05.frames.f042.skip, { next: 'f016' }), 'chapter 5’s own four paws aboard');
  const ROLL = [{ who: 'sprinkle' }].concat(...DRAGONETS.map((d, i) => [{ who: d, when: { [SIX[i]]: true } }, { who: d, shape: true, when: { [SIX[i]]: false } }]));
  assert.deepEqual(roll, { table: 5, groups: 7, teacher: 'mistscale', thing: 'claw', things: 'claws', label: 'Count the next forepaw.', prompt: '**Tap** each forepaw.', carry: false, who: ROLL, next: 'f099' });
  assert.deepEqual(E.skipView(five, 5).count, '7… 14… 21… 28… 35!');
  assert.deepEqual(E.skipView(E.skipFor(roll, { flags: {} }), 7).count, '5… 10… 15… 20… 25… 30… 35!');
  assert.deepEqual([1, 2, 3, 4].map(n => E.skipWords(board, n === 1).teacher), ['tallyheart', 'tallyheart', 'tallyheart', 'tallyheart']);
  // the roll call keeps seven, Sprinkle's first, each of the six found or a misty shape
  for (const c of COMBOS.filter((x, i) => i % 7 === 0)) {
    const sk = E.skipFor(roll, { flags: c.flags });
    assert.equal(sk.who.length, 7, comboName(c));
    assert.deepEqual(sk.who.map(w => w.who), ['sprinkle'].concat(DRAGONETS), comboName(c));
    sk.who.slice(1).forEach((w, i) => assert.equal(!!w.shape, !c.flags[SIX[i]], comboName(c) + ': ' + w.who));
  }
  // nothing kept up after a count: the five clutches turn to the tree's ask, whose balloon says “Thirty-five!”; the four
  // paws to the deck's “FOUR.”; the roll call to Mama's “Thirty-five.”
  skips.forEach(id => { assert.equal(frames[id].skip.keep, undefined, id); assert.equal(frames[id].skip.carry, false, id); });
  assert.ok(frames[five.next].ask, 'the five clutches turn to the tree');
  assert.match(T(five.next), /^Thirty-five! Now, a secret\./);
  assert.match(T(board.next), /^One\. Two\. Three\. FOUR\. You’re ON\./);
  assert.match(T(roll.next), /^Thirty-five\. And nobody’s missing\./);
  // the pages she taps once (the spec's one-tap table)
  const taps = ids.filter(id => frames[id].scratch);
  const ONE = [
    ['f015', 'paw', '**Tap** to step aboard.', 'Step aboard.'], ['f031', 'paw', '**Tap** to wave to Puddle.', 'Wave to Puddle.'],
    ['f039', 'nose', '**Tap** to dip your head, very politely.', 'Dip your head.'], ['f045', 'reeds', '**Tap** to pull the reeds off the luggage.', 'Pull the reeds off.'],
    ['f047', 'paw', '**Tap** to sit beside her.', 'Sit beside Sprinkle.'], ['f064', 'leaf', '**Tap** to show every Clan your glass.', 'Show every Clan your glass.'],
    ['f084', 'paw', '**Tap** to take a step with every Clan.', 'Take a step with every Clan.'], ['f089', 'mist', '**Tap** the mist.', 'Look at the mist.'],
    ['f093', 'tail', '**Tap** to cheer!', 'Cheer!']
  ].concat(DRAGONETS.map((d, i) => [fid(107 + i), 'nose', '**Tap** to say goodbye.', 'Say goodbye.']), [
    ['f113', 'nose', '**Tap** to bow back.', 'Bow back.'], ['f121', 'paw', '**Tap** to hold out your paws.', 'Hold out your paws.'],
    ['f122', 'stone', '**Tap** to tilt it.', 'Tilt the stone.'], ['f130', 'paw', '**Tap** to wave back.', 'Wave back.'], ['f131', 'paw', '**Tap** to step up.', 'Step up.'],
    ['f134', 'nose', '**Tap** to bow, with tremendous dignity.', 'Bow.'], ['f140', 'print', '**Tap** to sniff it, very carefully.', 'Sniff the print.'],
    ['f141', 'ears', '**Tap** to hug him.', 'Hug Riffle.'], ['f146', 'paw', '**Tap** to wave up at her.', 'Wave up at Waffles.'],
    ['f152', 'stone', '**Tap** to lay the mist stone on the moss.', 'Lay the stone on the moss.']
  ]);
  assert.deepEqual(taps.map(id => [id, frames[id].scratch.tap, frames[id].scratch.prompt, frames[id].scratch.label]), ONE);
  taps.forEach(id => {
    assert.deepEqual(Object.keys(frames[id].scratch).sort(), ['label', 'next', 'prompt', 'tap'], id);
    assert.deepEqual(E.tapWords(frames[id]), { kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label }, id + ': no miss line: the glow wobbles');
  });
  // the story's response to each is the next panel (chapter 6's call 13), or turns the page at once
  const after = (id, flags) => E.landing({ flags: Object.assign({}, flags) }, story, frames[id].scratch.next);
  assert.match(T(after('f045')), /^Out shuffles Sprinkle, her hurt wing drooping\./, 'the reeds off');
  assert.deepEqual(castOf(after('f064'), 'player').map(c => c.holds), ['glass'], 'the leaf open, the glass shining');
  assert.match(T(after('f089')), /^Out of the mist leans a great, gentle face/);
  assert.deepEqual([frames[after('f089')].scene.opts.tail, frames[after('f089')].scene.opts.mist], [true, 'thick'], 'the tip of a huge tail in the mist, on the next panel');
  assert.match(T(after('f093')), /^…and she FLIES\./);
  assert.match(T(after('f121')), /^The full moon shines on the pebble\./);
  assert.deepEqual(castOf(after('f121'), 'player').map(c => [c.holds, c.flash]), [['miststone', true]]);
  assert.match(T(after('f140')), /^Best Gathering EVER\./);
  assert.equal(after('f152'), F(/^Out on the island, the badger’s old track lies in the moonlight\./));
  // the asks: the tree's one pair, the confession's three
  const asks = ids.filter(id => frames[id].ask);
  assert.deepEqual(asks, ['f008', 'f079']);
  assert.deepEqual(frames.f008.ask, { who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Say the sevens with her.',
    pairs: [['Say them with me. Seven…', 'Fourteen, twenty-one, twenty-eight, thirty-five, forty-two… um… fifty-six, sixty-three, seventy!']], next: 'f009' });
  assert.deepEqual(frames.f079.ask, { who: 'snatch', to: 'snip', prompt: '**Tap** the weasels.', label: 'Hear the next bit.',
    pairs: [['Two each, every night, he said!', 'Up the TUNNEL!'], ['Keep it TIDY!', 'Leave the shiny bit by the pile!'], ['Then the dragon’s dry den is HIS!', 'And WE can’t even COUNT!']], next: 'f080' });
  // forty-nine is never said or drawn at the tree: the “um…” is where it goes
  assert.doesNotMatch(T('f008') + frames.f008.ask.pairs.join(' '), /forty-nine|49/i);
  assert.deepEqual(frames.f008.scene.opts, { marks: 9, glow: 'auto' });
  // the five picks
  assert.deepEqual(pickIds, ['f057', 'f059', 'f063', 'f067', 'f075']);
  // the order of the things she does, on the page
  const order = ['f004', 'f007', 'f008', 'f009', 'f014', PEEK, 'f026', 'f031', 'f032', 'f039', 'f045', 'f047', 'f057', 'f059', 'f063', 'f064', 'f067', 'f071', 'f075', 'f079', 'f084', 'f089', 'f093', 'f098',
    'f107', 'f113', 'f121', 'f122', BYE, 'f130', 'f131', 'f134', MOST, 'f140', 'f141', 'f146', 'f152', inputs[0]];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: the Counts moments, the skip-counts and asks, the picks, the one-tap pages
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), name = comboName(c), water = c.flags.worry === 'water', found = SIX.filter(k => p.flags[k]).length;
    assert.equal(p.filter(id => frames[id].counts).length, 4 + (meetsPuddle(c) ? 1 : 0), name + ': Counts moments');
    assert.equal(p.filter(id => frames[id].skip || frames[id].ask).length, 4 + (water ? 1 : 0), name + ': the skip-counts and the asks');
    assert.equal(p.filter(id => frames[id].pick).length, 5, name + ': five picks');
    assert.equal(p.filter(id => frames[id].scratch).length, 16 + (water ? 0 : 1) + (meetsPuddle(c) ? 1 : 0) + found + (found === 6 ? 1 : 0), name + ': one-tap pages');
  }
});

/* ------------------------------------------------------------------ the card picks */

test('the five card picks exactly as the spec has them (section 6): claim, right cards, nudges, flag, next; each claim lights one word, and its first nudge echoes it', () => {
  const P = id => frames[id].pick;
  assert.deepEqual(pickIds.map(P), [
    { claim: 'It FLEW out of your camp!', right: ['cant-fly', 'fox-brag', 'mizzle-wing'], own: { 'fox-flew': 'Hmm. That’s what HE says. Which card shows what YOU found out?' },
      nudges: ['Hmm. Does that one say if Sprinkle could FLY?', 'Think of Sprinkle, under the bridge. Could she fly?'], flag: 'ch10PickFlew', next: 'f058' },
    { claim: 'By the light of the MOON.', right: ['waffles-no-moon', 'heron-no-moon'], own: { 'fox-moon': 'Hmm. That’s what HE says. Who says different?' },
      nudges: ['Hmm. Does that one say anything about the MOON?', 'Who said there was NO moon? One stayed up ALL night with her nerves. One stands in the marsh.'], flag: 'ch10PickMoon', next: 'f060' },
    { claim: 'A dragon SCALE by your pile!', right: ['glass', 'scale', 'sprinkle-scales', 'wisp-fox'],
      nudges: ['Hmm. Does that one say anything about the SCALE?', 'What did you find in a heap, that shines just like the ‘scale’?'], flag: 'ch10PickScale', next: 'f064' },
    { claim: 'Only something BIG could take so much!',
      right: ['prints-sprinkle', 'stash', 'tunnel', 'coil-diggers', 'heron-shapes', 'prints-marsh', 'fur', 'four-a-night', 'prints-pile', 'prints-tracks', 'squall-shapes', 'puddle-paws', 'hail-shapes', 'my-count'],
      nudges: ['Hmm. Does that one say how BIG the thief was? Or how much it took?', 'Think of the prints. Big ones, and tiny ones.'], flag: 'ch10PickBig', next: 'f068' },
    { claim: 'I never even saw your pile! How could I get the prey OUT?',
      right: ['fox-brag', 'tunnel', 'coil-diggers', 'stash', 'heron-shapes', 'dug-earth', 'prints-pile', 'squall-shapes', 'hail-shapes', 'puddle-paws'],
      nudges: ['Hmm. Does that one say how the prey got OUT of our pile?', 'What goes UNDER our pile? Coil felt it.'], flag: 'ch10PickOut', next: 'f076' }
  ]);
  assert.deepEqual(pickIds.map(id => P(id).flag), PICK_FLAGS);
  assert.deepEqual(pickIds.map(id => E.pickWord(P(id).claim)), ['FLEW', 'MOON', 'SCALE', 'BIG', 'OUT']);
  assert.deepEqual(pickIds.map(id => E.pickWord(P(id).nudges[0].replace(/^Hmm\. /, ''))), ['FLY', 'MOON', 'SCALE', 'BIG', 'OUT'], 'the first nudge echoes the lit word (FLEW as FLY)');
  pickIds.forEach(id => {
    const f = frames[id];
    // who makes the claim and who nudges, their defaults, both speakers the page knows; Reynard in the picture; the claim his balloon's words
    assert.equal(f.pick.who, undefined, id); assert.equal(f.pick.by, undefined, id);
    const v = E.pickView(f, { flags: {}, cards: [] }, STORIES);
    assert.deepEqual([v.who, v.by], ['reynard', 'tallyheart'], id);
    [v.who, v.by].forEach(w => assert.ok(Sp.NAMES[w], id + ': ' + w + ' is a speaker'));
    assert.ok(castOf(id, 'reynard').length, id + ': Reynard in the picture');
    const his = (f.say || []).filter(b => b.who === 'reynard').map(b => b.text).join(' ');
    assert.ok(his.includes(E.pickWord(f.pick.claim)), id + ': the claim’s lit word is in his balloon on the panel: ' + his);
    assert.deepEqual(E.pickWords(f), { prompt: '**Pick a card** from your Case File.', label: 'Open your Case File and pick a card.' });
    assert.match(f.board, /THE PICK/, id);
    // the right cards: every one a card some chapter defines; `sleet-den` right for none; nothing needs my-count,
    // mizzle-wing or a card only some cats hold: every claim has right cards among the twenty every cat holds
    f.pick.right.forEach(cid => assert.ok(HOME[cid], id + ': ' + cid));
    assert.ok(!f.pick.right.includes('sleet-den'), id + ': sleet-den answers nothing (its line says only that he talks of a dry den)');
    assert.ok(f.pick.right.filter(cid => TWENTY.includes(cid)).length >= 2, id + ': two or more right cards every cat holds');
  });
  // the right cards among the twenty, as the spec counts them
  assert.deepEqual(pickIds.map(id => P(id).right.filter(cid => TWENTY.includes(cid))), [['cant-fly', 'fox-brag'], ['waffles-no-moon', 'heron-no-moon'], ['glass', 'scale', 'sprinkle-scales'],
    ['prints-sprinkle', 'stash', 'tunnel', 'coil-diggers', 'heron-shapes', 'prints-marsh', 'fur', 'four-a-night'], ['fox-brag', 'tunnel', 'coil-diggers', 'stash', 'heron-shapes']]);
  // the Grown-ups corner has words for every value of every pick flag, built from the picks themselves
  const W = UI.flagWords;
  pickIds.forEach(id => Object.keys(HOME).forEach(cid => assert.ok(W[P(id).flag] && typeof W[P(id).flag][cid] === 'string', id + ': words for ' + cid)));
  assert.match(W.ch10PickFlew['cant-fly'], /^answered Reynard’s “It FLEW out of your camp!” with: Sprinkle can’t fly/);
  assert.deepEqual([W.ch10Puddle && W.ch10Puddle['true'], BEST.map(b => W.ch10Best[b])], ['found Puddle under the Moon Ferry (chapter 10; {their} book says so on chapter 10’s page)',
    ['will remember Sprinkle most', 'will remember {their} friends most', 'will remember finding the truth most', 'will remember the Counts most']]);
});

test('every right card has its own answer: with the pick’s flag set to it, the frame the page turns to carries a balloon of hers that names that card (or the frame itself does), and no other card’s line shows', () => {
  pickIds.forEach(id => {
    const pk = frames[id].pick;
    pk.right.forEach(cid => {
      const cat = { flags: { [pk.flag]: cid } };
      const to = E.landing(cat, story, pk.next), f = frames[to];
      const mine = (f.say || []).filter(b => b.who === 'player' && b.when && b.when[pk.flag] === cid);
      assert.ok(mine.length === 1 || (f.when && f.when[pk.flag] === cid), id + ' ' + cid + ': her answer on ' + to);
      const seen = E.balloons(f, cat).filter(b => b.who === 'player');
      assert.equal(seen.length, 1, id + ' ' + cid + ': one answer of hers');
    });
    // every balloon on the answer screens that reads the pick's flag names a right card (E.checkStory too)
    const answersOn = [pk.next].concat(frames[pk.next].else ? [frames[pk.next].else] : []);
    answersOn.forEach(to => (frames[to].say || []).filter(b => b.when && b.when[pk.flag]).forEach(b => assert.ok(pk.right.includes(b.when[pk.flag]), to + ': ' + b.when[pk.flag])));
    const named = answersOn.reduce((m, to) => m.concat((frames[to].say || []).filter(b => b.when && b.when[pk.flag]).map(b => b.when[pk.flag])), []);
    assert.deepEqual(named.sort(), pk.right.slice().sort(), id + ': an answer line for each right card, and no more');
  });
  // the sixty's line reads the fourth pick: “Your count,” for a cat who answered with her count
  const sixty = countsAt('ch10-sixty')[0];
  assert.deepEqual(E.balloons(frames[sixty], { flags: { ch10PickBig: 'my-count' } }).map(b => b.text)[0], 'Your count. I said bring it.');
  assert.deepEqual(E.balloons(frames[sixty], { flags: { ch10PickBig: 'stash' } }).map(b => b.text)[0], 'And your count, {name}paw? I said bring it.');
  // the stash twin: Sloshbank's OURS? only after the stash
  assert.deepEqual(E.landing({ flags: { ch10PickBig: 'stash' } }, story, 'f068'), 'f068');
  assert.deepEqual(E.landing({ flags: { ch10PickBig: 'fur' } }, story, 'f068'), 'f069');
});

test('the pick in the engine, on real files: every claim has a right card in the thinnest file, the fullest, and every golden cat’s; a wrong card gets Tallyheart’s nudge (its own for the fox’s cards), the second after it, and after the third the right cards glow in her file’s order and only they can be picked', () => {
  const thin = before10({}, { cards: TWENTY }), full = before10(Object.assign({ specialty: 'noticing' }, ALL_SIX), { cards: TWENTY.concat(TEN_MORE) });
  assert.deepEqual([E.cards(thin, STORIES).length, E.cards(full, STORIES).length], [20, 30]);
  const files = [['thin', thin], ['full', full]].concat(golden().map((c, i) => ['golden ' + i, c]));
  assert.equal(files.length, 17);
  files.forEach(([name, cat]) => {
    const held = E.cards(cat, STORIES).map(c => c.id);
    assert.ok(held.length >= 20 && held.length <= 30, name + ': ' + held.length + ' cards');
    TWENTY.forEach(cid => assert.ok(held.includes(cid), name + ': holds ' + cid));
    pickIds.forEach(id => {
      const v = E.pickView(frames[id], cat, STORIES);
      assert.ok(v.right.length >= 2, name + ' ' + id + ': right cards she holds: ' + v.right.join(' '));
      assert.deepEqual(v.right, E.fileOrder(cat, STORIES).filter(cid => frames[id].pick.right.includes(cid)), name + ': in her file’s order');
      assert.deepEqual(v.file, E.caseFile(cat, STORIES));
    });
  });
  // judged on the thin file: the first claim
  const pk = frames.f057.pick;
  assert.deepEqual(E.pickJudge(pk, thin, 'cant-fly', 0, STORIES), { right: true, card: 'cant-fly', flag: 'ch10PickFlew' });
  assert.equal(E.pickJudge(pk, thin, 'mizzle-wing', 0, STORIES), null, 'a card her file does not show is no pick');
  assert.equal(E.pickJudge(pk, thin, 'fox-flew', 0, STORIES).line, pk.own['fox-flew'], 'the fox’s own card: its own nudge');
  const w1 = E.pickJudge(pk, thin, 'tidy', 0, STORIES), w2 = E.pickJudge(pk, thin, 'otter-fox', 1, STORIES), w3 = E.pickJudge(pk, thin, 'reed-pile', 2, STORIES);
  assert.deepEqual([w1.line, w2.line, w3.line], [pk.nudges[0], pk.nudges[1], pk.nudges[1]], 'clamped: never the first again');
  assert.deepEqual([w1.glow, w2.glow, w3.glow], [[], [], ['cant-fly', 'fox-brag'].sort((a, b) => E.fileOrder(thin, STORIES).indexOf(a) - E.fileOrder(thin, STORIES).indexOf(b))]);
  assert.equal(E.pickJudge(pk, thin, 'tidy', 3, STORIES), null, 'after the third a dimmed card is no pick: no fourth nudge');
  assert.equal(E.pickJudge(pk, thin, 'fox-brag', 3, STORIES).right, true, 'a glowing card is right');
  assert.equal(E.pickJudge(pk, thin, 'tidy', undefined, STORIES).wrongs, 1, 'no count is no wrong pick');
  // and through the page's own words (PC.ui.pickPage): the strip, the nudge, glow and dim after three
  const view = E.pickView(frames.f057, thin, STORIES);
  const page0 = UI.pickPage(view, 0, null, 1, false), page3 = UI.pickPage(view, 3, pk.nudges[1], 1, false);
  assert.deepEqual([page0.strip.word, page0.nudge, page0.cards.length], ['FLEW', null, 20]);
  assert.deepEqual(page3.cards.filter(c => c.glow).map(c => c.id), view.right);
  assert.ok(page3.cards.filter(c => !c.glow).every(c => c.dim));
});

/* ------------------------------------------------------------------ speakers, tokens, words */

const SKRITCH = F(/^Tallyheart stretches up the leaning tree\./);
const TENTH = F(/^Clutches of seven\. That’s your tenth Count\./);
const IM_PUDDLE = F(/^I’m Puddle\./);
const FEET = F(/^Up pops a blue-grey head\. Then two ENORMOUS feet\./);
const MAMA = F(/^MAMA!$/);
const NEST = F(/^Your nest, at last\./);

test('every balloon speaker is in that frame’s cast; a speaker’s lines on a panel are one balloon (but Glintstar’s honour and Tallyheart’s two at the case, the spec’s); balloons and captions are well formed', () => {
  const NAMED = { puddle: ['Two big eyes', 'Puddle'], mistscale: ['A soft voice', 'Mama'] };
  ids.forEach(id => {
    const f = frames[id];
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(NAMED[b.who] && NAMED[b.who].includes(b.name), id + ' say ' + i + ': ' + b.who + ' named ' + b.name);
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      assert.ok(castOf(id, b.who).length, id + ': ' + b.who + ' speaks and is not in the picture');
    });
    if (f.caption !== undefined) {
      assert.ok(Array.isArray(f.caption) && f.caption.length > 0, id + ' caption');
      f.caption.forEach(t => {
        if (typeof t === 'string') assert.ok(t.trim(), id + ' empty caption');
        else { assert.deepEqual(Object.keys(t).sort(), ['text', 'when'], id + ' caption object'); assert.ok(t.text.trim(), id + ' empty caption'); }
      });
    }
    if (f.sfx !== undefined) assert.ok(typeof f.sfx === 'string' && f.sfx.trim(), id + ' sfx');
    texts(f).forEach(x => { if (x.when) Object.keys(x.when).forEach(k => assert.ok(k === 'not' || FLAGS[k] || PICK_FLAGS.includes(k), id + ' ' + x.where + ': when ' + k)); });
  });
  // no balloon is chained to its own speaker's, for any reader, but the spec's: Glintstar's honour (two paragraphs) and
  // Tallyheart's “Sharp eyes.” and “Still …paw”
  const chained = new Set();
  for (const c of COMBOS.filter((x, i) => i % 3 === 0)) {
    for (const clean of [true, false]) {
      const cat = catFor(Object.assign({}, c.flags, { ch10PickBig: c.o.n % 2 ? 'stash' : 'fur' }), { clean });
      ids.forEach(id => {
        const b = E.balloons(frames[id], cat);
        for (let i = 1; i < b.length; i++) if (b[i].who === b[i - 1].who) chained.add(id + ':' + b[i].who);
      });
    }
  }
  assert.deepEqual([...chained].sort(), ['f133:glintstar', 'f136:tallyheart']);
  // a speaker's variant balloons: exactly one shows to any reader
  [['f011', 'tallyheart', /^Clutches of seven\./], ['f046', 'sprinkle', /^Hello\./], ['f127', 'sprinkle', /^Tallyheart\./], ['f128', 'sprinkle', /^\{name\}paw\./], ['f139', 'tallyheart', /Me too\./]].forEach(([id, who, re]) => {
    for (const c of SOME) for (const best of BEST) for (const clean of [true, false]) {
      const n = E.balloons(frames[id], catFor(Object.assign({}, c.flags, { ch10Best: best }), { clean })).filter(b => b.who === who && re.test(b.text)).length;
      assert.equal(n, 1, id + ' ' + who + ': ' + comboName(c));
    }
  });
  // a Tap's own counting balloon has somebody in the picture to belong to: the clutches Tallyheart's, the paws hers,
  // the forepaws Mama's
  ids.filter(id => frames[id].skip).forEach(id => {
    const who = E.skipWords(E.skipFor(frames[id].skip, { flags: {} }), ((frames[id].say || [])[0] || {}).who).teacher;
    assert.ok(castOf(id, who).length, id + ': ' + who + ' keeps the count, and is in the picture');
  });
});

test('speakers: Puddle “Two big eyes”, then chapter 5’s “The big-footed dragon” through his riddle, “Puddle” from his name on; Mama “A soft voice” until Sprinkle names her, then “Mama” (the roll call’s count too); the leaders by variant, listed first among their Clan, with their voices; Granny by the chapter’s names; the weasels by name; what each Counts frame says again over its first question', () => {
  const cat = E.blankCat({}); cat.name = 'Fern';
  const who = {};
  ids.forEach(id => saidOn(story, id, Object.assign(cat, { flags: {} })).forEach(b => { (who[b.who] = who[b.who] || new Set()).add(b.label); }));
  assert.deepEqual(Object.fromEntries(Object.entries(who).map(([k, v]) => [k, [...v].sort()])), {
    player: ['Fernpaw'], tallyheart: ['Tallyheart'], glintstar: ['Glintstar'], grizzled: ['Grizzled old tom'], riffle: ['Riffle'], sprinkle: ['Sprinkle'],
    snorer: ['Snoring apprentice'], thymeleaf: ['Thymeleaf'], groveclan: ['A GroveClan elder', 'GroveClan’s leader'], sloshbank: ['Sloshbank'], waffles: ['Princess Waffles'],
    reedclan: ['ReedClan’s leader'], otter: ['Granny'], puddle: ['Puddle', 'The big-footed dragon', 'Two big eyes'], mistscale: ['A soft voice', 'Mama'],
    reynard: ['Reynard'], snip: ['Snip'], snatch: ['Snatch'], murmurchime: ['Murmurchime'], squall: ['Squall'], sleet: ['Sleet'], hail: ['Hail'], mizzle: ['Mizzle']
  });
  // Puddle: “Two big eyes” until his feet come up, chapter 5's label between (his riddle), his name from “I’m Puddle.”
  // on, as on the low raft and at the goodbyes for a cat who found him before
  const LOWRAFT = F(/^The front raft rides low\. Very low\. Between the logs/);
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'puddle').forEach(b => {
    const want = id === LOWRAFT || at(id) >= at(IM_PUDDLE) ? 'Puddle' : at(id) < at(FEET) ? 'Two big eyes' : undefined;
    assert.equal(b.name, want, id);
  }));
  assert.deepEqual(saidOn(story, countsAt('ch05-puddle')[0], cat).map(b => b.label), ['The big-footed dragon'], 'his riddle comes before his name');
  assert.equal(labelFor({ who: E.teacherOf(ch05.counts['ch05-puddle']) }, cat), 'The big-footed dragon', 'his riddle’s lines, its help, its fillers and its retry, by the chapter’s names');
  // Mama: “A soft voice” on “Sprinkle?”, “Mama” from “MAMA!” on, so the roll call's count balloon takes it
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'mistscale').forEach(b => assert.equal(b.name, at(id) < at(MAMA) ? 'A soft voice' : 'Mama', id)));
  const rollId = ids.find(id => frames[id].skip && frames[id].skip.teacher === 'mistscale');
  assert.equal(Sp.nameOn(E.balloons(frames[rollId], cat), 'mistscale'), 'Mama', 'the forepaws’ count, a balloon the page adds, is Mama’s');
  assert.deepEqual(castOf(rollId, 'mistscale').map(c => c.variant), [1]);
  // every Mistscale and leader by its variant; the eldest never speaks
  ids.forEach(id => castOf(id, 'mistscale').forEach(c => assert.ok([1, 2].includes(c.variant), id)));
  ids.forEach(id => assert.ok(!(frames[id].say || []).some(b => b.who === 'mistscale' && castOf(id, 'mistscale').every(c => c.variant === 2)), id + ': the eldest never speaks'));
  // the leaders: listed first among their Clan's cast wherever one speaks, so the balloon takes the leader's label and voice
  const LEADER = { reedclan: [5, 'ReedClan’s leader', 0.8], groveclan: [3, 'GroveClan’s leader', 0.88] };
  const spokeAs = [];
  ids.forEach(id => (frames[id].say || []).forEach(b => {
    if (!LEADER[b.who]) return;
    const s = saidOn(story, id, Object.assign(cat, { flags: {} })).find(x => x.who === b.who && x.text === E.fill(b.text, cat));
    spokeAs.push([id, b.who, s.label]);
    if (s.label === LEADER[b.who][1]) { assert.equal(castOf(id, b.who)[0].variant, LEADER[b.who][0], id + ': the leader first among ' + b.who); assert.equal(s.pitch, LEADER[b.who][2], id + ': the leader’s voice'); }
  }));
  assert.deepEqual(spokeAs, [['f038', 'groveclan', 'A GroveClan elder'], ['f039', 'groveclan', 'A GroveClan elder'], ['f047', 'reedclan', 'ReedClan’s leader'], ['f061', 'groveclan', 'GroveClan’s leader'],
    ['f083', 'reedclan', 'ReedClan’s leader'], ['f083', 'groveclan', 'GroveClan’s leader'], ['f095', 'groveclan', 'A GroveClan elder'], ['f113', 'groveclan', 'A GroveClan elder']]);
  // the ReedClan she-cat and the young tom never speak; no GroveClan or ReedClan cat is named
  ids.forEach(id => (frames[id].say || []).filter(b => ['reedclan', 'groveclan'].includes(b.who)).forEach(b => assert.equal(b.name, undefined, id)));
  // Granny: the chapter's names, chapter 5's otter variant 3, her own voice; the only otter who speaks
  ids.forEach(id => castOf(id, 'otter').forEach(c => assert.equal(c.variant, 3, id + ': every otter cast is Granny')));
  assert.deepEqual([Sp.pitch('otter', 3), labelFor({ who: 'otter', variant: 3 }, cat)], [0.92, 'Granny']);
  // a face kept to itself only where the art shows none (Puddle's eyes in the water); everyone else shows one
  ids.forEach(id => (frames[id].say || []).forEach(b => { const m = castOf(id, b.who)[0]; assert.equal(Sp.faceHidden(b, m), b.who === 'puddle' && m.pose === 'eyes', id + ' ' + b.who); }));
  // what each Counts frame says again over its first question: the warm-up, the lesson, the Moon Ferry and the sixty none
  // (`intro: false`); Puddle's riddle its own
  const again = ids.filter(id => frames[id].counts).map(id => [frames[id].counts.set, E.balloons(frames[id], cat).length, Sp.lessonIntro(E.balloons(frames[id], cat), frames[id].counts.intro === false).length]);
  assert.deepEqual(again, [['ch10-eights', 1, 0], ['ch10-sevens', 1, 0], ['ch05-puddle', 1, 1], ['ch10-ferry', 1, 0], ['ch10-sixty', 2, 0]]);
  // the grown-ups corner has words for every flag a frame or an option of the chapter sets
  const W = UI.flagWords;
  ids.forEach(id => Object.entries(frames[id].sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v)));
  frames[MOST].choice.options.forEach(o => Object.entries(o.sets).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], 'words for ' + k + ': ' + v)));
});

test('text tokens are only the allowed ones', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = x.ok || (id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS);
    tokensIn(x.text).forEach(t => { if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}'); });
  });
  assert.deepEqual(bad, []);
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  ids.filter(id => frames[id].ask).forEach(id => frames[id].ask.pairs.forEach(p => assert.deepEqual(tokensIn(p[0] + p[1]), [], id)));
  pickIds.forEach(id => assert.deepEqual(tokensIn(frames[id].pick.claim + frames[id].pick.nudges.join(' ')), [], id));
  // the book's {their}: a she-cat's tenth Count is hers, a tom's his
  assert.match(fill(story.book.recap.map(r => r.text).join(' '), PROFILES['she-cat']), /Tallyheart taught Moonpaw her tenth Count, clutches of seven: the sevens\./);
  assert.match(fill(story.book.recap.map(r => r.text).join(' '), PROFILES.tom), /Tallyheart taught Stormpaw his tenth Count, clutches of seven: the sevens\./);
  assert.match(fill(story.book.recap.map(r => r.text).join(' '), PROFILES.tom), /Tallyheart said his warrior name is coming, with this moon in it\./);
});

/* The most words a single reader sees on a frame: the lines for every combination of the flags its `when`s read. */
function maxWords(f) {
  const keys = new Set();
  const collect = w => Object.keys(w || {}).forEach(k => (k === 'not' ? collect(w.not) : keys.add(k)));
  texts(f).forEach(x => collect(x.when));
  const list = [...keys];
  let best = 0;
  const go = (i, flags) => {
    if (i === list.length) {
      const cat = { flags, lessons: flags.lessonClean ? { 'ch10-sevens': { finished: true, noHelp: true } } : {} };
      const n = E.captions(f, cat).concat(E.balloons(f, cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []).reduce((m, s) => m + words(s), 0);
      best = Math.max(best, n);
      return;
    }
    const k = list[i];
    const vals = k === 'lessonClean' ? [true, false] : PICK_FLAGS.includes(k) ? frames[pickIds[PICK_FLAGS.indexOf(k)]].pick.right : FLAGS[k];
    for (const v of vals.concat([undefined])) go(i + 1, Object.assign({}, flags, v === undefined ? {} : { [k]: v }));
  };
  go(0, {});
  return best;
}

test('word counts: about 15 to 18 words of lettering a frame, few over 30 for any reader and never more than 50; no panel with five boxes; every reading under the brief’s 170 frames; never more than seven panels in a row with nothing to do', (t) => {
  const over = [];
  ids.forEach(id => {
    const m = maxWords(frames[id]);
    assert.ok(m <= WORDS_MAX, id + ' has ' + m + ' words for its wordiest reader');
    if (m > WORDS_AIM) over.push(id + ' (' + m + ')');
  });
  t.diagnostic('over 30 words for the wordiest reader: ' + over.join(', '));
  assert.ok(over.length <= 16, over.join(', '));
  const stats = {};
  for (const c of COMBOS) for (const clean of (COMBOS.indexOf(c) % 4 ? [true] : [true, false])) {
    const rows = walkLines(c.flags, Object.assign({}, c.o, { clean }));
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(s), 0));
    const w = per.reduce((a, b) => a + b, 0);
    per.forEach((n, i) => assert.ok(n <= 45, rows[i].id + ': ' + n + ' words for ' + comboName(c)));
    rows.forEach(r => assert.ok(r.boxes <= 4, r.id + ': ' + r.boxes + ' boxes for ' + comboName(c)));
    const k = (c.flags.worry === 'water' ? 'water' : 'plain') + (meetsPuddle(c) ? ' puddle' : '');
    (stats[k] = stats[k] || []).push({ n: rows.length, w });
    assert.ok(w / rows.length >= 14.5 && w / rows.length <= 18, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
    assert.ok(rows.length <= 170, comboName(c) + ': ' + rows.length + ' frames');
    let run = 0, worst = 0, from = null, first = null;
    rows.forEach(r => {
      if (r.kind !== 'next') { run = 0; return; }
      if (!run) from = r.id;
      if (++run > worst) { worst = run; first = from; }
    });
    assert.ok(worst <= 7, comboName(c) + ': ' + worst + ' panels in a row with nothing to do, from ' + first);
  }
  // the brief's budget: at most 170 frames a reading; the spec's estimate about 112 plain with none of the six found,
  // up to about 133 with every worry's and specialty's panels and Puddle's scene (frames here, the engine's readings
  // count the same)
  const range = k => [Math.min(...stats[k].map(x => x.n)), Math.max(...stats[k].map(x => x.n))];
  assert.deepEqual(['plain', 'water', 'plain puddle', 'water puddle'].map(range), RANGES);
  Object.keys(stats).sort().forEach(k => {
    const s = stats[k], mm = f => Math.min(...s.map(f)) + '–' + Math.max(...s.map(f));
    t.diagnostic(k + ': ' + mm(x => x.n) + ' frames, ' + mm(x => x.w) + ' words of lettering, ' + (s.reduce((a, x) => a + x.w / x.n, 0) / s.length).toFixed(1) + ' a frame');
  });
});

test('a caption the page can letter on the panel is 95 characters at most (a long line in boxes, cut at sentence breaks, the badger print at its colon)', () => {
  assert.deepEqual(ids.filter(id => (frames[id].caption || []).some(c => capText(c).length > 95)), []);
  const caps = re => frames[F(re)].caption.map(capText);
  assert.deepEqual(caps(/^Then the mist comes, up the river/).slice(0, 2), ['Then the mist comes, up the river, cool and soft.', 'The moon glows right through it. Everything shines silver.']);
  assert.deepEqual(caps(/^Out of the mist leans a great, gentle face/), ['Out of the mist leans a great, gentle face, grey as a rain cloud, with big, kind eyes.', 'The rest of her is as big as a bridge.']);
  assert.deepEqual(caps(/^Ten claw marks on the tree\./), ['Ten claw marks on the tree.', '“One day, there’ll be ten marks here,” Tallyheart said, on your third day.', 'And today is that day.']);
  assert.deepEqual(caps(/^On your very first night, there was no moon at all\./).slice(0, 2), ['On your very first night, there was no moon at all.', 'Tonight it’s round and full. And you’re HOME.']);
  assert.deepEqual(caps(/^On the island’s shore, your paw lands beside a BIG print/), ['On the island’s shore, your paw lands beside a BIG print in the mud:', 'five toes in a row, and claws made for digging.']);
  assert.deepEqual(caps(/^Past the Old Bridge, on the walk home/), ['Past the Old Bridge, on the walk home, a voice in the stones whispers,', '“Quiet at last. I’ll miss the burps.”']);
  ids.forEach(id => (frames[id].caption || []).forEach((c, i, all) => assert.ok(E.endsSentence(capText(c)) || /[:,]$/.test(capText(c)), id + ': “' + capText(c) + '” ends a sentence')));
});

test('every frame has a storyboard: a shot type in caps, then 2–4 sentences, no tokens', () => {
  const shot = new RegExp('^(' + SHOTS.join('|') + ')\\b[A-Z ,’\\-]*\\.\\s');
  ids.forEach(id => {
    const b = frames[id].board;
    assert.ok(typeof b === 'string' && b.trim().length > 0, id + ': no board');
    assert.match(b, shot, id + ': board must start with a shot type in caps');
    assert.deepEqual(tokensIn(b), [], id + ': tokens in the board');
    assert.doesNotMatch(b, /['"]/, id + ': straight quotes in the board');
    const body = b.replace(shot, '');
    const sentences = body.split(/(?<=[.!?][”"]?)\s+(?=[A-Z“"(])/).filter(s => s.trim());
    assert.ok(sentences.length >= 2 && sentences.length <= 5, id + ': board has ' + sentences.length + ' sentences');
    assert.ok(words(body) >= 25, id + ': board too thin');
    // a board is for an illustrator: nothing shows teeth, fangs or a snarl, nobody is hurt, nothing is dark or scary
    assert.doesNotMatch(b, /\b(teeth|fangs?|snarl\w*|blood|bleed\w*|wound\w*|claws? (out )?at|bites?|creep\w*|scary|frighten\w*|twolegs?|kittypets?|thunderpath|ironsnake|whisker-lengths?|starclan)\b/i, id);
    assert.doesNotMatch(b, /\bSTUB\b/, id);
  });
  // a frame shown only to some readers says so in its shot line; a Tap page says what the tap does in play
  ids.filter(id => frames[id].when).forEach(id => assert.match(frames[id].board.split('. ')[0], /\b(ONLY|BUT|NOT FOR)\b/, id + ': the shot line says who sees it'));
  ids.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask || frames[id].pick).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].choice).forEach(id => assert.match(frames[id].board, /THE CHOICE|the choices sit below the panel/, id));
  ids.filter(id => frames[id].card).forEach(id => assert.match(frames[id].board, /the new card appears under the panel, an ear in its corner/, id));
  ids.filter(id => same(frames[id].when, WATER)).forEach(id => assert.match(frames[id].board.split('. ')[0], /A WATER-WORRY CAT ONLY/, id));
});

test('rendered for a she-cat, a tom and a Murmur, every sentence reads right', (t) => {
  const problems = [];
  const print = !!process.env.PRINT_STORY;
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind];
    if (print) console.log('\n======== ' + kind + ': ' + p.name + 'paw, called ' + p.petname);
    let last = null;
    everyText((id, x) => {
      const out = fill(x.text, p);
      if (print) { if (id !== last) console.log('\n' + id); last = id; console.log('  ' + x.where + (x.when ? ' ' + JSON.stringify(x.when) : '') + ': ' + out); }
      const bad = badGrammar(out, x.sfx).filter(b => !(x.runsOn && b === 'starts lowercase'));
      if (bad.length) problems.push(kind + ' ' + id + ' ' + x.where + ': ' + bad.join(', ') + ' | ' + out);
    });
  });
  problems.forEach(s => t.diagnostic(s));
  assert.deepEqual(problems, []);
  assert.equal(fill(T(ids.find(id => frames[id].input)), PROFILES.tom), 'What did Stormpaw dream, the night of the Gathering?');
  assert.equal(fill(frames[F(/^\{petname\}! DARLING!/)].say[0].text, PROFILES.tom), 'Sir Pounce-a-lot! DARLING! I saw MIST! And DRAGONS!');
  assert.equal(fill(frames[F(/When you pass your Warrior Counts\./)].say[1].text, PROFILES.murmur), 'When you pass your Warrior Counts. They’re yours, whenever you’re ready. At the fountain, like Mutterchime.');
});

test('our own world and the tone: no Warriors or Wings of Fire words, no “Ironsnake”, “Twoleg” or “whisker-length”; nobody new named; nobody hurt, nobody fights; the Mistscales gentle, the badger a curious track; no grown cat drawn laughing; still {name}paw, the warrior name promised for the Warrior Counts', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|apprentices’ den|medicine den|from this day|claw-moon|quarter-moon|half-moon|whisker-lengths?|claw-lengths?|fox-lengths?|tail-lengths?|silverpelt|great oak|fourtrees|moonstone|highrock)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, banned, id + ' board'));
  // the names on screen: labels for the new cast, nobody new named; the great tree never named
  ids.forEach(id => (frames[id].say || []).forEach(b => { if (b.name) assert.ok(['Two big eyes', 'Puddle', 'A soft voice', 'Mama'].includes(b.name), id + ': ' + b.name); }));
  everyText((id, x) => assert.doesNotMatch(x.text, /\bGreat Tree\b|\bthe Great\b/, id + ' ' + x.where + ': the great tree, never a name'));
  // nobody bites, strikes, snarls or growls; nobody dies; the foxes are sent off, nobody touches anybody
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(bites?|bitten|teeth|fangs?|claws? at|snarls?|growls?|kill\w*|strikes?|attacks?|fights?|wound(ed)?|blood|bleed|die[sd]?|dead|death|bones?|drown\w*|creepy|scary|monster)\b/i, id + ' ' + x.where));
  FF(/\bhurt\b/).forEach(id => assert.match(T(id), /hurt wing|wing was hurt|Her wing was hurt/, id));
  // the grown Mistscales: Mama and the eldest, gentle, never teeth or claws, the eldest bowing
  ids.forEach(id => castOf(id, 'mistscale').forEach(c => { assert.ok(['lean', 'nuzzle', 'lift', 'bow'].includes(c.pose), id); assert.ok(['kind', 'happy', 'solemn', 'wonder'].includes(c.mood), id + ': ' + c.mood); assert.equal(c.pose === 'bow', c.variant === 2, id + ': only the eldest bows'); }));
  // Reynard never shows his teeth or comes toward her: never a lunge, his poses the art's charming ones
  ids.forEach(id => castOf(id, 'reynard').forEach(c => assert.ok(['trot', 'bow', 'sit', 'think', 'flap', 'chest', 'comb', 'swim'].includes(c.pose), id + ': ' + c.pose)));
  // no grown cat in `laugh` (it draws tears), no mentor sad or scared; Glintstar never stern at Sprinkle
  ids.forEach(id => frames[id].scene.cast.filter(c => GROWN.includes(c.who)).forEach(c => assert.notEqual(c.mood, 'laugh', id + ': ' + c.who + ' laughing')));
  ids.forEach(id => frames[id].scene.cast.filter(c => ['tallyheart', 'glintstar', 'thymeleaf'].includes(c.who)).forEach(c => assert.ok(!['sad', 'scared'].includes(c.mood), id + ': ' + c.who + ' ' + c.mood)));
  assert.notEqual(castOf(F(/^Glintstar turns to Sprinkle\./), 'glintstar')[0].mood, 'stern');
  assert.equal(castOf(F(/Hmph\.$/), 'tallyheart')[0].mood, 'proud');
  // still {name}paw: no warrior name given; the name promised, with this moon in it, for the Warrior Counts
  everyText((id, x) => assert.doesNotMatch(x.text, /\{name\}(?!paw)[a-z]|you are now|your warrior name is \{/i, id + ' ' + x.where));
  assert.match(T(F(/^Tallyheart presses her head against yours\./)), /Still \{name\}paw, for now\. Your warrior name is coming\. And this moon will be in it\./);
  assert.equal(frames[F(/When you pass your Warrior Counts\./)].say[1].text, 'When you pass your Warrior Counts. They’re yours, whenever you’re ready. At the fountain, like {Murmur}chime.');
  assert.equal(frames[F(/^When you sit your Warrior Counts, I’ll be right at the front\.$/)].say[0].text, 'When you sit your Warrior Counts, I’ll be right at the front.');
  // the badger: only its old track, curious; said before the stone, and never in her last look
  assert.deepEqual(FF(/\bbadger\b/i), ['f140', 'f153']);
  ['f140', 'f153'].forEach(id => { assert.equal(frames[id].scene.opts.print, true, id); assert.equal(frames[id].scene.cast.some(c => !['player', 'tallyheart', 'otter'].includes(c.who)), false, id + ': never the animal'); });
  assert.ok(at('f153') < at(F(/^In the doorway, the full moon looks in\./)), 'the hook before the doorway and the stone');
  assert.ok(frames[ids[ids.length - 1]].scene.opts.miststone === 'flash', 'her last look: the stone');
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the story’s own: every caption, balloon, sound effect, option, claim and nudge is in docs/chapters/10-the-gathering.md, and every line its screens speak is in the chapter', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/chapters/10-the-gathering.md'), 'utf8');
  const from = doc.indexOf('# Chapter 10: The Gathering'), to = doc.indexOf('\n*For us*');
  assert.ok(from === 0 && to > from, 'the story, from its title to its notes');
  const body = doc.slice(doc.indexOf('## Full moon'), to);
  const flat = t => t.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  const loose = t => t.replace(/[,.]/g, '').replace(/\s+/g, ' ').trim();
  const page = flat(body), pageLoose = loose(page);
  const spoken = body.split(/\n\s*\n/).map(p => (flat(p).match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).join(' ')).filter(Boolean).map(loose).join(' ¶ ');
  const inText = t => page.includes(t) || spoken.includes(loose(t)) || pageLoose.includes(loose(t));
  const bySentence = t => t.split(/(?<=[.!?…])\s+/).every(inText);
  const mine = [];
  ids.forEach(id => {
    const f = frames[id];
    (f.caption || []).forEach(c => { if (!inText(capText(c)) && !bySentence(capText(c))) mine.push(id + ': ' + capText(c)); });
    (f.say || []).forEach(b => { if (!inText(b.text) && !bySentence(b.text)) mine.push(id + ' ' + b.who + ': ' + b.text); });
    if (f.sfx && !page.includes(f.sfx.replace(/!$/, ''))) mine.push(id + ' sfx: ' + f.sfx);
    if (f.choice) f.choice.options.forEach(o => { if (!page.includes(o.label.replace(/^“|”$/g, ''))) mine.push(id + ' option: ' + o.label); });
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '').replace(/!$/, '')), id + ': ' + f.scratch.prompt);
    if (f.skip && f.skip.prompt) assert.ok(page.includes(f.skip.prompt.replace(/\*\*/g, '')) || f.skip.paws === 'board', id + ': ' + f.skip.prompt);
    if (f.ask) { assert.ok(page.includes(f.ask.prompt.replace(/\*\*/g, '')), id); f.ask.pairs.forEach(p => assert.ok(inText(p[0]) && inText(p[1]), id + ': ' + p.join(' / '))); }
    if (f.pick) { assert.ok(page.includes('Pick a card: “' + f.pick.claim + '”'), id + ': ' + f.pick.claim); f.pick.nudges.concat(Object.values(f.pick.own || {})).forEach(l => assert.ok(page.includes('“' + l + '”'), id + ': ' + l)); }
  });
  // what is the build's and not the story's: none (the HERE! and the dogs' sounds are the story's own shouts)
  assert.deepEqual(mine, []);
  assert.equal(E.chapterHeading(story), 'Chapter 10: The Gathering');
  // and the other way: every line a screen of the story speaks is lettered somewhere in the chapter
  const lettered = [];
  everyText((id, x) => lettered.push(String(x.text).replace(/\*\*/g, '')));
  Object.keys(story.counts).concat(['ch05-puddle']).forEach(sid => {
    const home = homeOf(sid), def = Object.assign({ id: sid }, home.counts[sid]), st = E.counts.start(def, { set: sid });
    for (let q; (q = E.counts.question(st));) { const D = E.questionDef(def, q, home, STORIES); E.promptLines(def, D, q).forEach(l => lettered.push(l.text)); E.counts.answer(st, D, q.answer, 2000, 1); }
    def.facts.forEach(f => [].concat(f.right || []).forEach(r => lettered.push(r.text || r)));
  });
  // and the card a frame gives (chapter 5's, given again under the raft)
  ids.filter(id => frames[id].card).forEach(id => lettered.push(E.cardDef(frames[id].card, story, STORIES).line));
  const all = loose(lettered.join(' '));
  const missing = [];
  body.replace(/\*\*([^*]+)\*\*/g, ' ').replace(/\*[^*]*\*/g, ' ').split(/\n\s*\n/).forEach(p => {
    (p.replace(/\s+/g, ' ').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => { if (!all.includes(loose(q)) && !q.split(/(?<=[.!?…,])\s+/).every(s => all.includes(loose(s)))) missing.push(q); });
  });
  // (the story's mouthed cheer is the friends caption's quote; Coil's whisper the walk home's)
  assert.deepEqual(missing, []);
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab), camera by camera: every anchor one of its camera’s own (but the spots of the staging’s calls), every option the set declares by value, the cast, poses, moods and extras, each worn by whom the spec says', () => {
  const v = A.vocab;
  assert.ok(v && v.sets.ferry && v.sets.island && ['mistscale'].every(w => v.cast.includes(w)), 'the art exposes chapter 10’s vocabulary');
  const OLD = { claws: [true], holdAt: ['paws', 'mouth'] };
  const seen = {}, spots = [];
  ids.forEach(id => {
    const s = frames[id].scene;
    assert.ok(s && typeof s === 'object', id + ': no scene');
    assert.deepEqual(Object.keys(s).filter(k => !['set', 'cam', 'opts', 'cast', 'fx'].includes(k)), [], id + ': scene keys');
    const set = v.sets[s.set], info = A.sceneInfo(s.set);
    assert.ok(set, id + ': unknown set ' + s.set);
    assert.ok(set.cams.includes(s.cam), id + ': set ' + s.set + ' has no camera ' + s.cam);
    assert.ok(['den', 'hollow', 'ferry', 'island', 'riverbank', 'tower'].includes(s.set), id + ': the spec’s places');
    const mine = info.anchors[info.cams[s.cam].comp];
    Object.keys(s.opts || {}).forEach(k => {
      const allowed = set.opts[k];
      assert.ok(allowed, id + ': set ' + s.set + ' has no option ' + k);
      const val = s.opts[k];
      if (allowed === 'number') assert.equal(val, 14, id + ': ' + k + '=' + val + ': the full moon');
      else assert.ok(Array.isArray(allowed) && allowed.some(x => same(x, val)), id + ': ' + k + '=' + JSON.stringify(val));
    });
    // the island is always under the full moon: no moon option there
    if (s.set === 'island') assert.equal(s.opts.moon, undefined, id);
    if (s.opts && s.opts.tap !== undefined) assert.ok(frames[id].scratch && frames[id].scratch.tap === s.opts.tap, id + ': the set’s tap mark is this page’s Tap');
    const used = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'size', 'variant'].concat(Object.keys(v.extras), Object.keys(OLD)).includes(k)), [], where + ': keys');
      assert.ok(v.cast.includes(c.who), where + ': unknown who');
      const isCat = CATS.includes(c.who);
      Object.keys(v.extras).concat(Object.keys(OLD)).forEach(k => {
        if (c[k] === undefined) return;
        const vals = v.extras[k] || OLD[k];
        assert.ok(vals.some(x => same(x, c[k])), where + ': ' + k + '=' + JSON.stringify(c[k]));
        seen[k] = (seen[k] || 0) + 1;
      });
      // who wears what
      if (c.holds === 'pole') assert.ok(c.who === 'otter' && c.variant === 3, where + ': Granny’s pole');
      if (c.holds === 'mouse') assert.ok(c.who === 'snatch' && at(id) < at(F(/It is NOT\.$/)) + 1, where + ': Snatch’s mouse, till Glintstar’s “It is NOT.”');
      if (c.holds === 'leaf' || c.holds === 'glass') assert.equal(c.who, 'player', where + ': her glass in its leaf');
      if (c.holds === 'miststone') assert.equal(c.who, 'player', where + ': the mist stone, hers');
      if (c.holds === 'pebble') assert.deepEqual([c.who, c.pose], ['sprinkle', 'fly'], where + ': Sprinkle’s pebble, fluttering down');
      if (c.holdAt !== undefined) assert.ok(c.holds, where + ': holdAt goes with holds');
      if (c.holds !== undefined) assert.ok(['leaf', 'glass', 'pole', 'mouse', 'miststone', 'pebble'].includes(c.holds), where + ': ' + c.holds);
      if (c.flash) assert.equal(c.holds, 'miststone', where + ': the stone flashes');
      if (c.wet) assert.ok(['reynard', 'snip', 'snatch'].includes(c.who), where + ': damp from the swim');
      if (['reynard', 'snip', 'snatch'].includes(c.who)) assert.equal(c.wet, true, where + ': they swam here');
      if (c.tap !== undefined) {
        assert.ok(frames[id].scratch && frames[id].scratch.tap === c.tap, where + ': the tap mark is this page’s Tap');
        const WHO = { paw: ['player'], ears: ['riffle'], tail: ['player'], leaf: ['player'], nose: ['player'].concat(DRAGONETS), stone: ['player'] };
        assert.ok(WHO[c.tap].includes(c.who), where + ': ' + c.tap);
        if (c.tap === 'leaf') assert.deepEqual([c.holds, c.holdAt], ['leaf', 'paws'], where);
        if (c.tap === 'tail') assert.ok(c.tailUp, where + ': the raised tail');
        if (c.tap === 'stone') assert.equal(c.holds, 'miststone', where);
        if (c.tap === 'nose' && c.who === 'player') assert.equal(c.pose, 'crouch', where + ': her head dipped');
      }
      if (c.tailUp) assert.ok(c.tap === 'tail' || (c.who === 'sprinkle' && c.pose === 'fly'), where + ': a raised tail to tap, or Sprinkle’s waving');
      if (c.glow) assert.ok(frames[id].ask && frames[id].ask.who === c.who, where + ': the one to tap on the page of an ask');
      if (c.claws) assert.ok(c.who === 'tallyheart' && c.pose === 'crouch' && /^In the sand, Tallyheart scratches/.test(T(id)), where + ': claws out, scratching the sand');
      if (c.asleep === true) assert.deepEqual([c.who, c.pose, c.at], ['player', 'curl', 'tail'], where + ': fast asleep, her tail’s tip at the end');
      if (c.asleep === 'half') assert.ok(c.who === 'player' && c.pose === 'curl' && /You curl up tight, warm and safe, and sleep\.$/.test(T(id)), where + ': half asleep');
      const poses = isCat ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      if (typeof c.at === 'object') {
        assert.ok(Object.keys(c.at).every(k => ['x', 'y', 'h', 'z'].includes(k)) && 'x' in c.at && 'y' in c.at, where + ': a spot is { x, y } (with h, as the art gives them)');
        const ok = (camOf(id) === 'island/case' && c.who === 'sprinkle' && same(c.at, SIDE)) || (camOf(id) === 'island/case' && DRAGONETS.includes(c.who) && same(c.at, STEP)) || (camOf(id) === 'island/sky' && c.who === 'player' && same(c.at, RISE)) ||
          (camOf(id) === 'island/case' && c.who === 'player' && same(c.at, LOOP) && castOf(id, 'sprinkle').some(m => m.pose === 'curl')) ||
          (camOf(id) === 'island/case' && c.who === 'tallyheart' && same(c.at, NOSE) && c.pose === 'crouch') ||
          (camOf(id) === 'island/wide' && c.who === 'sprinkle' && (same(c.at, MID) || (same(c.at, OUT) && /^Out shuffles Sprinkle|^Every Clan gasps\./.test(T(id))))) ||
          (camOf(id) === 'island/wide' && c.who === 'otter' && c.variant === 3 && ['f082', 'f083', 'f084'].includes(id) && same(c.at, { x: 1545, y: 690, h: 230 }));
        assert.ok(ok, where + ': a spot of its own');
        spots.push(id + ':' + c.who);
      } else assert.ok(mine[c.at], where + ': ' + s.set + '/' + s.cam + ' has no anchor ' + c.at + ' (its own: ' + Object.keys(mine).join(' ') + ')');
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      if (c.size !== undefined) assert.ok(c.who === 'tallyheart' && c.size === 1.2 && s.set === 'hollow' && c.at === 'tree-far', where + ': size ' + c.size);
      if (c.variant !== undefined) {
        assert.ok(v.variants[c.who], where + ': only ' + Object.keys(v.variants).join('/') + ' have a variant');
        assert.ok(v.variants[c.who].includes(c.variant), where + ': variant ' + c.variant);
      } else assert.ok(!v.variants[c.who], where + ': a ' + c.who + ' says which one');
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), id + ': unknown fx ' + e));
    assert.ok(!s.fx.some(e => ['rain', 'lightning'].includes(e)), id + ': no storm');
  });
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'claws', 'flash', 'glow', 'holdAt', 'holds', 'tailUp', 'tap', 'wet']);
  t_spots(spots);
  // the skip-counts' pictures name only cast members
  ids.filter(id => frames[id].skip && frames[id].skip.who).forEach(id => frames[id].skip.who.forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
});
function t_spots(spots) {
  // Sprinkle at her spot on every case panel she sits in with the fox there, or her goodbyes; our cat at the sky's foot once
  assert.ok(spots.filter(s => s.endsWith(':sprinkle')).length >= 20, spots.length + ' spots');
  // and each of the six, stepping out of the mist and saying goodbye, at the same spot (STEP, a step right of hers)
  assert.deepEqual(spots.filter(s => DRAGONETS.some(d => s.endsWith(':' + d))), DRAGONETS.map((d, i) => fid(100 + i) + ':' + d).concat(DRAGONETS.map((d, i) => fid(107 + i) + ':' + d)));
  // our cat at the sky's foot once, and inside Sprinkle's tail loop while it is round her; Tallyheart nose to nose on the two panels that say so
  assert.deepEqual(spots.filter(s => s.endsWith(':player')), ['f128:player', 'f129:player', 'f130:player']);
  assert.deepEqual(spots.filter(s => s.endsWith(':tallyheart')), ['f136:tallyheart', 'f137:tallyheart']);
}

/* ------------------------------------------------------------------ staging */

test('staging, the morning: the den at first light with Tallyheart’s head at the doorway; nobody on the Hollow’s rim; nine marks until the tenth is scratched, ten from then on; the tree close-up empty', () => {
  assert.deepEqual([camOf('f001'), frames.f001.scene.fx, frames.f001.scene.opts], ['den/inside', ['morning'], { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true }]);
  assert.deepEqual(castOf('f001', 'tallyheart').map(c => [c.at, c.pose]), [['doorway', 'peer']]);
  const hollow = ids.filter(id => frames[id].scene.set === 'hollow');
  assert.deepEqual(hollow, ['f004', 'f005', 'f006', 'f007', 'f008', 'f009', 'f010', 'f011']);
  hollow.forEach(id => {
    assert.ok(!frames[id].scene.cast.some(c => RIM_ANCHORS.includes(c.at)), id + ': nobody on the rim (the clutch is news on the island)');
    assert.deepEqual(frames[id].scene.opts, at(id) < at(SKRITCH) ? { marks: 9, glow: 'auto' } : { marks: 10, glow: 'auto' }, id);
    assert.deepEqual(frames[id].scene.fx, ['morning'], id);
  });
  assert.deepEqual([camOf(SKRITCH), frames[SKRITCH].scene.cast, frames[SKRITCH].sfx], ['hollow/tree', [], 'SKRITCH!']);
  assert.equal(exits(frames[countsAt('ch10-sevens')[0]])[0], SKRITCH, 'straight after the lesson');
  ['f004', 'f008', 'f011'].forEach(id => assert.deepEqual(castOf(id, 'tallyheart').map(c => [c.at, c.size]), [['tree-far', 1.2]], id));
});

test('staging, the Moon Ferry: boarding at dusk on the Crossing’s stones by the moon, aboard by night, never dark; Granny poling, the luggage at the back puffing; the low raft and the gap; nothing dark under Puddle', () => {
  const ferry = ids.filter(id => frames[id].scene.set === 'ferry');
  ferry.forEach(id => {
    const s = frames[id].scene;
    assert.equal(s.opts.moon, 14, id + ': the full moon over the river');
    // (the walk down at dusk; the moonrise and the boarding, f014 and f015, by night: the final review's L1)
    assert.deepEqual(s.fx, [s.cam === 'shore' && ['f012', 'f013'].includes(id) ? 'dusk' : 'night'], id);
  });
  assert.deepEqual(['f012', 'f013', 'f014', 'f015'].map(camOf), ['ferry/shore', 'ferry/shore', 'ferry/shore', 'ferry/shore']);
  ['f012', 'f013', 'f014', 'f015', 'f016', 'f032', 'f018', 'f035', 'f140', 'f141'].forEach(id => castOf(id, 'otter').forEach(c => assert.deepEqual([c.variant, c.holds], [3, 'pole'], id + ': Granny and her pole')));
  assert.deepEqual([frames.f017.scene.opts, frames.f018.scene.opts], [{ moon: 14, luggage: true, puff: true }, { moon: 14, luggage: true, puff: true }]);
  assert.deepEqual(castOf('f013', 'player').map(c => [c.holds, c.holdAt]), [['leaf', 'mouth']], 'her glass with her, safe in its leaf');
  // the gap: Puddle's foot, eyes or head in it, `air` (no shadow), in every pose
  ids.filter(id => castOf(id, 'puddle').length && frames[id].scene.set === 'ferry').forEach(id => castOf(id, 'puddle').forEach(c => assert.ok(['gap', 'water'].includes(c.at) && ['foot', 'eyes', 'head', 'log'].includes(c.pose), id)));
  // the river shines silver-blue: the set's water colours bright (the places owner's own numbers), whatever the hour
  const info = A.ferryInfo();
  ['night', 'dusk'].forEach(h => Object.values(info.colours[h]).flat().filter(x => typeof x === 'string' && /^#/.test(x)).length >= 0);
  // the Moon Ferry Counts frame: the whole cast of the cheers aboard
  const pushOff = countsAt('ch10-ferry')[0];
  assert.deepEqual(frames[pushOff].scene.cast.map(c => c.who).sort(), ['glintstar', 'grizzled', 'murmurchime', 'otter', 'player', 'riffle', 'snorer', 'tallyheart', 'thymeleaf']);
});

test('staging, the island: the arrival on the shore with the Moon Ferry and the heap; the leaders take their roots; the fox and the weasels damp; Sprinkle a step behind our cat at the case, in the middle of the clearing once out of the reeds; the mist and Mama, the roll call, the stone in her paws; never a moon option (always the full moon)', () => {
  assert.deepEqual([camOf('f035'), frames.f035.scene.opts], ['island/shore', { ferry: true, luggage: 'heap' }]);
  // no leader on the wide panels before they take their roots; on every wide panel after, each on its root
  const wide = ids.filter(id => camOf(id) === 'island/wide');
  wide.forEach(id => {
    const roots = frames[id].scene.cast.filter(c => /^root-/.test(c.at)).map(c => c.at + ':' + c.who + (c.variant || ''));
    if (at(id) < at('f040')) assert.deepEqual(roots, [], id + ': the roots empty until the leaders sit');
    else assert.ok(roots.includes('root-1:reedclan5') && roots.includes('root-3:groveclan3'), id + ': the leaders on their roots');
  });
  // the leaders sit on roots, never in branches; Glintstar on the middle root but where she comes down to Sprinkle
  ids.forEach(id => frames[id].scene.cast.filter(c => (c.who === 'reedclan' && c.variant === 5) || (c.who === 'groveclan' && c.variant === 3)).forEach(c => assert.match(c.at, /^root-[13]$/, id)));
  // Sprinkle: hidden in the heap until the reeds come off; on the case's camera a step behind our cat (SIDE) or curled
  // round her at `beside`; on the clearing in the middle with our cat beside her
  ids.filter(id => at(id) < at('f046')).forEach(id => assert.equal(castOf(id, 'sprinkle').length, 0, id + ': luggage, nothing of her drawn'));
  ids.filter(id => camOf(id) === 'island/case').forEach(id => castOf(id, 'sprinkle').forEach(c => assert.ok(same(c.at, SIDE) || (c.at === 'beside' && c.pose === 'curl'), id + ': ' + JSON.stringify(c.at))));
  // curled round her, our cat inside the loop in front of her (listed after her, a step nearer)
  ids.filter(id => castOf(id, 'sprinkle').some(c => c.pose === 'curl')).forEach(id => {
    const cast = frames[id].scene.cast, si = cast.findIndex(c => c.who === 'sprinkle'), pi = cast.findIndex(c => c.who === 'player');
    assert.ok(same(cast[pi].at, LOOP) && pi > si, id + ': our cat in the loop, in front');
  });
  wide.filter(id => at(id) > at('f047')).forEach(id => castOf(id, 'sprinkle').forEach(c => { assert.ok(same(c.at, MID), id); assert.deepEqual(castOf(id, 'player').map(p => p.at), ['crowd-2'], id + ': our cat beside her'); }));
  // the fox and the weasels: Reynard never on the case's speaking spot or beside her; they swim away
  ids.forEach(id => castOf(id, 'reynard').forEach(c => assert.ok(['fox', 'edge', 'water'].includes(c.at), id + ': ' + c.at)));
  assert.deepEqual(castOf(F(/^Back into the river he slinks/), 'reynard').map(c => [c.pose, c.at]), [['swim', 'water']]);
  assert.deepEqual(castOf('f041', 'reynard').map(c => c.pose), ['trot'], 'his arrival is chapter 8’s trot');
  // the crowd stands when every cat stands, and while the foxes are there after it
  assert.deepEqual(['f084', 'f085', 'f086'].map(id => frames[id].scene.opts.crowd), ['standing', 'standing', 'standing']);
  // the mist: rolling at Sprinkle's sniff, then thick, Mama's face; the tail on the panel after the Tap
  assert.deepEqual([frames.f089.scene.opts, frames.f090.scene.opts], [{ mist: 'rolling', tap: 'mist' }, { mist: 'thick', tail: true }]);
  assert.deepEqual(castOf('f090', 'mistscale').map(c => [c.at, c.pose, c.variant]), [['mama', 'lean', 1]]);
  assert.deepEqual(castOf('f096', 'mistscale').map(c => c.pose), ['nuzzle']);
  assert.deepEqual(castOf('f097', 'mistscale').map(c => c.pose), ['lift'], 'the HERE! panel: Mama lifts her great head');
  assert.deepEqual(castOf('f113', 'mistscale').map(c => [c.at, c.pose, c.variant]), [['eldest', 'bow', 2]]);
  // she flies: `fly` only in the air, at the sky's spots, or fluttering down with her pebble
  ids.forEach(id => castOf(id, 'sprinkle').filter(c => c.pose === 'fly').forEach(c => assert.ok(camOf(id) === 'island/sky' || c.holds === 'pebble', id)));
  // the stone: in her paws, flashing, from the paws' close-up on; laid on the moss at bedtime
  assert.deepEqual(castOf('f122', 'player').map(c => [c.at, c.holds, c.flash, c.tap]), [['close', 'miststone', true, 'stone']]);
  ids.filter(id => frames[id].scene.set === 'island').forEach(id => assert.equal(frames[id].scene.fx[0], 'night', id));
});

// Chapter 10's review (the visual sweeps, review.json): the calls that fixed what a picture said wrong, each pinned
test('staging, the review’s calls: Tallyheart trailing on the stones at dusk; the deck’s brave moment without the crowd in front; Snatch’s mouse in his paws; our cat sitting over her leaf and glass; Mama through the shapes screens; the stone close up for a shiny-worry cat; Sprinkle turned to Riffle across the grass; nose to nose crouched; Riffle and our cat face to face; the swim farthest first', () => {
  ['f012', 'f013'].forEach(id => assert.deepEqual(castOf(id, 'tallyheart').map(c => c.at), ['bank-3'], id + ': trailing up the stones, clear of our cat'));
  assert.equal(frames.f016.scene.opts.clan, undefined, 'f016: no crowd in front of her “You’re ON”');
  assert.deepEqual(castOf(F(/^You notice the mouse in Snatch’s paws\./), 'snatch').map(c => [c.pose, c.holds]), [['up', 'mouse']], 'in his paws, as the caption says');
  assert.deepEqual(castOf('f064', 'player').map(c => [c.pose, c.holdAt]), [['sit', 'paws']], 'f064: sitting, her head clear of Sprinkle’s claws');
  // the glass close up in her paws, as the mist stone's (the final review's K1: on `case` it was a speck at her forepaw); the old
  // tom's “Glass?” one panel on, before Tallyheart's “That's three.”
  assert.deepEqual([camOf('f065'), castOf('f065', 'player').map(c => [c.at, c.pose, c.holds, c.holdAt])], ['island/paws', [['close', 'crouch', 'glass', 'paws']]], 'f065: the glass close up');
  assert.deepEqual(frames.f065.scene.fx, ['night', 'sparkle'], 'f065: it shines');
  assert.deepEqual(frames.f065.say || [], [], 'f065: the caption alone');
  assert.deepEqual([camOf('f066'), frames.f066.say.map(b => [b.who, b.text])], ['island/case', [['grizzled', 'Glass? I said DRAGON about GLASS?'], ['tallyheart', 'That’s three.']]], 'f066: his squawk, then her whisper');
  assert.deepEqual(castOf('f066', 'grizzled').map(c => [c.at, c.pose, c.mood]), [['front-4', 'situp', 'wonder']], 'f066: the old tom at the front of the ring');
  ids.filter(id => /^(One more|Other) small shapes? waits? in the mist/.test(T(id))).forEach(id => assert.deepEqual(castOf(id, 'mistscale').map(c => [c.at, c.pose]), [['mama', 'lean']], id + ': Mama stays'));
  const shiny = F(/^It sparkles\. It shines\./);
  assert.deepEqual([camOf(shiny), castOf(shiny, 'player').map(c => [c.at, c.holds, c.holdAt, c.flash])], ['island/paws', [['close', 'miststone', 'paws', true]]], 'the stone close up in her paws');
  [F(/^Sprinkle says goodbye to everyone, by name\./), F(/^Riffle sniffs\./)].forEach(id => {
    assert.deepEqual(castOf(id, 'riffle').map(c => c.at), ['fox'], id + ': Riffle across the grass, where the fox sat');
    assert.deepEqual(castOf(id, 'sprinkle').map(c => c.facing), ['right'], id + ': Sprinkle turned to him');
  });
  [F(/^Tallyheart presses her head against yours\./), F(/^When\?/)].forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => [c.who, c.pose]), [['player', 'crouch'], ['tallyheart', 'crouch']], id + ': nose to nose'));
  const hug = F(/^Best Gathering EVER\./);
  assert.deepEqual([castOf(hug, 'player')[0].facing, castOf(hug, 'riffle')[0].facing], ['right', 'left'], 'face to face (home mirrors the spots, not the facings)');
  assert.deepEqual(frames[F(/^Back into the river he slinks/)].scene.cast.map(c => c.who), ['reynard', 'snip', 'snatch'], 'the swim, farthest first');
});

test('staging, home and bedtime: the walk home by moonlight; Squall’s last roar and the flyer; Waffles at her railing by night; the camp; every bedtime den frame’s opts in full, the full moon where the sky shows, the mist stone on the moss once laid, flashing in the doorway and at the end', () => {
  assert.deepEqual([camOf('f142'), frames.f142.scene.opts, frames.f142.scene.fx], ['riverbank/path', { moon: 14 }, ['night']]);
  assert.deepEqual(frames.f143.scene.opts, { moon: 14, roar: true, flyer: true });
  ['f144', 'f145', 'f146'].forEach(id => { assert.deepEqual([camOf(id), frames[id].scene.opts, frames[id].scene.fx], ['tower/up', { moon: 14, chime: true, light: true }, ['night']], id); assert.deepEqual(castOf(id, 'waffles').map(c => c.at), ['railing'], id); });
  ['f147', 'f148'].forEach(id => assert.deepEqual(frames[id].scene.opts, { weather: 'clear', moon: 14 }, id));
  const LAID = F(/^Ten claw marks on the tree\./);
  const DEN_GLASS = { weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true, glass: true };
  ids.filter(id => frames[id].scene.set === 'den' && at(id) >= at(NEST)).forEach(id => {
    const o = frames[id].scene.opts, cam = frames[id].scene.cam, moon = cam === 'nest' ? false : 14;
    const want = Object.assign({}, DEN_GLASS, { moon }, at(id) > at(LAID) ? { miststone: cam === 'nest' ? true : 'flash' } : {});
    assert.deepEqual(o, want, id + ' (' + cam + ')');
  });
  assert.deepEqual([camOf(ids[ids.length - 1]), castOf(ids[ids.length - 1], 'player').map(c => [c.at, c.pose])], ['den/stone', [['tail', 'curl']]]);
  // the tenth mark and the stone: the gift on the frame that lays it, which the page's note under the panel names
  assert.deepEqual(E.gift('mist-stone'), { id: 'mist-stone', name: 'Sprinkle’s mist stone: grey, until the moonlight finds it', from: 'Sprinkle' });
});

/* The depth check (the hotfix's own, tests/set-pile.test.js): on every frame, where the farther of two cast members in
 * the same z layer has a body that meets the nearer one's head, the farther is drawn first (listed first). */
test('staging, depth: on every set and camera chapter 10 draws, a cast member further back is never drawn over a nearer one’s head; the crowded panels (the clearing, the case, the deck, the mist) listed back to front', { skip: !A.character && 'no cats.js' }, (t) => {
  const LOOKD = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
  const meets = (p, q) => p[0] < q[2] && p[2] > q[0] && p[1] < q[3] && p[3] > q[1];
  const ref = A.character('clancat', { pose: 'sit', variant: 1 }).h;
  function boxAt(m, a) {
    const o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: m.facing || a.face || 'right' };
    if (m.variant) o.variant = m.variant;
    if (m.who === 'player') { o.look = LOOKD; o.sex = LOOKD.sex; }
    const ch = A.character(m.who, o), k = a.h * (m.size > 0 ? m.size : 1) / ref;
    const W = (b) => [a.x + (b.x0 - ch.w / 2) * k, a.y + (b.y0 - ch.h) * k, a.x + (b.x1 - ch.w / 2) * k, a.y + (b.y1 - ch.h) * k];
    return { body: W(ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h }), head: W(ch.headBox || ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h }) };
  }
  const cats = [E.blankCat({ id: 'depth', now: 0, look: LOOKD })];
  const met = new Set(), bad = [];
  let pairs = 0;
  for (const id of ids) {
    const sc0 = frames[id].scene, info = A.sceneInfo(sc0.set), anchors = info.anchors[info.cams[sc0.cam].comp] || {};
    for (const cat of cats) {
      const sc = E.resolveScene(sc0, cat, STORIES), svg = A.render(sc, { look: LOOKD }).svg;
      const ground = (sc.cast || []).filter(m => m && (typeof m.at === 'object' || (anchors[m.at] && !anchors[m.at].elev))).map(m => {
        const a = typeof m.at === 'object' ? m.at : anchors[m.at], pos = svg.indexOf('<g transform="translate(' + a.x + ' ' + a.y + ')');
        return { m, a, pos, box: boxAt(m, a) };
      });
      for (const near of ground) for (const far of ground) {
        if (far === near || far.a.y >= near.a.y || (far.a.z || 'front') !== (near.a.z || 'front') || !meets(far.box.body, near.box.head)) continue;
        pairs++; met.add(id);
        const fi = sc.cast.indexOf(far.m), ni = sc.cast.indexOf(near.m);
        if (fi > ni) bad.push(id + ' (' + sc0.set + '/' + sc0.cam + '): ' + far.m.who + ' at ' + JSON.stringify(far.m.at) + ' is drawn over ' + near.m.who + '’s head at ' + JSON.stringify(near.m.at));
      }
    }
  }
  assert.deepEqual(bad, [], 'listed back to front where they meet');
  MET.forEach(id => assert.ok(met.has(id), id + ': two of its cast meet, the one further back drawn first'));
  // and every crowded cast is listed back to front throughout (anchors' y ascending), the spec's rule, but the
  // elder before GroveClan's leader where the elder speaks, and a climber on the low root (`elev`)
  ids.forEach(id => {
    const sc = frames[id].scene, info = A.sceneInfo(sc.set), anchors = info.anchors[info.cams[sc.cam].comp] || {};
    const ys = sc.cast.filter(c => typeof c.at === 'object' || (anchors[c.at] && !anchors[c.at].elev)).map(c => (typeof c.at === 'object' ? c.at : anchors[c.at]).y);
    for (let i = 1; i < ys.length; i++) assert.ok(ys[i] >= ys[i - 1] || sc.set === 'den', id + ': cast ' + i + ' further back than the one before it (' + ys.join(' ') + ')');
  });
  t.diagnostic(ids.length + ' frames, ' + pairs + ' pairs that meet, in ' + met.size + ' frames');
});

// the frames a reading takes (plain, a water-worry cat's, with Puddle's scene, both), and the panels where two of the cast meet
const RANGES = [[114, 121], [116, 122], [125, 131], [127, 132]], MET = ['f036', 'f049', 'f071', 'f082', 'f090', 'f128', 'f135'];
// (f014 and f015, the moonrise and the boarding, by night since the final review's L1: “The river shines silver-blue.”)
const DAYS = [['f001', 'f011', 'morning'], ['f012', 'f013', 'dusk'], ['f014', 'f157', 'night']];
test('the time of day runs morning in the den and the Hollow, dusk at the Moon Ferry’s boarding, and night everywhere after, the full moon over it', () => {
  ids.forEach(id => {
    const day = DAYS.find(([a, b]) => at(id) >= at(a) && at(id) <= at(b));
    assert.ok(day, id);
    assert.equal(frames[id].scene.fx.filter(x => ['morning', 'day', 'sunset', 'dusk', 'night'].includes(x)).join(), day[2], id);
  });
});

test('the storyboard is this chapter’s: every frame, the panels a read-through as a reader walks them, every frame shown only to some readers saying so, the picks with their own row', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch10.md'), 'utf8');
  assert.match(md, /^# Storyboard: Chapter 10, The Gathering/);
  ids.forEach(id => assert.match(md, new RegExp('^#{3,5} ' + id + '\\b', 'm'), id + ' in the storyboard'));
  ids.filter(id => frames[id].when).forEach(id => assert.match(md, new RegExp('^#{3,5} ' + id + '\\b[^#]*\\*\\*Shows (only if|unless)\\*\\*', 'm'), id + ': says who sees it'));
  assert.doesNotMatch(md, /Not reachable from the start/);
  assert.ok(md.includes('| Card picks | 5 (' + pickIds.join(', ') + ') |'));
  pickIds.forEach(id => assert.ok(md.includes('Her pick is remembered (`' + frames[id].pick.flag + '`).'), id));
  assert.match(md, /\| Frames \| 157 /);
});

test('the shots vary like a graphic novel', () => {
  const shotOf = id => SHOTS.find(s => frames[id].board.startsWith(s));
  const used = new Set(ids.map(shotOf));
  ['WIDE', 'MEDIUM', 'CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'INSERT', 'EXTREME CLOSE-UP'].forEach(s => assert.ok(used.has(s), s));
  let run = 0, worst = 0;
  ids.forEach((id, i) => { run = i && shotOf(id) === shotOf(ids[i - 1]) && camOf(id) === camOf(ids[i - 1]) ? run + 1 : 1; worst = Math.max(worst, run); });
  assert.ok(worst <= 13, 'the same shot on the same camera ' + worst + ' panels running');
  // the sets: the den, the Hollow, the Moon Ferry, Gathering Island, the riverbank and the tower; more than a third of the
  // chapter on the island, its eight cameras each used
  ['shore', 'wide', 'roots', 'case', 'fox', 'mist', 'sky', 'paws'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'island/' + cam), cam));
  ['shore', 'deck', 'back', 'low', 'under', 'river'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'ferry/' + cam), cam));
});

/* ------------------------------------------------------------------ every frame drawn */

test('every frame renders, and everyone in the cast is in the picture; every Tap has its target in the art; the Taps, the questions, the Counts pictures and the roll call all draw', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'black', marking: 'white-paws', eyes: 'odd' }, { sex: 'she', fur: 'calico', marking: 'none', eyes: 'amber' }];
  const off = [];
  const cat = Object.assign(E.blankCat({}), { flags: Object.assign({ ch2Stone: 'nose', ch3Told: true, ch7Flew: true }, ALL_SIX) });
  TWENTY.concat(TEN_MORE).forEach((cid, i) => E.giveCard(cat, cid, HOME[cid], i + 1));
  // (small at the distance of a wide shot: the clearing, the roots, the river, the tower, the deck's far seats)
  const SMALL = (id, who) => ['snip', 'snatch', 'waffles', 'otter'].includes(who) || ['island/wide', 'island/roots', 'island/fox', 'ferry/river', 'ferry/deck', 'ferry/shore', 'ferry/back', 'tower/up', 'den/inside', 'den/doorway', 'den/outside', 'hollow/wide', 'riverbank/path', 'riverbank/roof', 'island/sky', 'island/shore', 'island/mist', 'island/case', 'ferry/under', 'ferry/low'].includes(camOf(id));
  ids.forEach(id => looks.forEach((look, k) => {
    const f = frames[id], sc = E.resolveScene(f.scene, cat, STORIES), cast = sc.cast;
    const r = A.render(sc, { look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(r.svg), id + ': no svg');
    assert.ok(Array.isArray(r.heads) && r.heads.length === cast.length, id + ': heads');
    (f.say || []).forEach(b => assert.ok(cast.some((c, i) => c.who === b.who && r.heads[i]), id + ': speaker ' + b.who + ' has no head on the panel'));
    if (k === 0) cast.forEach((c, i) => {
      const h = r.heads[i];
      if (!h) { if (!(id === ids[ids.length - 1] && c.at === 'tail')) off.push(id + ' ' + c.who + '@' + JSON.stringify(c.at) + ' (' + sc.set + '/' + sc.cam + ')'); }
      else {
        if (!SMALL(id, c.who)) assert.ok(h.r >= 3, id + ': ' + c.who + ' face radius ' + h.r);
        assert.ok(h.x >= -5 && h.x <= 105 && h.y >= -5 && h.y <= 105, id + ': ' + c.who + ' head in the panel');
      }
    });
    if (k === 0) {
      // speakers speak from two faces, never one on top of another
      const sp = [...new Set((f.say || []).map(b => b.who))].map(w => cast.findIndex(c => c.who === w)).filter(i => i >= 0 && r.heads[i]);
      for (let i = 0; i < sp.length; i++) for (let j = i + 1; j < sp.length; j++) {
        const a = r.heads[sp[i]], b = r.heads[sp[j]];
        assert.ok(Math.hypot(a.x - b.x, (a.y - b.y) * 0.625) > (a.r + b.r) * 0.9, id + ': ' + cast[sp[i]].who + ' and ' + cast[sp[j]].who + ' speak from two faces');
      }
    }
  }));
  assert.deepEqual(off, [], 'cast members out of the camera’s sight');
  // every one-tap frame has its target in the picture, the one the page picks for this frame's tap
  ids.filter(id => frames[id].scratch).forEach(id => {
    const svg = A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg, tap = frames[id].scratch.tap;
    assert.match(svg, new RegExp('class="pc-tap pc-tap-' + tap + '"|data-tap="' + tap + '"'), id + ': the ' + tap + ' to tap is in the picture');
    const marks = (svg.match(/<[^>]*(?:class="[^"]*pc-tap[^"]*"|data-tap="[^"]*"|data-art="glint")[^>]*>/g) || []).map(el => ({ tap: (/data-tap="([^"]*)"/.exec(el) || [])[1] || null, art: (/data-art="([^"]*)"/.exec(el) || [])[1] || null, cls: (/class="([^"]*)"/.exec(el) || [])[1] || null }));
    const picked = UI.taps.pick(marks, tap);
    assert.ok(picked >= 0, id + ': the page finds a mark for ' + tap);
    assert.ok((marks[picked].cls || '').includes('pc-tap-' + tap) || marks[picked].tap === tap, id + ': and it is the ' + tap + ' (' + JSON.stringify(marks[picked]) + ')');
  });
  // the asks: the asker glows (the tree's pair, the confession)
  ['f008', 'f079'].forEach(id => { const svg = A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg; assert.match(svg, /pc-next/, id); });
  // the Counts pictures the chapter asks for all draw: every question of every set, the steps a question's picture
  // plays as it is asked, the help hop by hop
  const pics = [];
  Object.keys(story.counts).forEach(sid => {
    const def = Object.assign({ id: sid }, story.counts[sid]);
    const st = E.counts.start(def, { set: sid });
    while (!E.counts.done(st)) {
      const q = E.counts.question(st), D = E.questionDef(def, q, story, STORIES);
      pics.push(A.countsPicture(Object.assign({ look: looks[0] }, E.lessonPicture(D, q, q.lit || 0))));
      E.lightSteps(D, q).forEach(s => pics.push(A.countsPicture(Object.assign({ look: looks[0] }, s.picture))));
      const r = E.counts.answer(st, D, q.retry || q.filler ? q.answer : q.answer + 1, 2000, 1);
      if (!r.correct) {
        const plan = E.helpPlan(def, D, q, r);
        if (plan.picture) E.helpSteps(plan).forEach(s => pics.push(A.countsPicture(Object.assign({ look: looks[0] }, E.lessonPicture(D, q, s.counted)))));
        else { pics.push(A.sand(E.sandOpts(plan, 0))); E.helpSteps(plan).forEach(s => pics.push(A.sand(E.sandOpts(plan, s.counted, s.rubbed)))); }
      }
    }
  });
  ids.filter(id => frames[id].skip).forEach(id => { const sk = E.skipFor(frames[id].skip, cat); for (let n = 0; n <= sk.groups; n++) pics.push(A.countsPicture(Object.assign({ look: looks[0] }, E.skipPicture(sk, n)))); });
  const shapes = E.skipFor(frames.f098.skip, { flags: NONE_SIX });
  for (let n = 0; n <= 7; n++) pics.push(A.countsPicture(Object.assign({ look: looks[0] }, E.skipPicture(shapes, n))));
  pics.forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
  assert.ok(pics.length > 60, pics.length + ' pictures');
  const picOf = (sk, n) => A.countsPicture(Object.assign({ look: looks[0] }, E.skipPicture(sk, n)));
  assert.match(picOf(frames.f007.skip, 0), /5 clutches, seven dragonets each/);
  assert.match(picOf(E.skipFor(frames.f098.skip, { flags: ALL_SIX }), 0), /Seven forepaws, five claws each/);
});

/* ------------------------------------------------------------------ the beats, on every path */

test('the chapter’s beats are all there, in order, on every path: every reader’s panels follow the story’s screens, the path-only ones exactly where her flags say', () => {
  const B = [/^Tallyheart’s head pokes into the den\./, /^Glintstar gave you one moon\./, /^The Training Hollow is empty\./, /^Now, today’s Count\./, /^You KNOW\./, /^In the sand, Tallyheart scratches five clutches/,
    /^Thirty-five! Now, a secret\./, /^Only one is new\./, /^Tallyheart stretches up the leaning tree\./, /^Clutches of seven\. That’s your tenth Count\./, /^At dusk, the whole Clan pads down/,
    /^Your glass is with you/, /^The full moon comes up/, /^At the very back sits a big heap of reeds\./, /^Granny winks\./, /^The front raft rides low\./, /^Granny pushes off/,
    /Nerves\?/, /^The Moon Ferry bumps onto Gathering Island\./, /^CrystalClan\./, /^The GroveClan elder spots Tallyheart\./, /^And the polite one\./, /^Three leaders sit on three big roots/,
    /^Up from the river comes a fox\./, /^Good evening, my dear Clans!/, /^Glintstar does not smile\./, /^A PILLOW cat\?/, /^She nods to you\./, /^Out shuffles Sprinkle/, /^Every Clan gasps\./,
    /^I’m right here\./, /^Every eye in the clearing is on you\./, /^Your Case File\. Pick the card/, /^Reynard bows low\./, /That night, I couldn’t even FLAP\./, /^That’s one\./,
    /^There was NO moon that night\./, /^Who is Princess Waffles\?/, /^Reynard coughs\./, /^That’s two\./, /^It’s not a scale\.|^Sprinkle’s scales are grey|^Wisp saw a FOX/,
    /^Your piece of glass shines/, /^Glass\? I said DRAGON about GLASS\? That’s three\.$/, /^Reynard’s tail twitches\./, /^Sprinkle holds up a forepaw\./, /And your count|Your count\./, /^Twenty-four\? It was a HUNDRED/,
    /^Every cat looks at Snatch\./, /^That’s four\.$/, /^Reynard laughs, a little too loudly\./, /^You didn’t NEED to\./, /^Snip looks at Snatch\./, /^And then it ALL tumbles out\./,
    /^Weasels\.$/, /^Snatch holds up his mouse\./, /^Reynard\. You lied at my border/, /^Every cat on the island stands up/, /^Reynard looks at all those cats\./, /^Back into the river he slinks/,
    /^Tomorrow, CrystalClan and ReedClan/, /^Glintstar turns to Sprinkle\./, /^Then the mist comes/, /^Out of the mist leans a great, gentle face/, /^MAMA!$/, /^Every Clan looks up, and up\./,
    /^Sprinkle runs\. She flaps\./, /^…and she FLIES\./, /^The full moon has told us\. Mended\./, /^Mama nuzzles Sprinkle/, /^Out of the mist, from near and far/, /Forepaws UP\./,
    /^Thirty-five\. And nobody’s missing\./, /waits in the mist|wait in the mist|eldest of ALL the Mistscales/, /^Sprinkle flutters down\./, /^The full moon shines on the pebble\./, /^A mist stone\. Grey/,
    /^Sprinkle says goodbye to everyone/, /^Riffle sniffs\./, /^Tallyheart\. Thank you/, /^Then Sprinkle wraps her tail round you/, /^You’re happy\. You’re sad\./, /^The Mistscales rise/,
    /^Glintstar calls you up/, /^One moon ago/, /^Tallyheart said to judge you/, /you belong to CrystalClan\./, /^The whole Clan purrs your name\./, /^Tallyheart presses her head/, /^When\?/,
    /^Which part of this moon/, /^(Ha! )?Me too\./, /^On the island’s shore/, /^Best Gathering EVER\./, /^Past the Old Bridge/, /^From the tallest tower/, /DARLING!/, /^ME\? At the GATHERING\?/,
    /^She sways\./, /^In camp:/, /^When you sit your Warrior Counts/, /^Your nest, at last\./, /^Do the paw thing/, /^He’s snoring before you can\./, /^Ten claw marks on the tree\./,
    /^Out on the island, the badger’s old track/, /^In the doorway, the full moon looks in\./, /^On your very first night/, /^What did \{name\}paw dream/, /^On the moss, your mist stone flashes/];
  for (const c of COMBOS) {
    const rows = walkLines(c.flags, c.o), name = comboName(c);
    const said = rows.map(r => r.lines.join(' ')), joined = said.join(' ¶ ');
    let i = 0;
    B.forEach(re => {
      const j = said.findIndex((s, k) => k >= i && re.test(s));
      assert.ok(j >= 0, name + ': ' + re + ' after ' + rows[i - 1 >= 0 ? i - 1 : 0].id);
      i = j + 1;
    });
    // the path-only screens: exactly where her flags say
    assert.equal(/The Moon Ferry\. On the river\. At NIGHT\./.test(joined), c.flags.worry === 'water', name);
    assert.equal(/One\. Two\. Three\. FOUR\./.test(joined), c.flags.worry === 'water', name);
    assert.equal(/You forgot to be scared!/.test(joined), c.flags.worry === 'water', name);
    assert.equal(/Tonight I’m a FAST log!/.test(joined), !!c.flags.foundPuddle, name);
    assert.equal(/It’s a LOG thing\./.test(joined), !c.flags.foundPuddle, name);
    assert.equal(/Two big eyes look up at you/.test(joined), meetsPuddle(c), name);
    assert.equal(/So many cats, and you’re the smallest\./.test(joined), c.flags.worry === 'small', name);
    assert.equal(/You hold it in no longer\./.test(joined) && /You never once had to shout LIAR\./.test(joined), c.flags.worry === 'talk', name);
    assert.equal(/And this one, you get to KEEP\./.test(joined), c.flags.worry === 'shiny', name);
    assert.equal(/And one vole\./.test(joined), c.flags.ch3Told === false, name);
    assert.equal(/Thank you for keeping my secret\./.test(joined), c.flags.ch3Told === true, name);
    assert.equal(/Riffle’s stone is by your nose\./.test(joined), c.flags.ch2Stone === 'nose', name);
    const spec = { noticing: /You notice the mouse in Snatch’s paws\./, climbing: /You hop up onto a root/, sneaking: /quiet as a shadow/, swimming: /Reynard SWAM here/, friends: /You can DO it!/ };
    Object.keys(spec).forEach(s => assert.equal(spec[s].test(joined), c.flags.specialty === s, name + ': ' + s));
  }
});

test('every `when`, on every combination: each reader reads her own lines and nobody else’s; no dragonet said goodbye to that she has not met; Wisp named only for a cat who found her', () => {
  for (const c of COMBOS) {
    const rows = walkLines(c.flags, c.o), name = comboName(c), joined = rows.map(r => r.lines.join(' ')).join(' ¶ ');
    const p = rows.map(r => r.id), end = walk(c.flags, c.o).flags;
    DRAGONETS.forEach((d, i) => assert.equal(p.includes(fid(107 + i)), !!end[SIX[i]], name + ': ' + d + '’s goodbye'));
    assert.equal(/Somewhere, Wisp nods\./.test(joined), !!c.flags.foundWisp, name);
    assert.equal(/Somewhere, a quiet one nods\./.test(joined), !c.flags.foundWisp, name);
    assert.equal(/Squall, saying goodbye\. LOUDLY\./.test(joined), !!c.flags.foundSquall, name);
    assert.equal(/You promised to look for them\. And you did\./.test(joined), SIX.some(k => end[k]), name);
    assert.equal(/And now we’re ALL going home\./.test(joined), !SIX.some(k => end[k]), name);
  }
});

test('the counted conditions, for all 64 combinations of the six found flags: exactly the right after-screen of the roll call, the right goodbyes in the story’s order, and exactly one of the three shapes’ screens', () => {
  const STEP1 = 'Out of the mist, the dragonet you found comes to stand beside you.', STEP2 = 'Small shapes step out of the mist: the dragonets you found.';
  const ONE = 'One more small shape waits in the mist, a dragonet you’ve never met. To be met another time.', SOME_ = 'Other small shapes wait in the mist, dragonets you’ve never met. To be met another time.';
  for (let m = 0; m < 64; m++) {
    const flags = six(k => !!(m & (1 << SIX.indexOf(k)))), n = SIX.filter(k => flags[k]).length;
    const rows = walkLines(Object.assign({ specialty: 'sneaking', worry: 'talk', ch3Told: true }, flags), { peek: false });
    const after = rows.slice(rows.findIndex(r => /^Thirty-five\. And nobody’s missing\./.test(r.lines.join(' '))) + 1, rows.findIndex(r => /^Sprinkle flutters down\./.test(r.lines.join(' '))));
    const lines = after.map(r => r.lines.join(' '));
    const name = JSON.stringify(flags);
    assert.equal(lines.filter(l => l === STEP1).length, n === 1 ? 1 : 0, name + ': just one');
    assert.equal(lines.filter(l => l.startsWith(STEP2)).length, n >= 2 ? 1 : 0, name + ': two or more');
    if (n === 1) assert.equal(after[0].id, fid(100 + SIX.findIndex(k => flags[k])), name);
    // the goodbyes, in the story's order, each one she found
    assert.deepEqual(after.filter(r => num(r.id) >= 107 && num(r.id) <= 112).map(r => r.id), SIX.map((k, i) => (flags[k] ? fid(107 + i) : null)).filter(Boolean), name);
    // exactly one of the three: the eldest's bow, one shape, or other shapes
    const bow = lines.filter(l => /eldest of ALL the Mistscales/.test(l)).length, one = lines.filter(l => l === ONE).length, some = lines.filter(l => l === SOME_).length;
    assert.deepEqual([bow, one, some], [n === 6 ? 1 : 0, n === 5 ? 1 : 0, n <= 4 ? 1 : 0], name);
    assert.equal(bow + one + some, 1, name);
  }
});

/* ------------------------------------------------------------------ counts */

const TH = text => ({ who: 'tallyheart', text });
const QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
const AFTER = ['Ha! You didn’t even look at the sand that time.'];
const HOP = 'Close. Let’s hop it together.', FAR = 'Let’s hop it together.';
const MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
const WAY49 = 'Six sevens is forty-two. One more seven: forty-nine.';
const WAY56 = 'Twenty and twenty make forty. Eight and eight make sixteen. Forty and sixteen: fifty-six.';
function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }
const pairs = d => d.facts.map(f => { const q = factAB(f); return q.a + 'x' + q.b; });

test('counts: every set exactly as the spec has it (section 2), and the lesson kit: the 8s warm-up, the ten 7s with 7 × 7 the one new fact, both orders, the Moon Ferry’s eight touching every table, the sixty; 21 typed answers on every reading', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), SETS);
  const way = text => ({ miss: text + ' ' + MISS, missLast: text });
  const LEGS = { table: 8, thing: 'leg', things: 'legs', unit: 'spider', units: 'spiders', teacher: 'tallyheart', ask: '{a} × {b}' };
  const CLUTCH = { table: 7, thing: 'dragonet', things: 'dragonets', unit: 'clutch', units: 'clutches', teacher: 'tallyheart', ask: '{a} × {b}' };
  assert.deepEqual(C['ch10-eights'], Object.assign({}, LEGS, {
    facts: [[8, 8], { a: 2, b: 8, right: [TH('Sixteen! Eight and eight.')], rightAgain: true }],
    warmHard: { table: 8, at: 0, avoid: [[1, 8], [2, 8], [4, 8], [6, 8], [8, 9]] }, avoid: [[6, 8]],
    fillFrom: 'ch09-eights', fillOrder: 'easiest', fillIntro: 'One from the spiders.',
    praise: ['Two fours make an eight!', 'Eight more, every time!'],
    fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST,
    remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
    rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
  }));
  assert.deepEqual(C['ch10-sevens'], Object.assign({}, CLUTCH, {
    label: 'Clutches of seven', hollowThings: 'sevens', fillOrder: 'easiest', prompt: 'How many dragonets?',
    facts: [
      { a: 2, b: 7, prompt: 'Two clutches. How many dragonets?', retryPrompt: true, right: [TH('Fourteen! Seven and seven.')] },
      { a: 7, b: 5, right: [TH('Thirty-five! You hopped that one already.')] },
      [7, 3],
      Object.assign({ a: 4, b: 7, prompt: 'Four clutches. Two clutches, doubled.', retryPrompt: true, right: [TH('Twenty-eight!')] },
        way('Fourteen and fourteen. Ten and ten make twenty. Four and four make eight. Twenty-eight.')),
      Object.assign({ a: 6, b: 7, lit: 35, prompt: 'Six clutches. Five sevens is thirty-five. One more seven…', retryPrompt: true, right: [TH('Forty-two!')] }, way('Five sevens is thirty-five. One more seven: forty-two.')),
      [10, 7],
      [7, 1],
      Object.assign({ a: 7, b: 7, lit: 42, prompt: 'Seven clutches. Six sevens is forty-two. One more seven…', retryPrompt: true, right: [TH('Forty-nine! The new one.')], rightAgain: true }, way(WAY49)),
      Object.assign({ a: 7, b: 8, prompt: 'Eight clutches? You did that one with spiders. Twenty-eight, doubled.', retryPrompt: true, right: [TH('Fifty-six!')] }, way(WAY56)),
      Object.assign({ a: 9, b: 7, prompt: 'Nine clutches. Ten would be seventy.', retryPrompt: true, right: [TH('Sixty-three! Six and three make nine.')] }, way('Seventy, and one clutch less: sixty-three.'))
    ],
    praise: ['Seven more, every time!'],
    fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST, done: 'That’s the sevens.'
  }));
  assert.deepEqual(C['ch10-ferry'], {
    table: 2, thing: 'leg', things: 'legs', teacher: 'tallyheart', ask: '{a} × {b}', ground: 'log',
    fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillIntro: 'One more!', avoid: [[2, 5]],
    facts: [
      { a: 8, b: 1, table: 1, prompt: 'Tails! Eight cats.', retryPrompt: true, right: [{ who: 'murmurchime', text: 'Eight!' }], rightAgain: true },
      { a: 5, b: 2, table: 2, prompt: 'Ears! Five cats.', retryPrompt: true, right: [{ who: 'snorer', text: 'Ten!' }], rightAgain: true },
      { a: 3, b: 10, table: 10, prompt: 'Both forepaws! Three cats.', retryPrompt: true, right: [{ who: 'riffle', text: 'Thirty! That’s a LOT of claws.' }], rightAgain: true },
      { a: 6, b: 3, table: 3, prompt: 'Patrols! Six patrols.', retryPrompt: true, right: [{ who: 'grizzled', text: 'Eighteen guards. Not ONE of them with a pinecone.' }], rightAgain: true },
      { a: 4, b: 6, table: 6, picture: { kind: 'cheeks' }, prompt: 'Whiskers! Four cheeks.', retryPrompt: true, right: [{ who: 'glintstar', text: 'Twenty-four. I remember that count.' }], rightAgain: true },
      { a: 9, b: 4, table: 4, prompt: 'Paws! Nine cats.', retryPrompt: true, right: [{ kind: 'caption', text: 'Thump! Granny bangs her pole.' }, { who: 'otter', variant: 3, text: 'Thirty-six!' }], rightAgain: true },
      { a: 6, b: 8, table: 8, prompt: 'Spiders’ legs! Six spiders.', retryPrompt: true, right: [{ who: 'thymeleaf', text: 'Forty-eight!' }, { kind: 'caption', text: 'From the luggage: a happy puff of mist.' }], rightAgain: true },
      Object.assign({ a: 7, b: 7, table: 7, picture: { kind: 'marks', ground: 'log' }, prompt: 'And the new one. Seven sevens!', retryPrompt: 'Seven sevens!',
        right: [TH('Forty-nine!'), { kind: 'caption', text: 'The whole Moon Ferry cheers.' }], rightAgain: true }, way(WAY49))
    ],
    praise: [], helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST, done: null
  });
  assert.deepEqual(C['ch10-sixty'], {
    table: 10, thing: 'fish', things: 'fish', unit: 'night', units: 'nights', teacher: 'tallyheart', ask: '{a} × {b}',
    picture: { kind: 'marks' },
    facts: [{ a: 10, b: 6, prompt: [{ who: 'player', text: 'And a dragon who eats ten fish a meal, for six nights?' }], retryPrompt: [{ who: 'player', text: 'And a dragon who eats ten fish a meal, for six nights?' }],
      right: [{ who: 'player', text: 'SIXTY!' }, { who: 'glintstar', text: 'A good count.' }], rightAgain: true }],
    help: 'picture', helpIntro: HOP, helpIntroFar: FAR,
    fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
    praise: [], miss: MISS, missLast: LAST, done: null
  });
  // chapter 9's own lines, word for word, where the spec says so
  ['praise', 'fast', 'fastAfterMiss', 'helpIntro', 'helpIntroFar', 'miss', 'missLast', 'rememberedSlow'].forEach(k => assert.deepEqual(C['ch10-eights'][k], ch09.counts['ch09-fours'][k] && k !== 'praise' ? ch09.counts['ch09-fours'][k] : C['ch10-eights'][k], k));
  assert.deepEqual(C['ch10-eights'].praise, ch09.counts['ch09-eights'].praise, 'the eights’ own praise');
  assert.equal(C['ch10-sevens'].facts[8].missLast, ch09.counts['ch09-eights'].facts[3].missLast, '7 × 8’s way is chapter 9’s, exactly');
  // the lesson kit: ten sevens, 7 × 1 to 7 × 10, both orders five each way, 7 × 7 the only new one
  const ten = pairs(C['ch10-sevens']);
  assert.deepEqual(ten, ['2x7', '7x5', '7x3', '4x7', '6x7', '10x7', '7x1', '7x7', '7x8', '9x7']);
  assert.deepEqual(ten.map(pairKey).map(k => +k.split('x').find(x => +x !== 7) || 7).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(ten.filter(k => k.startsWith('7x')).length, 5, 'seven first in five');
  assert.equal(at(countsAt('ch10-sevens')[0]) > at(countsAt('ch10-eights')[0]), true);
  assert.equal(ten.indexOf('7x7') - ten.indexOf('6x7'), 3, '6 × 7 three before 7 × 7');
  // the Moon Ferry: every table touched, the easiest first, 7 × 7 last; never the nine lives on the water
  const ferry = C['ch10-ferry'].facts.map(factAB);
  assert.deepEqual([...new Set(ferry.reduce((m, q) => m.concat([q.a, q.b]), []))].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(ferry.map(q => q.table), [1, 2, 10, 3, 6, 4, 8, 7]);
  assert.ok(!ferry.some(q => q.table === 9), 'never the nine lives on the water');
  // every fact arithmetic, in its Count, no duplicates in a set
  Object.keys(C).forEach(sid => {
    const d = C[sid], keys = new Set();
    d.facts.forEach(f => {
      const q = factAB(f), tb = q.table || d.table;
      assert.ok(q.a === tb || q.b === tb, sid + ': ' + q.a + '×' + q.b + ' belongs to the ' + tb + 's');
      assert.ok(!keys.has(q.a + 'x' + q.b), sid);
      keys.add(q.a + 'x' + q.b);
    });
  });
  const typed = SETS.reduce((m, sid) => m + C[sid].facts.length, 0);
  assert.equal(typed, 21);
  t.diagnostic('21 typed answers on every reading with no misses, 22 with Puddle');
});

test('counts: lines are short, whole sentences, and fit both sexes; nobody but the set’s own voices speaks in it, and each voice is in its Counts frame’s picture (the sixty’s Tallyheart too); Granny’s cheer has variant 3’s face and voice', () => {
  const VOICES = { 'ch10-eights': ['tallyheart'], 'ch10-sevens': ['tallyheart'], 'ch10-ferry': ['murmurchime', 'snorer', 'riffle', 'grizzled', 'glintstar', 'otter', 'thymeleaf', 'tallyheart'], 'ch10-sixty': ['player', 'glintstar'] };
  countsLines().forEach(x => {
    assert.ok(typeof x.text === 'string' && x.text.trim(), x.set + ' ' + x.where);
    assert.ok(words(x.text) <= (/^helpIntro|prompt|miss/.test(x.where) ? 22 : 18), x.set + ' ' + x.where + ': short: ' + x.text);
    assert.ok(E.endsSentence(x.text), x.set + ' ' + x.where + ': a whole sentence');
    if (x.who) assert.ok(VOICES[x.set].includes(x.who), x.set + ' ' + x.where + ': ' + x.who);
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.set + ' ' + x.where + ': ' + x.text));
  });
  Object.keys(VOICES).forEach(sid => {
    const said = new Set(countsLines().filter(x => x.set === sid && x.who).map(x => x.who));
    assert.deepEqual([...said].sort(), VOICES[sid].slice().sort(), sid);
    countsAt(sid).forEach(id => [...said].concat([story.counts[sid].teacher]).forEach(who => assert.ok(castOf(id, who).length, id + ': ' + who + ' speaks in ' + sid + ', so is in the picture')));
  });
  assert.deepEqual(castOf(countsAt('ch10-sixty')[0], 'tallyheart').map(c => c.at), ['crowd-1'], 'the sixty: Tallyheart at the front of CrystalClan’s seats');
  // Granny's “Thirty-six!” through the engine and the page: variant 3's label and pitch, never the old ferry otter's
  const rows = play(before10(), 'ch10-ferry', null, { all: 2000 }), r94 = rows.find(x => x.k === '9x4');
  const g = r94.balloons.find(b => b.who === 'otter');
  assert.deepEqual([g.variant, labelFor(g, null), Sp.pitch(g.who, g.variant)], [3, 'Granny', 0.92]);
  assert.notEqual(Sp.pitch('otter', 1), 0.92);
  // and the page: the lesson runner keeps the line's variant for her face (stackBalloon's speakerFace) and her voice
  // (speakItems' pitch), on the right answer's balloons and Read to me alike; the prompt lines too
  const UI = require('fs').readFileSync(require('path').join(__dirname, '../app/ui.js'), 'utf8');
  assert.match(UI, /\{ who: b\.who \|\| teacher, text: fillQ\(b\.text\), kind: b\.kind, variant: b\.variant \}/, 'balloonLines keeps the variant');
  assert.match(UI, /speakItems\(lines\.map\(function \(l\) \{ return \{ text: l\.text, who: l\.who, variant: l\.variant \}; \}\)\);/, 'and says it in her voice');
  assert.match(UI, /\{ who: l\.who, text: fill\(l\.text\), kind: l\.kind, variant: l\.variant \}/, 'the prompt lines too');
  assert.match(UI, /return stackBalloon\(\{ who: l\.who \|\| teacher, text: l\.text, html: l\.html, kind: l\.kind, name: l\.name, variant: l\.variant \}, extraClass\);/);
  assert.match(UI, /var face = b\.noFace \? '' : speakerFace\(b\.who, b\.variant\);/);
  assert.match(UI, /u\.pitch = pitchOf\(it\.who, it\.variant\);/);
  // no praise line names a total
  ['ch10-eights', 'ch10-sevens'].forEach(sid => [].concat(story.counts[sid].praise, story.counts[sid].fast, story.counts[sid].fastAfterMiss).forEach(l => assert.doesNotMatch(l, /\d|fourteen|twenty|thirty|forty|fifty|sixty|seventy/i, sid + ': ' + l)));
});

/* A cat who has read chapters 1 to 9, with these answers and times in chapter 9's eights (and its doses). */
const eightsCat = (eights, eightsMs, more) => before10({}, Object.assign({ eights, eightsMs }, more || {}));
/* That cat after this morning's warm-up (clean). */
const warmCat = (eights, ms) => { const c = eightsCat(eights, ms); play(c, 'ch10-eights'); return c; };

test('the warm-up, the build notes’ tests: her hardest 8s fact from chapter 9 first, 8 × 8 when nothing was hard, never 1 × 8, 2 × 8, 4 × 8, 6 × 8 or 9 × 8; a chapter-9 miss or slow fact opens on itself with “Last time…”, never “Yesterday”; 2 × 8 timed on itself; its fillers 8 × 3 after a missed first, 8 × 3 then 4 × 8 after a missed 2 × 8, never 6 × 8, 7 × 8 or 8 × 8', () => {
  const def = story.counts['ch10-eights'];
  const facts = cat => E.lessonFacts(cat, Object.assign({ id: 'ch10-eights' }, def), STORIES).map(x => (Array.isArray(x) ? x.join('x') : x.a + 'x' + x.b + (x.hard ? ' hard' : '')));
  assert.deepEqual(facts(eightsCat()), ['8x8', '2x8'], 'nothing was hard in chapter 9: 8 × 8');
  for (const k of ['8x8', '7x8']) assert.deepEqual(facts(eightsCat({ [k]: [1] })), [k + ' hard', '2x8'], 'a chapter-9 miss of ' + k);
  assert.deepEqual(facts(eightsCat(null, null, { rubs: { '3x8': [1] } })), ['3x8 hard', '2x8'], 'a miss of the rubs’ 3 × 8');
  assert.deepEqual(facts(eightsCat(null, null, { flaps: { '8x8': [1] } })), ['8x8 hard', '2x8'], 'a miss of the flaps’ 8 × 8');
  for (const k of ['8x3', '8x5', '8x10']) assert.deepEqual(facts(eightsCat(null, { all: 1500, [k]: 9000 })), [k + ' hard', '2x8'], 'a slow ' + k + ', timed on itself in chapter 9');
  // passed over (the cost chapter 9's spec named): a chapter-9 miss of 2 × 8, 4 × 8 (or the dew's 8 × 4), 6 × 8 or 9 × 8
  for (const k of ['2x8', '4x8', '6x8', '9x8']) assert.deepEqual(facts(eightsCat({ [k]: [1] })), ['8x8', '2x8'], 'a chapter-9 miss of ' + k + ': never picked');
  assert.deepEqual(facts(eightsCat(null, null, { dew: { '8x4': [1] } })), ['8x8', '2x8'], 'the dew’s 8 × 4: never picked');
  assert.deepEqual(facts(before10({ foundMizzle: true }, { mizzle: { '6x8': [1] } })), ['8x8', '2x8'], 'Mizzle’s 6 × 8: never picked (it is the Moon Ferry’s)');
  // the words: the engine's, for both (2 × 8 has no prompt of its own)
  assert.equal(def.facts[1].prompt, undefined, 'no prompt on 2 × 8, so it is timed on itself');
  const quick = play(eightsCat(), 'ch10-eights', null, { all: 1500 });
  assert.deepEqual(quick.map(x => [x.k, x.prompt.map(p => p.label + ': ' + p.text).join(' '), x.line, x.balloons.map(b => b.text).join('|')]), [
    ['8x8', 'Tallyheart: Eight spiders. How many legs?', 'Quick as a pounce!', ''], ['2x8', 'Tallyheart: Two spiders. How many legs?', '', 'Sixteen! Eight and eight.']]);
  assert.equal(play(eightsCat(), 'ch10-eights', null, { all: 9000 })[0].line, 'Two fours make an eight!');
  const hard = play(eightsCat(null, { all: 1500, '8x3': 9000 }), 'ch10-eights', null, { all: 1500 });
  assert.deepEqual([hard[0].prompt.map(p => p.text).join(' '), hard[0].kind, hard[0].line], ['Three spiders. How many legs?', 'remembered', 'Last time, 8 × 3 made you stop and think. Not today!']);
  const hardSlow = play(eightsCat(null, { all: 1500, '8x3': 9000 }), 'ch10-eights', null, { all: 9000 });
  assert.deepEqual([hardSlow[0].kind, hardSlow[0].line], ['rememberedSlow', '8 × 3 again, and you got it. It’s getting easier.']);
  countsLines().filter(x => x.set === 'ch10-eights').forEach(x => assert.doesNotMatch(x.text, /Yesterday/, x.where));
  // both questions timed on themselves
  assert.equal(E.readFirst({ set: 'ch10-eights', a: 8, b: 8 }, STORIES, null, true), false);
  assert.equal(E.readFirst({ set: 'ch10-eights', a: 2, b: 8 }, STORIES, null, false), false);
  // a miss: the sand, four and four, hopped by eights; easy eights lent from chapter 9's lesson, in its spiders
  const miss1 = play(eightsCat(), 'ch10-eights', { '8x8': [60] });
  assert.deepEqual(ks(miss1), ['8x8✗', '2x8', 'F:8x3', 'R:8x8']);
  assert.deepEqual([miss1[0].help.nums, miss1[0].help.ground, miss1[0].help.per, miss1[0].help.intro, miss1[0].line], [[8, 16, 24, 32, 40, 48, 56, 64], 'sand', 8, HOP, MISS]);
  assert.match(A.sand(E.sandOpts(miss1[0].help, 0)), /four and four/);
  assert.equal(miss1[2].prompt.map(p => p.text).join(' '), 'One from the spiders. Three spiders. How many legs?');
  assert.equal(miss1[3].prompt.map(p => p.text).join(' '), 'Here’s that one again. Eight spiders. How many legs?');
  assert.equal(play(eightsCat(), 'ch10-eights', { '8x8': [20] })[0].help.intro, FAR);
  const miss2 = play(eightsCat(), 'ch10-eights', { '2x8': [15] });
  assert.deepEqual(ks(miss2), ['8x8', '2x8✗', 'F:8x3', 'F:4x8', 'R:2x8']);
  assert.deepEqual([miss2[4].prompt.map(p => p.text).join(' '), miss2[4].balloons.map(b => b.text)], ['Here’s that one again. Two spiders. How many legs?', ['Sixteen! Eight and eight.']], 'the right line kept on a retry');
  // fillers never 6 × 8 (the Moon Ferry's), 8 × 8 or 7 × 8, to six misses, with every hard pick
  const PICKS = [[null, null, '8x8'], [{ '7x8': [1] }, null, '7x8'], [null, { all: 1500, '8x3': 9000 }, '8x3'], [null, { all: 1500, '8x5': 9000 }, '8x5'], [null, { all: 1500, '8x10': 9000 }, '8x10']];
  for (const [e, ms, hardPick] of PICKS) for (let m = 1; m < 64; m++) {
    const plan = []; for (let i = 0; i < 6; i++) plan.push((m >> i) & 1 ? 0 : 1);
    const rows = playPlan(eightsCat(e, ms), 'ch10-eights', plan);
    assert.equal(pairKey(rows[0].k), pairKey(hardPick), hardPick);
    rows.filter(r => r.q.filler).forEach(r => assert.ok(!['6x8', '7x8', '8x8'].includes(pairKey(r.k)), hardPick + ': never ' + r.k + ' as a filler (' + rows.map(x => x.k).join(' ') + ')'));
  }
  assert.equal(play(eightsCat(), 'ch10-eights', { '8x8': [1, 1, 1] }).filter(x => x.k.endsWith('8x8✗')).pop().line, LAST);
});

// A lesson answered by position: `plan[i]` 0 is a wrong answer to the i-th question, anything else (or past the
// plan's end) right. Each row: its key (F: a filler, R: a retry, ✗ missed), the question and its prompt's words.
function playPlan(cat, setId, plan, ms) {
  const home = homeOf(setId), { def, state } = E.chapterLesson(cat, home, setId, 1, STORIES), out = [];
  for (let i = 0; !E.counts.done(state) && i < 60; i++) {
    const q = E.counts.question(state), D = E.questionDef(def, q, home, STORIES), right = plan[i] !== 0;
    const w = E.promptLines(def, D, q).map(l => l.text).join(' ');
    const r = E.counts.answer(state, D, right ? q.answer : q.answer + 1, ms || 2000, 1);
    E.logAnswer(cat, r.entry);
    out.push({ k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + q.a + 'x' + q.b + (r.correct ? '' : '✗'), q, D, words: w, correct: r.correct, r,
      said: [].concat(r.line ? [r.line] : [], (r.balloons || []).map(b => b.text)), help: r.correct ? null : E.helpPlan(def, D, q, r) });
    if (r.done) E.recordLesson(cat, state);
  }
  return out;
}

test('the warm-up’s known slip (the spec’s section 7, item 6), pinned: it lends its own 2 × 8 back only after three misses, and only when the hard pick is 8 × 3, 3 × 8 or 8 × 5; never with any other hard pick', () => {
  const N = 8, plans = [];
  for (let m = 0; m < (1 << N); m++) { const p = []; for (let i = 0; i < N; i++) p.push((m >> i) & 1 ? 0 : 1); plans.push(p); }
  const PICKS = [[null, null, null, '8x8'], [{ '8x8': [1] }, null, null, '8x8'], [null, { all: 1500, '8x3': 9000 }, null, '8x3'], [null, null, { rubs: { '3x8': [1] } }, '3x8'], [null, { all: 1500, '8x5': 9000 }, null, '8x5'],
    [null, { all: 1500, '8x10': 9000 }, null, '8x10'], [{ '7x8': [1] }, null, null, '7x8']];
  for (const [e, ms, more, hardPick] of PICKS) {
    const base = eightsCat(e, ms, more);
    let reached = 0;
    for (const plan of plans) {
      const rows = playPlan(clone(base), 'ch10-eights', plan);
      assert.equal(pairKey(rows[0].k), pairKey(hardPick), 'the hard pick first: ' + hardPick);
      const i = rows.findIndex(r => r.q.filler && pairKey(r.k) === '2x8');
      if (i < 0) continue;
      const misses = rows.slice(0, i).filter(r => !r.correct).length;
      reached++;
      assert.ok(misses >= 3, hardPick + ': 2 × 8 lent back after only ' + misses + ' misses: ' + rows.map(r => r.k).join(' '));
      assert.match(rows[i].words, /^One from the spiders\. /, 'as “One from the spiders.”');
    }
    if (['3x8', '5x8'].includes(pairKey(hardPick))) assert.ok(reached > 0 && reached < plans.length / 2, hardPick + ': a rare path (' + reached + ' of ' + plans.length + ')');
    else assert.equal(reached, 0, hardPick + ': never with any other hard pick');
  }
});

test('the lesson, the build notes’ tests: ten facts in the story’s order, that many clutches seven dragonets each, the step-offs lit; the words and the engine’s four; only 7 × 7’s right line on its retry; the quick lines and the praise; every miss hops by sevens, four and three, its way, back two later; the fillers; the four facts timed on themselves; a hard 7 × 8 met again', () => {
  const rows = play(warmCat(), 'ch10-sevens', null, { all: 6000 });
  assert.deepEqual(ks(rows), ['2x7', '7x5', '7x3', '4x7', '6x7', '10x7', '7x1', '7x7', '7x8', '9x7']);
  assert.deepEqual(rows.map(x => x.q.answer), [14, 35, 21, 28, 42, 70, 7, 49, 56, 63]);
  assert.deepEqual(rows.map(x => [x.picture.groups, x.picture.highlight, x.picture.thing]), [[2, 0, 'dragonet'], [5, 0, 'dragonet'], [3, 0, 'dragonet'], [4, 0, 'dragonet'], [6, 35, 'dragonet'], [10, 0, 'dragonet'], [1, 0, 'dragonet'], [7, 42, 'dragonet'], [8, 0, 'dragonet'], [9, 0, 'dragonet']], 'that many clutches, all unlit but the step-offs');
  rows.forEach(x => assert.deepEqual([x.q.per, x.q.table, x.teacher], [7, 7, 'tallyheart'], x.k));
  assert.match(A.countsPicture(Object.assign({ look: {} }, rows[7].picture)), /7 clutches, seven dragonets each/);
  const ask = k => rows.find(x => x.k === k).prompt.map(p => p.text).join(' ');
  assert.deepEqual(['7x5', '7x3', '10x7', '7x1'].map(ask), ['How many dragonets?', 'How many dragonets?', 'How many dragonets?', 'How many dragonets?'], 'the set’s own words for the four with none');
  assert.equal(ask('7x7'), 'Seven clutches. Six sevens is forty-two. One more seven…');
  const said = k => rows.find(x => x.k === k).balloons.map(b => b.text).join(' | ');
  assert.deepEqual(['2x7', '7x5', '4x7', '6x7', '7x7', '7x8', '9x7'].map(said), ['Fourteen! Seven and seven.', 'Thirty-five! You hopped that one already.', 'Twenty-eight!', 'Forty-two!', 'Forty-nine! The new one.', 'Fifty-six!', 'Sixty-three! Six and three make nine.']);
  // 7 × 3, 10 × 7, 7 × 1: slow, the praise; quick, the fast lines (never two running); after any miss, “Ha!” leads
  assert.deepEqual(['7x3', '10x7', '7x1'].map(k => rows.find(x => x.k === k).line), ['Seven more, every time!', 'Seven more, every time!', 'Seven more, every time!']);
  const quick = play(warmCat(), 'ch10-sevens', null, { all: 1500 });
  assert.deepEqual(['7x3', '10x7', '7x1'].map(k => quick.find(x => x.k === k).line), ['Quick as a pounce!', 'You knew that one before I finished asking.', 'Seven more, every time!'], 'a quick 7 × 1 straight after a quick 10 × 7 gets the praise');
  assert.equal(quick.find(x => x.k === '7x5').line, '', '7 × 5 has its own right line: timed, never praised');
  assert.equal(play(warmCat(), 'ch10-sevens', { '4x7': [24] }, { all: 1500 }).find(x => x.k === '10x7').line, AFTER[0], 'quick after a miss');
  // the four engine-worded retries and the six with words of their own
  const retryWords = (k, wrong) => play(warmCat(), 'ch10-sevens', { [k]: [wrong] }).find(x => x.k === 'R:' + k).prompt.map(p => p.text).join(' ');
  assert.deepEqual([['7x5', 30], ['7x3', 20], ['10x7', 60], ['7x1', 6]].map(([k, w]) => retryWords(k, w)), ['Here’s that one again. Five clutches. How many dragonets?',
    'Here’s that one again. Three clutches. How many dragonets?', 'Here’s that one again. Ten clutches. How many dragonets?', 'Here’s that one again. One clutch. How many dragonets?']);
  assert.equal(retryWords('7x7', 48), 'Here’s that one again. Seven clutches. Six sevens is forty-two. One more seven…');
  // only 7 × 7's right line plays on its retry; every other right retry gets the engine's
  const r77 = play(warmCat(), 'ch10-sevens', { '7x7': [48] }).find(x => x.k === 'R:7x7');
  assert.deepEqual(r77.balloons.map(b => b.text), ['Forty-nine! The new one.']);
  const r27 = play(warmCat(), 'ch10-sevens', { '2x7': [13] }).find(x => x.k === 'R:2x7');
  assert.ok(['There it is. You remembered that one.', 'Yes! That one came back, and you knew it.'].includes(r27.line), r27.line);
  assert.deepEqual(story.counts['ch10-sevens'].facts.filter(f => f.rightAgain).map(f => f.a + 'x' + f.b), ['7x7']);
  // every single miss: the sand by sevens, four and three; “Close.” within one hop; its way, if it has one; back two later
  const WAY = { '4x7': 'Fourteen and fourteen. Ten and ten make twenty. Four and four make eight. Twenty-eight.', '6x7': 'Five sevens is thirty-five. One more seven: forty-two.', '7x7': WAY49, '7x8': WAY56, '9x7': 'Seventy, and one clutch less: sixty-three.' };
  ks(rows).forEach(k => {
    const [a, b] = k.split('x').map(Number), right = a * b;
    const near = play(warmCat(), 'ch10-sevens', { [k]: [right - 7] }), far = play(warmCat(), 'ch10-sevens', { [k]: [right + 15] });
    const m = near.find(x => x.k === k + '✗');
    assert.equal(m.help.intro, HOP, k + ': within one hop');
    assert.equal(far.find(x => x.k === k + '✗').help.intro, FAR, k + ': further off');
    assert.deepEqual([m.help.ground, m.help.per], ['sand', 7], k);
    assert.equal(m.help.nums[m.help.nums.length - 1], right, k + ': the count ends on the answer');
    assert.ok(m.help.nums.every((x, j) => x === 7 * (j + 1)) || m.q.lit, k + ': hopped by sevens');
    assert.match(A.sand(E.sandOpts(m.help, 0)), /four and three/, k + ': the sand four and three');
    assert.equal(m.line, WAY[k] ? WAY[k] + ' ' + MISS : MISS, k + ': its own line');
    const back = near.findIndex(x => x.k === 'R:' + k);
    if (['7x8', '9x7'].includes(k)) assert.ok(back > near.indexOf(m), k + ': near the end it comes back after the fillers');
    else assert.equal(back - near.indexOf(m), 3, k + ': comes back two questions later (' + ks(near).join(' ') + ')');
  });
  assert.deepEqual(ks(play(warmCat(), 'ch10-sevens', { '6x7': [40] })).slice(4, 9), ['6x7✗', '10x7', '7x1', 'R:6x7', '7x7'], 'a missed 6 × 7 comes back just before 7 × 7');
  // fillers near the end: the lesson's own easiest she has answered right, “How many dragonets?”, in clutches
  const f9 = play(warmCat(), 'ch10-sevens', { '9x7': [60] });
  assert.deepEqual(ks(f9).slice(9), ['9x7✗', 'F:7x1', 'F:2x7', 'R:9x7']);
  f9.filter(x => x.q.filler).forEach(x => assert.deepEqual([x.prompt.map(p => p.text).join(' '), x.picture.thing], ['How many dragonets?', 'dragonet'], x.k));
  assert.deepEqual(ks(play(warmCat(), 'ch10-sevens', { '9x7': [60, 60] })).slice(9), ['9x7✗', 'F:7x1', 'F:2x7', 'R:9x7✗', 'F:7x3', 'F:4x7', 'R:9x7']);
  // 7 × 7 a filler only after four misses
  for (let m = 1; m < 256; m++) {
    const plan = []; for (let i = 0; i < 12; i++) plan.push(i < 8 && (m >> i) & 1 ? 0 : 1);
    const rows2 = playPlan(warmCat(), 'ch10-sevens', plan), i = rows2.findIndex(r => r.q.filler && pairKey(r.k) === '7x7');
    if (i >= 0) assert.ok(rows2.slice(0, i).filter(r => !r.correct).length >= 4, '7 × 7 lent after fewer than four misses: ' + ks(rows2).join(' '));
  }
  // a last miss: the way alone (or the last line)
  assert.deepEqual(play(warmCat(), 'ch10-sevens', { '7x7': [48, 48, 48] }).filter(x => x.k.endsWith('7x7✗')).map(x => x.line), [WAY49 + ' ' + MISS, WAY49 + ' ' + MISS, WAY49]);
  assert.equal(play(warmCat(), 'ch10-sevens', { '7x3': [20, 20, 20] }).filter(x => x.k.endsWith('7x3✗'))[2].line, LAST);
  // timing: 7 × 5, 7 × 3, 10 × 7 and 7 × 1, the four timed on themselves, are what a slow clean lesson leaves hard
  const cslow = warmCat(); play(cslow, 'ch10-sevens', null, { all: 9000 });
  assert.deepEqual(E.hardFacts(cslow, 7, STORIES), [[7, 1], [10, 7], [7, 3], [7, 5]]);
  // a hard 7 × 8 from chapter 9 is the warm-up's first question, and met again in the lesson minutes later
  const c78 = eightsCat({ '7x8': [1] });
  const w78 = play(c78, 'ch10-eights'), l78 = play(c78, 'ch10-sevens');
  assert.deepEqual([w78[0].k, w78[0].prompt.map(p => p.text).join(' '), l78[8].k, ask('7x8')], ['7x8', 'Seven spiders. How many legs?', '7x8', 'Eight clutches? You did that one with spiders. Twenty-eight, doubled.']);
  assert.equal(story.counts['ch10-sevens'].done, 'That’s the sevens.');
});

test('the 7s’ giveaways (the story’s claim, run): after one miss of each of any two facts, no prompt, right line, help opening or way says a later question’s answer within three questions (the hop count left out)', () => {
  const NUMW = { 7: 'seven', 14: 'fourteen', 21: 'twenty-one', 28: 'twenty-eight', 35: 'thirty-five', 42: 'forty-two', 49: 'forty-nine', 56: 'fifty-six', 63: 'sixty-three', 70: 'seventy' };
  const says = (text, n) => new RegExp('\\b' + NUMW[n] + '\\b', 'i').test(text);
  const ten = pairs(story.counts['ch10-sevens']);
  const answers = {}; ten.forEach(k => { const [a, b] = k.split('x').map(Number); answers[k] = a * b; });
  let patterns = 0;
  for (let i = 0; i < ten.length; i++) for (let j = i; j < ten.length; j++) {
    const ans = { [ten[i]]: [answers[ten[i]] + 1] };
    if (j !== i) ans[ten[j]] = [answers[ten[j]] + 1];
    const rows = play(warmCat(), 'ch10-sevens', ans);
    patterns++;
    rows.forEach((r, n) => {
      const lines = r.prompt.map(p => p.text).concat(r.balloons.map(b => b.text), r.help ? [r.help.intro, r.line] : []);
      for (let k = n + 1; k <= Math.min(rows.length - 1, n + 3); k++) {
        const later = rows[k];
        // (seven, 7 × 1's answer, is the table's own word, in every prompt and help)
        if (later.q.answer === r.q.answer || later.q.answer === 7) continue;
        lines.forEach(l => assert.ok(!says(l, later.q.answer), ks(rows).join(' ') + ': “' + l + '” at ' + r.k + ' says ' + later.q.answer + ', ' + (k - n) + ' before ' + later.k));
      }
    });
  }
  assert.equal(patterns, 55);
});

test('the Moon Ferry Counts, the build notes’ tests: each fact its own Count’s picture and table (6 × 8 spiders, 7 × 7 seven rows of seven marks on a log); Tallyheart calls each Count, a Clanmate cheers, every cheer kept on its retry; 7 × 7’s retry words; the help on a log; the fillers easy ears in the ferry’s words, never one of its own pairs; how it ends', () => {
  const rows = play(warmCat(), 'ch10-ferry', null, { all: 2000 });
  assert.deepEqual(ks(rows), ['8x1', '5x2', '3x10', '6x3', '4x6', '9x4', '6x8', '7x7']);
  assert.deepEqual(rows.map(r => r.entry.table || r.q.table), [1, 2, 10, 3, 6, 4, 8, 7], 'each logged under its own table');
  assert.deepEqual(rows.map(r => r.prompt.map(p => p.label + ': ' + p.text).join(' ')), ['Tallyheart: Tails! Eight cats.', 'Tallyheart: Ears! Five cats.', 'Tallyheart: Both forepaws! Three cats.', 'Tallyheart: Patrols! Six patrols.',
    'Tallyheart: Whiskers! Four cheeks.', 'Tallyheart: Paws! Nine cats.', 'Tallyheart: Spiders’ legs! Six spiders.', 'Tallyheart: And the new one. Seven sevens!']);
  assert.deepEqual(rows.map(r => r.balloons.map(b => (b.who || 'caption') + ': ' + b.text).join(' | ')), ['murmurchime: Eight!', 'snorer: Ten!', 'riffle: Thirty! That’s a LOT of claws.', 'grizzled: Eighteen guards. Not ONE of them with a pinecone.',
    'glintstar: Twenty-four. I remember that count.', 'caption: Thump! Granny bangs her pole. | otter: Thirty-six!', 'thymeleaf: Forty-eight! | caption: From the luggage: a happy puff of mist.', 'tallyheart: Forty-nine! | caption: The whole Moon Ferry cheers.']);
  // the pictures: tails, ears, both forepaws, patrols, cheeks, nine cats' paws, spiders, marks on a log
  const pic = k => rows.find(r => r.k === k).picture;
  assert.equal(pic('6x8').thing, 'leg', '6 × 8 drawn as spiders (the set’s thing)');
  assert.deepEqual([pic('7x7').kind, pic('7x7').ground, pic('7x7').groups, pic('7x7').per], ['marks', 'log', 7, 7]);
  assert.equal(pic('4x6').kind, 'cheeks');
  assert.match(A.countsPicture(Object.assign({ look: {} }, pic('7x7'))), /Seven rows of seven marks/);
  assert.match(A.countsPicture(Object.assign({ look: {} }, pic('6x8'))), /6 spiders, eight legs each/);
  rows.forEach(r => assert.notEqual(r.picture.thing, 'dragonet', r.k + ': never clutches on the Moon Ferry'));
  // every cheer on its retry; every fact's words kept, 7 × 7's retry without “And the new one.”
  rows.forEach(r => {
    const k = r.k, [a, b] = k.split('x').map(Number);
    const m = play(warmCat(), 'ch10-ferry', { [k]: [a * b + 1] });
    const back = m.find(x => x.k === 'R:' + k), miss = m.find(x => x.k === k + '✗');
    assert.deepEqual(back.balloons.map(x => x.text), r.balloons.map(x => x.text), k + ': the cheer on its retry');
    assert.equal(back.prompt.map(p => p.text).join(' '), 'Here’s that one again. ' + (k === '7x7' ? 'Seven sevens!' : r.prompt.map(p => p.text).join(' ')), k + ': its words again');
    assert.deepEqual([miss.help.ground, miss.help.per], ['log', r.q.per], k + ': the help scratched on a log, in its Count');
    assert.equal(miss.help.nums[miss.help.nums.length - 1], a * b, k);
    assert.equal(miss.line, k === '7x7' ? WAY49 + ' ' + MISS : MISS, k);
  });
  assert.match(A.sand(E.sandOpts(play(warmCat(), 'ch10-ferry', { '7x7': [48] }).find(x => x.k === '7x7✗').help, 0)), /four and three/);
  // the fillers: easy ears, the easiest first, in the ferry's voice, no cheer; never one of the ferry's own pairs
  const f1 = play(warmCat(), 'ch10-ferry', { '6x8': [47] });
  const fill1 = f1.filter(x => x.q.filler);
  assert.deepEqual(fill1.map(x => x.prompt.map(p => p.text).join(' ')), ['One more! One cat. How many ears?']);
  fill1.forEach(x => { assert.deepEqual([x.picture.thing, x.line, x.balloons.length], ['ear', '', 0], x.k); });
  const own = new Set(pairs(story.counts['ch10-ferry']).map(pairKey));
  for (let m = 1; m < 256; m++) {
    const plan = []; for (let i = 0; i < 12; i++) plan.push(i < 8 && (m >> i) & 1 ? 0 : 1);
    const rr = playPlan(warmCat(), 'ch10-ferry', plan);
    rr.filter(r => r.q.filler).forEach(r => { assert.ok(!own.has(pairKey(r.k)), 'an own pair lent: ' + ks(rr).join(' ')); assert.ok(['1x2', '2x2', '2x3', '2x4'].includes(pairKey(r.k)), r.k); });
    // how it ends: a cheer, a filler's retry, or a third miss: never a wall
    const last = rr[rr.length - 1];
    assert.ok(last.correct || last.r.done, ks(rr).join(' '));
  }
});

test('the sixty, the build notes’ tests: said, then typed, never timed; six nights of ten marks lit by tens in Tallyheart’s count; two easy tens in the sixty’s own picture and words; it can end on a missed filler’s retry', () => {
  const sixty = countsAt('ch10-sixty')[0];
  assert.equal(E.readFirst({ set: 'ch10-sixty', a: 10, b: 6 }, STORIES, null, false), true, 'read under her own question: never timed');
  const rows = play(warmCat(), 'ch10-sixty');
  assert.deepEqual(rows.map(r => [r.k, r.prompt.length, r.balloons.map(b => b.who + ': ' + b.text).join(' | ')]), [['10x6', 1, 'player: SIXTY! | glintstar: A good count.']]);
  // its own prompt: her last sentence, the frame's line, so a sixty picked up mid-question is asked in words too
  assert.deepEqual(rows[0].prompt.map(p => p.who + ': ' + p.text), ['player: And a dragon who eats ten fish a meal, for six nights?']);
  assert.deepEqual([rows[0].picture.kind, rows[0].picture.groups, rows[0].picture.per, rows[0].picture.highlight], ['marks', 6, 10, 0]);
  const m = play(warmCat(), 'ch10-sixty', { '10x6': [50] });
  assert.deepEqual(ks(m), ['10x6✗', 'F:1x10', 'F:10x2', 'R:10x6']);
  assert.deepEqual([m[0].help.picture, m[0].help.nums, m[0].help.intro, m[0].line], [true, [10, 20, 30, 40, 50, 60], HOP, MISS]);
  assert.deepEqual(m.slice(1, 3).map(x => x.prompt.map(p => p.text).join(' ')), ['An easy one. One night. How many fish?', 'An easy one. Two nights. How many fish?']);
  m.slice(1, 3).forEach(x => assert.deepEqual([x.picture.kind, x.balloons.length], ['marks', 0], x.k));
  assert.deepEqual([m[3].prompt.map(p => (p.who || '') + ': ' + p.text), m[3].balloons.map(b => b.text)], [[': Here’s that one again.', 'player: And a dragon who eats ten fish a meal, for six nights?'].map(s => s.replace(/^: /, 'tallyheart: ')), ['SIXTY!', 'A good count.']]);
  // the ending on a missed filler's retry (the spec's section 7, item 9)
  const end = playPlan(warmCat(), 'ch10-sixty', [0, 0, 1, 1, 1, 1]);
  assert.deepEqual(end.map(r => r.k), ['10x6✗', 'F:1x10✗', 'F:10x2', 'R:10x6', 'R:1x10']);
  assert.ok(['There it is. You remembered that one.', 'Yes! That one came back, and you knew it.'].includes(end[4].r.line));
  // the frame: Glintstar's line by the fourth pick and our cat's question, not said again over the question (`intro: false`)
  assert.equal(frames[sixty].counts.intro, false);
  assert.deepEqual(Sp.lessonIntro(E.balloons(frames[sixty], { flags: { ch10PickBig: 'fur' } }), true), []);
});

test('Puddle’s riddle under the raft: chapter 5’s set, run as chapter 5 ran it, its balloon “Want a log riddle?”; missed twice it lends 10 × 3 before the Moon Ferry’s 3 × 10, read first there', () => {
  const riddle = countsAt('ch05-puddle')[0];
  assert.deepEqual(frames[riddle].counts, { set: 'ch05-puddle', next: fid(num(riddle) + 1) });
  assert.deepEqual(frames[riddle].say, [{ who: 'puddle', text: 'Want a log riddle?' }]);
  const rows = play(warmCat(), 'ch05-puddle');
  assert.deepEqual(rows.map(r => [r.k, r.prompt.map(p => p.text).join(' '), r.balloons.map(b => b.text).join(' | ')]), [['4x10', 'Four logs in this raft. I’ve bumped my head ten times on every one. How many bumps?', 'FORTY! | No wonder it hurts.']]);
  const twice = playPlan(warmCat(), 'ch05-puddle', [0, 1, 1, 0, 1, 1, 1, 1]);
  assert.ok(twice.some(r => r.q.filler && r.k === 'F:10x3'), 'it lends 10 × 3: ' + twice.map(r => r.k).join(' '));
  assert.equal(E.readFirst({ set: 'ch10-ferry', a: 3, b: 10 }, STORIES, null, false), true, 'the ferry’s 3 × 10 is read first (its own words): never timed');
});

test('the Taps that count log nothing: the five clutches, the four paws aboard, the roll call’s forepaws; nor do the one-tap pages, the asks or the picks; 21 typed answers on every path, 22 with Puddle', () => {
  for (const [flags, o, n] of [[{ worry: 'water' }, { peek: true }, 22], [{ worry: 'talk', foundPuddle: true }, {}, 21], [{ worry: 'small', ch3Told: false }, { peek: false }, 21], [Object.assign({ worry: 'shiny' }, ALL_SIX), {}, 21]]) {
    const cat = fresh(flags), n0 = cat.counts.length;
    const rows = read(cat, o);
    rows.forEach((x, i) => { if (['skip', 'scratch', 'ask', 'next', 'choice', 'pick'].includes(x.kind) && rows[i + 1]) assert.equal(rows[i + 1].counts, x.counts, x.id + ' logs nothing'); });
    assert.deepEqual(rows.filter(x => x.kind === 'skip').map(x => [x.skip.table, x.skip.groups]), [[7, 5]].concat(flags.worry === 'water' ? [[1, 4]] : [], [[5, 7]]));
    assert.equal(cat.counts.length - n0, n, JSON.stringify(flags) + ': typed answers');
  }
});

test('the Training Hollow after chapter 10: ten Counts, the 7s last (“Clutches of seven · the 7s”, `ch10-sevens`), Tallyheart says “sevens” and asks in clutches; the tenth mark only after the lesson', () => {
  assert.deepEqual(E.countSets(STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes'], [6, 'ch07-sixes'], [4, 'ch08-fours'], [8, 'ch09-eights'], [7, 'ch10-sevens']]);
  assert.deepEqual([E.countFor(7, STORIES).setId, E.countName(E.countFor(7, STORIES).def, 7)], ['ch10-sevens', 'Clutches of seven · the 7s']);
  assert.equal(E.countFor(8, STORIES).setId, 'ch09-eights', 'the warm-up teaches nothing new');
  assert.equal(E.countFor(2, STORIES).setId, 'ch02-ears', 'nor does the Moon Ferry');
  const cat = fresh();
  read(cat, {});
  assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3, 6, 4, 8, 7]);
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(x => x.name).slice(-2), ['Spiders’ legs · the 8s', 'Clutches of seven · the 7s']);
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, STORIES).opts.marks, 10);
  const def = E.hollowDef(STORIES, 7);
  assert.deepEqual([E.hollowRoundLine(def), E.hollowWord(def), def.teacher, def.thing], ['A round of sevens. Ready? Here we go.', 'sevens', 'tallyheart', 'dragonet']);
  const R = E.hollowStart(cat, STORIES, 1, 7), asked = [];
  for (let q; (q = E.counts.question(R.state));) {
    asked.push(pairKey(q.a + 'x' + q.b));
    const D = E.questionDef(R.def, q, story, STORIES), pic = E.lessonPicture(D, q, 0);
    assert.ok(pic.groups >= 1 && pic.groups <= 10 && pic.thing === 'dragonet', q.a + '×' + q.b + ': in clutches');
    assert.equal(E.promptLines(R.def, D, q).map(l => l.text).pop().replace(/^.*\. /, ''), 'How many dragonets?', q.a + '×' + q.b);
    E.counts.answer(R.state, R.def, q.answer, 2000, 1);
  }
  assert.deepEqual(asked.sort(), ['1x7', '2x7', '3x7', '4x7', '5x7', '6x7', '7x7', '7x8', '7x9', '7x10'].sort());
  const marks = c => E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, c, STORIES).opts.marks;
  const lesson = countsAt('ch10-sevens')[0];
  const c1 = fresh(); read(c1, { stop: lesson });
  assert.ok(c1.lessons['ch10-eights'] && !c1.lessons['ch10-sevens']);
  assert.ok(!E.hollowLines(c1, STORIES).counts.some(x => x.table === 7), 'no “Clutches of seven · the 7s” yet');
  assert.equal(marks(c1), 9);
  const c2 = fresh(); read(c2, { stop: SKRITCH });
  assert.equal(marks(c2), 10);
  assert.ok(10 <= E.MAX_MARKS);
});

/* ------------------------------------------------------------------ Puddle, chapter 5's page, her file */

test('Puddle under the raft: offered only to a cat who has never found him; “Sit tight.” sets nothing; his card given on his storm-night panel (chapter 5’s, in her file from then on), `foundPuddle` and `ch10Puddle` on his last screen; Back before it leaves nothing; chapter 5’s page leaves out a cat whose only Puddle is chapter 10’s, and reads as before for every other', () => {
  const met = reading({ worry: 'water', foundPuddle: false }, { peek: true });
  assert.ok(met.ids.includes('f031') && met.ids.includes(countsAt('ch05-puddle')[0]));
  assert.deepEqual([met.cat.flags.foundPuddle, met.cat.flags.ch10Puddle], [true, true]);
  assert.ok(met.cat.cards.some(c => c.id === 'puddle-paws' && c.chapter === 'ch10'), 'his card, recorded in chapter 10');
  assert.ok(rowAt(met.rows, 'f028').cards.some(c => c.id === 'puddle-paws'), 'shown on his storm-night panel');
  const sat = reading({ foundPuddle: false }, { peek: false });
  assert.ok(!sat.ids.includes('f023'));
  assert.deepEqual([sat.cat.flags.foundPuddle, sat.cat.flags.ch10Puddle], [false, undefined], '“Sit tight.” sets nothing');
  const known = reading({ foundPuddle: true }, {});
  assert.ok(!known.ids.includes(PEEK) && !known.ids.includes('f023'), 'a cat who knows him is never asked');
  // Back from his storm-night panel: the card stays (like a gift), the flags never set
  const back = fresh({ foundPuddle: false });
  read(back, { peek: true, stop: 'f029' });
  E.back(back, story); E.back(back, story);
  assert.deepEqual([back.flags.foundPuddle, back.flags.ch10Puddle], [false, undefined]);
  // chapter 5's page: neither of its two Puddle lines for a chapter-10-only Puddle; the truth table of the four flags
  const ANY5 = { not: { ch5Roof: false, foundPuddle: false, foundWisp: false } };
  const rec = ch05.book.recap;
  const pud = rec.find(r => /found Puddle|Puddle/.test(r.text) && r.when && 'foundPuddle' in r.when), fore = rec.find(r => /lit a forepaw for everyone found so far/.test(r.text));
  assert.deepEqual([pud.when, fore.when], [{ foundPuddle: true, ch10Puddle: false }, { not: { ch5Roof: false, foundWisp: false, not: { foundPuddle: true, ch10Puddle: false } } }]);
  for (const ch5Roof of [true, false]) for (const foundWisp of [true, false]) for (const [foundPuddle, ch10Puddle] of [[true, false], [false, false], [true, true]]) {
    const flags = { ch5Roof, foundWisp, foundPuddle, ch10Puddle };
    const live = !ch10Puddle;
    if (live) assert.equal(E.matches(fore.when, { flags }), E.matches(ANY5, { flags }), JSON.stringify(flags) + ': as before for every live save');
    else assert.equal(E.matches(fore.when, { flags }), ch5Roof || foundWisp, JSON.stringify(flags) + ': not for a chapter-10 Puddle alone');
    assert.equal(E.matches(pud.when, { flags }), foundPuddle && !ch10Puddle, JSON.stringify(flags));
  }
  const page5 = c => E.buildFullBook(c, STORIES).pages.find(p => p.id === 'ch05').recap.join(' ');
  assert.doesNotMatch(page5(met.cat), /Puddle/, 'chapter 5’s page leaves out his chapter-10 meeting');
  assert.match(E.buildFullBook(met.cat, STORIES).pages.find(p => p.id === 'ch10').recap.join(' '), /Under the Moon Ferry, Moonpaw found Puddle/, 'chapter 10’s page says it');
  // a cat holding chapter 5's puddle-paws record without foundPuddle keeps its chapter-5 place in her file
  const odd = before10({ foundPuddle: false });
  E.giveCard(odd, 'puddle-paws', 'ch05', 35);
  const order0 = odd.cards.map(c => c.id);
  E.startChapter(odd, story, 500);
  read(odd, { peek: true });
  assert.deepEqual(odd.cards.map(c => c.id), order0, 'the record keeps its place and chapter');
  assert.equal(odd.cards.find(c => c.id === 'puddle-paws').chapter, 'ch05');
  assert.ok(E.cards(odd, STORIES).some(c => c.id === 'puddle-paws'), 'shown now that she has found him');
});

/* ------------------------------------------------------------------ the book and the teaser */

function recapFor(flags) { return story.book.recap.filter(x => !x.when || E.matches(x.when, { flags })); }
const sentences = t => t.split(/(?<=[.!?])\s+(?=\p{Lu}|\{|“)/u).length;

test('book: title, chapter title, eight entries on every reading, one more with Puddle met here and one more with all seven, 8 to 10 sentences, true on each; the dream and the night it stayed a secret; no dragonet page', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['chapterTitle', 'dream', 'noDream', 'recap', 'title']);
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'The Gathering');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}paw’s dream, the night of the Gathering, stayed a secret.');
  b.recap.forEach((x, i) => {
    assert.deepEqual(Object.keys(x).filter(k => !['text', 'when'].includes(k)), [], 'recap ' + i);
    if (x.when) assert.ok(same(x.when, { ch10Puddle: true }) || same(x.when, ALL_SIX), 'recap ' + i + ': Puddle met here, or all seven');
    assert.match(x.text, /[.!?”’]$/);
    assert.ok(words(x.text) <= 32, 'recap ' + i + ': ' + words(x.text));
    assert.doesNotMatch(x.text, /\byou\b/i, 'third person');
  });
  const cases = [[{}, 'plain', 8], [{ ch10Puddle: true, foundPuddle: true }, 'Puddle', 9], [ALL_SIX, 'all seven', 9], [Object.assign({ ch10Puddle: true }, ALL_SIX), 'both', 10], [KEPT, 'kept', 8]];
  cases.forEach(([flags, name, n]) => {
    const rc = recapFor(flags);
    assert.equal(rc.length, n, name);
    const s = rc.reduce((m, x) => m + sentences(x.text), 0);
    assert.ok(s >= 6 && s <= 10, name + ': ' + s + ' sentences');
    const all = rc.map(x => x.text).join(' ');
    assert.equal(/found Puddle/.test(all), !!flags.ch10Puddle, name);
    assert.equal(/bowed low/.test(all), SIX.every(k => flags[k]), name);
    assert.match(all, /tenth Count, clutches of seven/, name);
    assert.match(all, /a mist stone/, name);
    assert.match(all, /belongs to CrystalClan/, name);
    assert.doesNotMatch(all, /\bthey\b/i, name);
  });
  // a she-cat's and a tom's pages through the engine
  const page = (cat, id) => E.buildFullBook(cat, STORIES).pages.find(p => p.id === id);
  const plain = reading({ specialty: 'sneaking' }, {}).cat;
  assert.equal(page(plain, 'ch10').heading, 'Chapter 10: The Gathering');
  assert.equal(page(plain, 'ch10').recap.length, 8);
  assert.match(page(plain, 'ch10').recap.join(' '), /Tallyheart taught Moonpaw her tenth Count, clutches of seven: the sevens\./);
  assert.equal(page(plain, 'ch10').dream, 'Moonpaw’s dream: “A mist stone in the moonlight.”');
  const tom = fresh({ specialty: 'sneaking' }); tom.look.sex = 'tom';
  read(tom, { dream: '' });
  assert.match(page(tom, 'ch10').recap.join(' '), /Tallyheart said his warrior name is coming, with this moon in it\./);
  assert.doesNotMatch(page(tom, 'ch10').recap.join(' '), /\{|\}/);
  assert.equal(page(tom, 'ch10').dream, 'Moonpaw’s dream, the night of the Gathering, stayed a secret.');
  assert.equal(story.book.dragonet, undefined, 'no dragonet page: Puddle’s is chapter 5’s');
  assert.equal(E.buildBook(ch09, plain).chapter, 'Chapter 9: Featherlight', 'the pages before are as they were');
});

test('the teaser is the Warrior Ceremony’s, with no number; chapter 9’s for this one stands, and its promises are kept', () => {
  assert.deepEqual(story.teaser, { title: 'The Warrior Ceremony', lines: ['Pass your Warrior Counts, and the Clan will gather for your name.'] });
  assert.doesNotMatch(story.teaser.lines.join(' '), /\d/);
  const cat = E.blankCat({}); cat.name = 'Moon';
  // (chapter 11: the Ceremony is in PC.story, the stub or built, so chapter 10's teaser leads to it)
  assert.deepEqual(E.teaser(story, cat, PC.story), { title: 'The Warrior Ceremony', lines: story.teaser.lines, built: true, next: 'ch11' }, 'the Ceremony is built: it is next');
  // chapter 9's teaser: this chapter's title, and every promise kept (the otters' Moon Ferry, every Clan at the Gathering,
  // Reynard with his little story, and our cat with her case)
  assert.equal(ch09.teaser.title, 'Chapter 10: The Gathering');
  assert.equal(E.chapterHeading(story), ch09.teaser.title);
  assert.deepEqual(E.teaser(ch09, cat, PC.story), { title: 'Chapter 10: The Gathering', lines: ch09.teaser.lines, built: true, next: 'ch10' });
  assert.match(T(F(/^At dusk, the whole Clan pads down to the Crossing/)), /The MOON FERRY!/);
  assert.match(T('f036'), /CrystalClan\./);
  assert.ok(pickIds.length === 5 && /little STORY/.test(T('f058')), 'Reynard with his little story, and her case, card by card');
});

test('finishing chapter 10 opens the Warrior Counts, through their own code: closed on the dream input, open on the end frame, the hub’s big button “The Warrior Counts · When you’re ready”, the Ceremony’s teaser under chapter 10’s page, the corner “open; not sat yet”; the Hollow offers ten Counts', () => {
  const W = UI.warrior;
  assert.ok(W && typeof W.hub === 'function' && typeof W.corner === 'function', 'ui.js’s Warrior Counts');
  const NOW = Date.UTC(2026, 10, 1, 16, 0, 0);
  const cat = fresh({ specialty: 'friends', worry: 'shiny' });
  const dream = ids.find(id => frames[id].input);
  read(cat, { stop: dream });
  assert.equal(E.frameId(cat, story), dream);
  const st0 = E.warriorState(cat, STORIES, NOW);
  assert.equal(st0.open, false, 'one frame before the end: closed');
  assert.equal(W.hub(st0, E.progress(cat, STORIES)), null);
  read(cat, {});
  assert.equal(E.frameId(cat, story), ids[ids.length - 1]);
  assert.ok(E.isFinished(cat, 'ch10'));
  const st = E.warriorState(cat, STORIES, NOW);
  assert.equal(st.open, true, 'on the end frame: open');
  const hub = W.hub(st, E.progress(cat, STORIES));
  assert.deepEqual([hub.big && hub.big.label, hub.big && hub.big.small, hub.hideSoon], ['The Warrior Counts', 'When you’re ready', true]);
  const teaser = E.buildFullBook(cat, STORIES).teaser;
  assert.deepEqual([teaser.title, teaser.lines], ['The Warrior Ceremony', ['Pass your Warrior Counts, and the Clan will gather for your name.']]);
  assert.equal(W.corner(cat, { open: st.open }).line, 'open; not sat yet');
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(x => x.table), [1, 2, 5, 10, 9, 3, 6, 4, 8, 7]);
  assert.equal(cat.warrior, undefined, 'chapter 10 calls nothing of the Warrior Counts');
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean and fill renders the same text; chapters 1 to 9 are sound beside it', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  assert.ok(E.checkStory(story).length > 0, 'chapter 10 leans on chapters 5 and 9 (Puddle’s riddle and card, the sets it borrows from)');
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind], cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
  STORIES.slice(0, 9).forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id));
});

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, the flags, the lessons, the picks, the taps, her cards, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) {
    const name = comboName(c);
    const cat = fresh(c.flags);
    const counted = cat.counts.length, flags0 = Object.assign({}, cat.flags);
    const rows = read(cat, c.o), walked = idsOf(rows);
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch10'), name);
    rows.forEach(x => { if (x.kind !== 'end') assert.ok(x.caps.length + x.say.length + (x.sfx ? 1 : 0) + (x.options ? x.options.length : 0) + (x.tap ? 1 : 0) + (x.pick ? 1 : 0) > 0, name + ' ' + x.id + ' shows nothing'); });
    const cards = {}; rows.filter(x => x.pick).forEach(x => { cards[frames[x.id].pick.flag] = x.picked; });
    assert.deepEqual(walked, walk(c.flags, Object.assign({}, c.o, { cards })).slice(), name + ': the engine walks the same frames');
    const added = PICK_FLAGS.concat(['ch10Best'], meetsPuddle(c) ? ['foundPuddle', 'ch10Puddle'] : []);
    assert.deepEqual(Object.keys(cat.flags).filter(k => cat.flags[k] !== flags0[k]).sort(), added.sort(), name + ': no other flag is set');
    const done = Object.keys(cat.lessons).filter(k => /^ch10/.test(k)).sort();
    assert.deepEqual(done, SETS.slice().sort(), name);
    done.forEach(s => assert.ok(cat.lessons[s].finished && cat.lessons[s].noHelp, name + ': ' + s));
    assert.equal(cat.counts.length - counted, 21 + (meetsPuddle(c) ? 1 : 0), name + ': the typed answers; the taps never logged');
    assert.equal(cat.dreams.ch10, 'a mist stone in the moonlight');
    assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3, 6, 4, 8, 7]);
    assert.equal(E.status(cat, STORIES), 'Chapter 10 finished');
    // (a cat who completes the seven with Puddle here earns the eldest's bow too: ten)
    assert.equal(E.buildBook(story, cat).recap.length, 8 + (meetsPuddle(c) ? 1 : 0) + (SIX.every(k => cat.flags[k]) ? 1 : 0), name);
    assert.doesNotMatch(E.buildBook(story, cat).recap.join(' ') + E.buildBook(story, cat).dream, /[{}]/, name + ': the book, every token filled');
    assert.deepEqual(E.nestGroups(cat).gifts.map(x => x.treasure.id).filter(x => x === 'mist-stone'), ['mist-stone'], name + ': the mist stone in My nest, a gift');
    rows.forEach(x => x.say.forEach(bl => assert.ok(bl.label && !/[{}]/.test(bl.label + bl.text), name + ' ' + x.id + ': ' + bl.label + ': ' + bl.text)));
    rows.forEach(x => assert.ok(!x.heard.some(h => /[{}]/.test(h)), name + ' ' + x.id));
    rows.filter(x => x.scene && x.scene.set === 'den' && frames[x.id].scene.opts.stone).forEach(x => assert.equal(x.scene.opts.stone, c.flags.ch2Stone, x.id));
    assert.ok(E.back(cat, story));
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 70);
  // with a miss on everything she still reaches the end, every retry and filler is asked, every pick wrong three
  // times first (the nudges, then the glow), and every speaker of a lesson's line is in that Counts frame's picture
  for (const ch3Told of [true, false]) {
    const cat = fresh({ specialty: 'noticing', ch3Told, worry: 'water', foundPuddle: false });
    const rows = read(cat, { peek: true, wrongPicks: 3, answers: { '8x8': [60], '2x8': [15], '6x7': [40], '7x7': [48, 48], '9x7': [60], '4x10': [30], '9x4': [35], '10x6': [50], '6x8': [47] } });
    assert.equal(rows[rows.length - 1].kind, 'end');
    rows.filter(x => x.pick).forEach(x => {
      const pk = frames[x.id].pick;
      assert.equal(x.pick.nudges.length, 3, x.id);
      assert.ok(x.pick.nudges[0] === pk.nudges[0] || Object.values(pk.own || {}).includes(x.pick.nudges[0]), x.id + ': ' + x.pick.nudges[0]);
      assert.deepEqual(x.pick.nudges.slice(1).filter(l => !Object.values(pk.own || {}).includes(l)), x.pick.nudges.slice(1).filter(l => l === pk.nudges[1]), x.id);
      assert.deepEqual(x.pick.glow, x.pick.right, x.id + ': the right cards she holds glow, in her file’s order');
    });
    const w = readWords(rows);
    ['Tallyheart: One from the spiders. Three spiders. How many legs?', WAY49 + ' There. We’ll come back to that one.', 'Tallyheart: Here’s that one again. Seven sevens!', 'Tallyheart: An easy one. One night. How many fish?']
      .forEach(line => assert.ok(w.includes(line), line));
    Object.keys(cat.lessons).filter(k => /^ch10/.test(k)).forEach(s => assert.equal(cat.lessons[s].noHelp, false, s + ': she needed help in every one'));
    rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.concat(l.balloons).filter(y => y.who).forEach(y => assert.ok(castOf(x.id, y.who).length, x.id + ' ' + l.k + ': ' + y.who))));
    assert.deepEqual(rowAt(rows, TENTH).say.map(b => b.text), ['Clutches of seven. That’s your tenth Count. Every Count a warrior needs.', 'Some were tricky.', 'And you kept going. That’s the whole secret.']);
  }
  // a clean reading hears Tallyheart's highest praise at the tenth mark
  const clean = reading({ specialty: 'climbing' }, {});
  assert.deepEqual(rowAt(clean.rows, TENTH).say.map(b => b.text), ['Clutches of seven. That’s your tenth Count. Every Count a warrior needs. Not one miss. Not even the new one.']);
  // a save in the middle of the island goes through the store's own shape and comes back the same cat
  const mid = fresh({ specialty: 'climbing', ch3Told: false });
  read(mid, { stop: 'f063' });
  const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
  assert.deepEqual([back.flags, back.cards, back.frame, back.lessons], [mid.flags, mid.cards, mid.frame, mid.lessons]);
  assert.deepEqual(idsOf(read(back, {})), idsOf(read(mid, {})), 'and reads on to the same end');
});

test('the golden’s fifteen cats, each at the end of chapter 9 as tests/fixtures/make-ch09-golden.js reads it, read chapter 10 to its end: their own warm-ups, their own files at the picks, the Warrior Counts open after', () => {
  const cats = golden();
  assert.equal(cats.length, 15);
  cats.forEach((cat, i) => {
    const name = cat.scriptName.slice(0, 60);
    assert.ok(E.isFinished(cat, 'ch09') && !E.isFinished(cat, 'ch10'), name);
    E.startChapter(cat, story, 5000);
    const n0 = cat.counts.length;
    const rows = read(cat, { peek: i % 2 === 0, best: BEST[i % 4], pickCard: (id, right) => right[i % right.length], t: 6000 });
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    const warm = rowAt(rows, countsAt('ch10-eights')[0]).lesson;
    assert.ok(['8x8', '8x3', '3x8', '8x5', '5x8', '8x10', '10x8', '7x8'].includes(warm[0].k.replace('✗', '')), name + ': the warm-up opens on ' + warm[0].k);
    assert.equal(cat.counts.length - n0, 21 + (rows.some(x => x.id === countsAt('ch05-puddle')[0]) ? 1 : 0), name);
    assert.equal(E.warriorState(cat, STORIES, 2e12).open, true, name);
    rows.filter(x => x.pick).forEach(x => assert.ok(x.pick.right.length >= 2, name + ' ' + x.id));
  });
});

// (the polish release v23) On the banishment's wide panels Granny stood at the set's `bank`, in front of the fox: only his
// ears showed over her while the story says he gets smaller. At the water's edge a step behind him and to his right he
// shows whole, and Snip in front of her; she is still in the picture to give her border (f083), her face in the panel.
test('staging, the polish release v23: Granny by the water on f082 to f084, the fox whole in front of her (at `bank` she stood in front of him)', () => {
  const cat = catFor({});
  ['f082', 'f083', 'f084'].forEach(id => {
    const sc = E.resolveScene(frames[id].scene, cat, STORIES), r = A.render(sc, { look: cat.look });
    const head = (w) => r.heads[sc.cast.findIndex(c => c.who === w)];
    const gr = head('otter'), fox = head('reynard'), snip = head('snip');
    assert.deepEqual(castOf(id, 'otter').map(c => [c.at, c.holds, c.variant]), [[{ x: 1545, y: 690, h: 230 }, 'pole', 3]], id);
    // her face to the right of his and of Snip's, clear of both (in panel percent, x across 100, y down 100)
    assert.ok(gr.x - gr.r > fox.x + fox.r, id + ': the fox’s face clear of hers: ' + JSON.stringify([fox, gr]));
    assert.ok(Math.hypot(gr.x - snip.x, (gr.y - snip.y) * 0.625) > gr.r + snip.r, id + ': Snip’s too: ' + JSON.stringify([snip, gr]));
    // drawn behind the fox (listed before him) and Snip, as far back as she stands
    assert.ok(sc.cast.findIndex(c => c.who === 'otter') < sc.cast.findIndex(c => c.who === 'reynard'), id + ': behind the fox');
    assert.ok(gr.x + gr.r < 100 && gr.y > 0, id + ': her face in the panel: ' + JSON.stringify(gr));
  });
});
