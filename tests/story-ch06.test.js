/* Story tests for chapter 6: node --test
 *
 * Checks app/story/ch06.js against the frame contract in docs/build.md, against the story
 * (docs/chapters/06-the-snake-in-the-stones.md, Draft v0.4) and against its spec
 * (docs/chapters/06-the-snake-in-the-stones.spec.md, v0.2, the build's contract): the frame graph
 * (frames shown only `when` they match, the told and kept paths' twin panels, the optional scene at
 * the last post), one interaction per frame, the choices (none sets a flag) and the one sticky flag,
 * `foundSleet`; the Counts frames and sets exactly as the spec has them, with every test its build
 * notes list (the warm-up's hard pick, the lesson's misses and the check, the borrowing rule); the
 * skip-counts, Tallyheart's five Counts, the pages she taps once; her three cards and the link; every
 * `when`; the speakers' labels (A voice, the snake and Coil; the long grass, the silver-white dragon and
 * Sleet; the starry cat; ReedClan by coat); tokens, storyboards, word counts, the art vocabulary, the
 * staging, the time of day, the generated storyboard, every frame rendered with everyone in the
 * picture, the beats in order on every path, the book (Sleet's page only for a cat who found him), the
 * teaser for chapter 7, and whole play-throughs through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch06.test.js   prints the whole chapter, rendered three ways.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
require('../app/ui.js');   // its pure parts: the speakers' labels, the taps' hit test
const E = PC.engine;
const A = PC.art;
const story = PC.story.ch06;
const frames = story.frames;
const ids = Object.keys(frames);
const ch04 = PC.story.ch04, ch05 = PC.story.ch05;
const STORIES = [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05, story];

/* ------------------------------------------------------------------ the contract */

// The flags a `when` may test: chapters 1 to 5's, and chapter 6's own one (set by reaching a frame,
// never by a choice, and never unset). No choice of this chapter sets anything.
const FLAGS1 = {
  stepOut: ['chase', 'slow'],
  spokeUp: [true, false],
  joinReason: ['learn', 'count', 'brave'],
  specialty: ['noticing', 'sneaking', 'climbing', 'swimming', 'friends'],
  worry: ['small', 'water', 'talk', 'shiny']
};
const FLAGS2 = { ch2SaidAloud: [true, false], ch2Path: ['bridge', 'river'], ch2Stone: ['nose', 'chin'] };
const FLAGS3 = { ch3Told: [true, false] };
const FLAGS4 = { foundSquall: [true, false], ch4CaughtFly: [true, false] };
const FLAGS5 = { ch5First: ['otters', 'heron'], ch5Roof: [true, false], foundPuddle: [true, false], foundWisp: [true, false] };
const FLAGS6 = { foundSleet: [true, false] };
const FLAGS = Object.assign({}, FLAGS1, FLAGS2, FLAGS3, FLAGS4, FLAGS5, FLAGS6, { lessonClean: ['ch06-threes'] });
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'sfxAt', 'sfxRead', 'gift', 'when', 'else', 'sets', 'card'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things', 'also']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
// Time of day comes from fx: morning at the pile and in the Hollow, day from the patrol to the bridge,
// sunset at the pile, dusk for the first watch's start, night for the watch, the den and the dream.
const TOD = ['morning', 'day', 'sunset', 'dusk', 'night'];
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat', 'sloshbank', 'reedclan'];
const BEASTS = ['riffle', 'otter', 'dog', 'sprinkle', 'reynard', 'squall', 'puddle', 'wisp', 'coil', 'sleet'];
const RIM_ANCHORS = ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'];
const CARD_IDS = ['reed-pile', 'sleet-den', 'coil-diggers'];
const SETS = ['ch06-pile', 'ch06-nines', 'ch06-four', 'ch06-threes', 'ch06-watchers', 'ch06-sleet', 'ch06-guards'];
// the one Counts frame whose own lines are not said again over the first question (`intro: false`)
const NO_INTRO = ['ch06-nines'];
const TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
// the patrol's spots along the top of the Hollow, on the far bank above the sitters' heads (after the final
// review: on the rim's far edge, at the sitters' own height, the three read as part of one clump of eight),
// and from “More patrols” the second patrol's, stopped on the path at the left
const PATROL = [{ x: 570, y: 580, h: 170, z: 'behind' }, { x: 710, y: 580, h: 170, z: 'behind' }, { x: 850, y: 580, h: 170, z: 'behind' }];
const PATROL2 = [{ x: 65, y: 580, h: 170, z: 'behind' }, { x: 190, y: 580, h: 170, z: 'behind' }, { x: 315, y: 580, h: 170, z: 'behind' }];

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
/* The frames that say this, in reading order; F: the one frame that does; F2: the twins that do (a
 * panel drawn once for the told path, with Tallyheart in it, and once for the kept path). */
function FF(re) { return ids.filter(id => re.test(T(id))); }
function F(re) {
  const hit = FF(re);
  assert.equal(hit.length, 1, 'exactly one frame says ' + re + ' (' + hit.join(' ') + ')');
  return hit[0];
}
function F2(re) {
  const hit = FF(re);
  assert.equal(hit.length, 2, 'two frames say ' + re + ', one for each path (' + hit.join(' ') + ')');
  return hit;
}

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A snake with no eyelids played the stones.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'Three, six, nine, twelve.' },
  // a player whose own Clan name is Murmur: the new warrior is Mutterchime
  murmur: { name: 'Murmur', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Guards, three by three.' }
};
const FACT = { a: 8, b: 3, answer: 24, groups: 8, per: 3, thing: 'cat', things: 'cats', also: '' };
function fill(text, p) { return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : k in FACT ? FACT[k] : m)); }

/* Anything that reads badly once the tokens are filled (the chapter 1 rules). */
function badGrammar(text, isSfx) {
  const bad = [];
  if (/[{}]/.test(text)) bad.push('unfilled token');
  if (/\b(she|he) (are|were|have|do|don’t|aren’t|weren’t|haven’t)\b/i.test(text)) bad.push('pronoun/verb agreement');
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

/* Every line in the chapter: frames (every variant), options, the instructions under the pages she
 * taps, Tallyheart's five Counts and our cat's answers, her cards, the Counts lines, the book, the teaser. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast', 'fastAfterMiss', 'again', 'remembered', 'rememberedSlow'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l, ok: FACT_TOKENS })));
    ['miss', 'missLast', 'helpIntro', 'helpIntroFar', 'helpIntroNotFive', 'helpIntroNotTen', 'helpIntroTens', 'helpIntroOneTuck', 'helpIntroNotNine', 'againIntro', 'done', 'fillIntro'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: FACT_TOKENS }); });
    ['firstPrompt', 'prompt'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: PROMPT_TOKENS }); });
    (d.facts || []).forEach((f, i) => {
      if (Array.isArray(f)) return;
      [].concat(f.prompt || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' prompt ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
      if (typeof f.retryPrompt === 'string') out.push({ set: sid, where: 'fact ' + i + ' retryPrompt', text: f.retryPrompt, ok: PROMPT_TOKENS });
      [].concat(f.right || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' right ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
      [].concat(Array.isArray(f.rightAgain) ? f.rightAgain : []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' rightAgain ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
      ['miss', 'missLast'].forEach(k => { if (f[k]) out.push({ set: sid, where: 'fact ' + i + ' ' + k, text: f[k], ok: PROMPT_TOKENS }); });
    });
  });
  return out;
}
function everyText(fn) {
  ids.forEach(id => texts(frames[id]).forEach(x => fn(id, x)));
  ids.forEach(id => {
    const f = frames[id];
    if (f.choice) {
      f.choice.options.forEach((o, i) => {
        fn(id, { where: 'option ' + i, text: o.label });
        (o.labelWhen || []).forEach((v, j) => fn(id, { where: 'option ' + i + ' labelWhen ' + j, text: v.label }));
      });
      if (f.choice.prompt) fn(id, { where: 'choice prompt', text: f.choice.prompt });
    }
    if (f.skip && f.skip.prompt) fn(id, { where: 'skip prompt', text: f.skip.prompt });
    if (f.scratch || f.file) fn(id, { where: 'tap prompt', text: E.tapWords(f).prompt });
    if (f.scratch && f.scratch.miss) fn(id, { where: 'tap miss', text: f.scratch.miss, sfx: true });
    if (f.ask) {
      fn(id, { where: 'ask prompt', text: E.askWords(f.ask).prompt });
      f.ask.pairs.forEach((p, i) => { fn(id, { where: 'question ' + i, text: p[0], who: f.ask.who }); fn(id, { where: 'answer ' + i, text: p[1], who: f.ask.to }); });
    }
  });
  Object.keys(story.cards).forEach(cid => {
    fn('card ' + cid, { where: 'line', text: story.cards[cid].line });
    if (story.cards[cid].link) fn('card ' + cid, { where: 'link line', text: story.cards[cid].link.line });
  });
  countsLines().forEach(x => fn('counts ' + x.set, x));
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  ['title', 'chapterTitle', 'dream', 'noDream'].forEach(k => { if (story.book[k]) fn('book', { where: k, text: story.book[k] }); });
  story.book.dragonet.forEach(dn => dn.lines.forEach((l, i) => fn('book', { where: dn.id + ' line ' + i, text: l })));
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* The choices: the fox trail routes her day; the fair question adds Tallyheart's nudge for a cat who
 * asks it unfairly first; the other three are light (their pick changes a panel or none). */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const TRAIL = choiceAt(/^Follow the fox trail to the last post\.$/)[0];
const FAIR = choiceAt(/^“Did ReedClan take our prey\?”$/)[0];
const MARCH = choiceAt(/^Lead the way!$/)[0];
const QUESTION = choiceAt(/^“Would you tell the FOX\?”$/)[0];
const STARRY = choiceAt(/^“Who are you\?”$/)[0];
/* The option a reader takes at a choice. `o`: `sleet` (follows the fox trail), `unfair` (asks “Did
 * ReedClan take our prey?” first), `light` (0 or 1: every light choice's option). */
function pick(id, o) {
  if (id === TRAIL) return o.sleet ? 0 : 1;
  if (id === FAIR) return o.unfair ? 0 : 1;
  return o.light || 0;
}
/* The frames a reader with these flags walks through, in order (the engine's own E.landing passes
 * over a frame whose `when` doesn't match); a frame's `sets` are flags from then on. `clean`: she needed
 * no help in the threes. The flags as they ended are on the result (`.flags`). */
function catFor(flags, o) {
  return { flags: Object.assign({}, flags), look: { sex: 'she' }, lessons: (o || {}).clean === false ? {} : { 'ch06-threes': { finished: true, noHelp: true } } };
}
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
      const opt = f.choice.options[pick(id, o)];
      Object.assign(cat.flags, opt.sets || {});
      id = opt.next;
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
    const row = { id, kind: E.kindOf(f), lines: E.captions(f, cat).concat(E.balloons(f, cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []) };
    if (f.choice) { row.options = E.options(f, cat).map(x => E.optionLabel(x.option, cat)); Object.assign(cat.flags, f.choice.options[pick(id, o)].sets || {}); }
    if (f.sets) Object.assign(cat.flags, f.sets);
    return row;
  });
}
/* Every combination of told or kept, the specialty, the worry, the dragonets she found in chapters 4 and
 * 5 (squall, puddle, wisp: eight ways), Sleet met on an earlier reading or not, the fox trail followed or
 * not, and the fair question asked fair or not: 2,560. */
const FOUND = [];
for (const foundSquall of [false, true]) for (const foundPuddle of [false, true]) for (const foundWisp of [false, true]) FOUND.push({ foundSquall, foundPuddle, foundWisp });
const COMBOS = [];
for (const ch3Told of FLAGS3.ch3Told) for (const specialty of FLAGS1.specialty) for (const worry of FLAGS1.worry) for (const found of FOUND) {
  for (const before of [false, true]) for (const sleet of [false, true]) for (const unfair of [false, true]) {
    const flags = Object.assign({ ch3Told, specialty, worry, ch2Stone: 'nose', ch2Path: 'bridge' }, found);
    if (before) flags.foundSleet = true;
    COMBOS.push({ flags, before, o: { sleet, unfair } });
  }
}
const comboName = c => JSON.stringify(c.flags) + ' ' + JSON.stringify(c.o);
const metSleet = c => c.before || c.o.sleet;
// a spread of the combinations for the heavier checks: every cat on some route, every route for some cats
const SOME = COMBOS.filter((c, i) => i % 7 === 0);

/* The blocks: “The last post” (following the trail) and “Not today” (the told and kept twins). */
const branch = (first, letter) => { const out = []; for (let id = first; new RegExp(letter + '$').test(id); id = exits(frames[id])[0]) out.push(id); return out; };
const SLEET = branch(frames[TRAIL].choice.options[0].next, 'a');
const NOT = branch(frames[TRAIL].choice.options[1].next, 'b');
const BRIDGE = exits(frames[SLEET[SLEET.length - 1]])[0];
const UNFAIR = branch(frames[FAIR].choice.options[0].next, 'a');
const ADMIT = frames[FAIR].choice.options[1].next;

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch06');
  assert.equal(story.number, 6);
  assert.equal(story.title, 'The Snake in the Stones');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.ok(ids.length >= 130, 'a full chapter of panels (' + ids.length + ')');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'names', 'number', 'start', 'teaser', 'title']);
  // the two she meets today, until each is named (the spec's section 5)
  assert.deepEqual(story.names, { coil: 'The snake', sleet: 'The silver-white dragon' });
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch06'), order.indexOf('ch05') + 1, 'chapter 6 follows chapter 5');
  assert.ok(Object.values(frames).every(f => !/^STUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 2560);
  // the page loads it after chapter 5, and the offline copy has it
  const scripts = require('./_load.js').scripts().filter(s => /story\/ch\d+\.js$/.test(s));
  assert.ok(scripts.indexOf('app/story/ch05.js') >= 0 && scripts.indexOf('app/story/ch05.js') < scripts.indexOf('app/story/ch06.js'));
  assert.match(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), /'\.\/app\/story\/ch06\.js'/);
});

test('frame ids run f001, f002… in reading order; every edge goes forward; the numbers have no gaps; the letters say which branch', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}[ab]?$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  const nums = [...new Set(ids.map(id => +id.slice(1, 4)))].sort((a, b) => a - b);
  nums.forEach((n, i) => assert.equal(n, i + 1, 'frame number ' + (i + 1) + ' is missing'));
  // a lettered frame is a branch: a choice leads into it, or the frame before it in its own branch
  const into = {};
  ids.forEach(id => exits(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  const lettered = ids.filter(id => /[a-z]$/.test(id));
  lettered.forEach(id => {
    const from = into[id] || [];
    assert.ok(from.length && from.every(p => frames[p].choice || /[a-z]$/.test(p)), id + ' is reached from a choice or from a branch (' + from.join(' ') + ')');
  });
  // the fox trail: following it is `a` (“The last post”, twenty frames, the twins by path among them), “Not
  // today” is `b` (one panel, by path); both meet under the Old Bridge, at a plain number
  assert.deepEqual(frames[TRAIL].choice.options.map(o => o.next), [SLEET[0], NOT[0]]);
  assert.equal(SLEET.length, 20);
  assert.ok(SLEET.every(id => /a$/.test(id)) && NOT.every(id => /b$/.test(id)));
  assert.deepEqual(NOT.map(id => frames[id].when), [TOLD, KEPT]);
  assert.equal(exits(frames[NOT[1]])[0], BRIDGE);
  assert.match(BRIDGE, /^f\d{3}$/);
  assert.equal(SLEET[0].slice(1, 4), NOT[0].slice(1, 4), 'side by side under the same number');
  assert.match(T(BRIDGE), /^Under the Old Bridge, two big eyes peek over Tallyheart’s branch\.$/);
  // the fair question: asked unfairly first is `a` (two panels: Tallyheart's nudge, then the fair one);
  // asked fair it goes straight on to the admission, at a plain number
  assert.deepEqual(UNFAIR.length, 2);
  assert.equal(exits(frames[UNFAIR[1]])[0], ADMIT);
  assert.match(ADMIT, /^f\d{3}$/);
  assert.match(T(ADMIT), /^Sloshbank is quiet for a long time\./);
  // the two light choices with a panel for each answer: `a` and `b` at the next number, rejoining at once
  [MARCH, STARRY].forEach(id => {
    const opts = frames[id].choice.options;
    opts.forEach(o => {
      assert.equal(o.next.slice(1, 4), String(+id.slice(1, 4) + 1).padStart(3, '0'), id + ': the outcome is the next number');
      assert.equal(E.kindOf(frames[o.next]), 'next', id + ': an outcome is one panel');
    });
    assert.deepEqual(opts.map(o => o.next.slice(-1)), ['a', 'b']);
    assert.equal(frames[opts[0].next].next, frames[opts[1].next].next, id + ': a light choice rejoins at once');
  });
  // Coil's question: one answer does for both options, and no outcome panel
  assert.deepEqual(frames[QUESTION].choice.options.map(o => o.next), ['f101', 'f101']);
  assert.equal(+frames[QUESTION].choice.options[0].next.slice(1, 4), +QUESTION.slice(1, 4) + 1);
  // every lettered frame is accounted for
  assert.deepEqual(lettered.sort(), [].concat(SLEET, NOT, UNFAIR, frames[MARCH].choice.options.map(o => o.next), frames[STARRY].choice.options.map(o => o.next)).sort());
});

// The frames shown only `when` they match, in reading order (each with its `when` and its kind): the
// told and kept twins of a panel whose picture would show one of Tallyheart's spots, the told path's own
// two screens under the bridge and the kept path's own one, and Sleet's news under the bridge, for a cat
// who has met him or not. One after the other, so whichever is not hers is passed over; none says `else`.
const WHEN_FRAMES = [
  [/^Off she runs\. Then Tallyheart winks at you\./, TOLD],
  [/^Off she runs\. And you, \{name\}paw: back by sunset\./, KEPT],
  [/^Your nose twitches\..* Tallyheart sniffs\. Old\.$/, TOLD],
  [/^Your nose twitches\. A fox smell, an old one, drifts along the fence from the last post\.$/, KEPT],
  [/Past it, the long grass of fox country whispers\. Not one paw past the post\.$/, TOLD],
  [/^Fish don’t wait\. They get SMELLY\. HMPH!$/, TOLD],
  [/Past it, the long grass of fox country whispers\. Not one paw past the post\.$/, KEPT],
  [/^Fish don’t wait\. They get SMELLY\. HMPH!$/, KEPT],
  [/^He whispers, very loudly: I’m spying on the ENEMY\./, TOLD],
  [/^He whispers, very loudly: I’m spying on the ENEMY\./, KEPT],
  [/^I’m Sleet\. The eldest\. I do the roll call\.$/, TOLD],
  [/^I’m Sleet\. The eldest\. I do the roll call\.$/, KEPT],
  [/^Sprinkle’s safe\. Under the Old Bridge\./, TOLD],
  [/^Sprinkle’s safe\. Under the Old Bridge\./, KEPT],
  [/^I KNEW it\. I’m a very good eldest\. The eldest\. And the bossiest\.$/, TOLD],
  [/^I KNEW it\. I’m a very good eldest\.$/, KEPT],
  [/^Come with us\?/, TOLD],
  [/^Come with us\?/, KEPT],
  [/^Under the Old Bridge, two big eyes peek over Tallyheart’s branch\.$/, TOLD],
  [/^At the Old Bridge, you check the bank first\. No ginger ears\./, KEPT],
  [/^Sleet says: five\. And he’s in charge\. He ALWAYS says that\.$/, { foundSleet: true }],
  [/^I saw a silver-white tail! My eldest brother LOVES long grass\.$/, { foundSleet: false }],
  [/^Do forgive me for not getting up\./, TOLD],
  [/^Do forgive me for not getting up\./, KEPT],
  [/^Light paws\. And hopping paws\.$/, TOLD],
  [/^Light paws\. And hopping paws\.$/, KEPT],
  [/^Riffle stops hopping\. And the ginger one\./, TOLD],
  [/^Not one paw under the Old Bridge\. I made that rule because of YOU\./, TOLD],
  [/^Riffle stops hopping\. Your ginger mentor made a rule because of me\./, KEPT],
  [/^Patience said to ask you\./, TOLD],
  [/^Patience said to ask you\./, KEPT],
  [/^Everybody looks at Riffle\./, TOLD],
  [/^Everybody looks at Riffle\./, KEPT],
  [/^Diggers\? WHO\? I feel feet\. Not faces\. A snake’s secret\. A thing to check\.$/, TOLD],
  [/^Diggers\? WHO\? I feel feet\. Not faces\.$/, KEPT],
  [/^Never\. Not to anybody\./, TOLD],
  [/^Never\. Not to anybody\./, KEPT],
  [/^On the bank, he bursts\./, TOLD],
  [/^On the bank, he bursts\./, KEPT]
];

test('exactly one interaction per frame (the taps and the questions included), no unknown keys, and a frame `when` or `sets` only where the story and the spec have one', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    // the drips are Sloshbank's: lettered by his belly on every panel where they fall; and the chapter's first
    // snore over the old tom, above his head (left of the panel, clear of the caption and the pinecone): the page
    // would letter it top right, over Tallyheart. Nowhere else does a frame say where its sound goes
    assert.deepEqual(f.sfxAt, /^Drip\./.test(f.sfx || '') ? [67, 90] : id === story.start ? [24, 60] : undefined, id + ': sfxAt');
    if (id === story.start) {
      const old = castOf(id, 'grizzled')[0], head = PC.art.render(f.scene, {}).heads[f.scene.cast.indexOf(old)];
      assert.ok(Math.abs(f.sfxAt[0] - head.x) < 15 && f.sfxAt[1] < head.y - 10, id + ': over his head: ' + JSON.stringify(head));
    }
    if (/^Drip\./.test(f.sfx || '')) assert.ok(camOf(id) === 'title/meet' && castOf(id, 'sloshbank').length === 1, id + ': he is in the picture, at cat height');
    assert.equal(f.look, undefined, id + ': chapter 6 has no look frame');
    assert.equal(f.gift, undefined, id + ': chapter 6 gives no gift');
    assert.equal(f.file, undefined, id + ': her Case File was opened in chapter 4');
    assert.equal(f.else, undefined, id + ': nothing here needs an else: every frame shown only when it matches has one way on');
  });
  const whens = ids.filter(id => frames[id].when);
  assert.deepEqual(whens.map(id => frames[id].when), WHEN_FRAMES.map(w => w[1]));
  whens.forEach((id, i) => {
    assert.match(T(id), WHEN_FRAMES[i][0], id);
    assert.notEqual(id, story.start);
    const keys = w => Object.keys(w).forEach(k => { if (k === 'not') keys(w.not); else assert.ok(FLAGS[k], id + ': when ' + k); });
    keys(frames[id].when);
    assert.equal(exits(frames[id]).length, 1, id + ': one way on');
    assert.ok(['next', 'counts', 'skip'].includes(E.kindOf(frames[id])) && E.kindOf(frames[id]) === 'next', id + ': a page she reads and turns');
  });
  // the told and kept twins stand one after the other, the told first: whichever is not hers is passed over
  // (the told path's own two screens under the bridge come before the kept path's one, f084 f085 f086)
  const told = whens.filter(id => same(frames[id].when, TOLD)), kept = whens.filter(id => same(frames[id].when, KEPT));
  assert.equal(told.length, kept.length + 1, 'every told panel has its kept twin, but for the told path’s own two under the bridge and the kept path’s one');
  told.forEach(id => {
    const k = exits(frames[id])[0];
    if (id === 'f084') return assert.equal(k, 'f085');
    assert.ok(same(frames[k].when, KEPT), id + ' → its kept twin ' + k);
    assert.equal(+k.slice(1, 4) - +id.slice(1, 4), 1, id + ' and ' + k + ': side by side');
  });
  // the one flag set by reaching a frame, for good: Sleet's, on the last frame of “The last post”, his forepaw Tap
  const sets = ids.filter(id => frames[id].sets);
  assert.deepEqual(sets, [SLEET[SLEET.length - 1]]);
  assert.deepEqual(frames[sets[0]].sets, { foundSleet: true });
  assert.ok(frames[sets[0]].skip && frames[sets[0]].skip.groups === 1 && frames[sets[0]].skip.carry === false, 'a scene’s last frame, with its forepaw Tap');
  // no choice sets anything (the spec: one new flag, no new choice flag)
  ids.filter(id => frames[id].choice).forEach(id => frames[id].choice.options.forEach(o => assert.deepEqual(o.sets, {}, id)));
});

test('a child who listens hears every sentence finished: the one caption that runs on into its sound effect (her nest’s skritch) has the sound in words for Read to me; no other page is heard differently, and no page is lettered differently', () => {
  const NEST = F(/^In your nest:/);
  assert.deepEqual(ids.filter(id => frames[id].sfxRead !== undefined), [NEST]);
  const some = [{ flags: { ch2Stone: 'nose' } }, { flags: { ch2Stone: 'chin', ch3Told: false, specialty: 'noticing', worry: 'small', foundSleet: true } }, { flags: { ch3Told: true, worry: 'shiny' } }];
  ids.forEach(id => {
    const f = frames[id];
    const runsOn = (f.caption || []).map(capText).filter(t => !E.endsSentence(t));
    if (f.sfx && runsOn.length) assert.equal(f.sfxRead, 'skritch, skritch.', id + ': “' + runsOn[0] + '” runs on into ' + f.sfx);
    if (f.sfxRead === undefined) some.forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), id + ': heard as it is lettered'));
  });
  assert.equal(frames[NEST].sfx, 'skritch, skritch.');
  assert.deepEqual(E.captionsRead(frames[NEST], some[0]), ['In your nest:', 'skritch, skritch.', 'Today’s bark goes along the mossy edge.', 'Riffle’s stone is by your nose.']);
  assert.deepEqual(E.captions(frames[NEST], some[1]), ['In your nest:', 'Today’s bark goes along the mossy edge.', 'Riffle’s stone is under your chin.']);
  assert.deepEqual(badGrammar(frames[NEST].sfxRead, true), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
});

test('every next / option / input / counts / skip / scratch / ask target exists, and every frame is reachable, by its exits and by some reader', () => {
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const byExit = new Set([story.start]), line = [story.start];
  while (line.length) exits(frames[line.pop()]).forEach(n => { if (!byExit.has(n)) { byExit.add(n); line.push(n); } });
  assert.deepEqual(ids.filter(id => !byExit.has(id)), [], 'unreachable frames');
  const walked = new Set();
  for (const c of COMBOS) for (const light of [0, 1]) walk(c.flags, Object.assign({ light }, c.o)).forEach(id => walked.add(id));
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

test('every combination reaches the end with no frame that shows nothing; Tallyheart is with her from the border to the bank only on the told path', () => {
  const her = id => castOf(id, 'tallyheart').length > 0 || (frames[id].say || []).some(b => b.who === 'tallyheart');
  const way = F(/^On the way home, Tallyheart stops\./), sunset = F(/^At sunset, the whole Clan sits round the prey pile\./);
  for (const c of COMBOS) for (const light of [0, 1]) {
    const name = comboName(c) + ' light ' + light, rows = walkLines(c.flags, Object.assign({ light }, c.o));
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    rows.forEach(r => {
      if (r.kind !== 'end') assert.ok(r.lines.length > 0, r.id + ' shows no text to ' + name);
      if (r.options) assert.equal(r.options.length, 2, r.id + ': two options');
    });
    // from the frame after Murmurchime runs off to the bank, Tallyheart is in no panel of the kept path;
    // on the told path she is in every panel whose camera shows her spot (the border, the last post's
    // `border-two`, the bridge's `back`, the bank)
    const p = rows.map(r => r.id), from = p.indexOf(way) + 1, to = p.indexOf(sunset);
    p.slice(from + 1, to).forEach(id => {
      if (!c.flags.ch3Told) assert.ok(!her(id), name + ': ' + id + ' has Tallyheart on the kept path');
      else if (['field/border', 'field/border-two', 'bridge/back', 'bridge/bank', 'title/wide'].includes(camOf(id))) assert.ok(castOf(id, 'tallyheart').length, name + ': ' + id + ' has no Tallyheart on the told path');
    });
    assert.equal(rows.flags, undefined);
  }
  // the told twin of a panel is its kept twin with Tallyheart in it (and her lines), and nothing else; but
  // on the wall, where she is on both paths (her wink, or her order), and at the bridge's first panel, where
  // Sprinkle peeks over Tallyheart's branch on one path and is two eyes in the dark on the other
  const told = ids.filter(id => same(frames[id].when, TOLD));
  told.forEach(id => {
    const k = exits(frames[id])[0];
    if (!same(frames[k].when, KEPT) || ['f042', 'f069', 'f085'].includes(id)) return;
    const a = frames[id], b = frames[k];
    assert.deepEqual([a.scene.set, a.scene.cam, a.scene.fx], [b.scene.set, b.scene.cam, b.scene.fx], id + ' and ' + k + ': one picture');
    assert.deepEqual(a.scene.cast.filter(c => c.who !== 'tallyheart').map(c => [c.who, c.at]), b.scene.cast.map(c => [c.who, c.at]), id + ' and ' + k + ': the same cast but for her');
    assert.ok(castOf(id, 'tallyheart').length === 1 && castOf(k, 'tallyheart').length === 0, id + ' and ' + k);
  });
});

test('choices: five a reading, labels short, none sets a flag; the trail’s labels for a cat who has met Sleet; every light one rejoins at once', () => {
  const choiceIds = ids.filter(id => frames[id].choice);
  assert.deepEqual(choiceIds, [MARCH, FAIR, TRAIL, QUESTION, STARRY]);
  const L = id => frames[id].choice.options.map(o => o.label);
  const O = (id, i) => T(frames[id].choice.options[i].next);
  choiceIds.forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length === 2, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), id === TRAIL ? ['label', 'labelWhen', 'next', 'sets'] : ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 12, id + ' option ' + i + ' label');
      assert.equal(o.when, undefined, id + ': both options are for everyone');
    });
    assert.equal(frames[id].choice.prompt, undefined, id);
  });
  assert.deepEqual(L(MARCH), ['Lead the way!', 'Walk in the middle.']);
  assert.match(O(MARCH, 0), /^Sharp eyes\.$/);
  assert.match(O(MARCH, 1), /^My first patrol, I walked into a tree\.$/);
  assert.deepEqual(L(FAIR), ['“Did ReedClan take our prey?”', '“Has anything gone from YOUR pile too?”']);
  assert.deepEqual(UNFAIR.map(T), ['Sloshbank’s fur goes up. Ask it fair.', 'So you do: Has anything gone from YOUR pile too?']);
  assert.deepEqual(L(TRAIL), ['Follow the fox trail to the last post.', 'Not today. Sprinkle’s fish are waiting.']);
  const met = { flags: { foundSleet: true } }, notMet = { flags: {} };
  assert.deepEqual(frames[TRAIL].choice.options.map(o => E.optionLabel(o, met)), ['Go and see Sleet again.', 'Not today. He’s spying.']);
  assert.deepEqual(frames[TRAIL].choice.options.map(o => E.optionLabel(o, notMet)), L(TRAIL));
  assert.deepEqual(frames[TRAIL].choice.options.map(o => o.labelWhen), [[{ when: { foundSleet: true }, label: 'Go and see Sleet again.' }], [{ when: { foundSleet: true }, label: 'Not today. He’s spying.' }]]);
  NOT.forEach(id => assert.match(T(id), /^Fish don’t wait\. They get SMELLY\. HMPH!$/));
  assert.deepEqual(L(QUESTION), ['“Would you tell the FOX?”', '“Would you tell ANYBODY?”']);
  assert.match(O(QUESTION, 0), /^Never\. Not to anybody\. And I never trade with foxes\. Foxes never leave anyone alone\./);
  assert.deepEqual(L(STARRY), ['“Who are you?”', '“Who was there?”']);
  assert.match(O(STARRY, 0), /^She only purrs, like a train far away\.$/);
  assert.match(O(STARRY, 1), /^She looks down, past the stars\.$/);
  // a spoken option is never echoed as a balloon on its outcome
  choiceIds.forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    if (said) (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
  // five on every path; how much she reads before she chooses: everything on the screen and both labels
  for (const c of COMBOS) assert.equal(walk(c.flags, c.o).filter(id => frames[id].choice).length, 5, comboName(c));
  for (const c of SOME) walkLines(c.flags, c.o).filter(r => r.options).forEach(r => {
    const n = r.lines.reduce((m, s) => m + words(s), 0) + r.options.reduce((m, s) => m + words(s), 0);
    assert.ok(n >= 7 && n <= 42, r.id + ': ' + n + ' words before she chooses, for ' + comboName(c));
  });
});

test('inputs, counts, skips, taps and Tallyheart’s five Counts, in the story’s order', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  assert.equal(T(inputs[0]), 'What else did {name}paw dream, the night of {their} first patrol?');
  const ph = frames[inputs[0]].input.placeholder;
  assert.ok(typeof ph === 'string' && ph.length <= 30 && /snake|stars|chime/.test(ph), ph);
  // six Counts moments, seven with Sleet's riddle
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => frames[id].counts.set), SETS);
  counts.forEach(id => {
    const set = frames[id].counts.set;
    assert.deepEqual(Object.keys(frames[id].counts).sort(), NO_INTRO.includes(set) ? ['intro', 'next', 'set'] : ['next', 'set'], id);
    assert.ok(E.countsSet(set, story, STORIES), id + ': the counts set exists');
  });
  assert.equal(frames[counts[1]].counts.intro, false);
  assert.ok(SLEET.includes(counts[5]));
  // three skip-counts: five patrols, Sleet's forepaw, the bedtime patrols
  const skips = ids.filter(id => frames[id].skip);
  assert.equal(skips.length, 3);
  const [five, paw, bed] = skips.map(id => frames[id].skip);
  assert.deepEqual(five, { table: 3, groups: 5, teacher: 'tallyheart', thing: 'cat', things: 'cats', label: 'Count the next patrol.', prompt: '**Tap** the patrols.', next: five.next });
  assert.deepEqual([0, 1, 5].map(n => E.skipView(five, n).count), ['', '3…', '3… 6… 9… 12… 15!']);
  assert.deepEqual([E.skipView(five, 5).done, E.skipView(five, 5).total, E.skipWords(five, 'tallyheart').teacher], [true, 15, 'tallyheart']);
  assert.deepEqual(E.skipPicture(five, 2), { table: 3, groups: 5, per: 3, highlight: 6, totals: true, next: true, who: undefined, thing: 'cat', things: 'cats' }, 'all five patrols drawn from the first tap, the next one glowing');
  assert.equal(E.skipReached(E.skipInto(story, five.next)), 15, 'a big 15 on the page the fifth tap turns to');
  assert.match(T(five.next), /^Fifteen! Five patrols of three\./);
  assert.deepEqual(paw, { table: 5, groups: 1, who: [{ who: 'sleet' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: BRIDGE });
  assert.deepEqual([E.skipView(paw, 1).total, E.skipView(paw, 1).done, E.skipView(paw, 1).count, E.skipInto(story, paw.next)], [5, true, '5!', null]);
  assert.deepEqual(bed, { table: 3, groups: 6, teacher: 'player', thing: 'cat', things: 'cats', label: 'Count the next patrol.', prompt: '**Tap** the patrols.', next: bed.next });
  assert.equal(E.skipView(bed, 6).count, '3… 6… 9… 12… 15… 18!');
  assert.equal(E.skipReached(E.skipInto(story, bed.next)), 18, 'a big 18 over the dark');
  assert.match(T(bed.next), /^That’s not a paw thing\. That’s a GUARD thing\.$/);
  // the eight pages she taps once (the spec's one-tap table)
  const taps = ids.filter(id => frames[id].scratch);
  assert.deepEqual(taps.map(id => Object.assign({}, frames[id].scratch, { next: undefined })), [
    { tap: 'pinecone', prompt: '**Tap** the pinecone.', label: 'Roll the pinecone.', miss: 'SNNNRRRK!', next: undefined },
    { tap: 'paw', prompt: '**Tap** to wave back.', label: 'Wave back.', next: undefined },
    { tap: 'stone', prompt: '**Tap** the stones to find the voice.', label: 'Find the voice.', miss: 'drip…', next: undefined },
    { tap: 'paw', prompt: '**Tap** the ground, softly.', label: 'Pat the ground.', miss: 'pat…', next: undefined },
    { tap: 'eyes', prompt: '**Tap** to wave at his eyes.', label: 'Wave at his eyes.', next: undefined },
    { tap: 'pebbles', prompt: '**Tap** to put the pebbles down.', label: 'Put the pebbles down.', next: undefined },
    { tap: 'cheeks', prompt: '**Tap** his puffed-up cheeks.', label: 'Tap his cheeks.', next: undefined },
    { tap: 'ears', prompt: '**Tap** your ears to listen.', label: 'Listen.', next: undefined }
  ]);
  taps.forEach(id => assert.deepEqual(E.tapWords(frames[id]), Object.assign({ kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label }, frames[id].scratch.miss ? { miss: frames[id].scratch.miss } : {}), id));
  assert.equal(taps[0], story.start, 'the first thing she does is on the first screen');
  // (the story's response to each is shown by the next panel)
  assert.deepEqual([castOf(taps[0], 'grizzled')[0].holdAt, castOf(frames[taps[0]].scratch.next, 'grizzled')[0].holdAt], ['chin', 'paws'], 'the pinecone rolls from under his chin to his paws');
  assert.deepEqual([castOf(taps[2], 'coil')[0].pose, castOf(frames[taps[2]].scratch.next, 'coil')[0].pose], ['stone', 'head'], 'the stone was his head');
  assert.deepEqual([castOf(taps[3], 'player')[0].pose, castOf(frames[taps[3]].scratch.next, 'player')[0].pose], ['pawup', 'sit'], 'her paw is down on the sand');
  assert.deepEqual([castOf(taps[4], 'player')[0].pose, castOf(frames[taps[4]].scratch.next, 'player')[0].pose], ['sit', 'pawup'], 'her paw is up before his eyes');
  assert.deepEqual([castOf(taps[5], 'riffle')[0].holdAt, castOf(frames[taps[5]].scratch.next, 'riffle')[0].holdAt], [undefined, 'paws'], 'the pebbles at his feet');
  assert.match(T(frames[taps[6]].scratch.next), /^On the bank, he bursts\./);
  assert.deepEqual(castOf(frames[taps[7]].scratch.next, 'grizzled').map(c => [c.pose, c.holds, c.holdAt]), [['walk', 'pinecone', 'mouth']], 'the old tom shuffling out');
  // Tallyheart's five Counts: a Tap that counts nothing; the threes our cat already knows, hers to say
  const asks = ids.filter(id => frames[id].ask);
  assert.equal(asks.length, 1);
  assert.deepEqual(frames[asks[0]].ask, { who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
    pairs: [['Tails?', 'Three cats, three tails!'], ['Ears?', 'Three cats, six ears!'], ['Claws?', 'Three forepaws, fifteen claws!'],
      ['Both forepaws?', 'Three cats, thirty claws. Like this morning’s three rows!'], ['Nine lives?', 'Three cats, twenty-seven. Just now!']], next: counts[3] });
  // the order of the things she does, on the page
  const order = [taps[0], counts[0], counts[1], counts[2], skips[0], asks[0], counts[3], MARCH, counts[4], FAIR, taps[1], TRAIL, counts[5], skips[1], taps[2], taps[3], taps[4], taps[5], QUESTION, taps[6], counts[6], taps[7], skips[2], STARRY, inputs[0]];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: ten Taps and six Counts moments for everyone; Sleet adds his riddle and his forepaw
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), name = comboName(c);
    assert.equal(p.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask).length, 11 + (c.o.sleet ? 1 : 0), name + ': Taps');
    assert.equal(p.filter(id => frames[id].counts).length, 6 + (c.o.sleet ? 1 : 0), name + ': Counts moments');
    assert.deepEqual([E.kindOf(frames[p[0]]), E.kindOf(frames[p[1]])], ['scratch', 'counts'], name);
  }
});

/* ------------------------------------------------------------------ reading through the engine */

const Sp = PC.ui.speakers;
const labelFor = (b, cat, st) => Sp.label(b, { cat, story: st || story, fill: x => E.fill(x, cat) });
function saidOn(st, id, cat) {
  const f = st.frames[id], cast = (f.scene && f.scene.cast) || [];
  return E.balloons(f, cat).map(b => {
    const mine = cast.filter(c => c && c.who === b.who), m = mine[b.nth] || mine[0];
    return { who: b.who, label: labelFor(Object.assign({}, b, { variant: m && m.variant }), cat, st), text: E.fill(b.text, cat), kind: b.kind };
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
    const prompt = E.promptLines(def, D, q).map(l => Object.assign({}, l, { label: l.who ? labelFor({ who: l.who }, cat, st) : null, text: E.fill(l.text, cat) }));
    const picture = E.lessonPicture(D, q, q.lit || 0), light = E.lightSteps(D, q);
    const r = E.counts.answer(state, D, a, t, 1);
    E.logAnswer(cat, r.entry);
    const row = { k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, picture, light, line: E.fill(r.line, cat), kind: r.lineKind,
      balloons: (r.balloons || []).map(b => Object.assign({}, b, { text: E.fill(b.text, cat) })), res: r, teacher: E.teacherOf(def, D) };
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
  for (let guard = 0; guard < 600; guard++) {
    const id = E.frameId(cat, st), f = st.frames[id], kind = E.kindOf(f);
    const row = { id, kind, f, caps: E.captions(f, cat).map(c => E.fill(c, cat)), say: saidOn(st, id, cat),
      cards: E.cardsOn(f, cat, st, STORIES), file: E.cards(cat, STORIES).map(c => c.id), counts: cat.counts.length, sfx: f.sfx || '',
      scene: f.scene ? E.resolveScene(f.scene, cat, STORIES) : null };
    rows.push(row);
    if ((o.stop && id === o.stop) || kind === 'end') break;
    t += 10;
    if (kind === 'skip') { row.skip = E.skipFor(f.skip, cat); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'ask') { row.asked = []; for (let n = 1; n <= E.askView(f.ask, 99).total; n++) row.asked.push(E.askView(f.ask, n).pair); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'next' || kind === 'file') assert.ok(E.next(cat, st, t), id);
    else if (kind === 'scratch') { row.tap = E.tapWords(f); row.scratched = []; for (let c; (c = E.scratchTap(cat, st, t));) row.scratched.push(c); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'choice') {
      const opts = E.options(f, cat);
      row.options = opts.map(x => E.fill(E.optionLabel(x.option, cat), cat));
      row.picked = o.pick ? o.pick(id) : 0;
      assert.ok(E.choose(cat, st, opts[row.picked].index, t), id);
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'a snake with no eyelids' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      row.lesson = lessonRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat at chapter 6's first page: chapters 1 to 5 finished, her chapter 1 to 5 flags, the Counts she
 * learned there (chapter 4's tens and chapter 5's nines played through the engine, with these answers and
 * times in the nines: what today's warm-up finds hard), and her Case File as chapters 4 and 5 left it
 * (chapter 4's `tidy` among it, for ReedClan's card to lie beside). */
const CH5_CARDS = ['otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh'];
function before6(flags, nines, ninesMs) {
  const cat = E.blankCat({ now: 1, id: 'c6' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch2SaidAloud: true, ch3Told: true, caseFileOpen: true, ch5First: 'otters' }, flags || {});
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  play(cat, 'ch04-tens');
  play(cat, 'ch05-nines', nines, ninesMs);
  Object.keys(ch04.cards).filter(cid => !ch04.cards[cid].when || E.matches(ch04.cards[cid].when, cat)).forEach((cid, i) => E.giveCard(cat, cid, 'ch04', 10 + i));
  CH5_CARDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch05', 30 + i));
  return cat;
}
function fresh(flags, nines, ninesMs) {
  const cat = before6(flags, nines, ninesMs);
  E.startChapter(cat, story, 500);
  return cat;
}
/* Read chapter 6: `o` is a route (`sleet`, `unfair`, `light`: as `pick`), with `stop`, `answers`, `ms`,
 * `dream` and `t` as readStory takes them. */
function read(cat, o) { o = o || {}; return readStory(cat, story, Object.assign({}, o, { pick: id => pick(id, o) })); }
const rowAt = (rows, id) => rows.find(r => r.id === id);
const idsOf = rows => rows.map(r => r.id);
function readWords(rows) {
  const out = [];
  rows.forEach(r => {
    out.push(...r.caps, ...r.say.map(b => b.label + ': ' + b.text), ...(r.options || []), ...r.cards.map(c => c.line), r.sfx);
    (r.asked || []).forEach(p => out.push(...p));
    (r.lesson || []).forEach(l => out.push(...l.prompt.map(p => (p.label || '') + ': ' + p.text), l.line, ...l.balloons.map(b => b.text), l.help ? l.help.intro : ''));
  });
  return out.join('\n');
}
function reading(flags, o) {
  const cat = fresh(flags), rows = read(cat, o);
  return { cat, rows, w: readWords(rows), ids: idsOf(rows) };
}
const clone = x => JSON.parse(JSON.stringify(x));

/* The frames the tests name: found by what they say. */
const countsAt = set => ids.filter(id => frames[id].counts && frames[id].counts.set === set);
const PILE_COUNT = countsAt('ch06-pile')[0];
const TREE = F(/^Tallyheart stretches up the leaning tree\./);
const WALL = F(/^Three cats, along the old stone wall above the river\./);
const STEP_OUT = F(/^Out step three cats: one, two, three\./);
const WAVE = F(/^The reeds close behind them\./);
const WAY_HOME = F(/^On the way home, Tallyheart stops\./);
const BARKING = F(/At the Barking Field, Riffle is waiting/);
const HELLO = F(/So you tell her about the border\./);
const SLIDES = F(/^Slowly, slowly, he slides back into the stones\./);
const SUNSET = F(/^At sunset, the whole Clan sits round the prey pile\./);
const MOONRISE = F(/The moon comes out, a little fatter\.$/);
const NEST = F(/^In your nest:/);
const DREAM_WALK = F(/^You’re walking on the Sky River/);

/* ------------------------------------------------------------------ speakers, tokens, words */

test('every balloon speaker is in that frame’s cast; where two of a kind are in the picture, the first of them speaks; balloons and captions are well formed', () => {
  ids.forEach(id => {
    const f = frames[id];
    const by = {};
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(typeof b.name === 'string' && b.name.trim() && !tokensIn(b.name).length, id + ' say ' + i + ' name');
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      assert.ok(castOf(id, b.who).length, id + ': ' + b.who + ' speaks and is not in the picture');
      by[b.who] = (by[b.who] || 0) + 1;
    });
    // the page gives a speaker's nth balloon to the nth of them in the cast: with two ReedClan cats in the
    // picture, every ReedClan balloon is the first one's (the young tom's), and with three dogs the tiny one's
    Object.keys(by).forEach(who => { if (castOf(id, who).length > 1) assert.equal(by[who], 1, id + ': ' + by[who] + ' balloons from ' + who + ', and ' + castOf(id, who).length + ' of them in the picture'); });
    if (f.caption !== undefined) {
      assert.ok(Array.isArray(f.caption) && f.caption.length > 0, id + ' caption');
      f.caption.forEach(t => {
        if (typeof t === 'string') assert.ok(t.trim(), id + ' empty caption');
        else { assert.deepEqual(Object.keys(t).sort(), ['text', 'when'], id + ' caption object'); assert.ok(t.text.trim(), id + ' empty caption'); }
      });
    }
    if (f.sfx !== undefined) assert.ok(typeof f.sfx === 'string' && f.sfx.trim(), id + ' sfx');
    texts(f).forEach(x => { if (x.when) Object.keys(x.when).forEach(k => assert.ok(k === 'not' || FLAGS[k], id + ' ' + x.where + ': when ' + k)); });
  });
  // a Tap's own counting balloon has somebody in the picture to belong to
  ids.filter(id => frames[id].skip).forEach(id => {
    const f = frames[id], who = E.skipWords(E.skipFor(f.skip, { flags: {} }), ((f.say || [])[0] || {}).who).teacher;
    assert.ok(castOf(id, who).length, id + ': ' + who + ' keeps the count, and is in the picture');
  });
  assert.deepEqual(ids.filter(id => frames[id].skip).map(id => E.skipWords(frames[id].skip, ((frames[id].say || [])[0] || {}).who).teacher), ['tallyheart', 'sleet', 'player']);
});

test('speakers: Coil is “A voice”, then “The snake”, then “Coil” from Riffle’s “Coil,”; Sleet is “The long grass”, then “The silver-white dragon”, then “Sleet” from “I’m Sleet”; the starry cat is never named; ReedClan by coat', () => {
  const cat = E.blankCat({}); cat.name = 'Fern';
  const label = (b, id) => labelFor(Object.assign({}, b, { variant: id && (castOf(id, b.who)[0] || {}).variant }), cat);
  assert.deepEqual([label({ who: 'coil' }), label({ who: 'sleet' }), label({ who: 'sloshbank' })], ['The snake', 'The silver-white dragon', 'Sloshbank']);
  assert.deepEqual([Sp.NAMES.coil, Sp.NAMES.sleet, Sp.NAMES.sloshbank], ['Coil', 'Sleet', 'Sloshbank']);
  // Coil
  const coilSays = ids.filter(id => (frames[id].say || []).some(b => b.who === 'coil'));
  const named = F(/^Then more of him\. Then MORE of him\. Coil\. Hi!/);
  assert.equal(frames[named].say[0].who, 'riffle', 'Riffle names him');
  const coilLabels = coilSays.map(id => frames[id].say.filter(b => b.who === 'coil').map(b => label(b, id)));
  assert.deepEqual(coilLabels[0], ['A voice'], 'heard first, out of a stone');
  assert.equal(coilSays[0], HELLO);
  assert.deepEqual(coilLabels[1], ['The snake'], 'his first sight');
  assert.match(T(coilSays[1]), /How… do… you… do\./);
  coilSays.slice(2).forEach((id, i) => { assert.ok(at(id) > at(named), id); coilLabels[i + 2].forEach(l => assert.equal(l, 'Coil', id)); });
  ids.slice(0, at(named)).forEach(id => (frames[id].say || []).forEach(b => assert.doesNotMatch(b.text, /\bCoil\b/, id + ': his name is said only by Riffle, first')));
  assert.deepEqual(castOf(HELLO, 'coil').map(c => c.pose), ['stone'], '“A voice”: a stone in the wall');
  assert.equal(Sp.faceHidden(frames[HELLO].say[1], castOf(HELLO, 'coil')[0]), true, 'and no face in the stacked balloons');
  // Sleet
  const sleetSays = ids.filter(id => (frames[id].say || []).some(b => b.who === 'sleet'));
  const intro = SLEET.filter(id => /^I’m Sleet\. The eldest\./.test(T(id)));
  assert.equal(intro.length, 2, 'the twins of “I’m Sleet”');
  sleetSays.forEach(id => frames[id].say.filter(b => b.who === 'sleet').forEach(b => {
    const want = NOT.includes(id) || /^PSST!|^Don’t look!/.test(b.text) ? 'The long grass' : at(id) >= at(intro[0]) ? 'Sleet' : 'The silver-white dragon';
    assert.equal(label(b, id), want, id + ': ' + b.text);
    if (want === 'The long grass') assert.ok(['hidden', 'tail'].includes(castOf(id, 'sleet')[0].pose) && Sp.faceHidden(b, castOf(id, 'sleet')[0]), id + ': bent grass or a tail, no face');
  }));
  assert.ok(sleetSays.filter(id => at(id) < at(intro[0]) && SLEET.includes(id)).length >= 4, 'the silver-white dragon speaks before he says his name');
  SLEET.slice(0, SLEET.indexOf(intro[0])).forEach(id => assert.doesNotMatch(T(id), /Sleet/, id + ': his name is not lettered before he says it'));
  assert.equal(story.counts['ch06-sleet'].teacher, 'sleet', 'so his riddle, its help, its fillers and its retry are “The silver-white dragon”’s (the chapter’s names)');
  // the “5!” the page adds under his own balloon on the forepaw Tap is Sleet's too
  const tap = SLEET[SLEET.length - 1], said = E.balloons(frames[tap], cat), w = E.skipWords(frames[tap].skip, said[0].who);
  assert.deepEqual(said.map(b => label(b, tap)).concat(label({ who: w.teacher, name: Sp.nameOn(said, w.teacher) })), ['Sleet', 'Sleet'], tap);
  // the starry cat: a Clan cat in starlight, “The starry cat” on her balloon, never a name of her own
  const starry = ids.filter(id => frames[id].scene.cast.some(c => c.starry));
  assert.ok(starry.length >= 4 && starry.every(id => frames[id].scene.set === 'sky'));
  ids.filter(id => (frames[id].say || []).some(b => b.who === 'clancat')).forEach(id => frames[id].say.filter(b => b.who === 'clancat').forEach(b => assert.equal(label(b, id), 'The starry cat', id)));
  // ReedClan: Sloshbank by name (Tallyheart names him first), the young tom by his coat; the she-cat never speaks
  const reed = ids.filter(id => (frames[id].say || []).some(b => b.who === 'reedclan'));
  assert.ok(reed.length >= 3);
  reed.forEach(id => { frames[id].say.filter(b => b.who === 'reedclan').forEach(b => assert.equal(label(b, id), 'Young ReedClan tom', id)); assert.equal(castOf(id, 'reedclan')[0].variant, 2, id + ': the young tom is the first ReedClan cat in the picture'); });
  const slosh = ids.filter(id => (frames[id].say || []).some(b => b.who === 'sloshbank'));
  assert.ok(at(slosh[0]) > at(F(/^The biggest is a stern brown tom\./)), 'Sloshbank speaks after he has been seen');
  ids.slice(0, at(F(/^The biggest is a stern brown tom\./))).forEach(id => assert.doesNotMatch(T(id), /Sloshbank/, id));
  // the dogs: the tiny one shouts
  const dogs = F(/BYE, WET SQUIRREL!/);
  assert.equal(saidOn(story, dogs, cat)[0].label, 'The tiny dog');
  // nobody else carries a name: everyone else is known already
  ids.forEach(id => (frames[id].say || []).filter(b => !['coil', 'sleet', 'clancat'].includes(b.who)).forEach(b => assert.equal(b.name, undefined, id + ' ' + b.who)));
  // what each Counts frame says again over its first question: three balloons or more never; the warm-up's
  // none (`intro: false`: its first question may be her hardest nine, and is timed on itself)
  const again = ids.filter(id => frames[id].counts).map(id => [frames[id].counts.set, E.balloons(frames[id], cat).length, Sp.lessonIntro(E.balloons(frames[id], cat), frames[id].counts.intro === false).length]);
  assert.deepEqual(again, [['ch06-pile', 3, 0], ['ch06-nines', 1, 0], ['ch06-four', 0, 0], ['ch06-threes', 1, 1], ['ch06-watchers', 2, 2], ['ch06-sleet', 1, 1], ['ch06-guards', 1, 1]]);
  // a Murmur's warrior is Mutterchime
  cat.name = 'Murmur';
  assert.equal(label({ who: 'murmurchime' }), 'Mutterchime');
  // the grown-ups corner has words for every flag a frame of the chapter sets
  const W = PC.ui.flagWords;
  ids.forEach(id => Object.entries(frames[id].sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v)));
});

test('text tokens are only the allowed ones', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = x.ok || (id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS);
    tokensIn(x.text).forEach(t => { if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}'); });
  });
  assert.deepEqual(bad, []);
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  everyText((id, x) => (String(x.text).match(/\{(Murmur|murmur|MURMUR)\}\w*/g) || []).forEach(m => assert.equal(m, '{Murmur}chime', id + ' ' + x.where + ': ' + m)));
  Object.keys(story.cards).forEach(cid => { assert.deepEqual(tokensIn(story.cards[cid].line), [], cid); if (story.cards[cid].link) assert.deepEqual(tokensIn(story.cards[cid].link.line), [], cid); });
  ids.filter(id => frames[id].ask).forEach(id => frames[id].ask.pairs.forEach(p => assert.deepEqual(tokensIn(p[0] + p[1]), [], id)));
});

/* The most words a single reader sees on a frame: the lines for every combination of the flags its `when`s
 * read (a balloon in eight forms, one for each set of siblings found, is one balloon to every reader). */
function maxWords(f) {
  const keys = new Set();
  const collect = w => Object.keys(w || {}).forEach(k => (k === 'not' ? collect(w.not) : keys.add(k)));
  texts(f).forEach(x => collect(x.when));
  const list = [...keys];
  let best = 0;
  const go = (i, flags) => {
    if (i === list.length) {
      const cat = { flags, lessons: flags.lessonClean ? { 'ch06-threes': { finished: true, noHelp: true } } : {} };
      const n = E.captions(f, cat).concat(E.balloons(f, cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []).reduce((m, s) => m + words(s), 0);
      best = Math.max(best, n);
      return;
    }
    const k = list[i];
    for (const v of (k === 'lessonClean' ? [true, false] : FLAGS[k].concat([undefined]))) go(i + 1, Object.assign({}, flags, v === undefined ? {} : { [k]: v }));
  };
  go(0, {});
  return best;
}

test('word counts: about 15 to 18 words of lettering a frame, none over 30 for any reader but the old tom’s wake-up (31), never more than 50 with every variant a reader can see', (t) => {
  const over = [];
  ids.forEach(id => {
    const m = maxWords(frames[id]);
    assert.ok(m <= WORDS_MAX, id + ' has ' + m + ' words for its wordiest reader');
    if (m > WORDS_AIM) over.push(id + ' (' + m + ')');
    // every variant at once, the eight forms of her news apart (each reader reads one of them)
    const all = texts(frames[id]).filter(x => !(x.when && 'foundPuddle' in x.when)).reduce((n, x) => n + words(x.text), 0);
    assert.ok(all <= WORDS_MAX, id + ' has ' + all + ' words, every variant counted');
  });
  assert.deepEqual(over, ['f002 (31)'], 'the old tom’s wake-up, the pile’s three balloons (as chapter 5’s was), is the one frame over 30');
  const stats = {};
  let longest = 0, longestFrom = null;
  for (const c of COMBOS) for (const light of [0, 1]) {
    const o = Object.assign({}, c.o, { light }), rows = walkLines(c.flags, o);
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(s), 0));
    const w = per.reduce((a, b) => a + b, 0);
    per.forEach((n, i) => assert.ok(n <= 31, rows[i].id + ': ' + n + ' words for ' + comboName(c)));
    const k = (c.flags.ch3Told ? 'told' : 'kept') + (c.o.sleet ? ', with Sleet' : '');
    (stats[k] = stats[k] || []).push({ n: rows.length, w });
    assert.ok(w / rows.length >= 14.5 && w / rows.length <= 17, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
    let run = 0, worst = 0, from = null, first = null;
    rows.forEach(r => {
      if (r.kind !== 'next') { run = 0; return; }
      if (!run) from = r.id;
      if (++run > worst) { worst = run; first = from; }
    });
    assert.ok(worst <= 8, comboName(c) + ': ' + worst + ' panels in a row with nothing to do, from ' + first);
    if (worst > longest) { longest = worst; longestFrom = first; }
  }
  // the brief's budget: at most 130 frames a reading with Sleet; the story's estimate about 111 told, 125 with Sleet
  const range = k => [Math.min(...stats[k].map(x => x.n)), Math.max(...stats[k].map(x => x.n))];
  assert.deepEqual(Object.keys(stats).sort(), ['kept', 'kept, with Sleet', 'told', 'told, with Sleet']);
  assert.deepEqual([range('told'), range('kept'), range('told, with Sleet'), range('kept, with Sleet')], [[99, 101], [98, 100], [112, 114], [111, 113]]);
  Object.keys(stats).sort().forEach(k => {
    const s = stats[k], mm = f => Math.min(...s.map(f)) + '–' + Math.max(...s.map(f));
    t.diagnostic(k + ': ' + mm(x => x.n) + ' frames, ' + mm(x => x.w) + ' words of lettering, ' + (s.reduce((a, x) => a + x.w / x.n, 0) / s.length).toFixed(1) + ' a frame');
  });
  t.diagnostic('the longest run of panels with nothing to do: ' + longest + ', from ' + longestFrom);
});

test('a caption the page can letter on the panel is 95 characters at most (a long thought in two boxes); only the end page’s, which is lettered beside the panel whatever its length, runs on', () => {
  const long = ids.filter(id => (frames[id].caption || []).some(c => capText(c).length > 95));
  assert.deepEqual(long, ids.filter(id => frames[id].end));
  // the ones the story writes as one long line, each two boxes, in the order she reads them
  const two = re => frames[F(re)].caption.map(capText);
  const two2 = re => frames[F2(re)[0]].caption.map(capText);
  F2(/^The smell is strongest at the fence’s last post\./).forEach(id => assert.deepEqual(frames[id].caption, frames[F2(/^The smell is strongest at the fence’s last post\./)[0]].caption, id));
  assert.deepEqual(two2(/^The smell is strongest at the fence’s last post\./), ['The smell is strongest at the fence’s last post.', 'Past it, the long grass of fox country whispers.']);
  assert.deepEqual(two(/^A silver-white snout pokes out\./), ['A silver-white snout pokes out.', 'Then a whole silver-white dragonet, flat on his belly, with grass on his head.']);
  assert.deepEqual(two(/^It isn’t a stone\./), ['It isn’t a stone. It’s a long brown head, with two round eyes, shiny as wet pebbles.', 'They don’t blink.']);
});

test('every frame has a storyboard: a shot type in caps, then 2–4 sentences, no tokens', () => {
  const shot = new RegExp('^(' + SHOTS.join('|') + ')\\b[A-Z ,\\-]*\\.\\s');
  ids.forEach(id => {
    const b = frames[id].board;
    assert.ok(typeof b === 'string' && b.trim().length > 0, id + ': no board');
    assert.match(b, shot, id + ': board must start with a shot type in caps');
    assert.deepEqual(tokensIn(b), [], id + ': tokens in the board');
    assert.doesNotMatch(b, /['"]/, id + ': straight quotes in the board');
    const body = b.replace(shot, '');
    const sentences = body.split(/(?<=[.!?][”"]?)\s+(?=[A-Z“"(])/).filter(s => s.trim());
    assert.ok(sentences.length >= 2 && sentences.length <= 4, id + ': board has ' + sentences.length + ' sentences');
    assert.ok(words(body) >= 25, id + ': board too thin');
    // a board is for an illustrator: it never names the thieves, and nothing shows teeth, fangs or a tongue
    assert.doesNotMatch(b, /weasel|teeth|fang|snarl|tongue|tunnel|strik|squeez|coil(s|ed) round/i, id);
    assert.doesNotMatch(b, /\bSTUB\b/, id);
  });
  // a frame shown only on a path says so in its shot line; a Tap page says what the tap does in play
  ids.filter(id => frames[id].when).forEach(id => assert.match(frames[id].board.split('. ')[0], /\b(ONLY|BUT|NOT FOR)\b/, id + ': the shot line says who sees it'));
  ids.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].card).forEach(id => assert.match(frames[id].board, /the new card appears under the panel, an ear in its corner/, id + ': the board says the card appears'));
  // the told and kept twins are boarded for their own path
  ids.filter(id => same(frames[id].when, TOLD)).forEach(id => assert.match(frames[id].board.split('. ')[0], /THE TOLD PATH ONLY/, id));
  ids.filter(id => same(frames[id].when, KEPT)).forEach(id => assert.match(frames[id].board.split('. ')[0], /THE KEPT PATH ONLY/, id));
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
      const bad = badGrammar(out, x.sfx);
      if (bad.length) problems.push(kind + ' ' + id + ' ' + x.where + ': ' + bad.join(', ') + ' | ' + out);
    });
  });
  problems.forEach(s => t.diagnostic(s));
  assert.deepEqual(problems, []);
  assert.equal(fill(T(ids.find(id => frames[id].input)), PROFILES.tom), 'What else did Stormpaw dream, the night of his first patrol?');
  assert.match(fill(T(F(/back by sunset/)), PROFILES.tom), /And you, Stormpaw: back by sunset\./);
  const tomBook = fill(story.book.recap.map(r => r.text).join(' '), PROFILES.tom);
  assert.match(tomBook, /Tallyheart taught Stormpaw his sixth Count, patrols: the threes\./);
  assert.match(tomBook, /On his first border patrol, Stormpaw met Sloshbank of ReedClan/);
  assert.match(tomBook, /who told him to count what’s missing/);
  assert.match(fill(T(F(/First watch\. Me,/)), PROFILES.murmur), /First watch\. Me, Mutterchime, and you\./);
  assert.match(fill(story.book.dragonet[0].lines.join(' '), PROFILES.murmur), /Murmurpaw found him at the last post of the Barking Field/);
});

test('our own world and the tone: no Warriors or Wings of Fire words; nobody names the thief; Coil is funny-creepy and never frightening; the fox is a voice in the grass; ReedClan is proud and never cruel; nobody is hurt; the warrior thread stays light', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|apprentices’ den|assessment|from this day|claw-moon|quarter-moon|half-moon|whisker-lengths?|fox-lengths?|tail-lengths?|monsters? of the sky|leader’s? nine lives|gift of|silverpelt|bogwade|damplark|boglark|cattail)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|warriors’ den|claw-moon|silverpelt)\b/i, id + ' board'));
  // the starry cat is a description: no name of her own (her balloon's tag says what she is, and the book
  // says “a starry cat”), and no word for her home but the Sky River, nor for the dream
  ids.forEach(id => texts(frames[id]).forEach(x => assert.doesNotMatch(x.text, /\bstarry\b|\bStar[A-Z]?[a-z]*(clan|pelt)/i, id + ' ' + x.where)));
  everyText((id, x) => assert.doesNotMatch(x.text, /\bStarry\b|the starry cat/, id + ' ' + x.where + ': she is never named'));
  // (and the chapters' closing line, as chapters 2 to 5 close: “…and the Sky River shining over the rosebush.”)
  assert.deepEqual(FF(/Sky River/), [DREAM_WALK, ids[ids.length - 1]]);
  // nobody names the diggers, says weasel, tunnel or glass, or says what the “scale” is made of
  everyText((id, x) => assert.doesNotMatch(x.text, /weasel|stoat|ferret|polecat|tunnel|glass|\bscale\b|\bmole|\bSnip\b|\bSnatch\b/i, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /weasel|stoat|ferret|tunnel|\bmole/i, id + ' board'));
  // the thief is ReedClan's word, once in a temper and once in pride, and nobody is named as one
  assert.deepEqual(FF(/\bthie(f|ves)\b/i).map(id => frames[id].say.filter(b => /thie(f|ves)/i.test(b.text)).map(b => b.who + ': ' + b.text)),
    [['sloshbank: Are you calling ReedClan THIEVES?'], ['sloshbank: ReedClan will find the thief first.']]);
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'player').forEach(b => assert.doesNotMatch(b.text, /\b(stole|steals?|thie(f|ves)|did it|it was (the|a))\b/i, id + ': ' + b.text)));
  everyText((id, x) => assert.doesNotMatch(x.text, /stole the prey|the thie(f|ves) (is|are|was|were)\b|we know who|solved/i, id + ' ' + x.where));
  // her question at the border is a fair one: what is missing, never who did it (the unfair one is Tallyheart's to turn)
  assert.match(T(UNFAIR[0]), /Ask it fair\./);
  // ReedClan gives no number for its losses: nothing touches chapter 7's sum, and 24 stays out of the story questions
  assert.doesNotMatch(T(ADMIT), /\b(one|two|three|four|five|six|seven|eight|nine|ten|twenty|forty|\d+)\b/i, 'no number for ReedClan’s pile');
  ids.forEach(id => assert.doesNotMatch(T(id), /twenty-four|\b24\b/i, id));
  ['ch06-four', 'ch06-watchers', 'ch06-sleet', 'ch06-guards'].forEach(sid => story.counts[sid].facts.forEach(f => assert.notEqual(f.a * f.b, 24, sid)));
  // Coil: he never strikes, squeezes, bites or shows fangs; nobody says venom; his eyes never close; Riffle never
  // hugs his tail where he is; Coil never comes toward a cat (always at his gap, facing the cats from it)
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(strikes?|squeez\w*|bites?|bitten|fangs?|venom\w*|poison\w*|hiss\w*|tongue)\b/i, id + ' ' + x.where));
  const coil = ids.filter(id => castOf(id, 'coil').length);
  coil.forEach(id => castOf(id, 'coil').forEach(c => {
    assert.ok(A.vocab.otherPoses.coil.includes(c.pose), id + ': ' + c.pose);
    assert.equal(c.at, 'gap', id + ': Coil is at his gap and nowhere else');
    assert.equal(c.facing, 'right', id + ': his head toward the cats, his body trailing away from them');
    // drawn as he is; in the wider `back` shot half as big again, so that beside the cats he is the size he is
    // in the close `wall` shot (tests/set-bridge.test.js measures it), never bigger than that
    assert.ok(!c.squeeze && (!c.size || (frames[id].scene.cam === 'back' && c.size === 1.45)), id + ': drawn as he is');
    if (frames[id].scene.cam === 'back') assert.equal(c.size, 1.45, id + ': the wide shot\'s Coil, the same size beside the cats as close up');
  }));
  ids.filter(id => castOf(id, 'coil').length || /\bCoil\b|snake/.test(T(id))).forEach(id => assert.ok(!castOf(id, 'riffle').some(c => c.pose === 'hug'), id + ': no tail-hug in fright'));
  ids.forEach(id => assert.ok(!castOf(id, 'riffle').some(c => c.pose === 'hug'), id + ': Riffle never hugs his tail in this chapter'));
  // he trades a secret for quiet, has always known about Sprinkle and told nobody, and never trades with foxes
  F2(/^Never\. Not to anybody\./).forEach(id => assert.match(T(id), /I never trade with foxes\. Foxes never leave anyone alone\./, id));
  assert.match(T(F(/^Did you always know I was here\?|A snake’s secret\. A thing to check\. Did you always know/)), /Since the night you fell in\. I felt you land\. And you never TOLD\? Nobody asked\./);
  assert.match(T(F2(/^Everybody looks at Riffle\./)[0]), /A secret, for some quiet\. No juggling under my bridge\./);
  // the fox is never seen: no fox in any cast, no balloon of his; Sleet heard him far out in the grass
  ids.forEach(id => assert.ok(!frames[id].scene.cast.some(c => c.who === 'reynard'), id + ': the fox is in the picture'));
  ids.forEach(id => (frames[id].say || []).forEach(b => assert.notEqual(b.who, 'reynard', id)));
  // nobody dies, nobody is hurt, nobody is chased (the young tom's “OW.” is a sat-on tail)
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(wound(ed)?|blood|bleed|bleeds|broken|die[sd]?|dead|death|kill(ed|s)?|bones?|drown\w*|chas(e|es|ed|ing)|snarls?|growls?|attacks?|pounces on|swallow(s|ed)? (you|her|him|us)|hurts?)\b/i, id + ' ' + x.where));
  assert.deepEqual(FF(/\bOW\b/), [F(/^The ReedClan she-cat sits on his tail\./)]);
  // ReedClan proud and never cruel; Tallyheart keeps the Accord
  assert.match(T(F(/Not under the Accord\./)), /^Nobody is calling anybody anything\. Not at a border\. Not under the Accord\.$/);
  // nobody steps over the line at the border, and nobody past the last post but Sleet
  ids.filter(id => frames[id].scene.set === 'title' && ['end', 'meet'].includes(frames[id].scene.cam)).forEach(id => frames[id].scene.cast.forEach(c => {
    const reed = ['sloshbank', 'reedclan'].includes(c.who);
    if (typeof c.at === 'string') assert.ok(reed ? /^reed-/.test(c.at) : /^end-/.test(c.at), id + ': ' + c.who + ' at ' + c.at);
    else assert.ok(reed && c.at.x > 800, id + ': ' + c.who + ' walks off on their own side');
  }));
  ids.filter(id => frames[id].scene.set === 'field').forEach(id => frames[id].scene.cast.forEach(c => {
    if (c.who === 'sleet') assert.equal(c.at, 'grass', id + ': Sleet is past the post, in the long grass, and never on the Clan’s side');
    else assert.notEqual(c.at, 'grass', id + ': ' + c.who + ' never steps past the last post');
  }));
  // the warrior thread stays light: one moment and no promise
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(\w+) to go\b|One day|when you(’re| are) a warrior|your Warrior Counts|you’ll be a warrior/i, id + ' ' + x.where));
  assert.deepEqual(FF(/warrior’s work/), [F(/^\{Murmur\}chime still sounds surprised\./)]);
  // the hook is curious, never scary: the guards are set, and tomorrow is the sixth count
  assert.match(T(F(/^Tomorrow, your sixth morning count\./)), /^Tomorrow, your sixth morning count\. Will anything be missing\? You curl up tight, and sleep\.$/);
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(terrif|horribl|scream|nightmare|monster)/i, id + ' ' + x.where));
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the story’s own: every caption, balloon, sound effect, option and card line is in docs/chapters/06-the-snake-in-the-stones.md, and every line its screens speak is in the chapter', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/chapters/06-the-snake-in-the-stones.md'), 'utf8');
  const from = doc.indexOf('## Asleep on guard'), to = doc.indexOf('\n*For us*');
  assert.ok(from > 0 && to > from, 'the story, from its first screen to its notes');
  const screens = doc.slice(from, to);
  const flat = t => t.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  const loose = t => t.replace(/[,.]/g, '').replace(/\s+/g, ' ').trim();
  const page = flat(screens), pageLoose = loose(page);
  const spoken = screens.split(/\n\s*\n/).map(p => (flat(p).match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).join(' ')).filter(Boolean).map(loose).join(' ¶ ');
  const inText = t => page.includes(t) || spoken.includes(loose(t)) || pageLoose.includes(loose(t));
  const bySentence = t => t.split(/(?<=[.!?…])\s+/).every(inText);
  const mine = [];
  ids.forEach(id => {
    const f = frames[id];
    (f.caption || []).forEach(c => { if (!inText(capText(c)) && !bySentence(capText(c))) mine.push(id + ': ' + capText(c)); });
    (f.say || []).forEach(b => { if (!inText(b.text) && !bySentence(b.text)) mine.push(id + ' ' + b.who + ': ' + b.text); });
    if (f.sfx && !page.includes(f.sfx)) mine.push(id + ' sfx: ' + f.sfx);
    if (f.choice) f.choice.options.forEach(o => {
      if (!page.includes(o.label.replace(/^“|”$/g, ''))) mine.push(id + ' option: ' + o.label);
      // the labels for a cat who has met him are in the story's note under the choice
      (o.labelWhen || []).forEach(v => assert.ok(page.includes('“' + v.label + '”'), id + ': ' + v.label));
    });
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '')), id + ': ' + f.scratch.prompt);
    if (f.skip && f.skip.prompt) assert.ok(page.includes(f.skip.prompt.replace(/\*\*/g, '')), id + ': ' + f.skip.prompt);
    if (f.ask) { assert.ok(page.includes(f.ask.prompt.replace(/\*\*/g, ''))); f.ask.pairs.forEach(p => assert.ok(spoken.includes(loose(p[0])) && page.includes('“' + p[1] + '”'), id + ': ' + p.join(' / '))); }
  });
  Object.keys(story.cards).forEach(cid => assert.ok(page.includes('“' + story.cards[cid].line + '”'), cid + ': ' + story.cards[cid].line));
  // what is the builder's and not the story's: the closing frame in her nest
  const end = ids[ids.length - 1];
  assert.deepEqual(mine, [end + ': ' + frames[end].caption[0], end + ': End of Chapter Six.']);
  // chapters 2 to 5's closing form (the guards walked three by three, one patrol after another: never eighteen
  // round the pile at once)
  assert.match(frames[end].caption[0], /^You sleep warm in your nest, with six claw marks on the tree and the Sky River shining over the rosebush\.$/);
  assert.ok(frames[end].scene.fx.includes('skyriver'), 'and it is drawn');
  // and the other way: every line a screen of the story speaks is lettered somewhere in the chapter (a frame,
  // an option, a Counts set's lines, Tallyheart's five Counts, her cards)
  const lettered = [];
  everyText((id, x) => lettered.push(String(x.text).replace(/\*\*/g, '')));
  ids.forEach(id => (frames[id].choice ? frames[id].choice.options : []).forEach(o => lettered.push(o.label.replace(/^“|”$/g, ''))));
  const all = loose(lettered.join(' '));
  const missing = [];
  screens.replace(/\*\*([^*]+)\*\*/g, ' ').replace(/\*[^*]*\*/g, ' ').split(/\n\s*\n/).forEach(p => {
    (p.replace(/\s+/g, ' ').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => { if (!all.includes(loose(q))) missing.push(q); });
  });
  assert.deepEqual(missing, []);
  // the story's plain lines the build letters as the engine's questions: the pile's and the riddle's, word for word
  assert.ok(page.includes('Three full rows of ten. How many pieces?') && page.includes('How many ReedClan cats watched you?') && page.includes('How many times does Mama hear HERE?') && page.includes('How many guards?'));
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab): the wall’s far end, the dream, Coil’s wall, the last post’s grass, the pile’s moon, and the cast and extras chapter 6 adds', () => {
  const v = A.vocab;
  assert.ok(v && v.sets.title.cams.includes('meet') && v.sets.sky.cams.includes('walk') && v.sets.bridge.cams.includes('wall') && v.otherPoses.coil && v.otherPoses.sleet && v.variants.reedclan, 'the art exposes chapter 6’s vocabulary');
  // the older cat extras the chapter may use, each with its value
  const OLD = { flatEars: [true], claws: [true], squeeze: [true], tear: [true], purr: [true], puffed: [true], wink: [true], holdAt: ['chin', 'paws', 'mouth'] };
  const seen = {};
  ids.forEach(id => {
    const s = frames[id].scene;
    assert.ok(s && typeof s === 'object', id + ': no scene');
    assert.deepEqual(Object.keys(s).filter(k => !['set', 'cam', 'opts', 'cast', 'fx'].includes(k)), [], id + ': scene keys');
    const set = v.sets[s.set];
    assert.ok(set, id + ': unknown set ' + s.set);
    assert.ok(set.cams.includes(s.cam), id + ': set ' + s.set + ' has no camera ' + s.cam);
    Object.keys(s.opts || {}).forEach(k => {
      const allowed = set.opts[k];
      assert.ok(allowed, id + ': set ' + s.set + ' has no option ' + k);
      const val = s.opts[k];
      if (allowed === 'number') assert.ok(Number.isInteger(val) && val >= 0 && val <= 12, id + ': ' + k + '=' + val);
      else assert.ok(Array.isArray(allowed) && allowed.some(x => same(x, val)), id + ': ' + k + '=' + JSON.stringify(val));
    });
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
      if (c.holds === 'pinecone') assert.ok(c.who === 'grizzled' && ['chin', 'paws', 'mouth'].includes(c.holdAt), where + ': the old tom’s pinecone');
      if (c.holds === 'string') assert.ok(c.who === 'riffle' && c.pose === 'stand', where + ': Riffle’s string of fish');
      if (c.holds === 'pebbles') assert.ok(c.who === 'riffle' && (c.holdAt === undefined || c.holdAt === 'paws'), where + ': Riffle’s three pebbles');
      if (c.holdAt !== undefined) assert.ok(c.holds, where + ': holdAt goes with holds');
      if (c.holds !== undefined) assert.ok(['pinecone', 'string', 'pebbles'].includes(c.holds), where + ': ' + c.holds);
      if (c.tap !== undefined) {
        assert.ok(frames[id].scratch && frames[id].scratch.tap === c.tap, where + ': the tap mark is this page’s Tap');
        const WHO = { pinecone: ['grizzled'], paw: ['player'], stone: ['coil'], eyes: ['coil'], pebbles: ['riffle'], cheeks: ['riffle'], ears: ['player'] };
        assert.ok(WHO[c.tap].includes(c.who), where + ': ' + c.tap);
        if (c.tap === 'paw') assert.equal(c.pose, 'pawup', where);
        if (c.tap === 'stone') assert.equal(c.pose, 'stone', where);
        if (c.tap === 'cheeks') assert.equal(c.pose, 'puff', where);
        if (c.tap === 'pebbles') assert.equal(c.holds, 'pebbles', where);
      }
      if (c.starry) assert.ok(c.who === 'clancat' && s.set === 'sky', where + ': the starry cat is a Clan cat in the dream');
      if (c.grass) assert.ok(c.who === 'sleet' && !['hidden', 'tail'].includes(c.pose), where + ': the tuft on his head, once he shows it');
      if (c.asleep) assert.ok(c.who === 'grizzled' && id === story.start, where + ': the old tom asleep on guard');
      if (c.glow) assert.ok(c.who === 'tallyheart' && frames[id].ask, where + ': the one to tap is Tallyheart, on the page of her five Counts');
      if (c.puffed) assert.ok(['murmurchime', 'sloshbank'].includes(c.who), where + ': fur fluffed up at the border');
      if (c.wink) assert.equal(c.who, 'tallyheart', where);
      if (c.claws) assert.ok(isCat && c.pose === 'pawup', where + ': claws out on a raised paw');
      if (c.tear) assert.equal(c.who, 'sprinkle', where);
      if (c.purr) assert.ok(s.fx.includes('purr'), where + ': purr in a purr panel');
      const poses = isCat ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      if (typeof c.at === 'object') {
        assert.ok(Object.keys(c.at).every(k => ['x', 'y', 'h', 'z'].includes(k)) && 'x' in c.at && 'y' in c.at, where + ': a spot is { x, y } (with h and z, as the art gives them)');
        assert.ok(c.at.x >= 0 && c.at.x <= 1600 && c.at.y >= 0 && c.at.y <= 1000, where + ': the spot is in the world');
        // a spot of its own: the patrols along the top of the Hollow, the warrior coming down the slope, the
        // three-shot under the arch, Tallyheart across the nook while Coil talks (told), the ReedClan she-cat sitting on the young tom's tail, the first watch's
        // third cat beside Tallyheart behind the back row, the guards far off through the den's doorway
        const ok = (s.set === 'hollow' && (c.who === 'clancat' && PATROL.concat(PATROL2).some(p => same(p, c.at)) || c.who === 'murmurchime')) ||
          (s.set === 'bridge' && s.cam === 'under') || (s.set === 'bridge' && s.cam === 'back' && c.who === 'tallyheart' && same(c.at, { x: 1250, y: 900, h: 330 })) || (s.set === 'title' && s.cam === 'meet' && c.who === 'reedclan' && c.variant === 1) ||
          (s.set === 'pile' && s.cam === 'low' && c.who === 'murmurchime' && c.at.z === 'behind') ||
          (s.set === 'den' && s.cam === 'doorway' && c.who === 'clancat' && c.pose === 'walk');
        assert.ok(ok, where + ': a spot of its own');
      } else assert.ok(set.anchors.includes(c.at), where + ': set ' + s.set + ' has no anchor ' + c.at);
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      if (c.size !== undefined) assert.ok((c.who === 'tallyheart' && c.size === 1.2 && s.set === 'hollow' && c.at === 'tree-far') ||
        (c.who === 'coil' && c.size === 1.45 && s.set === 'bridge' && s.cam === 'back'), where + ': size, as chapter 5 has her past the tree, and Coil in the wide shot of the nook');
      if (c.variant !== undefined) {
        assert.ok(v.variants[c.who], where + ': only ' + Object.keys(v.variants).join('/') + ' have a variant');
        assert.ok(v.variants[c.who].includes(c.variant), where + ': variant ' + c.variant);
      } else assert.ok(!v.variants[c.who], where + ': a ' + c.who + ' says which one');
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), id + ': unknown fx ' + e));
    assert.ok(!s.fx.some(e => ['rain', 'lightning'].includes(e)), id + ': no storm today');
  });
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'claws', 'glow', 'grass', 'holdAt', 'holds', 'puffed', 'purr', 'starry', 'tap', 'tear', 'wink']);
  // the new cast, in their poses: all eight of Coil's, all nine of Sleet's, Riffle's puffed cheeks
  const posesOf = who => [...new Set(ids.flatMap(id => castOf(id, who).map(c => c.pose)))].sort();
  assert.deepEqual(posesOf('coil'), A.vocab.otherPoses.coil.slice().sort());
  assert.deepEqual(posesOf('sleet'), A.vocab.otherPoses.sleet.slice().sort());
  assert.ok(posesOf('riffle').includes('puff') && posesOf('riffle').includes('juggle'));
  assert.deepEqual([...new Set(ids.flatMap(id => castOf(id, 'reedclan').map(c => c.variant)))].sort(), [1, 2], 'the she-cat and the young tom; the other two coats are the watchers’ picture’s');
  // the skip-counts' and the lessons' pictures name only cast members, ReedClan by coat
  ids.filter(id => frames[id].skip && frames[id].skip.who).forEach(id => frames[id].skip.who.forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
  Object.values(story.counts).forEach(d => [].concat(d.who || []).concat(...d.facts.map(f => f.who || [])).forEach(w => {
    assert.ok(v.cast.includes(w.who), w.who);
    if (w.who === 'reedclan') assert.ok(v.variants.reedclan.includes(w.variant), 'a ReedClan coat');
  }));
  // every card has its drawing, and its mark is one the art knows
  Object.keys(story.cards).forEach(cid => { assert.ok(A.cardPictures[cid], 'a drawing for ' + cid); assert.ok(A.cardMarks.includes(story.cards[cid].mark), cid); });
});

/* ------------------------------------------------------------------ staging */

test('staging, the pile and the Hollow: the back row in shadow up to the count, then the gap and the dug earth; the pinecone under his chin, then at his paws; five marks and then six; the patrol along the top of the Hollow, above and behind the sitters, and a second at “More patrols”; Murmurchime comes down from the rim', () => {
  const ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  const morning = ids.filter(id => frames[id].scene.set === 'pile' && at(id) < at(SUNSET));
  assert.deepEqual(morning, ['f001', 'f002', 'f003', 'f004'], 'the chapter opens at the pile');
  morning.forEach(id => { assert.deepEqual(frames[id].scene.opts.rows, ROWS, id); assert.equal(frames[id].scene.opts.scale, 'behind', id); assert.equal(frames[id].scene.opts.moon, undefined, id); });
  morning.forEach(id => assert.equal(frames[id].scene.opts.back, at(id) <= at(PILE_COUNT) ? 'shadow' : undefined, id + ': the back row is a dark band up to the count'));
  morning.forEach(id => assert.equal(frames[id].scene.opts.dug, at(id) > at(PILE_COUNT) ? 'big' : undefined, id + ': then the gap and the dug earth'));
  assert.deepEqual([camOf('f001'), camOf(PILE_COUNT), camOf('f003'), camOf('f004')], ['pile/rows', 'pile/rows', 'pile/gap', 'pile/wide']);
  assert.equal(E.countsSet('ch06-pile', story, STORIES).picture.kind, 'prey', 'the Counts picture is the three front rows, never the frame’s scene');
  // the old tom: asleep on the pinecone at the left end of the rows; then awake, the pinecone at his paws
  assert.deepEqual(castOf('f001', 'grizzled').map(c => [c.at, c.pose, c.asleep, c.holds, c.holdAt, c.tap]), [['pile-left', 'lie', true, 'pinecone', 'chin', 'pinecone']]);
  assert.deepEqual(castOf(PILE_COUNT, 'grizzled').map(c => [c.at, c.asleep, c.holds, c.holdAt]), [['pile-left', undefined, 'pinecone', 'paws']]);
  const rowsX = A.sceneInfo('pile').anchors.rows;
  ['f001', PILE_COUNT].forEach(id => {
    assert.deepEqual(frames[id].scene.cast.map(c => [c.who, c.at]), [['tallyheart', 'crowd-3'], ['player', 'beside'], ['grizzled', 'pile-left']], id);
    assert.ok(rowsX['pile-left'].x < 400 && rowsX.beside.x > 1200 && rowsX['crowd-3'].x > 1200, id + ': the sleeper alone at the left, the snore lettered over him');
  });
  // Glintstar is at the pile for her morning count and at sunset, and nowhere else
  assert.deepEqual(ids.filter(id => castOf(id, 'glintstar').length), ['f004', SUNSET, F(/^We don’t blame what we haven’t seen\./), countsAt('ch06-guards')[0]]);
  assert.deepEqual(castOf('f004', 'glintstar').map(c => c.at), ['fountain-edge']);
  // the Hollow: chapter 5's rim; five marks until the sixth is scratched, six from then on, glowing as earned
  const hollow = ids.filter(id => frames[id].scene.set === 'hollow');
  assert.deepEqual(hollow, ids.slice(at('f005'), at('f019') + 1));
  hollow.forEach(id => { assert.equal(frames[id].scene.opts.marks, at(id) >= at(TREE) ? 6 : 5, id + ': marks'); assert.equal(frames[id].scene.opts.glow, 'auto', id); });
  assert.deepEqual([camOf(TREE), frames[TREE].sfx, frames[TREE].scene.cast], ['hollow/tree', 'SKRITCH!', []]);
  assert.match(frames[TREE].board, /a sixth claw mark into the bark, beside the fifth, in the second row under the first three;/);
  // the sixth Count is said where the six marks show (the `lesson` camera sees only the edge of the trunk)
  assert.equal(camOf(F(/^Patrols\. That’s your sixth Count\./)), 'hollow/wide');
  const rimOf = id => RIM_ANCHORS.map(a => frames[id].scene.cast.find(c => c.at === a)).filter(Boolean);
  const warm = countsAt('ch06-nines')[0];
  assert.deepEqual(rimOf(warm).map(c => [c.who, c.variant, c.pose]), [['clancat', 1, 'situp'], ['murmurchime', undefined, 'situp'], ['clancat', 3, 'situp'], ['clancat', 5, 'situp'], ['grizzled', undefined, 'situp']]);
  assert.deepEqual(E.countsSet('ch06-nines', story, STORIES).facts[1].who, rimOf(warm).slice(0, 3).map(c => (c.variant ? { who: c.who, variant: c.variant } : { who: c.who })), '3 × 9 is the first three rim cats in the picture');
  hollow.filter(id => frames[id].scene.cam === 'wide').forEach(id => rimOf(id).forEach(c => assert.equal(c.pose, 'situp', id + ': the rim sits up')));
  // she is on the rim until Tallyheart calls a warrior, then bounds down the slope and sits with them on the sand
  const call = F(/I need a warrior!/), down = F(/bounds down\./);
  hollow.filter(id => at(id) <= at(call) && frames[id].scene.cam === 'wide').forEach(id => assert.deepEqual(castOf(id, 'murmurchime').map(c => c.at), ['rim-2'], id));
  hollow.filter(id => at(id) >= at(down)).forEach(id => assert.ok(!rimOf(id).some(c => c.who === 'murmurchime'), id + ': her place on the rim is empty'));
  assert.deepEqual(castOf(down, 'murmurchime').map(c => [c.pose, typeof c.at]), [['walk', 'object']]);
  // the patrol: three Clan cats on a line of their own along the top of the Hollow, behind the sitters, never a
  // sitter's coat; from “More patrols stop on the path to watch.” a second patrol of three, stopped at the left
  const patrolFrames = hollow.filter(id => frames[id].scene.cast.some(c => typeof c.at === 'object' && c.who === 'clancat'));
  const MORE = countsAt('ch06-four')[0];
  assert.deepEqual(patrolFrames, [F(/a patrol trots by/), MORE, ids.find(id => frames[id].skip && frames[id].skip.groups === 5)]);
  assert.match(T(MORE), /^More patrols stop on the path to watch\.$/);
  patrolFrames.forEach((id, i) => {
    const p = frames[id].scene.cast.filter(c => typeof c.at === 'object');
    assert.deepEqual(p.map(c => c.at), i ? PATROL2.concat(PATROL) : PATROL, id + (i ? ': two patrols, so “More patrols” is true' : ': one patrol'));
    assert.deepEqual(p.map(c => c.variant), i ? [6, 2, 4, 2, 4, 6] : [2, 4, 6], id + ': coats none of the rim’s, and no two of one coat side by side');
    assert.ok(p.every(c => c.mood !== 'sleepy'), id);
  });
  assert.deepEqual(frames[patrolFrames[0]].scene.cast.filter(c => typeof c.at === 'object').map(c => [c.pose, c.mood, c.facing]), [['walk', 'proud', 'right'], ['walk', 'proud', 'right'], ['walk', 'proud', 'right']], 'trotting by, tails up');
  // the patrols read apart: the gap between the two is far wider than a patrol's own spacing
  assert.ok(PATROL[0].x - PATROL2[2].x > 1.5 * Math.max(PATROL[1].x - PATROL[0].x, PATROL2[1].x - PATROL2[0].x), 'a clear gap between the two patrols');
  // and never in the clump: every walker's feet are above every sitter's head (in world units, as drawn), and
  // every walker's head is above the sitters' heads by more than a head
  patrolFrames.forEach(id => {
    const sc = frames[id].scene, r = A.render(sc, { look: { fur: 'calico' } });
    const heads = sc.cast.map((c, i) => r.heads[i] && { c, x: r.heads[i].x * 16, y: r.heads[i].y * 10, r: r.heads[i].r * 16 });
    const walkers = heads.filter(h => h && typeof h.c.at === 'object'), sitters = heads.filter(h => h && RIM_ANCHORS.includes(h.c.at));
    assert.equal(sitters.length, 5, id + ': the five on the rim');
    walkers.forEach(w => sitters.forEach(s => {
      assert.ok(w.c.at.y < s.y - s.r, id + ': a walker’s feet (' + w.c.at.y + ') above the ' + s.c.who + ' at ' + s.c.at + '’s head (' + Math.round(s.y - s.r) + ')');
      assert.ok(s.y - w.y > w.r + s.r, id + ': a walker’s head clear above the ' + s.c.who + ' at ' + s.c.at + '’s');
    }));
  });
  // Tallyheart's five Counts: she glows as the asker, on `lesson`, with the five marks; the lesson there too
  const ask = ids.find(id => frames[id].ask);
  assert.deepEqual([camOf(ask), frames[ask].scene.opts.marks, castOf(ask, 'tallyheart')[0].glow], ['hollow/lesson', 5, true]);
  assert.equal(camOf(countsAt('ch06-threes')[0]), 'hollow/lesson');
});

test('staging, the wall and the border: three cats walk the wall facing right toward the reeds, the leader rightmost; three and three at the line, nobody over it; Sloshbank’s drips; the young tom waves back', () => {
  const wall = ids.filter(id => frames[id].scene.set === 'title' && frames[id].scene.cam === 'wide');
  assert.deepEqual(wall, ['f020', 'f021', 'f022a', 'f022b', WAY_HOME, 'f042', 'f043']);
  wall.forEach(id => { assert.deepEqual(frames[id].scene.fx, ['day'], id); assert.deepEqual(frames[id].scene.cast.map(c => c.at).sort(), ['wall', 'wall-2', 'wall-3'], id + ': three cats on the wall'); });
  // walking to the border: facing right, the leader at `wall-3`
  [WALL, 'f022a', 'f022b'].forEach(id => frames[id].scene.cast.forEach(c => assert.deepEqual([c.pose, c.facing], ['walk', 'right'], id + ': ' + c.who)));
  const order = id => ['wall-3', 'wall', 'wall-2'].map(a => frames[id].scene.cast.find(c => c.at === a).who);
  assert.deepEqual(order(WALL), ['tallyheart', 'player', 'murmurchime']);
  assert.deepEqual(order('f022a'), ['player', 'tallyheart', 'murmurchime'], 'Lead the way!: our cat in front, Tallyheart right behind');
  assert.deepEqual(order('f022b'), ['tallyheart', 'player', 'murmurchime'], 'Walk in the middle: the tortoiseshell behind her');
  // walking home, the other way: the tortoiseshell in front (at `wall-2`, where she runs off from next) turned
  // back to hear her errand, our cat at the back (at `wall-3`, where Tallyheart turns to it next): nobody
  // changes ends between the panels
  assert.deepEqual(frames[WAY_HOME].scene.cast.map(c => [c.who, c.at, c.facing]), [['murmurchime', 'wall-2', 'right'], ['tallyheart', 'wall', 'left'], ['player', 'wall-3', 'left']]);
  ['f042', 'f043'].forEach(id => assert.deepEqual(['murmurchime', 'player'].map(w => castOf(id, w)[0].at), ['wall-2', 'wall-3'], id));
  // the border: day; our three at `end-*` facing right, ReedClan at `reed-*` facing left (Sloshbank nearest
  // the line, the young tom, the she-cat); the rustle once, before anybody steps out
  const border = ids.filter(id => frames[id].scene.set === 'title' && frames[id].scene.cam !== 'wide');
  assert.deepEqual(border, ids.slice(at('f023'), at(WAVE) + 1));
  border.forEach(id => {
    assert.deepEqual(frames[id].scene.fx, ['day'], id);
    const s = frames[id].scene;
    s.cast.filter(c => typeof c.at === 'string' && /^end-/.test(c.at)).forEach(c => assert.ok(['player', 'tallyheart', 'murmurchime'].includes(c.who) && c.facing === 'right', id + ': ' + c.who));
    // (at the fair question the she-cat sits pressed against the young tom's rear, on his tail: a spot of
    // her own between his and `reed-3`, whole in the panel)
    const spot = a => { const m = s.cast.find(c => c.at === a); return m ? m.who + (m.variant ? m.variant : '') : null; };
    if (id === FAIR) {
      assert.deepEqual(['reed-1', 'reed-2', 'reed-3'].map(spot), ['sloshbank', 'reedclan2', null], id);
      const she = s.cast.find(c => c.who === 'reedclan' && c.variant === 1), M = A.sceneInfo('title').anchors.meet;
      assert.ok(typeof she.at === 'object' && she.at.x > M['reed-2'].x && she.at.x < M['reed-3'].x && she.facing === 'left', id + ': the she-cat on the young tom\'s tail');
      assert.deepEqual([she.mood, castOf(id, 'reedclan').find(c => c.variant === 2).mood], ['neutral', 'wonder'], id + ': she is calm; his eyes go round');
    } else if (id !== WAVE && id !== 'f023') assert.deepEqual(['reed-1', 'reed-2', 'reed-3'].map(spot), ['sloshbank', 'reedclan2', 'reedclan1'], id);
    if (id !== WAVE) s.cast.filter(c => /^reed-/.test(c.at)).forEach(c => assert.equal(c.facing, 'left', id + ': ' + c.who));
    assert.equal(s.opts.rustle, id === 'f023' || id === WAVE ? true : undefined, id + ': rustle');
    // our three in the same places all through: our cat nearest the line, Tallyheart, the tortoiseshell
    if (id !== WAVE) assert.deepEqual(['end-1', 'end-2', 'end-3'].map(a => s.cast.find(c => c.at === a).who), ['player', 'tallyheart', 'murmurchime'], id);
  });
  assert.equal(castOf('f023', 'sloshbank').length, 0, 'nobody seen in the reeds yet');
  assert.equal(camOf(STEP_OUT), 'title/end');
  // the watchers' Counts frame shows the reeds they watched from, with her and Sloshbank in it for the right lines
  const watch = countsAt('ch06-watchers')[0];
  assert.ok(castOf(watch, 'player').length && castOf(watch, 'sloshbank').length && castOf(watch, 'tallyheart').length);
  // the drips are Sloshbank's, lettered by his belly, wherever they fall (four panels, all at cat height)
  assert.deepEqual(ids.filter(id => /^Drip\./.test(frames[id].sfx || '')), ['f025', 'f030', ADMIT, 'f039']);
  assert.deepEqual(frames.f025.sfx, 'Drip. Drip.');
  // her fur fluffed at “What is ReedClan after?”, his at the unfair question
  assert.ok(castOf('f030', 'murmurchime')[0].puffed && castOf(UNFAIR[0], 'sloshbank')[0].puffed);
  assert.equal(castOf(ADMIT, 'sloshbank')[0].mood, 'sad', 'the admission');
  // the wave: the reeds have closed behind Sloshbank and the she-cat (rustle lines where they went in, nobody
  // seen, as at f023), the young tom looking back with a paw up; our cat already waving
  assert.deepEqual(castOf(WAVE, 'reedclan').map(c => [c.variant, c.pose, c.facing, c.at]), [[2, 'pawup', 'left', 'reed-1']]);
  assert.deepEqual(castOf(WAVE, 'sloshbank'), [], 'gone into the reeds');
  assert.match(frames[WAVE].board, /^WIDE, THE BORDER, THE TAP PICTURE\. ReedClan’s patrol has gone back into its reeds, the stems still swaying with rustle lines/);
  assert.deepEqual(castOf(WAVE, 'player').map(c => [c.pose, c.tap, c.at]), [['pawup', 'paw', 'end-1']]);
  assert.deepEqual(castOf(WAVE, 'murmurchime').map(c => c.mood), ['proud'], 'her tail waves too');
});

test('staging, the fox trail and the last post: Riffle’s string of fish from the Barking Field to the bridge; the dogs; Sleet past the post in his long grass, a tail, then bent grass, then all of him; the fox never drawn', () => {
  const field = ids.filter(id => frames[id].scene.set === 'field');
  assert.deepEqual(field, ids.slice(at(BARKING), at(BRIDGE)));
  field.forEach(id => assert.deepEqual(frames[id].scene.fx, ['day'], id));
  assert.deepEqual([camOf(BARKING), camOf(F(/BYE, WET SQUIRREL!/))], ['field/fence', 'field/dogs']);
  assert.deepEqual(castOf(F(/BYE, WET SQUIRREL!/), 'dog').map(c => c.variant), [3, 1, 2], 'the tiny dog first: his is the balloon');
  ids.filter(id => castOf(id, 'dog').length).forEach(id => assert.equal(camOf(id), 'field/dogs', id));
  // the string of fish: in Riffle's paw from the Barking Field to the bridge, eaten in the three-shot under the arch
  const fish = F(/^FISH!/);
  ids.filter(id => castOf(id, 'riffle').some(c => c.holds === 'string')).forEach(id => assert.ok(at(id) >= at(BARKING) && at(id) <= at(fish), id));
  ids.filter(id => at(id) >= at(BARKING) && at(id) <= at(fish) && castOf(id, 'riffle').length).forEach(id => assert.equal(castOf(id, 'riffle')[0].holds, 'string', id + ': he has the fish for Sprinkle'));
  // Sleet: a tail at the choice (and at “HMPH!”), bent grass at “PSST!”, then all of him; always at `grass`;
  // the grass tuft on his head once he shows himself
  assert.deepEqual(castOf(TRAIL, 'sleet').map(c => [c.pose, c.at]), [['tail', 'grass']]);
  NOT.forEach(id => assert.deepEqual(castOf(id, 'sleet').map(c => [c.pose, c.at]), [['tail', 'grass']], id));
  assert.deepEqual(SLEET.map(id => (castOf(id, 'sleet')[0] || {}).pose || '-'),
    ['-', '-', 'hidden', 'flat', 'point', 'point', 'point', 'call', 'sit', 'sit', 'puff', 'droop', 'sit', 'sit', 'sit', 'sit', 'sit', 'flat', 'flat', 'pawup']);
  SLEET.filter(id => castOf(id, 'sleet').length && !['hidden', 'tail'].includes(castOf(id, 'sleet')[0].pose)).forEach(id => assert.equal(castOf(id, 'sleet')[0].grass, true, id + ': grass on his head'));
  // the close shots of him are `border-fox` (none of Tallyheart's spots in them; our cat's face at the near
  // edge); the panels where the Clan's spots show are `border-two`, by path
  SLEET.forEach(id => {
    const cam = frames[id].scene.cam;
    assert.ok(['border-two', 'border-fox'].includes(cam), id);
    if (cam === 'border-two') assert.ok(frames[id].when, id + ': her spot is in the picture, so the panel is by path');
    else assert.ok(!frames[id].when && !castOf(id, 'tallyheart').length && !castOf(id, 'riffle').length, id + ': a close shot, the same on both paths');
  });
  // our cat at the post's foot, never past it; Riffle beside her on every path, Tallyheart on the told path
  SLEET.filter(id => frames[id].scene.cam === 'border-two').forEach(id => {
    assert.deepEqual(castOf(id, 'player').map(c => c.at), ['lead'], id);
    assert.deepEqual(castOf(id, 'riffle').map(c => c.at), ['right'], id);
    assert.deepEqual(castOf(id, 'tallyheart').map(c => c.at), same(frames[id].when, TOLD) ? ['left'] : [], id);
  });
  // the told path's “Not one paw past the post” is Tallyheart's; the kept path's Riffle's
  assert.deepEqual([SLEET[0], SLEET[1]].map(id => frames[id].say.map(b => b.who)), [['tallyheart'], ['riffle']]);
  // the fox is never drawn, in this set or any other
  ids.forEach(id => assert.ok(!frames[id].scene.cast.some(c => c.who === 'reynard'), id));
  assert.equal(field.filter(id => frames[id].scene.opts.foxTail).length, 0, 'not even his tail');
});

test('staging, under the Old Bridge: the stone leg on every `back` panel and Coil only at his gap; `wall` its own picture with none of Tallyheart’s spots; Coil a stone, a head, more of him, and back into the stones; the pebbles; no juggling after Otter’s honor', () => {
  const bridge = ids.filter(id => frames[id].scene.set === 'bridge');
  assert.deepEqual(bridge, ids.slice(at(BRIDGE), at(SUNSET)));
  bridge.forEach(id => assert.deepEqual(frames[id].scene.fx, ['day'], id));
  bridge.filter(id => frames[id].scene.cam === 'back').forEach(id => { assert.equal(frames[id].scene.opts.stones, true, id + ': the stone leg'); assert.equal(frames[id].scene.opts.prints, true, id + ': her prints'); });
  bridge.filter(id => frames[id].scene.cam === 'under').forEach(id => assert.deepEqual(frames[id].scene.opts, { prints: true }, id));
  bridge.filter(id => frames[id].scene.cam === 'wall').forEach(id => assert.ok(same(frames[id].scene.opts, {}) || same(frames[id].scene.opts, { train: true }), id));
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.train), [F(/A whole train rumbles over\./)]);
  // the branch for a cat who told, the eyes for one who kept
  assert.deepEqual([frames[BRIDGE].when, frames[BRIDGE].scene.opts.branch, castOf(BRIDGE, 'sprinkle')[0].pose, frames.f070.when, frames.f070.scene.opts.eyes, castOf('f070', 'sprinkle').length], [TOLD, true, 'peek', KEPT, 'sprinkle', 0]);
  bridge.filter(id => id !== BRIDGE).forEach(id => assert.equal(frames[id].scene.opts.branch, undefined, id));
  // Coil: at his gap only, on `wall` or on `back` with the leg; from the voice to the slide, and not before or after
  const coil = bridge.filter(id => castOf(id, 'coil').length);
  assert.deepEqual([coil[0], coil[coil.length - 1]], [HELLO, SLIDES]);
  assert.deepEqual(bridge.slice(at(HELLO) - at(BRIDGE), at(SLIDES) - at(BRIDGE) + 1), coil, 'in every panel under the bridge from the voice to the slide');
  coil.forEach(id => assert.ok(frames[id].scene.cam === 'wall' || frames[id].scene.opts.stones === true, id));
  const pose = id => castOf(id, 'coil')[0].pose;
  assert.deepEqual([pose(HELLO), pose(F(/^You look round\. Only stones\./)), pose(F(/^It isn’t a stone\./)), pose(F(/^Then more of him\./)), pose(SLIDES)], ['stone', 'stone', 'head', 'longer', 'slide']);
  assert.equal(pose(F(/^How long were you listening\?/)), 'listen', 'his chin on the floor: feeling footsteps');
  assert.equal(pose(F(/^Coil thinks about it\./)), 'think');
  // Coil's beats are on `wall`, or on `back` with the leg by path; the told path's own two on `back`
  coil.filter(id => frames[id].scene.cam === 'back').forEach(id => assert.ok(frames[id].when, id + ': Tallyheart’s spots are in the picture, so the panel is by path'));
  coil.filter(id => frames[id].scene.cam === 'wall').forEach(id => {
    assert.ok(!castOf(id, 'tallyheart').length, id);
    assert.deepEqual(frames[id].scene.cast.map(c => c.who + '@' + c.at), ['coil@gap', 'player@back-left', 'riffle@back-right', 'sprinkle@dragon'], id + ': our cat, Riffle, Sprinkle’s head at the edge');
    // (as the voice says hello she has her back to the wall, telling the border; then she looks round)
    assert.equal(castOf(id, 'player')[0].facing, id === HELLO ? 'right' : 'left', id + ': our cat faces the gap');
  });
  // Tallyheart under the bridge only on the told path
  bridge.forEach(id => { if (castOf(id, 'tallyheart').length) assert.deepEqual(frames[id].when, TOLD, id); });
  assert.deepEqual(bridge.filter(id => castOf(id, 'tallyheart').length).map(camOf).filter((v, i, a) => a.indexOf(v) === i).sort(), ['bridge/back', 'bridge/bank']);
  // Riffle: juggling as the voice says hello; then pebbles in his paws until he puts them down for the snake, and
  // at his feet from then on; never juggling again under the bridge (Otter's honor)
  const honor = F(/^Otter’s honor\.$/), down = ids.find(id => frames[id].scratch && frames[id].scratch.tap === 'pebbles');
  assert.deepEqual(ids.filter(id => castOf(id, 'riffle').some(c => c.pose === 'juggle')), [HELLO]);
  coil.filter(id => at(id) > at(HELLO)).forEach(id => assert.deepEqual(castOf(id, 'riffle').map(c => [c.holds, c.holdAt]), [['pebbles', at(id) > at(down) ? 'paws' : undefined]], id));
  assert.ok(at(honor) === at(down) + 1);
  // the way out: his cheeks at the mouth of the bridge, the bang on the bank
  assert.deepEqual([camOf(ids.find(id => frames[id].scratch && frames[id].scratch.tap === 'cheeks')), F2(/^On the bank, he bursts\./).map(camOf)], ['bridge/mouth', ['bridge/bank', 'bridge/bank']]);
});

test('the picture matches its lines (the build review): the first watch side by side, everyone turned to Riffle, no tail over a face, faces that fit what is said', () => {
  // “Tallyheart’s tail tickles her nose.”: {Murmur}chime beside Tallyheart behind the back row, the two facing
  // the same way so Tallyheart's tail is on her side, and still there on the next panel (the first watch is three)
  const tickle = F(/^Tallyheart’s tail tickles her nose\./), next = exits(frames[tickle])[0];
  const pile = A.sceneInfo('pile').anchors.low, behind = pile.behind;
  for (const id of [tickle, next]) {
    const m = castOf(id, 'murmurchime')[0], t = castOf(id, 'tallyheart')[0];
    assert.ok(m && t && t.at === 'behind', id + ': both on the watch');
    assert.ok(typeof m.at === 'object' && m.at.y === behind.y && m.at.h === behind.h && m.at.z === 'behind', id + ': on `behind`\'s line, behind the rows');
    assert.ok(Math.abs(m.at.x - behind.x) < 150, id + ': side by side: ' + (m.at.x - behind.x));
    assert.equal(m.facing, t.facing, id + ': facing the same way');
    assert.ok(t.facing === 'right' ? m.at.x < behind.x : m.at.x > behind.x, id + ': on the side her tail is');
  }
  assert.equal(castOf(tickle, 'murmurchime')[0].mood, 'sleepy', 'nodding off');
  // “Everybody looks at Riffle.”: every cat in the nook faces him (Sprinkle's long tail would swing across our cat)
  F2(/^Everybody looks at Riffle\./).forEach(id => {
    const riffle = castOf(id, 'riffle')[0];
    assert.equal(riffle.at, 'back-right', id);
    ['player', 'tallyheart'].forEach(w => castOf(id, w).forEach(c => assert.equal(c.facing, 'right', id + ': ' + w + ' turns to Riffle')));
  });
  // at sunset the apprentice at `crowd-2` faces Glintstar and Tallyheart, so his tail falls away from her face;
  // Tallyheart stands with her tail wrapped (`kind`), off the old tom's head
  [SUNSET, countsAt('ch06-guards')[0]].forEach(id => assert.equal(castOf(id, 'snorter')[0].facing, 'right', id));
  assert.deepEqual(castOf(countsAt('ch06-guards')[0], 'tallyheart').map(c => [c.pose, c.mood]), [['stand', 'kind']]);
  // faces that fit the line: a whisper is a smile, not a guffaw; Sleet's round bold eyes at the last post;
  // half-shut eyes as she curls up to sleep; he stands tall for a cat whose worry is small; walking out of the dark together
  assert.equal(castOf(F(/The eldest\. And the bossiest\./), 'tallyheart')[0].mood, 'happy');
  F2(/^Come with us\?/).forEach(id => assert.deepEqual(castOf(id, 'sleet').map(c => [c.pose, c.mood]), [['flat', 'stern']], id));
  assert.deepEqual(castOf(F(/You curl up tight, and sleep\./), 'player').map(c => [c.pose, c.mood]), [['curl', 'solemn']], 'half-shut lids (`solemn`), not wide open');
  assert.deepEqual(castOf(F(/Sloshbank\. Tallyheart\.$/), 'player').map(c => [c.pose, c.mood]), [['stand', 'proud']], 'You stand up tall anyway.');
  assert.match(frames[F(/Sloshbank\. Tallyheart\.$/)].board, /Our cat stands very straight/);
  const out = F(/^Riffle doesn’t say one word all the way out\./);
  assert.deepEqual(frames[out].scene.cast.map(c => c.facing), ['right', 'right'], 'both walking out into the daylight');
  // Riffle in the nook with Sprinkle at `dragon` stands, so her long tail passes under him (seated at
  // `back-right`, its tip ran into his chest)
  ids.filter(id => camOf(id) === 'bridge/back' && castOf(id, 'sprinkle').some(c => c.at === 'dragon')).forEach(id =>
    castOf(id, 'riffle').filter(c => c.at === 'back-right').forEach(c => assert.notEqual(c.pose, 'sit', id + ': seated, her tail runs into him')));
  // Coil's balloons point at Coil (the final review): his head is a small one at the panel's left, and a single
  // balloon has no speaker label, so its tail is the only cue to who talks. Tallyheart is never at `near` (right
  // in front of his gap) when he speaks: on the told path she sits across the nook, in front of Sprinkle's tail,
  // drawn after Sprinkle and before Riffle; and in every frame where he speaks no other face is between him and
  // the panel's left edge or close beside him, so no tail of his can run across one
  const coilSays = ids.filter(id => (frames[id].say || []).some(b => b.who === 'coil'));
  assert.ok(coilSays.length >= 20, coilSays.length + ' frames where Coil speaks');
  coilSays.forEach(id => {
    castOf(id, 'tallyheart').forEach(c => assert.notEqual(c.at, 'near', id + ': Tallyheart at `near`, between his gap and his balloons'));
    const sc = frames[id].scene, r = A.render(sc, {}), ci = sc.cast.findIndex(c => c.who === 'coil'), ch = r.heads[ci];
    sc.cast.forEach((c, i) => { if (i !== ci && r.heads[i] && r.heads[i].r) assert.ok(r.heads[i].x - ch.x >= 15, id + ': ' + c.who + '’s face ' + (r.heads[i].x - ch.x).toFixed(1) + '% from his'); });
  });
  const across = ids.filter(id => camOf(id) === 'bridge/back' && coilSays.includes(id) && castOf(id, 'tallyheart').length);
  assert.equal(across.length, 8, 'the told path’s eight nook panels where he speaks with her there');
  across.forEach(id => {
    const cast = frames[id].scene.cast, w = cast.map(c => c.who);
    assert.deepEqual(castOf(id, 'tallyheart')[0].at, { x: 1250, y: 900, h: 330 }, id + ': across the nook');
    assert.ok(w.indexOf('sprinkle') < w.indexOf('tallyheart') && w.indexOf('tallyheart') < w.indexOf('riffle'), id + ': over Sprinkle’s tail, under Riffle');
    assert.doesNotMatch(frames[id].board, /near wall/, id + ': the board says where she is');
  });
  // the arrival, where he says nothing, keeps her by the near wall
  assert.equal(castOf(F(/two big eyes peek over Tallyheart’s branch/), 'tallyheart')[0].at, 'near');
  // the second watch: no ginger coat beside Tallyheart, who is the ginger one (a ginger-and-white guard there
  // read as two Tallyhearts in the dark)
  const second = F(/three yawning cats come for the second watch/);
  assert.deepEqual(castOf(second, 'clancat').map(c => c.variant), [2, 4, 3], 'black, grey and cream');
  castOf(second, 'clancat').forEach(c => assert.notEqual(c.variant, 6, second + ': no ginger-and-white guard'));
});

test('the lines the final review sharpened: who still sounds surprised, the loud whisper, and the snoring after eighteen', () => {
  // the panel after “I’m a WARRIOR!” opens with a caption and only Tallyheart's balloon: it names {Murmur}chime
  const warrior = F(/I’m a WARRIOR!/), after = exits(frames[warrior])[0];
  assert.deepEqual(frames[after].caption, ['{Murmur}chime still sounds surprised.']);
  assert.deepEqual(frames[after].say.map(b => b.who), ['tallyheart']);
  // Sleet's first balloon is a whisper; the joke is that it is a loud one, so the words say so first
  F2(/I’m spying on the ENEMY\./).forEach(id => {
    assert.deepEqual(frames[id].caption, ['He whispers, very loudly:'], id);
    assert.deepEqual([frames[id].say[0].who, frames[id].say[0].kind], ['sleet', 'whisper'], id);
  });
  // the bedtime count ends on a big 18 with the grey tom still talking, so the next panel never says he was
  // snoring by eighteen
  const bed = ids.find(id => frames[id].skip && frames[id].skip.groups === 6 && frames[id].skip.table === 3), big = frames[bed].skip.next;
  assert.deepEqual(frames[big].say.map(b => b.who), ['snorer'], 'he speaks on the 18 panel');
  const sleep = frames[big].next;
  assert.deepEqual(frames[sleep].caption, ['Soon he’s snoring. And then, so are you.']);
  everyText((id, x) => assert.doesNotMatch(x.text, /By eighteen/, id + ' ' + x.where));
  // and the spec says the rule as built: the 3s are learned at the lesson, not one screen early
  const spec = fs.readFileSync(path.join(ROOT, 'docs/chapters/06-the-snake-in-the-stones.spec.md'), 'utf8');
  assert.doesNotMatch(spec, /one screen early/);
  assert.match(spec, /8\. \*\*Four patrols at `table: 3`\*\*[^]*?the 3s are learned at the\s+lesson: section 6/);
});

test('the guards, missed three times: the last line is the help’s, and the next panel still opens with the old tom’s “Then I can SLEEP.”, so Tallyheart’s “You can. In your NEST.” answers a line she read', () => {
  const c = ninesCat(); play(c, 'ch06-threes');
  const g = play(c, 'ch06-guards', { '3x6': [17, 17, 17] });
  assert.equal(g[g.length - 1].line, 'There. Now you’ve seen it counted.');
  assert.ok(!g.some(x => x.balloons.some(b => /SLEEP/.test(b.text))), 'the right line never came');
  const after = frames[countsAt('ch06-guards')[0]].counts.next;
  assert.deepEqual(frames[after].say.slice(0, 2).map(b => b.who + ': ' + b.text), ['grizzled: Then I can SLEEP.', 'tallyheart: You can. In your NEST.']);
  assert.ok(castOf(after, 'grizzled').length, 'he is in the picture');
  // a right answer: “Eighteen!” over the question, and the same panel after
  const r = play(ninesCat(), 'ch06-guards');
  assert.deepEqual(r[r.length - 1].balloons.map(b => b.text), ['Eighteen!']);
});

test('staging, sunset to night at the pile, and the den: forty pieces in four rows; the sixth evening’s moon from the moment it comes out, on `wide` and `low` only; Tallyheart at the back; the pinecone on the watch; today’s bark along her nest, Coil’s under the moss', () => {
  const eve = ids.filter(id => frames[id].scene.set === 'pile' && at(id) >= at(SUNSET));
  assert.deepEqual(eve, ids.slice(at(SUNSET), at(NEST)));
  eve.forEach(id => { assert.deepEqual(frames[id].scene.opts.rows, [10, 10, 10, 10], id + ': forty pieces'); assert.equal(frames[id].scene.opts.dug, 'big', id); assert.equal(frames[id].scene.opts.scale, 'behind', id); });
  eve.forEach(id => assert.equal(frames[id].scene.opts.moon, at(id) >= at(MOONRISE) ? 6 : undefined, id + ': moon'));
  eve.filter(id => frames[id].scene.opts.moon).forEach(id => assert.ok(['wide', 'low'].includes(frames[id].scene.cam) && frames[id].scene.fx.includes('night'), id));
  assert.equal(camOf(MOONRISE), 'pile/wide', 'the moon comes out in the open sky');
  // the guards' Counts frame: Tallyheart says it, the old tom has the right line
  const guards = countsAt('ch06-guards')[0];
  assert.ok(castOf(guards, 'tallyheart').length && castOf(guards, 'grizzled').length);
  // she takes the back, to look: from there on she is at `behind` until the second watch comes
  const back = F(/^She takes the back, to look\./), second = F(/^And off he shuffles\./);
  eve.filter(id => at(id) >= at(back) && at(id) < at(second)).forEach(id => assert.deepEqual(castOf(id, 'tallyheart').map(c => c.at), ['behind'], id));
  assert.equal(camOf(back), 'pile/gap', 'the back row, close');
  // the watch: our cat at the front, the tortoiseshell walking round, the old tom shuffling out with the pinecone in his mouth
  assert.deepEqual(castOf(F(/^Out shuffles the old tom/), 'grizzled').map(c => [c.pose, c.holds, c.holdAt]), [['walk', 'pinecone', 'mouth']]);
  assert.deepEqual(castOf(MOONRISE, 'murmurchime').map(c => c.pose), ['walk']);
  eve.filter(id => at(id) >= at(MOONRISE)).forEach(id => assert.equal(castOf(id, 'player')[0].at, 'pile-left', id + ': at the front'));
  // the den: night, no moon, her stone where she put it, her bark along the nest and the secrets under the moss
  const den = ids.filter(id => frames[id].scene.set === 'den');
  assert.deepEqual(den, [NEST, 'f120', 'f121', 'f122', 'f123', 'f129', 'f130', 'f131', 'f132']);
  den.forEach(id => {
    const o = frames[id].scene.opts;
    assert.deepEqual([o.weather, o.moon, o.stone, o.bark, o.hidden], ['clear', false, 'auto', 'auto', true], id);
    assert.ok(frames[id].scene.fx.includes('night'), id);
    castOf(id, 'player').forEach(c => assert.deepEqual([c.at, c.facing], ['nest', 'left'], id));
    assert.equal(castOf(id, 'tallyheart').length, 0, id);
  });
  assert.deepEqual(castOf(NEST, 'player').map(c => c.pose), ['lie'], 'lying, so the stone is by her nose or under her chin');
  const bed = ids.find(id => frames[id].skip && frames[id].skip.groups === 6);
  assert.equal(camOf(bed), 'den/nest');
  assert.ok(frames[F(/^Soon he’s snoring\./)].scene.fx.includes('zzz'));
  // the end is warm: in her nest, the Sky River through the doorway
  const end = frames[ids[ids.length - 1]];
  assert.ok(end.scene.fx.includes('night') && end.scene.fx.includes('skyriver'));
  assert.ok(end.scene.cast.some(c => c.who === 'player' && c.at === 'nest'), 'she is in her nest');
  assert.match(end.caption.join(' '), /warm/);
  assert.equal(end.caption[end.caption.length - 1], 'End of Chapter Six.');
  // the dream: the Sky River underfoot and the starry cat further along; then the tower far below, nobody on its balcony
  const sky = ids.filter(id => frames[id].scene.set === 'sky');
  assert.deepEqual(sky.map(camOf), ['sky/walk', 'sky/walk', 'sky/walk', 'sky/walk', 'sky/walk', 'sky/below']);
  sky.filter(id => frames[id].scene.cam === 'walk').forEach(id => assert.equal(castOf(id, 'player')[0].at, 'star-1', id));
  sky.filter(id => castOf(id, 'clancat').length).forEach(id => assert.deepEqual(castOf(id, 'clancat').map(c => [c.at, c.starry]), [['star-2', true]], id));
  assert.deepEqual(frames[sky[sky.length - 1]].scene.cast, [], 'nobody on the balcony');
  assert.deepEqual([castOf('f127a', 'clancat')[0].purr, frames.f127a.scene.fx.includes('purr'), castOf('f127b', 'clancat')[0].pose], [true, true, 'peer']);
});

test('the time of day runs morning (the pile, the Hollow), day (the wall, the border, the Barking Field, the bridge), sunset, dusk and night (the pile), night (the den and the dream)', () => {
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    const tods = p.map(id => {
      const t = frames[id].scene.fx.filter(e => TOD.includes(e));
      assert.equal(t.length, 1, id + ': exactly one time of day in fx');
      return TOD.indexOf(t[0]);
    });
    for (let i = 1; i < p.length; i++) assert.ok(tods[i] >= tods[i - 1], p[i] + ' goes back in time');
  }
  const tod = id => frames[id].scene.fx.find(e => TOD.includes(e));
  const BY_SET = { pile: ['morning', 'sunset', 'dusk', 'night'], hollow: ['morning'], title: ['day'], field: ['day'], bridge: ['day'], den: ['night'], sky: ['night'] };
  ids.forEach(id => assert.ok(BY_SET[frames[id].scene.set].includes(tod(id)), id + ': ' + frames[id].scene.set + ' at ' + tod(id)));
  assert.equal(tod(story.start), 'morning');
  assert.match(T(story.start), /^At sunrise/);
  assert.equal(tod(SUNSET), 'sunset');
  assert.match(T(SUNSET), /^At sunset/);
  assert.deepEqual(ids.filter(id => tod(id) === 'dusk'), [F(/First watch\. Me,/), F(/^She takes the back, to look\./)]);
  assert.equal(tod(MOONRISE), 'night');
  assert.ok(frames[ids[ids.length - 1]].scene.fx.includes('night'), 'it ends at night');
  assert.deepEqual(ids.filter(id => frames[id].scene.fx.includes('skyriver')), [ids[ids.length - 1]]);
});

test('the storyboard is this chapter’s: every frame, the panels a read-through as a reader walks them, every frame shown only to some readers saying so', () => {
  const sb = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch06.md'), 'utf8');
  assert.match(sb, /^# Storyboard: Chapter 6, The Snake in the Stones\n/);
  assert.doesNotMatch(sb, /\bSTUB\b|undefined|NaN|\[object/);
  ids.forEach(id => assert.ok(new RegExp('^(### ' + id + ' · panel \\d+|#####+ ' + id + ')\\b', 'm').test(sb), 'the storyboard has ' + id));
  assert.ok(sb.includes('| Frames | ' + ids.length + ' ('), 'every frame counted');
  ids.forEach(id => assert.ok(sb.includes('**Shot.** ' + frames[id].board), id + ': its board'));
  const lens = COMBOS.flatMap(c => [0, 1].map(light => walk(c.flags, Object.assign({}, c.o, { light })).length));
  assert.ok(sb.includes('| One read-through | ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels'), 'a read-through is ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels');
  assert.ok(sb.includes('| Choices | 5 |') && sb.includes('| Case File cards | 3 (0 eyes, 3 ears) |'));
  assert.equal((sb.match(/^\*\*Shows only if\*\* /gm) || []).length, ids.filter(id => frames[id].when).length);
  assert.match(sb, /\| Other things she taps \| the old tom’s pinecone \(f001\), Tallyheart’s five questions \(f011\)/);
  // the art's new names, in the storyboard's own words
  assert.match(sb, /Coil/);
  assert.match(sb, /The snake \(Coil\)|The long grass \(Sleet\)/);
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(camOf));
  assert.ok(pairs.size >= 22, 'only ' + pairs.size + ' set/camera pairs');
  const sets = new Set(ids.map(id => frames[id].scene.set));
  // no new place: every set is chapters 1 to 5's
  assert.deepEqual([...sets].sort(), ['bridge', 'den', 'field', 'hollow', 'pile', 'sky', 'title']);
  ['rows', 'gap', 'wide', 'low'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'pile/' + cam), 'the pile’s ' + cam));
  ['wide', 'lesson', 'tree'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'hollow/' + cam), 'the Hollow’s ' + cam));
  ['wide', 'end', 'meet'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'title/' + cam), 'the title’s ' + cam));
  ['fence', 'dogs', 'border', 'border-two', 'border-fox'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'field/' + cam), 'the field’s ' + cam));
  ['back', 'under', 'wall', 'mouth', 'bank'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'bridge/' + cam), 'the bridge’s ' + cam));
  ['walk', 'below'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'sky/' + cam), 'the sky’s ' + cam));
  ['nest', 'inside', 'doorway'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'den/' + cam), 'the den’s ' + cam));
  // along any path a reader can take, never five panels in a row from the same camera
  for (const c of COMBOS) for (const light of [0, 1]) {
    const p = walk(c.flags, Object.assign({}, c.o, { light }));
    let run = 1;
    for (let i = 1; i < p.length; i++) {
      run = camOf(p[i]) === camOf(p[i - 1]) ? run + 1 : 1;
      assert.ok(run < 5, p[i] + ': ' + run + ' panels in a row from ' + camOf(p[i]) + ' for ' + comboName(c));
    }
  }
  // and no two panels a reader turns between are the same picture with the same words
  for (const c of SOME) {
    const p = walk(c.flags, c.o);
    for (let i = 1; i < p.length; i++) assert.ok(!same(frames[p[i]].scene, frames[p[i - 1]].scene) || T(p[i]) !== T(p[i - 1]), p[i]);
  }
});

test('every frame renders, and everyone in the cast is in the picture; every Tap has its target in the art; the Taps, the questions, the Counts pictures and her cards all draw', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'black', marking: 'white-paws', eyes: 'odd' }, { sex: 'she', fur: 'calico', marking: 'none', eyes: 'amber' }];
  const off = [];
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', foundSleet: true } });
  Object.keys(ch04.cards).forEach((cid, i) => E.giveCard(cat, cid, 'ch04', i + 1));
  CARD_IDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch06', 20 + i));
  // (Coil's head is no bigger than a stone of his wall, and a stone in it shows no face; the far cats are small)
  const SMALL = (id, who) => who === 'coil' || (frames[id].scene.set === 'pile' && frames[id].scene.cam === 'wide') || (frames[id].scene.set === 'title' && frames[id].scene.cam !== 'meet') ||
    (frames[id].scene.set === 'hollow' && frames[id].scene.cam === 'wide') || who === 'dog' || (frames[id].scene.set === 'field' && frames[id].scene.cam === 'border') || frames[id].scene.set === 'sky' ||
    (frames[id].scene.set === 'bridge' && ['back', 'under', 'mouth', 'bank'].includes(frames[id].scene.cam)) || (frames[id].scene.set === 'den' && frames[id].scene.cam === 'inside');
  ids.forEach(id => looks.forEach((look, k) => {
    const f = frames[id], sc = E.resolveScene(f.scene, cat, STORIES), cast = sc.cast;
    const r = A.render(sc, { look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(r.svg), id + ': no svg');
    assert.ok(Array.isArray(r.heads) && r.heads.length === cast.length, id + ': heads');
    (f.say || []).forEach(b => assert.ok(cast.some((c, i) => c.who === b.who && r.heads[i]), id + ': speaker ' + b.who + ' has no head on the panel'));
    if (k === 0) cast.forEach((c, i) => {
      const h = r.heads[i];
      if (!h) off.push(id + ' ' + c.who + '@' + JSON.stringify(c.at) + ' (' + sc.set + '/' + sc.cam + ')');
      else {
        if (!SMALL(id, c.who)) assert.ok(h.r >= 1.5, id + ': ' + c.who + ' face radius ' + h.r);
        assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, id + ': ' + c.who + ' head in the panel');
      }
    });
    if (k === 0) {
      const sp = [...new Set((f.say || []).map(b => b.who))].map(w => cast.findIndex(c => c.who === w)).filter(i => i >= 0 && r.heads[i]);
      for (let i = 0; i < sp.length; i++) for (let j = i + 1; j < sp.length; j++) {
        const a = r.heads[sp[i]], b = r.heads[sp[j]];
        assert.ok(Math.hypot(a.x - b.x, (a.y - b.y) * 0.625) > (a.r + b.r) * 0.9, id + ': ' + cast[sp[i]].who + ' and ' + cast[sp[j]].who + ' speak from two faces');
      }
    }
  }));
  assert.deepEqual(off, [], 'cast members out of the camera’s sight');
  // every one-tap frame has its target in the picture, the one the page picks for this frame's tap
  const taps = ids.filter(id => frames[id].scratch);
  taps.forEach(id => {
    const svg = A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg, tap = frames[id].scratch.tap;
    assert.match(svg, /pc-tap/, id);
    assert.match(svg, new RegExp('class="pc-tap pc-tap-' + tap + '"|data-tap="' + tap + '"'), id + ': the ' + tap + ' to tap is in the picture');
    const marks = (svg.match(/<[^>]*(?:class="[^"]*pc-tap[^"]*"|data-tap="[^"]*"|data-art="glint")[^>]*>/g) || []).map(el => ({ tap: (/data-tap="([^"]*)"/.exec(el) || [])[1] || null, art: (/data-art="([^"]*)"/.exec(el) || [])[1] || null, cls: (/class="([^"]*)"/.exec(el) || [])[1] || null }));
    const picked = PC.ui.taps.pick(marks, tap);
    assert.ok(picked >= 0, id + ': the page finds a mark for ' + tap);
    assert.ok((marks[picked].cls || '').includes('pc-tap-' + tap) || marks[picked].tap === tap, id + ': and it is the ' + tap + ' (' + JSON.stringify(marks[picked]) + ')');
  });
  // the page of five Counts: Tallyheart glows (the one to tap)
  const ask = ids.find(id => frames[id].ask);
  for (let n = 0; n <= 5; n++) { const svg = A.render(E.askScene(frames[ask].scene, frames[ask].ask, n), { look: looks[0] }).svg; assert.ok(svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg)); if (!n) assert.match(svg, /pc-next/); }
  // the Counts pictures the chapter asks for all draw: every question of every set, the steps a question's
  // picture plays as it is asked, the help hop by hop
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
  CARD_IDS.forEach(cid => { pics.push(A.card({ picture: cid, mark: story.cards[cid].mark })); pics.push(A.card({ picture: cid, mark: story.cards[cid].mark, big: true })); });
  pics.forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
  assert.ok(pics.length > 100, pics.length + ' pictures');
  // the watchers' picture wears ReedClan's coats; Sleet's riddle is the roll call
  const watch = E.lessonPicture(E.countsSet('ch06-watchers', story, STORIES), { a: 3, b: 3, groups: 3, per: 3, table: 3 }, 0);
  assert.deepEqual(watch.who.map(w => w.who + w.variant), ['reedclan3', 'reedclan1', 'reedclan4', 'reedclan2', 'reedclan3', 'reedclan1', 'reedclan4', 'reedclan2', 'reedclan3']);
  assert.equal(E.countsSet('ch06-sleet', story, STORIES).picture.kind, 'roll');
  // her nest at bedtime: her cards along it, Coil's under the moss with Sprinkle's two
  const nest = E.resolveScene(frames[NEST].scene, cat, STORIES).opts;
  assert.ok(Array.isArray(nest.bark) && nest.bark.length >= 10 && nest.hidden === true);
  assert.match(A.render(E.resolveScene(frames[NEST].scene, cat, STORIES), { look: looks[0] }).svg, /<svg/);
});

/* ------------------------------------------------------------------ the beats the chapter must have */

test('the chapter’s beats are all there, in order, on every path: every reader’s panels are exactly her day’s, one after another, and nothing else', () => {
  // A beat is one panel: [label, what it says (every variant, in order), what else must be true of it].
  const B = (label, re, also) => [label, id => re.test(T(id)) && (!also || !!also(frames[id], id))];
  const set = s => f => f.counts && f.counts.set === s;
  const told = f => same(f.when, TOLD), kept = f => same(f.when, KEPT);
  const tap = name => f => f.scratch && f.scratch.tap === name;
  // a panel drawn twice, for the told path (with Tallyheart) and for the kept path: two beats
  const B2 = (label, re, also) => [B(label + ' (told)', re, f => told(f) && (!also || also(f))), B(label + ' (kept)', re, f => kept(f) && (!also || also(f)))];
  const PILE = [
    B('asleep on his pinecone (the pinecone Tap)', /^At sunrise, the old tom is guarding the prey pile\. He’s fast asleep on his pinecone\. SNNNRRRK\.$/, tap('pinecone')),
    B('WHO GOES THERE? (the pile’s count)', /^He blinks\. WHO GOES THERE\? I sat on it to stay awake\. Then I lay on it\. Then it was a pillow\. So I see\. \{name\}paw, the morning count is yours\.$/, set('ch06-pile')),
    B('four empty spaces. Again.', /^Then the back row\. Right in the middle: four empty spaces\. Again\. Still tidy\. Still the back\.$/),
    B('twenty in five nights; the DRAGON; or ReedClan', /^Four more\. Twenty pieces in five nights\. Tonight, the pile gets proper guards\. It’s the DRAGON\. Or ReedClan\.$/)
  ];
  const HOLLOW = [
    B('nines first (the warm-up)', /^In the Training Hollow, five cats sit up on the rim\. Nines first, to wake up your whiskers\.$/, set('ch06-nines')),
    B('twenty-seven lives; today the threes', /^Twenty-seven lives\. Hold on to that\. Today’s Count is the threes\.$/),
    B('a patrol trots by', /^Along the top of the Hollow, a patrol trots by\. Three cats, tails up\. A patrol is three cats\.$/),
    B('more patrols (four patrols)', /^More patrols stop on the path to watch\.$/, set('ch06-four')),
    B('hop by threes (the five patrols)', /^Hop by threes, like you hopped the twos\. Touch each patrol\.$/, f => f.skip && f.skip.groups === 5),
    B('fifteen, turned round', /^Fifteen! Five patrols of three\. And three forepaws, five claws each\? Fifteen too\. It’s the same fact, turned round\.$/),
    B('half the threes (her five Counts)', /^Now here’s a secret\. You already know half the threes\. I DO\?$/, f => f.ask),
    B('five threes (the lesson)', /^Five threes, and you knew every one\. That’s half! For a new one, start from one you know, and hop\.$/, set('ch06-threes')),
    B('a sixth claw mark', /^Tallyheart stretches up the leaning tree\. A sixth claw mark\. SKRITCH!$/),
    B('your sixth Count', /^Patrols\. That’s your sixth Count\. And I already knew half of it\. Now you know all of it\. I already knew half of it\. And you hopped the other half\.$/),
    B('a real patrol', /^Now, a real patrol\. The ReedClan border\. And a patrol is three\.$/),
    B('I need a warrior!', /^She calls up to the rim: I need a warrior!$/),
    B('I’m a WARRIOR!', /^\{Murmur\}chime bounds down\. I’m a WARRIOR!$/),
    B('a warrior’s work', /^\{Murmur\}chime still sounds surprised\. A border patrol is a warrior’s work\. And today, you’re on one\.$/),
    B('your tail goes straight up', /^Your tail goes straight up\. You didn’t even tell it to\.$/)
  ];
  const WALL1 = [
    B('along the old stone wall', /^Three cats, along the old stone wall above the river\. Tallyheart counts her steps under her breath: Four hundred and one\. Four hundred and two…$/),
    B('where do you walk? (the marching order)', /^Where do you walk\?$/, f => f.choice)
  ];
  const LEAD = [B('sharp eyes (she leads)', /^Sharp eyes\.$/)], MIDDLE = [B('I walked into a tree (in the middle)', /^My first patrol, I walked into a tree\.$/)];
  const BORDER1 = [
    B('the reeds rustle', /^At the end of the wall, the reeds begin\. That’s the border\. The reeds rustle\.$/),
    B('out step three cats', /^Out step three cats: one, two, three\. ReedClan\. They always come in threes\.$/),
    B('a stern brown tom; the drips', /^The biggest is a stern brown tom\. Water drips off his belly\. Drip\. Drip\.$/),
    B('Sloshbank. Tallyheart. (her worry)', /^He’s as big as three of you\. You stand up tall anyway\. A drip lands on your paw\. It’s only one drip\. You have a hundred questions\. You hold them in\. For now\. The drops sparkle as they fall\. You try not to watch\. Sloshbank\. Tallyheart\.$/),
    B('LOOKING at our MUD', /^Sloshbank looks straight at you\. Yesterday, a CrystalClan apprentice was on our marsh\. On a raft\. LOOKING at our MUD\. Looking VERY hard\.$/),
    B('three of our patrols watched (the watchers)', /^That was you\. Three of our patrols watched\. Three cats in every one\.$/, set('ch06-watchers')),
    B('what is CrystalClan after?', /^So what is CrystalClan after\?$/),
    B('THIEVES?', /^\{Murmur\}chime’s fur fluffs up\. What is ReedClan after\? Somebody’s taking OUR prey! Are you calling ReedClan THIEVES\? Drip\.$/),
    B('not under the Accord', /^Nobody is calling anybody anything\. Not at a border\. Not under the Accord\.$/),
    B('the apprentice on the raft was me', /^The apprentice on the raft was me\. I never touched your mud\. I was asking who took our prey\.$/),
    B('except at night', /^Sloshbank’s paws are big and muddy\. Nothing like the tiny prints\. Nothing crosses our marsh without ReedClan seeing it\. Except at night\.$/),
    B('OW. (the fair question)', /^The ReedClan she-cat sits on his tail\. OW\.$/, f => f.choice)
  ];
  const UNFAIR_B = [B('ask it fair', /^Sloshbank’s fur goes up\. Ask it fair\.$/), B('so you do', /^So you do: Has anything gone from YOUR pile too\?$/)];
  const BORDER2 = [
    B('and leaving our pile TIDY (ReedClan’s card)', /^Sloshbank is quiet for a long time\. ReedClan does not LOSE prey\. But somebody has been taking it\. Night after night\. And leaving our pile TIDY\. Drip\. Drip\.$/, f => f.card === 'reed-pile'),
    B('somebody is robbing us both', /^Then it isn’t ReedClan\. And it isn’t us\. Somebody is robbing us both\.$/),
    B('ReedClan will think about it', /^ReedClan will find the thief first\. Then tell us when you do\. …ReedClan will think about it\. Drip\.$/),
    B('the young tom waves (the wave)', /^The reeds close behind them\. But the young tom looks back, and waves at the three of you\.$/, tap('paw')),
    B('on the way home', /^On the way home, Tallyheart stops\. \{Murmur\}chime, tell Glintstar what ReedClan said\.$/)
  ];
  const WINK = [B('somebody under a bridge is hungry (told)', /^Off she runs\. Then Tallyheart winks at you\. Come on\. Somebody under a bridge is hungry\.$/, told)];
  const SUNSET_K = [B('back by sunset (kept)', /^Off she runs\. And you, \{name\}paw: back by sunset\. Tonight, you guard\.$/, kept)];
  const FIELD = [
    B('Riffle is waiting, with fish', /^Tallyheart pads off, counting her steps\. At the Barking Field, Riffle is waiting, with a string of fish for Sprinkle\.$/),
    B('BYE, WET SQUIRREL!', /^Three dogs gallop along the fence\. BYE, WET SQUIRREL! I’m an OTTER\.$/)
  ];
  const [SMELL_T, SMELL_K] = [[B('Old. (told)', /^Your nose twitches\. A fox smell, an old one, drifts along the fence from the last post\. Tallyheart sniffs\. Old\.$/, told)], [B('an old fox smell (kept)', /^Your nose twitches\. A fox smell, an old one, drifts along the fence from the last post\.$/, kept)]];
  const TAIL = [B('a silver-white tail flicks (the fox trail)', /^There, in the long grass, a scaly silver-white tail flicks\.$/, f => f.choice)];
  const [HMPH_T, HMPH_K] = B2('HMPH!', /^Fish don’t wait\. They get SMELLY\. HMPH!$/).map(b => [b]);
  const [POST_T, POST_K] = B2('not one paw past the post', /^The smell is strongest at the fence’s last post\. Past it, the long grass of fox country whispers\. Not one paw past the post\.$/).map(b => [b]);
  const PSST = [B('PSST! (the long grass)', /^PSST! Don’t look! You are being SPIED on!$/), B('a whole silver-white dragonet', /^A silver-white snout pokes out\. Then a whole silver-white dragonet, flat on his belly, with grass on his head\.$/)];
  const [SPY_T, SPY_K] = B2('spying on the ENEMY, very loudly', /^He whispers, very loudly: I’m spying on the ENEMY\. You, otter: stop wiggling\. You’re not the boss of ME!$/).map(b => [b]);
  const RIDDLE = [
    B('Sprinkle sent me; riddle first', /^Sprinkle sent me\. I’m in charge of Sprinkle\. I’m in charge of EVERYBODY\. Riddle first!$/),
    B('his roll call (Sleet’s riddle)', /^There are seven of us\. When Mama calls, every one of us shouts HERE three times\. HERE! HERE! HERE!$/, set('ch06-sleet'))
  ];
  const [ELDEST_T, ELDEST_K] = B2('I’m Sleet. The eldest.', /^I’m Sleet\. The eldest\. I do the roll call\.$/).map(b => [b]);
  const DROOP = [B('he puffs out his chest', /^He puffs out his chest\. A grass seed falls off\.$/), B('his tail droops', /^Then his tail droops\. But nobody answers my roll call now\. The storm blew them all away\.$/)];
  const [NEWS_T, NEWS_K] = B2('Sprinkle’s safe (her news)', /^Sprinkle’s safe\. Under the Old Bridge\. Sprinkle’s safe\./).map(b => [b]);
  const KNEW_T = [B('the eldest, and the bossiest (told)', /^I KNEW it\. I’m a very good eldest\. The eldest\. And the bossiest\.$/, told)];
  const KNEW_K = [B('I KNEW it (kept)', /^I KNEW it\. I’m a very good eldest\.$/, kept)];
  const DEN = [B('a fine, dry den (Sleet’s card)', /^I spy on the fox\. Far out in the grass, he talks to himself\. ‘Such a fine, dry den,’ he says\. Over and over\. VERY boring\.$/, f => f.card === 'sleet-den')];
  const [COME_T, COME_K] = B2('come with us?', /^Come with us\? Can’t\. I’m SPYING\. The fox has never once seen me\. I’m GRASS\.$/).map(b => [b]);
  const FIVE = [B('tell Sprinkle: five (his forepaw)', /^He holds up one silver forepaw\. Mama says: stay where you land\. Tell Sprinkle: five\. And that I’m in charge\.$/, f => f.skip && same(f.sets, { foundSleet: true }))];
  const EYES_T = [B('two big eyes over Tallyheart’s branch (told)', /^Under the Old Bridge, two big eyes peek over Tallyheart’s branch\.$/, told)];
  const EYES_K = [B('no ginger ears (kept)', /^At the Old Bridge, you check the bank first\. No ginger ears\. Under the bridge, two big eyes shine\.$/, kept)];
  const FISH = [B('FISH!', /^FISH! Now tell me EVERYTHING\. Gulp\. Gulp\. Gulp\.$/)];
  const SLEET_NEWS = [B('Sleet says: five (a cat who has met him)', /^Sleet says: five\. And he’s in charge\. He ALWAYS says that\.$/, f => !f.caption)];
  const TAIL_NEWS = [B('I saw a silver-white tail!', /^I saw a silver-white tail! My eldest brother LOVES long grass\.$/)];
  const COIL1 = [
    // her eyes shine at Sleet's news (a cat who has met him) after it, here, not before it on its own panel
    B('Hello. And THEN?', /^Her eyes shine\. So you tell her about the border\. Riffle juggles three pebbles\. …and Sloshbank’s belly went drip, drip, drip\. Hello\. And THEN\?$/,
      f => same(f.caption[0], { when: { foundSleet: true }, text: 'Her eyes shine.' })),
    B('only stones (the stone Tap)', /^You look round\. Only stones\. Riffle hops behind you\. Tallyheart’s tail curls round you\. After you\. You ask the questions\.$/, tap('stone')),
    B('It isn’t a stone', /^It isn’t a stone\. It’s a long brown head, with two round eyes, shiny as wet pebbles\. They don’t blink\. How… do… you… do\. You must be the counting cat\.$/),
    B('then MORE of him', /^Then more of him\. Then MORE of him\. Coil\. Hi! Lovely stones! We were just leaving! We were NOT\.$/)
  ];
  const [FORGIVE_T, FORGIVE_K] = B2('I never get up', /^Do forgive me for not getting up\. I never get up\. He’s not scary\. He’s just… LONG\.$/).map(b => [b]);
  // her question on its own panel, then his answer on the pat Tap's (one balloon, his, lettered over his head:
  // nothing lettered lies over her raised paw)
  const FOOT = [B('how long were you listening?', /^How long were you listening\?$/, f => !f.scratch && (f.say || []).length === 1),
    B('snakes feel footsteps (the pat Tap)', /^Since you came down the bank\. Snakes feel footsteps\.$/, f => tap('paw')(f) && f.say.length === 1 && f.say[0].who === 'coil' && !f.caption)];
  const [LIGHT_T, LIGHT_K] = B2('light paws, hopping paws', /^Light paws\. And hopping paws\.$/).map(b => [b]);
  const GINGER = [
    B('the ginger one (told)', /^Riffle stops hopping\. And the ginger one\. For three days she’s come under my bridge\. She counts her steps\. I never saw you\. I saw you\. Every time\.$/, told),
    B('you stamped (told)', /^Not one paw under the Old Bridge\. I made that rule because of YOU\. I know\. You stamped when you said it\.$/, told)
  ];
  const RULE_K = [B('your ginger mentor’s rule (kept)', /^Riffle stops hopping\. Your ginger mentor made a rule because of me\. Not one paw under the Old Bridge\. She stamped when she said it\.$/, kept)];
  const COIL2 = [
    B('he watches me SLEEP (the eyes Tap)', /^Your ears go hot\. He watches me SLEEP\. It’s RUDE\.$/, tap('eyes')),
    B('no eyelids', /^I have no eyelids\. I never shut my eyes\. So I see EVERYBODY’S business\. STILL RUDE\.$/)
  ];
  const [PRICE_T, PRICE_K] = B2('what for a secret?', /^Patience said to ask you\. The one who never shuts his eyes\. How kind of her\. And what will you give me for a secret\? Fish\?$/).map(b => [b]);
  const COIL3 = [
    B('a whole train rumbles over', /^Coil thinks about it\. A whole train rumbles over\. Fish are NOISY\.$/),
    B('who?', /^Since the storm, my bridge is SO noisy\. Pebbles\. Sniffling\. Fish, flapping\. And an otter who never, ever stops talking\. Who\?$/)
  ];
  const [QUIET_T, QUIET_K] = B2('a secret, for some quiet', /^Everybody looks at Riffle\. A secret, for some quiet\. No juggling under my bridge\.$/).map(b => [b]);
  const COIL4 = [
    B('three pebbles in his paws (the pebbles Tap)', /^Riffle still has three pebbles in his paws\.$/, tap('pebbles')),
    B('Otter’s honor', /^Otter’s honor\.$/),
    B('small diggers (Coil’s card)', /^Sprinkle sniffs\. Very, very quietly\. Coil’s voice goes very quiet\. He likes quiet\. Every night, small diggers come and go\. Under your Clan’s pile\. Scrape, scrape\. I feel them\.$/, f => f.card === 'coil-diggers')
  ];
  const DIGGERS_T = [B('a snake’s secret (told)', /^Diggers\? WHO\? I feel feet\. Not faces\. A snake’s secret\. A thing to check\.$/, told)];
  const DIGGERS_K = [B('I feel feet (kept)', /^Diggers\? WHO\? I feel feet\. Not faces\.$/, kept)];
  const ASKED = [B('nobody asked (Coil’s question)', /^A snake’s secret\. A thing to check\. Did you always know I was here\? Since the night you fell in\. I felt you land\. And you never TOLD\? Nobody asked\.$/, f => f.choice)];
  const [NEVER_T, NEVER_K] = B2('never, not to anybody', /^Never\. Not to anybody\. And I never trade with foxes\. Foxes never leave anyone alone\. That’s the nicest thing he’s ever said\. He’s still rude\. Now\. Quiet, please\.$/).map(b => [b]);
  const OUT = [
    B('he slides back into the stones', /^Slowly, slowly, he slides back into the stones\. Bring more fish\. QUIET ones\.$/),
    B('not one word (the cheeks Tap)', /^Riffle doesn’t say one word all the way out\.$/, tap('cheeks'))
  ];
  const [BURST_T, BURST_K] = B2('he bursts', /^On the bank, he bursts\. THAT was the longest I’ve EVER been quiet!$/).map(b => [b]);
  const GUARDS = [
    B('ReedClan TOO?', /^At sunset, the whole Clan sits round the prey pile\. Forty pieces, in four rows\. ReedClan has been robbed too\. ReedClan TOO\? That dragon is EVERYWHERE\.$/),
    B('one to look, one to listen, one to run', /^We don’t blame what we haven’t seen\. We guard\. Tallyheart\? ReedClan cats always come in threes\. One to look\. One to listen\. One to run for help\.$/),
    B('six patrols (the guards)', /^Tonight, our guards do the same\. Six patrols, one after another, sunset to sunrise\. Three cats in every one\.$/, set('ch06-guards')),
    // (his “Then I can SLEEP.” opens it: the question's right line is only “Eighteen!”)
    B('no pinecone', /^Then I can SLEEP\. You can\. In your NEST\. No pinecone\? No pinecone\.$/),
    B('that’s what the Counts are for', /^Eighteen guards\. That’s what the Counts are for\. In the morning, your count tells us if it worked\.$/),
    B('first watch (the hairball, kept)', /^You don’t tell her what Coil said\. You can’t, without telling her where you heard it\. It sits in your tummy like a hairball\. First watch\. Me, \{Murmur\}chime, and you\.$/),
    B('I AM the back', /^She takes the back, to look\. Why is it always the back\? Tonight, I AM the back\. Always the back\. And a snake’s secret\. Tonight, I AM the back\.$/),
    B('the moon comes out', /^\{Murmur\}chime walks round and round, ready to run for help\. You sit at the front, ears up\. You’re the one to listen\. The moon comes out, a little fatter\.$/),
    B('nothing happens; mice…', /^Nothing happens\. Not one thing\. \{Murmur\}chime walks slower\. And slower\. Mice…$/),
    B('a rustle! (the ears Tap)', /^Tallyheart’s tail tickles her nose\. A rustle!$/, tap('ears')),
    B('just checking', /^Out shuffles the old tom, with his pinecone\. Just checking\.$/),
    B('nothing is the best thing a guard can see', /^And off he shuffles\. Then three yawning cats come for the second watch\. Forty pieces, all there\. Nothing\. Good\. Nothing is the best thing a guard can see\.$/)
  ];
  const BED = [
    B('skritch, skritch', /^In your nest: Today’s bark goes along the mossy edge\. Riffle’s stone is by your nose\. Riffle’s stone is under your chin\. skritch, skritch\.$/),
    B('did you catch anybody?', /^\{name\}paw\? Did you catch anybody\? Only the old tom\. …Do the paw thing\.$/),
    B('six guard patrols (the bedtime patrols)', /^It’s threes tonight\. Six guard patrols\.$/, f => f.skip && f.skip.groups === 6),
    B('a GUARD thing', /^That’s not a paw thing\. That’s a GUARD thing\.$/),
    B('soon he’s snoring', /^Soon he’s snoring\. And then, so are you\.$/),
    B('the Sky River, soft as moss', /^You’re walking on the Sky River, on stars as soft as moss\.$/),
    B('a cat made of starlight', /^A cat made of starlight sits waiting: one of the cats who came before\. You don’t know her\. But she feels kind\.$/),
    B('count what’s missing (the starry cat)', /^Count what’s missing, little one\. Then ask who was there to see it\.$/, f => f.choice)
  ];
  const PURR = [B('she only purrs', /^She only purrs, like a train far away\.$/)], DOWN = [B('she looks down', /^She looks down, past the stars\.$/)];
  const END = [
    B('a wind chime rings', /^Far below is your old tower\. On a balcony nineteen floors up, a wind chime rings\. Who was up there, awake, when the rain stopped\?$/),
    B('three by three', /^You wake up in your nest, warm and safe\. Outside, the guards walk round the pile, three by three\.$/),
    B('will anything be missing?', /^Tomorrow, your sixth morning count\. Will anything be missing\? You curl up tight, and sleep\.$/),
    B('the dream', /^What else did \{name\}paw dream, the night of \{their\} first patrol\?$/, f => f.input && f.input.kind === 'dream'),
    B('the end', /End of Chapter Six\.$/, f => f.end)
  ];
  const ALL = [PILE, HOLLOW, WALL1, LEAD, MIDDLE, BORDER1, UNFAIR_B, BORDER2, WINK, SUNSET_K, FIELD, SMELL_T, SMELL_K, TAIL, HMPH_T, HMPH_K, POST_T, POST_K, PSST, SPY_T, SPY_K, RIDDLE,
    ELDEST_T, ELDEST_K, DROOP, NEWS_T, NEWS_K, KNEW_T, KNEW_K, DEN, COME_T, COME_K, FIVE, EYES_T, EYES_K, FISH, SLEET_NEWS, TAIL_NEWS, COIL1, FORGIVE_T, FORGIVE_K, FOOT, LIGHT_T, LIGHT_K,
    GINGER, RULE_K, COIL2, PRICE_T, PRICE_K, COIL3, QUIET_T, QUIET_K, COIL4, DIGGERS_T, DIGGERS_K, ASKED, NEVER_T, NEVER_K, OUT, BURST_T, BURST_K, GUARDS, BED, PURR, DOWN, END].flat();
  // every beat is in the chapter once, and every frame of the chapter is one beat
  ALL.forEach(([label, pred]) => assert.equal(ids.filter(pred).length, 1, label + ': ' + ids.filter(pred).join(' ')));
  ids.forEach(id => assert.equal(ALL.filter(b => b[1](id)).length, 1, id + ' is one beat: ' + ALL.filter(b => b[1](id)).map(b => b[0]).join(' | ') + ' (' + T(id) + ')'));
  // her day, panel by panel: what a cat of this kind reads on this route with these light choices
  function day(c, light) {
    const t = c.flags.ch3Told, P = (a, b) => (t ? a : b);
    const sleet = c.o.sleet ? [].concat(P(POST_T, POST_K), PSST, P(SPY_T, SPY_K), RIDDLE, P(ELDEST_T, ELDEST_K), DROOP, P(NEWS_T, NEWS_K), P(KNEW_T, KNEW_K), DEN, P(COME_T, COME_K), FIVE) : P(HMPH_T, HMPH_K);
    return [].concat(PILE, HOLLOW, WALL1, light ? MIDDLE : LEAD, BORDER1, c.o.unfair ? UNFAIR_B : [], BORDER2, P(WINK, SUNSET_K), FIELD, P(SMELL_T, SMELL_K), TAIL, sleet,
      P(EYES_T, EYES_K), FISH, metSleet(c) ? SLEET_NEWS : TAIL_NEWS, COIL1, P(FORGIVE_T, FORGIVE_K), FOOT, P(LIGHT_T, LIGHT_K), P(GINGER, RULE_K), COIL2, P(PRICE_T, PRICE_K), COIL3,
      P(QUIET_T, QUIET_K), COIL4, P(DIGGERS_T, DIGGERS_K), ASKED, P(NEVER_T, NEVER_K), OUT, P(BURST_T, BURST_K), GUARDS, BED, light ? DOWN : PURR, END);
  }
  for (const c of COMBOS) for (const light of [0, 1]) {
    const p = walk(c.flags, Object.assign({}, c.o, { light })), want = day(c, light), name = comboName(c) + ' light ' + light;
    for (let i = 0; i < Math.max(p.length, want.length); i++) {
      assert.ok(p[i] && want[i], name + ': ' + (p[i] ? 'an extra panel, ' + p[i] + ' (' + T(p[i]) + ')' : 'her day stops short of “' + want[i][0] + '”'));
      assert.ok(want[i][1](p[i]), name + ': panel ' + (i + 1) + ' is ' + p[i] + ' (' + T(p[i]).slice(0, 60) + '…), and should be “' + want[i][0] + '”');
    }
    // the flags as her day left them: Sleet found for good once she has followed the trail, and nothing else set
    assert.equal(!!p.flags.foundSleet, metSleet(c), name);
    assert.deepEqual(Object.keys(p.flags).sort(), Object.keys(c.flags).concat(c.o.sleet && !c.before ? ['foundSleet'] : []).sort(), name + ': no other flag');
  }
});

/* ------------------------------------------------------------------ every `when` */

test('every `when`, on every combination: each reader reads her own lines and nobody else’s; no name of a dragonet she has not met; her news to Sleet names exactly the siblings she has found', () => {
  const count = (s, re) => (s.match(new RegExp(re.source, 'g')) || []).length;
  for (const c of COMBOS) for (const clean of (COMBOS.indexOf(c) % 5 ? [true] : [true, false])) {
    const f = c.flags, o = c.o, name = comboName(c);
    const rows = walkLines(f, Object.assign({}, o, { clean })), lines = rows.map(r => r.lines.join(' ')).join('\n');
    const reads = (re, want, what) => assert.equal(re.test(lines), !!want, name + ': ' + what);
    const told = f.ch3Told, met = metSleet(c);
    // told or kept
    reads(/Then Tallyheart winks at you\. Come on\. Somebody under a bridge is hungry\./, told, 'her wink');
    reads(/And you, \{name\}paw: back by sunset\. Tonight, you guard\./, !told, 'back by sunset');
    reads(/Tallyheart pads off, counting her steps\./, !told, 'she pads off');
    reads(/Tallyheart sniffs\.\nOld\.|Tallyheart sniffs\. Old\./, told, 'Old');
    reads(/The eldest\. And the bossiest\./, told && o.sleet, 'the bossiest');
    reads(/two big eyes peek over Tallyheart’s branch/, told, 'the branch');
    reads(/you check the bank first\. No ginger ears\./, !told, 'the bank');
    reads(/Tallyheart’s tail curls round you\./, told, 'her tail round you');
    reads(/And the ginger one\. For three days she’s come under my bridge\./, told, 'the ginger one');
    reads(/I made that rule because of YOU\./, told, 'her rule, hers');
    reads(/Your ginger mentor made a rule because of me\./, !told, 'her rule, his');
    reads(/Your ears go hot\./, !told, 'hot ears');
    assert.equal(count(lines, /A snake’s secret\. A thing to check\./), 1, name + ': a snake’s secret, once (her balloon, or narration)');
    reads(/You don’t tell her what Coil said\./, !told, 'the hairball');
    reads(/Always the back\. And a snake’s secret\. Tonight, I AM the back\./, told, 'her back, told');
    reads(/Why is it always the back\? Tonight, I AM the back\./, !told, 'her back, kept');
    assert.equal(count(lines, /Not one paw past the post\./), o.sleet ? 1 : 0, name + ': the rule at the post, once (hers or Riffle’s)');
    // the lesson: a cat who needed no help says “And I already knew”
    reads(/And I already knew half of it\.\s*Now you know all of it\./, clean, 'now you know all of it');
    reads(/(^|\s)I already knew half of it\.\s*And you hopped the other half\./, !clean, 'you hopped the other half');
    // a noticing cat at Sloshbank's paws; each worry once, at Sloshbank
    reads(/Sloshbank’s paws are big and muddy\. Nothing like the tiny prints\./, f.specialty === 'noticing', 'the muddy paws');
    reads(/He’s as big as three of you\. You stand up tall anyway\./, f.worry === 'small', 'small');
    reads(/A drip lands on your paw\. It’s only one drip\./, f.worry === 'water', 'water');
    reads(/You have a hundred questions\. You hold them in\. For now\./, f.worry === 'talk', 'talk');
    reads(/The drops sparkle as they fall\. You try not to watch\./, f.worry === 'shiny', 'shiny');
    // her stone
    reads(/Riffle’s stone is by your nose\./, true, 'her stone');
    reads(/Riffle’s stone is under your chin\./, false, 'not under her chin');
    // the fair question
    reads(/Sloshbank’s fur goes up\.\nAsk it fair\.|Ask it fair\./, o.unfair, 'ask it fair');
    // Sleet: his name only for a cat who has met him; his news under the bridge; the tail for everyone else
    assert.equal(/Sleet/.test(lines), met, name + ': Sleet’s name');
    reads(/Sleet says: five\. And he’s in charge\./, met, 'his news');
    reads(/I saw a silver-white tail!/, !met, 'the tail she saw');
    reads(/HMPH!/, !o.sleet, 'the grass’s huff');
    // her news to him: exactly the siblings she has found, in order, in one balloon
    if (o.sleet) {
      const news = ['Sprinkle’s safe. Under the Old Bridge.'].concat(f.foundSquall ? ['Squall’s on the tallest tower.'] : [], f.foundPuddle ? ['Puddle’s under the otters’ raft.'] : [], f.foundWisp ? ['Wisp’s in the heron’s reeds.'] : []).join(' ');
      const row = rows.find(r => /^Sprinkle’s safe\./.test(r.lines[0] || ''));
      assert.deepEqual(row.lines, [news], name + ': her news, one balloon');
    }
    // a cat who has not met a dragonet never reads its name
    assert.equal(/Squall/.test(lines), !!(o.sleet && f.foundSquall), name + ': Squall’s name, only in her news to Sleet');
    assert.equal(/\bPuddle\b/.test(lines), !!(o.sleet && f.foundPuddle), name + ': Puddle’s');
    assert.equal(/\bWisp\b/.test(lines), !!(o.sleet && f.foundWisp), name + ': Wisp’s');
  }
  // the eight forms: `false` matches a flag never set, so a cat who has found nobody reads the first
  const news = frames[SLEET.find(id => /^Sprinkle’s safe\./.test(T(id)))];
  assert.equal(news.say.length, 8);
  assert.deepEqual(E.balloons(news, { flags: {} }).map(b => b.text), ['Sprinkle’s safe. Under the Old Bridge.']);
  assert.deepEqual(E.balloons(news, { flags: { foundPuddle: true, foundWisp: true } }).map(b => b.text), ['Sprinkle’s safe. Under the Old Bridge. Puddle’s under the otters’ raft. Wisp’s in the heron’s reeds.']);
  // each specialty's and each worry's lines are where the story puts them
  const where = (k, v) => ids.filter(id => (frames[id].when && frames[id].when[k] === v) || texts(frames[id]).some(x => x.when && x.when[k] === v));
  assert.deepEqual(where('specialty', 'noticing'), [F(/Except at night\./)], 'one specialty line (noticing, at Sloshbank’s paws)');
  ['sneaking', 'climbing', 'swimming', 'friends'].forEach(v => assert.deepEqual(where('specialty', v), [], v));
  ['small', 'water', 'talk', 'shiny'].forEach(v => assert.deepEqual(where('worry', v), [F(/Sloshbank\. Tallyheart\.$/)], v + ': one line, at Sloshbank'));
  // ch2SaidAloud, ch2Path, stepOut, spokeUp, joinReason, ch4CaughtFly, ch5First and ch5Roof aren't read; lessonClean once
  ids.forEach(id => [frames[id].when].concat(texts(frames[id]).map(x => x.when)).filter(Boolean).forEach(w => ['ch2SaidAloud', 'ch2Path', 'stepOut', 'spokeUp', 'joinReason', 'ch4CaughtFly', 'ch5First', 'ch5Roof'].forEach(k => assert.ok(!(k in w) && !(w.not && k in w.not), id + ': ' + k))));
  assert.deepEqual(ids.filter(id => texts(frames[id]).some(x => x.when && (x.when.lessonClean || (x.when.not && x.when.not.lessonClean)))), [F(/That’s your sixth Count/)]);
});

/* ------------------------------------------------------------------ Counts */

function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }
const pairs = d => d.facts.map(f => { const q = factAB(f); return q.a + 'x' + q.b; });
const RIM5 = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
const TH = text => ({ who: 'tallyheart', text });
const QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
const PATROLS = { table: 3, thing: 'cat', things: 'cats', unit: 'patrol', units: 'patrols', teacher: 'tallyheart', ask: '{a} × {b}' };
const BORROW = { fillFrom: 'ch06-threes', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower' };
const HOP = 'Close. Let’s hop it together.', FAR = 'Let’s hop it together.';
const MISS = { miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.' };
const r = n => ({ who: 'reedclan', variant: n });
const REED9 = [r(3), r(1), r(4), r(2), r(3), r(1), r(4), r(2), r(3)];

test('counts: every set exactly as the spec has it (section 2)', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), SETS);
  assert.deepEqual(C['ch06-pile'], {
    table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
    picture: { kind: 'prey', layout: 'rows' },
    facts: [{ a: 3, b: 10, light: 'rows', check: true, prompt: [{ kind: 'caption', text: 'Three full rows of ten. How many pieces?' }], retryPrompt: true }],
    ask: '{a} × {b}', praise: [], ground: 'earth',
    helpIntro: 'Let’s scratch it out: ten marks for every row.',
    helpIntroNotTen: 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.',
    fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', avoid: [[4, 10], [5, 10]], fillIntro: 'An easy one.',
    miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', again: ['There it is. You remembered that one.'], done: null
  });
  ['helpIntro', 'helpIntroNotTen'].forEach(k => assert.equal(C['ch06-pile'][k], ch05.counts['ch05-pile'][k], 'chapter 5’s pile ' + k));
  const NINES_HELP = 'Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.';
  assert.deepEqual(C['ch06-nines'], {
    table: 9, thing: 'life', things: 'lives', unit: 'cat', units: 'cats', teacher: 'tallyheart', light: 'tuck',
    facts: [[7, 9], { a: 3, b: 9, who: RIM5.slice(0, 3), prompt: 'Three cats, nine lives each. How many lives?', retryPrompt: true, right: [TH('Twenty-seven! Hop, then tuck.')], rightAgain: true }],
    warmHard: { table: 9, at: 0, avoid: [[3, 9], [2, 9], [9, 10]] }, avoid: [[3, 9]],
    fillFrom: 'ch05-nines', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
    ask: '{a} × {b}', praise: ['Yes! Nine lives on every cat.', 'Tens, with a claw tucked in. That’s all a nine is.'],
    fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
    helpIntro: NINES_HELP, helpIntroFar: 'Let’s scratch it out together: hop by tens, then tuck one in for every cat.',
    helpIntroTens: 'That’s the hop! Now the tuck: one claw in for every cat.',
    helpIntroOneTuck: 'So close! You tucked ONE claw. Tuck one in for every cat.',
    helpIntroNotNine: 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.',
    miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
    remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!', rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
  });
  ['helpIntro', 'helpIntroFar', 'helpIntroTens', 'helpIntroOneTuck', 'helpIntroNotNine'].forEach(k => assert.equal(C['ch06-nines'][k], ch05.counts['ch05-nines'][k], 'chapter 5’s nines ' + k));
  assert.deepEqual(C['ch06-four'], Object.assign({}, PATROLS, BORROW, {
    facts: [{ a: 4, b: 3, prompt: 'How many cats in four patrols?', retryPrompt: true, right: [TH('Twelve! Now let’s hop. It’s quicker.')], rightAgain: true }],
    praise: [], helpIntro: HOP, helpIntroFar: FAR, done: null }, MISS));
  const step = (made, next) => ({ miss: made + '. One more hop: ' + next + '. We’ll come back to that one.', missLast: made + '. One more hop: ' + next + '.' });
  assert.deepEqual(C['ch06-threes'], Object.assign({}, PATROLS, {
    label: 'Patrols', hollowThings: 'threes', fillOrder: 'easiest',
    facts: [
      { a: 1, b: 3, right: [TH('Three! One patrol, one hop.')], rightAgain: true },
      Object.assign({ a: 3, b: 2, lit: 3, prompt: 'Two patrols. One patrol made three. Hop three more.', retryPrompt: true, right: [TH('Six! You’ve known that one since your second day.')], rightAgain: true }, step('One patrol made three', 'six')),
      Object.assign({ a: 3, b: 3, lit: 6, prompt: 'Three patrols. Two patrols made six. Hop three more.', retryPrompt: true, right: [TH('Nine! That’s a new one.')], rightAgain: true }, step('Two patrols made six', 'nine')),
      { a: 3, b: 5, right: [TH('Fifteen! Like the claws.')], rightAgain: true },
      Object.assign({ a: 6, b: 3, lit: 15, prompt: 'Six patrols. Five patrols made fifteen. Hop three more.', retryPrompt: true }, step('Five patrols made fifteen', 'eighteen')),
      Object.assign({ a: 7, b: 3, lit: 18, prompt: 'Seven patrols. Six patrols made eighteen. Hop three more.', retryPrompt: true }, step('Six patrols made eighteen', 'twenty-one')),
      Object.assign({ a: 3, b: 8, lit: 21, prompt: 'Eight patrols. Seven patrols made twenty-one. Hop three more.', retryPrompt: true }, step('Seven patrols made twenty-one', 'twenty-four')),
      { a: 3, b: 4, prompt: 'Four patrols? You did that one already.', retryPrompt: true, right: [TH('Twelve! Same fact, turned round.')], rightAgain: true },
      { a: 3, b: 7, prompt: 'Seven patrols? You did that one the other way round.', retryPrompt: true, right: [TH('Twenty-one! Same fact.')], rightAgain: true },
      { a: 8, b: 3, check: true, right: [TH('Twenty-four! Same fact.')], rightAgain: true }
    ],
    praise: ['Hop, hop, hop!', 'Three more, every time!', 'You hopped it!'], fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
    helpIntro: HOP, helpIntroFar: FAR, done: 'That’s the threes.' }, MISS));
  assert.deepEqual(C['ch06-watchers'], Object.assign({}, PATROLS, BORROW, {
    who: REED9,
    facts: [{ a: 3, b: 3, prompt: [{ kind: 'caption', text: 'How many ReedClan cats watched you?' }], retryPrompt: true,
      right: [{ who: 'player', text: 'NINE? I only saw three!' }, { who: 'sloshbank', text: 'That is the point of reeds.' }], rightAgain: true }],
    ground: 'earth', praise: [], helpIntro: HOP, helpIntroFar: FAR, done: null }, MISS));
  assert.deepEqual(C['ch06-sleet'], Object.assign({}, BORROW, {
    table: 3, thing: 'HERE', things: 'HEREs', unit: 'dragonet', units: 'dragonets', teacher: 'sleet', ask: '{a} × {b}', picture: { kind: 'roll' },
    facts: [{ a: 7, b: 3, prompt: [{ kind: 'caption', text: 'How many times does Mama hear HERE?' }], retryPrompt: 'Seven of us, three HEREs each. How many HEREs?',
      right: [{ who: 'sleet', text: 'TWENTY-ONE! You pass. Not past the post!' }], rightAgain: true }],
    help: 'picture', helpCounter: 'you', helpIntro: 'Count every HERE! Hop by threes.', avoid: [[7, 3]], againIntro: 'My roll call AGAIN!', fillIntro: 'A smaller roll call!',
    praise: [], again: ['You pass!'], miss: 'There! I’ll ask you AGAIN in a minute.', missLast: 'There!', done: null
  }));
  assert.deepEqual(C['ch06-guards'], Object.assign({}, PATROLS, BORROW, {
    facts: [{ a: 3, b: 6, prompt: [{ kind: 'caption', text: 'How many guards?' }], retryPrompt: true, right: [{ who: 'grizzled', text: 'Eighteen!' }], rightAgain: true }],
    ground: 'earth', praise: [], helpIntro: HOP, helpIntroFar: FAR, done: null }, MISS));
  // ReedClan's nine: three patrols, never two of one coat side by side
  REED9.forEach((w, i) => { if (i) assert.notEqual(w.variant, REED9[i - 1].variant); });
  // every fact: arithmetic, in its Count, no duplicates in a set; a set borrows from the same Count
  Object.keys(C).forEach(sid => {
    const d = C[sid];
    if (d.fillFrom) assert.equal(E.countsSet(d.fillFrom, story, STORIES).table, d.table, sid + ': it borrows from the same Count');
    const keys = new Set();
    d.facts.forEach(f => {
      const q = factAB(f);
      assert.ok(q.a === d.table || q.b === d.table, sid + ': ' + q.a + '×' + q.b + ' belongs to the ' + d.table + 's');
      assert.ok(!keys.has(q.a + 'x' + q.b), sid);
      keys.add(q.a + 'x' + q.b);
    });
  });
  // the lesson kit: seven new facts (3 × 3, 3 × 4, 3 × 6, 3 × 7, 3 × 8, both orders) and three known stepping stones
  const ten = pairs(C['ch06-threes']);
  assert.deepEqual(ten, ['1x3', '3x2', '3x3', '3x5', '6x3', '7x3', '3x8', '3x4', '3x7', '8x3']);
  const NEW = ['3x3', '3x4', '3x6', '3x7', '3x8'], key = k => k.split('x').map(Number).sort((a, b) => a - b).join('x');
  assert.equal(ten.filter(k => NEW.map(key).includes(key(k))).length, 7, 'at least six of the ten are the five new facts, in either order');
  assert.ok(ten.some(k => k === '6x3') && ten.some(k => k === '3x4') && ten.some(k => k === '4x3') === false && ten.some(k => k === '7x3') && ten.some(k => k === '3x7') && ten.some(k => k === '3x8') && ten.some(k => k === '8x3'), 'both orders');
  // each new fact typed twice on the plain path, 3 × 3 at the border, 3 × 6 the guards, 4 × 3 the four patrols
  const plain = Object.keys(C).filter(sid => sid !== 'ch06-sleet').flatMap(sid => pairs(C[sid])).map(key);
  NEW.forEach(k => assert.ok(plain.filter(x => x === key(k)).length >= 2, k + ' twice on the plain path'));
  // story questions: not 7 × 2, 9 × 2 or 4 × 5; Sleet's riddle none of the dragonets' Counts so far, and a 3s fact
  ['ch06-four', 'ch06-watchers', 'ch06-guards', 'ch06-sleet'].forEach(sid => pairs(C[sid]).forEach(k => assert.ok(!['2x7', '2x9', '4x5'].includes(key(k)), sid + ': ' + k)));
  assert.ok(!['2x5', '5x6', '5x7', '4x10', '1x7'].includes(key(pairs(C['ch06-sleet'])[0])) && C['ch06-sleet'].table === 3);
  // 16 typed answers on the plain path, 17 with Sleet
  const typed = Object.keys(C).reduce((m, sid) => m + C[sid].facts.length, 0);
  assert.equal(typed - C['ch06-sleet'].facts.length, 16);
  t.diagnostic('16 typed answers (17 with Sleet’s riddle) with no misses');
  // the Counts frames, each with the lines its own page carries
  const cf = ids.filter(id => frames[id].counts);
  assert.deepEqual(cf.map(id => [frames[id].counts.set, (frames[id].caption || []).length, (frames[id].say || []).length]),
    [['ch06-pile', 1, 3], ['ch06-nines', 1, 1], ['ch06-four', 1, 0], ['ch06-threes', 0, 1], ['ch06-watchers', 1, 2], ['ch06-sleet', 0, 1], ['ch06-guards', 0, 1]]);
  // Sleet's riddle in one balloon, every word kept: two made the question's page taller than an iPad's
  // screen in landscape (it opened scrolled, the first balloon under the top bar; measured in Safari)
  assert.deepEqual(frames[countsAt('ch06-sleet')[0]].say, [{ who: 'sleet', text: 'There are seven of us. When Mama calls, every one of us shouts HERE three times. HERE! HERE! HERE!' }]);
});

test('counts: lines are short, whole sentences, and fit both sexes; nobody but the set’s own voices speaks in it', () => {
  const VOICES = { 'ch06-pile': [], 'ch06-nines': ['tallyheart'], 'ch06-four': ['tallyheart'], 'ch06-threes': ['tallyheart'], 'ch06-watchers': ['player', 'sloshbank'], 'ch06-sleet': ['sleet'], 'ch06-guards': ['grizzled'] };
  countsLines().forEach(x => {
    assert.ok(typeof x.text === 'string' && x.text.trim(), x.set + ' ' + x.where);
    assert.ok(words(x.text) <= (/^helpIntro|prompt/.test(x.where) ? 22 : 18), x.set + ' ' + x.where + ': short: ' + x.text);
    if (x.who) assert.ok(VOICES[x.set].includes(x.who), x.set + ' ' + x.where + ': ' + x.who);
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.set + ' ' + x.where + ': ' + x.text));
  });
  Object.keys(VOICES).forEach(sid => {
    const said = new Set(countsLines().filter(x => x.set === sid && x.who).map(x => x.who));
    assert.deepEqual([...said].sort(), VOICES[sid].slice().sort(), sid);
    countsAt(sid).forEach(id => [...said].concat([story.counts[sid].teacher]).forEach(who => assert.ok(castOf(id, who).length, id + ': ' + who + ' speaks in ' + sid + ', so is in the picture')));
  });
  // nobody praises speed but in the Hollow's own two; no praise line names a total
  ['ch06-nines', 'ch06-threes'].forEach(sid => [].concat(story.counts[sid].praise, story.counts[sid].fast, story.counts[sid].fastAfterMiss).forEach(l => assert.doesNotMatch(l, /\d|twelve|fifteen|eighteen|twenty|thirty|forty|fifty|sixty|seventy|eighty/i, sid + ': ' + l)));
});

/* A cat who has read chapters 1 to 5, with these answers and times in chapter 5's nines (as `before6`):
 * what the warm-up finds hard. `older`: chapter 2's 9 × 2 and chapter 4's 10 × 9 answered slowly too. */
function ninesCat(nines, ms, older) {
  const cat = E.blankCat({ now: 1, id: 'c6' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Stone: 'nose', ch3Told: true });
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  if (older) play(cat, 'ch02-ears', null, { '9x2': 9000, '2x9': 9000, all: 2500 });
  play(cat, 'ch04-tens', null, older ? { '10x9': 7000, '9x10': 7000, all: 2500 } : null);
  play(cat, 'ch05-nines', nines, ms);
  return cat;
}
const DEFAULTS = ['Here’s that one again.', 'There. We’ll come back to that one.', 'There. Now you’ve seen it counted.', 'There it is. You remembered that one.', 'Yes! That one came back, and you knew it.', 'Let’s scratch it out together.', 'Yes!', 'Good work.'];
const saidIn = rows => rows.reduce((a, x) => a.concat(x.prompt.map(p => p.text), x.line, x.balloons.map(b => b.text), x.help ? [x.help.intro, x.help.line] : []), []).filter(Boolean);

test('the pile and the warm-up, the build notes’ tests: three rows lit a row at a time; the pile borrows its own rows; the warm-up’s hard nine first, 7 × 9 when nothing was hard, never 3 × 9, 2 × 9 or 9 × 10, even when chapter 2’s 9 × 2 or chapter 4’s 10 × 9 was slow; “Not today!”', () => {
  // the pile: read under its caption, no right line; a miss is scratched in the earth a row at a time
  const clean = play(ninesCat(), 'ch06-pile');
  assert.deepEqual(clean.map(x => [x.k, x.q.answer, x.q.light, x.line, x.balloons.length]), [['3x10', 30, 'rows', '', 0]]);
  assert.deepEqual(clean[0].prompt.map(p => [p.kind, p.label, p.text]), [['caption', null, 'Three full rows of ten. How many pieces?']]);
  assert.deepEqual(clean[0].light.map(s => s.picture.highlight), [10, 20, 30], 'lit a row at a time, with no number shown');
  assert.equal(clean[0].picture.kind, 'prey');
  const missed = play(ninesCat(), 'ch06-pile', { '3x10': [13, 40] });
  assert.deepEqual(ks(missed), ['3x10✗', 'F:1x10', 'F:10x2', 'R:3x10✗', 'F:1x10', 'F:10x2', 'R:3x10']);
  assert.deepEqual([missed[0].help.intro, missed[0].help.ground, missed[0].help.nums, missed[3].help.intro], ['Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.', 'earth', [10, 20, 30], 'Let’s scratch it out: ten marks for every row.']);
  assert.deepEqual(missed.slice(1, 3).map(x => [x.prompt.map(p => p.text).join(' '), x.picture.kind, x.picture.groups]), [['An easy one. One row of ten. How many pieces?', 'prey', 1], ['An easy one. Two rows of ten. How many pieces?', 'prey', 2]], 'asked on the pile’s own rows, in its own words');
  assert.deepEqual(missed[6].prompt.map(p => p.text), ['Here’s that one again.', 'Three full rows of ten. How many pieces?']);
  assert.equal(missed[6].line, 'There it is. You remembered that one.');
  // whatever she misses, the pile never shows four or five full rows
  for (let seed = 1; seed <= 60; seed++) {
    let x = (seed * 2654435761) >>> 0;
    const rnd = () => ((x = (Math.imul(x, 1103515245) + 12345) >>> 0) / 4294967296);
    const c2 = ninesCat(), { def: d, state: st } = E.chapterLesson(c2, story, 'ch06-pile', 1, STORIES);
    for (let q; (q = E.counts.question(st));) {
      if (q.filler) assert.ok(!['4x10', '5x10'].includes(pairKey(q.a + 'x' + q.b)), 'seed ' + seed + ': ' + q.a + '×' + q.b);
      E.logAnswer(c2, E.counts.answer(st, E.questionDef(d, q, story, STORIES), rnd() < 0.5 ? q.answer + 1 : q.answer, 1500, 1).entry);
    }
  }
  // the warm-up
  const def = story.counts['ch06-nines'];
  const facts = cat => E.lessonFacts(cat, Object.assign({ id: 'ch06-nines' }, def), STORIES).map(x => (Array.isArray(x) ? x.join('x') : x.a + 'x' + x.b + (x.hard ? ' hard' : '')));
  assert.deepEqual(facts(ninesCat()), ['7x9', '3x9'], 'nothing was hard yesterday: 7 × 9');
  assert.deepEqual(facts(ninesCat(null, { '9x8': 9000 })), ['9x8 hard', '3x9'], 'right but slow in chapter 5: her hard nine first, in the order chapter 5 asked it');
  assert.deepEqual(facts(ninesCat({ '4x9': [40] })), ['4x9 hard', '3x9'], 'a chapter-5 miss of 4 × 9: still yesterday’s');
  assert.deepEqual(facts(ninesCat(null, { '3x9': 9000 })), ['7x9', '3x9'], 'never 3 × 9, asked anyway');
  assert.deepEqual(facts(ninesCat({ '2x9': [17] })), ['7x9', '3x9'], 'a chapter-5 miss of 2 × 9 is passed over');
  assert.deepEqual(facts(ninesCat({ '9x10': [80] })), ['7x9', '3x9'], 'and of 9 × 10');
  const older = ninesCat(null, null, true), hard = E.hardFacts(older, 9, STORIES).map(p => p.slice().sort((x, y) => x - y).join('x'));
  assert.ok(hard.includes('2x9') && hard.includes('9x10'), 'the older slow answers are hard to E.hardFacts: ' + hard.join(' '));
  assert.deepEqual(facts(older), ['7x9', '3x9'], 'chapter 2’s 9 × 2 and chapter 4’s 10 × 9 slow: never picked, the line says “Yesterday”');
  assert.deepEqual(facts(ninesCat(null, { '9x8': 9000 }, true)), ['9x8 hard', '3x9']);
  for (const k of ['9x1', '9x8', '5x9', '7x9', '9x9', '4x9', '9x6']) {
    const run = play(ninesCat({ [k]: [1] }), 'ch06-nines');
    assert.equal(pairKey(run[0].k), pairKey(k), k + ': her hard nine is asked first');
    assert.equal(run[1].k, '3x9', k + ': 3 × 9 is written last');
  }
  // the engine words the first question; the second is Tallyheart's, with the rim's three
  const quick = play(ninesCat(null, { '9x8': 9000 }), 'ch06-nines', null, { '9x8': 2500 });
  assert.deepEqual(quick.map(x => [x.k, x.prompt.map(p => p.text).join(' ')]), [['9x8', 'Eight cats. How many lives?'], ['3x9', 'Three cats, nine lives each. How many lives?']]);
  assert.deepEqual([quick[0].kind, quick[0].line], ['remembered', 'Yesterday, 9 × 8 made you stop and think. Not today!']);
  assert.deepEqual(quick[1].balloons.map(b => b.text), ['Twenty-seven! Hop, then tuck.']);
  assert.deepEqual(quick[1].picture.who, RIM5.slice(0, 3));
  const slow = play(ninesCat(null, { '9x8': 9000 }), 'ch06-nines', null, { '9x8': 9000 });
  assert.deepEqual([slow[0].kind, slow[0].line], ['rememberedSlow', '9 × 8 again, and you got it. It’s getting easier.']);
  // the hop and the tuck on each question; a miss: chapter 5's nines help, and easy nines lent, in chapter 5's words
  quick.forEach(x => assert.deepEqual([x.q.light, x.light.length], ['tuck', 2], x.k));
  const miss = play(ninesCat(), 'ch06-nines', { '7x9': [62], '3x9': [28] });
  assert.deepEqual(ks(miss), ['7x9✗', '3x9✗', 'F:9x1', 'R:7x9', 'R:3x9']);
  assert.deepEqual([miss[0].help.intro, miss[0].help.nums.slice(0, 7), miss[2].prompt.map(p => p.text).join(' ')], ['Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.', [10, 20, 30, 40, 50, 60, 70], 'One from yesterday. One cat. How many lives?']);
  assert.deepEqual(ks(play(ninesCat(), 'ch06-nines', { '3x9': [28] })), ['7x9', '3x9✗', 'F:9x1', 'F:2x9', 'R:3x9'], 'two easy nines lent after a miss on 3 × 9');
  saidIn(miss).forEach(l => assert.doesNotMatch(l, /\blast\b/i, 'nobody says “last one”'));
  // none of the frame's own lines is said again over the first question, so its clock is the fact's
  assert.equal(frames[countsAt('ch06-nines')[0]].counts.intro, false);
  assert.equal(E.readFirst({ set: 'ch06-nines', a: 7, b: 9 }, STORIES, null, true), false, 'the opener is timed on itself');
  assert.equal(E.readFirst({ set: 'ch06-nines', a: 3, b: 9 }, STORIES, null, false), true, '3 × 9 is read under its own prompt');
});

test('the lesson, the build notes’ tests: ten facts in the story’s order, the made patrols lit; Tallyheart’s lines; every miss hops from the first patrol and comes back two questions later, before its twin; a missed 3 × 8 survives a quick 8 × 3; four patrols before it', () => {
  const rows = play(ninesCat(), 'ch06-threes', null, { all: 6000 });
  assert.deepEqual(ks(rows), ['1x3', '3x2', '3x3', '3x5', '6x3', '7x3', '3x8', '3x4', '3x7', '8x3']);
  assert.deepEqual(rows.map(x => x.q.answer), [3, 6, 9, 15, 18, 21, 24, 12, 21, 24]);
  assert.deepEqual(rows.map(x => x.picture.highlight), [0, 3, 6, 0, 15, 18, 21, 0, 0, 0], 'a step-off opens with the patrols it made lit');
  rows.forEach(x => assert.deepEqual([x.q.per, x.q.table, x.picture.kind, x.teacher], [3, 3, undefined, 'tallyheart'], x.k));
  const ask = k => rows.find(x => x.k === k).prompt.map(p => p.label + ': ' + p.text).join(' | ');
  assert.deepEqual(['1x3', '3x5', '8x3'].map(ask), ['Tallyheart: One patrol. How many cats?', 'Tallyheart: Five patrols. How many cats?', 'Tallyheart: Eight patrols. How many cats?'], 'the engine asks the three with no words of their own');
  assert.equal(ask('6x3'), 'Tallyheart: Six patrols. Five patrols made fifteen. Hop three more.');
  assert.equal(ask('3x7'), 'Tallyheart: Seven patrols? You did that one the other way round.');
  const said = k => { const x = rows.find(y => y.k === k); return x.balloons.length ? x.balloons.map(b => b.text).join(' | ') : x.line; };
  assert.deepEqual(['1x3', '3x2', '3x3', '3x5', '3x4', '3x7', '8x3'].map(said), ['Three! One patrol, one hop.', 'Six! You’ve known that one since your second day.', 'Nine! That’s a new one.', 'Fifteen! Like the claws.', 'Twelve! Same fact, turned round.', 'Twenty-one! Same fact.', 'Twenty-four! Same fact.']);
  assert.deepEqual(['6x3', '7x3', '3x8'].map(said), story.counts['ch06-threes'].praise, 'the praise, dealt in order, where a fact has no words of its own');
  const quick = play(ninesCat(), 'ch06-threes', null, { all: 1500 });
  assert.deepEqual(['6x3', '7x3', '3x8'].map(k => quick.find(x => x.k === k).line), ['Quick as a pounce!', 'Hop, hop, hop!', 'You knew that one before I finished asking.'], 'quick lines when she is quick, never two in a row');
  // every single miss: the help hops from the first patrol; “Close.” within one hop; a step-off ends on its own
  // line; the fact comes back two questions later (and before its twin), its made patrols lit again
  const FACTS = ['1x3', '3x2', '3x3', '3x5', '6x3', '7x3', '3x8', '3x4', '3x7', '8x3'];
  FACTS.forEach((k, i) => {
    const [a, b] = k.split('x').map(Number), right = a * b;
    const near = play(ninesCat(), 'ch06-threes', { [k]: [right - 3] }), far = play(ninesCat(), 'ch06-threes', { [k]: [right + 7] });
    const m = near.find(x => x.k === k + '✗');
    assert.equal(m.help.intro, HOP, k + ': within one hop');
    assert.equal(far.find(x => x.k === k + '✗').help.intro, FAR, k + ': further off');
    assert.deepEqual(m.help.nums, Array.from({ length: m.q.groups }, (_, j) => 3 * (j + 1)), k + ': hopped from the first patrol');
    assert.equal(m.help.ground, 'sand');
    const def = story.counts['ch06-threes'].facts[i];
    assert.equal(m.line, def.miss || 'There. We’ll come back to that one.', k + ': its own line');
    const back = near.findIndex(x => x.k === 'R:' + k);
    assert.equal(back - near.indexOf(m), 3, k + ': comes back two questions later (' + ks(near).join(' ') + ')');
    assert.equal(near[back].picture.highlight, def.lit || 0, k + ': lit again on its retry');
    // before its twin
    const twin = { '7x3': '3x7', '3x8': '8x3', '6x3': null, '3x3': null };
    if (twin[k]) assert.ok(back < near.findIndex(x => x.k === twin[k]), k + ': before ' + twin[k]);
  });
  // a step-off missed for the last time ends without its last sentence
  const thrice = play(ninesCat(), 'ch06-threes', { '6x3': [15, 15, 15] }).filter(x => x.k.endsWith('6x3✗'));
  assert.deepEqual(thrice.map(x => x.line), ['Five patrols made fifteen. One more hop: eighteen. We’ll come back to that one.', 'Five patrols made fifteen. One more hop: eighteen. We’ll come back to that one.', 'Five patrols made fifteen. One more hop: eighteen.']);
  // 8 × 3 is a check: a missed 3 × 8 is still hard for chapter 7 after a quick 8 × 3; a quick lesson leaves
  // only 3 × 5 timed on itself
  const c38 = ninesCat(); play(c38, 'ch06-threes', { '3x8': [21] }, { all: 1500 });
  assert.deepEqual(E.hardFacts(c38, 3, STORIES), [[3, 8]]);
  const cslow = ninesCat(); play(cslow, 'ch06-threes', null, { all: 9000 });
  assert.deepEqual(E.hardFacts(cslow, 3, STORIES), [[3, 5]], 'every other fact is read under words or is a check');
  assert.equal(E.readFirst({ set: 'ch06-threes', a: 1, b: 3 }, STORIES), true, '1 × 3 is read under the frame’s balloon');
  // the closing line, after the last answer
  assert.equal(story.counts['ch06-threes'].done, 'That’s the threes.');
  // four patrols, before the lesson: a miss hops the sand 3, 6, 9, 12 and lends the lesson's easiest, on the same path
  const four = play(ninesCat(), 'ch06-four', { '4x3': [11, 10] });
  assert.deepEqual(ks(four), ['4x3✗', 'F:1x3', 'F:3x2', 'R:4x3✗', 'F:3x3', 'F:3x5', 'R:4x3']);
  assert.deepEqual([four[0].help.nums, four[0].help.intro, four[1].prompt.map(p => p.text).join(' '), four[2].prompt.map(p => p.text).join(' ')], [[3, 6, 9, 12], HOP, 'One patrol. How many cats?', 'Two patrols. How many cats?']);
  assert.deepEqual(four[6].balloons.map(b => b.text), ['Twelve! Now let’s hop. It’s quicker.'], 'the right line is the same on the retry');
  four.filter(x => x.q.filler).forEach(x => assert.deepEqual([x.line, x.picture.kind, x.teacher], ['', undefined, 'tallyheart'], x.k));
});

test('the story questions’ fillers, by the borrowing rule (the spec’s sentence under `ch06-watchers`): the lesson ends the siblings’ run; the watchers, Sleet and the guards lend what the others have not, the five easiest coming round again', () => {
  const lent = rows => rows.filter(x => x.q.filler).map(x => pairKey(x.k)).join(' ');
  // the four patrols borrowed 1 × 3 and 3 × 2; the lesson in between ends the run, so the watchers lend them again
  let c = ninesCat();
  play(c, 'ch06-four', { '4x3': [11] }); play(c, 'ch06-threes');
  const w = play(c, 'ch06-watchers', { '3x3': [8, 6] });
  assert.equal(lent(w), '1x3 2x3 3x4 3x5', 'the watchers, missed twice');
  w.forEach(x => assert.deepEqual(x.picture.who, REED9, x.k + ': ReedClan’s coats, the borrowed ones too'));
  assert.deepEqual([w[0].help.ground, w[0].help.nums], ['earth', [3, 6, 9]]);
  assert.deepEqual(w[6].balloons.map(b => b.who + ': ' + b.text), ['player: NINE? I only saw three!', 'sloshbank: That is the point of reeds.']);
  // Sleet after the watchers missed twice: all five easiest are used, so 1 × 3 and 3 × 2 again, his way
  const s = play(c, 'ch06-sleet', { '7x3': [20] });
  assert.equal(lent(s), '1x3 2x3');
  assert.deepEqual(s.map(x => x.prompt.map(p => (p.label || 'caption') + ': ' + p.text).join(' / ')), ['caption: How many times does Mama hear HERE?', 'The silver-white dragon: A smaller roll call! One dragonet. How many HEREs?',
    'The silver-white dragon: A smaller roll call! Two dragonets. How many HEREs?', 'The silver-white dragon: My roll call AGAIN! Seven of us, three HEREs each. How many HEREs?']);
  assert.deepEqual([s[0].help.intro, s[0].help.picture, s[0].help.counter, s[0].help.nums, s[0].line], ['Count every HERE! Hop by threes.', true, 'player', [3, 6, 9, 12, 15, 18, 21], 'There! I’ll ask you AGAIN in a minute.']);
  s.forEach(x => assert.deepEqual([x.picture.kind, x.teacher], ['roll', 'sleet'], x.k + ': his roll call, his voice'));
  assert.ok(s.every(x => x.q.groups <= 7), 'never more dragonets than the clutch');
  const g = play(c, 'ch06-guards', { '3x6': [17] });
  assert.equal(lent(g), '1x3 2x3', 'the guards: everything has been lent, so the pool comes round again');
  assert.deepEqual(g[3].balloons.map(b => b.who + ': ' + b.text), ['grizzled: Eighteen!']);
  // one watchers miss, then Sleet: the next easiest, four and five dragonets; then the guards: 1 × 3 and 3 × 2 again
  c = ninesCat(); play(c, 'ch06-four'); play(c, 'ch06-threes');
  assert.equal(lent(play(c, 'ch06-watchers', { '3x3': [8] })), '1x3 2x3');
  assert.equal(lent(play(c, 'ch06-sleet', { '7x3': [20] })), '3x4 3x5');
  assert.equal(lent(play(c, 'ch06-guards', { '3x6': [17] })), '1x3 2x3');
  // one watchers miss and no Sleet: the guards lend what the watchers did not
  c = ninesCat(); play(c, 'ch06-four'); play(c, 'ch06-threes');
  play(c, 'ch06-watchers', { '3x3': [8] });
  assert.equal(lent(play(c, 'ch06-guards', { '3x6': [17] })), '3x4 3x5');
  // a missed filler of Sleet's comes back in his words and is cheered his way
  c = ninesCat(); play(c, 'ch06-threes');
  const s2 = play(c, 'ch06-sleet', { '7x3': [20], '1x3': [4] });
  assert.deepEqual([ks(s2), s2[s2.length - 1].line], [['7x3✗', 'F:1x3✗', 'F:3x2', 'R:7x3', 'R:1x3'], 'You pass!']);
  // no story question ever falls back on a sentence of the engine's but the shared retry opening
  [w, s, g, s2].forEach(rows => saidIn(rows).forEach(l => assert.ok(!DEFAULTS.includes(l) || ['Here’s that one again.', 'There. We’ll come back to that one.', 'There. Now you’ve seen it counted.'].includes(l), l)));
});

test('the Training Hollow after chapter 6: it offers “Patrols · the 3s”, Tallyheart says “threes” there, and the tree has six marks', () => {
  const cat = fresh();
  read(cat, { sleet: true });
  assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes']]);
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(x => x.name), ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s', 'Nine lives · the 9s', 'Patrols · the 3s']);
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, STORIES).opts.marks, 6);
  assert.ok(6 <= E.MAX_MARKS);
  const def = E.hollowDef(STORIES, 3);
  assert.deepEqual([E.hollowRoundLine(def), E.hollowWord(def), def.id, def.teacher, def.thing], ['A round of threes. Ready? Here we go.', 'threes', 'hollow-3s', 'tallyheart', 'cat']);
  ['fillFrom', 'fillOrder', 'facts', 'firstPrompt', 'ground', 'help', 'fillPicture'].forEach(k => assert.ok(!(k in def), k));
  const R = E.hollowStart(cat, STORIES, 1, 3), asked = [];
  for (let q; (q = E.counts.question(R.state));) { asked.push(pairKey(q.a + 'x' + q.b)); assert.match(E.promptLines(R.def, R.def, q)[0].text, /^(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten) patrols?\. How many cats\?$/); E.counts.answer(R.state, R.def, q.answer, 2000, 1); }
  assert.deepEqual(asked.sort(), ['1x3', '2x3', '3x10', '3x3', '3x4', '3x5', '3x6', '3x7', '3x8', '3x9'].sort());
  // the other sets teach nothing new: the 3s are the lesson's, never the four patrols', the watchers', the guards' or Sleet's
  assert.equal(E.countFor(3, STORIES).setId, 'ch06-threes');
  assert.deepEqual([E.countFor(10, STORIES).setId, E.countFor(9, STORIES).setId], ['ch04-tens', 'ch05-nines']);
});

test('the 3s are learned at the lesson, not at the four patrols before it: until Tallyheart teaches them the Hollow offers no 3s and the tree has five marks', () => {
  const cat = fresh(), hollow = () => E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, STORIES).opts.marks;
  const names = () => E.hollowLines(cat, STORIES).counts.map(x => x.name);
  const FIVE = ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s', 'Nine lives · the 9s'];
  // the four patrols (f008, `ch06-four`) are finished, the lesson (f012) not yet begun
  read(cat, { stop: 'f009' });
  assert.ok(cat.lessons['ch06-four'] && cat.lessons['ch06-four'].finished, 'the four patrols are done');
  assert.ok(!cat.lessons['ch06-threes'], 'the lesson is not');
  assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9]);
  assert.deepEqual(names(), FIVE, 'no “Patrols · the 3s” yet');
  assert.equal(hollow(), 5, 'five marks: the sixth is scratched at f013');
  // and set aside half-way through the lesson, still not learned
  read(cat, { stop: 'f012' });
  const r = E.chapterLesson(cat, story, 'ch06-threes', 2000, STORIES);
  E.beginLesson(cat, story, 'f012', r.state);
  const q = E.counts.question(r.state);
  E.counts.answer(r.state, r.def, q.answer, 2000, 1);
  assert.deepEqual([E.learnedCounts(cat, STORIES).length, hollow()], [5, 5], 'a lesson in progress teaches nothing yet');
  // the lesson finished: the 3s, and the sixth mark that f013 scratches
  const cat2 = fresh();
  read(cat2, { stop: 'f013' });
  assert.deepEqual(E.learnedCounts(cat2, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3]);
  assert.deepEqual(E.hollowLines(cat2, STORIES).counts.map(x => x.name), FIVE.concat(['Patrols · the 3s']));
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat2, STORIES).opts.marks, 6);
  assert.equal(frames.f013.scene.opts.marks, 6, 'the frame that scratches it');
});

/* ------------------------------------------------------------------ her Case File */

test('her Case File: the three cards as the spec’s table has them, all ears; given once, in order; Sleet’s only once his scene is finished; ReedClan’s lies touching chapter 4’s `tidy`; Coil’s goes under the moss', () => {
  assert.deepEqual(Object.keys(story.cards), CARD_IDS);
  const TABLE = {
    'reed-pile': ['ear', 'Sloshbank says ReedClan’s pile is robbed too, and left tidy.'],
    'sleet-den': ['ear', 'Sleet says the fox talks about ‘a fine, dry den’.'],
    'coil-diggers': ['ear', 'Coil says small diggers come and go under our pile.']
  };
  CARD_IDS.forEach(cid => {
    const c = story.cards[cid];
    assert.deepEqual([c.mark, c.line], TABLE[cid], cid);
    assert.ok(c.line.split(/\s+/).length <= 12, cid);
    assert.deepEqual(Object.keys(c).filter(k => !['mark', 'line', 'when', 'link'].includes(k)), [], cid);
    assert.ok(!('answers' in c), cid + ': no answers (chapter 10’s)');
    assert.doesNotMatch(c.line, /weasel|tunnel|glass|scale|thief/i, cid);
  });
  assert.deepEqual(story.cards['reed-pile'].link, { with: ['tidy'], line: 'Two piles. Both left tidy.' });
  assert.deepEqual(CARD_IDS.filter(cid => story.cards[cid].when).map(cid => [cid, story.cards[cid].when]), [['sleet-den', { foundSleet: true }]]);
  assert.ok(ch04.cards.tidy, 'chapter 4’s card it lies beside');
  // where each is given: one frame each, in the order of her day
  const given = ids.filter(id => frames[id].card).map(id => [frames[id].card, id]);
  assert.deepEqual(given, [['reed-pile', ADMIT], ['sleet-den', SLEET.find(id => frames[id].card)], ['coil-diggers', F(/small diggers come and go/)]]);
  // in a reading: two new cards, three with Sleet, once each; an ear given on the frame that says it
  for (const c of SOME.slice(0, 40)) {
    const cat = fresh(c.flags), before = cat.cards.length;
    read(cat, c.o);
    const got = cat.cards.slice(before).map(k => k.id);
    assert.deepEqual(got, c.o.sleet && !c.before ? ['reed-pile', 'sleet-den', 'coil-diggers'] : c.o.sleet && c.before ? ['reed-pile', 'sleet-den', 'coil-diggers'] : ['reed-pile', 'coil-diggers'], comboName(c));
    assert.equal(new Set(cat.cards.map(k => k.id)).size, cat.cards.length);
    assert.ok(got.every(id => cat.cards.find(k => k.id === id).chapter === 'ch06'));
    assert.deepEqual(E.cards(cat, STORIES).map(k => k.id).sort(), cat.cards.map(k => k.id).sort(), 'her file at the end: everything she holds');
  }
  // the two piles lie touching from the moment she holds both, which is at once
  const links = cat => E.caseFile(cat, STORIES).links.map(l => [l.cards.map(k => k.id).join(' + '), (l.lines || [l.line]).join(' | ')]);
  const cat = fresh();
  read(cat, { stop: ADMIT });
  assert.ok(E.hasCard(cat, 'reed-pile') && E.fileNeighbours(E.caseFile(cat, STORIES), 'tidy', 'reed-pile'));
  assert.ok(links(cat).some(l => /tidy \+ reed-pile|reed-pile \+ tidy/.test(l[0]) && l[1] === 'Two piles. Both left tidy.'), JSON.stringify(links(cat)));
  // every card in a link is counted once, and none is lost
  const Fl = E.caseFile(cat, STORIES), all = Fl.groups.reduce((a, g) => a.concat(g.cards), []).concat(Fl.links.reduce((a, l) => a.concat(l.cards), [])).map(k => k.id);
  assert.deepEqual(all.slice().sort(), E.cards(cat, STORIES).map(k => k.id).sort());
  // her nest at bedtime: today's bark along the edge; Coil's card is one of the secrets under the moss on every path
  const both = reading({ ch3Told: false }, { sleet: true });
  const nest = E.resolveScene(frames[NEST].scene, both.cat, STORIES).opts;
  assert.deepEqual([nest.hidden, nest.bark.map(b => b.picture).filter(p => CARD_IDS.includes(p))], [true, ['reed-pile', 'sleet-den', 'coil-diggers']]);
  assert.ok(A.render(E.resolveScene(frames[NEST].scene, both.cat, STORIES), { look: { fur: 'grey', sex: 'she', marking: 'none', eyes: 'green' } }).svg.length > 0);
});

/* ------------------------------------------------------------------ the optional scene */

test('Sleet, through the engine: following the trail finds him, his riddle, his card, his page and the flag on the last frame; “Not today” sets nothing; Back before the last frame, then “Not today”, leaves nothing; a second reading has its own labels, and carries his “five” under the bridge', () => {
  // found: the scene, his riddle, his card, the flag on its last frame; his news under the bridge
  const a = reading({ specialty: 'sneaking' }, { sleet: true });
  assert.deepEqual(a.ids.filter(id => SLEET.includes(id)), SLEET.filter(id => !same(frames[id].when, KEPT)), 'every panel of the told path’s scene');
  assert.deepEqual([a.cat.flags.foundSleet, E.hasCard(a.cat, 'sleet-den'), !!a.cat.lessons['ch06-sleet']], [true, true, true]);
  assert.ok(SLEET.slice(0, -1).every(id => !frames[id].sets), 'never a choice, never his tail: the flag is the last frame’s');
  assert.match(a.w, /Sleet says: five\. And he’s in charge\./);
  assert.deepEqual(rowAt(a.rows, countsAt('ch06-sleet')[0]).lesson.map(l => l.k), ['7x3']);
  assert.deepEqual(rowAt(a.rows, TRAIL).options, ['Follow the fox trail to the last post.', 'Not today. Sprinkle’s fish are waiting.']);
  // not today: the grass's huff, nothing set; she saw his tail, and Sprinkle names nobody
  const b = reading({ specialty: 'sneaking', ch3Told: false }, { sleet: false });
  assert.ok(!b.cat.flags.foundSleet && !E.hasCard(b.cat, 'sleet-den') && !b.cat.lessons['ch06-sleet']);
  assert.deepEqual(b.ids.filter(id => NOT.includes(id) || SLEET.includes(id)), [NOT[1]]);
  assert.deepEqual(rowAt(b.rows, NOT[1]).say.map(x => x.label + ': ' + x.text), ['Riffle: Fish don’t wait. They get SMELLY.', 'The long grass: HMPH!']);
  assert.doesNotMatch(b.w, /Sleet/, 'his name is nowhere');
  assert.match(b.w, /I saw a silver-white tail!\nSprinkle: My eldest brother LOVES long grass\./);
  // Back from any frame of the scene before its last, then "Not today": no flag, no card in her file, no page
  SLEET.filter(id => !same(frames[id].when, KEPT)).slice(0, -1).forEach(stop => {
    const cat = fresh({ specialty: 'sneaking' });
    read(cat, { sleet: true, stop });
    if (at(stop) >= at(SLEET.find(id => frames[id].card))) assert.ok(cat.cards.some(k => k.id === 'sleet-den') && E.cards(cat, STORIES).some(k => k.id === 'sleet-den'), stop + ': on the frame that gives it and after, it is going into her file');
    while (cat.frame !== TRAIL) assert.ok(E.back(cat, story), stop);
    const rest = read(cat, { sleet: false });
    assert.ok(!cat.flags.foundSleet, stop);
    assert.ok(!E.cards(cat, STORIES).some(k => k.id === 'sleet-den'), stop + ': no card in her file');
    assert.ok(!E.dragonets(cat, STORIES).found.some(d => d.id === 'sleet'), stop + ': no page in her book');
    assert.doesNotMatch(readWords(rest), /Sleet/, stop + ': nothing afterwards says his name');
    assert.ok(!E.buildFullBook(cat, STORIES).pages.some(pg => /Sleet/.test(pg.recap.join(' '))), stop);
  });
  // sticky: Back after the last frame keeps him; a second reading reads the flag, with its own labels, and
  // carries his “five” to Sprinkle even after “Not today”
  const d = fresh({ specialty: 'sneaking' });
  read(d, { sleet: true, stop: BRIDGE });
  assert.ok(E.back(d, story) && d.flags.foundSleet);
  read(d, { sleet: true });
  E.startChapter(d, story, 9000);
  const second = read(d, { sleet: false, t: 9000 });
  assert.deepEqual(rowAt(second, TRAIL).options, ['Go and see Sleet again.', 'Not today. He’s spying.']);
  assert.match(readWords(second), /Sleet says: five\. And he’s in charge\./, 'the lines under the bridge read the flag, not this reading’s choices');
  assert.equal(d.cards.filter(k => k.id === 'sleet-den').length, 1);
  // her page, and the told path's company: Tallyheart at the post on the told path, Riffle on both
  assert.deepEqual(E.dragonets(a.cat, STORIES).found.map(dn => dn.id + (dn.pose ? ':' + dn.pose : '')).slice(-1), ['sleet:puff']);
  assert.deepEqual(rowAt(a.rows, SLEET[0]).say.map(x => x.label), ['Tallyheart']);
  assert.deepEqual(rowAt(b.rows, NOT[1]).say.map(x => x.who), ['riffle', 'sleet']);
});

/* ------------------------------------------------------------------ the Taps and the questions */

test('the Taps that count log nothing: five patrols, Sleet’s forepaw, the bedtime patrols; nor do the one-tap pages or Tallyheart’s five Counts; 16 typed answers, 17 with Sleet', () => {
  const cat = fresh({ specialty: 'noticing' }), n0 = cat.counts.length;
  const rows = read(cat, { sleet: true, unfair: true });
  rows.forEach((x, i) => { if (['skip', 'scratch', 'ask', 'next', 'choice'].includes(x.kind) && rows[i + 1]) assert.equal(rows[i + 1].counts, x.counts, x.id + ' logs nothing'); });
  assert.deepEqual(rows.filter(x => x.kind === 'skip').map(x => x.skip.groups), [5, 1, 6]);
  assert.deepEqual(rows.filter(x => x.kind === 'scratch').map(x => frames[x.id].scratch.tap), ['pinecone', 'paw', 'stone', 'paw', 'eyes', 'pebbles', 'cheeks', 'ears']);
  rows.filter(x => x.kind === 'scratch').forEach(x => { assert.deepEqual(x.scratched, [], x.id); assert.equal(x.tap.kind, 'tap', x.id); });
  assert.equal(cat.counts.length - n0, 17, 'sixteen answers, and his riddle');
  const typed = o => { const c2 = fresh({ specialty: 'sneaking' }), m = c2.counts.length; read(c2, o); return c2.counts.length - m; };
  assert.deepEqual([typed({}), typed({ sleet: true }), typed({ unfair: true, light: 1 })], [16, 17, 16]);
  // 5 + 6 counting taps for every cat, and one more for Sleet's forepaw
  assert.equal(ids.filter(id => frames[id].skip).reduce((m, id) => m + E.skipFor(frames[id].skip, { flags: {} }).groups, 0), 12);
});

test('a big number is on a page only straight after a count she made: the 15 after the five patrols, the 18 after the bedtime patrols, and never Sleet’s 5', () => {
  const carried = new Set();
  for (const c of SOME) {
    const cat = catFor(c.flags, c.o);
    let id = story.start, prev = null;
    for (let guard = 0; guard < 600 && id; guard++) {
      id = E.landing(cat, story, id);
      const f = frames[id], into = E.skipInto(story, id, cat);
      const want = prev && frames[prev].skip && frames[prev].skip.carry !== false ? E.skipReached(E.skipFor(frames[prev].skip, cat)) : null;
      assert.equal(into ? E.skipReached(into) : null, want, comboName(c) + ': ' + id + ' after ' + prev);
      if (into) carried.add(prev + ':' + E.skipReached(into));
      if (f.sets) Object.assign(cat.flags, f.sets);
      if (f.end) break;
      prev = id;
      if (f.choice) { const opt = f.choice.options[pick(id, c.o)]; Object.assign(cat.flags, opt.sets || {}); id = opt.next; } else id = exits(f)[0];
    }
  }
  const five = ids.find(id => frames[id].skip && frames[id].skip.groups === 5), bed = ids.find(id => frames[id].skip && frames[id].skip.groups === 6);
  assert.deepEqual([...carried].sort(), [bed + ':18', five + ':15'].sort());
  assert.equal(E.keptSkip(story, frames[five].skip.next), null, 'nothing kept on the pages after');
});

test('Tallyheart’s five Counts: a Tap that counts nothing; her question and our cat’s answer, five times; the threes she already knows are hers to say; the tree does not change', () => {
  const askId = ids.find(id => frames[id].ask), f = frames[askId], ak = f.ask;
  assert.deepEqual([E.kindOf(f), E.exits(f)], ['ask', [countsAt('ch06-threes')[0]]]);
  assert.deepEqual(E.askView(ak, 0), { taps: 0, total: 5, done: false, who: 'tallyheart', to: 'player', pair: null, before: [], owed: 0 });
  for (let n = 1; n <= 5; n++) {
    const v = E.askView(ak, n);
    assert.deepEqual([v.pair, v.before.length, v.done], [ak.pairs[n - 1], n - 1, n === 5]);
    const sc = E.askScene(f.scene, ak, n);
    assert.deepEqual([sc.opts.marks, sc.opts.glow], [5, 'auto'], 'the five claw marks, unchanged');
    assert.deepEqual(sc.cast, f.scene.cast);
  }
  assert.deepEqual(E.askWords(ak), { prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.' });
  // the answers are the threes she has typed or met: 3 × 1, 3 × 2, 3 × 5, 3 × 10 this morning, 3 × 9 just now
  assert.deepEqual(ak.pairs.map(p => p[1]), ['Three cats, three tails!', 'Three cats, six ears!', 'Three forepaws, fifteen claws!', 'Three cats, thirty claws. Like this morning’s three rows!', 'Three cats, twenty-seven. Just now!']);
  ak.pairs.forEach(p => assert.ok(words(p[0]) <= 3 && words(p[1]) <= 9, p.join(' ')));
  // in a reading: it logs nothing, and the lesson follows with its balloon
  const rd = reading({ specialty: 'sneaking' }, {}), x = rowAt(rd.rows, askId), next = rowAt(rd.rows, ak.next);
  assert.deepEqual(x.asked, ak.pairs);
  assert.equal(next.counts - x.counts, 0);
  assert.deepEqual(next.lesson.map(l => l.k), ['1x3', '3x2', '3x3', '3x5', '6x3', '7x3', '3x8', '3x4', '3x7', '8x3']);
});

/* ------------------------------------------------------------------ the book */

function recapFor(flags) { return story.book.recap.filter(x => !x.when || E.matches(x.when, { flags })); }

test('book: title, chapter title, a 6–10 sentence recap on every path; Sleet’s page only for a cat who found him; the dream and the quiet night', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['chapterTitle', 'dragonet', 'dream', 'noDream', 'recap', 'title']);
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'The Snake in the Stones');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}paw’s dream that night was as quiet as the first watch.');
  b.recap.forEach((x, i) => {
    assert.deepEqual(Object.keys(x).filter(k => !['text', 'when'].includes(k)), [], 'recap ' + i);
    if (x.when) assert.deepEqual(x.when, { foundSleet: true }, 'recap ' + i + ': a page says “found” only for a dragonet found in this chapter');
    assert.match(x.text, /[.!?”’]$/);
    assert.ok(words(x.text) <= 31, 'recap ' + i + ': ' + words(x.text));
    assert.doesNotMatch(x.text, /\byou\b/i, 'third person');
  });
  // the spec's proposed sentences, word for word, in its order
  assert.deepEqual(b.recap.map(x => [x.when || null, x.text]), [
    [null, 'On {name}paw’s fifth morning, the old tom was asleep on his pinecone, and twenty pieces were gone in five nights.'],
    [null, 'Tallyheart taught {name}paw {their} sixth Count, patrols: the threes.'],
    [null, 'On {their} first border patrol, {name}paw met Sloshbank of ReedClan, whose pile is robbed too, and left tidy.'],
    [{ foundSleet: true }, 'At the last post of the Barking Field, {name}paw found Sleet, the eldest dragonet, spying on the fox. Sleet heard the fox talk about a fine, dry den.'],
    [null, 'Under the Old Bridge, Coil the snake traded a secret for some quiet: small diggers come and go under the pile every night.'],
    [null, 'At sunset, Tallyheart counted out eighteen guards, six patrols of three. On the first watch, nothing happened at all.'],
    [null, 'That night {name}paw dreamed of a starry cat on the Sky River, who told {them} to count what’s missing, and then ask who was there to see it.']]);
  [[{}, 6], [{ foundSleet: false }, 6], [{ foundSleet: true }, 7]].forEach(([flags, n]) => {
    const rc = recapFor(flags);
    assert.equal(rc.length, n, JSON.stringify(flags));
    assert.ok(rc.length >= 6 && rc.length <= 10);
    assert.equal(/Sleet/.test(rc.map(x => x.text).join(' ')), !!flags.foundSleet);
  });
  assert.doesNotMatch(b.recap.map(x => x.text).join(' '), /weasel|thief|thieves|stole|tunnel|glass|\b24\b|twenty-four/i);
  // his page: only for a cat who has found him, drawn with his chest puffed out
  assert.deepEqual(b.dragonet, [{ id: 'sleet', name: 'Sleet', when: { foundSleet: true }, pose: 'puff', lines: [
    'Silver-white, the eldest, and in charge of EVERYBODY. He does the roll call.',
    '{name}paw found him at the last post of the Barking Field, spying on the fox from the long grass.',
    'He says five, and that he’s in charge. Five more claws, counted.'] }]);
  b.dragonet.forEach(dn => { assert.ok(dn.lines.every(l => words(l) <= 22 && /[.!?]$/.test(l))); assert.ok(A.vocab.otherPoses.sleet.includes(dn.pose)); assert.ok(A.character('sleet', { pose: dn.pose, mood: 'happy' }).svg.length > 0); });
  // through the engine
  const page = (cat, id) => E.buildFullBook(cat, STORIES).pages.find(p => p.id === id).recap.join(' ');
  const D = cat => E.dragonets(cat, STORIES).found.map(d => d.id);
  const found = reading({ specialty: 'sneaking' }, { sleet: true }).cat, not = reading({ specialty: 'sneaking' }, {}).cat;
  assert.match(page(found, 'ch06'), /At the last post of the Barking Field, Moonpaw found Sleet, the eldest dragonet, spying on the fox\./);
  assert.doesNotMatch(page(not, 'ch06'), /Sleet/);
  assert.deepEqual([D(found).slice(-1), D(not).includes('sleet')], [['sleet'], false]);
  assert.deepEqual([E.buildBook(story, found).recap.length, E.buildBook(story, not).recap.length], [7, 6]);
  assert.equal(E.buildBook(story, not).chapter, 'Chapter 6: The Snake in the Stones');
  // a tom's page reads “his” and “him”; the dream as she typed it; no dream typed: the chapter's own line
  const tom = fresh({ specialty: 'sneaking' }); tom.look.sex = 'tom';
  read(tom, { dream: '' });
  assert.match(page(tom, 'ch06'), /Tallyheart taught Moonpaw his sixth Count, patrols: the threes\..*On his first border patrol, Moonpaw met Sloshbank.*who told him to count what’s missing/);
  assert.equal(E.buildFullBook(tom, STORIES).pages.find(p => p.id === 'ch06').dream, 'Moonpaw’s dream that night was as quiet as the first watch.');
  assert.equal(E.buildFullBook(found, STORIES).pages.find(p => p.id === 'ch06').dream, 'Moonpaw’s dream: “A snake with no eyelids.”');
  // the chapters before are as they were: chapter 5's page does not change
  assert.equal(E.buildBook(ch05, found).chapter, 'Chapter 5: Riffle’s River');
});

test('the teaser for chapter 7, curious and never scary, with no number; chapter 5’s for this one is paid off', () => {
  assert.deepEqual(story.teaser, { title: 'Chapter 7: The Counts Don’t Lie', lines: ['Tomorrow, your sixth morning count, after a night of guards.', 'Will the pile still add up?'] });
  story.teaser.lines.forEach(l => assert.ok(words(l) <= 25, l));
  assert.doesNotMatch(story.teaser.lines.join(' '), /\d|twenty|sixty|weasel|dragon|robbed|stolen|gone/i, 'no number, no answer');
  const cat = E.blankCat({}); cat.name = 'Moon';
  assert.deepEqual(E.teaser(story, cat, PC.story), { title: 'Chapter 7: The Counts Don’t Lie', lines: story.teaser.lines, built: false, next: null }, 'chapter 7 is not built: coming soon');
  // the hook it carries on: the guards are set, and tomorrow is the sixth count
  assert.match(T(F(/^Tomorrow, your sixth morning count\./)), /Will anything be missing\?/);
  // chapter 5's teaser promised a nosy old snake and guards: both are here, and the hub offers this chapter after chapter 5
  const t5 = E.teaser(ch05, cat, PC.story);
  assert.deepEqual([t5.title, t5.built, t5.next], ['Chapter 6: The Snake in the Stones', true, 'ch06']);
  const done = reading({ specialty: 'sneaking' }, {}).cat, p = E.progress(done, PC.story);
  assert.deepEqual([p.next, p.soon && p.soon.title, p.latest.id, E.status(done, PC.story)], [null, 'Chapter 7: The Counts Don’t Lie', 'ch06', 'Chapter 6 finished']);
  const c5 = E.blankCat({}); c5.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5 };
  assert.deepEqual([E.progress(c5, PC.story).next.id, E.chapterHeading(E.progress(c5, PC.story).next)], ['ch06', 'Chapter 6: The Snake in the Stones']);
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean and fill renders the same text; chapters 1 to 5 are sound beside it', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  assert.ok(E.checkStory(story).length > 0, 'chapter 6 leans on chapter 4 (ReedClan’s card lies beside `tidy`) and chapter 5 (the warm-up’s nines)');
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind], cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
  [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05].forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id));
});

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, the flag, the lessons, the taps, her cards, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) for (const light of (COMBOS.indexOf(c) % 3 ? [0] : [0, 1])) {
    const o = Object.assign({}, c.o, { light }), name = comboName(c) + ' light ' + light;
    const cat = fresh(c.flags);
    const counted = cat.counts.length, flags0 = Object.keys(cat.flags);
    const rows = read(cat, o), walked = idsOf(rows);
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch06'), name);
    rows.forEach(x => { if (x.kind !== 'end') assert.ok(x.caps.length + x.say.length + (x.sfx ? 1 : 0) + (x.options ? x.options.length : 0) > 0, name + ' ' + x.id + ' shows nothing'); });
    assert.deepEqual(walked, walk(c.flags, o).slice(), name + ': the engine walks the same frames');
    assert.equal(!!cat.flags.foundSleet, metSleet(c), name);
    assert.deepEqual(Object.keys(cat.flags).filter(k => !flags0.includes(k)).sort(), c.o.sleet && !c.before ? ['foundSleet'] : [], name + ': no other flag is set');
    const done = Object.keys(cat.lessons).filter(k => /^ch06/.test(k)).sort();
    assert.deepEqual(done, ['ch06-four', 'ch06-guards', 'ch06-nines', 'ch06-pile', 'ch06-threes', 'ch06-watchers'].concat(c.o.sleet ? ['ch06-sleet'] : []).sort(), name);
    done.forEach(s => assert.ok(cat.lessons[s].finished && cat.lessons[s].noHelp, name + ': ' + s));
    assert.equal(cat.counts.length - counted, 16 + (c.o.sleet ? 1 : 0), name + ': the typed answers; the taps never logged');
    assert.equal(cat.dreams.ch06, 'a snake with no eyelids');
    assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3]);
    assert.equal(E.status(cat, STORIES), 'Chapter 6 finished');
    const page = E.buildBook(story, cat);
    assert.ok(page.recap.length >= 6 && page.recap.length <= 10, name);
    // the speakers as the page labels them
    rows.forEach(x => x.say.forEach(bl => {
      if (bl.who === 'coil') assert.equal(bl.label, x.id === HELLO ? 'A voice' : x.id === F(/^It isn’t a stone\./) ? 'The snake' : 'Coil', name + ' ' + x.id);
      if (bl.who === 'sleet') assert.ok(['The long grass', 'The silver-white dragon', 'Sleet'].includes(bl.label), name + ' ' + x.id);
      assert.ok(bl.label && !/[{}]/.test(bl.label + bl.text), name + ' ' + x.id + ': ' + bl.label + ': ' + bl.text);
    }));
    rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.forEach(p => { if (p.who === 'sleet') assert.equal(p.label, 'The silver-white dragon', name + ' ' + x.id); })));
    // the scenes resolve for her: her stone by her nose in every den; the tree's marks glow as she has earned them
    rows.filter(x => x.scene && x.scene.set === 'den').forEach(x => assert.equal(x.scene.opts.stone, 'nose', x.id));
    rows.filter(x => x.scene && x.scene.set === 'hollow').forEach(x => assert.ok(Array.isArray(x.scene.opts.glow), x.id));
    assert.ok(E.back(cat, story));
    assert.equal(!!cat.flags.foundSleet, metSleet(c), name + ': sticky');
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 400);
  // with a miss on everything she still reaches the end, every retry and filler is asked, and every speaker of
  // a lesson's line is in that Counts frame's picture
  const cat = fresh({ specialty: 'noticing', ch3Told: false, worry: 'water' });
  const rows = read(cat, { sleet: true, unfair: true, answers: { '3x10': [13], '7x9': [62], '3x9': [28], '4x3': [11], '3x8': [21], '6x3': [16], '3x3': [8, 8], '7x3': [20, 20], '3x6': [17] } });
  assert.equal(rows[rows.length - 1].kind, 'end');
  const w = readWords(rows);
  ['Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.', 'Tallyheart: An easy one. One row of ten. How many pieces?', 'Tallyheart: One from yesterday. One cat. How many lives?',
    'Seven patrols made twenty-one. One more hop: twenty-four. We’ll come back to that one.', 'Count every HERE! Hop by threes.', 'The silver-white dragon: My roll call AGAIN! Seven of us, three HEREs each. How many HEREs?',
    'The silver-white dragon: A smaller roll call! One dragonet. How many HEREs?', 'Tallyheart: Here’s that one again.'].forEach(line => assert.ok(w.includes(line), line));
  assert.deepEqual(Object.keys(cat.lessons).filter(k => /^ch06/.test(k)).sort(), SETS.slice().sort());
  SETS.forEach(s => assert.equal(cat.lessons[s].noHelp, false, s + ': she needed the sand (or the roll call) in every one'));
  rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.concat(l.balloons).filter(y => y.who).forEach(y => assert.ok(castOf(x.id, y.who).length, x.id + ' ' + l.k + ': ' + y.who))));
  // (a cat who needed the sand says it plainly, and Tallyheart finishes it for her)
  assert.deepEqual(rowAt(rows, F(/That’s your sixth Count/)).say.map(b => b.text), ['Patrols. That’s your sixth Count.', 'I already knew half of it.', 'And you hopped the other half.']);
  // a save in the middle of the day goes through the store's own shape and comes back the same cat
  const mid = fresh({ specialty: 'climbing' });
  read(mid, { sleet: true, stop: SLEET[6] });
  const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
  assert.deepEqual([back.flags, back.cards, back.frame, back.lessons], [mid.flags, mid.cards, mid.frame, mid.lessons]);
  assert.deepEqual(idsOf(read(back, { sleet: true })), idsOf(read(mid, { sleet: true })), 'and reads on to the same end');
});
