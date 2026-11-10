/* Story tests for chapter 13: node --test
 *
 * Checks app/story/ch13.js against the frame contract in docs/build.md, against the story
 * (docs/chapters/13-the-hunters-crouch.md, Draft v0.6, final) and against its spec
 * (docs/chapters/13-the-hunters-crouch.spec.md, v0.3, the build's contract): module 2's second chapter, opened by
 * chapter 12 finished; the frame graph (f001 to f084 with the polite ask's lettered option frames, which meet again, and
 * the groundhog's optional scene, f059 to f064); one interaction per frame; the five choices (only the crouch's sets a
 * flag, `teach`, replaced on a reread); `foundGroundhog` set by reaching f064 and nothing else; the lines by `teach`
 * (f019, f078: exactly one caption-and-balloon pair each), `specialty` (f010, f058) and `ch2Stone` (f076) for every
 * combination; the labels (her warrior name, Granny, the ferry otters by variant, “The round brown thing” till it says
 * GROUNDHOG, the off-panel calls named); the Spanish by structure (f033, f035, f040's whole lines, f030's word, every one
 * filled and glossed as the words table has it, no « » in the file); the six Counts sets exactly as the spec has them and
 * played as it plays them (the warm-up over every pick case, its echo on her first right answer; the kit's marks page;
 * the lesson's worked example as moves, 70 − 34's taps, its twins with no prompt and no right line, the echo after 85 − 39
 * right or helped and never after its twin, no square talk, the `extra` touch; the pile's flip as `ahead`; the story
 * Counts' right lines on a retry); finishing the lesson adds `ones2`; the pages she taps once, each with its target in the
 * art; the speakers, the chained balloons, the balloon kinds; tokens, storyboards, word counts, captions and boxes; the
 * art vocabulary camera by camera (the groundhog, the camp's frost and trails, the ferns spots, the Hollow's spread marks,
 * the den's collar, the grove's dig, its close camera and the marks); Chispapaw's collar off from f027; the staging (the
 * crouch, the Hollow, the oak's four, the otters' order, the motion's first members), no two cats touching, depth, the
 * time of day (no moon anywhere), the generated storyboard, every frame rendered with everyone in the picture, the beats
 * in order on every path, the book (seven or eight sentences, the store at 178, the badger page, the groundhog's sleeper
 * page), the teaser for chapter 14, and whole play-throughs through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch13.test.js   prints the whole chapter, rendered three ways.
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
const TK = E.takes;
const story = PC.story.ch13;
const frames = story.frames;
const ids = Object.keys(frames);
const ch12 = PC.story.ch12;
const STORIES = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09', 'ch10', 'ch11', 'ch12'].map(k => PC.story[k]).concat([story]);
const SRC = fs.readFileSync(path.join(ROOT, 'app/story/ch13.js'), 'utf8');
const DOC = fs.readFileSync(path.join(ROOT, 'docs/chapters/13-the-hunters-crouch.md'), 'utf8');
const WJ = '\u2060';

/* ------------------------------------------------------------------ the chapter's facts */

const SPEC = ['noticing', 'sneaking', 'climbing', 'swimming', 'friends'];
const STONE = ['nose', 'chin'];
const TEACH = ['show', 'try', 'words'];
const FLAGS = { specialty: SPEC, ch2Stone: STONE, teach: TEACH, foundGroundhog: [true] };
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'pick', 'ask', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'sets'].concat(INTERACTIONS);
const TOKENS = ['name', 'ending', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat', 'sloshbank', 'reedclan', 'thymeleaf', 'groveclan', 'chispapaw'];
const GROWN = ['tallyheart', 'glintstar', 'thymeleaf', 'grizzled', 'waffles', 'murmurchime', 'groveclan'];
const GROUNDHOG = ['f059', 'f060', 'f061', 'f062', 'f063', 'f064'];
// the spec's frame list: f001 to f084, the polite ask's option frames lettered
const IDS = [];
for (let n = 1; n <= 84; n++) {
  const f = 'f' + String(n).padStart(3, '0');
  if (n === 52) IDS.push('f052a', 'f052b');
  else IDS.push(f);
}
// the raw spots, as the story file names them
const SPOTS = {
  PEER: { x: 1270, y: 960, h: 200 }, PAST: { x: 1280, y: 965, h: 200 }, DAWN_CHIME: { x: 1020, y: 800 }, OUT_TALLY: { x: 430, y: 900 }, OUT_YOU: { x: 700, y: 905 },
  OUT_CHIME: { x: 960, y: 912 }, DAWN_YOU: { x: 480, y: 925 }, DAWN_BACK: { x: 720, y: 905 }, RING_YOU: { x: 610, y: 905 }, IN_TALLY: { x: 350, y: 900 },
  NOON_CLAN: { x: 330, y: 784 }, NOON_OLD: { x: 1140, y: 770 }, NOON_CLAN2: { x: 1300, y: 778 }, NOON_YOU: { x: 750, y: 904 }, NOON_TALLY: { x: 985, y: 906 },
  NOON_CHISPA: { x: 560, y: 912 }, OLD_FRONT: { x: 1230, y: 912 }, NAME_YOU: { x: 1040, y: 906 }, NAME_TALLY: { x: 1270, y: 902 }, TALE_OLD: { x: 1260, y: 902 },
  TALE_GREY: { x: 1010, y: 906 }, TALE_YOU: { x: 760, y: 906 }, TALE_CHISPA: { x: 520, y: 912 }, CROSS_GRANNY: { x: 960, y: 858 }, CROSS_YOU: { x: 495, y: 925 },
  CROSS_THIRD: { x: 725, y: 900 }, RAFT_SHORE: { x: 880, y: 870 }, PATH_CHISPA: { x: 560, y: 762 }, PATH_BACK: { x: 330, y: 760 }, BRIDGE_CHISPA: { x: 520, y: 894 },
  BRIDGE_YOU: { x: 700, y: 888 }, DOOR_BACK: { x: 672, y: 930 }, HOL_YOU: { x: 690, y: 892 }
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

const PROFILES = {
  'she-cat': { name: 'Moon', ending: 'silver', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'Frost on every fern.' },
  tom: { name: 'Storm', ending: 'leap', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A long line and eight little pokes.' },
  // a player whose own Clan name is Murmur: the warrior is Mutterchime
  murmur: { name: 'Murmur', ending: 'true', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'A groundhog snoring.' }
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
  if (!isSfx && /\b(\w+)\s+\1\b/i.test(text)) bad.push('doubled word');
  if (/pawpaw/i.test(text)) bad.push('pawpaw');
  if (/\s{2,}|\s[,.!?]/.test(text)) bad.push('stray space');
  if (/['"]/.test(text.replace(/\*\*/g, ''))) bad.push('straight quote');
  if (!isSfx) {
    const start = text.replace(/\*\*/g, '').replace(/^[“"‘'(—¡¿*]+/, '');
    if (!start.startsWith('…') && /^\p{Ll}/u.test(start) && !/^—/.test(text)) bad.push('starts lowercase');
    if (/[.!?][”"’']?\s+[“"‘(¡¿*]?(\p{Ll})/u.test(text)) bad.push('sentence starts lowercase');
  }
  return bad;
}
// f058's friends caption: one sentence of 102 characters split at its colon (the spec's section 5), so its second box
// opens in lower case, as the sentence goes on
const COLON_ON = 'a smaller doorway, right beside the dig.';

/* Every Counts line of the chapter's own sets: prompts, right lines, echo lines, the marks page, done. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l })));
    ['done'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k] }); });
    (d.facts || []).forEach((f, i) => {
      if (Array.isArray(f)) return;
      ['prompt', 'retryPrompt'].forEach(pk => { if (typeof f[pk] === 'string' || Array.isArray(f[pk])) [].concat(f[pk]).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' ' + pk + ' ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, kind: p.kind })); });
      [].concat(f.right || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' right ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, kind: p.kind }));
    });
    if (d.marks) ['lines', 'one', 'above'].forEach(k => d.marks[k].forEach((b, j) => out.push({ set: sid, where: 'marks ' + k + ' ' + j, text: b.text, who: b.who })));
    // an echo line read with a question's own numbers: the warm-up's for 9 × 7, the lesson's for 85 − 39
    const extra = sid === 'ch13-warm' ? { a: 9, b: 7 } : { a: 85, b: 39, answer: 46 };
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
  story.book.badger.forEach((l, i) => fn('book', { where: 'badger ' + i, text: (l.say || l.saw).text }));
  fn('book', { where: 'sleeper name', text: story.book.sleeper.name });
  story.book.sleeper.lines.forEach((l, i) => fn('book', { where: 'sleeper ' + i, text: l }));
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* The choices: the crouch's sets `teach` (`teach`, the option's index); the polite ask gives each option its own reply
 * (`ask`); the groundhog's offer opens the optional scene or goes on (`look`: 0 “Look closer.”, 1 “Home before
 * sunset.”); the light ones go to the next screen (`wake`, `tomorrow`). */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const WAKE = choiceAt(/^“I’m UP!”$/)[0];
const TOMORROW = choiceAt(/^“It’s tomorrow\.”$/)[0];
const TEACHES = choiceAt(/^Show her:/)[0];
const ASK = choiceAt(/^“Please, may we see your hole\?”$/)[0];
const LOOK = choiceAt(/^“Look closer\.”$/)[0];
const DREAM = ids.find(id => frames[id].input && frames[id].input.kind === 'dream');
const KEY = { [WAKE]: 'wake', [TOMORROW]: 'tomorrow', [TEACHES]: 'teach', [ASK]: 'ask', [LOOK]: 'look' };
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
/* The frames a reader with these flags and choices walks through, in order (E.landing, as the engine lands; a frame's
 * `sets` as the engine's arrival sets them). */
function walk(flags, o) {
  o = o || {};
  const cat = catFor(flags, o);
  const out = [];
  let id = story.start;
  for (let guard = 0; guard < 200 && id; guard++) {
    id = E.landing(cat, story, id);
    const f = frames[id];
    out.push(id);
    if (f.sets) Object.assign(cat.flags, f.sets);
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
    const row = { id, kind: E.kindOf(f), lines: caps.concat(bal.map(b => b.text)).concat(f.sfx ? [f.sfx] : []), boxes: caps.length + bal.length, balloons: bal, caps };
    if (f.choice) row.options = E.options(f, cat).map(x => E.optionLabel(x.option, cat));
    if (f.scratch) row.tap = E.tapWords(f).prompt;
    return row;
  });
}
/* Every combination of her `specialty` (five or none) and `ch2Stone` (two or none), 18 flag sets, each read on the 12
 * paths through the crouch (three ways to teach), the polite ask (two) and the groundhog (two): 216 readings, the light
 * choices, her first name and her sex by turns. */
const PATHS = [];
for (const teach of [0, 1, 2]) for (const ask of [0, 1]) for (const look of [0, 1]) PATHS.push({ teach, ask, look });
const FLAGSETS = [];
for (const specialty of SPEC.concat([undefined])) for (const stone of STONE.concat([undefined])) {
  const flags = {};
  if (specialty) flags.specialty = specialty;
  if (stone) flags.ch2Stone = stone;
  FLAGSETS.push(flags);
}
const NAMES = ['Moon', 'Fern', 'Minnow', 'Frost', 'Pebble', 'Sedge', 'Storm', 'Holly', 'Murmur', 'Chispa'];
const COMBOS = [];
for (let i = 0; i < FLAGSETS.length; i++) for (let j = 0; j < PATHS.length; j++) {
  const n = i * PATHS.length + j;
  COMBOS.push({ flags: FLAGSETS[i], o: Object.assign({ wake: n % 2, tomorrow: (n >> 1) % 2, name: NAMES[n % NAMES.length], sex: n % 3 ? 'she' : 'tom' }, PATHS[j]) });
}
const comboName = c => JSON.stringify(c.flags) + ' ' + JSON.stringify(c.o);
const SOME = COMBOS.filter((c, i) => i % 7 === 0);
const TEACH_OF = o => TEACH[o.teach || 0];
// the frames a path adds: the polite ask's one reply, the groundhog's six
function framesOf(o) { return 78 + (o.look === 0 ? 6 : 0); }

/* ------------------------------------------------------------------ reading through the engine */

const Sp = UI.speakers;
const labelFor = (b, cat, st) => Sp.label(b, { cat, story: st || story, fill: x => E.fill(x, cat) });
function saidOn(st, id, cat) {
  const f = st.frames[id], cast = (f.scene && f.scene.cast) || [];
  return E.balloons(f, cat).map(b => {
    const mine = cast.filter(c => c && c.who === b.who), m = mine[b.nth] || mine[0];
    return { who: b.who, label: labelFor(Object.assign({}, b, { variant: m && m.variant }), cat, st), text: b.lang === 'es' ? E.esLine(b.text, cat) : E.fill(b.text, cat), kind: b.kind, lang: b.lang,
      noFace: Sp.faceHidden(b, m), variant: m && m.variant };
  });
}
/* A Counts lesson, answered right unless `answers` says otherwise, each question's prompt, picture and echo. */
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
/* A take lesson under the kit v0.4's moves (decision 57), problem by problem: each lender touched (Tallyheart's touch
 * on a 'show' problem, hers on the others), each box its number (`movers` maps "a-b" to a function (q, m) → her number
 * for a lend or a get, else the right one), then each column's answer (`digits` maps "a-b" to the digits she types for
 * its columns in turn, on its first ask; else the right one), the lines each move and column says, the slips and
 * helps, and at each problem's end its line, its entry and the set's echo. `first(state, def)` runs before anything. */
function takeRows(cat, def, state, o) {
  o = o || {};
  const out = [], seen = {};
  let t = 5000, cur = null;
  if (o.first) o.first(state, def);
  for (let guard = 0; guard < 300 && !TK.done(state); guard++) {
    const q = TK.question(state), key = q.a + '-' + q.b;
    if (!cur || cur.pos !== state.pos) {
      seen[key] = (seen[key] || 0) + 1;
      cur = { pos: state.pos, key, a: q.a, b: q.b, mode: q.mode, twin: q.twin, ask: E.takeQuestion(def, q), moves: [], cols: [], prompt: q.prompt, right: q.right, full: q.full };
      out.push(cur);
    }
    const m = q.moves[q.col][q.move], firstAsk = seen[key] === 1 && !q.twin;
    let r;
    if (m.move === 'touch') {
      r = TK.touch(state, def, m.col, t += 1000, 1500);
      cur.moves.push({ move: 'touch', col: m.col, line: r.line || null });
    } else if (m.move === 'lend' || m.move === 'get') {
      const want = firstAsk && o.movers && o.movers[key] ? o.movers[key](q, m) : m.value;
      r = TK.digit(state, def, want, 1500, t += 1000);
      cur.moves.push({ move: m.move, col: m.col, typed: want, right: r.right, line: r.line || null, slip: r.slip || null, lettered: r.lettered });
    } else {
      const line = E.takeLine(def, q.plan, q.col, q.stage, q.mode, q.full);
      const want = firstAsk && o.digits && o.digits[key] && o.digits[key][q.col] !== undefined ? o.digits[key][q.col] : m.blank ? '' : m.value;
      r = TK.digit(state, def, want, 2000, t += 1000);
      cur.cols.push({ line, typed: want, right: r.right, slip: r.slip, help: r.help, r });
    }
    if (r && r.problemDone) {
      if (r.entry) E.logTake(cat, r.entry);
      cur.entry = r.entry; cur.line = r.line; cur.balloons = r.balloons; cur.lineKind = r.lineKind; cur.twinQueued = r.twin || null;
      cur.echo = E.takeEcho(def, { problem: true, a: r.entry.a, b: r.entry.b, answer: r.entry.answer, correct: r.entry.correct, helped: r.entry.helped }, state);
      if (r.done) E.recordLesson(cat, state);
    }
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
      flags: Object.assign({}, cat.flags) };
    rows.push(row);
    if (o.onRow) o.onRow(row, cat);
    if ((o.stop && id === o.stop) || kind === 'end') break;
    t += 10;
    if (kind === 'next') assert.ok(E.next(cat, st, t), id);
    else if (kind === 'scratch') { row.tap = E.tapWords(f); assert.ok(E.next(cat, st, t), id); }
    else if (kind === 'choice') {
      const opts = E.options(f, cat);
      row.options = opts.map(x => E.fill(E.optionLabel(x.option, cat), cat));
      const want = choiceFor(id, o), ix = opts.findIndex(x => x.index === want);
      assert.ok(ix >= 0 && E.choose(cat, st, want, t), id);
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'frost on every fern' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      if (r.def.op === '-') {
        // the kit's marks page, once, while she has no marks: her pick is her style, never a flag
        if (r.def.marks && !E.takeMarksPage(r.def, cat).current) { assert.ok(E.setTakeStyle(cat, o.style || 'above')); r.state.style = E.takeStyle(cat); }
        row.takes = takeRows(cat, r.def, r.state, o);
      } else row.lesson = countsRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat at chapter 13's first page: chapters 1 to 12 finished (her ceremony, her warrior name, her apprentice), her
 * flags, every Count learned, chapter 12's lesson and store done and its six take-aways logged. `o.name`, `o.ending`,
 * `o.sex`. */
function before13(flags, o) {
  o = o || {};
  const cat = E.blankCat({ now: 1, id: 'c13' });
  cat.name = o.name || 'Moon'; cat.ending = o.ending || 'heart'; cat.petname = 'Muffin';
  if (o.sex) cat.look.sex = o.sex;
  STORIES.slice(0, 12).forEach((s, i) => { cat.finished[s.id] = i + 1; });
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch3Told: true, caseFileOpen: true, ch10Best: 'truth', ch11Named: 'offer' });
  if (flags) { delete cat.flags.specialty; delete cat.flags.ch2Stone; Object.assign(cat.flags, flags); }
  E.countSets(STORIES).forEach(k => { cat.lessons[k.setId] = { set: k.setId, mode: 'chapter', answers: 10, correct: 10, fast: 5, facts: 10, firstTry: 10, helped: 0, noHelp: true, finished: true }; });
  ['ch11-pile', 'ch12-warm'].forEach(k => { cat.lessons[k] = { set: k, mode: 'chapter', answers: 3, correct: 3, fast: 3, facts: 3, firstTry: 3, helped: 0, noHelp: true, finished: true }; });
  ['ch12-take', 'ch12-store'].forEach(k => { cat.lessons[k] = { set: k, op: '-', mode: 'chapter', finished: true }; });
  [[254, 131], [58, 23], [76, 42], [475, 132], [368, 145], [175, 42]].forEach(([a, b], i) => E.logTake(cat, { set: i < 5 ? 'ch12-take' : 'ch12-store', a, b, answer: a - b, given: a - b, correct: true, helped: false, slips: [], ms: 9000, cols: [3000, 3000, 3000], at: 100 + i, kind: 'none', digits: 3, regroup: i ? 'hers' : 'show' }));
  return cat;
}
function fresh(flags, o) { const cat = before13(flags, o); E.startChapter(cat, story, 500); return cat; }
function read(cat, o) { return readStory(cat, story, o || {}); }
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
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', teach: 'show', specialty: 'noticing' } });
  const sc = E.resolveScene(frames[id].scene, cat, STORIES), svg = A.render(sc, { look: LOOKD }).svg;
  return sc.cast.map(m => { const a = anchorOf(sc, m); const L = a && landed(svg, m, a); return L ? Object.assign(L, { m, a }) : null; });
}
// a frame's first cast member where an effect moves it (`motion`, `bonk`), listed first whatever its depth
// (f017's bounce, f021's wiggle and f084's twitch are their captions': `motion`'s speed lines ran across our cat or
// Tallyheart there, and out of the den's doorway like a dash: looked at in a render)
const MOVED = { f009: 'riffle', f016: 'chispapaw', f045: 'chispapaw', f059: 'groundhog' };

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape: The Hunter’s Crouch, module 2’s second, opened by chapter 12 finished, after it on the page and in the offline copy', () => {
  assert.equal(story.id, 'ch13');
  assert.equal(story.number, 13);
  assert.equal(story.title, 'The Hunter’s Crouch');
  assert.equal(story.module, 2);
  assert.equal(story.start, 'f001');
  assert.equal(story.opensWhen, undefined, 'number order: it opens when chapter 12 is finished');
  assert.deepEqual(story.names, { player: '{name}{ending}' }, 'our cat’s balloons labelled with her warrior name');
  assert.ok(frames[story.start], 'start frame exists');
  assert.deepEqual(ids, IDS, 'the spec’s frame list, in reading order');
  assert.equal(ids.length, 85);
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'module', 'names', 'number', 'start', 'teaser', 'title']);
  assert.deepEqual(story.cards, {}, 'no card: module 2 has no Case File');
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch13'), order.indexOf('ch12') + 1, 'chapter 13 follows chapter 12');
  assert.ok(Object.values(frames).every(f => !/\bSTUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 216);
  // the page loads it after chapter 12 and before the Warrior Counts; the gallery too; the offline copy
  const scripts = require('./_load.js').scripts();
  const i12 = scripts.indexOf('app/story/ch12.js'), i13 = scripts.indexOf('app/story/ch13.js');
  assert.ok(i12 >= 0 && i12 < i13 && i13 < scripts.indexOf('app/story/warrior.js'));
  const gallery = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  assert.ok(gallery.indexOf('../app/story/ch12.js') < gallery.indexOf('../app/story/ch13.js'), 'the gallery loads what the page loads');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  assert.match(sw, /'\.\/app\/story\/ch12\.js',\n\s*'\.\/app\/story\/ch13\.js',/);
  // closed before chapter 12 is finished, open after
  const cat = before13({});
  delete cat.finished.ch12;
  assert.equal(E.isOpen(cat, story, STORIES), false, 'chapter 12 first');
  cat.finished.ch12 = 12;
  assert.equal(E.isOpen(cat, story, STORIES), true);
  assert.equal(E.upNext(cat, STORIES).id, 'ch13');
});

test('frame ids run f001 to f084 in reading order, the polite ask’s frames lettered; every edge goes forward; the option frames meet at f053; the groundhog’s scene opens only from “Look closer.” and comes back to the marks', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}[ab]?$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  assert.deepEqual([WAKE, TOMORROW, TEACHES, ASK, LOOK, DREAM], ['f003', 'f016', 'f018', 'f051', 'f058', 'f083']);
  const nexts = id => [...new Set(exits(frames[id]))];
  assert.deepEqual(nexts('f051'), ['f052a', 'f052b']);
  assert.deepEqual(['f052a', 'f052b'].map(id => frames[id].next), ['f053', 'f053']);
  assert.deepEqual(nexts('f058'), ['f059', 'f065']);
  assert.deepEqual(GROUNDHOG.slice(0, -1).map(id => nexts(id)), [['f060'], ['f061'], ['f062'], ['f063'], ['f064']]);
  assert.deepEqual(nexts('f064'), ['f065']);
  const into = {};
  ids.forEach(id => exits(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  assert.deepEqual([into.f052a, into.f052b, into.f053, into.f059, into.f065], [['f051'], ['f051'], ['f052a', 'f052b'], ['f058'], ['f058', 'f064']]);
});

test('exactly one interaction per frame, no unknown keys; no frame shown only `when` a flag matches; `teach` set by the crouch’s choice and replaced on a reread, `foundGroundhog` set by reaching f064 and nothing else; the engine’s checks clean; the grown-ups corner words both flags', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    ['look', 'file', 'pick', 'ask', 'when', 'else', 'gift', 'card', 'sfxAt', 'sfxRead', 'skip'].forEach(k => assert.equal(f[k], undefined, id + ': no ' + k));
    if (f.choice) f.choice.options.forEach((o, i) => assert.deepEqual(o.sets, id === TEACHES ? { teach: TEACH[i] } : {}, id + ' option ' + i));
  });
  assert.deepEqual(ids.filter(id => frames[id].sets).map(id => [id, frames[id].sets]), [['f064', { foundGroundhog: true }]], 'the groundhog’s last screen, for good');
  assert.deepEqual(E.checkStory(story, STORIES), []);
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkTakes(story, STORIES), []);
  STORIES.slice(0, 12).forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id + ' still sound beside it'));
  // the grown-ups corner (the spec's section 1, exactly)
  assert.deepEqual(UI.flagWords.teach, { show: 'taught Chispapaw the hunter’s crouch by showing her (chapter 21 remembers)', try: 'let Chispapaw try the hunter’s crouch first, and watched (chapter 21 remembers)',
    words: 'taught Chispapaw the hunter’s crouch with Tallyheart’s own words (chapter 21 remembers)' });
  assert.deepEqual(UI.flagWords.foundGroundhog, { 'true': 'found the groundhog asleep beside the big dig in GroveClan’s woods (later chapters remember)' });
  // Back to the crouch and another way: `teach` replaced; Back over the groundhog's last screen: `foundGroundhog` kept
  const re = fresh({});
  read(re, { stop: 'f020', teach: 0 });
  assert.equal(re.flags.teach, 'show');
  while (E.frameId(re, story) !== TEACHES) assert.ok(E.back(re, story));
  assert.ok(E.choose(re, story, 2, 9000));
  assert.equal(re.flags.teach, 'words', 'replaced, as chapter 10’s best');
  const gh = fresh({});
  read(gh, { stop: 'f065', look: 0 });
  assert.equal(gh.flags.foundGroundhog, true);
  while (E.frameId(gh, story) !== LOOK) assert.ok(E.back(gh, story));
  assert.equal(gh.flags.foundGroundhog, true, 'sticky: Back never unsets it');
  const no = fresh({});
  read(no, { stop: 'f065', look: 1 });
  assert.equal(no.flags.foundGroundhog, undefined, '“Home before sunset.” sets nothing');
});

test('a child who listens hears every sentence finished: the sound effects are the bell’s and the pounce’s, lettered, never read; every page heard as it is lettered', () => {
  assert.deepEqual(ids.filter(id => frames[id].sfx).map(id => [id, frames[id].sfx]), [['f016', 'Ting! Ting! Ting!'], ['f022', 'Crunch!'], ['f024', 'Ting.']]);
  const some = [{ flags: { ch2Stone: 'nose', specialty: 'friends', teach: 'show', foundGroundhog: true } }, { flags: { ch2Stone: 'chin', specialty: 'swimming', teach: 'words' } }, { flags: { teach: 'try' } }, { flags: {} }];
  ids.forEach(id => {
    const f = frame(id);
    (f.caption || []).map(capText).forEach(t => assert.ok(E.endsSentence(t) || (id === 'f001' && t === 'Chapter 13: The Hunter’s Crouch') ||
      (id === 'f058' && t === 'The shy GroveClan apprentice peeks out of a fern, and points:'), id + ': “' + t + '” runs on'));
    some.forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), id + ': heard as it is lettered'));
  });
  function frame(id) { return frames[id]; }
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

test('every combination reaches the end with no frame that shows nothing: 78 frames on a plain reading, 84 with the groundhog (the spec’s count; the brief’s cap 125); `teach` as she chose, `foundGroundhog` only after the groundhog', () => {
  const counts = new Set();
  for (const c of COMBOS) {
    const name = comboName(c), rows = walkLines(c.flags, c.o), p = walk(c.flags, c.o);
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    assert.equal(rows.length, framesOf(c.o), name);
    counts.add(rows.length);
    assert.ok(rows.length <= 125, name);
    rows.forEach(r => { if (r.kind !== 'end') assert.ok(r.lines.length > 0 || (r.options || []).length || r.tap, r.id + ' shows nothing to ' + name); });
    assert.equal(p.includes('f052a') + p.includes('f052b'), 1, name);
    assert.ok(p.includes(['f052a', 'f052b'][c.o.ask]), name);
    assert.equal(GROUNDHOG.every(id => p.includes(id)), c.o.look === 0, name);
    assert.ok(GROUNDHOG.every(id => !p.includes(id)) || c.o.look === 0, name);
    assert.equal(p.cat.flags.teach, TEACH_OF(c.o), name);
    assert.equal(p.cat.flags.foundGroundhog, c.o.look === 0 ? true : undefined, name);
  }
  assert.deepEqual([...counts].sort(), [78, 84]);
});

/* ------------------------------------------------------------------ the choices */

test('choices: five; the crouch’s three set `teach`; the light ones (waking, “Is it tomorrow NOW?”) to the next screen; the polite ask each to its own reply; the groundhog’s offer to the scene or on to the marks', () => {
  assert.deepEqual(ids.filter(id => frames[id].choice), [WAKE, TOMORROW, TEACHES, ASK, LOOK]);
  const L = id => frames[id].choice.options.map(o => o.label);
  assert.deepEqual(L(WAKE), ['“I’m UP!”', '“First light ALREADY?”']);
  assert.deepEqual(L(TOMORROW), ['“It’s tomorrow.”', '“My first frost too! Mouse lesson?”']);
  assert.deepEqual(L(TEACHES), ['Show her: “Belly low. Tail straight out. Like this.”', 'Let her try: “You try. I’ll watch.”', 'Tallyheart’s words: “The crouch feeds you. The Counts feed your whole Clan.”']);
  assert.deepEqual(L(ASK), ['“Please, may we see your hole?”', '“We’ve come about your hole. POLITELY.”']);
  assert.deepEqual(L(LOOK), ['“Look closer.”', '“Home before sunset.”']);
  [WAKE, TOMORROW].forEach(id => frames[id].choice.options.forEach((o, i) => assert.deepEqual(o, { label: o.label, sets: {}, next: ids[at(id) + 1] }, id + ' option ' + i)));
  frames[TEACHES].choice.options.forEach((o, i) => assert.deepEqual(o, { label: o.label, sets: { teach: TEACH[i] }, next: 'f019' }, 'the crouch ' + i));
  assert.deepEqual(frames[ASK].choice.options.map(o => [o.sets, o.next]), [[{}, 'f052a'], [{}, 'f052b']]);
  assert.deepEqual(frames[LOOK].choice.options.map(o => [o.sets, o.next]), [[{}, 'f059'], [{}, 'f065']]);
  ids.filter(id => frames[id].choice).forEach(id => {
    assert.equal(frames[id].choice.prompt, undefined, id);
    frames[id].choice.options.forEach((o, i) => { assert.deepEqual(Object.keys(o).sort(), ['label', 'next', 'sets'], id + ' option ' + i); assert.ok(words(o.label) <= 12, id + ' option ' + i); });
  });
  // each reply as the story writes it
  assert.deepEqual(['f052a', 'f052b'].map(T), ['Very nicely asked. Come in.', 'The elder blinks. Very polite. And very LOUD. Come in.']);
});

/* ------------------------------------------------------------------ inputs, counts and taps */

test('the dream, the six Counts frames and the fifteen pages she taps once, in the story’s order, each as the spec has it; each Tap’s answer drawn on the next panel where there is one to draw', () => {
  assert.deepEqual(ids.filter(id => frames[id].input), [DREAM]);
  assert.equal(T(DREAM), 'What did {name}{ending} dream, on the night of the first frost?');
  assert.deepEqual(frames[DREAM].input, { kind: 'dream', placeholder: 'Frost… a crouch… a long line…', next: 'f084' });
  assert.ok(frames[DREAM].input.placeholder.length <= 32);
  // the Counts frames, each its question's own words (`intro: false`)
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => [id, frames[id].counts]), [['f007', { set: 'ch13-dawn', intro: false, next: 'f008' }], ['f029', { set: 'ch13-warm', intro: false, next: 'f030' }],
    ['f036', { set: 'ch13-take', intro: false, next: 'f037' }], ['f038', { set: 'ch13-noon', intro: false, next: 'f039' }], ['f039', { set: 'ch13-pile', intro: false, next: 'f040' }],
    ['f063', { set: 'ch13-lullaby', intro: false, next: 'f064' }]]);
  counts.forEach(id => assert.ok(E.countsSet(frames[id].counts.set, story, STORIES), id));
  // the pages she taps once (the spec's one-tap table)
  const taps = ids.filter(id => frames[id].scratch);
  const ONE = [
    ['f004', 'paw', '**Tap** to crunch it again.', 'Crunch it again.'], ['f006', 'nose', '**Tap** to puff one back.', 'Puff one back.'], ['f010', 'paw', '**Tap** to catch it.', 'Catch it.'],
    ['f021', 'nose', '**Tap** to whisper, “Wait for it…”', 'Whisper, “Wait for it…”'], ['f027', 'paw', '**Tap** to help her tuck it in.', 'Help her tuck it in.'],
    ['f035', 'paw', '**Tap** to scratch yours.', 'Scratch yours.'], ['f049', 'paw', '**Tap** to sit and wait.', 'Sit and wait.'], ['f054', 'nose', '**Tap** to sniff the dig.', 'Sniff the dig.'],
    ['f059', 'nose', '**Tap** to whisper, “Hello?”', 'Whisper, “Hello?”'], ['f064', 'paw', '**Tap** to tuck the leaves back over it.', 'Tuck the leaves back over it.'],
    ['f065', 'leaves', '**Tap** to brush the leaves away.', 'Brush the leaves away.'], ['f068', 'marks', '**Tap** to look one more time.', 'Look one more time.'],
    ['f071', 'paw', '**Tap** to flop flat too.', 'Flop flat too.'], ['f079', 'tail', '**Tap** to wave goodnight.', 'Wave goodnight.'], ['f082', 'nose', '**Tap** to curl up tight.', 'Curl up tight.']
  ];
  assert.deepEqual(taps.map(id => [id, frames[id].scratch.tap, frames[id].scratch.prompt, frames[id].scratch.label]), ONE);
  taps.forEach(id => {
    assert.deepEqual(Object.keys(frames[id].scratch).sort(), ['label', 'next', 'prompt', 'tap'], id);
    assert.equal(frames[id].scratch.next, ids[at(id) + 1], id + ': to the next panel');
    assert.deepEqual(E.tapWords(frames[id]), { kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label }, id + ': no miss line: the glow wobbles');
  });
  // the scene targets: the leaves over the marks and the marks close (no cast member carries them)
  assert.deepEqual([frames.f065.scene.opts.tap, frames.f068.scene.opts.tap], ['leaves', 'marks']);
  ['f065', 'f068'].forEach(id => assert.ok(!frames[id].scene.cast.some(c => c.tap), id));
  assert.ok(ids.filter(id => frames[id].scene.opts.tap).every(id => ['f065', 'f068'].includes(id)), 'the grove’s tap only on its two pages');
  // each Tap's answer drawn on the next panel (the spec's section 7, item 4)
  assert.deepEqual([frames.f035.scene.opts.spreadMarks, frames.f036.scene.opts.spreadMarks], ['spread', 'two'], 'scratched: her spread forty-three beside Tallyheart’s');
  assert.deepEqual(frames.f050.scene.cast.filter(c => c.who !== 'groveclan').map(c => c.pose), ['sit', 'sit', 'sit'], 'three tails round three sets of paws');
  assert.deepEqual(castOf('f072', 'player').concat(castOf('f072', 'chispapaw')).map(c => c.pose), ['flat', 'flat'], 'flat as leaves');
  assert.deepEqual([frames.f065.scene.opts.marks, frames.f066.scene.opts.marks], ['leaves', 'bare'], 'the leaves brushed away');
  assert.ok(frames.f027.scene.opts.collar, 'the collar in its hollow on the Tap’s own picture');
  // the order of the things she does
  const order = ['f004', 'f006', 'f007', 'f010', TOMORROW, TEACHES, 'f021', 'f027', 'f029', 'f035', 'f036', 'f038', 'f039', 'f049', ASK, 'f054', LOOK, 'f059', 'f063', 'f064', 'f065', 'f068', 'f071', 'f079', 'f082', DREAM];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: five Counts frames (six with the groundhog), thirteen one-tap pages (fifteen), five choices, the dream
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), gh = c.o.look === 0;
    assert.deepEqual([p.filter(id => frames[id].counts).length, p.filter(id => frames[id].scratch).length, p.filter(id => frames[id].choice).length,
      p.filter(id => frames[id].input).length], [gh ? 6 : 5, gh ? 15 : 13, 5, 1], comboName(c));
  }
});

/* ------------------------------------------------------------------ speakers, tokens, words */

// a speaker given two paragraphs in a row: two balloons (the otters' three on f012 among them)
const CHAINED = ['f012:otter', 'f033:chispapaw', 'f036:tallyheart', 'f056:groveclan', 'f081:tallyheart'];

test('every balloon speaker is in that frame’s cast but the two off the panel (each named, so no face); a speaker’s lines on a panel are one balloon but the spec’s two-paragraph ones; balloons and captions are well formed; a `when` reads only this chapter’s flags', () => {
  ids.forEach(id => {
    const f = frames[id];
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when', 'lang'].includes(k)), [], id + ' say ' + i);
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      if (b.lang !== undefined) assert.equal(b.lang, 'es', id + ' say ' + i);
      const off = (id === 'f068' && b.who === 'tallyheart') || (id === 'f079' && b.who === 'chispapaw');
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
    texts(f).forEach(x => { if (x.when) Object.keys(x.when).forEach(k => assert.ok(FLAGS[k] && FLAGS[k].includes(x.when[k]) && k !== 'foundGroundhog', id + ' ' + x.where + ': when ' + k + '=' + x.when[k])); });
  });
  // the flags read where the spec says, and nowhere else
  const reads = {};
  ids.forEach(id => texts(frames[id]).forEach(x => { if (x.when) Object.keys(x.when).forEach(k => { (reads[k] = reads[k] || new Set()).add(id); }); }));
  assert.deepEqual(Object.fromEntries(Object.entries(reads).map(([k, v]) => [k, [...v]])), { specialty: ['f010', 'f058'], teach: ['f019', 'f078'], ch2Stone: ['f076'] });
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
  const WHISPER = [/^It’s bigger than my WHOLE nest\.$/, /^WORMS\? For SUPPER\?$/, /^Was THAT the badger\?$/, /^Sleep tight\. All frost-time\.$/, /^Claw marks\?$/, /^What’s a courtesy patrol\?$/,
    /^A polite one\.$/, /^\{Es:desagrupo\}$/, /^¡\{Es:25\}!$/, /^The crouch… feeds… you…$/, /^If a badger sits on me, wake me up\.$/, /^Mentor\.$/];
  const SHOUT = [/^We’re not under the Old Bridge\./, /^\{name\}\{ending\}! CATCH!$/, /^Say HI to the badger for me!$/, /^BIGGER!$/, /^What do I LOOK like\? A BADGER\?$/, /^Home, you two! Before sunset!$/,
    /^Goodnight, MENTOR!$/, /^A badger SAT on my whole patrol once!/, /^There we were, minding our own business\./];
  const kinds = { whisper: [], shout: [] };
  ids.forEach(id => (frames[id].say || []).forEach(b => {
    if (b.kind) kinds[b.kind].push(id + ':' + b.text);
    const w = WHISPER.some(re => re.test(b.text)), s = SHOUT.some(re => re.test(b.text));
    assert.equal(b.kind, w ? 'whisper' : s ? 'shout' : undefined, id + ': ' + b.text);
  }));
  assert.equal(kinds.whisper.length, WHISPER.length);
  assert.equal(kinds.shout.length, SHOUT.length);
  // the lullaby's prompt and its two spoken right lines whispered (the groundhog's and hers)
  const lull = story.counts['ch13-lullaby'].facts[0];
  assert.deepEqual([lull.prompt[0].kind, lull.right[0].kind, lull.right[1].kind, lull.right[2].kind], ['whisper', 'whisper', 'whisper', 'caption']);
});

test('the labels: our cat’s balloons by her warrior name; Granny named on hers; the ferry otters by their variants, otter 2 then otter 1 (no Granny in their casts); the groundhog “The round brown thing” till it says GROUNDHOG; the off-panel calls named; the GroveClan elder’s balloons from the elder; the grey tom unnamed', () => {
  const named = [];
  ids.forEach(id => (frames[id].say || []).forEach(b => { if (b.name) named.push(id + ':' + b.who + ':' + b.name); }));
  assert.deepEqual(named, ['f011:otter:Granny', 'f060:groundhog:The round brown thing', 'f061:groundhog:The round brown thing', 'f061:groundhog:The round brown thing',
    'f062:groundhog:The round brown thing', 'f068:tallyheart:Tallyheart', 'f079:chispapaw:Chispapaw']);
  assert.ok(!(frames.f063.say[0].name), 'f063: the page’s own label from here');
  // as the page labels them
  const cat = Object.assign(E.blankCat({}), { name: 'Fern', ending: 'heart', flags: { specialty: 'friends', ch2Stone: 'nose', teach: 'try' } });
  const who = {};
  ids.forEach(id => saidOn(story, id, cat).forEach(b => { (who[b.who] = who[b.who] || new Set()).add(b.label); }));
  assert.deepEqual(Object.fromEntries(Object.entries(who).map(([k, v]) => [k, [...v].sort()])), {
    player: ['Fernheart'], tallyheart: ['Tallyheart'], glintstar: ['Glintstar'], grizzled: ['Grizzled old tom'], snorer: ['Snoring apprentice'],
    murmurchime: ['Murmurchime'], riffle: ['Riffle'], chispapaw: ['Chispapaw'], otter: ['An otter', 'Granny', 'The old ferry otter'].sort(), groveclan: [labelFor({ who: 'groveclan', variant: 1 }, cat)],
    groundhog: ['The groundhog', 'The round brown thing']
  });
  assert.equal(labelFor({ who: 'groundhog' }, cat), 'The groundhog', 'the page’s default label (NAMES.groundhog)');
  // the otters on f012 and f013: each balloon from the nth otter, so otter 2, otter 1, otter 2; then otter 2
  assert.deepEqual(saidOn(story, 'f012', cat).filter(b => b.who === 'otter').map(b => b.variant), [2, 1, 2]);
  assert.deepEqual(saidOn(story, 'f013', cat).filter(b => b.who === 'otter').map(b => b.variant), [2]);
  ['f012', 'f013'].forEach(id => assert.deepEqual(castOf(id, 'otter').map(c => c.variant), [2, 1], id + ': no Granny in the cast'));
  assert.deepEqual(castOf('f011', 'otter').map(c => [c.variant, c.holds]), [[3, 'pole']], 'f011: Granny, with her pole');
  // the elder's balloons from the elder: listed before the apprentice wherever both are drawn
  ids.filter(id => castOf(id, 'groveclan').length).forEach(id => {
    const g = castOf(id, 'groveclan').map(c => c.variant);
    assert.equal(g.length === 2 ? g.join() : g[0] === 1 || g[0] === 2, g.length === 2 ? '1,2' : true, id + ': ' + g);
    saidOn(story, id, cat).filter(b => b.who === 'groveclan').forEach(b => assert.equal(b.variant, 1, id + ': the elder speaks'));
  });
  // our cat's label with no `name` on any balloon of hers: the chapter's names.player
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'player').forEach(b => assert.equal(b.name, undefined, id)));
  assert.equal(labelFor({ who: 'player' }, Object.assign(E.blankCat({}), { name: 'Storm', ending: 'leap' })), 'Stormleap');
  ids.forEach(id => frames[id].scene.cast.forEach(c => assert.ok(!c.name, id + ': no cast member named')));
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
  const es = [];
  everyText((id, x) => tokensIn(x.text).filter(t => /^[Ee]s:/.test(t)).forEach(t => es.push(id + ' ' + (x.lang ? 'es ' : '') + '{' + t + '}')));
  assert.deepEqual(es, ['f030 {Es:resta}', 'f033 es {Es:noAlcanza}', 'f035 es {Es:desagrupo}', 'f040 es {Es:25}', 'counts ch13-warm es {Es:fact}', 'counts ch13-take es {Es:answer}']);
  assert.doesNotMatch(SRC, /[«»]/, 'never the engine’s marks in a story file');
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  // the book's pronouns: a she-cat's and a tom's
  const book = story.book.recap.map(r => r.text).join(' ');
  assert.match(fill(book, PROFILES['she-cat']), /Moonsilver walked her first dawn patrol as a warrior/);
  assert.match(fill(book, PROFILES.tom), /Stormleap walked his first dawn patrol as a warrior/);
});

test('the Spanish, by structure (the literal Spanish is tests/spanish.test.js’s): three whole lines, f033’s, f035’s whisper and f040’s whisper, tokens and punctuation only, each glossed from the words table; f030’s «¡La resta!» a token, its English found for Read to me; the two fixed English “spread” lines pinned; the engine’s guards raise nothing', () => {
  const lines = [];
  ids.forEach(id => (frames[id].say || []).forEach(b => { if (b.lang === 'es') lines.push([id, b]); }));
  assert.deepEqual(lines.map(x => [x[0], x[1].who, x[1].kind, x[1].text]), [['f033', 'chispapaw', undefined, '{Es:noAlcanza}'], ['f035', 'chispapaw', 'whisper', '{Es:desagrupo}'],
    ['f040', 'chispapaw', 'whisper', '¡{Es:25}!']]);
  lines.forEach(([id, b]) => {
    assert.doesNotMatch(b.text.replace(/\{[^}]*\}/g, ''), /\p{L}/u, id + ': no letter outside its tokens');
    assert.ok(tokensIn(b.text).every(t => /^[Ee]s:/.test(t)), id + ': no cat token');
  });
  const W = PC.words.es, cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const cat = Object.assign(E.blankCat({}), { name: 'Fern', ending: 'heart' });
  ['noAlcanza', 'desagrupo', 'resta'].forEach(k => assert.ok(W[k] && W[k].es && W[k].en, k + ' in the words table'));
  assert.equal(E.esLine(frames.f033.say[0].text, cat), '«' + W.noAlcanza.es + '»\n(' + W.noAlcanza.en + ')');
  assert.equal(E.esLine(frames.f035.say[0].text, cat), '«' + W.desagrupo.es + '»\n(' + W.desagrupo.en + ')');
  assert.equal(E.esLine(frames.f040.say[0].text, cat), '«¡' + cap(E.esNumber(25)) + '!»\n(' + cap(E.numberWords(25)) + '!)');
  // f030: the word in her English line, as lettered (never «¡la resta!»), its English for a voice that has no Spanish
  assert.equal(frames.f030.say[1].text, '{Es:resta} THAT’S what take-' + WJ + 'aways are! My little Tall One’s homework this frost-time!');
  assert.ok(E.fill(frames.f030.say[1].text, cat).startsWith('«' + W.resta.es + '» THAT’S'));
  assert.equal(E.esEnglish(W.resta.es), W.resta.en);
  // the two frame lines that say “spread” in fixed English (a frame fills no maths word): a word swap must fail loudly here
  assert.equal(PC.words.spread, 'spread', 'f034’s “Then we spread a row.” and f037’s “Spread a row.” say it in fixed English: change them with the word');
  assert.equal(PC.words.Spread, 'Spread', 'f034 and f037 say “spread” in fixed English');
  assert.deepEqual(FF(/\b[Ss]pread\b/), ['f034', 'f037']);
  assert.deepEqual(E.checkSpanish(story), []);
  // eight words or fewer a Spanish line, the English on the same screen
  lines.forEach(([id, b]) => { const l = E.esLine(b.text, cat); assert.ok(words(unmark(l.split('\n')[0])) <= 8 && l.split('\n').length === 2, id); });
  // Chispa and Chispapaw in the English voice, respelled for speech only
  assert.equal(E.sayAs('Chispapaw stares.', cat), 'Cheespa-paw stares.');
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
function readingWords(rows) {
  let w = 0;
  rows.forEach(r => {
    r.lines.forEach(s => { w += words(fill(s, PROFILES['she-cat'])); });
    (r.options || []).forEach(s => { w += words(s); });
    if (r.tap) w += words(r.tap.replace(/\*\*/g, ''));
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
    // (the one longer run is the spec's frame list from the pile's whisper to the bridge's end, f040 to f048: nine
    // panels, the story's screens there with no Tap, the courtesy patrol's and the path's captions split after their
    // balloons; every other run seven at most)
    let run = [], worst = 0;
    rows.forEach(r => {
      run = r.kind === 'next' ? run.concat([r.id]) : [];
      worst = Math.max(worst, run.length);
      if (run.length > 7) assert.ok(run.every(id => at(id) >= at('f040') && at(id) <= at('f048')), comboName(c) + ': ' + run.join(' ') + ' with nothing to do');
    });
    assert.ok(worst <= 9, comboName(c) + ': ' + worst + ' panels in a row with nothing to do');
  }
  const mm = f => Math.min(...stats.map(f)).toFixed(1) + '–' + Math.max(...stats.map(f)).toFixed(1);
  t.diagnostic('frames ' + mm(x => x.n) + ', lettering ' + mm(x => x.w) + ' words, ' + mm(x => x.avg) + ' a frame; all she reads ' + mm(x => x.all));
  assert.ok(Math.max(...stats.map(x => x.all)) <= 2000, 'the brief’s 2,000 words, at most');
});

test('a caption the page can letter on the panel is 95 characters at most (the spec’s long lines split at a sentence break, the friends’ one sentence at its colon, the words unchanged)', () => {
  // (measured as lettered: a sound's italic stars are not letters, so f055's “*Sniff.*” caption is the spec's 94)
  const len = c => capText(c).replace(/\*/g, '').length;
  assert.deepEqual(ids.filter(id => (frames[id].caption || []).some(c => len(c) > 95)), []);
  assert.deepEqual(['f055', 'f064', 'f065'].map(id => len(frames[id].caption[0])), [94, 94, 94]);
  const caps = id => frames[id].caption.map(capText);
  assert.deepEqual(caps('f004'), ['Outside, every fern is WHITE. The first frost!', 'All your pillow life, frost was a picture through the glass. Now it CRUNCHES under your paws.',
    'It’s like your very first step on grass. Only CRUNCHIER.']);
  assert.deepEqual(caps('f005'), ['The three of you pad out of camp, past the apprentices’ den.', 'The grey tom is still asleep, and so is Chispapaw.', 'Her bell goes *ting* with every snore. *Ting.* *Ting.*']);
  assert.deepEqual(caps('f054'), ['Earth is thrown back in heaps. Five long scratches run down the dig’s sides.', 'No fur. No feathers. Just dirt.']);
  assert.deepEqual(caps('f069'), ['The sun is low when you get home.', 'You tell Glintstar the elder’s guess: a badger, digging for worms.']);
  assert.deepEqual(caps('f070'), ['The afternoon’s hunters bring more down to the store.', 'By the pile, the old tom tells the grey tom a story.']);
  assert.deepEqual(frames.f058.caption.filter(c => c.when.specialty === 'friends').map(capText), ['The shy GroveClan apprentice peeks out of a fern, and points:', COLON_ON]);
  assert.deepEqual(caps('f084'), ['{name}{ending} sleeps.', 'Across the camp, Chispapaw’s tail twitches in her sleep. Straight up.', 'End of Chapter Thirteen.']);
});

test('every frame has a storyboard: a shot type in caps, then 2–5 sentences, no tokens, nothing an illustrator could draw as scary, no badger, nothing dark', () => {
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
    assert.doesNotMatch(b, /\b(teeth|tooth|fangs?|snarl\w*|blood|bleed\w*|claws? (out )?at|bites?|creep\w*|scary|frighten\w*|twolegs?|kittypets?|thunderpath|ironsnake|whisker-lengths?|starclan|vigil|dark\w*|badgers?)\b/i, id);
    assert.doesNotMatch(b.replace(/\bno moon\b/g, ''), /\bmoon/i, id + ': no moon drawn (it has not risen yet)');
  });
  ['f052a', 'f052b'].forEach(id => assert.match(frames[id].board.split('. ')[0], /ONLY FOR A CAT WHO/, id));
  ids.filter(id => frames[id].scratch).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].choice).forEach(id => assert.match(frames[id].board, /THE CHOICE/, id));
  ids.filter(id => frames[id].input).forEach(id => assert.match(frames[id].board, /sits below the panel/, id));
  assert.match(frames.f001.board, /^CLOSE-UP, THE TITLE PANEL/);
  // the marks never a count, a number or a dot in the boards either
  ['f065', 'f066', 'f067', 'f068', 'f073', 'f082'].forEach(id => assert.doesNotMatch(frames[id].board, /\b(a count|counted|counts?|dots?|numbers?)\b/i, id));
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
      const bad = badGrammar(out, x.sfx).filter(e => !(e === 'starts lowercase' && x.text === COLON_ON));
      if (bad.length) problems.push(kind + ' ' + id + ' ' + x.where + ': ' + bad.join(', ') + ' | ' + out);
    });
  });
  problems.forEach(s => t.diagnostic(s));
  assert.deepEqual(problems, []);
  assert.equal(fill(frames.f010.say[0].text, PROFILES.tom), 'Stormleap! CATCH!');
  assert.equal(fill(frames.f043.say[0].text, PROFILES.tom), 'Stormleap, take your apprentice and Tallyheart. A courtesy patrol, to GroveClan.');
  assert.equal(fill(T(DREAM), PROFILES.tom), 'What did Stormleap dream, on the night of the first frost?');
  assert.equal(fill(frames.f015.caption[0], PROFILES.murmur), 'On the way home, the patrol hunts. You catch one mouse. Mutterchime catches three.');
  assert.equal(fill(frames.f076.caption[0], PROFILES.murmur), 'Your warrior’s nest is soft and deep, beside Mutterchime’s.');
  assert.equal(fill(story.book.title, PROFILES.tom), 'Stormleap’s First Frost-Time');
  // the engine fills the same way (the Spanish between its marks)
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind], cat = E.blankCat({});
    cat.name = p.name; cat.ending = p.ending; cat.petname = p.petname; cat.look.sex = p.they === 'he' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => { if (!x.lang) assert.equal(unmark(E.fill(x.text, cat)), fill(x.text, p), kind + ' ' + id + ' ' + x.where); }));
  });
});

test('our own world and the tone: no Warriors or Wings of Fire words, no “borrow”, “carry”, “regroup”, “StarClan”, “warriors’ den”, “vigil”, “Twoleg”, “kittypet”, “fresh-kill”, “Thunderpath”, “whisker-length” or “claw-length”; nobody new named; nobody hurt; no grown cat drawn laughing; no badger drawn; the marks never a dot, a number or a count', () => {
  const banned = /\b(borrow\w*|carr(y|ies|ied)|regroup\w*|twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|medicine den|vigil|from this day|from this night|claw-moon|quarter-moon|half-moon|whisker-lengths?|claw-lengths?|fox-lengths?|tail-lengths?|silverpelt|great oak|fourtrees|moonstone|highrock)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, banned, id + ' board'));
  // a take-away is never called a Count; no square spread, no three-digit spread in the chapter's own lines
  everyText((id, x) => assert.doesNotMatch(x.text, /take-\u2060?aways?\b[^.]*\bCounts?\b|\ba Count\b[^.]*take-away/i, id + ' ' + x.where));
  everyText((id, x) => assert.doesNotMatch(x.text, /spread\w* a square|square\w* spread/i, id + ' ' + x.where));
  // the marks: “a long line” and “little pokes”, never a dot, a number or a count; nobody reads them
  const marks = [];
  everyText((id, x) => { if (/little pokes|long line/.test(x.text)) marks.push(id); });
  assert.deepEqual([...new Set(marks)], ['f066', 'f073', 'f082', 'f083', 'book']);
  everyText((id, x) => { if (/little pokes|long line|claw marks|Claw marks/i.test(x.text)) assert.doesNotMatch(x.text, /\b(dots?|a count|counts?|number)\b/i, id + ' ' + x.where); });
  // the words the brief asks for
  const all = []; everyText((id, x) => all.push(String(x.text).replace(/\u2060/g, '')));
  ['first frost', 'dawn patrol', 'hunter’s crouch', 'courtesy patrol', 'Best manners', 'dig', 'scratches', 'Claw marks', 'long line', 'little pokes', 'badger', 'GROUNDHOG', 'spread a row', 'Ten more loose',
    'take-aways', 'loose'].forEach(w => assert.ok(all.some(s => s.toLowerCase().includes(w.toLowerCase())), w));
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(bites?|bitten|teeth|fangs?|claws? at|snarls?|growls?|kill\w*|strikes?|attacks?|fights?|wound(ed)?|blood|bleed|die[sd]?|dead|death|bones?|drown\w*|creepy|scary|monster|afraid)\b/i, id + ' ' + x.where));
  // the moon never named or drawn (it has not risen yet)
  everyText((id, x) => assert.doesNotMatch(String(x.text), /\bmoon\b/i, id + ' ' + x.where));
  ids.forEach(id => assert.equal(frames[id].scene.opts.moon, undefined, id + ': no moon'));
  // no grown cat in `laugh`, no mentor sad or scared, nobody scared at all; Tallyheart's pride `proud`
  ids.forEach(id => frames[id].scene.cast.filter(c => GROWN.includes(c.who)).forEach(c => assert.notEqual(c.mood, 'laugh', id + ': ' + c.who + ' laughing')));
  ids.forEach(id => frames[id].scene.cast.filter(c => ['tallyheart', 'glintstar'].includes(c.who)).forEach(c => assert.ok(!['sad', 'scared', 'worried'].includes(c.mood), id + ': ' + c.who + ' ' + c.mood)));
  ids.forEach(id => frames[id].scene.cast.forEach(c => assert.notEqual(c.mood, 'scared', id)));
  seq('f019', 'f026').forEach(id => assert.equal(castOf(id, 'tallyheart')[0].mood, 'proud', id + ': Tallyheart proud at the side'));
  // no badger in any cast, not even a shadow; the groundhog only in its scene
  ids.forEach(id => assert.ok(!frames[id].scene.cast.some(c => /badger/.test(c.who)), id));
  assert.deepEqual(ids.filter(id => castOf(id, 'groundhog').length), GROUNDHOG);
  // the last frame warm: End of Chapter Thirteen
  assert.deepEqual(frames[ids[ids.length - 1]].caption.slice(-1), ['End of Chapter Thirteen.']);
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the story’s own: every caption, balloon, sound effect, option and Counts line is in docs/chapters/13-the-hunters-crouch.md (the Spanish as the story writes it out), and every line its screens speak is lettered', () => {
  const from = DOC.indexOf('# Chapter 13: The Hunter’s Crouch'), to = DOC.indexOf('\n*For us*');
  assert.ok(from === 0 && to > from, 'the story, from its title to its notes');
  const body = DOC.slice(DOC.indexOf('## First light'), to);
  const flat = s => s.replace(/\*\*/g, '').replace(/\*/g, '').replace(/«|»/g, '').replace(/\s+/g, ' ').trim();
  const loose = s => s.replace(/[,.]/g, '').replace(/\s+/g, ' ').trim();
  const page = flat(body), pageLoose = loose(page);
  const spoken = body.split(/\n\s*\n/).map(p => (flat(p).match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).join(' ')).filter(Boolean).map(loose).join(' ¶ ');
  const inText = s => page.includes(s) || spoken.includes(loose(s)) || pageLoose.includes(loose(s));
  const bySentence = s => s.split(/(?<=[.!?…:])\s+/).every(inText);
  // a line as she reads it: the Spanish filled (marks dropped), the cat's tokens kept, the word joiner and italics' stars gone
  const asRead = (s, lang) => (lang === 'es' ? unmark(E.esLine(s, null).split('\n')[0]) : unmark(E.esMarks(s))).replace(/\u2060/g, '').replace(/\*/g, '');
  const mine = [];
  ids.forEach(id => {
    const f = frames[id];
    (f.caption || []).forEach(c => { const s = asRead(capText(c)); if (!inText(s) && !bySentence(s)) mine.push(id + ': ' + s); });
    (f.say || []).forEach(b => { const s = asRead(b.text, b.lang); if (!inText(s) && !bySentence(s)) mine.push(id + ' ' + b.who + ': ' + s); });
    if (f.sfx && !page.includes(f.sfx.replace(/!$/, ''))) mine.push(id + ' sfx: ' + f.sfx);
    if (f.choice) f.choice.options.forEach(o => { if (!page.includes(o.label.replace(/^“|”$/g, ''))) mine.push(id + ' option: ' + o.label); });
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '').replace(/!$/, '')), id + ': ' + f.scratch.prompt);
  });
  // the Counts sets' lines: the prompts, the right lines, the marks page, the echoes (the warm-up's for 9 × 7, the
  // lesson's for 85 − 39)
  countsLines().forEach(x => {
    let s = x.text;
    if (x.lang === 'es') s = unmark(E.esLine(s, null, x.extra).split('\n')[0]);
    s = s.replace(/\*/g, '');
    if (!inText(s) && !bySentence(s)) mine.push('counts ' + x.set + ' ' + x.where + ': ' + s);
  });
  assert.deepEqual(mine, []);
  assert.equal(E.chapterHeading(story), 'Chapter 13: The Hunter’s Crouch');
  // and the other way: every line a screen of the story speaks is lettered somewhere in the chapter (the Spanish filled)
  const lettered = [];
  everyText((id, x) => lettered.push(x.lang === 'es' ? unmark(E.esLine(x.text, null, x.extra).split('\n')[0]) : asRead(String(x.text).replace(/\*\*/g, ''), x.lang)));
  // the warm-up's echo as the story writes it out (9 × 7), and the lesson's after 85 − 39
  lettered.push(unmark(E.esLine('¡{Es:fact}!', null, { a: 9, b: 7 })), unmark(E.esLine('¡{Es:answer}!', null, { answer: 46 })));
  // the kit's lines (the moves' “Marks first, then the answer.”, the tap line) are the kit's, said on its pages
  const KIT = ['Marks first, then the answer.', 'No loose. Spread a row: tap it.', 'Let’s scratch it out.'];
  const all = loose(lettered.concat(KIT).join(' '));
  const missing = [];
  body.replace(/\*\*([^*]+)\*\*/g, ' ').replace(/\*[^*]*\*/g, ' ').split(/\n\s*\n/).forEach(p => {
    (p.replace(/\s+/g, ' ').replace(/«|»/g, '').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => { if (!all.includes(loose(q)) && !q.split(/(?<=[.!?…,])\s+/).every(s => all.includes(loose(s)))) missing.push(q); });
  });
  assert.deepEqual(missing, []);
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab), camera by camera: every anchor one of its camera’s own (but the named spots), every option the set declares by value, the cast, poses, moods and extras, each worn by whom the spec says', () => {
  const v = A.vocab;
  assert.ok(v.cast.includes('groundhog') && same(v.otherPoses.groundhog, ['doze', 'wake', 'sit', 'yawn', 'sleep']), 'the groundhog, its five poses');
  assert.deepEqual([v.sets.camp.opts.frost, v.sets.hollow.opts.spreadMarks, v.sets.den.opts.collar], [[false, true, 'prints'], [false, 'standing', 'spread', 'two'], [false, true]]);
  assert.deepEqual([v.sets.grove.opts.dig, v.sets.grove.opts.marks, v.sets.grove.opts.tap], [[false, true], [false, 'leaves', 'bare'], ['none', 'leaves', 'marks']]);
  assert.ok(['dig', 'marks'].every(k => v.sets.grove.cams.includes(k)), 'the dig composition’s two cameras');
  ['ferns-1', 'ferns-2'].forEach(k => assert.ok(v.sets.camp.anchors.includes(k), k));
  ['door-1', 'door-2', 'doorway', 'dig-front', 'marks-1', 'marks-2', 'dig-elder', 'dig-fern', 'oak-near'].forEach(k => assert.ok(v.sets.grove.anchors.includes(k), k));
  const OLD = { holdAt: ['paws', 'mouth', 'chin'], flatEars: [true], purr: [true] };
  const seen = {}, spots = [];
  ids.forEach(id => {
    const s = frames[id].scene;
    assert.ok(s && typeof s === 'object', id + ': no scene');
    assert.deepEqual(Object.keys(s).filter(k => !['set', 'cam', 'opts', 'cast', 'fx'].includes(k)), [], id + ': scene keys');
    const set = v.sets[s.set], info = A.sceneInfo(s.set);
    assert.ok(set, id + ': unknown set ' + s.set);
    assert.ok(set.cams.includes(s.cam), id + ': set ' + s.set + ' has no camera ' + s.cam);
    assert.ok(['den', 'camp', 'crossing', 'riverbank', 'hollow', 'grove'].includes(s.set), id + ': the spec’s places, no new one');
    const mine = info.anchors[info.cams[s.cam].comp];
    Object.keys(s.opts || {}).forEach(k => {
      const allowed = set.opts[k];
      assert.ok(allowed, id + ': set ' + s.set + ' has no option ' + k);
      assert.ok(Array.isArray(allowed) && allowed.some(x => same(x, s.opts[k])), id + ': ' + k + '=' + JSON.stringify(s.opts[k]));
    });
    const used = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'variant'].concat(Object.keys(v.extras), Object.keys(OLD)).includes(k)), [], where + ': keys');
      assert.ok(v.cast.includes(c.who), where + ': unknown who');
      assert.ok(['player', 'tallyheart', 'glintstar', 'grizzled', 'snorer', 'murmurchime', 'clancat', 'riffle', 'otter', 'chispapaw', 'groveclan', 'groundhog'].includes(c.who), where + ': nobody new but the groundhog');
      Object.keys(v.extras).concat(Object.keys(OLD)).forEach(k => {
        if (c[k] === undefined) return;
        const vals = v.extras[k] || OLD[k];
        assert.ok(vals.some(x => same(x, c[k])), where + ': ' + k + '=' + JSON.stringify(c[k]));
        seen[k] = (seen[k] || 0) + 1;
      });
      // who wears what
      if (c.holds === 'mouse') assert.ok(id === 'f015' && ['murmurchime', 'player'].includes(c.who) && c.pose === 'walk', where + ': the morning’s mice carried home');
      if (c.holds === 'leaf') assert.ok(id === 'f022' && c.who === 'chispapaw' && c.holdAt === 'paws', where + ': her leaf, caught');
      if (c.holds === 'pebbles') assert.ok(c.who === 'riffle' && c.pose === 'juggle' && s.set === 'crossing', where + ': juggling on land, Otter’s honor holds only under the Old Bridge');
      if (c.holds === 'pole') assert.ok(id === 'f011' && c.who === 'otter' && c.variant === 3, where + ': Granny’s pole');
      if (c.holds !== undefined) assert.ok(['mouse', 'leaf', 'pebbles', 'pole'].includes(c.holds), where + ': ' + c.holds);
      if (c.holdAt !== undefined) assert.equal(id, 'f022', where);
      // Chispapaw's collar: on to f026, left in her nest at f027 (`collar: false` from then on)
      if (c.who === 'chispapaw') assert.equal(c.collar, at(id) >= at('f027') ? false : undefined, where + ': her collar');
      else assert.equal(c.collar, undefined, where);
      if (c.tap !== undefined) {
        assert.ok(frames[id].scratch && frames[id].scratch.tap === c.tap, where + ': the tap mark is this page’s Tap');
        assert.equal(c.who, 'player', where + ': every cast Tap is on our cat');
        if (c.tap === 'tail') assert.ok(c.tailUp, where + ': the raised tail');
        if (c.tap === 'paw') assert.ok(['walk', 'sit', 'pawup', 'stand', 'crouch'].includes(c.pose), where);
        if (c.tap === 'nose') assert.ok(['sit', 'crouch', 'walk', 'loaf'].includes(c.pose), where);
      }
      if (c.tailUp) assert.ok((c.who === 'chispapaw' && (c.pose === 'crouch' || (id === 'f084' && c.pose === 'curl'))) || (c.who === 'player' && id === 'f079'), where + ': her tail like a flag, and our cat’s goodnight');
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
        if (frames[id].scene.cast.some(m => m.who === 'chispapaw')) assert.ok(!(c.who === 'clancat' && c.variant === 3), where + ': no coat 3 beside Chispapaw');
      } else assert.ok(!v.variants[c.who], where + ': a ' + c.who + ' says which one');
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), id + ': unknown fx ' + e));
    assert.ok(!s.fx.some(e => ['rain', 'lightning', 'glow', 'purr'].includes(e)), id + ': no storm');
    if (s.fx.includes('bonk')) assert.equal(id, 'f009', id + ': the pebble on Riffle’s nose');
  });
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'collar', 'holdAt', 'holds', 'tailUp', 'tap']);
  // the spots, each where the staging puts it
  const where = (who, spot) => spots.filter(s => s.endsWith(':' + who + ':' + spot)).map(s => s.split(':')[0]);
  assert.deepEqual(where('player', 'HOL_YOU'), seq('f028', 'f037'));
  assert.deepEqual(where('tallyheart', 'PEER'), ['f002', 'f003']);
  assert.deepEqual(where('tallyheart', 'PAST'), ['f081']);
  assert.deepEqual(where('chispapaw', 'NOON_CHISPA'), ['f038', 'f040', 'f041']);
  assert.deepEqual(where('otter', 'CROSS_GRANNY'), ['f011']);
  assert.deepEqual(where('player', 'RAFT_SHORE').concat(where('tallyheart', 'RAFT_SHORE')), ['f012', 'f013'], 'the shore at the raft: our cat, then Tallyheart, the otters’ audience');
  assert.deepEqual(where('chispapaw', 'PATH_CHISPA'), ['f046', 'f047']);
  assert.deepEqual(where('player', 'BRIDGE_YOU'), ['f048', 'f049', 'f050']);
  assert.deepEqual(where('chispapaw', 'DOOR_BACK'), ['f059']);
  assert.deepEqual(where('grizzled', 'TALE_OLD'), seq('f070', 'f074'));
});

/* ------------------------------------------------------------------ staging */

const DENW13 = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true, miststone: true };
const H13 = { marks: 10, glow: 'auto' };
test('staging, the places and their options: her warrior’s nest at first light and by night (no moon), the apprentices’ den with the collar from f027, the camp’s first frost and its trails on f007 only, the camp by day with the Clan, the Crossing with no airplane, the Hollow’s spread marks, the grove’s dig, its close camera and the marks', () => {
  ids.forEach(id => {
    const s = frames[id].scene, cam = camOf(id);
    if (cam === 'den/nest') assert.deepEqual(s.opts, DENW13, id);
    if (cam === 'den/inside') assert.deepEqual(s.opts, at(id) < at('f027') ? { weather: 'clear' } : { weather: 'clear', collar: true }, id);
    if (s.set === 'camp') {
      const want = at(id) <= at('f026') ? (id === 'f007' ? { frost: 'prints' } : { frost: true }) : cam === 'camp/fountain' ? {} : at(id) <= at('f045') ? { crowd: true } : {};
      assert.deepEqual(s.opts, want, id);
    }
    if (s.set === 'crossing') assert.deepEqual(s.opts, ['f008', 'f009'].includes(id) ? { plane: 'none', pebbles: true } : { plane: 'none' }, id + ': no airplane');
    if (s.set === 'riverbank') assert.deepEqual([s.cam, s.opts], ['path', {}], id);
    if (s.set === 'hollow') {
      assert.equal(s.cam, 'lesson', id + ': the spread reads on lesson (the sets owner’s look), so f035 never moves to sand');
      assert.deepEqual([s.opts.marks, s.opts.glow], [10, 'auto'], id + ': her ten claw marks, as chapters 2 to 12 carry them');
    }
    if (cam === 'grove/oak') assert.deepEqual(s.opts, { dig: true }, id);
    if (cam === 'grove/wide' || cam === 'grove/meet') assert.deepEqual(s.opts, {}, id);
  });
  assert.deepEqual(ids.filter(id => frames[id].scene.set === 'hollow').map(id => frames[id].scene.opts.spreadMarks || false),
    [false, false, false, false, 'standing', 'standing', 'standing', 'spread', 'two', 'two']);
  assert.deepEqual(seq('f028', 'f037'), ids.filter(id => frames[id].scene.set === 'hollow'));
  ids.filter(id => frames[id].scene.set === 'hollow').forEach(id => assert.deepEqual(Object.assign({}, frames[id].scene.opts, { spreadMarks: undefined }), Object.assign({}, H13, { spreadMarks: undefined }), id));
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.collar), ['f027', 'f078', 'f080', 'f084'], 'the collar beside her nest whenever the apprentices’ den is drawn after f027');
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.frost === 'prints'), ['f007'], 'the trails only once she has walked them');
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.frost), ['f004', 'f006', 'f007'].concat(seq('f016', 'f026')), 'frost only in the camp, only by first light');
  assert.deepEqual(ids.filter(id => frames[id].scene.set === 'grove').map(id => [id, camOf(id).split('/')[1], frames[id].scene.opts.marks || false]),
    [['f048', 'wide', false], ['f049', 'wide', false], ['f050', 'wide', false], ['f051', 'meet', false], ['f052a', 'meet', false], ['f052b', 'meet', false], ['f053', 'oak', false],
     ['f054', 'dig', 'leaves'], ['f055', 'dig', 'leaves'], ['f056', 'oak', false], ['f057', 'oak', false], ['f058', 'dig', 'leaves'], ['f059', 'dig', 'leaves'], ['f060', 'dig', 'leaves'],
     ['f061', 'dig', 'leaves'], ['f062', 'dig', 'leaves'], ['f063', 'dig', 'leaves'], ['f064', 'dig', 'leaves'], ['f065', 'dig', 'leaves'], ['f066', 'dig', 'bare'], ['f067', 'dig', 'bare'],
     ['f068', 'marks', 'bare']]);
  assert.deepEqual(frames.f068.scene.cast, [], 'the close-up: no face in it, the call from off the panel');
  // the camp's cameras vary at noon, so eight panels are not one
  const noon = seq('f038', 'f045').map(camOf);
  ['camp/crowd', 'camp/fountain', 'camp/reveal'].forEach(cm => assert.ok(noon.includes(cm), cm));
  assert.deepEqual(['f039', 'f042'].map(camOf), ['camp/fountain', 'camp/fountain']);
  assert.deepEqual(seq('f017', 'f026').map(camOf), seq('f017', 'f026').map(() => 'camp/crowd'), 'the crouch on crowd (the sets owner’s fallback from ferns: three could not stand there apart)');
});

test('staging, the people: the crouch (our cat at ferns-1, Chispapaw at ferns-2, Tallyheart off to the side), the Hollow, the oak’s four clear of the dig, the dig close, the marks seen only by our cat and Chispapaw, the elder gone before them, the nests, the motion’s first members, Riffle', () => {
  // the crouch
  seq('f017', 'f026').forEach(id => {
    assert.deepEqual([castOf(id, 'player')[0].at, castOf(id, 'chispapaw')[0].at, castOf(id, 'tallyheart')[0].at], ['ferns-1', 'ferns-2', 'crowd-right'], id);
    assert.equal(castOf(id, 'tallyheart')[0].pose, 'sit', id + ': watching, never teaching');
  });
  assert.deepEqual(seq('f019', 'f025').map(id => castOf(id, 'chispapaw')[0].pose), ['crouch', 'crouch', 'crouch', 'crouch', 'sit', 'crouch', 'sit']);
  assert.deepEqual(['f019', 'f020', 'f021', 'f024'].map(id => !!castOf(id, 'chispapaw')[0].tailUp), [false, true, true, true], 'her tail sticks straight UP from f020');
  assert.deepEqual(castOf('f022', 'chispapaw').map(c => [c.pose, c.holds, c.holdAt]), [['crouch', 'leaf', 'paws']]);
  // the Hollow: Tallyheart at the tree facing left, our cat at HOL_YOU facing right, sitting (a crouch reaches the marks), Chispapaw behind her
  seq('f028', 'f037').forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => [c.who, typeof c.at === 'object' ? spotName(c.at) : c.at, c.facing, c.pose]),
    [['chispapaw', 'sunpatch-3', 'right', 'sit'], ['tallyheart', 'tree', 'left', 'sit'], ['player', 'HOL_YOU', 'right', 'sit']], id));
  // the oak: our three and the elder at the four spots the sets owner reports clear of the dig (root-3 stands on the doorway)
  ['f053', 'f056'].forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => c.who + '@' + c.at), ['groveclan@elder', 'tallyheart@root-1', 'chispapaw@oak-near', 'player@root-2'], id));
  ids.filter(id => camOf(id) === 'grove/oak').forEach(id => assert.ok(!frames[id].scene.cast.some(c => c.at === 'root-3'), id));
  assert.deepEqual(castOf('f057', 'groveclan'), [], 'f057: the elder gone to her den');
  assert.deepEqual([castOf('f057', 'tallyheart')[0].pose, castOf('f057', 'tallyheart')[0].facing], ['walk', 'left'], 'Tallyheart heads back to the bridge');
  // the marks: only our cat and Chispapaw ever see them (never Tallyheart, the elder or the apprentice)
  seq('f065', 'f068').forEach(id => assert.ok(frames[id].scene.cast.every(c => ['player', 'chispapaw'].includes(c.who)), id));
  seq('f065', 'f067').forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => c.who + '@' + c.at), ['chispapaw@marks-2', 'player@marks-1'], id));
  // the apprentice peeks at f058 for every cat, never at the marks; never speaks
  assert.deepEqual(castOf('f058', 'groveclan').map(c => [c.variant, c.at]), [[2, 'dig-fern']]);
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'groveclan').forEach(() => assert.ok(castOf(id, 'groveclan')[0].variant === 1, id)));
  // the groundhog: at its doorway, the five poses as the scene goes
  assert.deepEqual(GROUNDHOG.map(id => castOf(id, 'groundhog')[0].pose + ':' + castOf(id, 'groundhog')[0].at), ['doze:doorway', 'wake:doorway', 'sit:doorway', 'sit:doorway', 'yawn:doorway', 'sleep:doorway']);
  GROUNDHOG.forEach(id => assert.equal(castOf(id, 'player')[0].at, 'door-1', id));
  // the motion's and the bonk's first members
  Object.keys(MOVED).forEach(id => {
    assert.equal(frames[id].scene.cast[0].who, MOVED[id], id + ': the one the effect moves, first');
    assert.ok(frames[id].scene.fx.includes(id === 'f009' ? 'bonk' : 'motion'), id);
  });
  assert.deepEqual(ids.filter(id => frames[id].scene.fx.some(e => e === 'motion' || e === 'bonk')), Object.keys(MOVED));
  // Riffle: juggling on land, his goodbye a hop (he has no pawup)
  assert.deepEqual(['f008', 'f009', 'f010', 'f011', 'f012', 'f013', 'f014'].map(id => castOf(id, 'riffle').map(c => c.pose + ':' + (c.holds || ''))[0]),
    ['juggle:pebbles', 'juggle:pebbles', 'juggle:pebbles', 'stand:', 'stand:', 'stand:', 'hop:']);
  // the nests: our cat in hers on every nest frame, {Murmur}chime in the next nest; asleep as the story says
  ids.filter(id => camOf(id) === 'den/nest').forEach(id => {
    assert.deepEqual(castOf(id, 'player').map(c => c.at), ['nest'], id);
    assert.deepEqual(castOf(id, 'murmurchime').map(c => c.at), ['next-nest'], id);
  });
  assert.deepEqual(['f001', 'f083'].map(id => castOf(id, 'player')[0].pose + ':' + castOf(id, 'player')[0].asleep), ['curl:true', 'curl:true']);
  ids.filter(id => frames[id].scene.fx.includes('sparkle')).forEach(id => assert.equal(frames[id].scene.cast[0].who, 'player', id + ': the sparkle round her'));
  assert.deepEqual(['f081', 'f082', 'f083'].map(id => castOf(id, 'murmurchime')[0].asleep), [true, true, true]);
  // the apprentices' den: the grey tom at sleeper-1 and Chispapaw in our cat's old nest; her last picture, her tail straight up
  ['f005', 'f078', 'f080', 'f084'].forEach(id => assert.deepEqual([castOf(id, 'snorer').map(c => c.at), castOf(id, 'chispapaw').map(c => c.at)], [['sleeper-1'], ['nest']], id));
  assert.deepEqual(castOf('f084', 'chispapaw').map(c => [c.pose, c.asleep, c.tailUp, c.collar]), [['curl', true, true, false]]);
  assert.deepEqual(castOf('f078', 'chispapaw').map(c => c.pose), ['crouch'], 'her bedtime crouch');
  // the dawn patrol is three: Tallyheart, {Murmur}chime and our cat (Chispapaw and the grey tom asleep)
  seq('f004', 'f015').filter(id => frames[id].scene.set !== 'den').forEach(id => assert.ok(!castOf(id, 'chispapaw').length && !castOf(id, 'snorer').length, id));
  ['f004', 'f006', 'f007'].forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => c.who).sort(), ['murmurchime', 'player', 'tallyheart'], id));
});

test('no two cats touch: every pair on the same row of every frame a step apart, and Chispapaw clear of everyone; a farther cast member’s face is never under a nearer one', { skip: !A.character && 'no cats.js' }, (t) => {
  let least = Infinity;
  const bad = [];
  ids.forEach(id => {
    const b = boxesOn(id).filter(Boolean);
    for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
      const p = b[i], q = b[j], gap = gapOf(p.body, q.body), sameRow = Math.abs(p.a.y - q.a.y) < 40, chispa = p.m.who === 'chispapaw' || q.m.who === 'chispapaw';
      const elev = p.a.elev || q.a.elev;
      if (!elev && (sameRow || chispa)) {
        least = Math.min(least, gap);
        if (gap < 4 && !['f081', 'f002', 'f003'].includes(id)) bad.push(id + ': ' + p.m.who + ' and ' + q.m.who + ' (' + Math.round(gap) + ')');
      }
      if (!elev) {
        const far = p.a.y <= q.a.y ? p : q, near = far === p ? q : p;
        if (cover(far.head, near.body) > 0.2) bad.push(id + ': ' + far.m.who + '’s face under ' + near.m.who);
      }
    }
  });
  assert.deepEqual(bad, []);
  t.diagnostic('the nearest two on a row: ' + Math.round(least));
  // f081 (and f002, f003): Tallyheart at the close-up's right edge, a step nearer than the nests, listed last; our cat's
  // face clear of her, her own face in the panel
  ['f002', 'f003', 'f081'].forEach(id => {
    const bx = boxesOn(id), ta = bx.find(x => x && x.m.who === 'tallyheart'), pl = bx.find(x => x && x.m.who === 'player');
    assert.equal(frames[id].scene.cast[frames[id].scene.cast.length - 1].who, 'tallyheart', id);
    assert.ok(ta.a.y > pl.a.y && cover(pl.head, ta.body) < 0.05, id + ': our cat’s face clear (' + cover(pl.head, ta.body).toFixed(2) + ')');
    assert.ok((ta.head[0] + ta.head[2]) / 2 < 1260, id + ': her face in the close-up');
  });
  // f081: our cat's tail wrapped (`kind`), so Tallyheart's ear never lies over it (chapter 13's review: `happy` raised the
  // loaf's tail into her ear, the two cats touching)
  const b81 = boxesOn('f081'), ta81 = b81.find(x => x && x.m.who === 'tallyheart'), pl81 = b81.find(x => x && x.m.who === 'player');
  assert.ok(gapOf(pl81.body, ta81.head) > 0, 'f081: our cat (tail and all) clear of Tallyheart: ' + pl81.body.map(Math.round) + ' / ' + ta81.head.map(Math.round));
});

test('staging, depth: a cast member further back is never drawn over a nearer one’s head; every cast listed back to front (the fountain top, raised, anywhere; the first member an effect moves excepted; the den’s nests as the close-up lays them; the GroveClan apprentice after the elder)', { skip: !A.character && 'no cats.js' }, () => {
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
    const ys = sc.cast.filter((c, i) => !(MOVED[id] && i === 0)).filter(c => !(c.who === 'groveclan' && c.variant === 2))
      .filter(c => typeof c.at === 'object' || (anchors[c.at] && !anchors[c.at].elev)).map(c => (typeof c.at === 'object' ? c.at : anchors[c.at]).y);
    for (let i = 1; i < ys.length; i++) assert.ok(ys[i] >= ys[i - 1] || sc.set === 'den', id + ': cast ' + i + ' further back than the one before it (' + ys.join(' ') + ')');
  });
  assert.deepEqual(bad, []);
});

// the time of day: first light to the Hollow by morning, noon and the GroveClan afternoon by day, home at sunset, bedtime
// by night
const DAYS = [['f001', 'f037', 'morning'], ['f038', 'f068', 'day'], ['f069', 'f074', 'sunset'], ['f075', 'f084', 'night']];
test('the time of day runs morning from first light to the Hollow (the Crossing and the riverbank too: the sets owner’s look), day from noon through GroveClan’s afternoon, sunset home, night from the stars to the end; never dark, no moon', () => {
  ids.forEach(id => {
    const day = DAYS.find(([a, b]) => at(id) >= at(a) && at(id) <= at(b));
    assert.ok(day, id);
    assert.equal(frames[id].scene.fx.filter(x => ['morning', 'day', 'sunset', 'dusk', 'night'].includes(x)).join(), day[2], id);
  });
  assert.deepEqual(ids.filter(id => frames[id].scene.fx.includes('stars')), ['f075']);
});

test('the storyboard is this chapter’s: every frame, the optional scene and the option frames in their branches, the Spanish as *[es]*, the new art in words', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch13.md'), 'utf8');
  assert.match(md, /^# Storyboard: Chapter 13, The Hunter’s Crouch/);
  ids.forEach(id => assert.match(md, new RegExp('^#{3,5} ' + id + '\\b', 'm'), id + ' in the storyboard'));
  assert.doesNotMatch(md, /Not reachable from the start/);
  assert.doesNotMatch(md, /STUB/);
  assert.match(md, /\| Frames \| 85 /);
  assert.match(md, /\*\[es\]\*/);
  assert.match(md, /one long line and eight little pokes/);
  assert.match(md, /Then the marks page/);
  assert.doesNotMatch(md.replace(/claw marks? on the trunk|its ten claw marks|ten claw marks/gi, ''), /\bclaw mark(s)? (in|on) the (earth|ground)/i);
});

test('the shots vary like a graphic novel', () => {
  const shotOf = id => SHOTS.find(s => frames[id].board.startsWith(s));
  const used = new Set(ids.map(shotOf));
  ['WIDE', 'MEDIUM', 'CLOSE-UP', 'LOW ANGLE', 'EXTREME CLOSE-UP'].forEach(s => assert.ok(used.has(s), s));
  let run = 0, worst = 0;
  ids.forEach((id, i) => { run = i && shotOf(id) === shotOf(ids[i - 1]) && camOf(id) === camOf(ids[i - 1]) ? run + 1 : 1; worst = Math.max(worst, run); });
  assert.ok(worst <= 13, 'the same shot on the same camera ' + worst + ' panels running');
  ['reveal', 'crowd', 'fountain'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'camp/' + cam), cam));
  ['wide', 'low', 'rocks', 'raft'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'crossing/' + cam), cam));
  ['wide', 'meet', 'oak', 'dig', 'marks'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'grove/' + cam), cam));
  ['inside', 'nest'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'den/' + cam), cam));
});

/* ------------------------------------------------------------------ every frame drawn */

test('every frame renders, and everyone in the cast is in the picture; every Tap has its target in the art; no moon drawn; the frost, the spread marks, the collar, the dig and the marks draw; the Counts pictures all draw', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'brown-tabby', marking: 'white-paws', eyes: 'odd' }, { sex: 'she', fur: 'cream', marking: 'none', eyes: 'blue' }];
  const off = [];
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', specialty: 'noticing', teach: 'show' } });
  const SMALL = id => ['camp/reveal', 'den/inside', 'riverbank/path', 'crossing/wide', 'crossing/low', 'grove/wide', 'grove/meet', 'grove/oak', 'grove/dig'].includes(camOf(id));
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
        if (!SMALL(id)) assert.ok(h.r >= 3, id + ': ' + c.who + ' face radius ' + h.r);
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
    if (k === 0 && sc.set === 'camp' && sc.cam !== 'fountain') assert.ok(!/data-prop="camp-moon"/.test(r.svg), id + ': no moon');
  }));
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
  const svgOf = id => A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg;
  assert.ok(new Set(['f034', 'f035', 'f036'].map(svgOf)).size === 3, 'standing, spread, then two');
  assert.match(svgOf('f035'), /pc-quick-crossed/, 'the struck line');
  assert.match(svgOf('f035'), /pc-quick-frame/, 'the ten in its frame');
  assert.match(svgOf('f027'), /collar/i, 'the collar in the den');
  assert.notEqual(svgOf('f065'), svgOf('f066'), 'the leaves brushed aside');
  assert.match(svgOf('f058'), /cover-fern/, 'the apprentice behind his fern');
  assert.match(svgOf('f060'), /cover-leaves/, 'the groundhog half under the leaves');
  // the Counts pictures: the take pages' store at each problem, the prey piles, the acorns
  const pics = [];
  [[43, 16], [70, 34], [85, 39], [97, 52], [486, 253], [52, 27]].forEach(([a, b]) => pics.push(A.placeValue({ hundreds: Math.floor(a / 100), tens: Math.floor(a / 10) % 10, ones: a % 10, kind: 'store' })));
  pics.forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
});

/* ------------------------------------------------------------------ the beats, on every path */

test('the chapter’s beats are all there, in order, on every path: every reader’s panels follow the story’s screens, the path-only lines exactly where her flags and choices say', () => {
  const B = [/^Chapter 13: The Hunter’s Crouch$/, /^First light, warrior\./, /Your first dawn patrol!/, /^Outside, every fern is WHITE\./, /^The three of you pad out of camp/, /^Your breath makes little clouds/,
    /^Behind you, three cats’ pawprints/, /^Down at the Crossing, Riffle is juggling\./, /^One bonks his nose\./, /CATCH!/, /^You’re a NATURAL!/, /^The ferry otters crowd in\./, /^And it dug a big HOLE/,
    /^Say HI to the badger for me!/, /^On the way home, the patrol hunts\./, /^At the edge of camp, something small is bouncing\./, /^Chispapaw bounces so high/, /^Tallyheart taught you on your first evening\./,
    /Like THIS\?|I’m DOING it!|Then I’d better get it right\./, /^But her tail sticks straight UP/, /^A frosty leaf skitters past\./, /^Too late! Chispapaw POUNCES\./, /^She lets it go, very politely\./,
    /^Then, deep in the ferns/, /^The ferns twitch\./, /^Chispapaw sits up very straight\./, /^Back in camp, she wriggles out of her collar\./, /^Late in the morning/, /^First, three Counts/,
    /^Now, take-\u2060aways\./, /^Yesterday, every column had enough loose\./, /^She scratches forty-three in the sand/, /^\{Es:noAlcanza\} My little Tall One says that every night\./, /^Then we spread a row\./,
    /^She crosses out one line/, /^Chispapaw stares\./, /^Not enough\? Spread a row\./, /^At noon, the whole Clan crowds round the pile\./, /^With the dawn patrol’s four/, /^¡\{Es:25\}!$/,
    /^The old tom licks his lips\./, /^Glintstar has heard Tallyheart’s news\./, /A courtesy patrol, to GroveClan\./, /^Glintstar’s whiskers twitch\./, /^Chispapaw bounces\. Silently, for once\./,
    /^On the path, Chispapaw trots at your heels\./, /^Tallyheart gives you a look\./, /^At the end of GroveClan’s little bridge/, /^Tallyheart’s ear twitches\./, /^Out pads the GroveClan elder\./,
    /^Tallyheart dips her head to her\./, /Come in\.$/, /^She leads you under the trees to the old oak\./, /^Earth is thrown back in heaps\./, /^\*Sniff\.\*/, /^When I was a kit/,
    /^Tallyheart heads back to wait at the bridge\./, /^On the way out, something catches your eye/, /^Scratched in the earth: one long line\./, /^Claw marks\?$/, /^She isn’t sure\./,
    /^The sun is low when you get home\./, /^The afternoon’s hunters bring more down to the store\..* A badger SAT on my whole patrol once!/, /^There we were/, /^THIS flat\?/, /^You tell him about the marks/,
    /^In your book, a new page opens/, /^The stars come out over camp/, /^Your warrior’s nest is soft and deep/, /^Three mice this morning\./, /^Across camp, Chispapaw’s collar lies beside her nest\./,
    /^Goodnight, MENTOR!$/, /^I caught a leaf today\./, /^Goodnight\. Mentor\.$/, /^You close your eyes, and there they are again\./, /^What did \{name\}\{ending\} dream/, /^\{name\}\{ending\} sleeps\./];
  for (const c of COMBOS) {
    const rows = walkLines(c.flags, c.o), name = comboName(c);
    const said = rows.map(r => r.lines.join(' ')), joined = said.join(' ¶ ');
    let i = 0;
    B.forEach(re => {
      const j = said.findIndex((s, k) => k >= i && re.test(s));
      assert.ok(j >= 0, name + ': ' + re + ' after ' + rows[Math.max(0, i - 1)].id);
      i = j + 1;
    });
    // her `specialty`: the swimmer's steam at the Crossing; one doorway line each at the dig
    assert.equal(/Steam curls off the river\./.test(joined), c.flags.specialty === 'swimming', name);
    const spec = { noticing: /You take one last look, and spot it/, friends: /The shy GroveClan apprentice peeks out of a fern, and points: ¶|points: a smaller doorway/, climbing: /From the oak’s low branch/,
      sneaking: /You creep up to the dig without a sound\./, swimming: /Then you hear it\. Something is snoring/ };
    Object.keys(spec).forEach(s => assert.equal(spec[s].test(joined), c.flags.specialty === s, name + ': ' + s));
    const r58 = rows.find(r => r.id === 'f058');
    assert.equal(r58.caps.length, c.flags.specialty === 'friends' ? 2 : c.flags.specialty ? 1 : 0, name + ': at most one specialty line (the friends’ split at its colon)');
    assert.equal(rows.find(r => r.id === 'f010').caps.length, c.flags.specialty === 'swimming' ? 1 : 0, name);
    assert.equal(/Riffle’s stone is by your nose\./.test(joined), c.flags.ch2Stone === 'nose', name);
    assert.equal(/Riffle’s stone is under your chin\./.test(joined), c.flags.ch2Stone === 'chin', name);
    assert.ok(rows.find(r => r.id === 'f076').caps.length === (c.flags.ch2Stone ? 3 : 2), name + ': at most one stone line');
    // `teach`: exactly one caption-and-balloon pair on f019 and on f078, each as she taught
    const teach = TEACH_OF(c.o);
    ['f019', 'f078'].forEach(id => {
      const r = rows.find(x => x.id === id), base = id === 'f078' ? 1 : 0;
      assert.equal(r.caps.length, base + 1, name + ' ' + id + ': one caption by teach');
      assert.equal(r.balloons.length, 1, name + ' ' + id + ': one balloon by teach');
    });
    const TT = { show: [/You show her\. Chispapaw copies every bit\. Like THIS\?/, /Belly low\. Tail out\. Like THIS\./], try: [/Chispapaw tries it all by herself\. Am I doing it\?/, /Lower… lower… GOT it\./],
      words: [/Tallyheart’s ears go up: her own words\./, /The crouch… feeds… you…/] };
    Object.keys(TT).forEach(k => TT[k].forEach(re => assert.equal(re.test(joined), teach === k, name + ': ' + k + ' ' + re)));
    // the polite ask's replies; the groundhog's scene
    assert.equal(/Very nicely asked\./.test(joined), c.o.ask === 0, name);
    assert.equal(/The elder blinks\. ¶|The elder blinks\. Very polite/.test(joined), c.o.ask === 1, name);
    assert.equal(/GROUNDHOG\./.test(joined), c.o.look === 0, name);
    assert.equal((joined.match(/Come in\./g) || []).length, 1, name);
  }
});

/* ------------------------------------------------------------------ counts */

const TH = text => ({ who: 'tallyheart', text });
const CH = text => ({ who: 'chispapaw', text });
const GL = text => ({ who: 'glintstar', text });
const HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';
const MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
const SETS = {
  'ch13-dawn': {
    table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}', ground: 'earth',
    facts: [{ a: 3, b: 4, prompt: [TH('Let’s count something. Three cats, four paws each. How many paws?')], retryPrompt: true,
      right: [TH('Twelve paws.'), { who: 'murmurchime', text: 'And not ONE of them warm.' }], rightAgain: true }],
    praise: [], helpIntro: HOP, helpIntroFar: HOP_FAR, miss: 'There.', missLast: LAST, done: null
  },
  'ch13-warm': {
    teacher: 'tallyheart',
    warmHard: { table: 'all', at: [0, 1], avoid: [[3, 4], [6, 8]], alt: [{ a: 7, b: 4, table: 4 }, { a: 9, b: 9, table: 9 }] },
    facts: [{ a: 9, b: 7, table: 9 }, { a: 4, b: 6, table: 6 }, { a: 8, b: 8, table: 8 }],
    // (its miss chapter 10's, with the curly ’, not the engine's default: chapter 13's review)
    praise: [], fast: [], done: '', miss: MISS,
    echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }] }
  },
  'ch13-take': {
    op: '-', teach: 'ones2', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
    facts: [
      { a: 43, b: 16, regroup: 'show', prompt: 'Pretend the pile holds forty-three, and the Clan eats sixteen.', right: [TH('Two rows, seven loose left.')] },
      { a: 70, b: 34, regroup: 'tap', prompt: 'Your turn.' },
      [85, 39], [97, 52], [486, 253]
    ],
    echo: { on: [[85, 39]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] },
    marks: {
      lines: [CH('My little Tall One writes it like THIS.'), CH('A little 1 in front!'), TH('Some write the new number on top instead.'), TH('Both are right. Which marks do YOU like?')],
      one: [CH('Just like my little Tall One!')],
      above: [TH('On top it is. That’s how I write it too!')]
    }
  },
  'ch13-noon': {
    table: 8, thing: 'piece', things: 'pieces', unit: 'hunter', units: 'hunters', teacher: 'tallyheart', ask: '{a} × {b}',
    picture: { kind: 'prey' }, help: 'picture',
    facts: [{ a: 6, b: 8, prompt: [GL('Six hunters went out this morning. Eight pieces each.')], retryPrompt: true, right: [GL('Forty-eight.')], rightAgain: true }],
    praise: [], helpIntro: HOP, helpIntroFar: HOP_FAR, miss: 'There.', missLast: LAST, done: null
  },
  'ch13-pile': {
    op: '-', teacher: 'tallyheart', picture: { kind: 'store' }, twins: false, done: '',
    facts: [{ a: 52, b: 27, prompt: [GL('Twenty-seven go down to the store. How many stay for the Clan?')], right: [GL('Twenty-five for the Clan.')] }]
  },
  'ch13-lullaby': {
    table: 8, thing: 'acorn', things: 'acorns', unit: 'twig', units: 'twigs', teacher: 'groundhog', ask: '{a} × {b}',
    picture: { kind: 'acorns' }, help: 'picture',
    facts: [{ a: 7, b: 8, prompt: [{ who: 'groundhog', kind: 'whisper', text: 'Seven… times… eight…' }], retryPrompt: true,
      right: [{ who: 'player', kind: 'whisper', text: 'Fifty-six.' }, { who: 'groundhog', kind: 'whisper', text: 'Fifty… six… thank you…' }, { kind: 'caption', text: '*Snore.*' }],
      rightAgain: true }],
    helpIntro: 'Hop by eights! Eight, sixteen…', helpIntroFar: 'Hop by eights! Eight, sixteen…',
    fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one…',
    avoid: [[6, 8], [7, 8], [8, 8]], praise: [], miss: MISS, missLast: LAST, done: null
  }
};
const ANSWERS = [27, 36, 46, 45, 233, 25];
/* her hard Counts, as E.warriorHard gives them: stood in for, for the warm-up's pick cases */
function withHard(picks, fn) {
  const keep = E.warriorHard;
  E.warriorHard = () => picks.map(p => p.slice());
  try { return fn(); } finally { E.warriorHard = keep; }
}

test('counts: the six sets exactly as the spec has them (section 2); the Counts claims pinned: no new Count (chapter 10’s ten), the kinds and steps, every take answer different; eleven typed answers on the plain path, twelve with the groundhog', () => {
  assert.deepEqual(Object.keys(story.counts), ['ch13-dawn', 'ch13-warm', 'ch13-take', 'ch13-noon', 'ch13-pile', 'ch13-lullaby']);
  Object.keys(SETS).forEach(k => assert.deepEqual(story.counts[k], SETS[k], k));
  assert.deepEqual(E.countSets(STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes'], [6, 'ch07-sixes'], [4, 'ch08-fours'], [8, 'ch09-eights'], [7, 'ch10-sevens']]);
  assert.deepEqual(E.learnedCounts({ counts: [], flags: {}, lessons: { 'ch13-warm': { finished: true }, 'ch13-dawn': { finished: true } } }, STORIES), [], 'finishing them learns no Count');
  // the kinds and steps (run): four of `ones2` (70 − 34 with no loose), two of `none`; every answer different
  const facts = ['ch13-take', 'ch13-pile'].map(sid => story.counts[sid].facts.map(f => Array.isArray(f) ? f : [f.a, f.b])).flat();
  assert.deepEqual(facts.map(([a, b]) => [a - b, E.takeKind(E.takePlan(a, b)), E.takeStepOf(E.takePlan(a, b))]),
    [[27, 'ones', 'ones2'], [36, 'ones', 'ones2'], [46, 'ones', 'ones2'], [45, 'none', 'none'], [233, 'none', 'none'], [25, 'ones', 'ones2']]);
  assert.deepEqual(facts.map(([a, b]) => a - b), ANSWERS);
  assert.equal(new Set(ANSWERS).size, 6);
  assert.ok(E.takeFlags(E.takePlan(70, 34)).noLoose, '70 − 34: no loose at all');
  // the chapter's one maths cut without a story edit, 486 − 253 (call 28): still clean without it
  const cut = clone(story);
  cut.counts['ch13-take'].facts = cut.counts['ch13-take'].facts.filter(f => !(Array.isArray(f) && f[0] === 486));
  assert.equal(cut.counts['ch13-take'].facts.length, 4);
  assert.deepEqual(E.checkTakes(cut, STORIES.slice(0, -1).concat([cut])), []);
  assert.deepEqual(E.checkStory(cut, STORIES.slice(0, -1).concat([cut])), []);
  // never a square spread, never a three-digit spread
  facts.forEach(([a, b]) => assert.ok(!E.takePlan(a, b).cols.some((c, i) => i > 0 && c.spreads.length) && (a < 100 || !E.takePlan(a, b).cols[0].spreads.length), a + ' − ' + b));
  // its lines short and whole, fit for both sexes; a take-away is never called a Count
  countsLines().forEach(x => {
    if (x.lang === 'es') return;
    assert.ok(words(x.text) <= 12, x.where + ': ' + x.text);
    assert.ok(E.endsSentence(x.text.replace(/\*/g, '')), x.where + ': a whole sentence');
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.where));
  });
  // the voices in the picture: Tallyheart and Chispapaw on the Hollow's Counts frames, Glintstar at the pile, the groundhog at its lullaby
  ['f029', 'f036'].forEach(id => assert.ok(castOf(id, 'tallyheart').length && castOf(id, 'chispapaw').length, id));
  ['f038', 'f039'].forEach(id => assert.ok(castOf(id, 'glintstar').length, id));
  assert.ok(castOf('f063', 'groundhog').length && castOf('f007', 'tallyheart').length && castOf('f007', 'murmurchime').length);
});

test('the warm-up over every pick case (the spec’s run, 2,916 and none): her two hardest of the 54 pairs first, passing over 3 × 4 and 6 × 8 (never 7 × 8), in their anchors’ words; no pair twice; every question with a numeric table and its first line its anchor Count’s own; an alt where a pick is the set’s 8 × 8 or her one pick its 4 × 6', () => {
  const PAIRS = E.warriorPairs().filter(p => !(p[0] === 10 && p[1] === 10));
  assert.equal(PAIRS.length, 54);
  const def = Object.assign({ id: 'ch13-warm' }, story.counts['ch13-warm']);
  const askOf = (picks) => withHard(picks, () => {
    const cat = before13({});
    const facts = E.lessonFacts(cat, def, STORIES);
    const st = E.counts.start(def, { facts, set: 'ch13-warm', mode: 'chapter', now: 1 });
    const out = [];
    while (!E.counts.done(st)) {
      const q = E.counts.question(st), D = E.questionDef(def, q, story, STORIES);
      out.push({ q, D, first: E.promptLines(def, D, q)[0].text });
      E.counts.answer(st, D, q.a * q.b, 2000, out.length * 1000);
    }
    return { facts, out };
  });
  const key = (a, b) => Math.min(a, b) + 'x' + Math.max(a, b);
  let cases = 0, sevens = 0;
  const check = (picks) => {
    const r = askOf(picks), name = JSON.stringify(picks);
    assert.equal(r.out.length, 3, name);
    const keys = r.out.map(x => key(x.q.a, x.q.b));
    assert.equal(new Set(keys).size, 3, name + ': three different pairs');
    assert.ok(!keys.includes('3x4') && !keys.includes('6x8'), name + ': never dawn’s 3 × 4 or noon’s 6 × 8');
    const ok = picks.filter(p => !['3x4', '6x8'].includes(key(p[0], p[1])));
    ok.slice(0, 2).forEach((p, i) => assert.equal(key(r.out[i].q.a, r.out[i].q.b), key(p[0], p[1]), name + ': her hardest first'));
    if (keys.includes('7x8')) sevens++;
    r.out.forEach(x => {
      assert.equal(typeof x.q.table, 'number', name + ': ' + x.q.a + ' × ' + x.q.b + ' has a table');
      assert.equal(x.first, E.genericQuestion(E.hollowDef(STORIES, x.q.table), x.q), name + ': ' + x.q.a + ' × ' + x.q.b + ' asked in its anchor’s words');
    });
    cases++;
  };
  check([]);
  PAIRS.forEach(p => check([p]));
  for (let i = 0; i < PAIRS.length; i++) for (let j = 0; j < PAIRS.length; j++) if (i !== j) check([PAIRS[i], PAIRS[j]]);
  assert.equal(cases, 1 + 54 + 54 * 53);
  assert.ok(sevens > 0, '7 × 8 asked where it is a pick (the optional lullaby is never passed over)');
  // with none: the set as written, 9 × 7 in the 9s' words (the Hollow is on land)
  assert.deepEqual(askOf([]).out.map(x => [x.q.a, x.q.b]), [[9, 7], [4, 6], [8, 8]]);
  // her one pick 4 × 6: it first, and the set's 4 × 6 gives way to 7 × 4 (the spec's run)
  assert.deepEqual(askOf([[4, 6]]).out.map(x => [x.q.a, x.q.b]), [[4, 6], [7, 4], [8, 8]]);
  // 7 × 6 then 8 × 8: 7 × 6, 8 × 8, then the first free alt, 7 × 4
  assert.deepEqual(askOf([[7, 6], [8, 8]]).out.map(x => [x.q.a, x.q.b]), [[7, 6], [8, 8], [7, 4]]);
  // her hardest 6 × 8: passed over, so her next hardest is asked
  assert.deepEqual(askOf([[6, 8], [7, 7]]).out.map(x => key(x.q.a, x.q.b)).slice(0, 1), ['7x7']);
});

test('the warm-up’s echo: Chispapaw says her first right answer in Spanish, in the order it was asked (a retry’s counts), and nothing after it; once a lesson; “¡Nueve por siete, sesenta y tres!” for the set’s own 9 × 7', () => {
  const def = Object.assign({ id: 'ch13-warm' }, story.counts['ch13-warm']);
  const play = (picks, answers) => withHard(picks, () => {
    const cat = before13({});
    const facts = E.lessonFacts(cat, def, STORIES);
    const st = E.counts.start(def, { facts, set: 'ch13-warm', mode: 'chapter', now: 1 });
    return countsRows(cat, story, def, st, answers, { all: 1500 });
  });
  const none = play([]);
  assert.deepEqual(none.map(r => r.k), ['9x7', '4x6', '8x8']);
  assert.deepEqual(none[0].echo, [{ who: 'chispapaw', text: '«¡Nueve por siete, sesenta y tres!»\n(Nine times seven, sixty-three!)', lang: 'es' }], 'the fact alone, nothing after it');
  assert.deepEqual([none[1].echo, none[2].echo], [null, null], 'once a lesson');
  assert.equal(none[0].prompt[0].text, E.genericQuestion(E.hollowDef(STORIES, 9), none[0].q));
  // her hard 7 × 9: the remembered line, then the echo in the order asked
  const hard = play([[7, 9]]);
  assert.equal(hard[0].echo[hard[0].echo.length - 1].text, '«¡Siete por nueve, sesenta y tres!»\n(Seven times nine, sixty-three!)');
  // a miss first: no echo; the next right answer echoes; a retry right counts
  const miss = play([], { '9x7': [62], '4x6': [23], '8x8': [65] });
  const firstRight = miss.findIndex(r => r.res.correct);
  assert.ok(firstRight > 0, 'misses first');
  miss.forEach((r, i) => assert.equal(!!r.echo, i === firstRight, r.k));
  // a cat who misses all three and every retry hears no echo (the spec's item 7): never a wall, the lesson still ends
  const never = play([], { '9x7': [1, 1, 1, 1], '4x6': [1, 1, 1, 1], '8x8': [1, 1, 1, 1] });
  assert.ok(never.every(r => !r.echo) && never[never.length - 1].res.done);
});

test('the story Counts: dawn’s 3 × 4 asked by Tallyheart, its right lines hers and {Murmur}chime’s, on a retry too, its help in the earth; noon’s 6 × 8 Glintstar’s, in piles; the groundhog’s lullaby its whispered “Seven… times… eight…”, its right lines on a retry, its misses coming back after two easy eights', () => {
  const play = (sid, frame, answers) => {
    const cat = fresh({});
    const L = E.chapterLesson(cat, story, sid, 2000, STORIES);
    return countsRows(cat, story, L.def, L.state, answers);
  };
  const dawn = play('ch13-dawn', 'f007');
  assert.deepEqual(dawn.map(r => r.k), ['3x4']);
  assert.equal(dawn[0].prompt[0].text, 'Let’s count something. Three cats, four paws each. How many paws?');
  assert.deepEqual(dawn[0].res.balloons, [TH('Twelve paws.'), { who: 'murmurchime', text: 'And not ONE of them warm.' }]);
  const dawnMiss = play('ch13-dawn', 'f007', { '3x4': [11] });
  assert.deepEqual(dawnMiss.map(r => r.k), ['3x4✗', 'R:3x4'], 'the fact again at once');
  assert.equal(dawnMiss[0].line, 'There.');
  assert.deepEqual(dawnMiss[1].res.balloons, [TH('Twelve paws.'), { who: 'murmurchime', text: 'And not ONE of them warm.' }], 'on a retry too (rightAgain)');
  assert.equal(story.counts['ch13-dawn'].ground, 'earth', 'the 4s’ help scratched in the earth, in the frosty camp');
  const noon = play('ch13-noon', 'f038', { '6x8': [46] });
  assert.deepEqual(noon.map(r => r.k), ['6x8✗', 'R:6x8']);
  assert.deepEqual(noon[1].res.balloons, [GL('Forty-eight.')], 'Glintstar’s line on a retry too');
  assert.equal(noon[0].prompt[0].text, 'Six hunters went out this morning. Eight pieces each.');
  assert.deepEqual(story.counts['ch13-noon'].picture, { kind: 'prey' }, 'stacks, never rows: a row means ten');
  ['ch13-dawn', 'ch13-noon', 'ch13-lullaby'].forEach(sid => assert.equal(story.counts[sid].facts[0].rightAgain, true, sid + ': her right lines on a retry too'));
  const lull = play('ch13-lullaby', 'f063', { '7x8': [54] });
  assert.equal(lull[0].prompt[0].text, 'Seven… times… eight…');
  assert.equal(lull[0].k, '7x8✗');
  assert.ok(lull.length >= 3 && lull[lull.length - 1].q.a * lull[lull.length - 1].q.b === 56, 'the missed 7 × 8 comes back, after its fillers');
  assert.deepEqual(lull[lull.length - 1].res.balloons, SETS['ch13-lullaby'].facts[0].right, 'its whispered right lines and the snore, on the retry');
  lull.slice(1, -1).forEach(r => assert.ok(![[6, 8], [7, 8], [8, 8]].some(([a, b]) => r.q.a * r.q.b === a * b && (r.q.a === a || r.q.a === b)), 'a filler never 6 × 8, 7 × 8 or 8 × 8'));
  // f063's own balloon ends at “Unless…”: the lullaby is lettered only in the Count's prompt
  assert.equal(frames.f063.say[0].text, 'Now I’ll NEVER get back to sleep. Unless…');
  assert.ok(!Object.values(frames).some(f => (f.say || []).some(b => /Seven… times/.test(b.text))));
});

test('the marks page (the kit v0.4, decision 57): once, before 43 − 16’s prompt, while she has no marks: Chispapaw’s two lines and Tallyheart’s two, the two pictures’ labels, each answer’s line; a pick writes her style and no flag; a cat with marks is not asked again', () => {
  const cat = fresh({});
  const def = Object.assign({ id: 'ch13-take' }, story.counts['ch13-take']);
  const page = E.takeMarksPage(def, cat);
  assert.deepEqual(page.lines, SETS['ch13-take'].marks.lines);
  assert.deepEqual(page.after, { one: SETS['ch13-take'].marks.one, above: SETS['ch13-take'].marks.above });
  assert.deepEqual(page.options, [{ style: 'one', label: 'A little 1 in front' }, { style: 'above', label: 'The new number on top' }]);
  assert.equal(page.current, null, 'she has no marks yet: every player meets the page here');
  const flags = clone(cat.flags);
  assert.ok(E.setTakeStyle(cat, 'one'));
  assert.deepEqual([cat.takes.style, cat.flags], ['one', flags], 'her style, never a flag');
  assert.equal(E.takeMarksPage(def, cat).current, 'one', 'picked: the page is not asked again');
  page.lines.concat(page.after.one, page.after.above).forEach(b => assert.ok(words(b.text) <= 12 && ['chispapaw', 'tallyheart'].includes(b.who), b.text));
  assert.deepEqual(E.checkTakes(story, STORIES), []);
});

test('the take lesson as the spec plays it, as moves: the worked example (Tallyheart taps the 4; she types 3, then 13, or the little 1, then 7; the school words once, before the tens; the right line waiting); 70 − 34’s taps and both asks; 85 − 39 and 97 − 52’s full lines, 486 − 253 the columns’ names; the echo after 85 − 39 only; `taught` none and ones2; the twins avoid the chapter’s answers; finishing it adds ones2', () => {
  const play = (o) => {
    const cat = fresh({});
    if (o && o.style) E.setTakeStyle(cat, o.style);
    const L = E.takeLesson(cat, story, 'ch13-take', 5000, STORIES);
    return { cat, L, rows: takeRows(cat, L.def, L.state, o) };
  };
  const ok = play();
  assert.deepEqual([ok.L.state.taught, ok.L.state.avoid, E.takeMovesOn(ok.L.state)], [['none', 'ones2'], ANSWERS, true]);
  assert.deepEqual(ok.rows.map(r => [r.key, r.mode]), [['43-16', 'show'], ['70-34', 'tap'], ['85-39', 'hers'], ['97-52', 'hers'], ['486-253', 'hers']]);
  // the worked example: the prompt's balloon, then Tallyheart's show steps (she taps the 4), the numbers hers to type
  const w = ok.rows[0], def = ok.L.def;
  assert.deepEqual(w.ask.balloons, [TH('Pretend the pile holds forty-three, and the Clan eats sixteen.')]);
  const show = E.takeShow(def, E.takePlan(43, 16), 0, { mode: 'show', style: 'above' });
  assert.deepEqual(show.steps.map(x => x.say), ['Three take away six? Only three loose. Not enough.', 'So I spread a row. Four rows, one goes: three.', 'Ten more loose: thirteen. Write it on top.', 'Thirteen take away six.']);
  assert.deepEqual(show.steps.map(x => x.ask), [null, { col: 1, kind: 'lend', value: 3 }, { col: 0, kind: 'get', value: 13, reads: 13 }, null]);
  assert.equal(E.takeShow(def, E.takePlan(43, 16), 0, { mode: 'show', style: 'one' }).steps[2].say, 'Ten more loose: write a little 1 in front.');
  assert.deepEqual(w.moves.map(m => m.move + (m.typed != null ? ' ' + m.typed : '')), ['touch', 'lend 3', 'get 13'], 'she types 3, then 13');
  assert.deepEqual(w.cols.map(c => c.line), ['Thirteen take away six.', 'A row is a ten. A square is a hundred. Now the tens. Three take away one.'], 'the school words once, before the tens line');
  assert.deepEqual([w.lineKind, w.balloons, w.entry.worked, w.entry.correct], ['right', [TH('Two rows, seven loose left.')], true, true]);
  // 'one': the little 1
  const one = play({ style: 'one' });
  assert.deepEqual(one.rows[0].moves.map(m => m.move + (m.typed != null ? ' ' + m.typed : '')), ['touch', 'lend 3', 'get 1']);
  // 70 − 34: no loose, so she taps the row; both numbers asked (the row's link is this chapter's)
  const tp = ok.rows[1];
  assert.deepEqual(tp.ask.balloons, [TH('Your turn.')]);
  assert.deepEqual(E.takeShow(def, E.takePlan(70, 34), 0, { mode: 'tap', style: 'above' }).taps.map(x => x.say), ['No loose. Spread a row: tap it.', 'One row goes. How many rows now?', 'No loose, and ten more. How many loose now?']);
  assert.deepEqual(tp.moves.map(m => [m.move, m.typed, m.line]), [['touch', undefined, 'One row goes. How many rows now?'], ['lend', 6, 'No loose, and ten more. How many loose now?'], ['get', 10, 'Ten take away four.']]);
  assert.deepEqual(tp.cols.map(c => c.line), ['Ten take away four.', 'Now the tens. Six take away three.']);
  // her own: each spread hers to make (the tap, the two new numbers, then the answer), nothing glowing; the full lines
  // for the set's first two of her own (rule b), the columns' names for the third
  assert.deepEqual(ok.rows[2].moves.map(m => m.move + (m.typed != null ? ' ' + m.typed : '')), ['touch', 'lend 7', 'get 15']);
  assert.deepEqual(ok.rows[2].cols.map(c => c.line), ['Ones first. Five take away nine.', 'Now the tens. Take away three.']);
  assert.deepEqual(ok.rows[3].cols.map(c => c.line), ['Ones first. Seven take away two.', 'Now the tens. Take away five.']);
  assert.deepEqual(ok.rows[3].moves, [], '97 − 52 needs no spread: no move');
  assert.deepEqual(ok.rows[4].cols.map(c => c.line), ['Ones first.', 'Now the tens.', 'Now the hundreds.']);
  assert.ok(ok.rows.every(r => r.full === (r.key !== '486-253')));
  // the echo after 85 − 39, out loud, never «menos», no column echoed
  assert.deepEqual(ok.rows.map(r => r.echo && r.echo.text), [null, null, '«¡Cuarenta y seis!»\n(Forty-six!)', null, null]);
  assert.equal(ok.rows.filter(r => r.cols.some(c => /A row is a ten/.test(c.line))).length, 1, 'the school words once');
  assert.equal(ok.cat.takes.log.length, 6 + 5);
  assert.ok(ok.cat.lessons['ch13-take'].finished);
  assert.deepEqual(E.takeSteps(ok.cat, STORIES), ['none', 'ones2'], 'finishing the lesson adds ones2');
  // helped 85 − 39 (a slip at the ones): echoed still; its twin queued, asked plainly, never echoed
  const help = play({ digits: { '85-39': [5] } });
  const h = help.rows.find(r => r.key === '85-39'), twin = help.rows.find(r => r.twin === '85-39');
  assert.ok(h.entry.helped && twin, 'helped: a twin comes back');
  assert.equal(h.echo.text, '«¡Cuarenta y seis!»\n(Forty-six!)', 'helped: still echoed');
  assert.deepEqual([twin.echo, twin.prompt, twin.right, twin.ask.balloons], [null, null, null, [TH('One like it.')]], 'its twin: no echo, no prompt, no right line');
  assert.ok(!ANSWERS.includes(twin.a - twin.b), 'a twin never on one of the chapter’s answers');
  // a helped worked example: the kit's line, and its twin 'tap' with no prompt and no right line, every number asked
  const wk = play({ digits: { '43-16': [8] } });
  assert.equal(wk.rows[0].line, 'And you finished it. We’ll do one like it soon.');
  const wt = wk.rows.find(r => r.twin === '43-16');
  assert.deepEqual([wt.mode, wt.prompt, wt.right, wt.balloons, wt.ask.balloons], ['tap', null, null, undefined, [TH('One like it.')]]);
  assert.ok(wt.moves.filter(m => m.move !== 'touch').length >= 2, 'the row’s link asked');
  assert.ok(!ANSWERS.includes(wt.a - wt.b));
  // a helped 70 − 34: its twin 'hers', asked with “One like it.” only
  const tt = play({ digits: { '70-34': [5] } }).rows.find(r => r.twin === '70-34');
  assert.deepEqual([tt.mode, tt.prompt, tt.right, tt.ask.balloons], ['hers', null, null, [TH('One like it.')]]);
  // no twin of any helped problem lands on an answer of the chapter, over many seeds
  for (let s = 0; s < 40; s++) {
    const cat = fresh({}), L = E.takeLesson(cat, story, 'ch13-take', 7000 + s * 977, STORIES);
    takeRows(cat, L.def, L.state, { digits: { '43-16': [8], '97-52': [4] } }).filter(r => r.twin).forEach(r => assert.ok(!ANSWERS.includes(r.a - r.b), 'seed ' + s + ': ' + r.key));
  }
});

test('no square talk, and the `extra` slips: 486 − 253’s hundreds typed 1 opens “Let’s scratch it out.” and is logged `fact` (rule a); 97 − 52’s tens typed 3 is the kit’s tens `extra`; a tap on 97 − 52’s 9 and a number typed in its box is the `extra` touch, logged on the touch; no help of the lesson says a square went', () => {
  const at13 = (key, col, typed, first) => {
    const cat = fresh({}), L = E.takeLesson(cat, story, 'ch13-take', 5000, STORIES);
    let res = null;
    const rows = takeRows(cat, L.def, L.state, { digits: { [key]: Object.assign([], { [col]: typed }) } });
    const r = rows.find(x => x.key === key && !x.twin);
    res = r.cols[col];
    return { r, res, cat };
  };
  const hund = at13('486-253', 2, 1);
  assert.deepEqual([hund.res.slip, hund.res.help.intro], ['fact', 'Let’s scratch it out.']);
  assert.deepEqual(hund.r.entry.slips.map(s => s.slip), ['fact'], 'logged fact (by rule a), never extra');
  assert.doesNotMatch(JSON.stringify(hund.res.help), /square went|no square/i);
  const tens = at13('97-52', 1, 3);
  assert.deepEqual([tens.res.slip, tens.res.help.intro], ['extra', 'Careful. The loose had enough, so no row went. Nine rows still.']);
  // the extra touch: 97 − 52's 9 tapped, 8 typed in its box
  const cat = fresh({}), L = E.takeLesson(cat, story, 'ch13-take', 5000, STORIES);
  const rows = takeRows(cat, L.def, L.state, {
    first: (st, def) => {
      // the lesson's first three problems right, then at 97 − 52 the touch on its tens and an 8 in its box
      const clock = { t: 20000 };
      for (let g = 0; g < 60; g++) {
        const q = TK.question(st);
        if (q.a === 97 && q.b === 52) break;
        const m = q.moves[q.col][q.move];
        if (m.move === 'touch') TK.touch(st, def, m.col, clock.t += 1000, 1500);
        else { const r = TK.digit(st, def, m.blank ? '' : m.value, 1500, clock.t += 1000); if (r.problemDone && r.entry) E.logTake(cat, r.entry); }
      }
      const t = TK.touch(st, def, 1, clock.t += 1000, 1500);
      assert.ok(t.accepted, 'her tap on the 9 strikes it');
      const r = TK.digit(st, def, 8, 1500, clock.t += 1000);
      assert.deepEqual([r.slip, r.right], ['extra', false]);
      assert.equal(r.line, 'Careful: seven take away two? The loose have enough. No row goes.', 'the strike undone');
    }
  });
  const e = cat.takes.log.find(x => x.a === 97 && x.b === 52 && !x.twin);
  assert.deepEqual(e.slips.map(s => [s.col, s.move, s.slip]), [[0, 'touch', 'extra']]);
  assert.ok(rows.some(r => r.twin === '97-52'), 'with a twin');
  // over every wrong digit in every column of the lesson and the pile, no help says a square went or spreads a square
  let checked = 0;
  [['ch13-take', story.counts['ch13-take']], ['ch13-pile', story.counts['ch13-pile']]].forEach(([sid, raw]) => raw.facts.forEach(f => {
    const a = Array.isArray(f) ? f[0] : f.a, b = Array.isArray(f) ? f[1] : f.b, p = E.takePlan(a, b);
    for (let col = 0; col < p.n; col++) for (let d = 0; d <= 9; d++) {
      if (d === p.cols[col].digit) continue;
      const c2 = fresh({}), L2 = E.takeLesson(c2, story, sid, 5000, STORIES);
      const rs = takeRows(c2, L2.def, L2.state, { digits: { [a + '-' + b]: Object.assign([], { [col]: d }) } });
      const r = rs.find(x => x.key === a + '-' + b && !x.twin), cc = r.cols[col];
      if (!cc || !cc.help) continue;
      assert.doesNotMatch(JSON.stringify(cc.help), /square went|no square|spread a square|borrow|carry|regroup/i, sid + ' ' + a + ' − ' + b + ' col ' + col + ' digit ' + d);
      checked++;
    }
  }));
  assert.ok(checked > 60, checked + ' wrong digits');
});

test('the noon pile: 52 − 27 asked by Glintstar, Tallyheart’s full column lines; answered 5 first, the kit’s `ahead` in its flip form (“Marks first, then the answer.”), then her moves, ending on Glintstar’s right line, the entry { correct: false, helped: false, ahead: [0] }, no twin; a 3 at the tens `kept`; helped, the kit’s line and no twin', () => {
  const play = (o) => {
    const cat = fresh({});
    const L = E.takeLesson(cat, story, 'ch13-pile', 5000, STORIES);
    return { cat, L, rows: takeRows(cat, L.def, L.state, o) };
  };
  const ok = play();
  assert.equal(ok.rows.length, 1);
  const r = ok.rows[0];
  assert.deepEqual(r.ask.balloons, [GL('Twenty-seven go down to the store. How many stay for the Clan?')]);
  assert.deepEqual(r.cols.map(c => c.line), ['Ones first. Two take away seven.', 'Now the tens. Take away two.']);
  assert.deepEqual([r.lineKind, r.balloons, r.entry.answer], ['right', [GL('Twenty-five for the Clan.')], 25]);
  // the flip lands at its ones: a 5 typed first is `ahead`, flip form, never “Right!”
  let ahead = null;
  const flip = play({ first: (st, def) => { ahead = TK.digit(st, def, 5, 1500, 4000); } });
  assert.deepEqual([ahead.pointer, ahead.form, ahead.line], ['ahead', 'flip', 'Marks first, then the answer.']);
  const fe = flip.rows[0].entry;
  assert.deepEqual([fe.correct, fe.helped, fe.ahead, fe.slips], [false, false, [0], []]);
  assert.deepEqual([flip.rows[0].lineKind, flip.rows[0].balloons], ['right', [GL('Twenty-five for the Clan.')]], 'not helped: Glintstar’s line');
  assert.equal(flip.rows.length, 1, 'no twin');
  // a 3 at the tens after her gold 4: kept
  const kept = play({ digits: { '52-27': [undefined, 3] } });
  assert.equal(kept.rows[0].cols[1].slip, 'kept');
  assert.equal(kept.rows[0].cols[1].help.intro, 'Careful. One row went to the loose. Four rows now.');
  assert.deepEqual([kept.rows.length, kept.rows[0].line], [1, 'And you finished it.'], 'helped: no twin (`twins: false`), the kit’s line');
  // the book's store at 178 either way; the pile's number drawn only on the take page
  assert.equal(story.book.store, 178);
});

test('a reading logs five Counts and six take-aways (a Count more with the groundhog, a twin more for a helped one); the taps, the choices and the dream log nothing; finishing the lesson adds ones2 and opens nothing new', () => {
  for (const [flags, o] of [[{}, {}], [{ specialty: 'swimming' }, { look: 0, teach: 2, answers: { '3x4': [11] } }], [{ ch2Stone: 'chin' }, { look: 1, digits: { '85-39': [5] }, style: 'one' }]]) {
    const cat = fresh(flags, {}), n0 = cat.counts.length, t0 = cat.takes.log.length;
    const rows = read(cat, o);
    rows.forEach((x, i) => { if (['scratch', 'next', 'choice', 'input'].includes(x.kind) && rows[i + 1]) assert.deepEqual([rows[i + 1].counts, rows[i + 1].taken], [x.counts, x.taken], x.id + ' logs nothing'); });
    const misses = Object.values(o.answers || {}).reduce((m, l) => m + l.length, 0);
    assert.equal(cat.counts.length - n0, 5 + ((o.look || 0) === 0 ? 1 : 0) + misses, JSON.stringify(o) + ': typed Counts');
    assert.equal(cat.takes.log.length - t0, 6 + (o.digits ? 1 : 0), JSON.stringify(o) + ': take-aways');
    assert.deepEqual(E.takeSteps(cat, STORIES), ['none', 'ones2']);
    if (o.style) assert.equal(cat.takes.style, o.style, 'her marks, from the marks page');
  }
});

test('Read to me, through the engine and the page’s plan: every frame’s captions and balloons as the page passes them, with a Spanish voice and with none; never Spanish in an English voice, never a row of punctuation alone; the Spanish lines said in Spanish then English, or their English alone; «¡La resta!» said “Take-aways!” with no Spanish voice', () => {
  const V = UI.voices;
  const PAULINA = { name: 'Paulina', lang: 'es-MX' }, SAMANTHA = { name: 'Samantha', lang: 'en-US' };
  const lists = { es: [PAULINA, SAMANTHA], none: [SAMANTHA] };
  const cat = Object.assign(E.blankCat({}), { name: 'Fern', ending: 'heart', petname: 'Biscuit', flags: { specialty: 'friends', ch2Stone: 'chin', teach: 'words', foundGroundhog: true } });
  const itemsOf = id => {
    const f = frames[id];
    return E.captionsRead(f, cat).map(t => ({ text: E.fill(t, cat) })).concat(E.balloons(f, cat).map(b => ({ who: b.who, text: b.lang === 'es' ? E.esLine(b.text, cat) : E.fill(b.text, cat) })));
  };
  const spanishWords = new Set();
  ids.forEach(id => itemsOf(id).forEach(it => E.speechParts(it.text, null, cat).filter(p => p.lang === 'es').forEach(p => spanishWords.add(p.text))));
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
  const W = PC.words.es;
  const r33 = said('f033', 'es'), i33 = r33.indexOf('es ' + W.noAlcanza.es);
  assert.ok(i33 >= 0 && r33[i33 + 1] === 'en ' + W.noAlcanza.en, 'the Spanish, then its English: ' + r33.join(' | '));
  assert.ok(said('f035', 'none').includes('en ' + W.desagrupo.en) && !said('f035', 'none').some(r => /^es/.test(r)), 'with no Spanish voice, the English alone');
  assert.ok(said('f040', 'es').includes('en Twenty-five!'));
  assert.ok(said('f030', 'none').some(r => r.startsWith('en ' + W.resta.en + ' THAT’S what take')), 'with no Spanish voice: “Take-aways! THAT’S …” (' + said('f030', 'none').join(' | ') + ')');
  assert.ok(said('f030', 'es').includes('es ' + W.resta.es));
  // the groundhog's voice is its own, low and slow; the Spanish never in it
  assert.ok(UI.voices && UI.voices.plan);
  // (lower and slower than GroveClan's elder, who speaks in the same woods three screens before its first line: chapter 13's
  // review heard the elder's voice come back from the hole)
  const Sp = UI.speakers;
  assert.ok(Sp.pitch('groundhog') <= Sp.pitch('groveclan', 1) - 0.1 && Sp.rate('groundhog') <= Sp.rate('groveclan') - 0.06, 'the groundhog: ' + Sp.pitch('groundhog') + '/' + Sp.rate('groundhog') + ', the elder ' + Sp.pitch('groveclan', 1) + '/' + Sp.rate('groveclan'));
});

/* ------------------------------------------------------------------ the book and the teaser */

const sentences = s => s.split(/(?<=[.!?])\s+(?=\p{Lu}|\{|“)/u).length;

test('book: book two’s title, the chapter title, seven entries on every reading and eight with the groundhog (one sentence each), true on each path; the store at 178; the dream and the night it stayed a secret; English only; the badger page opens with its four rows; the groundhog’s sleeper page only once found', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['badger', 'chapterTitle', 'dream', 'noDream', 'recap', 'sleeper', 'store', 'title']);
  assert.equal(b.title, '{name}{ending}’s First Frost-Time', 'book two’s volume title');
  assert.equal(b.chapterTitle, 'The Hunter’s Crouch');
  assert.equal(b.store, 178, 'one square, seven rows, eight loose: module 2’s day 2, never said on screen');
  assert.equal(b.dream, '{name}{ending}’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}{ending}’s dream, the night of the first frost, stayed a secret.');
  assert.equal(b.recap.length, 8);
  assert.deepEqual(b.recap.map(r => r.when || null), [null, null, null, null, null, null, { foundGroundhog: true }, null]);
  b.recap.forEach((r, i) => assert.equal(sentences(r.text), 1, 'entry ' + i + ': one sentence'));
  b.recap.forEach(r => assert.doesNotMatch(r.text, /[«»]|\{[Ee]s:/, 'no Spanish in the book'));
  b.recap.forEach(r => assert.doesNotMatch(r.text, /\b(178|one hundred seventy-eight|holds)\b/, 'no line says what the store holds'));
  assert.match(b.recap[7].text, /one long line and eight little pokes\.$/);
  assert.doesNotMatch(b.recap.map(r => r.text).join(' '), /\b(made the marks|a count|dots?)\b/i);
  const cat = Object.assign(fresh({}, { name: 'Fern', ending: 'heart' }), { dreams: {} });
  const page = E.buildBook(story, cat);
  assert.equal(page.title, 'Fernheart’s First Frost-Time');
  assert.equal(page.chapter, 'Chapter 13: The Hunter’s Crouch');
  assert.equal(page.recap.length, 7, 'seven without the groundhog');
  assert.equal(page.dream, 'Fernheart’s dream, the night of the first frost, stayed a secret.');
  cat.flags.foundGroundhog = true;
  assert.equal(E.buildBook(story, cat).recap.length, 8, 'eight with it');
  cat.dreams.ch13 = 'frost on every fern';
  assert.match(E.buildBook(story, cat).dream, /^Fernheart’s dream: “Frost on every fern\.”$/);
  // the badger page (module 2's table; the rows named for chapters 14 to 21)
  assert.deepEqual(b.badger, [
    { row: 'size', say: { text: 'As big as a FOX!', who: 'the ferry otters' } },
    { row: 'mice', saw: { text: 'A big dig, turned earth, no fur or feathers: it digs for worms.' } },
    { row: 'sat', say: { text: 'A badger SAT on my whole patrol!', who: 'the old tom' } },
    { row: 'marks', say: { text: 'Those scratches are claw marks.', who: 'the old tom' } }
  ]);
  assert.deepEqual(b.sleeper, { id: 'groundhog', name: 'The groundhog', when: { foundGroundhog: true },
    lines: ['Asleep in a little doorway beside the big dig in GroveClan’s woods. It sleeps ALL frost-time. It’s its JOB.', '“Not a badger. GROUNDHOG. Something BIGGER dug past my bedroom. Sniffing. All. Night.”'] });
  // its page in book two, as the kit builds it
  const tom = before13({}, { name: 'Storm', ending: 'leap', sex: 'tom' });
  tom.finished.ch13 = 13;
  const two = E.buildFullBook(tom, STORIES, 2);
  const pg = two.pages.find(p => p.id === 'ch13');
  assert.ok(pg, 'chapter 13’s page, in book two');
  assert.equal(pg.store, 178, 'the store drawn at 178');
  assert.match(pg.recap.join(' '), /Stormleap walked his first dawn patrol as a warrior/);
  assert.equal(two.title, 'Stormleap’s First Frost-Time');
  assert.equal(two.sleepers, null, 'no sleepers page before the find');
  assert.deepEqual(two.badger.rows.map(r => [r.row, r.say.length, r.saw.length, r.crossed]), [['size', 1, 0, false], ['mice', 0, 1, true], ['sat', 1, 0, false], ['marks', 1, 0, false]]);
  tom.flags.foundGroundhog = true;
  const found = E.buildFullBook(tom, STORIES, 2).sleepers;
  assert.deepEqual([found.found.map(s => [s.id, s.name, s.chapter]), found.toFind], [[['groundhog', 'The groundhog', 'ch13']], 6], 'the groundhog found, six still sleeping');
  assert.ok(A.vocab.cast.includes('groundhog') && typeof A.character('groundhog', { pose: 'sleep' }).svg === 'string', 'its page draws the groundhog asleep');
  assert.deepEqual(two.teaser && two.teaser.title, 'Chapter 14: The Night Watch');
});

test('the teaser is chapter 14’s, “The Night Watch”: the story’s own line, no more than its entry; chapter 12’s teaser leads here now', () => {
  assert.deepEqual(story.teaser, { title: 'Chapter 14: The Night Watch', lines: ['More holes, and a watch to keep. Who will stay awake?'] });
  const cat = before13({});
  assert.deepEqual(E.teaser(story, cat, STORIES), { title: story.teaser.title, lines: story.teaser.lines, built: false, next: null }, 'no chapter 14 yet');
  assert.deepEqual(E.teaser(ch12, cat, STORIES), { title: 'Chapter 13: The Hunter’s Crouch', lines: ch12.teaser.lines, built: true, next: 'ch13' });
  assert.ok(DOC.replace(/\s+/g, ' ').includes('Chapter 14: The Night Watch. ' + story.teaser.lines[0]), 'the story’s own line');
  assert.doesNotMatch(story.teaser.lines[0], /badger|shape|claw/i, 'holes, a watch, no shape');
});

/* ------------------------------------------------------------------ whole play-throughs */

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, `teach` as she taught, the groundhog if she looked, the Counts, the marks page, the lesson as moves, the pile, the taps, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) {
    const name = comboName(c);
    const cat = fresh(c.flags, { name: c.o.name, sex: c.o.sex });
    const counted = cat.counts.length, taken = cat.takes.log.length;
    const rows = read(cat, Object.assign({ style: readings % 2 ? 'one' : 'above' }, c.o));
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch13'), name);
    assert.deepEqual(idsOf(rows), walk(c.flags, c.o).slice(), name + ': the engine walks the same frames');
    assert.equal(cat.flags.teach, TEACH_OF(c.o), name);
    assert.equal(cat.flags.foundGroundhog, c.o.look === 0 ? true : undefined, name);
    ['ch13-dawn', 'ch13-warm', 'ch13-take', 'ch13-noon', 'ch13-pile'].concat(c.o.look === 0 ? ['ch13-lullaby'] : []).forEach(sid => assert.ok(cat.lessons[sid] && cat.lessons[sid].finished, name + ' ' + sid));
    assert.equal(cat.counts.length - counted, c.o.look === 0 ? 6 : 5, name + ': the Counts typed; the taps never logged');
    assert.equal(cat.takes.log.length - taken, 6, name + ': six take-aways');
    assert.ok(cat.takes.style, name + ': her marks chosen');
    assert.equal(cat.dreams.ch13, 'frost on every fern');
    assert.equal(E.status(cat, STORIES), 'Chapter 13 finished');
    const book = E.buildBook(story, cat);
    assert.equal(book.recap.length, c.o.look === 0 ? 8 : 7, name);
    assert.doesNotMatch(book.recap.join(' ') + book.dream, /[{}«»]/, name + ': the book, every token filled, no Spanish');
    rows.forEach(x => x.say.forEach(bl => assert.ok(bl.label && !/[{}]/.test(bl.label + bl.text), name + ' ' + x.id + ': ' + bl.label + ': ' + bl.text)));
    rows.forEach(x => assert.ok(!x.heard.some(h => /[{}]/.test(h)), name + ' ' + x.id));
    rows.forEach(x => x.say.filter(b => b.who === 'player').forEach(b => assert.equal(b.label, E.warriorName(cat), name + ' ' + x.id)));
    rows.forEach(x => x.say.filter(b => b.lang === 'es').forEach(b => assert.match(b.text, /^«[^»]+»\n\([^)]+\)$/, name + ' ' + x.id + ': its English under it')));
    // the den's stone where she put it in chapter 2 (not chosen: between her paws)
    rows.filter(x => x.scene && x.scene.set === 'den' && frames[x.id].scene.opts.stone).forEach(x => assert.equal(x.scene.opts.stone, c.flags.ch2Stone || true, x.id));
    // the take pages: six problems, the lesson's worked example first, the pile last
    const takes = rows.filter(x => x.takes).map(x => x.takes.map(r => r.key));
    assert.deepEqual(takes, [['43-16', '70-34', '85-39', '97-52', '486-253'], ['52-27']], name);
    assert.ok(E.back(cat, story));
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 30);
  // a save in the middle of the lesson and one in the groundhog's scene go through the save's own shape and come back the same cat
  for (const stop of ['f031', 'f061']) {
    const mid = fresh({ specialty: 'climbing' }, { name: 'Fox' });
    read(mid, { stop, look: 0 });
    const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
    assert.deepEqual([back.flags, back.frame, back.ending], [mid.flags, mid.frame, mid.ending], stop);
    assert.deepEqual(idsOf(read(back, { look: 0 })), idsOf(read(mid, { look: 0 })), stop + ': and reads on to the same end');
  }
});

test('decision 54’s alternative (the spec’s section 7, item 15): the lines that would change if Tallyheart took Chispapaw are where the spec names them, and nowhere else', () => {
  // the crouch taught by her mentor (f016 to f027), `teach` and its two readers, the goodnights, the recap's third line
  assert.equal(T('f017'), 'Chispapaw bounces so high, her bell rings twice on the way up. In the frosty ferns, you find the perfect spot. Tallyheart sits off to the side. The hunter’s crouch. Every warrior starts here.');
  assert.equal(T('f018'), 'Tallyheart taught you on your first evening. How will you teach her?');
  assert.deepEqual(FF(/\bMENTOR\b|\bMentor\b/), ['f079', 'f081']);
  assert.match(story.book.recap[2].text, /\{name\}\{ending\} taught Chispapaw the hunter’s crouch/);
  // “apprentice” said of her only on Glintstar's courtesy patrol (the apprentices' den is a place, the GroveClan apprentice another cat)
  const where = [];
  everyText((id, x) => { if (/\b[Aa]pprentice\b/.test(String(x.text).replace(/apprentices’ den/g, '').replace(/GroveClan apprentice/g, ''))) where.push(id); });
  assert.deepEqual([...new Set(where)], ['f043']);
});

/* ------------------------------------------------------------------ chapter 13's review (~/potomac-crossing-work/ch13/review.json) */

test('chapter 13’s review: no board’s inset draws the badger (not even a lump of fur, a rump or its paws) or the Tall One’s child (chapter 18’s homework panel, never a face); who faces whom on the clue frames, the closing tail and the polite ask; {Murmur}chime awake at first light; the boards say what is drawn', () => {
  ids.forEach(id => (frames[id].board.match(/inset (?:shows|floats)[^.;]*/g) || []).forEach(t =>
    assert.doesNotMatch(t, /badger|\bfur\b|rump|paws|shape|child|Tall One|homework/i, id + ': ' + t)));
  // the three insets rewritten (f071's dropped: his tale's truth is chapter 18's) and the two homework insets gone
  assert.match(frames.f056.board, /inset shows a winter wood long ago, a little kit peering at a big untidy dug hole/);
  assert.match(frames.f062.board, /inset shows its snug round bedroom, soil trickling from one wall/);
  ['f071', 'f030', 'f033'].forEach(id => assert.doesNotMatch(frames[id].board, /inset/, id));
  // f065 to f067: Chispapaw at marks-2 faces the marks and our cat (to her left); our cat faces her and them
  ['f065', 'f066', 'f067'].forEach(id => {
    assert.equal(castOf(id, 'chispapaw')[0].facing, 'left', id + ': Chispapaw faces the marks');
    assert.equal(castOf(id, 'player')[0].facing, 'right', id);
  });
  // f084: facing right, her raised tail stands against the den's green wall, not in front of the fourth rose stem
  assert.equal(castOf('f084', 'chispapaw')[0].facing, 'right');
  // f051: "Then she looks at you": Tallyheart at meet-2 faces our cat at meet-1 (on f052a and f052b, the elder again)
  assert.deepEqual(['f051', 'f052a', 'f052b'].map(id => castOf(id, 'tallyheart')[0].facing), ['left', 'right', 'right']);
  // f001 to f003 and f009, f010, f047: open eyes where the story says awake, straight-faced, on the pebble, a warm look
  ['f001', 'f002', 'f003'].forEach(id => assert.notEqual(castOf(id, 'murmurchime')[0].mood, 'happy', id + ': awake, eyes open'));
  assert.deepEqual(['murmurchime', 'player'].map(w => castOf('f009', w)[0].mood), ['kind', 'kind'], 'f009: straight faces');
  assert.equal(castOf('f010', 'player')[0].mood, 'wonder', 'f010: eyes on the pebble');
  assert.equal(castOf('f047', 'tallyheart')[0].mood, 'kind', 'f047: her look, eyes open');
  // the boards as drawn and as continuity has them
  assert.match(frames.f011.board, /sandy old grandmother otter/);
  assert.doesNotMatch(frames.f012.board, /Tallyheart|her paws/);
  assert.match(frames.f022.board, /one crumpled green leaf/);
  assert.doesNotMatch(frames.f038.board, /pressed close/);
  assert.match(frames.f043.board, /its first patrol to lead/);
  assert.match(frames.f052a.board, /white muzzle/);
  assert.doesNotMatch(frames.f077.board + frames.f079.board, /yawns|rolls its eyes|opens one sleepy eye/);
  // the recap true for a cat helped to the lullaby's last miss
  assert.match(story.book.recap[6].text, /helped it count seven times eight/);
});
