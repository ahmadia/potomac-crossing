/* Stand-in chapters 12 to 21 for the take-aways kit's tests (docs/take-aways.md v0.3, section 3's table),
 * until the real ones land: each chapter's lesson as a take set (its `teach`, its 'show' and 'tap'
 * problems, its made warm-up), its story problems as a take set of their own, on plain Counts frames.
 * Every step has a `teach` set (none, ones2, ones, tens, both, mixed, zero, zeros), so the Hollow's store
 * has something to open on. A fresh copy on every call; never registered in PC.story (pass the list):
 *
 *   const stub = require('./fixtures/takes-stub.js');   const { ch12, ch13, list } = stub();
 *
 * `CH` is the table itself: { 12: { teach, lesson: [[a, b, regroup?]…], story: [[a, b]…], warm } … }.
 * Not a test file (node --test only runs *.test.js), and not served (no page loads it).
 */
'use strict';

const CH = {
  12: { teach: 'none', lesson: [[254, 131, 'show'], [58, 23], [76, 42], [475, 132], [368, 145]], story: [[175, 42]] },
  13: { teach: 'ones2', lesson: [[43, 16, 'show'], [70, 34, 'tap'], [85, 39], [97, 52], [486, 253]], story: [[52, 27]] },
  14: { teach: 'ones', warm: true, lesson: [[352, 127, 'show'], [640, 218, 'tap'], [462, 135], [768, 315], [586, 231]], story: [[473, 245]] },
  15: { teach: 'tens', warm: true, lesson: [[526, 254, 'show'], [418, 162, 'tap'], [607, 283], [879, 346], [563, 128]], story: [[735, 391]] },
  16: { teach: 'both', warm: true, lesson: [[432, 178, 'show'], [523, 247, 'tap'], [645, 278], [798, 465], [917, 653]], story: [[811, 356], [624, 357]] },
  17: { teach: 'mixed', warm: true, lesson: [[764, 321], [371, 145], [614, 253], [731, 696], [513, 248]], story: [[382, 345], [48, 19]] },
  18: { teach: 'zero', lesson: [[702, 345, 'show'], [604, 137, 'tap'], [801, 263], [305, 102], [710, 254]], story: [[503, 278], [72, 18]] },
  19: { teach: 'zeros', lesson: [[400, 156, 'show'], [600, 248, 'tap'], [300, 158], [857, 431], [815, 69]], story: [[500, 412], [88, 49], [300, 126]] },
  20: { teach: null, warm: true, lesson: [[503, 478], [700, 349], [912, 468], [410, 136], [786, 452]], story: [[497, 427]] },
  21: { teach: null, lesson: null, story: [[700, 463], [500, 382], [500, 467]], twins: false }
};
const PROMPT12 = 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.';

function fact([a, b, regroup], i, ch) {
  if (!regroup && !(ch === 12 && i === 0)) return [a, b];
  const f = { a, b };
  if (regroup) f.regroup = regroup;
  if (ch === 12 && i === 0) { f.prompt = PROMPT12; f.right = ['One square, two rows, three loose left.']; }
  return f;
}

function chapter(n) {
  const c = CH[n], id = 'ch' + n, counts = {}, frames = {};
  let k = 1;
  const fid = () => 'f' + String(k).padStart(3, '0');
  if (c.lesson) {
    const set = { op: '-', teacher: 'tallyheart', picture: { kind: 'store' }, facts: c.lesson.map((f, i) => fact(f, i, n)),
      praise: ['Yes!', '', 'That’s it.', '', 'Every column.', ''], done: 'Take-aways tell you HOW MANY.' };
    if (c.teach) set.teach = c.teach;
    if (c.warm) set.warm = true;
    counts[id + '-take'] = set;
    frames[fid()] = { board: 'STUB.', counts: { set: id + '-take', next: 'f' + String(k + 1).padStart(3, '0') } };
    k++;
  }
  const story = { op: '-', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
    facts: c.story.map(([a, b], i) => (i === 0 ? { a, b, prompt: [{ who: 'glintstar', text: 'How many are left?' }] } : [a, b])) };
  if (c.twins === false) story.twins = false;
  counts[id + '-story'] = story;
  frames[fid()] = { board: 'STUB.', counts: { set: id + '-story', next: 'f' + String(k + 1).padStart(3, '0') } };
  k++;
  frames[fid()] = { board: 'STUB.', end: true };
  return { id, number: n, module: 2, title: 'Stand-in ' + n, start: 'f001', frames, counts };
}

function stub() {
  const out = { list: [] };
  Object.keys(CH).forEach((n) => { const s = chapter(+n); out['ch' + n] = s; out.list.push(s); });
  return out;
}
stub.CH = CH;
stub.PROMPT12 = PROMPT12;
module.exports = stub;
