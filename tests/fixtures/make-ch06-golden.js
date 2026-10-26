/* Records tests/fixtures/ch06-golden.json: chapters 1 to 6 read through the engine, the art and the
 * page's pure words as they were when chapter 6 shipped (0.6.0, commit 6f45bb6), before chapter 7's
 * build touched anything. Run once, in a process of its own, against a copy of that tree:
 *
 *   GOLDEN_ROOT=/a/copy/of/the/chapter-6/tree node tests/fixtures/make-ch06-golden.js
 *
 * (the copy holds app/, index.html and tests/_load.js: chapter 7's spec, section 10). tests/engine.test.js
 * reads the same scripts through today's tree and compares the digests, so chapters 1 to 6 play and
 * render exactly as they did for every live save (no save holds `ch7Flew`): every frame and what it
 * shows (the scene with her options filled in and a hash of the art's drawing of it, the captions and
 * what Read to me says of them, the balloons with their speakers' labels and voices, the options and
 * their labels, the card under the panel and its drawing, the pages she taps, whether her file's button
 * is there and wiggles, her whole Case File and the drawing of every card in it), every skip-count tap
 * by tap (its view, its picture and the drawing of it, its words), every question (its picture as asked,
 * lit step by step and after a right answer, each drawn; its words; its result and line; the whole help,
 * hop by hop, and the drawing at every hop), the Training Hollow and its lines, her book with its
 * dragonets, the grown-ups corner's words for her flags, and the cat at the end with her cards.
 *
 * The one piece of card data chapter 7 changes is the condition on chapter 4's `fox-flew` link (it reads
 * `ch7Flew` too: spec section 1). So wherever a card is recorded (E.cards, E.caseFile), its `link` is
 * digested as { with, line, drawn } (drawn: E.matches(link.when, cat)), the raw `when` dropped, both when
 * recording and in the test. The drawings are hashed with the per-render ids stripped
 * (`svg.replace(/pcs?[0-9a-z]+-/g, '')`, as tests/scenes.test.js does: the ids carry a counter of every
 * render in the process; and the Counts pictures' own counted ids renamed in order: `strip`) and memoized
 * by what was drawn, so each drawing is made once per process.
 *
 * The scripts cover every specialty and worry, told and kept, both chapter 2 paths, the roof and "Not
 * today" in chapters 4 and 5, Puddle, Wisp and Sleet found and not, misses of every kind (one off, ten
 * off, three off, everything wrong, answer by answer), slow and quick, a tom with his own names, and a
 * noticing cat who catches FLEW, rereads chapter 1 as a climber, then reads chapters 4 and 5 again.
 *
 *   node tests/fixtures/make-ch06-golden.js --diff DIR   writes the whole of each run as today's tree plays
 *   it to DIR/now-N.json (with GOLDEN_ROOT: as that tree plays it, to DIR/then-N.json), to diff.
 *
 * Re-recorded 2026-10-25 for the depth hotfix (Charlie's bug, chapter 8 f030: a cat further back was
 * drawn over a nearer cat's face). The copy of the chapter-6 tree had ch06 f004, f107 and f109's cast
 * lists put back to front (the cat at `crowd-2` first), as the live tree has them; nothing else. Only
 * those three frames' `shown` digests and `recorded` moved. Record again the same way.
 * Not a test file.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { clone, canon, hash } = require('./golden.js');

const SPEC = { noticing: 0, sneaking: 1, climbing: 2, swimming: 3, friends: 4 }, WORRY = { small: 0, water: 1, talk: 2, shiny: 3 };
/* The choices that route a reading, by frame ("chapter:frame": her pick among the options she sees);
 * every other choice takes the script's `choiceIndex`. Chapter 5: the roof offered again (f021, for a
 * cat who has not met Squall), the raft (f057: lean over after the Roar, or look up), the witness first
 * (f066), the slip (f121: ask Riffle, or "Puddles. Fine."), keeping still for Wisp (f098, f100a, f101a);
 * chapter 6: the fox trail to Sleet (f048), the fair question (f034). */
function who(o) {
  const p = { 'ch01:f014': SPEC[o.spec], 'ch01:f066': WORRY[o.worry], 'ch02:f084': o.path === 'river' ? 1 : 0, 'ch03:f086': o.told ? 0 : 1, 'ch04:f075': o.roof4 ? 0 : 1,
    'ch05:f021': o.roof5 ? 0 : 1, 'ch05:f057': o.raft === 'lean' ? 0 : 1, 'ch05:f066': o.first === 'heron' ? 1 : 0, 'ch05:f121': o.raft === 'ask' ? 0 : 1,
    'ch06:f048': o.sleet ? 0 : 1, 'ch06:f034': o.unfair ? 0 : 1 };
  ['ch05:f098', 'ch05:f100a', 'ch05:f101a'].forEach((id, i) => { p[id] = i < (o.wait || 0) ? 0 : 1; });
  return Object.assign(p, o.more || {});
}
const CH = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06'];
const all = (x) => { const o = {}; CH.forEach(c => { o[c] = Object.assign({}, x); }); return o; };
const SCRIPTS6 = [
  Object.assign({ name: 'clean: noticing, small, bridge, told; up to the roof in chapter 4; Puddle under the raft, Wisp for keeping still, the otters first, Sleet at the last post',
    pick: who({ spec: 'noticing', worry: 'small', path: 'bridge', told: true, roof4: true, raft: 'lean', wait: 3, sleet: true }) }, all({ ms: 2000 })),
  Object.assign({ name: 'clean, every second option: sneaking, water, river, kept; not today in chapter 4, up in chapter 5; looks up and lets Riffle keep his secret, the heron first, no Wisp, no Sleet', choiceIndex: 1,
    pick: who({ spec: 'sneaking', worry: 'water', path: 'river', told: false, roof5: true, raft: 'fine', first: 'heron', wait: 0, sleet: false }) }, all({ ms: 3500 })),
  Object.assign({ name: 'a climber who told and climbs nowhere: not today twice; Puddle after the slip, Wisp lost after two keeps-still, Sleet, the unfair question first; misses in every chapter (one off)',
    pick: who({ spec: 'climbing', worry: 'talk', path: 'bridge', told: true, raft: 'ask', wait: 2, sleet: true, unfair: true, more: { 'ch04:f064': 1 } }) }, all({ ms: 2000 }),
  { ch02: { ms: 2000, miss: ['2x6'] }, ch03: { ms: 2000, miss: ['5x8', '7x5'] },
    ch04: { ms: 2000, miss: ['3x5', '2x5', '4x10', '6x10', '10x9', '10x10', '3x10', '2x10', '7x5', '4x10'] },
    ch05: { ms: 2000, miss: ['3x10', '10x7', '9x10', '4x9', '9x8', '7x2', '4x5', '4x10'] },
    ch06: { ms: 2000, miss: ['3x10', '7x9', '4x3', '3x5', '7x3', '3x8', '3x3', '3x6'] } }),
  Object.assign({ name: 'a swimmer who fears the water, kept, river, up in chapter 4: misses that land on a zero (ten off); Puddle under the raft, Wisp, no Sleet', choiceIndex: 1,
    pick: who({ spec: 'swimming', worry: 'water', path: 'river', told: false, roof4: true, raft: 'lean', wait: 3, sleet: false }) }, all({ ms: 2500 }),
  { ch03: { ms: 2500, wrongBy: 5, miss: ['5x2', '9x5'] }, ch04: { ms: 2500, wrongBy: 10, miss: ['5x7', '10x2', '5x10', '10x8', '7x10', '3x10', '4x10'] },
    ch05: { ms: 2500, wrongBy: 10, miss: ['5x10', '2x9', '9x6', '7x9', '9x2', '4x10'] }, ch06: { ms: 2500, wrongBy: 10, miss: ['3x10', '3x9', '1x3', '6x3', '3x7', '7x3'] } }),
  Object.assign({ name: 'every answer wrong: friends, shiny, bridge, kept; not today in chapter 4, up in chapter 5; no Puddle, Wisp, Sleet',
    pick: who({ spec: 'friends', worry: 'shiny', path: 'bridge', told: false, roof5: true, raft: 'fine', wait: 3, sleet: true }) }, all({ allWrong: true })),
  Object.assign({ name: 'a tom, his own names (his Clan name Murmur), noticing and kept, river, up in chapter 4; the heron first; misses everywhere, slow under the long prompts', look: { sex: 'tom', fur: 'black', marking: 'back-stripe', eyes: 'blue' },
    petname: 'SNICKERDOODLE', clanname: 'Murmur', dream: '', choiceIndex: 1,
    pick: who({ spec: 'noticing', worry: 'talk', path: 'river', told: false, roof4: true, raft: 'ask', first: 'heron', wait: 1, sleet: true, more: { 'ch04:f064': 0 } }) },
  { ch01: { miss: ['1x7', '6x1'], ms: 2500 }, ch02: { miss: ['1x4', '2x5', '10x2', '8x2'], ms: 2500 }, ch03: { miss: ['2x3', '7x2', '5x5', '9x5', '2x5', '6x5'], ms: 4500, msFor: { '4x5': 2000 } },
    ch04: { miss: ['5x7', '4x10', '1x10', '10x3', '2x10', '7x5'], ms: 4500, msFor: { '4x10': 2000, '6x10': 2000 } },
    ch05: { miss: ['10x7', '2x9', '9x1', '3x9', '5x9', '9x9', '9x2', '7x1'], ms: 4500, msFor: { '5x10': 2000 } },
    ch06: { miss: ['7x9', '4x3', '1x3', '3x2', '7x3', '3x4', '8x3', '3x6'], ms: 4500, msFor: { '3x3': 2000 } } }),
  Object.assign({ name: 'answer by answer: retries and borrowed questions missed, at the warm-ups, the piles, the nines, the threes and the river’s questions', pick: who({ spec: 'climbing', worry: 'small', path: 'river', told: true, roof4: true, raft: 'lean', wait: 3, sleet: true }) },
    all({ ms: 2000 }), { ch04: { ms: 2000, plan: { 'ch04-claws': [0, 1, 0, 1, 1, 0, 1, 1, 1, 1], 'ch04-pile': [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1], 'ch04-tens': [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1] } },
      ch05: { ms: 2000, plan: { 'ch05-pile': [0, 0, 1, 0, 1, 1], 'ch05-tens': [0, 1, 0, 0, 1, 1, 1], 'ch05-nines': [1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1], 'ch05-otter': [0, 0, 1, 1, 1], 'ch05-catch': [0, 1, 0, 1, 1, 1] } },
      ch06: { ms: 2000, plan: { 'ch06-pile': [0, 1, 0, 1, 1], 'ch06-nines': [0, 0, 1, 1, 0, 1, 1], 'ch06-threes': [1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1], 'ch06-guards': [0, 0, 1, 1, 1, 1] } } }),
  Object.assign({ name: 'slow but right everywhere (so every Count has hard facts): sneaking, shiny, bridge, told; not today twice; no Puddle, no Wisp, Sleet',
    pick: who({ spec: 'sneaking', worry: 'shiny', path: 'bridge', told: true, raft: 'fine', wait: 0, sleet: true }) }, all({ ms: 6500 })),
  Object.assign({ name: 'friends, water, river, told, up in chapter 4: misses that end in neither a zero nor a five (three off), and retries missed too', choiceIndex: 1,
    pick: who({ spec: 'friends', worry: 'water', path: 'river', told: true, roof4: true, raft: 'ask', wait: 3, sleet: false, unfair: true }) }, all({ ms: 3000 }),
  { ch02: { ms: 3000, miss: ['2x8'] }, ch03: { ms: 3000, miss: ['10x5'] }, ch04: { ms: 3000, wrongBy: 3, miss: ['3x5', '10x3', '3x10', '4x10'], plan: { 'ch04-riddle': [0, 1, 1, 0, 1, 1, 1] } },
    ch05: { ms: 3000, wrongBy: 3, miss: ['10x7', '4x9', '7x9', '4x5', '7x1'], plan: { 'ch05-puddle': [0, 0, 1, 1, 1, 1] } }, ch06: { ms: 3000, wrongBy: 3, miss: ['3x3', '3x8', '3x7', '7x3'], plan: { 'ch06-four': [0, 0, 1, 1, 1] } } }),
  Object.assign({ name: 'a noticing cat who catches FLEW (water, bridge, told; not today twice; Puddle, Wisp, no Sleet), then rereads chapter 1 as a climber and reads chapters 4 and 5 again, up to the roof this time',
    pick: who({ spec: 'noticing', worry: 'water', path: 'bridge', told: true, raft: 'lean', wait: 3, sleet: false }) }, all({ ms: 2000 }), { ch04: { ms: 3500, miss: ['10x10'] } },
  { reread: [{ chapter: 'ch01', pick: { 'ch01:f014': SPEC.climbing } }, { chapter: 'ch04', pick: { 'ch04:f075': 0 }, cfg: { ms: 2000, miss: ['3x5'] } }, { chapter: 'ch05', cfg: { ms: 2000 } }] })
];

/* ------------------------------------------------------------------ the drawings */
/* A drawing with its per-render ids taken out: the scenes' `pcs…-` prefixes as tests/scenes.test.js strips
 * them, and then every other id the drawing defines that carries the art's counter (the Counts pictures'
 * `pcfp…`, `pcwp…`, `pcboard_…`: a prefix and the counter) renamed in the order it is defined. */
const strip = (svg) => {
  let s = String(svg == null ? '' : svg).replace(/pcs?[0-9a-z]+-/g, '');
  const ids = [];
  s.replace(/\bid="(pc[^"]*)"/g, (m, id) => { if (!ids.includes(id)) ids.push(id); return m; });
  ids.forEach((id, i) => { s = s.replace(new RegExp('(?<![\\w-])' + id.replace(/[^\w-]/g, '\\$&') + '(?![\\w-])', 'g'), '@' + i); });
  return s;
};
function drawer(A) {
  const memo = new Map(), fns = new Map();
  const make = (fn) => {
    let r;
    try { r = fn(); } catch (e) { r = { error: String(e && e.message) }; }
    return r && r.error ? 'error: ' + r.error : hash(typeof r === 'string' ? strip(r) : { svg: strip(r && r.svg), heads: r && r.heads, keep: r && r.keep });
  };
  const once = (kind, arg, fn) => {
    const key = kind + ' ' + canon(arg);
    if (!memo.has(key)) { memo.set(key, make(fn)); fns.set(key, fn); }
    return memo.get(key);
  };
  return {
    memo,
    // every drawing made again, with the art's counter far along: the keys whose hash moved (none, or the strip misses an id)
    recheck: () => [...fns.keys()].filter(k => make(fns.get(k)) !== memo.get(k)),
    scene: (scene, look) => (scene ? once('scene', { scene, look }, () => A.render(scene, { look })) : null),
    counts: (po, look) => once('counts', Object.assign({}, po, { look }), () => A.countsPicture(Object.assign({}, po, { look }))),
    sand: (o) => once('sand', o, () => A.sand(o)),
    card: (o) => once('card', o, () => A.card(o))
  };
}

/* ------------------------------------------------------------------ what she sees */
/* A card's link as it draws: { with, line, drawn }, never its raw `when` (chapter 7 changes that alone). */
function linkDigest(E, link, cat) {
  if (!link || typeof link !== 'object') return link == null ? null : link;
  return { with: Array.isArray(link.with) ? link.with.slice() : undefined, line: link.line, drawn: E.matches(link.when, cat) };
}
function cardsDigest(E, cards, cat) { return (cards || []).map(c => Object.assign({}, c, { link: linkDigest(E, c.link, cat) })); }
function fileDigest(E, file, cat) {
  const F = clone(Object.assign({}, file, { groups: [], links: [] }));
  F.groups = file.groups.map(g => Object.assign({}, g, { cards: cardsDigest(E, g.cards, cat) }));
  F.links = file.links.map(L => Object.assign({}, L, { cards: cardsDigest(E, L.cards, cat) }));
  return clone(F);
}
/* Everything one frame shows her, as plain data (the drawings as hashes). */
function frameRecord(ctx, story, id, cat) {
  const { E, UI, draw, list } = ctx, f = story.frames[id], look = clone(cat.look), fill = (t) => E.fill(t == null ? '' : t, cat);
  const kept = E.keptSkip(story, id, cat), into = E.skipInto(story, id, cat);
  const sc = f.scene ? E.resolveScene(f.scene, cat, list) : null;
  const cast = (f.scene && f.scene.cast) || [];
  const rec = {
    id, kind: E.kindOf(f), scene: sc, art: draw.scene(sc, look),
    caps: E.captions(f, cat).map(fill), read: E.captionsRead(f, cat).map(fill),
    say: E.balloons(f, cat).map(b => {
      const out = Object.assign({}, b, { text: fill(b.text || '') });
      if (UI) {
        const mine = cast.filter(c => c && c.who === b.who), m = mine[b.nth] || mine[0], bv = Object.assign({}, b, { variant: b.variant || (m && m.variant) });
        out.label = UI.speakers.label(bv, { cat, story, fill });
        out.voice = [UI.speakers.pitch(b.who, bv.variant), UI.speakers.rate(b.who)];
        out.faceHidden = UI.speakers.faceHidden(b, m || {});
      }
      return out;
    }),
    sfx: f.sfx ? fill(f.sfx) : '', gift: f.gift || null, kept: kept ? kept.id : null,
    into: into ? E.skipView(into, 0).groups * E.skipView(into, 0).table : null,
    back: E.canBack(cat), status: E.status(cat, list),
    cards: E.cardsOn(f, cat, story, list).map(c => Object.assign({}, c, { line: fill(c.line), art: draw.card({ picture: c.picture, mark: c.showMark === false ? null : c.mark, big: false, look }) })),
    hasFile: E.hasFile(cat), wiggles: E.fileWiggles(cat, story, id)
  };
  const file = E.caseFile(cat, list);
  rec.file = fileDigest(E, file, cat);
  rec.fileArt = file.groups.concat(file.links).reduce((a, g) => a.concat(g.cards), []).map(c => draw.card({ picture: c.picture, mark: c.mark, big: false, look }));
  if (kept) { const po = E.keptPicture(kept.skip); rec.keptPic = po; rec.keptArt = draw.counts(po, look); }
  if (f.choice) rec.options = [f.choice.prompt ? fill(f.choice.prompt) : null].concat(E.options(f, cat).map(o => [o.index, fill(E.optionLabel(o.option, cat))]));
  if (f.skip) {
    const sk = E.skipFor(f.skip, cat), first = E.balloons(f, cat)[0];
    rec.skip = { skip: sk, words: E.skipWords(sk, first && first.who), taps: [] };
    for (let n = 0; n <= E.skipView(sk, 0).groups; n++) {
      const t = { view: E.skipView(sk, n) };
      if (E.skipOnScene(sk)) { const s2 = E.skipScene(sc, sk, n, f.sfx ? fill(f.sfx) : ''); t.scene = s2; t.art = draw.scene(s2.scene, look); }
      else { t.pic = E.skipPicture(sk, n); t.art = draw.counts(t.pic, look); }
      rec.skip.taps.push(t);
    }
  }
  if (f.ask) {
    rec.ask = { words: E.askWords(f.ask), taps: [] };
    for (let n = 0; n <= E.askView(f.ask, 99).total; n++) { const s2 = E.askScene(sc, f.ask, n); rec.ask.taps.push({ view: E.askView(f.ask, n), art: draw.scene(s2, look) }); }
  }
  if (f.scratch || f.file) rec.tap = E.tapWords(f);
  if (f.scratch) rec.pieces = E.scratchPieces(f, cat, story, list);
  return clone(rec);
}

/* ------------------------------------------------------------------ the lessons */
function answerFor(q, s) {
  const by = s.wrongBy || 1;
  if (s.allWrong) return q.answer + by;
  return (s.miss || []).includes(q.a + 'x' + q.b) && !q.retry && !q.filler ? q.answer + by : q.answer;
}
const msFor = (q, s) => { const k = q.a + 'x' + q.b; return s.msFor && s.msFor[k] != null ? s.msFor[k] : (s.ms || 3000); };
/* One lesson, answer by answer, as the page asks it: every question's words and pictures (each drawn),
 * its result, and after a miss the whole help, hop by hop, drawn at every hop. */
function lesson(ctx, cat, story, def, st, s, clock) {
  const { E, draw, list } = ctx, look = clone(cat.look), fill = (t) => E.fill(t == null ? '' : t, cat);
  const rows = [], plan = s.plan && def && s.plan[def.id] ? s.plan[def.id].slice() : null;
  let rec = null;
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), D = E.questionDef(def, q, story, list);
    const asked = E.lessonPicture(D, q, q.lit || 0), light = E.lightSteps(D, q);
    const row = { q: clone(q), as: D.id || null, teacher: E.teacherOf(def, D), ask: E.counts.ask(def, q), generic: E.genericQuestion(D, q),
      prompt: E.promptLines(def, D, q).map(l => Object.assign({}, l, { text: fill(l.text) })),
      asked, askedArt: draw.counts(asked, look), light: clone({ open: light.open, steps: light }),
      lightArt: (light.open ? [light.open] : []).concat(light.map(x => x.picture)).map(p => draw.counts(p, look)) };
    const ok = plan && plan.length ? plan.shift() : null;
    const value = ok == null ? answerFor(q, s) : ok ? q.answer : q.answer + (s.wrongBy || 1);
    const res = E.counts.answer(st, D, value, msFor(q, s), (clock.t += 1000));
    E.logAnswer(cat, res.entry);
    row.res = clone({ correct: res.correct, right: res.right, fast: res.fast, line: res.line, lineKind: res.lineKind, near: res.near, notFive: res.notFive, notTen: res.notTen,
      requeued: res.requeued, done: res.done, balloons: res.balloons, help: res.help, rightPicture: res.rightPicture, shows: res.shows, entry: res.entry });
    row.line = fill(res.line);
    row.balloons = (res.balloons || []).map(b => Object.assign({}, b, { text: fill(b.text) }));
    if (res.correct) {
      const R = res.rightPicture;
      const pic = R ? E.lessonPicture(D, q, (typeof R.groups === 'number' ? R.groups : q.groups) * (typeof R.per === 'number' ? R.per : q.per), R) : E.lessonPicture(D, q, q.groups * q.per);
      row.right = pic; row.rightArt = draw.counts(pic, look);
    } else {
      const hp = E.helpPlan(def, D, q, res), steps = E.helpSteps(hp);
      row.plan = clone(Object.assign({}, hp, { intro: fill(hp.intro), line: fill(hp.line) }));
      row.ground = E.helpGround(def, D, q);
      row.steps = clone(steps);
      // the drawing at every hop, as the page draws it: the set's own picture lit, or the scratches
      row.helpArt = [{ counted: 0 }].concat(steps).map(x => (hp.picture ? draw.counts(E.lessonPicture(D, q, x.counted), look) : draw.sand(E.sandOpts(hp, x.counted, x.rubbed))));
      if (res.shows) row.showsArt = draw.sand(E.answersOpts(hp, res.shows));
    }
    if (res.done) rec = E.recordLesson(cat, st);
    else if (st.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: st };
    else cat.lesson = { mode: st.mode, state: st };
    rows.push(clone(row));
  }
  return { rows, rec };
}

/* ------------------------------------------------------------------ one reading */
function readChapter(ctx, cat, story, script, cfg, pick, clock, out) {
  const { E } = ctx;
  const reading = { chapter: story.id, frames: [], shown: [], picked: [], lessons: {} };
  E.startChapter(cat, story, (clock.t += 1000));
  for (let guard = 0; guard < 600; guard++) {
    const id = E.frameId(cat, story), f = story.frames[id], kind = E.kindOf(f), t = (clock.t += 1000);
    reading.frames.push(id);
    const rec = frameRecord(ctx, story, id, cat);
    reading.shown.push(ctx.full ? rec : hash(rec));
    if (ctx.onFrame) ctx.onFrame(cat, story, id);
    if (kind === 'end') break;
    if (kind === 'next' || kind === 'skip' || kind === 'file' || kind === 'ask') E.next(cat, story, t);
    else if (kind === 'scratch') { for (let n = 0; n < 12 && E.scratchTap(cat, story, t); n++); E.next(cat, story, t); }
    else if (kind === 'look') E.confirmLook(cat, story, script.look || { sex: 'she', fur: 'calico', marking: 'white-paws', eyes: 'odd' }, t);
    else if (kind === 'choice') {
      const opts = E.options(f, cat), want = pick[story.id + ':' + id], i = (want != null ? want : (script.choiceIndex || 0)) % opts.length;
      reading.picked.push(id + ':' + i);
      E.choose(cat, story, opts[i].index, t);
    } else if (kind === 'input') {
      const k = f.input.kind;
      const v = k === 'petname' ? (script.petname != null ? script.petname : 'princess sparkle muffin') : k === 'clanname' ? (script.clanname != null ? script.clanname : 'moonpaw')
        : k === 'dream' ? (script.dream != null ? script.dream : 'i dreamed about otters') : '';
      E.submitInput(cat, story, v, t);
    } else if (kind === 'counts') {
      const r = E.chapterLesson(cat, story, f.counts.set, t, ctx.list);
      E.beginLesson(cat, story, id, r.state);
      const L = lesson(ctx, cat, story, r.def, r.state, cfg, clock);
      reading.lessons[f.counts.set] = (reading.lessons[f.counts.set] || []).concat(L.rows);
      E.finishCounts(cat, story, L.rec ? L.rec.summary : E.counts.summary(r.state), (clock.t += 1000));
    } else throw new Error('unknown frame kind at ' + story.id + ' ' + id);
  }
  out.push(reading);
  return reading;
}
function catSummary(E, cat, list) {
  return clone({ name: cat.name, petname: cat.petname, look: cat.look, flags: cat.flags, choices: cat.choices, finished: Object.keys(cat.finished), dreams: cat.dreams, lessons: cat.lessons,
    counts: cat.counts, nest: cat.nest, hollow: cat.hollow, chapter: cat.chapter, frame: cat.frame, history: cat.history, cards: cat.cards, places: cat.places, status: E.status(cat, list) });
}
/* A whole script: chapters 1 to 6 in order, then its rereads, then a Training Hollow round of every Count
 * she has learned (a miss on its first question), her book, the grown-ups corner's words, the cat.
 * She reads the chapters in `ctx.read` (unset: `ctx.list`, chapters 1 to 6); the engine is handed
 * `ctx.list` everywhere else, so a second pass can hand it every story loaded, as the page does
 * (`PC.story`: ui.js, `stories()`), while she still reads chapters 1 to 6 (tests/engine.test.js). */
function run6(ctx, script) {
  const { E, UI, draw, list } = ctx, read = ctx.read || list, clock = { t: 1000 }, readings = [];
  const cat = E.blankCat({ now: 1, id: 'golden6' });
  read.forEach(story => readChapter(ctx, cat, story, script, script[story.id] || {}, script.pick || {}, clock, readings));
  (script.reread || []).forEach(r => {
    const story = read.find(s => s.id === r.chapter);
    readChapter(ctx, cat, story, script, r.cfg || script[story.id] || {}, Object.assign({}, script.pick || {}, r.pick || {}), clock, readings);
  });
  const hollow = [];
  E.learnedCounts(cat, list).forEach(c => {
    const r = E.hollowStart(cat, list, (clock.t += 1000), c.table);
    E.holdLesson(cat);
    cat.lesson = { mode: 'hollow', state: r.state };
    const q0 = E.counts.question(r.state);
    const L = lesson(ctx, cat, null, r.def, r.state, { miss: [q0.a + 'x' + q0.b], ms: 2500 }, clock);
    const h = E.hollowLines(cat, list), again = E.hollowLines(cat, list, { reward: true });
    hollow.push({ table: c.table, setId: c.setId, queue: clone(r.state.queue.map(q => [q.a, q.b, !!q.hard, !!q.retry, !!q.filler])), rows: L.rows, awarded: L.rec && L.rec.hollow && L.rec.hollow.awarded && L.rec.hollow.awarded.id,
      says: clone({ greet: h.greet, again: again.greet, glow: h.glow, buttons: h.counts.map(x => x.name), round: E.hollowRoundLine(r.def), glowNote: E.hollowGlowNote(r.def, true), glowNoteOne: E.hollowGlowNote(r.def, false), done: r.def.done }) });
  });
  const b = E.buildFullBook(cat, list);
  const book = clone({ title: b.title, pages: b.pages, teaser: b.teaser, dragonets: b.dragonets });
  const corner = UI ? Object.keys(cat.flags).sort().map(k => [k, UI.flagWords[k] ? E.fill(UI.flagWords[k][String(cat.flags[k])] || '', cat) : null, !!UI.quietFlags[k]]) : null;
  const extra = clone({ all: cardsDigest(E, E.cards(cat, list, { all: true }), cat), file: fileDigest(E, E.caseFile(cat, list), cat),
    learned: E.learnedCounts(cat, list).map(c => [c.table, c.setId]), tables: E.factTables(cat, list), hasFile: E.hasFile(cat) });
  return { name: script.name, readings, hollow, book, corner, extra, cat: catSummary(E, cat, list), end: cat };
}

/* ------------------------------------------------------------------ small */
const tag = (q) => (q.retry ? 'retry' : q.filler ? 'filler' : q.hard ? 'hard' : 'ask');
const rowsOf = (rows) => rows.map(r => [r.q.a + ' × ' + r.q.b, tag(r.q), r.as, r.res.correct ? 1 : 0, r.res.lineKind, r.line, hash(r)]);
/* A run, small: each reading's frames in order with a hash of what each shows; every answer as
 * [a × b, what kind of ask, the set it is asked as, right?, the kind of line, the line, a hash of the
 * whole row]; the Hollow rounds the same way; the rest as hashes beside the flags. */
function compact6(run) {
  return clone({
    readings: run.readings.map(r => ({ chapter: r.chapter, frames: r.frames, picked: r.picked, shown: r.shown.map(x => (typeof x === 'string' ? x : hash(x))).join(' '),
      lessons: Object.keys(r.lessons).map(k => [k, rowsOf(r.lessons[k])]) })),
    hollow: run.hollow.map(h => ({ table: h.table, setId: h.setId, queue: h.queue.map(x => x[0] + '×' + x[1] + (x[2] ? ' hard' : '') + (x[3] ? ' retry' : '') + (x[4] ? ' filler' : '')).join(', '),
      rows: rowsOf(h.rows), awarded: h.awarded, says: hash(h.says) })),
    book: hash(run.book), corner: hash(run.corner), extra: hash(run.extra), cat: hash(run.cat), flags: run.cat.flags, status: run.cat.status
  });
}
/* The tree's engine, art, stories and the page's pure words (ui.js), loaded as the page loads them. */
function treeAt(root) {
  const PC = require(path.join(root, 'tests/_load.js')).load();
  require(path.join(root, 'app/ui.js'));
  return PC;
}
function context(PC, opts) {
  const E = PC.engine, list = CH.map(id => PC.story[id]);
  return Object.assign({ E, UI: PC.ui || null, A: PC.art, draw: drawer(PC.art), list }, opts || {});
}
function runs6(PC, opts) {
  const ctx = context(PC, opts);
  return SCRIPTS6.map(s => run6(ctx, s));
}

if (require.main === module) {
  const root = process.env.GOLDEN_ROOT ? path.resolve(process.env.GOLDEN_ROOT) : path.join(__dirname, '..', '..');
  const PC = treeAt(root), E = PC.engine;
  const old = /^0\.6\.0 /.test(E.VERSION);
  // the drawings are the same however many came before them (the ids stripped)
  const sc0 = E.resolveScene(PC.story.ch04.frames.f066.scene, E.blankCat({ now: 1 }), CH.map(id => PC.story[id]));
  if (strip(PC.art.render(sc0, { look: E.defaultLook(0) }).svg) !== strip(PC.art.render(sc0, { look: E.defaultLook(0) }).svg)) throw new Error('a drawing differs from itself with its ids stripped');
  const at = process.argv.indexOf('--diff');
  if (at >= 0) {
    const dir = path.resolve(process.argv[at + 1] || '.');
    fs.mkdirSync(dir, { recursive: true });
    runs6(PC, { full: true }).forEach((r, i) => { delete r.end; fs.writeFileSync(path.join(dir, (old ? 'then-' : 'now-') + i + '.json'), JSON.stringify(r, null, 1)); });
    console.log('wrote ' + SCRIPTS6.length + ' runs (' + E.VERSION + ') to ' + dir);
  } else {
    if (!old) { console.error('This tree is not chapter 6’s (0.6.0): record with GOLDEN_ROOT set to a copy of the chapter-6 tree (see the top of this file).'); process.exit(1); }
    const t0 = Date.now(), ctx = context(PC), full = SCRIPTS6.map(s => run6(ctx, s));
    const moved = ctx.draw.recheck();
    if (moved.length) { console.error(moved.length + ' drawings hash differently a second time (an id the strip misses), e.g. ' + moved[0].slice(0, 200)); process.exit(1); }
    console.log('every one of ' + ctx.draw.memo.size + ' drawings hashes the same when drawn again');
    const out = { engine: E.VERSION, recorded: new Date().toISOString().slice(0, 10), runs: full.map(r => ({ name: r.name, run: compact6(r) })) };
    fs.writeFileSync(path.join(__dirname, 'ch06-golden.json'), JSON.stringify(out));
    console.log('wrote tests/fixtures/ch06-golden.json: ' + out.runs.length + ' readings with engine ' + E.VERSION + ' (' + (Date.now() - t0) + ' ms)');
  }
}

module.exports = { SCRIPTS6, runs6, run6, compact6, context, treeAt, frameRecord, readChapter, fileDigest, cardsDigest, linkDigest, strip, CH };
