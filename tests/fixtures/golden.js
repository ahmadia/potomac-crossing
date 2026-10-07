/* A whole reading, recorded: the walker behind tests/fixtures/ch02-golden.json, the proof that
 * chapter 2 (and chapter 1 before it) still plays exactly as it did before chapter 3's engine.
 *
 *   const { walk, SCRIPTS } = require('./fixtures/golden.js');
 *   walk(E, [ch01, ch02], script, ui)  ->  { frames, lessons, hollow, cat, book }
 *
 * It reads chapter 1 and then chapter 2 the way the UI does (every frame, every choice, every
 * typed name and dream, every Counts lesson answer by answer, the lesson recorded at its last
 * answer, the counts frame's Next), then a Training Hollow round of each Count she has learned,
 * and records everything a reader meets: each question as the engine asks it, the set it is asked
 * as, the lines that ask it, each answer's result (line, balloons, help), the help's first line,
 * its count and its ground, the cat at the end and her book. `ui` turns a question into what the
 * page says (`promptLines`, `helpIntro`, `ground`): the recording used a copy of ui.js as it was
 * (tests/fixtures/make-ch02-golden.js); the test uses the engine's own (E.promptLines, E.helpPlan).
 * Not a test file (node --test only runs *.test.js).
 */
'use strict';

const clone = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));

/* The scripts: who she is, what she picks, which facts she misses (first asks only; a retry is
 * right unless `allWrong`), and how long she takes (ms, or per fact "AxB": ms). `plan` scripts a
 * set answer by answer instead ({ setId: [1, 0, …] }: right, wrong, in the order asked, fillers and
 * retries included; right once it runs out). Every one is fast
 * on the facts asked under a long prompt (chapter 1's 3 × 1, the warm-up's opener, 3 × 2, 2 × 6,
 * the old tom's 10 × 2), so the reading-time rule chapter 3 brings changes nothing here. */
const SCRIPTS = [
  { name: 'clean, bridge', ch02: { ms: 2000 } },
  { name: 'clean, river, every second option', choiceIndex: 1, ch02: { ms: 3500 } },
  { name: 'misses at the warm-up opener, 2 × 6, the pile and the check', ch01: { miss: ['3x1'] },
    ch02: { miss: ['1x4', '2x6', '8x2', '2x8'], ms: 2000 } },
  { name: 'misses at the warm-up second question, the old tom and 9 × 2', choiceIndex: 1,
    ch01: { miss: ['8x1', '1x10'] }, ch02: { miss: ['7x1', '10x2', '9x2'], ms: 3000 } },
  { name: 'misses at 5 × 2 (it regroups), 3 × 2 first, 2 × 10 last', ch02: { miss: ['5x2', '3x2', '2x10'], ms: 1500 } },
  { name: 'every answer wrong', ch01: { allWrong: true }, ch02: { allWrong: true } },
  { name: 'slow, but quick where she reads a long prompt', choiceIndex: 1, ch01: { ms: 6000, msFor: { '3x1': 2000 } },
    ch02: { ms: 6500, msFor: { '1x4': 2000, '1x3': 2000, '3x2': 2000, '2x6': 2000, '10x2': 2000 }, miss: ['2x2'] } },
  { name: 'a tom, his own names, misses everywhere', look: { sex: 'tom', fur: 'black', marking: 'back-stripe', eyes: 'blue' },
    petname: 'SNICKERDOODLE', clanname: 'Thunderstormwhiskers', dream: '', choiceIndex: 2,
    ch01: { miss: ['1x7', '6x1'], ms: 2500 }, ch02: { miss: ['1x4', '7x1', '2x5', '4x2', '2x1', '2x8', '10x2', '8x2'], ms: 2500 } },
  // the pile and the check run out of fresh pairs to borrow, so a filler is a pair already asked:
  // the next in the pool's order, as chapter 2 shipped (the check's 2 × 10 and 9 × 2, never 4 × 2
  // and 3 × 2 again straight after it asked them)
  { name: 'misses on borrowed questions and retries, until the pile and the check run out of fresh pairs',
    ch01: { ms: 2000 }, ch02: { ms: 2000, plan: { 'ch02-pile': [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1], 'ch02-check': [0, 1, 1, 0, 1, 1, 1, 1, 1, 1] } } }
];

function answerFor(q, s) {
  if (s.allWrong) return q.answer + 1;
  const miss = (s.miss || []).includes(q.a + 'x' + q.b) && !q.retry && !q.filler;
  return miss ? q.answer + 1 : q.answer;
}
function msFor(q, s) {
  const k = q.a + 'x' + q.b;
  return s.msFor && s.msFor[k] != null ? s.msFor[k] : (s.ms || 3000);
}

/* One lesson, answer by answer. Returns the record and what was recorded at the last answer. */
function lesson(E, cat, story, list, def, st, s, ui, clock) {
  const rows = [];
  const plan = s.plan && def && s.plan[def.id] ? s.plan[def.id].slice() : null;
  let rec = null;
  while (!E.counts.done(st)) {
    const q = E.counts.question(st);
    const D = E.questionDef(def, q, story, list);
    const row = { q: clone(q), as: D.id || null, teacher: D.teacher || def.teacher || 'tallyheart',
      prompt: ui.promptLines(def, D, q).map(l => Object.assign({}, l, { text: E.fill(l.text, cat) })) };
    const ok = plan && plan.length ? plan.shift() : null;
    const value = ok == null ? answerFor(q, s) : ok ? q.answer : q.answer + 1;
    const res = E.counts.answer(st, D, value, msFor(q, s), (clock.t += 1000));
    E.logAnswer(cat, res.entry);
    row.res = { correct: res.correct, right: res.right, fast: res.fast, line: res.line, lineKind: res.lineKind, near: res.near,
      requeued: res.requeued, done: res.done, balloons: clone(res.balloons), help: clone(res.help), rightPicture: clone(res.rightPicture), entry: clone(res.entry) };
    if (!res.correct) row.help = { intro: E.fill(ui.helpIntro(def, D, q, res), cat), ground: ui.ground(def, D, q) };
    if (res.done) rec = E.recordLesson(cat, st);
    else if (st.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: st };
    else cat.lesson = { mode: st.mode, state: st };
    rows.push(row);
  }
  return { rows, rec };
}

function walk(E, list, script, ui) {
  const clock = { t: 1000 };
  const cat = E.blankCat({ now: 1, id: 'golden' });
  const out = { frames: {}, lessons: {}, hollow: [] };
  list.forEach(story => {
    const s = Object.assign({}, script[story.id] || {});
    const frames = out.frames[story.id] = [];
    E.startChapter(cat, story, (clock.t += 1000));
    for (let guard = 0; guard < 600; guard++) {
      const id = E.frameId(cat, story), f = story.frames[id], kind = E.kindOf(f), t = (clock.t += 1000);
      frames.push(id);
      if (kind === 'end') break;
      if (kind === 'next' || kind === 'skip') E.next(cat, story, t);
      else if (kind === 'look') E.confirmLook(cat, story, script.look || { sex: 'she', fur: 'calico', marking: 'white-paws', eyes: 'odd' }, t);
      else if (kind === 'choice') {
        const opts = E.options(f, cat);
        E.choose(cat, story, opts[(script.choiceIndex || 0) % opts.length].index, t);
      } else if (kind === 'input') {
        const k = f.input.kind;
        const v = k === 'petname' ? (script.petname != null ? script.petname : 'princess sparkle muffin')
          : k === 'clanname' ? (script.clanname != null ? script.clanname : 'moonpaw')
            : k === 'dream' ? (script.dream != null ? script.dream : 'i dreamed about otters') : '';
        E.submitInput(cat, story, v, t);
      } else if (kind === 'counts') {
        const r = E.chapterLesson(cat, story, f.counts.set, t, list);
        E.beginLesson(cat, story, id, r.state);
        const L = lesson(E, cat, story, list, r.def, r.state, s, ui, clock);
        out.lessons[story.id + ':' + f.counts.set] = L.rows;
        E.finishCounts(cat, story, L.rec ? L.rec.summary : E.counts.summary(r.state), (clock.t += 1000));
      } else throw new Error('unknown frame kind at ' + id);
    }
  });
  // a Training Hollow round of every Count she has learned, with a miss in each
  E.learnedCounts(cat, list).forEach(c => {
    const r = E.hollowStart(cat, list, (clock.t += 1000), c.table);
    E.holdLesson(cat);
    cat.lesson = { mode: 'hollow', state: r.state };
    const q0 = E.counts.question(r.state);
    const L = lesson(E, cat, null, list, r.def, r.state, { miss: [q0.a + 'x' + q0.b], ms: 2500 }, ui, clock);
    out.hollow.push({ table: c.table, queue: clone(r.state.queue.map(q => [q.a, q.b, !!q.hard, !!q.retry, !!q.filler])), rows: L.rows, awarded: L.rec && L.rec.hollow && L.rec.hollow.awarded && L.rec.hollow.awarded.id });
  });
  const b = E.buildFullBook(cat, list);
  out.book = { title: b.title, pages: clone(b.pages), teaser: clone(b.teaser) };
  out.cat = clone({ name: cat.name, petname: cat.petname, look: cat.look, flags: cat.flags, choices: cat.choices, finished: Object.keys(cat.finished),
    dreams: cat.dreams, lessons: cat.lessons, counts: cat.counts, nest: cat.nest, hollow: cat.hollow, chapter: cat.chapter, frame: cat.frame, history: cat.history });
  out.status = E.status(cat, list);
  return out;
}

module.exports = { walk, SCRIPTS, clone };
