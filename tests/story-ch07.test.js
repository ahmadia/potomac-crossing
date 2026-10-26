/* Story tests for chapter 7: node --test
 *
 * Checks app/story/ch07.js against the frame contract in docs/build.md, against the story
 * (docs/chapters/07-the-counts-dont-lie.md, Draft v0.4, final) and against its spec
 * (docs/chapters/07-the-counts-dont-lie.spec.md, v0.3, the build's contract): the frame graph (frames
 * shown only `when` they match, the told and kept paths' twin panels, the choices only one path sees and
 * their `else`), one interaction per frame, the choices (none sets a flag) and the one sticky flag,
 * `ch7Flew`, never `ch4CaughtFly`; the Counts frames and sets exactly as the spec has them, with every
 * test its build notes list (the warm-up's hard pick, the lesson's misses, twins and the check, the
 * twenty-four's `table: 4` and its fillers, the sixties' fillers on both paths, 15 typed answers, the
 * Hollow's “Whiskers · the 6s” and the seventh mark only after the lesson); the skip-counts (the gaps,
 * her whiskers kept, the five cheeks, the bedtime faces), Tallyheart's six Counts and the pages she
 * taps once, each with its target in the art; her four cards on their frames, Waffles' in a row of three
 * with the fox's moon and Patience's, the tunnel beside Coil's, three under the moss, and FLEW against
 * can't-fly from the FLEW screen on for every cat; every `when`; the speakers; tokens, storyboards, word
 * counts, captions, the art vocabulary, the staging, the time of day, the generated storyboard, every
 * frame rendered with everyone in the picture, the beats in order on every path, the book (6 to 10
 * sentences on every path), the teaser for chapter 8, and whole play-throughs through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch07.test.js   prints the whole chapter, rendered three ways.
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
const story = PC.story.ch07;
const frames = story.frames;
const ids = Object.keys(frames);
const ch04 = PC.story.ch04, ch05 = PC.story.ch05, ch06 = PC.story.ch06;
const STORIES = [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05, ch06, story];

/* ------------------------------------------------------------------ the contract */

// The flags a `when` may test: chapters 1 to 6's, and chapter 7's own one (set by reaching the FLEW
// screen, never by a choice, and never unset). No choice of this chapter sets anything.
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
const FLAGS7 = { ch7Flew: [true, false] };
const FLAGS = Object.assign({}, FLAGS1, FLAGS2, FLAGS3, FLAGS4, FLAGS5, FLAGS6, FLAGS7, { lessonClean: ['ch07-sixes'] });
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'sfxAt', 'sfxRead', 'gift', 'when', 'else', 'sets', 'card'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things', 'also']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
// Time of day comes from fx: night in the den as she wakes before the sun, then morning (her old step,
// the tower, the pile, the Hollow), day under the Old Bridge, sunset and dusk at the pile, night in the den
const TOD = ['morning', 'day', 'sunset', 'dusk', 'night'];
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat', 'sloshbank', 'reedclan'];
const RIM_ANCHORS = ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'];
const CARD_IDS = ['waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel'];
const SETS = ['ch07-pile', 'ch07-threes', 'ch07-sixes', 'ch07-gone', 'ch07-dragon', 'ch07-riffle'];
// the Counts frames whose own lines are not said again over the first question (`intro: false`)
const NO_INTRO = ['ch07-pile', 'ch07-threes', 'ch07-sixes'];
const TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
const NOTICING = { specialty: 'noticing' }, NOT_NOTICING = { not: { specialty: 'noticing' } };
const CAUGHT = { specialty: 'noticing', ch4CaughtFly: true };
// the spots of their own: our cat nose to nose with Tallyheart; our cat in front of the rows on `low`;
// Tallyheart across the nook under the bridge (chapter 6's), and by the wall behind our cat while Sprinkle
// tries her wings (FLY: nobody in front of the hurt wing); Riffle in the three-shot under the arch
const CLOSE = { x: 820, y: 892, h: 280 }, FRONT = { x: 820, y: 940, h: 390 }, ACROSS = { x: 1250, y: 900, h: 330 }, RIFFLE = { x: 400, y: 940 };
const BY_WALL = { x: 300, y: 960, h: 330 };
// our cat in the loop of Sprinkle's curled tail, in front of her (chapter 3's spot for the same hug)
const TAIL = { x: 750, y: 822 };

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
/* The frames that say this, in reading order; F: the one frame that does; F2: the twins that do (a panel
 * drawn once for the told path, with Tallyheart in it, and once for the kept path). */
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
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A tunnel full of whiskers.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'Six, twelve, eighteen, twenty-four.' },
  // a player whose own Clan name is Murmur: the warrior is Mutterchime
  murmur: { name: 'Murmur', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Waffles on the grass.' }
};
const FACT = { a: 6, b: 4, answer: 24, groups: 4, per: 6, thing: 'whisker', things: 'whiskers', also: '' };
function fill(text, p) { return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : k in FACT ? FACT[k] : m)); }

/* Anything that reads badly once the tokens are filled (the chapter 1 rules). */
function badGrammar(text, isSfx) {
  const bad = [];
  if (/[{}]/.test(text)) bad.push('unfilled token');
  // (“If she were our thief”: the subjunctive, right after “if”)
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

/* Every line in the chapter: frames (every variant), options, the instructions under the pages she
 * taps, Tallyheart's six Counts and our cat's answers, her cards, the Counts lines, the book, the teaser. */
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
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* The choices: is grass soft (light: Waffles' answer, a panel each); the told path's sum and the kept
 * path's (each with its one outcome panel and her card; the other path is turned past by `else`); the
 * FLEW screen (no outcome panel); sniff or listen at the tunnel (told and kept twins, the two outcomes
 * shared). Every reader meets four. */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const GRASS = choiceAt(/^“Very soft\.”$/)[0];
const SUM_TOLD = choiceAt(/^“So it WASN’T Sprinkle!”$/)[0];
const SUM_KEPT = choiceAt(/^“So it WASN’T you, Sprinkle!”$/)[0];
const FLEW = choiceAt(/^“So Reynard LIED!”$/)[0];
const TUNNEL = choiceAt(/^Sniff the tunnel\.$/);
/* The option a reader takes at a choice: `light` (0 or 1) at every one. */
function pick(id, o) { return (o && o.light) || 0; }
/* The frames a reader with these flags walks through, in order (the engine's own E.landing passes
 * over a frame whose `when` doesn't match, or turns it to its `else`); a frame's `sets` are flags from
 * then on. `clean`: she needed no help in the sixes. The flags as they ended are on the result (`.flags`). */
function catFor(flags, o) {
  return { flags: Object.assign({}, flags), look: { sex: 'she' }, lessons: (o || {}).clean === false ? {} : { 'ch07-sixes': { finished: true, noHelp: true } } };
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
/* Every combination of told or kept, the specialty, the worry, FLEW caught at the border in chapter 4 or
 * not, chapter 7 read before (`ch7Flew` already set) or not, and her stone by her nose or under her chin:
 * 320; each walked with both light choices. */
const COMBOS = [];
for (const ch3Told of FLAGS3.ch3Told) for (const specialty of FLAGS1.specialty) for (const worry of FLAGS1.worry)
  for (const ch4CaughtFly of [false, true]) for (const before of [false, true]) for (const ch2Stone of ['nose', 'chin']) {
    const flags = { ch3Told, specialty, worry, ch2Stone, ch2Path: 'bridge' };
    if (ch4CaughtFly) flags.ch4CaughtFly = true;
    if (before) flags.ch7Flew = true;
    COMBOS.push({ flags, before, o: {} });
  }
const comboName = c => JSON.stringify(c.flags);
// a spread of the combinations for the heavier checks
const SOME = COMBOS.filter((c, i) => i % 7 === 0);

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch07');
  assert.equal(story.number, 7);
  assert.equal(story.title, 'The Counts Don’t Lie');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.ok(ids.length >= 100 && ids.length <= 120, 'a full chapter of panels, under the brief’s 120 (' + ids.length + ')');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'number', 'start', 'teaser', 'title']);
  assert.equal(story.names, undefined, 'everyone on screen has been on screen before: no `names`');
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch07'), order.indexOf('ch06') + 1, 'chapter 7 follows chapter 6');
  assert.ok(Object.values(frames).every(f => !/^STUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 320);
  // the page loads it after chapter 6, and the offline copy has it
  const scripts = require('./_load.js').scripts().filter(s => /story\/ch\d+\.js$/.test(s));
  assert.ok(scripts.indexOf('app/story/ch06.js') >= 0 && scripts.indexOf('app/story/ch06.js') < scripts.indexOf('app/story/ch07.js'));
  assert.match(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), /'\.\/app\/story\/ch07\.js'/);
});

test('frame ids run f001, f002… in reading order; every edge goes forward; the numbers have no gaps; the letters say which outcome', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}[ab]?$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  const nums = [...new Set(ids.map(id => +id.slice(1, 4)))].sort((a, b) => a - b);
  nums.forEach((n, i) => assert.equal(n, i + 1, 'frame number ' + (i + 1) + ' is missing'));
  // a lettered frame is a light choice's outcome: a choice leads into it, at the number after the choice
  // (after the kept twin's, for the tunnel's twins)
  const into = {};
  ids.forEach(id => exits(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  const lettered = ids.filter(id => /[a-z]$/.test(id));
  lettered.forEach(id => assert.ok((into[id] || []).length && into[id].every(p => frames[p].choice), id + ' is reached from a choice (' + (into[id] || []).join(' ') + ')'));
  const next = id => String(+id.slice(1, 4) + 1).padStart(3, '0');
  // is grass soft: “Very soft.” is `a`, “Very WET.” is `b`, one panel each, rejoining at once
  assert.deepEqual(frames[GRASS].choice.options.map(o => o.next), ['f' + next(GRASS) + 'a', 'f' + next(GRASS) + 'b']);
  frames[GRASS].choice.options.forEach(o => assert.equal(E.kindOf(frames[o.next]), 'next'));
  assert.equal(frames[frames[GRASS].choice.options[0].next].next, frames[frames[GRASS].choice.options[1].next].next, 'a light choice rejoins at once');
  // sniff or listen: the told path's choice and the kept path's, each with its own two outcomes at its next
  // number (the same pictures and words), the told outcomes leading to the kept choice, which a told reader
  // passes over, the kept outcomes onward: each choice is on the storyboard's walk, none reached only by `else`
  assert.equal(TUNNEL.length, 2);
  assert.equal(+TUNNEL[1].slice(1, 4), +TUNNEL[0].slice(1, 4) + 2);
  TUNNEL.forEach(id => assert.deepEqual(frames[id].choice.options.map(o => o.next), ['f' + next(id) + 'a', 'f' + next(id) + 'b'], id));
  ['a', 'b'].forEach(x => {
    assert.equal(frames['f' + next(TUNNEL[0]) + x].next, TUNNEL[1], 'the told outcome ' + x + ' turns to the kept choice, passed over');
    assert.equal(frames['f' + next(TUNNEL[1]) + x].next, frames[TUNNEL[1]].else, 'the kept outcome ' + x + ' goes on to where the kept choice’s else does');
    const told = frames['f' + next(TUNNEL[0]) + x], kept = frames['f' + next(TUNNEL[1]) + x];
    assert.deepEqual([told.scene, told.caption, told.board], [kept.scene, kept.caption, kept.board], x + ': the same panel on both paths');
  });
  // the sums: one answer does for both, on one outcome panel at the next number; the FLEW screen: both
  // options to the next screen, no outcome panel
  [SUM_TOLD, SUM_KEPT, FLEW].forEach(id => assert.deepEqual(frames[id].choice.options.map(o => o.next), ['f' + next(id), 'f' + next(id)], id));
  // every lettered frame is accounted for
  assert.deepEqual(lettered.sort(), [].concat(frames[GRASS].choice.options.map(o => o.next), frames[TUNNEL[0]].choice.options.map(o => o.next), frames[TUNNEL[1]].choice.options.map(o => o.next)).sort());
});

// The frames shown only `when` they match, in reading order, with their `when` (and `else`, a choice only
// one path sees): the told and kept twins of a panel whose picture would show one of Tallyheart's spots
// or carry her lines (the told first, leading to its kept twin, which leads on: whichever is not hers is
// passed over); each path's own screens (the told sum in the Hollow, the kept path's thought, its “Back
// by sunset” and hot ears, its sixty with Riffle); and the climber's screen of its own.
const WHEN_FRAMES = [
  [/^Now, a dragon\. I know one who eats ten fish a meal\.$/, TOLD],
  [/^She winks\. If she were our thief, that’s ten every night\.$/, TOLD],
  [/^Tallyheart draws two lines in the sand\./, TOLD],
  [/^Twenty-four is much, much less than sixty\./, TOLD, 'else'],
  [/^The Counts don’t lie\.$/, TOLD],
  [/^Twenty-four pieces in six nights\.$/, KEPT],
  [/^She frowns at the sand\./, KEPT],
  [/^You KNOW a dragon who eats ten fish a meal!/, KEPT],
  [/^Back by sunset\./, KEPT],
  [/^Your ears go hot\.$/, KEPT],
  [/^Tallyheart takes you straight to the Old Bridge\./, TOLD],
  [/^At the Old Bridge, you check the bank first\./, KEPT],
  [/^Tell them\. The Counts say it wasn’t Sprinkle\./, TOLD],
  [/^Twenty-four gone in six nights\. Four every night\. TEN!/, KEPT],
  [/^If SHE were the thief, she’d take ten every night\.$/, KEPT],
  [/^You scratch two lines in the mud\./, KEPT],
  [/^Twenty-four is much, much less than sixty\./, KEPT, 'else'],
  [/^The Counts don’t lie\.$/, KEPT],
  [/^I KNEW I didn’t do it\./, TOLD],
  [/^I KNEW I didn’t do it\./, KEPT],
  [/^She wraps her tail round you\./, TOLD],
  [/^She wraps her tail round you\./, KEPT],
  [/^Tallyheart goes very still\./, TOLD],
  [/^Riffle stops wiggling\./, KEPT],
  [/^No moon, and no flying\./, TOLD],
  [/^No moon, and no flying\./, KEPT],
  [/^And at the Gathering, every Clan will hear it\./, TOLD],
  [/^Wait till the Gathering hears THAT\./, KEPT],
  [/^At dusk, the first guards take their places\..* I want to see the back\.$/, TOLD],
  [/^At dusk, the first guards take their places\. The moon comes out, fatter again\.$/, KEPT],
  [/^Tallyheart’s ears go up\. Let’s look\.$/, TOLD],
  [/^The guards are still settling in,/, KEPT],
  [/^Your paws go silent\..*A snake’s secret\.$/, TOLD],
  [/^Behind the back row is the dug earth\..*UNDER!$/, KEPT],
  [/^So THAT’S why it’s always the back\..*UNDER it\.$/, TOLD],
  [/^And I SAT here\. Right beside it!$/, TOLD, 'else'],
  [/^So THAT’S why it’s always the back\..*UNDER it\.$/, KEPT, 'else'],
  [/^You climb the bramble arch for a look\./, { specialty: 'climbing' }],
  [/^Do we wait here and pounce\?/, TOLD],
  [/^You don’t follow it\./, KEPT],
  [/^Not a word to the Clan yet\./, TOLD],
  [/^Your secret just got bigger\./, KEPT]
];
// the twins: [told, kept], each told panel leading to its kept twin, side by side
const TWINS = [
  [/^Tallyheart takes you straight to the Old Bridge\./, /^At the Old Bridge, you check the bank first\./],
  [/^Tell them\./, /^Twenty-four gone in six nights\. Four every night\./],
  [/^I KNEW I didn’t do it\./], [/^She wraps her tail round you\./],
  [/^Tallyheart goes very still\./, /^Riffle stops wiggling\./],
  [/^No moon, and no flying\./],
  [/^And at the Gathering/, /^Wait till the Gathering/],
  [/^At dusk, the first guards take their places\..* I want to see the back\.$/, /^At dusk, the first guards take their places\. The moon comes out, fatter again\.$/],
  [/^Tallyheart’s ears go up\./, /^The guards are still settling in,/],
  [/^Your paws go silent\..*A snake’s secret\.$/, /^Behind the back row is the dug earth\..*UNDER!$/],
  // (the told path's deduction is a panel of its own before Tallyheart's line and the choice, so the twin
  // of the kept choice is the told choice, “And I SAT here…”)
  [/^And I SAT here\. Right beside it!$/, () => FF(/^So THAT’S why.*UNDER it\.$/).filter(id => same(frames[id].when, KEPT))],
  [/^Do we wait here and pounce\?/, /^You don’t follow it\./],
  [/^Not a word to the Clan yet\./, /^Your secret just got bigger\./]
].map(([t, k]) => (k ? [F(t), typeof k === 'function' ? (h => { assert.equal(h.length, 1, String(k)); return h[0]; })(k()) : F(k)] : F2(t)));

test('exactly one interaction per frame (the taps and the questions included), no unknown keys, and a frame `when`, `else` or `sets` only where the story and the spec have one', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    assert.equal(f.look, undefined, id + ': chapter 7 has no look frame');
    assert.equal(f.gift, undefined, id + ': chapter 7 gives no gift');
    assert.equal(f.file, undefined, id + ': her Case File was opened in chapter 4');
  });
  // the two sounds that say where they are lettered: the chime far up the tower (near the top edge, over
  // the step's sky), and the burp by Sprinkle's mouth (above her head, at the right, where her mist is)
  const chime = F(/Ting-a-ling\.$/), burp = F(/HURP\.$/);
  assert.deepEqual(ids.filter(id => frames[id].sfxAt), [chime, burp]);
  assert.ok(frames[chime].sfxAt[1] <= 15, 'the chime rings from far up');
  const sp = frames[burp].scene.cast.find(c => c.who === 'sprinkle'), head = A.render(frames[burp].scene, {}).heads[frames[burp].scene.cast.indexOf(sp)];
  assert.ok(Math.abs(frames[burp].sfxAt[0] - head.x) < 16 && frames[burp].sfxAt[1] < head.y - 10, burp + ': by her mouth, over her head: ' + JSON.stringify(head));
  // the `when` frames, in order, each with its one way on (or, a choice, its `else`)
  const whens = ids.filter(id => frames[id].when);
  assert.deepEqual(whens.map(id => frames[id].when), WHEN_FRAMES.map(w => w[1]));
  whens.forEach((id, i) => {
    assert.match(T(id), WHEN_FRAMES[i][0], id);
    assert.notEqual(id, story.start);
    const keys = w => Object.keys(w).forEach(k => { if (k === 'not') keys(w.not); else assert.ok(FLAGS[k], id + ': when ' + k); });
    keys(frames[id].when);
    if (WHEN_FRAMES[i][2] === 'else') {
      assert.ok(frames[id].choice && frames[id].else, id + ': a choice only one path sees, and where the other path turns');
      assert.ok(frames[frames[id].else] && !same(frames[frames[id].else].when, frames[id].when), id + ': its else is the other path’s');
    } else {
      assert.equal(frames[id].else, undefined, id);
      assert.equal(exits(frames[id]).length, 1, id + ': one way on');
    }
  });
  assert.deepEqual(ids.filter(id => frames[id].else).map(id => [id, frames[id].else]), [
    [SUM_TOLD, F(/^Twenty-four pieces in six nights\.$/)], [SUM_KEPT, F(/^Sprinkle’s eyes go round\./)],
    [TUNNEL[0], TUNNEL[1]], [TUNNEL[1], F(/^You climb the bramble arch for a look\./)]]);
  // the told and kept twins stand one after the other, the told first, leading to its kept twin
  TWINS.forEach(([t, k]) => {
    assert.deepEqual([frames[t].when, frames[k].when], [TOLD, KEPT], t + ' ' + k);
    if (frames[t].choice) return assert.equal(frames[t].else, k, t + ': the kept path turns to its twin');
    assert.equal(+k.slice(1, 4) - +t.slice(1, 4), 1, t + ' and ' + k + ': side by side');
    assert.equal(exits(frames[t])[0], k, t + ' → its kept twin');
  });
  // the one flag set by reaching a frame, for good: `ch7Flew`, on the FLEW screen; never `ch4CaughtFly`
  assert.deepEqual(ids.filter(id => frames[id].sets), [FLEW]);
  assert.deepEqual(frames[FLEW].sets, { ch7Flew: true });
  ids.forEach(id => assert.ok(!(frames[id].sets && 'ch4CaughtFly' in frames[id].sets), id));
  // no choice sets anything (the spec: one new flag, no choice flag)
  ids.filter(id => frames[id].choice).forEach(id => frames[id].choice.options.forEach(o => assert.deepEqual(o.sets, {}, id)));
});

test('a child who listens hears every sentence finished: the one caption that runs on into its sound effect (her nest’s skritch) has the sound in words for Read to me; no other page is heard differently', () => {
  const NEST = F(/^In your nest:/);
  assert.deepEqual(ids.filter(id => frames[id].sfxRead !== undefined), [NEST]);
  const some = [{ flags: { ch2Stone: 'nose' } }, { flags: { ch2Stone: 'chin', ch3Told: false, specialty: 'noticing', worry: 'small', ch4CaughtFly: true } }, { flags: { ch3Told: true, worry: 'shiny', specialty: 'sneaking' } }];
  ids.forEach(id => {
    const f = frames[id];
    const runsOn = (f.caption || []).map(capText).filter(t => !E.endsSentence(t));
    if (f.sfx && runsOn.length) assert.equal(f.sfxRead, 'skritch, skritch.', id + ': “' + runsOn[0] + '” runs on into ' + f.sfx);
    if (f.sfxRead === undefined) some.forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), id + ': heard as it is lettered'));
  });
  assert.equal(frames[NEST].sfx, 'skritch, skritch.');
  assert.deepEqual(E.captionsRead(frames[NEST], some[0]), ['In your nest:', 'skritch, skritch.', 'Waffles’ curl of bark goes along the mossy edge. Three more curls go under the moss.', 'Riffle’s stone is by your nose.']);
  assert.deepEqual(E.captions(frames[NEST], some[1]), ['In your nest:', 'Waffles’ curl of bark goes along the mossy edge. Three more curls go under the moss.', 'Riffle’s stone is under your chin.']);
  assert.deepEqual(badGrammar(frames[NEST].sfxRead, true), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
});

test('every next / option / else / input / counts / skip / scratch / ask target exists, and every frame is reachable, by its exits and by some reader', () => {
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const byExit = new Set([story.start]), line = [story.start];
  while (line.length) ways(frames[line.pop()]).forEach(n => { if (!byExit.has(n)) { byExit.add(n); line.push(n); } });
  assert.deepEqual(ids.filter(id => !byExit.has(id)), [], 'unreachable frames');
  const walked = new Set();
  for (const c of COMBOS) for (const light of [0, 1]) walk(c.flags, { light }).forEach(id => walked.add(id));
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

test('every combination reaches the end with no frame that shows nothing; Tallyheart is under the bridge and round the back only on the told path; a told twin is its kept twin with Tallyheart in it', () => {
  const her = id => castOf(id, 'tallyheart').length > 0 || (frames[id].say || []).some(b => b.who === 'tallyheart');
  for (const c of COMBOS) for (const light of [0, 1]) {
    const name = comboName(c) + ' light ' + light, rows = walkLines(c.flags, { light });
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    rows.forEach(r => {
      if (r.kind !== 'end') assert.ok(r.lines.length > 0, r.id + ' shows no text to ' + name);
      if (r.options) assert.equal(r.options.length, 2, r.id + ': two options');
    });
    // under the Old Bridge and round the back of the pile she is in no panel of the kept path; on the
    // told path she is in every panel whose camera shows her spot (the bridge's `back`, the pile's `rear`)
    rows.map(r => r.id).filter(id => ['bridge', 'pile'].includes(frames[id].scene.set) && (frames[id].scene.set === 'bridge' || ['rear', 'hole'].includes(frames[id].scene.cam))).forEach(id => {
      if (!c.flags.ch3Told) assert.ok(!her(id), name + ': ' + id + ' has Tallyheart on the kept path');
      else if (['bridge/back', 'pile/rear'].includes(camOf(id))) assert.ok(castOf(id, 'tallyheart').length, name + ': ' + id + ' has no Tallyheart on the told path');
    });
    assert.equal(rows.flags, undefined);
  }
  // the told twin of a panel is its kept twin with Tallyheart in it (and her lines), and nothing else; but
  // at the bridge's first panel, where Sprinkle peeks over Tallyheart's branch on one path and sits up in
  // her nook on the other
  TWINS.forEach(([t, k]) => {
    const a = frames[t], b = frames[k];
    if (t === TWINS[0][0]) {
      assert.deepEqual([a.scene.opts.branch, b.scene.opts.branch, castOf(t, 'sprinkle')[0].pose, castOf(k, 'sprinkle')[0].pose], [true, undefined, 'peek', 'sit']);
      return;
    }
    assert.deepEqual([a.scene.set, a.scene.cam, a.scene.fx, a.scene.opts], [b.scene.set, b.scene.cam, b.scene.fx, b.scene.opts], t + ' and ' + k + ': one picture');
    assert.deepEqual(a.scene.cast.filter(m => m.who !== 'tallyheart').map(m => [m.who, m.at]), b.scene.cast.map(m => [m.who, m.at]), t + ' and ' + k + ': the same cast but for her');
    assert.ok(castOf(t, 'tallyheart').length === 1 && castOf(k, 'tallyheart').length === 0, t + ' and ' + k);
  });
});

test('choices: four a reading, labels short, none sets a flag; the sums one answer and one card on both paths, each for its own path; every light one rejoins at once', () => {
  const choiceIds = ids.filter(id => frames[id].choice);
  assert.deepEqual(choiceIds, [GRASS, SUM_TOLD, SUM_KEPT, FLEW].concat(TUNNEL));
  const L = id => frames[id].choice.options.map(o => o.label);
  const O = (id, i) => T(frames[id].choice.options[i].next);
  choiceIds.forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length === 2, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 12, id + ' option ' + i + ' label');
      assert.equal(o.when, undefined, id + ': both options are for everyone who sees the choice');
    });
    assert.equal(frames[id].choice.prompt, undefined, id);
  });
  assert.deepEqual(L(GRASS), ['“Very soft.”', '“Very WET.”']);
  assert.deepEqual([O(GRASS, 0), O(GRASS, 1)], ['I KNEW it.', 'Ew. Tell me no more.']);
  assert.deepEqual(L(SUM_TOLD), ['“So it WASN’T Sprinkle!”', '“So the thief is somebody SMALL!”']);
  assert.deepEqual(L(SUM_KEPT), ['“So it WASN’T you, Sprinkle!”', '“So the thief is somebody SMALL!”']);
  // one outcome panel each, with the story's one reply and her card (the told path's a caption, the kept
  // path's Riffle's whisper)
  assert.deepEqual([O(SUM_TOLD, 0), frames[frames[SUM_TOLD].choice.options[0].next].card], ['The Counts don’t lie.', 'my-count']);
  assert.deepEqual(frames[frames[SUM_TOLD].choice.options[0].next].caption, ['The Counts don’t lie.']);
  assert.deepEqual(frames[frames[SUM_KEPT].choice.options[0].next].say, [{ who: 'riffle', text: 'The Counts don’t lie.', kind: 'whisper' }]);
  assert.equal(frames[frames[SUM_KEPT].choice.options[0].next].card, 'my-count');
  assert.deepEqual(L(FLEW), ['“So Reynard LIED!”', '“The fox’s story isn’t TRUE!”']);
  assert.match(O(FLEW, 0), /^No moon, and no flying\./, 'no outcome panel: on to the next screen');
  TUNNEL.forEach(id => assert.deepEqual(L(id), ['Sniff the tunnel.', 'Listen at the tunnel.'], id));
  assert.deepEqual([O(TUNNEL[0], 0), O(TUNNEL[0], 1)], ['Earth. And, very faintly, mice.', 'Not a sound. Whoever dug it isn’t here.']);
  // a spoken option is never echoed as a balloon on its outcome (her pick is never lettered back to her)
  choiceIds.forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    if (said) (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
  // four on every path, each path's own sum; how much she reads before she chooses
  for (const c of COMBOS) {
    const p = walk(c.flags, {});
    assert.deepEqual(p.filter(id => frames[id].choice), [GRASS, c.flags.ch3Told ? SUM_TOLD : SUM_KEPT, FLEW, TUNNEL[c.flags.ch3Told ? 0 : 1]], comboName(c));
  }
  for (const c of SOME) walkLines(c.flags, {}).filter(r => r.options).forEach(r => {
    const n = r.lines.reduce((m, s) => m + words(s), 0) + r.options.reduce((m, s) => m + words(s), 0);
    assert.ok(n >= 10 && n <= 42, r.id + ': ' + n + ' words before she chooses, for ' + comboName(c));
  });
});

test('inputs, counts, skips, taps and Tallyheart’s six Counts, in the story’s order', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  assert.equal(T(inputs[0]), 'What did {name}paw dream, the night the Counts didn’t lie?');
  const ph = frames[inputs[0]].input.placeholder;
  assert.ok(typeof ph === 'string' && ph.length <= 30 && /tunnel|whiskers|sixty/.test(ph), ph);
  // six Counts moments: five on every path (the pile, the warm-up, the lesson, the twenty-four, a sixty)
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => frames[id].counts.set), SETS);
  counts.forEach(id => {
    const set = frames[id].counts.set;
    assert.deepEqual(Object.keys(frames[id].counts).sort(), NO_INTRO.includes(set) ? ['intro', 'next', 'set'] : ['next', 'set'], id);
    if (NO_INTRO.includes(set)) assert.equal(frames[id].counts.intro, false, id);
    assert.ok(E.countsSet(set, story, STORIES), id + ': the counts set exists');
  });
  assert.deepEqual(counts.slice(4).map(id => frames[id].when), [TOLD, KEPT], 'the sixty: the told path’s in the Hollow, the kept path’s under the Old Bridge');
  // four skip-counts: the gaps, her whiskers, the five cheeks, the bedtime faces (section 2, as the spec has them)
  const skips = ids.filter(id => frames[id].skip);
  assert.equal(skips.length, 4);
  const [gaps, cheek, five, bed] = skips.map(id => frames[id].skip);
  const RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  assert.deepEqual(gaps, { table: 1, groups: 4, thing: 'gap', things: 'gaps', teacher: 'player', label: 'Count the next empty space.', prompt: '**Tap** the empty spaces.', carry: false, next: gaps.next });
  assert.deepEqual(cheek, { table: 3, groups: 2, who: [{ who: 'tallyheart' }], thing: 'whisker', things: 'whiskers', teacher: 'player', label: 'Count the next row of whiskers.', prompt: '**Tap** her whiskers.', keep: true, next: cheek.next });
  assert.deepEqual(five, { table: 6, groups: 5, who: RIM, thing: 'whisker', things: 'whiskers', teacher: 'tallyheart', label: 'Count the next cheek.', prompt: '**Tap** the cheeks.', carry: false, next: five.next });
  assert.deepEqual(bed, { table: 6, groups: 4, who: [{ who: 'snorer' }, { who: 'snorer' }, { who: 'player' }, { who: 'player' }], thing: 'whisker', things: 'whiskers', teacher: 'player', label: 'Count the next cheek.', prompt: '**Tap** the cheeks.', next: bed.next });
  assert.deepEqual([1, 4].map(n => E.skipView(gaps, n).count), ['1…', '1… 2… 3… 4!']);
  assert.deepEqual([1, 2].map(n => E.skipView(cheek, n).count), ['3…', '3… 6!']);
  assert.deepEqual(E.skipView(five, 5).count, '6… 12… 18… 24… 30!');
  assert.deepEqual(E.skipView(bed, 4).count, '6… 12… 18… 24!');
  assert.deepEqual(E.skipPicture(gaps, 2), { table: 1, groups: 4, per: 1, highlight: 2, totals: true, next: true, who: undefined, thing: 'gap', things: 'gaps' });
  assert.deepEqual(E.skipPicture(cheek, 1), { table: 3, groups: 2, per: 3, highlight: 3, totals: true, next: true, who: [{ who: 'tallyheart' }], thing: 'whisker', things: 'whiskers' });
  assert.deepEqual(E.skipPicture(five, 2), { table: 6, groups: 5, per: 6, highlight: 12, totals: true, next: true, who: RIM, thing: 'whisker', things: 'whiskers' });
  assert.deepEqual(E.skipPicture(bed, 4).highlight, 24);
  // what each page after a count shows: “Four gone.” says the number itself; the cheek stays up under a big
  // 6 (`keep`), and the skip after it ends the kept run; the five cheeks turn to the ask, which carries
  // nothing; the bedtime faces leave a big 24 over the dark
  assert.equal(E.skipInto(story, gaps.next), null);
  assert.match(T(gaps.next), /^Four gone\.$/);
  assert.equal(E.skipReached(E.skipInto(story, cheek.next)), 6);
  assert.deepEqual(E.keptSkip(story, cheek.next), { id: skips[1], skip: cheek }, 'the cheek stays up while she hears “Six is two threes.”');
  assert.equal(E.keptSkip(story, five.next), null);
  assert.equal(E.skipInto(story, five.next), null);
  assert.ok(frames[five.next].ask, 'the five cheeks turn to her six Counts');
  assert.equal(E.skipReached(E.skipInto(story, bed.next)), 24);
  assert.match(T(bed.next), /^TWENTY-FOUR\?/);
  // the pages she taps once (the spec's one-tap table), the twins by path each with the same Tap
  const taps = ids.filter(id => frames[id].scratch);
  const tapOf = id => Object.assign({}, frames[id].scratch, { next: undefined });
  const ONE = {
    ears: { tap: 'ears', prompt: '**Tap** to look up.', label: 'Look up.' },
    paw: { tap: 'paw', prompt: '**Tap** to wave goodbye.', label: 'Wave goodbye.' },
    walk: { tap: 'back', prompt: '**Tap** to walk round the back.', label: 'Walk round the back.' },
    fish: { tap: 'fish', prompt: '**Tap** to toss her one.', label: 'Toss her a fish.' },
    print: { tap: 'print', prompt: '**Tap** a print to hold your paw over it.', label: 'Hold your paw over a print.' },
    mist: { tap: 'mist', prompt: '**Tap** the little cloud of mist.', label: 'Puff the mist away.' },
    slip: { tap: 'back', prompt: '**Tap** to slip round the back.', label: 'Slip round the back.' },
    roots: { tap: 'roots', prompt: '**Tap** the bramble roots.', label: 'Lift the roots.' }
  };
  assert.deepEqual(taps.map(id => tapOf(id)), ['ears', 'paw', 'walk', 'fish', 'fish', 'print', 'mist', 'slip', 'slip', 'roots', 'roots'].map(k => Object.assign({}, ONE[k], { next: undefined })));
  taps.forEach(id => assert.deepEqual(E.tapWords(frames[id]), { kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label }, id + ': no miss line: the glow wobbles'));
  // (the story's response to each is shown by the next panel)
  const after = id => E.landing({ flags: Object.assign({}, frames[id].when) }, story, frames[id].scratch.next);
  assert.equal(camOf(after(taps[0])), 'tower/up', 'she looks up the tower');
  assert.equal(camOf(after(taps[2])), 'pile/gap', 'round the back row, out of the shadow');
  assert.deepEqual(castOf(after(taps[3]), 'sprinkle').map(c => c.pose), ['gulp'], 'Sprinkle gulping (told)');
  assert.deepEqual(castOf(after(taps[4]), 'sprinkle').map(c => c.pose), ['gulp'], 'Sprinkle gulping (kept)');
  assert.deepEqual(castOf(after(taps[5]), 'player').map(c => [c.at, c.reach]), [['over', true]], 'her paw over the print');
  assert.ok(!castOf(after(taps[6]), 'sprinkle').some(c => c.mist), 'the mist is gone');
  [taps[7], taps[8]].forEach(id => assert.equal(camOf(after(id)), 'pile/rear', 'round the back, the roots down'));
  [taps[9], taps[10]].forEach(id => assert.equal(camOf(after(id)), 'pile/hole', 'the mouth'));
  // Tallyheart's six Counts: a Tap that counts nothing; the sixes our cat already knows, hers to say
  const asks = ids.filter(id => frames[id].ask);
  assert.equal(asks.length, 1);
  assert.deepEqual(frames[asks[0]].ask, { who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
    pairs: [['Tails?', 'Six cats, six tails!'], ['Ears?', 'Six cats, twelve ears!'], ['Claws?', 'Six forepaws, thirty claws!'], ['Both forepaws?', 'Six cats, sixty claws!'],
      ['Nine lives?', 'Six cats, fifty-four lives!'], ['Patrols?', 'Six patrols, eighteen guards!']], next: counts[2] });
  // the order of the things she does, on the page
  const order = [taps[0], GRASS, taps[1], counts[0], taps[2], skips[0], counts[1], skips[1], skips[2], asks[0], counts[2], counts[3], counts[4], SUM_TOLD, taps[3], taps[4], counts[5], SUM_KEPT,
    taps[5], FLEW, taps[6], taps[7], taps[8], taps[9], taps[10], TUNNEL[0], TUNNEL[1], skips[3], inputs[0]];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: nine Taps that count or ask (the two twins of each counted once) and five Counts moments
  for (const c of COMBOS) {
    const p = walk(c.flags, {}), name = comboName(c);
    assert.equal(p.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask).length, 13, name + ': Taps');
    assert.equal(p.filter(id => frames[id].counts).length, 5, name + ': Counts moments');
    assert.deepEqual([E.kindOf(frames[p[0]]), E.kindOf(frames[p[1]])], ['next', 'scratch'], name);
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
  for (let guard = 0; guard < 600; guard++) {
    const id = E.frameId(cat, st), f = st.frames[id], kind = E.kindOf(f);
    const row = { id, kind, f, caps: E.captions(f, cat).map(c => E.fill(c, cat)), say: saidOn(st, id, cat),
      cards: E.cardsOn(f, cat, st, STORIES), file: E.cards(cat, STORIES).map(c => c.id), counts: cat.counts.length, sfx: f.sfx || '',
      scene: f.scene ? E.resolveScene(f.scene, cat, STORIES) : null, links: E.caseFile(cat, STORIES).links };
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
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'a tunnel full of whiskers' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      row.lesson = lessonRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat at chapter 7's first page: chapters 1 to 6 finished, her chapter 1 to 6 flags, the Counts she
 * learned there (chapter 4's tens, chapter 5's nines and chapter 6's threes played through the engine,
 * with these answers and times in the threes: what today's warm-up finds hard), and her Case File as
 * chapters 4 to 6 left it (chapter 4's moon and FLEW, chapter 5's Patience, chapter 6's Coil among it). */
const CH5_CARDS = ['prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh'];
const CH6_CARDS = ['reed-pile', 'coil-diggers'];
function before7(flags, threes, threesMs) {
  const cat = E.blankCat({ now: 1, id: 'c7' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5, ch06: 6 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch2SaidAloud: true, ch3Told: true, caseFileOpen: true, ch5First: 'otters' }, flags || {});
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  play(cat, 'ch04-tens');
  play(cat, 'ch05-nines');
  play(cat, 'ch06-threes', threes, threesMs);
  Object.keys(ch04.cards).filter(cid => !ch04.cards[cid].when || E.matches(ch04.cards[cid].when, cat)).forEach((cid, i) => E.giveCard(cat, cid, 'ch04', 10 + i));
  CH5_CARDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch05', 30 + i));
  CH6_CARDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch06', 50 + i));
  return cat;
}
function fresh(flags, threes, threesMs) {
  const cat = before7(flags, threes, threesMs);
  E.startChapter(cat, story, 500);
  return cat;
}
/* Read chapter 7: `o` is a route (`light`: as `pick`), with `stop`, `answers`, `ms`, `dream` and `t` as
 * readStory takes them. */
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
const PILE_COUNT = countsAt('ch07-pile')[0];
const STEP = F(/^Through the gap in the hedge, to your old step\./);
const TREE = F(/^Tallyheart stretches up the leaning tree\./);
const SEVENTH = F(/^Whiskers\. That’s your seventh Count\./);
const BOUND = F(/^The cats on the rim bound off to breakfast\./);
const QUIETLY = F(/^Quietly\./);
const SORRY = F(/^“Sorry, Coil,” everybody whispers\.$/);
const SUNSET = F(/^At sunset, the Clan sits round the pile again\./);
const MOONRISE = F2(/The moon comes out, fatter again\./);
const MOUTH = F(/^Under the roots, in the dug earth, is a round, dark hole\./);
const NEST = F(/^In your nest:/);
const ARRIVE = TWINS[0];

/* ------------------------------------------------------------------ speakers, tokens, words */

test('every balloon speaker is in that frame’s cast; where two of a kind are in the picture, the first of them speaks; balloons and captions are well formed', () => {
  ids.forEach(id => {
    const f = frames[id];
    const by = {};
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(b.who === 'coil' && b.name === 'Coil', id + ' say ' + i + ': only Coil’s balloons carry a name, his own');
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      assert.ok(castOf(id, b.who).length, id + ': ' + b.who + ' speaks and is not in the picture');
      by[b.who] = (by[b.who] || 0) + 1;
    });
    Object.keys(by).forEach(who => { if (castOf(id, who).length > 1) assert.fail(id + ': ' + by[who] + ' balloons from ' + who + ', and ' + castOf(id, who).length + ' of them in the picture'); });
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
  // a Tap's own counting balloon has somebody in the picture to belong to: the gaps, her whiskers and the
  // bedtime faces are our cat's count, the five cheeks Tallyheart's
  ids.filter(id => frames[id].skip).forEach(id => {
    const f = frames[id], who = E.skipWords(E.skipFor(f.skip, { flags: {} }), ((f.say || [])[0] || {}).who).teacher;
    assert.ok(castOf(id, who).length, id + ': ' + who + ' keeps the count, and is in the picture');
  });
  assert.deepEqual(ids.filter(id => frames[id].skip).map(id => E.skipWords(frames[id].skip, ((frames[id].say || [])[0] || {}).who).teacher), ['player', 'player', 'tallyheart', 'player']);
});

test('speakers: Coil is “Coil”, a stone in his wall keeping his face to itself; Waffles, the grey tom and the rest by their own labels; what each Counts frame says again over its first question', () => {
  const cat = E.blankCat({}); cat.name = 'Fern';
  const label = (b, id) => labelFor(Object.assign({}, b, { variant: id && (castOf(id, b.who)[0] || {}).variant }), cat);
  // Coil: from the stones (“Quietly,”) and his last line, both “Coil”; the first while his head is a stone
  const coilSays = ids.filter(id => (frames[id].say || []).some(b => b.who === 'coil'));
  assert.deepEqual(coilSays, [QUIETLY, F(/^She can’t fly\. I could have told you\./)]);
  coilSays.forEach(id => frames[id].say.filter(b => b.who === 'coil').forEach(b => assert.equal(label(b, id), 'Coil', id)));
  assert.deepEqual(castOf(QUIETLY, 'coil').map(c => c.pose), ['stone'], '“says a voice in the stones”');
  assert.equal(Sp.faceHidden(frames[QUIETLY].say[0], castOf(QUIETLY, 'coil')[0]), true, 'no face in the stacked balloons');
  assert.equal(Sp.faceHidden(frames[coilSays[1]].say[0], castOf(coilSays[1], 'coil')[0]), false, 'his head out of the gap for his last line');
  // the others, by the labels the page gives them
  const who = {};
  ids.forEach(id => (frames[id].say || []).forEach(b => { who[b.who] = who[b.who] || new Set(); who[b.who].add(label(b, id)); }));
  assert.deepEqual(Object.fromEntries(Object.entries(who).map(([k, v]) => [k, [...v]])), {
    player: ['Fernpaw'], waffles: ['Princess Waffles'], tallyheart: ['Tallyheart'], murmurchime: ['{Murmur}chime'.replace('{Murmur}', 'Murmur')], grizzled: ['Grizzled old tom'],
    glintstar: ['Glintstar'], sprinkle: ['Sprinkle'], riffle: ['Riffle'], coil: ['Coil'], snorer: ['Snoring apprentice']
  });
  // nobody else carries a name: everyone is known already
  ids.forEach(id => (frames[id].say || []).filter(b => b.who !== 'coil').forEach(b => assert.equal(b.name, undefined, id + ' ' + b.who)));
  // what each Counts frame says again over its first question: the pile, the warm-up and the lesson none
  // (`intro: false`: the pile's caption and 2 × 6's own line each carry their question, and the warm-up's
  // first is timed on itself); the twenty-four has no balloon; each sixty's one balloon is said again
  const again = ids.filter(id => frames[id].counts).map(id => [frames[id].counts.set, E.balloons(frames[id], cat).length, Sp.lessonIntro(E.balloons(frames[id], cat), frames[id].counts.intro === false).length]);
  assert.deepEqual(again, [['ch07-pile', 1, 0], ['ch07-threes', 1, 0], ['ch07-sixes', 1, 0], ['ch07-gone', 0, 0], ['ch07-dragon', 1, 1], ['ch07-riffle', 1, 1]]);
  // the kept sixty's lines are Riffle's (his set's teacher): the question and the right lines in his voice
  assert.equal(label({ who: E.teacherOf(story.counts['ch07-riffle']) }), 'Riffle');
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
  // the warm moment's {their}: a she-cat reads module-1's line word for word, a tom hears “his”
  const warm = F(/can’t be fooled\.$/);
  assert.match(fill(T(warm), PROFILES['she-cat']), / A warrior who knows her Counts can’t be fooled\.$/);
  assert.match(fill(T(warm), PROFILES.tom), / A warrior who knows his Counts can’t be fooled\.$/);
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
      const cat = { flags, lessons: flags.lessonClean ? { 'ch07-sixes': { finished: true, noHelp: true } } : {} };
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

test('word counts: about 15 to 18 words of lettering a frame, few over 30 for any reader and never more than 50; the readings under the brief’s 120 frames; never more than seven panels in a row with nothing to do', (t) => {
  const over = [];
  ids.forEach(id => {
    const m = maxWords(frames[id]);
    assert.ok(m <= WORDS_MAX, id + ' has ' + m + ' words for its wordiest reader');
    if (m > WORDS_AIM) over.push(id + ' (' + m + ')');
  });
  // the frames over 30 for their wordiest reader: the job for the sixes, the two witnesses, “Tell them”, the
  // prints, a good count, the roots for a sneaking told cat, the kept cat's call she does not make
  t.diagnostic('over 30 words for the wordiest reader: ' + over.join(', '));
  assert.ok(over.length <= 8, over.join(', '));
  const stats = {};
  let longest = 0, longestFrom = null;
  for (const c of COMBOS) for (const light of [0, 1]) for (const clean of (COMBOS.indexOf(c) % 4 ? [true] : [true, false])) {
    const rows = walkLines(c.flags, { light, clean });
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(s), 0));
    const w = per.reduce((a, b) => a + b, 0);
    per.forEach((n, i) => assert.ok(n <= 41, rows[i].id + ': ' + n + ' words for ' + comboName(c)));
    const k = c.flags.ch3Told ? 'told' : 'kept';
    (stats[k] = stats[k] || []).push({ n: rows.length, w });
    assert.ok(w / rows.length >= 15 && w / rows.length <= 18, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
    let run = 0, worst = 0, from = null, first = null;
    rows.forEach(r => {
      if (r.kind !== 'next') { run = 0; return; }
      if (!run) from = r.id;
      if (++run > worst) { worst = run; first = from; }
    });
    assert.ok(worst <= 7, comboName(c) + ': ' + worst + ' panels in a row with nothing to do, from ' + first);
    if (worst > longest) { longest = worst; longestFrom = first; }
  }
  // the brief's budget: at most 120 frames a reading; the spec's estimate about 80 told and 85 kept
  const range = k => [Math.min(...stats[k].map(x => x.n)), Math.max(...stats[k].map(x => x.n))];
  assert.deepEqual([range('told'), range('kept')], [[81, 82], [84, 85]], 'one more panel for a climber');
  Object.keys(stats).sort().forEach(k => {
    const s = stats[k], mm = f => Math.min(...s.map(f)) + '–' + Math.max(...s.map(f));
    t.diagnostic(k + ': ' + mm(x => x.n) + ' frames, ' + mm(x => x.w) + ' words of lettering, ' + (s.reduce((a, x) => a + x.w / x.n, 0) / s.length).toFixed(1) + ' a frame');
  });
  t.diagnostic('the longest run of panels with nothing to do: ' + longest + ', from ' + longestFrom + ' (Waffles, the spec’s two panels for her witness and her dish)');
});

test('a caption the page can letter on the panel is 95 characters at most (a long line in boxes, cut at sentence breaks); only the end page’s and one sentence that cannot be cut run on', () => {
  const long = ids.filter(id => (frames[id].caption || []).some(c => capText(c).length > 95));
  // f061's middle sentence is 96 characters and one sentence: it cannot be cut without changing the words,
  // so that page's boxes go in the column beside the panel (chapter 5's fox in the mud, the same rule)
  const prints = F(/^When she lets go, you look down\./);
  assert.deepEqual(long, [prints, ids[ids.length - 1]]);
  assert.deepEqual(frames[prints].caption.map(c => capText(c).length > 95), [false, true, false]);
  assert.ok(!/\. \p{Lu}/u.test(frames[prints].caption[1]), 'one sentence');
  // the story's long lines, each in boxes cut at a sentence break, in the order she reads them
  const two = re => frames[F(re)].caption.map(capText);
  assert.deepEqual(frames[ARRIVE[0]].caption, ['Tallyheart takes you straight to the Old Bridge.', 'Two big eyes peek over Tallyheart’s branch, and Riffle is there with fish.']);
  assert.deepEqual(two(/^You climb the bramble arch for a look\./), ['You climb the bramble arch for a look.', 'Far off, past the towers, the train tracks shine in the last light.', 'The tiny prints ran that way.']);
  assert.deepEqual(two(/^You don’t follow it\./), ['You don’t follow it. Not tonight. Not without Riffle.', 'You nearly call Tallyheart. But she’d ask what ELSE you know.', 'And then it would all come out: Coil. The bridge. Sprinkle.']);
  assert.deepEqual(two(/^The guards are still settling in,/).slice(0, 2), ['The guards are still settling in, round the front, close enough to call.', 'Nobody is looking at you.']);
  assert.deepEqual(two(/^Seven claw marks on the tree\./), ['Seven claw marks on the tree. Two witnesses: no moon.', 'One fox who LIED. And under the pile, a tunnel.']);
  F2(/Behind the back row is the dug earth\./).forEach(id => {
    const caps = frames[id].caption.filter(c => c.when && (same(c.when, NOTICING) || same(c.when, NOT_NOTICING)));
    assert.deepEqual(caps.map(c => [c.when, c.text]), [[NOTICING, 'Behind the back row is the dug earth. You’ve seen it every morning.'], [NOTICING, 'Tonight, you look closer. It goes in UNDER the roots.'],
      [NOT_NOTICING, 'Always the back. Why? Then you remember Coil, in the stones:'], [NOT_NOTICING, '“Small diggers come and go. Under your Clan’s pile.” UNDER!']], id);
  });
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
    // a board is for an illustrator: it never names the diggers, nothing shows teeth, fangs or a tongue,
    // and nothing is in the tunnel or comes out of it
    assert.doesNotMatch(b, /weasel|stoat|teeth|fang|snarl|tongue|strik|squeez|coil(s|ed) round|\bin the tunnel\b|out of the tunnel/i, id);
    assert.doesNotMatch(b, /\bSTUB\b/, id);
  });
  // a frame shown only on a path says so in its shot line; a Tap page says what the tap does in play
  ids.filter(id => frames[id].when).forEach(id => assert.match(frames[id].board.split('. ')[0], /\b(ONLY|BUT|NOT FOR)\b/, id + ': the shot line says who sees it'));
  ids.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].card).forEach(id => assert.match(frames[id].board, new RegExp('the new card appears under the panel, an ' + story.cards[frames[id].card].mark + ' in its corner'), id + ': the board says the card appears, with its mark'));
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
  assert.equal(fill(T(ids.find(id => frames[id].input)), PROFILES.tom), 'What did Stormpaw dream, the night the Counts didn’t lie?');
  const tomBook = fill(story.book.recap.map(r => r.text).join(' '), PROFILES.tom);
  assert.match(tomBook, /Tallyheart taught Stormpaw his seventh Count, whiskers: the sixes\./);
  assert.match(fill(T(F(/^\{Murmur\}chime|FOUR\? But we had EIGHTEEN guards!/)), PROFILES.murmur), /FOUR\? But we had EIGHTEEN guards!/);
  assert.match(fill(T(F(/^\{petname\}! DARLING!$/)), PROFILES['she-cat']), /^Snickerdoodle! DARLING!$/);
});

test('our own world and the tone: no Warriors or Wings of Fire words; nobody names the thief or says weasel or glass; Coil is funny-creepy and never frightening; the fox is named, never seen; nobody is hurt; nobody goes in the tunnel; the warrior thread is one warm line, no promise', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|apprentices’ den|assessment|from this day|claw-moon|quarter-moon|half-moon|whisker-lengths?|fox-lengths?|tail-lengths?|monsters? of the sky|leader’s? nine lives|gift of|silverpelt|bogwade|damplark|boglark|cattail)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|warriors’ den|claw-moon|silverpelt|whisker-lengths?)\b/i, id + ' board'));
  // nobody names the diggers or says weasel, glass or what the “scale” is; chapter 8's names wait
  everyText((id, x) => assert.doesNotMatch(x.text, /weasel|stoat|ferret|polecat|glass|\bscale\b|\bmole|\bSnip\b|\bSnatch\b|\bHail\b|\bDew\b/i, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /weasel|stoat|ferret|\bmole|\bSnip\b|\bSnatch\b/i, id + ' board'));
  // “Whiskers” is the Count's name and a picture word, never a cat's name (a minor Warriors pet cat's)
  ids.forEach(id => (frames[id].say || []).forEach(b => assert.notEqual(b.name, 'Whiskers', id)));
  everyText((id, x) => assert.doesNotMatch(x.text, /\bWhiskers (says|said|is|was)\b/, id + ' ' + x.where));
  // the thief: what the count shows (somebody small) and what the tunnel shows (comes up from under); never
  // a who, and the player never says somebody stole it or did it
  assert.deepEqual(FF(/\bthie(f|ves)\b/i).map(id => texts(frames[id]).filter(x => /thie(f|ves)/i.test(x.text)).map(x => (x.who || 'caption') + ': ' + x.text)).flat(), [
    'tallyheart: If she were our thief, that’s ten every night.',
    'riffle: If SHE were the thief, she’d take ten every night.',
    'player: The thief’s prints in the marsh are TINY. Half the size of my paw.',
    'player: So THAT’S why it’s always the back. The guards watch the pile. The thief comes up from UNDER it.',
    'player: So THAT’S why it’s always the back. The guards watch the pile. The thief comes up from UNDER it.',
    'tallyheart: Not a word to the Clan yet. A hole isn’t a thief. Not yet.']);
  everyText((id, x) => assert.doesNotMatch(x.text, /stole the prey|the thie(f|ves) (are|was|were)\b|the thief is (?!somebody SMALL!)|we know who|solved|it was the/i, id + ' ' + x.where));
  assert.deepEqual(choiceAt(/the thief is/).map(id => [id, frames[id].choice.options[1].label]), [[SUM_TOLD, '“So the thief is somebody SMALL!”'], [SUM_KEPT, '“So the thief is somebody SMALL!”']], 'what the count shows: somebody small');
  // Coil: never strikes, squeezes, bites or shows fangs; nobody says venom; his eyes never close; Riffle never
  // juggles under the bridge and never hugs his tail where Coil is
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(strikes?|bites?|bitten|fangs?|venom\w*|poison\w*|hiss\w*|tongue)\b/i, id + ' ' + x.where));
  const coil = ids.filter(id => castOf(id, 'coil').length);
  coil.forEach(id => castOf(id, 'coil').forEach(c => {
    assert.ok(A.vocab.otherPoses.coil.includes(c.pose), id + ': ' + c.pose);
    assert.deepEqual([c.at, c.facing, c.size, c.squeeze], ['gap', 'right', undefined, undefined], id + ': at his gap, facing the cats, drawn as he is');
    assert.equal(frames[id].scene.cam, 'wall', id + ': in his wall');
  }));
  ids.filter(id => frames[id].scene.set === 'bridge').forEach(id => assert.ok(!castOf(id, 'riffle').some(c => c.pose === 'juggle' || c.pose === 'hug'), id + ': no juggling under the Old Bridge, and no tail-hug where Coil is'));
  // the fox is never seen: no fox in any cast, no balloon of his
  ids.forEach(id => assert.ok(!frames[id].scene.cast.some(c => c.who === 'reynard'), id + ': the fox is in the picture'));
  // nobody dies, nobody is hurt, nobody is chased (Sprinkle's hurt wing is the storm's, from chapter 3); the
  // only scary word is Waffles' about the little room
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(wound(ed)?|blood|bleed|bleeds|broken|die[sd]?|dead|death|kill(ed|s)?|bones?|drown\w*|chas(e|es|ed|ing)|snarls?|growls?|attacks?|pounces on|hurts?(?! wing))\b/i, id + ' ' + x.where));
  assert.deepEqual(FF(/\bhurt\b/), [F(/^She lifts her wings\./)]);
  assert.deepEqual(FF(/terrif|horribl|scream|nightmare|monster/i), [GRASS]);
  assert.equal(frames[GRASS].say[0].who, 'waffles');
  // nobody goes in the tunnel: nobody at its mouth but our cat at its edge; nothing is drawn in it
  ids.filter(id => camOf(id) === 'pile/hole').forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => [c.who, c.at, c.pose]), [['player', 'brink', 'crouch']], id));
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(go|goes|went|crawl\w*|creep\w*) (in|into|down) (the|that) tunnel\b/i, id + ' ' + x.where));
  // the warrior thread: one warm line, on every path, and no promise
  assert.equal(FF(/A warrior who knows \{their\} Counts can’t be fooled\./).length, 1);
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(\w+) to go\b|One day|when you(’re| are) a warrior|your Warrior Counts|you’ll be a warrior/i, id + ' ' + x.where));
  // the hook is curious, never scary: somewhere, that tunnel comes out
  assert.match(T(F(/^Soon he’s snoring\./)), /Somewhere, that tunnel comes out\. Where\?$/);
  ['night', 'sleep'].forEach(w => assert.match(T(F(/You curl up tight, warm and safe, and sleep\.$/)), new RegExp(w)));
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the story’s own: every caption, balloon, sound effect, option and card line is in docs/chapters/07-the-counts-dont-lie.md, and every line its screens speak is in the chapter', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/chapters/07-the-counts-dont-lie.md'), 'utf8');
  const from = doc.indexOf('## The wind chime'), to = doc.indexOf('\n*For us*');
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
    if (f.choice) f.choice.options.forEach(o => { if (!page.includes(o.label.replace(/^“|”$/g, ''))) mine.push(id + ' option: ' + o.label); });
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '')), id + ': ' + f.scratch.prompt);
    if (f.skip && f.skip.prompt) assert.ok(page.includes(f.skip.prompt.replace(/\*\*/g, '')), id + ': ' + f.skip.prompt);
    if (f.ask) { assert.ok(page.includes(f.ask.prompt.replace(/\*\*/g, ''))); f.ask.pairs.forEach(p => assert.ok(spoken.includes(loose(p[0])) && page.includes('“' + p[1] + '”'), id + ': ' + p.join(' / '))); }
  });
  Object.keys(story.cards).forEach(cid => {
    assert.ok(page.includes('“' + story.cards[cid].line + '”'), cid + ': ' + story.cards[cid].line);
    if (story.cards[cid].link) assert.ok(flat(doc).includes('“' + story.cards[cid].link.line + '”'), cid + ': its link line is the story’s: ' + story.cards[cid].link.line);
  });
  // what is the builder's and not the story's: the closing frame in her nest
  const end = ids[ids.length - 1];
  assert.deepEqual(mine, [end + ': ' + frames[end].caption[0], end + ': End of Chapter Seven.']);
  // chapters 2 to 6's closing form
  assert.match(frames[end].caption[0], /^You sleep warm in your nest, with seven claw marks on the tree and the Sky River shining over the rosebush\.$/);
  assert.ok(frames[end].scene.fx.includes('skyriver'), 'and it is drawn');
  // and the other way: every line a screen of the story speaks is lettered somewhere in the chapter (a frame,
  // an option, a Counts set's lines, Tallyheart's six Counts, her cards)
  const lettered = [];
  everyText((id, x) => lettered.push(String(x.text).replace(/\*\*/g, '')));
  // and the questions the engine words for a fact with none of its own (4 × 3's are the story's own words)
  Object.keys(story.counts).forEach(sid => {
    const def = Object.assign({ id: sid }, story.counts[sid]), st = E.counts.start(def, { set: sid });
    for (let q; (q = E.counts.question(st));) { const D = E.questionDef(def, q, story, STORIES); E.promptLines(def, D, q).forEach(l => lettered.push(l.text)); E.counts.answer(st, D, q.answer, 2000, 1); }
  });
  ids.forEach(id => (frames[id].choice ? frames[id].choice.options : []).forEach(o => lettered.push(o.label.replace(/^“|”$/g, ''))));
  const all = loose(lettered.join(' '));
  const missing = [];
  screens.replace(/\*\*([^*]+)\*\*/g, ' ').replace(/\*[^*]*\*/g, ' ').split(/\n\s*\n/).forEach(p => {
    (p.replace(/\s+/g, ' ').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => { if (!all.includes(loose(q))) missing.push(q); });
  });
  assert.deepEqual(missing, []);
  // the story's plain lines the build letters as the engine's questions, word for word
  ['Three front rows of ten. How many pieces?', 'Four gone a night, for six nights. How many gone?', 'Ten a night, for six nights. How many would a dragon take?', 'Six nights. How many would she take?']
    .forEach(q => { assert.ok(page.includes(q), q); assert.ok(countsLines().some(x => x.text === q), q); });
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab): the pile’s round the back and its mouth, the bridge’s print, the comparisons, the taps chapter 7 adds', () => {
  const v = A.vocab;
  assert.ok(v && v.sets.pile.cams.includes('rear') && v.sets.pile.cams.includes('hole') && v.sets.bridge.cams.includes('print') && v.extras.tap.includes('fish') && v.extras.tap.includes('mist'), 'the art exposes chapter 7’s vocabulary');
  // the older cat extras the chapter may use, each with its value
  const OLD = { flatEars: [true], claws: [true], puffed: [true], wink: [true], mist: [true], holdAt: ['paws'] };
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
    // a set's `tap` mark is this page's Tap, and only on it
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
      if (c.holds === 'pinecone') assert.ok(c.who === 'grizzled' && c.holdAt === 'paws', where + ': the old tom’s pinecone, at his paws');
      if (c.holds === 'string') assert.ok(c.who === 'riffle' && c.pose === 'stand', where + ': Riffle’s string of fish');
      if (c.holdAt !== undefined) assert.ok(c.holds, where + ': holdAt goes with holds');
      if (c.holds !== undefined) assert.ok(['pinecone', 'string'].includes(c.holds), where + ': ' + c.holds);
      if (c.tap !== undefined) {
        assert.ok(frames[id].scratch && frames[id].scratch.tap === c.tap, where + ': the tap mark is this page’s Tap');
        const WHO = { paw: ['player'], ears: ['player'], fish: ['riffle'], mist: ['sprinkle'] };
        assert.ok(WHO[c.tap].includes(c.who), where + ': ' + c.tap);
        if (c.tap === 'paw') assert.equal(c.pose, 'pawup', where);
        if (c.tap === 'fish') assert.equal(c.holds, 'string', where);
        if (c.tap === 'mist') assert.deepEqual([c.pose, c.mist], ['burp', true], where);
      }
      if (c.mist) assert.ok(c.who === 'sprinkle' && c.pose === 'burp', where + ': her burp');
      if (c.glow) assert.ok(c.who === 'tallyheart' && frames[id].ask, where + ': the one to tap is Tallyheart, on the page of her six Counts');
      if (c.puffed) assert.equal(c.who, 'waffles', where + ': “She fluffs herself up.”');
      if (c.wink) assert.equal(c.who, 'tallyheart', where);
      // claws out on a raised paw; or, as she scratches the sand (“In the sand she scratches…”), on Tallyheart's
      // forepaw at the sand, crouched (the `sand` camera is too close for a raised paw: final review)
      if (c.claws) assert.ok(isCat && (c.pose === 'pawup' || (c.pose === 'crouch' && c.who === 'tallyheart' && /^In the sand she scratches/.test(T(id)))), where + ': claws out on a raised paw, or scratching the sand');
      if (c.asleep !== undefined) assert.ok(c.who === 'player' && c.pose === 'curl' && c.asleep === 'half' && /You curl up tight, warm and safe, and sleep\.$/.test(T(id)), where + ': half asleep as she curls up to sleep');
      if (c.reach) assert.ok(c.who === 'player' && c.pose === 'crouch' && c.at === 'over', where + ': her paw held over the print');
      if (c.flatEars) assert.ok(c.who === 'player' && c.mood === 'shy', where + ': her ears go hot');
      const poses = isCat ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      if (typeof c.at === 'object') {
        assert.ok(Object.keys(c.at).every(k => ['x', 'y', 'h', 'z'].includes(k)) && 'x' in c.at && 'y' in c.at, where + ': a spot is { x, y } (with h, as the art gives them)');
        // a spot of its own: nose to nose on the sand; in front of the rows on `low`; across the nook; in the
        // loop of Sprinkle's tail; the three-shot under the arch
        const ok = (s.set === 'hollow' && s.cam === 'lesson' && c.who === 'player' && same(c.at, CLOSE)) ||
          (s.set === 'pile' && s.cam === 'low' && c.who === 'player' && same(c.at, FRONT)) ||
          (s.set === 'bridge' && s.cam === 'back' && c.who === 'tallyheart' && same(c.at, ACROSS)) ||
          (s.set === 'bridge' && s.cam === 'back' && c.who === 'tallyheart' && same(c.at, BY_WALL) && castOf(id, 'sprinkle').some(d => d.pose === 'wings')) ||
          (s.set === 'bridge' && s.cam === 'back' && c.who === 'player' && same(c.at, TAIL)) ||
          (s.set === 'bridge' && s.cam === 'under' && c.who === 'riffle' && same(c.at, RIFFLE));
        assert.ok(ok, where + ': a spot of its own');
      } else assert.ok(set.anchors.includes(c.at), where + ': set ' + s.set + ' has no anchor ' + c.at);
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      // a size: Tallyheart past the tree, as chapters 5 and 6 have her; our cat in Sprinkle's tail, at chapter 3's
      // size for that hug; and our cat stretched tall for “You feel taller.” (a cartoon stretch, that panel only)
      if (c.size !== undefined) assert.ok((c.who === 'tallyheart' && c.size === 1.2 && s.set === 'hollow' && c.at === 'tree-far') ||
        (c.who === 'player' && c.size === 0.9 && s.set === 'bridge' && same(c.at, TAIL)) ||
        (c.who === 'player' && c.size === 1.12 && s.set === 'hollow' && c.at === 'sand-right' && /^You feel taller\./.test(T(id))), where + ': size ' + c.size);
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
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'claws', 'flatEars', 'glow', 'holdAt', 'holds', 'mist', 'puffed', 'reach', 'tap', 'wink']);
  // the skip-counts' and the lessons' pictures name only cast members
  ids.filter(id => frames[id].skip && frames[id].skip.who).forEach(id => frames[id].skip.who.forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
  Object.values(story.counts).forEach(d => [].concat(d.who || []).concat(...d.facts.map(f => f.who || [])).forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
  // every card has its drawing, and its mark is one the art knows
  Object.keys(story.cards).forEach(cid => { assert.ok(A.cardPictures[cid], 'a drawing for ' + cid); assert.ok(A.cardMarks.includes(story.cards[cid].mark), cid); });
});

/* ------------------------------------------------------------------ staging */

test('staging, her old step and the tower: the den before dawn; the step with her dish; the chime on every tower panel, Waffles at her railing, our cat at the tower’s foot whenever she speaks there; Waffles fluffed up; both waving', () => {
  assert.deepEqual([camOf(story.start), frames[story.start].scene.fx, castOf(story.start, 'player').map(c => [c.pose, c.mood, c.at])], ['den/nest', ['night'], [['sit', 'wonder', 'nest']]]);
  assert.deepEqual([camOf(STEP), frames[STEP].scene.opts, castOf(STEP, 'player').map(c => [c.pose, c.mood, c.at, c.tap])], ['garden/step', { dish: true }, [['sit', 'wonder', 'step', 'ears']]]);
  const tower = ids.filter(id => frames[id].scene.set === 'tower');
  assert.deepEqual(tower, ids.slice(at(STEP) + 1, at(PILE_COUNT)));
  tower.forEach(id => {
    assert.deepEqual(frames[id].scene.opts, { chime: true }, id + ': the wind chime');
    assert.deepEqual(frames[id].scene.fx, ['morning'], id);
    assert.deepEqual(castOf(id, 'waffles').map(c => c.at), ['railing'], id + ': Waffles at her railing');
    // a panel where both speak is `up`: our cat at the foot, looking up (waving, for the goodbye)
    if ((frames[id].say || []).some(b => b.who === 'player')) assert.deepEqual([frames[id].scene.cam, castOf(id, 'player').map(c => c.at)], ['up', ['foot']], id);
    if (frames[id].scene.cam !== 'up') assert.equal(castOf(id, 'player').length, 0, id + ': her lines are from below, never on the balcony');
  });
  assert.ok(tower.filter(id => frames[id].scene.cam === 'up').length >= 4 && tower.some(id => frames[id].scene.cam === 'balcony-close'));
  assert.deepEqual(castOf(F(/^She fluffs herself up\./), 'waffles').map(c => c.puffed), [true]);
  assert.deepEqual(castOf(F(/^NO moon\./), 'waffles').map(c => c.mood), ['solemn'], 'perfectly serious for once');
  const wave = F(/Be FABULOUS\.$/);
  assert.deepEqual(frames[wave].scene.cast.map(c => [c.who, c.pose]), [['waffles', 'pawup'], ['player', 'pawup']], 'both waving: the tap is the wave');
  assert.deepEqual([castOf(GRASS, 'waffles')[0].mood, castOf(frames[GRASS].choice.options[0].next, 'waffles')[0].mood, castOf(frames[GRASS].choice.options[1].next, 'waffles')[0].mood], ['dreamy', 'dreamy', 'sniff']);
});

test('staging, the sixth count: the back row in shadow up to the walk round, then the gap and the dug earth; the guards yawning, then looking at their paws; nobody stern; Glintstar at the fountain; the old tom’s pinecone', () => {
  const morning = ids.filter(id => frames[id].scene.set === 'pile' && at(id) < at(SUNSET));
  const ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  const walkRound = ids.find(id => frames[id].scratch && frames[id].scratch.tap === 'back' && at(id) < at(SUNSET));
  assert.deepEqual(morning, ids.slice(at(PILE_COUNT), at(PILE_COUNT) + 9));
  morning.forEach(id => {
    const o = frames[id].scene.opts;
    assert.deepEqual([o.rows, o.scale, o.moon], [ROWS, 'behind', undefined], id);
    assert.equal(o.back, at(id) <= at(walkRound) ? 'shadow' : undefined, id + ': the back row is a dark band up to the walk round');
    assert.equal(o.dug, at(id) > at(walkRound) ? 'big' : undefined, id + ': then the gap and the dug earth');
    assert.deepEqual(frames[id].scene.fx, ['morning'], id);
    frames[id].scene.cast.forEach(c => assert.notEqual(c.mood, 'stern', id + ': nobody is blamed'));
  });
  assert.deepEqual([camOf(PILE_COUNT), camOf(walkRound), frames[walkRound].scene.opts.tap], ['pile/rows', 'pile/rows', 'back']);
  assert.equal(E.countsSet('ch07-pile', story, STORIES).picture.kind, 'prey', 'the Counts picture is the three front rows, never the frame’s scene');
  // the gaps: the back row close, our cat crouched before it; then her “Four gone.” there
  const gaps = ids.find(id => frames[id].skip && frames[id].skip.thing === 'gap');
  assert.deepEqual([camOf(gaps), camOf(frames[gaps].skip.next)], ['pile/gap', 'pile/gap']);
  // the last guards: three Clan cats yawning at the left end of the rows at the count, and looking at their
  // paws (`shy`) where they sat when Tallyheart stares at the gap
  const guardsAt = id => castOf(id, 'clancat').map(c => [c.at, c.variant, c.mood]);
  // (one column at the left of `rows`, listed back to front, so each nearer guard is drawn over the one behind
  // it and all three faces show)
  assert.deepEqual(guardsAt(PILE_COUNT), [['crowd-2', 3, 'sleepy'], ['crowd-1', 4, 'sleepy'], ['pile-left', 2, 'sleepy']]);
  assert.deepEqual(guardsAt(F(/^The last guards look at their paws\./)), [['crowd-2', 3, 'shy'], ['crowd-1', 4, 'shy'], ['pile-left', 2, 'shy']]);
  ids.filter(id => castOf(id, 'clancat').length && morning.includes(id)).forEach(id => castOf(id, 'clancat').forEach(c => assert.notEqual(c.variant, 6, id + ': no ginger guard beside Tallyheart')));
  // Glintstar on the fountain's edge in the wide view, or at the end of the rows in the low one
  assert.deepEqual(ids.filter(id => castOf(id, 'glintstar').length && morning.includes(id)).map(id => [camOf(id), castOf(id, 'glintstar')[0].at]),
    [['pile/wide', 'fountain-edge'], ['pile/wide', 'fountain-edge'], ['pile/low', 'pile-left']]);
  ids.filter(id => castOf(id, 'grizzled').length && frames[id].scene.set === 'pile').forEach(id => castOf(id, 'grizzled').forEach(c => { if (at(id) < at(SUNSET)) assert.deepEqual([c.holds, c.holdAt], ['pinecone', 'paws'], id); }));
});

test('staging, the Hollow: six marks until the seventh is scratched, seven from then on; the rim sitting up until they bound off, empty after; nose to nose; the cheek, the cheeks and her six Counts; the two lines drawn only where the told sum is', () => {
  const hollow = ids.filter(id => frames[id].scene.set === 'hollow');
  assert.deepEqual(hollow, ids.slice(at(countsAt('ch07-threes')[0]), at(ARRIVE[0])));
  hollow.forEach(id => { assert.equal(frames[id].scene.opts.marks, at(id) >= at(TREE) ? 7 : 6, id + ': marks'); assert.equal(frames[id].scene.opts.glow, 'auto', id); assert.deepEqual(frames[id].scene.fx, ['morning'], id); });
  assert.deepEqual([camOf(TREE), frames[TREE].sfx, frames[TREE].scene.cast], ['hollow/tree', 'SKRITCH!', []]);
  assert.equal(camOf(SEVENTH), 'hollow/wide', 'the seventh Count is said where the seven marks show');
  assert.match(frames[TREE].board, /a seventh claw mark into the bark beside the sixth; the marks stand four and three now/);
  // the rim: chapter 5's five, sitting up, until they bound off; from then on nobody on it
  const rimOf = id => RIM_ANCHORS.map(a => frames[id].scene.cast.find(c => c.at === a)).filter(Boolean);
  hollow.filter(id => at(id) < at(BOUND) && frames[id].scene.cam === 'wide').forEach(id => assert.deepEqual(rimOf(id).map(c => [c.who, c.variant, c.pose]),
    [['clancat', 1, 'situp'], ['murmurchime', undefined, 'situp'], ['clancat', 3, 'situp'], ['clancat', 5, 'situp'], ['grizzled', undefined, 'situp']], id));
  assert.deepEqual(rimOf(BOUND).map(c => [c.who, c.pose, c.facing]), [['murmurchime', 'walk', 'left'], ['clancat', 'walk', 'left'], ['grizzled', 'walk', 'left']], 'the last of them bounding off');
  hollow.filter(id => at(id) > at(BOUND)).forEach(id => assert.equal(rimOf(id).length, 0, id + ': the rim is empty'));
  // “Come close. Closer.” across the Hollow; “Not THAT close.”: nose to nose, she laughs
  assert.deepEqual(castOf(F(/Come close\. Closer\.$/), 'player').map(c => c.at), ['sunpatch-2']);
  const nose = F(/^You come VERY close\./);
  assert.deepEqual(frames[nose].scene.cast.filter(c => !RIM_ANCHORS.includes(c.at)).map(c => [c.who, c.pose, c.mood, c.at, c.facing]), [['tallyheart', 'sit', 'laugh', 'sand-left', 'right'], ['player', 'stand', 'happy', CLOSE, 'left']]);
  const r = A.render(frames[nose].scene, {}), ti = frames[nose].scene.cast.findIndex(c => c.who === 'tallyheart'), pi = frames[nose].scene.cast.findIndex(c => c.who === 'player');
  assert.ok(Math.abs(r.heads[pi].x - r.heads[ti].x) < 2 * r.heads[ti].r + 4, 'nose to nose: ' + JSON.stringify([r.heads[ti], r.heads[pi]]));
  // the whisker Tap, its kept page and the lesson on `lesson`; the five cheeks and the ask in the wide view
  // with the rim (the ask with the six marks in the panel, Tallyheart glowing)
  const [cheek, five] = ids.filter(id => frames[id].skip && frames[id].skip.thing === 'whisker' && frames[id].scene.set === 'hollow');
  const ask = ids.find(id => frames[id].ask);
  assert.deepEqual([camOf(cheek), camOf(frames[cheek].skip.next), camOf(five), camOf(ask), camOf(countsAt('ch07-sixes')[0])], ['hollow/lesson', 'hollow/lesson', 'hollow/wide', 'hollow/wide', 'hollow/lesson']);
  assert.deepEqual([frames[ask].scene.opts.marks, castOf(ask, 'tallyheart')[0].glow, castOf(ask, 'tallyheart')[0].at], [6, true, 'tree-far']);
  // the comparison: two lines in the sand, told only (the insert, her line with the choice, her card), the
  // two cats sitting clear of it; nowhere else in the Hollow
  const cmp = hollow.filter(id => frames[id].scene.opts.compare);
  assert.deepEqual(cmp, ids.slice(at(F(/^Tallyheart draws two lines in the sand\./)), at(SUM_TOLD) + 2));
  cmp.forEach(id => {
    assert.deepEqual([frames[id].scene.opts.compare, frames[id].when], [[24, 60], TOLD], id);
    frames[id].scene.cast.forEach(c => assert.equal(c.pose, 'sit', id + ': ' + c.who + ' sits clear of the lines'));
  });
  assert.deepEqual(cmp.map(camOf), ['hollow/sand', 'hollow/lesson', 'hollow/sand']);
  // the twenty-four: the two of them crouched over the sand where she scratches the marks
  assert.deepEqual([camOf(countsAt('ch07-gone')[0]), frames[countsAt('ch07-gone')[0]].scene.cast.map(c => [c.who, c.pose])], ['hollow/sand', [['tallyheart', 'crouch'], ['player', 'crouch']]]);
  // her wink with the told sixty; her frown on the kept path; “You feel taller” sitting tall; her hot ears
  assert.equal(castOf(countsAt('ch07-dragon')[0], 'tallyheart')[0].wink, true);
  assert.equal(castOf(F(/^She frowns at the sand\./), 'tallyheart')[0].mood, 'stern');
  assert.deepEqual(castOf(F(/^You feel taller\./), 'player').map(c => [c.pose, c.mood]), [['sit', 'proud']]);
  assert.deepEqual(castOf(F(/^Your ears go hot\.$/), 'player').map(c => [c.mood, c.flatEars]), [['shy', true]]);
  assert.deepEqual(castOf(F(/can’t be fooled\.$/), 'tallyheart').map(c => c.mood), ['kind'], 'warm as a sunny stone');
});

test('staging, under the Old Bridge: the stone leg on every `back` panel, Tallyheart across the nook on the told path; Coil only in his wall; the fish, the gulps, the hush; the kept sum in the open mud; her paw over the print; FLEW by her drooping wing; the mist', () => {
  const bridge = ids.filter(id => frames[id].scene.set === 'bridge');
  assert.deepEqual(bridge, ids.slice(at(ARRIVE[0]), at(SUNSET)));
  bridge.forEach(id => assert.deepEqual(frames[id].scene.fx, ['day'], id));
  // (the FLY pair, where she tries her wings, keeps the lettering off her drooping wing: final review)
  bridge.filter(id => frames[id].scene.cam === 'back').forEach(id => assert.deepEqual(frames[id].scene.opts, id === ARRIVE[0] ? { prints: true, stones: true, branch: true } :
    castOf(id, 'sprinkle').some(c => c.pose === 'wings') ? { prints: true, stones: true, wing: true } : { prints: true, stones: true }, id + ': the stone leg and her prints; the branch on the told path’s first panel only; the wing kept clear where she tries it'));
  const cmp = F2(/^Twenty-four is much, much less than sixty\./)[1];
  bridge.filter(id => frames[id].scene.cam === 'under').forEach(id => {
    const o = frames[id].scene.opts;
    assert.equal(o.prints, true, id);
    assert.deepEqual(Object.keys(o).filter(k => k !== 'prints'), o.compare ? ['compare'] : o.tap ? ['tap'] : [], id);
  });
  bridge.filter(id => ['wall', 'print'].includes(frames[id].scene.cam)).forEach(id => assert.deepEqual(frames[id].scene.opts, {}, id));
  // the comparison in the mud, kept only: the scratching, her whisper with the choice, Riffle's line and her card
  assert.deepEqual(bridge.filter(id => frames[id].scene.opts.compare), [F(/^You scratch two lines in the mud\./), cmp, frames[cmp].choice.options[0].next]);
  bridge.filter(id => frames[id].scene.opts.compare).forEach(id => {
    assert.deepEqual([frames[id].scene.opts.compare, frames[id].when], [[24, 60], KEPT], id);
    assert.deepEqual(frames[id].scene.cast.map(c => [c.who, c.at]), [['sprinkle', 'inside'], ['player', 'mud'], ['riffle', RIFFLE]], id + ': clear of the lines');
  });
  assert.deepEqual(castOf(F(/^You scratch two lines in the mud\./), 'player').map(c => [c.pose, c.claws, c.facing]), [['pawup', true, 'right']]);
  // Tallyheart: told only, on `back`, across the nook (never at `near`, on top of our cat at `back-left`),
  // drawn over Sprinkle's tail and under Riffle; where our cat moves into the loop of her tail, by the near wall;
  // where Sprinkle tries her wings (FLY), by the wall behind our cat, facing in, drawn behind her, so nobody
  // stands in front of the hurt wing (final review)
  bridge.filter(id => castOf(id, 'tallyheart').length).forEach(id => {
    assert.deepEqual([frames[id].when, frames[id].scene.cam], [TOLD, 'back'], id);
    const w = frames[id].scene.cast.map(c => c.who), t = castOf(id, 'tallyheart')[0];
    if (same(castOf(id, 'player')[0].at, TAIL)) assert.equal(t.at, 'near', id);
    else if (castOf(id, 'sprinkle')[0].pose === 'wings') { assert.deepEqual([t.at, t.facing], [BY_WALL, 'right'], id); assert.deepEqual(w, ['sprinkle', 'tallyheart', 'player', 'riffle'], id); }
    else { assert.deepEqual([t.at, t.facing], [ACROSS, 'left'], id); assert.ok(w.indexOf('sprinkle') < w.indexOf('tallyheart') && w.indexOf('tallyheart') < w.indexOf('riffle'), id); }
  });
  // Coil: in his wall, a stone until his last line, his head for it, sliding back after
  const coil = bridge.filter(id => castOf(id, 'coil').length);
  assert.deepEqual(coil, bridge.filter(id => frames[id].scene.cam === 'wall'));
  assert.deepEqual(coil.map(id => castOf(id, 'coil')[0].pose), ['stone', 'stone', 'stone', 'head', 'slide']);
  coil.forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => c.who + '@' + c.at), ['coil@gap', 'player@back-left', 'riffle@back-right', 'sprinkle@dragon'], id));
  // the fish: Riffle's string from the arrival to the gulps (the toss is his string's Tap), then gone; his
  // paw over his mouth for “…ten,” and after Coil's QUIET
  assert.deepEqual(bridge.filter(id => castOf(id, 'riffle').some(c => c.holds === 'string')), [ARRIVE[0], ARRIVE[1]].concat(TWINS[1]));
  ARRIVE.forEach(id => assert.deepEqual(castOf(id, 'riffle').map(c => [c.at, c.tap]), [['back-right', 'fish']], id));
  TWINS[1].forEach(id => { assert.equal(frames[id].sfx, 'Gulp. Gulp. Gulp.', id); assert.equal(castOf(id, 'sprinkle')[0].pose, 'gulp', id); });
  assert.deepEqual([QUIETLY, F(/^She can’t fly\. I could have told you\./), SORRY].map(id => castOf(id, 'riffle')[0].pose), ['hush', 'hush', 'hush']);
  // her tail round our cat: our cat in the loop in front of her (she faces left, so the loop is on her left),
  // facing her, Sprinkle listed first so the tail's near loop is drawn over the cat; her prints, the Tap in
  // the open mud right of her, then her paw over one
  TWINS[3].forEach(id => {
    const p = castOf(id, 'player')[0], w = frames[id].scene.cast.map(c => c.who);
    assert.deepEqual([castOf(id, 'sprinkle')[0].pose, castOf(id, 'sprinkle')[0].at, castOf(id, 'sprinkle')[0].facing, p.at, p.facing, p.size], ['curl', 'dragon', 'left', TAIL, 'right', 0.9], id);
    assert.ok(w.indexOf('sprinkle') < w.indexOf('player'), id + ': the tail drawn over her');
  });
  const prints = F(/^When she lets go, you look down\./);
  assert.deepEqual([camOf(prints), frames[prints].scene.opts.tap, castOf(prints, 'player').map(c => [c.pose, c.at])], ['bridge/under', 'print', [['crouch', 'mud']]]);
  assert.deepEqual(frames[frames[prints].scratch.next].scene, { set: 'bridge', cam: 'print', opts: {}, cast: [{ who: 'player', pose: 'crouch', mood: 'wonder', at: 'over', facing: 'right', reach: true }], fx: ['day'] });
  // FLY: her good wing up and her hurt wing drooping, from “She lifts her wings.” to the FLEW screen
  const wings = bridge.filter(id => castOf(id, 'sprinkle').some(c => c.pose === 'wings'));
  assert.deepEqual(wings, ids.slice(at(F(/^She lifts her wings\./)), at(FLEW) + 1));
  wings.forEach(id => assert.equal(castOf(id, 'sprinkle')[0].mood, 'sad', id));
  assert.deepEqual([camOf(FLEW), castOf(FLEW, 'sprinkle')[0].at], ['bridge/under', 'inside']);
  // the burp: her head at the wall's edge, the cloud the thing to tap; the next panel has no mist
  const burp = F(/HURP\.$/);
  assert.deepEqual(castOf(burp, 'sprinkle').map(c => [c.pose, c.mist, c.tap]), [['burp', true, 'mist']]);
  assert.equal(frames[SORRY].caption[0], '“Sorry, Coil,” everybody whispers.');
});

test('staging, sunset and dusk at the pile: forty pieces in four rows; the seventh evening’s moon from the moment it comes out, in `wide`’s sky only; round the back, the roots down, then lifted, the mouth; the guards small at the front; Tallyheart beside it on the told path; nobody at the mouth but our cat; the climber on the arch', () => {
  const eve = ids.filter(id => frames[id].scene.set === 'pile' && at(id) >= at(SUNSET));
  assert.deepEqual(eve, ids.slice(at(SUNSET), at(NEST)));
  eve.forEach(id => { const o = frames[id].scene.opts; assert.deepEqual([o.rows, o.dug, o.scale], [[10, 10, 10, 10], 'big', 'behind'], id + ': forty pieces'); });
  assert.deepEqual(eve.filter(id => frames[id].scene.fx.includes('sunset')), [SUNSET, F(/^You don’t say sixty\./)]);
  eve.filter(id => !frames[id].scene.fx.includes('sunset')).forEach(id => assert.deepEqual(frames[id].scene.fx, ['dusk'], id));
  // the moon: from “The moon comes out, fatter again.” on, on every `wide` panel, and only there
  eve.forEach(id => assert.equal(frames[id].scene.opts.moon, at(id) >= at(MOONRISE[0]) && frames[id].scene.cam === 'wide' ? 7 : undefined, id + ': moon'));
  MOONRISE.forEach(id => assert.equal(camOf(id), 'pile/wide', 'the moon comes out in the open sky'));
  // the slip round: the back row marked on `wide`; then round the back on `rear`, the roots down and marked;
  // the mouth on `hole`; from the choice on, the roots lifted (`tunnel: true`)
  const slips = ids.filter(id => frames[id].scratch && frames[id].scratch.tap === 'back' && at(id) > at(SUNSET));
  slips.forEach(id => assert.deepEqual([camOf(id), frames[id].scene.opts.tap, frames[id].scene.opts.moon], ['pile/wide', 'back', 7], id));
  const rear = eve.filter(id => frames[id].scene.cam === 'rear');
  rear.forEach(id => {
    const o = frames[id].scene.opts, roots = frames[id].scratch && frames[id].scratch.tap === 'roots';
    assert.deepEqual([o.tap, o.tunnel, o.moon], roots ? ['roots', undefined, undefined] : [undefined, true, undefined], id);
    assert.deepEqual(castOf(id, 'clancat').map(c => [c.at, c.facing]), [['guard-1', 'left'], ['guard-2', 'right'], ['guard-3', 'right']], id + ': the guards small at the front, looking out');
    assert.deepEqual(castOf(id, 'player').map(c => [c.at, c.facing]), [['rear-1', 'right']], id);
    assert.deepEqual(castOf(id, 'tallyheart').map(c => [c.at, c.facing]), same(frames[id].when, TOLD) ? [['rear-2', 'left']] : [], id + ': where she sat the first watch, right beside it');
  });
  assert.equal(rear.length, 9);
  eve.filter(id => frames[id].scene.cam === 'hole').forEach(id => assert.deepEqual(frames[id].scene.opts, { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }, id + ': the roots always lifted there'));
  assert.deepEqual(eve.filter(id => frames[id].scene.cam === 'hole').map(id => castOf(id, 'player')[0].mood), ['wonder', 'worried', 'sniff', 'wonder', 'sniff', 'wonder'], 'the mouth, too small for a dragon, sniff, listen (told), sniff, listen (kept)');
  assert.equal(camOf(MOUTH), 'pile/hole');
  // the climber: on top of the bramble arch, the tracks shining far off
  const climb = F(/^You climb the bramble arch for a look\./);
  assert.deepEqual([camOf(climb), frames[climb].scene.opts.tracks, frames[climb].scene.opts.moon, frames[climb].scene.cast.map(c => [c.who, c.at])], ['pile/wide', true, 7, [['player', 'arch']]]);
  assert.equal(eve.filter(id => frames[id].scene.opts.tracks).length, 1);
  // at sunset Glintstar hears twenty-four and never sixty
  [SUNSET, F(/^You don’t say sixty\./)].forEach(id => (frames[id].say || []).forEach(b => assert.doesNotMatch(b.text, /sixty/i, id)));
});

test('staging, the den: night; her stone where she put it, her bark along her nest and the secrets under the moss; the grey tom across the den; snoring; the end', () => {
  const den = ids.filter(id => frames[id].scene.set === 'den');
  assert.deepEqual(den, [story.start].concat(ids.slice(at(NEST))));
  den.forEach(id => {
    const o = frames[id].scene.opts;
    assert.deepEqual([o.weather, o.moon, o.stone, o.bark, o.hidden], ['clear', false, 'auto', 'auto', true], id);
    assert.ok(frames[id].scene.fx.includes('night'), id);
    castOf(id, 'player').forEach(c => assert.deepEqual([c.at, c.facing], ['nest', 'left'], id));
    castOf(id, 'snorer').forEach(c => assert.deepEqual([c.at, c.facing], ['sleeper-1', 'right'], id));
    assert.equal(castOf(id, 'tallyheart').length, 0, id);
  });
  assert.deepEqual(castOf(NEST, 'player').map(c => c.pose), ['lie'], 'lying, so the stone is by her nose or under her chin');
  const bed = ids.find(id => frames[id].skip && frames[id].skip.groups === 4 && frames[id].skip.table === 6);
  assert.deepEqual([camOf(bed), castOf(bed, 'snorer').length, castOf(bed, 'player').length], ['den/inside', 1, 1]);
  assert.ok(frames[F(/^Soon he’s snoring\./)].scene.fx.includes('zzz'));
  assert.deepEqual(castOf(F(/^Soon he’s snoring\./), 'snorer').map(c => c.pose), ['curl']);
  assert.deepEqual(castOf(F(/You curl up tight, warm and safe, and sleep\.$/), 'player').map(c => [c.pose, c.mood, c.asleep]), [['curl', 'kind', 'half']], 'half-shut lids and a small smile as she curls up, warm and safe (never a cross face; `kind` alone looks out, wide awake)');
  const end = frames[ids[ids.length - 1]];
  assert.ok(end.scene.fx.includes('night') && end.scene.fx.includes('skyriver'));
  assert.ok(end.scene.cast.some(c => c.who === 'player' && c.at === 'nest'), 'she is in her nest');
  assert.equal(end.caption[end.caption.length - 1], 'End of Chapter Seven.');
});

test('the build review’s fixes (integration round 1): the pictures say what the panels say: Sprinkle’s round eyes over the branch, her joy with both paws up, our cat and Riffle turned to her at the wall, the dusk guards facing out, our cat turned to Tallyheart to whisper, no speaker’s balloon chained to her own, the open mouth as the told path leaves it, a warm face to sleep on', () => {
  // the peek over Tallyheart's branch: “Two big eyes…”, so her eyes are open and round, as every earlier peek
  assert.deepEqual(castOf(F(/^Tallyheart takes you straight to the Old Bridge\./), 'sprinkle').map(c => [c.pose, c.mood]), [['peek', 'wonder']]);
  assert.deepEqual(castOf(F(/^At the Old Bridge, you check the bank first\./), 'sprinkle').map(c => [c.pose, c.mood]), [['sit', 'wonder']], 'her eyes on the string of fish');
  // “I’m so happy I could FLY!”: both forepaws up (chapter 3's happy pose), never the shy huddle under her tail
  assert.deepEqual(castOf(F(/^I’m so happy I could FLY!$/), 'sprinkle').map(c => [c.pose, c.mood]), [['pawsup', 'happy']]);
  ids.forEach(id => castOf(id, 'sprinkle').forEach(c => assert.notEqual(c.pose, 'tailup', id)));
  // at the wall, when Sprinkle is the one speaking or burping, our cat and Riffle face her (right); when Coil
  // speaks, they face his gap (left)
  [F(/^Sprinkle’s eyes go round\./), F(/HURP\.$/)].forEach(id => assert.deepEqual(['player', 'riffle'].map(w => castOf(id, w)[0].facing), ['right', 'right'], id));
  [QUIETLY, F(/^She can’t fly\. I could have told you\./), SORRY].forEach(id => assert.deepEqual(['player', 'riffle'].map(w => castOf(id, w)[0].facing), ['left', 'left'], id));
  // the dusk guards on `wide`, at the pile's front right, face out over the camp (right), away from the pile and
  // our cat: “Nobody is looking at you.”
  const duskWide = ids.filter(id => frames[id].scene.set === 'pile' && frames[id].scene.cam === 'wide' && frames[id].scene.fx.includes('dusk') && castOf(id, 'clancat').length);
  assert.equal(duskWide.length, 4);
  // (listed back to front: the one at `crowd-2`, further back, is drawn first, under the guard at `beside`:
  // the depth hotfix of 2026-10-25, Charlie's bug on chapter 8's f030, the same picture)
  duskWide.forEach(id => assert.deepEqual(castOf(id, 'clancat').map(c => [c.at, c.facing]), [['crowd-2', 'right'], ['beside', 'right'], ['crowd-3', 'right']], id));
  // she leans to Tallyheart, behind her at the left end, to whisper
  const want = F(/I want to see the back\.$/), tal = castOf(want, 'tallyheart')[0], me = castOf(want, 'player')[0], A0 = A.sceneInfo('pile').anchors.main;
  assert.ok(A0[tal.at].x < A0[me.at].x && me.facing === 'left' && tal.facing === 'right', 'face to face');
  // no balloon is chained to its own speaker's: a speaker's lines on one panel are one balloon, so no tail runs
  // under another balloon of hers (Sprinkle's “The Counts LIKE me? Only FOUR a night?…” is one)
  for (const c of SOME) {
    const cat = catFor(c.flags);
    ids.forEach(id => { const b = E.balloons(frames[id], cat); for (let i = 1; i < b.length; i++) assert.notEqual(b[i].who, b[i - 1].who, id + ' ' + comboName(c) + ': two balloons of ' + b[i].who + ' in a row'); });
  }
  // the told path's tunnel: her deduction and Tallyheart's “And I SAT here…” are a panel each, one balloon
  // each, each tail to its own speaker; Tallyheart astonished there, never scared
  const why = FF(/^So THAT’S why.*UNDER it\.$/).find(id => same(frames[id].when, TOLD)), sat = F(/^And I SAT here\./);
  assert.deepEqual([frames[why].say.map(b => b.who), frames[sat].say.map(b => b.who), frames[why].next], [['player'], ['tallyheart'], sat]);
  [why, sat].forEach(id => assert.equal(castOf(id, 'tallyheart')[0].mood, 'wonder', id));
  ids.forEach(id => castOf(id, 'tallyheart').forEach(c => { if (frames[id].scene.cam === 'rear') assert.notEqual(c.mood, 'scared', id + ': the tunnel makes her curious, never scared'); }));
  // the told path's last panel round the back: the roots still lifted and the mouth open, as its board says
  // (chapter 8 draws it open: nobody hides it again); Tallyheart in on the secret, never glaring
  const word = F(/^Not a word to the Clan yet\./);
  assert.equal(frames[word].scene.opts.tunnel, true);
  assert.doesNotMatch(frames[word].board, /lays the roots back|so nobody else will see it/);
  assert.notEqual(castOf(word, 'tallyheart')[0].mood, 'stern');
});

test('the final review’s fixes: the told path’s big shot of Sprinkle trying to fly shows her hurt wing, nobody in front of it; Tallyheart’s claws in the sand as she scratches; our cat half asleep as she curls up to sleep; the climber big enough to see on the arch and the tracks she sees', () => {
  const look = E.defaultLook(0);
  // FLY: the pair on `back` where Sprinkle tries her wings (told, then its kept twin). On both, nobody but Riffle
  // (at the wing's tip, the same on both) stands anywhere near her: every other cast member's box lies wholly
  // left of her spot, so the drooping wing is in plain sight (across the nook, Tallyheart stood in front of it)
  const fly = ids.filter(id => frames[id].scene.set === 'bridge' && frames[id].scene.cam === 'back' && castOf(id, 'sprinkle').some(c => c.pose === 'wings'));
  assert.deepEqual(fly.map(id => frames[id].when), [TOLD, KEPT], 'the FLY pair: told, then kept');
  const AB = A.sceneInfo('bridge').anchors.back, spr = AB.dragon;
  fly.forEach(id => {
    assert.deepEqual(castOf(id, 'sprinkle').map(c => [c.pose, c.at]), [['wings', 'dragon']], id);
    assert.deepEqual(castOf(id, 'riffle').map(c => c.at), ['back-right'], id + ': Riffle at the wing’s tip on both');
    frames[id].scene.cast.filter(c => !['sprinkle', 'riffle'].includes(c.who)).forEach(c => {
      const a = typeof c.at === 'object' ? c.at : AB[c.at];
      assert.ok(a.x + a.h / 2 < spr.x - spr.h, id + ': ' + c.who + ' clear of Sprinkle and her wings (' + (a.x + a.h / 2) + ' < ' + (spr.x - spr.h) + ')');
    });
  });
  // ... and no balloon on it: both take `wing: true`, so the drooping wing is a `keep` area the lettering
  // avoids as it avoids a face (on the told panel our cat's “I KNEW it!”, the second balloon, had landed there)
  fly.forEach(id => {
    assert.equal(frames[id].scene.opts.wing, true, id);
    const r = A.render(frames[id].scene, { look }), k = r.keep[r.keep.length - 1], box = [k.x * 16, k.y * 10, (k.x + k.w) * 16, (k.y + k.h) * 10];
    assert.ok(box[0] > spr.x - 20 && box[2] >= spr.x + 380 && box[3] <= spr.y, id + ': the keep area lies over her drooping wing: ' + box.map(Math.round));
    r.heads.forEach((h, i) => { if (h) assert.ok(!(h.x * 16 > box[0] && h.x * 16 < box[2] && h.y * 10 > box[1] && h.y * 10 < box[3]), id + ': no face inside it (' + frames[id].scene.cast[i].who + ')'); });
  });
  const told = fly[0], tal = castOf(told, 'tallyheart')[0];
  assert.deepEqual([tal.at, tal.facing, tal.pose, tal.mood], [BY_WALL, 'right', 'stand', 'solemn'], 'by the wall behind our cat, facing in, gone very still');
  const heads = A.render(frames[told].scene, { look }).heads, at = (w) => frames[told].scene.cast.findIndex(c => c.who === w);
  assert.ok(heads[at('tallyheart')] && heads[at('tallyheart')].x < heads[at('player')].x && heads[at('player')].x < heads[at('sprinkle')].x, 'Tallyheart, then our cat, then Sprinkle, left to right, every face in the panel');
  assert.match(frames[told].board, /hurt one drooping[^.]*in plain sight/);
  // “In the sand she scratches four marks for every night”: her claws out on the forepaw at the sand
  const sand = F(/^In the sand she scratches four marks for every night\./);
  assert.deepEqual(frames[sand].scene.cast.map(c => [c.who, c.pose, c.mood, c.at, !!c.claws]), [['tallyheart', 'crouch', 'solemn', 'sand-left', true], ['player', 'crouch', 'wonder', 'sand-right', false]]);
  assert.ok((A.render(frames[sand].scene, { look }).svg.match(/class="pc-claws"/g) || []).length >= 1, 'her claws drawn');
  assert.equal(frames[sand].scene.cam, 'sand');
  // “You curl up tight, warm and safe, and sleep.”: half asleep, heavy lids and kind's small smile, drawn so;
  // asleep, eyes shut, on the next panel
  const curl = F(/You curl up tight, warm and safe, and sleep\.$/), next = frames[curl].next;
  assert.equal((A.render(frames[curl].scene, { look }).svg.match(/<path d="M-12,-1\.6Q0,4 12,-0\.4L12,-14L-12,-14Z"/g) || []).length, 2, 'both her eyes half shut');
  assert.deepEqual(castOf(next, 'player').map(c => [c.pose, c.mood]), [['curl', 'sleepy']], 'then asleep');
  // the climber: on top of the arch, as big as a cat by the back row, facing the tracks, which start right of her
  const climb = F(/^You climb the bramble arch for a look\./), AP = A.sceneInfo('pile').anchors.main;
  assert.deepEqual(frames[climb].scene.cast, [{ who: 'player', pose: 'stand', mood: 'wonder', at: 'arch', facing: 'right' }], 'no size of her own: the anchor is drawn to be seen');
  assert.ok(AP.arch.h >= AP['crowd-2'].h * 0.9, 'as big as a cat by the back row');
  const r = A.render(frames[climb].scene, { look }), tg = (/<g data-art="tracks">.*?<\/g>/.exec(r.svg) || [''])[0];
  assert.ok(tg && /stroke-width="5"/.test(tg), 'the tracks drawn, their rails 5 wide');
  assert.ok(r.heads[0] && r.heads[0].x * 16 < 880, 'her head left of where the tracks begin, looking out at them');
});

test('the time of day runs night (waking before the sun), then morning (her old step, the tower, the pile, the Hollow), day (the Old Bridge), sunset and dusk (the pile), night (the den)', () => {
  for (const c of COMBOS) {
    const p = walk(c.flags, {});
    const tods = p.map(id => {
      const t = frames[id].scene.fx.filter(e => TOD.includes(e));
      assert.equal(t.length, 1, id + ': exactly one time of day in fx');
      return TOD.indexOf(t[0]);
    });
    assert.equal(TOD[tods[0]], 'night', 'she wakes before the sun');
    for (let i = 2; i < p.length; i++) assert.ok(tods[i] >= tods[i - 1], p[i] + ' goes back in time');
  }
  const tod = id => frames[id].scene.fx.find(e => TOD.includes(e));
  const BY_SET = { den: ['night'], garden: ['morning'], tower: ['morning'], pile: ['morning', 'sunset', 'dusk'], hollow: ['morning'], bridge: ['day'] };
  ids.forEach(id => assert.ok(BY_SET[frames[id].scene.set].includes(tod(id)), id + ': ' + frames[id].scene.set + ' at ' + tod(id)));
  assert.equal(tod(SUNSET), 'sunset');
  assert.match(T(SUNSET), /^At sunset/);
  assert.ok(ids.filter(id => tod(id) === 'dusk').every(id => at(id) >= at(MOONRISE[0])));
  assert.match(T(MOONRISE[0]), /^At dusk/);
  assert.deepEqual(ids.filter(id => frames[id].scene.fx.includes('skyriver')), [ids[ids.length - 1]]);
});

test('the storyboard is this chapter’s: every frame, the panels a read-through as a reader walks them, every frame shown only to some readers saying so', () => {
  const sb = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch07.md'), 'utf8');
  assert.match(sb, /^# Storyboard: Chapter 7, The Counts Don’t Lie\n/);
  assert.doesNotMatch(sb, /\bSTUB\b|undefined|NaN|\[object/);
  ids.forEach(id => assert.ok(new RegExp('^(### ' + id + ' · panel \\d+|#####+ ' + id + ')\\b', 'm').test(sb), 'the storyboard has ' + id));
  assert.ok(sb.includes('| Frames | ' + ids.length + ' ('), 'every frame counted');
  ids.forEach(id => assert.ok(sb.includes('**Shot.** ' + frames[id].board), id + ': its board'));
  const lens = COMBOS.flatMap(c => [0, 1].map(light => walk(c.flags, { light }).length));
  assert.ok(sb.includes('| One read-through | ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels'), 'a read-through is ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels');
  assert.ok(sb.includes('| Choices | 6 |') && sb.includes('| Case File cards | 4 (3 eyes, 1 ears) |'), 'six choice frames, four cards');
  assert.ok((sb.match(/^\*\*Shows only if\*\* /gm) || []).length >= ids.filter(id => frames[id].when).length);
  // the art's new names, in the storyboard's own words
  assert.match(sb, /Coil/);
  assert.match(sb, /tunnel/);
  // the final review's: our cat half asleep as she curls up; the climber and the tracks she sees
  assert.match(sb, /Cast: you \(curled up, kind, in the nest, facing left, eyes half shut, heavy-lidded: half asleep\)/);
  assert.match(sb, /standing on top of the bramble arch over the pile, as big as a cat by the back row, facing right\)[^\n]*the train tracks catching the last light: two bright rails on a dark bed, the sleepers across it/);
  assert.match(sb, /Tallyheart \(standing, solemn, at a spot of this frame’s own \(x 300, y 960\), facing right\)/);
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(camOf));
  assert.ok(pairs.size >= 20, 'only ' + pairs.size + ' set/camera pairs');
  const sets = new Set(ids.map(id => frames[id].scene.set));
  // no new place: every set is chapters 1 to 6's
  assert.deepEqual([...sets].sort(), ['bridge', 'den', 'garden', 'hollow', 'pile', 'tower']);
  ['rows', 'gap', 'wide', 'low', 'rear', 'hole'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'pile/' + cam), 'the pile’s ' + cam));
  ['wide', 'lesson', 'sand', 'tree'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'hollow/' + cam), 'the Hollow’s ' + cam));
  ['up', 'balcony', 'balcony-close'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'tower/' + cam), 'the tower’s ' + cam));
  ['back', 'under', 'wall', 'print'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'bridge/' + cam), 'the bridge’s ' + cam));
  ['nest', 'inside', 'doorway'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'den/' + cam), 'the den’s ' + cam));
  // along any path a reader can take, never five panels in a row from the same camera
  for (const c of COMBOS) for (const light of [0, 1]) {
    const p = walk(c.flags, { light });
    let run = 1;
    for (let i = 1; i < p.length; i++) {
      run = camOf(p[i]) === camOf(p[i - 1]) ? run + 1 : 1;
      assert.ok(run < 5, p[i] + ': ' + run + ' panels in a row from ' + camOf(p[i]) + ' for ' + comboName(c));
    }
  }
  // and no two panels a reader turns between are the same picture with the same words
  for (const c of SOME) {
    const p = walk(c.flags, {});
    for (let i = 1; i < p.length; i++) assert.ok(!same(frames[p[i]].scene, frames[p[i - 1]].scene) || T(p[i]) !== T(p[i - 1]), p[i]);
  }
});

test('every frame renders, and everyone in the cast is in the picture; every Tap has its target in the art; the Taps, the questions, the Counts pictures and her cards all draw', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'black', marking: 'white-paws', eyes: 'odd' }, { sex: 'she', fur: 'calico', marking: 'none', eyes: 'amber' }];
  const off = [];
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', ch3Told: true } });
  Object.keys(ch04.cards).forEach((cid, i) => E.giveCard(cat, cid, 'ch04', i + 1));
  CH6_CARDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch06', 10 + i));
  CARD_IDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch07', 20 + i));
  // (small at the distance of a wide shot, a tall tower or a far nook; Coil's head no bigger than a stone)
  const SMALL = (id, who) => who === 'coil' || ['pile/wide', 'pile/rows', 'pile/low', 'pile/rear', 'hollow/wide', 'tower/up', 'tower/balcony', 'den/inside', 'den/doorway'].includes(camOf(id)) ||
    (frames[id].scene.set === 'bridge' && ['back', 'under'].includes(frames[id].scene.cam)) || (camOf(id) === 'bridge/wall' && who === 'riffle');
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
        if (!SMALL(id, c.who)) assert.ok(h.r >= 3, id + ': ' + c.who + ' face radius ' + h.r);
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
  ids.filter(id => frames[id].scratch).forEach(id => {
    const svg = A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg, tap = frames[id].scratch.tap;
    assert.match(svg, /pc-tap/, id);
    assert.match(svg, new RegExp('class="pc-tap pc-tap-' + tap + '"|data-tap="' + tap + '"'), id + ': the ' + tap + ' to tap is in the picture');
    const marks = (svg.match(/<[^>]*(?:class="[^"]*pc-tap[^"]*"|data-tap="[^"]*"|data-art="glint")[^>]*>/g) || []).map(el => ({ tap: (/data-tap="([^"]*)"/.exec(el) || [])[1] || null, art: (/data-art="([^"]*)"/.exec(el) || [])[1] || null, cls: (/class="([^"]*)"/.exec(el) || [])[1] || null }));
    const picked = PC.ui.taps.pick(marks, tap);
    assert.ok(picked >= 0, id + ': the page finds a mark for ' + tap);
    assert.ok((marks[picked].cls || '').includes('pc-tap-' + tap) || marks[picked].tap === tap, id + ': and it is the ' + tap + ' (' + JSON.stringify(marks[picked]) + ')');
  });
  // the comparison is drawn where it is asked for, with its numbers, and kept clear of the lettering
  ids.filter(id => frames[id].scene.opts.compare).forEach(id => {
    const r = A.render(frames[id].scene, { look: looks[0] });
    assert.match(r.svg, /data-art="compare"[^>]*aria-label="[^"]*24[^"]*60/, id);
    assert.ok((r.keep || []).length, id + ': kept clear');
  });
  // the mouth: hidden under the roots until she lifts them, open from then on
  ids.filter(id => camOf(id) === 'pile/rear').forEach(id => assert.match(A.render(frames[id].scene, { look: looks[0] }).svg, new RegExp('data-art="roots" data-lifted="' + !!frames[id].scene.opts.tunnel + '"'), id));
  // the page of six Counts: Tallyheart glows (the one to tap)
  const ask = ids.find(id => frames[id].ask);
  for (let n = 0; n <= 6; n++) { const svg = A.render(E.askScene(frames[ask].scene, frames[ask].ask, n), { look: looks[0] }).svg; assert.ok(svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg)); if (!n) assert.match(svg, /pc-next/); }
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
  ids.filter(id => frames[id].skip && frames[id].skip.keep).forEach(id => pics.push(A.countsPicture(Object.assign({ look: looks[0] }, E.keptPicture(frames[id].skip)))));
  CARD_IDS.forEach(cid => { pics.push(A.card({ picture: cid, mark: story.cards[cid].mark })); pics.push(A.card({ picture: cid, mark: story.cards[cid].mark, big: true })); });
  pics.forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
  assert.ok(pics.length > 100, pics.length + ' pictures');
  // the skip-counts' pictures are the art's own: the back row's places, one cheek's two rows, the five rim
  // cats' cheeks, and two faces (his, then hers)
  const picOf = (id, n) => A.countsPicture(Object.assign({ look: looks[0] }, E.skipPicture(frames[id].skip, n)));
  const [gaps, cheek, five, bed] = ids.filter(id => frames[id].skip);
  assert.match(picOf(gaps, 0), /The back row: four empty places/);
  assert.match(picOf(cheek, 0), /One cheek: two rows of three whiskers/);
  assert.match(picOf(five, 0), /5 cheeks, six whiskers each/);
  assert.equal((picOf(bed, 0).match(/pc-face/g) || []).length > 0, true, 'faces, puffed');
  // her nest at bedtime: her cards along it, and the secrets under the moss
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
  const B2 = (label, re, also) => [[B(label + ' (told)', re, f => told(f) && (!also || also(f)))], [B(label + ' (kept)', re, f => kept(f) && (!also || also(f)))]];
  const WAKE = [
    B('the wind chime in her dream', /^You wake before the sun\. A wind chime is still ringing in your ears, from your dream\. Who was up there, awake, when the rain stopped\? You know EXACTLY who\.$/),
    B('her old step (the look-up Tap)', /^Through the gap in the hedge, to your old step\. Your dish of water is there, full\. Far, far up, a wind chime rings\. Ting-a-ling\.$/, tap('ears')),
    B('DARLING!', /^\{petname\}! DARLING!$/),
    B('you came BACK!', /^Princess Waffles leans over her balcony\. You came BACK! The whole tower is talking about you\. Well\. I am\.$/),
    B('is grass SOFT? (the grass choice)', /^Tell me one thing, \{petname\}\. Is grass SOFT\? I’d come and see\. But the little room that goes DING\? Fine for BRAVE cats\. For ME, it’s TERRIFYING\.$/, f => f.choice)
  ];
  const SOFT = [B('I KNEW it (very soft)', /^I KNEW it\.$/)], WET = [B('ew (very wet)', /^Ew\. Tell me no more\.$/)];
  const WITNESS = [
    B('I need a witness', /^Waffles, I need a witness\. Were you awake on the storm night\? A WITNESS\?$/),
    B('BORN for this', /^She fluffs herself up\. Darling, I was BORN for this\. I was up ALL night with my nerves\. My Tall One says I’m DRAMATIC\. I’m not\. I’m SENSITIVE\.$/),
    B('was the moon out? and?', /^When the rain stopped, was the moon out\? The moon calms my nerves\. So the moment the rain stopped, I looked for it\. And\?$/),
    B('NO moon', /^NO moon\. Not a sliver\. Black as the glowing box when my Tall One switches it off\.$/),
    B('everything I say matters (Waffles’ card)', /^You told me that on my second day\. I didn’t know it mattered\. Darling\. EVERYTHING I say matters\.$/, f => f.card === 'waffles-no-moon'),
    B('the dish', /^I see your Tall One fill that dish, you know\. Every single morning\.$/),
    B('be FABULOUS (the wave)', /^Between the towers, the sun peeks up\. The count! Go, \{petname\}\. Count things\. Be FABULOUS\.$/, tap('paw'))
  ];
  const COUNT = [
    B('eighteen guards (the pile’s count)', /^By the prey pile, the last guards are yawning\. The whole Clan is waiting\. \{name\}paw\. Eighteen guards\. Let’s see if it worked\.$/, set('ch07-pile')),
    B('the back row in shadow (the walk round)', /^The back row is still in the brambles’ shadow\.$/, tap('back')),
    B('empty spaces (the gaps)', /^Right in the middle of the back row: empty spaces\.$/, f => f.skip && f.skip.thing === 'gap'),
    B('four gone', /^Four gone\.$/),
    B('FOUR?', /^Still tidy\. Still the back\. FOUR\? But we had EIGHTEEN guards! I didn’t blink once\. Well\. One very SMALL blink\.$/),
    B('the last guards look at their paws', /^The last guards look at their paws\. Tallyheart stares at the gap\. Eighteen guards\. The pile was all there when our watch ended\. And not one guard saw a thing\.$/),
    B('his pinecone', /^They wouldn’t let me guard with my pinecone\. And LOOK what happens\.$/),
    B('nobody is to blame; why always the back?', /^Nobody here is to blame\. You guarded well\. Somebody is very clever\. But why is it ALWAYS the back\?$/),
    B('a job for the sixes', /^Nobody knows\. Four more\. Six nights now\. How many is that\? \{name\}paw, bring me the count at sunset\. Four a night, for six nights\. That’s a job for the sixes\. Guess which Count is next\?$/)
  ];
  const WHISKERS = [
    B('threes first (the warm-up)', /^In the Training Hollow, five cats sit up on the rim\. Threes first, to wake up your whiskers\.$/, set('ch07-threes')),
    B('come close, closer', /^Speaking of whiskers\. Today’s Count is the sixes\. Come close\. Closer\.$/),
    B('not THAT close', /^You come VERY close\. Not THAT close\.$/),
    B('her whiskers (the one cheek)', /^She turns her cheek to you\. Up close, you can count her whiskers\.$/, f => f.skip && f.skip.keep),
    B('six is two threes', /^Six whiskers on one cheek\. Three on top, three below\. Six is two threes\. So a six is a three, TWICE\? Exactly\.$/),
    B('hop by sixes (the five cheeks)', /^One at a time, the cats on the rim turn a cheek to you\. Now hop by sixes\. Touch each cheek\.$/, f => f.skip && f.skip.groups === 5),
    B('most of the sixes (her six Counts)', /^Thirty! Now, a secret\. You already know most of the sixes\. One from every mark on this tree\. I DO\?$/, f => f.ask),
    B('double the threes (the lesson)', /^Six of them you knew already\. Only four are new\. For those, start from one you know and hop, or double the threes\.$/, set('ch07-sixes')),
    B('a seventh claw mark', /^Tallyheart stretches up the leaning tree\. A seventh claw mark\. SKRITCH!$/),
    B('your seventh Count', /^Whiskers\. That’s your seventh Count\. And I knew most of it already\. Now you know all of it\. Some were tricky\. Tricky\. And you worked out every one\.$/)
  ];
  const FOOLED = [
    B('two witnesses, one fox', /^The cats on the rim bound off to breakfast\. At last, you can tell Tallyheart about Waffles\. No moon\? Not a sliver\? I asked you for somebody else who was awake\. You found her! Two witnesses, Patience and Waffles\. One fox\.$/),
    B('Glintstar’s question', /^Now\. Glintstar’s question\.$/),
    B('four marks a night (the twenty-four)', /^In the sand she scratches four marks for every night\. One night\. Two\. Three, four, five, six\.$/, set('ch07-gone'))
  ];
  const SUM_T = [
    B('a dragon who eats ten fish (told)', /^Now, a dragon\. I know one who eats ten fish a meal\.$/, told),
    B('she winks (the sixty, told)', /^She winks\. If she were our thief, that’s ten every night\.$/, f => told(f) && f.counts && f.counts.set === 'ch07-dragon'),
    B('two lines in the sand (told)', /^Tallyheart draws two lines in the sand\. A short one, for twenty-four\. A long one, for sixty\.$/, told),
    B('a SMALL supper (the told sum)', /^Twenty-four is much, much less than sixty\. A hungry dragon would take far more\. Ten every single night, not four\. Four is a SMALL supper\.$/, f => told(f) && f.choice),
    B('the Counts don’t lie (told: her count)', /^The Counts don’t lie\.$/, f => told(f) && f.card === 'my-count')
  ];
  const SUM_K = [
    B('twenty-four pieces (kept)', /^Twenty-four pieces in six nights\.$/, kept),
    B('for a DRAGON (kept)', /^She frowns at the sand\. Four a night\. That’s a very small supper\. For a DRAGON\.$/, kept),
    B('you KNOW a dragon (kept)', /^You KNOW a dragon who eats ten fish a meal! But you can’t say so without saying who\.$/, kept)
  ];
  const WARM = [
    B('can’t be fooled', /^Tallyheart looks at you, warm as a sunny stone\. Everybody in camp says ‘dragon’\. But you counted\. A warrior who knows \{their\} Counts can’t be fooled\.$/),
    B('you feel taller', /^You feel taller\. Almost as tall as Tallyheart\.$/)
  ];
  const BACK_K = [B('back by sunset (kept)', /^Back by sunset\. And if you come back smelling of fish again, wash first\.$/, kept), B('your ears go hot (kept)', /^Your ears go hot\.$/, kept)];
  const ARRIVE_T = [B('Tallyheart’s branch (told, the toss)', /^Tallyheart takes you straight to the Old Bridge\. Two big eyes peek over Tallyheart’s branch, and Riffle is there with fish\. FISH!$/, f => told(f) && tap('fish')(f))];
  const ARRIVE_K = [B('no ginger ears (kept, the toss)', /^At the Old Bridge, you check the bank first\. No ginger ears\. Riffle is there with fish\. FISH!$/, f => kept(f) && tap('fish')(f))];
  const GULP_T = [B('tell them (told)', /^Tell them\. The Counts say it wasn’t Sprinkle\. Four a night, for six nights: twenty-four\. A dragon would eat SIXTY\. It’s TRUE! She eats TEN a meal\. I’ve caught every single one! Gulp\. Gulp\. Gulp\.$/, told)];
  const GULP_K = [B('TEN! (kept)', /^Twenty-four gone in six nights\. Four every night\. TEN! She always eats TEN\. I’ve caught every single one! Gulp\. Gulp\. Gulp\.$/, kept)];
  const HUSH = [B('quietly', /^Quietly\. …ten\.$/)];
  const SIXTY_K = [
    B('ten every night (the sixty, kept)', /^If SHE were the thief, she’d take ten every night\.$/, f => kept(f) && f.counts && f.counts.set === 'ch07-riffle'),
    B('two lines in the mud (kept)', /^You scratch two lines in the mud\. A short one, for twenty-four\. A long one, for sixty\.$/, kept),
    B('a SMALL supper (the kept sum)', /^Twenty-four is much, much less than sixty\. A hungry dragon would take far more\. Ten every single night, not four\. Four is a SMALL supper\.$/, f => kept(f) && f.choice),
    B('the Counts don’t lie (kept: her count)', /^The Counts don’t lie\.$/, f => kept(f) && f.card === 'my-count')
  ];
  const LIKE = [B('the Counts LIKE me?', /^Sprinkle’s eyes go round\. The Counts LIKE me\? Only FOUR a night\? I’d still be HUNGRY!$/)];
  const [KNEW_T, KNEW_K] = B2('now the NUMBERS know', /^I KNEW I didn’t do it\. But now the NUMBERS know!$/);
  const [TAIL_T, TAIL_K] = B2('her tail round you', /^She wraps her tail round you\. It’s cool and bumpy, and very, very happy\.$/);
  const PRINTS = [
    B('her prints (the print Tap)', /^When she lets go, you look down\. Beside the long drag marks from the river, her prints from the storm night are still in the mud\. Big ones, with five long claws\.$/, tap('print')),
    B('room to spare', /^Your whole paw fits inside, with room to spare\. The thief’s prints in the marsh are TINY\. Half the size of my paw\.$/),
    B('even her FEET (her prints’ card)', /^Hers are as big as Patience’s feet\. Even her FEET say she didn’t do it!$/, f => f.card === 'prints-sprinkle'),
    B('so happy I could FLY', /^I’m so happy I could FLY!$/),
    B('not yet', /^She lifts her wings\. Her good wing goes up\. Her hurt wing won’t\. Oh\. Not yet\.$/)
  ];
  const FLY_T = [B('FLY (told)', /^Tallyheart goes very still\. Tallyheart looks at you\. FLY\. The fox said the dragon FLEW out of camp\. The fox said the dragon FLEW\. There’s the hole in his story\. Now we’ve SEEN it\. I KNEW it! I knew it at the border!$/, told)];
  const FLY_K = [B('she FLEW (kept)', /^Riffle stops wiggling\. Wait\. The fox said she FLEW out of camp! I KNEW it! I knew it at the border!$/, kept)];
  const FLEWB = [B('they can’t both be true (the FLEW screen)', /^The fox says it FLEW\. Sprinkle can’t fly\. They can’t both be true\.$/, f => f.choice && same(f.sets, { ch7Flew: true }))];
  const [HOLES_T, HOLES_K] = B2('more holes than a riverbank', /^No moon, and no flying\. That story’s got more holes than a riverbank!$/);
  const GLAD_T = [B('every Clan will hear it (told)', /^And at the Gathering, every Clan will hear it\. For once, I’m GLAD I can’t fly!$/, told)];
  const GLAD_K = [B('wait till the Gathering (kept)', /^Wait till the Gathering hears THAT\. For once, I’m GLAD I can’t fly!$/, kept)];
  const COIL = [
    B('HURP (the mist Tap)', /^She’s so happy, she burps a little cloud of mist\. HURP\.$/, tap('mist')),
    B('I could have told you', /^She can’t fly\. I could have told you\. Nobody asked\. Now, QUIET, please\.$/),
    B('sorry, Coil', /^“Sorry, Coil,” everybody whispers\.$/)
  ];
  const GOOD = [
    B('how many in six nights?', /^At sunset, the Clan sits round the pile again\. Forty pieces, in four rows\. \{name\}paw\. How many in six nights\? Twenty-four\. Four every night\. Guards or no guards\.$/),
    B('a good count', /^You don’t say sixty\. Not without saying who\. Twenty-four\. A good count\. Maybe it’s a SMALL dragon\. The dragon’s case is for the Gathering\. Bring your count\. Until then, we guard\.$/)
  ];
  const DUSK_T = [B('I want to see the back (told)', /^At dusk, the first guards take their places\. The moon comes out, fatter again\. I want to see the back\.$/, told),
    B('let’s look (told, the slip round)', /^Tallyheart’s ears go up\. Let’s look\.$/, f => told(f) && tap('back')(f))];
  const DUSK_K = [B('at dusk (kept)', /^At dusk, the first guards take their places\. The moon comes out, fatter again\.$/, kept),
    B('nobody is looking at you (kept, the slip round)', /^The guards are still settling in, round the front, close enough to call\. Nobody is looking at you\. Your paws go silent\. Not one guard looks round\.$/, f => kept(f) && tap('back')(f))];
  const UNDER_RE = 'Behind the back row is the dug earth\\. You’ve seen it every morning\\. Tonight, you look closer\\. It goes in UNDER the roots\\. Always the back\\. Why\\? Then you remember Coil, in the stones: “Small diggers come and go\\. Under your Clan’s pile\\.” UNDER!';
  const ROOTS_T = [B('a snake’s secret (told, the roots)', new RegExp('^Your paws go silent\\. Not one guard looks round\\. ' + UNDER_RE + ' A snake’s secret\\.$'), f => told(f) && tap('roots')(f))];
  const ROOTS_K = [B('UNDER! (kept, the roots)', new RegExp('^' + UNDER_RE + '$'), f => kept(f) && tap('roots')(f))];
  const MOUTHB = [
    B('the mouth of a tunnel', /^Under the roots, in the dug earth, is a round, dark hole\. It goes down, and in, under the pile\. It’s the mouth of a tunnel\.$/),
    B('much too small for a dragon (the tunnel’s card)', /^It’s much too small for a dragon\. Just right for somebody with TINY feet\. A small cat could just squeeze in, you think\. A small cat like you\. At least it isn’t wet\. You want to tell EVERYBODY\. You whisper instead\. Nothing shines in there\. Only earth, and roots\.$/, f => f.card === 'tunnel')
  ];
  const WHY_T = [B('so THAT’S why (told: her whisper, a panel of its own)', /^So THAT’S why it’s always the back\. The guards watch the pile\. The thief comes up from UNDER it\.$/, f => told(f) && !f.choice),
    B('I SAT here (told, the tunnel choice)', /^And I SAT here\. Right beside it!$/, f => told(f) && f.choice)];
  const WHY_K = [B('so THAT’S why (kept, the tunnel choice)', /^So THAT’S why it’s always the back\. The guards watch the pile\. The thief comes up from UNDER it\.$/, f => kept(f) && f.choice)];
  const out = (k, i) => (f, id) => id === frames[TUNNEL[k]].choice.options[i].next;
  const SNIFF_T = [B('earth, and mice (sniff, told)', /^Earth\. And, very faintly, mice\.$/, out(0, 0))], LISTEN_T = [B('not a sound (listen, told)', /^Not a sound\. Whoever dug it isn’t here\.$/, out(0, 1))];
  const SNIFF_K = [B('earth, and mice (sniff, kept)', /^Earth\. And, very faintly, mice\.$/, out(1, 0))], LISTEN_K = [B('not a sound (listen, kept)', /^Not a sound\. Whoever dug it isn’t here\.$/, out(1, 1))];
  const CLIMB = [B('the tracks (a climber)', /^You climb the bramble arch for a look\. Far off, past the towers, the train tracks shine in the last light\. The tiny prints ran that way\.$/, f => same(f.when, { specialty: 'climbing' }))];
  const NIGHT_T = [B('not tonight (told)', /^Do we wait here and pounce\? Not tonight\. If we pounce here, we’ll never find where our prey GOES\. Tomorrow night, you and I find out where it comes out\.$/, told),
    B('not a word (told)', /^Not a word to the Clan yet\. A hole isn’t a thief\. Not yet\.$/, told)];
  const NIGHT_K = [B('not without Riffle (kept)', /^You don’t follow it\. Not tonight\. Not without Riffle\. You nearly call Tallyheart\. But she’d ask what ELSE you know\. And then it would all come out: Coil\. The bridge\. Sprinkle\.$/, kept),
    B('your secret just got bigger (kept)', /^Your secret just got bigger\. Now it goes all the way under the pile\. Tomorrow, you’ll tell Riffle\. He heard Coil too\.$/, kept)];
  const BED = [
    B('skritch, skritch', /^In your nest: Waffles’ curl of bark goes along the mossy edge\. Three more curls go under the moss\. Riffle’s stone is by your nose\. Riffle’s stone is under your chin\. skritch, skritch\.$/),
    B('seven claw marks', /^Seven claw marks on the tree\. Two witnesses: no moon\. One fox who LIED\. And under the pile, a tunnel\.$/),
    B('do the paw thing', /^\{name\}paw\? Do the paw thing\. It’s whiskers tonight\. Hold still\.$/),
    B('puffed cheeks (the bedtime faces)', /^He puffs out his cheeks\. You puff out yours\.$/, f => f.skip && f.skip.groups === 4),
    B('TWENTY-FOUR?', /^TWENTY-FOUR\? Between us\? I never knew we had so MANY\.$/),
    B('soon he’s snoring', /^Soon he’s snoring\. Somewhere, that tunnel comes out\. Where\?$/),
    B('tomorrow night', /^Tomorrow night, you and Tallyheart will find out\. Tomorrow night, you and Riffle will find out\. You curl up tight, warm and safe, and sleep\.$/),
    B('the dream', /^What did \{name\}paw dream, the night the Counts didn’t lie\?$/, f => f.input && f.input.kind === 'dream'),
    B('the end', /End of Chapter Seven\.$/, f => f.end)
  ];
  const ALL = [WAKE, SOFT, WET, WITNESS, COUNT, WHISKERS, FOOLED, SUM_T, SUM_K, WARM, BACK_K, ARRIVE_T, ARRIVE_K, GULP_T, GULP_K, HUSH, SIXTY_K, LIKE, KNEW_T, KNEW_K, TAIL_T, TAIL_K, PRINTS,
    FLY_T, FLY_K, FLEWB, HOLES_T, HOLES_K, GLAD_T, GLAD_K, COIL, GOOD, DUSK_T, DUSK_K, ROOTS_T, ROOTS_K, MOUTHB, WHY_T, WHY_K, SNIFF_T, LISTEN_T, SNIFF_K, LISTEN_K, CLIMB, NIGHT_T, NIGHT_K, BED].flat();
  // every beat is in the chapter once, and every frame of the chapter is one beat
  ALL.forEach(([label, pred]) => assert.equal(ids.filter(pred).length, 1, label + ': ' + ids.filter(pred).join(' ')));
  ids.forEach(id => assert.equal(ALL.filter(b => b[1](id)).length, 1, id + ' is one beat: ' + ALL.filter(b => b[1](id)).map(b => b[0]).join(' | ') + ' (' + T(id) + ')'));
  // her day, panel by panel: what a cat of this kind reads on this route with these light choices
  function day(c, light) {
    const P = (a, b) => (c.flags.ch3Told ? a : b);
    return [].concat(WAKE, light ? WET : SOFT, WITNESS, COUNT, WHISKERS, FOOLED, P(SUM_T, SUM_K), WARM, P([], BACK_K), P(ARRIVE_T, ARRIVE_K), P(GULP_T, GULP_K), HUSH, P([], SIXTY_K), LIKE,
      P(KNEW_T, KNEW_K), P(TAIL_T, TAIL_K), PRINTS, P(FLY_T, FLY_K), FLEWB, P(HOLES_T, HOLES_K), P(GLAD_T, GLAD_K), COIL, GOOD, P(DUSK_T, DUSK_K), P(ROOTS_T, ROOTS_K), MOUTHB, P(WHY_T, WHY_K),
      P(light ? LISTEN_T : SNIFF_T, light ? LISTEN_K : SNIFF_K), c.flags.specialty === 'climbing' ? CLIMB : [], P(NIGHT_T, NIGHT_K), BED);
  }
  for (const c of COMBOS) for (const light of [0, 1]) {
    const p = walk(c.flags, { light }), want = day(c, light), name = comboName(c) + ' light ' + light;
    for (let i = 0; i < Math.max(p.length, want.length); i++) {
      assert.ok(p[i] && want[i], name + ': ' + (p[i] ? 'an extra panel, ' + p[i] + ' (' + T(p[i]) + ')' : 'her day stops short of “' + want[i][0] + '”'));
      assert.ok(want[i][1](p[i]), name + ': panel ' + (i + 1) + ' is ' + p[i] + ' (' + T(p[i]).slice(0, 60) + '…), and should be “' + want[i][0] + '”');
    }
    // the flags as her day left them: `ch7Flew` for good, and nothing else set
    assert.equal(p.flags.ch7Flew, true, name);
    assert.deepEqual(Object.keys(p.flags).sort(), Object.keys(c.flags).concat(c.before ? [] : ['ch7Flew']).sort(), name + ': no other flag');
  }
});

/* ------------------------------------------------------------------ every `when` */

test('every `when`, on every combination: each reader reads her own lines and nobody else’s', () => {
  for (const c of COMBOS) for (const clean of (COMBOS.indexOf(c) % 5 ? [true] : [true, false])) {
    const f = c.flags, name = comboName(c);
    const rows = walkLines(f, { clean }), lines = rows.map(r => r.lines.join(' ')).join('\n');
    const reads = (re, want, what) => assert.equal(re.test(lines), !!want, name + ': ' + what);
    const told = f.ch3Told, noticing = f.specialty === 'noticing';
    // told or kept: the sum, the bridge, round the back, tomorrow night
    reads(/I know one who eats ten fish a meal\./, told, 'Tallyheart’s dragon');
    reads(/Tallyheart draws two lines in the sand\./, told, 'her lines in the sand');
    reads(/For a DRAGON\./, !told, 'Tallyheart half-knows');
    reads(/You KNOW a dragon who eats ten fish a meal!/, !told, 'her thought');
    reads(/Back by sunset\. And if you come back smelling of fish again, wash first\./, !told, 'back by sunset');
    reads(/Your ears go hot\./, !told, 'hot ears');
    reads(/Tallyheart takes you straight to the Old Bridge\./, told, 'straight to the bridge');
    reads(/you check the bank first\. No ginger ears\./, !told, 'the bank');
    reads(/Tell them\./, told, 'tell them');
    reads(/If SHE were the thief, she’d take ten every night\./, !told, 'Riffle’s sixty');
    reads(/You scratch two lines in the mud\./, !told, 'her lines in the mud');
    assert.equal((lines.match(/A warrior who knows \{their\} Counts can’t be fooled\./g) || []).length, 1, name + ': the warm line, once, on both paths');
    assert.equal((lines.match(/The Counts don’t lie\./g) || []).length, 1, name + ': “The Counts don’t lie.” once a path');
    reads(/Riffle stops wiggling\./, !told, 'Riffle says FLY');
    reads(/And at the Gathering, every Clan will hear it\./, told, 'every Clan will hear it');
    reads(/Wait till the Gathering hears THAT\./, !told, 'wait till the Gathering');
    reads(/I want to see the back\./, told, 'she leads Tallyheart round');
    reads(/Nobody is looking at you\./, !told, 'alone, guards in call');
    reads(/A snake’s secret\./, told, 'a snake’s secret');
    reads(/And I SAT here\. Right beside it!/, told, 'she sat right beside it');
    reads(/Tomorrow night, you and I find out where it comes out\./, told, 'the night trail is Tallyheart’s');
    reads(/A hole isn’t a thief\. Not yet\./, told, 'not a word to the Clan');
    reads(/Not without Riffle\./, !told, 'not without Riffle');
    reads(/Tomorrow, you’ll tell Riffle\. He heard Coil too\./, !told, 'she will tell Riffle');
    reads(/Tomorrow night, you and Tallyheart will find out\./, told, 'tomorrow night, Tallyheart');
    reads(/Tomorrow night, you and Riffle will find out\./, !told, 'tomorrow night, Riffle');
    // FLY: by path and specialty; “I KNEW it!” only for a noticing cat who caught FLEW at the border
    reads(/Tallyheart goes very still\./, told && !noticing, 'still');
    reads(/Tallyheart looks at you\./, told && noticing, 'she looks at you');
    reads(/FLY\. The fox said the dragon FLEW out of camp\./, told && !noticing, 'FLY');
    reads(/There’s the hole in his story\. Now we’ve SEEN it\./, told && noticing, 'the hole in his story');
    reads(/I KNEW it! I knew it at the border!/, noticing && f.ch4CaughtFly, 'I KNEW it');
    reads(/The fox says it FLEW\. Sprinkle can’t fly\./, true, 'FLEW, for everyone');
    // the lesson: a cat who needed no help says she knew most of it
    reads(/And I knew most of it already\.\s*Now you know all of it\./, clean, 'now you know all of it');
    reads(/Some were tricky\.\s*Tricky\. And you worked out every one\./, !clean, 'tricky');
    // the specialties: noticing at the dug earth, the rest by Coil's “Under”; sneaking's silent paws once;
    // climbing's tracks
    reads(/Behind the back row is the dug earth\./, noticing, 'the dug earth');
    reads(/Then you remember Coil, in the stones:/, !noticing, 'Coil’s Under');
    assert.equal((lines.match(/Your paws go silent\. Not one guard looks round\./g) || []).length, f.specialty === 'sneaking' ? 1 : 0, name + ': silent paws, once');
    reads(/the train tracks shine in the last light/, f.specialty === 'climbing', 'the tracks');
    // each worry once, at the tunnel's mouth
    reads(/A small cat could just squeeze in, you think\. A small cat like you\./, f.worry === 'small', 'small');
    reads(/At least it isn’t wet\./, f.worry === 'water', 'water');
    reads(/You want to tell EVERYBODY\. You whisper instead\./, f.worry === 'talk', 'talk');
    reads(/Nothing shines in there\. Only earth, and roots\./, f.worry === 'shiny', 'shiny');
    // her stone
    reads(/Riffle’s stone is by your nose\./, f.ch2Stone === 'nose', 'by her nose');
    reads(/Riffle’s stone is under your chin\./, f.ch2Stone === 'chin', 'under her chin');
    // nobody says sixty to Glintstar, and nobody names a dragonet she may not have met
    assert.doesNotMatch(lines, /\b(Squall|Puddle|Wisp|Sleet)\b/, name);
  }
  // each specialty's and each worry's lines are where the story puts them
  const where = (k, v) => ids.filter(id => (frames[id].when && frames[id].when[k] === v) || texts(frames[id]).some(x => x.when && x.when[k] === v));
  assert.deepEqual(where('specialty', 'noticing'), [F(/^Tallyheart goes very still\./), F(/^Riffle stops wiggling\./)].concat(F2(/Behind the back row is the dug earth\./)).sort());
  assert.deepEqual(where('specialty', 'sneaking'), [F(/^The guards are still settling in,/), F(/^Your paws go silent\..*A snake’s secret\.$/)].sort());
  assert.deepEqual(where('specialty', 'climbing'), [F(/^You climb the bramble arch/)]);
  ['swimming', 'friends'].forEach(v => assert.deepEqual(where('specialty', v), [], v));
  ['small', 'water', 'talk', 'shiny'].forEach(v => assert.deepEqual(where('worry', v), [F(/^It’s much too small for a dragon\./)], v + ': one line, at the mouth'));
  // ch4CaughtFly read once, with noticing, by the two FLY panels' “I KNEW it!”; flags this chapter doesn't read
  const readers = k => ids.filter(id => [frames[id].when].concat(texts(frames[id]).map(x => x.when)).filter(Boolean).some(w => k in w || (w.not && k in w.not)));
  assert.deepEqual(readers('ch4CaughtFly'), [F(/^Tallyheart goes very still\./), F(/^Riffle stops wiggling\./)]);
  ids.forEach(id => texts(frames[id]).filter(x => x.when && 'ch4CaughtFly' in x.when).forEach(x => assert.deepEqual(x.when, CAUGHT, id)));
  ['foundSquall', 'foundPuddle', 'foundWisp', 'foundSleet', 'ch2Path', 'ch2SaidAloud', 'stepOut', 'spokeUp', 'joinReason', 'ch5First', 'ch5Roof', 'ch7Flew'].forEach(k => assert.deepEqual(readers(k), [], k + ' is not read'));
  assert.deepEqual(readers('lessonClean'), [SEVENTH]);
});

/* ------------------------------------------------------------------ Counts */

function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }
const pairs = d => d.facts.map(f => { const q = factAB(f); return q.a + 'x' + q.b; });
const TH = text => ({ who: 'tallyheart', text });
const QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
const HOP = 'Close. Let’s hop it together.', FAR = 'Let’s hop it together.';
const MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';

test('counts: every set exactly as the spec has it (section 2)', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), SETS);
  const PATROLS = { table: 3, thing: 'cat', things: 'cats', unit: 'patrol', units: 'patrols', teacher: 'tallyheart', ask: '{a} × {b}' };
  const CHEEKS = { table: 6, thing: 'whisker', things: 'whiskers', unit: 'cheek', units: 'cheeks', teacher: 'tallyheart', ask: '{a} × {b}', picture: { kind: 'cheeks' } };
  const NIGHTS = { thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', ask: '{a} × {b}' };
  const way = text => ({ miss: text + ' ' + MISS, missLast: text });
  const TOP = { kind: 'cheeks-top' };
  const ONE_CAT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }];
  assert.deepEqual(C['ch07-pile'], {
    table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
    picture: { kind: 'prey', layout: 'rows' },
    facts: [{ a: 3, b: 10, light: 'rows', check: true, prompt: [{ kind: 'caption', text: 'Three front rows of ten. How many pieces?' }], retryPrompt: true }],
    ask: '{a} × {b}', praise: [], ground: 'earth',
    helpIntro: 'Let’s scratch it out: ten marks for every row.',
    helpIntroNotTen: 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.',
    fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', avoid: [[4, 10], [5, 10]], fillIntro: 'An easy one.',
    miss: MISS, missLast: LAST, again: ['There it is. You remembered that one.'], done: null
  });
  ['helpIntro', 'helpIntroNotTen', 'fillFrom', 'avoid', 'again'].forEach(k => assert.deepEqual(C['ch07-pile'][k], ch06.counts['ch06-pile'][k], 'chapter 6’s pile ' + k));
  assert.deepEqual(C['ch07-threes'], Object.assign({}, PATROLS, {
    facts: [[7, 3], { a: 4, b: 3, right: [TH('Twelve! Hold on to that.')], rightAgain: true }],
    warmHard: { table: 3, at: 0, avoid: [[1, 3], [3, 2], [3, 9], [3, 10], [3, 4]] }, avoid: [[3, 4]],
    fillFrom: 'ch06-threes', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
    praise: ['Hop, hop, hop!', 'Three more, every time!', 'You hopped it!'],
    fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
    helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST,
    remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
    rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
  }));
  ['praise', 'fast', 'fastAfterMiss'].forEach(k => assert.deepEqual(C['ch07-threes'][k], ch06.counts['ch06-threes'][k], 'chapter 6’s threes ' + k));
  assert.deepEqual(C['ch07-sixes'], Object.assign({}, CHEEKS, {
    label: 'Whiskers', hollowThings: 'sixes', fillOrder: 'easiest', prompt: 'How many whiskers?',
    facts: [
      { a: 2, b: 6, who: ONE_CAT, prompt: 'Two cheeks? That’s one whole cat.', retryPrompt: true, right: [TH('Twelve! Six and six.')], rightAgain: true },
      { a: 5, b: 6, right: [TH('Thirty! You hopped that one already.')], rightAgain: true },
      Object.assign({ a: 6, b: 6, lit: 30, prompt: 'Six cheeks. Five cheeks made thirty. One more cheek: six more.', retryPrompt: true,
        right: [TH('Thirty-six! That’s a new one.')], rightAgain: true }, way('Five cheeks made thirty. Six more: thirty-six.')),
      Object.assign({ a: 6, b: 3, picture: TOP, prompt: 'Three cheeks. Three threes on top: nine. Three threes below: nine more.', retryPrompt: true,
        right: [TH('Eighteen, like the guards! Nine and nine. That’s doubling.')], rightAgain: true }, way('Nine and nine: eighteen.')),
      Object.assign({ a: 6, b: 4, picture: TOP, prompt: 'Four cheeks. Four threes on top: twelve, like your warm-up. Four threes below: twelve more.', retryPrompt: true,
        right: [TH('Twenty-four! You doubled the threes.')], rightAgain: true }, way('Twelve and twelve: twenty-four.')),
      Object.assign({ a: 6, b: 7, picture: TOP, prompt: 'Seven cheeks. Seven threes on top: twenty-one. Twenty-one below, too. Twenty-one and twenty-one: twenty and twenty, then one and one.', retryPrompt: true,
        right: [TH('Forty-two! You doubled twenty-one.')], rightAgain: true }, way('Twenty and twenty make forty. One and one make two. Forty-two.')),
      Object.assign({ a: 6, b: 8, picture: TOP, prompt: 'Eight cheeks. Eight threes on top: twenty-four. Twenty-four below, too. Twenty-four and twenty-four: twenty and twenty, then four and four.', retryPrompt: true,
        right: [TH('Forty-eight! The hardest one, and you did it.')], rightAgain: true }, way('Twenty and twenty make forty. Four and four make eight. Forty-eight.')),
      { a: 4, b: 6, prompt: 'Four cheeks? You did that one, turned round.', retryPrompt: true, right: [TH('Twenty-four! Same fact.')], rightAgain: true },
      { a: 7, b: 6, prompt: 'Seven cheeks? You did that one the other way round.', retryPrompt: true, right: [TH('Forty-two! Same fact.')], rightAgain: true },
      { a: 8, b: 6, check: true, right: [TH('Forty-eight! Same fact.')], rightAgain: true }
    ],
    praise: ['Two threes make a six!', 'Six more, every time!', 'Three and three, every cheek!'],
    fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
    helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST, done: 'That’s the sixes.'
  }));
  assert.deepEqual(C['ch07-gone'], Object.assign({}, NIGHTS, {
    table: 6, teacher: 'tallyheart', picture: { kind: 'marks' },
    facts: [Object.assign({ a: 4, b: 6, table: 4, prompt: [{ kind: 'caption', text: 'Four gone a night, for six nights. How many gone?' }], retryPrompt: true,
      right: [TH('Twenty-four! Four every night, for six nights. You just did that one with the whiskers!')], rightAgain: true },
    way('Three nights make twelve. Six nights is twice that. Twelve and twelve: twenty-four.'))],
    help: 'picture', helpIntro: HOP, helpIntroFar: FAR,
    fillFrom: 'ch07-sixes', fillOrder: 'easiest', fillVoice: 'borrower', fillIntro: 'An easy one.', avoid: [[6, 6]],
    praise: [], miss: MISS, missLast: LAST, done: null
  }));
  assert.deepEqual(C['ch07-dragon'], Object.assign({}, NIGHTS, {
    table: 10, teacher: 'tallyheart', picture: { kind: 'marks' },
    facts: [{ a: 10, b: 6, prompt: [{ kind: 'caption', text: 'Ten a night, for six nights. How many would a dragon take?' }], retryPrompt: true, right: [TH('Sixty! Ten a night adds up fast.')], rightAgain: true }],
    help: 'picture', helpIntro: HOP, helpIntroFar: FAR,
    fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
    praise: [], miss: 'Tens land on a zero. ' + MISS, missLast: 'Tens land on a zero.', done: null
  }));
  assert.deepEqual(C['ch07-riffle'], Object.assign({}, NIGHTS, {
    table: 10, teacher: 'riffle', picture: { kind: 'marks', ground: 'mud' },
    facts: [{ a: 10, b: 6, prompt: [{ who: 'riffle', kind: 'whisper', text: 'Six nights. How many would she take?' }], retryPrompt: true,
      right: [{ who: 'riffle', kind: 'shout', text: 'SIXTY!' }, { who: 'riffle', kind: 'whisper', text: '…sixty.' }], rightAgain: true }],
    help: 'picture', helpIntro: 'Hop by tens! Ten, twenty…', helpIntroFar: 'Hop by tens! Ten, twenty…',
    fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
    praise: [], miss: MISS, missLast: LAST, done: null
  }));
  // every fact: arithmetic, in its Count (the twenty-four's own table 4 says so), no duplicates in a set
  Object.keys(C).forEach(sid => {
    const d = C[sid], keys = new Set();
    d.facts.forEach(f => {
      const q = factAB(f), tb = (f && f.table) || d.table;
      assert.ok(q.a === tb || q.b === tb, sid + ': ' + q.a + '×' + q.b + ' belongs to the ' + tb + 's');
      assert.ok(!keys.has(q.a + 'x' + q.b), sid);
      keys.add(q.a + 'x' + q.b);
    });
  });
  // the lesson kit: seven new facts, at least six of them 6 × 4, 6 × 6, 6 × 7, 6 × 8 in either order; three
  // known stepping stones (2 × 6, 5 × 6, 6 × 3); both orders; twins three places apart
  const ten = pairs(C['ch07-sixes']);
  assert.deepEqual(ten, ['2x6', '5x6', '6x6', '6x3', '6x4', '6x7', '6x8', '4x6', '7x6', '8x6']);
  const key = k => k.split('x').map(Number).sort((a, b) => a - b).join('x');
  assert.equal(ten.filter(k => ['4x6', '6x6', '6x7', '6x8'].includes(key(k))).length, 7, 'seven of the ten are the new facts');
  [['6x4', '4x6'], ['6x7', '7x6'], ['6x8', '8x6']].forEach(([a, b]) => assert.equal(ten.indexOf(b) - ten.indexOf(a), 3, a + ' and ' + b + ' three apart'));
  // the sum after the lesson, never before it: 4 × 6 and 10 × 6 are the story questions, typed after the sixes
  assert.deepEqual([pairs(C['ch07-gone']), pairs(C['ch07-dragon']), pairs(C['ch07-riffle'])], [['4x6'], ['10x6'], ['10x6']]);
  assert.ok(at(countsAt('ch07-gone')[0]) > at(countsAt('ch07-sixes')[0]));
  // 15 typed answers on every path: the pile, two warm-up, the ten sixes, 4 × 6, one 10 × 6
  const typed = ['ch07-pile', 'ch07-threes', 'ch07-sixes', 'ch07-gone', 'ch07-dragon'].reduce((m, sid) => m + C[sid].facts.length, 0);
  assert.equal(typed, 15);
  t.diagnostic('15 typed answers on every path with no misses');
  // the Counts frames, each with the lines its own page carries
  const cf = ids.filter(id => frames[id].counts);
  assert.deepEqual(cf.map(id => [frames[id].counts.set, (frames[id].caption || []).length, (frames[id].say || []).length]),
    [['ch07-pile', 1, 1], ['ch07-threes', 1, 1], ['ch07-sixes', 0, 1], ['ch07-gone', 1, 0], ['ch07-dragon', 1, 1], ['ch07-riffle', 0, 1]]);
  assert.deepEqual(frames[countsAt('ch07-riffle')[0]].say, [{ who: 'riffle', text: 'If SHE were the thief, she’d take ten every night.', kind: 'whisper' }]);
});

test('counts: lines are short, whole sentences, and fit both sexes; nobody but the set’s own voices speaks in it', () => {
  const VOICES = { 'ch07-pile': [], 'ch07-threes': ['tallyheart'], 'ch07-sixes': ['tallyheart'], 'ch07-gone': ['tallyheart'], 'ch07-dragon': ['tallyheart'], 'ch07-riffle': ['riffle'] };
  countsLines().forEach(x => {
    assert.ok(typeof x.text === 'string' && x.text.trim(), x.set + ' ' + x.where);
    assert.ok(words(x.text) <= (/^helpIntro|prompt|miss/.test(x.where) ? 22 : 18), x.set + ' ' + x.where + ': short: ' + x.text);
    if (x.who) assert.ok(VOICES[x.set].includes(x.who), x.set + ' ' + x.where + ': ' + x.who);
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.set + ' ' + x.where + ': ' + x.text));
  });
  Object.keys(VOICES).forEach(sid => {
    const said = new Set(countsLines().filter(x => x.set === sid && x.who).map(x => x.who));
    assert.deepEqual([...said].sort(), VOICES[sid].slice().sort(), sid);
    countsAt(sid).forEach(id => [...said].concat([story.counts[sid].teacher]).forEach(who => assert.ok(castOf(id, who).length, id + ': ' + who + ' speaks in ' + sid + ', so is in the picture')));
  });
  // nobody praises speed but in the warm-up and the lesson; no praise line names a total
  ['ch07-threes', 'ch07-sixes'].forEach(sid => [].concat(story.counts[sid].praise, story.counts[sid].fast, story.counts[sid].fastAfterMiss).forEach(l => assert.doesNotMatch(l, /\d|twelve|eighteen|twenty|thirty|forty|fifty|sixty/i, sid + ': ' + l)));
});

/* A cat who has read chapters 1 to 6, with these answers and times in chapter 6's threes (as `before7`):
 * what the warm-up finds hard. */
function threesCat(threes, ms) {
  const cat = E.blankCat({ now: 1, id: 'c7' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5, ch06: 6 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Stone: 'nose', ch3Told: true });
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  play(cat, 'ch04-tens');
  play(cat, 'ch05-nines');
  play(cat, 'ch06-threes', threes, ms);
  return cat;
}
const DEFAULTS = ['Here’s that one again.', 'There. We’ll come back to that one.', 'There. Now you’ve seen it counted.', 'There it is. You remembered that one.', 'Yes! That one came back, and you knew it.', 'Let’s scratch it out together.', 'Yes!', 'Good work.'];
const saidIn = rows => rows.reduce((a, x) => a.concat(x.prompt.map(p => p.text), x.line, x.balloons.map(b => b.text), x.help ? [x.help.intro, x.help.line] : []), []).filter(Boolean);

test('the pile and the warm-up, the build notes’ tests: three front rows lit a row at a time; the pile borrows its own rows; the warm-up’s hard three first, 7 × 3 when nothing was hard, never 1 × 3, 3 × 2, 3 × 9, 3 × 10 or 3 × 4 even when slow; a chapter-6 miss of 3 × 8 opens on 3 × 8 with “Yesterday…”', () => {
  // the pile: read under its caption, no right line; a miss is scratched in the earth a row at a time
  const clean = play(threesCat(), 'ch07-pile');
  assert.deepEqual(clean.map(x => [x.k, x.q.answer, x.q.light, x.line, x.balloons.length]), [['3x10', 30, 'rows', '', 0]]);
  assert.deepEqual(clean[0].prompt.map(p => [p.kind, p.label, p.text]), [['caption', null, 'Three front rows of ten. How many pieces?']]);
  assert.deepEqual(clean[0].light.map(s => s.picture.highlight), [10, 20, 30], 'lit a row at a time, with no number shown');
  assert.equal(clean[0].picture.kind, 'prey');
  const missed = play(threesCat(), 'ch07-pile', { '3x10': [13, 40] });
  assert.deepEqual(ks(missed), ['3x10✗', 'F:1x10', 'F:10x2', 'R:3x10✗', 'F:1x10', 'F:10x2', 'R:3x10']);
  assert.deepEqual([missed[0].help.intro, missed[0].help.ground, missed[0].help.nums, missed[3].help.intro], ['Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.', 'earth', [10, 20, 30], 'Let’s scratch it out: ten marks for every row.']);
  assert.deepEqual(missed.slice(1, 3).map(x => [x.prompt.map(p => p.text).join(' '), x.picture.kind, x.picture.groups]), [['An easy one. One row of ten. How many pieces?', 'prey', 1], ['An easy one. Two rows of ten. How many pieces?', 'prey', 2]], 'asked on the pile’s own rows');
  assert.deepEqual(missed[6].prompt.map(p => p.text), ['Here’s that one again.', 'Three front rows of ten. How many pieces?']);
  assert.equal(missed[6].line, 'There it is. You remembered that one.');
  // whatever she misses, the pile never shows four or five full rows
  for (let seed = 1; seed <= 40; seed++) {
    let x = (seed * 2654435761) >>> 0;
    const rnd = () => ((x = (Math.imul(x, 1103515245) + 12345) >>> 0) / 4294967296);
    const c2 = threesCat(), { def: d, state: st } = E.chapterLesson(c2, story, 'ch07-pile', 1, STORIES);
    for (let q; (q = E.counts.question(st));) {
      if (q.filler) assert.ok(!['4x10', '5x10'].includes(pairKey(q.a + 'x' + q.b)), 'seed ' + seed + ': ' + q.a + '×' + q.b);
      E.logAnswer(c2, E.counts.answer(st, E.questionDef(d, q, story, STORIES), rnd() < 0.5 ? q.answer + 1 : q.answer, 1500, 1).entry);
    }
  }
  // the warm-up's hard pick
  const def = story.counts['ch07-threes'];
  const facts = cat => E.lessonFacts(cat, Object.assign({ id: 'ch07-threes' }, def), STORIES).map(x => (Array.isArray(x) ? x.join('x') : x.a + 'x' + x.b + (x.hard ? ' hard' : '')));
  assert.deepEqual(facts(threesCat()), ['7x3', '4x3'], 'nothing was hard yesterday: 7 × 3 (its twenty-one is the half 6 × 7 doubles)');
  assert.deepEqual(facts(threesCat({ '3x8': [21] }, { all: 1500 })), ['3x8 hard', '4x3'], 'a chapter-6 miss of 3 × 8 (8 × 3 a check, right and quick)');
  assert.deepEqual(facts(threesCat(null, { '3x5': 9000, all: 1500 })), ['3x5 hard', '4x3'], 'a slow 3 × 5');
  for (const k of ['1x3', '3x2', '3x4']) assert.deepEqual(facts(threesCat(null, { [k]: 9000, all: 1500 })), ['7x3', '4x3'], k + ' slow: never picked');
  for (const k of ['1x3', '3x2', '3x4', '3x7']) {
    const c = threesCat({ [k]: [k === '3x7' ? 20 : 1] }, { all: 1500 });
    assert.deepEqual(facts(c), k === '3x7' ? ['3x7 hard', '4x3'] : ['7x3', '4x3'], k + ' missed');
  }
  // chapter 6's 3 × 9 (chapter 5's) and 3 × 10 (chapter 4's) are other days' timed answers: never picked
  const older = threesCat(null, { all: 1500 });
  play(older, 'ch05-nines', null, { '3x9': 9000, '9x3': 9000, all: 1500 });
  play(older, 'ch04-tens', null, { '10x3': 9000, '3x10': 9000, all: 1500 });
  assert.deepEqual(facts(older), ['7x3', '4x3']);
  // the engine words both questions (4 × 3's are the story's own, “Four patrols. How many cats?”)
  const quick = play(threesCat({ '3x8': [21] }, { all: 1500 }), 'ch07-threes', null, { all: 1500 });
  assert.deepEqual(quick.map(x => [x.k, x.prompt.map(p => p.label + ': ' + p.text).join(' ')]), [['3x8', 'Tallyheart: Eight patrols. How many cats?'], ['4x3', 'Tallyheart: Four patrols. How many cats?']]);
  assert.deepEqual([quick[0].kind, quick[0].line, quick[1].balloons.map(b => b.text)], ['remembered', 'Yesterday, 3 × 8 made you stop and think. Not today!', ['Twelve! Hold on to that.']]);
  const slow = play(threesCat(null, { '3x5': 9000, all: 1500 }), 'ch07-threes', null, { all: 9000 });
  assert.deepEqual([slow[0].k, slow[0].kind, slow[0].line], ['3x5', 'rememberedSlow', '3 × 5 again, and you got it. It’s getting easier.']);
  const plain = play(threesCat(), 'ch07-threes', null, { all: 1500 });
  assert.deepEqual([plain[0].prompt.map(p => p.text).join(' '), plain[0].line], ['Seven patrols. How many cats?', 'Quick as a pounce!']);
  // a miss: the sand, hopped by threes; easy threes lent from yesterday's lesson, in its patrols
  const miss1 = play(threesCat(), 'ch07-threes', { '7x3': [20] });
  assert.deepEqual(ks(miss1), ['7x3✗', '4x3', 'F:1x3', 'R:7x3']);
  assert.deepEqual([miss1[0].help.intro, miss1[0].help.nums, miss1[0].help.ground, miss1[2].prompt.map(p => p.text).join(' ')], [HOP, [3, 6, 9, 12, 15, 18, 21], 'sand', 'One from yesterday. One patrol. How many cats?']);
  const miss2 = play(threesCat(), 'ch07-threes', { '4x3': [11] });
  assert.deepEqual(ks(miss2), ['7x3', '4x3✗', 'F:1x3', 'F:3x2', 'R:4x3']);
  assert.deepEqual([miss2[3].prompt.map(p => p.text).join(' '), miss2[4].balloons.map(b => b.text)], ['One from yesterday. Two patrols. How many cats?', ['Twelve! Hold on to that.']]);
  // none of the frame's own lines is said again over the first question, so its clock is the fact's
  assert.equal(E.readFirst({ set: 'ch07-threes', a: 7, b: 3 }, STORIES, null, true), false, 'the opener is timed on itself');
  assert.equal(E.readFirst({ set: 'ch07-threes', a: 4, b: 3 }, STORIES, null, false), false, '4 × 3 is asked in the engine’s words: timed too');
});

test('the lesson, the build notes’ tests: ten facts in the story’s order; that many cheeks, the doubling ones with their top rows lit, 6 × 6 with five cheeks lit, 2 × 6 one cat’s face; every miss hops by sixes from the first cheek and comes back two questions later, before its twin; a missed 6 × 8 survives a quick 8 × 6', () => {
  const rows = play(threesCat(), 'ch07-sixes', null, { all: 6000 });
  assert.deepEqual(ks(rows), ['2x6', '5x6', '6x6', '6x3', '6x4', '6x7', '6x8', '4x6', '7x6', '8x6']);
  assert.deepEqual(rows.map(x => x.q.answer), [12, 30, 36, 18, 24, 42, 48, 24, 42, 48]);
  assert.deepEqual(rows.map(x => [x.picture.kind, x.picture.groups, x.picture.highlight]), [['cheeks', 2, 0], ['cheeks', 5, 0], ['cheeks', 6, 30], ['cheeks-top', 3, 0], ['cheeks-top', 4, 0], ['cheeks-top', 7, 0],
    ['cheeks-top', 8, 0], ['cheeks', 4, 0], ['cheeks', 7, 0], ['cheeks', 8, 0]], 'that many cheeks; the doubling ones with every top row lit; 6 × 6 steps off five lit cheeks');
  rows.forEach(x => assert.deepEqual([x.q.per, x.q.table, x.teacher], [6, 6, 'tallyheart'], x.k));
  assert.deepEqual(rows[0].picture.who, [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }], '2 × 6 is one whole cat: one face');
  assert.match(A.countsPicture(Object.assign({ look: {} }, rows[0].picture)), /pc-face/);
  rows.slice(1).forEach(x => assert.equal(x.picture.who, undefined, x.k + ': cheeks in the rim’s coats'));
  const ask = k => rows.find(x => x.k === k).prompt.map(p => p.label + ': ' + p.text).join(' | ');
  assert.deepEqual(['5x6', '8x6'].map(ask), ['Tallyheart: How many whiskers?', 'Tallyheart: How many whiskers?'], 'the set’s own words for the two with none');
  assert.equal(ask('2x6'), 'Tallyheart: Two cheeks? That’s one whole cat.');
  assert.equal(ask('6x4'), 'Tallyheart: Four cheeks. Four threes on top: twelve, like your warm-up. Four threes below: twelve more.');
  const said = k => rows.find(x => x.k === k).balloons.map(b => b.text).join(' | ');
  assert.deepEqual(['2x6', '5x6', '6x6', '6x3', '6x4', '6x7', '6x8', '4x6', '7x6', '8x6'].map(said), ['Twelve! Six and six.', 'Thirty! You hopped that one already.', 'Thirty-six! That’s a new one.',
    'Eighteen, like the guards! Nine and nine. That’s doubling.', 'Twenty-four! You doubled the threes.', 'Forty-two! You doubled twenty-one.', 'Forty-eight! The hardest one, and you did it.',
    'Twenty-four! Same fact.', 'Forty-two! Same fact.', 'Forty-eight! Same fact.']);
  // every single miss: the help hops by sixes from the first cheek, six marks a cheek in the sand; “Close.”
  // within one hop; a doubling or stepping question ends on its way; back two questions later, before its twin
  const WAY = { '6x6': 'Five cheeks made thirty. Six more: thirty-six.', '6x3': 'Nine and nine: eighteen.', '6x4': 'Twelve and twelve: twenty-four.',
    '6x7': 'Twenty and twenty make forty. One and one make two. Forty-two.', '6x8': 'Twenty and twenty make forty. Four and four make eight. Forty-eight.' };
  const TWIN = { '6x4': '4x6', '6x7': '7x6', '6x8': '8x6' };
  ks(rows).forEach(k => {
    const [a, b] = k.split('x').map(Number), right = a * b;
    const near = play(threesCat(), 'ch07-sixes', { [k]: [right - 6] }), far = play(threesCat(), 'ch07-sixes', { [k]: [right + 13] });
    const m = near.find(x => x.k === k + '✗');
    assert.equal(m.help.intro, HOP, k + ': within one hop');
    assert.equal(far.find(x => x.k === k + '✗').help.intro, FAR, k + ': further off');
    assert.deepEqual(m.help.nums, Array.from({ length: m.q.groups }, (_, j) => 6 * (j + 1)), k + ': hopped by sixes from the first cheek');
    assert.deepEqual([m.help.ground, m.help.per], ['sand', 6], k);
    assert.equal(m.line, WAY[k] ? WAY[k] + ' ' + MISS : MISS, k + ': its own line');
    const back = near.findIndex(x => x.k === 'R:' + k);
    if (k === '8x6') assert.ok(back > near.indexOf(m), k + ': the last fact comes back after the fillers');
    else assert.equal(back - near.indexOf(m), 3, k + ': comes back two questions later (' + ks(near).join(' ') + ')');
    assert.deepEqual([near[back].picture.kind, near[back].picture.highlight, near[back].picture.who], [m.picture.kind, m.picture.highlight, m.picture.who], k + ': its picture kept on its retry');
    if (TWIN[k]) assert.ok(back < near.findIndex(x => x.k === TWIN[k]), k + ': before ' + TWIN[k]);
  });
  // three in a row missed: R6×4, R6×7, R6×8, then the twins
  assert.deepEqual(ks(play(threesCat(), 'ch07-sixes', { '6x4': [20], '6x7': [40], '6x8': [40] })).slice(4), ['6x4✗', '6x7✗', '6x8✗', 'R:6x4', 'R:6x7', 'R:6x8', '4x6', '7x6', '8x6']);
  // a last miss: the way alone (or chapter 6's line)
  const thrice = play(threesCat(), 'ch07-sixes', { '6x4': [20, 20, 20] }).filter(x => x.k.endsWith('6x4✗'));
  assert.deepEqual(thrice.map(x => x.line), ['Twelve and twelve: twenty-four. ' + MISS, 'Twelve and twelve: twenty-four. ' + MISS, 'Twelve and twelve: twenty-four.']);
  const thrice8 = play(threesCat(), 'ch07-sixes', { '8x6': [40, 40, 40] }).filter(x => x.k.endsWith('8x6✗'));
  assert.equal(thrice8[2].line, LAST);
  // fillers near the end are her easiest right answers in the lesson, in their own cheeks
  assert.deepEqual(ks(play(threesCat(), 'ch07-sixes', { '7x6': [40] })).slice(8), ['7x6✗', '8x6', 'F:2x6', 'R:7x6']);
  const f8 = play(threesCat(), 'ch07-sixes', { '8x6': [40] });
  assert.deepEqual(ks(f8).slice(9), ['8x6✗', 'F:2x6', 'F:6x3', 'R:8x6']);
  f8.filter(x => x.q.filler).forEach(x => assert.deepEqual([x.prompt.map(p => p.text).join(' '), x.picture.kind, x.picture.who], ['How many whiskers?', 'cheeks', undefined], x.k));
  // 8 × 6 is a check: a missed 6 × 8 is still hard for chapter 8 after a quick 8 × 6; a slow lesson leaves
  // only 5 × 6 timed on itself
  const c68 = threesCat(); play(c68, 'ch07-sixes', { '6x8': [40] }, { all: 1500 });
  assert.deepEqual(E.hardFacts(c68, 6, STORIES), [[6, 8]]);
  const cslow = threesCat(); play(cslow, 'ch07-sixes', null, { all: 9000 });
  assert.deepEqual(E.hardFacts(cslow, 6, STORIES), [[5, 6]], 'every other fact is read under words or is a check');
  assert.equal(story.counts['ch07-sixes'].done, 'That’s the sixes.');
});

test('the twenty-four, the build notes’ tests: six nights of four marks; a miss lights them a night at a time, hopping by fours to 24; its fillers 2 × 6 then 6 × 3 in the cheeks, never 6 × 6; filed under the 4s; the 6s stay the lesson’s', () => {
  const c = threesCat(); play(c, 'ch07-sixes');
  const g = play(c, 'ch07-gone', { '4x6': [20, 20] });
  assert.deepEqual(ks(g), ['4x6✗', 'F:2x6', 'F:6x3', 'R:4x6✗', 'F:5x6', 'F:2x6', 'R:4x6']);
  assert.deepEqual([g[0].picture.kind, g[0].picture.groups, g[0].picture.per, g[0].picture.highlight], ['marks', 6, 4, 0], 'six nights, four marks each, unlit');
  assert.deepEqual([g[0].help.picture, g[0].help.nums, g[0].help.intro], [true, [4, 8, 12, 16, 20, 24], HOP], 'the marks already in the sand light a night at a time');
  assert.equal(g[0].line, 'Three nights make twelve. Six nights is twice that. Twelve and twelve: twenty-four. ' + MISS);
  assert.deepEqual(g.filter(x => x.q.filler).map(x => [x.k, x.prompt.map(p => p.label + ': ' + p.text).join(' '), x.picture.kind, x.teacher]), [
    ['F:2x6', 'Tallyheart: An easy one. Two cheeks. How many whiskers?', 'cheeks', 'tallyheart'], ['F:6x3', 'Tallyheart: An easy one. Three cheeks. How many whiskers?', 'cheeks', 'tallyheart'],
    ['F:5x6', 'Tallyheart: An easy one. Five cheeks. How many whiskers?', 'cheeks', 'tallyheart'], ['F:2x6', 'Tallyheart: An easy one. Two cheeks. How many whiskers?', 'cheeks', 'tallyheart']]);
  assert.ok(!g.some(x => pairKey(x.k) === '6x6'), 'thirty-six is never an easy one');
  assert.deepEqual(g[3].prompt.map(p => p.text), ['Here’s that one again.', 'Four gone a night, for six nights. How many gone?']);
  assert.deepEqual([g[6].picture.kind, g[6].picture.per, g[6].balloons.map(b => b.text)], ['marks', 4, ['Twenty-four! Four every night, for six nights. You just did that one with the whiskers!']], 'the six nights come back, and the right line is the same on the retry');
  // its one side effect: the answer is logged at table 4 and filed under the 4s until chapter 8
  const logged = c.counts.filter(e => e.set === 'ch07-gone' && e.a === 4 && e.b === 6);
  assert.ok(logged.length === 3 && logged.every(e => e.table === 4 && E.tableOf(e, STORIES) === 4));
  assert.deepEqual(E.countSets(STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes'], [6, 'ch07-sixes']], 'no set of chapter 7 owns the 4s');
  assert.deepEqual(E.factTables(c, STORIES).filter(tb => tb.table === 4).map(tb => [tb.name, tb.rows.map(r => r.a + 'x' + r.b)]), [['The 4s', ['4x6']]]);
  assert.deepEqual(E.hardFacts(c, 4, STORIES), [[4, 6]], 'for chapter 9’s warm-up on the 4s');
  // a right answer: never timed (its own prompt), the right line Tallyheart's
  const c2 = threesCat(); play(c2, 'ch07-sixes');
  const r = play(c2, 'ch07-gone', null, { all: 9000 });
  assert.deepEqual([ks(r), r[0].balloons.map(b => b.who)], [['4x6'], ['tallyheart']]);
  assert.deepEqual(E.hardFacts(c2, 4, STORIES), []);
});

test('the sixties, the build notes’ tests: ten marks a night for six nights, in the sand (told, Tallyheart) or the mud (kept, Riffle); a miss lights them a night at a time; the fillers 1 × 10 then 10 × 2 on both paths', () => {
  for (const sid of ['ch07-dragon', 'ch07-riffle']) {
    const c = threesCat(); play(c, 'ch07-pile'); play(c, 'ch07-threes'); play(c, 'ch07-sixes'); play(c, 'ch07-gone');
    const s = play(c, sid, { '10x6': [50, 50] });
    const who = sid === 'ch07-dragon' ? 'Tallyheart' : 'Riffle';
    assert.deepEqual(ks(s), ['10x6✗', 'F:1x10', 'F:10x2', 'R:10x6✗', 'F:10x3', 'F:4x10', 'R:10x6'], sid + ': the sixty always starts from 1 × 10');
    assert.deepEqual([s[0].picture.kind, s[0].picture.ground, s[0].picture.groups, s[0].picture.per], ['marks', sid === 'ch07-riffle' ? 'mud' : undefined, 6, 10], sid);
    assert.deepEqual([s[0].help.picture, s[0].help.nums], [true, [10, 20, 30, 40, 50, 60]], sid + ': lit a night at a time');
    assert.deepEqual(s.slice(1, 3).map(x => [x.prompt.map(p => p.label + ': ' + p.text).join(' '), x.picture.kind, x.picture.groups, x.picture.per]), [
      [who + ': An easy one. One night. How many pieces?', 'marks', 1, 10], [who + ': An easy one. Two nights. How many pieces?', 'marks', 2, 10]], sid + ': one night and then two nights of ten marks');
    s.forEach(x => assert.equal(x.teacher, sid === 'ch07-dragon' ? 'tallyheart' : 'riffle', sid + ' ' + x.k));
  }
  const c = threesCat(); play(c, 'ch07-sixes'); play(c, 'ch07-gone');
  const told = play(c, 'ch07-dragon', { '10x6': [50] });
  assert.deepEqual([told[0].help.intro, told[0].line, told[3].balloons.map(b => b.text)], [HOP, 'Tens land on a zero. ' + MISS, ['Sixty! Ten a night adds up fast.']]);
  assert.deepEqual(told[0].prompt.map(p => [p.kind, p.text]), [['caption', 'Ten a night, for six nights. How many would a dragon take?']]);
  const c2 = threesCat(); play(c2, 'ch07-sixes'); play(c2, 'ch07-gone');
  const kept = play(c2, 'ch07-riffle', { '10x6': [50] });
  assert.deepEqual([kept[0].help.intro, kept[0].line], ['Hop by tens! Ten, twenty…', MISS]);
  assert.deepEqual(kept[0].prompt.map(p => [p.label, p.kind, p.text]), [['Riffle', 'whisper', 'Six nights. How many would she take?']]);
  assert.deepEqual(kept[3].prompt.map(p => [p.label, p.text]), [['Riffle', 'Here’s that one again.'], ['Riffle', 'Six nights. How many would she take?']]);
  assert.deepEqual(kept[3].balloons.map(b => [b.who, b.kind, b.text]), [['riffle', 'shout', 'SIXTY!'], ['riffle', 'whisper', '…sixty.']], 'his shout, then very quietly');
  // no story question ever falls back on a sentence of the engine's but the shared openings and miss lines
  [told, kept].forEach(rows => saidIn(rows).forEach(l => assert.ok(!DEFAULTS.includes(l) || ['Here’s that one again.', MISS, LAST].includes(l), l)));
});

test('the Training Hollow after chapter 7: it offers “Whiskers · the 6s”, Tallyheart says “sixes” there and asks in cheeks, and the tree has seven marks', () => {
  const cat = fresh();
  read(cat, {});
  assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes'], [6, 'ch07-sixes']]);
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(x => x.name), ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s', 'Nine lives · the 9s', 'Patrols · the 3s', 'Whiskers · the 6s']);
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, STORIES).opts.marks, 7);
  assert.ok(7 <= E.MAX_MARKS);
  const def = E.hollowDef(STORIES, 6);
  assert.deepEqual([E.hollowRoundLine(def), E.hollowWord(def), def.id, def.teacher, def.thing, def.picture], ['A round of sixes. Ready? Here we go.', 'sixes', 'hollow-6s', 'tallyheart', 'whisker', { kind: 'cheeks' }]);
  const R = E.hollowStart(cat, STORIES, 1, 6), asked = [];
  for (let q; (q = E.counts.question(R.state));) {
    asked.push(pairKey(q.a + 'x' + q.b));
    const D = E.questionDef(R.def, q, story, STORIES), pic = E.lessonPicture(D, q, 0);
    assert.equal(pic.kind, 'cheeks', q.a + '×' + q.b + ': in cheeks');
    assert.ok(pic.groups >= 1 && pic.groups <= 10);
    assert.match(A.countsPicture(Object.assign({ look: {} }, pic)), /<svg/);
    E.counts.answer(R.state, R.def, q.answer, 2000, 1);
  }
  assert.deepEqual(asked.sort(), ['1x6', '2x6', '3x6', '4x6', '5x6', '6x6', '6x7', '6x8', '6x9', '6x10'].sort());
  // the other sets teach nothing new: the 6s are the lesson's, never the twenty-four's; the 10s and 3s are older chapters'
  assert.deepEqual([E.countFor(6, STORIES).setId, E.countFor(10, STORIES).setId, E.countFor(3, STORIES).setId], ['ch07-sixes', 'ch04-tens', 'ch06-threes']);
  assert.equal(E.countFor(4, STORIES), null, 'the 4s are chapter 8’s');
});

test('the 6s are learned at the lesson, not before it: until Tallyheart teaches them the Hollow offers no 6s and the tree has six marks; the seventh is scratched straight after', () => {
  const SIX = ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s', 'Nine lives · the 9s', 'Patrols · the 3s'];
  const cat = fresh(), marks = c => E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, c, STORIES).opts.marks;
  const lesson = countsAt('ch07-sixes')[0];
  read(cat, { stop: lesson });
  assert.ok(cat.lessons['ch07-pile'] && cat.lessons['ch07-threes'] && !cat.lessons['ch07-sixes'], 'the pile and the warm-up are done, the lesson not begun');
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(x => x.name), SIX, 'no “Whiskers · the 6s” yet');
  assert.equal(marks(cat), 6);
  const cat2 = fresh();
  read(cat2, { stop: TREE });
  assert.deepEqual(E.hollowLines(cat2, STORIES).counts.map(x => x.name), SIX.concat(['Whiskers · the 6s']));
  assert.equal(marks(cat2), 7);
  assert.equal(frames[TREE].scene.opts.marks, 7, 'the frame that scratches it');
  assert.equal(exits(frames[lesson])[0], TREE, 'straight after the lesson');
});

/* ------------------------------------------------------------------ her Case File */

test('her Case File: the four cards as the spec’s table has them; given once each, on their frames, in order, on every path; Waffles’ in a row of three with the fox’s moon and Patience’s; the tunnel beside Coil’s; three under the moss', () => {
  assert.deepEqual(Object.keys(story.cards), CARD_IDS);
  assert.deepEqual(story.cards, {
    'waffles-no-moon': { mark: 'ear', line: 'Waffles says there was NO moon on the storm night.', link: { with: ['fox-moon'], line: 'Two say no moon. Only the fox says moon.' } },
    'my-count': { mark: 'eye', line: 'My count: twenty-four gone in six nights. A dragon would take sixty.' },
    'prints-sprinkle': { mark: 'eye', line: 'Sprinkle’s prints are huge. The thief’s are tiny.' },
    tunnel: { mark: 'eye', line: 'A tunnel under the back of the pile, too small for a dragon.', link: { with: ['coil-diggers'], line: 'Coil felt them. Now I’ve seen where.' } }
  });
  CARD_IDS.forEach(cid => { assert.ok(story.cards[cid].line.split(/\s+/).length <= 13, cid); assert.doesNotMatch(story.cards[cid].line, /weasel|glass|scale/i, cid); });
  assert.equal(ch04.cards['fox-moon'].answers, undefined, 'no `answers` on the fox’s moon (chapter 10’s): a link instead');
  // where each is given: one frame each (her count's on each path's own outcome panel)
  assert.deepEqual(ids.filter(id => frames[id].card).map(id => [frames[id].card, id]), [
    ['waffles-no-moon', F(/^You told me that on my second day\./)], ['my-count', frames[SUM_TOLD].choice.options[0].next], ['my-count', frames[SUM_KEPT].choice.options[0].next],
    ['prints-sprinkle', F(/^Hers are as big as Patience’s feet\./)], ['tunnel', F(/^It’s much too small for a dragon\./)]]);
  // in a reading: four new cards, once each, in order, on every path
  for (const c of SOME.slice(0, 24)) {
    const cat = fresh(c.flags), before = cat.cards.length;
    read(cat, c.o);
    assert.deepEqual(cat.cards.slice(before).map(k => k.id), CARD_IDS, comboName(c));
    assert.ok(cat.cards.slice(before).every(k => k.chapter === 'ch07'));
    assert.equal(new Set(cat.cards.map(k => k.id)).size, cat.cards.length);
  }
  // the moon: Waffles', the fox's and Patience's in one row, both lines; the tunnel touching Coil's diggers
  const links = cat => E.caseFile(cat, STORIES).links.map(l => [l.cards.map(k => k.id).join(' + '), (l.lines || [l.line]).join(' | ')]);
  const done = reading({}, {}).cat;
  assert.ok(links(done).some(l => l[0] === 'waffles-no-moon + fox-moon + heron-no-moon' && l[1] === 'Two say no moon. Only the fox says moon. | One of them is wrong.'), JSON.stringify(links(done)));
  assert.ok(links(done).some(l => l[0] === 'coil-diggers + tunnel' && l[1] === 'Coil felt them. Now I’ve seen where.'), JSON.stringify(links(done)));
  const half = fresh(); read(half, { stop: F(/^You told me that on my second day\./) });
  assert.ok(links(half).some(l => /waffles-no-moon \+ fox-moon \+ heron-no-moon/.test(l[0])), 'from the moment she holds it');
  // every card in a link is counted once, and none is lost
  const Fl = E.caseFile(done, STORIES), all = Fl.groups.reduce((a, g) => a.concat(g.cards), []).concat(Fl.links.reduce((a, l) => a.concat(l.cards), [])).map(k => k.id);
  assert.deepEqual(all.slice().sort(), E.cards(done, STORIES).map(k => k.id).sort());
  // her nest at bedtime: her cards along the edge, Waffles' among them; her count, the prints and the
  // tunnel under the moss with Sprinkle's two and Coil's, on every path (the den's `hidden`)
  [{ ch3Told: true }, { ch3Told: false }].forEach(flags => {
    const cat = reading(flags, {}).cat, sc = E.resolveScene(frames[NEST].scene, cat, STORIES);
    assert.deepEqual([sc.opts.hidden, sc.opts.bark.map(b => b.picture).filter(p => CARD_IDS.includes(p))], [true, CARD_IDS]);
    const svg = A.render(sc, { look: { fur: 'grey', sex: 'she', marking: 'none', eyes: 'green' } }).svg;
    assert.equal((svg.match(/data-bark="corner"/g) || []).length, 6, 'six secrets under the moss, a corner showing for each');
    assert.equal((svg.match(/data-bark="card"/g) || []).length, Math.min(sc.opts.bark.length, 24) - 6, 'the rest along the mossy edge, Waffles’ curl among them');
  });
});

test('FLEW against can’t-fly, for every cat: `ch7Flew` is set on the FLEW screen and nowhere else, never `ch4CaughtFly`; her Case File draws the two touching from that screen on, and before it only for a cat who caught it at the border; “I KNEW it!” only for her', () => {
  const touching = cat => E.caseFile(cat, STORIES).links.some(l => l.cards.map(k => k.id).sort().join() === 'cant-fly,fox-flew');
  for (const flags of [{ specialty: 'sneaking', ch3Told: true }, { specialty: 'noticing', ch3Told: false }, { specialty: 'noticing', ch4CaughtFly: true, ch3Told: true }, { specialty: 'climbing', ch4CaughtFly: true, ch3Told: false }]) {
    const cat = fresh(flags), rows = read(cat, {});
    const at7 = rows.findIndex(r => r.id === FLEW);
    rows.forEach((r, i) => assert.equal(r.links.some(l => l.cards.map(k => k.id).sort().join() === 'cant-fly,fox-flew'), !!flags.ch4CaughtFly || i >= at7, JSON.stringify(flags) + ' ' + r.id));
    assert.deepEqual([cat.flags.ch7Flew, cat.flags.ch4CaughtFly], [true, flags.ch4CaughtFly], JSON.stringify(flags) + ': chapter 7 never sets ch4CaughtFly');
    assert.ok(touching(cat));
    assert.equal(/I KNEW it! I knew it at the border!/.test(readWords(rows)), flags.specialty === 'noticing' && !!flags.ch4CaughtFly, JSON.stringify(flags));
    // sticky: Back from the screen after it keeps it
    assert.ok(E.back(cat, story) && cat.flags.ch7Flew);
  }
  // the line is chapter 4's, and the link reads either flag
  const L = ch04.cards['fox-flew'].link;
  assert.deepEqual([L.line, L.when], ['They can’t both be true.', { not: { ch4CaughtFly: false, ch7Flew: false } }]);
  [[{}, false], [{ ch4CaughtFly: true }, true], [{ ch7Flew: true }, true], [{ ch4CaughtFly: true, ch7Flew: true }, true]].forEach(([flags, want]) => assert.equal(E.matches(L.when, { flags }), want, JSON.stringify(flags)));
  assert.ok(PC.ui.flagWords.ch7Flew && /flew/.test(PC.ui.flagWords.ch7Flew['true']));
});

/* ------------------------------------------------------------------ the Taps and the questions */

test('the Taps that count log nothing: the gaps, her whiskers, the five cheeks, the bedtime faces; nor do the one-tap pages or Tallyheart’s six Counts; 15 typed answers on every path', () => {
  for (const flags of [{ ch3Told: true }, { ch3Told: false, specialty: 'climbing' }]) {
    const cat = fresh(flags), n0 = cat.counts.length;
    const rows = read(cat, {});
    rows.forEach((x, i) => { if (['skip', 'scratch', 'ask', 'next', 'choice'].includes(x.kind) && rows[i + 1]) assert.equal(rows[i + 1].counts, x.counts, x.id + ' logs nothing'); });
    assert.deepEqual(rows.filter(x => x.kind === 'skip').map(x => [x.skip.table, x.skip.groups]), [[1, 4], [3, 2], [6, 5], [6, 4]]);
    assert.deepEqual(rows.filter(x => x.kind === 'scratch').map(x => frames[x.id].scratch.tap), ['ears', 'paw', 'back', 'fish', 'print', 'mist', 'back', 'roots']);
    rows.filter(x => x.kind === 'scratch').forEach(x => { assert.deepEqual(x.scratched, [], x.id); assert.equal(x.tap.kind, 'tap', x.id); });
    assert.equal(cat.counts.length - n0, 15, JSON.stringify(flags) + ': fifteen answers');
  }
});

test('a big number is on a page only straight after a count she made: the 6 over her cheek, the 24 after the bedtime faces; never after the gaps or the five cheeks', () => {
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
      if (f.choice) { const opt = f.choice.options[pick(id, c.o)]; id = opt.next; } else id = exits(f)[0];
    }
  }
  const [, cheek, , bed] = ids.filter(id => frames[id].skip);
  assert.deepEqual([...carried].sort(), [bed + ':24', cheek + ':6'].sort());
  // and the cheek's own picture stays up on the page after, the one page that keeps one (the five cheeks
  // after it end the kept run, and a skip draws its own picture)
  assert.deepEqual(ids.filter(id => E.keptSkip(story, id)), [frames[cheek].skip.next, frames[frames[cheek].skip.next].next]);
  assert.ok(frames[frames[frames[cheek].skip.next].next].skip, 'the five cheeks: a skip of its own');
});

test('Tallyheart’s six Counts: a Tap that counts nothing; her question and our cat’s answer, six times, one for every mark on the tree; the sixes she already knows are hers to say; the tree does not change', () => {
  const askId = ids.find(id => frames[id].ask), f = frames[askId], ak = f.ask;
  assert.deepEqual([E.kindOf(f), E.exits(f)], ['ask', [countsAt('ch07-sixes')[0]]]);
  assert.deepEqual(E.askView(ak, 0), { taps: 0, total: 6, done: false, who: 'tallyheart', to: 'player', pair: null, before: [], owed: 0 });
  for (let n = 1; n <= 6; n++) {
    const v = E.askView(ak, n);
    assert.deepEqual([v.pair, v.before.length, v.done], [ak.pairs[n - 1], n - 1, n === 6]);
    const sc = E.askScene(f.scene, ak, n);
    assert.deepEqual([sc.opts.marks, sc.opts.glow], [6, 'auto'], 'the six claw marks, unchanged');
    assert.deepEqual(sc.cast, f.scene.cast);
  }
  assert.equal(ak.pairs.length, frames[askId].scene.opts.marks, 'one from every mark on this tree');
  // the answers are the sixes she has met: 6 × 1 (tails), 6 × 2 (ears), 6 × 5 and 6 × 10 (claws), 6 × 9 (lives), 6 × 3 (guards)
  ak.pairs.forEach(p => assert.ok(words(p[0]) <= 3 && words(p[1]) <= 6, p.join(' ')));
  const rd = reading({ specialty: 'sneaking' }, {}), x = rowAt(rd.rows, askId), next = rowAt(rd.rows, ak.next);
  assert.deepEqual(x.asked, ak.pairs);
  assert.equal(next.counts - x.counts, 0);
  assert.deepEqual(next.lesson.map(l => l.k), ['2x6', '5x6', '6x6', '6x3', '6x4', '6x7', '6x8', '4x6', '7x6', '8x6']);
});

/* ------------------------------------------------------------------ the book */

function recapFor(flags) { return story.book.recap.filter(x => !x.when || E.matches(x.when, { flags })); }
const sentences = t => t.split(/(?<=[.!?])\s+(?=\p{Lu}|\{)/u).length;

test('book: title, chapter title, seven entries and 6 to 10 sentences on every path, true on each; the dream and the uncounted night; no dragonet page', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['chapterTitle', 'dream', 'noDream', 'recap', 'title']);
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'The Counts Don’t Lie');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}paw’s dream that night went uncounted.');
  b.recap.forEach((x, i) => {
    assert.deepEqual(Object.keys(x).filter(k => !['text', 'when'].includes(k)), [], 'recap ' + i);
    if (x.when) assert.ok(same(x.when, TOLD) || same(x.when, KEPT), 'recap ' + i + ': by path');
    assert.match(x.text, /[.!?”’]$/);
    assert.ok(words(x.text) <= 32, 'recap ' + i + ': ' + words(x.text));
    assert.doesNotMatch(x.text, /\byou\b/i, 'third person');
    assert.doesNotMatch(x.text, /weasel|glass|\bscale\b/i);
  });
  [[TOLD, 'told'], [KEPT, 'kept'], [{}, 'unset (kept)']].forEach(([flags, name]) => {
    const rc = recapFor(flags);
    assert.equal(rc.length, 7, name + ': seven entries');
    const n = rc.reduce((m, x) => m + sentences(x.text), 0);
    assert.ok(n >= 6 && n <= 10, name + ': ' + n + ' sentences');
    // true on its path: the sixty is Tallyheart's on the told path and Riffle's on the kept; the tunnel hers
    // and Tallyheart's, or hers alone
    const all = rc.map(x => x.text).join(' ');
    assert.equal(/Tallyheart worked it out|and Tallyheart found the mouth/.test(all), flags.ch3Told === true, name);
    assert.equal(/Riffle helped/.test(all), flags.ch3Told !== true, name);
    // FLEW against can't-fly, with both claims named: no bare “they” a child could take for Sprinkle and Reynard
    assert.match(all, /Sprinkle tried to fly, and couldn’t, so Reynard’s story that the dragon FLEW can’t be true\./, name);
    assert.doesNotMatch(all, /\bthey\b/i, name + ': no “they” in her book’s page');
  });
  // a she-cat's and a tom's pages through the engine; the cat named wherever a tom's “he” could mean another
  const page = (cat, id) => E.buildFullBook(cat, STORIES).pages.find(p => p.id === id).recap.join(' ');
  const told = reading({ specialty: 'sneaking' }, {}).cat, kept = reading({ specialty: 'sneaking', ch3Told: false }, {}).cat;
  assert.match(page(told, 'ch07'), /Then Moonpaw and Tallyheart worked it out: four a night for six nights is twenty-four, but a dragon who eats ten fish a meal would have taken sixty\./);
  assert.match(page(kept, 'ch07'), /Riffle helped Moonpaw work out that a dragon who eats ten fish a meal would have taken sixty\./);
  assert.match(page(kept, 'ch07'), /At dusk, behind the back row, Moonpaw found the mouth of a tunnel/);
  assert.deepEqual([E.buildBook(story, told).recap.length, E.buildBook(story, kept).recap.length], [7, 7]);
  assert.equal(E.buildBook(story, told).chapter, 'Chapter 7: The Counts Don’t Lie');
  const tom = fresh({ specialty: 'sneaking' }); tom.look.sex = 'tom';
  read(tom, { dream: '' });
  assert.match(page(tom, 'ch07'), /Tallyheart taught Moonpaw his seventh Count, whiskers: the sixes\./);
  assert.doesNotMatch(page(tom, 'ch07'), /\{|\}/);
  assert.equal(E.buildFullBook(tom, STORIES).pages.find(p => p.id === 'ch07').dream, 'Moonpaw’s dream that night went uncounted.');
  assert.equal(E.buildFullBook(told, STORIES).pages.find(p => p.id === 'ch07').dream, 'Moonpaw’s dream: “A tunnel full of whiskers.”');
  assert.deepEqual(E.dragonets(told, STORIES).found.map(d => d.id), E.dragonets(before7(), STORIES).found.map(d => d.id), 'nobody new is found: no dragonet page');
  assert.equal(E.buildBook(ch06, told).chapter, 'Chapter 6: The Snake in the Stones', 'the pages before are as they were');
});

test('the teaser for chapter 8 (built now, and the hub offers it), curious and never scary, with no number; chapter 6’s for this one stands', () => {
  assert.deepEqual(story.teaser, { title: 'Chapter 8: The Night Trail', lines: ['Tomorrow night, a trail in the dark.', 'Where does that tunnel come out?'] });
  story.teaser.lines.forEach(l => assert.ok(words(l) <= 25, l));
  assert.doesNotMatch(story.teaser.lines.join(' '), /\d|twenty|sixty|weasel|thief|robbed|stolen|scary|monster/i, 'no number, no answer');
  const cat = E.blankCat({}); cat.name = 'Moon';
  // chapter 8 is in the game, built (2026-10-21; it was a stub while it was made): the hub offers it; read with
  // chapters 1 to 7 only, it is still "coming soon". Its words stand as they shipped (the golden of chapters 1
  // to 7 holds them), and chapter 8 keeps both its promises (tests/story-ch08.test.js, its teaser test)
  assert.ok(PC.story.ch08, 'chapter 8 is in the game');
  assert.ok(Object.values(PC.story.ch08.frames).every(f => !/^STUB\b/.test(f.board || '')), 'built: no stub frame is left');
  assert.ok(Object.values(PC.story.ch08.frames).some(f => /So THAT’S where it comes out!/.test((f.caption || []).join(' '))), 'where the tunnel comes out');
  assert.equal(E.chapterHeading(PC.story.ch08), story.teaser.title, 'the teaser’s title is chapter 8’s');
  assert.deepEqual(E.teaser(story, cat, PC.story), { title: 'Chapter 8: The Night Trail', lines: story.teaser.lines, built: true, next: 'ch08' }, 'chapter 8 is in: the hub offers it');
  assert.deepEqual(E.teaser(story, cat, STORIES), { title: 'Chapter 8: The Night Trail', lines: story.teaser.lines, built: false, next: null }, 'without it, coming soon');
  // the hook it carries on: somewhere, that tunnel comes out; tomorrow night, with Tallyheart or Riffle
  assert.match(T(F(/^Soon he’s snoring\./)), /Somewhere, that tunnel comes out\. Where\?$/);
  // chapter 6's teaser stands, its title this chapter's, and both its promises are kept
  assert.deepEqual(ch06.teaser, { title: 'Chapter 7: The Counts Don’t Lie', lines: ['Tomorrow, your sixth morning count, after a night of guards.', 'Will the pile still add up?'] });
  assert.equal(E.chapterHeading(story), ch06.teaser.title);
  assert.match(T(PILE_COUNT), /Eighteen guards\. Let’s see if it worked\./);
  const done = reading({ specialty: 'sneaking' }, {}).cat, p = E.progress(done, PC.story);
  assert.deepEqual([p.latest.id, p.next && p.next.id, p.soon, E.status(done, PC.story)], ['ch07', 'ch08', null, 'Chapter 7 finished']);
  const c6 = E.blankCat({}); c6.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5, ch06: 6 };
  assert.deepEqual([E.progress(c6, PC.story).next.id, E.chapterHeading(E.progress(c6, PC.story).next)], ['ch07', 'Chapter 7: The Counts Don’t Lie']);
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean and fill renders the same text; chapters 1 to 6 are sound beside it', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  assert.ok(E.checkStory(story).length > 0, 'chapter 7 leans on chapter 4 (the fox’s moon, the tens), chapter 6 (Coil’s diggers, the threes)');
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind], cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
  [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05, ch06].forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id));
});

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, the flag, the lessons, the taps, her cards, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) for (const light of [0, 1]) {
    const o = { light }, name = comboName(c) + ' light ' + light;
    const cat = fresh(c.flags);
    const counted = cat.counts.length, flags0 = Object.keys(cat.flags);
    const rows = read(cat, o), walked = idsOf(rows);
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch07'), name);
    rows.forEach(x => { if (x.kind !== 'end') assert.ok(x.caps.length + x.say.length + (x.sfx ? 1 : 0) + (x.options ? x.options.length : 0) > 0, name + ' ' + x.id + ' shows nothing'); });
    assert.deepEqual(walked, walk(cat.flags, Object.assign({ clean: true }, o)).slice(), name + ': the engine walks the same frames');
    assert.deepEqual(Object.keys(cat.flags).filter(k => !flags0.includes(k)).sort(), c.before ? [] : ['ch7Flew'], name + ': no other flag is set');
    const done = Object.keys(cat.lessons).filter(k => /^ch07/.test(k)).sort();
    assert.deepEqual(done, ['ch07-gone', 'ch07-pile', 'ch07-sixes', 'ch07-threes', c.flags.ch3Told ? 'ch07-dragon' : 'ch07-riffle'].sort(), name);
    done.forEach(s => assert.ok(cat.lessons[s].finished && cat.lessons[s].noHelp, name + ': ' + s));
    assert.equal(cat.counts.length - counted, 15, name + ': the typed answers; the taps never logged');
    assert.equal(cat.dreams.ch07, 'a tunnel full of whiskers');
    assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3, 6]);
    assert.equal(E.status(cat, STORIES), 'Chapter 7 finished');
    const page = E.buildBook(story, cat);
    assert.ok(page.recap.length === 7, name);
    rows.forEach(x => x.say.forEach(bl => assert.ok(bl.label && !/[{}]/.test(bl.label + bl.text), name + ' ' + x.id + ': ' + bl.label + ': ' + bl.text)));
    rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.forEach(p => { if (p.who) assert.equal(p.label, p.who === 'riffle' ? 'Riffle' : 'Tallyheart', name + ' ' + x.id); })));
    // the scenes resolve for her: her stone in every den; the tree's marks glow as she has earned them
    rows.filter(x => x.scene && x.scene.set === 'den').forEach(x => assert.equal(x.scene.opts.stone, c.flags.ch2Stone, x.id));
    rows.filter(x => x.scene && x.scene.set === 'hollow').forEach(x => assert.ok(Array.isArray(x.scene.opts.glow), x.id));
    assert.ok(E.back(cat, story));
    assert.equal(cat.flags.ch7Flew, true, name + ': sticky');
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 40);
  // with a miss on everything she still reaches the end, every retry and filler is asked, and every speaker of
  // a lesson's line is in that Counts frame's picture
  for (const ch3Told of [true, false]) {
    const cat = fresh({ specialty: 'noticing', ch3Told, worry: 'water' });
    const rows = read(cat, { answers: { '3x10': [13], '7x3': [20], '4x3': [11], '6x4': [20], '6x8': [40], '8x6': [40], '4x6': [20], '10x6': [50] } });
    assert.equal(rows[rows.length - 1].kind, 'end');
    const w = readWords(rows);
    ['Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.', 'Tallyheart: An easy one. One row of ten. How many pieces?', 'Tallyheart: One from yesterday. One patrol. How many cats?',
      'Twelve and twelve: twenty-four. There. We’ll come back to that one.', 'Tallyheart: An easy one. Two cheeks. How many whiskers?', 'Three nights make twelve. Six nights is twice that. Twelve and twelve: twenty-four. There. We’ll come back to that one.',
      ch3Told ? 'Tens land on a zero. There. We’ll come back to that one.' : 'Hop by tens! Ten, twenty…', (ch3Told ? 'Tallyheart' : 'Riffle') + ': An easy one. One night. How many pieces?', 'Tallyheart: Here’s that one again.'].forEach(line => assert.ok(w.includes(line), line));
    assert.deepEqual(Object.keys(cat.lessons).filter(k => /^ch07/.test(k)).sort(), ['ch07-gone', 'ch07-pile', 'ch07-sixes', 'ch07-threes', ch3Told ? 'ch07-dragon' : 'ch07-riffle'].sort());
    Object.keys(cat.lessons).filter(k => /^ch07/.test(k)).forEach(s => assert.equal(cat.lessons[s].noHelp, false, s + ': she needed the sand (or the marks) in every one'));
    rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.concat(l.balloons).filter(y => y.who).forEach(y => assert.ok(castOf(x.id, y.who).length, x.id + ' ' + l.k + ': ' + y.who))));
    // (a cat who needed the sand says it plainly, and Tallyheart answers it warmly)
    assert.deepEqual(rowAt(rows, SEVENTH).say.map(b => b.text), ['Whiskers. That’s your seventh Count.', 'Some were tricky.', 'Tricky. And you worked out every one.']);
  }
  // a save in the middle of the day goes through the store's own shape and comes back the same cat
  const mid = fresh({ specialty: 'climbing', ch3Told: false });
  read(mid, { stop: F(/^Hers are as big as Patience’s feet\./) });
  const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
  assert.deepEqual([back.flags, back.cards, back.frame, back.lessons], [mid.flags, mid.cards, mid.frame, mid.lessons]);
  assert.deepEqual(idsOf(read(back, {})), idsOf(read(mid, {})), 'and reads on to the same end');
});
