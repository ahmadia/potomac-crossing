/* Story tests for chapter 8: node --test
 *
 * Checks app/story/ch08.js against the frame contract in docs/build.md, against the story
 * (docs/chapters/08-the-night-trail.md, Draft v0.4, final) and against its spec
 * (docs/chapters/08-the-night-trail.spec.md, v0.2, the build's contract): the frame graph (frames shown
 * only `when` they match, the told and kept twins with the friend in the picture, the `foundHail` twins at
 * the chase, the choices only one path sees and their `else`, the two routes that meet at the weasel
 * holes, the specialty chain past the dogs), one interaction per frame, the choices (none sets a flag)
 * and the one sticky flag, `foundHail`, on Hail's last screen only; the Counts frames and sets exactly as
 * the spec has them, with every test its build notes list (the warm-up's hard pick and fillers, the
 * lesson's misses, twins, quick lines and the check, the twenty-eight's help and fillers, Hail's fillers,
 * Snip's share on both paths, 15 typed answers or 16 with Hail, the Hollow's “Paws · the 4s” and the
 * eighth mark only after the lesson); the skip-counts (her paws by pairs, kept; the rim’s paws; the bedtime
 * paws), Tallyheart's seven Counts and the pages she taps once, each with its target in the art; her four
 * cards on their frames, the rows they make (the brag's two lines for a Sleet cat), all four under the moss;
 * every `when`; the speakers (the weasels, Hail and the dogs labelled until named); tokens, storyboards,
 * word counts, captions and boxes, the art vocabulary camera by camera, the staging, the time of day, the
 * generated storyboard, every frame rendered with everyone in the picture, the beats in order on every
 * path, the book (6 to 10 sentences on every path, nothing about the route), Hail's page, the teaser for
 * chapter 9, and whole play-throughs through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch08.test.js   prints the whole chapter, rendered three ways.
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
const story = PC.story.ch08;
const frames = story.frames;
const ids = Object.keys(frames);
const ch04 = PC.story.ch04, ch05 = PC.story.ch05, ch06 = PC.story.ch06, ch07 = PC.story.ch07;
const STORIES = [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05, ch06, ch07, story];

/* ------------------------------------------------------------------ the contract */

// The flags a `when` may test: chapters 1 to 7's, and chapter 8's own one (set by reaching Hail's last
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
const FLAGS8 = { foundHail: [true, false] };
const FLAGS = Object.assign({}, FLAGS1, FLAGS2, FLAGS3, FLAGS4, FLAGS5, FLAGS6, FLAGS7, FLAGS8, { lessonClean: ['ch08-fours'] });
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'sfxAt', 'sfxRead', 'gift', 'when', 'else', 'sets', 'card'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things', 'also']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 30, WORDS_MAX = 50;
// Time of day comes from fx: night in the den as she wakes (told), then morning (the pile, the Hollow),
// day under the Old Bridge (kept), dusk at the pile, night from round the back of the pile to her nest
const TOD = ['morning', 'day', 'sunset', 'dusk', 'night'];
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat', 'sloshbank', 'reedclan'];
const RIM_ANCHORS = ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'];
const CARD_IDS = ['hail-shapes', 'fox-brag', 'stash', 'glass'];
const SETS = ['ch08-pile', 'ch08-sixes', 'ch08-fours', 'ch08-gone', 'ch08-hail', 'ch08-snip', 'ch08-riffle'];
// the Counts frames whose own lines are not said again over the first question (`intro: false`)
const NO_INTRO = ['ch08-pile', 'ch08-sixes', 'ch08-fours'];
const TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
const HAIL = { foundHail: true }, NO_HAIL = { foundHail: false };
const SMALL = { worry: 'small' }, NOT_SMALL = { not: { worry: 'small' } };
const NOTICING = { specialty: 'noticing' }, SNEAKING = { specialty: 'sneaking' };
const FETCH_TOLD = { specialty: ['noticing', 'swimming'], ch3Told: true }, FETCH_KEPT = { specialty: ['noticing', 'swimming'], ch3Told: false };
// the way past the dogs, each panel a told and a kept twin (the friend beside her all the way: brief, call 11)
const SNEAK_TOLD = { specialty: 'sneaking', ch3Told: true }, SNEAK_KEPT = { specialty: 'sneaking', ch3Told: false };
const CLIMB_TOLD = { specialty: 'climbing', ch3Told: true }, CLIMB_KEPT = { specialty: 'climbing', ch3Told: false };
const FRIENDS_TOLD = { specialty: 'friends', ch3Told: true }, FRIENDS_KEPT = { specialty: 'friends', ch3Told: false };
const FOUND_ONE = { not: { foundSquall: false, foundPuddle: false, foundSleet: false, foundWisp: false } };
const FOUND_ALL = { foundSquall: true, foundPuddle: true, foundSleet: true, foundWisp: true };
// the spots of their own: Tallyheart beside her nest as she wakes; our cat nose to nose with her behind the pile
const WAKE = { x: 1250, y: 896, h: 250 }, NOSE = { x: 860, y: 960, h: 380 };
// Riffle waving at the hedge's edge (clear of `rear-2`, where Tallyheart waits on the next panel); the talk at home close at
// the tunnel's mouth (`hole`): Tallyheart across it from our cat, and our cat leaning into her side
const HEDGE = { x: 1430, y: 962, h: 380 }, TALK = { x: 1220, y: 958, h: 470 }, LEAN = { x: 1060, y: 960, h: 470 };
// our cat on the Barking Field's `dogs` path, clear of its puddle (the final review: at `trail-1` she lay and sat in it):
// flat in the grass at the path's edge ahead of the friend (the sneak), sitting up to talk to Hail at the wire
const FLAT = { x: 470, y: 975, h: 285 }, BY_WIRE = { x: 520, y: 968, h: 286 };
// the cameras each set's frames use, and the friend's spots
const TRACKS_CAMS = ['wide', 'hide', 'holes', 'brag', 'stash', 'stash-close', 'crawl', 'fork'];

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
/* The frames that say this, in reading order; F: the one frame that does; F2: the twins that do (a panel
 * drawn once for the told path and once for the kept path, or once without Hail and once with her). */
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
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'A tunnel full of weasels.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'Four, eight, twelve, sixteen.' },
  // a player whose own Clan name is Murmur: the warrior is Mutterchime
  murmur: { name: 'Murmur', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Hail bouncing.' }
};
const FACT = { a: 4, b: 7, answer: 28, groups: 7, per: 4, thing: 'paw', things: 'paws', also: '' };
function fill(text, p) { return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : k in FACT ? FACT[k] : m)); }

/* Anything that reads badly once the tokens are filled (the chapter 1 rules). */
function badGrammar(text, isSfx) {
  const bad = [];
  if (/[{}]/.test(text)) bad.push('unfilled token');
  if (/(?<!\bif )\b(she|he) (are|were|have|do|don’t|aren’t|weren’t|haven’t)\b/i.test(text)) bad.push('pronoun/verb agreement');
  if (/\b(she|he)’re\b/i.test(text)) bad.push('she’re/he’re');
  if (/\bhisself\b|\btheirselves\b/i.test(text)) bad.push('bad reflexive');
  if (/\ban (tom|she-cat)\b/i.test(text)) bad.push('“an” before tom/she-cat');
  if (!isSfx && /\b(\w+)\s+\1\b/i.test(text.replace(/\b(Snore|Squee|BOING|bump|Scrape|skritch|sniff)\.? /gi, ''))) bad.push('doubled word');
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

/* Every line in the chapter: frames (every variant), options (and their labelWhen), the instructions
 * under the pages she taps, Tallyheart's seven Counts and our cat's answers, her cards and their link
 * lines, the Counts lines, the book, Hail's page, the teaser. */
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
    if (f.ask) {
      fn(id, { where: 'ask prompt', text: E.askWords(f.ask).prompt });
      f.ask.pairs.forEach((p, i) => { fn(id, { where: 'question ' + i, text: p[0], who: f.ask.who }); fn(id, { where: 'answer ' + i, text: p[1], who: f.ask.to }); });
    }
  });
  Object.keys(story.cards).forEach(cid => {
    const c = story.cards[cid];
    fn('card ' + cid, { where: 'line', text: c.line });
    if (c.link) {
      fn('card ' + cid, { where: 'link line', text: c.link.line });
      Object.keys(c.link.lines || {}).forEach(k => fn('card ' + cid, { where: 'link line for ' + k, text: c.link.lines[k] }));
    }
  });
  countsLines().forEach(x => fn('counts ' + x.set, x));
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  ['title', 'chapterTitle', 'dream', 'noDream'].forEach(k => { if (story.book[k]) fn('book', { where: k, text: story.book[k] }); });
  story.book.dragonet.forEach(d => d.lines.forEach((l, i) => fn('book', { where: d.id + '’s page ' + i, text: l })));
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* The choices: the route (written once at the mouth); the hollow log (written once, from the path; its
 * first option read her way by a cat who has found Hail); sniff left or right in the tunnel (the told
 * path's and the kept path's, each with its two outcome panels); glare or tongue at the fox (each path's
 * own, one outcome panel); and at home the kept path's “I’m sorry.” (two outcome panels). */
const choiceAt = re => ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => re.test(o.label)));
const ROUTE = choiceAt(/^“Through the tunnel\.”$/)[0];
const LOG = choiceAt(/^“Who’s in the log\?”$/)[0];
const FORK = choiceAt(/^Sniff the left way\.$/);
const FOX = choiceAt(/^Glare at him\.$/);
const SORRY = choiceAt(/^“I’m sorry\.”$/)[0];
const LIGHTS = FORK.concat(FOX, [SORRY]);
/* The option a reader takes at a choice: `route` (0 the tunnel, 1 the Barking Field), `log` (0 Hail's
 * scene, 1 “Not tonight.”) and `light` (0 or 1) at every light one. */
function pick(id, o) {
  o = o || {};
  if (id === ROUTE) return o.route || 0;
  if (id === LOG) return o.log || 0;
  return o.light || 0;
}
/* A cat as the walks below take her: these flags, and the fours learned with no help unless `clean: false`. */
function catFor(flags, o) {
  return { flags: Object.assign({}, flags), look: { sex: 'she' }, lessons: (o || {}).clean === false ? {} : { 'ch08-fours': { finished: true, noHelp: true } } };
}
/* The frames a reader with these flags walks through, in order (the engine's own E.landing passes
 * over a frame whose `when` doesn't match, or turns it to its `else`); a frame's `sets` are flags from
 * then on. The flags as they ended are on the result (`.flags`). */
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
      boxes: E.captions(f, cat).length + E.balloons(f, cat).length };
    if (f.choice) { row.options = E.options(f, cat).map(x => E.optionLabel(x.option, cat)); Object.assign(cat.flags, f.choice.options[pick(id, o)].sets || {}); }
    if (f.scratch) row.tap = E.tapWords(f).prompt;
    if (f.sets) Object.assign(cat.flags, f.sets);
    return row;
  });
}
/* Every combination of told or kept, the specialty, the worry, the route (the tunnel; the Barking Field
 * with Hail's scene or “Not tonight.”), Hail found in an earlier reading or not, every other dragonet found
 * before or none, and her stone by her nose or under her chin: 960, each walked with both light choices. */
const COMBOS = [];
for (const ch3Told of FLAGS3.ch3Told) for (const specialty of FLAGS1.specialty) for (const worry of FLAGS1.worry)
  for (const way of ['tunnel', 'hail', 'past']) for (const before of [false, true]) for (const found of [false, true]) for (const ch2Stone of ['nose', 'chin']) {
    const flags = { ch3Told, specialty, worry, ch2Stone, ch2Path: 'bridge', ch7Flew: true };
    if (found) Object.assign(flags, FOUND_ALL);
    if (before) flags.foundHail = true;
    COMBOS.push({ flags, way, before, found, o: { route: way === 'tunnel' ? 0 : 1, log: way === 'past' ? 1 : 0 } });
  }
const comboName = c => JSON.stringify(c.flags) + ' ' + c.way;
// a spread of the combinations for the heavier checks
const SOME = COMBOS.filter((c, i) => i % 11 === 0);
// each dragonet found alone, for the lines that read one of them
const ONE_FOUND = ['foundSquall', 'foundPuddle', 'foundSleet', 'foundWisp'];

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
    } else if (kind === 'input') assert.ok(E.submitInput(cat, st, o.dream == null ? 'a tunnel full of weasels' : o.dream, t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, st, f.counts.set, t, STORIES);
      E.beginLesson(cat, st, id, r.state);
      row.lesson = lessonRows(cat, st, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, st, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* A cat at chapter 8's first page: chapters 1 to 7 finished, her flags (FLEW seen in chapter 7, as every cat
 * who read it has), the Counts she learned (chapter 4's tens to chapter 7's sixes, played through the engine,
 * with these answers and times in chapter 7's lessons: what today's warm-up finds hard), and her Case File as
 * chapters 4 to 7 left it (a found dragonet's card with it; `my-count` missing for `o.noMyCount`, chapter 7's
 * known issue 15). */
const CH5_CARDS = ['prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh'];
const CH6_CARDS = ['reed-pile', 'coil-diggers'];
const CH7_CARDS = ['waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel'];
function before8(flags, o) {
  o = o || {};
  const cat = E.blankCat({ now: 1, id: 'c8' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5, ch06: 6, ch07: 7 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch2SaidAloud: true, ch3Told: true, caseFileOpen: true, ch5First: 'otters', ch7Flew: true }, flags || {});
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  const ms = { all: 1500 };
  play(cat, 'ch04-tens', null, ms);
  play(cat, 'ch05-nines', null, ms);
  play(cat, 'ch06-threes', null, ms);
  play(cat, 'ch07-pile', null, ms);
  play(cat, 'ch07-threes', null, ms);
  play(cat, 'ch07-sixes', o.sixes, o.sixesMs || ms);
  play(cat, 'ch07-gone', o.gone, ms);
  play(cat, cat.flags.ch3Told === false ? 'ch07-riffle' : 'ch07-dragon', null, ms);
  const f = cat.flags, give = (list, ch, at0) => list.forEach((cid, i) => E.giveCard(cat, cid, ch, at0 + i));
  give(Object.keys(ch04.cards).filter(cid => !ch04.cards[cid].when || E.matches(ch04.cards[cid].when, cat)), 'ch04', 10);
  give(CH5_CARDS.concat(f.foundPuddle ? ['puddle-paws'] : [], f.foundWisp ? ['wisp-fox'] : [], f.specialty === 'climbing' ? ['prints-tracks'] : []), 'ch05', 30);
  give(CH6_CARDS.concat(f.foundSleet ? ['sleet-den'] : []), 'ch06', 50);
  give(CH7_CARDS.filter(cid => !(o.noMyCount && cid === 'my-count')), 'ch07', 70);
  // a cat who found Hail in an earlier reading holds her card from it
  if (f.foundHail) give(['hail-shapes'], 'ch08', 90);
  return cat;
}
function fresh(flags, o) {
  const cat = before8(flags, o);
  E.startChapter(cat, story, 500);
  return cat;
}
/* Read chapter 8: `o` is a route (`route`, `log`, `light`: as `pick`), with `stop`, `answers`, `ms`, `dream`
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
  assert.equal(story.id, 'ch08');
  assert.equal(story.number, 8);
  assert.equal(story.title, 'The Night Trail');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.ok(ids.length >= 140 && ids.length <= 180, 'a full chapter of panels with its two routes and Hail’s scene (' + ids.length + ')');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'cards', 'counts', 'frames', 'id', 'names', 'number', 'start', 'teaser', 'title']);
  assert.deepEqual(story.names, { snip: 'A weasel', snatch: 'A weasel', hail: 'The speckled dragonet' }, 'the three she meets tonight, until each is told apart or named');
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch08'), order.indexOf('ch07') + 1, 'chapter 8 follows chapter 7');
  assert.ok(Object.values(frames).every(f => !/^STUB\b/.test(f.board || '')), 'no stub frame is left');
  assert.equal(COMBOS.length, 960);
  // the page loads it after chapter 7, and the offline copy has it
  const scripts = require('./_load.js').scripts().filter(s => /story\/ch\d+\.js$/.test(s));
  assert.ok(scripts.indexOf('app/story/ch07.js') >= 0 && scripts.indexOf('app/story/ch07.js') < scripts.indexOf('app/story/ch08.js'));
  assert.match(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), /'\.\/app\/story\/ch08\.js'/);
  assert.match(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), /'\.\/app\/art\/sets\/tracks\.js'/);
});

test('frame ids run f001, f002… in reading order (the tunnel, then the Barking Field and Hail’s scene, then the weasel holes); every edge goes forward; the numbers have no gaps; the letters say which outcome of a light choice', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}[ab]?$/, id));
  assert.deepEqual(ids, ids.slice().sort(), 'frames are listed in id order');
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  const nums = [...new Set(ids.map(num))].sort((a, b) => a - b);
  nums.forEach((n, i) => assert.equal(n, i + 1, 'frame number ' + (i + 1) + ' is missing'));
  const into = {};
  ids.forEach(id => exits(frames[id]).forEach(n => (into[n] = into[n] || []).push(id)));
  const lettered = ids.filter(id => /[a-z]$/.test(id));
  lettered.forEach(id => assert.ok((into[id] || []).length && into[id].every(p => frames[p].choice), id + ' is reached from a choice (' + (into[id] || []).join(' ') + ')'));
  const next = id => String(num(id) + 1).padStart(3, '0');
  // sniff left or right: the told path's choice and the kept path's, each with its own two outcomes at its
  // next number (left `a`, right `b`), the told outcomes leading to the kept choice (passed over by a told
  // reader), the kept outcomes onward: each choice on the storyboard's walk, none reached only by `else`
  assert.equal(FORK.length, 2);
  assert.equal(num(FORK[1]), num(FORK[0]) + 2);
  FORK.forEach(id => assert.deepEqual(frames[id].choice.options.map(o => o.next), ['f' + next(id) + 'a', 'f' + next(id) + 'b'], id));
  ['a', 'b'].forEach(x => {
    assert.equal(frames['f' + next(FORK[0]) + x].next, FORK[1], 'the told outcome ' + x + ' turns to the kept choice, passed over');
    assert.equal(frames['f' + next(FORK[1]) + x].next, frames[FORK[1]].else, 'the kept outcome ' + x + ' goes on to where the kept choice’s else does');
  });
  // the kept path's “I’m sorry.”: its two outcomes at its next number, both on to the next screen
  assert.deepEqual(frames[SORRY].choice.options.map(o => o.next), ['f' + next(SORRY) + 'a', 'f' + next(SORRY) + 'b']);
  assert.equal(frames['f' + next(SORRY) + 'a'].next, frames['f' + next(SORRY) + 'b'].next, 'a light choice rejoins at once');
  // the fox: each path's choice, one outcome panel at the next number, both options to it; the told one
  // leads on to the kept choice (passed over), the kept one onward
  assert.equal(FOX.length, 2);
  FOX.forEach(id => assert.deepEqual(frames[id].choice.options.map(o => o.next), ['f' + next(id), 'f' + next(id)], id));
  assert.equal(frames['f' + next(FOX[0])].next, FOX[1]);
  assert.equal(frames['f' + next(FOX[1])].next, frames[FOX[1]].else);
  // the route: the tunnel straight on; the Barking Field after the tunnel's last panel; both meet at the
  // weasel holes, whose first panel is the next after the field's (Hail's scene its last)
  const [tun, fld] = frames[ROUTE].choice.options.map(o => o.next);
  assert.equal(tun, 'f' + next(ROUTE), 'the tunnel is read on from the mouth');
  const holes = F(/^A high bank rises in the moonlight\./);
  ids.filter(id => at(id) >= at(tun) && at(id) < at(fld)).forEach(id => ways(frames[id]).forEach(n => assert.ok(at(n) < at(fld) || n === holes, id + ': the tunnel never leads into the field (' + n + ')')));
  ids.filter(id => at(id) >= at(fld) && at(id) < at(holes)).forEach(id => ways(frames[id]).forEach(n => assert.ok(at(n) <= at(holes), id + ': the field leads on only to the weasel holes')));
  // the hollow log: Hail's scene after the way past the dogs, both to the weasel holes
  const [hail, past] = frames[LOG].choice.options.map(o => o.next);
  assert.equal(past, 'f' + next(LOG), '“Not tonight.” is read on from the log');
  assert.ok(at(hail) > at(past) && at(hail) < at(holes), 'Hail’s scene after the way past the dogs, before the holes');
  // every lettered frame is accounted for
  assert.deepEqual(lettered.sort(), [].concat(...FORK.map(id => frames[id].choice.options.map(o => o.next)), frames[SORRY].choice.options.map(o => o.next)).sort());
});

// The frames shown only `when` they match, in reading order, with their `when` (and `else`, a choice only one
// path sees): each path's own screens, the told and kept twins of a panel with the friend in it, the way past
// the dogs by specialty, Hail's news for a cat who has found another dragonet, the stash's mouth by worry, and
// the chase's dogs with Hail or without.
const WHEN_FRAMES = [
  [/^A paw pokes you awake\./, TOLD], [/^Tallyheart’s eyes are shining\./, TOLD], [/^Did you pounce\?/, TOLD],
  [/^By the prey pile, the last guards are yawning\./, KEPT],
  [/^Twenty-eight\. Tonight, we follow them all the way\./, TOLD],
  [/^Twenty-eight\. And not one guard saw a thing\./, KEPT], [/^You know why: they come from UNDER!/, KEPT],
  [/^At the Old Bridge, you check the bank first\./, KEPT], [/^A TUNNEL\? Under your PILE\?$/, KEPT], [/^Quietly\. …pile\.$/, KEPT], [/^Granny says the bank by the tracks/, KEPT],
  [/^Behind the back row, Tallyheart is waiting/, TOLD], [/^Behind the back row, a wet nose pokes through the hedge\./, KEPT],
  [/^Two ways to the tracks\. Through their tunnel/, TOLD], [/^Two ways to the tracks\. Through the tunnel/, KEPT], [/^He pokes his head in\./, KEPT],
  [/^Tallyheart pokes her head in/, TOLD], [/^You first\. You found it!$/, KEPT],
  [/^In the soft earth: tiny prints, coming and going\. Is Tallyheart still up there\?$/, TOLD], [/^From above, very faint:/, TOLD],
  [/^In the soft earth: tiny prints, coming and going\. Riffle comes in after you\./, KEPT], [/^Otters are bendy\. Mostly\./, KEPT], [/^Are we nearly there\?/, KEPT],
  [/^The tunnel splits in two\. Which way\? Far above:/, TOLD, 'else'], [/^The tunnel splits in two\. Which way\?$/, KEPT, 'else'],
  [/^At last: moonlight!.*Three hundred and twelve pawsteps\./, TOLD], [/^At last: moonlight!.*Riffle pops out behind you/, KEPT],
  [/^Then we go together\./, TOLD], [/^Round the near side\. Not one paw past the post\.$/, KEPT],
  [/^The Barking Field is silver.*Tallyheart pads beside you/, TOLD], [/^The Barking Field is silver.*Riffle pads beside you/, KEPT],
  [/^One ear twitches\./, TOLD], [/^One ear twitches\./, KEPT],
  [/^The third one just barks\./, TOLD], [/^The third one just barks\./, KEPT],
  [/^You drop flat in the grass\./, SNEAK_TOLD], [/^You drop flat in the grass\./, SNEAK_KEPT], [/^Up onto the fence top you go/, CLIMB_TOLD], [/^Up onto the fence top you go/, CLIMB_KEPT],
  [/^Hello, dogs!$/, FRIENDS_TOLD], [/^The dogs stop\./, FRIENDS_TOLD], [/^While all three wag, you trot past\.$/, FRIENDS_TOLD],
  [/^Hello, dogs!$/, FRIENDS_KEPT], [/^The dogs stop\./, FRIENDS_KEPT], [/^While all three wag, you trot past\.$/, FRIENDS_KEPT],
  [/^Tallyheart flicks a pinecone/, FETCH_TOLD], [/^Three dogs race after it\./, FETCH_TOLD], [/^Drop it! I AM Drop It!$/, FETCH_TOLD],
  [/^Riffle flicks a pebble/, FETCH_KEPT], [/^Three dogs race after it\./, FETCH_KEPT], [/^Drop it! I AM Drop It!$/, FETCH_KEPT],
  [/^Out bounces a little dragonet.*Another one!/, TOLD], [/^Out bounces a little dragonet.*ANOTHER dragon!/, KEPT],
  [/^And I’ve found more of you!/, FOUND_ONE],
  [/^Tell Sprinkle: five!/, TOLD], [/^Tell Sprinkle: five!/, KEPT],
  [/^Not fox country\. Nobody’s land\./, TOLD], [/^Not fox country\. Granny says/, KEPT],
  [/Voices! Squeaky ones, coming closer\.$/, TOLD], [/Voices! Squeaky ones, coming closer\.$/, KEPT],
  [/^Out of two holes pop two skinny shapes.*Weasels\.$/, TOLD], [/^Out of two holes pop two skinny shapes.*“WEASELS,” Riffle mouths, without a sound\.$/, KEPT],
  [/^These two can’t count\. But YOU can\.$/, TOLD], [/^These two can’t count\. But YOU can\.$/, KEPT],
  [/^And fourteen for Snatch\..*The Counts don’t lie\.$/, TOLD], [/^And fourteen for Snatch\..*The Counts don’t lie\.$/, KEPT],
  [/^Then a smell you know\. FOX\./, TOLD], [/^Then a smell you know\. FOX\./, KEPT],
  [/^Uh-oh\. The tip of Tallyheart’s tail/, TOLD], [/^Uh-oh\. Riffle’s tail/, KEPT],
  [/^He fluffs his tail\./, TOLD, 'else'], [/^He doesn’t see\. Good\.$/, TOLD], [/^He fluffs his tail\./, KEPT, 'else'], [/^He doesn’t see\. Good\.$/, KEPT],
  [/^Now’s your chance\..*Too small for me\./, TOLD], [/^Now’s your chance\..*Riffle keeps watch\.$/, KEPT],
  [/A tight squeeze\. In you go!$/, SMALL], [/^Your paws go silent\. Not one weasel stirs\.$/, NOT_SMALL],
  [/^GET THAT CAT!.*Weasels can wait\.$/, TOLD], [/^GET THAT CAT!.*RUN!$/, KEPT],
  [/^Down the bank you run/, TOLD], [/^Down the bank you run/, KEPT],
  [/^Inside the fence, three dogs leap up\./, NO_HAIL], [/^DOGS! SQUIRRELS! THAT way!$/, HAIL],
  [/^Snip and Snatch skid to a stop\./, NO_HAIL], [/^Three dogs and one speckled dragonet bounce/, HAIL],
  [/^Nobody’s hurt\.$/, NO_HAIL], [/^Nobody’s hurt\.$/, HAIL],
  [/^Through the hedge, behind the pile, you’re safe\.$/, TOLD], [/^Tallyheart looks at it for a long time\. So THAT’S our dragon’s scale\.$/, TOLD], [/^Weasels\. A fox who wants a den\./, TOLD],
  [/^At the hedge, Riffle waves goodbye\./, KEPT], [/^Behind the pile, a big ginger shape/, KEPT], [/^Twenty-six pawsteps from the hedge\./, KEPT, 'else'],
  [/^You tell her everything:/, KEPT], [/^Tallyheart looks at it for a long time\. So THAT’S our dragon’s scale\. A fox’s trick\.$/, KEPT], [/^This goes to the Gathering\. Every Clan should hear it\.$/, KEPT]
];
// the twins: [first, second], the first leading to the second, side by side: the told panel and its kept twin
// (the friend swapped, Tallyheart for Riffle), or the panel without Hail and its twin with her
const TWINS = [
  [/^Behind the back row, Tallyheart is waiting/, /^Behind the back row, a wet nose/],
  [/^Two ways to the tracks\. Through their tunnel/, /^Two ways to the tracks\. Through the tunnel/],
  [/^Tallyheart pokes her head in/, /^You first\. You found it!$/],
  [/^At last: moonlight!.*Three hundred/, /^At last: moonlight!.*Riffle pops out/],
  [/^Then we go together\./, /^Round the near side\. Not one paw past the post\.$/],
  [/^The Barking Field is silver/], [/^One ear twitches\./], [/^The third one just barks\./],
  [/^Out bounces a little dragonet/], [/^Tell Sprinkle: five!/],
  [/^Not fox country\. Nobody’s land/, /^Not fox country\. Granny says/], [/Voices! Squeaky ones, coming closer\.$/],
  [/^Out of two holes pop/], [/^These two can’t count\./], [/^And fourteen for Snatch\./], [/^Then a smell you know\. FOX\./],
  [/^Uh-oh\. The tip of Tallyheart’s tail/, /^Uh-oh\. Riffle’s tail/],
  [/^Now’s your chance\..*Too small for me\./, /^Now’s your chance\..*Riffle keeps watch\.$/],
  [/^GET THAT CAT!.*Weasels can wait\.$/, /^GET THAT CAT!.*RUN!$/], [/^Down the bank you run/]
].map(([t, k]) => (k ? [F(t), F(k)] : F2(t)));
const HAIL_TWINS = [[/^Inside the fence, three dogs leap up\./, /^DOGS! SQUIRRELS! THAT way!$/], [/^Snip and Snatch skid to a stop\./, /^Three dogs and one speckled dragonet bounce/], [/^Nobody’s hurt\.$/]]
  .map(([t, k]) => (k ? [F(t), F(k)] : F2(t)));
// the twins whose friend stands somewhere else (Tallyheart's nose at the mouth's rim at `poke`; at the tunnel's
// end our cat wriggling out on the told path, Riffle on the kept)
const TWIN_SPOTS = [TWINS[2][0], TWINS[3][0]];
const HAIL_SCENE = ids.filter(id => at(id) >= at(frames[LOG].choice.options[0].next) && at(id) < at(F(/^A high bank rises in the moonlight\./)));

test('exactly one interaction per frame (the taps and the questions included), no unknown keys, and a frame `when`, `else` or `sets` only where the story and the spec have one', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    assert.equal(f.look, undefined, id + ': chapter 8 has no look frame');
    assert.equal(f.gift, undefined, id + ': chapter 8 gives no gift');
    assert.equal(f.file, undefined, id + ': her Case File was opened in chapter 4');
    // every sound is lettered where the page puts it, but the BOING of Hail's first appearance, lettered high over
    // the trees, off her (the final review: the page put it across her body)
    if (/^Out bounces a little dragonet/.test(T(id))) assert.deepEqual(f.sfxAt, [55, 32], id + ': the BOING off her');
    else assert.equal(f.sfxAt, undefined, id + ': every sound is lettered where the page puts it');
  });
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
      assert.ok(frames[frames[id].else] && !same(frames[frames[id].else].when, frames[id].when), id + ': its else is not this path’s');
    } else {
      assert.equal(frames[id].else, undefined, id);
      assert.equal(exits(frames[id]).length, 1, id + ': one way on');
    }
  });
  assert.deepEqual(ids.filter(id => frames[id].else).map(id => [id, frames[id].else]), [
    [FORK[0], FORK[1]], [FORK[1], F(/^On and on you go\./)], [FOX[0], FOX[1]], [FOX[1], F(/^Nap now, my little sneaks\./)], [SORRY, F(/^She touches her nose to yours\./)]]);
  // the twins stand one after the other, the first leading to the second
  TWINS.forEach(([t, k]) => {
    assert.deepEqual([frames[t].when, frames[k].when], [TOLD, KEPT], t + ' ' + k);
    assert.equal(num(k) - num(t), 1, t + ' and ' + k + ': side by side');
    assert.equal(exits(frames[t])[0], k, t + ' → its kept twin');
  });
  HAIL_TWINS.forEach(([t, k]) => {
    assert.deepEqual([frames[t].when, frames[k].when], [NO_HAIL, HAIL], t + ' ' + k);
    assert.equal(num(k) - num(t), 1, t + ' and ' + k + ': side by side');
    assert.equal(exits(frames[t])[0], k, t + ' → its twin with Hail');
  });
  // the one flag set by reaching a frame, for good: `foundHail`, on Hail's last screen, both twins
  const last = TWINS.find(([t]) => /^Tell Sprinkle: five!/.test(T(t)));
  assert.deepEqual(ids.filter(id => frames[id].sets), last);
  last.forEach(id => assert.deepEqual(frames[id].sets, { foundHail: true }, id));
  assert.equal(HAIL_SCENE[HAIL_SCENE.length - 1], last[1], 'her last screen ends her scene');
  // no choice sets anything (the spec: one new flag, no choice flag; the route is not recorded)
  ids.filter(id => frames[id].choice).forEach(id => frames[id].choice.options.forEach(o => assert.deepEqual(o.sets, {}, id)));
});

test('a child who listens hears every sentence finished: the nest’s skritch and the sniff behind her run on from their captions, and the sneeze, alone on its panel, is said in words; no other page is heard differently', () => {
  const NEST = F(/^In your nest:/), SNIFF = F(/^Behind you:/), ACHOO = ids.find(id => frames[id].sfx === 'ACHOO!');
  assert.deepEqual(ids.filter(id => frames[id].sfxRead !== undefined), [ACHOO, SNIFF, NEST]);
  assert.deepEqual([frames[NEST].sfxRead, frames[SNIFF].sfxRead, frames[ACHOO].sfxRead], ['skritch, skritch.', 'sniff, sniff.', 'a great big sneeze: ACHOO!']);
  const some = [{ flags: { ch2Stone: 'nose' } }, { flags: { ch2Stone: 'chin', ch3Told: false, specialty: 'noticing', worry: 'small', foundHail: true } }, { flags: { ch3Told: true, worry: 'shiny', specialty: 'sneaking' } }];
  ids.forEach(id => {
    const f = frames[id];
    const runsOn = (f.caption || []).map(capText).filter(t => !E.endsSentence(t));
    if (f.sfx && runsOn.length) assert.equal(f.sfxRead, f.sfx, id + ': “' + runsOn[0] + '” runs on into ' + f.sfx);
    if (f.sfxRead === undefined) some.forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), id + ': heard as it is lettered'));
  });
  assert.deepEqual(E.captionsRead(frames[NEST], some[0]), ['In your nest:', 'skritch, skritch.', 'New curls of bark. And under the moss, in its leaf, your glass.', 'Riffle’s stone is by your nose.']);
  assert.deepEqual(E.captionsRead(frames[SNIFF], some[0]), ['Behind you:', 'sniff, sniff.', 'Snatch pokes his head out of a hole, mouse and all.']);
  // the sneeze: “Ah… ah…” on its own panel first (a frame's sfxRead is said before its balloons), then the
  // sneeze alone, with no caption and no balloon, said in words
  assert.equal(frames[ACHOO].say, undefined);
  assert.equal(frames[ACHOO].caption, undefined);
  assert.deepEqual(E.captionsRead(frames[ACHOO], some[0]), ['a great big sneeze: ACHOO!']);
  const before = ids[at(ACHOO) - 1];
  assert.deepEqual([E.kindOf(frames[before]), frames[before].next, frames[before].say.map(b => b.text)], ['next', ACHOO, ['Ah… ah…']]);
  [NEST, SNIFF, ACHOO].forEach(id => assert.deepEqual(badGrammar(frames[id].sfxRead, true), [], id));
  assert.deepEqual(E.checkStory(story, STORIES), []);
});

test('every next / option / else / input / counts / skip / scratch / ask target exists, and every frame is reachable, by its exits and by some reader', () => {
  ids.forEach(id => ways(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const byExit = new Set([story.start]), line = [story.start];
  while (line.length) exits(frames[line.pop()]).forEach(n => { if (!byExit.has(n)) { byExit.add(n); line.push(n); } });
  assert.deepEqual(ids.filter(id => !byExit.has(id)), [], 'every frame is reached by exits alone (the storyboard walks them; nothing is reached only by `else`)');
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

test('every combination reaches the end with no frame that shows nothing; the friend is the path’s own (Tallyheart on the told trail, Riffle on the kept); a twin is its other twin with the friend swapped, or Hail added', () => {
  const from = at(F(/^The sun goes down, and the first guards/)), to = at(F(/^Through the hedge, behind the pile, you’re safe\.$/));
  const trail = id => at(id) >= from && at(id) < to;
  for (const c of COMBOS) for (const light of [0, 1]) {
    const name = comboName(c) + ' light ' + light, rows = walkLines(c.flags, Object.assign({ light }, c.o));
    assert.equal(rows[rows.length - 1].kind, 'end', name);
    rows.forEach(r => {
      if (r.kind !== 'end') assert.ok(r.lines.length > 0 || (r.options || []).length || r.tap, r.id + ' shows nothing to ' + name);
      if (r.options) assert.equal(r.options.length, 2, r.id + ': two options');
      // on the trail, the friend is the path's own; Tallyheart walks no kept trail, Riffle no told one
      if (trail(r.id)) {
        const f = frames[r.id], has = w => castOf(r.id, w).length > 0 || (f.say || []).some(b => b.who === w);
        assert.ok(!has(c.flags.ch3Told ? 'riffle' : 'tallyheart'), r.id + ': the other path’s friend, for ' + name);
      }
    });
  }
  // the told twin is its kept twin with Tallyheart in it for Riffle (at the same spot but for two named
  // panels), and nothing else of the picture changes; the twin with Hail is the other with Hail in it
  TWINS.forEach(([t, k]) => {
    const a = frames[t], b = frames[k];
    assert.deepEqual([a.scene.set, a.scene.cam, a.scene.fx, a.scene.opts], [b.scene.set, b.scene.cam, b.scene.fx, b.scene.opts], t + ' and ' + k + ': one picture');
    assert.deepEqual([castOf(t, 'tallyheart').length, castOf(t, 'riffle').length, castOf(k, 'tallyheart').length, castOf(k, 'riffle').length], [1, 0, 0, 1], t + ' and ' + k + ': the friend');
    const rest = (id, w) => frames[id].scene.cast.filter(m => m.who !== w).map(m => [m.who, TWIN_SPOTS.includes(t) && m.who === 'player' ? '' : m.at]);
    assert.deepEqual(rest(t, 'tallyheart'), rest(k, 'riffle'), t + ' and ' + k + ': the same cast but for the friend');
    if (!TWIN_SPOTS.includes(t)) assert.deepEqual(castOf(t, 'tallyheart')[0].at, castOf(k, 'riffle')[0].at, t + ' and ' + k + ': the friend at the same spot');
  });
  HAIL_TWINS.forEach(([t, k]) => {
    const a = frames[t], b = frames[k];
    assert.deepEqual([a.scene.set, a.scene.cam, a.scene.opts], [b.scene.set, b.scene.cam, b.scene.opts], t + ' and ' + k);
    assert.deepEqual([castOf(t, 'hail').length, castOf(k, 'hail').map(m => m.at)], [0, ['wire']], t + ' and ' + k + ': Hail at the wire, with her');
    assert.ok(b.scene.cast.filter(m => m.who !== 'hail').every(m => a.scene.cast.some(n => n.who === m.who && n.at === m.at)), t + ' and ' + k + ': the rest of the picture');
  });
});

test('choices: three or four a reading, labels short, none sets a flag; the route and the hollow log written once; the fork, the fox and “I’m sorry.” each path’s own with `else`; a cat who has found Hail reads the log her way', () => {
  const choiceIds = ids.filter(id => frames[id].choice);
  assert.deepEqual(choiceIds, [ROUTE, FORK[0], FORK[1], LOG, FOX[0], FOX[1], SORRY]);
  const L = id => frames[id].choice.options.map(o => o.label);
  const O = (id, i) => T(frames[id].choice.options[i].next);
  choiceIds.forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length === 2, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), id === LOG && i === 0 ? ['label', 'labelWhen', 'next', 'sets'] : ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 12, id + ' option ' + i + ' label');
      assert.equal(o.when, undefined, id + ': both options are for everyone who sees the choice');
    });
    assert.equal(frames[id].choice.prompt, undefined, id);
  });
  // written once: the route at the mouth, the log from the path (no friend in either picture)
  [ROUTE, LOG].forEach(id => { assert.equal(frames[id].when, undefined, id); assert.ok(!castOf(id, 'tallyheart').length && !castOf(id, 'riffle').length, id); });
  assert.deepEqual(L(ROUTE), ['“Through the tunnel.”', '“Around the Barking Field.”']);
  assert.ok(O(ROUTE, 0).startsWith('Tallyheart pokes her head in, just to see.') && O(ROUTE, 1).startsWith('Then we go together. Round the near side.'), 'the tunnel, or round the field');
  assert.deepEqual(L(LOG), ['“Who’s in the log?”', '“Not tonight. Keep going.”']);
  assert.deepEqual(frames[LOG].choice.options[0].labelWhen, [{ when: HAIL, label: '“Go and see Hail again.”' }]);
  [[{}, '“Who’s in the log?”'], [{ foundHail: false }, '“Who’s in the log?”'], [{ foundHail: true }, '“Go and see Hail again.”']].forEach(([flags, want]) => assert.equal(E.optionLabel(frames[LOG].choice.options[0], { flags }), want, JSON.stringify(flags)));
  assert.equal(O(LOG, 1), 'The white head ducks back in.');
  assert.match(O(LOG, 0), /^Out bounces a little dragonet/);
  FORK.forEach(id => {
    assert.deepEqual(L(id), ['Sniff the left way.', 'Sniff the right way.'], id);
    assert.deepEqual([O(id, 0), O(id, 1)], ['Worms. Just worms. The other way, then!', 'Mice! LOTS of mice. This way!'], id);
  });
  FOX.forEach(id => { assert.deepEqual(L(id), ['Glare at him.', 'Stick out your tongue.'], id); assert.equal(O(id, 0), 'He doesn’t see. Good.', id); });
  assert.deepEqual(L(SORRY), ['“I’m sorry.”', '“But I found the THIEVES!”']);
  assert.deepEqual([O(SORRY, 0), O(SORRY, 1)], ['Her tail curls round you.', 'You WHAT?']);
  // a spoken option is never echoed as a balloon on its outcome
  choiceIds.forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    if (said) (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
  // three on the told path (the route, the fork or the log, the fox), four on the kept (and “I’m sorry.”)
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), t = c.flags.ch3Told;
    const want = [ROUTE, c.way === 'tunnel' ? FORK[t ? 0 : 1] : LOG, FOX[t ? 0 : 1]].concat(t ? [] : [SORRY]);
    assert.deepEqual(p.filter(id => frames[id].choice), want, comboName(c));
  }
  // how much she reads before she chooses (the route's own panel is the mouth itself, with a worried cat's line)
  for (const c of SOME) walkLines(c.flags, c.o).filter(r => r.options).forEach(r => {
    const n = r.lines.reduce((m, s) => m + words(s), 0) + r.options.reduce((m, s) => m + words(s), 0);
    assert.ok(n >= 6 && n <= 42, r.id + ': ' + n + ' words before she chooses, for ' + comboName(c));
  });
});

test('inputs, counts, skips, taps and Tallyheart’s seven Counts, in the story’s order, each as the spec has it', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  assert.equal(T(inputs[0]), 'What did {name}paw dream, after the night trail?');
  const ph = frames[inputs[0]].input.placeholder;
  assert.ok(typeof ph === 'string' && ph.length <= 30 && /tunnel|weasels|glass/.test(ph), ph);
  // seven Counts frames: five on every path (the pile, the warm-up, the lesson, the twenty-eight, Snip's
  // share by path) and Hail's riddle
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => frames[id].counts.set), SETS);
  counts.forEach(id => {
    const set = frames[id].counts.set;
    assert.deepEqual(Object.keys(frames[id].counts).sort(), NO_INTRO.includes(set) ? ['intro', 'next', 'set'] : ['next', 'set'], id);
    if (NO_INTRO.includes(set)) assert.equal(frames[id].counts.intro, false, id);
    assert.ok(E.countsSet(set, story, STORIES), id + ': the counts set exists');
  });
  assert.deepEqual(counts.slice(5).map(id => frames[id].when), [TOLD, KEPT], 'Snip’s share: the told path’s and the kept path’s');
  assert.ok(HAIL_SCENE.includes(countsAt('ch08-hail')[0]), 'Hail’s riddle is in her scene');
  // three skip-counts: her paws by pairs (kept), the rim’s paws, the bedtime paws (section 2, as the spec has them)
  const skips = ids.filter(id => frames[id].skip);
  assert.equal(skips.length, 3);
  const [pair, rimPaws, bed] = skips.map(id => frames[id].skip);
  const RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  assert.deepEqual(pair, { table: 2, groups: 2, who: [{ who: 'tallyheart' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next pair of paws.', prompt: '**Tap** her paws.', keep: true, next: pair.next });
  assert.deepEqual(rimPaws, { table: 4, groups: 5, who: RIM, thing: 'paw', things: 'paws', teacher: 'tallyheart', label: 'Count the next cat’s paws.', prompt: '**Tap** the cats as they go by.', carry: false, next: rimPaws.next });
  assert.deepEqual(bed, { table: 4, groups: 2, who: [{ who: 'snorer' }, { who: 'player' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next cat’s paws.', prompt: '**Tap** the paws.', next: bed.next });
  assert.deepEqual([1, 2].map(n => E.skipView(pair, n).count), ['2…', '2… 4!']);
  assert.deepEqual(E.skipView(rimPaws, 5).count, '4… 8… 12… 16… 20!');
  assert.deepEqual(E.skipView(bed, 2).count, '4… 8!');
  assert.deepEqual(E.skipPicture(pair, 1), { table: 2, groups: 2, per: 2, highlight: 2, totals: true, next: true, who: [{ who: 'tallyheart' }], thing: 'paw', things: 'paws' });
  assert.deepEqual(E.skipPicture(rimPaws, 2), { table: 4, groups: 5, per: 4, highlight: 8, totals: true, next: true, who: RIM, thing: 'paw', things: 'paws' });
  assert.deepEqual(E.skipPicture(bed, 2).highlight, 8);
  // what each page after a count shows: her paws stay up under a big 4 (`keep`), and the rim’s paws after it
  // end the kept run; the rim’s paws turn to the ask, which carries nothing; the bedtime paws leave a big 8
  assert.equal(E.skipReached(E.skipInto(story, pair.next)), 4);
  assert.deepEqual(E.keptSkip(story, pair.next), { id: skips[0], skip: pair }, 'her paws stay up while she hears “A four is two twos.”');
  assert.match(T(pair.next), /^Two front paws\. Two back paws\. A four is two twos\./);
  assert.equal(E.keptSkip(story, rimPaws.next), null);
  assert.equal(E.skipInto(story, rimPaws.next), null);
  assert.ok(frames[rimPaws.next].ask, 'the rim’s paws turn to her seven Counts');
  assert.equal(E.skipReached(E.skipInto(story, bed.next)), 8);
  assert.match(T(bed.next), /^EIGHT\?/);
  assert.equal(frames[pair.next].next, skips[1], 'the rim’s paws straight after, which ends the kept run');
  // the pages she taps once (the spec's one-tap table), the twins by path each with the same Tap
  const taps = ids.filter(id => frames[id].scratch);
  const tapOf = id => Object.assign({}, frames[id].scratch, { next: undefined });
  const ONE = {
    walk: { tap: 'back', prompt: '**Tap** to walk round the back.', label: 'Walk round the back.' },
    ears: { tap: 'ears', prompt: '**Tap** to whisper in Riffle’s ear.', label: 'Whisper in Riffle’s ear.' },
    slip: { tap: 'back', prompt: '**Tap** to slip round the back.', label: 'Slip round the back.' },
    mouth: { tap: 'mouth', prompt: '**Tap** to wriggle in.', label: 'Wriggle in.' },
    roof: { tap: 'paw', prompt: '**Tap** the roof, softly.', label: 'Tap the roof.' },
    pull: { tap: 'paw', prompt: '**Tap** to pull Riffle through.', label: 'Pull Riffle through.' },
    path: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.' },
    weeds: { tap: 'weeds', prompt: '**Tap** to hide in the tall weeds.', label: 'Hide in the weeds.' },
    tail: { tap: 'tail', prompt: '**Tap** the tail to pull it down.', label: 'Pull the tail down.' },
    squeeze: { tap: 'stash', prompt: '**Tap** to wriggle in.', label: 'Wriggle in.' },
    peek: { tap: 'stash', prompt: '**Tap** to peek inside.', label: 'Peek inside.' },
    glass: { tap: 'glass', prompt: '**Tap** to take one small piece.', label: 'Take one small piece.' },
    run: { tap: 'paw', prompt: '**Tap** to RUN!', label: 'Run!' },
    wave: { tap: 'paw', prompt: '**Tap** to wave goodbye.', label: 'Wave goodbye.' },
    down: { tap: 'leaf', prompt: '**Tap** to put down the glass.', label: 'Put down the glass.' },
    show: { tap: 'leaf', prompt: '**Tap** to show her the glass.', label: 'Show her the glass.' }
  };
  const TAPS = ['walk', 'ears', 'slip', 'mouth', 'mouth', 'roof', 'pull', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'weeds', 'weeds', 'tail', 'tail', 'squeeze', 'peek', 'glass', 'run', 'run', 'wave', 'wave', 'down', 'show'];
  assert.deepEqual(taps.map(id => tapOf(id)), TAPS.map(k => Object.assign({}, ONE[k], { next: undefined })));
  taps.forEach(id => assert.deepEqual(E.tapWords(frames[id]), { kind: 'tap', prompt: frames[id].scratch.prompt, label: frames[id].scratch.label }, id + ': no miss line: the glow wobbles'));
  // (the story's response to each is shown by the next panel, the spec's table)
  const after = (id, flags) => E.landing({ flags: Object.assign({}, frames[id].when, flags) }, story, frames[id].scratch.next);
  const T_ = (k, i) => taps.filter((id, j) => TAPS[j] === k)[i || 0];
  assert.equal(camOf(after(T_('walk'))), 'pile/gap', 'round the back row, out of the shadow');
  assert.deepEqual([camOf(after(T_('ears'))), castOf(after(T_('ears')), 'riffle').map(c => [c.pose, c.mood, c.holds])], ['bridge/wall', [['stand', 'shout', undefined]]], 'A TUNNEL? on the wall, the fish dropped');
  assert.deepEqual([camOf(after(T_('slip'), TOLD)), frames[after(T_('slip'), TOLD)].scene.fx], ['pile/rear', ['night']], 'behind the back row, night');
  [0, 1].forEach(i => assert.equal(camOf(after(T_('mouth', i))), 'tracks/crawl', 'inside the tunnel'));
  assert.match(T(after(T_('roof'))), /^From above, very faint:/, 'the count from above');
  assert.deepEqual([frames[after(T_('pull'))].sfx, frames[after(T_('pull'))].scene.opts.tight], ['POP!', undefined], 'POP! and through');
  taps.filter((id, j) => TAPS[j] === 'path').forEach(id => assert.match(T(after(id, { specialty: 'none' })), /^A high bank rises in the moonlight\./, id + ': the bank by the tracks'));
  [0, 1].forEach(i => assert.equal(camOf(after(T_('weeds', i))), 'tracks/hide', 'in the weeds'));
  [0, 1].forEach(i => { const n = after(T_('tail', i)); assert.ok(frames[n].scene.cast.every(c => !c.tailUp), 'the tail down'); assert.deepEqual(castOf(n, 'reynard').map(c => c.at), ['rails'], 'Reynard on the tracks'); });
  ['squeeze', 'peek'].forEach(k => assert.equal(camOf(after(T_(k))), 'tracks/stash', k + ': inside the stash'));
  assert.deepEqual(castOf(after(T_('glass')), 'player').map(c => [c.holds, c.holdAt]), [['leaf', 'paws']], 'her nose tickles, the leaf in her paws');
  [0, 1].forEach(i => assert.equal(camOf(after(T_('run', i))), 'field/wide', 'the chase on the field'));
  [0, 1].forEach(i => assert.deepEqual([camOf(after(T_('wave', i))), frames[after(T_('wave', i), TOLD)].scene.opts.tunnel], ['pile/rear', true], 'home behind the pile'));
  assert.deepEqual(castOf(after(T_('down')), 'player').map(c => c.holds), ['glass'], 'the leaf open, the piece shining');
  assert.deepEqual(castOf(after(T_('show')), 'player').map(c => c.holds), ['glass'], 'the leaf open, the piece shining');
  // Tallyheart's seven Counts: a Tap that counts nothing; the fours our cat already knows, hers to say
  const asks = ids.filter(id => frames[id].ask);
  assert.equal(asks.length, 1);
  assert.deepEqual(frames[asks[0]].ask, { who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
    pairs: [['Tails?', 'Four cats, four tails!'], ['Ears?', 'Four cats, eight ears!'], ['Claws?', 'Four forepaws, twenty claws!'], ['Both forepaws?', 'Four cats, forty claws!'],
      ['Nine lives?', 'Four cats, thirty-six lives!'], ['Patrols?', 'Four patrols, twelve guards!'], ['Whiskers?', 'Four cheeks, twenty-four whiskers. That’s MY count!']], next: counts[2] });
  // the order of the things she does, on the page
  const order = [counts[0], taps[0], counts[1], skips[0], skips[1], asks[0], counts[2], counts[3], taps[1], taps[2], ROUTE, taps[3], FORK[0], LOG, taps[7], counts[4], taps[16], taps[17], counts[5], taps[19], FOX[0], taps[21], taps[23], taps[24], taps[26], taps[28], SORRY, taps[29], skips[2], inputs[0]];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
  // what each reader does: the Taps that count or ask, and the Counts moments (Hail's riddle a sixth)
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o), name = comboName(c);
    assert.equal(p.filter(id => frames[id].counts).length, c.way === 'hail' ? 6 : 5, name + ': Counts moments');
    assert.equal(p.filter(id => frames[id].skip || frames[id].ask).length, 4, name + ': the skip-counts and the ask');
    // the walk and the slip round the back, the weeds, the tail, the stash's mouth, the glass, the run, the
    // wave, the leaf; through the tunnel the wriggle in and the roof (or Riffle stuck), round the field the
    // slip past; and on the kept path Riffle's ear at the Old Bridge
    assert.equal(p.filter(id => frames[id].scratch).length, 9 + (c.way === 'tunnel' ? 2 : 1) + (c.flags.ch3Told ? 0 : 1), name + ': one-tap pages');
    assert.deepEqual([E.kindOf(frames[p[0]]), E.kindOf(frames[p[1]])], ['next', 'next'], name);
  }
});

/* ------------------------------------------------------------------ speakers, tokens, words */

// the frames the tests name: found by what they say
const PILE_COUNT = countsAt('ch08-pile')[0];
const TREE = F(/^Tallyheart stretches up the leaning tree\./);
const EIGHTH = F(/^Paws\. That’s your eighth Count\./);
const SQUEAKY = F(/^Snip is the squeaky one\./);
const IM_HAIL = F(/^I’m Hail!/);
const NAMES = F(/^I’m GOOD BOY!/);
const HOLES = F(/^A high bank rises in the moonlight\./);
const NEST = F(/^In your nest:/);
const HOME = F(/^Through the hedge, behind the pile, you’re safe\.$/);
const DUSK = F(/^The sun goes down, and the first guards/);
const WARM = F(/^She touches her nose to yours\./);

test('every balloon speaker is in that frame’s cast; a speaker’s lines on a panel are one balloon; where two of a kind are in the picture (the dogs) the nth balloon is the nth of them; balloons and captions are well formed', () => {
  const NAMED = { coil: ['Coil'], hail: ['A white head', 'Hail'], snip: ['Snip'], snatch: ['Snatch'], dog: ['Good Boy', 'Drop It', 'The dogs'] };
  ids.forEach(id => {
    const f = frames[id];
    const by = {};
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(NAMED[b.who] && NAMED[b.who].includes(b.name), id + ' say ' + i + ': ' + b.who + ' named ' + b.name);
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      assert.ok(castOf(id, b.who).length, id + ': ' + b.who + ' speaks and is not in the picture');
      by[b.who] = (by[b.who] || 0) + 1;
    });
    // two of a kind in the picture: only the dogs, and their nth balloon is the nth dog of the cast
    Object.keys(by).forEach(who => { if (castOf(id, who).length > 1 && by[who] > 1) assert.equal(who, 'dog', id + ': ' + by[who] + ' balloons from ' + who); });
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
  // no balloon is chained to its own speaker's, for any reader
  for (const c of SOME) {
    const cat = catFor(c.flags);
    ids.forEach(id => {
      const b = E.balloons(frames[id], cat), n = w => castOf(id, w).length;
      // (two dogs in a row are two dogs: the nth balloon is the nth dog in the picture)
      // (but Tallyheart's two speeches at home, two paragraphs in the story, each with its tag: the spec's "her two
      // balloons", the second chained to the first, so the pause between them is kept)
      for (let i = 1; i < b.length; i++) assert.ok(b[i].who !== b[i - 1].who || (n(b[i].who) > b[i].nth && b[i].nth !== b[i - 1].nth) || (id === SORRY && b[i].who === 'tallyheart'), id + ' ' + comboName(c) + ': two balloons of ' + b[i].who + ' in a row');
    });
  }
  // the dogs: a named balloon is said by that dog (Good Boy is variant 1, Drop It variant 2; “The dogs” in Good
  // Boy's voice), and an unnamed one by the dog its place says
  const cat = E.blankCat({}); cat.name = 'Fern';
  ids.forEach(id => saidOn(story, id, cat).filter(b => b.who === 'dog').forEach(b => {
    if (b.label === 'Good Boy' || b.label === 'The dogs') assert.equal(b.variant, 1, id + ': ' + b.label);
    else if (b.label === 'Drop It') assert.equal(b.variant, 2, id + ': ' + b.label);
    else assert.equal(b.label, ['The shaggy dog', 'The spotty dog', 'The tiny dog'][b.variant - 1], id);
  }));
  // a Tap's own counting balloon has somebody in the picture to belong to: her paws and the bedtime paws are
  // our cat's count, the rim’s paws Tallyheart's
  assert.deepEqual(ids.filter(id => frames[id].skip).map(id => E.skipWords(frames[id].skip, ((frames[id].say || [])[0] || {}).who).teacher), ['player', 'tallyheart', 'player']);
  ids.filter(id => frames[id].skip).forEach(id => {
    const who = E.skipWords(E.skipFor(frames[id].skip, { flags: {} }), ((frames[id].say || [])[0] || {}).who).teacher;
    assert.ok(castOf(id, who).length, id + ': ' + who + ' keeps the count, and is in the picture');
  });
});

test('speakers: the weasels are “A weasel” until the caption tells them apart, then Snip and Snatch; Hail is “A white head” from the log, “The speckled dragonet” through her riddle, “Hail” from “I’m Hail!”; the dogs by their coats until they say their names; Coil is “Coil”; what each Counts frame says again over its first question', () => {
  const cat = E.blankCat({}); cat.name = 'Fern';
  const who = {};
  ids.forEach(id => saidOn(story, id, cat).forEach(b => { (who[b.who] = who[b.who] || new Set()).add(b.label); }));
  assert.deepEqual(Object.fromEntries(Object.entries(who).map(([k, v]) => [k, [...v].sort()])), {
    player: ['Fernpaw'], tallyheart: ['Tallyheart'], murmurchime: ['Murmurchime'], glintstar: ['Glintstar'], grizzled: ['Grizzled old tom'],
    riffle: ['Riffle'], coil: ['Coil'], sprinkle: ['Sprinkle'], snorer: ['Snoring apprentice'], reynard: ['Reynard'],
    dog: ['Drop It', 'Good Boy', 'The dogs', 'The shaggy dog', 'The spotty dog', 'The tiny dog'].sort(),
    hail: ['A white head', 'Hail', 'The speckled dragonet'].sort(), snip: ['A weasel', 'Snip'], snatch: ['A weasel', 'Snatch']
  });
  // the boundaries: every weasel balloon before the caption that tells them apart is “A weasel”, every one from
  // its panel on carries its name; Hail's from “I’m Hail!” on; the dogs' from their names on
  const named = (w, from) => ids.forEach(id => (frames[id].say || []).filter(b => b.who === w).forEach(b => assert.equal(!!b.name, at(id) >= at(from), id + ' ' + w + ': ' + b.text)));
  named('snip', SQUEAKY); named('snatch', SQUEAKY); named('dog', NAMES);
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'hail').forEach(b => assert.equal(b.name, at(id) >= at(IM_HAIL) ? 'Hail' : at(id) === at(LOG) ? 'A white head' : undefined, id)));
  assert.deepEqual(saidOn(story, IM_HAIL, cat).map(b => b.label), ['Hail', 'Fernpaw']);
  assert.deepEqual(saidOn(story, countsAt('ch08-hail')[0], cat).map(b => b.label), ['The speckled dragonet'], 'her riddle comes before her name');
  assert.equal(labelFor({ who: E.teacherOf(story.counts['ch08-hail']) }, cat), 'The speckled dragonet', 'her riddle’s lines, its help, its fillers and its retry, by the chapter’s names');
  assert.equal(labelFor({ who: E.teacherOf(story.counts['ch08-riffle']) }, cat), 'Riffle');
  // every speaker that is named or labelled shows a face (no new faceHidden pose)
  ids.forEach(id => (frames[id].say || []).forEach(b => { const m = castOf(id, b.who)[0]; assert.equal(Sp.faceHidden(b, m), b.who === 'coil' && m.pose === 'stone', id + ' ' + b.who); }));
  // what each Counts frame says again over its first question: the pile, the warm-up and the lesson none
  // (`intro: false`); the twenty-eight and Snip's share have no balloon; Hail's riddle says hers again
  const again = ids.filter(id => frames[id].counts).map(id => [frames[id].counts.set, E.balloons(frames[id], cat).length, Sp.lessonIntro(E.balloons(frames[id], cat), frames[id].counts.intro === false).length]);
  assert.deepEqual(again, [['ch08-pile', 1, 0], ['ch08-sixes', 1, 0], ['ch08-fours', 1, 0], ['ch08-gone', 0, 0], ['ch08-hail', 1, 1], ['ch08-snip', 0, 0], ['ch08-riffle', 0, 0]]);
  // a Murmur's warrior is Mutterchime
  cat.name = 'Murmur';
  assert.equal(labelFor({ who: 'murmurchime' }, cat), 'Mutterchime');
  // the grown-ups corner has words for every flag a frame of the chapter sets
  const W = PC.ui.flagWords;
  ids.forEach(id => Object.entries(frames[id].sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v)));
  assert.equal(W.foundHail['true'], 'found Hail in the hollow log in the Barking Field (later chapters remember)');
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
  Object.keys(story.cards).forEach(cid => {
    const c = story.cards[cid];
    assert.deepEqual(tokensIn(c.line), [], cid);
    if (c.link) [c.link.line].concat(Object.values(c.link.lines || {})).forEach(l => assert.deepEqual(tokensIn(l), [], cid));
  });
  ids.filter(id => frames[id].ask).forEach(id => frames[id].ask.pairs.forEach(p => assert.deepEqual(tokensIn(p[0] + p[1]), [], id)));
  // the book's {their}: a she-cat's eighth Count is hers, a tom's his
  assert.match(fill(story.book.recap.map(r => r.text).join(' '), PROFILES['she-cat']), /Tallyheart taught Moonpaw her eighth Count, paws: the fours\./);
  assert.match(fill(story.book.recap.map(r => r.text).join(' '), PROFILES.tom), /Tallyheart taught Stormpaw his eighth Count, paws: the fours\./);
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
      const cat = { flags, lessons: flags.lessonClean ? { 'ch08-fours': { finished: true, noHelp: true } } : {} };
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
  // the frames over 30 for their wordiest reader: Tallyheart's news in the night, her pounce, the lesson's three
  // new ones, the trail's plan, the dusk, the noticing cat's tunnel, the dogs over the tunnel, the bank's foot,
  // Hail's questions and her skinny ones, the warm moment, the tom's paws and the like
  t.diagnostic('over 30 words for the wordiest reader: ' + over.join(', '));
  assert.ok(over.length <= 16, over.join(', '));
  const stats = {};
  let longest = 0, longestFrom = null;
  for (const c of COMBOS) for (const light of [0, 1]) for (const clean of (COMBOS.indexOf(c) % 4 ? [true] : [true, false])) {
    const rows = walkLines(c.flags, Object.assign({ light, clean }, c.o));
    const per = rows.map(r => r.lines.reduce((m, s) => m + words(s), 0));
    const w = per.reduce((a, b) => a + b, 0);
    per.forEach((n, i) => assert.ok(n <= 45, rows[i].id + ': ' + n + ' words for ' + comboName(c)));
    rows.forEach(r => assert.ok(r.boxes <= 4, r.id + ': ' + r.boxes + ' boxes for ' + comboName(c)));
    const k = (c.flags.ch3Told ? 'told ' : 'kept ') + c.way;
    (stats[k] = stats[k] || []).push({ n: rows.length, w });
    assert.ok(w / rows.length >= 15 && w / rows.length <= 18, comboName(c) + ': ' + (w / rows.length).toFixed(1) + ' words a frame');
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
  // the brief's budget: at most 130 frames a reading; the spec's estimate about 81 told and 88 kept through the
  // tunnel, about 92 and 98 round the field with Hail (here a panel more on every path: the bank's own panel)
  const range = k => [Math.min(...stats[k].map(x => x.n)), Math.max(...stats[k].map(x => x.n))];
  assert.deepEqual(['told tunnel', 'kept tunnel', 'told past', 'kept past', 'told hail', 'kept hail'].map(range), [[85, 85], [94, 94], [86, 88], [94, 96], [94, 95], [102, 103]],
    'the friend’s path, a friendly cat’s three panels past the dogs, a found dragonet’s news to Hail');
  Object.keys(stats).sort().forEach(k => {
    const s = stats[k], mm = f => Math.min(...s.map(f)) + '–' + Math.max(...s.map(f));
    t.diagnostic(k + ': ' + mm(x => x.n) + ' frames, ' + mm(x => x.w) + ' words of lettering, ' + (s.reduce((a, x) => a + x.w / x.n, 0) / s.length).toFixed(1) + ' a frame');
  });
  t.diagnostic('the longest run of panels with nothing to do: ' + longest + ', from ' + longestFrom + ' (the fox on the rails)');
});

test('a caption the page can letter on the panel is 95 characters at most (a long line in boxes, cut at sentence breaks); only the end page’s runs on', () => {
  const long = ids.filter(id => (frames[id].caption || []).some(c => capText(c).length > 95));
  assert.deepEqual(long, [ids[ids.length - 1]]);
  // the story's long lines (the spec's build notes), each in boxes cut at a sentence break, in the order she reads them
  const caps = re => frames[F(re)].caption.map(capText);
  assert.deepEqual(caps(/^At the Old Bridge, you check the bank first\./), ['At the Old Bridge, you check the bank first. No ginger ears.', 'Riffle is there, with fish for Sprinkle.']);
  assert.deepEqual(caps(/^Behind the back row, a wet nose/), ['Behind the back row, a wet nose pokes through the hedge. Riffle!', 'And there’s the round, dark hole, under the roots.']);
  assert.deepEqual(caps(/^Inside, it’s just wide enough for you\./).slice(0, 2), ['Inside, it’s just wide enough for you. And dark.', 'But cats see well in the dark, even pillow cats.']);
  F2(/^The Barking Field is silver/).forEach(id => assert.deepEqual(frames[id].caption.slice(0, 2), ['The Barking Field is silver in the moonlight.', 'Inside the fence, three dogs are asleep in a heap.'], id));
  F2(/^Out bounces a little dragonet/).forEach(id => assert.deepEqual(frames[id].caption, ['Out bounces a little dragonet, white with grey speckles, right up to the fence.', 'The dogs bound after her, wagging.'], id));
  F2(/^Up onto the fence top you go/).forEach(id => assert.deepEqual(frames[id].caption, ['Up onto the fence top you go, and along it, light as a leaf. Dogs can’t climb!', 'All three bark at your tail, and nobody watches the ground.'], id));
  F2(/^Then a smell you know\./).forEach(id => assert.deepEqual(frames[id].caption, ['Then a smell you know. FOX.', 'Along the tracks trots Reynard, tail high, smiling his big smile.', 'The wind blows from him to you. He can’t smell you.'], id));
  assert.deepEqual(caps(/^Beside the prey is a heap/).slice(1), ['It sparkles. It shines.', 'It’s the shiniest thing you’ve ever seen, and your paw wants it SO much.', 'You keep your paw still. You KNOW what it is.']);
  assert.deepEqual(caps(/^Soon he’s snoring\./), ['Soon he’s snoring.', 'Outside, the moon is half full. When it’s full, it’s the Gathering.', 'Every Clan will hear the truth, and decide about the dragon.']);
  assert.deepEqual(caps(/^Eight claw marks on the tree\./), ['Eight claw marks on the tree. Two weasels who can’t count.', 'One fox who wants a den. And a “scale” that was only ever glass.']);
  // no box is lettered as two boxes' worth: every caption that is cut is cut where a sentence ends
  ids.forEach(id => (frames[id].caption || []).forEach(c => assert.ok(E.endsSentence(capText(c)) || /:$/.test(capText(c)) || capText(c) === 'Chapter 8: The Night Trail', id + ': “' + capText(c) + '” ends a sentence (or runs on into its sound)')));
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
    // a board is for an illustrator: nothing shows teeth, fangs or a snarl, nobody is hurt or bleeding, and no
    // Warriors word is in it
    assert.doesNotMatch(b, /\b(teeth|fangs?|snarl\w*|blood|bleed\w*|wound\w*|claws? (out )?at|bites?|twolegs?|kittypets?|thunderpath|ironsnake|whisker-lengths?)\b/i, id);
    assert.doesNotMatch(b, /\bSTUB\b/, id);
  });
  // a frame shown only to some readers says so in its shot line; a Tap page says what the tap does in play
  ids.filter(id => frames[id].when).forEach(id => assert.match(frames[id].board.split('. ')[0], /\b(ONLY|BUT|NOT FOR)\b/, id + ': the shot line says who sees it'));
  ids.filter(id => frames[id].skip || frames[id].scratch || frames[id].ask).forEach(id => assert.match(frames[id].board, /In play/, id + ': the board says what happens in play'));
  ids.filter(id => frames[id].counts).forEach(id => assert.match(frames[id].board, /THEN THE COUNTS\./, id));
  ids.filter(id => frames[id].card).forEach(id => assert.match(frames[id].board, new RegExp('the new card appears under the panel, an ' + story.cards[frames[id].card].mark + ' in its corner'), id + ': the board says the card appears, with its mark'));
  ids.filter(id => same(frames[id].when, TOLD)).forEach(id => assert.match(frames[id].board.split('. ')[0], /THE TOLD PATH ONLY/, id));
  ids.filter(id => same(frames[id].when, KEPT)).forEach(id => assert.match(frames[id].board.split('. ')[0], /THE KEPT PATH ONLY/, id));
  ids.filter(id => same(frames[id].when, HAIL)).forEach(id => assert.match(frames[id].board.split('. ')[0], /ONLY FOR A CAT WHO HAS FOUND HAIL/, id));
  ids.filter(id => same(frames[id].when, NO_HAIL)).forEach(id => assert.match(frames[id].board.split('. ')[0], /EVERY CAT BUT ONE WHO HAS FOUND HAIL/, id));
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
  assert.equal(fill(T(ids.find(id => frames[id].input)), PROFILES.tom), 'What did Stormpaw dream, after the night trail?');
  assert.match(fill(T(F(/^\{name\}paw\? Where WERE you\?/)), PROFILES.tom), /^Stormpaw\? Where WERE you\? …Do the paw thing\./);
  assert.match(fill(story.book.dragonet[0].lines.join(' '), PROFILES.murmur), /Murmurpaw found her in a hollow log/);
});

test('our own world and the tone: no Warriors or Wings of Fire words, no “Ironsnake”, “Twoleg” or “whisker-length”; the weasels funny and greedy, never cruel; the fox never near her and never seeing her; nobody hurt, nobody caught; Coil a stone in his wall; the warrior thread one warm line, no promise', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|apprentices’ den|assessment|from this day|claw-moon|quarter-moon|half-moon|whisker-lengths?|claw-lengths?|fox-lengths?|tail-lengths?|monsters? of the sky|leader’s? nine lives|gift of|silverpelt|bogwade|damplark|boglark|cattail|snipkit)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|ironsnake|warriors’ den|claw-moon|silverpelt|whisker-lengths?)\b/i, id + ' board'));
  // the names on screen are the brief's: Snip, Snatch, Hail, Good Boy and Drop It, and nobody else new
  const NEW = ['Snip', 'Snatch', 'Hail', 'Good Boy', 'Drop It'];
  ids.forEach(id => (frames[id].say || []).forEach(b => { if (b.name) assert.ok(NEW.concat(['Coil', 'A white head', 'The dogs']).includes(b.name), id + ': ' + b.name); }));
  // the weasels: funny and greedy, never cruel, never toothy; nobody bites, strikes, snarls or growls
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(bites?|bitten|teeth|fangs?|claws? at|snarls?|growls?|kill\w*|strikes?|venom\w*|poison\w*)\b/i, id + ' ' + x.where));
  // nobody dies, nobody is hurt or caught (the hurt wing is the storm's, from chapter 3; “Nobody’s hurt.” is
  // the chase's end), nobody bleeds; the only frightening word is none at all
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(wound(ed)?|blood|bleed|bleeds|broken|die[sd]?|dead|death|bones?|drown\w*|caught|trapped|attacks?|pounces on)\b/i, id + ' ' + x.where));
  assert.deepEqual(FF(/\bhurt\b/), [F(/^Whatever the Clans decide/)].concat(F2(/^Nobody’s hurt\.$/)).sort());
  assert.deepEqual(FF(/terrif|horribl|scream|nightmare|monster|scary/i), []);
  // the fox: only up on the tracks (`rails`), on the bank seen from the weeds or from below; never on a panel
  // with a cat of the Clan anywhere but in the tall weeds, never facing down to them, gone before the chase
  ids.filter(id => castOf(id, 'reynard').length).forEach(id => {
    assert.deepEqual(castOf(id, 'reynard').map(c => [c.at, frames[id].scene.set]), [['rails', 'tracks']], id);
    assert.ok(['hide', 'brag'].includes(frames[id].scene.cam), id);
    frames[id].scene.cast.filter(c => CATS.includes(c.who)).forEach(c => assert.ok(/^weeds-/.test(c.at), id + ': ' + c.who + ' at ' + c.at + ' with the fox in the picture'));
    assert.ok(A.vocab.otherPoses.reynard.includes(castOf(id, 'reynard')[0].pose), id);
  });
  assert.ok(at(ids.filter(id => castOf(id, 'reynard').length).pop()) < at(F(/^Behind you:/)), 'he leaves before the chase');
  // nobody of the Clan on the rails or the sleepers
  ids.filter(id => frames[id].scene.set === 'tracks').forEach(id => frames[id].scene.cast.filter(c => c.at === 'rails').forEach(c => assert.equal(c.who, 'reynard', id)));
  // Coil: a stone in his wall, at his gap, his eyes never shut, nobody stepping on him; Riffle never juggles
  // under the bridge and never hugs his tail where Coil is
  ids.filter(id => castOf(id, 'coil').length).forEach(id => castOf(id, 'coil').forEach(c => {
    assert.deepEqual([c.pose, c.at, c.facing, c.squeeze, c.asleep], ['stone', 'gap', 'right', undefined, undefined], id);
    assert.equal(frames[id].scene.set, 'bridge', id);
  }));
  ids.filter(id => frames[id].scene.set === 'bridge').forEach(id => assert.ok(!castOf(id, 'riffle').some(c => c.pose === 'juggle' || c.pose === 'hug'), id + ': no juggling under the Old Bridge, and no tail-hug where Coil is'));
  // nobody steps past the last post; the tracks are nobody's land, and not one paw on the rails
  everyText((id, x) => assert.doesNotMatch(x.text, /past the (last )?post\b(?!\.)/i, id + ' ' + x.where));
  assert.equal(FF(/Not one paw on the rails/).length, 2, 'the rule, on both paths');
  // the warrior thread: one warm line, said once on both paths, and no promise
  assert.equal(FF(/That’s how a warrior thinks\./).length, 1);
  everyText((id, x) => assert.doesNotMatch(x.text, /One day|when you(’re| are) a warrior|your Warrior Counts|you’ll be a warrior|I promise/i, id + ' ' + x.where));
  // the dragonet stays the player's secret on the kept path; “Not yet.”
  assert.match(T(F(/^You tell her everything:/)), /Everything but the dragonets\. Not yet\./);
  // the hook is curious, never scary
  assert.match(T(F(/^Whatever the Clans decide/)), /How do you mend a dragon’s wing\?/);
  assert.match(T(F(/You curl up tight, warm and safe, and sleep\.$/)), /warm and safe, and sleep\.$/);
  assert.ok(frames[F(/You curl up tight, warm and safe, and sleep\.$/)].scene.fx.includes('night'), 'warm in her nest at night');
});

/* ------------------------------------------------------------------ the text, word for word */

test('the lettering is the story’s own: every caption, balloon, sound effect, option and card line is in docs/chapters/08-the-night-trail.md, and every line its screens speak is in the chapter', () => {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/chapters/08-the-night-trail.md'), 'utf8');
  const from = doc.indexOf('# Chapter 8: The Night Trail'), to = doc.indexOf('\n*For us*');
  assert.ok(from === 0 && to > from, 'the story, from its title to its notes');
  const head = doc.slice(from, doc.indexOf('\n', from)), body = doc.slice(doc.indexOf('## The seventh count'), to);
  const screens = head + '\n\n' + body;
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
    if (f.choice) f.choice.options.forEach(o => [o.label].concat((o.labelWhen || []).map(v => v.label)).forEach(l => { if (!page.includes(l.replace(/^“|”$/g, ''))) mine.push(id + ' option: ' + l); }));
    if (f.scratch) assert.ok(page.includes(f.scratch.prompt.replace(/\*\*/g, '')), id + ': ' + f.scratch.prompt);
    if (f.skip && f.skip.prompt) assert.ok(page.includes(f.skip.prompt.replace(/\*\*/g, '')), id + ': ' + f.skip.prompt);
    if (f.ask) { assert.ok(page.includes(f.ask.prompt.replace(/\*\*/g, ''))); f.ask.pairs.forEach(p => assert.ok(spoken.includes(loose(p[0])) && page.includes('“' + p[1] + '”'), id + ': ' + p.join(' / '))); }
  });
  Object.keys(story.cards).forEach(cid => {
    const c = story.cards[cid];
    assert.ok(page.includes('“' + c.line + '”'), cid + ': ' + c.line);
    if (c.link) [c.link.line].concat(Object.values(c.link.lines || {})).forEach(l => assert.ok(flat(doc).includes('“' + l + '”'), cid + ': its link line is the story’s: ' + l));
  });
  // what is the builder's and not the story's: the closing frame in her nest (the title is the story's own)
  const end = ids[ids.length - 1];
  assert.deepEqual(mine, [end + ': ' + frames[end].caption[0], end + ': End of Chapter Eight.']);
  assert.equal(T(story.start), 'Chapter 8: The Night Trail');
  assert.equal(E.chapterHeading(story), 'Chapter 8: The Night Trail', 'the title panel says the chapter’s own heading');
  // chapters 2 to 7's closing form, with tonight's half moon and her glass
  assert.match(frames[end].caption[0], /^You sleep warm in your nest, with your glass under the moss and the half moon shining over the rosebush\.$/);
  assert.deepEqual([frames[end].scene.opts.moon, frames[end].scene.opts.glass], [8, true], 'and it is drawn');
  // and the other way: every line a screen of the story speaks is lettered somewhere in the chapter (a frame,
  // an option, a Counts set's lines, the questions the engine words, Tallyheart's seven Counts, her cards)
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
    // (Hail's riddle is one quote in the story, her frame's balloon and the question's own words in the build)
    (p.replace(/\s+/g, ' ').match(/“[^”]*”/g) || []).map(q => q.slice(1, -1)).forEach(q => { if (!all.includes(loose(q)) && !q.split(/(?<=[.!?…])\s+/).every(s => all.includes(loose(s)))) missing.push(q); });
  });
  assert.deepEqual(missing, []);
  // the story's plain lines the build letters as the engine's questions, word for word
  ['Three front rows of ten. How many pieces?', 'Four gone a night, for seven nights. How many gone?', 'You scratch two marks a night, for seven nights. How many did Snip carry?', 'How many paws go round and round this field?']
    .forEach(q => { assert.ok(page.includes(q), q); assert.ok(countsLines().some(x => x.text === q), q); });
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab), camera by camera: every anchor one of its camera’s own, every option the set declares by value, the cast, poses, moods and extras chapter 8 adds, each worn by whom the spec says', () => {
  const v = A.vocab;
  assert.ok(v && v.sets.tracks && TRACKS_CAMS.every(cam => v.sets.tracks.cams.includes(cam)) && v.cast.includes('hail') && v.cast.includes('snip') && v.cast.includes('snatch'), 'the art exposes chapter 8’s vocabulary');
  const OLD = { claws: [true], squeeze: [true], holdAt: ['paws', 'mouth'] };
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
      if (c.holds === 'string') assert.ok(c.who === 'riffle' && c.pose === 'stand', where + ': Riffle’s string of fish');
      if (c.holds === 'mouse') assert.equal(c.who, 'snatch', where + ': Snatch is ALWAYS holding a mouse');
      if (c.holds === 'leaf' || c.holds === 'glass') assert.equal(c.who, 'player', where + ': her glass in its leaf');
      if (c.holdAt !== undefined) assert.ok(c.holds, where + ': holdAt goes with holds');
      if (c.holds !== undefined) assert.ok(['pinecone', 'string', 'mouse', 'leaf', 'glass'].includes(c.holds), where + ': ' + c.holds);
      if (c.who === 'snatch' && !['curl'].includes(c.pose)) assert.equal(c.holds, 'mouse', where + ': always');
      if (c.tap !== undefined) {
        assert.ok(frames[id].scratch && frames[id].scratch.tap === c.tap, where + ': the tap mark is this page’s Tap');
        const WHO = { paw: ['player', 'riffle'], ears: ['riffle'], tail: ['tallyheart', 'riffle'], leaf: ['player'] };
        assert.ok(WHO[c.tap].includes(c.who), where + ': ' + c.tap);
        if (c.tap === 'paw' && c.who === 'player') assert.ok(['pawup', 'run'].includes(c.pose), where);
        if (c.tap === 'paw' && c.who === 'riffle') assert.deepEqual([c.pose, s.opts.tight], ['scramble', true], where + ': Riffle stuck');
        if (c.tap === 'ears') assert.deepEqual([c.pose, c.holds], ['stand', 'string'], where);
        if (c.tap === 'tail') assert.ok(c.tailUp && /^weeds-/.test(c.at), where + ': the friend’s tail up out of the weeds');
        if (c.tap === 'leaf') assert.deepEqual([c.holds, c.holdAt], ['leaf', 'paws'], where);
      }
      if (c.tailUp) assert.ok((c.tap === 'tail') || (c.who === 'player' && c.pose === 'sit' && c.mood === 'proud' && /^Your tail goes straight up\./.test(T(id))), where + ': the friend’s tail in the weeds, or her own straight up');
      if (c.glow) assert.ok(c.who === 'tallyheart' && frames[id].ask, where + ': the one to tap is Tallyheart, on the page of her seven Counts');
      if (c.claws) assert.ok(c.who === 'tallyheart' && c.pose === 'crouch' && /^In the sand she scratches/.test(T(id)), where + ': claws out, scratching the sand');
      if (c.squeeze) assert.ok(c.who === 'player' && frames[id].sfx === 'ACHOO!', where + ': the sneeze');
      if (c.asleep === true) assert.ok(c.who === 'dog' && c.pose === 'lie', where + ': the heap, asleep');
      if (c.asleep === 'half') assert.ok(c.who === 'player' && c.pose === 'curl' && /You curl up tight, warm and safe, and sleep\.$/.test(T(id)), where + ': half asleep as she curls up to sleep');
      const poses = isCat ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      if (typeof c.at === 'object') {
        assert.ok(Object.keys(c.at).every(k => ['x', 'y', 'h', 'z'].includes(k)) && 'x' in c.at && 'y' in c.at, where + ': a spot is { x, y } (with h, as the art gives them)');
        // a spot of its own: Tallyheart beside her nest as she wakes; nose to nose behind the pile; our cat dry on the
        // Barking Field's path, flat in the grass (the sneak) or sitting to talk to Hail
        const rear = s.set === 'pile' && s.cam === 'rear', hole = s.set === 'pile' && s.cam === 'hole', dogs = s.set === 'field' && s.cam === 'dogs';
        const ok = (s.set === 'den' && c.who === 'tallyheart' && same(c.at, WAKE)) || (rear && c.who === 'player' && same(c.at, NOSE)) ||
          (dogs && c.who === 'player' && c.pose === 'flat' && same(c.at, FLAT) && /^You drop flat in the grass\./.test(T(id))) ||
          (dogs && c.who === 'player' && c.pose === 'sit' && same(c.at, BY_WIRE) && /^(SPRINKLE\? Is she safe\?|Want to get past the dogs\?)/.test(T(id))) ||
          (rear && c.who === 'riffle' && same(c.at, HEDGE)) || (hole && c.who === 'tallyheart' && same(c.at, TALK)) || (hole && c.who === 'player' && same(c.at, LEAN));
        assert.ok(ok, where + ': a spot of its own');
      } else assert.ok(mine[c.at], where + ': ' + s.set + '/' + s.cam + ' has no anchor ' + c.at + ' (its own: ' + Object.keys(mine).join(' ') + ')');
      assert.ok(['left', 'right'].includes(c.facing), where + ': facing');
      // a size: Tallyheart past the tree, as chapters 5 to 7 have her; Coil as a stone in the bridge's back wall
      if (c.size !== undefined) assert.ok((c.who === 'tallyheart' && c.size === 1.2 && s.set === 'hollow' && c.at === 'tree-far') || (c.who === 'coil' && c.size === 1.45 && s.cam === 'back'), where + ': size ' + c.size);
      if (c.variant !== undefined) {
        assert.ok(v.variants[c.who], where + ': only ' + Object.keys(v.variants).join('/') + ' have a variant');
        assert.ok(v.variants[c.who].includes(c.variant), where + ': variant ' + c.variant);
      } else assert.ok(!v.variants[c.who], where + ': a ' + c.who + ' says which one');
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), id + ': unknown fx ' + e));
    assert.ok(!s.fx.some(e => ['rain', 'lightning', 'sunset'].includes(e)), id + ': no storm and no sunset tonight');
  });
  assert.deepEqual(Object.keys(seen).sort(), ['asleep', 'claws', 'glow', 'holdAt', 'holds', 'squeeze', 'tailUp', 'tap']);
  // the skip-counts' and the lessons' pictures name only cast members
  ids.filter(id => frames[id].skip && frames[id].skip.who).forEach(id => frames[id].skip.who.forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
  Object.values(story.counts).forEach(d => [].concat(d.who || []).concat(...d.facts.map(f => f.who || [])).forEach(w => assert.ok(v.cast.includes(w.who), w.who)));
  // every card has its drawing, and its mark is one the art knows
  Object.keys(story.cards).forEach(cid => { assert.ok(A.cardPictures[cid], 'a drawing for ' + cid); assert.ok(A.cardMarks.includes(story.cards[cid].mark), cid); });
});

/* ------------------------------------------------------------------ staging */

test('staging, the seventh count: the told path wakes in the den at night, Tallyheart crouched beside her nest; the kept path’s guards yawn at first light; the back row in shadow up to the walk round, then the gap and the dug earth; nobody stern; Glintstar; the old tom’s pinecone', () => {
  const wake = ids.filter(id => same(frames[id].when, TOLD) && at(id) < at(PILE_COUNT));
  assert.deepEqual(wake.map(camOf), ['den/inside', 'den/doorway', 'den/doorway']);
  wake.forEach(id => {
    assert.deepEqual([frames[id].scene.fx, frames[id].scene.opts], [['night'], { weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true }], id);
    assert.deepEqual(castOf(id, 'tallyheart').map(c => [c.pose, c.at, c.facing]), [['crouch', WAKE, 'left']], id + ': crouched beside her nest');
    assert.deepEqual(castOf(id, 'player').map(c => [c.at, c.facing]), [['nest', 'right']], id + ': turned to her');
  });
  assert.deepEqual(castOf(wake[0], 'snorer').map(c => [c.at, c.mood]), [['sleeper-1', 'sleepy']], 'the grey tom asleep across the den');
  // her eyes shining (the review: `happy` draws them shut, and the caption says they shine)
  wake.slice(0, 2).forEach(id => assert.equal(castOf(id, 'tallyheart')[0].mood, 'wonder', id + ': her eyes shining'));
  const k = F(/^By the prey pile, the last guards are yawning\./);
  assert.deepEqual([camOf(k), frames[k].scene.fx, castOf(k, 'clancat').map(c => c.mood), castOf(k, 'murmurchime').length], ['pile/wide', ['morning'], ['sleepy', 'sleepy', 'sleepy'], 1]);
  const morning = ids.filter(id => frames[id].scene.set === 'pile' && at(id) < at(DUSK));
  const ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  const walkRound = ids.find(id => frames[id].scratch && frames[id].scratch.tap === 'back');
  morning.forEach(id => {
    const o = frames[id].scene.opts;
    assert.deepEqual([o.rows, o.scale, o.moon], [ROWS, 'behind', undefined], id);
    assert.equal(o.back, at(id) <= at(walkRound) ? 'shadow' : undefined, id + ': the back row is a dark band up to the walk round');
    assert.equal(o.dug, at(id) > at(walkRound) ? 'big' : undefined, id + ': then the gap and the dug earth');
    assert.deepEqual(frames[id].scene.fx, ['morning'], id);
    frames[id].scene.cast.forEach(c => assert.notEqual(c.mood, 'stern', id + ': nobody is blamed'));
  });
  assert.deepEqual([camOf(PILE_COUNT), camOf(walkRound), frames[walkRound].scene.opts.tap, camOf(frames[walkRound].scratch.next)], ['pile/rows', 'pile/rows', 'back', 'pile/gap']);
  assert.equal(E.countsSet('ch08-pile', story, STORIES).picture.kind, 'prey', 'the Counts picture is the three front rows, never the frame’s scene');
  assert.ok(castOf(PILE_COUNT, 'glintstar').length && castOf(PILE_COUNT, 'tallyheart').length && castOf(PILE_COUNT, 'player').length, 'Glintstar, Tallyheart and our cat at the count');
  const paws = F(/^The guards look at their paws\./);
  assert.deepEqual([castOf(paws, 'glintstar')[0].at, castOf(paws, 'grizzled').map(c => [c.holds, c.holdAt]), castOf(paws, 'clancat').map(c => c.mood)], ['fountain-edge', [['pinecone', 'paws']], ['shy', 'shy']]);
});

test('staging, the Hollow: seven marks until the eighth is scratched, eight from then on; the rim sitting up until they hop down past her, empty after; her paws by pairs on `lesson`, the rim’s paws and the ask in the wide view; the twenty-eight in the sand', () => {
  const hollow = ids.filter(id => frames[id].scene.set === 'hollow');
  assert.deepEqual(hollow, ids.slice(at(countsAt('ch08-sixes')[0]), at(F(/^At the Old Bridge, you check the bank first\./))));
  hollow.forEach(id => { assert.equal(frames[id].scene.opts.marks, at(id) >= at(TREE) ? 8 : 7, id + ': marks'); assert.equal(frames[id].scene.opts.glow, 'auto', id); assert.deepEqual(frames[id].scene.fx, ['morning'], id); });
  assert.deepEqual([camOf(TREE), frames[TREE].sfx, frames[TREE].scene.cast], ['hollow/tree', 'SKRITCH!', []]);
  assert.match(frames[TREE].board, /an eighth claw mark into the bark beside the seventh; the marks stand four and four now/);
  assert.equal(camOf(EIGHTH), 'hollow/wide', 'the eighth Count is said where the eight marks show');
  // the rim: sitting up until the rim’s paws, where they hop down (walking, the skip's `who` in their coats); empty after
  const hop = ids.find(id => frames[id].skip && frames[id].skip.groups === 5);
  const rimOf = id => RIM_ANCHORS.map(a => frames[id].scene.cast.find(c => c.at === a)).filter(Boolean);
  hollow.filter(id => at(id) < at(hop) && frames[id].scene.cam === 'wide').forEach(id => assert.deepEqual(rimOf(id).map(c => [c.who, c.variant, c.pose]),
    [['clancat', 1, 'situp'], ['murmurchime', undefined, 'situp'], ['clancat', 3, 'situp'], ['clancat', 5, 'situp'], ['grizzled', undefined, 'situp']], id));
  assert.deepEqual(rimOf(hop).map(c => [c.who, c.variant, c.pose, c.facing]), [['clancat', 1, 'walk', 'left'], ['murmurchime', undefined, 'walk', 'left'], ['clancat', 3, 'walk', 'left'], ['clancat', 5, 'walk', 'left'], ['grizzled', undefined, 'walk', 'left']]);
  assert.deepEqual(rimOf(hop).map(c => ({ who: c.who, variant: c.variant })).map(x => JSON.stringify(x)), frames[hop].skip.who.map(w => JSON.stringify({ who: w.who, variant: w.variant })), 'the five she counts are the five hopping down');
  hollow.filter(id => at(id) > at(hop)).forEach(id => assert.equal(rimOf(id).length, 0, id + ': the rim is empty'));
  // “You look down.”: close on the sand, our cat crouched over her own paws (the art has no looking-down pose)
  const down = F(/^You look down\./);
  assert.deepEqual([camOf(down), frames[down].scene.cast.map(c => [c.who, c.pose, c.mood])], ['hollow/sand', [['player', 'crouch', 'wonder']]]);
  // her paws: Tallyheart sits for “Four paws on every cat.”, then stands side-on for the count (and on the kept page)
  const [pairs] = ids.filter(id => frames[id].skip);
  assert.deepEqual([F(/^Four paws on every cat\.$/), pairs, frames[pairs].skip.next].map(id => [camOf(id), castOf(id, 'tallyheart')[0].pose]), [['hollow/lesson', 'sit'], ['hollow/lesson', 'stand'], ['hollow/lesson', 'stand']]);
  const ask = ids.find(id => frames[id].ask);
  assert.deepEqual([camOf(hop), camOf(ask), frames[ask].scene.opts.marks, castOf(ask, 'tallyheart')[0].glow, castOf(ask, 'tallyheart')[0].at], ['hollow/wide', 'hollow/wide', 7, true, 'tree-far']);
  assert.equal(camOf(countsAt('ch08-fours')[0]), 'hollow/lesson');
  // the twenty-eight: the two of them crouched over the sand where she scratches the marks, her claws out
  assert.deepEqual([camOf(countsAt('ch08-gone')[0]), frames[countsAt('ch08-gone')[0]].scene.cast.map(c => [c.who, c.pose, !!c.claws])], ['hollow/sand', [['tallyheart', 'crouch', true], ['player', 'crouch', false]]]);
  assert.equal(castOf(F(/^Twenty-eight\. And not one guard saw a thing\./), 'tallyheart')[0].mood, 'stern', 'frowning');
  assert.deepEqual(castOf(F(/^You know why: they come from UNDER!/), 'player').map(c => c.mood), ['shy'], 'her thought: the caption only');
});

test('staging, the Old Bridge (kept): the stone leg and Coil a stone at his gap; Riffle’s string of fish and his ears the Tap, then the fish dropped; his paw over his mouth for “…pile,”; Sprinkle in her nook', () => {
  const bridge = ids.filter(id => frames[id].scene.set === 'bridge');
  assert.equal(bridge.length, 4);
  bridge.forEach(id => {
    assert.deepEqual([frames[id].when, frames[id].scene.fx], [KEPT, ['day']], id);
    assert.deepEqual(castOf(id, 'coil').map(c => [c.pose, c.at]), [['stone', 'gap']], id);
    assert.ok(castOf(id, 'sprinkle').length && castOf(id, 'riffle').length && castOf(id, 'player').length, id);
    assert.ok(!castOf(id, 'tallyheart').length, id);
  });
  bridge.filter(id => frames[id].scene.cam === 'back').forEach(id => { assert.deepEqual(frames[id].scene.opts, { prints: true, stones: true }, id); assert.equal(castOf(id, 'coil')[0].size, 1.45, id); });
  bridge.filter(id => frames[id].scene.cam === 'wall').forEach(id => assert.deepEqual(frames[id].scene.opts, {}, id));
  assert.deepEqual(bridge.map(id => castOf(id, 'riffle')[0]).map(c => [c.pose, c.holds, c.tap]), [['stand', 'string', 'ears'], ['stand', undefined, undefined], ['hush', undefined, undefined], ['stand', undefined, undefined]]);
  assert.deepEqual(bridge.map(camOf), ['bridge/back', 'bridge/wall', 'bridge/wall', 'bridge/back']);
});

test('staging, dusk and round the back of the pile: the half moon high at dusk; then night, the roots lifted and the mouth open, the guards small at the front facing out; the friend at `rear-2` (Tallyheart at `poke` with her nose at the rim, Riffle at `poke` on all fours); the route chosen at the brink; the mouth the Tap only where she wriggles in', () => {
  assert.deepEqual([camOf(DUSK), frames[DUSK].scene.fx, frames[DUSK].scene.opts], ['pile/wide', ['dusk'], { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 8, tap: 'back' }]);
  assert.deepEqual(castOf(DUSK, 'clancat').map(c => [c.at, c.facing]), [['crowd-2', 'right'], ['beside', 'right'], ['crowd-3', 'right']], 'the first guards facing out over the camp (the one further back drawn first, under the walker)');
  assert.deepEqual(DUSK && frames[DUSK].scene.cast.filter(c => c.who !== 'clancat').map(c => [c.who, c.at]), [['player', 'pile-left']], 'our cat alone near the pile');
  const rear = ids.filter(id => camOf(id) === 'pile/rear');
  rear.forEach(id => {
    const o = frames[id].scene.opts, mouth = frames[id].scratch && frames[id].scratch.tap === 'mouth';
    assert.deepEqual(o, { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tunnel: true, tap: mouth ? 'mouth' : undefined }.tap ? { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tunnel: true, tap: 'mouth' } : { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tunnel: true }, id);
    assert.deepEqual(frames[id].scene.fx, ['night'], id);
    assert.deepEqual(castOf(id, 'clancat').map(c => [c.at, c.facing]), [['guard-1', 'left'], ['guard-2', 'right'], ['guard-3', 'right']], id + ': the guards small at the front, looking out');
    frames[id].scene.cast.filter(c => c.who === 'tallyheart' || c.who === 'riffle').forEach(c => assert.ok(['rear-2', 'poke'].includes(c.at) || (c.who === 'riffle' && same(c.at, HEDGE)), id + ': ' + c.who + ' at ' + JSON.stringify(c.at)));
  });
  // `poke`: Tallyheart crouched, laughing at herself, facing left, nose at the rim (told); Riffle on all fours (kept)
  assert.deepEqual(rear.filter(id => frames[id].scene.cast.some(c => c.at === 'poke')).map(id => frames[id].scene.cast.find(c => c.at === 'poke')).map(c => [c.who, c.pose, c.facing]),
    [['riffle', 'scramble', 'left'], ['tallyheart', 'crouch', 'left']]);
  // her wry “Hmph. Just as I thought.”: a smug smile, never `laugh` (squeezed eyes, tear drops and an open mouth: with
  // her shoulders stuck, she read as stuck and crying)
  assert.equal(castOf(F(/^Tallyheart pokes her head in/), 'tallyheart')[0].mood, 'proud');
  // and no mentor anywhere in the chapter looks hurt or crying: `laugh` draws tears, `sad` a hurt face
  ids.forEach(id => frames[id].scene.cast.filter(c => ['tallyheart', 'glintstar'].includes(c.who)).forEach(c => assert.ok(!['laugh', 'sad', 'scared'].includes(c.mood), id + ': ' + c.who + ' ' + c.mood)));
  assert.deepEqual(castOf(ROUTE, 'player').map(c => [c.pose, c.at]), [['crouch', 'brink']]);
  assert.deepEqual([camOf(ROUTE), frames[ROUTE].scene.opts, frames[ROUTE].scene.fx], ['pile/hole', { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }, ['night']]);
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.tap === 'mouth'), TWINS[2], 'the wriggle in, on both paths');
});

test('staging, the tunnel: every panel inside it (`crawl` or `fork`), at night; our cat alone on the told path (Tallyheart over the top, heard and never drawn), Riffle behind her on the kept, stuck where it narrows (`tight`); the worm only up the left way; out at the bank’s foot', () => {
  const tunnel = ids.filter(id => at(id) > at(frames[ROUTE].choice.options[0].next) && at(id) < at(frames[ROUTE].choice.options[1].next) && frames[id].scene.set === 'tracks' && ['crawl', 'fork'].includes(frames[id].scene.cam));
  assert.equal(tunnel.length, 13);
  tunnel.forEach(id => {
    assert.deepEqual(frames[id].scene.fx, ['night'], id);
    assert.ok(!castOf(id, 'tallyheart').length, id + ': Tallyheart is above ground');
    assert.ok(castOf(id, 'player').every(c => ['crawl-1', 'fork-1'].includes(c.at)), id);
    castOf(id, 'riffle').forEach(c => assert.deepEqual([c.pose, c.at], ['scramble', frames[id].scene.cam === 'crawl' ? 'crawl-2' : 'fork-2'], id + ': Riffle behind her, on all fours'));
    if (castOf(id, 'riffle').length && frames[id].when) assert.deepEqual(frames[id].when, KEPT, id);
  });
  assert.deepEqual(tunnel.filter(id => frames[id].scene.opts.tight), [F(/Riffle comes in after you\./)], 'the narrow bit, once');
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.worm).sort(), FORK.map(id => frames[id].choice.options[0].next).sort(), 'the worm up the left way');
  FORK.forEach(id => {
    const [l, r] = frames[id].choice.options.map(o => castOf(o.next, 'player')[0]);
    assert.deepEqual([l.facing, l.mood, r.facing, r.mood], ['left', 'sniff', 'right', 'happy'], id);
  });
  const roof = F(/^In the soft earth: tiny prints, coming and going\. Is Tallyheart still up there\?$/);
  assert.deepEqual(castOf(roof, 'player').map(c => [c.pose, c.tap]), [['pawup', 'paw']], 'sitting up under the roots, her paw at the roof');
  const [endT, endK] = TWINS[3];
  assert.deepEqual([castOf(endT, 'player')[0].at, castOf(endT, 'tallyheart')[0].at, castOf(endK, 'player')[0].at, castOf(endK, 'riffle')[0].at], ['tunnel-end', 'foot-2', 'foot-1', 'tunnel-end'], 'wriggling out at the bank’s foot');
});

test('staging, the Barking Field at night: chapter 2’s cameras under the half moon; the heap asleep, then waking; the dogs by their variants at the fence; Hail at the log, at the wire and round the ring; the way past the dogs by specialty; the path the Tap; home is to the left', () => {
  const field = ids.filter(id => frames[id].scene.set === 'field');
  field.forEach(id => {
    const s = frames[id].scene;
    assert.ok(['wide', 'dogs', 'fence'].includes(s.cam), id + ': ' + s.cam);
    assert.ok(s.fx.includes('night'), id + ': at night');
    assert.equal(s.opts.moon, 8, id + ': the half moon');
    assert.deepEqual(Object.keys(s.opts).filter(k => k !== 'moon'), s.opts.tap ? ['tap'] : [], id);
    if (s.opts.tap) assert.equal(s.opts.tap, 'path', id);
    s.cast.filter(c => c.who === 'dog').forEach(c => assert.ok(c.variant >= 1 && c.variant <= 3, id));
    // a dog's spot is a dog's: at the fence, in the heap or running round the ring; as Hail bounces out of the
    // log, the spotty dog far back in the field by it (`field`), coming after her
    s.cast.filter(c => c.who === 'dog').forEach(c => assert.ok(/^(dog|heap|ring)-\d$/.test(c.at) || (c.at === 'field' && c.variant === 2 && /^Out bounces a little dragonet/.test(T(id))), id + ': a dog at ' + c.at));
    castOf(id, 'hail').forEach(c => assert.ok(['log', 'wire', 'ring-1', 'ring-2', 'ring-3'].includes(c.at), id + ': Hail at ' + c.at));
    castOf(id, 'snip').concat(castOf(id, 'snatch')).forEach(c => assert.match(c.at, /^trail-[12]$/, id + ': a weasel on the path'));
  });
  // the heap: asleep, then the shaggy dog's head up
  const heap = F2(/^The Barking Field is silver/), wake = F2(/^One ear twitches\./);
  heap.forEach(id => assert.deepEqual(castOf(id, 'dog').map(c => [c.at, c.pose, c.asleep]), [['heap-1', 'lie', true], ['heap-2', 'lie', true], ['heap-3', 'lie', true]], id));
  wake.forEach(id => assert.deepEqual(castOf(id, 'dog').map(c => [c.variant, c.pose, !!c.asleep]), [[1, 'sit', false], [2, 'lie', true], [3, 'lie', true]], id));
  heap.concat(wake).forEach(id => assert.ok(frames[id].scene.cast.filter(c => CATS.includes(c.who) || c.who === 'riffle').every(c => c.facing === 'right'), id + ': walking right, toward the tracks'));
  // Hail: peeking from the log at the choice, bouncing at the wire, round the ring, never past the fence
  assert.deepEqual(castOf(LOG, 'hail').map(c => [c.pose, c.at]), [['peek', 'log']]);
  assert.deepEqual(castOf(F(/^Hail bounces off across the field\./), 'hail').map(c => [c.pose, c.at]), [['run', 'ring-1']]);
  assert.ok(F2(/^Tell Sprinkle: five!/).every(id => castOf(id, 'hail')[0].pose === 'run'));
  // the way past: flat on the path (sneaking), along the fence top (climbing), waving at the wire (friends),
  // the friend's flick (noticing or swimming)
  F2(/^You drop flat in the grass\./).forEach(id => assert.deepEqual(castOf(id, 'player').map(c => [c.pose, camOf(id)]), [['flat', 'field/dogs']], id));
  F2(/^Up onto the fence top you go/).forEach(id => assert.deepEqual(castOf(id, 'player').map(c => [c.pose, c.at]), [['walk', 'fence-top']], id));
  F2(/^Up onto the fence top you go/).forEach(id => assert.deepEqual(castOf(id, 'dog').map(c => c.pose), ['jump', 'jump', 'jump'], id + ': barking at her tail'));
  F2(/^Hello, dogs!$/).forEach(id => assert.deepEqual(castOf(id, 'player').map(c => c.pose), ['pawup'], id));
  F2(/^While all three wag/).forEach(id => assert.deepEqual(castOf(id, 'dog').map(c => [c.pose, c.mood]), [['sit', 'happy'], ['sit', 'happy'], ['sit', 'happy']], id));
  // the friend is beside her all the way round the field (the review: for sneaking, climbing and friendly cats
  // the friend vanished while the dogs barked): every panel of the way past the dogs is a told and a kept twin,
  // the same lines and the same picture but the friend, Tallyheart or Riffle, on the path with her
  const PAST = [[/^You drop flat in the grass\./, SNEAK_TOLD, SNEAK_KEPT], [/^Up onto the fence top you go/, CLIMB_TOLD, CLIMB_KEPT],
    [/^Hello, dogs!$/, FRIENDS_TOLD, FRIENDS_KEPT], [/^The dogs stop\./, FRIENDS_TOLD, FRIENDS_KEPT], [/^While all three wag/, FRIENDS_TOLD, FRIENDS_KEPT]];
  for (const [re, tw, kw] of PAST) {
    const [t, k] = F2(re);
    assert.deepEqual([frames[t].when, frames[k].when], [tw, kw], t + ' ' + k);
    assert.equal(T(t), T(k), t + ' and ' + k + ': the same lines');
    assert.equal(castOf(t, 'tallyheart').length + castOf(k, 'riffle').length, 2, t + ' ' + k + ': the friend in each');
    assert.equal(castOf(t, 'riffle').length + castOf(k, 'tallyheart').length, 0, t + ' ' + k + ': and only hers');
    const tf = castOf(t, 'tallyheart')[0], kf = castOf(k, 'riffle')[0];
    assert.ok(same(tf.at, kf.at) && tf.facing === 'right' && kf.facing === 'right', t + ' ' + k + ': the friend at the same spot, going her way, toward the tracks');
    const strip = id => frames[id].scene.cast.filter(c => !['tallyheart', 'riffle'].includes(c.who));
    assert.deepEqual(strip(t), strip(k), t + ' ' + k + ': the rest of the picture the same');
  }
  assert.deepEqual([castOf(F(/^Tallyheart flicks a pinecone/), 'tallyheart')[0].pose, castOf(F(/^Riffle flicks a pebble/), 'riffle')[0].pose], ['pawup', 'point'], 'the flick is over');
  // the chase runs left, home; the weasels skid round
  F2(/^Down the bank you run/).forEach(id => frames[id].scene.cast.forEach(c => assert.equal(c.facing, 'left', id + ': ' + c.who + ' runs home')));
  F2(/^Down the bank you run/).forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => c.who === 'riffle' ? 'riffle ' + c.pose : c.pose), castOf(id, 'riffle').length ? ['run', 'riffle scramble', 'run', 'run'] : ['run', 'run', 'run', 'run'], id + ': Riffle on all fours, he has no run'));
  HAIL_TWINS[1].forEach(id => assert.deepEqual(castOf(id, 'snip').concat(castOf(id, 'snatch')).map(c => [c.pose, c.facing]), [['skid', 'right'], ['skid', 'right']], id + ': skid round for home'));
  HAIL_TWINS[2].forEach(id => assert.deepEqual(castOf(id, 'player').map(c => [c.pose, c.tap]), [['pawup', 'paw']], id + ': the wave'));
});

test('staging, the bank by the tracks: always at night; the new place on its own panel, then the friend at the bank’s foot; in the weeds our cat at `weeds-1` and the friend at `weeds-2`, crouched or on all fours; the weasels at their holes, on the slope below the fox, small; the stash, its glass and her face at the edge; the friend keeps watch', () => {
  const tracks = ids.filter(id => frames[id].scene.set === 'tracks');
  tracks.forEach(id => {
    const s = frames[id].scene;
    assert.deepEqual(s.fx, ['night'], id);
    assert.equal(s.opts.moon, ['wide', 'hide', 'brag'].includes(s.cam) ? 8 : undefined, id + ': the half moon where the sky shows');
    castOf(id, 'snip').concat(castOf(id, 'snatch')).forEach(c => assert.ok(['hole-1', 'hole-2', 'slope-1', 'slope-2'].includes(c.at), id + ': a weasel at ' + c.at));
    if (s.cam === 'hide') {
      assert.deepEqual(castOf(id, 'player').map(c => [c.at, c.pose]), [['weeds-1', 'crouch']], id);
      frames[id].scene.cast.filter(c => ['tallyheart', 'riffle'].includes(c.who)).forEach(c => assert.deepEqual([c.at, c.pose], ['weeds-2', c.who === 'riffle' ? 'scramble' : 'crouch'], id));
    }
    if (s.cam === 'brag') assert.ok(!frames[id].scene.cast.some(c => CATS.includes(c.who)), id + ': no cat of the Clan on `brag`');
  });
  assert.deepEqual([camOf(HOLES), frames[HOLES].scene.cast], ['tracks/wide', []], 'the bank, nobody in it yet');
  // Snatch and Snip: peeking out of their holes when they pop out, sitting up to squabble; Snatch's mouse always
  // sitting up just out of their holes, long and thin, Snatch's mouse in his paws (the review: peeking, the lip hid all but a speck)
  F2(/^Out of two holes pop/).forEach(id => assert.deepEqual(['snatch', 'snip'].map(w => castOf(id, w)[0]).map(c => [c.pose, c.at]), [['up', 'hole-1'], ['up', 'hole-2']], id));
  // the stash: our cat at its mouth (the friend at `watch`), then inside (`stash-in`), then close on the glass
  // with the corner of her face at the edge (`near`)
  TWINS.find(([t]) => /^Now’s your chance/.test(T(t))).forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => [c.who, c.at]).sort(), [['player', 'stash-mouth'], [castOf(id, 'tallyheart').length ? 'tallyheart' : 'riffle', 'watch']].sort(), id));
  ids.filter(id => camOf(id) === 'tracks/stash').forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => [c.who, c.at]), [['player', 'stash-in']], id));
  const glass = ids.find(id => frames[id].card === 'glass');
  assert.deepEqual([camOf(glass), castOf(glass, 'player').map(c => c.at)], ['tracks/stash-close', ['near']]);
  assert.deepEqual(ids.filter(id => frames[id].scene.opts.tap === 'stash'), [F(/A tight squeeze\. In you go!$/), F(/^Your paws go silent\. Not one weasel stirs\.$/)]);
  ids.filter(id => frames[id].scene.opts.tap === 'stash').forEach(id => assert.deepEqual(frames[id].scene.cast.map(c => [c.who, c.at]), [['player', 'stash-mouth']], id + ': the friend out of this close shot'));
  // the sneeze: the leaf in her paws, then her eyes squeezed shut at the mouth
  const achoo = ids.find(id => frames[id].sfx === 'ACHOO!');
  assert.deepEqual(castOf(achoo, 'player').map(c => [c.at, c.squeeze, c.holds]), [['stash-mouth', true, 'leaf']]);
  // the fox's brag on `brag` (the weasels on the slope looking up), Reynard's poses as the spec has them
  const brag = ids.filter(id => camOf(id) === 'tracks/brag');
  assert.deepEqual(brag.map(id => castOf(id, 'reynard')[0].pose), ['chest', 'comb', 'chest', 'sit', 'flap', 'chest', 'trot']);
  brag.forEach(id => assert.deepEqual(['snip', 'snatch'].map(w => castOf(id, w)[0].at), ['slope-1', 'slope-2'], id));
  assert.deepEqual(F2(/^Then a smell you know\./).map(id => castOf(id, 'reynard')[0].pose), ['trot', 'trot'], 'along the tracks trots Reynard');
});

test('staging, home and the den: behind the pile at night, the leaf put down and open, the friend gone home and Tallyheart waiting; nose to nose; her tail straight up; her nest at bedtime with her glass under the moss, the half moon in the doorway on the last panels; the paws, the snoring, half asleep', () => {
  const home = ids.filter(id => frames[id].scene.set === 'pile' && at(id) >= at(HOME));
  home.forEach(id => {
    assert.deepEqual(frames[id].scene.fx, ['night'], id);
    // behind the pile, as the spec has every home panel (the review: on `low`, the pile seen from the front, the
    // guards vanished and the camera jumped round): `rear` with the guards at the front, or close at the tunnel's
    // mouth (`hole`, the back row's backs along the top: the front is out of sight), never the pile's front
    assert.ok(['rear', 'hole'].includes(frames[id].scene.cam), id + ': ' + frames[id].scene.cam);
    if (frames[id].scene.cam === 'rear') {
      assert.deepEqual(frames[id].scene.opts, { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tunnel: true }, id);
      assert.deepEqual(castOf(id, 'clancat').map(c => c.at), ['guard-1', 'guard-2', 'guard-3'], id + ': the guards at the front');
    } else {
      assert.deepEqual(frames[id].scene.opts, { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }, id);
      assert.deepEqual(castOf(id, 'tallyheart').map(c => [c.at, c.facing]), [[TALK, 'left']], id + ': Tallyheart across the mouth from her');
      assert.ok(castOf(id, 'player').every(c => (c.at === 'brink' || same(c.at, LEAN)) && c.facing === 'right'), id + ': our cat at the brink, facing her');
    }
    assert.ok(castOf(id, 'tallyheart').length || /^At the hedge, Riffle waves goodbye\./.test(T(id)), id + ': Tallyheart is there on both paths, once Riffle has gone home');
  });
  // the leaf: in her paws (the Tap) and then open, the piece shining, on each path
  assert.deepEqual(home.filter(id => frames[id].scratch).map(id => castOf(id, 'player')[0]).map(c => [c.holds, c.holdAt, c.tap]), [['leaf', 'paws', 'leaf'], ['leaf', 'paws', 'leaf']]);
  home.filter(id => frames[id].scratch).forEach(id => assert.equal(castOf(frames[id].scratch.next, 'player')[0].holds, 'glass', id));
  // nose to nose: their heads side by side, close, on the same level
  const r = A.render(frames[WARM].scene, { look: E.defaultLook(0) }), ti = frames[WARM].scene.cast.findIndex(c => c.who === 'tallyheart'), pi = frames[WARM].scene.cast.findIndex(c => c.who === 'player');
  assert.ok(Math.abs(r.heads[pi].x - r.heads[ti].x) < 2 * r.heads[ti].r + 4 && Math.abs(r.heads[pi].x - r.heads[ti].x) > r.heads[ti].r, 'nose to nose: ' + JSON.stringify([r.heads[ti], r.heads[pi]]));
  assert.ok(r.heads[pi].x < r.heads[ti].x && Math.abs(r.heads[pi].y - r.heads[ti].y) < 2 * r.heads[ti].r, 'face to face, not one over the other');
  assert.deepEqual(castOf(F(/^Your tail goes straight up\./), 'player').map(c => [c.pose, c.mood, c.tailUp]), [['sit', 'proud', true]]);
  assert.deepEqual(castOf(F(/^Behind the pile, a big ginger shape/), 'tallyheart').map(c => c.mood), ['worried'], 'more worried than cross');
  // Riffle waves at the hedge's edge, never where Tallyheart sits on the next panel (the review: he seemed to turn into her)
  assert.deepEqual(castOf(F(/^At the hedge, Riffle waves goodbye\./), 'riffle').map(c => c.at), [HEDGE]);
  assert.ok(HEDGE.x - A.sceneInfo('pile').anchors.rear['rear-2'].x > 200, 'well clear of rear-2');
  // the den at bedtime
  const den = ids.filter(id => frames[id].scene.set === 'den' && at(id) >= at(NEST));
  den.forEach(id => {
    const o = frames[id].scene.opts;
    assert.deepEqual([o.weather, o.stone, o.bark, o.hidden, o.glass], ['clear', 'auto', 'auto', true, true], id + ': her glass under the moss from now on');
    assert.ok(frames[id].scene.fx.includes('night'), id);
    // lying awake looking out of the doorway at the stars and the half moon, she faces it (right); else left
    castOf(id, 'player').forEach(c => assert.deepEqual([c.at, c.facing], ['nest', c.pose === 'lie' && c.mood === 'wonder' ? 'right' : 'left'], id));
    castOf(id, 'snorer').forEach(c => assert.deepEqual([c.at, c.facing], ['sleeper-1', 'right'], id));
    // the half moon in the doorway's sky from bedtime on, as it has shone since dusk (the review: it came and went),
    // wherever the camera shows the doorway; the nest's close-ups show no sky
    assert.equal(o.moon, frames[id].scene.cam !== 'nest' ? 8 : false, id + ': the half moon in the doorway’s sky');
  });
  assert.deepEqual(castOf(NEST, 'player').map(c => c.pose), ['lie'], 'lying, so the stone is by her nose or under her chin');
  const bed = ids.find(id => frames[id].skip && frames[id].skip.who && frames[id].skip.who[0].who === 'snorer');
  assert.deepEqual([camOf(bed), castOf(bed, 'snorer').length, castOf(bed, 'player').length], ['den/inside', 1, 1]);
  assert.ok(frames[F(/^Soon he’s snoring\./)].scene.fx.includes('zzz'));
  assert.deepEqual(castOf(F(/You curl up tight, warm and safe, and sleep\.$/), 'player').map(c => [c.pose, c.mood, c.asleep]), [['curl', 'kind', 'half']]);
  const end = frames[ids[ids.length - 1]];
  assert.ok(end.scene.fx.includes('night') && end.scene.cast.some(c => c.who === 'player' && c.at === 'nest'), 'she is in her nest');
  assert.equal(end.caption[end.caption.length - 1], 'End of Chapter Eight.');
  // the title panel: her nest before dawn, asleep
  assert.deepEqual([camOf(story.start), frames[story.start].scene.fx, castOf(story.start, 'player').map(c => [c.pose, c.mood])], ['den/nest', ['night', 'zzz'], [['curl', 'sleepy']]]);
});

test('the review\'s staging, pinned: her tail curls round you with the two of them together; Riffle bumps into her tail at the fork; Hail\'s round eyes shining at the log and the wire; the proof at her paws as her tail goes up; Snip sits up at her hole; the friend there on the field route', () => {
  // “Her tail curls round you.”: our cat beside Tallyheart, drawn in front of her, her head against Tallyheart's chest
  const curl = F(/^Her tail curls round you\.$/), cast = frames[curl].scene.cast, ti = cast.findIndex(c => c.who === 'tallyheart'), pi = cast.findIndex(c => c.who === 'player');
  assert.ok(ti < pi && same(cast[pi].at, LEAN) && same(cast[ti].at, TALK), 'together, our cat in front');
  const r = A.render(frames[curl].scene, { look: E.defaultLook(0) });
  assert.ok(Math.abs(r.heads[pi].x - r.heads[ti].x) < r.heads[ti].r * 2.2, 'her head against Tallyheart: ' + JSON.stringify([r.heads[ti], r.heads[pi]]));
  assert.deepEqual([cast[pi].mood, cast[ti].mood], ['happy', 'kind'], 'eyes shut, a small smile; Tallyheart kind');
  // the kept fork: Riffle behind her bumps into her tail, so she faces away from him
  const kf = FORK[1], rf = castOf(kf, 'riffle')[0], me = castOf(kf, 'player')[0], FA = A.sceneInfo('tracks').anchors.fork;
  assert.ok(FA[rf.at].x > FA[me.at].x && me.facing === 'left', 'her tail toward Riffle');
  // Hail: her big round shining eyes on her first panels (`happy` draws them shut)
  assert.equal(castOf(LOG, 'hail')[0].mood, 'wonder');
  assert.equal(castOf(F(/^Hello! Are you a cat\?/), 'hail')[0].mood, 'wonder');
  // the proof: the open leaf and its glass at her paws as her tail goes up, then under her moss
  assert.deepEqual(castOf(F(/^Your tail goes straight up\./), 'player').map(c => c.holds), ['glass']);
  // the reveal: both weasels sit up at their holes (Snip `stand` lay along her hole's lip)
  assert.deepEqual(['snatch', 'snip'].map(w => castOf(F(/Thin brown fur, like the tuft at the Crossing\./), w)[0].pose), ['up', 'up']);
  // the friend in every panel of the field route before Hail's scene
  const field = ids.filter(id => frames[id].scene.set === 'field' && at(id) < at(frames[LOG].choice.options[0].next) && at(id) > at(frames[ROUTE].choice.options[1].next));
  field.filter(id => frames[id].scene.cast.some(c => c.who === 'player')).forEach(id => assert.ok(frames[id].scene.cast.some(c => ['tallyheart', 'riffle'].includes(c.who)), id + ': the friend beside her'));
});

test('the final review\'s staging, pinned: our cat dry at the Barking Field, flat in the grass for the sneak; Hail\'s first appearance clear of the dogs and of the BOING; the mouthed WEASELS a caption; the dogs\' bounce on their own panel; pleased with herself after the glare or the tongue; Riffle waving at the hedge', () => {
  const FA = A.sceneInfo('field').anchors.dogs, look = E.defaultLook(0);
  // the sneak: our cat flat ahead of the friend, in the grass the set draws at the path's edge, never on its puddle;
  // with Hail she sits just left of it, talking to her at the wire
  F2(/^You drop flat in the grass\./).forEach(id => {
    assert.deepEqual(castOf(id, 'player').map(c => [c.pose, c.at]), [['flat', FLAT]], id);
    const friend = frames[id].scene.cast.find(c => ['tallyheart', 'riffle'].includes(c.who));
    assert.ok(FA[friend.at].x < FLAT.x, id + ': the friend behind her, toward home');
    assert.match(A.render(frames[id].scene, { look }).svg, /data-part="grassy-edge"/, id + ': in the grass at the path\'s edge');
  });
  const talk = [F(/^SPRINKLE\? Is she safe\?/), F(/^Want to get past the dogs\? Watch THIS!$/)];
  talk.forEach(id => assert.deepEqual(castOf(id, 'player').map(c => [c.pose, c.at]), [['sit', BY_WIRE]], id));
  ids.filter(id => frames[id].scene.set === 'field' && frames[id].scene.cam === 'dogs').forEach(id => assert.ok(!castOf(id, 'player').some(c => /^trail-/.test(c.at)), id + ': our cat is never at the weasels\' spots, on the puddle'));
  // Hail's first appearance: nobody in front of her at the wire; the spotty dog far back by the log, coming after her;
  // her round eyes; the BOING up over the trees, clear of her head and body
  const boing = [F(/^Out bounces a little dragonet.*Another one!/), F(/^Out bounces a little dragonet.*ANOTHER dragon!/)];
  assert.deepEqual(boing.map(id => frames[id].when), [TOLD, KEPT]);
  boing.forEach(id => {
    const sc = frames[id].scene, hail = castOf(id, 'hail')[0];
    assert.deepEqual([hail.pose, hail.mood, hail.at], ['bounce', 'wonder', 'wire'], id);
    assert.deepEqual(castOf(id, 'dog').map(c => [c.variant, c.at]), [[1, 'dog-1'], [2, 'field'], [3, 'dog-3']], id + ': the spotty dog far back');
    assert.ok(!sc.cast.some(c => c.who === 'dog' && Math.abs(FA[c.at].x - FA.wire.x) < 180 && FA[c.at].y >= FA.wire.y - 40), id + ': no dog beside her at the wire');
    const r = A.render(sc, { look }), hh = r.heads[sc.cast.indexOf(hail)];
    assert.deepEqual(frames[id].sfxAt, [55, 32], id);
    assert.ok(hh.y - hh.r > 32 + 12, id + ': the BOING above her head: ' + JSON.stringify(hh));
  });
  // the kept path's “WEASELS”: mouthed, without a sound, so a caption (no balloon to read aloud as his)
  const mouthed = F(/^Out of two holes pop two skinny shapes.*Riffle mouths, without a sound\.$/);
  assert.deepEqual([frames[mouthed].caption, frames[mouthed].say], [['Out of two holes pop two skinny shapes: long, thin and quick.', '“WEASELS,” Riffle mouths, without a sound.'], undefined]);
  assert.ok(!E.balloons(frames[mouthed], catFor({ ch3Told: false })).some(b => b.who === 'riffle'), 'no balloon of his');
  // the chase without Hail: “They bounce along the fence” with the dogs who leap up, so the next panel's “They” is the weasels
  const leap = F(/^Inside the fence, three dogs leap up\./), skid = F(/^Snip and Snatch skid to a stop\./);
  assert.deepEqual(frames[leap].caption, ['Inside the fence, three dogs leap up.', 'They bounce along the fence, barking their heads off.']);
  assert.deepEqual(frames[skid].caption, ['Snip and Snatch skid to a stop. They spin round, and run all the way back.']);
  assert.equal(num(skid) - num(leap), 2, 'the leap, then (with Hail, its twin), then the skid');
  // the glare and the tongue share one outcome: true after either, so she is pleased with herself, not laughing
  FOX.forEach(id => { const out = frames[id].choice.options[0].next; assert.equal(castOf(out, 'player')[0].mood, 'proud', out); });
  // Riffle waves goodbye at the hedge: up tall, a forepaw raised by his cheek (`hop`; his `point` points at the ground)
  assert.deepEqual(castOf(F(/^At the hedge, Riffle waves goodbye\./), 'riffle').map(c => [c.pose, c.at]), [['hop', HEDGE]]);
});

test('the time of day runs night (the title, and the told path waking), morning (the pile, the Hollow), day (the Old Bridge, kept), dusk (the pile), night (round the back, the trail, home, the den)', () => {
  for (const c of COMBOS) {
    const p = walk(c.flags, c.o);
    const tods = p.map(id => {
      const t = frames[id].scene.fx.filter(e => TOD.includes(e));
      assert.equal(t.length, 1, id + ': exactly one time of day in fx');
      return TOD.indexOf(t[0]);
    });
    const firstMorning = tods.indexOf(0);
    assert.ok(tods.slice(0, firstMorning).every(t => TOD[t] === 'night'), comboName(c) + ': night before the morning count');
    for (let i = firstMorning + 1; i < p.length; i++) assert.ok(tods[i] >= tods[i - 1], p[i] + ' goes back in time');
  }
  const tod = id => frames[id].scene.fx.find(e => TOD.includes(e));
  const BY_SET = { den: ['night'], pile: ['morning', 'dusk', 'night'], hollow: ['morning'], bridge: ['day'], tracks: ['night'], field: ['night'] };
  ids.forEach(id => assert.ok(BY_SET[frames[id].scene.set].includes(tod(id)), id + ': ' + frames[id].scene.set + ' at ' + tod(id)));
  assert.deepEqual(ids.filter(id => tod(id) === 'dusk'), [DUSK]);
  assert.ok(ids.filter(id => frames[id].scene.set === 'pile' && at(id) > at(DUSK)).every(id => tod(id) === 'night'));
  assert.deepEqual(ids.filter(id => frames[id].scene.fx.includes('skyriver')), [], 'tonight the half moon, not the Sky River');
});

test('the storyboard is this chapter’s: every frame, the panels a read-through as a reader walks them, every frame shown only to some readers saying so', () => {
  const sb = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch08.md'), 'utf8');
  assert.match(sb, /^# Storyboard: Chapter 8, The Night Trail\n/);
  assert.doesNotMatch(sb, /\bSTUB\b|undefined|NaN|\[object/);
  ids.forEach(id => assert.ok(new RegExp('^(### ' + id + ' · panel \\d+|#####+ ' + id + ')\\b', 'm').test(sb), 'the storyboard has ' + id));
  ids.forEach(id => assert.equal((sb.match(new RegExp('^#+ ' + id + '\\b', 'gm')) || []).length, 1, id + ': once'));
  assert.ok(sb.includes('| Frames | ' + ids.length + ' ('), 'every frame counted');
  ids.forEach(id => assert.ok(sb.includes('**Shot.** ' + frames[id].board), id + ': its board'));
  const lens = COMBOS.flatMap(c => [0, 1].map(light => walk(c.flags, Object.assign({ light }, c.o)).length));
  const m = /\| One read-through \| (\d+)–(\d+) panels/.exec(sb);
  assert.ok(m && +m[1] === Math.min(...lens) && +m[2] <= Math.max(...lens) && +m[2] >= Math.max(...lens) - 1, 'a read-through is ' + Math.min(...lens) + '–' + Math.max(...lens) + ' panels (the storyboard: ' + (m && m.slice(1).join('–')) + '; it reads no dragonet found before)');
  assert.ok(sb.includes('| Choices | 7 |') && sb.includes('| Case File cards | 4 (2 eyes, 2 ears) |'), 'seven choice frames, four cards');
  assert.ok((sb.match(/^\*\*Shows only if\*\* /gm) || []).length >= ids.filter(id => frames[id].when).length);
  // the art's new names, in the storyboard's own words
  ['weasel', 'Hail', 'the tracks', 'stash', 'glass', 'tunnel'].forEach(w => assert.match(sb, new RegExp(w)));
  assert.match(sb, /For a reader whose foundHail is true, the option reads: “?“Go and see Hail again\.”/);
  assert.match(sb, /Tallyheart \(crouching, (?:full of wonder|wondering|wide-eyed|wonder)[^,]*, at a spot of this frame’s own \(x 1250, y 896\), facing left\)/);
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(camOf));
  assert.ok(pairs.size >= 25, 'only ' + pairs.size + ' set/camera pairs');
  const sets = new Set(ids.map(id => frames[id].scene.set));
  // one new place, the bank by the tracks (with the tunnel's inside and the stash as its cameras)
  assert.deepEqual([...sets].sort(), ['bridge', 'den', 'field', 'hollow', 'pile', 'tracks']);
  TRACKS_CAMS.forEach(cam => assert.ok(ids.some(id => camOf(id) === 'tracks/' + cam), 'the tracks’ ' + cam));
  ['wide', 'dogs', 'fence'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'field/' + cam), 'the field’s ' + cam));
  ['rows', 'gap', 'wide', 'rear', 'hole'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'pile/' + cam), 'the pile’s ' + cam));
  ['wide', 'lesson', 'sand', 'tree'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'hollow/' + cam), 'the Hollow’s ' + cam));
  ['nest', 'inside', 'doorway'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'den/' + cam), 'the den’s ' + cam));
  // along any path a reader can take, never five panels in a row from the same camera
  for (const c of COMBOS) for (const light of [0, 1]) {
    const p = walk(c.flags, Object.assign({ light }, c.o));
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
  const cat = Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose', ch3Told: true, foundHail: true, ch7Flew: true } });
  Object.keys(ch04.cards).forEach((cid, i) => E.giveCard(cat, cid, 'ch04', i + 1));
  CH6_CARDS.concat(CH7_CARDS).forEach((cid, i) => E.giveCard(cat, cid, 'ch07', 20 + i));
  CARD_IDS.forEach((cid, i) => E.giveCard(cat, cid, 'ch08', 40 + i));
  // (small at the distance of a wide shot, the den, the field's fence and the bank; the weasels, the tiny dog,
  // Hail at the log and the fox on the rails are small by design)
  const SMALL = (id, who) => ['dog', 'snip', 'snatch', 'reynard', 'coil'].includes(who) || (who === 'hail' && camOf(id) !== 'field/fence') ||
    ['pile/wide', 'pile/rows', 'pile/rear', 'hollow/wide', 'den/inside', 'den/doorway', 'bridge/back', 'field/wide', 'field/dogs', 'field/fence', 'tracks/wide', 'tracks/hide', 'tracks/holes', 'tracks/crawl', 'tracks/fork', 'tracks/stash'].includes(camOf(id));
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
  // the page of seven Counts: Tallyheart glows (the one to tap), the marks unchanged
  const ask = ids.find(id => frames[id].ask);
  for (let n = 0; n <= 7; n++) { const svg = A.render(E.resolveScene(E.askScene(frames[ask].scene, frames[ask].ask, n), cat, STORIES), { look: looks[0] }).svg; assert.ok(svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg)); if (!n) assert.match(svg, /pc-next/); }
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
  // the skip-counts' pictures are the art's own: one cat's two pairs of paws, five cats side-on, two cats
  const picOf = (id, n) => A.countsPicture(Object.assign({ look: looks[0] }, E.skipPicture(frames[id].skip, n)));
  const [pairs, rimPaws, bed] = ids.filter(id => frames[id].skip);
  assert.match(picOf(pairs, 0), /One cat: two front paws and two back paws/);
  assert.match(A.countsPicture(Object.assign({ look: looks[0] }, E.lessonPicture(E.questionDef(Object.assign({ id: 'ch08-hail' }, story.counts['ch08-hail']), { a: 4, b: 4, answer: 16, table: 4, per: 4, groups: 4 }, story, STORIES), { a: 4, b: 4, answer: 16, table: 4, per: 4, groups: 4 }, 0))), /4 animals, four paws each/);
  [rimPaws, bed].forEach(id => assert.match(picOf(id, 0), /pc-/, id));
  // her nest at bedtime: her cards along it, the secrets under the moss with her glass, a corner for each
  const nest = E.resolveScene(frames[NEST].scene, cat, STORIES).opts;
  assert.ok(Array.isArray(nest.bark) && nest.bark.length >= 10 && nest.hidden === true && nest.glass === true);
  assert.match(A.render(E.resolveScene(frames[NEST].scene, cat, STORIES), { look: looks[0] }).svg, /data-prop="nest-glass"/);
});

/* ------------------------------------------------------------------ the beats the chapter must have */

test('the chapter’s beats are all there, in order, on every path: every reader’s panels are exactly her night’s, one after another, and nothing else', () => {
  // A beat is one panel: [label, what it says (every variant, in order), what else must be true of it]. Each
  // frame of the chapter is one beat, named here by its id, and each beat's words are the frame's own.
  const B = (label, re, also) => [label, id => re.test(T(id)) && (!also || !!also(frames[id], id))];
  const set = s => f => f.counts && f.counts.set === s;
  const told = f => same(f.when, TOLD), kept = f => same(f.when, KEPT);
  const tap = name => f => f.scratch && f.scratch.tap === name;
  const out = (from, i) => (f, id) => id === frames[from].choice.options[i].next;
  const BEAT = {
    f001: B("chapter 8 the night trail", /^Chapter 8: The Night Trail$/),
    f002: B("a paw pokes you awake (told)", /^A paw pokes you awake\. It’s still dark\. Psst\. \{name\}paw\.$/, told),
    f003: B("tallyhearts eyes are shining they (told)", /^Tallyheart’s eyes are shining\. They CAME\. I lay by the roots with my eyes shut, like a sleepy old cat\. Scrape, scrape\. Then bump, bump, bump, bump: four pieces of prey, going DOWN the hole\.$/, told),
    f004: B("did you pounce no if (told)", /^Did you pounce\? No\. If we pounce here, we’ll never find where our prey GOES\. I followed the sound as far as the hedge\. It went on, toward the train tracks\.$/, told),
    f005: B("by the prey pile the (kept)", /^By the prey pile, the last guards are yawning\. Nothing\. We saw NOTHING\. Not one thing\.$/, kept),
    f006: B("at sunrise the whole clan", /^At sunrise, the whole Clan is waiting by the pile\. \{name\}paw\. The count, please\.$/, f => set('ch08-pile')(f)),
    f007: B("the back row is still", /^The back row is still in the brambles’ shadow\.$/, f => tap('back')(f)),
    f008: B("right in the middle of", /^Right in the middle of the back row: four empty spaces\. Four gone\. Still tidy\.$/),
    f009: B("the guards look at their", /^The guards look at their paws\. Nobody here is to blame\. Seven nights now\. Four a night, for SEVEN nights\? That’s more than I’ve got WHISKERS\.$/),
    f010: B("in the training hollow five", /^In the Training Hollow, five cats sit up on the rim\. Four a night\? That’s a job for the fours\. But first, sixes, to wake up your whiskers\.$/, f => set('ch08-sixes')(f)),
    f011: B("todays count is right under", /^Today’s Count is right under you\. What has every cat got FOUR of\?$/),
    f012: B("you look down paws", /^You look down\. PAWS!$/),
    f013: B("four paws on every cat", /^Four paws on every cat\.$/),
    f014: B("she stands so you can", /^She stands so you can see all of hers\. Count mine\.$/),
    f015: B("two front paws two back", /^Two front paws\. Two back paws\. A four is two twos\. Two twos! Like a six is two threes! Exactly\. Doubling, AGAIN\.$/),
    f016: B("one by one the cats", /^One by one, the cats on the rim hop down and pad past you\. Hop by fours\. Four paws on every cat\.$/),
    f017: B("twenty now a secret you", /^Twenty! Now, a secret\. You already know most of the fours\. One from every mark on this tree\. I DO\?$/),
    f018: B("seven of them you knew", /^Seven of them you knew already\. Only three are new: the paws of four cats, seven cats and eight cats\. For those, hop from one you know\. Or count the front paws, and double it!$/, f => set('ch08-fours')(f)),
    f019: B("tallyheart stretches up the leaning", /^Tallyheart stretches up the leaning tree\. An eighth claw mark\. SKRITCH!$/),
    f020: B("paws thats your eighth count", /^Paws\. That’s your eighth Count\. Not one miss! Not one\. The fours are yours now\. Some were tricky\. You worked every one out\. Tomorrow, the new ones will be old ones\.$/),
    f021: B("now lets count whats gone", /^Now\. Let’s count what’s gone\.$/),
    f022: B("in the sand she scratches", /^In the sand she scratches four marks for every night\. Seven nights\.$/, f => set('ch08-gone')(f)),
    f023: B("twenty-eight tonight we follow them (told)", /^Twenty-eight\. Tonight, we follow them all the way\. Just us\? Just us\. Not a word to the Clan yet\. Nap this afternoon\. A night trail needs sharp eyes\.$/, told),
    f024: B("twenty-eight and not one guard (kept)", /^Twenty-eight\. And not one guard saw a thing\. Off you go\. Back by sunset\.$/, kept),
    f025: B("you know why they come (kept)", /^You know why: they come from UNDER! But you can’t say so\. Not without telling everything\.$/, kept),
    f026: B("at the old bridge you (kept)", /^At the Old Bridge, you check the bank first\. No ginger ears\. Riffle is there, with fish for Sprinkle\.$/, f => kept(f) && tap('ears')(f)),
    f027: B("a tunnel under your pile (kept)", /^A TUNNEL\? Under your PILE\?$/, kept),
    f028: B("quietly pile (kept)", /^Quietly\. …pile\.$/, kept),
    f029: B("granny says the bank by (kept)", /^Granny says the bank by the tracks is full of holes\. Something RUDE lives in them\. I’m COMING! Be careful\. And come back and TELL me\.$/, kept),
    f030: B("the sun goes down and", /^The sun goes down, and the first guards take their places, facing out\. High in the sky, the moon is already out: a bright half moon\. The camp turns silver\.$/, f => tap('back')(f)),
    f031: B("behind the back row tallyheart (told)", /^Behind the back row, Tallyheart is waiting by the round, dark hole\.$/, told),
    f032: B("behind the back row a (kept)", /^Behind the back row, a wet nose pokes through the hedge\. Riffle! And there’s the round, dark hole, under the roots\.$/, kept),
    f033: B("two ways to the tracks (told)", /^Two ways to the tracks\. Through their tunnel, or around the Barking Field\. Your trail\. You choose\.$/, told),
    f034: B("two ways to the tracks (kept)", /^Two ways to the tracks\. Through the tunnel, or around the Barking Field\.$/, kept),
    f035: B("he pokes his head in (kept)", /^He pokes his head in\. I’d fit\. Otters are bendy\.$/, kept),
    f036: B("a small cat could just", /^A small cat could just squeeze in\. A small cat like you\. Neither way is wet\. You check twice\.$/, f => f.choice),
    f037: B("tallyheart pokes her head in (told)", /^Tallyheart pokes her head in, just to see\. Her shoulders stick\. Hmph\. Just as I thought\. You go under\. I’ll go over\. Listen for me\.$/, f => told(f) && tap('mouth')(f)),
    f038: B("you first you found it (kept)", /^You first\. You found it!$/, f => kept(f) && tap('mouth')(f)),
    f039: B("inside its just wide enough", /^Inside, it’s just wide enough for you\. And dark\. But cats see well in the dark, even pillow cats\. Roots\. Earth\. And the smell of mice\. You fit PERFECTLY\. Small cats fit where big cats can’t!$/),
    f040: B("in the soft earth tiny (told)", /^In the soft earth: tiny prints, coming and going\. Is Tallyheart still up there\?$/, f => told(f) && tap('paw')(f)),
    f041: B("from above very faint forty-one (told)", /^From above, very faint: “Forty-one\. Forty-two\. Forty-three…” It’s Tallyheart, counting her pawsteps over your head\. You grin in the dark\.$/, told),
    f042: B("in the soft earth tiny (kept)", /^In the soft earth: tiny prints, coming and going\. Riffle comes in after you\. He doesn’t squeeze\. He POURS\. Then: Um\. I’m stuck\.$/, f => kept(f) && tap('paw')(f)),
    f043: B("otters are bendy mostly pop (kept)", /^Otters are bendy\. Mostly\. POP!$/, kept),
    f044: B("are we nearly there no (kept)", /^Are we nearly there\? No\. Are we nearly there NOW\?$/, kept),
    f045: B("the tunnel splits in two (told)", /^The tunnel splits in two\. Which way\? Far above: “A hundred and ten\. A hundred and eleven…” Tallyheart is still counting\.$/, f => told(f) && f.choice),
    f046a: B("worms just worms the other (told 0)", /^Worms\. Just worms\. The other way, then!$/, out(FORK[0], 0)),
    f046b: B("mice lots of mice this (told 1)", /^Mice! LOTS of mice\. This way!$/, out(FORK[0], 1)),
    f047: B("the tunnel splits in two (kept)", /^The tunnel splits in two\. Which way\?$/, f => kept(f) && f.choice),
    f048a: B("worms just worms the other (kept 0)", /^Worms\. Just worms\. The other way, then!$/, out(FORK[1], 0)),
    f048b: B("mice lots of mice this (kept 1)", /^Mice! LOTS of mice\. This way!$/, out(FORK[1], 1)),
    f049: B("on and on you go", /^On and on you go\. Then, right over your head, something snores\. Something doggy\. “Mmmf\. Squirrel,” it mumbles\. “Who’s a Good Boy\? ME\.” “Drop it,” mumbles another\. “That’s my NAME\.” You’re right under the Barking Field!$/),
    f050: B("at last moonlight you wriggle (told)", /^At last: moonlight! You wriggle out at the foot of a high bank\. So THAT’S where it comes out! Tallyheart is sitting right there\. Three hundred and twelve pawsteps\. And I tiptoed round the dogs\.$/, told),
    f051: B("at last moonlight you wriggle (kept)", /^At last: moonlight! You wriggle out at the foot of a high bank\. So THAT’S where it comes out! Riffle pops out behind you, earth on his nose\. Ta-DA! SHH!$/, kept),
    f052: B("then we go together round (told)", /^Then we go together\. Round the near side\. Not one paw past the post\.$/, told),
    f053: B("round the near side not (kept)", /^Round the near side\. Not one paw past the post\.$/, kept),
    f054: B("the barking field is silver (told)", /^The Barking Field is silver in the moonlight\. Inside the fence, three dogs are asleep in a heap\. Tallyheart pads beside you, quiet as moss\. Snore\. Snore\. Snore\.$/, told),
    f055: B("the barking field is silver (kept)", /^The Barking Field is silver in the moonlight\. Inside the fence, three dogs are asleep in a heap\. Riffle pads beside you, not saying a word\. For once\. Snore\. Snore\. Snore\.$/, kept),
    f056: B("one ear twitches whos there (told)", /^One ear twitches\. WHO’S THERE\?$/, told),
    f057: B("one ear twitches whos there (kept)", /^One ear twitches\. WHO’S THERE\?$/, kept),
    f058: B("a squirrel its a cat", /^A SQUIRREL! It’s a CAT\. A cat is just a BIG squirrel!$/),
    f059: B("im good boy thats my", /^I’m GOOD BOY! That’s my NAME! I’m DROP IT!$/),
    f060: B("the third one just barks (told)", /^The third one just barks\. He forgets his name a lot\. That’s what their Tall Ones shout at them all day\. So that’s what they think their names are\.$/, told),
    f061: B("the third one just barks (kept)", /^The third one just barks\. He forgets his name a lot\. That’s what their Tall Ones shout at them all day\. So that’s what they think their names are\.$/, kept),
    f062: B("from the hollow log far", /^From the hollow log far inside the fence, a white head pops up\. Ooh! Visitors!$/, f => f.choice),
    f063: B("the white head ducks back", /^The white head ducks back in\.$/),
    f064: B("you drop flat in the (sneaking, told)", /^You drop flat in the grass\. Your paws go silent\. The dogs sniff and sniff\. Where did the squirrel GO\?$/, f => same(f.when, SNEAK_TOLD) && tap('path')(f)),
    f065: B("you drop flat in the (sneaking, kept)", /^You drop flat in the grass\. Your paws go silent\. The dogs sniff and sniff\. Where did the squirrel GO\?$/, f => same(f.when, SNEAK_KEPT) && tap('path')(f)),
    f066: B("up onto the fence top (climbing, told)", /^Up onto the fence top you go, and along it, light as a leaf\. Dogs can’t climb! All three bark at your tail, and nobody watches the ground\.$/, f => same(f.when, CLIMB_TOLD) && tap('path')(f)),
    f067: B("up onto the fence top (climbing, kept)", /^Up onto the fence top you go, and along it, light as a leaf\. Dogs can’t climb! All three bark at your tail, and nobody watches the ground\.$/, f => same(f.when, CLIMB_KEPT) && tap('path')(f)),
    f068: B("hello dogs (friends, told)", /^Hello, dogs!$/, f => same(f.when, FRIENDS_TOLD)),
    f069: B("the dogs stop nobody ever (friends, told)", /^The dogs stop\. Nobody ever says HELLO to us\.$/, f => same(f.when, FRIENDS_TOLD)),
    f070: B("while all three wag you (friends, told)", /^While all three wag, you trot past\.$/, f => same(f.when, FRIENDS_TOLD) && tap('path')(f)),
    f071: B("hello dogs (friends, kept)", /^Hello, dogs!$/, f => same(f.when, FRIENDS_KEPT)),
    f072: B("the dogs stop nobody ever (friends, kept)", /^The dogs stop\. Nobody ever says HELLO to us\.$/, f => same(f.when, FRIENDS_KEPT)),
    f073: B("while all three wag you (friends, kept)", /^While all three wag, you trot past\.$/, f => same(f.when, FRIENDS_KEPT) && tap('path')(f)),
    f074: B("tallyheart flicks a pinecone over (fetch, told)", /^Tallyheart flicks a pinecone over the fence\. FETCH!$/, f => same(f.when, {"specialty":["noticing","swimming"],"ch3Told":true})),
    f075: B("three dogs race after it (fetch, told)", /^Three dogs race after it\. MINE! No, MINE!$/, f => same(f.when, {"specialty":["noticing","swimming"],"ch3Told":true})),
    f076: B("drop it i am drop (fetch, told)", /^Drop it! I AM Drop It!$/, f => same(f.when, {"specialty":["noticing","swimming"],"ch3Told":true}) && tap('path')(f)),
    f077: B("riffle flicks a pebble over (fetch, kept)", /^Riffle flicks a pebble over the fence\. FETCH!$/, f => same(f.when, {"specialty":["noticing","swimming"],"ch3Told":false})),
    f078: B("three dogs race after it (fetch, kept)", /^Three dogs race after it\. MINE! No, MINE!$/, f => same(f.when, {"specialty":["noticing","swimming"],"ch3Told":false})),
    f079: B("drop it i am drop (fetch, kept)", /^Drop it! I AM Drop It!$/, f => same(f.when, {"specialty":["noticing","swimming"],"ch3Told":false}) && tap('path')(f)),
    f080: B("out bounces a little dragonet (told)", /^Out bounces a little dragonet, white with grey speckles, right up to the fence\. The dogs bound after her, wagging\. Another one! BOING\. BOING\. BOING\.$/, told),
    f081: B("out bounces a little dragonet (kept)", /^Out bounces a little dragonet, white with grey speckles, right up to the fence\. The dogs bound after her, wagging\. ANOTHER dragon! BOING\. BOING\. BOING\.$/, kept),
    f082: B("hello are you a cat", /^Hello! Are you a cat\? I’m a dog\. Well, the dogs THINK I’m a dog\. Do I look like a dog\? Why is your tail so SWISHY\? Can I touch it\?$/),
    f083: B("want a riddle heres one", /^Want a riddle\? Here’s one! Three dogs, and me\. That’s four of us\. Four paws each!$/, f => set('ch08-hail')(f)),
    f084: B("im hail mama says stay", /^I’m Hail! Mama says stay where you land\. So now I’m a DOG\. Are you Sprinkle’s sister\?$/),
    f085: B("sprinkle is she safe is", /^SPRINKLE\? Is she safe\? Is she\? IS she\? Under the Old Bridge\. She’s safe\.$/),
    f086: B("and ive found more of (a dragonet found before)", /^And I’ve found more of you! MORE\? WHO\? Tell me EVERYTHING!$/, f => same(f.when, {"not":{"foundSquall":false,"foundPuddle":false,"foundSleet":false,"foundWisp":false}})),
    f087: B("you tell her name by", /^You tell her, name by name\. Are you following the skinny ones\? Every night, two skinny shapes squeeze under this fence\. With MUDDY mice\. Off to the long shiny lines! Don’t they have their OWN mice\?$/),
    f088: B("want to get past the", /^Want to get past the dogs\? Watch THIS!$/),
    f089: B("hail bounces off across the", /^Hail bounces off across the field\. DOGS! Chase me!$/),
    f090: B("three dogs chase her in", /^Three dogs chase her in a big, silly circle\. Round\. And round\. And ROUND\.$/),
    f091: B("tell sprinkle five and tell (told)", /^Tell Sprinkle: five! And tell her I’m the BOUNCIEST!$/, f => told(f) && tap('path')(f)),
    f092: B("tell sprinkle five and tell (kept)", /^Tell Sprinkle: five! And tell her I’m the BOUNCIEST!$/, f => kept(f) && tap('path')(f)),
    f093: B("a high bank rises in", /^A high bank rises in the moonlight\. On top run two long, shiny lines: the train tracks\. All along the bank are holes, like the one under your pile\.$/),
    f094: B("not fox country nobodys land (told)", /^Not fox country\. Nobody’s land\. The trains own it\. Not one paw on the rails\.$/, told),
    f095: B("not fox country granny says (kept)", /^Not fox country\. Granny says it’s nobody’s land\. The trains own it\. Not one paw on the rails!$/, kept),
    f096: B("round every hole tiny prints (told)", /^Round every hole: tiny prints\. Five little toes, close together\. Voices! Squeaky ones, coming closer\.$/, f => told(f) && tap('weeds')(f)),
    f097: B("round every hole tiny prints (kept)", /^Round every hole: tiny prints\. Five little toes, close together\. Voices! Squeaky ones, coming closer\.$/, f => kept(f) && tap('weeds')(f)),
    f098: B("out of two holes pop (told)", /^Out of two holes pop two skinny shapes: long, thin and quick\. Weasels\.$/, told),
    f099: B("out of two holes pop (kept)", /^Out of two holes pop two skinny shapes: long, thin and quick\. “WEASELS,” Riffle mouths, without a sound\.$/, kept),
    f100: B("just what squall saw from", /^Just what Squall saw from his roof! Thin brown fur, like the tuft at the Crossing\. Tiny feet, like the prints in the marsh\. The thieves!$/),
    f101: B("i carried more than you", /^I carried MORE than you, Snatch! I carried a VOLE! A vole is just a fat mouse, Snip\. Two a night each, through the tunnel\. Same as ALWAYS!$/),
    f102: B("snip is the squeaky one", /^Snip is the squeaky one\. Snatch is holding a mouse\. Snatch is ALWAYS holding a mouse\. Seven nights of it! That’s… LOTS\. That’s a HUNDRED\.$/),
    f103: B("these two cant count but (told)", /^These two can’t count\. But YOU can\.$/, f => told(f) && set('ch08-snip')(f)),
    f104: B("these two cant count but (kept)", /^These two can’t count\. But YOU can\.$/, f => kept(f) && set('ch08-riffle')(f)),
    f105: B("and fourteen for snatch fourteen (told)", /^And fourteen for Snatch\. Fourteen and fourteen: twenty-eight\. That’s OUR twenty-eight! The Counts don’t lie\.$/, told),
    f106: B("and fourteen for snatch fourteen (kept)", /^And fourteen for Snatch\. Fourteen and fourteen: twenty-eight\. That’s OUR twenty-eight! The Counts don’t lie\.$/, kept),
    f107: B("then a smell you know (told)", /^Then a smell you know\. FOX\. Along the tracks trots Reynard, tail high, smiling his big smile\. The wind blows from him to you\. He can’t smell you\.$/, told),
    f108: B("then a smell you know (kept)", /^Then a smell you know\. FOX\. Along the tracks trots Reynard, tail high, smiling his big smile\. The wind blows from him to you\. He can’t smell you\.$/, kept),
    f109: B("uh-oh the tip of tallyhearts (told)", /^Uh-oh\. The tip of Tallyheart’s tail is sticking up out of the weeds!$/, f => told(f) && tap('tail')(f)),
    f110: B("uh-oh riffles tail is sticking (kept)", /^Uh-oh\. Riffle’s tail is sticking up out of the weeds!$/, f => kept(f) && tap('tail')(f)),
    f111: B("good evening my clever little", /^Good evening, my clever little paws\.$/),
    f112: B("he admires his tail and", /^He admires his tail\. And such a fine, dry den, waiting just for me\.$/),
    f113: B("clever little paws just what", /^Clever little paws\. Just what Puddle saw! A fine, dry den\. He said that at the border! A fine, dry den\. He said that at the border, and Sleet heard it too! Under the Old Bridge! When is it yours\?$/),
    f114: B("at the gathering the clans", /^At the Gathering, the Clans will chase their dragon away\. Then the den is MINE\. And their pile is OURS!$/),
    f115: B("reynard sighs weasels", /^Reynard sighs\. Weasels\.$/),
    f116: B("one shiny bit by their", /^One shiny bit by their pile\. One little story: ‘It FLEW off, by moonlight!’ And the whole Clan said DRAGON\.$/),
    f117: B("he laughs a soft little", /^He laughs, a soft little yip\. Nobody saw a thing\.$/),
    f118: B("he fluffs his tail he (told)", /^He fluffs his tail\. He is VERY pleased with himself\. You want to jump up and shout LIAR! You hold it in\. For the Gathering\.$/, f => told(f) && f.choice),
    f119: B("he doesnt see good (told)", /^He doesn’t see\. Good\.$/, told),
    f120: B("he fluffs his tail he (kept)", /^He fluffs his tail\. He is VERY pleased with himself\. You want to jump up and shout LIAR! You hold it in\. For the Gathering\.$/, f => kept(f) && f.choice),
    f121: B("he doesnt see good (kept)", /^He doesn’t see\. Good\.$/, kept),
    f122: B("nap now my little sneaks", /^Nap now, my little sneaks\. Rob later\. And keep it TIDY\.$/),
    f123: B("he trots off along the", /^He trots off along the tracks, humming\. The weasels pop down a little hole\. Soon: two tiny snores\. Squee\. Squee\.$/),
    f124: B("nows your chance you creep (told)", /^Now’s your chance\. You creep to the biggest hole\. Too small for me\. I’ll keep watch\.$/, told),
    f125: B("nows your chance you creep (kept)", /^Now’s your chance\. You creep to the biggest hole\. Riffle keeps watch\.$/, kept),
    f126: B("your paws go silent not (small)", /^Your paws go silent\. Not one weasel stirs\. A tight squeeze\. In you go!$/, f => same(f.when, {"worry":"small"}) && tap('stash')(f)),
    f127: B("your paws go silent not (not small)", /^Your paws go silent\. Not one weasel stirs\.$/, f => same(f.when, {"not":{"worry":"small"}}) && tap('stash')(f)),
    f128: B("mice and voles in tidy", /^Mice and voles, in tidy rows\. Of COURSE they’re tidy\. Some smell of your camp\. Some smell of marsh mud\. ReedClan’s prey too!$/),
    f129: B("beside the prey is a", /^Beside the prey is a heap of something that glitters in the moonlight\. It sparkles\. It shines\. It’s the shiniest thing you’ve ever seen, and your paw wants it SO much\. You keep your paw still\. You KNOW what it is\.$/),
    f130: B("smooth clear flat just like", /^Smooth\. Clear\. Flat\. Just like the “scale” behind the back row\. You saw it every day as a pillow cat\. You lived behind it: your old patio door\. It’s not a scale\. It’s GLASS\.$/),
    f131: B("tower glass the foxs one", /^Tower glass\. The fox’s “one shiny bit”! Wisp drew a fox dropping something that glittered\. Glass, like THIS! Proof\. Not for keeping\. For proof\.$/, f => tap('glass')(f)),
    f132: B("then your nose tickles the", /^Then your nose tickles\. The stash smells of weasel\. Weasel smells like very old socks\. Ah… ah…$/),
    f133: B("achoo", /^ACHOO!$/),
    f134: B("behind you snatch pokes his", /^Behind you: Snatch pokes his head out of a hole, mouse and all\. I smell CAT\. sniff, sniff\.$/),
    f135: B("you always smell cat we", /^You ALWAYS smell cat\. We ROB cats\. This one’s RIGHT HERE!$/),
    f136: B("get that cat no you (told)", /^GET THAT CAT! No, YOU get that cat! We BOTH get that cat! Run! Get the glass HOME\. Weasels can wait\.$/, f => told(f) && tap('paw')(f)),
    f137: B("get that cat no you (kept)", /^GET THAT CAT! No, YOU get that cat! We BOTH get that cat! RUN!$/, f => kept(f) && tap('paw')(f)),
    f138: B("down the bank you run (told)", /^Down the bank you run, round the near side of the field, two weasels behind you\. Come BACK! We’ll… we’ll SQUEAK at you!$/, told),
    f139: B("down the bank you run (kept)", /^Down the bank you run, round the near side of the field, two weasels behind you\. Come BACK! We’ll… we’ll SQUEAK at you!$/, kept),
    f140: B("theyre half your size theyre", /^They’re half your size\. They’re very, very LOUD\. Snatch is slow\. He won’t drop his mouse\. Drop the MOUSE! NEVER!$/),
    f141: B("inside the fence three dogs (no hail)", /^Inside the fence, three dogs leap up\. They bounce along the fence, barking their heads off\. SQUIRRELS!$/, f => same(f.when, NO_HAIL)),
    f142: B("dogs squirrels that way (hail)", /^DOGS! SQUIRRELS! THAT way!$/, f => same(f.when, HAIL)),
    f143: B("snip and snatch skid to (no hail)", /^Snip and Snatch skid to a stop\. They spin round, and run all the way back\. BYE, RUDE SQUIRRELS!$/, f => same(f.when, NO_HAIL)),
    f144: B("three dogs and one speckled (hail)", /^Three dogs and one speckled dragonet bounce along the fence, barking their heads off\. Snip and Snatch skid to a stop\. They spin round, and run all the way back\. BYE, RUDE SQUIRRELS!$/, f => same(f.when, HAIL)),
    f145: B("nobodys hurt (no hail)", /^Nobody’s hurt\.$/, f => (f => same(f.when, NO_HAIL))(f) && tap('paw')(f)),
    f146: B("nobodys hurt (hail)", /^Nobody’s hurt\.$/, f => (f => same(f.when, HAIL))(f) && tap('paw')(f)),
    f147: B("through the hedge behind the (told)", /^Through the hedge, behind the pile, you’re safe\.$/, f => told(f) && tap('leaf')(f)),
    f148: B("tallyheart looks at it for (told)", /^Tallyheart looks at it for a long time\. So THAT’S our dragon’s scale\.$/, told),
    f149: B("weasels a fox who wants (told)", /^Weasels\. A fox who wants a den\. And a heap of glass\. This goes to the Gathering, with the whole story\. Every Clan should hear it\.$/, told),
    f150: B("at the hedge riffle waves (kept)", /^At the hedge, Riffle waves goodbye\. Otter’s honor\. I’ll tell NOBODY\. Except Sprinkle\.$/, kept),
    f151: B("behind the pile a big (kept)", /^Behind the pile, a big ginger shape is waiting in the moonlight\. Tallyheart\.$/, kept),
    f152: B("twenty-six pawsteps from the hedge (kept)", /^Twenty-six pawsteps from the hedge\. And four paws\. All there\. I came to say goodnight\. Your nest was empty\. I’m not angry\. I was scared\.$/, f => kept(f) && f.choice && f.say.length === 2),
    f153a: B("her tail curls round you (kept 0)", /^Her tail curls round you\.$/, out(SORRY, 0)),
    f153b: B("you what (kept 1)", /^You WHAT\?$/, out(SORRY, 1)),
    f154: B("you tell her everything the (kept)", /^You tell her everything: the tunnel, the weasels, the fox, the stash\. Everything but the dragonets\. Not yet\.$/, f => kept(f) && tap('leaf')(f)),
    f155: B("tallyheart looks at it for (kept)", /^Tallyheart looks at it for a long time\. So THAT’S our dragon’s scale\. A fox’s trick\.$/, kept),
    f156: B("this goes to the gathering (kept)", /^This goes to the Gathering\. Every Clan should hear it\.$/, kept),
    f157: B("she touches her nose to", /^She touches her nose to yours\. A night trail, a fox and a stash\. You stayed calm, and took one piece, for proof\. That’s how a warrior thinks\.$/),
    f158: B("your tail goes straight up", /^Your tail goes straight up\. Tomorrow, Riffle will want to hear EVERY bit\. But next time, you take ME\. Not just Riffle\.$/),
    f159: B("in your nest new curls", /^In your nest: New curls of bark\. And under the moss, in its leaf, your glass\. Riffle’s stone is by your nose\. Riffle’s stone is under your chin\. skritch, skritch\.$/),
    f160: B("eight claw marks on the", /^Eight claw marks on the tree\. Two weasels who can’t count\. One fox who wants a den\. And a “scale” that was only ever glass\.$/),
    f161: B("{name}paw where were you do", /^\{name\}paw\? Where WERE you\? …Do the paw thing\. Tonight it really IS the paw thing\.$/),
    f162: B("eight i only ever use", /^EIGHT\? I only ever use four\.$/),
    f163: B("soon hes snoring outside the", /^Soon he’s snoring\. Outside, the moon is half full\. When it’s full, it’s the Gathering\. Every Clan will hear the truth, and decide about the dragon\.$/),
    f164: B("whatever the clans decide sprinkle", /^Whatever the Clans decide, Sprinkle needs to FLY again\. And her hurt wing still won’t lift\. How do you mend a dragon’s wing\? You curl up tight, warm and safe, and sleep\.$/),
    f165: B("what did {name}paw dream after", /^What did \{name\}paw dream, after the night trail\?$/),
    f166: B("you sleep warm in your", /^You sleep warm in your nest, with your glass under the moss and the half moon shining over the rosebush\. End of Chapter Eight\.$/)
  };
  // every beat is in the chapter once, and every frame of the chapter is its own beat
  Object.keys(BEAT).forEach(k => assert.deepEqual(ids.filter(BEAT[k][1]), [k], BEAT[k][0] + ': ' + ids.filter(BEAT[k][1]).join(' ')));
  assert.deepEqual(Object.keys(BEAT), ids, 'a beat for every frame');
  const seq = (from, to) => ids.slice(at(from), at(to) + 1);
  // her night, panel by panel: what a cat of this kind reads on this route with these light choices
  function night(c, light) {
    const P = (a, b) => (c.flags.ch3Told ? a : b), f = c.flags, sp = f.specialty;
    const hail = c.way === 'hail' || c.before;
    const fetch = sp === 'noticing' || sp === 'swimming';
    return [].concat(
      ['f001'], P(['f002', 'f003', 'f004'], ['f005']), seq('f006', 'f022'), P(['f023'], seq('f024', 'f029')),
      ['f030'], P(['f031', 'f033'], ['f032', 'f034', 'f035']), ['f036'],
      c.way === 'tunnel' ? [].concat(P(['f037'], ['f038']), ['f039'], P(['f040', 'f041'], ['f042', 'f043', 'f044']),
        P(['f045', light ? 'f046b' : 'f046a'], ['f047', light ? 'f048b' : 'f048a']), ['f049'], P(['f050'], ['f051'])) : [],
      c.way !== 'tunnel' ? [].concat(P(['f052', 'f054', 'f056'], ['f053', 'f055', 'f057']), ['f058', 'f059'], P(['f060'], ['f061']), ['f062']) : [],
      c.way === 'past' ? [].concat(['f063'], sp === 'sneaking' ? P(['f064'], ['f065']) : [], sp === 'climbing' ? P(['f066'], ['f067']) : [], sp === 'friends' ? P(['f068', 'f069', 'f070'], ['f071', 'f072', 'f073']) : [],
        fetch ? P(['f074', 'f075', 'f076'], ['f077', 'f078', 'f079']) : []) : [],
      c.way === 'hail' ? [].concat(P(['f080'], ['f081']), ['f082', 'f083', 'f084', 'f085'], c.found ? ['f086'] : [], seq('f087', 'f090'), P(['f091'], ['f092'])) : [],
      ['f093'], P(['f094', 'f096', 'f098'], ['f095', 'f097', 'f099']), ['f100', 'f101', 'f102'], P(['f103', 'f105'], ['f104', 'f106']),
      P(['f107', 'f109'], ['f108', 'f110']), seq('f111', 'f117'), P(['f118', 'f119'], ['f120', 'f121']), ['f122', 'f123'],
      P(['f124'], ['f125']), [f.worry === 'small' ? 'f126' : 'f127'], seq('f128', 'f135'), P(['f136', 'f138'], ['f137', 'f139']), ['f140'],
      hail ? ['f142', 'f144', 'f146'] : ['f141', 'f143', 'f145'],
      P(['f147', 'f148', 'f149'], ['f150', 'f151', 'f152', light ? 'f153b' : 'f153a', 'f154', 'f155', 'f156']), seq('f157', 'f166'));
  }
  for (const c of COMBOS) for (const light of [0, 1]) {
    const p = walk(c.flags, Object.assign({ light }, c.o)), want = night(c, light), name = comboName(c) + ' light ' + light;
    for (let i = 0; i < Math.max(p.length, want.length); i++) {
      assert.ok(p[i] && want[i], name + ': ' + (p[i] ? 'an extra panel, ' + p[i] + ' (' + T(p[i]) + ')' : 'her night stops short of “' + BEAT[want[i]][0] + '”'));
      assert.equal(p[i], want[i], name + ': panel ' + (i + 1) + ' is ' + p[i] + ' (' + T(p[i]).slice(0, 60) + '…), and should be “' + BEAT[want[i]][0] + '”');
    }
    // the flags as her night left them: `foundHail` for good after Hail's scene, and nothing else set
    assert.deepEqual(Object.keys(p.flags).sort(), Object.keys(c.flags).concat(c.way === 'hail' && !c.before ? ['foundHail'] : []).sort(), name + ': no other flag');
    if (c.way === 'hail') assert.equal(p.flags.foundHail, true, name);
  }
});

/* ------------------------------------------------------------------ every `when` */

test('every `when`, on every combination: each reader reads her own lines and nobody else’s; no dragonet named that she has not met; Hail only for a cat who has found her', () => {
  for (const c of COMBOS) for (const clean of (COMBOS.indexOf(c) % 5 ? [true] : [true, false])) {
    const f = c.flags, name = comboName(c);
    const rows = walkLines(f, Object.assign({ clean }, c.o)), lines = rows.map(r => r.lines.join(' ')).join('\n');
    const reads = (re, want, what) => assert.equal(re.test(lines), !!want, name + ': ' + what);
    const told = f.ch3Told, tunnel = c.way === 'tunnel', past = c.way === 'past', hail = c.way === 'hail' || c.before;
    // told or kept
    reads(/A paw pokes you awake\./, told, 'Tallyheart wakes her');
    reads(/By the prey pile, the last guards are yawning\./, !told, 'the guards saw nothing');
    reads(/Tonight, we follow them all the way\./, told, 'the night trail is Tallyheart’s');
    reads(/Off you go\. Back by sunset\./, !told, 'back by sunset');
    reads(/A TUNNEL\? Under your PILE\?/, !told, 'she tells Riffle');
    reads(/Behind the back row, Tallyheart is waiting/, told, 'Tallyheart behind the back row');
    reads(/a wet nose pokes through the hedge\. Riffle!/, !told, 'Riffle behind the back row');
    reads(/Her shoulders stick\./, told && tunnel, 'Tallyheart too big for the tunnel');
    reads(/Forty-one\. Forty-two\. Forty-three…/, told && tunnel, 'her pawsteps over the tunnel');
    reads(/He doesn’t squeeze\. He POURS\./, !told && tunnel, 'Riffle in the tunnel');
    reads(/Three hundred and twelve pawsteps\./, told && tunnel, 'her pawsteps at the far end');
    reads(/Ta-DA!/, !told && tunnel, 'Riffle out at the far end');
    reads(/Tallyheart pads beside you, quiet as moss\./, told && !tunnel, 'Tallyheart round the field');
    reads(/Riffle pads beside you, not saying a word\./, !told && !tunnel, 'Riffle round the field');
    reads(/Nobody’s land\. The trains own it\. Not one paw on the rails\./, told, 'her rule');
    reads(/Granny says it’s nobody’s land\./, !told, 'his granny’s rule');
    reads(/Too small for me\. I’ll keep watch\./, told, 'Tallyheart keeps watch');
    reads(/Riffle keeps watch\./, !told, 'Riffle keeps watch');
    reads(/Run! Get the glass HOME\./, told, 'Tallyheart: run');
    reads(/RUN!/, !told, 'Riffle: run');
    reads(/Weasels\. A fox who wants a den\./, told, 'Tallyheart heard it all');
    reads(/I came to say goodnight\. Your nest was empty\./, !told, 'Tallyheart waiting');
    reads(/Everything but the dragonets\. Not yet\./, !told, 'the dragonets kept secret');
    reads(/But next time, you take ME\. Not just Riffle\./, !told, 'next time');
    reads(/Tomorrow, Riffle will want to hear EVERY bit\./, told, 'Riffle tomorrow');
    assert.equal((lines.match(/That’s how a warrior thinks\./g) || []).length, 1, name + ': the warm line, once, on both paths');
    assert.equal((lines.match(/The Counts don’t lie\./g) || []).length, 1, name + ': “The Counts don’t lie.” once a path');
    // the route: the tunnel's dogs overhead, or the field's
    reads(/You’re right under the Barking Field!/, tunnel, 'the dogs overhead');
    reads(/One ear twitches\./, !tunnel, 'the dogs wake');
    reads(/From the hollow log far inside the fence, a white head pops up\./, !tunnel, 'the log');
    reads(/Out bounces a little dragonet/, c.way === 'hail', 'Hail’s scene');
    reads(/The white head ducks back in\./, past, 'not tonight');
    // the way past the dogs, by specialty, only for “Not tonight.”
    reads(/You drop flat in the grass\./, past && f.specialty === 'sneaking', 'flat');
    reads(/Up onto the fence top you go/, past && f.specialty === 'climbing', 'the fence top');
    reads(/Hello, dogs!/, past && f.specialty === 'friends', 'hello');
    reads(/Tallyheart flicks a pinecone/, past && told && ['noticing', 'swimming'].includes(f.specialty), 'her pinecone');
    reads(/Riffle flicks a pebble/, past && !told && ['noticing', 'swimming'].includes(f.specialty), 'his pebble');
    // the specialties elsewhere: noticing's prints, sneaking's silent paws at the stash
    reads(/In the soft earth: tiny prints, coming and going\./, tunnel && f.specialty === 'noticing', 'the tunnel’s prints');
    reads(/Round every hole: tiny prints\./, f.specialty === 'noticing', 'the holes’ prints');
    reads(/Your paws go silent\. Not one weasel stirs\./, f.specialty === 'sneaking', 'silent paws at the stash');
    // each worry where the story puts it
    reads(/A small cat could just squeeze in\. A small cat like you\./, f.worry === 'small', 'small at the mouth');
    reads(/You fit PERFECTLY\./, f.worry === 'small' && tunnel, 'small in the tunnel');
    reads(/A tight squeeze\. In you go!/, f.worry === 'small', 'small at the stash');
    reads(/Neither way is wet\. You check twice\./, f.worry === 'water', 'water');
    reads(/You want to jump up and shout LIAR!/, f.worry === 'talk', 'talk');
    reads(/It sparkles\. It shines\./, f.worry === 'shiny', 'shiny at the heap');
    reads(/Not for keeping\. For proof\./, f.worry === 'shiny', 'shiny at the proof');
    // the dragonets found before: one line each where its clue comes true; the border's dry den for everyone
    reads(/Just what Squall saw from his roof!/, f.foundSquall, 'Squall');
    reads(/Clever little paws\. Just what Puddle saw!/, f.foundPuddle, 'Puddle');
    reads(/He said that at the border!/, !f.foundSleet, 'the border, for a cat who never met Sleet');
    reads(/He said that at the border, and Sleet heard it too!/, f.foundSleet, 'Sleet');
    reads(/Wisp drew a fox dropping something/, f.foundWisp, 'Wisp');
    reads(/And I’ve found more of you!/, c.way === 'hail' && c.found, 'her news to Hail');
    if (!c.found) assert.doesNotMatch(lines, /\b(Squall|Puddle|Wisp|Sleet)\b/, name + ': a dragonet she has not met');
    // Hail at the chase, for a cat who has found her (in this reading or before)
    reads(/DOGS! SQUIRRELS! THAT way!/, hail, 'Hail calls the dogs');
    reads(/Three dogs and one speckled dragonet/, hail, 'Hail bounces along');
    reads(/Inside the fence, three dogs leap up\./, !hail, 'the dogs alone');
    if (!hail) assert.doesNotMatch(lines, /\bHail\b|speckled|a little dragonet/, name + ': no Hail for a cat who has not met her');
    // the lesson: a cat who needed no help says so
    reads(/Not one miss!\s*Not one\. The fours are yours now\./, clean, 'the fours are yours');
    reads(/Some were tricky\.\s*You worked every one out\./, !clean, 'tricky');
    // her stone
    reads(/Riffle’s stone is by your nose\./, f.ch2Stone === 'nose', 'by her nose');
    reads(/Riffle’s stone is under your chin\./, f.ch2Stone === 'chin', 'under her chin');
  }
  // who reads what: the flags this chapter reads, and where
  const readers = k => ids.filter(id => [frames[id].when].concat(texts(frames[id]).map(x => x.when), (frames[id].choice ? frames[id].choice.options : []).flatMap(o => (o.labelWhen || []).map(v => v.when))).filter(Boolean).some(w => k in w || (w.not && k in w.not)));
  assert.deepEqual(readers('foundHail'), [LOG].concat(...HAIL_TWINS));
  // (her news to Hail, “And I’ve found more of you!” and “You tell her, name by name.”, reads any one of the four)
  const news = [F(/^And I’ve found more of you!/), F(/^You tell her, name by name\./)];
  assert.deepEqual(readers('foundSquall'), news.concat([F(/Just what Squall saw/)]));
  assert.deepEqual(readers('foundPuddle'), news.concat([F(/Just what Puddle saw/)]));
  assert.deepEqual(readers('foundSleet'), news.concat([F(/Just what Puddle saw|He said that at the border/)]));
  assert.deepEqual(readers('foundWisp'), news.concat([F(/Wisp drew a fox/)]));
  assert.deepEqual(readers('lessonClean'), [EIGHTH]);
  assert.deepEqual(readers('ch2Stone'), [NEST]);
  assert.deepEqual(readers('worry'), [ROUTE, F(/^Inside, it’s just wide enough/), F(/A tight squeeze\. In you go!$/), F(/^Your paws go silent\. Not one weasel stirs\.$/), F(/^Beside the prey is a heap/), F(/^Tower glass\./)].concat(FOX).sort());
  ['ch2Path', 'ch2SaidAloud', 'stepOut', 'spokeUp', 'joinReason', 'ch4CaughtFly', 'ch5First', 'ch5Roof', 'ch7Flew'].forEach(k => assert.deepEqual(readers(k), [], k + ' is not read'));
});

/* ------------------------------------------------------------------ Counts */

function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }
const pairs = d => d.facts.map(f => { const q = factAB(f); return q.a + 'x' + q.b; });
const TH = text => ({ who: 'tallyheart', text });
const QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
const AFTER = ['Ha! You didn’t even look at the sand that time.'];
const HOP = 'Close. Let’s hop it together.', FAR = 'Let’s hop it together.';
const MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
const DEFAULTS = ['Here’s that one again.', 'There. We’ll come back to that one.', 'There. Now you’ve seen it counted.', 'There it is. You remembered that one.', 'Yes! That one came back, and you knew it.', 'Let’s scratch it out together.', 'Yes!', 'Good work.'];
const saidIn = rows => rows.reduce((a, x) => a.concat(x.prompt.map(p => p.text), x.line, x.balloons.map(b => b.text), x.help ? [x.help.intro, x.help.line] : []), []).filter(Boolean);

test('counts: every set exactly as the spec has it (section 2), and the lesson kit: five new facts and five she knows, both orders, twins three places apart; the story questions after the lesson; 15 typed answers on every reading, 16 with Hail', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), SETS);
  const way = text => ({ miss: text + ' ' + MISS, missLast: text });
  const CHEEKS = { table: 6, thing: 'whisker', things: 'whiskers', unit: 'cheek', units: 'cheeks', teacher: 'tallyheart', ask: '{a} × {b}', picture: { kind: 'cheeks' } };
  const PAWS = { table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}' };
  const NIGHTS = { thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', ask: '{a} × {b}' };
  const ONE_CAT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }];
  const FIELD = [{ who: 'dog', variant: 1 }, { who: 'dog', variant: 2 }, { who: 'dog', variant: 3 }, { who: 'hail' }];
  assert.deepEqual(C['ch08-pile'], {
    table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
    picture: { kind: 'prey', layout: 'rows' },
    facts: [{ a: 3, b: 10, light: 'rows', check: true, prompt: [{ kind: 'caption', text: 'Three front rows of ten. How many pieces?' }], retryPrompt: true }],
    ask: '{a} × {b}', praise: [], ground: 'earth',
    helpIntro: 'Let’s scratch it out: ten marks for every row.',
    helpIntroNotTen: 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.',
    fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', avoid: [[4, 10], [5, 10]], fillIntro: 'An easy one.',
    miss: MISS, missLast: LAST, again: ['There it is. You remembered that one.'], done: null
  });
  assert.deepEqual(C['ch08-pile'], ch07.counts['ch07-pile'], 'chapter 7’s pile exactly');
  assert.deepEqual(C['ch08-sixes'], Object.assign({}, CHEEKS, {
    facts: [[6, 8], { a: 2, b: 6, who: ONE_CAT, prompt: 'Two cheeks? One whole cat.', retryPrompt: true, right: [TH('Twelve! Six and six. That’s doubling.')], rightAgain: true }],
    warmHard: { table: 6, at: 0, avoid: [[1, 6], [2, 6], [3, 6], [6, 9], [6, 10], [4, 6]] }, avoid: [[6, 6], [4, 6]],
    fillFrom: 'ch07-sixes', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
    praise: ['Two threes make a six!', 'Six more, every time!', 'Three and three, every cheek!'],
    fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST,
    remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
    rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
  }));
  ['praise', 'fast', 'fastAfterMiss'].forEach(k => assert.deepEqual(C['ch08-sixes'][k], ch07.counts['ch07-sixes'][k], 'chapter 7’s sixes ' + k));
  assert.deepEqual(C['ch08-fours'], Object.assign({}, PAWS, {
    label: 'Paws', hollowThings: 'fours', fillOrder: 'easiest', prompt: 'How many paws?',
    facts: [
      { a: 2, b: 4, prompt: 'Two cats. How many paws?', retryPrompt: true, right: [TH('Eight! Four and four.')], rightAgain: true },
      { a: 4, b: 5, right: [TH('Twenty! You hopped that one already.')], rightAgain: true },
      Object.assign({ a: 4, b: 4, prompt: 'Four cats. Front paws: eight. Back paws: eight more.', retryPrompt: true,
        right: [TH('Sixteen! Eight and eight. You doubled it.')], rightAgain: true }, way('Eight and eight: sixteen.')),
      [3, 4],
      Object.assign({ a: 4, b: 7, prompt: 'Seven cats. Front paws: fourteen. Back paws: fourteen more. Fourteen and fourteen: ten and ten, then four and four.', retryPrompt: true,
        right: [TH('Twenty-eight! You doubled fourteen.')], rightAgain: true }, way('Ten and ten make twenty. Four and four make eight. Twenty-eight.')),
      Object.assign({ a: 4, b: 8, lit: 28, prompt: 'Eight cats. Seven cats made twenty-eight. One more cat: four more paws.', retryPrompt: true,
        right: [TH('Thirty-two! The biggest new one.')], rightAgain: true }, way('Twenty-eight, and four more: thirty-two.')),
      { a: 4, b: 6, prompt: 'Six cats? That’s YOUR count!', retryPrompt: true, right: [TH('Twenty-four! Four a night, for six nights.')], rightAgain: true },
      { a: 7, b: 4, prompt: 'Seven cats? You did that one the other way round.', retryPrompt: true, right: [TH('Twenty-eight! Same fact.')], rightAgain: true },
      { a: 8, b: 4, check: true, right: [TH('Thirty-two! Same fact.')], rightAgain: true },
      [10, 4]
    ],
    praise: ['Two twos make a four!', 'Four more, every time!'],
    fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: FAR, miss: MISS, missLast: LAST, done: 'That’s the fours.'
  }));
  assert.deepEqual(C['ch08-gone'], Object.assign({}, NIGHTS, {
    table: 4, teacher: 'tallyheart', picture: { kind: 'marks', layout: 'pairs' },
    facts: [Object.assign({ a: 4, b: 7, prompt: [{ kind: 'caption', text: 'Four gone a night, for seven nights. How many gone?' }], retryPrompt: true,
      right: [TH('Twenty-eight! Just like seven cats’ paws.')], rightAgain: true }, way('Two and two, every night. Fourteen and fourteen: twenty-eight.'))],
    help: 'picture', helpIntro: HOP, helpIntroFar: FAR,
    fillFrom: 'ch08-fours', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.', avoid: [[3, 4], [4, 4]],
    praise: [], miss: MISS, missLast: LAST, done: null
  }));
  assert.deepEqual(C['ch08-hail'], {
    table: 4, thing: 'paw', things: 'paws', unit: 'dog', units: 'dogs', teacher: 'hail', ask: '{a} × {b}',
    picture: { kind: 'dogs' }, who: FIELD,
    facts: [{ a: 4, b: 4, prompt: [{ who: 'hail', text: 'How many paws go round and round this field?' }], retryPrompt: true,
      right: [{ who: 'hail', text: 'SIXTEEN! Did you count them? ALL of them? Can I count YOURS?' }], rightAgain: true }],
    help: 'picture', helpIntro: 'Hop by fours! Four, eight…', helpIntroFar: 'Hop by fours! Four, eight…',
    fillFrom: 'ch08-fours', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one!', avoid: [[4, 5], [4, 6]],
    praise: [], miss: MISS, missLast: LAST, done: null
  });
  const SNIP = { a: 2, b: 7, prompt: [{ kind: 'caption', text: 'You scratch two marks a night, for seven nights. How many did Snip carry?' }], retryPrompt: true,
    right: [{ who: 'player', kind: 'whisper', text: 'Fourteen!' }], rightAgain: true };
  assert.deepEqual(C['ch08-snip'], Object.assign({}, NIGHTS, {
    table: 2, teacher: 'tallyheart', picture: { kind: 'marks', ground: 'mud' }, facts: [SNIP],
    help: 'picture', helpIntro: 'Let’s hop it together. Two, four…', helpIntroFar: 'Let’s hop it together. Two, four…',
    fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
    praise: [], miss: MISS, missLast: LAST, done: null
  }));
  assert.deepEqual(C['ch08-riffle'], Object.assign({}, NIGHTS, {
    table: 2, teacher: 'riffle', picture: { kind: 'marks', ground: 'mud' }, facts: [SNIP],
    help: 'picture', helpIntro: 'Hop by twos! Two, four…', helpIntroFar: 'Hop by twos! Two, four…',
    fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one!', againIntro: 'That one again!',
    praise: [], miss: 'There! Again in a bit.', missLast: 'There! Now you’ve seen it.', done: null
  }));
  // every fact: arithmetic, in its Count, no duplicates in a set
  Object.keys(C).forEach(sid => {
    const d = C[sid], keys = new Set();
    d.facts.forEach(f => {
      const q = factAB(f), tb = (f && f.table) || d.table;
      assert.ok(q.a === tb || q.b === tb, sid + ': ' + q.a + '×' + q.b + ' belongs to the ' + tb + 's');
      assert.ok(!keys.has(q.a + 'x' + q.b), sid);
      keys.add(q.a + 'x' + q.b);
    });
  });
  // the lesson kit: five new facts (4 × 4, 4 × 7, 4 × 8 in either order), five she knows (2 × 4, 4 × 5, 3 × 4,
  // 4 × 6, 10 × 4: one from every mark Tallyheart names at the tree but 4 × 1 and 4 × 9), both orders, twins three apart
  const ten = pairs(C['ch08-fours']);
  assert.deepEqual(ten, ['2x4', '4x5', '4x4', '3x4', '4x7', '4x8', '4x6', '7x4', '8x4', '10x4']);
  const key = k => k.split('x').map(Number).sort((a, b) => a - b).join('x');
  assert.equal(ten.filter(k => ['4x4', '4x7', '4x8'].includes(key(k))).length, 5, 'five of the ten are the new facts');
  assert.deepEqual(ten.filter(k => !['4x4', '4x7', '4x8'].includes(key(k))).map(key), ['2x4', '4x5', '3x4', '4x6', '4x10'], 'the stepping stones she knows');
  assert.ok(ten.some(k => +k.split('x')[0] === 4) && ten.some(k => +k.split('x')[1] === 4), 'both orders');
  [['4x7', '7x4'], ['4x8', '8x4']].forEach(([a, b]) => assert.equal(ten.indexOf(b) - ten.indexOf(a), 3, a + ' and ' + b + ' three apart'));
  assert.deepEqual(C['ch08-fours'].facts.filter(f => !Array.isArray(f) && f.right).length, 8, 'two lack a right line of their own, so a quick answer can be noticed');
  // the story questions after the lesson: the twenty-eight (4 × 7) and Snip's share (2 × 7), sums on table 4 and 2
  assert.deepEqual([pairs(C['ch08-gone']), pairs(C['ch08-snip']), pairs(C['ch08-riffle']), pairs(C['ch08-hail'])], [['4x7'], ['2x7'], ['2x7'], ['4x4']]);
  ['ch08-gone', 'ch08-hail', 'ch08-snip', 'ch08-riffle'].forEach(sid => assert.ok(at(countsAt(sid)[0]) > at(countsAt('ch08-fours')[0]), sid + ' after the lesson'));
  // typed answers: the pile, two sixes, the ten fours, the twenty-eight, Snip's share; Hail's riddle one more
  const typed = ['ch08-pile', 'ch08-sixes', 'ch08-fours', 'ch08-gone', 'ch08-snip'].reduce((m, sid) => m + C[sid].facts.length, 0);
  assert.equal(typed, 15);
  t.diagnostic('15 typed answers on every reading with no misses, 16 with Hail');
  // the Counts frames, each with the lines its own page carries
  const cf = ids.filter(id => frames[id].counts);
  assert.deepEqual(cf.map(id => [frames[id].counts.set, (frames[id].caption || []).length, (frames[id].say || []).length]),
    [['ch08-pile', 1, 1], ['ch08-sixes', 1, 1], ['ch08-fours', 0, 1], ['ch08-gone', 1, 0], ['ch08-hail', 0, 1], ['ch08-snip', 1, 0], ['ch08-riffle', 1, 0]]);
  assert.deepEqual(frames[countsAt('ch08-hail')[0]].say, [{ who: 'hail', text: 'Want a riddle? Here’s one! Three dogs, and me. That’s four of us. Four paws each!' }]);
});

test('counts: lines are short, whole sentences, and fit both sexes; nobody but the set’s own voices speaks in it, and each voice is in its Counts frame’s picture', () => {
  const VOICES = { 'ch08-pile': [], 'ch08-sixes': ['tallyheart'], 'ch08-fours': ['tallyheart'], 'ch08-gone': ['tallyheart'], 'ch08-hail': ['hail'], 'ch08-snip': ['player'], 'ch08-riffle': ['player'] };
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
  ['ch08-sixes', 'ch08-fours'].forEach(sid => [].concat(story.counts[sid].praise, story.counts[sid].fast, story.counts[sid].fastAfterMiss).forEach(l => assert.doesNotMatch(l, /\d|eight|twelve|sixteen|twenty|thirty|forty/i, sid + ': ' + l)));
});

/* A cat who has read chapters 1 to 7 (as `before8`), with these answers and times in chapter 7's sixes and
 * twenty-four: what the warm-up finds hard. */
const sixesCat = (sixes, sixesMs, gone) => before8({}, { sixes, sixesMs, gone });

test('the pile and the warm-up, the build notes’ tests: three front rows lit a row at a time, the pile borrowing its own rows; the warm-up’s hard six first, 6 × 8 when nothing was hard, never 1 × 6, 2 × 6, 3 × 6, 4 × 6, 6 × 9 or 6 × 10; a chapter-7 miss or slow 5 × 6 opens on 5 × 6 with “Yesterday…”; its fillers 6 × 3 then 5 × 6 (6 × 3 then 4 × 6 when the hard one was 5 × 6)', () => {
  // the pile: read under its caption, no right line; a miss is scratched in the earth a row at a time
  const clean = play(sixesCat(), 'ch08-pile');
  assert.deepEqual(clean.map(x => [x.k, x.q.answer, x.q.light, x.line, x.balloons.length]), [['3x10', 30, 'rows', '', 0]]);
  assert.deepEqual(clean[0].prompt.map(p => [p.kind, p.label, p.text]), [['caption', null, 'Three front rows of ten. How many pieces?']]);
  assert.deepEqual(clean[0].light.map(s => s.picture.highlight), [10, 20, 30], 'lit a row at a time, with no number shown');
  const missed = play(sixesCat(), 'ch08-pile', { '3x10': [13, 40] });
  assert.deepEqual(ks(missed), ['3x10✗', 'F:1x10', 'F:10x2', 'R:3x10✗', 'F:1x10', 'F:10x2', 'R:3x10']);
  assert.deepEqual([missed[0].help.ground, missed[0].help.nums], ['earth', [10, 20, 30]]);
  assert.deepEqual(missed.slice(1, 3).map(x => x.prompt.map(p => p.text).join(' ')), ['An easy one. One row of ten. How many pieces?', 'An easy one. Two rows of ten. How many pieces?'], 'asked on the pile’s own rows');
  assert.deepEqual(missed[6].prompt.map(p => p.text), ['Here’s that one again.', 'Three front rows of ten. How many pieces?']);
  // the warm-up's hard pick
  const def = story.counts['ch08-sixes'];
  const facts = cat => E.lessonFacts(cat, Object.assign({ id: 'ch08-sixes' }, def), STORIES).map(x => (Array.isArray(x) ? x.join('x') : x.a + 'x' + x.b + (x.hard ? ' hard' : '')));
  assert.deepEqual(facts(sixesCat()), ['6x8', '2x6'], 'nothing was hard yesterday: 6 × 8');
  assert.deepEqual(facts(sixesCat({ '5x6': [29] })), ['5x6 hard', '2x6'], 'a chapter-7 miss of 5 × 6');
  assert.deepEqual(facts(sixesCat(null, { all: 1500, '5x6': 9000 })), ['5x6 hard', '2x6'], 'a slow 5 × 6, the only lesson fact timed on itself');
  for (const k of ['6x7', '6x8', '6x6']) assert.deepEqual(facts(sixesCat({ [k]: [1] })), [k + ' hard', '2x6'], 'a chapter-7 miss of ' + k);
  // passed over (the cost, as chapter 7's): 2 × 6, 6 × 3, 6 × 4, 4 × 6, the twenty-four's 4 × 6
  for (const k of ['2x6', '6x3', '6x4', '4x6']) assert.deepEqual(facts(sixesCat({ [k]: [1] })), ['6x8', '2x6'], 'a chapter-7 miss of ' + k + ': never picked');
  assert.deepEqual(facts(sixesCat(null, null, { '4x6': [20] })), ['6x8', '2x6'], 'a missed twenty-four: never picked (the 4s lesson asks it as “YOUR count”)');
  // the engine words the first (“Eight cheeks. How many whiskers?”); 2 × 6 is asked in its own words
  const quick = play(sixesCat({ '5x6': [29] }), 'ch08-sixes', null, { all: 1500 });
  assert.deepEqual(quick.map(x => [x.k, x.prompt.map(p => p.label + ': ' + p.text).join(' ')]), [['5x6', 'Tallyheart: Five cheeks. How many whiskers?'], ['2x6', 'Tallyheart: Two cheeks? One whole cat.']]);
  assert.deepEqual([quick[0].kind, quick[0].line, quick[1].balloons.map(b => b.text)], ['remembered', 'Yesterday, 5 × 6 made you stop and think. Not today!', ['Twelve! Six and six. That’s doubling.']]);
  assert.deepEqual(quick[1].picture.who, [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }], 'one whole cat: one face');
  const slow = play(sixesCat({ '5x6': [29] }), 'ch08-sixes', null, { all: 9000 });
  assert.deepEqual([slow[0].k, slow[0].kind, slow[0].line], ['5x6', 'rememberedSlow', '5 × 6 again, and you got it. It’s getting easier.']);
  const plain = play(sixesCat(), 'ch08-sixes', null, { all: 1500 });
  assert.deepEqual([plain[0].prompt.map(p => p.text).join(' '), plain[0].line], ['Eight cheeks. How many whiskers?', 'Quick as a pounce!']);
  const plainSlow = play(sixesCat(), 'ch08-sixes', null, { all: 9000 });
  assert.equal(plainSlow[0].line, 'Two threes make a six!');
  // a miss: the sand, hopped by sixes; easy sixes lent from yesterday's lesson, in its cheeks
  const miss1 = play(sixesCat(), 'ch08-sixes', { '6x8': [40] });
  assert.deepEqual(ks(miss1), ['6x8✗', '2x6', 'F:6x3', 'R:6x8']);
  assert.deepEqual([miss1[0].help.nums, miss1[0].help.ground, miss1[2].prompt.map(p => p.text).join(' ')], [[6, 12, 18, 24, 30, 36, 42, 48], 'sand', 'One from yesterday. Three cheeks. How many whiskers?']);
  const miss2 = play(sixesCat(), 'ch08-sixes', { '2x6': [11] });
  assert.deepEqual(ks(miss2), ['6x8', '2x6✗', 'F:6x3', 'F:5x6', 'R:2x6']);
  assert.deepEqual([miss2[3].prompt.map(p => p.text).join(' '), miss2[4].balloons.map(b => b.text)], ['One from yesterday. Five cheeks. How many whiskers?', ['Twelve! Six and six. That’s doubling.']]);
  const miss3 = play(sixesCat({ '5x6': [29] }), 'ch08-sixes', { '2x6': [11] });
  assert.deepEqual(ks(miss3), ['5x6', '2x6✗', 'F:6x3', 'F:4x6', 'R:2x6'], 'four cheeks when the hard one was 5 × 6, never 6 × 6');
  const all = play(sixesCat(), 'ch08-sixes', { '6x8': [1, 1], '2x6': [1, 1] });
  assert.deepEqual(ks(all), ['6x8✗', '2x6✗', 'F:6x3', 'R:6x8✗', 'R:2x6✗', 'F:5x6', 'R:6x8', 'R:2x6']);
  assert.ok(!all.concat(miss1, miss2, miss3).some(x => pairKey(x.k) === '6x6'), 'never 6 × 6');
  // none of the frame's own lines is said again over the first question, so its clock is the fact's
  assert.equal(E.readFirst({ set: 'ch08-sixes', a: 6, b: 8 }, STORIES, null, true), false, 'the opener is timed on itself');
});

test('the lesson, the build notes’ tests: ten facts in the story’s order, that many cats four paws each, 4 × 8 with seven cats lit; Tallyheart’s lines; every miss hops by fours from the first cat, two and two in the sand, and comes back two questions later, before its twin; 3 × 4 and 10 × 4 get the quick lines; a missed 4 × 8 survives a quick 8 × 4', () => {
  const rows = play(sixesCat(), 'ch08-fours', null, { all: 6000 });
  assert.deepEqual(ks(rows), ['2x4', '4x5', '4x4', '3x4', '4x7', '4x8', '4x6', '7x4', '8x4', '10x4']);
  assert.deepEqual(rows.map(x => x.q.answer), [8, 20, 16, 12, 28, 32, 24, 28, 32, 40]);
  assert.deepEqual(rows.map(x => [x.picture.kind, x.picture.groups, x.picture.highlight, x.picture.thing]), [[undefined, 2, 0, 'paw'], [undefined, 5, 0, 'paw'], [undefined, 4, 0, 'paw'], [undefined, 3, 0, 'paw'],
    [undefined, 7, 0, 'paw'], [undefined, 8, 28, 'paw'], [undefined, 6, 0, 'paw'], [undefined, 7, 0, 'paw'], [undefined, 8, 0, 'paw'], [undefined, 10, 0, 'paw']], 'that many cats, four paws each; 4 × 8 with seven cats lit');
  rows.forEach(x => assert.deepEqual([x.q.per, x.q.table, x.teacher], [4, 4, 'tallyheart'], x.k));
  assert.match(A.countsPicture(Object.assign({ look: {} }, rows[9].picture)), /<svg/);
  const ask = k => rows.find(x => x.k === k).prompt.map(p => p.label + ': ' + p.text).join(' | ');
  assert.deepEqual(['4x5', '3x4', '8x4', '10x4'].map(ask), ['Tallyheart: How many paws?', 'Tallyheart: How many paws?', 'Tallyheart: How many paws?', 'Tallyheart: How many paws?'], 'the set’s own words for the four with none');
  assert.equal(ask('2x4'), 'Tallyheart: Two cats. How many paws?');
  assert.equal(ask('4x7'), 'Tallyheart: Seven cats. Front paws: fourteen. Back paws: fourteen more. Fourteen and fourteen: ten and ten, then four and four.');
  const said = k => rows.find(x => x.k === k).balloons.map(b => b.text).join(' | ');
  assert.deepEqual(['2x4', '4x5', '4x4', '4x7', '4x8', '4x6', '7x4', '8x4'].map(said), ['Eight! Four and four.', 'Twenty! You hopped that one already.', 'Sixteen! Eight and eight. You doubled it.', 'Twenty-eight! You doubled fourteen.',
    'Thirty-two! The biggest new one.', 'Twenty-four! Four a night, for six nights.', 'Twenty-eight! Same fact.', 'Thirty-two! Same fact.']);
  // 3 × 4 and 10 × 4, with no right line of their own: slow, the praise; quick, the fast lines; after any miss, “Ha!” leads
  assert.deepEqual(['3x4', '10x4'].map(k => rows.find(x => x.k === k).line), ['Two twos make a four!', 'Four more, every time!']);
  const quick = play(sixesCat(), 'ch08-fours', null, { all: 1500 });
  assert.deepEqual(['3x4', '10x4'].map(k => quick.find(x => x.k === k).line), QUICK2, 'clean and quick: the quick lines');
  const after = play(sixesCat(), 'ch08-fours', { '4x4': [12] }, { all: 1500 });
  assert.equal(after.find(x => x.k === '3x4').line, AFTER[0], 'quick after a miss');
  // every single miss: the help hops by fours from the first cat, four marks a cat in the sand, two and two;
  // “Close.” within one hop; a doubling or stepping question ends on its way; back two questions later, before its twin
  const WAY = { '4x4': 'Eight and eight: sixteen.', '4x7': 'Ten and ten make twenty. Four and four make eight. Twenty-eight.', '4x8': 'Twenty-eight, and four more: thirty-two.' };
  const TWIN = { '4x7': '7x4', '4x8': '8x4' };
  ks(rows).forEach(k => {
    const [a, b] = k.split('x').map(Number), right = a * b;
    const near = play(sixesCat(), 'ch08-fours', { [k]: [right - 4] }), far = play(sixesCat(), 'ch08-fours', { [k]: [right + 9] });
    const m = near.find(x => x.k === k + '✗');
    assert.equal(m.help.intro, HOP, k + ': within one hop');
    assert.equal(far.find(x => x.k === k + '✗').help.intro, FAR, k + ': further off');
    assert.deepEqual(m.help.nums, Array.from({ length: m.q.groups }, (_, j) => 4 * (j + 1)), k + ': hopped by fours from the first cat');
    assert.deepEqual([m.help.ground, m.help.per], ['sand', 4], k);
    assert.match(A.sand(E.sandOpts(m.help, 0)), /two and two/, k + ': the sand two and two');
    assert.equal(m.line, WAY[k] ? WAY[k] + ' ' + MISS : MISS, k + ': its own line');
    const back = near.findIndex(x => x.k === 'R:' + k);
    if (k === '10x4' || k === '8x4') assert.ok(back > near.indexOf(m), k + ': near the end it comes back after the fillers');
    else assert.equal(back - near.indexOf(m), 3, k + ': comes back two questions later (' + ks(near).join(' ') + ')');
    assert.deepEqual([near[back].picture.groups, near[back].picture.highlight], [m.picture.groups, m.picture.highlight], k + ': its picture kept on its retry');
    if (TWIN[k]) assert.ok(back < near.findIndex(x => x.k === TWIN[k]), k + ': before ' + TWIN[k]);
  });
  // three in a row missed (the spec's run)
  assert.deepEqual(ks(play(sixesCat(), 'ch08-fours', { '4x4': [12], '4x7': [24], '4x8': [28] })), ['2x4', '4x5', '4x4✗', '3x4', '4x7✗', 'R:4x4', '4x8✗', 'R:4x7', '4x6', 'R:4x8', '7x4', '8x4', '10x4']);
  // a last miss: the way alone (or chapter 6's line)
  const thrice = play(sixesCat(), 'ch08-fours', { '4x7': [20, 20, 20] }).filter(x => x.k.endsWith('4x7✗'));
  assert.deepEqual(thrice.map(x => x.line), [WAY['4x7'] + ' ' + MISS, WAY['4x7'] + ' ' + MISS, WAY['4x7']]);
  assert.equal(play(sixesCat(), 'ch08-fours', { '3x4': [11, 11, 11] }).filter(x => x.k.endsWith('3x4✗'))[2].line, LAST);
  // fillers near the end are her easiest right answers in the lesson, in their own cats
  const f8 = play(sixesCat(), 'ch08-fours', { '8x4': [28] });
  assert.deepEqual(ks(f8).slice(8), ['8x4✗', '10x4', 'F:2x4', 'R:8x4']);
  const f10 = play(sixesCat(), 'ch08-fours', { '10x4': [36] });
  assert.deepEqual(ks(f10).slice(9), ['10x4✗', 'F:2x4', 'F:3x4', 'R:10x4']);
  f10.filter(x => x.q.filler).forEach(x => assert.deepEqual([x.prompt.map(p => p.text).join(' '), x.picture.groups], ['How many paws?', +x.k.split('x')[0].slice(2)], x.k));
  // 8 × 4 is a check: a missed 4 × 8 is still hard for chapter 9 after a quick 8 × 4; a slow lesson leaves only
  // 4 × 5, 3 × 4 and 10 × 4 timed on themselves
  const c48 = sixesCat(); play(c48, 'ch08-fours', { '4x8': [28] }, { all: 1500 });
  assert.deepEqual(E.hardFacts(c48, 4, STORIES), [[4, 8]]);
  const cslow = sixesCat(); play(cslow, 'ch08-fours', null, { all: 9000 });
  assert.deepEqual(E.hardFacts(cslow, 4, STORIES).map(p => p.join('x')).sort(), ['10x4', '3x4', '4x5'].sort(), 'every other fact is read under words or is a check');
  assert.equal(story.counts['ch08-fours'].done, 'That’s the fours.');
});

test('the twenty-eight, the build notes’ tests: seven nights of four marks, two and two; a miss lights them a night at a time, hopping by fours to 28; its fillers 2 × 4 then 4 × 5, drawn as nights, never 4 × 4; a second miss 4 × 6 then 2 × 4; filed under the 4s, and a 7s fact for chapter 10', () => {
  const c = sixesCat(); play(c, 'ch08-fours');
  const g = play(c, 'ch08-gone', { '4x7': [24, 24] });
  assert.deepEqual(ks(g), ['4x7✗', 'F:2x4', 'F:4x5', 'R:4x7✗', 'F:4x6', 'F:2x4', 'R:4x7']);
  assert.deepEqual([g[0].picture.kind, g[0].picture.layout, g[0].picture.groups, g[0].picture.per, g[0].picture.highlight], ['marks', 'pairs', 7, 4, 0], 'seven nights, four marks each, two and two, unlit');
  assert.match(A.countsPicture(Object.assign({ look: {} }, g[0].picture)), /two and two/);
  assert.deepEqual([g[0].help.picture, g[0].help.nums, g[0].help.intro], [true, [4, 8, 12, 16, 20, 24, 28], HOP], 'the marks already in the sand light a night at a time');
  assert.equal(g[0].line, 'Two and two, every night. Fourteen and fourteen: twenty-eight. ' + MISS);
  assert.deepEqual(g.filter(x => x.q.filler).map(x => [x.k, x.prompt.map(p => p.label + ': ' + p.text).join(' '), x.picture.kind, x.picture.layout, x.teacher]), [
    ['F:2x4', 'Tallyheart: An easy one. Two nights. How many pieces?', 'marks', 'pairs', 'tallyheart'], ['F:4x5', 'Tallyheart: An easy one. Five nights. How many pieces?', 'marks', 'pairs', 'tallyheart'],
    ['F:4x6', 'Tallyheart: An easy one. Six nights. How many pieces?', 'marks', 'pairs', 'tallyheart'], ['F:2x4', 'Tallyheart: An easy one. Two nights. How many pieces?', 'marks', 'pairs', 'tallyheart']]);
  assert.ok(!g.some(x => pairKey(x.k) === '4x4'), 'sixteen, one of today’s new ones, is never an easy one');
  assert.deepEqual(g[3].prompt.map(p => p.text), ['Here’s that one again.', 'Four gone a night, for seven nights. How many gone?']);
  assert.deepEqual([g[6].picture.kind, g[6].picture.highlight, g[6].balloons.map(b => b.text)], ['marks', 0, ['Twenty-eight! Just like seven cats’ paws.']], 'the seven nights come back unlit, and the right line is the same on the retry');
  // the same whatever the lesson missed
  const c2 = sixesCat(); play(c2, 'ch08-fours', { '2x4': [7], '4x5': [21], '3x4': [11] });
  assert.deepEqual(ks(play(c2, 'ch08-gone', { '4x7': [24] })), ['4x7✗', 'F:2x4', 'F:4x5', 'R:4x7']);
  // logged at table 4; a miss is a 4s and a 7s hard fact (chapter 9's warm-up, chapter 10's 7s)
  const logged = c.counts.filter(e => e.set === 'ch08-gone');
  assert.ok(logged.every(e => E.tableOf(e, STORIES) === 4), 'filed under the 4s');
  assert.deepEqual([E.hardFacts(c, 4, STORIES).some(p => pairKey(p.join('x')) === '4x7'), E.hardFacts(c, 7, STORIES).some(p => pairKey(p.join('x')) === '4x7')], [true, true]);
  // a right answer: never timed (its own words), the right line Tallyheart's
  const c3 = sixesCat(); play(c3, 'ch08-fours');
  const r = play(c3, 'ch08-gone', null, { all: 9000 });
  assert.deepEqual([ks(r), r[0].balloons.map(b => b.who)], [['4x7'], ['tallyheart']]);
  assert.deepEqual(E.hardFacts(c3, 4, STORIES), []);
});

test('Hail’s riddle and Snip’s share, the build notes’ tests: three dogs and Hail, four paws each, her help and her fillers (two dogs and three dogs, the other way round after a missed twenty-eight); Snip’s two marks a night in the mud, 2 × 1 then 2 × 2, in Riffle’s words on the kept path with “That one again!”', () => {
  const hailCat = gone => { const c = sixesCat(); play(c, 'ch08-fours'); play(c, 'ch08-gone', gone); return c; };
  const h = play(hailCat(), 'ch08-hail', { '4x4': [12, 12] });
  assert.deepEqual(ks(h), ['4x4✗', 'F:2x4', 'F:3x4', 'R:4x4✗', 'F:2x4', 'F:3x4', 'R:4x4']);
  assert.deepEqual([h[0].picture.kind, h[0].picture.groups, h[0].picture.who], ['dogs', 4, [{ who: 'dog', variant: 1 }, { who: 'dog', variant: 2 }, { who: 'dog', variant: 3 }, { who: 'hail' }]]);
  assert.match(A.countsPicture(Object.assign({ look: {} }, h[0].picture)), /4 animals, four paws each/);
  assert.deepEqual([h[0].help.picture, h[0].help.nums, h[0].help.intro, h[0].line], [true, [4, 8, 12, 16], 'Hop by fours! Four, eight…', MISS]);
  assert.deepEqual(h[0].prompt.map(p => [p.label, p.text]), [['The speckled dragonet', 'How many paws go round and round this field?']]);
  assert.deepEqual(h.filter(x => x.q.filler).slice(0, 2).map(x => [x.prompt.map(p => p.label + ': ' + p.text).join(' '), x.picture.kind, x.picture.groups]), [
    ['The speckled dragonet: An easy one! Two dogs. How many paws?', 'dogs', 2], ['The speckled dragonet: An easy one! Three dogs. How many paws?', 'dogs', 3]], 'two dogs, then three dogs, drawn as dogs');
  assert.ok(!h.some(x => ['4x5', '4x6'].includes(pairKey(x.k))), 'never five or six animals: the field has four');
  assert.deepEqual(h[3].prompt.map(p => p.text), ['Here’s that one again.', 'How many paws go round and round this field?']);
  assert.deepEqual(h[6].balloons.map(b => [b.who, b.text]), [['hail', 'SIXTEEN! Did you count them? ALL of them? Can I count YOURS?']], 'the right line kept on a retry');
  assert.deepEqual(ks(play(hailCat({ '4x7': [24] }), 'ch08-hail', { '4x4': [12] })), ['4x4✗', 'F:3x4', 'F:2x4', 'R:4x4'], 'the other way round after a missed twenty-eight (her sibling borrowed from the same lesson)');
  // Snip's share, told and kept
  const snipCat = () => { const c = hailCat(); return c; };
  const told = play(snipCat(), 'ch08-snip', { '2x7': [12, 12] });
  assert.deepEqual(ks(told), ['2x7✗', 'F:2x1', 'F:2x2', 'R:2x7✗', 'F:3x2', 'F:4x2', 'R:2x7'], 'one night, then two nights; a second miss three and four');
  assert.deepEqual([told[0].picture.kind, told[0].picture.ground, told[0].picture.groups, told[0].picture.per], ['marks', 'mud', 7, 2]);
  assert.deepEqual([told[0].help.nums, told[0].help.intro, told[0].line], [[2, 4, 6, 8, 10, 12, 14], 'Let’s hop it together. Two, four…', MISS]);
  assert.deepEqual(told.slice(1, 3).map(x => x.prompt.map(p => p.label + ': ' + p.text).join(' ')), ['Tallyheart: An easy one. One night. How many pieces?', 'Tallyheart: An easy one. Two nights. How many pieces?']);
  assert.deepEqual(told[3].prompt.map(p => p.text), ['Here’s that one again.', 'You scratch two marks a night, for seven nights. How many did Snip carry?']);
  const kept = play(snipCat(), 'ch08-riffle', { '2x7': [12, 12, 12] });
  assert.deepEqual([kept[0].help.intro, kept[0].line], ['Hop by twos! Two, four…', 'There! Again in a bit.']);
  assert.deepEqual(kept.slice(1, 3).map(x => x.prompt.map(p => p.label + ': ' + p.text).join(' ')), ['Riffle: An easy one! One night. How many pieces?', 'Riffle: An easy one! Two nights. How many pieces?'], 'in Riffle’s words');
  assert.deepEqual(kept[3].prompt.map(p => [p.label, p.text]), [['Riffle', 'That one again!'], [null, 'You scratch two marks a night, for seven nights. How many did Snip carry?']]);
  assert.equal(kept.filter(x => x.k.endsWith('2x7✗')).pop().line, 'There! Now you’ve seen it.', 'his last miss');
  kept.forEach(x => assert.equal(x.teacher, 'riffle', x.k));
  [told, kept].forEach(rows => rows.filter(x => x.k === 'R:2x7').forEach(x => assert.deepEqual(x.balloons.map(b => [b.who, b.kind, b.text]), [['player', 'whisper', 'Fourteen!']], 'her whisper, the same on the retry')));
  // no story question ever falls back on a sentence of the engine's but the shared openings and miss lines
  [h, told, kept].forEach(rows => saidIn(rows).forEach(l => assert.ok(!DEFAULTS.includes(l) || ['Here’s that one again.', MISS, LAST].includes(l), l)));
  // a miss is a 2s and a 7s hard fact
  const c7 = snipCat(); play(c7, 'ch08-snip', { '2x7': [12] });
  assert.ok(E.hardFacts(c7, 7, STORIES).some(p => pairKey(p.join('x')) === '2x7'));
});

// A lesson answered by position: `plan[i]` 0 is a wrong answer to the i-th question, anything else (or past the
// plan's end) right. Each row: its key (F: a filler, R: a retry, ✗ missed), the question and its prompt's words.
function playPlan(cat, setId, plan, ms) {
  const home = homeOf(setId), { def, state } = E.chapterLesson(cat, home, setId, 1, STORIES), out = [];
  for (let i = 0; !E.counts.done(state) && i < 60; i++) {
    const q = E.counts.question(state), D = E.questionDef(def, q, home, STORIES), right = plan[i] !== 0;
    const words = E.promptLines(def, D, q).map(l => l.text).join(' ');
    const r = E.counts.answer(state, D, right ? q.answer : q.answer + 1, ms || 2000, 1);
    E.logAnswer(cat, r.entry);
    out.push({ k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + q.a + 'x' + q.b + (r.correct ? '' : '✗'), q, words, correct: r.correct });
    if (r.done) E.recordLesson(cat, state);
  }
  return out;
}

test('the fillers that lend a set its own fact (the spec\'s section 7, items 14 and 15), pinned: Hail\'s riddle lends 4 × 4 back only after three misses, as “An easy one! Four dogs.”; the warm-up lends its own 2 × 6 only after two misses (a hard 5 × 6) or three, and never 6 × 6', () => {
  const N = 8, plans = [];
  for (let m = 0; m < (1 << N); m++) { const p = []; for (let i = 0; i < N; i++) p.push((m >> i) & 1 ? 0 : 1); plans.push(p); }
  const firstOwn = (rows, pair) => { const i = rows.findIndex(r => r.q.filler && pairKey(r.k) === pair); return i < 0 ? null : { i, misses: rows.slice(0, i).filter(r => !r.correct).length, row: rows[i] }; };
  // Hail's: after a right twenty-eight and after a missed one (her sibling borrows from the same lesson)
  for (const gone of [null, { '4x7': [24] }]) {
    const base = sixesCat(); play(base, 'ch08-fours'); play(base, 'ch08-gone', gone);
    let fewest = Infinity, reached = 0;
    for (const plan of plans) {
      const hit = firstOwn(playPlan(clone(base), 'ch08-hail', plan), '4x4');
      if (!hit) continue;
      reached++;
      fewest = Math.min(fewest, hit.misses);
      assert.ok(hit.misses >= 3, 'Hail lends 4 × 4 back after only ' + hit.misses + ' misses: ' + plan.join(''));
      assert.equal(hit.row.words, 'An easy one! Four dogs. How many paws?', 'the words the spec records');
    }
    if (!gone) assert.equal(fewest, 3, 'three misses is the fewest that reaches it (the spec\'s item 14; an engine fix in chapter 9 would make this none)');
    assert.ok(reached < plans.length / 2, 'a rare path: ' + reached + ' of ' + plans.length);
  }
  // the warm-up's: a hard 5 × 6 from chapter 7, a hard 6 × 8, and nothing hard
  for (const [sixes, least] of [[{ '5x6': [29] }, 2], [{ '6x8': [47] }, 3], [undefined, 3]]) {
    const base = sixesCat(sixes);
    let fewest = Infinity;
    for (const plan of plans) {
      const rows = playPlan(clone(base), 'ch08-sixes', plan), hit = firstOwn(rows, '2x6');
      assert.ok(!rows.some(r => r.q.filler && pairKey(r.k) === '6x6'), 'never 6 × 6 as a filler: ' + rows.map(r => r.k).join(' '));
      if (!hit) continue;
      fewest = Math.min(fewest, hit.misses);
      assert.ok(hit.misses >= least, JSON.stringify(sixes) + ': 2 × 6 lent back after only ' + hit.misses + ' misses: ' + rows.map(r => r.k).join(' '));
      assert.match(hit.row.words, /^One from yesterday\. /, 'as “One from yesterday.”');
    }
    assert.equal(fewest, least, JSON.stringify(sixes) + ': the fewest misses that reach it (the spec\'s item 15)');
  }
});

test('the Training Hollow after chapter 8: it offers “Paws · the 4s” (the 4s are `ch08-fours`, the first set with the most facts on table 4), Tallyheart says “fours” there and asks in cats, and the tree has eight marks; the 4s are learned at the lesson, not before it', () => {
  assert.deepEqual(E.countSets(STORIES).map(x => [x.table, x.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines'], [3, 'ch06-threes'], [6, 'ch07-sixes'], [4, 'ch08-fours']]);
  assert.deepEqual([E.countFor(4, STORIES).setId, E.countName(E.countFor(4, STORIES).def, 4)], ['ch08-fours', 'Paws · the 4s']);
  assert.deepEqual([E.countFor(10, STORIES).setId, E.countFor(6, STORIES).setId, E.countFor(2, STORIES).setId], ['ch04-tens', 'ch07-sixes', 'ch02-ears'], 'the pile, the warm-up and Snip’s share teach nothing new');
  const cat = fresh();
  read(cat, {});
  assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3, 6, 4]);
  assert.deepEqual(E.hollowLines(cat, STORIES).counts.map(x => x.name), ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s', 'Nine lives · the 9s', 'Patrols · the 3s', 'Whiskers · the 6s', 'Paws · the 4s']);
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, STORIES).opts.marks, 8);
  assert.ok(8 <= E.MAX_MARKS);
  const def = E.hollowDef(STORIES, 4);
  assert.deepEqual([E.hollowRoundLine(def), E.hollowWord(def), def.teacher, def.thing], ['A round of fours. Ready? Here we go.', 'fours', 'tallyheart', 'paw']);
  const R = E.hollowStart(cat, STORIES, 1, 4), asked = [];
  for (let q; (q = E.counts.question(R.state));) {
    asked.push(pairKey(q.a + 'x' + q.b));
    const D = E.questionDef(R.def, q, story, STORIES), pic = E.lessonPicture(D, q, 0);
    assert.ok(pic.groups >= 1 && pic.groups <= 10 && pic.thing === 'paw', q.a + '×' + q.b + ': in cats');
    assert.equal(E.promptLines(R.def, D, q).map(l => l.text).pop().replace(/^.*\. /, ''), 'How many paws?', q.a + '×' + q.b);
    E.counts.answer(R.state, R.def, q.answer, 2000, 1);
  }
  assert.deepEqual(asked.sort(), ['1x4', '2x4', '3x4', '4x4', '4x5', '4x6', '4x7', '4x8', '4x9', '4x10'].sort());
  // not before the lesson: the warm-up and the paws done, the Hollow offers no 4s and the tree has seven marks;
  // the eighth is scratched straight after
  const marks = c => E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, c, STORIES).opts.marks;
  const lesson = countsAt('ch08-fours')[0];
  const c1 = fresh(); read(c1, { stop: lesson });
  assert.ok(c1.lessons['ch08-sixes'] && !c1.lessons['ch08-fours']);
  assert.ok(!E.hollowLines(c1, STORIES).counts.some(x => x.table === 4), 'no “Paws · the 4s” yet');
  assert.equal(marks(c1), 7);
  const c2 = fresh(); read(c2, { stop: TREE });
  assert.equal(marks(c2), 8);
  assert.equal(frames[TREE].scene.opts.marks, 8, 'the frame that scratches it');
  assert.equal(exits(frames[lesson])[0], TREE, 'straight after the lesson');
});

/* ------------------------------------------------------------------ her Case File */

test('her Case File: the four cards as the spec’s table has them; given once each, on their frames, in order, on every path; the rows they make (the brag over FLEW’s row with a line of its own for Sleet’s den, the stash at the end of the two robbed piles, the glass touching the “scale”); Hail’s alone; all four under the moss', () => {
  assert.deepEqual(Object.keys(story.cards), CARD_IDS);
  assert.deepEqual(story.cards, {
    'hail-shapes': { mark: 'ear', line: 'Hail says two skinny shapes cross her field every night, toward the tracks.', when: { foundHail: true } },
    'fox-brag': { mark: 'ear', line: 'Reynard calls ‘It FLEW off’ his little story. He wants the dry den.',
      link: { with: ['fox-flew', 'sleet-den'], line: 'He said FLEW. Now he calls it a story.', lines: { 'sleet-den': 'The same fine, dry den.' } } },
    stash: { mark: 'eye', line: 'The weasels have a stash: our prey, and ReedClan’s.', link: { with: ['reed-pile'], line: 'Two piles robbed. One stash.' } },
    glass: { mark: 'eye', line: 'A heap of glass in the weasels’ stash, just like the ‘scale’.', link: { with: ['scale'], line: 'It’s not a scale. It’s GLASS.' } }
  });
  CARD_IDS.forEach(cid => { assert.ok(words(story.cards[cid].line) <= 13, cid); assert.equal(story.cards[cid].answers, undefined, cid + ': no answers (chapter 10’s)'); assert.equal(story.cards[cid].picture, undefined, cid + ': drawn under its own id'); });
  // where each is given: one frame each
  assert.deepEqual(ids.filter(id => frames[id].card).map(id => [frames[id].card, id]), [
    ['hail-shapes', F(/Are you following the skinny ones\?/)], ['fox-brag', F(/^He laughs, a soft little yip\./)], ['stash', F(/^Mice and voles, in tidy rows\./)], ['glass', F(/It’s not a scale\. It’s GLASS\.$/)]]);
  // no card's line is said on its frame, so each is lettered
  ids.filter(id => frames[id].card).forEach(id => assert.ok(E.cardsOn(frames[id], { flags: { foundHail: true } }, story, STORIES).every(c => c.showLine && c.showMark), id));
  // in a reading: three new cards, or four with Hail, once each, in order, on every path
  for (const c of SOME.slice(0, 30)) {
    const cat = fresh(c.flags), before = cat.cards.length;
    read(cat, c.o);
    assert.deepEqual(cat.cards.slice(before).map(k => k.id), (c.way === 'hail' && !c.before ? ['hail-shapes'] : []).concat(['fox-brag', 'stash', 'glass']), comboName(c));
    assert.ok(cat.cards.slice(before).every(k => k.chapter === 'ch08'));
    assert.equal(new Set(cat.cards.map(k => k.id)).size, cat.cards.length);
    assert.equal(E.cards(cat, STORIES).some(k => k.id === 'hail-shapes'), !!cat.flags.foundHail, comboName(c) + ': Hail’s card only with her');
  }
  // the rows: every cat who read chapter 7's FLEW screen has can't fly — FLEW — the brag, and a cat who found
  // Sleet his den at its end; the two robbed piles and the stash; the “scale” and the glass
  const rows = cat => E.caseFile(cat, STORIES).links.map(l => [l.cards.map(k => k.id).join(' — '), (l.lines || [l.line]).join(' | ')]);
  const plain = reading({ specialty: 'sneaking' }, {}).cat;
  assert.deepEqual(rows(plain).filter(r => /fox-brag|stash|glass/.test(r[0])), [
    ['cant-fly — fox-flew — fox-brag', 'They can’t both be true. | He said FLEW. Now he calls it a story.'],
    ['tidy — reed-pile — stash', 'Two piles. Both left tidy. | Two piles robbed. One stash.'],
    ['scale — glass', 'It’s not a scale. It’s GLASS.']]);
  const sleet = reading({ specialty: 'sneaking', foundSleet: true }, {}).cat;
  assert.ok(rows(sleet).some(r => r[0] === 'cant-fly — fox-flew — fox-brag — sleet-den' && r[1] === 'They can’t both be true. | He said FLEW. Now he calls it a story. | The same fine, dry den.'), JSON.stringify(rows(sleet)));
  const noFlew = before8({ ch7Flew: false }); E.startChapter(noFlew, story, 500); read(noFlew, {});
  assert.ok(rows(noFlew).some(r => r[0] === 'fox-flew — fox-brag' && r[1] === 'He said FLEW. Now he calls it a story.'), 'a cat without ch7Flew (only a reread oddity): FLEW and the brag');
  // Hail's card lies alone (no link); the brag from the moment she holds it
  const hailed = reading({ specialty: 'sneaking' }, { route: 1, log: 0 }).cat;
  assert.ok(!rows(hailed).some(r => /hail-shapes/.test(r[0])), 'Hail’s card is in no row');
  const half = fresh(); read(half, { stop: F(/^He laughs, a soft little yip\./) });
  assert.ok(rows(half).some(r => /fox-flew — fox-brag/.test(r[0])), 'from the moment she holds it');
  // every card in a link is counted once, and none is lost
  [plain, sleet, hailed].forEach(cat => {
    const Fl = E.caseFile(cat, STORIES), all = Fl.groups.reduce((a, g) => a.concat(g.cards), []).concat(Fl.links.reduce((a, l) => a.concat(l.cards), [])).map(k => k.id);
    assert.deepEqual(all.slice().sort(), E.cards(cat, STORIES).map(k => k.id).sort());
  });
  // her nest at bedtime: all four under the moss on every path (the den's `hidden`), her glass with them; she
  // holds 20 to 28 cards, eight to ten secret
  [[{ ch3Told: true }, {}], [{ ch3Told: false }, { route: 1, log: 0 }], [{ ch3Told: true }, {}, { noMyCount: true }]].forEach(([flags, o, co]) => {
    const cat = reading(flags, o, co).cat, sc = E.resolveScene(frames[NEST].scene, cat, STORIES);
    const secret = sc.opts.bark.filter(b => A.barkSecret[b.picture]).map(b => b.picture);
    CARD_IDS.filter(cid => E.hasCard(cat, cid) && E.cards(cat, STORIES).some(k => k.id === cid)).forEach(cid => assert.ok(secret.includes(cid), cid + ' under the moss'));
    assert.ok(cat.cards.length >= 20 && cat.cards.length <= 28, cat.cards.length + ' cards');
    assert.ok(secret.length >= 8 && secret.length <= 10, secret.length + ' under the moss');
    assert.deepEqual([sc.opts.hidden, sc.opts.glass], [true, true]);
    const svg = A.render(sc, { look: { fur: 'grey', sex: 'she', marking: 'none', eyes: 'green' } }).svg;
    assert.equal((svg.match(/data-bark="corner"/g) || []).length, secret.length, 'a corner showing for each secret');
    assert.match(svg, /data-prop="nest-glass"/, 'and her glass');
  });
  assert.match(T(NEST), /And under the moss, in its leaf, your glass\./, 'true of every cat');
});

test('Hail, through the engine: “Who’s in the log?” finds her, her riddle, her card, her page and the flag on her last screen; “Not tonight.” sets nothing; Back before her last screen, then “Not tonight.”, leaves nothing; a second reading has her label, and the chase carries her even through the tunnel', () => {
  const lastT = F2(/^Tell Sprinkle: five!/);
  // found: her scene, her riddle, her card, the flag on its last frame
  const a = reading({ specialty: 'sneaking' }, { route: 1, log: 0 });
  assert.deepEqual(a.ids.filter(id => HAIL_SCENE.includes(id)), HAIL_SCENE.filter(id => !same(frames[id].when, KEPT) && !frames[id].when || same(frames[id].when, TOLD)), 'every panel of the told path’s scene (no other dragonet found)');
  assert.deepEqual([a.cat.flags.foundHail, E.hasCard(a.cat, 'hail-shapes'), !!a.cat.lessons['ch08-hail']], [true, true, true]);
  assert.ok(HAIL_SCENE.filter(id => !lastT.includes(id)).every(id => !frames[id].sets), 'never a choice, never her first sight: the flag is the last frame’s');
  assert.deepEqual(rowAt(a.rows, countsAt('ch08-hail')[0]).lesson.map(l => l.k), ['4x4']);
  assert.deepEqual(rowAt(a.rows, LOG).options, ['“Who’s in the log?”', '“Not tonight. Keep going.”']);
  assert.match(a.w, /Hail: Tell Sprinkle: five! And tell her I’m the BOUNCIEST!/);
  assert.match(a.w, /Hail: DOGS! SQUIRRELS! THAT way!/, 'she calls her dogs at the chase');
  // not tonight: the white head ducks back in; nothing set; no Hail anywhere after
  const b = reading({ specialty: 'climbing', ch3Told: false }, { route: 1, log: 1 });
  assert.ok(!b.cat.flags.foundHail && !E.hasCard(b.cat, 'hail-shapes') && !b.cat.lessons['ch08-hail']);
  assert.deepEqual(b.ids.filter(id => HAIL_SCENE.includes(id)), []);
  assert.doesNotMatch(b.w, /\bHail\b/, 'her name is nowhere');
  assert.match(b.w, /The white head ducks back in\./);
  assert.ok(!E.dragonets(b.cat, STORIES).found.some(d => d.id === 'hail'), 'no page');
  // Back from any frame of her scene before her last, then “Not tonight.”: no flag, no card in her file, no page
  HAIL_SCENE.filter(id => (!frames[id].when || same(frames[id].when, TOLD)) && !lastT.includes(id)).forEach(stop => {
    const cat = fresh({ specialty: 'sneaking' });
    read(cat, { route: 1, log: 0, stop });
    while (cat.frame !== LOG) assert.ok(E.back(cat, story), stop);
    read(cat, { route: 1, log: 1 });
    assert.ok(!cat.flags.foundHail, stop);
    assert.ok(!E.cards(cat, STORIES).some(k => k.id === 'hail-shapes'), stop + ': no card in her file');
    assert.ok(!E.dragonets(cat, STORIES).found.some(d => d.id === 'hail'), stop + ': no page in her book');
    assert.ok(!E.buildFullBook(cat, STORIES).pages.some(pg => /Hail/.test(pg.recap.join(' '))), stop);
  });
  // sticky: Back after her last frame keeps her; a second reading reads the flag, with her label, and the chase
  // has her at the fence even through the tunnel (true: she did find Hail in chapter 8)
  const d = fresh({ specialty: 'sneaking' });
  read(d, { route: 1, log: 0, stop: HOLES });
  assert.ok(E.back(d, story) && d.flags.foundHail);
  read(d, { route: 1, log: 0 });
  E.startChapter(d, story, 9000);
  const second = read(d, { route: 0, t: 9000 });
  assert.match(readWords(second), /Hail: DOGS! SQUIRRELS! THAT way!/);
  E.startChapter(d, story, 9500);
  const third = read(d, { route: 1, log: 0, t: 9500 });
  assert.deepEqual(rowAt(third, LOG).options, ['“Go and see Hail again.”', '“Not tonight. Keep going.”']);
  assert.equal(d.cards.filter(k => k.id === 'hail-shapes').length, 1);
  // her page: the sixth dragonet's, bouncing
  assert.deepEqual(E.dragonets(a.cat, STORIES).found.map(dn => dn.id + (dn.pose ? ':' + dn.pose : '')).slice(-1), ['hail:bounce']);
  // a cat who found the others tells her, name by name
  const e = reading(Object.assign({ specialty: 'sneaking' }, FOUND_ALL), { route: 1, log: 0 });
  assert.match(e.w, /Moonpaw: And I’ve found more of you!\nHail: MORE\? WHO\? Tell me EVERYTHING!\n\nYou tell her, name by name\.\nHail: Are you following the skinny ones\?/);
});

/* ------------------------------------------------------------------ the Taps and the questions */

test('the Taps that count log nothing: her paws, the rim’s paws, the bedtime paws; nor do the one-tap pages or Tallyheart’s seven Counts; 15 typed answers on every path, 16 with Hail', () => {
  for (const [flags, o, n] of [[{ ch3Told: true }, {}, 15], [{ ch3Told: false, specialty: 'climbing' }, { route: 1, log: 1 }, 15], [{ ch3Told: false }, { route: 1, log: 0 }, 16]]) {
    const cat = fresh(flags), n0 = cat.counts.length;
    const rows = read(cat, o);
    rows.forEach((x, i) => { if (['skip', 'scratch', 'ask', 'next', 'choice'].includes(x.kind) && rows[i + 1]) assert.equal(rows[i + 1].counts, x.counts, x.id + ' logs nothing'); });
    assert.deepEqual(rows.filter(x => x.kind === 'skip').map(x => [x.skip.table, x.skip.groups]), [[2, 2], [4, 5], [4, 2]]);
    rows.filter(x => x.kind === 'scratch').forEach(x => { assert.deepEqual(x.scratched, [], x.id); assert.equal(x.tap.kind, 'tap', x.id); });
    assert.equal(cat.counts.length - n0, n, JSON.stringify(flags) + ': typed answers');
  }
});

test('a big number is on a page only straight after a count she made: the 4 over her paws, kept while Tallyheart says a four is two twos; the 8 after the bedtime paws; never after the rim’s paws', () => {
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
  const [pawsPair, , bed] = ids.filter(id => frames[id].skip);
  assert.deepEqual([...carried].sort(), [bed + ':8', pawsPair + ':4'].sort());
  assert.deepEqual(ids.filter(id => E.keptSkip(story, id)), [frames[pawsPair].skip.next, frames[frames[pawsPair].skip.next].next], 'her paws stay up on the one page after (and the rim’s paws after it, a skip of its own, end the kept run)');
  assert.ok(frames[frames[frames[pawsPair].skip.next].next].skip, 'the rim’s paws: a skip of its own');
});

test('Tallyheart’s seven Counts: a Tap that counts nothing; her question and our cat’s answer, seven times, one for every mark on the tree; the fours she already knows are hers to say; the tree does not change', () => {
  const askId = ids.find(id => frames[id].ask), f = frames[askId], ak = f.ask;
  assert.deepEqual([E.kindOf(f), E.exits(f)], ['ask', [countsAt('ch08-fours')[0]]]);
  assert.deepEqual(E.askView(ak, 0), { taps: 0, total: 7, done: false, who: 'tallyheart', to: 'player', pair: null, before: [], owed: 0 });
  for (let n = 1; n <= 7; n++) {
    const v = E.askView(ak, n);
    assert.deepEqual([v.pair, v.before.length, v.done], [ak.pairs[n - 1], n - 1, n === 7]);
    const sc = E.askScene(f.scene, ak, n);
    assert.deepEqual([sc.opts.marks, sc.opts.glow], [7, 'auto'], 'the seven claw marks, unchanged');
    assert.deepEqual(sc.cast, f.scene.cast);
  }
  assert.equal(ak.pairs.length, frames[askId].scene.opts.marks, 'one from every mark on this tree');
  // the answers are the fours she has met: 4 × 1 (tails), 4 × 2 (ears), 4 × 5 and 4 × 10 (claws), 4 × 9 (lives),
  // 4 × 3 (guards), 4 × 6 (her own count, the twenty-four)
  const N = { four: 4, eight: 8, twenty: 20, forty: 40, 'thirty-six': 36, twelve: 12, 'twenty-four': 24 };
  assert.deepEqual(ak.pairs.map(p => N[(/(four|eight|twenty-four|twenty|forty|thirty-six|twelve)\b/.exec(p[1].replace(/^Four (cats|forepaws|patrols|cheeks), /, '')) || [])[1]]), [4, 8, 20, 40, 36, 12, 24]);
  ak.pairs.forEach(p => assert.ok(words(p[0]) <= 3 && words(p[1]) <= 8, p.join(' ')));
  const rd = reading({ specialty: 'sneaking' }, {}), x = rowAt(rd.rows, askId), next = rowAt(rd.rows, ak.next);
  assert.deepEqual(x.asked, ak.pairs);
  assert.equal(next.counts - x.counts, 0);
  assert.deepEqual(next.lesson.map(l => l.k), ['2x4', '4x5', '4x4', '3x4', '4x7', '4x8', '4x6', '7x4', '8x4', '10x4']);
});

/* ------------------------------------------------------------------ the book */

function recapFor(flags) { return story.book.recap.filter(x => !x.when || E.matches(x.when, { flags })); }
const sentences = t => t.split(/(?<=[.!?])\s+(?=\p{Lu}|\{|“)/u).length;

test('book: title, chapter title, seven entries (eight with Hail) and 6 to 10 sentences on every path, true on each, nothing about the route she took; the dream and the night it stayed under the moss; Hail’s page only for a cat who found her', () => {
  const b = story.book;
  assert.deepEqual(Object.keys(b).sort(), ['chapterTitle', 'dragonet', 'dream', 'noDream', 'recap', 'title']);
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'The Night Trail');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.equal(b.noDream, '{name}paw’s dream that night stayed under the moss.');
  b.recap.forEach((x, i) => {
    assert.deepEqual(Object.keys(x).filter(k => !['text', 'when'].includes(k)), [], 'recap ' + i);
    if (x.when) assert.ok(same(x.when, TOLD) || same(x.when, KEPT) || same(x.when, HAIL), 'recap ' + i + ': by path, or Hail');
    assert.match(x.text, /[.!?”’]$/);
    assert.ok(words(x.text) <= 32, 'recap ' + i + ': ' + words(x.text));
    assert.doesNotMatch(x.text, /\byou\b/i, 'third person');
    // nothing says which way she went: no tunnel, no field but where she found Hail
    if (!same(x.when, HAIL)) assert.doesNotMatch(x.text, /tunnel|Barking Field|\bfield\b|fence|underground/i, 'recap ' + i + ': the route');
  });
  [[TOLD, 'told'], [KEPT, 'kept'], [{}, 'unset (kept)'], [{ ch3Told: true, foundHail: true }, 'told, Hail'], [{ ch3Told: false, foundHail: true }, 'kept, Hail']].forEach(([flags, name]) => {
    const rc = recapFor(flags);
    assert.equal(rc.length, flags.foundHail ? 8 : 7, name);
    const n = rc.reduce((m, x) => m + sentences(x.text), 0);
    assert.ok(n >= 6 && n <= 10, name + ': ' + n + ' sentences');
    const all = rc.map(x => x.text).join(' ');
    // true on its path: the trail with Tallyheart (who heard them and let them go) or with Riffle; Tallyheart
    // waiting at home on the kept path, the dragonets kept back
    assert.equal(/\{name\}paw and Tallyheart, who had heard the thieves come and let them go/.test(all), flags.ch3Told === true, name);
    assert.equal(/\{name\}paw and Riffle followed the thieves’ trail/.test(all), flags.ch3Told !== true, name);
    assert.equal(/told her everything but the dragonets/.test(all), flags.ch3Told !== true, name);
    assert.equal(/found Hail/.test(all), !!flags.foundHail, name);
    assert.match(all, /The “scale” was only ever glass/, name);
    assert.doesNotMatch(all, /\bthey\b/i, name + ': no “they” a child could take for the wrong ones');
  });
  // a she-cat's and a tom's pages through the engine; the cat named wherever a tom's “he” could mean another
  const page = (cat, id) => E.buildFullBook(cat, STORIES).pages.find(p => p.id === id).recap.join(' ');
  const told = reading({ specialty: 'sneaking' }, {}).cat, kept = reading({ specialty: 'sneaking', ch3Told: false }, { route: 1, log: 0 }).cat;
  assert.match(page(told, 'ch08'), /That night, Moonpaw and Tallyheart, who had heard the thieves come and let them go, followed the trail all the way to the weasel holes by the train tracks\./);
  assert.match(page(kept, 'ch08'), /In the Barking Field, Moonpaw found Hail, a bouncy speckled dragonet/);
  assert.match(page(kept, 'ch08'), /Tallyheart was waiting at home, more scared than cross, and Moonpaw told her everything but the dragonets\./);
  assert.deepEqual([E.buildBook(story, told).recap.length, E.buildBook(story, kept).recap.length], [7, 8]);
  assert.equal(E.buildBook(story, told).chapter, 'Chapter 8: The Night Trail');
  const tom = fresh({ specialty: 'sneaking' }); tom.look.sex = 'tom';
  read(tom, { dream: '' });
  assert.match(page(tom, 'ch08'), /Tallyheart taught Moonpaw his eighth Count, paws: the fours\. A four is two twos\./);
  assert.doesNotMatch(page(tom, 'ch08'), /\{|\}/);
  assert.equal(E.buildFullBook(tom, STORIES).pages.find(p => p.id === 'ch08').dream, 'Moonpaw’s dream that night stayed under the moss.');
  assert.equal(E.buildFullBook(told, STORIES).pages.find(p => p.id === 'ch08').dream, 'Moonpaw’s dream: “A tunnel full of weasels.”');
  // Hail's page: the sixth dragonet's, only for a cat who found her
  assert.deepEqual(b.dragonet, [{ id: 'hail', name: 'Hail', when: { foundHail: true }, pose: 'bounce', lines: [
    'White with grey speckles, and the bounciest of the clutch.',
    '{name}paw found her in a hollow log in the Barking Field, where the dogs think she is a dog.',
    'She says five, and that she’s the BOUNCIEST. Five more claws, counted.'] }]);
  assert.ok(A.vocab.otherPoses.hail.includes(b.dragonet[0].pose));
  const found = E.dragonets(kept, STORIES).found;
  assert.deepEqual(found.find(d => d.id === 'hail'), { id: 'hail', name: 'Hail', lines: ['White with grey speckles, and the bounciest of the clutch.', 'Moonpaw found her in a hollow log in the Barking Field, where the dogs think she is a dog.', 'She says five, and that she’s the BOUNCIEST. Five more claws, counted.'], chapter: 'ch08', pose: 'bounce' });
  assert.ok(!E.dragonets(told, STORIES).found.some(d => d.id === 'hail'), 'no page without her');
  assert.equal(E.buildBook(ch07, told).chapter, 'Chapter 7: The Counts Don’t Lie', 'the pages before are as they were');
});

test('the teaser for chapter 9, curious and never scary, with no number; chapter 7’s for this one stands, and both its promises are kept', () => {
  assert.deepEqual(story.teaser, { title: 'Chapter 9: Featherlight', lines: ['Sprinkle has to fly by the full moon.', 'How do you mend a dragon’s wing?'] });
  story.teaser.lines.forEach(l => assert.ok(words(l) <= 25, l));
  assert.doesNotMatch(story.teaser.lines.join(' '), /\d|twenty|sixty|weasel|thief|robbed|stolen|scary|monster|hurt/i, 'no number, no answer');
  const cat = E.blankCat({}); cat.name = 'Moon';
  // chapter 9 is in the game now, built (2026-10-25; its stub from 2026-10-24): the hub offers it; read with chapters 1
  // to 8 only, it is still "coming soon". Its teaser's words stand: chapter 9 keeps both promises (tests/story-ch09.test.js)
  assert.ok(PC.story.ch09, 'chapter 9 is in the game');
  assert.ok(Object.values(PC.story.ch09.frames).every(f => !/^STUB\b/.test(f.board || '')), 'built, not the stub');
  assert.equal(E.chapterHeading(PC.story.ch09), story.teaser.title, 'the teaser’s title is chapter 9’s');
  assert.deepEqual(E.teaser(story, cat, PC.story), { title: 'Chapter 9: Featherlight', lines: story.teaser.lines, built: true, next: 'ch09' }, 'chapter 9 is in: the hub offers it');
  assert.deepEqual(E.teaser(story, cat, STORIES), { title: 'Chapter 9: Featherlight', lines: story.teaser.lines, built: false, next: null }, 'without it, coming soon');
  // the hook it carries on: whatever the Clans decide, Sprinkle has to fly, and her wing still won't lift
  assert.match(T(F(/^Whatever the Clans decide/)), /How do you mend a dragon’s wing\?/);
  // chapter 7's teaser stands, its title this chapter's, and both its promises are kept: a trail in the dark,
  // and where the tunnel comes out (seen on the tunnel route; found from the other end round the field)
  assert.deepEqual(ch07.teaser, { title: 'Chapter 8: The Night Trail', lines: ['Tomorrow night, a trail in the dark.', 'Where does that tunnel come out?'] });
  assert.equal(E.chapterHeading(story), ch07.teaser.title);
  assert.match(T(F2(/^At last: moonlight!/)[0]), /So THAT’S where it comes out!/);
  assert.match(T(HOLES), /All along the bank are holes, like the one under your pile\./);
  assert.match(T(DUSK), /The camp turns silver\./, 'the night trail');
  const done = reading({ specialty: 'sneaking' }, {}).cat, p = E.progress(done, PC.story);
  assert.deepEqual([p.latest.id, p.next && p.next.id, p.soon, E.status(done, PC.story)], ['ch08', 'ch09', null, 'Chapter 8 finished']);
  const c7 = E.blankCat({}); c7.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4, ch05: 5, ch06: 6, ch07: 7 };
  assert.deepEqual([E.progress(c7, PC.story).next.id, E.chapterHeading(E.progress(c7, PC.story).next)], ['ch08', 'Chapter 8: The Night Trail']);
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean and fill renders the same text; chapters 1 to 7 are sound beside it', () => {
  assert.deepEqual(E.checkStory(story, PC.story), []);
  assert.deepEqual(E.checkStory(story, STORIES), []);
  assert.ok(E.checkStory(story).length > 0, 'chapter 8 leans on chapters 2 to 7 (the cards it touches, the sets it borrows from)');
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind], cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
  [PC.story.ch01, PC.story.ch02, PC.story.ch03, ch04, ch05, ch06, ch07].forEach(s => assert.deepEqual(E.checkStory(s, PC.story), [], s.id));
});

test('every kind of cat on a spread of routes plays through the engine: the frames she walks, the flag, the lessons, the taps, her cards, the dream, the end, the book', (t) => {
  let readings = 0;
  for (const c of SOME) for (const light of [0, 1]) {
    const o = Object.assign({ light }, c.o), name = comboName(c) + ' light ' + light;
    const cat = fresh(c.flags);
    const counted = cat.counts.length, flags0 = Object.keys(cat.flags);
    const rows = read(cat, o), walked = idsOf(rows);
    readings++;
    assert.equal(rows[rows.length - 1].kind, 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch08'), name);
    rows.forEach(x => { if (x.kind !== 'end') assert.ok(x.caps.length + x.say.length + (x.sfx ? 1 : 0) + (x.options ? x.options.length : 0) + (x.tap ? 1 : 0) > 0, name + ' ' + x.id + ' shows nothing'); });
    assert.deepEqual(walked, walk(c.flags, Object.assign({ clean: true }, o)).slice(), name + ': the engine walks the same frames');
    assert.deepEqual(Object.keys(cat.flags).filter(k => !flags0.includes(k)).sort(), c.way === 'hail' && !c.before ? ['foundHail'] : [], name + ': no other flag is set');
    const done = Object.keys(cat.lessons).filter(k => /^ch08/.test(k)).sort();
    assert.deepEqual(done, ['ch08-fours', 'ch08-gone', 'ch08-pile', 'ch08-sixes', c.flags.ch3Told ? 'ch08-snip' : 'ch08-riffle'].concat(c.way === 'hail' ? ['ch08-hail'] : []).sort(), name);
    done.forEach(s => assert.ok(cat.lessons[s].finished && cat.lessons[s].noHelp, name + ': ' + s));
    assert.equal(cat.counts.length - counted, c.way === 'hail' ? 16 : 15, name + ': the typed answers; the taps never logged');
    assert.equal(cat.dreams.ch08, 'a tunnel full of weasels');
    assert.deepEqual(E.learnedCounts(cat, STORIES).map(x => x.table), [1, 2, 5, 10, 9, 3, 6, 4]);
    assert.equal(E.status(cat, STORIES), 'Chapter 8 finished');
    assert.ok(E.buildBook(story, cat).recap.length === (cat.flags.foundHail ? 8 : 7), name);
    rows.forEach(x => x.say.forEach(bl => assert.ok(bl.label && !/[{}]/.test(bl.label + bl.text), name + ' ' + x.id + ': ' + bl.label + ': ' + bl.text)));
    rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.forEach(p => { if (p.who) assert.equal(p.label, { riffle: 'Riffle', hail: 'The speckled dragonet', tallyheart: 'Tallyheart' }[p.who], name + ' ' + x.id); })));
    // what Read to me says: the captions with the sounds in words where they run on, on every page
    rows.forEach(x => assert.ok(!x.heard.some(h => /[{}]/.test(h)), name + ' ' + x.id));
    // the scenes resolve for her: her stone in every den; the tree's marks glow as she has earned them
    rows.filter(x => x.scene && x.scene.set === 'den').forEach(x => assert.equal(x.scene.opts.stone, c.flags.ch2Stone, x.id));
    rows.filter(x => x.scene && x.scene.set === 'hollow').forEach(x => assert.ok(Array.isArray(x.scene.opts.glow), x.id));
    assert.ok(E.back(cat, story));
  }
  t.diagnostic(readings + ' readings through the engine');
  assert.ok(readings >= 150);
  // with a miss on everything she still reaches the end, every retry and filler is asked, and every speaker of
  // a lesson's line is in that Counts frame's picture
  for (const ch3Told of [true, false]) {
    const cat = fresh({ specialty: 'noticing', ch3Told, worry: 'water' });
    const rows = read(cat, { route: 1, log: 0, answers: { '3x10': [13], '6x8': [40], '2x6': [11], '4x4': [12, 12], '4x7': [24, 24], '4x8': [28], '8x4': [28], '2x7': [12] } });
    assert.equal(rows[rows.length - 1].kind, 'end');
    const w = readWords(rows);
    ['Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.', 'Tallyheart: One from yesterday. Three cheeks. How many whiskers?',
      'Eight and eight: sixteen. There. We’ll come back to that one.', 'Two and two, every night. Fourteen and fourteen: twenty-eight. There. We’ll come back to that one.',
      'The speckled dragonet: An easy one! Two dogs. How many paws?', 'Hop by fours! Four, eight…',
      ch3Told ? 'Let’s hop it together. Two, four…' : 'Hop by twos! Two, four…', (ch3Told ? 'Tallyheart: An easy one.' : 'Riffle: An easy one!') + ' One night. How many pieces?'].forEach(line => assert.ok(w.includes(line), line));
    assert.deepEqual(Object.keys(cat.lessons).filter(k => /^ch08/.test(k)).sort(), ['ch08-fours', 'ch08-gone', 'ch08-hail', 'ch08-pile', 'ch08-sixes', ch3Told ? 'ch08-snip' : 'ch08-riffle'].sort());
    Object.keys(cat.lessons).filter(k => /^ch08/.test(k)).forEach(s => assert.equal(cat.lessons[s].noHelp, false, s + ': she needed the sand (or the marks) in every one'));
    rows.forEach(x => (x.lesson || []).forEach(l => l.prompt.concat(l.balloons).filter(y => y.who).forEach(y => assert.ok(castOf(x.id, y.who).length, x.id + ' ' + l.k + ': ' + y.who))));
    // (a cat who needed the sand says it plainly, and Tallyheart answers it warmly)
    assert.deepEqual(rowAt(rows, EIGHTH).say.map(b => b.text), ['Paws. That’s your eighth Count.', 'Some were tricky.', 'You worked every one out. Tomorrow, the new ones will be old ones.']);
  }
  // a save in the middle of the night goes through the store's own shape and comes back the same cat
  const mid = fresh({ specialty: 'climbing', ch3Told: false });
  read(mid, { route: 1, log: 0, stop: F(/^Mice and voles, in tidy rows\./) });
  const back = E.migrate({ version: 2, cats: [clone(mid)], current: mid.id }).cats[0];
  assert.deepEqual([back.flags, back.cards, back.frame, back.lessons], [mid.flags, mid.cards, mid.frame, mid.lessons]);
  assert.deepEqual(idsOf(read(back, { route: 1, log: 0 })), idsOf(read(mid, { route: 1, log: 0 })), 'and reads on to the same end');
});
