/* Story tests for chapter 11: node --test
 *
 * Checks app/story/ch11.js against the frame contract in docs/build.md, against the story
 * (docs/chapters/11-the-warrior-ceremony.md, Draft v0.4, final) and against its spec
 * (docs/chapters/11-the-warrior-ceremony.spec.md, v0.2, the build's contract): the frame graph (f001 to f058, no
 * frame shown only `when` a flag matches, the Type screen f025 reached only by “I’ll name myself!”), one interaction
 * per frame, the three choices (the vow and the thanks set nothing; the name choice's thirty offered names, each
 * `when: { offer }` with its `ending` and `ch11Named: 'offer'`, three shown on every reading, never two alike, and
 * “I’ll name myself!”), the Type screen (its refusals, who says each, `ch11Named: 'self'` only once accepted), the
 * reasons by `offer` and `nameHas` on f020 to f022 for every first part and every row, the friends' lines by
 * `ending` on f027, `{name}paw` before the naming and `{name}{ending}` from it, our cat's balloons and the paw
 * thing's counter labelled with her warrior name; the Counts set exactly as the spec has it, run to four misses,
 * and the Counts claims pinned (no new Count); the two counts by taps (the ears, eight cats, {Murmur}chime fourth,
 * five Clan coats, Tallyheart counting; the paw thing, both forepaws, whispered, 50 kept for the next page); the
 * pages she taps once, each with its target in the art; the speakers, the chained balloons exactly the spec's, the
 * balloon kinds; tokens, storyboards, word counts, captions and boxes, the art vocabulary camera by camera (the
 * camp's `moon: 15` by night, the den's 15 and `nextNest`), the staging (the ring, the fountain's foot, the mist
 * stone frame by frame, the pinecone, the watch, first light, the warriors' nest), no two cats touching, depth (casts
 * back to front), the time of day, the generated storyboard, every frame rendered with everyone in the picture, the
 * beats in order on every path, the book (seven sentences on every path), the teaser for module 2, the chapter
 * opened by a pass and the hub after it, and whole play-throughs through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch11.test.js   prints the whole chapter, rendered four ways.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
require('../app/ui.js');   // its pure parts: the speakers' labels and voices, the taps' hit test, the Type screen's rules, the hub
const E = PC.engine;
const A = PC.art;
const UI = PC.ui;
const story = PC.story.ch11;
const frames = story.frames;
const ids = Object.keys(frames);
const ch01 = PC.story.ch01, ch04 = PC.story.ch04, ch10 = PC.story.ch10;
const STORIES = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09', 'ch10'].map(k => PC.story[k]).concat([story]);
const UI_SRC = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');

/* ------------------------------------------------------------------ the contract */

// The flags a `when` may test: chapters 1, 2 and 10's that the story reads, chapter 11's own (`ch11Named`), and the
// warrior name's three keys (`offer` and `nameHas`, computed; `ending`, her own field)
const SPEC = ['noticing', 'sneaking', 'climbing', 'swimming', 'friends'];
const WORRIES = ['small', 'water', 'talk', 'shiny'];
const BEST = ['sprinkle', 'friends', 'truth', 'counts'];
const FLAGS = { specialty: SPEC, worry: WORRIES, ch2Stone: ['nose', 'chin'], ch10Best: BEST, ch11Named: ['offer', 'self'] };
const COMPUTED = ['offer', 'nameHas', 'ending'];
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'pick', 'ask', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx'].concat(INTERACTIONS);
const TOKENS = ['name', 'ending', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things', 'also']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat', 'sloshbank', 'reedclan', 'thymeleaf', 'groveclan'];
const GROWN = ['tallyheart', 'glintstar', 'thymeleaf', 'grizzled', 'waffles', 'murmurchime'];
// the thirty endings, in the rows' order (the story's For us; the engine's E.WARRIOR_ENDINGS)
const ROWS = { ch10Best: { sprinkle: ['mist', 'flash', 'sky'], friends: ['purr', 'friend', 'hug'], truth: ['true', 'clear', 'brave'], counts: ['mark', 'count', 'tally'] },
  specialty: { noticing: ['bright', 'eye', 'sight'], sneaking: ['hush', 'sharp', 'spark'], climbing: ['leap', 'climb', 'reach'], swimming: ['splash', 'wave', 'ripple'], friends: ['cheer', 'smile', 'kind'] },
  moon: ['moon', 'silver', 'river'] };
const THIRTY = [].concat(...Object.values(ROWS.ch10Best), ...Object.values(ROWS.specialty), ROWS.moon);
// the first parts the offers are checked over (the spec's list: chapter 1's eight, then the doubled, guarded and tripled)
const CH1_NAMES = ['Moon', 'Fern', 'Minnow', 'Frost', 'Pebble', 'Sedge', 'Storm', 'Holly'];
const FIRSTS = CH1_NAMES.concat(['Moonbeam', 'Misty', 'Mist', 'Amber', 'Honey', 'Bright', 'Dawn', 'Fox', 'Wiggle', 'Otter', 'Ripple', 'Tally', 'Thyme', 'Murmur', 'Big Fern', 'Moss', 'Shell']);
// the Type screen's refusals (the story's lines)
const REFUSE = {
  own: { who: 'tallyheart', text: 'That’s your name ALREADY! Give it a new ending.' },
  star: { who: 'glintstar', text: 'Star is for leaders. Try another ending.' },
  paw: { who: 'tallyheart', text: 'Paw? Not any more, you’re not! Try another.' },
  kit: { who: 'murmurchime', text: 'Kit? You’re a WARRIOR now, silly! Try another.' },
  clan: { text: 'That’s MY name! One of me is plenty. Find one all your own.' }
};
// the staging's spots (the header's): the Warrior Counts' foot of the fountain and Tallyheart beside it; the ring's
// front row; the old tom and the grey tom behind {Murmur}chime; Thymeleaf by the ferns; the old tom at her side; the
// walk into the ring; Tallyheart padding across in the first light
const SPOTS = { FOOT: { x: 760, y: 860 }, BESIDE: { x: 950, y: 872 }, RING_YOU: { x: 610, y: 905 }, RING_TALLY: { x: 380, y: 900 },
  OLD: { x: 1130, y: 770 }, GREY: { x: 1290, y: 772 }, THYME: { x: 1300, y: 960, h: 180 }, BY_FOOT: { x: 530, y: 872 }, BOW: { x: 740, y: 860 },
  WALK_YOU: { x: 650, y: 900 }, WALK_TALLY: { x: 380, y: 892 }, PAD: { x: 1080, y: 890 } };
const EIGHT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }, { who: 'murmurchime' },
  { who: 'clancat', variant: 4 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }, { who: 'snorter' }];

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
const spotName = a => Object.keys(SPOTS).find(k => same(SPOTS[k], a));
/* The frames that say this, in reading order; F: the one frame that does. */
function FF(re) { return ids.filter(id => re.test(T(id))); }
function F(re) {
  const hit = FF(re);
  assert.equal(hit.length, 1, 'exactly one frame says ' + re + ' (' + hit.join(' ') + ')');
  return hit[0];
}

const PROFILES = {
  'she-cat': { name: 'Moon', ending: 'silver', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A name in the moonlight.' },
  tom: { name: 'Storm', ending: 'leap', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'Forty pieces, not one gone.' },
  // a player whose own Clan name is Murmur: the warrior is Mutterchime
  murmur: { name: 'Murmur', ending: 'true', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Riffle cheering.' },
  // a tom who named himself
  self: { name: 'Fern', ending: 'heart', petname: 'Muffin', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'The watch.' }
};
const FACT = { a: 4, b: 10, answer: 40, groups: 4, per: 10, thing: 'piece', things: 'pieces', also: '' };
function fill(text, p) { return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : k in FACT ? FACT[k] : m)); }

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
    const start = text.replace(/\*\*/g, '').replace(/^[“"‘'(—]+/, '');
    if (!start.startsWith('…') && /^\p{Ll}/u.test(start) && !/^—/.test(text)) bad.push('starts lowercase');
    if (/[.!?][”"’']?\s+[“"‘(]?(\p{Ll})/u.test(text)) bad.push('sentence starts lowercase');
  }
  return bad;
}

/* Every Counts line of the chapter's own set. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast', 'fastAfterMiss', 'again', 'remembered', 'rememberedSlow'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l, ok: FACT_TOKENS })));
    ['miss', 'missLast', 'helpIntro', 'helpIntroFar', 'againIntro', 'done', 'fillIntro'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: FACT_TOKENS }); });
    (d.facts || []).forEach((f, i) => {
      if (Array.isArray(f)) return;
      ['prompt', 'retryPrompt'].forEach(pk => { if (typeof f[pk] === 'string' || Array.isArray(f[pk])) [].concat(f[pk]).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' ' + pk + ' ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS })); });
      [].concat(f.right || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' right ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
    });
  });
  return out;
}
// the one caption that runs on by design: the purr's, split at its comma (the story's one line with no sentence break)
const RUNS_ON = ['until the whole camp is humming your new name.'];
function everyText(fn) {
  ids.forEach(id => texts(frames[id]).forEach(x => fn(id, Object.assign(x, { runsOn: RUNS_ON.includes(x.text) }))));
  ids.forEach(id => {
    const f = frames[id];
    if (f.choice) f.choice.options.forEach((o, i) => fn(id, { where: 'option ' + i, text: o.label }));
    if (f.skip && f.skip.prompt) fn(id, { where: 'skip prompt', text: f.skip.prompt });
    if (f.skip && f.skip.name) fn(id, { where: 'skip name', text: f.skip.name });
    if (f.scratch) fn(id, { where: 'tap prompt', text: E.tapWords(f).prompt });
    if (f.input && f.input.kind === 'ending') Object.keys(f.input.refuse).forEach(k => fn(id, { where: 'refuse ' + k, text: f.input.refuse[k].text, who: f.input.refuse[k].who }));
    if (f.input && f.input.placeholder) fn(id, { where: 'placeholder', text: f.input.placeholder });
  });
  countsLines().forEach(x => fn('counts ' + x.set, x));
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  ['title', 'chapterTitle', 'dream', 'noDream'].forEach(k => { if (story.book[k]) fn('book', { where: k, text: story.book[k] }); });
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* The choices: the vow (light), the name (three offered, or her own), the thanks (light). */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const VOW = choiceAt(/^“I PROMISE!”$/)[0];
const NAMES = choiceAt(/^“I’ll name myself!”$/)[0];
const THANKS = choiceAt(/^“Thank you, Tallyheart\.”$/)[0];
const TYPE = ids.find(id => frames[id].input && frames[id].input.kind === 'ending');
const DREAM = ids.find(id => frames[id].input && frames[id].input.kind === 'dream');
const NAMING = 'f026';   // “From tonight”: her name is {name}{ending} from here on
/* The option a reader takes: `vow` and `thanks` (0 or 1), `pick` at the name choice (0, 1 or 2: the n-th name
 * Glintstar offers, or 'self'). Returns the option's index in the definition. */
function choiceFor(id, o, cat) {
  o = o || {};
  if (id === VOW) return o.vow || 0;
  if (id === THANKS) return o.thanks || 0;
  if (id === NAMES) {
    const opts = E.options(frames[id], cat);
    return o.pick === 'self' ? opts[opts.length - 1].index : opts[o.pick || 0].index;
  }
  throw new Error('no choice at ' + id);
}
/* What she types on the Type screen: her tries in order (`o.type`, default “heart”), the first she may keep. */
function typedFor(o, cat) {
  const tries = [].concat(o && o.type != null ? o.type : ['heart']);
  const ok = tries.find(t => !E.checkEnding(t, cat).refuse);
  return { tries, ok: ok == null ? null : ok };
}
/* A cat as the walks below take her: these flags, her first part, she-cat unless `sex`. */
function catFor(flags, o) {
  o = o || {};
  return { name: o.name || 'Moon', flags: Object.assign({}, flags), look: { sex: o.sex || 'she' }, lessons: {} };
}
/* The frames a reader with these flags walks through, in order (E.landing, as the engine lands); her choices
 * set her flags and her ending, the Type screen keeps the first ending she may. The cat as it ended is on the
 * result (`.cat`). */
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
      const opt = f.choice.options[choiceFor(id, o, cat)];
      assert.ok(E.options(f, cat).some(x => x.option === opt), id + ': the option she takes is one she sees');
      Object.assign(cat.flags, opt.sets || {});
      if (opt.ending) cat.ending = opt.ending;
      id = opt.next;
    } else if (f.input && f.input.kind === 'ending') {
      const ty = typedFor(o, cat);
      assert.ok(ty.ok != null, 'an ending she may keep among ' + ty.tries.join(' '));
      cat.ending = E.checkEnding(ty.ok, cat).ending;
      Object.assign(cat.flags, f.input.sets);
      id = f.input.next;
    } else id = exits(f)[0];
  }
  throw new Error('no end');
}
/* What a walk put on screen: for each frame, the lines its reader saw there (tokens as written), and what she did;
 * a frame's lines are read with the cat as she is on it (her ending from the frame after the name's). */
function walkLines(flags, o) {
  o = o || {};
  const p = walk(flags, o), end = p.cat, cat = catFor(flags, o);
  return p.map(id => {
    const f = frames[id];
    if (at(id) >= at(NAMING)) { cat.ending = end.ending; cat.flags.ch11Named = end.flags.ch11Named; }
    const bal = E.balloons(f, cat), caps = E.captions(f, cat);
    const row = { id, kind: E.kindOf(f), lines: caps.concat(bal.map(b => b.text)).concat(f.sfx ? [f.sfx] : []), boxes: caps.length + bal.length, balloons: bal };
    if (f.choice) row.options = E.options(f, cat).map(x => E.optionLabel(x.option, cat));
    if (f.scratch) row.tap = E.tapWords(f).prompt;
    return row;
  });
}
/* Every combination of what she will remember most (or none), what she does best (or none), her worry, and her
 * name (each of the three offered, or her own, typed with a try refused first by turns), her first part and her
 * stone by turns: 480 readings. */
const SELF_TRIES = [['heart'], ['stars', 'chime'], ['leaf'], ['paws', 'pinecones'], ['Big Heart'], ['kitten', 'hearts'], ['storm'], ['', 'brook']];
const COMBOS = [];
for (const best of BEST.concat([undefined])) for (const specialty of SPEC.concat([undefined])) for (const worry of WORRIES) for (const pick of [0, 1, 2, 'self']) {
  const n = COMBOS.length, flags = { worry, ch2Stone: n % 2 ? 'chin' : 'nose' };
  if (best) flags.ch10Best = best;
  if (specialty) flags.specialty = specialty;
  COMBOS.push({ flags, o: { pick, name: FIRSTS[n % FIRSTS.length], vow: n % 2, thanks: (n >> 1) % 2, type: SELF_TRIES[n % SELF_TRIES.length], sex: n % 3 ? 'she' : 'tom' } });
}
const comboName = c => JSON.stringify(c.flags) + ' ' + c.o.name + ' ' + c.o.pick;
const SOME = COMBOS.filter((c, i) => i % 7 === 0);

/* ------------------------------------------------------------------ reading through the engine */

const Sp = UI.speakers;
const labelFor = (b, cat, st) => Sp.label(b, { cat, story: st || story, fill: x => E.fill(x, cat) });
function saidOn(st, id, cat) {
  const f = st.frames[id], cast = (f.scene && f.scene.cast) || [];
  return E.balloons(f, cat).map(b => {
    const mine = cast.filter(c => c && c.who === b.who), m = mine[b.nth] || mine[0];
    return { who: b.who, label: labelFor(Object.assign({}, b, { variant: m && m.variant }), cat, st), text: E.fill(b.text, cat), kind: b.kind, variant: m && m.variant };
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
    const picture = E.lessonPicture(D, q, q.lit || 0);
    const r = E.counts.answer(state, D, a, t, 1);
    E.logAnswer(cat, r.entry);
    const row = { k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, picture, line: E.fill(r.line || '', cat), kind: r.lineKind,
      balloons: (r.balloons || []).map(b => Object.assign({}, b, { text: E.fill(b.text, cat) })), res: r, teacher: E.teacherOf(def, D), entry: r.entry };
    if (!r.correct) { row.help = E.helpPlan(def, D, q, r); row.steps = E.helpSteps(row.help); }
    out.push(row);
    if (r.done) E.recordLesson(cat, state);
    else cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: st.id, state };
  }
  return out;
}
function play(cat, setId, answers, ms) {
  const { def, state } = E.chapterLesson(cat, story, setId, 1, STORIES);
  return lessonRows(cat, story, def, state, answers, ms);
}
const ks = rows => rows.map(r => r.k);
function readStory(cat, st, o) {
  o = o || {};
  const rows = [];
  let t = o.t || 1000;
  for (let guard = 0; guard < 300; guard++) {
    const id = E.frameId(cat, st), f = st.frames[id], kind = E.kindOf(f);
    const row = { id, kind, f, caps: E.captions(f, cat).map(c => E.fill(c, cat)), heard: E.captionsRead(f, cat).map(c => E.fill(c, cat)), say: saidOn(st, id, cat),
      counts: cat.counts.length, sfx: f.sfx || '', scene: f.scene ? E.resolveScene(f.scene, cat, STORIES) : null, flags: Object.assign({}, cat.flags), ending: cat.ending };
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
      const want = choiceFor(id, o, cat), ix = opts.findIndex(x => x.index === want);
      row.picked = ix;
      assert.ok(ix >= 0 && E.choose(cat, st, want, t), id);
    } else if (kind === 'input' && f.input.kind === 'ending') {
      const ty = typedFor(o, cat);
      row.refused = [];
      for (const raw of ty.tries) {
        const before = clone({ ending: cat.ending || null, flags: cat.flags, frame: cat.frame });
        const r = UI.ending.refusal(f.input, cat, raw);
        if (r) {
          row.refused.push({ raw, who: r.who, text: r.text, label: labelFor({ who: r.who }, cat, st) });
          assert.equal(E.submitInput(cat, st, raw, t), false, id + ': ' + JSON.stringify(raw) + ' refused');
          assert.deepEqual(clone({ ending: cat.ending || null, flags: cat.flags, frame: cat.frame }), before, id + ': a refused ending stores nothing, sets nothing, the page stays');
        } else { row.typed = raw; assert.ok(E.submitInput(cat, st, raw, t), id + ': ' + raw); break; }
      }
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'a name in the moonlight' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      row.lesson = lessonRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat at chapter 11's first page: chapters 1 to 10 finished (her Warrior Counts passed is the hub's business,
 * tested below), her flags, every Count learned. `o.name`, `o.sex`. */
function before11(flags, o) {
  o = o || {};
  const cat = E.blankCat({ now: 1, id: 'c11' });
  cat.name = o.name || 'Moon'; cat.petname = 'Muffin';
  if (o.sex) cat.look.sex = o.sex;
  STORIES.slice(0, 10).forEach((s, i) => { cat.finished[s.id] = i + 1; });
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch3Told: true, caseFileOpen: true, ch10Best: 'truth' }, flags || {});
  E.countSets(STORIES).forEach(k => { cat.lessons[k.setId] = { set: k.setId, mode: 'chapter', answers: 10, correct: 10, fast: 5, facts: 10, firstTry: 10, helped: 0, noHelp: true, finished: true }; });
  return cat;
}
function fresh(flags, o) { const cat = before11(flags, o); E.startChapter(cat, story, 500); return cat; }
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
function boxesOn(id) {
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose' } });
  const sc = E.resolveScene(frames[id].scene, cat, STORIES), svg = A.render(sc, { look: LOOKD }).svg;
  return sc.cast.map(m => { const a = anchorOf(sc, m); const L = a && landed(svg, m, a); return L ? Object.assign(L, { m }) : null; });
}

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape: the Warrior Ceremony, opened by the Warrior Counts, after chapter 10 and before them on the page, in the offline copy', () => {
  assert.equal(story.id, 'ch11');
  assert.equal(story.number, 11);
  assert.equal(story.title, 'The Warrior Ceremony');
  assert.equal(story.opensWhen, 'warrior');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.equal(ids.length, 58, 'every panel, the Type screen among them, and the story’s last screen in two');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'number', 'opensWhen', 'start', 'teaser', 'title']);
  assert.equal(story.names, undefined, 'no chapter names: the Clan’s calls are labelled on their balloons');
  assert.deepEqual(story.cards, {}, 'no card: her Case File stays as chapter 10 left it');
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch11'), order.indexOf('ch10') + 1, 'chapter 11 follows chapter 10');
  assert.ok(Object.values(frames).every(f => !/\bSTUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 480);
  // the page loads it after chapter 10 and before the Warrior Counts, the gallery too, and the offline copy has it
  const scripts = require('./_load.js').scripts();
  assert.ok(scripts.indexOf('app/story/ch10.js') >= 0 && scripts.indexOf('app/story/ch10.js') < scripts.indexOf('app/story/ch11.js'));
  assert.ok(scripts.indexOf('app/story/ch11.js') < scripts.indexOf('app/story/warrior.js'), 'the Warrior Counts’ tag stays after the chapters');
  const gallery = fs.readFileSync(path.join(ROOT, 'dev/gallery.html'), 'utf8');
  assert.ok(gallery.indexOf('../app/story/ch10.js') < gallery.indexOf('../app/story/ch11.js') && gallery.indexOf('../app/story/ch11.js') < gallery.indexOf('../app/story/warrior.js'), 'the gallery loads what the page loads');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  assert.match(sw, /'\.\/app\/story\/ch10\.js',\n\s*'\.\/app\/story\/ch11\.js',/);
  // the Warrior Counts open after chapter 10, and they open this chapter: closed for a cat who has not passed
  assert.equal(PC.warrior && PC.warrior.after, 'ch10');
  const cat = before11({});
  assert.equal(E.isOpen(cat, story, STORIES), false, 'chapter 10 finished is not enough: she passes her Warrior Counts first');
});

test('frame ids run f001 to f058 in reading order, with no letters; every edge goes forward; the numbers have no gaps; the Type screen sits between the name choice and “From tonight”', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  ids.map(num).forEach((n, i) => assert.equal(n, i + 1, 'frame number ' + (i + 1) + ' is missing'));
  assert.deepEqual([NAMES, TYPE, DREAM, VOW, THANKS], ['f024', 'f025', 'f056', 'f018', 'f047']);
  const outs = [...new Set(frames[NAMES].choice.options.map(o => o.next))];
  assert.deepEqual(outs, [NAMING, TYPE], 'every offered name to “From tonight”, her own to the Type screen');
  assert.equal(frames[TYPE].input.next, NAMING);
});

test('exactly one interaction per frame, no unknown keys; no frame shown only `when` a flag matches, no `else`, no `sets`, no gift, no card: every flag a choice’s or the Type screen’s', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    ['look', 'file', 'pick', 'ask', 'when', 'else', 'sets', 'gift', 'card', 'sfxAt', 'sfxRead'].forEach(k => assert.equal(f[k], undefined, id + ': no ' + k));
  });
  // the flags set: the name choice's `ch11Named: 'offer'`, the Type screen's `ch11Named: 'self'`; the vow, the thanks and
  // “I’ll name myself!” nothing
  const sets = [];
  ids.filter(id => frames[id].choice).forEach(id => frames[id].choice.options.forEach(o => { if (Object.keys(o.sets).length) sets.push(id + ':' + JSON.stringify(o.sets)); }));
  assert.deepEqual([...new Set(sets)], [NAMES + ':{"ch11Named":"offer"}']);
  assert.deepEqual(frames[TYPE].input.sets, { ch11Named: 'self' });
  assert.deepEqual(E.checkStory(story, STORIES), []);
});

test('a child who listens hears every sentence finished: no sound needs saying in words; every page is heard as it is lettered, every caption a whole sentence or the purr’s, which runs on', () => {
  assert.deepEqual(ids.filter(id => frames[id].sfx).map(id => [id, frames[id].sfx]), [['f004', 'Boing.'], [F(/^Off he scampers down to the river\./), 'Splash!'], [F(/^The sky turns pink, then gold\./), 'Tweet!']]);
  const some = [{ flags: { ch2Stone: 'nose', worry: 'small', ch10Best: 'counts' } }, { flags: { ch2Stone: 'chin', worry: 'shiny', ch10Best: 'friends' } }];
  ids.forEach(id => {
    const f = frames[id];
    (f.caption || []).map(capText).forEach((t, i, all) => {
      if (E.endsSentence(t)) return;
      assert.ok(/,$/.test(t) && RUNS_ON.includes(all[i + 1]), id + ': “' + t + '” runs on');
    });
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
  // only the name choice leads to the Type screen, and only by “I’ll name myself!”
  ids.forEach(id => { if (id !== NAMES) assert.ok(!exits(frames[id]).includes(TYPE), id); });
});

test('every combination reaches the end with no frame that shows nothing: 57 frames on a reading with an offered name, 58 naming herself (the spec’s 56 and 57, and its last screen in two panels: Back and Next on a 1080 x 720 iPad’s screen; the brief’s cap 90)', () => {
  for (const c of COMBOS) {
    const name = comboName(c), rows = walkLines(c.flags, c.o);
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    assert.equal(rows.length, c.o.pick === 'self' ? 58 : 57, name);
    assert.equal(rows.some(r => r.id === TYPE), c.o.pick === 'self', name);
    rows.forEach(r => { if (r.kind !== 'end') assert.ok(r.lines.length > 0 || (r.options || []).length || r.tap, r.id + ' shows nothing to ' + name); });
  }
});

/* ------------------------------------------------------------------ the choices and the warrior name */

test('choices: the vow and the thanks light (quoted, both to the next screen, nothing set); the name choice the thirty offered names in the rows’ order, each by its `offer` with its `ending` and `ch11Named: "offer"`, then “I’ll name myself!”, which sets nothing', () => {
  assert.deepEqual(ids.filter(id => frames[id].choice), [VOW, NAMES, THANKS]);
  const L = id => frames[id].choice.options.map(o => o.label);
  assert.deepEqual(L(VOW), ['“I will.”', '“I PROMISE!”']);
  assert.deepEqual(L(THANKS), ['“Thank you, Tallyheart.”', '“You counted with me. Every time.”']);
  [VOW, THANKS].forEach(id => frames[id].choice.options.forEach((o, i) => {
    assert.deepEqual(o, { label: o.label, sets: {}, next: ids[at(id) + 1] }, id + ' option ' + i);
    assert.ok(words(o.label) <= 8, id + ' option ' + i);
  }));
  ids.filter(id => frames[id].choice).forEach(id => assert.equal(frames[id].choice.prompt, undefined, id));
  // the name choice, as the spec writes it
  const opts = frames[NAMES].choice.options;
  assert.equal(opts.length, 31);
  assert.deepEqual(opts.slice(0, 30), THIRTY.map(w => ({ label: '{name}' + w, when: { offer: w }, ending: w, sets: { ch11Named: 'offer' }, next: NAMING })));
  assert.deepEqual(opts[30], { label: '“I’ll name myself!”', sets: {}, next: TYPE });
  // the rows' order is the engine's own data, and every option's ending equals its offer
  assert.deepEqual(E.WARRIOR_ENDINGS.ch10Best, ROWS.ch10Best);
  assert.deepEqual(E.WARRIOR_ENDINGS.specialty, ROWS.specialty);
  assert.deepEqual(E.WARRIOR_ENDINGS.moon, ROWS.moon);
  opts.slice(0, 30).forEach(o => assert.equal(o.ending, o.when.offer, o.label));
  // the thirty are words a child would be proud of: never star, paw or kit, never a cat's name in the Clan
  THIRTY.forEach(w => assert.doesNotMatch(w, /star|paw|kit/, w));
  assert.equal(new Set(THIRTY).size, 30, 'thirty different words: no reading shows two alike');
  // a spoken option is never echoed as a balloon on the next panel
  [VOW, THANKS].forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
});

test('the offers, for every `ch10Best` (four and none) × `specialty` (five and none) × first part (chapter 1’s eight and the doubled, guarded and tripled): f020, f021 and f022 each show exactly one reason with its name, f024 exactly four options, three different names and “I’ll name myself!”, each name E.warriorOffers’ word', () => {
  let n = 0;
  for (const best of BEST.concat([undefined])) for (const specialty of SPEC.concat([undefined])) for (const name of FIRSTS) {
    const flags = {};
    if (best) flags.ch10Best = best;
    if (specialty) flags.specialty = specialty;
    const cat = { name, flags, look: { sex: 'she' } }, offers = E.warriorOffers(cat), lab = name + ' ' + best + ' ' + specialty;
    assert.equal(offers.length, 3, lab);
    assert.equal(new Set(offers).size, 3, lab + ': never two alike');
    assert.ok(ROWS.ch10Best[best || 'truth'].includes(offers[0]) && ROWS.specialty[specialty || 'noticing'].includes(offers[1]) && ROWS.moon.includes(offers[2]), lab + ': one a row, in Glintstar’s order');
    // the reasons: one a row, each ending in the name it gives
    ['f020', 'f021', 'f022'].forEach((id, r) => {
      const named = E.balloons(frames[id], cat).filter(b => b.who === 'glintstar' && /\{name\}[a-z]+\.$/.test(b.text));
      assert.equal(named.length, 1, id + ' ' + lab + ': one reason with its name');
      assert.ok(named[0].text.endsWith('{name}' + offers[r] + '.'), id + ' ' + lab + ': ' + named[0].text);
    });
    // the choice: her three, in order, then her own
    const shown = E.options(frames[NAMES], cat);
    assert.deepEqual(shown.map(x => x.option.label), offers.map(w => '{name}' + w).concat(['“I’ll name myself!”']), lab);
    assert.deepEqual(shown.slice(0, 3).map(x => x.option.ending), offers, lab);
    n++;
  }
  assert.equal(n, 5 * 6 * FIRSTS.length);
  // the engine's passes, as the story's For us names them: the doubled, the guarded, the tripled
  const off = (name, more) => E.warriorOffers({ name, flags: Object.assign({ ch10Best: 'sprinkle', specialty: 'climbing' }, more) });
  assert.deepEqual(off('Moon'), ['mist', 'leap', 'silver']);
  assert.deepEqual(off('Moonbeam'), ['mist', 'leap', 'silver']);
  assert.deepEqual(off('Misty'), ['flash', 'leap', 'moon']);
  assert.deepEqual(off('Amber')[2], 'silver');
  assert.deepEqual(off('Honey')[2], 'silver', 'never Honeymoon');
  assert.deepEqual(off('Fox')[1], 'climb', 'never Foxleap');
  assert.deepEqual(off('Shell')[1], 'climb', 'never Shellleap');
  assert.deepEqual(off('Moss', { specialty: 'swimming' })[1], 'wave', 'never Mosssplash');
  assert.deepEqual(off('Fern', { ch10Best: undefined, specialty: undefined }), ['true', 'bright', 'moon'], 'a missing row reads truth and noticing');
});

test('the reasons: the first row’s by what she will remember most (the Counts’ three balloons, Tallyheart’s “Ha!” among them), the second by what she does best, the moon’s by `offer` and `nameHas` (the silver cat whose name has the moon in it, and the one whose doesn’t), then the old tom’s pinecone', () => {
  const said = (id, name, flags) => E.balloons(frames[id], { name, flags: flags || {} }).map(b => b.who + ': ' + b.text);
  // (Tallyheart's “Ha!” after Glintstar's name for the cat, the review's: between them, Glintstar's third balloon had a
  // tail of its own that ran up across her first two's words; after them, her balloons chain with one tail)
  assert.deepEqual(said('f020', 'Fern', { ch10Best: 'counts' }), ['glintstar: Tallyheart told me what you’ll remember most.', 'glintstar: The Counts. Of COURSE.', 'glintstar: Ten claw marks on the leaning tree. {name}mark.', 'tallyheart: Ha!']);
  assert.deepEqual(said('f020', 'Marky', { ch10Best: 'counts' }), ['glintstar: Tallyheart told me what you’ll remember most.', 'glintstar: The Counts. Of COURSE.', 'glintstar: Every Count, up to ten times ten. {name}count.', 'tallyheart: Ha!'], 'Marky is offered count');
  assert.deepEqual(said('f020', 'Tally', { ch10Best: 'counts' }).slice(-2)[0], 'glintstar: Ten claw marks on the leaning tree. {name}mark.', 'Tally is offered mark (Tallymark: not a book cat’s name)');
  assert.deepEqual(said('f020', 'Fern', { ch10Best: 'sprinkle' }), ['glintstar: Tallyheart told me what you’ll remember most.', 'glintstar: Sprinkle, who flew home in the mist. {name}mist.']);
  assert.deepEqual(said('f020', 'Misty', { ch10Best: 'sprinkle' }).pop(), 'glintstar: Sprinkle, who says hello in a flash. {name}flash.');
  assert.deepEqual(said('f020', 'Fern', { ch10Best: 'friends' }).pop(), 'glintstar: Your friends: an otter, a dragon or two, one very dramatic pillow cat, and this whole ring. A purr for every one. {name}purr.');
  assert.deepEqual(said('f020', 'Fern', { ch10Best: 'truth' }).pop(), 'glintstar: Finding the truth. You found it, and you said it. {name}true.');
  assert.deepEqual(said('f021', 'Fern', { specialty: 'climbing' }), ['glintstar: And what you do best.', 'glintstar: Up the curtains. Up the bramble arch. And a climber’s leap: crouch, look, JUMP! {name}leap.']);
  assert.deepEqual(said('f021', 'Fox', { specialty: 'climbing' }).pop(), 'glintstar: Up the curtains. Up the bramble arch. Up ANYTHING. {name}climb.');
  assert.deepEqual(said('f021', 'Fern', { specialty: 'swimming' }).pop(), 'glintstar: You taught a dragon to paddle. Back legs! {name}splash.');
  assert.deepEqual(said('f021', 'Fern', { specialty: 'friends' }).pop(), 'glintstar: The loudest cheer in any crowd. You even made Sloshbank smile. Almost. {name}cheer.');
  assert.deepEqual(said('f021', 'Fern', { specialty: 'sneaking' }).pop(), 'glintstar: Quiet as a shadow, all moon long. {name}hush.');
  assert.deepEqual(said('f021', 'Fern', { specialty: 'noticing' }).pop(), 'glintstar: Bright eyes, that see what everyone else misses. {name}bright.');
  // the moon's: moon, or silver by whether her name has the moon in it already
  assert.deepEqual(said('f022', 'Fern'), ['glintstar: And one for this moon itself. On your first night, there was no moon at all. Now you’ve seen it round and full. {name}moon.', 'grizzled: Or {name}PINECONE!']);
  assert.deepEqual(said('f022', 'Moon')[0], 'glintstar: And one for this moon itself. Your name has the moon in it already. So: {name}silver.');
  assert.deepEqual(said('f022', 'Moonbeam')[0], 'glintstar: And one for this moon itself. Your name has the moon in it already. So: {name}silver.');
  ['Amber', 'Honey', 'Hidden'].forEach(n => assert.deepEqual(said('f022', n)[0], 'glintstar: And one for this moon itself, that turns everything silver. {name}silver.', n));
  // every reason line in the file is a balloon of Glintstar's by `offer`, a word of the thirty, each once (silver twice)
  const by = {};
  ['f020', 'f021', 'f022'].forEach(id => frames[id].say.filter(b => b.when).forEach(b => [].concat(b.when.offer).forEach(w => { (by[w] = by[w] || []).push(id); })));
  assert.deepEqual(Object.keys(by).sort(), THIRTY.slice().sort());
  THIRTY.forEach(w => assert.equal(by[w].length, w === 'silver' ? 2 : ['mark', 'count', 'tally'].includes(w) ? 3 : 1, w));
  assert.deepEqual(frames.f022.say.filter(b => b.when && b.when.offer === 'silver').map(b => b.when), [{ offer: 'silver', nameHas: 'moon' }, { offer: 'silver', not: { nameHas: 'moon' } }]);
});

test('the Type screen: her own ending after her first part; each refusal said by a friend in the picture (the Clan cat’s by the cat whose name it is), another try on the same screen, nothing stored and no flag set; accepted, her ending and `ch11Named: "self"`', () => {
  assert.deepEqual(frames[TYPE].input, { kind: 'ending', refuse: REFUSE, sets: { ch11Named: 'self' }, next: NAMING });
  ['own', 'star', 'paw', 'kit'].forEach(k => assert.ok(castOf(TYPE, REFUSE[k].who).length, k + ': ' + REFUSE[k].who + ' in the picture'));
  ['tallyheart', 'thymeleaf', 'murmurchime'].forEach(w => assert.ok(castOf(TYPE, w).length, 'the Clan cat’s line: ' + w + ' in the picture'));
  assert.equal(UI.ending.PROMPT, 'Type your new ending.', 'the story’s Type line, the page’s prompt');
  const cases = [['Fern', 'heart', null], ['Fern', 'Stars', ['glintstar', REFUSE.star.text]], ['Fern', 'starss', ['glintstar', REFUSE.star.text]], ['Fern', 'paws', ['tallyheart', REFUSE.paw.text]],
    ['Fern', 'kitten', ['murmurchime', REFUSE.kit.text]], ['Fern', 'kitty', ['murmurchime', REFUSE.kit.text]], ['Fern', '', ['tallyheart', REFUSE.own.text]], ['Fern', '  42 ', ['tallyheart', REFUSE.own.text]],
    ['Fern', 'Fern', ['tallyheart', REFUSE.own.text]], ['Tally', 'heart', ['tallyheart', REFUSE.clan.text]], ['Thyme', 'leaf', ['thymeleaf', REFUSE.clan.text]], ['Glint', 'star', ['glintstar', REFUSE.star.text]],
    ['Murmur', 'chime', null], ['Fern', 'Big Heart', null], ['Fern', 'Fernheart', null], ['Fern', 'starlight', null], ['Fern', 'kittycat', null]];
  for (const [name, raw, want] of cases) {
    const cat = fresh({}, { name });
    read(cat, { stop: TYPE, pick: 'self' });
    assert.equal(E.frameId(cat, story), TYPE);
    const r = UI.ending.refusal(frames[TYPE].input, cat, raw);
    assert.deepEqual(r && [r.who, r.text], want, name + ' + ' + JSON.stringify(raw));
    const before = clone({ ending: cat.ending || null, flags: cat.flags });
    const ok = E.submitInput(cat, story, raw, 900);
    assert.equal(ok, !want, name + ' + ' + raw);
    if (want) {
      assert.deepEqual(clone({ ending: cat.ending || null, flags: cat.flags }), before, name + ' + ' + raw + ': nothing stored');
      assert.equal(E.frameId(cat, story), TYPE, 'the page stays');
      assert.ok(castOf(TYPE, r.who).length, r.who + ' says it, in the picture');
    } else {
      assert.equal(cat.flags.ch11Named, 'self');
      assert.equal(E.frameId(cat, story), NAMING);
      assert.equal(E.warriorName(cat), name + E.cleanEnding(raw, cat), name + ' + ' + raw);
    }
  }
  // what she typed is hers, canon or not (the guard is for the offers only); Big Heart after Fern is Fernbigheart
  const big = fresh({}, { name: 'Fern' }); read(big, { stop: TYPE, pick: 'self' }); E.submitInput(big, story, 'Big Heart', 900);
  assert.equal(E.warriorName(big), 'Fernbigheart');
  const holly = fresh({}, { name: 'Holly' }); read(holly, { stop: TYPE, pick: 'self' }); E.submitInput(holly, story, 'leaf', 900);
  assert.equal(E.warriorName(holly), 'Hollyleaf', 'a typed canon name is kept');
  // Back from the Type screen leaves the flag true to the name she has (none yet)
  const back = fresh({}, { name: 'Fern' }); read(back, { stop: TYPE, pick: 'self' });
  assert.equal(back.flags.ch11Named, undefined, '“I’ll name myself!” sets nothing');
  E.back(back, story);
  assert.equal(E.frameId(back, story), NAMES);
  assert.equal(back.ending, undefined);
});

test('“From tonight”: Glintstar says the whole name (“Your very own. I like it.” for a name she typed), Tallyheart’s promise for an offered one; a friend whose name ends so says so (heart, chime, leaf, pinecone, a typed plural too), none for an offered name', () => {
  const said = (id, cat) => E.balloons(frames[id], cat).map(b => b.who + ': ' + b.text);
  const caps = (id, cat) => E.captions(frames[id], cat);
  assert.deepEqual(said(NAMING, { name: 'Fern', ending: 'heart', flags: { ch11Named: 'self' } }), ['glintstar: {name}{ending}. Your very own. I like it.']);
  assert.deepEqual(said(NAMING, { name: 'Fern', ending: 'mist', flags: { ch11Named: 'offer' } }), ['glintstar: {name}{ending}.', 'tallyheart: A name with this moon in it. Like I promised.']);
  const LIKE = { heart: 'tallyheart: Like MINE?', hearts: 'tallyheart: Like MINE?', chime: 'murmurchime: Like MINE!', chimes: 'murmurchime: Like MINE!', leaf: 'thymeleaf: Leaf, like mine.',
    leafs: 'thymeleaf: Leaf, like mine.', leaves: 'thymeleaf: Leaf, like mine.', pinecone: 'grizzled: I KNEW it!', pinecones: 'grizzled: I KNEW it!' };
  Object.keys(LIKE).forEach(e => {
    const cat = { name: 'Fern', ending: e, flags: { ch11Named: 'self' } };
    assert.deepEqual(said('f027', cat), [LIKE[e], 'glintstar: Your warrior name. Say it.'], e);
    assert.deepEqual(caps('f027', cat), /^heart/.test(e) ? ['Tallyheart’s ears go straight up.'] : [], e);
  });
  for (const w of THIRTY) {
    const cat = { name: 'Fern', ending: w, flags: { ch11Named: 'offer' } };
    assert.deepEqual([said('f027', cat), caps('f027', cat)], [['glintstar: Your warrior name. Say it.'], []], w + ': an offered name, no friend’s line');
  }
  // through the engine: a typed “heart” gets “Like MINE?”, after the refusals she met on the way
  const cat = fresh({}, { name: 'Fern' });
  const rows = read(cat, { pick: 'self', type: ['paws', 'heart'], stop: 'f028' });
  assert.deepEqual(rowAt(rows, TYPE).refused.map(r => r.label + ': ' + r.text), ['Tallyheart: Paw? Not any more, you’re not! Try another.']);
  assert.deepEqual(rowAt(rows, 'f027').caps.concat(rowAt(rows, 'f027').say.map(b => b.label + ': ' + b.text)), ['Tallyheart’s ears go straight up.', 'Tallyheart: Like MINE?', 'Glintstar: Your warrior name. Say it.']);
  assert.deepEqual(rowAt(rows, NAMING).say.map(b => b.label + ': ' + b.text), ['Glintstar: Fernheart. Your very own. I like it.']);
});

test('her name: `{name}paw` before the naming (and in “{Murmur}paw became {Murmur}… CHIME.”), the offered names on the name screens, `{name}{ending}` from “From tonight” on; our cat’s balloons from then labelled `{name}{ending}`, none before; the paw thing’s counter too', () => {
  const NAMED = '{name}{ending}';
  ids.forEach(id => texts(frames[id]).forEach(x => {
    const names = String(x.text).match(/\{name\}(\{ending\}|[A-Za-z]+|…|\.)?/g) || [];
    names.forEach(n => {
      if (at(id) >= at(NAMING)) assert.equal(n, NAMED, id + ' ' + x.where + ': ' + x.text);
      else assert.ok(n === '{name}paw' || n === '{name}.' || n === '{name}…' || n === '{name}PINECONE' || THIRTY.some(w => n === '{name}' + w), id + ' ' + x.where + ': ' + n);
    });
    if (at(id) < at(NAMING)) assert.doesNotMatch(x.text, /\{ending\}/, id + ': no ending before the naming');
  }));
  assert.match(T('f019'), /\{Murmur\}paw became \{Murmur\}… CHIME\./);
  // her balloons: no label of their own before; `{name}{ending}` from the naming on, every one
  const mine = ids.map(id => (frames[id].say || []).filter(b => b.who === 'player').map(b => [id, b.name])).flat();
  mine.forEach(([id, n]) => assert.equal(n, at(id) >= at(NAMING) ? NAMED : undefined, id));
  assert.deepEqual(mine.filter(([id]) => at(id) >= at(NAMING)).map(([id]) => id), ['f028', 'f038', 'f045', 'f048', 'f051'], 'the spec’s five');
  // the paw thing's whispered counter: no balloon of hers on its frame, so the skip names it
  const paw = ids.find(id => frames[id].skip && frames[id].skip.paws === 'both');
  assert.equal(frames[paw].skip.name, NAMED);
  assert.equal(Sp.nameOn(E.balloons(frames[paw], {}), 'player'), undefined, 'nothing on the frame to take it from');
  assert.match(UI_SRC, /if \(sk\.name != null\) tname = sk\.name;/, 'the page tags the counter with the skip’s name');
  assert.ok(ids.filter(id => frames[id].skip).every(id => id === paw || frames[id].skip.name === undefined), 'no other skip carries a name');
  // as the page labels them: Fernpaw before, Fernheart after, the counter Fernheart; the Clan's calls “Every cat”
  const cat = { name: 'Fern', ending: 'heart', flags: {} }, cat0 = { name: 'Fern', flags: {} };
  assert.equal(labelFor({ who: 'player' }, cat0), 'Fernpaw');
  assert.equal(labelFor(frames.f010.say[0], cat0), 'Fernpaw');
  assert.equal(labelFor(frames.f028.say[0], cat), 'Fernheart');
  assert.equal(E.fill(frames[paw].skip.name, cat), 'Fernheart');
  assert.equal(E.fill(frames[paw].skip.name, cat0), 'Fernpaw', 'an unnamed cat (never here) would read {name}paw');
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'clancat').forEach(b => assert.equal(labelFor(b, cat), 'Every cat', id)));
});

/* ------------------------------------------------------------------ inputs, counts, skips, taps */

test('inputs, counts, skips and taps, in the story’s order, each as the spec has it', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['ending', 'dream'], 'her ending (naming herself only) and her dream');
  assert.deepEqual([frames[DREAM].input.next, frames.f057.next, frames.f058.end], ['f057', 'f058', true], 'the dream, then the story’s last screen in two panels, the end');
  assert.deepEqual([frames.f057.caption, frames.f058.caption], [['{name}{ending} sleeps.', 'Beside {them}, the mist stone waits for tonight’s moon, to say hello again.'], ['End of Chapter Eleven. {name}{ending}, warrior of CrystalClan.', 'THE END.']]);
  assert.equal(T(DREAM), 'What did {name}{ending} dream, in a warrior’s nest?');
  assert.deepEqual(frames[DREAM].input, { kind: 'dream', placeholder: 'A name… a moon… a pinecone…', next: 'f057' });
  assert.ok(frames[DREAM].input.placeholder.length <= 30);
  // one Counts frame: the morning count, its question the fact's own (`intro: false`)
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => [id, frames[id].counts]), [['f046', { set: 'ch11-pile', intro: false, next: 'f047' }]]);
  assert.ok(E.countsSet('ch11-pile', story, STORIES));
  // two counts by taps: the ears (eight cats, Tallyheart counting) and the paw thing (both forepaws, whispered)
  const skips = ids.filter(id => frames[id].skip);
  assert.deepEqual(skips, ['f011', 'f052']);
  const [ears, paws] = skips.map(id => frames[id].skip);
  assert.deepEqual(ears, { table: 2, groups: 8, who: EIGHT, teacher: 'tallyheart', label: 'Count the next cat.', prompt: '**Tap** the cats.', carry: false, next: 'f012' });
  assert.deepEqual(paws, { table: 10, groups: 5, thing: 'claw', things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', name: '{name}{ending}', next: 'f053' });
  assert.deepEqual(Object.assign({}, paws, { name: undefined, next: undefined }), Object.assign({}, ch04.frames.f118.skip, { name: undefined, next: undefined }), 'chapter 4’s bedtime tens exactly');
  assert.equal(E.skipView(ears, 8).count, '2… 4… 6… 8… 10… 12… 14… 16!');
  assert.equal(E.skipView(paws, 5).count, '10… 20… 30… 40… 50…', 'whispered, trailing off');
  const ew = E.skipWords(ears, 'tallyheart'), pw = E.skipWords(paws, null);
  assert.deepEqual([ew.teacher, ew.whisper, ew.label], ['tallyheart', false, 'Count the next cat.'], 'the ears in Tallyheart’s plain balloon');
  assert.deepEqual([pw.teacher, pw.whisper, pw.label], ['player', true, 'Tap your forepaws.'], 'the paw thing hers, whispered');
  assert.equal(E.skipWords(ears, 'player').teacher, 'tallyheart', 'her `teacher`: the screen’s first speaker never counts it');
  // the ears' eight: {Murmur}chime fourth, five Clan coats, never six, the old tom seventh, the cheeky apprentice eighth
  assert.equal(ears.who[3].who, 'murmurchime');
  const coats = ears.who.filter(w => w.who === 'clancat').map(w => w.variant);
  assert.deepEqual(coats, [1, 2, 3, 4, 5]);
  // no coat twice for any fur: a player in a Clan coat always has the sixth to swap to
  A.vocab.looks.fur.forEach(fur => {
    const drawn = coats.map(v => A.clanVariant(v, { fur }, coats));
    assert.equal(new Set(drawn).size, 5, fur + ': ' + drawn.join(' '));
  });
  // what the page turns to: the ears to “Sixteen!” (nothing kept up), the paw thing to the 50 she reached, big
  assert.equal(ears.carry, false);
  assert.match(T(ears.next), /^Sixteen! And every ear is pointing at you\./);
  assert.equal(E.skipInto(story, 'f012'), null, 'the ears keep nothing up');
  assert.equal(E.skipReached(E.skipInto(story, 'f053')), 50, 'the paw thing’s 50 on the page it turns to (chapter 4’s f119)');
  assert.match(frames.f053.board, /A big 50 floats over the moss/);
  // the pages she taps once (the spec's one-tap table)
  const taps = ids.filter(id => frames[id].scratch);
  const ONE = [
    ['f003', 'ears', '**Tap** to flatten your ears.', 'Flatten your ears.'], ['f006', 'stone', '**Tap** to take it with you, tucked close.', 'Take the mist stone.'],
    ['f012', 'paw', '**Tap** to step up, and set your mist stone down.', 'Step up.'], ['f019', 'ears', '**Tap** to hear them.', 'Listen.'],
    ['f030', 'nose', '**Tap** to bow, with tremendous dignity.', 'Bow.'], ['f031', 'tail', '**Tap** to lift your tail, high.', 'Lift your tail.'],
    ['f034', 'paw', '**Tap** to wave to Riffle.', 'Wave to Riffle.'], ['f038', 'stone', '**Tap** to hold it up to the moon.', 'Hold the stone up.'],
    ['f040', 'paw', '**Tap** to sit up, tall and still.', 'Sit up tall.'], ['f048', 'pinecone', '**Tap** to give it back.', 'Give the pinecone back.'],
    ['f049', 'stone', '**Tap** to lay your mist stone down.', 'Lay the stone on the moss.']
  ];
  assert.deepEqual(taps.map(id => [id, frames[id].scratch.tap, frames[id].scratch.prompt, frames[id].scratch.label]), ONE);
  taps.forEach(id => {
    assert.deepEqual(Object.keys(frames[id].scratch).sort(), ['label', 'next', 'prompt', 'tap'], id);
    assert.equal(frames[id].scratch.next, ids[at(id) + 1], id + ': to the next panel');
    assert.deepEqual(E.tapWords(frames[id]), { kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label }, id + ': no miss line: the glow wobbles');
  });
  // each Tap's answer drawn on the next panel where there is one to draw (the spec's section 7, item 2)
  assert.deepEqual([castOf('f013', 'tallyheart')[0].at, castOf('f013', 'player')[0].holdAt], [SPOTS.BESIDE, 'paws'], 'stepped up: Tallyheart right beside her, the stone set down');
  assert.ok(['player', 'tallyheart', 'murmurchime', 'thymeleaf', 'grizzled', 'snorer'].every(w => castOf('f032', w).every(c => c.tailUp)), 'every tail up with hers');
  assert.equal(castOf('f051', 'player').length && frames.f051.scene.opts.miststone, true, 'the stone laid on the moss');
  // the order of the things she does, on the page
  const order = ['f003', 'f006', 'f011', 'f012', VOW, 'f019', NAMES, TYPE, 'f030', 'f031', 'f034', 'f038', 'f040', 'f046', THANKS, 'f048', 'f049', 'f052', DREAM];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: one typed Count, two counts by taps, eleven one-tap pages, three choices, the Type screen naming herself
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    assert.deepEqual([p.filter(id => frames[id].counts).length, p.filter(id => frames[id].skip).length, p.filter(id => frames[id].scratch).length, p.filter(id => frames[id].choice).length,
      p.filter(id => frames[id].input).length], [1, 2, 11, 3, c.o.pick === 'self' ? 2 : 1], comboName(c));
  }
});

/* ------------------------------------------------------------------ speakers, tokens, words */

// the spec's chained balloons: a speaker given two paragraphs in a row
const CHAINED = ['f012:glintstar', 'f015:glintstar', 'f016:glintstar', 'f019:glintstar', 'f020:glintstar', 'f021:glintstar', 'f034:riffle', 'f037:waffles', 'f049:murmurchime'];

test('every balloon speaker is in that frame’s cast; a speaker’s lines on a panel are one balloon but the spec’s two-paragraph ones (exactly its list); balloons and captions are well formed', () => {
  ids.forEach(id => {
    const f = frames[id];
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok((b.who === 'clancat' && b.name === 'Every cat') || (b.who === 'player' && b.name === '{name}{ending}'), id + ' say ' + i + ': ' + b.who + ' named ' + b.name);
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
    texts(f).forEach(x => { if (x.when) { const keys = w => Object.keys(w).forEach(k => { if (k === 'not') keys(w.not); else assert.ok(FLAGS[k] || COMPUTED.includes(k), id + ' ' + x.where + ': when ' + k); }); keys(x.when); } });
  });
  // the chained balloons, for every reader (offered and her own, every row)
  const chained = new Set();
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), cat = p.cat;
    p.forEach(id => {
      const b = E.balloons(frames[id], cat);
      for (let i = 1; i < b.length; i++) if (b[i].who === b[i - 1].who) chained.add(id + ':' + b[i].who);
    });
  }
  assert.deepEqual([...chained].sort(), CHAINED);
  // a speaker's balloon written twice by `when` (Glintstar's name for her): exactly one shows to any reader
  for (const named of ['offer', 'self']) assert.equal(E.balloons(frames[NAMING], { name: 'Fern', ending: 'heart', flags: { ch11Named: named } }).filter(b => b.who === 'glintstar').length, 1, named);
  // the counts by taps: whoever keeps the count is in the picture
  ids.filter(id => frames[id].skip).forEach(id => {
    const who = E.skipWords(E.skipFor(frames[id].skip, { flags: {} }), ((frames[id].say || [])[0] || {}).who).teacher;
    assert.ok(castOf(id, who).length, id + ': ' + who + ' keeps the count, and is in the picture');
  });
});

test('balloon kinds as the spec has them: the whispers, the shouts, every other balloon plain; the speakers’ labels', () => {
  const WHISPER = [/^It’s time\.$/, /^Are you NERVOUS\?$/, /^Front row\./, /^Take your time\./, /^A name with this moon in it\./, /^player: \{name\}\{ending\}\.$/, /^Hello, Sprinkle\./, /^Not one\./, /^Mice…$/];
  const SHOUT = [/^WE WILL!$/, /^\{name\}\{ending\}! \{name\}\{ending\}!$/, /^Or \{name\}PINECONE!$/, /^Cats of CrystalClan!/, /^\{name\}\{ending\}! Best name EVER!$/, /^WHAT did they call/, /^TEN!$/];
  const kinds = { whisper: [], shout: [] };
  ids.forEach(id => (frames[id].say || []).forEach(b => {
    if (b.kind) kinds[b.kind].push(b.text);
    const w = WHISPER.some(re => re.test(b.text) || re.test(b.who + ': ' + b.text)), s = SHOUT.some(re => re.test(b.text));
    assert.equal(b.kind, w ? 'whisper' : s ? 'shout' : undefined, id + ': ' + b.text);
  }));
  assert.equal(kinds.whisper.length, WHISPER.length);
  assert.equal(kinds.shout.length, SHOUT.length);
  // who speaks, as the page labels them
  const who = {};
  ids.forEach(id => saidOn(story, id, Object.assign(E.blankCat({}), { name: 'Fern', ending: at(id) >= at(NAMING) ? 'heart' : undefined, flags: { ch11Named: 'self', ch10Best: 'counts' } }))
    .forEach(b => { (who[b.who] = who[b.who] || new Set()).add(b.label); }));
  assert.deepEqual(Object.fromEntries(Object.entries(who).map(([k, v]) => [k, [...v].sort()])), {
    player: ['Fernheart', 'Fernpaw'], tallyheart: ['Tallyheart'], glintstar: ['Glintstar'], grizzled: ['Grizzled old tom'], snorer: ['Snoring apprentice'], thymeleaf: ['Thymeleaf'],
    murmurchime: ['Murmurchime'], clancat: ['Every cat'], riffle: ['Riffle'], waffles: ['Princess Waffles']
  });
  // the grown-ups corner has words for the chapter's one flag
  assert.deepEqual(UI.flagWords.ch11Named, { offer: 'took one of the three names Glintstar saw in {them}', self: 'named {them}self' });
});

test('text tokens are only the allowed ones; `{ending}` only right after `{name}`', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = x.ok || (id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS);
    tokensIn(x.text).forEach(t => { if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}'); });
    const s = String(x.text);
    for (let i = s.indexOf('{ending}'); i >= 0; i = s.indexOf('{ending}', i + 1)) if (s.slice(Math.max(0, i - 6), i) !== '{name}') bad.push(id + ' ' + x.where + ': {ending} alone');
  });
  assert.deepEqual(bad, []);
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  // the book's {their}, {them}self: a she-cat's and a tom's
  const book = story.book.recap.map(r => r.text).join(' ');
  assert.match(fill(book, PROFILES['she-cat']), /On the evening Moonpaw passed her Warrior Counts/);
  assert.match(fill(book, PROFILES.tom), /On the evening Stormpaw passed his Warrior Counts/);
  assert.match(fill(book, PROFILES.self), /but he named himself Fernheart\./);
});

/* The most words a single reader sees on a frame: every reading of it (the flags its `when`s read, and her name). */
function maxWords(id) {
  let best = 0;
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    if (!p.includes(id)) continue;
    const cat = Object.assign({}, p.cat);
    if (at(id) < at(NAMING)) delete cat.ending;
    const f = frames[id];
    const n = E.captions(f, cat).concat(E.balloons(f, cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []).reduce((m, s) => m + words(s), 0);
    best = Math.max(best, n);
  }
  return best;
}

test('word counts: about 15 to 18 words of lettering a frame, few over 30 for any reader and never more than 50; no panel with five boxes; every reading under the brief’s 90 frames and about 1,000 words; never more than seven panels in a row with nothing to do', (t) => {
  const over = [];
  ids.forEach(id => {
    const m = maxWords(id);
    assert.ok(m <= WORDS_MAX, id + ' has ' + m + ' words for its wordiest reader');
    if (m > WORDS_AIM) over.push(id + ' (' + m + ')');
  });
  t.diagnostic('over 30 words for the wordiest reader: ' + over.join(', '));
  assert.ok(over.length <= 10, over.join(', '));
  const stats = [];
  for (const c of COMBOS) {
    const rows = walkLines(c.flags, c.o);
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(s), 0));
    const w = per.reduce((a, b) => a + b, 0);
    rows.forEach(r => assert.ok(r.boxes <= 4, r.id + ': ' + r.boxes + ' boxes for ' + comboName(c)));
    stats.push({ n: rows.length, w, avg: w / rows.length });
    // (the spec's cut of the final story: 56 or 57 frames, each the story's screen or its captions-first split)
    assert.ok(w / rows.length >= 15 && w / rows.length <= 19, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
    assert.ok(rows.length <= 90, comboName(c));
    let run = 0, worst = 0;
    rows.forEach(r => { run = r.kind === 'next' ? run + 1 : 0; worst = Math.max(worst, run); });
    assert.ok(worst <= 7, comboName(c) + ': ' + worst + ' panels in a row with nothing to do');
  }
  const mm = f => Math.min(...stats.map(f)).toFixed(1) + '–' + Math.max(...stats.map(f)).toFixed(1);
  t.diagnostic('frames ' + mm(x => x.n) + ', words ' + mm(x => x.w) + ', ' + mm(x => x.avg) + ' a frame');
  assert.ok(Math.max(...stats.map(x => x.w)) <= 1300, 'the brief’s 1,300 words, at most');
});

test('a caption the page can letter on the panel is 95 characters at most (the spec’s three long lines in two boxes, the purr’s at its comma)', () => {
  assert.deepEqual(ids.filter(id => (frames[id].caption || []).some(c => capText(c).length > 95)), []);
  const caps = re => frames[F(re)].caption.map(capText);
  assert.deepEqual(caps(/^The moon comes up over camp\./).slice(0, 2), ['The moon comes up over camp.', 'The dens, the ferns, the old stone fountain: everything is silver.']);
  assert.deepEqual(caps(/^\{name\}\{ending\} sleeps\./).slice(0, 2), ['{name}{ending} sleeps.', 'Beside {them}, the mist stone waits for tonight’s moon, to say hello again.']);
  assert.deepEqual(caps(/^One by one, the cats begin to purr/).slice(0, 2), ['One by one, the cats begin to purr, all round the ring,', 'until the whole camp is humming your new name.']);
});

test('every frame has a storyboard: a shot type in caps, then 2–5 sentences, no tokens, nothing an illustrator could draw as scary', () => {
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
    assert.doesNotMatch(b, /\b(teeth|fangs?|snarl\w*|blood|bleed\w*|claws? (out )?at|bites?|creep\w*|scary|frighten\w*|twolegs?|kittypets?|thunderpath|ironsnake|whisker-lengths?|starclan|vigil|dark)\b/i, id);
  });
  // the Type screen says who sees it; a Tap page says what the tap does in play; the Counts, the choices, the inputs
  assert.match(frames[TYPE].board.split('. ')[0], /ONLY FOR A CAT WHO NAMES HERSELF/);
  ids.filter(id => frames[id].skip || frames[id].scratch).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].choice).forEach(id => assert.match(frames[id].board, /THE CHOICE/, id));
  ids.filter(id => frames[id].input).forEach(id => assert.match(frames[id].board, /sits below the panel/, id));
});

test('rendered for a she-cat, a tom, a Murmur and a tom who named himself, every sentence reads right', (t) => {
  const problems = [];
  const print = !!process.env.PRINT_STORY;
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind];
    if (print) console.log('\n======== ' + kind + ': ' + p.name + 'paw, then ' + p.name + p.ending + ', called ' + p.petname);
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
  // a tom reads every line with he and him
  assert.equal(fill(frames.f014.say[0].text, PROFILES.tom), 'I was sure. Judge him by what he does, not by where he sleeps.');
  assert.equal(fill(frames.f016.say[1].text, PROFILES.tom), 'CrystalClan. Will you stand by Stormpaw, the way he stood by a friend in the dark?');
  assert.equal(fill(frames.f037.say[0].text, PROFILES.tom), 'WHAT did they call him? Speak UP, darlings! Is there a CROWN?');
  assert.equal(fill(frames.f037.say[1].text, PROFILES.tom), 'I shall still call him Sir Pounce-a-lot, of course.');
  assert.equal(fill(frames.f057.caption[1], PROFILES.tom), 'Beside him, the mist stone waits for tonight’s moon, to say hello again.');
  assert.equal(fill(T(DREAM), PROFILES.tom), 'What did Stormleap dream, in a warrior’s nest?');
  assert.equal(fill(frames.f019.say[0].text, PROFILES.murmur), 'I know you will. Your warrior name keeps Murmur. Only the paw goes, for a new ending. Mutterpaw became Mutter… CHIME.');
  assert.equal(fill(frames.f043.caption[2].text, PROFILES.murmur), 'You think of Riffle, and Sprinkle, and Tallyheart, and Mutterchime. Your friends.');
  assert.equal(fill(frames.f030.say[0].text, PROFILES['she-cat']), 'Cats of CrystalClan! Our newest warrior: Moonsilver!');
  // the engine fills the same way
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind], cat = E.blankCat({});
    cat.name = p.name; cat.ending = p.ending; cat.petname = p.petname; cat.look.sex = p.they === 'he' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
});

test('our own world and the tone: no Warriors or Wings of Fire words, no “StarClan”, “warriors’ den”, “vigil”, “Twoleg”, “kittypet”, “whisker-length” or “claw-length”; nobody new named; nobody hurt; the watch calm; no grown cat drawn laughing; the badger only in the teaser', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|medicine den|vigil|from this day|from this night|claw-moon|quarter-moon|half-moon|whisker-lengths?|claw-lengths?|fox-lengths?|tail-lengths?|silverpelt|great oak|fourtrees|moonstone|highrock)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, banned, id + ' board'));
  // the words the brief asks for: warrior, the ceremony, a warrior's nest, the watch
  const all = []; everyText((id, x) => all.push(x.text));
  ['warrior', 'a warrior’s nest', 'watch'].forEach(w => assert.ok(all.some(s => s.includes(w)), w));
  assert.ok(all.some(s => /ceremonies/.test(s)), 'Riffle’s ceremonies');
  // nobody new named: the balloons' names are the Clan's call and her own warrior name
  ids.forEach(id => (frames[id].say || []).forEach(b => { if (b.name) assert.ok(['Every cat', '{name}{ending}'].includes(b.name), id + ': ' + b.name); }));
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(bites?|bitten|teeth|fangs?|claws? at|snarls?|growls?|kill\w*|strikes?|attacks?|fights?|wound(ed)?|blood|bleed|die[sd]?|dead|death|bones?|drown\w*|creepy|scary|monster|afraid)\b/i, id + ' ' + x.where));
  // the moon's shape is never named in the words (the art draws it one evening past full)
  everyText((id, x) => assert.doesNotMatch(x.text, /full moon|half moon|crescent|waning/i, id + ' ' + x.where));
  // no grown cat in `laugh` (it draws tears), no mentor sad or scared
  ids.forEach(id => frames[id].scene.cast.filter(c => GROWN.includes(c.who)).forEach(c => assert.notEqual(c.mood, 'laugh', id + ': ' + c.who + ' laughing')));
  ids.forEach(id => frames[id].scene.cast.filter(c => ['tallyheart', 'glintstar', 'thymeleaf'].includes(c.who)).forEach(c => assert.ok(!['sad', 'scared'].includes(c.mood), id + ': ' + c.who + ' ' + c.mood)));
  ids.forEach(id => frames[id].scene.cast.forEach(c => assert.ok(!['scared', 'worried'].includes(c.mood), id + ': nobody worried tonight')));
  assert.equal(castOf(F(/Hmph\.$/), 'tallyheart')[0].mood, 'proud');
  // the badger: only the teaser's track (module 2's hook), never a cliffhanger
  assert.deepEqual(FF(/badger/i), []);
  assert.match(story.teaser.lines[0], /badger track/);
  // THE END last, warm in her nest
  assert.deepEqual(frames[ids[ids.length - 1]].caption.slice(-1), ['THE END.']);
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the story’s own: every caption, balloon, sound effect, option, refusal and Counts line is in docs/chapters/11-the-warrior-ceremony.md (an offered name’s `{name}<word>` one of its For us endings), and every line its screens speak is lettered', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/chapters/11-the-warrior-ceremony.md'), 'utf8');
  const from = doc.indexOf('# Chapter 11: The Warrior Ceremony'), to = doc.indexOf('\n*For us*');
  assert.ok(from === 0 && to > from, 'the story, from its title to its notes');
  const body = doc.slice(doc.indexOf('## Tonight'), to), forUs = doc.slice(to);
  const flat = s => s.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  const loose = s => s.replace(/[,.]/g, '').replace(/\s+/g, ' ').trim();
  const page = flat(body), pageLoose = loose(page);
  const spoken = body.split(/\n\s*\n/).map(p => (flat(p).match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).join(' ')).filter(Boolean).map(loose).join(' ¶ ');
  const inText = s => page.includes(s) || spoken.includes(loose(s)) || pageLoose.includes(loose(s));
  // an offered name, said or on its option: one of the thirty the story's For us lists, after her `{name}`
  const ENDINGS = forUs.match(/`ch10Best`: (.*?)\.\*/s)[1] + ' ' + forUs.match(/Every cat: (.*?)\./)[1];
  THIRTY.forEach(w => assert.match(ENDINGS, new RegExp('\\b' + w + '\\b'), 'For us lists ' + w));
  const named = s => s.replace(new RegExp(' \\{name\\}(' + THIRTY.join('|') + ')\\.$'), '');
  const bySentence = s => named(s).split(/(?<=[.!?…])\s+/).every(inText);
  const mine = [];
  ids.forEach(id => {
    const f = frames[id];
    (f.caption || []).forEach(c => { if (!inText(capText(c)) && !bySentence(capText(c))) mine.push(id + ': ' + capText(c)); });
    // (a word joiner keeps f048's leading ellipsis with its word on the page: not a letter of the story's)
    (f.say || []).map(b => Object.assign({}, b, { text: b.text.replace(/\u2060/g, '') })).forEach(b => { if (!inText(b.text) && !bySentence(b.text)) mine.push(id + ' ' + b.who + ': ' + b.text); });
    if (f.sfx && !page.includes(f.sfx.replace(/!$/, ''))) mine.push(id + ' sfx: ' + f.sfx);
    if (f.choice) f.choice.options.forEach(o => { if (!(o.ending && o.label === '{name}' + o.ending) && !page.includes(o.label.replace(/^“|”$/g, ''))) mine.push(id + ' option: ' + o.label); });
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '').replace(/!$/, '')), id + ': ' + f.scratch.prompt);
    if (f.skip) assert.ok(page.includes(f.skip.prompt.replace(/\*\*/g, '')), id + ': ' + f.skip.prompt);
    if (f.input && f.input.kind === 'ending') Object.values(f.input.refuse).forEach(r => { if (!inText(r.text) && !bySentence(r.text)) mine.push(id + ' refuse: ' + r.text); });
  });
  // the Counts set's lines, the right line and the help's words
  countsLines().forEach(x => { if (!inText(x.text) && !bySentence(x.text)) mine.push('counts ' + x.where + ': ' + x.text); });
  assert.deepEqual(mine, []);
  assert.ok(page.includes('Type your new ending.'), 'the Type screen’s prompt: the story’s Type line');
  assert.equal(E.chapterHeading(story), 'Chapter 11: The Warrior Ceremony');
  // and the other way: every line a screen of the story speaks is lettered somewhere in the chapter
  const lettered = [];
  everyText((id, x) => lettered.push(String(x.text).replace(/\*\*/g, '').replace(/\u2060/g, '')));
  const all = loose(lettered.join(' '));
  const missing = [];
  body.replace(/\*\*([^*]+)\*\*/g, ' ').replace(/\*[^*]*\*/g, ' ').split(/\n\s*\n/).forEach(p => {
    (p.replace(/\s+/g, ' ').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => { if (!all.includes(loose(q)) && !q.split(/(?<=[.!?…,])\s+/).every(s => all.includes(loose(s)))) missing.push(q); });
  });
  assert.deepEqual(missing, []);
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab), camera by camera: every anchor one of its camera’s own (but the staging’s spots), every option the set declares by value (the camp’s moon and the pile’s 15, the den’s 15 and `nextNest`), the cast, poses, moods and extras, each worn by whom the spec says', () => {
  const v = A.vocab;
  assert.equal(v.sets.camp.opts.moon, 'number', 'the camp’s moon (chapter 11)');
  assert.ok(v.sets.den.opts.moon.includes(15) && same(v.sets.den.opts.nextNest, [false, true]) && v.sets.den.anchors.includes('next-nest'), 'the den’s 15 and the next nest');
  const OLD = { holdAt: ['paws', 'mouth', 'chin'] };
  const seen = {}, spots = [];
  ids.forEach(id => {
    const s = frames[id].scene;
    assert.ok(s && typeof s === 'object', id + ': no scene');
    assert.deepEqual(Object.keys(s).filter(k => !['set', 'cam', 'opts', 'cast', 'fx'].includes(k)), [], id + ': scene keys');
    const set = v.sets[s.set], info = A.sceneInfo(s.set);
    assert.ok(set, id + ': unknown set ' + s.set);
    assert.ok(set.cams.includes(s.cam), id + ': set ' + s.set + ' has no camera ' + s.cam);
    assert.ok(['camp', 'den', 'pile', 'tower'].includes(s.set), id + ': the spec’s places');
    const mine = info.anchors[info.cams[s.cam].comp];
    Object.keys(s.opts || {}).forEach(k => {
      const allowed = set.opts[k];
      assert.ok(allowed, id + ': set ' + s.set + ' has no option ' + k);
      const val = s.opts[k];
      if (allowed === 'number') assert.equal(val, 15, id + ': ' + k + '=' + val + ': one evening past full');
      else assert.ok(Array.isArray(allowed) && allowed.some(x => same(x, val)), id + ': ' + k + '=' + JSON.stringify(val));
    });
    const used = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'variant'].concat(Object.keys(v.extras), Object.keys(OLD)).includes(k)), [], where + ': keys');
      assert.ok(v.cast.includes(c.who), where + ': unknown who');
      assert.ok(['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'murmurchime', 'clancat', 'thymeleaf', 'riffle'].includes(c.who), where + ': nobody new');
      Object.keys(v.extras).concat(Object.keys(OLD)).forEach(k => {
        if (c[k] === undefined) return;
        const vals = v.extras[k] || OLD[k];
        assert.ok(vals.some(x => same(x, c[k])), where + ': ' + k + '=' + JSON.stringify(c[k]));
        seen[k] = (seen[k] || 0) + 1;
      });
      // who wears what
      if (c.holds === 'miststone') assert.equal(c.who, 'player', where + ': the mist stone, hers');
      if (c.holds === 'pinecone') assert.ok(c.who === 'grizzled' || (c.who === 'player' && /Can I have my pinecone back\?/.test(T(id))), where + ': the old tom’s pinecone (hers to give back)');
      if (c.holds !== undefined) assert.ok(['miststone', 'pinecone'].includes(c.holds), where + ': ' + c.holds);
      if (c.holdAt !== undefined) assert.ok(c.holds, where + ': holdAt goes with holds');
      if (c.flash) assert.equal(c.holds, 'miststone', where + ': the stone flashes');
      if (c.tap !== undefined) {
        assert.ok(frames[id].scratch && frames[id].scratch.tap === c.tap, where + ': the tap mark is this page’s Tap');
        assert.equal(c.who, 'player', where + ': every Tap is on our cat');
        if (c.tap === 'tail') assert.ok(c.tailUp, where + ': the raised tail');
        if (c.tap === 'stone') assert.equal(c.holds, 'miststone', where);
        if (c.tap === 'pinecone') assert.equal(c.holds, 'pinecone', where);
        if (c.tap === 'nose') assert.equal(c.pose, 'crouch', where + ': her head dipped');
        if (c.tap === 'paw') assert.ok(['walk', 'sit', 'pawup'].includes(c.pose), where);
      }
      if (c.tailUp) assert.ok(c.tap === 'tail' || id === 'f032' || (c.who === 'tallyheart' && /her tail high/.test(T(id))), where + ': a raised tail to tap, every tail up, or Tallyheart’s in the first light');
      // asleep, curled; {Murmur}chime lies asleep in her nest, chin on her paws, so a tortie player is never her twin there
      if (c.asleep !== undefined) assert.ok(c.asleep === true && ['player', 'murmurchime', 'clancat'].includes(c.who) && (c.who === 'murmurchime' ? ['lie'] : ['curl']).includes(c.pose), where + ': asleep, curled (she lies)');
      const poses = CATS.includes(c.who) ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      if (typeof c.at === 'object') {
        assert.ok(Object.keys(c.at).every(k => ['x', 'y', 'h'].includes(k)) && 'x' in c.at && 'y' in c.at, where + ': a spot is { x, y } (with h, as the art gives them)');
        assert.ok(spotName(c.at) && camOf(id).startsWith('camp/'), where + ': one of the staging’s spots, in the camp: ' + JSON.stringify(c.at));
        spots.push(id + ':' + c.who + ':' + spotName(c.at));
      } else assert.ok(mine[c.at], where + ': ' + s.set + '/' + s.cam + ' has no anchor ' + c.at + ' (its own: ' + Object.keys(mine).join(' ') + ')');
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      if (c.variant !== undefined) {
        assert.ok(v.variants[c.who], where + ': only ' + Object.keys(v.variants).join('/') + ' have a variant');
        assert.ok(v.variants[c.who].includes(c.variant), where + ': variant ' + c.variant);
      } else assert.ok(!v.variants[c.who], where + ': a ' + c.who + ' says which one');
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), id + ': unknown fx ' + e));
    assert.ok(!s.fx.some(e => ['rain', 'lightning', 'bonk'].includes(e)), id + ': no storm');
  });
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'flash', 'holdAt', 'holds', 'tailUp', 'tap']);
  // the spots, each where the spec puts it: our cat at the fountain's foot from the step-up to the end of the watch,
  // Tallyheart beside her; the ring's front row and the walk in; the old tom and the grey tom behind {Murmur}chime;
  // Thymeleaf by the ferns; the old tom at her side; Tallyheart padding across in the first light
  const where = (who, spot) => spots.filter(s => s.endsWith(':' + who + ':' + spot)).map(s => s.split(':')[0]);
  assert.deepEqual(where('player', 'WALK_YOU'), ['f008']);
  assert.deepEqual(where('player', 'RING_YOU'), ['f009', 'f010', 'f011', 'f012']);
  assert.deepEqual(where('tallyheart', 'RING_TALLY'), ['f009', 'f010', 'f011', 'f012']);
  assert.deepEqual(where('player', 'FOOT'), ids.filter(id => at(id) >= at('f013') && at(id) <= at('f045') && !['f029', 'f030'].includes(id) && castOf(id, 'player').length));
  assert.deepEqual(where('player', 'BOW'), ['f029', 'f030'], 'her bounce and her bow, a step forward');
  assert.deepEqual(where('grizzled', 'BY_FOOT'), ['f040']);
  assert.deepEqual(where('thymeleaf', 'THYME'), ['f025', 'f027']);
  // (f032, the wide `purr` camera: full-sized at the set's own `ferns`, the review's; at THYME, sized for `crowd`'s box,
  // he stood in the foreground half the size of the cats behind him)
  assert.deepEqual(castOf('f032', 'thymeleaf').map(c => c.at), ['ferns']);
  assert.deepEqual(where('tallyheart', 'PAD'), ['f045']);
  assert.ok(where('grizzled', 'OLD').length >= 15 && where('snorer', 'GREY').length >= 15);
});

/* ------------------------------------------------------------------ staging */

test('staging, the camp by moonlight: `moon: 15` on every night camp frame (the ring’s `crowd` with it from the ring to the watch), never by day; the den’s 15 by night, none by morning; the pile’s 15 at the watch; the tower by night', () => {
  ids.forEach(id => {
    const s = frames[id].scene, night = at(id) < at(F(/^The sky turns pink, then gold\./));
    if (s.set === 'camp') {
      assert.equal(s.opts.moon, night ? 15 : undefined, id + ': the moon by night only');
      const ring = at(id) >= at('f007') && at(id) <= at('f040') && !['f015', 'f039'].includes(id);
      assert.equal(s.opts.crowd, ring ? true : undefined, id + ': the Clan in a ring, from the ring to the old tom’s pinecone');
      assert.deepEqual(Object.keys(s.opts).filter(k => !['moon', 'crowd'].includes(k)), [], id);
    }
    if (s.set === 'den') assert.equal(s.opts.moon, night ? 15 : undefined, id);
    if (s.set === 'pile') assert.deepEqual(s.opts, Object.assign({ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }, night ? { moon: 15 } : {}), id);
  });
  assert.deepEqual([camOf('f001'), frames.f001.scene.opts], ['camp/reveal', { moon: 15 }]);
  assert.ok(!castOf('f001', 'glintstar').length, 'nobody on the fountain yet');
  assert.deepEqual([camOf('f037'), frames.f037.scene.opts, frames.f037.scene.fx], ['tower/balcony', { chime: true }, ['night']]);
  assert.deepEqual([camOf('f042'), frames.f042.scene.cast], ['pile/wide', []], 'the pile by moonlight, nobody near it');
  // Glintstar's close-ups on the fountain top, the moon whole beside her (facing left: the camp draws it on her right)
  ['f015', 'f039'].forEach(id => assert.deepEqual([camOf(id), castOf(id, 'glintstar').map(c => [c.at, c.facing])], ['camp/fountain-close', [['fountain-top', 'left']]], id));
  // the purr and every tail up: the whole camp wide
  assert.deepEqual(['f031', 'f032'].map(camOf), ['camp/purr', 'camp/purr']);
  // (no sparkle on f032 or f038, the review's: the art scatters it round the first cast member, and one landed on
  // {Murmur}chime's yowling face and one on the old tom's eye)
  assert.deepEqual([frames.f031.scene.fx, frames.f032.scene.fx, frames.f038.scene.fx], [['night', 'purr'], ['night'], ['night']]);
});

test('staging, the opening and the ring: the apprentices’ den by moonlight, Tallyheart’s head at the doorway; the ring with Glintstar on the fountain, Thymeleaf by the ferns; our cat and Tallyheart into the front row, {Murmur}chime at the front as promised, the old tom and the grey tom squeezed in behind her', () => {
  // her old nest by moonlight, the mist stone on its moss till she takes it (the den draws it clear of Riffle's stone,
  // by her nose or under her chin; held at her paws on f006 it lay under Riffle's for a chin cat: the review's)
  const DEN15 = { weather: 'clear', moon: 15, stone: 'auto', bark: 'auto', hidden: true, glass: true, miststone: true };
  ['f002', 'f003', 'f004', 'f005'].forEach(id => assert.deepEqual([camOf(id), frames[id].scene.opts], ['den/inside', DEN15], id));
  // (she lifts it off the moss and holds it up, as on f049: the Tap on the stone itself. Sitting by it, her paw's Tap ring
  // lay on Riffle's stone for a chin cat: the fix round's check, in WebKit with the flag set)
  const { miststone: _onMoss, ...DEN15_OFF } = DEN15;
  assert.deepEqual([camOf('f006'), frames.f006.scene.opts, castOf('f006', 'player').map(c => [c.pose, c.holds, c.tap])], ['den/nest', DEN15_OFF, [['situp', 'miststone', 'stone']]], 'her old nest: she holds the stone up off the moss');
  assert.deepEqual(castOf('f002', 'tallyheart').map(c => [c.at, c.pose]), [['doorway', 'peer']]);
  assert.deepEqual(['f002', 'f003', 'f004', 'f005'].map(id => castOf(id, 'snorer')[0].pose), ['curl', 'sit', 'sit', 'sit'], 'the grey tom sits up');
  assert.deepEqual([camOf('f007'), castOf('f007', 'glintstar').map(c => [c.at, c.pose]), castOf('f007', 'thymeleaf').map(c => [c.at, c.mood])], ['camp/reveal', [['fountain-top', 'stand']], [['ferns', 'kind']]]);
  ['f008', 'f009', 'f010', 'f011', 'f012'].forEach(id => assert.deepEqual(castOf(id, 'murmurchime').map(c => c.at), ['crowd-right'], id + ': front row, as she promised'));
  // squeezed in on f009, they stay in the ring to the end of it (f012 lost them: the final review)
  ['f009', 'f010', 'f011', 'f012'].forEach(id => assert.deepEqual([castOf(id, 'grizzled').map(c => [spotName(c.at), c.holds]), castOf(id, 'snorer').map(c => spotName(c.at))], [[['OLD', 'pinecone']], ['GREY']], id));
  assert.deepEqual(castOf('f010', 'tallyheart').map(c => c.pose), ['stand'], 'her tail twitching');
  assert.deepEqual(castOf('f012', 'player').map(c => [c.pose, c.holds, c.holdAt]), [['walk', 'miststone', undefined]], 'stepping out, the stone in her mouth');
  // the ceremony: Glintstar on the fountain top on every camp panel of it, our cat at its foot, Tallyheart right beside her
  seq('f013', 'f040').filter(id => camOf(id) !== 'camp/fountain-close' && frames[id].scene.set === 'camp').forEach(id => {
    assert.deepEqual(castOf(id, 'glintstar').map(c => c.at), ['fountain-top'], id);
    assert.deepEqual(castOf(id, 'player').map(c => spotName(c.at)), [['f029', 'f030'].includes(id) ? 'BOW' : 'FOOT'], id);
    assert.deepEqual(castOf(id, 'tallyheart').map(c => spotName(c.at)), ['BESIDE'], id);
  });
  assert.deepEqual(castOf('f014', 'grizzled').map(c => c.mood), ['shy'], 'the old tom coughs, sheepish');
  ['f017', 'f031'].forEach(id => assert.equal(castOf(id, 'clancat').length, 1, id + ': a Clan cat in the picture, for every cat'));
  assert.deepEqual(castOf('f023', 'glintstar').concat(castOf('f023', 'tallyheart')).map(c => c.facing), ['right', 'right'], 'every cat looks at him');
  assert.deepEqual(castOf('f026', 'glintstar').map(c => c.pose), ['peer'], 'Glintstar looks down at her');
  assert.deepEqual(frames.f026.scene.fx, ['night', 'glow'], 'the moonlight all around her');
  assert.deepEqual([castOf('f029', 'player').map(c => c.pose), frames.f029.scene.fx, frames.f029.scene.cast[0].who], [['stand'], ['night', 'motion'], 'player'], 'her bounce: the motion lines hers');
  // (and the ring as on f028 and f030: nobody leaves the picture for the bounce, the review's)
  ['f028', 'f029', 'f030'].forEach(id => assert.deepEqual(['grizzled', 'snorer', 'murmurchime'].map(w => castOf(id, w).map(c => spotName(c.at) || c.at)), [['OLD'], ['GREY'], ['crowd-right']], id));
  assert.deepEqual([castOf('f030', 'glintstar').map(c => [c.pose, c.mood]), castOf('f030', 'player').map(c => c.pose)], [[['stand', 'shout']], ['crouch']]);
});

test('staging, the mist stone frame by frame: on the moss till she takes it, in her mouth walking, under her chin in the ring, at her paws at the fountain’s foot (grey), flashing from the moon finding it to the end of the watch, grey again by day, on the moss of her new nest once laid; the pinecone the old tom’s, set down at her side, hers to give back', () => {
  const stoneOf = id => castOf(id, 'player').map(c => c.holds === 'miststone' ? (c.holdAt || 'mouth') + (c.flash ? '+flash' : '') : c.holds || 'none')[0] || null;
  const want = id => {
    const n = num(id);
    if (n <= 5) return null;
    if (n === 6) return 'mouth';   // held up off the moss, as on f049
    if (n === 8 || n === 12) return 'mouth';
    if (n >= 9 && n <= 11) return 'chin';
    if (n >= 13 && n <= 37) return 'paws';
    if (n >= 38 && n <= 43) return 'paws+flash';
    if (n >= 44 && n <= 47) return 'paws';
    if (n === 48) return 'pinecone';
    if (n === 49) return 'mouth';   // held up in both forepaws, sitting up (the default hold: chapter 10's f152)
    return 'none';
  };
  ids.forEach(id => { if (castOf(id, 'player').length && frames[id].scene.set !== 'den' || ['f006', 'f049'].includes(id)) assert.equal(stoneOf(id), want(id), id); });
  // on the moss: in the old den till she takes it (f002 to f006), laid on her new nest's moss from f051, grey by day to the
  // last frame
  ids.filter(id => frames[id].scene.set === 'den').forEach(id => assert.equal(frames[id].scene.opts.miststone, num(id) >= 51 || num(id) <= 5 ? true : undefined, id));
  assert.deepEqual(castOf('f049', 'player').map(c => [c.pose, c.holds, c.holdAt, c.tap]), [['situp', 'miststone', undefined, 'stone']], 'her new nest: held up in both forepaws, clear of Riffle’s stone');
  seq('f051', 'f056').forEach(id => assert.equal(castOf(id, 'player')[0].holds, undefined, id + ': laid down'));
  // the pinecone: the old tom's in the ring, set down at her side (f040), not drawn through the watch, hers at dawn to give back
  ids.forEach(id => castOf(id, 'grizzled').forEach(c => assert.equal(c.holds, num(id) === 48 ? undefined : 'pinecone', id)));
  assert.deepEqual(castOf('f040', 'grizzled').map(c => [spotName(c.at), c.pose, c.holdAt, c.facing]), [['BY_FOOT', 'crouch', 'paws', 'right']]);
  seq('f041', 'f047').forEach(id => assert.equal(castOf(id, 'grizzled').length, 0, id + ': through the watch, the stone'));
});

test('staging, the watch and first light: the camp asleep (Clan cats curled at their dens), Tallyheart off to hers, our cat small at the fountain’s foot sitting tall; the pile; first light with no moon; Tallyheart across the camp, tail high; the morning count at the pile, the old tom at its left', () => {
  ['f041', 'f043', 'f044'].forEach(id => {
    assert.equal(camOf(id), 'camp/reveal', id);
    assert.deepEqual(castOf(id, 'clancat').map(c => [c.at, c.pose, c.asleep]), [['crowd-left', 'curl', true], ['crowd-right', 'curl', true]], id + ': asleep at the dens');
    // the sleeper by Tallyheart's den a brown tabby, never ginger: Tallyheart the only ginger cat by night and at first light
    assert.deepEqual(castOf(id, 'clancat').map(c => c.variant), [3, 1], id);
    assert.deepEqual(castOf(id, 'player').map(c => [spotName(c.at), c.pose]), [['FOOT', 'sit']], id);
  });
  assert.deepEqual(castOf('f041', 'tallyheart').map(c => [c.at, c.pose, c.mood]), [['ferns', 'walk', 'sleepy']]);
  assert.deepEqual(frames.f044.scene.fx, ['morning']);
  assert.deepEqual(castOf('f045', 'tallyheart').map(c => [spotName(c.at), c.pose, c.tailUp]), [['PAD', 'walk', true]]);
  ['f046', 'f047', 'f048'].forEach(id => {
    assert.deepEqual([camOf(id), castOf(id, 'tallyheart').map(c => c.at), castOf(id, 'player').map(c => c.at)], ['pile/rows', ['crowd-3'], ['beside']], id);
  });
  assert.deepEqual(castOf('f048', 'grizzled').map(c => [c.at, c.pose, c.mood]), [['pile-left', 'sit', 'happy']]);
});

test('staging, her warrior’s nest: the den’s nest close-up with `nextNest`, {Murmur}chime in the next nest at `next-nest`, her old nest’s things in her new one; the grey tom at the apprentices’ doorway; the stone close-up, grey by day; the closing frame the two of them asleep in their nests', () => {
  const DENW = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true };
  assert.deepEqual([camOf('f049'), frames.f049.scene.opts], ['den/nest', DENW]);
  seq('f051', 'f056').concat(['f058']).forEach(id => assert.deepEqual([camOf(id), frames[id].scene.opts], ['den/nest', Object.assign({}, DENW, { miststone: true })], id));
  ['f049'].concat(seq('f051', 'f056'), ['f058']).forEach(id => {
    assert.deepEqual(castOf(id, 'murmurchime').map(c => c.at), ['next-nest'], id + ': the next nest, never a raw spot');
    assert.deepEqual(castOf(id, 'player').map(c => c.at), ['nest'], id);
  });
  assert.deepEqual(castOf('f049', 'murmurchime').map(c => [c.pose, c.mood]), [['lie', 'sleepy']]);
  // asleep from “TEN!” on, lying chin on paws as on f049 with her eyes shut: curled, a tortie player's twin (the final review)
  seq('f051', 'f056').forEach(id => assert.deepEqual(castOf(id, 'murmurchime').map(c => [c.pose, c.asleep]), [['lie', true]], id + ': asleep from “TEN!” on'));
  assert.deepEqual(seq('f051', 'f056').map(id => castOf(id, 'player')[0].pose), ['sit', 'loaf', 'loaf', 'curl', 'curl', 'curl']);
  assert.deepEqual(seq('f055', 'f056').map(id => castOf(id, 'player')[0].asleep), [true, true]);
  assert.deepEqual([camOf('f050'), frames.f050.scene.opts, castOf('f050', 'snorer').map(c => [c.at, c.pose])], ['den/outside', { weather: 'clear' }, [['doorway', 'peer']]]);
  assert.deepEqual([camOf('f057'), frames.f057.scene.opts, castOf('f057', 'player').map(c => [c.at, c.pose, c.asleep])],
    ['den/stone', { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, miststone: true }, [['tail', 'curl', true]]], 'grey, not flashing: tonight’s moon is to come');
  // the closing frame in her nest: the two warriors asleep side by side
  const last = ids[ids.length - 1];
  // (our cat first, so the sparkle the art scatters round the first cast member is round the new warrior: the final review)
  assert.deepEqual([last, camOf(last), frames[last].scene.cast.map(c => [c.who, c.at, c.pose, c.asleep])], ['f058', 'den/nest', [['player', 'nest', 'curl', true], ['murmurchime', 'next-nest', 'lie', true]]]);
  ids.filter(id => frames[id].scene.fx.includes('sparkle')).forEach(id => assert.equal(frames[id].scene.cast[0].who, 'player', id + ': the sparkle round her'));
});

test('no two cats touch: the front row, our cat and Tallyheart at the fountain’s foot, the old tom setting his pinecone down, Thymeleaf by the ferns, and the two nests (f049, f051 to f056, f058)', { skip: !A.character && 'no cats.js' }, (t) => {
  let least = Infinity;
  const apart = (id, who1, who2, min) => {
    const b = boxesOn(id), p = b.find(x => x && x.m.who === who1), q = b.find(x => x && x.m.who === who2);
    assert.ok(p && q, id + ': ' + who1 + ' and ' + who2 + ' drawn where listed');
    const gap = gapOf(p.body, q.body);
    least = Math.min(least, gap);
    assert.ok(gap >= min, id + ': ' + who1 + ' and ' + who2 + ' apart (' + Math.round(gap) + ')');
  };
  ids.filter(id => frames[id].scene.set === 'camp' && castOf(id, 'player').length && castOf(id, 'tallyheart').length).forEach(id => {
    const pl = castOf(id, 'player')[0], ta = castOf(id, 'tallyheart')[0];
    if (['RING_YOU', 'WALK_YOU', 'FOOT', 'BOW'].includes(spotName(pl.at)) && ['RING_TALLY', 'WALK_TALLY', 'BESIDE'].includes(spotName(ta.at))) apart(id, 'player', 'tallyheart', 4);
  });
  apart('f040', 'grizzled', 'player', 4);
  ['f025', 'f027'].forEach(id => frames[id].scene.cast.filter(c => c.who !== 'thymeleaf' && c.at !== 'fountain-top').forEach(c => apart(id, 'thymeleaf', c.who, 4)));
  // f032: full-sized by the ferns, nearer than the ring; the grey tom sits behind his shoulder (the farther one, his face
  // clear of Thymeleaf's body), every other cat apart
  frames.f032.scene.cast.filter(c => !['thymeleaf', 'snorer'].includes(c.who) && c.at !== 'fountain-top').forEach(c => apart('f032', 'thymeleaf', c.who, 4));
  {
    const b = boxesOn('f032'), th = b.find(x => x && x.m.who === 'thymeleaf'), gr = b.find(x => x && x.m.who === 'snorer');
    const cx = (gr.head[0] + gr.head[2]) / 2, cy = (gr.head[1] + gr.head[3]) / 2;
    assert.ok(!(cx > th.body[0] && cx < th.body[2] && cy > th.body[1] && cy < th.body[3]) && b.indexOf(gr) < b.indexOf(th), 'f032: the grey tom behind Thymeleaf, his face clear');
  }
  ['f049'].concat(seq('f051', 'f056'), ['f058']).forEach(id => apart(id, 'murmurchime', 'player', 40));
  t.diagnostic('the nearest two: ' + Math.round(least));
});

/* The depth check (the hotfix's own): on every frame, where the farther of two cast members has a body that meets
 * the nearer one's head, the farther is drawn first (listed first); and every cast is listed back to front. */
test('staging, depth: a cast member further back is never drawn over a nearer one’s head; every cast listed back to front (the fountain top, raised, anywhere)', { skip: !A.character && 'no cats.js' }, () => {
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
    // (the bounce's first member, our cat, for the art's motion lines: f029; the three behind her sit at x 1130 and on)
    const ys = sc.cast.filter((c, i) => !(id === 'f029' && i === 0)).filter(c => typeof c.at === 'object' || (anchors[c.at] && !anchors[c.at].elev)).map(c => (typeof c.at === 'object' ? c.at : anchors[c.at]).y);
    for (let i = 1; i < ys.length; i++) assert.ok(ys[i] >= ys[i - 1] || sc.set === 'den', id + ': cast ' + i + ' further back than the one before it (' + ys.join(' ') + ')');
  });
  assert.deepEqual(bad, []);
});

// the time of day: the evening of her pass by night, the moon up, to the end of the watch; first light to the end
const DAYS = [['f001', 'f043', 'night'], ['f044', 'f058', 'morning']];
test('the time of day runs night from the moon coming up to the end of the watch, morning from first light to her sleep in a warrior’s nest; never dark', () => {
  ids.forEach(id => {
    const day = DAYS.find(([a, b]) => at(id) >= at(a) && at(id) <= at(b));
    assert.ok(day, id);
    assert.equal(frames[id].scene.fx.filter(x => ['morning', 'day', 'sunset', 'dusk', 'night'].includes(x)).join(), day[2], id);
  });
});

test('the storyboard is this chapter’s: every frame, the Type screen in its branch, the warrior name’s keys in words', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch11.md'), 'utf8');
  assert.match(md, /^# Storyboard: Chapter 11, The Warrior Ceremony/);
  ids.forEach(id => assert.match(md, new RegExp('^#{3,5} ' + id + '\\b', 'm'), id + ' in the storyboard'));
  assert.doesNotMatch(md, /Not reachable from the start/);
  assert.match(md, /\| Frames \| 58 /);
  assert.match(md, /`\{ending\}` is her warrior ending, `paw` until the Ceremony \(Fernpaw, then Fernheart\)\./, 'the legend says what {ending} is');
  assert.match(md, /\*\*Then she types her own ending\*\* after her name/);
  assert.match(md, /offer is "mist"/);
});

test('the shots vary like a graphic novel', () => {
  const shotOf = id => SHOTS.find(s => frames[id].board.startsWith(s));
  const used = new Set(ids.map(shotOf));
  ['WIDE', 'MEDIUM', 'CLOSE-UP', 'LOW ANGLE', 'INSERT', 'EXTREME CLOSE-UP'].forEach(s => assert.ok(used.has(s), s));
  let run = 0, worst = 0;
  ids.forEach((id, i) => { run = i && shotOf(id) === shotOf(ids[i - 1]) && camOf(id) === camOf(ids[i - 1]) ? run + 1 : 1; worst = Math.max(worst, run); });
  assert.ok(worst <= 13, 'the same shot on the same camera ' + worst + ' panels running');
  ['reveal', 'crowd', 'fountain-close', 'purr'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'camp/' + cam), cam));
  ['inside', 'nest', 'outside', 'stone'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'den/' + cam), cam));
});

/* ------------------------------------------------------------------ every frame drawn */

test('every frame renders, and everyone in the cast is in the picture; every Tap has its target in the art; the camp’s moon drawn by night, whole; the Counts pictures and the two counts by taps all draw', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'brown-tabby', marking: 'white-paws', eyes: 'odd' }, { sex: 'she', fur: 'tortie', marking: 'none', eyes: 'amber' }];
  const off = [];
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', ch10Best: 'truth', specialty: 'noticing' } });
  const SMALL = (id, who) => ['camp/reveal', 'camp/crowd', 'camp/purr', 'den/inside', 'den/outside', 'pile/rows'].includes(camOf(id));
  ids.forEach(id => looks.forEach((look, k) => {
    const f = frames[id], sc = E.resolveScene(f.scene, cat, STORIES), cast = sc.cast;
    const r = A.render(sc, { look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(r.svg), id + ': no svg');
    assert.ok(Array.isArray(r.heads) && r.heads.length === cast.length, id + ': heads');
    (f.say || []).forEach(b => assert.ok(cast.some((c, i) => c.who === b.who && r.heads[i]), id + ': speaker ' + b.who + ' has no head on the panel'));
    if (k === 0) cast.forEach((c, i) => {
      const h = r.heads[i];
      if (!h) { if (!(camOf(id) === 'den/stone' && c.at === 'tail')) off.push(id + ' ' + c.who + '@' + JSON.stringify(c.at) + ' (' + sc.set + '/' + sc.cam + ')'); }
      else {
        if (!SMALL(id, c.who)) assert.ok(h.r >= 3, id + ': ' + c.who + ' face radius ' + h.r);
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
    // the camp's moon: drawn on every night camp frame but the reveal's and crowd's lettering corner, whole in the camera
    if (k === 0 && sc.set === 'camp') assert.equal(/data-prop="camp-moon"/.test(r.svg), !!sc.opts.moon, id + ': the moon by night');
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
  // the stone flashing where the moon finds it, grey before
  const flashOf = id => /pc-miststone pc-flashing/.test(A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg);
  assert.deepEqual(['f037', 'f038', 'f040', 'f041', 'f043', 'f044'].map(id => castOf(id, 'player').length ? flashOf(id) : null), [null, true, true, true, true, false]);
  // the Counts picture: four rows of ten, unlit; lit by the help a row at a time
  const pics = [];
  const def = Object.assign({ id: 'ch11-pile' }, story.counts['ch11-pile']), st = E.counts.start(def, { set: 'ch11-pile' });
  const q = E.counts.question(st), D = E.questionDef(def, q, story, STORIES), pic = E.lessonPicture(D, q, 0);
  assert.deepEqual([pic.kind, pic.layout, pic.groups, pic.per, pic.highlight], ['prey', 'rows', 4, 10, 0]);
  pics.push(A.countsPicture(Object.assign({ look: looks[0] }, pic)));
  const r = E.counts.answer(st, D, 30, 2000, 1), plan = E.helpPlan(def, D, q, r);
  E.helpSteps(plan).forEach(s => pics.push(A.countsPicture(Object.assign({ look: looks[0] }, E.lessonPicture(D, q, s.counted)))));
  // the two counts by taps, tap by tap, the ears in a brown-tabby look too (no coat twice)
  ids.filter(id => frames[id].skip).forEach(id => { const sk = E.skipFor(frames[id].skip, cat); looks.forEach(look => { for (let n = 0; n <= sk.groups; n++) pics.push(A.countsPicture(Object.assign({ look }, E.skipPicture(sk, n)))); }); });
  pics.forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
  assert.ok(pics.length > 40, pics.length + ' pictures');
});

/* ------------------------------------------------------------------ the beats, on every path */

test('the chapter’s beats are all there, in order, on every path: every reader’s panels follow the story’s screens, the path-only lines exactly where her flags and her name say', () => {
  const B = [/^The moon comes up over camp\./, /^Tallyheart’s head pokes into the den\./, /^Across the den, the grey tom sits up\./, /^They pop right back up\./, /^Then he sighs\./, /^On the moss of your nest/,
    /^Every cat of CrystalClan sits in a ring/, /^You pad into the ring with Tallyheart\./, /^The old tom squeezes in behind her/, /Tallyheart’s tail is twitching\./, /^Eight cats, right in front of us\./,
    /^Sixteen!/, /^When you came to us from behind the glass/, /^The old tom coughs\./, /^So we did\./, /^And this morning, you answered every Count/, /^WE WILL!/, /^He didn’t\./,
    /^I know you will\./, /^Tallyheart told me what you’ll remember most\./, /^And what you do best\./, /^And one for this moon itself/, /^Every cat looks at him\./, /^Pick one\./,
    /^Glintstar looks down at you/, /Your warrior name\. Say it\./, /^\{name\}\{ending\}\.$/, /^It fits, like your own fur\./, /^Glintstar lifts her head high\./, /^One by one, the cats begin to purr/,
    /^\{Murmur\}chime yowls/, /^Tallyheart doesn’t yowl\./, /^The cheer rolls all the way down to the river\./, /^He tries to purr your name\./, /^Off he scampers/, /^Far above, Princess Waffles hears it too\./,
    /^The moon climbs over the fountain/, /^Welcome, warrior\./, /^The old tom leaves his pinecone beside you\./, /^Den by den, the camp falls asleep\./, /^The prey pile lies whole in the moonlight\./,
    /^The moon slides across the sky\./, /^The sky turns pink, then gold\./, /^Tallyheart pads across the camp/, /^Good morning, \{name\}\{ending\}\./, /^At \{Murmur\}chime’s Counts/, /^Tallyheart purrs\./,
    /^Your new nest is with the warriors now/, /^Across the camp, the grey tom pokes his head out/, /^TEN!$/, /^\{Murmur\}chime’s ear twitches\./, /^By fifty, the grey tom’s snoring\./, /^Some things never change\./,
    /^You’re \{name\}\{ending\}, a warrior of CrystalClan\./, /^What did \{name\}\{ending\} dream/, /^\{name\}\{ending\} sleeps\./, /^End of Chapter Eleven\./];
  for (const c of COMBOS) {
    const rows = walkLines(c.flags, c.o), name = comboName(c);
    const said = rows.map(r => r.lines.join(' ')), joined = said.join(' ¶ ');
    let i = 0;
    B.forEach(re => {
      const j = said.findIndex((s, k) => k >= i && re.test(s));
      assert.ok(j >= 0, name + ': ' + re + ' after ' + rows[Math.max(0, i - 1)].id);
      i = j + 1;
    });
    const self = c.o.pick === 'self', end = walk(c.flags, c.o).cat;
    assert.equal(/\{name\}… what\? A word you’re proud of\./.test(joined), self, name);
    assert.equal(/Your very own\. I like it\./.test(joined), self, name);
    assert.equal(/A name with this moon in it\. Like I promised\./.test(joined), !self, name);
    assert.equal(/Like MINE\?/.test(joined), /^hearts?$/.test(end.ending), name);
    assert.equal(/Leaf, like mine\./.test(joined), /^(leaf|leafs|leaves)$/.test(end.ending), name);
    assert.equal(/I KNEW it!/.test(joined), /^pinecones?$/.test(end.ending), name);
    const worry = { small: /So many cats\. You sit up very tall/, water: /The river glints in the moonlight\./, talk: /Tonight, you only need two words\./, shiny: /Everything is silver\. You look all you like\./ };
    Object.keys(worry).forEach(w => assert.equal(worry[w].test(joined), c.flags.worry === w, name + ': ' + w));
    const thought = { sprinkle: /Somewhere upriver, Sprinkle is asleep/, friends: /You think of Riffle, and Sprinkle/, truth: /You think of the Gathering\./, counts: /You count the stars\./ };
    Object.keys(thought).forEach(b => assert.equal(thought[b].test(joined), c.flags.ch10Best === b, name + ': ' + b));
    assert.equal(/Riffle’s stone is by your nose\./.test(joined), c.flags.ch2Stone === 'nose', name);
    assert.equal(/Riffle’s stone is under your chin\./.test(joined), c.flags.ch2Stone === 'chin', name);
    assert.equal(/The Counts\. Of COURSE\./.test(joined), c.flags.ch10Best === 'counts', name);
  }
});

/* ------------------------------------------------------------------ counts */

const TH = text => ({ who: 'tallyheart', text });
const ROWS_LINE = 'Let’s count it, a row at a time.';

test('counts: the morning count exactly as the spec has it (section 2), and the lesson kit: no lesson, no new Count; one typed answer on every reading', () => {
  assert.deepEqual(Object.keys(story.counts), ['ch11-pile']);
  assert.deepEqual(story.counts['ch11-pile'], {
    table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart', ask: '{a} × {b}',
    picture: { kind: 'prey', layout: 'rows' }, help: 'picture',
    facts: [{ a: 4, b: 10, prompt: [TH('Your first morning count as a warrior. How many pieces in the pile?')], retryPrompt: true,
      right: [{ kind: 'caption', text: 'Forty. Not one piece gone.' }], rightAgain: true }],
    praise: [], helpIntro: ROWS_LINE, helpIntroFar: ROWS_LINE, againIntro: 'The rows again.', miss: 'There.', missLast: 'Forty. All there.', done: null
  });
  // the Counts claims of section 2, pinned: no new Count, the 10s still chapter 4's, the question read under its prompt
  assert.deepEqual(E.countSets(STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes'], [6, 'ch07-sixes'], [4, 'ch08-fours'], [8, 'ch09-eights'], [7, 'ch10-sevens']]);
  assert.equal(E.countFor(10, STORIES).setId, 'ch04-tens');
  assert.equal(E.readFirst({ set: 'ch11-pile', a: 4, b: 10, correct: true }, STORIES), true, 'read under her question: a slow right never makes it hard');
  assert.equal(E.tableOf({ set: 'ch11-pile', a: 4, b: 10 }, STORIES), 10, 'filed under the 10s');
  assert.deepEqual(E.learnedCounts({ counts: [], flags: {}, lessons: { 'ch11-pile': { finished: true } } }, STORIES), [], 'finishing it learns no Count');
  assert.deepEqual(E.hollowDef(STORIES, 10), E.hollowDef(STORIES.slice(0, 10), 10), 'the Hollow’s tens as they were');
  // a slow right is never hard; a miss is
  const slow = { counts: [{ set: 'ch11-pile', a: 4, b: 10, correct: true, ms: 9000, at: 1 }], flags: {}, lessons: {} };
  const missed = { counts: [{ set: 'ch11-pile', a: 4, b: 10, correct: false, ms: 9000, at: 1 }, { set: 'ch11-pile', a: 4, b: 10, correct: true, retry: true, ms: 2000, at: 2 }], flags: {}, lessons: {} };
  assert.deepEqual([E.hardFacts(slow, 10, STORIES), E.hardFacts(missed, 10, STORIES).length], [[], 1]);
  // its lines short and whole, fit for both sexes
  countsLines().forEach(x => {
    assert.ok(words(x.text) <= 18, x.where + ': ' + x.text);
    assert.ok(E.endsSentence(x.text), x.where + ': a whole sentence');
    if (x.who) assert.equal(x.who, 'tallyheart', x.where);
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.where));
  });
  // the voices in the picture: Tallyheart on the Counts frame
  assert.ok(castOf('f046', 'tallyheart').length);
});

test('the morning count, every pattern (the spec’s run): right; one miss then right; two misses then right; three misses, the help and “Forty. All there.”; the rows lit a row at a time in Tallyheart’s count; her question each time, never a wall', () => {
  const run = misses => { const cat = before11({}); return play(cat, 'ch11-pile', { '4x10': Array(misses).fill(30) }); };
  const r0 = run(0);
  assert.deepEqual(ks(r0), ['4x10']);
  assert.deepEqual(r0[0].prompt.map(p => p.label + ': ' + p.text), ['Tallyheart: Your first morning count as a warrior. How many pieces in the pile?']);
  assert.deepEqual([r0[0].line, r0[0].balloons.map(b => (b.kind || '') + ':' + b.text)], ['', ['caption:Forty. Not one piece gone.']]);
  assert.deepEqual([r0[0].picture.groups, r0[0].picture.per, r0[0].picture.highlight], [4, 10, 0]);
  const r1 = run(1);
  assert.deepEqual(ks(r1), ['4x10✗', 'R:4x10']);
  assert.equal(r1[0].help.intro, ROWS_LINE);
  assert.deepEqual([r1[0].help.picture, r1[0].help.nums, r1[0].line], [true, [10, 20, 30, 40], 'There.']);
  assert.equal(E.teacherOf(story.counts['ch11-pile'], r1[0].D), 'tallyheart', 'Tallyheart counts it');
  assert.deepEqual(r1[1].prompt.map(p => p.text), ['The rows again.', 'Your first morning count as a warrior. How many pieces in the pile?'], 'straight back, no fillers');
  assert.deepEqual(r1[1].balloons.map(b => b.text), ['Forty. Not one piece gone.'], '`rightAgain`: a cat who needed help still gets the right line');
  const r2 = run(2);
  assert.deepEqual(ks(r2), ['4x10✗', 'R:4x10✗', 'R:4x10']);
  assert.deepEqual(r2[2].balloons.map(b => b.text), ['Forty. Not one piece gone.']);
  const r3 = run(3);
  assert.deepEqual(ks(r3), ['4x10✗', 'R:4x10✗', 'R:4x10✗']);
  assert.deepEqual([r3[2].line, r3[2].res.done], ['Forty. All there.', true], 'the third miss: the help, its last line, and the lesson ends');
  [r0, r1, r2, r3].forEach(rows => rows.forEach(r => assert.ok(!r.q.filler, 'no fillers: one fact, nothing to lend')));
  // far off, the same words (one row of ten is never “Close.”)
  assert.equal(run(0).length, 1);
  const far = (() => { const cat = before11({}); return play(cat, 'ch11-pile', { '4x10': [400] }); })();
  assert.equal(far[0].help.intro, ROWS_LINE);
});

test('the counts by taps log nothing, nor do the one-tap pages, the choices or the Type screen: one typed answer on every reading', () => {
  for (const [flags, o] of [[{}, { pick: 0 }], [{ worry: 'water', ch10Best: 'counts' }, { pick: 'self', type: ['stars', 'heart'] }], [{ specialty: 'climbing' }, { pick: 2, answers: { '4x10': [30, 30] } }]]) {
    const cat = fresh(flags), n0 = cat.counts.length;
    const rows = read(cat, o);
    rows.forEach((x, i) => { if (['skip', 'scratch', 'next', 'choice', 'input'].includes(x.kind) && rows[i + 1]) assert.equal(rows[i + 1].counts, x.counts, x.id + ' logs nothing'); });
    assert.deepEqual(rows.filter(x => x.kind === 'skip').map(x => [x.skip.table, x.skip.groups]), [[2, 8], [10, 5]]);
    assert.equal(cat.counts.length - n0, 1 + ((o.answers || {})['4x10'] || []).length, JSON.stringify(flags) + ': typed answers');
  }
});

test('(the spec’s section 7, item 14) a cat who passed, began a re-sit and left it within two hours: Tallyheart’s waiting line is the Hollow’s, which the morning count opens on; one answer sets the re-sit aside', () => {
  const S = PC.story, W = PC.warrior;
  const cat = before11({});
  cat.finished[W.after] = 20;
  let t = Date.UTC(2026, 10, 9, 15);
  const sit = stop => {
    const r = E.warriorBegin(cat, S, t), st = r.state;
    let n = 0;
    while (!E.counts.done(st) && (stop == null || n < stop)) {
      const q = E.counts.question(st), D = E.warriorAsk(r.def, st, q, S);
      t += 8000;
      const res = E.counts.answer(st, D, q.a * q.b, 2500, t);
      E.logAnswer(cat, res.entry);
      if (res.done) E.recordLesson(cat, st); else E.warriorKeep(cat, st, t);
      n++;
    }
  };
  sit(null);
  E.warriorSeen(cat);
  assert.equal(E.warriorState(cat, S, t).passed, true, 'passed');
  t += 86400000;
  sit(5);
  assert.equal(E.hollowLines(cat, S, { now: t + 60000 }).waiting, E.WARRIOR_WAITING);
  const L = E.chapterLesson(cat, story, 'ch11-pile', t + 120000, E.chapters(S));
  const q = E.counts.question(L.state);
  E.logAnswer(cat, E.counts.answer(L.state, L.def, 40, 2500, t + 130000).entry);
  assert.deepEqual([q.a, q.b], [4, 10]);
  assert.equal(E.warriorState(cat, S, t + 140000).stale, 'practice');
});

/* ------------------------------------------------------------------ the book and the teaser */

function recapFor(flags) { return story.book.recap.filter(x => !x.when || E.matches(x.when, { flags })); }
const sentences = s => s.split(/(?<=[.!?])\s+(?=\p{Lu}|\{|“)/u).length;

test('book: title, chapter title, seven entries on every reading (one by how she was named), seven sentences, true on each; the dream and the night it stayed a secret, by her warrior name', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['chapterTitle', 'dream', 'noDream', 'recap', 'title']);
  assert.equal(b.title, ch01.book.title, 'the whole book’s title stays chapter 1’s, the apprentice’s first moon');
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'The Warrior Ceremony');
  assert.equal(b.dream, '{name}{ending}’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}{ending}’s first dream in a warrior’s nest stayed a secret.');
  b.recap.forEach((x, i) => {
    assert.deepEqual(Object.keys(x).filter(k => !['text', 'when'].includes(k)), [], 'recap ' + i);
    if (x.when) assert.ok(same(x.when, { ch11Named: 'offer' }) || same(x.when, { ch11Named: 'self' }), 'recap ' + i);
    assert.match(x.text, /[.!?”’]$/);
    assert.ok(words(x.text) <= 32, 'recap ' + i + ': ' + words(x.text));
    assert.doesNotMatch(x.text, /\byou\b/i, 'third person');
  });
  for (const named of ['offer', 'self']) {
    const rc = recapFor({ ch11Named: named });
    assert.equal(rc.length, 7, named);
    const s = rc.reduce((m, x) => m + sentences(x.text), 0);
    assert.ok(s >= 6 && s <= 10, named + ': ' + s + ' sentences');
    const all = rc.map(x => x.text).join(' ');
    assert.equal(/named \{them\}self/.test(all), named === 'self', named);
    assert.equal(/\{they\} chose \{name\}\{ending\}/.test(all), named === 'offer', named);
    assert.match(all, /forty, not one piece gone/);
    assert.match(all, /warrior’s nest/);
  }
  // a she-cat's page, offered, and a tom's, typed, through the engine
  const page = (cat, id) => E.buildFullBook(cat, STORIES).pages.find(p => p.id === id);
  const she = fresh({ ch10Best: 'sprinkle' }, { name: 'Fern' });
  read(she, { pick: 0 });
  assert.equal(page(she, 'ch11').heading, 'Chapter 11: The Warrior Ceremony');
  assert.equal(page(she, 'ch11').recap.length, 7);
  assert.match(page(she, 'ch11').recap.join(' '), /Glintstar saw three names in Fernpaw, and she chose Fernmist\./);
  assert.equal(page(she, 'ch11').dream, 'Fernmist’s dream: “A name in the moonlight.”');
  const tom = fresh({}, { name: 'Storm', sex: 'tom' });
  read(tom, { pick: 'self', type: ['kits', 'heart'], dream: '' });
  assert.match(page(tom, 'ch11').recap.join(' '), /Glintstar saw three names in Stormpaw, but he named himself Stormheart\./);
  assert.match(page(tom, 'ch11').recap.join(' '), /^On the evening Stormpaw passed his Warrior Counts/);
  assert.doesNotMatch(page(tom, 'ch11').recap.join(' '), /[{}]/);
  assert.equal(page(tom, 'ch11').dream, 'Stormheart’s first dream in a warrior’s nest stayed a secret.');
  assert.equal(E.buildBook(ch10, tom).chapter, 'Chapter 10: The Gathering', 'the pages before are as they were');
  assert.match(E.buildBook(ch10, tom).recap.join(' '), /Stormpaw/, 'chapter 10’s page keeps {name}paw: it happened before');
});

test('the teaser is module 2’s: “A new adventure” (the hub’s “A new adventure is coming soon”), the badger’s old track, no number; chapter 10’s teaser leads here now', () => {
  assert.deepEqual(story.teaser, { title: 'A new adventure', lines: ['Out on Gathering Island, an old badger track lies in the mud. Who made it? Another day.'] });
  assert.doesNotMatch(story.teaser.lines.join(' '), /\d/);
  const cat = E.blankCat({}); cat.name = 'Moon';
  assert.deepEqual(E.teaser(story, cat, PC.story), { title: 'A new adventure', lines: story.teaser.lines, built: false, next: null }, 'no chapter 12 yet');
  // chapter 10's teaser stays as it is, and now has its chapter (the spec's section 10)
  assert.deepEqual(ch10.teaser, { title: 'The Warrior Ceremony', lines: ['Pass your Warrior Counts, and the Clan will gather for your name.'] });
  assert.deepEqual(E.teaser(ch10, cat, PC.story), { title: 'The Warrior Ceremony', lines: ch10.teaser.lines, built: true, next: 'ch11' });
  assert.equal(E.chapterHeading(story), 'Chapter 11: ' + ch10.teaser.title);
});

test('her pass opens the Ceremony, and finishing it: her warrior name on the page (the bar, the hub), the hub’s teasers back with module 2’s, “Your ceremony is coming soon.” gone, her book and Case File titles kept', () => {
  const S = PC.story, W = PC.warrior, U = UI.warrior;
  const cat = before11({ ch10Best: 'friends', specialty: 'swimming' }, { name: 'Fern' });
  cat.finished[W.after] = 20;
  let t = Date.UTC(2026, 10, 9, 15);
  assert.equal(E.isOpen(cat, story, S), false, 'not before her pass');
  const r = E.warriorBegin(cat, S, t), st = r.state;
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), D = E.warriorAsk(r.def, st, q, S);
    t += 8000;
    const res = E.counts.answer(st, D, q.a * q.b, 2500, t);
    E.logAnswer(cat, res.entry);
    if (res.done) E.recordLesson(cat, st); else E.warriorKeep(cat, st, t);
  }
  E.warriorSeen(cat);
  assert.equal(E.isOpen(cat, story, S), true, 'passed: the Ceremony opens');
  let p = E.progress(cat, S);
  assert.equal(p.next && p.next.id, 'ch11');
  assert.equal(U.hub(E.warriorState(cat, S, t), Object.assign({}, p, { ceremonyBuilt: true })).hideSoon, true, 'before it, the teasers hidden as the Counts left them');
  E.startChapter(cat, story, t);
  read(cat, { pick: 1, t });
  assert.ok(E.isFinished(cat, 'ch11'));
  assert.equal(cat.ending, 'splash');
  assert.deepEqual([E.warriorName(cat), E.displayName(cat), E.clanName(cat)], ['Fernsplash', 'Fernsplash', 'Fernpaw']);
  p = E.progress(cat, S);
  const h = U.hub(E.warriorState(cat, S, t), Object.assign({}, p, { ceremonyBuilt: true }));
  assert.deepEqual([p.next, p.soon && p.soon.title, h.hideSoon], [null, 'A new adventure', false], 'the hub: “A new adventure is coming soon”');
  const book = E.buildFullBook(cat, S);
  assert.deepEqual([book.teaser && book.teaser.title, book.pages[book.pages.length - 1].id], ['A new adventure', 'ch11'], 'her book: module 2’s teaser after the Ceremony’s page, no “Your ceremony is coming soon.”');
  assert.equal(E.fill(story.book.title, cat), 'Fernpaw’s First Moon', 'the book’s title: the apprentice’s first moon');
  assert.equal(E.status(cat, S), 'Chapter 11 finished');
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean; chapters 1 to 10 are sound beside it', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  STORIES.slice(0, 10).forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id));
});

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, her name, the flag, the lesson, the taps, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) {
    const name = comboName(c);
    const cat = fresh(c.flags, { name: c.o.name, sex: c.o.sex });
    const counted = cat.counts.length, flags0 = Object.assign({}, cat.flags);
    const rows = read(cat, Object.assign({}, c.o));
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch11'), name);
    assert.deepEqual(idsOf(rows), walk(flags0, c.o).slice(), name + ': the engine walks the same frames');
    // her name: three offered or her own; the flag says which, the only flag set
    const end = walk(flags0, c.o).cat;
    assert.equal(cat.ending, end.ending, name);
    if (c.o.pick === 'self') assert.equal(cat.ending, E.cleanEnding(typedFor(c.o, cat).ok, cat), name);
    else assert.equal(cat.ending, E.warriorOffers(cat)[c.o.pick], name);
    assert.deepEqual(Object.keys(cat.flags).filter(k => cat.flags[k] !== flags0[k]), ['ch11Named'], name + ': no other flag is set');
    assert.equal(cat.flags.ch11Named, c.o.pick === 'self' ? 'self' : 'offer', name);
    // the lesson, one typed answer; the dream; the status; the book
    assert.ok(cat.lessons['ch11-pile'].finished && cat.lessons['ch11-pile'].noHelp, name);
    assert.equal(cat.counts.length - counted, 1, name + ': the typed answer; the taps never logged');
    assert.equal(cat.dreams.ch11, 'a name in the moonlight');
    assert.equal(E.status(cat, STORIES), 'Chapter 11 finished');
    assert.equal(E.buildBook(story, cat).recap.length, 7, name);
    assert.doesNotMatch(E.buildBook(story, cat).recap.join(' ') + E.buildBook(story, cat).dream, /[{}]/, name + ': the book, every token filled');
    // every label and line filled; her name on her balloons after the naming
    rows.forEach(x => x.say.forEach(bl => assert.ok(bl.label && !/[{}]/.test(bl.label + bl.text), name + ' ' + x.id + ': ' + bl.label + ': ' + bl.text)));
    rows.forEach(x => assert.ok(!x.heard.some(h => /[{}]/.test(h)), name + ' ' + x.id));
    rows.filter(x => at(x.id) >= at(NAMING)).forEach(x => x.say.filter(b => b.who === 'player').forEach(b => assert.equal(b.label, E.warriorName(cat), name + ' ' + x.id)));
    rows.filter(x => at(x.id) < at(NAMING)).forEach(x => x.say.filter(b => b.who === 'player').forEach(b => assert.equal(b.label, c.o.name + 'paw', name + ' ' + x.id)));
    // the den's stone where she put it in chapter 2
    rows.filter(x => x.scene && x.scene.set === 'den' && frames[x.id].scene.opts.stone).forEach(x => assert.equal(x.scene.opts.stone, c.flags.ch2Stone, x.id));
    assert.ok(E.back(cat, story));
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 60);
  // a save in the middle of the ceremony and one after the naming go through the store's own shape and come back the same cat
  for (const stop of ['f020', 'f040']) {
    const mid = fresh({ specialty: 'climbing' }, { name: 'Fox' });
    read(mid, { stop, pick: 0 });
    const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
    assert.deepEqual([back.flags, back.frame, back.ending], [mid.flags, mid.frame, mid.ending], stop);
    assert.deepEqual(idsOf(read(back, { pick: 0 })), idsOf(read(mid, { pick: 0 })), stop + ': and reads on to the same end');
  }
  // Back over the name choice and another pick: the flag and the ending replaced
  const re = fresh({}, { name: 'Moon' });
  read(re, { stop: 'f027', pick: 'self', type: ['heart'] });
  assert.deepEqual([re.ending, re.flags.ch11Named], ['heart', 'self']);
  while (E.frameId(re, story) !== NAMES) assert.ok(E.back(re, story));
  assert.ok(E.choose(re, story, E.options(frames[NAMES], re)[0].index, 9000));
  assert.deepEqual([re.ending, re.flags.ch11Named, E.frameId(re, story)], ['true', 'offer', NAMING], 'her first offer (finding the truth)');
  // the Type screen's first value: a name she typed comes back to be changed, an offered one never
  assert.equal(UI.ending.prefill(Object.assign({}, re, { ending: 'true' })), '', 'one of her offers: never handed back as typed');
  assert.equal(UI.ending.prefill(Object.assign({}, re, { ending: 'heart' })), '', 'an offered name (`ch11Named: "offer"`) is never handed back, whatever its word');
  assert.equal(UI.ending.prefill(Object.assign({}, re, { ending: 'heart', flags: Object.assign({}, re.flags, { ch11Named: 'self' }) })), 'heart', 'one she typed comes back');
});

/* ------------------------------------------------------------------ the review's round (2026-11-01, the integrator's) */

// her name in lettering: ui.js's richN, run as the page runs it (its source and rich's, with a cat), and where it is used
function richNFor(catName, more) {
  const grab = (name) => { const i = UI_SRC.indexOf('  function ' + name + '('), j = UI_SRC.indexOf('\n  }\n', i); assert.ok(i > 0 && j > i, name); return UI_SRC.slice(i, j + 4); };
  // eslint-disable-next-line no-new-func
  return new Function('cat', 'E', grab('esc') + grab('rich') + grab('richN') + '\nreturn richN;')(Object.assign(E.blankCat({ now: 1 }), { name: catName }, more || {}), E);
}
test('a long name breaks between its halves in every box she reads it in (the review’s): the warrior name, Glintstar’s offers and the old tom’s PINECONE take a break point after her first part, in captions, the endcap, balloons, the stack, the choices and her book; `{name}paw` never does, so chapters 1 to 10 letter exactly as before', () => {
  const N = richNFor('Thunderwhisker', { ending: 'butterscotch', flags: { ch10Best: 'counts', specialty: 'swimming' } });
  assert.deepEqual(E.warriorOffers(Object.assign(E.blankCat({ now: 1 }), { name: 'Thunderwhisker', flags: { ch10Best: 'counts', specialty: 'swimming' } })), ['mark', 'splash', 'moon']);
  assert.equal(N('End of Chapter Eleven. Thunderwhiskerbutterscotch, warrior of CrystalClan.'), 'End of Chapter Eleven. <span class="wn">Thunderwhisker<wbr>butterscotch,</span> warrior of CrystalClan.');
  assert.equal(N('Or ThunderwhiskerPINECONE!'), 'Or <span class="wn">Thunderwhisker<wbr>PINECONE!</span>');
  assert.equal(N('Shining on the river. Thunderwhiskermoon.'), 'Shining on the river. <span class="wn">Thunderwhisker<wbr>moon.</span>');
  assert.equal(N('Ten claw marks. Thunderwhiskermark.'), 'Ten claw marks. <span class="wn">Thunderwhisker<wbr>mark.</span>');
  assert.equal(N('**Tap** to bow, Thunderwhiskerbutterscotch.'), '<strong>Tap</strong> to bow, <span class="wn">Thunderwhisker<wbr>butterscotch.</span>');
  assert.equal(N('Thunderwhiskerpaw. Come up.'), 'Thunderwhiskerpaw. Come up.', 'her apprentice name stays one word');
  assert.equal(N('Thunderwhisker’s turn. Thunderwhisker.'), 'Thunderwhisker’s turn. Thunderwhisker.', 'nothing after it: nothing to break');
  assert.equal(N('Thunderwhiskers'), 'Thunderwhiskers', 'a word that only starts with her name');
  assert.equal(richNFor('Fern')('Ferns grow taller than you.'), 'Ferns grow taller than you.');
  assert.equal(richNFor('')('Moonsilver.'), 'Moonsilver.', 'no name yet');
  // a short name is one box with its punctuation, so it never splits at a line's end where it fits (the fix round's check)
  assert.equal(richNFor('Moon', { ending: 'silver' })('See you tomorrow, Moonsilver!'), 'See you tomorrow, <span class="wn">Moon<wbr>silver!</span>');
  assert.equal(richNFor('Zoé', { ending: 'brisé' })('Zoébrisé.'), '<span class="wn">Zoé<wbr>brisé.</span>', 'an accented ending');
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'), /\.wn\{display:inline-block;max-width:100%\}/);
  // the endcap with her warrior name, with Aa, a hair smaller (the final round: Thunderwhisker alone ran 11px past a
  // 1024 x 700 column); only chapter 11's endcap has a .wn: chapters 1 to 10's name no one or {name}paw
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'), /\nhtml\.big \.endcap:has\(\.wn\)\{font-size:1\.9em\}\n/);
  for (const ch of STORIES.slice(0, 10)) for (const f of Object.values(ch.frames)) if (f.end) (f.caption || []).map(capText).forEach(t => {
    const s = E.fill(t, Object.assign(E.blankCat({}), { name: 'Thunderwhisker', petname: 'Pip' }));
    assert.ok(!richNFor('Thunderwhisker', { ending: 'butterscotch' })(s).includes('class="wn"'), ch.id + ': ' + s);
  });
  // chapters 1 to 10 and the Warrior Counts' lines without an ending: every caption, balloon and option the same as rich's
  const R = new Function(UI_SRC.slice(UI_SRC.indexOf('  function esc('), UI_SRC.indexOf('\n  }\n', UI_SRC.indexOf('  function rich(')) + 4) + '\nreturn rich;')();
  // a one-letter first part (E.cleanClanName keeps A or X as a capital) joins no shouted word (the final review: A|LIVE!)
  assert.equal(richNFor('A')('ALIVE! AGAIN? AIRPLANE!'), 'ALIVE! AGAIN? AIRPLANE!');
  assert.equal(richNFor('X')('Or XPINECONE!'), 'Or XPINECONE!');
  // first parts all in capitals (cleanClanName keeps one-letter words so: 'A H', 'S D') join no capital word either
  assert.equal(richNFor('A H')('A HUNDRED!'), 'A HUNDRED!');
  assert.equal(richNFor('S D')('S DOING IT!'), 'S DOING IT!');
  assert.equal(richNFor('A', { ending: 'moon' })('Amoon.'), '<span class="wn">A<wbr>moon.</span>', 'her ending still joins');
  for (const name of CH1_NAMES.concat(['Thunderwhisker', 'Big Fern', 'Star', 'Sun', 'Water', 'Mist', 'A', 'X', 'A H', 'S D', 'I L', 'A F'])) {
    const cat = Object.assign(E.blankCat({}), { name, petname: name }), N2 = richNFor(name);
    for (const ch of STORIES.slice(0, 10)) for (const f of Object.values(ch.frames)) {
      const texts = [].concat((f.caption || []).map(capText), (f.say || []).map(b => b.text), f.choice ? f.choice.options.map(o => o.label) : []);
      texts.forEach(t => { const s = E.fill(t, cat); assert.equal(N2(s), R(s), ch.id + ': ' + s); });
    }
  }
  // used wherever her lettering is set: the panel's and the column's captions, the endcap, the panel's and the stack's
  // balloons, the skip's and the Tap pages' captions, the choices, and her book's recap and dream; Read to me keeps `text`
  for (const site of ["el.innerHTML = richN(caps[ci]);", "'<p class=\"endcap\">' + richN(c) + '</p>'", "return '<p class=\"caption\">' + richN(c) + '</p>';",
    "'</span>' : '') + richN(b.text);", "(b.html != null ? b.html : richN(b.text))", "richN(fill(E.optionLabel(o.option, cat)))",
    "'<p>' + richN(p) + '</p>'", "'<p class=\"dream\">' + richN(pg.dream) + '</p>'"]) assert.ok(UI_SRC.includes(site), site);
  assert.equal(UI_SRC.split("$('colTop').innerHTML = caps.map(function (c) { return '<p class=\"caption\">' + richN(c) + '</p>'; }).join('');").length, 3, 'the skip’s and the Tap pages’ captions');
  assert.ok(!/\.sb\{[^}]*overflow-wrap/.test(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')), 'no break-word backstop: a word that fits is never broken, and chapters 1 to 10 stay as they were');
});

test('her book’s “Next” once she has passed: Glintstar’s pass line, which she has read, not chapter 10’s “Pass your Warrior Counts…” (the review’s); before a pass, and with the Ceremony unbuilt, as before', () => {
  assert.equal(UI.ending.ceremonyNext, 'Tonight, the Clan gathers again. For your warrior name.');
  assert.ok(fs.readFileSync(path.join(ROOT, 'app/story/warrior.js'), 'utf8').includes("text: '" + UI.ending.ceremonyNext + "'"), 'Glintstar’s pass line, word for word');
  // the teaser her book shows once chapter 10 is finished: chapter 10's, built, leading to this chapter, which a pass opens
  const cat = before11({}, { name: 'Fern' });
  const t = E.buildFullBook(cat, STORIES).teaser;
  assert.deepEqual([t.title, t.built, t.next, E.chapter(t.next, STORIES).opensWhen], ['The Warrior Ceremony', true, 'ch11', 'warrior']);
  assert.match(t.lines.join(' '), /Pass your Warrior Counts/, 'chapter 10’s own words, which the page replaces once she has passed');
  assert.match(UI_SRC, /var wsNext = t && t\.built && warriorBuilt\(\) && \(E\.chapter\(t\.next, stories\(\)\) \|\| \{\}\)\.opensWhen === 'warrior' \? warriorNow\(\) : null;\n    if \(wsNext && wPassShown\(wsNext\)\) t = Object\.assign\(\{\}, t, \{ lines: \[CEREMONY_NEXT\] \}\);/);
});

test('an offered name is kept in her choices as her warrior name, so the grown-ups’ corner says the name she has, after a chapter-1 reread too (Fernleap renamed Fox: Foxclimb); “I’ll name myself!” as she read it', () => {
  const cat = fresh({ specialty: 'climbing' }, { name: 'Fern' });
  read(cat, { stop: NAMING, pick: 0 });
  const key = E.choiceKey(story, NAMES), got = cat.choices[key];
  assert.equal(got.label, '{name}{ending}');
  assert.equal(E.fill(got.label, cat), E.warriorName(cat));
  // chapter 1 read again, renamed Fox: her offered ending taken again from its row, and the corner says it
  const ch01 = { id: 'ch01', start: 'f', frames: { f: { input: { kind: 'clanname', suggestions: ['Moon'], next: 'g' } }, g: { end: true } } };
  const fox = Object.assign(E.blankCat({ now: 1 }), { name: 'Fern', ending: 'leap', flags: { ch11Named: 'offer', specialty: 'climbing' }, choices: { [key]: { index: 18, label: '{name}{ending}' } } });
  fox.chapter = 'ch01'; fox.frame = 'f'; fox.history = [];
  assert.ok(E.submitInput(fox, ch01, 'Fox', 9));
  assert.deepEqual([E.warriorName(fox), E.fill(fox.choices[key].label, fox)], ['Foxclimb', 'Foxclimb']);
  // her own: the option as she read it
  const self = fresh({}, { name: 'Moon' });
  read(self, { stop: NAMING, pick: 'self', type: ['heart'] });
  assert.equal(self.choices[key].label, '“I’ll name myself!”');
});

test('Bigger text on a page she taps once: its “Tap to…” line stays beside Back (the review’s: f019 and f034 at 1024 x 700 ran Back under the screen); Aa only, as the skip-count’s', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(html.includes('html.big .frame .next-row:has(> .btn.back + .tapline){flex-wrap:nowrap}'));
  assert.ok(html.includes('html.big .frame .next-row > .btn.back + .tapline{flex:1 1 0;min-width:0;line-height:1.15}'));
  // the Tap page's row as the page builds it: Back, then her “Tap to…” line
  assert.match(UI_SRC, /box\.innerHTML = '<div class="next-row">' \+ backBottom\(\) \+ \(hint \? '<p class="prompt tapline">'/);
});
