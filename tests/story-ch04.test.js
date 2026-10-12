/* Story tests for chapter 4: node --test
 *
 * Checks app/story/ch04.js against the frame contract in docs/build.md (its sections "Chapter 2
 * (v0.3)", "Chapter 3 (v0.4)" and "Chapter 4 (v0.4)") and against
 * docs/chapters/04-the-glittering-scale.md (v0.4): the frame graph (frames shown only `when` they
 * match, the two afternoons side by side), one interaction per frame, the seven choices and the two
 * sticky flags, the Counts frames and sets exactly as the text's Build notes have them, the four
 * skip-counts, the three pages she taps and the page that opens her Case File, her cards (given
 * once, in order, 7, 8, 8 or 9 of them), every `when`, the speakers' labels (the fox, the little
 * dragon), tokens, storyboards, word counts, the art vocabulary (Reynard, Squall, the roof, the
 * border, the pile in rows), the staging the art builders asked for, the time of day, the generated
 * storyboard, every frame rendered with everyone in the picture, the beats in order on every path,
 * every test the Build notes list, the book (with Squall's page only for a cat who found him) on
 * every combination, the teaser for chapter 5, and a whole play-through of every combination
 * through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch04.test.js   prints the whole chapter, rendered three ways.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
require('../app/ui.js');   // its pure parts: the speakers' labels, the glitter Tap's hit test
const E = PC.engine;
const A = PC.art;
const story = PC.story.ch04;
const frames = story.frames;
const ids = Object.keys(frames);
const STORIES = [PC.story.ch01, PC.story.ch02, PC.story.ch03, story];

/* ------------------------------------------------------------------ the contract */

// The flags a `when` may test: chapter 1's, chapter 2's, chapter 3's, and chapter 4's own two (both
// set by reaching a frame, never by a choice, and never unset)
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
const FLAGS = Object.assign({}, FLAGS1, FLAGS2, FLAGS3, FLAGS4);
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'gift', 'when', 'sets', 'card'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 35, WORDS_MAX = 50;
// Time of day comes from fx: morning from the hiccup to the pile, day from the border to the bridge,
// sunset at tonight's pile, dusk at the den, night in her nest. The roof alone names none: it is
// drawn in its own afternoon gold, between the day and the sunset
const TOD = ['morning', 'day', 'sunset', 'dusk', 'night'];
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat'];
const BEASTS = ['riffle', 'otter', 'dog', 'sprinkle', 'reynard', 'squall'];
const RIM_ANCHORS = ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'];
const CARD_IDS = ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'squall-shapes', 'sprinkle-scales', 'cant-fly'];

/* ------------------------------------------------------------------ helpers */

function exits(f) { return E.exits(f); }
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
/* The lines a cat with these flags sees on a frame (the engine decides). */
function seen(f, flags) {
  const cat = { flags: flags || {}, look: { sex: 'she' } };
  return E.captions(f, cat).concat(E.balloons(f, cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []);
}
function words(t) { return String(t).split(/\s+/).filter(w => /[\p{L}\p{N}{]/u.test(w)).length; }
function tokensIn(t) { return (String(t).match(/\{[^}]*\}/g) || []).map(s => s.slice(1, -1)); }
const T = id => texts(frames[id]).map(x => x.text).join(' ');
const castOf = (id, who) => frames[id].scene.cast.filter(c => c.who === who);
const at = id => ids.indexOf(id);
const camOf = id => frames[id].scene.set + '/' + frames[id].scene.cam;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/* The one frame that says this (a line of the text finds its panel). */
function F(re) {
  const hit = ids.filter(id => re.test(T(id)));
  assert.equal(hit.length, 1, 'exactly one frame says ' + re + ' (' + hit.join(' ') + ')');
  return hit[0];
}

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'I dreamed the fox wore a wall.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A giant squirrel combed its tail.' },
  // a player whose own Clan name is Murmur: the new warrior is Mutterchime
  murmur: { name: 'Murmur', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Ten, twenty, thirty.' }
};
const FACT = { a: 4, b: 10, answer: 40, groups: 4, per: 10, thing: 'front claw', things: 'front claws' };
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
 * taps, her cards, the Counts lines, the book, the teaser. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast', 'fastAfterMiss', 'again', 'remembered', 'rememberedSlow'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l, ok: FACT_TOKENS })));
    ['miss', 'missLast', 'helpIntro', 'helpIntroFar', 'helpIntroNotFive', 'helpIntroNotTen', 'againIntro', 'done', 'fillIntro'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: FACT_TOKENS }); });
    ['firstPrompt', 'prompt'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: PROMPT_TOKENS }); });
    (d.facts || []).forEach((f, i) => {
      if (Array.isArray(f)) return;
      [].concat(f.prompt || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' prompt ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
      if (typeof f.retryPrompt === 'string') out.push({ set: sid, where: 'fact ' + i + ' retryPrompt', text: f.retryPrompt, ok: PROMPT_TOKENS });
      [].concat(f.right || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' right ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
      [].concat(Array.isArray(f.rightAgain) ? f.rightAgain : []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' rightAgain ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
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
    // the instruction under a page she taps ("**Tap** the cats, left to right."): the engine's words, or the frame's own
    if (f.skip && f.skip.prompt) fn(id, { where: 'skip prompt', text: f.skip.prompt });
    if (f.scratch || f.file) fn(id, { where: 'tap prompt', text: E.tapWords(f).prompt });
  });
  Object.keys(story.cards).forEach(cid => {
    fn('card ' + cid, { where: 'line', text: story.cards[cid].line });
    if (story.cards[cid].link) fn('card ' + cid, { where: 'link line', text: story.cards[cid].link.line });
  });
  countsLines().forEach(x => fn('counts ' + x.set, x));
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  ['title', 'chapterTitle', 'dream', 'noDream'].forEach(k => { if (story.book[k]) fn('book', { where: k, text: story.book[k] }); });
  story.book.dragonet.lines.forEach((l, i) => fn('book', { where: 'dragonet line ' + i, text: l }));
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

// the tower choice: its two options lead to different afternoons (going up, or not today); no flag
const TOWER = ids.find(id => frames[id].choice && frames[id].choice.options.some(o => o.labelWhen));
/* The frames a reader with these flags walks through, in order. A frame whose `when` doesn't match
 * is passed over, as if its next led straight on; a frame's `sets` are flags from then on (and never
 * unset); the tower choice goes `up` or not; a light choice takes its first option, or `light: 1`
 * its second. The flags as they ended are on the result (`.flags`). */
function walk(flags, o) {
  o = o || {};
  const cat = { flags: Object.assign({}, flags), look: { sex: 'she' } };
  const out = [];
  let id = story.start;
  for (let guard = 0; guard < 400 && id; guard++) {
    const f = frames[id];
    if (f.when && !E.matches(f.when, cat)) { id = exits(f)[0]; continue; }
    out.push(id);
    if (f.sets) Object.assign(cat.flags, f.sets);
    if (f.end) { out.flags = cat.flags; return out; }
    if (f.choice) id = (id === TOWER ? f.choice.options[o.up ? 0 : 1] : f.choice.options[o.light || 0]).next;
    else id = exits(f)[0];
  }
  throw new Error('no end');
}
/* What a walk put on screen: for each frame, the lines its reader saw there (with the flags she had
 * when she reached it). */
function walkLines(flags, o) {
  const cat = { flags: Object.assign({}, flags), look: { sex: 'she' } };
  return walk(flags, o).map(id => {
    const f = frames[id];
    const row = { id, lines: E.captions(f, cat).concat(E.balloons(f, cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []) };
    if (f.sets) Object.assign(cat.flags, f.sets);
    return row;
  });
}
/* Every combination of told or kept, the chapter 2 path, the specialty, the worry and the tower
 * choice: 160 (her stone and chapter 1's other choices change one line or none). */
const COMBOS = [];
for (const ch3Told of FLAGS3.ch3Told) for (const ch2Path of FLAGS2.ch2Path) for (const specialty of FLAGS1.specialty) {
  for (const worry of FLAGS1.worry) for (const up of [true, false]) COMBOS.push({ flags: { ch3Told, ch2Path, specialty, worry, ch2Stone: 'nose' }, up });
}
const comboName = c => JSON.stringify(c.flags) + (c.up ? ' up' : ' not today');
/* The two afternoons: the frames from each of the tower choice's options down to where they meet. */
const branch = first => { const out = []; for (let id = first; /[ab]$/.test(id); id = exits(frames[id])[0]) out.push(id); return out; };
const [UP, NOT] = frames[TOWER].choice.options.map(o => branch(o.next));
const isUp = id => UP.includes(id);

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch04');
  assert.equal(story.number, 4);
  assert.equal(story.title, 'The Glittering Scale');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.ok(ids.length >= 120, 'a full chapter of panels (' + ids.length + ')');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'names', 'number', 'start', 'teaser', 'title']);
  // the fox and the littlest dragonet until each is named on screen
  assert.deepEqual(story.names, { reynard: 'The fox', squall: 'The little dragon' });
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch04'), order.indexOf('ch03') + 1, 'chapter 4 follows chapter 3');
  assert.ok(Object.values(frames).every(f => !/^STUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 160);
});

test('frame ids run f001, f002… in reading order; every edge goes forward; the numbers have no gaps; the letters say which branch', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}[a-z]?$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  const nums = [...new Set(ids.map(id => +id.slice(1, 4)))].sort((a, b) => a - b);
  nums.forEach((n, i) => assert.equal(n, i + 1, 'frame number ' + (i + 1) + ' is missing'));
  // a lettered frame is a branch: a choice leads into it, or the frame before it in its own branch
  const into = {};
  ids.forEach(id => exits(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  ids.filter(id => /[a-z]$/.test(id)).forEach(id => {
    const from = into[id] || [];
    assert.ok(from.some(p => frames[p].choice || p.slice(-1) === id.slice(-1)), id + ' is reached from a choice or from its own branch');
    assert.ok(['a', 'b'].includes(id.slice(-1)), id + ': two letters are enough');
  });
  // the tower choice: going up is `a`, "Not today" is `b`, side by side, and both meet under the Old Bridge
  assert.ok(TOWER, 'the tower choice');
  const up = UP, not = NOT;
  assert.ok(up.every(id => /a$/.test(id)) && not.every(id => /b$/.test(id)));
  assert.deepEqual(frames[TOWER].choice.options.map(o => o.next), [up[0], not[0]], 'up, then not today');
  assert.ok(up.length >= 12 && up.length <= 16, 'the way up and the roof: ' + up.length);
  assert.equal(not.length, 3, 'not today: ' + not.join(' '));
  assert.equal(up[0].slice(1, 4), not[0].slice(1, 4), 'the two afternoons run side by side under the same numbers');
  const meet = n => exits(frames[n[n.length - 1]])[0];
  assert.equal(meet(up), meet(not), 'both afternoons meet again');
  assert.match(T(meet(up)), /Under the Old Bridge, two big eyes shine\./, 'under the Old Bridge');
  assert.match(meet(up), /^f\d{3}$/, 'at a plain number');
  // every other lettered frame is a light choice's outcome: one panel, then the same next screen
  ids.filter(id => /[a-z]$/.test(id) && !up.includes(id) && !not.includes(id)).forEach(id => {
    assert.ok(frames[into[id][0]].choice, id + ': a light choice’s outcome');
    assert.equal(into[id][0].slice(-1).match(/[a-z]/), null, id + ': its choice is on the main line');
  });
});

// The frames shown only `when` they match, in reading order: each is a screen of its own for some
// readers, and the page turns straight past it for everyone else
const WHEN_FRAMES = [
  [/She gives you a slow wink/, { ch3Told: true }],
  [/You sniff your paws/, { ch3Told: false }],
  [/Wait\. FLEW\?/, { specialty: 'noticing' }],
  [/Shouldn’t we tell Glintstar about Sprinkle\?/, { ch3Told: true }],
  [/One hole in his story/, { specialty: 'noticing' }],
  [/No cat goes LOOKING for it/, { ch3Told: true }],
  [/Not one paw under the Old Bridge, Tallyheart said/, { ch3Told: false }],
  [/It’s only a very tall curtain, really/, { specialty: 'climbing' }],
  [/Take the little room, darling!/, { not: { specialty: 'climbing' } }],
  [/The elevator!/, { not: { specialty: 'climbing' } }],
  [/They peek over Tallyheart’s branch/, { ch3Told: true }],
  [/^Under the Old Bridge, two big eyes shine\.$/, { ch3Told: false }],
  [/Five and five/, { foundSquall: true }],
  [/I WISH\./, { specialty: 'noticing', ch3Told: false }],
  [/Your tummy flips over/, { worry: 'water' }],
  [/Your paws can’t wait/, { specialty: 'swimming', not: { worry: 'water' } }],
  [/Squall saw two skinny shapes/, { foundSquall: true }],
  [/^The TRACKS\? At NIGHT\?$/, { foundSquall: true }],
  [/Raft first\./, { foundSquall: true }],
  [/That was a fair question you asked at the border/, { not: { ch3Told: true, foundSquall: false } }]
];

test('exactly one interaction per frame (the taps and the file included), no unknown keys, and a frame `when` or `sets` only where the text has one', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    assert.equal(f.look, undefined, id + ': chapter 4 has no look frame');
    assert.equal(f.gift, undefined, id + ': chapter 4 gives no gift (nobody picks the “scale” up)');
    assert.equal(f.else, undefined, id + ': no frame needs an else here (chapter 5’s offer of the roof will)');
  });
  const whens = ids.filter(id => frames[id].when);
  assert.deepEqual(whens.map(id => frames[id].when), WHEN_FRAMES.map(w => w[1]));
  whens.forEach((id, i) => {
    assert.match(T(id), WHEN_FRAMES[i][0], id);
    assert.ok(exits(frames[id]).length === 1, id + ': one way on');
    assert.ok(['next', 'skip', 'counts'].includes(E.kindOf(frames[id])), id);
    assert.notEqual(id, story.start);
    // its own lines never ask for less than the frame does: every reader it shows to reads something
    Object.keys(frames[id].when).forEach(k => assert.ok(k === 'not' || FLAGS[k], id + ': when ' + k));
  });
  // the two flags set by reaching a frame, for good: the noticing catch at the border, the roof's last frame
  const sets = ids.filter(id => frames[id].sets);
  assert.deepEqual(sets.map(id => frames[id].sets), [{ ch4CaughtFly: true }, { foundSquall: true }]);
  assert.match(T(sets[0]), /Wait\. FLEW\? Sprinkle’s wing droops\. She can’t fly!/);
  assert.deepEqual(frames[sets[0]].when, { specialty: 'noticing' }, 'only a noticing cat reaches it');
  assert.match(T(sets[1]), /Tell Sprinkle: five\. She’ll know\./);
  assert.ok(frames[sets[1]].skip && isUp(sets[1]), 'the roof scene’s last frame, with the forepaw Tap');
  assert.equal(exits(frames[sets[1]])[0], exits(frames[NOT[NOT.length - 1]])[0], 'the page after it is under the bridge: nothing of the roof comes after the flag');
  // no choice sets either (Back replaces what a choice set), and no choice sets anything at all
  ids.filter(id => frames[id].choice).forEach(id => frames[id].choice.options.forEach(o => assert.deepEqual(o.sets, {}, id)));
});

test('every next / option / input / counts / skip / scratch / file target exists, and every frame is reachable', () => {
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const seenIds = new Set([story.start]);
  const stack = [story.start];
  while (stack.length) exits(frames[stack.pop()]).forEach(n => { if (!seenIds.has(n)) { seenIds.add(n); stack.push(n); } });
  assert.deepEqual(ids.filter(id => !seenIds.has(id)), [], 'unreachable frames');
  // and by a reader: every frame is on some path a reader takes (every combination, both light options)
  const walked = new Set();
  for (const c of COMBOS) for (const light of [0, 1]) walk(c.flags, { up: c.up, light }).forEach(id => walked.add(id));
  assert.deepEqual(ids.filter(id => !walked.has(id)), [], 'frames no reader reaches');
});

test('the end is reachable from every frame, and there is exactly one end, the last frame', () => {
  const ends = ids.filter(id => frames[id].end);
  assert.deepEqual(ends.length, 1);
  const into = {};
  ids.forEach(id => exits(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  const ok = new Set(ends);
  const stack = ends.slice();
  while (stack.length) (into[stack.pop()] || []).forEach(p => { if (!ok.has(p)) { ok.add(p); stack.push(p); } });
  assert.deepEqual(ids.filter(id => !ok.has(id)), [], 'frames that cannot reach the end');
  assert.equal(ends[0], ids[ids.length - 1], 'the end is the last frame');
});

test('choices: seven a reading (six light ones and the tower), labels short, no flag set, every light one rejoins at once', () => {
  const choiceIds = ids.filter(id => frames[id].choice);
  assert.equal(choiceIds.length, 7, 'seven choices: ' + choiceIds.join(' '));
  const light = choiceIds.filter(id => id !== TOWER);
  choiceIds.forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length === 2, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), id === TOWER ? ['label', 'labelWhen', 'next', 'sets'] : ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 16, id + ' option ' + i + ' label');
      assert.equal(o.when, undefined, id + ': both options are for everyone');
    });
  });
  light.forEach(id => {
    // a light choice: her pick is shown by a frame of its own, then the same next screen
    const opts = frames[id].choice.options;
    opts.forEach(o => {
      assert.match(o.next, /^f\d{3}[ab]$/, id + ': ' + o.next + ' is its outcome');
      assert.equal(o.next.slice(1, 4), String(+id.slice(1, 4) + 1).padStart(3, '0'), id + ': the outcome is the next number');
      assert.equal(E.kindOf(frames[o.next]), 'next', id + ': an outcome is one panel');
    });
    assert.deepEqual(opts.map(o => o.next.slice(-1)), ['a', 'b']);
    assert.equal(frames[opts[0].next].next, frames[opts[1].next].next, id + ': a light choice rejoins at once');
    assert.match(frames[opts[0].next].next, /^f\d{3}$/, id);
  });
  // every reader meets all seven, whichever way she goes
  for (const c of COMBOS) assert.equal(walk(c.flags, { up: c.up }).filter(id => frames[id].choice).length, 7, comboName(c));
  // the text's six, in its order, each pick shown as the text has it
  const L = id => frames[id].choice.options.map(o => o.label);
  const O = (id, i) => T(frames[id].choice.options[i].next);
  const [scale, fox, fair, look, mark, tell] = light;
  assert.deepEqual(L(scale), ['Look THROUGH it.', 'Look INTO it.']);
  assert.match(O(scale, 0), /^The whole camp goes wavy, and a little green\. Just like the patio door in the rain\.$/);
  assert.match(O(scale, 1), /^A tiny cat looks back, with your face\. Just like in the patio door, every evening\.$/);
  assert.deepEqual(L(fox), ['Sit close to Tallyheart.', 'Look at his eyes.']);
  assert.match(O(fox, 0), /^Her shoulder is warm against yours\.$/);
  assert.match(O(fox, 1), /^They aren’t smiling at all\.$/);
  assert.deepEqual(L(fair), ['“Glintstar! Do we blame what we haven’t seen?”', '“Did anyone else see it?”']);
  assert.match(O(fair, 0), /^Ah, but I HAVE seen\. With these very eyes\.$/);
  assert.match(O(fair, 1), /^Only me\. Foxes stay up late\.$/);
  assert.deepEqual(L(look), ['Nod.', 'Stand up tall.']);
  assert.match(O(look, 0), /^Glintstar nods back, just once\.$/);
  assert.match(O(look, 1), /^It isn’t very tall\. Glintstar sees you anyway\.$/);
  assert.deepEqual(L(mark), ['An eye: I saw it myself.', 'An ear: somebody told me.']);
  assert.match(O(mark, 0), /^Did you see it fly\? …No\.$/);
  assert.match(O(mark, 1), /^Sharp\.$/);
  assert.deepEqual(L(tell), ['“I know you didn’t.”', '“A thief would have kept Riffle’s juggling pebble. You rolled it back.”']);
  assert.match(O(tell, 0), /^The tail lifts a little\.$/);
  assert.match(O(tell, 1), /^My FIFTH favorite!$/);
  // both fair questions are questions (so "a fair question" is true whichever she picked), eight words at most
  L(fair).forEach(l => { assert.match(l, /\?”$/); assert.ok(words(l) <= 8, l); });
  // the two labels that differ by one word put that word in capitals
  assert.deepEqual(L(scale).map(l => l.replace(/THROUGH|INTO/, '_')), ['Look _ it.', 'Look _ it.']);
  // the tower choice, between the mark and what she tells Sprinkle
  assert.ok(at(TOWER) > at(mark) && at(TOWER) < at(tell));
  assert.deepEqual(L(TOWER), ['Go up and find him. Right now.', 'Not today. Sprinkle first.']);
  // a spoken option is never echoed as a balloon on its outcome
  choiceIds.forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    if (said) (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
});

test('the tower choice: no flag; a cat who has met him reads it his way; a climber reads “You could climb that” over it, and keeps the climb if she says “Not today”', () => {
  const f = frames[TOWER], opts = f.choice.options;
  assert.deepEqual(opts.map(o => o.labelWhen), [[{ when: { foundSquall: true }, label: 'Go up and see Squall again.' }], [{ when: { foundSquall: true }, label: 'Not today. He’s guarding.' }]]);
  const fresh = { flags: { specialty: 'climbing', ch2Path: 'river' } }, met = { flags: { specialty: 'friends', ch2Path: 'bridge', foundSquall: true } };
  assert.deepEqual(opts.map(o => E.optionLabel(o, fresh)), ['Go up and find him. Right now.', 'Not today. Sprinkle first.']);
  assert.deepEqual(opts.map(o => E.optionLabel(o, met)), ['Go up and see Squall again.', 'Not today. He’s guarding.']);
  // "Not today" gives a reason of the player's own, true on both chapter 2 paths (never "He's safe up high")
  everyText((id, x) => assert.doesNotMatch(x.text, /safe up high/i, id + ' ' + x.where));
  // the roar's two lines by chapter 2 path, and the climber's line, are captions over the choice itself
  assert.deepEqual(E.captions(f, fresh), ['The same roar as before. Sprinkle’s littlest brother!', 'Balcony, balcony, balcony, roof. You could climb that.']);
  assert.deepEqual(E.captions(f, met), ['A roar with a hiccup, just as Sprinkle said. Her littlest brother!']);
  // everything after the two afternoons reads the sticky flag, never this reading's choice
  ids.filter(id => at(id) > at(TOWER)).forEach(id => texts(frames[id]).forEach(x => {
    assert.ok(!x.when || !('up' in x.when), id);
  }));
});

test('inputs, counts, skips, taps and the file frame, in the text’s order', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  assert.match(T(inputs[0]), /^What did \{name\}paw dream about, the night \{they\} started \{their\} Case File\?$/);
  const ph = frames[inputs[0]].input.placeholder;
  assert.ok(typeof ph === 'string' && ph.length <= 30 && /fox|bark|hiccup/.test(ph), ph);
  // five Counts moments (four without Squall)
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => frames[id].counts.set), ['ch04-claws', 'ch04-tens', 'ch04-pile', 'ch04-riddle', 'ch04-night']);
  counts.forEach(id => {
    assert.deepEqual(Object.keys(frames[id].counts).sort(), ['next', 'set'], id);
    assert.ok(story.counts[frames[id].counts.set], id + ': the counts set exists');
  });
  assert.ok(isUp(counts[3]), 'the riddle is on the roof');
  // four skip-counts (three without Squall): the rim, his forepaw, the promise, the bedtime tens
  const skips = ids.filter(id => frames[id].skip);
  assert.equal(skips.length, 4);
  const [rim, paw, promise, bed] = skips.map(id => frames[id].skip);
  assert.deepEqual(rim, { table: 10, groups: 5, who: rim.who, thing: 'claw', things: 'claws', keep: true, prompt: '**Tap** the cats, left to right.', next: rim.next });
  assert.equal(rim.who.length, 5);
  assert.deepEqual(rim.who[4], { who: 'grizzled' }, 'the fifth cat is the old tom');
  assert.ok(rim.who.slice(0, 4).every(w => w.who === 'clancat' && w.variant), 'four Clan cats before him');
  assert.equal(new Set(rim.who.map(w => w.who + (w.variant || ''))).size, 5, 'five different cats');
  assert.ok(!rim.who.some(w => w.who === 'murmurchime' || w.who === 'mutterer'), 'never chapter 3’s list: Murmurchime is on patrol');
  assert.equal(E.skipView(rim, 5).count, '10… 20… 30… 40… 50!');
  assert.deepEqual(E.skipView(rim, 5).totals, [10, 20, 30, 40, 50]);
  assert.match(T(skips[0]), /^Hop by tens\. Ten, twenty, thirty! Touch each cat, and hop with me\.$/);
  // the totals stay on the page it turns to ("FIFTY!") and on the tens' Counts frame, for the pattern line
  assert.deepEqual(E.keptSkip(story, rim.next), { id: skips[0], skip: rim });
  assert.match(T(rim.next), /^FIFTY! Now hold still\.$/);
  assert.equal(frames[rim.next].next, counts[1], 'FIFTY, then the tens');
  assert.deepEqual(E.keptSkip(story, counts[1]), { id: skips[0], skip: rim });
  assert.equal(E.keptSkip(story, frames[counts[1]].counts.next), null, 'never past the lesson');
  assert.match(T(counts[1]), /^Five cats, ten front claws each\. Five times ten makes fifty\. And every number you land on ends in a zero\.$/);
  assert.deepEqual(E.skipInto(story, rim.next), rim, 'a big 50 on the page the fifth tap turns to');
  // Squall's forepaw: one tap, five claws, a big 5; it stays on the roof (`carry: false`)
  assert.deepEqual(paw, { table: 5, groups: 1, who: [{ who: 'squall' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: paw.next });
  assert.deepEqual([E.skipView(paw, 1).total, E.skipView(paw, 1).done, E.skipView(paw, 1).count], [5, true, '5!']);
  assert.equal(E.skipWords(paw, 'squall').label, 'Tap his forepaw.');
  for (const told of [true, false]) assert.equal(E.skipInto(story, E.landing({ flags: { ch3Told: told } }, story, paw.next), { flags: { ch3Told: told } }), null, 'no big 5 under the bridge');
  // the promise: three taps, ten claws a friend, the count in her own balloon; the panel after it letters 10, 20, 30 itself
  assert.deepEqual(promise, { table: 10, groups: 3, thing: 'claw', things: 'claws', teacher: 'player', paws: 'pile', prompt: '**Tap** the paws.', carry: false, next: promise.next });
  assert.deepEqual([1, 2, 3].map(n => E.skipView(promise, n).total), [10, 20, 30], 'the promise reaches 30 on its third tap');
  assert.deepEqual([E.skipView(promise, 2).done, E.skipView(promise, 3).done, E.skipView(promise, 3).count], [false, true, '10… 20… 30!']);
  assert.deepEqual([E.skipWords(promise, 'player').teacher, E.skipWords(promise, 'player').label], ['player', 'Count the next friend.']);
  assert.equal(E.skipPicture(promise, 2).paws, 'promise');
  assert.match(T(skips[2]), /^Yours go on top\. Then Riffle’s\. Three friends, ten claws each\.$/);
  assert.match(T(promise.next), /^A thirty-claw promise! That beats fifteen\.$/);
  assert.equal(frames[promise.next].scene.opts.hop, true, 'all thirty lit, 10, 20 and 30 lettered beside their rows');
  // the bedtime tens: both forepaws together, five taps, her murmur trailing off
  assert.deepEqual(bed, { table: 10, groups: 5, thing: 'claw', things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', next: bed.next });
  assert.equal(E.skipView(bed, 5).count, '10… 20… 30… 40… 50…', 'sleepy, no exclamation mark');
  assert.deepEqual([0, 1, 4, 5].map(n => E.skipView(bed, n).nextPaw), ['both', 'both', 'both', null]);
  assert.deepEqual([E.skipWords(bed).teacher, E.skipWords(bed).whisper, E.skipWords(bed).label], ['player', true, 'Tap your forepaws.']);
  assert.match(T(skips[3]), /^Ten\. Twenty\. Thirty…$/);
  assert.match(T(bed.next), /^By fifty, he’s snoring\./);
  assert.deepEqual(E.skipInto(story, bed.next), bed, 'a big 50 over the dark');
  assert.ok(castOf(bed.next, 'snorer').length, 'the grey tom, asleep');
  // 13 counting taps with no misses, 14 with Squall
  assert.equal(skips.reduce((n, id) => n + frames[id].skip.groups, 0), 14);
  // the three pages she taps: the glitter, the one curl, the row of bark; then the page that opens her file
  const taps = ids.filter(id => frames[id].scratch);
  assert.deepEqual(taps.map(id => Object.keys(frames[id].scratch).sort()), [['next', 'tap'], ['draws', 'next'], ['cards', 'head', 'next', 'prompt']]);
  const [glint, curl, row] = taps.map(id => frames[id].scratch);
  assert.equal(glint.tap, 'glint');
  assert.deepEqual(E.tapWords(frames[taps[0]]), { kind: 'tap', prompt: '**Tap** the glitter.', label: 'Look at the glitter.' });
  assert.match(T(taps[0]), /^Then the sun slides over the towers\. And in the gap, something glitters\.$/);
  assert.match(T(glint.next), /^It’s as big as your paw: flat, smooth, and shaped like a giant fish’s scale\./, 'the tap turns to the close-up');
  assert.equal(curl.draws, 'four-a-night');
  assert.deepEqual(E.tapWords(frames[taps[1]]), { kind: 'draws', prompt: '**Tap** the bark to scratch it.', label: 'Scratch the bark' });
  assert.match(T(taps[1]), /^A case file! A place to keep everything you find out\.$/);
  assert.deepEqual(frames[curl.next].card, { id: 'four-a-night', mark: false }, 'the frame it turns to gives the card, no mark on it yet');
  assert.deepEqual(row, { head: ['four-a-night'], cards: ['tidy', { id: 'dug-earth', when: { specialty: 'noticing' } }, 'scale'], prompt: '**Tap** each piece of bark to scratch what you saw.', next: row.next });
  assert.equal(E.tapWords(frames[taps[2]]).label, 'Scratch the next piece of bark');
  const files = ids.filter(id => frames[id].file);
  assert.equal(files.length, 1);
  assert.deepEqual(frames[files[0]].file, { next: frames[files[0]].file.next });
  assert.deepEqual(E.tapWords(frames[files[0]]), { prompt: '**Tap** your Case File. You can open it any time.', label: 'Open your Case File' });
  assert.match(T(files[0]), /^And every time you find something out… Skritch\.$/);
  // seven Taps, eight with Squall: the rim, the glitter, the first bark, the row of bark, the Case File itself, Squall's forepaw, the promise, the bedtime tens
  const order = [counts[0], skips[0], counts[1], counts[2], taps[0], taps[1], taps[2], files[0], TOWER, counts[3], skips[1], skips[2], counts[4], skips[3], inputs[0]];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  for (const c of COMBOS) {
    const p = walk(c.flags, { up: c.up });
    const n = p.filter(id => frames[id].skip || frames[id].scratch || frames[id].file).length;
    assert.equal(n, c.up ? 8 : 7, comboName(c) + ': ' + n + ' Taps');
    assert.equal(p.filter(id => frames[id].counts).length, c.up ? 5 : 4, comboName(c));
    // the first thing she does is the warm-up, on her sixth panel
    assert.equal(p.findIndex(id => E.kindOf(frames[id]) !== 'next'), 5, comboName(c));
  }
});

/* ------------------------------------------------------------------ text */

// The voices a panel doesn't draw: the new warrior's shout from outside the panel, "somebody" at the
// back of the Clan, and the bridge's close-up on six paws
const OFF_PANEL = ids.filter(id => /GLINTSTAR!/.test(T(id))).map(id => id + ' murmurchime')
  .concat(ids.filter(id => /A pillow cat, sticking up for a DRAGON\?/.test(T(id))).map(id => id + ' clancat'))
  .concat(ids.filter(id => /Three friends, ten claws each\./.test(T(id))).map(id => id + ' player'))
  .concat(ids.filter(id => /A thirty-claw promise!/.test(T(id))).flatMap(id => [id + ' riffle', id + ' sprinkle']));

test('every balloon speaker is in that frame’s cast, but for the voices heard and not seen; balloons and captions are well formed', () => {
  const off = [];
  assert.equal(OFF_PANEL.length, 5);
  ids.forEach(id => {
    const f = frames[id];
    const by = {};
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(typeof b.name === 'string' && b.name.trim() && !tokensIn(b.name).length, id + ' say ' + i + ' name');
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      const n = f.scene.cast.filter(c => c.who === b.who).length;
      if (!n) {
        off.push(id + ' ' + b.who);
        assert.ok(f.scene.cam === 'paws' || b.who === 'murmurchime' || b.name === 'Somebody', id + ': ' + b.who + ' is heard but not drawn, so it needs a reason');
      }
      by[b.who] = (by[b.who] || 0) + 1;
    });
    Object.keys(by).forEach(who => {
      const n = f.scene.cast.filter(c => c.who === who).length;
      if (n > 1) assert.ok(by[who] <= n, id + ': ' + by[who] + ' balloons from ' + n + ' ' + who + 's');
    });
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
  assert.deepEqual(off.sort(), OFF_PANEL.slice().sort(), 'the voices heard and not seen');
  // every reader sees some text on every frame she reaches, on every combination (a `when` line is never all of it)
  for (const c of COMBOS) for (const light of [0, 1]) {
    walkLines(c.flags, { up: c.up, light }).forEach(r => { if (!frames[r.id].end) assert.ok(r.lines.length > 0, r.id + ' shows no text to ' + comboName(c)); });
  }
  // "somebody mutters": nobody's face on it; the new warrior's shout keeps hers (she is not in the picture)
  const Sp = PC.ui.speakers;
  const mutter = frames[ids.find(id => /A pillow cat/.test(T(id)))].say[0];
  assert.deepEqual([mutter.who, mutter.name, Sp.faceHidden(mutter, undefined)], ['clancat', 'Somebody', true]);
});

test('speakers: “The fox” until Glintstar names him, “The little dragon” until “I’m Squall”, on every balloon of the riddle too', () => {
  const Sp = PC.ui.speakers, cat = E.blankCat({});
  cat.name = 'Fern';
  const label = b => Sp.label(b, { cat, story, fill: t => E.fill(t, cat) });
  // the chapter's own labels for the two of them
  assert.equal(label({ who: 'reynard' }), 'The fox');
  assert.equal(label({ who: 'squall' }), 'The little dragon');
  // Reynard: Glintstar says his name before he says a word, so every balloon of his carries it
  const named = F(/You are at our border, Reynard\./);
  const fox = ids.filter(id => (frames[id].say || []).some(b => b.who === 'reynard'));
  assert.ok(fox.length >= 8, 'the fox speaks on ' + fox.length + ' panels');
  assert.equal(fox[0], named, 'his first word comes after his name');
  assert.equal(frames[named].say[0].who, 'glintstar');
  fox.forEach(id => frames[id].say.filter(b => b.who === 'reynard').forEach(b => { assert.equal(b.name, 'Reynard', id); assert.equal(label(b), 'Reynard'); }));
  // nobody else says his name before she does, and no caption does
  ids.slice(0, at(named)).forEach(id => assert.doesNotMatch(T(id), /Reynard/, id));
  // Squall: no balloon on the roof up to and including the riddle is labelled "Squall"; every one of his after "I'm Squall" is
  const intro = F(/…I’m Squall\. I’m the littlest\. And the LOUDEST\./);
  const riddle = ids.find(id => frames[id].counts && frames[id].counts.set === 'ch04-riddle');
  assert.ok(at(riddle) < at(intro));
  const his = ids.filter(id => (frames[id].say || []).some(b => b.who === 'squall'));
  his.filter(id => at(id) < at(intro)).forEach(id => frames[id].say.filter(b => b.who === 'squall').forEach(b => {
    assert.equal(b.name, undefined, id);
    assert.equal(label(b), 'The little dragon', id);
  }));
  assert.ok(his.filter(id => at(id) < at(intro)).length >= 4, 'he blusters before he is named');
  his.filter(id => at(id) >= at(intro)).forEach(id => frames[id].say.filter(b => b.who === 'squall').forEach(b => {
    assert.equal(b.name, 'Squall', id);
    assert.equal(label(b), 'Squall', id);
  }));
  assert.ok(his.filter(id => at(id) >= at(intro)).length >= 4);
  // ... the balloon the page adds itself included: the "5!" under his own balloon on the forepaw Tap is Squall's
  // (the skip-count's counter takes the name its speaker carries on that page, PC.ui.speakers.nameOn)
  const pawTap = ids.find(id => frames[id].skip && frames[id].skip.groups === 1);
  assert.ok(at(pawTap) > at(intro));
  const tapWords = E.skipWords(frames[pawTap].skip, frames[pawTap].say[0].who), tapSay = E.balloons(frames[pawTap], cat);
  assert.equal(tapWords.teacher, 'squall');
  assert.deepEqual(tapSay.map(label).concat(label({ who: tapWords.teacher, name: Sp.nameOn(tapSay, tapWords.teacher) })), ['Squall', 'Squall'], 'his balloon, and the count under it');
  assert.equal(label({ who: 'squall' }), 'The little dragon', '(without it the count fell back to the chapter’s name for him)');
  // the other skip-counts' counters are labelled as they were: no name of the page's to take
  ids.filter(id => frames[id].skip && id !== pawTap).forEach(id => {
    const say = E.balloons(frames[id], cat), w = E.skipWords(frames[id].skip, say[0] && say[0].who);
    assert.equal(Sp.nameOn(say, w.teacher), undefined, id + ': ' + w.teacher);
  });
  // the riddle's frame carries a whole conversation (HALT! / Friend! / PROVE it!): its lesson does not say it again
  // over the first question (the page ran taller than the screen); the other lessons open with their one or two balloons
  ids.filter(id => frames[id].counts).forEach(id => {
    const said = E.balloons(frames[id], cat);
    assert.deepEqual(Sp.lessonIntro(said, false), id === riddle ? [] : said, id);
  });
  assert.equal(E.balloons(frames[riddle], cat).length, 3);
  // no caption or balloon before "I'm Squall" has his name (but for a cat who has met him already: the choice's label)
  ids.slice(0, at(intro)).forEach(id => assert.doesNotMatch(T(id), /Squall/, id));
  // the riddle's teacher is `squall`, so its question, its right line, its help, its fillers and its retry are "The little dragon"'s
  assert.equal(story.counts['ch04-riddle'].teacher, 'squall');
  // Sprinkle, hiding her face: "says the tail"
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'sprinkle' && b.name).forEach(b => {
    assert.equal(b.name, 'The tail', id);
    assert.equal(castOf(id, 'sprinkle')[0].pose, 'hide', id + ': the tail speaks only while she hides');
    assert.equal(Sp.faceHidden(b, castOf(id, 'sprinkle')[0]), true);
  }));
  // everyone else is named already
  ids.forEach(id => (frames[id].say || []).filter(b => !['reynard', 'squall', 'sprinkle'].includes(b.who) && b.name !== 'Somebody').forEach(b => assert.equal(b.name, undefined, id + ' ' + b.who)));
  // the new warrior, for a Murmur: Mutterchime
  cat.name = 'Murmur';
  assert.equal(label({ who: 'murmurchime' }), 'Mutterchime');
  assert.match(E.fill(T(F(/skids into camp/)), cat), /^Mutterchime skids into camp/);
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
  // a card's line has no tokens at all (it is lettered on bark, the same for everyone)
  Object.keys(story.cards).forEach(cid => assert.deepEqual(tokensIn(story.cards[cid].line), [], cid));
});

test('word counts: about 15 words a frame, never more than 50 (every variant at once, and as each combination reads it)', (t) => {
  const over = [];
  ids.forEach(id => {
    const all = texts(frames[id]).reduce((n, x) => n + words(x.text), 0);
    assert.ok(all <= WORDS_MAX, id + ' has ' + all + ' words, every variant counted');
    if (all > WORDS_AIM) over.push(id + ' (' + all + ')');
  });
  if (over.length) t.diagnostic('over ' + WORDS_AIM + ' words with every variant: ' + over.join(', '));
  const stats = { up: [], not: [] };
  for (const c of COMBOS) {
    const rows = walkLines(c.flags, { up: c.up });
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(s), 0));
    const w = per.reduce((a, b) => a + b, 0);
    rows.forEach((r, i) => assert.ok(per[i] <= WORDS_MAX, r.id));
    // no screen with nothing to do on it is longer than 41 words for its reader (the text's measure)
    rows.forEach((r, i) => { if (E.kindOf(frames[r.id]) === 'next') assert.ok(per[i] <= 41, r.id + ': ' + per[i] + ' words and nothing to do'); });
    stats[c.up ? 'up' : 'not'].push({ n: rows.length, w });
    // the text: about 101-108 panels without Squall and 110-117 with him; chapter 3 read at 14.1-15.1 words a frame
    if (c.up) assert.ok(rows.length >= 108 && rows.length <= 118, comboName(c) + ': ' + rows.length + ' frames');
    else assert.ok(rows.length >= 97 && rows.length <= 106, comboName(c) + ': ' + rows.length + ' frames');
    assert.ok(w / rows.length >= 13.5 && w / rows.length <= 18, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
  }
  for (const k of ['not', 'up']) {
    const s = stats[k], mm = f => Math.min(...s.map(f)) + '–' + Math.max(...s.map(f));
    t.diagnostic((k === 'up' ? 'with Squall: ' : 'without Squall: ') + mm(x => x.n) + ' frames, ' + mm(x => x.w) + ' words, ' +
      (s.reduce((a, x) => a + x.w / x.n, 0) / s.length).toFixed(1) + ' a frame');
  }
  // the longest stretch with nothing to choose, type or tap is the fox's story, from her pick at the
  // border to the fair question: the text's 5 screens (6 for a noticing cat, whose catch is a screen of
  // its own) cut into 8 panels (9); chapter 3's longest was 11
  let longest = 0;
  for (const c of COMBOS) for (const light of [0, 1]) {
    let run = 0, worst = 0, from = null, first = null;
    walk(c.flags, { up: c.up, light }).forEach(id => {
      if (E.kindOf(frames[id]) !== 'next') { run = 0; return; }
      if (!run) from = id;
      if (++run > worst) { worst = run; first = from; }
    });
    assert.equal(worst, c.flags.specialty === 'noticing' ? 9 : 8, comboName(c) + ': ' + worst + ' panels in a row with nothing to do, from ' + first);
    assert.ok(frames[F(/There sits a fox, combing his enormous tail/)].choice.options.some(o => o.next === first), comboName(c) + ': the longest is the fox’s story (' + first + ')');
    longest = Math.max(longest, worst);
  }
  t.diagnostic('the longest run of panels with nothing to do: ' + longest + ' (the fox’s story)');
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
    // a board is for an illustrator: it never names the thieves, and never shows the fox's teeth
    assert.doesNotMatch(b, /weasel|teeth|fang|snarl/i, id);
  });
  // a frame shown only on a path says so in its shot line; a Tap page says what the tap does in play
  ids.filter(id => frames[id].when).forEach(id => assert.match(frames[id].board.split('. ')[0], /\b(ONLY|BUT|NOT FOR)\b/, id + ': the shot line says who sees it'));
  ids.filter(id => frames[id].skip || frames[id].scratch || frames[id].file).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].card).forEach(id => assert.match(frames[id].board, /card/, id + ': the board says the card appears'));
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
  // a tom's climb: "HE'S DOING IT!"
  const climb = F(/The OUTSIDE\?/);
  assert.match(fill(T(climb), PROFILES.tom), /The OUTSIDE\? HE’S DOING IT!/);
  assert.match(fill(T(climb), PROFILES['she-cat']), /The OUTSIDE\? SHE’S DOING IT!/);
});

test('our own world and the tone: no Warriors or Wings of Fire words; nobody names the thieves; the fox never frightens; nobody is hurt', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|apprentices’ den|assessment|from this day|claw-moon|quarter-moon|half-moon|whisker-lengths?|fox-lengths?|tail-lengths?|skymonsters?|monsters? of the sky)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|warriors’ den|claw-moon)\b/i, id + ' board'));
  // the text's names checks: the moon is "as thin as a curl of bark", never a whisker or a claw; no
  // distance is measured in whiskers; "dear lady" is lower case, never "Lady Glintstar"; "Tallwalker"
  // only in the Clan's "Tallwalker noise"; an airplane is Squall's "giant dragon"
  everyText((id, x) => {
    assert.doesNotMatch(x.text, /thin as a (whisker|claw)|a whisker (past|from|short)|Lady Glintstar|Fog\b|\bfog\b/, id + ' ' + x.where);
    (x.text.match(/Tallwalker\w*( \w+)?/g) || []).forEach(m => assert.equal(m, 'Tallwalker noise', id + ' ' + x.where));
  });
  assert.equal(ids.filter(id => /a moon as thin as a curl of bark/.test(T(id))).length, 1);
  assert.match(story.book.recap.map(r => r.text).join(' '), /a moon as thin as a curl of bark/);
  // nobody names the weasels, on any path: they are Squall's "two skinny shapes" and nothing more, and
  // nothing says they come out of camp (he sees them going along past it, to the tracks)
  everyText((id, x) => assert.doesNotMatch(x.text, /weasel|stoat|ferret|polecat/i, id + ' ' + x.where));
  everyText((id, x) => { if (/skinny shapes/.test(x.text)) assert.doesNotMatch(x.text, /(out of|from|in|into|inside) (your |our |the )?camp/i, id + ' ' + x.where + ': ' + x.text); });
  const shapes = ids.filter(id => /skinny/.test(T(id)));
  assert.ok(shapes.length === 2 && shapes.every(id => /two skinny shapes/.test(T(id))), 'only the two skinny shapes are skinny: ' + shapes.join(' '));
  // ... so the grey tom, who shares her den, is "the grey tom" at bedtime, never "skinny"
  everyText((id, x) => assert.doesNotMatch(x.text, /skinny grey/i, id + ' ' + x.where));
  assert.match(story.book.recap[story.book.recap.length - 1].text, /a grey tom who fell asleep by fifty/);
  // Reynard: charming, a liar, never frightening. No teeth, no threat, no pet word for her, and he
  // is never over the line: every one of his lines is to Glintstar, the Clan or the air
  const foxLines = ids.flatMap(id => (frames[id].say || []).filter(b => b.who === 'reynard').map(b => b.text));
  foxLines.forEach(l => assert.doesNotMatch(l, /teeth|tooth|\bbite|\beat\b|claws? (out|at)|little one|pillow|apprentice|remember you|I’ll|watch (out|your)|careful|sorry|or else/i, l));
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(teeth|tooth|fangs?|snarls?|growls?|bites?|bit|pounces on|attacks?)\b/i, id + ' ' + x.where));
  assert.ok(foxLines.includes('AT it, dear lady. Never over it. I have beautiful manners. Ask anyone.'));
  // his two lies, each in his own mouth, on two panels of their own; nobody answers either out loud
  const moon = F(/The rain stopped\. The moon came out\. And there, in the moonlight…/), flew = F(/It flew up out of your camp with its claws full of mice/);
  assert.notEqual(moon, flew);
  assert.ok(at(flew) > at(moon));
  [moon, flew].forEach(id => assert.ok(frames[id].say.every(b => b.who === 'reynard'), id + ': only the fox speaks there'));
  // the one who runs is the fox; nobody is hurt; nobody dies; nobody is lost; the "scale" is smooth at every edge and nobody touches it
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(lost|wound(ed)?|blood|bleed|bleeds|broken|crooked|die[sd]?|dead|kill(ed)?|bones?|cuts?|sharp edges?|hurts?)\b/i, id + ' ' + x.where));
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(pick|picks|picked|carry|carries|carried|hold|holds|held|lift|lifts|touch|touches)\b[^.]*\bscale\b/i, id + ' ' + x.where));
  ids.forEach(id => frames[id].scene.cast.forEach(c => assert.notEqual(c.holds, 'scale', id)));
  // nobody in camp says "eat" of the dragon; the Clan's fear is one word, on one panel
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(eat|eats|swallow|gulp)s? (us|you|cats|them)\b/i, id + ' ' + x.where));
  assert.equal(ids.filter(id => /Dragon\. Dragon\. DRAGON!/.test(frames[id].sfx || '')).length, 1);
  // the old tom is the first to say "dragon", and Glintstar answers it at once, in camp
  const first = ids.find(id => /dragon/i.test(T(id)));
  assert.match(T(first), /No snake has a scale that big\. That’s a DRAGON’s\./);
  assert.equal(frames[first].say[0].who, 'grizzled');
  assert.ok(at(F(/A scale is not a dragon\. And we don’t blame what we haven’t—/)) - at(first) <= 6, 'the leader answers within a few panels');
  // Glintstar forbids looking, never hunting (to hunt is to catch and eat); and no fresh order about the bridge
  everyText((id, x) => assert.doesNotMatch(x.text, /goes hunting for it|hunt(s|ing)? (for )?(the|a) dragon/i, id + ' ' + x.where));
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'glintstar').forEach(b => assert.doesNotMatch(b.text, /Old Bridge/, id)));
  // the warrior thread stays light: three touches, and nobody says when
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(\w+) to go\b|One day|when you(’re| are) a warrior|your Warrior Counts/i, id + ' ' + x.where));
  assert.equal(ids.filter(id => /first patrol as a warrior/.test(T(id))).length, 1);
  assert.match(T(F(/Four marks\./)), /^Four marks\. \{Murmur\}chime has ten\. She started with one\.$/);
  // nobody solves the case: the card says "like glass" and no more, and no line says who took the prey
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(is|it’s|was) (a piece of |window |tower )?glass[.!]|not a scale|stole the prey|the thie(f|ves) (is|are|was|were)\b/i, id + ' ' + x.where));
  assert.ok(ids.some(id => /Why would a dragon wear a WALL\?/.test(T(id)) && /I don’t know\. Yet\./.test(T(id))));
  // Squall never leaves his roof, flies at nothing, and is fed: the exchange that keeps him there
  assert.match(T(F(/Come down with me\?/)), /^Come down with me\? Can’t\. I’m GUARDING\. And my light brings me moths\. CRUNCHY ones\.$/);
  everyText((id, x) => assert.doesNotMatch(x.text, /only know how to fly|flies (down|off|at)|the edge of the roof|how far down|hungry/i, id + ' ' + x.where));
  // the height is funny, not frightening: the airplane sweeps over (never past), and nobody says how high
  assert.match(T(F(/An airplane sweeps over\./)), /ROOOOOAAAAARRRRR!/);
  everyText((id, x) => assert.doesNotMatch(x.text, /sweeps past|floors up|so high|long way down|dizzy/i, id + ' ' + x.where));
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab): the roof, the border, the pile in rows, Reynard, Squall and the new extras included', () => {
  const v = A.vocab;
  assert.ok(v && v.sets && v.sets.roof && v.otherPoses.reynard && v.otherPoses.squall && v.poses.includes('situp'), 'the art exposes chapter 4’s vocabulary');
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
      // a list of cards (the row of bark on the sand): this chapter's cards, written as a row of bark is
      else if (allowed === 'cards') {
        assert.ok(Array.isArray(val) && val.length >= 1 && val.length <= 6, id + ': ' + k + ' is a short list');
        val.forEach(c => {
          const cid = typeof c === 'string' ? c : c.id;
          assert.ok(story.cards[cid], id + ': ' + k + ' names a card of this chapter: ' + JSON.stringify(c));
          if (typeof c !== 'string') assert.deepEqual(Object.keys(c).sort(), ['id', 'when'], id + ': an entry is an id, or { id, when }');
        });
        assert.equal(s.opts.bark, 'row', id + ': cards go with the row of bark');
      }
      else assert.ok(allowed.some(x => same(x, val)), id + ': ' + k + '=' + JSON.stringify(val) + ' (compared by value)');
    });
    assert.ok(Array.isArray(s.cast), id + ': cast');
    const used = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'size', 'variant', 'flatEars', 'holds', 'claws', 'puffed', 'pebbles', 'wink', 'flick'].includes(k)), [], where + ': keys');
      assert.ok(v.cast.includes(c.who), where + ': unknown who');
      const isCat = CATS.includes(c.who);
      ['flatEars', 'claws', 'puffed', 'wink'].forEach(k => { if (c[k] !== undefined) assert.ok(c[k] === true && isCat, where + ': ' + k + ' is for a cat, and true'); });
      if (c.flick !== undefined) assert.ok(c.flick === true && c.who === 'reynard', where + ': flick is the fox’s one ear');
      if (c.pebbles !== undefined) assert.ok(c.who === 'riffle' && c.pose === 'juggle' && [4, 5].includes(c.pebbles), where + ': pebbles');
      // who holds what: only our cat, and only her bark (nobody holds the "scale")
      if (c.holds !== undefined) assert.ok(c.holds === 'bark' && c.who === 'player', where + ': holds ' + c.holds);
      if (c.claws) assert.ok(c.pose === 'pawup', where + ': claws out on a raised paw');
      const poses = isCat ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      if (isCat || BEASTS.includes(c.who)) assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      else assert.equal(c.mood, undefined, where + ': no mood');
      if (typeof c.at === 'object') {
        assert.deepEqual(Object.keys(c.at).sort(), ['x', 'y'], where + ': a spot is { x, y }');
        assert.ok(c.at.x >= 0 && c.at.x <= 1600 && c.at.y >= 0 && c.at.y <= 1000, where + ': the spot is in the world');
      } else assert.ok(set.anchors.includes(c.at), where + ': set ' + s.set + ' has no anchor ' + c.at);
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      if (c.size !== undefined) assert.ok(typeof c.size === 'number' && c.size > 0.3 && c.size < 2, where + ': size');
      if (c.variant !== undefined) {
        assert.ok(v.variants[c.who], where + ': only ' + Object.keys(v.variants).join('/') + ' have a variant');
        assert.ok(v.variants[c.who].includes(c.variant), where + ': variant ' + c.variant);
      }
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), id + ': unknown fx ' + e));
    assert.ok(!s.fx.some(e => ['rain', 'lightning'].includes(e)), id + ': no storm today');
  });
  // the skip-counts' and the lessons' pictures name only cast members
  ids.filter(id => frames[id].skip && frames[id].skip.who).forEach(id => frames[id].skip.who.forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
  Object.values(story.counts).forEach(d => d.facts.forEach(f => (f.who || []).forEach(w => assert.ok(v.cast.includes(w.who), w.who))));
  // every card has its drawing, and its mark is one the art knows
  Object.keys(story.cards).forEach(cid => {
    assert.ok(A.cardPictures[cid], 'a drawing for ' + cid);
    assert.ok(A.cardMarks.includes(story.cards[cid].mark), cid);
  });
});

test('staging the art builders asked for: Reynard, Squall, the border, the roof and the tower', () => {
  // Reynard: only at the border, only at his spot past the last post, never bigger than drawn, never
  // on the Clan's side; the smile slips on one panel only; the ear flicks when he hears of the Gathering
  const fox = ids.filter(id => castOf(id, 'reynard').length);
  assert.ok(fox.length >= 20, 'the fox is in ' + fox.length + ' panels');
  fox.forEach(id => {
    const s = frames[id].scene, r = castOf(id, 'reynard')[0];
    assert.equal(s.set, 'field', id);
    assert.ok(['border', 'border-two', 'border-fox'].includes(s.cam), id);
    assert.deepEqual([r.at, r.facing, r.size], ['fox', 'left', undefined], id + ': in the long grass past the post, facing the Clan');
    assert.equal(castOf(id, 'reynard').length, 1);
  });
  assert.deepEqual(fox.filter(id => castOf(id, 'reynard')[0].pose === 'slip'), [F(/For one heartbeat, the fox’s smile slips\./)], 'the slip: one panel');
  assert.deepEqual(fox.filter(id => castOf(id, 'reynard')[0].flick), [F(/At the Gathering, every Clan will hear your story, Reynard\./)], 'one ear flicks, once');
  assert.equal(castOf(F(/There sits a fox, combing his enormous tail/), 'reynard')[0].pose, 'comb');
  assert.equal(castOf(F(/I have beautiful manners/), 'reynard')[0].pose, 'chest');
  assert.equal(castOf(F(/Not the ducks\./), 'reynard')[0].pose, 'think');
  assert.equal(castOf(F(/^A DRAGON\.$/), 'reynard')[0].pose, 'lean');
  assert.equal(castOf(F(/Flap! Flap! Flap!/), 'reynard')[0].pose, 'flap');
  // every pose of his but the dash (he goes into the grass as a tail: the dogs' camera, `foxTail`)
  assert.deepEqual([...new Set(fox.map(id => castOf(id, 'reynard')[0].pose))].sort(), ['chest', 'comb', 'flap', 'lean', 'sit', 'slip', 'think']);
  const gone = F(/BYE, GIANT SQUIRREL!/);
  assert.deepEqual([camOf(gone), frames[gone].scene.opts.foxTail, castOf(gone, 'reynard').length], ['field/dogs', true, 0]);
  assert.ok(ids.filter(id => at(id) > at(gone)).every(id => !castOf(id, 'reynard').length), 'he does not come back');
  // the border: Glintstar in front, our cat and Tallyheart at her shoulders (Tallyheart between our cat
  // and the fox), the four behind in the wide and two-shot cameras only
  const border = ids.filter(id => frames[id].scene.set === 'field' && /^border/.test(frames[id].scene.cam));
  assert.ok(border.length >= 24);
  border.forEach(id => {
    const s = frames[id].scene;
    s.cast.forEach(c => {
      // (one panel has her at a spot of its own, tucked against Tallyheart's side: "Her shoulder is warm against yours.")
      if (c.who === 'player') assert.deepEqual(c.at, id === F(/Her shoulder is warm against yours\./) ? { x: 352, y: 988 } : 'left', id);
      if (c.who === 'tallyheart') assert.equal(c.at, 'right', id + ': her shoulder between the fox and our cat');
      if (c.who === 'glintstar') assert.equal(c.at, 'lead', id);
      if (/^back-/.test(c.at)) assert.ok(s.cam !== 'border-fox' && ['grizzled', 'snorter', 'snorer', 'murmurchime'].includes(c.who), id + ': ' + c.who + ' behind');
      if (c.who === 'dog') assert.match(c.at, /^dog-[123]$/, id);
      // in the fox's close-up only a grown cat's corner shows at `right`
      if (s.cam === 'border-fox' && c.at === 'right') assert.equal(c.who, 'tallyheart', id);
    });
    // she is at the front in every picture of the border but one: Glintstar's word to the fox alone
    assert.equal(castOf(id, 'player').length, id === F(/At the Gathering, every Clan will hear your story, Reynard\./) ? 0 : 1, id + ': our cat');
    assert.deepEqual(s.opts, {}, id);
  });
  assert.ok(new Set(border.map(camOf)).size === 3, 'all three border cameras');
  const wideBorder = border.find(id => frames[id].scene.cam === 'border');
  assert.deepEqual(frames[wideBorder].scene.cast.filter(c => /^back-/.test(c.at)).map(c => c.who), ['grizzled', 'snorter', 'snorer', 'murmurchime'], 'behind them: the old tom, the black-and-white apprentice, the grey tom and Murmurchime');
  // "Sit close to Tallyheart" is the two-shot; "Look at his eyes" the close-up, never full face (the art's rule)
  const foxChoice = F(/There sits a fox, combing his enormous tail/);
  assert.deepEqual(frames[foxChoice].choice.options.map(o => camOf(o.next)), ['field/border-two', 'field/border-fox']);
  assert.equal(camOf(foxChoice), 'field/border', 'his entrance: wide, both sides of the post');
  // no frame at the border holds the told path's whisper: it is on the way home, once he has gone
  const whisper = F(/Shouldn’t we tell Glintstar about Sprinkle\?/);
  assert.ok(frames[whisper].scene.set !== 'field' && at(whisper) > at(gone), whisper + ': away from the border, after the fox has gone');
  assert.deepEqual(frames[whisper].when, { ch3Told: true });
  border.forEach(id => assert.doesNotMatch(T(id), /tell Glintstar about Sprinkle|Not yet/, id));
  assert.ok(frames[whisper].say.every(b => b.kind === 'whisper'));
  // the dogs: three at the wire when they bounce up, and to see him off
  [F(/HI! Are you a GIANT SQUIRREL\?/), gone].forEach(id => assert.deepEqual(castOf(id, 'dog').map(c => c.variant), [1, 2, 3], id));
  // Squall: only on the roof, always at the foot of his pole; hugging it when she first sees him, the
  // pole let go at "She IS?", one forepaw up for "five"
  const sq = ids.filter(id => castOf(id, 'squall').length);
  assert.ok(sq.length >= 10);
  sq.forEach(id => {
    assert.equal(frames[id].scene.set, 'roof', id);
    assert.deepEqual([castOf(id, 'squall')[0].at, castOf(id, 'squall')[0].size], ['pole', undefined], id + ': on the roof’s floor, by the pole');
    assert.ok(isUp(id), id);
  });
  const P = re => castOf(F(re), 'squall')[0].pose;
  assert.equal(P(/a dragon no bigger than you hugs the pole/), 'hug');
  assert.equal(P(/AND STAY OUT, giant dragon!/), 'roar');
  assert.equal(castOf(ids.find(id => frames[id].sfx === 'RAWWWRRR… hic!' && frames[id].scene.set === 'roof'), 'squall')[0].pose, 'hiccup');
  assert.equal(P(/HALT! Friend, or NOT friend\?/), 'halt');
  assert.deepEqual([P(/Then his chin wobbles/), castOf(F(/Then his chin wobbles/), 'squall')[0].mood], ['hug', 'sad']);
  assert.equal(P(/She IS\?/), 'tall');
  assert.equal(P(/He points down, past your camp/), 'point');
  assert.equal(P(/CRUNCHY ones/), 'snap');
  assert.equal(P(/Tell Sprinkle: five/), 'pawup');
  assert.deepEqual([...new Set(sq.map(id => castOf(id, 'squall')[0].pose))].sort(), ['halt', 'hiccup', 'hug', 'pawup', 'point', 'roar', 'snap', 'tall'], 'every pose of his but plain sitting');
  // the roof: only the two of them, nobody at the wall (the set has no anchor there); its cameras as the Art needs list them
  const roof = ids.filter(id => frames[id].scene.set === 'roof');
  assert.deepEqual(roof, ids.filter(id => isUp(id) && frames[id].scene.set !== 'tower'), 'the roof is the going-up afternoon, after the way up');
  roof.forEach(id => {
    frames[id].scene.cast.forEach(c => assert.ok(['squall', 'player'].includes(c.who) && ['pole', 'beside', 'door'].includes(c.at), id));
    assert.deepEqual(frames[id].scene.fx, [], id + ': the roof’s own afternoon gold (no time of day named)');
  });
  assert.deepEqual([...new Set(roof.map(id => frames[id].scene.cam))].sort(), ['over', 'paw', 'pole', 'sky', 'two', 'wide']);
  assert.equal(camOf(roof[0]), 'roof/wide', 'first the whole roof');
  assert.equal(castOf(roof[0], 'player')[0].at, 'door', 'our cat by the door');
  assert.deepEqual([camOf(F(/An airplane sweeps over/)), frames[F(/An airplane sweeps over/)].scene.opts.plane], ['roof/sky', true]);
  assert.equal(camOf(F(/He points down, past your camp/)), 'roof/over');
  assert.equal(camOf(F(/The train tracks!/)), 'roof/over');
  assert.deepEqual(frames[F(/The train tracks!/)].scene.cast, [], 'the view alone');
  assert.equal(camOf(F(/Tell Sprinkle: five/)), 'roof/paw', 'the picture of the Tap');
  assert.equal(frames[F(/CRUNCHY ones/)].scene.opts.moth, true);
  // the seven little forepaws are in the grit from the frame after the riddle, never before he scratches them
  const riddle = ids.find(id => frames[id].counts && frames[id].counts.set === 'ch04-riddle');
  roof.forEach(id => { if (frames[id].scene.opts.grit === 'paws') assert.ok(at(id) > at(riddle) && ['two', 'pole', 'wide'].includes(frames[id].scene.cam), id); });
  assert.equal(frames[frames[riddle].counts.next].scene.opts.grit, 'paws');
  // the tower from below: Waffles' chime in every panel; our cat never back in her old room (`window`);
  // the riders' second screen has nobody at the tower's foot and the art's own small DING (no sound effect)
  const tower = ids.filter(id => frames[id].scene.set === 'tower');
  assert.ok(tower.length >= 6);
  tower.forEach(id => {
    assert.equal(frames[id].scene.opts.chime, true, id);
    frames[id].scene.cast.forEach(c => assert.notEqual(c.at, 'window', id + ': never her old room'));
    assert.ok(castOf(id, 'waffles').length === 1 && castOf(id, 'waffles')[0].at === 'railing', id);
  });
  const ding = F(/The elevator! You jump, and whack the top button\./);
  assert.deepEqual([camOf(ding), frames[ding].scene.opts.ding, frames[ding].sfx], ['tower/up', true, undefined], 'the DING is the art’s: no sound effect, or there would be two');
  assert.deepEqual(frames[ding].scene.cast.map(c => c.who + '@' + c.at), ['waffles@railing'], 'nobody at the foot of the tower');
  const room = F(/Take the little room, darling!/);
  assert.deepEqual([camOf(room), castOf(room, 'player')[0].at], ['tower/up', 'foot']);
  const climb = F(/It’s only a very tall curtain, really/);
  assert.deepEqual([camOf(climb), castOf(climb, 'player')[0].at], ['tower/up', 'corner'], 'a climber on a balcony halfway up');
  const roar = ids.find(id => frames[id].sfx === 'RAWWWRRR… hic!' && frames[id].scene.set === 'tower');
  assert.deepEqual([frames[roar].scene.opts.roar, frames[roar].scene.opts.light], [true, true], 'the red light at the very top, with jagged roar lines');
  assert.match(T(roar), /Your old tower, where the red light blinks\. The Clan calls it Tallwalker noise\./);
  // not today: the small roar is heard from the river path, looking back up at the roof
  const small = F(/Far above, a very small roar answers\./);
  assert.deepEqual([camOf(small), frames[small].sfx, frames[small].scene.opts.roar], ['riverbank/roof', '…hic!', true]);
  // the garden step: her dish
  assert.equal(frames[F(/slip through the hedge for a drink/)].scene.opts.dish, true);
  assert.equal(frames[F(/slip through the hedge for a drink/)].scene.set, 'garden');
});

test('staging, after the picture review: a friend beside our cat in every fox panel and under every scared face; no raised tail across a face; Sprinkle stays in her nook; the bedtime pictures match their captions', () => {
  // the fox is never alone with her: every picture with him and our cat has Tallyheart at `right`, between them
  const fox = ids.filter(id => castOf(id, 'reynard').length);
  const both = fox.filter(id => castOf(id, 'player').length);
  assert.ok(both.length >= 20);
  both.forEach(id => assert.deepEqual(castOf(id, 'tallyheart').map(c => c.at), ['right'], id + ': Tallyheart between the fox and our cat'));
  // "A DRAGON.": the one panel where he leans in is the two-shot at cat height, the front three and Tallyheart, never his close-up
  const lean = F(/^A DRAGON\.$/);
  assert.deepEqual([camOf(lean), frames[lean].scene.cast.map(c => [c.who, c.pose, c.at].join(' '))],
    ['field/border-two', ['reynard lean fox', 'glintstar stand lead', 'player sit left', 'tallyheart sit right']]);
  assert.match(frames[lean].board, /^MEDIUM, AT CAT HEIGHT, THE FOX LEANS IN\. .*Tallyheart’s shoulder is squarely between him and our cat/);
  assert.deepEqual(fox.filter(id => castOf(id, 'reynard')[0].pose === 'lean' && frames[id].scene.cam === 'border-fox'), [], 'leaning, his muzzle would lie over Tallyheart’s corner in the close-up');
  // (the art: in that two-shot he is over no cat, and smaller in the picture than Tallyheart)
  const rl = A.render(frames[lean].scene, { look: { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'she' } }), who = frames[lean].scene.cast.map(c => c.who);
  const head = w => rl.heads[who.indexOf(w)];
  ['glintstar', 'player', 'tallyheart'].forEach(w => {
    const d = Math.hypot((head('reynard').x - head(w).x) * 16, (head('reynard').y - head(w).y) * 10), reach = (head('reynard').r + head(w).r) * 16;
    assert.ok(d > reach * 1.15, 'his head is clear of ' + w + '’s: ' + d.toFixed(0) + ' against ' + reach.toFixed(0));
  });
  assert.ok(head('reynard').x > head('glintstar').x && head('glintstar').x > head('tallyheart').x && head('tallyheart').x > head('player').x, 'left to right: our cat, Tallyheart, Glintstar, and the fox beyond the post');
  assert.ok(head('reynard').r <= head('tallyheart').r, 'never bigger in a panel than Tallyheart');
  // scary only with a friend near: a scared or worried face of ours is never alone in its picture
  const FRIENDS = ['tallyheart', 'glintstar', 'riffle', 'sprinkle'];
  ids.forEach(id => castOf(id, 'player').filter(c => ['scared', 'worried'].includes(c.mood)).forEach(c => {
    assert.ok(frames[id].scene.cast.some(m => FRIENDS.includes(m.who)), id + ': ' + c.mood + ', with a friend in the picture');
  }));
  assert.deepEqual(ids.filter(id => castOf(id, 'player').some(c => c.mood === 'scared')).map(camOf), ['field/border-two', 'field/border'], 'scared twice, at the border, both times beside Tallyheart');
  // Tallyheart's `proud` raises her tail: never when our cat stands beside her (it crossed the standing cat's face),
  // never when she faces left in the two-shot (it would cross Glintstar's), never standing in the wide shot (the grey apprentice's)
  const TH = re => castOf(F(re), 'tallyheart')[0];
  assert.deepEqual([TH(/It isn’t very tall\. Glintstar sees you anyway\./).mood, TH(/It isn’t very tall\. Glintstar sees you anyway\./).facing], ['kind', 'right'], 'our cat’s whole face shows in the panel that pays off its choice');
  assert.deepEqual([TH(/An apprentice, asking a fair question\./).pose, TH(/An apprentice, asking a fair question\./).mood], ['stand', 'stern']);
  ids.filter(id => /^border/.test(frames[id].scene.cam || '')).forEach(id => castOf(id, 'tallyheart').filter(c => c.mood === 'proud').forEach(c => {
    assert.ok(c.pose === 'sit' && c.facing === 'right' && castOf(id, 'player').every(p => p.pose !== 'stand'), id + ': proud only sitting, facing the fox, beside a sitting cat');
  }));
  // when Glintstar turns to our cat, Tallyheart turns with her, out of the look (cheek to cheek, the leader peeked round her)
  [/Her eyes find you\./, /Until the full moon\. That’s how long Glintstar gave you, too\./, /Glintstar nods back, just once\./].forEach(re => {
    assert.deepEqual([castOf(F(re), 'glintstar')[0].facing, TH(re).facing], ['left', 'left'], String(re));
  });
  assert.equal(TH(/Glintstar nods back, just once\./).mood, 'dreamy', 'pretending not to notice, and plainly delighted');
  // "Her shoulder is warm against yours": tucked against her side
  assert.deepEqual(castOf(F(/Her shoulder is warm against yours\./), 'player')[0].at, { x: 352, y: 988 });
  // "Every face is turned to her": the two nearest Glintstar face her way
  const count = F(/Twelve pieces in three nights\./);
  assert.deepEqual(frames[count].scene.cast.filter(c => c.who !== 'glintstar').map(c => c.facing), ['right', 'right', 'right', 'right'], 'Glintstar is at the right, on the fountain’s edge');
  // one morning, one fountain: full of rain in the pile's pictures (the set's own), so full in the camp's too
  const camp = ids.filter(id => frames[id].scene.set === 'camp');
  assert.equal(camp.length, 2);
  camp.forEach(id => assert.deepEqual([frames[id].scene.opts.puddles, frames[id].scene.opts.rainFountain, frames[id].scene.fx.includes('morning')], [true, true, true], id));
  // Riffle's entrance: one balloon, as the text has it (a second is chained under the first, across his sliding body)
  const slide = F(/Riffle comes sliding down the bank/);
  assert.deepEqual(frames[slide].say, [{ who: 'riffle', text: 'Six rumors about a dragon as big as a BRIDGE! And I didn’t start ONE of them. Otter’s honor!' }]);
  // Sprinkle never vanishes from her own nook: from the panel she is met in, every picture inside the dark has her
  const met = F(/They peek over Tallyheart’s branch\./);
  ids.filter(id => frames[id].scene.set === 'bridge' && ['under', 'back'].includes(frames[id].scene.cam) && at(id) >= at(met)).forEach(id => {
    assert.ok(castOf(id, 'sprinkle').length === 1 || frames[id].scene.opts.eyes === 'sprinkle', id + ': Sprinkle, or her eyes');
  });
  [/Your tummy flips over\./, /A raft! Your paws can’t wait\./].forEach(re => {
    const sp = castOf(F(re), 'sprinkle')[0];
    assert.deepEqual([sp.pose, sp.at, sp.facing, frames[F(re)].scene.cast[0].who], ['sit', { x: 1000, y: 760 }, 'left', 'sprinkle'], String(re) + ': where the panel before left her');
    assert.match(frames[F(re)].board, /Sprinkle watches from her nook\./);
  });
  // bedtime: lying down, so the stone is under her chin or by her nose, as the caption says (sitting, it is at her paws either way)
  const skritch = F(/In your nest: skritch, skritch\./), wing = F(/you scratch one more: a drooping wing/);
  assert.deepEqual(castOf(skritch, 'player').map(c => c.pose), ['lie']);
  const STONE = /translate\(([-\d.]+) ([-\d.]+)\) rotate\(-?[\d.]+\)"><ellipse cx="0" cy="0" rx="([\d.]+)" ry="([\d.]+)" fill="#24252C"/;
  const nestCam = A.sceneInfo('den').cams.nest;
  const stoneAt = put => {
    const r = A.render(E.resolveScene(frames[skritch].scene, Object.assign(E.blankCat({}), { flags: { ch2Stone: put } }), STORIES), { look: { fur: 'calico', sex: 'she' } });
    const m = STONE.exec(r.svg), h = r.heads[0];
    return { x: +m[1], y: +m[2], ry: +m[4], hx: nestCam.x + h.x * nestCam.w / 100, hy: nestCam.y + h.y * nestCam.h / 100, hr: h.r * nestCam.w / 100 };
  };
  const chinS = stoneAt('chin'), noseS = stoneAt('nose');
  [chinS, noseS].forEach(st => assert.ok(st.y - st.ry - (st.hy + st.hr) < st.ry * 2, 'the stone is at her head, not down at her paws: ' + JSON.stringify(st)));
  assert.ok(Math.abs(chinS.x - chinS.hx) < chinS.hr, '“under your chin”: under her head: ' + JSON.stringify(chinS));
  assert.ok(noseS.hx - noseS.x > noseS.hr, '“by your nose”: out past her face, the way she is looking: ' + JSON.stringify(noseS));
  // ... and the last piece of bark is held up in both forepaws, clear of the stone at her feet
  assert.deepEqual(castOf(wing, 'player').map(c => [c.pose, c.holds]), [['situp', 'bark']]);
  assert.match(frames[wing].board, /holds one last piece of bark up in both forepaws/);
  // no board measures in tails or whiskers (the books' own measures)
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /tail[’']?s?[- ]lengths?|whisker[’']?s?[- ]lengths?|fox[- ]lengths?/i, id + ': board'));
});

test('staging: the den, the Hollow, the pile and the bridge', () => {
  // the den: no moon at night; the one moon at dusk, from outside; her stone where she put it; the
  // middle nest an empty ring all chapter; the grey tom asleep at sunrise and at bedtime
  const den = ids.filter(id => frames[id].scene.set === 'den');
  const skritch = F(/In your nest: skritch, skritch\./), moss = F(/Then the two pieces of bark about Sprinkle go under the moss\./);
  den.forEach(id => {
    const s = frames[id].scene, dusk = s.fx.includes('dusk');
    assert.equal(s.opts.stone, 'auto', id + ': her stone where she put it');
    assert.equal(s.opts.moon, dusk, id + ': a moon at dusk, none in the morning or at night');
    if (dusk) assert.equal(s.cam, 'outside', id + ': the thin moon shows from outside');
    assert.ok(s.cast.every(c => c.at !== 'sleeper-2' && c.who !== 'mutterer' && c.who !== 'murmurchime'), id + ': the middle nest is empty (she sleeps with the warriors)');
    // her Case File along her nest's edge from "skritch, skritch" on, never before (she has no bark that morning)
    assert.equal(s.opts.bark, at(id) >= at(skritch) && s.cam !== 'outside' ? 'auto' : undefined, id + ': bark');
    // ... and the two pieces about Sprinkle under the moss from the frame that puts them there, on both paths
    assert.equal(s.opts.hidden, at(id) >= at(moss) && s.cam !== 'outside' ? true : undefined, id + ': hidden');
    // at bedtime she faces one way in every panel, so the row stays on one side of her nest
    if (at(id) >= at(skritch)) castOf(id, 'player').forEach(c => assert.deepEqual([c.at, c.facing], ['nest', 'left'], id));
  });
  assert.equal(frames[moss].when, undefined, 'under the moss on both paths');
  assert.equal(texts(frames[moss]).length, 1);
  const moonF = F(/a moon as thin as a curl of bark/);
  assert.deepEqual([camOf(moonF), frames[moonF].scene.opts.moon, frames[moonF].scene.fx], ['den/outside', true, ['dusk']]);
  assert.equal(ids.filter(id => frames[id].scene.opts.moon === true).every(id => frames[id].scene.fx.includes('dusk')), true, 'the only moon so far');
  // E.resolveScene fills her row and her stone
  const cat = E.blankCat({}); cat.flags.ch2Stone = 'chin';
  ['four-a-night', 'tidy', 'scale'].forEach((cid, i) => E.giveCard(cat, cid, 'ch04', i + 1));
  const res = E.resolveScene(frames[skritch].scene, cat, STORIES);
  assert.deepEqual([res.opts.bark, res.opts.stone], [[{ picture: 'four-a-night', mark: 'eye' }, { picture: 'tidy', mark: 'eye' }, { picture: 'scale', mark: 'eye' }], 'chin'], 'her own cards, in order');
  assert.equal(frames[skritch].scene.opts.bark, 'auto', 'the story’s own scene is never changed');
  // the Hollow: three marks until the fourth is scratched, four from it on; the curl falls, lies on the sand, then a row
  const fourth = F(/A fourth claw mark\./);
  const hollow = ids.filter(id => frames[id].scene.set === 'hollow');
  hollow.forEach(id => {
    assert.equal(frames[id].scene.opts.marks, at(id) < at(fourth) ? 3 : 4, id);
    assert.equal(frames[id].scene.opts.glow, 'auto', id);
    assert.equal(frames[id].scene.opts.depth, undefined, id + ': depth by default (the first three a little deeper)');
  });
  assert.deepEqual([camOf(fourth), frames[fourth].scene.opts.bark, frames[fourth].sfx], ['hollow/tree', 'falling', 'SKRITCH!']);
  const drops = F(/A curl of bark drops by your paws\./);
  assert.equal(frames[drops].scene.opts.bark, 'falling');
  assert.equal(castOf(drops, 'player')[0].at, 'tree', 'our cat under the newest mark, where the curl falls');
  assert.deepEqual(castOf(drops, 'grizzled').map(c => c.pose + '@' + c.at), ['walk@tree-far'], 'behind it the old tom stalks off toward camp: he is at the pile first');
  assert.match(T(drops), /Both forepaws\. That’s your fourth Count\.$/);
  assert.equal(frames[F(/This morning’s curl of bark still lies in the sand\./)].scene.opts.bark, 'sand');
  assert.equal(frames[F(/She started with one\./)].scene.opts.bark, 'sand', 'planted at the end of the lesson');
  assert.equal(frames[F(/She peels off more bark\./)].scene.opts.bark, 'row');
  assert.equal(castOf(F(/She peels off more bark\./), 'tallyheart')[0].pose, 'stretch');
  // after the bark Tap the row on the sand is the row she scratched: the Tap's own list (the dug earth a
  // noticing cat's), one blank piece while Tallyheart asks which mark, then the fox's two as she scratches them
  const tapF = F(/She peels off more bark\./), TAPPED = frames[tapF].scratch.head.concat(frames[tapF].scratch.cards);
  assert.deepEqual(frames[tapF].scene.opts.cards, undefined, 'the Tap frame’s own scene: her first card and three blank pieces, as the storyboard has it');
  const rowAt = re => { const o = frames[F(re)].scene.opts; return [o.bark, o.cards, o.blank]; };
  [/Which mark\?$/, /^Did you see it fly\? …No\.$/, /^Sharp\.$/].forEach(re => assert.deepEqual(rowAt(re), ['row', TAPPED, 1], String(re) + ': the scratched row, and one blank piece'));
  assert.deepEqual(rowAt(/^You scratch an ear\.$/), ['row', TAPPED.concat('fox-flew'), undefined], 'the close-up has the fox card she is scratching');
  [/You scratch one more: a fox, and a moon\. Another ear\./, /One hole in his story\. Find me more\./].forEach(re => assert.deepEqual(rowAt(re), ['row', TAPPED.concat('fox-flew', 'fox-moon'), undefined], String(re)));
  assert.deepEqual(hollow.filter(id => frames[id].scene.opts.bark === 'row' && at(id) > at(tapF)).every(id => Array.isArray(frames[id].scene.opts.cards)), true, 'no panel after the Tap shows the row blank again');
  // ... and as each cat sees it: what the panel shows scratched is exactly what she holds of that row
  for (const specialty of ['noticing', 'friends']) {
    const c2 = E.blankCat({}); c2.flags.specialty = specialty;
    const shown = re => E.resolveScene(frames[F(re)].scene, c2, STORIES).opts.cards.map(c => c.picture + ':' + c.mark);
    const mine = ['four-a-night:eye', 'tidy:eye'].concat(specialty === 'noticing' ? ['dug-earth:eye'] : [], ['scale:eye']);
    assert.deepEqual(shown(/Which mark\?$/), mine, specialty);
    assert.deepEqual(shown(/^You scratch an ear\.$/), mine.concat('fox-flew:ear'), specialty + ': the fox card, with its ear');
    assert.deepEqual(shown(/Another ear\./), mine.concat('fox-flew:ear', 'fox-moon:ear'), specialty);
  }
  // the rim: the panel that says five cats shows exactly the five, sitting up, the old tom last
  const five = F(/Along the rim, five cats sit up too\./);
  const rimCast = id => frames[id].scene.cast.filter(c => RIM_ANCHORS.includes(c.at));
  assert.deepEqual(rimCast(five).map(c => c.at), RIM_ANCHORS);
  assert.deepEqual(rimCast(five).map(c => c.pose), ['situp', 'situp', 'situp', 'situp', 'situp']);
  assert.deepEqual([rimCast(five)[4].who, rimCast(five)[4].mood], ['grizzled', 'stern']);
  assert.match(T(five), /We look like squirrels\.$/);
  const skip = ids.find(id => frames[id].skip && frames[id].skip.who && frames[id].skip.table === 10);
  rimCast(skip).forEach((c, i) => assert.deepEqual({ who: c.who, variant: c.variant }, { who: frames[skip].skip.who[i].who, variant: frames[skip].skip.who[i].variant }, 'rim ' + (i + 1)));
  assert.deepEqual(frames[skip].scene.cast.filter(c => !RIM_ANCHORS.includes(c.at)).map(c => c.who + '@' + c.at), ['tallyheart@tree-far', 'player@sunpatch-2'], skip + ': the teacher apart');
  assert.equal(castOf(F(/Tallyheart sits up and holds out both forepaws\./), 'tallyheart')[0].pose, 'situp');
  assert.equal(frames[F(/Tallyheart sits up and holds out both forepaws\./)].sfx, 'Shhnk! Shhnk!');
  // FLUMP: all five in a heap, listed first to fifth
  const flump = ids.find(id => frames[id].sfx === 'FLUMP!');
  assert.equal(frames[flump].scene.opts.heap, true);
  assert.deepEqual(rimCast(flump).map(c => c.at), RIM_ANCHORS);
  assert.ok(rimCast(flump).every(c => ['fall', 'tummy', 'flat', 'lie'].includes(c.pose)));
  assert.equal(ids.filter(id => frames[id].scene.opts.heap).length, 1);
  assert.match(T(ids[at(flump) - 1]), /^NOW can we put them down\? Oh! I forgot you were there\.$/);
  // the pile, the third morning: rows of ten, never pairs; the back row a dark band until she walks to
  // it; then the gap and the dug earth; the "scale" and its glint from the frame where the sun reaches it
  const pile = ids.filter(id => frames[id].scene.set === 'pile');
  const reveal = F(/Then you come to the back row\. Right in the middle, there’s a hole\./), sun = F(/And in the gap, something glitters\./);
  const night = ids.find(id => frames[id].counts && frames[id].counts.set === 'ch04-night');
  const ROWS = [10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  pile.forEach(id => {
    const o = frames[id].scene.opts;
    assert.equal(o.pairs, undefined, id + ': rows, not pairs');
    if (id === night) return;
    assert.deepEqual(o.rows, ROWS, id + ': three rows of ten, four empty places in the middle of the back row');
    if (at(id) < at(reveal)) assert.deepEqual(o, { rows: ROWS, back: 'shadow' }, id + ': before the reveal the back row is a dark band: no gap, no dug earth, no “scale”');
    else {
      assert.equal(o.back, undefined, id);
      assert.equal(o.dug, 'big', id + ': the earth behind the gap freshly dug');
      assert.deepEqual([o.scale, o.glint], at(id) < at(sun) ? [undefined, undefined] : [true, true], id + ': the “scale” from the frame where the sun reaches it, and in every scene of this morning’s pile after');
    }
  });
  const pileCounts = ids.find(id => frames[id].counts && frames[id].counts.set === 'ch04-pile');
  assert.deepEqual(pile.filter(id => at(id) < at(reveal)), [pileCounts], 'the shadow lasts up to and including the Counts frame');
  assert.equal(frames[pileCounts].counts.next, reveal, 'then she walks to the back row');
  assert.equal(camOf(reveal), 'pile/gap');
  // the back row: six pieces with the gap at its centre (three, four empty places, three), as the four-a-night card draws it
  const back = ROWS[2];
  assert.deepEqual([back.gap[0], back.n - back.gap[back.gap.length - 1] - 1, back.gap.length, back.n - back.gap.length], [3, 3, 4, 6]);
  assert.deepEqual([camOf(sun), frames[sun].scratch.tap], ['pile/gap', 'glint']);
  // the three close-ups: the "scale" where it leans, the camp through it, her own face in it; no cast in them
  assert.deepEqual(['scale', 'through', 'mirror'].map(cam => ids.filter(id => camOf(id) === 'pile/' + cam).length), [1, 1, 1]);
  ids.filter(id => ['pile/scale', 'pile/through', 'pile/mirror'].includes(camOf(id))).forEach(id => assert.deepEqual(frames[id].scene.cast, [], id));
  const look = F(/look hard at the scale/);
  assert.deepEqual(frames[look].choice.options.map(o => camOf(o.next)), ['pile/through', 'pile/mirror']);
  // Glintstar counts the fours from the fountain's edge, twice in the picture (the count, and "A scale is not a dragon")
  [F(/Twelve pieces in three nights\./), F(/A scale is not a dragon/)].forEach(id => assert.deepEqual(castOf(id, 'glintstar').map(c => c.at), ['fountain-edge'], id));
  // tonight: four full rows, the "scale" where it was found, behind the back row; the old tom, Tallyheart and our cat
  // (beside this morning's dug earth, as the text's Art needs have it)
  assert.deepEqual(frames[night].scene.opts, { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' });
  assert.deepEqual([camOf(night), frames[night].scene.fx], ['pile/rows', ['sunset']]);
  assert.deepEqual(frames[night].scene.cast.map(c => c.who).sort(), ['grizzled', 'player', 'tallyheart'], 'Tallyheart is in the picture, so the help has its teacher');
  assert.ok(castOf(pileCounts, 'grizzled').length && castOf(pileCounts, 'grizzled')[0].at === 'beside', 'the old tom sits at the front of the pile');
  // the bridge: prints inside the dark, no drag marks from the bank; the branch only on the told path's
  // first panel, the eyes only on the kept path's; the six paws close up for the promise
  const bridge = (id, ...cams) => frames[id].scene.set === 'bridge' && cams.includes(frames[id].scene.cam);
  ids.filter(id => bridge(id, 'under', 'back')).forEach(id => {
    assert.equal(frames[id].scene.opts.prints, true, id + ': prints beside the drag marks');
    assert.notEqual(frames[id].scene.opts.drag, false, id);
  });
  ids.filter(id => bridge(id, 'bank', 'mouth')).forEach(id => assert.equal(frames[id].scene.opts.drag, false, id + ': no drag marks outside the dark'));
  const eyesT = F(/They peek over Tallyheart’s branch\./), eyesK = ids.find(id => frames[id].when && same(frames[id].when, { ch3Told: false }) && bridge(id, 'back'));
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.branch), [eyesT]);
  assert.deepEqual([castOf(eyesT, 'sprinkle')[0].pose, frames[eyesT].when], ['peek', { ch3Told: true }]);
  assert.ok(!['happy', 'laugh', 'sleepy', 'proud'].includes(castOf(eyesT, 'sprinkle')[0].mood), 'her eyes open over the heap');
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.eyes), [eyesK]);
  assert.deepEqual([frames[eyesK].scene.opts.eyes, castOf(eyesK, 'sprinkle').length], ['sprinkle', 0], 'only her eyes, exactly where her face is in the next panel');
  assert.equal(frames[eyesT].next, eyesK);
  ids.filter(id => bridge(id, 'paws')).forEach(id => { assert.equal(frames[id].scene.opts.pawsIn, 'both', id); assert.deepEqual(frames[id].scene.cast, [], id); });
  assert.equal(ids.filter(id => bridge(id, 'paws')).length, 2);
  // Sprinkle: face under her tail, the tail lifting, looking herself over, holding out her tail, one forepaw, both
  const SP = re => castOf(F(re), 'sprinkle')[0].pose;
  assert.equal(SP(/Sprinkle hides her face under her tail\./), 'hide');
  frames[F(/Sprinkle hides her face under her tail\./)].choice.options.forEach(o => assert.equal(castOf(o.next, 'sprinkle')[0].pose, 'tailup', o.next));
  assert.equal(SP(/Sprinkle looks herself over, nose to tail\./), 'check');
  assert.equal(SP(/She holds out her tail\./), 'tailout');
  assert.equal(SP(/Sprinkle holds up her own forepaw\./), 'pawup');
  assert.equal(SP(/Sprinkle holds out both forepaws\./), 'pawsup');
  assert.equal(castOf(F(/Riffle hugs his tail\./), 'riffle')[0].pose, 'hug');
  assert.equal(castOf(F(/Riffle comes sliding down the bank/), 'riffle')[0].pose, 'slide');
  assert.equal(camOf(F(/Riffle comes sliding down the bank/)), 'bridge/bank');
  // Riffle is under the bridge from "Riffle wriggles in beside you" on, on both afternoons
  const wriggle = F(/Riffle wriggles in beside you\./);
  ids.filter(id => bridge(id, 'under', 'back') && at(id) >= at(wriggle)).forEach(id => assert.ok(castOf(id, 'riffle').length, id + ': Riffle stays'));
  ids.filter(id => bridge(id, 'under', 'back') && at(id) < at(wriggle)).forEach(id => assert.ok(!castOf(id, 'riffle').length, id));
  // Tallyheart's wink (told), and our cat's one open eye at the hiccup
  assert.equal(castOf(F(/She gives you a slow wink/), 'tallyheart')[0].wink, true);
  assert.equal(castOf(story.start, 'player')[0].wink, true);
  assert.deepEqual(ids.filter(id => frames[id].scene.cast.some(c => c.wink)), [story.start, F(/She gives you a slow wink/)]);
});

test('the time of day runs morning, day (the roof in its own afternoon gold), sunset, dusk, night', () => {
  for (const c of COMBOS) {
    const p = walk(c.flags, { up: c.up });
    const tods = p.map(id => {
      const s = frames[id].scene, t = s.fx.filter(e => TOD.includes(e));
      if (s.set === 'roof') { assert.equal(t.length, 0, id + ': the roof names no time of day'); return TOD.indexOf('day'); }
      assert.equal(t.length, 1, id + ': exactly one time of day in fx (' + s.fx.join(',') + ')');
      return TOD.indexOf(t[0]);
    });
    for (let i = 1; i < p.length; i++) assert.ok(tods[i] >= tods[i - 1], p[i] + ' goes back in time');
  }
  assert.ok(frames[story.start].scene.fx.includes('morning'), 'the hiccup at sunrise');
  const tod = id => frames[id].scene.fx.find(e => TOD.includes(e));
  assert.equal(tod(F(/At the prey pile, the old tom is waiting/)), 'morning');
  assert.equal(tod(F(/There sits a fox/)), 'day');
  assert.equal(tod(F(/Under the Old Bridge, two big eyes shine\. They peek/)), 'day', '“Go before sunset”');
  assert.equal(tod(F(/At sunset, you and Tallyheart find the old tom/)), 'sunset');
  ids.filter(id => at(id) < at(F(/At sunset, you and Tallyheart/))).forEach(id => assert.ok(!frames[id].scene.fx.some(e => ['sunset', 'dusk', 'night'].includes(e)), id));
  assert.equal(tod(F(/In your nest: skritch, skritch\./)), 'night');
  assert.ok(frames[ids[ids.length - 1]].scene.fx.includes('night'), 'it ends at night');
});

test('the storyboard is this chapter’s: every frame, the panels a read-through as a reader walks them, the roof’s own light, the promise’s 10, 20 and 30', () => {
  const sb = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch04.md'), 'utf8');
  assert.doesNotMatch(sb, /\bSTUB\b|undefined|NaN|\[object/);
  // a frame on the main line is headed "### f001 · panel 1"; a branch's frames "##### f029a", under their option
  ids.forEach(id => assert.ok(new RegExp('^(### ' + id + ' · panel \\d+|##### ' + id + ')$', 'm').test(sb), 'the storyboard has ' + id));
  assert.equal((sb.match(/^#### Branch [AB] \(from f\d{3}\): /gm) || []).length, 14, 'two branches for each of the seven choices');
  assert.ok(sb.includes('| Frames | ' + ids.length + ' ('), 'every frame counted');
  // a read-through, counted the way a reader walks it: frames that don't show to her are not hers
  const lens = COMBOS.flatMap(c => [0, 1].map(light => walk(c.flags, { up: c.up, light }).length));
  assert.ok(sb.includes('| One read-through | ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels'), 'a read-through is ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels');
  assert.ok(sb.includes('| Choices | 7 |') && sb.includes('| Case File cards | 9 (6 eyes, 3 ears) |'));
  // the roof's light in its own words (no frame there names a time of day)
  assert.match(sb, /Roof: the roof of the tallest tower, flat and wide, in the gold of the afternoon/);
  // the promise's second panel: both forepaws of each friend, so the hop is lettered by tens
  assert.match(sb, /every friend’s ten claws lit warm gold, with 10, 20 and 30 lettered beyond them in pile order/);
  assert.doesNotMatch(sb, /5, 10 and 15 lettered/);
  // every frame shown only to some readers says so, and where the page turns for everyone else
  assert.equal((sb.match(/^\*\*Shows only if\*\* /gm) || []).length, ids.filter(id => frames[id].when).length);
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(camOf));
  assert.ok(pairs.size >= 36, 'only ' + pairs.size + ' set/camera pairs');
  const sets = new Set(ids.map(id => frames[id].scene.set));
  // two new places (the roof, the border, which is the field's far corner); the rest is chapters 1–3's
  assert.deepEqual([...sets].sort(), ['bridge', 'camp', 'den', 'field', 'garden', 'hollow', 'pile', 'riverbank', 'roof', 'title', 'tower']);
  ['rows', 'gap', 'scale', 'through', 'mirror', 'wide', 'low'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'pile/' + cam), 'the pile’s ' + cam));
  ['wide', 'pole', 'two', 'over', 'sky', 'paw'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'roof/' + cam), 'the roof’s ' + cam));
  ['wide', 'dogs', 'border', 'border-two', 'border-fox'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'field/' + cam), 'the field’s ' + cam));
  ['bank', 'under', 'back', 'paws'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'bridge/' + cam), 'the bridge’s ' + cam));
  // along any path a reader can take, never five panels in a row from the same camera
  for (const c of COMBOS) for (const light of [0, 1]) {
    const p = walk(c.flags, { up: c.up, light });
    let run = 1;
    for (let i = 1; i < p.length; i++) {
      run = camOf(p[i]) === camOf(p[i - 1]) ? run + 1 : 1;
      assert.ok(run < 5, p[i] + ': ' + run + ' panels in a row from ' + camOf(p[i]) + ' for ' + comboName(c));
    }
  }
});

test('every frame renders, and everyone in the cast is in the picture', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'black', marking: 'white-paws', eyes: 'odd' }, { sex: 'she', fur: 'calico', marking: 'none', eyes: 'amber' }];
  const off = [];
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose' } });
  CARD_IDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch04', i + 1));
  cat.flags.foundSquall = true;
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
        if (BEASTS.includes(c.who) || CATS.includes(c.who)) assert.ok(h.r >= 0.5, id + ': ' + c.who + ' face radius');
        assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, id + ': ' + c.who + ' head in the panel');
      }
    });
    // two speakers in one panel never share a face: their heads are apart (the fox's close-up, whose
    // corner cats are cut by the panel's edge on purpose, aside)
    if (k === 0 && sc.cam !== 'border-fox') {
      const sp = [...new Set((f.say || []).map(b => b.who))].map(w => cast.findIndex(c => c.who === w)).filter(i => i >= 0 && r.heads[i]);
      for (let i = 0; i < sp.length; i++) for (let j = i + 1; j < sp.length; j++) {
        const a = r.heads[sp[i]], b = r.heads[sp[j]];
        assert.ok(Math.hypot(a.x - b.x, (a.y - b.y) * 0.625) > (a.r + b.r) * 0.9, id + ': ' + cast[sp[i]].who + ' and ' + cast[sp[j]].who + ' speak from two faces');
      }
    }
  }));
  assert.deepEqual(off, [], 'cast members out of the camera’s sight');
  // the glitter Tap: the pile draws its glint where the page looks for it, well inside the panel
  const sun = ids.find(id => frames[id].scratch && frames[id].scratch.tap);
  const g = /data-art="glint"[\s\S]*?<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="none"\/>/.exec(A.render(frames[sun].scene, { look: looks[0] }).svg);
  assert.ok(g, 'the pile’s own glint, with its hit circle');
  assert.ok(+g[1] > 300 && +g[1] < 1300 && +g[2] > 250 && +g[2] < 800 && +g[3] >= 80, 'in the panel: ' + g.slice(1).join(' '));
  // the Counts pictures the chapter asks for all draw: every question of every set, the skip-counts tap by tap, the help's scratches
  const lookP = looks[0], pics = [];
  Object.keys(story.counts).forEach(sid => {
    const def = Object.assign({ id: sid }, story.counts[sid]);
    const st = E.counts.start(def, { set: sid });
    while (!E.counts.done(st)) {
      const q = E.counts.question(st), D = E.questionDef(def, q, story, STORIES);
      pics.push(A.countsPicture(Object.assign({ look: lookP }, E.lessonPicture(D, q, q.lit || 0))));
      // one miss of each of the set's own facts: its help is scratched out hop by hop
      const r = E.counts.answer(st, D, q.retry || q.filler ? q.answer : q.answer + 1, 2000, 1);
      if (!r.correct) { const plan = E.helpPlan(def, D, q, r); [0].concat(plan.nums).forEach(n => pics.push(A.sand(E.sandOpts(plan, n)))); }
    }
  });
  ids.filter(id => frames[id].skip).forEach(id => { for (let n = 0; n <= frames[id].skip.groups; n++) pics.push(A.countsPicture(Object.assign({ look: lookP }, E.skipPicture(frames[id].skip, n)))); });
  pics.push(A.countsPicture(Object.assign({ look: lookP }, E.keptPicture(frames[ids.find(id => frames[id].skip && frames[id].skip.keep)].skip))));
  CARD_IDS.forEach(cid => { pics.push(A.card({ picture: cid, mark: story.cards[cid].mark })); pics.push(A.card({ picture: cid, mark: story.cards[cid].mark, big: true })); });
  pics.push(A.card({ blank: true }), A.fileIcon());
  pics.forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
  assert.ok(pics.length > 120, pics.length + ' pictures');
});

/* ------------------------------------------------------------------ the beats the chapter must have */

test('the chapter’s beats are all there, in order, on every path', () => {
  const beats = [];
  const has = (id, re) => re.test(T(id));
  const beat = (label, pred) => {
    const id = ids.find(pred);
    assert.ok(id, 'missing beat: ' + label);
    beats.push([label, id]);
    return id;
  };
  const cap = (id, when, re) => (frames[id].caption || []).some(c => c.when && same(c.when, when) && re.test(c.text));
  const said = (id, when, re) => (frames[id].say || []).some(b => b.when && same(b.when, when) && re.test(b.text));
  beat('a hiccup, and one eye open', id => frames[id].sfx === '…hic!' && has(id, /You open one eye\. Was that a hiccup, far away and very high up\?/));
  beat('Up, up, up!', id => has(id, /Up, \{name\}paw! Up, up, up!/) && castOf(id, 'tallyheart').some(c => c.at === 'doorway'));
  beat('the wink (told)', id => has(id, /You two share a secret now\./));
  beat('fish on her paws (kept)', id => has(id, /Do they still smell of fish\?/));
  beat('eight gone; rows of ten', id => has(id, /Eight pieces gone in two nights\. So I made a rule\./) && has(id, /Rows of ten! Then if anything’s missing, a gap shows in a heartbeat\./));
  beat('By TENS? Both forepaws today', id => has(id, /The hunters stacked it my way last night\. And Glintstar wants you to count the rows\./) && has(id, /By TENS\?/) && has(id, /Both forepaws today\. Come on!/));
  beat('the warm-up, in the Hollow', id => frames[id].counts && frames[id].counts.set === 'ch04-claws' && has(id, /^Claws first, to wake up your whiskers\.$/) && frames[id].scene.set === 'hollow');
  beat('two forepaws, ten claws: hold on to that ten', id => has(id, /Two forepaws\. Ten claws\. Hold on to that ten\. Today’s Count is made of it\./));
  beat('a fish for every claw (told, kept)', id => cap(id, { ch3Told: true }, /^Her whiskers twitch\. You both know somebody who eats a fish for every claw\.$/) && cap(id, { ch3Told: false }, /^You know somebody who eats a fish for every claw\.$/));
  beat('we look like squirrels', id => has(id, /We look like squirrels\./));
  beat('the rim tap', id => frames[id].skip && frames[id].skip.table === 10 && frames[id].skip.who);
  beat('FIFTY! Now hold still', id => has(id, /FIFTY!/) && has(id, /Now hold still\./));
  beat('the tens lesson', id => frames[id].counts && frames[id].counts.set === 'ch04-tens');
  beat('NOW can we put them down?', id => has(id, /NOW can we put them down\?/) && has(id, /I forgot you were there\./));
  beat('FLUMP!', id => frames[id].sfx === 'FLUMP!');
  beat('a fourth claw mark', id => frames[id].sfx === 'SKRITCH!' && frames[id].scene.opts.marks === 4);
  beat('a curl of bark; your fourth Count', id => has(id, /A curl of bark drops by your paws\./) && has(id, /That’s your fourth Count\./));
  beat('she started with one', id => has(id, /She started with one\./));
  beat('the pile: three long rows', id => frames[id].counts && frames[id].counts.set === 'ch04-pile' && has(id, /^At the prey pile, the old tom is waiting beside three long rows\.$/));
  beat('the hole', id => has(id, /Right in the middle, there’s a hole\./));
  beat('you just saw it', id => has(id, /Four empty spaces, side by side\. All the other pieces lie in tidy rows\./) && has(id, /You didn’t count anything\. You just saw it\./));
  beat('the dug earth, again (noticing); a gap shows in a heartbeat', id => cap(id, { specialty: 'noticing' }, /^Behind the gap, the earth is freshly dug\. Again\.$/) && (frames[id].say || []).some(b => b.text === 'A gap shows in a heartbeat.' && b.kind === 'whisper'));
  beat('twelve in three nights', id => has(id, /Four the first night\. Four the next\. Four last night\./) && has(id, /Twelve pieces in three nights\./));
  beat('something glitters', id => frames[id].scratch && frames[id].scratch.tap === 'glint');
  beat('as big as your paw (and the shiny cat saw it first)', id => has(id, /shaped like a giant fish’s scale/) && cap(id, { worry: 'shiny' }, /^You saw it a heartbeat before anyone else\. You always do, with shiny things\.$/));
  beat('that’s a DRAGON’s', id => has(id, /That’s a DRAGON’s\./));
  beat('the word runs around camp (told: not a word; kept: the secret wriggles)', id => has(id, /The word runs around camp\./) && cap(id, { ch3Told: true }, /^Tallyheart’s eyes meet yours\. Not a word\.$/) && cap(id, { ch3Told: false }, /^Inside you, the secret wriggles\.$/));
  beat('everybody looks up; you look at the scale', id => frames[id].choice && has(id, /^Everybody looks up at the sky\. You think of Sprinkle, and look hard at the scale\.$/));
  beat('it’s like GLASS; probably MADE of glass', id => has(id, /It’s like GLASS\./) && has(id, /Dragon scales are probably MADE of glass\./) && castOf(id, 'snorter').length);
  beat('a scale is not a dragon— GLINTSTAR!', id => has(id, /we don’t blame what we haven’t—/) && has(id, /GLINTSTAR!/));
  beat('a FOX! And he’s SMILING', id => has(id, /A FOX! At the border!/) && has(id, /He says he saw who took our prey\. And he’s SMILING\./) && castOf(id, 'murmurchime').length);
  beat('past the Barking Field (sneaking: sock practice)', id => has(id, /past the Barking Field, to the long grass\./) && cap(id, { specialty: 'sneaking' }, /^You slip between the warriors’ legs, right to the front\. Sock practice\.$/));
  beat('the fox, smiling already (friends: this isn’t one)', id => frames[id].choice && has(id, /He’s smiling before anyone speaks\./) && cap(id, { specialty: 'friends' }, /^You know what a friend’s smile looks like\. This isn’t one\.$/));
  beat('at our border, Reynard', id => has(id, /You are at our border, Reynard\./));
  beat('not the ducks', id => has(id, /^He thinks\. Not the ducks\.$/));
  beat('with my OWN paws— In a storm? I adore weather', id => has(id, /With my OWN paws—/) && has(id, /In a storm\?/) && has(id, /I adore weather\./));
  beat('the moon came out', id => has(id, /The moon came out\./));
  beat('A DRAGON', id => has(id, /^A DRAGON\.$/) && frames[id].say[0].kind === 'whisper');
  beat('it flew. Flap!', id => has(id, /It flew up out of your camp/));
  beat('too good for a monster; would I fib? Yes', id => has(id, /Such a fine, dry den\. Too good for a monster\./) && has(id, /Would I fib\? Yes\.$/));
  beat('the catch (noticing)', id => has(id, /She can’t fly! And you can’t say so\. Not without telling everyone about Sprinkle\.$/));
  beat('cats are nodding; the fair question', id => frames[id].choice && has(id, /^But all around you, cats are nodding\.$/));
  beat('every head turns (small, talk)', id => has(id, /Every head turns to you\./) && cap(id, { worry: 'small' }, /^You’re the smallest cat at the border\. You said it anyway\.$/) && cap(id, { worry: 'talk' }, /^The words were out before you could stop them\. For once, you’re glad\.$/));
  beat('a pillow cat? An apprentice, asking a fair question', id => has(id, /A pillow cat, sticking up for a DRAGON\?/) && has(id, /An apprentice, asking a fair question\./));
  beat('the Accord; you never made that promise, Reynard', id => has(id, /It is a fair question\. The Mistscales keep the Accord: our promise not to hunt each other\./) && has(id, /You never made that promise, Reynard\./));
  beat('one fox says so; but there was a scale', id => has(id, /just because one fox says so\./) && has(id, /But there was a scale\./));
  beat('until the full moon; the Gathering', id => has(id, /The dragon has until the full moon\./) && has(id, /Then they decide if the dragon must leave the river\./));
  beat('no cat goes looking for it', id => has(id, /^Until then, no cat goes looking for it\.$/));
  beat('her eyes find you; something truer than a fox’s story', id => has(id, /^Her eyes find you\. And if any cat finds me something truer than a fox’s story, I will hear it\.$/));
  beat('that’s how long Glintstar gave you, too', id => frames[id].choice && has(id, /^Until the full moon\. That’s how long Glintstar gave you, too\.$/));
  beat('GIANT SQUIRREL?', id => frames[id].sfx === 'BOING! BOING!' && has(id, /Behind the fence, three dogs bounce up\./) && has(id, /HI! Are you a GIANT SQUIRREL\?/));
  beat('the smile slips. Must dash', id => has(id, /…Must dash\./));
  beat('and he does. BYE, GIANT SQUIRREL!', id => has(id, /^And he does\. BYE, GIANT SQUIRREL!$/));
  beat('the whisper on the way home (told)', id => has(id, /Not yet\. First we find out who took the prey\. Then we tell her everything\./));
  beat('my head is full of fox', id => has(id, /Back in the Training Hollow, you flop down under the leaning tree\./) && has(id, /My head is full of fox\./));
  beat('the Tall One’s glowing box', id => has(id, /On the Tall One’s glowing box, things went missing all the time\. And whoever found them always had one thing\./));
  beat('a case file! (her first tap on the bark)', id => frames[id].scratch && frames[id].scratch.draws === 'four-a-night');
  beat('four gone every night; a tally you can carry', id => frames[id].card && has(id, /^Four gone every night\. A tally you can carry! One piece of bark, one thing you know\.$/));
  beat('an eye, an ear (the row of bark)', id => frames[id].scratch && frames[id].scratch.cards && has(id, /An eye for what you saw yourself\. An ear for what you were only told\./));
  beat('which mark?', id => frames[id].choice && has(id, /^Now the fox’s story\. He says it FLEW\. Which mark\?$/));
  beat('you scratch an ear', id => frames[id].card === 'fox-flew' && has(id, /^You scratch an ear\.$/));
  beat('a fox, and a moon; a thing to check', id => frames[id].card === 'fox-moon' && has(id, /^You scratch one more: a fox, and a moon\. Another ear\. Not true yet\. Not false yet\. A thing to check\.$/));
  beat('over the bark (noticing: the whisper, or you can’t say so)', id => said(id, { specialty: 'noticing', ch3Told: true }, /^He said FLEW\. And she can’t\.$/) && said(id, { specialty: 'noticing', ch3Told: true }, /^One hole in his story\. Find me more\.$/) &&
    cap(id, { specialty: 'noticing', ch3Told: false }, /^One of them is false already\. But you can’t say so\.$/));
  beat('Skritch (her Case File, opened)', id => !!frames[id].file);
  beat('no cat goes LOOKING (told)', id => has(id, /^No cat goes LOOKING for it\. You don’t have to look\. Go before sunset\. Tell Sprinkle gently\.$/));
  beat('her own reason (kept)', id => has(id, /But you don’t have to look\. And Sprinkle should hear about the fox from a friend\.$/));
  beat('a drink at her old dish', id => has(id, /^You tuck your bark into your nest, and slip through the hedge for a drink\.$/));
  beat('the neighbors upstairs', id => has(id, /\{petname\}! DARLING!/) && has(id, /It’s the neighbors upstairs! Three days of ROARING! And the HICCUPS!/) && castOf(id, 'waffles').length);
  beat('the roar from her old tower', id => frames[id].sfx === 'RAWWWRRR… hic!' && has(id, /It comes from the roof of the tallest tower\./));
  beat('the tower choice (river, bridge, climbing)', id => id === TOWER && cap(id, { ch2Path: 'river' }, /^The same roar as before/) && cap(id, { ch2Path: 'bridge' }, /^A roar with a hiccup, just as Sprinkle said/) && cap(id, { specialty: 'climbing' }, /You could climb that\.$/));
  beat('under the Old Bridge, two big eyes', id => has(id, /Under the Old Bridge, two big eyes shine\./));
  beat('Riffle wriggles in; her littlest brother', id => has(id, /Riffle wriggles in beside you\./) && said(id, { foundSquall: true }, /^I found your littlest brother\. He says: five\.$/) &&
    said(id, { foundSquall: false }, /^Your littlest brother is still roaring\.$/) && said(id, { foundSquall: false }, /^Then he’s fine\. He only stops to sleep\.$/));
  beat('five and five (found)', id => has(id, /^Sprinkle holds up her own forepaw\. Five and five\. Ten\. That’s two of us\.$/));
  beat('she likes the dogs; the fox says it was you', id => has(id, /^Then you tell her: the missing prey, the shiny scale, the fox\. And the three dogs\. She likes the dogs\. The fox says it was you\.$/));
  beat('I DIDN’T! (and one vole, says the tail)', id => frames[id].choice && has(id, /I DIDN’T!/) && has(id, /I only ate Riffle’s fish!/) && (frames[id].say || []).some(b => b.name === 'The tail' && same(b.when, { ch3Told: false }) && b.text === 'And one vole. You gave me that one.'));
  beat('not shiny anywhere (shiny: me too)', id => has(id, /A SHINY scale\?/) && has(id, /I’m not shiny anywhere\. I’ve checked\. I LOVE shiny\./) && said(id, { worry: 'shiny' }, /^I know\. Me too\.$/));
  beat('then it’s not mine', id => frames[id].card === 'sprinkle-scales' && has(id, /You run a paw along it: bumpy, and soft, and grey as mist\./) && has(id, /Then it’s not mine\./));
  beat('why would a dragon wear a WALL?', id => has(id, /The clear stuff in Tall Ones’ walls\./) && has(id, /Why would a dragon wear a WALL\?/));
  beat('I WISH (noticing and kept)', id => has(id, /^And the fox says you FLEW\. I WISH\.$/));
  beat('one true thing at a time', id => has(id, /^I’m keeping a Case File\. One true thing at a time, until the whole Clan knows it wasn’t you\.$/));
  beat('Promise?', id => has(id, /^Sprinkle holds out both forepaws\. Promise\?$/));
  beat('the promise tap', id => frames[id].skip && frames[id].skip.paws === 'pile');
  beat('a thirty-claw promise', id => has(id, /A thirty-claw promise!/) && has(id, /That beats fifteen\./));
  beat('my RAFT!', id => has(id, /^And tomorrow: my RAFT! Somebody on this river was awake on the storm night\.$/));
  beat('the raft, for a cat who worries about water', id => cap(id, { worry: 'water', not: { specialty: 'swimming' } }, /^A raft\. On the deep water\. Your tummy flips over\. But Riffle will be right there\.$/) &&
    cap(id, { specialty: 'swimming', worry: 'water' }, /^A raft\. A dripping tap is one thing\. The deep river is another\. But Riffle will be right there\.$/));
  beat('the raft, for a swimmer', id => cap(id, { specialty: 'swimming', not: { worry: 'water' } }, /^A raft! Your paws can’t wait\.$/));
  // two panels: Riffle's squeak has its own, so its balloon sits over him (in our cat's panel it had to sit to the
  // right of hers, against Sprinkle's face)
  const shapes = beat('two skinny shapes (found)', id => has(id, /^Squall saw two skinny shapes going to the tracks\. Every night\.$/));
  const tracks = beat('the tracks, at night? (found)', id => has(id, /^The TRACKS\? At NIGHT\?$/));
  assert.deepEqual([frames[shapes].next, frames[shapes].say.map(b => b.who), frames[tracks].say.map(b => b.who)], [tracks, ['player'], ['riffle']], 'one speaker a panel, one after the other');
  assert.deepEqual([castOf(shapes, 'riffle')[0].pose, castOf(tracks, 'riffle')[0].pose, castOf(tracks, 'riffle')[0].mood], ['sit', 'stand', 'scared'], 'he shoots up on his hind legs as he squeaks');
  assert.deepEqual([frames[shapes].scene.set, frames[shapes].scene.cam, frames[shapes].scene.cast.map(m => m.at)], [frames[tracks].scene.set, frames[tracks].scene.cam, frames[tracks].scene.cast.map(m => m.at)], 'the same picture, nobody moved');
  beat('raft first (found)', id => has(id, /^Riffle hugs his tail\. Raft first\.$/));
  beat('tonight’s pile', id => frames[id].counts && frames[id].counts.set === 'ch04-night' && has(id, /^At sunset, you and Tallyheart find the old tom by tonight’s pile\.$/));
  beat('a moon as thin as a curl of bark', id => has(id, /^Low over the towers hangs a moon as thin as a curl of bark\. When it’s round, the Clans will gather\.$/));
  beat('at the den (kept: I’m right here; told and found: together)', id => cap(id, { ch3Told: false }, /^At the den, Tallyheart stops\. Her torn ear twitches\.$/) && said(id, { ch3Told: false }, /^That was a fair question you asked at the border\.$/) &&
    said(id, { ch3Told: false }, /^If you ever have one for me, I’m right here\.$/) && cap(id, { ch3Told: true, foundSquall: true }, /^At the den, you tell Tallyheart about Squall, and what he saw\.$/) && said(id, { ch3Told: true, foundSquall: true }, /^A thing to check\. Together\.$/));
  beat('skritch, skritch (her stone by her nose, or under her chin)', id => has(id, /In your nest: skritch, skritch\. Your Case File goes along the mossy edge\./) && cap(id, { ch2Stone: 'nose' }, /^Riffle’s stone is by your nose\.$/) && cap(id, { ch2Stone: 'chin' }, /^Riffle’s stone is under your chin\.$/));
  beat('a drooping wing (the search, or the hold)', id => same(frames[id].card, ['cant-fly', { id: 'fox-flew', when: { specialty: 'noticing' }, held: true }]) && has(id, /^Then, in the dark, you scratch one more: a drooping wing\./) &&
    cap(id, { not: { specialty: 'noticing' } }, /^She can’t go looking for her brothers and sisters\. So you will\.$/) && cap(id, { specialty: 'noticing' }, /^You hold it beside the fox’s FLEW\. They can’t both be true\.$/));
  beat('under the moss', id => has(id, /^Then the two pieces of bark about Sprinkle go under the moss\.$/) && frames[id].scene.opts.hidden === true);
  beat('do the paw thing', id => has(id, /^\{name\}paw\? What if the dragon comes here\? It won’t\. I promise\. …Do the paw thing\.$/) && castOf(id, 'snorer').length);
  beat('the bedtime tens', id => frames[id].skip && frames[id].skip.paws === 'both');
  beat('by fifty, he’s snoring; a hiccup (goodnight, Squall; or another day)', id => frames[id].sfx === '…hic!' && has(id, /By fifty, he’s snoring\./) && cap(id, { foundSquall: true }, /^Goodnight, Squall\.$/) &&
    cap(id, { foundSquall: false }, /^Sprinkle’s littlest brother is still up there\. You’ll go up another day\.$/));
  beat('plenty of bark', id => has(id, /^Tomorrow, you and Riffle will ask who was awake on the storm night\. And you have plenty of bark\.$/));
  beat('the Sky River', id => frames[id].scene.fx.includes('skyriver') && has(id, /^Over the rosebush, the Sky River shines, and you fall asleep\.$/));
  beat('the dream', id => frames[id].input && frames[id].input.kind === 'dream');
  beat('the end', id => frames[id].end);
  for (let i = 1; i < beats.length; i++) assert.ok(at(beats[i][1]) > at(beats[i - 1][1]), beats[i][0] + ' comes after ' + beats[i - 1][0]);

  // each afternoon in its own order
  const inOrder = (p, list, name) => {
    let last = -1;
    list.forEach(([label, pred]) => {
      const i = p.findIndex((id, k) => k > last && pred(id));
      assert.ok(i > last, name + ': path beat missing or out of order: ' + label);
      last = i;
    });
  };
  const upBeats = [
    ['the way up', id => has(id, /It’s only a very tall curtain|Take the little room, darling!/)],
    ['a dragon no bigger than you', id => has(id, /^On the wide, flat roof, a dragon no bigger than you hugs the pole of the red light\. He’s slate grey, with yellow flecks like sparks\.$/)],
    ['AND STAY OUT, giant dragon!', id => frames[id].sfx === 'ROOOOOAAAAARRRRR!' && has(id, /An airplane sweeps over\./) && has(id, /AND STAY OUT, giant dragon!/)],
    ['RAWWWRRR… hic!', id => frames[id].sfx === 'RAWWWRRR… hic!' && frames[id].scene.set === 'roof'],
    ['HALT! PROVE it! (the riddle)', id => frames[id].counts && frames[id].counts.set === 'ch04-riddle' && has(id, /^HALT! Friend, or NOT friend\? Friend! Sprinkle sent me\. PROVE it!$/)],
    ['and NOBODY’S MISSING!', id => has(id, /^And NOBODY’S MISSING!$/)],
    ['except everybody', id => has(id, /^Then his chin wobbles\. Except everybody\.$/)],
    ['I’m Squall; I noticed; I notice things TOO', id => has(id, /^Not Sprinkle\. She’s safe, under the Old Bridge\. She IS\? …I’m Squall\. I’m the littlest\. And the LOUDEST\. I noticed\. I notice things TOO\.$/)],
    ['two skinny shapes', id => has(id, /^He points down, past your camp\. Every night, two skinny shapes go sneaking along down THERE, carrying something\. To the long shiny lines\.$/)],
    ['the train tracks!', id => frames[id].card === 'squall-shapes' && has(id, /^The train tracks!$/)],
    ['GUARDING', id => has(id, /I’m GUARDING/)],
    ['tell Sprinkle: five', id => frames[id].skip && has(id, /^Tell Sprinkle: five\. She’ll know\.$/)]
  ];
  const notBeats = [
    ['LEAVING me with him?', id => has(id, /^You’re LEAVING me with him\? I’ll come back!$/)],
    ['a very small roar', id => has(id, /^Far above, a very small roar answers\. …hic!$/)],
    ['six rumors', id => has(id, /^At the Old Bridge, Riffle comes sliding down the bank\. Six rumors about a dragon as big as a BRIDGE! And I didn’t start ONE of them\. Otter’s honor!$/)]
  ];
  for (const c of COMBOS) {
    const p = walk(c.flags, { up: c.up }), name = comboName(c);
    inOrder(p, c.up ? upBeats : notBeats, name);
    (c.up ? notBeats : upBeats).forEach(([label, pred]) => assert.ok(!p.some(pred), name + ': ' + label));
    assert.equal(!!p.flags.foundSquall, c.up, name + ': foundSquall');
    assert.equal(!!p.flags.ch4CaughtFly, c.flags.specialty === 'noticing', name + ': only a noticing cat ends with ch4CaughtFly');
  }
  // the end is warm: night, no moon, in her nest with her Case File, the Sky River
  const end = frames[ids[ids.length - 1]];
  assert.ok(end.scene.fx.includes('night') && end.scene.fx.includes('skyriver'), 'a calm night with the Sky River');
  assert.equal(end.scene.set, 'den');
  assert.deepEqual([end.scene.opts.moon, end.scene.opts.stone, end.scene.opts.bark, end.scene.opts.hidden], [false, 'auto', 'auto', true]);
  assert.ok(end.scene.cast.some(c => c.who === 'player' && c.at === 'nest'), 'she is in her nest');
  assert.match(end.caption.join(' '), /warm/);
  assert.match(end.caption.join(' '), /Case File/);
  assert.match(end.caption.join(' '), /Sky River/);
  assert.equal(end.caption[end.caption.length - 1], 'End of Chapter Four.');
});

test('every `when`, on every combination: each reader reads her own lines and nobody else’s', () => {
  for (const c of COMBOS) {
    const f = c.flags, name = comboName(c);
    const rows = walkLines(f, { up: c.up }), lines = rows.map(r => r.lines.join(' ')).join('\n');
    const reads = (re, want, what) => assert.equal(re.test(lines), want, name + ': ' + what);
    const told = f.ch3Told, noticing = f.specialty === 'noticing', found = c.up;
    // told or kept: six lines each, one of them a screen of its own
    reads(/She gives you a slow wink\. You two share a secret now\./, told, 'the wink');
    reads(/You sniff your paws\. Do they still smell of fish\?/, !told, 'fish');
    reads(/Her whiskers twitch\. You both know somebody/, told, 'whiskers');
    reads(/\nYou know somebody who eats a fish for every claw\./, !told, 'you know somebody');
    reads(/Tallyheart’s eyes meet yours\. Not a word\./, told, 'not a word');
    reads(/Inside you, the secret wriggles\./, !told, 'wriggles');
    reads(/Shouldn’t we tell Glintstar about Sprinkle\?/, told, 'the whisper on the way home');
    reads(/No cat goes LOOKING for it\. You don’t have to look\. Go before sunset\. Tell Sprinkle gently\./, told, 'her errand');
    reads(/Not one paw under the Old Bridge, Tallyheart said\. No cat goes looking, Glintstar said\./, !told, 'her own reason');
    reads(/They peek over Tallyheart’s branch\./, told, 'the branch');
    reads(/And one vole\. You gave me that one\./, !told, 'the vole');
    reads(/At the den, Tallyheart stops\. Her torn ear twitches\. That was a fair question you asked at the border\. If you ever have one for me, I’m right here\./, !told, 'the den, kept');
    reads(/At the den, you tell Tallyheart about Squall, and what he saw\. A thing to check\. Together\./, told && found, 'the den, told and found');
    // a cat who told and did not go up has no screen at the den
    const denFrame = ids.find(id => frames[id].when && same(frames[id].when, { not: { ch3Told: true, foundSquall: false } }));
    assert.equal(rows.some(r => r.id === denFrame), !told || found, name + ': the den frame');
    // noticing: the dug earth, the catch, one telling, the hold at bedtime
    reads(/Behind the gap, the earth is freshly dug\. Again\./, noticing, 'the dug earth');
    reads(/Wait\. FLEW\? Sprinkle’s wing droops\. She can’t fly!/, noticing, 'the catch');
    reads(/He said FLEW\. And she can’t\. One hole in his story\. Find me more\./, noticing && told, 'the whisper over the bark');
    reads(/One of them is false already\. But you can’t say so\./, noticing && !told, 'but you can’t say so');
    reads(/And the fox says you FLEW\. I WISH\./, noticing && !told, 'the line under the bridge');
    reads(/You hold it beside the fox’s FLEW\. They can’t both be true\./, noticing, 'the hold');
    reads(/She can’t go looking for her brothers and sisters\. So you will\./, !noticing, 'the search');
    reads(/Then the two pieces of bark about Sprinkle go under the moss\./, true, 'under the moss, told or kept');
    // the other specialties, the worries
    reads(/Sock practice\./, f.specialty === 'sneaking', 'sneaking');
    reads(/This isn’t one\./, f.specialty === 'friends', 'friends');
    reads(/You could climb that\./, f.specialty === 'climbing', 'climbing');
    reads(/It’s only a very tall curtain, really\./, f.specialty === 'climbing' && found, 'the climb');
    reads(/Take the little room, darling!/, f.specialty !== 'climbing' && found, 'the little room');
    reads(/The elevator! You jump, and whack the top button\./, f.specialty !== 'climbing' && found, 'the elevator');
    reads(/You always do, with shiny things\./, f.worry === 'shiny', 'shiny, at the scale');
    reads(/I know\. Me too\./, f.worry === 'shiny', 'shiny, under the bridge');
    reads(/You’re the smallest cat at the border\. You said it anyway\./, f.worry === 'small', 'small');
    reads(/For once, you’re glad\./, f.worry === 'talk', 'talk');
    // the raft: a swimmer with the water worry reads her own line and neither of the others
    const water = f.worry === 'water', swims = f.specialty === 'swimming';
    reads(/A raft\. On the deep water\. Your tummy flips over\./, water && !swims, 'the raft, water');
    reads(/A raft\. A dripping tap is one thing\. The deep river is another\./, water && swims, 'the raft, a swimmer who worries');
    reads(/A raft! Your paws can’t wait\./, swims && !water, 'the raft, a swimmer');
    assert.equal((lines.match(/A raft[.!]/g) || []).length, water || swims ? 1 : 0, name + ': one raft line at most');
    // the chapter 2 path, the stone
    reads(/The same roar as before\./, f.ch2Path === 'river', 'river');
    reads(/A roar with a hiccup, just as Sprinkle said\./, f.ch2Path === 'bridge', 'bridge');
    reads(/Riffle’s stone is by your nose\./, true, 'her stone');
    // found, or not
    reads(/I found your littlest brother\. He says: five\./, found, 'five');
    reads(/Five and five\. Ten\. That’s two of us\./, found, 'five and five');
    reads(/Your littlest brother is still roaring\. Then he’s fine\. He only stops to sleep\./, !found, 'still roaring');
    reads(/Squall saw two skinny shapes going to the tracks\. Every night\./, found, 'the frame after the raft');
    reads(/Raft first\./, found, 'raft first');
    reads(/Goodnight, Squall\./, found, 'goodnight');
    reads(/Sprinkle’s littlest brother is still up there\. You’ll go up another day\./, !found, 'another day');
    // a cat who did not go up never reads his name, anywhere
    if (!found) assert.doesNotMatch(lines, /Squall/, name);
    // nobody reads a line twice running, and every cat reads exactly one of the two bedtime reasons
    assert.equal((lines.match(/So you will\.|They can’t both be true\./g) || []).length, 1, name);
  }
  // her stone under her chin
  assert.ok(walkLines({ ch3Told: true, ch2Path: 'bridge', specialty: 'friends', worry: 'talk', ch2Stone: 'chin' }, {}).some(r => r.lines.includes('Riffle’s stone is under your chin.')));
  // a `when` with two keys is both (the first chapter to use one)
  assert.equal(E.matches({ specialty: 'noticing', ch3Told: true }, { flags: { specialty: 'noticing', ch3Told: false } }), false);
  assert.equal(E.matches({ specialty: 'noticing', ch3Told: false }, { flags: { specialty: 'noticing' } }), true, 'false matches a flag never set');
  assert.equal(E.matches({ not: { ch3Told: true, foundSquall: false } }, { flags: { ch3Told: true } }), false, 'told, never went up: no den frame');
  assert.equal(E.matches({ not: { ch3Told: true, foundSquall: false } }, { flags: { ch3Told: true, foundSquall: true } }), true);
  assert.equal(E.matches({ not: { ch3Told: true, foundSquall: false } }, { flags: {} }), true);
  // each specialty's and each worry's lines are where the text puts them
  const where = (k, v) => ids.filter(id => (frames[id].when && frames[id].when[k] === v) || texts(frames[id]).some(x => x.when && x.when[k] === v));
  assert.equal(where('specialty', 'noticing').length, 5, 'noticing: the dug earth, the catch, over the bark, under the bridge, the hold (and her own card in the row)');
  assert.equal(where('specialty', 'sneaking').length, 1);
  assert.equal(where('specialty', 'friends').length, 1);
  assert.equal(where('specialty', 'climbing').length, 2, 'climbing: over the choice, and her own way up');
  assert.equal(where('specialty', 'swimming').length, 2, 'swimming: the two raft frames');
  assert.equal(where('worry', 'shiny').length, 2);
  assert.equal(where('worry', 'small').length, 1);
  assert.equal(where('worry', 'talk').length, 1);
  assert.equal(where('worry', 'water').length, 1);
  // ch2SaidAloud isn't read
  ids.forEach(id => texts(frames[id]).forEach(x => assert.ok(!x.when || !('ch2SaidAloud' in x.when), id)));
});

/* ------------------------------------------------------------------ Counts */

function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }
const pairs = d => d.facts.map(f => { const q = factAB(f); return q.a + 'x' + q.b; });

test('counts: every set exactly as the text’s Build notes have it', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), ['ch04-claws', 'ch04-tens', 'ch04-pile', 'ch04-riddle', 'ch04-night']);
  const claws3 = PC.story.ch03.counts['ch03-claws'];
  // the warm-up on the 5s, adaptive, its own three-question set: 3 × 5, 5 × 7, then 2 × 5 written last
  const w = C['ch04-claws'];
  assert.deepEqual([w.table, w.thing, w.things, w.unit, w.units, w.teacher], [5, 'claw', 'claws', 'paw', 'paws', 'tallyheart']);
  assert.deepEqual(pairs(w), ['3x5', '5x7', '2x5']);
  assert.deepEqual(w.facts.slice(0, 2), [[3, 5], [5, 7]]);
  assert.deepEqual(w.facts[2], { a: 2, b: 5, who: [{ who: 'tallyheart' }, { who: 'tallyheart' }],
    prompt: [{ who: 'tallyheart', text: 'Two forepaws, five claws each. How many claws?' }], retryPrompt: true,
    right: [{ who: 'tallyheart', text: 'Ten!' }], rightAgain: true }, 'one cat’s two forepaws, in Tallyheart’s words');
  assert.deepEqual(w.warmHard, { table: 5, at: 1, alt: [[4, 5], [1, 5], [5, 5]] });
  assert.deepEqual(w.avoid, [[2, 5]], 'its own written-last question: never the hard pick, never a filler');
  assert.deepEqual([w.fillFrom, w.fillOrder, w.fillIntro, w.done], ['ch03-claws', 'easiest', 'One from yesterday.', null]);
  // chapter 3's claws lines: praise, fast, help, the five-or-zero line, remembered
  ['praise', 'fast', 'fastAfterMiss', 'helpIntro', 'helpIntroFar', 'helpIntroNotFive', 'miss', 'missLast', 'remembered'].forEach(k => assert.deepEqual(w[k], claws3[k], 'the warm-up uses chapter 3’s ' + k));
  assert.equal(w.rememberedSlow, '{a} × {b} again, and you got it. It’s getting easier.');
  assert.equal(w.firstPrompt, undefined, 'the generic “Three paws. How many claws?” asks the opener');
  assert.equal(w.ground, undefined, 'the Hollow’s sand');
  // nothing in the set says "last", and the bridge to today's Count is not in it
  countsLines().filter(x => x.set === 'ch04-claws').forEach(x => assert.doesNotMatch(x.text.replace(/^Last time, /, ''), /\blast\b|Today’s Count|Hold on to that ten/i, x.where));
  const warm = ids.find(id => frames[id].counts && frames[id].counts.set === 'ch04-claws');
  assert.match(T(frames[warm].counts.next), /Hold on to that ten\. Today’s Count is made of it\./, 'the bridge is the next frame’s text, which every player reads');
  // the lesson, the 10s: ten answers in both orders, every number from 1 to 10 once
  const c = C['ch04-tens'];
  assert.deepEqual([c.table, c.thing, c.things, c.unit, c.units, c.teacher, c.label, c.hollowThings], [10, 'front claw', 'front claws', 'cat', 'cats', 'tallyheart', 'Both forepaws', 'tens']);
  assert.deepEqual(pairs(c), ['4x10', '10x2', '1x10', '5x10', '6x10', '10x8', '10x3', '10x9', '7x10', '10x10']);
  assert.deepEqual(c.facts.map(f => { const q = factAB(f); return q.a * q.b; }), [40, 20, 10, 50, 60, 80, 30, 90, 70, 100]);
  const others = c.facts.map(f => { const q = factAB(f); return q.a === 10 ? q.b : q.a; });
  assert.deepEqual(others.slice().sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const tenSecond = c.facts.map(factAB).filter(q => q.b === 10 && q.a !== 10).map(q => q.a), tenFirst = c.facts.map(factAB).filter(q => q.a === 10 && q.b !== 10).map(q => q.b);
  assert.deepEqual([tenSecond, tenFirst], [[4, 1, 5, 6, 7], [2, 8, 3, 9]], 'five with the ten second, four with it first, and 10 × 10');
  const rimSkip = frames[ids.find(id => frames[id].skip && frames[id].skip.keep)].skip;
  assert.deepEqual(c.facts[0], { a: 4, b: 10, who: rimSkip.who.slice(0, 4), right: [{ who: 'tallyheart', text: 'You hopped it!' }], rightAgain: true }, '4 × 10 pictures the first four rim cats');
  assert.equal(c.firstPrompt, 'How many front claws on the first four cats?');
  assert.deepEqual(c.facts[1], { a: 10, b: 2, right: [{ who: 'tallyheart', text: 'Twenty! Two cats, ten claws each. Or ten cats, two ears each. Same twenty!' }], rightAgain: true });
  assert.deepEqual(c.facts[4], { a: 6, b: 10, lit: 50, prompt: 'Six cats. The first five have fifty claws. Now hop on from fifty!', retryPrompt: true,
    right: [{ who: 'tallyheart', text: 'Sixty! Hear it? SIX-ty. Six tens. The answer hides in its own name.' }], rightAgain: true });
  assert.deepEqual(c.facts[9], { a: 10, b: 10, right: [{ who: 'tallyheart', text: 'A HUNDRED! The very last thing Glintstar asked {Murmur}chime.' }], rightAgain: true });
  assert.deepEqual(c.praise, ['Yes! Ten front claws on every cat.', 'Hopping by tens, like a real hunter.', 'Tens are friendly, aren’t they?', 'Hop, hop, hop!', 'You hopped it!']);
  assert.equal(c.praise[c.praise.length - 1], 'You hopped it!', '4 × 10’s own line, so it comes last');
  assert.deepEqual(c.fast, ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.']);
  assert.deepEqual(c.fastAfterMiss, ['Ha! You didn’t even look at the scratches that time.'], 'it lends its questions to the pile: scratches, never sand');
  assert.equal(c.helpIntro, 'Close. Let’s scratch it out together: two swipes for every cat, five lines a swipe.');
  assert.equal(c.helpIntroFar, 'Let’s scratch it out together: two swipes for every cat, five lines a swipe.');
  assert.equal(c.helpIntroNotTen, 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.');
  assert.deepEqual([c.miss, c.done], ['There. We’ll come back to that one.', 'That’s the tens.']);
  // after the bridged 6 × 10, no answer is the one before plus or minus ten
  const ans = c.facts.map(f => { const q = factAB(f); return q.a * q.b; });
  for (let i = ans.indexOf(60) + 1; i < ans.length; i++) assert.notEqual(Math.abs(ans[i] - ans[i - 1]), 10, ans[i - 1] + ' then ' + ans[i]);
  // no praise, fast or again line names a total from twenty to a hundred ("ten front claws" is the per-cat constant)
  const TOTALS = /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\b|\d/i;
  [].concat(c.praise, c.fast, c.fastAfterMiss, c.again || []).forEach(l => assert.doesNotMatch(l, TOTALS, l));
  [].concat(c.praise, c.fast, c.fastAfterMiss, c.again || []).forEach(l => assert.doesNotMatch(l.replace(/Ten front claws on every cat|by tens|Tens are friendly/i, ''), /\bten\b/i, l));
  // the pile: the old tom's three rows of last night in a thought cloud, then her two full rows, lit a row at a time
  const p = C['ch04-pile'];
  assert.deepEqual([p.table, p.thing, p.things, p.unit, p.units, p.teacher], [10, 'piece', 'pieces', 'row', 'rows', 'tallyheart']);
  assert.deepEqual(p.picture, { kind: 'prey', layout: 'rows' });
  assert.deepEqual(pairs(p), ['3x10', '2x10']);
  assert.deepEqual(p.facts[0], { a: 3, b: 10, picture: { kind: 'prey', layout: 'rows', thought: true },
    prompt: [{ who: 'grizzled', text: 'Best hunt since the storm.' }, { who: 'grizzled', text: 'Three rows of ten last night. How many pieces?' }],
    retryPrompt: 'Three rows of ten. How many pieces?',
    right: [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'It took me till the stars came out.' }], rightAgain: true });
  const mine = p.facts[1];
  assert.deepEqual([mine.a, mine.b, mine.light, mine.check, mine.retryPrompt], [2, 10, 'rows', true, 'Two rows of ten. How many pieces?']);
  assert.equal(mine.prompt.map(x => x.text).join(' '), 'You walk along the rows. One full row. Two full rows. How many pieces in two rows of ten?');
  assert.ok(mine.prompt.every(x => x.kind === 'caption'), 'narration, as captions');
  assert.deepEqual([mine.groups, mine.per, mine.picture], [undefined, undefined, undefined], 'two rows and no third: the fact’s own groups');
  assert.deepEqual([p.praise, p.done, p.ground, p.fillFrom, p.fillOrder, p.avoid, p.fillIntro], [[], null, 'earth', 'ch04-tens', 'easiest', [[4, 10]], 'One from this morning.']);
  assert.equal(p.helpIntro, 'Let’s scratch it out: ten marks for every row.');
  assert.equal(p.helpIntroNotTen, 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.');
  assert.equal(p.fast, undefined, 'the old tom never grumbles at a miss, and nobody praises speed at the pile');
  // "last night", never "at sunset": chapter 3's kept path stood at that sunset's pile and saw seven pairs
  countsLines().filter(x => /pile|night/.test(x.set)).forEach(x => assert.doesNotMatch(x.text, /at sunset/i, x.where));
  // Squall's riddle: Mama's morning count, on the roof's grit, in his voice
  const r = C['ch04-riddle'];
  assert.deepEqual([r.table, r.thing, r.things, r.unit, r.units, r.teacher], [5, 'claw', 'claws', 'forepaw', 'forepaws', 'squall']);
  assert.deepEqual(r.picture, { kind: 'grit' }, 'seven little forepaws scratched in the roof’s grit (build.md: read the same as { kind: "mud", ground: "grit" })');
  assert.deepEqual(r.facts, [{ a: 7, b: 5, prompt: 'Seven dragonets hold up one forepaw each. Five claws on every forepaw. How many claws does Mama count?',
    retryPrompt: 'Seven forepaws, five claws each. How many claws?', right: [{ who: 'squall', text: 'THIRTY-FIVE!', kind: 'shout' }], rightAgain: true }]);
  assert.equal(r.facts[0].who, undefined, 'no dragonet behind the paws: seven in his slate would say the whole clutch is his color');
  assert.deepEqual([r.ground, r.helpCounter, r.helpIntro, r.fillFrom, r.fillOrder, r.fillVoice, r.avoid, r.fillIntro, r.againIntro, r.done],
    ['grit', 'you', 'Scratch it on the roof! You hop!', 'ch03-claws', 'easiest', 'borrower', [[2, 5]], 'Do another one!', 'Mama’s count again!', null]);
  assert.deepEqual([r.praise, r.fast, r.again, r.miss, r.missLast], [['YES!', 'Hop, hop, HOP!'], ['FAST! Faster than a giant dragon!'], ['You REMEMBERED!'], 'There! We’ll count that one AGAIN.', 'There. Now we’ve counted it together.']);
  countsLines().filter(x => x.set === 'ch04-riddle').forEach(x => assert.doesNotMatch(x.text, /sand|Squall|skymonster/i, x.where));
  // his "And NOBODY'S MISSING!" is frame text on the next screen, so a player who needed all the help still gets the turn
  const riddle = ids.find(id => frames[id].counts && frames[id].counts.set === 'ch04-riddle');
  assert.match(T(frames[riddle].counts.next), /^And NOBODY’S MISSING!$/);
  // tonight's pile: the lesson's opener again, in the old tom's words
  const n = C['ch04-night'];
  assert.deepEqual([n.table, n.thing, n.things, n.unit, n.units, n.teacher], [10, 'piece', 'pieces', 'row', 'rows', 'tallyheart']);
  assert.deepEqual(n.picture, { kind: 'prey', layout: 'rows' });
  assert.deepEqual(n.facts, [{ a: 4, b: 10, light: 'rows',
    prompt: [{ who: 'grizzled', text: 'Four rows of ten tonight.' }, { who: 'grizzled', text: 'How many pieces, counting cat?' }],
    retryPrompt: 'Four rows of ten. How many pieces?',
    right: [{ who: 'grizzled', text: 'Forty.' }, { kind: 'caption', text: 'He checks, under his breath.' }, { who: 'grizzled', text: 'Ten, twenty, thirty, forty. Hmph. Quicker than twos.', kind: 'whisper' }],
    rightAgain: true }]);
  assert.deepEqual([n.praise, n.done, n.ground, n.helpIntro, n.helpIntroNotTen, n.fillFrom, n.fillOrder, n.avoid, n.fillIntro],
    [[], null, 'earth', p.helpIntro, p.helpIntroNotTen, 'ch04-tens', 'easiest', [[3, 10], [2, 10]], 'One from this morning.']);
  // every fact: arithmetic, in its Count, no duplicates in a set; the fill sets exist and are the same Count
  Object.keys(C).forEach(sid => {
    const d = C[sid];
    assert.equal(d.ask, '{a} × {b}', sid);
    assert.deepEqual(Object.keys(d).filter(k => !['table', 'thing', 'things', 'unit', 'units', 'teacher', 'label', 'hollowThings', 'facts', 'firstPrompt', 'picture', 'warmHard', 'avoid', 'ground',
      'fillFrom', 'fillOrder', 'fillVoice', 'fillIntro', 'againIntro', 'helpCounter', 'ask', 'praise', 'fast', 'fastAfterMiss', 'again', 'helpIntro', 'helpIntroFar', 'helpIntroNotFive', 'helpIntroNotTen',
      'miss', 'missLast', 'remembered', 'rememberedSlow', 'done'].includes(k)), [], sid + ': keys');
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
      if (!Array.isArray(f)) {
        assert.deepEqual(Object.keys(f).filter(x => !['a', 'b', 'table', 'groups', 'per', 'picture', 'who', 'lit', 'light', 'check', 'prompt', 'retryPrompt', 'right', 'rightAgain', 'rightPicture'].includes(x)), [], sid + ': fact keys');
        if (f.lit !== undefined) assert.ok(Number.isInteger(f.lit) && f.lit > 0 && f.lit < q.a * q.b, sid + ': lit is fewer than the answer');
      }
      assert.ok(!keys.has(q.a + 'x' + q.b), sid + ': ' + q.a + 'x' + q.b + ' twice');
      keys.add(q.a + 'x' + q.b);
    });
  });
  // no 2s are typed: the twos are only said
  assert.ok(Object.values(C).every(d => d.table === 5 || d.table === 10));
  // 16 typed answers with no misses, 17 if she finds Squall
  const typed = Object.keys(C).reduce((m, sid) => m + C[sid].facts.length, 0);
  assert.equal(typed, 17);
  assert.equal(typed - C['ch04-riddle'].facts.length, 16);
  t.diagnostic('16 typed answers (17 with Squall) and 13 taps (14 with Squall) with no misses');
  // the Hollow offers "Both forepaws · the 10s", never the warm-up, the pile, tonight's rows or the riddle
  assert.deepEqual(E.countSets(STORIES).map(x => x.setId), ['ch01-tails', 'ch02-ears', 'ch03-claws', 'ch04-tens']);
  assert.equal(E.countName(c, 10), 'Both forepaws · the 10s');
  assert.equal(E.countName(claws3, 5), 'Claws · the 5s');
});

test('counts: lines are short, whole sentences, and fit both sexes', () => {
  countsLines().forEach(x => {
    assert.ok(typeof x.text === 'string', x.set + ' ' + x.where);
    assert.ok(x.text.trim(), x.set + ' ' + x.where + ' is empty');
    assert.ok(words(x.text) <= (/^helpIntro|prompt/.test(x.where) ? 22 : 18), x.set + ' ' + x.where + ': short: ' + x.text);
    if (x.who) assert.ok(['tallyheart', 'grizzled', 'player', 'squall'].includes(x.who), x.set + ' ' + x.where + ': who');
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.set + ' ' + x.where + ': ' + x.text));
  });
});

/* One lesson through the engine as the page asks it: [{ k, q, D, prompt, line, kind, balloons, help }].
 * `answers` maps "AxB" to the answers she types for its asks in turn; `ms` its times (or `all`). */
function play(cat, setId, answers, ms) {
  const home = story.counts[setId] ? story : PC.story.ch03;
  const { def, state: st } = E.chapterLesson(cat, home, setId, 1, STORIES);
  const seenK = {}, out = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), k = q.a + 'x' + q.b;
    const i = seenK[k] = (seenK[k] || 0) + 1;
    const a = answers && answers[k] && answers[k][i - 1] != null ? answers[k][i - 1] : q.answer;
    const tm = ms && ms[k] != null ? ms[k] : (ms && ms.all) || 2000;
    const D = E.questionDef(def, q, home, STORIES);
    const prompt = E.promptLines(def, D, q).map(l => { const o = {}; if (l.who) o.who = l.who; o.text = l.text; if (l.kind) o.kind = l.kind; return o; });
    const picture = E.lessonPicture(D, q, q.lit || 0);
    const r = E.counts.answer(st, D, a, tm, 1);
    E.logAnswer(cat, r.entry);
    const row = { k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, picture, line: r.line, kind: r.lineKind, balloons: r.balloons, res: r, teacher: E.teacherOf(def, D) };
    if (!r.correct) row.help = E.helpPlan(def, D, q, r);
    out.push(row);
  }
  cat.lessons[setId] = E.counts.summary(st);
  return out;
}
const ks = rows => rows.map(r => r.k);
/* A cat that read chapters 1 to 3, with these answers and times in chapter 3's claws lesson. */
function after3(claws, clawsMs) {
  const cat = E.blankCat({ now: 1 });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3 };
  ['ch01-tails', 'ch02-ears'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  play(cat, 'ch03-claws', claws, clawsMs);
  return cat;
}
/* ... and this morning's warm-up and tens, clean, for the sets that borrow from them. */
function morning(claws) {
  const cat = after3(claws);
  play(cat, 'ch04-claws'); play(cat, 'ch04-tens');
  return cat;
}
const pairKey = k => k.replace(/^[A-Z]:/, '').replace('✗', '').split('x').map(Number).sort((a, b) => a - b).join('x');
const fillersOf = rows => rows.filter(r => r.q.filler).map(r => pairKey(r.k));

test('the warm-up, the Build notes’ tests: her hardest claws second, the opener never hard nor its pair, 2 × 5 never the hard pick nor a filler, the easiest of yesterday’s claws borrowed', () => {
  // nothing hard: 3 × 5, 5 × 7, 2 × 5; the first question asks about paws and claws, never cats and tails
  const clean = play(after3(), 'ch04-claws');
  assert.deepEqual(ks(clean), ['3x5', '5x7', '2x5']);
  assert.deepEqual(clean[0].prompt, [{ who: 'tallyheart', text: 'Three paws. How many claws?' }]);
  assert.deepEqual(clean[2].prompt, [{ who: 'tallyheart', text: 'Two forepaws, five claws each. How many claws?' }]);
  assert.deepEqual(clean[2].balloons, [{ who: 'tallyheart', text: 'Ten!' }]);
  assert.deepEqual(clean[2].picture.who, [{ who: 'tallyheart' }, { who: 'tallyheart' }], 'one cat’s two forepaws');
  assert.equal(clean[0].picture.who, undefined, 'forepaws in a row, as chapter 3 drew them');
  // her hardest claws from chapter 3 take the second question; then the opener is never it nor its pair
  const two = play(after3({ '5x3': [14], '7x5': [34] }), 'ch04-claws');
  assert.deepEqual(ks(two), ['4x5', '7x5', '2x5'], 'opens on 4 × 5: 3 × 5 is one of her hard facts');
  assert.ok(two[1].q.hard);
  const three = play(after3({ '5x3': [14], '4x5': [21], '1x5': [6] }), 'ch04-claws');
  assert.deepEqual(ks(three)[0], '5x5', 'the first alt that is neither hard nor the hard pick’s pair');
  assert.ok(['1x5', '3x5', '4x5'].includes(pairKey(ks(three)[1])) && three[1].q.hard, ks(three).join(' '));
  assert.equal(ks(three)[2], '2x5');
  for (const miss of ['5x3', '4x5', '1x5', '5x5', '5x6', '5x8', '9x5', '7x5', '10x5']) {
    const run = play(after3({ [miss]: [1] }), 'ch04-claws');
    assert.equal(run.length, 3, miss);
    assert.equal(pairKey(run[1].k), pairKey(miss), miss + ': her hard fact is asked second');
    assert.notEqual(pairKey(run[0].k), pairKey(miss), miss + ': never opens on it');
    assert.equal(run[2].k, '2x5', miss + ': 2 × 5 is written last');
    assert.equal(new Set(run.map(r => pairKey(r.k))).size, 3, miss + ': no pair twice');
  }
  // 2 × 5 is never the hard pick: a miss on Sprinkle's dinner or on 5 × 2 yesterday changes nothing
  assert.deepEqual(ks(play(after3({ '5x2': [12] }), 'ch04-claws')), ['3x5', '5x7', '2x5']);
  // a quick right hard pick hears "Not today!"; a slow one, that it is getting easier
  assert.equal(play(after3({ '5x8': [35] }), 'ch04-claws', null, { all: 2000 })[1].line, 'Last time, 5 × 8 made you stop and think. Not today!');
  assert.equal(play(after3({ '5x8': [35] }), 'ch04-claws', null, { all: 7000 })[1].line, '5 × 8 again, and you got it. It’s getting easier.');
  // a slow right 4 × 5 or 5 × 6 from chapter 3 (read under a prompt there) never becomes the hard fact
  assert.deepEqual(ks(play(after3(null, { '4x5': 9000, '5x6': 9000 }), 'ch04-claws')), ['3x5', '5x7', '2x5']);
  // a missed 2 × 5 borrows 1 × 5 and 4 × 5 (the easiest of yesterday's, the opener's pair and its own passed over), never 7 × 5 or 9 × 5
  const miss = play(after3(), 'ch04-claws', { '2x5': [11] }, { all: 1500 });
  assert.deepEqual(ks(miss), ['3x5', '5x7', '2x5✗', 'F:1x5', 'F:4x5', 'R:2x5']);
  assert.ok(miss.slice(3, 5).every(r => r.q.from === 'ch03-claws'));
  assert.match(miss[3].prompt[0].text, /^One from yesterday\. One paw\. How many claws\?$/);
  assert.deepEqual(miss[5].prompt.map(l => l.text), ['Here’s that one again.', 'Two forepaws, five claws each. How many claws?']);
  assert.deepEqual(miss[5].balloons, [{ who: 'tallyheart', text: 'Ten!' }], 'its right line on a right retry too');
  // the help: Tallyheart swipes the sand once a paw, five lines a swipe, hopped by fives; 11 gets the five-or-zero line
  assert.deepEqual([miss[2].help.ground, miss[2].help.style, miss[2].help.counter, miss[2].help.nums, miss[2].help.pair], ['sand', 'swipe', 'tallyheart', [5, 10], undefined]);
  assert.equal(miss[2].help.intro, story.counts['ch04-claws'].helpIntroNotFive);
  // a quick right borrowed question after the miss: the Hollow's sand, true here
  assert.equal(miss[3].line, 'Ha! You didn’t even look at the sand that time.');
  // a miss on the first question comes back right after 2 × 5; a miss on the second after 2 × 5 and one borrowed (1 × 5)
  assert.deepEqual(ks(play(after3(), 'ch04-claws', { '3x5': [14] })), ['3x5✗', '5x7', '2x5', 'R:3x5']);
  assert.deepEqual(ks(play(after3(), 'ch04-claws', { '5x7': [34] })), ['3x5', '5x7✗', '2x5', 'F:1x5', 'R:5x7']);
  // whatever she misses, 2 × 5 is never a filler, and no filler is past twenty-five
  for (let seed = 1; seed <= 300; seed++) {
    let x = (seed * 2654435761) >>> 0;
    const rnd = () => ((x = (Math.imul(x, 1103515245) + 12345) >>> 0) / 4294967296);
    const cat = after3();
    const { def, state: st } = E.chapterLesson(cat, story, 'ch04-claws', 1, STORIES);
    while (!E.counts.done(st)) {
      const q = E.counts.question(st);
      if (q.filler) { assert.notEqual(pairKey(q.a + 'x' + q.b), '2x5', 'seed ' + seed); assert.ok(q.a * q.b <= 25, 'seed ' + seed + ': ' + q.a + '×' + q.b); }
      E.logAnswer(cat, E.counts.answer(st, E.questionDef(def, q, story, STORIES), rnd() < 0.5 ? q.answer + 1 : q.answer, 1500, 1).entry);
    }
  }
  // reading time: the opener (asked under the frame's balloon) and 2 × 5 (its own prompt) say nothing of speed when right
  [['ch04-claws', 3, 5], ['ch04-claws', 2, 5], ['ch04-tens', 4, 10], ['ch04-tens', 6, 10], ['ch04-pile', 3, 10], ['ch04-pile', 2, 10], ['ch04-riddle', 7, 5], ['ch04-night', 4, 10]]
    .forEach(([set, a, b]) => assert.equal(E.readFirst({ set, a, b }, STORIES), true, set + ' ' + a + 'x' + b));
  [['ch04-claws', 5, 7], ['ch04-tens', 10, 8], ['ch04-tens', 10, 9], ['ch04-tens', 7, 10], ['ch04-tens', 10, 10]].forEach(([set, a, b]) => assert.equal(E.readFirst({ set, a, b }, STORIES), false, set + ' ' + a + 'x' + b));
  const slow = after3(); play(slow, 'ch04-claws'); play(slow, 'ch04-tens', null, { all: 9000 });
  assert.deepEqual(E.hardFacts(slow, 10, STORIES).map(f => pairKey(f.join('x'))).sort(), ['1x10', '2x10', '3x10', '5x10', '7x10', '8x10', '9x10', '10x10'].sort(), 'slow and right: hard for chapter 5’s warm-up, but for 4 × 10 and 6 × 10, read under a prompt');
  const missed = after3(); play(missed, 'ch04-claws'); play(missed, 'ch04-tens', { '4x10': [41] });
  assert.ok(E.hardFacts(missed, 10, STORIES).some(f => pairKey(f.join('x')) === '4x10'), 'a miss there makes it hard');
});

test('the tens, the Build notes’ tests: in order, front claws in every question, the same twenty, hop on from fifty, the zero rule, swipes in pairs, a hundred on the keypad', () => {
  const c = story.counts['ch04-tens'];
  const run = play(after3(), 'ch04-tens', null, { all: 5000 });
  assert.deepEqual(ks(run), ['4x10', '10x2', '1x10', '5x10', '6x10', '10x8', '10x3', '10x9', '7x10', '10x10']);
  assert.deepEqual(run[0].prompt, [{ who: 'tallyheart', text: 'How many front claws on the first four cats?' }]);
  assert.deepEqual(run[0].q.who.map(w => w.who), ['clancat', 'clancat', 'clancat', 'clancat']);
  assert.deepEqual(run[0].balloons, [{ who: 'tallyheart', text: 'You hopped it!' }]);
  // every question the set words for itself says "front claws" (a cat has claws behind too)
  const plain = run.filter((r, i) => i > 0 && !r.q.prompt);
  plain.forEach(r => assert.match(r.prompt[0].text, /^(One cat|\w+ cats)\. How many front claws\?$/, r.k + ': ' + r.prompt[0].text));
  assert.equal(plain.length, 8);
  assert.equal(run[2].prompt[0].text, 'One cat. How many front claws?');
  assert.equal(run[8].prompt[0].text, 'Seven cats. How many front claws?');
  // the pictures: two big forepaws a cat, ten to a group; 6 × 10 opens with the first five cats' fifty claws lit
  run.forEach(r => assert.deepEqual([r.picture.table, r.picture.per, r.picture.groups, r.picture.things], [10, 10, r.q.a === 10 ? r.q.b : r.q.a, 'front claws'], r.k));
  assert.deepEqual([run[4].q.lit, run[4].picture.highlight, run[4].prompt[0].text], [50, 50, 'Six cats. The first five have fifty claws. Now hop on from fifty!']);
  assert.deepEqual(run[1].balloons, c.facts[1].right);
  assert.deepEqual(run[4].balloons, c.facts[4].right);
  assert.deepEqual(run[9].balloons, [{ who: 'tallyheart', text: 'A HUNDRED! The very last thing Glintstar asked {Murmur}chime.' }]);
  // praise is dealt in order, so the first is true wherever it lands: on 1 × 10 after a slow answer...
  assert.deepEqual(run.filter(r => r.kind === 'praise').map(r => r.line), c.praise.concat(c.praise.slice(0, 1)).slice(0, run.filter(r => r.kind === 'praise').length));
  assert.equal(run[2].line, 'Yes! Ten front claws on every cat.');
  // ... and on 5 × 10 when 1 × 10 was quick and took a fast line; quick, 4 × 10 still says "You hopped it!"
  const quick = play(after3(), 'ch04-tens', null, { all: 2000 });
  assert.deepEqual([quick[0].balloons, quick[0].line], [[{ who: 'tallyheart', text: 'You hopped it!' }], '']);
  assert.deepEqual([quick[2].kind, quick[2].line], ['fast', 'You didn’t even have to hop that time.']);
  assert.deepEqual([quick[3].kind, quick[3].line], ['praise', 'Yes! Ten front claws on every cat.']);
  for (const r of [run, quick]) assert.ok(!r.slice(1, 6).some(x => x.line === 'You hopped it!'), 'not again a question or two on: ' + r.map(x => x.line).join(' | '));
  // a missed 4 × 10 and 6 × 10: each back two questions later, 6 × 10's prompt kept, both right lines on a right retry
  const miss = play(after3(), 'ch04-tens', { '4x10': [41], '6x10': [61] });
  assert.deepEqual(ks(miss), ['4x10✗', '10x2', '1x10', 'R:4x10', '5x10', '6x10✗', '10x8', '10x3', 'R:6x10', '10x9', '7x10', '10x10']);
  assert.deepEqual(miss[3].balloons, [{ who: 'tallyheart', text: 'You hopped it!' }], 'a right retry of 4 × 10 says “You hopped it!” too');
  assert.equal(miss[3].prompt[0].text, 'Here’s that one again. Four cats. How many front claws?');
  assert.equal(miss[8].prompt[0].text, 'Here’s that one again. Six cats. The first five have fifty claws. Now hop on from fifty!');
  assert.deepEqual(miss[8].balloons, c.facts[4].right);
  // the help: Tallyheart swipes the sand twice for every cat, five lines a swipe, hopped by tens, a pair at a time
  const h = miss[0].help;
  assert.deepEqual([h.ground, h.style, h.pair, h.counter, h.nums, h.byRow], ['sand', 'swipe', true, 'tallyheart', [10, 20, 30, 40], undefined]);
  assert.deepEqual(E.sandOpts(h, 20), { groups: 4, per: 10, counted: 20, layout: undefined, ground: undefined, style: 'swipe', pair: true });
  // 34 for 10 × 3 opens the help with the zero line; 20 doesn't ("Close."); 60 is far
  const helpFor = given => play(after3(), 'ch04-tens', { '10x3': [given] }).find(r => r.k === '10x3✗').help;
  assert.equal(helpFor(34).intro, 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.');
  assert.deepEqual(helpFor(34).nums, [10, 20, 30]);
  assert.equal(helpFor(20).intro, c.helpIntro, 'one hop off: close');
  assert.equal(helpFor(40).intro, c.helpIntro);
  assert.equal(helpFor(60).intro, c.helpIntroFar);
  // a fast right after a miss: scratches, never sand (the line travels to the pile with a borrowed question)
  const fast = play(after3(), 'ch04-tens', { '4x10': [41] }, { all: 1500 });
  assert.ok(fast.some(r => r.line === 'Ha! You didn’t even look at the scratches that time.'));
  [].concat(run, quick, miss, fast).forEach(r => assert.doesNotMatch(r.line || '', /sand/, r.k));
  // 10 × 10 is 100: three digits on the keypad
  const K = PC.ui.keypad;
  assert.equal(['1', '0', '0'].reduce((typed, k) => K.press(typed, k), ''), '100');
  assert.equal(K.press('100', '0'), '100', 'and no more');
  // her tens lesson finished: the tree's fourth mark, and the Hollow's button
  const cat = after3(); play(cat, 'ch04-claws'); play(cat, 'ch04-tens');
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto' } }, cat, STORIES).opts.marks, 4);
  assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10]);
  // no Hollow line is the same for the 5s and the 10s
  const d5 = E.hollowDef(STORIES, 5), d10 = E.hollowDef(STORIES, 10);
  assert.notEqual(E.hollowRoundLine(d5), E.hollowRoundLine(d10));
  assert.equal(E.hollowRoundLine(d10), 'A round of tens. Ready? Here we go.');
  assert.equal(E.hollowRoundLine(d5), 'A round of claws. Ready? Here we go.');
  assert.notEqual(E.hollowGlowNote(d5, true), E.hollowGlowNote(d10, true));
  assert.equal(E.hollowGlowNote(d10, true), 'Look! Your tens claw mark on the tree is glowing.');
  cat.hollow.byTable = { 5: { rounds: 3, cleanRounds: 3, glow: true }, 10: { rounds: 3, cleanRounds: 3, glow: true } };
  assert.equal(E.hollowLines(cat, STORIES).glow, 'Look at your claw marks. Your claws and tens marks glow now.');
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(x => x.name), ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s']);
  assert.equal(d10.firstPrompt, undefined, 'the Hollow never asks about the rim cats');
});

test('the pile, morning and night, the Build notes’ tests: scratched in the earth a row at a time, the zero rule, the easiest tens borrowed, “scratches” after a miss', () => {
  // clean: the old tom's count in a thought cloud, then her two rows, lit a row at a time, and those two only
  const clean = play(morning(), 'ch04-pile');
  assert.deepEqual(ks(clean), ['3x10', '2x10']);
  assert.deepEqual(clean[0].prompt.map(l => [l.who, l.text]), [['grizzled', 'Best hunt since the storm.'], ['grizzled', 'Three rows of ten last night. How many pieces?']]);
  assert.deepEqual(clean[0].balloons, [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'It took me till the stars came out.' }]);
  assert.deepEqual([clean[0].picture.kind, clean[0].picture.layout, clean[0].picture.thought, clean[0].picture.groups, clean[0].picture.per], ['prey', 'rows', true, 3, 10]);
  assert.deepEqual(clean[1].prompt, [{ text: 'You walk along the rows. One full row. Two full rows.', kind: 'caption' }, { text: 'How many pieces in two rows of ten?', kind: 'caption' }]);
  assert.deepEqual([clean[1].picture.groups, clean[1].picture.per, clean[1].picture.layout, clean[1].picture.thought, clean[1].q.light], [2, 10, 'rows', undefined, 'rows'], 'the 2 × 10 picture has two rows and no third: nothing in it invites thirty');
  assert.deepEqual([clean[1].line, clean[1].balloons], ['', undefined], 'nobody praises at the pile: the story answers');
  // a missed 3 × 10 is scratched in the earth, ten marks a row, and counted 10 · 20 · 30; after its first hop exactly the first row's ten marks are lit
  const m3 = play(morning(), 'ch04-pile', { '3x10': [13] }, { all: 1500 });
  assert.deepEqual(ks(m3), ['3x10✗', '2x10', 'F:1x10', 'R:3x10'], 'a missed 3 × 10 borrows 1 × 10');
  const h = m3[0].help;
  assert.deepEqual([h.ground, h.layout, h.byRow, h.nums, h.counter, h.teacher, h.style], ['earth', 'rows', true, [10, 20, 30], 'tallyheart', 'tallyheart', null]);
  assert.deepEqual(E.sandOpts(h, 10), { groups: 3, per: 10, counted: 10, layout: 'rows', ground: 'earth', step: 10 });
  const unlit = svg => (svg.match(/stroke="#4e3524"/g) || []).length;
  assert.deepEqual([0, 10, 20, 30].map(nn => unlit(A.sand(E.sandOpts(h, nn)))), [30, 20, 10, 0], 'a whole row at a time: ten marks for every hop');
  // 13 for 3 × 10 (three plus ten, the likeliest slip) opens the help with the zero line; 20 doesn't
  assert.equal(h.intro, 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.');
  assert.equal(play(morning(), 'ch04-pile', { '3x10': [20] })[0].help.intro, 'Let’s scratch it out: ten marks for every row.');
  // it comes back in the old tom's short words, and a right retry gets his "Hmph." too
  assert.deepEqual(m3[3].prompt, [{ who: 'tallyheart', text: 'Here’s that one again. Three rows of ten. How many pieces?' }]);
  assert.deepEqual(m3[3].balloons, [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'It took me till the stars came out.' }]);
  // the borrowed question: this morning's, in its own lesson's words ("front claws"), after "One from this morning."; fast and right, "scratches", never "sand"
  assert.deepEqual([m3[2].q.from, m3[2].prompt[0].text], ['ch04-tens', 'One from this morning. One cat. How many front claws?']);
  assert.deepEqual([m3[2].kind, m3[2].line], ['fast', 'Ha! You didn’t even look at the scratches that time.']);
  // a missed 2 × 10 borrows 1 × 10 and 5 × 10; both missed, one filler, and they come back in order
  const m2 = play(morning(), 'ch04-pile', { '2x10': [13] });
  assert.deepEqual(ks(m2), ['3x10', '2x10✗', 'F:1x10', 'F:5x10', 'R:2x10']);
  assert.deepEqual(m2[4].prompt, [{ who: 'tallyheart', text: 'Here’s that one again. Two rows of ten. How many pieces?' }]);
  assert.deepEqual([m2[1].help.nums, m2[1].help.byRow, m2[1].help.ground], [[10, 20], true, 'earth']);
  assert.deepEqual(ks(play(morning(), 'ch04-pile', { '3x10': [13], '2x10': [22] })), ['3x10✗', '2x10✗', 'F:1x10', 'R:3x10', 'R:2x10']);
  // missed twice, it borrows 1 × 10 and 5 × 10 again: never its own rows the other way round, never the lesson's last three
  const twice = play(morning(), 'ch04-pile', { '2x10': [13, 21] });
  assert.deepEqual(fillersOf(twice), ['1x10', '5x10', '1x10', '5x10']);
  // tonight: four rows lit a row at a time; a miss borrows 1 × 10 and 5 × 10 whether or not she went up in between
  const NEVER = ['2x10', '3x10', '10x10', '9x10', '7x10'];
  for (const up of [false, true]) for (const ans of [null, { '3x10': [13] }, { '2x10': [13] }, { '3x10': [13], '2x10': [22] }, { '2x10': [13, 21] }]) {
    const cat = morning();
    const am = play(cat, 'ch04-pile', ans);
    if (up) play(cat, 'ch04-riddle', ans ? { '7x5': [34] } : null);
    const pm = play(cat, 'ch04-night', { '4x10': [14] });
    const name = (up ? 'up' : 'not today') + ' ' + JSON.stringify(ans);
    assert.deepEqual(ks(pm).filter(k => !/^F:/.test(k)), ['4x10✗', 'R:4x10'], name);
    assert.deepEqual(fillersOf(pm).sort(), ['1x10', '5x10'], name + ': tonight borrows 1 × 10 and 5 × 10 (' + ks(pm).join(' ') + ')');
    [].concat(am, pm).forEach(r => { if (r.q.filler) assert.ok(!NEVER.includes(pairKey(r.k)) && pairKey(r.k) !== '4x10', name + ': ' + r.k); });
    assert.deepEqual([pm[0].help.ground, pm[0].help.byRow, pm[0].help.nums, pm[0].help.intro], ['earth', true, [10, 20, 30, 40], story.counts['ch04-night'].helpIntroNotTen], name);
    assert.deepEqual(E.sandOpts(pm[0].help, 10), { groups: 4, per: 10, counted: 10, layout: 'rows', ground: 'earth', step: 10 });
    assert.equal(unlit(A.sand(E.sandOpts(pm[0].help, 10))), 30, 'after the first hop exactly the first row’s ten marks are lit');
    pm.filter(r => r.q.filler).forEach(r => assert.match(r.prompt[0].text, /^One from this morning\. (One cat|Five cats)\. How many front claws\?$/, name));
  }
  // the old tom's right line tonight: he checks, under his breath
  const night = play(morning(), 'ch04-night');
  assert.deepEqual(night[0].prompt.map(l => [l.who, l.text]), [['grizzled', 'Four rows of ten tonight.'], ['grizzled', 'How many pieces, counting cat?']]);
  assert.deepEqual(night[0].balloons, [{ who: 'grizzled', text: 'Forty.' }, { kind: 'caption', text: 'He checks, under his breath.' }, { who: 'grizzled', text: 'Ten, twenty, thirty, forty. Hmph. Quicker than twos.', kind: 'whisper' }]);
  assert.deepEqual([night[0].picture.groups, night[0].picture.per, night[0].picture.layout, night[0].q.light], [4, 10, 'rows', 'rows']);
  const retried = play(morning(), 'ch04-night', { '4x10': [30] });
  assert.equal(retried[retried.length - 1].prompt[0].text, 'Here’s that one again. Four rows of ten. How many pieces?');
  assert.deepEqual(retried[retried.length - 1].balloons, night[0].balloons, 'he checks on a right retry too');
  assert.equal(retried[0].help.intro, 'Let’s scratch it out: ten marks for every row.', 'thirty ends in a zero: the plain line');
  // nobody at the pile says a total she has not typed, and nobody subtracts: no twenty-six, no "how many are gone"
  everyText((id, x) => assert.doesNotMatch(x.text, /twenty-six|26|how many (are |were )?(gone|missing|left)|take away|minus/i, id + ' ' + x.where));
  // 2 × 10 is a check (its clock runs over the caption): a right one says nothing about the fact
  const chk = morning(); play(chk, 'ch04-pile');
  assert.ok(chk.counts.filter(e => e.set === 'ch04-pile' && e.a === 2).every(e => e.check));
});

test('Squall’s riddle, the Build notes’ tests: on the grit, the player hops, the easiest claws in his voice, “Mama’s count again!”, and every balloon “The little dragon”’s', () => {
  const Sp = PC.ui.speakers;
  const cat = morning();
  const label = who => Sp.label({ who }, { cat, story, fill: t => E.fill(t, cat) });
  const clean = play(cat, 'ch04-riddle');
  assert.deepEqual(ks(clean), ['7x5']);
  assert.deepEqual(clean[0].prompt, [{ who: 'squall', text: 'Seven dragonets hold up one forepaw each. Five claws on every forepaw. How many claws does Mama count?' }]);
  assert.deepEqual(clean[0].balloons, [{ who: 'squall', text: 'THIRTY-FIVE!', kind: 'shout' }]);
  // its picture has seven paws scratched in the grit and no dragonet
  assert.deepEqual([clean[0].picture.kind, clean[0].picture.ground, clean[0].picture.groups, clean[0].picture.per, clean[0].picture.who], ['grit', 'grit', 7, 5, undefined]);
  // a miss: he swipes the roof's grit once a forepaw, and the player hops 5 · 10 … 35 in her own balloon; never sand
  const miss = play(morning(), 'ch04-riddle', { '7x5': [34] }, { all: 1500 });
  assert.deepEqual(ks(miss), ['7x5✗', 'F:1x5', 'F:5x3', 'R:7x5'], 'borrows 1 × 5 and 5 × 3, never Sprinkle’s dinner');
  assert.deepEqual([miss[0].help.ground, miss[0].help.style, miss[0].help.counter, miss[0].help.teacher, miss[0].help.nums, miss[0].help.intro],
    ['grit', 'swipe', 'player', 'squall', [5, 10, 15, 20, 25, 30, 35], 'Scratch it on the roof! You hop!']);
  assert.deepEqual(E.sandOpts(miss[0].help, 5), { groups: 7, per: 5, counted: 5, layout: undefined, ground: 'grit', style: 'swipe' });
  assert.equal(miss[0].line, 'There! We’ll count that one AGAIN.');
  // the borrowed questions: yesterday's claws in his voice, after "Do another one!", with his lines
  miss.slice(1, 3).forEach(r => {
    assert.equal(r.q.from, 'ch03-claws');
    assert.deepEqual([r.teacher, r.prompt[0].who], ['squall', 'squall']);
    assert.match(r.prompt[0].text, /^Do another one! (One paw|Three paws)\. How many claws\?$/);
    assert.ok(['YES!', 'Hop, hop, HOP!', 'FAST! Faster than a giant dragon!'].includes(r.line), r.line);
  });
  // it comes back as "Mama's count again!", and a right retry roars the answer
  assert.deepEqual(miss[3].prompt, [{ who: 'squall', text: 'Mama’s count again! Seven forepaws, five claws each. How many claws?' }]);
  assert.deepEqual(miss[3].balloons, [{ who: 'squall', text: 'THIRTY-FIVE!', kind: 'shout' }]);
  // a second miss borrows 4 × 5 and 5 × 5; never 5 × 2, never past twenty-five
  const twice = play(morning(), 'ch04-riddle', { '7x5': [34, 30] });
  assert.deepEqual(fillersOf(twice), ['1x5', '3x5', '4x5', '5x5']);
  const thrice = play(morning(), 'ch04-riddle', { '7x5': [34, 30, 36] });
  assert.equal(thrice[thrice.length - 1].line, 'There. Now we’ve counted it together.');
  assert.ok(![].concat(miss, twice, thrice).some(r => r.q.filler && pairKey(r.k) === '2x5'), 'his “Do another one!” never asks the fact Sprinkle is about to say herself');
  // a missed borrowed question is scratched on the grit too, hopped by the player
  const bm = play(morning(), 'ch04-riddle', { '7x5': [34], '1x5': [6] });
  const fm = bm.find(r => r.k === 'F:1x5✗');
  assert.deepEqual([fm.help.ground, fm.help.counter, fm.help.intro], ['grit', 'player', 'Scratch it on the roof! You hop!']);
  // every balloon of the riddle, its help, its fillers and its retry is the teacher's, and the chapter labels him "The little dragon"
  [].concat(clean, miss, twice, thrice, bm).forEach(r => {
    assert.equal(r.teacher, 'squall', r.k);
    r.prompt.forEach(l => assert.equal(l.who, 'squall', r.k));
    (r.balloons || []).forEach(b => assert.equal(b.who, 'squall', r.k));
    assert.doesNotMatch((r.line || '') + r.prompt.map(l => l.text).join(' '), /sand|Tallyheart|Squall|yesterday/, r.k);
  });
  assert.equal(label('squall'), 'The little dragon');
  assert.equal(label('reynard'), 'The fox');
});

/* ------------------------------------------------------------------ her Case File */

/* Read the chapter through the engine from where she is to its end (or to `stop`, a frame id, before
 * acting on it): what every frame shows her. `up`: the tower choice; `light`: the light choices'
 * option; `answers`: wrong answers by fact, for every lesson on the way. */
function read(cat, o) {
  o = o || {};
  const rows = [];
  let t = o.t || 1000;
  const Sp = PC.ui.speakers;
  for (let guard = 0; guard < 400; guard++) {
    const id = E.frameId(cat, story), f = frames[id], kind = E.kindOf(f);
    const row = { id, kind, caps: E.captions(f, cat).map(c => E.fill(c, cat)),
      say: E.balloons(f, cat).map(b => ({ who: b.who, label: Sp.label(b, { cat, story, fill: x => E.fill(x, cat) }), text: E.fill(b.text, cat) })),
      cards: E.cardsOn(f, cat, story, STORIES), wiggle: E.fileWiggles(cat, story, id), file: E.cards(cat, STORIES).map(c => c.id), hasFile: E.hasFile(cat),
      apart: !E.fileNeighbours(E.caseFile(cat, STORIES), 'cant-fly', 'fox-flew'), counts: cat.counts.length };
    // the scene as the page draws it for her: the row of bark along her nest (`bark: 'auto'`), the row on the sand (`cards`)
    const drawn = f.scene && E.resolveScene(f.scene, cat, STORIES).opts;
    if (drawn && Array.isArray(drawn.bark)) row.nest = drawn.bark.map(c => c.picture + ':' + c.mark);
    if (drawn && Array.isArray(drawn.cards)) row.sand = drawn.cards.map(c => c.picture + ':' + c.mark);
    rows.push(row);
    if ((o.stop && id === o.stop) || kind === 'end') break;
    t += 10;
    if (kind === 'next' || kind === 'file' || kind === 'skip') assert.ok(E.next(cat, story, t), id);
    else if (kind === 'scratch') { row.scratched = []; for (let c; (c = E.scratchTap(cat, story, t));) row.scratched.push(c); assert.ok(E.next(cat, story, t), id); }
    else if (kind === 'choice') {
      const opts = E.options(f, cat);
      row.options = opts.map(x => E.fill(E.optionLabel(x.option, cat), cat));
      assert.ok(E.choose(cat, story, opts[id === TOWER ? (o.up ? 0 : 1) : (o.light || 0)].index, t), id);
    } else if (kind === 'input') assert.ok(E.submitInput(cat, story, o.dream == null ? 'the fox wore a wall' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, story, f.counts.set, t, STORIES);
      E.beginLesson(cat, story, id, r.state);
      row.lesson = [];
      const seenK = {};
      while (!E.counts.done(r.state)) {
        const q = E.counts.question(r.state), k = q.a + 'x' + q.b, i = seenK[k] = (seenK[k] || 0) + 1;
        const a = o.answers && o.answers[k] && o.answers[k][i - 1] != null ? o.answers[k][i - 1] : q.answer;
        const D = E.questionDef(r.def, q, story, STORIES);
        const prompt = E.promptLines(r.def, D, q).map(l => (l.who ? Sp.label({ who: l.who }, { cat, story, fill: x => E.fill(x, cat) }) + ': ' : '') + E.fill(l.text, cat));
        const res = E.counts.answer(r.state, D, a, 2000, t);
        E.logAnswer(cat, res.entry);
        row.lesson.push({ k, prompt, line: E.fill(res.line, cat), balloons: (res.balloons || []).map(b => (b.who ? Sp.label({ who: b.who }, { cat, story, fill: x => E.fill(x, cat) }) + ': ' : '') + E.fill(b.text, cat)),
          help: res.correct ? '' : E.helpPlan(r.def, D, q, res).intro });
        if (res.done) E.recordLesson(cat, r.state);
      }
      assert.ok(E.finishCounts(cat, story, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* Everything a reading put on screen, as text: captions, balloons with their labels, the options,
 * the cards' lines, and every lesson's words. */
function readWords(rows) {
  const out = [];
  rows.forEach(r => {
    out.push(...r.caps, ...r.say.map(b => b.label + ': ' + b.text), ...(r.options || []), ...r.cards.filter(c => c.showLine).map(c => c.line));
    (r.lesson || []).forEach(l => out.push(...l.prompt, l.line, ...l.balloons, l.help));
  });
  return out.join('\n');
}
/* A cat who has read chapters 1 to 3, at chapter 4's first page. */
function fresh(flags) {
  const cat = after3();
  Object.assign(cat.flags, { specialty: 'friends', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch2SaidAloud: true, ch3Told: true }, flags || {});
  E.startChapter(cat, story, 500);
  return cat;
}
const rowAt = (rows, id) => rows.find(r => r.id === id);

test('her Case File: the nine cards as the text’s table has them; given once, in order; 7, 8, 8 or 9 of them; the wing on both paths', () => {
  // the nine, in the order she can get them, with the table's marks and lines
  assert.deepEqual(Object.keys(story.cards), CARD_IDS);
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/04-the-glittering-scale.md'), 'utf8');
  const table = md.split('\n').map(l => /^\s*\|\s*`([a-z0-9-]+)`\s*\|\s*(eye|ear)\s*\|[^|]*\|\s*([^|]+?)\s*\|/.exec(l)).filter(Boolean).map(m => [m[1], m[2], m[3]]);
  assert.deepEqual(CARD_IDS.map(cid => [cid, story.cards[cid].mark, story.cards[cid].line]), table, 'ids, marks and lines are the text’s table');
  CARD_IDS.forEach(cid => {
    const c = story.cards[cid];
    assert.deepEqual(Object.keys(c).filter(k => !['mark', 'line', 'answers', 'link', 'when'].includes(k)), [], cid + ': its picture is its own id');
    assert.ok(words(c.line) <= 12 && /[.!]$/.test(c.line), cid + ': one short line');
  });
  // five or six eyes and two or three ears; each claim puts the word to check in capitals
  assert.deepEqual(CARD_IDS.filter(cid => story.cards[cid].mark === 'ear'), ['fox-flew', 'fox-moon', 'squall-shapes']);
  assert.match(story.cards['fox-flew'].line, /FLEW/);
  assert.match(story.cards['fox-moon'].line, /MOON/);
  // "like glass" is as far as the scale card goes: smooth, and no more
  assert.equal(story.cards.scale.line, 'The ‘scale’ is smooth, like glass.');
  // the claim and its answer (stored for chapter 10), drawn touching only once she has made the link
  assert.deepEqual(story.cards['fox-flew'].answers, ['cant-fly']);
  assert.deepEqual(story.cards['fox-flew'].link, { when: { ch4CaughtFly: true }, line: 'They can’t both be true.' });
  assert.deepEqual(CARD_IDS.filter(cid => story.cards[cid].answers || story.cards[cid].link), ['fox-flew']);
  // Squall's card is shown only with the flag
  assert.deepEqual(story.cards['squall-shapes'].when, { foundSquall: true });
  assert.deepEqual(CARD_IDS.filter(cid => story.cards[cid].when), ['squall-shapes']);
  // not cards yet, on purpose: the moon that wasn't, the ten fish, the fine dry den
  assert.ok(!CARD_IDS.some(cid => /no moon|ten fish|den/i.test(story.cards[cid].line)));
  // the frames that give them: each card at the moment she learns the fact, each once
  const giving = ids.filter(id => frames[id].card);
  // (the wing's frame lays the fox's FLEW beside it for a noticing cat: a card she holds already, `held`, shown and not given)
  assert.deepEqual(giving.map(id => frames[id].card), [{ id: 'four-a-night', mark: false }, 'fox-flew', 'fox-moon', 'squall-shapes', 'sprinkle-scales', ['cant-fly', { id: 'fox-flew', when: { specialty: 'noticing' }, held: true }]]);
  const rowF = ids.find(id => frames[id].scratch && frames[id].scratch.cards);
  assert.ok(at(rowF) > at(giving[0]) && at(rowF) < at(giving[1]), 'the row of bark between her first card and the fox’s');
  giving.forEach(id => assert.equal(frames[id].when, undefined, id + ': a card’s frame is for everyone on its path'));
  assert.match(T(giving[3]), /^The train tracks!$/);
  assert.equal(frames[giving[3]].next, ids.find(id => /Come down with me\?/.test(T(id))), 'given on the roof, two frames before the one that sets the flag');
  assert.match(T(giving[5]), /a drooping wing/);
  assert.ok(frames[giving[5]].scene.set === 'den' && frames[giving[5]].scene.fx.includes('night'), 'the wing is scratched in her nest, in the dark');
  const wingRow = rows => rowAt(rows, giving[5]);
  // through the engine, on every combination
  for (const c of COMBOS) {
    const name = comboName(c), cat = fresh(c.flags);
    const rows = read(cat, { up: c.up });
    const noticing = c.flags.specialty === 'noticing';
    const want = CARD_IDS.filter(cid => (cid !== 'dug-earth' || noticing) && (cid !== 'squall-shapes' || c.up));
    assert.deepEqual(cat.cards.map(k => k.id), want, name + ': her cards, in the order found');
    assert.equal(want.length, 7 + (noticing ? 1 : 0) + (c.up ? 1 : 0), name);
    assert.deepEqual(E.cards(cat, STORIES).map(k => k.id), want, name + ': all of them in her file');
    assert.ok(cat.cards.every(k => k.chapter === 'ch04' && k.at > 0), name);
    assert.ok(cat.cards.some(k => k.id === 'cant-fly'), name + ': the wing, told or kept');
    assert.equal(cat.flags.caseFile, true);
    // the file never shows the wing and the fox's FLEW as neighbours without the link; with it they touch
    const file = E.caseFile(cat, STORIES);
    assert.equal(E.fileNeighbours(file, 'cant-fly', 'fox-flew'), noticing, name);
    assert.deepEqual(file.links.map(l => [l.cards.map(k => k.id), l.line]), noticing ? [[['cant-fly', 'fox-flew'], 'They can’t both be true.']] : [], name);
    assert.ok(rows.every(r => r.apart || noticing), name + ': never neighbours on the way either');
    assert.equal(file.title, 'Moonpaw’s Case File');
    assert.deepEqual(file.groups.map(g => g.title), ['What I saw myself', 'What I was told (to check)']);
    // the row of bark gave two cards, three for a noticing cat
    assert.deepEqual(rowAt(rows, rowF).scratched, noticing ? ['tidy', 'dug-earth', 'scale'] : ['tidy', 'scale'], name);
    // her first card: no mark on it yet, and its line is her own balloon, lettered once
    const first = rowAt(rows, giving[0]);
    assert.deepEqual(first.cards.map(k => [k.id, k.showLine, k.showMark]), [['four-a-night', false, false]], name);
    assert.equal(first.say[0].text, 'Four gone every night.');
    // every other card frame letters the card's line under the panel, with its mark
    // (the wing's frame shows a noticing cat the fox's FLEW beside it: hers already, and marked `held`)
    giving.slice(1).filter(id => rowAt(rows, id)).forEach(id => assert.deepEqual(rowAt(rows, id).cards.filter(k => !k.held).map(k => [k.showLine, k.showMark]), [[true, true]], name + ' ' + id));
    assert.deepEqual(wingRow(rows).cards.map(k => [k.id, k.mark, k.showLine, k.showMark, !!k.held]),
      [['cant-fly', 'eye', true, true, false]].concat(noticing ? [['fox-flew', 'ear', true, true, true]] : []), name + ': the wing, and beside it the fox’s FLEW for the cat who caught it');
    assert.equal(cat.cards.filter(k => k.id === 'fox-flew').length, 1, name + ': the fox’s card is given once, at the border’s row of bark, and not again');
    assert.ok(cat.cards.findIndex(k => k.id === 'fox-flew') < cat.cards.findIndex(k => k.id === 'cant-fly'), name);
    // the "Skritch" frame opens her Case File and goes on when it closes; before it no button, after it one;
    // and after it a frame that gives a card wiggles the button once
    const fileF = ids.find(id => frames[id].file), fr = rowAt(rows, fileF);
    assert.deepEqual([fr.kind, fr.hasFile, fr.wiggle], ['file', true, false], name + ': the button glows there; no wiggle');
    rows.forEach(r => assert.equal(r.hasFile, at(r.id) >= at(fileF), name + ' ' + r.id + ': the button'));
    assert.deepEqual(rows.filter(r => r.wiggle).map(r => r.id), giving.filter(id => at(id) > at(fileF) && rowAt(rows, id)), name + ': a wiggle for each card after it');
    assert.equal(rows[rows.findIndex(r => r.id === fileF) + 1].id, E.landing(cat, story, frames[fileF].file.next), name + ': closing it turns the page');
    assert.deepEqual(E.resolveScene(frames[ids[ids.length - 1]].scene, cat, STORIES).opts.bark.map(k => k.picture), want, name + ': her nest holds them all');
    // the row along her nest is her own cards on every bedtime panel, card for card with its mark: what her
    // file shows at that moment, never a count the art fills from a standard order
    const marked = list => list.map(cid => cid + ':' + story.cards[cid].mark);
    const nests = rows.filter(r => r.nest);
    assert.equal(nests.length, 9, name + ': nine bedtime panels with the row');
    nests.forEach(r => assert.deepEqual(r.nest, marked(r.file), name + ' ' + r.id + ': the row is her file'));
    // "skritch, skritch": the wing is not there yet (it is the next panel's card, scratched in the dark)...
    const sk = rowAt(rows, ids.find(id => /In your nest: skritch, skritch\./.test(T(id)))), wing = rowAt(rows, giving[5]);
    assert.deepEqual(sk.nest, marked(want.filter(cid => cid !== 'cant-fly')), name + ': no wing in the row a page early');
    assert.ok(!sk.nest.includes('cant-fly:eye') && wing.nest[wing.nest.length - 1] === 'cant-fly:eye', name + ': the wing goes in as she scratches it, the newest');
    // ... a cat who is not noticing never has the dug earth in it, and one who found Squall has his two shapes
    nests.forEach(r => {
      assert.equal(r.nest.includes('dug-earth:eye'), noticing, name + ' ' + r.id + ': the dug earth is a noticing cat’s');
      assert.equal(r.nest.includes('squall-shapes:ear'), c.up, name + ' ' + r.id + ': Squall’s card is a cat’s who went up');
    });
    // the row on the sand, after the bark Tap: exactly the pieces she has scratched by each panel
    const sands = rows.filter(r => r.sand);
    assert.ok(sands.length >= 4, name + ': ' + sands.length + ' panels of the row on the sand');
    sands.forEach(r => {
      assert.deepEqual(r.sand, marked(want.slice(0, r.sand.length)), name + ' ' + r.id + ': the row is the first of her cards, in order');
      // every piece shown scratched is a card she holds by then, bar the one this very panel shows her scratching
      assert.ok(r.sand.length <= r.file.length, name + ' ' + r.id + ': nothing in the row she has not scratched (' + r.sand.length + ' of ' + r.file.length + ')');
    });
    // Squall's card, given a page before the roof's last two: in her file on all three, never out for a page
    if (c.up) {
      const from = rows.findIndex(r => r.id === giving[3]), flagAt = rows.findIndex(r => frames[r.id].sets && frames[r.id].sets.foundSquall);
      assert.ok(flagAt - from === 2, name + ': a page between the card and the flag');
      rows.slice(from).forEach(r => assert.ok(r.file.includes('squall-shapes'), name + ' ' + r.id + ': in her file from the frame that gives it on'));
      rows.slice(0, from).forEach(r => assert.ok(!r.file.includes('squall-shapes'), name + ' ' + r.id));
    }
  }
  // a second reading never gives a card twice
  const again = fresh({ specialty: 'noticing' });
  read(again, { up: true });
  const n = again.cards.length;
  E.startChapter(again, story, 9000);
  read(again, { up: false, t: 9000 });
  assert.equal(again.cards.length, n);
  assert.equal(n, 9);
});

test('the roof: Back before its last frame, then “Not today”, leaves no flag, no page and no card; after it, everything stays', () => {
  const tapF = ids.find(id => frames[id].sets && frames[id].sets.foundSquall), cardF = ids.find(id => frames[id].card === 'squall-shapes');
  const roofIds = ids.filter(id => isUp(id));
  for (const flags of [{ ch3Told: true, specialty: 'friends' }, { ch3Told: false, specialty: 'noticing' }, { ch3Told: true, specialty: 'climbing' }]) {
    for (const stop of roofIds.filter(id => id !== tapF)) {
      const cat = fresh(flags);
      if (!E.shows(frames[stop], cat)) continue;
      const name = JSON.stringify(flags) + ' back from ' + stop;
      read(cat, { up: true, stop });
      assert.equal(cat.frame, stop);
      // on the card's own roof frame her file does show it
      if (stop === cardF) assert.ok(E.cards(cat, STORIES).some(k => k.id === 'squall-shapes'), 'in her file on that screen');
      while (cat.frame !== TOWER) assert.ok(E.back(cat, story), name);
      const rows = read(cat, { up: false });
      assert.ok(!('foundSquall' in cat.flags), name + ': no foundSquall key');
      assert.equal(E.buildFullBook(cat, STORIES).dragonets.found.some(d => d.id === 'squall'), false, name + ': no Squall page');
      assert.ok(!E.cards(cat, STORIES).some(k => k.id === 'squall-shapes'), name + ': no squall-shapes card in her file, whatever the save holds');
      assert.equal(cat.cards.some(k => k.id === 'squall-shapes'), at(stop) > at(cardF) || stop === cardF, name + ': the save keeps what the roof gave');
      // and nothing that reading shows afterwards says "Squall"
      assert.doesNotMatch(readWords(rows), /Squall/, name);
      assert.doesNotMatch(E.buildBook(story, cat).recap.join(' '), /Squall/, name);
      assert.ok(E.isFinished(cat, 'ch04'));
      // the day she finishes the scene, the card is back
      E.startChapter(cat, story, 9000);
      read(cat, { up: true, t: 9000 });
      assert.ok(E.cards(cat, STORIES).some(k => k.id === 'squall-shapes') && cat.flags.foundSquall === true, name + ': found on a later reading');
    }
  }
  // Back after the last roof frame, and a second reading with "Not today", keep the flag, the page and the card
  const cat = fresh({ ch3Told: true });
  const underBridge = E.landing(cat, story, frames[tapF].skip.next);
  read(cat, { up: true, stop: underBridge });
  assert.equal(cat.flags.foundSquall, true);
  while (cat.frame !== TOWER) assert.ok(E.back(cat, story));
  assert.equal(cat.flags.foundSquall, true, 'Back never unsets it');
  const f = frames[TOWER];
  assert.deepEqual(E.options(f, cat).map(o => E.optionLabel(o.option, cat)), ['Go up and see Squall again.', 'Not today. He’s guarding.']);
  const rows = read(cat, { up: false });
  assert.equal(cat.flags.foundSquall, true);
  assert.ok(E.cards(cat, STORIES).some(k => k.id === 'squall-shapes'));
  assert.deepEqual(E.buildFullBook(cat, STORIES).dragonets.found.map(d => d.id), ['sprinkle', 'squall']);
  // the lines under the bridge, at the den and at bedtime read the flag, not this reading's choice
  const w = readWords(rows);
  assert.match(w, /I found your littlest brother\. He says: five\./);
  assert.match(w, /At the den, you tell Tallyheart about Squall, and what he saw\./);
  assert.match(w, /Goodnight, Squall\./);
  assert.doesNotMatch(w, /Sprinkle first|still up there/);
  // a cat who never went up has none of the three
  const never = fresh({ ch3Told: false });
  read(never, { up: false });
  assert.ok(!('foundSquall' in never.flags) && !never.cards.some(k => k.id === 'squall-shapes'));
  assert.deepEqual(E.buildFullBook(never, STORIES).dragonets.found.map(d => d.id), ['sprinkle']);
  // the choice itself sets nothing: "Not today" never writes foundSquall: false
  assert.ok(!('foundSquall' in never.flags));
});

test('the taps log nothing; the glitter turns the page on a tap on the glint and on nothing else', () => {
  const cat = fresh({ ch3Told: true });
  const rows = read(cat, { up: true });
  // 17 answers typed; the rim, the forepaw, the promise and the bedtime tens add none
  assert.equal(rows[rows.length - 1].counts - rows[0].counts, 17);
  ids.filter(id => frames[id].skip).forEach(id => {
    const i = rows.findIndex(r => r.id === id);
    assert.equal(rows[i + 1].counts, rows[i].counts, id + ': a skip-count logs nothing');
  });
  // the glitter frame: a tap on the glint (or Space, Enter, →: the engine's Next) turns the page; a tap anywhere else doesn't
  const sun = ids.find(id => frames[id].scratch && frames[id].scratch.tap);
  const g = /data-art="glint"[\s\S]*?<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="none"\/>/.exec(A.render(frames[sun].scene, { look: { fur: 'ginger' } }).svg);
  const spot = { x: +g[1] / 16, y: +g[2] / 10 }, reach = +g[3] / 16, W = 1000, H = 625, hit = PC.ui.taps.hit;
  assert.equal(hit(W, H, spot, W * spot.x / 100, H * spot.y / 100, reach), true, 'on the glint');
  assert.equal(hit(W, H, spot, W * spot.x / 100 + 40, H * spot.y / 100 - 30, reach), true, 'a small finger, near it');
  [[10, 10], [50, 95], [5, 60], [95, 20]].forEach(([x, y]) => assert.equal(hit(W, H, spot, W * x / 100, H * y / 100, reach), false, 'not at ' + x + ',' + y));
  const tapCat = fresh({});
  read(tapCat, { stop: sun });
  assert.equal(E.scratchTap(tapCat, story, 5), null, 'nothing is scratched there, and no card is given');
  assert.ok(E.next(tapCat, story, 6));
  assert.equal(tapCat.frame, frames[sun].scratch.next);
  // her first tap on the bark gives no card (the frame it turns to does); the row gives its cards as she taps
  const curl = ids.find(id => frames[id].scratch && frames[id].scratch.draws);
  const c2 = fresh({ specialty: 'noticing' });
  read(c2, { stop: curl });
  assert.deepEqual([c2.cards.length, E.scratchTap(c2, story, 7)], [0, null]);
  assert.deepEqual(E.scratchPieces(frames[curl], c2, story, STORIES).map(p => [p.id, !!p.draws, p.done]), [['four-a-night', true, false]]);
  E.next(c2, story, 8);
  assert.deepEqual(c2.cards.map(k => k.id), ['four-a-night']);
  E.next(c2, story, 9);
  const rowF = c2.frame;
  assert.deepEqual(E.scratchPieces(frames[rowF], c2, story, STORIES).map(p => [p.id, !!p.head, p.done]), [['four-a-night', true, true], ['tidy', false, false], ['dug-earth', false, false], ['scale', false, false]]);
  assert.equal(E.scratchTap(c2, story, 10), 'tidy');
  // Back and forward again: the row picks up where she left it
  E.back(c2, story); E.next(c2, story, 11);
  assert.deepEqual(E.scratchPieces(frames[rowF], c2, story, STORIES).filter(p => !p.done).map(p => p.id), ['dug-earth', 'scale']);
  // however the page turns, no card is left behind
  E.next(c2, story, 12);
  assert.deepEqual(c2.cards.map(k => k.id), ['four-a-night', 'tidy', 'dug-earth', 'scale']);
});

/* ------------------------------------------------------------------ book and teaser */

function recapFor(flags) {
  return story.book.recap.filter(r => E.matches(r.when, { flags }));
}

test('book: title, chapter title, a 6–10 sentence recap on every combination, and Squall’s page only for a cat who found him', () => {
  const b = story.book;
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'The Glittering Scale');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}paw’s dream that night is not in the Case File.');
  b.recap.forEach((r, i) => {
    assert.ok(typeof r.text === 'string' && r.text.trim(), 'recap ' + i);
    if (r.when) Object.keys(r.when).forEach(k => {
      if (k === 'not') return Object.keys(r.when.not).forEach(kk => assert.ok(FLAGS4[kk], 'recap ' + i + ': not ' + kk));
      // (and `ch5Roof`, chapter 5's flag for a cat who met Squall there: this page must not say she met him here)
      assert.ok(FLAGS4[k] || k === 'ch5Roof', 'recap ' + i + ': a chapter 4 recap line reads only chapter 4’s two flags and chapter 5’s ch5Roof, not ' + k);
    });
    assert.match(r.text, /[.!?”’]$/, 'recap ' + i + ' is a whole sentence');
    assert.ok(words(r.text) <= 30, 'recap ' + i + ' is short: ' + words(r.text));
    assert.doesNotMatch(r.text, /\byou\b/i, 'recap is third person: ' + r.text);
  });
  let n = 0;
  for (const foundSquall of [true, false, undefined]) for (const ch4CaughtFly of [true, undefined]) for (const ch3Told of [true, false]) {
    const flags = { ch3Told }; if (foundSquall !== undefined) flags.foundSquall = foundSquall; if (ch4CaughtFly) flags.ch4CaughtFly = true;
    const r = recapFor(flags), all = r.map(x => x.text).join(' ');
    assert.ok(r.length >= 6 && r.length <= 10, JSON.stringify(flags) + ': ' + r.length + ' sentences');
    assert.equal(r.length, 9 + (ch4CaughtFly ? 1 : 0) + (foundSquall && !ch4CaughtFly ? 1 : 0), JSON.stringify(flags));
    // the roof, either way; his name only if she found him; his news of the tracks only then
    assert.equal(/Squall/.test(all), !!foundSquall, JSON.stringify(flags));
    assert.equal(/two skinny shapes that go to the tracks every night/.test(all), !!foundSquall);
    assert.equal(/Sprinkle’s littlest brother is still roaring, and hiccuping\./.test(all), !foundSquall);
    assert.equal(/caught one hole in the fox’s story: Reynard said the dragon flew, and Sprinkle can’t fly\./.test(all), !!ch4CaughtFly);
    assert.match(all, /On the roof of \{their\} old tower/);
    n++;
  }
  assert.equal(n, 12);
  // A page says "found" only for a dragonet found in its own chapter (chapter 5's Build notes, "The
  // book"): a cat who said "Not today" here and went up in chapter 5 has `foundSquall` and `ch5Roof`.
  // This page tells her he was still roaring, never that she found him here; chapter 5's page says that.
  for (const ch4CaughtFly of [true, undefined]) {
    const flags = { ch3Told: true, foundSquall: true, ch5Roof: true }; if (ch4CaughtFly) flags.ch4CaughtFly = true;
    const r = recapFor(flags), all = r.map(x => x.text).join(' ');
    assert.equal(r.length, 9 + (ch4CaughtFly ? 1 : 0), JSON.stringify(flags));
    assert.doesNotMatch(all, /Squall|two skinny shapes/, JSON.stringify(flags) + ': not found on this page');
    assert.equal((all.match(/Sprinkle’s littlest brother is still roaring, and hiccuping\./g) || []).length, 1, JSON.stringify(flags) + ': still roaring, once');
  }
  // ... and a cat who met him here (no ch5Roof, or ch5Roof false) reads "found", never "still roaring", exactly as before
  [{ foundSquall: true }, { foundSquall: true, ch5Roof: false }].forEach(flags => {
    const all = recapFor(flags).map(x => x.text).join(' ');
    assert.match(all, /found Squall, the littlest dragonet/, JSON.stringify(flags));
    assert.doesNotMatch(all, /still roaring/, JSON.stringify(flags));
  });
  assert.deepEqual(b.recap.filter(r => r.when && 'ch5Roof' in r.when).map(r => [r.when.foundSquall, r.when.ch5Roof]), [[true, false], [true, false], [true, false], [undefined, true]]);
  // the text's proposed sentences, word for word
  const all = b.recap.map(r => r.text);
  ['On {name}paw’s third morning, the pile lay in rows of ten, and a gap showed in a heartbeat: four more pieces gone, twelve in three nights.',
    'Tallyheart taught {name}paw {their} fourth Count, both forepaws, and scratched a fourth claw mark on the tree.',
    'In the gap lay a glittering ‘scale,’ smooth, like glass.',
    'A smiling fox named Reynard came to the border and said he saw a dragon fly off with the prey by moonlight. Most of the Clan believed him.',
    '{name}paw asked a fair question, and Glintstar gave the dragon until the full moon.',
    '{name}paw started a Case File: a piece of bark for every clue, with an eye for what {they} saw and an ear for what {they} was told.',
    '{They} caught one hole in the fox’s story: Reynard said the dragon flew, and Sprinkle can’t fly.',
    'On the roof of {their} old tower, {they} found Squall, the littlest dragonet, who roars at airplanes and hiccups.',
    'Squall told {them} about two skinny shapes that go to the tracks every night. A thing to check.',
    'On the roof of {their} old tower, Sprinkle’s littlest brother is still roaring, and hiccuping.',
    'Under the Old Bridge, Sprinkle looked herself over and said the scale wasn’t hers, and three friends made a thirty-claw promise.',
    'That night there were forty in the rows, a moon as thin as a curl of bark, and a grey tom who fell asleep by fifty.'].forEach(s => assert.ok(all.includes(s), s));
  // nothing in the recap depends on told or kept, and nothing solves the case
  assert.ok(b.recap.every(r => !r.when || !('ch3Told' in r.when)));
  assert.doesNotMatch(all.join(' '), /weasel|is glass|was glass/);
  // the engine builds the page
  const cat = E.blankCat({});
  cat.name = 'Fern'; cat.petname = 'Biscuit'; cat.look.sex = 'tom';
  cat.flags = { specialty: 'noticing', worry: 'water', ch2Path: 'bridge', ch3Told: false, ch4CaughtFly: true, foundSquall: true };
  const page = E.buildBook(story, cat);
  assert.equal(page.recap.length, 10);
  assert.equal(page.chapter, 'Chapter 4: The Glittering Scale');
  assert.ok(page.recap.includes('He caught one hole in the fox’s story: Reynard said the dragon flew, and Sprinkle can’t fly.'), 'for a tom too, one “he”: the cat');
  // no recap line gives a tom two different he's (the cat, then the fox) in one sentence
  page.recap.forEach(l => assert.ok((l.match(/\b[Hh]e\b/g) || []).length <= 1 || !/fox|Reynard/.test(l), l));
  assert.ok(page.recap.includes('On the roof of his old tower, he found Squall, the littlest dragonet, who told him about two skinny shapes that go to the tracks every night.'));
  assert.ok(page.recap.some(s => /an eye for what he saw and an ear for what he was told\./.test(s)));
  assert.equal(page.dream, 'Fernpaw’s dream that night is not in the Case File.');
  // Squall's page: only once she has found him, whichever chapter is finished
  const dn = b.dragonet;
  assert.deepEqual([dn.id, dn.name, dn.when], ['squall', 'Squall', { foundSquall: true }]);
  assert.ok(dn.lines.length >= 2 && dn.lines.length <= 4 && dn.lines.every(l => words(l) <= 22 && /[.!?]$/.test(l)));
  assert.equal(dn.lines.join(' '), 'The littlest of the clutch, slate grey with yellow flecks like sparks, and the loudest. {name}paw found him on the roof of the tallest tower, hugging the pole of the red light and roaring at airplanes. He thinks they are giant dragons. His roar ends in a hiccup. Five more claws, counted.');
  cat.finished = { ch01: 1, ch02: 2, ch03: 3 };
  assert.deepEqual(E.buildFullBook(cat, STORIES).dragonets.found.map(d => [d.id, d.chapter]), [['sprinkle', 'ch03'], ['squall', 'ch04']], 'as soon as the flag is set');
  assert.equal(E.buildFullBook(cat, STORIES).dragonets.toFind, 5);
  assert.match(E.buildFullBook(cat, STORIES).dragonets.found[1].lines[1], /^Fernpaw found him on the roof of the tallest tower/);
  delete cat.flags.foundSquall;
  cat.finished.ch04 = 4;
  assert.deepEqual(E.buildFullBook(cat, STORIES).dragonets.found.map(d => d.id), ['sprinkle'], 'finishing the chapter is not finding him');
});

test('the teaser for chapter 5, and chapter 3’s for this one', () => {
  assert.equal(story.teaser.title, 'Chapter 5: Riffle’s River');
  assert.deepEqual(story.teaser.lines, ['Tomorrow, you ride Riffle’s raft, to ask the river who was awake on the storm night.', 'And forty pieces lie in their rows.']);
  story.teaser.lines.forEach(l => assert.ok(words(l) <= 25, l));
  // nothing about the raft riding low (chapter 5's find), and nothing about a gap at sunrise (not promised)
  assert.doesNotMatch(story.teaser.lines.join(' '), /low|gap|sunrise|missing/i);
  const cat = E.blankCat({}); cat.name = 'Moon';
  const t = E.teaser(story, cat, PC.story);
  const ch05 = E.chapters(PC.story).find(s => s.number === 5);
  assert.equal(t.title, 'Chapter 5: Riffle’s River');
  // chapter 5 is built now: the hub offers it, and never "coming soon"
  assert.ok(ch05 && ch05.id === 'ch05' && ch05.title === 'Riffle’s River', 'chapter 5 is built');
  assert.ok(Object.values(ch05.frames).every(f => !/^STUB\b/.test(f.board || '')), 'and no stub frame is left in it');
  assert.deepEqual([t.built, t.next], [true, 'ch05'], 'chapter 5: built');
  const c4 = E.blankCat({}); c4.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4 };
  const p4 = E.progress(c4, PC.story);
  assert.deepEqual([p4.next && p4.next.id, E.chapterHeading(p4.next), p4.soon], ['ch05', 'Chapter 5: Riffle’s River', null], 'the hub’s big button after chapter 4');
  // the teaser's two lines are paid off: she rides Riffle's raft, and chapter 5 opens on the rows ("And forty
  // pieces lie in their rows.": the first thing she does there is on its first screen)
  const first5 = ch05.frames[ch05.start];
  assert.deepEqual([first5.scene.set, first5.scene.cam, first5.scene.opts.rows.length], ['pile', 'rows', 4], 'chapter 5 opens on last night’s four rows');
  assert.ok(first5.scratch && first5.scratch.tap, 'with something to do on its first screen');
  assert.ok(Object.values(ch05.frames).some(f => f.scene.set === 'openriver'), 'and she rides the raft');
  // chapter 3's teaser is paid off on this chapter's first screen, and chapter 4 is built now
  const t3 = E.teaser(PC.story.ch03, cat, PC.story);
  assert.deepEqual([t3.title, t3.built, t3.next], ['Chapter 4: The Glittering Scale', true, 'ch04']);
  assert.match(PC.story.ch03.teaser.lines.join(' '), /both forepaws/);
  assert.match(PC.story.ch03.teaser.lines.join(' '), /someone hiccups/);
  assert.match(T(story.start), /hic!/);
  // the hub's big button
  const c3 = E.blankCat({}); c3.finished = { ch01: 1, ch02: 2, ch03: 3 };
  const p = E.progress(c3, STORIES);
  assert.deepEqual([p.next && p.next.id, E.chapterHeading(p.next)], ['ch04', 'Chapter 4: The Glittering Scale']);
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean and fill renders the same text', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind];
    const cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
});

test('every combination plays through the engine: flags, the lessons, the taps, her cards, the dream, the end, the book', () => {
  for (const c of COMBOS) for (const light of (c.flags.worry === 'talk' ? [0, 1] : [0])) {
    const name = comboName(c) + ' light ' + light;
    const cat = fresh(c.flags);
    const counted = cat.counts.length;
    const rows = read(cat, { up: c.up, light });
    const walked = rows.map(r => r.id);
    assert.equal(E.kindOf(frames[walked[walked.length - 1]]), 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch04'), name + ': chapter 4 is finished');
    // no frame that shows nothing
    rows.forEach(r => { if (r.kind !== 'end') assert.ok(r.caps.length + r.say.length + (frames[r.id].sfx ? 1 : 0) > 0, name + ' ' + r.id + ' shows nothing'); });
    // the flags: the two sticky ones as they should be, the engine's two, and nothing else of chapter 4's
    assert.equal(cat.flags.foundSquall, c.up ? true : undefined, name);
    assert.equal(cat.flags.ch4CaughtFly, c.flags.specialty === 'noticing' ? true : undefined, name);
    assert.deepEqual(Object.keys(cat.flags).filter(k => !(k in FLAGS1) && !(k in FLAGS2) && !(k in FLAGS3)).sort(),
      ['caseFile', 'caseFileOpen'].concat(c.flags.specialty === 'noticing' ? ['ch4CaughtFly'] : [], c.up ? ['foundSquall'] : []).sort(), name + ': the choices set no flag');
    assert.deepEqual(walked, walk(c.flags, { up: c.up, light }).slice(), name + ': the engine walks the same frames');
    const sets = ['ch04-claws', 'ch04-tens', 'ch04-pile', 'ch04-night'].concat(c.up ? ['ch04-riddle'] : []);
    sets.forEach(s => assert.ok(cat.lessons[s] && cat.lessons[s].noHelp, name + ': ' + s));
    assert.equal(!!cat.lessons['ch04-riddle'], c.up, name);
    assert.equal(cat.counts.length - counted, c.up ? 17 : 16, name + ': the typed answers; the taps never logged');
    assert.equal(cat.dreams.ch04, 'the fox wore a wall');
    assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10]);
    assert.equal(E.status(cat, STORIES), 'Chapter 4 finished');
    const page = E.buildBook(story, cat);
    assert.equal(page.dream, 'Moonpaw’s dream: “The fox wore a wall.”');
    assert.ok(page.recap.length >= 6 && page.recap.length <= 10, name + ': ' + page.recap.length);
    assert.equal(E.buildFullBook(cat, STORIES).dragonets.found.some(d => d.id === 'squall'), c.up, name);
    // the speakers as the page labels them: never "Squall" before he says so, never "The fox" once he is named
    const said = rows.flatMap(r => r.say.map(b => [r.id, b.who, b.label]));
    said.filter(x => x[1] === 'reynard').forEach(x => assert.equal(x[2], 'Reynard', name + ' ' + x[0]));
    const intro = ids.find(id => /…I’m Squall\./.test(T(id)));
    said.filter(x => x[1] === 'squall').forEach(x => assert.equal(x[2], at(x[0]) >= at(intro) ? 'Squall' : 'The little dragon', name + ' ' + x[0]));
    if (c.up) {
      const riddle = rows.find(r => r.lesson && frames[r.id].counts.set === 'ch04-riddle');
      riddle.lesson.forEach(l => { assert.match(l.prompt.join(' '), /^The little dragon: /); assert.deepEqual(l.balloons, ['The little dragon: THIRTY-FIVE!']); });
    }
    // the scenes resolve for her: her stone by her nose in every den, her bark from "skritch" on
    walked.filter(id => frames[id].scene.set === 'den').forEach(id => assert.equal(E.resolveScene(frames[id].scene, cat, STORIES).opts.stone, 'nose', id));
  }
  // with misses everywhere she still reaches the end, and every retry and filler is asked
  const cat = fresh({ specialty: 'noticing', ch3Told: false });
  const rows = read(cat, { up: true, answers: { '3x5': [14], '2x5': [11], '4x10': [41, 14], '10x3': [34], '10x10': [1000], '3x10': [13], '2x10': [13], '7x5': [34, 30] } });
  assert.equal(rows[rows.length - 1].kind, 'end');
  const w = readWords(rows);
  assert.match(w, /\nRemember: hopping by tens, every number ends in a zero\. Let’s scratch it out together\./);
  assert.match(w, /\nRemember: counting by tens, every number ends in a zero\. Let’s scratch it out: ten marks for every row\./);
  assert.match(w, /\nScratch it on the roof! You hop!/);
  assert.match(w, /Tallyheart: One from this morning\. One cat\. How many front claws\?/);
  assert.match(w, /The little dragon: Mama’s count again! Seven forepaws, five claws each\. How many claws\?/);
  assert.match(w, /The little dragon: Do another one! One paw\. How many claws\?/);
  assert.doesNotMatch(w.split('\n').filter(l => /^The little dragon:/.test(l)).join(' '), /Squall/);
  assert.ok(!['ch04-claws', 'ch04-tens', 'ch04-pile', 'ch04-riddle', 'ch04-night'].some(s => cat.lessons[s].noHelp));
});
