/* Story tests for chapter 3: node --test
 *
 * Checks app/story/ch03.js against the frame contract in docs/build.md (its sections "Chapter 2
 * (v0.3)" and "Chapter 3 (v0.4)") and against docs/chapters/03-under-the-old-bridge.md (v0.4): the
 * frame graph (frame `when` included), one interaction per frame, the choices and flags, the Counts
 * frames and sets exactly as the text's Build notes have them, the two skip-counts on the 5s, every
 * `when`, balloons (digits, voices not shown yet), tokens ({Murmur}), storyboards, word counts, the
 * art vocabulary (Sprinkle and the cast extras too), the staging the art builders asked for, the time
 * of day, every frame rendered with everyone in the picture, the beats in order on every path, the
 * Counts the Build notes list, the book (with Sprinkle's dragonet page) on every path combination,
 * the teaser for chapter 4, and a whole play-through of every path through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch03.test.js   prints the whole chapter, rendered both ways.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./_load.js');
const PC = load();
const E = PC.engine;
const A = PC.art;
const story = PC.story.ch03;
const frames = story.frames;
const ids = Object.keys(frames);
const STORIES = [PC.story.ch01, PC.story.ch02, story];

/* ------------------------------------------------------------------ the contract */

// Chapter 1's flags and chapter 2's (a `when` may test them), and chapter 3's own
const FLAGS1 = {
  stepOut: ['chase', 'slow'],
  spokeUp: [true, false],
  joinReason: ['learn', 'count', 'brave'],
  specialty: ['noticing', 'sneaking', 'climbing', 'swimming', 'friends'],
  worry: ['small', 'water', 'talk', 'shiny']
};
const FLAGS2 = { ch2SaidAloud: [true, false], ch2Path: ['bridge', 'river'], ch2Stone: ['nose', 'chin'] };
// ch3Told: the one that matters (module-1, "Paths"); the seven light choices set nothing
const FLAGS3 = { ch3Told: [true, false] };
const FLAGS = Object.assign({}, FLAGS1, FLAGS2, FLAGS3);
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'gift', 'when'].concat(INTERACTIONS);
// the tortie's tokens: Murmur, or Mutter when her own Clan name is Murmur
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat', 'Murmur', 'murmur', 'MURMUR'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things']);
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 35, WORDS_MAX = 50;
// Time of day comes from fx: the den before sunrise is night (no moon), then morning in camp, day at
// the bridge, sunset from "The light turns gold", dusk on the way home, night in the den
const TOD = ['morning', 'day', 'sunset', 'dusk', 'night'];
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'murmurchime', 'snorter', 'clancat'];
const BEASTS = ['riffle', 'otter', 'dog', 'sprinkle'];
const RIM_ANCHORS = ['rim-1', 'rim-2', 'rim-3', 'rim-4', 'rim-5'];

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

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'I dreamed Sprinkle burped a cloud.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', Murmur: 'Murmur', murmur: 'murmur', MURMUR: 'MURMUR', dream: 'Riffle needed a bigger mouth.' },
  // a player whose own Clan name is Murmur: the tortie is Mutterpaw, then Mutterchime
  murmur: { name: 'Murmur', petname: 'Biscuit', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', Murmur: 'Mutter', murmur: 'mutter', MURMUR: 'MUTTER', dream: 'Five, ten, fifteen.' }
};
const FACT = { a: 6, b: 5, answer: 30, groups: 6, per: 5, thing: 'claw', things: 'claws' };
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
    const start = text.replace(/^[“"‘'(—]+/, '');
    if (!start.startsWith('…') && /^\p{Ll}/u.test(start) && !/^—/.test(text)) bad.push('starts lowercase');
    if (/[.!?][”"’']?\s+[“"‘(]?(\p{Ll})/u.test(text)) bad.push('sentence starts lowercase');
  }
  return bad;
}

/* Every line in the chapter: frames (every variant), options, the Counts lines, the book, the teaser. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast', 'fastAfterMiss', 'again', 'remembered', 'rememberedSlow'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l, ok: FACT_TOKENS })));
    ['miss', 'missLast', 'helpIntro', 'helpIntroFar', 'helpIntroNotFive', 'againIntro', 'done', 'fillIntro'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: FACT_TOKENS }); });
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
      f.choice.options.forEach((o, i) => fn(id, { where: 'option ' + i, text: o.label }));
      if (f.choice.prompt) fn(id, { where: 'choice prompt', text: f.choice.prompt });
    }
  });
  countsLines().forEach(x => fn('counts ' + x.set, x));
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  ['title', 'chapterTitle', 'dream', 'noDream'].forEach(k => { if (story.book[k]) fn('book', { where: k, text: story.book[k] }); });
  story.book.dragonet.lines.forEach((l, i) => fn('book', { where: 'dragonet line ' + i, text: l }));
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* Every combination of these flags. */
function* everyPath(keys) {
  keys = keys || Object.keys(FLAGS);
  if (!keys.length) { yield {}; return; }
  const [k, ...rest] = keys;
  for (const v of FLAGS[k]) for (const r of everyPath(rest)) yield Object.assign({ [k]: v }, r);
}
/* The frames a reader with these flags walks through, in order: the choices take their flag values
 * (a light choice its first option, or `light: 1` its second), and a frame whose `when` doesn't match
 * is passed over, as if its next led straight on. */
function walk(flags, light) {
  const cat = { flags, look: { sex: 'she' } };
  const out = [];
  let id = story.start;
  for (let guard = 0; guard < 400 && id; guard++) {
    const f = frames[id];
    if (f.when && !E.matches(f.when, cat)) { id = exits(f)[0]; continue; }
    out.push(id);
    if (f.end) return out;
    if (f.choice) {
      const opts = f.choice.options;
      const pick = opts.find(o => Object.keys(o.sets).length && Object.keys(o.sets).every(k => flags[k] === o.sets[k])) || opts[light || 0];
      id = pick.next;
    } else id = exits(f)[0];
  }
  throw new Error('no end');
}
const PATHS = [
  { ch2Path: 'bridge', ch3Told: true }, { ch2Path: 'river', ch3Told: true },
  { ch2Path: 'bridge', ch3Told: false }, { ch2Path: 'river', ch3Told: false }
];
const isTold = id => /a$/.test(id) && at(id) > at('f086');

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch03');
  assert.equal(story.number, 3);
  assert.equal(story.title, 'Under the Old Bridge');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.ok(ids.length >= 110, 'a full chapter of panels (' + ids.length + ')');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'counts', 'frames', 'id', 'names', 'number', 'start', 'teaser', 'title']);
  // the tortie's label until she is named (then she is `murmurchime`), Mutterpaw for a Murmur
  assert.deepEqual(story.names, { mutterer: '{Murmur}paw' });
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch03'), order.indexOf('ch02') + 1, 'chapter 3 follows chapter 2');
  assert.ok(Object.values(frames).every(f => !/^STUB\b/.test(f.board || '')), 'no stub frame is left');
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
    const branch = l => ({ c: 'a', d: 'a', e: 'b', f: 'b' }[l] || l);
    assert.ok(from.some(p => frames[p].choice || branch(p.slice(-1)) === id.slice(-1)), id + ' is reached from a choice or from its own branch');
  });
  // the path split: telling is `a`, keeping `b`, side by side, and both meet again at "Home"
  const path = ids.find(id => frames[id].choice && frames[id].choice.options.some(o => 'ch3Told' in o.sets));
  const told = ids.filter(id => /a$/.test(id) && at(id) > at(path)), kept = ids.filter(id => /b$/.test(id) && at(id) > at(path));
  assert.ok(told.length >= 10 && kept.length >= 14, 'two long branches: ' + told.length + ' and ' + kept.length);
  const meet = n => exits(frames[n[n.length - 1]])[0];
  assert.equal(meet(told), meet(kept), 'both paths meet again');
  assert.match(T(meet(told)), /Back in the den/, 'at Home');
  // each long branch's own light choice takes the next letters: c and d (told), e and f (kept)
  const inner = ids.filter(id => /[c-f]$/.test(id));
  assert.deepEqual(inner.map(id => id.slice(-1)).sort(), ['c', 'd', 'e', 'f']);
  inner.forEach(id => {
    const from = into[id][0];
    assert.ok(frames[from].choice, id + ': a light choice’s outcome');
    assert.equal(from.slice(-1), /[cd]$/.test(id) ? 'a' : 'b', id + ' sits in its own branch');
  });
});

test('exactly one interaction per frame (skip included), no unknown keys, and a frame `when` only where the engine allows it', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    assert.equal(f.look, undefined, id + ': chapter 3 has no look frame');
    assert.equal(f.gift, undefined, id + ': chapter 3 gives no gift (Sprinkle’s pebble stays hers)');
  });
  // one frame shown only on a path: the river path's littlest brother, a screen of its own
  const whens = ids.filter(id => frames[id].when);
  assert.deepEqual(whens.map(id => frames[id].when), [{ ch2Path: 'river' }]);
  whens.forEach(id => {
    assert.ok(frames[id].next && exits(frames[id]).length === 1, id + ': one way on');
    assert.notEqual(id, story.start);
    assert.match(T(id), /We heard him! On the tallest tower!/);
  });
});

test('every next / option / input / counts / skip target exists, and every frame is reachable', () => {
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const seenIds = new Set([story.start]);
  const stack = [story.start];
  while (stack.length) exits(frames[stack.pop()]).forEach(n => { if (!seenIds.has(n)) { seenIds.add(n); stack.push(n); } });
  assert.deepEqual(ids.filter(id => !seenIds.has(id)), [], 'unreachable frames');
  // and by a reader: every frame is on some path a reader takes (both chapter 2 paths, both endings, every light option)
  const walked = new Set();
  for (const p of PATHS) for (const light of [0, 1]) walk(p, light).forEach(id => walked.add(id));
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

test('choices: labels, ch3Told the only flag, seven light choices (five shared, one on each branch), every one rejoins at once', () => {
  const choiceIds = ids.filter(id => frames[id].choice);
  const light = [];
  choiceIds.forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length === 2, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 16, id + ' option ' + i + ' label');
      Object.keys(o.sets).forEach(k => assert.ok(FLAGS3[k] && FLAGS3[k].includes(o.sets[k]), id + ': a chapter 3 choice sets only ch3Told, not ' + k));
    });
    const flagged = opts.filter(o => Object.keys(o.sets).length).length;
    assert.ok(flagged === 0 || flagged === opts.length, id + ': every option sets its flag, or none does');
    if (!flagged) {
      light.push(id);
      // a light choice: her pick is shown by a frame of its own (at most two panels), then the
      // same next screen; an option with nothing to show goes straight there
      const reach = o => { const out = [o.next]; let cur = o.next; for (let d = 0; d < 2; d++) { cur = exits(frames[cur])[0]; out.push(cur); } return out; };
      const r = opts.map(reach);
      const common = r[0].filter(x => r[1].includes(x));
      assert.ok(common.length, id + ': a light choice rejoins at once');
      const join = common[0];
      opts.forEach(o => { if (o.next !== join) assert.ok(/[a-f]$/.test(o.next) && o.next.slice(1, 4) > id.slice(1, 4), id + ': ' + o.next + ' is its outcome'); });
    }
  });
  assert.equal(light.length, 7, 'seven light choices: ' + light.join(' '));
  const path = choiceIds.find(id => frames[id].choice.options.some(o => 'ch3Told' in o.sets));
  assert.deepEqual(frames[path].choice.options.map(o => o.sets), [{ ch3Told: true }, { ch3Told: false }], 'tell, then keep');
  assert.deepEqual(light.filter(id => at(id) < at(path)).length, 5, 'five on the shared path');
  assert.deepEqual(light.filter(id => at(id) > at(path)).map(id => id.slice(-1)).sort(), ['a', 'b'], 'and one on each branch');
  // every reader meets six light choices and the path
  for (const p of PATHS) assert.equal(walk(p).filter(id => frames[id].choice).length, 7, JSON.stringify(p));
  // her pick is shown: the purr (a grin, or almost hearing it), the pebble (out again, a shuffle), the
  // tummy, the told path's counting to ten, the kept path's "Mmmf"
  assert.match(T(frames.f026.choice.options[0].next), /catches your eye and grins/);
  assert.match(T(frames.f026.choice.options[1].next), /you can almost hear it/);
  assert.match(T(frames.f043.choice.options[0].next), /Out it rolls again/);
  assert.match(T(frames.f043.choice.options[1].next), /Something in the dark shuffles/);
  assert.match(T(frames.f057.choice.options[1].next), /Cats only do that for friends/);
  // a spoken option is never echoed as a balloon on its outcome
  choiceIds.forEach(id => frames[id].choice.options.forEach(o => {
    const said = (o.label.match(/“([^”]+)”/) || [])[1];
    if (said) (frames[o.next].say || []).forEach(b => assert.notEqual(b.text, said, id + ': ' + said + ' echoed'));
  }));
});

test('inputs, counts and skip frames, in the text’s order', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  assert.match(T(inputs[0]), /What did \{name\}paw dream about, the night \{they\} met Sprinkle\?/);
  // its own placeholder, one short line (the default wrapped and clipped in the box on an iPad)
  const ph = frames[inputs[0]].input.placeholder;
  assert.ok(typeof ph === 'string' && ph.length <= 30 && /Sprinkle/.test(ph), ph);
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => frames[id].counts.set), ['ch03-ears', 'ch03-pile', 'ch03-claws', 'ch03-dinner', 'ch03-six']);
  counts.forEach(id => {
    assert.deepEqual(Object.keys(frames[id].counts).sort(), ['next', 'set'], id);
    assert.ok(story.counts[frames[id].counts.set], id + ': the counts set exists');
  });
  // the warm-up and the pile read as one morning's count: the warm-up's next frame goes on to the pile
  assert.match(T(frames[counts[0]].counts.next), /Now, count the prey pile/);
  // the two skip-counts, both on the 5s: the rim (keeping its totals for the pattern line) and bedtime
  const skips = ids.filter(id => frames[id].skip);
  assert.equal(skips.length, 2, 'two skip-counts');
  const [rim, bed] = skips.map(id => frames[id].skip);
  assert.deepEqual(Object.keys(rim).sort(), ['groups', 'keep', 'next', 'table', 'who']);
  assert.deepEqual([rim.table, rim.groups, rim.keep], [5, 5, true]);
  assert.equal(rim.who.length, 5);
  assert.deepEqual(rim.who[4], { who: 'grizzled' }, 'the fifth paw is the old tom’s');
  assert.deepEqual(rim.who[1], { who: 'murmurchime' }, 'Murmurchime among them');
  assert.equal(E.skipView(rim, 5).count, '5… 10… 15… 20… 25!');
  assert.deepEqual(E.skipView(rim, 5).totals, [5, 10, 15, 20, 25]);
  // the totals stay on the page it turns to and on the claws Counts frame, for Tallyheart's pattern line
  assert.deepEqual(E.keptSkip(story, rim.next), { id: skips[0], skip: rim });
  const claws = counts[2];
  assert.equal(frames[rim.next].next, claws, 'TWENTY-FIVE, then the claws');
  assert.deepEqual(E.keptSkip(story, claws), { id: skips[0], skip: rim });
  assert.equal(E.keptSkip(story, frames[claws].counts.next), null, 'never past the lesson');
  assert.match(T(claws), /every number you land on ends in a five or a zero/);
  assert.doesNotMatch(T(claws), /lands on a five or a zero/);
  // the gift-free bedtime tap: her own two forepaws, four taps, nothing logged, the grey tom's groan next
  assert.deepEqual(bed, { table: 5, groups: 4, paws: 'own', next: bed.next });
  assert.deepEqual([0, 1, 2, 3, 4].map(n => E.skipView(bed, n).nextPaw), ['left', 'right', 'left', 'right', null]);
  assert.equal(E.skipView(bed, 4).count, '5… 10… 15… 20…', 'the text’s sleepy “Twenty…”, no exclamation mark');
  assert.match(T(bed.next), /Not ANOTHER one/);
  assert.ok(castOf(bed.next, 'snorer').length, 'the grey tom groans from the next nest');
  // the order: ears, pile, the Warrior Counts, the rim, claws, dinner, six, …, bedtime, the dream
  const order = [counts[0], counts[1], ids.find(id => (frames[id].say || []).some(b => b.digits)), skips[0], counts[2], counts[3], counts[4], skips[1], inputs[0]];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i]) > at(order[i - 1]), order[i] + ' after ' + order[i - 1]);
});

/* ------------------------------------------------------------------ text */

// The voices a panel doesn't draw: a voice the story hasn't shown yet (a balloon with a `name`), the
// promise's close-up on three paws (the bridge's `paws` camera), and the new warrior heard from
// across camp at bedtime (the text: "heard, not seen")
const OFF_PANEL = ['f001 mutterer', 'f045 sprinkle', 'f045 sprinkle', 'f083 riffle', 'f084 sprinkle', 'f084 sprinkle', 'f105 murmurchime'];

test('every balloon speaker is in that frame’s cast, but for the voices heard and not seen; balloons and captions are well formed', () => {
  const off = [];
  ids.forEach(id => {
    const f = frames[id];
    const by = {};
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when', 'digits'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(typeof b.name === 'string' && b.name.trim() && !tokensIn(b.name).length, id + ' say ' + i + ' name');
      if (b.digits !== undefined) assert.match(b.digits, /^(\d+ × \d+|\d+)$/, id + ' say ' + i + ' digits');
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      const n = f.scene.cast.filter(c => c.who === b.who).length;
      if (!n) {
        off.push(id + ' ' + b.who);
        assert.ok(b.name || f.scene.cam === 'paws' || b.who === 'murmurchime', id + ': ' + b.who + ' is heard but not drawn, so it needs a reason');
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
    // every reader sees some text on every frame but the end (a `when` line is never all of it)
    if (!f.end) for (const flags of [{}, { ch2Path: 'bridge' }, { ch2Path: 'river' }, { ch3Told: true }, { ch3Told: false }]) assert.ok(seen(f, flags).length > 0, id + ' shows no text');
  });
  assert.deepEqual(off, OFF_PANEL, 'the voices heard and not seen');
  // the art's speakers: no face shown for a voice not shown yet (PC.ui.speakers.faceHidden)
  require('../app/ui.js');
  const Sp = PC.ui.speakers;
  ['f001', 'f045'].forEach(id => (frames[id].say || []).filter(b => b.name).forEach(b => assert.equal(Sp.faceHidden(b, castOf(id, b.who)[0]), true, id)));
  // nor while she hides her face under her tail (“A muffled voice”, “The tail”)
  ['f055', 'f056', 'f057', 'f091a'].forEach(id => (frames[id].say || []).filter(b => b.who === 'sprinkle').forEach(b => assert.equal(Sp.faceHidden(b, castOf(id, 'sprinkle')[0]), true, id)));
});

test('the Warrior Counts: digits on every question and answer, a clean sweep in our own words, never typed', () => {
  const dig = ids.filter(id => (frames[id].say || []).some(b => b.digits));
  const pairs = [];
  dig.forEach(id => {
    const say = frames[id].say;
    say.forEach(b => assert.ok(b.digits, id + ': every balloon of the Counts carries its numbers'));
    for (let i = 0; i < say.length; i += 2) {
      const q = say[i], a = say[i + 1];
      assert.equal(q.who, 'glintstar', id + ': Glintstar asks');
      assert.equal(a.who, 'mutterer', id + ': Murmurpaw answers');
      const [x, y] = q.digits.split(' × ').map(Number);
      assert.equal(+a.digits, x * y, id + ': ' + q.digits + ' = ' + a.digits + ' (no wrong number spoken or lettered)');
      pairs.push([x, y]);
    }
    assert.equal(frames[id].counts, undefined, id + ': watched, never typed');
  });
  assert.deepEqual(pairs.map(p => p.join('x')), ['7x8', '9x6', '2x9', '6x5', '10x10'], 'the text’s facts, 10 × 10 last');
  const keys = pairs.map(p => Math.min(...p) + 'x' + Math.max(...p));
  assert.equal(new Set(keys).size, keys.length, 'no pair asked in both orders');
  // the rule, once, in Aron's words; "One day" the only time anyone gives
  const rule = 'To become a warrior, a cat answers every Count up to ten times ten, and gets nine in every ten right.';
  assert.equal(ids.filter(id => T(id).includes(rule)).length, 1);
  assert.ok(ids.every(id => !/every Count up to ten times ten/.test(T(id)) || T(id).includes(rule)), 'nobody repeats it');
  // "You know that one!" gets the next screen, after 2 × 9 (the pile's 9 × 2 the other way round)
  const know = ids.find(id => /You know that one! You counted it this morning\./.test(T(id)));
  assert.ok(frames[ids[at(know) - 1]].say.some(b => b.digits === '2 × 9'));
  // the naming earns the half it gives, and nobody touches her: no muzzle, no lick
  const naming = ids.find(id => /Your warrior name is \{Murmur\}chime\./.test(T(id)));
  assert.match(T(naming), /you \{murmur\}ed your Counts in the dark\. Today, they rang out clear as a chime\./);
  ids.forEach(id => assert.doesNotMatch(frames[id].board + ' ' + T(id), /\blick|muzzle on/i, id));
});

test('the tortie: Murmurpaw (labelled by the chapter, Mutterpaw for a Murmur), then Murmurchime; named only once the grey tom names her', () => {
  const naming = ids.find(id => /Your warrior name is \{Murmur\}chime\./.test(T(id)));
  ids.forEach(id => frames[id].scene.cast.forEach(c => {
    if (c.who === 'mutterer') assert.ok(at(id) <= at(naming), id + ': still Murmurpaw after the naming');
    if (c.who === 'murmurchime') assert.ok(at(id) > at(naming), id + ': Murmurchime before she is named');
  }));
  ids.forEach(id => (frames[id].say || []).forEach(b => {
    if (b.who === 'mutterer') assert.ok(at(id) <= at(naming), id);
    if (b.who === 'murmurchime') assert.ok(at(id) > at(naming), id);
  }));
  // before the grey tom says her name, her voice is "A voice in the dark"
  const named = ids.find(id => /\{Murmur\}paw\. You’ve been \{murmur\}ing ALL night\./.test(T(id)));
  assert.ok(castOf(named, 'snorer').some(c => c.moss), named + ': the grey tom, moss over his ears, makes the pun');
  ids.slice(0, at(named)).forEach(id => (frames[id].say || []).filter(b => b.who === 'mutterer').forEach(b => assert.equal(b.name, 'A voice in the dark', id)));
  ids.slice(at(named)).forEach(id => (frames[id].say || []).filter(b => b.who === 'mutterer' || b.who === 'murmurchime').forEach(b => assert.equal(b.name, undefined, id)));
  // the labels the page prints
  require('../app/ui.js');
  const Sp = PC.ui.speakers, cat = E.blankCat({});
  for (const [name, paw, chime] of [['Fern', 'Murmurpaw', 'Murmurchime'], ['Murmur', 'Mutterpaw', 'Mutterchime']]) {
    cat.name = name;
    const fillC = t => E.fill(t, cat);
    assert.equal(Sp.label({ who: 'mutterer' }, { cat, story, fill: fillC }), paw);
    assert.equal(Sp.label({ who: 'murmurchime' }, { cat, story, fill: fillC }), chime);
    assert.match(E.fill(T(named), cat), new RegExp(paw + '\\. You’ve been ' + paw.slice(0, -3).toLowerCase() + 'ing ALL night\\.'));
  }
  // every {Murmur} becomes Murmur- for everyone else: never a Mutter in their story
  cat.name = 'Fern';
  everyText((id, x) => assert.doesNotMatch(E.fill(x.text, cat), /mutter/i, id + ' ' + x.where));
});

test('nobody is named on a balloon before the story names them: Sprinkle is a small voice, the dragon, a muffled voice, until “I’m Sprinkle”', () => {
  const intro = ids.findIndex(id => /I’m Sprinkle\. A Mistscale dragonet\./.test(T(id)));
  assert.ok(intro > 0, 'Sprinkle is introduced');
  const before = ids.slice(0, intro).filter(id => (frames[id].say || []).some(b => b.who === 'sprinkle'));
  assert.ok(before.length >= 4, 'she speaks before she says her name');
  before.forEach(id => (frames[id].say || []).filter(b => b.who === 'sprinkle').forEach(b => {
    assert.ok(['A small voice', 'The dragon', 'A muffled voice'].includes(b.name), id + ': ' + b.name);
  }));
  // "You dropped that" comes out of the dark before anyone sees her; "You can't see me" from behind her tail
  assert.ok((frames.f045.say || []).filter(b => b.who === 'sprinkle').every(b => b.name === 'A small voice'));
  ids.slice(0, intro).forEach(id => (frames[id].say || []).filter(b => b.name === 'A muffled voice').forEach(() => assert.equal(castOf(id, 'sprinkle')[0].pose, 'hide', id)));
  // after: no name, but for the joke ("Hello," says the tail) while she hides
  ids.slice(intro).forEach(id => (frames[id].say || []).filter(b => b.who === 'sprinkle' && b.name).forEach(b => {
    assert.equal(b.name, 'The tail', id);
    assert.equal(castOf(id, 'sprinkle')[0].pose, 'hide', id + ': the tail speaks only while she hides');
  }));
  // Riffle, the otters, everyone else: named already
  ids.forEach(id => (frames[id].say || []).filter(b => b.who === 'riffle').forEach(b => assert.equal(b.name, undefined, id)));
});

test('text tokens are only the allowed ones', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = x.ok || (id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS);
    tokensIn(x.text).forEach(t => { if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}'); });
  });
  assert.deepEqual(bad, []);
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  // the Murmur tokens only ever make the tortie's names and the pun
  everyText((id, x) => (String(x.text).match(/\{(Murmur|murmur|MURMUR)\}\w*/g) || []).forEach(m => assert.ok(['{Murmur}paw', '{Murmur}chime', '{murmur}ing', '{murmur}ed'].includes(m), id + ' ' + x.where + ': ' + m)));
});

test('word counts: about 15 words a frame, never more than 50 (every variant at once, and as each path reads it)', (t) => {
  const over = [];
  ids.forEach(id => {
    const all = texts(frames[id]).reduce((n, x) => n + words(x.text), 0);
    assert.ok(all <= WORDS_MAX, id + ' has ' + all + ' words, every variant counted');
    if (all > WORDS_AIM) over.push(id + ' (' + all + ')');
  });
  if (over.length) t.diagnostic('over ' + WORDS_AIM + ' words with every variant: ' + over.join(', '));
  const stats = [];
  for (const p of PATHS) for (const extra of [{ specialty: 'friends', worry: 'shiny', ch2Stone: 'nose' }, { specialty: 'climbing', worry: 'water', ch2Stone: 'chin' }]) {
    const flags = Object.assign({}, p, extra), path = walk(flags);
    const w = path.reduce((n, id) => n + seen(frames[id], flags).reduce((m, s) => m + words(s), 0), 0);
    path.forEach(id => assert.ok(seen(frames[id], flags).reduce((m, s) => m + words(s), 0) <= WORDS_MAX, id));
    stats.push(JSON.stringify(flags) + ': ' + path.length + ' frames, ' + w + ' words (' + (w / path.length).toFixed(1) + ' a frame)');
    // the text: about 103–109 panels a read-through; chapter 2 read at 14.6–15.1 words a frame
    assert.ok(path.length >= 100 && path.length <= 125, JSON.stringify(flags) + ': ' + path.length + ' frames');
    assert.ok(w / path.length >= 12 && w / path.length <= 22, JSON.stringify(flags) + ': ' + (w / path.length).toFixed(1) + ' words a frame');
  }
  stats.forEach(s => t.diagnostic(s));
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
  });
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
});

test('our own world and the tone: no Warriors or Wings of Fire words; “dragon” only in the narration under the bridge and at bedtime; nobody lost, hurt or eaten', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|pyrrhia|moonwatcher|firestar|rusty|warriors’ den|apprentices’ den|assessment|from this day)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|warriors’ den)\b/i, id + ' board'));
  // nobody in camp says "dragon": the word is the narration's (under the bridge, and the bedtime
  // thought), Sprinkle's own "Mistscale dragonet", and her label before she has a name
  ids.forEach(id => {
    const f = frames[id];
    (f.say || []).forEach(b => { if (/dragon/i.test(b.text)) assert.ok(b.who === 'sprinkle' && /Mistscale dragonet/.test(b.text), id + ': ' + b.who + ' says dragon'); });
    (f.caption || []).forEach(c => { if (/dragon/i.test(capText(c))) assert.ok(f.scene.set === 'bridge' || f.scene.fx.includes('night'), id + ': dragon in a camp caption'); });
  });
  // the six are never "lost"; the wing is sore, never a wound; nobody dies; the vole goes down whole
  everyText((id, x) => assert.doesNotMatch(x.text, /\b(lost|wound(ed)?|blood|bleed|broken|crooked|crunch|die[sd]?|dead|kill(ed)?|bones?)\b/i, id + ' ' + x.where));
  assert.ok(ids.some(id => /won’t open all the way\. It’s sore\./.test(T(id))));
  assert.ok(ids.some(id => /Six of us, out there somewhere\./.test(T(id))));
  // Sprinkle's pebble is "plain grey, and smooth as an egg"; Riffle's is a juggling pebble, never "Riffle's pebble"
  everyText((id, x) => assert.doesNotMatch(x.text, /Riffle’s pebble/, id + ' ' + x.where));
  // CrystalClan never fishes: the fish are Riffle's
  ids.forEach(id => frames[id].scene.cast.forEach(c => { if (/^fish/.test(c.holds || '')) assert.equal(c.who, 'riffle', id); }));
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab), Sprinkle and the cast extras included', () => {
  const v = A.vocab;
  assert.ok(v && v.sets && v.otherPoses && v.otherPoses.sprinkle && v.variants, 'the art exposes its vocabulary');
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
      else assert.ok(allowed.includes(val), id + ': ' + k + '=' + JSON.stringify(val));
    });
    if (s.set === 'pile') ['pairs', 'lit'].forEach(k => { if (s.opts[k] !== undefined) assert.ok(s.opts[k] <= 10, id + ': ' + k + ' is 0–10'); });
    assert.ok(Array.isArray(s.cast), id + ': cast');
    const used = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'size', 'variant', 'flatEars', 'holds', 'holdAt', 'purr', 'lift',
        'claws', 'puffed', 'squeeze', 'moss', 'tear', 'mist', 'pebbles'].includes(k)), [], where + ': keys');
      // a juggling Riffle's four on the arc, or four and the fifth in his paw
      if (c.pebbles !== undefined) assert.ok(c.who === 'riffle' && c.pose === 'juggle' && [4, 5].includes(c.pebbles), where + ': pebbles');
      assert.ok(v.cast.includes(c.who), where + ': unknown who');
      const isCat = CATS.includes(c.who);
      if (c.flatEars !== undefined) assert.ok(c.flatEars === true && isCat, where + ': flatEars is for a cat, and true');
      ['claws', 'puffed', 'moss'].forEach(k => { if (c[k] !== undefined) assert.ok(c[k] === true && isCat, where + ': ' + k + ' is for a cat, and true'); });
      ['squeeze', 'tear', 'mist'].forEach(k => { if (c[k] !== undefined) assert.equal(c[k], true, where + ': ' + k); });
      // who holds what: Sprinkle her pebble, our cat the vole, Riffle his fish
      if (c.holds !== undefined) {
        const ok = { pebble: ['sprinkle'], vole: ['player'], fish: ['riffle'], fish2: ['riffle'] }[c.holds];
        assert.ok(ok && ok.includes(c.who), where + ': holds ' + c.holds);
      }
      if (c.claws) assert.ok(c.pose === 'pawup', where + ': claws out on a raised paw');
      if (c.purr !== undefined) assert.ok(c.purr === true && isCat && s.fx.includes('purr'), where + ': purr: true marks a cat purring in a purr panel');
      assert.equal(c.lift, undefined, where + ': no pouf in chapter 3');
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
  });
  // the skip-count's and the claws' pictures name only cast members
  frames[ids.find(id => frames[id].skip && frames[id].skip.who)].skip.who.forEach(w => assert.ok(v.cast.includes(w.who), w.who));
});

test('staging the art builders asked for: prints in the dark, the brown pebble, Sprinkle before the cat at her side, the crowd, the chime, the hedge, the tree, the den', () => {
  const look = { sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' };
  const bridge = (id, ...cams) => frames[id].scene.set === 'bridge' && cams.includes(frames[id].scene.cam);
  // inside the dark, every scene draws Sprinkle's big prints beside the drag marks; outside, no drag marks
  ids.filter(id => bridge(id, 'under', 'back')).forEach(id => {
    assert.equal(frames[id].scene.opts.prints, true, id + ': prints beside the drag marks');
    assert.notEqual(frames[id].scene.opts.drag, false, id);
  });
  ids.filter(id => bridge(id, 'bank', 'mouth')).forEach(id => assert.equal(frames[id].scene.opts.drag, false, id + ': no drag marks outside the dark'));
  // the pebble only where the set draws it: in the dark, rolling out, at her paws (the mouth)
  ids.filter(id => frames[id].scene.opts.pebble).forEach(id => assert.ok(bridge(id, 'mouth', 'under'), id));
  assert.equal(frames[ids.find(id => /bounces off his head, into the dark/.test(T(id)))].scene.opts.pebble, 'in');
  assert.equal(frames[ids.find(id => /rolls back out, right to your paws/.test(T(id)))].scene.opts.pebble, 'paws');
  assert.equal(frames[ids.find(id => /Out it rolls again/.test(T(id)))].scene.opts.pebble, 'out');
  // the BONK: Riffle is first in the cast, so the bonk pebble is his brown fifth one
  const bonk = ids.find(id => /BONK/.test(frames[id].sfx || ''));
  assert.ok(frames[bonk].scene.fx.includes('bonk') && frames[bonk].scene.cast[0].who === 'riffle' && bridge(bonk, 'bank'), bonk);
  // a cat at `beside` is listed after Sprinkle, so it is drawn against her; and never on her lowered face
  ids.filter(id => frames[id].scene.cast.some(c => c.at === 'beside') && bridge(id, 'back')).forEach(id => {
    const cast = frames[id].scene.cast, d = cast.findIndex(c => c.who === 'sprinkle'), b = cast.findIndex(c => c.at === 'beside');
    assert.ok(d >= 0 && d < b, id + ': Sprinkle first');
    assert.ok(!['draw', 'sniff', 'touch', 'peek', 'hide', 'flat'].includes(cast[d].pose), id + ': her head low and forward would sit behind the cat at beside');
  });
  // the branch only on the told path, once Tallyheart has dragged it there
  const dragged = ids.find(id => /She drags a fallen branch across the back/.test(T(id)));
  ids.filter(id => frames[id].scene.opts.branch).forEach(id => assert.ok(isTold(id) && at(id) >= at(dragged), id));
  assert.equal(frames[dragged].scene.opts.branch, true);
  // the train shakes the back, and Sprinkle squeezes flat
  const train = ids.find(id => /CLANKETY/.test(frames[id].sfx || ''));
  assert.ok(frames[train].scene.opts.train && castOf(train, 'sprinkle')[0].pose === 'flat', train);
  // the promise: the three paws close up, fanned so all fifteen claws show
  ids.filter(id => bridge(id, 'paws')).forEach(id => { assert.equal(frames[id].scene.opts.pawsIn, true, id); assert.deepEqual(frames[id].scene.cast, [], id); });
  // the Warrior Counts: the whole Clan crowded round, Glintstar on top, Murmurpaw alone at the foot
  const firstCount = ids.find(id => /Glintstar stands on the fountain/.test(T(id)));
  const purrChoice = ids.find(id => frames[id].choice && /Purr her new name/.test(frames[id].choice.options[0].label));
  ids.filter(id => at(id) >= at(firstCount) && at(id) <= at(purrChoice) + 2 && frames[id].scene.set === 'camp').forEach(id => {
    assert.equal(frames[id].scene.opts.crowd, true, id + ': the whole Clan');
    frames[id].scene.cast.forEach(c => {
      if (c.who === 'glintstar') assert.equal(c.at, 'fountain-top', id);
      // at the fountain's foot: alone in the clear space in front of the basin, under Glintstar
      // ({ x: 760, y: 860 }; the camp's `fountain-foot` anchor sits left of the basin, by the crowd)
      if (c.who === 'mutterer' || c.who === 'murmurchime') assert.ok(frames[id].scene.cam === 'ferns' || (c.at && c.at.x === 760 && c.at.y === 860), id + ': ' + JSON.stringify(c.at));
    });
  });
  const alone = ids.find(id => /sits alone at the fountain’s foot\. She looks very small\./.test(T(id)));
  assert.ok(castOf(alone, 'mutterer').every(c => c.at.x === 760 && c.size < 1), alone + ': small');
  // alone: in the wide shots no cast member (Tallyheart, the player) sits within a body-length of her
  ['f016', 'f020'].forEach(id => {
    const r = A.render(frames[id].scene, { look: { fur: 'calico' } }), hs = r.heads;
    const her = hs[frames[id].scene.cast.findIndex(c => c.who === 'mutterer')];
    hs.forEach((h, i) => { if (h !== her && frames[id].scene.cast[i].who !== 'glintstar') assert.ok(Math.abs(h.x - her.x) > 12, id + ': clear of ' + frames[id].scene.cast[i].who); });
  });
  const taller = ids.find(id => /sits up taller/.test(T(id)));
  assert.ok(!castOf(taller, 'mutterer')[0].size || castOf(taller, 'mutterer')[0].size >= 1, taller + ': taller than when she was small');
  // the purr: the whole camp (nobody marked purr), the second option her own purr
  const purr = ids.find(id => /The whole camp hums her new name/.test(T(id)));
  assert.ok(frames[purr].scene.fx.includes('purr') && frames[purr].scene.cast.every(c => !c.purr), purr);
  // the chime on Waffles' balcony in every tower panel (the image "clear as a chime" points at)
  ids.filter(id => frames[id].scene.set === 'tower').forEach(id => assert.equal(frames[id].scene.opts.chime, true, id));
  assert.ok(ids.filter(id => frames[id].scene.set === 'tower').some(id => at(id) > at(ids.find(i => /clear as a chime/.test(T(i))))), 'the chime after the naming');
  // the hedge two-shot: our cat coming out of camp through the gap with the vole in its mouth, and
  // Tallyheart on the lawn of its old garden, coming home (chapter 2's way out of camp: a cat at the gap
  // facing the garden); the walk before it is in camp, toward the hedge, where the whole camp can see
  ids.filter(id => frames[id].scene.set === 'garden' && frames[id].scene.cam === 'hedge').forEach(id => {
    assert.deepEqual(frames[id].scene.cast.map(c => c.who + '@' + c.at + ':' + c.facing), ['tallyheart@hedge-side:right', 'player@hedge-gap:left'], id);
    assert.equal(castOf(id, 'player')[0].holds, 'vole', id);
  });
  // the review's staging (2026-10-06)
  const gulps = ids.find(id => /\{Murmur\}paw gulps\./.test(T(id)));
  assert.equal(camOf(gulps), 'den/nest', 'the gulp is the nest two-shot (not a third wide in a row)');
  assert.equal(castOf(gulps, 'mutterer')[0].size, undefined, 'the little tortoiseshell keeps her size');
  const eyesF = ids.find(id => /two big eyes open, round as river stones/.test(T(id))), unf = ids[at(eyesF) + 1];
  assert.deepEqual(frames[eyesF].scene.cast.map(c => c.who + '@' + c.at), ['player@back-left', 'riffle@near'], 'our cat nearer the eyes, Riffle behind it');
  ['player', 'riffle'].forEach(w => assert.equal(castOf(eyesF, w)[0].at, castOf(unf, w)[0].at, w + ': nobody swaps sides'));
  assert.equal(castOf(ids.find(id => /FIVE pebbles!/.test(T(id))), 'riffle')[0].pebbles, 5, 'four in the air, the fifth in his paw');
  assert.equal(castOf(ids.find(id => frames[id].scene.fx.includes('bonk')), 'riffle')[0].pebbles, 4, 'four in the air while the fifth bonks');
  assert.equal(castOf(ids.find(id => /I wanted to keep that one/.test(T(id))), 'riffle')[0].pebbles, 5, 'the brown pebble back in his paw');
  assert.ok(castOf(ids.find(id => /I’m an OTTER!/.test(T(id))), 'sprinkle').length, 'Sprinkle in the wide of the dive');
  const promise2 = ids.find(id => /fifteen-claw promise/.test(T(id)));
  assert.ok(frames[promise2].scene.opts.hop === true && !frames[promise2].scene.fx.includes('sparkle'), 'the hop lettered and lit, nothing sparkling on the claws');
  ids.filter(id => frames[id].scene.opts.branch).forEach(id => assert.ok(!['happy', 'laugh', 'sleepy', 'proud'].includes(castOf(id, 'sprinkle')[0].mood), id + ': her eyes open over the heap'));
  ids.filter(id => isTold(id) && frames[id].scene.set === 'bridge').forEach(id => assert.ok(castOf(id, 'riffle').length, id + ': Riffle stays'));
  assert.equal(castOf(ids.find(id => /I count claws\. By FIVES\./.test(T(id))), 'sprinkle')[0].pose, 'pawup', 'a paw up for “By FIVES”');
  // Riffle's stone 'by her nose' in the nest two-shots lies on our cat's own moss, not at the tortie's paws
  ['f005', 'f006a', 'f008', 'f009'].forEach(id => {
    const sc = JSON.parse(JSON.stringify(frames[id].scene)); sc.opts.stone = 'nose';
    const r = A.render(sc, { look: { fur: 'calico' } }), vb = r.svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    const st = r.svg.match(/translate\(([-\d.]+) ([-\d.]+)\) rotate\(-?[\d.]+\)"><ellipse cx="0" cy="0" rx="[\d.]+" ry="[\d.]+" fill="#24252C"/);
    const hx = (who) => vb[0] + r.heads[sc.cast.findIndex(c => c.who === who)].x / 100 * vb[2];
    assert.ok(st && Math.abs(+st[1] - hx('player')) < Math.abs(+st[1] - hx('mutterer')), id + ': the stone is hers, by her nose');
  });
  // the vole: held from the pile to the bridge, then swallowed whole
  const carry = ids.find(id => /You carry it toward the hedge/.test(T(id)));
  assert.equal(frames[carry].scene.set, 'camp', carry + ': still in camp, heading out');
  const gulp = ids.find(id => /swallows the vole in one gulp/.test(T(id)));
  ids.filter(id => castOf(id, 'player').some(c => c.holds === 'vole')).forEach(id => assert.ok(at(id) >= at(carry) && at(id) < at(gulp), id));
  assert.equal(castOf(gulp, 'sprinkle')[0].pose, 'gulp');
  // the tree: two marks before the third is scratched, three from it on (the first two deeper by default)
  const third = ids.find(id => /A third claw mark\./.test(T(id)));
  ids.filter(id => frames[id].scene.set === 'hollow').forEach(id => {
    assert.equal(frames[id].scene.opts.marks, at(id) < at(third) ? 2 : 3, id);
    assert.equal(frames[id].scene.opts.depth, undefined, id + ': depth by default');
  });
  assert.match(T(ids[at(third) + 1]), /your ears mark is deeper already\. One day, there’ll be ten marks here\./);
  // the den: no moon; her stone where she put it; from sunrise on, the tortie's nest is empty
  const sunrise = ids.find(id => /nest is empty, and Tallyheart is at the doorway/.test(T(id)));
  ids.filter(id => frames[id].scene.set === 'den').forEach(id => {
    assert.notEqual(frames[id].scene.opts.moon, true, id + ': no moon');
    assert.equal(frames[id].scene.opts.stone, 'auto', id + ': her stone where she put it');
    if (at(id) >= at(sunrise)) assert.ok(frames[id].scene.cast.every(c => c.at !== 'sleeper-2' && c.who !== 'mutterer'), id + ': her old nest is empty');
    // ... and nobody stands in it: the middle ring (640, 850; 143 by 41 across) is clear of every foot
    if (at(id) >= at(sunrise)) frames[id].scene.cast.filter(c => typeof c.at === 'object').forEach(c => {
      assert.ok(((c.at.x - 640) / 143) ** 2 + ((c.at.y - 850) / 41) ** 2 > 1.4, id + ': ' + c.who + ' outside the empty nest, at ' + JSON.stringify(c.at));
    });
  });
  // E.resolveScene puts the stone where chapter 2 left it
  const cat = E.blankCat({}); cat.flags.ch2Stone = 'chin';
  assert.equal(E.resolveScene(frames.f001.scene, cat, STORIES).opts.stone, 'chin');
  // the rim: the panel that says five cats shows exactly the five, the old tom's paw up last
  const five = ids.find(id => /Along the rim, five cats hold up a forepaw each/.test(T(id)));
  const rimCast = id => frames[id].scene.cast.filter(c => RIM_ANCHORS.includes(c.at));
  assert.deepEqual(rimCast(five).map(c => c.at), RIM_ANCHORS);
  // the text's one screen: five paws up, the old tom's last (its caption is true to its picture)
  assert.deepEqual(rimCast(five).map(c => c.pose), ['pawup', 'pawup', 'pawup', 'pawup', 'pawup'], five + ': five paws up, as it says');
  assert.match(T(five), /The old tom’s paw goes up last\./, five + ': on the same screen');
  assert.equal(rimCast(five)[4].mood, 'stern', 'grudging');
  const skip = ids.find(id => frames[id].skip && frames[id].skip.who);
  assert.deepEqual(rimCast(skip).map(c => c.pose), ['pawup', 'pawup', 'pawup', 'pawup', 'pawup'], skip + ': now all five');
  rimCast(skip).forEach((c, i) => assert.deepEqual({ who: c.who, variant: c.variant }, { who: frames[skip].skip.who[i].who, variant: frames[skip].skip.who[i].variant }, 'rim ' + (i + 1)));
  assert.deepEqual(frames[skip].scene.cast.filter(c => !RIM_ANCHORS.includes(c.at)).map(c => c.who + '@' + c.at), ['tallyheart@tree-far', 'player@sunpatch-2'], skip + ': the teacher apart');
  // the hug: our cat curled in Sprinkle's tail, its face clear of hers
  const hug = ids.find(id => /hugged by fog/.test(T(id)));
  const hr = A.render(frames[hug].scene, { look }).heads, di = frames[hug].scene.cast.findIndex(c => c.who === 'sprinkle'), pi = frames[hug].scene.cast.findIndex(c => c.who === 'player');
  assert.equal(frames[hug].scene.cast[di].pose, 'curl');
  assert.ok(Math.abs(hr[di].x - hr[pi].x) > hr[di].r + hr[pi].r, hug + ': two faces, side by side');
  // "You press against her side": beside her, not on her, and her face clear
  const press = ids.find(id => /You press against her side/.test(T(id)));
  const pr = A.render(frames[press].scene, { look }).heads, pd = frames[press].scene.cast.findIndex(c => c.who === 'sprinkle'), pp = frames[press].scene.cast.findIndex(c => c.who === 'player');
  assert.ok(Math.hypot(pr[pd].x - pr[pp].x, (pr[pd].y - pr[pp].y) * 0.625) > pr[pd].r + pr[pp].r, press + ': her face clear of our cat');
});

test('the time of day runs night (before sunrise), morning, day, sunset, dusk, night', () => {
  const sunrise = ids.find(id => /By sunrise/.test(T(id)));
  ids.slice(0, at(sunrise)).forEach(id => assert.deepEqual(frames[id].scene.fx.filter(e => TOD.includes(e)), ['night'], id + ': before sunrise, in the dark'));
  for (const p of PATHS) {
    const path = walk(p).filter(id => at(id) >= at(sunrise));
    const tods = path.map(id => {
      const t = frames[id].scene.fx.filter(e => TOD.includes(e));
      assert.equal(t.length, 1, id + ': exactly one time of day in fx (' + frames[id].scene.fx.join(',') + ')');
      return TOD.indexOf(t[0]);
    });
    for (let i = 1; i < path.length; i++) assert.ok(tods[i] >= tods[i - 1], path[i] + ' goes back in time');
  }
  assert.ok(frames[sunrise].scene.fx.includes('morning'));
  const gold = ids.find(id => /The light turns gold/.test(T(id)));
  assert.ok(frames[gold].scene.fx.includes('sunset'), gold);
  ids.filter(id => at(id) < at(gold)).forEach(id => assert.ok(!frames[id].scene.fx.some(e => ['sunset', 'dusk'].includes(e)), id));
  assert.ok(frames[ids[ids.length - 1]].scene.fx.includes('night'), 'it ends at night');
  ids.forEach(id => assert.ok(!frames[id].scene.fx.some(e => ['rain', 'lightning'].includes(e)), id + ': no storm tonight'));
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(camOf));
  // no new places this chapter: chapters 1–2's sets, in new light and with new props
  assert.ok(pairs.size >= 28, 'only ' + pairs.size + ' set/camera pairs');
  const sets = new Set(ids.map(id => frames[id].scene.set));
  ['den', 'pile', 'camp', 'tower', 'hollow', 'bridge', 'title', 'garden', 'riverbank'].forEach(s => assert.ok(sets.has(s), 'uses ' + s));
  ['under', 'back', 'paws', 'bank', 'mouth'].forEach(cam => assert.ok(ids.some(id => camOf(id) === 'bridge/' + cam), 'the bridge’s ' + cam));
  // along any path a reader can take, never five panels in a row from the same camera
  for (const p of PATHS) for (const light of [0, 1]) {
    const path = walk(p, light);
    let run = 1;
    for (let i = 1; i < path.length; i++) {
      run = camOf(path[i]) === camOf(path[i - 1]) ? run + 1 : 1;
      assert.ok(run < 5, path[i] + ': ' + run + ' panels in a row from ' + camOf(path[i]));
    }
  }
});

test('every frame renders, and everyone in the cast is in the picture', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'black', marking: 'white-paws', eyes: 'odd' }];
  const off = [];
  ids.forEach(id => looks.forEach((look, k) => {
    const f = frames[id], sc = E.resolveScene(f.scene, Object.assign(E.blankCat({}), { flags: { ch2Stone: 'nose' } }), STORIES), cast = sc.cast;
    const r = A.render(sc, { look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.indexOf('<svg') >= 0, id + ': no svg');
    assert.ok(Array.isArray(r.heads) && r.heads.length === cast.length, id + ': heads');
    (f.say || []).forEach(b => {
      if (!cast.some(c => c.who === b.who)) return;   // heard, not seen (the test above)
      assert.ok(cast.some((c, i) => c.who === b.who && r.heads[i]), id + ': speaker ' + b.who + ' has no head on the panel');
    });
    if (k === 0) cast.forEach((c, i) => {
      const h = r.heads[i];
      if (!h) off.push(id + ' ' + c.who + '@' + JSON.stringify(c.at) + ' (' + sc.set + '/' + sc.cam + ')');
      else if (BEASTS.includes(c.who) || CATS.includes(c.who)) assert.ok(h.r >= 0.5, id + ': ' + c.who + ' face radius');
    });
  }));
  assert.deepEqual(off, [], 'cast members out of the camera’s sight');
  // the Counts pictures the chapter asks for: the rim 5s, its kept totals, Sprinkle's dinner, the six in the mud, her own paws
  const rim = frames[ids.find(id => frames[id].skip && frames[id].skip.who)].skip, own = frames[ids.find(id => frames[id].skip && frames[id].skip.paws)].skip;
  const lookP = looks[0];
  [A.countsPicture({ table: 5, groups: 5, per: 5, highlight: 15, totals: true, next: true, who: rim.who, look: lookP }),
    A.countsPicture({ table: 5, groups: 5, per: 5, highlight: 25, totals: true, next: false, who: rim.who, look: lookP }),
    A.countsPicture({ table: 5, groups: 2, per: 5, highlight: 0, who: story.counts['ch03-dinner'].facts[0].who, look: lookP }),
    A.countsPicture({ table: 5, groups: 6, per: 5, highlight: 0, kind: 'mud', look: lookP }),
    A.countsPicture(Object.assign({ table: 5, groups: 4, per: 5, highlight: 5, totals: false, look: lookP }, (v => ({ paws: 'own', taps: v.taps, lit: v.lit, nextPaw: v.nextPaw }))(E.skipView(own, 1))))
  ].forEach((svg, i) => assert.ok(typeof svg === 'string' && svg.indexOf('<svg') >= 0 && !/NaN|undefined/.test(svg), 'picture ' + i));
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
  beat('eighty-one mice, in the dark', id => has(id, /eighty-one mice\. No! Not mice\./) && frames[id].scene.fx.includes('night'));
  beat('a whisper wakes you (and chapter 2’s thought, by path)', id => has(id, /A whisper wakes you\./) && (frames[id].caption || []).some(c => c.when && c.when.ch2Path === 'bridge') && (frames[id].caption || []).some(c => c.when && c.when.ch2Path === 'river'));
  beat('bolt upright, eyes squeezed shut', id => has(id, /sits bolt upright/) && castOf(id, 'mutterer').some(c => c.squeeze));
  beat('murmuring ALL night', id => has(id, /\{murmur\}ing ALL night/) && has(id, /It’s my Warrior Counts today\./));
  beat('in front of EVERYONE', id => frames[id].choice && has(id, /In front of EVERYONE/));
  beat('soap; thanks', id => has(id, /You still smell a bit like soap\./));
  beat('very quietly: thanks', id => has(id, /Thanks\./) && (frames[id].say || []).some(b => b.text === 'Thanks.' && b.kind === 'whisper'));
  beat('the warm-up at the doorway', id => frames[id].counts && frames[id].counts.set === 'ch03-ears' && castOf(id, 'tallyheart').some(c => c.at === 'doorway'));
  beat('now, count the prey pile', id => has(id, /Now, count the prey pile/));
  beat('the old tom’s sunset count, then the pile', id => frames[id].counts && frames[id].counts.set === 'ch03-pile' && has(id, /Nine pairs at sunset\. I counted them myself\. By twos\./));
  beat('the dug earth is bigger (noticing)', id => (frames[id].caption || []).some(c => c.when && c.when.specialty === 'noticing' && /bigger\. It hasn’t rained since the storm\./.test(c.text)));
  beat('fourteen is not eighteen', id => has(id, /Seven pairs\. Fourteen\./) && has(id, /Fourteen is not eighteen\./) && frames[id].scene.opts.lit === 7);
  beat('four more, gone', id => has(id, /Four more pieces\. Gone\./) && castOf(id, 'tallyheart').some(c => c.flatEars));
  beat('eight in two nights', id => has(id, /Eight pieces in two nights\./) && has(id, /takes her Warrior Counts/));
  beat('the whole Clan crowds round', id => has(id, /The whole Clan crowds around the fountain/));
  beat('alone at the fountain’s foot', id => has(id, /sits alone at the fountain’s foot/));
  beat('the rule', id => has(id, /every Count up to ten times ten, and gets nine in every ten right/));
  beat('seven times eight', id => (frames[id].say || []).some(b => b.digits === '7 × 8'));
  beat('two times nine', id => (frames[id].say || []).some(b => b.digits === '2 × 9'));
  beat('you know that one!', id => has(id, /You know that one!/));
  beat('six times five, sitting up taller', id => (frames[id].say || []).some(b => b.digits === '6 × 5') && has(id, /sits up taller/));
  beat('A HUNDRED!', id => (frames[id].say || []).some(b => b.digits === '100' && b.kind === 'shout') && has(id, /On and on it goes/));
  beat('Murmurchime', id => has(id, /Your warrior name is \{Murmur\}chime\./));
  beat('the camp hums her name', id => frames[id].scene.fx.includes('purr') && has(id, /The whole camp hums her new name/));
  beat('Speak UP, darlings! (the purr choice)', id => frames[id].choice && castOf(id, 'waffles').length && has(id, /Speak UP, darlings!/));
  beat('one day, that’ll be you', id => has(id, /One day, that’ll be you\./));
  beat('more than tuna', id => has(id, /More than tuna\. More than you wanted the garden/));
  beat('teach me the next one. NOW.', id => has(id, /SO many Counts/) && has(id, /you already know two: tails and ears/) && has(id, /NOW\./));
  beat('claws, then', id => has(id, /Tallyheart laughs\./) && has(id, /Claws, then\./));
  beat('Shhnk! Five on every forepaw', id => /Shhnk/.test(frames[id].sfx || '') && castOf(id, 'tallyheart').some(c => c.pose === 'pawup' && c.claws));
  beat('warrior claws on the rim', id => has(id, /Warrior claws\./) && castOf(id, 'murmurchime').some(c => /^rim-/.test(c.at)));
  beat('the rim tap', id => frames[id].skip && frames[id].skip.table === 5 && frames[id].skip.who);
  beat('TWENTY-FIVE; can I put my paw down now?', id => has(id, /TWENTY-FIVE!/) && has(id, /Can I put my paw down now\?/));
  beat('the claws lesson', id => frames[id].counts && frames[id].counts.set === 'ch03-claws');
  beat('a third claw mark', id => /SKRITCH/.test(frames[id].sfx || '') && frames[id].scene.opts.marks === 3);
  beat('like Murmurchime', id => has(id, /Like \{Murmur\}chime\./));
  beat('not one paw— under the Old Bridge', id => has(id, /not one paw—/) && has(id, /—under the Old Bridge\. I know\./));
  beat('FIVE pebbles!', id => has(id, /FIVE pebbles!/) && frames[id].scene.cam === 'bank');
  beat('BONK', id => /BONK/.test(frames[id].sfx || ''));
  beat('my fifth favorite', id => has(id, /My fifth favorite\./));
  beat('snakes can’t roll pebbles (or blink)', id => frames[id].choice && has(id, /They don’t have PAWS\./) && (frames[id].say || []).some(b => b.when && b.when.ch2Path === 'bridge' && /Or eyelids\./.test(b.text)));
  beat('nobody’s in here at all', id => has(id, /You dropped that\./) && has(id, /Nobody’s in here at all\./));
  beat('that’s a TUMMY', id => /GRRR/.test(frames[id].sfx || '') && has(id, /That’s a TUMMY\./));
  beat('a sniffle', id => has(id, /small and wet and sad/));
  beat('across the doorway', id => has(id, /she lay across the doorway so you wouldn’t be alone/));
  beat('I’m going in', id => has(id, /Nobody should be hungry and alone in the dark\./) && has(id, /I’m going in\./));
  beat('slowly, behind you', id => has(id, /Slowly\. Behind you\./) && castOf(id, 'riffle').some(c => c.pose === 'hug'));
  beat('cool, dry at the back (sneaking, drag marks, climbing)', id => frames[id].scene.cam === 'under' && has(id, /dry at the back/) &&
    ['sneaking', 'climbing'].every(s => (frames[id].caption || []).some(c => c.when && c.when.specialty === s)));
  beat('two big eyes', id => frames[id].scene.opts.eyes === 'sprinkle' && has(id, /two big eyes open, round as river stones/));
  beat('something unfolds', id => castOf(id, 'sprinkle').some(c => c.pose === 'unfold') && castOf(id, 'player').some(c => c.puffed));
  beat('as big as a heron', id => has(id, /as big as a heron, with scales the color of mist\. And wings\./));
  beat('EEEEEK!', id => has(id, /EEEEEK!/));
  beat('you can’t see me', id => has(id, /You can’t see me\./) && castOf(id, 'sprinkle').some(c => c.pose === 'hide'));
  beat('please don’t eat me', id => frames[id].choice && has(id, /Please don’t eat me\./) && has(id, /except her eyes/));
  beat('tuna?', id => has(id, /You smell like… tuna\?/));
  beat('I’m Sprinkle', id => has(id, /I’m Sprinkle\. A Mistscale dragonet\./) && has(id, /I used to be a pillow cat\./));
  beat('as big as ISLANDS', id => has(id, /ISLANDS!/) && has(id, /I’m not finished growing yet\./));
  beat('smooth as an egg', id => has(id, /plain grey, and smooth as an egg/) && castOf(id, 'sprinkle').some(c => c.holds === 'pebble'));
  beat('it isn’t mine', id => has(id, /But it isn’t mine\. So I rolled it back\./));
  beat('the wings', id => castOf(id, 'sprinkle').some(c => c.pose === 'wings') && has(id, /The right one droops low/));
  beat('I can’t fly', id => has(id, /The storm threw me out of the sky\. I can’t fly\./));
  beat('the train', id => frames[id].scene.opts.train && has(id, /Mama says count your claws/));
  beat('I’m right here', id => has(id, /It’s only a train\. I’m right here\./));
  beat('sorry; hungry? I’m an OTTER!', id => has(id, /I’m an OTTER!/) && castOf(id, 'riffle').some(c => c.pose === 'dive'));
  beat('GULP (and the swimming line)', id => /GULP/.test(frames[id].sfx || '') && (frames[id].caption || []).some(c => c.when && c.when.specialty === 'swimming'));
  beat('she burps CLOUDS', id => has(id, /She burps CLOUDS!/) && castOf(id, 'sprinkle').some(c => c.mist));
  beat('a fish for every claw on my forepaws', id => has(id, /a fish for every claw on my forepaws/));
  beat('Sprinkle’s dinner', id => frames[id].counts && frames[id].counts.set === 'ch03-dinner' && castOf(id, 'sprinkle').some(c => c.pose === 'pawsup'));
  beat('a bigger mouth', id => has(id, /Usually\./) && has(id, /bigger mouth/));
  beat('thirty-five, and nobody’s missing', id => has(id, /all seven of us hold up a forepaw/) && has(id, /Thirty-five, and nobody’s missing\./));
  beat('only mine. Five.', id => has(id, /This morning, there was only mine\. Five\./));
  beat('a misty tear', id => has(id, /A misty tear/) && castOf(id, 'sprinkle').some(c => c.tear));
  beat('six little forepaws in the mud', id => frames[id].counts && frames[id].counts.set === 'ch03-six' && castOf(id, 'sprinkle').some(c => c.pose === 'draw'));
  beat('out there somewhere; Mistscales are tough', id => has(id, /Six of us, out there somewhere/) && has(id, /Mistscales are tough\. Mama says so\./));
  beat('the littlest brother hiccups', id => has(id, /when he roars, he hiccups/));
  beat('will you look for them?', id => frames[id].choice && has(id, /Will you look for them\? Please\?/));
  beat('three forepaws in a pile', id => frames[id].scene.cam === 'paws' && has(id, /Riffle slaps his on top/));
  beat('a fifteen-claw promise', id => has(id, /Five, ten, fifteen! I’ve never made a fifteen-claw promise before\./));
  beat('the light turns gold', id => has(id, /The light turns gold\. Time to go home\./));
  beat('tell or keep', id => frames[id].choice && frames[id].choice.options.some(o => 'ch3Told' in o.sets) && has(id, /whatever crashed in the river ATE them!/));
  beat('Home: her nest is empty', id => has(id, /nest is empty\. She sleeps with the warriors now\./));
  beat('the stone (by your nose, under your chin), another stone', id => (frames[id].caption || []).some(c => c.when && c.when.ch2Stone === 'nose') &&
    (frames[id].caption || []).some(c => c.when && c.when.ch2Stone === 'chin') && has(id, /another stone, plain and grey/));
  beat('lighter, or it wriggles; the new warrior practises', id => (frames[id].caption || []).some(c => c.when && c.when.ch3Told === true) && (frames[id].caption || []).some(c => c.when && c.when.ch3Told === false) && has(id, /Nine times nine, eighty-one… Nine times nine… Mice…/));
  beat('even warriors practice; the bedtime tap', id => frames[id].skip && frames[id].skip.paws === 'own' && has(id, /Even warriors practice\./));
  beat('not ANOTHER one', id => has(id, /Oh no\. Not ANOTHER one\./));
  beat('six more dragonets; one of them hiccups', id => has(id, /six more dragonets are waiting to be found\. And one of them hiccups when he roars\./));
  beat('the Sky River', id => frames[id].scene.fx.includes('skyriver') && has(id, /the Sky River shines, and you fall asleep/));
  beat('the dream', id => frames[id].input && frames[id].input.kind === 'dream');
  beat('the end', id => frames[id].end);
  // (two beats may share a panel: the dug earth is a caption on the old tom's Counts frame)
  for (let i = 1; i < beats.length; i++) assert.ok(at(beats[i][1]) >= at(beats[i - 1][1]), beats[i][0] + ' comes after ' + beats[i - 1][0]);

  // each path in its own order
  const inOrder = (path, list, name) => {
    let last = -1;
    list.forEach(([label, pred]) => {
      const i = path.findIndex((id, k) => k > last && pred(id));
      assert.ok(i > last, name + ': path beat missing or out of order: ' + label);
      last = i;
    });
  };
  const toldBeats = [
    ['I know a cat who can help', id => has(id, /big and ginger, and kind/) && has(id, /If you trust her, I’ll try\./)],
    ['the wall at sunset', id => frames[id].scene.set === 'title' && frames[id].scene.fx.includes('sunset') && has(id, /Someone there needs help\./)],
    ['her fur puffs up (AGAIN?)', id => frames[id].choice && castOf(id, 'tallyheart').some(c => c.puffed) && (frames[id].say || []).some(b => b.when && b.when.ch2Path === 'bridge' && b.text === 'AGAIN?')],
    ['show me', id => has(id, /Show me\./)],
    ['four legs, two wings; hello, says the tail', id => has(id, /One… Mistscale\./) && (frames[id].say || []).some(b => b.name === 'The tail' && b.text === 'Hello.')],
    ['I count things', id => has(id, /I count things\./)],
    ['by FIVES', id => has(id, /I count claws\. By FIVES\./) && has(id, /Then we’ll get along\./)],
    ['too fast; between us', id => has(id, /Some cats would add that up too fast\. So for now, this stays between us\./)],
    ['the branch; that’s the rule', id => frames[id].scene.opts.branch && has(id, /That’s the rule\./)],
    ['almost no cat', id => has(id, /Well\. Almost no cat\./)],
    ['Tallyheart of CrystalClan is asking', id => has(id, /Tallyheart of CrystalClan is asking\./)],
    ['more courage than going in', id => has(id, /That took more courage than going in\./)]
  ];
  const keptBeats = [
    ['I won’t tell', id => has(id, /I won’t tell\. Not anyone\./)],
    ['hugged by fog', id => castOf(id, 'sprinkle').some(c => c.pose === 'curl') && has(id, /hugged by fog/)],
    ['shut like a clam', id => has(id, /Shut like a clam/) && castOf(id, 'riffle').some(c => c.pose === 'hush')],
    ['the vole at sunset', id => frames[id].scene.set === 'pile' && frames[id].scene.opts.vole && has(id, /you don’t eat it/)],
    ['toward the hedge', id => has(id, /You carry it toward the hedge\./)],
    ['SUPPER for a WALK', id => castOf(id, 'waffles').length && has(id, /SUPPER for a WALK/)],
    ['{name}paw? (Mmmf, or very, very still)', id => frames[id].choice && has(id, /\{name\}paw\?/)],
    ['been with that otter again?', id => has(id, /Been with that otter again\?/)],
    ['it just isn’t all of it', id => has(id, /It just isn’t all of it\./)],
    ['back before dark', id => has(id, /Back before dark\./) && has(id, /Her torn ear twitches/)],
    ['in MY day', id => has(id, /In MY day, we ATE our prey\./)],
    ['very… furry', id => has(id, /It’s very… furry\./)],
    ['Dewivewy!', id => has(id, /Dewivewy!/) && castOf(id, 'riffle').some(c => c.holds === 'fish2')],
    ['he means Delivery', id => has(id, /He means “Delivery!”/)],
    ['only the moths', id => has(id, /Only the moths come with you\./) && castOf(id, 'moth').length]
  ];
  for (const p of PATHS) {
    const path = walk(p), name = JSON.stringify(p);
    inOrder(path, p.ch3Told ? toldBeats : keptBeats, name);
    // a told path never sees the kept path's frames, and the other way round
    const other = p.ch3Told ? keptBeats : toldBeats;
    other.forEach(([label, pred]) => assert.ok(!path.some(pred), name + ': ' + label));
    // the river path's own screen, the bridge path's lines
    assert.equal(path.includes('f081'), p.ch2Path === 'river', name + ': the littlest brother on the tower');
    const flags = Object.assign({ specialty: 'friends' }, p);
    const lines = path.map(id => seen(frames[id], flags).join(' ')).join(' ');
    const bridgeOnly = [/you think of the sniffle under the bridge/, /Or eyelids\./, /The same sniffle as before\./, /The drag marks are still here\./,
      /The same two eyes\. This time, they don’t vanish\./, /You’re the one who said hello\. I was too shy\./, /If you ever hear a roar with a hiccup, that’s him\./];
    const riverOnly = [/you think of the roar with a hiccup/, /Deep drag marks run up out of the river/, /We heard him! On the tallest tower!/, /He’s safe up high\./];
    bridgeOnly.forEach(re => assert.equal(re.test(lines), p.ch2Path === 'bridge', name + ': ' + re));
    riverOnly.forEach(re => assert.equal(re.test(lines), p.ch2Path === 'river', name + ': ' + re));
    assert.equal(/AGAIN\?/.test(lines), p.ch2Path === 'bridge' && p.ch3Told, name + ': AGAIN?');
    assert.ok(/Mistscales are tough\. Mama says so\./.test(lines), name + ': before bedtime on every path');
  }
  // the six specialty lines and the one worry, each once
  const variantLines = { noticing: /The dug earth behind the pile is bigger/, sneaking: /sock-sneaking paws/, climbing: /Iron beams cross the dark above/,
    friends: /shyest new friend you’ve ever made/, swimming: /a fish slips right between your paws/ };
  Object.keys(variantLines).forEach(s => {
    const where = ids.filter(id => texts(frames[id]).some(x => x.when && x.when.specialty === s));
    assert.equal(where.length, 1, s);
    assert.ok(texts(frames[where[0]]).some(x => x.when && x.when.specialty === s && variantLines[s].test(x.text)), s);
  });
  const worry = ids.filter(id => texts(frames[id]).some(x => x.when && x.when.worry));
  assert.deepEqual(worry.map(id => texts(frames[id]).find(x => x.when && x.when.worry).when), [{ worry: 'shiny' }]);
  assert.match(T(worry[0]), /Me too\. Especially shiny ones\./);

  // the end is warm: night, no moon, in her nest with the stone, the Sky River
  const end = frames[ids[ids.length - 1]];
  assert.ok(end.scene.fx.includes('night') && end.scene.fx.includes('skyriver'), 'a calm night with the Sky River');
  assert.equal(end.scene.set, 'den');
  assert.notEqual(end.scene.opts.moon, true);
  assert.equal(end.scene.opts.stone, 'auto', 'the stone where she put it');
  assert.ok(end.scene.cast.some(c => c.who === 'player' && c.at === 'nest'), 'she is in her nest');
  assert.match(end.caption.join(' '), /warm/);
  assert.match(end.caption.join(' '), /stone/);
  assert.match(end.caption.join(' '), /Sky River/);
  assert.equal(end.caption[end.caption.length - 1], 'End of Chapter Three.');
});

/* ------------------------------------------------------------------ Counts */

function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }
const pairs = d => d.facts.map(f => { const q = factAB(f); return q.a + 'x' + q.b; });

test('counts: every set exactly as the text’s Build notes have it', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), ['ch03-ears', 'ch03-pile', 'ch03-claws', 'ch03-dinner', 'ch03-six']);
  const ears2 = PC.story.ch02.counts['ch02-ears'];
  // the warm-up on the 2s, adaptive, and its own short set
  const w = C['ch03-ears'];
  assert.deepEqual([w.table, w.thing, w.things, w.teacher], [2, 'ear', 'ears', 'tallyheart']);
  assert.deepEqual(w.facts, [[4, 2], [6, 2]]);
  assert.deepEqual(w.warmHard, { table: 2, at: 1, alt: [[2, 3], [2, 2], [2, 1]] });
  assert.deepEqual(w.avoid, [[9, 2], [7, 2]]);
  assert.deepEqual([w.ground, w.fillFrom, w.fillIntro, w.done], ['earth', 'ch02-ears', 'One from yesterday.', null]);
  // chapter 2's ears lines (praise, fast, help, remembered), but not its firstPrompt nor its fastAfterMiss
  ['praise', 'fast', 'helpIntro', 'helpIntroFar', 'miss', 'missLast', 'remembered'].forEach(k => assert.deepEqual(w[k], ears2[k], 'the warm-up uses chapter 2’s ' + k));
  assert.equal(w.rememberedSlow, '{a} × {b} again, and you got it. It’s getting easier.');
  assert.equal(w.firstPrompt, undefined, 'the generic “Four cats. How many ears?” asks the opener');
  // and chapter 2's fastAfterMiss, which says scratches: true at the den doorway, for its own questions too
  assert.deepEqual(w.fastAfterMiss, ears2.fastAfterMiss);
  assert.deepEqual(ears2.fastAfterMiss, ['Ha! You didn’t even look at the scratches that time.']);
  const own = play(after2(), 'ch03-ears', { '4x2': [9] }, { all: 1500 });
  assert.deepEqual([own[1].k, own[1].kind, own[1].line], ['6x2', 'fast', 'Ha! You didn’t even look at the scratches that time.'], 'a quick right 6 × 2 after a missed opener');
  // the pile: the old tom's nine pairs in a thought cloud, then her seven, lit as she noses them
  const p = C['ch03-pile'];
  assert.deepEqual([p.table, p.thing, p.things, p.unit, p.units, p.teacher], [2, 'piece', 'pieces', 'pair', 'pairs', 'tallyheart']);
  assert.deepEqual(p.picture, { kind: 'prey', layout: 'stacks' });
  assert.deepEqual(pairs(p), ['9x2', '7x2']);
  const tom = p.facts[0];
  assert.equal(tom.picture.thought, true);
  assert.deepEqual(tom.prompt, [{ who: 'grizzled', text: 'Nine pairs. How many pieces?' }]);
  assert.deepEqual(tom.right, [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'Right.' }]);
  assert.equal(tom.rightAgain, true, 'also on a right retry');
  const mine = p.facts[1];
  assert.deepEqual([mine.light, mine.check], ['groups', true]);
  assert.equal(mine.prompt.map(x => x.text).join(' '), 'You touch your nose to each little stack. One pair. Two pairs… Seven pairs. And that’s all. How many pieces?');
  assert.ok(mine.prompt.every(x => x.kind === 'caption'), 'narration, as captions');
  assert.deepEqual([p.praise, p.done, p.fillFrom, p.fillIntro], [[], null, 'ch02-ears', 'One from yesterday.']);
  assert.equal(p.fast, undefined, 'the old tom never grumbles, and nobody praises speed at the pile');
  // claws, the 5s: ten facts in both orders, every number from 1 to 10 once
  const c = C['ch03-claws'];
  assert.deepEqual([c.table, c.thing, c.things, c.unit, c.units, c.teacher], [5, 'claw', 'claws', 'paw', 'paws', 'tallyheart']);
  assert.deepEqual(pairs(c), ['4x5', '5x2', '1x5', '5x5', '5x6', '5x8', '5x3', '9x5', '7x5', '10x5']);
  const others = c.facts.map(f => { const q = factAB(f); return q.a === 5 ? q.b : q.a; });
  assert.deepEqual(others.slice().sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const fiveFirst = c.facts.map(factAB).filter(q => q.a === 5 && q.b !== 5).length, fiveSecond = c.facts.map(factAB).filter(q => q.b === 5 && q.a !== 5).length;
  assert.deepEqual([fiveFirst, fiveSecond], [4, 5], 'four with the five first, five with it second, and 5 × 5');
  const rimSkip = frames[ids.find(id => frames[id].skip && frames[id].skip.who)].skip;
  assert.deepEqual(c.facts[0].who, rimSkip.who.slice(0, 4), '4 × 5 pictures the first four rim paws');
  assert.equal(c.firstPrompt, 'How many claws on the first four paws?');
  assert.deepEqual(c.facts[1].right, [{ who: 'tallyheart', text: 'Ten! Two paws, five claws each. Yesterday it was five cats, two ears each. Same ten!' }]);
  assert.equal(c.facts[1].rightAgain, true);
  const six = c.facts[4];
  assert.deepEqual([six.a, six.b, six.lit, six.retryPrompt, six.rightAgain], [5, 6, 25, true, true]);
  assert.equal(six.prompt, 'Six paws. The first five have twenty-five claws. Now hop on from twenty-five!');
  assert.deepEqual(six.right, [{ who: 'tallyheart', text: 'Thirty! {Murmur}chime knew it the other way around this morning. Now you know both.' }]);
  // the text's five lines along the way; “You hopped it!” last, since 4 × 5 says it first
  assert.deepEqual(c.praise, ['Hopping by fives, like a real hunter.', 'Yes! Five claws on every forepaw.', 'Claws are trickier than ears, and you’re doing it anyway.', 'Hop, hop, hop!', 'You hopped it!']);
  assert.deepEqual(c.facts[0].right, [{ who: 'tallyheart', text: 'You hopped it!' }]);
  assert.deepEqual(c.fast, ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.']);
  assert.deepEqual(c.fastAfterMiss, ['Ha! You didn’t even look at the sand that time.'], 'the Hollow’s sand: true here');
  assert.equal(c.helpIntro, 'Close. Let’s scratch it out together: one swipe for every paw, five lines a swipe.');
  assert.equal(c.helpIntroFar, c.helpIntro.replace(/^Close\.\s*/, ''));
  assert.equal(c.helpIntroNotFive, 'Remember: hopping by fives, every number ends in a five or a zero. Let’s scratch it out together.');
  assert.equal(c.done, 'That’s the fives.');
  // after the bridged 5 × 6, no answer is the one before plus or minus five
  const ans = c.facts.map(f => { const q = factAB(f); return q.a * q.b; });
  for (let i = ans.indexOf(30) + 1; i < ans.length; i++) assert.notEqual(Math.abs(ans[i] - ans[i - 1]), 5, ans[i - 1] + ' then ' + ans[i]);
  // no praise, fast or again line names a total (they are dealt out in turn); "five claws" is the per-paw constant
  const TOTALS = /\b(ten|fifteen|twenty|twenty-five|thirty|thirty-five|forty|forty-five|fifty)\b|\d/i;
  [].concat(c.praise, c.fast, c.fastAfterMiss, c.again || []).forEach(l => assert.doesNotMatch(l.replace(/Five claws on every forepaw|by fives/i, ''), /\bfive\b/i, l));
  [].concat(c.praise, c.fast, c.fastAfterMiss, c.again || []).forEach(l => assert.doesNotMatch(l, TOTALS, l));
  // Sprinkle's two: one question each, her own voice, help in the mud with the player hopping
  for (const id of ['ch03-dinner', 'ch03-six']) {
    const d = C[id];
    assert.deepEqual([d.teacher, d.table, d.ground, d.helpCounter, d.fillFrom, d.fillIntro, d.fillOrder, d.fillVoice, d.done],
      ['sprinkle', 5, 'mud', 'you', 'ch03-claws', 'Count another one with me.', 'easiest', 'borrower', null], id);
    assert.deepEqual([d.thing, d.things, d.unit, d.units], id === 'ch03-dinner' ? ['fish', 'fish', 'forepaw', 'forepaws'] : ['claw', 'claws', 'forepaw', 'forepaws'], id);
    assert.equal(d.helpIntro, 'Let’s scratch it in the mud. You hop!');
    assert.equal(d.helpIntroFar, undefined, id + ': the same line either way');
    assert.equal(d.facts.length, 1);
    // never the Hollow's sand, never Mama in the quiet six
    [].concat(d.praise, d.fast, d.fastAfterMiss, d.again, d.miss, d.missLast).forEach(l => assert.doesNotMatch(l, /sand/, id + ': ' + l));
  }
  const dn = C['ch03-dinner'], df = dn.facts[0];
  assert.deepEqual([df.a, df.b], [2, 5], 'groups first: “Two forepaws, five claws each”');
  assert.deepEqual(df.who, [{ who: 'sprinkle' }, { who: 'sprinkle' }], 'her two forepaws');
  assert.deepEqual(df.prompt, [{ who: 'player', text: 'Hop by fives!' }, { kind: 'caption', text: 'Two forepaws, five claws each. How many fish at a meal?' }]);
  assert.equal(df.retryPrompt, 'Two forepaws, five claws each. How many fish at a meal?');
  assert.deepEqual(df.right, [{ who: 'sprinkle', text: 'TEN! How did you DO that?' }, { who: 'player', text: 'Five, ten. Hopping!' }]);
  assert.deepEqual(df.rightAgain, [{ who: 'sprinkle', text: 'TEN! Hopping really works!' }]);
  assert.equal(dn.againIntro, 'Let’s count my dinner again!');
  assert.deepEqual([dn.praise, dn.fast, dn.fastAfterMiss, dn.again], [['Hop, hop, hop! Like you showed me.', 'My claws say yes!'], ['Even faster than Mama!'], ['You didn’t even look at the mud!'], ['You remembered! I knew you would.']]);
  assert.deepEqual([dn.miss, dn.missLast], ['There! We’ll count that one again soon.', 'There. Now we’ve counted it together.']);
  const sx = C['ch03-six'], sf = sx.facts[0];
  assert.deepEqual([sf.a, sf.b], [6, 5]);
  assert.deepEqual(sx.picture, { kind: 'mud' }, 'the six forepaws she drew in the mud');
  assert.deepEqual(sf.prompt, [{ kind: 'caption', text: 'Six forepaws, five claws each. How many claws in the mud?' }]);
  assert.equal(sf.retryPrompt, undefined, 'the retry reads from the generic question');
  assert.deepEqual(sf.right, [{ who: 'sprinkle', text: 'Thirty claws.', kind: 'whisper' }]);
  assert.equal(sf.rightAgain, true, 'its short right line on a retry too');
  assert.equal(sx.againIntro, 'Let’s count them again.');
  assert.deepEqual([sx.praise, sx.again, sx.fast, sx.fastAfterMiss], [['Yes. Five claws each.'], ['Yes. Five claws each.'], ['You knew that one.'], ['You knew that one.']]);
  assert.deepEqual([sx.miss, sx.missLast], ['There. We’ll count them again in a moment.', 'There. Now we’ve counted them together.']);
  [].concat(sx.praise, sx.fast, sx.again, sx.miss, sx.missLast).forEach(l => assert.doesNotMatch(l, /Mama/, 'the six speaks quietly'));
  // "Six of us, out there somewhere" is frame text on the next screen, which every player reads
  const sixFrame = ids.find(id => frames[id].counts && frames[id].counts.set === 'ch03-six');
  assert.match(T(frames[sixFrame].counts.next), /Six of us, out there somewhere\. And I can’t fly to find them\./);
  // every fact: arithmetic, both orders of the 5s, no duplicates in a set; the fill sets exist
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
      if (!Array.isArray(f)) {
        assert.deepEqual(Object.keys(f).filter(x => !['a', 'b', 'table', 'groups', 'per', 'picture', 'who', 'lit', 'light', 'check', 'prompt', 'retryPrompt', 'right', 'rightAgain', 'rightPicture'].includes(x)), [], sid + ': fact keys');
        if (f.lit !== undefined) assert.ok(Number.isInteger(f.lit) && f.lit > 0 && f.lit < q.a * q.b, sid + ': lit is fewer than the answer');
      }
      assert.ok(!keys.has(q.a + 'x' + q.b), sid + ': ' + q.a + 'x' + q.b + ' twice');
      keys.add(q.a + 'x' + q.b);
    });
  });
  // 16 typed answers with no misses (chapter 2: 16), and 9 taps
  const typed = Object.keys(C).reduce((n, sid) => n + C[sid].facts.length, 0);
  assert.equal(typed, 16);
  const taps = ids.filter(id => frames[id].skip).reduce((n, id) => n + frames[id].skip.groups, 0);
  assert.equal(taps, 9);
  t.diagnostic(typed + ' typed answers and ' + taps + ' taps with no misses');
  // the Hollow offers the claws by name, never the warm-up, the pile or Sprinkle's sets
  assert.deepEqual(E.countSets(STORIES).map(x => x.setId), ['ch01-tails', 'ch02-ears', 'ch03-claws']);
  assert.equal(E.countName(C['ch03-claws'], 5), 'Claws · the 5s');
});

test('counts: lines are short, whole sentences, and fit both sexes', () => {
  countsLines().forEach(x => {
    assert.ok(typeof x.text === 'string', x.set + ' ' + x.where);
    assert.ok(x.text.trim(), x.set + ' ' + x.where + ' is empty');
    assert.ok(words(x.text) <= 18, x.set + ' ' + x.where + ': short: ' + x.text);
    if (x.who) assert.ok(['tallyheart', 'grizzled', 'player', 'sprinkle'].includes(x.who), x.set + ' ' + x.where + ': who');
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.set + ' ' + x.where + ': ' + x.text));
  });
});

/* One lesson through the engine as the page asks it: [{ k, q, D, prompt, line, kind, balloons, help }].
 * `answers` maps "AxB" to the answers she types for its asks in turn; `ms` its times (or `all`). */
function play(cat, setId, answers, ms) {
  const { def, state: st } = E.chapterLesson(cat, story.counts[setId] ? story : PC.story.ch02, setId, 1, STORIES);
  const seenK = {}, out = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), k = q.a + 'x' + q.b;
    const i = seenK[k] = (seenK[k] || 0) + 1;
    const a = answers && answers[k] && answers[k][i - 1] != null ? answers[k][i - 1] : q.answer;
    const t = ms && ms[k] != null ? ms[k] : (ms && ms.all) || 2000;
    const D = E.questionDef(def, q, story.counts[setId] ? story : PC.story.ch02, STORIES);
    const prompt = E.promptLines(def, D, q);
    const r = E.counts.answer(st, D, a, t, 1);
    E.logAnswer(cat, r.entry);
    const row = { k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, line: r.line, kind: r.lineKind, balloons: r.balloons, res: r };
    if (!r.correct) row.help = E.helpPlan(def, D, q, r);
    out.push(row);
  }
  cat.lessons[setId] = E.counts.summary(st);
  return out;
}
const ks = rows => rows.map(r => r.k);
/* A cat that read chapters 1 and 2, with these answers and times in chapter 2's ears lesson. */
function after2(ears, earsMs) {
  const cat = E.blankCat({ now: 1 });
  cat.finished = { ch01: 1, ch02: 2 };
  cat.lessons['ch01-tails'] = { finished: true, noHelp: true };
  play(cat, 'ch02-ears', ears, earsMs);
  return cat;
}
const pairKey = k => k.replace(/^[A-Z]:/, '').replace('✗', '').split('x').map(Number).sort((a, b) => a - b).join('x');

test('the warm-up, the Build notes’ tests: her hardest fact second, the opener never hard nor its pair, the pile’s pairs kept away, scratched in the earth, and “scratches” after a miss', () => {
  // nothing hard: 4 × 2, then 6 × 2
  assert.deepEqual(ks(play(after2(), 'ch03-ears')), ['4x2', '6x2']);
  // misses on 3 × 2 and 4 × 2 in chapter 2's ears: the warm-up opens on 2 × 2, and the 2 × 3 pair is asked once
  const two = play(after2({ '3x2': [7], '4x2': [9] }), 'ch03-ears');
  assert.equal(two[0].k, '2x2', 'opens on 2 × 2');
  assert.ok(two[1].q.hard, 'her hardest fact second');
  assert.ok(two.filter(r => pairKey(r.k) === '2x3').length <= 1, 'the 2 × 3 pair never asked twice');
  // a player whose top hard facts include 4 × 2 never opens on it
  const top = play(after2({ '4x2': [9] }), 'ch03-ears');
  assert.notEqual(pairKey(top[0].k), '2x4');
  assert.deepEqual(ks(top), ['2x3', '4x2'], 'its hard fact second, and 2 × 3 opens');
  // the hard pick passes over the pile's pairs (9 × 2 and 7 × 2, either way round)
  assert.deepEqual(ks(play(after2({ '9x2': [17], '7x2': [13] }), 'ch03-ears')), ['4x2', '6x2'], 'nothing else hard: as written');
  const past = play(after2({ '9x2': [17], '2x8': [15] }), 'ch03-ears');
  assert.equal(pairKey(past[1].k), '2x8', 'the next hardest instead');
  // a missed second question borrows yesterday's ears, never 9 × 2 or 7 × 2 while there is another
  const miss = play(after2(), 'ch03-ears', { '6x2': [13] }, { all: 1500 });
  assert.deepEqual(miss.map(r => r.k.replace(/x\d+$/, m => m)).length, 5);
  assert.equal(miss[1].k, '6x2✗');
  assert.ok(miss.slice(2, 4).every(r => r.q.filler && r.q.from === 'ch02-ears'), 'two borrowed from chapter 2’s ears');
  assert.ok(!miss.some(r => r.q.filler && ['2x9', '2x7'].includes(pairKey(r.k))), 'never the pile’s pairs');
  assert.equal(miss[4].k, 'R:6x2', 'back two questions later');
  assert.equal(miss[2].prompt[0].text.split('. ')[0] + '.', 'One from yesterday.');
  // a fast right borrowed question after the miss says "scratches", never "sand"
  assert.deepEqual([miss[2].kind, miss[2].line], ['fast', 'Ha! You didn’t even look at the scratches that time.']);
  assert.ok(miss.every(r => !/sand/.test(r.line || '')), 'no sand at the den doorway');
  // the warm-up's help is scratched in the earth by the doorway, two lines a cat; a missed borrowed one too
  assert.deepEqual([miss[1].help.ground, miss[1].help.counter, miss[1].help.nums], ['earth', 'tallyheart', [2, 4, 6, 8, 10, 12]]);
  const bm = play(after2(), 'ch03-ears', { '6x2': [13], '2x10': [19], '10x2': [19] });
  const borrowedMiss = bm.find(r => r.q.filler && !r.res.correct);
  assert.ok(borrowedMiss, ks(bm).join(' '));
  assert.equal(borrowedMiss.help.ground, 'earth', 'a missed borrowed question is scratched in the earth too');
  // and at the pile, the old tom: "Hmph." "Right." first time and on a right retry; 7 × 2 a check
  const pileCat = after2();
  play(pileCat, 'ch03-ears');
  const pile = play(pileCat, 'ch03-pile', { '9x2': [17] });
  assert.deepEqual(pile.map(r => r.k).filter(k => !/^F:/.test(k)), ['9x2✗', '7x2', 'R:9x2']);
  assert.ok(!pile.some(r => r.q.filler && ['2x9', '2x7', '2x4', '2x6'].includes(pairKey(r.k))), 'never a pair this morning has asked');
  assert.deepEqual(pile.find(r => r.k === 'R:9x2').balloons, [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'Right.' }]);
  assert.equal(pile[0].help.ground, 'earth');
  assert.ok(pileCat.counts.filter(e => e.set === 'ch03-pile' && e.a === 7).every(e => e.check), '7 × 2 is a check');
});

test('E.hardFacts and reading time: a slow right 2 × 6 from chapter 2 never becomes the warm-up’s hard fact; a missed one does', () => {
  const slow = after2(null, { '2x6': 9000 });
  assert.ok(!E.hardFacts(slow, 2, STORIES).some(f => pairKey(f.join('x')) === '2x6'), 'read under its prompt: its speed says nothing');
  assert.deepEqual(ks(play(slow, 'ch03-ears')), ['4x2', '6x2'], 'nothing hard: 6 × 2 is asked as written, not as the hard fact');
  const missed = after2({ '2x6': [11] });
  assert.equal(pairKey(E.hardFacts(missed, 2, STORIES)[0].join('x')), '2x6');
  const run = play(missed, 'ch03-ears');
  assert.ok(run[1].q.hard && pairKey(run[1].k) === '2x6', 'the miss makes it hard');
  // a right quick hard fact earns the remembered line; a right slow one the slow line
  assert.equal(play(after2({ '2x8': [15] }), 'ch03-ears', null, { all: 2000 })[1].line, 'Last time, 2 × 8 made you stop and think. Not today!');
  assert.equal(play(after2({ '2x8': [15] }), 'ch03-ears', null, { all: 7000 })[1].line, '2 × 8 again, and you got it. It’s getting easier.');
  // this chapter's prompted facts count as read for chapter 4's warm-up: 4 × 5, 5 × 6, Sprinkle's two
  [['ch03-claws', 4, 5], ['ch03-claws', 5, 6], ['ch03-dinner', 2, 5], ['ch03-six', 6, 5], ['ch03-pile', 9, 2]].forEach(([set, a, b]) => assert.equal(E.readFirst({ set, a, b }, STORIES), true, set + ' ' + a + 'x' + b));
  [['ch03-claws', 5, 8], ['ch03-claws', 9, 5], ['ch03-claws', 7, 5]].forEach(([set, a, b]) => assert.equal(E.readFirst({ set, a, b }, STORIES), false, set + ' ' + a + 'x' + b));
});

test('E.hardFacts and reading time: “opens the set” is where it was asked, so a warm-up’s quick hard pick clears whatever its pair', () => {
  // a chapter 2 miss on 4 × 2, 2 × 2 or 2 × 1 (the warm-up's opener and alt pairs): asked second as the
  // hard pick, quick and right, it hears "Not today!" and is no longer hard
  [['4x2', 9], ['2x2', 5], ['2x1', 3]].forEach(([k, wrong]) => {
    const cat = after2({ [k]: [wrong] });
    assert.deepEqual(E.hardFacts(cat, 2, STORIES).map(f => pairKey(f.join('x'))), [pairKey(k)], k + ': hard after chapter 2');
    const run = play(cat, 'ch03-ears', null, { all: 1500 });
    assert.ok(run[1].q.hard && pairKey(run[1].k) === pairKey(k), k + ': asked second, as the hard pick: ' + ks(run).join(' '));
    assert.equal(run[1].kind, 'remembered', k + ': “Not today!”');
    assert.ok(!E.hardFacts(cat, 2, STORIES).some(f => pairKey(f.join('x')) === pairKey(k)), k + ': a quick right hard pick clears it');
  });
  // the opener itself is still read first: a slow right 4 × 2 opening the warm-up says nothing
  const slowOpen = after2();
  assert.deepEqual(ks(play(slowOpen, 'ch03-ears', null, { '4x2': 9000 })), ['4x2', '6x2']);
  assert.ok(!E.hardFacts(slowOpen, 2, STORIES).some(f => pairKey(f.join('x')) === '2x4'), 'the opener, slow: still read first');
  // and a slow right hard pick is slow: still hard
  const slowHard = after2({ '4x2': [9] });
  play(slowHard, 'ch03-ears', null, { all: 1500, '4x2': 9000 });
  assert.equal(pairKey(E.hardFacts(slowHard, 2, STORIES)[0].join('x')), '2x4', 'a slow hard pick stays hard');
  // chapter 2's own warm-up, read again after a missed opener 1 × 4: 1 × 3 opens, the quick 1 × 4 clears
  const cat = E.blankCat({ now: 1 });
  cat.finished = { ch01: 1, ch02: 2 };
  cat.lessons['ch01-tails'] = { finished: true, noHelp: true };
  play(cat, 'ch02-tails', { '1x4': [5] });
  assert.deepEqual(E.hardFacts(cat, 1, STORIES), [[1, 4]]);
  const again = play(cat, 'ch02-tails', null, { all: 1500 });
  assert.deepEqual(ks(again).slice(0, 2), ['1x3', '1x4']);
  assert.equal(again[1].kind, 'remembered');
  assert.deepEqual(E.hardFacts(cat, 1, STORIES), [], 'cleared');
  // E.readFirst on its own: an opener pair counts only as the opener
  assert.equal(E.readFirst({ set: 'ch03-ears', a: 4, b: 2 }, STORIES), true);
  assert.equal(E.readFirst({ set: 'ch03-ears', a: 4, b: 2 }, STORIES, null, false), false);
  assert.equal(E.readFirst({ set: 'ch03-claws', a: 5, b: 6 }, STORIES, null, false), true, 'a fact’s own prompt is read wherever it is asked');
});

test('the warm-up borrows the pile’s pairs (9 × 2, 7 × 2) only when nothing else is left: not even after many misses', () => {
  // a struggling reader's warm-up runs out of fresh pairs; it repeats one this lesson asked before it
  // ever borrows a pair the pile is about to ask (the old tom's "Nine pairs")
  let borrowedAvoided = 0, long = 0;
  for (let seed = 1; seed <= 600; seed++) {
    let x = (seed * 2654435761) >>> 0;
    const rnd = () => ((x = (Math.imul(x, 1103515245) + 12345) >>> 0) / 4294967296);
    const cat = E.blankCat({ now: 1 });
    cat.finished = { ch01: 1, ch02: 2 };
    cat.lessons['ch01-tails'] = { finished: true, noHelp: true };
    for (const sid of ['ch02-ears', 'ch03-ears']) {
      const { def, state: st } = E.chapterLesson(cat, story.counts[sid] ? story : PC.story.ch02, sid, 1, STORIES);
      while (!E.counts.done(st)) {
        const q = E.counts.question(st);
        const r = E.counts.answer(st, E.questionDef(def, q, story, STORIES), rnd() < (sid === 'ch02-ears' ? 0.3 : 0.6) ? q.answer + 1 : q.answer, 1500, 1);
        E.logAnswer(cat, r.entry);
        if (sid === 'ch03-ears' && q.filler && ['2x7', '2x9'].includes(pairKey(q.a + 'x' + q.b))) borrowedAvoided++;
      }
      if (sid === 'ch03-ears' && st.queue.length > 10) long++;
      cat.lessons[sid] = E.counts.summary(st);
    }
  }
  assert.ok(long > 20, 'the sweep reaches long, many-miss warm-ups: ' + long);
  assert.equal(borrowedAvoided, 0);
});

test('claws, the Build notes’ tests: in order, the same ten, hop on from twenty-five, the five-or-zero help, swipes in the sand', () => {
  const c = story.counts['ch03-claws'];
  const run = play(after2(), 'ch03-claws', null, { all: 5000 });
  assert.deepEqual(ks(run), ['4x5', '5x2', '1x5', '5x5', '5x6', '5x8', '5x3', '9x5', '7x5', '10x5']);
  assert.deepEqual(run[0].prompt, [{ who: 'tallyheart', text: 'How many claws on the first four paws?' }]);
  assert.deepEqual(run[0].q.who.map(w => w.who), ['clancat', 'murmurchime', 'clancat', 'clancat']);
  assert.deepEqual(run[0].balloons, [{ who: 'tallyheart', text: 'You hopped it!' }], '4 × 5 says the text’s “You hopped it!”');
  // quick, too: she has just hopped those four paws, so never “You didn’t even have to hop that time.”
  const quick = play(after2(), 'ch03-claws', null, { all: 2000 });
  assert.deepEqual([quick[0].balloons, quick[0].line], [[{ who: 'tallyheart', text: 'You hopped it!' }], '']);
  // ... and right on its retry after a miss; and not again two questions on (it is the last praise)
  const missed45 = play(after2(), 'ch03-claws', { '4x5': [21] });
  assert.deepEqual(missed45.find(r => r.q.retry).balloons, [{ who: 'tallyheart', text: 'You hopped it!' }]);
  for (const r of [run, quick]) assert.ok(!r.slice(1, 5).some(x => x.line === 'You hopped it!'), ks(r).join(' '));
  assert.deepEqual(run[1].balloons, c.facts[1].right);
  assert.deepEqual([run[4].q.lit, run[4].prompt[0].text], [25, 'Six paws. The first five have twenty-five claws. Now hop on from twenty-five!']);
  assert.deepEqual(run[4].balloons, c.facts[4].right);
  // missed 5 × 6 and 5 × 2: each back two questions later, the 5 × 6 prompt kept, both right lines on a right retry
  const miss = play(after2(), 'ch03-claws', { '5x6': [29], '5x2': [12] });
  assert.deepEqual(ks(miss), ['4x5', '5x2✗', '1x5', '5x5', 'R:5x2', '5x6✗', '5x8', '5x3', 'R:5x6', '9x5', '7x5', '10x5']);
  assert.deepEqual(miss[4].balloons, c.facts[1].right);
  assert.equal(miss[8].prompt[0].text, 'Here’s that one again. Six paws. The first five have twenty-five claws. Now hop on from twenty-five!');
  assert.deepEqual(miss[8].balloons, c.facts[4].right);
  // the help: swipes on the sand, five lines a paw, hopped by fives
  const h = miss[1].help;
  assert.deepEqual([h.ground, h.style, h.nums, h.counter], ['sand', 'swipe', [5, 10], 'tallyheart']);
  // 34 for 7 × 5 opens with the five-or-zero line; 30 doesn't (it's "Close."); 20 is far
  const helpFor = given => play(after2(), 'ch03-claws', { '7x5': [given] }).find(r => r.k === '7x5✗').help;
  assert.equal(helpFor(34).intro, c.helpIntroNotFive);
  assert.deepEqual(helpFor(34).nums, [5, 10, 15, 20, 25, 30, 35]);
  assert.equal(helpFor(30).intro, c.helpIntro);
  assert.equal(helpFor(20).intro, c.helpIntroFar);
  // a fast right after a miss: the Hollow's sand, true here
  const fast = play(after2(), 'ch03-claws', { '4x5': [21] }, { all: 1500 });
  assert.ok(fast.some(r => r.line === 'Ha! You didn’t even look at the sand that time.'));
  // her claws lesson finished, the tree's third mark
  const cat = after2(); play(cat, 'ch03-claws');
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto' } }, cat, STORIES).opts.marks, 3);
});

test('under the bridge, the Build notes’ tests: the player hops in the mud, Sprinkle’s words on a retry, the easiest claws borrowed in her voice', () => {
  const dinner = story.counts['ch03-dinner'], six = story.counts['ch03-six'];
  const lines = d => [].concat(d.praise, d.fast, d.fastAfterMiss, d.again, d.miss, d.missLast, d.helpIntro, d.fillIntro, d.againIntro);
  // a missed 2 × 5: borrows 1 × 5 then 5 × 3, the easiest first, and comes back in Sprinkle's words
  const cat = after2(); play(cat, 'ch03-claws');
  const run = play(cat, 'ch03-dinner', { '2x5': [12] }, { all: 1500 });
  assert.deepEqual(ks(run), ['2x5✗', 'F:1x5', 'F:5x3', 'R:2x5']);
  assert.deepEqual(run[3].prompt, [{ who: 'sprinkle', text: 'Let’s count my dinner again! Two forepaws, five claws each. How many fish at a meal?' }]);
  // a right retry says "Hopping really works!", never "How did you DO that?"
  assert.deepEqual(run[3].balloons, [{ who: 'sprinkle', text: 'TEN! Hopping really works!' }]);
  // the help: Sprinkle swipes the mud, the player hops 5 · 10 in her own balloon
  assert.deepEqual([run[0].help.ground, run[0].help.style, run[0].help.counter, run[0].help.teacher, run[0].help.nums, run[0].help.intro],
    ['mud', 'swipe', 'player', 'sprinkle', [5, 10], 'Let’s scratch it in the mud. You hop!']);
  // the borrowed questions: this morning's claws in Sprinkle's voice, with her lines, never Tallyheart's
  run.slice(1, 3).forEach(r => {
    assert.equal(r.q.from, 'ch03-claws');
    assert.equal(r.D.teacher, 'sprinkle');
    assert.equal(r.prompt[0].who, 'sprinkle');
    assert.match(r.prompt[0].text, /^Count another one with me\. /);
    assert.ok(lines(dinner).includes(r.line), 'her own line: ' + r.line);
  });
  // a missed borrowed question is scratched in the mud, hopped by the player, in her words
  const bm = play((c => { play(c, 'ch03-claws'); return c; })(after2()), 'ch03-dinner', { '2x5': [12], '1x5': [6] });
  const fm = bm.find(r => r.k === 'F:1x5✗');
  assert.deepEqual([fm.help.ground, fm.help.counter, fm.help.intro], ['mud', 'player', 'Let’s scratch it in the mud. You hop!']);
  // a missed 6 × 5 hops 5 · 10 · 15 · 20 · 25 · 30 in the mud, in the player's balloon, and comes back as Sprinkle asks it
  const sixCat = after2(); play(sixCat, 'ch03-claws'); play(sixCat, 'ch03-dinner');
  const sx = play(sixCat, 'ch03-six', { '6x5': [25] }, { all: 1500 });
  assert.deepEqual(ks(sx), ['6x5✗', 'F:1x5', 'F:5x3', 'R:6x5'], 'a missed six after a dinner that borrowed nothing borrows 1 × 5 and 5 × 3 too');
  assert.deepEqual([sx[0].help.nums, sx[0].help.counter, sx[0].help.ground], [[5, 10, 15, 20, 25, 30], 'player', 'mud']);
  assert.equal(sx[3].prompt[0].text, 'Let’s count them again. Six forepaws. How many claws?');
  assert.deepEqual(sx[3].balloons, [{ who: 'sprinkle', text: 'Thirty claws.', kind: 'whisper' }], 'its short right line on a retry');
  // the six's borrowed questions speak only the six's quiet lines
  sx.slice(1, 3).forEach(r => { assert.equal(r.D.teacher, 'sprinkle'); assert.ok(lines(six).includes(r.line), r.line); });
  // never a pair the bridge has asked while the pool has another: after a dinner that borrowed 1 × 5 and 5 × 3
  const both = after2(); play(both, 'ch03-claws'); play(both, 'ch03-dinner', { '2x5': [12] });
  const sx2 = play(both, 'ch03-six', { '6x5': [25] });
  assert.ok(!sx2.some(r => r.q.filler && ['1x5', '3x5', '2x5'].includes(pairKey(r.k))), ks(sx2).join(' '));
  // no balloon under the bridge is ever Tallyheart's, and none says sand
  [].concat(run, bm, sx, sx2).forEach(r => {
    assert.ok(r.prompt.every(l => l.kind === 'caption' || l.who !== 'tallyheart'), r.k + ': ' + JSON.stringify(r.prompt));
    assert.doesNotMatch(r.line || '', /sand|Tallyheart|ears/, r.k);
  });
  // Sprinkle borrows only the five easiest claws (1 × 5, 5 × 2, 5 × 3, 4 × 5, 5 × 5): a dinner miss and
  // then two six misses, or any other run of misses, never hand her 7 × 5, 5 × 8 or 9 × 5
  const hard = after2(); play(hard, 'ch03-claws'); play(hard, 'ch03-dinner', { '2x5': [12] });
  const sx3 = play(hard, 'ch03-six', { '6x5': [25, 35] });
  assert.ok(sx3.filter(r => r.q.filler).length >= 4, ks(sx3).join(' '));
  assert.ok(sx3.every(r => !r.q.filler || r.q.a * r.q.b <= 25), 'never past twenty-five: ' + ks(sx3).join(' '));
  for (let n = 1; n <= 3; n++) {
    const c3 = after2(); play(c3, 'ch03-claws');
    const d = play(c3, 'ch03-dinner', { '2x5': [12, 11, 9].slice(0, n) });
    const x = play(c3, 'ch03-six', { '6x5': [25, 35, 20].slice(0, n) });
    [].concat(d, x).forEach(r => assert.ok(!r.q.filler || r.q.a * r.q.b <= 25, n + ' misses: ' + ks(d).concat(ks(x)).join(' ')));
  }
  // three misses on the six: the last miss line, and the next screen still says why she asks
  const thrice = after2(); play(thrice, 'ch03-claws');
  const t3 = play(thrice, 'ch03-six', { '6x5': [25, 26, 27] });
  assert.equal(t3[t3.length - 1].line, 'There. Now we’ve counted them together.');
});

/* ------------------------------------------------------------------ book and teaser */

function recapFor(flags) {
  return story.book.recap.filter(r => !r.when || Object.keys(r.when).every(k => {
    const want = r.when[k];
    return Array.isArray(want) ? want.includes(flags[k]) : flags[k] === want;
  }));
}

test('book: title, chapter title, a 6–10 sentence recap on every path combination, and Sprinkle’s dragonet page', () => {
  const b = story.book;
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'Under the Old Bridge');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.equal(b.noDream, 'After all that, {name}paw’s dream stayed a secret too.');
  b.recap.forEach((r, i) => {
    assert.ok(typeof r.text === 'string' && r.text.trim(), 'recap ' + i);
    if (r.when) Object.keys(r.when).forEach(k => {
      assert.ok(FLAGS[k], 'recap ' + i + ': unknown flag ' + k);
      [].concat(r.when[k]).forEach(v => assert.ok(FLAGS[k].includes(v), 'recap ' + i + ': ' + k + '=' + v));
    });
    assert.match(r.text, /[.!?”’]$/, 'recap ' + i + ' is a whole sentence');
    assert.ok(words(r.text) <= 30, 'recap ' + i + ' is short: ' + words(r.text));
    assert.doesNotMatch(r.text.replace(/‘.*’/, ''), /\byou\b/i, 'recap is third person: ' + r.text);
  });
  FLAGS3.ch3Told.forEach(v => assert.equal(b.recap.filter(r => r.when && r.when.ch3Told === v).length, 1, 'one sentence for ch3Told=' + v));
  let paths = 0;
  for (const flags of everyPath(Object.keys(FLAGS1).concat(Object.keys(FLAGS2), Object.keys(FLAGS3)))) {
    const r = recapFor(flags);
    assert.ok(r.length >= 6 && r.length <= 10, JSON.stringify(flags) + ': ' + r.length + ' sentences');
    paths++;
  }
  assert.equal(paths, 240 * 8 * 2);
  // the case's numbers, the warrior, the claws, Sprinkle, the six, the ending
  const all = b.recap.map(r => r.text).join(' ');
  [/four more pieces gone, eight in two nights/, /become \{Murmur\}chime/, /‘One day, that’ll be you\.’/, /third Count, the claws/, /a Mistscale dragonet with a hurt wing/, /ten fish at a meal/, /somewhere along the river/, /fell asleep counting claws/].forEach(re => assert.match(all, re));
  // the engine builds the page, and the dragonet page once the chapter is finished
  const cat = E.blankCat({});
  cat.name = 'Fern'; cat.petname = 'Biscuit'; cat.look.sex = 'tom';
  cat.flags = { specialty: 'climbing', worry: 'water', ch2Path: 'bridge', ch3Told: false };
  const page = E.buildBook(story, cat);
  assert.equal(page.recap.length, recapFor(cat.flags).length);
  assert.ok(page.recap.some(s => /Fernpaw kept Sprinkle’s secret, carried his own supper to the bridge/.test(s)));
  assert.ok(page.recap.some(s => /He watched Murmurpaw answer the Warrior Counts/.test(s)));
  assert.equal(page.chapter, 'Chapter 3: Under the Old Bridge');
  const dn = b.dragonet;
  assert.deepEqual([dn.id, dn.name], ['sprinkle', 'Sprinkle']);
  assert.ok(dn.lines.length >= 2 && dn.lines.length <= 4 && dn.lines.every(l => words(l) <= 18 && /[.!?]$/.test(l)));
  assert.match(dn.lines.join(' '), /Mistscale dragonet, as big as a heron/);
  cat.finished = { ch01: 1, ch02: 2 };
  assert.equal(E.buildFullBook(cat, STORIES).dragonets, null, 'none found before the chapter ends');
  cat.finished.ch03 = 3;
  const full = E.buildFullBook(cat, STORIES);
  assert.deepEqual(full.dragonets.found.map(d => [d.id, d.name, d.chapter]), [['sprinkle', 'Sprinkle', 'ch03']]);
  assert.equal(full.dragonets.toFind, 6, 'six more, still to find');
  assert.match(full.dragonets.found[0].lines.join(' '), /Fernpaw found her under the Old Bridge/);
});

test('the teaser for chapter 4, and chapter 2’s for this one', () => {
  assert.equal(story.teaser.title, 'Chapter 4: The Glittering Scale');
  assert.deepEqual(story.teaser.lines, ['Tomorrow, Tallyheart has a new Count for you: both forepaws.', 'And somewhere high above the river, someone hiccups.']);
  story.teaser.lines.forEach(l => assert.ok(words(l) <= 25, l));
  // never the scale itself: chapter 4's find, and the shiny worry's moment
  assert.doesNotMatch(story.teaser.lines.join(' '), /glitter|scale|shiny/i);
  const cat = E.blankCat({}); cat.name = 'Moon';
  const t = E.teaser(story, cat, PC.story);
  assert.equal(t.title, 'Chapter 4: The Glittering Scale');
  assert.deepEqual([t.built, t.next], [false, null], 'chapter 4 is coming soon');
  const t2 = E.teaser(PC.story.ch02, cat, PC.story);
  assert.deepEqual([t2.title, t2.built, t2.next], ['Chapter 3: Under the Old Bridge', true, 'ch03']);
  // the hub's big button
  const c2 = E.blankCat({}); c2.finished = { ch01: 1, ch02: 2 };
  const p = E.progress(c2, STORIES);
  assert.deepEqual([p.next && p.next.id, E.chapterHeading(p.next)], ['ch03', 'Chapter 3: Under the Old Bridge']);
});

/* ------------------------------------------------------------------ the engine, end to end */

test('engine agrees: checkStory is clean and fill renders the same text', () => {
  assert.deepEqual(E.checkStory(story), []);
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind];
    const cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she';
    ids.forEach(id => texts(frames[id]).forEach(x => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where)));
  });
});

test('every path plays through the engine: flags, the lessons, the taps, the dream, the end, the book and the dragonet page', () => {
  for (const p of PATHS) for (const light of [0, 1]) {
    const name = JSON.stringify(p) + ' light ' + light;
    const cat = after2();
    cat.name = 'Moon'; cat.petname = 'Muffin';
    cat.flags = Object.assign({ specialty: 'friends', worry: 'shiny', ch2Stone: 'nose', ch2SaidAloud: true }, { ch2Path: p.ch2Path });
    const counted = cat.counts.length;
    E.startChapter(cat, story, 1);
    const walked = [];
    let now = 10;
    for (let guard = 0; guard < 300; guard++) {
      const id = E.frameId(cat, story), f = story.frames[id], kind = E.kindOf(f);
      walked.push(id);
      now += 10;
      if (kind === 'end') break;
      if (kind === 'next' || kind === 'skip') assert.ok(E.next(cat, story, now), id);
      else if (kind === 'choice') {
        const opts = E.options(f, cat);
        const want = opts.find(o => o.option.sets.ch3Told === p.ch3Told) || opts[light];
        assert.ok(E.choose(cat, story, want.index, now), id);
      } else if (kind === 'input') assert.ok(E.submitInput(cat, story, 'sprinkle burped a cloud', now), id);
      else if (kind === 'counts') {
        const { def, state } = E.chapterLesson(cat, story, f.counts.set, now, STORIES);
        cat.lesson = { mode: 'chapter', frame: id, chapter: story.id, state };
        while (!E.counts.done(state)) { const q = E.counts.question(state); E.logAnswer(cat, E.counts.answer(state, E.questionDef(def, q, story, STORIES), q.answer, 2000, now).entry); }
        const rec = E.recordLesson(cat, state);
        assert.ok(E.finishCounts(cat, story, rec.summary, now), id);
      } else assert.fail('unexpected ' + kind + ' at ' + id);
    }
    assert.equal(E.kindOf(story.frames[walked[walked.length - 1]]), 'end', name + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch03'), name + ': chapter 3 is finished');
    assert.equal(cat.flags.ch3Told, p.ch3Told, name);
    assert.deepEqual(Object.keys(cat.flags).filter(k => /^ch3/.test(k)), ['ch3Told'], name + ': the light choices set no flag');
    assert.deepEqual(walked, walk(Object.assign({}, cat.flags), light), name + ': the engine walks the same frames');
    assert.equal(walked.includes('f081'), p.ch2Path === 'river', name + ': the frame `when`');
    ['ch03-ears', 'ch03-pile', 'ch03-claws', 'ch03-dinner', 'ch03-six'].forEach(s => assert.ok(cat.lessons[s] && cat.lessons[s].noHelp, name + ': ' + s));
    assert.equal(cat.counts.length - counted, 16, name + ': 16 answers, the taps never logged');
    assert.equal(cat.dreams.ch03, 'sprinkle burped a cloud');
    assert.deepEqual(E.learnedCounts(cat, STORIES).map(c => c.table), [1, 2, 5]);
    assert.equal(E.status(cat, STORIES), 'Chapter 3 finished');
    const page = E.buildBook(story, cat);
    assert.equal(page.dream, 'Moonpaw’s dream: “Sprinkle burped a cloud.”');
    assert.ok(page.recap.length >= 6 && page.recap.length <= 10);
    assert.ok(page.recap.some(s => (p.ch3Told ? /Moonpaw told Tallyheart/ : /Moonpaw kept Sprinkle’s secret/).test(s)), name);
    assert.ok(E.buildFullBook(cat, STORIES).dragonets.found.some(d => d.id === 'sprinkle'));
    // the lines she saw: the friends line, the shiny worry, her stone by her nose, the ending's secret
    const sees = id => E.captions(story.frames[id], cat).concat(E.balloons(story.frames[id], cat).map(b => b.text)).join(' ');
    assert.ok(walked.some(id => /shyest new friend/.test(sees(id))), name + ': the friends line');
    assert.ok(walked.some(id => /Especially shiny ones\./.test(sees(id))), name + ': the shiny worry');
    assert.ok(walked.some(id => /Riffle’s stone is by your nose\./.test(sees(id))) && !walked.some(id => /under your chin/.test(sees(id))), name + ': the stone');
    assert.ok(walked.some(id => (p.ch3Told ? /A secret shared feels lighter\./ : /The secret is small, but it wriggles\./).test(sees(id))), name + ': the secret at bedtime');
    assert.ok(!walked.some(id => /The dug earth behind the pile/.test(sees(id))), 'only a noticing cat sees the dug earth');
    // the scenes resolve for her: the stone by her nose in every den, three marks on the tree after claws
    walked.filter(id => story.frames[id].scene.set === 'den').forEach(id => assert.equal(E.resolveScene(story.frames[id].scene, cat, STORIES).opts.stone, 'nose', id));
  }
});
