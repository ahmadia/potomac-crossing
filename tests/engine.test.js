/* Engine tests: node --test (from the repo root), or node --test tests/engine.test.js */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const PC = require('../app/engine.js');
const E = PC.engine;

/* A tiny story that uses every interaction kind. */
function miniStory() {
  return {
    id: 'ch01', number: 1, title: 'Through the Glass', start: 'a',
    frames: {
      a: { caption: ['Hello, {petname}.'], next: 'b' },
      b: { look: { next: 'c' } },
      c: { input: { kind: 'petname', suggestions: ['Muffin', 'Biscuit'], next: 'd' } },
      d: { choice: { options: [
        { label: 'Chase the moth!', sets: { stepOut: 'chase' }, next: 'e1' },
        { label: 'Step out slowly.', sets: { stepOut: 'slow' }, next: 'e2' }
      ] } },
      e1: { next: 'f' },
      e2: { next: 'f' },
      f: { input: { kind: 'clanname', suggestions: ['Moon', 'Fern'], next: 'g' } },
      g: { counts: { set: 'ch01-tails', next: 'h' } },
      h: { input: { kind: 'dream', next: 'z' } },
      z: { end: true }
    },
    counts: {
      'ch01-tails': {
        table: 1, thing: 'tail', things: 'tails', teacher: 'tallyheart',
        facts: [[3, 1], [1, 5], [6, 1], [1, 1], [9, 1]],
        ask: '{a} × {b}',
        praise: ['Ha! Easy, yes?', 'Good.', 'Yes!'],
        fast: ['You didn\'t even have to count that time.'],
        miss: 'There. We\'ll come back to that one.',
        done: 'Tails are easy.'
      }
    },
    book: {
      recap: [
        { text: '{name}paw stepped through the glass.' },
        { when: { stepOut: 'chase' }, text: '{They} chased a moth.' },
        { when: { stepOut: 'slow' }, text: '{They} stepped out slowly.' },
        { when: { spokeUp: true }, text: '{They} spoke up.' },
        { when: { spokeUp: false }, text: '{They} stayed quiet.' },
        { when: { worry: ['small', 'water'] }, text: 'A worry.' },
        { when: { sex: 'tom' }, text: 'A tom.' }
      ]
    }
  };
}

/* ------------------------------------------------ tokens */
test('tokens: she-cat', () => {
  const cat = E.blankCat({ now: 1 });
  cat.name = 'Moon'; cat.petname = 'Muffin'; cat.look.sex = 'she';
  assert.equal(E.fill('{name}paw, {petname}', cat), 'Moonpaw, Muffin');
  assert.equal(E.fill('{they} {them} {their} {shecat}', cat), 'she her her she-cat');
  assert.equal(E.fill('{They} saw {Them}. {Their} ears!', cat), 'She saw Her. Her ears!');
  assert.equal(E.fill('{THEY} DID IT', cat), 'SHE DID IT');
});

test('tokens: tom', () => {
  const cat = E.blankCat({ now: 1 });
  cat.name = 'Storm'; cat.look.sex = 'tom';
  assert.equal(E.fill('{they} {them} {their} {shecat}', cat), 'he him his tom');
  assert.equal(E.fill('{They} {Them} {Their} {THEY}', cat), 'He Him His HE');
  assert.equal(E.fill('Cats of CrystalClan! This {shecat} is {name}paw.', cat), 'Cats of CrystalClan! This tom is Stormpaw.');
});

test('tokens: unknown tokens stay visible; extras fill', () => {
  const cat = E.blankCat({});
  assert.equal(E.fill('{nope} {a} × {b}', cat, { a: 3, b: 1 }), '{nope} 3 × 1');
  assert.equal(E.fill(null, cat), '');
});

/* ------------------------------------------------ input cleaning */
test('clan name: trailing paw is stripped in any case', () => {
  assert.equal(E.cleanClanName('Moonpaw'), 'Moon');
  assert.equal(E.cleanClanName('MOONPAW'), 'Moon');
  assert.equal(E.cleanClanName('moonPaw'), 'Moon');
  assert.equal(E.cleanClanName('Moon paw'), 'Moon');
  assert.equal(E.cleanClanName('Moon-paw'), 'Moon');
  assert.equal(E.cleanClanName('Moonpawpaw'), 'Moon');
});

test('clan name: trims, filters, caps, capitalises', () => {
  assert.equal(E.cleanClanName('  moon  '), 'Moon');
  assert.equal(E.cleanClanName('m00n!!'), 'Mn');
  assert.equal(E.cleanClanName('Sky-River'), 'Sky-River');
  assert.equal(E.cleanClanName('o’malley'), "O'malley");
  assert.equal(E.cleanClanName('Thunderstormwhiskers'), 'Thunderstormwh');
  assert.ok(E.cleanClanName('Thunderstormwhiskers').length <= 14);
  assert.equal(E.cleanClanName('  shimmering   river'), 'Shimmering');   // a long name is cut between words, never mid-word
  assert.equal(E.cleanPetName('Princess Sparkle Muffinface'), 'Princess Sparkle');
  assert.equal(E.cleanClanName('mOON'), 'Moon');
  assert.equal(E.cleanClanName('McFluff'), 'McFluff');
});

test('clan name: never empty', () => {
  // "  pAw " is only "paw": nothing would be left, so it stays (a cat called Pawpaw).
  assert.equal(E.cleanClanName('  pAw '), 'Paw');
  assert.equal(E.cleanClanName(''), 'Moon');
  assert.equal(E.cleanClanName('   '), 'Moon');
  assert.equal(E.cleanClanName('123 !!'), 'Moon');
  assert.equal(E.cleanClanName(null), 'Moon');
  assert.equal(E.cleanClanName('', 'Fern'), 'Fern');
  assert.equal(E.cleanClanName('Pawpaw'), 'Paw');
});

test('pet name: similar rules, max 24, keeps paw', () => {
  assert.equal(E.cleanPetName('sir pounce-a-lot'), 'Sir Pounce-a-lot');
  assert.equal(E.cleanPetName('princess sparkle muffin'), 'Princess Sparkle Muffin');
  assert.equal(E.cleanPetName('Sir Pounce-a-lot'), 'Sir Pounce-a-lot');
  assert.equal(E.cleanPetName('Mittenspaw'), 'Mittenspaw');
  assert.equal(E.cleanPetName('   '), 'Muffin');
  assert.equal(E.cleanPetName('', 'Biscuit'), 'Biscuit');
  assert.ok(E.cleanPetName('Snickerdoodle Supreme The Third').length <= E.PET_MAX);
  assert.equal(E.cleanPetName('SNICKERDOODLE'), 'Snickerdoodle');
});

test('pet name: up to 24 characters kept whole; a clipped name never ends on a small word', () => {
  assert.equal(E.PET_MAX, 24);
  assert.equal(E.cleanPetName('Princess Sparkle Muffin'), 'Princess Sparkle Muffin');   // 23 characters
  assert.equal(E.cleanPetName('Princess Sparkle Paws'), 'Princess Sparkle Paws');
  const d = E.cleanPetName('the destroyer of socks and slippers');
  assert.ok(d.length <= 24);
  assert.doesNotMatch(d, /\b(of|and|a|an|the)$/i);
  assert.equal(d, 'The Destroyer of Socks');
  assert.equal(E.cleanPetName('Lord Fluffington of the Tall Towers'), 'Lord Fluffington');
});

test('dream: optional, tidy, max 200', () => {
  assert.equal(E.cleanDream(''), '');
  assert.equal(E.cleanDream('   '), '');
  assert.equal(E.cleanDream('  a   fish\nthat\tflew '), 'a fish that flew');
  assert.equal(E.cleanDream('x'.repeat(300)).length, 200);
});

/* ------------------------------------------------ cats on a device */
test('up to four cats; reset and remove', () => {
  const save = E.newSave();
  const cats = [1, 2, 3, 4].map(n => E.addCat(save, { now: n }));
  assert.ok(cats.every(Boolean));
  assert.equal(E.addCat(save, { now: 5 }), null);
  assert.equal(new Set(save.cats.map(c => c.id)).size, 4);
  cats[1].name = 'Fern';
  const fresh = E.resetCat(save, cats[1].id, 9);
  assert.equal(fresh.id, cats[1].id);
  assert.equal(fresh.name, '');
  assert.equal(save.cats.length, 4);
  assert.ok(E.removeCat(save, cats[0].id));
  assert.equal(save.cats.length, 3);
  assert.ok(E.addCat(save, { now: 10 }));
});

/* ------------------------------------------------ flow and history */
test('flow: next, look, input, choice with sets, counts, end; back rereads', () => {
  const story = miniStory();
  assert.deepEqual(E.checkStory(story), []);
  const cat = E.blankCat({ now: 1 });
  E.startChapter(cat, story);
  assert.equal(E.frameId(cat, story), 'a');
  assert.equal(E.kindOf(E.currentFrame(cat, story)), 'next');
  assert.ok(E.next(cat, story));
  assert.equal(cat.frame, 'b');
  assert.ok(E.confirmLook(cat, story, { sex: 'tom', fur: 'ginger', bogus: 'x' }));
  assert.equal(cat.look.sex, 'tom');
  assert.equal(cat.look.fur, 'ginger');
  assert.equal(cat.look.bogus, undefined);
  assert.ok(E.submitInput(cat, story, '  biscuit '));
  assert.equal(cat.petname, 'Biscuit');
  assert.ok(E.choose(cat, story, 1));
  assert.equal(cat.flags.stepOut, 'slow');
  assert.equal(cat.frame, 'e2');
  assert.deepEqual(cat.choices['ch01:d'], { index: 1, label: 'Step out slowly.' });   // keyed chapter:frame (save v2)
  // back to the choice, choose the other way: the flag is overwritten
  assert.ok(E.back(cat, story));
  assert.equal(cat.frame, 'd');
  assert.ok(E.choose(cat, story, 0));
  assert.equal(cat.flags.stepOut, 'chase');
  assert.equal(cat.frame, 'e1');
  assert.ok(E.next(cat, story));
  assert.ok(E.submitInput(cat, story, 'Moonpaw'));
  assert.equal(cat.name, 'Moon');
  assert.equal(E.kindOf(E.currentFrame(cat, story)), 'counts');
  assert.ok(E.finishCounts(cat, story, { set: 'ch01-tails', answers: 5 }));
  assert.equal(cat.lessons['ch01-tails'].answers, 5);
  assert.ok(E.submitInput(cat, story, ''));
  assert.equal(cat.dreams.ch01, '');   // skipped (save v2: each chapter keeps its own dream)
  assert.equal(cat.frame, 'z');
  assert.ok(E.isFinished(cat, 'ch01'));
  assert.ok(cat.finished.ch01 > 0);
  assert.equal(E.kindOf(E.currentFrame(cat, story)), 'end');
  // history walks all the way back
  let steps = 0;
  while (E.back(cat, story)) steps++;
  assert.equal(cat.frame, 'a');
  assert.equal(E.canBack(cat), false);
  assert.ok(steps >= 8);
});

test('flow: wrong moves are refused, and a vanished frame falls back', () => {
  const story = miniStory();
  const cat = E.blankCat({});
  E.startChapter(cat, story);
  assert.equal(E.choose(cat, story, 0), false);       // not a choice frame
  assert.equal(E.submitInput(cat, story, 'x'), false); // not an input frame
  assert.equal(E.go(cat, story, 'nowhere'), false);
  E.next(cat, story);
  cat.frame = 'deleted-in-a-story-edit';
  assert.equal(E.frameId(cat, story), 'a');
});

/* ------------------------------------------------ the Counts runner */
function runner() {
  const story = miniStory();
  const def = story.counts['ch01-tails'];
  return { def, st: E.counts.start(def, { set: 'ch01-tails', now: 0 }) };
}

test('counts: asks the facts in order; fast and slow answers', () => {
  const { def, st } = runner();
  const q = E.counts.question(st);
  assert.deepEqual([q.a, q.b, q.answer, q.groups, q.per], [3, 1, 3, 3, 1]);
  assert.equal(E.counts.ask(def, q), '3 × 1');
  let r = E.counts.answer(st, def, '3', 1200, 111);
  assert.equal(r.correct, true);
  assert.equal(r.fast, true);
  assert.equal(r.line, def.fast[0]);
  assert.deepEqual(r.entry, { set: 'ch01-tails', a: 3, b: 1, answer: 3, correct: true, ms: 1200, helped: false, retry: false, at: 111 });
  const q2 = E.counts.question(st);
  assert.deepEqual([q2.a, q2.b, q2.groups, q2.per], [1, 5, 5, 1]);
  r = E.counts.answer(st, def, 5, 9000, 222);
  assert.equal(r.correct, true);
  assert.equal(r.fast, false);
  assert.ok(def.praise.includes(r.line));
});

test('counts: a miss shows help and the fact comes back two questions later', () => {
  const { def, st } = runner();
  const r = E.counts.answer(st, def, '4', 5000, 1); // 3 × 1 missed
  assert.equal(r.correct, false);
  assert.equal(r.line, def.miss);
  assert.deepEqual(r.help, { a: 3, b: 1, answer: 3, groups: 3, per: 1 });
  assert.equal(r.requeued, true);
  assert.equal(r.entry.helped, true);
  const order = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st);
    order.push(q.a + 'x' + q.b + (q.retry ? '*' : ''));
    E.counts.answer(st, def, q.answer, 3000, 2);
  }
  assert.deepEqual(order, ['1x5', '6x1', '3x1*', '1x1', '9x1']);
  const sum = E.counts.summary(st);
  assert.equal(sum.answers, 6);
  assert.equal(sum.helped, 1);
  assert.equal(sum.facts, 5);
  assert.equal(sum.firstTry, 4);
  assert.equal(sum.noHelp, false);
});

test('counts: a fact comes back at most twice, and the lesson never blocks', () => {
  const { def, st } = runner();
  let answers = 0, comebacks = 0;
  while (!E.counts.done(st)) {
    const q = E.counts.question(st);
    if (q.retry) comebacks++;
    // always wrong on 3 × 1, right on everything else
    const r = E.counts.answer(st, def, q.a === 3 && q.b === 1 ? 0 : q.answer, 6000, answers);
    assert.ok(r);
    answers++;
    assert.ok(answers < 50, 'lesson must end');
  }
  assert.equal(comebacks, 2);
  assert.equal(answers, 5 + 2);
  assert.equal(st.requeues['3x1'], 2);
  assert.equal(E.counts.question(st), null);
  assert.equal(E.counts.answer(st, def, 1, 1, 1), null);
});

test('counts: every answer wrong still finishes', () => {
  const { def, st } = runner();
  let n = 0;
  while (!E.counts.done(st)) { E.counts.answer(st, def, '', 0, n++); assert.ok(n < 100); }
  // 5 facts, each asked 3 times, plus the fillers that keep the last retries two questions away
  assert.equal(n, 17);
  assert.equal(st.log.filter(e => e.filler).length, 2);
  const s = E.counts.summary(st);
  assert.equal(s.correct, 0);
  assert.equal(s.finished, true);
});

test('counts: a miss on the last fact comes back two questions later, after fillers she already knows', () => {
  const { def, st } = runner();
  for (let i = 0; i < 4; i++) { const q = E.counts.question(st); E.counts.answer(st, def, q.answer, 3000, i); }
  const r = E.counts.answer(st, def, 7, 3000, 9);   // 9 × 1 missed
  assert.equal(r.done, false);
  assert.equal(r.requeued, true);
  const asked = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st);
    asked.push(q.a + 'x' + q.b + (q.retry ? '*' : '') + (q.filler ? 'f' : ''));
    const res = E.counts.answer(st, def, q.answer, 3000, 10);
    if (q.retry) assert.equal(res.lineKind, 'again');
    if (q.filler) assert.equal(res.entry.filler, true);
  }
  // most recent right answers first, never the missed fact
  assert.deepEqual(asked, ['1x1f', '6x1f', '9x1*']);
  // fillers are not first asks in the grown-ups table
  const t = E.factTable(st.log);
  assert.deepEqual(t.find(x => x.a === 1 && x.b === 1), { a: 1, b: 1, attempts: 2, firstAsks: 1, rightFirst: 1, helped: 0, medianMs: 3000 });
  // ordinary entries keep their shape
  assert.equal('filler' in st.log[0], false);
});

/* the real chapter's Counts set, with a stand-in when story/ch01.js is not loadable */
function chapterSet() {
  let def = null;
  try { require('../app/story/ch01.js'); def = PC.story && PC.story.ch01 && PC.story.ch01.counts['ch01-tails']; } catch (e) { def = null; }
  return def || { table: 1, facts: [[3, 1], [1, 5], [6, 1], [1, 1], [9, 1], [1, 10], [4, 1], [1, 7], [8, 1]], praise: ['Yes!'], fast: [], miss: 'Again later.' };
}

test('counts: in the chapter set, a miss on Q9 (8 × 1) is followed by two fillers, then its retry', () => {
  const def = chapterSet();
  const st = E.counts.start(def, { set: 'ch01-tails', now: 0 });
  for (let i = 0; i < 8; i++) { const q = E.counts.question(st); E.counts.answer(st, def, q.answer, 3000, i); }
  assert.deepEqual([E.counts.question(st).a, E.counts.question(st).b], [8, 1]);
  E.counts.answer(st, def, 9, 3000, 8);
  const next = [];
  while (!E.counts.done(st)) { const q = E.counts.question(st); next.push(q); E.counts.answer(st, def, q.answer, 3000, 9); }
  assert.equal(next.length, 3);
  assert.ok(next[0].filler && next[1].filler && !next[0].retry && !next[1].retry);
  assert.deepEqual([next[0].a, next[0].b], [1, 7]);   // the most recent right answer first
  assert.deepEqual([next[1].a, next[1].b], [4, 1]);
  assert.ok(next[2].retry && next[2].a === 8 && next[2].b === 1);
});

test('counts: misses on Q8 and Q9 each come back with exactly two questions between', () => {
  const def = chapterSet();
  const st = E.counts.start(def, { set: 'ch01-tails', now: 0 });
  for (let i = 0; i < 7; i++) { const q = E.counts.question(st); E.counts.answer(st, def, q.answer, 3000, i); }
  let i = 7;
  const asked = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st);
    asked.push(q);
    const miss = !q.retry && !q.filler && (q.a * q.b === 7 || q.a * q.b === 8);   // Q8 (1 × 7) and Q9 (8 × 1)
    E.counts.answer(st, def, miss ? 0 : q.answer, 3000, i++);
  }
  const at = (a, b, retry) => asked.findIndex(q => q.a === a && q.b === b && !!q.retry === retry && !q.filler);
  assert.equal(at(1, 7, true) - at(1, 7, false), 3, 'two questions between 1 × 7 and its retry');
  assert.equal(at(8, 1, true) - at(8, 1, false), 3, 'two questions between 8 × 1 and its retry');
});

test('counts: lesson state survives a save round-trip', () => {
  const { def, st } = runner();
  E.counts.answer(st, def, 2, 3000, 1);
  const back = JSON.parse(JSON.stringify(st));
  assert.deepEqual(E.counts.question(back), E.counts.question(st));
});

test('counts: per-fact table for grown-ups', () => {
  const log = [
    { a: 3, b: 1, answer: 4, correct: false, ms: 5000, helped: true, retry: false },
    { a: 1, b: 5, answer: 5, correct: true, ms: 2000, helped: false, retry: false },
    { a: 3, b: 1, answer: 3, correct: true, ms: 3000, helped: false, retry: true },
    { a: 3, b: 1, answer: 3, correct: true, ms: 1000, helped: false, retry: false }
  ];
  const t = E.factTable(log);
  const r31 = t.find(r => r.a === 3 && r.b === 1);
  assert.deepEqual(r31, { a: 3, b: 1, attempts: 3, firstAsks: 2, rightFirst: 1, helped: 1, medianMs: 2000 });
});

/* ------------------------------------------------ the book */
test('book: recap filtered by when, tokens filled', () => {
  const story = miniStory();
  const cat = E.blankCat({});
  cat.name = 'Fern'; cat.look.sex = 'she';
  cat.flags = { stepOut: 'chase', spokeUp: false, worry: 'water' };
  cat.dream = 'a fish that could fly';
  const b = E.buildBook(story, cat);
  assert.equal(b.title, 'Fernpaw’s First Moon');
  assert.equal(b.chapter, 'Chapter 1: Through the Glass');
  assert.deepEqual(b.recap, ['Fernpaw stepped through the glass.', 'She chased a moth.', 'She stayed quiet.', 'A worry.']);
  assert.equal(b.dream, 'Fernpaw’s dream: “A fish that could fly.”');
  assert.equal(b.dreamText, 'a fish that could fly');   // the cat keeps what she typed
  cat.look.sex = 'tom'; cat.flags.spokeUp = true; cat.dream = '';
  const b2 = E.buildBook(story, cat);
  assert.deepEqual(b2.recap, ['Fernpaw stepped through the glass.', 'He chased a moth.', 'He spoke up.', 'A worry.', 'A tom.']);
  assert.equal(b2.dream, '');
});

/* ------------------------------------------------ the Training Hollow */
test('hollow: a round is the ten 1s facts, shuffled the same way per round number', () => {
  const r1 = E.hollowFacts(1), r1b = E.hollowFacts(1), r2 = E.hollowFacts(2);
  assert.deepEqual(r1, r1b);
  assert.notDeepEqual(r1, r2);
  assert.equal(r1.length, 10);
  const ns = r1.map(f => f[0] * f[1]).sort((x, y) => x - y);
  assert.deepEqual(ns, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.ok(r1.every(f => f[0] === 1 || f[1] === 1));
});

test('hollow: full rounds award treasures in order; glow after three rounds without help', () => {
  const story = miniStory();
  const cat = E.blankCat({});
  assert.ok(E.TREASURES.length >= 12);
  function round(missFirst) {
    const { def, state } = E.hollowStart(cat, story, 1);
    assert.equal(def.id, 'hollow-1s');
    let first = true;
    while (!E.counts.done(state)) {
      const q = E.counts.question(state);
      E.counts.answer(state, def, missFirst && first ? 0 : q.answer, 2000, 1);
      first = false;
    }
    return E.hollowFinish(cat, state);
  }
  let r = round(true);
  assert.equal(r.awarded.id, E.TREASURES[0].id);
  assert.equal(cat.hollow.byTable['1'].cleanRounds, 0);   // save v2: each Count keeps its own record
  r = round(false); assert.equal(r.glowNow, false);
  r = round(false); assert.equal(r.glowNow, false);
  assert.equal(cat.hollow.byTable['1'].glow, false);
  r = round(false);
  assert.equal(r.glowNow, true);
  assert.equal(cat.hollow.byTable['1'].glow, true);
  assert.equal(cat.hollow.rounds, 4);
  assert.deepEqual(cat.nest, E.TREASURES.slice(0, 4).map(t => t.id));
  r = round(false);
  assert.equal(r.glowNow, false); // already glowing
  // a round left unfinished awards nothing
  const { state } = E.hollowStart(cat, story, 1);
  assert.equal(E.hollowFinish(cat, state).awarded, null);
  assert.equal(cat.nest.length, 5);
});

test('hollow: treasures wrap around after the list and group in the nest', () => {
  const cat = E.blankCat({});
  cat.nest = ['moss', 'feather', 'moss'];
  const items = E.nestItems(cat);
  assert.equal(items.length, 2);
  assert.equal(items[0].count, 2);
});

/* ------------------------------------------------ saves */
function memStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), _m: m };
}

test('storage: round-trip under the one key', () => {
  const ls = memStorage();
  const store = E.createStore(ls);
  const save = store.load();
  assert.equal(save.version, 2);   // the key stays potomac-crossing.v1; the object says version 2
  const cat = E.addCat(save, { now: 5 });
  cat.name = 'Minnow';
  assert.equal(store.save(save), true);
  assert.deepEqual([...ls._m.keys()], ['potomac-crossing.v1']);
  const again = E.createStore(ls).load();
  assert.equal(again.cats[0].name, 'Minnow');
  assert.equal(again.current, cat.id);
});

test('storage: throwing storage never breaks the game', () => {
  const bad = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceeded'); }, removeItem() { throw new Error('no'); } };
  const store = E.createStore(bad);
  const save = store.load();
  assert.deepEqual(save.cats, []);
  E.addCat(save, { now: 1 }).name = 'Holly';
  assert.equal(store.save(save), false);
  assert.equal(store.ok, false);
  // the game keeps going on its in-memory copy
  assert.equal(store.load().cats[0].name, 'Holly');
  assert.equal(store.clear(), false);
});

test('storage: a getter that throws, null storage, and corrupt data', () => {
  const s1 = E.createStore(() => { throw new Error('denied'); });
  assert.deepEqual(s1.load().cats, []);
  assert.equal(s1.save(E.newSave()), false);
  const s2 = E.createStore(null);
  assert.deepEqual(s2.load().cats, []);
  const ls = memStorage();
  ls.setItem('potomac-crossing.v1', '{not json');
  assert.deepEqual(E.createStore(ls).load().cats, []);
  ls.setItem('potomac-crossing.v1', JSON.stringify({ v: 1, cats: [{ id: 'x', name: 'Sedge', look: { fur: 'calico' }, flags: 'oops' }, 7, null], current: 'x' }));
  const loaded = E.createStore(ls).load();
  assert.equal(loaded.cats.length, 1);
  assert.equal(loaded.cats[0].name, 'Sedge');
  assert.equal(loaded.cats[0].look.fur, 'calico');
  assert.equal(loaded.cats[0].look.sex, 'she');
  assert.deepEqual(loaded.cats[0].flags, {});
  // a version-1 cat: its one Hollow record becomes the 1s'
  assert.deepEqual(loaded.cats[0].hollow, { rounds: 0, byTable: { '1': { rounds: 0, cleanRounds: 0, glow: false } } });
  assert.equal(loaded.current, 'x');
});

test('storage: never more than four cats from a save', () => {
  const data = { v: 1, cats: [1, 2, 3, 4, 5, 6].map(i => ({ id: 'c' + i })) };
  assert.equal(E.migrate(data).cats.length, 4);
  assert.deepEqual(E.migrate('nonsense'), E.newSave());
});

/* ------------------------------------------------ the real chapter, when it exists */
test('the real chapter 1 (if present) has a sound frame graph', (t) => {
  let story;
  try { require('../app/story/ch01.js'); story = PC.story && PC.story.ch01; } catch (e) { story = null; }
  if (!story) { t.skip('app/story/ch01.js not written yet'); return; }
  assert.deepEqual(E.checkStory(story), []);
  // every frame reachable from the start can reach an end
  const seen = new Set([story.start]); const stack = [story.start];
  while (stack.length) { const id = stack.pop(); E.exits(story.frames[id]).forEach(n => { if (!seen.has(n)) { seen.add(n); stack.push(n); } }); }
  assert.ok([...seen].some(id => story.frames[id].end), 'an end is reachable');
});

/* ------------------------------------------------ the UI's pure layout helpers (app/ui.js in Node) */
test('ui.js loads in Node without a DOM and exposes its layout helpers', () => {
  require('../app/ui.js');
  assert.ok(PC.ui && PC.ui.layout && typeof PC.ui.layout.findSpot === 'function');
});

test('balloon placement: never over a face, inside the panel, after the balloon before it', () => {
  const L = PC.ui.layout;
  const face = { x: 400, y: 300, r: 60 };
  const spot = L.findSpot({ W: 800, H: 500, w: 200, h: 80, faces: [face], placed: [], head: { x: 400, y: 300, r: 50 } });
  assert.ok(spot);
  const r = { x: spot.x, y: spot.y, w: 200, h: 80 };
  assert.equal(L.rectCircle(r, face), false);
  assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.w <= 800 && r.y + r.h <= 500);
  assert.ok(r.y + r.h <= face.y, 'prefers above the speaker');
  // reading order as a rule: below the previous balloon or to its right
  const prev = { x: 20, y: 20, w: 300, h: 80 };
  const next = L.findSpot({ W: 800, H: 500, w: 200, h: 60, faces: [], placed: [prev], head: null, after: prev, prev, index: 1 });
  assert.ok(next.y >= prev.y + prev.h * 0.5 || (next.x >= prev.x + prev.w * 0.6 && next.y >= prev.y - 10));
  // too big for the panel: no spot, so the UI stacks the balloons under the panel instead
  assert.equal(L.findSpot({ W: 300, H: 180, w: 400, h: 60, faces: [], placed: [] }), null);
});

test('a crowded panel’s fallback spot still reads after the balloon before it: lower, or the same tier to its right, never wholly above (f081 on the river path)', () => {
  const L = PC.ui.layout;
  // f081 in landscape as measured in Safari: the player's shout, then Sprinkle's “THAT’S HIM!” up top
  const shout = { x: 293, y: 363, w: 299, h: 55 };
  assert.equal(L.readsAfter({ x: 650, y: 177, w: 111, h: 27 }, shout), false, 'up and to the right: read first, so refused');
  assert.equal(L.readsAfter({ x: 533, y: 258, w: 343, h: 52 }, shout), false, 'wholly above: refused');
  assert.equal(L.readsAfter({ x: 100, y: 440, w: 200, h: 50 }, shout), true, 'a lower tier, even to the left');
  assert.equal(L.readsAfter({ x: 600, y: 360, w: 150, h: 50 }, shout), true, 'the same tier, to its right');
  // f091a on a phone with Bigger text: “Hello.” to the left on the same tier as “Four legs…”
  assert.equal(L.readsAfter({ x: 76, y: 430, w: 44, h: 21 }, { x: 166, y: 388, w: 176, h: 65 }), false);
  // as the page asks it: a findSpot result (the box, with its size) handed straight to readsAfter.
  // No room below the shout, so the fallback goes on its tier: to its right reads after it ...
  const fb = L.findSpot({ W: 900, H: 430, w: 150, h: 50, faces: [], placed: [shout], prev: shout, index: 1, margin: 8 });
  assert.deepEqual([fb.w, fb.h], [150, 50], 'findSpot gives the box’s size');
  assert.ok(fb.x >= shout.x + shout.w && Math.abs(fb.y - shout.y) < 10, 'beside it: ' + JSON.stringify(fb));
  assert.equal(L.readsAfter(fb, shout), true, 'the same tier, to its right');
  // ... and with a face filling the right, to its left on the same tier is refused (the balloons stack)
  const left = L.findSpot({ W: 900, H: 430, w: 150, h: 50, faces: [{ x: 760, y: 380, r: 150 }], placed: [shout], prev: shout, index: 1, margin: 8 });
  assert.ok(left.x + left.w <= shout.x && Math.abs(left.y - shout.y) < 10, 'left of it: ' + JSON.stringify(left));
  assert.equal(L.readsAfter(left, shout), false);
});

test('a sound effect shrinks to fit its panel (f066’s “CLANKETY-CLANK! RUMMMBLE-RUMMMBLE!”); short ones keep their size', () => {
  const L = PC.ui.layout;
  const train = 'CLANKETY-CLANK! RUMMMBLE-RUMMMBLE!';
  [1027, 781, 351].forEach(W => {
    const f = L.sfxFit(train, W);
    assert.ok(f.estW <= W * 0.92 + 1e-9, W + ': fits (estimated)');
    // Bangers runs about 0.41 of the size a letter: the real line keeps a margin either side
    assert.ok(train.length * f.size * 0.41 < W * 0.85, W + ': the real line fits too');
    assert.ok(f.size >= 18, W + ': still big lettering');
  });
  ['BONK!', 'GRRRRRRRMMMMMMBLE!', 'Plink… plink… plonk.', 'SPLOOSH!'].forEach(t => {
    const f = L.sfxFit(t, 1027), quiet = t === t.toLowerCase();
    const size = Math.min(92, Math.max(30, 1027 * 0.085)) * (t.length > 9 ? 0.82 : 1) * (quiet ? 0.6 : 1);
    assert.equal(f.size, size, t + ': unchanged');
  });
});

test('a sound effect never covers a balloon’s words when a smaller one would fit (f066 as measured in Safari)', () => {
  const L = PC.ui.layout, train = 'CLANKETY-CLANK! RUMMMBLE-RUMMMBLE!';
  // f066 in landscape: the caption at the top left, Sprinkle's whisper in the middle, faces below
  const W = 1027, H = 639, cap = { x: 6, y: 6, w: 494, h: 76 }, bal = { x: 344, y: 296, w: 379, h: 79 };
  const faces = [{ x: 600, y: 470, r: 70 }, { x: 260, y: 520, r: 50 }, { x: 420, y: 560, r: 45 }];
  const p = L.sfxPlace(train, W, H, faces, [cap, bal]);
  assert.ok(p.clear, 'a clear spot: ' + JSON.stringify(p));
  for (const b of [cap, bal]) assert.ok(!L.overlap(p.box, b), 'clear of ' + JSON.stringify(b) + ': ' + JSON.stringify(p.box));
  assert.ok(p.box.x >= 0 && p.box.x + p.box.w <= W, 'inside the panel');
  assert.ok(p.size < L.sfxFit(train, W).size && p.size >= 18, 'smaller, still lettering: ' + p.size);
  // with room, full size, top right first (chapter 1 and 2's sound effects where they were)
  const free = L.sfxPlace('BONK!', W, H, [], []);
  assert.equal(free.size, L.sfxFit('BONK!', W).size);
  assert.deepEqual([Math.round(free.box.x + free.box.w), Math.round(free.box.y)], [Math.round(W * 0.96), Math.round(H * 0.06)]);
});

test('a sound effect shrinks only to clear a caption or a balloon, never for a face alone, and a small one keeps its size (chapter 2’s PLIP! on the nose; chapter 1’s quiet sniffs on a phone)', () => {
  const L = PC.ui.layout, plip = 'Drip. Drip. PLIP!', W = 1027, H = 639, fit = L.sfxFit(plip, W);
  // a face every full-size spot touches, which the top spots would clear a size smaller: it stays
  // full size, top right first, as chapters 1 and 2 placed it
  const face = { x: W / 2, y: H / 2, r: 207.5 };
  const p = L.sfxPlace(plip, W, H, [face], []);
  assert.equal(p.size, fit.size, 'full size: ' + p.size);
  assert.ok(L.rectCircle(p.box, face), 'on the face, as it was');
  assert.deepEqual([Math.round(p.box.x + p.box.w), Math.round(p.box.y)], [Math.round(W * 0.96), Math.round(H * 0.06)]);
  assert.equal(p.clear, true, 'nothing hides it');
  // a balloon over every full-size spot: then it shrinks, clear of it
  const bal = { x: 0, y: 0, w: W, h: H };
  const hidden = L.sfxPlace(plip, W, H, [], [bal]);
  assert.equal(hidden.clear, false, 'nowhere clear, at any size');
  assert.ok(hidden.size >= 18);
  // the quiet ones on a phone's panel keep the size they fitted to (14.8px), never grown to 18
  ['sniff… sniff…', 'chirp… chirp…', 'heh heh heh', 'purrrrrrrr'].forEach(t => {
    const f = L.sfxFit(t, 351), q = L.sfxPlace(t, 351, 219, [], []);
    assert.ok(f.size < 18, t + ': small on a phone');
    assert.equal(q.size, f.size, t);
    assert.ok(q.box.w <= 351 * 0.92 + 1e-9, t + ': fits');
  });
});

test('the grown-ups corner has words for every flag a chapter sets, and fits a tom (PC.ui.flagWords)', () => {
  require('../app/ui.js');
  const W = PC.ui.flagWords, S = realStories();
  ['ch01', 'ch02', 'ch03'].forEach(ch => Object.entries(S[ch].frames).forEach(([id, f]) => {
    const opts = (f.choice && f.choice.options) || [];
    opts.forEach(o => Object.entries(o.sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], ch + ' ' + id + ': words for ' + k + ': ' + v)));
  }));
  assert.ok(W.ch2Stone && W.ch2Stone.nose && W.ch2Stone.chin, 'Riffle’s stone, read by chapter 3');
  const tom = E.blankCat({}); tom.look.sex = 'tom';
  assert.equal(E.fill(W.ch2Stone.chin, tom), 'put Riffle’s stone under his chin (chapter 3 remembers)');
  Object.values(W).forEach(v => Object.values(v).forEach(w => assert.doesNotMatch(E.fill(w, tom), /\bjust her\b|\bher (nose|chin)\b/, w)));
  assert.match(W.ch2Path.river, /chapters 3 and 4 remember/, 'chapter 3 reads the river path too');
  // a voice behind her tail keeps its face to itself, as a voice in the dark does
  assert.equal(PC.ui.speakers.faceHidden({ who: 'sprinkle', name: 'A muffled voice' }, { who: 'sprinkle', pose: 'hide' }), true);
  assert.equal(PC.ui.speakers.faceHidden({ who: 'sprinkle', name: 'The dragon' }, { who: 'sprinkle', pose: 'sniff' }), false);
});

test('balloon tails reach toward the speaker and stop outside the box', () => {
  const L = PC.ui.layout;
  const box = { x: 100, y: 50, w: 200, h: 80 };
  assert.equal(L.tailGeom(box, { x: 200, y: 90 }, 10), null); // tip inside the balloon: no tail
  const t = L.tailGeom(box, { x: 220, y: 260 }, 10);
  assert.ok(t && /^M/.test(t.d) && /Z$/.test(t.d));
  assert.ok(Math.abs(t.edge.y - 130) < 0.01, 'leaves through the bottom edge');
  assert.equal(L.segHitsRect(0, 0, 100, 100, { x: 40, y: 40, w: 10, h: 10 }), true);
  assert.equal(L.segHitsRect(0, 0, 100, 0, { x: 40, y: 40, w: 10, h: 10 }), false);
});

/* ------------------------------------------------ fixes after the reviews */
test('book: the dream is tidied for display only', () => {
  const story = miniStory();
  const cat = E.blankCat({});
  cat.name = 'Moon';
  cat.dream = 'i dreamed about otters sliding down a hill';
  assert.equal(E.buildBook(story, cat).dream, 'Moonpaw’s dream: “I dreamed about otters sliding down a hill.”');
  assert.equal(cat.dream, 'i dreamed about otters sliding down a hill');
  assert.equal(E.tidyDream('i’m a fish!'), 'I’m a fish!');
  assert.equal(E.tidyDream("i'm flying and i see the river"), "I'm flying and I see the river.");
  assert.equal(E.tidyDream('Otters… a giant fish…'), 'Otters… a giant fish…');
  assert.equal(E.tidyDream('a big fish'), 'A big fish.');
  assert.equal(E.tidyDream('Mia said “hi”'), 'Mia said “hi”');
  assert.equal(E.tidyDream('pizza in igloos'), 'Pizza in igloos.');
  // a story's own template wins
  story.book.dream = 'That night: “{dream}”';
  assert.equal(E.buildBook(story, cat).dream, 'That night: “I dreamed about otters sliding down a hill.”');
});

test('back during a lesson keeps it: coming forward resumes at the same question', () => {
  const story = { id: 'ch01', start: 'a', frames: { a: { next: 'g' }, g: { counts: { set: 's', next: 'z' } }, z: { end: true } },
    counts: { s: { table: 1, facts: [[3, 1], [1, 5], [6, 1], [1, 1], [9, 1], [1, 10]], praise: ['Yes!'] } } };
  const cat = E.blankCat({});
  E.startChapter(cat, story);
  assert.ok(E.next(cat, story));
  assert.equal(cat.frame, 'g');
  const def = story.counts.s;
  const st = E.counts.start(def, { set: 's', mode: 'chapter', now: 1 });
  cat.lesson = { mode: 'chapter', frame: 'g', state: st };
  for (let i = 0; i < 4; i++) { const q = E.counts.question(st); E.counts.answer(st, def, q.answer, 3000, i); }
  assert.ok(E.back(cat, story));
  assert.equal(cat.frame, 'a');
  assert.ok(E.next(cat, story));
  assert.equal(cat.frame, 'g');
  assert.ok(cat.lesson && cat.lesson.frame === 'g');
  assert.equal(cat.lesson.state.pos, 4);
  // a new start of the chapter or a finished lesson still clears it
  E.finishCounts(cat, story, E.counts.summary(st));
  assert.equal(cat.lesson, null);
});

test('a finished lesson is recorded at its last answer; a saved, unrecorded one settles once', () => {
  const story = miniStory();
  const def = story.counts['ch01-tails'];
  // chapter: record straight away
  const cat = E.blankCat({});
  const st = E.counts.start(def, { set: 'ch01-tails', mode: 'chapter', now: 1 });
  cat.lesson = { mode: 'chapter', frame: 'g', state: st };
  while (!E.counts.done(st)) { const q = E.counts.question(st); E.counts.answer(st, def, q.answer, 3000, 1); }
  const rec = E.recordLesson(cat, st);
  assert.equal(rec.mode, 'chapter');
  assert.equal(cat.lessons['ch01-tails'].finished, true);
  assert.equal(cat.lesson, null);
  assert.equal(E.settleLesson(cat), null, 'nothing left to settle');
  // a save made after the last answer but before it was recorded (the old order of things)
  const cat2 = E.blankCat({});
  const st2 = JSON.parse(JSON.stringify(st));
  cat2.lesson = { mode: 'chapter', frame: 'g', state: st2 };
  assert.ok(E.settleLesson(cat2));
  assert.ok(cat2.lessons['ch01-tails']);
  assert.equal(cat2.lesson, null);
  // an unfinished lesson is left alone
  const cat3 = E.blankCat({});
  cat3.lesson = { mode: 'chapter', frame: 'g', state: E.counts.start(def, { set: 'ch01-tails', now: 1 }) };
  assert.equal(E.settleLesson(cat3), null);
  assert.ok(cat3.lesson);
  // hollow: the round counts exactly once
  const cat4 = E.blankCat({});
  const h = E.hollowStart(cat4, story, 1);
  cat4.lesson = { mode: 'hollow', state: h.state };
  while (!E.counts.done(h.state)) { const q = E.counts.question(h.state); E.counts.answer(h.state, h.def, q.answer, 3000, 1); }
  const saved = JSON.parse(JSON.stringify(cat4));
  const r4 = E.recordLesson(cat4, h.state);
  assert.equal(r4.mode, 'hollow');
  assert.equal(r4.hollow.awarded.id, E.TREASURES[0].id);
  assert.equal(cat4.hollow.rounds, 1);
  assert.equal(cat4.nest.length, 1);
  assert.equal(E.settleLesson(cat4), null);
  assert.equal(cat4.hollow.rounds, 1);
  // the same round reloaded before it was recorded settles to one treasure, once
  assert.ok(E.settleLesson(saved));
  assert.equal(saved.hollow.rounds, 1);
  assert.equal(saved.nest.length, 1);
  assert.equal(E.settleLesson(saved), null);
  assert.equal(saved.nest.length, 1);
});

test('Tallyheart’s lines stay true: the last miss, and fast answers after a miss', () => {
  const def = Object.assign({}, miniStory().counts['ch01-tails'], {
    fast: ['Fast!'], fastAfterMiss: ['You didn’t even look at the sand that time.'], missLast: 'There. Now you’ve seen it.'
  });
  // a fact missed three times: the third miss does not promise to come back
  const st = E.counts.start(def, { set: 's', now: 0 });
  const lines = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st);
    const r = E.counts.answer(st, def, q.a === 3 && q.b === 1 ? 0 : q.answer, 6000, 1);
    if (!r.correct) lines.push([r.line, r.requeued]);
  }
  assert.deepEqual(lines, [[def.miss, true], [def.miss, true], [def.missLast, false]]);
  // without missLast, a plain default that promises nothing
  const st0 = E.counts.start({ facts: [[2, 1]] }, { now: 0 });
  E.counts.answer(st0, {}, 0, 1, 1);
  E.counts.answer(st0, {}, 0, 1, 1);
  const last = E.counts.answer(st0, {}, 0, 1, 1);
  assert.equal(last.requeued, false);
  assert.equal(last.line, 'There. Now you’ve seen it counted.');
  // fast answers before any miss never use the after-a-miss lines
  const st2 = E.counts.start(def, { set: 's', now: 0 });
  const fastBefore = [];
  for (let i = 0; i < 4; i++) { const q = E.counts.question(st2); const r = E.counts.answer(st2, def, q.answer, 500, i); if (r.lineKind === 'fast') fastBefore.push(r.line); }
  assert.ok(fastBefore.length >= 1);
  assert.ok(fastBefore.every(l => !def.fastAfterMiss.includes(l)));
  assert.equal(st2.missed, false);
  // after a miss they join in
  const q = E.counts.question(st2); E.counts.answer(st2, def, 0, 500, 9);
  assert.equal(st2.missed, true);
  const after = [];
  for (let i = 0; i < 6 && !E.counts.done(st2); i++) { const qq = E.counts.question(st2); const r = E.counts.answer(st2, def, qq.answer, 500, i); if (r.lineKind === 'fast') after.push(r.line); }
  assert.ok(after.some(l => def.fastAfterMiss.includes(l)), 'an after-a-miss line appears once a miss has happened');
  // the flag survives a save
  assert.equal(JSON.parse(JSON.stringify(st2)).missed, true);
});

test('hollow: facts that were hard last time come early, flagged, and are remembered', () => {
  const story = miniStory();
  const clean = E.blankCat({});
  const plain = E.hollowStart(clean, story, 1).state.queue.map(q => [q.a, q.b]);
  assert.deepEqual(plain, E.hollowFacts(1), 'a clean log keeps today’s order');
  assert.ok(E.hollowStart(clean, story, 1).state.queue.every(q => !q.hard));
  assert.deepEqual(E.hardFacts(clean, 1), []);

  const cat = E.blankCat({});
  // a miss on 9 × 1 in the chapter, then its retry right (retries don't count as "last time")
  E.logAnswer(cat, { set: 'ch01-tails', a: 9, b: 1, answer: 8, correct: false, ms: 5000, helped: true, retry: false, at: 1 });
  E.logAnswer(cat, { set: 'ch01-tails', a: 9, b: 1, answer: 9, correct: true, ms: 2000, helped: false, retry: true, at: 2 });
  // 1 × 5 was right and fast: not hard; 6 × 1 was right but slow: hard
  E.logAnswer(cat, { set: 'ch01-tails', a: 1, b: 5, answer: 5, correct: true, ms: 1500, helped: false, retry: false, at: 3 });
  E.logAnswer(cat, { set: 'ch01-tails', a: 6, b: 1, answer: 6, correct: true, ms: 7000, helped: false, retry: false, at: 4 });
  const hard = E.hardFacts(cat, 1);
  assert.deepEqual(hard, [[9, 1], [6, 1]]);
  const { def, state } = E.hollowStart(cat, story, 1);
  assert.equal(state.queue.length, 10);
  assert.ok(!state.queue[0].hard, 'the first question stays an easy one');
  const pos9 = state.queue.findIndex(q => q.a * q.b === 9);
  assert.ok(pos9 >= 1 && pos9 <= 3, '9 × 1 comes early: ' + pos9);
  assert.equal(state.queue[pos9].hard, true);
  // in the round's own orientation
  const own = E.hollowFacts(1).find(f => f[0] * f[1] === 9);
  assert.deepEqual([state.queue[pos9].a, state.queue[pos9].b], own);
  // the flag survives a save
  const saved = JSON.parse(JSON.stringify(state));
  assert.equal(saved.queue[pos9].hard, true);
  assert.equal(E.counts.question(saved).hard, false);
  // answering it right and quick: she remembers, "Not today!"
  while (saved.pos < pos9) { const q = E.counts.question(saved); E.counts.answer(saved, def, q.answer, 2000, 1); }
  const slowCopy = JSON.parse(JSON.stringify(saved));
  const r = E.counts.answer(saved, def, 9, 2500, 1);
  assert.equal(r.lineKind, 'remembered');
  assert.equal(r.line, 'Last time ' + own[0] + ' × ' + own[1] + ' made you stop and think. Not today!');
  // right but slow again: it made her stop and think today too, so not "Not today!"
  const rs = E.counts.answer(slowCopy, def, 9, 6000, 1);
  assert.equal(rs.lineKind, 'rememberedSlow');
  assert.equal(rs.line, own[0] + ' × ' + own[1] + ' again, and you got it. It’s getting easier.');
  assert.equal(E.counts.answer(E.counts.start(def, { facts: [{ a: 2, b: 1, hard: true }] }), Object.assign({}, def, { rememberedSlow: 'Slow {a} × {b}.' }), 2, 9000, 1).line, 'Slow 2 × 1.', 'a set may say it its own way');
  // the same fact in a later round, now right and fast, is no longer hard
  E.logAnswer(cat, { set: 'hollow-1s', a: 1, b: 9, answer: 9, correct: true, ms: 1200, helped: false, retry: false, at: 9 });
  assert.deepEqual(E.hardFacts(cat, 1), [[6, 1]]);
  // the Hollow never uses the chapter's first prompt
  const st2 = Object.assign({}, story, { counts: { 'ch01-tails': Object.assign({ firstPrompt: 'How many tails on those three?' }, story.counts['ch01-tails']) } });
  assert.equal(E.hollowDef(st2, 1).firstPrompt, undefined);
});

test('treasure names read cleanly', () => {
  assert.equal(E.treasure('leaf').name, 'A bright red leaf from leaf-drop');
});

/* ================================================================ chapter 2 (docs/build.md v0.3)
 * Fixture chapters (tests/fixtures/chapters.js), not the real chapter 2; real version-1 saves
 * (tests/fixtures/v1-saves.json, made by the shipped engine: node tests/fixtures/make-v1-saves.js);
 * and the shipped engine itself (tests/fixtures/engine-v1.js), to replay chapter 1 beside the new. */
const fixtures = require('./fixtures/chapters.js');
const V1SAVES = require('./fixtures/v1-saves.json');
const V1 = require('./fixtures/v1.js');
const clone = (o) => JSON.parse(JSON.stringify(o));
const realCh01 = () => { require('../app/story/ch01.js'); return PC.story.ch01; };
/* A cat as plain data, with a Hollow record of all zeros dropped: a migrated version-1 cat carries
 * the 1s' record even before its first round (the contract's mapping), a new cat starts with none. */
const plainCat = (c) => {
  const o = clone(c);
  Object.keys(o.hollow.byTable).forEach(t => { const r = o.hollow.byTable[t]; if (!r.rounds && !r.cleanRounds && !r.glow) delete o.hollow.byTable[t]; });
  return o;
};

/* Play a fixture chapter to its end (or to `stop`) with the new engine. */
function playNew(cat, story, over, stop) {
  return V1.play(E, story, cat, V1.script(over), stop);
}
function finishedCat(stories, over) {
  const { ch01 } = stories;
  const cat = E.blankCat({ now: 1, id: 'fx' });
  E.startChapter(cat, ch01, 1);
  playNew(cat, ch01, Object.assign({ miss: [] }, over));
  return cat;
}

test('version 0.3.0 and the save, still version 2', () => {
  assert.equal(E.VERSION, '0.3.0 (chapter 3, 2026-10-06)');
  assert.equal(E.SAVE_VERSION, 2, 'chapter 3 adds no field to the save');
  assert.equal(E.STORAGE_KEY, 'potomac-crossing.v1');
  assert.deepEqual(E.newSave(), { version: 2, cats: [], current: null, settings: { readAloud: false, bigText: false } });
  const c = E.blankCat({ now: 5, id: 'x' });
  assert.deepEqual(Object.keys(c).sort(), ['chapter', 'choices', 'counts', 'created', 'dreams', 'finished', 'flags', 'frame', 'history',
    'hollow', 'hollowWaiting', 'id', 'lesson', 'lessons', 'look', 'name', 'nest', 'petname', 'places', 'updated'].sort());
  assert.deepEqual(c.hollow, { rounds: 0, byTable: {} });
  assert.equal(c.hollowWaiting, null, 'no Hollow round waiting');
  assert.deepEqual([c.finished, c.dreams, c.places], [{}, {}, {}]);
});

/* ------------------------------------------------ real version-1 saves */
const V1_KEYS = ['id', 'created', 'updated', 'look', 'petname', 'name', 'dream', 'flags', 'choices', 'chapter', 'frame', 'history',
  'done', 'doneAt', 'counts', 'lessons', 'lesson', 'nest', 'hollow'];

test('migrate: real version-1 saves (finished, partway, mid-lesson, mid-Hollow, re-reading, new) lose nothing', () => {
  const kinds = new Set();
  for (const [name, save] of Object.entries(V1SAVES)) {
    const m = E.migrate(clone(save));
    assert.equal(m.version, 2);
    assert.equal(m.current, save.current, name + ': the current cat');
    assert.deepEqual(m.settings, save.settings, name + ': settings');
    assert.equal(m.cats.length, save.cats.length);
    save.cats.forEach((c1, i) => {
      const c2 = m.cats[i], who = name + '/' + c1.id;
      kinds.add(c1.id);
      // every field the version-1 engine wrote is accounted for
      Object.keys(c1).forEach(k => assert.ok(V1_KEYS.includes(k), who + ': unexpected v1 field ' + k));
      ['id', 'created', 'updated', 'look', 'petname', 'name', 'flags', 'chapter', 'frame', 'history', 'counts', 'lessons', 'lesson', 'nest']
        .forEach(k => assert.deepEqual(c2[k], c1[k], who + ': ' + k));
      if (c1.done) assert.equal(c2.finished.ch01, c1.doneAt, who + ': done -> finished.ch01');
      else assert.deepEqual(c2.finished, {}, who + ': not finished');
      if (c1.dream) assert.equal(c2.dreams.ch01, c1.dream, who + ': dream -> dreams.ch01');
      else if (c1.done) assert.equal(c2.dreams.ch01, '', who + ': a finished chapter with no dream skipped it');
      else assert.equal(c2.dreams.ch01, undefined, who + ': no dream yet');
      assert.equal(c2.hollow.rounds, c1.hollow.rounds, who + ': every round still counts');
      assert.deepEqual(c2.hollow.byTable['1'], c1.hollow, who + ': the Hollow record is the 1s’');
      assert.equal(Object.keys(c2.choices).length, Object.keys(c1.choices).length);
      Object.keys(c1.choices).forEach(k => assert.deepEqual(c2.choices['ch01:' + k], c1.choices[k], who + ': choice ' + k));
      ['done', 'doneAt', 'dream'].forEach(k => assert.ok(!(k in c2), who + ': no v1 field ' + k + ' left'));
    });
  }
  assert.deepEqual([...kinds].sort(), ['cat-finished', 'cat-fresh', 'cat-hollow', 'cat-lesson', 'cat-partway', 'cat-reread']);
});

test('migrate: idempotent, and the store loads, saves and reloads a version-1 save unchanged', () => {
  for (const save of Object.values(V1SAVES)) {
    const m1 = E.migrate(clone(save));
    assert.deepEqual(E.migrate(clone(m1)), m1, 'migrating twice changes nothing');
    assert.deepEqual(E.migrate(E.migrate(clone(m1))), m1);
    const ls = memStorage();
    ls.setItem('potomac-crossing.v1', JSON.stringify(save));
    const store = E.createStore(ls);
    const loaded = store.load();
    assert.deepEqual(loaded, m1);
    assert.equal(store.save(loaded), true);
    assert.deepEqual([...ls._m.keys()], ['potomac-crossing.v1'], 'still one key');
    assert.equal(JSON.parse(ls.getItem('potomac-crossing.v1')).version, 2);
    assert.deepEqual(E.createStore(ls).load(), m1, 'a version-2 save reloads as it was');
  }
});

test('a finished version-1 cat opens on the hub, where chapter 2 waits; its claw mark keeps its glow', () => {
  const ch01 = realCh01(), { ch02 } = fixtures();
  const stories = [ch02, ch01];   // any order: chapters go by number
  const m = E.migrate(clone(V1SAVES.device));
  const fin = E.getCat(m, 'cat-finished'), hol = E.getCat(m, 'cat-hollow');
  const p = E.progress(fin, stories);
  assert.equal(p.reading.id, 'ch01');
  assert.equal(p.atEnd, true, 'on the end frame: the hub');
  assert.deepEqual(p.finished.map(s => s.id), ['ch01']);
  assert.equal(p.next.id, 'ch02', 'chapter 2 is the big button');
  assert.equal(p.nextInProgress, false);
  assert.equal(E.isOpen(fin, ch02, stories), true);
  assert.equal(E.status(fin, stories), 'Chapter 1 finished');
  assert.deepEqual(E.learnedCounts(fin, stories).map(c => c.table), [1]);
  assert.deepEqual(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, fin, stories).opts, { marks: 1, glow: [false] });
  assert.deepEqual(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, hol, stories).opts, { marks: 1, glow: [true] });
  // without chapter 2 built, the hub says it is coming soon, in chapter 1's own teaser
  const alone = E.progress(fin, [ch01]);
  assert.equal(alone.next, null);
  assert.equal(alone.soon.title, 'Chapter 2: After the Storm');
  assert.equal(alone.soon.built, false);
});

test('a version-1 cat partway through chapter 1 resumes exactly where it was, and plays on the same', () => {
  const ch01 = realCh01(), old = V1.v1();
  const c1 = clone(V1SAVES.device.cats.find(c => c.id === 'cat-partway'));
  const c2 = E.migrate({ cats: [clone(c1)] }).cats[0];
  assert.equal(E.frameId(c2, ch01), 'f040');
  assert.equal(E.status(c2, [ch01]), 'Chapter 1 · page 41');
  assert.equal(E.progress(c2, [ch01]).atEnd, false, 'opens on its frame, not the hub');
  // Back walks the same pages in both engines
  const b1 = clone(c1), b2 = clone(c2), w1 = [], w2 = [];
  while (old.E.back(b1, old.story)) w1.push(b1.frame);
  while (E.back(b2, ch01)) w2.push(b2.frame);
  assert.deepEqual(w2, w1);
  // and forward to the end: the same chapter 1
  const s = { choices: { f045: 1, f066: 2 }, miss: ['6x1'], t: 9000000 };
  const seq1 = V1.play(old.E, old.story, c1, V1.script(s));
  const seq2 = V1.play(E, ch01, c2, V1.script(s));
  assert.deepEqual(seq2, seq1);
  assert.deepEqual(clone(c2), clone(E.migrate({ cats: [clone(c1)] }).cats[0]));
});

test('a version-1 cat mid-lesson resumes at the same question and finishes the lesson the same', () => {
  const ch01 = realCh01(), old = V1.v1();
  const c1 = clone(V1SAVES.device.cats.find(c => c.id === 'cat-lesson'));
  const c2 = E.migrate({ cats: [clone(c1)] }).cats[0];
  assert.equal(E.frameId(c2, ch01), 'f062');
  assert.deepEqual(c2.lesson, c1.lesson);
  const q1 = old.E.counts.question(c1.lesson.state), q2 = E.counts.question(c2.lesson.state);
  ['a', 'b', 'answer', 'retry', 'filler', 'hard', 'number', 'total', 'groups', 'per'].forEach(k => assert.deepEqual(q2[k], q1[k], k));
  assert.equal(q2.step, 1);
  const s = { t: 9000000, miss: ['1x10'] };
  assert.deepEqual(V1.play(E, ch01, c2, V1.script(s)), V1.play(old.E, old.story, c1, V1.script(s)));
  assert.deepEqual(clone(c2), clone(E.migrate({ cats: [clone(c1)] }).cats[0]));
  assert.equal(c2.lessons['ch01-tails'].finished, true);
  assert.equal(c2.lessons['ch01-tails'].noHelp, false, 'the miss before the save still counts');
});

test('a version-1 cat mid-Hollow-round finishes the round with the same treasure, and the 1s keep their glow', () => {
  const ch01 = realCh01(), old = V1.v1();
  const c1 = clone(V1SAVES.device.cats.find(c => c.id === 'cat-hollow'));
  const c2 = E.migrate({ cats: [clone(c1)] }).cats[0];
  assert.equal(c2.lesson.mode, 'hollow');
  assert.deepEqual(c2.lesson, c1.lesson);
  const st1 = c1.lesson.state, st2 = c2.lesson.state;
  const r1 = V1.runLesson(old.E, c1, old.E.hollowDef(old.story, 1), st1, V1.script({ t: 9000000 }));
  const r2 = V1.runLesson(E, c2, E.hollowDef([ch01], st2.table), st2, V1.script({ t: 9000000 }));
  assert.equal(r2.hollow.awarded.id, r1.hollow.awarded.id);
  assert.equal(r2.hollow.awarded.id, 'pebble', 'the fourth treasure');
  assert.deepEqual(clone(c2.nest), clone(c1.nest));
  assert.deepEqual(clone(c2.hollow.byTable['1']), clone(c1.hollow));
  assert.equal(c2.hollow.byTable['1'].glow, true);
  assert.equal(c2.lesson, null);
  // the next round is the same round in both engines (same facts, same hard ones early)
  const n1 = old.E.hollowStart(c1, old.story, 1, 1).state.queue, n2 = E.hollowStart(c2, [ch01], 1, 1).state.queue;
  assert.deepEqual(clone(n2), clone(n1));
});

test('a version-1 cat re-reading chapter 1 keeps it finished and its skipped dream; a new cat is just starting', () => {
  const ch01 = realCh01();
  const m = E.migrate(clone(V1SAVES.reread));
  const c = E.getCat(m, 'cat-reread'), fresh = E.getCat(m, 'cat-fresh');
  assert.ok(E.isFinished(c, 'ch01'));
  assert.equal(E.frameId(c, ch01), 'f010');
  assert.equal(E.status(c, [ch01]), 'Chapter 1 · page 10');
  assert.equal(E.buildBook(ch01, c).dream, E.fill(ch01.book.noDream, c), 'the skipped dream stays skipped');
  assert.deepEqual(E.buildFullBook(c, [ch01]).pages.map(p => p.id), ['ch01']);
  assert.equal(E.status(fresh, [ch01]), 'Just starting');
  assert.equal(fresh.chapter, null);
});

/* ------------------------------------------------ chapter 1 plays exactly as before */
test('chapter 1 plays exactly as before, start to end, the lesson and the book (new engine beside the shipped one)', () => {
  const ch01 = realCh01(), old = V1.v1();
  const runs = [
    { choices: { f014: 0, f018: 0, f028: 0, f045: 0, f066: 0 }, miss: ['3x1', '8x1'] },
    { look: { sex: 'tom', fur: 'black', marking: 'back-stripe', eyes: 'blue' }, petname: 'SNICKERDOODLE', clanname: 'Thunderstormwhiskers',
      dream: '', choices: { f014: 4, f018: 1, f028: 1, f045: 2, f066: 3 }, miss: ['1x7', '8x1', '1x10'], ms: 2500 },
    { choices: { f014: 3, f018: 0, f028: 1, f045: 1, f066: 1 }, miss: [], ms: 1200 }
  ];
  runs.forEach((over, n) => {
    const s1 = old.E.newSave(), s2 = E.newSave();
    const c1 = old.E.addCat(s1, { now: 1 }), c2 = E.addCat(s2, { now: 1 });
    c1.id = c2.id = 'same';
    old.E.startChapter(c1, old.story, 1000); E.startChapter(c2, ch01, 1000);
    const seq1 = V1.play(old.E, old.story, c1, V1.script(Object.assign({ t: 1000 }, over)));
    const seq2 = V1.play(E, ch01, c2, V1.script(Object.assign({ t: 1000 }, over)));
    assert.deepEqual(seq2, seq1, 'run ' + n + ': the same frames, in order');
    assert.equal(seq2[seq2.length - 1], 'f085');
    assert.deepEqual(plainCat(c2), plainCat(E.migrate({ cats: [clone(c1)] }).cats[0]), 'run ' + n + ': the same cat, in the version-2 shape');
    assert.deepEqual(clone(c2.counts), clone(c1.counts), 'run ' + n + ': the same lesson, answer by answer');
    const oldBook = clone(old.E.buildBook(old.story, c1));
    assert.deepEqual(clone(E.buildBook(ch01, c2)), oldBook, 'run ' + n + ': the same book page');
    const full = E.buildFullBook(c2, [ch01]);
    assert.equal(full.title, oldBook.title);
    assert.deepEqual(clone(full.pages.map(p => [p.heading, p.recap, p.dream])), [[oldBook.chapter, oldBook.recap, oldBook.dream]]);
    assert.equal(E.status(c2, [ch01]), 'Chapter 1 finished');
    // then the Training Hollow, the same round with the same treasure
    const h1 = V1.hollowRound(old.E, c1, old.story, V1.script({ t: 5e6, miss: ['1x2'] }));
    const h2 = V1.hollowRound(E, c2, ch01, V1.script({ t: 5e6, miss: ['1x2'] }));
    assert.deepEqual(clone(h2.state.queue), clone(h1.state.queue));
    assert.equal(h2.rec.hollow.awarded.id, h1.rec.hollow.awarded.id);
    assert.deepEqual(plainCat(c2), plainCat(E.migrate({ cats: [clone(c1)] }).cats[0]));
  });
});

/* ------------------------------------------------ chapters */
test('chapters: read in order of number; chapter 2 opens once chapter 1 is finished', () => {
  const { ch01, ch02 } = fixtures();
  const list = E.chapters({ b: ch02, a: ch01 });
  assert.deepEqual(list.map(s => s.id), ['ch01', 'ch02']);
  assert.equal(E.chapter('ch02', list), ch02);
  assert.equal(E.nextChapter(ch01, list), ch02);
  assert.equal(E.nextChapter(ch02, list), null);
  assert.equal(E.chapterHeading(ch02), 'Chapter 2: After the Storm');
  const cat = E.blankCat({ now: 1 });
  cat.name = 'Moon';
  assert.equal(E.isOpen(cat, ch01, list), true);
  assert.equal(E.isOpen(cat, ch02, list), false);
  assert.equal(E.upNext(cat, list), ch01);
  assert.equal(E.status(cat, list), 'Just starting');
  E.startChapter(cat, ch01, 1);
  playNew(cat, ch01, { miss: [] });
  assert.ok(E.isFinished(cat, 'ch01'));
  assert.equal(E.isOpen(cat, ch02, list), true);
  let p = E.progress(cat, list);
  assert.equal(p.next, ch02);
  assert.equal(p.soon, null, 'chapter 2 is built: no "coming soon"');
  assert.deepEqual(E.teaser(ch01, cat, list), { title: 'Chapter 2: After the Storm', lines: ['Tomorrow, Moonpaw: ears.'], built: true, next: 'ch02' });
  assert.equal(E.status(cat, list), 'Chapter 1 finished');
  E.startChapter(cat, ch02, 2);
  assert.equal(cat.chapter, 'ch02');
  assert.deepEqual(cat.history, [], 'each chapter has its own back-history');
  assert.equal(E.status(cat, list), 'Chapter 2 · page 1');
  assert.equal(E.progress(cat, list).nextInProgress, false);
  E.next(cat, ch02, 3);
  assert.equal(E.status(cat, list), 'Chapter 2 · page 2');
  assert.equal(E.progress(cat, list).nextInProgress, true, 'the hub button resumes chapter 2');
  playNew(cat, ch02, { dream: 'a fish that could fly' });
  p = E.progress(cat, list);
  assert.equal(p.next, null);
  assert.deepEqual(p.soon, { title: 'Chapter 3: Under the Old Bridge', lines: ['Something sniffles in the dark.'], built: false, next: null });
  assert.equal(E.status(cat, list), 'Chapter 2 finished');
  assert.deepEqual(Object.keys(cat.finished), ['ch01', 'ch02']);
  assert.ok(cat.finished.ch02 > cat.finished.ch01);
  // reading chapter 1 again keeps both finished
  E.startChapter(cat, ch01, 9e9);
  assert.equal(E.status(cat, list), 'Chapter 1 · page 1');
  assert.ok(E.isFinished(cat, 'ch02'));
  assert.equal(E.progress(cat, list).next, null);
});

test('flow: each chapter keeps its own dream, choices never collide across chapters, {dream} is this chapter’s', () => {
  const { ch01, ch02 } = fixtures();
  // a chapter-2 choice on a frame id chapter 1 also uses
  ch02.frames.f004 = { choice: { options: [{ label: 'Yes', sets: { ch2Path: 'river' }, next: 'a11' }] } };
  ch02.frames.a10.choice.options[1].next = 'f004';
  const cat = finishedCat({ ch01 }, { dream: 'otters' });
  assert.deepEqual(cat.dreams, { ch01: 'otters' });
  assert.equal(E.fill('{dream}', cat), 'otters');
  E.startChapter(cat, ch02, 5);
  assert.equal(E.fill('[{dream}]', cat), '[]', 'chapter 2 has no dream yet');
  playNew(cat, ch02, { dream: '  a  giant fish ', choices: { a10: 1 } });
  assert.deepEqual(cat.dreams, { ch01: 'otters', ch02: 'a giant fish' });
  assert.equal(E.fill('{dream}', cat), 'a giant fish');
  assert.deepEqual(cat.choices['ch01:f004'], { index: 0, label: 'Noticing' });
  assert.deepEqual(cat.choices['ch02:f004'], { index: 0, label: 'Yes' });
  assert.deepEqual(E.chosen(cat, ch02, 'a10'), { index: 1, label: 'Go down to the river.' });
  assert.equal(cat.flags.specialty, 'noticing', 'chapter 1’s flags sit beside chapter 2’s');
  assert.equal(cat.flags.ch2Path, 'river');
});

/* ------------------------------------------------ the skip-count */
test('skip: an interaction like next; any tap counts the next group; nothing is logged', () => {
  const { ch02 } = fixtures();
  assert.deepEqual(E.checkStory(ch02), []);
  const f = ch02.frames.a03;
  assert.equal(E.kindOf(f), 'skip');
  assert.ok(E.KINDS.includes('skip'));
  assert.deepEqual(E.exits(f), ['a04']);
  assert.deepEqual(E.skipView(f.skip, 0), { table: 2, groups: 5, per: 2, taps: 0, highlight: 0, total: 0, totals: [], done: false, count: '' });
  assert.equal(E.skipView(f.skip, 1).count, '2…');
  const three = E.skipView(f.skip, 3);
  assert.deepEqual([three.highlight, three.total, three.totals, three.count, three.done], [6, 6, [2, 4, 6], '2… 4… 6…', false]);
  const all = E.skipView(f.skip, 5);
  assert.deepEqual([all.highlight, all.totals, all.count, all.done], [10, [2, 4, 6, 8, 10], '2… 4… 6… 8… 10!', true]);
  assert.equal(E.skipView(f.skip, 99).taps, 5, 'extra taps change nothing');
  assert.equal(E.skipView({ table: 5, groups: 2 }, 2).count, '5… 10!');
  const cat = E.blankCat({});
  E.startChapter(cat, ch02, 1);
  E.go(cat, ch02, 'a03', 2);
  assert.ok(E.next(cat, ch02, 3));
  assert.equal(cat.frame, 'a04');
  assert.deepEqual(cat.counts, []);
  assert.ok(E.back(cat, ch02));
  assert.equal(cat.frame, 'a03', 'Back works as on any frame');
  const bad = clone(ch02); bad.frames.a03.skip = { next: 'a04' };
  assert.ok(E.checkStory(bad).some(e => /skip needs a table and groups/.test(e)));
});

/* ------------------------------------------------ gifts */
test('gift: reaching the frame puts it in her nest, once; Back never takes it away; My nest shows gifts first', () => {
  const { ch02 } = fixtures();
  assert.deepEqual(E.gift('riffle-stone'), { id: 'riffle-stone', name: 'Riffle’s lucky stone: dark and smooth, with a white stripe all the way around', from: 'Riffle' });
  assert.ok(E.GIFTS.some(g => g.id === 'riffle-stone'));
  const cat = E.blankCat({});
  cat.nest = ['moss'];
  E.startChapter(cat, ch02, 1);
  E.go(cat, ch02, 'a08', 2);
  assert.deepEqual(cat.nest, ['moss']);
  E.choose(cat, ch02, 0, 3);
  assert.equal(cat.frame, 'a09');
  assert.deepEqual(cat.nest, ['moss', 'riffle-stone']);
  E.back(cat, ch02);
  assert.deepEqual(cat.nest, ['moss', 'riffle-stone'], 'Back does not take it away');
  E.choose(cat, ch02, 1, 4);
  E.startChapter(cat, ch02, 5);
  playNew(cat, ch02, {});
  assert.deepEqual(cat.nest.filter(x => x === 'riffle-stone'), ['riffle-stone'], 'once, however often she reads it');
  cat.nest.push('feather');
  const g = E.nestGroups(cat);
  assert.deepEqual(g.gifts.map(x => [x.treasure.id, x.treasure.from, x.gift]), [['riffle-stone', 'Riffle', true]]);
  assert.deepEqual(g.treasures.map(x => x.treasure.id), ['moss', 'feather']);
  assert.equal(E.treasure('riffle-stone').name, E.GIFTS[0].name);
  assert.equal(E.giveGift(cat, 'riffle-stone'), false);
  const bad = clone(ch02); bad.frames.a09.gift = 'mystery';
  assert.ok(E.checkStory(bad).some(e => /unknown gift mystery/.test(e)));
});

/* ------------------------------------------------ `when` on lines and options */
test('when: captions and balloons show only when they match; a hidden balloon never shifts who says the rest', () => {
  const { ch02 } = fixtures();
  const f = ch02.frames.a01, cat = E.blankCat({});
  assert.deepEqual(E.captions(f, cat), ['Morning.']);
  cat.flags.specialty = 'noticing';
  assert.deepEqual(E.captions(f, cat), ['Morning.', 'The earth behind the pile is dug up.']);
  cat.flags.worry = 'water';
  assert.equal(E.captions(f, cat).length, 3);
  assert.deepEqual(E.balloons(f, E.blankCat({})).map(b => [b.text, b.nth]), [['WHAT? SPEAK UP!', 0], ['Hello, cat!', 2]]);
  assert.deepEqual(E.balloons(f, cat).map(b => [b.text, b.nth]), [['WHAT? SPEAK UP!', 0], ['Psst, it’s deep.', 1], ['Hello, cat!', 2]]);
  assert.ok(E.balloons(f, cat).every(b => !('when' in b) && b.who === 'otter'));
  // plain strings still work, as in chapter 1
  assert.deepEqual(E.captions({ caption: 'One.' }, cat), ['One.']);
  assert.deepEqual(E.captions({ caption: ['A', { text: 'B' }, { when: { worry: 'small' }, text: 'C' }] }, cat), ['A', 'B']);
});

test('when: a choice hides options that don’t match (and refuses them); it keeps at least one', () => {
  const { ch02 } = fixtures();
  const f = ch02.frames.a08, cat = E.blankCat({});
  assert.deepEqual(E.options(f, cat).map(o => o.index), [0, 1]);
  E.startChapter(cat, ch02, 1);
  E.go(cat, ch02, 'a08', 2);
  assert.equal(E.choose(cat, ch02, 2, 3), false, 'a hidden option can’t be chosen');
  assert.equal(cat.frame, 'a08');
  cat.flags.specialty = 'swimming';
  assert.deepEqual(E.options(f, cat).map(o => o.index), [0, 1, 2]);
  assert.equal(E.choose(cat, ch02, 2, 4), true);
  assert.equal(cat.flags.ch2SaidAloud, true);
  const none = { choice: { options: [{ label: 'A', when: { worry: 'small' }, next: 'x' }, { label: 'B', when: { worry: 'talk' }, next: 'y' }] } };
  assert.deepEqual(E.options(none, cat).map(o => o.index), [0], 'never an empty choice');
});

test('when: lessonClean (that lesson finished with no help), firstTry (her latest first ask, either order), not', () => {
  const { ch02 } = fixtures();
  const tree = ch02.frames.a05, pile = ch02.frames.a07;
  const cat = E.blankCat({});
  const say = (f) => E.balloons(f, cat).map(b => b.text);
  assert.deepEqual(say(tree), ['Your first mark is still there.'], 'no lesson yet: not clean');
  cat.lessons['ch02-tails'] = { set: 'ch02-tails', helped: 1, noHelp: false, finished: true };
  assert.deepEqual(say(tree), ['Your first mark is still there.']);
  cat.lessons['ch02-tails'] = { set: 'ch02-tails', helped: 0, noHelp: true, finished: true };
  assert.deepEqual(say(tree), ['Your first mark is a little deeper.']);
  assert.equal(E.matches({ lessonClean: ['nope', 'ch02-tails'] }, cat), true, 'a list: any of');
  // firstTry
  assert.deepEqual(say(pile), ['Hmph.'], 'never asked');
  E.logAnswer(cat, { set: 'ch02-pile', a: 10, b: 2, answer: 20, correct: true, ms: 3000, helped: false, retry: false, at: 1 });
  assert.deepEqual(say(pile), ['Lucky guess.']);
  assert.equal(E.firstTry(cat, '2x10'), true, 'either order');
  assert.equal(E.firstTry(cat, '2 × 10'), true);
  // a later first ask, wrong, then its retry right: the latest first ask decides
  E.logAnswer(cat, { set: 'hollow-2s', a: 2, b: 10, answer: 12, correct: false, ms: 3000, helped: true, retry: false, at: 2 });
  E.logAnswer(cat, { set: 'hollow-2s', a: 2, b: 10, answer: 20, correct: true, ms: 3000, helped: false, retry: true, at: 3 });
  E.logAnswer(cat, { set: 'hollow-2s', a: 2, b: 10, answer: 20, correct: true, ms: 3000, helped: false, retry: false, filler: true, at: 4 });
  assert.deepEqual(say(pile), ['Hmph.']);
  assert.equal(E.firstTry(cat, 'ten'), false);
  // not, nested and combined with flags
  cat.flags.ch2Path = 'bridge';
  assert.equal(E.matches({ ch2Path: 'bridge', not: { lessonClean: 'ch02-tails' } }, cat), false);
  assert.equal(E.matches({ ch2Path: 'bridge', not: { ch2Path: 'river' } }, cat), true);
  assert.equal(E.matches({ not: { not: { ch2Path: 'bridge' } } }, cat), true);
  // the story check catches a bad condition
  const bad = clone(ch02);
  bad.frames.a05.say[0].when = { lessonClean: 'ch02-nope' };
  bad.frames.a07.say[0].when = { firstTry: 'ten twos' };
  bad.frames.a01.caption.push({ when: { worry: 'small' } });
  const errs = E.checkStory(bad);
  assert.ok(errs.some(e => /lessonClean names no counts set here: ch02-nope/.test(e)), errs.join('\n'));
  assert.ok(errs.some(e => /firstTry wants "AxB": ten twos/.test(e)));
  assert.ok(errs.some(e => /a01: caption 3 has no text/.test(e)));
});

/* ------------------------------------------------ claw marks from the cat */
test('scene options from the cat: marks and glow "auto" on the hollow, one mark per Count learned, left to right', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  const scene = { set: 'hollow', cam: 'tree', opts: { marks: 'auto', glow: 'auto' }, cast: [] };
  const cat = E.blankCat({});
  assert.deepEqual(E.resolveScene(scene, cat, list).opts, { marks: 0, glow: [] });
  cat.lessons['ch01-tails'] = { finished: true, noHelp: true };
  assert.deepEqual(E.resolveScene(scene, cat, list).opts, { marks: 1, glow: [false] });
  cat.lessons['ch02-tails'] = { finished: true };   // a warm-up on the 1s is no new Count
  assert.deepEqual(E.resolveScene(scene, cat, list).opts, { marks: 1, glow: [false] });
  cat.hollow.byTable['1'] = { rounds: 3, cleanRounds: 3, glow: true };
  cat.lessons['ch02-ears'] = { finished: true };
  assert.deepEqual(E.resolveScene(scene, cat, list).opts, { marks: 2, glow: [true, false] });
  cat.hollow.byTable['2'] = { rounds: 4, cleanRounds: 3, glow: true };
  assert.deepEqual(E.resolveScene(scene, cat, list).opts, { marks: 2, glow: [true, true] });
  assert.equal(scene.opts.marks, 'auto', 'the story’s scene is never changed');
  const fixed = { set: 'hollow', opts: { marks: 1, glow: true } };
  assert.equal(E.resolveScene(fixed, cat, list), fixed, 'explicit options stay as written');
  assert.deepEqual(E.resolveScene({ set: 'hollow', opts: { marks: 'auto' } }, cat, list).opts, { marks: 2 });
  assert.equal(E.resolveScene({ set: 'den' }, cat, list).set, 'den');
});

test('scene options from the cat: the den’s stone "auto" is where she put Riffle’s stone (ch2Stone), else between her paws', () => {
  const den = { set: 'den', cam: 'nest', opts: { weather: 'clear', moon: false, stone: 'auto' }, cast: [] };
  const cat = E.blankCat({});
  assert.deepEqual(E.resolveScene(den, cat).opts, { weather: 'clear', moon: false, stone: true }, 'not chosen yet: between her paws');
  cat.flags.ch2Stone = 'nose';
  assert.equal(E.resolveScene(den, cat).opts.stone, 'nose');
  cat.flags.ch2Stone = 'chin';
  assert.equal(E.resolveScene(den, cat).opts.stone, 'chin');
  cat.flags.ch2Stone = 'pocket';
  assert.equal(E.resolveScene(den, cat).opts.stone, true, 'anything else: between her paws');
  assert.equal(den.opts.stone, 'auto', 'the story’s scene is never changed');
  assert.equal(E.resolveScene(den, null).opts.stone, true, 'no cat');
  const put = { set: 'den', opts: { stone: 'chin' } };
  assert.equal(E.resolveScene(put, cat), put, 'a stone the story places stays where it is');
  // chapter 2's nights: the stone is in her nest from f108 on, where she put it
  const ch02 = require('../app/story/ch02.js').story.ch02;
  const nights = Object.keys(ch02.frames).filter(id => ch02.frames[id].scene.set === 'den' && ch02.frames[id].scene.fx.includes('night'));
  assert.ok(nights.length >= 7);
  const f108 = nights[0], opts = ch02.frames[f108].choice.options;
  assert.equal(ch02.frames[f108].scene.opts.stone, true, f108 + ': she looks at it between her paws');
  assert.deepEqual(opts.map(o => o.sets.ch2Stone), ['nose', 'chin']);
  nights.slice(1).forEach(id => assert.equal(ch02.frames[id].scene.opts.stone, 'auto', id));
  const her = E.blankCat({});
  E.startChapter(her, ch02);
  her.frame = f108;
  assert.ok(E.choose(her, ch02, 1));
  nights.slice(1).forEach(id => assert.equal(E.resolveScene(ch02.frames[id].scene, her).opts.stone, 'chin', id));
});

/* ------------------------------------------------ Counts sets, new keys */
test('counts: facts as objects (prompt on the first ask, right lines in place of praise, rightPicture, groups/per), unit and picture pass through', () => {
  const { ch02 } = fixtures();
  const cat = E.blankCat({});
  const { def, state: st } = E.chapterLesson(cat, ch02, 'ch02-ears', 1, [ch02]);
  assert.equal(def.id, 'ch02-ears');
  assert.equal(def.unit, 'cat');
  const asked = [];
  let q;
  // 3 × 2: three cats, two ears each, counted by twos
  q = E.counts.question(st);
  assert.deepEqual([q.a, q.b, q.groups, q.per, q.table, q.step, q.prompt, q.right], [3, 2, 3, 2, 2, 2, null, null]);
  E.counts.answer(st, def, 6, 3000, 1);
  q = E.counts.question(st);
  assert.deepEqual([q.groups, q.per], [5, 2], '2 × 5: five cats, two ears each');
  E.counts.answer(st, def, 10, 3000, 2);
  q = E.counts.question(st);
  assert.equal(q.prompt, 'Six cats. Past ten now: the first five make ten. Keep hopping!');
  // a miss on 2 × 6: help counts by twos; the retry is asked plainly
  let r = E.counts.answer(st, def, 11, 3000, 3);
  assert.deepEqual(r.help, { a: 2, b: 6, answer: 12, groups: 6, per: 2, table: 2, step: 2 });
  assert.equal(r.entry.table, undefined, 'a fact of the set’s own Count needs no table on its log entry');
  // 5 × 2, right the first time: its own lines and the regrouped picture, not praise
  q = E.counts.question(st);
  assert.deepEqual([q.a, q.b], [5, 2]);
  r = E.counts.answer(st, def, 10, 3000, 4);
  assert.equal(r.lineKind, 'right');
  assert.equal(r.line, '');
  assert.deepEqual(r.balloons, [{ who: 'tallyheart', text: 'Five pairs of ears. Same ten!' }]);
  assert.deepEqual(r.rightPicture, { groups: 2, per: 5 });
  // the rest, collecting what is asked
  while (!E.counts.done(st)) { q = E.counts.question(st); asked.push(q); E.counts.answer(st, def, q.answer, 3000, 9); }
  const retry = asked.find(x => x.retry);
  assert.deepEqual([retry.a, retry.b, retry.prompt, retry.right], [2, 6, null, null]);
  // a missed fact whose picture regroups: a right retry regroups it again, with its own lines (they
  // say why the picture moved), not the "again" line
  const st2 = E.counts.start(def, { set: 'ch02-ears', facts: [{ a: 5, b: 2, right: [{ who: 'tallyheart', text: 'Same ten!' }], rightPicture: { groups: 2, per: 5 } }, [3, 2], [4, 2]] });
  E.counts.answer(st2, def, 9, 3000, 1);
  E.counts.answer(st2, def, 6, 3000, 2); E.counts.answer(st2, def, 8, 3000, 3);
  const rr = E.counts.answer(st2, def, 10, 3000, 4);
  assert.equal(rr.lineKind, 'right');
  assert.deepEqual(rr.balloons, [{ who: 'tallyheart', text: 'Same ten!' }]);
  assert.deepEqual(rr.rightPicture, { groups: 2, per: 5 });
  // other right lines are for the first ask only; a right retry earns "again" unless the fact has
  // rightAgain lines of its own (10 × 2's "Hmph.")
  const st3 = E.counts.start(def, { set: 'p', facts: [{ a: 10, b: 2, right: [{ who: 'grizzled', text: 'Lucky guess.' }] }, [3, 2], [4, 2]] });
  E.counts.answer(st3, def, 19, 3000, 1); E.counts.answer(st3, def, 6, 3000, 2); E.counts.answer(st3, def, 8, 3000, 3);
  assert.equal(E.counts.answer(st3, def, 20, 3000, 4).lineKind, 'again');
  const st4 = E.counts.start(def, { set: 'p', facts: [{ a: 10, b: 2, right: [{ who: 'grizzled', text: 'Lucky guess.' }], rightAgain: [{ who: 'grizzled', text: 'Hmph.' }, 'One morning of ears, and {they}’s hopping already.'] }, [3, 2], [4, 2]] });
  E.counts.answer(st4, def, 19, 3000, 1); E.counts.answer(st4, def, 6, 3000, 2); E.counts.answer(st4, def, 8, 3000, 3);
  const r4 = E.counts.answer(st4, def, 20, 3000, 4);
  assert.equal(r4.lineKind, 'right');
  assert.deepEqual(r4.balloons, [{ who: 'grizzled', text: 'Hmph.' }, { text: 'One morning of ears, and {they}’s hopping already.' }], 'a string is the teacher’s line');
  // groups/per override and the fact's own picture (two rows of eight)
  const pile = E.counts.start(ch02.counts['ch02-pile'], { set: 'ch02-pile' });
  pile.pos = 2;
  q = E.counts.question(pile);
  assert.deepEqual([q.groups, q.per, q.picture, q.step], [2, 8, { kind: 'prey', layout: 'rows' }, 2]);
  pile.pos = 0;
  q = E.counts.question(pile);
  assert.deepEqual(q.picture, { kind: 'prey', thought: true });
  assert.deepEqual(q.prompt, [{ who: 'grizzled', text: 'Ten pairs. I bet a pillow cat can’t count that.' }], 'a prompt may be balloons');
  // the 1s keep counting by ones, and their log entries keep chapter 1's shape
  const t1 = E.counts.start(fixtures().ch01.counts['ch01-tails'], { set: 'ch01-tails' });
  assert.equal(E.counts.question(t1).step, 1);
  assert.deepEqual(Object.keys(E.counts.answer(t1, {}, 2, 1, 1).entry), ['set', 'a', 'b', 'answer', 'correct', 'ms', 'helped', 'retry', 'at']);
});

test('counts: a fact from another Count (mixed lessons) is pictured and logged as its own', () => {
  const def = { table: 2, facts: [[3, 2], { a: 4, b: 1, table: 1 }, [2, 2]] };
  const st = E.counts.start(def, { set: 'mix' });
  E.counts.answer(st, def, 6, 1, 1);
  const q = E.counts.question(st);
  assert.deepEqual([q.table, q.groups, q.per, q.step], [1, 4, 1, 1]);
  const r = E.counts.answer(st, def, 3, 1, 2);
  assert.equal(r.entry.table, 1);
  assert.equal(r.help.step, undefined);
  assert.equal(E.tableOf(r.entry), 1);
});

test('counts: warmHard puts a fact that was hard last time in the warm-up, and swaps out its twin', () => {
  const { ch02 } = fixtures();
  const def = Object.assign({ id: 'ch02-tails' }, ch02.counts['ch02-tails']);
  const plain = (facts) => facts.map(f => Array.isArray(f) ? f.join('x') : f.a + 'x' + f.b + (f.hard ? '!' : ''));
  const cat = E.blankCat({});
  assert.deepEqual(plain(E.lessonFacts(cat, def)), ['1x4', '7x1'], 'nothing hard: as written');
  const hardOne = (a, b, extra) => Object.assign({ set: 'ch01-tails', a, b, answer: a * b, correct: true, ms: 9000, helped: false, retry: false, at: 1 }, extra);
  const withHard = (a, b, extra) => { const c = E.blankCat({}); E.logAnswer(c, hardOne(a, b, extra)); return c; };
  assert.deepEqual(plain(E.lessonFacts(withHard(6, 1), def)), ['1x4', '6x1!'], 'slow last time: second place');
  assert.deepEqual(plain(E.lessonFacts(withHard(4, 1), def)), ['1x3', '4x1!'], '4 × 1 hard: 1 × 3 opens instead');
  assert.deepEqual(plain(E.lessonFacts(withHard(1, 4, { correct: false, helped: true, answer: 5 }), def)), ['1x3', '1x4!']);
  assert.deepEqual(plain(E.lessonFacts(withHard(7, 1), def)), ['1x4', '7x1!']);
  // the warm-up through the runner: a right answer to the hard one earns the remembered line
  const c = withHard(6, 1);
  const { def: d, state } = E.chapterLesson(c, ch02, 'ch02-tails', 1, [ch02]);
  E.counts.answer(state, d, 4, 2000, 2);
  const r = E.counts.answer(state, d, 6, 2000, 3);
  assert.equal(r.lineKind, 'remembered');
  assert.equal(r.line, 'Last time, that one made you stop and think. Not today!');
  // a warm-up miss comes back after the other question, never asking that one twice running
  const st2 = E.chapterLesson(E.blankCat({}), ch02, 'ch02-tails', 1, [ch02]).state;
  const order = [];
  E.counts.answer(st2, d, 5, 3000, 1);
  while (!E.counts.done(st2)) { const q = E.counts.question(st2); order.push(q.a + 'x' + q.b + (q.retry ? '*' : '') + (q.filler ? 'f' : '')); E.counts.answer(st2, d, q.answer, 3000, 2); }
  assert.deepEqual(order, ['7x1', '1x4*']);
});

test('counts: fillFrom lends the 2s to the pile: her right answers there, most recent first, then its facts', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  const cat = E.blankCat({});
  // she did the ears lesson: everything right, in the set's order
  const ears = E.chapterLesson(cat, ch02, 'ch02-ears', 1, list);
  while (!E.counts.done(ears.state)) { const q = E.counts.question(ears.state); E.logAnswer(cat, E.counts.answer(ears.state, ears.def, q.answer, 2000, 1).entry); }
  // 5 × 2 and 2 × 5 are one fact: it lends itself once, as last answered
  assert.deepEqual(E.fillPool(cat, 'ch02-ears', list).map(p => p.a + 'x' + p.b), ['9x2', '2x8', '5x2', '2x6', '3x2']);
  const { def, state: st } = E.chapterLesson(cat, ch02, 'ch02-pile', 2, list);
  assert.ok(st.pool && st.pool.length === 5);
  // 10 × 2 and 8 × 2 right, the warrior's check (2 × 8) missed: two fillers from the ears, then 2 × 8 again
  E.counts.answer(st, def, 20, 3000, 2); E.counts.answer(st, def, 16, 3000, 3);
  const r = E.counts.answer(st, def, 18, 3000, 4);
  assert.equal(r.requeued, true);
  assert.deepEqual(r.help, { a: 2, b: 8, answer: 16, groups: 2, per: 8, table: 2, step: 2 });
  const rest = [];
  while (!E.counts.done(st)) { const q = E.counts.question(st); rest.push(q); E.counts.answer(st, def, q.answer, 3000, 5); }
  assert.deepEqual(rest.map(q => q.a + 'x' + q.b + (q.filler ? 'f' : '') + (q.retry ? '*' : '')), ['9x2f', '5x2f', '2x8*'],
    'never the missed pair (2 × 8 is 8 × 2 too), and the fillers come from the 2s');
  assert.deepEqual([rest[2].groups, rest[2].per, rest[2].picture], [2, 8, { kind: 'prey', layout: 'rows' }], 'the retry is pictured the same');
  assert.equal(rest[0].prompt, null);
  // with no ears answers logged, the 2s' facts lend themselves in order
  const fresh = E.chapterLesson(E.blankCat({}), ch02, 'ch02-pile', 2, list);
  assert.deepEqual(fresh.state.pool.slice(0, 2).map(p => p.a + 'x' + p.b), ['3x2', '2x5']);
  // a summary of the pile: the fillers are not first asks
  const sum = E.counts.summary(st);
  assert.equal(sum.noHelp, false);
  assert.equal(E.factTable(st.log).find(x => x.a === 9 && x.b === 2).firstAsks, 0);
});

/* Chapter 2's Counts as the final text has them (v0.5): the ears lesson, then the pile (the old
 * tom's 10 × 2, her 8 × 2) and the warrior's check (2 × 8), both borrowing from the ears. */
function pileStory() {
  return {
    id: 'ch02', number: 2, title: 'After the Storm', start: 'a',
    frames: { a: { counts: { set: 'ch02-ears', next: 'b' } }, b: { counts: { set: 'ch02-pile', next: 'c' } }, c: { counts: { set: 'ch02-check', next: 'z' } }, z: { end: true } },
    counts: {
      'ch02-ears': {
        table: 2, thing: 'ear', things: 'ears', teacher: 'tallyheart',
        facts: [[3, 2], [2, 5], [4, 2], [2, 1], { a: 5, b: 2, right: [{ who: 'tallyheart', text: 'Same ten!' }], rightPicture: { groups: 2, per: 5 } },
          { a: 2, b: 6, lit: 10, prompt: 'Six cats. The first five cats have ten ears. Now hop on from ten!', retryPrompt: true }, [7, 2], [2, 2], [2, 8], [9, 2], [2, 10]],
        praise: ['You hopped it!'], fast: ['Quick as a pounce!']
      },
      'ch02-pile': {
        table: 2, thing: 'piece', things: 'pieces', unit: 'pair', units: 'pairs', picture: { kind: 'prey', layout: 'stacks' }, fillFrom: 'ch02-ears',
        fillIntro: 'One from this morning.',
        facts: [{ a: 10, b: 2, picture: { kind: 'prey', layout: 'stacks', thought: true }, prompt: [{ who: 'grizzled', text: 'Ten pairs. How many pieces?' }] },
          { a: 8, b: 2, light: 'groups', check: true, prompt: 'You touch your nose to each little stack.' }],
        praise: [], done: ''
      },
      'ch02-check': {
        table: 2, thing: 'piece', things: 'pieces', unit: 'pair', units: 'pairs', picture: { kind: 'prey', layout: 'stacks' }, fillFrom: 'ch02-ears',
        fillIntro: 'One from this morning.',
        facts: [{ a: 2, b: 8, groups: 2, per: 8, picture: { kind: 'prey', layout: 'rows' }, light: 'rows', check: true, prompt: 'Two rows of eight. How many pieces?', retryPrompt: true }],
        praise: [], done: ''
      }
    }
  };
}
/* Play one chapter lesson: `answers` maps "AxB" (as asked) to a list of answers, used in turn
 * (else right); `ms` likewise. Returns what was asked, as "10x2✗", "F:9x2", "R:8x2". */
function playSet(cat, story, setId, answers, ms) {
  const { def, state: st } = E.chapterLesson(cat, story, setId, 1, [story]);
  const seen = {}, out = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), k = q.a + 'x' + q.b;
    const i = seen[k] = (seen[k] || 0) + 1;
    const a = answers && answers[k] && answers[k][i - 1] != null ? answers[k][i - 1] : q.answer;
    const t = ms && ms[k] != null ? ms[k] : 2000;
    const r = E.counts.answer(st, E.questionDef(def, q, story, [story]), a, t, 1);
    E.logAnswer(cat, r.entry);
    out.push((q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'));
  }
  return out;
}

test('counts: a borrowed question never takes a pair the pile has asked today while there is another (the text’s sequences)', () => {
  const story = pileStory();
  const fresh = () => { const c = E.blankCat({}); playSet(c, story, 'ch02-ears'); return c; };
  // after a clean ears lesson: her right answers there, most recent first
  assert.deepEqual(E.fillPool(fresh(), 'ch02-ears', [story]).map(p => p.a + 'x' + p.b).slice(0, 4), ['2x10', '9x2', '2x8', '2x2']);
  // a missed 8 × 2 runs 8 × 2, 9 × 2, 2 × 2, 8 × 2 (never 2 × 10, the old tom's pair, just asked)
  assert.deepEqual(playSet(fresh(), story, 'ch02-pile', { '8x2': [15] }), ['10x2', '8x2✗', 'F:9x2', 'F:2x2', 'R:8x2']);
  // a missed 10 × 2: 10 × 2, 8 × 2, one ears question, then 10 × 2 again
  assert.deepEqual(playSet(fresh(), story, 'ch02-pile', { '10x2': [19] }), ['10x2✗', '8x2', 'F:9x2', 'R:10x2']);
  // missed every time: never 9 × 2 twice, never 2 × 8 (the check's own fact)
  assert.deepEqual(playSet(fresh(), story, 'ch02-pile', { '10x2': [19, 18, 17] }), ['10x2✗', '8x2', 'F:9x2', 'R:10x2✗', 'F:2x2', 'F:7x2', 'R:10x2✗']);
  // the check after a clean pile: it skips what the pile asked (2 × 10, and 2 × 8 itself)
  let cat = fresh();
  playSet(cat, story, 'ch02-pile');
  assert.deepEqual(playSet(cat, story, 'ch02-check', { '2x8': [14] }), ['2x8✗', 'F:9x2', 'F:2x2', 'R:2x8']);
  // ... and after a pile that borrowed 9 × 2 and 2 × 2 itself (either pile set, fillers included)
  cat = fresh();
  playSet(cat, story, 'ch02-pile', { '8x2': [15] });
  assert.deepEqual(E.siblingAsked(cat, story, 'ch02-check').sort(), ['2x10', '2x2', '2x8', '2x9']);
  assert.deepEqual(playSet(cat, story, 'ch02-check', { '2x8': [14] }), ['2x8✗', 'F:7x2', 'F:2x6', 'R:2x8']);
  // a Training Hollow round in between doesn't end the pile's run; the ears lesson before it does
  E.logAnswer(cat, { set: 'hollow-2s', a: 3, b: 2, answer: 6, correct: true, ms: 1000, helped: false, retry: false, at: 9 });
  assert.ok(E.siblingAsked(cat, story, 'ch02-check').includes('2x9'));
  assert.ok(!E.siblingAsked(cat, story, 'ch02-check').includes('2x3'), 'the ears lesson is not the pile');
  // when everything has been asked, a filler still comes: the retry is never left without its gap
  const all = { set: 'x', table: 2, facts: [[2, 3], [2, 4]], fillFrom: 'y' };
  const st = E.counts.start(all, { set: 'x', pool: [{ a: 2, b: 3 }, { a: 2, b: 4 }, { a: 2, b: 5 }], asked: ['2x5'] });
  E.counts.answer(st, all, 6, 1, 1); E.counts.answer(st, all, 7, 1, 2);
  assert.deepEqual(st.queue.slice(2).map(q => q.a + 'x' + q.b + (q.filler ? 'f' : '') + (q.retry ? '*' : '')), ['2x3f', '2x5f', '2x4*']);
});

test('counts: a borrowed question is the lending set’s, in its picture, words and praise; the check and 8 × 2 never make a fact hard by being right', () => {
  const story = pileStory();
  const cat = E.blankCat({});
  playSet(cat, story, 'ch02-ears');
  const { def, state: st } = E.chapterLesson(cat, story, 'ch02-pile', 1, [story]);
  E.logAnswer(cat, E.counts.answer(st, def, 20, 2000, 1).entry);
  const miss = E.counts.answer(st, def, 15, 9000, 2);
  assert.equal(miss.entry.check, true, '8 × 2 is logged as a check');
  E.logAnswer(cat, miss.entry);
  const q = E.counts.question(st);
  assert.deepEqual([q.a, q.b, q.filler, q.from, q.prompt], [9, 2, true, 'ch02-ears', null]);
  const qd = E.questionDef(def, q, story, [story]);
  assert.equal(qd.id, 'ch02-ears');
  assert.equal(qd.things, 'ears');
  assert.equal(E.questionDef(def, E.counts.question(E.counts.start(def, { set: 'ch02-pile' })), story, [story]), def, 'the pile’s own question is the pile’s');
  const r = E.counts.answer(st, qd, 18, 1500, 3);
  assert.deepEqual([r.lineKind, r.line, r.entry.from, r.entry.filler], ['fast', 'Quick as a pounce!', 'ch02-ears', true], 'the ears lesson’s fast line');
  E.logAnswer(cat, r.entry);
  while (!E.counts.done(st)) { const qq = E.counts.question(st); E.logAnswer(cat, E.counts.answer(st, E.questionDef(def, qq, story, [story]), qq.answer, 2000, 4).entry); }
  // a missed 8 × 2 still counts after a quick, right check (the answer was on screen by then)
  const check = playSet(cat, story, 'ch02-check');
  assert.deepEqual(check, ['2x8']);
  assert.equal(cat.counts[cat.counts.length - 1].check, true);
  assert.deepEqual(E.hardFacts(cat, 2), [[8, 2]]);
  // a perfect chapter read slowly (long prompts at 8 × 2 and the check): nothing is hard
  const slow = E.blankCat({});
  playSet(slow, story, 'ch02-ears');
  playSet(slow, story, 'ch02-pile', null, { '8x2': 9000 });
  playSet(slow, story, 'ch02-check', null, { '2x8': 7000 });
  assert.deepEqual(E.hardFacts(slow, 2), []);
  // ... nor a slow 10 × 2: since chapter 3 a right first ask read under its own prompt (the old
  // tom's balloon) is like a right check, and only a miss makes it hard; a missed check counts
  const slow2 = E.blankCat({});
  playSet(slow2, story, 'ch02-ears');
  playSet(slow2, story, 'ch02-pile', null, { '10x2': 9000 });
  playSet(slow2, story, 'ch02-check', { '2x8': [17] });
  assert.deepEqual(E.hardFacts(slow2, 2, [story]), [[2, 8]]);
  const missed10 = E.blankCat({});
  playSet(missed10, story, 'ch02-ears');
  playSet(missed10, story, 'ch02-pile', { '10x2': [19] }, { '10x2': 2000 });
  assert.deepEqual(E.hardFacts(missed10, 2, [story]), [[10, 2]], 'a missed 10 × 2 still does');
});

test('counts: a fact’s picture keys (who, lit, light) reach the question, and its retry; retryPrompt keeps a prompt on the retry', () => {
  const story = pileStory();
  const RIM = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }];
  const def = { id: 'e', table: 2, facts: [{ a: 3, b: 2, who: RIM }, story.counts['ch02-ears'].facts[5], [4, 2], [2, 2]] };
  const st = E.counts.start(def, { set: 'e' });
  let q = E.counts.question(st);
  assert.deepEqual([q.who, q.lit, q.light], [RIM, 0, null]);
  E.counts.answer(st, def, 6, 1, 1);
  q = E.counts.question(st);
  assert.deepEqual([q.lit, q.prompt], [10, 'Six cats. The first five cats have ten ears. Now hop on from ten!']);
  E.counts.answer(st, def, 11, 1, 2);
  E.counts.answer(st, def, 8, 1, 3); E.counts.answer(st, def, 4, 1, 4);
  q = E.counts.question(st);
  assert.deepEqual([q.a, q.b, q.retry, q.lit, q.prompt], [2, 6, true, 10, 'Six cats. The first five cats have ten ears. Now hop on from ten!'], 'the hop-on prompt and its ten lit ears come back with it');
  // the check: lit row by row as it is asked, and its prompt kept on the retry
  const cdef = story.counts['ch02-check'];
  const cst = E.counts.start(cdef, { set: 'ch02-check' });
  assert.equal(E.counts.question(cst).light, 'rows');
  E.counts.answer(cst, cdef, 14, 1, 1);
  while (!E.counts.done(cst)) { q = E.counts.question(cst); if (q.retry) break; E.counts.answer(cst, cdef, q.answer, 1, 2); }
  assert.deepEqual([q.retry, q.light, q.prompt], [true, 'rows', 'Two rows of eight. How many pieces?']);
  // the story check knows the new keys
  assert.deepEqual(E.checkStory(story), []);
  const bad = clone(story);
  Object.assign(bad.counts['ch02-check'].facts[0], { light: 'stacks', lit: 'ten', who: { who: 'grizzled' } });
  bad.counts['ch02-ears'].facts[0] = { a: 3, b: 2, retryPrompt: true, rightAgain: true };
  bad.counts['ch02-ears'].fillIntro = 'One from yesterday.';
  const errs = E.checkStory(bad).join('\n');
  for (const want of [/light is "groups" or "rows"/, /lit is a number/, /who is a list/, /retryPrompt: true keeps a prompt/, /rightAgain: true keeps right lines/, /fillIntro without fillFrom/]) assert.match(errs, want);
  // a fact without retryPrompt is asked plainly again (10 × 2's balloons are for the first ask)
  const p = E.counts.start(story.counts['ch02-pile'], { set: 'ch02-pile', facts: [story.counts['ch02-pile'].facts[0], [3, 2], [4, 2]] });
  E.counts.answer(p, {}, 19, 1, 1); E.counts.answer(p, {}, 6, 1, 2); E.counts.answer(p, {}, 8, 1, 3);
  assert.equal(E.counts.question(p).prompt, null);
});

test('the real chapter 2: a miss at the pile or the check borrows this morning’s ears, never a pair the pile asked, and the warm-up borrows last night’s tails', (t) => {
  let ch01, ch02;
  try { require('../app/story/ch01.js'); require('../app/story/ch02.js'); ch01 = PC.story.ch01; ch02 = PC.story.ch02; } catch (e) { ch02 = null; }
  if (!ch02 || !ch02.counts['ch02-check']) { t.skip('app/story/ch02.js not written yet'); return; }
  const fresh = () => { const c = E.blankCat({}); playSet(c, ch02, 'ch02-ears'); return c; };
  assert.deepEqual(playSet(fresh(), ch02, 'ch02-pile', { '8x2': [15] }), ['10x2', '8x2✗', 'F:9x2', 'F:2x2', 'R:8x2']);
  assert.deepEqual(playSet(fresh(), ch02, 'ch02-pile', { '10x2': [19] }), ['10x2✗', '8x2', 'F:9x2', 'R:10x2']);
  let cat = fresh();
  playSet(cat, ch02, 'ch02-pile');
  assert.deepEqual(playSet(cat, ch02, 'ch02-check', { '2x8': [14] }), ['2x8✗', 'F:9x2', 'F:2x2', 'R:2x8']);
  // each borrowed question is the ears lesson's, and a right check leaves 2 × 8 to the lesson's answer
  assert.ok(cat.counts.filter(e => e.filler).every(e => e.from === 'ch02-ears'));
  assert.deepEqual(E.hardFacts(cat, 2), [[2, 8]], 'the missed check counts');
  cat = fresh(); playSet(cat, ch02, 'ch02-pile', null, { '8x2': 9000 }); playSet(cat, ch02, 'ch02-check', null, { '2x8': 8000 });
  assert.deepEqual(E.hardFacts(cat, 2), [], 'reading the pile’s long lines never makes 8 × 2 or 2 × 8 hard');
  // the warm-up: a miss on its first fact borrows one of chapter 1's tails, then comes back
  if (ch01 && ch02.counts['ch02-tails'].fillFrom) {
    const c = E.blankCat({}); playSet(c, ch01, 'ch01-tails');
    const run = playSet(c, ch02, 'ch02-tails', { '1x4': [5] });
    assert.deepEqual([run[0], run[1], run[3]], ['1x4✗', '7x1', 'R:1x4']);
    assert.match(run[2], /^F:/);
    assert.equal(c.counts[c.counts.length - 2].from, 'ch01-tails');
  }
});

test('counts: praise lines may name the question ({a} {b} {answer}); the cat’s tokens are left for the page', () => {
  const def = { table: 2, facts: [[3, 2]], praise: ['{a} times {b} is {answer}, {name}paw!'] };
  const st = E.counts.start(def, { set: 's' });
  const r = E.counts.answer(st, def, 6, 9000, 1);
  assert.equal(r.line, '3 times 2 is 6, {name}paw!');
});

/* ------------------------------------------------ the Training Hollow, per Count */
test('hollow: one Count per chapter lesson, in teaching order, each with its own name', () => {
  const { ch01, ch02 } = fixtures(), list = [ch02, ch01];
  const sets = E.countSets(list);
  assert.deepEqual(sets.map(c => [c.table, c.setId, c.chapter]), [[1, 'ch01-tails', 'ch01'], [2, 'ch02-ears', 'ch02']],
    'the 2s are taught by the ears (more facts than the pile), the 1s by chapter 1');
  assert.equal(E.countName(sets[0].def), 'Tails · the 1s');
  assert.equal(E.countName(sets[1].def), 'Ears · the 2s');
  assert.equal(E.countName(null, 5), 'Claws · the 5s');
  const cat = E.blankCat({});
  assert.deepEqual(E.learnedCounts(cat, list), []);
  cat.lessons['ch01-tails'] = { finished: true };
  assert.deepEqual(E.learnedCounts(cat, list).map(c => c.table), [1]);
  cat.lessons['ch02-pile'] = { finished: true };   // any finished chapter lesson of a Count learns it
  assert.deepEqual(E.learnedCounts(cat, list).map(c => c.table), [1, 2]);
  const def = E.hollowDef(list, 2);
  assert.deepEqual([def.id, def.table, def.things, def.teacher], ['hollow-2s', 2, 'ears', 'tallyheart']);
  assert.equal(def.done, 'A full round! That deserves a treasure for your nest.');
  ['facts', 'warmHard', 'fillFrom', 'firstPrompt'].forEach(k => assert.ok(!(k in def), k));
  assert.equal(E.hollowDef([], 4).things, 'paws', 'a Count no chapter teaches yet still reads sensibly');
});

test('hollow: rounds per Count; every full round earns the next treasure; each Count glows on its own', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  const cat = E.blankCat({});
  function round(table, missFirst) {
    const { def, state } = E.hollowStart(cat, list, 1, table);
    cat.lesson = { mode: 'hollow', state };
    let first = true;
    while (!E.counts.done(state)) {
      const q = E.counts.question(state);
      E.logAnswer(cat, E.counts.answer(state, def, missFirst && first ? 0 : q.answer, 2000, 1).entry);
      first = false;
    }
    return E.recordLesson(cat, state).hollow;
  }
  const s2 = E.hollowStart(cat, list, 1, 2).state;
  assert.equal(s2.table, 2);
  assert.equal(s2.set, 'hollow-2s');
  assert.deepEqual(s2.queue.map(q => [q.a, q.b]), E.hollowFacts(1, 2), 'the first round of the 2s');
  assert.ok(s2.queue.every(q => q.a === 2 || q.b === 2));
  let r = round(1, false);
  assert.equal(r.awarded.id, E.TREASURES[0].id);
  assert.equal(r.table, 1);
  r = round(2, true);
  assert.equal(r.awarded.id, E.TREASURES[1].id, 'the next treasure, whichever Count');
  assert.equal(E.hollowStart(cat, list, 1, 2).state.round, 2, 'the 2s’ own second round');
  assert.equal(E.hollowStart(cat, list, 1, 1).state.round, 2);
  round(2, false); round(2, false);
  assert.deepEqual(cat.hollow.byTable['2'], { rounds: 3, cleanRounds: 2, glow: false });
  r = round(2, false);
  assert.equal(r.glowNow, true);
  assert.deepEqual(cat.hollow.byTable['2'], { rounds: 4, cleanRounds: 3, glow: true });
  assert.deepEqual(cat.hollow.byTable['1'], { rounds: 1, cleanRounds: 1, glow: false }, 'the 1s are their own');
  assert.equal(cat.hollow.rounds, 5);
  assert.deepEqual(cat.nest, E.TREASURES.slice(0, 5).map(t => t.id));
  assert.deepEqual(E.hollowTable(cat, 5), { rounds: 0, cleanRounds: 0, glow: false });
  // hard facts are per Count: a miss in the 2s comes early in the next round of the 2s only
  assert.deepEqual(E.hardFacts(cat, 2), []);
  E.logAnswer(cat, { set: 'hollow-2s', a: 7, b: 2, answer: 15, correct: false, ms: 5000, helped: true, retry: false, at: 9 });
  assert.deepEqual(E.hardFacts(cat, 2), [[7, 2]]);
  const nx = E.hollowStart(cat, list, 1, 2).state.queue;
  assert.ok(nx.slice(1, 4).some(q => q.a * q.b === 14 && q.hard));
  assert.ok(E.hollowStart(cat, list, 1, 1).state.queue.every(q => !q.hard));
});

test('grown-ups: the Counts, one table per Count', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  const cat = E.blankCat({});
  [{ set: 'ch01-tails', a: 3, b: 1 }, { set: 'hollow-1s', a: 1, b: 9 }, { set: 'ch02-ears', a: 3, b: 2 }, { set: 'hollow-2s', a: 2, b: 7 },
    { set: 'ch02-pile', a: 10, b: 2 }, { set: 'mix', a: 4, b: 1, table: 1 }, { set: 'unknown-set', a: 5, b: 3 }]
    .forEach(e => E.logAnswer(cat, Object.assign({ answer: e.a * e.b, correct: true, ms: 1000, helped: false, retry: false, at: 1 }, e)));
  const t = E.factTables(cat, list);
  assert.deepEqual(t.map(x => [x.table, x.name, x.rows.length]), [[1, 'Tails · the 1s', 3], [2, 'Ears · the 2s', 3], [3, 'The 3s', 1]]);
});

/* ------------------------------------------------ the book, every chapter */
test('book: the title once, then a page per finished chapter, then the latest chapter’s teaser', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  const cat = E.blankCat({});
  E.startChapter(cat, ch01, 1);
  playNew(cat, ch01, { look: { sex: 'tom' }, clanname: 'Fern', dream: '', choices: { f004: 0 } });
  let b = E.buildFullBook(cat, list);
  assert.equal(b.title, 'Fernpaw’s First Moon');
  assert.deepEqual(b.pages, [{ id: 'ch01', number: 1, heading: 'Chapter 1: Through the Glass',
    recap: ['Fernpaw stepped through the glass.', 'He noticed everything.'], dream: 'Fernpaw slept too soundly to dream.', dreamText: '' }]);
  assert.deepEqual(b.teaser, { title: 'Chapter 2: After the Storm', lines: ['Tomorrow, Fernpaw: ears.'], built: true, next: 'ch02' });
  E.startChapter(cat, ch02, 2);
  playNew(cat, ch02, { dream: 'i saw a dragon', choices: { a10: 0 } });
  b = E.buildFullBook(cat, list);
  assert.deepEqual(b.pages.map(p => p.heading), ['Chapter 1: Through the Glass', 'Chapter 2: After the Storm']);
  assert.deepEqual(b.pages[1].recap, ['Fernpaw counted the prey pile.', 'He peeked under the Old Bridge.']);
  assert.equal(b.pages[1].dream, 'Fernpaw’s dream: “I saw a dragon.”');
  assert.equal(b.pages[0].dream, 'Fernpaw slept too soundly to dream.', 'each chapter keeps its own dream line');
  assert.deepEqual(b.teaser, { title: 'Chapter 3: Under the Old Bridge', lines: ['Something sniffles in the dark.'], built: false, next: null });
  // a chapter she's partway through has no page yet
  const half = E.blankCat({});
  E.startChapter(half, ch01, 1);
  assert.deepEqual(E.buildFullBook(half, list).pages, []);
  assert.equal(E.buildFullBook(half, list).teaser, null);
});

/* ------------------------------------------------ the fixture chapters, whole */
test('the fixture chapters are sound and play through, both paths', () => {
  const { ch01, ch02 } = fixtures();
  assert.deepEqual(E.checkStory(ch01), []);
  assert.deepEqual(E.checkStory(ch02), []);
  for (const path of [0, 1]) {
    const cat = finishedCat({ ch01 });
    E.startChapter(cat, ch02, 10);
    const seq = playNew(cat, ch02, { choices: { a10: path }, miss: ['1x4', '2x6', '8x2'] });
    assert.equal(seq[seq.length - 1], 'a12');
    assert.ok(seq.includes(path ? 'r01' : 'b01'));
    assert.equal(cat.flags.ch2Path, path ? 'river' : 'bridge');
    assert.deepEqual(Object.keys(cat.lessons).sort(), ['ch01-tails', 'ch02-ears', 'ch02-pile', 'ch02-tails']);
    assert.equal(E.lessonClean(cat, 'ch02-tails'), false, 'the warm-up had a miss');
    assert.equal(E.firstTry(cat, '10x2'), true);
    assert.ok(cat.nest.includes('riffle-stone'));
    assert.deepEqual(E.learnedCounts(cat, [ch01, ch02]).map(c => c.table), [1, 2]);
  }
});

/* ------------------------------------------------ every real chapter, through the engine */
test('every chapter in app/story plays to an end through the engine (all right, then all wrong)', () => {
  const { load } = require('./_load.js');
  const all = load().story;
  const list = E.chapters(all);
  assert.ok(list.length >= 1);
  assert.deepEqual(list.map(s => s.number), list.map((s, i) => i + 1), 'chapters are numbered 1, 2, 3…');
  list.forEach(story => {
    assert.deepEqual(E.checkStory(story), [], story.id);
    for (const wrong of [false, true]) {
      const cat = E.blankCat({ now: 1 });
      list.filter(s => s.number < story.number).forEach(s => { cat.finished[s.id] = 1; });
      E.startChapter(cat, story, 1);
      // every frame's options, with the first visible one chosen
      const seq = V1.play(E, story, cat, V1.script({ miss: [], allWrong: wrong }));
      assert.ok(story.frames[seq[seq.length - 1]].end, story.id + ' reaches its end');
      assert.ok(E.isFinished(cat, story.id));
      Object.keys(story.counts || {}).forEach(id => {
        const reached = seq.some(f => story.frames[f].counts && story.frames[f].counts.set === id);
        if (reached) assert.ok(cat.lessons[id] && cat.lessons[id].finished, story.id + ' ' + id + ' finishes');
      });
    }
  });
});

/* ------------------------------------------------ balloons know the size of a face: the art measures it */
test('face sizes for balloons: the art’s r (cats, Riffle, otters, dogs), kept between 1.8 and 16; small fixed sizes for the sparrow, the moth and the Tall One', () => {
  require('../app/ui.js');
  const L = PC.ui.layout;
  assert.equal(L.parseCats, undefined, 'faces are measured by the art (tests/scenes.test.js), no longer estimated from the markup');
  const heads = [{ x: 10, y: 20, r: 2.5 }, { x: 30, y: 40, r: 7.69 }, { x: 50, y: 60, r: 40 }, { x: 1, y: 1, r: 0.5 },
    { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 9, r: NaN }, null];
  const cast = [{ who: 'tallyheart' }, { who: 'otter', variant: 2 }, { who: 'dog', variant: 1 }, { who: 'riffle' },
    { who: 'sparrow' }, { who: 'moth' }, { who: 'tallone' }, { who: 'constructor' }, { who: 'player' }, { who: 'player' }];
  const out = L.castHeads(heads, cast);
  assert.deepEqual(out.map(o => o.who), cast.map(c => c.who));
  assert.deepEqual(out.map(o => o.h && o.h.r), [2.5, 7.69, 16, 1.8, 2.5, 2.5, 2, 6.5, 6.5, null]);
  assert.deepEqual(out[1].h, { x: 30, y: 40, r: 7.69 });
  // heads keyed by who (an older art's shape) still work
  assert.deepEqual(L.castHeads({ tallyheart: { x: 1, y: 2, r: 3 }, 'clancat-2': { x: 4, y: 5 } }, []), [{ who: 'tallyheart', h: { x: 1, y: 2, r: 3 } }, { who: 'clancat', h: { x: 4, y: 5, r: 6.5 } }]);
});

/* One speaker talking twice chains the second balloon to the first (a neck, placed with it: chapter
 * 1's f008, f009, f013, f029a, f029b, f059, f064, f071 as they went live); two dogs in a row are two
 * speakers, each with a tail to its own head (chapter 2's f056). */
test('balloons: one cat speaking twice is one speaker (chained); two dogs in a row are two (PC.ui.layout.speakerRuns)', () => {
  require('../app/ui.js');
  const L = PC.ui.layout;
  const { load } = require('./_load.js');
  const all = load().story, cat = E.blankCat({});
  const runs = (ch, id) => {
    const f = all[ch].frames[id], cast = f.scene.cast;
    const heads = L.castHeads(cast.map((c, i) => ({ x: 10 + i, y: 10 })), cast);
    return L.speakerRuns(heads, E.balloons(f, cat)).map(r => [r.slot, r.same]);
  };
  // the same cat, twice: one speaker, the second balloon continues the first
  for (const id of ['f008', 'f009', 'f013', 'f029a', 'f029b', 'f059', 'f064', 'f071']) assert.deepEqual(runs('ch01', id), [[0, false], [0, true]], 'ch01 ' + id);
  for (const id of ['f009', 'f020', 'f025']) assert.deepEqual(runs('ch02', id).slice(0, 2), [[0, false], [0, true]], 'ch02 ' + id);
  // three dogs: each balloon its own dog, none continuing the one before
  const dogs = runs('ch02', 'f056');
  assert.ok(dogs.length >= 2);
  assert.deepEqual(dogs.map(r => r[1]), dogs.map(() => false), 'two dogs in a row are two speakers');
  assert.deepEqual(dogs.slice(0, 2).map(r => r[0]), [0, 1]);
  // the pure pieces
  const list = [{ who: 'dog' }, { who: 'dog' }, { who: 'tallyheart' }];
  assert.deepEqual([0, 1, 2, 5].map(n => L.speakerSlot(list, 'dog', n)), [0, 1, 0, 0], 'more balloons than dogs: the first dog');
  assert.equal(L.speakerSlot(list, 'tallyheart', 1), 0, 'a second balloon from the one Tallyheart is hers');
  assert.equal(L.speakerSlot(list, 'riffle', 3), 0, 'a voice from outside the panel');
  assert.deepEqual(L.speakerRuns(list, [{ who: 'riffle' }, { who: 'riffle' }, { who: '' }, { who: '' }]).map(r => r.same), [false, true, false, false],
    'a voice from outside, twice, is one speaker; narration never chains');
  // hidden balloons still count: the nth from E.balloons wins over counting what is shown
  assert.deepEqual(L.speakerRuns(list, [{ who: 'dog', nth: 1 }, { who: 'dog', nth: 1 }]).map(r => [r.slot, r.same]), [[1, false], [1, true]]);
});

/* ================================================================ one place per chapter
 * Each chapter keeps its own place (frame, back-history, lesson in progress): reading a finished
 * chapter again never moves her place in another (docs/build.md, "Chapter 2 (v0.3)", the save). */
const walkBack = (cat, story) => { const out = []; while (E.back(cat, story)) out.push(cat.frame); return out; };

test('places: reading chapter 1 again partway through chapter 2 keeps her chapter-2 page; the hub button picks it up there', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  const cat = finishedCat({ ch01 });
  E.startChapter(cat, ch02, 10);
  playNew(cat, ch02, { choices: { a08: 1 } }, 'a09');
  assert.equal(cat.frame, 'a09');
  const hist = clone(cat.history), status = E.status(cat, list);
  assert.ok(hist.length >= 8 && status === 'Chapter 2 · page ' + (hist.length + 1), status);
  // the hub: "Read chapter 1 again"
  E.startChapter(cat, ch01, 20);
  assert.deepEqual([cat.chapter, cat.frame, cat.history], ['ch01', 'f001', []], 'chapter 1 from its first page');
  assert.deepEqual(clone(E.place(cat, 'ch02')), { frame: 'a09', history: hist, lesson: null }, 'chapter 2 keeps its place');
  playNew(cat, ch01, {}, 'f005');
  assert.equal(E.status(cat, list), 'Chapter 1 · page 5');
  const p = E.progress(cat, list);
  assert.equal(p.next, ch02, 'the big button is still chapter 2');
  assert.equal(p.nextInProgress, true, '"Keep reading Chapter 2"');
  assert.equal(p.nextPage, hist.length + 1);
  assert.equal(p.page, 5, 'the page of the chapter she is reading');
  // the big button: the same frame, the same pages behind it
  E.openChapter(cat, ch02, 30);
  assert.deepEqual([cat.chapter, cat.frame, cat.history], ['ch02', 'a09', hist]);
  assert.equal(E.status(cat, list), status);
  assert.deepEqual(cat.places, {}, 'a finished chapter keeps no place: it is read again from its start');
  assert.equal(E.openChapter(cat, ch02, 31).frame, 'a09', 'opening the chapter she is reading changes nothing');
  // and on to the end, as if never interrupted
  const seq = playNew(cat, ch02, { choices: { a10: 1 } });
  assert.deepEqual(seq, ['a09', 'a10', 'r01', 'a11', 'a12']);
  assert.ok(E.isFinished(cat, 'ch02'));
  assert.equal(cat.nest.filter(x => x === 'riffle-stone').length, 1);
  // a chapter never started opens at its start; a finished one too
  const fresh = finishedCat({ ch01 });
  E.openChapter(fresh, ch02, 5);
  assert.deepEqual([fresh.chapter, fresh.frame, fresh.history], ['ch02', 'a01', []]);
  E.openChapter(fresh, ch01, 6);
  assert.deepEqual([fresh.chapter, fresh.frame], ['ch01', 'f001']);
  assert.deepEqual(Object.keys(fresh.places), ['ch02'], 'chapter 2, on its first page, keeps that page');
  assert.equal(E.progress(fresh, list).nextInProgress, false, 'on its first page: the button still says "Chapter 2: After the Storm"');
});

test('places: a lesson in progress in chapter 2 waits through chapter 1 read again (its own lesson too) and resumes at the same question', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  // a cat stopped three answers into the ears lesson (one of them missed)
  const c = finishedCat({ ch01 });
  E.startChapter(c, ch02, 10);
  playNew(c, ch02, { miss: ['2x5'], stopIn: { a04: 3 } });
  assert.equal(c.frame, 'a04');
  assert.equal(c.lesson.state.pos, 3);
  const lesson = clone(c.lesson), asked = c.counts.length;
  assert.equal(E.lessonAt(c, ch02, 'a04'), c.lesson);
  assert.equal(E.lessonAt(c, ch02, 'a02'), null, 'only at its own frame');
  assert.equal(E.lessonAt(c, ch01, 'a04'), null, 'only in its own chapter');
  E.startChapter(c, ch01, 20);
  assert.equal(c.lesson, null, 'nothing going in chapter 1');
  assert.deepEqual(clone(E.place(c, 'ch02').lesson), lesson, 'the lesson waits in chapter 2’s place');
  assert.equal(E.progress(c, list).nextInProgress, true);
  // chapter 1 again, to its end: its own lesson, which never touches chapter 2’s
  const seq = playNew(c, ch01, { miss: ['3x1'] });
  assert.equal(seq[seq.length - 1], 'f009');
  assert.equal(c.lesson, null);
  assert.deepEqual(clone(c.places.ch02.lesson), lesson);
  E.openChapter(c, ch02, 30);
  assert.equal(c.frame, 'a04');
  assert.deepEqual(clone(c.lesson), lesson);
  assert.equal(E.lessonAt(c, ch02, 'a04'), c.lesson, 'the counts frame resumes it');
  assert.equal(E.counts.question(c.lesson.state).number, 4, 'at the same question');
  playNew(c, ch02, { miss: [] });
  assert.ok(E.isFinished(c, 'ch02'));
  assert.equal(c.lessons['ch02-ears'].finished, true);
  assert.equal(c.lessons['ch02-ears'].noHelp, false, 'the miss before chapter 1 still counts');
  const ears = c.counts.filter(e => e.set === 'ch02-ears');
  assert.equal(ears.length, c.lessons['ch02-ears'].answers, 'one lesson, answer by answer: ' + ears.length);
  assert.ok(c.counts.length > asked);
});

test('places: Back stays inside the chapter she is reading, and each chapter’s pages come back with it', () => {
  const { ch01, ch02 } = fixtures();
  const cat = finishedCat({ ch01 });
  E.startChapter(cat, ch02, 10);
  playNew(cat, ch02, {}, 'a05');
  const ch2hist = clone(cat.history);
  E.startChapter(cat, ch01, 20);
  playNew(cat, ch01, {}, 'f004');
  assert.deepEqual(clone(cat.history), ['f001', 'f002', 'f003']);
  assert.deepEqual(walkBack(cat, ch01), ['f003', 'f002', 'f001']);
  assert.equal(E.canBack(cat), false, 'chapter 1’s first page: Back goes to camp, never into chapter 2');
  assert.deepEqual(clone(E.place(cat, 'ch02').history), ch2hist, 'chapter 2’s pages are untouched');
  playNew(cat, ch01, {}, 'f003');
  E.openChapter(cat, ch02, 30);
  assert.equal(cat.frame, 'a05');
  const walk = walkBack(cat, ch02);
  assert.deepEqual(walk, ch2hist.slice().reverse());
  assert.ok(walk.every(id => /^a\d+$/.test(id)), 'only chapter 2’s frames: ' + walk.join(' '));
  // the same frame ids in two chapters (the real chapters both start at f001) never mix either
  const a = { id: 'ch01', number: 1, start: 'f001', frames: { f001: { next: 'f002' }, f002: { next: 'f003' }, f003: { end: true } } };
  const b = { id: 'ch02', number: 2, start: 'f001', frames: { f001: { next: 'f002' }, f002: { next: 'f003' }, f003: { next: 'f004' }, f004: { end: true } } };
  const k = E.blankCat({});
  E.startChapter(k, a, 1); E.next(k, a, 2); E.next(k, a, 3);
  E.startChapter(k, b, 4); E.next(k, b, 5); E.next(k, b, 6);
  E.startChapter(k, a, 7); E.next(k, a, 8);
  assert.deepEqual([k.frame, k.history], ['f002', ['f001']]);
  E.openChapter(k, b, 9);
  assert.deepEqual([k.chapter, k.frame, k.history], ['ch02', 'f003', ['f001', 'f002']]);
});

/* The other way round (the review of 2026-10-04): a round in progress used to vanish when a chapter
 * lesson took the slot (Camp, the Training Hollow, a few answers, Camp, "Keep reading"), with no
 * record and no treasure. It waits in `hollowWaiting` now, and the Hollow takes it back. */
test('places: a Training Hollow round never gives way for good: a chapter lesson taking the slot leaves it waiting, and the Hollow takes it back (the real chapters)', () => {
  const { load } = require('./_load.js');
  const all = load().story, ch01 = all.ch01, ch02 = all.ch02, list = [ch01, ch02];
  const cat = E.blankCat({ now: 1, id: 'hw' });
  E.startChapter(cat, ch01, 1);
  V1.play(E, ch01, cat, V1.script({ miss: [] }));
  assert.ok(E.isFinished(cat, 'ch01'));
  E.startChapter(cat, ch02, 10);
  V1.play(E, ch02, cat, V1.script({ miss: [], stopIn: { f023: 1 } }));
  assert.equal(cat.frame, 'f023');
  const lesson = clone(cat.lesson);
  assert.equal(lesson.state.pos, 1, 'the first Count of the 2s, one answer in');
  // Camp, the Training Hollow: the chapter lesson waits in chapter 2's place, the round takes the slot
  const h = E.hollowStart(cat, list, 50, 1);
  assert.equal(E.holdLesson(cat), true);
  cat.lesson = { mode: 'hollow', state: h.state };
  V1.runLesson(E, cat, h.def, h.state, V1.script({ miss: [] }), 6);
  const round = clone(cat.lesson);
  assert.equal(round.state.pos, 6);
  // Camp, "Keep reading": the Counts frame takes its lesson back, and the round waits
  E.openChapter(cat, ch02, 60);
  assert.deepEqual(clone(E.lessonAt(cat, ch02, 'f023')), lesson, 'the chapter lesson, at the same question');
  assert.deepEqual(clone(cat.hollowWaiting), round, 'the round waits, at question 7');
  assert.equal(cat.hollow.rounds, 0);
  // a reload keeps both
  const ls = memStorage(), save = E.newSave();
  save.cats.push(cat); save.current = cat.id;
  E.createStore(ls).save(save);
  const her = E.getCat(E.createStore(ls).load(), 'hw');
  assert.deepEqual(clone(her.hollowWaiting), round);
  assert.deepEqual(clone(her.lesson), lesson);
  // the Training Hollow again: the round comes back at question 7; the chapter lesson waits again
  const r = E.hollowRound(her);
  assert.deepEqual(clone(r), round);
  assert.equal(her.lesson, r);
  assert.equal(her.hollowWaiting, null);
  assert.deepEqual(clone(her.places.ch02), { frame: null, history: [], lesson });
  assert.equal(E.hollowRound(her), r, 'asked again: the same round, in the slot');
  // the round finishes: it counts and pays its treasure; the chapter lesson is still there at its frame
  const nest = her.nest.length;
  V1.runLesson(E, her, h.def, r.state, V1.script({ miss: [] }));
  assert.deepEqual([her.hollow.rounds, her.nest.length, her.lesson], [1, nest + 1, null]);
  assert.equal(E.hollowRound(her), null, 'nothing in progress');
  assert.deepEqual(clone(E.lessonAt(her, ch02, 'f023')), lesson);
  // "Count them again" / "Let's count!" (E.beginLesson) over a round in progress leaves it waiting too
  const h2 = E.hollowStart(her, list, 70, 2);
  E.holdLesson(her);
  her.lesson = { mode: 'hollow', state: h2.state };
  V1.runLesson(E, her, h2.def, h2.state, V1.script({ miss: [] }), 2);
  const round2 = clone(her.lesson);
  E.go(her, ch02, 'f023', 71);
  const fresh = E.chapterLesson(her, ch02, 'ch02-ears', 72, list);
  E.beginLesson(her, ch02, 'f023', fresh.state);
  assert.deepEqual(clone(her.hollowWaiting), round2);
  // a round all answered but never recorded is counted, never kept waiting
  const h3 = E.hollowStart(her, list, 80, 1);
  her.hollowWaiting = null;
  her.lesson = { mode: 'hollow', state: h3.state };
  while (!E.counts.done(h3.state)) { const q = E.counts.question(h3.state); E.counts.answer(h3.state, h3.def, q.answer, 2000, 81); }
  const rounds = her.hollow.rounds;
  E.beginLesson(her, ch02, 'f023', E.chapterLesson(her, ch02, 'ch02-ears', 82, list).state);
  assert.deepEqual([her.hollow.rounds, her.hollowWaiting], [rounds + 1, null], 'counted, once');
  // junk in hollowWaiting never reaches the Hollow (as for the slot)
  for (const junk of [{ mode: 'chapter', state: round.state }, { mode: 'hollow', state: { queue: 'x' } }, 7, 'round']) {
    const m = E.migrate({ version: 2, cats: [Object.assign(clone(her), { hollowWaiting: junk })] });
    assert.equal(m.cats[0].hollowWaiting, null, JSON.stringify(junk));
  }
});

test('places: a Training Hollow round never costs a chapter lesson its place; the lesson comes back at its frame', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  const cat = finishedCat({ ch01 });
  E.startChapter(cat, ch02, 10);
  playNew(cat, ch02, { stopIn: { a04: 2 } });
  const lesson = clone(cat.lesson);
  // Back to the chapter's first page, the hub, the Training Hollow (the UI holds the lesson first)
  walkBack(cat, ch02);
  assert.equal(cat.frame, 'a01');
  assert.equal(E.holdLesson(cat), true);
  assert.equal(cat.lesson, null);
  const h = E.hollowStart(cat, list, 50, 1);
  cat.lesson = { mode: 'hollow', state: h.state };
  V1.runLesson(E, cat, h.def, h.state, V1.script({}), 4);
  assert.deepEqual(clone(E.place(cat, 'ch02').lesson), lesson, 'waiting in chapter 2’s place');
  assert.equal(E.place(cat, 'ch02').frame, 'a01');
  assert.equal(E.lessonAt(cat, ch02, 'a02'), null);
  E.go(cat, ch02, 'a04', 60);
  const back = E.lessonAt(cat, ch02, 'a04');
  assert.deepEqual(clone(back), lesson, 'back at its frame, at the same question');
  assert.equal(cat.lesson, back);
  assert.deepEqual(cat.places, {});
  // the same through another chapter: a round going when she opens chapter 2 again keeps the slot,
  // and chapter 2's lesson waits for its frame
  const c = finishedCat({ ch01 });
  E.startChapter(c, ch02, 10);
  playNew(c, ch02, { stopIn: { a04: 2 } });
  const l2 = clone(c.lesson);
  E.startChapter(c, ch01, 20);
  const h2 = E.hollowStart(c, list, 21, 1);
  assert.equal(E.holdLesson(c), false, 'nothing to hold');
  c.lesson = { mode: 'hollow', state: h2.state };
  V1.runLesson(E, c, h2.def, h2.state, V1.script({}), 3);
  const round = c.lesson;
  E.openChapter(c, ch02, 30);
  assert.equal(c.lesson, round, 'the Hollow round keeps the slot');
  assert.deepEqual(clone(c.places.ch02), { frame: null, history: [], lesson: l2 });
  assert.deepEqual(clone(E.place(c, 'ch02')), { frame: 'a04', history: c.history, lesson: l2 });
  assert.deepEqual(clone(E.lessonAt(c, ch02, 'a04')), l2);
  // a Hollow round is never dropped by reading a chapter from its start
  const d = finishedCat({ ch01 });
  const h3 = E.hollowStart(d, list, 1, 1);
  d.lesson = { mode: 'hollow', state: h3.state };
  E.startChapter(d, ch01, 2);
  assert.equal(d.lesson.mode, 'hollow');
});

test('places: saves from before them migrate with none and nothing else changed; a place goes through the store unchanged; junk is dropped', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  for (const save of Object.values(V1SAVES)) {
    const m = E.migrate(clone(save));
    m.cats.forEach(c => assert.deepEqual(c.places, {}));
    // the version-2 shape before places (chapter 2's first build) migrates to the same thing
    const before = clone(m);
    before.cats.forEach(c => delete c.places);
    assert.deepEqual(E.migrate(before), m);
  }
  // a version-2 cat from before places, partway through chapter 2: its place is the one it reads
  const old = clone(finishedCat({ ch01 }));
  delete old.places;
  E.startChapter(old, ch02, 10);
  playNew(old, ch02, { stopIn: { a04: 1 } });
  delete old.places;
  const m = E.migrate({ version: 2, cats: [clone(old)], current: old.id }).cats[0];
  assert.deepEqual(clone(E.place(m, 'ch02')), { frame: 'a04', history: old.history, lesson: old.lesson });
  // partway through chapter 2, reading chapter 1 again: store, reload, carry on
  E.startChapter(m, ch01, 20);
  playNew(m, ch01, {}, 'f003');
  const save = E.newSave(); save.cats.push(m); save.current = m.id;
  const ls = memStorage(), store = E.createStore(ls);
  assert.equal(store.save(save), true);
  const back = E.createStore(ls).load();
  assert.deepEqual(back, clone(save));
  assert.deepEqual(E.migrate(clone(back)), back, 'idempotent');
  const c = back.cats[0];
  E.openChapter(c, ch02, 30);
  assert.deepEqual([c.frame, clone(c.history), clone(c.lesson)], ['a04', old.history, old.lesson]);
  assert.equal(E.counts.question(c.lesson.state).number, 2);
  // anything else in places is dropped, never thrown
  const junk = E.migrate({ cats: [{ id: 'j', finished: {}, places: { a: 'nope', b: { history: ['x'] }, c: { frame: 'f002', history: 'x' }, d: { lesson: { mode: 'chapter', frame: 'f004', state: {} } }, e: null } }] }).cats[0];
  // (d's lesson has an empty state: no queue to take up, so it goes, and its place with it)
  assert.deepEqual(junk.places, { c: { frame: 'f002', history: [], lesson: null } });
  assert.deepEqual(E.migrate({ cats: [{ id: 'k', places: 'x' }] }).cats[0].places, {});
});

test('places: a lesson whose last answer is in but was never recorded is recorded on the way out, not parked', () => {
  const { ch01, ch02 } = fixtures();
  const cat = finishedCat({ ch01 });
  E.startChapter(cat, ch02, 10);
  playNew(cat, ch02, {}, 'a04');
  const r = E.chapterLesson(cat, ch02, 'ch02-ears', 11, [ch01, ch02]);
  cat.lesson = { mode: 'chapter', frame: 'a04', chapter: 'ch02', state: r.state };
  while (!E.counts.done(r.state)) { const q = E.counts.question(r.state); E.logAnswer(cat, E.counts.answer(r.state, r.def, q.answer, 2000, 12).entry); }
  E.startChapter(cat, ch01, 20);
  assert.equal(cat.lessons['ch02-ears'].finished, true);
  assert.equal(E.place(cat, 'ch02').lesson, null);
  assert.equal(cat.lesson, null);
});

/* ------------------------------------------------ one lesson slot, several Counts frames close together
 * Chapter 2 has Counts frames a page or two apart (the warm-up a02, the ears a04, the pile a06).
 * The buttons on a Counts frame, as app/ui.js wires them: "Let’s count!" and "Count them again"
 * start a lesson there (E.chapterLesson, then E.beginLesson); Next on a finished Count is
 * E.finishCounts with its summary. */
function countHere(cat, story, list, answers, t) {
  const id = E.frameId(cat, story), f = story.frames[id];
  const r = E.chapterLesson(cat, story, f.counts.set, t, list);
  E.beginLesson(cat, story, id, r.state);
  answerIn(cat, story, r.def, r.state, answers, t);
  return r;
}
function answerIn(cat, story, def, st, n, t) {
  for (let i = 0; i < n && !E.counts.done(st); i++) {
    const q = E.counts.question(st);
    const res = E.counts.answer(st, def, q.answer, 2000, t + i);
    E.logAnswer(cat, res.entry);
    if (res.done) E.recordLesson(cat, st);
    else cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: st };
  }
}
const nextOnCount = (cat, story, t) => E.finishCounts(cat, story, cat.lessons[story.frames[E.frameId(cat, story)].counts.set], t);
// a cat at question 5 of the ears lesson (a04), the warm-up (a02) and the skip-count (a03) behind her
function midEars() {
  const { ch01, ch02 } = fixtures();
  const cat = finishedCat({ ch01 });
  E.startChapter(cat, ch02, 10);
  playNew(cat, ch02, { miss: [], stopIn: { a04: 4 } });
  assert.equal(cat.frame, 'a04');
  assert.equal(E.counts.question(cat.lesson.state).number, 5);
  return { ch01, ch02, list: [ch01, ch02], cat, lesson: clone(cat.lesson) };
}

test('lessons: Next on an earlier Count she finished never costs a later lesson in progress its place (Back two pages, Next, Next: the same question)', () => {
  const { ch02, cat, lesson } = midEars();
  E.back(cat, ch02); E.back(cat, ch02);
  assert.equal(cat.frame, 'a02');
  assert.ok(cat.lessons['ch02-tails'], 'the warm-up is finished: its frame offers Count them again and Next');
  assert.equal(E.lessonAt(cat, ch02, 'a02'), null);
  assert.ok(nextOnCount(cat, ch02, 20));
  assert.equal(cat.frame, 'a03');
  assert.deepEqual(clone(cat.lesson), lesson, 'Next on the warm-up leaves the ears lesson in the slot');
  // through the store, as a reload on the skip-count would
  const ls = memStorage();
  E.createStore(ls).save({ version: 2, cats: [cat], current: cat.id, settings: {} });
  const c = E.createStore(ls).load().cats[0];
  E.next(c, ch02, 21);
  const back = E.lessonAt(c, ch02, 'a04');
  assert.deepEqual(clone(back), lesson, 'the ears frame resumes it');
  assert.equal(E.counts.question(back.state).number, 5, 'at the same question, not “Let’s count!” from the first');
  // and on to the end: one lesson, answer by answer
  playNew(c, ch02, { miss: [] });
  assert.ok(E.isFinished(c, 'ch02'));
  assert.equal(c.counts.filter(e => e.set === 'ch02-ears').length, c.lessons['ch02-ears'].answers);

  // Next on a finished Count leaves a Training Hollow round in the slot, too (it waits in the Hollow)
  const h = midEars();
  E.back(h.cat, h.ch02); E.back(h.cat, h.ch02);
  assert.equal(E.holdLesson(h.cat), true);
  const r = E.hollowStart(h.cat, h.list, 30, 1);
  h.cat.lesson = { mode: 'hollow', state: r.state };
  V1.runLesson(E, h.cat, r.def, r.state, V1.script({}), 3);
  const round = h.cat.lesson;
  assert.ok(nextOnCount(h.cat, h.ch02, 40));
  assert.equal(h.cat.lesson, round);
  assert.deepEqual(clone(h.cat.places.ch02.lesson), h.lesson, 'and the ears lesson still waits for its frame');
});

test('lessons: “Count them again” on an earlier Count: the lesson in progress further on waits for its frame and comes back at the same question', () => {
  const { ch02, list, cat, lesson } = midEars();
  E.back(cat, ch02); E.back(cat, ch02);
  const r = countHere(cat, ch02, list, 1, 30);   // one answer into the warm-up's two
  assert.equal(cat.lesson.frame, 'a02', 'the warm-up again has the slot');
  assert.deepEqual(clone(cat.places.ch02), { frame: null, history: [], lesson }, 'the ears lesson waits in chapter 2’s place');
  assert.equal(E.lessonAt(cat, ch02, 'a02'), cat.lesson, 'the warm-up again resumes at its own frame');
  answerIn(cat, ch02, r.def, r.state, 99, 40);
  assert.equal(cat.lesson, null, 'recorded at its last answer');
  assert.ok(nextOnCount(cat, ch02, 60));
  E.next(cat, ch02, 61);
  assert.equal(cat.frame, 'a04');
  const back = E.lessonAt(cat, ch02, 'a04');
  assert.deepEqual(clone(back), lesson);
  assert.equal(E.counts.question(back.state).number, 5, 'at the same question');
  assert.deepEqual(cat.places, {});

  // counting the warm-up again, she leaves for the Training Hollow: the ears lesson keeps its place
  // and the warm-up again is let go (a first go is never pushed out by a Count counted again)
  const h = midEars();
  E.back(h.cat, h.ch02); E.back(h.cat, h.ch02);
  countHere(h.cat, h.ch02, h.list, 1, 30);
  assert.equal(E.holdLesson(h.cat), true);
  assert.equal(h.cat.lesson, null);
  assert.deepEqual(clone(h.cat.places.ch02), { frame: null, history: [], lesson: h.lesson });

  // the same when she reads chapter 1 again instead: chapter 2's place keeps the ears lesson
  const p = midEars();
  E.back(p.cat, p.ch02); E.back(p.cat, p.ch02);
  countHere(p.cat, p.ch02, p.list, 1, 30);
  E.startChapter(p.cat, p.ch01, 50);
  assert.equal(E.place(p.cat, 'ch02').frame, 'a02');
  assert.deepEqual(clone(E.place(p.cat, 'ch02').lesson), p.lesson);
  E.openChapter(p.cat, p.ch02, 60);
  assert.equal(p.cat.frame, 'a02');
  assert.equal(E.lessonAt(p.cat, p.ch02, 'a02'), null, 'the warm-up again was let go: Count them again and Next');
  assert.ok(nextOnCount(p.cat, p.ch02, 61));
  E.next(p.cat, p.ch02, 62);
  assert.deepEqual(clone(E.lessonAt(p.cat, p.ch02, 'a04')), p.lesson);
});

test('lessons: random walks through the buttons, reloads and Camp included, never lose a first go at a Count, and its frame always resumes it; nor a Hollow round', () => {
  const { ch01, ch02 } = fixtures(), list = [ch01, ch02];
  let T = 1000, waited = 0, lost = [], roundsLost = [], roundsWaited = 0;
  const now = () => (T += 1000);
  const done1 = finishedCat({ ch01 });   // most walks start on chapter 2, where the Counts are close together
  for (let seed = 1; seed <= 40; seed++) {
    const rng = E.util.rng(seed), pick = (a) => a[Math.floor(rng() * a.length)];
    const ls = memStorage(), store = E.createStore(ls);
    let save = E.newSave(), cat;
    if (seed % 4) { cat = clone(done1); save.cats.push(cat); } else cat = E.addCat(save, { now: now() });
    save.current = cat.id;
    let story = null, run = null, view = 'frame';
    // app/ui.js's renderFrame, up to what a Counts frame shows: a lesson in progress there resumes
    const render = () => {
      if (cat.lesson && cat.lesson.mode !== 'hollow' && cat.lesson.state && E.counts.done(cat.lesson.state)) E.settleLesson(cat);
      story = E.chapter(cat.chapter, list) || E.firstChapter(list);
      const id = E.frameId(cat, story), f = story.frames[id];
      cat.frame = id; run = null; view = 'frame';
      if (E.kindOf(f) === 'counts' && E.lessonAt(cat, story, id)) {
        run = { def: Object.assign({ id: f.counts.set }, E.countsSet(f.counts.set, story, list)), st: cat.lesson.state, mode: 'chapter' };
      }
    };
    const open = () => {   // her card on "Who's playing?"
      let s = E.chapter(cat.chapter, list);
      if (!s || cat.frame == null) { s = E.upNext(cat, list) || E.firstChapter(list); E.openChapter(cat, s, now()); }
      story = s;
      if (E.isFinished(cat, s.id) && E.kindOf(E.currentFrame(cat, s)) === 'end') { view = 'hub'; run = null; } else render();
    };
    const answer = (n, wrong) => {
      for (let i = 0; i < n && !E.counts.done(run.st); i++) {
        const q = E.counts.question(run.st);
        const res = E.counts.answer(run.st, run.def, wrong ? q.answer + 1 : q.answer, 2000, now());
        E.logAnswer(cat, res.entry);
        if (res.done) E.recordLesson(cat, run.st);
        else if (run.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: run.st };
        else cat.lesson = { mode: run.mode, state: run.st };
      }
      if (!E.counts.done(run.st)) return;
      if (run.mode === 'chapter') { if (E.finishCounts(cat, story, E.counts.summary(run.st), now())) render(); }
      else { run = null; view = 'hub'; }
    };
    const count = () => {   // "Let’s count!" or "Count them again"
      const id = E.frameId(cat, story), f = story.frames[id];
      const r = E.chapterLesson(cat, story, f.counts.set, now(), list);
      E.beginLesson(cat, story, id, r.state);
      run = { def: r.def, st: r.state, mode: 'chapter' };
    };
    const next = () => {
      const f = story.frames[E.frameId(cat, story)], k = E.kindOf(f);
      if (k === 'counts') {
        if (!cat.lessons[f.counts.set]) return count();
        if (E.finishCounts(cat, story, cat.lessons[f.counts.set], now())) render();
        return;
      }
      if (k === 'end') { view = 'hub'; return; }
      if (k === 'next' || k === 'skip') E.next(cat, story, now());
      else if (k === 'look') E.confirmLook(cat, story, null, now());
      else if (k === 'choice') E.choose(cat, story, pick(E.options(f, cat)).index, now());
      else if (k === 'input') E.submitInput(cat, story, 'Fern', now());
      render();
    };
    const hollow = (n) => {   // app/ui.js's renderHollow: the round in progress (back from waiting), else a new one
      const L = E.hollowRound(cat);   // the UI holds a chapter lesson before a round takes the slot
      if (L && L.state && !E.counts.done(L.state)) run = { def: E.hollowDef(list, L.state.table || 1), st: L.state, mode: 'hollow' };
      else {
        if (L) E.settleLesson(cat);
        const r = E.hollowStart(cat, list, now(), pick(E.learnedCounts(cat, list)).table);
        E.holdLesson(cat);
        cat.lesson = { mode: 'hollow', state: r.state };
        run = { def: r.def, st: r.state, mode: 'hollow' };
      }
      answer(n);
      run = null; view = 'hub';
    };
    // every first go at a Count in progress (not a Count counted again), wherever it waits
    const firstGoes = () => {
      const out = new Map();
      const add = (L, ch) => {
        if (!L || L.mode === 'hollow' || !L.state || E.counts.done(L.state) || cat.lessons[L.state.set]) return;
        out.set((L.chapter || ch) + ':' + L.state.set + ':' + L.state.startedAt, L);
      };
      add(cat.lesson, cat.chapter);
      Object.keys(cat.places || {}).forEach(id => add(cat.places[id] && cat.places[id].lesson, id));
      return out;
    };
    // a Training Hollow round in progress, in the slot or waiting while a chapter lesson has it
    const roundOf = () => [cat.lesson, cat.hollowWaiting].map(L => (L && L.mode === 'hollow' && L.state && !E.counts.done(L.state) ? L.state.startedAt : null)).find(x => x != null);
    open();
    for (let step = 0; step < 300; step++) {
      const acts = ['reload'];
      if (view === 'frame') {
        acts.push('back', 'back');
        if (E.hasFinished(cat)) acts.push('camp');   // the bar's Camp button, mid-chapter or mid-lesson
        if (run) acts.push('answer1', 'answer1', 'answerAll', 'answerWrong');
        else {
          acts.push('next', 'next', 'next', 'next');
          const f = story.frames[E.frameId(cat, story)];
          if (f.counts && cat.lessons[f.counts.set]) acts.push('again', 'again');
        }
      } else {
        const p = E.progress(cat, list);
        if (p.next) acts.push('big', 'big');
        p.finished.forEach(s => acts.push('read:' + s.id));
        if (E.learnedCounts(cat, list).length) acts.push('hollow0', 'hollow3', 'hollowAll');
      }
      const a = pick(acts), before = firstGoes(), round = roundOf(), rounds = cat.hollow.rounds;
      if (a === 'next') next();
      else if (a === 'back') { run = null; if (E.back(cat, story)) render(); else view = 'hub'; }
      else if (a === 'camp') { run = null; view = 'hub'; }
      else if (a === 'again') count();
      else if (a === 'answer1') answer(1);
      else if (a === 'answerAll') answer(999);
      else if (a === 'answerWrong') answer(1, true);
      else if (a === 'big') { E.openChapter(cat, E.progress(cat, list).next, now()); render(); }
      else if (a.startsWith('read:')) { E.startChapter(cat, E.chapter(a.slice(5), list), now()); render(); }
      else if (a === 'hollow0') hollow(0);
      else if (a === 'hollow3') hollow(3);
      else if (a === 'hollowAll') hollow(999);
      else if (a === 'reload') {
        save.current = cat.id;
        store.save(save);
        save = E.createStore(ls).load();
        cat = E.getCat(save, save.current);
        open();
      }
      const after = firstGoes();
      before.forEach((L, k) => {
        if (!after.has(k) && !cat.lessons[k.split(':')[1]]) lost.push('seed ' + seed + ' step ' + step + ': ' + a + ' lost ' + k + ' (now at ' + cat.chapter + ':' + cat.frame + ')');
      });
      // a Hollow round in progress is never dropped: it goes on, or it is counted
      if (round != null && roundOf() !== round && cat.hollow.rounds === rounds) roundsLost.push('seed ' + seed + ' step ' + step + ': ' + a + ' dropped a Hollow round (now at ' + cat.chapter + ':' + cat.frame + ')');
      if (round != null && roundOf() === round && cat.hollowWaiting) roundsWaited++;
      // on a Counts frame, a first go that belongs there always resumes: never “Let’s count!” from question 1
      if (view === 'frame') {
        const id = E.frameId(cat, story);
        if (story.frames[id].counts) after.forEach((L, k) => {
          if (!k.startsWith(story.id + ':') || L.frame !== id) return;
          waited++;
          if (!(run && run.st.startedAt === L.state.startedAt)) lost.push('seed ' + seed + ' step ' + step + ': ' + a + ' showed ' + id + ' without its lesson ' + k);
        });
      }
    }
  }
  assert.deepEqual(lost.slice(0, 5), [], lost.length + ' lessons lost');
  assert.ok(waited > 100, 'the walks went back to lessons in progress: ' + waited);
  assert.deepEqual(roundsLost.slice(0, 5), [], roundsLost.length + ' Hollow rounds dropped');
  assert.ok(roundsWaited > 20, 'the walks left Hollow rounds waiting while a chapter lesson had the slot: ' + roundsWaited);
});

/* ------------------------------------------------ the teasers: the end of her book, and the hub's "coming soon" */
test('teasers: every chapter in app/story has one (a title and at least one line), and her book ends on it', () => {
  const { load } = require('./_load.js');
  const all = E.chapters(load().story);
  // a placeholder chapter (every frame's board "STUB.") is still being written: it has no teaser yet
  const list = all.filter(s => !Object.values(s.frames || {}).every(f => /^STUB\b/.test(f.board || '')));
  assert.ok(list.some(s => s.id === 'ch01'));
  list.forEach(story => {
    const t = story.teaser;
    assert.ok(t && typeof t.title === 'string' && t.title.trim(), story.id + ' has a teaser with a title');
    const lines = Array.isArray(t.lines) ? t.lines : [t.lines];
    assert.ok(lines.length >= 1 && lines.every(l => typeof l === 'string' && l.trim()), story.id + '’s teaser has at least one line');
    const cat = E.blankCat({ now: 1 });
    cat.name = 'Fern';
    all.forEach(s => { if (s.number <= story.number) cat.finished[s.id] = 1; });
    const b = E.buildFullBook(cat, all);
    assert.equal(b.pages[b.pages.length - 1].id, story.id);
    assert.equal(b.teaser.title, E.fill(t.title, cat));
    assert.deepEqual(b.teaser.lines, lines.map(l => E.fill(l, cat)));
  });
});

test('teasers: chapter 1’s says what chapter 2 brings, without giving away the pile; “Next” while chapter 2 is built, “coming soon” in the book and the hub while it isn’t', () => {
  const ch01 = realCh01(), { ch02 } = fixtures();
  const cat = E.blankCat({ now: 1 });
  cat.finished.ch01 = 1;
  const t = E.buildFullBook(cat, [ch01, ch02]).teaser;
  assert.deepEqual(t, { title: 'Chapter 2: After the Storm', lines: [
    'Tomorrow, Tallyheart has a new Count for you: **ears**. Somebody should count the prey pile, too.',
    'And what made that enormous splash down by the river?'
  ], built: true, next: 'ch02' });
  assert.ok(!t.lines.some(l => /smaller/i.test(l)), 'nothing about the pile looking smaller: that is what her count is meant to catch');
  const alone = E.buildFullBook(cat, [ch01]).teaser;
  assert.deepEqual(alone, Object.assign({}, t, { built: false, next: null }));
  assert.deepEqual(E.progress(cat, [ch01]).soon, alone);
  assert.equal(E.progress(cat, [ch01, ch02]).soon, null, 'chapter 2 built: the hub offers it instead');
});

/* ------------------------------------------------ the final review */
test('“Close.” is one hop of the count off (1 on the 1s, as chapter 1 had it; 2 on the 2s), or exactly one group off (the check’s row of eight)', () => {
  const near = (def, fact, given) => {
    const st = E.counts.start(def, { facts: [fact] });
    const res = E.counts.answer(st, def, given, 9000, 1);
    assert.equal(res.correct, false);
    return res.near;
  };
  const ones = { table: 1 }, twos = { table: 2 };
  // the 1s: one off is close, two off is not (chapter 1 unchanged)
  assert.equal(near(ones, [3, 1], 2), true);
  assert.equal(near(ones, [3, 1], 4), true);
  assert.equal(near(ones, [3, 1], 5), false);
  assert.equal(near(ones, [1, 10], 0), false, '0 for 1 × 10 is not close');
  // the 2s: one pair off is close, more is not
  assert.equal(near(twos, [4, 2], 6), true);
  assert.equal(near(twos, [2, 4], 10), true);
  assert.equal(near(twos, [4, 2], 7), true);
  assert.equal(near(twos, [4, 2], 5), false, 'three off is more than a pair');
  assert.equal(near(twos, [4, 2], 11), false);
  assert.equal(near(twos, [9, 2], 14), false);
  // a fact pictured another way (the check: two rows of eight, the sand counting by twos): a hop of
  // two off is close, and so is exactly one row off (one row counted, or three); anything else
  // within a row is not
  const check = { a: 2, b: 8, groups: 2, per: 8 };
  assert.deepEqual([14, 15, 17, 18, 8, 24].filter(n => !near(twos, check, n)), [], 'a hop off, or a whole row off');
  assert.deepEqual([7, 9, 10, 12, 13, 19, 20, 23, 25].filter(n => near(twos, check, n)), [], 'not close: 9, 10, 12, 20…');
  // the real check and the pile, through the chapter's own sets
  const { load } = require('./_load.js');
  const sets = load().story.ch02.counts;
  assert.deepEqual([8, 9, 10, 12, 14, 18, 20, 24].map(n => near(sets['ch02-check'], sets['ch02-check'].facts[0], n)), [true, false, false, false, true, true, false, true]);
  assert.deepEqual([17, 18, 22, 23].map(n => near(sets['ch02-pile'], sets['ch02-pile'].facts[0], n)), [false, true, true, false]);
  // nothing typed that is a number: not close
  assert.equal(near(twos, [4, 2], ''), false);
});

test('keys: a held-down Enter never turns more than one page, and a key on a screen just drawn waits like a tap (PC.ui.keys)', () => {
  require('../app/ui.js');
  const K = PC.ui.keys;
  assert.ok(K && typeof K.fresh === 'function');
  const drawn = 10000;
  // auto-repeat of Enter or Space is never a press
  assert.equal(K.fresh({ key: 'Enter', repeat: true }, drawn, drawn + 5000), false);
  assert.equal(K.fresh({ key: ' ', repeat: true }, drawn, drawn + 5000), false);
  assert.equal(K.fresh({ key: 'Enter', repeat: false }, drawn, drawn + 5000), true);
  // a page key in the first moments of a new screen is the end of the last press, as a double tap is
  for (const key of ['Enter', ' ', 'ArrowRight', 'ArrowLeft']) {
    assert.equal(K.fresh({ key }, drawn, drawn + 100), false, key + ' too soon');
    assert.equal(K.fresh({ key }, drawn, drawn + K.GUARD_MS + 1), true, key + ' after the guard');
  }
  // typing is never held back: digits for the keypad, letters, Backspace
  for (const key of ['7', 'a', 'Backspace']) assert.equal(K.fresh({ key, repeat: true }, drawn, drawn + 1), true, key);
});

test('Riffle’s stone stays one of a kind: no Hollow treasure is a striped stone, and the speckled pebble keeps its id for old saves', () => {
  const pebble = E.treasure('pebble');
  assert.ok(pebble, 'the id stays, so a nest that has it keeps it');
  assert.match(pebble.name, /speckled/i);
  E.TREASURES.forEach(t => assert.doesNotMatch(t.name, /strip|band/i, t.id + ': only Riffle’s stone has a stripe'));
  assert.match(E.gift('riffle-stone').name, /white stripe all the way around/);
  // a save from before the rename shows the new name for the same treasure
  const cat = E.blankCat({});
  cat.nest = ['pebble', 'riffle-stone'];
  const items = E.nestItems(cat);
  assert.deepEqual(items.map(x => x.treasure.id), ['pebble', 'riffle-stone']);
  assert.match(items[0].treasure.name, /speckled/);
});

test('migrate drops a malformed lesson (in places or the slot), so nothing later throws on it; a good one is kept as it was', () => {
  const ch02 = require('../app/story/ch02.js').story.ch02;
  const ch01 = require('../app/story/ch01.js').story.ch01;
  const good = E.chapterLesson(E.blankCat({}), ch02, 'ch02-ears', 1, [ch01, ch02]).state;
  const goodL = { mode: 'chapter', frame: 'f023', chapter: 'ch02', state: good };
  const junk = [
    'nonsense', 42, [], { state: 'x' }, { state: {} }, { state: { queue: 'no', pos: 0, log: [], requeues: {} } },
    { state: { queue: [{ a: 3, b: 2 }], pos: 'one', log: [], requeues: {} } },
    { state: { queue: [{ a: 3, b: 2 }], pos: 5, log: [], requeues: {} } },
    { state: { queue: [{ a: 3, b: 2 }], pos: -1, log: [], requeues: {} } },
    { state: { queue: [{ a: 3, b: 2 }], pos: 0.5, log: [], requeues: {} } },
    { state: { queue: [{ a: 'x', b: 2 }], pos: 0, log: [], requeues: {} } },
    { state: { queue: [null], pos: 0, log: [], requeues: {} } },
    { state: { queue: [{ a: 3, b: 2 }], pos: 0, requeues: {} } },
    { state: { queue: [{ a: 3, b: 2 }], pos: 0, log: [], requeues: [] } },
    { state: { queue: [{ a: 3, b: 2 }], pos: 0, log: [7], requeues: {} } },
    { mode: 'lunch', state: good }, { frame: {}, state: good }, { chapter: 7, state: good },
    { state: Object.assign({}, good, { lines: 'x' }) }, { state: Object.assign({}, good, { pool: {} }) }
  ];
  junk.forEach((L, i) => {
    const raw = { version: 2, cats: [{ id: 'c1', name: 'Moon', chapter: 'ch01', frame: 'f010', history: [], lesson: L,
      finished: { ch01: 5 }, dreams: {}, flags: {}, choices: {}, lessons: {}, counts: [], nest: [], hollow: { rounds: 0, byTable: {} },
      places: { ch02: { frame: 'f023', history: ['f001'], lesson: L } } }] };
    const cat = E.migrate(raw).cats[0];
    assert.equal(cat.lesson, null, 'junk ' + i + ' in the slot is dropped: ' + JSON.stringify(L));
    assert.deepEqual(cat.places.ch02, { frame: 'f023', history: ['f001'], lesson: null }, 'junk ' + i + ' in places is dropped, the place kept');
    // and what used to throw doesn't
    E.openChapter(cat, ch02, 2);
    assert.equal(E.lessonAt(cat, ch02, 'f023'), null);
    assert.equal(E.place(cat, 'ch02').frame, 'f023');
  });
  // a place that held only a junk lesson (no frame) is let go
  const onlyJunk = E.migrate({ version: 2, cats: [{ id: 'c2', places: { ch02: { frame: null, lesson: junk[5] } } }] }).cats[0];
  assert.deepEqual(onlyJunk.places, {});
  // a real lesson survives, unchanged, in both spots, and migrate stays idempotent
  const keep = { version: 2, cats: [{ id: 'c3', chapter: 'ch02', frame: 'f023', history: [], lesson: goodL, finished: { ch01: 5 },
    places: { ch01: { frame: 'f040', history: [], lesson: { mode: 'chapter', frame: 'f062', chapter: 'ch01', state: good } } } }] };
  const once = E.migrate(JSON.parse(JSON.stringify(keep)));
  assert.deepEqual(once.cats[0].lesson, goodL);
  assert.deepEqual(once.cats[0].places.ch01.lesson.state, good);
  assert.deepEqual(E.migrate(JSON.parse(JSON.stringify(once))), once);
  const her = once.cats[0];
  assert.ok(E.lessonAt(her, ch02, 'f023'), 'the good lesson is taken up at its frame');
  // E.okLesson is what decides
  assert.equal(E.okLesson(goodL), true);
  junk.forEach(L => assert.equal(E.okLesson(L), false));
});

/* ================================================ chapter 3 (docs/build.md, "Chapter 3 (v0.4)") */
const { walk: goldenWalk, SCRIPTS: GOLDEN_SCRIPTS } = require('./fixtures/golden.js');
const GOLDEN = require('./fixtures/ch02-golden.json');
const realStories = () => { const { load } = require('./_load.js'); return load().story; };
/* chapter 3 is still the stub until app/story/ch03.js is written */
const ch03Built = (s) => !!(s && s.ch03 && !Object.values(s.ch03.frames).every(f => /^STUB\b/.test(f.board || '')));

test('chapter 2 plays exactly as it did before chapter 3’s engine: every frame, question, line, help and answer, the Hollow and the book (tests/fixtures/ch02-golden.json)', () => {
  const S = realStories(), list = [S.ch01, S.ch02];
  const ui = {
    promptLines: (def, D, q) => E.promptLines(def, D, q),
    helpIntro: (def, D, q, res) => E.helpPlan(def, D, q, res).intro,
    ground: (def, D, q) => E.helpGround(def, D, q)
  };
  assert.equal(GOLDEN.runs.length, GOLDEN_SCRIPTS.length);
  assert.equal(GOLDEN.engine, '0.2.0 (chapter 2, 2026-10-04)', 'recorded with the engine chapter 2 shipped with');
  const SAND_LINE = 'Ha! You didn’t even look at the sand that time.';
  const earsAfterMiss = (S.ch02.counts['ch02-ears'].fastAfterMiss || [])[0];
  // the changes chapter 3's text names for chapter 2, applied to the recording:
  const named = (run) => {
    const want = clone(run);
    Object.keys(want.lessons).forEach(k => want.lessons[k].forEach(row => {
      // 1. a borrowed ears question at the pile or the check is scratched in the earth beside the pile, not on sand
      if (row.help && row.q.from && /ch02-(pile|check)$/.test(k)) { assert.equal(row.help.ground, 'sand', k); row.help.ground = 'earth'; }
      // 2. the ears' "after a miss" line says scratches, not sand, once chapter 2's story file says so
      if (row.as === 'ch02-ears' && row.res.line === SAND_LINE) row.res.line = earsAfterMiss;
    }));
    want.hollow.forEach(h => h.rows.forEach(row => { if (row.res.line === SAND_LINE && h.table === 2) row.res.line = earsAfterMiss; }));
    return want;
  };
  const same = (got, want, name, parts) => parts.forEach(k => {
    if (k === 'lessons') {
      assert.deepEqual(Object.keys(got.lessons), Object.keys(want.lessons), name + ': the same lessons');
      Object.keys(want.lessons).forEach(l => assert.deepEqual(got.lessons[l], want.lessons[l], name + ': ' + l + ', question by question'));
    } else assert.deepEqual(got[k], want[k], name + ': ' + k);
  });
  // 3. E.hardFacts no longer counts the speed of a right first ask read under a prompt (the pair's
  // ask before it decides). With chapter 2's rule put back, everything is the recording, exactly:
  const readFirst = E.readFirst;
  try {
    E.readFirst = () => false;
    GOLDEN.runs.forEach((g, i) => same(clone(goldenWalk(E, list, GOLDEN_SCRIPTS[i], ui)), named(g.run), g.name + ' (chapter 2’s hard-fact rule)', ['frames', 'lessons', 'hollow', 'book', 'cat', 'status']));
  } finally { E.readFirst = readFirst; }
  // ... and with chapter 3's rule, these scripts (each quick on every fact read under a long prompt)
  // play the chapter unchanged; only the Hollow's hard picks move, and only where a pair she missed or
  // was slow on came back right under a long prompt (the old tom's 10 × 2). A reader slow but right
  // on chapter 1's opener 3 × 1 is the other named change: see the next test
  const moved = [];
  GOLDEN.runs.forEach((g, i) => {
    const got = clone(goldenWalk(E, list, GOLDEN_SCRIPTS[i], ui)), want = named(g.run);
    same(got, want, g.name, ['frames', 'lessons', 'book', 'status']);
    if (JSON.stringify(got.hollow) !== JSON.stringify(want.hollow)) {
      moved.push(g.name);
      const hardOf = h => h.queue.filter(x => x[2]).map(x => Math.min(x[0], x[1]) + 'x' + Math.max(x[0], x[1]));
      const added = hardOf(got.hollow.find(h => h.table === 2)).filter(k => !hardOf(want.hollow.find(h => h.table === 2)).includes(k));
      assert.deepEqual(added, ['2x10'], g.name + ': 2 × 10 joins the hard ones (the pile’s quick 10 × 2 was read under his balloon)');
    } else assert.deepEqual(got.cat, want.cat, g.name + ': the same cat at the end');
  });
  assert.deepEqual(moved, ['misses at 5 × 2 (it regroups), 3 × 2 first, 2 × 10 last', 'slow, but quick where she reads a long prompt']);
});

test('chapter 2, changed by name: its warm-up’s hard pick follows the reading-time rule (a slow but right 3 × 1, chapter 1’s opener, is no longer its hard fact; a missed one still is)', () => {
  const S = realStories(), list = [S.ch01, S.ch02];
  const ui = { promptLines: (def, D, q) => E.promptLines(def, D, q), helpIntro: (def, D, q, res) => E.helpPlan(def, D, q, res).intro, ground: (def, D, q) => E.helpGround(def, D, q) };
  const tails = (script) => goldenWalk(E, list, script, ui).lessons['ch02:ch02-tails'].map(r => r.q.a + 'x' + r.q.b + (r.q.hard ? ' hard' : ''));
  const slow = { name: 'slow but right on chapter 1’s opener', ch01: { ms: 2000, msFor: { '3x1': 6500 } }, ch02: { ms: 2000 } };
  const missed = { name: 'chapter 1’s opener missed', ch01: { ms: 2000, miss: ['3x1'] }, ch02: { ms: 2000 } };
  const readFirst = E.readFirst;
  let before;
  try { E.readFirst = () => false; before = [tails(slow), tails(missed)]; } finally { E.readFirst = readFirst; }
  assert.deepEqual(before[0], ['1x4', '3x1 hard'], '0.2.0: the slow opener was the warm-up’s hard fact');
  assert.deepEqual(tails(slow), ['1x4', '7x1'], '0.3.0: read under “How many tails on those three?”, its speed says nothing');
  assert.deepEqual(tails(missed), before[1], 'a missed opener is hard, as before');
  assert.ok(tails(missed).includes('3x1 hard'));
});

test('frame-level when: a frame that doesn’t match is passed over, forward and back, as if its next led straight on', () => {
  const { ch01, ch02, ch03 } = fixtures(), list = [ch01, ch02, ch03];
  assert.deepEqual(E.checkStory(ch03), []);
  for (const path of ['bridge', 'river']) {
    const cat = E.blankCat({ now: 1 });
    cat.finished = { ch01: 1, ch02: 2 }; cat.flags.ch2Path = path; cat.name = 'Fern';
    E.startChapter(cat, ch03, 3);
    E.go(cat, ch03, 'd13', 4);
    assert.equal(E.shows(ch03.frames.d14, cat), path === 'river');
    E.lessonAt(cat, ch03, 'd13');
    const r = E.chapterLesson(cat, ch03, 'ch03-six', 5, list);
    while (!E.counts.done(r.state)) { const q = E.counts.question(r.state); E.logAnswer(cat, E.counts.answer(r.state, r.def, q.answer, 2000, 6).entry); }
    E.finishCounts(cat, ch03, E.counts.summary(r.state), 7);
    assert.equal(cat.frame, path === 'river' ? 'd14' : 'd15', path + ': forward');
    if (path === 'river') E.next(cat, ch03, 8);
    assert.equal(cat.frame, 'd15');
    assert.ok(E.back(cat, ch03));
    assert.equal(cat.frame, path === 'river' ? 'd14' : 'd13', path + ': back');
    // a page in her history that no longer shows (a flag changed) is passed over going back too
    if (path === 'river') { E.next(cat, ch03, 9); cat.flags.ch2Path = 'bridge'; E.back(cat, ch03); assert.equal(cat.frame, 'd13'); }
  }
  // a parked place on a page that no longer shows (she left from the river path's page, read
  // chapter 2 again and took the bridge) reopens where a page turn from it lands
  const parked = E.blankCat({ now: 1 });
  parked.finished = { ch01: 1, ch02: 2 }; parked.flags.ch2Path = 'river'; parked.name = 'Fern';
  E.startChapter(parked, ch03, 3);
  E.go(parked, ch03, 'd14', 4);
  E.startChapter(parked, ch02, 5);
  assert.equal(E.place(parked, 'ch03').frame, 'd14', 'parked on the river path’s page');
  parked.flags.ch2Path = 'bridge';
  assert.equal(E.openChapter(parked, ch03, 6).frame, 'd15', 'reopened past the page that no longer shows');
  parked.flags.ch2Path = 'river';
  E.go(parked, ch03, 'd14', 7); E.startChapter(parked, ch02, 8);
  assert.equal(E.openChapter(parked, ch03, 9).frame, 'd14', 'a page that still shows is where she left it');
  // E.landing follows the chain; the storyboard and the UI ask it where a page turn lands
  const c = E.blankCat({}); c.flags.ch2Path = 'bridge';
  assert.equal(E.landing(c, ch03, 'd14'), 'd15');
  c.flags.ch2Path = 'river';
  assert.equal(E.landing(c, ch03, 'd14'), 'd14');
  // the story check: a frame with when has exactly one way on, and the start always shows
  const bad = clone(ch03);
  bad.frames.d15.when = { ch2Path: 'river' };
  bad.frames.d01.when = { specialty: 'noticing' };
  bad.frames.d06.say[0].digits = 7;
  const errs = E.checkStory(bad).join('\n');
  assert.match(errs, /d15: a frame with when needs exactly one way on/);
  assert.match(errs, /d01: the start frame always shows/);
  assert.match(errs, /d06: say 0: digits is a short line/);
});

test('the tortie: {Murmur}paw and {Murmur}chime, “{murmur}ing” and “{murmur}ed”; Mutter- for a player whose own Clan name is Murmur', () => {
  const cat = E.blankCat({}); cat.name = 'Fern';
  assert.equal(E.fill('{Murmur}paw, {Murmur}chime. You’ve been {murmur}ing ALL night. You {murmur}ed your Counts. {MURMUR}PAW!', cat),
    'Murmurpaw, Murmurchime. You’ve been murmuring ALL night. You murmured your Counts. MURMURPAW!');
  cat.name = 'Murmur';
  assert.equal(E.fill('{Murmur}paw, {Murmur}chime. You’ve been {murmur}ing ALL night. You {murmur}ed your Counts.', cat),
    'Mutterpaw, Mutterchime. You’ve been muttering ALL night. You muttered your Counts.');
  assert.equal(E.fill('{name}paw', cat), 'Murmurpaw', 'she keeps her own name');
  assert.equal(E.tortieWord(null), 'murmur');
  // balloons keep their digits (the Warrior Counts' small Andika numbers), and the frame's names map
  const { ch03 } = fixtures();
  const bs = E.balloons(ch03.frames.d06, cat);
  assert.deepEqual(bs.map(b => [b.who, b.digits]), [['glintstar', '7 × 8'], ['mutterer', '56']]);
  assert.equal(ch03.names.mutterer, '{Murmur}paw');
});

/* Chapter 3's sets beside chapter 1 and 2 (the real ones: the warm-up borrows the real ears). */
function story3() {
  const S = realStories(), fx = fixtures();
  return { ch01: S.ch01, ch02: S.ch02, ch03: fx.ch03, list: [S.ch01, S.ch02, fx.ch03] };
}
/* One chapter-3 lesson through the engine as the page asks it: [{ k, prompt, line, kind, balloons, help }]. */
function play3(cat, st3, setId, answers, ms) {
  const { ch03, list } = st3;
  const { def, state: st } = E.chapterLesson(cat, ch03, setId, 1, list);
  const seen = {}, out = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), k = q.a + 'x' + q.b;
    const i = seen[k] = (seen[k] || 0) + 1;
    const a = answers && answers[k] && answers[k][i - 1] != null ? answers[k][i - 1] : q.answer;
    const t = ms && ms[k] != null ? ms[k] : (ms && ms.all) || 2000;
    const D = E.questionDef(def, q, ch03, list);
    const prompt = E.promptLines(def, D, q);
    const r = E.counts.answer(st, D, a, t, 1);
    E.logAnswer(cat, r.entry);
    const row = { k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, line: r.line, kind: r.lineKind, balloons: r.balloons, res: r };
    if (!r.correct) row.help = E.helpPlan(def, D, q, r);
    out.push(row);
  }
  if (E.counts.done(st)) cat.lessons[setId] = E.counts.summary(st);
  return out;
}
const ks = rows => rows.map(r => r.k);
/* A cat that read chapters 1 and 2 (the real ones) all right and quick, with `ears` misses and times in ch02-ears. */
function after2(st3, ears, earsMs) {
  const cat = E.blankCat({ now: 1 });
  cat.finished = { ch01: 1, ch02: 2 };
  playSet(cat, st3.ch01, 'ch01-tails');
  cat.lessons['ch01-tails'] = { finished: true, noHelp: true };
  const { def, state } = E.chapterLesson(cat, st3.ch02, 'ch02-ears', 1, st3.list);
  const seen = {};
  while (!E.counts.done(state)) {
    const q = E.counts.question(state), k = q.a + 'x' + q.b, i = seen[k] = (seen[k] || 0) + 1;
    const a = ears && ears[k] && ears[k][i - 1] != null ? ears[k][i - 1] : q.answer;
    E.logAnswer(cat, E.counts.answer(state, E.questionDef(def, q, st3.ch02, st3.list), a, earsMs && earsMs[k] != null ? earsMs[k] : 2000, 1).entry);
  }
  cat.lessons['ch02-ears'] = E.counts.summary(state);
  return cat;
}

test('the warm-up adapts: her hardest 2s fact takes the second question, the opener is never a hard fact nor its pair, and the pile’s pairs stay away', () => {
  const s3 = story3(), def = Object.assign({ id: 'ch03-ears' }, s3.ch03.counts['ch03-ears']);
  const plain = facts => facts.map(f => (Array.isArray(f) ? f.join('x') : f.a + 'x' + f.b + (f.hard ? '!' : '')));
  const lf = cat => plain(E.lessonFacts(cat, def, s3.list));
  // nothing hard: 4 × 2, then 6 × 2
  assert.deepEqual(lf(after2(s3)), ['4x2', '6x2']);
  // misses on 3 × 2 and 4 × 2: 2 × 2 opens (2 × 3 is 3 × 2's pair), and the 2 × 3 pair is asked once
  const two = after2(s3, { '3x2': [7], '4x2': [9] });
  assert.deepEqual(E.hardFacts(two, 2, s3.list).slice(0, 2).map(f => f.join('x')).sort(), ['3x2', '4x2']);
  const w2 = lf(two);
  assert.equal(w2[0], '2x2');
  assert.ok(['3x2!', '4x2!'].includes(w2[1]));
  // a top hard fact that is 4 × 2 never opens, even when it isn't the one asked
  const top = after2(s3, { '7x2': [15], '2x10': [19] }, { '4x2': 9000 });
  assert.deepEqual(E.hardFacts(top, 2, s3.list).map(f => f.join('x')), ['2x10', '7x2', '4x2']);
  assert.deepEqual(lf(top), ['2x3', '2x10!'], '7 × 2 is the pile’s: passed over; 4 × 2 is hard: 2 × 3 opens');
  // the hard-fact pick passes over 9 × 2 and 7 × 2 (either way round); only them: as written
  assert.deepEqual(lf(after2(s3, { '9x2': [17], '7x2': [15] })), ['4x2', '6x2']);
  assert.deepEqual(lf(after2(s3, { '9x2': [17], '2x8': [15] })), ['4x2', '2x8!']);
  // a slow, right 2 × 6 (read under "hop on from ten") never becomes the hard fact; a missed one does
  assert.deepEqual(lf(after2(s3, null, { '2x6': 9000 })), ['4x2', '6x2']);
  assert.deepEqual(lf(after2(s3, { '2x6': [11] })), ['4x2', '2x6!']);
  // ... nor a slow, right 3 × 2, asked under the frame's balloons and its firstPrompt; a slow 2 × 8 is hard
  assert.deepEqual(lf(after2(s3, null, { '3x2': 9000, '2x8': 8000 })), ['4x2', '2x8!']);
  // a quick right answer to the hard one is remembered; a slow one is getting easier
  const quick = play3(after2(s3, { '2x8': [15] }), s3, 'ch03-ears', null, { all: 2000 });
  assert.deepEqual([ks(quick), quick[1].kind, quick[1].line], [['4x2', '2x8'], 'remembered', 'Last time, 2 × 8 made you stop and think. Not today!']);
  const slow = play3(after2(s3, { '2x8': [15] }), s3, 'ch03-ears', null, { all: 7000 });
  assert.deepEqual([slow[1].kind, slow[1].line], ['rememberedSlow', '2 × 8 again, and you got it. It’s getting easier.']);
  // chapter 2's warm-up (a single alt pair) keeps chapter 2's rule: with 1 × 4 among her hard
  // facts, but not the hardest, it still opens on 1 × 4
  const ch2def = Object.assign({ id: 'ch02-tails' }, s3.ch02.counts['ch02-tails']);
  const c2 = E.blankCat({});
  playSet(c2, s3.ch01, 'ch01-tails', { '1x5': [4], '6x1': [5] });
  E.logAnswer(c2, { set: 'hollow-1s', a: 1, b: 4, answer: 4, correct: true, ms: 9000, helped: false, retry: false, at: 9 });
  assert.equal(E.hardFacts(c2, 1, s3.list).length, 3);
  assert.deepEqual(plain(E.lessonFacts(c2, ch2def, s3.list)), ['1x4', E.hardFacts(c2, 1, s3.list)[0].join('x') + '!']);
});

test('the warm-up and the pile borrow yesterday’s ears: never 9 × 2 or 7 × 2 while there is another, scratched in the earth, each after “One from yesterday.”', () => {
  const s3 = story3();
  // a missed second question: two borrowed ears questions, then it comes back
  const cat = after2(s3);
  const fresh = E.fillPool(cat, 'ch02-ears', s3.list).map(p => p.a + 'x' + p.b);
  assert.deepEqual(fresh.slice(0, 3), ['2x10', '9x2', '2x8'], 'her most recent right ears answers lead the pool');
  const run = play3(cat, s3, 'ch03-ears', { '6x2': [13] });
  assert.deepEqual(ks(run), ['4x2', '6x2✗', 'F:2x10', 'F:2x8', 'R:6x2']);
  assert.ok(!run.some(r => /^F:(9x2|2x9|7x2|2x7)/.test(r.k)), 'never the pile’s pairs');
  assert.deepEqual(run[2].prompt, [{ who: 'tallyheart', text: 'One from yesterday. Ten cats. How many ears?' }]);
  // a miss is scratched in the earth by the doorway, never on the Hollow’s sand: her own, and a borrowed one
  assert.equal(run[1].help.ground, 'earth');
  assert.deepEqual([run[1].help.nums, run[1].help.counter, run[1].help.style], [[2, 4, 6, 8, 10, 12], 'tallyheart', null]);
  const borrowedMiss = play3(after2(s3), s3, 'ch03-ears', { '6x2': [13], '2x10': [19] });
  assert.deepEqual(ks(borrowedMiss).slice(0, 3), ['4x2', '6x2✗', 'F:2x10✗']);
  assert.equal(borrowedMiss[2].help.ground, 'earth');
  // only 9 × 2 and 7 × 2 left (every other ears pair asked): the gap still fills, from them
  const st = E.counts.start({ table: 2 }, { set: 'x', pool: [{ a: 9, b: 2 }, { a: 7, b: 2 }], asked: ['2x9', '2x7'] });
  st.queue = [{ a: 4, b: 2, retry: false }];
  E.counts.answer(st, {}, 9, 1, 1);
  assert.deepEqual(st.queue.slice(1).map(q => q.a + 'x' + q.b + (q.filler ? 'f' : '')), ['9x2f', '7x2f', '4x2']);
  // the pile skips the warm-up's pairs too (its sibling), and the old tom's 9 × 2 is right: Hmph. Right.
  const c2 = after2(s3);
  play3(c2, s3, 'ch03-ears', { '6x2': [13] });
  assert.deepEqual(E.siblingAsked(c2, s3.ch03, 'ch03-pile').sort(), ['2x10', '2x4', '2x6', '2x8']);
  const pile = play3(c2, s3, 'ch03-pile', { '7x2': [15] });
  assert.deepEqual(ks(pile), ['9x2', '7x2✗', 'F:2x2', 'F:5x2', 'R:7x2'], 'her latest right ears answers the warm-up didn’t ask, never 9 × 2 again');
  assert.deepEqual(pile[0].balloons, [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'Right.' }]);
  assert.deepEqual(pile[1].prompt.map(l => l.kind), ['caption']);
  assert.equal(pile[1].help.ground, 'earth', 'her own question at the pile: the earth');
  assert.equal(pile[2].help, undefined);
  assert.equal(E.helpGround(Object.assign({ id: 'ch03-pile' }, s3.ch03.counts['ch03-pile']), null, pile[2].q), 'earth', 'a borrowed one at the pile: the earth too');
  assert.deepEqual(pile[2].prompt, [{ who: 'tallyheart', text: 'One from yesterday. Two cats. How many ears?' }]);
  // a right retry of the old tom's 9 × 2 keeps his lines
  const tom = play3(after2(s3), s3, 'ch03-pile', { '9x2': [17] });
  assert.deepEqual(tom[tom.length - 1].balloons, [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'Right.' }]);
  // the pile's 7 × 2 is a check: a right one, however slow, never makes it hard
  const ck = after2(s3);
  play3(ck, s3, 'ch03-pile', null, { '7x2': 9000, '9x2': 9000 });
  assert.deepEqual(E.hardFacts(ck, 2, s3.list), []);
});

test('a filler with no fresh pair left takes the next in the pool’s order, as chapter 2 shipped; only a pair the set avoids waits for last (state.avoid)', () => {
  const def = { table: 2 };
  // 2 × 3 right, then 2 × 4 missed at the end: two fillers, then 2 × 4 again
  const run = (opts) => {
    const st = E.counts.start(def, Object.assign({ set: 'x' }, opts));
    st.queue = [{ a: 2, b: 3, retry: false }, { a: 2, b: 4, retry: false }];
    E.counts.answer(st, def, 6, 1, 1); E.counts.answer(st, def, 9, 1, 2);
    return st.queue.slice(2).map(q => q.a + 'x' + q.b + (q.filler ? 'f' : '') + (q.retry ? '*' : ''));
  };
  const pool = [{ a: 9, b: 2 }, { a: 2, b: 3 }, { a: 7, b: 2 }];
  // nothing fresh: a sibling's pair and this lesson's own come in the pool's order (chapter 2's check)
  assert.deepEqual(run({ pool, asked: ['2x9', '2x7'] }), ['9x2f', '2x3f', '2x4*']);
  // an avoided pair is passed over for any other, fresh or not
  assert.deepEqual(run({ pool, asked: ['2x7'], avoid: ['2x9'] }), ['2x3f', '7x2f', '2x4*']);
  // ... and taken only when nothing else is left: the retry still gets its gap
  assert.deepEqual(run({ pool: [{ a: 9, b: 2 }], avoid: ['2x9'] }), ['2x3f', '9x2f', '2x4*']);
  // chapter 3's warm-up carries its avoid list on its own, apart from what its siblings asked
  const s3 = story3(), r = E.chapterLesson(after2(s3), s3.ch03, 'ch03-ears', 1, s3.list);
  assert.deepEqual(r.state.avoid, ['2x9', '2x7']);
  assert.ok(!(r.state.asked || []).includes('2x9'));
  assert.equal(E.okLesson({ mode: 'chapter', state: r.state }), true);
  assert.equal(E.okLesson({ mode: 'chapter', state: Object.assign({}, r.state, { avoid: '2x9' }) }), false);
  // chapter 2's sets have no avoid list
  const S = realStories();
  ['ch02-pile', 'ch02-check'].forEach(id => assert.equal(E.chapterLesson(after2(s3), S.ch02, id, 1, [S.ch01, S.ch02]).state.avoid, undefined, id));
});

test('after a missed warm-up question, a quick right borrowed ears question says “scratches”, never “sand” (chapter 2’s ears line, true at the doorway, the pile and the Hollow)', () => {
  const s3 = story3(), fx = fixtures();
  // the lending set as the text has it (chapter 2’s ears with the new line)
  const lender = clone(s3.ch02);
  lender.counts['ch02-ears'].fastAfterMiss = ['Ha! You didn’t even look at the scratches that time.'];
  const st3 = { ch01: s3.ch01, ch02: lender, ch03: fx.ch03, list: [s3.ch01, lender, fx.ch03] };
  const cat = after2(st3);
  const run = play3(cat, st3, 'ch03-ears', { '6x2': [13] }, { all: 1500 });
  assert.deepEqual(ks(run), ['4x2', '6x2✗', 'F:2x10', 'F:2x8', 'R:6x2']);
  assert.deepEqual([run[2].kind, run[2].line], ['fast', 'Ha! You didn’t even look at the scratches that time.']);
  assert.ok(run.every(r => !/sand/.test(r.line)), 'no sand at the den doorway');
  // the real chapter 2, once chapter 3 is written: its ears say scratches
  const S = realStories();
  if (ch03Built(S)) {
    assert.deepEqual(S.ch02.counts['ch02-ears'].fastAfterMiss, ['Ha! You didn’t even look at the scratches that time.']);
    assert.deepEqual(S.ch03.counts['ch03-ears'].fastAfterMiss, S.ch02.counts['ch02-ears'].fastAfterMiss, 'the warm-up has chapter 2’s, for its own questions too');
  }
});

test('claws, the 5s: the ten facts in order, 5 × 2’s same ten, 5 × 6 hopping on from twenty-five (kept on its retry), and the five-or-zero help', () => {
  const s3 = story3(), set = s3.ch03.counts['ch03-claws'];
  const run = play3(after2(s3), s3, 'ch03-claws');
  assert.deepEqual(ks(run), ['4x5', '5x2', '1x5', '5x5', '5x6', '5x8', '5x3', '9x5', '7x5', '10x5']);
  assert.deepEqual(run.map(r => r.q.answer), [20, 10, 5, 25, 30, 40, 15, 45, 35, 50]);
  assert.ok(run.every(r => r.q.table === 5 && r.q.per === 5 && r.q.step === 5), 'forepaws of five claws, counted by fives');
  assert.deepEqual(run[0].prompt, [{ who: 'tallyheart', text: 'How many claws on the first four paws?' }]);
  assert.deepEqual(run[0].q.who.map(c => c.who), ['clancat', 'mutterer', 'clancat', 'clancat']);
  assert.deepEqual(run[1].balloons, set.facts[1].right);
  assert.deepEqual([run[4].q.lit, run[4].prompt[0].text], [25, 'Six paws. The first five have twenty-five claws. Now hop on from twenty-five!']);
  assert.deepEqual(run[4].balloons, set.facts[4].right);
  assert.deepEqual(run[2].prompt, [{ who: 'tallyheart', text: 'One paw. How many claws?' }]);
  // missed 5 × 6 and 5 × 2: each comes back two questions later, its prompt and its right lines kept
  const miss = play3(after2(s3), s3, 'ch03-claws', { '5x6': [29], '5x2': [12] });
  assert.deepEqual(ks(miss), ['4x5', '5x2✗', '1x5', '5x5', 'R:5x2', '5x6✗', '5x8', '5x3', 'R:5x6', '9x5', '7x5', '10x5']);
  const r52 = miss[4], r56 = miss[8];
  assert.deepEqual([r52.kind, r52.balloons], ['right', set.facts[1].right]);
  assert.deepEqual(r56.prompt, [{ who: 'tallyheart', text: 'Here’s that one again. Six paws. The first five have twenty-five claws. Now hop on from twenty-five!' }]);
  assert.equal(r56.q.lit, 25);
  assert.deepEqual(r56.balloons, set.facts[4].right);
  // the help: swipes on the sand, five lines a paw, hopped by fives; "Close." is one hop (5) off
  const h = miss[1].help;
  assert.deepEqual([h.ground, h.style, h.nums, h.counter, h.teacher], ['sand', 'swipe', [5, 10], 'tallyheart', 'tallyheart']);
  assert.equal(h.intro, set.helpIntroNotFive, '12 for 10 ends in neither a five nor a zero: the reminder');
  const helpFor = given => play3(after2(s3), s3, 'ch03-claws', { '7x5': [given] }).find(r => r.k === '7x5✗').help;
  assert.equal(helpFor(34).intro, set.helpIntroNotFive, '34 for 7 × 5: the five-or-zero line first');
  assert.equal(helpFor(30).intro, set.helpIntro, '30 for 7 × 5: one hop off, “Close.”');
  assert.equal(helpFor(40).intro, set.helpIntro);
  assert.equal(helpFor(20).intro, set.helpIntroFar);
  assert.equal(helpFor(31).intro, set.helpIntroNotFive, 'one off, but no five or zero: the reminder wins');
  assert.deepEqual(helpFor(34).nums, [5, 10, 15, 20, 25, 30, 35]);
  // a 1 × 5 picture is one paw
  assert.deepEqual([run[2].q.groups, run[2].q.per], [1, 5]);
  // no praise, fast or again line names a total: they are dealt out in turn
  const TOTALS = /\b(five|ten|fifteen|twenty|twenty-five|thirty|thirty-five|forty|forty-five|fifty)\b|\d/i;
  const lines = [].concat(set.praise || [], set.fast || [], set.again || [], set.fastAfterMiss || []);
  assert.deepEqual(lines.filter(l => TOTALS.test(l.replace(/Five claws on every forepaw/, ''))), [], 'only the per-paw constant');
  const S = realStories();
  if (ch03Built(S)) {
    const real = S.ch03.counts['ch03-claws'];
    const rl = [].concat(real.praise || [], real.fast || [], real.again || [], real.fastAfterMiss || []);
    assert.deepEqual(rl.filter(l => TOTALS.test(l.replace(/Five claws on every forepaw/, ''))), [], 'the real claws lesson too');
  }
});

test('Sprinkle’s dinner: a miss is hopped in the mud by the player, comes back in Sprinkle’s words, borrows the easiest claws in her voice, and a right retry says hopping works', () => {
  const s3 = story3(), dinner = s3.ch03.counts['ch03-dinner'];
  const cat = after2(s3);
  play3(cat, s3, 'ch03-claws');
  const run = play3(cat, s3, 'ch03-dinner', { '2x5': [12] }, { all: 1500 });
  assert.deepEqual(ks(run), ['2x5✗', 'F:1x5', 'F:5x3', 'R:2x5']);
  // the help: Sprinkle swipes the mud, the player keeps the count (5 · 10), never Sprinkle
  const h = run[0].help;
  assert.deepEqual([h.intro, h.counter, h.teacher, h.ground, h.style, h.nums], ['Let’s scratch it in the mud. You hop!', 'player', 'sprinkle', 'mud', 'swipe', [5, 10]]);
  assert.equal(run[0].line, 'There! We’ll count that one again soon.');
  assert.deepEqual(run[0].prompt, dinner.facts[0].prompt.map(l => (l.kind === 'caption' ? { text: l.text, kind: 'caption' } : { who: l.who, text: l.text, kind: undefined })));
  // borrowed: in Sprinkle's voice and her praise, pictured as the claws lesson pictures them
  assert.deepEqual(run[1].prompt, [{ who: 'sprinkle', text: 'Count another one with me. One paw. How many claws?' }]);
  assert.deepEqual([run[1].D.teacher, run[1].D.things, run[1].D.unit, run[1].q.from], ['sprinkle', 'claws', 'paw', 'ch03-claws']);
  assert.deepEqual([run[1].kind, run[1].line], ['fast', 'You didn’t even look at the mud!'], 'quick after a miss: her own line, about the mud');
  assert.ok([run[2].line].every(l => dinner.praise.concat(dinner.fast, dinner.fastAfterMiss).includes(l)), run[2].line);
  // the retry: "Let’s count my dinner again!" and the question, then hopping works (never "How did you DO that?")
  assert.deepEqual(run[3].prompt, [{ who: 'sprinkle', text: 'Let’s count my dinner again! Two forepaws, five claws each. How many fish at a meal?' }]);
  assert.deepEqual(run[3].balloons, dinner.facts[0].rightAgain);
  assert.ok(!JSON.stringify(run[3].balloons).includes('How did you DO that?'));
  // right the first time: TEN! How did you DO that? / Five, ten. Hopping!
  const ok = play3(after2(s3), s3, 'ch03-dinner', null, { all: 9000 });
  assert.deepEqual(ok[0].balloons, dinner.facts[0].right);
  // a borrowed question she misses is helped in the mud too, the player hopping, in Sprinkle's words
  const bm = play3(after2(s3), s3, 'ch03-dinner', { '2x5': [12], '1x5': [6] });
  assert.deepEqual(ks(bm).slice(0, 3), ['2x5✗', 'F:1x5✗', 'F:5x3']);
  assert.deepEqual([bm[1].help.ground, bm[1].help.counter, bm[1].help.intro, bm[1].line], ['mud', 'player', 'Let’s scratch it in the mud. You hop!', 'There! We’ll count that one again soon.']);
  // ... and when it comes back, it is never "my dinner again": it opens as it did, in Sprinkle's words
  const back = bm.find(r => r.k === 'R:1x5');
  assert.ok(back, ks(bm).join(' '));
  assert.deepEqual(back.prompt, [{ who: 'sprinkle', text: 'Count another one with me. One paw. How many claws?' }]);
  assert.equal(back.line, 'You remembered! I knew you would.');
  // never Tallyheart's sand lines, never her five-or-zero reminder under the bridge
  const all = [].concat(...run.map(r => [r.line].concat((r.prompt || []).map(l => l.text), r.help ? [r.help.intro] : [])));
  assert.ok(all.every(l => !/sand|Tallyheart|hunter|ears/i.test(l)), all.join(' | '));
  const nf = play3(after2(s3), s3, 'ch03-dinner', { '2x5': [12], '1x5': [4] });
  assert.equal(nf[1].help.intro, 'Let’s scratch it in the mud. You hop!', 'no five-or-zero line in Sprinkle’s sets');
});

test('the six forepaws: hopped 5 · 10 · 15 · 20 · 25 · 30 in the mud by the player; “Let’s count them again.”; quiet lines; borrows 1 × 5 and 5 × 3 after a dinner that borrowed nothing', () => {
  const s3 = story3(), six = s3.ch03.counts['ch03-six'];
  const cat = after2(s3);
  play3(cat, s3, 'ch03-claws');
  play3(cat, s3, 'ch03-dinner');
  assert.deepEqual(E.siblingAsked(cat, s3.ch03, 'ch03-six'), ['2x5'], 'the bridge’s other set is its sibling');
  const run = play3(cat, s3, 'ch03-six', { '6x5': [25] }, { all: 1500 });
  assert.deepEqual(ks(run), ['6x5✗', 'F:1x5', 'F:5x3', 'R:6x5']);
  const h = run[0].help;
  assert.deepEqual([h.nums, h.counter, h.ground, h.style, h.intro], [[5, 10, 15, 20, 25, 30], 'player', 'mud', 'swipe', 'Let’s scratch it in the mud. You hop!']);
  assert.deepEqual(run[0].prompt, [{ who: 'sprinkle', text: 'Six forepaws. How many claws?' }]);
  assert.deepEqual(run[3].prompt, [{ who: 'sprinkle', text: 'Let’s count them again. Six forepaws. How many claws?' }]);
  assert.deepEqual(run[3].balloons, six.facts[0].right, 'its short right line on a right retry');
  // its own quiet lines, never the dinner's Mama line
  assert.deepEqual(run.slice(1, 3).map(r => r.line), ['You knew that one.', 'Yes. Five claws each.']);
  assert.ok(run.every(r => !/Mama/.test(r.line)));
  // after a dinner that borrowed 1 × 5 and 5 × 3, the six borrows the next easiest she hasn't counted under the bridge
  const c2 = after2(s3);
  play3(c2, s3, 'ch03-claws');
  play3(c2, s3, 'ch03-dinner', { '2x5': [12] });
  assert.deepEqual(ks(play3(c2, s3, 'ch03-six', { '6x5': [25] })), ['6x5✗', 'F:4x5', 'F:5x5', 'R:6x5']);
  // missed three times: the last miss line, never the right lines; the next screen carries the story
  const c3 = after2(s3);
  play3(c3, s3, 'ch03-claws');
  const thrice = play3(c3, s3, 'ch03-six', { '6x5': [25, 26, 27] });
  assert.deepEqual(ks(thrice), ['6x5✗', 'F:1x5', 'F:5x2', 'R:6x5✗', 'F:5x3', 'F:4x5', 'R:6x5✗']);
  assert.deepEqual(thrice.filter(r => /✗/.test(r.k)).map(r => r.line), [six.miss, six.miss, six.missLast]);
  // fillOrder 'easiest': the pool by product, smallest first (her most recent claws answers would lead with 10 × 5)
  assert.deepEqual(E.fillPool(c3, 'ch03-claws', s3.list, 'easiest').map(p => p.a * p.b), [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
  assert.deepEqual(E.fillPool(c3, 'ch03-claws', s3.list).slice(0, 3).map(p => p.a + 'x' + p.b), ['10x5', '7x5', '9x5']);
});

test('E.hardFacts and reading time: a right first ask read under a prompt or the frame’s balloons says nothing about speed (only a miss); the lesson’s order keeps the rest honest', () => {
  const s3 = story3();
  const cat = after2(s3);
  play3(cat, s3, 'ch03-claws', null, { '4x5': 9000, '5x6': 9000, '5x8': 9000 });
  play3(cat, s3, 'ch03-dinner', null, { '2x5': 9000 });
  play3(cat, s3, 'ch03-six', null, { '6x5': 9000 });
  assert.deepEqual(E.hardFacts(cat, 5, s3.list), [[5, 8]], 'slow 4 × 5 (first, under its prompt), 5 × 6 (hop on), the dinner and the six are not hard; slow 5 × 8 is');
  assert.equal(E.readFirst({ set: 'ch03-claws', a: 4, b: 5 }, s3.list), true);
  assert.equal(E.readFirst({ set: 'ch03-claws', a: 5, b: 8 }, s3.list), false);
  assert.equal(E.readFirst({ set: 'ch03-dinner', a: 2, b: 5 }, s3.list), true, 'the dinner has its prompt');
  assert.equal(E.readFirst({ set: 'ch03-six', a: 6, b: 5 }, s3.list), true, 'the six opens under its frame');
  assert.equal(E.readFirst({ set: 'hollow-5s', a: 4, b: 5 }, s3.list), false, 'the Hollow: never');
  // chapter 2's own read facts, with no new log field: 3 × 2 (firstPrompt), 2 × 6 (prompt), 10 × 2 (the old tom), the warm-up's opener or its alt
  [['ch02-ears', 3, 2], ['ch02-ears', 2, 6], ['ch02-pile', 10, 2], ['ch02-tails', 1, 4], ['ch02-tails', 1, 3], ['ch01-tails', 3, 1]]
    .forEach(([set, a, b]) => assert.equal(E.readFirst({ set, a, b }, s3.list), true, set + ' ' + a + 'x' + b));
  [['ch02-ears', 2, 8], ['ch02-ears', 2, 3], ['ch01-tails', 1, 7]].forEach(([set, a, b]) => assert.equal(E.readFirst({ set, a, b }, s3.list), false, set + ' ' + a + 'x' + b));
  // a missed one is hard as before
  const m = after2(s3);
  play3(m, s3, 'ch03-claws', { '4x5': [21] });
  assert.deepEqual(E.hardFacts(m, 5, s3.list), [[4, 5]]);
  // after the bridged 5 × 6, no answer is the one before plus or minus five
  const ans = s3.ch03.counts['ch03-claws'].facts.map(f => (Array.isArray(f) ? f[0] * f[1] : f.a * f.b));
  for (let i = ans.indexOf(30) + 1; i < ans.length; i++) assert.notEqual(Math.abs(ans[i] - ans[i - 1]), 5, ans[i - 1] + ' then ' + ans[i]);
});

test('the skip-count on the 5s keeps its totals for the pattern line; the bedtime hop is her own two forepaws, left, right, left, right', () => {
  const { ch03 } = fixtures();
  const rim = ch03.frames.d07.skip;
  assert.deepEqual([E.skipView(rim, 3).count, E.skipView(rim, 5).count, E.skipView(rim, 5).totals], ['5… 10… 15…', '5… 10… 15… 20… 25!', [5, 10, 15, 20, 25]]);
  assert.equal(E.skipView(rim, 0).paws, undefined, 'the rim’s view is the plain one');
  assert.deepEqual(E.keptSkip(ch03, 'd08'), { id: 'd07', skip: rim }, 'the page it turns to');
  assert.deepEqual(E.keptSkip(ch03, 'd09'), { id: 'd07', skip: rim }, 'and the Counts frame after it, for Tallyheart’s line');
  assert.equal(E.keptSkip(ch03, 'd10'), null, 'never past the lesson');
  assert.equal(E.keptSkip(ch03, 'd07'), null);
  assert.equal(E.skipInto(ch03, 'd08'), rim);
  assert.equal(E.skipInto(ch03, 'd17'), ch03.frames.d16.skip);
  assert.equal(E.skipInto(ch03, 'd09'), null);
  const own = ch03.frames.d16.skip;
  const v = [0, 1, 2, 3, 4].map(n => E.skipView(own, n));
  assert.deepEqual(v.map(x => [x.lit, x.nextPaw, x.total]), [[null, 'left', 0], ['left', 'right', 5], ['right', 'left', 10], ['left', 'right', 15], ['right', null, 20]]);
  assert.equal(v[4].count, '5… 10… 15… 20…', 'the bedtime murmur trails off; the rim keeps its 25!');
  assert.ok(v[4].done && v.every(x => x.paws === 'own'));
  // a fourth tap turns the page: nothing logged
  const cat = E.blankCat({}); cat.finished = { ch01: 1, ch02: 1 };
  E.startChapter(cat, ch03, 1); E.go(cat, ch03, 'd16', 2);
  assert.ok(E.next(cat, ch03, 3));
  assert.equal(cat.frame, 'd17');
  assert.deepEqual(cat.counts, []);
  const bad = clone(ch03);
  bad.frames.d16.skip.paws = 'both'; bad.frames.d07.skip.keep = 'yes';
  assert.match(E.checkStory(bad).join('\n'), /skip paws is "own"[\s\S]*skip keep is true or false|skip keep is true or false[\s\S]*skip paws is "own"/);
});

test('the Training Hollow offers “Claws · the 5s” beside the 1s and 2s (never the warm-up, the pile or Sprinkle’s sets), and the tree has room for ten marks', () => {
  const s3 = story3(), list = s3.list;
  const sets = E.countSets(list);
  assert.deepEqual(sets.map(c => [c.table, c.setId, c.chapter]), [[1, 'ch01-tails', 'ch01'], [2, 'ch02-ears', 'ch02'], [5, 'ch03-claws', 'ch03']]);
  const cat = E.blankCat({});
  ['ch01-tails', 'ch02-ears', 'ch03-ears', 'ch03-pile', 'ch03-claws', 'ch03-dinner', 'ch03-six'].forEach(id => { cat.lessons[id] = { finished: true }; });
  assert.deepEqual(E.learnedCounts(cat, list).map(c => E.countName(c.def, c.table)), ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s']);
  const def = E.hollowDef(list, 5);
  assert.deepEqual([def.id, def.things, def.teacher, def.helpIntroNotFive], ['hollow-5s', 'claws', 'tallyheart', s3.ch03.counts['ch03-claws'].helpIntroNotFive]);
  ['facts', 'firstPrompt', 'fillFrom', 'fillIntro', 'fillOrder', 'fillVoice', 'avoid', 'ground', 'warmHard'].forEach(k => assert.ok(!(k in def), k));
  // a round of the 5s: ten facts, n × 5 both ways; a miss is swiped in the sand
  const { state } = E.hollowStart(cat, list, 1, 5);
  assert.deepEqual(state.queue.map(q => q.a * q.b).sort((a, b) => a - b), [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
  const q = E.counts.question(state);
  const r = E.counts.answer(state, def, q.answer + 1, 2000, 1);
  assert.deepEqual([E.helpPlan(def, def, q, r).ground, E.helpPlan(def, def, q, r).style], ['sand', 'swipe']);
  // the marks: three now, and up to ten
  assert.equal(E.MAX_MARKS, 10);
  assert.deepEqual(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, list).opts, { marks: 3, glow: [false, false, false] });
  const many = [];
  for (let t = 1; t <= 12; t++) many.push({ id: 'x' + t, number: t, title: 'T' + t, start: 'a', frames: { a: { end: true } }, counts: { ['s' + t]: { table: t, facts: [[t, 1]] } } });
  const lots = E.blankCat({});
  many.forEach(s => { lots.lessons['s' + s.number] = { finished: true }; });
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto' } }, lots, many).opts.marks, 10, 'at most ten');
});

test('her book: a dragonet page for each one found (Sprinkle, in the chapter that finds her), the rest of the seven still to find', () => {
  const { ch01, ch02, ch03 } = fixtures(), list = [ch01, ch02, ch03];
  const cat = E.blankCat({}); cat.name = 'Fern';
  cat.finished = { ch01: 1, ch02: 2 };
  assert.equal(E.buildFullBook(cat, list).dragonets, null, 'none found yet: no dragonet pages');
  cat.finished.ch03 = 3;
  const b = E.buildFullBook(cat, list);
  assert.deepEqual(b.dragonets, { found: [{ id: 'sprinkle', name: 'Sprinkle', lines: ['A Mistscale dragonet, as big as a heron.', 'Fernpaw found her under the Old Bridge.'], chapter: 'ch03' }], toFind: 6 });
  assert.equal(E.DRAGONETS, 7);
  assert.deepEqual(b.pages.map(p => p.id), ['ch01', 'ch02', 'ch03']);
  assert.deepEqual(b.teaser.title, 'Chapter 4: The Glittering Scale');
  const bad = clone(ch03); bad.book.dragonet = { name: '' };
  assert.match(E.checkStory(bad).join('\n'), /book.dragonet needs an id and a name/);
});

test('chapter 3 (the fixture) plays through on both paths and both chapter-2 paths: ch3Told, every lesson, the end, the hub and the status', () => {
  const s3 = story3();
  for (const told of [0, 1]) for (const path of ['bridge', 'river']) {
    const cat = after2(s3);
    cat.flags.ch2Path = path; cat.name = 'Fern';
    E.startChapter(cat, s3.ch03, 10);
    const seq = V1.play(E, s3.ch03, cat, V1.script({ choices: { d15: told, d02: told }, miss: ['6x2', '7x5', '2x5', '6x5'], dream: 'a dragon who burps clouds' }));
    assert.equal(seq[seq.length - 1], 'd19');
    assert.equal(seq.includes('d14'), path === 'river');
    assert.ok(seq.includes(told ? 'k01' : 't01'));
    assert.equal(cat.flags.ch3Told, !told);
    assert.deepEqual(Object.keys(cat.lessons).filter(k => /^ch03/.test(k)).sort(), ['ch03-claws', 'ch03-dinner', 'ch03-ears', 'ch03-pile', 'ch03-six']);
    assert.equal(E.status(cat, s3.list), 'Chapter 3 finished');
    assert.deepEqual(E.learnedCounts(cat, s3.list).map(c => c.table), [1, 2, 5]);
    assert.deepEqual(cat.choices['ch03:d02'], { index: told, label: s3.ch03.frames.d02.choice.options[told].label });
    assert.equal(Object.keys(cat.flags).filter(k => /^ch3/.test(k)).join(), 'ch3Told', 'the light choices set no flag');
    const book = E.buildFullBook(cat, s3.list);
    assert.ok(book.pages[2].recap.some(l => (told ? /kept Sprinkle’s secret/ : /told Tallyheart/).test(l)));
    assert.equal(book.dragonets.found[0].name, 'Sprinkle');
  }
  // the hub's big button: chapter 3 once chapter 2 is finished
  const cat = after2(s3);
  const p = E.progress(cat, s3.list);
  assert.deepEqual([p.next && p.next.id, E.chapterHeading(p.next)], ['ch03', 'Chapter 3: Under the Old Bridge']);
});

test('the real chapter 3 (once app/story/ch03.js is written): sound, sets as the text has them, and it plays through on every path', (t) => {
  const S = realStories();
  if (!ch03Built(S)) { t.skip('app/story/ch03.js is still the stub'); return; }
  const ch03 = S.ch03, list = [S.ch01, S.ch02, ch03];
  assert.deepEqual(E.checkStory(ch03), []);
  const c = ch03.counts;
  assert.deepEqual(Object.keys(c).sort(), ['ch03-claws', 'ch03-dinner', 'ch03-ears', 'ch03-pile', 'ch03-six']);
  const pairs = set => set.facts.map(f => (Array.isArray(f) ? f : [f.a, f.b]).join('x'));
  assert.deepEqual(pairs(c['ch03-ears']), ['4x2', '6x2']);
  assert.deepEqual(c['ch03-ears'].warmHard, { table: 2, at: 1, alt: [[2, 3], [2, 2], [2, 1]] });
  assert.deepEqual(c['ch03-ears'].avoid, [[9, 2], [7, 2]]);
  assert.deepEqual([c['ch03-ears'].ground, c['ch03-ears'].fillFrom, c['ch03-ears'].fillIntro, c['ch03-ears'].done], ['earth', 'ch02-ears', 'One from yesterday.', null]);
  assert.deepEqual(pairs(c['ch03-pile']), ['9x2', '7x2']);
  assert.deepEqual(pairs(c['ch03-claws']), ['4x5', '5x2', '1x5', '5x5', '5x6', '5x8', '5x3', '9x5', '7x5', '10x5']);
  for (const id of ['ch03-dinner', 'ch03-six']) {
    const d = c[id];
    assert.deepEqual([d.teacher, d.table, d.ground, d.helpCounter, d.fillFrom, d.fillOrder, d.fillVoice, d.done], ['sprinkle', 5, 'mud', 'you', 'ch03-claws', 'easiest', 'borrower', null], id);
  }
  const s3 = { ch01: S.ch01, ch02: S.ch02, ch03, list };
  const cat = after2(s3);
  play3(cat, s3, 'ch03-claws');
  assert.deepEqual(ks(play3(cat, s3, 'ch03-dinner', { '2x5': [12] })), ['2x5✗', 'F:1x5', 'F:5x3', 'R:2x5']);
  const six = play3(after2(s3), s3, 'ch03-six', { '6x5': [25] });
  assert.deepEqual(six[0].help.nums, [5, 10, 15, 20, 25, 30]);
  assert.equal(six[0].help.counter, 'player');
  assert.equal(six.find(r => r.q.retry).prompt[0].text, 'Let’s count them again. Six forepaws. How many claws?');
  const warm = play3(after2(s3), s3, 'ch03-ears', { '6x2': [13] });
  assert.ok(!warm.some(r => /^F:(9x2|2x9|7x2|2x7)/.test(r.k)));
  // every path plays to the end, with a dragonet page
  for (const told of [0, 1]) for (const path of ['bridge', 'river']) {
    const k = after2(s3);
    k.flags.ch2Path = path; k.flags.ch2Stone = 'nose';
    E.startChapter(k, ch03, 10);
    const opts = {};
    Object.keys(ch03.frames).forEach(id => { const f = ch03.frames[id]; if (f.choice && f.choice.options.some(o => o.sets && 'ch3Told' in o.sets)) opts[id] = told; });
    const seq = V1.play(E, ch03, k, V1.script({ choices: opts, miss: ['6x2', '7x5'] }));
    assert.ok(ch03.frames[seq[seq.length - 1]].end);
    assert.equal(k.flags.ch3Told, !told);
    assert.ok(E.buildFullBook(k, list).dragonets.found.some(d => d.id === 'sprinkle'));
  }
});

test('speakers (PC.ui.speakers): Sprinkle and “A small voice”, the tortie’s names from the chapter, chapters 1 and 2’s labels as they were, and the voices', () => {
  require('../app/ui.js');
  const Sp = PC.ui.speakers, { ch03 } = fixtures();
  const cat = E.blankCat({}); cat.name = 'Fern';
  const fill = t => E.fill(t, cat);
  const label = (s, story) => Sp.label(s, { cat, story, fill });
  assert.equal(label({ who: 'sprinkle' }, ch03), 'Sprinkle');
  assert.equal(label({ who: 'sprinkle', name: 'A small voice' }, ch03), 'A small voice');
  assert.equal(label({ who: 'mutterer' }, ch03), 'Murmurpaw', 'chapter 3 names her');
  assert.equal(label({ who: 'mutterer', name: '{Murmur}chime' }, ch03), 'Murmurchime', 'after the naming, a balloon’s own name');
  assert.equal(label({ who: 'murmurchime' }, ch03), 'Murmurchime');
  cat.name = 'Murmur';
  assert.equal(label({ who: 'mutterer' }, ch03), 'Mutterpaw');
  // chapters 1 and 2: no names map, the labels as before
  const S = realStories();
  for (const [s, b, want] of [[S.ch01, { who: 'mutterer' }, 'Muttering apprentice'], [S.ch02, { who: 'mutterer' }, 'Muttering apprentice'],
    [S.ch01, { who: 'tallyheart', name: 'The ginger cat' }, 'The ginger cat'], [S.ch02, { who: 'otter', variant: 1 }, 'The old ferry otter'],
    [S.ch02, { who: 'dog', variant: 3 }, 'The tiny dog'], [S.ch01, { who: 'player' }, 'Murmurpaw'], [S.ch02, { who: 'waffles' }, 'Princess Waffles']]) assert.equal(label(b, s), want);
  assert.equal(Sp.label({ who: 'player' }, {}), 'You');
  // a voice not shown yet keeps its face to itself: named, and out of the picture or only eyes in the dark
  assert.equal(Sp.faceHidden({ who: 'sprinkle', name: 'A small voice' }, null), true);
  assert.equal(Sp.faceHidden({ who: 'sprinkle', name: 'A small voice' }, { who: 'sprinkle', pose: 'eyes' }), true);
  assert.equal(Sp.faceHidden({ who: 'sprinkle', name: 'A muffled voice' }, { who: 'sprinkle', pose: 'hide' }), true, 'her face under her tail: no face either');
  assert.equal(Sp.faceHidden({ who: 'tallyheart', name: 'The ginger cat' }, { who: 'tallyheart', pose: 'sit' }), false, 'chapter 1’s ginger cat keeps her face');
  assert.equal(Sp.faceHidden({ who: 'waffles' }, null), false);
  // every named voice in chapters 1 and 2 is in its frame's picture, so none loses its face
  for (const s of [S.ch01, S.ch02]) for (const f of Object.values(s.frames)) for (const b of (f.say || [])) {
    if (!b || !b.name) continue;
    const m = ((f.scene && f.scene.cast) || []).find(c => c.who === b.who);
    assert.equal(Sp.faceHidden(b, m), false, s.id + ': ' + b.name);
  }
  // voices: Sprinkle high and gentle, a little slower; everyone else as before
  assert.ok(Sp.pitch('sprinkle') > 1.2 && Sp.rate('sprinkle') < 0.95);
  assert.deepEqual(['tallyheart', 'riffle', 'grizzled', 'mutterer', 'player'].map(w => [Sp.pitch(w), Sp.rate(w)]), [[0.92, 0.95], [1.5, 0.95], [0.6, 0.95], [1.3, 0.95], [1.2, 0.95]]);
  assert.equal(Sp.pitch('otter', 1), 0.68);
});
