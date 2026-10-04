/* Story tests for chapter 2: node --test
 *
 * Checks app/story/ch02.js against the frame contract in docs/build.md (its last section,
 * "Chapter 2 (v0.3)") and against docs/chapters/02-after-the-storm.md: the frame graph, one
 * interaction per frame (skip included), the choices and flags, the Counts frames and sets, the
 * skip-count, the gift, every `when`, balloons, tokens, storyboards, word counts, the art
 * vocabulary (PC.art.vocab, otters and dogs too), the time of day, every frame rendered with
 * everyone in the picture, the beats in order on both paths, the book on every path combination,
 * and a whole play-through of each path through the engine.
 *
 *   PRINT_STORY=1 node --test tests/story-ch02.test.js   prints the whole chapter, rendered both ways.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./_load.js');
const PC = load();
const E = PC.engine;
const A = PC.art;
const story = PC.story.ch02;
const frames = story.frames;
const ids = Object.keys(frames);

/* ------------------------------------------------------------------ the contract */

// Chapter 1's flags (a `when` may test them) and chapter 2's own (docs/build.md, "Flags chapter 2 sets")
const FLAGS1 = {
  stepOut: ['chase', 'slow'],
  spokeUp: [true, false],
  joinReason: ['learn', 'count', 'brave'],
  specialty: ['noticing', 'sneaking', 'climbing', 'swimming', 'friends'],
  worry: ['small', 'water', 'talk', 'shiny']
};
// ch2Stone: where she put Riffle's stone in her nest (f108); the den draws it there (stone: 'auto'),
// and nothing else reads it (not the book)
const FLAGS2 = { ch2SaidAloud: [true, false], ch2Path: ['bridge', 'river'], ch2Stone: ['nose', 'chin'] };
const FLAGS = Object.assign({}, FLAGS1, FLAGS2);
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx', 'gift'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat'];
const DREAM_TOKENS = TOKENS.concat(['dream']);
const FACT_TOKENS = TOKENS.concat(['a', 'b', 'answer']);                                // praise, fast, miss…
const PROMPT_TOKENS = FACT_TOKENS.concat(['groups', 'per', 'thing', 'things']);         // prompts and `right` lines
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const WORDS_AIM = 35, WORDS_MAX = 50;
// time of day comes from fx (docs/build.md, chapter 2): morning in camp, day on the walk, sunset home, night in the den
const TOD = ['morning', 'day', 'sunset', 'night'];
const CATS = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat'];
const BEASTS = ['riffle', 'otter', 'dog'];
// the five rim cats, left to right: the skip-count's `who` (four Clan cats, then the grizzled old tom)
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

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', dream: 'I dreamed Riffle taught me to juggle.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', dream: 'The old tom counted by twos all night.' }
};
const FACT = { a: 8, b: 2, answer: 16, groups: 8, per: 2, thing: 'piece', things: 'pieces' };
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
    const start = text.replace(/^[“"‘'(]+/, '');
    if (!start.startsWith('…') && /^\p{Ll}/u.test(start)) bad.push('starts lowercase');
    if (/[.!?][”"’']?\s+[“"‘(]?(\p{Ll})/u.test(text)) bad.push('sentence starts lowercase');
  }
  return bad;
}

/* Every line in the chapter: frames (every variant), options, the Counts lines, the book, the teaser. */
function countsLines() {
  const out = [];
  Object.keys(story.counts).forEach(sid => {
    const d = story.counts[sid];
    ['praise', 'fast', 'fastAfterMiss', 'again', 'remembered'].forEach(k => [].concat(d[k] || []).forEach((l, i) => out.push({ set: sid, where: k + ' ' + i, text: l, ok: FACT_TOKENS })));
    ['miss', 'missLast', 'helpIntro', 'helpIntroFar', 'done', 'fillIntro'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: FACT_TOKENS }); });
    ['firstPrompt', 'prompt'].forEach(k => { if (d[k]) out.push({ set: sid, where: k, text: d[k], ok: PROMPT_TOKENS }); });
    (d.facts || []).forEach((f, i) => {
      if (Array.isArray(f)) return;
      [].concat(f.prompt || []).forEach((p, j) => out.push({ set: sid, where: 'fact ' + i + ' prompt ' + j, text: typeof p === 'string' ? p : p.text, who: p.who, ok: PROMPT_TOKENS }));
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
  fn('teaser', { where: 'title', text: story.teaser.title });
  story.teaser.lines.forEach((l, i) => fn('teaser', { where: 'line ' + i, text: l }));
}

/* Every combination of the flags a `when` in this chapter can test. */
function* everyPath(keys) {
  keys = keys || Object.keys(FLAGS);
  if (!keys.length) { yield {}; return; }
  const [k, ...rest] = keys;
  for (const v of FLAGS[k]) for (const r of everyPath(rest)) yield Object.assign({ [k]: v }, r);
}
/* The frames a reader with these flags walks through, in order (the choices take their flag values). */
function walk(flags) {
  const out = [];
  let id = story.start;
  for (let guard = 0; guard < 400 && id; guard++) {
    out.push(id);
    const f = frames[id];
    if (f.end) return out;
    if (f.choice) {
      const opts = f.choice.options;
      const pick = opts.find(o => Object.keys(o.sets).length && Object.keys(o.sets).every(k => flags[k] === o.sets[k])) || opts[0];
      id = pick.next;
    } else id = exits(f)[0];
  }
  throw new Error('no end');
}

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch02');
  assert.equal(story.number, 2);
  assert.equal(story.title, 'After the Storm');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.ok(ids.length >= 100, 'a full chapter of panels (' + ids.length + ')');
  assert.deepEqual(Object.keys(story).sort(), ['book', 'counts', 'frames', 'id', 'number', 'start', 'teaser', 'title']);
  const order = E.chapters(PC.story).map(s => s.id);
  assert.equal(order.indexOf('ch02'), order.indexOf('ch01') + 1, 'chapters go by number: chapter 2 follows chapter 1');
});

test('frame ids run f001, f002… in reading order; every edge goes forward; the numbers have no gaps', () => {
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
  });
  // the path split: the bridge is `a`, the river `b`, and both meet again at the same frame
  const bridge = ids.filter(id => /^f0(8[5-9]|9\d)a$|^f10\da$/.test(id)), river = ids.filter(id => /^f0(8[5-9]|9\d)b$|^f10\db$/.test(id));
  assert.ok(bridge.length >= 12 && river.length >= 10, 'two long branches: ' + bridge.length + ' and ' + river.length);
  const meet = n => exits(frames[n[n.length - 1]])[0];
  assert.equal(meet(bridge), meet(river), 'both paths meet again');
});

test('exactly one interaction per frame (skip included), and no unknown keys', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    assert.equal(E.kindOf(f), interactions(f)[0], id + ': the engine reads the same interaction');
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    assert.equal(f.look, undefined, id + ': chapter 2 has no look frame');
  });
});

test('every next / option / input / counts / skip target exists, and every frame is reachable', () => {
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
  const seenIds = new Set([story.start]);
  const stack = [story.start];
  while (stack.length) exits(frames[stack.pop()]).forEach(n => { if (!seenIds.has(n)) { seenIds.add(n); stack.push(n); } });
  assert.deepEqual(ids.filter(id => !seenIds.has(id)), [], 'unreachable frames');
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

test('choices: labels, chapter 2’s flags, two light choices with no flag, branches rejoin', () => {
  const offered = {};
  const choiceIds = ids.filter(id => frames[id].choice);
  let light = 0;
  choiceIds.forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length >= 2 && opts.length <= 5, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 16, id + ' option ' + i + ' label');
      Object.keys(o.sets).forEach(k => {
        assert.ok(FLAGS2[k], id + ': a chapter 2 choice sets only chapter 2’s flags, not ' + k);
        assert.ok(FLAGS2[k].includes(o.sets[k]), id + ': bad value ' + k + '=' + o.sets[k]);
        (offered[k] = offered[k] || new Set()).add(o.sets[k]);
      });
    });
    const flagged = opts.filter(o => Object.keys(o.sets).length).length;
    assert.ok(flagged === 0 || flagged === opts.length, id + ': every option sets its flag, or none does');
    // a light choice sets no flag, or only where the stone goes (which only the art reads)
    if (!flagged || opts.every(o => Object.keys(o.sets).join() === 'ch2Stone')) {
      light++;
      // a light choice leads every option to the same next screen, or (her pick shows) through one
      // frame of its own to it
      const same = opts.every(o => o.next === opts[0].next);
      const after = same ? [opts[0].next] : opts.map(o => exits(frames[o.next])[0]);
      assert.equal(new Set(after).size, 1, id + ': a light choice rejoins at once');
    }
    // every option leads to one shared frame: within four steps, or (the path) at "Home"
    const reach = (o, depth) => { const s = new Set(); let cur = [o.next]; for (let d = 0; d < depth; d++) { cur.forEach(x => s.add(x)); cur = cur.flatMap(x => exits(frames[x])); } return s; };
    const isPath = opts.some(o => o.sets.ch2Path);
    const sets = opts.map(o => reach(o, isPath ? 25 : 4));
    assert.ok([...sets[0]].some(x => sets.every(s => s.has(x))), id + ': branches do not rejoin');
  });
  assert.equal(light, 3, 'three light choices (the dogs, the airplane, the stone; the stone’s sets only ch2Stone)');
  Object.keys(FLAGS2).forEach(k => assert.deepEqual([...(offered[k] || [])].sort(), FLAGS2[k].slice().sort(), 'flag ' + k));
  // the order: say it or whisper it, then the dogs, the airplane, the path, the stone
  const order = choiceIds.map(id => frames[id].choice.options[0].sets.ch2SaidAloud !== undefined ? 'aloud' : frames[id].choice.options[0].sets.ch2Path ? 'path' : frames[id].choice.options[0].sets.ch2Stone ? 'stone' : 'light');
  assert.deepEqual(order, ['aloud', 'light', 'light', 'path', 'stone']);
});

test('inputs, counts, skip and gift frames, in the text’s order', () => {
  const inputs = ids.filter(id => frames[id].input);
  assert.deepEqual(inputs.map(id => frames[id].input.kind), ['dream'], 'one input: her dream');
  assert.equal(frames[inputs[0]].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
  const counts = ids.filter(id => frames[id].counts);
  assert.deepEqual(counts.map(id => frames[id].counts.set), ['ch02-tails', 'ch02-ears', 'ch02-pile', 'ch02-check']);
  counts.forEach(id => {
    assert.deepEqual(Object.keys(frames[id].counts).sort(), ['next', 'set'], id);
    assert.ok(story.counts[frames[id].counts.set], id + ': the counts set exists');
  });
  const skips = ids.filter(id => frames[id].skip);
  assert.equal(skips.length, 1, 'one skip-count');
  const sk = frames[skips[0]].skip;
  assert.deepEqual(Object.keys(sk).sort(), ['groups', 'next', 'table', 'who']);
  assert.equal(sk.table, 2);
  assert.equal(sk.groups, 5);
  assert.equal(sk.who.length, 5);
  assert.deepEqual(sk.who[4], { who: 'grizzled' }, 'the fifth cat is the grizzled old tom');
  sk.who.slice(0, 4).forEach(w => assert.ok(w.who === 'clancat' && w.variant >= 1 && w.variant <= 6, JSON.stringify(w)));
  assert.equal(E.skipView(sk, 5).total, 10);
  assert.equal(E.skipView(sk, 5).count, '2… 4… 6… 8… 10!');
  assert.ok(at(counts[0]) < at(skips[0]) && at(skips[0]) < at(counts[1]), 'the warm-up, then the skip-count, then the ears');
  // the skip-count's cats are the cats on the rim in the scene before it, in their places
  const rimFrame = frames[skips[0]].scene.cast.filter(c => RIM_ANCHORS.includes(c.at));
  assert.deepEqual(rimFrame.map(c => c.at), RIM_ANCHORS, 'five cats on the rim, left to right');
  rimFrame.forEach((c, i) => {
    assert.equal(c.who, sk.who[i].who, 'rim ' + (i + 1));
    assert.equal(c.variant, sk.who[i].variant, 'rim ' + (i + 1) + ' variant');
  });
  // the next frame says TEN, with the old tom's flattened ears
  assert.match(T(sk.next), /TEN!/);
  assert.ok(castOf(sk.next, 'grizzled').length, 'the old tom is in the TEN frame');
  assert.ok(castOf(sk.next, 'grizzled').every(c => c.flatEars === true), 'his ears are flat (“flattens his ears at you”)');
  // gifts: Riffle's stone, once, after he is named and before the path
  const gifts = ids.filter(id => frames[id].gift);
  assert.deepEqual(gifts.map(id => frames[id].gift), ['riffle-stone']);
  assert.ok(E.gift('riffle-stone'), 'the engine knows the gift');
  assert.match(T(gifts[0]), /white stripe all the way around/);
  const named = ids.find(id => /I’m Riffle/.test(T(id)));
  const path = ids.find(id => frames[id].choice && frames[id].choice.options.some(o => o.sets.ch2Path));
  assert.ok(at(named) < at(gifts[0]) && at(gifts[0]) < at(path));
  // the order: the four Counts moments, then the dream
  assert.ok(at(counts[3]) < at(inputs[0]));
});

/* ------------------------------------------------------------------ text */

test('every balloon speaker is in that frame’s cast; balloons and captions are well formed', () => {
  ids.forEach(id => {
    const f = frames[id];
    const by = {};
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name', 'when'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(typeof b.name === 'string' && b.name.trim() && !tokensIn(b.name).length, id + ' say ' + i + ' name');
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      const n = f.scene.cast.filter(c => c.who === b.who).length;
      assert.ok(n >= 1, id + ': speaker ' + b.who + ' is not in the cast');
      by[b.who] = (by[b.who] || 0) + 1;
    });
    // where a speaker is in the cast more than once (two otters, three dogs), the nth balloon is the
    // nth of them, so each balloon needs a cast member of its own
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
    if (!f.end) for (const flags of [{}, { ch2Path: 'bridge' }, { ch2Path: 'river' }]) assert.ok(seen(f, flags).length > 0, id + ' shows no text');
  });
});

test('nobody is named on a balloon before the story names them (Riffle), and the otters and dogs by their variant', () => {
  const intro = ids.findIndex(id => /I’m Riffle/.test(T(id)));
  assert.ok(intro > 0, 'Riffle is introduced');
  const before = ids.slice(0, intro).filter(id => (frames[id].say || []).some(b => b.who === 'riffle'));
  assert.ok(before.length >= 1, 'he speaks before he says his name');
  before.forEach(id => (frames[id].say || []).forEach(b => {
    if (b.who === 'riffle') assert.ok(b.name && !/Riffle/.test(b.name), id + ': Riffle speaks before the introduction, so the balloon needs a name');
  }));
  ids.slice(intro).forEach(id => (frames[id].say || []).forEach(b => {
    if (b.who === 'riffle') assert.equal(b.name, undefined, id + ': Riffle is named now');
  }));
  // otters and dogs are told apart by variant, and speak from the right one: the old ferry otter, the shaggy dog
  ids.forEach(id => {
    const f = frames[id];
    ['otter', 'dog'].forEach(who => {
      const cast = f.scene.cast.filter(c => c.who === who);
      cast.forEach(c => assert.ok([1, 2, 3].includes(c.variant), id + ': ' + who + ' needs a variant'));
      (f.say || []).filter(b => b.who === who).forEach((b, nth) => {
        if (who === 'otter') assert.equal(cast[nth].variant, 1, id + ': the speaking otter is the old ferry otter');
        if (who === 'dog' && nth === 0) assert.equal(cast[0].variant, 1, id + ': the first dog to speak is the shaggy one');
      });
    });
  });
  // the shaggy dog speaks only after the caption has named the three dogs
  const dogsNamed = ids.find(id => /a huge shaggy one, a spotty one, and a tiny one/.test(T(id)));
  ids.filter(id => (frames[id].say || []).some(b => b.who === 'dog')).forEach(id => assert.ok(at(id) > at(dogsNamed), id));
});

test('text tokens are only the allowed ones', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = x.ok || (id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS);
    tokensIn(x.text).forEach(t => { if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}'); });
  });
  assert.deepEqual(bad, []);
  assert.equal(tokensIn(story.book.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
});

test('word counts: about 18 words a frame, never more than 50 (every variant at once, and as each path reads it)', (t) => {
  const over = [];
  ids.forEach(id => {
    const all = texts(frames[id]).reduce((n, x) => n + words(x.text), 0);
    assert.ok(all <= WORDS_MAX, id + ' has ' + all + ' words, every variant counted');
    if (all > WORDS_AIM) over.push(id + ' (' + all + ')');
  });
  if (over.length) t.diagnostic('over ' + WORDS_AIM + ' words with every variant: ' + over.join(', '));
  // per path: a reader walks 105–120 frames at chapter 1's rate (about 18 words a frame)
  const stats = [];
  for (const flags of [{ ch2Path: 'bridge', ch2SaidAloud: true, specialty: 'friends', worry: 'water' },
    { ch2Path: 'river', ch2SaidAloud: false, specialty: 'noticing', worry: 'water' }]) {
    const path = walk(flags);
    const w = path.reduce((n, id) => n + seen(frames[id], flags).reduce((m, s) => m + words(s), 0), 0);
    path.forEach(id => assert.ok(seen(frames[id], flags).reduce((m, s) => m + words(s), 0) <= WORDS_MAX, id));
    stats.push(flags.ch2Path + ': ' + path.length + ' frames, ' + w + ' words (' + (w / path.length).toFixed(1) + ' a frame)');
    assert.ok(path.length >= 100 && path.length <= 125, flags.ch2Path + ': ' + path.length + ' frames');
    assert.ok(w / path.length >= 12 && w / path.length <= 22, flags.ch2Path + ': ' + (w / path.length).toFixed(1) + ' words a frame');
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
    const body = b.replace(shot, '');
    const sentences = body.split(/(?<=[.!?][”"]?)\s+(?=[A-Z“"(])/).filter(s => s.trim());
    assert.ok(sentences.length >= 2 && sentences.length <= 4, id + ': board has ' + sentences.length + ' sentences');
    assert.ok(words(body) >= 25, id + ': board too thin');
  });
});

test('rendered for a she-cat and a tom, every sentence reads right', (t) => {
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

test('our own world: no names or coined words from Warriors or Wings of Fire, and no dragon yet', () => {
  const banned = /\b(twolegs?|kittypets?|starclan|fresh-kill|thunderpath|thundersnakes?|ironsnakes?|thunderclan|riverclan|windclan|shadowclan|skyclan|dark forest|leaf-fall|leaf-bare|newleaf|greenleaf|moonhigh|sunhigh|skywings?|seawings?|nightwings?|mudwings?|sandwings?|icewings?|rainwings?|dragonets?|dragons?|pyrrhia|moonwatcher|firestar|rusty)\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, banned, id + ' board'));
  // the pile is mice and voles: no fish in the words (CrystalClan doesn't fish)
  everyText((id, x) => assert.doesNotMatch(x.text, /\bfish\b/i, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, /\bfish\b/i, id + ' board'));
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the art vocabulary (PC.art.vocab), otters and dogs included', () => {
  const v = A.vocab;
  assert.ok(v && v.sets && v.otherPoses && v.variants, 'the art exposes its vocabulary');
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
      else if (k === 'glow' && Array.isArray(val)) val.forEach(g => assert.equal(typeof g, 'boolean', id + ': glow list'));
      else assert.ok(allowed.includes(val), id + ': ' + k + '=' + JSON.stringify(val));
    });
    if (s.set === 'pile') ['pairs', 'lit'].forEach(k => { if (s.opts[k] !== undefined) assert.ok(s.opts[k] <= 10, id + ': ' + k + ' is 0–10'); });
    assert.ok(Array.isArray(s.cast), id + ': cast');
    const used = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'size', 'variant', 'flatEars', 'holds', 'purr', 'lift'].includes(k)), [], where + ': keys');
      assert.ok(v.cast.includes(c.who), where + ': unknown who');
      const isCat = CATS.includes(c.who);
      if (c.flatEars !== undefined) assert.ok(c.flatEars === true && isCat, where + ': flatEars is for a cat, and true');
      // the cast extras: Riffle's stone in her paws, her own purr, Waffles lifted onto her pouf
      if (c.holds !== undefined) assert.ok(c.holds === 'stone' && c.who === 'player', where + ': only she holds anything, and it is the stone');
      if (c.purr !== undefined) assert.ok(c.purr === true && isCat && s.fx.includes('purr'), where + ': purr: true marks a cat purring in a purr panel');
      if (c.lift !== undefined) assert.ok(c.lift === true && s.set === 'tower' && s.cam === 'balcony', where + ': lift: true is for the balcony camera');
      const poses = isCat ? v.poses : v.otherPoses[c.who];
      assert.ok(poses && poses.includes(c.pose), where + ': pose ' + c.pose);
      if (isCat || BEASTS.includes(c.who)) assert.ok(v.moods.includes(c.mood), where + ': mood ' + c.mood);
      else assert.equal(c.mood, undefined, where + ': no mood');
      // a named anchor, or a spot of the frame's own ({ x, y } in the 1600 × 1000 world; f097a)
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
      if (c.who === 'otter' || c.who === 'dog') assert.ok(c.variant !== undefined, where + ': which one?');
      used.push(typeof c.at === 'object' ? c.at.x + ',' + c.at.y : c.at);
    });
    assert.equal(new Set(used).size, used.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(v.fx.includes(e), id + ': unknown fx ' + e));
  });
});

test('composition rules from the art builders', () => {
  ids.forEach(id => {
    const s = frames[id].scene, cast = s.cast;
    // the Crossing's water anchor wants otters swimming or floating
    if (s.set === 'crossing') cast.filter(c => c.at === 'water' && BEASTS.includes(c.who)).forEach(c => assert.ok(['swim', 'float'].includes(c.pose), id + ': ' + c.who + ' in the water swims or floats'));
    if (s.set === 'riverbank') cast.filter(c => c.at === 'water').forEach(c => assert.ok(['swim', 'float'].includes(c.pose), id + ': ' + c.who + ' in the water swims or floats'));
    // in the field's fence camera the shaggy dog is listed first, at dog-1 (his nose through the wire)
    if (s.set === 'field' && s.cam === 'fence') {
      const dogs = cast.filter(c => c.who === 'dog');
      if (dogs.length) assert.ok(cast.indexOf(dogs[0]) === cast.findIndex(c => c.who === 'dog') && dogs[0].at === 'dog-1' && dogs[0].variant === 1, id);
    }
    // the dogs stay behind their fence; the cats stay on the path
    if (s.set === 'field') cast.forEach(c => assert.ok(c.who === 'dog' ? /^dog-|^field$/.test(c.at) : /^path-/.test(c.at), id + ': ' + c.who + '@' + c.at));
    // the tower roof is best with no cast; the low pile shot has only its three spots
    if (s.set === 'riverbank' && s.cam === 'roof') assert.deepEqual(cast, [], id);
    if (s.set === 'pile' && s.cam === 'low') cast.forEach(c => assert.ok(['pile-left', 'pile-right', 'beside'].includes(c.at), id + ': ' + c.at));
    // the rim frames: Tallyheart in the sun patch and our cat beside her, clear of the rim
    if (s.set === 'hollow' && s.cam === 'wide' && cast.some(c => /^rim-/.test(c.at))) {
      cast.filter(c => c.who === 'player' || c.who === 'tallyheart').forEach(c => assert.ok(['sunpatch', 'sunpatch-2', 'tree', 'tree-far'].includes(c.at), id + ': ' + c.who + '@' + c.at));
    }
    // the den at night has no moon (the case: no moon that night, and chapter 2's nights too)
    if (s.set === 'den') assert.notEqual(s.opts.moon, true, id + ': no moon');
    if (s.fx.includes('night')) assert.ok(!s.fx.includes('rain') && !s.fx.includes('lightning'), id + ': a calm night');
  });
});

test('staging the review asked for: the drag marks are the bridge path’s find, the rim shows five, the dark holds only her', () => {
  const bridgeCams = id => frames[id].scene.set === 'bridge' ? frames[id].scene.cam : null;
  const drag = id => frames[id].scene.opts.drag !== false;   // the bridge set's default is on
  // from the bank and at the mouth of the dark, no drag marks: they lie in the dark under the deck
  ids.filter(id => ['bank', 'mouth'].includes(bridgeCams(id))).forEach(id => assert.equal(frames[id].scene.opts.drag, false, id + ': no drag marks outside the dark'));
  // so the river path never sees them, and the bridge path first sees them inside, where the text finds them
  const river = walk({ ch2Path: 'river' }), bridge = walk({ ch2Path: 'bridge' });
  river.forEach(id => assert.ok(!(bridgeCams(id) && drag(id)), id + ': the river path sees no drag marks'));
  const firstMarks = bridge.find(id => bridgeCams(id) && drag(id));
  const found = bridge.find(id => /Deep drag marks/.test(T(id)));
  assert.ok(firstMarks && ['under', 'back'].includes(bridgeCams(firstMarks)), 'the marks first show inside the dark: ' + firstMarks);
  assert.ok(bridge.indexOf(firstMarks) >= bridge.indexOf(found) - 1, 'no sooner than the panel before “Deep drag marks…” (' + firstMarks + ', ' + found + ')');
  assert.ok(frames[found].scene.cast.some(c => c.who === 'player'), found + ': she is in the picture as she finds them');
  // inside the dark (`back`) there is only her, from behind, looking up at the nook; Tallyheart looks
  // back at the dark from the sunshine outside
  ids.filter(id => bridgeCams(id) === 'back').forEach(id => {
    assert.deepEqual(frames[id].scene.cast.map(c => c.who), ['player'], id + ': only our cat in the back of the dark');
    frames[id].scene.cast.forEach(c => assert.equal(c.pose, 'lookup', id + ': she looks up at the nook, not out at the reader'));
  });
  const home = ids.find(id => /it isn’t for apprentices\. Home\./.test(T(id)));
  assert.equal(bridgeCams(home), 'mouth', home + ': outside, at the mouth');
  assert.ok(castOf(home, 'tallyheart').every(c => c.at === 'sun' && c.facing === 'left' && c.mood !== 'stern'), home + ': in the sun, turned to the dark, worried not cross');
  // the rim: the panel that says “five soggy cats” shows exactly the five, and so does Tallyheart's sum
  const five = ids.find(id => /five soggy cats/.test(T(id)));
  assert.deepEqual(frames[five].scene.cast.map(c => c.at), RIM_ANCHORS, five + ': the five rim cats and nobody else');
  const sum = ids.find(id => /Five cats, two ears each/.test(T(id)));
  assert.deepEqual(frames[sum].scene.cast.filter(c => /^rim-/.test(c.at)).map(c => c.at), RIM_ANCHORS, sum + ': all five rim cats');
  assert.deepEqual(frames[sum].scene.cast.filter(c => !/^rim-/.test(c.at)).map(c => c.who), ['tallyheart'], sum + ': and the teacher, apart');
  // the whoosh (`motion`) is drawn behind the first in the cast: that one is the one moving
  ids.filter(id => frames[id].scene.fx.includes('motion')).forEach(id => {
    assert.ok(!['sit', 'lie', 'flat', 'loaf', 'curl', 'sun', 'float', 'lookup'].includes(frames[id].scene.cast[0].pose), id + ': the whoosh is on a cat that sits still');
  });
  // the stone is handed over at Riffle's pebble heap, on the rocks where they were talking
  const gift = ids.find(id => frames[id].gift === 'riffle-stone');
  assert.equal(frames[gift].scene.cam, 'rocks');
  assert.deepEqual(frames[gift].scene.cast.map(c => c.who + '@' + c.at), ['player@rock-left', 'riffle@pebbles']);
});

test('staging, the final review: Waffles above the rail, the stone in her paws and then her nest, her own purr, five on the rim, together at the bridge mouth, a real vole', () => {
  const look = { sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' };
  // f010: flopped on her back, Waffles is lifted onto her pouf, so her whole face is above the rail
  const flop = ids.find(id => /Waffles flops onto her back/.test(T(id)));
  const w = castOf(flop, 'waffles')[0];
  assert.equal(w.lift, true, flop + ': lifted');
  const fh = A.render(frames[flop].scene, { look }).heads[0];
  assert.ok(fh && (fh.y + fh.r * 1.6) * 10 < 720, flop + ': her face clears the rail (y 720): ' + JSON.stringify(fh));
  // the stone: set in her paws (Riffle leaning in low, no waving paw), held while the text has it in her paws
  const gift = ids.find(id => frames[id].gift === 'riffle-stone');
  assert.equal(castOf(gift, 'player')[0].holds, 'stone', gift);
  assert.equal(castOf(gift, 'riffle')[0].pose, 'scramble', gift + ': Riffle leans in');
  assert.ok(frames[gift].scene.fx.includes('sparkle'), gift + ': the sparkle is on the stone');
  const held = ids.filter(id => castOf(id, 'player').some(c => c.holds === 'stone'));
  const after = ids.slice(at(gift), at(gift) + 5);
  after.forEach(id => assert.ok(held.includes(id), id + ': in her paws (f075–f079)'));
  const bye = ids.find(id => /Keep the stone!/.test(T(id)));
  assert.ok(held.includes(bye), bye + ': the stone held close as Riffle says keep it');
  held.forEach(id => assert.ok(at(id) >= at(gift), id + ': she holds it only once she has it'));
  // f077: the purr is hers alone, eyes shut with happiness
  const purr = ids.find(id => /you purr\./.test(T(id)));
  const me = castOf(purr, 'player')[0];
  assert.ok(me.purr === true && me.mood === 'happy', purr + ': she purrs, eyes shut');
  frames[purr].scene.cast.filter(c => c.who !== 'player').forEach(c => assert.notEqual(c.purr, true, purr + ': only she purrs'));
  // the nest: between her paws as she decides (f108), then where she put it, every night frame on
  const nest = ids.find(id => /Where should it go\?/.test(T(id)));
  assert.equal(frames[nest].scene.opts.stone, true, nest);
  ids.slice(at(nest) + 1).filter(id => frames[id].scene.set === 'den').forEach(id => assert.equal(frames[id].scene.opts.stone, 'auto', id));
  // f021 and f019: only the five rim cats in the row; Tallyheart apart, past the old tree
  const sum = ids.find(id => /Five cats, two ears each/.test(T(id)));
  const skip = ids.find(id => frames[id].skip);
  [sum, skip].forEach(id => assert.deepEqual(castOf(id, 'tallyheart').map(c => c.at), ['tree-far'], id + ': Tallyheart apart, past the trunk'));
  const r = A.render(frames[sum].scene, { look }), rimHeads = r.heads.slice(0, 5), th = r.heads[5];
  assert.ok(th.x - Math.max(...rimHeads.map(h => h.x)) > 15, sum + ': clearly apart from the row');
  // f097a: she is beside Tallyheart in the sunshine at the mouth, not small in the shade
  const breath = ids.find(id => /lets out a long, long breath/.test(T(id)));
  const pb = A.render(frames[breath].scene, { look }).heads;
  const tIdx = frames[breath].scene.cast.findIndex(c => c.who === 'tallyheart'), pIdx = frames[breath].scene.cast.findIndex(c => c.who === 'player');
  assert.ok(Math.abs(pb[tIdx].x - pb[pIdx].x) < 16, breath + ': side by side: ' + JSON.stringify([pb[tIdx], pb[pIdx]]));
  const mouth = A.sceneInfo('bridge').anchors.mouth, spotX = (at) => (typeof at === 'string' ? mouth[at].x : at.x);
  assert.ok(spotX(castOf(breath, 'player')[0].at) > mouth.edge.x + 200, breath + ': out of the shadow');
  // f044: a real vole, nudged off the pile
  const vole = ids.find(id => /nudges a plump vole your way/.test(T(id)));
  assert.equal(frames[vole].scene.opts.vole, true, vole);
});

/* The review after the final one: what the pictures show matches the words. */
test('staging, the last review: the bonk drawn, no twin on the rim, out of the shadow at the bridge, awake until the words say she sleeps, the Count named once', () => {
  const norm = (s) => s.replace(/\bpcs?[0-9a-z]+-/g, '').replace(/(id="|url\(#|href="#)[^")]+/g, '$1X');
  // f063: the picture shows what hit her (the pebble off her head, stars round the bump)
  const bonk = ids.find(id => /BONK/.test(frames[id].sfx || ''));
  assert.ok(frames[bonk].scene.fx.includes('bonk') && frames[bonk].scene.cast[0].who === 'player', bonk);
  // the rim: a cat in the first default look (a brown tabby) never sits beside a brown tabby Clan cat;
  // the rim's first cat wears a spare coat, in the panels and the counting pictures alike
  const look = E.defaultLook(0);
  const rimFrames = ids.filter(id => frames[id].scene.set === 'hollow' && castOf(id, 'clancat').length);
  assert.ok(rimFrames.length >= 5, rimFrames.join(' '));
  rimFrames.forEach(id => {
    const sc = frames[id].scene, spare = Object.assign({}, sc, { cast: sc.cast.map(c => (c.who === 'clancat' && c.variant === 1 ? Object.assign({}, c, { variant: 4 }) : c)) });
    assert.equal(norm(A.render(sc, { look }).svg), norm(A.render(spare, { look }).svg), id + ': the brown tabby rim cat wears the spare coat');
  });
  const skip = ids.find(id => frames[id].skip), who = frames[skip].skip.who;
  const swapped = who.map(w => (w.who === 'clancat' && w.variant === 1 ? Object.assign({}, w, { variant: 4 }) : w));
  assert.equal(norm(A.countsPicture({ table: 2, groups: 5, who, look })), norm(A.countsPicture({ table: 2, groups: 5, who: swapped, look })), skip + ': the skip-count too');
  // the bridge path: once out of the shadow (f097a), she stays out of it while Riffle pops up and
  // Tallyheart sends them home (f100a, f101a): no cat of hers under the deck in front of the dark
  const mouthFrames = ids.filter(id => frames[id].scene.set === 'bridge' && frames[id].scene.cam === 'mouth' && /a$/.test(id) && at(id) >= at('f097a'));
  assert.ok(mouthFrames.length >= 3, mouthFrames.join(' '));
  mouthFrames.forEach(id => assert.equal(castOf(id, 'player')[0].at, 'sun-edge', id + ': in the sun, beside Tallyheart'));
  // f112: she drifts off but isn't asleep yet; f113's words put her to sleep
  const sleep = ids.find(id => /you fall asleep/.test(T(id)));
  const before = ids[at(sleep) - 1], me = castOf(before, 'player')[0];
  assert.notEqual(me.mood, 'sleepy', before + ': her eyes are still open');
  // the Count is named once, by Tallyheart at the claw marks (f025), not in the caption before the lesson
  const ears = ids.find(id => frames[id].counts && frames[id].counts.set === 'ch02-ears');
  assert.ok(!/second Count|ears/i.test((frames[ears].caption || []).map(capText).join(' ')), ears + ': ' + frames[ears].caption);
  assert.ok(ids.some(id => at(id) > at(ears) && /Ears\. That’s your second Count\./.test(T(id))));
});

test('the time of day runs morning, day, sunset, night', () => {
  const tods = ids.map(id => {
    const t = frames[id].scene.fx.filter(e => TOD.includes(e));
    assert.equal(t.length, 1, id + ': exactly one time of day in fx (' + frames[id].scene.fx.join(',') + ')');
    return TOD.indexOf(t[0]);
  });
  for (let i = 1; i < ids.length; i++) assert.ok(tods[i] >= tods[i - 1], ids[i] + ' goes back in time');
  assert.equal(frames[ids[0]].scene.fx.includes('morning'), true, 'it starts in the morning');
  assert.equal(frames[ids[ids.length - 1]].scene.fx.includes('night'), true, 'it ends at night');
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(id => frames[id].scene.set + '/' + frames[id].scene.cam));
  assert.ok(pairs.size >= 30, 'only ' + pairs.size + ' set/camera pairs');
  const sets = new Set(ids.map(id => frames[id].scene.set));
  ['pile', 'bridge', 'field', 'crossing', 'riverbank', 'den', 'garden', 'tower', 'hollow', 'camp', 'title'].forEach(s => assert.ok(sets.has(s), 'uses ' + s));
  // along any path a reader can take, never five panels in a row from the same camera
  const run = {};
  ids.forEach(id => { run[id] = run[id] || 1; });
  ids.forEach(id => exits(frames[id]).forEach(n => {
    const a = frames[id].scene, b = frames[n].scene;
    if (a.set === b.set && a.cam === b.cam) run[n] = Math.max(run[n], run[id] + 1);
  }));
  ids.forEach(id => assert.ok(run[id] < 5, id + ': ' + run[id] + ' panels in a row from the same camera'));
});

test('every frame renders, and everyone in the cast is in the picture', () => {
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'black', marking: 'white-paws', eyes: 'odd' }];
  const off = [];
  ids.forEach(id => looks.forEach((look, k) => {
    const f = frames[id], cast = f.scene.cast;
    const r = A.render(f.scene, { look: look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.indexOf('<svg') >= 0, id + ': no svg');
    assert.ok(Array.isArray(r.heads) && r.heads.length === cast.length, id + ': heads');
    (f.say || []).forEach(b => {
      assert.ok(cast.some((c, i) => c.who === b.who && r.heads[i]), id + ': speaker ' + b.who + ' has no head on the panel');
    });
    if (k === 0) cast.forEach((c, i) => {
      const h = r.heads[i];
      if (!h) off.push(id + ' ' + c.who + '@' + c.at + ' (' + f.scene.set + '/' + f.scene.cam + ')');
      else if (BEASTS.includes(c.who) || CATS.includes(c.who)) assert.ok(h.r >= 0.5, id + ': ' + c.who + ' face radius');
    });
  }));
  assert.deepEqual(off, [], 'cast members out of the camera’s sight');
  // the skip-count's picture draws the rim cats themselves
  const sk = frames[ids.find(id => frames[id].skip)].skip;
  const v = E.skipView(sk, 3);
  const pic = A.countsPicture({ table: v.table, groups: v.groups, per: v.per, highlight: v.highlight, totals: true, next: true, who: sk.who });
  assert.ok(typeof pic === 'string' && pic.indexOf('<svg') >= 0, 'the skip-count picture');
});

/* ------------------------------------------------------------------ the beats the chapter must have */

test('the chapter’s beats are all there, in order, on both paths', () => {
  const beats = [];
  const has = (id, re) => re.test(T(id));
  const beat = (label, pred, list) => {
    const id = (list || ids).find(pred);
    assert.ok(id, 'missing beat: ' + label);
    beats.push([label, id]);
    return id;
  };
  beat('a raindrop on the nose', id => frames[id].scene.set === 'den' && frames[id].scene.fx.includes('morning') && /PLIP/.test(frames[id].sfx || ''));
  beat('the tummy rumbles', id => /GRRR/.test(frames[id].sfx || '') && has(id, /breakfast comes in a bowl/));
  beat('seven puddles', id => castOf(id, 'tallyheart').some(c => c.at === 'doorway') && has(id, /Seven puddles/));
  beat('the dish and the towel', id => frames[id].scene.set === 'garden' && frames[id].scene.opts.towel && has(id, /folded towel/));
  beat('Waffles: alive', id => castOf(id, 'waffles').length && has(id, /DARLING! You’re ALIVE!/));
  beat('no moon (the clue)', id => castOf(id, 'waffles').length && has(id, /not a sliver of moon/));
  beat('Counts!', id => castOf(id, 'tallyheart').length && has(id, /There you are\. Counts!/));
  beat('the warm-up', id => frames[id].counts && frames[id].counts.set === 'ch02-tails');
  beat('ears', id => has(id, /Now: ears\. Every cat has two\./));
  beat('five soggy cats on the rim', id => has(id, /five soggy cats/) && frames[id].scene.cast.filter(c => /^rim-/.test(c.at)).length === 5);
  beat('the skip-count', id => frames[id].skip);
  beat('TEN', id => has(id, /TEN!/) && has(id, /Flat ears still count/));
  beat('the ears lesson', id => frames[id].counts && frames[id].counts.set === 'ch02-ears');
  beat('the second claw mark', id => frames[id].scene.set === 'hollow' && frames[id].scene.opts.marks === 2 && /SKRITCH/.test(frames[id].sfx || ''));
  beat('a little deeper; tomorrow, claws', id => has(id, /first mark is a little deeper/) && has(id, /Tomorrow: claws\./));
  beat('the prey pile', id => frames[id].scene.set === 'pile' && has(id, /mice and voles/));
  beat('freshly dug earth (noticing)', id => (frames[id].caption || []).some(c => c.when && c.when.specialty === 'noticing' && /freshly dug/.test(c.text)));
  beat('the old tom’s boast, then the pile', id => frames[id].counts && frames[id].counts.set === 'ch02-pile' && castOf(id, 'grizzled').length && has(id, /Ten pairs/));
  beat('sixteen is not twenty', id => frames[id].choice && has(id, /Sixteen is not twenty/) && frames[id].choice.options.some(o => o.sets.ch2SaidAloud !== undefined));
  beat('Nonsense', id => has(id, /Nonsense/) && castOf(id, 'grizzled').length);
  beat('the warrior’s check', id => frames[id].counts && frames[id].counts.set === 'ch02-check' && has(id, /the other way around/));
  beat('the old tom counts by ones', id => has(id, /one piece at a time/) && castOf(id, 'snorer').some(c => c.pose === 'stand' && c.mood === 'sleepy'));
  beat('four gone', id => has(id, /Four pieces of prey\. Gone\./));
  beat('Remember? Know your Counts', id => has(id, /Know your Counts, and you can always tell when something’s missing/));
  beat('except the newest', id => castOf(id, 'glintstar').length && has(id, /except the newest/));
  beat('the wind does not tidy up', id => has(id, /does not tidy up after itself/));
  beat('we don’t blame', id => has(id, /We don’t blame what we haven’t seen/));
  beat('walk the borders', id => has(id, /Walk the borders today/));
  beat('counting cats eat first', id => has(id, /Counting cats eat first/));
  beat('the wall', id => frames[id].scene.set === 'title' && has(id, /all CrystalClan’s/));
  beat('the reeds bent and broken', id => frames[id].scene.set === 'bridge' && has(id, /bent and broken/));
  beat('the train', id => frames[id].scene.opts.train && /CLANKETY/.test(frames[id].sfx || ''));
  beat('you didn’t hear a word', id => has(id, /You didn’t hear a word/));
  beat('the Barking Field', id => frames[id].scene.set === 'field' && has(id, /We go AROUND/));
  beat('are you a squirrel?', id => frames[id].choice && has(id, /Are you a squirrel/));
  beat('bye, rude squirrel', id => has(id, /BYE, RUDE SQUIRREL/) && castOf(id, 'dog').every(c => c.pose === 'howl'));
  beat('the Crossing (and the water worry)', id => frames[id].scene.set === 'crossing' && (frames[id].caption || []).some(c => c.when && c.when.worry === 'water'));
  beat('the first roar', id => frames[id].scene.opts.plane === 'low' && /ROOOO/.test(frames[id].sfx || ''));
  // the picture shows what hit her: the bonk effect (a pebble off the first cast member's head, stars
  // circling the bump), and she is that first cast member
  beat('BONK', id => /BONK/.test(frames[id].sfx || '') && castOf(id, 'riffle').length && frames[id].scene.fx.includes('bonk') &&
    frames[id].scene.cast[0].who === 'player');
  beat('I’m Riffle', id => has(id, /I’m Riffle!/));
  beat('WHAT? Speak up!', id => castOf(id, 'otter').some(c => c.variant === 1) && has(id, /Speak up!/));
  beat('look up: windows', id => has(id, /little round windows/) && frames[id].scene.opts.plane === 'low');
  beat('AIRPLANE', id => frames[id].choice && has(id, /That’s an AIRPLANE!/));
  beat('SPLOOSH', id => frames[id].scene.set === 'crossing' && /SPLOOSH/.test(frames[id].sfx || ''));
  beat('and I’m a duck', id => has(id, /And I’m a duck\./));
  beat('the lucky stone', id => frames[id].gift === 'riffle-stone');
  beat('the purr', id => frames[id].scene.fx.includes('purr') && has(id, /Is your TUMMY talking\?/));
  beat('not one paw under the Old Bridge', id => has(id, /not one paw under the Old Bridge/));
  const pathId = beat('the path', id => frames[id].choice && frames[id].choice.options.some(o => o.sets.ch2Path));
  beat('both paths meet: keep the stone', id => has(id, /Keep the stone! It’s lucky! Probably!/));
  beat('the wall at sunset (climbing)', id => frames[id].scene.set === 'title' && frames[id].scene.fx.includes('sunset') && (frames[id].caption || []).some(c => c.when && c.when.specialty === 'climbing'));
  beat('Air… planes.', id => has(id, /Air… planes\./));
  beat('by twos: sharp eyes', id => has(id, /By twos\./) && has(id, /Sharp eyes\./));
  beat('where should the stone go?', id => frames[id].choice && has(id, /Where should it go\?/));
  beat('a counting cat this morning', id => has(id, /needed a counting cat this morning/));
  beat('who was it? (by path), and something strange is happening on your river', id => (frames[id].caption || []).some(c => c.when && c.when.ch2Path === 'bridge') &&
    (frames[id].caption || []).some(c => c.when && c.when.ch2Path === 'river') && has(id, /Something strange is happening on your river/));
  beat('four mice… gone', id => castOf(id, 'mutterer').length && has(id, /Four mice… gone/));
  beat('the Sky River', id => frames[id].scene.fx.includes('skyriver') && has(id, /Sky River/));
  beat('the dream', id => frames[id].input && frames[id].input.kind === 'dream');
  beat('the end', id => frames[id].end);
  for (let i = 1; i < beats.length; i++) assert.ok(at(beats[i][1]) > at(beats[i - 1][1]), beats[i][0] + ' comes after ' + beats[i - 1][0]);

  // the two paths, each in its own order
  const opts = frames[pathId].choice.options;
  const bridge = walk({ ch2Path: 'bridge' }), river = walk({ ch2Path: 'river' });
  assert.equal(bridge[bridge.indexOf(pathId) + 1], opts.find(o => o.sets.ch2Path === 'bridge').next);
  assert.equal(river[river.indexOf(pathId) + 1], opts.find(o => o.sets.ch2Path === 'river').next);
  const inOrder = (path, list) => {
    let last = -1;
    list.forEach(([label, pred]) => {
      const i = path.findIndex((id, k) => k > last && pred(id));
      assert.ok(i > last, 'path beat missing or out of order: ' + label);
      last = i;
    });
  };
  inOrder(bridge, [
    ['Riffle keeps watch', id => has(id, /I’ll keep watch!/)],
    ['dry further back', id => has(id, /dry further back/) && frames[id].scene.cam === 'under'],
    ['drag marks', id => frames[id].scene.set === 'bridge' && has(id, /Deep drag marks/)],
    ['the sniffle: sad, not scary', id => has(id, /It sounds sad\./)],
    ['eyes open', id => frames[id].scene.opts.eyes === 'open'],
    ['eyes blink', id => frames[id].scene.opts.eyes === 'blink'],
    ['eyes gone', id => frames[id].scene.opts.eyes === 'none' && has(id, /they’re gone/)],
    ['big and soft and ginger', id => has(id, /big and soft and ginger/)],
    ['counted none', id => has(id, /Then I counted none\./)],
    ['not angry, scared', id => has(id, /I’m not angry\. I was scared\. That’s different\./)],
    ['Coil and the Accord', id => has(id, /Coil/) && has(id, /Accord/)],
    ['no eyelids', id => castOf(id, 'riffle').length && has(id, /don’t have eyelids/)],
    ['not for apprentices. Home.', id => has(id, /it isn’t for apprentices\. Home\./)]
  ]);
  inOrder(river, [
    ['the slide', id => castOf(id, 'riffle').some(c => c.pose === 'slide') && /SPLOOSH/.test(frames[id].sfx || '')],
    ['the towers upside down', id => has(id, /upside down in the river/)],
    ['Coil trades secrets', id => has(id, /trades them like pebbles/)],
    ['the airplane’s shadow', id => frames[id].scene.opts.plane === 'low' && has(id, /shadow slides across the river/)],
    ['the roar back, with a hiccup', id => frames[id].scene.opts.roar && /hic!/.test(frames[id].sfx || '')],
    ['the red light', id => frames[id].scene.cam === 'roof' && has(id, /little red light/)],
    ['a rumor', id => has(id, /START a rumor/)],
    ['her ear keeps twitching', id => has(id, /torn ear keeps twitching toward the towers/)]
  ]);
  // the river path stays with Riffle and never goes under the bridge; the bridge path never hears the roar
  river.forEach(id => assert.ok(!(frames[id].scene.set === 'bridge' && ['under', 'back'].includes(frames[id].scene.cam)), id + ': the river path stays out from under the bridge'));
  bridge.forEach(id => assert.ok(!frames[id].scene.opts.roar, id + ': the bridge path never hears the tower'));

  // the end is warm: night, no storm, no moon, in her nest
  const end = frames[ids[ids.length - 1]];
  assert.ok(end.scene.fx.includes('night') && !end.scene.fx.some(e => ['rain', 'lightning'].includes(e)), 'the last panel is a calm night');
  assert.equal(end.scene.set, 'den');
  assert.notEqual(end.scene.opts.moon, true);
  assert.ok(end.scene.cast.some(c => c.who === 'player' && c.at === 'nest'), 'she is in her nest');
  assert.match(end.caption.join(' '), /warm/);
  assert.match(end.caption.join(' '), /stone/);
  assert.match(end.caption.join(' '), /Sky River/);
  assert.equal(end.caption[end.caption.length - 1], 'End of Chapter Two.');
});

/* ------------------------------------------------------------------ Counts */

function factAB(f) { return Array.isArray(f) ? { a: f[0], b: f[1] } : f; }

test('counts: every set’s facts, in order, with their arithmetic and pictures', (t) => {
  const C = story.counts;
  assert.deepEqual(Object.keys(C), ['ch02-tails', 'ch02-ears', 'ch02-pile', 'ch02-check']);
  // the warm-up on the 1s, adaptive
  const w = C['ch02-tails'];
  assert.equal(w.table, 1);
  assert.deepEqual([w.thing, w.things, w.teacher], ['tail', 'tails', 'tallyheart']);
  assert.deepEqual(w.facts, [[1, 4], [7, 1]]);
  assert.deepEqual(w.warmHard, { table: 1, at: 1, alt: [1, 3] });
  assert.ok(w.warmHard.at >= 0 && w.warmHard.at < w.facts.length, 'warmHard.at is a place in the set');
  assert.ok(w.facts.some(f => Math.min(...f) === 1 && Math.max(...f) === 4), 'its alt replaces 1 × 4 when that one was hard');
  assert.ok(w.warmHard.alt.includes(1) && !w.facts.some(f => f.includes(3)), 'the alt is a 1s fact not already asked');
  assert.equal(w.done, 'Still got your tails. Good.');
  assert.match(w.remembered, /\{a\} × \{b\}/);
  // chapter 1's tails lines
  const ch01 = PC.story.ch01.counts['ch01-tails'];
  ['praise', 'fast', 'fastAfterMiss', 'helpIntro', 'helpIntroFar', 'miss', 'missLast'].forEach(k => assert.deepEqual(w[k], ch01[k], 'the warm-up uses chapter 1’s ' + k));
  // two questions can't hold a miss's two-question gap: it borrows chapter 1's tails, “One from last night.”
  assert.equal(w.fillFrom, 'ch01-tails', 'the warm-up borrows from chapter 1’s lesson');
  assert.ok(PC.story.ch01.counts['ch01-tails'], 'chapter 1’s tails lesson exists');
  assert.equal(PC.story.ch01.counts['ch01-tails'].table, w.table, 'it lends facts of the same Count');
  assert.equal(w.fillIntro, 'One from last night.');

  // the lesson: the 2s, eleven answers in both orders
  const e = C['ch02-ears'];
  assert.equal(e.table, 2);
  assert.deepEqual([e.thing, e.things, e.teacher], ['ear', 'ears', 'tallyheart']);
  const ef = e.facts.map(factAB);
  assert.deepEqual(ef.map(f => f.a + 'x' + f.b), ['3x2', '2x5', '4x2', '2x1', '5x2', '2x6', '7x2', '2x2', '2x8', '9x2', '2x10']);
  ef.forEach(f => assert.ok(f.a === 2 || f.b === 2, 'a 2s fact: ' + f.a + '×' + f.b));
  const firstTwo = ef.filter(f => f.a === 2 && f.b !== 2).length, lastTwo = ef.filter(f => f.b === 2 && f.a !== 2).length;
  assert.deepEqual([firstTwo, lastTwo].sort(), [5, 5], 'both orders (2 × 2 is both)');
  const others = ef.map(f => (f.a === 2 ? f.b : f.a));
  for (let n = 1; n <= 10; n++) assert.ok(others.includes(n), n + ' × 2 is asked one way or the other');
  const five = e.facts.find(f => !Array.isArray(f) && f.a === 5 && f.b === 2);
  assert.ok(five && five.right && five.rightPicture, '5 × 2 regroups');
  assert.equal(five.rightPicture.groups * five.rightPicture.per, 10, 'five pairs of ears as two rows of five');
  assert.deepEqual(five.right.map(b => b.who), ['tallyheart']);
  assert.match(five.right[0].text, /Same ten!/);
  const six = e.facts.find(f => !Array.isArray(f) && f.a === 2 && f.b === 6);
  assert.match(six.prompt, /hop on from ten/);
  assert.equal(six.lit, 10, '2 × 6: the first five cats’ ten ears glow as it is asked');
  assert.equal(six.retryPrompt, true, '2 × 6 keeps its prompt on the retry');
  // the first question is about the first three cats on the rim, the ones she just tapped
  const three = e.facts[0];
  assert.deepEqual([three.a, three.b], [3, 2]);
  const sk = frames[ids.find(id => frames[id].skip)].skip;
  assert.deepEqual(three.who, sk.who.slice(0, 3), '3 × 2 pictures the first three rim cats');
  assert.equal(e.firstPrompt, 'How many ears on the first three?');
  assert.equal(e.done, 'That’s the twos.');
  assert.deepEqual(e.praise, ['You hopped it!', 'Two by two, like a real hunter.', 'Yes! Two ears for every cat.', 'Two ears, every time.', 'Ears are trickier than tails, and you’re doing it anyway.']);
  assert.deepEqual(e.fast, ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.']);
  assert.deepEqual(e.fastAfterMiss, ['Ha! You didn’t even look at the sand that time.']);
  e.fast.forEach(l => assert.doesNotMatch(l, /sand/, 'a fast line with no miss before it has no sand to mention'));
  assert.match(e.helpIntro, /^Close\. /);
  assert.equal(e.helpIntroFar, e.helpIntro.replace(/^Close\.\s*/, ''));

  // the pile: one Counts moment, the boast then her count
  const p = C['ch02-pile'];
  assert.deepEqual([p.table, p.thing, p.things, p.unit, p.units], [2, 'piece', 'pieces', 'pair', 'pairs']);
  assert.equal(p.picture.kind, 'prey');
  assert.equal(p.fillFrom, 'ch02-ears');
  assert.deepEqual(p.facts.map(f => f.a + 'x' + f.b), ['10x2', '8x2']);
  const boast = p.facts[0];
  assert.equal(boast.picture.thought, true, 'the boast is a thought cloud');
  assert.equal(boast.picture.kind, 'prey');
  assert.deepEqual(boast.prompt, [{ who: 'grizzled', text: 'Ten pairs. How many pieces?' }]);
  assert.deepEqual(boast.right, [{ who: 'grizzled', text: 'Lucky guess.' }, { who: 'tallyheart', text: 'Luck doesn’t hop by twos.' }]);
  assert.deepEqual(boast.rightAgain, [{ who: 'grizzled', text: 'Hmph.' }, { who: 'tallyheart', text: 'One morning of ears, and {they}’s hopping already.' }],
    'a right retry of the boast: the old tom’s “Hmph.”, not the generic again line');
  // the text's own words, all narration: a caption box in the lesson column, not a balloon
  assert.deepEqual(p.facts[1].prompt, [{ kind: 'caption', text: 'You touch your nose to each little stack.' },
    { kind: 'caption', text: 'One pair. Two pairs. Three… Eight pairs. And that’s all. How many pieces?' }]);
  assert.equal(p.facts[1].light, 'groups', 'the stacks light one at a time as she noses them');
  assert.equal(p.facts[1].check, true, '8 × 2 is timed over a long prompt: a right one is no measure of the fact');
  assert.equal(p.fillIntro, 'One from this morning.');
  assert.deepEqual(p.praise, [], 'the story is the praise');
  assert.equal(p.done, '', 'no closing screen: the next frame answers');
  assert.equal(p.fast, undefined, 'no fast line on the pile');

  // the check: two rows of eight
  const k = C['ch02-check'];
  assert.deepEqual([k.table, k.thing, k.things], [2, 'piece', 'pieces']);
  assert.equal(k.fillFrom, 'ch02-ears');
  assert.equal(k.facts.length, 1);
  const chk = k.facts[0];
  assert.deepEqual([chk.a, chk.b, chk.groups, chk.per], [2, 8, 2, 8]);
  assert.equal(chk.picture.layout, 'rows');
  assert.equal(chk.prompt, 'Two rows of eight. How many pieces?');
  assert.equal(chk.retryPrompt, true, 'the check keeps its question on the retry');
  assert.equal(chk.light, 'rows', 'the two rows light row by row');
  assert.equal(chk.check, true);
  assert.equal(k.fillIntro, 'One from this morning.');
  assert.deepEqual(k.praise, []);
  assert.equal(k.done, '');
  // the choice's lines say only the twenty, never the sixteen, before the check asks it
  ids.filter(id => frames[id].choice && frames[id].choice.options.some(o => o.sets.ch2SaidAloud !== undefined)).forEach(id => {
    frames[id].choice.options.forEach(o => { assert.doesNotMatch(o.label, /sixteen/i); assert.doesNotMatch(T(o.next), /sixteen/i); });
  });

  // every fact: arithmetic, pictures that hold the answer, fillFrom sets that exist, no duplicates in a set
  Object.keys(C).forEach(sid => {
    const d = C[sid];
    assert.ok(Array.isArray(d.facts) && d.facts.length, sid);
    assert.equal(d.ask, '{a} × {b}', sid + ': the question as she sees it');
    if (d.fillFrom) {
      const lend = E.countsSet(d.fillFrom, story, PC.story);
      assert.ok(lend, sid + ': fillFrom names a set (here or in another chapter)');
      assert.equal(lend.table, d.table, sid + ': it borrows from the same Count');
      assert.ok(d.fillIntro, sid + ': a borrowed question says where it is from');
    }
    const keys = new Set();
    d.facts.forEach(f => {
      const q = factAB(f);
      assert.ok(Number.isInteger(q.a) && Number.isInteger(q.b) && q.a >= 1 && q.b >= 1 && q.a <= 10 && q.b <= 10, sid + ': ' + JSON.stringify(f));
      assert.ok(q.a === d.table || q.b === d.table, sid + ': ' + q.a + '×' + q.b + ' belongs to the ' + d.table + 's');
      if (!Array.isArray(f)) {
        assert.deepEqual(Object.keys(f).filter(x => !['a', 'b', 'table', 'groups', 'per', 'picture', 'who', 'lit', 'light', 'check', 'prompt', 'retryPrompt',
          'right', 'rightAgain', 'rightPicture'].includes(x)), [], sid + ': fact keys');
        if (f.light !== undefined) assert.ok(['groups', 'rows'].includes(f.light), sid + ': light');
        if (f.lit !== undefined) assert.ok(Number.isInteger(f.lit) && f.lit > 0 && f.lit < q.a * q.b, sid + ': lit is fewer than the answer');
        if (f.groups !== undefined || f.per !== undefined) assert.equal(f.groups * f.per, q.a * q.b, sid + ': ' + q.a + '×' + q.b + ' pictured as ' + f.groups + '×' + f.per);
        if (f.rightPicture) assert.equal(f.rightPicture.groups * f.rightPicture.per, q.a * q.b, sid + ': the regrouped picture holds the answer');
      }
      const key = q.a + 'x' + q.b;
      assert.ok(!keys.has(key), sid + ': ' + key + ' twice');
      keys.add(key);
    });
  });
  // about 16 typed answers with no misses: 2 warm-up, 11 ears, 2 at the pile, 1 check
  const typed = Object.keys(C).reduce((n, sid) => n + C[sid].facts.length, 0);
  assert.equal(typed, 16);
  t.diagnostic(typed + ' typed answers and 5 taps with no misses');
});

test('counts: lines are short, whole sentences, and fit both sexes', () => {
  countsLines().forEach(x => {
    assert.ok(typeof x.text === 'string', x.set + ' ' + x.where);
    if (x.where === 'done' && x.text === '') return;
    assert.ok(x.text.trim(), x.set + ' ' + x.where + ' is empty');
    assert.ok(words(x.text) <= 16, x.set + ' ' + x.where + ': short: ' + x.text);
    if (x.who) assert.ok(['tallyheart', 'grizzled', 'player'].includes(x.who), x.set + ' ' + x.where + ': who');
    Object.keys(PROFILES).forEach(kind => assert.deepEqual(badGrammar(fill(x.text, PROFILES[kind])), [], x.set + ' ' + x.where + ': ' + x.text));
  });
});

/* Run a set through the engine's Counts runner: `miss` lists the first asks to get wrong. */
function runSet(setId, cat, miss) {
  const { def, state } = E.chapterLesson(cat, story, setId, 1, PC.story);
  const asked = [];
  for (let g = 0; g < 50 && !E.counts.done(state); g++) {
    const q = E.counts.question(state);
    const key = q.a + 'x' + q.b;
    const wrong = (miss || []).includes(key) && !q.retry && !q.filler;
    const qdef = E.questionDef ? E.questionDef(def, q, story, PC.story) : def;
    const res = E.counts.answer(state, qdef, wrong ? q.answer + 1 : q.answer, 3000, 1);
    E.logAnswer(cat, res.entry);
    asked.push((q.retry ? 'retry ' : q.filler ? 'filler ' : '') + key + (q.hard ? ' (hard)' : '') + (res.line ? ' “' + res.line + '”' : '') + (res.balloons ? ' [' + res.balloons.map(b => b.who + ': ' + b.text).join(' / ') + ']' : ''));
  }
  assert.ok(E.counts.done(state), setId + ' finishes');
  E.recordLesson(cat, state);
  return asked;
}

test('counts through the engine: every set finishes, a miss comes back two questions later, the pile borrows ears', () => {
  const cat = E.blankCat({ now: 1 });
  // no misses: 2 + 11 + 2 + 1 answers, the pile's first-time lines from the old tom and Tallyheart
  const tails = runSet('ch02-tails', cat), ears = runSet('ch02-ears', cat), pile = runSet('ch02-pile', cat), check = runSet('ch02-check', cat);
  assert.deepEqual([tails.length, ears.length, pile.length, check.length], [2, 11, 2, 1]);
  assert.match(ears[4], /^5x2 \[tallyheart: Five pairs of ears/);
  assert.match(pile[0], /^10x2 \[grizzled: Lucky guess\. \/ tallyheart: Luck doesn’t hop by twos\.\]/);
  assert.equal(pile[1], '8x2', 'no praise line on the pile');
  assert.equal(check[0], '2x8');
  assert.deepEqual(E.learnedCounts(cat, PC.story).map(c => c.table), [1, 2], 'the 1s and the 2s are learned');
  assert.equal(E.countFor(2, PC.story).setId, 'ch02-ears', 'the Hollow’s 2s are the ears lesson');
  const hd = E.hollowDef(PC.story, 2);
  assert.equal(hd.things, 'ears');
  assert.equal(hd.firstPrompt, undefined);
  // a missed boast: 10 × 2, 8 × 2, one of this morning's ears, then 10 × 2 again
  const cat2 = E.blankCat({ now: 1 });
  runSet('ch02-ears', cat2);
  const p2 = runSet('ch02-pile', cat2, ['10x2']).map(s => s.replace(/ [“[].*$/, ''));
  assert.deepEqual(p2.slice(0, 2), ['10x2', '8x2']);
  assert.match(p2[2], /^filler \d+x\d+$/);
  assert.equal(p2[3], 'retry 10x2');
  assert.ok(!/2x10|10x2/.test(p2[2]), 'the borrowed question is not the missed pair');
  // a missed count: 8 × 2, two ears questions, then 8 × 2 again; a missed check likewise
  const p3 = runSet('ch02-pile', cat2, ['8x2']).map(s => s.replace(/ [“[].*$/, ''));
  assert.deepEqual([p3[0], p3[1]], ['10x2', '8x2']);
  assert.ok(/^filler/.test(p3[2]) && /^filler/.test(p3[3]) && p3[4] === 'retry 8x2', p3.join(', '));
  const c3 = runSet('ch02-check', cat2, ['2x8']).map(s => s.replace(/ [“[].*$/, ''));
  assert.ok(c3[0] === '2x8' && /^filler/.test(c3[1]) && /^filler/.test(c3[2]) && c3[3] === 'retry 2x8', c3.join(', '));
  // a right retry of the boast: the old tom's “Hmph.” and Tallyheart's “hopping already”
  const cat4 = E.blankCat({ now: 1 });
  runSet('ch02-ears', cat4);
  const p4 = runSet('ch02-pile', cat4, ['10x2']);
  const r4 = p4.find(x => /^retry 10x2/.test(x));
  assert.ok(r4 && /\[grizzled: Hmph\. \/ tallyheart: One morning of ears, and .*hopping already\.\]/.test(r4), p4.join(' | '));
  assert.ok(!/remembered that one/.test(r4), 'not the generic again line');
  // 8 × 2 and the check are logged as checks
  assert.ok(cat4.counts.filter(e => e.set === 'ch02-pile' && e.a === 8 && e.b === 2).every(e => e.check === true));
  // a miss in the warm-up comes back exactly two questions later, borrowing chapter 1's tails
  for (const [missed, other] of [['1x4', '7x1'], ['7x1', '1x4']]) {
    const w = E.blankCat({ now: 1 });
    const run = runSet('ch02-tails', w, [missed]).map(s => s.replace(/ [“[].*$/, ''));
    const i = run.indexOf(missed), j = run.indexOf('retry ' + missed);
    assert.ok(i >= 0 && j - i === 3, missed + ': ' + run.join(', '));
    const fills = run.filter(x => /^filler /.test(x)).map(x => x.slice(7));
    assert.ok(fills.length >= 1, missed + ': borrows a question: ' + run.join(', '));
    const pair = k => k.split('x').map(Number).sort((a, b) => a - b).join('x');
    fills.forEach(f => {
      assert.ok(![missed, other].map(pair).includes(pair(f)), missed + ': the borrowed question is not one asked in the warm-up: ' + run.join(', '));
      assert.ok(f.split('x').includes('1'), 'a 1s fact: ' + f);
    });
    assert.ok(w.counts.filter(e => e.filler).every(e => e.from === undefined || e.from === 'ch01-tails'), 'borrowed from chapter 1’s tails');
  }
  // a miss in the ears lesson comes back exactly two questions later
  const cat3 = E.blankCat({ now: 1 });
  const e3 = runSet('ch02-ears', cat3, ['4x2']).map(s => s.replace(/ [“[].*$/, ''));
  assert.equal(e3.indexOf('retry 4x2') - e3.indexOf('4x2'), 3);
  // the warm-up adapts to what was hard last time
  const hard = E.blankCat({ now: 1 });
  hard.counts.push({ set: 'ch01-tails', a: 4, b: 1, answer: 5, correct: false, ms: 3000, helped: true, retry: false, at: 1 });
  assert.deepEqual(E.lessonFacts(hard, story.counts['ch02-tails']), [[1, 3], { a: 4, b: 1, hard: true }], '1 × 3 opens when 4 × 1 was hard');
  const hard2 = E.blankCat({ now: 1 });
  hard2.counts.push({ set: 'ch01-tails', a: 9, b: 1, answer: 9, correct: true, ms: 9000, helped: false, retry: false, at: 1 });
  assert.deepEqual(E.lessonFacts(hard2, story.counts['ch02-tails']), [[1, 4], { a: 9, b: 1, hard: true }]);
  assert.match(runSet('ch02-tails', hard2)[1], /^9x1 \(hard\) “Last time, 9 × 1 made you stop and think\. Not today!”/);
  assert.deepEqual(E.lessonFacts(E.blankCat({}), story.counts['ch02-tails']), [[1, 4], [7, 1]], 'with nothing hard, 1 × 4 then 7 × 1');
});

/* ------------------------------------------------------------------ book and teaser */

function recapFor(flags) {
  return story.book.recap.filter(r => !r.when || Object.keys(r.when).every(k => {
    const want = r.when[k];
    return Array.isArray(want) ? want.includes(flags[k]) : flags[k] === want;
  }));
}

test('book: title, chapter title, and a 6–10 sentence recap on every path combination', () => {
  const b = story.book;
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'After the Storm');
  assert.equal(b.dream, '{name}paw’s dream: “{dream}”');
  assert.ok(b.noDream && !tokensIn(b.noDream).includes('dream'), 'noDream');
  b.recap.forEach((r, i) => {
    assert.ok(typeof r.text === 'string' && r.text.trim(), 'recap ' + i);
    if (r.when) Object.keys(r.when).forEach(k => {
      assert.ok(FLAGS[k], 'recap ' + i + ': unknown flag ' + k);
      [].concat(r.when[k]).forEach(v => assert.ok(FLAGS[k].includes(v), 'recap ' + i + ': ' + k + '=' + v));
    });
    assert.match(r.text, /[.!?”]$/, 'recap ' + i + ' is a whole sentence');
    assert.ok(words(r.text) <= 30, 'recap ' + i + ' is short');
    assert.doesNotMatch(r.text, /\byou\b/i, 'recap is third person: ' + r.text);
  });
  // each chapter-2 flag value has exactly one sentence of its own (not ch2Stone: the stone is in her
  // nest either way, and the book says only that)
  Object.keys(FLAGS2).filter(k => k !== 'ch2Stone').forEach(k => FLAGS2[k].forEach(v => {
    assert.equal(b.recap.filter(r => r.when && [].concat(r.when[k]).includes(v)).length, 1, 'recap sentences for ' + k + '=' + v);
  }));
  let paths = 0;
  for (const flags of everyPath()) {
    const r = recapFor(flags);
    assert.ok(r.length >= 6 && r.length <= 10, JSON.stringify(flags) + ': ' + r.length + ' sentences');
    paths++;
  }
  assert.equal(paths, 240 * 4 * 2);   // chapter 1's flags, ch2SaidAloud × ch2Path, and where the stone went
  // the engine builds the same page
  const cat = E.blankCat({});
  cat.name = 'Fern'; cat.petname = 'Biscuit'; cat.look.sex = 'tom';
  cat.flags = { specialty: 'climbing', worry: 'water', ch2SaidAloud: false, ch2Path: 'bridge' };
  const page = E.buildBook(story, cat);
  assert.equal(page.recap.length, recapFor(cat.flags).length);
  assert.ok(page.recap.some(s => /Fernpaw whispered it to Tallyheart/.test(s)));
  assert.ok(page.recap.some(s => /two big eyes blink/.test(s)));
  assert.equal(page.chapter, 'Chapter 2: After the Storm');
});

test('the teaser for chapter 3, and chapter 1’s for this one', () => {
  assert.equal(story.teaser.title, 'Chapter 3: Under the Old Bridge');
  assert.ok(Array.isArray(story.teaser.lines) && story.teaser.lines.length >= 1 && story.teaser.lines.length <= 3);
  story.teaser.lines.forEach(l => assert.ok(words(l) <= 25, l));
  assert.match(story.teaser.lines.join(' '), /claws/, 'tomorrow’s Count');
  const cat = E.blankCat({}); cat.name = 'Moon';
  const t = E.teaser(story, cat, PC.story);
  const ch03 = E.chapters(PC.story).find(s => s.number === 3);
  assert.equal(t.title, 'Chapter 3: Under the Old Bridge');
  assert.deepEqual([t.built, t.next], ch03 ? [true, ch03.id] : [false, null], 'chapter 3: built, or coming soon');
  const t1 = E.teaser(PC.story.ch01, cat, PC.story);
  assert.deepEqual([t1.title, t1.built, t1.next], ['Chapter 2: After the Storm', true, 'ch02']);
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

test('both paths play through the engine: flags, the gift, the lessons, the dream, the end', () => {
  for (const path of ['bridge', 'river']) {
    const cat = E.blankCat({ now: 1 });
    cat.name = 'Moon'; cat.petname = 'Muffin';
    cat.flags = { specialty: 'friends', worry: 'water' };
    cat.finished = { ch01: 1 };
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
        const want = opts.find(o => o.option.sets.ch2Path === path) || opts.find(o => o.option.sets.ch2SaidAloud === (path === 'bridge')) || opts[opts.length - 1];
        assert.ok(E.choose(cat, story, want.index, now), id);
      } else if (kind === 'input') assert.ok(E.submitInput(cat, story, 'i swam with riffle', now), id);
      else if (kind === 'counts') {
        const { def, state } = E.chapterLesson(cat, story, f.counts.set, now, PC.story);
        cat.lesson = { mode: 'chapter', frame: id, chapter: story.id, state };
        while (!E.counts.done(state)) { const q = E.counts.question(state); E.logAnswer(cat, E.counts.answer(state, def, q.answer, 2000, now).entry); }
        const rec = E.recordLesson(cat, state);
        assert.ok(E.finishCounts(cat, story, rec.summary, now), id);
      } else assert.fail('unexpected ' + kind + ' at ' + id);
    }
    assert.equal(E.kindOf(story.frames[walked[walked.length - 1]]), 'end', path + ' reaches the end');
    assert.ok(E.isFinished(cat, 'ch02'), path + ': chapter 2 is finished');
    assert.equal(cat.flags.ch2Path, path);
    assert.equal(cat.flags.ch2SaidAloud, path === 'bridge');
    assert.deepEqual(cat.nest, ['riffle-stone'], path + ': Riffle’s stone is in her nest');
    assert.equal(cat.dreams.ch02, 'i swam with riffle');
    ['ch02-tails', 'ch02-ears', 'ch02-pile', 'ch02-check'].forEach(s => assert.ok(cat.lessons[s] && cat.lessons[s].noHelp, path + ': ' + s));
    assert.equal(cat.counts.length, 16, path + ': 16 answers');
    assert.equal(walked.length, walk({ ch2Path: path, ch2SaidAloud: path === 'bridge' }).length, path + ': the engine walks the same frames');
    // the `when` lines she saw: the friends line at the stone, the water worry at the Crossing and on the river
    const sees = id => E.captions(story.frames[id], cat).concat(E.balloons(story.frames[id], cat).map(b => b.text)).join(' ');
    assert.ok(walked.some(id => /So do I\./.test(sees(id))), path + ': the friends line');
    assert.ok(walked.some(id => /steps between you and the wide, deep water/.test(sees(id))), path + ': the water worry at the Crossing');
    assert.equal(walked.some(id => /keep well back from the deep water/.test(sees(id))), path === 'river', path + ': the water worry on the river path');
    assert.ok(walked.some(id => (path === 'bridge' ? /Snakes can’t blink\. So who was it\?/ : /Towers don’t roar\. So who did\?/).test(sees(id))), path + ': her bedtime thought');
    assert.ok(!walked.some(id => /freshly dug/.test(sees(id))), 'only a noticing cat sees the dug earth');
    // the book page
    const page = E.buildBook(story, cat);
    assert.equal(page.dream, 'Moonpaw’s dream: “I swam with riffle.”');
    assert.ok(page.recap.length >= 6 && page.recap.length <= 10);
  }
});
