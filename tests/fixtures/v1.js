/* The version-1 engine (tests/fixtures/engine-v1.js, as shipped with chapter 1) in a sandbox of
 * its own, with the real chapter 1 loaded beside it, so a test can play chapter 1 through the old
 * engine and the new one side by side, and make real version-1 saves.
 *
 *   const { v1 } = require('./fixtures/v1.js');   const { E, story } = v1();
 *
 * Also the scripted player both engines share: play(E, story, cat, script) walks a chapter the way
 * the UI does (the lesson recorded at its last answer, then the counts frame's Next).
 * Not a test file (node --test only runs *.test.js).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');

function v1() {
  const ctx = { console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'engine-v1.js'), 'utf8'), ctx, { filename: 'engine-v1.js' });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'app/story/ch01.js'), 'utf8'), ctx, { filename: 'ch01.js' });
  return { E: ctx.PC.engine, story: ctx.PC.story.ch01, PC: ctx.PC };
}

/* The answers she types: `miss` lists the facts ("3x1") she gets wrong the first time asked
 * (a retry is answered right), `allWrong` gets every answer wrong, `ms` is her time. */
function answerFor(q, script) {
  if (script.allWrong) return q.answer + 1;
  const miss = (script.miss || []).includes(q.a + 'x' + q.b) && !q.retry && !q.filler;
  return miss ? q.answer + 1 : q.answer;
}

/* Run a lesson (chapter or Hollow) to its end or for `steps` answers, logging every answer on the
 * cat the way the UI does. Returns what was recorded at the last answer (or null). */
function runLesson(E, cat, def, st, script, steps) {
  let n = 0, rec = null, t = script.t || 1000;
  while (!E.counts.done(st) && (steps == null || n < steps)) {
    const q = E.counts.question(st);
    const res = E.counts.answer(st, def, answerFor(q, script), script.ms || 3000, t += 1000);
    E.logAnswer(cat, res.entry);
    if (res.done) rec = E.recordLesson(cat, st);
    else if (st.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, state: st };
    else cat.lesson = { mode: st.mode, state: st };
    n++;
  }
  script.t = t;
  return rec;
}

/* Walk a chapter from the cat's current frame until `stop` (a frame id) or the end. `script`:
 * { look, petname, clanname, dream, choices: { frameId: index }, miss: ['3x1'], ms, t, stopIn: { frameId: answers } }
 * `chapterLesson` (the new engine's E.chapterLesson) starts lessons when given; else the v1 way. */
function play(E, story, cat, script, stop) {
  const seen = [];
  for (let guard = 0; guard < 400; guard++) {
    const id = E.frameId(cat, story);
    seen.push(id);
    if (stop && id === stop) return seen;
    const f = story.frames[id];
    const kind = E.kindOf(f);
    const t = (script.t = (script.t || 1000) + 1000);
    if (kind === 'end') return seen;
    if (kind === 'next' || kind === 'skip') E.next(cat, story, t);
    else if (kind === 'look') E.confirmLook(cat, story, script.look || null, t);
    else if (kind === 'choice') E.choose(cat, story, (script.choices || {})[id] || 0, t);
    else if (kind === 'input') {
      const k = f.input.kind;
      E.submitInput(cat, story, k === 'petname' ? script.petname : k === 'clanname' ? script.clanname : k === 'dream' ? script.dream : '', t);
    } else if (kind === 'counts') {
      const setId = f.counts.set;
      let def, st;
      if (cat.lesson && cat.lesson.frame === id && cat.lesson.state && !E.counts.done(cat.lesson.state)) {
        def = Object.assign({ id: setId }, story.counts[setId]); st = cat.lesson.state;
      } else if (E.chapterLesson) {
        ({ def, state: st } = E.chapterLesson(cat, story, setId, t));
        cat.lesson = { mode: 'chapter', frame: id, state: st };
      } else {
        def = Object.assign({ id: setId }, story.counts[setId]);
        st = E.counts.start(def, { set: setId, mode: 'chapter', now: t });
        cat.lesson = { mode: 'chapter', frame: id, state: st };
      }
      const steps = script.stopIn && script.stopIn[id];
      const rec = runLesson(E, cat, def, st, script, steps);
      if (!E.counts.done(st)) return seen;           // stopped mid-lesson
      E.finishCounts(cat, story, rec ? rec.summary : E.counts.summary(st), script.t += 1000);
    } else throw new Error('unknown frame kind at ' + id);
  }
  throw new Error('chapter did not end');
}

/* A Hollow round of the 1s through either engine (the v1 signature is (cat, story, now)). */
function hollowRound(E, cat, story, script, steps) {
  const r = E.hollowStart(cat, story, script.t += 1000, 1);
  cat.lesson = { mode: 'hollow', state: r.state };
  return { def: r.def, state: r.state, rec: runLesson(E, cat, r.def, r.state, script, steps) };
}

const LOOK = { sex: 'she', fur: 'calico', marking: 'white-paws', eyes: 'odd' };
/* A whole chapter-1 script: every choice, a miss in the lesson (3 × 1 and 1 × 7). */
function script(over) {
  return Object.assign({
    look: LOOK, petname: 'princess sparkle muffin', clanname: 'moonpaw', dream: 'i dreamed about otters sliding down a hill',
    choices: {}, miss: ['3x1', '1x7'], ms: 3000, t: 1000
  }, over || {});
}

module.exports = { v1, play, runLesson, hollowRound, script, LOOK, ROOT };
