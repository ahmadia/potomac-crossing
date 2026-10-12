/* Records tests/fixtures/ch04-golden.json: chapters 1 to 4 read through the engine as it was when
 * chapter 4 shipped (0.4.0, commit 7ae12db), with everything the engine told the page to draw and
 * say. Run once, before chapter 5's engine:
 *
 *   GOLDEN_ROOT=/a/copy/of/the/chapter-4/tree node tests/fixtures/make-ch04-golden.js
 *
 * tests/engine.test.js reads the same scripts through today's engine and compares the digests
 * (fixtures/golden.js, `compact`; here `compact4`, which adds her Case File), so chapters 1 to 4
 * play exactly as they did: every frame and what it shows (the scene with the cat's options filled
 * in, the captions, the balloons, the options and their labels, the card under the panel, the row of
 * bark piece by piece, the words of a page she taps, whether her file's button is there and wiggles,
 * her whole Case File as its screen lays it out), every skip-count tap by tap (its view, its picture,
 * its words), every question (its picture as asked, lit and after a right answer; its words), every
 * answer's result and line, the whole help (who counts, where, how it is scratched, hop by hop), the
 * Training Hollow and its lines, her book with its dragonets, and the cat at the end with her cards.
 * By 0.4.0 the page's own working-out (ui.js) had moved into the engine (E.lessonPicture, E.sandOpts,
 * E.skipPicture, E.keptPicture, E.skipWords, E.hollowLines, E.tapWords, E.cardsOn, E.caseFile), so the
 * recording and the test ask the engine the same questions; no copy of the old ui.js is needed.
 *
 *   node tests/fixtures/make-ch04-golden.js --diff DIR   writes the whole of each run as today's engine
 *   plays it to DIR/now-N.json (with GOLDEN_ROOT: as that tree's engine does, to DIR/then-N.json), to diff.
 * Not a test file.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { walk, compact, clone, hash } = require('./golden.js');

/* The scripts. `pick` chooses an option by frame ("chapter:frame": its index among the options she
 * sees); every other choice takes `choiceIndex`. Between them: every specialty and every worry, both
 * chapter 2 paths, told and kept, the roof and "Not today", the eye and the ear, misses of every kind
 * (one off; ten off, which lands on a zero; everything wrong; set by set, answer by answer), slow and
 * quick. */
const SPEC = { noticing: 0, sneaking: 1, climbing: 2, swimming: 3, friends: 4 }, WORRY = { small: 0, water: 1, talk: 2, shiny: 3 };
const who = (spec, worry, path, told, roof, more) => Object.assign({ 'ch01:f014': SPEC[spec], 'ch01:f066': WORRY[worry], 'ch02:f084': path === 'river' ? 1 : 0,
  'ch03:f086': told ? 0 : 1, 'ch04:f075': roof ? 0 : 1 }, more || {});
const SCRIPTS4 = [
  { name: 'clean: noticing, small, bridge, told, up to the roof', pick: who('noticing', 'small', 'bridge', true, true),
    ch01: { ms: 2000 }, ch02: { ms: 2000 }, ch03: { ms: 2000 }, ch04: { ms: 2000 } },
  { name: 'clean: sneaking, water, river, kept, not today; every second option', choiceIndex: 1, pick: who('sneaking', 'water', 'river', false, false),
    ch01: { ms: 3000 }, ch02: { ms: 3500 }, ch03: { ms: 3500 }, ch04: { ms: 3500 } },
  { name: 'a climber who told and climbs: misses at the warm-up, the tens, the pile and the riddle (one off)', pick: who('climbing', 'talk', 'bridge', true, true, { 'ch04:f064': 1 }),
    ch01: { ms: 2000 }, ch02: { ms: 2000, miss: ['2x6'] }, ch03: { ms: 2000, miss: ['5x8', '7x5'] },
    ch04: { ms: 2000, miss: ['3x5', '2x5', '4x10', '6x10', '10x9', '10x10', '3x10', '2x10', '7x5', '4x10'] } },
  { name: 'a swimmer who fears the water, kept, up: misses that land on a zero (ten off)', choiceIndex: 1, pick: who('swimming', 'water', 'river', false, true),
    ch01: { ms: 2500 }, ch02: { ms: 2500 }, ch03: { ms: 2500, wrongBy: 5, miss: ['5x2', '9x5'] },
    ch04: { ms: 2500, wrongBy: 10, miss: ['5x7', '10x2', '5x10', '10x8', '7x10', '3x10', '4x10'] } },
  { name: 'every answer wrong: friends, shiny, bridge, kept, not today', pick: who('friends', 'shiny', 'bridge', false, false),
    ch01: { allWrong: true }, ch02: { allWrong: true }, ch03: { allWrong: true }, ch04: { allWrong: true } },
  { name: 'a tom, his own names, noticing and kept, up: misses everywhere', look: { sex: 'tom', fur: 'black', marking: 'back-stripe', eyes: 'blue' },
    petname: 'SNICKERDOODLE', clanname: 'Murmur', dream: '', choiceIndex: 1, pick: who('noticing', 'talk', 'river', false, true, { 'ch04:f064': 0 }),
    ch01: { miss: ['1x7', '6x1'], ms: 2500 }, ch02: { miss: ['1x4', '2x5', '10x2', '8x2'], ms: 2500 }, ch03: { miss: ['2x3', '7x2', '5x5', '9x5', '2x5', '6x5'], ms: 4500, msFor: { '4x5': 2000 } },
    ch04: { miss: ['5x7', '4x10', '1x10', '10x3', '2x10', '7x5'], ms: 4500, msFor: { '4x10': 2000, '6x10': 2000 } } },
  { name: 'answer by answer: retries and borrowed questions missed, at the warm-up, the pile, the roof and tonight’s rows', pick: who('climbing', 'small', 'river', true, true),
    ch01: { ms: 2000 }, ch02: { ms: 2000 }, ch03: { ms: 2000 },
    ch04: { ms: 2000, plan: { 'ch04-claws': [0, 1, 0, 1, 1, 0, 1, 1, 1, 1], 'ch04-pile': [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1], 'ch04-riddle': [0, 0, 1, 0, 1, 1, 1, 1],
      'ch04-night': [0, 1, 0, 0, 1, 1, 1, 1], 'ch04-tens': [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1] } } },
  { name: 'slow but right everywhere (so every Count has hard facts): sneaking, shiny, bridge, told, not today', pick: who('sneaking', 'shiny', 'bridge', true, false),
    ch01: { ms: 6500 }, ch02: { ms: 6500 }, ch03: { ms: 6500 }, ch04: { ms: 6500 } },
  { name: 'friends, water, river, told, up; a miss at the tens and its retry missed too; misses that end in neither a zero nor a five', choiceIndex: 1,
    pick: who('friends', 'water', 'river', true, true),
    ch01: { ms: 2000 }, ch02: { ms: 3000, miss: ['2x8'] }, ch03: { ms: 3000, miss: ['10x5'] },
    ch04: { ms: 3000, wrongBy: 3, miss: ['3x5', '10x3', '3x10', '4x10'], plan: { 'ch04-riddle': [0, 1, 1, 0, 1, 1, 1] } } },
  { name: 'noticing and told, not today: the fox’s FLEW caught with nobody to tell it to on the roof', pick: who('noticing', 'water', 'bridge', true, false),
    ch01: { ms: 2000 }, ch02: { ms: 2000 }, ch03: { ms: 2000 }, ch04: { ms: 3500, miss: ['10x10'] } }
];

/* The walker's `ui` (fixtures/golden.js): the words as the engine says them, and the hooks that
 * record what the page is told to draw. `seen.cat` is the cat being walked (for her Case File). */
function hooks4(E, seen) {
  return {
    promptLines: (def, D, q) => E.promptLines(def, D, q),
    helpIntro: (def, D, q, res) => E.helpPlan(def, D, q, res).intro,
    ground: (def, D, q) => E.helpGround(def, D, q),
    row(row, def, D, q, res, cat) {
      const x = row.x = { asked: E.lessonPicture(D, q, q.lit || 0), teacher: E.teacherOf(def, D), ask: E.counts.ask(def, q), generic: E.genericQuestion(D, q) };
      if (q.light) { x.light = []; for (let k = 1; k <= q.groups; k++) x.light.push(E.lessonPicture(D, q, Math.max(q.lit || 0, k * q.per))); }
      if (res.correct) {
        const R = res.rightPicture;
        x.right = R ? E.lessonPicture(D, q, (typeof R.groups === 'number' ? R.groups : q.groups) * (typeof R.per === 'number' ? R.per : q.per), R) : E.lessonPicture(D, q, q.groups * q.per);
      } else {
        const plan = E.helpPlan(def, D, q, res);
        // the whole plan as 0.4.0 made it (a later engine may add keys beside these: see the engine tests)
        x.plan = { intro: E.fill(plan.intro, cat), teacher: plan.teacher, counter: plan.counter, ground: plan.ground, style: plan.style, layout: plan.layout,
          step: plan.step, total: plan.total, nums: plan.nums, groups: plan.groups, per: plan.per, answer: plan.answer, line: E.fill(plan.line, cat), pair: plan.pair, byRow: plan.byRow };
        // the scratches at every hop of the count, as the page draws them
        x.sand = [0].concat(plan.nums).map(n => E.sandOpts(plan, n));
        x.flags = { near: res.near, notFive: res.notFive, notTen: res.notTen };
      }
    },
    frame(story, id, cat, list) {
      seen.cat = cat;
      const f = story.frames[id], kept = E.keptSkip(story, id, cat), into = E.skipInto(story, id, cat);
      const rec = {
        id: id, kind: E.kindOf(f), scene: f.scene ? E.resolveScene(f.scene, cat, list) : null,
        caps: E.captions(f, cat).map(c => E.fill(c, cat)),
        say: E.balloons(f, cat).map(b => Object.assign({}, b, { text: E.fill(b.text || '', cat) })),
        sfx: f.sfx ? E.fill(f.sfx, cat) : '', gift: f.gift || null, kept: kept ? kept.id : null,
        into: into ? E.skipView(into, 0).groups * E.skipView(into, 0).table : null,
        back: E.canBack(cat), status: E.status(cat, list),
        // chapter 4: the card under the panel, her file's button, and her whole Case File as its screen has it
        cards: E.cardsOn(f, cat, story, list).map(c => Object.assign({}, c, { line: E.fill(c.line, cat) })),
        hasFile: E.hasFile(cat), wiggles: E.fileWiggles(cat, story, id), file: E.caseFile(cat, list)
      };
      if (kept) rec.keptPic = E.keptPicture(kept.skip);
      if (f.choice) rec.options = [f.choice.prompt ? E.fill(f.choice.prompt, cat) : null].concat(E.options(f, cat).map(o => [o.index, E.fill(E.optionLabel(o.option, cat), cat)]));
      if (f.skip) {
        const first = E.balloons(f, cat)[0];
        rec.skip = { words: E.skipWords(f.skip, first && first.who), taps: [] };
        for (let n = 0; n <= E.skipView(f.skip, 0).groups; n++) rec.skip.taps.push({ view: E.skipView(f.skip, n), pic: E.skipPicture(f.skip, n) });
      }
      if (f.scratch || f.file) rec.tap = E.tapWords(f);
      if (f.scratch) rec.pieces = E.scratchPieces(f, cat, story, list);
      return rec;
    },
    hollow: (def, cat, table, list) => {
      const h = E.hollowLines(cat, list), again = E.hollowLines(cat, list, { reward: true });
      return { greet: h.greet, again: again.greet, glow: h.glow, buttons: h.counts.map(c => c.name), round: E.hollowRoundLine(def),
        glowNote: E.hollowGlowNote(def, true), glowNoteOne: E.hollowGlowNote(def, false), done: def.done };
    }
  };
}

/* Each script through the walker. A script's `pick` turns the options the walker sees at that frame
 * so that the one it takes (`choiceIndex`) is the one wanted. */
function runs4(E, list) {
  return SCRIPTS4.map(s => {
    const options = E.options, startChapter = E.startChapter, pick = s.pick || {}, seen = { cat: null };
    let story = null;
    E.startChapter = function (cat, st) { story = st; return startChapter.apply(E, arguments); };
    E.options = function (f, cat) {
      const o = options.call(E, f, cat);
      const id = story && Object.keys(story.frames).find(k => story.frames[k] === f), want = id == null ? null : pick[story.id + ':' + id];
      if (want == null || !o.length) return o;
      const k = ((want - (s.choiceIndex || 0)) % o.length + o.length) % o.length;
      return o.slice(k).concat(o.slice(0, k));
    };
    try {
      const run = walk(E, list, s, hooks4(E, seen)), cat = seen.cat, book = E.buildFullBook(cat, list);
      // what golden.js's walker leaves out of its record: her cards, her file at the end, the dragonets in her book
      run.extra = clone({ cards: cat.cards.map(c => [c.id, c.chapter]), all: E.cards(cat, list, { all: true }), file: E.caseFile(cat, list), dragonets: book.dragonets,
        learned: E.learnedCounts(cat, list).map(c => [c.table, c.setId]), tables: E.factTables(cat, list).map(t => [t.table, t.name, t.rows.length]) });
      return { name: s.name, run };
    } finally { E.options = options; E.startChapter = startChapter; }
  });
}
/* golden.js's digest, and a hash of the rest. */
function compact4(run) { return Object.assign(compact(run), { extra: hash(run.extra), flags: clone(run.cat.flags) }); }

if (require.main === module) {
  const root = process.env.GOLDEN_ROOT ? path.resolve(process.env.GOLDEN_ROOT) : path.join(__dirname, '..', '..');
  const PC = require(path.join(root, 'tests/_load.js')).load(), E = PC.engine;
  const list = [PC.story.ch01, PC.story.ch02, PC.story.ch03, PC.story.ch04];
  const old = /^0\.4\.0 /.test(E.VERSION);
  const full = runs4(E, list);
  const at = process.argv.indexOf('--diff');
  if (at >= 0) {
    const dir = path.resolve(process.argv[at + 1] || '.');
    fs.mkdirSync(dir, { recursive: true });
    full.forEach((r, i) => fs.writeFileSync(path.join(dir, (old ? 'then-' : 'now-') + i + '.json'), JSON.stringify(r, null, 1)));
    console.log('wrote ' + full.length + ' runs (' + E.VERSION + ') to ' + dir);
  } else {
    if (!old) { console.error('This engine is chapter 5’s or later: record with GOLDEN_ROOT set to a copy of the chapter-4 tree (see the top of this file).'); process.exit(1); }
    const out = { engine: E.VERSION, recorded: new Date().toISOString().slice(0, 10), runs: full.map(r => ({ name: r.name, run: compact4(r.run) })) };
    fs.writeFileSync(path.join(__dirname, 'ch04-golden.json'), JSON.stringify(out));
    console.log('wrote tests/fixtures/ch04-golden.json: ' + out.runs.length + ' readings with engine ' + E.VERSION);
  }
}

module.exports = { SCRIPTS4, hooks4, runs4, compact4 };
