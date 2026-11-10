/* Story tests for chapter 12: node --test
 *
 * Checks app/story/ch12.js against the frame contract in docs/build.md, against the story
 * (docs/chapters/12-a-spark-at-the-hedge.md, Draft v0.4, final) and against its spec
 * (docs/chapters/12-a-spark-at-the-hedge.spec.md, v0.2, the build's contract): module 2's first chapter, opened by
 * chapter 11 finished; the frame graph (f001 to f080 with the spec's lettered option frames, which meet again; no frame
 * shown only `when` a flag matches; no flag set); one interaction per frame; the seven choices (none sets a flag); the
 * lines by `specialty` (f013, f062), `ch10Best` (f057) and `ch2Stone` (f071) for every combination; her name tag (“The
 * little cat” from the hedge to her naming, “A small voice” for the friends' “Hello.”, “Chispapaw” after, never
 * «Galleta»); the Spanish (the three whole Spanish lines, the words in English lines, every one filled and glossed as the
 * spec has it, no « » in the file); the three Counts sets exactly as the spec has them and played as it plays them (the
 * warm-up over every pick case, its echo on her first right answer; the take lesson's worked example, its twins with no
 * prompt and no right line, the echo after 475 − 132 right or helped and never after its twin; no spreading talk; the
 * store's 175 − 42 with the ones-first pointer and no twin); finishing the lesson opens Count the store; the paw thing in
 * Chispapaw's Spanish; the pages she taps once, each with its target in the art; the speakers, the chained balloons, the
 * balloon kinds; tokens, storyboards, word counts, captions and boxes; the art vocabulary camera by camera (Chispapaw,
 * the bridge's `store` camera and its spots, the hollow's store, glow, quick marks and tap, the den's 16, `hedge-right`,
 * a cat carrying a mouse); the staging (the hedge three in a row, the Hollow, the store's six, the nests), no two cats
 * touching, depth (casts back to front), the time of day, the generated storyboard, every frame rendered with everyone
 * in the picture, the beats in order on every path, the book (eight sentences, the store at 133, book two), the teaser
 * for chapter 13, and whole play-throughs through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch12.test.js   prints the whole chapter, rendered three ways.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
require(path.join(ROOT, 'app/ui.js'));
const E = PC.engine;
const A = PC.art;
const UI = PC.ui;
const story = PC.story.ch12;
const frames = story.frames;
const ids = Object.keys(frames);
const ch04 = PC.story.ch04, ch11 = PC.story.ch11;
const STORIES = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09', 'ch10', 'ch11'].map(k => PC.story[k]).concat([story]);
const SRC = fs.readFileSync(path.join(ROOT, 'app/story/ch12.js'), 'utf8');
const DOC = fs.readFileSync(path.join(ROOT, 'docs/chapters/12-a-spark-at-the-hedge.md'), 'utf8');
const WJ = '\u2060';

/* ------------------------------------------------------------------ the chapter's facts */

const SPEC = ['noticing', 'sneaking', 'climbing', 'swimming', 'friends'];
const BEST = ['sprinkle', 'friends', 'truth', 'counts'];
const STONE = ['nose', 'chin'];
const FLAGS = { specialty: SPEC, ch10Best: BEST, ch2Stone: STONE };
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'pick', 'ask', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx'].concat(INTERACTIONS);
const TOKENS = ['name', 'ending', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat', 'sloshbank', 'reedclan', 'thymeleaf', 'groveclan', 'chispapaw'];
const GROWN = ['tallyheart', 'glintstar', 'thymeleaf', 'grizzled', 'waffles', 'murmurchime'];
// the spec's frame list: f001 to f080, the option frames lettered
const IDS = [];
for (let n = 1; n <= 80; n++) {
  const f = 'f' + String(n).padStart(3, '0');
  if (n === 25) IDS.push('f025a', 'f025b', 'f025c');
  else if (n === 37) IDS.push('f037a', 'f037b', 'f037c');
  else if (n === 40) IDS.push('f040a', 'f040b');
  else if (n === 51) IDS.push('f051a', 'f051b');
  else IDS.push(f);
  if (n === 38) IDS.push('f038c');
  if (n === 52) IDS.push('f052c');
}
// the raw spots, as the story file names them
const SPOTS = {
  RING_YOU: { x: 610, y: 905 }, RING_TALLY: { x: 380, y: 900 }, NOON_CLAN: { x: 330, y: 784 }, NOON_OLD: { x: 1140, y: 770 }, NOON_CLAN2: { x: 1300, y: 778 },
  NOON_YOU: { x: 750, y: 904 }, NOON_TALLY: { x: 985, y: 906 }, NOON_CHIME: { x: 1200, y: 908 }, NEW_BESIDE: { x: 470, y: 936 }, VOUCH_YOU: { x: 630, y: 905 },
  VOUCH_OLD: { x: 1140, y: 905 }, VOUCH_CLAN: { x: 1000, y: 772 }, VOUCH_CLAN2: { x: 1335, y: 786 }, NAME_YOU: { x: 1040, y: 906 }, NAME_TALLY: { x: 1270, y: 902 },
  PURR_OLD: { x: 290, y: 792 }, WALK_CHISPA: { x: 640, y: 930 }, WALK_YOU: { x: 880, y: 930 }, WALK_TALLY: { x: 1180, y: 930 }, TOWER_TALLY: { x: 1230, y: 1000 },
  HOL_YOU: { x: 690, y: 892 }, PATH_CHISPA: { x: 560, y: 762 }, PATH_TALLY: { x: 1260, y: 764 }, BANK_CHISPA: { x: 560, y: 900 }, RIFFLE_UNDER: { x: 400, y: 940 },
  UNDER_CHISPA: { x: 880, y: 900 }, UNDER_TALLY: { x: 1160, y: 896 }, PAST: { x: 1280, y: 965, h: 200 }
};

/* ------------------------------------------------------------------ helpers */

function exits(f) { return E.exits(f); }
function interactions(f) { return INTERACTIONS.filter(k => f[k] !== undefined); }
function capText(c) { return typeof c === 'string' ? c : c.text; }
function capWhen(c) { return typeof c === 'string' ? null : c.when || null; }
/* Every line of a frame, `when` variants included. */
function texts(f) {
  const out = [];
  (f.caption || []).forEach((c, i) => out.push({ where: 'caption ' + i, text: capText(c), when: capWhen(c) }));
  (f.say || []).forEach((b, i) => out.push({ where: 'say ' + i + ' (' + b.who + ')', text: b.text, who: b.who, when: b.when || null, lang: b.lang }));
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
const seq = (from, to) => ids.slice(at(from), at(to) + 1);
const clone = x => JSON.parse(JSON.stringify(x));
const spotName = a => Object.keys(SPOTS).find(k => same(SPOTS[k], a));
const unmark = s => String(s).replace(/[«»]/g, '');
/* The frames that say this, in reading order; F: the one frame that does. */
function FF(re) { return ids.filter(id => re.test(T(id))); }
function F(re) {
  const hit = FF(re);
  assert.equal(hit.length, 1, 'exactly one frame says ' + re + ' (' + hit.join(' ') + ')');
  return hit[0];
}

const PROFILES = {
  'she-cat': { name: 'Moon', ending: 'silver', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A spark in the snow.' },
  tom: { name: 'Storm', ending: 'leap', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'One hundred thirty-three mice.' },
  // a player whose own Clan name is Murmur: the warrior is Mutterchime
  murmur: { name: 'Murmur', ending: 'true', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Riffle juggling.' }
};
/* Fill a line as a profile reads it: the cat's tokens, then the Spanish ones by the engine (marks dropped). */
function fill(text, p, extra) {
  const out = String(text).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : m));
  return unmark(E.fill(out, null, extra));
}

/* Anything that reads badly once the tokens are filled (the chapter 1 rules). */
function badGrammar(text, isSfx) {
  const bad = [];
  if (/[{}]/.test(text)) bad.push('unfilled token');
  if (/(?<!\bif )\b(she|he) (are|were|have|do|don’t|aren’t|weren’t|haven’t)\b/i.test(text)) bad.push('pronoun/verb agreement');
  if (/\b(she|he)’re\b/i.test(text)) bad.push('she’re/he’re');
  if (/\bhisself\b|\btheirselves\b|\bthemself\b/i.test(text)) bad.push('bad reflexive');
  if (/\ban (tom|she-cat)\b/i.test(text)) bad.push('“an” before tom/she-cat');
  if (!isSfx && /\b(\w+)\s+\1\b/i.test(text.replace(/Ting! Ting!/, ''))) bad.push('doubled word');
  if (/pawpaw/i.test(text)) bad.push('pawpaw');
  if (/\s{2,}|\s[,.!?]/.test(text)) bad.push('stray space');
  if (/['"]/.test(text.replace(/\*\*/g, ''))) bad.push('straight quote');
  if (!isSfx) {
    const start = text.replace(/\*\*/g, '').replace(/^[“"‘'(—¡¿]+/, '');
    if (!start.startsWith('…') && /^\p{Ll}/u.test(start) && !/^—/.test(text)) bad.push('starts lowercase');
    if (/[.!?][”"’']?\s+[“"‘(¡¿]?(\p{Ll})/u.test(text)) bad.push('sentence starts lowercase');
  }
  return bad;
}

/* Every Counts line of the chapter's own sets: prompts, right lines, echo lines, done. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l })));
    ['done'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k] }); });
    (d.facts || []).forEach((f, i) => {
      if (Array.isArray(f)) return;
      ['prompt', 'retryPrompt'].forEach(pk => { if (typeof f[pk] === 'string' || Array.isArray(f[pk])) [].concat(f[pk]).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' ' + pk + ' ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, kind: p.kind })); });
      [].concat(f.right || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' right ' + j, text: typeof p === 'string' ? p : p.text, who: p.who }));
    });
    // an echo line read with a question's own numbers: the warm-up's for 7 × 8, the lesson's for 475 − 132
    const extra = sid === 'ch12-warm' ? { a: 7, b: 8 } : { a: 475, b: 132, answer: 343 };
    if (d.echo) d.echo.lines.forEach((l, j) => out.push({ set: sid, where: 'echo ' + j, text: l.text, who: l.who, lang: l.lang, extra }));
  });
  return out;
}
function everyText(fn) {
  ids.forEach(id => texts(frames[id]).forEach(x => fn(id, x)));
  ids.forEach(id => {
    const f = frames[id];
    if (f.choice) f.choice.options.forEach((o, i) => fn(id, { where: 'option ' + i, text: o.label }));
    if (f.skip && f.skip.prompt) fn(id, { where: 'skip prompt', text: f.skip.prompt });
    if (f.scratch) fn(id, { where: 'tap prompt', text: E.tapWords(f).prompt });
    if (f.input && f.input.placeholder) fn(id, { where: 'placeholder', text: f.input.placeholder });
  });
  countsLines().forEach(x => fn('counts ' + x.set, x));
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  ['title', 'chapterTitle', 'dream', 'noDream'].forEach(k => { if (story.book[k]) fn('book', { where: k, text: story.book[k] }); });
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* The choices: four give each option its own reply (`vouch`, `first`, `ask`, `walk`, the option's index); the three light
 * ones go to the next screen (`wake`, `hello`, `news`). */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const WAKE = choiceAt(/^“I kept watch ALL night!”$/)[0];
const HELLO = choiceAt(/^“What’s your name\?”$/)[0];
const VOUCH = choiceAt(/^“I was a pillow cat too\.”$/)[0];
const FIRST = choiceAt(/^“Welcome, Chispapaw\.”$/)[0];
const ASK = choiceAt(/^“One at a time!”$/)[0];
const WALK = choiceAt(/^“The old tom STILL is\.”$/)[0];
const NEWS = choiceAt(/^“We’ll be there!”$/)[0];
const DREAM = ids.find(id => frames[id].input && frames[id].input.kind === 'dream');
const KEY = { [WAKE]: 'wake', [HELLO]: 'hello', [VOUCH]: 'vouch', [FIRST]: 'first', [ASK]: 'ask', [WALK]: 'walk', [NEWS]: 'news' };
function choiceFor(id, o) {
  const k = KEY[id];
  if (!k) throw new Error('no choice at ' + id);
  return (o && o[k]) || 0;
}
/* A cat as the walks below take her: these flags, her name, she-cat unless `sex`. */
function catFor(flags, o) {
  o = o || {};
  return { name: o.name || 'Moon', ending: o.ending || 'heart', petname: 'Muffin', flags: Object.assign({}, flags), look: { sex: o.sex || 'she' }, lessons: {} };
}
/* The frames a reader with these flags and choices walks through, in order (E.landing, as the engine lands). */
function walk(flags, o) {
  o = o || {};
  const cat = catFor(flags, o);
  const out = [];
  let id = story.start;
  for (let guard = 0; guard < 200 && id; guard++) {
    id = E.landing(cat, story, id);
    const f = frames[id];
    out.push(id);
    if (f.end) { out.cat = cat; return out; }
    if (f.choice) {
      const opt = f.choice.options[choiceFor(id, o)];
      assert.ok(E.options(f, cat).some(x => x.option === opt), id + ': the option she takes is one she sees');
      Object.assign(cat.flags, opt.sets || {});
      id = opt.next;
    } else id = exits(f)[0];
  }
  throw new Error('no end');
}
/* What a walk put on screen: for each frame, the lines its reader saw there (tokens as written), and what she did. */
function walkLines(flags, o) {
  const p = walk(flags, o), cat = p.cat;
  return p.map(id => {
    const f = frames[id];
    const bal = E.balloons(f, cat), caps = E.captions(f, cat);
    const row = { id, kind: E.kindOf(f), lines: caps.concat(bal.map(b => b.text)).concat(f.sfx ? [f.sfx] : []), boxes: caps.length + bal.length, balloons: bal };
    if (f.choice) row.options = E.options(f, cat).map(x => E.optionLabel(x.option, cat));
    if (f.scratch) row.tap = E.tapWords(f).prompt;
    if (f.skip) row.skip = f.skip.prompt;
    return row;
  });
}
/* Every combination of her `specialty` (five or none), `ch10Best` (four or none) and `ch2Stone` (two or none): 90 flag
 * sets, each read six ways, the 54 paths through the four choices with replies taken in turn (13 is prime to 54, so
 * every path is read), the light choices and her first name by turns: 540 readings. */
const PATHS = [];
for (const vouch of [0, 1, 2]) for (const first of [0, 1, 2]) for (const ask of [0, 1]) for (const walkTo of [0, 1, 2]) PATHS.push({ vouch, first, ask, walk: walkTo });
const FLAGSETS = [];
for (const specialty of SPEC.concat([undefined])) for (const best of BEST.concat([undefined])) for (const stone of STONE.concat([undefined])) {
  const flags = {};
  if (specialty) flags.specialty = specialty;
  if (best) flags.ch10Best = best;
  if (stone) flags.ch2Stone = stone;
  FLAGSETS.push(flags);
}
const NAMES = ['Moon', 'Fern', 'Minnow', 'Frost', 'Pebble', 'Sedge', 'Storm', 'Holly', 'Murmur', 'Chispa'];
const COMBOS = [];
for (let n = 0; n < 540; n++) {
  COMBOS.push({ flags: FLAGSETS[n % 90], o: Object.assign({ wake: n % 2, hello: (n >> 1) % 2, news: (n >> 2) % 2, name: NAMES[n % NAMES.length], sex: n % 3 ? 'she' : 'tom' }, PATHS[(n * 13) % 54]) });
}
const comboName = c => JSON.stringify(c.flags) + ' ' + JSON.stringify(c.o);
const SOME = COMBOS.filter((c, i) => i % 9 === 0);
// the frames a path's four choices add: the vouching (a → f027; b, c → f026), her first words (a → f039; b → f038;
// c → f038c), the questions, the walk (a, b → f052; c → f052c)
function framesOf(o) { return 80 - (o.vouch === 0 ? 1 : 0) - (o.first === 0 ? 1 : 0) - (o.walk === 2 ? 1 : 0); }

/* ------------------------------------------------------------------ reading through the engine */

const Sp = UI.speakers;
const labelFor = (b, cat, st) => Sp.label(b, { cat, story: st || story, fill: x => E.fill(x, cat) });
function saidOn(st, id, cat) {
  const f = st.frames[id], cast = (f.scene && f.scene.cast) || [];
  return E.balloons(f, cat).map(b => {
    const mine = cast.filter(c => c && c.who === b.who), m = mine[b.nth] || mine[0];
    return { who: b.who, label: labelFor(Object.assign({}, b, { variant: m && m.variant }), cat, st), text: b.lang === 'es' ? E.esLine(b.text, cat) : E.fill(b.text, cat), kind: b.kind, lang: b.lang,
      noFace: Sp.faceHidden(b, m) };
  });
}
/* A Counts lesson (the warm-up), answered right unless `answers` says otherwise, each question's prompt, picture and
 * echo. */
function countsRows(cat, st, def, state, answers, ms) {
  const seen = {}, out = [];
  while (!E.counts.done(state)) {
    const q = E.counts.question(state), k = q.a + 'x' + q.b;
    const i = seen[k] = (seen[k] || 0) + 1;
    const a = answers && answers[k] && answers[k][i - 1] != null ? answers[k][i - 1] : q.answer;
    const t = ms && ms[k] != null ? ms[k] : (ms && ms.all) || 2000;
    const D = E.questionDef(def, q, st, STORIES);
    const prompt = E.promptLines(def, D, q).map(l => Object.assign({}, l, { text: E.fill(l.text, cat) }));
    const r = E.counts.answer(state, D, a, t, 1);
    E.logAnswer(cat, r.entry);
    const echo = r.correct ? E.countsEcho(def, state, r, E.teacherOf(def, D)) : null;
    out.push({ k: (q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, line: E.fill(r.line || '', cat), kind: r.lineKind, res: r, echo,
      help: r.correct ? null : E.helpPlan(def, D, q, r) });
    if (r.done) E.recordLesson(cat, state);
    else cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: st.id, state };
  }
  return out;
}
/* A take lesson, column by column: each column's line, her digit (`digits` maps "a-b" to the digits she types for its
 * columns in turn; else the right one), the slip, the help, and at each problem's end its line and the set's echo. */
function takeRows(cat, def, state, digits) {
  const out = [], seen = {}, TK = E.takes;
  let t = 5000, cur = null;
  for (let guard = 0; guard < 200 && !TK.done(state); guard++) {
    const q = TK.question(state), key = q.a + '-' + q.b, c = q.plan.cols[q.col];
    if (q.col === 0) {
      seen[key] = (seen[key] || 0) + 1;
      cur = { key, a: q.a, b: q.b, mode: q.mode, twin: q.twin, ask: E.takeQuestion(def, q), cols: [], prompt: q.prompt, right: q.right };
      out.push(cur);
    }
    const want = digits && digits[key] && seen[key] === 1 ? digits[key][q.col] : undefined;
    const typed = want !== undefined ? want : c.blank ? '' : c.digit;
    const line = E.takeLine(def, q.plan, q.col, q.stage, q.mode, q.full);
    const r = TK.digit(state, def, typed, 2000, t += 1000);
    if (r.pointer) { cur.pointer = r.line; const r2 = TK.digit(state, def, c.blank ? '' : c.digit, 2000, t += 1000); cur.cols.push({ line, typed: c.digit, right: r2.right, r: r2 }); if (r2.problemDone) end(r2); continue; }
    cur.cols.push({ line, typed, right: r.right, slip: r.slip, help: r.help, r });
    if (r.problemDone) end(r);
  }
  function end(r) {
    if (r.entry) E.logTake(cat, r.entry);
    cur.entry = r.entry; cur.line = r.line; cur.balloons = r.balloons; cur.lineKind = r.lineKind; cur.twinQueued = r.twin || null;
    cur.echo = E.takeEcho(def, { problem: true, a: r.entry.a, b: r.entry.b, answer: r.entry.answer, correct: r.entry.correct, helped: r.entry.helped }, state);
    if (r.done) E.recordLesson(cat, state);
  }
  return out;
}
function readStory(cat, st, o) {
  o = o || {};
  const rows = [];
  let t = o.t || 1000;
  for (let guard = 0; guard < 300; guard++) {
    const id = E.frameId(cat, st), f = st.frames[id], kind = E.kindOf(f);
    const row = { id, kind, f, caps: E.captions(f, cat).map(c => E.fill(c, cat)), heard: E.captionsRead(f, cat).map(c => E.fill(c, cat)), say: saidOn(st, id, cat),
      counts: cat.counts.length, taken: cat.takes ? cat.takes.log.length : 0, sfx: f.sfx || '', scene: f.scene ? E.resolveScene(f.scene, cat, STORIES) : null,
      flags: Object.assign({}, cat.flags), storeOpen: E.storeOpen(cat, STORIES) };
    rows.push(row);
    if (o.onRow) o.onRow(row, cat);
    if ((o.stop && id === o.stop) || kind === 'end') break;
    t += 10;
    if (kind === 'skip') { row.skip = E.skipFor(f.skip, cat); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'next') assert.ok(E.next(cat, st, t), id);
    else if (kind === 'scratch') { row.tap = E.tapWords(f); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'choice') {
      const opts = E.options(f, cat);
      row.options = opts.map(x => E.fill(E.optionLabel(x.option, cat), cat));
      const want = choiceFor(id, o), ix = opts.findIndex(x => x.index === want);
      assert.ok(ix >= 0 && E.choose(cat, st, want, t), id);
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'a spark in the snow' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      if (r.def.op === '-') row.takes = takeRows(cat, r.def, r.state, o.digits);
      else row.lesson = countsRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat at chapter 12's first page: chapters 1 to 11 finished (her ceremony, her warrior name), her flags, every Count
 * learned. `o.name`, `o.ending`, `o.sex`. */
function before12(flags, o) {
  o = o || {};
  const cat = E.blankCat({ now: 1, id: 'c12' });
  cat.name = o.name || 'Moon'; cat.ending = o.ending || 'heart'; cat.petname = 'Muffin';
  if (o.sex) cat.look.sex = o.sex;
  STORIES.slice(0, 11).forEach((s, i) => { cat.finished[s.id] = i + 1; });
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch3Told: true, caseFileOpen: true, ch10Best: 'truth', ch11Named: 'offer' }, flags || {});
  E.countSets(STORIES).forEach(k => { cat.lessons[k.setId] = { set: k.setId, mode: 'chapter', answers: 10, correct: 10, fast: 5, facts: 10, firstTry: 10, helped: 0, noHelp: true, finished: true }; });
  cat.lessons['ch11-pile'] = { set: 'ch11-pile', mode: 'chapter', answers: 1, correct: 1, fast: 1, facts: 1, firstTry: 1, helped: 0, noHelp: true, finished: true };
  return cat;
}
function fresh(flags, o) { const cat = before12(flags, o); E.startChapter(cat, story, 500); return cat; }
function read(cat, o) { return readStory(cat, story, o || {}); }
const rowAt = (rows, id) => rows.find(r => r.id === id);
const idsOf = rows => rows.map(r => r.id);

/* Where a cast member lands in the drawing (world units): its body and head boxes, from the svg's own transform. */
const LOOKD = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
function anchorOf(sc, m) {
  const info = A.sceneInfo(sc.set), anchors = info.anchors[info.cams[sc.cam].comp] || {};
  let a = typeof m.at === 'object' ? m.at : anchors[m.at];
  // the warriors' nest: her nest's spot moved right (scenes.js, `nextNest`)
  if (a && sc.set === 'den' && sc.opts.nextNest && m.at === 'nest') a = Object.assign({}, a, { x: a.x + 60 });
  return a;
}
function landed(svg, m, a) {
  const c = A.character(m.who, Object.assign({}, m, { facing: m.facing || a.face, mood: m.mood || 'neutral' }, m.who === 'player' ? { look: LOOKD, sex: LOOKD.sex } : {}));
  const re = new RegExp('<g transform="translate\\(' + a.x + ' ' + a.y + '\\) scale\\(([\\d.]+) [\\d.]+\\) translate\\(-' + (c.w / 2) + ' -' + c.h + '\\)"');
  const mm = re.exec(svg);
  if (!mm) return null;
  const s = +mm[1], w = (b) => [a.x + (b.x0 - c.w / 2) * s, a.y + (b.y0 - c.h) * s, a.x + (b.x1 - c.w / 2) * s, a.y + (b.y1 - c.h) * s];
  return { idx: mm.index, s, head: w(c.headBox || { x0: c.w * 0.3, y0: 0, x1: c.w * 0.7, y1: c.h * 0.4 }), body: w(c.bounds || { x0: 0, y0: 0, x1: c.w, y1: c.h }) };
}
const meets = (p, q) => p[0] < q[2] && p[2] > q[0] && p[1] < q[3] && p[3] > q[1];
const gapOf = (p, q) => Math.max(q[0] - p[2], p[0] - q[2], q[1] - p[3], p[1] - q[3]);
const cover = (head, body) => Math.max(0, Math.min(head[2], body[2]) - Math.max(head[0], body[0])) * Math.max(0, Math.min(head[3], body[3]) - Math.max(head[1], body[1])) / ((head[2] - head[0]) * (head[3] - head[1]));
function boxesOn(id) {
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose' } });
  const sc = E.resolveScene(frames[id].scene, cat, STORIES), svg = A.render(sc, { look: LOOKD }).svg;
  return sc.cast.map(m => { const a = anchorOf(sc, m); const L = a && landed(svg, m, a); return L ? Object.assign(L, { m, a }) : null; });
}

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape: A Spark at the Hedge, module 2’s first, opened by chapter 11 finished, after it on the page and in the offline copy; its words file before it', () => {
  assert.equal(story.id, 'ch12');
  assert.equal(story.number, 12);
  assert.equal(story.title, 'A Spark at the Hedge');
  assert.equal(story.module, 2);
  assert.equal(story.start, 'f001');
  assert.equal(story.opensWhen, undefined, 'number order: it opens when chapter 11 is finished');
  assert.deepEqual(story.names, { player: '{name}{ending}' }, 'our cat’s balloons labelled with her warrior name');
  assert.ok(frames[story.start], 'start frame exists');
  assert.deepEqual(ids, IDS, 'the spec’s frame list, in reading order');
  assert.equal(ids.length, 88);
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'module', 'names', 'number', 'start', 'teaser', 'title']);
  assert.deepEqual(story.cards, {}, 'no card: module 2 has no Case File');
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch12'), order.indexOf('ch11') + 1, 'chapter 12 follows chapter 11');
  assert.ok(Object.values(frames).every(f => !/\bSTUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 540);
  assert.equal(new Set(COMBOS.map(c => JSON.stringify(PATHS.indexOf(PATHS.find(p => p.vouch === c.o.vouch && p.first === c.o.first && p.ask === c.o.ask && p.walk === c.o.walk))))).size, 54, 'every path read');
  // the page loads the words, then the chapter, after chapter 11 and before the Warrior Counts; the gallery too; the offline copy
  const scripts = require('./_load.js').scripts();
  const iw = scripts.indexOf('app/story/words.js'), i12 = scripts.indexOf('app/story/ch12.js');
  assert.ok(scripts.indexOf('app/story/ch11.js') < iw && iw < i12 && i12 < scripts.indexOf('app/story/warrior.js'));
  const gallery = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  assert.ok(gallery.indexOf('../app/story/ch11.js') < gallery.indexOf('../app/story/words.js') && gallery.indexOf('../app/story/words.js') < gallery.indexOf('../app/story/ch12.js'), 'the gallery loads what the page loads');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  assert.match(sw, /'\.\/app\/story\/ch11\.js',\n\s*'\.\/app\/story\/words\.js',\n\s*'\.\/app\/story\/ch12\.js',/);
  // closed before chapter 11 is finished, open after
  const cat = before12({});
  delete cat.finished.ch11;
  assert.equal(E.isOpen(cat, story, STORIES), false, 'the ceremony first');
  cat.finished.ch11 = 11;
  assert.equal(E.isOpen(cat, story, STORIES), true);
  assert.equal(E.upNext(cat, STORIES).id, 'ch12');
});

test('frame ids run f001 to f080 in reading order, the option frames lettered; every edge goes forward; the option frames meet where the spec says', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}[abc]?$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  assert.deepEqual([WAKE, HELLO, VOUCH, FIRST, ASK, WALK, NEWS, DREAM], ['f003', 'f017', 'f024', 'f036', 'f039', 'f050', 'f066', 'f079']);
  const nexts = id => [...new Set(exits(frames[id]))];
  assert.deepEqual(nexts('f024'), ['f025a', 'f025b', 'f025c']);
  assert.deepEqual(['f025a', 'f025b', 'f025c', 'f026'].map(id => frames[id].next), ['f027', 'f026', 'f026', 'f027']);
  assert.deepEqual(nexts('f036'), ['f037a', 'f037b', 'f037c']);
  assert.deepEqual(['f037a', 'f037b', 'f037c', 'f038', 'f038c'].map(id => frames[id].next), ['f039', 'f038', 'f038c', 'f039', 'f039']);
  assert.deepEqual(nexts('f039'), ['f040a', 'f040b']);
  assert.deepEqual(['f040a', 'f040b'].map(id => frames[id].next), ['f041', 'f041']);
  assert.deepEqual(nexts('f050'), ['f051a', 'f051b', 'f052c']);
  assert.deepEqual(['f051a', 'f051b', 'f052', 'f052c'].map(id => frames[id].next), ['f052', 'f052', 'f053', 'f053']);
  // a lettered frame is reached only by its choice (or its sibling, where two meet)
  const into = {};
  ids.forEach(id => exits(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  assert.deepEqual([into.f026, into.f027, into.f038, into.f038c, into.f039, into.f041, into.f052, into.f053],
    [['f025b', 'f025c'], ['f025a', 'f026'], ['f037b'], ['f037c'], ['f037a', 'f038', 'f038c'], ['f040a', 'f040b'], ['f051a', 'f051b'], ['f052', 'f052c']]);
});

test('exactly one interaction per frame, no unknown keys; no frame shown only `when` a flag matches, no `else`, no gift, no card; no choice sets a flag; the engine’s checks clean', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    ['look', 'file', 'pick', 'ask', 'when', 'else', 'sets', 'gift', 'card', 'sfxAt', 'sfxRead'].forEach(k => assert.equal(f[k], undefined, id + ': no ' + k));
    if (f.choice) f.choice.options.forEach((o, i) => assert.deepEqual(o.sets, {}, id + ' option ' + i + ': sets nothing'));
  });
  assert.deepEqual(E.checkStory(story, STORIES), []);
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkTakes(story, STORIES), []);
  STORIES.slice(0, 11).forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id + ' still sound beside it'));
  // no flag words for the grown-ups corner: nothing new to say
  assert.ok(!Object.keys(UI.flagWords).some(k => /^ch12/.test(k)));
});

test('a child who listens hears every sentence finished: the sound effects are the bell’s and Riffle’s splash, lettered, never read; every page heard as it is lettered', () => {
  assert.deepEqual(ids.filter(id => frames[id].sfx).map(id => [id, frames[id].sfx]), [['f017', 'Ting!'], ['f032', 'Ting! Ting!'], ['f067', 'Splash!']]);
  const some = [{ flags: { ch2Stone: 'nose', ch10Best: 'counts', specialty: 'noticing' } }, { flags: { ch2Stone: 'chin', ch10Best: 'friends', specialty: 'friends' } }, { flags: {} }];
  ids.forEach(id => {
    const f = frames[id];
    // (the title panel's caption is a title, not a sentence: chapter 8's; f051b's speech tag leads into her balloon with a
    // colon, as chapters 3, 6, 9 and 10 letter a lead-in: the final review)
    (f.caption || []).map(capText).forEach(t => assert.ok(E.endsSentence(t) || (id === 'f001' && t === 'Chapter 12: A Spark at the Hedge') ||
      (id === 'f051b' && t === 'In her deepest, grumpiest old-tom voice:' && f.say && f.say.length), id + ': “' + t + '” runs on'));
    some.forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), id + ': heard as it is lettered'));
  });
});

test('every target exists and every frame is reachable by some reader; the end is reachable from every frame; one end, the last frame', () => {
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const walked = new Set();
  for (const c of COMBOS) walk(c.flags, c.o).forEach(id => walked.add(id));
  assert.deepEqual(ids.filter(id => !walked.has(id)), [], 'frames no reader reaches');
  const ends = ids.filter(id => frames[id].end);
  assert.deepEqual(ends, [ids[ids.length - 1]]);
  const into = {};
  ids.forEach(id => exits(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  const ok = new Set(ends), stack = ends.slice();
  while (stack.length) (into[stack.pop()] || []).forEach(p => { if (!ok.has(p)) { ok.add(p); stack.push(p); } });
  assert.deepEqual(ids.filter(id => !ok.has(id)), [], 'frames that cannot reach the end');
});

test('every combination reaches the end with no frame that shows nothing: 77 to 80 frames on a reading as its choices say (the spec’s count; the brief’s cap 125)', () => {
  const counts = new Set();
  for (const c of COMBOS) {
    const name = comboName(c), rows = walkLines(c.flags, c.o);
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    assert.equal(rows.length, framesOf(c.o), name);
    counts.add(rows.length);
    assert.ok(rows.length >= 77 && rows.length <= 80 && rows.length <= 125, name);
    rows.forEach(r => { if (r.kind !== 'end') assert.ok(r.lines.length > 0 || (r.options || []).length || r.tap || r.skip, r.id + ' shows nothing to ' + name); });
    // the option frames she reads are her choices'
    const p = walk(c.flags, c.o);
    assert.equal(p.includes('f025a') + p.includes('f025b') + p.includes('f025c'), 1, name);
    assert.ok(p.includes(['f025a', 'f025b', 'f025c'][c.o.vouch]), name);
    assert.ok(p.includes(['f037a', 'f037b', 'f037c'][c.o.first]) && p.includes(['f040a', 'f040b'][c.o.ask]) && p.includes(['f051a', 'f051b', 'f052c'][c.o.walk]), name);
  }
  assert.deepEqual([...counts].sort(), [77, 78, 79, 80]);
});

/* ------------------------------------------------------------------ the choices */

test('choices: seven, none setting a flag; the light ones (her answer to {Murmur}chime, her question at the hedge, Riffle’s news) to the next screen; the vouching, her first words, the questions and the walk each to its own reply', () => {
  assert.deepEqual(ids.filter(id => frames[id].choice), [WAKE, HELLO, VOUCH, FIRST, ASK, WALK, NEWS]);
  const L = id => frames[id].choice.options.map(o => o.label);
  assert.deepEqual(L(WAKE), ['“I kept watch ALL night!”', '“I’m a VERY good sleeper.”']);
  assert.deepEqual(L(HELLO), ['“What’s your name?”', '“Hello! Who are you?”']);
  assert.deepEqual(L(VOUCH), ['“Judge her by what she does, not by where she sleeps.”', '“I was a pillow cat too.”', 'To the old tom: “She can count in TWO languages. Can you?”']);
  assert.deepEqual(L(FIRST), ['“Welcome, Chispapaw.”', '“Ready to work?”', '“Let’s count something.”']);
  assert.deepEqual(L(ASK), ['“No, no, and YES!”', '“One at a time!”']);
  assert.deepEqual(L(WALK), ['“Some of them. Not for long.”', '“The old tom STILL is.”', '“Tallyheart wasn’t. Not once.”']);
  assert.deepEqual(L(NEWS), ['“We’ll be there!”', '“First light? I just WOKE UP!”']);
  [WAKE, HELLO, NEWS].forEach(id => frames[id].choice.options.forEach((o, i) => assert.deepEqual(o, { label: o.label, sets: {}, next: ids[at(id) + 1] }, id + ' option ' + i)));
  [VOUCH, FIRST, ASK, WALK].forEach(id => frames[id].choice.options.forEach((o, i) => {
    assert.deepEqual(Object.keys(o).sort(), ['label', 'next', 'sets'], id + ' option ' + i);
    assert.notEqual(o.next, frames[id].choice.options[(i + 1) % frames[id].choice.options.length].next, id + ': each its own reply');
  }));
  ids.filter(id => frames[id].choice).forEach(id => {
    assert.equal(frames[id].choice.prompt, undefined, id);
    frames[id].choice.options.forEach((o, i) => assert.ok(words(o.label) <= 12, id + ' option ' + i));
  });
  // each reply as the story writes it
  assert.deepEqual(['f025a', 'f025b', 'f025c'].map(T), ['Tallyheart’s ears go up, proud. You said it just the way she once said it for you. The muttering stops. Thank you.',
    'Well. YOU turned out all right.', '…' + WJ + 'I can count in ONE very well.']);
  assert.deepEqual(['f037a', 'f037b', 'f037c'].map(T), ['Chispapaw purrs so hard her whiskers shake. Chispapaw’s tail goes up too, just like yours. Now you know how I felt, the day you came.',
    'Ready! …' + WJ + 'What’s work?', 'That’s MY line. Hmph.']);
  assert.deepEqual(['f040a', 'f040b'].map(T), ['Chispapaw’s eyes go huge. A DRAGON?! The dragon story at the store. Lessons now.', 'Okay. DRAGON first. The dragon story at the store. Lessons now.']);
  assert.deepEqual(['f051a', 'f051b', 'f052c'].map(T), ['Not for long. I can do not-for-long.', 'In her deepest, grumpiest old-tom voice: Chips-paw?', 'Up ahead, Tallyheart’s ear twitches. She heard. Chispapaw’s whiskers lift. I’ll show them. Like you did.']);
});

/* ------------------------------------------------------------------ inputs, counts, skips and taps */

test('the dream, the three Counts frames, the paw thing and the twelve pages she taps once, in the story’s order, each as the spec has it', () => {
  assert.deepEqual(ids.filter(id => frames[id].input), [DREAM]);
  assert.equal(T(DREAM), 'What did {name}{ending} dream, with a fresh track waiting at first light?');
  assert.deepEqual(frames[DREAM].input, { kind: 'dream', placeholder: 'A spark… a store… a fresh track…', next: 'f080' });
  assert.ok(frames[DREAM].input.placeholder.length <= 32);
  // the Counts frames: the warm-up, the lesson, the store's catch, each its question's own words (`intro: false`)
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => [id, frames[id].counts]), [['f042', { set: 'ch12-warm', intro: false, next: 'f043' }], ['f048', { set: 'ch12-take', intro: false, next: 'f049' }],
    ['f059', { set: 'ch12-store', intro: false, next: 'f060' }]]);
  counts.forEach(id => assert.ok(E.countsSet(frames[id].counts.set, story, STORIES), id));
  // the paw thing: chapter 4's bedtime tens, both forepaws, in Chispapaw's Spanish, out loud, the page waiting for Next
  assert.deepEqual(ids.filter(id => frames[id].skip), ['f074']);
  const paws = frames.f074.skip;
  assert.deepEqual(paws, { table: 10, groups: 5, paws: 'both', teacher: 'chispapaw', lang: 'es', carry: false, prompt: '**Tap** your forepaws.', next: 'f075' });
  assert.deepEqual([paws.table, paws.groups, paws.paws, paws.prompt], [ch04.frames.f118.skip.table, ch04.frames.f118.skip.groups, ch04.frames.f118.skip.paws, ch04.frames.f118.skip.prompt]);
  assert.deepEqual([1, 2, 3, 4].map(n => E.skipView(paws, n).count), ['«Diez…»', '«Diez, veinte…»', '«Diez, veinte, treinta…»', '«Diez, veinte, treinta, cuarenta…»']);
  const v5 = E.skipView(paws, 5);
  assert.deepEqual([v5.count, v5.gloss, v5.say, v5.wait, v5.done], ['«Diez, veinte, treinta, cuarenta, ¡cincuenta!»\n(Ten, twenty, thirty, forty, fifty!)', 'Ten, twenty, thirty, forty, fifty!', '«cincuenta»', true, true]);
  assert.deepEqual([1, 2, 3, 4].map(n => E.skipView(paws, n).say), ['«diez»', '«veinte»', '«treinta»', '«cuarenta»']);
  const w = E.skipWords(paws, 'chispapaw');
  assert.deepEqual([w.teacher, w.whisper, w.words, w.label], ['chispapaw', false, true, 'Tap your forepaws.'], 'hers, out loud, in Comic Neue; the hidden button the engine’s');
  assert.equal(E.skipWords(paws, null).teacher, 'chispapaw', 'her `teacher`, whoever speaks first');
  assert.equal(E.skipInto(story, 'f075'), null, '`carry: false`: the page it turns to keeps nothing up');
  // the pages she taps once (the spec's one-tap table)
  const taps = ids.filter(id => frames[id].scratch);
  const ONE = [
    ['f002', 'paw', '**Tap** to stretch.', 'Stretch.'], ['f008', 'nose', '**Tap** to dip your head.', 'Dip your head.'], ['f013', 'nose', '**Tap** to look.', 'Look.'],
    ['f021', 'paw', '**Tap** to lead her through the hedge.', 'Lead her through the hedge.'], ['f030', 'nose', '**Tap** to purr her new name.', 'Purr her name.'],
    ['f035', 'nose', '**Tap** to dip your head to her.', 'Dip your head to her.'], ['f044', 'squares', '**Tap** the squares.', 'Tap the squares.'],
    ['f047', 'paw', '**Tap** to scratch yours.', 'Scratch yours.'], ['f054', 'paw', '**Tap** to help carry.', 'Help carry.'], ['f060', 'store', '**Tap** to read the store.', 'Read the store.'],
    ['f062', 'paw', '**Tap** to wave to Riffle.', 'Wave to Riffle.'], ['f072', 'tail', '**Tap** to wave goodnight.', 'Wave goodnight.']
  ];
  assert.deepEqual(taps.map(id => [id, frames[id].scratch.tap, frames[id].scratch.prompt, frames[id].scratch.label]), ONE);
  taps.forEach(id => {
    assert.deepEqual(Object.keys(frames[id].scratch).sort(), ['label', 'next', 'prompt', 'tap'], id);
    assert.equal(frames[id].scratch.next, ids[at(id) + 1], id + ': to the next panel');
    assert.deepEqual(E.tapWords(frames[id]), { kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label }, id + ': no miss line: the glow wobbles');
  });
  // the scene targets: the Hollow's whole plan and the store on the floor (no cast member carries them)
  assert.deepEqual([frames.f044.scene.opts.tap, frames.f060.scene.opts.tap], ['squares', 'store']);
  ['f044', 'f060'].forEach(id => assert.ok(!frames[id].scene.cast.some(c => c.tap), id));
  // each Tap's answer drawn on the next panel where there is one to draw (the spec's section 7, item 4)
  assert.deepEqual(castOf('f003', 'player').map(c => [c.pose, c.tailUp]), [['crouch', true]], 'the stretch: front paws out, tail up');
  assert.deepEqual(frames.f045.scene.opts.storeGlow, 'hundreds', 'the squares: the five glowing');
  assert.deepEqual(castOf('f036', 'chispapaw').map(c => c.pose), ['lookup'], 'the dip: she looks up');
  assert.deepEqual([frames.f047.scene.opts.quick, frames.f048.scene.opts.quick], [2, 3], 'scratched: her square, line and dot beside Chispapaw’s');
  assert.deepEqual(castOf('f061', 'player').map(c => c.at), ['store-left'], 'the store read');
  // the order of the things she does
  const order = ['f002', WAKE, 'f008', 'f013', HELLO, 'f021', VOUCH, 'f030', 'f035', FIRST, ASK, 'f042', 'f044', 'f047', 'f048', WALK, 'f054', 'f059', 'f060', 'f062', NEWS, 'f072', 'f074', DREAM];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: three Counts frames (nine typed answers), one count by taps, twelve one-tap pages, seven choices, the dream
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    assert.deepEqual([p.filter(id => frames[id].counts).length, p.filter(id => frames[id].skip).length, p.filter(id => frames[id].scratch).length, p.filter(id => frames[id].choice).length,
      p.filter(id => frames[id].input).length], [3, 1, 12, 7, 1], comboName(c));
  }
});

/* ------------------------------------------------------------------ speakers, tokens, words */

// a speaker given two paragraphs in a row: two balloons (and Riffle's swimmer's line after his shout)
const CHAINED = ['f006:glintstar', 'f010:waffles', 'f012:waffles', 'f017:chispapaw', 'f042:tallyheart', 'f044:tallyheart', 'f048:tallyheart', 'f062:riffle'];
const LITTLE_IDS = ['f014', 'f017', 'f018', 'f020', 'f023', 'f025a', 'f026', 'f027', 'f028'];

test('every balloon speaker is in that frame’s cast but the two off the panel (each named, so no face); a speaker’s lines on a panel are one balloon but the spec’s two-paragraph ones; balloons and captions are well formed', () => {
  ids.forEach(id => {
    const f = frames[id];
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when', 'lang'].includes(k)), [], id + ' say ' + i);
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      if (b.lang !== undefined) assert.equal(b.lang, 'es', id + ' say ' + i);
      const off = (id === 'f013' && b.name === 'A small voice') || (id === 'f072' && b.who === 'chispapaw');
      if (off) {
        assert.ok(!castOf(id, b.who).length && b.name, id + ': off the panel, named');
        assert.equal(Sp.faceHidden(b, null), true, id + ': no face in the stack');
      } else assert.ok(castOf(id, b.who).length, id + ': ' + b.who + ' speaks and is not in the picture');
    });
    if (f.caption !== undefined) {
      assert.ok(Array.isArray(f.caption) && f.caption.length > 0, id + ' caption');
      f.caption.forEach(t => {
        if (typeof t === 'string') assert.ok(t.trim(), id + ' empty caption');
        else { assert.deepEqual(Object.keys(t).sort(), ['text', 'when'], id + ' caption object'); assert.ok(t.text.trim(), id + ' empty caption'); }
      });
    }
    texts(f).forEach(x => { if (x.when) Object.keys(x.when).forEach(k => assert.ok(FLAGS[k] && FLAGS[k].includes(x.when[k]), id + ' ' + x.where + ': when ' + k + '=' + x.when[k])); });
  });
  // the chained balloons, for every reader
  const chained = new Set();
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), cat = p.cat;
    p.forEach(id => {
      const b = E.balloons(frames[id], cat);
      for (let i = 1; i < b.length; i++) if (b[i].who === b[i - 1].who) chained.add(id + ':' + b[i].who);
    });
  }
  assert.deepEqual([...chained].sort(), CHAINED);
});

test('balloon kinds as the spec has them: the whispers, the shouts, every other balloon plain', () => {
  const WHISPER = [/^…⁠\{es:11\}/, /^I watched your ceremony/, /^I’ve never MET a mouse\./, /^\{es:galleta\}\.$/, /^Thank you\.$/, /^Not for long\./, /^¡\{Es:133\}!$/,
    /^Remember when that was you\?$/, /^Now you know how I felt/, /^Mice… \{es:50\} mice…$/, /^Same paw thing\. Better words\.$/, /^Goodnight, Sprinkle\.$/, /^Hello\.$/];
  const SHOUT = [/^Yoo-hoo! Down there!$/, /^A COOKIE!/, /^\{name\}\{ending\}!$/, /^I SAID see you tomorrow!/, /^NEWS! Granny’s found/, /^See you at first light!$/, /^A DRAGON\?!$/,
    /^Goodnight, \{name\}\{ending\}!/];
  const kinds = { whisper: [], shout: [] };
  ids.forEach(id => (frames[id].say || []).forEach(b => {
    if (b.kind) kinds[b.kind].push(id + ':' + b.text);
    const w = WHISPER.some(re => re.test(b.text)), s = SHOUT.some(re => re.test(b.text));
    assert.equal(b.kind, w ? 'whisper' : s ? 'shout' : undefined, id + ': ' + b.text);
  }));
  // the “Thank you.” twice (f025a, f026) and “Now you know how I felt” three times (f037a, f038, f038c)
  assert.equal(kinds.whisper.length, WHISPER.length + 3);
  assert.equal(kinds.shout.length, SHOUT.length);
  // the take lesson's sigh is a whisper too (76 − 42's prompt: the review's round moved it off 58 − 23)
  assert.equal(story.counts['ch12-take'].facts[2].prompt[0].kind, 'whisper');
});

test('her name tag: “The little cat” on each of her balloons from the hedge to her naming (the friends’ “Hello.” “A small voice”), “Chispapaw” after (her goodnight from across the camp named so); never «Galleta»; our cat’s balloons by her warrior name; the grey tom unnamed', () => {
  const named = [];
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'chispapaw').forEach(b => named.push([id, b.name || null])));
  named.forEach(([id, n]) => {
    if (id === 'f013') assert.equal(n, 'A small voice', id);
    else if (at(id) >= at('f014') && at(id) <= at('f028')) assert.equal(n, 'The little cat', id);
    else if (id === 'f072') assert.equal(n, 'Chispapaw', id);
    else assert.equal(n, null, id + ': labelled by the page');
  });
  assert.deepEqual([...new Set(named.filter(x => x[1] === 'The little cat').map(x => x[0]))], LITTLE_IDS);
  assert.ok(named.filter(x => at(x[0]) >= at('f031')).every(x => x[1] === null || x[0] === 'f072'), 'none after the naming but the far goodnight');
  assert.doesNotMatch(SRC.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ''), /Galleta/, 'never «Galleta» in the file: the word is the words table’s');
  // as the page labels them
  const cat = Object.assign(E.blankCat({}), { name: 'Fern', ending: 'heart', flags: { specialty: 'friends', ch10Best: 'counts', ch2Stone: 'nose' } });
  const who = {};
  ids.forEach(id => saidOn(story, id, cat).forEach(b => { (who[b.who] = who[b.who] || new Set()).add(b.label); }));
  assert.deepEqual(Object.fromEntries(Object.entries(who).map(([k, v]) => [k, [...v].sort()])), {
    player: ['Fernheart'], tallyheart: ['Tallyheart'], glintstar: ['Glintstar'], grizzled: ['Grizzled old tom'], snorer: ['Snoring apprentice'], waffles: ['Princess Waffles'],
    murmurchime: ['Murmurchime'], riffle: ['Riffle'], chispapaw: ['A small voice', 'Chispapaw', 'The little cat']
  });
  Object.values(who).forEach(s => [...s].forEach(l => assert.doesNotMatch(l, /Galleta/)));
  // our cat's label with no `name` on any balloon of hers: the chapter's names.player
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'player').forEach(b => assert.equal(b.name, undefined, id)));
  assert.equal(labelFor({ who: 'player' }, Object.assign(E.blankCat({}), { name: 'Storm', ending: 'leap' })), 'Stormleap');
});

test('text tokens are only the allowed ones; `{ending}` only right after `{name}`; Spanish tokens only where the spec puts them, and no « or » in the file', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS;
    tokensIn(x.text).forEach(t => {
      if (/^[Ee]s:/.test(t)) return;
      if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}');
    });
    const s = String(x.text);
    for (let i = s.indexOf('{ending}'); i >= 0; i = s.indexOf('{ending}', i + 1)) if (s.slice(Math.max(0, i - 6), i) !== '{name}') bad.push(id + ' ' + x.where + ': {ending} alone');
  });
  assert.deepEqual(bad, []);
  // every Spanish token, where it stands
  const es = [];
  everyText((id, x) => tokensIn(x.text).filter(t => /^[Ee]s:/.test(t)).forEach(t => es.push(id + ' ' + (x.lang ? 'es ' : '') + '{' + t + '}')));
  assert.deepEqual(es, ['f014 es {es:11}', 'f014 es {es:12}', 'f014 es {Es:12}', 'f014 es {es:gatos}', 'f018 {es:galleta}', 'f027 {es:galleta}', 'f061 es {Es:133}', 'f074 es {es:aContar}',
    'f075 {es:50}', 'f076 {es:50}', 'counts ch12-warm es {Es:fact}', 'counts ch12-take es {Es:answer}']);
  assert.doesNotMatch(SRC, /[«»]/, 'never the engine’s marks in a story file');
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  // the book's pronouns: a she-cat's and a tom's
  const book = story.book.recap.map(r => r.text).join(' ');
  assert.match(fill(book, PROFILES['she-cat']), /On Moonsilver’s first day as a warrior, she slept till noon, and Glintstar gave her a frost-time job/);
  assert.match(fill(book, PROFILES.tom), /On Stormleap’s first day as a warrior, he slept till noon, and Glintstar gave him a frost-time job/);
  assert.match(fill(book, PROFILES.tom), /a little pillow cat from his old tower/);
  assert.match(fill(book, PROFILES.tom), /gave her to Stormleap as his very first apprentice\./);
});

test('the Spanish (the spec’s section 6): the three whole Spanish lines (f014, f061, f074), tokens and punctuation only, filled and glossed as the spec has them; «Galleta» on f018 and f027, «cincuenta» on f075 and f076; no story information in Spanish only; the engine’s guards raise nothing', () => {
  const lines = [];
  ids.forEach(id => (frames[id].say || []).forEach(b => { if (b.lang === 'es') lines.push([id, b]); }));
  assert.deepEqual(lines.map(x => x[0]), ['f014', 'f061', 'f074']);
  lines.forEach(([id, b]) => {
    assert.equal(b.who, 'chispapaw', id);
    assert.doesNotMatch(b.text.replace(/\{[^}]*\}/g, ''), /\p{L}/u, id + ': no letter outside its tokens');
    assert.ok(tokensIn(b.text).every(t => /^[Ee]s:/.test(t)), id + ': no cat token');
  });
  const cat = Object.assign(E.blankCat({}), { name: 'Fern', ending: 'heart' });
  assert.deepEqual(lines.map(([, b]) => E.esLine(b.text, cat)), ['«…' + WJ + 'once, doce. Doce gatos.»\n(…' + WJ + 'eleven, twelve. Twelve cats.)',
    '«¡Ciento treinta y tres!»\n(One hundred thirty-three!)', '«¡A contar!»\n(Let’s count!)']);
  // as the page letters them: the Spanish in italics, its English upright under it (a word joiner after the gloss's hyphen,
  // so “thirty-three” never breaks at it: chapter 12's review; Read to me reads the text, never this HTML)
  assert.equal(UI.letter.rich(E.esLine(frames.f061.say[1].text, cat)), '<i class="es" lang="es">¡Ciento treinta y tres!</i><br><span class="gloss">(One hundred thirty-\u2060three!)</span>');
  // a word in an English line: the token between the marks, filled for every cat
  assert.equal(E.fill(T('f018'), cat), 'My Tall Ones call me «Galleta». It means cookie.');
  assert.equal(E.fill(frames.f027.say[1].text, cat), '«Galleta».');
  assert.equal(E.fill(frames.f075.caption[0], cat), 'By «cincuenta», the grey tom is snoring.');
  assert.equal(E.fill(frames.f076.say[0].text, cat), 'Mice… «cincuenta» mice…');
  // no story information in Spanish only: each word's English beside it on the same screen, or its own gloss
  assert.match(T('f018'), /It means cookie\./);
  assert.match(T('f074') + E.skipView(frames.f074.skip, 5).count, /fifty/);
  // the words table knows every word used
  ['gatos', 'galleta', 'aContar'].forEach(k => assert.ok(PC.words.es[k], k));
  assert.deepEqual(E.checkSpanish(story), []);
  // eight words or fewer a Spanish line, filled (its largest numbers' words)
  lines.forEach(([id, b]) => assert.ok(words(unmark(E.esLine(b.text, cat).split('\n')[0])) <= 8, id));
  // Chispa and Chispapaw in the English voice, respelled for speech only; the old tom's “Chips-paw?” as lettered
  assert.equal(E.sayAs('Chispapaw can’t help it.', cat), 'Cheespa-paw can’t help it.');
  assert.equal(E.sayAs('Chispa. It means spark.', cat), 'Cheespa. It means spark.');
  assert.equal(E.sayAs('Chips-paw?', cat), 'Chips-paw?');
});

/* The most words a single reader sees on a frame: every reading of it. */
function maxWords(id) {
  let best = 0;
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    if (!p.includes(id)) continue;
    const f = frames[id];
    const n = E.captions(f, p.cat).concat(E.balloons(f, p.cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []).reduce((m, s) => m + words(fill(s, PROFILES['she-cat'])), 0);
    best = Math.max(best, n);
  }
  return best;
}
/* The words she reads on a reading, the brief's way: lettering, options, Tap lines, the paw thing's, the Counts' prompts,
 * right lines and echoes, the book's dream line and the last frame. */
function readingWords(rows) {
  let w = 0;
  rows.forEach(r => {
    r.lines.forEach(s => { w += words(fill(s, PROFILES['she-cat'])); });
    (r.options || []).forEach(s => { w += words(s); });
    if (r.tap) w += words(r.tap.replace(/\*\*/g, ''));
    if (r.skip) w += words(r.skip.replace(/\*\*/g, ''));
  });
  return w;
}

test('word counts: about 15 to 18 words of lettering a frame, few over 30 for any reader and never more than 50; no panel with five boxes; every reading under the brief’s 125 frames and 2,000 words; never more than seven panels in a row with nothing to do', (t) => {
  const over = [];
  ids.forEach(id => {
    const m = maxWords(id);
    assert.ok(m <= WORDS_MAX, id + ' has ' + m + ' words for its wordiest reader');
    if (m > WORDS_AIM) over.push(id + ' (' + m + ')');
  });
  t.diagnostic('over 30 words for the wordiest reader: ' + over.join(', '));
  assert.ok(over.length <= 12, over.join(', '));
  const stats = [];
  const lessonWords = countsLines().reduce((m, x) => m + words(fill(x.text, PROFILES['she-cat'])), 0);
  for (const c of COMBOS) {
    const rows = walkLines(c.flags, c.o);
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(fill(s, PROFILES['she-cat'])), 0));
    const w = per.reduce((a, b) => a + b, 0);
    rows.forEach(r => assert.ok(r.boxes <= 4, r.id + ': ' + r.boxes + ' boxes for ' + comboName(c)));
    stats.push({ n: rows.length, w, avg: w / rows.length, all: readingWords(rows) + lessonWords });
    assert.ok(w / rows.length >= 15 && w / rows.length <= 19, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
    let run = 0, worst = 0;
    rows.forEach(r => { run = r.kind === 'next' ? run + 1 : 0; worst = Math.max(worst, run); });
    assert.ok(worst <= 7, comboName(c) + ': ' + worst + ' panels in a row with nothing to do');
  }
  const mm = f => Math.min(...stats.map(f)).toFixed(1) + '–' + Math.max(...stats.map(f)).toFixed(1);
  t.diagnostic('frames ' + mm(x => x.n) + ', lettering ' + mm(x => x.w) + ' words, ' + mm(x => x.avg) + ' a frame; all she reads ' + mm(x => x.all));
  assert.ok(Math.max(...stats.map(x => x.all)) <= 2000, 'the brief’s 2,000 words, at most');
});

test('a caption the page can letter on the panel is 95 characters at most (the spec’s long lines split at a sentence break, the words unchanged)', () => {
  assert.deepEqual(ids.filter(id => (frames[id].caption || []).some(c => capText(c).length > 95)), []);
  const caps = id => frames[id].caption.map(capText);
  assert.deepEqual(caps('f002'), ['You wake up in your warrior’s nest. The sun is high, and the air smells cold.', 'You kept watch all night, and slept all morning.', 'Your first day as a warrior is half over already!']);
  assert.deepEqual(caps('f031'), ['You purr it first.', 'Then, one by one, the cats join in, till the whole camp is humming her new name.']);
  assert.deepEqual(caps('f039'), ['On the way to the Training Hollow, Chispapaw trots right at your heels.', 'She has questions. Lots of questions.']);
  assert.deepEqual(caps('f080'), ['{name}{ending} sleeps.', 'Across the camp, Chispapaw rolls over, and her tiny bell goes *ting*. Then she sleeps too.', 'End of Chapter Twelve.']);
});

test('every frame has a storyboard: a shot type in caps, then 2–5 sentences, no tokens, nothing an illustrator could draw as scary, no badger', () => {
  const shot = new RegExp('^(' + SHOTS.join('|') + ')\\b[A-Z ,’\\-]*\\.\\s');
  ids.forEach(id => {
    const b = frames[id].board;
    assert.ok(typeof b === 'string' && b.trim().length > 0, id + ': no board');
    assert.match(b, shot, id + ': board must start with a shot type in caps');
    assert.deepEqual(tokensIn(b), [], id + ': tokens in the board');
    assert.doesNotMatch(b, /['"«»]/, id + ': straight quotes or marks in the board');
    const body = b.replace(shot, '');
    const sentences = body.split(/(?<=[.!?][”"]?)\s+(?=[A-Z“"(])/).filter(s => s.trim());
    assert.ok(sentences.length >= 2 && sentences.length <= 5, id + ': board has ' + sentences.length + ' sentences');
    assert.ok(words(body) >= 25, id + ': board too thin');
    assert.doesNotMatch(b, /\b(teeth|fangs?|snarl\w*|blood|bleed\w*|claws? (out )?at|bites?|creep\w*|scary|frighten\w*|twolegs?|kittypets?|thunderpath|ironsnake|whisker-lengths?|starclan|vigil|dark|badgers?)\b/i, id);
  });
  // an option frame says whom it is for; a Tap page what the tap does in play; the Counts, the choices, the input
  ['f025a', 'f025b', 'f025c', 'f037a', 'f037b', 'f037c', 'f040a', 'f040b', 'f051a', 'f051b', 'f052c'].forEach(id => assert.match(frames[id].board.split('. ')[0], /ONLY FOR A CAT WHO/, id));
  ['f026', 'f038', 'f038c'].forEach(id => assert.match(frames[id].board.split('. ')[0], /AFTER/, id));
  ids.filter(id => frames[id].skip || frames[id].scratch).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].choice).forEach(id => assert.match(frames[id].board, /THE CHOICE/, id));
  ids.filter(id => frames[id].input).forEach(id => assert.match(frames[id].board, /sits below the panel/, id));
  assert.match(frames.f001.board, /^CLOSE-UP, THE TITLE PANEL/);
});

test('rendered for a she-cat, a tom and a Murmur, every sentence reads right; a tom reads every line with he and him', (t) => {
  const problems = [];
  const print = !!process.env.PRINT_STORY;
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind];
    if (print) console.log('\n======== ' + kind + ': ' + p.name + p.ending + ', called ' + p.petname);
    let last = null;
    everyText((id, x) => {
      const out = fill(x.text, p, x.extra);
      if (print) { if (id !== last) console.log('\n' + id); last = id; console.log('  ' + x.where + (x.when ? ' ' + JSON.stringify(x.when) : '') + ': ' + out); }
      const bad = badGrammar(out, x.sfx);
      if (bad.length) problems.push(kind + ' ' + id + ' ' + x.where + ': ' + bad.join(', ') + ' | ' + out);
    });
  });
  problems.forEach(s => t.diagnostic(s));
  assert.deepEqual(problems, []);
  assert.equal(fill(frames.f011.say[1].text, PROFILES.tom), 'Stormleap! How REGAL. I’ll need a WEEK to practice it, darling. Until then: Sir Pounce-a-lot.');
  assert.equal(fill(frames.f008.say[0].text, PROFILES.tom), 'Stormleap. The cat who counts what’s missing.');
  assert.equal(fill(frames.f072.say[1].text, PROFILES.tom), 'Goodnight, Stormleap! Will you teach me to catch a mouse?');
  assert.equal(fill(T(DREAM), PROFILES.tom), 'What did Stormleap dream, with a fresh track waiting at first light?');
  assert.equal(fill(frames.f055.caption[0], PROFILES.murmur), 'Mutterchime carries in four mice at once. The old tom carries in ONE.');
  assert.equal(fill(story.book.title, PROFILES.tom), 'Stormleap’s First Frost-Time');
  // the engine fills the same way (the Spanish between its marks)
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind], cat = E.blankCat({});
    cat.name = p.name; cat.ending = p.ending; cat.petname = p.petname; cat.look.sex = p.they === 'he' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => { if (!x.lang) assert.equal(unmark(E.fill(x.text, cat)), fill(x.text, p), kind + ' ' + id + ' ' + x.where); }));
  });
});

test('our own world and the tone: no Warriors or Wings of Fire words, no “borrow”, “StarClan”, “warriors’ den”, “vigil”, “Twoleg”, “kittypet”, “fresh-kill”, “Thunderpath”, “whisker-length” or “claw-length”; nobody new named but Chispapaw; nobody hurt; no grown cat drawn laughing; the badger only as Riffle’s news', () => {
  const banned = /\b(borrow\w*|twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|medicine den|vigil|from this day|from this night|claw-moon|quarter-moon|half-moon|whisker-lengths?|claw-lengths?|fox-lengths?|tail-lengths?|silverpelt|great oak|fourtrees|moonstone|highrock)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, banned, id + ' board'));
  // a take-away is never called a Count; no spreading talk in the chapter's own lines
  everyText((id, x) => { if (id !== 'book') assert.doesNotMatch(x.text, /\b(spread\w*|went)\b/i, id + ' ' + x.where); assert.doesNotMatch(x.text, /take-aways?\b[^.]*\bCounts?\b|\ba Count\b[^.]*take-away/i, id + ' ' + x.where); });
  // the words the brief asks for
  const all = []; everyText((id, x) => all.push(x.text));
  ['take-aways', 'loose', 'a row', 'a square', 'Ones first', 'the store', 'frost-time', 'warrior’s nest', 'apprentices’ den', 'paw thing', 'quick way to scratch a count'].forEach(w => assert.ok(all.some(s => s.includes(w)), w));
  // nobody new named: the balloons' names are hers (and the off-panel voice)
  ids.forEach(id => (frames[id].say || []).forEach(b => { if (b.name) assert.ok(['The little cat', 'A small voice', 'Chispapaw'].includes(b.name), id + ': ' + b.name); }));
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(bites?|bitten|teeth|fangs?|claws? at|snarls?|growls?|kill\w*|strikes?|attacks?|fights?|wound(ed)?|blood|bleed|die[sd]?|dead|death|bones?|drown\w*|creepy|scary|monster|afraid)\b/i, id + ' ' + x.where));
  // the moon's shape is never named (the deadline is “the full moon”, the night it comes)
  everyText((id, x) => assert.doesNotMatch(String(x.text).replace(/by the full moon/g, ''), /full moon|half moon|crescent|waning/i, id + ' ' + x.where));
  // no grown cat in `laugh`, no mentor sad or scared, nobody scared at all; Tallyheart's ears up proud (never laughing)
  ids.forEach(id => frames[id].scene.cast.filter(c => GROWN.includes(c.who)).forEach(c => assert.notEqual(c.mood, 'laugh', id + ': ' + c.who + ' laughing')));
  ids.forEach(id => frames[id].scene.cast.filter(c => ['tallyheart', 'glintstar'].includes(c.who)).forEach(c => assert.ok(!['sad', 'scared', 'worried'].includes(c.mood), id + ': ' + c.who + ' ' + c.mood)));
  ids.forEach(id => frames[id].scene.cast.forEach(c => assert.notEqual(c.mood, 'scared', id)));
  assert.equal(castOf('f025a', 'tallyheart')[0].mood, 'proud');
  assert.equal(castOf('f037c', 'tallyheart')[0].mood, 'proud', 'her “Hmph.”: proud');
  // the badger: Riffle's news, the teaser and the book, never drawn, never described
  assert.deepEqual(FF(/badger/i), ['f066']);
  assert.match(story.teaser.lines[0], /badger track/);
  ids.forEach(id => assert.ok(!frames[id].scene.cast.some(c => /badger/.test(c.who)), id));
  // the grey tom unnamed; no two cats touch noses: no frame draws one
  ids.forEach(id => frames[id].scene.cast.forEach(c => assert.ok(!c.name, id)));
  // the last frame warm: End of Chapter Twelve
  assert.deepEqual(frames[ids[ids.length - 1]].caption.slice(-1), ['End of Chapter Twelve.']);
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the story’s own: every caption, balloon, sound effect, option and Counts line is in docs/chapters/12-a-spark-at-the-hedge.md (the Spanish as the story writes it out), and every line its screens speak is lettered', () => {
  const from = DOC.indexOf('# Chapter 12: A Spark at the Hedge'), to = DOC.indexOf('\n*For us*');
  assert.ok(from === 0 && to > from, 'the story, from its title to its notes');
  const body = DOC.slice(DOC.indexOf('## Noon'), to);
  const flat = s => s.replace(/\*\*/g, '').replace(/\*/g, '').replace(/«|»/g, '').replace(/\s+/g, ' ').trim();
  const loose = s => s.replace(/[,.]/g, '').replace(/\s+/g, ' ').trim();
  const page = flat(body), pageLoose = loose(page);
  const spoken = body.split(/\n\s*\n/).map(p => (flat(p).match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).join(' ')).filter(Boolean).map(loose).join(' ¶ ');
  const inText = s => page.includes(s) || spoken.includes(loose(s)) || pageLoose.includes(loose(s));
  const bySentence = s => s.split(/(?<=[.!?…])\s+/).every(inText);
  // a line as she reads it: the Spanish filled (marks dropped), the cat's tokens kept, the word joiner and italics' stars gone
  const asRead = (s, lang) => (lang === 'es' ? unmark(E.esLine(s, null).split('\n')[0]) : unmark(E.esMarks(s))).replace(/\u2060/g, '').replace(/\*/g, '');
  const mine = [];
  // the one speech tag lettered (f051b, the final review: in the wide shot the picture cannot carry it), the story's own
  // words moved before her balloon, a capital and a colon its only change (spec section 5)
  const LEAD = { 'In her deepest, grumpiest old-tom voice:': 'says Chispapaw, in her deepest, grumpiest old-tom voice.' };
  Object.keys(LEAD).forEach(k => assert.ok(page.includes('“Chips-paw?” ' + LEAD[k]) && LEAD[k].includes(k.charAt(0).toLowerCase() + k.slice(1, -1) + '.'), 'the tag is the story’s: ' + k));
  ids.forEach(id => {
    const f = frames[id];
    (f.caption || []).forEach(c => { const s = asRead(capText(c)); if (!inText(s) && !bySentence(s) && !(id === 'f051b' && LEAD[s])) mine.push(id + ': ' + s); });
    (f.say || []).forEach(b => { const s = asRead(b.text, b.lang); if (!inText(s) && !bySentence(s)) mine.push(id + ' ' + b.who + ': ' + s); });
    if (f.sfx && !page.includes(f.sfx.replace(/!$/, ''))) mine.push(id + ' sfx: ' + f.sfx);
    if (f.choice) f.choice.options.forEach(o => { if (!page.includes(o.label.replace(/^“|”$/g, ''))) mine.push(id + ' option: ' + o.label); });
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '').replace(/!$/, '')), id + ': ' + f.scratch.prompt);
    if (f.skip) assert.ok(page.includes(f.skip.prompt.replace(/\*\*/g, '')), id + ': ' + f.skip.prompt);
  });
  // the Counts sets' lines: the prompts, the right lines, the echoes (the warm-up's for 7 × 8, the lesson's for 475 − 132)
  countsLines().forEach(x => {
    let s = x.text;
    if (x.lang === 'es') s = unmark(E.esLine(s, null, x.set === 'ch12-warm' ? { a: 7, b: 8 } : { a: 475, b: 132, answer: 343 }).split('\n')[0]);
    if (!inText(s) && !bySentence(s)) mine.push('counts ' + x.set + ' ' + x.where + ': ' + s);
  });
  assert.deepEqual(mine, []);
  assert.equal(E.chapterHeading(story), 'Chapter 12: A Spark at the Hedge');
  // and the other way: every line a screen of the story speaks is lettered somewhere in the chapter (the Spanish filled)
  const lettered = [];
  everyText((id, x) => lettered.push(asRead(String(x.text).replace(/\*\*/g, ''), x.lang)));
  lettered.push(unmark(E.skipView(frames.f074.skip, 5).count).replace(/\n/g, ' '));
  lettered.push(unmark(E.esLine('¡{Es:fact}!', null, { a: 7, b: 8 })), unmark(E.esLine('¡{Es:answer}!', null, { answer: 343 })));
  // the kit's lines and the engine's (the lesson's “Done”, the store's prompt) are the sets' or the kit's
  const all = loose(lettered.join(' '));
  const missing = [];
  body.replace(/\*\*([^*]+)\*\*/g, ' ').replace(/\*[^*]*\*/g, ' ').split(/\n\s*\n/).forEach(p => {
    (p.replace(/\s+/g, ' ').replace(/«|»/g, '').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => { if (!all.includes(loose(q)) && !q.split(/(?<=[.!?…,])\s+/).every(s => all.includes(loose(s)))) missing.push(q); });
  });
  assert.deepEqual(missing, []);
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab), camera by camera: every anchor one of its camera’s own (but the named spots), every option the set declares by value (the hollow’s store only 500, the bridge’s only 175 and 133, the moon only 16), the cast, poses, moods and extras, each worn by whom the spec says', () => {
  const v = A.vocab;
  assert.ok(v.cast.includes('chispapaw'), 'Chispapaw drawn');
  assert.ok(v.sets.den.opts.moon.includes(16) && v.sets.garden.anchors.includes('hedge-right') && v.sets.bridge.cams.includes('store'), 'the den’s 16, the hedge’s third spot, the store camera');
  ['store', 'storeGlow', 'tap', 'quick'].forEach(k => assert.ok(v.sets.hollow.opts[k], 'hollow ' + k));
  ['store-left', 'store-right', 'store-back-1', 'store-back-2', 'store-back-3', 'way-in'].forEach(k => assert.ok(v.sets.bridge.anchors.includes(k), k));
  const OLD = { holdAt: ['paws', 'mouth', 'chin'], flatEars: [true], purr: [true] };
  const seen = {}, spots = [];
  ids.forEach(id => {
    const s = frames[id].scene;
    assert.ok(s && typeof s === 'object', id + ': no scene');
    assert.deepEqual(Object.keys(s).filter(k => !['set', 'cam', 'opts', 'cast', 'fx'].includes(k)), [], id + ': scene keys');
    const set = v.sets[s.set], info = A.sceneInfo(s.set);
    assert.ok(set, id + ': unknown set ' + s.set);
    assert.ok(set.cams.includes(s.cam), id + ': set ' + s.set + ' has no camera ' + s.cam);
    assert.ok(['den', 'camp', 'tower', 'garden', 'room', 'hollow', 'riverbank', 'bridge'].includes(s.set), id + ': the spec’s places, no new one');
    const mine = info.anchors[info.cams[s.cam].comp];
    Object.keys(s.opts || {}).forEach(k => {
      const allowed = set.opts[k];
      assert.ok(allowed, id + ': set ' + s.set + ' has no option ' + k);
      const val = s.opts[k];
      if (allowed === 'number') {
        if (k === 'moon') assert.equal(val, 16, id + ': the moon one evening past chapter 11’s');
        else if (s.set === 'hollow') assert.equal(val, 500, id + ': the store’s plan, five hundred');
        else if (s.set === 'bridge') assert.ok([175, 133].includes(val), id + ': the store only at the story’s numbers');
        else assert.fail(id + ': ' + k);
      } else assert.ok(Array.isArray(allowed) && allowed.some(x => same(x, val)), id + ': ' + k + '=' + JSON.stringify(val));
    });
    const used = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'variant'].concat(Object.keys(v.extras), Object.keys(OLD)).includes(k)), [], where + ': keys');
      assert.ok(v.cast.includes(c.who), where + ': unknown who');
      assert.ok(['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'murmurchime', 'clancat', 'riffle', 'chispapaw'].includes(c.who), where + ': nobody new but Chispapaw');
      Object.keys(v.extras).concat(Object.keys(OLD)).forEach(k => {
        if (c[k] === undefined) return;
        const vals = v.extras[k] || OLD[k];
        assert.ok(vals.some(x => same(x, c[k])), where + ': ' + k + '=' + JSON.stringify(c[k]));
        seen[k] = (seen[k] || 0) + 1;
      });
      // who wears what
      if (c.holds === 'mouse') assert.ok(['f054', 'f055', 'f056'].includes(id) && ['clancat', 'murmurchime', 'grizzled', 'player'].includes(c.who) && c.pose === 'walk', where + ': the catch carried in');
      if (c.holds === 'leaf') assert.ok(id === 'f056' && c.who === 'chispapaw', where + ': her leaf, to HELP');
      if (c.holds === 'pebbles') assert.ok(c.who === 'riffle' && camOf(id) === 'bridge/under' && c.pose === 'stand', where + ': held still under the bridge, Otter’s honor');
      if (c.holds !== undefined) assert.ok(['mouse', 'leaf', 'pebbles'].includes(c.holds), where + ': ' + c.holds);
      if (c.holdAt !== undefined) assert.fail(where + ': nothing set down');
      assert.equal(c.collar, undefined, where + ': her collar and bell on (`collar: false` is chapter 13’s)');
      if (c.flatEars) assert.ok(id === 'f023' && c.who === 'chispapaw', where + ': her ears droop at the mutter');
      if (c.tap !== undefined) {
        assert.ok(frames[id].scratch && frames[id].scratch.tap === c.tap, where + ': the tap mark is this page’s Tap');
        assert.equal(c.who, 'player', where + ': every cast Tap is on our cat');
        if (c.tap === 'tail') assert.ok(c.tailUp, where + ': the raised tail');
        if (c.tap === 'paw') assert.ok(['walk', 'sit', 'pawup', 'loaf'].includes(c.pose), where);
        if (c.tap === 'nose') assert.ok(['sit', 'crouch'].includes(c.pose), where);
      }
      if (c.tailUp) assert.ok(['player', 'chispapaw'].includes(c.who), where + ': her tail up, and Chispapaw’s just like hers');
      if (c.purr) assert.ok(frames[id].scene.fx.includes('purr'), where + ': the purr drawn');
      if (c.asleep !== undefined) assert.ok(c.asleep === true && (c.who === 'murmurchime' ? c.pose === 'lie' : c.pose === 'curl'), where + ': asleep, curled (she lies)');
      const poses = CATS.includes(c.who) ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      if (typeof c.at === 'object') {
        assert.ok(Object.keys(c.at).every(k => ['x', 'y', 'h'].includes(k)) && 'x' in c.at && 'y' in c.at, where + ': a spot is { x, y } (with h, as the art gives them)');
        assert.ok(spotName(c.at), where + ': one of the named spots: ' + JSON.stringify(c.at));
        spots.push(id + ':' + c.who + ':' + spotName(c.at));
      } else assert.ok(mine[c.at], where + ': ' + s.set + '/' + s.cam + ' has no anchor ' + c.at + ' (its own: ' + Object.keys(mine).join(' ') + ')');
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      if (c.variant !== undefined) {
        assert.ok(v.variants[c.who], where + ': only ' + Object.keys(v.variants).join('/') + ' have a variant');
        assert.ok(v.variants[c.who].includes(c.variant), where + ': variant ' + c.variant);
        // her cream body is near Clan coat 3: never one beside her
        if (frames[id].scene.cast.some(m => m.who === 'chispapaw')) assert.notEqual(c.variant, 3, where + ': no coat 3 beside Chispapaw');
      } else assert.ok(!v.variants[c.who], where + ': a ' + c.who + ' says which one');
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), id + ': unknown fx ' + e));
    assert.ok(!s.fx.some(e => ['rain', 'lightning', 'bonk'].includes(e)), id + ': no storm');
  });
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'flatEars', 'holds', 'purr', 'tailUp', 'tap']);
  // the spots, each where the staging puts it
  const where = (who, spot) => spots.filter(s => s.endsWith(':' + who + ':' + spot)).map(s => s.split(':')[0]);
  assert.deepEqual(where('player', 'HOL_YOU'), seq('f041', 'f049'));
  assert.deepEqual(where('player', 'NOON_YOU').concat(where('tallyheart', 'NOON_TALLY'), where('murmurchime', 'NOON_CHIME')), ['f005', 'f005', 'f005']);
  assert.deepEqual(where('player', 'RING_YOU'), ['f007', 'f008', 'f009']);
  assert.deepEqual(where('chispapaw', 'NEW_BESIDE'), ['f022']);
  assert.deepEqual(where('grizzled', 'VOUCH_OLD'), ['f024', 'f025a', 'f025b', 'f025c', 'f026']);
  assert.deepEqual(where('player', 'NAME_YOU'), seq('f027', 'f038c'));
  assert.deepEqual(where('grizzled', 'PURR_OLD'), ['f031']);
  assert.deepEqual(where('tallyheart', 'TOWER_TALLY'), ['f010', 'f011']);
  assert.deepEqual(where('chispapaw', 'PATH_CHISPA'), seq('f050', 'f053'));
  // (Tallyheart up ahead the whole way down the path, not only where her ear twitches: the review's round)
  assert.deepEqual(where('tallyheart', 'PATH_TALLY'), ['f050', 'f051a', 'f051b', 'f052', 'f052c', 'f053']);
  assert.deepEqual(where('riffle', 'RIFFLE_UNDER'), ['f063', 'f064', 'f065', 'f066']);
  assert.deepEqual(where('chispapaw', 'RIFFLE_UNDER'), ['f056'], 'Chispapaw carries her leaf in at Riffle’s place, before he comes');
  assert.deepEqual(where('tallyheart', 'PAST'), ['f077']);
});

/* ------------------------------------------------------------------ staging */

const H12 = { marks: 10, glow: 'auto' };
test('staging, the places and their options: her warrior’s nest at noon and by night, the camp by day with the Clan and asleep under the moon, the tower, the hedge, the memory, the Hollow (`H12` on every frame, the plan, the glow, the quick marks), the path, the Old Bridge and the store at 175 then 133, the apprentices’ den', () => {
  const DENW_DAY = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true, miststone: true };
  ids.forEach(id => {
    const s = frames[id].scene, cam = camOf(id);
    if (cam === 'den/nest') assert.deepEqual(s.opts, at(id) < at('f005') ? DENW_DAY : Object.assign({}, DENW_DAY, { moon: 16 }), id);
    if (cam === 'den/inside') assert.deepEqual(s.opts, { weather: 'clear', moon: 16 }, id + ': her old nest plain moss');
    if (s.set === 'camp') assert.deepEqual(s.opts, cam === 'camp/fountain' ? {} : at(id) < at('f070') ? { crowd: true } : { moon: 16 }, id);
    if (s.set === 'tower') assert.deepEqual(s.opts, { chime: true }, id);
    if (s.set === 'garden') assert.deepEqual(s.opts, {}, id + ': no sparrows on the hedge');
    if (s.set === 'hollow') {
      assert.equal(s.cam, 'lesson', id);
      assert.deepEqual([s.opts.marks, s.opts.glow], [10, 'auto'], id + ': her ten claw marks, as chapters 2 to 11 carry them');
    }
    if (cam === 'bridge/bank') assert.deepEqual(s.opts, { drag: false }, id);
    if (cam === 'bridge/under') assert.deepEqual(s.opts, { prints: true }, id);
    if (cam === 'bridge/back') assert.deepEqual(s.opts, { stones: true, prints: true }, id);
    if (s.set === 'riverbank') assert.deepEqual([s.cam, s.opts], ['path', {}], id);
  });
  assert.deepEqual(ids.filter(id => frames[id].scene.set === 'hollow').map(id => frames[id].scene.opts), [H12, H12, H12, Object.assign({}, H12, { store: 500, tap: 'squares' }),
    Object.assign({}, H12, { store: 500, storeGlow: 'hundreds' }), Object.assign({}, H12, { quick: 1 }), Object.assign({}, H12, { quick: 2 }), Object.assign({}, H12, { quick: 3 }), Object.assign({}, H12, { quick: 3 })]);
  assert.deepEqual(seq('f041', 'f049'), ids.filter(id => frames[id].scene.set === 'hollow'));
  assert.deepEqual(ids.filter(id => camOf(id) === 'bridge/store').map(id => frames[id].scene.opts), [{ store: 175 }, { store: 175 }, { store: 133, tap: 'store' }, { store: 133 }]);
  assert.deepEqual(ids.filter(id => camOf(id) === 'bridge/store'), ['f058', 'f059', 'f060', 'f061'], 'no frame draws the store while it is carried in');
  assert.deepEqual([camOf('f016'), frames.f016.scene.opts, frames.f016.scene.cast, frames.f016.scene.fx], ['room/outside', { door: 'closed', clan: true }, [], ['dusk']], 'the memory: chapter 1’s view');
  assert.deepEqual([camOf('f023'), frames.f023.scene.cast.map(c => [c.who, c.at, c.mood, c.flatEars])], ['camp/entrance', [['chispapaw', 'entrance', 'sad', true]]], 'the mutter: chapter 1’s own shot');
  assert.deepEqual(['f006', 'f010', 'f012', 'f014', 'f019', 'f031'].map(camOf), ['camp/fountain', 'tower/up', 'tower/balcony', 'garden/hedge-close', 'tower/balcony-close', 'camp/purr']);
  // the camp's cameras vary through the vouching and the naming
  const camps = seq('f022', 'f040b').map(camOf);
  ['camp/reveal', 'camp/crowd', 'camp/entrance', 'camp/purr'].forEach(cm => assert.ok(camps.includes(cm), cm));
});

test('staging, the people: Glintstar at the fountain’s foot for the count and on top for the store, down again for the naming; the hedge three in a row (our cat, the little cat between, Tallyheart at the right edge); the vouching and the naming; the Hollow; the walk; the store’s six back to front; Riffle; the nests', () => {
  assert.deepEqual(castOf('f005', 'glintstar').map(c => [c.at, c.pose]), [['fountain-foot', 'stand']]);
  ['f006', 'f007', 'f008', 'f009', 'f022'].forEach(id => assert.equal(castOf(id, 'glintstar')[0].at, 'fountain-top', id));
  seq('f027', 'f038c').filter(id => castOf(id, 'glintstar').length).forEach(id => assert.equal(castOf(id, 'glintstar')[0].at, 'fountain-foot', id + ': come down'));
  assert.equal(castOf('f027', 'glintstar')[0].pose, 'walk', 'coming down');
  // the hedge: the little cat at the gap, facing in (her nose in it), then facing our cat; Tallyheart at `hedge-right`
  seq('f013', 'f021').filter(id => frames[id].scene.set === 'garden').forEach(id => {
    assert.deepEqual(castOf(id, 'player').map(c => c.at), ['hedge-side'], id);
    if (camOf(id) === 'garden/hedge') assert.deepEqual(castOf(id, 'tallyheart').map(c => [c.at, c.facing]), [['hedge-right', 'left']], id);
  });
  assert.equal(castOf('f013', 'chispapaw').length, 0, 'not drawn yet: something rustles');
  assert.deepEqual(['f014', 'f015', 'f017', 'f018', 'f020', 'f021'].map(id => castOf(id, 'chispapaw').map(c => c.at + ':' + c.facing)[0]),
    ['hedge-gap:right', 'hedge-gap:right', 'hedge-gap:left', 'hedge-gap:left', 'hedge-gap:left', 'hedge-gap:left']);
  assert.equal(frames.f014.scene.cast[0].who, 'chispapaw', 'the close-up framed on her head');
  assert.deepEqual(castOf('f021', 'player').map(c => [c.pose, c.tap]), [['walk', 'paw']]);
  // no crowd to count on the doce frame: the hedge is a wall
  assert.ok(!frames.f014.scene.cast.some(c => c.who === 'clancat') && frames.f014.scene.set === 'garden');
  // the vouching: the little cat beside our cat, the old tom facing them; she faces him, but turns to our cat to whisper
  // her thanks (f025a, f026); Glintstar on the fountain top throughout, as on f022, till f027 brings her down (the
  // review's round)
  ['f024', 'f025a', 'f025b', 'f025c', 'f026'].forEach(id => {
    assert.deepEqual(castOf(id, 'grizzled').map(c => c.facing), ['left'], id);
    assert.deepEqual(castOf(id, 'chispapaw').map(c => c.facing), [['f025a', 'f026'].includes(id) ? 'left' : 'right'], id);
    assert.ok(castOf(id, 'tallyheart').length && castOf(id, 'clancat').length === 2, id);
    assert.deepEqual(castOf(id, 'glintstar').map(c => [c.at, c.pose, c.facing]), [['fountain-top', 'sit', 'left']], id + ': Glintstar on the fountain top');
  });
  ['f022', 'f024', 'f025a', 'f025b', 'f025c', 'f026'].forEach(id => assert.equal(castOf(id, 'glintstar')[0].at, 'fountain-top', id));
  assert.equal(castOf('f027', 'glintstar')[0].at, 'fountain-foot', 'f027: she comes down');
  ['f025a', 'f026'].forEach(id => assert.match(frames[id].say[0].text, /^Thank you\.$/, id + ': the thanks, to our cat'));
  assert.deepEqual(castOf('f025c', 'clancat').map(c => c.mood), ['happy', 'happy'], 'f025c: the two Clan cats hide grins');
  assert.deepEqual(castOf('f031', 'grizzled').map(c => [c.mood, c.purr]), [['stern', true]], 'f031: the old tom purrs, frowning at the new word');
  // the whole camp hums (the caption): our cat, Glintstar, Tallyheart and the old tom purr, the crowd behind them with its
  // eyes shut; the little cat in the middle of it does not (the final review)
  assert.deepEqual(frames.f031.scene.cast.filter(c => c.purr).map(c => c.who).sort(), ['glintstar', 'grizzled', 'player', 'tallyheart'], 'f031: four purr');
  assert.ok(!castOf('f031', 'chispapaw')[0].purr, 'f031: she is purred at, astonished');
  // given to our cat, Chispapaw looks up at her mentor and stays turned to her (f036 to f038c: the review's round)
  seq('f036', 'f038c').forEach(id => assert.deepEqual(castOf(id, 'chispapaw').map(c => c.facing), ['right'], id + ': facing our cat'));
  assert.deepEqual(castOf('f036', 'chispapaw').map(c => c.pose), ['lookup']);
  assert.deepEqual(castOf('f037b', 'chispapaw').map(c => [c.pose, c.mood]), [['stand', 'wonder']], 'f037b: puzzled');
  seq('f036', 'f038c').forEach(id => assert.ok(castOf(id, 'player')[0].at.x > A.sceneInfo('camp').anchors.main.center.x, id + ': our cat on her right'));
  assert.deepEqual(castOf('f032', 'chispapaw').map(c => [c.pose, c.mood]), [['stand', 'happy']]);
  assert.deepEqual([frames.f032.scene.cast[0].who, frames.f032.scene.fx], ['chispapaw', ['day', 'motion']], 'her bounce: the motion lines hers');
  // f064: no `motion` (it draws speed streaks behind the first cast member: Riffle read as rushing off, against “He holds very,
  // very still”); the cast back to front, as under the bridge (the review's round)
  assert.deepEqual([frames.f064.scene.cast.map(c => c.who), frames.f064.scene.fx], [['tallyheart', 'chispapaw', 'player', 'riffle'], ['sunset']], 'his paws twitch: the caption carries it');
  assert.deepEqual(ids.filter(id => frames[id].scene.fx.includes('motion')), ['f032'], 'the bounce alone');
  assert.deepEqual(castOf('f035', 'player').map(c => [c.tailUp, c.tap]), [[true, 'nose']]);
  ['f037a', 'f038', 'f038c'].forEach(id => assert.equal(castOf(id, 'chispapaw')[0].tailUp, true, id + ': her tail up too'));
  assert.equal(castOf('f037a', 'chispapaw')[0].purr, true);
  assert.deepEqual(castOf('f051b', 'chispapaw').map(c => c.mood), ['stern'], 'her old-tom voice');
  // the Hollow: Tallyheart at the tree facing left, our cat at HOL_YOU facing right, sitting (a crouch reaches the marks), Chispapaw behind her
  seq('f041', 'f049').forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => [c.who, typeof c.at === 'object' ? spotName(c.at) : c.at, c.facing, c.pose]),
    [['chispapaw', 'sunpatch-3', 'right', 'sit'], ['tallyheart', 'tree', 'left', 'sit'], ['player', 'HOL_YOU', 'right', 'sit']], id));
  // the walk: Chispapaw behind our cat, copying
  seq('f050', 'f053').forEach(id => assert.deepEqual(castOf(id, 'chispapaw').concat(castOf(id, 'player')).map(c => [c.pose, c.facing]), [['walk', 'right'], ['walk', 'right']], id));
  // the store: the six at its spots, listed back to front as the sets owner reports their depth
  seq('f058', 'f061').forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => c.who + '@' + c.at),
    ['murmurchime@store-back-3', 'tallyheart@store-back-2', 'glintstar@store-back-1', 'grizzled@way-in', 'player@store-left', 'chispapaw@store-right'], id));
  // Riffle: a wet head over the bank, holding his pebbles under the bridge (never juggling there, never a hug), off home with a dive
  assert.deepEqual(['f062', 'f063', 'f064', 'f065', 'f066', 'f067'].map(id => castOf(id, 'riffle').map(c => c.pose + ':' + (c.holds || ''))[0]),
    ['swim:', 'stand:pebbles', 'stand:pebbles', 'stand:pebbles', 'stand:pebbles', 'dive:']);
  ids.forEach(id => castOf(id, 'riffle').forEach(c => assert.ok(!['juggle', 'hug'].includes(c.pose), id)));
  assert.deepEqual([castOf('f068', 'riffle').length, castOf('f069', 'riffle').length], [0, 0], 'off he goes');
  // the nests: our cat in hers on every nest frame, {Murmur}chime in the next nest (out on patrol at first); asleep as the story says
  ids.filter(id => camOf(id) === 'den/nest').forEach(id => assert.deepEqual(castOf(id, 'player').map(c => c.at), ['nest'], id));
  assert.deepEqual(['f001', 'f002'].map(id => castOf(id, 'murmurchime').length), [0, 0], 'the next nest empty: she is on patrol');
  ['f003', 'f004', 'f071', 'f072', 'f076', 'f077', 'f078', 'f079'].forEach(id => assert.deepEqual(castOf(id, 'murmurchime').map(c => c.at), ['next-nest'], id));
  assert.deepEqual(['f076', 'f077', 'f078', 'f079'].map(id => castOf(id, 'murmurchime')[0].asleep), [true, true, true, true]);
  assert.deepEqual(['f001', 'f078', 'f079'].map(id => castOf(id, 'player')[0].pose + ':' + castOf(id, 'player')[0].asleep), ['curl:true', 'curl:true', 'curl:true']);
  ['f071', 'f076', 'f077', 'f078'].forEach(id => assert.ok(castOf(id, 'player').length, id + ': our cat in her nest'));
  // the apprentices' den: the grey tom and Chispapaw in our cat's old nest; asleep at the end
  ['f073', 'f074', 'f075', 'f080'].forEach(id => assert.deepEqual([camOf(id), castOf(id, 'snorer').map(c => c.at), castOf(id, 'chispapaw').map(c => c.at)], ['den/inside', ['sleeper-1'], ['nest']], id));
  assert.deepEqual(castOf('f075', 'snorer').map(c => [c.pose, c.asleep]), [['curl', true]]);
  assert.deepEqual(castOf('f080', 'chispapaw').map(c => [c.pose, c.asleep]), [['curl', true]]);
  ids.filter(id => frames[id].scene.fx.includes('sparkle')).forEach(id => assert.ok(['player', 'chispapaw'].includes(frames[id].scene.cast[0].who), id + ': the sparkle round her'));
});

test('no two cats touch: every pair on the same row of every frame a step apart, and Chispapaw clear of everyone (the hedge, the Hollow, the store, the walk); a farther cat’s face is never under a nearer cat', { skip: !A.character && 'no cats.js' }, (t) => {
  let least = Infinity;
  const bad = [];
  ids.forEach(id => {
    const b = boxesOn(id).filter(Boolean);
    for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
      const p = b[i], q = b[j], gap = gapOf(p.body, q.body), sameRow = Math.abs(p.a.y - q.a.y) < 40, chispa = p.m.who === 'chispapaw' || q.m.who === 'chispapaw';
      const elev = p.a.elev || q.a.elev;
      if (!elev && (sameRow || (chispa && !['f056'].includes(id)))) {
        least = Math.min(least, gap);
        if (gap < 4 && !(id === 'f077')) bad.push(id + ': ' + p.m.who + ' and ' + q.m.who + ' (' + Math.round(gap) + ')');
      }
      // a face is never hidden: the farther cat's head box at most a fifth under the nearer one's body
      if (!elev) {
        const far = p.a.y <= q.a.y ? p : q, near = far === p ? q : p;
        if (cover(far.head, near.body) > 0.2) bad.push(id + ': ' + far.m.who + '’s face under ' + near.m.who);
      }
    }
  });
  assert.deepEqual(bad, []);
  t.diagnostic('the nearest two on a row: ' + Math.round(least));
  // f077: Tallyheart padding past at the close-up's right edge, a step nearer than the nests and listed last (drawn over
  // them: behind the nest, our cat's raised tail crossed her face, looked at in a render), our cat's face clear of her,
  // her own face in the panel
  const b77 = boxesOn('f077'), ta = b77.find(x => x && x.m.who === 'tallyheart'), pl = b77.find(x => x && x.m.who === 'player');
  assert.equal(frames.f077.scene.cast[frames.f077.scene.cast.length - 1].who, 'tallyheart');
  assert.ok(ta.a.y > pl.a.y && cover(pl.head, ta.body) < 0.05, 'f077: our cat’s face clear (' + cover(pl.head, ta.body).toFixed(2) + ')');
  assert.ok((ta.head[0] + ta.head[2]) / 2 < 1260, 'f077: her face in the close-up');
});

/* The depth check: on every frame, where the farther of two cast members has a body that meets the nearer one's head, the
 * farther is drawn first (listed first); and every cast is listed back to front. */
test('staging, depth: a cast member further back is never drawn over a nearer one’s head; every cast listed back to front (the fountain top, raised, anywhere; the bounce’s first member excepted; the den’s nests as the close-up lays them)', { skip: !A.character && 'no cats.js' }, () => {
  const bad = [];
  ids.forEach(id => {
    const sc = frames[id].scene, b = boxesOn(id);
    b.forEach((far, fi) => b.forEach((near, ni) => {
      if (!far || !near || far === near) return;
      const fa = anchorOf(sc, far.m), na = anchorOf(sc, near.m);
      if (fa.elev || na.elev || fa.y >= na.y || !meets(far.body, near.head)) return;
      if (fi > ni) bad.push(id + ': ' + far.m.who + ' drawn over ' + near.m.who + '’s head');
    }));
    const info = A.sceneInfo(sc.set), anchors = info.anchors[info.cams[sc.cam].comp] || {};
    const ys = sc.cast.filter((c, i) => !(id === 'f032' && i === 0)).filter(c => typeof c.at === 'object' || (anchors[c.at] && !anchors[c.at].elev)).map(c => (typeof c.at === 'object' ? c.at : anchors[c.at]).y);
    for (let i = 1; i < ys.length; i++) assert.ok(ys[i] >= ys[i - 1] || sc.set === 'den', id + ': cast ' + i + ' further back than the one before it (' + ys.join(' ') + ')');
  });
  assert.deepEqual(bad, []);
});

// the purr words (scenes.js fxPurr): a marked purrer's word beside her back was checked only against the panel's edge; on
// f037a it was lettered across our cat's face and on f031 across Tallyheart's chin (the review's round). Now it is left out
// where it meets any other cast member's head, and the word over her own head stays
test('the purr words keep off every friend’s face: on the naming’s purrs (f031, f037a) no ‘purrr’ lies over another cast member’s head, nor beside a back over a friend’s body, and every purrer still has one', { skip: !A.character && 'no cats.js' }, () => {
  for (const id of ['f031', 'f037a']) {
    const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose' } });
    const sc = E.resolveScene(frames[id].scene, cat, STORIES), svg = A.render(sc, { look: LOOKD }).svg, b = boxesOn(id);
    const words = [...svg.matchAll(/<text x="([\d.-]+)" y="([\d.-]+)"[^>]*font-size="([\d.]+)"[^>]*>purrr<\/text>/g)].map((m) => { const x = +m[1], y = +m[2], ws = +m[3] / 46; return [x - 60 * ws, y - 40 * ws, x + 60 * ws, y + 8 * ws]; });
    // (the fx are drawn in panel units, 1600 x 1000 over the camera's box, the viewBox: the heads mapped into them)
    const vb = /viewBox="([^"]+)"/.exec(svg)[1].split(' ').map(Number), P = (h) => [(h[0] - vb[0]) / vb[2] * 1600, (h[1] - vb[1]) / vb[3] * 1000, (h[2] - vb[0]) / vb[2] * 1600, (h[3] - vb[1]) / vb[3] * 1000];
    b.forEach((x) => { if (x) x.head = P(x.head); });
    const purrers = sc.cast.filter((m) => m.purr).length;
    assert.ok(purrers && words.length >= purrers, id + ': a word for each purrer (' + words.length + ' for ' + purrers + ')');
    words.forEach((w) => b.forEach((x) => {
      if (!x) return;
      // her own word over her own head leans back from it; another cat's head is never under a word
      const own = x.m.purr && Math.abs((w[0] + w[2]) / 2 - (x.head[0] + x.head[2]) / 2) < 140 && w[3] <= x.head[1] + 20;
      if (!own) assert.ok(!meets(w, x.head), id + ': a purrr over ' + x.m.who + '’s face (' + w.map(Math.round) + ' on ' + x.head.map(Math.round) + ')');
    }));
    // and a word beside her back keeps off a friend's body too: on f031, where four purr side by side, each word is one
    // purrer's own over her head (Glintstar's beside her back lay across the old tom's chest: the final review)
    if (id === 'f031') {
      assert.equal(words.length, purrers, 'f031: one word each');
      words.forEach((w) => assert.ok(b.some((x) => x && x.m.purr && Math.abs((w[0] + w[2]) / 2 - (x.head[0] + x.head[2]) / 2) < 140 && w[3] <= x.head[1] + 20), 'f031: ' + w.map(Math.round) + ' over a purrer’s own head'));
    }
  }
});

// the time of day: her nest at noon by the morning light, the midday run by day, the Old Bridge at sunset, bedtime by night
const DAYS = [['f001', 'f004', 'morning'], ['f005', 'f053', 'day'], ['f054', 'f069', 'sunset'], ['f070', 'f080', 'night']];
test('the time of day runs morning in her nest at noon, day from the midday count to the walk (the sets owner found every day look right), sunset at the Old Bridge, night from the moon to the end; the memory at dusk; never dark', () => {
  ids.forEach(id => {
    const day = DAYS.find(([a, b]) => at(id) >= at(a) && at(id) <= at(b));
    assert.ok(day, id);
    const want = id === 'f016' ? 'dusk' : day[2];
    assert.equal(frames[id].scene.fx.filter(x => ['morning', 'day', 'sunset', 'dusk', 'night'].includes(x)).join(), want, id);
  });
});

test('the storyboard is this chapter’s: every frame, the option frames in their branches, the Spanish as *[es]*, the new art in words', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch12.md'), 'utf8');
  assert.match(md, /^# Storyboard: Chapter 12, A Spark at the Hedge/);
  ids.forEach(id => assert.match(md, new RegExp('^#{3,5} ' + id + '\\b', 'm'), id + ' in the storyboard'));
  assert.doesNotMatch(md, /Not reachable from the start/);
  assert.doesNotMatch(md, /STUB/);
  assert.match(md, /\| Frames \| 88 /);
  assert.match(md, /\*\[es\]\*/);
  assert.match(md, /«Galleta»/);
  assert.match(md, /Chispapaw, a small cream pillow cat/);
});

test('the shots vary like a graphic novel', () => {
  const shotOf = id => SHOTS.find(s => frames[id].board.startsWith(s));
  const used = new Set(ids.map(shotOf));
  ['WIDE', 'MEDIUM', 'CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE'].forEach(s => assert.ok(used.has(s), s));
  let run = 0, worst = 0;
  ids.forEach((id, i) => { run = i && shotOf(id) === shotOf(ids[i - 1]) && camOf(id) === camOf(ids[i - 1]) ? run + 1 : 1; worst = Math.max(worst, run); });
  assert.ok(worst <= 13, 'the same shot on the same camera ' + worst + ' panels running');
  ['reveal', 'crowd', 'fountain', 'entrance', 'purr'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'camp/' + cam), cam));
  ['inside', 'nest'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'den/' + cam), cam));
  ['bank', 'under', 'back', 'store'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'bridge/' + cam), cam));
});

/* ------------------------------------------------------------------ every frame drawn */

test('every frame renders, and everyone in the cast is in the picture; every Tap has its target in the art; the moon drawn by night; Chispapaw drawn with her collar; the Counts pictures and the paw thing all draw', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'brown-tabby', marking: 'white-paws', eyes: 'odd' }, { sex: 'she', fur: 'cream', marking: 'none', eyes: 'blue' }];
  const off = [];
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', ch10Best: 'truth', specialty: 'noticing' } });
  const SMALL = id => ['camp/reveal', 'camp/purr', 'den/inside', 'tower/up', 'riverbank/path', 'bridge/bank', 'bridge/store', 'bridge/under'].includes(camOf(id));
  ids.forEach(id => looks.forEach((look, k) => {
    const f = frames[id], sc = E.resolveScene(f.scene, cat, STORIES), cast = sc.cast;
    const r = A.render(sc, { look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(r.svg), id + ': no svg');
    assert.ok(Array.isArray(r.heads) && r.heads.length === cast.length, id + ': heads');
    (f.say || []).forEach(b => { if (castOf(id, b.who).length) assert.ok(cast.some((c, i) => c.who === b.who && r.heads[i]), id + ': speaker ' + b.who + ' has no head on the panel'); });
    if (k === 0) cast.forEach((c, i) => {
      const h = r.heads[i];
      if (!h) off.push(id + ' ' + c.who + '@' + JSON.stringify(c.at) + ' (' + sc.set + '/' + sc.cam + ')');
      else {
        if (!SMALL(id) && !(camOf(id) === 'tower/up')) assert.ok(h.r >= 3, id + ': ' + c.who + ' face radius ' + h.r);
        assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, id + ': ' + c.who + ' head in the panel');
      }
    });
    // speakers speak from two faces, never one on top of another
    if (k === 0) {
      const sp = [...new Set((f.say || []).map(b => b.who))].map(w => cast.findIndex(c => c.who === w)).filter(i => i >= 0 && r.heads[i]);
      for (let i = 0; i < sp.length; i++) for (let j = i + 1; j < sp.length; j++) {
        const a = r.heads[sp[i]], b = r.heads[sp[j]];
        assert.ok(Math.hypot(a.x - b.x, (a.y - b.y) * 0.625) > (a.r + b.r) * 0.9, id + ': ' + cast[sp[i]].who + ' and ' + cast[sp[j]].who + ' speak from two faces');
      }
    }
    if (k === 0 && sc.set === 'camp' && sc.cam !== 'entrance' && sc.cam !== 'fountain') assert.equal(/data-prop="camp-moon"/.test(r.svg), !!sc.opts.moon, id + ': the moon by night');
  }));
  // (Waffles' balcony on `up` is drawn far off, nineteen floors up: her head only)
  assert.deepEqual(off, [], 'cast members out of the camera’s sight');
  // every one-tap frame has its target in the picture, the one the page picks for this frame's tap
  ids.filter(id => frames[id].scratch).forEach(id => {
    const svg = A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg, tap = frames[id].scratch.tap;
    assert.match(svg, new RegExp('class="pc-tap pc-tap-' + tap + '"|data-tap="' + tap + '"'), id + ': the ' + tap + ' to tap is in the picture');
    const marks = (svg.match(/<[^>]*(?:class="[^"]*pc-tap[^"]*"|data-tap="[^"]*"|data-art="glint")[^>]*>/g) || []).map(el => ({ tap: (/data-tap="([^"]*)"/.exec(el) || [])[1] || null, art: (/data-art="([^"]*)"/.exec(el) || [])[1] || null, cls: (/class="([^"]*)"/.exec(el) || [])[1] || null }));
    const picked = UI.taps.pick(marks, tap);
    assert.ok(picked >= 0, id + ': the page finds a mark for ' + tap);
    assert.ok((marks[picked].cls || '').includes('pc-tap-' + tap) || marks[picked].tap === tap, id + ': and it is the ' + tap);
  });
  // the hollow's plan (five squares) and the quick marks; the store's two numbers, 133 where 175 lay
  const svgOf = id => A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg;
  assert.notEqual(svgOf('f044'), svgOf('f045'), 'the glow drawn');
  assert.ok(new Set(['f046', 'f047', 'f048'].map(svgOf)).size === 3, 'a set of marks more each time');
  assert.notEqual(svgOf('f058'), svgOf('f061'), '175, then 133');
  // the Counts pictures: the take pages' store and the paw thing, tap by tap
  const pics = [];
  for (let n = 0; n <= 5; n++) looks.forEach(look => pics.push(A.countsPicture(Object.assign({ look }, E.skipPicture(E.skipFor(frames.f074.skip, cat), n)))));
  [[254, 131], [58, 23], [475, 132], [175, 42]].forEach(([a, b]) => pics.push(A.placeValue({ hundreds: Math.floor(a / 100), tens: Math.floor(a / 10) % 10, ones: a % 10, kind: 'store' })));
  pics.forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
});

/* ------------------------------------------------------------------ the beats, on every path */

test('the chapter’s beats are all there, in order, on every path: every reader’s panels follow the story’s screens, the path-only lines exactly where her flags and choices say', () => {
  const B = [/^Chapter 12: A Spark at the Hedge$/, /^You wake up in your warrior’s nest\./, /^Warriors don’t sleep till NOON\./, /^I know\. I’m just jealous\./, /^At the midday count, there’s news\./,
    /^Glintstar leaps up onto the fountain\./, /^Five hundred pieces, by the full moon\./, /^She looks straight at you\./, /^Five HUNDRED\?/, /^You and Tallyheart pad out to the hedge\./,
    /^\{name\}\{ending\}!/, /^And NEWS!/, /^Something rustles at the foot of the hedge\./, /^A small cream cat has her nose in the gap/, /^Remember when that was you\?/, /^You do\. You watched this Clan/,
    /^The little cat peeks up at you\./, /^My Tall Ones call me/, /^High above, Waffles shrieks\./, /^My Tall Ones leave the door open\./, /^Tallyheart tips her head at the gap\./,
    /^The little cat’s eyes go round\./, /^The Clan mutters/, /^You step up beside her\./, /The muttering stops\./, /^Glintstar comes down from the fountain\./, /^The little cat sits up very straight\./,
    /^Glintstar’s whiskers twitch\./, /^Chispapaw\.$/, /^You purr it first\./, /^Chispapaw can’t help it\./, /^Every apprentice needs a mentor\./, /^Glintstar looks right at you\./,
    /^Your very own apprentice!/, /^Chispapaw looks up at you, eyes shining\./, /Now you know how I felt|That’s MY line|Ready!/, /^On the way to the Training Hollow/, /The dragon story at the store\./,
    /^Warriors have LESSONS\?/, /Like when I take away my Tall One’s socks\? Yes! Then we count what’s left\. First, three Counts/, /^Here’s what the Counts are FOR\./, /^We’ll lay the store out like the pile\./, /^Five hundred is five squares\./,
    /^In the sand, there’s a quick way/, /^Chispapaw scratches one too\./, /^Here’s the trick\./, /^Ones first, every time\./, /^Down to the Old Bridge/, /I’ll show them\. Like you did\./,
    /^You walk the rest of the way/, /^The sun sinks behind the Old Bridge\./, /carries in four mice at once/, /^Chispapaw carries in a leaf\./, /^You tell Chispapaw the dragon story/,
    /^The catch lies on the dry den’s floor\./, /^One hundred seventy-five pieces today\./, /^Now read me the store\./, /^One square, three rows, three loose\./, /^A wet head pops up over the bank\./,
    /^Under the bridge, he has his pebbles/, /^His paws twitch\./, /^He spots Chispapaw\./, /^Riffle can’t hold still/, /^See you at first light!/, /^Off he goes, pebbles and all\./,
    /^The track on Gathering Island was old\./, /^The moon comes up over camp/, /^Your warrior’s nest is soft and deep\./, /^Your first day\./, /^In the apprentices’ den/, /^You do the paws\./,
    /^By \{es:50\}, the grey tom is snoring\./, /^Mice…/, /^A good day’s work, warrior\./, /^Today, you woke up a brand-new warrior\./, /^What did \{name\}\{ending\} dream/, /^\{name\}\{ending\} sleeps\./];
  for (const c of COMBOS) {
    const rows = walkLines(c.flags, c.o), name = comboName(c);
    const said = rows.map(r => r.lines.join(' ')), joined = said.join(' ¶ ');
    let i = 0;
    B.forEach(re => {
      const j = said.findIndex((s, k) => k >= i && re.test(s));
      assert.ok(j >= 0, name + ': ' + re + ' after ' + rows[Math.max(0, i - 1)].id);
      i = j + 1;
    });
    const spec = { noticing: /You spot her first/, climbing: /You hop up onto the hedge-top/, sneaking: /You creep closer without a sound/, friends: /¶ Hello\. ¶|^Hello\.| Hello\. /, swimming: /Too cold for a swim today/ };
    Object.keys(spec).forEach(s => assert.equal(spec[s].test(joined), c.flags.specialty === s, name + ': ' + s));
    const best = { sprinkle: /Sprinkle slept here once\./, friends: /You met a friend with wings in this den\./, truth: /You found a dragon here, and the truth/, counts: /A dry den, and a whole store to count\./ };
    Object.keys(best).forEach(b => assert.equal(best[b].test(joined), c.flags.ch10Best === b, name + ': ' + b));
    assert.equal(/Riffle’s stone is by your nose\./.test(joined), c.flags.ch2Stone === 'nose', name);
    assert.equal(/Riffle’s stone is under your chin\./.test(joined), c.flags.ch2Stone === 'chin', name);
    // at most one line each where a flag reads
    const lines13 = rowsOf(rows, 'f013'), lines57 = rowsOf(rows, 'f057'), lines71 = rowsOf(rows, 'f071');
    assert.ok(lines13.boxes <= 2 && lines57.boxes <= 2 && lines71.boxes <= 4, name);
    // the replies: each only on its path
    assert.equal(/You said it just the way she once said it for you\./.test(joined), c.o.vouch === 0, name);
    assert.equal(/YOU turned out all right\./.test(joined), c.o.vouch === 1, name);
    assert.equal(/I can count in ONE very well\./.test(joined), c.o.vouch === 2, name);
    assert.equal((joined.match(/Thank you\./g) || []).length, 1, name + ': thanked once');
    assert.equal(/purrs so hard her whiskers shake/.test(joined), c.o.first === 0, name);
    assert.equal(/What’s work\?/.test(joined), c.o.first === 1, name);
    assert.equal(/That’s MY line\. Hmph\./.test(joined) && /She looks very proud\./.test(joined), c.o.first === 2, name);
    assert.equal((joined.match(/Now you know how I felt, the day you came\./g) || []).length, 1, name);
    assert.equal((joined.match(/Chispapaw’s tail goes up too, just like yours\./g) || []).length, 1, name);
    assert.equal(/A DRAGON\?!/.test(joined), c.o.ask === 0, name);
    assert.equal(/Okay\. DRAGON first\./.test(joined), c.o.ask === 1, name);
    assert.equal(/I can do not-for-long\./.test(joined), c.o.walk === 0, name);
    assert.equal(/She heard\./.test(joined), c.o.walk === 2, name);
    assert.equal((joined.match(/Chispapaw’s whiskers lift\./g) || []).length, 1, name);
  }
});
function rowsOf(rows, id) { return rows.find(r => r.id === id) || { boxes: 0 }; }

/* ------------------------------------------------------------------ counts */

const TH = text => ({ who: 'tallyheart', text });
const WARM = {
  teacher: 'tallyheart',
  warmHard: { table: 'all', at: [0, 1], alt: [{ a: 3, b: 8, table: 3 }, { a: 4, b: 7, table: 4 }, { a: 9, b: 6, table: 9 }] },
  facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }],
  praise: [], fast: [], done: '',
  echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }, { who: 'chispapaw', text: 'My little Tall One says these every night! I never knew what they MEANT.' }] }
};
const TAKE = {
  op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
  facts: [
    { a: 254, b: 131, regroup: 'show', prompt: 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.', right: [TH('One square, two rows, three loose left.')] },
    { a: 58, b: 23, prompt: [TH('Now you try, all by yourself. Little take-aways first, then big.')] },
    { a: 76, b: 42, prompt: [{ who: 'chispapaw', kind: 'whisper', text: 'My little Tall One always sighs at homework.' }] },
    [475, 132], [368, 145]
  ],
  echo: { on: [[475, 132]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] }
};
const STORE = {
  op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, twins: false, done: '',
  facts: [{ a: 175, b: 42, prompt: [{ who: 'glintstar', text: 'How many stay in the store, {name}{ending}?' }], right: [{ who: 'glintstar', text: 'One hundred thirty-three in the store.' }] }]
};
const SIETE = '«¡Siete por ocho, cincuenta y seis!»\n(Seven times eight, fifty-six!)', MEANT = 'My little Tall One says these every night! I never knew what they MEANT.';
const TRES = '«¡Trescientos cuarenta y tres!»\n(Three hundred forty-three!)';
/* her hard Counts, as E.warriorHard gives them: stood in for, for the warm-up's pick cases */
function withHard(picks, fn) {
  const keep = E.warriorHard;
  E.warriorHard = () => picks.map(p => p.slice());
  try { return fn(); } finally { E.warriorHard = keep; }
}

test('counts: the three sets exactly as the spec has them (section 2); the Counts claims pinned: no new Count, the 10s still chapter 4’s, every take-away of kind `none` with every answer different; nine typed answers on every reading', () => {
  assert.deepEqual(Object.keys(story.counts), ['ch12-warm', 'ch12-take', 'ch12-store']);
  assert.deepEqual(story.counts['ch12-warm'], WARM);
  assert.deepEqual(story.counts['ch12-take'], TAKE);
  assert.deepEqual(story.counts['ch12-store'], STORE);
  assert.deepEqual(E.countSets(STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes'], [6, 'ch07-sixes'], [4, 'ch08-fours'], [8, 'ch09-eights'], [7, 'ch10-sevens']]);
  assert.equal(E.countFor(10, STORIES).setId, 'ch04-tens');
  assert.deepEqual(E.learnedCounts({ counts: [], flags: {}, lessons: { 'ch12-warm': { finished: true } } }, STORIES), [], 'finishing the warm-up learns no Count');
  // every take-away of kind `none`, every answer different (and the spare's, 322)
  const answers = [];
  ['ch12-take', 'ch12-store'].forEach(sid => story.counts[sid].facts.forEach(f => {
    const a = Array.isArray(f) ? f[0] : f.a, b = Array.isArray(f) ? f[1] : f.b;
    assert.equal(E.takeKind(E.takePlan(a, b)), 'none', a + ' − ' + b + ': no spread');
    answers.push(a - b);
  }));
  assert.deepEqual(answers, [123, 35, 34, 343, 223, 133]);
  assert.equal(new Set(answers.concat([589 - 267])).size, 7);
  // the warm-up's facts each one of the 21 pairs of 3, 4, 6, 7, 8 and 9, each with its table; each alt with its anchor's
  WARM.facts.concat(WARM.warmHard.alt).forEach(f => { assert.ok([3, 4, 6, 7, 8, 9].includes(f.a) && [3, 4, 6, 7, 8, 9].includes(f.b)); assert.equal(typeof f.table, 'number'); });
  // its lines short and whole, fit for both sexes
  countsLines().forEach(x => {
    if (x.lang === 'es') return;
    assert.ok(words(x.text) <= 14, x.where + ': ' + x.text);
    assert.ok(E.endsSentence(x.text), x.where + ': a whole sentence');
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.where));
  });
  // the voices in the picture: Tallyheart on the Hollow's Counts frames, Glintstar at the store, Chispapaw for her echoes
  ['f042', 'f048'].forEach(id => assert.ok(castOf(id, 'tallyheart').length && castOf(id, 'chispapaw').length, id));
  assert.ok(castOf('f059', 'glintstar').length && castOf('f059', 'tallyheart').length, 'f059');
});

test('the warm-up over every pick case (the spec’s run): her two hardest of the 54 pairs first, in their anchors’ words; every question with a numeric table and its first line its anchor Count’s own (never “Three cats. How many tails?”); an alt where a set fact is a pick’s pair', () => {
  const PAIRS = E.warriorPairs().filter(p => !(p[0] === 10 && p[1] === 10));
  assert.equal(PAIRS.length, 54);
  const def = Object.assign({ id: 'ch12-warm' }, story.counts['ch12-warm']);
  const askOf = (picks) => withHard(picks, () => {
    const cat = before12({});
    const facts = E.lessonFacts(cat, def, STORIES);
    const st = E.counts.start(def, { facts, set: 'ch12-warm', mode: 'chapter', now: 1 });
    const out = [];
    while (!E.counts.done(st)) {
      const q = E.counts.question(st), D = E.questionDef(def, q, story, STORIES);
      out.push({ q, D, first: E.promptLines(def, D, q)[0].text });
      E.counts.answer(st, D, q.a * q.b, 2000, out.length * 1000);
    }
    return { facts, out };
  });
  let cases = 0;
  const check = (picks) => {
    const r = askOf(picks), key = JSON.stringify(picks);
    assert.equal(r.out.length, 3, key);
    picks.forEach((p, i) => assert.deepEqual([r.out[i].q.a, r.out[i].q.b, !!r.out[i].q.hard], [p[0], p[1], true], key + ': her hardest first'));
    r.out.forEach(x => {
      assert.equal(typeof x.q.table, 'number', key + ': ' + x.q.a + ' × ' + x.q.b + ' has a table');
      assert.equal(x.first, E.genericQuestion(E.hollowDef(STORIES, x.q.table), x.q), key + ': ' + x.q.a + ' × ' + x.q.b + ' asked in its anchor’s words');
      if (x.q.table !== 1) assert.doesNotMatch(x.first, /How many tails\?/, key + ': only the 1s count tails');
    });
    const keys = r.out.map(x => Math.min(x.q.a, x.q.b) + 'x' + Math.max(x.q.a, x.q.b));
    assert.equal(new Set(keys).size, 3, key + ': three different pairs');
    cases++;
  };
  check([]);
  PAIRS.forEach(p => check([p]));
  for (let i = 0; i < PAIRS.length; i++) for (let j = 0; j < PAIRS.length; j++) if (i !== j) check([PAIRS[i], PAIRS[j]]);
  assert.equal(cases, 1 + 54 + 54 * 53);
  // with none: the set as written, in its own anchors' words (“Seven spiders” is 7 × 8's; the set's own 6 × 7 first)
  const none = askOf([]);
  assert.deepEqual(none.out.map(x => [x.q.a, x.q.b]), [[6, 7], [8, 4], [3, 9]]);
  // her one pick 8 × 4: 8 × 4 asked first, and the set's 8 × 4 gives way to 3 × 8 (the spec's)
  const one = askOf([[8, 4]]);
  assert.deepEqual(one.out.map(x => [x.q.a, x.q.b]), [[8, 4], [3, 8], [3, 9]]);
  // a pick 3 × 9: the set's own 3 × 9 gives way to the first free alt
  const nine = askOf([[7, 8], [3, 9]]);
  assert.deepEqual(nine.out.map(x => [x.q.a, x.q.b]), [[7, 8], [3, 9], [3, 8]]);
});

test('the warm-up’s echo: Chispapaw says her first right answer in Spanish, in the order it was asked (a retry’s counts), after the line it earned, then “My little Tall One…”; once a lesson; “¡Ocho por siete…!” asked as 8 × 7', () => {
  const def = Object.assign({ id: 'ch12-warm' }, story.counts['ch12-warm']);
  const play = (picks, answers) => withHard(picks, () => {
    const cat = before12({});
    const facts = E.lessonFacts(cat, def, STORIES);
    const st = E.counts.start(def, { facts, set: 'ch12-warm', mode: 'chapter', now: 1 });
    return countsRows(cat, story, def, st, answers, { all: 1500 });
  });
  // her hard 7 × 8, right and quick: the remembered line, then the echo, then her line, once
  const hard = play([[7, 8], [9, 6]]);
  assert.deepEqual(hard.map(r => r.k), ['7x8', '9x6', '3x9'], 'her two in the set’s first two places, its own third');
  assert.deepEqual(hard[0].echo, [{ who: 'tallyheart', text: 'Last time 7 × 8 made you stop and think. Not today!' }, { who: 'chispapaw', text: SIETE, lang: 'es' }, { who: 'chispapaw', text: MEANT }]);
  assert.deepEqual([hard[1].echo, hard[2].echo], [null, null], 'once a lesson');
  assert.equal(hard[0].prompt[0].text, 'Seven spiders. How many legs?', 'in its anchor’s words, on the sand');
  assert.equal(hard[1].prompt[0].text, 'Six cats. How many lives?');
  // asked as 8 × 7: “ocho por siete”
  const eight = play([[8, 7]]);
  assert.equal(eight[0].echo[1].text, '«¡Ocho por siete, cincuenta y seis!»\n(Eight times seven, fifty-six!)');
  // a miss first: no echo; the next right answer, whichever it is, echoes; a retry right counts
  const miss = play([], { '6x7': [41], '8x4': [31], '3x9': [26] });
  const firstRight = miss.findIndex(r => r.res.correct);
  assert.ok(firstRight > 0, 'misses first');
  miss.forEach((r, i) => assert.equal(!!r.echo, i === firstRight, r.k));
  assert.ok(miss[firstRight].q.retry, 'a retry’s right answer counts');
  assert.equal(miss[firstRight].echo[miss[firstRight].echo.length - 1].text, MEANT);
  // a cat who misses all three and every retry hears no echo (the spec's item 7): never a wall, the lesson still ends
  const never = play([], { '6x7': [1, 1, 1, 1], '8x4': [1, 1, 1, 1], '3x9': [1, 1, 1, 1] });
  assert.ok(never.every(r => !r.echo) && never[never.length - 1].res.done);
});

test('the take lesson as the spec plays it: the worked example’s three full lines (the school words once, before the tens), its right line waiting; 58 − 23’s one prompt balloon, the sigh 76 − 42’s; the echo after 475 − 132, right or helped, never after its twin; no twin anywhere with a prompt or a right line; finishing it opens Count the store', () => {
  const play = (digits) => {
    const cat = fresh({});
    assert.equal(E.storeOpen(cat, STORIES), false, 'the store closed before the lesson');
    const L = E.takeLesson(cat, story, 'ch12-take', 5000, STORIES);
    return { cat, rows: takeRows(cat, L.def, L.state, digits), L };
  };
  const ok = play();
  assert.deepEqual(ok.rows.map(r => r.key), ['254-131', '58-23', '76-42', '475-132', '368-145']);
  const w = ok.rows[0];
  assert.deepEqual([w.mode, w.ask.balloons, w.ask.ask.text], ['show', [TH('The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.')], 'Two hundred fifty-four take away one hundred thirty-one.']);
  assert.deepEqual(w.cols.map(c => c.line), ['Ones first. Four take away one.', 'A row is a ten. A square is a hundred. Now the tens. Five take away three.', 'Now the hundreds. Two take away one.']);
  assert.deepEqual([w.lineKind, w.balloons], ['right', [TH('One square, two rows, three loose left.')]]);
  const t = ok.rows[1];
  // (Chispapaw's whisper opens 76 − 42, not 58 − 23: three balloons over her first column of her own put Tallyheart's
  // “Now you try” under the bar on a sideways iPad, the review's round)
  assert.deepEqual(t.ask.balloons, [TH('Now you try, all by yourself. Little take-aways first, then big.')]);
  assert.deepEqual(t.cols.map(c => c.line), ['Ones first. Eight take away three.', 'Now the tens. Take away two.']);
  assert.deepEqual(ok.rows[2].ask.balloons, [{ who: 'chispapaw', kind: 'whisper', text: 'My little Tall One always sighs at homework.' }], '76 − 42: her whisper');
  assert.deepEqual(ok.rows.map(r => r.echo && r.echo.text), [null, null, null, TRES, null], 'the echo after 475 − 132 only');
  ok.rows.forEach(r => assert.ok(!/A row is a ten/.test(r.cols.slice(1).map(c => c.line).join(' ')) || r.key === '254-131', r.key + ': the school words once'));
  assert.equal(ok.rows.filter(r => r.cols.some(c => /A row is a ten/.test(c.line))).length, 1);
  assert.equal(ok.cat.takes.log.length, 5);
  assert.ok(ok.cat.lessons['ch12-take'].finished);
  assert.equal(E.storeOpen(ok.cat, STORIES), true, 'finishing the lesson opens Count the store');
  assert.deepEqual(E.takeSteps(ok.cat, STORIES), ['none']);
  // helped 475 − 132 (a slip at the ones): echoed still; its twin queued, asked plainly, never echoed
  const help = play({ '475-132': [4, 4, 3] });
  const h = help.rows.find(r => r.key === '475-132'), twin = help.rows.find(r => r.twin === '475-132');
  assert.ok(h.entry.helped && twin, 'helped: a twin comes back');
  assert.equal(h.echo.text, TRES, 'helped: still echoed');
  assert.deepEqual([twin.echo, twin.prompt, twin.right, twin.ask.balloons], [null, null, null, [{ who: 'tallyheart', text: 'One like it.' }]], 'its twin: no echo, no prompt, no right line');
  assert.notEqual(twin.a - twin.b, 133, 'a twin never lands on the store’s answer');
  assert.ok(![123, 35, 34, 343, 223, 133].includes(twin.a - twin.b), 'nor on any of the chapter’s');
  // helped worked example and 58 − 23: their twins plain too (`tap` and `hers`), no prompt, no right line
  const both = play({ '254-131': [2, 2, 1], '58-23': [4, 3] });
  const twins = both.rows.filter(r => r.twin);
  assert.deepEqual(twins.map(r => [r.twin, r.mode]), [['254-131', 'tap'], ['58-23', 'hers']]);
  twins.forEach(r => assert.deepEqual([r.prompt, r.right, r.balloons], [null, null, undefined], r.key + ': asked plainly'));
  assert.equal(both.rows[0].line, 'And you finished it. We’ll do one like it soon.', 'the worked example helped: the kit’s line, no right line');
});

test('no spreading talk (the brief’s “no spreading yet”): no help line of the lesson or the store’s catch, over every wrong digit in every column, says “went” or “spread”; the pinned cases open “Let’s scratch it out.”', () => {
  const sets = [['ch12-take', story.counts['ch12-take']], ['ch12-store', story.counts['ch12-store']]];
  let checked = 0;
  sets.forEach(([sid, raw]) => raw.facts.forEach(f => {
    const a = Array.isArray(f) ? f[0] : f.a, b = Array.isArray(f) ? f[1] : f.b, p = E.takePlan(a, b);
    for (let col = 0; col < p.n; col++) for (let d = 0; d <= 9; d++) {
      const cat = fresh({});
      const L = E.takeLesson(cat, story, sid, 5000, STORIES);
      const st = L.state, TK = E.takes;
      // walk to this problem's column, right digits before it
      for (let g = 0; g < 100; g++) {
        const q = TK.question(st);
        if (q.a === a && q.b === b && q.col === col && !q.twin) break;
        const c = q.plan.cols[q.col];
        TK.digit(st, L.def, c.blank ? '' : c.digit, 2000, 1000 * (g + 1));
      }
      const q = TK.question(st), c = q.plan.cols[q.col];
      if (d === c.digit) continue;
      const r = TK.digit(st, L.def, d, 2000, 999999);
      if (r.pointer || !r.help) continue;
      const said = [r.help.intro, r.help.line].concat((r.help.steps || []).map(s => s.line || s.text || '')).concat(r.line || '').filter(Boolean).join(' ');
      assert.doesNotMatch(said + JSON.stringify(r.help), /\bwent\b|spread/i, sid + ' ' + a + ' − ' + b + ' col ' + col + ' digit ' + d);
      checked++;
    }
  }));
  assert.ok(checked > 100, checked + ' wrong digits');
  // 475 − 132's tens typed 3: a fact slip, “Let’s scratch it out.”
  const tens = (() => {
    const cat = fresh({}), L = E.takeLesson(cat, story, 'ch12-take', 5000, STORIES), TK = E.takes;
    for (let g = 0; g < 100; g++) { const q = TK.question(L.state); if (q.a === 475 && q.col === 1) break; const c = q.plan.cols[q.col]; TK.digit(L.state, L.def, c.digit, 2000, 1000 * (g + 1)); }
    return TK.digit(L.state, L.def, 3, 2000, 999999);
  })();
  assert.deepEqual([tens.slip, tens.help.intro], ['fact', 'Let’s scratch it out.']);
  // 175 − 42's hundreds typed 0, and OK on its empty box: each a fact slip opening “Let’s scratch it out.”
  const hundreds = typed => {
    const cat = fresh({}), L = E.takeLesson(cat, story, 'ch12-store', 5000, STORIES), TK = E.takes;
    TK.digit(L.state, L.def, 3, 2000, 1000); TK.digit(L.state, L.def, 3, 2000, 2000);
    return TK.digit(L.state, L.def, typed, 2000, 3000);
  };
  [0, ''].forEach(x => { const r = hundreds(x); assert.deepEqual([r.slip, r.help.intro], ['fact', 'Let’s scratch it out.'], JSON.stringify(x)); assert.doesNotMatch(JSON.stringify(r.help), /went|spread/i); });
});

test('the store’s catch: 175 − 42 asked by Glintstar, the kit’s full lines (“Now the hundreds. Nothing to take.”), her right line waiting; a 1 typed first gets the ones-first pointer, not the sand; helped, the kit’s line and no twin', () => {
  const play = (digits) => {
    const cat = fresh({});
    const L = E.takeLesson(cat, story, 'ch12-store', 5000, STORIES);
    return { cat, rows: takeRows(cat, L.def, L.state, digits) };
  };
  const ok = play();
  assert.equal(ok.rows.length, 1);
  const r = ok.rows[0];
  assert.deepEqual(r.ask.balloons, [{ who: 'glintstar', text: 'How many stay in the store, {name}{ending}?' }]);
  assert.equal(E.fill(r.ask.balloons[0].text, ok.cat), 'How many stay in the store, Moonheart?');
  assert.deepEqual(r.cols.map(c => c.line), ['Ones first. Five take away two.', 'Now the tens. Take away four.', 'Now the hundreds. Nothing to take.']);
  assert.deepEqual([r.lineKind, r.balloons], ['right', [{ who: 'glintstar', text: 'One hundred thirty-three in the store.' }]]);
  assert.equal(r.entry.answer, 133);
  // a leading 1 typed first: the pointer, not a miss; Glintstar's right line kept
  const ptr = play({ '175-42': [1] });
  assert.equal(ptr.rows[0].pointer, 'Ones first: this box, on the right.');
  assert.deepEqual([ptr.rows[0].entry.correct, ptr.rows[0].lineKind], [true, 'right'], 'pointed at, not checked: still right');
  // helped: no twin (`twins: false`), the kit's line
  const help = play({ '175-42': [4, 3, 1] });
  assert.equal(help.rows.length, 1, 'no twin');
  assert.deepEqual([help.rows[0].entry.helped, help.rows[0].twinQueued, help.rows[0].line], [true, null, 'And you finished it.']);
  // the book's store at 133 either way
  assert.equal(story.book.store, 133);
});

test('the counts by taps and the one-tap pages log nothing, nor do the choices or the dream: three Counts and six take-aways on every reading (a twin more for each helped one)', () => {
  for (const [flags, o] of [[{}, {}], [{ specialty: 'swimming', ch10Best: 'counts' }, { vouch: 2, first: 2, walk: 2, digits: { '58-23': [4, 3] } }], [{ ch2Stone: 'chin' }, { answers: { '6x7': [41] } }]]) {
    const cat = fresh(flags), n0 = cat.counts.length;
    const rows = read(cat, o);
    rows.forEach((x, i) => { if (['skip', 'scratch', 'next', 'choice', 'input'].includes(x.kind) && rows[i + 1]) assert.deepEqual([rows[i + 1].counts, rows[i + 1].taken], [x.counts, x.taken], x.id + ' logs nothing'); });
    assert.deepEqual(rows.filter(x => x.kind === 'skip').map(x => [x.skip.table, x.skip.groups, x.skip.lang]), [[10, 5, 'es']]);
    assert.equal(cat.counts.length - n0, 3 + ((o.answers || {})['6x7'] || []).length, JSON.stringify(flags) + ': typed Counts');
    assert.equal(cat.takes.log.length, 6 + (o.digits ? 1 : 0), JSON.stringify(flags) + ': take-aways');
    // the store opens with the lesson's end, and not before
    rows.forEach(x => assert.equal(x.storeOpen, at(x.id) > at('f048'), x.id));
  }
});

test('no twin anywhere carries a prompt or a right line: each problem of the lesson helped in turn, its twin asked plainly (“One like it.”), never echoed, never on one of the chapter’s answers', () => {
  const facts = story.counts['ch12-take'].facts.map(f => Array.isArray(f) ? f : [f.a, f.b]);
  facts.forEach(([a, b]) => {
    const cat = fresh({}), L = E.takeLesson(cat, story, 'ch12-take', 5000 + a, STORIES);
    const p = E.takePlan(a, b), wrong = (p.cols[0].digit + 1) % 10;
    // a slip at the ones that is not the answer's leading digit (the pointer would take it)
    const slip = wrong === +String(a - b).charAt(0) ? (wrong + 1) % 10 : wrong;
    const rows = takeRows(cat, L.def, L.state, { [a + '-' + b]: [slip].concat(p.cols.slice(1).map(c => c.digit)) });
    const twins = rows.filter(r => r.twin);
    assert.equal(twins.length, 1, a + ' − ' + b + ': helped, one twin');
    twins.forEach(r => {
      assert.deepEqual([r.prompt, r.right, r.balloons, r.echo], [null, null, undefined, null], a + ' − ' + b + ': its twin plain');
      assert.deepEqual(r.ask.balloons, [{ who: 'tallyheart', text: 'One like it.' }]);
      assert.ok(![123, 35, 34, 343, 223, 133].includes(r.a - r.b), a + ' − ' + b + ': its twin off the chapter’s answers');
    });
  });
});

test('Read to me, through the engine and the page’s plan: every frame’s captions and balloons as the page passes them, with a Spanish voice and with none; never Spanish in an English voice, never a row of punctuation alone; the three Spanish lines said in Spanish then English, or their English alone', () => {
  const V = UI.voices;
  const PAULINA = { name: 'Paulina', lang: 'es-MX' }, SAMANTHA = { name: 'Samantha', lang: 'en-US' };
  const lists = { es: [PAULINA, SAMANTHA], none: [SAMANTHA] };
  const cat = Object.assign(E.blankCat({}), { name: 'Fern', ending: 'heart', petname: 'Biscuit', flags: { specialty: 'friends', ch10Best: 'counts', ch2Stone: 'chin' } });
  const itemsOf = id => {
    const f = frames[id];
    return E.captionsRead(f, cat).map(t => ({ text: E.fill(t, cat) })).concat(E.balloons(f, cat).map(b => ({ who: b.who, text: b.lang === 'es' ? E.esLine(b.text, cat) : E.fill(b.text, cat) })));
  };
  const spanishWords = new Set();
  ids.forEach(id => itemsOf(id).forEach(it => E.speechParts(it.text, null, cat).filter(p => p.lang === 'es').forEach(p => spanishWords.add(p.text))));
  assert.ok(spanishWords.has('Galleta') && spanishWords.has('cincuenta'), 'the words in English lines are Spanish parts');
  Object.keys(lists).forEach(k => ids.forEach(id => {
    const rows = V.plan(itemsOf(id), lists[k], { cat });
    rows.forEach(r => {
      assert.ok(/[\p{L}\p{N}]/u.test(r.text), k + ' ' + id + ': ' + JSON.stringify(r.text));
      if (r.lang === 'en') assert.ok(!spanishWords.has(r.text) && r.voice !== 'Paulina', k + ' ' + id + ': Spanish in an English voice: ' + r.text);
      else assert.equal(r.voice, 'Paulina', k + ' ' + id);
      assert.doesNotMatch(r.text, /[«»{}]/, k + ' ' + id);
    });
  }));
  const said = (id, k) => V.plan(itemsOf(id), lists[k], { cat }).map(r => r.lang + ' ' + r.text);
  const r61 = said('f061', 'es'), i61 = r61.indexOf('es ¡Ciento treinta y tres!');
  assert.ok(i61 >= 0 && r61[i61 + 1] === 'en One hundred thirty-three!', 'the Spanish, then its English: ' + r61.join(' | '));
  assert.ok(said('f061', 'none').includes('en One hundred thirty-three!') && !said('f061', 'none').some(r => /^es/.test(r)), 'with no Spanish voice, the English alone');
  const r14 = said('f014', 'es');
  assert.deepEqual(r14.slice(-2), ['es …' + WJ + 'once, doce. Doce gatos.', 'en …' + WJ + 'eleven, twelve. Twelve cats.']);
  assert.deepEqual(V.plan(itemsOf('f074'), lists.es, { cat }).filter(r => r.lang === 'es').map(r => r.text), ['¡A contar!']);
  // Chispa and Chispapaw in the English voice, respelled; a cat named Chispa hears her own name as she always did
  assert.ok(V.plan(itemsOf('f032'), lists.none, { cat }).some(r => /^Cheespa-paw can’t help it\./.test(r.text)));
  const chispa = Object.assign({}, cat, { name: 'Chispa' });
  assert.ok(V.plan([{ who: 'glintstar', text: E.fill(frames.f008.say[0].text, chispa) }], lists.none, { cat: chispa }).some(r => /^Chispaheart\./.test(r.text)));
});

test('decision 54’s alternative (the spec’s section 7, item 11): the lines that would change if Tallyheart took Chispapaw are where the spec names them, and nowhere else', () => {
  // the mentor, “She's yours”, the dip, her first words and their replies, “Now you know how I felt”
  assert.equal(T('f033'), 'Every apprentice needs a mentor. I’ll teach her the Counts, same as always. She needs a warrior for everything else.');
  assert.equal(T('f034'), 'Glintstar looks right at you. {name}{ending}. She’s yours.');
  assert.equal(T('f035'), 'Your very own apprentice! Your tail shoots up before you can stop it.');
  assert.ok(['f036', 'f037a', 'f037b', 'f037c', 'f038', 'f038c'].every(id => frames[id]));
  assert.deepEqual(FF(/Now you know how I felt/), ['f037a', 'f038', 'f038c']);
  // bedtime: “A store to count and an apprentice. Show-off.”, “Will you teach me to catch a mouse?”, “Tomorrow.”
  assert.equal(T('f072'), 'Your first day. A store to count and an apprentice. Show-off. Goodnight, {name}{ending}! Will you teach me to catch a mouse? Tomorrow.');
  // the book's third line
  assert.match(story.book.recap[2].text, /gave her to \{name\}\{ending\} as \{their\} very first apprentice\./);
  // nowhere else: “apprentice” said of her only on those screens and the book's third line (the apprentices' den is a place)
  const where = [];
  everyText((id, x) => { if (/\bapprentice\b/.test(String(x.text).replace(/apprentices’ den/g, ''))) where.push(id); });
  assert.deepEqual([...new Set(where)], ['f033', 'f035', 'f072', 'book']);
});

/* ------------------------------------------------------------------ the book and the teaser */

const sentences = s => s.split(/(?<=[.!?])\s+(?=\p{Lu}|\{|“)/u).length;

test('book: book two’s title, the chapter title, seven entries (eight sentences) on every reading, true on each; the store at 133; the dream and the night it stayed a secret, by her warrior name; English only', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['chapterTitle', 'dream', 'noDream', 'recap', 'store', 'title']);
  assert.equal(b.title, '{name}{ending}’s First Frost-Time', 'book two’s volume title');
  assert.equal(b.chapterTitle, 'A Spark at the Hedge');
  assert.equal(b.store, 133);
  assert.equal(b.dream, '{name}{ending}’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}{ending}’s first frost-time dream stayed a secret.');
  assert.equal(b.recap.length, 7);
  b.recap.forEach((r, i) => assert.deepEqual(Object.keys(r), ['text'], 'entry ' + i + ': on every reading'));
  const n = b.recap.reduce((m, r) => m + sentences(r.text), 0);
  assert.ok(n >= 6 && n <= 10, n + ' sentences');
  assert.equal(n, 8);
  b.recap.forEach(r => assert.doesNotMatch(r.text, /[«»]|\{[Ee]s:/, 'no Spanish in the book'));
  const cat = Object.assign(fresh({}, { name: 'Fern', ending: 'heart' }), { dreams: {} });
  const page = E.buildBook(story, cat);
  assert.equal(page.title, 'Fernheart’s First Frost-Time');
  assert.equal(page.chapter, 'Chapter 12: A Spark at the Hedge');
  assert.equal(page.dream, 'Fernheart’s first frost-time dream stayed a secret.');
  cat.dreams.ch12 = 'a spark in the snow';
  assert.match(E.buildBook(story, cat).dream, /^Fernheart’s dream: “A spark in the snow\.”$/);
  assert.match(page.recap.join(' '), /one hundred thirty-three, one square, three rows and three loose\./);
  // for a she-cat the third entry's chooser is never ambiguous: the little cat chose her name, not our cat (the final review)
  assert.match(page.recap.join(' '), /Fernheart spoke up for her, and the little cat chose her own Clan name: Chispa, which means spark\./);
  // its page in book two: the store drawn under it
  const tom = before12({}, { name: 'Storm', ending: 'leap', sex: 'tom' });
  tom.finished.ch12 = 12;
  const two = E.buildFullBook(tom, STORIES, 2);
  assert.equal(two.title, 'Stormleap’s First Frost-Time', 'book two’s title from this chapter’s');
  const pg = two.pages.find(p => p.id === 'ch12');
  assert.ok(pg, 'chapter 12’s page, in book two');
  assert.ok(!E.buildFullBook(tom, STORIES).pages.some(p => p.id === 'ch12'), 'not in book one');
  assert.equal(E.buildFullBook(tom, STORIES).teaser, null, 'book one no longer promises “A new adventure”: she has read it');
  assert.deepEqual(two.teaser && two.teaser.title, 'Chapter 13: The Hunter’s Crouch');
  assert.equal(pg.store, 133, 'the store drawn at 133');
  assert.match(pg.recap.join(' '), /On Stormleap’s first day as a warrior, he slept till noon/);
});

test('the teaser is chapter 13’s, “The Hunter’s Crouch”: the story’s own line, and with chapter 13 built it leads there; chapter 11’s teaser stays as it is and now leads here', () => {
  assert.deepEqual(story.teaser, { title: 'Chapter 13: The Hunter’s Crouch', lines: ['Granny has news: a fresh badger track. Who made this one?'] });
  const cat = before12({});
  assert.deepEqual(E.teaser(story, cat, STORIES), { title: story.teaser.title, lines: story.teaser.lines, built: false, next: null }, 'with no chapter 13 among the stories');
  assert.ok(PC.story.ch13 && PC.story.ch13.title === 'The Hunter’s Crouch', 'chapter 13 is built');
  assert.deepEqual(E.teaser(story, cat, STORIES.concat([PC.story.ch13])), { title: story.teaser.title, lines: story.teaser.lines, built: true, next: 'ch13' }, 'chapter 13 built: the hub leads there');
  assert.equal(E.chapterHeading(PC.story.ch13), story.teaser.title, 'the teaser’s title is chapter 13’s own heading');
  assert.deepEqual(ch11.teaser, { title: 'A new adventure', lines: ['Out on Gathering Island, an old badger track lies in the mud. Who made it? Another day.'] });
  assert.deepEqual(E.teaser(ch11, cat, STORIES), { title: 'A new adventure', lines: ch11.teaser.lines, built: true, next: 'ch12' });
  assert.ok(DOC.includes(story.teaser.lines[0]), 'the story’s own line');
});

/* ------------------------------------------------------------------ whole play-throughs */

test('engine agrees: checkStory and checkTakes are clean; chapters 1 to 11 are sound beside it', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  assert.deepEqual(E.checkTakes(story, STORIES), []);
});

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, no flag set, the warm-up, the lesson, the store, the taps, the paw thing, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) {
    const name = comboName(c);
    const cat = fresh(c.flags, { name: c.o.name, sex: c.o.sex });
    const flags0 = Object.assign({}, cat.flags), counted = cat.counts.length;
    const rows = read(cat, Object.assign({}, c.o));
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch12'), name);
    assert.deepEqual(idsOf(rows), walk(c.flags, c.o).slice(), name + ': the engine walks the same frames');
    assert.deepEqual(cat.flags, flags0, name + ': no flag set');
    ['ch12-warm', 'ch12-take', 'ch12-store'].forEach(sid => assert.ok(cat.lessons[sid] && cat.lessons[sid].finished, name + ' ' + sid));
    assert.equal(cat.counts.length - counted, 3, name + ': three Counts typed; the taps never logged');
    assert.equal(cat.takes.log.length, 6, name + ': six take-aways');
    assert.equal(E.storeOpen(cat, STORIES), true, name + ': Count the store open');
    assert.equal(cat.dreams.ch12, 'a spark in the snow');
    assert.equal(E.status(cat, STORIES), 'Chapter 12 finished');
    const book = E.buildBook(story, cat);
    assert.equal(book.recap.length, 7, name);
    assert.doesNotMatch(book.recap.join(' ') + book.dream, /[{}«»]/, name + ': the book, every token filled, no Spanish');
    // every label and line filled; her warrior name on her balloons; the little cat's labels as the spec has them
    rows.forEach(x => x.say.forEach(bl => assert.ok(bl.label && !/[{}]/.test(bl.label + bl.text), name + ' ' + x.id + ': ' + bl.label + ': ' + bl.text)));
    rows.forEach(x => assert.ok(!x.heard.some(h => /[{}]/.test(h)), name + ' ' + x.id));
    rows.forEach(x => x.say.filter(b => b.who === 'player').forEach(b => assert.equal(b.label, E.warriorName(cat), name + ' ' + x.id)));
    rows.forEach(x => x.say.filter(b => b.who === 'chispapaw').forEach(b => assert.equal(b.label, x.id === 'f013' ? 'A small voice' : LITTLE_IDS.includes(x.id) ? 'The little cat' : 'Chispapaw', name + ' ' + x.id)));
    rows.forEach(x => x.say.filter(b => b.lang === 'es').forEach(b => assert.match(b.text, /^«[^»]+»\n\([^)]+\)$/, name + ' ' + x.id + ': its English under it')));
    // the den's stone where she put it in chapter 2
    rows.filter(x => x.scene && x.scene.set === 'den' && frames[x.id].scene.opts.stone).forEach(x => assert.equal(x.scene.opts.stone, c.flags.ch2Stone || false, x.id));
    assert.ok(E.back(cat, story));
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 60);
  // a save in the middle of the lesson and one at the store go through the store's own shape and come back the same cat
  for (const stop of ['f045', 'f060']) {
    const mid = fresh({ specialty: 'climbing' }, { name: 'Fox' });
    read(mid, { stop });
    const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
    assert.deepEqual([back.flags, back.frame, back.ending], [mid.flags, mid.frame, mid.ending], stop);
    assert.deepEqual(idsOf(read(back, {})), idsOf(read(mid, {})), stop + ': and reads on to the same end');
  }
  // Back over the vouching and another line: the other reply, nothing set
  const re = fresh({}, { name: 'Moon' });
  read(re, { stop: 'f027', vouch: 0 });
  while (E.frameId(re, story) !== VOUCH) assert.ok(E.back(re, story));
  assert.ok(E.choose(re, story, 1, 9000));
  assert.equal(E.frameId(re, story), 'f025b');
  assert.deepEqual(re.flags, before12({}).flags);
});
