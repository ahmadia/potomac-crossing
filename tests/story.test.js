/* Story tests for chapter 1: node --test tests/
 *
 * Checks app/story/ch01.js against the frame contract in docs/build.md: the frame graph, one
 * interaction per frame, balloons, tokens, storyboards, word counts, the art vocabulary
 * (hard-coded here from build.md, and cross-checked against PC.art.vocab when the art is
 * present), the Counts set, the book recap, and every line rendered for a she-cat and a tom.
 *
 *   PRINT_STORY=1 node --test tests/story.test.js   prints the whole chapter, rendered both ways.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const PC = require('../app/story/ch01.js');
const story = PC.story.ch01;
const frames = story.frames;
const ids = Object.keys(frames);

/* ------------------------------------------------------------------ the contract, from build.md */

const VOCAB = {
  sets: {
    room: { cams: ['wide', 'cushion', 'glass', 'outside'], anchors: ['cushion', 'floor', 'glass', 'doorway'],
      opts: { door: ['closed', 'open'], reflection: [true], clan: [true] } },
    tower: { cams: ['up', 'balcony', 'balcony-close'], anchors: ['window', 'railing'], opts: {} },
    garden: { cams: ['wide', 'paws', 'step', 'fence', 'lamp', 'meet', 'hedge'],
      anchors: ['step', 'lawn', 'fence-foot', 'lamp-top', 'hedge-gap', 'doorway'],
      opts: { sparrows: 'count', lampSparrow: [true], dish: [true], moth: [true] } },
    camp: { cams: ['reveal', 'crowd', 'fountain', 'fountain-close', 'entrance', 'ferns', 'purr'],
      anchors: ['entrance', 'fountain-top', 'fountain-foot', 'crowd-left', 'crowd-right', 'ferns', 'center'], opts: {} },
    hollow: { cams: ['wide', 'lesson', 'sand', 'tree'], anchors: ['sand-left', 'sand-right', 'sunpatch', 'tree'],
      opts: { marks: [0, 1], glow: [true] } },
    den: { cams: ['outside', 'inside', 'nest', 'doorway'],
      anchors: ['entrance-left', 'entrance-right', 'doorway', 'nest', 'sleeper-1', 'sleeper-2'],
      opts: { weather: ['clear', 'cloudy', 'storm'] } },
    sky: { cams: ['up', 'cats'], anchors: ['ground-left', 'ground-right'], opts: {} },
    river: { cams: ['crash'], anchors: [], opts: { splash: [true] } },
    title: { cams: ['wide'], anchors: ['wall'], opts: {} }
  },
  cats: ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat'],
  others: { sparrow: ['perch', 'fluffed'], moth: ['fly'], tallone: ['stand', 'water', 'set-dish'] },
  catPoses: ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer'],
  moods: ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud',
    'sniff', 'shout', 'solemn'],
  facing: ['left', 'right'],
  fx: ['sunset', 'dusk', 'night', 'stars', 'skyriver', 'rain', 'lightning', 'glow', 'purr', 'sparkle', 'zzz', 'motion']
};
const ALL_WHO = VOCAB.cats.concat(Object.keys(VOCAB.others));
const FLAGS = {
  stepOut: ['chase', 'slow'],
  spokeUp: [true, false],
  joinReason: ['learn', 'count', 'brave'],
  specialty: ['noticing', 'sneaking', 'climbing', 'swimming', 'friends'],
  worry: ['small', 'water', 'talk', 'shiny']
};
const INTERACTIONS = ['next', 'choice', 'input', 'look', 'counts', 'end'];
const FRAME_KEYS = ['scene', 'board', 'caption', 'say', 'sfx'].concat(INTERACTIONS);
const TOKENS = ['name', 'petname', 'they', 'them', 'their', 'They', 'Them', 'Their', 'THEY', 'shecat'];
const DREAM_TOKENS = TOKENS.concat(['dream']);   // book.dream alone may also use {dream}, what she typed
const BALLOON_KINDS = [undefined, 'say', 'shout', 'whisper', 'think'];   // what app/ui.js draws
const SHOTS = ['WIDE', 'MEDIUM', 'CLOSE-UP', 'EXTREME CLOSE-UP', 'LOW ANGLE', 'HIGH ANGLE', 'POV', 'INSERT'];
const PETNAMES = ['Muffin', 'Snickerdoodle', 'Mittens', 'Biscuit', 'Sir Pounce-a-lot'];
const WORDS_AIM = 35, WORDS_MAX = 50;

/* ------------------------------------------------------------------ helpers */

function exits(f) {
  if (f.next) return [f.next];
  if (f.choice) return f.choice.options.map(o => o.next);
  if (f.input) return [f.input.next];
  if (f.look) return [f.look.next];
  if (f.counts) return [f.counts.next];
  return [];
}
function interactions(f) { return INTERACTIONS.filter(k => f[k] !== undefined); }
function texts(f) {
  const out = [];
  (f.caption || []).forEach((t, i) => out.push({ where: 'caption ' + i, text: t }));
  (f.say || []).forEach((b, i) => out.push({ where: 'say ' + i + ' (' + b.who + ')', text: b.text, who: b.who }));
  if (f.sfx) out.push({ where: 'sfx', text: f.sfx, sfx: true });
  return out;
}
function words(t) { return t.split(/\s+/).filter(w => /[\p{L}\p{N}{]/u.test(w)).length; }
function frameWords(f) { return texts(f).reduce((n, x) => n + words(x.text), 0); }
function tokensIn(t) { return (t.match(/\{[^}]*\}/g) || []).map(s => s.slice(1, -1)); }

const PROFILES = {
  'she-cat': { name: 'Moon', petname: 'Snickerdoodle', they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her',
    Their: 'Her', THEY: 'SHE', shecat: 'she-cat', dream: 'I chased a moth all the way to the river.' },
  tom: { name: 'Storm', petname: 'Sir Pounce-a-lot', they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him',
    Their: 'His', THEY: 'HE', shecat: 'tom', dream: 'Waffles came down to touch the grass.' }
};
function fill(text, p) { return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : m)); }

/* Anything that reads badly once the tokens are filled. Returns a list of reasons. */
function badGrammar(text, isSfx) {
  const bad = [];
  if (/[{}]/.test(text)) bad.push('unfilled token');
  if (/\b(she|he) (are|were|have|do|don’t|aren’t|weren’t|haven’t)\b/i.test(text)) bad.push('pronoun/verb agreement');
  if (/\bhisself\b|\btheirselves\b/i.test(text)) bad.push('bad reflexive');
  if (/\ban (tom|she-cat)\b/i.test(text)) bad.push('“an” before tom/she-cat');
  const doubled = text.replace(/a thousand thousand/g, '');   // the draft's own Sky River line
  if (!isSfx && /\b(\w+)\s+\1\b/i.test(doubled)) bad.push('doubled word');
  if (/pawpaw/i.test(text)) bad.push('pawpaw');
  if (/\s{2,}|\s[,.!?]/.test(text)) bad.push('stray space');
  if (!isSfx) {
    const start = text.replace(/^[“"‘'(]+/, '');
    if (!start.startsWith('…') && /^\p{Ll}/u.test(start)) bad.push('starts lowercase');
    const re = /[.!?][”"’']?\s+[“"‘(]?(\p{Ll})/gu;
    if (re.test(text)) bad.push('sentence starts lowercase');
  }
  return bad;
}

function everyText(fn) {
  ids.forEach(id => texts(frames[id]).forEach(x => fn(id, x)));
  ids.forEach(id => {
    const f = frames[id];
    if (f.choice) f.choice.options.forEach((o, i) => fn(id, { where: 'option ' + i, text: o.label }));
  });
  story.book.recap.forEach((r, i) => fn('book', { where: 'recap ' + i, text: r.text }));
  fn('book', { where: 'title', text: story.book.title });
  if (story.book.dream) fn('book', { where: 'dream', text: story.book.dream });
  if (story.book.noDream) fn('book', { where: 'noDream', text: story.book.noDream });
}

/* ------------------------------------------------------------------ shape and graph */

test('chapter shape', () => {
  assert.equal(story.id, 'ch01');
  assert.equal(story.number, 1);
  assert.equal(story.title, 'Through the Glass');
  assert.equal(story.start, 'f001');
  assert.ok(frames[story.start], 'start frame exists');
  assert.ok(ids.length >= 60, 'a full chapter of panels');
});

test('frame ids run f001, f002… in reading order; every edge goes forward', () => {
  ids.forEach(id => assert.match(id, /^f\d{3}[a-z]?$/, id));
  const sorted = ids.slice().sort();
  assert.deepEqual(ids, sorted, 'frames are listed in id order');
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(n > id, id + ' → ' + n + ' goes backward')));
  // the numbers have no gaps: every base number f001…fNNN is used
  const nums = [...new Set(ids.map(id => +id.slice(1, 4)))].sort((a, b) => a - b);
  nums.forEach((n, i) => assert.equal(n, i + 1, 'frame number ' + (i + 1) + ' is missing'));
});

test('exactly one interaction per frame, and no unknown keys', () => {
  ids.forEach(id => {
    const f = frames[id];
    assert.deepEqual(interactions(f).length, 1, id + ' has ' + interactions(f).join('+'));
    Object.keys(f).forEach(k => assert.ok(FRAME_KEYS.includes(k), id + ': unknown key ' + k));
    if (f.end !== undefined) assert.equal(f.end, true, id);
    if (f.look) assert.deepEqual(Object.keys(f.look), ['next'], id);
  });
});

test('every next / option / input / look / counts target exists', () => {
  ids.forEach(id => exits(frames[id]).forEach(n => assert.ok(frames[n], id + ' → missing ' + n)));
});

test('every frame is reachable from the start', () => {
  const seen = new Set([story.start]);
  const stack = [story.start];
  while (stack.length) exits(frames[stack.pop()]).forEach(n => { if (!seen.has(n)) { seen.add(n); stack.push(n); } });
  const lost = ids.filter(id => !seen.has(id));
  assert.deepEqual(lost, [], 'unreachable frames');
});

test('the end is reachable from every frame, and there is exactly one end', () => {
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

test('choices: labels, valid flags, every flag value offered, branches rejoin quickly', () => {
  const offered = {};
  ids.filter(id => frames[id].choice).forEach(id => {
    const opts = frames[id].choice.options;
    assert.ok(Array.isArray(opts) && opts.length >= 2 && opts.length <= 5, id);
    opts.forEach((o, i) => {
      assert.deepEqual(Object.keys(o).sort(), ['label', 'next', 'sets'], id + ' option ' + i);
      assert.ok(o.label && words(o.label) <= 16, id + ' option ' + i + ' label');
      Object.keys(o.sets).forEach(k => {
        assert.ok(FLAGS[k], id + ': unknown flag ' + k);
        assert.ok(FLAGS[k].includes(o.sets[k]), id + ': bad value ' + k + '=' + o.sets[k]);
        (offered[k] = offered[k] || new Set()).add(o.sets[k]);
      });
    });
    // every option leads, within four steps, to one shared frame
    const within = o => { const s = new Set(); let cur = [o.next]; for (let d = 0; d < 4; d++) { cur.forEach(x => s.add(x)); cur = cur.flatMap(x => exits(frames[x])); } return s; };
    const sets = opts.map(within);
    const shared = [...sets[0]].filter(x => sets.every(s => s.has(x)));
    assert.ok(shared.length > 0, id + ': branches do not rejoin within four frames');
  });
  Object.keys(FLAGS).forEach(k => assert.deepEqual([...(offered[k] || [])].sort(), FLAGS[k].slice().sort(), 'flag ' + k));
});

test('inputs, look and counts frames', () => {
  const kinds = ids.filter(id => frames[id].input).map(id => frames[id].input.kind);
  assert.deepEqual(kinds, ['petname', 'clanname', 'dream']);
  const pet = ids.find(id => frames[id].input && frames[id].input.kind === 'petname');
  assert.deepEqual(frames[pet].input.suggestions, PETNAMES);
  const clan = ids.find(id => frames[id].input && frames[id].input.kind === 'clanname');
  assert.ok(frames[clan].input.suggestions.length >= 6);
  assert.equal(ids.filter(id => frames[id].look).length, 1, 'one look frame');
  const counts = ids.filter(id => frames[id].counts);
  assert.equal(counts.length, 1, 'one counts frame');
  assert.deepEqual(Object.keys(frames[counts[0]].counts).sort(), ['next', 'set']);
  assert.ok(story.counts[frames[counts[0]].counts.set], 'the counts set exists');
  // order: look, pet name … clan name … counts … dream, end
  const at = id => ids.indexOf(id);
  const look = ids.find(id => frames[id].look);
  const dream = ids.find(id => frames[id].input && frames[id].input.kind === 'dream');
  assert.ok(at(look) < at(pet) && at(pet) < at(clan) && at(clan) < at(counts[0]) && at(counts[0]) < at(dream));
  assert.equal(frames[dream].input.next, ids[ids.length - 1], 'the dream frame is followed by the end');
});

/* ------------------------------------------------------------------ text */

test('every balloon speaker is in that frame’s cast, once', () => {
  ids.forEach(id => {
    const f = frames[id];
    (f.say || []).forEach((b, i) => {
      assert.deepEqual(Object.keys(b).filter(k => !['who', 'text', 'kind', 'name'].includes(k)), [], id + ' say ' + i);
      if (b.name !== undefined) assert.ok(typeof b.name === 'string' && b.name.trim() && !tokensIn(b.name).length, id + ' say ' + i + ' name');
      assert.ok(b.text && typeof b.text === 'string', id + ' say ' + i + ' text');
      assert.ok(BALLOON_KINDS.includes(b.kind), id + ' say ' + i + ' kind ' + b.kind);
      const n = f.scene.cast.filter(c => c.who === b.who).length;
      assert.equal(n, 1, id + ': speaker ' + b.who + ' appears ' + n + ' times in the cast');
    });
    if (f.caption !== undefined) {
      assert.ok(Array.isArray(f.caption) && f.caption.length > 0, id + ' caption');
      f.caption.forEach(t => assert.ok(typeof t === 'string' && t.trim(), id + ' empty caption'));
    }
    if (f.sfx !== undefined) assert.ok(typeof f.sfx === 'string' && f.sfx.trim(), id + ' sfx');
    if (!f.end) assert.ok(texts(f).length > 0 || f.look, id + ' has no text at all');
  });
});

test('nobody is named on a balloon before the story names them', () => {
  const intro = { tallyheart: /I’m Tallyheart/, glintstar: /This is Glintstar/ };
  Object.keys(intro).forEach(who => {
    const at = ids.findIndex(id => intro[who].test(texts(frames[id]).map(x => x.text).join(' ')));
    assert.ok(at > 0, who + ' is introduced');
    ids.slice(0, at).forEach(id => (frames[id].say || []).forEach(b => {
      if (b.who === who) assert.ok(b.name, id + ': ' + who + ' speaks before the introduction, so the balloon needs a name');
    }));
  });
});

test('text tokens are only the allowed ones', () => {
  const bad = [];
  everyText((id, x) => {
    const ok = id === 'book' && x.where === 'dream' ? DREAM_TOKENS : TOKENS;
    tokensIn(x.text).forEach(t => { if (!ok.includes(t)) bad.push(id + ' ' + x.where + ': {' + t + '}'); });
  });
  assert.deepEqual(bad, []);
});

test('word counts: about 35 words a frame, never more than 50', (t) => {
  const over = [];
  ids.forEach(id => {
    const n = frameWords(frames[id]);
    assert.ok(n <= WORDS_MAX, id + ' has ' + n + ' words');
    if (n > WORDS_AIM) over.push(id + ' (' + n + ')');
  });
  if (over.length) t.diagnostic('over ' + WORDS_AIM + ' words: ' + over.join(', '));
  const total = ids.reduce((n, id) => n + frameWords(frames[id]), 0);
  t.diagnostic(ids.length + ' frames, ' + total + ' words of story text');
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
      if (print) { if (id !== last) console.log('\n' + id); last = id; console.log('  ' + x.where + ': ' + out); }
      const bad = badGrammar(out, x.sfx);
      if (bad.length) problems.push(kind + ' ' + id + ' ' + x.where + ': ' + bad.join(', ') + ' | ' + out);
    });
  });
  problems.forEach(s => t.diagnostic(s));
  assert.deepEqual(problems, []);
});

test('our own world: no coined words from the books', () => {
  const banned = /\b(twoleg|kittypet|starclan|fresh-kill|thunderpath|thunderclan|riverclan|windclan|shadowclan|skywing|seawing|nightwing)s?\b/i;
  everyText((id, x) => assert.doesNotMatch(x.text, banned, id + ' ' + x.where));
  ids.forEach(id => assert.doesNotMatch(frames[id].board, banned, id + ' board'));
});

/* ------------------------------------------------------------------ the art vocabulary */

test('scenes use only the build.md art vocabulary', () => {
  ids.forEach(id => {
    const s = frames[id].scene;
    assert.ok(s && typeof s === 'object', id + ': no scene');
    assert.deepEqual(Object.keys(s).filter(k => !['set', 'cam', 'opts', 'cast', 'fx'].includes(k)), [], id + ': scene keys');
    const set = VOCAB.sets[s.set];
    assert.ok(set, id + ': unknown set ' + s.set);
    assert.ok(set.cams.includes(s.cam), id + ': set ' + s.set + ' has no camera ' + s.cam);
    Object.keys(s.opts || {}).forEach(k => {
      const allowed = set.opts[k];
      assert.ok(allowed, id + ': set ' + s.set + ' has no option ' + k);
      if (allowed === 'count') assert.ok(Number.isInteger(s.opts[k]) && s.opts[k] >= 0 && s.opts[k] <= 12, id + ': ' + k);
      else assert.ok(allowed.includes(s.opts[k]), id + ': ' + k + '=' + s.opts[k]);
    });
    assert.ok(Array.isArray(s.cast), id + ': cast');
    const anchorsUsed = [];
    s.cast.forEach((c, i) => {
      const where = id + ' cast ' + i + ' (' + c.who + ')';
      assert.deepEqual(Object.keys(c).filter(k => !['who', 'pose', 'mood', 'at', 'facing', 'size', 'variant'].includes(k)), [], where + ': keys');
      assert.ok(ALL_WHO.includes(c.who), where + ': unknown who');
      const isCat = VOCAB.cats.includes(c.who);
      const poses = isCat ? VOCAB.catPoses : VOCAB.others[c.who];
      assert.ok(poses.includes(c.pose), where + ': pose ' + c.pose);
      if (isCat) assert.ok(VOCAB.moods.includes(c.mood), where + ': mood ' + c.mood);
      else assert.equal(c.mood, undefined, where + ': only cats have moods');
      assert.ok(set.anchors.includes(c.at), where + ': set ' + s.set + ' has no anchor ' + c.at);
      assert.ok(VOCAB.facing.includes(c.facing), where + ': facing');
      if (c.size !== undefined) assert.ok(typeof c.size === 'number' && c.size > 0.3 && c.size < 2, where + ': size');
      if (c.variant !== undefined) {
        assert.equal(c.who, 'clancat', where + ': only clancat has a variant');
        assert.ok(Number.isInteger(c.variant) && c.variant >= 1 && c.variant <= 6, where + ': variant');
      }
      anchorsUsed.push(c.at);
    });
    assert.equal(new Set(anchorsUsed).size, anchorsUsed.length, id + ': two cast members share an anchor');
    assert.ok(Array.isArray(s.fx), id + ': fx');
    s.fx.forEach(e => assert.ok(VOCAB.fx.includes(e), id + ': unknown fx ' + e));
  });
});

test('the shots vary like a graphic novel', () => {
  const pairs = new Set(ids.map(id => frames[id].scene.set + '/' + frames[id].scene.cam));
  assert.ok(pairs.size >= 25, 'only ' + pairs.size + ' set/camera pairs');
  // along any path a reader can take, never five panels in a row from the same camera
  const run = {};
  ids.forEach(id => { run[id] = run[id] || 1; });
  ids.forEach(id => exits(frames[id]).forEach(n => {
    const a = frames[id].scene, b = frames[n].scene;
    if (a.set === b.set && a.cam === b.cam) run[n] = Math.max(run[n], run[id] + 1);
  }));
  ids.forEach(id => assert.ok(run[id] < 5, id + ': ' + run[id] + ' panels in a row from the same camera'));
});

/* If the real art is loaded, cross-check against what it says it can draw. */
function list(x) {
  if (!x) return null;
  if (Array.isArray(x)) return x;
  if (typeof x === 'object') return Object.keys(x);
  return null;
}
function flat(x) {
  if (!x) return null;
  if (Array.isArray(x)) return x;
  if (typeof x === 'object') return Object.keys(x).reduce((a, k) => a.concat(Array.isArray(x[k]) ? x[k] : list(x[k]) || []), []);
  return null;
}
test('cross-check against PC.art.vocab, when the art is present', (t) => {
  try { require('../app/art/cats.js'); } catch (e) { /* not written yet */ }
  try { require('../app/art/scenes.js'); } catch (e) { /* not written yet */ }
  const v = PC.art && !PC.art.__stub && PC.art.vocab;
  if (!v) { t.skip('the art does not expose PC.art.vocab yet'); return; }
  const checked = new Set();
  const sets = v.sets || v.set;
  const who = list(v.cast || v.who || v.characters);
  // cat poses: an array, or an object with a cat list; other poses: v.otherPoses[who]
  const catPoses = Array.isArray(v.poses) ? v.poses : (v.poses && (v.poses.cat || v.poses.cats)) || null;
  const otherPoses = v.otherPoses || (v.poses && !Array.isArray(v.poses) ? v.poses : null);
  const moods = list(v.moods || v.mood);
  const fx = list(v.fx || v.effects);
  const variants = list(v.clanVariants);
  ids.forEach(id => {
    const s = frames[id].scene;
    if (sets && typeof sets === 'object' && !Array.isArray(sets)) {
      const vs = sets[s.set];
      assert.ok(vs, id + ': art has no set ' + s.set);
      const cams = list(vs.cams || vs.cameras || vs.cam);
      const anchors = list(vs.anchors || vs.at || vs.anchor);
      const opts = list(vs.opts || vs.options);
      if (cams) { assert.ok(cams.includes(s.cam), id + ': art set ' + s.set + ' has no camera ' + s.cam); checked.add('cameras'); }
      if (anchors) s.cast.forEach(c => { assert.ok(anchors.includes(c.at), id + ': art set ' + s.set + ' has no anchor ' + c.at); checked.add('anchors'); });
      if (opts) Object.keys(s.opts).forEach(k => { assert.ok(opts.includes(k), id + ': art set ' + s.set + ' has no option ' + k); checked.add('options'); });
    } else if (Array.isArray(sets)) {
      assert.ok(sets.includes(s.set), id + ': art has no set ' + s.set); checked.add('sets');
    }
    s.cast.forEach(c => {
      if (who) { assert.ok(who.includes(c.who), id + ': art has no cast member ' + c.who); checked.add('cast'); }
      const isCat = VOCAB.cats.includes(c.who);
      if (isCat && catPoses) { assert.ok(catPoses.includes(c.pose), id + ': art has no cat pose ' + c.pose); checked.add('cat poses'); }
      if (!isCat && otherPoses && otherPoses[c.who]) { assert.ok(list(otherPoses[c.who]).includes(c.pose), id + ': art has no ' + c.who + ' pose ' + c.pose); checked.add('other poses'); }
      if (moods && c.mood) { assert.ok(moods.includes(c.mood), id + ': art has no mood ' + c.mood); checked.add('moods'); }
      if (variants && c.variant !== undefined) { assert.ok(variants.includes(c.variant), id + ': art has no clancat variant ' + c.variant); checked.add('variants'); }
    });
    if (fx) s.fx.forEach(e => { assert.ok(fx.includes(e), id + ': art has no effect ' + e); checked.add('fx'); });
  });
  t.diagnostic('cross-checked against PC.art.vocab: ' + [...checked].join(', '));
  if (!checked.size) t.skip('PC.art.vocab has a shape this test does not recognize');
});

/* PC.art.render returns heads either as an array parallel to the cast (null when a head is out
 * of the panel) or keyed by who. */
function headOf(r, cast, i) {
  if (!r || !r.heads) return null;
  if (Array.isArray(r.heads)) return r.heads[i] || null;
  return r.heads[cast[i].id || cast[i].who] || null;
}
test('every frame renders through the art, and everyone in the cast is in the picture', (t) => {
  const A = PC.art;
  if (!A || !A.render || A.__stub) { t.skip('app/art/scenes.js not loaded'); return; }
  const looks = [{ sex: 'she', fur: 'ginger', marking: 'none', eyes: 'green' }, { sex: 'tom', fur: 'black', marking: 'white-paws', eyes: 'odd' }];
  const offPanel = [];
  ids.forEach(id => looks.forEach((look, k) => {
    const f = frames[id], cast = f.scene.cast;
    const r = A.render(f.scene, { look: look });
    assert.ok(r && typeof r.svg === 'string' && r.svg.indexOf('<svg') >= 0, id + ': no svg');
    (f.say || []).forEach(b => {
      const i = cast.findIndex(c => c.who === b.who);
      assert.ok(headOf(r, cast, i), id + ': speaker ' + b.who + ' has no head on the panel (anchor ' + cast[i].at + ' is out of camera ' + f.scene.cam + ')');
    });
    // the Tall One is never seen above the knee, so her head is always off the panel; garden/paws
    // is build.md's "extreme close-up of paws on grass", so a head is out of shot there by design
    // (speakers are still checked above)
    const headless = f.scene.set === 'garden' && f.scene.cam === 'paws';
    if (k === 0 && !headless) cast.forEach((c, i) => { if (c.who !== 'tallone' && !headOf(r, cast, i)) offPanel.push(id + ' ' + c.who + '@' + c.at + ' (' + f.scene.set + '/' + f.scene.cam + ')'); });
  }));
  assert.deepEqual(offPanel, [], 'cast members out of the camera’s sight');
});

/* ------------------------------------------------------------------ the beats the chapter must have */

test('the chapter’s beats are all there, in order', () => {
  const T = id => texts(frames[id]).map(x => x.text).join(' ');
  const find = (pred, label) => { const id = ids.find(pred); assert.ok(id, 'missing beat: ' + label); return id; };
  const cast = (id, who) => frames[id].scene.cast.filter(c => c.who === who);
  const beats = [];
  const beat = (label, pred) => { const id = find(pred, label); beats.push([label, id]); return id; };

  beat('the window', id => frames[id].scene.set === 'room' && cast(id, 'player').length);
  beat('Waffles reports As the Garden Turns', id => /AS THE GARDEN TURNS/i.test(T(id)) && cast(id, 'waffles').length);
  const look = beat('the reflection', id => frames[id].look);
  assert.equal(frames[look].scene.set, 'room');
  assert.equal(frames[look].scene.opts.reflection, true);
  assert.equal(cast(look, 'player')[0].at, 'glass');
  const pet = beat('the pet name', id => frames[id].input && frames[id].input.kind === 'petname');
  assert.match(T(frames[pet].input.next), /Adorable\. Utterly un-wild\./);
  beat('what did you do all day', id => frames[id].choice && frames[id].choice.options.some(o => o.sets.specialty));
  beat('the open door and the moth', id => frames[id].choice && frames[id].choice.options.some(o => o.sets.stepOut));
  beat('grass', id => /^Grass\.$/.test(T(id)));
  beat('the Tall One leaves water and the door open', id => frames[id].scene.opts.dish && cast(id, 'tallone').length && /door open a crack/.test(T(id)));
  beat('thirteen sparrows', id => frames[id].choice && frames[id].choice.options.some(o => o.sets.spokeUp !== undefined));
  beat('meeting Tallyheart', id => /I’m Tallyheart/.test(T(id)));
  beat('the hedge gap', id => frames[id].scene.cam === 'hedge' && cast(id, 'tallyheart')[0] && cast(id, 'tallyheart')[0].at === 'hedge-gap');
  beat('the camp reveal', id => frames[id].scene.cam === 'reveal');
  beat('the crowd doubts', id => /pillow cat/.test(T(id)) && frames[id].scene.cam === 'crowd' && (frames[id].say || []).length >= 3);
  beat('Glintstar', id => /This is Glintstar/.test(T(id)));
  const dignity = beat('the pet name, with tremendous dignity', id => /tremendous dignity/.test(T(id)) && (frames[id].say || []).some(b => b.who === 'glintstar' && b.text === '{petname}.'));
  const snort = frames[dignity].next;
  assert.ok(cast(snort, 'snorter').some(c => c.pose === 'fall' && c.at === 'ferns'), 'the snorter falls over in the ferns');
  beat('why join', id => frames[id].choice && frames[id].choice.options.some(o => o.sets.joinReason));
  beat('judge {them} by what {they} does', id => cast(id, 'grizzled').length && /Judge \{them\} by what \{they\} does, not by where \{they\} sleeps\./.test(T(id)));
  beat('one moon', id => (frames[id].say || []).some(b => b.who === 'glintstar' && b.text === 'One moon.'));
  beat('the Clan name', id => frames[id].input && frames[id].input.kind === 'clanname');
  beat('the naming', id => /From this night, this cat is \{name\}paw/.test(T(id)));
  beat('the purring', id => frames[id].scene.fx.includes('purr'));
  beat('the hairball', id => /hairball/.test(T(id)) && cast(id, 'waffles').length);
  beat('the Counts', id => frames[id].counts && frames[id].counts.set === 'ch01-tails');
  beat('the claw mark', id => frames[id].scene.set === 'hollow' && frames[id].scene.opts.marks === 1 && frames[id].scene.opts.glow === true);
  beat('the worry', id => frames[id].choice && frames[id].choice.options.some(o => o.sets.worry));
  beat('the Sky River', id => frames[id].scene.set === 'sky' && frames[id].scene.fx.includes('skyriver'));
  beat('the two sleepers', id => cast(id, 'snorer').length && cast(id, 'mutterer').length && frames[id].scene.fx.includes('zzz'));
  beat('the storm', id => frames[id].scene.opts.weather === 'storm' && ['rain', 'lightning'].every(e => frames[id].scene.fx.includes(e)));
  beat('Tallyheart across the doorway', id => frames[id].scene.opts.weather === 'storm' && cast(id, 'tallyheart').some(c => c.at === 'doorway'));
  beat('the crash', id => frames[id].scene.set === 'river' && frames[id].scene.opts.splash && /CRASH/.test(frames[id].sfx || ''));
  beat('still be there in the morning', id => /still be there in the morning/.test(T(id)));
  beat('the dream', id => frames[id].input && frames[id].input.kind === 'dream');
  beat('the end', id => frames[id].end);

  for (let i = 1; i < beats.length; i++) {
    assert.ok(ids.indexOf(beats[i][1]) > ids.indexOf(beats[i - 1][1]), beats[i][0] + ' comes after ' + beats[i - 1][0]);
  }
  // the end is warm: no storm, no rain, stars back
  const end = frames[ids[ids.length - 1]];
  assert.ok(!end.scene.fx.some(e => ['rain', 'lightning'].includes(e)), 'the last panel is not stormy');
  assert.notEqual(end.scene.opts.weather, 'storm');
  assert.match(end.caption.join(' '), /warm/);
});

/* ------------------------------------------------------------------ Counts and book */

test('counts: ch01-tails per build.md', () => {
  const c = story.counts['ch01-tails'];
  assert.ok(c);
  assert.equal(c.table, 1);
  assert.equal(c.thing, 'tail');
  assert.equal(c.things, 'tails');
  assert.equal(c.teacher, 'tallyheart');
  assert.deepEqual(c.facts, [[3, 1], [1, 5], [6, 1], [1, 1], [9, 1], [1, 10], [4, 1], [1, 7], [8, 1]]);
  c.facts.forEach(f => assert.ok(f[0] === 1 || f[1] === 1));
  assert.equal(c.ask, '{a} × {b}');
  assert.ok(Array.isArray(c.praise) && c.praise.length >= 3);
  assert.equal(c.praise[0], 'Ha! Easy, yes? Again.');
  assert.ok(Array.isArray(c.fast) && c.fast.includes('You didn’t even have to count that time.'));
  assert.equal(c.miss, 'There. We’ll come back to that one.');
  assert.equal(c.done, 'Tails are easy. That’s why we start with them. Tomorrow: ears.');
  // optional lines the app uses when present: helpIntro when her answer is within 1, helpIntroFar
  // otherwise; missLast when the fact will not come back; fastAfterMiss only after a miss earlier in
  // the lesson; firstPrompt over the picture on the lesson's first question
  ['helpIntro', 'helpIntroFar', 'missLast', 'firstPrompt'].forEach(k => {
    assert.ok(typeof c[k] === 'string' && c[k].trim(), k + ' is a line');
  });
  assert.ok(Array.isArray(c.fastAfterMiss) && c.fastAfterMiss.length >= 1, 'fastAfterMiss is a list');
  c.fast.forEach(l => assert.doesNotMatch(l, /sand/, 'a fast line with no miss before it has no sand to mention: ' + l));
  assert.equal(c.firstPrompt, 'How many tails on those three?');
  const lines = c.praise.concat(c.fast, c.fastAfterMiss, [c.miss, c.missLast, c.done, c.helpIntro, c.helpIntroFar, c.firstPrompt]);
  lines.forEach(l => {
    assert.deepEqual(tokensIn(l), [], 'no tokens in Counts lines: ' + l);
    assert.deepEqual(badGrammar(l), [], l);
    assert.ok(words(l) <= 15, 'short: ' + l);
  });
});

function recapFor(flags) {
  return story.book.recap.filter(r => !r.when || Object.keys(r.when).every(k => {
    const want = r.when[k];
    return Array.isArray(want) ? want.includes(flags[k]) : flags[k] === want;
  }));
}
function* everyPath() {
  for (const specialty of FLAGS.specialty) for (const stepOut of FLAGS.stepOut) for (const spokeUp of FLAGS.spokeUp)
    for (const joinReason of FLAGS.joinReason) for (const worry of FLAGS.worry) yield { specialty, stepOut, spokeUp, joinReason, worry };
}

test('book: title, chapter title, and a 6–10 sentence recap for every path', () => {
  const b = story.book;
  assert.equal(b.title, '{name}paw’s First Moon');
  assert.equal(b.chapterTitle, 'Through the Glass');
  assert.equal(tokensIn(b.dream).filter(t => t === 'dream').length, 1, 'the dream line carries what she typed, once');
  assert.ok(Array.isArray(b.recap));
  b.recap.forEach((r, i) => {
    assert.ok(typeof r.text === 'string' && r.text.trim(), 'recap ' + i);
    if (r.when) Object.keys(r.when).forEach(k => {
      assert.ok(FLAGS[k], 'recap ' + i + ': unknown flag ' + k);
      [].concat(r.when[k]).forEach(v => assert.ok(FLAGS[k].includes(v), 'recap ' + i + ': ' + k + '=' + v));
    });
    assert.match(r.text, /[.!?”]$/, 'recap ' + i + ' is a whole sentence');
    assert.ok(words(r.text) <= 30, 'recap ' + i + ' is short');
  });
  // each flag value has exactly one sentence of its own
  Object.keys(FLAGS).forEach(k => FLAGS[k].forEach(v => {
    const n = b.recap.filter(r => r.when && [].concat(r.when[k]).includes(v)).length;
    assert.equal(n, 1, 'recap sentences for ' + k + '=' + v);
  }));
  let paths = 0;
  for (const flags of everyPath()) {
    const r = recapFor(flags);
    assert.ok(r.length >= 6 && r.length <= 10, JSON.stringify(flags) + ': ' + r.length + ' sentences');
    paths++;
  }
  assert.equal(paths, 240);
  // the recap tells it in the past tense, third person
  b.recap.forEach(r => assert.doesNotMatch(r.text, /\byou\b/i, 'recap is third person: ' + r.text));
});

/* ------------------------------------------------------------------ the engine, when present */

test('engine agrees: checkStory is clean and fill renders the same text', (t) => {
  let E;
  try { E = require('../app/engine.js').engine; } catch (e) { E = null; }
  if (!E) { t.skip('app/engine.js not written yet'); return; }
  if (E.checkStory) assert.deepEqual(E.checkStory(story), []);
  if (!E.fill || !E.blankCat) { t.skip('engine has no fill/blankCat'); return; }
  Object.keys(PROFILES).forEach(kind => {
    const p = PROFILES[kind];
    const cat = E.blankCat({});
    cat.name = p.name; cat.petname = p.petname; cat.look.sex = kind === 'tom' ? 'tom' : 'she'; cat.dream = p.dream;
    everyText((id, x) => assert.equal(E.fill(x.text, cat), fill(x.text, p), kind + ' ' + id + ' ' + x.where));
  });
  if (E.buildBook) {
    const cat = E.blankCat({});
    cat.name = 'Fern'; cat.petname = 'Biscuit'; cat.look.sex = 'she';
    cat.flags = { specialty: 'climbing', stepOut: 'slow', spokeUp: false, joinReason: 'brave', worry: 'shiny' };
    const book = E.buildBook(story, cat);
    assert.equal(book.recap.length, recapFor(cat.flags).length);
    assert.ok(book.recap.some(s => /Tallyheart sniffed her out anyway/.test(s)), 'the quiet path is in the book');
  }
});
