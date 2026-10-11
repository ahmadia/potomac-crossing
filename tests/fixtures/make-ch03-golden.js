/* Records tests/fixtures/ch03-golden.json: chapters 1, 2 and 3 read through the engine as it was
 * when chapter 3 shipped (0.3.0, commit 0e695a7), with everything the page was told to draw and say
 * as ui.js worked it out then (the copy below: `oldUi3`). Run once, before chapter 4's engine:
 *
 *   GOLDEN_ROOT=/a/copy/of/the/chapter-3/tree node tests/fixtures/make-ch03-golden.js
 *   (git archive 0e695a7 | tar -x -C /some/dir, with chapters 1 to 3's story files as they are now)
 *
 * tests/engine.test.js reads the same scripts through today's engine and today's own words for the
 * page (`newUi`: E.lessonPicture, E.sandOpts, E.skipPicture, E.keptPicture, E.skipWords,
 * E.hollowLines …) and compares the digests (fixtures/golden.js, `compact`), so chapters 1 to 3 play
 * exactly as they did: every frame and what it shows (the scene with the cat's options filled in,
 * the captions, the balloons, the options), every skip-count tap by tap, every question (its
 * picture as asked, lit and after a right answer; its words), every answer's result and line, the
 * help (who counts, where, how it is scratched, hop by hop), the Training Hollow and its lines, her
 * book and the cat at the end. A difference names its chapter, its lesson and its question.
 *
 *   node tests/fixtures/make-ch03-golden.js --diff DIR   writes the whole of each run as today's engine
 *   plays it to DIR/now-N.json (and, with GOLDEN_ROOT, as the old one did to DIR/then-N.json), to diff.
 * Not a test file.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { walk, compact, clone } = require('./golden.js');

/* The scripts: both chapter 2 paths, both chapter 3 endings, misses of every kind (one off; five off,
 * which lands on a five or a zero; everything wrong; set by set, answer by answer), slow and quick. */
const SCRIPTS3 = [
  { name: 'clean, bridge, told', ch01: { ms: 2000 }, ch02: { ms: 2000 }, ch03: { ms: 2000 } },
  { name: 'clean, river, kept, every second option', choiceIndex: 1, ch01: { ms: 3000 }, ch02: { ms: 3500 }, ch03: { ms: 3500 } },
  { name: 'misses at the warm-up, the pile, the claws, the dinner and the six (one off)', ch01: { ms: 2000 }, ch02: { ms: 2000, miss: ['2x6', '9x2'] },
    ch03: { ms: 2000, miss: ['4x2', '6x2', '9x2', '7x2', '4x5', '5x6', '10x5', '2x5', '6x5'] } },
  { name: 'misses that land on a five or a zero (five off), river, kept', choiceIndex: 1, ch01: { ms: 2500 }, ch02: { ms: 6500, msFor: { '1x4': 2000, '3x2': 2000, '2x6': 2000, '10x2': 2000 } },
    ch03: { ms: 2500, wrongBy: 5, miss: ['5x2', '5x8', '7x5', '9x5', '2x5', '6x5', '2x2', '9x2'] } },
  { name: 'every answer wrong', ch01: { allWrong: true }, ch02: { allWrong: true }, ch03: { allWrong: true } },
  { name: 'a tom, his own names, the third options, misses everywhere', look: { sex: 'tom', fur: 'black', marking: 'back-stripe', eyes: 'blue' },
    petname: 'SNICKERDOODLE', clanname: 'Murmur', dream: '', choiceIndex: 2,
    ch01: { miss: ['1x7', '6x1'], ms: 2500 }, ch02: { miss: ['1x4', '7x1', '2x5', '4x2', '2x8', '10x2', '8x2'], ms: 2500 },
    ch03: { miss: ['2x3', '6x2', '7x2', '1x5', '5x5', '5x3', '9x5', '2x5', '6x5'], ms: 4500, msFor: { '4x5': 2000, '5x6': 2000 } } },
  { name: 'answer by answer: retries and borrowed questions missed, at the doorway, the pile and under the bridge', choiceIndex: 1,
    ch01: { ms: 2000 }, ch02: { ms: 2000 },
    ch03: { ms: 2000, plan: { 'ch03-ears': [0, 1, 0, 1, 1, 0, 1, 1, 1], 'ch03-pile': [0, 0, 1, 0, 1, 1, 0, 1, 1, 1], 'ch03-dinner': [0, 0, 1, 0, 1, 1, 1, 1], 'ch03-six': [0, 1, 0, 0, 1, 1, 1, 1],
      'ch03-claws': [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1] } } },
  { name: 'slow but right everywhere (so every Count has hard facts), bridge, kept', choiceIndex: 0, ch01: { ms: 6500 }, ch02: { ms: 6500 }, ch03: { ms: 6500 },
    choices: { ch03: 1 } },
  { name: 'river and told, a miss at the claws and its retry missed too', choiceIndex: 1, choices: { ch03: 0 }, ch01: { ms: 2000 }, ch02: { ms: 3000, miss: ['2x8'] },
    ch03: { ms: 3000, miss: ['5x5', '10x5'], plan: { 'ch03-dinner': [0, 1, 1, 0, 1, 1, 1] } } }
];

/* ui.js as chapter 3 shipped it, as data: what runLesson, its help, renderSkip, drawKept, the Hollow
 * and the choice buttons handed to the art and put on the page. */
function oldUi3(E) {
  const asList = x => (x == null ? [] : Array.isArray(x) ? x : [x]);
  const andList = a => (a.length > 2 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a.join(' and '));
  const NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const numWord = n => NUMW[n] || String(n);
  // runLesson: look(over) and picture(highlight, over)
  function look(D, q, over) {
    const p = Object.assign({}, D.picture || {}, q.picture || {}, over ? Object.assign({ layout: 'rows' }, over.picture || {}) : {});
    const g = over && typeof over.groups === 'number' ? over.groups : q.groups;
    const per = over && typeof over.per === 'number' ? over.per : q.per;
    const who = q.who || (Array.isArray(D.who) ? D.who : null);
    return { kind: p.kind, layout: p.layout, thought: p.thought, groups: g, per: per, who: who };
  }
  function picture(D, q, highlight, over) {
    const L = look(D, q, over);
    return { table: q.table || L.per, groups: L.groups, per: L.per, highlight: highlight || 0, kind: L.kind, layout: L.layout, thought: L.thought, who: L.who || undefined,
      thing: D.thing || 'tail', things: D.things || 'tails' };
  }
  // help(): the sand, as the count goes
  function sand(plan, hp, counted) {
    const o = { groups: hp.groups, per: hp.per, counted: counted, layout: plan.layout || undefined, ground: plan.ground === 'sand' ? undefined : plan.ground };
    if (plan.style) o.style = plan.style;
    return o;
  }
  // renderSkip's draw(), and drawKept
  function skipThings(sk, table) {
    const d = { 2: ['ear', 'ears'], 5: ['claw', 'claws'] }[table] || ['thing', 'things'];
    return [sk.thing || d[0], sk.things || d[1]];
  }
  function skipPicture(sk, taps) {
    const v = E.skipView(sk, taps), t = skipThings(sk, sk.table);
    const po = { table: v.table, groups: v.groups, per: v.per, highlight: v.highlight, totals: true, next: !v.done, who: sk.who, thing: t[0], things: t[1] };
    if (sk.paws === 'own') { po.paws = 'own'; po.taps = v.taps; po.lit = v.lit; po.nextPaw = v.nextPaw; po.totals = false; }
    return po;
  }
  function keptPicture(sk) {
    const v = E.skipView(sk, sk.groups), t = skipThings(sk, v.table);
    const po = { table: v.table, groups: v.groups, per: v.per, highlight: v.highlight, totals: true, next: false, who: sk.who, thing: t[0], things: t[1] };
    if (sk.paws === 'own') { po.paws = 'own'; po.taps = v.taps; po.lit = v.lit; po.nextPaw = null; po.totals = false; }
    return po;
  }
  function skipWords(sk, first) {
    const own = sk.paws === 'own', v0 = E.skipView(sk, 0);
    return {
      teacher: sk.teacher || (own ? 'player' : first || 'tallyheart'), whisper: own,
      label: own ? 'Tap your next forepaw.' : 'Count the next ' + (sk.table === 2 ? 'cat' : sk.table === 5 ? 'paw' : 'one'),
      aria: own ? 'Your two forepaws on the moss. Touch the glowing one.' : 'Counting picture: ' + numWord(v0.groups) + ' groups of ' + numWord(v0.table) + '. Touch the glowing one.'
    };
  }
  // renderHollow, hollowLesson and hollowReward
  function hollow(def, cat, table, list) {
    const defs = E.learnedCounts(cat, list).map(c => ({ table: c.table, def: E.hollowDef(list, c.table), glow: E.hollowTable(cat, c.table).glow }));
    const one = defs.length === 1 ? defs[0] : null, glowing = defs.filter(d => d.glow);
    const greet = reward => (reward ? 'Another round? I’ve got all evening.'
      : one ? 'Back for more ' + (one.def.things || 'tails') + '? A full round earns a treasure for your nest.'
        : defs.length ? 'Which Count today? A full round earns a treasure for your nest.' : 'Finish a Count in your story first. Then come back and practise it.');
    const glow = one && one.glow ? 'Look at your claw mark. It glows now. You know your ' + (one.def.things || 'tails') + '.'
      : glowing.length ? 'Look at your claw marks. Your ' + andList(glowing.map(d => d.def.things)) + ' ' + (glowing.length === 1 ? 'mark glows' : 'marks glow') + ' now.' : null;
    return {
      greet: greet(false), again: greet(true), glow: glow, buttons: defs.map(d => E.countName(d.def, d.table)),
      round: 'A round of ' + (def.things || 'tails') + '. Ready? Here we go.',
      glowNote: 'Look! Your ' + (def.things || 'tails') + ' claw mark on the tree is glowing.', glowNoteOne: 'Look! Your claw mark on the tree is glowing.',
      done: def.done
    };
  }
  return { look, picture, sand, skipPicture, keptPicture, skipWords, hollow, label: (o) => o.label };
}

/* Today's engine, asked the same things. */
function newUi(E) {
  return {
    picture: (D, q, highlight, over) => E.lessonPicture(D, q, highlight, over),
    sand: (plan, hp, counted) => E.sandOpts(plan, counted),
    skipPicture: (sk, taps) => E.skipPicture(sk, taps),
    keptPicture: (sk) => E.keptPicture(sk),
    skipWords: (sk, first) => { const w = E.skipWords(sk, first); return { teacher: w.teacher, whisper: w.whisper, label: w.label, aria: w.aria }; },
    hollow: (def, cat, table, list) => {
      const h = E.hollowLines(cat, list), again = E.hollowLines(cat, list, { reward: true });
      return { greet: h.greet, again: again.greet, glow: h.glow, buttons: h.counts.map(c => c.name), round: E.hollowRoundLine(def),
        glowNote: E.hollowGlowNote(def, true), glowNoteOne: E.hollowGlowNote(def, false), done: def.done };
    },
    label: (o, cat) => E.optionLabel(o, cat)
  };
}

/* The walker's `ui` (fixtures/golden.js): the words as the engine says them, and the hooks that
 * record what the page draws, through `U` (oldUi3 for the recording, newUi for the test). */
function hooks(E, U) {
  return {
    promptLines: (def, D, q) => E.promptLines(def, D, q),
    helpIntro: (def, D, q, res) => E.helpPlan(def, D, q, res).intro,
    ground: (def, D, q) => E.helpGround(def, D, q),
    row(row, def, D, q, res, cat) {
      const x = row.x = { asked: U.picture(D, q, q.lit || 0), teacher: E.teacherOf(def, D), ask: E.counts.ask(def, q) };
      // `light`: the picture lights a group (or a row) at a time as it is asked
      if (q.light) { x.light = []; for (let k = 1; k <= q.groups; k++) x.light.push(U.picture(D, q, Math.max(q.lit || 0, k * q.per))); }
      if (res.correct) {
        const R = res.rightPicture;
        x.right = R ? U.picture(D, q, (typeof R.groups === 'number' ? R.groups : q.groups) * (typeof R.per === 'number' ? R.per : q.per), R) : U.picture(D, q, q.groups * q.per);
      } else {
        const plan = E.helpPlan(def, D, q, res), hp = res.help;
        // the fields chapter 3's help had (chapter 4 adds its own beside them: see the engine tests)
        x.plan = { intro: E.fill(plan.intro, cat), teacher: plan.teacher, counter: plan.counter, ground: plan.ground, style: plan.style, layout: plan.layout,
          step: plan.step, total: plan.total, nums: plan.nums, groups: plan.groups, per: plan.per, answer: plan.answer, line: E.fill(plan.line, cat) };
        x.sand = [0, Math.min(plan.total, plan.step), plan.total].map(n => U.sand(plan, hp, n));
      }
    },
    frame(story, id, cat, list) {
      const f = story.frames[id], kept = E.keptSkip(story, id, cat), into = E.skipInto(story, id, cat);
      const rec = {
        id: id, kind: E.kindOf(f), scene: f.scene ? E.resolveScene(f.scene, cat, list) : null,
        caps: E.captions(f, cat).map(c => E.fill(c, cat)),
        say: E.balloons(f, cat).map(b => Object.assign({}, b, { text: E.fill(b.text || '', cat) })),
        sfx: f.sfx ? E.fill(f.sfx, cat) : '', gift: f.gift || null, kept: kept ? kept.id : null,
        into: into ? E.skipView(into, 0).groups * E.skipView(into, 0).table : null,
        back: E.canBack(cat), status: E.status(cat, list)
      };
      if (kept) rec.keptPic = U.keptPicture(kept.skip);
      if (f.choice) rec.options = [f.choice.prompt ? E.fill(f.choice.prompt, cat) : null].concat(E.options(f, cat).map(o => [o.index, E.fill(U.label(o.option, cat), cat)]));
      if (f.skip) {
        const first = E.balloons(f, cat)[0];
        rec.skip = { words: U.skipWords(f.skip, first && first.who), taps: [] };
        for (let n = 0; n <= E.skipView(f.skip, 0).groups; n++) rec.skip.taps.push({ view: E.skipView(f.skip, n), pic: U.skipPicture(f.skip, n) });
      }
      return rec;
    },
    hollow: (def, cat, table, list) => U.hollow(def, cat, table, list)
  };
}

/* A script as the walker reads it: `choices: { ch03: 1 }` picks that option index in one chapter
 * (the walker's `choiceIndex` is for the whole reading). */
function runs(E, list, U) {
  return SCRIPTS3.map(s => {
    if (!s.choices) return { name: s.name, run: walk(E, list, s, hooks(E, U)) };
    // a chapter with its own choice index: wrap E.options for that chapter
    const options = E.options, idx = s.choices;
    let story = null;
    const startChapter = E.startChapter;
    E.startChapter = function (cat, st) { story = st; return startChapter.apply(E, arguments); };
    E.options = function (f, cat) {
      const o = options.call(E, f, cat), want = story && idx[story.id];
      if (want == null || !o.length) return o;
      // the walker takes opts[choiceIndex % length]: turn the list so that is the option wanted
      const k = ((want - (s.choiceIndex || 0)) % o.length + o.length) % o.length;
      return o.slice(k).concat(o.slice(0, k));
    };
    try { return { name: s.name, run: walk(E, list, s, hooks(E, U)) }; }
    finally { E.options = options; E.startChapter = startChapter; }
  });
}

if (require.main === module) {
  const root = process.env.GOLDEN_ROOT ? path.resolve(process.env.GOLDEN_ROOT) : path.join(__dirname, '..', '..');
  const PC = require(path.join(root, 'tests/_load.js')).load(), E = PC.engine;
  const list = [PC.story.ch01, PC.story.ch02, PC.story.ch03];
  const old = !E.lessonPicture;
  const full = runs(E, list, old ? oldUi3(E) : newUi(E));
  const at = process.argv.indexOf('--diff');
  if (at >= 0) {
    const dir = path.resolve(process.argv[at + 1] || '.');
    fs.mkdirSync(dir, { recursive: true });
    full.forEach((r, i) => fs.writeFileSync(path.join(dir, (old ? 'then-' : 'now-') + i + '.json'), JSON.stringify(r, null, 1)));
    console.log('wrote ' + full.length + ' runs (' + E.VERSION + ') to ' + dir);
  } else {
    if (!old) { console.error('This engine is chapter 4’s or later: record with GOLDEN_ROOT set to a copy of the chapter-3 tree (see the top of this file).'); process.exit(1); }
    const out = { engine: E.VERSION, recorded: new Date().toISOString().slice(0, 10), runs: full.map(r => ({ name: r.name, run: compact(r.run) })) };
    fs.writeFileSync(path.join(__dirname, 'ch03-golden.json'), JSON.stringify(out));
    console.log('wrote tests/fixtures/ch03-golden.json: ' + out.runs.length + ' readings with engine ' + E.VERSION);
  }
}

module.exports = { SCRIPTS3, oldUi3, newUi, hooks, runs };
