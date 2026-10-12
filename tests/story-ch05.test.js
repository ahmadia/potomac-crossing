/* Story tests for chapter 5: node --test
 *
 * Checks app/story/ch05.js against the frame contract in docs/build.md (its sections for chapters 2
 * to 5) and against docs/chapters/05-riffles-river.md (v0.4): the frame graph (frames shown only
 * `when` they match, the three optional scenes, the two copies of “What the otters heard” and of
 * “Under the raft”), one interaction per frame, the choices and the flags, the Counts frames and
 * sets exactly as the text’s Build notes have them, the skip-counts, the pages she taps, Riffle’s
 * seven questions, her cards (given once, in order, 5 to 9 of them, with the pairs that lie
 * touching), every `when`, the speakers’ labels (the little dragon, the big-footed dragon, a Wisp
 * who never speaks), tokens, storyboards, word counts, the art vocabulary (the open river, the
 * marsh, Patience, Puddle, Wisp and what the old places gain), the staging, the time of day, the
 * generated storyboard, every frame rendered with everyone in the picture, the beats in order on
 * every path, every test the Build notes list, the book (with Puddle’s page and Wisp’s only for a
 * cat who found them, and chapter 4’s page for a cat who climbed today) on every combination, the
 * teaser for chapter 6, and whole play-throughs through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch05.test.js   prints the whole chapter, rendered three ways.
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
const story = PC.story.ch05;
const frames = story.frames;
const ids = Object.keys(frames);
const ch04 = PC.story.ch04;
const STORIES = [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, story];

/* ------------------------------------------------------------------ the contract */

// The flags a `when` may test: chapters 1 to 4's, and chapter 5's own four (the witness she asks first
// is a choice's; the other three are set by reaching a frame, never by a choice, and never unset)
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
const FLAGS = Object.assign({}, FLAGS1, FLAGS2, FLAGS3, FLAGS4, FLAGS5, { lessonClean: ['ch05-nines'] });
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end'];
// (`sfxAt`: where a frame's sound effect is lettered, when it says: the Roar, in the sky; `sfxRead`: a
// sound in words, for Read to me only, where a caption runs on into it)
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'sfxAt', 'sfxRead', 'gift', 'when', 'else', 'sets', 'card'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things', 'also']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
// Time of day comes from fx: morning at the pile and in the Hollow, day from the tower to the marsh
// and home down the river (in its late gold), sunset at the Old Bridge, dusk at the den, night in her
// nest. The roof is `day` too: chapter 4's frames, in this chapter's own hour.
const TOD = ['morning', 'day', 'sunset', 'dusk', 'night'];
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat'];
// (they take every mood; Patience has one level look, and takes none)
const BEASTS = ['riffle', 'otter', 'dog', 'sprinkle', 'reynard', 'squall', 'puddle', 'wisp'];
const RIM_ANCHORS = ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'];
const CARD_IDS = ['prints-pile', 'puddle-paws', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'prints-tracks', 'wisp-fox'];
const SETS = ['ch05-pile', 'ch05-tens', 'ch05-nines', 'ch05-otter', 'ch05-bill', 'ch05-catch', 'ch05-puddle', 'ch05-wisp'];
// the two Counts frames whose own lines are not said again over the first question (`intro: false`)
const NO_INTRO = ['ch05-tens', 'ch05-bill'];
// “found today”: she met a dragonet in this chapter
const NONE = { ch5Roof: false, foundPuddle: false, foundWisp: false }, ANY = { not: NONE };

/* ------------------------------------------------------------------ helpers */

function exits(f) { return E.exits(f); }
// every way on from a frame: its exits, and where the page turns when it does not show (`else`)
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
/* The frames that say this, in reading order; F: the one frame that does; F2: the two copies of a
 * line that is read in one of two places (“Under the raft”, “What the otters heard”). */
function FF(re) { return ids.filter(id => re.test(T(id))); }
function F(re) {
  const hit = FF(re);
  assert.equal(hit.length, 1, 'exactly one frame says ' + re + ' (' + hit.join(' ') + ')');
  return hit[0];
}
function F2(re) {
  const hit = FF(re);
  assert.equal(hit.length, 2, 'two frames say ' + re + ', one in each place (' + hit.join(' ') + ')');
  return hit;
}

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'I dreamed the heron charged a fish.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A log with four feet said hello.' },
  // a player whose own Clan name is Murmur: the new warrior is Mutterchime
  murmur: { name: 'Murmur', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Nine, eighteen, twenty-seven.' }
};
const FACT = { a: 4, b: 9, answer: 36, groups: 4, per: 9, thing: 'life', things: 'lives', also: 'One and eight make nine. ' };
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
 * taps, Riffle’s seven questions and their answers, her cards, the Counts lines, the book, the teaser. */
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
      if (f.shows && f.shows.also) out.push({ set: sid, where: 'fact ' + i + ' shows also', text: f.shows.also.trim(), ok: [] });
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
    // the instruction under a page she taps, and the small answer to a tap anywhere else
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

/* The choices that route her day (every other choice is a light one: its pick changes a panel or none). */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const TOWER = choiceAt(/^Go up and find him\./)[0];
const RAFT = choiceAt(/^Lean over, and look under the raft\.$/)[0];
const WITNESS = choiceAt(/^The ferry otters!$/)[0];
const SLIP = choiceAt(/What’s under the raft\?/)[0];
const WAITS = choiceAt(/^(Sit still and watch the reeds, like Patience|Keep still|Keep very, very still)\.$/);
const ROUTING = [TOWER, RAFT, WITNESS, SLIP].concat(WAITS);
/* The option a reader takes at a choice. `o`: `up` (the tower), `raft` ('lean': look under it after
 * the Roar; 'ask': look up, then ask Riffle after his slip; 'fine': look up, then let him keep his
 * secret), `first` ('otters' | 'heron'), `wait` (0 to 3: how many times she chooses to keep still),
 * `light` (0 or 1: every light choice's option). */
function pick(id, o) {
  if (id === TOWER) return o.up ? 0 : 1;
  if (id === RAFT) return o.raft === 'lean' ? 0 : 1;
  if (id === WITNESS) return o.first === 'heron' ? 1 : 0;
  if (id === SLIP) return o.raft === 'ask' ? 0 : 1;
  if (WAITS.includes(id)) return WAITS.indexOf(id) < (o.wait || 0) ? 0 : 1;
  return o.light || 0;
}
/* The frames a reader with these flags walks through, in order. A frame whose `when` doesn't match is
 * passed over (to its `else`, or as if its next led straight on: the engine's own E.landing); a
 * frame's `sets` and a chosen option's are flags from then on. `clean`: she needed no help in the
 * nines. The flags as they ended are on the result (`.flags`). */
function walk(flags, o) {
  o = o || {};
  const cat = { flags: Object.assign({}, flags), look: { sex: 'she' }, lessons: o.clean === false ? {} : { 'ch05-nines': { finished: true, noHelp: true } } };
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
/* What a walk put on screen: for each frame, the lines its reader saw there (with the flags she had
 * when she reached it), and what she was given to do. */
function walkLines(flags, o) {
  o = o || {};
  const cat = { flags: Object.assign({}, flags), look: { sex: 'she' }, lessons: o.clean === false ? {} : { 'ch05-nines': { finished: true, noHelp: true } } };
  return walk(flags, o).map(id => {
    const f = frames[id];
    const row = { id, kind: E.kindOf(f), lines: E.captions(f, cat).concat(E.balloons(f, cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []) };
    if (f.choice) { row.options = E.options(f, cat).map(x => E.optionLabel(x.option, cat)); Object.assign(cat.flags, f.choice.options[pick(id, o)].sets || {}); }
    if (f.sets) Object.assign(cat.flags, f.sets);
    return row;
  });
}
/* Every combination of told or kept, the specialty, the worry, Squall (met in chapter 4, met today,
 * not met), the witness first, the raft (looked under it after the Roar, asked after the slip, let
 * Riffle keep his secret) and the reeds (no wait, one, two, three): 2,880. A noticing cat caught the
 * fox's "flew" in chapter 4 (`ch4CaughtFly` is hers alone). */
const SQUALL = ['before', 'today', 'no'], RAFTS = ['lean', 'ask', 'fine'], WAIT = [0, 1, 2, 3];
const COMBOS = [];
for (const ch3Told of FLAGS3.ch3Told) for (const specialty of FLAGS1.specialty) for (const worry of FLAGS1.worry) for (const squall of SQUALL) {
  for (const first of FLAGS5.ch5First) for (const raft of RAFTS) for (const wait of WAIT) {
    const flags = { ch3Told, specialty, worry, ch2Stone: 'nose', ch2Path: 'bridge' };
    if (specialty === 'noticing') flags.ch4CaughtFly = true;
    if (squall === 'before') flags.foundSquall = true;
    COMBOS.push({ flags, squall, o: { up: squall === 'today', first, raft, wait } });
  }
}
const comboName = c => JSON.stringify(c.flags) + ' ' + JSON.stringify(c.o);
const found = c => ({ squall: c.squall !== 'no', roof: c.squall === 'today', puddle: c.o.raft !== 'fine', wisp: c.o.wait === 3 });
const today = c => { const f = found(c); return f.roof || f.puddle || f.wisp; };
// a spread of the combinations for the heavier checks: every cat on some route, every route for some cats
const SOME = COMBOS.filter((c, i) => i % 7 === 0);

/* The blocks: chapter 4's roof (going up), and the two copies of “Under the raft” and of “What the
 * otters heard” (each read in one of two places). */
const branch = (first, letter) => { const out = []; for (let id = first; new RegExp(letter + '$').test(id); id = exits(frames[id])[0]) out.push(id); return out; };
const UP = branch(frames[TOWER].choice.options[0].next, 'a'), NOT = [frames[TOWER].choice.options[1].next];
const CROSSING = exits(frames[NOT[0]])[0];
const isUp = id => UP.includes(id);
const UNDER1 = branch(frames[RAFT].choice.options[0].next, 'a');
const POINTING = frames[SLIP].choice.options[0].next;
const UNDER2 = branch(frames[POINTING].next, 'a').slice(0, UNDER1.length);
const BUBBLES2 = exits(frames[UNDER2[UNDER2.length - 1]])[0];
// from a copy's first frame (the otters' rumor) to its last (her nose at the fur), both outcomes of its light choice
const ottersFrom = s => {
  const out = [s], seen = new Set([s]), stack = [s];
  while (stack.length) {
    const n = stack.pop();
    if (/Somebody small\./.test(T(n))) continue;
    exits(frames[n]).forEach(m => { if (!seen.has(m)) { seen.add(m); out.push(m); stack.push(m); } });
  }
  return out.sort();
};
const [OTTERS1, OTTERS2] = FF(/What did you hear about the storm night\?/).map(ottersFrom);
const REED = branch(frames[WAITS[0]].choice.options[0].next, 'a');   // “The pale reed”, from the first wait to her forepaw

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch05');
  assert.equal(story.number, 5);
  assert.equal(story.title, 'Riffle’s River');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.ok(ids.length >= 170, 'a full chapter of panels (' + ids.length + ')');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'names', 'number', 'start', 'teaser', 'title']);
  // the two dragonets she may meet today, until each says his name (Wisp never speaks, and needs no label)
  assert.deepEqual(story.names, { squall: 'The little dragon', puddle: 'The big-footed dragon' });
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch05'), order.indexOf('ch04') + 1, 'chapter 5 follows chapter 4');
  assert.ok(Object.values(frames).every(f => !/^STUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 2880);
  // the scripts the page loads, in its order: chapter 4's story before chapter 5's (which copies its roof)
  const order2 = require('./_load.js').scripts().filter(s => /story\/ch\d+\.js$/.test(s));
  assert.ok(order2.indexOf('app/story/ch04.js') >= 0 && order2.indexOf('app/story/ch04.js') < order2.indexOf('app/story/ch05.js'));
});

test('frame ids run f001, f002… in reading order; every edge goes forward; the numbers have no gaps; the letters say which branch', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}[abc]?$/, id));
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
  // `c` only where a third way out needs its own two panels: the last of the reeds' loud ways out
  assert.deepEqual(lettered.filter(id => /c$/.test(id)), FF(/^FIVE!$/).concat(FF(/^When you look back, every reed looks the same\.$/)));
  // the tower's offer: going up is `a` (chapter 4's way up and roof), "Not today" is `b`, and both meet at the Crossing
  assert.ok(TOWER && UP.every(id => /a$/.test(id)) && NOT.every(id => /b$/.test(id)));
  assert.deepEqual(frames[TOWER].choice.options.map(o => o.next), [UP[0], NOT[0]], 'up, then not today');
  assert.equal(UP.length, 14, 'chapter 4’s way up and roof: ' + UP.length);
  assert.equal(UP[0].slice(1, 4), NOT[0].slice(1, 4), 'side by side under the same number');
  assert.equal(exits(frames[UP[UP.length - 1]])[0], CROSSING, 'the roof’s last frame goes to the Crossing');
  assert.match(T(CROSSING), /^At the Crossing, Riffle stands on the ferry raft/);
  assert.match(CROSSING, /^f\d{3}$/, 'at a plain number');
  // the raft: leaning over is `a` ("Under the raft"), looking up is `b`; both meet at "So who's first?"
  assert.equal(UNDER1.length, 8);
  assert.deepEqual(frames[RAFT].choice.options.map(o => o.next), [UNDER1[0], UNDER1[0].replace(/a$/, 'b')]);
  const first = exits(frames[UNDER1[7]])[0];
  assert.match(T(first), /^So who’s first\?/);
  assert.equal(frames[frames[RAFT].choice.options[1].next].next, first);
  assert.equal(first, WITNESS);
  // the witness: the otters first is `a` ("What the otters heard"), the heron first goes straight to the marsh
  const marsh = F(/^The river slides into a wide, still marsh\./);
  assert.deepEqual(frames[WITNESS].choice.options.map(o => o.next), [OTTERS1[0], marsh]);
  assert.ok(OTTERS1.every(id => /[ab]$/.test(id)) && OTTERS1.filter(id => /b$/.test(id)).length === 1, OTTERS1.join(' '));
  assert.equal(exits(frames[OTTERS1[OTTERS1.length - 1]])[0], marsh);
  assert.match(marsh, /^f\d{3}$/);
  // the reeds: keeping still is `a` ("The pale reed"); each loud way out is two panels; all meet at "Twenty fish"
  const fish = F(/^Riffle heaves four strings of fish onto the raft, puffing\./);
  assert.equal(REED.length, 14);
  assert.equal(exits(frames[REED[REED.length - 1]])[0], fish);
  WAITS.forEach((w, i) => {
    const out = frames[w].choice.options[1].next, then = frames[out].next;
    assert.match(out, i < 2 ? /b$/ : /c$/, w + ': its loud way out');
    assert.equal(then.slice(-1), out.slice(-1), 'her yell, then what it does');
    assert.equal(+then.slice(1, 4), +out.slice(1, 4) + 1);
    assert.equal(frames[then].next, fish, then + ' goes on to Twenty fish');
    assert.deepEqual([E.kindOf(frames[out]), E.kindOf(frames[then])], ['next', 'next']);
  });
  // the slip: asking is `a` (his pointing, "Under the raft" again, the bubbles), "Puddles. Fine." is `b` (two panels)
  const after = frames[SLIP].else;
  assert.deepEqual(frames[SLIP].choice.options.map(o => o.next), [POINTING, POINTING.replace(/a$/, 'b')]);
  assert.equal(frames[POINTING].next, UNDER2[0]);
  assert.equal(frames[BUBBLES2].next, after);
  const fine = frames[SLIP].choice.options[1].next;
  assert.equal(frames[frames[fine].next].next, after);
  assert.match(frames[fine].next, /b$/);
  // the second copy of the otters sits on the main line, behind `when … else` on its first frame
  assert.equal(after, OTTERS2[0]);
  assert.ok(OTTERS2.filter(id => /[ab]$/.test(id)).length === 2 && /^f\d{3}$/.test(OTTERS2[0]), OTTERS2.join(' '));
  assert.equal(frames[OTTERS2[0]].else, exits(frames[OTTERS2[OTTERS2.length - 1]])[0], 'both ways on lead to the Old Bridge');
  assert.match(T(frames[OTTERS2[0]].else), /^At the rocks, Riffle ties up the raft/);
  // every other lettered frame is a light choice's outcome: `a` and `b` at the next number, rejoining at a plain one
  const blocks = new Set([].concat(UP, NOT, UNDER1, UNDER2, [POINTING, BUBBLES2, fine, frames[fine].next], OTTERS1, REED,
    WAITS.flatMap(w => { const out = frames[w].choice.options[1].next; return [out, frames[out].next]; }), [frames[RAFT].choice.options[1].next]));
  lettered.filter(id => !blocks.has(id)).forEach(id => {
    const from = (into[id] || []).filter(p => frames[p].choice);
    assert.ok(from.length || /a$/.test(id), id + ': a light choice’s outcome');
  });
});

// The frames shown only `when` they match, in reading order: each is a screen of its own for some
// readers, and the page turns straight past it for everyone else (to its `else`, where it has one).
// Two pairs have opposite `when`s, since a frame has one interaction (a Tap for one cat, a plain page
// for the rest): they stand one after the other, so whichever is not hers is passed over.
const WHEN_FRAMES = [
  [/^Then the back row\./, { specialty: 'noticing' }, 'scratch'],
  [/^Then the back row\./, { not: { specialty: 'noticing' } }],
  [/^Tiny prints\. Each is half the size of yours\.$/, { specialty: 'noticing' }],
  [/^From the tallest tower:/, { not: { foundSquall: true, ch5Roof: false } }, 'choice'],
  [/It’s only a very tall curtain, really/, { specialty: 'climbing' }],
  [/Take the little room, darling!/, { not: { specialty: 'climbing' } }],
  [/The elevator!/, { not: { specialty: 'climbing' } }],
  [/^I found Squall! Sprinkle’s littlest brother!/, { ch5Roof: true }],
  [/^Riffle hugs his pole\. The TRACKS\? At NIGHT\? Raft first\.$/, { ch5Roof: true }],
  [/^She leans close\./, { ch3Told: true }],
  [/Otter’s honor\.$/, { worry: 'water' }],
  [/^Flew\. Again\. You know a dragon who can’t\.$/, { ch4CaughtFly: true }],
  [/^One grey feather lifts\./, { specialty: 'friends' }],
  [/^Just what Squall saw!/, { foundSquall: true }],
  [/^Tiny prints, in a line across the mud\./, { specialty: 'climbing' }, 'scratch'],
  [/^Tiny prints, in a line across the mud\./, { not: { specialty: 'climbing' } }],
  [/^From the top, you see where the prints go/, { specialty: 'climbing' }],
  [/The same somebody\?$/, { not: { ch5First: 'heron', not: { specialty: 'noticing' } } }],
  [/^A blue-grey snout pokes up between the logs\. WISP\?$/, { foundPuddle: true }],
  [/^Wisp lays one claw across her snout\. I’m a LOG\.$/, { foundPuddle: true }],
  [/^You hook the last string aboard\./, { specialty: 'swimming', not: { worry: 'water' } }],
  [/^Down go the fish\. Gulp\. Gulp\. Gulp\.$/, { foundWisp: false }],
  [/^Down go the fish\. One for Patience\. One for Wisp\. Gulp\. Gulp\. Gulp\.$/, { foundWisp: true }],
  [/^Riffle pushes off for home\./, { foundPuddle: false }, 'choice'],
  [/^At last, the Crossing again\./, { ch5First: 'heron' }, 'choice'],
  [/^Flew\. Again\. You know a dragon who can’t\.$/, { ch4CaughtFly: true }],
  [/They peek over Tallyheart’s branch\.$/, { ch3Told: true }],
  [/^At the Old Bridge, you check the bank first\./, { ch3Told: false }],
  [/^I didn’t find anyone new today\./, NONE],
  [/^I found your littlest brother\. He says: five\.$/, { ch5Roof: true }],
  [/^Puddle is under the otters’ raft\. He says: five\. Then he sank\. He does that\.$/, { foundPuddle: true }],
  [/^Wisp is in the reeds, being a heron\. She held up five\.$/, { foundWisp: true }],
  [/^Sprinkle has drawn her six little forepaws in the mud again\./, ANY, 'skip'],
  [/^Mama’s count is coming back\./, ANY],
  [/^And the deep water\? Still deep\. I looked right at it\.$/, { worry: 'water' }],
  [/^Waffles was up ALL night\. With her nerves\.$/, { specialty: 'noticing' }],
  [/Your secret is getting bigger\.|Then you whisper the rest\./, ANY]
];
// ... and the three of them that name where the page turns for everyone else
const ELSE = [[/^From the tallest tower:/, /^At the Crossing, Riffle stands/], [/^Riffle pushes off for home\./, /^At last, the Crossing again\./],
  [/^At last, the Crossing again\./, /^At the rocks, Riffle ties up the raft/]];

test('exactly one interaction per frame (the taps and the questions included), no unknown keys, and a frame `when`, `else` or `sets` only where the text has one', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    // two frames say where their sound goes: the Roar, in the sky under the airplane (left to the page, it
    // was lettered across the bottom of the panel, over the pair on the logs), and the “blub…” on the way
    // home, pale on the water just above the bubbles (it went to the top corner, by the sun)
    assert.deepEqual(f.sfxAt, f.sfx === 'ROOOOOAAAAARRRRR!' && f.scene.set === 'openriver' ? [62, 34] : f.sfx === 'blub…' ? [20, 70] : undefined, id + ': sfxAt');
    assert.equal(f.look, undefined, id + ': chapter 5 has no look frame');
    assert.equal(f.gift, undefined, id + ': chapter 5 gives no gift');
    assert.equal(f.file, undefined, id + ': her Case File was opened in chapter 4');
  });
  const whens = ids.filter(id => frames[id].when);
  assert.deepEqual(whens.map(id => frames[id].when), WHEN_FRAMES.map(w => w[1]));
  whens.forEach((id, i) => {
    assert.match(T(id), WHEN_FRAMES[i][0], id);
    assert.equal(E.kindOf(frames[id]), WHEN_FRAMES[i][2] || (frames[id].counts ? 'counts' : 'next'), id);
    assert.notEqual(id, story.start);
    const keys = w => Object.keys(w).forEach(k => { if (k === 'not') keys(w.not); else assert.ok(FLAGS[k], id + ': when ' + k); });
    keys(frames[id].when);
    // a frame with a `when` has one way on, or says where the page turns when it does not show
    if (!frames[id].else) assert.equal(exits(frames[id]).length, 1, id + ': one way on');
  });
  const elses = ids.filter(id => frames[id].else);
  assert.equal(elses.length, ELSE.length);
  elses.forEach((id, i) => {
    assert.match(T(id), ELSE[i][0], id);
    assert.match(T(frames[id].else), ELSE[i][1], id + ' turns to ' + frames[id].else);
    assert.ok(frames[id].when, id + ': else goes with a when');
  });
  // the flags set by reaching a frame, for good: the roof's last frame, the last frame of "Under the raft" (both copies), of "The pale reed"
  const sets = ids.filter(id => frames[id].sets);
  assert.deepEqual(sets.map(id => frames[id].sets), [{ foundSquall: true, ch5Roof: true }, { foundPuddle: true }, { foundWisp: true }, { foundPuddle: true }]);
  assert.deepEqual(sets, [UP[UP.length - 1], UNDER1[7], REED[13], UNDER2[7]]);
  sets.forEach(id => assert.ok(frames[id].skip && frames[id].skip.groups === 1 && frames[id].skip.carry === false, id + ': a scene’s last frame, with its forepaw Tap'));
  // one choice sets a flag, the witness she asks first; no choice sets one a frame sets for good
  ids.filter(id => frames[id].choice).forEach(id => frames[id].choice.options.forEach((o, i) => {
    assert.deepEqual(o.sets, id === WITNESS ? { ch5First: ['otters', 'heron'][i] } : {}, id);
  }));
});

test('a child who listens hears every sentence finished: the three captions that run on into their sound effect have the sound in words for Read to me (`sfxRead`), said after that caption and before any balloon; no other page is heard differently, and no page is lettered differently', () => {
  // Read to me reads captions, then balloons; a sound effect is lettering and is never read. With
  // nothing for the listener, the slaps never came (“On the rocks, otter tails go” … “YOU DID IT!”),
  // the pinecone joke lost its last word, and the tower said nothing.
  const SLAP = F(/^Riffle turns a somersault\./), SNORE = F(/Then, a little later:/);
  const HEARD = { [TOWER]: 'a roar, and a tiny hiccup.', [SLAP]: 'Slap! Slap! Slap!', [SNORE]: 'a long, long snore.' };
  assert.deepEqual(ids.filter(id => frames[id].sfxRead !== undefined), [TOWER, SLAP, SNORE]);
  const some = [{ flags: {} }, { flags: { foundSquall: true, ch5Roof: false, foundPuddle: true, foundWisp: true, worry: 'small', specialty: 'swimming' } },
    { flags: { foundSquall: false, specialty: 'climbing', worry: 'shiny', ch2Stone: 'nose' } }, { flags: { foundSquall: true, ch5Roof: true, worry: 'water', ch2Stone: 'chin' } }];
  ids.forEach(id => {
    const f = frames[id];
    // every caption that runs on into a sound effect (as written: shown to her or not)
    const runsOn = (f.caption || []).map(capText).filter(t => !E.endsSentence(t));
    if (f.sfx && runsOn.length) assert.equal(f.sfxRead, HEARD[id], id + ': “' + runsOn[0] + '” runs on into ' + f.sfx + ', and a listener never hears it');
    if (f.sfxRead === undefined) {
      some.forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), id + ': heard as it is lettered'));
      return;
    }
    assert.equal(f.sfxRead, HEARD[id], id);
    assert.equal(runsOn.length, 1, id + ': one caption runs on into the sound');
    assert.equal(capWhen(f.caption.find(c => capText(c) === runsOn[0])), null, id + ': and every reader sees it');
    assert.deepEqual(tokensIn(f.sfxRead), [], id + ': no tokens');
    assert.ok(words(f.sfxRead) <= 6 && E.endsSentence(f.sfxRead), id + ': a few words, and they end the sentence');
    assert.deepEqual(badGrammar(f.sfxRead, true), [], id);
    assert.ok(['next', 'choice'].includes(E.kindOf(f)), id + ': a page that reads its captions through the lettering');
    // lettered exactly as before: the words are in no caption and no balloon
    some.forEach(c => {
      assert.ok(!E.captions(f, c).includes(f.sfxRead) && !E.balloons(f, c).some(b => b.text === f.sfxRead), id);
      const heard = E.captionsRead(f, c), at = heard.indexOf(runsOn[0]);
      assert.equal(heard[at + 1], f.sfxRead, id + ': right after the caption it finishes');
      assert.deepEqual(heard.slice(0, at + 1).concat(heard.slice(at + 2)), E.captions(f, c), id + ': the captions, in order, and that one line more');
    });
  });
  // the tower: the roar comes before the captions only some cats read, and before the choices
  const notMet = { flags: { foundSquall: false, specialty: 'noticing' } }, climber = { flags: { foundSquall: false, specialty: 'climbing' } }, again = { flags: { foundSquall: true, ch5Roof: true } };
  assert.deepEqual(E.captionsRead(frames[TOWER], notMet), ['From the tallest tower:', 'a roar, and a tiny hiccup.', 'Sprinkle’s littlest brother is still up there.']);
  assert.deepEqual(E.captionsRead(frames[TOWER], climber), ['From the tallest tower:', 'a roar, and a tiny hiccup.', 'Sprinkle’s littlest brother is still up there.', 'Balcony, balcony, balcony, roof. You could still climb that.']);
  assert.deepEqual(E.captionsRead(frames[TOWER], again), ['From the tallest tower:', 'a roar, and a tiny hiccup.']);
  // the slaps: between the caption and Riffle's shout (the page reads captions, then balloons)
  assert.deepEqual(E.captionsRead(frames[SLAP], notMet).concat(E.balloons(frames[SLAP], notMet).map(b => b.text)),
    ['Riffle turns a somersault.', 'On the rocks, otter tails go', 'Slap! Slap! Slap!', 'YOU DID IT!']);
  assert.equal(frames[SLAP].sfxRead, frames[SLAP].sfx, 'the slaps can be said as they are lettered');
  // the pinecone: the joke's last word
  assert.deepEqual(E.captionsRead(frames[SNORE], notMet), ['From the prey pile comes a small “Ow.” Then, a little later:', 'a long, long snore.']);
  assert.equal(frames[SNORE].say, undefined);
  assert.deepEqual(E.checkStory(story, STORIES), []);
});

test('every next / option / input / counts / skip / scratch / ask / else target exists, and every frame is reachable', () => {
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const seenIds = new Set([story.start]);
  const stack = [story.start];
  while (stack.length) ways(frames[stack.pop()]).forEach(n => { if (!seenIds.has(n)) { seenIds.add(n); stack.push(n); } });
  assert.deepEqual(ids.filter(id => !seenIds.has(id)), [], 'unreachable frames');
  // ... and by its exits alone: no frame hangs from an `else` only (the storyboard follows a frame's
  // exits, so a page that only an `else` led to would be missing from it)
  const byExit = new Set([story.start]), line = [story.start];
  while (line.length) exits(frames[line.pop()]).forEach(n => { if (!byExit.has(n)) { byExit.add(n); line.push(n); } });
  assert.deepEqual(ids.filter(id => !byExit.has(id)), [], 'frames only an `else` leads to');
  // and by a reader: every frame is on some path a reader takes (every combination, both light options)
  const walked = new Set();
  for (const c of COMBOS) for (const light of [0, 1]) walk(c.flags, Object.assign({ light }, c.o)).forEach(id => walked.add(id));
  assert.deepEqual(ids.filter(id => !walked.has(id)), [], 'frames no reader reaches');
});

test('the end is reachable from every frame, and there is exactly one end, the last frame', () => {
  const ends = ids.filter(id => frames[id].end);
  assert.deepEqual(ends.length, 1);
  const into = {};
  ids.forEach(id => ways(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  const ok = new Set(ends);
  const stack = ends.slice();
  while (stack.length) (into[stack.pop()] || []).forEach(p => { if (!ok.has(p)) { ok.add(p); stack.push(p); } });
  assert.deepEqual(ids.filter(id => !ok.has(id)), [], 'frames that cannot reach the end');
  assert.equal(ends[0], ids[ids.length - 1], 'the end is the last frame');
});

test('every combination reaches the end with no frame that shows nothing; “What the otters heard” is read exactly once, and Tallyheart is in none of its frames', () => {
  // one frame has lettering for some cats only, by the text: her one more question for Patience is a
  // screen of its own, with a line for a cat who talks when nervous and, for everyone, the two options
  const quiet = F(/You have a hundred questions/);
  assert.ok(frames[quiet].choice && same(frames[quiet].caption, [{ when: { worry: 'talk' }, text: 'You have a hundred questions. At two fish each, you pick one more.' }]) && !frames[quiet].say && !frames[quiet].sfx);
  const heard = FF(/What did you hear about the storm night\?/);
  for (const c of COMBOS) for (const light of [0, 1]) {
    const name = comboName(c) + ' light ' + light, rows = walkLines(c.flags, Object.assign({ light }, c.o));
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    rows.forEach(r => {
      if (r.kind === 'end') return;
      if (r.id === quiet) assert.equal(r.lines.length, c.flags.worry === 'talk' ? 1 : 0, name + ': her one more question');
      else assert.ok(r.lines.length > 0, r.id + ' shows no text to ' + name);
      if (r.options) assert.ok(r.options.length === 2, r.id + ': two options');
    });
    const p = rows.map(r => r.id);
    assert.equal(p.filter(id => heard.includes(id)).length, 1, name + ': the otters, once');
    assert.equal(p.includes(OTTERS1[0]), c.o.first === 'otters', name);
    // the order: otters first reads them before the marsh; heron first reads them after it, on the way home
    const marsh = p.indexOf(F(/^The river slides into a wide, still marsh\./)), ott = p.findIndex(id => heard.includes(id));
    assert.equal(ott < marsh, c.o.first === 'otters', name + ': the order');
    assert.equal(rows.flags, undefined);
  }
  OTTERS1.concat(OTTERS2).forEach(id => assert.equal(castOf(id, 'tallyheart').length, 0, id + ': she went home after the Roar'));
  OTTERS1.concat(OTTERS2).forEach(id => assert.equal((frames[id].say || []).filter(b => b.who === 'tallyheart').length, 0, id));
});

test('choices: nine or ten a reading and up to thirteen, labels short, one flag set (the witness first), every light one rejoins at once', () => {
  const choiceIds = ids.filter(id => frames[id].choice);
  assert.equal(choiceIds.length, 14, 'fourteen choice frames (the otters’ rumor twice): ' + choiceIds.join(' '));
  const light = choiceIds.filter(id => !ROUTING.includes(id));
  assert.equal(WAITS.length, 3);
  choiceIds.forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length === 2, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), [TOWER, RAFT].includes(id) ? ['label', 'labelWhen', 'next', 'sets'] : ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 12, id + ' option ' + i + ' label');
      assert.equal(o.when, undefined, id + ': both options are for everyone');
    });
    assert.equal(frames[id].choice.prompt, undefined, id);
  });
  // the six light choices of the text (the otters' rumor is written once and read in one of two places: seven frames)
  const L = id => frames[id].choice.options.map(o => o.label);
  const O = (id, i) => T(frames[id].choice.options[i].next);
  const [rules, roar, rumor1, question, rumor2, den, wrong] = light;
  assert.equal(light.length, 7);
  // (two of them have one answer for both options, and no outcome panel: the answer is the next screen)
  [rules, den].forEach(id => {
    const opts = frames[id].choice.options;
    assert.equal(opts[0].next, opts[1].next, id + ': one answer does for both');
    assert.match(opts[0].next, /^f\d{3}$/);
    assert.equal(+opts[0].next.slice(1, 4), +id.slice(1, 4) + 1);
  });
  assert.deepEqual(L(rules), ['“What if I move?”', '“What if I sneeze?”']);
  assert.match(O(rules, 0), /^Then you sit through it again tomorrow\. Like Riffle\. Eleven times\. TEN!$/);
  assert.deepEqual(L(den), ['“Did you jump in?”', '“Were you scared?”']);
  assert.match(O(den, 0), /^I counted\. Very loudly\.$/);
  // (the others: her pick is shown by a frame of its own, `a` or `b` at the next number, then the same next screen)
  [roar, rumor1, rumor2, wrong].forEach(id => {
    const opts = frames[id].choice.options;
    opts.forEach(o => {
      assert.equal(o.next.slice(1, 4), String(+id.slice(1, 4) + 1).padStart(3, '0'), id + ': the outcome is the next number');
      assert.equal(E.kindOf(frames[o.next]), 'next', id + ': an outcome is one panel');
    });
    assert.deepEqual(opts.map(o => o.next.slice(-1)), ['a', 'b']);
    assert.equal(frames[opts[0].next].next, frames[opts[1].next].next, id + ': a light choice rejoins at once');
  });
  assert.deepEqual(L(roar), ['Shut your eyes and count.', 'Keep your eyes open and look up.']);
  assert.match(O(roar, 0), /^Ten\. Twenty\. Thirty\. FORTY—$/);
  assert.match(O(roar, 1), /^Little round windows, all in a row\. At one, a small face is pressed to the glass\. You know that feeling\.$/);
  [rumor1, rumor2].forEach(id => {
    assert.deepEqual(L(id), ['“Who told you that?”', '“Did any of you SEE it?”']);
    assert.match(O(id, 0), /^A duck\. A very honest duck\.$/);
    assert.match(O(id, 1), /^Well… no\. A duck told me\.$/);
  });
  assert.deepEqual(L(wrong), ['“The fox!”', '“I don’t know yet.”']);
  assert.match(O(wrong, 0), /^Maybe\. But a counting cat says: not yet\.$/);
  assert.match(O(wrong, 1), /^Good\. That’s the hardest thing to say\.$/);
  // her one more question for Patience: the wrong one is nudged over two panels (her answer, then "So you ask…"), the right one over one
  assert.deepEqual(L(question), ['“Who took our prey?”', '“What did you SEE on the storm night?”']);
  const [qa, qb] = frames[question].choice.options.map(o => o.next);
  assert.match(T(qa), /^I do not guess\. Guessing is for otters\. That one is free\.$/);
  assert.match(T(frames[qa].next), /^So you ask what she SAW on the storm night\.$/);
  assert.match(T(qb), /^One yellow eye turns to you\. A good question\.$/);
  assert.equal(frames[frames[qa].next].next, frames[qb].next, 'both go on to the same answer');
  assert.match(T(frames[qb].next), /^When the rain stopped: two small shapes, crossing my mud\./);
  // the routing choices, in the text's words
  assert.deepEqual(L(TOWER), ['Go up and find him. The river can wait a little.', 'Not today. Riffle is waiting.']);
  assert.deepEqual(L(RAFT), ['Lean over, and look under the raft.', 'Look up. Is another one coming?']);
  assert.deepEqual(L(WITNESS), ['The ferry otters!', 'Patience the heron!']);
  assert.deepEqual(L(SLIP), ['“Riffle. What’s under the raft?”', '“Puddles. Fine.”']);
  assert.deepEqual(WAITS.map(L), [['Sit still and watch the reeds, like Patience.', 'Count the fish for Riffle, out loud.'],
    ['Keep still.', 'Enough! Count fish for Riffle.'], ['Keep very, very still.', 'Enough! Count fish for Riffle.']]);
  assert.match(O(RAFT, 1), /^Only blue sky\. Rafts shiver\. Ticklish logs\. VERY ticklish\.$/);
  // …and on a second reading, for a cat who knows him, that option reads “Not now. He’s being a log.”: she has
  // not looked up for another airplane, so “Only blue sky.” is not hers; Riffle keeps the game up for both
  const lookUp = frames[frames[RAFT].choice.options[1].next], knows = { flags: { foundPuddle: true } }, first = { flags: {} };
  assert.deepEqual(frames[RAFT].choice.options.map(o => E.optionLabel(o, knows)), ['Lean over, and say hello to Puddle.', 'Not now. He’s being a log.']);
  assert.deepEqual([E.captions(lookUp, first), E.captions(lookUp, knows)], [['Only blue sky.'], []]);
  assert.deepEqual([E.balloons(lookUp, first).map(b => b.text), E.balloons(lookUp, knows).map(b => b.text)], [['Rafts shiver. Ticklish logs. VERY ticklish.'], ['Rafts shiver. Ticklish logs. VERY ticklish.']]);
  assert.match(O(SLIP, 0), /^I promised Granny I wouldn’t TELL\. I’m only POINTING\.$/);
  assert.match(O(SLIP, 1), /^Best friend an otter ever had\.$/);
  assert.match(T(frames[frames[SLIP].choice.options[1].next].next), /^Under the logs, something goes blub\.$/);
  assert.match(O(WAITS[0], 1), /^ONE! TWO!$/);
  assert.match(T(frames[frames[WAITS[0]].choice.options[1].next].next), /^Every frog jumps in\. Patience shuts both eyes\. One reed flinches\.$/);
  assert.match(O(WAITS[1], 1), /^THREE!$/);
  assert.match(T(frames[frames[WAITS[1]].choice.options[1].next].next), /^The dragonfly leaves\. So do the frogs\.$/);
  assert.match(O(WAITS[2], 1), /^FIVE!$/);
  assert.match(T(frames[frames[WAITS[2]].choice.options[1].next].next), /^When you look back, every reed looks the same\.$/);
  // a spoken option is never echoed as a balloon on its outcome
  choiceIds.forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    if (said) (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
  // how many she meets: nine on every path (ten for a cat Riffle slips to), one more for the roof's offer, two more for the waits
  for (const c of COMBOS) {
    const n = walk(c.flags, c.o).filter(id => frames[id].choice).length;
    const want = 9 + (c.o.raft === 'lean' ? 0 : 1) + (c.squall === 'before' ? 0 : 1) + Math.min(c.o.wait, 2);
    assert.equal(n, want, comboName(c) + ': ' + n + ' choices');
    assert.ok(n >= 9 && n <= 13);
  }
  // how much she reads before she chooses: everything on the screen and both labels (the text: 12 to 41)
  for (const c of SOME) walkLines(c.flags, c.o).filter(r => r.options).forEach(r => {
    const n = r.lines.reduce((m, s) => m + words(s), 0) + r.options.reduce((m, s) => m + words(s), 0);
    assert.ok(n >= 7 && n <= 42, r.id + ': ' + n + ' words before she chooses, for ' + comboName(c));
  });
});

test('the roof, offered again: one screen, for a cat who has not met Squall or met him here; chapter 4’s frames, word for word; “Not today” leads to Waffles’ “AGAIN?” and then to the Crossing', () => {
  const f = frames[TOWER], opts = f.choice.options;
  // the offer comes where the day leaves camp: after "ask your river", before the Crossing
  assert.match(T(ids[at(TOWER) - 1]), /^Now go and ask your river\. And stay on the otters’ raft\. The marsh mud belongs to ReedClan\.$/);
  assert.deepEqual(f.when, { not: { foundSquall: true, ch5Roof: false } });
  assert.equal(f.else, CROSSING);
  const cat = fl => ({ flags: Object.assign({ specialty: 'friends' }, fl) });
  const never = cat({}), before = cat({ foundSquall: true }), here = cat({ foundSquall: true, ch5Roof: true }), climber = { flags: { specialty: 'climbing' } };
  assert.deepEqual([E.shows(f, never), E.shows(f, before), E.shows(f, here), E.shows(f, cat({ foundSquall: false }))], [true, false, true, true]);
  // never to a cat who met him in chapter 4 only: the page turns straight from the Hollow to the Crossing
  assert.equal(E.landing(before, story, TOWER), CROSSING);
  assert.ok(!walk({ foundSquall: true, specialty: 'friends', worry: 'talk', ch3Told: true }, {}).some(id => id === TOWER || isUp(id) || NOT.includes(id)));
  // a cat who has not met him: the roar, "still up there", a climber's line, and chapter 4's choice worded for today
  assert.deepEqual(E.captions(f, never), ['From the tallest tower:', 'Sprinkle’s littlest brother is still up there.']);
  assert.deepEqual(E.captions(f, climber), ['From the tallest tower:', 'Sprinkle’s littlest brother is still up there.', 'Balcony, balcony, balcony, roof. You could still climb that.']);
  assert.equal(f.sfx, 'RAWWWRRR… hic!');
  assert.deepEqual(opts.map(o => E.optionLabel(o, never)), ['Go up and find him. The river can wait a little.', 'Not today. Riffle is waiting.']);
  // a cat who met him here, on a second reading: the roar alone, and chapter 4's labels for a cat who knows him
  assert.deepEqual(E.captions(f, here), ['From the tallest tower:']);
  assert.deepEqual(opts.map(o => E.optionLabel(o, here)), ['Go up and see Squall again.', 'Not today. He’s guarding.']);
  assert.deepEqual(opts.map(o => o.labelWhen), [[{ when: { ch5Roof: true }, label: 'Go up and see Squall again.' }], [{ when: { ch5Roof: true }, label: 'Not today. He’s guarding.' }]]);
  const four = ch04.frames[Object.keys(ch04.frames).find(k => ch04.frames[k].choice && ch04.frames[k].choice.options.some(o => o.labelWhen))];
  assert.deepEqual(opts.map(o => o.labelWhen[0].label), four.choice.options.map(o => o.labelWhen[0].label), 'chapter 4’s labels, as ch04.js has them');
  // nobody's name before she has met him
  assert.doesNotMatch(T(TOWER), /Squall/);
  // the picture: the roof and its roar lines, the red light, nobody at the railing, our cat at the tower's foot looking up
  assert.deepEqual([camOf(TOWER), f.scene.opts, f.scene.cast.map(c => [c.who, c.pose, c.at].join(' '))], ['tower/up', { chime: true, light: true, roar: true }, ['player lookup foot']]);
  // going up: chapter 4's two roof sections, its own frames, copied under this chapter's ids
  const F4 = ch04.frames, up4 = (() => { const out = []; for (let id = four.choice.options[0].next; /a$/.test(id); id = E.exits(F4[id])[0]) out.push(id); return out; })();
  assert.equal(up4.length, UP.length);
  // …word for word and picture for picture, but for the hour: chapter 4 went up in the afternoon's gold (the
  // roof set's own light, no fx), and today she climbs in the morning, between the lesson and the Crossing:
  // the roof's frames are in plain daylight, as the tower below and the Crossing after are, and the two
  // boards that name the hour say so
  const HOUR = [['in the gold of the afternoon', 'in the bright day'], ['catch the afternoon sun', 'catch the sun']];
  let hours = 0;
  UP.forEach((id, i) => {
    const mine = JSON.parse(JSON.stringify(frames[id])), theirs = JSON.parse(JSON.stringify(F4[up4[i]]));
    const nx = fr => { ['next'].forEach(k => delete fr[k]); if (fr.counts) delete fr.counts.next; if (fr.skip) delete fr.skip.next; delete fr.sets; return fr; };
    if (theirs.scene.set === 'roof') {
      assert.deepEqual([theirs.scene.fx, mine.scene.fx], [[], ['day']], id + ': chapter 4’s afternoon, today’s daylight');
      theirs.scene.fx = ['day'];
      HOUR.forEach(([then, now]) => { if (theirs.board.includes(then)) { hours++; theirs.board = theirs.board.replace(then, now); } });
    }
    assert.doesNotMatch(mine.board, /afternoon|\bgold\b/, id + ': no board of today’s roof speaks of the afternoon');
    assert.deepEqual(nx(mine), nx(theirs), id + ' is chapter 4’s ' + up4[i] + ', word for word and picture for picture (but for the hour)');
    assert.equal(exits(frames[id])[0], i < UP.length - 1 ? UP[i + 1] : CROSSING, id);
  });
  assert.equal(hours, 2, 'the two boards that named the afternoon');
  assert.ok(UP.filter(id => frames[id].scene.set === 'roof').length >= 10 && UP.some(id => frames[id].scene.set === 'tower'));
  // chapter 4's own frames are untouched by the copy
  up4.filter(k => F4[k].scene.set === 'roof').forEach(k => assert.deepEqual(F4[k].scene.fx, [], k));
  assert.deepEqual(frames[UP[UP.length - 1]].sets, { foundSquall: true, ch5Roof: true });
  assert.deepEqual(F4[up4[up4.length - 1]].sets, { foundSquall: true }, 'chapter 4’s own last roof frame is unchanged');
  assert.equal(frames[UP.find(id => frames[id].counts)].counts.set, 'ch04-riddle', 'his riddle is chapter 4’s set');
  assert.equal(frames[UP.find(id => frames[id].card)].card, 'squall-shapes', 'and his card chapter 4’s');
  assert.ok(!story.counts['ch04-riddle'] && !story.cards['squall-shapes']);
  // a cat who has just come down from the roof does not read the offer again
  const upWalk = walk({ specialty: 'friends', worry: 'talk', ch3Told: true }, { up: true });
  assert.equal(upWalk.filter(id => id === TOWER).length, 1);
  assert.equal(upWalk[upWalk.indexOf(UP[UP.length - 1]) + 1], CROSSING);
  assert.deepEqual([upWalk.flags.foundSquall, upWalk.flags.ch5Roof], [true, true]);
  // "Not today": chapter 4's panel of Waffles drooping over her railing, her one new line, with the pet name; then the Crossing
  const not = NOT[0];
  assert.deepEqual(frames[not].say, [{ who: 'waffles', text: 'AGAIN, {petname}?', kind: 'shout' }]);
  assert.equal(frames[not].next, CROSSING);
  const notToday = F4[four.choice.options[1].next];
  assert.deepEqual(frames[not].scene, notToday.scene, 'chapter 4’s “Not today” scene');
  const noWalk = walk({ specialty: 'friends', worry: 'talk', ch3Told: true }, { up: false });
  assert.ok(noWalk.includes(not) && !noWalk.some(isUp) && !('foundSquall' in noWalk.flags) && !('ch5Roof' in noWalk.flags), 'it sets nothing');
  // the three readers of chapter 5's `when`, as E.matches reads them (false matches a flag never set)
  assert.equal(E.matches({ not: { foundSquall: true, ch5Roof: false } }, { flags: {} }), true);
  assert.equal(E.matches({ not: { foundSquall: true, ch5Roof: false } }, { flags: { foundSquall: true } }), false);
  assert.equal(E.matches({ not: { foundSquall: true, ch5Roof: false } }, { flags: { foundSquall: true, ch5Roof: true } }), true);
});

test('inputs, counts, skips, taps and the questions, in the text’s order', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  assert.match(T(inputs[0]), /^What did \{name\}paw dream about, the night \{they\} sat through the Roar\?$/);
  const ph = frames[inputs[0]].input.placeholder;
  assert.ok(typeof ph === 'string' && ph.length <= 30 && /skymonster|fish|blink/.test(ph), ph);
  // six Counts moments, up to nine (Squall's riddle, Puddle's in one of its two places, Wisp's)
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => frames[id].counts.set), ['ch05-pile', 'ch05-tens', 'ch05-nines', 'ch04-riddle', 'ch05-puddle', 'ch05-otter', 'ch05-bill', 'ch05-wisp', 'ch05-catch', 'ch05-puddle']);
  counts.forEach(id => {
    const set = frames[id].counts.set;
    // the warm-up's hard pick comes first, so none of its frame's lines is said again over it; nor is the
    // bill's one line said again over its question (with Patience's two balloons and the caption it made the
    // tallest lesson screen in the chapter: a phone hid the top row of the nine pairs she is asked to count)
    assert.deepEqual(Object.keys(frames[id].counts).sort(), NO_INTRO.includes(set) ? ['intro', 'next', 'set'] : ['next', 'set'], id);
    assert.ok(E.countsSet(set, story, STORIES), id + ': the counts set exists');
  });
  assert.deepEqual([frames[counts[1]].counts.intro, frames[counts[6]].counts.intro], [false, false]);
  assert.ok(isUp(counts[3]) && UNDER1.includes(counts[4]) && REED.includes(counts[7]) && UNDER2.includes(counts[9]));
  // nine skip-counts: the tuck, Squall's forepaw, her paws aboard, her claws in the log, Puddle's forepaw (twice), Wisp's, the mud count, the bedtime nines
  const skips = ids.filter(id => frames[id].skip);
  assert.equal(skips.length, 9);
  const [tuck, squall, board, log, puddle1, wisp, puddle2, mud, bed] = skips.map(id => frames[id].skip);
  // the tuck: five taps on five cats, fifty stepping back to forty-five; no number under a cat; the picture stays
  assert.deepEqual(tuck, { table: 9, groups: 5, tuck: true, who: tuck.who, thing: 'claw', things: 'claws', keep: true, prompt: '**Tap** the cats, left to right.', next: tuck.next });
  assert.deepEqual(tuck.who, [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }], 'three Clan cats, Murmurchime second, the old tom last');
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(n => E.skipView(tuck, n).total), [50, 49, 48, 47, 46, 45], 'the tuck reaches 45 on its fifth tap');
  assert.deepEqual([E.skipView(tuck, 4).done, E.skipView(tuck, 5).done, E.skipView(tuck, 5).count], [false, true, '49… 48… 47… 46… 45!']);
  for (let n = 0; n <= 5; n++) {
    const po = E.skipPicture(tuck, n);
    assert.deepEqual([po.totals, po.tuck, po.tucked, po.highlight], [false, true, n, 50 - n], 'tap ' + n + ': no totals under the cats');
  }
  assert.deepEqual([E.keptPicture(tuck).totals, E.keptPicture(tuck).highlight, E.keptPicture(tuck).next], [false, 45, false], 'kept: nine out, one tucked, 45, and still no number under a cat');
  assert.equal(E.skipWords(tuck, 'tallyheart').label, 'Tuck in the next cat’s claw.');
  assert.match(T(skips[0]), /^So a nine is one less than a ten\. One claw tucked in\. Touch each cat, and tuck one in\.$/);
  assert.equal(tuck.next, counts[2], 'the fifth tap turns to FORTY-FIVE, which is the nines’ own Counts frame');
  assert.deepEqual(E.keptSkip(story, counts[2]), { id: skips[0], skip: tuck });
  assert.equal(E.keptSkip(story, frames[counts[2]].counts.next), null, 'never past the lesson');
  assert.equal(E.skipReached(E.skipInto(story, counts[2])), 45, 'a big 45 on the page the fifth tap turns to');
  // (the tapped picture and the kept one never show 18, 27 or 36: no per-cat totals, only the big number)
  for (let n = 0; n <= 5; n++) {
    const svg = A.countsPicture(Object.assign({ look: { fur: 'grey', sex: 'she' } }, n < 5 ? E.skipPicture(tuck, n) : E.keptPicture(tuck)));
    assert.doesNotMatch(svg.replace(/<(?!text)[^>]*>/g, ' ').replace(/<text[^>]*>/g, ' [').replace(/<\/text>/g, '] '), /\[(9|18|27|36)\]/, 'tap ' + n + ': no nines total is lettered');
  }
  // Squall's forepaw is chapter 4's skip, to the letter (but for where it turns)
  assert.deepEqual(squall, { table: 5, groups: 1, who: [{ who: 'squall' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: CROSSING });
  // her four paws aboard, counted in words by Tallyheart; nothing carried on
  assert.deepEqual(board, { table: 1, groups: 4, paws: 'board', teacher: 'tallyheart', carry: false, prompt: '**Tap** each paw onto the raft.', next: board.next });
  assert.deepEqual([1, 2, 3, 4].map(n => E.skipView(board, n).say), ['One.', 'Two.', 'Three.', 'Four.']);
  assert.deepEqual([E.skipView(board, 4).done, E.skipView(board, 4).total, E.skipWords(board).teacher, E.skipWords(board).words, E.skipWords(board).noNumber], [true, 4, 'tallyheart', true, true], 'the paws Tap reaches four');
  assert.equal(E.skipWords(board).label, 'Put the next paw on the raft.');
  assert.match(T(board.next), /Four paws aboard\. All there\.$/);
  assert.equal(E.skipInto(story, board.next), null);
  // nine claws into the log: the frame's own scene, drawn again at each tap; the count her own thought; the roar grows in three steps
  assert.deepEqual(log, { table: 1, groups: 9, paws: 'log', teacher: 'player', carry: false, prompt: '**Tap** to dig in your claws.',
    steps: [{ from: 1, opts: { plane: 'far' }, sfx: 'rrr…' }, { from: 4, opts: { plane: 'near' }, sfx: 'RRRrrr…' }, { from: 7, opts: { plane: 'over' }, sfx: 'RRRRRR…' }], next: log.next });
  assert.deepEqual([E.skipView(log, 9).done, E.skipView(log, 9).total, E.skipView(log, 8).done, E.skipView(log, 9).anywhere], [true, 9, false, true], 'the log Tap reaches nine');
  assert.deepEqual([E.skipWords(log).teacher, E.skipWords(log).think, E.skipWords(log).label, E.skipOnScene(log)], ['player', true, 'Dig in the next claw.', true]);
  const logF = skips[3];
  for (let n = 0; n <= 9; n++) {
    const sc = E.skipScene(frames[logF].scene, log, n, frames[logF].sfx || '');
    assert.equal(sc.scene.opts.claws, n, 'tap ' + n);
    assert.equal(sc.scene.opts.plane, n < 4 ? 'far' : n < 7 ? 'near' : 'over', 'tap ' + n + ': the skymonster');
    assert.equal(sc.sfx, n < 1 ? '' : n < 4 ? 'rrr…' : n < 7 ? 'RRRrrr…' : 'RRRRRR…', 'tap ' + n + ': the roar, lettered larger');
  }
  assert.equal(frames[logF].scene.opts.claws, undefined, 'the story’s own scene is never changed');
  assert.equal(frames[log.next].sfx, 'ROOOOOAAAAARRRRR!', 'the ninth tap turns to the Roar');
  // Puddle's forepaw and Wisp's: chapter 4's one-group skip, theirs; each the frame that carries its `sets`
  [puddle1, puddle2].forEach(sk => assert.deepEqual(sk, { table: 5, groups: 1, who: [{ who: 'puddle' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: sk.next }));
  // (Wisp never speaks, so the count is our cat's own: without a teacher the page would give the "5!" to Tallyheart, who went home)
  assert.deepEqual(wisp, { table: 5, groups: 1, who: [{ who: 'wisp' }], teacher: 'player', thing: 'claw', things: 'claws', label: 'Tap her forepaw.', prompt: '**Tap** her forepaw.', carry: false, next: wisp.next });
  skips.forEach(id => {
    const sk = frames[id].skip, who = E.skipWords(E.skipFor(sk, { flags: {} }), ((frames[id].say || [])[0] || {}).who).teacher;
    assert.ok(castOf(id, who).length || (id === skips[3] && who === 'player'), id + ': ' + who + ' keeps the count, and is in the picture (the log is her own view)');
  });
  assert.deepEqual(skips.map(id => E.skipWords(frames[id].skip, ((frames[id].say || [])[0] || {}).who).teacher), ['tallyheart', 'squall', 'tallyheart', 'player', 'puddle', 'player', 'puddle', 'sprinkle', 'player']);
  [puddle1, wisp, puddle2].forEach(sk => assert.deepEqual([E.skipView(sk, 1).total, E.skipView(sk, 1).done, E.skipView(sk, 1).count], [5, true, '5!']));
  // the mud count: a forepaw for Sprinkle and for everyone she has ever met; no `groups` of its own
  assert.deepEqual(mud, { table: 5, paws: 'mud', teacher: 'sprinkle', thing: 'claw', things: 'claws', prompt: '**Tap** a forepaw for everyone you’ve found.',
    who: [{ who: 'sprinkle' }, { who: 'squall', when: { foundSquall: true } }, { who: 'puddle', when: { foundPuddle: true } }, { who: 'wisp', when: { foundWisp: true } }], next: mud.next });
  assert.deepEqual(frames[skips[7]].when, ANY);
  // the bedtime nines: chapter 4's bedtime tens with one claw tucked, her murmur trailing off
  assert.deepEqual(bed, { table: 9, groups: 5, thing: 'claw', things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', next: bed.next });
  assert.equal(E.skipView(bed, 5).count, '9… 18… 27… 36… 45…', 'sleepy, no exclamation mark');
  assert.deepEqual([E.skipWords(bed).teacher, E.skipWords(bed).whisper, E.skipWords(bed).label], ['player', true, 'Tap your forepaws.']);
  assert.deepEqual([E.skipPicture(bed, 2).paws, E.skipPicture(bed, 2).both, E.skipPicture(bed, 2).highlight, E.skipPicture(bed, 2).totals], ['own', true, 18, false]);
  assert.match(T(skips[8]), /^Nine\. Eighteen\. Twenty-seven…$/);
  assert.match(T(bed.next), /^That’s a NEW paw thing\.$/);
  assert.equal(E.skipReached(E.skipInto(story, bed.next)), 45, 'a big 45 over the dark');
  // 23 counting taps with no misses, up to 30
  assert.equal(tuck.groups + board.groups + log.groups + bed.groups, 23);
  // the six pages she taps once (the dug earth a noticing cat's, the pole a climber's, the fur in one of two places)
  const taps = ids.filter(id => frames[id].scratch);
  assert.deepEqual(taps.map(id => frames[id].scratch), [
    { tap: 'nose', prompt: '**Tap** his nose to wake him up.', label: 'Wake him up.', miss: 'snnnrrk…', next: frames[taps[0]].scratch.next },
    { tap: 'earth', prompt: '**Tap** the freshly dug earth behind the gap.', label: 'Look at the dug earth.', miss: 'rustle…', next: frames[taps[1]].scratch.next },
    { tap: 'fur', prompt: '**Tap** the fur to sniff it.', label: 'Sniff the fur.', miss: 'flutter…', next: frames[taps[2]].scratch.next },
    { tap: 'mud', prompt: '**Tap** the mud to look closer.', label: 'Look at the mud.', miss: 'ripple…', next: frames[taps[3]].scratch.next },
    { tap: 'pole', prompt: '**Tap** Riffle’s pole to run up it.', label: 'Run up the pole.', miss: 'wobble…', next: frames[taps[4]].scratch.next },
    { tap: 'fur', prompt: '**Tap** the fur to sniff it.', label: 'Sniff the fur.', miss: 'flutter…', next: frames[taps[5]].scratch.next }
  ]);
  taps.forEach(id => assert.deepEqual(E.tapWords(frames[id]), { kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label, miss: frames[id].scratch.miss }, id));
  assert.equal(taps[0], story.start, 'the first thing she does is on the first screen');
  // (a Tap only one cat has is followed in the file by everyone else's page, which hers turns straight past)
  const lands = (id, flags) => E.landing({ flags }, story, frames[id].scratch.next);
  assert.match(T(lands(taps[1], { specialty: 'noticing' })), /^Tiny prints\. Each is half the size of yours\.$/, 'the dug earth turns to its close-up');
  assert.match(T(frames[taps[3]].scratch.next), /^Tiny prints, in a line across the mud\./, 'the mud turns to its close-up');
  assert.match(T(lands(taps[4], { specialty: 'climbing' })), /^From the top, you see where the prints go/, 'the pole turns to the view from its top');
  [taps[2], taps[5]].forEach(id => assert.match(T(frames[id].scratch.next), /^Somebody small\./, 'the fur turns to her nose at it'));
  // Riffle's seven questions: a Tap that counts nothing
  const asks = ids.filter(id => frames[id].ask);
  assert.equal(asks.length, 1);
  const ask = frames[asks[0]].ask;
  assert.deepEqual(ask, { who: 'riffle', to: 'patience', prompt: '**Tap** Riffle to let one out.', pairs: [['Do you sleep standing up?', 'Yes.'], ['Is that leg tired?', 'No.'],
    ['Is that a dragonfly?', 'Yes.'], ['Do you see EVERYTHING?', 'Yes.'], ['Even at night?', 'Yes.'], ['Do you like otters?', 'Yes.'], ['Am I your favorite?', 'No.']], next: counts[5] });
  // the order of the things she does, on the page
  const order = [taps[0], counts[0], taps[1], counts[1], skips[0], counts[2], TOWER, counts[3], skips[1], skips[2], skips[3], RAFT, counts[4], skips[4], WITNESS, taps[2], asks[0], counts[5], taps[3], taps[4], counts[6],
    WAITS[0], counts[7], skips[5], counts[8], SLIP, counts[9], skips[6], taps[5], skips[7], skips[8], inputs[0]];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: eight Taps for everyone, a ninth for a noticing cat or a climber, up to four more; six Counts moments, up to nine
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), fd = found(c), name = comboName(c);
    const n = p.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask).length;
    const own = ['noticing', 'climbing'].includes(c.flags.specialty) ? 1 : 0, more = (fd.roof ? 1 : 0) + (fd.puddle ? 1 : 0) + (fd.wisp ? 1 : 0) + (today(c) ? 1 : 0);
    assert.equal(n, 8 + own + more, name + ': ' + n + ' Taps');
    assert.equal(p.filter(id => frames[id].counts).length, 6 + (fd.roof ? 1 : 0) + (fd.puddle ? 1 : 0) + (fd.wisp ? 1 : 0), name);
    // the first thing she does is on her first panel; the first thing she types is on her second
    assert.deepEqual([E.kindOf(frames[p[0]]), E.kindOf(frames[p[1]])], ['scratch', 'counts'], name);
  }
});

/* ------------------------------------------------------------------ reading through the engine */

const Sp = PC.ui.speakers;
const labelFor = (b, cat, st) => Sp.label(b, { cat, story: st || story, fill: x => E.fill(x, cat) });
/* A frame's balloons as the page letters them for this cat (`when` applied): the nth balloon from a
 * who is the nth of them in the cast, whose variant tells one ferry otter from another. */
function saidOn(st, id, cat) {
  const f = st.frames[id], cast = (f.scene && f.scene.cast) || [];
  return E.balloons(f, cat).map(b => {
    const mine = cast.filter(c => c && c.who === b.who), m = mine[b.nth] || mine[0];
    return { who: b.who, label: labelFor(Object.assign({}, b, { variant: m && m.variant }), cat, st), text: E.fill(b.text, cat), kind: b.kind };
  });
}
/* A lesson's rows, answer by answer, as the page asks it: its words with their speakers' labels (a
 * caption has none), its picture, the steps its picture plays as it is asked, its result, and after
 * a miss the whole help. `answers` maps "AxB" to the answers she types for its asks in turn; `ms`
 * its times (or `all`). */
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
      balloons: (r.balloons || []).map(b => Object.assign({}, b, { text: E.fill(b.text, cat) })), res: r, teacher: E.teacherOf(def, D), shows: r.shows ? r.shows.answers : null };
    if (!r.correct) { row.help = E.helpPlan(def, D, q, r); row.steps = E.helpSteps(row.help); }
    out.push(row);
    if (r.done) E.recordLesson(cat, state);
    else cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: st.id, state };
  }
  return out;
}
const homeOf = setId => STORIES.find(s => s.counts && s.counts[setId]);
function play(cat, setId, answers, ms) {
  const home = story.counts[setId] ? story : homeOf(setId);
  const { def, state } = E.chapterLesson(cat, home, setId, 1, STORIES);
  return lessonRows(cat, home, def, state, answers, ms);
}
const ks = rows => rows.map(r => r.k);
const pairKey = k => k.replace(/^[A-Z]:/, '').replace('✗', '').split('x').map(Number).sort((a, b) => a - b).join('x');
/* Read a chapter through the engine from where she is to its end (or to `stop`, a frame id, before
 * acting on it): what every frame shows her. `pick(id)`: the option she takes at a choice (the first
 * unless it says); `answers` and `ms`: for every lesson on the way. A skip-count, a one-tap frame and
 * the page of questions are tapped through. */
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
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'a reed that blinked' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      row.lesson = lessonRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat who has read chapters 1 to 3 and then played chapter 4 itself through the engine (its flags,
 * its lessons, her Case File as chapter 4 really left it), at chapter 5's first page. `flags`: her
 * chapter 1 to 3 flags; `foundSquall: true` sends her up the tower in chapter 4. One chapter-4
 * reading for each kind of cat, and a copy of it for every cat after. */
const TOWER4 = Object.keys(ch04.frames).find(id => ch04.frames[id].choice && ch04.frames[id].choice.options.some(o => o.labelWhen));
const AFTER4 = {};
function after4(flags) {
  flags = flags || {};
  const specialty = flags.specialty || 'sneaking', ch3Told = flags.ch3Told !== false, met = !!flags.foundSquall, key = [specialty, ch3Told, met].join('/');
  if (!AFTER4[key]) {
    const cat = E.blankCat({ now: 1, id: 'c5' });
    cat.name = 'Moon'; cat.petname = 'Muffin';
    cat.finished = { ch01: 1, ch02: 2, ch03: 3 };
    Object.assign(cat.flags, { specialty, worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch2SaidAloud: true, ch3Told });
    ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
    E.startChapter(cat, ch04, 100);
    readStory(cat, ch04, { pick: id => (id === TOWER4 ? (met ? 0 : 1) : 0), dream: '', t: 100 });
    assert.ok(E.isFinished(cat, 'ch04'));
    AFTER4[key] = JSON.stringify(cat);
  }
  const cat = JSON.parse(AFTER4[key]);
  ['worry', 'ch2Stone', 'ch2Path'].forEach(k => { if (flags[k] !== undefined) cat.flags[k] = flags[k]; });
  return cat;
}
function fresh(flags) {
  const cat = after4(flags);
  E.startChapter(cat, story, 500);
  return cat;
}
/* Read chapter 5: `o` is a route (`up`, `raft`, `first`, `wait`, `light`: as `pick`), with `stop`,
 * `answers`, `ms`, `dream` and `t` as readStory takes them. */
function read(cat, o) { o = o || {}; return readStory(cat, story, Object.assign({}, o, { pick: id => pick(id, o) })); }
const rowAt = (rows, id) => rows.find(r => r.id === id);
const idsOf = rows => rows.map(r => r.id);
/* Everything a reading put on screen, as text: captions, balloons with their labels, the options, her
 * new cards' lines, the sound effects, Riffle's questions and their answers, every lesson's words. */
function readWords(rows) {
  const out = [];
  rows.forEach(r => {
    out.push(...r.caps, ...r.say.map(b => b.label + ': ' + b.text), ...(r.options || []), ...r.cards.map(c => c.line), r.sfx);
    (r.asked || []).forEach(p => out.push(...p));
    (r.lesson || []).forEach(l => out.push(...l.prompt.map(p => (p.label || '') + ': ' + p.text), l.line, ...l.balloons.map(b => b.text), l.help ? l.help.intro : ''));
  });
  return out.join('\n');
}
/* A reading by a cat of this kind on this route: { cat, rows, w (its words), ids }. */
function reading(flags, o) {
  const cat = fresh(flags), rows = read(cat, o);
  return { cat, rows, w: readWords(rows), ids: idsOf(rows) };
}
const clone = x => JSON.parse(JSON.stringify(x));

/* The frames the tests name: found by what they say. */
const RULES = F(/That’s the Roar\. It’s the courage test\./);
const LOG = ids.find(id => frames[id].skip && frames[id].skip.paws === 'log');
const HOME = F(/^She turns for home\./);
const MARSH = F(/^The river slides into a wide, still marsh\./);
const DIVE = F(/Back in eighteen fish!/);
const HEAVE = F(/^Riffle heaves four strings of fish onto the raft, puffing\./);
// the gulp is two frames with opposite `when`s, one after the other: everybody else's, then (GULP_W) the one
// for a cat who found Wisp, with her in the picture
const [GULP, GULP_W] = F2(/^Down go the fish\./);
const BRIDGE = F(/^At the rocks, Riffle ties up the raft/);
const MUD = ids.find(id => frames[id].skip && frames[id].skip.paws === 'mud');
const DEN = F(/^At the den, Tallyheart is waiting\./);
const TELLING = F(/^You tell her about the duck, the fur, the prints, and the two small shapes\./);
const NEST = F(/^In your nest: skritch, skritch\./);
const countsAt = set => ids.filter(id => frames[id].counts && frames[id].counts.set === set);

/* ------------------------------------------------------------------ speakers, tokens, words */

test('every balloon speaker is in that frame’s cast, but for the one voice heard and not seen; where two of a kind are in the picture, the first of them speaks; balloons and captions are well formed', () => {
  const off = [];
  ids.forEach(id => {
    const f = frames[id];
    const by = {};
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(typeof b.name === 'string' && b.name.trim() && !tokensIn(b.name).length, id + ' say ' + i + ' name');
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      if (!castOf(id, b.who).length) {
        off.push(id + ' ' + b.who);
        assert.ok(f.scene.cam === 'log' && b.who === 'riffle', id + ': ' + b.who + ' is heard but not drawn, so it needs a reason');
      }
      by[b.who] = (by[b.who] || 0) + 1;
    });
    // the page gives a speaker's nth balloon to the nth of them in the cast: with two otters in the
    // picture, a second balloon from `otter` would come out of the wrong mouth
    Object.keys(by).forEach(who => { if (castOf(id, who).length > 1) assert.equal(by[who], 1, id + ': ' + by[who] + ' balloons from ' + who + ', and ' + castOf(id, who).length + ' of them in the picture'); });
    if (f.caption !== undefined) {
      assert.ok(Array.isArray(f.caption) && f.caption.length > 0, id + ' caption');
      f.caption.forEach(t => {
        if (typeof t === 'string') assert.ok(t.trim(), id + ' empty caption');
        else {
          assert.deepEqual(Object.keys(t).sort(), ['text', 'when'], id + ' caption object');
          assert.ok(t.text.trim(), id + ' empty caption');
        }
      });
    }
    if (f.sfx !== undefined) assert.ok(typeof f.sfx === 'string' && f.sfx.trim(), id + ' sfx');
    texts(f).forEach(x => { if (x.when) Object.keys(x.when).forEach(k => assert.ok(k === 'not' || FLAGS[k], id + ' ' + x.where + ': when ' + k)); });
  });
  // Riffle, shoulder to shoulder with her in the Roar: the picture is her own two forepaws on the log,
  // with his webbed one beside them (the art's), so his balloon has no face to come from
  assert.deepEqual(off, [LOG + ' riffle'], 'the voice heard and not seen');
  assert.equal(frames[LOG].say[0].who, 'riffle');
  // the ferry otters, as chapter 2 called them: the old one runs the Roar and tells the fox's story;
  // the rumor and the duck are another otter's
  const cat = E.blankCat({}); cat.name = 'Fern';
  const young = FF(/A dragon as big as a bridge!/).concat(FF(/^A duck\. A very honest duck\.$/), FF(/^Well… no\. A duck told me\.$/));
  assert.equal(young.length, 6, 'both copies');
  const spoke = ids.filter(id => (frames[id].say || []).some(b => b.who === 'otter'));
  assert.ok(spoke.length >= 16, spoke.length + ' panels where a ferry otter speaks');
  spoke.forEach(id => saidOn(story, id, cat).filter(b => b.who === 'otter').forEach(b => assert.equal(b.label, young.includes(id) ? 'An otter' : 'The old ferry otter', id + ': ' + b.text)));
  assert.equal(saidOn(story, RULES, cat).filter(b => b.who === 'otter').length, 2, 'the rules are two balloons, both the old otter’s');
  assert.equal(castOf(RULES, 'otter').length, 1, '… so he is the only otter in that picture');
  // a Tap's own counting balloon has somebody in the picture to belong to: never Tallyheart once she has gone home
  ids.filter(id => frames[id].skip).forEach(id => {
    const f = frames[id], who = E.skipWords(E.skipFor(f.skip, { flags: {} }), ((f.say || [])[0] || {}).who).teacher;
    assert.ok(castOf(id, who).length || (id === LOG && who === 'player'), id + ': ' + who + ' keeps the count');
    if (at(id) > at(HOME) && at(id) < at(DEN)) assert.notEqual(who, 'tallyheart', id);
  });
});

test('speakers: “The little dragon” until “I’m Squall”, “The big-footed dragon” until “I’m Puddle” (in both copies, and in the reeds “Puddle”), Patience by name from her first word, and Wisp with no balloon at all', () => {
  const cat = E.blankCat({});
  cat.name = 'Fern';
  const label = b => labelFor(b, cat);
  assert.deepEqual(story.names, { squall: 'The little dragon', puddle: 'The big-footed dragon' });
  assert.deepEqual([label({ who: 'squall' }), label({ who: 'puddle' }), label({ who: 'patience' }), label({ who: 'riffle' })], ['The little dragon', 'The big-footed dragon', 'Patience', 'Riffle']);
  assert.deepEqual([Sp.NAMES.patience, Sp.NAMES.puddle, Sp.NAMES.wisp], ['Patience', 'Puddle', 'Wisp']);
  // Squall, on chapter 4's roof: no balloon up to and including the riddle is labelled "Squall"; every one of his after "I'm Squall" is
  const introS = F(/…I’m Squall\. I’m the littlest\. And the LOUDEST\./), riddle = countsAt('ch04-riddle')[0];
  assert.ok(UP.includes(introS) && UP.includes(riddle) && at(riddle) < at(introS));
  const hisS = ids.filter(id => (frames[id].say || []).some(b => b.who === 'squall'));
  assert.ok(hisS.every(isUp), 'he speaks on his roof and nowhere else');
  hisS.forEach(id => frames[id].say.filter(b => b.who === 'squall').forEach(b => {
    const named = at(id) >= at(introS);
    assert.equal(b.name, named ? 'Squall' : undefined, id);
    assert.equal(label(b), named ? 'Squall' : 'The little dragon', id);
  }));
  assert.ok(hisS.filter(id => at(id) < at(introS)).length >= 4 && hisS.filter(id => at(id) >= at(introS)).length >= 4);
  ids.slice(0, at(introS)).forEach(id => assert.doesNotMatch(T(id), /Squall/, id + ': his name is not lettered before he says it'));
  assert.equal(story.counts['ch04-riddle'], undefined, 'the riddle is chapter 4’s own set');
  assert.equal(ch04.counts['ch04-riddle'].teacher, 'squall');
  // Puddle, under the raft: the same in both copies
  [UNDER1, UNDER2].forEach((copy, n) => {
    const intro = copy.find(id => /^I’m Puddle\./.test(T(id))), puzzle = copy.find(id => frames[id].counts);
    assert.ok(intro && puzzle && at(puzzle) < at(intro), 'copy ' + (n + 1) + ': his riddle comes before his name');
    const his = copy.filter(id => (frames[id].say || []).some(b => b.who === 'puddle'));
    his.forEach(id => frames[id].say.filter(b => b.who === 'puddle').forEach(b => {
      const named = at(id) >= at(intro);
      assert.equal(b.name, named ? 'Puddle' : undefined, id);
      assert.equal(label(b), named ? 'Puddle' : 'The big-footed dragon', id);
    }));
    assert.deepEqual([his.filter(id => at(id) < at(intro)).length, his.filter(id => at(id) >= at(intro)).length], [3, 4], 'copy ' + (n + 1));
    copy.slice(0, copy.indexOf(intro)).forEach(id => assert.doesNotMatch(T(id), /Puddle/, id));
    // the "5!" the page adds under his own balloon on the forepaw Tap is Puddle's too
    const tap = copy[copy.length - 1], said = E.balloons(frames[tap], cat), w = E.skipWords(frames[tap].skip, said[0].who);
    assert.equal(w.teacher, 'puddle');
    assert.deepEqual(said.map(label).concat(label({ who: w.teacher, name: Sp.nameOn(said, w.teacher) })), ['Puddle', 'Puddle'], tap);
  });
  assert.equal(story.counts['ch05-puddle'].teacher, 'puddle', 'so his riddle, its help, its fillers and its retry are “The big-footed dragon”’s');
  countsLines().filter(x => x.set === 'ch05-puddle').forEach(x => assert.doesNotMatch(x.text, /Puddle|Tallyheart|sand/, x.where));
  // ... and when his snout comes up in the reeds he has long said his name
  const reeds = ids.filter(id => !UNDER1.includes(id) && !UNDER2.includes(id) && (frames[id].say || []).some(b => b.who === 'puddle'));
  assert.deepEqual(reeds.map(id => frames[id].say.map(b => [b.who, b.name, b.text, b.kind])), [[['puddle', 'Puddle', 'WISP?', 'shout']], [['puddle', 'Puddle', 'I’m a LOG.', 'whisper']]]);
  reeds.forEach(id => { assert.ok(REED.includes(id)); assert.deepEqual(frames[id].when, { foundPuddle: true }); });
  // Patience: Riffle names her before she says a word, so she is "Patience" from her first balloon
  const hers = ids.filter(id => (frames[id].say || []).some(b => b.who === 'patience'));
  assert.ok(hers.length >= 12, 'she speaks on ' + hers.length + ' panels');
  assert.ok(at(hers[0]) > at(F(/^That’s Patience\. Two fish for every answer\./)));
  hers.forEach(id => frames[id].say.filter(b => b.who === 'patience').forEach(b => { assert.equal(b.name, undefined, id); assert.equal(label(b), 'Patience'); }));
  ids.slice(0, at(F(/Patience the heron SEES everything/))).forEach(id => assert.doesNotMatch(T(id), /Patience/, id));
  // Wisp never speaks on screen: no balloon of hers in any frame, no line of hers in any Counts set;
  // the two lines about her are Patience's, and her riddle is lettered in captions
  ids.forEach(id => assert.ok(!(frames[id].say || []).some(b => b.who === 'wisp'), id + ': a balloon of Wisp’s'));
  Object.keys(story.counts).forEach(sid => assert.ok(story.counts[sid].teacher !== 'wisp' && !JSON.stringify(story.counts[sid]).includes('"who":"wisp"'), sid));
  assert.deepEqual([story.counts['ch05-wisp'].teacher, story.counts['ch05-wisp'].helpSays], ['caption', 'patience']);
  [/^She lays one claw across her snout\. She believes she is a heron\. I have not corrected her\./, /^She fell into my reeds in the storm\. She told me her name: Wisp\. Not a word since\. She stands well\.$/].forEach(re => {
    const id = F(re);
    assert.ok(REED.includes(id) && castOf(id, 'wisp').length === 1 && frames[id].say.filter(b => /heron|Wisp/.test(b.text)).every(b => b.who === 'patience'), id);
  });
  // ... so the "5!" on her forepaw Tap is our cat's own, and she is in that picture to say it
  const wtap = REED[REED.length - 1];
  assert.deepEqual([frames[wtap].skip.teacher, E.skipWords(frames[wtap].skip, undefined).teacher, castOf(wtap, 'player').length, frames[wtap].say], ['player', 'player', 1, undefined]);
  // nobody else carries a name of the page's: everyone else is known already
  ids.forEach(id => (frames[id].say || []).filter(b => !['squall', 'puddle'].includes(b.who)).forEach(b => assert.equal(b.name, undefined, id + ' ' + b.who)));
  // what each Counts frame says again over its first question: a whole conversation is not said twice
  // (the pile's four balloons, chapter 4's riddle), nor are the warm-up's lines (`intro: false`: its
  // first question may be her hardest ten, and is timed on itself), nor the bill's (`intro: false`: Patience
  // asks it in two balloons and a caption of her own, and the picture must stay in sight); the rest open
  // with their one or two
  const again = ids.filter(id => frames[id].counts).map(id => [frames[id].counts.set, E.balloons(frames[id], cat).length, Sp.lessonIntro(E.balloons(frames[id], cat), frames[id].counts.intro === false).length]);
  assert.deepEqual(again, [['ch05-pile', 4, 0], ['ch05-tens', 1, 0], ['ch05-nines', 2, 2], ['ch04-riddle', 3, 0], ['ch05-puddle', 1, 1], ['ch05-otter', 2, 2], ['ch05-bill', 1, 0], ['ch05-wisp', 0, 0], ['ch05-catch', 2, 2], ['ch05-puddle', 1, 1]]);
  // (the nines open on the tuck's kept picture, where the page says nothing again: E.keptSkip)
  const tuck = ids.find(id => frames[id].skip && frames[id].skip.tuck);
  assert.equal(frames[tuck].skip.next, countsAt('ch05-nines')[0]);
  // the new warrior, for a Murmur: Mutterchime (she sits second on the rim, and has sat through the Roar)
  cat.name = 'Murmur';
  assert.equal(label({ who: 'murmurchime' }), 'Mutterchime');
  assert.match(E.fill(T(DEN), cat), /Glintstar\. Mutterchime\. Me\./);
  // the grown-ups corner has words for every flag a frame or an option of the chapter sets
  const W = PC.ui.flagWords;
  ids.forEach(id => {
    const f = frames[id];
    Object.entries(f.sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v));
    ((f.choice && f.choice.options) || []).forEach(o => Object.entries(o.sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v)));
  });
});

test('text tokens are only the allowed ones', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = x.ok || (id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS);
    tokensIn(x.text).forEach(t => { if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}'); });
  });
  assert.deepEqual(bad, []);
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  // the Murmur token only ever makes the new warrior's name
  everyText((id, x) => (String(x.text).match(/\{(Murmur|murmur|MURMUR)\}\w*/g) || []).forEach(m => assert.equal(m, '{Murmur}chime', id + ' ' + x.where + ': ' + m)));
  // a card's line has no tokens at all (it is lettered on bark, the same for everyone); nor has a link's
  Object.keys(story.cards).forEach(cid => { assert.deepEqual(tokensIn(story.cards[cid].line), [], cid); if (story.cards[cid].link) assert.deepEqual(tokensIn(story.cards[cid].link.line), [], cid); });
  // Riffle's questions and Patience's answers are the same for everyone
  ids.filter(id => frames[id].ask).forEach(id => frames[id].ask.pairs.forEach(p => assert.deepEqual(tokensIn(p[0] + p[1]), [], id)));
  // the dream question names her and the day
  assert.equal(T(ids.find(id => frames[id].input)), 'What did {name}paw dream about, the night {they} sat through the Roar?');
});

test('word counts: about 14 words of lettering a frame, none over about 30 for its reader, never more than 50 with every variant (every variant at once, and as each combination reads it)', (t) => {
  const over = [];
  ids.forEach(id => {
    const all = texts(frames[id]).reduce((n, x) => n + words(x.text), 0);
    assert.ok(all <= WORDS_MAX, id + ' has ' + all + ' words, every variant counted');
    if (all > WORDS_AIM) over.push(id + ' (' + all + ')');
  });
  if (over.length) t.diagnostic('over ' + WORDS_AIM + ' words with every variant: ' + over.join(', '));
  // the Build's rule for whoever cuts the screens: no frame over about 30 words. As each cat reads
  // them, three frames run to 31, 32 or 33 for somebody, and nothing is longer than that:
  // the first panel (its two captions and the snore), "She turns for home." for a cat who makes friends
  // and minds the water (her two lines), and the telling at the den for a noticing cat (her pair of balloons)
  const LONG = [story.start, HOME, TELLING], most = {};
  const klass = c => [found(c).roof ? 'the roof' : '', found(c).puddle ? 'Puddle' : '', found(c).wisp ? 'Wisp' : ''].filter(Boolean).join(', ') || 'no optional scene';
  const stats = {};
  let longest = 0, longestFrom = null;
  const silent = [];
  for (const c of COMBOS) for (const light of [0, 1]) {
    const o = Object.assign({}, c.o, { light }), rows = walkLines(c.flags, o);
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(s), 0));
    const w = per.reduce((a, b) => a + b, 0);
    rows.forEach((r, i) => {
      if (!per[i] && !silent.includes(r.id)) silent.push(r.id);
      assert.ok(per[i] <= 33, r.id + ': ' + per[i] + ' words for ' + comboName(c));
      if (per[i] > WORDS_AIM) { assert.ok(LONG.includes(r.id), r.id + ': ' + per[i] + ' words for ' + comboName(c)); most[r.id] = Math.max(most[r.id] || 0, per[i]); }
    });
    (stats[klass(c)] = stats[klass(c)] || []).push({ n: rows.length, w });
    assert.ok(w / rows.length >= 13.3 && w / rows.length <= 18, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
    // the longest stretch with nothing to choose, type or tap
    let run = 0, worst = 0, from = null, first = null;
    rows.forEach(r => {
      if (r.kind !== 'next') { run = 0; return; }
      if (!run) from = r.id;
      if (++run > worst) { worst = run; first = from; }
    });
    assert.ok(worst <= 10, comboName(c) + ': ' + worst + ' panels in a row with nothing to do, from ' + first);
    if (worst > longest) { longest = worst; longestFrom = first; }
    // nine or ten only for the cat with the most news and the fewest stops: Puddle found after the Roar (so
    // no slip on the way home) and the otters asked first (so no stop at the rocks): from the gulp to the
    // mud count is eight panels, a ninth with Wisp or the tower today, a tenth with both (each piece of
    // news has a panel of its own)
    if (worst >= 9) assert.ok(c.o.raft === 'lean' && c.o.first === 'otters' && first === (found(c).wisp ? GULP_W : GULP) && worst === 8 + (found(c).roof ? 1 : 0) + (found(c).wisp ? 1 : 0), comboName(c) + ': ' + worst + ' from ' + first);
  }
  assert.deepEqual(most, { [story.start]: 31, [HOME]: 32, [TELLING]: 33 });
  // the text's estimate at chapter 4's rate: about 102–116 frames without the optional scenes, about
  // 124–142 with Puddle and Wisp, about 138–156 with the roof as well
  const range = k => [Math.min(...stats[k].map(x => x.n)), Math.max(...stats[k].map(x => x.n))];
  assert.deepEqual(Object.keys(stats).sort(), ['Puddle', 'Puddle, Wisp', 'Wisp', 'no optional scene', 'the roof', 'the roof, Puddle', 'the roof, Puddle, Wisp', 'the roof, Wisp']);
  assert.deepEqual([range('no optional scene'), range('Puddle'), range('Wisp'), range('Puddle, Wisp'), range('the roof'), range('the roof, Puddle'), range('the roof, Wisp'), range('the roof, Puddle, Wisp')],
    [[98, 110], [105, 121], [111, 120], [118, 129], [117, 128], [122, 137], [128, 136], [135, 145]]);
  Object.keys(stats).sort().forEach(k => {
    const s = stats[k], mm = f => Math.min(...s.map(f)) + '–' + Math.max(...s.map(f));
    t.diagnostic(k + ': ' + mm(x => x.n) + ' frames, ' + mm(x => x.w) + ' words of lettering, ' + (s.reduce((a, x) => a + x.w / x.n, 0) / s.length).toFixed(1) + ' a frame');
  });
  assert.deepEqual([longest, longestFrom], [10, GULP_W]);
  t.diagnostic('the longest run of panels with nothing to do: ' + longest + ' (from the gulp to the mud count, for a cat who went up the tower today, found Puddle after the Roar, asked the otters first and found Wisp; 9 with only one of the tower and Wisp; 8 or fewer for every other cat); chapter 4’s was 9, chapter 3’s 11');
  // her one more question for the heron is a screen of its own: its options are all its lettering, but
  // for a cat who minds talking (her caption). It is the only frame that letters nothing for somebody.
  const ask = F(/^You have a hundred questions\. At two fish each, you pick one more\.$/);
  assert.deepEqual([frames[ask].caption.length, capWhen(frames[ask].caption[0]), frames[ask].say, frames[ask].sfx, frames[ask].choice.options.length], [1, { worry: 'talk' }, undefined, undefined, 2]);
  assert.deepEqual(silent, [ask], 'the only frame that letters nothing for somebody');
});

test('a caption the page can letter on the panel is 95 characters at most, a long thought in two boxes (the shining river, the windows); only the end page’s and the fox in the mud, which are lettered beside the panel whatever their length, run on', () => {
  const capText = c => typeof c === 'string' ? c : c.text;
  const long = ids.filter(id => (frames[id].caption || []).some(c => capText(c).length > 95));
  const FOX = F(/^She draws again\. A fox\./);
  assert.deepEqual(long, ids.filter(id => frames[id].end || id === FOX), 'only the end page and the fox in the mud');
  // the two that were one long box, each now two, in the order she reads them, and their boards say so
  const two = re => frames[F(re)].caption.map(capText);
  assert.deepEqual(two(/^Riffle pushes off, and the whole river shines\./), ['Riffle pushes off, and the whole river shines.', 'The glass towers stand on their heads in the water.']);
  assert.deepEqual(two(/^Little round windows, all in a row\./), ['Little round windows, all in a row.', 'At one, a small face is pressed to the glass. You know that feeling.']);
  [/^Riffle pushes off, and the whole river shines\./, /^Little round windows, all in a row\./].forEach(re => assert.match(frames[F(re)].board, /Two captions/, String(re)));
  // the fox in the mud stays one box: the drawing she must see is kept clear of lettering (most of the
  // panel's middle and bottom) and the two heads have the top, so no second box fits on the panel
  const fox = A.render(frames[FOX].scene, { look: { fur: 'calico', marking: 'none', eyes: 'green' } });
  assert.equal(frames[FOX].caption.length, 1);
  assert.ok(fox.keep[0].w > 30 && fox.keep[0].h > 40 && fox.keep[0].y + fox.keep[0].h > 85, JSON.stringify(fox.keep[0]));
  assert.match(frames[FOX].board, /One caption, beside the panel/);
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
    // a board is for an illustrator: it never names the thieves, and nobody shows teeth
    assert.doesNotMatch(b, /weasel|teeth|fang|snarl/i, id);
    assert.doesNotMatch(b, /\bSTUB\b/, id);
  });
  // a frame shown only on a path says so in its shot line; a Tap page says what the tap does in play
  ids.filter(id => frames[id].when).forEach(id => assert.match(frames[id].board.split('. ')[0], /\b(ONLY|BUT|NOT FOR)\b/, id + ': the shot line says who sees it'));
  ids.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].card).forEach(id => assert.match(frames[id].board, /card/, id + ': the board says the card appears'));
  // the two copies of a scene are boarded for their own light: the second says it is late
  UNDER2.concat(OTTERS2).forEach(id => assert.match(frames[id].board.split('. ')[0], /LATE|GOLD|WAY HOME/, id + ': the shot line says the light'));
  UNDER1.forEach((id, i) => assert.notEqual(frames[id].board, frames[UNDER2[i]].board, id));
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
      // (the pup's cut-off word is the text's own: "It's because of Pud— PUDDLES.")
      const bad = badGrammar(out, x.sfx);
      if (bad.length) problems.push(kind + ' ' + id + ' ' + x.where + ': ' + bad.join(', ') + ' | ' + out);
    });
  });
  problems.forEach(s => t.diagnostic(s));
  assert.deepEqual(problems, []);
  // a tom's climb, his dream and his book
  const climb = F(/The OUTSIDE\?/);
  assert.match(fill(T(climb), PROFILES.tom), /The OUTSIDE\? HE’S DOING IT!/);
  assert.match(fill(T(climb), PROFILES['she-cat']), /The OUTSIDE\? SHE’S DOING IT!/);
  assert.equal(fill(T(ids.find(id => frames[id].input)), PROFILES.tom), 'What did Stormpaw dream about, the night he sat through the Roar?');
  assert.match(fill(T(F(/Nine claws in the log/)), PROFILES.tom), /Nine claws in the log, Stormpaw! One tucked for luck!/);
  const tomBook = fill(story.book.recap.map(r => r.text).join(' '), PROFILES.tom);
  assert.match(tomBook, /Tallyheart taught Stormpaw his fifth Count, nine lives/);
  assert.match(tomBook, /On the roof of his old tower, he found Squall, the littlest dragonet, who told him about two skinny shapes/);
  assert.match(tomBook, /Under the raft he found Puddle/);
  assert.match(fill(story.book.dragonet[0].lines.join(' '), PROFILES.murmur), /Murmurpaw found him under the otters’ ferry raft/);
});

test('our own world and the tone: no Warriors or Wings of Fire words; nobody names the thieves or says who took the prey; the fox is a rumor and a drawing; nobody is hurt, and nobody but an otter or a dragonet is in the water', () => {
  // ("skymonster" is this chapter's own loud word, world.md's and Aron's: Riffle's shout and the old otter's rule)
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|apprentices’ den|assessment|from this day|claw-moon|quarter-moon|half-moon|whisker-lengths?|fox-lengths?|tail-lengths?|monsters? of the sky|water-monsters?|leader’s? nine lives|gift of)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|warriors’ den|claw-moon)\b/i, id + ' board'));
  // the skymonster: the otters' word for it, said by the old otter in his rule and shouted by Riffle; our cat's word is "airplane"
  const sky = ids.filter(id => /skymonster/i.test(T(id)));
  assert.deepEqual(sky.map(id => frames[id].say.filter(b => /skymonster/i.test(b.text)).map(b => b.who)), [['otter'], ['riffle']]);
  assert.match(T(sky[1]), /SKYMONSTER! Airplane\.$/);
  assert.equal(frames[sky[1]].say[1].who, 'player');
  // the names the chapter keeps: Wisp, never Fog; no distance in whiskers; the Roar counts claws, never whiskers
  everyText((id, x) => assert.doesNotMatch(x.text, /thin as a (whisker|claw)|a whisker (past|from|short)|Lady Glintstar|Fog\b|\bfog\b|(twitch|move|moved)s? a whisker|Not (a|one) whisker/i, id + ' ' + x.where));
  // nine lives are counted on claws: nobody is given a life, loses one or spends one, and no life is paired with a virtue
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(give|gives|gave|given|lose|loses|lost|spend|spends|spent|last|eight|seven|six|five|four|three|two|one) li(fe|ves)\b|li(fe|ves) (of|for) (courage|patience)|with this life/i, id + ' ' + x.where));
  // nobody names the weasels, on any path, or says weasel or tunnel: they are "something with clever
  // little paws", "somebody small", "two small shapes" (Squall's are "two skinny shapes")
  everyText((id, x) => assert.doesNotMatch(x.text, /weasel|stoat|ferret|polecat|tunnel|\bSnip\b|\bSnatch\b/i, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /weasel|stoat|ferret|polecat|tunnel/i, id + ' board'));
  // no card and no frame says the words the notes rule out (the white needle of stone is still in the
  // picture, so one board may name it; nothing lettered does)
  const lettered = JSON.stringify([ids.map(id => Object.assign({}, frames[id], { board: '' })), story.cards, story.counts, story.book, story.teaser]);
  assert.doesNotMatch(lettered, /weasel|tunnel|goose|gets bigger|himself told him|soggy|needle|\bSnip\b|\bSnatch\b/i);
  assert.deepEqual(ids.filter(id => /needle/i.test(frames[id].board)), [F(/^Riffle pushes off, and the whole river shines\./)]);
  // the only glass on screen is the towers' and an airplane window's
  const glass = ids.filter(id => /glass/i.test(T(id)));
  assert.deepEqual(glass.map(T).map(s => /The glass towers stand on their heads in the water\./.test(s) ? 'towers' : /a small face is pressed to the glass/.test(s) ? 'window' : s), ['towers', 'window']);
  everyText((id, x) => { if (!/^f\d/.test(id)) assert.doesNotMatch(x.text, /glass/i, id + ' ' + x.where); });
  // nobody solves the case: our cat never says who took the prey, nobody does, and Tallyheart says "not yet"
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'player').forEach(b => assert.doesNotMatch(b.text, /\b(took|stole|steals?|taken|thie(f|ves)|did it|it was (the|a))\b/i, id + ': ' + b.text)));
  everyText((id, x) => assert.doesNotMatch(x.text, /stole the prey|took the prey|the thie(f|ves) (is|are|was|were)\b|\bthie(f|ves)\b|we know who|solved/i, id + ' ' + x.where));
  assert.deepEqual(frames[F(/I do not guess\. Guessing is for otters\. That one is free\./)].say.map(b => b.who), ['patience'], 'asked who, the heron does not guess');
  assert.match(T(F(/Two stories\. One sky\. So who’s wrong\?/)), /^And the fox says moon\. The heron says no moon\. Two stories\. One sky\. So who’s wrong\?$/);
  assert.match(T(F(/a counting cat says: not yet/)), /^Maybe\. But a counting cat says: not yet\.$/);
  assert.match(T(F(/That’s the hardest thing to say/)), /^Good\. That’s the hardest thing to say\.$/);
  // the fox and the weasels are heard of, never seen: no fox in any cast (he is a drawing in the mud and a line in a story)
  ids.forEach(id => assert.ok(!frames[id].scene.cast.some(c => c.who === 'reynard'), id + ': the fox is in the picture'));
  const foxy = ids.filter(id => /\bfox\b/i.test(T(id)));
  assert.ok(foxy.length >= 5 && foxy.every(id => !castOf(id, 'reynard').length));
  ids.forEach(id => (frames[id].say || []).forEach(b => assert.notEqual(b.who, 'reynard', id)));
  // …nor does a storyboard draw him for a future illustrator, but where the text allows it: in the old
  // otter's telling (both copies) and in Wisp's drawing in the mud. Two more boards name him without
  // drawing him (her two cards side by side: "the fox's moon"; "the fox's flew").
  const drawn = ids.filter(id => /\bfox\b[^.;]*\b(comb|tail|head beside|riverbank|flapping)|\ba fox\b|a fox’s head/i.test(frames[id].board));
  assert.deepEqual(drawn, F2(/^No bark for ducks\./).concat([F(/^She draws again\. A fox\./)]).sort());
  assert.deepEqual(ids.filter(id => /\bfox/i.test(frames[id].board) && !drawn.includes(id)).map(id => frames[id].board.match(/the fox’s \w+/)[0]), ['the fox’s moon', 'the fox’s flew']);
  // nobody dies, nobody is hurt, nobody is chased; Puddle's bumps are a joke on his own head, and the
  // one who went hungry on the storm night was a heron with no moon to fish by
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(wound(ed)?|blood|bleed|bleeds|broken|die[sd]?|dead|death|kill(ed|s)?|bones?|drown\w*|chas(e|es|ed|ing)|fangs?|snarls?|growls?|bites?|bitten|attacks?|pounces on|swallow(s|ed)? (you|her|him|us))\b/i, id + ' ' + x.where));
  assert.deepEqual(FF(/\bhurts?\b/i), [], 'no frame says hurt');
  assert.deepEqual(countsLines().filter(x => /\bhurts?\b/i.test(x.text)).map(x => x.text), ['No wonder it hurts.'], 'only his forty bumps');
  assert.deepEqual(FF(/hungry/i).map(T), ['One eye shuts. No. The fish come up for the moon. That night, I went hungry.']);
  // nobody but an otter or a dragonet in the water: our cat's feet are on the raft (or up its pole), the
  // rocks or the pebbles, on every panel of the river and the marsh, and nobody is asked to jump in
  // (`raft-edge`: crouched on the front lip of the raft's near log, a paw held out over the mud and touching nothing)
  const DRY = { openriver: ['raft-1', 'raft-2', 'pole', 'far-rocks'], marsh: ['raft-1', 'raft-2', 'raft-edge', 'pole-top', 'log-1', 'log-2', 'log-3'], crossing: ['rock-left', 'pebbles', 'rock-high', 'rock-right', 'shore', 'raft-1', 'raft-2', 'raft-3'] };
  const SWIMMERS = ['riffle', 'otter', 'puddle', 'wisp', 'patience'];
  ids.forEach(id => {
    const s = frames[id].scene;
    if (!DRY[s.set]) return;
    s.cast.forEach(c => { if (!SWIMMERS.includes(c.who)) assert.ok(typeof c.at === 'string' && DRY[s.set].includes(c.at), id + ': ' + c.who + ' at ' + JSON.stringify(c.at)); });
    s.cast.filter(c => c.who === 'player').forEach(c => assert.ok(!['swim', 'float', 'dive', 'fall'].includes(c.pose), id + ': ' + c.pose));
  });
  ids.filter(id => frames[id].scene.set === 'bridge').forEach(id => frames[id].scene.cast.filter(c => c.at === 'water').forEach(c => assert.equal(c.who, 'riffle', id)));
  // ... her one wet paw is a swimmer's own choosing, twice at most; the rule is "No jumping in"
  assert.match(T(RULES), /Three rules: sit\. Stay\. No jumping in\.$/);
  // (Riffle's "if you fall in, I'll have you out before your tail gets wet" is a promise; no caption has her fall, jump, swim or dive)
  ids.filter(id => DRY[frames[id].scene.set]).forEach(id => (frames[id].caption || []).forEach(c => assert.doesNotMatch(capText(c), /\b[Yy]ou (fall|jump|swim|dive|slip|splash|sink)s?\b/, id + ': ' + capText(c))));
  // the height and the noise are funny, not frightening: the airplane sweeps over, and the test cannot be failed
  assert.match(T(F(/^Then you sit through it again tomorrow\./)), /^Then you sit through it again tomorrow\. Like Riffle\. Eleven times\. TEN!$/);
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(fail|fails|failed)\b|sweeps past|so high|long way down|dizzy|terrif|horribl/i, id + ' ' + x.where));
  // the warrior thread stays light: one moment and no promise
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(\w+) to go\b|One day|when you(’re| are) a warrior|your Warrior Counts|you’ll be a warrior/i, id + ' ' + x.where));
  assert.match(T(DEN), /Every warrior in this Clan has sat where you sat today\./);
  // ReedClan is seen far off and never met: three cats on a log who do not wave, and no balloon of theirs
  const reedclan = F(/^Far across it, three cats sit on a log\. They don’t wave\./);
  assert.deepEqual(castOf(reedclan, 'clancat').map(c => c.at), ['log-1', 'log-2', 'log-3']);
  ids.filter(id => frames[id].scene.set === 'marsh').forEach(id => assert.ok(!(frames[id].say || []).some(b => b.who === 'clancat'), id));
  assert.equal(ids.filter(id => /ReedClan/.test(T(id))).length, 2, 'Tallyheart’s rule in the Hollow, and Riffle’s whisper');
  // nobody on the raft or in the marsh says "lives": the Count is the Hollow's; out here it is fish, bumps and herons
  ids.filter(id => ['crossing', 'openriver', 'marsh'].includes(frames[id].scene.set)).forEach(id => assert.doesNotMatch(T(id), /\blives?\b/i, id));
  ['ch05-otter', 'ch05-bill', 'ch05-catch', 'ch05-puddle', 'ch05-wisp'].forEach(sid => countsLines().filter(x => x.set === sid).forEach(x => assert.doesNotMatch(x.text, /\blives?\b/i, sid + ' ' + x.where)));
  // Coil is named in daylight, by a friend who groans at him; at bedtime he is "a nosy old snake", and no
  // bedtime frame says "never shuts his eyes"
  assert.deepEqual(FF(/never shuts his eyes/).map(id => frames[id].scene.fx.filter(e => TOD.includes(e))), [['day']]);
  ids.filter(id => frames[id].scene.fx.includes('night')).forEach(id => assert.doesNotMatch(T(id), /never shuts his eyes|eyelids/, id));
  assert.deepEqual(FF(/Coil|COIL/).map(id => [frames[id].scene.set, castOf(id, 'riffle').map(c => c.pose).join()]), [['marsh', 'groan'], ['den', '']]);
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the text’s own: every caption, balloon, sound effect, option and card line is in docs/chapters/05-riffles-river.md, and every line the text’s screens speak is in the chapter', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/chapters/05-riffles-river.md'), 'utf8');
  const from = doc.indexOf('## Resting his eyes'), to = doc.indexOf('\n- *How this draft was made');
  assert.ok(from > 0 && to > from, 'the story, from its first screen to its notes');
  const screens = doc.slice(from, to), notes = doc.slice(to);
  const flat = t => t.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  // (“Tens first,” says Tallyheart, “to wake up your whiskers.” is one balloon: Tens first, to wake up your whiskers.)
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
      // the labels for a second reading are in its Build notes
      (o.labelWhen || []).forEach(v => assert.ok(flat(notes).includes('“' + v.label + '”'), id + ': ' + v.label));
    });
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '')), id + ': ' + f.scratch.prompt);
    if (f.skip && f.skip.prompt) assert.ok(page.includes(f.skip.prompt.replace(/\*\*/g, '')), id + ': ' + f.skip.prompt);
    if (f.ask) { assert.ok(page.includes(f.ask.prompt.replace(/\*\*/g, ''))); f.ask.pairs.forEach(p => assert.ok(spoken.includes(loose(p[0])) && page.includes('“' + p[1] + '”'), id + ': ' + p.join(' / '))); }
    if (f.input) assert.ok(page.includes(f.input.placeholder) || /…/.test(f.input.placeholder), id);
  });
  Object.keys(story.cards).forEach(cid => assert.ok(page.includes('“' + story.cards[cid].line + '”'), cid + ': ' + story.cards[cid].line));
  // what is the builder's and not the text's: the one sound in the panel that shows him up again after
  // the second “Under the raft” (the frame after each copy has bubbles), and the closing frame in her nest
  const end = ids[ids.length - 1];
  assert.deepEqual(mine, [BUBBLES2 + ' sfx: blub…', end + ': ' + frames[end].caption[0], end + ': End of Chapter Five.']);
  assert.match(frames[end].caption[0], /^You sleep warm in your nest, with nine claws out and one tucked in/);
  // and the other way: every line a screen of the text speaks is lettered somewhere in the chapter (a
  // frame, an option, a Counts set's lines, her cards), but for chapter 4's own three (Squall's riddle,
  // its right line and his card are chapter 4's, included here with the roof)
  const lettered = [];
  everyText((id, x) => lettered.push(String(x.text).replace(/\*\*/g, '')));
  ids.forEach(id => (frames[id].choice ? frames[id].choice.options : []).forEach(o => lettered.push(o.label.replace(/^“|”$/g, ''))));
  const all = loose(lettered.join(' '));
  const also = loose(story.counts['ch05-nines'].facts[2].shows.also);
  const missing = [];
  screens.replace(/\*\*([^*]+)\*\*/g, ' ').replace(/\*[^*]*\*/g, ' ').split(/\n\s*\n/).forEach(p => {
    (p.replace(/\s+/g, ' ').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => {
      // (a line with the {also} token is lettered with or without its middle sentence)
      if (!all.includes(loose(q)) && !all.includes(loose(q).replace(also + ' ', '{also}'))) missing.push(q);
    });
  });
  assert.deepEqual(missing, ['Seven dragonets hold up one forepaw each. Five claws on every forepaw. How many claws does Mama count?', 'THIRTY-FIVE!', 'Squall says two skinny shapes carry something to the tracks.']);
  assert.deepEqual([ch04.counts['ch04-riddle'].facts[0].prompt, ch04.counts['ch04-riddle'].facts[0].right[0].text, ch04.cards['squall-shapes'].line], missing);
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab): the open river, the marsh, Patience, Puddle, Wisp, and what the old places and the cats gain', () => {
  const v = A.vocab;
  assert.ok(v && v.sets && v.sets.openriver && v.sets.marsh && v.otherPoses.patience && v.otherPoses.puddle && v.otherPoses.wisp && v.extras && v.extras.tuck, 'the art exposes chapter 5’s vocabulary');
  // the cast extras this chapter may use: chapter 5's own (the vocabulary lists their values), and the older ones, each `true`
  const OLD = ['flatEars', 'claws', 'squeeze', 'tear', 'purr'];
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
      else assert.ok(Array.isArray(allowed) && allowed.some(x => same(x, val)), id + ': ' + k + '=' + JSON.stringify(val) + ' (compared by value)');
    });
    assert.ok(Array.isArray(s.cast), id + ': cast');
    const used = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'size', 'variant'].concat(Object.keys(v.extras), OLD).includes(k)), [], where + ': keys');
      assert.ok(v.cast.includes(c.who), where + ': unknown who');
      const isCat = CATS.includes(c.who);
      Object.keys(v.extras).forEach(k => { if (c[k] !== undefined) { assert.ok(v.extras[k].some(x => same(x, c[k])), where + ': ' + k + '=' + JSON.stringify(c[k])); seen[k] = (seen[k] || 0) + 1; } });
      OLD.forEach(k => { if (c[k] !== undefined) assert.equal(c[k], true, where + ': ' + k); });
      // who wears what
      if (c.tuck) assert.ok(isCat && c.pose === 'situp', where + ': a claw is tucked on a cat sitting up');
      if (c.asleep || c.snail) assert.equal(c.who, 'grizzled', where + ': the sleeper with the snail is the old tom');
      if (c.buzz) assert.ok(c.who === 'player' && s.set === 'openriver' && s.opts.plane === 'over', where + ': she buzzes under the Roar and nowhere else');
      if (c.dragonfly) assert.ok(c.who === 'player' && s.set === 'marsh' && !['beak', 'nose'].includes(s.opts.dragonfly), where + ': the dragonfly is on her nose, so not on the heron’s beak too');
      if (c.glow) assert.ok(c.who === 'riffle' && frames[id].ask, where + ': the one to tap is Riffle, on the page of questions');
      if (c.tap !== undefined) assert.fail(where + ': no cast member is marked by hand (the sleeper’s nose marks itself; the mud and the pole are the marsh’s)');
      if (c.holds !== undefined) assert.ok(c.who === 'riffle' && ((c.holds === 'pole' && ['hug', 'stand'].includes(c.pose)) || (c.holds === 'fish' && c.pose === 'swim')), where + ': holds ' + c.holds + ' in ' + c.pose);
      if (c.claws) assert.ok(isCat && c.pose === 'pawup', where + ': claws out on a raised paw');
      if (c.reach) assert.ok(c.who === 'player' && c.pose === 'crouch' && s.set === 'marsh' && s.cam === 'mud' && c.at === 'raft-edge' && s.opts.prints === true, where + ': her paw is held out over the prints, crouched at the raft’s edge, and nowhere else');
      if (c.squeeze) assert.ok(['player', 'patience'].includes(c.who), where + ': squeeze');
      if (c.tear) assert.equal(c.who, 'sprinkle', where + ': the happy tear is Sprinkle’s');
      if (c.purr) assert.ok(c.who === 'player' && s.fx.includes('purr'), where + ': purr marks her in a purr panel');
      const poses = isCat ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      // Patience has one level look, and takes no mood; everyone else takes one
      if (c.who === 'patience') assert.equal(c.mood, undefined, where + ': no mood');
      else assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      if (typeof c.at === 'object') {
        assert.deepEqual(Object.keys(c.at).sort(), ['x', 'y'], where + ': a spot is { x, y }');
        assert.ok(c.at.x >= 0 && c.at.x <= 1600 && c.at.y >= 0 && c.at.y <= 1000, where + ': the spot is in the world');
        // a spot of her own is for somebody out in the water (Riffle diving and fishing, Puddle's snout), or under the Old Bridge
        assert.ok(['riffle', 'puddle'].includes(c.who) || s.set === 'bridge', where + ': a spot of its own');
      } else assert.ok(set.anchors.includes(c.at), where + ': set ' + s.set + ' has no anchor ' + c.at);
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      if (c.size !== undefined) assert.ok(typeof c.size === 'number' && c.size > 0.3 && c.size < 2, where + ': size');
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
  // every one of chapter 5's cat extras is used somewhere (but the hand-made tap mark)
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'buzz', 'dragonfly', 'glow', 'holds', 'reach', 'snail', 'tuck']);
  assert.equal(seen.reach, 2, 'the prints’ two frames, a climber’s and everyone else’s');
  // the new cast, in their poses: Patience (seven of hers), Puddle and Wisp
  const posesOf = who => [...new Set(ids.flatMap(id => castOf(id, who).map(c => c.pose)))].sort();
  assert.deepEqual(posesOf('patience'), ['eye', 'feather', 'full', 'gulp', 'point', 'shut', 'stand']);
  assert.deepEqual(posesOf('puddle'), ['head', 'nostrils', 'pawup']);
  // (her `gulp` is the one panel where a cat who found her sees her get her half of the fish)
  assert.deepEqual(posesOf('wisp'), ['blink', 'gulp', 'nod', 'pawup', 'shh']);
  assert.deepEqual(ids.filter(id => castOf(id, 'wisp').some(c => c.pose === 'gulp')), [GULP_W]);
  ['whistle', 'groan', 'flip', 'hop', 'point', 'fall', 'dive', 'swim', 'hug', 'hush'].forEach(p => assert.ok(posesOf('riffle').includes(p), 'Riffle’s ' + p));
  assert.ok(posesOf('sprinkle').includes('lookdown'), 'Sprinkle looks down at her own enormous feet');
  // the skip-counts' and the lessons' pictures name only cast members
  ids.filter(id => frames[id].skip && frames[id].skip.who).forEach(id => frames[id].skip.who.forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
  Object.values(story.counts).forEach(d => d.facts.forEach(f => (f.who || []).forEach(w => assert.ok(v.cast.includes(w.who), w.who))));
  // every card has its drawing, and its mark is one the art knows
  Object.keys(story.cards).forEach(cid => {
    assert.ok(A.cardPictures[cid], 'a drawing for ' + cid);
    assert.ok(A.cardMarks.includes(story.cards[cid].mark), cid);
  });
});

/* ------------------------------------------------------------------ staging */

test('staging, the pile and the Hollow: four rows with the gap, the back row in shadow up to the count, the prints and then the sweep; four marks and then five; only Tallyheart (and our cat, copying her) shows a tucked claw before the Tap', () => {
  const ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  const pile = ids.filter(id => frames[id].scene.set === 'pile'), count = countsAt('ch05-pile')[0];
  assert.equal(pile.length, 10);
  assert.deepEqual(pile, ids.slice(0, 10), 'the chapter opens at the pile, and does not come back to it');
  pile.forEach(id => { assert.deepEqual(frames[id].scene.opts.rows, ROWS, id); assert.equal(frames[id].scene.opts.scale, 'behind', id + ': the “scale” lies where chapter 4 left it'); });
  // the back row is a dark band up to and including the Counts frame: the gap is the next screen's
  pile.forEach(id => assert.equal(frames[id].scene.opts.back, at(id) <= at(count) ? 'shadow' : undefined, id));
  assert.deepEqual([camOf(story.start), camOf(count)], ['pile/rows', 'pile/rows']);
  assert.equal(E.countsSet('ch05-pile', story, PC.story).picture.kind, 'prey', 'the Counts picture is the three front rows, never the frame’s scene');
  // the old tom: asleep with a snail on his ear, then awake with its horns in
  assert.deepEqual([castOf(story.start, 'grizzled')[0].asleep, castOf(story.start, 'grizzled')[0].snail, castOf(count, 'grizzled')[0].asleep, castOf(count, 'grizzled')[0].snail], [true, true, undefined, 'in']);
  assert.ok(!castOf(story.start, 'player').some(c => c.pose === 'sit'), 'she has just come up');
  // the sleeper sits alone at the left end of the rows, the two who have just come up at the right (our cat
  // at the front, Tallyheart further back along the rows, so neither stands on the other): the snore, which
  // the page letters at the left of the panel when both top corners hold captions, is over him and nobody else
  const rowsX = A.sceneInfo('pile').anchors.rows;
  [story.start, count].forEach(id => {
    assert.deepEqual(frames[id].scene.cast.map(c => [c.who, c.at]), [['tallyheart', 'crowd-3'], ['player', 'beside'], ['grizzled', 'pile-left']], id);
    assert.ok(rowsX['pile-left'].x < 400 && rowsX.beside.x > 1200 && rowsX['crowd-3'].x > 1200, id + ': left, and right');
    assert.ok(rowsX['crowd-3'].y < rowsX.beside.y - rowsX.beside.h * 0.6, id + ': Tallyheart is further back, clear of our cat’s head');
  });
  // the fifth mark is where the tree puts it (three to a row): beside the fourth, under the first three
  assert.match(frames[F(/^Tallyheart stretches up the leaning tree\./)].board, /a fifth claw mark into the bark, beside the fourth, in the second row under the first three;/);
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /first of a second row/, id));
  // the gap: two frames with opposite `when`s (a noticing cat's has the Tap), the dug earth big behind it
  const gap = FF(/^Then the back row\. Right in the middle: four empty spaces\. Again\. You didn’t count that\. You just saw it\.$/);
  assert.equal(gap.length, 2);
  assert.deepEqual(gap.map(id => [camOf(id), frames[id].scene.opts.dug, frames[id].scene.opts.prints, frames[id].scene.opts.swept, frames[id].when, E.kindOf(frames[id])]),
    [['pile/gap', 'big', undefined, undefined, { specialty: 'noticing' }, 'scratch'], ['pile/gap', 'big', undefined, undefined, { not: { specialty: 'noticing' } }, 'next']]);
  assert.deepEqual(frames[gap[0]].scene, frames[gap[1]].scene, 'the same picture for everyone');
  // (one after the other: her Tap's page is followed by everyone else's, which is passed over for her)
  assert.deepEqual([frames[gap[0]].else, frames[gap[0]].scratch.next, frames[gap[1]].else], [undefined, gap[1], undefined]);
  // her prints: the frame her Tap turns to, close on the dug earth, nobody in it
  const prints = frames[gap[1]].next;
  assert.deepEqual([E.landing({ flags: { specialty: 'noticing' } }, story, frames[gap[0]].scratch.next), E.landing({ flags: { specialty: 'sneaking' } }, story, gap[0])], [prints, gap[1]]);
  assert.deepEqual([camOf(prints), frames[prints].scene.opts.prints, frames[prints].scene.cast, frames[prints].card, frames[prints].when], ['pile/gap-close', true, [], 'prints-pile', { specialty: 'noticing' }]);
  // then the old tom has walked around the pile (his anchor behind the back row), and from there on the earth is swept
  const stomp = F(/^The old tom stomps around the pile to look\./);
  assert.deepEqual([frames[prints].next, E.landing({ flags: { specialty: 'sneaking' } }, story, frames[gap[1]].next)], [stomp, stomp]);
  assert.deepEqual(castOf(stomp, 'grizzled').map(c => [c.at, c.pose]), [['behind', 'walk']]);
  pile.forEach(id => {
    assert.equal(frames[id].scene.opts.swept, at(id) >= at(stomp) ? true : undefined, id + ': swept');
    assert.equal(frames[id].scene.opts.prints, id === prints ? true : undefined, id + ': the prints are on one panel, and gone when his tail has been over them');
  });
  assert.match(T(frames[stomp].next), /His tail sweeps the prints away\./);
  // Glintstar is at the pile for her two lines, and nowhere else today
  assert.deepEqual(ids.filter(id => castOf(id, 'glintstar').length), FF(/Sixteen pieces in four nights/).concat(FF(/I want proper guards/)));
  // the Hollow: this chapter's rim (three Clan cats, the new warrior second, the old tom last)
  const hollow = ids.filter(id => frames[id].scene.set === 'hollow'), tree = F(/^Tallyheart stretches up the leaning tree\./), tap = ids.find(id => frames[id].skip && frames[id].skip.tuck);
  assert.equal(hollow.length, 10);
  hollow.forEach(id => { assert.equal(frames[id].scene.opts.marks, at(id) >= at(tree) ? 5 : 4, id + ': marks'); assert.equal(frames[id].scene.opts.glow, 'auto', id); });
  assert.deepEqual([camOf(tree), frames[tree].sfx, frames[tree].scene.cast], ['hollow/tree', 'SKRITCH!', []]);
  const rimOf = id => RIM_ANCHORS.map(a => frames[id].scene.cast.find(c => c.at === a)).filter(Boolean);
  assert.deepEqual(rimOf(tap).map(c => [c.who, c.variant]), [['clancat', 1], ['murmurchime', undefined], ['clancat', 3], ['clancat', 5], ['grizzled', undefined]]);
  assert.deepEqual(frames[tap].skip.who, rimOf(tap).map(c => (c.variant ? { who: c.who, variant: c.variant } : { who: c.who })), 'the Tap counts the cats in the picture, left to right');
  hollow.filter(id => rimOf(id).length).forEach(id => rimOf(id).forEach(c => assert.equal(c.pose, 'situp', id + ': the rim sits up')));
  // the tucked claw: before the Tap only Tallyheart's (and our cat's, copying her); the rim keeps all
  // ten out so the Tap opens on fifty; after it every rim cat has one tucked
  hollow.filter(id => at(id) <= at(tap)).forEach(id => frames[id].scene.cast.filter(c => c.tuck).forEach(c => assert.ok(['tallyheart', 'player'].includes(c.who), id + ': ' + c.who + ' tucks before the Tap')));
  const curl = F(/^Tallyheart curls one claw back in\./), holds = F(/^Tallyheart holds out both forepaws\./);
  assert.deepEqual([castOf(holds, 'tallyheart')[0].pose, castOf(holds, 'tallyheart')[0].tuck, castOf(curl, 'tallyheart')[0].pose, castOf(curl, 'tallyheart')[0].tuck], ['situp', undefined, 'situp', true], 'ten claws out as she says ten, one curled in as she says nine');
  assert.equal(frames[holds].sfx, 'Shhnk! Shhnk!');
  const nines = countsAt('ch05-nines')[0];
  assert.equal(frames[tap].skip.next, nines);
  assert.ok(rimOf(nines).length === 5 && rimOf(nines).every(c => c.tuck === true), 'FORTY-FIVE: five claws tucked');
  assert.deepEqual([camOf(tap), camOf(nines)], ['hollow/wide', 'hollow/wide'], 'the kept picture stays where the Tap was');
  // the new warrior speaks from the rim after 9 × 9, so she sits there in the Counts frame
  assert.ok(castOf(nines, 'murmurchime').length === 1 && castOf(nines, 'murmurchime')[0].at === 'rim-2');
  // the warm-up's frame: the rim cats sit up here, before she is asked about them
  const warm = countsAt('ch05-tens')[0];
  assert.deepEqual([rimOf(warm).length, frames[warm].counts.intro], [5, false]);
  assert.deepEqual(E.countsSet('ch05-tens', story, PC.story).facts[1].who, frames[tap].skip.who, '5 × 10 pictures the five rim cats');
  assert.deepEqual(E.countsSet('ch05-nines', story, PC.story).facts[0].who, frames[tap].skip.who.slice(0, 2), '2 × 9 the first two');
});

test('staging, the tower, the Crossing and the open river: the offer’s roar; Riffle’s pole; Tallyheart on the high rock and then far off on the rocks; the airplane far, near, over and gone; nobody but an otter or a dragonet beside the raft; late light on the way home', () => {
  // the tower's offer is chapter 4's picture, with the roar; Waffles' "AGAIN?" is her railing without it
  assert.deepEqual([camOf(TOWER), frames[TOWER].scene.opts, frames[TOWER].sfx], ['tower/up', { chime: true, light: true, roar: true }, 'RAWWWRRR… hic!']);
  assert.deepEqual([camOf(NOT[0]), frames[NOT[0]].scene.opts.roar, castOf(NOT[0], 'waffles')[0].at], ['tower/up', undefined, 'railing']);
  // the Crossing: no skymonster over it (the Roar is out on the open river)
  const crossing = ids.filter(id => frames[id].scene.set === 'crossing');
  crossing.forEach(id => assert.equal(frames[id].scene.opts.plane, 'none', id));
  // Riffle hugs a pole twice his size on his first three panels, and poles with it after
  assert.deepEqual(castOf(CROSSING, 'riffle').map(c => [c.pose, c.holds, c.at]), [['hug', 'pole', 'raft-1']]);
  ids.filter(id => /Coil|never shuts his eyes/i.test(T(id))).forEach(id => assert.ok(!castOf(id, 'riffle').some(c => c.pose === 'hug'), id + ': no hugging where the snake is named'));
  assert.equal(castOf(BRIDGE, 'riffle')[0].pose, 'swim', '“You purr at him the whole way”: he swims beside her');
  // Tallyheart: no frame at the Crossing before the rules; her first is on the high rock; she counts the paws from the rocks
  const hers = crossing.filter(id => castOf(id, 'tallyheart').length);
  assert.ok(at(hers[0]) > at(RULES));
  assert.deepEqual([T(hers[0]), castOf(hers[0], 'tallyheart')[0].at], ['And on the rocks sits Tallyheart. A mentor never misses a first Roar.', 'rock-high']);
  ids.slice(0, at(RULES)).forEach(id => { (frames[id].caption || []).concat(frames[id].say || []).forEach(x => assert.doesNotMatch(typeof x === 'string' ? x : x.text, /\bRoar\b/, id + ': the word is not on screen before the otter who runs it says it')); });
  assert.match(T(RULES), /^Every apprentice sits on my raft while a skymonster goes over\. That’s the Roar\. It’s the courage test\./);
  // the paws Tap and the two panels after it are the `board` camera: her paws at the rocks' edge and the first log
  const board = ids.find(id => frames[id].skip && frames[id].skip.paws === 'board');
  assert.deepEqual([camOf(board), camOf(frames[board].skip.next)], ['crossing/board', 'crossing/board']);
  assert.deepEqual([castOf(board, 'player')[0].at, castOf(frames[board].skip.next, 'player')[0].at], ['shore', 'raft-1'], 'ashore, then aboard');
  // Riffle never vanishes from his own raft: from the panel where her paws go aboard to the last panel at the
  // Crossing, every panel whose camera shows his seat has him in it (her whisper, told path: he is at the far
  // end with his back to them, where the panel before has him; and both copies of “What the otters heard”,
  // the thought panel and the sniff panel included)
  const whisper = F(/^She leans close\./);
  assert.deepEqual(castOf(whisper, 'riffle').map(c => [c.pose, c.at, c.facing, c.holds]), [['stand', 'raft-3', 'right', 'pole']]);
  assert.deepEqual(castOf(frames[board].skip.next, 'riffle').map(c => [c.pose, c.at, c.holds]), [['stand', 'raft-3', 'pole']], 'the panel before it: the same otter, the same end of the raft');
  crossing.filter(id => at(id) >= at(board) && ['board', 'raft'].includes(frames[id].scene.cam)).forEach(id => assert.equal(castOf(id, 'riffle').length, 1, id + ': Riffle is on his raft'));
  [OTTERS1, OTTERS2].forEach(copy => copy.filter(id => castOf(id, 'player').length).forEach(id => assert.deepEqual(castOf(id, 'riffle').map(c => c.at), ['raft-2'], id + ': beside her on the logs')));
  // Riffle's promise (the water worry): she sits in the exact middle of the raft, his pole planted beside her
  const promise = F(/Otter’s honor\.$/);
  assert.deepEqual([castOf(promise, 'player')[0].at, castOf(promise, 'riffle')[0].at, castOf(promise, 'riffle')[0].holds, camOf(promise)], ['raft-2', 'raft-3', 'pole', 'crossing/raft']);
  // SKYMONSTER: both paws flung up at the light (pointing straight down is for his slip on the way home, and nowhere else)
  const yell = F(/^Far down the river, a light\./);
  assert.deepEqual(castOf(yell, 'riffle').map(c => [c.pose, c.mood]), [['hop', 'shout']]);
  assert.deepEqual(ids.filter(id => castOf(id, 'riffle').some(c => c.pose === 'point')), [F(/I’m only POINTING\.$/)]);
  // the open river, first time out: the airplane's four places, in order
  const river1 = ids.filter(id => frames[id].scene.set === 'openriver' && at(id) < at(MARSH)), river2 = ids.filter(id => frames[id].scene.set === 'openriver' && at(id) > at(MARSH));
  const planes = river1.filter(id => at(id) <= at(HOME)).map(id => frames[id].scene.opts.plane);
  assert.deepEqual([...new Set(planes)], ['none', 'far', 'over', 'gone'], 'none, far, (near and over as she taps,) over, gone: ' + planes.join(' '));
  assert.deepEqual(frames[LOG].skip.steps.map(s => [s.from, s.opts.plane, s.sfx]), [[1, 'far', 'rrr…'], [4, 'near', 'RRRrrr…'], [7, 'over', 'RRRRRR…']], 'three sizes as she digs in her nine claws');
  river1.filter(id => at(id) > at(HOME)).forEach(id => assert.equal(frames[id].scene.opts.plane, 'none', id + ': the sky is empty again'));
  // the log Tap: her own two forepaws on the log (Riffle's webbed one beside them is the art's): the cast is Tallyheart, far off
  assert.deepEqual([camOf(LOG), frames[LOG].scene.cast.map(c => c.who + '@' + c.at)], ['openriver/log', ['tallyheart@far-rocks']]);
  const still = F(/Not an ear\. Not one of nine claws\. Then it’s gone\.$/);
  assert.deepEqual([camOf(still), frames[still].scene.opts.claws, frames[still].scene.opts.plane], ['openriver/log', 9, 'gone'], 'nine claws dug in, the tenth tucked');
  ids.filter(id => camOf(id) === 'openriver/log').forEach(id => assert.ok(frames[id].scene.cast.every(c => c.at === 'far-rocks'), id));
  // Tallyheart watches from the far rocks through the Roar, with nine claws up; from the frame where she turns for home she is gone till the den
  river1.filter(id => at(id) <= at(HOME) && camOf(id) !== 'openriver/sky').forEach(id => assert.deepEqual(castOf(id, 'tallyheart').map(c => c.at), ['far-rocks'], id));
  assert.equal(castOf(HOME, 'tallyheart')[0].pose, 'walk');
  ids.filter(id => at(id) > at(HOME) && at(id) < at(DEN)).forEach(id => {
    assert.equal(castOf(id, 'tallyheart').length, 0, id + ': Tallyheart went home after the Roar');
    assert.ok(!(frames[id].say || []).some(b => b.who === 'tallyheart'), id);
  });
  // her buzz, her squeezed eyes, the small face at the window
  const roar = ids.find(id => frames[id].choice && frames[id].sfx === 'ROOOOOAAAAARRRRR!' && frames[id].scene.set === 'openriver');
  assert.deepEqual([frames[roar].scene.opts.plane, castOf(roar, 'player')[0].buzz, castOf(roar, 'player')[0].mood], ['over', true, 'scared']);
  const [shut, open] = frames[roar].choice.options.map(o => o.next);
  assert.deepEqual([castOf(shut, 'player')[0].squeeze, camOf(open), frames[open].scene.opts.face], [true, 'openriver/sky', true]);
  // the shivering raft, the foot, the head: nobody but an otter or a dragonet beside the raft
  ids.filter(id => frames[id].scene.set === 'openriver').forEach(id => frames[id].scene.cast.filter(c => c.at === 'beside').forEach(c => assert.equal(c.who, 'puddle', id)));
  [UNDER1, UNDER2].forEach((copy, n) => {
    const late = n === 1;
    copy.forEach(id => { assert.equal(frames[id].scene.set, 'openriver', id); assert.equal(frames[id].scene.opts.late, late ? true : undefined, id + ': late'); });
    assert.deepEqual([camOf(copy[0]), frames[copy[0]].scene.opts.foot, frames[copy[0]].scene.opts.shiver, castOf(copy[0], 'puddle').length], ['openriver/edge', true, true, 0], 'his foot first: he is not in the cast yet');
    copy.slice(1).forEach(id => assert.deepEqual(castOf(id, 'puddle').map(c => c.at), ['beside'], id));
    assert.equal(castOf(copy[copy.length - 1], 'puddle')[0].pose, 'pawup');
    // she stays on the raft, and in all eight panels the order is Riffle, our cat, Puddle, left to right: the
    // `edge` and `beside` cameras see the raft from its other side (their `raft-2` is left of their `raft-1`),
    // so in the three `raft`-camera panels she sits at `raft-2`, next to the water he is in, and Riffle
    // behind her at `raft-1` (they used to trade places at every page turn, and she shouted “Our PILE!” into
    // Riffle’s chest)
    const spots = A.sceneInfo('openriver').anchors;
    copy.forEach(id => {
      const cam = frames[id].scene.cam, me = castOf(id, 'player')[0], rf = castOf(id, 'riffle')[0], pd = castOf(id, 'puddle')[0], x = c => spots[cam][c.at].x;
      assert.deepEqual([me.at, rf.at], cam === 'raft' ? ['raft-2', 'raft-1'] : ['raft-1', 'raft-2'], id + ': she stays on the raft');
      assert.ok(x(rf) < x(me) && (!pd || x(me) < x(pd)), id + ': Riffle, our cat, Puddle, left to right');
    });
    assert.deepEqual(copy.map(id => frames[id].scene.cam), ['edge', 'beside', 'raft', 'beside', 'raft', 'beside', 'raft', 'beside']);
  });
  UNDER1.forEach((id, i) => {
    const a = frames[id], b = frames[UNDER2[i]];
    assert.deepEqual([a.caption, a.say, a.sfx, a.card, a.sets, E.kindOf(a), a.scene.cam, a.scene.cast], [b.caption, b.say, b.sfx, b.card, b.sets, E.kindOf(b), b.scene.cam, b.scene.cast], id + ' and ' + UNDER2[i] + ': one scene, in two lights');
    // (on the way home the string with the two spare fish lies on the raft)
    assert.deepEqual(Object.assign({}, a.scene.opts, { late: true, fish: 'spare' }), b.scene.opts);
  });
  // the frame after either copy has bubbles: he is seen to be up again
  assert.deepEqual([frames[UNDER1[7]].skip.next, frames[WITNESS].scene.opts.bubbles, frames[UNDER2[7]].skip.next, frames[BUBBLES2].scene.opts.bubbles], [WITNESS, true, BUBBLES2, true]);
  const blub = F(/^Under the logs, something goes blub\.$/);
  assert.equal(frames[blub].scene.opts.bubbles, true);
  const shiver = F(/^The river goes quiet\. But the raft is still shivering\./);
  assert.deepEqual([frames[shiver].scene.opts.shiver, frames[RAFT].scene.opts.shiver, castOf(RAFT, 'riffle')[0].pose], [true, true, 'whistle']);
  // the way home is in late light: every river and Crossing panel after the marsh, and none before it
  river2.concat(OTTERS2).forEach(id => assert.equal(frames[id].scene.opts.late, true, id));
  river1.concat(crossing.filter(id => at(id) < at(MARSH))).forEach(id => assert.equal(frames[id].scene.opts.late, undefined, id));
  // …and the string with its two spare fish rides home on the raft (“Eighteen for Patience. Two to spare.”
  // is said, so the two are drawn: the marsh's last panels have them on the logs, and they do not vanish
  // when the raft pushes off): every river and Crossing panel after the marsh, and none before it
  river2.concat(OTTERS2).forEach(id => assert.equal(frames[id].scene.opts.fish, 'spare', id + ': the spare fish'));
  river1.concat(crossing.filter(id => at(id) < at(MARSH))).forEach(id => assert.equal(frames[id].scene.opts.fish, undefined, id));
  assert.ok(river2.length >= 13 && OTTERS2.length === 9);
  // (the Crossing lays the string where `raft-3` is, so nobody is cast there on the way home)
  OTTERS2.forEach(id => assert.ok(!frames[id].scene.cast.some(c => c.at === 'raft-3'), id));
  // “What the otters heard”, in two lights: the same scene, word for word; the tuft from the panel where he lifts the vine
  const pairUp = OTTERS1.map((id, i) => [id, OTTERS2[i]]);
  assert.equal(OTTERS1.length, OTTERS2.length);
  pairUp.forEach(([a, b], i) => {
    const x = frames[a], y = frames[b];
    assert.deepEqual([x.say, x.sfx, x.card, E.kindOf(x), x.scene.cam, x.scene.cast], [y.say, y.sfx, y.card, E.kindOf(y), y.scene.cam, y.scene.cast], a + ' and ' + b);
    assert.deepEqual(Object.assign({}, x.scene.opts, { late: true, fish: 'spare' }), y.scene.opts, a + ' and ' + b);
    // the captions are the same but for the way in (the raft comes back to the rocks; “At last, the Crossing again”)
    // and the last line of the second copy, which sets the fur beside the prints she has already seen
    if (i > 0 && i < OTTERS1.length - 1) assert.deepEqual(x.caption, y.caption, a + ' and ' + b);
  });
  assert.deepEqual([frames[OTTERS1[0]].caption, frames[OTTERS2[0]].caption], [['Riffle pushes the raft back to the rocks.'], ['At last, the Crossing again.']]);
  const lastA = OTTERS1[OTTERS1.length - 1], lastB = OTTERS2[OTTERS2.length - 1];
  assert.deepEqual([frames[lastA].caption, frames[lastB].caption], [['Somebody small.'], ['Somebody small.', 'Tiny prints there. Thin fur here. The same somebody?']]);
  [OTTERS1, OTTERS2].forEach(copy => {
    const vine = copy.find(id => /^He lifts the raft’s vine\./.test(T(id)));
    copy.forEach(id => assert.equal(frames[id].scene.opts.tuft, at(id) >= at(vine) ? true : undefined, id + ': the tuft'));
    copy.forEach(id => assert.equal(frames[id].scene.set, 'crossing', id));
    const sniff = copy.find(id => frames[id].scratch);
    assert.deepEqual([camOf(sniff), frames[sniff].scratch.tap, frames[frames[sniff].scratch.next].card, castOf(frames[sniff].scratch.next, 'player')[0].mood], ['crossing/raft', 'fur', 'fur', 'sniff']);
  });
});

test('staging, the marsh: her feet never on it; the dragonfly; the fish she owes, 7, 8 and 9 and the same before and after each free line; the prints, the mud and the pole; the pole planted from the dive to the catch; the reeds’ tells; the spare fish and the frogs', () => {
  const marsh = ids.filter(id => frames[id].scene.set === 'marsh');
  assert.equal(marsh.length, 53, 'the gulp is two frames, one for each kind of reader');
  assert.deepEqual([marsh[0], marsh[marsh.length - 1]], [MARSH, F(/She means COIL\./)], 'one visit');
  marsh.forEach(id => assert.ok(at(id) >= at(MARSH) && at(id) <= at(marsh[marsh.length - 1])));
  // her feet are never on a marsh anchor: she is on the raft in every picture, or up its pole
  marsh.forEach(id => {
    // (`raft-edge`: on the front lip of the raft's near log, for the two frames where her paw is held over a print)
    castOf(id, 'player').forEach(c => assert.ok(c.at === 'raft-1' || (c.at === 'pole-top' && frames[id].when && frames[id].when.specialty === 'climbing') ||
      (c.at === 'raft-edge' && /You hold your paw over one\./.test(T(id))), id + ': our cat at ' + c.at));
    frames[id].scene.cast.forEach(c => { if (['shallows', 'reed'].includes(c.at)) assert.equal(c.who, c.at === 'reed' ? 'wisp' : 'patience', id + ': ' + c.who + ' at ' + c.at); });
    // Patience stands in her shallows in every panel but the view from the top of the pole
    assert.deepEqual(castOf(id, 'patience').map(c => c.at), camOf(id) === 'marsh/pole' ? [] : ['shallows'], id);
    // “our cat is on the raft in every marsh picture”: she is in every one of them, the close ones among the reeds too
    assert.equal(castOf(id, 'player').length, 1, id + ': she is in the picture');
  });
  // ReedClan: three far cats on their log, on one panel
  assert.deepEqual(marsh.filter(id => castOf(id, 'clancat').length).map(id => [camOf(id), castOf(id, 'clancat').length]), [['marsh/far', 3]]);
  // the dragonfly: asleep on her beak from the first panel until it leaves for our cat's nose
  const nose = F(/^Then the dragonfly leaves Patience’s beak, and lands on your nose\./);
  marsh.forEach(id => {
    const o = frames[id].scene.opts;
    if (camOf(id) === 'marsh/pole') return;
    if (at(id) < at(nose) && !/b$/.test(id)) assert.equal(o.dragonfly, 'beak', id);
    if (at(id) >= at(nose) && /a$/.test(id)) assert.equal(o.dragonfly, undefined, id + ': it has left her beak');
  });
  assert.deepEqual([castOf(nose, 'player')[0].dragonfly, castOf(nose, 'player')[0].pose], [true, 'loaf']);
  // the loud ways out: she yells from the raft; after the first the dragonfly is still on the beak, after the others it has gone
  WAITS.forEach((w, i) => {
    const yell = frames[w].choice.options[1].next, then = frames[yell].next;
    assert.deepEqual([castOf(yell, 'player')[0].mood, frames[yell].say[0].kind, frames[yell].say[0].text], ['shout', 'shout', ['ONE! TWO!', 'THREE!', 'FIVE!'][i]]);
    assert.equal(frames[then].scene.opts.frogs, 'jump', then + ': the frogs jump in');
    assert.equal(frames[then].scene.opts.pale, i === 0 ? 'flinch' : 'reed', then + ': one reed flinches, the first time only');
  });
  assert.match(T(frames[frames[WAITS[0]].choice.options[1].next].next), /^Every frog jumps in\. Patience shuts both eyes\. One reed flinches\.$/);
  // where she “watches the stand of reeds the way the heron does” her eyes are open (the happy face shuts
  // them), and she answers “A reed with knees.” / “Frogs.” with a perfectly straight face
  const SHUT_EYES = ['happy', 'proud', 'laugh', 'sleepy'];
  assert.ok(!SHUT_EYES.includes(castOf(REED[0], 'player')[0].mood), 'watching the reeds: ' + castOf(REED[0], 'player')[0].mood);
  assert.equal(castOf(countsAt('ch05-catch')[0], 'player')[0].mood, 'solemn');
  // the pale reed's tells, wait by wait: a reed, a reed with knees, a blink
  assert.deepEqual(REED.slice(0, 4).map(id => frames[id].scene.opts.pale), ['reed', 'reed', 'knees', 'blink']);
  // the fish she owes: nothing until Riffle asks; a pair for each of his seven questions; an eighth
  // with “No.”; a ninth with the two shapes; and the same number before and after each free line
  const ask = ids.find(id => frames[id].ask), owed = id => frames[id].scene.opts.owed;
  assert.equal(owed(ask), 0);
  marsh.filter(id => at(id) < at(ask)).forEach(id => assert.equal(owed(id), undefined, id));
  const no = F(/^One eye shuts\. No\./), shapes = F(/^When the rain stopped: two small shapes, crossing my mud\./), bill = countsAt('ch05-bill')[0];
  marsh.filter(id => at(id) > at(ask) && at(id) <= at(bill) && camOf(id) !== 'marsh/pole').forEach(id => assert.equal(owed(id), at(id) < at(no) ? 7 : at(id) < at(shapes) ? 8 : 9, id + ': owed'));
  marsh.filter(id => at(id) > at(bill)).forEach(id => assert.equal(owed(id), undefined, id + ': the bill is counted, and the cloud is gone'));
  const free = [F(/^I was only saying HELLO! You did not say hello\. Hello is free\./), F(/That one is free\.$/), F(/^They come back every night\. They do not wipe their feet\. That is not an answer\. It is a complaint\.$/)];
  free.forEach(id => {
    const before = ids[at(id) - 1], after = exits(frames[id])[0];
    assert.equal(owed(before), owed(id), id + ': the same number before');
    assert.equal(owed(after), owed(id), id + ': and after');
  });
  assert.deepEqual([owed(countsAt('ch05-otter')[0]), owed(no), owed(shapes), owed(bill)], [7, 8, 9, 9]);
  assert.deepEqual([frames[no].card, frames[shapes].card], ['heron-no-moon', 'heron-shapes']);
  // the prints: from the complaint (her beak points at the mud) to the frame after them; the two Taps' targets are the marsh's own
  const complaint = free[2], printsA = frames[complaint].scratch.next, printsB = frames[printsA].scratch.next, top = frames[printsB].next, same2 = frames[top].next;
  assert.deepEqual([frames[printsA].else, frames[printsB].else], [undefined, undefined], 'one after the other, as the gap is');
  assert.deepEqual([{ specialty: 'climbing' }, { specialty: 'friends' }].map(flags => [E.landing({ flags }, story, printsA), E.landing({ flags }, story, exits(frames[E.landing({ flags }, story, printsA)])[0])]), [[printsA, top], [printsB, E.landing({ flags: { specialty: 'friends' } }, story, same2)]]);
  assert.deepEqual([castOf(complaint, 'patience')[0].pose, frames[complaint].scene.opts.tap, frames[complaint].scratch.tap], ['point', 'mud', 'mud']);
  assert.deepEqual([frames[printsA].scene.opts.tap, frames[printsA].scratch.tap, camOf(printsA), frames[printsB].scene.opts.tap, camOf(printsB)], ['pole', 'pole', 'marsh/mud', undefined, 'marsh/mud']);
  assert.deepEqual([frames[printsA].when, frames[printsB].when, frames[printsA].card, frames[printsB].card], [{ specialty: 'climbing' }, { not: { specialty: 'climbing' } }, 'prints-marsh', 'prints-marsh']);
  assert.deepEqual([frames[printsA].caption, castOf(printsA, 'riffle')[0].holds], [frames[printsB].caption, 'pole'], 'the same screen for everyone; a climber has the Tap');
  // “You hold your paw over one. It’s half the size of yours.”: crouched at the raft's very edge, one forepaw
  // held out and down over a print (the art's `raft-edge` and `reach`): the picture has the clue in it
  [printsA, printsB].forEach(id => {
    assert.deepEqual(castOf(id, 'player').map(c => [c.pose, c.at, c.facing, c.reach]), [['crouch', 'raft-edge', 'right', true]], id);
    assert.match(frames[id].board, /crouched at the very edge of the logs, holds one forepaw out and down over a print without touching the mud: the print is half the size of the paw/, id);
    assert.deepEqual(castOf(id, 'riffle').map(c => [c.at, c.pose]), [['raft-2', 'stand']], id);
  });
  assert.deepEqual(frames[printsA].scene.cast, frames[printsB].scene.cast, 'the same picture, but for the pole’s Tap');
  assert.deepEqual(ids.filter(id => frames[id].scene.cast.some(c => c.at === 'raft-edge' || c.reach)), [printsA, printsB]);
  assert.deepEqual([camOf(top), frames[top].card, frames[top].when, castOf(top, 'player')[0].at], ['marsh/pole', 'prints-tracks', { specialty: 'climbing' }, 'pole-top']);
  [complaint, printsA, printsB, top, same2].forEach(id => assert.equal(frames[id].scene.opts.prints, true, id));
  // …and they stay in the mud to the end of the marsh: nobody wipes them (“They come back every night”;
  // it is the pile's prints an old tom's tail sweeps away, not these), on every camera that shows the mud
  // beside the raft. The two close cameras among the reeds have none to show.
  const NO_MUD = ['marsh/wisp', 'marsh/draw'];
  marsh.filter(id => at(id) < at(complaint)).forEach(id => assert.equal(frames[id].scene.opts.prints, undefined, id + ': not seen before she is shown them'));
  marsh.filter(id => at(id) >= at(complaint)).forEach(id => assert.equal(frames[id].scene.opts.prints, NO_MUD.includes(camOf(id)) ? undefined : true, id + ': the prints stay'));
  assert.ok(marsh.filter(id => at(id) > at(same2) && frames[id].scene.opts.prints).length >= 20);
  assert.deepEqual(frames[same2].when, { not: { ch5First: 'heron', not: { specialty: 'noticing' } } }, 'read by a noticing cat, or one who asked the otters first');
  // from the frame where Riffle dives to the frame where he heaves the fish aboard, every marsh scene has
  // his pole planted (it holds the raft still while she waits), and he is in the water or out of sight
  marsh.forEach(id => assert.equal(frames[id].scene.opts.pole, at(id) >= at(DIVE) ? 'planted' : undefined, id + ': pole'));
  assert.deepEqual([frames[DIVE].say.map(b => b.text), frames[DIVE].sfx, castOf(DIVE, 'riffle')[0].pose], [['Back in eighteen fish!'], 'SPLOOSH!', 'dive']);
  assert.equal(frames[DIVE].next, WAITS[0], 'the frame after the dive has the pole and the choice');
  assert.match(T(WAITS[0]), /^His pole stands in the mud, holding the raft still\./);
  marsh.filter(id => at(id) > at(DIVE) && at(id) < at(HEAVE)).forEach(id => castOf(id, 'riffle').forEach(c => assert.ok(c.pose === 'swim' && typeof c.at === 'object', id + ': Riffle is fishing')));
  marsh.filter(id => at(id) < at(DIVE)).forEach(id => { if (camOf(id) !== 'marsh/pole') assert.deepEqual(castOf(id, 'riffle').map(c => c.at), ['raft-2'], id + ': Riffle is on the raft beside her'); });
  // the catch: four strings on the logs for the count; then down they go, two to spare, with the frogs back on their pads
  const catchF = countsAt('ch05-catch')[0];
  marsh.forEach(id => assert.equal(frames[id].scene.opts.fish, at(id) >= at(GULP) ? 'spare' : at(id) >= at(HEAVE) ? 'strings' : undefined, id + ': fish'));
  assert.ok(at(GULP) > at(catchF) && frames[catchF].counts.next === GULP);
  // the gulp: two frames with opposite `when`s, one after the other (as the gap's and the prints' are): the
  // same panel, and for a cat who found Wisp she is in it, out from among the reeds, her own small bump
  // going down (“One for Patience. One for Wisp.”: the picture shows her get her half)
  const full = F(/^I am full\. You dive well, otter\.$/);
  assert.deepEqual([at(GULP_W) - at(GULP), frames[GULP].next, frames[GULP_W].next, frames[GULP].else, frames[GULP_W].else], [1, GULP_W, full, undefined, undefined]);
  assert.deepEqual([frames[GULP].when, frames[GULP_W].when], [{ foundWisp: false }, { foundWisp: true }]);
  assert.deepEqual([frames[GULP].caption, frames[GULP_W].caption], [['Down go the fish.'], ['Down go the fish. One for Patience. One for Wisp.']]);
  [GULP, GULP_W].forEach(id => assert.deepEqual([camOf(id), frames[id].scene.opts.fish, frames[id].scene.opts.frogs, castOf(id, 'patience')[0].pose, frames[id].sfx], ['marsh/wide', 'spare', 'sit', 'gulp', 'Gulp. Gulp. Gulp.'], id));
  assert.deepEqual(castOf(GULP_W, 'wisp').map(c => [c.pose, c.mood, c.at, c.facing]), [['gulp', 'happy', 'reed', 'left']]);
  assert.deepEqual(Object.assign({}, frames[GULP_W].scene, { cast: frames[GULP_W].scene.cast.filter(c => c.who !== 'wisp') }), frames[GULP].scene, 'the same panel, but for her');
  assert.equal(castOf(GULP, 'wisp').length, 0, 'for everyone else nothing in the reeds is seen to eat');
  assert.match(frames[GULP].board, /In the pale reeds behind her nothing is seen to eat\./);
  assert.match(frames[GULP_W].board, /the pale dragonet stands in plain sight now, her head tipped back the same way and a small bump of her own going down her long neck/);
  [{ foundWisp: true }, {}, { foundWisp: false }].forEach(flags => assert.deepEqual([E.landing({ flags }, story, GULP), E.landing({ flags }, story, exits(frames[E.landing({ flags }, story, GULP)])[0])], [flags.foundWisp ? GULP_W : GULP, full], JSON.stringify(flags)));
  assert.deepEqual(frames[catchF].say.map(b => [b.who, b.text, b.when]), [['riffle', 'What did I miss?', undefined], ['player', 'A reed with knees.', { foundWisp: true }], ['player', 'Frogs.', { foundWisp: false }]]);
  // Wisp: in the reeds' own panels, and once more at the gulp for a cat who found her; always on her reed;
  // her riddle and her drawing are the mud's
  marsh.forEach(id => castOf(id, 'wisp').forEach(c => { assert.ok((REED.includes(id) || id === GULP_W) && c.at === 'reed', id); }));
  ids.filter(id => castOf(id, 'wisp').length && !REED.includes(id)).forEach(id => assert.deepEqual(frames[id].when, { foundWisp: true }, id + ': outside her own scene she is drawn only for a cat who has met her'));
  assert.deepEqual([camOf(countsAt('ch05-wisp')[0]), frames[countsAt('ch05-wisp')[0]].scene.opts.drawing], ['marsh/draw', 'herons']);
  const fox = ids.find(id => frames[id].card === 'wisp-fox');
  assert.deepEqual([camOf(fox), frames[fox].scene.opts.drawing, frames[frames[fox].next].scene.opts.drawing, frames[frames[fox].next].sets], ['marsh/draw', 'fox', 'fox', { foundWisp: true }]);
  // Puddle's snout in the reeds: the two frames a cat who found him reads, between her name and the price
  const snout = marsh.filter(id => frames[id].scene.opts.snout);
  assert.deepEqual(snout.map(id => [frames[id].when, castOf(id, 'puddle')[0].pose]), [[{ foundPuddle: true }, 'nostrils'], [{ foundPuddle: true }, 'nostrils']]);
  assert.match(T(ids[at(snout[0]) - 1]), /She told me her name: Wisp\./);
  assert.match(T(exits(frames[snout[1]])[0]), /^Two fish for every answer\. One for me\. One for her\.$/);
  marsh.filter(id => !snout.includes(id)).forEach(id => assert.equal(castOf(id, 'puddle').length, 0, id));
});

test('staging, the Old Bridge and the den: the mud’s seven forepaws only for the count; the branch for a cat who told, the eyes for one who kept; a thicker moon at dusk and none at night; today’s bark along her nest', () => {
  const bridge = ids.filter(id => frames[id].scene.set === 'bridge'), den = ids.filter(id => frames[id].scene.set === 'den');
  assert.deepEqual([bridge.length, den.length], [12, 21]);
  assert.deepEqual([camOf(BRIDGE), frames[BRIDGE].scene.opts, frames[BRIDGE].scene.fx, castOf(BRIDGE, 'player')[0].purr, castOf(BRIDGE, 'riffle')[0].at], ['bridge/bank', { drag: false }, ['sunset', 'purr'], true, 'water']);
  bridge.slice(1).forEach(id => { assert.equal(frames[id].scene.opts.prints, true, id + ': her footprints of three days in the mud'); assert.ok(['bridge/back', 'bridge/under'].includes(camOf(id)), id); });
  const told = F(/^Under the Old Bridge, two big eyes shine\. They peek over Tallyheart’s branch\.$/), kept = F(/^At the Old Bridge, you check the bank first\. No ginger ears\. Under the bridge, two big eyes shine\.$/);
  assert.deepEqual([frames[told].when, frames[told].scene.opts.branch, castOf(told, 'sprinkle')[0].pose, frames[kept].when, frames[kept].scene.opts.eyes, castOf(kept, 'sprinkle').length], [{ ch3Told: true }, true, 'peek', { ch3Told: false }, 'sprinkle', 0]);
  bridge.filter(id => id !== told).forEach(id => assert.equal(frames[id].scene.opts.branch, undefined, id));
  // the mud count: seven little forepaws, on its frame and the one after (both only for a cat with a find today)
  const after = frames[MUD].skip.next;
  bridge.forEach(id => assert.equal(frames[id].scene.opts.mudPaws, id === MUD || id === after ? 7 : undefined, id + ': mudPaws'));
  assert.deepEqual([camOf(MUD), frames[MUD].when, frames[after].when, castOf(MUD, 'sprinkle')[0].pose], ['bridge/back', ANY, ANY, 'draw']);
  assert.equal(castOf(F(/^Sprinkle looks down at her own enormous feet\./), 'sprinkle')[0].pose, 'lookdown');
  // the telling is in the wide view of the den: from inside the doorway its two balloons' tails crossed, and
  // both read as Tallyheart's (a noticing cat's pair, and a climber's)
  assert.deepEqual([camOf(TELLING), frames[TELLING].scene.opts.bark, castOf(TELLING, 'player')[0].at, castOf(TELLING, 'tallyheart')[0].at], ['den/outside', undefined, 'entrance-left', 'entrance-right']);
  assert.match(frames[TELLING].board, /^WIDE, AT THE DEN, DUSK\. At the doorway our cat tells the day with its paws,/);
  // the storm was the first night and this is the fifth evening: four nights ago
  assert.match(frames[F(/find me somebody else who was awake when the rain stopped/)].board, /to where the rain stopped four nights ago;/);
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /five nights ago/, id));
  // the Crossing's water is the deep blue the set has drawn since chapter 2, and the open river is the same water,
  // bright blue (README, "Claude's calls under decision 46", 2026-10-12): no board in the chapter calls the river green-brown
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /green-brown/, id));
  assert.match(frames[F(/Still deep\. I looked right at it\./)].board, /a small inset shows the wide bright river from the middle of a raft/);
  // Riffle is with her under the bridge; Tallyheart is not (she is waiting at the den)
  bridge.slice(1).forEach(id => { assert.equal(castOf(id, 'riffle').length, 1, id); assert.equal(castOf(id, 'tallyheart').length, 0, id); });
  // the den: a thicker moon for the dusk panels (the fifth night), none at night; her stone where she put it; today's bark
  den.forEach(id => {
    const o = frames[id].scene.opts, dusk = frames[id].scene.fx.includes('dusk');
    assert.deepEqual([o.weather, o.stone], ['clear', 'auto'], id);
    assert.equal(o.moon, dusk ? 5 : false, id + ': moon');
    // the nest is seen from the doorway, the nest and the inside cameras: her bark along it, the two about Sprinkle under the moss
    if (frames[id].scene.cam === 'outside') assert.deepEqual([o.bark, o.hidden], [undefined, undefined], id);
    else assert.deepEqual([o.bark, o.hidden], ['auto', true], id);
  });
  assert.deepEqual(den.filter(id => at(id) < at(NEST)).map(id => frames[id].scene.fx), den.filter(id => at(id) < at(NEST)).map(() => ['dusk']));
  den.filter(id => at(id) >= at(NEST)).forEach(id => assert.ok(frames[id].scene.fx.includes('night'), id));
  // Tallyheart waits at the den and is at the doorway for every dusk panel; nose to ear, she stands in the doorway itself
  den.filter(id => at(id) < at(NEST)).forEach(id => { assert.equal(castOf(id, 'tallyheart').length, 1, id); assert.equal(castOf(id, 'player')[0].at, 'entrance-left', id); });
  assert.equal(castOf(F(/^She touches her nose to your ear\./), 'tallyheart')[0].at, 'doorway');
  // bedtime: she is in her nest, facing left, and the grey tom is the sleeper beside her
  den.filter(id => at(id) >= at(NEST)).forEach(id => castOf(id, 'player').forEach(c => assert.deepEqual([c.at, c.facing], ['nest', 'left'], id)));
  den.filter(id => at(id) >= at(NEST)).forEach(id => assert.equal(castOf(id, 'tallyheart').length, 0, id));
  const bed = ids.find(id => frames[id].skip && frames[id].skip.paws === 'both');
  assert.deepEqual([camOf(bed), castOf(bed, 'player')[0].pose, frames[bed].say.map(b => [b.who, b.kind, b.text])], ['den/nest', 'loaf', [['player', 'whisper', 'Nine. Eighteen. Twenty-seven…']]]);
  // the end is warm: night, no moon, in her nest, the Sky River
  const end = frames[ids[ids.length - 1]];
  assert.ok(end.scene.fx.includes('night') && end.scene.fx.includes('skyriver'), 'a calm night with the Sky River');
  assert.deepEqual([end.scene.set, end.scene.opts.moon, end.scene.opts.stone, end.scene.opts.bark, end.scene.opts.hidden], ['den', false, 'auto', 'auto', true]);
  assert.ok(end.scene.cast.some(c => c.who === 'player' && c.at === 'nest'), 'she is in her nest');
  assert.match(end.caption.join(' '), /warm/);
  assert.match(end.caption.join(' '), /nine claws out and one tucked in/);
  assert.match(end.caption.join(' '), /Sky River/);
  assert.equal(end.caption[end.caption.length - 1], 'End of Chapter Five.');
});

test('the time of day runs morning (the pile, the Hollow), day (the tower, the river and the marsh, the way home in its late gold), sunset (the Old Bridge), dusk (the den), night (her nest)', () => {
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    const tods = p.map(id => {
      const s = frames[id].scene, t = s.fx.filter(e => TOD.includes(e));
      // (the roof too: chapter 4 went up in the afternoon's gold, the roof set's light when no fx names one;
      // today she climbs it in the morning, between the lesson and the Crossing, so it is `day` like the
      // tower below it and the Crossing after it, and no panel turns orange between two blue ones)
      assert.equal(t.length, 1, id + ': exactly one time of day in fx (' + s.fx.join(',') + ')');
      return TOD.indexOf(t[0]);
    });
    for (let i = 1; i < p.length; i++) assert.ok(tods[i] >= tods[i - 1], p[i] + ' goes back in time');
  }
  const tod = id => frames[id].scene.fx.find(e => TOD.includes(e));
  const BY_SET = { pile: ['morning'], hollow: ['morning'], tower: ['day'], roof: ['day'], crossing: ['day'], openriver: ['day'], marsh: ['day'], bridge: ['sunset'], den: ['dusk', 'night'] };
  ids.forEach(id => assert.ok(BY_SET[frames[id].scene.set].includes(tod(id)), id + ': ' + frames[id].scene.set + ' at ' + tod(id)));
  assert.equal(tod(story.start), 'morning', 'at sunrise');
  assert.match(T(story.start), /^At sunrise/);
  // “Before sunset,” says Patience: the eighteen fish are paid by day, and the river home is day in its late light
  assert.equal(tod(countsAt('ch05-bill')[0]), 'day');
  ids.filter(id => frames[id].scene.opts.late).forEach(id => assert.equal(tod(id), 'day', id));
  assert.equal(tod(BRIDGE), 'sunset');
  ids.filter(id => at(id) < at(BRIDGE)).forEach(id => assert.ok(!frames[id].scene.fx.some(e => ['sunset', 'dusk', 'night'].includes(e)), id));
  assert.equal(tod(DEN), 'dusk');
  assert.equal(tod(NEST), 'night');
  assert.ok(frames[ids[ids.length - 1]].scene.fx.includes('night'), 'it ends at night');
  // the Sky River is over the rosebush for the last two pictures of the sky, and nowhere before
  assert.deepEqual(ids.filter(id => frames[id].scene.fx.includes('skyriver')), [F(/^Over the rosebush, the Sky River shines, and you fall asleep\.$/), ids[ids.length - 1]]);
});

test('the storyboard is this chapter’s: every frame, the panels a read-through as a reader walks them, every frame shown only to some readers saying so', () => {
  const sb = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch05.md'), 'utf8');
  assert.match(sb, /^# Storyboard: Chapter 5, Riffle’s River\n/);
  assert.doesNotMatch(sb, /\bSTUB\b|undefined|NaN|\[object/);
  // a frame on the main line is headed "### f001 · panel 1"; a branch's frames "##### f022a", under their option
  ids.forEach(id => assert.ok(new RegExp('^(### ' + id + ' · panel \\d+|#####+ ' + id + ')\\b', 'm').test(sb), 'the storyboard has ' + id));
  assert.ok(sb.includes('| Frames | ' + ids.length + ' ('), 'every frame counted');
  // every frame's storyboard is in it, word for word
  ids.forEach(id => assert.ok(sb.includes('**Shot.** ' + frames[id].board), id + ': its board'));
  // a read-through, counted the way a reader walks it: frames that don't show to her are not hers
  const lens = COMBOS.flatMap(c => [0, 1].map(light => walk(c.flags, Object.assign({}, c.o, { light })).length));
  assert.ok(sb.includes('| One read-through | ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels'), 'a read-through is ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels');
  assert.ok(sb.includes('| Choices | ' + ids.filter(id => frames[id].choice).length + ' |') && sb.includes('| Case File cards | 9 (4 eyes, 5 ears) |'));
  assert.equal(ids.filter(id => frames[id].choice).length, 14);
  // every frame shown only to some readers says so, and where the page turns for everyone else
  assert.equal((sb.match(/^\*\*Shows only if\*\* /gm) || []).length, ids.filter(id => frames[id].when).length);
  // the things she taps that count nothing, and the two new places, in the storyboard's own words
  assert.match(sb, /\| Other things she taps \| the old tom’s nose \(f001\), the freshly dug earth \(f003\), the tuft of fur \(f\d+a\), Riffle’s seven questions \(f\d+\), the mud \(f\d+\), Riffle’s pole \(f\d+\), the tuft of fur \(f\d+\) \|/);
  assert.match(sb, /openriver 36 · marsh 53/);
  // the roof is chapter 4's, frame for frame: its boards are in both storyboards (but for the hour, on the two
  // that name it: chapter 4 went up in the afternoon's gold, today she climbs by day)
  const sb4 = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch04.md'), 'utf8');
  const then = b => b.replace('in the bright day', 'in the gold of the afternoon').replace('catch the sun', 'catch the afternoon sun');
  UP.forEach(id => assert.ok(sb4.includes('**Shot.** ' + then(frames[id].board)), id + ': chapter 4’s board, in chapter 4’s storyboard too'));
  assert.equal(UP.filter(id => then(frames[id].board) !== frames[id].board).length, 2);
  // …and today's roof is drawn, and said, by day
  assert.match(sb, /\*\*Scene\.\*\* Roof: the roof of the tallest tower, flat and wide, by day /);
  assert.doesNotMatch(sb, /Roof: the roof of the tallest tower, flat and wide, in the gold of the afternoon/);
  assert.match(sb4, /Roof: the roof of the tallest tower, flat and wide, in the gold of the afternoon/);
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(camOf));
  assert.ok(pairs.size >= 40, 'only ' + pairs.size + ' set/camera pairs');
  const sets = new Set(ids.map(id => frames[id].scene.set));
  // two new places (the open river under the Roar, and the marsh); the rest is chapters 1 to 4's
  assert.deepEqual([...sets].sort(), ['bridge', 'crossing', 'den', 'hollow', 'marsh', 'openriver', 'pile', 'roof', 'tower']);
  ['rows', 'gap', 'gap-close', 'wide', 'low'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'pile/' + cam), 'the pile’s ' + cam));
  ['wide', 'lesson', 'tree'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'hollow/' + cam), 'the Hollow’s ' + cam));
  ['wide', 'rocks', 'raft', 'board'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'crossing/' + cam), 'the Crossing’s ' + cam));
  // every camera the two new sets have, but the open river's view from underneath (the raft's bumps are Puddle's Counts picture)
  A.vocab.sets.openriver.cams.filter(cam => cam !== 'under').forEach(cam => assert.ok(ids.some(id => camOf(id) === 'openriver/' + cam), 'the open river’s ' + cam));
  A.vocab.sets.marsh.cams.forEach(cam => assert.ok(ids.some(id => camOf(id) === 'marsh/' + cam), 'the marsh’s ' + cam));
  ['bank', 'back', 'under'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'bridge/' + cam), 'the bridge’s ' + cam));
  ['outside', 'doorway', 'nest', 'inside'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'den/' + cam), 'the den’s ' + cam));
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
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', foundSquall: true, ch5Roof: true, foundPuddle: true, foundWisp: true } });
  Object.keys(ch04.cards).forEach((cid, i) => E.giveCard(cat, cid, 'ch04', i + 1));
  CARD_IDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch05', 20 + i));
  // (the swimmers out in the marsh are small on purpose, and Puddle's snout is two nostrils)
  const SMALL = id => frames[id].scene.set === 'marsh';
  ids.forEach(id => looks.forEach((look, k) => {
    const f = frames[id], sc = E.resolveScene(f.scene, cat, STORIES), cast = sc.cast;
    const r = A.render(sc, { look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(r.svg), id + ': no svg');
    assert.ok(Array.isArray(r.heads) && r.heads.length === cast.length, id + ': heads');
    (f.say || []).forEach(b => {
      if (!cast.some(c => c.who === b.who)) return;   // heard, not seen (the test above)
      assert.ok(cast.some((c, i) => c.who === b.who && r.heads[i]), id + ': speaker ' + b.who + ' has no head on the panel');
    });
    if (k === 0) cast.forEach((c, i) => {
      const h = r.heads[i];
      if (!h) off.push(id + ' ' + c.who + '@' + JSON.stringify(c.at) + ' (' + sc.set + '/' + sc.cam + ')');
      else {
        if ((BEASTS.includes(c.who) || CATS.includes(c.who)) && !(SMALL(id) && ['riffle', 'puddle', 'clancat'].includes(c.who))) assert.ok(h.r >= 0.5, id + ': ' + c.who + ' face radius ' + h.r);
        assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, id + ': ' + c.who + ' head in the panel');
      }
    });
    // two speakers in one panel never share a face: their heads are apart
    if (k === 0) {
      const sp = [...new Set((f.say || []).map(b => b.who))].map(w => cast.findIndex(c => c.who === w)).filter(i => i >= 0 && r.heads[i]);
      for (let i = 0; i < sp.length; i++) for (let j = i + 1; j < sp.length; j++) {
        const a = r.heads[sp[i]], b = r.heads[sp[j]];
        assert.ok(Math.hypot(a.x - b.x, (a.y - b.y) * 0.625) > (a.r + b.r) * 0.9, id + ': ' + cast[sp[i]].who + ' and ' + cast[sp[j]].who + ' speak from two faces');
      }
    }
  }));
  assert.deepEqual(off, [], 'cast members out of the camera’s sight');
  // every one-tap frame has its target in the picture, where the page looks for it (class pc-tap; the
  // marsh names its two, since one picture holds both the mud and the pole)
  const TARGET = { nose: /class="pc-tap pc-tap-nose"/, earth: /class="pc-tap"[^>]*data-art="dug-tap"|data-art="dug-tap"[^>]*class="pc-tap"/, fur: /class="pc-tap"[^>]*data-art="tuft"|data-art="tuft"[^>]*class="pc-tap"/, mud: /data-tap="mud"/, pole: /data-tap="pole"/ };
  const taps = ids.filter(id => frames[id].scratch);
  assert.deepEqual(taps.map(id => frames[id].scratch.tap), ['nose', 'earth', 'fur', 'mud', 'pole', 'fur']);
  taps.forEach(id => {
    const svg = A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg, tap = frames[id].scratch.tap;
    assert.match(svg, TARGET[tap], id + ': the ' + tap + ' to tap is in the picture');
    assert.match(svg, /pc-tap/, id);
    // and it is the one the page picks for this frame's tap (PC.ui.taps.pick over the picture's marks)
    const marks = (svg.match(/<[^>]*(?:class="[^"]*pc-tap[^"]*"|data-tap="[^"]*"|data-art="glint")[^>]*>/g) || []).map(el => ({ tap: (/data-tap="([^"]*)"/.exec(el) || [])[1] || null, art: (/data-art="([^"]*)"/.exec(el) || [])[1] || null, cls: (/class="([^"]*)"/.exec(el) || [])[1] || null }));
    const picked = PC.ui.taps.pick(marks, tap);
    assert.ok(picked >= 0, id + ': the page finds a mark for ' + tap);
    if (tap === 'mud' || tap === 'pole') assert.equal(marks[picked].tap, tap, id);
  });
  // the picture after the nose Tap: the snail's horns are in (a different drawing from the one before)
  assert.notEqual(A.render(frames[taps[0]].scene, { look: looks[0] }).svg, A.render(frames[frames[taps[0]].scratch.next].scene, { look: looks[0] }).svg);
  // the page of questions: Riffle glows (the one to tap), and the cloud gains a pair of fish at every tap
  const ask = ids.find(id => frames[id].ask), clouds = [];
  for (let n = 0; n <= 7; n++) {
    const sc = E.askScene(frames[ask].scene, frames[ask].ask, n), svg = A.render(sc, { look: looks[0] }).svg;
    assert.ok(svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg));
    assert.equal(sc.opts.owed, n);
    clouds.push(svg);
  }
  assert.equal(new Set(clouds).size, 8, 'eight different pictures: none owed, then one pair more each time');
  assert.match(clouds[0], /pc-next/, 'Riffle glows softly');
  // the claws in the log: the frame's scene drawn again at every tap, the airplane growing
  const pics = [];
  for (let n = 0; n <= 9; n++) { const s = E.skipScene(frames[LOG].scene, frames[LOG].skip, n, ''); pics.push(A.render(s.scene, { look: looks[0] }).svg); }
  assert.equal(new Set(pics).size, 10, 'a claw more dug in at every tap');
  // the Counts pictures the chapter asks for all draw: every question of every set, the steps a
  // question's picture plays as it is asked, the help hop by hop, the answers in the sand
  const lookP = looks[0];
  Object.keys(story.counts).forEach(sid => {
    const def = Object.assign({ id: sid }, story.counts[sid]);
    const st = E.counts.start(def, { set: sid });
    while (!E.counts.done(st)) {
      const q = E.counts.question(st), D = E.questionDef(def, q, story, STORIES);
      pics.push(A.countsPicture(Object.assign({ look: lookP }, E.lessonPicture(D, q, q.lit || 0))));
      E.lightSteps(D, q).forEach(s => pics.push(A.countsPicture(Object.assign({ look: lookP }, s.picture))));
      // one miss of each of the set's own facts: its help is counted out hop by hop
      const r = E.counts.answer(st, D, q.retry || q.filler ? q.answer : q.answer + 1, 2000, 1);
      if (!r.correct) {
        const plan = E.helpPlan(def, D, q, r);
        if (plan.picture) E.helpSteps(plan).forEach(s => pics.push(A.countsPicture(Object.assign({ look: lookP }, E.lessonPicture(D, q, s.counted)))));
        else { pics.push(A.sand(E.sandOpts(plan, 0))); E.helpSteps(plan).forEach(s => pics.push(A.sand(E.sandOpts(plan, s.counted, s.rubbed)))); }
      }
      if (r.shows) pics.push(A.sand(E.answersOpts(D, r.shows)));
    }
  });
  ids.filter(id => frames[id].skip && !E.skipOnScene(frames[id].skip)).forEach(id => {
    const sk = E.skipFor(frames[id].skip, cat);
    for (let n = 0; n <= sk.groups; n++) pics.push(A.countsPicture(Object.assign({ look: lookP }, E.skipPicture(sk, n))));
  });
  pics.push(A.countsPicture(Object.assign({ look: lookP }, E.keptPicture(frames[ids.find(id => frames[id].skip && frames[id].skip.keep)].skip))));
  CARD_IDS.forEach(cid => { pics.push(A.card({ picture: cid, mark: story.cards[cid].mark })); pics.push(A.card({ picture: cid, mark: story.cards[cid].mark, big: true })); });
  pics.push(A.card({ blank: true }), A.fileIcon());
  pics.forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
  assert.ok(pics.length > 250, pics.length + ' pictures');
  // her nest at bedtime: today's bark is along it (`bark: 'auto'` is her own cards, as her file shows them)
  const nest = E.resolveScene(frames[NEST].scene, cat, STORIES).opts.bark;
  assert.ok(Array.isArray(nest) && nest.length >= 9, 'her cards along her nest: ' + JSON.stringify(nest).slice(0, 80));
});

/* ------------------------------------------------------------------ the beats the chapter must have */

test('the chapter’s beats are all there, in order, on every path: every reader’s panels are exactly her day’s, one after another, and nothing else', () => {
  // A beat is one panel: [label, what it says (every variant, in order), what else must be true of it].
  const B = (label, re, also) => [label, id => re.test(T(id)) && (!also || !!also(frames[id], id))];
  const set = s => f => f.counts && f.counts.set === s;
  const PILE = [
    B('the old tom, guarding with his eyes shut (the nose Tap)', /^At sunrise, the old tom sits by the prey pile, as straight as a post\. He’s guarding\. He’s guarding with his eyes shut\. A snail is halfway up his ear\. SNNNRRRK\.$/, f => f.scratch && f.scratch.tap === 'nose'),
    B('WHO GOES THERE? You have a snail. (the pile’s count)', /^He blinks\. WHO GOES THERE\? Oh\. The counting cat\. I was resting my eyes\. All night\? They were VERY tired\. You have a snail\.$/, set('ch05-pile'))
  ];
  // (the gap is two frames, one for a noticing cat, with her Tap, and one for everyone else; so are the marsh's prints, for a climber)
  const GAP_TAP = [B('four empty spaces. Again. (a noticing cat: the dug-earth Tap)', /^Then the back row\. Right in the middle: four empty spaces\. Again\. You didn’t count that\. You just saw it\.$/, f => f.scratch && f.scratch.tap === 'earth')];
  const GAP = [B('four empty spaces. Again.', /^Then the back row\. Right in the middle: four empty spaces\. Again\. You didn’t count that\. You just saw it\.$/, f => !f.scratch)];
  const PRINTS = [B('tiny prints, half the size of yours (a noticing cat)', /^Tiny prints\. Each is half the size of yours\.$/, f => f.card === 'prints-pile')];
  const PILE2 = [
    B('The BACK row? AGAIN?', /^The old tom stomps around the pile to look\. The BACK row\? AGAIN\?$/),
    B('why is it always the back?', /Why is it always the back\?$/, f => f.say[0].who === 'tallyheart'),
    B('sixteen in four nights; that dragon is getting FAT', /^Four more\. Sixteen pieces in four nights\. That dragon is getting FAT\.$/, f => f.say[0].who === 'glintstar' && f.say[1].who === 'snorter'),
    B('a dragon who hasn’t taken one mouse', /^Tallyheart’s whiskers twitch\. You both know a dragon who hasn’t taken one mouse\. You know a dragon who hasn’t taken one mouse\. You don’t say a word\.$/),
    B('proper guards; a pinecone', /^Tallyheart\. By tomorrow night, I want proper guards\. Tonight, I’m sitting on a pinecone\.$/)
  ];
  const HOLLOW = [
    B('tens first (the warm-up)', /^In the Training Hollow, five cats sit up on the rim, claws out\. Tens first, to wake up your whiskers\.$/, set('ch05-tens')),
    B('hold on to that fifty', /^Hold on to that fifty\. Today’s Count is the nines\.$/),
    B('ten front claws; nine lives; I swear by it', /^Tallyheart holds out both forepaws\. Ten front claws\. And every cat has nine lives\. The elders swear by it\. I’m an elder\. I swear by it\. Shhnk! Shhnk!$/),
    B('nine claws out, one tucked in', /^Tallyheart curls one claw back in\. The elders count their lives on their claws\. Nine claws out\. One tucked in\.$/),
    B('hanging on to the other nine', /^What’s the tucked one for\? Hanging on to the other nine\.$/, f => f.say[0].who === 'player' && f.say[1].who === 'grizzled'),
    B('one less than a ten (the tuck Tap)', /^So a nine is one less than a ten\. One claw tucked in\. Touch each cat, and tuck one in\.$/, f => f.skip && f.skip.tuck),
    B('FORTY-FIVE! (the nines)', /^FORTY-FIVE! Five cats, nine lives each\. Five tens make fifty\. Tuck five in: forty-five\. Five times nine makes forty-five\.$/, set('ch05-nines')),
    B('a fifth claw mark', /^Tallyheart stretches up the leaning tree\. A fifth claw mark\. SKRITCH!$/),
    B('your fifth Count; it’s only tens', /^Nine lives\. That’s your fifth Count\. And the trickiest one so far\. It’s only tens\. With a claw tucked in\. It’s tens\. With a claw tucked in\. That’s all a nine is\.$/),
    B('go and ask your river', /^Now go and ask your river\. And stay on the otters’ raft\. The marsh mud belongs to ReedClan\.$/)
  ];
  const OFFER = [B('the roar from the tallest tower (the roof, offered again)', /^From the tallest tower: Sprinkle’s littlest brother is still up there\. Balcony, balcony, balcony, roof\. You could still climb that\. RAWWWRRR… hic!$/, (f, id) => id === TOWER)];
  const CLIMB = [B('up the outside (a climber)', /^It’s only a very tall curtain, really\. Up you go, balcony to balcony\. The OUTSIDE\? \{THEY\}’S DOING IT!$/)];
  const RIDE = [B('the little room', /^Take the little room, darling! The one that goes DING!$/), B('the elevator', /^The elevator! You jump, and whack the top button\.$/)];
  const ROOF = [
    B('a dragon no bigger than you', /^On the wide, flat roof, a dragon no bigger than you hugs the pole of the red light\. He’s slate grey, with yellow flecks like sparks\.$/),
    B('AND STAY OUT, giant dragon!', /^An airplane sweeps over\. AND STAY OUT, giant dragon! ROOOOOAAAAARRRRR!$/),
    B('RAWWWRRR… hic!', /^RAWWWRRR… hic!$/, f => f.scene.set === 'roof'),
    B('HALT! PROVE it! (Squall’s riddle)', /^HALT! Friend, or NOT friend\? Friend! Sprinkle sent me\. PROVE it!$/, set('ch04-riddle')),
    B('and NOBODY’S MISSING!', /^And NOBODY’S MISSING!$/),
    B('except everybody', /^Then his chin wobbles\. Except everybody\.$/),
    B('I’m Squall; I noticed', /^Not Sprinkle\. She’s safe, under the Old Bridge\. She IS\? …I’m Squall\. I’m the littlest\. And the LOUDEST\. I noticed\. I notice things TOO\.$/),
    B('two skinny shapes', /^He points down, past your camp\. Every night, two skinny shapes go sneaking along down THERE, carrying something\. To the long shiny lines\.$/),
    B('the train tracks!', /^The train tracks!$/, f => f.card === 'squall-shapes'),
    B('GUARDING', /^Come down with me\? Can’t\. I’m GUARDING\. And my light brings me moths\. CRUNCHY ones\.$/),
    B('tell Sprinkle: five (Squall’s forepaw)', /^Tell Sprinkle: five\. She’ll know\.$/, f => f.skip && same(f.sets, { foundSquall: true, ch5Roof: true }))
  ];
  const AGAIN = [B('AGAIN?', /^AGAIN, \{petname\}\?$/, f => f.say[0].who === 'waffles')];
  const CROSS1 = [B('My RAFT! MY raft.', /^At the Crossing, Riffle stands on the ferry raft, hugging a pole twice his size\. My RAFT! MY raft\. You hold the pole\.$/)];
  const NEWS_ROOF = [
    B('I found Squall!', /^I found Squall! Sprinkle’s littlest brother! He sees two skinny shapes go to the tracks\. Every night\.$/, f => f.say.every(b => b.who === 'player' && b.kind === 'whisper')),
    B('Raft first.', /^Riffle hugs his pole\. The TRACKS\? At NIGHT\? Raft first\.$/)
  ];
  const CROSS2 = [
    B('the rules: the Roar, the courage test', /^Every apprentice sits on my raft while a skymonster goes over\. That’s the Roar\. It’s the courage test\. Three rules: sit\. Stay\. No jumping in\.$/, f => f.choice),
    B('eleven times. TEN!', /^Then you sit through it again tomorrow\. Like Riffle\. Eleven times\. TEN!$/),
    B('a mentor never misses a first Roar', /^And on the rocks sits Tallyheart\. A mentor never misses a first Roar\.$/),
    B('one paw at a time (the paws Tap)', /^The raft sits low\. And the water under it is wide, and deep\. Your paws won’t move\. Your first paw goes in the river, to say hello\. One paw at a time\. I’ll count\.$/, f => f.skip && f.skip.paws === 'board'),
    B('four paws aboard', /^That’s what she promised, on your very first night\. Four paws aboard\. All there\.$/)
  ];
  const TRUER = [B('something truer than a fox’s story (told)', /^She leans close\. Find me something truer than a fox’s story\. For her\.$/, f => f.say[0].kind === 'whisper')];
  const HONOR = [B('otter’s honor (the water worry)', /^It isn’t one bit like a dripping tap\. And if you fall in, I’ll have you out before your tail gets wet\. Otter’s honor\.$/)];
  const ROAR1 = [
    B('the whole river shines', /^Riffle pushes off, and the whole river shines\. The glass towers stand on their heads in the water\.$/),
    B('SKYMONSTER! Airplane.', /^Far down the river, a light\. It grows\. And grows\. SKYMONSTER! Airplane\.$/),
    B('Sit STILL!', /^It comes out very small\. Sit STILL!$/),
    B('nine claws in the log (the claws Tap)', /^Riffle plops down beside you, shoulder to shoulder\. I’m not allowed to hold your paw\. But I’m right here\. Nine claws in the log, \{name\}paw! One tucked for luck!$/, f => f.skip && f.skip.paws === 'log'),
    B('it sweeps right over you', /^It sweeps right over you\. The logs buzz\. Your teeth buzz\. Even your whiskers buzz\. You’re the smallest thing on the whole wide river\. You sit still anyway\. ROOOOOAAAAARRRRR!$/, f => f.choice)
  ];
  const SHUT = [B('Ten. Twenty. Thirty. FORTY—', /^Ten\. Twenty\. Thirty\. FORTY—$/)];
  const WINDOWS = [B('a small face at the glass', /^Little round windows, all in a row\. At one, a small face is pressed to the glass\. You know that feeling\.$/)];
  const ROAR2 = [
    B('not one of nine claws. Then it’s gone.', /^You’ve held still for socks\. You can hold still for this\. You don’t move\. Not an ear\. Not one of nine claws\. Then it’s gone\.$/),
    B('YOU DID IT! Slap! Slap! Slap!', /^Riffle turns a somersault\. On the rocks, otter tails go YOU DID IT! Slap! Slap! Slap!$/),
    B('Not one claw! I counted!', /^Not one claw! I counted!$/, f => f.say[0].who === 'tallyheart'),
    B('she turns for home', /^She turns for home\. The old otter nods at you, once\. You know a friend’s nod when you see one\. You look down\. Still deep\. You look at your paws\. Still here\.$/),
    B('the raft is still shivering', /^The river goes quiet\. But the raft is still shivering\. And still sitting too low\.$/),
    B('he’s whistling (the raft’s choice)', /^It isn’t you\. It isn’t Riffle\. He’s whistling, and looking very hard at the sky\.$/, (f, id) => id === RAFT)
  ];
  const UNDER = [
    B('a foot pokes up', /^You lean over the edge\. The deep water is right under your nose\. You look anyway\. Between two logs, a foot pokes up: blue-grey, and much too big\. It wiggles\.$/),
    B('I’m a log. This one’s got four.', /^Up pops a head\. I’m not here\. I’m a log\. Logs don’t have feet\. This one’s got four\. SPLOOSH!$/),
    B('SPRINKLE?', /^Sprinkle sent me\. SPRINKLE\?$/),
    B('strangers get a riddle (Puddle’s riddle)', /^He sinks, blub, and pops up again\. Mama’s rule: strangers get a riddle!$/, set('ch05-puddle')),
    B('I’m Puddle', /^I’m Puddle\. The otters said: be a log\. Till everybody stops shouting DRAGON\. Logs get LOTS of fish\. Granny only told me LAST NIGHT\. I nearly popped!$/),
    B('clever little paws', /^The storm rolled me right over a garden first\. FLASH! A heap of mice\. And something with clever little paws, picking them up\. Very tidy\.$/),
    B('Our PILE!', /^Our PILE! I said EEK\. Then the river said SPLOOSH\.$/, f => f.card === 'puddle-paws'),
    B('tell Sprinkle: five (Puddle’s forepaw)', /^He holds up a forepaw, and starts to sink\. Mama says: stay where you land\. So tell Sprinkle: five!$/, f => f.skip && same(f.sets, { foundPuddle: true }))
  ];
  const LOOKUP = [B('only blue sky; ticklish logs', /^Only blue sky\. Rafts shiver\. Ticklish logs\. VERY ticklish\.$/)];
  const WHO = [B('so who’s first?', /^So who’s first\? Otters HEAR everything\. Patience the heron SEES everything\.$/, (f, id) => id === WITNESS)];
  const OTTERS_A = [B('a dragon as big as a bridge!', /^(Riffle pushes the raft back to the rocks|At last, the Crossing again)\. What did you hear about the storm night\? A dragon as big as a bridge!$/, f => f.choice)];
  const DUCK = [B('a very honest duck', /^A duck\. A very honest duck\.$/)], NO_DUCK = [B('well… no', /^Well… no\. A duck told me\.$/)];
  const OTTERS_B = [B('the FOX told me himself. Twice.', /^No bark for ducks\. The FOX told me himself\. Twice\. The dragon’s claws were full of mice\. And off it flew\.$/, f => f.card === 'otter-fox')];
  const FLEW = [B('Flew. Again. (a cat who caught it)', /^Flew\. Again\. You know a dragon who can’t\.$/)];
  const OTTERS_C = [
    B('a tuft of thin brown fur', /^He lifts the raft’s vine\. Caught in it: a tuft of thin brown fur\. And somebody’s been on my rocks in the dark\.$/),
    B('dragons don’t HAVE fur', /^Whose is it\? Not a dragon’s\. Dragons don’t HAVE fur\.$/),
    B('…Probably. (the fur Tap)', /^He coughs\. …Probably\.$/, f => f.scratch && f.scratch.tap === 'fur'),
    B('somebody small (her nose at the fur)', /^Somebody small\.( Tiny prints there\. Thin fur here\. The same somebody\?)?$/, f => f.card === 'fur')
  ];
  const MARSH1 = [
    B('a wide, still marsh', /^The river slides into a wide, still marsh\. In here, even the water whispers\.$/),
    B('ReedClan, in threes', /^Far across it, three cats sit on a log\. They don’t wave\. ReedClan\. They always come in threes\.$/),
    B('a tall grey-blue bird', /^In the shallows stands a tall grey-blue bird, on one leg\. A dragonfly is asleep on her beak\.$/),
    B('that’s Patience', /^That’s Patience\. Two fish for every answer\. Before the storm, it was ONE\. Nobody knows why\.$/),
    B('bursting with questions (the seven)', /^Riffle is bursting with questions\.$/, f => f.ask),
    B('seven answers (Riffle’s fish)', /^Seven answers\. Two fish for every answer\.$/, set('ch05-otter')),
    B('hello is free', /^I was only saying HELLO! You did not say hello\. Hello is free\. Hello, Patience\.$/)
  ];
  const FEATHER = [B('one grey feather (a cat who makes friends)', /^One grey feather lifts\. For Patience, that’s a grin\.$/)];
  const MARSH2 = [
    B('was the moon out?', /^The fox said the moon came out\. So you check\. Was the moon out on the storm night\?$/),
    B('No.', /^One eye shuts\. No\. The fish come up for the moon\. That night, I went hungry\.$/, f => f.card === 'heron-no-moon'),
    B('one more question', /^You have a hundred questions\. At two fish each, you pick one more\.$/, f => f.choice)
  ];
  const GUESS = [B('I do not guess', /^I do not guess\. Guessing is for otters\. That one is free\.$/), B('so you ask what she SAW', /^So you ask what she SAW on the storm night\.$/)];
  const GOOD = [B('a good question', /^One yellow eye turns to you\. A good question\.$/)];
  const MARSH3 = [B('two small shapes', /^When the rain stopped: two small shapes, crossing my mud\. Each one carrying something\. I do not guess what\.$/, f => f.card === 'heron-shapes')];
  const SAW = [B('just what Squall saw! (a cat who has met him)', /^Just what Squall saw! He saw them\. She saw them\. Same two shapes!$/)];
  const MARSH4 = [
    B('a complaint (the mud Tap)', /^They come back every night\. They do not wipe their feet\. That is not an answer\. It is a complaint\.$/, f => f.scratch && f.scratch.tap === 'mud')
  ];
  const PRINTS_TAP = [B('tiny prints, half the size of yours (a climber: the pole Tap)', /^Tiny prints, in a line across the mud\. You hold your paw over one\. It’s half the size of yours\.$/, f => f.card === 'prints-marsh' && f.scratch && f.scratch.tap === 'pole')];
  const PRINTS_MARSH = [B('tiny prints, half the size of yours', /^Tiny prints, in a line across the mud\. You hold your paw over one\. It’s half the size of yours\.$/, f => f.card === 'prints-marsh' && !f.scratch)];
  const TRACKS = [B('toward the train tracks (a climber)', /^From the top, you see where the prints go: off toward the train tracks\.$/, f => f.card === 'prints-tracks')];
  const SAME = [B('the same prints; the same somebody?', /^The same tiny prints as behind the pile! Thin fur there\. Tiny prints here\. The same somebody\?$/)];
  const MARSH5 = [
    B('seven for the otter, two for the cat (the bill)', /^Seven answers for the otter\. Two for the cat\.$/, set('ch05-bill')),
    B('nine twos, or two nines', /^Nine twos\. Or two nines\. Same eighteen!$/, f => f.say[0].who === 'player'),
    B('back in eighteen fish!', /^He’s already diving\. Back in eighteen fish! SPLOOSH!$/),
    B('his pole stands in the mud (the first wait)', /^His pole stands in the mud, holding the raft still\. Beside the mud, you can see the bottom\. You look at it a lot\.$/, (f, id) => id === WAITS[0])
  ];
  const LOUD = [
    [B('ONE! TWO!', /^ONE! TWO!$/), B('every frog jumps in; one reed flinches', /^Every frog jumps in\. Patience shuts both eyes\. One reed flinches\.$/)],
    [B('THREE!', /^THREE!$/), B('the dragonfly leaves', /^The dragonfly leaves\. So do the frogs\.$/)],
    [B('FIVE!', /^FIVE!$/), B('every reed looks the same', /^When you look back, every reed looks the same\.$/)]
  ];
  const STILL = [
    [B('nothing happens', /^Nothing happens\. Now and then, a wet head pops up with a fish\.$/), B('the dragonfly lands on your nose (the second wait)', /^Then the dragonfly leaves Patience’s beak, and lands on your nose\. You sat still through the Roar\. You can sit still for a dragonfly\. Sock-hunting, all over again\.$/, (f, id) => id === WAITS[1])],
    [B('reeds don’t have knees (the third wait)', /^Still nothing\. But one reed is paler than the others\. And reeds don’t have knees\.$/, (f, id) => id === WAITS[2])]
  ];
  const PALE1 = [
    B('the pale reed blinks', /^The pale reed blinks\.$/),
    B('a dragonet, pale as mist', /^It isn’t a reed\. It’s a dragonet, pale as mist, standing on one leg\.$/),
    B('she believes she is a heron', /^She lays one claw across her snout\. She believes she is a heron\. I have not corrected her\. Sprinkle sent me\.$/),
    B('one pale claw draws (Wisp’s riddle)', /^Then, slowly, one pale claw draws in the mud\.$/, set('ch05-wisp')),
    B('her name: Wisp', /^She fell into my reeds in the storm\. She told me her name: Wisp\. Not a word since\. She stands well\.$/)
  ];
  const SNOUT = [B('WISP?', /^A blue-grey snout pokes up between the logs\. WISP\?$/), B('I’m a LOG.', /^Wisp lays one claw across her snout\. I’m a LOG\.$/)];
  const PALE2 = [
    B('one for me, one for her', /^Two fish for every answer\. One for me\. One for her\.$/),
    B('so THAT’s why it’s two', /^So THAT’s why it’s two\. Have you seen anything strange, Wisp\?$/),
    B('a fox, dropping something', /^She draws again\. A fox\. Something small falling from its mouth, with shine lines\. A ring of ripples\.$/, f => f.card === 'wisp-fox'),
    B('her forepaw', /^Where it fell, there’s only deep green water now\. Then Wisp holds up one forepaw\. You can nearly see the reeds through it\.$/, f => f.skip && same(f.sets, { foundWisp: true }))
  ];
  const FISH1 = [B('four strings of fish', /^Riffle heaves four strings of fish onto the raft, puffing\. They flash like silver\. You try very hard not to stare\. SPLOOSH!$/)];
  const HOOK = [B('a wet paw (a swimmer who doesn’t mind)', /^You hook the last string aboard\. A wet paw! You don’t mind one bit\.$/)];
  const FISH2 = [
    B('what did I miss? (Riffle’s catch)', /^What did I miss\? A reed with knees\. Frogs\.$/, set('ch05-catch'))
  ];
  // (the gulp is two frames, one for a cat who found Wisp, with her in the picture, and one for everyone else)
  const GULP_ALL = [B('down go the fish', /^Down go the fish\. Gulp\. Gulp\. Gulp\.$/, f => !f.scene.cast.some(c => c.who === 'wisp'))];
  const GULP_HER = [B('down go the fish: one for Patience, one for Wisp (a cat who found her)', /^Down go the fish\. One for Patience\. One for Wisp\. Gulp\. Gulp\. Gulp\.$/, f => f.scene.cast.some(c => c.who === 'wisp' && c.pose === 'gulp'))];
  const FISH3 = [
    B('I am full', /^I am full\. You dive well, otter\.$/),
    B('the one who never shuts his eyes', /^One yellow eye turns to you\. One more answer\. Free\. Ask the one who never shuts his eyes\.$/),
    B('she means COIL', /^Riffle groans\. Snakes don’t have eyelids\. She means COIL\. That nosy old thing trades secrets like pebbles\.$/)
  ];
  const SLIPB = [B('Pud— PUDDLES (the slip)', /^Riffle pushes off for home\. Heavy today\. It’s because of Pud— PUDDLES\. Raft puddles\. Not a name\.$/, (f, id) => id === SLIP)];
  const POINT = [B('I’m only POINTING', /^I promised Granny I wouldn’t TELL\. I’m only POINTING\.$/)];
  const BLUB = [B('blub…', /^blub…$/)];
  const FINE = [B('best friend an otter ever had', /^Best friend an otter ever had\.$/), B('something goes blub', /^Under the logs, something goes blub\.$/)];
  const HOME1 = [B('worth it (she purrs at him the whole way)', /^At the rocks, Riffle ties up the raft, and swims beside you up the river\. You purr at him the whole way\. Worth it\.$/)];
  const EYES_TOLD = [B('two big eyes, over Tallyheart’s branch (told)', /^Under the Old Bridge, two big eyes shine\. They peek over Tallyheart’s branch\.$/)];
  const EYES_KEPT = [B('no ginger ears (kept)', /^At the Old Bridge, you check the bank first\. No ginger ears\. Under the bridge, two big eyes shine\.$/)];
  const HOME2 = [B('tell me EVERYTHING', /^Tell me EVERYTHING\.$/, f => f.say[0].who === 'sprinkle')];
  const NOBODY = [B('anyone new', /^I didn’t find anyone new today\. You will\. You found me\. You will\. You found me\. And Squall\. My pale sister is the best at hiding\. You have to wait till she blinks\.$/)];
  const BROTHER = [B('your littlest brother says: five', /^I found your littlest brother\. He says: five\.$/, f => f.say.length === 1 && f.say[0].who === 'player')];
  const PUDDLE_NEWS = [B('then he sank. He does that.', /^Puddle is under the otters’ raft\. He says: five\. Then he sank\. He does that\.$/, f => f.say.map(b => b.who).join() === 'player,sprinkle')];
  const SISTER = [B('she held up five', /^Wisp is in the reeds, being a heron\. She held up five\.$/)];
  const COUNT = [
    B('Mine. (the mud count)', /^Sprinkle has drawn her six little forepaws in the mud again\. Now she draws one more\. Mine\.$/, (f, id) => id === MUD),
    B('Mama’s count is coming back', /^Mama’s count is coming back\. But my pale sister is the best at hiding\. You have to wait till she blinks\.$/)
  ];
  const HOME3 = [
    B('somebody small crosses the marsh', /^Somebody small crosses the marsh every night\. With prints half the size of mine\.$/),
    B('then they’re VERY small', /^Sprinkle looks down at her own enormous feet\. Then they’re VERY small\.$/)
  ];
  const DEN1 = [
    B('every warrior has sat where you sat', /^At the den, Tallyheart is waiting\. Every warrior in this Clan has sat where you sat today\. Glintstar\. \{Murmur\}chime\. Me\.$/, f => f.choice),
    B('I counted. Very loudly.', /^I counted\. Very loudly\.$/),
    B('now you’ve sat there too', /^She touches her nose to your ear\. And now you’ve sat there too\.$/)
  ];
  const DEEP = [B('still deep (the water worry)', /^And the deep water\? Still deep\. I looked right at it\.$/)];
  const DEN2 = [
    B('the telling', /^You tell her about the duck, the fur, the prints, and the two small shapes\. And the same tiny prints were behind OUR pile\. Till a tail swept them\. A thing to check\. And the prints run off toward the train tracks\. A thing to check\.$/),
    B('two stories, one sky', /^And the fox says moon\. The heron says no moon\. Two stories\. One sky\. So who’s wrong\?$/, f => f.choice)
  ];
  const NOT_YET = [B('not yet', /^Maybe\. But a counting cat says: not yet\.$/)], HARDEST = [B('the hardest thing to say', /^Good\. That’s the hardest thing to say\.$/)];
  const DEN3 = [B('find me somebody else who was awake', /^One hole in his story for certain\. Maybe two\. Then find me somebody else who was awake when the rain stopped\.$/)];
  const WAFFLES = [B('Waffles was up ALL night (a noticing cat)', /^Waffles was up ALL night\. With her nerves\.$/)];
  const REST = [B('the rest, whispered or kept', /^Then you whisper the rest\. You don’t tell her the rest\. Your secret is getting bigger\. That is a LOT of dragon\. And a lot to check\. Together\.$/)];
  const BED = [
    B('skritch, skritch', /^In your nest: skritch, skritch\. Today’s bark goes along the mossy edge\. Riffle’s stone is by your nose\. Riffle’s stone is under your chin\.$/),
    B('Ow. SNNNRRRK.', /^From the prey pile comes a small “Ow\.” Then, a little later: SNNNRRRK\.$/),
    B('do the paw thing', /^\{name\}paw\? Did you really sit through the Roar\? Not one claw moved\. …Do the paw thing\.$/),
    B('nine, eighteen, twenty-seven (the bedtime nines)', /^Nine\. Eighteen\. Twenty-seven…$/, f => f.skip && f.skip.paws === 'both' && f.skip.table === 9),
    B('a NEW paw thing', /^That’s a NEW paw thing\.$/),
    B('by forty-five, he’s snoring too', /^By forty-five, he’s snoring too\. …hic! Sprinkle’s littlest brother is still up there\.$/),
    B('tomorrow: Coil', /^Tomorrow: Coil\. What does a nosy old snake want for a secret\? You hope it isn’t fish\.$/),
    B('the Sky River', /^Over the rosebush, the Sky River shines, and you fall asleep\.$/, f => f.scene.fx.includes('skyriver')),
    B('the dream', /^What did \{name\}paw dream about, the night \{they\} sat through the Roar\?$/, f => f.input && f.input.kind === 'dream'),
    B('the end', /End of Chapter Five\.$/, f => f.end)
  ];
  const ALL = [PILE, GAP_TAP, GAP, PRINTS, PILE2, HOLLOW, OFFER, CLIMB, RIDE, ROOF, AGAIN, CROSS1, NEWS_ROOF, CROSS2, TRUER, HONOR, ROAR1, SHUT, WINDOWS, ROAR2, UNDER, LOOKUP, WHO, OTTERS_A, DUCK, NO_DUCK, OTTERS_B, FLEW, OTTERS_C,
    MARSH1, FEATHER, MARSH2, GUESS, GOOD, MARSH3, SAW, MARSH4, PRINTS_TAP, PRINTS_MARSH, TRACKS, SAME, MARSH5].concat(LOUD, STILL, [PALE1, SNOUT, PALE2, FISH1, HOOK, FISH2, GULP_ALL, GULP_HER, FISH3, SLIPB, POINT, BLUB, FINE, HOME1, EYES_TOLD, EYES_KEPT, HOME2, NOBODY, BROTHER, PUDDLE_NEWS, SISTER, COUNT,
      HOME3, DEN1, DEEP, DEN2, NOT_YET, HARDEST, DEN3, WAFFLES, REST, BED]).flat();
  // every beat is in the chapter (once, or once in each copy of a scene read in one of two places),
  // and every frame of the chapter is somebody's beat
  const TWICE = UNDER.concat(OTTERS_A, DUCK, NO_DUCK, OTTERS_B, FLEW, OTTERS_C).map(b => b[0]);
  ALL.forEach(([label, pred]) => assert.equal(ids.filter(pred).length, TWICE.includes(label) ? 2 : 1, label + ': ' + ids.filter(pred).join(' ')));
  ids.forEach(id => assert.equal(ALL.filter(b => b[1](id)).length, 1, id + ' is one beat: ' + ALL.filter(b => b[1](id)).map(b => b[0]).join(' | ') + ' (' + T(id) + ')'));
  // her day, panel by panel: what a cat of this kind reads on this route with these light choices
  function day(c, light) {
    const f = c.flags, o = c.o, was = found(c), noticing = f.specialty === 'noticing', climbing = f.specialty === 'climbing', water = f.worry === 'water';
    const otters = [].concat(OTTERS_A, light ? NO_DUCK : DUCK, OTTERS_B, noticing ? FLEW : [], OTTERS_C);
    const reeds = [];
    for (let n = 0; n < 3; n++) { if (o.wait > n) reeds.push(...STILL[n] || []); else { reeds.push(...LOUD[n]); break; } }
    if (o.wait === 3) reeds.push(...PALE1, ...(o.raft === 'lean' ? SNOUT : []), ...PALE2);
    return [].concat(PILE, noticing ? GAP_TAP.concat(PRINTS) : GAP, PILE2, HOLLOW,
      c.squall === 'before' ? [] : OFFER, was.roof ? (climbing ? CLIMB : RIDE).concat(ROOF) : c.squall === 'no' ? AGAIN : [],
      CROSS1, was.roof ? NEWS_ROOF : [], CROSS2, f.ch3Told ? TRUER : [], water ? HONOR : [],
      ROAR1, light ? WINDOWS : SHUT, ROAR2, o.raft === 'lean' ? UNDER : LOOKUP, WHO, o.first === 'otters' ? otters : [],
      MARSH1, f.specialty === 'friends' ? FEATHER : [], MARSH2, light ? GOOD : GUESS, MARSH3, c.squall !== 'no' ? SAW : [], MARSH4, climbing ? PRINTS_TAP.concat(TRACKS) : PRINTS_MARSH, noticing || o.first === 'otters' ? SAME : [], MARSH5,
      reeds, FISH1, f.specialty === 'swimming' && !water ? HOOK : [], FISH2, was.wisp ? GULP_HER : GULP_ALL, FISH3,
      o.raft === 'lean' ? [] : SLIPB.concat(o.raft === 'ask' ? POINT.concat(UNDER, BLUB) : FINE), o.first === 'heron' ? otters : [],
      HOME1, f.ch3Told ? EYES_TOLD : EYES_KEPT, HOME2, today(c) ? [] : NOBODY, was.roof ? BROTHER : [], was.puddle ? PUDDLE_NEWS : [], was.wisp ? SISTER : [], today(c) ? COUNT : [], HOME3,
      DEN1, water ? DEEP : [], DEN2, light ? HARDEST : NOT_YET, DEN3, noticing ? WAFFLES : [], today(c) ? REST : [], BED);
  }
  for (const c of COMBOS) for (const light of [0, 1]) {
    const p = walk(c.flags, Object.assign({}, c.o, { light })), want = day(c, light), name = comboName(c) + ' light ' + light;
    for (let i = 0; i < Math.max(p.length, want.length); i++) {
      assert.ok(p[i] && want[i], name + ': ' + (p[i] ? 'an extra panel, ' + p[i] + ' (' + T(p[i]) + ')' : 'her day stops short of “' + want[i][0] + '”'));
      assert.ok(want[i][1](p[i]), name + ': panel ' + (i + 1) + ' is ' + p[i] + ' (' + T(p[i]).slice(0, 60) + '…), and should be “' + want[i][0] + '”');
    }
    // the flags as her day left them
    assert.deepEqual([!!p.flags.ch5Roof, !!p.flags.foundSquall, !!p.flags.foundPuddle, !!p.flags.foundWisp, p.flags.ch5First], [found(c).roof, found(c).squall, found(c).puddle, found(c).wisp, c.o.first], name);
  }
  // the second copy of each scene is the late one
  assert.ok(ids.filter(UNDER[0][1]).every((id, i) => (i === 0 ? UNDER1 : UNDER2)[0] === id));
  assert.ok(ids.filter(OTTERS_A[0][1]).every((id, i) => (i === 0 ? OTTERS1 : OTTERS2)[0] === id));
});

/* ------------------------------------------------------------------ every `when` */

test('every `when`, on every combination: each reader reads her own lines and nobody else’s; no name of a dragonet she has not met; the news under the bridge; the pale-sister line exactly once without Wisp', () => {
  const count = (s, re) => (s.match(new RegExp(re.source, 'g')) || []).length;
  for (const c of COMBOS) for (const clean of (COMBOS.indexOf(c) % 5 ? [true] : [true, false])) {
    const f = c.flags, o = c.o, name = comboName(c);
    const rows = walkLines(f, Object.assign({}, o, { clean })), lines = rows.map(r => r.lines.join(' ')).join('\n');
    const reads = (re, want, what) => assert.equal(re.test(lines), !!want, name + ': ' + what);
    const told = f.ch3Told, noticing = f.specialty === 'noticing', climbing = f.specialty === 'climbing', swims = f.specialty === 'swimming', water = f.worry === 'water';
    const was = found(c), any = today(c), met = c.squall !== 'no';
    // told or kept
    reads(/Tallyheart’s whiskers twitch\. You both know a dragon who hasn’t taken one mouse\./, told, 'her whiskers');
    reads(/(^|\n)You know a dragon who hasn’t taken one mouse\. You don’t say a word\./, !told, 'not a word');
    reads(/She leans close\. Find me something truer than a fox’s story\. For her\./, told, 'her whisper at the raft');
    reads(/They peek over Tallyheart’s branch\./, told, 'the branch');
    reads(/you check the bank first\. No ginger ears\./, !told, 'the bank');
    reads(/Then you whisper the rest\. That is a LOT of dragon\. And a lot to check\. Together\./, told && any, 'the rest, whispered');
    reads(/You don’t tell her the rest\. Your secret is getting bigger\./, !told && any, 'the rest, kept');
    reads(/That is a LOT of dragon/, told && any, 'no den line about dragonets without a find today');
    // the lesson: a cat who needed no help says "only"
    reads(/It’s only tens\. With a claw tucked in\./, clean, 'only tens');
    reads(/It’s tens\. With a claw tucked in\. That’s all a nine is\./, !clean, 'tens; that’s all a nine is');
    // a noticing cat: the sweep, the catch, the match, her line at the den, Waffles; and only she
    reads(/Tiny prints\. Each is half the size of yours\./, noticing, 'her prints at the pile');
    reads(/His tail sweeps the prints away\. Nothing left to show anyone\. But you saw them\./, noticing, 'the sweep');
    reads(/Flew\. Again\. You know a dragon who can’t\./, noticing, 'Flew. Again.');
    reads(/The same tiny prints as behind the pile!/, noticing, 'the same tiny prints');
    reads(/And the same tiny prints were behind OUR pile\. Till a tail swept them\./, noticing, 'her line at the den');
    reads(/One hole in his story for certain\. Maybe two\./, noticing && told, 'one hole for certain: only when she also told');
    reads(/Waffles was up ALL night\. With her nerves\./, noticing, 'Waffles');
    // a climber: the offer's line, her way up, the pole, her line at the den
    reads(/Balcony, balcony, balcony, roof\. You could still climb that\./, climbing && c.squall !== 'before', 'you could still climb that');
    reads(/It’s only a very tall curtain, really\./, climbing && was.roof, 'the climb');
    reads(/Take the little room, darling!.*\n.*The elevator!/, !climbing && was.roof, 'the little room');
    reads(/From the top, you see where the prints go: off toward the train tracks\./, climbing, 'the top of the pole');
    reads(/And the prints run off toward the train tracks\./, climbing, 'her line at the den');
    assert.equal(count(lines, /A thing to check\./), noticing || climbing ? 1 : 0, name + ': a second pair of balloons only for a noticing cat or a climber');
    // the other specialties
    reads(/You’ve held still for socks\. You can hold still for this\./, f.specialty === 'sneaking', 'socks, in the Roar itself, on every path');
    reads(/Sock-hunting, all over again\./, f.specialty === 'sneaking' && o.wait >= 1, 'socks again, if she waits');
    reads(/The old otter nods at you, once\. You know a friend’s nod when you see one\./, f.specialty === 'friends', 'a friend’s nod');
    reads(/Hello, Patience\./, f.specialty === 'friends', 'hello');
    reads(/One grey feather lifts\. For Patience, that’s a grin\./, f.specialty === 'friends', 'a feather');
    // a swimmer reads exactly one of her two lines at the raft, and her line at the catch only without the water worry
    reads(/Your first paw goes in the river, to say hello\./, swims && !water, 'a paw in the river');
    reads(/It isn’t one bit like a dripping tap\./, swims && water, 'not like a dripping tap');
    reads(/You hook the last string aboard\. A wet paw! You don’t mind one bit\./, swims && !water, 'a wet paw');
    assert.equal(count(lines, /Your first paw goes in the river|It isn’t one bit like a dripping tap/), swims ? 1 : 0, name + ': exactly one of her two lines at the raft');
    // the water worry: her places, and none of them for anyone else
    reads(/Your paws won’t move\./, water, 'her paws won’t move');
    reads(/That’s what she promised, on your very first night\./, water, 'what she promised');
    reads(/And if you fall in, I’ll have you out before your tail gets wet\. Otter’s honor\./, water, 'otter’s honor');
    reads(/You look down\. Still deep\. You look at your paws\. Still here\./, water, 'still here');
    reads(/The deep water is right under your nose\. You look anyway\./, water && was.puddle, 'under her nose');
    reads(/Beside the mud, you can see the bottom\. You look at it a lot\./, water, 'the bottom');
    reads(/And the deep water\? Still deep\. I looked right at it\./, water, 'still deep');
    // the other worries
    reads(/You’re the smallest thing on the whole wide river\. You sit still anyway\./, f.worry === 'small', 'the smallest thing');
    reads(/You have a hundred questions\. At two fish each, you pick one more\./, f.worry === 'talk', 'a hundred questions');
    reads(/They flash like silver\. You try very hard not to stare\./, f.worry === 'shiny', 'silver');
    // her stone
    reads(/Riffle’s stone is by your nose\./, true, 'her stone');
    reads(/Riffle’s stone is under your chin\./, false, 'not under her chin');
    // Squall: the offer, the roof, her news, what the heron's shapes are set beside, bedtime's hiccup
    reads(/From the tallest tower:/, c.squall !== 'before', 'the offer');
    assert.equal(count(lines, /Sprinkle’s littlest brother is still up there\./), c.squall === 'no' ? 2 : c.squall === 'today' ? 1 : 0, name + ': still up there (the tower, and bedtime for a cat who has still not met him)');
    reads(/AGAIN, \{petname\}\?/, c.squall === 'no', 'AGAIN?');
    reads(/I found Squall! Sprinkle’s littlest brother!.*\n.*Raft first\./, was.roof, 'raft first');
    reads(/Just what Squall saw! He saw them\. She saw them\. Same two shapes!/, met, 'just what Squall saw');
    reads(/…hic! Sprinkle’s littlest brother is still up there\./, !met, 'bedtime’s hiccup');
    // a cat who has not met a dragonet never reads his name, anywhere
    assert.equal(/Squall/.test(lines), met, name + ': Squall’s name');
    assert.equal(/\bPuddle\b/.test(lines), was.puddle, name + ': Puddle’s name');
    assert.equal(/Wisp|WISP/.test(lines), was.wisp, name + ': Wisp’s name');
    // the slip: never for a cat who found Puddle after the Roar; exactly once for one who did not
    assert.equal(count(lines, /It’s because of Pud— PUDDLES\. Raft puddles\. Not a name\./), o.raft === 'lean' ? 0 : 1, name + ': the slip');
    reads(/I promised Granny I wouldn’t TELL\. I’m only POINTING\./, o.raft === 'ask', 'pointing');
    reads(/Best friend an otter ever had\.\nUnder the logs, something goes blub\./, o.raft === 'fine', 'puddles, fine');
    assert.equal(count(lines, /I’m Puddle\./), was.puddle ? 1 : 0, name + ': “Under the raft” once at most');
    // his snout in the reeds: only for a cat who found him after the Roar and then finds Wisp
    reads(/A blue-grey snout pokes up between the logs\. WISP\?\nWisp lays one claw across her snout\. I’m a LOG\./, o.raft === 'lean' && was.wisp, 'his snout');
    // the reeds
    reads(/ONE! TWO!\nEvery frog jumps in\. Patience shuts both eyes\. One reed flinches\./, o.wait === 0, 'the first loud way out');
    reads(/THREE!\nThe dragonfly leaves\. So do the frogs\./, o.wait === 1, 'the second');
    reads(/FIVE!\nWhen you look back, every reed looks the same\./, o.wait === 2, 'the third');
    reads(/What did I miss\? A reed with knees\./, was.wisp, 'a reed with knees');
    reads(/What did I miss\? Frogs\./, !was.wisp, 'frogs');
    reads(/Down go the fish\. One for Patience\. One for Wisp\. Gulp\. Gulp\. Gulp\./, was.wisp, 'her half of the fish');
    reads(/Down go the fish\. Gulp\. Gulp\. Gulp\./, !was.wisp, 'down go the fish');
    // the two orders: the fur and the prints set side by side once, from whichever came second
    reads(/Thin fur there\. Tiny prints here\. The same somebody\?/, o.first === 'otters', 'the prints, after the fur');
    reads(/Somebody small\. Tiny prints there\. Thin fur here\. The same somebody\?/, o.first === 'heron', 'the fur, after the prints');
    assert.equal(count(lines, /The same somebody\?/), 1, name + ': once');
    assert.equal(count(lines, /What did you hear about the storm night\?/), 1, name + ': the otters once');
    reads(/At last, the Crossing again\./, o.first === 'heron', 'the Crossing again');
    // (a cat who found Puddle after the Roar and asked the otters first goes from the marsh straight to the rocks)
    if (o.raft === 'lean' && o.first === 'otters') assert.match(lines, /That nosy old thing trades secrets like pebbles\.\nAt the rocks, Riffle ties up the raft/, name);
    reads(/At the rocks, Riffle ties up the raft/, true, 'at the rocks');
    // the news under the bridge: exactly the lines for the dragonets met today, or "anyone new",
    // with "And Squall." exactly when she met him in chapter 4
    const news = [];
    if (!any) news.push('I didn’t find anyone new today. You will. You found me.' + (c.squall === 'before' ? ' And Squall.' : '') + ' My pale sister is the best at hiding. You have to wait till she blinks.');
    // (a panel for each piece of news: one balloon of hers, and Sprinkle's answer where she has one)
    if (was.roof) news.push('I found your littlest brother. He says: five.');
    if (was.puddle) news.push('Puddle is under the otters’ raft. He says: five. Then he sank. He does that.');
    if (was.wisp) news.push('Wisp is in the reeds, being a heron. She held up five.');
    if (any) news.push('Sprinkle has drawn her six little forepaws in the mud again. Now she draws one more. Mine.', 'Mama’s count is coming back.' + (was.wisp ? '' : ' But my pale sister is the best at hiding. You have to wait till she blinks.'));
    const i0 = rows.findIndex(r => /^Tell me EVERYTHING\.$/.test(r.lines.join(' '))), i1 = rows.findIndex(r => /^Somebody small crosses the marsh every night\./.test(r.lines.join(' ')));
    assert.deepEqual(rows.slice(i0 + 1, i1).map(r => r.lines.join(' ')), news, name + ': her news');
    // the pale-sister line: exactly once for a cat without Wisp, never for a cat with her
    assert.equal(count(lines, /pale sister is the best at hiding/), was.wisp ? 0 : 1, name + ': the pale-sister line');
    assert.equal(/And Squall\./.test(lines), !any && c.squall === 'before', name + ': “And Squall.”');
  }
  // her stone under her chin
  assert.ok(walkLines({ ch3Told: true, ch2Path: 'bridge', specialty: 'friends', worry: 'talk', ch2Stone: 'chin' }, {}).some(r => r.lines.includes('Riffle’s stone is under your chin.')));
  // “found today”: none is three flags all unset, any is `not` over the three (E.matches reads false as unset)
  [[{}, true], [{ foundSquall: true }, true], [{ ch5Roof: true, foundSquall: true }, false], [{ foundPuddle: true }, false], [{ foundWisp: true }, false], [{ foundPuddle: true, foundWisp: true, ch5Roof: true }, false]]
    .forEach(([flags, none]) => assert.deepEqual([E.matches(NONE, { flags }), E.matches(ANY, { flags })], [none, !none], JSON.stringify(flags)));
  // the offer's `when`: not (met him, and not here): a cat with no foundSquall, or with ch5Roof; never one who met him in chapter 4 only
  assert.deepEqual([{}, { foundSquall: true }, { foundSquall: true, ch5Roof: true }, { ch5Roof: true }].map(flags => E.shows(frames[TOWER], { flags })), [true, false, true, true]);
  // the frame after the prints: a noticing cat, or one who asked the otters first
  const sameF = F(/The same tiny prints as behind the pile!/);
  assert.deepEqual([{ specialty: 'noticing', ch5First: 'heron' }, { specialty: 'noticing', ch5First: 'otters' }, { specialty: 'friends', ch5First: 'otters' }, { specialty: 'friends', ch5First: 'heron' }].map(flags => E.shows(frames[sameF], { flags })), [true, true, true, false]);
  // each specialty's and each worry's lines are where the text puts them (a frame of her own, or a line on everyone's)
  const where = (k, v) => ids.filter(id => (frames[id].when && frames[id].when[k] === v) || texts(frames[id]).some(x => x.when && x.when[k] === v));
  assert.equal(where('specialty', 'noticing').length, 6, 'noticing: her Tap, her prints, the sweep, the match at the marsh, her line at the den, Waffles');
  assert.equal(where('specialty', 'climbing').length, 5, 'climbing: the offer’s line, her way up, her Tap on the pole, the view from its top, her line at the den');
  assert.equal(where('specialty', 'sneaking').length, 2, 'sneaking: in the Roar, and in the reeds');
  assert.equal(where('specialty', 'friends').length, 3, 'friends: the old otter’s nod, hello, the feather');
  assert.equal(where('specialty', 'swimming').length, 3, 'swimming: a paw in the river, the dripping tap, the last string');
  assert.equal(where('worry', 'water').length, 8, 'water: her seven places (the deep water under her nose is in both copies of “Under the raft”)');
  assert.deepEqual([where('worry', 'small').length, where('worry', 'talk').length, where('worry', 'shiny').length], [1, 1, 1]);
  // ch2SaidAloud, ch2Path, stepOut, spokeUp and joinReason aren't read; lessonClean is read once
  ids.forEach(id => [frames[id].when].concat(texts(frames[id]).map(x => x.when)).filter(Boolean).forEach(w => ['ch2SaidAloud', 'ch2Path', 'stepOut', 'spokeUp', 'joinReason'].forEach(k => assert.ok(!(k in w), id + ': ' + k))));
  assert.deepEqual(ids.filter(id => texts(frames[id]).some(x => x.when && (x.when.lessonClean || (x.when.not && x.when.not.lessonClean)))), [F(/That’s your fifth Count/)]);
});

/* ------------------------------------------------------------------ Counts */

function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }
const pairs = d => d.facts.map(f => { const q = factAB(f); return q.a + 'x' + q.b; });
const RIM5 = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
const TH = text => ({ who: 'tallyheart', text });

test('counts: every set exactly as the text’s Build notes have it', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), SETS);
  const tens4 = ch04.counts['ch04-tens'], pile4 = ch04.counts['ch04-pile'];
  // the pile: one question, 3 × 10, lit a row at a time, read under its caption; chapter 4's pile help
  assert.deepEqual(C['ch05-pile'], {
    table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
    picture: { kind: 'prey', layout: 'rows' },
    facts: [{ a: 3, b: 10, light: 'rows', check: true,
      prompt: [{ kind: 'caption', text: 'You walk along the rows. One full row. Two. Three.' }, { kind: 'caption', text: 'How many pieces in three rows of ten?' }],
      retryPrompt: 'Three rows of ten. How many pieces?' }],
    ask: '{a} × {b}', praise: [], ground: 'earth',
    helpIntro: 'Let’s scratch it out: ten marks for every row.',
    helpIntroNotTen: 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.',
    fillFrom: 'ch04-tens', fillOrder: 'easiest', avoid: [[5, 10], [4, 10]], fillIntro: 'One from yesterday.',
    miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', again: ['There it is. You remembered that one.'], done: null
  });
  assert.deepEqual([C['ch05-pile'].helpIntro, C['ch05-pile'].helpIntroNotTen], [pile4.helpIntro, pile4.helpIntroNotTen], 'chapter 4’s pile help');
  assert.equal(C['ch05-pile'].fast, undefined, 'nobody praises speed at the pile');
  // the warm-up on the 10s: two questions; the hard slot first; 5 × 10 written last, with the five rim cats
  assert.deepEqual(C['ch05-tens'], {
    table: 10, thing: 'front claw', things: 'front claws', unit: 'cat', units: 'cats', teacher: 'tallyheart',
    facts: [[10, 7], { a: 5, b: 10, who: RIM5, prompt: [TH('Five cats, ten front claws each. How many front claws?')], retryPrompt: true, right: [TH('Fifty!')], rightAgain: true }],
    warmHard: { table: 10, at: 0, avoid: [[5, 10], [3, 10]] },
    avoid: [[5, 10], [3, 10], [4, 10]],
    fillFrom: 'ch04-tens', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
    ask: '{a} × {b}',
    praise: ['Yes! Ten front claws on every cat.', 'Hopping by tens, like a real hunter.', 'Tens are friendly, aren’t they?', 'Hop, hop, hop!', 'You hopped it!'],
    fast: ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.'],
    fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
    helpIntro: 'Close. Let’s scratch it out together: two swipes for every cat, five lines a swipe.',
    helpIntroFar: 'Let’s scratch it out together: two swipes for every cat, five lines a swipe.',
    helpIntroNotTen: 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.',
    miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
    remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
    rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.',
    done: null
  });
  ['praise', 'fast', 'fastAfterMiss', 'helpIntro', 'helpIntroFar', 'helpIntroNotTen'].forEach(k => assert.deepEqual(C['ch05-tens'][k], tens4[k], 'the warm-up uses chapter 4’s tens ' + k));
  assert.doesNotMatch(JSON.stringify(C['ch05-tens']), /last one|\blast\b/i, 'nobody says “last”');
  const warm = countsAt('ch05-tens')[0];
  assert.equal(T(frames[warm].counts.next), 'Hold on to that fifty. Today’s Count is the nines.', 'the bridge is the next frame’s text, which every player reads');
  // the lesson: the 9s, ten answers in both orders
  const n = C['ch05-nines'];
  assert.deepEqual(n, {
    table: 9, thing: 'life', things: 'lives', unit: 'cat', units: 'cats', teacher: 'tallyheart',
    label: 'Nine lives', hollowThings: 'nines',
    light: 'tuck', fillOrder: 'easiest',
    facts: [
      { a: 2, b: 9, who: RIM5.slice(0, 2), right: [TH('Eighteen! Hop, then tuck.')], rightAgain: [TH('Eighteen! One and eight. There’s your nine.')] },
      { a: 9, b: 10, prompt: 'Ten cats. Ten tens make a hundred. Now tuck ten in.', retryPrompt: true, right: [TH('Ninety! Yesterday it was nine cats, ten claws each. Same ninety!')], rightAgain: true },
      { a: 4, b: 9, prompt: 'Four cats. Hop by tens. Then tuck four in.', retryPrompt: true,
        right: [TH('Thirty-six! Now look. Three and six make nine. {also}Every nines answer hides a nine!')],
        rightAgain: [TH('Thirty-six! Three and six. There’s your nine.')],
        miss: 'Thirty-six. Now look. Three and six make nine. {also}Every nines answer hides a nine! We’ll come back to that one.',
        missLast: 'Thirty-six. Now look. Three and six make nine. {also}Every nines answer hides a nine!',
        shows: { kind: 'answers', of: [[2, 9]], also: 'One and eight make nine. ' } },
      [9, 1],
      { a: 9, b: 6, prompt: 'Six cats. Six tens make sixty. Now tuck six in.', retryPrompt: true, right: [TH('Fifty-four! Five and four. There’s your nine.')], rightAgain: true },
      [3, 9], [9, 8], [5, 9], [7, 9],
      { a: 9, b: 9, right: [TH('EIGHTY-ONE!'), { who: 'murmurchime', text: 'Not mice.' }], rightAgain: true }
    ],
    firstPrompt: 'Two cats. Hop by tens: twenty. Now tuck two in. How many lives?',
    ask: '{a} × {b}',
    praise: ['Yes! Nine lives on every cat.', 'Tens, with a claw tucked in. That’s all a nine is.', 'You tucked it!', 'Hop, hop, tuck!', 'Hop, then tuck!'],
    fast: ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.'],
    fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
    helpIntro: 'Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.',
    helpIntroFar: 'Let’s scratch it out together: hop by tens, then tuck one in for every cat.',
    helpIntroTens: 'That’s the hop! Now the tuck: one claw in for every cat.',
    helpIntroOneTuck: 'So close! You tucked ONE claw. Tuck one in for every cat.',
    helpIntroNotNine: 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.',
    miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
    remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
    done: 'That’s the nines.'
  });
  assert.deepEqual(pairs(n), ['2x9', '9x10', '4x9', '9x1', '9x6', '3x9', '9x8', '5x9', '7x9', '9x9']);
  const ans = n.facts.map(f => { const q = factAB(f); return q.a * q.b; });
  assert.deepEqual(ans, [18, 90, 36, 9, 54, 27, 72, 45, 63, 81]);
  ans.forEach((a, i) => { if (i) assert.notEqual(Math.abs(a - ans[i - 1]), 9, 'no two consecutive answers differ by nine: ' + ans[i - 1] + ' then ' + a); });
  assert.deepEqual(n.facts.map(f => { const q = factAB(f); return q.a === 9 ? q.b : q.a; }).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'every number from 1 to 10 once');
  const nineSecond = n.facts.map(factAB).filter(q => q.b === 9 && q.a !== 9).map(q => q.a), nineFirst = n.facts.map(factAB).filter(q => q.a === 9 && q.b !== 9).map(q => q.b);
  assert.deepEqual([nineSecond, nineFirst], [[2, 4, 3, 5, 7], [10, 1, 6, 8]], 'five with the nine second, four with it first, and 9 × 9');
  // the 4 × 9 prompt names no total; no praise, fast or again line names a total; the praise ends with the opener's own line
  assert.doesNotMatch(n.facts[2].prompt, /forty|thirty|\d/i);
  [].concat(n.praise, n.fast, n.fastAfterMiss, n.again || []).forEach(l => assert.doesNotMatch(l, /\d|eighteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred/i, 'no line names a total: ' + l));
  assert.equal(n.praise[n.praise.length - 1], 'Hop, then tuck!');
  assert.equal(n.fillFrom, undefined, 'it fills its own gaps, the easiest of her right answers first');
  // Riffle's three, whole: every line the borrower's; a miss scratched on a log; no praise, no "first"
  const RIFFLE = { teacher: 'riffle', fillVoice: 'borrower', fillPicture: 'borrower', fillOrder: 'easiest', fillIntro: 'An easy one!', againIntro: 'The fish again!',
    miss: 'Phew. That one again in a minute.', missLast: 'There. Now we’ve counted it.', again: ['You GOT it!'], helpCounter: 'you', ground: 'log', ask: '{a} × {b}', praise: [], done: null };
  assert.deepEqual(C['ch05-otter'], Object.assign({}, RIFFLE, {
    table: 2, thing: 'fish', things: 'fish', unit: 'answer', units: 'answers', picture: { kind: 'fish', layout: 'pairs', thought: true },
    facts: [{ a: 7, b: 2, prompt: [{ who: 'riffle', text: 'How many fish is THAT?' }], retryPrompt: 'Seven answers, two fish for every answer. How many fish?',
      right: [{ who: 'riffle', text: 'FOURTEEN?' }, { who: 'riffle', text: 'For YES and NO?' }], rightAgain: true }],
    helpIntro: 'Scratch it on the log! Two for every answer.', fillFrom: 'ch02-ears'
  }));
  assert.deepEqual(C['ch05-bill'], Object.assign({}, RIFFLE, {
    table: 2, thing: 'fish', things: 'fish', unit: 'answer', units: 'answers', picture: { kind: 'fish', layout: 'pairs', thought: true },
    facts: [{ a: 9, b: 2, prompt: [{ who: 'patience', text: 'Nine answers.' }, { who: 'patience', text: 'Two fish for every answer.' }, { kind: 'caption', text: 'How many fish?' }],
      retryPrompt: 'Nine answers, two fish for every answer. How many fish?',
      right: [{ who: 'patience', text: 'Eighteen.' }, { who: 'patience', text: 'Before sunset.' }], rightAgain: true }],
    helpIntro: 'Scratch it on the log! Two for every answer.', fillFrom: 'ch02-ears', avoid: [[7, 2]]
  }));
  assert.deepEqual(C['ch05-catch'], Object.assign({}, RIFFLE, {
    table: 5, thing: 'fish', things: 'fish', unit: 'string', units: 'strings', picture: { kind: 'fish', layout: 'strings' }, light: 'groups',
    facts: [{ a: 4, b: 5, prompt: [{ kind: 'caption', text: 'Four strings, five fish on every string. How many fish?' }], retryPrompt: true,
      right: [{ who: 'riffle', text: 'TWENTY!' }, { who: 'player', text: 'Eighteen for Patience. Two to spare.' }], rightAgain: true }],
    helpIntro: 'Scratch it on the log! Five for every string.', fillFrom: 'ch03-claws', avoid: [[5, 5]]
  }));
  ['ch05-otter', 'ch05-bill', 'ch05-catch'].forEach(sid => { assert.equal(C[sid].fast, undefined, sid + ': no fast lines'); countsLines().filter(x => x.set === sid).forEach(x => assert.doesNotMatch(x.text, /\bfirst\b|sand|mud|Tallyheart/i, sid + ' ' + x.where)); });
  // Puddle's riddle: the raft from underneath; a miss lights his own bumps a log at a time
  assert.deepEqual(C['ch05-puddle'], {
    table: 10, thing: 'bump', things: 'bumps', unit: 'log', units: 'logs', teacher: 'puddle', picture: { kind: 'bumps' },
    facts: [{ a: 4, b: 10, prompt: 'Four logs in this raft. I’ve bumped my head ten times on every one. How many bumps?', retryPrompt: 'Four logs, ten bumps on every one. How many bumps?',
      right: [{ who: 'puddle', text: 'FORTY!' }, { who: 'puddle', text: 'No wonder it hurts.' }], rightAgain: true }],
    help: 'picture', helpCounter: 'you', helpIntro: 'Count my bumps! You hop!',
    fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', avoid: [[4, 10], [5, 10]], fillIntro: 'Do another one!', againIntro: 'My bumps again!',
    ask: '{a} × {b}', praise: ['YES!', 'You’re GOOD at bumps!'], again: ['You DID it!'], miss: 'There! Let’s do that one again.', missLast: 'There! All my bumps, counted.', done: null
  });
  assert.equal(C['ch05-puddle'].facts[0].who, undefined, 'no dragonet behind the bumps (chapter 4’s reason: the picture is the raft)');
  // Wisp's riddle: a silent set, lettered in captions; Patience's one line opens the help
  assert.deepEqual(C['ch05-wisp'], {
    table: 1, thing: 'leg in the water', things: 'legs in the water', unit: 'heron', units: 'herons', teacher: 'caption', picture: { kind: 'herons' },
    facts: [{ a: 7, b: 1, prompt: [{ kind: 'caption', text: 'Seven herons, each standing on one leg. How many legs in the water?' }], retryPrompt: true, right: [{ kind: 'caption', text: 'She nods. Once.' }], rightAgain: true }],
    help: 'picture', helpCounter: 'you', helpSays: 'patience', helpIntro: 'Look again. One leg each.',
    fillFrom: 'ch01-tails', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', avoid: [[1, 1], [4, 1]], fillIntro: 'She draws another one.', againIntro: 'She taps the seven herons again.',
    ask: '{a} × {b}', praise: [], again: ['She nods.'], miss: 'She points at them again.', missLast: 'She counts them with you, one by one.', done: null
  });
  // every fact: arithmetic, in its Count, no duplicates in a set; a set borrows from the same Count
  Object.keys(C).forEach(sid => {
    const d = C[sid];
    assert.equal(d.ask, '{a} × {b}', sid);
    if (d.fillFrom) {
      const lend = E.countsSet(d.fillFrom, story, PC.story);
      assert.ok(lend, sid + ': fillFrom names a set');
      assert.equal(lend.table, d.table, sid + ': it borrows from the same Count');
    }
    const keys = new Set();
    d.facts.forEach(f => {
      const q = factAB(f);
      assert.ok(Number.isInteger(q.a) && Number.isInteger(q.b) && q.a >= 1 && q.b >= 1 && q.a <= 10 && q.b <= 10, sid + ': ' + JSON.stringify(f));
      assert.ok(q.a === d.table || q.b === d.table, sid + ': ' + q.a + '×' + q.b + ' belongs to the ' + d.table + 's');
      assert.ok(!keys.has(q.a + 'x' + q.b), sid + ': ' + q.a + 'x' + q.b + ' twice');
      keys.add(q.a + 'x' + q.b);
    });
  });
  // today's Count is the 9s; the morning's three tens, the fish in 2s and 5s, and a riddle in 10s and in 1s
  assert.deepEqual(Object.keys(C).map(sid => C[sid].table), [10, 10, 9, 2, 2, 5, 10, 1]);
  // 16 typed answers with no misses; 17 to 19 with the riddles (chapter 4's, Puddle's, Wisp's)
  const typed = Object.keys(C).reduce((m, sid) => m + C[sid].facts.length, 0);
  assert.equal(typed - C['ch05-puddle'].facts.length - C['ch05-wisp'].facts.length, 16);
  assert.equal(typed + ch04.counts['ch04-riddle'].facts.length, 19);
  t.diagnostic('16 typed answers (17 to 19 with the riddles) with no misses');
  // the Hollow offers "Nine lives · the 9s", never the pile, the warm-up, the fish or the riddles
  assert.deepEqual(E.countSets(STORIES).map(x => x.setId), ['ch01-tails', 'ch02-ears', 'ch03-claws', 'ch04-tens', 'ch05-nines']);
  assert.equal(E.countName(n, 9), 'Nine lives · the 9s');
  // the Counts frames, in the text's order, each with the lines its own page carries (the pile's four
  // balloons, the fish frame's two: neither page is a picture and a button)
  const cf = ids.filter(id => frames[id].counts);
  assert.deepEqual(cf.map(id => [frames[id].counts.set, (frames[id].caption || []).length, (frames[id].say || []).length]),
    [['ch05-pile', 1, 4], ['ch05-tens', 1, 1], ['ch05-nines', 0, 2], ['ch04-riddle', 0, 3], ['ch05-puddle', 1, 1], ['ch05-otter', 0, 2], ['ch05-bill', 0, 1], ['ch05-wisp', 1, 0], ['ch05-catch', 0, 3], ['ch05-puddle', 1, 1]]);
  cf.forEach(id => assert.deepEqual(Object.keys(frames[id].counts).sort(), NO_INTRO.includes(frames[id].counts.set) ? ['intro', 'next', 'set'] : ['next', 'set'], id));
});

test('counts: lines are short, whole sentences, and fit both sexes; nobody but the set’s own voices speaks in it', () => {
  const VOICES = { 'ch05-pile': [], 'ch05-tens': ['tallyheart'], 'ch05-nines': ['tallyheart', 'murmurchime'], 'ch05-otter': ['riffle'], 'ch05-bill': ['patience'], 'ch05-catch': ['riffle', 'player'], 'ch05-puddle': ['puddle'], 'ch05-wisp': [] };
  const also = story.counts['ch05-nines'].facts[2].shows.also;
  countsLines().forEach(x => {
    assert.ok(typeof x.text === 'string', x.set + ' ' + x.where);
    assert.ok(x.text.trim(), x.set + ' ' + x.where + ' is empty');
    const text = x.text.replace('{also}', also);
    // (the one long line is the text's own: 4 × 9's idea, which a miss ends on with “We’ll come back to that one.”)
    assert.ok(words(text) <= (/^helpIntro|prompt/.test(x.where) ? 22 : /\{also\}/.test(x.text) ? 25 : 18), x.set + ' ' + x.where + ': short: ' + x.text);
    if (x.who) assert.ok(VOICES[x.set].includes(x.who), x.set + ' ' + x.where + ': ' + x.who);
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(text, PROFILES[kind])), [], x.set + ' ' + x.where + ': ' + x.text));
  });
  // every voice a set names speaks in it, and is in its Counts frame's cast when the line is a balloon
  // of the lesson's own (the new warrior from the rim; Patience and Riffle on the raft; Puddle beside it)
  Object.keys(VOICES).forEach(sid => {
    const said = new Set(countsLines().filter(x => x.set === sid && x.who).map(x => x.who));
    assert.deepEqual([...said].sort(), VOICES[sid].slice().sort(), sid);
    countsAt(sid).forEach(id => [...said].concat(story.counts[sid].teacher === 'caption' ? [story.counts[sid].helpSays] : [story.counts[sid].teacher]).forEach(who => assert.ok(castOf(id, who).length, id + ': ' + who + ' speaks in ' + sid + ', so is in the picture')));
  });
});

/* A cat who has read chapters 1 to 4, with these answers and times in chapter 4's tens lesson (as
 * the fixture's cat5): for what the morning borrows, and what the warm-up finds hard. */
function tensCat(tens, tensMs) {
  const cat = E.blankCat({ now: 1, id: 'c5' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch3Told: true });
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  play(cat, 'ch04-tens', tens, tensMs);
  return cat;
}
const DEFAULTS = ['Here’s that one again.', 'There. We’ll come back to that one.', 'There. Now you’ve seen it counted.', 'There it is. You remembered that one.', 'Yes! That one came back, and you knew it.', 'Let’s scratch it out together.', 'Yes!', 'Good work.'];
const saidIn = rows => rows.reduce((a, r) => a.concat(r.prompt.map(p => p.text), r.line, r.balloons.map(b => b.text), r.help ? [r.help.intro, r.help.line] : []), []).filter(Boolean);

test('the pile and the warm-up, the Build notes’ tests: three rows lit a row at a time; the hard ten first, never 3 × 10 or 5 × 10, and 4 × 10 for a cat whose only hard ten that is; 5 × 10 never a filler, 4 × 10 never one at the pile or in the warm-up; “Not today!”', () => {
  // the pile: read under its caption, no right line; a miss is scratched in the earth a row at a time
  const clean = play(tensCat(), 'ch05-pile');
  assert.deepEqual(clean.map(r => [r.k, r.q.answer, r.q.light, r.line, r.balloons.length]), [['3x10', 30, 'rows', '', 0]], 'no right line: the next screen is her answer’s reward');
  assert.deepEqual(clean[0].prompt.map(p => [p.kind, p.label, p.text]), [['caption', null, 'You walk along the rows. One full row. Two. Three.'], ['caption', null, 'How many pieces in three rows of ten?']]);
  assert.deepEqual(clean[0].picture, { table: 10, groups: 3, per: 10, highlight: 0, kind: 'prey', layout: 'rows', thought: undefined, who: undefined, thing: 'piece', things: 'pieces' });
  assert.deepEqual(clean[0].light.map(s => s.picture.highlight), [10, 20, 30], 'lit a row at a time, with no number shown');
  const missed = play(tensCat(), 'ch05-pile', { '3x10': [13] }), h = missed[0].help;
  assert.deepEqual(ks(missed), ['3x10✗', 'F:1x10', 'F:10x2', 'R:3x10']);
  assert.deepEqual([h.intro, h.ground, h.layout, h.byRow, h.nums, h.teacher], ['Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.', 'earth', 'rows', true, [10, 20, 30], 'tallyheart']);
  assert.equal(play(tensCat(), 'ch05-pile', { '3x10': [31] })[0].help.intro, 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.');
  assert.equal(play(tensCat(), 'ch05-pile', { '3x10': [40] })[0].help.intro, 'Let’s scratch it out: ten marks for every row.');
  assert.deepEqual(missed.slice(1, 3).map(r => r.prompt[0].text), ['One from yesterday. One cat. How many front claws?', 'One from yesterday. Two cats. How many front claws?'], 'asked as Tallyheart asked them yesterday: she is there');
  assert.equal(missed[3].prompt[0].text, 'Here’s that one again. Three rows of ten. How many pieces?');
  assert.deepEqual(ks(play(tensCat(), 'ch05-pile', { '3x10': [13, 40] })), ['3x10✗', 'F:1x10', 'F:10x2', 'R:3x10✗', 'F:1x10', 'F:10x2', 'R:3x10'], 'with its two fresh pairs used, the easy ones again: never 4 × 10, Puddle’s riddle, nor 5 × 10');
  assert.deepEqual(E.hardFacts(tensCat(), 10, STORIES), [], 'a right first ask read under a prompt says nothing about speed');
  // the frame's four balloons are its own page's: a whole conversation is not said again over the question
  const pf = countsAt('ch05-pile')[0];
  assert.deepEqual(Sp.lessonIntro(frames[pf].say, false), []);
  // the warm-up
  const def = story.counts['ch05-tens'];
  const facts = cat => E.lessonFacts(cat, Object.assign({ id: 'ch05-tens' }, def), STORIES).map(x => (Array.isArray(x) ? x.join('x') : x.a + 'x' + x.b + (x.hard ? ' hard' : '')));
  assert.deepEqual(facts(tensCat()), ['10x7', '5x10'], 'nothing was hard yesterday');
  assert.deepEqual(facts(tensCat({ '10x9': [80] })), ['10x9 hard', '5x10'], 'her hard ten takes the first question');
  assert.deepEqual(facts(tensCat(null, { '10x8': 7000 })), ['10x8 hard', '5x10'], 'right but slow counts too');
  assert.deepEqual(facts(tensCat({ '4x10': [44] })), ['4x10 hard', '5x10'], '4 × 10, for a cat whose only hard ten that is');
  assert.deepEqual(facts(tensCat({ '5x10': [5], '10x3': [13] })), ['10x7', '5x10'], 'never 5 × 10 (asked anyway) nor 3 × 10 (the pile’s)');
  assert.deepEqual(facts(tensCat({ '5x10': [5], '10x3': [13], '10x8': [81] })), ['10x8 hard', '5x10']);
  for (const miss of ['4x10', '10x2', '1x10', '6x10', '10x8', '10x9', '7x10', '10x10']) {
    const run = play(tensCat({ [miss]: [1] }), 'ch05-tens');
    assert.equal(run.length, 2, miss);
    assert.equal(pairKey(run[0].k), pairKey(miss), miss + ': her hard ten is asked first');
    assert.ok(run[0].q.hard && !['3x10', '5x10'].includes(pairKey(run[0].k)));
    assert.equal(run[1].k, '5x10', miss + ': 5 × 10 is written last');
  }
  // the engine words the first question itself; the second is Tallyheart's, with the five rim cats
  const cat = tensCat({ '10x9': [80] }), rows = play(cat, 'ch05-tens', null, { '10x9': 2500 });
  assert.deepEqual(rows.map(r => [r.k, r.prompt.map(p => p.text).join(' ')]), [['10x9', 'Nine cats. How many front claws?'], ['5x10', 'Five cats, ten front claws each. How many front claws?']]);
  assert.deepEqual([rows[0].kind, rows[0].line], ['remembered', 'Yesterday, 10 × 9 made you stop and think. Not today!']);
  assert.deepEqual(rows[1].balloons.map(b => b.text), ['Fifty!']);
  assert.deepEqual(rows[1].picture.who, RIM5);
  assert.deepEqual(E.hardFacts(cat, 10, STORIES), [], 'answered in under four seconds, it is no longer hard');
  assert.equal(play(tensCat({ '10x9': [80] }), 'ch05-tens', null, { '10x9': 3900 })[0].line, 'Yesterday, 10 × 9 made you stop and think. Not today!');
  const slow = tensCat({ '10x9': [80] }), srow = play(slow, 'ch05-tens', null, { '10x9': 9000 })[0];
  assert.deepEqual([srow.kind, srow.line], ['rememberedSlow', '10 × 9 again, and you got it. It’s getting easier.']);
  assert.deepEqual(E.hardFacts(slow, 10, STORIES), [[10, 9]]);
  assert.deepEqual(play(tensCat(), 'ch05-tens').map(r => [r.k, r.prompt.map(p => p.text).join(' ')]), [['10x7', 'Seven cats. How many front claws?'], ['5x10', 'Five cats, ten front claws each. How many front claws?']]);
  // none of the frame's own lines is lettered over its first question (`intro: false`), so its clock is the fact's
  assert.equal(frames[warm5()].counts.intro, false);
  assert.deepEqual(Sp.lessonIntro(E.balloons(frames[warm5()], cat), frames[warm5()].counts.intro === false), []);
  assert.equal(E.readFirst({ set: 'ch05-tens', a: 10, b: 7 }, STORIES, null, true), false, 'the opener is timed on itself');
  assert.equal(E.readFirst({ set: 'ch05-tens', a: 5, b: 10 }, STORIES, null, false), true, '5 × 10 is read under its own prompt');
  const fresh7 = tensCat(); play(fresh7, 'ch05-tens', null, { '10x7': 9000 });
  assert.deepEqual(E.hardFacts(fresh7, 10, STORIES), [[10, 7]], 'a plain 10 × 7 answered slowly this morning is hard for tomorrow');
  // a miss borrows the easiest of yesterday's tens, after "One from yesterday.": 1 × 10 and 10 × 2; never 4 × 10 or 5 × 10
  const both = play(tensCat(), 'ch05-tens', { '10x7': [71, 71], '5x10': [5, 5] });
  assert.deepEqual(ks(both), ['10x7✗', '5x10✗', 'F:1x10', 'R:10x7✗', 'R:5x10✗', 'F:10x2', 'R:10x7', 'R:5x10']);
  both.filter(r => r.q.filler).forEach(r => { assert.match(r.prompt[0].text, /^One from yesterday\. /); assert.ok(!['4x10', '5x10'].includes(pairKey(r.k)), r.k); });
  assert.equal(both.find(r => r.k === 'R:5x10✗').prompt.map(p => p.text).join(' '), 'Here’s that one again. Five cats, ten front claws each. How many front claws?');
  assert.deepEqual([both[0].help.ground, both[0].help.style, both[0].help.pair, both[0].help.nums, both[0].help.intro], ['sand', 'swipe', true, [10, 20, 30, 40, 50, 60, 70], def.helpIntroNotTen]);
  // whatever she misses in the morning's three tens, 5 × 10 is never a filler, and 4 × 10 never one at the pile or in the warm-up
  for (let seed = 1; seed <= 200; seed++) {
    let x = (seed * 2654435761) >>> 0;
    const rnd = () => ((x = (Math.imul(x, 1103515245) + 12345) >>> 0) / 4294967296);
    const c2 = tensCat();
    for (const sid of ['ch05-pile', 'ch05-tens']) {
      const { def: d, state: st } = E.chapterLesson(c2, story, sid, 1, STORIES);
      for (let q; (q = E.counts.question(st));) {
        if (q.filler) assert.ok(!['4x10', '5x10'].includes(pairKey(q.a + 'x' + q.b)), 'seed ' + seed + ' ' + sid + ': ' + q.a + '×' + q.b);
        E.logAnswer(c2, E.counts.answer(st, E.questionDef(d, q, story, STORIES), rnd() < 0.5 ? q.answer + 1 : q.answer, 1500, 1).entry);
      }
    }
  }
});
function warm5() { return countsAt('ch05-tens')[0]; }

test('the nines, the Build notes’ tests: ten facts in the text’s order; every first ask and every retry plays the hop and the tuck and ends unlit, a filler and a Hollow round play neither; the words of each question; the tuck reaches 45 on its fifth tap with no number under any cat', () => {
  const def = story.counts['ch05-nines'];
  const rows = play(tensCat(), 'ch05-nines');
  assert.deepEqual(ks(rows), ['2x9', '9x10', '4x9', '9x1', '9x6', '3x9', '9x8', '5x9', '7x9', '9x9']);
  assert.deepEqual(rows.map(r => r.q.answer), [18, 90, 36, 9, 54, 27, 72, 45, 63, 81]);
  rows.forEach(r => assert.deepEqual([r.q.per, r.q.table, r.q.light], [9, 9, 'tuck'], r.k));
  // the picture as asked: the hop (ten claws lit on every cat, none tucked), the tuck (one curls in on each: nine lit), then unlit
  rows.forEach(r => {
    const g = r.q.groups, base = { table: 9, groups: g, per: 9, kind: undefined, layout: undefined, thought: undefined, who: r.k === '2x9' ? RIM5.slice(0, 2) : undefined, thing: 'life', things: 'lives' };
    assert.deepEqual(r.light.open, Object.assign({}, base, { highlight: g * 10, tuck: 0, tucked: 0 }), r.k + ': opens on the hop');
    assert.deepEqual(r.light.map(s => s.picture), [Object.assign({}, base, { highlight: g * 9, tuck: g, tucked: g }), Object.assign({}, base, { highlight: 0 })], r.k + ': the tuck, then unlit');
    assert.ok(r.light.every(s => s.wait > 500), 'each step can be seen');
    assert.deepEqual(r.picture, Object.assign({}, base, { highlight: 0 }), 'the still picture: nine out and one tucked');
  });
  // the words: the opener's hop and tuck spoken; ninety, four cats and six cats in words of their own; the rest ask for lives
  const ask = k => rows.find(r => r.k === k).prompt.map(p => p.label + ': ' + p.text).join(' | ');
  assert.equal(ask('2x9'), 'Tallyheart: Two cats. Hop by tens: twenty. Now tuck two in. How many lives?');
  assert.equal(ask('9x10'), 'Tallyheart: Ten cats. Ten tens make a hundred. Now tuck ten in.');
  assert.equal(ask('4x9'), 'Tallyheart: Four cats. Hop by tens. Then tuck four in.');
  assert.doesNotMatch(ask('4x9'), /forty|thirty|36|40/i, 'the steps named, and no number given');
  assert.equal(ask('9x6'), 'Tallyheart: Six cats. Six tens make sixty. Now tuck six in.');
  assert.deepEqual(['9x1', '3x9', '9x8', '5x9', '7x9', '9x9'].map(ask), ['One cat', 'Three cats', 'Eight cats', 'Five cats', 'Seven cats', 'Nine cats'].map(c => 'Tallyheart: ' + c + '. How many lives?'));
  // after a right answer: the lines the text gives five of them, praise dealt in order for the rest
  const said = k => { const r = rows.find(x => x.k === k); return r.balloons.length ? r.balloons.map(b => (b.who ? b.who + ': ' : '') + b.text).join(' | ') : r.line; };
  assert.equal(said('2x9'), 'tallyheart: Eighteen! Hop, then tuck.');
  assert.equal(said('9x10'), 'tallyheart: Ninety! Yesterday it was nine cats, ten claws each. Same ninety!');
  assert.equal(said('4x9'), 'tallyheart: Thirty-six! Now look. Three and six make nine. One and eight make nine. Every nines answer hides a nine!');
  assert.equal(said('9x6'), 'tallyheart: Fifty-four! Five and four. There’s your nine.');
  assert.equal(said('9x9'), 'tallyheart: EIGHTY-ONE! | murmurchime: Not mice.');
  const slow = play(tensCat(), 'ch05-nines', null, { all: 5000 });
  assert.deepEqual(['9x1', '3x9', '9x8', '5x9', '7x9'].map(k => slow.find(r => r.k === k).line), def.praise, 'the praise, dealt in order');
  assert.equal(rows.find(r => r.k === '9x1').line, 'You didn’t even have to hop that time.', 'a quick answer');
  // a filler shows the still picture (she has got it right already); a retry hops and tucks again
  const missLast = play(tensCat(), 'ch05-nines', { '9x9': [80] });
  assert.deepEqual(missLast.slice(-4).map(r => [r.k, r.q.light, r.light.length]), [['9x9✗', 'tuck', 2], ['F:9x1', null, 0], ['F:2x9', null, 0], ['R:9x9', 'tuck', 2]]);
  const everyMiss = play(tensCat(), 'ch05-nines', { '2x9': [17], '9x10': [80], '4x9': [40], '9x1': [10], '9x6': [60], '3x9': [28], '9x8': [71], '5x9': [50], '7x9': [62], '9x9': [80] });
  everyMiss.forEach(r => assert.deepEqual([r.q.light, r.light.length], r.q.filler ? [null, 0] : ['tuck', 2], r.k + ': the hop and the tuck on every first ask and every retry, never on a filler'));
  assert.equal(everyMiss.filter(r => r.q.retry).length, 10);
  // ... and so does every question of a Hollow round
  const done = tensCat(); done.lessons['ch05-nines'] = { finished: true, noHelp: true };
  const H = E.hollowStart(done, STORIES, 1, 9);
  assert.ok(!('light' in H.def) && H.state.queue.every(q => !q.light));
  for (let q; (q = E.counts.question(H.state));) { assert.deepEqual([q.light, E.lightSteps(H.def, q).length], [null, 0]); E.counts.answer(H.state, H.def, q.answer, 2000, 1); }
  // the nines fill their own gaps with the easiest of her right answers: after a missed 9 × 9, 9 × 1 and 2 × 9, never 7 × 9 or 9 × 8
  const seq = answers => ks(play(tensCat(), 'ch05-nines', answers));
  assert.deepEqual(seq({ '9x9': [80] }).slice(-4), ['9x9✗', 'F:9x1', 'F:2x9', 'R:9x9']);
  assert.deepEqual(seq({ '7x9': [62] }).slice(-4), ['7x9✗', '9x9', 'F:9x1', 'R:7x9']);
  assert.deepEqual(seq({ '9x9': [80, 80] }).slice(-7), ['9x9✗', 'F:9x1', 'F:2x9', 'R:9x9✗', 'F:3x9', 'F:4x9', 'R:9x9']);
  assert.ok(!seq({ '9x9': [80] }).some(k => /^F:(7x9|9x8)/.test(k)));
  // the tuck Tap: fifty claws lit and a big 50; each tap steps the number back; the fifth turns the page on 45
  const tap = ids.find(id => frames[id].skip && frames[id].skip.tuck), sk = frames[tap].skip;
  assert.deepEqual([sk.table, sk.groups, sk.tuck, sk.keep, sk.thing, sk.things, sk.who], [9, 5, true, true, 'claw', 'claws', RIM5]);
  const views = [0, 1, 2, 3, 4, 5].map(k => E.skipView(sk, k));
  assert.deepEqual(views.map(v => v.total), [50, 49, 48, 47, 46, 45]);
  assert.deepEqual(views.map(v => v.count), ['', '49…', '49… 48…', '49… 48… 47…', '49… 48… 47… 46…', '49… 48… 47… 46… 45!']);
  assert.deepEqual(views.map(v => v.done), [false, false, false, false, false, true]);
  views.forEach((v, k) => {
    assert.deepEqual(E.skipPicture(sk, k), { table: 9, groups: 5, per: 9, highlight: 50 - k, totals: false, next: k < 5, who: sk.who, thing: 'claw', things: 'claws', tuck: true, taps: k, tucked: k });
    assert.doesNotMatch(JSON.stringify(v.totals), /\b(9|18|27|36)\b/, 'no running total of nines anywhere');
  });
  assert.deepEqual(E.keptPicture(sk), { table: 9, groups: 5, per: 9, highlight: 45, totals: false, next: false, who: sk.who, thing: 'claw', things: 'claws', tuck: true, taps: 5, tucked: 5 });
  const w = E.skipWords(sk, 'tallyheart');
  assert.deepEqual([w.teacher, w.whisper, w.label, w.prompt], ['tallyheart', false, 'Tuck in the next cat’s claw.', '**Tap** the cats, left to right.']);
  // the page it turns to is the nines' Counts frame: the kept picture, 45 over it, until the lesson starts
  const cat = fresh(), nines = countsAt('ch05-nines')[0];
  read(cat, { stop: nines });
  const kept = E.keptSkip(story, nines, cat);
  assert.deepEqual([kept.id, kept.skip.tuck, E.skipReached(kept.skip), E.skipReached(E.skipInto(story, nines, cat))], [tap, true, 45, 45]);
  assert.equal(E.keptSkip(story, frames[nines].counts.next, cat), null, 'not past the lesson');
});

test('the nines’ help, the Build notes’ tests: hop by tens, then rub one line out for every cat; four openings, checked in order; the digits line only once the lesson has shown her; 18 and 36 in the sand, or 36 alone', () => {
  const HOP = 'That’s the hop! Now the tuck: one claw in for every cat.', ONE = 'So close! You tucked ONE claw. Tuck one in for every cat.';
  const NINE = 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.', CLOSE = 'Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.', FAR = CLOSE.replace('Close. ', '');
  const miss = answers => play(tensCat(), 'ch05-nines', answers);
  const first = (rows, k) => rows.find(r => r.k === k + '✗'), again = (rows, k) => rows.find(r => r.k === 'R:' + k + '✗');
  // 4 × 9: the whole help
  const four = first(miss({ '4x9': [40] }), '4x9').help;
  assert.deepEqual([four.intro, four.teacher, four.counter, four.ground, four.style, four.pair, four.tuck, four.hops], [HOP, 'tallyheart', 'tallyheart', 'sand', 'swipe', true, true, 4]);
  assert.deepEqual(four.nums, [10, 20, 30, 40, 39, 38, 37, 36], 'the strip: 10 · 20 · 30 · 40, then 39 · 38 · 37 · 36');
  assert.deepEqual(E.helpSteps(four), [{ n: 10, counted: 10 }, { n: 20, counted: 20 }, { n: 30, counted: 30 }, { n: 40, counted: 40 }, { n: 39, counted: 40, rubbed: 1 }, { n: 38, counted: 40, rubbed: 2 }, { n: 37, counted: 40, rubbed: 3 }, { n: 36, counted: 40, rubbed: 4 }]);
  // the four openings on 4 × 9 (its own line has not shown yet on a first ask, so 35 opens with "Close.")
  assert.equal(first(miss({ '4x9': [39] }), '4x9').help.intro, ONE);
  assert.equal(first(miss({ '4x9': [35] }), '4x9').help.intro, CLOSE);
  assert.equal(first(miss({ '4x9': [52] }), '4x9').help.intro, FAR, 'far off, and the digits line is not hers yet');
  // 9 × 6, the fifth fact: the 4 × 9 line has always shown by then
  assert.deepEqual([60, 59, 45, 52].map(a => first(miss({ '9x6': [a] }), '9x6').help.intro), [HOP, ONE, CLOSE, NINE]);
  assert.equal(first(miss({ '4x9': [35], '9x6': [52] }), '9x6').help.intro, NINE, 'shown by its miss line just as well');
  // 9 × 10, the second question: 80 is ten off (no "Close."), and no digits line before 4 × 9; on its retry, after it, the digits line
  const ninety = miss({ '9x10': [80, 80] });
  assert.deepEqual([first(ninety, '9x10').help.intro, again(ninety, '9x10').help.intro], [FAR, NINE]);
  assert.deepEqual(ks(ninety).slice(0, 5), ['2x9', '9x10✗', '4x9', '9x1', 'R:9x10✗']);
  // 2 × 9, the opener: 19 is the one-tuck slip; 17 is "Close." at first and the digits line on its retry
  assert.equal(first(miss({ '2x9': [19] }), '2x9').help.intro, ONE);
  const two = miss({ '2x9': [17, 17] });
  assert.deepEqual([first(two, '2x9').help.intro, again(two, '2x9').help.intro], [CLOSE, NINE]);
  // 9 × 1 has one cat and one number: never the digits line, never the one-tuck line
  const one = miss({ '9x1': [10] }), oneB = miss({ '9x1': [8] });
  assert.deepEqual([first(one, '9x1').help.intro, first(one, '9x1').help.nums, first(oneB, '9x1').help.intro], [HOP, [10, 9], CLOSE]);
  // 9 × 9 and 9 × 10 at their biggest: eighteen and twenty swipes, then nine or ten rubbed out
  const big = first(miss({ '9x9': [80] }), '9x9').help;
  assert.deepEqual([big.nums.length, big.nums[8], big.nums[9], big.nums[17]], [18, 90, 89, 81]);
  assert.deepEqual(first(miss({ '9x10': [80] }), '9x10').help.nums.length, 20);
  // in a Hollow round the nines line can open the help from the first question
  const cat = tensCat(); cat.lessons['ch05-nines'] = { finished: true, noHelp: true };
  const H = E.hollowStart(cat, STORIES, 1, 9);
  [[3, 9, 28], [9, 3, 28], [7, 9, 64], [9, 8, 71]].forEach(([a, b, given]) => {
    const st = E.counts.start(H.def, { facts: [[a, b]], mode: 'hollow', set: 'hollow-9s' }), q = E.counts.question(st);
    assert.equal(E.helpPlan(H.def, H.def, q, E.counts.answer(st, H.def, given, 2000, 1)).intro, NINE, a + ' × ' + b + ' answered ' + given);
  });
  // two answers in the sand: with 4 × 9's line, right or missed, 18 and 36 and never 90
  const clean = miss(null), r36 = clean.find(r => r.k === '4x9');
  assert.deepEqual([r36.shows, r36.res.shows], [[18, 36], { kind: 'answers', answers: [18, 36] }]);
  assert.ok(clean.every(r => r.k === '4x9' || r.shows === null), 'no other answer shows them');
  const m = miss({ '4x9': [40] }), mm = m.find(r => r.k === '4x9✗'), back = m.find(r => r.k === 'R:4x9');
  assert.equal(mm.line, 'Thirty-six. Now look. Three and six make nine. One and eight make nine. Every nines answer hides a nine! We’ll come back to that one.');
  assert.deepEqual([mm.shows, mm.res.requeued, mm.help.line], [[18, 36], true, mm.res.line]);
  assert.deepEqual([back.balloons.map(b => b.text), back.shows], [['Thirty-six! Three and six. There’s your nine.'], null], 'right on its retry: the short form');
  assert.equal(back.prompt[0].text, 'Here’s that one again. Four cats. Hop by tens. Then tuck four in.');
  // missed three times: the idea each time; "We'll come back" only while it does
  const thrice = miss({ '4x9': [40, 39, 35] }).filter(r => /4x9✗/.test(r.k));
  assert.deepEqual(thrice.map(r => [r.res.requeued, /Every nines answer hides a nine!/.test(r.line), /come back/.test(r.line), r.shows]), [[true, true, true, [18, 36]], [true, true, true, [18, 36]], [false, true, false, [18, 36]]]);
  assert.equal(thrice[2].line, 'Thirty-six. Now look. Three and six make nine. One and eight make nine. Every nines answer hides a nine!', 'a missed 4 × 9 ends its help on the idea, the third time too');
  // 2 × 9 missed: its retry is the very next question after 4 × 9, so eighteen is neither scratched nor said
  [null, [40]].forEach(fourth => {
    const rows = miss(Object.assign({ '2x9': [17] }, fourth ? { '4x9': fourth } : {})), i4 = rows.findIndex(r => /^4x9/.test(r.k)), r4 = rows[i4], retry = rows[i4 + 1];
    assert.equal(retry.k, 'R:2x9');
    assert.deepEqual(r4.shows, [36], '36 alone');
    assert.equal(fourth ? r4.line : r4.balloons[0].text, fourth ? 'Thirty-six. Now look. Three and six make nine. Every nines answer hides a nine! We’ll come back to that one.' : 'Thirty-six! Now look. Three and six make nine. Every nines answer hides a nine!');
    rows.slice(0, i4 + 1).forEach((r, i) => {
      assert.doesNotMatch(r.prompt.map(p => p.text).concat(r.line, r.balloons.map(b => b.text), r.shows || []).join(' '), /eighteen|\b18\b|One and eight/i, r.k);
      if (r.help && i > 0) assert.ok(!r.help.nums.slice(-1).includes(18), r.k);
    });
    assert.deepEqual(rows[0].help.nums, [10, 20, 19, 18], 'its own help counts it out');
    assert.deepEqual(retry.balloons.map(b => b.text), ['Eighteen! One and eight. There’s your nine.'], 'she finds the nine in her own answer');
  });
  // the lesson state remembers that the idea has been shown (saved mid-lesson, it still does)
  const L = E.chapterLesson(tensCat(), story, 'ch05-nines', 1, STORIES);
  ['18', '90'].forEach(a => E.counts.answer(L.state, L.def, a, 2000, 1));
  assert.ok(!L.state.shown);
  E.counts.answer(L.state, L.def, 36, 2000, 1);
  assert.equal(L.state.shown, true);
});

test('on the river, the Build notes’ tests: the fish answers are 14, 18 and 20; a miss is scratched on the log and its fillers are fish; no line of Patience’s follows a miss; Puddle borrows logs and bumps, never more than three; Wisp’s set is lettered in captions, with one line of Patience’s; no balloon is Tallyheart’s', () => {
  const clean = ['ch05-otter', 'ch05-bill', 'ch05-catch'].map(id => play(tensCat(), id));
  assert.deepEqual(clean.map(rows => rows.map(r => [r.k, r.q.answer])), [[['7x2', 14]], [['9x2', 18]], [['4x5', 20]]]);
  // Riffle's fish: his wail is the question (under the frame's two balloons); right: he falls over backwards
  assert.deepEqual(clean[0][0].prompt.map(p => p.label + ': ' + p.text), ['Riffle: How many fish is THAT?']);
  assert.deepEqual(clean[0][0].balloons.map(b => b.who + ': ' + b.text), ['riffle: FOURTEEN?', 'riffle: For YES and NO?']);
  assert.deepEqual(clean[0][0].picture, { table: 2, groups: 7, per: 2, highlight: 0, kind: 'fish', layout: 'pairs', thought: true, who: undefined, thing: 'fish', things: 'fish' }, 'Patience’s thought cloud: seven pairs, none lit');
  assert.equal(castOf(frames[countsAt('ch05-otter')[0]].counts.next, 'riffle')[0].pose, 'fall', 'the next panel: he has fallen over backwards');
  assert.deepEqual(clean[1][0].prompt.map(p => (p.label || 'caption') + ': ' + p.text), ['Patience: Nine answers.', 'Patience: Two fish for every answer.', 'caption: How many fish?']);
  assert.deepEqual(clean[1][0].balloons.map(b => b.who + ': ' + b.text), ['patience: Eighteen.', 'patience: Before sunset.']);
  assert.deepEqual([clean[1][0].picture.groups, clean[1][0].picture.thought, clean[1][0].line], [9, true, ''], 'the nine pairs she watched land; nobody praises her at the marsh');
  assert.deepEqual(clean[2][0].prompt.map(p => [p.kind, p.label, p.text]), [['caption', null, 'Four strings, five fish on every string. How many fish?']]);
  assert.deepEqual(clean[2][0].balloons.map(b => b.who + ': ' + b.text), ['riffle: TWENTY!', 'player: Eighteen for Patience. Two to spare.']);
  assert.deepEqual([clean[2][0].q.light, clean[2][0].light.map(s => s.picture.highlight), clean[2][0].picture.layout], ['groups', [5, 10, 15, 20], 'strings'], 'four strings, lit a string at a time');
  // a miss, and a second miss, in each
  const cases = [['ch05-otter', '7x2', [15, 13], ['7x2✗', 'F:2x1', 'F:2x2', 'R:7x2✗', 'F:3x2', 'F:4x2', 'R:7x2'], 'Scratch it on the log! Two for every answer.', 'answer', 2],
    ['ch05-bill', '9x2', [20, 16], ['9x2✗', 'F:2x1', 'F:2x2', 'R:9x2✗', 'F:3x2', 'F:4x2', 'R:9x2'], 'Scratch it on the log! Two for every answer.', 'answer', 2],
    ['ch05-catch', '4x5', [25, 16], ['4x5✗', 'F:1x5', 'F:5x2', 'R:4x5✗', 'F:5x3', 'F:1x5', 'R:4x5'], 'Scratch it on the log! Five for every string.', 'string', 5]];
  cases.forEach(([id, k, wrong, seq, intro, unit, per]) => {
    const rows = play(tensCat(), id, { [k]: wrong }), def = story.counts[id];
    assert.deepEqual(ks(rows), seq, id);
    rows.forEach((r, i) => {
      assert.equal(r.teacher, 'riffle', id + ' ' + r.k);
      // a borrowed pair takes nothing from its lender but the pair: this set's picture, this set's words
      assert.deepEqual([r.picture.kind, r.picture.layout, r.picture.thing, r.picture.per, r.picture.table], [def.picture.kind, def.picture.layout, 'fish', per, def.table], id + ' ' + r.k);
      if (r.q.filler) {
        assert.match(r.prompt[0].text, new RegExp('^An easy one! (One|Two|Three|Four) ' + unit + 's?\\. How many fish\\?$'), id + ' ' + r.k);
        assert.deepEqual([r.prompt.length, r.prompt[0].label, r.line, r.q.light], [1, 'Riffle', '', null], 'no praise at the marsh, and nothing lights by itself');
        assert.ok(r.q.groups <= (id === 'ch05-catch' ? 3 : 4), 'never more strings than he caught: ' + r.k);
      }
      if (r.help) {
        assert.deepEqual([r.help.intro, r.help.teacher, r.help.counter, r.help.ground, r.help.line], [intro, 'riffle', 'player', 'log', r.res.requeued ? 'Phew. That one again in a minute.' : 'There. Now we’ve counted it.'], id + ' ' + r.k);
        assert.equal(E.sandOpts(r.help, r.help.step).ground, 'log', 'never in mud (ReedClan’s) or sand');
      }
      // after a miss nothing is Patience's, the retry's opening included (her right lines are an answer: they stay hers)
      if (i > 0) assert.ok(!r.prompt.some(p => p.who === 'patience'), id + ' ' + r.k);
      assert.ok(r.teacher !== 'tallyheart' && !r.prompt.some(p => p.who === 'tallyheart') && !r.balloons.some(b => b.who === 'tallyheart'), id + ' ' + r.k);
    });
    assert.equal(rows[3].prompt[0].text.split(' ').slice(0, 3).join(' '), 'The fish again!', 'a retry is his');
    assert.equal(rows[3].prompt[0].label, 'Riffle');
    saidIn(rows).forEach(line => { assert.ok(!DEFAULTS.includes(line), id + ': an engine default: ' + line); assert.doesNotMatch(line, /\bfirst\b|\blives?\b/i, id + ': ' + line); });
  });
  assert.equal(play(tensCat(), 'ch05-catch', { '4x5': [25] })[0].help.style, 'swipe', 'the fives are swiped, on the log as anywhere');
  assert.deepEqual(play(tensCat(), 'ch05-otter', { '7x2': [15] })[3].balloons.map(b => b.text), ['FOURTEEN?', 'For YES and NO?'], 'a right retry keeps the fact’s own right lines');
  const lentBack = play(tensCat(), 'ch05-otter', { '7x2': [15], '2x1': [3] });
  assert.deepEqual(ks(lentBack), ['7x2✗', 'F:2x1✗', 'F:2x2', 'R:7x2', 'R:2x1']);
  assert.deepEqual([lentBack[4].prompt[0].text, lentBack[4].line, lentBack[1].help.ground], ['An easy one! One answer. How many fish?', 'You GOT it!', 'log'], 'a borrowed one coming back opens as it did, and is his to cheer');
  // Puddle
  const p = play(tensCat(), 'ch05-puddle', { '4x10': [44, 30] });
  assert.deepEqual(ks(p), ['4x10✗', 'F:1x10', 'F:10x2', 'R:4x10✗', 'F:10x3', 'F:1x10', 'R:4x10']);
  assert.deepEqual(p[0].prompt.map(x => x.label + ': ' + x.text), ['The big-footed dragon: Four logs in this raft. I’ve bumped my head ten times on every one. How many bumps?'], 'he has not said his name yet');
  assert.deepEqual(p[0].picture, { table: 10, groups: 4, per: 10, highlight: 0, kind: 'bumps', layout: undefined, thought: undefined, who: undefined, thing: 'bump', things: 'bumps' });
  assert.deepEqual([p[0].help.intro, p[0].help.picture, p[0].help.ground, p[0].help.counter, p[0].help.nums, p[0].help.line], ['Count my bumps! You hop!', true, null, 'player', [10, 20, 30, 40], 'There! Let’s do that one again.']);
  assert.deepEqual(E.helpSteps(p[0].help).map(s => E.lessonPicture(p[0].D, p[0].q, s.counted).highlight), [10, 20, 30, 40], 'the same picture, a log more lit at each hop');
  assert.deepEqual(p.filter(r => r.q.filler).map(r => [r.prompt[0].text, r.picture.kind, r.picture.groups, r.line]),
    [['Do another one! One log. How many bumps?', 'bumps', 1, 'YES!'], ['Do another one! Two logs. How many bumps?', 'bumps', 2, 'You’re GOOD at bumps!'], ['Do another one! Three logs. How many bumps?', 'bumps', 3, 'YES!'], ['Do another one! One log. How many bumps?', 'bumps', 1, 'You’re GOOD at bumps!']]);
  assert.ok(p.every(r => r.q.groups <= 4 && r.teacher === 'puddle' && (!r.q.filler || r.q.groups <= 3)), 'never more logs than the raft has');
  assert.equal(p[3].prompt[0].text, 'My bumps again! Four logs, ten bumps on every one. How many bumps?');
  assert.deepEqual(p[6].balloons.map(b => b.who + ': ' + b.text), ['puddle: FORTY!', 'puddle: No wonder it hurts.']);
  const p3 = play(tensCat(), 'ch05-puddle', { '4x10': [44, 30, 14] });
  assert.equal(p3.filter(r => /4x10✗/.test(r.k))[2].line, 'There! All my bumps, counted.', 'the last miss, in his words');
  assert.equal(play(tensCat(), 'ch05-puddle', { '4x10': [44], '1x10': [1] }).find(r => r.k === 'R:1x10').line, 'You DID it!');
  // (his riddle is never lent to a cat who is struggling with tens an hour before: 4 × 10 is in the pile's and the warm-up's avoid lists)
  // Wisp: nobody speaks in her set but Patience, once
  const w = play(tensCat(), 'ch05-wisp', { '7x1': [14, 8] });
  assert.deepEqual(ks(w), ['7x1✗', 'F:3x1', 'F:1x5', 'R:7x1✗', 'F:6x1', 'F:3x1', 'R:7x1']);
  w.forEach(r => {
    assert.equal(r.teacher, 'caption', r.k);
    r.prompt.forEach(x => assert.deepEqual([x.kind, x.who, x.label], ['caption', undefined, null], r.k + ': ' + x.text));
    r.balloons.forEach(b => assert.equal(b.kind, 'caption'));
    assert.deepEqual([r.picture.kind, r.picture.per, r.picture.thing], ['herons', 1, 'leg in the water']);
    if (r.help) assert.deepEqual([r.help.intro, r.help.says, r.help.counter, r.help.picture, r.help.ground, r.help.teacher], ['Look again. One leg each.', 'patience', 'player', true, null, 'caption']);
  });
  assert.deepEqual(w[0].prompt.map(x => x.text), ['Seven herons, each standing on one leg. How many legs in the water?']);
  assert.deepEqual(w[0].help.nums, [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(w.slice(1, 3).map(r => [r.prompt.map(x => x.text), r.picture.groups]), [[['She draws another one.', 'Three herons. How many legs in the water?'], 3], [['She draws another one.', 'Five herons. How many legs in the water?'], 5]], 'the two she draws are three herons and five');
  assert.deepEqual(w[3].prompt.map(x => x.text), ['She taps the seven herons again.', 'Seven herons, each standing on one leg. How many legs in the water?']);
  assert.deepEqual([w[0].line, w[3].line, w[6].balloons.map(b => b.text), w[1].line], ['She points at them again.', 'She points at them again.', ['She nods. Once.'], '']);
  assert.equal(play(tensCat(), 'ch05-wisp', { '7x1': [14, 8, 6] }).filter(r => /7x1✗/.test(r.k))[2].line, 'She counts them with you, one by one.');
  assert.equal(play(tensCat(), 'ch05-wisp', { '7x1': [14], '3x1': [4] }).find(r => r.k === 'R:3x1').line, 'She nods.');
  // neither set ever falls back on a sentence of the engine's (a teacher's)
  [p, p3, w].forEach(rows => saidIn(rows).forEach(line => assert.ok(!DEFAULTS.includes(line), line)));
  // one question each, extra to the chapter's sixteen
  assert.deepEqual([play(tensCat(), 'ch05-puddle').length, play(tensCat(), 'ch05-wisp').length], [1, 1]);
  // reading time: a first ask read under a prompt says nothing about speed, so only a miss makes it hard for a later warm-up
  [['ch05-pile', 3, 10], ['ch05-tens', 5, 10], ['ch05-nines', 2, 9], ['ch05-nines', 9, 10], ['ch05-nines', 4, 9], ['ch05-nines', 9, 6], ['ch05-otter', 7, 2], ['ch05-bill', 9, 2], ['ch05-catch', 4, 5], ['ch05-puddle', 4, 10], ['ch05-wisp', 7, 1]]
    .forEach(([set, a, b]) => assert.equal(E.readFirst({ set, a, b }, STORIES), true, set + ' ' + a + 'x' + b));
  [['ch05-nines', 9, 1], ['ch05-nines', 3, 9], ['ch05-nines', 9, 8], ['ch05-nines', 5, 9], ['ch05-nines', 7, 9], ['ch05-nines', 9, 9]].forEach(([set, a, b]) => assert.equal(E.readFirst({ set, a, b }, STORIES), false, set + ' ' + a + 'x' + b));
});

test('the Training Hollow after chapter 5: it offers “Nine lives · the 9s” (never the pile, the warm-up, the fish or the riddles); Tallyheart’s lines there differ for the 5s, the 10s and the 9s; the tree has five marks', () => {
  const cat = fresh();
  read(cat, { up: true, raft: 'lean', wait: 3, first: 'otters' });
  assert.deepEqual(E.learnedCounts(cat, STORIES).map(c => [c.table, c.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines']], 'in the order they are taught');
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(c => c.name), ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s', 'Nine lives · the 9s']);
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, STORIES).opts.marks, 5);
  const lines = tb => { const d = E.hollowDef(STORIES, tb); return [E.hollowRoundLine(d), E.hollowGlowNote(d, true), E.hollowWord(d)]; };
  assert.deepEqual(lines(9), ['A round of nines. Ready? Here we go.', 'Look! Your nines claw mark on the tree is glowing.', 'nines']);
  [0, 1, 2].forEach(i => assert.equal(new Set([lines(5)[i], lines(10)[i], lines(9)[i]]).size, 3, 'the 5s, the 10s and the 9s never read the same'));
  const def = E.hollowDef(STORIES, 9);
  ['light', 'fillOrder', 'facts', 'firstPrompt', 'fillFrom', 'ground', 'help', 'helpSays', 'fillPicture'].forEach(k => assert.ok(!(k in def), k));
  assert.deepEqual([def.id, def.table, def.teacher, def.thing, def.unit, def.helpIntroNotNine], ['hollow-9s', 9, 'tallyheart', 'life', 'cat', story.counts['ch05-nines'].helpIntroNotNine]);
  const r = E.hollowStart(cat, STORIES, 1, 9), asked = [];
  for (let q; (q = E.counts.question(r.state));) {
    asked.push(pairKey(q.a + 'x' + q.b));
    assert.deepEqual([q.table, q.per, q.light], [9, 9, null]);
    assert.match(E.promptLines(r.def, r.def, q)[0].text, /^(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten) cats?\. How many lives\?$/);
    E.counts.answer(r.state, r.def, q.answer, 2000, 1);
  }
  assert.deepEqual(asked.sort(), ['1x9', '2x9', '3x9', '4x9', '5x9', '6x9', '7x9', '8x9', '9x10', '9x9'].sort());
  assert.equal(E.countFor(9, STORIES).setId, 'ch05-nines');
  assert.deepEqual([E.countFor(10, STORIES).setId, E.countFor(2, STORIES).setId, E.countFor(5, STORIES).setId, E.countFor(1, STORIES).setId], ['ch04-tens', 'ch02-ears', 'ch03-claws', 'ch01-tails'], 'chapter 5’s other sets teach nothing new');
});

/* ------------------------------------------------------------------ her Case File */

test('her Case File: the nine cards as the text’s table has them; given once, in order, each eye straight after a Tap; 5, or 6 for a noticing cat or a climber, and one more for each dragonet; the same cards in both orders', () => {
  assert.deepEqual(Object.keys(story.cards), CARD_IDS);
  const TABLE = {
    'prints-pile': ['eye', 'Tiny prints in the dug earth behind the pile.'],
    'puddle-paws': ['ear', 'Puddle says clever little paws picked up mice on the storm night.'],
    'otter-fox': ['ear', 'The old otter says the fox told him the dragon story.'],
    fur: ['eye', 'Thin brown fur at the Crossing. Not cat. Not otter. Not fox.'],
    'heron-no-moon': ['ear', 'Patience says there was NO moon on the storm night.'],
    'heron-shapes': ['ear', 'Patience says two small shapes crossed her mud, carrying something.'],
    'prints-marsh': ['eye', 'Tiny prints in the marsh mud. Much smaller than a cat’s.'],
    'prints-tracks': ['eye', 'The tiny prints run toward the train tracks.'],
    'wisp-fox': ['ear', 'Wisp drew a fox dropping something glittering in the reeds.']
  };
  CARD_IDS.forEach(cid => {
    const c = story.cards[cid];
    assert.deepEqual([c.mark, c.line], TABLE[cid], cid);
    assert.ok(c.line.split(/\s+/).length <= 12, cid + ': ' + c.line.split(/\s+/).length + ' words');
    assert.deepEqual(Object.keys(c).filter(k => !['mark', 'line', 'when', 'link'].includes(k)), [], cid + ': keys');
    assert.ok(!('answers' in c), cid + ': this chapter adds no answers (chapter 10’s)');
    assert.doesNotMatch(c.line, /goose|gets bigger|himself told him|soggy|needle|weasel/i, cid);
  });
  const mean = CARD_IDS.reduce((n, cid) => n + story.cards[cid].line.split(/\s+/).length, 0) / CARD_IDS.length;
  assert.ok(mean > 8 && mean < 11, 'a little under ten words a card: ' + mean.toFixed(1));
  assert.deepEqual(CARD_IDS.filter(cid => story.cards[cid].mark === 'eye'), ['prints-pile', 'fur', 'prints-marsh', 'prints-tracks'], 'the eyes: every one something she tapped');
  // the two a dragonet gives are shown in her file only once his scene is finished
  assert.deepEqual(CARD_IDS.filter(cid => story.cards[cid].when).map(cid => [cid, story.cards[cid].when]), [['puddle-paws', { foundPuddle: true }], ['wisp-fox', { foundWisp: true }]]);
  // four pairs lie touching, none of them a claim with its answer: a link names its partners itself
  assert.deepEqual(CARD_IDS.filter(cid => story.cards[cid].link).map(cid => [cid, story.cards[cid].link]), [
    ['heron-no-moon', { with: ['fox-moon'], line: 'One of them is wrong.' }],
    ['heron-shapes', { with: ['squall-shapes'], line: 'Two saw them. The same two shapes?' }],
    ['prints-marsh', { with: ['prints-pile'], line: 'The same prints.' }],
    ['prints-tracks', { with: ['squall-shapes'], line: 'Both lead toward the tracks.' }]]);
  assert.ok(!('answers' in ch04.cards['fox-moon']), 'the claim is not answered yet: Tallyheart says “not yet”');
  assert.deepEqual(ch04.cards['fox-flew'].answers, ['cant-fly'], 'chapter 4’s link is as it was');
  // where each is given: one frame each, in this order (a scene read in one of two places gives its card in both; the marsh's prints on either of their two frames)
  const given = ids.filter(id => frames[id].card).map(id => [frames[id].card, id]);
  given.forEach(([card, id]) => assert.equal(typeof card, 'string', id + ': one card, by its id'));
  assert.deepEqual(given.map(g => g[0]), ['prints-pile', 'squall-shapes', 'puddle-paws', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'prints-marsh', 'prints-tracks', 'wisp-fox', 'puddle-paws', 'otter-fox', 'fur']);
  const at1 = cid => given.filter(g => g[0] === cid).map(g => g[1]);
  assert.deepEqual([at1('puddle-paws'), at1('otter-fox'), at1('fur')], [[UNDER1[6], UNDER2[6]], [OTTERS1.find(id => frames[id].card === 'otter-fox'), OTTERS2.find(id => frames[id].card === 'otter-fox')], [OTTERS1[OTTERS1.length - 1], OTTERS2[OTTERS2.length - 1]]]);
  assert.equal(E.cardDef('squall-shapes', story, PC.story).line, 'Squall says two skinny shapes carry something to the tracks.', 'chapter 4’s card, given on the roof');
  // a card may be given on the frame whose balloon said it (Puddle's "clever little paws" is the panel before "Our PILE!")
  assert.match(T(UNDER1[5]), /something with clever little paws, picking them up/);
  // in a reading: her new cards, once each, in the order of her day; every eye straight after a Tap
  const counts = new Set();
  for (const c of SOME) {
    const byOrder = {};
    for (const first of FLAGS5.ch5First) {
      const cat = fresh(c.flags), before = cat.cards.length, name = comboName(c) + ' ' + first;
      const rows = read(cat, Object.assign({}, c.o, { first }));
      const got = cat.cards.slice(before).map(k => k.id), was = found(c);
      const want = 5 + (c.flags.specialty === 'noticing' || c.flags.specialty === 'climbing' ? 1 : 0) + (was.roof ? 1 : 0) + (was.puddle ? 1 : 0) + (was.wisp ? 1 : 0);
      assert.equal(got.length, want, name + ': ' + got.join(' '));
      assert.equal(new Set(cat.cards.map(k => k.id)).size, cat.cards.length, name + ': no card twice');
      assert.ok(got.every(id => cat.cards.find(k => k.id === id).chapter === 'ch05'), name);
      rows.forEach((r, i) => r.cards.filter(k => k.mark === 'eye' && !k.held).forEach(k => assert.ok(rows[i - 1].kind === 'scratch', name + ': ' + k.id + ' at ' + r.id + ' comes straight after a Tap')));
      rows.forEach(r => r.cards.forEach(k => assert.equal(k.showLine, true, r.id + ': a new card shows its line')));
      // her file at the end: everything she holds (a card hidden by its `when` would be missing)
      assert.deepEqual(E.cards(cat, STORIES).map(k => k.id).sort(), cat.cards.map(k => k.id).sort(), name);
      byOrder[first] = got.slice().sort();
      counts.add(got.length);
    }
    assert.deepEqual(byOrder.otters, byOrder.heron, comboName(c) + ': the same cards in both orders');
  }
  assert.deepEqual([...counts].sort(), [5, 6, 7, 8, 9]);
  // only a noticing cat holds prints-pile, only a climber prints-tracks
  const sharp = reading({ specialty: 'noticing' }), climb = reading({ specialty: 'climbing' }), plain = reading({ specialty: 'sneaking' });
  assert.deepEqual([sharp, climb, plain].map(r => [E.hasCard(r.cat, 'prints-pile'), E.hasCard(r.cat, 'prints-tracks')]), [[true, false], [false, true], [false, false]]);
  assert.deepEqual(rowAt(sharp.rows, ids.find(id => frames[id].card === 'prints-pile')).cards.map(k => [k.id, k.mark, k.showLine]), [['prints-pile', 'eye', true]]);
});

test('her Case File, the pairs that lie touching: fox-moon and heron-no-moon from the marsh on; squall-shapes and heron-shapes whenever she holds both; the same prints for a noticing cat; a climber who has met Squall has three in a row', () => {
  const links = cat => E.caseFile(cat, STORIES).links.map(l => [l.cards.map(c => c.id).join(' + '), (l.lines || [l.line]).join(' | ')]);
  const near = (cat, a, b) => E.fileNeighbours(E.caseFile(cat, STORIES), a, b);
  const NO = F(/^One eye shuts\. No\./), before = ids[at(NO) - 1];
  const to = (flags, o, stop) => { const cat = fresh(flags); read(cat, Object.assign({ first: 'heron' }, o, { stop })); return cat; };
  // before the marsh nothing new touches; from the frame that gives the heron's card on, the two moons do
  const early = to({}, {}, NO);
  assert.ok(E.hasCard(early, 'heron-no-moon') && near(early, 'fox-moon', 'heron-no-moon'));
  assert.deepEqual(links(early), [['fox-moon + heron-no-moon', 'One of them is wrong.']]);
  assert.ok(!near(to({}, {}, before), 'fox-moon', 'heron-no-moon'), 'not before she holds both');
  const plain = reading({ specialty: 'sneaking' }).cat;
  assert.deepEqual(links(plain), [['fox-moon + heron-no-moon', 'One of them is wrong.']]);
  assert.deepEqual(E.caseFile(plain, STORIES).groups.map(g => [g.mark, g.cards.map(c => c.id)]),
    [['eye', ['four-a-night', 'tidy', 'scale', 'sprinkle-scales', 'cant-fly', 'fur', 'prints-marsh']], ['ear', ['fox-flew', 'otter-fox', 'heron-shapes']]], 'the linked cards leave their groups');
  // two ears that agree: a cat who has met Squall (in chapter 4, or this morning)
  const met = reading({ specialty: 'sneaking', foundSquall: true }).cat;
  assert.deepEqual(links(met), [['fox-moon + heron-no-moon', 'One of them is wrong.'], ['squall-shapes + heron-shapes', 'Two saw them. The same two shapes?']]);
  assert.ok(near(met, 'squall-shapes', 'heron-shapes') && !near(plain, 'squall-shapes', 'heron-shapes'));
  assert.ok(near(reading({ specialty: 'sneaking' }, { up: true }).cat, 'squall-shapes', 'heron-shapes'));
  // a noticing cat: the same prints, two eyes she compared herself; and chapter 4's link beside them, as it was
  const sharp = reading({ specialty: 'noticing' }).cat;
  assert.deepEqual(links(sharp), [['cant-fly + fox-flew', 'They can’t both be true.'], ['fox-moon + heron-no-moon', 'One of them is wrong.'], ['prints-pile + prints-marsh', 'The same prints.']]);
  assert.ok(near(sharp, 'prints-pile', 'prints-marsh') && near(sharp, 'cant-fly', 'fox-flew') && !near(sharp, 'fox-flew', 'fox-moon'));
  // a climber who has met Squall: his card lies between the heron's two shapes and her own sight from the pole
  const climb = reading({ specialty: 'climbing', foundSquall: true }).cat;
  assert.deepEqual(links(climb), [['fox-moon + heron-no-moon', 'One of them is wrong.'], ['prints-tracks + squall-shapes + heron-shapes', 'Both lead toward the tracks. | Two saw them. The same two shapes?']]);
  assert.ok(near(climb, 'prints-tracks', 'squall-shapes') && near(climb, 'squall-shapes', 'heron-shapes') && !near(climb, 'prints-tracks', 'heron-shapes'), 'the two that lie side by side touch');
  // a climber who has not met him holds the card with nothing to lay it beside
  const alone = reading({ specialty: 'climbing' }).cat;
  assert.ok(E.hasCard(alone, 'prints-tracks') && links(alone).length === 1 && !near(alone, 'prints-tracks', 'squall-shapes'));
  // every card in a link is counted once, and none is lost
  [plain, met, sharp, climb, alone].forEach(cat => {
    const Fl = E.caseFile(cat, STORIES), all = Fl.groups.reduce((a, g) => a.concat(g.cards), []).concat(Fl.links.reduce((a, l) => a.concat(l.cards), [])).map(c => c.id);
    assert.deepEqual(all.slice().sort(), E.cards(cat, STORIES).map(c => c.id).sort());
    assert.equal(new Set(all).size, all.length);
  });
  // her nest at bedtime shows today's bark with the rest: her own cards, in her file's order (the art
  // keeps the two about Sprinkle under the moss: `hidden`, as chapter 4 left them)
  const nest = E.resolveScene(frames[NEST].scene, sharp, STORIES).opts;
  assert.deepEqual([nest.bark.map(c => c.picture), nest.hidden], [E.cards(sharp, STORIES).map(c => c.picture || c.id), true]);
  assert.ok(nest.bark.length === 14 && ['prints-pile', 'fur', 'prints-marsh', 'heron-no-moon'].every(id => nest.bark.some(c => c.picture === id)), 'today’s bark goes along the mossy edge');
});

/* ------------------------------------------------------------------ the optional scenes */

test('the roof, offered again, through the engine: the offer for a cat who has not met Squall, and with chapter 4’s labels for one who met him here; never for one who met him in chapter 4, and never straight after the roof; Back before its last frame, then “Not today”, leaves no flag, no page and no card', () => {
  // a cat who has not met him: the roar, "still up there", and chapter 4's choice, worded for today
  const freshCat = fresh({ specialty: 'sneaking' }), offer = read(freshCat, { stop: CROSSING });
  assert.deepEqual(idsOf(offer).slice(-3), [TOWER, NOT[0], CROSSING]);
  const o1 = rowAt(offer, TOWER);
  assert.deepEqual([o1.sfx, o1.caps, o1.options], ['RAWWWRRR… hic!', ['From the tallest tower:', 'Sprinkle’s littlest brother is still up there.'], ['Go up and find him. The river can wait a little.', 'Not today. Riffle is waiting.']]);
  assert.deepEqual(rowAt(offer, NOT[0]).say, [{ who: 'waffles', label: 'Princess Waffles', text: 'AGAIN, Muffin?', kind: 'shout' }]);
  assert.ok(!freshCat.flags.foundSquall && !freshCat.flags.ch5Roof);
  // a climber reads her own line there too
  assert.deepEqual(rowAt(read(fresh({ specialty: 'climbing' }), { stop: TOWER }), TOWER).caps, ['From the tallest tower:', 'Sprinkle’s littlest brother is still up there.', 'Balcony, balcony, balcony, roof. You could still climb that.']);
  // going up runs chapter 4's roof (a climber climbs, everyone else rides the little room), sets both
  // flags on its last frame, and goes to the Crossing: the offer is not read again
  const up = fresh({ specialty: 'sneaking' }), roof = read(up, { up: true, stop: frames[CROSSING].next });
  const walked = idsOf(roof).slice(idsOf(roof).indexOf(TOWER));
  assert.deepEqual(walked, [TOWER].concat(UP.slice(1), [CROSSING, frames[CROSSING].next]), 'the little room, the roof, the Crossing, “I found Squall!”');
  assert.deepEqual([up.flags.foundSquall, up.flags.ch5Roof], [true, true]);
  const riddle = rowAt(roof, countsAt('ch04-riddle')[0]);
  assert.deepEqual(riddle.lesson.map(r => r.k), ['7x5'], 'chapter 4’s riddle, as built there');
  assert.equal(riddle.lesson[0].prompt[0].label, 'The little dragon', 'chapter 5 carries the same `names`');
  assert.deepEqual(riddle.say.map(b => b.label), ['The little dragon', 'Moonpaw', 'The little dragon']);
  assert.ok(E.hasCard(up, 'squall-shapes') && up.cards.find(c => c.id === 'squall-shapes').chapter === 'ch05', 'chapter 4’s card, given here');
  assert.ok(up.lessons['ch04-riddle'] && up.lessons['ch04-riddle'].finished);
  assert.deepEqual(idsOf(read(fresh({ specialty: 'climbing' }), { up: true, stop: UP[3] })).slice(-3), [TOWER, UP[0], UP[3]], 'a climber takes the outside');
  assert.match(rowAt(roof, frames[CROSSING].next).say.map(b => b.text).join(' '), /^I found Squall! Sprinkle’s littlest brother! He sees two skinny shapes go to the tracks\. Every night\.$/);
  // Back from any frame of the roof before its last, then "Not today": no flag, and the card is out of her file
  const before = UP.slice(1, -1), card = UP.find(id => frames[id].card === 'squall-shapes');
  before.forEach(stop => {
    const half = fresh({ specialty: 'sneaking' });
    read(half, { up: true, stop });
    if (at(stop) >= at(card)) assert.ok(E.cards(half, STORIES).some(c => c.id === 'squall-shapes'), stop + ': on the roof, the card is going into her file');
    while (half.frame !== TOWER) assert.ok(E.back(half, story), stop);
    const rest = read(half, { up: false });
    assert.ok(!half.flags.foundSquall && !half.flags.ch5Roof, stop);
    assert.ok(!E.cards(half, STORIES).some(c => c.id === 'squall-shapes'), stop + ': no card in her file');
    assert.ok(!E.dragonets(half, STORIES).found.some(d => d.id === 'squall'), stop + ': no page for him in her book');
    assert.doesNotMatch(readWords(rest.slice(1)), /Squall/, stop + ': nothing afterwards says his name');
    assert.match(readWords(rest), /…hic! Sprinkle’s littlest brother is still up there\./, stop + ': bedtime’s hiccup, for a cat who has still not met him');
  });
  // a cat who met him in chapter 4 reads no screen here: from "ask your river" straight to the Crossing
  const met = fresh({ specialty: 'sneaking', foundSquall: true }), straight = idsOf(read(met, { stop: RULES }));
  const river = F(/^Now go and ask your river\./), rules = RULES;
  assert.deepEqual(straight.slice(-3), [river, CROSSING, rules], 'no offer, and no “I found Squall!” (she told Riffle yesterday)');
  // a second reading by a cat who met him here: the roar and the choice, with the labels of a cat who knows him
  read(up, { up: true });
  E.startChapter(up, story, 9000);
  const again = read(up, { up: false, stop: rules, t: 9000 }), o2 = rowAt(again, TOWER);
  assert.deepEqual([o2.caps, o2.options, o2.sfx], [['From the tallest tower:'], ['Go up and see Squall again.', 'Not today. He’s guarding.'], 'RAWWWRRR… hic!']);
  assert.deepEqual(idsOf(again).slice(-6), [TOWER, NOT[0], CROSSING, frames[CROSSING].next, frames[frames[CROSSING].next].next, rules], 'either pick is followed by “I found Squall!”: it reads the flag');
  assert.equal(up.cards.filter(c => c.id === 'squall-shapes').length, 1);
});

test('Puddle, through the engine: found after the Roar, she never reads the slip; one who did not reads it exactly once; Back from any frame of “Under the raft” before its last, then “Look up” and later “Puddles. Fine.”, leaves no foundPuddle, no page and no puddle-paws card, and nothing afterwards says “Puddle”; a second reading has its own labels', () => {
  // found after the Roar: the scene, its riddle, its card, the flag on its last frame; no slip later
  const a = reading({ specialty: 'sneaking' }, { raft: 'lean', first: 'otters' });
  assert.deepEqual(a.ids.filter(id => [RAFT, SLIP, WITNESS, POINTING].concat(UNDER1, UNDER2).includes(id)), [RAFT].concat(UNDER1, [WITNESS]));
  assert.deepEqual([a.cat.flags.foundPuddle, E.hasCard(a.cat, 'puddle-paws'), !!a.cat.lessons['ch05-puddle']], [true, true, true]);
  assert.ok(UNDER1.slice(0, 7).concat(UNDER2.slice(0, 7)).every(id => !frames[id].sets), 'never the foot, never a choice: the flag is the last frame’s');
  // not found after the Roar: the slip, exactly once; asking him runs the same scene in late light
  const b = reading({ specialty: 'sneaking' }, { raft: 'ask', first: 'otters' });
  assert.deepEqual(b.ids.filter(id => [RAFT, SLIP, POINTING, BUBBLES2, frames[RAFT].choice.options[1].next].concat(UNDER1, UNDER2).includes(id)), [RAFT, frames[RAFT].choice.options[1].next, SLIP, POINTING].concat(UNDER2, [BUBBLES2]));
  assert.deepEqual(rowAt(b.rows, POINTING).say.map(x => x.text), ['I promised Granny I wouldn’t TELL. I’m only POINTING.']);
  assert.deepEqual(rowAt(b.rows, UNDER2[3]).lesson.map(r => r.k), ['4x10'], 'one Counts set for both copies');
  assert.ok(b.cat.flags.foundPuddle && E.hasCard(b.cat, 'puddle-paws'));
  // letting him keep his secret: nothing, answered kindly; his name is never on screen for her
  const c = reading({ specialty: 'sneaking' }, { raft: 'fine', first: 'heron' });
  const fine = frames[SLIP].choice.options[1].next;
  assert.deepEqual(c.ids.filter(id => [SLIP, POINTING, fine, frames[fine].next].concat(UNDER1, UNDER2).includes(id)), [SLIP, fine, frames[fine].next]);
  assert.deepEqual(rowAt(c.rows, fine).say.map(x => x.text).concat(rowAt(c.rows, frames[fine].next).caps), ['Best friend an otter ever had.', 'Under the logs, something goes blub.']);
  assert.ok(!c.cat.flags.foundPuddle && !E.hasCard(c.cat, 'puddle-paws') && !c.cat.lessons['ch05-puddle']);
  assert.doesNotMatch(c.w, /\bPuddle\b/, 'the word she reads is “puddles”');
  assert.match(c.w, /It’s because of Pud— PUDDLES\. Raft puddles\. Not a name\./);
  assert.deepEqual(rowAt(c.rows, RAFT).options, ['Lean over, and look under the raft.', 'Look up. Is another one coming?']);
  assert.deepEqual(rowAt(c.rows, SLIP).options, ['“Riffle. What’s under the raft?”', '“Puddles. Fine.”']);
  // Back from any frame of the scene before its last, then "Look up", and later "Puddles. Fine."
  UNDER1.slice(0, 7).forEach(stop => {
    const cat = fresh({ specialty: 'sneaking' });
    read(cat, { raft: 'lean', first: 'otters', stop });
    if (stop === UNDER1[6]) assert.ok(E.cards(cat, STORIES).some(k => k.id === 'puddle-paws') && !cat.flags.foundPuddle, 'on the frame that gives the card, it is going into her file');
    while (cat.frame !== RAFT) assert.ok(E.back(cat, story), stop);
    const rest = read(cat, { raft: 'fine', first: 'otters' });
    assert.ok(!cat.flags.foundPuddle, stop);
    assert.ok(!E.cards(cat, STORIES).some(k => k.id === 'puddle-paws'), stop + ': no card in her file (held, it is shown only with the flag)');
    assert.ok(!E.dragonets(cat, STORIES).found.some(d => d.id === 'puddle'), stop + ': no page in her book');
    assert.doesNotMatch(readWords(rest), /\bPuddle\b/, stop + ': nothing afterwards says his name');
    assert.ok(!E.buildFullBook(cat, STORIES).pages.some(pg => /Puddle/.test(pg.recap.join(' '))), stop);
    assert.ok(idsOf(rest).includes(SLIP), stop + ': and the slip is hers to read, once');
  });
  // ... and from any frame of the second copy: Back to the slip, then "Puddles. Fine."
  [UNDER2[0], UNDER2[3], UNDER2[6]].forEach(stop => {
    const cat = fresh({ specialty: 'sneaking' });
    read(cat, { raft: 'ask', first: 'heron', stop });
    while (cat.frame !== SLIP) assert.ok(E.back(cat, story), stop);
    const rest = read(cat, { raft: 'fine', first: 'heron' });
    assert.ok(!cat.flags.foundPuddle && !E.cards(cat, STORIES).some(k => k.id === 'puddle-paws') && !E.dragonets(cat, STORIES).found.some(d => d.id === 'puddle'), stop);
    assert.doesNotMatch(readWords(rest), /\bPuddle\b/, stop);
  });
  // sticky: Back after the last frame keeps him, and a second reading reads the flag, with its own labels
  const d = fresh({ specialty: 'sneaking' });
  read(d, { raft: 'lean', first: 'otters', stop: WITNESS });
  assert.ok(E.back(d, story) && E.back(d, story) && d.flags.foundPuddle);
  read(d, { raft: 'lean', first: 'otters' });
  E.startChapter(d, story, 9000);
  const second = read(d, { raft: 'fine', first: 'heron', t: 9000 });
  assert.deepEqual(rowAt(second, RAFT).options, ['Lean over, and say hello to Puddle.', 'Not now. He’s being a log.']);
  assert.ok(!idsOf(second).includes(SLIP), 'a cat who has found him never reads the slip');
  assert.match(readWords(second), /Puddle is under the otters’ raft\. He says: five\. Then he sank\./, 'the lines under the bridge read the flag, not this reading’s choices');
  assert.equal(d.cards.filter(k => k.id === 'puddle-paws').length, 1);
});

test('Wisp, through the engine: three choices to keep still, and stopping at any of them gives no flag and no card; her name is on screen only for a cat who waited; Back before the last frame of “The pale reed”, then “Enough!”, leaves nothing; a cat who found Puddle and then finds her reads the frame where his snout comes up, and no other cat does', () => {
  const loud = WAITS.map(w => frames[w].choice.options[1].next);
  [0, 1, 2].forEach(wait => {
    const r = reading({ specialty: 'sneaking' }, { raft: 'fine', wait, first: 'heron' });
    const reeds = r.ids.filter(id => at(id) > at(WAITS[0]) && at(id) < at(HEAVE));
    // (she sits through "Nothing happens" to the next wait's own panel, and yells there)
    assert.deepEqual(reeds, REED.slice(0, wait ? wait + 1 : 0).concat([loud[wait], frames[loud[wait]].next]));
    assert.equal(rowAt(r.rows, loud[wait]).say[0].text, ['ONE! TWO!', 'THREE!', 'FIVE!'][wait], 'each a small joke of its own');
    assert.equal(r.ids[r.ids.indexOf(frames[loud[wait]].next) + 1], HEAVE, 'then straight on to the catch');
    assert.ok(!r.cat.flags.foundWisp && !E.hasCard(r.cat, 'wisp-fox') && !r.cat.lessons['ch05-wisp']);
    assert.doesNotMatch(r.w, /Wisp|WISP/, 'her name is nowhere');
    assert.equal(rowAt(r.rows, countsAt('ch05-catch')[0]).say[1].text, 'Frogs.');
    assert.deepEqual(rowAt(r.rows, GULP).caps, ['Down go the fish.']);
    assert.ok(!r.ids.includes(GULP_W), 'and she never sees the panel with Wisp in it');
  });
  // (REED's first frames are the waits' own panels: "Nothing happens", the dragonfly, the knees)
  assert.deepEqual([REED[1], REED[2]], [WAITS[1], WAITS[2]]);
  // found: three waits, the blink, her riddle, her card, the flag on the last frame (the forepaw Tap)
  const w = reading({ specialty: 'sneaking' }, { raft: 'fine', wait: 3, first: 'heron' });
  const snout = REED.filter(id => frames[id].scene.opts.snout);
  assert.deepEqual(w.ids.filter(id => at(id) > at(WAITS[0]) && at(id) < at(HEAVE)), REED.filter(id => !snout.includes(id)));
  assert.deepEqual([w.cat.flags.foundWisp, E.hasCard(w.cat, 'wisp-fox'), !!w.cat.lessons['ch05-wisp']], [true, true, true]);
  assert.equal(rowAt(w.rows, countsAt('ch05-catch')[0]).say[1].text, 'A reed with knees.');
  assert.deepEqual(rowAt(w.rows, GULP_W).caps, ['Down go the fish. One for Patience. One for Wisp.'], 'she gets her half exactly when found');
  assert.ok(!w.ids.includes(GULP) && frames[GULP_W].scene.cast.some(c => c.who === 'wisp' && c.pose === 'gulp'), 'and the picture shows her swallow it');
  // no reading has a balloon of hers: every panel of the reeds is Patience's, our cat's, or nobody's
  w.rows.forEach(r => assert.ok(!r.say.some(b => b.who === 'wisp' || b.label === 'Wisp'), r.id));
  assert.deepEqual(rowAt(w.rows, countsAt('ch05-wisp')[0]).lesson.map(l => [l.k, l.teacher, l.prompt.map(p => p.label)]), [['7x1', 'caption', [null]]]);
  // Back before the last frame, then "Enough!": no flag, no card in her file, her name nowhere afterwards
  REED.filter(id => !snout.includes(id)).slice(3, -1).forEach(stop => {
    const half = fresh({ specialty: 'sneaking' });
    read(half, { raft: 'fine', wait: 3, first: 'heron', stop });
    if (at(stop) >= at(ids.find(id => frames[id].card === 'wisp-fox'))) assert.ok(E.cards(half, STORIES).some(k => k.id === 'wisp-fox'), stop + ': on the frame that gives it');
    while (half.frame !== WAITS[2]) assert.ok(E.back(half, story), stop);
    const rest = read(half, { raft: 'fine', wait: 2, first: 'heron' });
    assert.ok(!half.flags.foundWisp && !E.cards(half, STORIES).some(k => k.id === 'wisp-fox'), stop);
    assert.ok(!E.dragonets(half, STORIES).found.some(d => d.id === 'wisp'), stop + ': no page in her book');
    assert.doesNotMatch(readWords(rest), /Wisp|WISP/, stop + ': her name is nowhere afterwards');
    assert.match(readWords(rest), /pale sister is the best at hiding/, stop + ': and Sprinkle’s hint is hers to read');
  });
  // Puddle's snout in the reeds: only for a cat who found him after the Roar and then waits
  const both = reading({ specialty: 'sneaking' }, { raft: 'lean', wait: 3, first: 'otters' });
  assert.deepEqual(snout.map(id => rowAt(both.rows, id).say), [[{ who: 'puddle', label: 'Puddle', text: 'WISP?', kind: 'shout' }], [{ who: 'puddle', label: 'Puddle', text: 'I’m a LOG.', kind: 'whisper' }]]);
  assert.ok(!w.ids.some(id => snout.includes(id)));
  assert.ok(!reading({ specialty: 'sneaking' }, { raft: 'ask', wait: 3, first: 'otters' }).ids.some(id => snout.includes(id)), 'found on the way home, the raft has left the marsh');
  assert.equal(rowAt(both.rows, DIVE).say[0].text, 'Back in eighteen fish!');
  // her page, and his, in her book; the mud count for a cat who found everyone
  assert.deepEqual(E.dragonets(both.cat, STORIES).found.map(dn => dn.id), ['sprinkle', 'puddle', 'wisp']);
  assert.deepEqual(rowAt(both.rows, MUD).skip.who.map(x => x.who), ['sprinkle', 'puddle', 'wisp']);
});

/* ------------------------------------------------------------------ the Taps and the questions */

test('the Taps that count log nothing: four paws aboard, nine claws in the log (the airplane growing), a forepaw each for Squall, Puddle and Wisp, the mud count (two, three or four taps, ending on 10, 15 or 20), the bedtime nines; the one-tap frames and Riffle’s seven questions log nothing either', () => {
  // paws aboard: counted in words by Tallyheart, from the rocks
  const board = frames[ids.find(id => frames[id].skip && frames[id].skip.paws === 'board')].skip, bw = E.skipWords(board, 'tallyheart');
  assert.deepEqual([0, 1, 2, 3, 4].map(n => E.skipView(board, n).count), ['', 'One.', 'One. Two.', 'One. Two. Three.', 'One. Two. Three. Four.']);
  assert.deepEqual([E.skipView(board, 4).done, E.skipView(board, 4).total, board.carry], [true, 4, false]);
  assert.deepEqual([bw.teacher, bw.words, bw.label, bw.prompt], ['tallyheart', true, 'Put the next paw on the raft.', '**Tap** each paw onto the raft.']);
  // nine claws in the log: her own thought, the frame's scene drawn again as she taps, the roar growing
  const f = frames[LOG], log = f.skip, lw = E.skipWords(log, 'riffle');
  assert.deepEqual([lw.teacher, lw.think, lw.label, lw.prompt], ['player', true, 'Dig in the next claw.', '**Tap** to dig in your claws.']);
  assert.deepEqual([E.skipOnScene(log), E.skipView(log, 0).anywhere, E.skipView(log, 9).done, E.skipView(log, 9).total], [true, true, true, 9]);
  assert.equal(E.skipView(log, 9).count, '1… 2… 3… 4… 5… 6… 7… 8… 9!');
  const scenes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => E.skipScene(f.scene, log, n, ''));
  assert.deepEqual(scenes.map(s => s.scene.opts.plane), ['far', 'far', 'far', 'far', 'near', 'near', 'near', 'over', 'over', 'over'], 'three sizes are enough');
  assert.deepEqual(scenes.map(s => s.scene.opts.claws), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'a claw dug in at each tap, the tenth tucked');
  assert.deepEqual(scenes.map(s => s.sfx), ['', 'rrr…', 'rrr…', 'rrr…', 'RRRrrr…', 'RRRrrr…', 'RRRrrr…', 'RRRRRR…', 'RRRRRR…', 'RRRRRR…'], 'the roar, lettered larger at each step');
  assert.deepEqual([f.scene.opts.plane, f.scene.opts.claws], ['far', undefined], 'the story’s own scene is never changed');
  // the forepaws: chapter 4's one-group skip, for Squall, for Puddle (both copies) and for Wisp
  [[UP[UP.length - 1], 'squall'], [UNDER1[7], 'puddle'], [UNDER2[7], 'puddle'], [REED[REED.length - 1], 'wisp']].forEach(([id, who]) => {
    const sk = frames[id].skip;
    assert.deepEqual(E.skipPicture(sk, 1), { table: 5, groups: 1, per: 5, highlight: 5, totals: true, next: false, who: [{ who }], thing: 'claw', things: 'claws' }, id);
    assert.deepEqual([E.skipView(sk, 1).total, E.skipView(sk, 1).done, E.skipInto(story, sk.next), sk.carry], [5, true, null, false], id + ': its 5 stays on its own page');
  });
  // the mud count: a forepaw for Sprinkle and for every dragonet she has ever met; no `groups` in the story
  const raw = frames[MUD].skip;
  assert.equal(raw.groups, undefined, 'the count is as long as the cats it is for');
  [[{ ch5Roof: true, foundSquall: true }, ['sprinkle', 'squall'], 10], [{ foundPuddle: true }, ['sprinkle', 'puddle'], 10], [{ foundWisp: true }, ['sprinkle', 'wisp'], 10],
    [{ foundSquall: true, foundPuddle: true }, ['sprinkle', 'squall', 'puddle'], 15], [{ foundSquall: true, foundWisp: true }, ['sprinkle', 'squall', 'wisp'], 15],
    [{ foundSquall: true, foundWisp: true, foundPuddle: true, ch5Roof: true }, ['sprinkle', 'squall', 'puddle', 'wisp'], 20]].forEach(([flags, who, total]) => {
    const cat = { flags }, sk = E.skipFor(raw, cat), n = who.length;
    assert.deepEqual([sk.who, sk.groups], [who.map(x => ({ who: x })), n], JSON.stringify(flags));
    const counts = [];
    for (let k = 0; k <= n; k++) counts.push(E.skipView(sk, k).count);
    assert.deepEqual(counts, ['', '5…', '5… 10…', '5… 10… 15…', '5… 10… 15… 20…'].slice(0, n).concat([[5, 10, 15, 20].slice(0, n).join('… ') + '!']));
    assert.deepEqual([E.skipView(sk, n).done, E.skipView(sk, n).total, E.skipReached(sk)], [true, total, total]);
    assert.deepEqual([E.skipPicture(sk, n).kind, E.skipPicture(sk, n).of, E.skipPicture(sk, n).groups], ['mud', 7, n], 'seven are drawn, the first n hers to light');
    // the page it turns to shows that number, for this cat: never the 25 of five taps
    assert.equal(E.skipReached(E.skipInto(story, raw.next, cat)), total);
  });
  assert.equal(raw.who.length, 4, 'the story’s own skip is never changed');
  const mw = E.skipWords(E.skipFor(raw, {}), 'sprinkle');
  assert.deepEqual([mw.teacher, mw.label, mw.prompt], ['sprinkle', 'Count the next forepaw.', '**Tap** a forepaw for everyone you’ve found.']);
  // the bedtime nines: both forepaws together, one claw tucked, nine lit a tap, the murmur trailing off
  const bedId = ids.find(id => frames[id].skip && frames[id].skip.paws === 'both'), bed = frames[bedId].skip, w = E.skipWords(bed, 'player');
  assert.deepEqual([0, 1, 2, 5].map(n => E.skipView(bed, n).count), ['', '9…', '9… 18…', '9… 18… 27… 36… 45…']);
  assert.deepEqual([w.teacher, w.whisper, w.label, E.skipReached(E.skipInto(story, bed.next))], ['player', true, 'Tap your forepaws.', 45]);
  assert.match(T(frames[bed.next].next), /^By forty-five, he’s snoring too\./);
  // 23 counting taps for a cat on the plain path (5 + 4 + 9 + 5), and one more for each forepaw held up to her, two to four in the mud
  const taps = sk => (E.skipFor(sk, { flags: { foundSquall: true, foundPuddle: true, foundWisp: true } }).groups);
  assert.deepEqual(ids.filter(id => frames[id].skip).map(id => taps(frames[id].skip)), [5, 1, 4, 9, 1, 1, 1, 4, 5]);
  // nothing here is an answer: a reading that taps everything logs only what she types
  const cat = fresh({ specialty: 'climbing' }), n0 = cat.counts.length;
  const rows = read(cat, { up: true, raft: 'lean', wait: 3, first: 'otters' });
  rows.forEach((r, i) => { if (['skip', 'scratch', 'ask', 'next', 'choice'].includes(r.kind) && rows[i + 1]) assert.equal(rows[i + 1].counts, r.counts, r.id + ' logs nothing'); });
  assert.equal(rows.filter(r => r.kind === 'skip').length, 8, 'every counting Tap of the chapter but the second copy’s forepaw');
  assert.deepEqual(rows.filter(r => r.kind === 'scratch').map(r => frames[r.id].scratch.tap), ['nose', 'fur', 'mud', 'pole'], 'a climber’s four (the dug earth is a noticing cat’s)');
  assert.equal(cat.counts.length - n0, 19, 'sixteen answers, and three riddles');
  // the typed answers of a playthrough with no misses: 16, and 17 to 19 with the riddles
  const typed = o => { const c2 = fresh({ specialty: 'sneaking' }), m = c2.counts.length; read(c2, o); return c2.counts.length - m; };
  assert.deepEqual([typed({ raft: 'fine', wait: 0, first: 'otters' }), typed({ up: true, raft: 'fine', wait: 0, first: 'heron' }), typed({ raft: 'ask', wait: 3, first: 'heron' }), typed({ up: true, raft: 'lean', wait: 3, first: 'otters' })], [16, 17, 18, 19]);
  // the one-tap frames: no row of bark to scratch (chapter 4's kind), a tap turns the page
  rows.filter(r => r.kind === 'scratch').forEach(r => { assert.deepEqual(r.scratched, [], r.id); assert.equal(r.tap.kind, 'tap', r.id); });
});

test('a big number is on a page only straight after a count she made: the page after the mud count has none for a cat who found nobody today, on every combination', () => {
  const told = frames[MUD].skip.next, after = frames[told].next;
  assert.match(T(told), /^Mama’s count is coming back\./);
  assert.match(T(after), /^Somebody small crosses the marsh every night\. With prints half the size of mine\.$/);
  // a cat who met nobody today (the plain path) never reads the mud count: the page turn past it lands on
  // "Somebody small…", and a count she never made hands no number on (it showed a big 5, or a 10 for a cat
  // who met Squall in chapter 4)
  for (const flags of [{}, { foundSquall: true }, { foundSquall: true, ch5Roof: false, foundPuddle: false, foundWisp: false }, { specialty: 'noticing', ch3Told: true }]) {
    const cat = { flags };
    assert.deepEqual([E.shows(frames[MUD], cat), E.shows(frames[told], cat), E.landing(cat, story, MUD), E.landing(cat, story, told)], [false, false, after, after], JSON.stringify(flags));
    assert.equal(E.skipInto(story, after, cat), null, JSON.stringify(flags) + ': no number over the page after a count she never read');
    assert.equal(E.skipInto(story, told, cat), null);
    assert.equal(E.keptSkip(story, after, cat), null);
  }
  // a cat who met one: her number on the page the count turns to, and none on the page after that
  for (const [flags, total] of [[{ foundSquall: true, ch5Roof: true }, 10], [{ foundPuddle: true }, 10], [{ foundSquall: true, foundWisp: true }, 15], [{ foundSquall: true, ch5Roof: true, foundPuddle: true, foundWisp: true }, 20]]) {
    const cat = { flags };
    assert.equal(E.skipReached(E.skipInto(story, told, cat)), total, JSON.stringify(flags));
    assert.equal(E.skipInto(story, after, cat), null, JSON.stringify(flags));
  }
  // (with no cat, the story as written: the storyboard's own question)
  assert.equal(E.skipInto(story, told), frames[MUD].skip);
  assert.equal(E.skipInto(story, after), null);
  // on every combination, by the flags her day leaves her with
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), cat = { flags: p.flags };
    assert.equal(p.includes(MUD), today(c), comboName(c));
    assert.equal(!!E.skipInto(story, after, cat), false, comboName(c) + ': no number on “Somebody small…”');
    if (today(c)) assert.equal(E.skipReached(E.skipInto(story, told, cat)), 5 * (1 + ['squall', 'puddle', 'wisp'].filter(k => found(c)[k]).length), comboName(c));
  }
  // and on a spread of them, page by page as she walks: a number is carried only onto the frame straight
  // after a count she tapped that carries one (the tuck's 45, the mud count's, the bedtime nines' 45)
  const carried = new Set();
  for (const c of SOME) {
    const cat = { flags: Object.assign({}, c.flags), look: { sex: 'she' }, lessons: { 'ch05-nines': { finished: true, noHelp: true } } };
    let id = story.start, prev = null;
    for (let guard = 0; guard < 600 && id; guard++) {
      id = E.landing(cat, story, id);
      const f = frames[id], into = E.skipInto(story, id, cat);
      const want = prev && frames[prev].skip && frames[prev].skip.carry !== false ? E.skipReached(E.skipFor(frames[prev].skip, cat)) : null;
      assert.equal(into ? E.skipReached(into) : null, want, comboName(c) + ': ' + id + ' after ' + prev);
      if (into) carried.add(prev);
      if (f.sets) Object.assign(cat.flags, f.sets);
      if (f.end) break;
      prev = id;
      if (f.choice) { const opt = f.choice.options[pick(id, c.o)]; Object.assign(cat.flags, opt.sets || {}); id = opt.next; } else id = exits(f)[0];
    }
  }
  assert.deepEqual([...carried].sort(), [ids.find(id => frames[id].skip && frames[id].skip.tuck), MUD, ids.find(id => frames[id].skip && frames[id].skip.paws === 'both')].sort());
});

test('Riffle’s seven questions: a Tap that counts nothing; seven questions and seven answers in order, a pair of fish owed for each; nothing is logged; the frame after it asks 7 × 2 on the same cloud', () => {
  const askId = ids.find(id => frames[id].ask), f = frames[askId], ak = f.ask;
  assert.deepEqual([E.kindOf(f), E.exits(f)], ['ask', [countsAt('ch05-otter')[0]]]);
  const Q = ['Do you sleep standing up?', 'Is that leg tired?', 'Is that a dragonfly?', 'Do you see EVERYTHING?', 'Even at night?', 'Do you like otters?', 'Am I your favorite?'], An = ['Yes.', 'No.', 'Yes.', 'Yes.', 'Yes.', 'Yes.', 'No.'];
  assert.deepEqual(ak, { who: 'riffle', to: 'patience', prompt: '**Tap** Riffle to let one out.', pairs: Q.map((q, i) => [q, An[i]]), next: ak.next });
  assert.deepEqual(E.askView(ak, 0), { taps: 0, total: 7, done: false, who: 'riffle', to: 'patience', pair: null, before: [], owed: 0 });
  for (let n = 1; n <= 7; n++) {
    const v = E.askView(ak, n);
    assert.deepEqual([v.pair, v.before.length, v.owed, v.done], [[Q[n - 1], An[n - 1]], n - 1, n, n === 7]);
    const sc = E.askScene(f.scene, ak, n);
    assert.equal(sc.opts.owed, n, 'one more pair of fish in the thought cloud');
    assert.deepEqual(Object.assign({}, sc.opts, { owed: 0 }), f.scene.opts);
    assert.deepEqual(sc.cast, f.scene.cast);
  }
  assert.equal(f.scene.opts.owed, 0, 'the story’s own scene is never changed');
  assert.deepEqual(E.askWords(ak), { prompt: '**Tap** Riffle to let one out.', label: 'Ask the next question.' });
  // both of them are in the picture, and Riffle is the one to tap (he hops, glowing softly)
  assert.deepEqual([castOf(askId, 'riffle')[0].pose, castOf(askId, 'riffle')[0].glow, castOf(askId, 'patience').length, f.say], ['hop', true, 1, undefined]);
  // "Do you see EVERYTHING?" / "Even at night?": her answers are what our cat's own question leans on
  assert.ok(Q.indexOf('Do you see EVERYTHING?') < Q.indexOf('Even at night?'));
  assert.deepEqual([An[5], An[6]], ['Yes.', 'No.'], 'her driest line: she likes otters; he is not her favorite');
  // in a reading: an interaction like Next; it logs nothing and sets nothing; then 7 × 2 on the same cloud
  const r = reading({ specialty: 'sneaking' }, { first: 'heron' }), a = rowAt(r.rows, askId), next = rowAt(r.rows, ak.next);
  assert.deepEqual(a.asked, Q.map((q, i) => [q, An[i]]));
  assert.equal(next.counts - a.counts, 0, 'nothing logged');
  assert.deepEqual(next.lesson.map(l => [l.k, l.q.answer, l.picture.groups]), [['7x2', 14, 7]]);
  assert.deepEqual(next.say.map(b => b.label + ': ' + b.text), ['Patience: Seven answers.', 'Patience: Two fish for every answer.'], 'two balloons of its own: its page has something to read');
  assert.equal(next.scene.opts.owed, 7, 'the same cloud, with its seven pairs');
  const bill = rowAt(r.rows, countsAt('ch05-bill')[0]);
  assert.deepEqual(bill.lesson.map(l => [l.k, l.q.answer, l.picture.groups]), [['9x2', 18, 9]], 'the bill: the nine pairs she watched land');
  assert.equal(bill.scene.opts.owed, 9);
  // no other chapter has such a frame
  [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04].forEach(s => assert.ok(!Object.values(s.frames).some(fr => fr.ask)));
});

/* ------------------------------------------------------------------ the book */

function recapFor(flags) {
  const cat = { flags, look: { sex: 'she' } };
  return story.book.recap.filter(r => !r.when || E.matches(r.when, cat));
}

test('book: title, chapter title, a 6–10 sentence recap on every combination; Puddle’s page and Wisp’s only for a cat who found them; chapter 4’s page for a cat who went up today', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['chapterTitle', 'dragonet', 'dream', 'noDream', 'recap', 'title']);
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'Riffle’s River');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}paw’s dream that night floated off down the river.');
  b.recap.forEach((r, i) => {
    assert.deepEqual(Object.keys(r).filter(k => !['text', 'when'].includes(k)), [], 'recap ' + i);
    assert.ok(typeof r.text === 'string' && r.text.trim(), 'recap ' + i);
    // a page says "found" only for a dragonet found in this chapter: its lines read this chapter's own three flags
    if (r.when) Object.keys(r.when).forEach(k => {
      if (k === 'not') return Object.keys(r.when.not).forEach(kk => assert.ok(['ch5Roof', 'foundPuddle', 'foundWisp'].includes(kk), 'recap ' + i + ': not ' + kk));
      assert.ok(['ch5Roof', 'foundPuddle', 'foundWisp'].includes(k), 'recap ' + i + ': ' + k);
    });
    assert.match(r.text, /[.!?”’]$/, 'recap ' + i + ' is a whole sentence');
    assert.ok(words(r.text) <= 31, 'recap ' + i + ' is short: ' + words(r.text));
    assert.doesNotMatch(r.text, /\byou\b/i, 'recap is third person: ' + r.text);
  });
  // the text's proposed sentences, word for word, in its order (two of them reworded for a tom, as chapter 4
  // reworded one of its own: “Puddle saw …”, “showed {name}paw …”: see the tom's page, below)
  assert.deepEqual(b.recap.map(r => [r.when || null, r.text]), [
    [null, 'On {name}paw’s fourth morning, the old tom was guarding the pile with his eyes shut and a snail on his ear, and four more pieces were gone: sixteen in four nights.'],
    [null, 'Tallyheart taught {name}paw {their} fifth Count, nine lives: a ten with one claw tucked in.'],
    [{ ch5Roof: true }, 'On the roof of {their} old tower, {they} found Squall, the littlest dragonet, who told {them} about two skinny shapes that go to the tracks every night.'],
    [null, '{name}paw sat through the Roar, the apprentices’ courage test, on the otters’ raft, and did not move one of nine claws. Tallyheart counted.'],
    [{ foundPuddle: true }, 'Under the raft {they} found Puddle, who has four big feet and says he is a log. Puddle saw clever little paws picking up mice on the storm night.'],
    [null, 'The old ferry otter said the fox had told him the dragon story, twice, and showed {name}paw a tuft of thin brown fur.'],
    [null, 'Patience the heron said there was no moon on the storm night, and that two small shapes crossed her mud. There were tiny prints in it. It cost eighteen fish.'],
    [{ foundWisp: true }, '{name}paw sat still until a pale reed blinked. It was Wisp, who stands on one leg like a heron, and drew a fox dropping something glittering in the reeds.'],
    [ANY, 'Under the Old Bridge, Sprinkle lit a forepaw for everyone found so far. Mama’s count is coming back.'],
    [null, 'That night, Tallyheart said every warrior has sat through the Roar. She counted through hers, very loudly.']]);
  // 6 to 10 sentences on every combination; a name only for a dragonet found today
  let n = 0;
  for (const foundSquall of [true, false, undefined]) for (const ch5Roof of (foundSquall ? [true, false, undefined] : [undefined])) for (const foundPuddle of [true, undefined]) for (const foundWisp of [true, undefined]) {
    const flags = {};
    [['foundSquall', foundSquall], ['ch5Roof', ch5Roof], ['foundPuddle', foundPuddle], ['foundWisp', foundWisp]].forEach(([k, v]) => { if (v !== undefined) flags[k] = v; });
    const r = recapFor(flags), all = r.map(x => x.text).join(' '), any = !!(ch5Roof || foundPuddle || foundWisp);
    assert.ok(r.length >= 6 && r.length <= 10, JSON.stringify(flags) + ': ' + r.length + ' sentences');
    assert.equal(r.length, 6 + (ch5Roof ? 1 : 0) + (foundPuddle ? 1 : 0) + (foundWisp ? 1 : 0) + (any ? 1 : 0), JSON.stringify(flags));
    assert.equal(/Squall|roof/.test(all), !!ch5Roof, JSON.stringify(flags) + ': the roof is on this page only for a cat who went up today');
    assert.equal(/Puddle/.test(all), !!foundPuddle, JSON.stringify(flags));
    assert.equal(/Wisp/.test(all), !!foundWisp, JSON.stringify(flags));
    assert.equal(/Sprinkle lit a forepaw for everyone found so far/.test(all), any, JSON.stringify(flags));
    n++;
  }
  assert.equal(n, 20);
  // nothing in the recap depends on told or kept, her specialty or her worry, and nothing solves the case
  assert.doesNotMatch(b.recap.map(r => r.text).join(' '), /weasel|thief|thieves|stole|is glass|a whisker/i);
  assert.match(b.recap[3].text, /did not move one of nine claws/, 'the Roar counts claws');
  // the two new pages: each only for a cat who has found it, each in its own pose
  assert.ok(Array.isArray(b.dragonet) && b.dragonet.length === 2);
  assert.deepEqual(b.dragonet.map(dn => [dn.id, dn.name, dn.when, dn.pose, dn.lines]), [
    ['puddle', 'Puddle', { foundPuddle: true }, 'head', ['Blue-grey, with feet much too big for him. He says he is a log.', '{name}paw found him under the otters’ ferry raft. Mama says: stay where you land.', 'He says five, and then he sinks. He always pops up again. Five more claws, counted.']],
    ['wisp', 'Wisp', { foundWisp: true }, 'blink', ['So pale you can nearly see the reeds through her. She thinks she is a heron.', '{name}paw found her in Patience’s reeds, by keeping very, very still.', 'She stands on one leg, and draws what she has seen. Five more claws, counted.']]]);
  b.dragonet.forEach(dn => { assert.ok(dn.lines.every(l => words(l) <= 22 && /[.!?]$/.test(l)), dn.id); assert.ok(A.vocab.otherPoses[dn.id].includes(dn.pose), dn.id + ': drawn in a pose of its own'); });
  // through the engine: the pages as her book has them
  const page = (cat, id) => E.buildFullBook(cat, STORIES).pages.find(p => p.id === id).recap.join(' ');
  const D = cat => E.dragonets(cat, STORIES).found.map(d => d.id + (d.pose ? ':' + d.pose : ''));
  const base = { specialty: 'sneaking' };
  // the roof today: chapter 4's page says he was still roaring; chapter 5's says she found him
  const todayCat = reading(base, { up: true, raft: 'fine', wait: 0 }).cat;
  assert.match(page(todayCat, 'ch04'), /Sprinkle’s littlest brother is still roaring, and hiccuping\./);
  assert.equal((page(todayCat, 'ch04').match(/still roaring/g) || []).length, 1);
  assert.doesNotMatch(page(todayCat, 'ch04'), /found Squall|two skinny shapes/);
  assert.match(page(todayCat, 'ch05'), /On the roof of her old tower, she found Squall, the littlest dragonet, who told her about two skinny shapes that go to the tracks every night\./);
  // found in chapter 4: it is said there, and nothing about the roof on chapter 5's page
  const beforeCat = reading(Object.assign({ foundSquall: true }, base), { raft: 'fine', wait: 0 }).cat;
  assert.match(page(beforeCat, 'ch04'), /she found Squall, the littlest dragonet, who roars at airplanes and hiccups\./);
  assert.doesNotMatch(page(beforeCat, 'ch04'), /still roaring/);
  assert.doesNotMatch(page(beforeCat, 'ch05'), /Squall|roof/);
  // never: still roaring on chapter 4's page, and no dragonet on chapter 5's
  const never = reading(base, { raft: 'fine', wait: 0 }).cat;
  assert.match(page(never, 'ch04'), /still roaring/);
  assert.doesNotMatch(page(never, 'ch05'), /Squall|Puddle|Wisp|forepaw for everyone/);
  assert.equal(E.buildBook(story, never).recap.length, 6);
  assert.equal(E.buildBook(story, never).chapter, 'Chapter 5: Riffle’s River');
  // Squall's own page stays on foundSquall, whichever chapter she found him in; Puddle's and Wisp's on theirs
  assert.deepEqual([D(never), D(beforeCat), D(todayCat)], [['sprinkle'], ['sprinkle', 'squall'], ['sprinkle', 'squall']]);
  const all = reading(base, { up: true, raft: 'lean', wait: 3 }).cat;
  assert.deepEqual(D(all), ['sprinkle', 'squall', 'puddle:head', 'wisp:blink'], 'in chapter order; each new page says the pose its dragonet is drawn in');
  assert.equal(E.dragonets(all, STORIES).toFind, 3, 'four of the seven found');
  const pud = E.dragonets(all, STORIES).found[2];
  assert.deepEqual([pud.name, pud.chapter, pud.lines.length, pud.lines[1]], ['Puddle', 'ch05', 3, 'Moonpaw found him under the otters’ ferry raft. Mama says: stay where you land.']);
  assert.match(page(all, 'ch05'), /Under the raft she found Puddle.*sat still until a pale reed blinked\. It was Wisp.*Sprinkle lit a forepaw for everyone found so far\./);
  assert.equal(E.buildBook(story, all).recap.length, 10);
  assert.deepEqual(D(reading(base, { raft: 'ask', wait: 0 }).cat), ['sprinkle', 'puddle:head']);
  assert.deepEqual(D(reading(base, { raft: 'fine', wait: 3 }).cat), ['sprinkle', 'wisp:blink']);
  // a tom's page reads "his" and "he"; her dream as she typed it; no dream typed: the chapter's own line
  const tom = fresh(base); tom.look.sex = 'tom';
  read(tom, { up: true, raft: 'lean', wait: 0, first: 'heron', dream: '' });
  assert.match(page(tom, 'ch05'), /Tallyheart taught Moonpaw his fifth Count.*On the roof of his old tower, he found Squall.*Under the raft he found Puddle/);
  assert.equal(E.buildFullBook(tom, STORIES).pages.find(p => p.id === 'ch05').dream, 'Moonpaw’s dream that night floated off down the river.');
  assert.equal(E.buildFullBook(all, STORIES).pages.find(p => p.id === 'ch05').dream, 'Moonpaw’s dream: “A reed that blinked.”');
  // no sentence of a tom's page has a he or a him for two different animals: as first written, “he found Puddle,
  // who … says he is a log. He saw …” had three he's for two of them, and “the fox had told him … and showed him”
  // read as the fox showing the otter the fur. The dragonet is named, and so is the cat (chapter 4 did the
  // same for “Reynard said the dragon flew”)
  const tomPage = E.buildBook(story, tom).recap;
  assert.ok(tomPage.includes('Under the raft he found Puddle, who has four big feet and says he is a log. Puddle saw clever little paws picking up mice on the storm night.'));
  assert.ok(tomPage.includes('The old ferry otter said the fox had told him the dragon story, twice, and showed Moonpaw a tuft of thin brown fur.'));
  tomPage.forEach(line => {
    assert.doesNotMatch(line, /\b[Hh]e saw\b|showed him\b/, line);
    // a sentence that speaks of the otter, the fox or Puddle as he or him has no he or him left for the cat
    line.split(/(?<=[.!?])\s+/).forEach(sent => { if (/\b(otter|fox|Puddle)\b/.test(sent)) assert.ok((sent.match(/\b(he|him|his)\b/gi) || []).length <= 2 && !/\b[Hh]e\b.*\bhe\b.*\bhe\b/.test(sent), sent); });
  });
  // …and a she-cat's reads as it did, but for the two names
  const shePage = E.buildBook(story, all).recap;
  assert.ok(shePage.includes('The old ferry otter said the fox had told him the dragon story, twice, and showed Moonpaw a tuft of thin brown fur.'));
});

test('the teaser for chapter 6, and chapter 4’s for this one', () => {
  assert.deepEqual(story.teaser, { title: 'Chapter 6: The Snake in the Stones', lines: ['Tomorrow, you ask a nosy old snake what a secret costs.', 'And Tallyheart counts out guards for the pile.'] });
  story.teaser.lines.forEach(l => assert.ok(words(l) <= 25, l));
  // it promises what today set up: Patience's tip (the one who never shuts his eyes) and Glintstar's order (proper guards)
  assert.match(T(F(/Ask the one who never shuts his eyes/)), /One more answer\. Free\./);
  assert.match(T(F(/I want proper guards/)), /By tomorrow night/);
  assert.match(T(F(/^Tomorrow: Coil\./)), /What does a nosy old snake want for a secret\?/);
  assert.doesNotMatch(story.teaser.lines.join(' '), /Coil|weasel|ReedClan|patrol/i, 'no name, and nothing chapter 6 has not promised');
  const cat = E.blankCat({}); cat.name = 'Moon';
  const t = E.teaser(story, cat, PC.story);
  assert.deepEqual(t, { title: 'Chapter 6: The Snake in the Stones', lines: story.teaser.lines, built: false, next: null }, 'chapter 6 is not built: coming soon');
  // chapter 4's teaser is paid off on this chapter's first screen, and chapter 5 is built now
  const t4 = E.teaser(ch04, cat, PC.story);
  assert.deepEqual([t4.title, t4.built, t4.next], ['Chapter 5: Riffle’s River', true, 'ch05']);
  assert.deepEqual(ch04.teaser.lines, ['Tomorrow, you ride Riffle’s raft, to ask the river who was awake on the storm night.', 'And forty pieces lie in their rows.'], 'it does not change');
  const first = frames[story.start];
  assert.deepEqual([first.scene.set, first.scene.cam, first.scene.opts.rows.slice(0, 3)], ['pile', 'rows', [10, 10, 10]], 'forty pieces lay in their rows: the chapter opens on them, with four gone');
  assert.ok(ids.some(id => frames[id].scene.set === 'openriver' && castOf(id, 'player').some(c => c.at === 'raft-1')), 'and she rides the raft');
  assert.match(T(F(/So who’s first\?/)), /Otters HEAR everything\. Patience the heron SEES everything\./);
  // the hub: after chapter 4, chapter 5 is the big button; afterwards chapter 6 is coming soon
  const c4 = E.blankCat({}); c4.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4 };
  const p4 = E.progress(c4, STORIES);
  assert.deepEqual([p4.next && p4.next.id, E.chapterHeading(p4.next), p4.soon], ['ch05', 'Chapter 5: Riffle’s River', null]);
  const done = reading({ specialty: 'sneaking' }, {}).cat, p = E.progress(done, STORIES);
  assert.deepEqual([p.next, p.soon && p.soon.title, p.latest.id, E.status(done, STORIES)], [null, 'Chapter 6: The Snake in the Stones', 'ch05', 'Chapter 5 finished']);
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean and fill renders the same text', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  // alone, it cannot know chapter 4's set, card and partner cards: the roof is shared
  assert.ok(E.checkStory(story).length > 0, 'chapter 5 leans on chapter 4');
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind];
    const cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
  // chapters 1 to 4 are sound beside it (chapter 4's page reads chapter 5's flag)
  [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04].forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id));
});

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, flags, the lessons, the taps, her cards, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) for (const light of (COMBOS.indexOf(c) % 3 ? [0] : [0, 1])) {
    const o = Object.assign({}, c.o, { light }), name = comboName(c) + ' light ' + light, was = found(c);
    const cat = fresh(c.flags);
    const counted = cat.counts.length, flags0 = Object.keys(cat.flags);
    const rows = read(cat, o), walked = idsOf(rows);
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch05'), name + ': chapter 5 is finished');
    // no frame that shows nothing (her one more question for the heron is a page of choices)
    rows.forEach(r => { if (r.kind !== 'end') assert.ok(r.caps.length + r.say.length + (r.sfx ? 1 : 0) + (r.options ? r.options.length : 0) > 0, name + ' ' + r.id + ' shows nothing'); });
    // the engine walks the frames the story says are hers
    assert.deepEqual(walked, walk(c.flags, o).slice(), name + ': the engine walks the same frames');
    // the flags: the sticky ones as they should be, the witness she asked first, and nothing else new
    assert.deepEqual([!!cat.flags.ch5Roof, !!cat.flags.foundSquall, !!cat.flags.foundPuddle, !!cat.flags.foundWisp, cat.flags.ch5First], [was.roof, was.squall, was.puddle, was.wisp, o.first], name);
    assert.deepEqual(Object.keys(cat.flags).filter(k => !flags0.includes(k)).sort(), ['ch5First'].concat(was.roof ? ['ch5Roof', 'foundSquall'] : [], was.puddle ? ['foundPuddle'] : [], was.wisp ? ['foundWisp'] : []).sort(), name + ': no other flag is set');
    // every lesson on her way is finished, with no help: the six every cat counts, and a riddle for each dragonet
    const done = Object.keys(cat.lessons).filter(k => /^ch05/.test(k)).sort();
    assert.deepEqual(done, ['ch05-bill', 'ch05-catch', 'ch05-nines', 'ch05-otter', 'ch05-pile', 'ch05-tens'].concat(was.puddle ? ['ch05-puddle'] : [], was.wisp ? ['ch05-wisp'] : []).sort(), name);
    done.forEach(s => assert.ok(cat.lessons[s].finished && cat.lessons[s].noHelp, name + ': ' + s));
    assert.equal(cat.counts.length - counted, 16 + (was.roof ? 1 : 0) + (was.puddle ? 1 : 0) + (was.wisp ? 1 : 0), name + ': the typed answers; the taps never logged');
    assert.equal(cat.dreams.ch05, 'a reed that blinked');
    assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9]);
    assert.equal(E.status(cat, STORIES), 'Chapter 5 finished');
    const page = E.buildBook(story, cat);
    assert.equal(page.dream, 'Moonpaw’s dream: “A reed that blinked.”');
    assert.ok(page.recap.length >= 6 && page.recap.length <= 10, name + ': ' + page.recap.length);
    assert.deepEqual(E.buildFullBook(cat, STORIES).dragonets.found.map(d => d.id), ['sprinkle'].concat(was.squall ? ['squall'] : [], was.puddle ? ['puddle'] : [], was.wisp ? ['wisp'] : []), name);
    // the speakers as the page labels them: never "Puddle" or "Squall" before he says so; Patience by name; no Wisp
    rows.forEach(r => r.say.forEach(b => {
      if (b.who === 'puddle') { const copy = UNDER1.includes(r.id) ? UNDER1 : UNDER2.includes(r.id) ? UNDER2 : null; assert.equal(b.label, copy && copy.indexOf(r.id) < 4 ? 'The big-footed dragon' : 'Puddle', name + ' ' + r.id); }
      if (b.who === 'squall') assert.equal(b.label, UP.indexOf(r.id) < UP.indexOf(F(/…I’m Squall\./)) ? 'The little dragon' : 'Squall', name + ' ' + r.id);
      if (b.who === 'patience') assert.equal(b.label, 'Patience', name + ' ' + r.id);
      assert.notEqual(b.who, 'wisp', name + ' ' + r.id);
      assert.ok(b.label && !/[{}]/.test(b.label + b.text), name + ' ' + r.id + ': ' + b.label + ': ' + b.text);
    }));
    rows.forEach(r => (r.lesson || []).forEach(l => l.prompt.forEach(p => { if (p.who === 'puddle') assert.equal(p.label, 'The big-footed dragon', name + ' ' + r.id); if (p.who === 'squall') assert.equal(p.label, 'The little dragon', name + ' ' + r.id); })));
    // the scenes resolve for her: her stone by her nose in every den; the tree's marks glow as she has earned them
    rows.filter(r => r.scene && r.scene.set === 'den').forEach(r => assert.equal(r.scene.opts.stone, 'nose', r.id));
    rows.filter(r => r.scene && r.scene.set === 'hollow').forEach(r => assert.ok(Array.isArray(r.scene.opts.glow), r.id));
    // Back from the end goes back a page, and loses nothing she found
    assert.ok(E.back(cat, story));
    assert.deepEqual([!!cat.flags.foundPuddle, !!cat.flags.foundWisp, !!cat.flags.ch5Roof], [was.puddle, was.wisp, was.roof], name + ': sticky');
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 500);
  // with a miss on everything she still reaches the end, every retry and filler is asked, and from the
  // frame where Tallyheart turns for home to the Old Bridge no balloon is hers: a Counts frame's lines,
  // fillers, help and retries included
  const cat = fresh({ specialty: 'noticing', ch3Told: false, worry: 'water' });
  const rows = read(cat, { up: true, raft: 'lean', wait: 3, first: 'otters',
    answers: { '3x10': [13], '10x7': [71], '5x10': [5], '2x9': [17], '4x9': [40], '9x9': [80], '7x5': [34], '4x10': [44], '7x2': [15], '9x2': [20], '7x1': [14], '4x5': [25] } });
  assert.equal(rows[rows.length - 1].kind, 'end');
  const w = readWords(rows);
  ['Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.', 'Tallyheart: One from yesterday. One cat. How many front claws?',
    'That’s the hop! Now the tuck: one claw in for every cat.', 'Thirty-six. Now look. Three and six make nine. Every nines answer hides a nine! We’ll come back to that one.', 'Eighteen! One and eight. There’s your nine.',
    'The little dragon: Mama’s count again! Seven forepaws, five claws each. How many claws?', 'Count my bumps! You hop!', 'The big-footed dragon: My bumps again! Four logs, ten bumps on every one. How many bumps?',
    'The big-footed dragon: Do another one! One log. How many bumps?', 'Scratch it on the log! Two for every answer.', 'Riffle: An easy one! One answer. How many fish?', 'Riffle: The fish again! Seven answers, two fish for every answer. How many fish?',
    'Riffle: The fish again! Nine answers, two fish for every answer. How many fish?', 'Look again. One leg each.', ': She draws another one.', ': She taps the seven herons again.', 'Scratch it on the log! Five for every string.',
    'Riffle: An easy one! One string. How many fish?'].forEach(line => assert.ok(w.includes(line), line));
  assert.ok(Object.keys(cat.lessons).filter(k => /^ch05|^ch04-riddle/.test(k)).length === 9 && Object.keys(cat.lessons).filter(k => /^ch05/.test(k)).every(s => !cat.lessons[s].noHelp));
  // (a cat who needed the scratches says it plainly, and Tallyheart finishes it for her)
  assert.deepEqual(rowAt(rows, F(/That’s your fifth Count/)).say.map(b => b.text), ['Nine lives. That’s your fifth Count. And the trickiest one so far.', 'It’s tens. With a claw tucked in.', 'That’s all a nine is.']);
  const from = idsOf(rows).indexOf(HOME) + 1, to = idsOf(rows).indexOf(BRIDGE);
  assert.ok(from > 0 && to > from);
  rows.slice(from, to).forEach(r => {
    assert.ok(!r.say.some(b => b.who === 'tallyheart'), r.id);
    (r.lesson || []).forEach(l => {
      assert.ok(l.teacher !== 'tallyheart' && !l.prompt.some(p => p.who === 'tallyheart') && !l.balloons.some(b => b.who === 'tallyheart'), r.id + ' ' + l.k);
      if (l.help) assert.ok(l.help.teacher !== 'tallyheart' && l.help.counter !== 'tallyheart' && l.help.says !== 'tallyheart', r.id + ' ' + l.k + ': its help');
      // and every speaker of a lesson's line is in that Counts frame's picture
      l.prompt.concat(l.balloons).filter(x => x.who).forEach(x => assert.ok(castOf(r.id, x.who).length, r.id + ' ' + l.k + ': ' + x.who + ' speaks, and is in the picture'));
    });
  });
  assert.deepEqual(rows.slice(from, to).filter(r => r.lesson).map(r => frames[r.id].counts.set), ['ch05-puddle', 'ch05-otter', 'ch05-bill', 'ch05-wisp', 'ch05-catch'], 'five Counts moments out on the water');
  // and nobody on the raft or in the marsh says "lives"
  assert.doesNotMatch(readWords(rows.slice(idsOf(rows).indexOf(CROSSING), to)), /\blives?\b/i);
  // the whole day's lessons, every speaker in the picture (the new warrior on the rim for "Not mice.")
  rows.forEach(r => (r.lesson || []).forEach(l => l.prompt.concat(l.balloons).filter(x => x.who).forEach(x => assert.ok(castOf(r.id, x.who).length, r.id + ' ' + l.k + ': ' + x.who))));
  // a save in the middle of the day goes through the store's own shape and comes back the same cat
  const mid = fresh({ specialty: 'climbing' });
  read(mid, { raft: 'lean', first: 'otters', stop: MARSH });
  const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
  assert.deepEqual([back.flags, back.cards, back.frame, back.lessons], [mid.flags, mid.cards, mid.frame, mid.lessons]);
  assert.deepEqual(idsOf(read(back, { raft: 'lean', first: 'otters', wait: 3 })), idsOf(read(mid, { raft: 'lean', first: 'otters', wait: 3 })), 'and reads on to the same end');
});
