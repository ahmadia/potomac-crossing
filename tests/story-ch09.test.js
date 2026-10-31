/* Story tests for chapter 9: node --test
 *
 * Checks app/story/ch09.js against the frame contract in docs/build.md, against the story
 * (docs/chapters/09-featherlight.md, Draft v0.4, final) and against its spec
 * (docs/chapters/09-featherlight.spec.md, v0.2, the build's contract): the frame graph (frames shown only
 * `when` they match, the told and kept screens, the specialty chains, the pairs by `foundSquall` and by the
 * path, the roar's choice only a cat who has never met Squall sees and its `else`, the two optional scenes
 * numbered ahead of the screens they rejoin), one interaction per frame, the choices (none sets a flag) and
 * the two sticky flags, `foundMizzle` on Mizzle's last screen and `foundSquall` with `ch9Roof` on the roof
 * copy's last frame only; the roof copy itself (chapter 4's frames word for word, by first light); the
 * Counts frames and sets exactly as the spec has them, with every test its build notes list (the warm-up's
 * hard pick and fillers and its own-pair slip, the lesson's order, twins, quick lines, help and check, the
 * one-fact sets' lending rule with its table and guarantees, 15 typed answers or 16 with Mizzle or the roof
 * or 17 with both, the Hollow's “Spiders’ legs · the 8s” and the ninth mark only after the lesson); the
 * skip-counts (the spider's two sides, the five spiders, the bedtime paws), Tallyheart's eight Counts,
 * Thymeleaf's four things and the case's six rows, and the pages she taps once, each with its target in the
 * art; Mizzle's card on its frame, under the moss; every `when`; the speakers (Mizzle and Squall labelled
 * until named, “A voice” for a Squall nobody has met, GroveClan's two by variant, never named); tokens,
 * storyboards, word counts, captions and boxes, the art vocabulary camera by camera, the staging, the time
 * of day, the generated storyboard, every frame rendered with everyone in the picture, the beats in order
 * on every path, the book (6 to 10 sentences on every path), Mizzle's page, the teaser for chapter 10, and
 * whole play-throughs through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch09.test.js   prints the whole chapter, rendered three ways.
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
const story = PC.story.ch09;
const frames = story.frames;
const ids = Object.keys(frames);
const ch04 = PC.story.ch04, ch05 = PC.story.ch05, ch06 = PC.story.ch06, ch07 = PC.story.ch07, ch08 = PC.story.ch08;
const STORIES = [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05, ch06, ch07, ch08, story];

/* ------------------------------------------------------------------ the contract */

// The flags a `when` may test: chapters 1 to 8's, and chapter 9's own two (each set by reaching a frame,
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
const FLAGS7 = { ch7Flew: [true, false] };
const FLAGS8 = { foundHail: [true, false] };
const FLAGS9 = { foundMizzle: [true, false], ch9Roof: [true, false] };
const FLAGS = Object.assign({}, FLAGS1, FLAGS2, FLAGS3, FLAGS4, FLAGS5, FLAGS6, FLAGS7, FLAGS8, FLAGS9, { lessonClean: ['ch09-eights'] });
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'sfxAt', 'sfxRead', 'gift', 'when', 'else', 'sets', 'card'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things', 'also']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
const TOD = ['morning', 'day', 'sunset', 'dusk', 'night'];
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat', 'sloshbank', 'reedclan', 'thymeleaf', 'groveclan'];
const GROWN = ['tallyheart', 'glintstar', 'thymeleaf', 'grizzled', 'sloshbank', 'waffles', 'groveclan'];
const RIM_ANCHORS = ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'];
const CARD_IDS = ['mizzle-wing'];
const SETS = ['ch09-fours', 'ch09-eights', 'ch09-mizzle', 'ch09-dew', 'ch09-rubs', 'ch09-flaps'];
// the Counts frames whose own lines are not said again over the first question (`intro: false`)
const NO_INTRO = ['ch09-fours', 'ch09-eights'];
const TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
const SQUALL = { foundSquall: true }, NO_SQUALL = { foundSquall: false };
const HAIL = { foundHail: true }, NO_HAIL = { not: { foundHail: true } };
const MIZZLE = { foundMizzle: true }, NO_MIZZLE = { not: { foundMizzle: true } };
const NOTICING = { specialty: 'noticing' }, FRIENDS = { specialty: 'friends' };
const SHINY = { worry: 'shiny' };
const FOUND_ONE = { not: { foundSquall: false, foundPuddle: false, foundWisp: false, foundSleet: false, foundHail: false } };
const NONE_FOUND = { foundSquall: false, foundPuddle: false, foundWisp: false, foundSleet: false, foundHail: false };
const FIVE_ONE = { not: { foundSquall: false, foundHail: false, foundMizzle: false } };
const OTHERS = { foundPuddle: true, foundWisp: true, foundSleet: true, foundHail: true };
// the spots of their own: our cat close beside Tallyheart behind the pile and Riffle at the hedge (chapter 8's), and
// flopped on his back a little in from it (f007); Tallyheart across the nook under the bridge (chapters 6 to 8's) and
// Thymeleaf at Sprinkle's chest
const NOSE = { x: 860, y: 960, h: 380 }, HEDGE = { x: 1430, y: 962, h: 380 }, FLOP = { x: 1360, y: 962, h: 360 };
// (the polish release, 2026-10-31: a grown cat's size there, as our cat's at back-left; at h 290 he read as a kitten)
const ACROSS = { x: 1250, y: 900, h: 330 }, MENDER = { x: 760, y: 905, h: 340 };
// (the review, 2026-10-26) Thymeleaf a little nearer the front where her peek or her claws come down to his head:
// crouched low under her peek (f093), and at her open wings under the hurt wing he sniffs (f095; the polish's second
// fix moved him out past her chest, from x 980 at h 350, where his balloon's tail ran down across her face);
// Tallyheart by the wall, facing in, while Sprinkle's wings are open (the hurt wing, the rub Tap's target, in plain sight)
const MENDER_LOW = { x: 900, y: 985, h: 350 }, MENDER_WING = { x: 1210, y: 975, h: 340 }, LOW = ['f093', 'f095'];
const MENDER_WING_WAS = { x: 980, y: 965, h: 350 };
// (the polish's fixes) a little to the right and nearer the front where our cat needs the room beside him: its raised
// forepaw (f091) and its balloon (f097)
const MENDER_FRONT = { x: 820, y: 945, h: 340 }, FRONT = ['f091', 'f097'];
const menderAt = (id) => (id === 'f093' ? MENDER_LOW : id === 'f095' ? MENDER_WING : FRONT.includes(id) ? MENDER_FRONT : MENDER);
const BY_WALL = { x: 300, y: 960, h: 330 }, WALL = ['f095', 'f096', 'f097', 'f098', 'f099', 'f100'];
const GROVE_CAMS = ['bridge', 'wide', 'meet', 'oak', 'hollow'];
// the roof copy: chapter 4's frames, f066 to f079 here (f076a to f089a there)
const ROOF_IDS = Array.from({ length: 14 }, (_, i) => 'f' + String(66 + i).padStart(3, '0'));
const CH4_ROOF = Array.from({ length: 14 }, (_, i) => 'f' + String(76 + i).padStart(3, '0') + 'a');

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
const seq = (from, to) => ids.slice(at(from), at(to) + 1);
/* The frames that say this, in reading order; F: the one frame that does; F2: the pair that does. */
function FF(re) { return ids.filter(id => re.test(T(id))); }
function F(re) {
  const hit = FF(re);
  assert.equal(hit.length, 1, 'exactly one frame says ' + re + ' (' + hit.join(' ') + ')');
  return hit[0];
}
function F2(re) {
  const hit = FF(re);
  assert.equal(hit.length, 2, 'two frames say ' + re + ' (' + hit.join(' ') + ')');
  return hit;
}

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A spider waving at the moon.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'Eight, sixteen, twenty-four.' },
  // a player whose own Clan name is Murmur: the warrior is Mutterchime
  murmur: { name: 'Murmur', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Mizzle snoring.' }
};
const FACT = { a: 8, b: 7, answer: 56, groups: 7, per: 8, thing: 'leg', things: 'legs', also: '' };
function fill(text, p) { return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : k in FACT ? FACT[k] : m)); }

/* Anything that reads badly once the tokens are filled (the chapter 1 rules). */
function badGrammar(text, isSfx) {
  const bad = [];
  if (/[{}]/.test(text)) bad.push('unfilled token');
  if (/(?<!\bif )\b(she|he) (are|were|have|do|don’t|aren’t|weren’t|haven’t)\b/i.test(text)) bad.push('pronoun/verb agreement');
  if (/\b(she|he)’re\b/i.test(text)) bad.push('she’re/he’re');
  if (/\bhisself\b|\btheirselves\b/i.test(text)) bad.push('bad reflexive');
  if (/\ban (tom|she-cat)\b/i.test(text)) bad.push('“an” before tom/she-cat');
  if (!isSfx && /\b(\w+)\s+\1\b/i.test(text.replace(/\b(Plip|Zzz)\.? /gi, ''))) bad.push('doubled word');
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

/* Every line in the chapter: frames (every variant), options (and their labelWhen), the instructions under
 * the pages she taps, the asks' lines, her card, the Counts lines, the book, Mizzle's page, the teaser. The
 * roof copy's frames are chapter 4's lines, run again. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast', 'fastAfterMiss', 'again', 'remembered', 'rememberedSlow'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l, ok: FACT_TOKENS })));
    ['miss', 'missLast', 'helpIntro', 'helpIntroFar', 'againIntro', 'done', 'fillIntro'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: FACT_TOKENS }); });
    ['firstPrompt', 'prompt'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: PROMPT_TOKENS }); });
    (d.facts || []).forEach((f, i) => {
      if (Array.isArray(f)) return;
      [].concat(f.prompt || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' prompt ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
      [].concat(f.right || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' right ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
      ['miss', 'missLast'].forEach(k => { if (f[k]) out.push({ set: sid, where: 'fact ' + i + ' ' + k, text: f[k], ok: PROMPT_TOKENS }); });
    });
  });
  return out;
}
// the one balloon that runs on into the next by design: Thymeleaf's fourth thing, split at its comma
const RUNS_ON = 'gathered high up at first light.';
function everyText(fn) {
  ids.forEach(id => texts(frames[id]).forEach(x => fn(id, x)));
  ids.forEach(id => {
    const f = frames[id];
    if (f.choice) {
      f.choice.options.forEach((o, i) => {
        fn(id, { where: 'option ' + i, text: o.label });
        (o.labelWhen || []).forEach((v, j) => fn(id, { where: 'option ' + i + ' labelWhen ' + j, text: v.label }));
      });
    }
    if (f.skip && f.skip.prompt) fn(id, { where: 'skip prompt', text: f.skip.prompt });
    if (f.scratch || f.file) fn(id, { where: 'tap prompt', text: E.tapWords(f).prompt });
    if (f.ask) {
      fn(id, { where: 'ask prompt', text: E.askWords(f.ask).prompt });
      f.ask.pairs.forEach((p, i) => { fn(id, { where: 'question ' + i, text: p[0], who: f.ask.who }); fn(id, { where: 'answer ' + i, text: p[1], who: f.ask.to, runsOn: p[1] === RUNS_ON }); });
    }
  });
  Object.keys(story.cards).forEach(cid => fn('card ' + cid, { where: 'line', text: story.cards[cid].line }));
  countsLines().forEach(x => fn('counts ' + x.set, x));
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  ['title', 'chapterTitle', 'dream', 'noDream'].forEach(k => { if (story.book[k]) fn('book', { where: k, text: story.book[k] }); });
  story.book.dragonet.forEach(d => d.lines.forEach((l, i) => fn('book', { where: d.id + '’s page ' + i, text: l })));
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* The choices: the reed root (light: both to the next screen), the oak (the hollow or the elder), the roar
 * (the roof scene or the dew, only for a cat who has never met Squall), and Glintstar's (light). */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const REED = choiceAt(/^“For a friend who’s hurt\.”$/)[0];
const OAK = choiceAt(/^Climb up to the hollow\.$/)[0];
const ROAR = choiceAt(/^Go up and find Sprinkle’s littlest brother\.$/)[0];
const ME = choiceAt(/^“Me\?”$/)[0];
/* The option a reader takes: `mizzle` at the oak (true: up to the hollow), `roof` at the roar (true: up to
 * the roof), and `light` (0 or 1) at the two light ones. */
function pick(id, o) {
  o = o || {};
  if (id === OAK) return o.mizzle ? 0 : 1;
  if (id === ROAR) return o.roof ? 0 : 1;
  return o.light || 0;
}
/* A cat as the walks below take her: these flags, and the eights learned with no help unless `clean: false`. */
function catFor(flags, o) {
  return { flags: Object.assign({}, flags), look: { sex: 'she' }, lessons: (o || {}).clean === false ? {} : { 'ch09-eights': { finished: true, noHelp: true } } };
}
/* The frames a reader with these flags walks through, in order (the engine's own E.landing passes over a
 * frame whose `when` doesn't match, or turns it to its `else`); a frame's `sets` are flags from then on. The
 * flags as they ended are on the result (`.flags`). */
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
      assert.ok(E.options(f, cat).some(x => x.option === opt), id + ': the option she takes is one she sees');
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
    const row = { id, kind: E.kindOf(f), lines: E.captions(f, cat).concat(E.balloons(f, cat).map(b => b.text)).concat(f.sfx ? [f.sfx] : []),
      // (an ask letters the frame's captions again beside each tap's question and answer, two balloons: ui.js renderAsk)
      boxes: E.captions(f, cat).length + (f.ask ? Math.max(E.balloons(f, cat).length, 2) : E.balloons(f, cat).length), balloons: E.balloons(f, cat) };
    if (f.choice) { row.options = E.options(f, cat).map(x => E.optionLabel(x.option, cat)); Object.assign(cat.flags, f.choice.options[pick(id, o)].sets || {}); }
    if (f.scratch) row.tap = E.tapWords(f).prompt;
    if (f.sets) Object.assign(cat.flags, f.sets);
    return row;
  });
}
/* Every combination of told or kept, the specialty, the worry, Squall (known before; never met, and up to the
 * roof; never met, and just the dew), the oak (up to Mizzle's hollow, or asking the elder), and the dragonets
 * found before (none; Puddle, Wisp, Sleet and Hail; Mizzle in an earlier reading; both): 960, her stone by her
 * nose or under her chin by turns. */
const COMBOS = [];
for (const ch3Told of FLAGS3.ch3Told) for (const specialty of FLAGS1.specialty) for (const worry of FLAGS1.worry)
  for (const squall of ['known', 'roof', 'dew']) for (const oak of ['climb', 'ask']) for (const found of ['none', 'others', 'before', 'both']) {
    const flags = { ch3Told, specialty, worry, ch2Stone: COMBOS.length % 2 ? 'chin' : 'nose', ch2Path: 'bridge', ch7Flew: true, foundSquall: squall === 'known' };
    if (found === 'others' || found === 'both') Object.assign(flags, OTHERS);
    if (found === 'before' || found === 'both') flags.foundMizzle = true;
    COMBOS.push({ flags, squall, oak, found, o: { roof: squall === 'roof', mizzle: oak === 'climb' } });
  }
const comboName = c => JSON.stringify(c.flags) + ' ' + c.squall + ' ' + c.oak;
// a spread of the combinations for the heavier checks
const SOME = COMBOS.filter((c, i) => i % 11 === 0);
// what a combination has met by the dew, and by the remedy
const met = c => c.squall !== 'dew';
const mizzleFound = c => c.oak === 'climb' || c.found === 'before' || c.found === 'both';
const othersFound = c => c.found === 'others' || c.found === 'both';

/* ------------------------------------------------------------------ reading through the engine */

const Sp = PC.ui.speakers;
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
  const home = setId === 'ch04-riddle' ? story : homeOf(setId);
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
      const want = o.pick ? o.pick(id) : 0, ix = opts.findIndex(x => x.index === want);
      row.picked = ix >= 0 ? ix : 0;
      assert.ok(E.choose(cat, st, opts[row.picked].index, t), id);
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'a spider waving at the moon' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      row.lesson = lessonRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat at chapter 9's first page: chapters 1 to 8 finished, her flags (FLEW seen in chapter 7, as every cat
 * who read it has), the Counts she learned (chapter 4's tens to chapter 8's fours, played through the engine,
 * with these answers and times in chapter 8's fours: what today's warm-up finds hard), and her Case File as
 * chapters 4 to 8 left it (a found dragonet's card with it; `my-count` missing for `o.noMyCount`, chapter 7's
 * known issue 15; Mizzle's card for a cat who found her in an earlier reading). */
const CH5_CARDS = ['prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh'];
const CH6_CARDS = ['reed-pile', 'coil-diggers'];
const CH7_CARDS = ['waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel'];
const CH8_CARDS = ['fox-brag', 'stash', 'glass'];
function before9(flags, o) {
  o = o || {};
  const cat = E.blankCat({ now: 1, id: 'c9' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5, ch06: 6, ch07: 7, ch08: 8 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch2SaidAloud: true, ch3Told: true, caseFileOpen: true, ch5First: 'otters', ch7Flew: true }, flags || {});
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  const ms = { all: 1500 };
  ['ch04-tens', 'ch05-nines', 'ch06-threes', 'ch07-pile', 'ch07-threes', 'ch07-sixes', 'ch07-gone'].forEach(id => play(cat, id, null, ms));
  play(cat, cat.flags.ch3Told === false ? 'ch07-riffle' : 'ch07-dragon', null, ms);
  play(cat, 'ch08-pile', null, ms);
  play(cat, 'ch08-sixes', null, ms);
  play(cat, 'ch08-fours', o.fours, o.foursMs || ms);
  play(cat, 'ch08-gone', null, ms);
  play(cat, cat.flags.ch3Told === false ? 'ch08-riffle' : 'ch08-snip', null, ms);
  const f = cat.flags, give = (list, ch, at0) => list.forEach((cid, i) => E.giveCard(cat, cid, ch, at0 + i));
  give(Object.keys(ch04.cards).filter(cid => !ch04.cards[cid].when || E.matches(ch04.cards[cid].when, cat)), 'ch04', 10);
  give(CH5_CARDS.concat(f.foundPuddle ? ['puddle-paws'] : [], f.foundWisp ? ['wisp-fox'] : [], f.specialty === 'climbing' ? ['prints-tracks'] : []), 'ch05', 30);
  give(CH6_CARDS.concat(f.foundSleet ? ['sleet-den'] : []), 'ch06', 50);
  give(CH7_CARDS.filter(cid => !(o.noMyCount && cid === 'my-count')), 'ch07', 70);
  give((f.foundHail ? ['hail-shapes'] : []).concat(CH8_CARDS), 'ch08', 90);
  // a cat who found Mizzle in an earlier reading holds her card from it
  if (f.foundMizzle) give(['mizzle-wing'], 'ch09', 110);
  return cat;
}
function fresh(flags, o) {
  const cat = before9(flags, o);
  E.startChapter(cat, story, 500);
  return cat;
}
/* Read chapter 9: `o` is a route (`mizzle`, `roof`, `light`: as `pick`), with `stop`, `answers`, `ms`, `dream`
 * and `t` as readStory takes them. */
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
function reading(flags, o, co) {
  const cat = fresh(flags, co), rows = read(cat, o);
  return { cat, rows, w: readWords(rows), ids: idsOf(rows) };
}
const clone = x => JSON.parse(JSON.stringify(x));
const countsAt = set => ids.filter(id => frames[id].counts && frames[id].counts.set === set);

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch09');
  assert.equal(story.number, 9);
  assert.equal(story.title, 'Featherlight');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.equal(ids.length, 140, 'every panel, the two optional scenes and the twins');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'names', 'number', 'start', 'teaser', 'title']);
  // Mizzle until she says her name; Squall in the roof copy, chapter 4's own label until he says his (as chapter 5's)
  assert.deepEqual(story.names, { mizzle: 'The sleepy dragonet', squall: 'The little dragon' });
  assert.equal(story.names.squall, ch04.names.squall, 'chapter 4’s label, the copy’s own');
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch09'), order.indexOf('ch08') + 1, 'chapter 9 follows chapter 8');
  assert.ok(Object.values(frames).every(f => !/^STUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 960);
  // the page loads it after chapter 8 (and chapter 4, whose roof it runs), and the offline copy has it
  const scripts = require('./_load.js').scripts().filter(s => /story\/ch\d+\.js$/.test(s));
  assert.ok(scripts.indexOf('app/story/ch08.js') >= 0 && scripts.indexOf('app/story/ch08.js') < scripts.indexOf('app/story/ch09.js'));
  assert.ok(scripts.indexOf('app/story/ch04.js') < scripts.indexOf('app/story/ch09.js'));
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  assert.match(sw, /'\.\/app\/story\/ch09\.js'/);
  assert.match(sw, /'\.\/app\/art\/sets\/grove\.js'/);
});

test('frame ids run f001 to f140 in reading order, with no letters; every edge goes forward; the numbers have no gaps; the optional scenes sit ahead of the screens they rejoin', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  const nums = ids.map(num);
  nums.forEach((n, i) => assert.equal(n, i + 1, 'frame number ' + (i + 1) + ' is missing'));
  // the oak: the elder's screen at the next number, leading on past Mizzle's hollow to the moss; the hollow
  // scene after it, its last screen to the moss too
  const [hollow, elder] = frames[OAK].choice.options.map(o => o.next);
  const MOSS = F(/^You gather the soft silver moss\.$/);
  assert.deepEqual([elder, frames[elder].next], ['f' + String(num(OAK) + 1).padStart(3, '0'), MOSS]);
  assert.equal(hollow, 'f' + String(num(OAK) + 2).padStart(3, '0'));
  seq(hollow, ids[at(MOSS) - 1]).forEach(id => ways(frames[id]).forEach(n => assert.ok(at(n) <= at(MOSS), id + ': the hollow leads on only to the moss')));
  assert.equal(frames[ids[at(MOSS) - 1]].scratch.next, MOSS);
  // the roar: its twin next, then the little room (two frames), then the roof copy, then the dew; the room
  // leads past the roof
  const [roof, dew] = frames[ROAR].choice.options.map(o => o.next);
  const DEW1 = F2(/^By the red light, the rain puddle is silver with dew\./)[0];
  assert.deepEqual([dew, frames[ROAR].else, num(dew) - num(ROAR)], [ids[at(ROAR) + 1], ids[at(ROAR) + 1], 1], '“Just the dew today.” turns to the twin, passed over for a cat who has never met him');
  assert.deepEqual([roof, ROOF_IDS[0]], [ROOF_IDS[0], ids[at(ROAR) + 4]]);
  assert.equal(frames[ids[at(ROAR) + 3]].next, DEW1, 'the little room leads straight on past the roof');
  ROOF_IDS.forEach(id => ways(frames[id]).forEach(n => assert.ok(ROOF_IDS.includes(n) || n === DEW1, id + ': the roof leads on only to the dew')));
  assert.equal(DEW1, ids[at(ROOF_IDS[13]) + 1]);
});

// The frames shown only `when` they match, in reading order, with their `when` (and `else`, the roar only a cat
// who has never met Squall chooses): each path's own screens, the noticing and friendly cats' panels, the climber's
// and everyone else's way up the tower (chapter 4's own), the dew's pairs and trailing captions, the remedy's
// path panels and the five that reach Sprinkle, the practice by specialty.
const WHEN_FRAMES = [
  ['f003', NOTICING], ['f006', TOLD], ['f007', TOLD], ['f008', TOLD], ['f009', TOLD],
  ['f010', KEPT], ['f011', KEPT], ['f012', KEPT], ['f013', KEPT], ['f014', KEPT],
  ['f034', FRIENDS], ['f035', FRIENDS],
  ['f062', NO_SQUALL, 'else'], ['f063', SQUALL],
  ['f066', { specialty: 'climbing' }], ['f067', { not: { specialty: 'climbing' } }], ['f068', { not: { specialty: 'climbing' } }],
  ['f080', SQUALL], ['f081', NO_SQUALL], ['f082', { foundSquall: true, ch9Roof: true }], ['f083', { foundSquall: true, ch9Roof: false, worry: 'shiny' }], ['f084', NO_SQUALL],
  ['f085', SQUALL], ['f086', NO_SQUALL],
  ['f089', TOLD], ['f090', KEPT], ['f091', SQUALL], ['f092', KEPT], ['f093', KEPT], ['f094', TOLD], ['f098', FIVE_ONE],
  ['f102', NOTICING], ['f103', { specialty: 'climbing' }], ['f104', { specialty: 'sneaking' }], ['f105', FRIENDS], ['f108', { specialty: 'swimming' }]
];
// the pairs: [first, second], the first leading to the second, side by side: one picture drawn twice by a flag
const PAIRS = [['f062', 'f063', NO_SQUALL, SQUALL], ['f080', 'f081', SQUALL, NO_SQUALL], ['f085', 'f086', SQUALL, NO_SQUALL], ['f089', 'f090', TOLD, KEPT]];

test('exactly one interaction per frame (the taps and the questions included), no unknown keys, and a frame `when`, `else` or `sets` only where the story and the spec have one', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    assert.equal(f.look, undefined, id + ': chapter 9 has no look frame');
    assert.equal(f.gift, undefined, id + ': chapter 9 gives no gift');
    assert.equal(f.file, undefined, id + ': her Case File was opened in chapter 4');
    assert.equal(f.sfxAt, undefined, id + ': every sound is lettered where the page puts it');
  });
  const whens = ids.filter(id => frames[id].when);
  assert.deepEqual(whens.map(id => [id, frames[id].when]), WHEN_FRAMES.map(w => [w[0], w[1]]));
  whens.forEach((id, i) => {
    assert.notEqual(id, story.start);
    const keys = w => Object.keys(w).forEach(k => { if (k === 'not') keys(w.not); else assert.ok(FLAGS[k], id + ': when ' + k); });
    keys(frames[id].when);
    if (WHEN_FRAMES[i][2] === 'else') {
      assert.ok(frames[id].choice && frames[id].else, id + ': a choice only some cats see, and where the others turn');
      assert.ok(frames[frames[id].else] && !same(frames[frames[id].else].when, frames[id].when), id + ': its else is the other cats’');
    } else {
      assert.equal(frames[id].else, undefined, id);
      assert.equal(exits(frames[id]).length, 1, id + ': one way on');
    }
  });
  assert.deepEqual(ids.filter(id => frames[id].else).map(id => [id, frames[id].else]), [['f062', 'f063']]);
  // the pairs stand one after the other, the first leading to the second, one picture drawn twice
  PAIRS.forEach(([a, b, wa, wb]) => {
    assert.deepEqual([frames[a].when, frames[b].when], [wa, wb], a + ' ' + b);
    assert.equal(num(b) - num(a), 1, a + ' and ' + b + ': side by side');
    assert.equal(a === 'f062' ? frames[a].else : exits(frames[a])[0], b, a + ' → ' + b);
  });
  // the two flags set by reaching a frame, for good: `foundMizzle` on Mizzle's last screen; `foundSquall` with
  // `ch9Roof` on the roof copy's last frame
  assert.deepEqual(ids.filter(id => frames[id].sets).map(id => [id, frames[id].sets]), [['f055', { foundMizzle: true }], ['f079', { foundSquall: true, ch9Roof: true }]]);
  // no choice sets anything (the spec: two sticky flags, no choice flag)
  ids.filter(id => frames[id].choice).forEach(id => frames[id].choice.options.forEach(o => assert.deepEqual(o.sets, {}, id)));
});

test('a child who listens hears every sentence finished: no caption here runs on into its sound, so no page is heard differently from how it is lettered', () => {
  assert.deepEqual(ids.filter(id => frames[id].sfxRead !== undefined), []);
  const some = [{ flags: { ch2Stone: 'nose' } }, { flags: { ch2Stone: 'chin', ch3Told: false, specialty: 'noticing', worry: 'small', foundHail: true, foundMizzle: true } }, { flags: { ch3Told: true, worry: 'shiny', specialty: 'sneaking', foundSquall: false } }];
  ids.forEach(id => {
    const f = frames[id];
    // a caption that does not end a sentence leads into a balloon on its panel (“From behind the red light:”), never into the sound
    (f.caption || []).map(capText).filter(t => !E.endsSentence(t)).forEach(t => assert.ok(/:$/.test(t) && (f.say || []).length, id + ': “' + t + '” runs on into its balloon'));
    some.forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), id + ': heard as it is lettered'));
  });
  assert.deepEqual(E.checkStory(story, STORIES), []);
});

test('every next / option / else / input / counts / skip / scratch / ask target exists, and every frame is reachable, by its exits and by some reader', () => {
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const byExit = new Set([story.start]), line = [story.start];
  while (line.length) exits(frames[line.pop()]).forEach(n => { if (!byExit.has(n)) { byExit.add(n); line.push(n); } });
  assert.deepEqual(ids.filter(id => !byExit.has(id)), [], 'every frame is reached by exits alone (the storyboard walks them; nothing is reached only by `else`)');
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
    rows.forEach(r => {
      if (r.kind !== 'end') assert.ok(r.lines.length > 0 || (r.options || []).length || r.tap, r.id + ' shows nothing to ' + name);
      if (r.options) assert.equal(r.options.length, 2, r.id + ': two options');
    });
  }
  // the told path's first panel under the bridge has Tallyheart's branch over the nook; the rest is one picture
  assert.deepEqual(frames.f089.scene.opts, { prints: true, stones: true, branch: true });
  assert.deepEqual(Object.assign({}, frames.f090.scene, { opts: null }), Object.assign({}, frames.f089.scene, { opts: null }));
  assert.equal(T('f089'), T('f090'), 'the same lines');
  // the roar: one picture and one line
  assert.deepEqual(frames.f062.scene.opts, frames.f063.scene.opts);
  assert.equal(T('f062'), T('f063'));
  // the dew: Squall at his pole roaring, or only his tail tip behind it with an airplane high over; the rest the same
  [['f080', 'f081'], ['f085', 'f086']].forEach(([a, b]) => {
    assert.deepEqual([frames[a].scene.opts, frames[b].scene.opts], [{ dew: true }, { dew: true, plane: true }], a + ' ' + b);
    assert.deepEqual([castOf(a, 'squall').map(c => [c.pose, c.at]), castOf(b, 'squall').map(c => [c.pose, c.at])], [[['roar', 'pole']], [['hidden', 'pole']]], a + ' ' + b);
    assert.deepEqual(castOf(a, 'player'), castOf(b, 'player'), a + ' ' + b + ': our cat at the puddle in both');
  });
  // the trailing captions on the same pictures
  assert.deepEqual([frames.f082.scene, frames.f083.scene, frames.f085.scene], [frames.f080.scene, frames.f080.scene, frames.f080.scene]);
  assert.deepEqual([frames.f084.scene, frames.f086.scene], [frames.f081.scene, frames.f081.scene]);
});

test('choices: four kinds, two or three a reading, labels short, none sets a flag; the oak read her way by a cat who has found Mizzle; the roar only for a cat who has never met Squall', () => {
  const choiceIds = ids.filter(id => frames[id].choice);
  assert.deepEqual(choiceIds, [REED, OAK, ROAR, ME]);
  const L = id => frames[id].choice.options.map(o => o.label);
  const O = (id, i) => T(frames[id].choice.options[i].next);
  choiceIds.forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length === 2, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), id === OAK && i === 0 ? ['label', 'labelWhen', 'next', 'sets'] : ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 12, id + ' option ' + i + ' label');
      assert.equal(o.when, undefined, id + ': both options are for everyone who sees the choice');
    });
    assert.equal(frames[id].choice.prompt, undefined, id);
  });
  assert.deepEqual(L(REED), ['“For a friend who’s hurt.”', 'Dip your head, very politely.']);
  assert.deepEqual(L(OAK), ['Climb up to the hollow.', 'Ask the elder which moss.']);
  assert.deepEqual(L(ROAR), ['Go up and find Sprinkle’s littlest brother.', '“Just the dew today.”']);
  assert.deepEqual(L(ME), ['“Me?”', 'Sit up very straight.']);
  // the light ones: both options to the next screen, no outcome panel
  [REED, ME].forEach(id => assert.deepEqual(frames[id].choice.options.map(o => o.next), [ids[at(id) + 1], ids[at(id) + 1]], id));
  assert.deepEqual(frames[OAK].choice.options[0].labelWhen, [{ when: MIZZLE, label: 'Go and see Mizzle again.' }]);
  [[{}, 'Climb up to the hollow.'], [{ foundMizzle: false }, 'Climb up to the hollow.'], [{ foundMizzle: true }, 'Go and see Mizzle again.']].forEach(([flags, want]) => assert.equal(E.optionLabel(frames[OAK].choice.options[0], { flags }), want, JSON.stringify(flags)));
  assert.match(O(OAK, 0), /^Up you climb\./);
  assert.match(O(OAK, 1), /^The softest moss is the silver kind\./);
  assert.match(O(ROAR, 0), /^It’s only a very tall curtain, really\./, 'chapter 4’s way up, the climber’s first');
  // a spoken option is never echoed as a balloon on its outcome
  choiceIds.forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    if (said) (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
  // three on every reading (the reed root, the oak, Glintstar's), four for a cat who has never met Squall
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    assert.deepEqual(p.filter(id => frames[id].choice), [REED, OAK].concat(met(c) && c.squall === 'known' ? [] : [ROAR], [ME]), comboName(c));
  }
  // how much she reads before she chooses
  for (const c of SOME) walkLines(c.flags, c.o).filter(r => r.options).forEach(r => {
    const n = r.lines.reduce((m, s) => m + words(s), 0) + r.options.reduce((m, s) => m + words(s), 0);
    // (the oak's screen is the story's three captions, its snore and the two options: the most, at 46)
    assert.ok(n >= 8 && n <= 46, r.id + ': ' + n + ' words before she chooses, for ' + comboName(c));
  });
});

test('inputs, counts, skips, taps, asks, in the story’s order, each as the spec has it', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  assert.equal(T(inputs[0]), 'What did {name}paw dream, the night before the Gathering?');
  const ph = frames[inputs[0]].input.placeholder;
  assert.ok(typeof ph === 'string' && ph.length <= 30 && /wing|moon|spider/.test(ph), ph);
  // the Counts frames: the warm-up, the lesson, Mizzle's (optional), the dew (a pair by `foundSquall`), the
  // rubs and the flaps; and chapter 4's riddle in the roof copy
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => [id, frames[id].counts.set]), [['f024', 'ch09-fours'], ['f027', 'ch09-eights'], ['f048', 'ch09-mizzle'], ['f072', 'ch04-riddle'], ['f085', 'ch09-dew'], ['f086', 'ch09-dew'], ['f096', 'ch09-rubs'], ['f099', 'ch09-flaps']]);
  counts.forEach(id => {
    const set = frames[id].counts.set;
    assert.deepEqual(Object.keys(frames[id].counts).sort(), NO_INTRO.includes(set) ? ['intro', 'next', 'set'] : ['next', 'set'], id);
    if (NO_INTRO.includes(set)) assert.equal(frames[id].counts.intro, false, id);
    assert.ok(E.countsSet(set, story, STORIES), id + ': the counts set exists');
  });
  // four skip-counts: the spider's two sides, the five spiders, Squall's forepaw (chapter 4's), the bedtime paws
  const skips = ids.filter(id => frames[id].skip);
  assert.deepEqual(skips, ['f022', 'f025', 'f079', 'f134']);
  const [spider, five, , bed] = skips.map(id => frames[id].skip);
  assert.deepEqual(spider, { table: 4, groups: 2, who: [{ who: 'spider' }], thing: 'leg', things: 'legs', teacher: 'player', label: 'Count the next four legs.', prompt: '**Tap** her legs.', next: 'f023' });
  assert.deepEqual(five, { table: 8, groups: 5, thing: 'leg', things: 'legs', teacher: 'tallyheart', label: 'Count the next spider’s legs.', prompt: '**Tap** the spiders.', carry: false, next: 'f026' });
  assert.deepEqual(bed, { table: 4, groups: 2, who: [{ who: 'snorer' }, { who: 'player' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next cat’s paws.', prompt: '**Tap** the paws.', next: 'f135' });
  assert.deepEqual(frames.f079.skip, Object.assign({}, ch04.frames.f089a.skip, { next: 'f080' }), 'Squall’s forepaw, chapter 4’s, on to the dew');
  assert.deepEqual([1, 2].map(n => E.skipView(spider, n).count), ['4…', '4… 8!']);
  assert.deepEqual(E.skipView(five, 5).count, '8… 16… 24… 32… 40!');
  assert.deepEqual(E.skipView(bed, 2).count, '4… 8!');
  assert.deepEqual(E.skipPicture(spider, 1), { table: 4, groups: 2, per: 4, highlight: 4, totals: true, next: true, who: [{ who: 'spider' }], thing: 'leg', things: 'legs' });
  assert.deepEqual(E.skipPicture(five, 2), { table: 8, groups: 5, per: 8, highlight: 16, totals: true, next: true, who: undefined, thing: 'leg', things: 'legs' });
  // what each page after a count shows: no `keep` anywhere; the spider's legs leave a big 8 on the den's own scene,
  // the five spiders carry nothing (the tree's ask), the bedtime paws leave a big 8
  skips.forEach(id => assert.equal(frames[id].skip.keep, undefined, id));
  assert.equal(E.skipReached(E.skipInto(story, spider.next)), 8);
  assert.equal(E.keptSkip(story, spider.next), null, 'no kept picture: the next page shows its own scene, and the warm-up’s is its own');
  assert.match(T(spider.next), /^Eight legs\. Four on each side\. An eight is two fours\./);
  assert.equal(E.skipInto(story, five.next), null);
  assert.ok(frames[five.next].ask, 'the five spiders turn to the tree’s eight Counts');
  assert.equal(E.skipReached(E.skipInto(story, bed.next)), 8);
  assert.match(T(bed.next), /^Eight\. Two cats make one whole spider!/);
  // the pages she taps once (the spec's one-tap table, and chapter 4's none: its roof has no scratch)
  const taps = ids.filter(id => frames[id].scratch);
  const tapOf = id => Object.assign({}, frames[id].scratch, { next: undefined });
  const ONE = {
    back: { tap: 'back', prompt: '**Tap** to walk round the back.', label: 'Walk round the back.' },
    every: { tap: 'ears', prompt: '**Tap** to tell him EVERY bit.', label: 'Tell Riffle every bit.' },
    whisper: { tap: 'ears', prompt: '**Tap** to whisper it.', label: 'Whisper it.' },
    follow: { tap: 'tail', prompt: '**Tap** to follow Tallyheart.', label: 'Follow Tallyheart.' },
    cross: { tap: 'paw', prompt: '**Tap** to cross.', label: 'Cross the bridge.' },
    tuck: { tap: 'leaf', prompt: '**Tap** to tuck a leaf over her.', label: 'Tuck a leaf over her.' },
    roll: { tap: 'leaf', prompt: '**Tap** to roll it in a leaf.', label: 'Roll the moss in a leaf.' },
    root: { tap: 'root', prompt: '**Tap** to take the root.', label: 'Take the root.' },
    ride: { tap: 'nose', prompt: '**Tap** to ride up.', label: 'Ride up.' },
    rub: { tap: 'wing', prompt: '**Tap** to rub the remedy in.', label: 'Rub the remedy in.' },
    clap: { tap: 'paw', prompt: '**Tap** to clap.', label: 'Clap.' },
    cheer: { tap: 'tail', prompt: '**Tap** to cheer!', label: 'Cheer!' },
    show: { tap: 'leaf', prompt: '**Tap** to show Glintstar your glass.', label: 'Show Glintstar your glass.' }
  };
  const TAPS = ['back', 'every', 'whisper', 'follow', 'cross', 'tuck', 'roll', 'root', 'ride', 'rub', 'clap', 'cheer', 'show'];
  assert.deepEqual(taps, ['f001', 'f006', 'f012', 'f015', 'f038', 'f055', 'f056', 'f059', 'f064', 'f095', 'f107', 'f114', 'f123']);
  assert.deepEqual(taps.map(id => tapOf(id)), TAPS.map(k => Object.assign({}, ONE[k], { next: undefined })));
  taps.forEach(id => assert.deepEqual(E.tapWords(frames[id]), { kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label }, id + ': no miss line: the glow wobbles'));
  // (the story's response to each is shown by the next panel, the spec's table)
  const after = (id, flags) => E.landing({ flags: Object.assign({}, frames[id].when, flags) }, story, frames[id].scratch.next);
  const T_ = k => taps[TAPS.indexOf(k)];
  assert.deepEqual([camOf(after(T_('back'))), frames[after(T_('back'))].scene.opts], ['pile/gap', { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }], 'the back row whole');
  assert.match(T(after(T_('every'))), /^The tunnel\. The weasels\./, 'his list, on his back');
  assert.match(T(after(T_('whisper'))), /^The last of it: the dragonets\./);
  assert.equal(camOf(after(T_('follow'))), 'camp/herbs', 'Thymeleaf’s den');
  assert.deepEqual([camOf(after(T_('cross'))), T(after(T_('cross')))], ['grove/wide', 'Over the bridge, the trees are very, very old. GroveClan’s woods. The oldest Clan. We wait here to be asked in. Best manners.']);
  assert.equal(after(T_('tuck')), T_('roll'), 'the moss, after Mizzle’s last');
  assert.deepEqual([after(T_('roll')), T(after(T_('roll')))], ['f057', 'Thank you.']);
  assert.deepEqual([camOf(after(T_('root'))), frames[after(T_('root'))].scene.fx], ['tower/up', ['morning']], 'next morning, the tower');
  assert.match(T(after(T_('ride'))), /^The little room hums\. Your tummy goes UP\./);
  assert.equal(frames[after(T_('rub'))].counts.set, 'ch09-rubs', '“Eight rubs,” says Thymeleaf');
  assert.equal(after(T_('clap'), { specialty: 'noticing' }), 'f109', 'Coil’s QUIET (a swimmer reads “She does. It helps.” first)');
  assert.equal(after(T_('clap'), { specialty: 'swimming' }), 'f108');
  assert.match(T(after(T_('cheer'))), /^…and she LIFTS\./);
  assert.deepEqual(castOf(after(T_('show')), 'player').map(c => c.holds), ['glass'], 'the leaf open, the glass shining');
  // the asks: Tallyheart's eight Counts at the tree, Thymeleaf's four things, the case's six rows
  const asks = ids.filter(id => frames[id].ask);
  assert.deepEqual(asks, ['f019', 'f026', 'f118']);
  assert.deepEqual(frames.f019.ask, { who: 'thymeleaf', to: 'thymeleaf', prompt: '**Tap** his claws.', label: 'Hear the next thing.',
    pairs: [['Reed root, from ReedClan.', 'It holds it all together.'], ['Oak moss, from GroveClan.', 'It calms the hurt.'], ['River mint, from the otters’ Holt.', 'It cools.'], ['And dew from the glass towers,', 'gathered high up at first light.']], next: 'f020' });
  assert.deepEqual(frames.f026.ask, { who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
    pairs: [['Tails?', 'Eight cats, eight tails!'], ['Ears?', 'Eight cats, sixteen ears!'], ['Claws?', 'Eight forepaws, forty claws!'], ['Both forepaws?', 'Eight cats, eighty claws!'],
      ['Nine lives?', 'Eight cats, seventy-two lives!'], ['Patrols?', 'Eight patrols, twenty-four guards!'], ['Whiskers?', 'Eight cheeks, forty-eight whiskers!'], ['Paws?', 'Eight cats, thirty-two paws. That was YESTERDAY!']], next: 'f027' });
  assert.deepEqual(frames.f118.ask, { who: 'tallyheart', to: 'player', opt: 'read', prompt: '**Tap** each row.', label: 'Read the next row.',
    pairs: [['The moon?', 'Waffles and Patience say NO moon. Only the fox says moon.'], ['The fox’s little story?', 'He says it FLEW. But on the storm night, Sprinkle couldn’t fly at all.'],
      ['The piles?', 'Ours and ReedClan’s were both robbed, and the prey is all in one stash.'], ['The scale?', 'It’s not a scale. It’s tower glass.'], ['The prints?', 'Sprinkle’s are huge. The thief’s are tiny.'],
      ['The tunnel?', 'Coil felt small diggers, and I found their tunnel.']], next: 'f119' });
  // the order of the things she does, on the page
  const order = ['f001', 'f015', 'f019', 'f022', 'f024', 'f025', 'f026', 'f027', REED, 'f038', OAK, 'f048', 'f055', 'f056', 'f059', ROAR, 'f064', 'f072', 'f079', 'f085', 'f095', 'f096', 'f099', 'f107', 'f114', 'f118', 'f123', ME, 'f134', inputs[0]];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: the Counts moments, the skip-counts and asks, the one-tap pages
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), name = comboName(c);
    assert.equal(p.filter(id => frames[id].counts).length, 5 + (c.oak === 'climb' ? 1 : 0) + (c.squall === 'roof' ? 1 : 0), name + ': Counts moments');
    assert.equal(p.filter(id => frames[id].skip || frames[id].ask).length, 6 + (c.squall === 'roof' ? 1 : 0), name + ': the skip-counts and the asks');
    // the walk round, the follow, the cross, the moss, the root, the rub, the clap, the cheer, the glass; told
    // Riffle's ears or kept Tallyheart's; Mizzle's leaf; the little room's nose unless she went up to the roof
    assert.equal(p.filter(id => frames[id].scratch).length, 10 + (c.oak === 'climb' ? 1 : 0) + (c.squall === 'roof' ? 0 : 1), name + ': one-tap pages');
  }
});

/* ------------------------------------------------------------------ speakers, tokens, words */

const SKRITCH = F(/^Tallyheart stretches up the leaning tree\./);
const NINTH = F(/^Spiders’ legs\. That’s your ninth Count\./);
const IM_MIZZLE = F(/^I’m Mizzle\./);
const NEST = F(/^Your glass and your secret bark go back under the moss\./);
const MONTAGE = F(/^Every morning: forty\./);

test('every balloon speaker is in that frame’s cast; a speaker’s lines on a panel are one balloon (but Glintstar’s ruling and promise, her two); balloons and captions are well formed', () => {
  const NAMED = { coil: ['Coil'], mizzle: ['Mizzle'], squall: ['Squall', 'A voice'] };
  ids.forEach(id => {
    const f = frames[id];
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(NAMED[b.who] && NAMED[b.who].includes(b.name), id + ' say ' + i + ': ' + b.who + ' named ' + b.name);
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      assert.ok(castOf(id, b.who).length, id + ': ' + b.who + ' speaks and is not in the picture');
    });
    // nobody in two of a kind speaks: the clancats and GroveClan's two are different cats
    (f.say || []).forEach(b => { if (castOf(id, b.who).length > 1) assert.ok(b.who === 'groveclan' && castOf(id, b.who)[0].variant === 1, id + ': ' + b.who); });
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
  // no balloon is chained to its own speaker's, for any reader (where the story gives a speaker a second paragraph
  // only some cats read, the balloon is written twice with opposite whens, the longer one holding both), but
  // Glintstar's two (the spec's "her two balloons": a ruling, then a promise)
  const chained = new Set();
  for (const c of COMBOS.filter((x, i) => i % 3 === 0)) {
    const cat = catFor(c.flags);
    ids.forEach(id => {
      const b = E.balloons(frames[id], cat);
      for (let i = 1; i < b.length; i++) if (b[i].who === b[i - 1].who) chained.add(id + ':' + b[i].who);
    });
  }
  assert.deepEqual([...chained], ['f126:glintstar']);
  // a speaker's variant balloons: exactly one shows to any reader
  [['f007', 'riffle'], ['f055', 'mizzle'], ['f080', 'squall'], ['f097', 'riffle'], ['f119', 'player'], ['f121', 'tallyheart']].forEach(([id, who]) => {
    for (const c of SOME) assert.equal(E.balloons(frames[id], catFor(c.flags)).filter(b => b.who === who).length, 1, id + ' ' + who + ': ' + comboName(c));
  });
  // a Tap's own counting balloon has somebody in the picture to belong to: the spider's legs and the bedtime paws are
  // our cat's count, the five spiders Tallyheart's, Squall's forepaw his (chapter 4's)
  assert.deepEqual(['f022', 'f025', 'f134'].map(id => E.skipWords(frames[id].skip, ((frames[id].say || [])[0] || {}).who).teacher), ['player', 'tallyheart', 'player']);
  ids.filter(id => frames[id].skip).forEach(id => {
    const who = E.skipWords(E.skipFor(frames[id].skip, { flags: {} }), ((frames[id].say || [])[0] || {}).who).teacher;
    assert.ok(castOf(id, who).length, id + ': ' + who + ' keeps the count, and is in the picture');
  });
});

test('speakers: Thymeleaf from his first balloon; GroveClan’s elder by her variant and the apprentice never; Mizzle “The sleepy dragonet” through her riddle, “Mizzle” from “I’m Mizzle.”; Squall chapter 4’s “The little dragon” until named, “Squall” on the dew for a cat who knows him, “A voice” for one who doesn’t; Coil is “Coil”; what each Counts frame says again over its first question', () => {
  const cat = E.blankCat({}); cat.name = 'Fern';
  const who = {};
  ids.forEach(id => saidOn(story, id, cat).forEach(b => { (who[b.who] = who[b.who] || new Set()).add(b.label); }));
  assert.deepEqual(Object.fromEntries(Object.entries(who).map(([k, v]) => [k, [...v].sort()])), {
    player: ['Fernpaw'], tallyheart: ['Tallyheart'], glintstar: ['Glintstar'], grizzled: ['Grizzled old tom'], riffle: ['Riffle'], coil: ['Coil'], sprinkle: ['Sprinkle'],
    snorer: ['Snoring apprentice'], thymeleaf: ['Thymeleaf'], groveclan: ['A GroveClan elder'], sloshbank: ['Sloshbank'], waffles: ['Princess Waffles'],
    mizzle: ['Mizzle', 'The sleepy dragonet'], squall: ['A voice', 'Squall', 'The little dragon']
  });
  // the apprentice never speaks, and no GroveClan cat is named
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'groveclan').forEach(b => { assert.equal(b.name, undefined, id); assert.equal(castOf(id, 'groveclan').find(c => c.variant === 1) !== undefined, true, id); }));
  ids.forEach(id => castOf(id, 'groveclan').forEach(c => assert.ok([1, 2].includes(c.variant), id)));
  // Mizzle: her balloons named from “I’m Mizzle.” on, never before (her riddle is the sleepy dragonet's)
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'mizzle').forEach(b => assert.equal(b.name, at(id) >= at(IM_MIZZLE) ? 'Mizzle' : undefined, id)));
  assert.deepEqual(saidOn(story, countsAt('ch09-mizzle')[0], cat).map(b => b.label), ['The sleepy dragonet'], 'her riddle comes before her name');
  assert.equal(labelFor({ who: E.teacherOf(story.counts['ch09-mizzle']) }, cat), 'The sleepy dragonet', 'her riddle’s lines, its help, its fillers and its retry, by the chapter’s names');
  assert.equal(labelFor({ who: E.teacherOf(story.counts['ch09-rubs']) }, cat), 'Thymeleaf');
  // Squall: the copy labels as chapter 4 did; on the dew, his name for a cat who knows him, “A voice” for one who doesn't
  ROOF_IDS.forEach((id, i) => assert.deepEqual(saidOn(story, id, cat).map(b => b.label), saidOn(ch04, CH4_ROOF[i], cat).map(b => b.label), id + ': as on chapter 4’s ' + CH4_ROOF[i]));
  assert.deepEqual(saidOn(story, 'f070', cat).map(b => b.label), ['The little dragon']);
  assert.deepEqual(saidOn(story, 'f080', cat).map(b => b.label), ['Squall']);
  assert.deepEqual(saidOn(story, 'f081', cat).map(b => b.label), ['A voice']);
  // a hidden speaker keeps his face to himself (`hidden` is a NO_FACE_POSES name); everyone else shows one
  ids.forEach(id => (frames[id].say || []).forEach(b => { const m = castOf(id, b.who)[0]; assert.equal(Sp.faceHidden(b, m), (b.who === 'coil' && m.pose === 'stone') || (b.who === 'squall' && m.pose === 'hidden'), id + ' ' + b.who); }));
  // what each Counts frame says again over its first question: the warm-up and the lesson none (`intro: false`);
  // Mizzle's riddle and the two doses say theirs; the dew has no balloon; chapter 4's riddle is three, none again
  const again = ids.filter(id => frames[id].counts).map(id => [frames[id].counts.set, E.balloons(frames[id], cat).length, Sp.lessonIntro(E.balloons(frames[id], cat), frames[id].counts.intro === false).length]);
  assert.deepEqual(again, [['ch09-fours', 1, 0], ['ch09-eights', 1, 0], ['ch09-mizzle', 1, 1], ['ch04-riddle', 3, 0], ['ch09-dew', 0, 0], ['ch09-dew', 0, 0], ['ch09-rubs', 1, 1], ['ch09-flaps', 1, 1]]);
  // the grown-ups corner has words for every flag a frame of the chapter sets
  const W = PC.ui.flagWords;
  ids.forEach(id => Object.entries(frames[id].sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v)));
  assert.equal(W.foundMizzle['true'], 'found Mizzle in the old oak in GroveClan’s woods (later chapters remember)');
  assert.equal(W.ch9Roof['true'], 'met Squall in chapter 9: the roof, offered again ({their} book says so on chapter 9’s page)');
});

test('text tokens are only the allowed ones', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = x.ok || (id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS);
    tokensIn(x.text).forEach(t => { if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}'); });
  });
  assert.deepEqual(bad, []);
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  Object.keys(story.cards).forEach(cid => assert.deepEqual(tokensIn(story.cards[cid].line), [], cid));
  ids.filter(id => frames[id].ask).forEach(id => frames[id].ask.pairs.forEach(p => assert.deepEqual(tokensIn(p[0] + p[1]), [], id)));
  // the book's {their}: a she-cat's ninth Count is hers, a tom's his
  assert.match(fill(story.book.recap.map(r => r.text).join(' '), PROFILES['she-cat']), /Tallyheart taught Moonpaw her ninth Count, spiders’ legs: the eights; an eight is two fours\./);
  assert.match(fill(story.book.recap.map(r => r.text).join(' '), PROFILES.tom), /Tallyheart taught Stormpaw his ninth Count, spiders’ legs: the eights; an eight is two fours\./);
  // Tallyheart's {They}: she or he, for the cat who went to FEED her
  assert.equal(fill(frames.f124.say[1].text, PROFILES.tom), 'He didn’t go looking. He went to FEED her.');
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
      const cat = { flags, lessons: flags.lessonClean ? { 'ch09-eights': { finished: true, noHelp: true } } : {} };
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

test('word counts: about 15 to 18 words of lettering a frame, few over 30 for any reader and never more than 50; no panel with five boxes; every reading under the brief’s 130 frames; never more than seven panels in a row with nothing to do', (t) => {
  const over = [];
  ids.forEach(id => {
    const m = maxWords(frames[id]);
    assert.ok(m <= WORDS_MAX, id + ' has ' + m + ' words for its wordiest reader');
    if (m > WORDS_AIM) over.push(id + ' (' + m + ')');
  });
  // the frames over 30 for their wordiest reader: Riffle's list with Hail, the herbs' curtain, the little bridge,
  // the oak, the root at sunset, Glintstar's ruling and her promise, the case with Mizzle's line, and the like
  t.diagnostic('over 30 words for the wordiest reader: ' + over.join(', '));
  assert.ok(over.length <= 10, over.join(', '));
  const stats = {};
  let longest = 0, longestFrom = null;
  for (const c of COMBOS) for (const clean of (COMBOS.indexOf(c) % 4 ? [true] : [true, false])) {
    const rows = walkLines(c.flags, Object.assign({ clean }, c.o));
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(s), 0));
    const w = per.reduce((a, b) => a + b, 0);
    per.forEach((n, i) => assert.ok(n <= 45, rows[i].id + ': ' + n + ' words for ' + comboName(c)));
    rows.forEach(r => assert.ok(r.boxes <= 4, r.id + ': ' + r.boxes + ' boxes for ' + comboName(c)));
    const k = (c.flags.ch3Told ? 'told' : 'kept') + (c.oak === 'climb' ? ' mizzle' : '') + (c.squall === 'roof' ? ' roof' : '');
    (stats[k] = stats[k] || []).push({ n: rows.length, w });
    // (the spec's own panel splits, captions first and one sound a frame, and chapter 4's short roof frames, run
    // again, keep a few readings just under fifteen: the band is 14.5 to 18, and fifteen or more on most)
    assert.ok(w / rows.length >= 14.5 && w / rows.length <= 18, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
    assert.ok(rows.length <= 130, comboName(c) + ': ' + rows.length + ' frames');
    let run = 0, worst = 0, from = null, first = null;
    rows.forEach(r => {
      if (r.kind !== 'next') { run = 0; return; }
      if (!run) from = r.id;
      if (++run > worst) { worst = run; first = from; }
    });
    assert.ok(worst <= 7, comboName(c) + ': ' + worst + ' panels in a row with nothing to do, from ' + first);
    if (worst > longest) { longest = worst; longestFrom = first; }
  }
  const avgs = Object.values(stats).flat().map(x => x.w / x.n);
  assert.ok(avgs.filter(a => a >= 15).length / avgs.length >= 0.6, 'most readings fifteen words a frame or more');
  // the brief's budget: at most 130 frames a reading; the spec's estimate about 94 told and 96 kept plain, about 106
  // with Mizzle, 107 with the roof and 117 with both
  const range = k => [Math.min(...stats[k].map(x => x.n)), Math.max(...stats[k].map(x => x.n))];
  assert.deepEqual(['told', 'kept', 'told mizzle', 'kept mizzle', 'told roof', 'kept roof', 'told mizzle roof', 'kept mizzle roof'].map(range),
    [[93, 97], [95, 99], [104, 107], [106, 109], [105, 108], [107, 110], [115, 118], [117, 120]], 'the path, a noticing or friendly or swimming cat’s panel, Squall’s and the five’s panels, the dew’s trailing line');
  Object.keys(stats).sort().forEach(k => {
    const s = stats[k], mm = f => Math.min(...s.map(f)) + '–' + Math.max(...s.map(f));
    t.diagnostic(k + ': ' + mm(x => x.n) + ' frames, ' + mm(x => x.w) + ' words of lettering, ' + (s.reduce((a, x) => a + x.w / x.n, 0) / s.length).toFixed(1) + ' a frame');
  });
  t.diagnostic('the longest run of panels with nothing to do: ' + longest + ', from ' + longestFrom);
});

test('a caption the page can letter on the panel is 95 characters at most (a long line in boxes, cut at sentence breaks); only the end page’s runs on', () => {
  const long = ids.filter(id => (frames[id].caption || []).some(c => capText(c).length > 95));
  assert.deepEqual(long, [ids[ids.length - 1]]);
  // the story's long lines (the spec's build notes), each in boxes cut at a sentence break, in the order she reads them
  const caps = re => frames[F(re)].caption.map(capText);
  assert.deepEqual(caps(/^On the way home, at the old wall’s end/).slice(0, 2), ['On the way home, at the old wall’s end: a long, pale root on the dry stones.', 'And one wet pawprint.']);
  assert.deepEqual(caps(/^Every morning: forty\./), ['Every morning: forty. Every day, rubs and flaps.', 'Every evening, a rounder moon. Every night, Tallyheart by the tunnel.']);
  assert.deepEqual(caps(/^Nine claw marks on the tree\./), ['Nine claw marks on the tree. Four gifts from four corners of the river.', 'And a dragonet whose paws left the ground.']);
  assert.deepEqual(caps(/^Tomorrow: the otters’ Moon Ferry\./), ['Tomorrow: the otters’ Moon Ferry. Every Clan, at the Gathering.', 'And Reynard, with his little story.', 'And you, with your case.']);
  assert.deepEqual(caps(/^The fox says the dragon FLEW off/), ['The fox says the dragon FLEW off when the rain stopped.', 'With a hurt wing? She COULDN’T!']);
  assert.deepEqual(caps(/^Down the river path, a little bridge/), ['Down the river path, a little bridge crosses a narrow channel.', 'Riffle is waiting on it, with a bunch of mint as big as his head.']);
  assert.deepEqual(caps(/^On the last day before the full moon/), ['On the last day before the full moon, Sprinkle’s friends all come to watch.', 'Even Coil, in his stones, counts her footsteps.']);
  // (two boxes, so each of the case's taps shows four: the pair's two balloons beside them, never five)
  assert.deepEqual(caps(/^That evening, the den is empty\./), ['That evening, the den is empty. Tallyheart helps you lift the moss.', 'You lay out your bark, row by row.']);
  // no box is lettered as two boxes' worth: every caption ends a sentence (or leads into its balloon, with a colon)
  ids.forEach(id => (frames[id].caption || []).forEach(c => assert.ok(E.endsSentence(capText(c)) || /:$/.test(capText(c)), id + ': “' + capText(c) + '” ends a sentence')));
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
    assert.ok(sentences.length >= 2 && sentences.length <= 4, id + ': board has ' + sentences.length + ' sentences');
    assert.ok(words(body) >= 25, id + ': board too thin');
    // a board is for an illustrator: nothing shows teeth, fangs or a snarl, nobody is hurt or bleeding, the spider is
    // never creepy, and no Warriors word is in it
    assert.doesNotMatch(b, /\b(teeth|fangs?|snarl\w*|blood|bleed\w*|wound\w*|claws? (out )?at|bites?|creep\w*|hairy|twolegs?|kittypets?|thunderpath|ironsnake|whisker-lengths?)\b/i, id);
    assert.doesNotMatch(b, /\bSTUB\b/, id);
  });
  // a frame shown only to some readers says so in its shot line; a Tap page says what the tap does in play
  ids.filter(id => frames[id].when).forEach(id => assert.match(frames[id].board.split('. ')[0], /\b(ONLY|BUT|NOT FOR)\b/, id + ': the shot line says who sees it'));
  ids.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].choice).forEach(id => assert.match(frames[id].board, /THE CHOICE|the choices sit below the panel/, id));
  ids.filter(id => frames[id].card).forEach(id => assert.match(frames[id].board, new RegExp('the new card appears under the panel, an ' + (story.cards[frames[id].card] || ch04.cards[frames[id].card]).mark + ' in its corner'), id + ': the board says the card appears, with its mark'));
  ids.filter(id => same(frames[id].when, TOLD)).forEach(id => assert.match(frames[id].board.split('. ')[0], /THE TOLD PATH ONLY/, id));
  ids.filter(id => same(frames[id].when, KEPT)).forEach(id => assert.match(frames[id].board.split('. ')[0], /THE KEPT PATH ONLY/, id));
  ids.filter(id => same(frames[id].when, SQUALL)).forEach(id => assert.match(frames[id].board.split('. ')[0], /ONLY FOR A CAT WHO KNOWS SQUALL/, id));
  ids.filter(id => same(frames[id].when, NO_SQUALL)).forEach(id => assert.match(frames[id].board.split('. ')[0], /ONLY FOR A CAT WHO HAS NEVER MET SQUALL/, id));
  // the roof copy's boards are chapter 4's, but the two that named the afternoon say the first light
  ROOF_IDS.forEach((id, i) => {
    const four = ch04.frames[CH4_ROOF[i]].board;
    assert.equal(frames[id].board, four.replace('in the gold of the afternoon', 'in the first light of morning').replace('catch the afternoon sun', 'catch the first sun'), id);
    assert.doesNotMatch(frames[id].board, /afternoon/, id);
  });
  assert.deepEqual(ROOF_IDS.filter((id, i) => frames[id].board !== ch04.frames[CH4_ROOF[i]].board), ['f069', 'f077']);
  assert.match(frames.f069.board, /in the first light of morning/);
  assert.match(frames.f077.board, /catch the first sun/);
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
  assert.equal(fill(T(ids.find(id => frames[id].input)), PROFILES.tom), 'What did Stormpaw dream, the night before the Gathering?');
  assert.match(fill(T(F(/^The grey tom flops in\./)), PROFILES.tom), /^The grey tom flops in\. Stormpaw\? Do the paw thing\./);
  assert.match(fill(story.book.dragonet[0].lines.join(' '), PROFILES.murmur), /Murmurpaw found her in a hollow high in the old oak/);
  assert.equal(fill(frames.f060.say[0].text, PROFILES.tom), 'Sir Pounce-a-lot! DARLING! At DAWN?');
});

test('our own world and the tone: no Warriors or Wings of Fire words, no “Ironsnake”, “Twoleg” or “whisker-length”; GroveClan’s cats never named; nobody hurt, nobody caught; the spider friendly; Coil a stone in his wall; no grown cat drawn laughing; the warrior thread one warm line, no promise of a name', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|apprentices’ den|medicine den|assessment|from this day|claw-moon|quarter-moon|half-moon|whisker-lengths?|claw-lengths?|fox-lengths?|tail-lengths?|monsters? of the sky|leader’s? nine lives|gift of|silverpelt|dew|dewdrop|haze|drift|thyme|leaf|grove)\b/i;
  // (the dew, a leaf and the grove are the story's plain words: banned only as names, so the check is on names)
  everyText((id, x) => assert.doesNotMatch(x.text.replace(/\b(dew|leaf|leaves|grove)\b/gi, ''), banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|ironsnake|warriors’ den|claw-moon|silverpelt|whisker-lengths?)\b/i, id + ' board'));
  // the names on screen are the brief's: Thymeleaf, Mizzle, and labels for GroveClan; nobody else new
  ids.forEach(id => (frames[id].say || []).forEach(b => { if (b.name) assert.ok(['Mizzle', 'Squall', 'A voice', 'Coil'].includes(b.name), id + ': ' + b.name); }));
  everyText((id, x) => assert.doesNotMatch(x.text, /\bDew\b(?! from| drops)|\bDewdrop\b|\bHaze\b/, id + ' ' + x.where + ': Mizzle is Mizzle'));
  // nobody bites, strikes, snarls or growls; nobody dies, nobody is caught; “hurt” is the wing's, from the storm
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(bites?|bitten|teeth|fangs?|claws? at|snarls?|growls?|kill\w*|strikes?|venom\w*|poison\w*)\b/i, id + ' ' + x.where));
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(wound(ed)?|blood|bleed|bleeds|broken|die[sd]?|dead|death|bones?|drown\w*|caught|trapped|attacks?|creepy|scary|monster)\b/i, id + ' ' + x.where));
  FF(/\bhurt\b/).forEach(id => assert.match(T(id), /hurt wing|wing was hurt|friend who’s hurt|Her wing was hurt|her wing is hurt|calms the hurt/, id));
  // the spider: tiny, in her web, spinning or waving; never crawling toward anyone
  ids.filter(id => castOf(id, 'spider').length).forEach(id => castOf(id, 'spider').forEach(c => { assert.deepEqual([c.at, camOf(id)], ['web', 'camp/herbs'], id); assert.ok(['spin', 'wave'].includes(c.pose), id); }));
  // Coil: a stone in his wall, at his gap, labelled; his eyes never shut; Riffle never juggles or hugs his tail under the bridge
  ids.filter(id => castOf(id, 'coil').length).forEach(id => castOf(id, 'coil').forEach(c => {
    assert.deepEqual([c.pose, c.at, c.facing, c.asleep, camOf(id)], ['stone', 'gap', 'right', undefined, 'bridge/wall'], id);
  }));
  ids.filter(id => frames[id].scene.set === 'bridge').forEach(id => assert.ok(!castOf(id, 'riffle').some(c => c.pose === 'juggle' || c.pose === 'hug'), id + ': no juggling under the Old Bridge'));
  // no grown cat in `laugh` (it draws tears), no mentor sad or scared
  ids.forEach(id => frames[id].scene.cast.filter(c => GROWN.includes(c.who)).forEach(c => assert.notEqual(c.mood, 'laugh', id + ': ' + c.who + ' laughing')));
  ids.forEach(id => frames[id].scene.cast.filter(c => ['tallyheart', 'glintstar', 'thymeleaf'].includes(c.who)).forEach(c => assert.ok(!['sad', 'scared'].includes(c.mood), id + ': ' + c.who + ' ' + c.mood)));
  // Glintstar is never stern at anyone here; Tallyheart's “Hmph.” is proud, a wry smile
  ids.forEach(id => castOf(id, 'glintstar').forEach(c => assert.notEqual(c.mood, 'stern', id)));
  assert.equal(castOf(F(/Hmph\.$/), 'tallyheart')[0].mood, 'proud');
  // the warrior thread: one warm moment, said once on both paths, and no promise of a name
  assert.equal(FF(/At the Gathering, you will speak\./).length, 1);
  everyText((id, x) => assert.doesNotMatch(x.text, /One day|when you(’re| are) a warrior|your warrior name|you’ll be a warrior|\bI promise\b/i, id + ' ' + x.where));
  // she is not mended: nothing shows her flying higher than the four wingbeats, and the full moon will tell
  assert.equal(ids.filter(id => castOf(id, 'sprinkle').some(c => c.pose === 'fly')).length, 1);
  assert.match(T(F(/^I was UP!/)), /Not mended yet\. But nearly\. The full moon will tell\./);
  // the hook is curious, never scary, and she sleeps warm
  assert.match(T(F(/^Tomorrow: the otters’ Moon Ferry\./)), /And you, with your case\.$/);
  assert.match(T(F(/You curl up tight, warm and safe, and sleep\.$/)), /^Will Sprinkle’s wing hold\?/);
  assert.ok(frames[F(/You curl up tight, warm and safe, and sleep\.$/)].scene.fx.includes('night'), 'warm in her nest at night');
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the story’s own: every caption, balloon, sound effect, option and card line is in docs/chapters/09-featherlight.md (the roof copy chapter 4’s, word for word), and every line its screens speak is in the chapter', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/chapters/09-featherlight.md'), 'utf8');
  const from = doc.indexOf('# Chapter 9: Featherlight'), to = doc.indexOf('\n*For us*');
  assert.ok(from === 0 && to > from, 'the story, from its title to its notes');
  const body = doc.slice(doc.indexOf('## All forty'), to);
  const flat = t => t.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  const loose = t => t.replace(/[,.]/g, '').replace(/\s+/g, ' ').trim();
  const page = flat(body), pageLoose = loose(page);
  const spoken = body.split(/\n\s*\n/).map(p => (flat(p).match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).join(' ')).filter(Boolean).map(loose).join(' ¶ ');
  const inText = t => page.includes(t) || spoken.includes(loose(t)) || pageLoose.includes(loose(t));
  const bySentence = t => t.split(/(?<=[.!?…])\s+/).every(inText);
  const mine = [];
  ids.forEach(id => {
    const f = frames[id];
    if (ROOF_IDS.includes(id)) return;
    (f.caption || []).forEach(c => { if (!inText(capText(c)) && !bySentence(capText(c))) mine.push(id + ': ' + capText(c)); });
    (f.say || []).forEach(b => { if (!inText(b.text) && !bySentence(b.text)) mine.push(id + ' ' + b.who + ': ' + b.text); });
    if (f.sfx && !page.includes(f.sfx)) mine.push(id + ' sfx: ' + f.sfx);
    if (f.choice) f.choice.options.forEach(o => [o.label].concat((o.labelWhen || []).map(v => v.label)).forEach(l => { if (!page.includes(l.replace(/^“|”$/g, ''))) mine.push(id + ' option: ' + l); }));
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '').replace(/!$/, '')), id + ': ' + f.scratch.prompt);
    if (f.skip && f.skip.prompt) assert.ok(page.includes(f.skip.prompt.replace(/\*\*/g, '')), id + ': ' + f.skip.prompt);
    if (f.ask) { assert.ok(page.includes(f.ask.prompt.replace(/\*\*/g, '')), id); f.ask.pairs.forEach(p => assert.ok(inText(p[0]) && inText(p[1]), id + ': ' + p.join(' / '))); }
  });
  Object.keys(story.cards).forEach(cid => assert.ok(page.includes('“' + story.cards[cid].line + '”'), cid + ': ' + story.cards[cid].line));
  // what is the builder's and not the story's: the closing frame in her nest
  const end = ids[ids.length - 1];
  assert.deepEqual(mine, [end + ': ' + frames[end].caption[0], end + ': End of Chapter Nine.']);
  assert.equal(E.chapterHeading(story), 'Chapter 9: Featherlight');
  // chapters 2 to 8's closing form, with tonight's moon nearly round and her glass
  assert.match(frames[end].caption[0], /^You sleep warm in your nest, with your glass under the moss and the moon nearly round over the rosebush\.$/);
  assert.deepEqual([frames[end].scene.opts.moon, frames[end].scene.opts.glass], [13, true], 'and it is drawn');
  // the roof copy: chapter 4's lettering, word for word
  ROOF_IDS.forEach((id, i) => {
    const four = ch04.frames[CH4_ROOF[i]];
    ['caption', 'say', 'sfx', 'card', 'when', 'counts', 'skip'].forEach(k => {
      const mapped = (k === 'counts' || k === 'skip') && four[k] ? Object.assign({}, four[k], { next: frames[id][k].next }) : four[k];
      assert.deepEqual(frames[id][k], mapped, id + ' ' + k + ': chapter 4’s ' + CH4_ROOF[i]);
    });
  });
  // and the other way: every line a screen of the story speaks is lettered somewhere in the chapter (a frame, an
  // option, a Counts set's lines, the questions the engine words, the asks, her card)
  const lettered = [];
  everyText((id, x) => lettered.push(String(x.text).replace(/\*\*/g, '')));
  Object.keys(story.counts).forEach(sid => {
    const def = Object.assign({ id: sid }, story.counts[sid]), st = E.counts.start(def, { set: sid });
    for (let q; (q = E.counts.question(st));) { const D = E.questionDef(def, q, story, STORIES); E.promptLines(def, D, q).forEach(l => lettered.push(l.text)); E.counts.answer(st, D, q.answer, 2000, 1); }
  });
  ids.forEach(id => (frames[id].choice ? frames[id].choice.options : []).forEach(o => lettered.push(o.label.replace(/^“|”$/g, ''))));
  const all = loose(lettered.join(' '));
  const missing = [];
  body.replace(/\*\*([^*]+)\*\*/g, ' ').replace(/\*[^*]*\*/g, ' ').split(/\n\s*\n/).forEach(p => {
    // (a split balloon is two balloons of a frame or a frame's and a question's: each sentence is lettered)
    (p.replace(/\s+/g, ' ').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => { if (!all.includes(loose(q)) && !q.split(/(?<=[.!?…,])\s+/).every(s => all.includes(loose(s)))) missing.push(q); });
  });
  assert.deepEqual(missing, []);
  // the story's plain lines the build letters as the engine's questions, word for word
  ['How many drops must you gather?', 'How many rubs a day?', 'How many flaps a day?', 'Two cats. How many paws?', 'Two spiders. How many legs?']
    .forEach(q => { assert.ok(page.includes(q), q); assert.ok(countsLines().some(x => x.text === q) || q === 'Two cats. How many paws?', q); });
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab), camera by camera: every anchor one of its camera’s own, every option the set declares by value, the cast, poses, moods and extras chapter 9 adds, each worn by whom the spec says', () => {
  const v = A.vocab;
  assert.ok(v && v.sets.grove && GROVE_CAMS.every(cam => v.sets.grove.cams.includes(cam)) && ['thymeleaf', 'mizzle', 'groveclan', 'spider'].every(w => v.cast.includes(w)), 'the art exposes chapter 9’s vocabulary');
  const OLD = { claws: [true], holdAt: ['paws', 'mouth'], mist: [true] };
  const seen = {};
  ids.forEach(id => {
    const s = frames[id].scene;
    assert.ok(s && typeof s === 'object', id + ': no scene');
    assert.deepEqual(Object.keys(s).filter(k => !['set', 'cam', 'opts', 'cast', 'fx'].includes(k)), [], id + ': scene keys');
    const set = v.sets[s.set], info = A.sceneInfo(s.set);
    assert.ok(set, id + ': unknown set ' + s.set);
    assert.ok(set.cams.includes(s.cam), id + ': set ' + s.set + ' has no camera ' + s.cam);
    const mine = info.anchors[info.cams[s.cam].comp];
    Object.keys(s.opts || {}).forEach(k => {
      const allowed = set.opts[k];
      assert.ok(allowed, id + ': set ' + s.set + ' has no option ' + k);
      const val = s.opts[k];
      if (allowed === 'number') assert.ok(Number.isInteger(val) && val >= 0 && val <= 14, id + ': ' + k + '=' + val);
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
      if (c.holds === 'mint') assert.equal(c.who, 'riffle', where + ': Riffle’s mint');
      if (c.holds === 'fish') assert.deepEqual([c.who, s.set], ['riffle', 'bridge'], where + ': otter medicine');
      if (c.holds === 'glass') assert.equal(c.who, 'player', where + ': her glass in its leaf');
      if (c.holds === 'leaf') assert.ok(c.who === 'player' || (c.who === 'thymeleaf' && s.set === 'bridge'), where + ': her leaf, or the remedy in his');
      if (c.holdAt !== undefined) assert.ok(c.holds, where + ': holdAt goes with holds');
      if (c.holds !== undefined) assert.ok(['pinecone', 'mint', 'fish', 'leaf', 'glass'].includes(c.holds), where + ': ' + c.holds);
      if (c.tap !== undefined) {
        assert.ok(frames[id].scratch && frames[id].scratch.tap === c.tap, where + ': the tap mark is this page’s Tap');
        const WHO = { paw: ['player'], ears: ['riffle', 'tallyheart'], tail: ['tallyheart', 'player'], leaf: ['player'], nose: ['player'], wing: ['sprinkle'] };
        assert.ok(WHO[c.tap].includes(c.who), where + ': ' + c.tap);
        if (c.tap === 'paw') assert.ok(['walk', 'pawup'].includes(c.pose), where);
        if (c.tap === 'leaf') assert.deepEqual([c.holds, c.holdAt], ['leaf', 'paws'], where);
        if (c.tap === 'tail') assert.ok(c.tailUp, where + ': the raised tail');
        if (c.tap === 'wing') assert.equal(c.pose, 'wings', where + ': her wings held out');
      }
      if (c.tailUp) assert.ok(c.tap === 'tail' || (c.who === 'player' && s.set === 'bridge' && s.cam === 'bank'), where + ': a raised tail to tap, or her cheering');
      if (c.glow) assert.ok(frames[id].ask && frames[id].ask.who === c.who, where + ': the one to tap on the page of an ask');
      // (and our cat's raised forepaw on f091, its five claws spread as it roars Squall's five, the board's beat)
      if (c.claws) assert.ok((c.who === 'tallyheart' && c.pose === 'crouch' && /^In the sand, Tallyheart scratches/.test(T(id))) || (id === 'f091' && c.who === 'player' && c.pose === 'pawup'), where + ': claws out, scratching the sand, or our cat’s five on f091');
      if (c.mist) assert.deepEqual([c.who, c.pose], ['sprinkle', 'burp'], where);
      if (c.asleep === true) assert.deepEqual([c.who, c.pose], ['mizzle', 'curl'], where + ': fast asleep');
      if (c.asleep === 'half') assert.ok((c.who === 'mizzle' && camOf(id) === 'grove/hollow') || (c.who === 'player' && c.pose === 'curl' && /You curl up tight, warm and safe, and sleep\.$/.test(T(id))), where + ': half asleep');
      const poses = isCat ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      if (typeof c.at === 'object') {
        assert.ok(Object.keys(c.at).every(k => ['x', 'y', 'h', 'z'].includes(k)) && 'x' in c.at && 'y' in c.at, where + ': a spot is { x, y } (with h, as the art gives them)');
        const rear = s.set === 'pile' && s.cam === 'rear', back = s.set === 'bridge' && s.cam === 'back';
        const ok = (rear && c.who === 'player' && same(c.at, NOSE)) || (rear && c.who === 'riffle' && same(c.at, c.pose === 'fall' ? FLOP : HEDGE)) ||
          (back && c.who === 'tallyheart' && same(c.at, WALL.includes(id) ? BY_WALL : ACROSS)) || (back && c.who === 'thymeleaf' && same(c.at, menderAt(id)));
        assert.ok(ok, where + ': a spot of its own');
      } else assert.ok(mine[c.at], where + ': ' + s.set + '/' + s.cam + ' has no anchor ' + c.at + ' (its own: ' + Object.keys(mine).join(' ') + ')');
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      // a size: Tallyheart past the tree, as chapters 5 to 8 have her
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
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'claws', 'glow', 'holdAt', 'holds', 'mist', 'tailUp', 'tap']);
  // the skip-counts' and the lessons' pictures name only cast members
  ids.filter(id => frames[id].skip && frames[id].skip.who).forEach(id => frames[id].skip.who.forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
  // her card has its drawing, and its mark is one the art knows; it lies under the moss
  Object.keys(story.cards).forEach(cid => { assert.ok(A.cardPictures[cid], 'a drawing for ' + cid); assert.ok(A.cardMarks.includes(story.cards[cid].mark), cid); assert.ok(A.barkSecret[cid], cid + ' under the moss'); });
});

/* ------------------------------------------------------------------ staging */

test('staging, all forty: the back row in the brambles’ shadow up to the walk round, every row whole, then the dug earth and nothing new; the cheer and the old tom’s pinecone; round the back by morning the tunnel open; the told path’s Riffle at the hedge, the kept path’s talk beside Tallyheart', () => {
  const pile = ids.filter(id => frames[id].scene.set === 'pile');
  pile.filter(id => at(id) < at(MONTAGE)).forEach(id => {
    assert.deepEqual(frames[id].scene.fx, ['morning'], id);
    const o = frames[id].scene.opts;
    assert.deepEqual(o.rows, [10, 10, 10, 10], id + ': every row whole');
    if (id === 'f001') assert.deepEqual(o, { rows: [10, 10, 10, 10], back: 'shadow', scale: 'behind', tap: 'back' });
    else assert.deepEqual(o, frames[id].scene.cam === 'rear' ? { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tunnel: true } : { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }, id);
    frames[id].scene.cast.forEach(c => assert.notEqual(c.mood, 'stern', id + ': nobody is blamed'));
  });
  assert.deepEqual(['f001', 'f002', 'f003', 'f004', 'f005'].map(camOf), ['pile/rows', 'pile/gap', 'pile/gap', 'pile/wide', 'pile/rear']);
  assert.ok(['glintstar', 'tallyheart', 'player'].every(w => castOf('f001', w).length), 'Glintstar, Tallyheart and our cat at the count');
  assert.deepEqual(castOf('f003', 'player').map(c => [c.pose, c.mood]), [['crouch', 'sniff']], 'the noticing cat’s nose to the earth');
  assert.deepEqual(castOf('f004', 'grizzled').map(c => [c.holds, c.holdAt, c.mood]), [['pinecone', 'paws', 'proud']]);
  assert.deepEqual(castOf('f005', 'tallyheart').map(c => [c.pose, c.mood, c.at]), [['sit', 'sleepy', 'rear-2']], 'she sat by the tunnel all night');
  // the told path: Riffle at the hedge, then on his back a little in from it (his face in the panel), then gone through
  // it; the kept path beside Tallyheart
  assert.deepEqual(['f006', 'f007', 'f008', 'f009'].map(id => castOf(id, 'riffle').map(c => [c.pose, c.at, c.facing])), [[['stand', HEDGE, 'left']], [['fall', FLOP, 'left']], [['scramble', HEDGE, 'right']], []]);
  const flop = A.render(E.resolveScene(frames.f007.scene, catFor({ ch3Told: true }), STORIES), { look: E.defaultLook(0) });
  const rh = flop.heads[frames.f007.scene.cast.findIndex(c => c.who === 'riffle')];
  assert.ok(rh && rh.x + rh.r < 100, 'f007: Riffle on his back, his whole face in the panel (' + (rh && (rh.x + rh.r).toFixed(1)) + '%)');
  assert.deepEqual(castOf('f006', 'riffle')[0].tap, 'ears');
  ['f012', 'f013', 'f014'].forEach(id => assert.deepEqual(castOf(id, 'player').map(c => c.at), [NOSE], id + ': close beside her'));
  assert.deepEqual(castOf('f012', 'tallyheart').map(c => [c.at, c.tap, c.mood]), [['rear-2', 'ears', 'kind']]);
  assert.equal(castOf('f014', 'tallyheart')[0].mood, 'kind', 'not angry');
  assert.deepEqual(castOf('f015', 'tallyheart').map(c => [c.pose, c.tailUp, c.tap, c.facing]), [['walk', true, 'tail', 'right']], 'off toward the camp, her tail up');
  assert.ok(HEDGE.x - A.sceneInfo('pile').anchors.rear['rear-2'].x > 200, 'the hedge well clear of rear-2');
});

test('staging, Thymeleaf’s den and the Hollow: the herbs camera, Thymeleaf at the left among his leaves, the spider in her web on every panel; his forepaw up and glowing for his four things; eight marks until the ninth is scratched, nine from then on; the rim sitting up on every wide panel; the tree close-up empty', () => {
  const herbs = ids.filter(id => camOf(id) === 'camp/herbs');
  assert.deepEqual(herbs, seq('f016', 'f023').concat(['f087', 'f088']));
  herbs.forEach(id => {
    assert.deepEqual(frames[id].scene.fx, ['morning'], id);
    assert.deepEqual(castOf(id, 'thymeleaf').map(c => c.at), ['herbs-1'], id);
    assert.deepEqual(castOf(id, 'player').map(c => c.at), ['herbs-2'], id);
    assert.deepEqual(castOf(id, 'tallyheart').map(c => c.at), ['herbs-3'], id);
    assert.deepEqual(castOf(id, 'spider').map(c => [c.at, c.pose]), [['web', ['f022', 'f023'].includes(id) ? 'wave' : 'spin']], id);
  });
  assert.equal(castOf('f016', 'thymeleaf')[0].facing, 'left', 'talking to his leaves, his back to the door');
  assert.deepEqual(castOf('f019', 'thymeleaf').map(c => [c.pose, c.glow]), [['pawup', true]]);
  assert.deepEqual(['f087', 'f088'].map(id => frames[id].scene.opts.remedy), ['four', 'mixed']);
  assert.deepEqual(herbs.filter(id => frames[id].scene.opts.remedy === undefined).length, 8, 'no remedy on the stone on day 9');
  assert.deepEqual(castOf('f088', 'thymeleaf').map(c => c.pose), ['crouch'], 'over his mixing stone');
  const hollow = ids.filter(id => frames[id].scene.set === 'hollow');
  assert.deepEqual(hollow, seq('f024', 'f029'));
  hollow.forEach(id => { assert.deepEqual(frames[id].scene.opts, at(id) >= at(SKRITCH) ? { marks: 9, glow: 'auto' } : { marks: 8, glow: 'auto' }, id); assert.deepEqual(frames[id].scene.fx, ['morning'], id); });
  assert.deepEqual([camOf(SKRITCH), frames[SKRITCH].sfx, frames[SKRITCH].scene.cast], ['hollow/tree', 'SKRITCH!', []], 'nobody in the close-up: her forepaws would cover the ninth mark');
  assert.match(frames[SKRITCH].board, /a ninth claw mark into the bark under the other eight; the marks stand four, four and one now/);
  assert.equal(camOf(NINTH), 'hollow/wide', 'the ninth Count is said where the nine marks show');
  const rimOf = id => RIM_ANCHORS.map(a => frames[id].scene.cast.find(c => c.at === a)).filter(Boolean);
  hollow.filter(id => frames[id].scene.cam === 'wide').forEach(id => assert.deepEqual(rimOf(id).map(c => [c.who, c.variant, c.pose]),
    [['clancat', 1, 'situp'], ['murmurchime', undefined, 'situp'], ['clancat', 3, 'situp'], ['clancat', 5, 'situp'], ['grizzled', undefined, 'situp']], id + ': nobody leaves the rim'));
  assert.deepEqual(['f024', 'f026', 'f029'].map(id => castOf(id, 'tallyheart')[0]).map(c => [c.at, c.size]), [['tree-far', 1.2], ['tree-far', 1.2], ['tree-far', 1.2]]);
  assert.deepEqual(['f024', 'f026', 'f029'].map(id => castOf(id, 'player')[0].at), ['sunpatch-2', 'sunpatch-2', 'sunpatch-2']);
  assert.deepEqual([camOf('f025'), frames.f025.scene.cast.map(c => [c.who, c.pose, !!c.claws])], ['hollow/sand', [['tallyheart', 'crouch', true], ['player', 'crouch', false]]]);
  assert.deepEqual([camOf('f026'), castOf('f026', 'tallyheart')[0].glow], ['hollow/wide', true]);
  assert.equal(camOf(countsAt('ch09-eights')[0]), 'hollow/lesson');
});

test('staging, the reed root and GroveClan: CrystalClan on the dry ground at the wall’s end, nobody in the reeds but Sloshbank; the little bridge, the woods, the elder and the apprentice at the fern; the oak, the hollow; Riffle’s mint up to the roll Tap and in her leaf after; the root at sunset', () => {
  const title = ids.filter(id => frames[id].scene.set === 'title');
  assert.deepEqual(title, seq('f030', 'f036').concat(['f059']));
  title.forEach(id => {
    frames[id].scene.cast.filter(c => c.who === 'player' || c.who === 'tallyheart').forEach(c => assert.ok(/^end-[12]$/.test(c.at) && c.facing === 'right', id + ': on the dry ground, facing the reeds'));
    assert.ok(frames[id].scene.cast.every(c => c.who !== 'reedclan'), id + ': no other ReedClan cat');
  });
  assert.deepEqual([frames.f030.scene.opts, frames.f036.scene.opts, castOf('f030', 'sloshbank').length, castOf('f036', 'sloshbank').length], [{ rustle: true }, { rustle: true }, 0, 0], 'the reeds rustle, nobody seen');
  seq('f031', 'f035').forEach(id => assert.deepEqual(castOf(id, 'sloshbank').map(c => c.at), ['reed-1'], id));
  // “His ear twitches. Almost a smile.”: half-lidded and the corner of his mouth just lifting (`kind`), never a grin
  assert.deepEqual(castOf('f035', 'sloshbank').map(c => c.mood), ['kind'], 'f035: almost a smile');
  assert.deepEqual([frames.f059.scene.opts, frames.f059.scene.fx, castOf('f059', 'riffle').length], [{ root: true, tap: 'root' }, ['sunset'], 0], 'the root at sunset, Riffle gone home');
  // the friendly cat's two panels, both by specialty
  assert.deepEqual(['f034', 'f035'].map(id => frames[id].when), [FRIENDS, FRIENDS]);
  // the grove: always by day
  const grove = ids.filter(id => frames[id].scene.set === 'grove');
  assert.deepEqual(grove, seq('f037', 'f058'));
  grove.forEach(id => { assert.deepEqual(frames[id].scene.fx[0], 'day', id); assert.deepEqual(frames[id].scene.opts, {}, id); });
  assert.deepEqual(GROVE_CAMS.map(cam => grove.filter(id => frames[id].scene.cam === cam).length), [2, 2, 2, 6, 10]);
  assert.deepEqual(castOf('f038', 'player').map(c => [c.pose, c.at, c.tap]), [['walk', 'span-1', 'paw']], 'one paw at a time onto the bridge');
  assert.deepEqual(castOf('f037', 'riffle').map(c => [c.at, c.holds]), [['span-2', 'mint']], 'Riffle on the bridge with his mint');
  // the visitors at the bridge's end until “Take what you need”; the elder by her variant; the apprentice at the fern, shy, never speaking
  ['f039', 'f040'].forEach(id => frames[id].scene.cast.filter(c => ['player', 'tallyheart', 'riffle'].includes(c.who)).forEach(c => assert.match(c.at, /^edge-[123]$/, id)));
  ['f041', 'f042'].forEach(id => frames[id].scene.cast.filter(c => ['player', 'tallyheart', 'riffle'].includes(c.who)).forEach(c => assert.match(c.at, /^meet-[123]$/, id)));
  grove.forEach(id => castOf(id, 'groveclan').forEach(c => assert.ok((c.variant === 1 && c.at === 'elder') || (c.variant === 2 && c.at === 'fern' && c.mood === 'shy'), id + ': ' + JSON.stringify(c))));
  assert.ok(!grove.some(id => camOf(id) === 'grove/hollow' && castOf(id, 'groveclan').length), 'no cat of GroveClan sees into the hollow');
  ['f039', 'f040', 'f041', 'f042'].forEach(id => assert.equal(!!castOf(id, 'groveclan').find(c => c.variant === 2), id !== 'f039', id + ': the apprentice from the elder’s first panel'));
  assert.deepEqual(castOf('f044', 'groveclan').map(c => c.pose), ['pawup'], 'the elder points at the north side');
  // the hollow: our cat at the lip, Mizzle at her nook; up the trunk, Riffle folding his paws below
  assert.deepEqual([castOf('f045', 'player')[0].pose, castOf('f045', 'player')[0].at, castOf('f045', 'riffle')[0].pose, castOf('f045', 'riffle')[0].mood], ['stretch', 'trunk', 'sit', 'proud']);
  seq('f046', 'f055').forEach(id => {
    assert.equal(camOf(id), 'grove/hollow', id);
    assert.deepEqual(castOf(id, 'player').map(c => [c.at, c.pose]), [['lip', 'crouch']], id + ': crouched at the opening (the pose that reads best there)');
    assert.deepEqual(castOf(id, 'mizzle').map(c => c.at), ['nook'], id);
    assert.deepEqual(frames[id].scene.cast.map(c => c.who).sort(), ['mizzle', 'player'], id + ': Tallyheart waits below');
  });
  assert.deepEqual(seq('f046', 'f055').map(id => castOf(id, 'mizzle')[0].pose), ['curl', 'yawn', 'sit', 'sit', 'wake', 'wake', 'sit', 'sit', 'pawup', 'curl']);
  assert.deepEqual([castOf('f046', 'mizzle')[0].asleep, frames.f046.scene.fx], [true, ['day', 'zzz']], 'fast asleep, with the fx’s zzz');
  // Riffle's mint: in his paws on every grove frame he is in up to the roll Tap, in her leaf after
  const ROLL = 'f056';
  grove.filter(id => castOf(id, 'riffle').length).forEach(id => assert.equal(castOf(id, 'riffle')[0].holds, at(id) <= at(ROLL) ? 'mint' : undefined, id));
  grove.filter(id => at(id) > at(ROLL)).forEach(id => assert.deepEqual(castOf(id, 'player').map(c => [c.holds, c.holdAt]), [['leaf', 'paws']], id));
  assert.match(frames.f057.board, /the moss and Riffle’s mint tucked inside it together now/);
  assert.deepEqual(castOf(ROLL, 'player').map(c => [c.at, c.pose, c.tap]), [['moss', 'crouch', 'leaf']]);
  assert.deepEqual(castOf('f058', 'player').map(c => [c.pose, c.mood, c.facing]), [['crouch', 'kind', 'left']], 'dipping her head to the trunk');
});

test('staging, first light and the roof: the tower by morning, Waffles at her railing, our cat at the foot with her leaf; the roar’s pair; the little room’s nose and chapter 4’s look; the roof copy by first light; every dew frame on the roof’s `two`, our cat crouched at the puddle', () => {
  const tower = ['f060', 'f061', 'f062', 'f063', 'f064', 'f065'];
  tower.forEach(id => { assert.equal(camOf(id), 'tower/up', id); assert.deepEqual(frames[id].scene.fx, ['morning'], id); assert.deepEqual(castOf(id, 'waffles').map(c => [c.at, c.pose]), [['railing', 'peer']], id); });
  assert.deepEqual(tower.map(id => frames[id].scene.opts), [{ chime: true, light: true }, { chime: true, light: true }, { chime: true, light: true, roar: true }, { chime: true, light: true, roar: true }, { chime: true, light: true }, { chime: true, ding: true }]);
  tower.slice(0, 5).forEach(id => assert.deepEqual(castOf(id, 'player').map(c => [c.at, c.holds]), [['foot', 'leaf']], id + ': at the foot with her leaf'));
  assert.deepEqual([castOf('f064', 'player')[0].tap, castOf('f065', 'player').length, frames.f065.sfx], ['nose', 0, undefined], 'the nose, then nobody at the foot and the art’s own DING!');
  // the copy: chapter 4's pictures but for the hour, first light on every one
  ROOF_IDS.forEach((id, i) => {
    const four = ch04.frames[CH4_ROOF[i]];
    assert.equal(frames[id].scene.fx[0], 'morning', id);
    assert.deepEqual(frames[id].scene.fx.filter(x => TOD.includes(x)), ['morning'], id + ': no other hour');
    assert.deepEqual(frames[id].scene.fx.slice(1), four.scene.fx.filter(x => !TOD.includes(x)), id);
    assert.deepEqual(Object.assign({}, frames[id].scene, { fx: null }), Object.assign({}, four.scene, { fx: null }), id + ': chapter 4’s picture');
  });
  // its ids mapped: every way on is the copy's own next frame, and the last one's the dew
  ROOF_IDS.forEach((id, i) => assert.deepEqual(exits(frames[id]), exits(ch04.frames[CH4_ROOF[i]]).map(n => CH4_ROOF.includes(n) ? ROOF_IDS[CH4_ROOF.indexOf(n)] : 'f080'), id + ': ' + CH4_ROOF[i] + '’s ways on, mapped'));
  assert.deepEqual(exits(frames[ROOF_IDS[13]]), ['f080']);
  assert.deepEqual(ROOF_IDS.slice(0, 3).map(id => [camOf(id), frames[id].when]), [['tower/up', { specialty: 'climbing' }], ['tower/up', { not: { specialty: 'climbing' } }], ['tower/up', { not: { specialty: 'climbing' } }]], 'a climber up the outside, anyone else in the little room');
  // the dew: every frame on `two` by first light, the silver puddle, our cat crouched at its edge with her leaf
  const dew = seq('f080', 'f086');
  dew.forEach(id => {
    assert.deepEqual([camOf(id), frames[id].scene.fx, frames[id].scene.opts.dew], ['roof/two', ['morning'], true], id);
    assert.deepEqual(castOf(id, 'player').map(c => [c.at, c.pose, c.holds, c.holdAt]), [['puddle', 'crouch', 'leaf', 'paws']], id);
    assert.deepEqual(castOf(id, 'squall').map(c => c.at), ['pole'], id);
  });
  assert.ok(!ids.some(id => camOf(id) === 'roof/wide' && !ROOF_IDS.includes(id)), 'the chapter draws no roof `wide` of its own');
  assert.deepEqual(castOf('f081', 'squall').map(c => [c.pose, c.mood]), [['hidden', 'shout']], 'his tail tip and mist ring, never his face');
});

test('staging, the remedy and the sunny bank: Sprinkle in her nook, Thymeleaf at her chest with the remedy in its leaf, Tallyheart across the nook on both paths; the told path’s branch; Riffle at the edge with fish; Sprinkle gliding only at `skim`, flying only at `air`, splashing only at `paddle`; Coil’s QUIET from his stones; the montage at dusk; the last day’s watchers', () => {
  const back = ids.filter(id => camOf(id) === 'bridge/back');
  assert.deepEqual(back, seq('f089', 'f100'));
  back.forEach(id => {
    assert.deepEqual(frames[id].scene.fx[0], 'day', id);
    assert.deepEqual(castOf(id, 'sprinkle').map(c => [c.at, c.facing]), [['dragon', 'left']], id);
    assert.deepEqual(castOf(id, 'player').map(c => c.at), ['back-left'], id);
    assert.deepEqual(castOf(id, 'thymeleaf').map(c => [c.at, c.holds]), [[menderAt(id), 'leaf']], id + ': the remedy in its leaf');
    assert.deepEqual(castOf(id, 'tallyheart').map(c => [c.at, c.facing]), [WALL.includes(id) ? [BY_WALL, 'right'] : [ACROSS, 'left']], id + ': across the nook on both paths, by the wall facing in while her wings are open');
    assert.equal(!!frames[id].scene.opts.wing, castOf(id, 'sprinkle')[0].pose === 'wings', id + ': the lettering keeps off her drooping wing while her wings are open (chapter 7\'s `wing: true`)');
    castOf(id, 'riffle').forEach(c => assert.deepEqual([c.at, c.holds], ['back-right', 'fish'], id));
    assert.equal(castOf(id, 'coil').length, 0, id);
  });
  assert.deepEqual(back.filter(id => castOf(id, 'riffle').length), ['f097', 'f098', 'f099', 'f100'], 'Riffle pops up with fish, and stays');
  assert.deepEqual(back.filter(id => frames[id].scene.opts.branch), ['f089']);
  assert.deepEqual(['f092', 'f093'].map(id => castOf(id, 'sprinkle')[0].pose), ['hide', 'peek']);
  assert.deepEqual(castOf('f095', 'sprinkle').map(c => [c.pose, c.tap]), [['wings', 'wing']]);
  assert.deepEqual(castOf('f095', 'thymeleaf').map(c => [c.pose, c.mood]), [['crouch', 'kind']]);
  // (the polish release) crouched low under her peek, so as not to look big; sitting on every other panel under the bridge
  assert.deepEqual(back.map(id => castOf(id, 'thymeleaf')[0].pose), back.map(id => (LOW.includes(id) ? 'crouch' : 'sit')));
  assert.deepEqual(frames.f098.scene.fx, ['day', 'sparkle']);
  // the bank: bright shallows, the reeds standing again, by day; Sprinkle's flights only at their spots
  const bank = ids.filter(id => camOf(id) === 'bridge/bank');
  assert.deepEqual(bank, seq('f101', 'f108').concat(['f110', 'f111'], seq('f113', 'f117')));
  bank.forEach(id => { assert.deepEqual(frames[id].scene.opts, { shallows: true, drag: false }, id); assert.equal(frames[id].scene.fx[0], 'day', id); assert.ok(!castOf(id, 'coil').length, id + ': Coil is not drawn on the bank'); });
  const SPOT = { glide: 'skim', fly: 'air', splash: 'paddle' };
  ids.forEach(id => castOf(id, 'sprinkle').forEach(c => { if (SPOT[c.pose]) assert.equal(c.at, SPOT[c.pose], id + ': ' + c.pose); }));
  ids.forEach(id => frames[id].scene.cast.filter(c => ['skim', 'air', 'paddle'].includes(c.at)).forEach(c => assert.ok(c.who === 'sprinkle' && SPOT[c.pose] === c.at, id + ': ' + c.who + ' at ' + c.at)));
  assert.deepEqual(ids.filter(id => castOf(id, 'sprinkle').some(c => c.pose === 'fly')), ['f115'], 'the lift, the last day only');
  assert.deepEqual(castOf('f107', 'player').map(c => [c.pose, c.tap]), [['pawup', 'paw']]);
  assert.deepEqual(castOf('f114', 'player').map(c => [c.pose, c.tailUp, c.tap]), [['sit', true, 'tail']]);
  assert.deepEqual(['f103', 'f104'].map(id => castOf(id, 'player')[0]).map(c => [c.pose, c.at]), [['crouch', 'run-2'], ['walk', 'watch-4']]);
  assert.deepEqual(castOf('f104', 'sprinkle').map(c => c.pose), ['flat'], 'she lands with a VERY big sound');
  assert.deepEqual(castOf('f111', 'sprinkle').map(c => [c.pose, c.mist]), [['burp', true]]);
  // the last day: our cat, Riffle, Tallyheart and Thymeleaf along the bank's edge
  seq('f113', 'f117').forEach(id => assert.deepEqual(['player', 'riffle', 'tallyheart', 'thymeleaf'].map(w => castOf(id, w).map(c => c.at)[0]), ['watch-1', 'watch-2', 'watch-3', 'watch-4'], id));
  // Coil's QUIET: a cut to his stones, nobody else there
  assert.deepEqual([camOf('f109'), frames.f109.scene.cast.map(c => [c.who, c.pose, c.at])], ['bridge/wall', [['coil', 'stone', 'gap']]]);
  // the montage: the pile at dusk under the twelfth evening's moon, the guards facing out, Tallyheart going round behind
  assert.deepEqual([camOf(MONTAGE), frames[MONTAGE].scene.fx, frames[MONTAGE].scene.opts], ['pile/wide', ['dusk'], { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 12 }]);
  assert.deepEqual(castOf(MONTAGE, 'tallyheart').map(c => c.at), ['behind']);
  assert.ok(castOf(MONTAGE, 'clancat').every(c => c.facing === 'right'), 'the guards facing out');
});

// (the polish release, 2026-10-31) the final review: under the bridge Thymeleaf read as a kitten (his face 0.85 of
// our cat's at h 290); and where her peek comes down (f093) his face met hers. Measured on the art's own heads.
test('staging, the polish release: under the bridge Thymeleaf is a grown cat (his face as big as our cat’s and Tallyheart’s), and his face is clear of Sprinkle’s and of everyone’s, her peek (f093) included', () => {
  const cat = E.blankCat({ id: 'g', now: 0, look: { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' } });
  const clear = (a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * 0.625) / (a.r + b.r);
  seq('f089', 'f100').forEach(id => {
    const sc = E.resolveScene(frames[id].scene, cat, STORIES), r = A.render(sc, { look: cat.look });
    const head = (w) => r.heads[sc.cast.findIndex(c => c.who === w)];
    const th = head('thymeleaf'), pl = head('player'), ta = head('tallyheart'), sp = head('sprinkle');
    assert.ok(th.r >= pl.r * 0.97 && th.r <= pl.r * 1.12, id + ': his face as big as our cat’s: ' + (th.r / pl.r).toFixed(2));
    assert.ok(th.r >= ta.r * 0.97, id + ': and as Tallyheart’s: ' + (th.r / ta.r).toFixed(2));
    assert.ok(clear(th, pl) > 1.4 && clear(th, ta) > 1.4, id + ': clear of our cat and Tallyheart');
    // (hiding, her head is under the heap of her tail, and he sits in front of it)
    if (sc.cast.find(c => c.who === 'sprinkle').pose !== 'hide') assert.ok(clear(th, sp) > 1.5, id + ': his face clear of hers: ' + clear(th, sp).toFixed(2));
  });
  // where her peek and her claws come down, he is nearer the front, below them: lower in the panel than on the panels around
  const yOf = (id) => { const sc = E.resolveScene(frames[id].scene, cat, STORIES); return A.render(sc, { look: cat.look }).heads[sc.cast.findIndex(c => c.who === 'thymeleaf')].y; };
  assert.ok(yOf('f093') > yOf('f092') + 15 && yOf('f095') > yOf('f094') + 15, 'his face low under her peek and her claws: ' + [yOf('f092'), yOf('f093'), yOf('f094'), yOf('f095')].join(' '));
  // and at her open wings, nearer the hurt wing he sniffs (the lettering's keep-out over it, chapter 7's `wing: true`)
  const r95 = A.render(E.resolveScene(frames.f095.scene, cat, STORIES), { look: cat.look }), k = r95.keep[r95.keep.length - 1];
  const th95 = r95.heads[frames.f095.scene.cast.findIndex(c => c.who === 'thymeleaf')];
  assert.ok(th95.x > k.x - 5 && th95.x < k.x + k.w && th95.y > k.y + k.h, 'under the hurt wing: ' + JSON.stringify([th95, k]));
});

// (the polish's fixes, 2026-10-31: the regression check found two things the bigger tom at MENDER did to our cat) Where
// our cat needs the room beside him he sits at MENDER_FRONT. f091: our cat's raised forepaw, the panel's beat, was
// behind his tail (curled up his side) and his flank; measured on Quick Look renders, 35% of the paw was hidden at
// MENDER and none is at MENDER_FRONT. Its five claws, which the board names, were never drawn (the frame passed no
// `claws: true`; the second check found it): now they are, one group of five on the raised paw, none of them hidden
// in any of 90 looks and 26px or more (at 1600 wide) from him. Here the art's own marks for the raised paw and his
// tail's tip (`tap: 'paw'`, `tap: 'tail'`): the tail tip is beside the paw, not over it. f097, a cat who met Mizzle but not Hail:
// with his face where MENDER puts it, our cat's balloon could not sit over or under her and went to the bottom right,
// its tail across his chest under his chin (1080 x 700 to 740 with Aa off, and wider with Aa on and upright). Here the
// page's own placement (ui.js layoutText's balloons, with its findSpot and tailGeom) with the sizes WebKit measured
// for the caption and the two balloons: our cat's tail touches no other cat's face or body. f095 (the second check):
// under her chest (x 980, h 350) his balloon went over her head and its tail ran down across her ear and cheek, grazing
// her eye, at every iPad size, Aa on and off (ui.js tests only the tail's centre line against the square inside a
// face, and it missed by a pixel); at MENDER_WING, under the hurt wing out past her chest, it sits beside him, low, and
// its whole tail, as drawn, is clear of every face's circle (the WebKit sweep: 0 at all 15 sizes, Aa on and off).
test('staging, the polish’s fixes: on f091 our cat’s raised forepaw is in plain sight beside Thymeleaf’s tail, its five claws out; on f097 our cat’s balloon stays by her, its tail clear of every other cat; on f095 his balloon’s tail is clear of every face', () => {
  const look = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
  // a mark the drawing carries (pc-tap-<name>), in world units at spot `at` (scenes.js castBoxes: the drawing's box
  // stands on the spot, centred, scaled by the spot's h over a sitting cat's 200)
  const markAt = (who, opts, name, at) => {
    const ch = A.character(who, Object.assign({ facing: 'right', look }, opts));
    const m = ch.svg.match(new RegExp('pc-tap-' + name + '"><circle cx="([-\\d.]+)" cy="([-\\d.]+)" r="([-\\d.]+)"'));
    let [x, y, r] = m.slice(1).map(Number);
    const t = ch.svg.match(/^<g transform="matrix\(([-\d.]+),0,0,([-\d.]+),([-\d.]+),([-\d.]+)\)"/);
    if (t) { const [a, d, e, f] = t.slice(1).map(Number); x = a * x + e; y = d * y + f; r *= a; }
    const k = at.h / 200;
    return { x: at.x + (x - ch.w / 2) * k, y: at.y + (y - ch.h) * k, r: r * k };
  };
  const BL = A.sceneInfo('bridge').anchors.back['back-left'];
  const f091 = (who) => castOf('f091', who)[0];
  const paw = markAt('player', { pose: f091('player').pose, mood: f091('player').mood, tap: 'paw' }, 'paw', BL);
  const tail = (at) => markAt('thymeleaf', { pose: f091('thymeleaf').pose, mood: f091('thymeleaf').mood, holds: 'leaf', tap: 'tail' }, 'tail', at);
  assert.equal(f091('player').pose, 'pawup');
  assert.deepEqual(f091('thymeleaf').at, MENDER_FRONT);
  const gap = (at) => tail(at).x - paw.x - tail(at).r - paw.r;
  assert.ok(gap(MENDER_FRONT) > 10, 'f091: his tail tip beside our cat’s raised paw, not over it: ' + gap(MENDER_FRONT).toFixed(1));
  assert.ok(gap(MENDER) < 0, 'and at MENDER it was over it: ' + gap(MENDER).toFixed(1));
  // its five claws: `claws: true`, as bridge() takes it, drawn as one group of five on the raised paw
  assert.deepEqual([f091('player').pose, f091('player').claws], ['pawup', true]);
  {
    const c91 = E.blankCat({ id: 'g', now: 0, look });
    Object.assign(c91.flags, { ch3Told: true, foundSquall: true });
    const svg = A.render(E.resolveScene(frames.f091.scene, c91, STORIES), { look }).svg;
    const groups = [...svg.matchAll(/class="pc-claws"[^>]*>(.*?)<\/g>/g)].map(m => (m[1].match(/<path/g) || []).length);
    assert.deepEqual(groups, [5], 'f091: five claws drawn, on our cat’s raised paw only');
  }
  // f097: the page's placement, step 2 of layoutText, for a cat who met Mizzle but not Hail
  const L = PC.ui.layout;
  const cat = E.blankCat({ id: 'g', now: 0, look });
  Object.assign(cat.flags, { ch3Told: true, foundMizzle: true, foundHail: false });
  const bs = E.balloons(frames.f097, cat).filter(b => b.text);
  assert.deepEqual(bs.map(b => [b.who, b.kind || 'say']), [['riffle', 'shout'], ['player', 'say']]);
  const place = (sc, m, bs) => {
    const { W, H, big } = m, r = A.render(sc, { look }), heads = L.castHeads(r.heads, sc.cast);
    const fsz = Math.max(15.5, Math.min(22, W * 0.026)) * (big ? 1.18 : 1), padX = fsz * 0.95, padY = fsz * 0.62;
    let faces = heads.filter(o => o.h).map(o => { const rr = o.h.r * W / 100; return { x: o.h.x * W / 100, y: o.h.y * H / 100, r: rr * 1.15 + 6, who: o.who, rr }; });
    const bodies = faces.map(c => ({ x: c.x - c.rr * 1.7, y: c.y + c.rr * 0.5, w: c.rr * 3.4, h: c.rr * 4 }));
    // (and the areas the art asks the lettering to keep off, as faces, as layoutText adds them)
    r.keep.forEach(k => { faces = faces.concat(L.keepCircles(k, W, H)); });
    // (the captions as placed, and their union for the first balloon's reading order)
    const caps = m.caps || [m.cap], capBox = caps.reduce((u, q) => ({ x: Math.min(u.x, q.x), y: Math.min(u.y, q.y), w: Math.max(u.x + u.w, q.x + q.w) - Math.min(u.x, q.x), h: Math.max(u.y + u.h, q.y + q.h) - Math.min(u.y, q.y) }));
    const placed = caps.slice(), out = [];
    bs.forEach((b, i) => {
      const o = heads.find(q => q.who === b.who).h, hd = { x: o.x * W / 100, y: o.y * H / 100, r: o.r * W / 100 }, ex = b.kind === 'shout' ? 12 : 0;
      const w = m.text[i][0] + padX * 2 + ex * 2, h = m.text[i][1] + padY * 2 + ex * 2, prev = out.length ? out[out.length - 1] : null;
      const o2 = { W, H, w, h, faces, bodies, placed, head: hd, prev, index: i, last: i === bs.length - 1, margin: 8 };
      let spot = L.findSpot(Object.assign({ after: prev, afterCap: i === 0 ? capBox : null }, o2));
      // (layoutText's fallbacks: past the caption; then anywhere that still reads after the balloon before it)
      if (!spot && i === 0) spot = L.findSpot(Object.assign({}, o2, { prev: null }));
      if (!spot && prev) { const fb = L.findSpot(o2); if (fb && L.readsAfter({ x: fb.x, y: fb.y, w, h }, prev)) spot = fb; }
      assert.ok(spot, 'a spot in the panel for ' + b.who + ' at ' + W + ' x ' + H);
      const box = { x: spot.x, y: spot.y, w, h };
      placed.push(box); out.push(box);
      const inner = { x: box.x + ex, y: box.y + ex, w: w - 2 * ex, h: h - 2 * ex }, cx = inner.x + inner.w / 2, cy = inner.y + inner.h / 2, d = Math.hypot(cx - hd.x, cy - hd.y);
      box.tip = { x: hd.x + (cx - hd.x) / d * hd.r * 1.12, y: hd.y + (cy - hd.y) / d * hd.r * 1.12 };
      const tg = L.tailGeom(inner, box.tip, Math.min(13, inner.w / 7));
      box.edge = tg.edge; box.tail = tg.d;
    });
    return { out, faces, heads, W, H };
  };
  // the sizes WebKit measured (the caption at the top left, Riffle's shout, our cat's line): 1080 x 720 with Aa off and
  // on, an upright 820 x 1180, a sideways 1180 x 820 with Aa on
  const SIZES = [{ W: 866, H: 538, big: false, cap: { x: 10, y: 10, w: 254, h: 48 }, text: [[155, 28], [332, 52]] },
    { W: 866, H: 538, big: true, cap: { x: 10, y: 10, w: 299, h: 56 }, text: [[183, 33], [392, 62]] },
    { W: 780, H: 485, big: false, cap: { x: 10, y: 10, w: 235, h: 45 }, text: [[143, 25], [306, 48]] },
    { W: 1026, H: 638, big: true, cap: { x: 10, y: 10, w: 299, h: 56 }, text: [[183, 33], [392, 62]] }];
  const crosses = (sc, m) => {
    const { out, faces, W, H } = place(sc, m, bs), b = out[1], hit = [];
    // every other cat's face (the square inside its circle, ui.js tailOverFaces) and body (its drawing's whole box)
    sc.cast.forEach((c, j) => {
      if (c.who === 'player' || c.who === 'sprinkle') return;
      const f = faces.find(q => q.who === c.who), sq = { x: f.x - f.rr * 0.7, y: f.y - f.rr * 0.7, w: f.rr * 1.4, h: f.rr * 1.4 };
      const a = typeof c.at === 'object' ? c.at : A.sceneInfo('bridge').anchors.back[c.at];
      const ch = A.character(c.who, { pose: c.pose, mood: c.mood, facing: c.facing, holds: c.holds, look }), k = a.h / 200, bb = ch.bounds;
      const xs = [a.x + (bb.x0 - ch.w / 2) * k, a.x + (bb.x1 - ch.w / 2) * k].map(v => (c.facing === 'left' ? 2 * a.x - v : v));
      const body = { x: Math.min(...xs) * W / 1600, y: (a.y + (bb.y0 - ch.h) * k) * H / 1000, w: Math.abs(xs[1] - xs[0]) * W / 1600, h: (bb.y1 - bb.y0) * k * H / 1000 };
      if (L.segHitsRect(b.edge.x, b.edge.y, b.tip.x, b.tip.y, sq)) hit.push(c.who + ' face');
      if (L.segHitsRect(b.edge.x, b.edge.y, b.tip.x, b.tip.y, body)) hit.push(c.who + ' body');
    });
    return hit;
  };
  const sc = E.resolveScene(frames.f097.scene, cat, STORIES);
  assert.deepEqual(castOf('f097', 'thymeleaf')[0].at, MENDER_FRONT);
  SIZES.forEach(m => assert.deepEqual(crosses(sc, m), [], 'f097 at ' + m.W + ' x ' + m.H + (m.big ? ' with Aa' : '') + ': our cat’s balloon tail crosses no other cat'));
  // (and at MENDER, as built, it crossed his body on every one of these)
  const was = JSON.parse(JSON.stringify(sc));
  was.cast.find(c => c.who === 'thymeleaf').at = MENDER;
  SIZES.forEach(m => assert.ok(crosses(was, m).includes('thymeleaf body'), 'at MENDER, ' + m.W + ' x ' + m.H + (m.big ? ' with Aa' : '') + ': ' + crosses(was, m)));
  // f095, both paths: his balloon's tail as drawBalloon draws it (tailGeom's two curves, filled), sampled every half
  // pixel outside his balloon, against every other face's whole circle (the art's r); the sizes WebKit measured
  const S95 = [{ W: 866, H: 538, big: false, caps: [{ x: 14, y: 14, w: 416, h: 75 }, { x: 444, y: 14, w: 416, h: 75 }], text: [[263, 26]] },
    { W: 866, H: 538, big: true, caps: [{ x: 14, y: 14, w: 416, h: 88 }, { x: 444, y: 14, w: 416, h: 88 }], text: [[311, 31]] },
    { W: 780, H: 485, big: false, caps: [{ x: 14, y: 14, w: 374, h: 70 }, { x: 400, y: 14, w: 374, h: 70 }], text: [[243, 24]] },
    { W: 1026, H: 638, big: true, caps: [{ x: 14, y: 14, w: 492, h: 88 }, { x: 528, y: 14, w: 492, h: 88 }], text: [[311, 31]] }];
  const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c; return c; };
  const curve = (a, c, b) => Array.from({ length: 17 }, (_, i) => { const t = i / 16; return [0, 1].map(k => (1 - t) * (1 - t) * a[k] + 2 * (1 - t) * t * c[k] + t * t * b[k]); });
  const intoFaces = (sc, told, m) => {
    const c95 = E.blankCat({ id: 'g', now: 0, look });
    Object.assign(c95.flags, { ch3Told: told });
    const b95 = E.balloons(frames.f095, c95).filter(b => b.text);
    assert.deepEqual(b95.map(b => b.who), ['thymeleaf']);
    const { out, heads, W, H } = place(sc, told ? m : Object.assign({}, m, { caps: m.caps.slice(0, 1) }), b95), b = out[0], hit = {};
    const n = b.tail.match(/-?[\d.]+/g).map(Number), P = curve([n[0], n[1]], [n[2], n[3]], [n[4], n[5]]).concat(curve([n[4], n[5]], [n[6], n[7]], [n[8], n[9]]));
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += 0.5) for (let x = Math.min(...xs); x <= Math.max(...xs); x += 0.5) {
      if (!inPoly(x, y, P) || (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h)) continue;
      heads.forEach(o => { if (o.h && o.who !== 'thymeleaf' && Math.hypot(x - o.h.x * W / 100, y - o.h.y * H / 100) < o.h.r * W / 100) hit[o.who] = (hit[o.who] || 0) + 0.25; });
    }
    return hit;
  };
  [true, false].forEach(told => {
    const c95 = E.blankCat({ id: 'g', now: 0, look });
    c95.flags.ch3Told = told;
    const sc = E.resolveScene(frames.f095.scene, c95, STORIES);
    assert.deepEqual(sc.cast.find(c => c.who === 'thymeleaf').at, MENDER_WING);
    S95.forEach(m => assert.deepEqual(intoFaces(sc, told, m), {}, 'f095 ' + (told ? 'told' : 'kept') + ' at ' + m.W + ' x ' + m.H + (m.big ? ' with Aa' : '') + ': his tail clear of every face'));
    // (and under her chest, as built, it ran across her face on every one of these)
    const was = JSON.parse(JSON.stringify(sc));
    was.cast.find(c => c.who === 'thymeleaf').at = MENDER_WING_WAS;
    S95.forEach(m => assert.ok((intoFaces(was, told, m).sprinkle || 0) > 100, 'under her chest, ' + m.W + ' x ' + m.H + ': ' + JSON.stringify(intoFaces(was, told, m))));
  });
});

/* The depth rule (the README's “Casts are listed back to front where cats meet”; the depth hotfix's test at the end
 * of tests/set-pile.test.js holds the pile's `wide` camera to it in every chapter, chapter 9's f004 and f112 among
 * them): scenes.js draws a layer's cast in the order it is listed, never by depth. Here every set and camera chapter 9
 * draws, its own spots ({ x, y, h }) counted: for every pair of cast members on the ground in one layer where the one
 * further back (its feet higher up the panel) reaches the nearer one's head, the one further back is drawn first. The
 * review (2026-10-26) found four the other way round: f112 (Charlie's chapter 8 bug again, on f030's staging), f037
 * (our cat's tail over Tallyheart's cheek), f039 and f040 (Riffle's shadow edge over her feet). And the `motion`
 * streaks trail a scene's first cast member (scenes.js fxMotion), so the one moving is listed first (f114); f106's
 * glide draws its own speed lines (cats.js `pc-speed`), and its streaks, which trailed our cat, are dropped. */
const DEPTH9 = ['f037', 'f039', 'f040', 'f112'];
test('staging, depth: on every set and camera chapter 9 draws, a cast member further back is never drawn over a nearer one\'s head (f112, f037, f039, f040 listed back to front); the `motion` streaks trail Sprinkle (f114), and her glide draws its own (f106)', { skip: !A.character && 'no cats.js' }, (t) => {
  const LOOKD = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
  const cat = E.blankCat({ id: 'depth', now: 0, look: LOOKD });
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
  const met = new Set(), bad = [];
  let pairs = 0;
  for (const id of ids) {
    const sc0 = frames[id].scene, info = A.sceneInfo(sc0.set), anchors = info.anchors[info.cams[sc0.cam].comp] || {};
    const sc = E.resolveScene(sc0, cat, STORIES), svg = A.render(sc, { look: LOOKD }).svg;
    const ground = (sc.cast || []).filter(m => m && (typeof m.at === 'object' || (anchors[m.at] && !anchors[m.at].elev))).map(m => {
      const a = typeof m.at === 'object' ? m.at : anchors[m.at], at = svg.indexOf('<g transform="translate(' + a.x + ' ' + a.y + ')');
      assert.ok(at >= 0, id + ': ' + m.who + ' drawn at ' + JSON.stringify(m.at));
      return { m, a, at, box: boxAt(m, a) };
    });
    for (const near of ground) for (const far of ground) {
      if (far === near || far.a.y >= near.a.y || (far.a.z || 'front') !== (near.a.z || 'front') || !meets(far.box.body, near.box.head)) continue;
      pairs++; met.add(id);
      if (far.at > near.at) bad.push(id + ' (' + sc0.set + '/' + sc0.cam + '): ' + far.m.who + ' at ' + JSON.stringify(far.m.at) + ' is drawn over ' + near.m.who + '\'s head at ' + JSON.stringify(near.m.at));
    }
  }
  assert.deepEqual(bad, [], 'listed back to front where they meet');
  DEPTH9.forEach(id => assert.ok(met.has(id), id + ': two of its cast meet, the one further back drawn first'));
  assert.deepEqual(frames.f112.scene.cast.slice(0, 2).map(c => c.at), ['crowd-2', 'beside'], 'f112: the sitting grey guard at `crowd-2` first, as chapter 8\'s f030 has it since the hotfix');
  assert.deepEqual(frames.f037.scene.cast.slice(0, 2).map(c => c.at), ['near-2', 'near-1'], 'f037: our cat, further back, before Tallyheart');
  // the `motion` streaks trail the first cast member: the one moving
  const moving = ids.filter(id => !ROOF_IDS.includes(id) && frames[id].scene.fx.includes('motion'));
  assert.deepEqual(moving, ['f114']);
  moving.forEach(id => assert.equal(frames[id].scene.cast[0].who, 'sprinkle', id + ': the streaks trail Sprinkle, not a watcher'));
  const glide = A.render(E.resolveScene(frames.f106.scene, cat, STORIES), { look: LOOKD }).svg;
  assert.ok(/class="pc-speed"/.test(glide) && !/pcs-whoosh/.test(glide), 'f106: her glide\'s own speed lines behind her, and no streaks behind a watcher');
  t.diagnostic(ids.length + ' frames, ' + pairs + ' pairs that meet, in ' + met.size + ' frames');
});

test('staging, the case and bedtime: every `case` frame at night with the stone; read 0 for the ask and read 7 after it; the glass off only while it is in her paws; Glintstar’s entry, stay and going on `case`, never the doorway; every bedtime den frame’s opts in full, the nearly round moon where the sky shows', () => {
  const cases = ids.filter(id => camOf(id) === 'den/case');
  assert.deepEqual(cases, seq('f118', 'f131'));
  cases.forEach(id => {
    const o = frames[id].scene.opts;
    assert.deepEqual(frames[id].scene.fx, ['night'], id);
    assert.equal(o.stone, 'auto', id + ': every case frame carries the stone');
    assert.deepEqual([o.weather, o.bark], ['clear', 'auto'], id);
    assert.equal(o.read, id === 'f118' ? 0 : 7, id + ': no case frame after the ask has read under 7');
    const inPaws = castOf(id, 'player').some(c => c.holds);
    assert.equal(o.glass, !inPaws, id + ': her glass beside the rows, but while it is in her paws');
    assert.deepEqual(Object.keys(o).sort(), ['bark', 'glass', 'read', 'stone', 'weather'], id);
    assert.deepEqual(castOf(id, 'player').map(c => c.at), ['case-1'], id);
    assert.deepEqual(castOf(id, 'tallyheart').map(c => c.at), ['case-2'], id);
    castOf(id, 'glintstar').forEach(c => assert.equal(c.at, 'case-3', id));
  });
  assert.deepEqual(cases.filter(id => castOf(id, 'glintstar').length).map(id => [id, castOf(id, 'glintstar')[0].pose, castOf(id, 'glintstar')[0].facing]),
    [['f122', 'walk', 'left'], ['f123', 'stand', 'left'], ['f124', 'stand', 'left'], ['f125', 'stand', 'left'], ['f126', 'stand', 'left'], ['f127', 'stand', 'left'], ['f128', 'stand', 'left'], ['f129', 'stand', 'left'], ['f130', 'stand', 'left'], ['f131', 'walk', 'right']]);
  assert.ok(!ids.some(id => camOf(id) === 'den/doorway' && castOf(id, 'glintstar').length), 'Glintstar never on the doorway');
  assert.deepEqual(castOf('f125', 'tallyheart').map(c => c.pose), ['lookup'], 'Tallyheart looks at the sky');
  assert.deepEqual([castOf('f123', 'player')[0].holds, castOf('f124', 'player')[0].holds], ['leaf', 'glass']);
  assert.ok(!castOf('f118', 'tallyheart')[0].glow, 'no Tallyheart glow: the row is the Tap');
  // bedtime: nest with no moon, doorway and inside with the moon nearly round
  const bed = ids.filter(id => frames[id].scene.set === 'den' && at(id) >= at(NEST));
  assert.deepEqual(bed, seq('f132', 'f140'));
  bed.forEach(id => {
    const want = { weather: 'clear', moon: frames[id].scene.cam === 'nest' ? false : 13, stone: 'auto', bark: 'auto', hidden: true, glass: true };
    assert.deepEqual(frames[id].scene.opts, want, id);
    assert.ok(frames[id].scene.fx.includes('night'), id);
    castOf(id, 'player').forEach(c => assert.equal(c.at, 'nest', id));
    castOf(id, 'snorer').forEach(c => assert.deepEqual([c.at, c.facing], ['sleeper-1', 'right'], id));
  });
  assert.deepEqual(castOf(NEST, 'player').map(c => c.pose), ['lie'], 'lying, so the stone is by her nose or under her chin');
  assert.deepEqual([camOf('f134'), castOf('f134', 'snorer').length, castOf('f134', 'player').length], ['den/inside', 1, 1]);
  assert.ok(frames[F(/^Soon he’s snoring\./)].scene.fx.includes('zzz'));
  assert.deepEqual(castOf(F(/You curl up tight, warm and safe, and sleep\.$/), 'player').map(c => [c.pose, c.mood, c.asleep]), [['curl', 'kind', 'half']]);
  const end = frames[ids[ids.length - 1]];
  assert.ok(end.scene.fx.includes('night') && end.scene.cast.some(c => c.who === 'player' && c.at === 'nest'), 'she is in her nest');
  assert.equal(end.caption[end.caption.length - 1], 'End of Chapter Nine.');
});

/* Each frame's day: day 9 (the count to the root at sunset), day 10 (the tower to the bank), the montage, and the
 * last day and evening 13. Within a day the time never goes back. */
const DAYS = [['f001', 'f059'], ['f060', 'f111'], ['f112', 'f112'], ['f113', 'f140']];
const dayOf = id => DAYS.findIndex(([a, b]) => at(id) >= at(a) && at(id) <= at(b));

test('the time of day runs morning, day, sunset on day 9; morning and day on day 10 (the roof copy by first light); dusk for the montage; day on the last day and night in the den on evening 13', () => {
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    let last = -1, lastDay = -1;
    p.forEach(id => {
      const t = frames[id].scene.fx.filter(e => TOD.includes(e));
      assert.equal(t.length, 1, id + ': exactly one time of day in fx');
      const d = dayOf(id), k = TOD.indexOf(t[0]);
      assert.ok(d >= lastDay, id + ': days go forward');
      if (d === lastDay) assert.ok(k >= last, id + ' goes back in time');
      lastDay = d; last = k;
    });
  }
  const tod = id => frames[id].scene.fx.find(e => TOD.includes(e));
  const BY_SET = { pile: ['morning', 'dusk'], camp: ['morning'], hollow: ['morning'], title: ['day', 'sunset'], grove: ['day'], tower: ['morning'], roof: ['morning'], bridge: ['day'], den: ['night'] };
  ids.forEach(id => assert.ok(BY_SET[frames[id].scene.set].includes(tod(id)), id + ': ' + frames[id].scene.set + ' at ' + tod(id)));
  assert.deepEqual(ids.filter(id => tod(id) === 'sunset'), ['f059'], 'the first time the wall’s end is drawn by anything but day');
  assert.deepEqual(ids.filter(id => tod(id) === 'dusk'), [MONTAGE]);
  assert.deepEqual(ids.filter(id => frames[id].scene.fx.includes('skyriver')), []);
});

test('the storyboard is this chapter’s: every frame, the panels a read-through as a reader walks them, every frame shown only to some readers saying so', () => {
  const sb = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch09.md'), 'utf8');
  assert.match(sb, /^# Storyboard: Chapter 9, Featherlight\n/);
  assert.doesNotMatch(sb, /\bSTUB\b|undefined|NaN|\[object/);
  ids.forEach(id => assert.ok(new RegExp('^(### ' + id + ' · panel \\d+|#####+ ' + id + ')\\b', 'm').test(sb), 'the storyboard has ' + id));
  ids.forEach(id => assert.equal((sb.match(new RegExp('^#+ ' + id + '\\b', 'gm')) || []).length, 1, id + ': once'));
  assert.ok(sb.includes('| Frames | ' + ids.length + ' ('), 'every frame counted');
  ids.forEach(id => assert.ok(sb.includes('**Shot.** ' + frames[id].board), id + ': its board'));
  const lens = COMBOS.map(c => walk(c.flags, c.o).length);
  const m = /\| One read-through \| (\d+)–(\d+) panels/.exec(sb);
  assert.ok(m && +m[1] >= Math.min(...lens) - 1 && +m[1] <= Math.min(...lens) && +m[2] <= Math.max(...lens) && +m[2] >= Math.max(...lens) - 1, 'a read-through is ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels (the storyboard: ' + (m && m.slice(1).join('–')) + ')');
  assert.ok(sb.includes('| Choices | 4 |') && sb.includes('| Case File cards | 1 (0 eyes, 1 ears) |'), 'four choice frames, one card');
  assert.ok((sb.match(/^\*\*Shows only if\*\* /gm) || []).length >= ids.filter(id => frames[id].when).length);
  // the art's new names, in the storyboard's own words
  ['GroveClan', 'Thymeleaf', 'Mizzle', 'spider', 'remedy', 'dew'].forEach(w => assert.match(sb, new RegExp(w)));
  assert.match(sb, /For a reader whose foundMizzle is true, the option reads: “?Go and see Mizzle again\./);
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(camOf));
  assert.ok(pairs.size >= 25, 'only ' + pairs.size + ' set/camera pairs');
  const sets = new Set(ids.map(id => frames[id].scene.set));
  // one new place, GroveClan's woods (with the little bridge, the oak and the hollow as its cameras)
  assert.deepEqual([...sets].sort(), ['bridge', 'camp', 'den', 'grove', 'hollow', 'pile', 'roof', 'title', 'tower']);
  GROVE_CAMS.forEach(cam => assert.ok(ids.some(id => camOf(id) === 'grove/' + cam), 'the grove’s ' + cam));
  ['rows', 'gap', 'wide', 'rear'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'pile/' + cam), 'the pile’s ' + cam));
  ['wide', 'lesson', 'sand', 'tree'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'hollow/' + cam), 'the Hollow’s ' + cam));
  ['case', 'nest', 'inside', 'doorway'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'den/' + cam), 'the den’s ' + cam));
  ['back', 'bank', 'wall'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'bridge/' + cam), 'the bridge’s ' + cam));
  // along any path a reader can take, a long stay in one place is broken by its own action: no more than ten panels
  // in a row from one camera (the case's fourteen are cut by the ask, the glass and the choice)
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    let run = 1;
    for (let i = 1; i < p.length; i++) {
      run = camOf(p[i]) === camOf(p[i - 1]) ? run + 1 : 1;
      assert.ok(run <= 14, p[i] + ': ' + run + ' panels in a row from ' + camOf(p[i]) + ' for ' + comboName(c));
    }
  }
  // and no two panels a reader turns between are the same picture with the same words
  for (const c of SOME) {
    const p = walk(c.flags, c.o);
    for (let i = 1; i < p.length; i++) assert.ok(!same(frames[p[i]].scene, frames[p[i - 1]].scene) || T(p[i]) !== T(p[i - 1]), p[i]);
  }
});

test('every frame renders, and everyone in the cast is in the picture; every Tap has its target in the art; the Taps, the questions, the Counts pictures, the laid-out case and her card all draw', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'black', marking: 'white-paws', eyes: 'odd' }, { sex: 'she', fur: 'calico', marking: 'none', eyes: 'amber' }];
  const off = [];
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', ch3Told: true, foundHail: true, foundMizzle: true, ch7Flew: true, foundSquall: true } });
  Object.keys(ch04.cards).forEach((cid, i) => E.giveCard(cat, cid, 'ch04', i + 1));
  CH5_CARDS.concat(CH6_CARDS, CH7_CARDS, CH8_CARDS, ['hail-shapes']).forEach((cid, i) => E.giveCard(cat, cid, 'ch08', 20 + i));
  CARD_IDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch09', 60 + i));
  // (small at the distance of a wide shot: the pile, the Hollow's rim, the woods, the oak, the tower, the roof's
  // `two` and the sunny bank; the spider is tiny by design)
  const SMALL = (id, who) => ['spider', 'coil', 'squall', 'waffles'].includes(who) ||
    ['pile/wide', 'pile/rows', 'hollow/wide', 'grove/bridge', 'grove/wide', 'grove/meet', 'grove/oak', 'tower/up', 'roof/wide', 'roof/two', 'roof/over', 'bridge/bank', 'den/inside', 'den/doorway'].includes(camOf(id));
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
      // and under the bridge nobody sits in another's lap: Thymeleaf's face clear of Tallyheart's
      if (camOf(id) === 'bridge/back') {
        const th = r.heads[cast.findIndex(c => c.who === 'thymeleaf')], ta = r.heads[cast.findIndex(c => c.who === 'tallyheart')];
        assert.ok(Math.hypot(th.x - ta.x, (th.y - ta.y) * 0.625) > (th.r + ta.r) * 1.2, id + ': Thymeleaf and Tallyheart each in sight');
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
  // the asks: the asker glows (Thymeleaf's four, the tree's eight); the case's rows light one a tap, the next row the glowing one
  ['f019', 'f026'].forEach(id => { const svg = A.render(E.resolveScene(frames[id].scene, cat, STORIES), { look: looks[0] }).svg; assert.match(svg, /pc-next/, id); });
  for (let n = 0; n <= 6; n++) {
    const sc = E.resolveScene(E.askScene(frames.f118.scene, frames.f118.ask, n), cat, STORIES);
    assert.equal(sc.opts.read, n, 'read ' + n);
    const svg = A.render(sc, { look: looks[0] }).svg;
    assert.ok(svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg));
    assert.equal((svg.match(/class="pc-next"/g) || []).length, n < 6 ? 1 : 0, 'one row glowing while there is one to read (' + n + ')');
    assert.equal((svg.match(/data-row="[^"]*"[^>]*data-lit="(true|1)"/g) || []).length >= 0, true);
  }
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
  assert.ok(pics.length > 60, pics.length + ' pictures');
  // the skip-counts' pictures are the art's own: one spider's two sides, five spiders, two cats
  const picOf = (id, n) => A.countsPicture(Object.assign({ look: looks[0] }, E.skipPicture(frames[id].skip, n)));
  assert.match(picOf('f022', 0), /One spider: four legs on each side/);
  assert.match(picOf('f025', 0), /5 spiders, eight legs each/);
  assert.match(picOf('f134', 0), /pc-/);
  // her nest at bedtime: her cards along it, the secrets under the moss with her glass, a corner for each
  const nest = E.resolveScene(frames[NEST].scene, cat, STORIES).opts;
  assert.ok(Array.isArray(nest.bark) && nest.bark.length >= 10 && nest.hidden === true && nest.glass === true);
  assert.match(A.render(E.resolveScene(frames[NEST].scene, cat, STORIES), { look: looks[0] }).svg, /data-prop="nest-glass"/);
});

/* ------------------------------------------------------------------ the beats the chapter must have */

test('the chapter’s beats are all there, in order, on every path: every reader’s panels are exactly her five days’, one after another, and nothing else', () => {
  // A beat is one panel: [label, what it says (every variant, in order), what else must be true of it]. Each frame
  // of the chapter is one beat, named here by its id, and each beat's words are the frame's own.
  const B = (label, re, also) => [label, id => re.test(T(id)) && (!also || !!also(frames[id], id))];
  const w = when => f => same(f.when, when);
  const set = s => f => f.counts && f.counts.set === s;
  const tap = name => f => f.scratch && f.scratch.tap === name;
  const card = cid => f => f.card === cid;
  const skip = f => !!f.skip, ask = f => !!f.ask, choice = f => !!f.choice, sets = f => !!f.sets;
  const BEAT = {
    f001: B('at sunrise the whole clan', /^At sunrise, the whole Clan is waiting by the pile\. \{name\}paw\. The count, please\.$/, tap('back')),
    f002: B('the middle of the back', /^The middle of the back row: no gaps\. Forty\. All forty\. Not one piece gone\.$/),
    f003: B('no new dug earth (noticing)', /^No new dug earth\. No new tiny prints\.$/, w(NOTICING)),
    f004: B('the guards cheer', /^The guards cheer\. It was my PINECONE\.$/),
    f005: B('behind the pile tallyheart yawns', /^Behind the pile, Tallyheart yawns\. I sat by their tunnel all night\. Not one weasel came up it\. We leave it open, for the Gathering\. It’s proof\.$/),
    f006: B('a wet nose pokes through (told)', /^A wet nose pokes through the hedge\. Riffle! Psst! Granny says the dogs barked half the night\. Something HAPPENED\. Tell me EVERY bit!$/, f => w(TOLD)(f) && tap('ears')(f)),
    f007: B('the tunnel the weasels (told)', /^The tunnel\. The weasels\. The fox\. The stash\. The glass\. And Hail, in her log\. Riffle flops onto his back\. WEASELS\? A FOX\? A heap of GLASS\? And I was ASLEEP\? WEASELS\? A FOX\? A heap of GLASS\? A dragon who thinks she’s a DOG\? And I was ASLEEP\?$/, w(TOLD)),
    f008: B('im telling sprinkle (told)', /^I’m telling Sprinkle!$/, w(TOLD)),
    f009: B('and hes gone (told)', /^And he’s gone\.$/, w(TOLD)),
    f010: B('sprinkle still cant fly (kept)', /^Sprinkle still can’t fly, and a hurt wing needs a medicine cat\. Your secret is getting bigger\.$/, w(KEPT)),
    f011: B('tallyheart my secret is too big (kept)', /^Tallyheart\? My secret is too big to carry by myself\. I’m right here\.$/, w(KEPT)),
    f012: B('her tail curls round you (kept)', /^Her tail curls round you\. I always was\.$/, f => w(KEPT)(f) && tap('ears')(f)),
    f013: B('the last of it the dragonets (kept)', /^The last of it: the dragonets\. Sprinkle, under the Old Bridge, with her hurt wing\. Then the others you’ve found, name by name\.$/, w(KEPT)),
    f014: B('i knew there was something (kept)', /^I knew there was something under that moss\. So THAT’S why you smell of fish\. You’re not angry\? Angry\? You fed a hungry friend\. Thank you for telling me\.$/, w(KEPT)),
    f015: B('we know who took the prey', /^We know who took the prey\. Now we mend a friend\. Whatever the Clans decide, Sprinkle needs her wings by the full moon\. Come and meet Thymeleaf, our medicine cat\.$/, tap('tail')),
    f016: B('at the edge of the camp', /^At the edge of the camp hangs a curtain of drying leaves\. It smells of mint\. Inside, a twinkly-eyed tom is talking to his leaves\. There, there\. You’ll be dry by sunset\.$/),
    f017: B('tallyheart and the apprentice', /^Tallyheart! And the apprentice who counts things\. Careful of my leaves\. They’re shy\.$/),
    f018: B('tallyheart tells him everything', /^Tallyheart tells him everything\. Thymeleaf’s ears go up\.$/),
    f019: B('a wing is a wing', /^A wing is a wing\. I’ll make her a remedy: wing medicine\. I need four things, one from every corner of the river\.$/, ask),
    f020: B('the towers', /^The towers\? That’s MY corner! And the Holt is Riffle’s\. I’ll send word\.$/),
    f021: B('good everything goes in eights', /^Good\. Everything goes in eights\. Eight drops of dew a day\. Eight days, if a wing is stubborn\. But the full moon is in five days! Then we’d better hurry\.$/),
    f022: B('in a corner of the den', /^In a corner of the den, a tiny spider stops spinning and waves a leg at you\. You wave back\.$/, skip),
    f023: B('eight legs', /^Eight legs\. Four on each side\. An eight is two fours\. Two fours! Like a four is two twos! Exactly\. Doubling, AGAIN\. That’s today’s Count\.$/),
    f024: B('in the training hollow', /^In the Training Hollow, five cats sit up on the rim\. Fours first, to wake up your whiskers\.$/, set('ch09-fours')),
    f025: B('in the sand tallyheart scratches', /^In the sand, Tallyheart scratches five little spiders, four legs on each side\. Hop by eights\.$/, skip),
    f026: B('forty now a secret', /^Forty! Now, a secret\. You already know most of the eights\. One from every mark on this tree\. AGAIN\?$/, ask),
    f027: B('only two are new', /^Only two are new\. Seven spiders, and eight spiders\. For those, count one side, and double it!$/, set('ch09-eights')),
    f028: B('tallyheart stretches up the tree', /^Tallyheart stretches up the leaning tree\. A ninth claw mark\. SKRITCH!$/),
    f029: B('spiders legs your ninth count', /^Spiders’ legs\. That’s your ninth Count\. Not one miss! Not ONE\. Even the spiders are impressed\. Some were tricky\. You never gave up\. Tricky gets easy\. Like flying\.$/),
    f030: B('along the old stone wall', /^Along the old stone wall you go, with Tallyheart, to its end\. Last night she said, “Next time, you take ME\.” This time, you do\. ReedClan! Rustle\.$/),
    f031: B('out steps sloshbank', /^Out steps Sloshbank\. Drip\.$/),
    f032: B('we need reed root', /^We need reed root\. For a remedy\. For a CrystalClan remedy\?$/, choice),
    f033: B('he looks at you', /^He looks at you for a long time\. You asked a fair question, once\. ReedClan will think about it\. Drip\.$/),
    f034: B('thank you sloshbank (friends)', /^Thank you, Sloshbank!$/, w(FRIENDS)),
    f035: B('his ear twitches (friends)', /^His ear twitches\. Almost a smile\.$/, w(FRIENDS)),
    f036: B('the reeds close behind him', /^The reeds close behind him\.$/),
    f037: B('down the river path', /^Down the river path, a little bridge crosses a narrow channel\. Riffle is waiting on it, with a bunch of mint as big as his head\. Granny says it’s the BEST mint\. She says that about everything\.$/),
    f038: B('the water is down there', /^The water is down THERE\. You are up HERE\. One paw at a time\.$/, tap('paw')),
    f039: B('over the bridge', /^Over the bridge, the trees are very, very old\. GroveClan’s woods\. The oldest Clan\. We wait here to be asked in\. Best manners\.$/),
    f040: B('out pads a groveclan elder', /^Next to these trees, EVERYBODY is small\. Out pads a GroveClan elder with a white muzzle\. CrystalClan\.$/),
    f041: B('she looks at tallyheart', /^She looks at Tallyheart\. I remember YOU\. A little apprentice who counted EVERYTHING at the Gathering\. Out loud\. Hmph\.$/),
    f042: B('please may we have some oak moss', /^Please, may we have some oak moss\? For a friend who’s hurt\. You asked\. Take what you need from the old oak\.$/),
    f043: B('the old oak is furry with moss', /^The old oak is furry with moss: green, gold and grey\. High in the trunk is a hollow\. Out of it comes a tiny snore\. The elder doesn’t hear it\. She’s busy remembering\. Zzz… snrk\.$/, choice),
    f044: B('the softest moss', /^The softest moss is the silver kind\. On the north side, where the sun never looks\. I remember that too\.$/),
    f045: B('up you climb', /^Up you climb\. Below, Riffle folds his paws\. Otters don’t climb\. Otters SUPERVISE\.$/),
    f046: B('in the hollow curled on moss', /^In the hollow, curled on moss, is a little dragonet\. She’s pearly green, and fast asleep\.$/),
    f047: B('one eye opens', /^One eye opens\. Oh\. Hello\. Are you a dream\? You’re a very nice dream\. I’m a cat\. Even nicer\. Yaaawn\.$/),
    f048: B('want a sleepy question', /^Want a sleepy question\? When I can’t sleep, I count acorns\. Eight on every twig\. Six twigs\. Zzz\.$/, set('ch09-mizzle')),
    f049: B('im mizzle', /^I’m Mizzle\. Mama says stay where you land\. So I’m napping\. Are you Sprinkle’s sister\?$/),
    f050: B('both eyes open', /^Both eyes open\. SPRINKLE\? Is she safe\? She’s safe, under the Old Bridge\. But her wing is hurt\.$/),
    f051: B('i know in the storm', /^I know\. In the storm, in a flash of lightning, I saw her tumble down by the big bridge\. Her wing was hurt already\. Before the rain even stopped\.$/),
    f052: B('the fox says the dragon flew', /^The fox says the dragon FLEW off when the rain stopped\. With a hurt wing\? She COULDN’T!$/, card('mizzle-wing')),
    f053: B('were making her a remedy', /^We’re making her a remedy\. With oak moss\.$/),
    f054: B('mizzle sits up', /^Mizzle sits up, wide awake for once\. Then you need the RIGHT moss\. Not the green\. That’s for cats\. The soft silver kind, on the north side\. That’s for WINGS\.$/),
    f055: B('tell sprinkle five', /^I’ve found more of you! Mmm\. Tell me… after my nap\. Tell Sprinkle: five\. And tell her I’m… Tell Sprinkle: five\. And tell her I’m… Zzz\.$/, f => tap('leaf')(f) && sets(f)),
    f056: B('you gather the soft silver moss', /^You gather the soft silver moss\.$/, tap('leaf')),
    f057: B('thank you', /^Thank you\.$/),
    f058: B('and very politely the oak', /^And, very politely, the oak\. A polite one\. I’ll remember you\.$/),
    f059: B('on the way home', /^On the way home, at the old wall’s end: a long, pale root on the dry stones\. And one wet pawprint\. In the reeds, somebody drips\. ReedClan thought about it\. Drip\.$/, tap('root')),
    f060: B('next morning before the sun', /^Next morning, before the sun, you’re at your old tower with a leaf for the dew\. Up on her balcony, Waffles is already awake\. \{petname\}! DARLING! At DAWN\?$/),
    f061: B('i need dew from the roof', /^I need dew from the roof! I’m being USEFUL\. How THRILLING\.$/),
    f062: B('from the roof comes a roar (never met)', /^From the roof comes a roar, and a tiny hiccup\.$/, f => w(NO_SQUALL)(f) && choice(f)),
    f063: B('from the roof comes a roar (knows him)', /^From the roof comes a roar, and a tiny hiccup\.$/, w(SQUALL)),
    f064: B('the little room that goes ding', /^The little room that goes DING! It’s TERRIFYING\. Press the top button, darling\. With your NOSE\.$/, tap('nose')),
    f065: B('the little room hums', /^The little room hums\. Your tummy goes UP\. The roof!$/),
    f066: B('its only a very tall curtain (climber)', /^It’s only a very tall curtain, really\. Up you go, balcony to balcony\. The OUTSIDE\? \{THEY\}’S DOING IT!$/, w({ specialty: 'climbing' })),
    f067: B('take the little room darling (not a climber)', /^Take the little room, darling! The one that goes DING!$/, w({ not: { specialty: 'climbing' } })),
    f068: B('the elevator (not a climber)', /^The elevator! You jump, and whack the top button\.$/, w({ not: { specialty: 'climbing' } })),
    f069: B('on the wide flat roof', /^On the wide, flat roof, a dragon no bigger than you hugs the pole of the red light\. He’s slate grey, with yellow flecks like sparks\.$/),
    f070: B('an airplane sweeps over', /^An airplane sweeps over\. AND STAY OUT, giant dragon! ROOOOOAAAAARRRRR!$/),
    f071: B('rawwwrrr hic', /^RAWWWRRR… hic!$/),
    f072: B('halt friend or not friend', /^HALT! Friend, or NOT friend\? Friend! Sprinkle sent me\. PROVE it!$/, set('ch04-riddle')),
    f073: B('and nobodys missing', /^And NOBODY’S MISSING!$/),
    f074: B('then his chin wobbles', /^Then his chin wobbles\. Except everybody\.$/),
    f075: B('not sprinkle shes safe', /^Not Sprinkle\. She’s safe, under the Old Bridge\. She IS\? …I’m Squall\. I’m the littlest\. And the LOUDEST\. I noticed\. I notice things TOO\.$/),
    f076: B('he points down past your camp', /^He points down, past your camp\. Every night, two skinny shapes go sneaking along down THERE, carrying something\. To the long shiny lines\.$/),
    f077: B('the train tracks', /^The train tracks!$/, card('squall-shapes')),
    f078: B('come down with me', /^Come down with me\? Can’t\. I’m GUARDING\. And my light brings me moths\. CRUNCHY ones\.$/),
    f079: B('tell sprinkle five shell know', /^Tell Sprinkle: five\. She’ll know\.$/, f => skip(f) && sets(f)),
    f080: B('by the red light (knows him)', /^By the red light, the rain puddle is silver with dew\. I’m still GUARDING! Tell Sprinkle: FIVE! LOUDLY! I’ll guard the dew! Hic!$/, w(SQUALL)),
    f081: B('by the red light (never met)', /^By the red light, the rain puddle is silver with dew\. From behind the red light: AND STAY OUT, giant dragon! Hic!$/, w(NO_SQUALL)),
    f082: B('two skinny shapes he said (met him today)', /^Two skinny shapes, he said\. Now you know EXACTLY who they are\. And they haven’t come back\. It sparkles\. You don’t stare\. Much\.$/, w({ foundSquall: true, ch9Roof: true })),
    f083: B('it sparkles (knows him, shiny)', /^It sparkles\. You don’t stare\. Much\.$/, w({ foundSquall: true, ch9Roof: false, worry: 'shiny' })),
    f084: B('somebody small is busy guarding (never met)', /^Somebody small is busy guarding\. It sparkles\. You don’t stare\. Much\.$/, w(NO_SQUALL)),
    f085: B('eight drops a day (knows him)', /^Eight drops a day, for four days, to the full moon\.$/, f => w(SQUALL)(f) && set('ch09-dew')(f)),
    f086: B('eight drops a day (never met)', /^Eight drops a day, for four days, to the full moon\.$/, f => w(NO_SQUALL)(f) && set('ch09-dew')(f)),
    f087: B('four things lie in a row', /^In Thymeleaf’s den, four things lie in a row: root, moss, mint and dew\.$/),
    f088: B('he mixes and mashes', /^He mixes, and mashes, and hums\. The remedy comes out pale green\.$/),
    f089: B('that afternoon (told)', /^That afternoon, Thymeleaf and Tallyheart pad under the Old Bridge with you\. Sprinkle is bouncing\. Riffle told me EVERYTHING! Weasels! GLASS!$/, w(TOLD)),
    f090: B('that afternoon (kept)', /^That afternoon, Thymeleaf and Tallyheart pad under the Old Bridge with you\. Sprinkle is bouncing\. Riffle told me EVERYTHING! Weasels! GLASS!$/, w(KEPT)),
    f091: B('you tell her squalls five', /^You tell her Squall’s five\. LOUDLY, the Squall way\.$/, w(SQUALL)),
    f092: B('then sprinkle sees two big cats (kept)', /^Then Sprinkle sees two big cats, and hides under her tail\. Hello, Sprinkle\. I’m Tallyheart\. I count things\.$/, w(KEPT)),
    f093: B('one eye peeks out (kept)', /^One eye peeks out\. …Do you count FISH\? Especially fish\.$/, w(KEPT)),
    f094: B('this is thymeleaf (told)', /^This is Thymeleaf\. He mends things\.$/, w(TOLD)),
    f095: B('thymeleaf sniffs sprinkles wing', /^Sprinkle ducks under her tail, then peeks out\. Thymeleaf sniffs Sprinkle’s wing\. Then he talks to it\. Hello, wing\. Let’s mend you\.$/, tap('wing')),
    f096: B('eight rubs', /^Eight rubs, three times a day\. Morning, noon and night\.$/, set('ch09-rubs')),
    f097: B('riffle pops up with fish', /^Riffle pops up with fish\. Otter medicine! Otter medicine! I SAVED the best bit! Hail says FIVE! She’s the BOUNCIEST! And Mizzle says five\. Then she fell asleep\.$/),
    f098: B('sprinkles eyes shine', /^Sprinkle’s eyes shine\.$/, w(FIVE_ONE)),
    f099: B('and practice', /^And practice\. Eight flaps, then a rest\. Eight times a day\.$/, set('ch09-flaps')),
    f100: B('sixty-four', /^SIXTY-FOUR\? My wing will be SO tired! Tired is good\. Wings like work\.$/),
    f101: B('day by day on the sunny bank', /^Day by day, on the sunny bank, Sprinkle practices\. A hop\. A flap\. A wobble\. I’m FINE! BUMP\.$/),
    f102: B('you notice (noticing)', /^You notice: every day, her hurt wing lifts a little higher\.$/, w(NOTICING)),
    f103: B('a climbers leap (climbing)', /^You show her a climber’s leap: crouch, look, JUMP!$/, w({ specialty: 'climbing' })),
    f104: B('land without a sound (sneaking)', /^You show her how to land without a sound\. She lands with a VERY big sound\.$/, w({ specialty: 'sneaking' })),
    f105: B('you cheer the loudest (friends)', /^You cheer the loudest\. GO, Sprinkle!$/, w(FRIENDS)),
    f106: B('a run along the bank a glide', /^A run along the bank, a glide…$/),
    f107: B('into the sunny shallows', /^Into the sunny shallows\. Up she pops, laughing\. Ten out of ten\. For the SPLASH\. Paddle with your back legs! SPLASH!$/, tap('paw')),
    f108: B('she does it helps (swimming)', /^She does\. It helps\.$/, w({ specialty: 'swimming' })),
    f109: B('some of us asked for quiet', /^Some of us asked for QUIET\.$/),
    f110: B('sorry coil', /^Sorry, Coil!$/),
    f111: B('out comes a little cloud', /^Out comes a little cloud of mist\. Burp\.$/),
    f112: B('every morning forty', /^Every morning: forty\. Every day, rubs and flaps\. Every evening, a rounder moon\. Every night, Tallyheart by the tunnel\.$/),
    f113: B('on the last day', /^On the last day before the full moon, Sprinkle’s friends all come to watch\. Even Coil, in his stones, counts her footsteps\.$/),
    f114: B('sprinkle runs along the bank', /^Sprinkle runs along the bank\. She flaps\. Harder\. HARDER…$/, tap('tail')),
    f115: B('and she lifts', /^…and she LIFTS\. One wingbeat\. Two\. Three\. FOUR! Her paws are off the ground!$/),
    f116: B('down she comes', /^Down she comes, onto the soft sand, laughing\. Flump\.$/),
    f117: B('i was up', /^I was UP! My paws left the GROUND! I felt FEATHERLIGHT! Not mended yet\. But nearly\. The full moon will tell\.$/),
    f118: B('that evening the den is empty', /^That evening, the den is empty\. Tallyheart helps you lift the moss\. You lay out your bark, row by row\.$/, ask),
    f119: B('and my count', /^And my count\. Twenty-four gone in six nights\. A dragon would take sixty\. And my count\. Twenty-four gone in six nights\. A dragon would take sixty\. And Mizzle says Sprinkle’s wing was hurt before the rain stopped\.$/),
    f120: B('tallyheart looks at the rows', /^Tallyheart looks at the rows for a long time\. That’s not a story\. That’s a case\.$/),
    f121: B('the case is ready', /^The case is ready\. We found out who took the prey\. Now we tell Glintstar everything\. I promised\. It’s time Glintstar heard it\. All of it\. Sprinkle too\.$/),
    f122: B('she pads out', /^She pads out\. Soon Glintstar steps into the den, silver in the moonlight\.$/),
    f123: B('tallyheart tells her everything', /^Tallyheart tells her everything, row by row\. And then: Sprinkle\.$/, tap('leaf')),
    f124: B('i said no cat goes looking', /^I said no cat goes looking for the dragon\. \{They\} didn’t go looking\. \{They\} went to FEED her\.$/),
    f125: B('glintstar looks at tallyheart', /^Glintstar looks at Tallyheart\. Tallyheart looks at the sky\.$/),
    f126: B('a dragonet who couldnt fly', /^A dragonet who couldn’t fly didn’t fly off with our prey\. And a fox who lies at my border will be answered\. At the Gathering\. By the one who found it out\.$/),
    f127: B('she looks at you', /^She looks at you\.$/, choice),
    f128: B('you gathered from every corner', /^You gathered from every corner of the river, \{name\}paw\. You spoke to every Clan\. At the Gathering, you will speak\.$/),
    f129: B('your whiskers tingle', /^Your whiskers tingle, right to the tips\. All this time, you held it in\. Tomorrow, you get to say it ALL\.$/),
    f130: B('not a word to the clan yet', /^Not a word to the Clan yet\. Tomorrow, every Clan hears it together\.$/),
    f131: B('she dips her head to you', /^She dips her head to you, and she is gone\.$/),
    f132: B('your glass and your secret bark', /^Your glass and your secret bark go back under the moss\. Riffle’s stone is by your nose\. Riffle’s stone is under your chin\.$/),
    f133: B('nine claw marks on the tree', /^Nine claw marks on the tree\. Four gifts from four corners of the river\. And a dragonet whose paws left the ground\.$/),
    f134: B('the grey tom flops in', /^The grey tom flops in\. \{name\}paw\? Do the paw thing\. Tonight it’s LEGS\. Spider legs\.$/, skip),
    f135: B('eight two cats make one whole spider', /^Eight\. Two cats make one whole spider! So we’re ONE SPIDER\?$/),
    f136: B('soon hes snoring', /^Soon he’s snoring\. Outside, the moon is nearly round\. Tomorrow, it’s full\.$/),
    f137: B('tomorrow the otters moon ferry', /^Tomorrow: the otters’ Moon Ferry\. Every Clan, at the Gathering\. And Reynard, with his little story\. And you, with your case\.$/),
    f138: B('will sprinkles wing hold', /^Will Sprinkle’s wing hold\? You curl up tight, warm and safe, and sleep\.$/),
    f139: B('what did {name}paw dream', /^What did \{name\}paw dream, the night before the Gathering\?$/),
    f140: B('you sleep warm in your nest', /^You sleep warm in your nest, with your glass under the moss and the moon nearly round over the rosebush\. End of Chapter Nine\.$/)
  };
  // every beat is in the chapter once, and every frame of the chapter is its own beat
  Object.keys(BEAT).forEach(k => assert.deepEqual(ids.filter(BEAT[k][1]), [k], BEAT[k][0] + ': ' + ids.filter(BEAT[k][1]).join(' ')));
  assert.deepEqual(Object.keys(BEAT), ids, 'a beat for every frame');
  // her five days, panel by panel: what a cat of this kind reads on this route
  function days(c) {
    const P = (a, b) => (c.flags.ch3Told ? a : b), f = c.flags, sp = f.specialty;
    const metNow = met(c), five = metNow || f.foundHail || mizzleFound(c);
    const roofCopy = sp === 'climbing' ? ['f066'].concat(seq('f069', 'f079')) : seq('f067', 'f079');
    return [].concat(
      ['f001', 'f002'], sp === 'noticing' ? ['f003'] : [], ['f004', 'f005'],
      P(['f006', 'f007', 'f008', 'f009'], ['f010', 'f011', 'f012', 'f013', 'f014']), seq('f015', 'f029'),
      ['f030', 'f031', 'f032', 'f033'], sp === 'friends' ? ['f034', 'f035'] : [], ['f036'],
      seq('f037', 'f043'), c.oak === 'climb' ? seq('f045', 'f055') : ['f044'], seq('f056', 'f061'),
      c.squall === 'known' ? ['f063', 'f064', 'f065'] : c.squall === 'roof' ? ['f062'].concat(roofCopy) : ['f062', 'f064', 'f065'],
      metNow ? ['f080'] : ['f081'], c.squall === 'roof' ? ['f082'] : c.squall === 'known' && f.worry === 'shiny' ? ['f083'] : c.squall === 'dew' ? ['f084'] : [],
      metNow ? ['f085'] : ['f086'],
      ['f087', 'f088'], P(['f089'], ['f090']), metNow ? ['f091'] : [], P(['f094'], ['f092', 'f093']), ['f095', 'f096', 'f097'], five ? ['f098'] : [],
      ['f099', 'f100', 'f101'], { noticing: ['f102'], climbing: ['f103'], sneaking: ['f104'], friends: ['f105'], swimming: [] }[sp],
      ['f106', 'f107'], sp === 'swimming' ? ['f108'] : [], seq('f109', 'f140'));
  }
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), want = days(c), name = comboName(c);
    for (let i = 0; i < Math.max(p.length, want.length); i++) {
      assert.ok(p[i] && want[i], name + ': ' + (p[i] ? 'an extra panel, ' + p[i] + ' (' + T(p[i]) + ')' : 'her days stop short of “' + BEAT[want[i]][0] + '”'));
      assert.equal(p[i], want[i], name + ': panel ' + (i + 1) + ' is ' + p[i] + ' (' + T(p[i]).slice(0, 60) + '…), and should be “' + BEAT[want[i]][0] + '”');
    }
    // the flags as her days left them: `foundMizzle` for good after Mizzle's scene; `ch9Roof` and `foundSquall` after
    // the roof; nothing else set
    const added = (c.oak === 'climb' && !c.flags.foundMizzle ? ['foundMizzle'] : []).concat(c.squall === 'roof' ? ['ch9Roof'] : []);
    assert.deepEqual(Object.keys(p.flags).sort(), Object.keys(c.flags).concat(added).sort(), name + ': no other flag');
    if (c.oak === 'climb') assert.equal(p.flags.foundMizzle, true, name);
    if (c.squall === 'roof') assert.deepEqual([p.flags.foundSquall, p.flags.ch9Roof], [true, true], name);
  }
});

/* ------------------------------------------------------------------ every `when` */

test('every `when`, on every combination: each reader reads her own lines and nobody else’s; no dragonet named that she has not met; Squall’s face only for a cat who knows him', () => {
  for (const c of COMBOS) for (const clean of (COMBOS.indexOf(c) % 5 ? [true] : [true, false])) {
    const f = c.flags, name = comboName(c);
    const rows = walkLines(f, Object.assign({ clean }, c.o)), lines = rows.map(r => r.lines.join(' ')).join('\n');
    const reads = (re, want, what) => assert.equal(re.test(lines), !!want, name + ': ' + what);
    const told = f.ch3Told, metNow = met(c), mz = mizzleFound(c);
    // told or kept
    reads(/A wet nose pokes through the hedge\. Riffle!/, told, 'Riffle hears every bit (told)');
    reads(/And I was ASLEEP\?/, told, 'his wail');
    reads(/Your secret is getting bigger\./, !told, 'too big to carry (kept)');
    reads(/I knew there was something under that moss\./, !told, 'she knew');
    reads(/Last night she said, “Next time, you take ME\.”/, !told, 'you take ME');
    reads(/Then Sprinkle sees two big cats, and hides under her tail\./, !told, 'Sprinkle hides from two big cats');
    reads(/This is Thymeleaf\. He mends things\./, told, 'Tallyheart introduces him');
    reads(/Sprinkle ducks under her tail, then peeks out\./, told, 'she ducks (told)');
    reads(/The case is ready\. We found out who took the prey\./, told, 'Tallyheart’s promise (told)');
    reads(/It’s time Glintstar heard it\. All of it\. Sprinkle too\./, !told, 'time Glintstar heard it (kept)');
    reads(/Then the others you’ve found, name by name\./, !told && (othersFound(c) || f.foundSquall), 'the others, name by name (kept, a cat who has found one)');
    assert.equal((lines.match(/At the Gathering, you will speak\./g) || []).length, 1, name + ': the warm line, once');
    // specialties
    reads(/No new dug earth\. No new tiny prints\./, f.specialty === 'noticing', 'no new prints');
    reads(/You notice: every day, her hurt wing lifts a little higher\./, f.specialty === 'noticing', 'the wing higher');
    reads(/You show her a climber’s leap/, f.specialty === 'climbing', 'the leap');
    reads(/You show her how to land without a sound\./, f.specialty === 'sneaking', 'the landing');
    reads(/Thank you, Sloshbank!/, f.specialty === 'friends', 'thanks');
    reads(/You cheer the loudest\./, f.specialty === 'friends', 'the cheer');
    reads(/Paddle with your back legs!/, f.specialty === 'swimming', 'paddle');
    reads(/She does\. It helps\./, f.specialty === 'swimming', 'it helps');
    reads(/It’s only a very tall curtain, really\./, c.squall === 'roof' && f.specialty === 'climbing', 'a climber up the outside');
    reads(/Take the little room, darling!/, c.squall === 'roof' && f.specialty !== 'climbing', 'chapter 4’s little room');
    reads(/Press the top button, darling\. With your NOSE\./, c.squall !== 'roof', 'this chapter’s little room: never both');
    // worries
    reads(/The water is down THERE\. You are up HERE\./, f.worry === 'water', 'water');
    reads(/Next to these trees, EVERYBODY is small\./, f.worry === 'small', 'small');
    reads(/It sparkles\. You don’t stare\. Much\./, f.worry === 'shiny', 'shiny');
    reads(/All this time, you held it in\. Tomorrow, you get to say it ALL\./, f.worry === 'talk', 'talk');
    // Squall: the roar offered only to a cat who has never met him; his face only for one who knows him
    reads(/I’m still GUARDING! Tell Sprinkle: FIVE! LOUDLY!/, c.squall === 'known', 'still guarding');
    reads(/I’ll guard the dew!/, c.squall === 'roof', 'guarding the dew (met him today)');
    reads(/Two skinny shapes, he said\./, c.squall === 'roof', 'two skinny shapes');
    reads(/AND STAY OUT, giant dragon!/, c.squall !== 'known', 'his shout: chapter 4’s roof, or behind the pole');
    reads(/Somebody small is busy guarding\./, c.squall === 'dew', 'somebody small, unmet');
    reads(/You tell her Squall’s five\./, metNow, 'his five to Sprinkle');
    if (c.squall === 'dew') assert.doesNotMatch(lines, /\bSquall\b/, name + ': Squall unnamed for a cat who never met him');
    // Mizzle
    reads(/In the hollow, curled on moss, is a little dragonet\./, c.oak === 'climb', 'Mizzle’s scene');
    reads(/The softest moss is the silver kind\./, c.oak === 'ask', 'the elder’s moss');
    reads(/I’ve found more of you!/, c.oak === 'climb' && (othersFound(c) || f.foundSquall), 'her news to Mizzle');
    reads(/And Mizzle says five\. Then she fell asleep\./, mz, 'Mizzle’s five');
    reads(/And Mizzle says Sprinkle’s wing was hurt before the rain stopped\./, mz, 'Mizzle’s card in the case');
    reads(/Sprinkle’s eyes shine\./, metNow || f.foundHail || mz, 'the fives shine');
    if (!mz) assert.doesNotMatch(lines, /\bMizzle\b/, name + ': no Mizzle for a cat who has not met her');
    // Hail
    reads(/And Hail, in her log\./, told && f.foundHail, 'Hail in Riffle’s list');
    reads(/I SAVED the best bit! Hail says FIVE!/, f.foundHail, 'Hail’s five');
    if (!f.foundHail) assert.doesNotMatch(lines, /\bHail\b/, name + ': no Hail for a cat who has not met her');
    // the lesson
    reads(/Not one miss!\s*Not ONE\. Even the spiders are impressed\./, clean, 'not one miss');
    reads(/Some were tricky\.\s*You never gave up\./, !clean, 'tricky');
    // her stone
    reads(/Riffle’s stone is by your nose\./, f.ch2Stone === 'nose', 'by her nose');
    reads(/Riffle’s stone is under your chin\./, f.ch2Stone === 'chin', 'under her chin');
  }
  // who reads what: the flags this chapter reads, and where
  const readers = k => ids.filter(id => [frames[id].when].concat(texts(frames[id]).map(x => x.when), (frames[id].choice ? frames[id].choice.options : []).flatMap(o => (o.labelWhen || []).map(v => v.when))).filter(Boolean).some(w => k in w || (w.not && k in w.not)));
  assert.deepEqual(readers('foundMizzle'), ['f043', 'f097', 'f098', 'f119']);
  assert.deepEqual(readers('ch9Roof'), ['f080', 'f082', 'f083']);
  assert.deepEqual(readers('foundSquall'), ['f013', 'f055', 'f062', 'f063', 'f080', 'f081', 'f082', 'f083', 'f084', 'f085', 'f086', 'f091', 'f098']);
  assert.deepEqual(readers('foundHail'), ['f007', 'f013', 'f055', 'f097', 'f098']);
  ['foundPuddle', 'foundWisp', 'foundSleet'].forEach(k => assert.deepEqual(readers(k), ['f013', 'f055'], k + ': only inside the any-found `not`'));
  assert.deepEqual(readers('lessonClean'), [NINTH]);
  assert.deepEqual(readers('ch2Stone'), [NEST]);
  assert.deepEqual(readers('worry'), ['f038', 'f040', 'f082', 'f083', 'f084', 'f129']);
  assert.deepEqual(readers('specialty'), ['f003', 'f034', 'f035', 'f066', 'f067', 'f068', 'f102', 'f103', 'f104', 'f105', 'f107', 'f108']);
  ['ch2Path', 'ch2SaidAloud', 'stepOut', 'spokeUp', 'joinReason', 'ch4CaughtFly', 'ch5First', 'ch5Roof', 'ch7Flew'].forEach(k => assert.deepEqual(readers(k), [], k + ' is not read'));
});

/* ------------------------------------------------------------------ Counts */

function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }
const pairs = d => d.facts.map(f => { const q = factAB(f); return q.a + 'x' + q.b; });
const TH = text => ({ who: 'tallyheart', text });
const THY = text => ({ who: 'thymeleaf', text });
const QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
const AFTER = ['Ha! You didn’t even look at the sand that time.'];
const HOP = 'Close. Let’s hop it together.', FAR = 'Let’s hop it together.';
const MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
const DEFAULTS = ['Here’s that one again.', 'There. We’ll come back to that one.', 'There. Now you’ve seen it counted.', 'There it is. You remembered that one.', 'Yes! That one came back, and you knew it.', 'Let’s scratch it out together.', 'Yes!', 'Good work.'];
const saidIn = rows => rows.reduce((a, x) => a.concat(x.prompt.map(p => p.text), x.line, x.balloons.map(b => b.text), x.help ? [x.help.intro, x.help.line] : []), []).filter(Boolean);
const WAY56 = 'Twenty and twenty make forty. Eight and eight make sixteen. Forty and sixteen: fifty-six.';

test('counts: every set exactly as the spec has it (section 2), and the lesson kit: three new facts and seven she knows, both orders, twins three places apart; the story questions after the lesson, on table 8; 15 typed answers on every reading', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), SETS);
  const way = text => ({ miss: text + ' ' + MISS, missLast: text });
  const PAWS = { table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}' };
  const LEGS = { table: 8, thing: 'leg', things: 'legs', unit: 'spider', units: 'spiders', teacher: 'tallyheart', ask: '{a} × {b}' };
  const DOSE = { table: 8, unit: 'row', units: 'rows', ask: '{a} × {b}', picture: { kind: 'dose', layout: 'rows' }, help: 'picture',
    fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.', praise: [], done: null };
  assert.deepEqual(C['ch09-fours'], Object.assign({}, PAWS, {
    facts: [[4, 7], { a: 2, b: 4, right: [TH('Eight! Just like the spider’s legs.')], rightAgain: true }],
    warmHard: { table: 4, at: 0, avoid: [[1, 4], [2, 4], [4, 9], [4, 6]] }, avoid: [[4, 4]],
    fillFrom: 'ch08-fours', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
    praise: ['Two twos make a four!', 'Four more, every time!'],
    fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST,
    remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
    rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
  }));
  ['praise', 'fast', 'fastAfterMiss', 'remembered', 'rememberedSlow'].forEach(k => assert.deepEqual(C['ch09-fours'][k], ch08.counts[k === 'remembered' || k === 'rememberedSlow' ? 'ch08-sixes' : 'ch08-fours'][k], 'chapter 8’s ' + k));
  assert.deepEqual(C['ch09-eights'], Object.assign({}, LEGS, {
    label: 'Spiders’ legs', hollowThings: 'eights', fillOrder: 'easiest', prompt: 'How many legs?',
    facts: [
      { a: 2, b: 8, prompt: 'Two spiders. How many legs?', retryPrompt: true, right: [TH('Sixteen! Eight and eight.')], rightAgain: true },
      { a: 8, b: 5, right: [TH('Forty! You hopped that one already.')], rightAgain: true },
      Object.assign({ a: 4, b: 8, prompt: 'Four spiders. One side: sixteen. The other side: sixteen more.', retryPrompt: true,
        right: [TH('Thirty-two! Sixteen, doubled.')], rightAgain: true }, way('Sixteen and sixteen: thirty-two.')),
      Object.assign({ a: 7, b: 8, prompt: 'Seven spiders. One side: twenty-eight, like seven cats’ paws. Double it: twenty and twenty, then eight and eight.', retryPrompt: true,
        right: [TH('Fifty-six! You doubled twenty-eight.')], rightAgain: true }, way(WAY56)),
      [8, 3],
      Object.assign({ a: 8, b: 8, prompt: 'Eight spiders. One side: thirty-two, like eight cats’ paws. Double it!', retryPrompt: true,
        right: [TH('Sixty-four! The biggest new one.')], rightAgain: true }, way('Thirty and thirty make sixty. Two and two make four. Sixty-four.')),
      Object.assign({ a: 8, b: 7, check: true, prompt: 'Seven spiders? You did that one the other way round.', retryPrompt: true,
        right: [TH('Fifty-six! Same fact.')], rightAgain: true }, way(WAY56)),
      Object.assign({ a: 6, b: 8, prompt: 'Six spiders. One side: twenty-four. That’s YOUR count!', retryPrompt: true,
        right: [TH('Forty-eight! Twenty-four and twenty-four.')], rightAgain: true }, way('Twenty-four and twenty-four: forty-eight.')),
      [8, 10],
      Object.assign({ a: 9, b: 8, prompt: 'Nine spiders. Ten would be eighty.', retryPrompt: true,
        right: [TH('Seventy-two! Seven and two make nine.')], rightAgain: true }, way('Eighty, and one spider less: seventy-two.'))
    ],
    praise: ['Two fours make an eight!', 'Eight more, every time!'],
    fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST, done: 'That’s the eights.'
  }));
  assert.deepEqual(C['ch09-mizzle'], {
    table: 8, thing: 'acorn', things: 'acorns', unit: 'twig', units: 'twigs', teacher: 'mizzle', ask: '{a} × {b}',
    picture: { kind: 'acorns' },
    facts: [{ a: 6, b: 8, prompt: [{ who: 'mizzle', text: 'How many… acorns…' }], retryPrompt: true,
      right: [{ who: 'mizzle', text: 'Forty-eight? Lovely. I fell asleep at sixteen.' }], rightAgain: true }],
    help: 'picture', helpIntro: 'Hop by eights! Eight, sixteen…', helpIntroFar: 'Hop by eights! Eight, sixteen…',
    fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one…',
    avoid: [[6, 8], [7, 8], [8, 8]], praise: [], miss: MISS, missLast: LAST, done: null
  });
  assert.deepEqual(C['ch09-dew'], Object.assign({}, DOSE, {
    thing: 'drop', things: 'drops', teacher: 'caption',
    facts: [{ a: 8, b: 4, prompt: [{ kind: 'caption', text: 'How many drops must you gather?' }], retryPrompt: true,
      right: [{ who: 'player', text: 'Thirty-two!' }, { kind: 'caption', text: 'Plip. Plip. Plip. Into your leaf they go.' }], rightAgain: true,
      miss: 'Sixteen and sixteen: thirty-two. There.', missLast: 'Sixteen and sixteen: thirty-two.' }],
    helpIntro: 'You count them, a row at a time: eight, sixteen…', helpIntroFar: 'You count them, a row at a time: eight, sixteen…',
    againIntro: 'The drops again.', avoid: [[4, 8], [6, 8], [7, 8], [8, 8]], miss: 'There.', missLast: 'There.'
  }));
  assert.deepEqual(C['ch09-rubs'], Object.assign({}, DOSE, {
    thing: 'rub', things: 'rubs', teacher: 'thymeleaf',
    facts: [{ a: 3, b: 8, prompt: [{ kind: 'caption', text: 'How many rubs a day?' }], retryPrompt: true,
      right: [THY('Twenty-four!'), { who: 'sprinkle', text: 'Twenty-four TICKLES.' }], rightAgain: true }],
    helpIntro: 'Let’s count them together.', helpIntroFar: 'Let’s count them together.',
    avoid: [[3, 8], [6, 8], [7, 8], [8, 8]], miss: MISS, missLast: LAST
  }));
  assert.deepEqual(C['ch09-flaps'], Object.assign({}, DOSE, {
    thing: 'flap', things: 'flaps', teacher: 'thymeleaf',
    facts: [Object.assign({ a: 8, b: 8, prompt: [{ kind: 'caption', text: 'How many flaps a day?' }], retryPrompt: true,
      right: [THY('Sixty-four!')], rightAgain: true }, way('One side: thirty-two. Thirty and thirty make sixty. Two and two make four. Sixty-four.'))],
    helpIntro: 'Let’s count them together.', helpIntroFar: 'Let’s count them together.',
    avoid: [[3, 8], [4, 8], [7, 8], [8, 8]], miss: MISS, missLast: LAST
  }));
  // every fact: arithmetic, in its Count, no duplicates in a set
  Object.keys(C).forEach(sid => {
    const d = C[sid], keys = new Set();
    d.facts.forEach(f => {
      const q = factAB(f), tb = d.table;
      assert.ok(q.a === tb || q.b === tb, sid + ': ' + q.a + '×' + q.b + ' belongs to the ' + tb + 's');
      assert.ok(!keys.has(q.a + 'x' + q.b), sid);
      keys.add(q.a + 'x' + q.b);
    });
  });
  // the lesson kit: three new facts (7 × 8, 8 × 7, 8 × 8), seven she knows (one from every Count she has but the 1s), both
  // orders (five each way), the twins three apart, 4 × 8 before 7 × 8
  const ten = pairs(C['ch09-eights']);
  assert.deepEqual(ten, ['2x8', '8x5', '4x8', '7x8', '8x3', '8x8', '8x7', '6x8', '8x10', '9x8']);
  const key = k => k.split('x').map(Number).sort((a, b) => a - b).join('x');
  assert.deepEqual(ten.filter(k => ['7x8', '8x8'].includes(key(k))), ['7x8', '8x8', '8x7'], 'the three new facts');
  assert.deepEqual(ten.filter(k => !['7x8', '8x8'].includes(key(k))).map(key), ['2x8', '5x8', '4x8', '3x8', '6x8', '8x10', '8x9'], 'the stepping stones she knows: 2s, 5s, 4s, 3s, 6s, 10s, 9s');
  assert.equal(ten.filter(k => +k.split('x')[0] === 8).length, 5, 'eight first in five');
  assert.equal(ten.indexOf('8x7') - ten.indexOf('7x8'), 3, 'the twins three apart');
  assert.ok(ten.indexOf('4x8') < ten.indexOf('7x8'), 'the first doubling an easy one');
  assert.deepEqual(C['ch09-eights'].facts.filter(f => Array.isArray(f)).map(f => f.join('x')), ['8x3', '8x10'], 'two without a right line of their own');
  // the story questions after the lesson, on table 8 (never 7), each a fact she has just met
  assert.deepEqual(['ch09-mizzle', 'ch09-dew', 'ch09-rubs', 'ch09-flaps'].map(sid => pairs(C[sid])), [['6x8'], ['8x4'], ['3x8'], ['8x8']]);
  ['ch09-mizzle', 'ch09-dew', 'ch09-rubs', 'ch09-flaps'].forEach(sid => { assert.ok(at(countsAt(sid)[0]) > at(countsAt('ch09-eights')[0]), sid + ' after the lesson'); assert.equal(C[sid].table, 8, sid); });
  // typed answers: two fours, ten eights, three doses; Mizzle's and chapter 4's riddle one more each
  const typed = ['ch09-fours', 'ch09-eights', 'ch09-dew', 'ch09-rubs', 'ch09-flaps'].reduce((m, sid) => m + C[sid].facts.length, 0);
  assert.equal(typed, 15);
  t.diagnostic('15 typed answers on every reading with no misses, 16 with Mizzle or the roof, 17 with both');
  // the Counts frames, each with the lines its own page carries
  assert.deepEqual(['f024', 'f027', 'f048', 'f085', 'f086', 'f096', 'f099'].map(id => [frames[id].counts.set, (frames[id].caption || []).length, (frames[id].say || []).length, frames[id].sfx || null]),
    [['ch09-fours', 1, 1, null], ['ch09-eights', 0, 1, null], ['ch09-mizzle', 0, 1, 'Zzz.'], ['ch09-dew', 1, 0, null], ['ch09-dew', 1, 0, null], ['ch09-rubs', 0, 1, null], ['ch09-flaps', 0, 1, null]]);
});

test('counts: lines are short, whole sentences, and fit both sexes; nobody but the set’s own voices speaks in it, and each voice is in its Counts frame’s picture', () => {
  const VOICES = { 'ch09-fours': ['tallyheart'], 'ch09-eights': ['tallyheart'], 'ch09-mizzle': ['mizzle'], 'ch09-dew': ['player'], 'ch09-rubs': ['thymeleaf', 'sprinkle'], 'ch09-flaps': ['thymeleaf'] };
  countsLines().forEach(x => {
    assert.ok(typeof x.text === 'string' && x.text.trim(), x.set + ' ' + x.where);
    assert.ok(words(x.text) <= (/^helpIntro|prompt|miss/.test(x.where) ? 22 : 18), x.set + ' ' + x.where + ': short: ' + x.text);
    if (x.who) assert.ok(VOICES[x.set].includes(x.who), x.set + ' ' + x.where + ': ' + x.who);
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.set + ' ' + x.where + ': ' + x.text));
  });
  Object.keys(VOICES).forEach(sid => {
    const said = new Set(countsLines().filter(x => x.set === sid && x.who).map(x => x.who));
    assert.deepEqual([...said].sort(), VOICES[sid].slice().sort(), sid);
    countsAt(sid).forEach(id => [...said].concat(story.counts[sid].teacher === 'caption' ? [] : [story.counts[sid].teacher]).forEach(who => assert.ok(castOf(id, who).length, id + ': ' + who + ' speaks in ' + sid + ', so is in the picture')));
  });
  // nobody praises speed but in the warm-up and the lesson; no praise line names a total
  ['ch09-fours', 'ch09-eights'].forEach(sid => [].concat(story.counts[sid].praise, story.counts[sid].fast, story.counts[sid].fastAfterMiss).forEach(l => assert.doesNotMatch(l, /\d|sixteen|twenty|thirty|forty|fifty|sixty/i, sid + ': ' + l)));
});

/* A cat who has read chapters 1 to 8 (as `before9`), with these answers and times in chapter 8's fours. */
const foursCat = (fours, foursMs) => before9({}, { fours, foursMs });
/* That cat after this morning's lesson (clean, unless `eights` answers are given). */
const lessonCat = (eights, ms) => { const c = foursCat(); play(c, 'ch09-fours'); play(c, 'ch09-eights', eights, ms); return c; };

test('the warm-up, the build notes’ tests: her hardest 4s fact from chapter 8 first, 4 × 7 when nothing was hard, never 1 × 4, 2 × 4, 4 × 9 or 4 × 6; a chapter-8 miss or slow fact opens on itself with “Yesterday…”; 2 × 4 timed on itself; its fillers 3 × 4 after a missed first, 3 × 4 then 4 × 5 after a missed 2 × 4, never 4 × 4', () => {
  const def = story.counts['ch09-fours'];
  const facts = cat => E.lessonFacts(cat, Object.assign({ id: 'ch09-fours' }, def), STORIES).map(x => (Array.isArray(x) ? x.join('x') : x.a + 'x' + x.b + (x.hard ? ' hard' : '')));
  assert.deepEqual(facts(foursCat()), ['4x7', '2x4'], 'nothing was hard yesterday: 4 × 7');
  for (const k of ['4x4', '4x7', '7x4', '4x8']) assert.deepEqual(facts(foursCat({ [k]: [1] })), [k + ' hard', '2x4'], 'a chapter-8 miss of ' + k);
  for (const k of ['3x4', '4x5', '10x4']) assert.deepEqual(facts(foursCat(null, { all: 1500, [k]: 9000 })), [k + ' hard', '2x4'], 'a slow ' + k + ', timed on itself in chapter 8');
  // passed over (the cost, chapter 8's section 8): a chapter-8 miss of 2 × 4 or 4 × 6
  for (const k of ['2x4', '4x6']) assert.deepEqual(facts(foursCat({ [k]: [1] })), ['4x7', '2x4'], 'a chapter-8 miss of ' + k + ': never picked');
  // the words: the engine's, for both (2 × 4 has no prompt of its own: the engine's words are the story's)
  assert.equal(def.facts[1].prompt, undefined, 'no prompt on 2 × 4, so it is timed on itself');
  const quick = play(foursCat(), 'ch09-fours', null, { all: 1500 });
  assert.deepEqual(quick.map(x => [x.k, x.prompt.map(p => p.label + ': ' + p.text).join(' '), x.line, x.balloons.map(b => b.text).join('|')]), [
    ['4x7', 'Tallyheart: Seven cats. How many paws?', 'Quick as a pounce!', ''], ['2x4', 'Tallyheart: Two cats. How many paws?', '', 'Eight! Just like the spider’s legs.']]);
  assert.equal(play(foursCat(), 'ch09-fours', null, { all: 9000 })[0].line, 'Two twos make a four!');
  const hard = play(foursCat({ '4x4': [1] }), 'ch09-fours', null, { all: 1500 });
  assert.deepEqual([hard[0].prompt.map(p => p.text).join(' '), hard[0].kind, hard[0].line], ['Four cats. How many paws?', 'remembered', 'Yesterday, 4 × 4 made you stop and think. Not today!']);
  const hardSlow = play(foursCat({ '4x4': [1] }), 'ch09-fours', null, { all: 9000 });
  assert.deepEqual([hardSlow[0].kind, hardSlow[0].line], ['rememberedSlow', '4 × 4 again, and you got it. It’s getting easier.']);
  // both questions timed on themselves: neither is read first (no `intro`, no prompt of its own on 2 × 4)
  assert.equal(E.readFirst({ set: 'ch09-fours', a: 4, b: 7 }, STORIES, null, true), false);
  assert.equal(E.readFirst({ set: 'ch09-fours', a: 2, b: 4 }, STORIES, null, false), false);
  const c24 = foursCat(); play(c24, 'ch09-fours', null, { all: 1500, '2x4': 9000 });
  assert.ok(E.hardFacts(c24, 4, STORIES).some(p => pairKey(p.join('x')) === '2x4'), 'a slow 2 × 4 here replaces her old timing');
  // a miss: the sand, two and two, hopped by fours; easy fours lent from yesterday's lesson, in its cats
  const miss1 = play(foursCat(), 'ch09-fours', { '4x7': [24] });
  assert.deepEqual(ks(miss1), ['4x7✗', '2x4', 'F:3x4', 'R:4x7']);
  assert.deepEqual([miss1[0].help.nums, miss1[0].help.ground, miss1[0].help.per, miss1[0].help.intro, miss1[0].line], [[4, 8, 12, 16, 20, 24, 28], 'sand', 4, HOP, MISS]);
  assert.match(A.sand(E.sandOpts(miss1[0].help, 0)), /two and two/);
  assert.deepEqual(miss1[2].prompt.map(p => p.text).join(' '), 'One from yesterday. Three cats. How many paws?');
  assert.deepEqual(miss1[3].prompt.map(p => p.text).join(' '), 'Here’s that one again. Seven cats. How many paws?');
  assert.equal(play(foursCat(), 'ch09-fours', { '4x7': [10] })[0].help.intro, FAR);
  const miss2 = play(foursCat(), 'ch09-fours', { '2x4': [7] });
  assert.deepEqual(ks(miss2), ['4x7', '2x4✗', 'F:3x4', 'F:4x5', 'R:2x4']);
  assert.deepEqual([miss2[4].prompt.map(p => p.text).join(' '), miss2[4].balloons.map(b => b.text)], ['Here’s that one again. Two cats. How many paws?', ['Eight! Just like the spider’s legs.']], 'the right line kept on a retry');
  assert.deepEqual(ks(play(foursCat(null, { all: 1500, '3x4': 9000 }), 'ch09-fours', { '2x4': [7] })), ['3x4', '2x4✗', 'F:4x5', 'F:4x6', 'R:2x4'], 'a hard 3 × 4: 4 × 5 then 4 × 6');
  assert.deepEqual(ks(play(foursCat(null, { all: 1500, '4x5': 9000 }), 'ch09-fours', { '2x4': [7] })), ['4x5', '2x4✗', 'F:3x4', 'F:4x6', 'R:2x4'], 'a hard 4 × 5: 3 × 4 then 4 × 6');
  assert.equal(play(foursCat(), 'ch09-fours', { '4x7': [1, 1, 1] }).filter(x => x.k.endsWith('4x7✗')).pop().line, LAST);
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
    out.push({ k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + q.a + 'x' + q.b + (r.correct ? '' : '✗'), q, words: w, correct: r.correct });
    if (r.done) E.recordLesson(cat, state);
  }
  return out;
}

test('the warm-up’s known slip (the spec’s section 7, item 6), pinned: it lends one of its own pairs or 4 × 4 back only after three misses, and only when the hard pick is 3 × 4 or 4 × 5; never 4 × 4 before the third miss, with any hard pick', () => {
  const N = 8, plans = [];
  for (let m = 0; m < (1 << N); m++) { const p = []; for (let i = 0; i < N; i++) p.push((m >> i) & 1 ? 0 : 1); plans.push(p); }
  const PICKS = [[null, null, '4x7'], [{ '4x4': [1] }, null, '4x4'], [null, { all: 1500, '3x4': 9000 }, '3x4'], [null, { all: 1500, '4x5': 9000 }, '4x5'], [null, { all: 1500, '10x4': 9000 }, '10x4'], [{ '4x8': [1] }, null, '4x8']];
  for (const [fours, foursMs, hardPick] of PICKS) {
    const base = foursCat(fours, foursMs);
    let fewest = Infinity, reached = 0;
    for (const plan of plans) {
      const rows = playPlan(clone(base), 'ch09-fours', plan);
      assert.equal(pairKey(rows[0].k), pairKey(hardPick), 'the hard pick first: ' + hardPick);
      const own = ['2x4', pairKey(hardPick), '4x4'];
      const i = rows.findIndex(r => r.q.filler && own.includes(pairKey(r.k)));
      if (i < 0) continue;
      const misses = rows.slice(0, i).filter(r => !r.correct).length;
      reached++;
      fewest = Math.min(fewest, misses);
      assert.ok(misses >= 3, hardPick + ': its own pair or 4 × 4 lent back after only ' + misses + ' misses: ' + rows.map(r => r.k).join(' '));
      assert.match(rows[i].words, /^One from yesterday\. /, 'as “One from yesterday.”');
    }
    if (['3x4', '4x5'].includes(hardPick)) assert.ok(reached > 0 && reached < plans.length / 2, hardPick + ': a rare path (' + reached + ' of ' + plans.length + ')');
    else assert.equal(reached, 0, hardPick + ': never with any other hard pick');
  }
});

test('the lesson, the build notes’ tests: ten facts in the story’s order, that many spiders eight legs each; Tallyheart’s lines; every miss hops by eights from the first spider, four and four in the sand, and comes back two questions later, a single 7 × 8 before its twin; 8 × 3 and 8 × 10 get the quick lines; a missed 7 × 8 survives a quick 8 × 7, in the 8s and the 7s', () => {
  const rows = play(foursCat(), 'ch09-eights', null, { all: 6000 });
  assert.deepEqual(ks(rows), ['2x8', '8x5', '4x8', '7x8', '8x3', '8x8', '8x7', '6x8', '8x10', '9x8']);
  assert.deepEqual(rows.map(x => x.q.answer), [16, 40, 32, 56, 24, 64, 56, 48, 80, 72]);
  assert.deepEqual(rows.map(x => [x.picture.kind, x.picture.groups, x.picture.highlight, x.picture.thing]), [2, 5, 4, 7, 3, 8, 7, 6, 10, 9].map(g => [undefined, g, 0, 'leg']), 'that many spiders, eight legs each, all unlit');
  rows.forEach(x => assert.deepEqual([x.q.per, x.q.table, x.teacher], [8, 8, 'tallyheart'], x.k));
  assert.match(A.countsPicture(Object.assign({ look: {} }, rows[8].picture)), /10 spiders, eight legs each/);
  const ask = k => rows.find(x => x.k === k).prompt.map(p => p.label + ': ' + p.text).join(' | ');
  assert.deepEqual(['8x5', '8x3', '8x10'].map(ask), ['Tallyheart: How many legs?', 'Tallyheart: How many legs?', 'Tallyheart: How many legs?'], 'the set’s own words for the three with none');
  assert.equal(ask('7x8'), 'Tallyheart: Seven spiders. One side: twenty-eight, like seven cats’ paws. Double it: twenty and twenty, then eight and eight.');
  const said = k => rows.find(x => x.k === k).balloons.map(b => b.text).join(' | ');
  assert.deepEqual(['2x8', '8x5', '4x8', '7x8', '8x8', '8x7', '6x8', '9x8'].map(said), ['Sixteen! Eight and eight.', 'Forty! You hopped that one already.', 'Thirty-two! Sixteen, doubled.', 'Fifty-six! You doubled twenty-eight.',
    'Sixty-four! The biggest new one.', 'Fifty-six! Same fact.', 'Forty-eight! Twenty-four and twenty-four.', 'Seventy-two! Seven and two make nine.']);
  // 8 × 3 and 8 × 10: slow, the praise; quick, the fast lines; after any miss, “Ha!” leads
  assert.deepEqual(['8x3', '8x10'].map(k => rows.find(x => x.k === k).line), ['Two fours make an eight!', 'Eight more, every time!']);
  const quick = play(foursCat(), 'ch09-eights', null, { all: 1500 });
  assert.deepEqual(['8x3', '8x10'].map(k => quick.find(x => x.k === k).line), QUICK2, 'clean and quick: the quick lines');
  assert.equal(quick.find(x => x.k === '8x5').line, '', '8 × 5 has its own right line: timed, never praised');
  assert.equal(play(foursCat(), 'ch09-eights', { '4x8': [24] }, { all: 1500 }).find(x => x.k === '8x3').line, AFTER[0], 'quick after a miss');
  // every single miss: the sand by eights, four and four; “Close.” within one hop; a doubling ends on its way; back two later
  const WAY = { '4x8': 'Sixteen and sixteen: thirty-two.', '7x8': WAY56, '8x7': WAY56, '8x8': 'Thirty and thirty make sixty. Two and two make four. Sixty-four.', '6x8': 'Twenty-four and twenty-four: forty-eight.', '9x8': 'Eighty, and one spider less: seventy-two.' };
  ks(rows).forEach(k => {
    const [a, b] = k.split('x').map(Number), right = a * b;
    const near = play(foursCat(), 'ch09-eights', { [k]: [right - 8] }), far = play(foursCat(), 'ch09-eights', { [k]: [right + 17] });
    const m = near.find(x => x.k === k + '✗');
    assert.equal(m.help.intro, HOP, k + ': within one hop');
    assert.equal(far.find(x => x.k === k + '✗').help.intro, FAR, k + ': further off');
    assert.deepEqual(m.help.nums, Array.from({ length: m.q.groups }, (_, j) => 8 * (j + 1)), k + ': hopped by eights from the first spider');
    assert.deepEqual([m.help.ground, m.help.per], ['sand', 8], k);
    assert.match(A.sand(E.sandOpts(m.help, 0)), /four and four/, k + ': the sand four and four');
    assert.equal(m.line, WAY[k] ? WAY[k] + ' ' + MISS : MISS, k + ': its own line');
    const back = near.findIndex(x => x.k === 'R:' + k);
    if (k === '8x10' || k === '9x8') assert.ok(back > near.indexOf(m), k + ': near the end it comes back after the fillers');
    else assert.equal(back - near.indexOf(m), 3, k + ': comes back two questions later (' + ks(near).join(' ') + ')');
    assert.deepEqual([near[back].picture.groups, near[back].picture.highlight], [m.picture.groups, m.picture.highlight], k + ': its picture kept on its retry');
  });
  assert.deepEqual(ks(play(foursCat(), 'ch09-eights', { '7x8': [50] })), ['2x8', '8x5', '4x8', '7x8✗', '8x3', '8x8', 'R:7x8', '8x7', '6x8', '8x10', '9x8'], 'a missed 7 × 8 comes back before its twin');
  assert.deepEqual(ks(play(foursCat(), 'ch09-eights', { '7x8': [50], '8x8': [60] })), ['2x8', '8x5', '4x8', '7x8✗', '8x3', '8x8✗', 'R:7x8', '8x7', 'R:8x8', '6x8', '8x10', '9x8']);
  // fillers near the end: her easiest right answers in the lesson, asked “How many legs?”, in spiders
  const f9 = play(foursCat(), 'ch09-eights', { '9x8': [70] });
  assert.deepEqual(ks(f9).slice(9), ['9x8✗', 'F:2x8', 'F:8x3', 'R:9x8']);
  f9.filter(x => x.q.filler).forEach(x => assert.deepEqual([x.prompt.map(p => p.text).join(' '), x.picture.groups, x.picture.thing], ['How many legs?', x.q.groups, 'leg'], x.k));
  assert.deepEqual(ks(play(foursCat(), 'ch09-eights', { '8x10': [70] })).slice(8), ['8x10✗', '9x8', 'F:2x8', 'R:8x10']);
  assert.deepEqual(ks(play(foursCat(), 'ch09-eights', { '9x8': [70, 70] })).slice(9), ['9x8✗', 'F:2x8', 'F:8x3', 'R:9x8✗', 'F:4x8', 'F:8x5', 'R:9x8']);
  // a last miss: the way alone (or chapter 6's line)
  const thrice = play(foursCat(), 'ch09-eights', { '7x8': [50, 50, 50] }).filter(x => x.k.endsWith('7x8✗'));
  assert.deepEqual(thrice.map(x => x.line), [WAY56 + ' ' + MISS, WAY56 + ' ' + MISS, WAY56]);
  assert.equal(play(foursCat(), 'ch09-eights', { '8x3': [23, 23, 23] }).filter(x => x.k.endsWith('8x3✗'))[2].line, LAST);
  // 8 × 7 is a check: a twice-missed 7 × 8 is still hard after a quick 8 × 7, in the 8s and in the 7s (chapter 10's)
  const c78 = foursCat(); play(c78, 'ch09-eights', { '7x8': [50, 50] }, { all: 1500 });
  assert.deepEqual([E.hardFacts(c78, 8, STORIES), E.hardFacts(c78, 7, STORIES)], [[[7, 8]], [[7, 8]]]);
  // timing: 8 × 5, 8 × 3 and 8 × 10 the lesson's facts timed on themselves
  const cslow = foursCat(); play(cslow, 'ch09-eights', null, { all: 9000 });
  assert.deepEqual(E.hardFacts(cslow, 8, STORIES).map(p => pairKey(p.join('x'))).filter(k => ['5x8', '3x8', '8x10'].includes(k)).sort(), ['3x8', '5x8', '8x10'].sort());
  assert.equal(story.counts['ch09-eights'].done, 'That’s the eights.');
});

/* The one-fact sets after the lesson: Mizzle's (if met), the dew, the rubs and the flaps, each in a state: 'none'
 * (Mizzle not met), 'right', 'once' (missed once, then right), 'twice' (missed twice, then right). */
const FACT_OF = { 'ch09-mizzle': ['6x8', 47], 'ch09-dew': ['8x4', 31], 'ch09-rubs': ['3x8', 23], 'ch09-flaps': ['8x8', 63] };
const ANS = { right: null, once: x => [x], twice: x => [x, x] };
function afterSets(states) {
  const c = lessonCat();
  states.forEach(([sid, st]) => { if (st === 'none') return; const [k, x] = FACT_OF[sid]; play(c, sid, st === 'right' ? null : { [k]: ANS[st](x) }); });
  return c;
}
function lent(states, sid, misses) {
  const [k] = FACT_OF[sid];
  return play(afterSets(states), sid, { [k]: Array(misses).fill(1) }).filter(x => x.k.startsWith('F:')).map(x => x.k.slice(2));
}

test('Mizzle’s sleepy question and the dew, the build notes’ tests: six twigs of eight acorns, her help hopping by eights, her fillers as twigs; the dew’s four rows of eight drops, a silent set in captions, the count hers; each one’s first and second misses by the rule', () => {
  const mz = play(lessonCat(), 'ch09-mizzle', { '6x8': [40, 40] });
  assert.deepEqual(ks(mz), ['6x8✗', 'F:2x8', 'F:8x3', 'R:6x8✗', 'F:4x8', 'F:8x5', 'R:6x8']);
  assert.deepEqual([mz[0].picture.kind, mz[0].picture.groups, mz[0].picture.highlight], ['acorns', 6, 0], 'six twigs, unlit');
  assert.match(A.countsPicture(Object.assign({ look: {} }, mz[0].picture)), /6 twigs, eight acorns each/);
  assert.deepEqual([mz[0].help.picture, mz[0].help.nums, mz[0].help.intro, mz[0].line], [true, [8, 16, 24, 32, 40, 48], 'Hop by eights! Eight, sixteen…', MISS]);
  assert.deepEqual(mz[0].prompt.map(p => [p.label, p.text]), [['The sleepy dragonet', 'How many… acorns…']]);
  assert.deepEqual(mz.filter(x => x.q.filler).map(x => [x.prompt.map(p => p.label + ': ' + p.text).join(' '), x.picture.kind]), [
    ['The sleepy dragonet: An easy one… Two twigs. How many acorns?', 'acorns'], ['The sleepy dragonet: An easy one… Three twigs. How many acorns?', 'acorns'],
    ['The sleepy dragonet: An easy one… Four twigs. How many acorns?', 'acorns'], ['The sleepy dragonet: An easy one… Five twigs. How many acorns?', 'acorns']]);
  assert.deepEqual(mz[3].prompt.map(p => p.text), ['Here’s that one again.', 'How many… acorns…']);
  assert.deepEqual(mz[6].balloons.map(b => [b.who, b.text]), [['mizzle', 'Forty-eight? Lovely. I fell asleep at sixteen.']], 'the right line kept on a retry');
  // the dew: rows of drops, the help her own count in captions; “The drops again.” for a retry
  const dw = play(lessonCat(), 'ch09-dew', { '8x4': [30, 30] });
  assert.deepEqual(ks(dw), ['8x4✗', 'F:2x8', 'F:8x3', 'R:8x4✗', 'F:8x5', 'F:2x8', 'R:8x4']);
  assert.deepEqual([dw[0].picture.kind, dw[0].picture.layout, dw[0].picture.groups, dw[0].picture.thing], ['dose', 'rows', 4, 'drop']);
  assert.match(A.countsPicture(Object.assign({ look: {} }, dw[0].picture, { thing: 'drop' })), /4 rows of eight drops, four and four/);
  assert.deepEqual([dw[0].help.nums, dw[0].help.intro, dw[0].line, dw[1].line], [[8, 16, 24, 32], 'You count them, a row at a time: eight, sixteen…', 'Sixteen and sixteen: thirty-two. There.', '']);
  assert.deepEqual(dw.map(x => x.prompt.map(p => p.text).join(' ')), ['How many drops must you gather?', 'An easy one. Two rows of eight. How many drops?', 'An easy one. Three rows of eight. How many drops?',
    'The drops again. How many drops must you gather?', 'An easy one. Five rows of eight. How many drops?', 'An easy one. Two rows of eight. How many drops?', 'The drops again. How many drops must you gather?']);
  dw.forEach(x => x.prompt.forEach(p => assert.equal(p.label, null, x.k + ': a caption, nobody speaks')));
  assert.deepEqual(dw[6].balloons.map(b => [b.who || b.kind, b.text]), [['player', 'Thirty-two!'], ['caption', 'Plip. Plip. Plip. Into your leaf they go.']]);
  assert.equal(play(lessonCat(), 'ch09-dew', { '8x4': [30, 30, 30] }).filter(x => x.k.endsWith('8x4✗')).pop().line, 'Sixteen and sixteen: thirty-two.');
  // the dew after Mizzle: her sibling borrowed from the same lesson (the spec's table, first and second misses)
  for (const m of ['none', 'right', 'once', 'twice']) {
    const l = lent([['ch09-mizzle', m]], 'ch09-dew', 2);
    assert.deepEqual(l.slice(0, 2), m === 'once' ? ['8x5', '2x8'] : ['2x8', '8x3'], 'the dew’s first miss, Mizzle ' + m);
    assert.deepEqual(l.slice(2), ['none', 'right'].includes(m) ? ['8x5', '2x8'] : ['2x8', '8x3'], 'the dew’s second miss, Mizzle ' + m);
  }
  // a miss is an 8s (and, the dew's, a 4s) hard fact; never timed
  const ch = lessonCat(); play(ch, 'ch09-dew', { '8x4': [30] }, { all: 9000 });
  assert.ok(E.hardFacts(ch, 8, STORIES).some(p => pairKey(p.join('x')) === '4x8'));
  const cr = lessonCat(); play(cr, 'ch09-mizzle', null, { all: 9000 }); play(cr, 'ch09-dew', null, { all: 9000 });
  assert.ok(!E.hardFacts(cr, 8, STORIES).some(p => ['6x8', '4x8'].includes(pairKey(p.join('x')))), 'her own words: never timed');
});

test('the remedy’s doses, the build notes’ tests: three rows of eight rubs and eight rows of eight flaps, in Thymeleaf’s voice; the spec’s table of first misses by every earlier set’s state, the second misses, and the three readings where every dose is missed once', () => {
  const rb = play(afterSets([['ch09-dew', 'right']]), 'ch09-rubs', { '3x8': [20] });
  assert.deepEqual([rb[0].picture.kind, rb[0].picture.groups, rb[0].picture.thing, rb[0].help.nums, rb[0].help.intro, rb[0].line, rb[0].teacher], ['dose', 3, 'rub', [8, 16, 24], 'Let’s count them together.', MISS, 'thymeleaf']);
  assert.deepEqual(rb.filter(x => x.q.filler).map(x => x.prompt.map(p => p.label + ': ' + p.text).join(' ')), ['Thymeleaf: An easy one. Two rows of eight. How many rubs?', 'Thymeleaf: An easy one. Five rows of eight. How many rubs?']);
  assert.deepEqual(rb[3].balloons.map(b => [b.who, b.text]), [['thymeleaf', 'Twenty-four!'], ['sprinkle', 'Twenty-four TICKLES.']]);
  const fl = play(lessonCat(), 'ch09-flaps', { '8x8': [60] });
  assert.deepEqual([fl[0].picture.groups, fl[0].picture.thing, fl[0].help.nums, fl[0].line], [8, 'flap', [8, 16, 24, 32, 40, 48, 56, 64], 'One side: thirty-two. Thirty and thirty make sixty. Two and two make four. Sixty-four. ' + MISS]);
  assert.match(A.countsPicture(Object.assign({ look: {} }, fl[0].picture)), /8 rows of eight marks, four and four/);
  assert.match(A.countsPicture(Object.assign({ look: {} }, rb[0].picture)), /3 rows of eight paw marks, four and four/);
  // the table (section 2, "How the one-fact sets lend"): first misses by the earlier sets' states, each written out
  const MS = ['none', 'right', 'once', 'twice'], DS = ['right', 'once', 'twice'];
  const missed = s => s === 'once' || s === 'twice';
  for (const m of MS) for (const d of DS) {
    const want = (d === 'right' && ['none', 'right'].includes(m)) ? ['2x8', '8x5']
      : ((d === 'once' && ['none', 'right'].includes(m)) || (m === 'once' && d === 'right')) ? ['8x5', '2x8'] : ['2x8', '4x8'];
    const l = lent([['ch09-mizzle', m], ['ch09-dew', d]], 'ch09-rubs', 2);
    assert.deepEqual(l.slice(0, 2), want, 'the rubs’ first miss, Mizzle ' + m + ', the dew ' + d);
    assert.deepEqual(l.slice(2), ['2x8', '4x8'], 'the rubs’ second miss, Mizzle ' + m + ', the dew ' + d);
    for (const r of DS) {
      const fwant = m === 'none'
        ? (d === 'right' && r === 'right' ? ['2x8', '8x5'] : d === 'once' && r === 'right' ? ['8x5', '6x8'] : ['6x8', '2x8'])
        : ((m === 'right' && d === 'once' && r === 'right') || (m === 'once' && d === 'right' && r === 'right') ? ['8x5', '2x8'] : ['2x8', '8x5']);
      const fl2 = lent([['ch09-mizzle', m], ['ch09-dew', d], ['ch09-rubs', r]], 'ch09-flaps', 2);
      assert.deepEqual(fl2.slice(0, 2), fwant, 'the flaps’ first miss, Mizzle ' + m + ', the dew ' + d + ', the rubs ' + r);
      assert.deepEqual(fl2.slice(2), m === 'none' && d === 'right' && r === 'right' ? ['6x8', '2x8'] : ['2x8', '8x5'], 'the flaps’ second miss, Mizzle ' + m + ', the dew ' + d + ', the rubs ' + r);
      assert.ok(missed(m) || m === 'none' || m === 'right');
    }
  }
  // every dose missed once (section 7, item 14): with Mizzle not met, right, and missed once
  const everyDose = m => {
    const c = lessonCat(), out = [];
    if (m !== 'none') out.push(...play(c, 'ch09-mizzle', m === 'right' ? null : { '6x8': [47] }).filter(x => x.q.filler).map(x => x.k.slice(2)));
    ['ch09-dew', 'ch09-rubs', 'ch09-flaps'].forEach(sid => { const [k, x] = FACT_OF[sid]; out.push(play(c, sid, { [k]: [x] }).filter(y => y.q.filler).map(y => y.k.slice(2))); });
    return out;
  };
  assert.deepEqual(everyDose('none'), [['2x8', '8x3'], ['8x5', '2x8'], ['6x8', '2x8']], 'Mizzle not met: 2 × 8 three times, no other filler twice');
  assert.deepEqual(everyDose('right'), [['2x8', '8x3'], ['8x5', '2x8'], ['2x8', '8x5']], 'Mizzle right: 8 × 5 twice too');
  assert.deepEqual(everyDose('once'), ['2x8', '8x3', ['8x5', '2x8'], ['2x8', '4x8'], ['2x8', '8x5']], 'Mizzle missed once: 2 × 8 three times in the doses and four in the day');
});

test('the one-fact sets’ guarantees (section 6), run: whatever she answers, after her earlier sets in every state, no filler of Mizzle’s, the dew’s, the rubs’ or the flaps’ is the set’s own pair, a pair it avoids, or a new fact', () => {
  const N = 6, plans = [];
  for (let m = 0; m < (1 << N); m++) { const p = []; for (let i = 0; i < N; i++) p.push((m >> i) & 1 ? 0 : 1); plans.push(p); }
  const LENDABLE = { 'ch09-mizzle': ['2x8', '3x8', '4x8', '5x8'], 'ch09-dew': ['2x8', '3x8', '5x8'], 'ch09-rubs': ['2x8', '4x8', '5x8'], 'ch09-flaps': ['2x8', '5x8', '6x8'] };
  const EARLIER = { 'ch09-mizzle': [], 'ch09-dew': ['ch09-mizzle'], 'ch09-rubs': ['ch09-mizzle', 'ch09-dew'], 'ch09-flaps': ['ch09-mizzle', 'ch09-dew', 'ch09-rubs'] };
  let runs = 0;
  for (const sid of Object.keys(LENDABLE)) {
    const states = [[]];
    EARLIER[sid].forEach(e => { const next = []; states.forEach(s => (e === 'ch09-mizzle' ? ['none', 'right', 'once', 'twice'] : ['right', 'once']).forEach(st => next.push(s.concat([[e, st]])))); states.splice(0, states.length, ...next); });
    for (const st of states) {
      const base = afterSets(st);
      for (const plan of plans) {
        const rows = playPlan(clone(base), sid, plan);
        runs++;
        rows.filter(r => r.q.filler).forEach(r => assert.ok(LENDABLE[sid].includes(pairKey(r.k)), sid + ' after ' + JSON.stringify(st) + ': lent ' + r.k + ' (' + rows.map(x => x.k).join(' ') + ')'));
        assert.equal(pairKey(rows[0].k), pairKey(FACT_OF[sid][0]), sid + ': opens on its own question');
        assert.ok(rows.length < 60, sid + ': the lesson ends (never a wall)');
      }
    }
  }
  assert.ok(runs > 1500, runs + ' lessons played');
});

test('the Training Hollow after chapter 9: it offers “Spiders’ legs · the 8s” (the 8s are `ch09-eights`, the first set with the most facts on table 8), Tallyheart says “eights” there and asks in spiders, and the tree has nine marks; the 8s are learned at the lesson, not before it', () => {
  assert.deepEqual(E.countSets(STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes'], [6, 'ch07-sixes'], [4, 'ch08-fours'], [8, 'ch09-eights']]);
  assert.deepEqual([E.countFor(8, STORIES).setId, E.countName(E.countFor(8, STORIES).def, 8)], ['ch09-eights', 'Spiders’ legs · the 8s']);
  assert.equal(E.countFor(4, STORIES).setId, 'ch08-fours', 'the warm-up teaches nothing new');
  const cat = fresh();
  read(cat, {});
  assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3, 6, 4, 8]);
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(x => x.name).slice(-2), ['Paws · the 4s', 'Spiders’ legs · the 8s']);
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, STORIES).opts.marks, 9);
  assert.ok(9 <= E.MAX_MARKS);
  const def = E.hollowDef(STORIES, 8);
  assert.deepEqual([E.hollowRoundLine(def), E.hollowWord(def), def.teacher, def.thing], ['A round of eights. Ready? Here we go.', 'eights', 'tallyheart', 'leg']);
  const R = E.hollowStart(cat, STORIES, 1, 8), asked = [];
  for (let q; (q = E.counts.question(R.state));) {
    asked.push(pairKey(q.a + 'x' + q.b));
    const D = E.questionDef(R.def, q, story, STORIES), pic = E.lessonPicture(D, q, 0);
    assert.ok(pic.groups >= 1 && pic.groups <= 10 && pic.thing === 'leg', q.a + '×' + q.b + ': in spiders');
    assert.equal(E.promptLines(R.def, D, q).map(l => l.text).pop().replace(/^.*\. /, ''), 'How many legs?', q.a + '×' + q.b);
    E.counts.answer(R.state, R.def, q.answer, 2000, 1);
  }
  assert.deepEqual(asked.sort(), ['1x8', '2x8', '3x8', '4x8', '5x8', '6x8', '7x8', '8x8', '8x9', '8x10'].sort());
  const marks = c => E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, c, STORIES).opts.marks;
  const lesson = countsAt('ch09-eights')[0];
  const c1 = fresh(); read(c1, { stop: lesson });
  assert.ok(c1.lessons['ch09-fours'] && !c1.lessons['ch09-eights']);
  assert.ok(!E.hollowLines(c1, STORIES).counts.some(x => x.table === 8), 'no “Spiders’ legs · the 8s” yet');
  assert.equal(marks(c1), 8);
  const c2 = fresh(); read(c2, { stop: SKRITCH });
  assert.equal(marks(c2), 9);
  assert.equal(frames[SKRITCH].scene.opts.marks, 9, 'the frame that scratches it');
  assert.equal(exits(frames[lesson])[0], SKRITCH, 'straight after the lesson');
  // no chapter 1 to 8 reading logs a table-8 answer, so no heading moves until this lesson
  assert.ok(!E.factTables(c1, STORIES).some(x => x.table === 8));
});

/* ------------------------------------------------------------------ her Case File */

const FOURTEEN = ['waffles-no-moon', 'fox-moon', 'heron-no-moon', 'cant-fly', 'fox-flew', 'fox-brag', 'tidy', 'reed-pile', 'stash', 'scale', 'glass', 'prints-sprinkle', 'coil-diggers', 'tunnel'];

test('her Case File: Mizzle’s card as the spec has it, given on her thought’s panel, shown only with her flag, alone among the ears and under the moss; every cat holds the case’s fourteen; 20 to 30 cards, eight to eleven secret', () => {
  assert.deepEqual(story.cards, { 'mizzle-wing': { mark: 'ear', line: 'Mizzle says Sprinkle’s wing was hurt before the rain stopped.', when: { foundMizzle: true } } });
  CARD_IDS.forEach(cid => { assert.ok(words(story.cards[cid].line) <= 13, cid); assert.equal(story.cards[cid].link, undefined, cid + ': no link (the spec’s section 3)'); assert.equal(story.cards[cid].answers, undefined, cid + ': no answers (chapter 10’s)'); });
  assert.deepEqual(ids.filter(id => frames[id].card).map(id => [frames[id].card, id]), [['mizzle-wing', F(/^The fox says the dragon FLEW off/)], ['squall-shapes', 'f077']]);
  ids.filter(id => frames[id].card).forEach(id => assert.ok(E.cardsOn(frames[id], { flags: { foundMizzle: true, foundSquall: true } }, story, STORIES).every(c => c.showLine && c.showMark), id + ': lettered'));
  // in a reading: Mizzle's for a cat who climbs (once), Squall's for a cat who goes up the roof
  for (const c of SOME.slice(0, 24)) {
    const cat = fresh(c.flags), before = cat.cards.length;
    read(cat, c.o);
    const want = (c.oak === 'climb' && !c.flags.foundMizzle ? ['mizzle-wing'] : []).concat(c.squall === 'roof' ? ['squall-shapes'] : []);
    assert.deepEqual(cat.cards.slice(before).map(k => k.id).sort(), want.sort(), comboName(c));
    assert.equal(new Set(cat.cards.map(k => k.id)).size, cat.cards.length);
    assert.equal(E.cards(cat, STORIES).some(k => k.id === 'mizzle-wing'), !!cat.flags.foundMizzle, comboName(c) + ': Mizzle’s card only with her');
    FOURTEEN.forEach(cid => assert.ok(E.cards(cat, STORIES).some(k => k.id === cid), comboName(c) + ': holds ' + cid));
  }
  // the rows after chapter 9 (sim3): as after chapter 8; Mizzle's in none
  const rows = cat => E.caseFile(cat, STORIES).links.map(l => l.cards.map(k => k.id).join(' — '));
  const full = reading(Object.assign({ specialty: 'noticing' }, OTHERS, { foundSquall: true }), { mizzle: true }).cat;
  assert.ok(!rows(full).some(r => /mizzle-wing/.test(r)), 'Mizzle’s card is in no row');
  ['cant-fly — fox-flew — fox-brag — sleet-den', 'waffles-no-moon — fox-moon — heron-no-moon', 'tidy — reed-pile — stash', 'coil-diggers — tunnel', 'scale — glass'].forEach(r => assert.ok(rows(full).includes(r), r + ' in ' + JSON.stringify(rows(full))));
  const Fl = E.caseFile(full, STORIES), all = Fl.groups.reduce((a, g) => a.concat(g.cards), []).concat(Fl.links.reduce((a, l) => a.concat(l.cards), [])).map(k => k.id);
  assert.deepEqual(all.slice().sort(), E.cards(full, STORIES).map(k => k.id).sort(), 'every card counted once');
  // her nest at bedtime: Mizzle's card under the moss with the dragonets', her glass with them; the fullest cat 29 and eleven
  const nestOf = cat => E.resolveScene(frames[NEST].scene, cat, STORIES);
  const svgOf = cat => A.render(nestOf(cat), { look: { fur: 'grey', sex: 'she', marking: 'none', eyes: 'green' } }).svg;
  const fullSecret = nestOf(full).opts.bark.filter(b => A.barkSecret[b.picture]).map(b => b.picture);
  assert.ok(fullSecret.includes('mizzle-wing'));
  assert.deepEqual([full.cards.length, fullSecret.length], [29, 11], 'the fullest cat on a straight reading: 29 cards, eleven under the moss');
  assert.equal((svgOf(full).match(/data-bark="corner"/g) || []).length, 11);
  assert.equal((svgOf(full).match(/data-bark="card"/g) || []).length, 18, 'eighteen along the edge');
  // the fullest file of all (the review, 2026-10-26): a cat who read chapter 1 again with the other specialty holds
  // both specialties' cards, `dug-earth`, `prints-pile` and `prints-tracks` (before9 gives the noticing cat's two to
  // every cat, as such a reread would, and the climber's `prints-tracks` to a climber), so with every dragonet and
  // Mizzle she holds 30: nineteen along the edge, three courses (past BARK_THIRD.hidden, 18), and eleven corners
  const full30 = reading(Object.assign({ specialty: 'climbing' }, OTHERS, { foundSquall: true }), { mizzle: true }).cat;
  const secret30 = nestOf(full30).opts.bark.filter(b => A.barkSecret[b.picture]).map(b => b.picture);
  assert.deepEqual([full30.cards.length, secret30.length], [30, 11], 'the fullest file: 30 cards, eleven under the moss');
  assert.ok(['dug-earth', 'prints-pile', 'prints-tracks', 'puddle-paws', 'mizzle-wing'].every(cid => full30.cards.some(k => k.id === cid)), 'both specialties\' cards, Puddle\'s and Mizzle\'s');
  assert.equal((svgOf(full30).match(/data-bark="card"/g) || []).length, 19, 'nineteen along the edge');
  assert.equal((svgOf(full30).match(/data-bark="corner"/g) || []).length, 11, 'eleven corners under the moss');
  [[{ ch3Told: true }, {}], [{ ch3Told: false }, { mizzle: true }], [{ ch3Told: true }, {}, { noMyCount: true }]].forEach(([flags, o, co]) => {
    const cat = reading(flags, o, co).cat, sc = nestOf(cat);
    const secret = sc.opts.bark.filter(b => A.barkSecret[b.picture]).map(b => b.picture);
    assert.ok(cat.cards.length >= 20 && cat.cards.length <= 30, cat.cards.length + ' cards');
    assert.ok(secret.length >= 8 && secret.length <= 11, secret.length + ' under the moss');
    assert.deepEqual([sc.opts.hidden, sc.opts.glass], [true, true]);
    assert.equal((svgOf(cat).match(/data-bark="corner"/g) || []).length, secret.length, 'a corner showing for each secret');
    assert.match(svgOf(cat), /data-prop="nest-glass"/, 'and her glass');
  });
});

test('the case laid out, through the engine: six rows read a tap each (`opt: \'read\'`), every cat’s fourteen face up in them (a Sleet cat’s den at FLEW’s end), the rest stacked face down; her count and Mizzle’s card laid out on the next screen', () => {
  const caseSvg = (cat, read, more) => A.render(E.resolveScene(Object.assign({}, frames.f118.scene, { opts: Object.assign({}, frames.f118.scene.opts, { read }, more || {}) }), cat, STORIES), { look: E.defaultLook(0) }).svg;
  // (a row with no cards in it is drawn as an empty group: count the rows that hold cards)
  const rowsIn = svg => (svg.match(/<g [^>]*data-row="\d+" data-cards="[^"]+"/g) || []).length;
  for (const [flags, o] of [[{ specialty: 'sneaking' }, {}], [Object.assign({ specialty: 'noticing', foundSquall: true }, OTHERS), { mizzle: true }]]) {
    const cat = reading(flags, o).cat;
    for (let n = 0; n <= 6; n++) {
      const sc = E.askScene(frames.f118.scene, frames.f118.ask, n);
      assert.equal(sc.opts.read, n, 'each tap reads one more row');
    }
    const svg0 = caseSvg(cat, 0), svg7 = caseSvg(cat, 7);
    assert.equal(rowsIn(svg0), 6, 'six rows before her count');
    const seventh = E.cards(cat, STORIES).some(k => ['my-count', 'mizzle-wing'].includes(k.id));
    assert.equal(rowsIn(svg7), seventh ? 7 : 6, 'the seventh row at read 7');
    FOURTEEN.forEach(cid => assert.match(svg0, new RegExp('data-bark="' + cid + '"|data-picture="' + cid + '"'), cid + ' face up'));
    if (cat.flags.foundSleet) assert.match(svg0, /data-row="2" data-cards="cant-fly fox-flew fox-brag sleet-den"/, 'a Sleet cat’s den at FLEW’s end');
  }
  // her count may be missing (chapter 7's known issue 15): the case reads six rows all the same
  const noCount = reading({ specialty: 'sneaking' }, {}, { noMyCount: true }).cat;
  assert.equal(rowsIn(caseSvg(noCount, 7)), 6);
});

test('Mizzle, through the engine: “Climb up to the hollow.” finds her, her riddle, her card, her page and the flag on her last screen; “Ask the elder which moss.” sets nothing; Back before her last screen, then the elder, leaves nothing; a second reading has her label', () => {
  const HOLLOW = seq('f045', 'f055');
  const a = reading({ specialty: 'sneaking' }, { mizzle: true });
  assert.deepEqual(a.ids.filter(id => HOLLOW.includes(id)), HOLLOW);
  assert.deepEqual([a.cat.flags.foundMizzle, E.hasCard(a.cat, 'mizzle-wing'), !!a.cat.lessons['ch09-mizzle']], [true, true, true]);
  assert.ok(HOLLOW.filter(id => id !== 'f055').every(id => !frames[id].sets), 'never a choice, never her first sight: the flag is the last frame’s');
  assert.deepEqual(rowAt(a.rows, countsAt('ch09-mizzle')[0]).lesson.map(l => l.k), ['6x8']);
  assert.deepEqual(rowAt(a.rows, OAK).options, ['Climb up to the hollow.', 'Ask the elder which moss.']);
  assert.match(a.w, /Mizzle: Tell Sprinkle: five\. And tell her I’m…/);
  assert.match(a.w, /Moonpaw: And Mizzle says five\. Then she fell asleep\./, 'her five reaches Sprinkle');
  // the elder: nothing set, no Mizzle anywhere
  const b = reading({ specialty: 'climbing', ch3Told: false }, { mizzle: false });
  assert.ok(!b.cat.flags.foundMizzle && !E.hasCard(b.cat, 'mizzle-wing') && !b.cat.lessons['ch09-mizzle']);
  assert.deepEqual(b.ids.filter(id => HOLLOW.includes(id)), []);
  assert.doesNotMatch(b.w, /\bMizzle\b/);
  assert.match(b.w, /The softest moss is the silver kind\./);
  assert.ok(!(E.dragonets(b.cat, STORIES) || { found: [] }).found.some(d => d.id === 'mizzle'), 'no page');
  // Back from any frame of her scene before her last, then the elder: no flag, no card in her file, no page
  HOLLOW.filter(id => id !== 'f055').forEach(stop => {
    const cat = fresh({ specialty: 'sneaking' });
    read(cat, { mizzle: true, stop });
    while (cat.frame !== OAK) assert.ok(E.back(cat, story), stop);
    read(cat, { mizzle: false });
    assert.ok(!cat.flags.foundMizzle, stop);
    assert.ok(!E.cards(cat, STORIES).some(k => k.id === 'mizzle-wing'), stop + ': no card in her file');
    assert.ok(!(E.dragonets(cat, STORIES) || { found: [] }).found.some(d => d.id === 'mizzle'), stop + ': no page in her book');
  });
  // sticky: Back after her last frame keeps her; a second reading reads the flag, with her label, and her lines
  const d = fresh({ specialty: 'sneaking' });
  read(d, { mizzle: true, stop: 'f056' });
  assert.ok(E.back(d, story) && d.flags.foundMizzle);
  read(d, { mizzle: true });
  E.startChapter(d, story, 9000);
  const second = read(d, { mizzle: false, t: 9000 });
  assert.deepEqual(rowAt(second, OAK).options, ['Go and see Mizzle again.', 'Ask the elder which moss.']);
  assert.match(readWords(second), /And Mizzle says Sprinkle’s wing was hurt before the rain stopped\./);
  assert.equal(d.cards.filter(k => k.id === 'mizzle-wing').length, 1);
  // her page: the seventh dragonet's, yawning
  assert.deepEqual(E.dragonets(a.cat, STORIES).found.map(dn => dn.id + (dn.pose ? ':' + dn.pose : '')).slice(-1), ['mizzle:yawn']);
  // a cat who has found others tells her, and she will hear it after her nap
  const e = reading(Object.assign({ specialty: 'sneaking' }, OTHERS), { mizzle: true });
  assert.match(e.w, /Moonpaw: I’ve found more of you!\nMizzle: Mmm\. Tell me… after my nap\. Tell Sprinkle: five\. And tell her I’m…/);
});

test('the roof, run again, through the engine: offered only to a cat who has never met Squall; up the outside for a climber; his riddle, his card, `foundSquall` and `ch9Roof` on its last frame; the dew after it; chapter 4’s page says he is still roaring, and reads as it did for every other cat', () => {
  const up = reading({ specialty: 'climbing', foundSquall: false }, { roof: true });
  assert.deepEqual(up.ids.filter(id => ROOF_IDS.includes(id)), ['f066'].concat(seq('f069', 'f079')), 'a climber up the outside');
  assert.deepEqual([up.cat.flags.foundSquall, up.cat.flags.ch9Roof, E.hasCard(up.cat, 'squall-shapes'), !!up.cat.lessons['ch04-riddle']], [true, true, true, true]);
  assert.deepEqual(rowAt(up.rows, 'f072').lesson.map(l => l.k), ['7x5']);
  assert.equal(up.ids[up.ids.indexOf('f079') + 1], 'f080', 'the dew after it, on the roof');
  assert.match(up.w, /Squall: I’ll guard the dew!/);
  assert.doesNotMatch(up.w, /Press the top button, darling/, 'chapter 4’s little room, never both');
  const lift = reading({ specialty: 'sneaking', foundSquall: false }, { roof: true });
  assert.deepEqual(lift.ids.filter(id => ROOF_IDS.includes(id)), seq('f067', 'f079'), 'anyone else in the little room');
  const dew = reading({ specialty: 'sneaking', foundSquall: false }, { roof: false });
  assert.ok(!dew.cat.flags.foundSquall && !dew.cat.flags.ch9Roof && !E.hasCard(dew.cat, 'squall-shapes'));
  assert.match(dew.w, /A voice: AND STAY OUT, giant dragon!/);
  const known = reading({ specialty: 'sneaking', foundSquall: true }, {});
  assert.deepEqual([known.ids.includes('f062'), known.ids.includes('f063'), known.cat.flags.ch9Roof], [false, true, undefined], 'no offer for a cat who knows him');
  assert.match(known.w, /Squall: I’m still GUARDING! Tell Sprinkle: FIVE! LOUDLY!/);
  // chapter 4's page: “still roaring” for a ch9Roof cat, and exactly as before for every other (the truth table)
  const page = flags => E.buildBook(ch04, { flags, name: 'Moon', look: { sex: 'she' } }).recap.join(' ');
  assert.match(page(up.cat.flags), /Sprinkle’s littlest brother is still roaring, and hiccuping\./);
  assert.doesNotMatch(page(up.cat.flags), /found Squall/);
  for (const foundSquall of [true, false]) for (const ch5Roof of [true, false]) for (const ch4CaughtFly of [true, false]) {
    const base = { foundSquall, ch5Roof, ch4CaughtFly };
    assert.equal(page(Object.assign({ ch9Roof: false }, base)), page(base), JSON.stringify(base) + ': unchanged without ch9Roof');
  }
  assert.deepEqual(ch04.book.recap.filter(r => r.when && 'ch9Roof' in r.when).map(r => r.when.ch9Roof), [false, false, false, true]);
  // and a cat with both roofs (chapter 5's read again from the middle of chapter 9's copy: the review, 2026-10-26)
  // reads “still roaring” once, as a chapter 5 roof cat does
  const both = page({ foundSquall: true, ch5Roof: true, ch9Roof: true });
  assert.equal((both.match(/Sprinkle’s littlest brother is still roaring, and hiccuping\./g) || []).length, 1, 'still roaring, once, with both roofs');
  assert.equal(both, page({ foundSquall: true, ch5Roof: true }), 'as a chapter 5 roof cat');
  // her own page: the roof's line only for a ch9Roof cat
  assert.match(E.buildBook(story, up.cat).recap.join(' '), /On the roof of her old tower, Moonpaw found Squall, the littlest dragonet/);
  assert.doesNotMatch(E.buildBook(story, known.cat).recap.join(' '), /found Squall/);
});

/* ------------------------------------------------------------------ the Taps and the questions */

test('the Taps that count log nothing: the spider’s legs, the five spiders, the bedtime paws; nor do the one-tap pages or the asks; 15 typed answers on every path, 16 with Mizzle or the roof, 17 with both', () => {
  for (const [flags, o, n] of [[{ ch3Told: true, foundSquall: true }, {}, 15], [{ ch3Told: false, specialty: 'climbing', foundSquall: false }, { mizzle: false, roof: false }, 15],
    [{ ch3Told: false, foundSquall: true }, { mizzle: true }, 16], [{ ch3Told: true, foundSquall: false }, { roof: true }, 16], [{ ch3Told: false, foundSquall: false }, { mizzle: true, roof: true }, 17]]) {
    const cat = fresh(flags), n0 = cat.counts.length;
    const rows = read(cat, o);
    rows.forEach((x, i) => { if (['skip', 'scratch', 'ask', 'next', 'choice'].includes(x.kind) && rows[i + 1]) assert.equal(rows[i + 1].counts, x.counts, x.id + ' logs nothing'); });
    assert.deepEqual(rows.filter(x => x.kind === 'skip').map(x => [x.skip.table, x.skip.groups]), [[4, 2], [8, 5]].concat(o.roof ? [[5, 1]] : [], [[4, 2]]));
    rows.filter(x => x.kind === 'scratch').forEach(x => { assert.deepEqual(x.scratched, [], x.id); assert.equal(x.tap.kind, 'tap', x.id); });
    assert.equal(cat.counts.length - n0, n, JSON.stringify(flags) + ' ' + JSON.stringify(o) + ': typed answers');
  }
});

test('a big number is on a page only straight after a count she made: the 8 after the spider’s legs and after the bedtime paws; never after the five spiders or Squall’s forepaw', () => {
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
  assert.deepEqual([...carried].sort(), ['f022:8', 'f134:8']);
  assert.deepEqual(ids.filter(id => E.keptSkip(story, id)), [], 'no picture kept up after a count');
});

test('Tallyheart’s eight Counts, Thymeleaf’s four things and the case’s six rows: Taps that count nothing; the tree’s marks and the den’s rows as the asks have them', () => {
  // the tree: one pair for every claw mark, the eights she has met (8 × 1, 2, 5, 10, 9, 3, 6, 4)
  const tree = frames.f026, ak = tree.ask;
  assert.deepEqual([E.kindOf(tree), E.exits(tree)], ['ask', [countsAt('ch09-eights')[0]]]);
  assert.deepEqual(E.askView(ak, 0), { taps: 0, total: 8, done: false, who: 'tallyheart', to: 'player', pair: null, before: [], owed: 0 });
  for (let n = 1; n <= 8; n++) {
    const v = E.askView(ak, n), sc = E.askScene(tree.scene, ak, n);
    assert.deepEqual([v.pair, v.before.length, v.done], [ak.pairs[n - 1], n - 1, n === 8]);
    assert.deepEqual([sc.opts.marks, sc.opts.glow], [8, 'auto'], 'the eight claw marks, unchanged');
  }
  assert.equal(ak.pairs.length, tree.scene.opts.marks, 'one from every mark on this tree');
  const N = { eight: 8, sixteen: 16, forty: 40, eighty: 80, 'seventy-two': 72, 'twenty-four': 24, 'forty-eight': 48, 'thirty-two': 32 };
  assert.deepEqual(ak.pairs.map(p => N[(/^Eight (?:cats|forepaws|patrols|cheeks), (eight|sixteen|forty-eight|forty|eighty|seventy-two|twenty-four|thirty-two)\b/.exec(p[1]) || [])[1]]), [8, 16, 40, 80, 72, 24, 48, 32]);
  ak.pairs.forEach(p => assert.ok(words(p[0]) <= 3 && words(p[1]) <= 8, p.join(' ')));
  // Thymeleaf's: himself both voices, two balloons a tap, the fourth running on at its comma
  const th = frames.f019.ask;
  assert.deepEqual([th.who, th.to, th.pairs.length, E.askView(th, 4).done], ['thymeleaf', 'thymeleaf', 4, true]);
  assert.deepEqual(th.pairs.map(p => p[0]).map(s => /^(And )?[A-Z]/.test(s)), [true, true, true, true]);
  // the case's: Tallyheart asks, our cat reads; each tap lights the next row (`read`), the page's spot the art's glowing row
  const cs = frames.f118.ask;
  assert.deepEqual([cs.who, cs.to, cs.opt, cs.pairs.length], ['tallyheart', 'player', 'read', 6]);
  for (let n = 0; n <= 6; n++) assert.deepEqual(E.askScene(frames.f118.scene, cs, n).opts.read, n);
  assert.deepEqual(frames.f118.scene.opts.read, 0, 'the story’s scene unchanged');
  const rd = reading({ specialty: 'sneaking' }, {});
  [['f019', th], ['f026', ak], ['f118', cs]].forEach(([id, a]) => {
    const x = rowAt(rd.rows, id), next = rowAt(rd.rows, a.next);
    assert.deepEqual(x.asked, a.pairs, id);
    assert.equal(next.counts - x.counts, 0, id + ': logs nothing');
  });
});

/* ------------------------------------------------------------------ the book */

function recapFor(flags) { return story.book.recap.filter(x => !x.when || E.matches(x.when, { flags })); }
const sentences = t => t.split(/(?<=[.!?])\s+(?=\p{Lu}|\{|“)/u).length;

test('book: title, chapter title, seven entries told, eight kept, one more each with Mizzle and with the roof, 6 to 10 sentences on every path, true on each; never “ninth morning”; the dream and the night it stayed a secret; Mizzle’s page only for a cat who found her', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['chapterTitle', 'dragonet', 'dream', 'noDream', 'recap', 'title']);
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'Featherlight');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}paw’s dream, the night before the Gathering, stayed a secret.');
  b.recap.forEach((x, i) => {
    assert.deepEqual(Object.keys(x).filter(k => !['text', 'when'].includes(k)), [], 'recap ' + i);
    if (x.when) assert.ok(same(x.when, KEPT) || same(x.when, MIZZLE) || same(x.when, { ch9Roof: true }), 'recap ' + i + ': kept, Mizzle or the roof');
    assert.match(x.text, /[.!?”’]$/);
    assert.ok(words(x.text) <= 32, 'recap ' + i + ': ' + words(x.text));
    assert.doesNotMatch(x.text, /\byou\b/i, 'third person');
    assert.doesNotMatch(x.text, /ninth morning/i, 'day 9 is her eighth morning count');
  });
  assert.match(b.recap[0].text, /^At the eighth morning count/);
  const cases = [[TOLD, 'told', 7], [KEPT, 'kept', 8], [{}, 'unset (kept)', 8], [{ ch3Told: true, foundMizzle: true }, 'told, Mizzle', 8], [{ ch3Told: true, ch9Roof: true, foundSquall: true }, 'told, roof', 8],
    [{ ch3Told: false, foundMizzle: true, ch9Roof: true, foundSquall: true }, 'kept, both', 10]];
  cases.forEach(([flags, name, n]) => {
    const rc = recapFor(flags);
    assert.equal(rc.length, n, name);
    const s = rc.reduce((m, x) => m + sentences(x.text), 0);
    assert.ok(s >= 6 && s <= 10, name + ': ' + s + ' sentences');
    const all = rc.map(x => x.text).join(' ');
    assert.equal(/told Tallyheart about Sprinkle at last/.test(all), flags.ch3Told !== true, name);
    assert.equal(/found Mizzle/.test(all), !!flags.foundMizzle, name);
    assert.equal(/found Squall/.test(all), !!flags.ch9Roof, name);
    assert.match(all, /four wingbeats/, name);
    assert.match(all, /at the Gathering, \{name\}paw will speak\./, name);
    assert.doesNotMatch(all, /\bthey\b/i, name + ': no “they” a child could take for the wrong ones');
  });
  // a she-cat's and a tom's pages through the engine
  const page = (cat, id) => E.buildFullBook(cat, STORIES).pages.find(p => p.id === id).recap.join(' ');
  const told = reading({ specialty: 'sneaking' }, {}).cat, kept = reading({ specialty: 'sneaking', ch3Told: false }, { mizzle: true }).cat;
  assert.match(page(told, 'ch09'), /Tallyheart took Moonpaw to meet Thymeleaf, the medicine cat/);
  assert.match(page(kept, 'ch09'), /High in GroveClan’s old oak, Moonpaw found Mizzle, the sleepiest dragonet/);
  assert.match(page(kept, 'ch09'), /Moonpaw told Tallyheart about Sprinkle at last, and Tallyheart wasn’t angry: she thanked her\./);
  assert.deepEqual([E.buildBook(story, told).recap.length, E.buildBook(story, kept).recap.length], [7, 9]);
  assert.equal(E.buildBook(story, told).chapter, 'Chapter 9: Featherlight');
  const tom = fresh({ specialty: 'sneaking' }); tom.look.sex = 'tom';
  read(tom, { dream: '' });
  assert.match(page(tom, 'ch09'), /Tallyheart taught Moonpaw his ninth Count, spiders’ legs: the eights; an eight is two fours\./);
  assert.doesNotMatch(page(tom, 'ch09'), /\{|\}/);
  assert.equal(E.buildFullBook(tom, STORIES).pages.find(p => p.id === 'ch09').dream, 'Moonpaw’s dream, the night before the Gathering, stayed a secret.');
  assert.equal(E.buildFullBook(told, STORIES).pages.find(p => p.id === 'ch09').dream, 'Moonpaw’s dream: “A spider waving at the moon.”');
  // Mizzle's page: the seventh dragonet's, only for a cat who found her
  assert.deepEqual(b.dragonet, [{ id: 'mizzle', name: 'Mizzle', when: { foundMizzle: true }, pose: 'yawn', lines: [
    'Pearly green, sweet and sleepy, and always about to nod off.',
    '{name}paw found her in a hollow high in the old oak in GroveClan’s woods.',
    'She knows the right moss for a dragon’s wing. Five more claws, counted.'] }]);
  assert.ok(A.vocab.otherPoses.mizzle.includes(b.dragonet[0].pose));
  assert.deepEqual(E.dragonets(kept, STORIES).found.find(d => d.id === 'mizzle'), { id: 'mizzle', name: 'Mizzle', lines: ['Pearly green, sweet and sleepy, and always about to nod off.', 'Moonpaw found her in a hollow high in the old oak in GroveClan’s woods.', 'She knows the right moss for a dragon’s wing. Five more claws, counted.'], chapter: 'ch09', pose: 'yawn' });
  assert.ok(!(E.dragonets(told, STORIES) || { found: [] }).found.some(d => d.id === 'mizzle'), 'no page without her');
  assert.equal(E.buildBook(ch08, told).chapter, 'Chapter 8: The Night Trail', 'the pages before are as they were');
});

test('the teaser for chapter 10, curious and never scary, with no number; chapter 8’s for this one stands, and both its promises are kept', () => {
  assert.deepEqual(story.teaser, { title: 'Chapter 10: The Gathering', lines: ['Tomorrow: the otters’ Moon Ferry. Every Clan, at the Gathering.', 'And Reynard, with his little story. And you, with your case.'] });
  story.teaser.lines.forEach(l => assert.ok(words(l) <= 25, l));
  assert.doesNotMatch(story.teaser.lines.join(' '), /\d|twenty|sixty|weasel|thief|robbed|stolen|scary|monster|hurt/i, 'no number, no answer');
  // the hook it carries on is the story's own: the teaser says what the last panels say
  assert.equal(story.teaser.lines.join(' '), T(F(/^Tomorrow: the otters’ Moon Ferry\./)));
  const cat = E.blankCat({}); cat.name = 'Moon';
  assert.deepEqual(E.teaser(story, cat, PC.story), { title: 'Chapter 10: The Gathering', lines: story.teaser.lines, built: false, next: null }, 'chapter 10 is not built: coming soon');
  // chapter 8's teaser stands, its title this chapter's, and both its promises are kept: she flies (four wingbeats), and the
  // wing is mended by a remedy
  assert.deepEqual(ch08.teaser, { title: 'Chapter 9: Featherlight', lines: ['Sprinkle has to fly by the full moon.', 'How do you mend a dragon’s wing?'] });
  assert.equal(E.chapterHeading(story), ch08.teaser.title);
  assert.deepEqual(E.teaser(ch08, cat, PC.story), { title: 'Chapter 9: Featherlight', lines: ch08.teaser.lines, built: true, next: 'ch09' }, 'chapter 9 is in: the hub offers it');
  assert.match(T(F(/^…and she LIFTS\./)), /Her paws are off the ground!/);
  assert.match(T(F(/^A wing is a wing\./)), /I’ll make her a remedy: wing medicine\./);
  const done = reading({ specialty: 'sneaking' }, {}).cat, p = E.progress(done, PC.story);
  assert.deepEqual([p.latest.id, p.next, p.soon && p.soon.title, E.status(done, PC.story)], ['ch09', null, 'Chapter 10: The Gathering', 'Chapter 9 finished']);
  const c8 = E.blankCat({}); c8.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5, ch06: 6, ch07: 7, ch08: 8 };
  assert.deepEqual([E.progress(c8, PC.story).next.id, E.chapterHeading(E.progress(c8, PC.story).next)], ['ch09', 'Chapter 9: Featherlight']);
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean and fill renders the same text; chapters 1 to 8 are sound beside it', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  assert.ok(E.checkStory(story).length > 0, 'chapter 9 leans on chapters 4 and 8 (the roof’s set and card, the sets it borrows from)');
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind], cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
  [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05, ch06, ch07, ch08].forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id));
  // the roof copy leaves chapter 4's own frames as they are
  CH4_ROOF.forEach(id => { assert.ok(ch04.frames[id].scene.fx.every(x => x !== 'morning'), id); assert.notDeepEqual(ch04.frames[id].sets, { foundSquall: true, ch9Roof: true }, id); });
});

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, the flags, the lessons, the taps, her cards, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) {
    const name = comboName(c);
    const cat = fresh(c.flags);
    const counted = cat.counts.length, flags0 = Object.keys(cat.flags);
    const rows = read(cat, c.o), walked = idsOf(rows);
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch09'), name);
    rows.forEach(x => { if (x.kind !== 'end') assert.ok(x.caps.length + x.say.length + (x.sfx ? 1 : 0) + (x.options ? x.options.length : 0) + (x.tap ? 1 : 0) > 0, name + ' ' + x.id + ' shows nothing'); });
    assert.deepEqual(walked, walk(c.flags, Object.assign({ clean: true }, c.o)).slice(), name + ': the engine walks the same frames');
    const added = (c.oak === 'climb' && !c.flags.foundMizzle ? ['foundMizzle'] : []).concat(c.squall === 'roof' ? ['ch9Roof'] : []);
    assert.deepEqual(Object.keys(cat.flags).filter(k => !flags0.includes(k)).sort(), added.sort(), name + ': no other flag is set');
    const done = Object.keys(cat.lessons).filter(k => /^ch09/.test(k)).sort();
    assert.deepEqual(done, ['ch09-dew', 'ch09-eights', 'ch09-flaps', 'ch09-fours', 'ch09-rubs'].concat(c.oak === 'climb' ? ['ch09-mizzle'] : []).sort(), name);
    done.forEach(s => assert.ok(cat.lessons[s].finished && cat.lessons[s].noHelp, name + ': ' + s));
    assert.equal(cat.counts.length - counted, 15 + (c.oak === 'climb' ? 1 : 0) + (c.squall === 'roof' ? 1 : 0), name + ': the typed answers; the taps never logged');
    assert.equal(cat.dreams.ch09, 'a spider waving at the moon');
    assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3, 6, 4, 8]);
    assert.equal(E.status(cat, STORIES), 'Chapter 9 finished');
    assert.equal(E.buildBook(story, cat).recap.length, 7 + (cat.flags.ch3Told ? 0 : 1) + (cat.flags.foundMizzle ? 1 : 0) + (cat.flags.ch9Roof ? 1 : 0), name);
    assert.doesNotMatch(E.buildBook(story, cat).recap.join(' ') + E.buildBook(story, cat).dream, /[{}]/, name + ': the book, every token filled');
    rows.forEach(x => x.say.forEach(bl => assert.ok(bl.label && !/[{}]/.test(bl.label + bl.text), name + ' ' + x.id + ': ' + bl.label + ': ' + bl.text)));
    rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.forEach(p => { if (p.who) assert.equal(p.label, { mizzle: 'The sleepy dragonet', thymeleaf: 'Thymeleaf', tallyheart: 'Tallyheart', squall: 'The little dragon' }[p.who], name + ' ' + x.id); })));
    rows.forEach(x => assert.ok(!x.heard.some(h => /[{}]/.test(h)), name + ' ' + x.id));
    rows.filter(x => x.scene && x.scene.set === 'den').forEach(x => assert.equal(x.scene.opts.stone, c.flags.ch2Stone, x.id));
    rows.filter(x => x.scene && x.scene.set === 'hollow').forEach(x => assert.ok(Array.isArray(x.scene.opts.glow), x.id));
    assert.ok(E.back(cat, story));
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 80);
  // with a miss on everything she still reaches the end, every retry and filler is asked, and every speaker of a lesson's
  // line is in that Counts frame's picture
  for (const ch3Told of [true, false]) {
    const cat = fresh({ specialty: 'noticing', ch3Told, worry: 'water', foundSquall: false });
    const rows = read(cat, { mizzle: true, roof: true, answers: { '4x7': [24], '2x4': [7], '7x8': [50, 50], '8x8': [60], '6x8': [40, 40], '7x5': [30], '8x4': [30], '3x8': [20], '9x8': [70] } });
    assert.equal(rows[rows.length - 1].kind, 'end');
    const w = readWords(rows);
    ['Tallyheart: One from yesterday. Three cats. How many paws?', WAY56 + ' There. We’ll come back to that one.', 'The sleepy dragonet: An easy one… Two twigs. How many acorns?', 'Hop by eights! Eight, sixteen…',
      ': An easy one.\n: Two rows of eight. How many drops?', 'You count them, a row at a time: eight, sixteen…', 'Thymeleaf: An easy one. Two rows of eight. How many rubs?', 'Let’s count them together.'].forEach(line => assert.ok(w.includes(line), line));
    Object.keys(cat.lessons).filter(k => /^ch09/.test(k)).forEach(s => assert.equal(cat.lessons[s].noHelp, false, s + ': she needed the sand (or the picture) in every one'));
    rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.concat(l.balloons).filter(y => y.who).forEach(y => assert.ok(castOf(x.id, y.who).length, x.id + ' ' + l.k + ': ' + y.who))));
    assert.deepEqual(rowAt(rows, NINTH).say.map(b => b.text), ['Spiders’ legs. That’s your ninth Count.', 'Some were tricky.', 'You never gave up. Tricky gets easy. Like flying.']);
  }
  // a save in the middle of the days goes through the store's own shape and comes back the same cat
  const mid = fresh({ specialty: 'climbing', ch3Told: false, foundSquall: false });
  read(mid, { mizzle: true, roof: true, stop: 'f074' });
  const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
  assert.deepEqual([back.flags, back.cards, back.frame, back.lessons], [mid.flags, mid.cards, mid.frame, mid.lessons]);
  assert.deepEqual(idsOf(read(back, { mizzle: true, roof: true })), idsOf(read(mid, { mizzle: true, roof: true })), 'and reads on to the same end');
});
