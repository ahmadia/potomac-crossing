/* The Warrior Counts' page (docs/warrior-counts.md v0.4, section 7's UI table; README decisions 48 and
 * 49): node --test
 *
 * What the page shows and in which order, checked in Node through the engine, the way app/ui.js runs a
 * sitting: the hub's big button in every state (and what Enter and Read to me name), the opening with
 * Tallyheart's "we start fresh", the sitting question by question (the pauses at 14, 28 and 42, the four
 * paws, a sitting picked up), the result's pages for every variant (the tricky chips under her balloon,
 * the buttons, every token filled), the Hollow's waiting line and tricky paws, the book's "Your ceremony
 * is coming soon.", the grown-ups corner's words ("a slip?"), the storyboard (docs/storyboard/warrior.md)
 * and the Safari tool's test cat (tools/shots.mjs's WARRIOR recipe). The page's own wiring, which needs a
 * browser, is pinned as text, as the suite does for the rest of ui.js. Chapters 1 to 8 are untouched:
 * nothing of this runs for a cat before the Counts are open.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { load, ROOT, scripts } = require('./_load.js');
const PC = load();
require(path.join(ROOT, 'app/story/warrior.js'));
require(path.join(ROOT, 'app/ui.js'));
const E = PC.engine, U = PC.ui.warrior, W = PC.warrior, S = PC.story;
const UI_SRC = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const SHOTS_SRC = fs.readFileSync(path.join(ROOT, 'tools/shots.mjs'), 'utf8');
const DAY = 86400000, HOUR = 3600000;

/* ------------------------------------------------------------------ a cat, and sittings as the page runs them */

function catAfter10(o) {
  o = o || {};
  const c = E.blankCat({ now: 1, look: o.look });
  c.name = o.name || 'Moon'; c.petname = o.petname || 'Muffin';
  E.chapters(S).map(s => s.id).concat([W.after]).forEach((id, i) => { c.finished[id] = 1000 + i; });
  // every Count learned (the Hollow's buttons)
  E.countSets(S).forEach(k => { c.lessons[k.setId] = { set: k.setId, mode: 'chapter', answers: 10, correct: 10, fast: 5, facts: 10, firstTry: 10, helped: 0, noHelp: true, finished: true }; });
  return c;
}
/* One sitting, run as runLesson runs it: before each question the pause (UI.warrior.pause), then the
 * question asked as E.warriorAsk's set, the answer logged, the sitting kept after it, recorded at the
 * last. `wrong(q, i)` says which to miss; `stop` stops after that many answers (a sitting left partway).
 * Returns what the page would have shown on the way. */
function sitting(cat, t, wrong, stop) {
  const r = E.warriorBegin(cat, S, t), st = r.state, out = { begin: r, st, pauses: [], paws: [], asked: [], said: [], rec: null };
  let n = 0;
  while (!E.counts.done(st) && (stop == null || n < stop)) {
    const P = U.pause(E, W, st);
    if (P) out.pauses.push(P);
    const q = E.counts.question(st), D = E.warriorAsk(r.def, st, q, S);
    out.asked.push(q);
    out.said.push(E.promptLines(r.def, D, q));
    const miss = !!(wrong && wrong(q, n));
    t += 8000;
    const res = E.counts.answer(st, D, miss ? q.a * q.b + 1 : q.a * q.b, miss ? 6000 : 2500, t);
    E.logAnswer(cat, res.entry);
    if (res.done) out.rec = E.recordLesson(cat, st); else E.warriorKeep(cat, st, t);
    out.paws.push(U.paws(E.warriorPaws(st), st.log.length));
    n++;
  }
  out.t = t;
  return out;
}
// her misses: the first `k` questions with a 7 or an 8 in them, never 10 × 10
const missing = k => { let left = k; return q => { if (left > 0 && !(q.a === 10 && q.b === 10) && [q.a, q.b].some(x => x === 7 || x === 8)) { left--; return true; } return false; }; };
const missAny = k => { let left = k; return q => { if (left > 0 && !(q.a === 10 && q.b === 10)) { left--; return true; } return false; }; };
const state = (cat, t) => E.warriorState(cat, S, t);
const hub = (cat, t) => U.hub(state(cat, t), E.progress(cat, S));
const fillAll = (cat, f, tokens) => [].concat(E.captions(f, cat), E.balloons(f, cat).map(b => b.text)).map(x => E.fill(x, cat, tokens));

/* ------------------------------------------------------------------ the hub */

test('the hub: no Warrior Counts before chapter 10 is finished (the hub as it always was, for every fixture save and every cat of chapters 1 to 8)', () => {
  const c = E.blankCat({ now: 1 });
  // (every chapter built but the one the Counts open after, so it holds once chapter 10 is in PC.story)
  E.chapters(S).filter(s => s.id !== W.after).forEach((s, i) => { c.finished[s.id] = 1000 + i; });
  assert.equal(U.hub(state(c, 5), E.progress(c, S)), null, 'every chapter built finished, chapter 10 not: closed');
  assert.equal(c.warrior, undefined, 'reading the state adds nothing to a cat');
  const saves = require('./fixtures/v1-saves.json');
  const list = Array.isArray(saves) ? saves : Object.values(saves);
  let n = 0;
  list.forEach((sv) => {
    const m = E.migrate(JSON.parse(JSON.stringify(sv && sv.save ? sv.save : sv)));
    (m && m.cats || []).forEach(cat => { n++; assert.equal(U.hub(state(cat, 5), E.progress(cat, S)), null); assert.equal(cat.warrior, undefined); });
  });
  assert.ok(n > 0, 'fixture cats checked: ' + n);
});

test('the hub’s big button in every state: never sat, a sitting to pick up (its paw), a not-yet, an unseen result first; passed: the quiet “again” and, while the Ceremony is unbuilt, “Your ceremony is coming soon.”; no chapter’s “coming soon” while they are open', () => {
  const c = catAfter10();
  let t = Date.UTC(2026, 10, 2, 15);
  let h = hub(c, t);
  assert.deepEqual(h.big, { id: 'warriorBtn', act: 'begin', label: 'The Warrior Counts', small: 'When you’re ready', says: 'The Warrior Counts. When you’re ready.' });
  assert.equal(h.hideSoon, true, 'chapter 8’s (or 10’s) teaser does not show');
  assert.equal(h.quiet, null); assert.equal(h.soon, null);
  // opened and left before her first answer: nothing to keep going with, so no "Keep going · first paw";
  // the same tap picks that sitting up within its two hours and plays its opening again
  const opened = catAfter10();
  const ob = E.warriorBegin(opened, S, t);
  h = hub(opened, t + 5 * 60000);
  assert.deepEqual([h.big.label, h.big.small], ['The Warrior Counts', 'When you’re ready'], 'a sitting with no answer is not one in progress');
  const ob2 = E.warriorBegin(opened, S, t + 6 * 60000);
  assert.deepEqual([ob2.state === ob.state, U.openKind(ob2.opening).kind], [true, 'first']);
  // partway: the paw she is on
  const part = sitting(c, t, null, 20);
  t = part.t + 60000;
  h = hub(c, t);
  assert.deepEqual([h.big.act, h.big.label, h.big.small, h.big.says], ['begin', 'Keep going', 'The Warrior Counts · second paw', 'Keep going: the Warrior Counts, second paw.']);
  // more than two hours on, it is stale: never "Keep going"
  h = hub(c, t + 2 * HOUR + 1);
  assert.equal(h.big.label, 'The Warrior Counts');
  assert.equal(h.big.small, 'When you’re ready', 'a sitting set aside is never a not-yet');
  // a finished not-yet: its result first, until it is seen; then "Try again"
  t += 3 * HOUR;
  sitting(c, t, missing(8));
  h = hub(c, t + 20 * 60000);
  assert.deepEqual([h.big.act, h.big.small, h.big.says], ['result', 'Glintstar is waiting', 'The Warrior Counts. Glintstar is waiting.']);
  E.warriorSeen(c);
  h = hub(c, t + 20 * 60000);
  assert.deepEqual([h.big.act, h.big.label, h.big.small], ['begin', 'The Warrior Counts', 'Try again whenever you like']);
  // the third paw of a later sitting
  t += DAY;
  const p3 = sitting(c, t, null, 30);
  h = hub(c, p3.t + 1000);
  assert.equal(h.big.small, 'The Warrior Counts · third paw');
  // a pass (the sitting picked up and finished): unseen first, then the quiet "again" under the Ceremony's slot
  const res = E.warriorBegin(c, S, p3.t + 2000);
  assert.equal(U.openKind(res.opening).kind, 'resume');
  let tt = p3.t + 2000;
  while (!E.counts.done(res.state)) {
    U.pause(E, W, res.state);
    const q = E.counts.question(res.state); tt += 8000;
    const r = E.counts.answer(res.state, E.warriorAsk(res.def, res.state, q, S), q.a * q.b, 2000, tt);
    E.logAnswer(c, r.entry);
    if (r.done) E.recordLesson(c, res.state); else E.warriorKeep(c, res.state, tt);
  }
  h = hub(c, tt + 1000);
  assert.equal(h.big.act, 'result');
  // (passed, unseen: nothing on the hub gives the pass away before Glintstar says it: no quiet "again",
  // no "Your ceremony is coming soon.", and the Ceremony's chapter button waits too)
  assert.deepEqual([h.quiet, h.soon, h.hideNext], [null, null, true], 'unseen: the pass is Glintstar’s to say');
  assert.deepEqual([U.afterPassUnseen(state(c, tt + 1000)), U.passShown(state(c, tt + 1000))], [false, false], 'her first pass, unseen: the book waits too');
  assert.equal(U.passShown(Object.assign({}, state(c, tt + 1000), { passedAt: undefined })), false, 'a state that cannot tell: waits');
  assert.equal(U.hub(state(c, tt + 1000), { next: { id: 'ch11' } }).hideNext, true);
  E.warriorSeen(c);
  h = hub(c, tt + 1000);
  assert.equal(h.big, null, 'passed: the big button is the Ceremony’s chapter, as any chapter’s');
  assert.equal(h.soon, 'Your ceremony is coming soon.');
  assert.deepEqual(h.quiet, { id: 'warriorAgain', act: 'begin', label: 'The Warrior Counts again' });
  assert.equal(h.hideNext, false);
  // with the Ceremony built (E.progress's next): no "coming soon"; nor once it is finished (no next, but built)
  assert.equal(U.hub(state(c, tt), { next: { id: 'ch11' } }).soon, null);
  assert.equal(U.hub(state(c, tt), { next: null, ceremonyBuilt: true }).soon, null, 'the Ceremony had: never “coming soon” after it');
  assert.equal(U.hub(state(c, tt), { next: null, ceremonyBuilt: false }).soon, 'Your ceremony is coming soon.');
  // a sitting again after the pass, left partway: the quiet button picks it up
  sitting(c, tt + DAY, null, 5);
  assert.equal(hub(c, tt + DAY + 60000).quiet.label, 'Keep going: the Warrior Counts');
  // a sitting again after the pass, under 50 (the one left partway set aside): the Ceremony's slot and the
  // quiet "again" stay; never "Try again whenever you like" for a cat who has passed
  sitting(c, tt + 3 * DAY, missAny(10));
  assert.equal(E.warriorResult(c, S).variant.kind, 'afterPass');
  // its result unseen (the page closed after the 55th answer): her pass is known and kept for good, so
  // nothing is given away; the result waits in the quiet slot and the Ceremony keeps the big one (its
  // chapter button, "Keep reading Chapter 11" partway, is never hidden)
  h = hub(c, tt + 3 * DAY + HOUR);
  assert.deepEqual([h.big, h.hideNext, h.soon], [null, false, 'Your ceremony is coming soon.']);
  assert.deepEqual([U.afterPassUnseen(state(c, tt + 3 * DAY + HOUR)), U.passShown(state(c, tt + 3 * DAY + HOUR))], [true, true], 'the book says “Your ceremony is coming soon.” too');
  assert.deepEqual(h.quiet, { id: 'warriorAgain', act: 'result', label: 'The Warrior Counts: Glintstar is waiting' });
  const hc = U.hub(state(c, tt + 3 * DAY + HOUR), { next: { id: 'ch11' }, nextInProgress: true, ceremonyBuilt: true });
  assert.deepEqual([hc.big, hc.hideNext, hc.soon, hc.quiet.act], [null, false, null, 'result']);
  E.warriorSeen(c);
  h = hub(c, tt + 3 * DAY + HOUR);
  assert.equal(h.big, null);
  assert.equal(h.quiet.label, 'The Warrior Counts again');
  // a sitting again that passes, unseen: the same quiet slot (only her first pass waits in the big one)
  sitting(c, tt + 5 * DAY);
  assert.deepEqual([hub(c, tt + 5 * DAY + HOUR).hideNext, hub(c, tt + 5 * DAY + HOUR).quiet.act], [false, 'result']);
});

test('the hub with the Ceremony built: a stand-in Ceremony (`opensWhen: \'warrior\'`), finished, never says “Your ceremony is coming soon.”; the page tells it from the chapters, not from “no next chapter”', () => {
  const C11 = { id: 'ch11', number: 11, title: 'Stand-in ceremony', opensWhen: 'warrior', start: 'f001', frames: { f001: { board: 'STUB.', next: 'f002' }, f002: { board: 'STUB.', end: true } } };
  const c = catAfter10();
  const t = Date.UTC(2026, 10, 9, 15);
  sitting(c, t, null);
  E.warriorSeen(c);
  c.finished.ch11 = t + HOUR;
  const p = E.progress(c, E.chapters(S).concat([C11]));
  assert.equal(p.next, null, 'the Ceremony finished: no next chapter');
  assert.equal(U.hub(state(c, t + 2 * HOUR), Object.assign({}, p, { ceremonyBuilt: true })).soon, null);
  assert.match(UI_SRC, /var built = E\.chapters\(stories\(\)\)\.some\(function \(s\) \{ return s\.opensWhen === 'warrior'; \}\);\n    var h = wHub\(warriorNow\(\), Object\.assign\(\{\}, p, \{ ceremonyBuilt: built \}\)\);/);
});

test('the hub’s page: the big button’s id and its Enter key, Read to me naming whichever holds the big slot, read again on a tap and on visibilitychange; the button and the "again" in the hub before the book, chapter 8’s hub unchanged when there is none', () => {
  assert.match(UI_SRC, /var WH = hubWarrior\(p\), wbig = '', wquiet = '';/);
  assert.match(UI_SRC, /'<div class="hub">' \+ wbig \+ big \+ soon \+ wquiet \+/);
  assert.match(UI_SRC, /var bb = \$\('warriorBtn'\) \|\| \$\('nextChapter'\), here = doc\.activeElement === doc\.body \|\| \(!!WH && doc\.activeElement === \$\('screen'\)\);/,
    'Enter: the big slot; with the Counts’ slot also once a tap has focused the page (chapter 8’s hub as it was)');
  assert.match(UI_SRC, /if \(WH\.hideNext && big\) \{ big = ''; bigSays = ''; \}/, 'an unseen result: the Ceremony’s button waits');
  // the hub's wiring: a tap re-reads through `tap`, never straight to the screen; visibilitychange redraws when the slot changed
  assert.match(UI_SRC, /\$\('warriorBtn'\)\.addEventListener\('click', function \(\) \{ tap\(WH\.big\.act\); \}\);/);
  assert.match(UI_SRC, /\$\('warriorAgain'\)\.addEventListener\('click', function \(\) \{ tap\(WH\.quiet && WH\.quiet\.act === 'result' \? 'result' : 'begin'\); \}\);/, 'the quiet slot: again, or a result after the pass');
  assert.match(UI_SRC, /hubWarrior\(E\.progress\(cat, stories\(\)\)\);\n      if \(hubWarriorSig !== was\) go\('hub', \{ keepScroll: true \}\);/);
  assert.match(UI_SRC, /if \(WH\) currentSpeech = \[\{ text: E\.displayName\(cat\) \+ ', apprentice of CrystalClan\.' \}\]\.concat\(WH\.big \? \[\{ text: WH\.big\.says \}\] : \[\]\)/);
  assert.match(UI_SRC, /doc\.addEventListener\('visibilitychange', function \(\) \{\n(?:.*\n){0,4}      if \(doc\.visibilityState !== 'visible' \|\| view\.name !== 'hub' \|\| !cat \|\| hubWarriorSig == null/);
  assert.match(UI_SRC, /hubWarrior\(E\.progress\(cat, stories\(\)\)\);\n      if \(hubWarriorSig !== drawn\) return go\('hub', \{ keepScroll: true \}\);/, 'a tap reads the state again and redraws when it changed');
  // the hub as it always was when the slot is empty (WH null): the same markup and words
  assert.match(UI_SRC, /currentSpeech = \[\{ text: E\.displayName\(cat\) \+ ', apprentice of CrystalClan\.' \}\]\.concat\(p\.next \? \[\{ text: bigSays \}\] : p\.soon \? \[\{ text: p\.soon\.title \+ ' is coming soon\.' \}\] : \[\]\);/);
});

/* ------------------------------------------------------------------ the opening */

test('the opening: the first sitting’s four panels; then one, the Clan again or the camp quiet; Tallyheart’s “we start fresh” at the start of her balloon once, before “Every Count, same as before.”; a sitting picked up opens on “Where were we? Ah, yes.”; the story’s frames are never changed', () => {
  const before = JSON.stringify(W);
  const first = U.opening(W, 'first', null);
  assert.equal(first.length, 4);
  assert.deepEqual(first.map(f => f.board), W.open.first.map(f => f.board));
  ['late', 'practice'].forEach(why => ['again', 'quiet'].forEach(kind => {
    const L = U.opening(W, kind, why);
    assert.equal(L.length, 1);
    const tb = L[0].say.filter(b => b.who === 'tallyheart');
    assert.equal(tb.length, 1, 'one balloon of hers');
    assert.equal(tb[0].text, W.aside[why] + ' Every Count, same as before. I’m right here.');
  }));
  assert.equal(U.opening(W, 'quiet', null)[0].say[0].text, 'Every Count, same as before. I’m right here.');
  assert.equal(JSON.stringify(W), before, 'copies: the story is as it was');
  // through the engine: which opening, and the aside of a sitting set aside before
  const c = catAfter10();
  let t = Date.UTC(2026, 10, 2, 15);
  let r = E.warriorBegin(c, S, t);
  assert.deepEqual(U.openKind(r.opening), { kind: 'first', aside: null });
  const part = sitting(c, t, null, 6);
  r = E.warriorBegin(c, S, part.t + 60000);
  assert.deepEqual(U.openKind(r.opening), { kind: 'resume', aside: null }, 'picked up: the runner’s intro');
  assert.deepEqual(W.open.resume, [{ who: 'tallyheart', text: 'Where were we? Ah, yes.' }]);
  r = E.warriorBegin(c, S, part.t + 3 * HOUR);
  assert.deepEqual(U.openKind(r.opening), { kind: 'again', aside: 'late' }, 'two hours on: set aside, the Clan again, and why');
  assert.match(U.opening(W, 'again', 'late')[0].say[0].text, /^It’s been a while, so we start fresh\. Every Count/, 'two hours can be the same day: never “a new day”');
  assert.match(U.opening(W, 'quiet', 'practice')[0].say[0].text, /^You’ve been practicing, so we start fresh\. Every Count/);
  // the page: Back beside Next, stepping back within the list; the last Next starts the first question
  assert.match(UI_SRC, /back: i > 0 \? function \(\) \{ go\('warrior', \{ step: 'open', i: i - 1, back: true \}\); \} : null,/);
  assert.match(UI_SRC, /go\('warrior', i \+ 1 < list\.length \? \{ step: 'open', i: i \+ 1 \} : \{ step: 'q' \}\);/);
  assert.match(UI_SRC, /var rs = resume && PC\.warrior\.open \? PC\.warrior\.open\.resume : null;/);
});

/* ------------------------------------------------------------------ the sitting */

test('a sitting, question by question as the page runs it: 55 asked, Glintstar asking each in words (Read to me says her balloon, not the question line); the pauses at 14 and 42 with Tallyheart’s lines, the halfway page at 28, each once; the four paws fill by quarters, a miss the same as a right one, never back', () => {
  const c = catAfter10();
  const run = sitting(c, Date.UTC(2026, 10, 2, 15), missAny(9));
  assert.equal(run.asked.length, 55);
  assert.deepEqual(run.pauses.map(p => [p.at, !!p.halfway]), [[14, false], [28, true], [42, false]]);
  assert.deepEqual(run.pauses[0].lines, [{ who: 'tallyheart', text: 'One paw done. Your whiskers are wide awake now.' }]);
  assert.deepEqual(run.pauses[2].lines.map(l => l.text), ['Three paws done. Just one more paw.'], 'one more paw, never “one to go” (thirteen questions are left)');
  assert.deepEqual(run.st.beats.slice().sort((a, b) => a - b), [14, 28, 42], 'kept on the sitting');
  // Glintstar's balloon asks each one (the question line is the page's, in Andika, never read again)
  run.said.slice(0, 54).forEach((lines, i) => {
    assert.deepEqual(lines.map(l => l.who), ['glintstar'], 'question ' + (i + 1));
    assert.match(lines[0].text, /^[A-Z][a-z]+ times [a-z]+\.$/);
  });
  assert.deepEqual(run.said[54].map(l => l.kind === 'caption' ? 'caption: ' + l.text : l.who + ': ' + l.text), ['caption: At last:', 'glintstar: Ten times ten.']);
  assert.deepEqual([run.asked[54].a, run.asked[54].b], [10, 10]);
  assert.match(UI_SRC, /speakItems\(warrior \? heard : heard\.concat\(\[\{ text: E\.counts\.ask\(def, q\) \}\]\),/);
  // the paws: by quarters (14, 14, 14, 13), the one she is on a little more at every answer
  const sums = run.paws.map(p => p.reduce((a, b) => a + b, 0));
  sums.forEach((s, i) => { if (i) assert.ok(s > sums[i - 1], 'answer ' + (i + 1) + ' fills a little more'); });
  run.paws.forEach((p, i) => p.forEach((f, k) => { if (i && run.paws[i - 1][k] === 1) assert.equal(f, 1, 'a full paw stays full'); }));
  assert.deepEqual(run.paws[13], [1, 0, 0, 0]);
  assert.deepEqual(run.paws[27], [1, 1, 0, 0]);
  assert.deepEqual(run.paws[41], [1, 1, 1, 0]);
  assert.deepEqual(run.paws[54], [1, 1, 1, 1]);
  assert.deepEqual(U.pawFills(20).map(x => Math.round(x * 14)), [14, 6, 0, 0], 'the page’s own count agrees');
  assert.deepEqual([U.pawOn(0), U.pawOn(13), U.pawOn(14), U.pawOn(28), U.pawOn(42), U.pawOn(54)], [0, 0, 1, 2, 3, 3]);
  // the pauses stay 2.5 s, or 3.5 s when the line is over six words, or as long as their words take to
  // read (U.readMs: 0.6 s and 0.38 s a word) when that is longer, Read to me off; with it on, that long at
  // the most after its speech (the pause pins in the timing test)
  assert.equal(U.beatMs(W.beats[42]), 3500, 'seven words: 3.5 s, longer than their 3.26 s of reading');
  assert.equal(U.beatMs(W.beats[14]), 4020, 'nine words: their reading, 4.0 s');
  assert.equal(U.beatMs(['Yes. On we go.']), 2500, 'four: 2.5 s');
  assert.equal(U.beatMs(['Three paws done. One paw left.']), 2880, 'six: their reading');
  assert.equal(U.beatMs(['Your whiskers are wide awake now, Moonpaw.']), 3500, 'seven');
  // picked up right at a pause: "Where were we? Ah, yes." first (W.open.resume), and the pause waits for
  // all of it, 14 words at 14 and 12 at 42
  const resumed = at => W.open.resume.map(l => ({ who: l.who, text: l.text })).concat(W.beats[at].map(l => typeof l === 'string' ? { who: 'tallyheart', text: l } : l));
  assert.equal(U.beatMs(resumed(14)), 5920, 'picked up at 14: about 5.9 s');
  assert.equal(U.beatMs(resumed(42)), 5160, 'picked up at 42: about 5.2 s');
  [14, 42].forEach(at => {
    const lines = resumed(at);
    assert.ok(U.beatMs(lines) >= U.readMs(lines.map(l => l.text).join(' '), false), at + ': never less than its reading');
  });
  // recorded at the last answer, through E.recordLesson
  assert.equal(run.rec.mode, 'warrior');
  assert.equal(c.lesson, null, 'never the chapter’s lesson slot');
  assert.equal(c.warrior.sitting, null);
});

test('a sitting picked up keeps its place: the same question, queue and paws; a pause it has shown never comes again; one picked up at 28 opens on the halfway page', () => {
  const c = catAfter10();
  let t = Date.UTC(2026, 10, 3, 9);
  const a = sitting(c, t, null, 16);
  assert.deepEqual(a.pauses.map(p => p.at), [14]);
  const pos = a.st.pos, queue = JSON.stringify(a.st.queue.map(q => [q.a, q.b])), paws = U.paws(E.warriorPaws(a.st));
  const back = E.warriorBegin(c, S, a.t + 30 * 60000);
  assert.equal(back.state.pos, pos);
  assert.equal(JSON.stringify(back.state.queue.map(q => [q.a, q.b])), queue);
  assert.deepEqual(U.paws(E.warriorPaws(back.state)), paws);
  assert.equal(U.pause(E, W, back.state), null, 'the 14th’s pause was shown: never again');
  // to 28, left there, picked up: the halfway page first
  const c2 = catAfter10();
  const b = sitting(c2, t, null, 28);
  assert.deepEqual(b.pauses.map(p => p.at), [14]);
  const again = E.warriorBegin(c2, S, b.t + 60000);
  const P = U.pause(E, W, again.state);
  assert.deepEqual([P.at, P.halfway], [28, true]);
  assert.equal(U.pause(E, W, again.state), null);
  // the page: Keep going from the halfway page, no Back there; the sitting kept after every answer in its own slot
  assert.match(UI_SRC, /warriorPlate\(f, 'halfway', \{ back: false, buttons: \[\{ id: 'keepGoing', label: 'Keep going', big: true,/);
  assert.match(UI_SRC, /else if \(warrior\) E\.warriorKeep\(cat, st, now\(\)\);\n      else if \(o\.mode === 'chapter'\)/);
  assert.match(UI_SRC, /asSet\(warrior \? E\.warriorAsk\(def, st, q, stories\(\)\) : E\.questionDef\(def, q, story, stories\(\)\)\);/);
});

test('the runner’s timing in a sitting, Read to me on or off: a pause ends when its line has been said and half a second more, or at most its own length after that (a voice that never says it has finished, Read to me switched off partway, or on); a hard fact’s line stays until it can be said or read to its end; the help’s first line is said before the count; her clock starts again at the latest when the question would have been said', () => {
  // how long Read to me takes: about 150 words a minute at rate 1, each speaker at their own rate
  assert.equal(U.speechMs([{ text: 'One paw done. Your whiskers are wide awake now.', who: 'tallyheart' }]), 3789);
  assert.equal(U.speechMs([{ text: 'Seven times eight.', who: 'glintstar' }]), 1263);
  assert.equal(U.speechMs([{ text: '7 × 8', who: 'tallyheart' }]), 1263, '× is said as “times”');
  // a line she reads herself: the runner's 1.3 s or 1.5 s, longer for a long line
  assert.equal(U.readMs('Yes.', false), 1500);
  assert.equal(U.readMs('Quick as a pounce!', true), 2120);
  assert.equal(U.readMs('Last time, 7 × 8 made you stop and think. Not today!', true), 4780);
  const reader = catAfter10();
  W.counts.remembered.concat(W.counts.rememberedSlow).filter(Boolean).forEach(l => {
    const f = E.fill(l, reader, { a: 7, b: 8 });
    assert.ok(U.readMs(f, true) >= 2800, 'read, nearly twice the runner’s 1.5 s at the least: ' + f);
    assert.ok(Math.max(2600, U.speechMs([{ text: f, who: 'tallyheart' }]) + 400) >= U.speechMs([{ text: f, who: 'tallyheart' }]), 'said: ' + f);
  });
  // the page (a browser's, pinned as text): only in a sitting; chapters 1 to 8 as they were
  assert.match(UI_SRC, /speakItems\(heard, function \(\) \{ later\(end, 500\); \}\);\n        if \(timer\) clearTimeout\(timer\);\n        timer = later\(end, wBeatMs\(lines\) \+ wSpeechMs\(heard\)\);/, 'the pause: the voice’s end, else its length');
  assert.match(UI_SRC, /else timer = later\(end, wBeatMs\(lines\)\);/);
  assert.match(UI_SRC, /if \(save\.settings\.readAloud && pauseRead && pauseRead\(\)\) return;/, 'Read to me switched on during a pause: it waits for the line');
  assert.match(UI_SRC, /if \(done \|\| !scrEl\.isConnected\) return;/, 'a pause whose page has gone never asks');
  assert.match(UI_SRC, /drawPaws\(\); fountain\(\);\n      say\(lines\);/, 'the fountain under a pause, after a miss’s sand or picked up');
  assert.match(UI_SRC, /if \(first && o\.intro && o\.intro\.length\) \{ lines = o\.intro\.slice\(\)\.concat\(lines\); first = false; \}/, 'picked up at a pause: “Where were we?” first');
  assert.match(UI_SRC, /if \(warrior && line\) wait = save\.settings\.readAloud \? Math\.max\(2600, wSpeechMs\(\[\{ text: line, who: teacher \}\]\) \+ 400\) : wReadMs\(line, res\.fast\);/);
  assert.match(UI_SRC, /var wait = !line \? 800 : save\.settings\.readAloud \? 2600 : \(res\.fast \? 1300 : 1500\);/, 'the chapters’ wait as it was');
  assert.match(UI_SRC, /var readFirst = warrior && save\.settings\.readAloud && 'speechSynthesis' in root, startCount = null;/);
  assert.match(UI_SRC, /later\(function \(\) \{ if \(startCount\) startCount\(\); \}, readFirst \? wSpeechMs\(\[\{ text: intro, who: opener \}\]\) \+ 600 : 900\);/, 'the count after the first line (900 ms elsewhere, as it was)');
  assert.match(UI_SRC, /say\(\(warrior && intro \? \[\{ who: opener, text: intro \}\] : \[\]\)\.concat\(\[\{ who: counter, html:/, 'the anchor’s reminder stays above the count on the help’s last page');
  assert.match(UI_SRC, /if \(warrior && save\.settings\.readAloud && 'speechSynthesis' in root\) later\(rc, wSpeechMs\(heard\) \+ 300\);/, 'the clock: at the latest when the question would have been said');
  // what Read to me's button says on the sand's last page and on 10 × 10's Next page: what is there
  assert.match(UI_SRC, /if \(warrior\) saying\(told\);/);
  assert.match(UI_SRC, /if \(warrior\) saying\(lines\.map\(function \(l\) \{ return \{ text: l\.text, who: l\.who \}; \}\)\);/);
});

test('the sitting’s screen left open past its two hours (a question, the halfway page, an opening page): it never takes another answer into the sitting; seen again, or a page turned, it goes to the hub, whose next tap sets it aside and starts afresh', () => {
  const c = catAfter10();
  const t = Date.UTC(2026, 10, 10, 15);
  const part = sitting(c, t, null, 5);
  assert.equal(E.warriorState(c, S, part.t + 2 * HOUR).stale, 'late', 'what the page reads');
  const r = E.warriorBegin(c, S, part.t + 2 * HOUR + 60000);
  assert.deepEqual([r.opening.kind, r.opening.aside, r.state.pos], ['again', 'late', 0], 'the hub’s next tap: a new sitting, “It’s been a while”');
  assert.match(UI_SRC, /if \(warrior && warriorStale\(\)\) \{ wv = null; return go\('hub'\); \}\n      locked = true;/, 'an answer: never into a stale sitting');
  assert.match(UI_SRC, /if \(doc\.visibilityState === 'visible' && view\.name === 'warrior' && view\.opts\.step !== 'result' && cat && wv && wv\.state && warriorStale\(\)\) \{ wv = null; return go\('hub'\); \}/, 'seen again');
  assert.match(UI_SRC, /if \(\(step === 'open' \|\| step === 'q' \|\| step === 'halfway'\) && wv\.state && warriorStale\(\)\) \{ wv = null; return go\('hub'\); \}/, 'a page turned');
  assert.match(UI_SRC, /function warriorStale\(\) \{\n    var ws = warriorNow\(\);\n    return !!\(ws && ws\.stale\);\n  \}/);
});

test('the page’s guards in a sitting: the keypad brought into view after go()’s scroll to the top (a picked-up question’s too); the second tap of a double tap handed over late never turns a page of the Counts; a begun paw shows from its first answer', () => {
  // (and a Training Hollow round picked up, drawn inside go('hollow'), under the Counts' waiting line: a
  // phone, or an iPad with Bigger text, had the keypad's bottom row below the screen's edge; only for a cat
  // with Warrior Counts data, so the Hollow of chapters 1 to 8 is as it was, and only when it is below)
  assert.match(UI_SRC, /if \(warrior \|\| \(o\.mode === 'hollow' && cat && cat\.warrior\)\) later\(function \(\) \{\n        var kb2 = pad\.getBoundingClientRect\(\)\.bottom, vh2 = root\.innerHeight \|\| 0;\n        if \(vh2 && kb2 > vh2\) root\.scrollBy\(0, kb2 - vh2 \+ 8\);\n      \}, 0\);/);
  assert.match(UI_SRC, /def: def, state: st, mode: 'hollow',\n      \/\/ \(a round picked up says nothing first, but the Warrior Counts' waiting line when a sitting is paused\)/, 'the Hollow’s rounds run as mode “hollow”');
  assert.match(UI_SRC, /def: def, state: st, intro: intro, mode: 'chapter',/, 'a chapter’s lesson is mode “chapter”: never re-checked, as at HEAD');
  assert.match(UI_SRC, /if \(now\(\) - renderedAt < UI_GUARD_MS \|\| \(view\.name === 'warrior' && tappedEarly\(e, UI_GUARD_MS\)\)\) \{ e\.stopPropagation\(\); e\.preventDefault\(\); \}/, 'the screen’s guard, by the tap’s own time on the Counts’ pages');
  assert.match(UI_SRC, /var guard = function \(fn\) \{ return function \(e\) \{ if \(now\(\) - renderedAt < 280 \|\| tappedEarly\(e, 280\)\) return; fn\(\); \}; \};/);
  assert.match(UI_SRC, /renderedAt = now\(\); renderedPerf = perfNow\(\);/);
  assert.match(UI_SRC, /y = fl >= 1 \? 0 : Math\.min\(heel - 4\.5, heel - \(heel - top\) \* fl\)/, 'the first answer of a paw fills a visible sliver');
  // the sand's last page, its reminder kept above the count: "Got it!" brought into view on a small screen
  assert.match(UI_SRC, /if \(warrior\) \{\n          var gb = \$\('gotIt'\)\.getBoundingClientRect\(\)\.bottom, gvh = root\.innerHeight \|\| 0;\n          if \(gvh && gb > gvh\) root\.scrollBy\(0, gb - gvh \+ 8\);/);
  // the tricky chips two a row at any text size (a grid), a little smaller with Bigger text, so the
  // not-yet's last page keeps Back and Camp on the screen
  assert.match(HTML, /\.wchips\{display:grid;grid-template-columns:repeat\(2,max-content\);/);
  assert.match(HTML, /html\.big \.wchip\{font-size:\.85em\}/);
  // the tool's own taps on the sand page are past both guards
  assert.match(UI_SRC, /renderedAt = now\(\) - UI_GUARD_MS - 1; renderedPerf = perfNow\(\) - UI_GUARD_MS - 1;/);
});

/* ------------------------------------------------------------------ the result */

function resultOf(cat, o) { return U.result(W, E.warriorResult(cat, S), Object.assign({ countWords: E.countWords }, o || {})); }
function texts(cat, RP) { return RP.pages.map(pg => fillAll(cat, pg.frame, RP.tokens).join(' / ')); }

test('the result, every variant: a first not-yet (the old tom; her number only when it is good news), a second, a later; better, close, plain and the number alone; a pass, clean, quiet; after the pass; the tricky ones as chips under Tallyheart’s balloon; no token left', () => {
  const c = catAfter10();
  let t = Date.UTC(2026, 10, 4, 15);
  const go = (k) => { sitting(c, t, missing(k)); t += DAY; const RP = resultOf(c); E.warriorSeen(c); return RP; };
  let RP = go(11);   // 44: first, plain
  assert.equal(RP.kind, 'notYet');
  let tx = texts(c, RP);
  assert.equal(tx.length, 3);
  assert.match(tx[0], /^Not yet, Moonpaw\. The Counts will wait for you\. \/ Took me THREE tries\. Don’t tell anyone\.$/);
  assert.equal(tx[1], 'Tallyheart walks with you toward the Hollow. / You worked hard on every one.', 'under 45, not better: no number');
  assert.match(tx[2], /^These were the tricky ones\. \/ Let’s practice the [78]s and the [78]s in the Training Hollow\./);
  assert.equal(RP.pages[2].chipsAt, 0, 'under “These were the tricky ones.”');
  assert.ok(RP.pages[2].chips.length === 6 && RP.pages[2].chips.every(x => /^\d+ × \d+ = \d+$/.test(x)), RP.pages[2].chips.join(', '));
  RP.pages[2].chips.forEach(x => { const [a, b, ab] = x.match(/\d+/g).map(Number); assert.equal(a * b, ab); });
  assert.deepEqual(RP.buttons.map(b => [b.label, b.big]), [['Camp', false], ['The Training Hollow', true]]);
  RP = go(9);        // 46, better than 44: the second, better
  tx = texts(c, RP);
  assert.match(tx[0], /I murmured mine in the den every night/);
  assert.match(tx[1], /Forty-six right today\. Fifty is a pass\. Last time it was forty-four!$/);
  RP = go(9);        // 46, no better: later, the number alone
  tx = texts(c, RP);
  assert.match(tx[0], /The Counts aren’t going anywhere\. And neither am I\.$/);
  assert.match(tx[1], /Forty-six right today\. Fifty is a pass\.$/);
  RP = go(7);        // 48, better again
  assert.match(texts(c, RP)[1], /Last time it was forty-six!$/);
  RP = go(7);        // 48, no better: close
  assert.match(texts(c, RP)[1], /Forty-eight right today\. Fifty is a pass\. So close\. Just two more next time\.$/);
  // with a Hollow round in progress the big button goes back to it
  assert.equal(resultOf(c, { hollowRound: true }).buttons[1].label, 'Back to the Training Hollow');
  RP = go(3);        // 52: a pass in a quiet sitting: the Clan comes running
  assert.equal(RP.kind, 'pass');
  tx = texts(c, RP);
  assert.equal(tx.length, 4);
  assert.equal(tx[0], 'Moonpaw. Every Count up to ten times ten, and fifty-two of them right.');
  assert.equal(tx[1], 'Murmurchime yowls, and the whole Clan comes running.');
  assert.match(tx[3], /Did Muffin PASS\?/);
  assert.deepEqual(RP.buttons.map(b => [b.label, !!b.disabled, b.big]), [['Your ceremony is coming soon.', true, false], ['Camp', false, true]]);
  assert.deepEqual(resultOf(c, { ceremony: true }).buttons.map(b => [b.label, b.big, b.act]), [['Camp', false, 'camp'], ['To your ceremony', true, 'ceremony']]);
  RP = go(2);        // 53 after the pass: a passing score, good news: her number
  assert.equal(RP.kind, 'afterPass');
  tx = texts(c, RP);
  assert.deepEqual(tx, ['Fifty-three right, Moonpaw. Your pass is yours for good. / These were the tricky ones.']);
  assert.equal(RP.pages[0].chipsAt, 1);
  assert.equal(RP.pages[0].chips.length, 2);
  assert.deepEqual(RP.buttons.map(b => [b.label, b.big]), [['The Training Hollow', false], ['Camp', true]]);
  RP = go(15);       // 40 after the pass: not good news, so no number (decision 49)
  tx = texts(c, RP);
  assert.deepEqual(tx, ['Your pass is yours for good, Moonpaw. / These were the tricky ones.']);
  assert.equal(RP.pages[0].chips.length, 6);
  RP = go(1);        // 54 after the pass: one chip, its own words
  tx = texts(c, RP);
  assert.deepEqual(tx, ['Fifty-four right, Moonpaw. Your pass is yours for good. / This was the tricky one.']);
  assert.equal(RP.pages[0].chips.length, 1);
  assert.equal(W.afterPass.number.say[1].text, 'These were the tricky ones.', 'a copy: the story’s frame is as it was');
  RP = go(0);        // 55 after the pass: clean
  assert.deepEqual(texts(c, RP), ['Every one. Not one missed. Like Murmurchime.']);
  // a first sitting that passes clean: the crowd was there, so no one comes running
  const d = catAfter10({ name: 'Murmur' });
  sitting(d, t, null);
  const RD = resultOf(d);
  const td = texts(d, RD);
  assert.equal(RD.kind, 'pass');
  assert.equal(td.length, 3, 'no running Clan in a sitting the Clan watched');
  assert.equal(td[0], 'Murmurpaw. Every Count up to ten times ten. Every one. Not one missed. Like Mutterchime.');
  // every page of every variant: no token left
  [c, d].forEach(cat => texts(cat, resultOf(cat)).forEach(x => assert.doesNotMatch(x, /\{/)));
});

test('the result’s pages on the page: Back beside Next within them, the last page’s buttons marking the result seen (E.warriorSeen); the chips in Andika under the balloon, read by Read to me', () => {
  assert.match(UI_SRC, /var seen = function \(fn\) \{ return function \(\) \{ if \(typeof E\.warriorSeen === 'function'\) E\.warriorSeen\(cat\); persist\(\); wv = null; fn\(\); \}; \};/);
  // and every button of the last page goes through it (else the result reopens on every visit, and she
  // could never sit again)
  assert.match(UI_SRC, /act: b\.disabled \? null : seen\(acts\[b\.act\] \|\| acts\.camp\)/);
  assert.match(UI_SRC, /back: i > 0 \? function \(\) \{ go\('warrior', \{ step: 'result', i: i - 1, back: true \}\); \} : null,/);
  assert.match(UI_SRC, /warriorPlate\(warriorFilled\(pg\.frame, RP\.tokens\), 'result-' \+ i, \{/);
  assert.match(UI_SRC, /'<div class="wchips" role="list" aria-label="The tricky ones">'/);
  assert.match(UI_SRC, /stack\.innerHTML = bs\.map\(function \(b, i\) \{ return stackBalloon\(b\) \+ \(ab && ab\.i === i \? ab\.html : ''\); \}\)\.join\(''\);/);
  assert.match(HTML, /\.wchip\{font-family:var\(--digits\);/);
  assert.deepEqual(U.chips([[7, 8], [6, 7], [10, 10], [3, 4], [9, 9], [2, 8], [5, 5]]), ['7 × 8 = 56', '6 × 7 = 42', '10 × 10 = 100', '3 × 4 = 12', '9 × 9 = 81', '2 × 8 = 16'], 'up to six');
  // the variant read as words, whatever its form
  assert.deepEqual(Object.keys(U.variant({ kind: 'notYet', nth: 'second', tone: 'close', clean: false, quiet: true })).sort(), ['close', 'notYet', 'quiet', 'second']);
  assert.deepEqual(Object.keys(U.variant('pass clean')).sort(), ['clean', 'pass']);
  assert.equal(U.tricky([7, 8]), 'the 7s and the 8s');
  assert.equal(U.tricky([9]), 'the 9s');
});

/* ------------------------------------------------------------------ the Hollow, the book, the bar */

test('the Hollow: while a sitting is paused, the waiting line; after a not-yet, the tricky greeting and a small paw on those Counts (gone as each is practiced); the page shows them', () => {
  const c = catAfter10();
  let t = Date.UTC(2026, 10, 5, 15);
  // (her misses in Counts the Hollow has today: until chapters 9 and 10 land, no 8s or 7s there)
  const learned = E.learnedCounts(c, S).map(k => k.table).filter(x => x !== 1);
  const top = learned.slice(-2);
  let left = 10;
  sitting(c, t, q => { if (left > 0 && top.includes(q.a) && top.includes(q.b) || (left > 0 && (top.includes(q.a) || top.includes(q.b)) && learned.includes(q.a) && learned.includes(q.b))) { left--; return true; } return false; });
  E.warriorSeen(c);
  t += HOUR;
  const H = E.hollowLines(c, S, { now: t });
  assert.match(H.greet, /^The [0-9]+s( and the [0-9]+s)? first\? I’ve got the tricky ones? ready\.$/);
  const marked = H.counts.filter(k => k.tricky).map(k => k.table);
  assert.ok(marked.length >= 1 && marked.length <= 2 && marked.every(x => learned.includes(x)), 'marked: ' + marked + ' of ' + learned);
  assert.ok(H.counts.every(k => k.tricky === true || !('tricky' in k)), 'the key only when true');
  const part = sitting(c, t, null, 5);
  const HP = E.hollowLines(c, S, { now: part.t + 60000 });
  assert.equal(HP.waiting, 'Your Warrior Counts are waiting at the fountain. Finish them first, or practice now and start them fresh later.');
  // after a not-yet, with a sitting paused: the waiting line takes the greeting's place (never two
  // "first"s pulling opposite ways); the paws on the buttons still mark the tricky Counts
  assert.match(HP.greet, /first\? I’ve got the tricky/, 'the engine still has both');
  assert.ok(HP.counts.some(k => k.tricky), 'and the paws');
  assert.match(UI_SRC, /say: \[\{ who: 'tallyheart', text: HW\.waiting \|\| HW\.greet \}\]\n    \};\n    if \(HW\.glow\) f\.say\.push/, 'the page: one line of hers, the waiting line when there is one');
  assert.doesNotMatch(UI_SRC, /f\.say\.push\(\{ who: 'tallyheart', text: HW\.waiting \}\)/);
  const balloons = [HP.waiting || HP.greet].concat(HP.glow ? [HP.glow] : []);
  assert.ok(!balloons.some(b => /first\?/.test(b)), 'no “first?” greeting over the waiting line: ' + balloons.join(' | '));
  assert.match(UI_SRC, /\(d\.tricky \? '<i class="trickypaw" role="img" aria-label="tricky ones">' \+ ICON\.paw \+ '<\/i>' : ''\)/);
  assert.match(UI_SRC, /var HW = E\.hollowLines\(cat, stories\(\), cat\.warrior \? \{ reward: !!\(opts && opts\.reward\), now: now\(\), tricky: wTrickyDue \} : \{ reward: !!\(opts && opts\.reward\) \}\);\n    wTrickyDue = false;/, 'a cat with no Counts: the Hollow’s call as it was');
});

test('the Hollow with a round in progress and a sitting paused: the round picks up with the waiting line over its next question (Read to me says it first), so an answer there never sets the sitting aside unwarned; a cat with no Counts picks up as today', () => {
  const c = catAfter10();
  const t = Date.UTC(2026, 10, 7, 15);
  // a round of the 2s, three answers, left; then a sitting, five answers, left (the round's answers came first)
  const h = E.hollowStart(c, S, t, 2);
  c.lesson = { mode: 'hollow', state: h.state };
  for (let i = 0; i < 3; i++) { const q = E.counts.question(h.state); E.logAnswer(c, E.counts.answer(h.state, h.def, q.a * q.b, 2000, t + 1000 * (i + 1)).entry); }
  const part = sitting(c, t + 5 * 60000, null, 5);
  assert.ok(E.hollowRound(c) && !E.counts.done(E.hollowRound(c).state), 'the round is there to pick up');
  assert.equal(E.warriorState(c, S, part.t + 60000).stale, null, 'the sitting is waiting');
  assert.equal(E.hollowLines(c, S, { now: part.t + 60000 }).waiting, E.WARRIOR_WAITING, 'so the round picks up under the waiting line');
  // the page: the resume branch passes it as the round's intro (runLesson says an intro first, Read to me too)
  assert.match(UI_SRC, /var wl = cat\.warrior \? E\.hollowLines\(cat, stories\(\), \{ now: now\(\) \}\)\.waiting : null;\n        return hollowLesson\(E\.hollowDef\(stories\(\), tbl\), HL\.state, true, wl\);/);
  assert.match(UI_SRC, /intro: resume \? \(waiting \? \[\{ who: 'tallyheart', text: waiting \}\] : \[\]\) : \[\{ who: 'tallyheart', text: E\.hollowRoundLine\(def\) \}\],/);
  // a cat with no `warrior` data: nothing waits, the round picks up with nothing said, as today
  const plain = E.blankCat({ now: 1 });
  assert.equal(E.hollowLines(plain, S, { now: t }).waiting, undefined);
});

test('the not-yet’s “Back to the Training Hollow” picks the round up first; the tricky greeting waits for the Hollow page after it (its reward’s “Another round” too), once', () => {
  assert.match(UI_SRC, /var round = !!E\.hollowRound\(cat\);\n    var RP = wResult\(PC\.warrior, R, \{\n      quiet: warriorQuietPass\(\), ceremony: !!ceremony, hollowRound: round, countWords: E\.countWords/);
  assert.match(UI_SRC, /hollow: function \(\) \{ wTrickyDue = round; go\('hollow', \{ from: 'hub' \}\); \}/);
  assert.match(UI_SRC, /\$\('againBtn'\)\.addEventListener\('click', function \(\) \{ go\('hollow', \{ from: 'hub', reward: true \}\); \}\);/, 'the reward’s Another round, as it was');
  // through the engine, as the page asks: after a round, the reward line; with the flag, the greeting
  const c = catAfter10();
  const learned = E.learnedCounts(c, S).map(k => k.table).filter(x => x !== 1);
  const [x, y] = learned.slice(-2);
  let left = 8;
  sitting(c, Date.UTC(2026, 10, 8, 15), q => { if (left > 0 && (q.a === x || q.b === x || q.a === y || q.b === y) && !(q.a === 10 && q.b === 10) && learned.includes(q.a) && learned.includes(q.b)) { left--; return true; } return false; });
  E.warriorSeen(c);
  const at = Date.UTC(2026, 10, 8, 18);
  assert.equal(E.hollowLines(c, S, { reward: true, now: at }).greet, 'Another round? I’ve got all evening.');
  assert.match(E.hollowLines(c, S, { reward: true, tricky: true, now: at }).greet, /first\? I’ve got the tricky ones? ready\.$/);
});

test('the bar, Back, the book and the corner’s chapter line: Camp on every page of the Counts, the Case File’s button off; ‹ to the hub with the sitting kept; the book and the hub say “Your ceremony is coming soon.” once passed; the Ceremony “opens once the Warrior Counts are passed”', () => {
  assert.match(UI_SRC, /if \(n === 'warrior'\) \$\('campBtn'\)\.hidden = !cat;/);
  assert.match(UI_SRC, /var hasFile = n === 'frame' && !!cat && E\.hasFile\(cat\) && !inLesson;/, 'the Case File’s button only on a chapter’s frames');
  assert.match(UI_SRC, /if \(n === 'warrior'\) return go\('hub', \{ back: true \}\);\n    go\('title', \{ back: true \}\);/);
  assert.match(UI_SRC, /hub: renderHub, hollow: renderHollow, nest: renderNest, warrior: renderWarrior \}\[name\];/);
  assert.match(UI_SRC, /var wsBook = t && !t\.built && warriorBuilt\(\) \? warriorNow\(\) : null;\n    if \(wsBook && wPassShown\(wsBook\)\) t = Object\.assign\(\{\}, t, \{ lines: \['Your ceremony is coming soon\.'\] \}\);/, 'the book too: only once her first pass is seen (a sitting again’s unseen result gives nothing away)');
  assert.match(UI_SRC, /if \(wPassShown\(ws\)\) \{\n      \/\/ the Ceremony's chapter button is the hub's own/, 'the hub by the same rule');
  assert.match(UI_SRC, /s\.opensWhen === 'warrior' \? 'opens once the Warrior Counts are passed' : 'opens when the chapter before it is finished'/);
  assert.doesNotMatch(UI_SRC.match(/opens once the Warrior Counts are passed/)[0], /\b(she|her|he|him|his)\b/);
});

/* ------------------------------------------------------------------ the grown-ups corner */

test('the grown-ups corner’s Warrior Counts: not open yet; open, not sat; then each attempt (its date, right of 55, passed or not, the missed pairs with what was typed, “a slip?” for the start of the right answer, the typical time), a sitting set aside and why, one in progress; no pronoun', () => {
  const opts = { date: ms => new Date(ms).toISOString().slice(0, 10), secs: ms => (ms / 1000).toFixed(1) + ' s' };
  const shut = E.blankCat({ now: 1 });
  assert.deepEqual(U.corner(shut, Object.assign({ open: false, after: 'chapter 10' }, opts)), { line: 'not open yet: they open once chapter 10 is finished', attempts: [], sitting: null });
  const c = catAfter10();
  assert.equal(U.corner(c, Object.assign({ open: true }, opts)).line, 'open; not sat yet');
  let t = Date.UTC(2026, 10, 6, 15);
  // a sitting with two slips (typed the start of the answer) and one plain miss
  const r = E.warriorBegin(c, S, t), st = r.state;
  let slips = 0, plain = 0;
  while (!E.counts.done(st)) {
    U.pause(E, W, st);
    const q = E.counts.question(st), D = E.warriorAsk(r.def, st, q, S), right = q.a * q.b;
    let given = right;
    if (right >= 20 && !(q.a === 10 && q.b === 10) && slips < 2) { given = String(right).charAt(0); slips++; }
    else if (right >= 20 && !(q.a === 10 && q.b === 10) && plain < 1) { given = right + 1; plain++; }
    t += 8000;
    const res = E.counts.answer(st, D, given, 3000, t);
    E.logAnswer(c, res.entry);
    if (res.done) E.recordLesson(c, st); else E.warriorKeep(c, st, t);
  }
  E.warriorSeen(c);
  // one set aside: practice in between
  const part = sitting(c, t + DAY, null, 9);
  const hollow = E.hollowStart(c, S, part.t + 60000, 2);
  const hq = E.counts.question(hollow.state);
  E.logAnswer(c, E.counts.answer(hollow.state, hollow.def, hq.a * hq.b, 2000, part.t + 70000).entry);
  E.warriorBegin(c, S, part.t + 80000);
  const W1 = U.corner(c, Object.assign({ open: true }, opts));
  assert.match(W1.line, /^passed on \d{4}-\d\d-\d\d; 1 finished sitting, 1 set aside$/);
  assert.equal(W1.attempts.length, 2);
  assert.match(W1.attempts[0], /^#1, \d{4}-\d\d-\d\d: 52 of 55 right, passed; typical time 3\.0 s; missed /);
  assert.equal((W1.attempts[0].match(/: a slip\?\)/g) || []).length, 2, W1.attempts[0]);
  assert.equal((W1.attempts[0].match(/\(typed \d+\)/g) || []).length, 1, 'a miss that is not a slip, unmarked');
  assert.match(W1.attempts[1], /^#2, \d{4}-\d\d-\d\d: set aside after 9 of 55 answered \(9 right\): other Counts were practiced in between; never counted as a not-yet$/);
  assert.match(W1.sitting, /^a sitting in progress: 0 of 55 answered/);
  [W1.line].concat(W1.attempts, [W1.sitting]).forEach(l => assert.doesNotMatch(l, /\b(she|her|he|him|his)\b/i, l));
  // a slip is the start of the right answer: "2" for 20, "5" for 56; never the whole of it, never another number
  assert.deepEqual([U.slip(4, 5, 2), U.slip(7, 8, 5), U.slip(7, 8, 56), U.slip(7, 8, 6), U.slip(10, 10, 10), U.slip(3, 4, null)], [true, true, false, false, true, false]);
  // the page: a line under the Training Hollow's, and a list of the sittings
  assert.match(UI_SRC, /\(WC \? '<dt>Warrior Counts<\/dt><dd>' \+ esc\(WC\.line\) \+ '<\/dd>' : ''\) \+/);
  assert.match(UI_SRC, /'<h4>The Warrior Counts, sitting by sitting<\/h4><ul>'/);
  // her answers stay in the per-Count tables, under each pair's anchor
  const tabs = E.factTables(c, S), rows = tabs.reduce((n, x) => n + x.rows.reduce((m, rw) => m + rw.attempts, 0), 0);
  assert.equal(rows, c.counts.length);
});

/* ------------------------------------------------------------------ the page itself */

test('index.html: app/story/warrior.js after the chapters and before the engine; the CSS for the paws, the chips and the hub’s button; the paw prints drawn as SVG, aria-hidden (how far, never how well)', () => {
  const list = scripts();
  const at = list.indexOf('app/story/warrior.js');
  assert.ok(at > 0, 'loaded');
  assert.ok(list.slice(0, at).filter(s => /^app\/story\/ch\d+\.js$/.test(s)).length === list.filter(s => /^app\/story\/ch\d+\.js$/.test(s)).length, 'after every chapter');
  assert.ok(at < list.indexOf('app/engine.js'));
  ['.hub .btn.hub-warrior{', '.wpaws{', '.wpaw-f{', '.wpaw-e{', '.wchips{', '.wchip{', '.trickypaw{'].forEach(r => assert.ok(HTML.includes(r), r));
  assert.match(UI_SRC, /\(warrior \? '<div class="wpaws" id="wpaws" aria-hidden="true"><\/div>' : ''\) \+\n      '<div class="q" id="qline" aria-live="polite"><\/div>' \+/);
  assert.match(UI_SRC, /'<svg class="wpaw' \+ \(fl >= 1 \? ' full' : fl > 0 \? ' on' : ''\) \+ '" viewBox="0 0 48 48">/);
  // the question panel: the fountain as the story writes it, the crowd as the sitting's (decision 49:
  // after her first finished sitting, the fountain is quiet), the halfway page's own scene the same way
  assert.ok(W.scene.opts.crowd, 'written with the crowd');
  const before = JSON.stringify(W.scene);
  assert.equal(U.scene(W, { crowd: true }).opts.crowd, true);
  assert.equal('crowd' in U.scene(W, { crowd: false }).opts, false, 'a quiet sitting: no crowd');
  assert.equal('crowd' in U.scene(W, {}).opts, false);
  assert.equal('crowd' in U.scene(W, { crowd: false }, W.halfway.scene).opts, false, 'halfway, quiet');
  assert.deepEqual(U.scene(W, { crowd: false }).cast, W.scene.cast);
  assert.equal(JSON.stringify(W.scene), before, 'a copy');
  // and the page draws the panel through it, with the sitting's own state
  assert.match(UI_SRC, /function warriorScene\(st, own\) \{ return wScene\(PC\.warrior, st, own\); \}/);
  assert.match(UI_SRC, /function warriorSceneSvg\(st\) \{ return artRender\(warriorScene\(st\), cat && cat\.look\)\.svg; \}/);
  assert.match(UI_SRC, /if \(sceneSvg == null\) sceneSvg = warriorSceneSvg\(st\);/);
  // the sand on a miss, as in every lesson; the fountain back for the next question
  assert.match(UI_SRC, /if \(warrior\) \{ fountain\(\); drawPaws\(\); \}\n      else if \(tuck\) paint\(tuck\.open\); else picture\(q\.lit \|\| 0\);/);
});

/* ------------------------------------------------------------------ the storyboard */

test('docs/storyboard/warrior.md is what tools/storyboard.mjs writes from app/story/warrior.js (else run: node tools/storyboard.mjs): every frame, every variant, the hub, the question panel, the pauses', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-warrior-board-'));
  try {
    const out = path.join(tmp, 'warrior.md');
    const run = spawnSync(process.execPath, [path.join(ROOT, 'tools/storyboard.mjs'), path.join(ROOT, 'app/story/warrior.js'), out], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const fresh = fs.readFileSync(out, 'utf8'), committed = fs.readFileSync(path.join(ROOT, 'docs/storyboard/warrior.md'), 'utf8');
    assert.ok(fresh === committed, 'docs/storyboard/warrior.md is stale: run node tools/storyboard.mjs');
    assert.match(fresh, /^# Storyboard: The Warrior Counts\n/);
    // every frame of every list and every variant, by its storyboard
    const frames = [].concat(W.open.first, W.open.again, W.open.quiet, [W.halfway]);
    ['pass', 'notYet', 'afterPass'].forEach(k => Object.keys(W[k]).forEach(v => (v === 'frames' ? W[k].frames : [W[k][v]]).forEach(e => { if (e && e.board) frames.push(e); else if (e && e.else) frames.push(e.else); })));
    frames.forEach(f => assert.ok(fresh.includes('**Shot.** ' + f.board.replace(/\s+/g, ' ').trim()), f.board.slice(0, 40)));
    ['pass.clean', 'pass.quiet', 'notYet.first', 'notYet.second', 'notYet.later', 'notYet.better', 'notYet.close', 'notYet.plain', 'afterPass.clean', 'afterPass.number'].forEach(k => assert.ok(fresh.includes('(`' + k + '`)'), k));
    assert.match(fresh, /\*\(over a single chip: “This was the tricky one\.”\)\*/);
    assert.match(fresh, /- After the 14th answer, Tallyheart: “One paw done\. Your whiskers are wide awake now\.”/);
    assert.match(fresh, /\*\(under it, her missed pairs written out in Andika/);
    assert.doesNotMatch(fresh, /undefined|\[object Object\]|§/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

/* ------------------------------------------------------------------ the Safari tool's test cat */

test('tools/shots.mjs: the warrior targets (open, q, sand, halfway, pass, notyet, afterpass) and the test cat’s `warrior` recipe, run through the engine as the page runs a sitting', () => {
  ['open', 'q', 'sand', 'halfway', 'pass', 'notyet', 'afterpass'].forEach(k => assert.match(SHOTS_SRC, new RegExp('\\b' + k + ': \\[')));
  const WARRIOR = new Function('return `' + /const WARRIOR = `([\s\S]*?)`;\n/.exec(SHOTS_SRC)[1] + '`;')();
  const runWith = (recipe) => {
    const c = E.blankCat({ now: 1 }); c.name = 'Moon';
    const saved = [];
    const page = { engine: E, story: S, warrior: W, debug: { cat: () => c, save: () => { saved.push(1); return true; } } };
    // (as the page runs it: its `arguments[0]` is the recipe)
    const res = new Function('PC', 'recipe', 'return (function () { ' + WARRIOR + ' }).call(null, recipe);').call(null, page, recipe);
    return { res, c, saved };
  };
  // a finished not-yet, unseen: the hub's "Glintstar is waiting", the 7s and the 8s missed
  let x = runWith({ sittings: [46], seen: false });
  assert.equal(x.res, true);
  assert.ok(E.isFinished(x.c, W.after), 'chapter 10 finished (a stand-in until it is built)');
  assert.equal(x.c.warrior.attempts.length, 1);
  assert.deepEqual([x.c.warrior.attempts[0].right, x.c.warrior.attempts[0].finished, x.c.warrior.attempts[0].seen], [46, true, false]);
  assert.ok(x.c.warrior.attempts[0].missed.every(p => p.includes(7) || p.includes(8)), 'the tricky ones in the 7s and the 8s');
  assert.equal(U.hub(state(x.c, Date.now()), E.progress(x.c, S)).big.small, 'Glintstar is waiting');
  assert.equal(x.saved.length, 1);
  // a sitting at 28: picked up on the halfway page
  x = runWith({ answers: 28 });
  const st = E.warriorBegin(x.c, S, Date.now()).state;
  assert.equal(st.pos, 28);
  assert.deepEqual(U.pause(E, W, st), { at: 28, halfway: true });
  // a pass then a sitting again: after the pass
  x = runWith({ sittings: [52, 53], seen: false });
  assert.equal(E.warriorResult(x.c, S).variant.kind, 'afterPass');
  // a Hollow round in progress under a paused sitting (the round's answers first): the round picks up under the waiting line
  x = runWith({ answers: 5, round: { table: 2, answers: 3 } });
  assert.equal(x.c.lesson.mode, 'hollow');
  assert.equal(x.c.lesson.state.log.length, 3);
  assert.equal(E.warriorState(x.c, S, Date.now()).stale, null, 'the sitting still waits');
  assert.equal(E.hollowLines(x.c, S, { now: Date.now() }).waiting, E.WARRIOR_WAITING);
  // a sitting left three hours ago: the next opening sets it aside
  x = runWith({ answers: 20, stale: true });
  assert.equal(E.warriorState(x.c, S, Date.now()).stale, 'late');
  const sb = E.warriorBegin(x.c, S, Date.now());
  assert.deepEqual([sb.opening.kind, sb.opening.aside], ['again', 'late']);
  // the target opens its screen through the page's own hook
  assert.match(SHOTS_SRC, /run\('return PC\.debug\.warrior\(arguments\[0\], arguments\[1\]\);', \[wt\.what, wt\.page\]\)/);
  assert.match(UI_SRC, /warrior: function \(what, i\) \{ return warriorDebug\(what, i\); \}/);
});
