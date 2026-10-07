/* Records tests/fixtures/ch02-golden.json: chapter 1 and then chapter 2 read through the engine as
 * it was when chapter 2 shipped (0.2.0), with the page's words for each question and help as
 * ui.js said them then (the copy below). Run once, before chapter 3's engine changes:
 *
 *   node tests/fixtures/make-ch02-golden.js
 *
 * A script added since is recorded the same way with the engine of the chapter 2 commit (346c8dc),
 * from a copy of that tree (`git archive 346c8dc | tar -x -C /some/dir`):
 *
 *   GOLDEN_ROOT=/some/dir node tests/fixtures/make-ch02-golden.js
 *
 * (the ninth, the pile and the check out of fresh pairs, was: the eight before it came out
 * byte-identical).
 *
 * tests/engine.test.js reads the same scripts through today's engine and compares, so chapter 2
 * plays exactly as it did, but for the changes chapter 3's text asks for by name (the test lists
 * them). Not a test file.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { load } = require('../_load.js');
const { walk, SCRIPTS } = require('./golden.js');

/* ui.js's question and help words as chapter 2 shipped them (runLesson's generic, promptLines and
 * help intro; the help's ground came from the picture), with the cat's tokens left for the walker. */
function oldUi(E) {
  const NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const numWord = n => NUMW[n] || String(n);
  const cap1 = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const asList = x => (x == null ? [] : Array.isArray(x) ? x : [x]);
  const look = (D, q) => Object.assign({}, D.picture || {}, q.picture || {});
  function generic(D, q) {
    const things = D.things || 'tails';
    if (look(D, q).layout === 'rows') return cap1(numWord(q.groups)) + ' ' + (q.groups === 1 ? 'row' : 'rows') + ' of ' + numWord(q.per) + '. How many ' + things + '?';
    const unit = D.unit || 'cat', units = D.units || (D.unit ? D.unit + 's' : 'cats');
    return cap1(numWord(q.groups)) + ' ' + (q.groups === 1 ? unit : units) + '. How many ' + things + '?';
  }
  function fillQ(D, q, t) {
    const x = { a: q.a, b: q.b, answer: q.answer, groups: q.groups, per: q.per, thing: D.thing || 'tail', things: D.things || 'tails' };
    return String(t).replace(/\{([A-Za-z]+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(x, k) ? String(x[k]) : m));
  }
  function promptLines(def, D, q) {
    const teacher = D.teacher || def.teacher || 'tallyheart';
    const balloonLines = x => asList(x).map(b => (typeof b === 'string' ? { text: b } : b)).filter(b => b && b.text)
      .map(b => (b.kind === 'caption' ? { text: fillQ(D, q, b.text), kind: 'caption' } : { who: b.who || teacher, text: fillQ(D, q, b.text), kind: b.kind }));
    const again = 'Here’s that one again.';
    if (q.retry) {
      if (typeof q.prompt === 'string') return [{ who: teacher, text: again + ' ' + fillQ(D, q, q.prompt) }];
      if (q.prompt != null) return [{ who: teacher, text: again }].concat(balloonLines(q.prompt));
      return [{ who: teacher, text: again + ' ' + generic(D, q) }];
    }
    if (q.filler && q.from && def.fillIntro) return [{ who: teacher, text: def.fillIntro + ' ' + generic(D, q) }];
    if (q.prompt != null) {
      if (typeof q.prompt === 'string') return [{ who: teacher, text: fillQ(D, q, q.prompt) }];
      return balloonLines(q.prompt);
    }
    if (D.firstPrompt && q.number === 1) return [{ who: teacher, text: fillQ(D, q, D.firstPrompt) }];
    if (D.prompt) return [{ who: teacher, text: fillQ(D, q, D.prompt) }];
    return [{ who: teacher, text: generic(D, q) }];
  }
  function helpIntro(def, D, q, res) {
    const intro = D.helpIntro || 'Let’s scratch it out together.';
    return res.near ? intro : (D.helpIntroFar || intro.replace(/^Close\.\s*/, ''));
  }
  const ground = (def, D, q) => (look(D, q).kind === 'prey' ? 'earth' : 'sand');
  return { promptLines, helpIntro, ground };
}

if (require.main === module) {
  const PC = process.env.GOLDEN_ROOT ? require(path.join(path.resolve(process.env.GOLDEN_ROOT), 'tests/_load.js')).load() : load(), E = PC.engine;
  const list = [PC.story.ch01, PC.story.ch02];
  const out = { engine: E.VERSION, recorded: '2026-10-06', runs: SCRIPTS.map(s => ({ name: s.name, run: walk(E, list, s, oldUi(E)) })) };
  fs.writeFileSync(path.join(__dirname, 'ch02-golden.json'), JSON.stringify(out));
  console.log('wrote tests/fixtures/ch02-golden.json: ' + out.runs.length + ' readings with engine ' + E.VERSION);
}

module.exports = { oldUi };
