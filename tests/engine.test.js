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

test('a balloon’s tail never runs across somebody else’s face when there is a spot where it need not (PC.ui.layout.tailOverFaces; chapter 4: “I don’t know. Yet.” over Riffle, Riffle’s shout over Sprinkle)', () => {
  const L = PC.ui.layout;
  const head = { x: 700, y: 400, r: 30 }, own = { x: 700, y: 400, r: 40 }, other = { x: 500, y: 400, r: 40 };
  assert.equal(L.tailOverFaces(300, 400, head, [own, other]), 500, 'straight through the other face');
  assert.equal(L.tailOverFaces(300, 400, head, [own]), 0, 'the speaker’s own face is where the tail goes');
  assert.equal(L.tailOverFaces(700, 200, head, [own, other]), 0, 'from above the speaker: clear');
  assert.equal(L.tailOverFaces(300, 400, head, [own, { x: 500, y: 440, r: 40 }]), 0, 'past its edge (the outer third of a face’s circle is fur and air): no cost');
  assert.equal(L.tailOverFaces(300, 400, head, [own, other, { x: 400, y: 404, r: 30 }]), 1000, 'two faces, twice');
  assert.equal(L.tailOverFaces(300, 400, head, []), 0);
  assert.equal(L.tailOverFaces(300, 400, head), 0);
  // a keep area's circle counts as a face does (what the picture is about)
  assert.equal(L.tailOverFaces(300, 400, head, [own, { x: 500, y: 400, r: 20, who: '', rr: 0 }]), 500);
  // in findSpot: the speaker sits under another cat's head. The nearest clear spot above her would hang its tail
  // down through that face; the balloon goes beside the two of them
  const o = { W: 1000, H: 600, w: 260, h: 70, faces: [{ x: 200, y: 450, r: 52 }, { x: 200, y: 290, r: 58 }], placed: [], head: { x: 200, y: 450, r: 40 } };
  const spot = L.findSpot(o), f = o.faces[1];
  assert.ok(spot && !o.faces.some(c => L.rectCircle(spot, c)), 'a spot, off both faces');
  assert.equal(L.segHitsRect(spot.x + spot.w / 2, spot.y + spot.h / 2, o.head.x, o.head.y, { x: f.x - f.r * 0.7, y: f.y - f.r * 0.7, w: f.r * 1.4, h: f.r * 1.4 }), false, 'its tail misses the other face: ' + JSON.stringify(spot));
  assert.ok(spot.x >= f.x + f.r * 0.7 - 4, 'beside them, not above: ' + JSON.stringify(spot));
  // with nobody in the way the spot is the one it always was: close above the speaker
  const alone = L.findSpot(Object.assign({}, o, { faces: [o.faces[0]] }));
  assert.ok(alone.y + alone.h <= o.head.y - o.head.r && Math.abs(alone.x + alone.w / 2 - o.head.x) < 80, JSON.stringify(alone));
  // a second balloon chained to its speaker's first (`near`) draws no tail of its own, only the neck that joins
  // the two: a face between it and its speaker costs nothing, and it stays beside the first
  const first = { x: 300, y: 80, w: 220, h: 60 }, sp = { x: 700, y: 400, r: 30 };
  const chained = (faces) => L.findSpot({ W: 1000, H: 600, w: 200, h: 60, faces, placed: [first], head: sp, near: first, prev: first, after: first });
  const between = chained([{ x: 700, y: 400, r: 40 }, { x: 560, y: 300, r: 45 }]);
  assert.deepEqual(between, chained([{ x: 700, y: 400, r: 40 }]), 'chained: a face under the tail it never draws moves nothing: ' + JSON.stringify(between));
  assert.ok(between.y - (first.y + first.h) <= 36 && Math.abs(between.x - first.x) <= 36, 'right under the first: ' + JSON.stringify(between));
  // Chapter 2's f020 (live) as the page measures it on an iPad held upright, a 781 x 485 panel: "TEN!" over
  // Tallyheart, "Flat ears still count." beside it, over nobody. Charged for the undrawn tail (it would have run
  // through the rim cat's face), the second balloon went to the left edge, 186px down; the pair was then laid as one
  // block at the top right, over the cream rim cat, on a 220px tail, and the line read as the rim cat's
  const ten = { x: 242, y: 104, w: 100.5814, h: 74.17944 }, tom = { x: 10, y: 10, w: 375, h: 70 };
  const rim = [{ x: 133.551, y: 217.765, r: 58.7214 }, { x: 392.843, y: 211.945, r: 56.5658 }, { x: 685.718, y: 207.095, r: 58.7214 },
    { x: 295.218, y: 267.235, r: 72.1937 }, { x: 542.795, y: 315.735, r: 72.1937 }, { x: 762.6465, y: 112.52, r: 61.23 }];
  const flat = L.findSpot({ W: 781, H: 485, w: 213.5814, h: 49.17944, index: 1, last: true, margin: 8, head: { x: 295.218, y: 267.235, r: 57.5597 }, faces: rim,
    bodies: [{ x: 55.615, y: 240.687, w: 155.872, h: 183.379 }, { x: 318.093, y: 233.93, w: 149.499, h: 175.881 }, { x: 607.782, y: 230.017, w: 155.872, h: 183.379 },
      { x: 197.367, y: 296.015, w: 195.703, h: 230.239 }, { x: 444.944, y: 344.515, w: 195.703, h: 230.239 }],
    placed: [tom, ten], near: ten, prev: ten, after: ten });
  assert.deepEqual([flat.x, flat.y], [350, 104], 'f020: beside “TEN!”, where it is on the live page: ' + JSON.stringify(flat));
  assert.equal(L.tailOverFaces(flat.x + flat.w / 2, flat.y + flat.h / 2, { x: ten.x + ten.w / 2, y: ten.y + ten.h / 2 }, rim), 0, 'its neck crosses no face');
  // The neck that joins the two (the line that is drawn) is charged. Chapter 4's f050 as the page measures it
  // (a 1034 x 646 panel): the fox chest-up, the edge of Glintstar's face at the left, her first balloon at the top
  // left. Her second went to the bottom right, where it covers less of the fox, and its neck ran across his face
  const top = { x: 12, y: 72, w: 533, h: 78 };
  const fox = { x: 613, y: 335, r: 196, rr: 165 }, lead = { x: 133, y: 390, r: 172, rr: 145 };
  const o2 = { W: 1034, H: 646, w: 405, h: 78, faces: [fox, lead], bodies: [fox, lead].map(c => ({ x: c.x - c.rr * 1.7, y: c.y + c.rr * 0.5, w: c.rr * 3.4, h: c.rr * 4 })),
    placed: [top], head: { x: 133, y: 390, r: 145 }, near: top, prev: top, after: top, index: 1, last: true, margin: 8 };
  const second = L.findSpot(o2), inner = { x: fox.x - fox.r * 0.7, y: fox.y - fox.r * 0.7, w: fox.r * 1.4, h: fox.r * 1.4 };
  assert.ok(second && !o2.faces.some(c => L.rectCircle(second, c)), 'a spot, off both faces');
  assert.equal(L.segHitsRect(second.x + second.w / 2, second.y + second.h / 2, top.x + top.w / 2, top.y + top.h / 2, inner), false, 'its neck misses the fox’s face: ' + JSON.stringify(second));
  assert.ok(second.x + second.w / 2 < fox.x && second.y > 500, 'under her own side of the panel, not across at the right: ' + JSON.stringify(second));
});

test('a voice from outside the panel: placed as it always was, except that the panel’s last balloon, down in the lower part (its tail leaves by the bottom edge), takes the lowest clear spot there, not the highest (chapter 4’s “GLINTSTAR!”, chapter 3’s f045)', () => {
  const L = PC.ui.layout;
  const first = { x: 500, y: 200, w: 400, h: 80 };
  const base = { W: 1000, H: 600, w: 180, h: 100, faces: [], placed: [first], head: null, after: first, prev: first, index: 1, margin: 8 };
  // it has to read after the balloon before it, so it is in the lower part (below 40% of the panel: the tail goes down)
  const was = L.findSpot(base), now = L.findSpot(Object.assign({}, base, { last: true }));
  assert.deepEqual([was.x, was.y], [8, 284], 'not the last balloon: as high as it fits, as ever (something may have to read after it)');
  assert.deepEqual([now.x, now.y], [8, 488], 'the last balloon: by the bottom edge, a short tail');
  assert.ok(600 - (now.y + now.h) < 20 && 600 - (was.y + was.h) > 200, 'its tail no longer hangs down across the picture');
  // its way down is kept off faces, and off the balloons already placed
  const faces = [{ x: 150, y: 540, r: 60 }, { x: 420, y: 560, r: 50 }];
  const clear = L.findSpot(Object.assign({}, base, { last: true, faces }));
  assert.ok(clear.y >= 480 && !faces.some(c => L.rectCircle(clear, c)), JSON.stringify(clear));
  assert.equal(L.tailOverFaces(clear.x + clear.w / 2, clear.y + clear.h / 2, { x: Math.min(990, clear.x + clear.w * 0.7), y: 606 }, faces), 0, 'no face under its tail: ' + JSON.stringify(clear));
  const under = { x: 8, y: 520, w: 300, h: 60 };
  const past = L.findSpot(Object.assign({}, base, { last: true, placed: [first, under] }));
  assert.ok(!L.overlap(past, under, 6) && !L.segHitsRect(past.x + past.w / 2, past.y + past.h, Math.min(990, past.x + past.w * 0.7), 606, under), 'nor a balloon: ' + JSON.stringify(past));
  // with room in the upper part it goes there, exactly as before, last or not: nothing moves between the top and the bottom
  const free = { W: 1000, H: 600, w: 180, h: 100, faces: [], placed: [], head: null, index: 0, margin: 8 };
  assert.deepEqual(L.findSpot(Object.assign({}, free, { last: true })), L.findSpot(free));
  assert.deepEqual([L.findSpot(free).x, L.findSpot(free).y], [8, 8]);
  // chapter 3's sleepy voice from across camp (f105 on an iPad held upright): two captions across the top, the
  // sleepers below. It stays right under its captions, its tail going up behind them, as it does in the live game
  const caps = [{ x: 13, y: 13, w: 480, h: 70 }, { x: 505, y: 13, w: 480, h: 70 }];
  const sleepy = { W: 1000, H: 600, w: 300, h: 90, faces: [{ x: 300, y: 520, r: 70 }, { x: 700, y: 520, r: 70 }], placed: caps, head: null, index: 0, margin: 8 };
  assert.deepEqual(L.findSpot(Object.assign({}, sleepy, { last: true })), L.findSpot(sleepy));
  assert.ok(L.findSpot(sleepy).y < 600 * 0.4);
  // a speaker in the picture is never weighed this way
  const inPic = { W: 1000, H: 600, w: 180, h: 100, faces: [{ x: 500, y: 450, r: 50 }], placed: [], head: { x: 500, y: 450, r: 40 }, index: 0, margin: 8 };
  assert.deepEqual(L.findSpot(Object.assign({}, inPic, { last: true })), L.findSpot(inPic));
});

test('what the picture is about (the art’s keep areas): one circle round an area up to four times as long as it is wide, as chapters 1 to 3 always had; a longer band (a row of the pile) is kept clear along its length (PC.ui.layout.keepCircles)', () => {
  const L = PC.ui.layout, W = 1034, H = 646;
  // the claw marks on the tree (chapter 1), the newest mark, a curl of bark on the sand, and a box 3.1 to 1 on the
  // screen (the longest before chapter 4): each the very circle the page always made of it, to the last bit
  for (const k of [{ x: 93.2, y: 9.3, w: 6.8, h: 17 }, { x: 68, y: 48.4, w: 10.6, h: 8.1 }, { x: 45, y: 88, w: 11, h: 8 }, { x: 10, y: 10, w: 31, h: 16 }, { x: 47.9, y: 0, w: 4.3, h: 4 }]) {
    assert.ok(Math.max(k.w * W, k.h * H) <= 4 * Math.min(k.w * W, k.h * H));
    const c = L.keepCircles(k, W, H);
    assert.deepEqual(c, [{ x: (k.x + k.w / 2) * W / 100, y: (k.y + k.h / 2) * H / 100, r: Math.max(k.w * W, k.h * H) / 200 + 4, who: '', rr: 0 }], JSON.stringify(k) + ': the one circle it always was');
  }
  // four to one on the screen is still one circle; just past it, a row
  assert.equal(L.keepCircles({ x: 10, y: 10, w: 40, h: 10 }, 1000, 1000).length, 1);
  assert.equal(L.keepCircles({ x: 10, y: 10, w: 41, h: 10 }, 1000, 1000).length, 5);
  // every keep area chapters 1 to 3 draw is one of the short ones (so nothing in them moves): every frame, as the page sizes its panel
  const S3 = realStories();
  let seen3 = 0;
  ['ch01', 'ch02', 'ch03'].forEach(ch => Object.entries(S3[ch].frames).forEach(([id, f]) => {
    if (!f.scene) return;
    (PC.art.render(f.scene, { look: {} }).keep || []).forEach(k => {
      seen3++;
      for (const [w, h] of [[1034, 646], [751, 469], [358, 224], [788, 492]]) assert.equal(L.keepCircles(k, w, h).length, 1, ch + ' ' + id + ': ' + JSON.stringify(k));
    });
  }));
  assert.ok(seen3 >= 20, 'chapters 1 to 3 have ' + seen3 + ' keep areas');
  // the pile's back row from the `gap` camera: 96% of the panel wide, 11% tall (14 to 1)
  const row = { x: 1.8, y: 50.9, w: 96.4, h: 10.7 }, c = L.keepCircles(row, W, H);
  const kw = row.w * W / 100, kh = row.h * H / 100;
  assert.equal(c.length, Math.ceil(kw / kh), 'a circle for each stretch as long as the band is tall: ' + c.length);
  assert.ok(c.length >= 12);
  c.forEach((q, i) => {
    assert.ok(Math.abs(q.y - (row.y + row.h / 2) * H / 100) < 1e-9, 'along its middle');
    assert.ok(q.r < kh && q.r > kh / 2, 'about as big as the band is tall: ' + q.r + ' for ' + kh);
    if (i) assert.ok(q.x - c[i - 1].x < q.r * 1.5, 'overlapping its neighbour: no gap for a caption to slip into the row');
  });
  assert.ok(c[0].x - c[0].r <= row.x * W / 100 + 1 && c[c.length - 1].x + c[c.length - 1].r >= (row.x + row.w) * W / 100 - 1, 'end to end');
  // every point of the band is inside one of them
  for (let x = 0; x <= 1; x += 0.02) for (const y of [0.05, 0.5, 0.95]) {
    const px = (row.x + row.w * x) * W / 100, py = (row.y + row.h * y) * H / 100;
    assert.ok(c.some(q => Math.hypot(q.x - px, q.y - py) <= q.r), 'covered at ' + [x, y]);
  }
  // so the panel's corners are free again: as one circle the row took 49% of the panel's width, mid-panel
  const one = { x: (row.x + row.w / 2) * W / 100, y: (row.y + row.h / 2) * H / 100, r: kw / 2 + 4 };
  const cap = { x: 10, y: 10, w: 420, h: 48 }, low = { x: W - 310, y: H - 66, w: 300, h: 56 };
  assert.ok(L.rectCircle(cap, one) && L.rectCircle(low, one), 'the old circle: no caption corner clears it');
  assert.ok(!c.some(q => L.rectCircle(cap, q)) && !c.some(q => L.rectCircle(low, q)), 'the row of circles: both corners are clear');
  assert.ok(L.findSpot({ W, H, w: 260, h: 60, faces: c, placed: [cap], head: { x: 130, y: 520, r: 40 } }), 'and a balloon finds a spot in the picture');
  // a tall thin band runs down, the same way
  const tall = L.keepCircles({ x: 48, y: 5, w: 4, h: 90 }, W, H);
  assert.ok(tall.length >= 12 && tall.every(q => Math.abs(q.x - 50 * W / 100) < 1e-9) && tall[1].y > tall[0].y);
  // nothing to keep: nothing; a degenerate area: its one circle
  assert.deepEqual(L.keepCircles({ x: 10, y: 10, w: 0, h: 0 }, W, H), [{ x: 103.4, y: 64.6, r: 4, who: '', rr: 0 }]);
});

test('a skip-count’s own balloon keeps the name its speaker carries on that page; a Counts frame with a whole conversation does not say it again over its first question (PC.ui.speakers.nameOn, lessonIntro)', () => {
  const Sp = PC.ui.speakers;
  const page = [{ who: 'squall', name: 'Squall', text: 'Can’t. I’m GUARDING.' }, { who: 'player', text: 'Five?' }];
  assert.equal(Sp.nameOn(page, 'squall'), 'Squall');
  assert.equal(Sp.nameOn(page, 'player'), undefined, 'a speaker with no name of its own: the label is the usual one');
  assert.equal(Sp.nameOn([{ who: 'squall', text: 'HALT!' }], 'squall'), undefined, 'before he has said it');
  assert.equal(Sp.nameOn([{ who: 'squall', name: 'The dragon' }, { who: 'squall', name: 'Squall' }], 'squall'), 'Squall', 'the latest on the page');
  assert.equal(Sp.nameOn([], 'squall'), undefined);
  assert.equal(Sp.nameOn(null, 'squall'), undefined);
  // the counter under his own balloon is labelled as he is
  const names = { names: { squall: 'The little dragon' } };
  assert.equal(Sp.label({ who: 'squall', name: Sp.nameOn(page, 'squall') }, { story: names }), 'Squall');
  assert.equal(Sp.label({ who: 'squall', name: Sp.nameOn([{ who: 'squall', text: 'x' }], 'squall') }, { story: names }), 'The little dragon');
  // the lesson's intro
  const one = [{ who: 'tallyheart', text: 'Claws first.' }], two = one.concat([{ who: 'player', text: 'Ready.' }]), three = two.concat([{ who: 'squall', text: 'PROVE it!' }]);
  assert.equal(Sp.lessonIntro(one, false), one);
  assert.equal(Sp.lessonIntro(two, false), two, 'one or two balloons are said again over the first question, as in chapters 1 to 3');
  assert.deepEqual(Sp.lessonIntro(three, false), [], 'three or more were just read on the frame itself');
  assert.deepEqual(Sp.lessonIntro(one, true), [], 'a lesson picked up again, or one after a kept skip picture: none');
  assert.deepEqual(Sp.lessonIntro([], false), []);
  assert.deepEqual(Sp.lessonIntro(null, false), []);
  // no Counts frame of chapters 1 to 3 has more than two balloons: their lessons open as they did
  const S = realStories();
  ['ch01', 'ch02', 'ch03'].forEach(ch => Object.entries(S[ch].frames).forEach(([id, f]) => { if (f.counts) assert.ok((f.say || []).length <= 2, ch + ' ' + id); }));
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

test('a frame may say where its sound effect goes (`sfxAt`, chapter 5’s Roar across the sky): there at full size, whatever faces are near; smaller only to clear a caption or a balloon; and placed as any other when it cannot be clear; E.checkStory holds its shape', () => {
  require('../app/ui.js');
  const L = PC.ui.layout, roar = 'ROOOOOAAAAARRRRR!', W = 1027, H = 639, fit = L.sfxFit(roar, W);
  const mid = b => [Math.round((b.x + b.w / 2) / W * 100), Math.round((b.y + b.h / 2) / H * 100)];
  // the Roar's panel: two heads low on the raft, the tower's red light kept at the top; with no `at`
  // it lands at the bottom, over the pair on the logs
  const faces = [{ x: 430, y: 430, r: 60 }, { x: 560, y: 430, r: 60 }, { x: 342, y: 15, r: 30 }];
  const plain = L.sfxPlace(roar, W, H, faces, []);
  assert.ok(plain.box.y > H / 2, 'unplaced, it goes low: ' + JSON.stringify(plain.box));
  const sky = L.sfxPlace(roar, W, H, faces, [], [66, 33]);
  assert.deepEqual([mid(sky.box), sky.size, sky.clear], [[66, 33], fit.size, true], 'its middle where the frame says, at its fitted size');
  assert.deepEqual([Math.round(sky.box.w), Math.round(sky.box.h)], [Math.round(fit.estW), Math.round(fit.estH)]);
  // a face under the spot does not move it: the frame chose the place with the picture in front of it
  assert.deepEqual(mid(L.sfxPlace(roar, W, H, [{ x: W * 0.66, y: H * 0.33, r: 80 }], [], [66, 33]).box), [66, 33]);
  // it stays inside the panel
  const corner = L.sfxPlace(roar, W, H, [], [], [98, 1]).box;
  assert.ok(corner.x + corner.w <= W * 0.98 + 1e-6 && corner.y >= H * 0.02 - 1e-6 && corner.x >= 0, JSON.stringify(corner));
  // a caption over the spot: smaller, still there, until it is clear
  const cap = { x: W * 0.66 - 30, y: H * 0.33 - fit.estH / 2 - 50, w: 300, h: 56 };
  const under = L.sfxPlace(roar, W, H, faces, [cap], [66, 33]);
  assert.ok(under.clear && under.size < fit.size && under.size >= fit.size * 0.5 && !L.overlap(under.box, cap), JSON.stringify(under));
  assert.deepEqual(mid(under.box), [66, 33]);
  // a balloon it can never clear: placed as any other sound, by the usual search
  const wall = { x: W * 0.3, y: H * 0.1, w: W * 0.7, h: H * 0.5 };
  assert.deepEqual(L.sfxPlace(roar, W, H, faces, [wall], [66, 33]), L.sfxPlace(roar, W, H, faces, [wall]));
  // anything that is not a pair of numbers is no spot at all
  [null, undefined, [], [66], [66, 'x'], '66,33', [66, 33, 1]].forEach(bad => assert.deepEqual(L.sfxPlace(roar, W, H, faces, [], bad), plain, JSON.stringify(bad)));
  // the story check
  const ok = { id: 'sx', number: 1, start: 'a', frames: { a: { sfx: 'ROAR!', sfxAt: [66, 33], caption: ['It goes over.'], next: 'b' }, b: { end: true } } };
  assert.deepEqual(E.checkStory(ok), []);
  [[66], [66, 133], ['66', 33], 'sky', [66, 33, 2]].forEach(bad => {
    const s = clone(ok); s.frames.a.sfxAt = bad;
    assert.match(E.checkStory(s).join('\n'), /a: sfxAt is \[x, y\], each 0 to 100/, JSON.stringify(bad));
  });
  const silent = clone(ok); delete silent.frames.a.sfx;
  assert.match(E.checkStory(silent).join('\n'), /a: sfxAt is .* on a frame with an sfx/);
});

test('a frame may give Read to me its sound in words (`sfxRead`): said right after the caption that runs on into the sound, never lettered; frames without it are read as they always were; E.checkStory holds its shape', () => {
  // a sound effect is lettering and is never read aloud: a caption that runs on into one was heard
  // as a sentence nobody finished (“On the rocks, otter tails go” … “YOU DID IT!”)
  const ends = ['Riffle turns a somersault.', 'You did it!', 'Was that a hiccup?', 'all four paws at once, in…', 'comes a small “Ow.”', 'It is *huge.*', '(She nods.)', 'He said ‘no.’'];
  const runsOn = ['On the rocks, otter tails go', 'From the tallest tower:', 'Then, a little later:', 'One, two, three,', 'and then {name}', ''];
  ends.forEach(t => assert.equal(E.endsSentence(t), true, t));
  runsOn.forEach(t => assert.equal(E.endsSentence(t), false, t));
  assert.equal(E.endsSentence(null), false);

  const cat = { flags: { foundSquall: false } }, met = { flags: { foundSquall: true } };
  // after the caption it finishes, when that is the last one
  const slap = { caption: ['Riffle turns a somersault.', 'On the rocks, otter tails go'], sfx: 'Slap! Slap! Slap!', sfxRead: 'Slap! Slap! Slap!', say: [{ who: 'riffle', text: 'YOU DID IT!' }] };
  assert.deepEqual(E.captionsRead(slap, cat), ['Riffle turns a somersault.', 'On the rocks, otter tails go', 'Slap! Slap! Slap!']);
  // after the caption it finishes, when more captions follow (whichever of them she sees)
  const roar = { caption: ['From the tallest tower:', { when: { foundSquall: false }, text: 'He is still up there.' }], sfx: 'RAWWWRRR… hic!', sfxRead: 'a roar, and a tiny hiccup.' };
  assert.deepEqual(E.captionsRead(roar, cat), ['From the tallest tower:', 'a roar, and a tiny hiccup.', 'He is still up there.']);
  assert.deepEqual(E.captionsRead(roar, met), ['From the tallest tower:', 'a roar, and a tiny hiccup.']);
  // the first caption that runs on, when two do
  assert.deepEqual(E.captionsRead({ caption: ['Then:', 'and then:'], sfx: 'BONK!', sfxRead: 'a bonk.' }, cat), ['Then:', 'a bonk.', 'and then:']);
  // every caption ends its sentence: after the last, before the balloons
  assert.deepEqual(E.captionsRead({ caption: ['It goes over.', 'The logs buzz.'], sfx: 'ROAR!', sfxRead: 'a roar.' }, cat), ['It goes over.', 'The logs buzz.', 'a roar.']);
  // a panel that is only a sound
  assert.deepEqual(E.captionsRead({ sfx: 'blub…', sfxRead: 'a bubble.' }, cat), ['a bubble.']);
  // a caption she does not see is not the one it follows
  assert.deepEqual(E.captionsRead({ caption: [{ when: { foundSquall: true }, text: 'Far above:' }, 'The sky is blue.'], sfx: 'hic!', sfxRead: 'a hiccup.' }, cat), ['The sky is blue.', 'a hiccup.']);
  // tokens are left for the page to fill, as E.captions leaves them
  assert.deepEqual(E.captionsRead({ caption: ['{name}paw hears:'], sfx: 'BOOM!', sfxRead: 'a boom, {name}paw.' }, cat), ['{name}paw hears:', 'a boom, {name}paw.']);
  // no `sfxRead` (or nothing in it): exactly E.captions, so every page of chapters 1 to 4 is heard as it was
  [{}, { sfxRead: '' }, { sfxRead: '   ' }, { sfxRead: null }, { sfxRead: 7 }].forEach(x => {
    const f = Object.assign({ caption: ['From far off:', 'A crash.'], sfx: 'CRASH!' }, x);
    assert.deepEqual(E.captionsRead(f, cat), E.captions(f, cat), JSON.stringify(x));
  });
  assert.deepEqual(E.captionsRead(null, cat), []);
  let live = 0;
  const real = require('./_load.js').load().story;
  [real.ch01, real.ch02, real.ch03, real.ch04].forEach(st => Object.keys(st.frames).forEach(id => {
    const f = st.frames[id];
    assert.equal(f.sfxRead, undefined, st.id + ' ' + id + ': the live chapters have no sfxRead');
    [{ flags: {} }, { flags: { foundSquall: true, ch3Told: true, specialty: 'swimming' } }, { flags: { foundSquall: false, ch3Told: false, specialty: 'climbing' } }]
      .forEach(c => assert.deepEqual(E.captionsRead(f, c), E.captions(f, c), st.id + ' ' + id));
    live++;
  }));
  assert.ok(live >= 480, 'every frame of chapters 1 to 4: ' + live);

  // the story check: words, on a frame with a sound, and not on a page that letters its own sounds
  const ok = { id: 'sr', number: 1, start: 'a', frames: { a: { sfx: 'SNNNRRRK.', sfxRead: 'a long snore.', caption: ['Then, a little later:'], next: 'b' }, b: { end: true } } };
  assert.deepEqual(E.checkStory(ok), []);
  ['', '   ', 7, ['a snore.'], true, {}].forEach(bad => {
    const st = clone(ok); st.frames.a.sfxRead = bad;
    assert.match(E.checkStory(st).join('\n'), /a: sfxRead is the sound in words for Read to me/, JSON.stringify(bad));
  });
  const silent = clone(ok); delete silent.frames.a.sfx;
  assert.match(E.checkStory(silent).join('\n'), /a: sfxRead is .* on a frame with an sfx/);
  const skip = clone(ok); delete skip.frames.a.next; skip.frames.a.skip = { table: 2, groups: 3, next: 'b' };
  assert.match(E.checkStory(skip).join('\n'), /a: sfxRead is .*not a skip, an ask or a scratch frame/);

  // the page (app/ui.js needs a DOM for its lettering, so its source is read): the frame's own page
  // hands the captions as heard to the lettering, which reads them and letters the captions as written
  const ui = require('fs').readFileSync(require('path').join(__dirname, '..', 'app', 'ui.js'), 'utf8');
  assert.match(ui, /var capsRead = E\.captionsRead\(f, cat\)\.map\(fill\)\.filter\(Boolean\);/);
  assert.match(ui, /panel\.setAttribute\('aria-label', capsRead\.length \? plain\(capsRead\.join\(' '\)\)/, 'the panel’s label is the whole sentence too');
  assert.match(ui, /caps: caps, capsRead: capsRead,/);
  assert.match(ui, /var heard = ctx\.capsRead \|\| caps;/);
  assert.equal((ui.match(/heard\.forEach\(function \(c\) \{ reading\.push\(\{ text: c \}\); \}\);/g) || []).length, 2, 'in the panel and beside it');
  assert.equal((ui.match(/caps\.forEach\(function \(c\) \{ reading\.push/g) || []).length, 0, 'the captions are never read any other way on a frame’s page');
  // the lettering never shows the words: nothing on the page draws `sfxRead`
  assert.equal((ui.match(/\.sfxRead|\[['"]sfxRead/g) || []).length, 0, 'the page never reads the key itself: only E.captionsRead does');
});

test('the grown-ups corner has words for every flag a chapter sets, and fits a tom (PC.ui.flagWords)', () => {
  require('../app/ui.js');
  const W = PC.ui.flagWords, S = realStories();
  // every chapter in app/story: the flags its choices set, and (chapter 4 on) the ones a frame sets for good
  assert.ok(['ch01', 'ch02', 'ch03'].every(ch => S[ch]));
  Object.keys(S).forEach(ch => Object.entries(S[ch].frames).forEach(([id, f]) => {
    const opts = (f.choice && f.choice.options) || [];
    opts.forEach(o => Object.entries(o.sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], ch + ' ' + id + ': words for ' + k + ': ' + v)));
    Object.entries(f.sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], ch + ' ' + id + ': words for the flag it sets for good, ' + k + ': ' + v));
  }));
  assert.ok(W.ch2Stone && W.ch2Stone.nose && W.ch2Stone.chin, 'Riffle’s stone, read by chapter 3');
  const tom = E.blankCat({}); tom.look.sex = 'tom';
  assert.equal(E.fill(W.ch2Stone.chin, tom), 'put Riffle’s stone under his chin (chapter 3 remembers)');
  Object.values(W).forEach(v => Object.values(v).forEach(w => assert.doesNotMatch(E.fill(w, tom), /\bjust her\b|\bher (nose|chin|book)\b/, w)));
  // chapter 5's roof: his book, for a tom
  assert.equal(E.fill(W.ch5Roof.true, tom), 'met Squall in chapter 5: the roof, offered again (his book says so on chapter 5’s page)');
  assert.match(E.fill(W.ch5Roof.true, E.blankCat({})), /\(her book says so/);
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

test('version 0.9.0 and the save, still version 2 (chapter 4 added one optional field: her Case File’s cards; chapters 5 to 9 add none)', () => {
  assert.equal(E.VERSION, '0.9.0 (chapter 9, 2026-10-26)');
  assert.equal(E.SAVE_VERSION, 2, 'chapter 3 added no field to the save; chapter 4 adds `cards`, optional, and keeps the version; chapters 5 to 9 store nothing new (chapter 7’s ch7Flew, chapter 8’s foundHail and chapter 9’s foundMizzle and ch9Roof are flags)');
  assert.equal(E.STORAGE_KEY, 'potomac-crossing.v1');
  assert.deepEqual(E.newSave(), { version: 2, cats: [], current: null, settings: { readAloud: false, bigText: false } });
  const c = E.blankCat({ now: 5, id: 'x' });
  assert.deepEqual(Object.keys(c).sort(), ['cards', 'chapter', 'choices', 'counts', 'created', 'dreams', 'finished', 'flags', 'frame', 'history',
    'hollow', 'hollowWaiting', 'id', 'lesson', 'lessons', 'look', 'name', 'nest', 'petname', 'places', 'updated'].sort());
  assert.deepEqual(c.cards, [], 'no cards yet');
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
  for (const want of [/light is "groups", "rows" or "tuck"/, /lit is a number/, /who is a list/, /retryPrompt: true keeps a prompt/, /rightAgain: true keeps right lines/, /fillIntro without fillFrom/]) assert.match(errs, want);
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
  // another set on the table does not teach it (chapter 6 asks four patrols of three before the threes'
  // lesson): only the Count's own set, finished, learns it
  cat.lessons['ch02-pile'] = { finished: true };
  assert.deepEqual(E.learnedCounts(cat, list).map(c => c.table), [1], 'the pile’s twos are not the ears’ lesson');
  cat.lessons['ch02-ears'] = { finished: false };
  assert.deepEqual(E.learnedCounts(cat, list).map(c => c.table), [1], 'a lesson set aside is not finished');
  cat.lessons['ch02-ears'] = { finished: true };
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
    // (given the other chapters: chapter 5 runs chapter 4's roof, its riddle and its card)
    assert.deepEqual(E.checkStory(story, list), [], story.id);
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
  // chapter 5: the page she lands on then is one she has never been on, so she arrives there as a
  // page turn would: its card goes in her file and its flags are set (she left chapter 5 on the
  // pile's gap, read chapter 1 again as a noticing cat, and came back to the prints)
  const pa = { id: 'pa', number: 1, start: 'a1', cards: { tiny: { mark: 'eye', line: 'Tiny prints.' } }, frames: {
    a1: { say: [{ who: 'player', text: 'Hm.' }], next: 'a2' },
    a2: { when: { not: { specialty: 'noticing' } }, caption: ['A gap.'], next: 'a3' },
    a3: { when: { specialty: 'noticing' }, card: 'tiny', sets: { sawPrints: true }, caption: ['Tiny prints.'], next: 'a4' },
    a4: { end: true } } };
  const pb = { id: 'pb', number: 2, start: 'b1', frames: { b1: { caption: ['Elsewhere.'], next: 'b2' }, b2: { end: true } } };
  assert.deepEqual(E.checkStory(pa, [pa, pb]), []);
  const lander = E.blankCat({ now: 1 }); lander.flags.specialty = 'climbing';
  E.startChapter(lander, pa, 2); E.next(lander, pa, 3);
  assert.equal(lander.frame, 'a2');
  E.startChapter(lander, pb, 4);
  lander.flags.specialty = 'noticing';
  assert.deepEqual([E.hasCard(lander, 'tiny'), lander.flags.sawPrints], [false, undefined]);
  assert.equal(E.openChapter(lander, pa, 5).frame, 'a3', 'the page after the one that no longer shows');
  assert.deepEqual([E.hasCard(lander, 'tiny'), lander.flags.sawPrints, lander.cards.length], [true, true, 1], 'she arrived there: its card, its flag');
  // a page that still shows is only reopened: nothing is given twice, and a parked page is never arrived on again
  E.startChapter(lander, pb, 6);
  assert.equal(E.openChapter(lander, pa, 7).frame, 'a3');
  assert.equal(lander.cards.length, 1);
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
  bad.frames.d16.skip.paws = 'all four'; bad.frames.d07.skip.keep = 'yes';
  assert.match(E.checkStory(bad).join('\n'), /skip paws is "own", "both", "pile", "board", "log" or "mud"[\s\S]*skip keep is true or false|skip keep is true or false[\s\S]*skip paws is "own", "both", "pile", "board", "log" or "mud"/);
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

/* ================================================================ chapter 4 (docs/build.md, "Chapter 4 (v0.4)")
 * First, the proof that chapters 1 to 3 play exactly as they did: nine whole readings, recorded with
 * the engine chapter 3 shipped with (tests/fixtures/make-ch03-golden.js), compared digest by digest.
 * Then chapter 4's contract, on the fixture chapter 4 (tests/fixtures/chapters.js) beside the real
 * chapters 1 to 3. */
const { runs: golden3Runs, newUi: golden3Ui, SCRIPTS3 } = require('./fixtures/make-ch03-golden.js');
const { compact: goldenCompact } = require('./fixtures/golden.js');
const GOLDEN3 = require('./fixtures/ch03-golden.json');

test('chapters 1 to 3 play exactly as they did before chapter 4’s engine: every frame and what it shows, every skip-count tap by tap, every question, picture, line and help, the Hollow, the book and the cat (tests/fixtures/ch03-golden.json)', () => {
  const S = realStories();
  assert.equal(GOLDEN3.engine, '0.3.0 (chapter 3, 2026-10-06)', 'recorded with the engine chapter 3 shipped with');
  assert.equal(GOLDEN3.runs.length, SCRIPTS3.length);
  const got = golden3Runs(E, [S.ch01, S.ch02, S.ch03], golden3Ui(E));
  got.forEach((r, i) => {
    const now = goldenCompact(r.run), then = GOLDEN3.runs[i].run, name = GOLDEN3.runs[i].name;
    assert.equal(r.name, name);
    assert.deepEqual(now.frames, then.frames, name + ': the same frames, in the same order');
    Object.keys(then.shown).forEach(ch => {
      const a = now.shown[ch].split(' '), b = then.shown[ch].split(' ');
      b.forEach((h, n) => assert.equal(a[n], h, name + ': what ' + ch + ' ' + then.frames[ch][n] + ' shows (its scene, captions, balloons, options, its skip-count tap by tap)'));
    });
    assert.deepEqual(Object.keys(now.lessons), Object.keys(then.lessons), name + ': the same lessons');
    Object.keys(then.lessons).forEach(l => assert.deepEqual(now.lessons[l], then.lessons[l], name + ': ' + l + ', question by question (its picture, its words, its result, its help)'));
    assert.deepEqual(now.hollow, then.hollow, name + ': the Training Hollow, its rounds and its lines');
    assert.deepEqual([now.book, now.cat, now.status], [then.book, then.cat, then.status], name + ': her book, the cat at the end, the status');
  });
  // every chapter-3 path is in there: both chapter 2 paths, told and kept
  const cats = got.map(r => r.run.cat.flags);
  assert.deepEqual([...new Set(cats.map(f => f.ch2Path + '/' + f.ch3Told))].sort(), ['bridge/false', 'bridge/true', 'river/false', 'river/true']);
  assert.ok(got.every(r => !('cards' in r.run.cat) && !('caseFile' in r.run.cat.flags)), 'nothing of chapter 4 in a chapter-3 reading');
});

/* The golden's nine readings never miss four times inside one borrowing Count, and there chapter 4's
 * engine once differed from 0.3.0: its rule that a set borrowing the easiest never lends one of its
 * own questions back the other way round (lesson state `own`) was on for chapter 3's two such sets
 * too, and Sprinkle's dinner (2 × 5), missed once with a borrowed 1 × 5 missed twice and a borrowed
 * 5 × 5 once, asked 5 × 3 a second time where the live game asks 5 × 2. The rule is for a set with
 * an `avoid` list (chapter 4's four); chapter 3's have none. The sequences below are 0.3.0's. */
test('chapter 3’s two borrowing Counts borrow exactly as the live game does, four misses deep: Sprinkle’s dinner still lends 5 × 2; `own` is only for a set with an `avoid` list', () => {
  const S = realStories(), list = [S.ch01, S.ch02, S.ch03, S.ch04].filter(Boolean), ch03 = S.ch03;
  const run = (setId, pattern) => {
    const cat = E.blankCat({ now: 1 });
    cat.finished = { ch01: 1, ch02: 2 }; cat.chapter = 'ch03';
    let r = E.chapterLesson(cat, ch03, 'ch03-claws', 1, list);
    while (!E.counts.done(r.state)) { const q = E.counts.question(r.state); E.logAnswer(cat, E.counts.answer(r.state, E.questionDef(r.def, q, ch03, list), q.answer, 2000, 1).entry); }
    cat.lessons['ch03-claws'] = E.counts.summary(r.state);
    r = E.chapterLesson(cat, ch03, setId, 2, list);
    const out = [];
    for (let i = 0; !E.counts.done(r.state) && i < 40; i++) {
      const q = E.counts.question(r.state), miss = pattern[i] === '1';
      E.logAnswer(cat, E.counts.answer(r.state, E.questionDef(r.def, q, ch03, list), miss ? q.answer + 1 : q.answer, 2000, 2).entry);
      out.push((q.filler ? 'F:' : q.retry ? 'R:' : '') + q.a + 'x' + q.b + (miss ? '✗' : ''));
    }
    return { seq: out.join(' '), state: r.state };
  };
  const dinner = run('ch03-dinner', '1100101000');
  assert.equal(dinner.seq, '2x5✗ F:1x5✗ F:5x3 R:2x5 R:1x5✗ F:4x5 F:5x5✗ R:1x5 F:5x2 R:5x5', 'the ninth question is 5 × 2, as live (never 5 × 3 again)');
  assert.equal(run('ch03-six', '1100101000').seq, '6x5✗ F:1x5✗ F:5x2 R:6x5 R:1x5✗ F:5x3 F:4x5✗ R:1x5 F:5x5 R:4x5');
  assert.equal(run('ch03-dinner', '').seq, '2x5', 'and right the first time it is one question');
  // which sets carry the rule: every borrowing set with an `avoid` list, and no other
  const own = (story, setId) => { const st = E.chapterLesson(E.blankCat({ now: 1 }), story, setId, 1, list).state; return Array.isArray(st.own) && st.own.length > 0; };
  ['ch03-dinner', 'ch03-six'].forEach(id => {
    assert.deepEqual([ch03.counts[id].fillOrder, ch03.counts[id].avoid], ['easiest', undefined], id);
    assert.equal(own(ch03, id), false, id + ': no `own`, so it borrows as 0.3.0 did');
  });
  if (S.ch04) {
    const four = Object.keys(S.ch04.counts).filter(id => S.ch04.counts[id].fillOrder === 'easiest');
    assert.equal(four.length, 4);
    four.forEach(id => { assert.ok((S.ch04.counts[id].avoid || []).length, id + ' has an avoid list'); assert.equal(own(S.ch04, id), true, id + ': never its own question the other way round'); });
  }
});

test('chapters 1 to 3 hand the art exactly what they did: a lesson’s picture, the sand, a skip-count’s picture (the engine’s functions against ui.js 0.3.0’s own, fact by fact)', () => {
  const { oldUi3 } = require('./fixtures/make-ch03-golden.js'), { canon } = require('./fixtures/golden.js');
  const S = realStories(), old = oldUi3(E), list = [S.ch01, S.ch02, S.ch03];
  let pictures = 0, sands = 0, skips = 0;
  list.forEach(story => {
    Object.keys(story.counts).forEach(setId => {
      const cat = E.blankCat({}), { def, state } = E.chapterLesson(cat, story, setId, 1, list);
      // every answer wrong: each fact, its fillers and its retries come round
      for (let guard = 0; guard < 80 && !E.counts.done(state); guard++) {
        const q = E.counts.question(state), D = E.questionDef(def, q, story, list);
        [0, q.lit || 0, q.per, q.groups * q.per].forEach(h => { assert.equal(canon(E.lessonPicture(D, q, h)), canon(old.picture(D, q, h)), setId + ' ' + q.a + '×' + q.b); pictures++; });
        if (q.rightPicture) assert.equal(canon(E.lessonPicture(D, q, 10, q.rightPicture)), canon(old.picture(D, q, 10, q.rightPicture)), setId + ' regrouped');
        const res = E.counts.answer(state, D, q.answer + (guard % 3 ? 1 : 5), 2000, 1), plan = E.helpPlan(def, D, q, res);
        assert.ok(!('pair' in plan) && !('byRow' in plan), setId + ': chapter 4’s keys are for the 10s and for rows hopped by the row');
        [0, plan.step, plan.total].forEach(n => { assert.equal(canon(E.sandOpts(plan, n)), canon(old.sand(plan, res.help, n)), setId + ' sand'); sands++; });
        E.logAnswer(cat, res.entry);
      }
    });
    Object.values(story.frames).filter(f => f.skip).forEach(f => {
      for (let n = 0; n <= f.skip.groups; n++) { assert.equal(canon(E.skipPicture(f.skip, n)), canon(old.skipPicture(f.skip, n))); skips++; }
      assert.equal(canon(E.keptPicture(f.skip)), canon(old.keptPicture(f.skip)));
      const first = (f.say || [])[0], w = E.skipWords(f.skip, first && first.who), was = old.skipWords(f.skip, first && first.who);
      assert.deepEqual([w.teacher, w.whisper, w.label, w.aria, w.prompt], [was.teacher, was.whisper, was.label, was.aria, ''], 'the count’s keeper, the hidden button, the panel’s label; no instruction of its own');
    });
  });
  assert.ok(pictures > 300 && sands > 200 && skips >= 15, 'a real sweep: ' + [pictures, sands, skips]);
});

/* The fixture chapter 4 beside the real chapters 1 to 3 (it borrows chapter 3's claws). */
function story4() {
  const S = realStories(), fx = fixtures();
  return { ch01: S.ch01, ch02: S.ch02, ch03: S.ch03, ch04: fx.ch04, list: [S.ch01, S.ch02, S.ch03, fx.ch04] };
}
/* A cat who has read chapters 1 to 3: `flags` on top of a sneaking, talkative cat who went under the
 * bridge and told; `claws`/`clawsMs`: her answers and times in chapter 3's claws lesson, by fact. */
function cat4(st4, flags, claws, clawsMs) {
  const cat = E.blankCat({ now: 1, id: 'c4' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch3Told: true }, flags || {});
  ['ch01-tails', 'ch02-ears'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  const { def, state } = E.chapterLesson(cat, st4.ch03, 'ch03-claws', 1, st4.list), seen = {};
  while (!E.counts.done(state)) {
    const q = E.counts.question(state), k = q.a + 'x' + q.b, i = seen[k] = (seen[k] || 0) + 1;
    const a = claws && claws[k] && claws[k][i - 1] != null ? claws[k][i - 1] : q.answer;
    E.logAnswer(cat, E.counts.answer(state, E.questionDef(def, q, st4.ch03, st4.list), a, clawsMs && clawsMs[k] != null ? clawsMs[k] : 2000, 1).entry);
  }
  cat.lessons['ch03-claws'] = E.counts.summary(state);
  return cat;
}
const label4 = (b, cat, story) => { require('../app/ui.js'); return PC.ui.speakers.label(b, { cat, story, fill: t => E.fill(t, cat) }); };
/* A lesson's rows, answer by answer, as the page asks it: `answers` by fact ("3x10": [13, 30]: her
 * first answer to it, her second…), `ms` by fact (or `all`). The lesson is recorded at its last answer. */
function lesson4(cat, st4, def, st, answers, ms) {
  const { ch04, list } = st4, seen = {}, out = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), k = q.a + 'x' + q.b;
    const i = seen[k] = (seen[k] || 0) + 1;
    const a = answers && answers[k] && answers[k][i - 1] != null ? answers[k][i - 1] : q.answer;
    const t = ms && ms[k] != null ? ms[k] : (ms && ms.all) || 2000;
    const D = E.questionDef(def, q, ch04, list);
    const prompt = E.promptLines(def, D, q).map(l => Object.assign({}, l, { label: l.who ? label4({ who: l.who }, cat, ch04) : null, text: E.fill(l.text, cat) }));
    const picture = E.lessonPicture(D, q, q.lit || 0);
    const r = E.counts.answer(st, D, a, t, 1);
    E.logAnswer(cat, r.entry);
    const row = { k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, picture, line: E.fill(r.line, cat), kind: r.lineKind,
      balloons: (r.balloons || []).map(b => Object.assign({}, b, { text: E.fill(b.text, cat) })), res: r, teacher: E.teacherOf(def, D) };
    if (!r.correct) { row.help = E.helpPlan(def, D, q, r); row.sand = n => E.sandOpts(row.help, n); }
    out.push(row);
    if (r.done) E.recordLesson(cat, st);
    else cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: ch04.id, state: st };
  }
  return out;
}
function play4(cat, st4, setId, answers, ms) {
  const { def, state } = E.chapterLesson(cat, st4.ch04, setId, 1, st4.list);
  return lesson4(cat, st4, def, state, answers, ms);
}
/* Read the fixture chapter 4 from where she is to its end (or to `stop`, a frame id, before acting on
 * it): what every frame shows her. `choices: { g27: 1 }` picks an option (the first unless it says);
 * `answers`: wrong answers by fact, for every lesson on the way. */
function read4(cat, st4, o) {
  const { ch04, list } = st4, rows = [];
  o = o || {};
  let t = o.t || 1000;
  for (let guard = 0; guard < 300; guard++) {
    const id = E.frameId(cat, ch04), f = ch04.frames[id], kind = E.kindOf(f);
    const row = { id, kind, caps: E.captions(f, cat).map(c => E.fill(c, cat)),
      say: E.balloons(f, cat).map(b => ({ who: b.who, label: label4(b, cat, ch04), text: E.fill(b.text, cat) })),
      cards: E.cardsOn(f, cat, ch04, list), wiggle: E.fileWiggles(cat, ch04, id), file: E.cards(cat, list).map(c => c.id), hasFile: E.hasFile(cat),
      apart: !E.fileNeighbours(E.caseFile(cat, list), 'cant-fly', 'fox-flew'), counts: cat.counts.length };
    rows.push(row);
    if ((o.stop && id === o.stop) || kind === 'end') break;
    t += 10;
    if (kind === 'next' || kind === 'file' || kind === 'skip') assert.ok(E.next(cat, ch04, t), id);
    else if (kind === 'scratch') { row.scratched = []; for (let c; (c = E.scratchTap(cat, ch04, t));) row.scratched.push(c); assert.ok(E.next(cat, ch04, t), id); }
    else if (kind === 'choice') {
      const opts = E.options(f, cat);
      row.options = opts.map(x => E.fill(E.optionLabel(x.option, cat), cat));
      assert.ok(E.choose(cat, ch04, opts[(o.choices && o.choices[id]) || 0].index, t), id);
    } else if (kind === 'input') assert.ok(E.submitInput(cat, ch04, o.dream || '', t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, ch04, f.counts.set, t, list);
      E.beginLesson(cat, ch04, id, r.state);
      row.lesson = lesson4(cat, st4, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, ch04, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* Everything a reading put on screen, as text: captions, balloons with their labels, the options,
 * the cards' lines, and every lesson's words. */
function words4(rows) {
  const out = [];
  rows.forEach(r => {
    out.push(...r.caps, ...r.say.map(b => b.label + ': ' + b.text), ...(r.options || []), ...r.cards.map(c => c.line));
    (r.lesson || []).forEach(l => out.push(...l.prompt.map(p => (p.label || '') + ': ' + p.text), l.line, ...l.balloons.map(b => b.text), l.help ? l.help.intro : ''));
  });
  return out.join('\n');
}
const start4 = (cat, st4) => { E.startChapter(cat, st4.ch04, 500); return cat; };
const frame4 = (rows, id) => rows.find(r => r.id === id);
const COMBOS4 = [];
for (const ch3Told of [true, false]) for (const ch2Path of ['bridge', 'river']) for (const specialty of ['noticing', 'sneaking', 'climbing', 'swimming', 'friends']) {
  for (const worry of ['small', 'water', 'talk', 'shiny']) for (const up of [0, 1]) COMBOS4.push({ ch3Told, ch2Path, specialty, worry, up });
}

test('chapter 4 (the fixture) is sound, and every combination of told or kept, the chapter 2 path, the specialty, the worry and the tower choice reaches the end with no frame that shows nothing', () => {
  const st4 = story4(), { ch04, list } = st4;
  assert.deepEqual(E.checkStory(ch04, list), []);
  assert.equal(COMBOS4.length, 160);
  const lengths = new Set();
  COMBOS4.forEach(c => {
    const cat = start4(cat4(st4, { ch3Told: c.ch3Told, ch2Path: c.ch2Path, specialty: c.specialty, worry: c.worry }), st4);
    const rows = read4(cat, st4, { choices: { g27: c.up } });
    const name = JSON.stringify(c);
    assert.equal(rows[rows.length - 1].id, 'h06', name);
    assert.ok(E.isFinished(cat, 'ch04'), name);
    rows.forEach(r => assert.ok(r.caps.length || r.say.length || r.lesson || ['input', 'end'].includes(r.kind), name + ': ' + r.id + ' shows nothing'));
    assert.deepEqual(Object.keys(cat.lessons).filter(k => /^ch04/.test(k)).sort(), ['ch04-claws', 'ch04-night', 'ch04-pile', 'ch04-tens'].concat(c.up ? [] : ['ch04-riddle']).sort(), name);
    assert.equal(E.status(cat, list), 'Chapter 4 finished');
    lengths.add(rows.length);
  });
  assert.ok(lengths.size >= 4, 'the paths differ in length: ' + [...lengths].sort());
  // the hub, once chapter 3 is finished: chapter 4 is the big button; afterwards chapter 5 is coming soon
  const fresh = cat4(st4);
  assert.equal(E.progress(fresh, list).next.id, 'ch04');
  const done = start4(cat4(st4), st4); read4(done, st4);
  const p = E.progress(done, list);
  assert.deepEqual([p.next, p.soon && p.soon.title, p.latest.id], [null, 'Chapter 5: Riffle’s River', 'ch04']);
});

test('the save: `cards` is new and optional; a save from before chapter 4 migrates with none and nothing else changed; cards go through the store; junk and doubles are dropped', () => {
  const st4 = story4();
  // a chapter-3 save (no `cards` key at all)
  const old = cat4(st4); delete old.cards;
  const save = { version: 2, cats: [clone(old)], current: old.id, settings: { readAloud: true, bigText: false } };
  const m = E.migrate(clone(save));
  assert.deepEqual(m.cats[0].cards, []);
  const rest = clone(m.cats[0]); delete rest.cards;
  assert.deepEqual(rest, clone(old), 'nothing else moved');
  assert.deepEqual(E.migrate(clone(m)), m, 'idempotent');
  // a version-1 save too
  Object.entries(V1SAVES).forEach(([name, v]) => E.migrate(clone(v)).cats.forEach(c => assert.deepEqual(c.cards, [], name)));
  // her cards go through the store, in order
  const cat = start4(cat4(st4, { specialty: 'noticing' }), st4);
  read4(cat, st4);
  const store = E.createStore(memStorage());
  store.save({ version: 2, cats: [cat], current: cat.id, settings: {} });
  const back = store.load().cats[0];
  assert.deepEqual(back.cards, cat.cards);
  assert.equal(back.cards.length, 9);
  assert.deepEqual(Object.keys(back.cards[0]).sort(), ['at', 'chapter', 'id']);
  // junk in, tidy out: no id, a double, a wrong shape
  const junk = clone(cat);
  junk.cards = [{ id: 'tidy', chapter: 'ch04', at: 5 }, null, 'tidy', { id: '' }, { id: 'tidy', at: 9 }, { id: 'scale', chapter: 7, at: 'soon' }, { nope: 1 }];
  assert.deepEqual(E.migrate({ version: 2, cats: [junk] }).cats[0].cards, [{ id: 'tidy', chapter: 'ch04', at: 5 }, { id: 'scale', chapter: null, at: 0 }]);
  junk.cards = 'all of them';
  assert.deepEqual(E.migrate({ version: 2, cats: [junk] }).cats[0].cards, []);
  assert.deepEqual(E.resetCat({ cats: [clone(cat)] }, cat.id, 1).cards, [], 'starting over empties her file');
});

test('sticky flags: a frame’s `sets` is set by reaching it and never unset (Back, a second reading), kept apart from what a choice sets; only a noticing cat ends with ch4CaughtFly', () => {
  const st4 = story4(), { ch04 } = st4;
  for (const specialty of ['noticing', 'sneaking', 'climbing', 'swimming', 'friends']) {
    const cat = start4(cat4(st4, { specialty }), st4);
    const rows = read4(cat, st4);
    assert.equal(cat.flags.ch4CaughtFly, specialty === 'noticing' ? true : undefined, specialty);
    assert.equal(!!frame4(rows, 'g15'), specialty === 'noticing', 'the catch is a screen of a noticing cat’s own');
    assert.equal(E.matches({ ch4CaughtFly: false }, cat), specialty !== 'noticing', 'false matches a flag never set');
  }
  // Back from the frame that set it, and on past it: still set
  const cat = start4(cat4(st4, { specialty: 'noticing' }), st4);
  read4(cat, st4, { stop: 'g15' });
  assert.equal(cat.flags.ch4CaughtFly, true, 'set on arriving');
  while (cat.frame !== 'g11') assert.ok(E.back(cat, ch04));
  assert.equal(cat.flags.ch4CaughtFly, true, 'Back never takes it away');
  // a choice's flags are replaced by Back and a new pick; a frame's are not a choice's to set
  const bad = clone(ch04);
  bad.frames.g16.choice.options[0].sets = { ch4CaughtFly: false };
  assert.match(E.checkStory(bad, st4.list).join('\n'), /g16 option 0: sets ch4CaughtFly, which frame g15 sets for good/);
  bad.frames.g16.choice.options[0].sets = {};
  bad.frames.g15.sets = ['ch4CaughtFly'];
  assert.match(E.checkStory(bad, st4.list).join('\n'), /g15: sets is an object of flags/);
  // debug jumps arrive too (tools/shots.mjs): E.go sets what the frame sets
  const jump = cat4(st4); E.startChapter(jump, ch04, 1); E.go(jump, ch04, 'r06', 2);
  assert.equal(jump.flags.foundSquall, true);
});

/* ------------------------------------------------ the Case File: its data */
test('the Case File: a frame’s `card` goes into her file once, in order (Back never takes it away, a second reading never gives it twice); 7 cards, 8 for a noticing cat or one who found Squall, 9 for both; `cant-fly` on both paths', () => {
  const st4 = story4(), { ch04, list } = st4;
  const ORDER = ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'squall-shapes', 'sprinkle-scales', 'cant-fly'];
  const want = (noticing, found) => ORDER.filter(id => (id !== 'dug-earth' || noticing) && (id !== 'squall-shapes' || found));
  for (const ch3Told of [true, false]) for (const noticing of [false, true]) for (const up of [0, 1]) {
    const cat = start4(cat4(st4, { ch3Told, specialty: noticing ? 'noticing' : 'friends' }), st4);
    const rows = read4(cat, st4, { choices: { g27: up } });
    const name = JSON.stringify({ ch3Told, noticing, up });
    assert.deepEqual(cat.cards.map(c => c.id), want(noticing, !up), name);
    assert.equal(cat.cards.length, 7 + (noticing ? 1 : 0) + (up ? 0 : 1), name + ': 7, 8, 8 and 9');
    assert.ok(cat.cards.every(c => c.chapter === 'ch04' && c.at > 0), 'each card remembers its chapter and when');
    assert.deepEqual(cat.cards.map(c => c.at), cat.cards.map(c => c.at).slice().sort((a, b) => a - b), 'in the order found');
    assert.deepEqual(E.cards(cat, list).map(c => c.id), want(noticing, !up), name + ': and her file shows them all');
    assert.ok(E.hasCard(cat, 'cant-fly'), name + ': the wing, told or kept');
    assert.equal(cat.flags.caseFile, true, 'her first card is where the file begins');
    // her first card comes on the frame the first tap turns to; the wing in her nest, at night
    assert.deepEqual([frame4(rows, 'g19').file, frame4(rows, 'g20').file], [[], ['four-a-night']]);
    assert.ok(!frame4(rows, 'h01') || !frame4(rows, 'h01').file.includes('cant-fly'));
    assert.ok(frame4(rows, 'h02').file.includes('cant-fly'));
    // a second reading gives nothing twice
    const before = clone(cat.cards);
    E.startChapter(cat, ch04, 9000);
    read4(cat, st4, { choices: { g27: 1 }, t: 9000 });
    assert.deepEqual(cat.cards, before, name + ': read again, the same cards');
  }
  // Back never takes a card away, and coming forward again never doubles it
  const cat = start4(cat4(st4), st4);
  read4(cat, st4, { stop: 'g24' });
  assert.deepEqual(cat.cards.map(c => c.id), ['four-a-night', 'tidy', 'scale', 'fox-flew', 'fox-moon']);
  while (cat.frame !== 'g19') assert.ok(E.back(cat, ch04));
  assert.equal(cat.cards.length, 5);
  read4(cat, st4, { stop: 'g24' });
  assert.equal(cat.cards.length, 5);
  // giving by hand: once
  assert.equal(E.giveCard(cat, 'tidy', 'ch04', 5), false);
  assert.equal(E.giveCard(cat, '', 'ch04', 5), false);
  assert.equal(E.giveCard(null, 'tidy'), false);
});

test('the Case File: E.cards returns each card with its definition; one whose definition is gone is skipped, never an error; `answers` is stored; a card’s picture is its id unless it says', () => {
  const st4 = story4(), { ch04, list } = st4;
  const cat = start4(cat4(st4, { specialty: 'noticing' }), st4);
  read4(cat, st4);
  const cards = E.cards(cat, list);
  assert.deepEqual(cards.map(c => [c.id, c.mark]), [['four-a-night', 'eye'], ['tidy', 'eye'], ['dug-earth', 'eye'], ['scale', 'eye'], ['fox-flew', 'ear'], ['fox-moon', 'ear'],
    ['squall-shapes', 'ear'], ['sprinkle-scales', 'eye'], ['cant-fly', 'eye']]);
  assert.deepEqual(cards.map(c => c.line), ['Four gone every night.', 'The thief leaves the pile tidy.', 'Freshly dug earth behind the pile.', 'The ‘scale’ is smooth, like glass.',
    'The fox says it FLEW.', 'The fox says the MOON was out on the storm night.', 'Squall says two skinny shapes carry something to the tracks.', 'Sprinkle’s scales are grey and bumpy.', 'Sprinkle can’t fly.']);
  assert.deepEqual(cards.map(c => c.picture), cards.map(c => c.id), 'the art’s key is the card’s id');
  assert.deepEqual(cards.find(c => c.id === 'fox-flew').answers, ['cant-fly'], 'for chapter 10: the cards that answer a claim');
  assert.deepEqual(cards.find(c => c.id === 'fox-moon').answers, [], 'the no-moon card is a later chapter’s');
  assert.ok(cards.every(c => c.shown && c.chapter === 'ch04'));
  // a picture of its own
  const own = clone(ch04); own.cards.tidy.picture = 'two-rows';
  assert.equal(E.cards(cat, [own]).find(c => c.id === 'tidy').picture, 'two-rows');
  // a definition gone (the story was edited), a card from nowhere, a chapter that isn't loaded
  const gone = clone(ch04); delete gone.cards.tidy;
  assert.deepEqual(E.cards(cat, [gone]).map(c => c.id), cards.map(c => c.id).filter(id => id !== 'tidy'));
  cat.cards.push({ id: 'made-up', chapter: 'ch09', at: 1 });
  assert.equal(E.cards(cat, list).length, 9);
  assert.deepEqual(E.cards(cat, [st4.ch01]), [], 'no chapter that defines them: an empty file, no error');
  assert.deepEqual(E.cards(null, list), []);
  assert.deepEqual(E.cards(E.blankCat({}), list), []);
  // E.cardDef: this chapter's first, then any chapter's
  assert.equal(E.cardDef('scale', ch04).line, 'The ‘scale’ is smooth, like glass.');
  assert.equal(E.cardDef('scale', st4.ch01, list).mark, 'eye');
  assert.equal(E.cardDef('nope', ch04, list), null);
});

test('a card shown under its panel: its picture, its mark and its line; her first card’s line is her balloon, so it is lettered once, and it has no mark yet', () => {
  const st4 = story4(), { ch04, list } = st4;
  const cat = start4(cat4(st4, { specialty: 'noticing' }), st4);
  const rows = read4(cat, st4);
  const on = id => frame4(rows, id).cards;
  assert.deepEqual(on('g20'), [{ id: 'four-a-night', mark: 'eye', line: 'Four gone every night.', picture: 'four-a-night', showLine: false, showMark: false }],
    'her first card: the line is her balloon, and Tallyheart has not given the eye its rule yet');
  assert.ok(frame4(rows, 'g20').say.some(b => b.who === 'player' && b.text === 'Four gone every night.'));
  assert.deepEqual(on('g23a').map(c => [c.id, c.mark, c.showLine, c.showMark]), [['fox-flew', 'ear', true, true]]);
  assert.deepEqual(on('g24').map(c => [c.id, c.line, c.showLine]), [['fox-moon', 'The fox says the MOON was out on the storm night.', true]]);
  assert.deepEqual(on('r05').map(c => c.id), ['squall-shapes'], 'shown on the frame that gives it, before the flag');
  assert.deepEqual(on('b03').map(c => c.id), ['sprinkle-scales']);
  assert.deepEqual(on('h02').map(c => [c.id, c.mark]), [['cant-fly', 'eye']]);
  assert.deepEqual(on('g21'), [], 'the row of bark gives its cards tap by tap, not on arriving');
  assert.ok(rows.filter(r => !['g20', 'g23a', 'g24', 'r05', 'b03', 'h02'].includes(r.id)).every(r => !r.cards.length));
  // a line a caption says, quotes and stars and all, is not lettered twice either; `line: false` says so outright
  const s = clone(ch04);
  s.frames.g24.caption = ['“The fox says the **MOON** was out on the storm night.”'];
  assert.equal(E.cardsOn(s.frames.g24, cat, s, list)[0].showLine, false);
  s.frames.b03.card = [{ id: 'sprinkle-scales', line: false }, { id: 'dug-earth', when: { specialty: 'friends' } }, 'made-up'];
  assert.deepEqual(E.cardsOn(s.frames.b03, cat, s, list).map(c => [c.id, c.showLine]), [['sprinkle-scales', false]], 'an entry that is not hers, and a card nobody defines, are left out');
});

test('a card she already holds, laid beside the new one (`held: true`): shown under the panel when she holds it, never given, never a wiggle of its own', () => {
  const st4 = story4(), { ch04, list } = st4;
  const s = clone(ch04);
  s.frames.h02.card = ['cant-fly', { id: 'fox-flew', when: { specialty: 'noticing' }, held: true }];
  assert.deepEqual(E.checkStory(s, list), E.checkStory(ch04, list), 'a held entry is sound');
  // she holds the fox's card: both lie under the panel, the new one first; only the wing is given
  const cat = E.blankCat({ now: 1 });
  cat.flags.specialty = 'noticing';
  E.giveCard(cat, 'fox-flew', 'ch04', 5);
  assert.deepEqual(E.frameCards(s.frames.h02, cat).map(c => c.id), ['cant-fly', 'fox-flew']);
  assert.deepEqual(E.frameGives(s.frames.h02, cat).map(c => c.id), ['cant-fly']);
  assert.deepEqual(E.cardsOn(s.frames.h02, cat, s, list).map(c => [c.id, c.mark, c.showLine, c.showMark, c.held]),
    [['cant-fly', 'eye', true, true, undefined], ['fox-flew', 'ear', true, true, true]]);
  // a cat it is not for, and a cat who does not hold it (a jump in the dev tools): the wing alone, and nothing given her
  const other = E.blankCat({ now: 1 }); other.flags.specialty = 'friends'; E.giveCard(other, 'fox-flew', 'ch04', 5);
  assert.deepEqual(E.cardsOn(s.frames.h02, other, s, list).map(c => c.id), ['cant-fly']);
  const without = E.blankCat({ now: 1 }); without.flags.specialty = 'noticing';
  assert.deepEqual(E.cardsOn(s.frames.h02, without, s, list).map(c => c.id), ['cant-fly']);
  assert.deepEqual(E.frameGives(s.frames.h02, without).map(c => c.id), ['cant-fly'], 'reaching the frame would not give the held card');
  // played: reaching the frame gives the wing and leaves the fox's card where it was in her file
  const st = Object.assign({}, st4, { ch04: s, list: st4.list.map(x => (x.id === 'ch04' ? s : x)) });
  const pl = start4(cat4(st, { specialty: 'noticing' }), st);
  const rows = read4(pl, st);
  assert.deepEqual(frame4(rows, 'h02').cards.map(c => [c.id, !!c.held]), [['cant-fly', false], ['fox-flew', true]]);
  assert.equal(pl.cards.filter(c => c.id === 'fox-flew').length, 1);
  assert.ok(pl.cards.findIndex(c => c.id === 'fox-flew') < pl.cards.findIndex(c => c.id === 'cant-fly'), 'in the order found, as before');
  // a frame whose every card is held gives nothing: no wiggle of the button, and checkStory says so
  const none = clone(ch04); none.frames.h02.card = [{ id: 'fox-flew', held: true }];
  assert.ok(E.checkStory(none, list).some(e => /h02: every card is held/.test(e)));
  const holder = E.blankCat({ now: 1 }); holder.flags.caseFileOpen = true; E.giveCard(holder, 'fox-flew', 'ch04', 5);
  assert.equal(E.fileWiggles(holder, none, 'h02'), false);
  assert.equal(E.fileWiggles(holder, s, 'h02'), true, 'the wing still makes it wiggle');
  // `held` is true or absent, and belongs on a frame's card: not on a row of bark
  const bad = clone(ch04); bad.frames.h02.card = ['cant-fly', { id: 'fox-flew', held: 'yes' }];
  assert.ok(E.checkStory(bad, list).some(e => /h02: card fox-flew: held is true/.test(e)));
  const row = clone(ch04); row.frames.g21.scratch.cards = row.frames.g21.scratch.cards.concat([{ id: 'fox-flew', held: true }]);
  assert.ok(E.checkStory(row, list).some(e => /g21 scratch: card fox-flew: held is true, on a frame’s card only/.test(e)));
});

test('a card with a `when` is in her file only while it matches, and on the frame that gives it: Back from any roof frame before the last, then “Not today”, leaves no foundSquall, no Squall page and no squall-shapes card, and nothing afterwards says “Squall”', () => {
  const st4 = story4(), { ch04, list } = st4;
  for (const specialty of ['climbing', 'friends']) for (const from of ['r01', 'r02', 'r03', 'r04', 'r05']) {
    if (specialty === 'climbing' && from === 'r01') continue;   // a climber has no elevator screen
    const cat = start4(cat4(st4, { specialty, ch3Told: false }), st4);
    const up = read4(cat, st4, { choices: { g27: 0 }, stop: from });
    assert.equal(up[up.length - 1].id, from);
    if (from === 'r05') {
      assert.ok(E.hasCard(cat, 'squall-shapes'), 'given on the roof');
      assert.ok(E.cards(cat, list).some(c => c.id === 'squall-shapes'), 'on the card’s own frame her file shows it going in');
      assert.ok(E.caseFile(cat, list).groups[1].cards.some(c => c.id === 'squall-shapes'));
    }
    while (cat.frame !== 'g27') assert.ok(E.back(cat, ch04), from);
    assert.deepEqual(E.options(ch04.frames.g27, cat).map(o => E.optionLabel(o.option, cat)), ['Go up and find him. Right now.', 'Not today. Sprinkle first.'], 'she has not met him: the first reading’s words');
    assert.ok(!E.cards(cat, list).some(c => c.id === 'squall-shapes'), from + ': back at the choice, the card is out of her file');
    const rest = read4(cat, st4, { choices: { g27: 1 } });
    const name = specialty + ', back from ' + from;
    assert.equal(rest[rest.length - 1].id, 'h06', name);
    assert.ok(!('foundSquall' in cat.flags), name + ': no flag (never false: just not set)');
    assert.ok(!E.dragonets(cat, list).found.some(d => d.id === 'squall'), name + ': no page in her book');
    assert.ok(!E.cards(cat, list).some(c => c.id === 'squall-shapes'), name + ': no card in her file, whatever the save holds');
    assert.equal(E.hasCard(cat, 'squall-shapes'), from === 'r05', name + ': (the save holds it only if she reached its frame)');
    assert.ok(rest.every(r => !r.file.includes('squall-shapes')), name);
    assert.doesNotMatch(words4(rest), /Squall/, name + ': his name is never on screen for her');
    assert.match(words4(rest), /Your littlest brother is still roaring\./);
    assert.match(words4(rest), /Sprinkle’s littlest brother is still up there\. You’ll go up another day\./);
    assert.ok(!E.buildBook(ch04, cat).recap.some(l => /Squall/.test(l)), name + ': nor in her book’s recap');
    assert.deepEqual(E.resolveScene(ch04.frames.h03.scene, cat, list).opts.bark, E.cards(cat, list).map(c => ({ picture: c.picture, mark: c.mark })), 'her nest shows the cards her file shows, card for card');
    assert.ok(!E.resolveScene(ch04.frames.h03.scene, cat, list).opts.bark.some(c => c.picture === 'squall-shapes'), name + ': and never Squall’s');
    // the day she does finish the scene, the card she was given is there again
    if (from === 'r05') {
      E.startChapter(cat, ch04, 7000);
      const again = read4(cat, st4, { choices: { g27: 0 }, t: 7000 });
      assert.equal(cat.flags.foundSquall, true);
      assert.ok(frame4(again, 'b01').file.includes('squall-shapes'));
      assert.equal(cat.cards.filter(c => c.id === 'squall-shapes').length, 1, 'given once');
    }
  }
});

test('a card given a page before the frame that sets its flag stays in her file on the pages between (the real roof has one: “Come down with me?”); Back past the frame that gave it takes it out again', () => {
  const st = story4();
  // the roof with a page between the card's frame and the flag's, as chapter 4 built it
  st.ch04 = clone(st.ch04);
  st.ch04.frames.r05.next = 'r05b';
  st.ch04.frames.r05b = { say: [{ who: 'player', text: 'Come down with me?' }], next: 'r06' };
  st.list = st.list.map(s => (s.id === 'ch04' ? st.ch04 : s));
  assert.deepEqual(E.checkStory(st.ch04, st.list), []);
  const { ch04, list } = st, has = cat => E.cards(cat, list).some(c => c.id === 'squall-shapes');
  const cat = start4(cat4(st), st);
  const rows = read4(cat, st, { choices: { g27: 0 }, stop: 'r06' });
  assert.deepEqual(['r04', 'r05', 'r05b', 'r06'].map(id => frame4(rows, id).file.includes('squall-shapes')), [false, true, true, true], 'on its own frame, on the page after it, and from the flag on');
  // on the page between, before any flag: in her file, in her nest's row, and counted
  const mid = start4(cat4(st), st);
  read4(mid, st, { choices: { g27: 0 }, stop: 'r05b' });
  assert.ok(!('foundSquall' in mid.flags) && has(mid), 'no flag yet, and the card she just watched go in is there');
  assert.ok(E.caseFile(mid, list).groups[1].cards.some(c => c.id === 'squall-shapes'));
  // Back to the frame that gave it: still there; Back past it: gone; forward again: back
  assert.ok(E.back(mid, ch04) && mid.frame === 'r05' && has(mid));
  assert.ok(E.back(mid, ch04) && mid.frame === 'r04' && !has(mid), 'the frame that gave it is no longer behind her');
  assert.ok(E.next(mid, ch04, 2000) && mid.frame === 'r05' && has(mid));
  // and all the way back to the choice, then “Not today”: nowhere, for the rest of the chapter
  while (mid.frame !== 'g27') assert.ok(E.back(mid, ch04));
  const rest = read4(mid, st, { choices: { g27: 1 } });
  assert.ok(rest.every(r => !r.file.includes('squall-shapes')) && E.hasCard(mid, 'squall-shapes'), 'held in the save, shown nowhere');
  // a card without a `when` never needed any of this, and another chapter's history is not this one's
  const other = start4(cat4(st), st);
  read4(other, st, { choices: { g27: 0 }, stop: 'r05b' });
  other.chapter = 'ch03';
  assert.ok(!has(other), 'the frames behind her are the chapter’s she is reading');
});

test('finding Squall: the flag comes from the roof scene’s last frame; Back after it, and a second reading with “Not today”, keep the flag, his page and the card; a cat who never went up has none of the three; a cat who has met him reads “Go up and see Squall again.”', () => {
  const st4 = story4(), { ch04, list } = st4;
  // never went up
  const no = start4(cat4(st4), st4);
  read4(no, st4, { choices: { g27: 1 } });
  assert.deepEqual(['foundSquall' in no.flags, E.dragonets(no, list).found.map(d => d.id), E.hasCard(no, 'squall-shapes')], [false, ['sprinkle'], false]);
  assert.equal(E.dragonets(no, list).toFind, 6);
  // went up: not yet on the frame before the last, set on the last (the forepaw Tap), before she taps
  const cat = start4(cat4(st4), st4);
  read4(cat, st4, { choices: { g27: 0 }, stop: 'r05' });
  assert.ok(!('foundSquall' in cat.flags), 'not on reaching the roof, nor on hearing his name');
  assert.equal(E.dragonets(cat, list).found.length, 1);
  read4(cat, st4, { stop: 'r06' });
  assert.equal(cat.flags.foundSquall, true);
  assert.deepEqual(E.dragonets(cat, list).found.map(d => [d.id, d.name, d.chapter]), [['sprinkle', 'Sprinkle', 'ch03'], ['squall', 'Squall', 'ch04']], 'his page, once found, though chapter 4 is not finished');
  assert.equal(E.dragonets(cat, list).toFind, 5);
  assert.match(E.dragonets(cat, list).found[1].lines[1], /^Moonpaw found him on the roof/);
  // Back past the last roof frame to the choice: all three stay, and the choice knows she has met him
  while (cat.frame !== 'g27') assert.ok(E.back(cat, ch04));
  assert.equal(cat.flags.foundSquall, true, 'Back never unsets it');
  assert.deepEqual(E.options(ch04.frames.g27, cat).map(o => E.optionLabel(o.option, cat)), ['Go up and see Squall again.', 'Not today. He’s guarding.']);
  const rest = read4(cat, st4, { choices: { g27: 1 } });
  assert.deepEqual(frame4(rest, 'g27').options, ['Go up and see Squall again.', 'Not today. He’s guarding.']);
  assert.equal(cat.choices['ch04:g27'].label, 'Not today. He’s guarding.', 'her choice is remembered in the words she read');
  assert.ok(frame4(rest, 'n01'), 'she took “Not today” this time');
  assert.ok(E.cards(cat, list).some(c => c.id === 'squall-shapes') && E.dragonets(cat, list).found.length === 2 && cat.flags.foundSquall === true);
  // what later screens read is the flag, not this reading's choice
  assert.match(words4(rest), /I found your littlest brother\. He says: five\./);
  assert.ok(frame4(rest, 'b02') && frame4(rest, 'b07'), 'Sprinkle’s “Five and five”, and the lead told to her friends');
  assert.match(words4(rest), /Goodnight, Squall\./);
  assert.ok(E.buildBook(ch04, cat).recap.some(l => /found Squall, the littlest dragonet/.test(l)));
  // a second reading, “Not today” again: still all three
  E.startChapter(cat, ch04, 8000);
  const second = read4(cat, st4, { choices: { g27: 1 }, t: 8000 });
  assert.equal(second[second.length - 1].id, 'h06');
  assert.ok(cat.flags.foundSquall === true && E.cards(cat, list).some(c => c.id === 'squall-shapes') && E.dragonets(cat, list).found.some(d => d.id === 'squall'));
  // Sprinkle's page needs its chapter finished, as before; a dragonet with a `when` needs only that
  const early = E.blankCat({}); early.flags.foundSquall = true;
  assert.deepEqual(E.dragonets(early, list).found.map(d => d.id), ['squall']);
  const bad = clone(ch04); bad.book.dragonet = [{ id: 'squall', name: 'Squall', when: 'found' }, { id: 'gale' }];
  assert.match(E.checkStory(bad, list).join('\n'), /book\.dragonet squall: when must be an object[\s\S]*book\.dragonet needs an id and a name/);
});

test('an option’s label for a cat it matches (labelWhen): the first variant that matches wins, the plain label otherwise; chapters 1 to 3 have none', () => {
  const cat = E.blankCat({});
  const opt = { label: 'Go up.', labelWhen: [{ when: { foundSquall: true, specialty: 'climbing' }, label: 'Climb up to Squall again.' }, { when: { foundSquall: true }, label: 'Go up and see {name} again.' }], next: 'x' };
  assert.equal(E.optionLabel(opt, cat), 'Go up.');
  cat.flags.foundSquall = true;
  assert.equal(E.optionLabel(opt, cat), 'Go up and see {name} again.', 'tokens are left for the page');
  cat.flags.specialty = 'climbing';
  assert.equal(E.optionLabel(opt, cat), 'Climb up to Squall again.');
  assert.equal(E.optionLabel({ label: 'Plain.' }, cat), 'Plain.');
  assert.equal(E.optionLabel(null, cat), '');
  const S = realStories();
  [S.ch01, S.ch02, S.ch03].forEach(s => Object.values(s.frames).forEach(f => ((f.choice && f.choice.options) || []).forEach(o => {
    assert.ok(!('labelWhen' in o));
    assert.equal(E.optionLabel(o, cat), o.label);
  })));
  const { ch04, list } = story4(), bad = clone(ch04);
  bad.frames.g27.choice.options[0].labelWhen = [{ label: 'No when.' }];
  delete bad.frames.g27.choice.options[1].label;
  assert.match(E.checkStory(bad, list).join('\n'), /g27 option 0: labelWhen 0 is \{ when, label \}[\s\S]*g27 option 1: labelWhen needs a plain label beside it/);
});

/* ------------------------------------------------ the Case File: its screen */
test('the Case File’s screen: two groups, each in the order found; the claims first on a narrow screen; `cant-fly` and `fox-flew` are never neighbours without ch4CaughtFly, and are drawn touching with it', () => {
  const st4 = story4(), { ch04, list } = st4;
  const ids = g => g.cards.map(c => c.id);
  // every combination, at every frame of the reading: apart until she has made the link
  COMBOS4.filter(c => c.worry === 'talk' && c.ch2Path === 'bridge').forEach(c => {
    const cat = start4(cat4(st4, { ch3Told: c.ch3Told, specialty: c.specialty }), st4);
    const rows = read4(cat, st4, { choices: { g27: c.up } }), name = JSON.stringify(c);
    const F = E.caseFile(cat, list);
    assert.equal(F.title, 'Moonpaw’s Case File');
    assert.deepEqual(F.groups.map(g => [g.mark, g.title]), [['eye', 'What I saw myself'], ['ear', 'What I was told (to check)']]);
    assert.deepEqual(F.narrow, ['ear', 'eye'], 'one above the other: the claims first');
    assert.equal(F.count, cat.cards.length);
    if (c.specialty !== 'noticing') {
      assert.ok(rows.every(r => r.apart), name + ': never neighbours, at any frame');
      assert.deepEqual(F.links, []);
      assert.deepEqual(ids(F.groups[0]), ['four-a-night', 'tidy', 'scale', 'sprinkle-scales', 'cant-fly']);
      assert.deepEqual(ids(F.groups[1]), ['fox-flew', 'fox-moon'].concat(c.up ? [] : ['squall-shapes']));
      assert.equal(E.fileNeighbours(F, 'cant-fly', 'fox-flew'), false);
    } else {
      // a noticing cat made the link at the border: once she holds both, they touch, across the groups
      assert.deepEqual(F.links.map(l => [ids(l), l.line]), [[['cant-fly', 'fox-flew'], 'They can’t both be true.']], name);
      assert.ok(!ids(F.groups[0]).includes('cant-fly') && !ids(F.groups[1]).includes('fox-flew'), 'they leave their groups');
      assert.deepEqual(ids(F.groups[0]), ['four-a-night', 'tidy', 'dug-earth', 'scale', 'sprinkle-scales']);
      assert.equal(E.fileNeighbours(F, 'cant-fly', 'fox-flew'), true);
      // before she holds the wing there is nothing to touch: FLEW sits in its group
      const mid = rows.find(r => r.id === 'g26');
      assert.ok(mid.file.includes('fox-flew') && !mid.file.includes('cant-fly') && mid.apart);
    }
  });
  // the same cards, without the flag and with it
  const cat = start4(cat4(st4, { specialty: 'friends' }), st4);
  read4(cat, st4);
  assert.equal(E.caseFile(cat, list).links.length, 0);
  cat.flags.ch4CaughtFly = true;   // (chapter 7 never sets it: it sets its own ch7Flew, which the link reads too)
  assert.deepEqual(E.caseFile(cat, list).links[0].cards.map(c => c.id), ['cant-fly', 'fox-flew']);
  // what "neighbours" means, on made-up files: side by side on a wide screen (three across), one above the other on a narrow one (two across)
  const file = (eyes, ears) => ({ groups: [{ mark: 'eye', cards: eyes.map(id => ({ id })) }, { mark: 'ear', cards: ears.map(id => ({ id })) }], links: [] });
  assert.equal(E.fileNeighbours(file(['a', 'b', 'wing'], ['flew', 'x']), 'wing', 'flew'), true, 'the wing ends the first row of what she saw, FLEW starts the first row of what she was told');
  assert.equal(E.fileNeighbours(file(['wing'], ['flew']), 'wing', 'flew'), true, 'her only two cards');
  assert.equal(E.fileNeighbours(file(['a', 'b', 'c', 'd', 'wing'], ['flew', 'x']), 'wing', 'flew'), false, 'chapter 4: the wing is on the second row');
  assert.equal(E.fileNeighbours(file(['wing', 'b', 'c', 'd'], ['x', 'flew']), 'wing', 'flew'), true, 'narrow: the last claim, then the first thing she saw');
  assert.equal(E.fileNeighbours(file(['a', 'b', 'c', 'wing'], ['x', 'y', 'flew']), 'a', 'flew'), true, 'narrow, the same column: the last row of claims over the first row of what she saw');
  assert.equal(E.fileNeighbours(file(['a', 'b', 'c', 'wing'], ['x', 'y', 'flew']), 'b', 'flew'), false);
  assert.equal(E.fileNeighbours(file(['a', 'b', 'c', 'wing'], ['x', 'y', 'flew']), 'a', 'x'), false, 'a row of claims lies between them');
  assert.equal(E.fileNeighbours(file(['a', 'b', 'c', 'd'], ['x']), 'a', 'b'), true, 'in one group, side by side');
  assert.equal(E.fileNeighbours(file(['a', 'b', 'c', 'd'], ['x']), 'a', 'd'), true, 'in one group, one above the other (three across)');
  assert.equal(E.fileNeighbours(file(['a', 'b', 'c', 'd', 'e', 'f', 'g'], ['x']), 'a', 'g'), false);
  assert.equal(E.fileNeighbours(file(['a'], ['x']), 'a', 'nope'), false);
  // E.FILE_COLS is what the page's CSS lays out: three across, two on a phone
  const html = require('fs').readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
  assert.deepEqual(E.FILE_COLS, { wide: 3, narrow: 2 });
  assert.match(html, /\.cf-cards\{display:grid;grid-template-columns:repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(html, /@media \(max-width: 520px\)\{\s*\.cf-cards\{grid-template-columns:repeat\(2, minmax\(0, 1fr\)\)\}/);
  assert.match(html, /\.cf-groups\{display:grid;grid-template-columns:minmax\(0,1fr\);grid-template-areas:"ear" "link" "eye"/, 'one above the other, the claims first');
  assert.match(html, /@media \(min-width: 960px\)\{\s*\.cf-groups\{grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\);grid-template-areas:"eye ear" "link link"\}/, 'side by side on a wide screen');
  assert.match(html, /\.cf-groups\.linked\{[^}]*grid-template-areas:"eye link ear"\}/, 'and two linked cards lie between the groups, one from each side');
  // a link needs its `when` to match and both cards held; its line has a default; a claim never links to itself
  const s = clone(ch04);
  delete s.cards['fox-flew'].link.line;
  s.cards['fox-moon'].answers = ['fox-moon', 'no-moon']; s.cards['fox-moon'].link = {};
  const F2 = E.caseFile(cat, [s]);
  assert.deepEqual(F2.links.map(l => [l.cards.map(c => c.id), l.line]), [[['cant-fly', 'fox-flew'], 'They can’t both be true.']]);
  assert.equal(E.markMeans('eye'), 'I saw this myself.');
  assert.equal(E.markMeans('ear'), 'Somebody told me. A thing to check.');
  assert.deepEqual(E.caseFile(E.blankCat({}), list).groups.map(g => g.cards), [[], []], 'an empty file is two empty groups, never an error');
});

test('the “Skritch” frame (`file`): her Case File’s button appears there for good; before it no frame makes it wiggle; after it every frame that gives a card does, once; opening and closing change nothing', () => {
  const st4 = story4(), { ch04, list } = st4;
  const cat = start4(cat4(st4, { specialty: 'noticing' }), st4);
  const rows = read4(cat, st4);
  const before = rows.slice(0, rows.findIndex(r => r.id === 'g26')), after = rows.slice(rows.findIndex(r => r.id === 'g26') + 1);
  assert.ok(before.every(r => !r.hasFile && !r.wiggle), 'no button, so nothing wiggles: her first six cards go in unannounced');
  assert.ok(before.filter(r => r.cards.length).length >= 3);
  const g26 = frame4(rows, 'g26');
  assert.deepEqual([g26.kind, g26.hasFile, g26.wiggle], ['file', true, false], 'on the frame itself the button glows; it does not wiggle');
  assert.deepEqual(E.tapWords(ch04.frames.g26), { prompt: '**Tap** your Case File. You can open it any time.', label: 'Open your Case File' });
  assert.deepEqual(E.exits(ch04.frames.g26), ['g27']);
  assert.ok(after.every(r => r.hasFile));
  assert.deepEqual(after.filter(r => r.wiggle).map(r => r.id), ['r05', 'b03', 'h02'], 'the roof’s card, Sprinkle’s scales, the wing');
  assert.deepEqual(after.filter(r => r.wiggle).map(r => r.id), after.filter(r => r.cards.length).map(r => r.id));
  // the flag is the engine's own, set by reaching the frame, kept through Back and through the store
  assert.equal(cat.flags.caseFileOpen, true);
  const c2 = start4(cat4(st4), st4);
  read4(c2, st4, { stop: 'g26' });
  assert.equal(E.hasFile(c2), true);
  const snap = JSON.stringify(c2);
  // opening it is looking: E.caseFile and E.cards change nothing, log nothing
  E.caseFile(c2, list); E.cards(c2, list, { all: true });
  assert.equal(JSON.stringify(c2), snap);
  assert.ok(E.back(c2, ch04));
  assert.equal(E.hasFile(c2), true, 'Back from the frame keeps the button');
  assert.equal(E.hasFile(E.migrate({ version: 2, cats: [clone(c2)] }).cats[0]), true);
  assert.equal(E.hasFile(E.blankCat({})), false);
  assert.equal(E.hasFile(null), false);
  // a second reading: the button is there from the first page, so her first cards' frames wiggle it too
  E.startChapter(cat, ch04, 9000);
  const again = read4(cat, st4, { t: 9000 });
  assert.ok(frame4(again, 'g20').wiggle && frame4(again, 'g24').wiggle && !frame4(again, 'g26').wiggle);
  // closing it goes on to `next`; a prompt of its own; the shapes checkStory refuses
  const s = clone(ch04);
  s.frames.g26.file.prompt = '**Tap** the curl of bark.';
  assert.equal(E.tapWords(s.frames.g26).prompt, '**Tap** the curl of bark.');
  s.frames.g26.file = { next: 'nowhere', prompt: 7 };
  assert.match(E.checkStory(s, list).join('\n'), /g26 -> missing nowhere[\s\S]*g26: file is \{ next, prompt\? \}/);
});

test('the bark Taps (`scratch`): two pieces of bark, three for a noticing cat, her first card at the head of the row; each tap gives the next card; the row picks up where she left it; her first tap scratches a curl and gives nothing', () => {
  const st4 = story4(), { ch04, list } = st4;
  const piecesOf = (cat) => E.scratchPieces(ch04.frames[cat.frame], cat, ch04, list).map(p => p.id + (p.head ? ' (head)' : '') + (p.draws ? ' (draws)' : '') + (p.done ? ' ✓' : ''));
  for (const noticing of [false, true]) {
    const cat = start4(cat4(st4, { specialty: noticing ? 'noticing' : 'swimming' }), st4);
    // her first tap: one curl, the row scratched into it, no card; the frame it turns to gives the card
    read4(cat, st4, { stop: 'g19' });
    assert.deepEqual(piecesOf(cat), ['four-a-night (draws)']);
    assert.equal(E.scratchTap(cat, ch04, 5), null, 'the one curl gives nothing');
    assert.deepEqual(cat.cards, []);
    assert.equal(E.tapWords(ch04.frames.g19).kind, 'draws');
    assert.ok(E.next(cat, ch04, 6));
    assert.deepEqual([cat.frame, cat.cards.map(c => c.id)], ['g20', ['four-a-night']]);
    // the row
    assert.ok(E.next(cat, ch04, 7));
    assert.equal(cat.frame, 'g21');
    const want = ['tidy'].concat(noticing ? ['dug-earth'] : [], ['scale']);
    assert.deepEqual(piecesOf(cat), ['four-a-night (head) ✓'].concat(want));
    assert.equal(E.scratchTap(cat, ch04, 8), 'tidy');
    assert.deepEqual(piecesOf(cat), ['four-a-night (head) ✓', 'tidy ✓'].concat(want.slice(1)));
    // she leaves (Camp, a reload) and comes back: the row is where she left it
    const back = E.migrate({ version: 2, cats: [clone(cat)] }).cats[0];
    assert.deepEqual(piecesOf(back), piecesOf(cat));
    assert.deepEqual(want.slice(1).map(() => E.scratchTap(back, ch04, 9)), want.slice(1));
    assert.equal(E.scratchTap(back, ch04, 10), null, 'no piece left: the page turns');
    assert.deepEqual(back.cards.map(c => c.id), ['four-a-night'].concat(want));
    assert.ok(E.next(back, ch04, 11));
    assert.equal(back.frame, 'g22');
    // Back to a row all scratched: nothing to give, only Next
    assert.ok(E.back(back, ch04));
    assert.ok(E.scratchPieces(ch04.frames.g21, back, ch04, list).every(p => p.done));
    assert.equal(E.scratchTap(back, ch04, 12), null);
    assert.deepEqual(back.counts.filter(e => /^ch04-(pile|tens|claws)$/.test(e.set)).length, back.counts.length - 10, 'the Taps log no answer (only the lessons before them did)');
  }
  // however the page turns, no card is left behind: E.next on a row with blank pieces gives them first
  const hasty = start4(cat4(st4, { specialty: 'noticing' }), st4);
  read4(hasty, st4, { stop: 'g21' });
  assert.equal(E.scratchTap(hasty, ch04, 20), 'tidy');
  assert.ok(E.next(hasty, ch04, 21));
  assert.deepEqual([hasty.frame, hasty.cards.map(c => c.id)], ['g22', ['four-a-night', 'tidy', 'dug-earth', 'scale']]);
  // the words: the instruction under the panel and the hidden button, with defaults
  assert.deepEqual(E.tapWords(ch04.frames.g21), { kind: 'cards', prompt: '**Tap** each piece of bark to scratch what you saw.', label: 'Scratch the next piece of bark' });
  assert.deepEqual(E.tapWords({ scratch: { cards: ['tidy'], next: 'x' } }), { kind: 'cards', prompt: '**Tap** each piece of bark to scratch it.', label: 'Scratch the next piece of bark' });
  assert.deepEqual(E.tapWords({ scratch: { draws: 'tidy', next: 'x' } }), { kind: 'draws', prompt: '**Tap** the bark to scratch it.', label: 'Scratch the bark' });
  assert.deepEqual(E.tapWords({ next: 'x' }), { prompt: '', label: '' });
  // each piece carries its card's picture, mark and line for the page
  const cat = start4(cat4(st4), st4);
  read4(cat, st4, { stop: 'g21' });
  assert.deepEqual(E.scratchPieces(ch04.frames.g21, cat, ch04, list)[1], { id: 'tidy', mark: 'eye', line: 'The thief leaves the pile tidy.', picture: 'tidy', done: false });
  // what checkStory refuses
  const s = clone(ch04);
  s.frames.g21.scratch = { cards: ['tidy', 'made-up', { id: 'scale', when: 'always' }], head: [{ id: 'four-a-night', when: { specialty: 'noticing' } }], draws: 'tidy', next: 'g22', prompt: 5 };
  s.frames.g19.scratch = { next: 'g20' };
  s.frames.g10.scratch = { tap: 'glint', at: { x: 'left' }, next: 'g11' };
  const errs = E.checkStory(s, list).join('\n');
  for (const want of [/g21: scratch needs exactly one of cards \(the row of bark\), draws \(one curl, no card\) or tap \(the glint\), has cards,draws/, /g21 scratch: unknown card made-up/,
    /g21 scratch card scale: when must be an object/, /g21 scratch head: card four-a-night takes no when here/, /g21: scratch prompt is a line/, /g19: scratch needs exactly one of .*has none/,
    /g10: scratch at is \{ x, y \} in percent of the panel/]) assert.match(errs, want);
  // a frame is one kind of page: never a scratch and a Next beside it
  const two = clone(ch04); two.frames.g21.next = 'g22';
  assert.match(E.checkStory(two, list).join('\n'), /g21: needs exactly one of next\/choice\/input\/look\/counts\/skip\/scratch\/file\/ask\/end, has next,scratch/);
  assert.deepEqual(E.KINDS, ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end'], 'chapter 5 adds `ask`');
});

test('the glitter Tap: the plainest scratch frame, nothing scratched; the page turns on a tap on the glint and on nothing else (PC.ui.taps.hit)', () => {
  require('../app/ui.js');
  const { ch04, list } = story4(), f = ch04.frames.g10;
  assert.deepEqual([E.kindOf(f), E.exits(f)], ['scratch', ['g11']]);
  assert.deepEqual(E.tapWords(f), { kind: 'tap', prompt: '**Tap** the glitter.', label: 'Look at the glitter.' });
  assert.deepEqual(E.tapWords({ scratch: { tap: 'glint', next: 'x' } }), { kind: 'tap', prompt: '**Tap** the glitter.', label: 'Look at the glitter.' }, 'its words by default');
  const cat = cat4(story4()); E.startChapter(cat, ch04, 1); E.go(cat, ch04, 'g10', 2);
  assert.deepEqual(E.scratchPieces(f, cat, ch04, list), [], 'no bark here');
  assert.equal(E.scratchTap(cat, ch04, 3), null, 'nothing to give');
  const log = cat.counts.length;
  assert.ok(E.next(cat, ch04, 4));
  assert.deepEqual([cat.frame, cat.counts.length, cat.cards.length], ['g11', log, 0], 'the tap turns the page; nothing is logged');
  // a tap lands on the glint within a generous reach (11% of the panel's width, never less than 48px), and nowhere else
  const hit = PC.ui.taps.hit, spot = f.scratch.at;
  assert.deepEqual(spot, { x: 52, y: 44 });
  const W = 860, H = 537, cx = W * 0.52, cy = H * 0.44;
  assert.equal(hit(W, H, spot, cx, cy), true);
  assert.equal(hit(W, H, spot, cx + 80, cy - 40), true, 'near enough for a small finger');
  for (const [x, y] of [[20, 20], [W - 20, H - 20], [cx + 130, cy], [cx, cy + 120], [cx - 100, cy - 60]]) assert.equal(hit(W, H, spot, x, y), false, x + ',' + y + ' is somewhere else: the glint twinkles');
  assert.equal(hit(300, 188, spot, 300 * 0.52 + 45, 188 * 0.44), true, 'on a phone the reach is still a fingertip (48px)');
  assert.equal(hit(300, 188, spot, 300 * 0.52 + 60, 188 * 0.44), false);
  // when the art draws the glint with a target of its own around it, that is the reach if it is wider
  assert.equal(hit(W, H, spot, cx + 130, cy, 18), true, '18% of the width: 155px');
  assert.equal(hit(W, H, spot, cx + 130, cy, 5), false, 'a narrower target never shrinks the fingertip’s reach');
});

test('frames that depend on her: the whisper over the bark or “But you can’t say so”, the den frame’s two variants, the frame after the raft, one bedtime line, one raft line; a `when` with two keys needs both', () => {
  const st4 = story4();
  const read = (flags, up) => { const cat = start4(cat4(st4, flags), st4); return { cat, rows: read4(cat, st4, { choices: { g27: up } }) }; };
  for (const ch3Told of [true, false]) for (const specialty of ['noticing', 'friends']) for (const up of [0, 1]) {
    const { rows } = read({ ch3Told, specialty }, up), all = words4(rows), name = JSON.stringify({ ch3Told, specialty, up });
    const noticing = specialty === 'noticing', found = !up;
    // over the bark: a noticing cat's frame, with one of two variants
    assert.equal(!!frame4(rows, 'g25'), noticing, name);
    assert.equal(/Moonpaw: He said FLEW\. And she can’t\./.test(all), noticing && ch3Told, name + ': the whisper, for one who told');
    assert.equal(/One of them is false already\. But you can’t say so\./.test(all), noticing && !ch3Told, name + ': for one who kept the secret');
    assert.equal(!!frame4(rows, 'b04'), noticing && !ch3Told, name + ': she tells Sprinkle under the bridge instead');
    // the told path's whisper on the way home is the last frame before the Hollow, never at the border
    assert.equal(!!frame4(rows, 'g17'), ch3Told, name);
    if (ch3Told) assert.equal(rows[rows.findIndex(r => r.id === 'g17') + 1].id, 'g18');
    // the den: one frame, two variants; a cat who told and did not go up has none
    const den = frame4(rows, 'h01');
    assert.equal(!!den, !ch3Told || found, name);
    if (den && !ch3Told) assert.deepEqual([den.say.map(b => b.text), den.caps], [['That was a fair question you asked at the border. If you ever have one for me, I’m right here.'], []], name);
    if (den && ch3Told) assert.deepEqual([den.caps, den.say.map(b => b.text)], [['At the den, you tell Tallyheart about Squall, and what he saw.'], ['A thing to check. Together.']], name);
    // after the raft: only a cat who found him
    assert.equal(!!frame4(rows, 'b07'), found, name);
    assert.equal(!!frame4(rows, 'b02'), found, name + ': “Five and five”');
    // bedtime: exactly one reason for the wing, and the two pieces go under the moss whoever she is
    const bed = frame4(rows, 'h02').caps;
    assert.deepEqual(bed.filter(c => /So you will\.|They can’t both be true\./.test(c)), [noticing ? 'You hold it beside the fox’s FLEW. They can’t both be true.' : 'She can’t go looking for her brothers and sisters. So you will.'], name);
    assert.ok(bed.includes('Then the two pieces of bark about Sprinkle go under the moss.'), name);
    assert.equal(/Goodnight, Squall\./.test(all), found);
  }
  // the raft: a swimmer with the water worry reads her own line and neither of the others
  const raft = (specialty, worry) => frame4(read({ specialty, worry }, 1).rows, 'b06').caps;
  assert.deepEqual(raft('swimming', 'water'), ['A raft. A dripping tap is one thing. The deep river is another. But Riffle will be right there.']);
  assert.deepEqual(raft('climbing', 'water'), ['A raft. On the deep water. Your tummy flips over. But Riffle will be right there.']);
  assert.deepEqual(raft('swimming', 'shiny'), ['A raft! Your paws can’t wait.']);
  assert.deepEqual(raft('climbing', 'shiny'), []);
  // a `when` with two keys is both (this chapter is the first to use one), and `not` of two keys is "not both"
  const c = E.blankCat({});
  const both = { specialty: 'noticing', ch3Told: false };
  assert.equal(E.matches(both, c), false);
  c.flags.specialty = 'noticing';
  assert.equal(E.matches(both, c), true, 'ch3Told never set counts as false');
  c.flags.ch3Told = true;
  assert.equal(E.matches(both, c), false);
  assert.equal(E.matches({ not: { ch3Told: true, foundSquall: false } }, c), false, 'told, not found: the den frame is not hers');
  c.flags.foundSquall = true;
  assert.equal(E.matches({ not: { ch3Told: true, foundSquall: false } }, c), true);
  // the chapter 2 path, at the roar; a climber's line over the tower choice
  assert.ok(frame4(read({ ch2Path: 'river' }, 1).rows, 'g27').caps.includes('The same roar as before. Sprinkle’s littlest brother!'));
  assert.ok(frame4(read({ ch2Path: 'bridge', specialty: 'climbing' }, 1).rows, 'g27').caps.includes('Balcony, balcony, balcony, roof. You could climb that.'));
  assert.ok(!frame4(read({ specialty: 'climbing' }, 0).rows, 'r01'), 'a climber climbs: no elevator screen');
  assert.ok(frame4(read({ specialty: 'friends' }, 0).rows, 'r01'), 'everyone else rides');
});

test('speakers: “The fox” until Glintstar names him, then “Reynard”; “The little dragon” through the riddle, its help, its fillers and its retry, then “Squall”; a chapter without `names` calls them by name', () => {
  require('../app/ui.js');
  const st4 = story4(), { ch04 } = st4, Sp = PC.ui.speakers;
  const cat = start4(cat4(st4, { specialty: 'friends' }), st4);
  const rows = read4(cat, st4, { choices: { g27: 0 }, answers: { '7x5': [34, 36] } });
  const labels = id => frame4(rows, id).say.filter(b => b.who === 'reynard' || b.who === 'squall').map(b => b.label);
  assert.deepEqual(labels('g13'), ['The fox']);
  assert.deepEqual(labels('g14'), ['Reynard', 'Reynard'], 'from “You are at our border, Reynard” on');
  assert.deepEqual(labels('r02'), ['The little dragon']);
  assert.deepEqual(labels('r03'), ['The little dragon', 'The little dragon']);
  // the riddle: every line of his, the help, the fillers and both retries
  const riddle = frame4(rows, 'r03').lesson;
  assert.deepEqual(riddle.map(r => r.k), ['7x5✗', 'F:1x5', 'F:5x3', 'R:7x5✗', 'F:4x5', 'F:5x5', 'R:7x5']);
  riddle.forEach(r => {
    assert.equal(r.teacher, 'squall', r.k);
    r.prompt.filter(p => p.who).forEach(p => assert.equal(p.label, 'The little dragon', r.k));
    assert.equal(label4({ who: r.teacher }, cat, ch04), 'The little dragon', r.k + ': his praise, his miss line, his help');
  });
  assert.deepEqual(labels('r04'), ['The little dragon', 'Squall'], 'he says his name on this screen');
  assert.deepEqual(labels('r05').concat(labels('r06')), ['Squall', 'Squall']);
  assert.doesNotMatch(words4(rows.slice(0, rows.findIndex(r => r.id === 'r04'))), /Squall/, 'no “Squall” on screen up to and including the riddle');
  // a chapter that has met them (no `names`): their own names; and their voices
  assert.equal(Sp.label({ who: 'reynard' }, { story: st4.ch03 }), 'Reynard');
  assert.equal(Sp.label({ who: 'squall' }, { story: st4.ch03 }), 'Squall');
  assert.equal(Sp.label({ who: 'squall', name: 'A very small roar' }, { story: ch04 }), 'A very small roar');
  assert.ok(Sp.pitch('reynard') < 0.9 && Sp.rate('reynard') < 0.9, 'Reynard: slow and smooth');
  assert.ok(Sp.pitch('squall') > 1.5 && Sp.rate('squall') >= 0.95, 'Squall: high and loud');
  assert.deepEqual(['tallyheart', 'riffle', 'sprinkle'].map(w => [Sp.pitch(w), Sp.rate(w)]), [[0.92, 0.95], [1.5, 0.95], [1.38, 0.86]], 'everyone else as before');
  const bad = clone(ch04); bad.names = { squall: ['The little dragon'] };
  assert.match(E.checkStory(bad, st4.list).join('\n'), /names is an object of labels by speaker/);
});

/* ------------------------------------------------ chapter 4's Counts */
test('the claws warm-up: three questions; her hardest 5s fact takes the second; 2 × 5 is written last and is never the hard pick nor a filler; the opener is never one of her three hardest facts nor the hard pick’s pair; nothing in it says “last”', () => {
  const st4 = story4(), { ch04, list } = st4, def = ch04.counts['ch04-claws'];
  const facts = cat => E.lessonFacts(cat, def, list).map(f => (Array.isArray(f) ? f[0] + 'x' + f[1] : f.a + 'x' + f.b + (f.hard ? ' hard' : '')));
  assert.deepEqual(facts(cat4(st4)), ['3x5', '5x7', '2x5'], 'nothing hard: as written');
  assert.deepEqual(facts(cat4(st4, null, { '7x5': [34] })), ['3x5', '7x5 hard', '2x5'], 'a missed 7 × 5 takes the second question, as she met it');
  assert.deepEqual(facts(cat4(st4, null, { '5x2': [9] })), ['3x5', '5x7', '2x5'], 'Sprinkle’s dinner is never the hard pick: it is asked anyway');
  assert.deepEqual(facts(cat4(st4, null, { '5x2': [9], '9x5': [44] })), ['3x5', '9x5 hard', '2x5'], 'the next hardest takes its place');
  assert.deepEqual(facts(cat4(st4, null, { '5x3': [14] })), ['4x5', '5x3 hard', '2x5'], 'the opener is the hard pick’s pair: the first of 4 × 5, 1 × 5, 5 × 5 opens');
  assert.deepEqual(facts(cat4(st4, null, { '5x3': [14], '4x5': [19], '1x5': [4] })), ['5x5', '5x3 hard', '2x5'], 'never one of her three hardest: 5 × 5 opens');
  assert.deepEqual(facts(cat4(st4, null, null, { '5x8': 6000, '5x3': 5000 })), ['4x5', '5x8 hard', '2x5'], 'slow counts as hard; the opener 3 × 5 is the pair of her second hardest, one of her three hardest: 4 × 5 opens');
  assert.deepEqual(facts(cat4(st4, null, null, { '5x8': 6000 })), ['3x5', '5x8 hard', '2x5']);
  assert.deepEqual(facts(cat4(st4, null, null, { '5x3': 6000 })), ['4x5', '5x3 hard', '2x5']);
  // nothing in the set says "last one" (a retry or a borrowed question can follow 2 × 5), and the bridge to today's Count is the next frame's
  const said = clone(def); delete said.remembered;   // ("Last time, 7 × 5 made you stop and think" is about yesterday)
  assert.doesNotMatch(JSON.stringify(said), /\blast\b/i);
  assert.equal(def.done, null);
  // the first question asks about paws and claws, never cats and tails
  const clean = play4(cat4(st4), st4, 'ch04-claws', null, { all: 5000 });
  assert.deepEqual(ks(clean), ['3x5', '5x7', '2x5']);
  assert.deepEqual(clean[0].prompt.map(p => p.text), ['Three paws. How many claws?']);
  assert.deepEqual(clean[2].prompt.map(p => [p.who, p.text]), [['tallyheart', 'Two forepaws, five claws each. How many claws?']]);
  assert.deepEqual([clean[2].kind, clean[2].balloons.map(b => b.text)], ['right', ['Ten!']]);
  assert.deepEqual(clean[2].picture.who, [{ who: 'tallyheart' }, { who: 'tallyheart' }], 'one cat’s two forepaws');
  // a miss comes back two questions later: after 2 × 5 for the first question; after 2 × 5 and one borrowed question for the second
  assert.deepEqual(ks(play4(cat4(st4), st4, 'ch04-claws', { '3x5': [16] })), ['3x5✗', '5x7', '2x5', 'R:3x5']);
  const second = play4(cat4(st4), st4, 'ch04-claws', { '5x7': [34] });
  assert.deepEqual(ks(second), ['3x5', '5x7✗', '2x5', 'F:1x5', 'R:5x7']);
  assert.deepEqual(second[3].prompt.map(p => p.text), ['One from yesterday. One paw. How many claws?'], 'borrowed from chapter 3’s claws, the easiest first');
  assert.equal(second[1].help.intro, 'Remember: hopping by fives, every number ends in a five or a zero. Let’s scratch it out together.');
  assert.deepEqual([second[1].help.ground, second[1].help.style, second[1].help.nums], ['sand', 'swipe', [5, 10, 15, 20, 25, 30, 35]]);
  // a missed 2 × 5 borrows 1 × 5 and 4 × 5 (never 7 × 5 or 9 × 5, the lesson's hardest; never itself), and keeps its words and its "Ten!" on the retry
  const last = play4(cat4(st4), st4, 'ch04-claws', { '2x5': [9] });
  assert.deepEqual(ks(last), ['3x5', '5x7', '2x5✗', 'F:1x5', 'F:4x5', 'R:2x5']);
  assert.deepEqual(last[5].prompt.map(p => p.text), ['Here’s that one again.', 'Two forepaws, five claws each. How many claws?']);
  assert.deepEqual([last[5].kind, last[5].balloons.map(b => b.text)], ['right', ['Ten!']]);
  // however she plays it, 2 × 5 is never borrowed and never hard
  const every = play4(cat4(st4, null, { '5x2': [9], '5x5': [24] }), st4, 'ch04-claws', { '3x5': [1, 1, 1], '5x5': [1, 1, 1], '2x5': [1, 1, 1], '1x5': [1], '4x5': [1], '5x3': [1] });
  assert.ok(every.filter(r => r.q.filler).every(r => r.q.a * r.q.b !== 10), ks(every).join(' '));
  assert.ok(every.filter(r => r.q.filler).every(r => r.q.a * r.q.b <= 25), 'only the five easiest are ever lent');
  assert.ok(every.every(r => !(r.q.hard && r.q.a * r.q.b === 10)));
});

test('the tens, both forepaws: the ten facts in order, in both orders; “front claws” in every question it words for itself; the zero rule; swipes in pairs; 4 × 10’s “You hopped it!” on its retry too; no line names a total', () => {
  const st4 = story4(), { ch04 } = st4, def = ch04.counts['ch04-tens'];
  const clean = play4(cat4(st4), st4, 'ch04-tens', null, { all: 5000 });
  assert.deepEqual(ks(clean), ['4x10', '10x2', '1x10', '5x10', '6x10', '10x8', '10x3', '10x9', '7x10', '10x10']);
  assert.deepEqual(clean.map(r => r.q.answer), [40, 20, 10, 50, 60, 80, 30, 90, 70, 100]);
  assert.deepEqual(clean.map(r => [r.q.groups, r.q.per]), [[4, 10], [2, 10], [1, 10], [5, 10], [6, 10], [8, 10], [3, 10], [9, 10], [7, 10], [10, 10]], 'every picture is cats with ten claws each, whichever way it is written');
  assert.ok(clean.every(r => r.picture.table === 10 && r.picture.per === 10 && r.picture.things === 'front claws'));
  assert.deepEqual(clean[0].picture.who.map(w => w.who + (w.variant || '')), ['clancat1', 'clancat2', 'clancat3', 'clancat4'], 'the first four cats on the rim');
  assert.deepEqual(clean[0].prompt.map(p => p.text), ['How many front claws on the first four cats?']);
  assert.deepEqual([clean[0].kind, clean[0].balloons.map(b => b.text)], ['right', ['You hopped it!']]);
  assert.deepEqual(clean[1].balloons.map(b => b.text), ['Twenty! Two cats, ten claws each. Or ten cats, two ears each. Same twenty!']);
  assert.deepEqual([clean[4].prompt.map(p => p.text), clean[4].picture.highlight], [['Six cats. The first five have fifty claws. Now hop on from fifty!'], 50], 'the first five cats’ claws lit together');
  assert.deepEqual(clean[4].balloons.map(b => b.text), ['Sixty! Hear it? SIX-ty. Six tens. The answer hides in its own name.']);
  assert.deepEqual(clean[9].balloons.map(b => b.text), ['A HUNDRED! The very last thing Glintstar asked Murmurchime.']);
  // every question it words for itself says "front": a cat has claws behind too
  const generic = clean.filter(r => ![0, 4].includes(clean.indexOf(r)));
  assert.deepEqual(generic.map(r => r.prompt[0].text), ['Two cats. How many front claws?', 'One cat. How many front claws?', 'Five cats. How many front claws?', 'Eight cats. How many front claws?',
    'Three cats. How many front claws?', 'Nine cats. How many front claws?', 'Seven cats. How many front claws?', 'Ten cats. How many front claws?']);
  // praise is dealt in order: the first is true of every cat on every question, 4 × 10's own line comes last
  assert.equal(def.praise[0], 'Yes! Ten front claws on every cat.');
  assert.equal(def.praise[def.praise.length - 1], 'You hopped it!');
  assert.deepEqual(clean.filter(r => r.kind === 'praise').map(r => r.line).slice(0, 4), def.praise.slice(0, 4));
  // no praise, fast or again line names a total from twenty to a hundred ("ten front claws" is every cat's)
  const TOTAL = /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|[2-9]0|100)\b/i;
  [].concat(def.praise, def.fast, def.fastAfterMiss, def.again || [], [def.miss, def.missLast, def.remembered, def.done]).forEach(l => assert.doesNotMatch(l, TOTAL, l));
  // a miss: the zero rule first when the answer doesn't end in a zero; "Close." within ten; two swipes for every cat, hopped by tens
  const miss = (k, wrong) => play4(cat4(st4), st4, 'ch04-tens', { [k]: [wrong] }).find(r => r.k === k + '✗');
  const zero = miss('10x3', 34);
  assert.equal(zero.res.notTen, true);
  assert.equal(zero.help.intro, 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.');
  const close = miss('10x3', 20);
  assert.deepEqual([close.res.notTen, close.res.near, close.help.intro], [undefined, true, 'Close. Let’s scratch it out together: two swipes for every cat, five lines a swipe.']);
  assert.deepEqual([miss('10x3', 40).res.near, miss('10x3', 50).res.near, miss('10x3', 60).help.intro], [true, false, 'Let’s scratch it out together: two swipes for every cat, five lines a swipe.'], 'close is one hop off: within ten');
  assert.equal(miss('10x3', 31).help.intro, zero.help.intro, 'one off is close, but it breaks the rule: the rule comes first');
  assert.deepEqual([close.help.ground, close.help.style, close.help.pair, close.help.byRow, close.help.step, close.help.nums, close.help.counter], ['sand', 'swipe', true, undefined, 10, [10, 20, 30], 'tallyheart']);
  assert.deepEqual(close.sand(0), { groups: 3, per: 10, counted: 0, layout: undefined, ground: undefined, style: 'swipe', pair: true });
  assert.deepEqual(close.sand(10).counted, 10, 'a cat’s two swipes light together');
  assert.equal(close.line, 'There. We’ll come back to that one.');
  // it comes back two questions later; 6 × 10 keeps its hop on from fifty; a right retry of 4 × 10 says "You hopped it!" too
  const two = play4(cat4(st4), st4, 'ch04-tens', { '4x10': [44], '6x10': [61] });
  assert.deepEqual(ks(two).slice(0, 9), ['4x10✗', '10x2', '1x10', 'R:4x10', '5x10', '6x10✗', '10x8', '10x3', 'R:6x10']);
  assert.deepEqual([two[3].kind, two[3].balloons.map(b => b.text)], ['right', ['You hopped it!']]);
  assert.deepEqual(two[3].prompt.map(p => p.text), ['Here’s that one again. Four cats. How many front claws?']);
  assert.deepEqual(two[3].picture.who.length, 4, 'pictured the same on its retry');
  assert.deepEqual([two[8].prompt.map(p => p.text), two[8].picture.highlight], [['Here’s that one again. Six cats. The first five have fifty claws. Now hop on from fifty!'], 50]);
  assert.equal(two[8].balloons[0].text, 'Sixty! Hear it? SIX-ty. Six tens. The answer hides in its own name.');
  // quick after a miss: "scratches", never "sand" (the set lends its questions to the pile)
  const quick = play4(cat4(st4), st4, 'ch04-tens', { '4x10': [44] }, { all: 2000 });
  assert.ok(quick.some(r => r.line === 'Ha! You didn’t even look at the scratches that time.'));
  assert.ok(quick.every(r => !/sand/i.test(r.line)));
  // the last miss comes back after borrowed... no: the tens fill from themselves (what she has got right, most recent first)
  const end = play4(cat4(st4), st4, 'ch04-tens', { '10x10': [90] });
  assert.deepEqual(ks(end).slice(-4), ['10x10✗', 'F:7x10', 'F:10x9', 'R:10x10']);
  assert.equal(end[end.length - 1].balloons[0].text, 'A HUNDRED! The very last thing Glintstar asked Murmurchime.');
  // a hundred takes three digits: the keypad's, and the engine's
  require('../app/ui.js');
  const K = PC.ui.keypad.press;
  assert.equal(['1', '0', '0'].reduce(K, ''), '100');
  assert.equal(['1', '0', '0', '0', '7'].reduce(K, ''), '100', 'never a fourth digit');
  assert.equal(['0', '4', '0'].reduce(K, ''), '40', 'a lone 0 gives way');
  assert.equal(['1', '0', 'del', '2'].reduce(K, ''), '12');
  assert.equal(['del', 'ok', 'x', '5'].reduce(K, ''), '5');
  const st = E.counts.start(def, { facts: [[10, 10]] });
  assert.equal(E.counts.answer(st, def, '100', 2000, 1).correct, true);
});

test('the pile in rows of ten: two questions, each with its own picture; a miss is scratched in the earth, ten marks a row, lit a whole row at a time; 13 opens with the zero rule; it borrows the easiest of this morning’s tens', () => {
  const st4 = story4(), { ch04 } = st4;
  const pile = (answers, ms, cat) => play4(cat || cat4(st4), st4, 'ch04-pile', answers, ms);
  const clean = pile();
  assert.deepEqual(ks(clean), ['3x10', '2x10']);
  assert.deepEqual(clean[0].prompt.map(p => [p.who, p.text]), [['grizzled', 'Best hunt since the storm.'], ['grizzled', 'Three rows of ten last night. How many pieces?']]);
  assert.deepEqual([clean[0].picture.kind, clean[0].picture.layout, clean[0].picture.thought, clean[0].picture.groups, clean[0].picture.per], ['prey', 'rows', true, 3, 10], 'his count, in a thought cloud');
  assert.deepEqual(clean[0].balloons.map(b => [b.who, b.text]), [['grizzled', 'Hmph.'], ['grizzled', 'It took me till the stars came out.']]);
  assert.deepEqual(clean[1].prompt, [{ text: 'You walk along the rows. One full row. Two full rows. How many pieces in two rows of ten?', kind: 'caption', label: null }]);
  assert.deepEqual([clean[1].picture.kind, clean[1].picture.layout, clean[1].picture.thought, clean[1].picture.groups, clean[1].picture.per, clean[1].q.light], ['prey', 'rows', undefined, 2, 10, 'rows'],
    'the two front rows and nothing else: no third row to invite thirty');
  assert.deepEqual([clean[1].kind, clean[1].line, clean[1].res.entry.check], ['praise', '', true], 'nothing said after it: the next frame is the gap');
  // 13 for 3 × 10: the likeliest slip, three plus ten
  const thirteen = pile({ '3x10': [13] });
  assert.deepEqual(ks(thirteen), ['3x10✗', '2x10', 'F:1x10', 'R:3x10'], 'a missed 3 × 10 borrows 1 × 10');
  const h = thirteen[0].help;
  assert.equal(h.intro, 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.');
  assert.deepEqual([h.ground, h.layout, h.step, h.nums, h.byRow, h.pair, h.style, h.teacher], ['earth', 'rows', 10, [10, 20, 30], true, undefined, null, 'tallyheart']);
  assert.deepEqual(thirteen[0].sand(10), { groups: 3, per: 10, counted: 10, layout: 'rows', ground: 'earth', step: 10 }, 'after its first hop: ten counted, and the art is told the hop is a whole row');
  assert.equal(pile({ '3x10': [20] })[0].help.intro, 'Let’s scratch it out: ten marks for every row.', '20 ends in a zero: no reminder');
  assert.deepEqual(thirteen[3].prompt.map(p => [p.who, p.text]), [['tallyheart', 'Here’s that one again. Three rows of ten. How many pieces?']]);
  assert.deepEqual(thirteen[3].balloons.map(b => b.text), ['Hmph.', 'It took me till the stars came out.'], 'the old tom never grumbles at a miss');
  // the borrowed question is this morning's, in its own lesson's words, scratched in the earth beside the pile
  const lent = thirteen[2];
  assert.deepEqual([lent.q.from, lent.D.id, lent.prompt.map(p => p.text)], ['ch04-tens', 'ch04-tens', ['One from this morning. One cat. How many front claws?']]);
  assert.equal(lent.line, 'Ha! You didn’t even look at the scratches that time.', 'quick and right after a miss: scratches, never sand');
  const lentMiss = pile({ '3x10': [13], '1x10': [11] }).find(r => r.k === 'F:1x10✗');
  assert.deepEqual([lentMiss.help.ground, lentMiss.help.style, lentMiss.help.pair, lentMiss.help.intro], ['earth', 'swipe', true, 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.']);
  assert.deepEqual(lentMiss.sand(0), { groups: 1, per: 10, counted: 0, layout: undefined, ground: 'earth', style: 'swipe', pair: true });
  // a missed 2 × 10 borrows 1 × 10 and 5 × 10; both missed: one filler, and they come back in order
  assert.deepEqual(ks(pile({ '2x10': [12] })), ['3x10', '2x10✗', 'F:1x10', 'F:5x10', 'R:2x10']);
  assert.deepEqual(pile({ '2x10': [12] })[4].prompt.map(p => p.text), ['Here’s that one again. Two rows of ten. How many pieces?']);
  assert.deepEqual(ks(pile({ '3x10': [13], '2x10': [12] })), ['3x10✗', '2x10✗', 'F:1x10', 'R:3x10', 'R:2x10']);
  // never 10 × 2 or 10 × 3 (the pile's own rows the other way round), never the lesson's last three, never tonight's 4 × 10:
  // missed again, 2 × 10 borrows 1 × 10 and 5 × 10 once more (a set that borrows the easiest never lends its own questions back)
  const twice = pile({ '2x10': [12, 21] });
  assert.deepEqual(ks(twice), ['3x10', '2x10✗', 'F:1x10', 'F:5x10', 'R:2x10✗', 'F:1x10', 'F:5x10', 'R:2x10']);
  assert.equal(twice[4].line, 'There. We’ll come back to that one.');
  for (const answers of [{ '3x10': [1, 1, 1], '2x10': [1, 1, 1] }, { '3x10': [13, 31], '2x10': [12] }, { '3x10': [1, 1, 1], '2x10': [1, 1, 1], '5x10': [1] }]) {
    const lentPairs = pile(answers).filter(r => r.q.filler).map(r => r.q.a + 'x' + r.q.b);
    assert.ok(lentPairs.length >= 1 && lentPairs.every(k => ['1x10', '5x10'].includes(k)), JSON.stringify(answers) + ': ' + lentPairs.join(' '));
  }
  // after the morning's lesson (her right answers there, 10 × 9, 7 × 10, 10 × 10 the most recent): still the easiest
  const cat = cat4(st4); play4(cat, st4, 'ch04-tens');
  assert.deepEqual(ks(pile({ '2x10': [12] }, null, cat)), ['3x10', '2x10✗', 'F:1x10', 'F:5x10', 'R:2x10']);
  // tonight's rows: four rows lit a row at a time; a miss borrows 1 × 10 and 5 × 10 whether or not she went up in between
  const night = (c, answers) => play4(c, st4, 'ch04-night', answers);
  for (const up of [true, false]) for (const morningMiss of [null, { '3x10': [13] }, { '2x10': [12] }]) {
    const c = cat4(st4);
    play4(c, st4, 'ch04-claws'); play4(c, st4, 'ch04-tens'); play4(c, st4, 'ch04-pile', morningMiss);
    if (up) play4(c, st4, 'ch04-riddle');
    const n = night(c, { '4x10': [14] });
    assert.deepEqual(ks(n)[0], '4x10✗');
    assert.deepEqual(n.filter(r => r.q.filler).map(r => r.q.a + 'x' + r.q.b).sort(), ['1x10', '5x10'], JSON.stringify({ up, morningMiss }) + ': ' + ks(n).join(' '));
    assert.deepEqual([n[0].help.ground, n[0].help.layout, n[0].help.byRow, n[0].help.nums, n[0].help.intro],
      ['earth', 'rows', true, [10, 20, 30, 40], 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.']);
    assert.deepEqual(n[0].sand(10), { groups: 4, per: 10, counted: 10, layout: 'rows', ground: 'earth', step: 10 });
    assert.deepEqual(n[n.length - 1].prompt.map(p => p.text), ['Here’s that one again. Four rows of ten. How many pieces?']);
  }
  const right = night(cat4(st4));
  assert.deepEqual(right[0].prompt.map(p => [p.who, p.text]), [['grizzled', 'Four rows of ten tonight.'], ['grizzled', 'How many pieces, counting cat?']]);
  assert.deepEqual(right[0].balloons.map(b => [b.who || b.kind, b.text]), [['grizzled', 'Forty.'], ['caption', 'He checks, under his breath.'], ['grizzled', 'Ten, twenty, thirty, forty. Hmph. Quicker than twos.']]);
  assert.deepEqual([right[0].picture.groups, right[0].picture.per, right[0].picture.layout, right[0].q.light], [4, 10, 'rows', 'rows']);
  // chapter 2's check keeps its column at a time: two rows of eight, hopped by twos
  const S = realStories(), c2 = E.blankCat({}), ck = E.chapterLesson(c2, S.ch02, 'ch02-check', 1, [S.ch01, S.ch02]);
  const q = E.counts.question(ck.state), res = E.counts.answer(ck.state, ck.def, 1, 2000, 1), plan = E.helpPlan(ck.def, ck.def, q, res);
  assert.deepEqual([plan.layout, plan.step, plan.per, 'byRow' in plan, 'step' in E.sandOpts(plan, 2)], ['rows', 2, 8, false, false]);
});

test('the pile’s rows, as the art draws them: after the first hop of a missed 3 × 10 exactly the first row’s ten marks are lit (once PC.art.sand knows `step`)', (t) => {
  const { load } = require('./_load.js'), A = load().art;
  const lit = svg => (svg.match(/#e39a12/g) || []).length;
  const plain = A.sand({ groups: 3, per: 10, counted: 10, layout: 'rows', ground: 'earth' }), byRow = A.sand({ groups: 3, per: 10, counted: 10, layout: 'rows', ground: 'earth', step: 10 });
  if (plain === byRow) { t.skip('PC.art.sand does not read `step` yet (app/art/cats.js): the help would light four, three and three marks over “10”'); return; }
  assert.equal(lit(byRow), 10);
  for (const n of [0, 10, 20, 30]) assert.equal(lit(A.sand({ groups: 3, per: 10, counted: n, layout: 'rows', ground: 'earth', step: 10 })), n, n + ' counted, ' + n + ' lit');
  // chapter 2's check, with no `step`: a column at a time, as before
  assert.equal(lit(A.sand({ groups: 2, per: 8, counted: 2, layout: 'rows', ground: 'earth' })), 2);
});

test('Squall’s riddle: seven little forepaws scratched in the roof’s grit, no dragonet behind them; a miss is hopped 5 · 10 … 35 by the player on the grit; it borrows 1 × 5 and 5 × 3, never Sprinkle’s dinner; “Mama’s count again!”', () => {
  const st4 = story4(), { ch04 } = st4;
  const clean = play4(cat4(st4), st4, 'ch04-riddle');
  assert.deepEqual(ks(clean), ['7x5']);
  assert.deepEqual(clean[0].prompt.map(p => [p.who, p.text]), [['squall', 'Seven dragonets hold up one forepaw each. Five claws on every forepaw. How many claws does Mama count?']]);
  assert.deepEqual(clean[0].picture, { table: 5, groups: 7, per: 5, highlight: 0, kind: 'grit', layout: undefined, thought: undefined, who: undefined, thing: 'claw', things: 'claws', ground: 'grit' });
  assert.deepEqual(clean[0].balloons.map(b => [b.who, b.text]), [['squall', 'THIRTY-FIVE!']]);
  // the story may write the picture the long way round: the art is handed the same
  const long = clone(ch04); long.counts['ch04-riddle'].picture = { kind: 'mud', ground: 'grit' };
  assert.deepEqual(E.lessonPicture(long.counts['ch04-riddle'], clean[0].q, 0), clean[0].picture);
  assert.equal(E.helpGround(Object.assign({ id: 'x' }, long.counts['ch04-riddle'], { ground: undefined }), null, clean[0].q), 'grit', 'and a picture’s own ground is where its help is scratched');
  assert.equal(E.helpGround({ id: 'x', picture: { kind: 'grit' } }, null, clean[0].q), 'grit');
  // a miss
  const rows = play4(cat4(st4), st4, 'ch04-riddle', { '7x5': [34, 36] });
  assert.deepEqual(ks(rows), ['7x5✗', 'F:1x5', 'F:5x3', 'R:7x5✗', 'F:4x5', 'F:5x5', 'R:7x5']);
  const h = rows[0].help;
  assert.deepEqual([h.intro, h.counter, h.teacher, h.ground, h.style, h.nums, h.pair], ['Scratch it on the roof! You hop!', 'player', 'squall', 'grit', 'swipe', [5, 10, 15, 20, 25, 30, 35], undefined]);
  assert.deepEqual(rows[0].sand(5), { groups: 7, per: 5, counted: 5, layout: undefined, ground: 'grit', style: 'swipe' }, 'on the grit, never on sand');
  assert.equal(rows[0].line, 'There! We’ll count that one AGAIN.');
  // its fillers: easy claws from yesterday in his voice, never 2 × 5 (Sprinkle is about to say it herself)
  assert.deepEqual(rows[1].prompt.map(p => [p.who, p.text]), [['squall', 'Do another one! One paw. How many claws?']]);
  assert.deepEqual(rows[2].prompt.map(p => p.text), ['Do another one! Three paws. How many claws?']);
  assert.deepEqual([rows[1].D.voice, rows[1].teacher, rows[1].picture.kind, rows[1].picture.ground], ['ch04-riddle', 'squall', undefined, undefined], 'yesterday’s picture, his voice');
  assert.ok(['YES!', 'Hop, hop, HOP!', 'FAST! Faster than a giant dragon!'].includes(rows[1].line));
  assert.ok(rows.filter(r => r.q.filler).every(r => r.q.a * r.q.b !== 10));
  // and it comes back as Mama's count
  assert.deepEqual(rows[3].prompt.map(p => p.text), ['Mama’s count again! Seven forepaws, five claws each. How many claws?']);
  assert.deepEqual(rows[6].balloons.map(b => b.text), ['THIRTY-FIVE!']);
  assert.equal(rows[3].line, 'There! We’ll count that one AGAIN.', 'it comes back twice');
  const thrice = play4(cat4(st4), st4, 'ch04-riddle', { '7x5': [34, 36, 37] });
  assert.deepEqual([ks(thrice).slice(-1), thrice[thrice.length - 1].line], [['R:7x5✗'], 'There. Now we’ve counted it together.'], 'and never a third time: nothing blocks');
  // a missed filler on the roof is hopped on the grit too, by the player
  const f = play4(cat4(st4), st4, 'ch04-riddle', { '7x5': [34], '1x5': [4] }).find(r => r.k === 'F:1x5✗');
  assert.deepEqual([f.help.ground, f.help.counter, f.help.intro], ['grit', 'player', 'Scratch it on the roof! You hop!']);
  // it is extra: the chapter's lessons are sixteen answers without it, seventeen with it
  const total = up => { const cat = start4(cat4(st4), st4); read4(cat, st4, { choices: { g27: up } }); return cat.counts.filter(e => /^ch04-/.test(e.set)).length; };
  assert.deepEqual([total(1), total(0)], [16, 17]);
});

test('E.hardFacts and reading time in chapter 4: the warm-up’s opener, 4 × 10, 6 × 10, 2 × 5, both pile facts, the riddle and tonight’s 4 × 10 are read under a prompt (only a miss makes them hard); the rest are timed', () => {
  const st4 = story4(), { ch04, list } = st4;
  const slow = start4(cat4(st4), st4);
  read4(slow, st4, { choices: { g27: 0 }, ms: { all: 6500 } });
  const key = f => Math.min(f[0], f[1]) + 'x' + Math.max(f[0], f[1]);
  const hard10 = E.hardFacts(slow, 10, list).map(key), hard5 = E.hardFacts(slow, 5, list).map(key);
  assert.deepEqual(hard10.slice().sort(), ['1x10', '10x10', '2x10', '3x10', '5x10', '7x10', '8x10', '9x10'].sort(), 'every tens fact she was slow on but 4 × 10 (under the first prompt) and 6 × 10 (under its own); 2 × 10 and 3 × 10 from the lesson, never from the pile');
  assert.ok(!hard10.includes('4x10') && !hard10.includes('6x10'));
  assert.deepEqual(hard5.slice().sort(), ['5x10', '5x7'], 'the warm-up’s second question is timed (and 5 × 10 is a five too); its opener, 2 × 5 and the riddle’s 7 × 5 were read under a prompt');
  // a miss there still counts
  const missed = start4(cat4(st4), st4);
  read4(missed, st4, { choices: { g27: 0 }, answers: { '4x10': [41], '3x5': [14], '7x5': [34] } });
  assert.ok(E.hardFacts(missed, 10, list).map(key).includes('4x10'));
  assert.deepEqual(E.hardFacts(missed, 5, list).map(key).sort(), ['3x5', '5x7']);
});

test('the Training Hollow offers “Both forepaws · the 10s” (the tens lesson, never the warm-up, the pile, tonight’s rows or the riddle); no line of Tallyheart’s there is the same for the 5s and the 10s', () => {
  const st4 = story4(), { ch04, list } = st4;
  assert.deepEqual(E.countSets(list).map(c => [c.table, c.setId, c.chapter]), [[1, 'ch01-tails', 'ch01'], [2, 'ch02-ears', 'ch02'], [5, 'ch03-claws', 'ch03'], [10, 'ch04-tens', 'ch04']]);
  const cat = start4(cat4(st4), st4);
  read4(cat, st4);
  assert.deepEqual(E.learnedCounts(cat, list).map(c => E.countName(c.def, c.table)), ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s']);
  assert.deepEqual(E.factTables(cat, list).map(t => t.name), ['Claws · the 5s', 'Both forepaws · the 10s'], 'the grown-ups’ headings too');
  const d5 = E.hollowDef(list, 5), d10 = E.hollowDef(list, 10);
  assert.deepEqual([d10.id, d10.label, d10.hollowThings, d10.things, d10.helpIntroNotTen], ['hollow-10s', 'Both forepaws', 'tens', 'front claws', ch04.counts['ch04-tens'].helpIntroNotTen]);
  ['facts', 'firstPrompt', 'fillFrom', 'fillIntro', 'fillOrder', 'fillVoice', 'avoid', 'ground', 'warmHard'].forEach(k => assert.ok(!(k in d10), k));
  assert.deepEqual([E.hollowWord(d5), E.hollowWord(d10), E.hollowWord(E.hollowDef(list, 1))], ['claws', 'tens', 'tails']);
  // the five lines built from a Count's word: each different for the 5s and the 10s
  const only = t => { const c = E.blankCat({}); c.lessons[t === 5 ? 'ch03-claws' : 'ch04-tens'] = { finished: true }; c.hollow.byTable[t] = { rounds: 3, cleanRounds: 3, glow: true }; return E.hollowLines(c, list); };
  const lines = (def, H) => [H.greet, H.glow, E.hollowRoundLine(def), E.hollowGlowNote(def, true), H.counts[0].name];
  const five = lines(d5, only(5)), ten = lines(d10, only(10));
  assert.deepEqual(ten, ['Back for more tens? A full round earns a treasure for your nest.', 'Look at your claw mark. It glows now. You know your tens.', 'A round of tens. Ready? Here we go.',
    'Look! Your tens claw mark on the tree is glowing.', 'Both forepaws · the 10s']);
  assert.deepEqual(five, ['Back for more claws? A full round earns a treasure for your nest.', 'Look at your claw mark. It glows now. You know your claws.', 'A round of claws. Ready? Here we go.',
    'Look! Your claws claw mark on the tree is glowing.', 'Claws · the 5s']);
  five.forEach((l, i) => assert.notEqual(l, ten[i]));
  // both glowing, among four Counts
  cat.hollow.byTable['5'] = { rounds: 3, cleanRounds: 3, glow: true }; cat.hollow.byTable['10'] = { rounds: 3, cleanRounds: 3, glow: true };
  const H = E.hollowLines(cat, list);
  assert.deepEqual([H.greet, H.glow, H.one], ['Which Count today? A full round earns a treasure for your nest.', 'Look at your claw marks. Your claws and tens marks glow now.', null]);
  assert.deepEqual(H.counts.map(c => [c.table, c.name, c.glow]), [[1, 'Tails · the 1s', false], [2, 'Ears · the 2s', false], [5, 'Claws · the 5s', true], [10, 'Both forepaws · the 10s', true]]);
  assert.equal(E.hollowLines(cat, list, { reward: true }).greet, 'Another round? I’ve got all evening.');
  assert.equal(E.hollowGlowNote(d10, false), 'Look! Your claw mark on the tree is glowing.');
  assert.equal(E.hollowLines(E.blankCat({}), list).greet, 'Finish a Count in your story first. Then come back and practise it.');
  // a round of the 10s: ten facts, n × 10 both ways, generic questions that say "front claws"; a miss is two swipes a cat, on the sand
  const { state } = E.hollowStart(cat, list, 1, 10);
  assert.deepEqual(state.queue.map(q => q.a * q.b).sort((a, b) => a - b), [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const q = E.counts.question(state);
  assert.match(E.promptLines(d10, d10, q)[0].text, /^(One cat|\w+ cats)\. How many front claws\?$/);
  const r = E.counts.answer(state, d10, q.answer + 3, 2000, 1), plan = E.helpPlan(d10, d10, q, r);
  assert.deepEqual([plan.ground, plan.style, plan.pair, plan.intro], ['sand', 'swipe', true, 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.']);
  // the tree: four marks now
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, list).opts.marks, 4);
  const bad = clone(ch04); bad.counts['ch04-tens'].label = ['Both forepaws']; bad.counts['ch04-tens'].hollowThings = ''; bad.counts['ch04-tens'].helpIntroNotTen = 10;
  bad.counts['ch04-riddle'].ground = 'roof'; bad.counts['ch04-riddle'].picture = { kind: 'mud', ground: 'gravel' };
  const errs = E.checkStory(bad, list).join('\n');
  for (const want of [/ch04-tens: label is a line/, /ch04-tens: hollowThings is a line/, /ch04-tens: helpIntroNotTen is a line/, /ch04-riddle: ground is "sand", "earth", "mud", "grit" or "log"/, /ch04-riddle: picture ground is/]) assert.match(errs, want);
});

test('chapter 4’s skip-counts: the rim by tens keeps its totals; the promise reaches 30 on its third tap, in her own balloon; the bedtime tens are both forepaws together, trailing off; Squall’s forepaw is one tap, and its 5 stays on the roof; nothing is logged', () => {
  const st4 = story4(), { ch04 } = st4, F = ch04.frames;
  // the rim
  const rim = F.g04.skip;
  assert.deepEqual([E.skipView(rim, 5).count, E.skipView(rim, 5).totals, E.skipView(rim, 3).highlight], ['10… 20… 30… 40… 50!', [10, 20, 30, 40, 50], 30]);
  assert.deepEqual(rim.who.map(w => w.who), ['clancat', 'clancat', 'clancat', 'clancat', 'grizzled'], 'four Clan cats and the old tom');
  assert.ok(!JSON.stringify(rim.who).includes('murmurchime'), 'Murmurchime is on patrol');
  assert.deepEqual(E.skipPicture(rim, 2), { table: 10, groups: 5, per: 10, highlight: 20, totals: true, next: true, who: rim.who, thing: 'claw', things: 'claws' });
  assert.deepEqual(E.skipWords(rim, 'tallyheart'), { teacher: 'tallyheart', whisper: false, thing: 'claw', things: 'claws', label: 'Count the next cat.',
    aria: 'Counting picture: five groups of ten. Touch the glowing one.', prompt: '**Tap** the cats, left to right.' });
  assert.deepEqual(E.skipWords({ table: 10, groups: 5, next: 'x' }).things, 'claws', 'claws by default on the 10s');
  assert.deepEqual([E.keptSkip(ch04, 'g05').id, E.keptSkip(ch04, 'g06').id, E.keptSkip(ch04, 'g07')], ['g04', 'g04', null], 'the totals stay for “every number you land on ends in a zero”');
  assert.deepEqual(E.keptPicture(rim), { table: 10, groups: 5, per: 10, highlight: 50, totals: true, next: false, who: rim.who, thing: 'claw', things: 'claws' });
  assert.equal(E.skipInto(ch04, 'g05'), rim, 'FIFTY! shows the 50');
  // the promise: three taps, a friend's two forepaws each, the count in her own balloon
  const promise = F.b05.skip;
  const pv = [0, 1, 2, 3].map(n => E.skipView(promise, n));
  assert.deepEqual(pv.map(v => [v.total, v.count, v.done]), [[0, '', false], [10, '10…', false], [20, '10… 20…', false], [30, '10… 20… 30!', true]]);
  assert.ok(pv.every(v => v.paws === 'pile'));
  assert.deepEqual(E.skipPicture(promise, 2), { table: 10, groups: 3, per: 10, highlight: 20, totals: true, next: true, who: undefined, thing: 'claw', things: 'claws', paws: 'promise', taps: 2 });
  const pw = E.skipWords(promise, 'riffle');
  assert.deepEqual([pw.teacher, pw.whisper, pw.label, pw.aria, pw.prompt], ['player', false, 'Count the next friend.', 'Six forepaws in a pile. Touch the glowing pair.', '**Tap** the paws.']);
  assert.equal(E.skipInto(ch04, 'b06'), promise, '“A thirty-claw promise!” shows the 30');
  // the bedtime tens: her two forepaws patted down together, ten claws a tap, the count in her murmur
  const bed = F.h03.skip;
  const bv = [0, 1, 5].map(n => E.skipView(bed, n));
  assert.deepEqual(bv.map(v => [v.paws, v.lit, v.nextPaw, v.total, v.count]), [['both', null, 'both', 0, ''], ['both', 'both', 'both', 10, '10…'], ['both', 'both', null, 50, '10… 20… 30… 40… 50…']]);
  assert.deepEqual(E.skipPicture(bed, 1), { table: 10, groups: 5, per: 10, highlight: 10, totals: false, next: true, who: undefined, thing: 'claw', things: 'claws', paws: 'own', both: true, taps: 1, lit: 'both', nextPaw: 'both' });
  const bw = E.skipWords(bed, 'snorer');
  assert.deepEqual([bw.teacher, bw.whisper, bw.label, bw.aria], ['player', true, 'Tap your forepaws.', 'Your two forepaws on the moss. Touch them.'], 'her own murmur, whoever spoke first on the frame');
  // Squall's forepaw: one tap, five claws, a big 5; the page it turns to (under the bridge) shows no number
  const paw = F.r06.skip;
  assert.deepEqual([E.skipView(paw, 1).total, E.skipView(paw, 1).done, E.skipView(paw, 1).count], [5, true, '5!']);
  assert.deepEqual(E.skipPicture(paw, 0), { table: 5, groups: 1, per: 5, highlight: 0, totals: true, next: true, who: [{ who: 'squall' }], thing: 'claw', things: 'claws' });
  assert.deepEqual([E.skipWords(paw, 'squall').label, E.skipWords(paw, 'squall').teacher], ['Tap his forepaw.', 'squall']);
  assert.equal(E.skipInto(ch04, 'b01'), null, '`carry: false`: the roof’s 5 stays on the roof');
  assert.equal(E.skipInto(ch04, 'h04').paws, 'both', 'By fifty, he’s snoring: the 50 is carried');
  // none of them logs an answer; chapter 3's own-paws hop is as it was
  const cat = start4(cat4(st4), st4);
  const rows = read4(cat, st4, { choices: { g27: 0 } });
  for (const id of ['g04', 'r06', 'b05', 'h03']) { const i = rows.findIndex(r => r.id === id); assert.equal(rows[i + 1].counts, rows[i].counts, id + ' logs nothing'); }
  assert.deepEqual([E.skipWords({ table: 5, groups: 4, paws: 'own', next: 'x' }).label, E.skipWords({ table: 2, groups: 5, next: 'x' }).label, E.skipWords({ table: 5, groups: 5, next: 'x' }).label],
    ['Tap your next forepaw.', 'Count the next cat', 'Count the next paw']);
  const bad = clone(ch04); bad.frames.b05.skip.paws = 'heap'; bad.frames.r06.skip.carry = 'no'; bad.frames.g04.skip.prompt = ['Tap']; bad.frames.h03.skip.label = 5;
  const errs = E.checkStory(bad, st4.list).join('\n');
  for (const want of [/b05: skip paws is "own", "both", "pile", "board", "log" or "mud"/, /r06: skip carry is true or false/, /g04: skip prompt is a line/, /h03: skip label is a line/]) assert.match(errs, want);
});

test('scene options from the cat: `bark: "auto"` is her own cards, the ones her Case File shows, in its order (never a count the art would have to guess cards for); a `cards` list is the row as the story lays it, without the entries that are not hers', () => {
  const st4 = story4(), { ch04, list } = st4;
  const scene = { set: 'den', cam: 'nest', opts: { bark: 'auto', hidden: true, stone: 'auto' }, cast: [] };
  assert.deepEqual(E.resolveScene(scene, E.blankCat({}), list).opts.bark, []);
  const cat = start4(cat4(st4, { specialty: 'noticing', ch2Stone: 'chin' }), st4);
  read4(cat, st4, { choices: { g27: 0 } });
  const res = E.resolveScene(scene, cat, list).opts;
  assert.deepEqual([res.hidden, res.stone], [true, 'chin'], '`hidden` is the art’s (two of them under the moss)');
  assert.deepEqual(res.bark, E.cards(cat, list).map(c => ({ picture: c.picture, mark: c.mark })), 'her file, card for card');
  assert.equal(res.bark.length, 9, 'nine cards');
  assert.deepEqual(res.bark.filter(c => c.mark === 'ear').length, E.cards(cat, list).filter(c => c.mark === 'ear').length, 'each with its own mark');
  assert.equal(scene.opts.bark, 'auto', 'the story’s own scene is never changed');
  const plain = { set: 'hollow', cam: 'sand', opts: { bark: 'row' }, cast: [] };
  assert.equal(E.resolveScene(plain, cat, list), plain, 'a value other than "auto" stays as written');
  // the row is her file as it stands: a cat partway through holds fewer, and a card her file hides is not in it
  const part = start4(cat4(st4, { ch3Told: false }), st4);
  read4(part, st4, { choices: { g27: 0 }, stop: 'r06' });
  delete part.flags.foundSquall;
  while (part.frame !== 'g27') assert.ok(E.back(part, ch04));
  assert.ok(E.hasCard(part, 'squall-shapes') && !E.resolveScene(scene, part, list).opts.bark.some(c => c.picture === 'squall-shapes'), 'held, hidden: not along her nest');
  // a `cards` list (the hollow's row on the sand): ids and { id, when } entries, as a row of bark is written
  const row = { set: 'hollow', cam: 'sand', opts: { bark: 'row', cards: ['four-a-night', { id: 'dug-earth', when: { specialty: 'noticing' } }, 'fox-flew', 'made-up'], blank: 1 }, cast: [] };
  const noticing = E.resolveScene(row, cat, list), other = E.resolveScene(row, start4(cat4(st4, { specialty: 'friends' }), st4), list);
  assert.deepEqual(noticing.opts.cards, [{ picture: 'four-a-night', mark: 'eye' }, { picture: 'dug-earth', mark: 'eye' }, { picture: 'fox-flew', mark: 'ear' }, { picture: 'made-up', mark: 'eye' }],
    'each entry that is hers, with its definition’s picture and mark (a card nobody defines keeps its id, and an eye)');
  assert.deepEqual(other.opts.cards.map(c => c.picture), ['four-a-night', 'fox-flew', 'made-up'], 'a cat who is not noticing has no dug earth in the row');
  assert.deepEqual([noticing.opts.bark, noticing.opts.blank], ['row', 1], 'the rest of the options are as written');
  assert.deepEqual(E.resolveScene(row, E.blankCat({}), list).opts.cards.map(c => c.picture), ['four-a-night', 'fox-flew', 'made-up'], 'whether or not she holds the cards yet: the picture is the story’s');
  assert.equal(typeof row.opts.cards[0], 'string', 'the story’s own list is never changed');
});

test('finding him later: a later chapter runs the roof’s frames with chapter 4’s riddle and card; E.checkStory accepts them when it is given the other chapters; his page and his card come with the flag', () => {
  const st4 = story4(), { ch04, list } = st4;
  // chapter 5, in miniature: one frame for a cat who has not found him, offering the roof again, then chapter 4's roof frames as a block
  const block = {};
  ['r02', 'r03', 'r04', 'r05', 'r06'].forEach(id => { block[id] = clone(ch04.frames[id]); });
  block.r06.skip.next = 'z1';
  const ch05 = { id: 'ch05', number: 5, title: 'Riffle’s River', start: 'a1', names: clone(ch04.names),
    frames: Object.assign({
      a1: { caption: ['Tomorrow has come.'], next: 'a2' },
      a2: { when: { foundSquall: false }, caption: ['RAWWWRRR… hic! The roar again.'], choice: { options: [{ label: 'Go up and find him.', next: 'r02' }, { label: 'Not today.', next: 'z1' }] } },
      z1: { caption: ['The raft.'], next: 'z2' }, z2: { end: true }
    }, block), counts: {}, book: { recap: [] } };
  // the offer is a choice only some cats see: a frame with `when` needs one way on, or an `else` (where everyone else goes)
  assert.match(E.checkStory(ch05, list).join('\n'), /a2: a frame with when needs exactly one way on \(next\), or an else/);
  ch05.frames.a2.else = 'z1';
  const wrong = clone(ch05); wrong.frames.a2.else = 'nowhere'; wrong.frames.z1.else = 'z2';
  assert.match(E.checkStory(wrong, list).join('\n'), /a2 -> missing nowhere \(else\)[\s\S]*z1: else goes with a when/);
  const alone = E.checkStory(ch05).join('\n');
  assert.match(alone, /r03: unknown counts set ch04-riddle/);
  assert.match(alone, /r05: unknown card squall-shapes/);
  assert.deepEqual(E.checkStory(ch05, list), [], 'with the other chapters beside it, the set and the card are found');
  const all = list.concat([ch05]);
  // a cat who said "Not today" in chapter 4 finds him in chapter 5
  const cat = start4(cat4(st4), st4);
  read4(cat, st4, { choices: { g27: 1 } });
  assert.ok(!cat.flags.foundSquall);
  E.startChapter(cat, ch05, 5000);
  const seq = read4(cat, { ch04: ch05, list: all }, { answers: { '7x5': [34] }, t: 5000 }).map(r => r.id);
  assert.deepEqual(seq, ['a1', 'a2', 'r02', 'r03', 'r04', 'r05', 'r06', 'z1', 'z2']);
  assert.equal(cat.flags.foundSquall, true);
  assert.deepEqual(cat.cards[cat.cards.length - 1], { id: 'squall-shapes', chapter: 'ch05', at: cat.cards[cat.cards.length - 1].at }, 'the card remembers the chapter that gave it');
  assert.deepEqual(E.cards(cat, all).filter(c => c.id === 'squall-shapes').map(c => [c.line, c.mark]), [['Squall says two skinny shapes carry something to the tracks.', 'ear']], 'its definition is chapter 4’s');
  assert.deepEqual(E.dragonets(cat, all).found.map(d => d.id), ['sprinkle', 'squall']);
  assert.ok(cat.lessons['ch04-riddle'] && cat.lessons['ch04-riddle'].finished, 'the riddle, asked in chapter 5');
  assert.deepEqual(cat.counts.filter(e => e.set === 'ch04-riddle').map(e => e.a + 'x' + e.b + (e.correct ? '' : '✗')), ['7x5✗', '1x5', '5x3', '7x5']);
  assert.equal(label4({ who: 'squall' }, cat, ch05), 'The little dragon', 'chapter 5 labels him as chapter 4 does');
  // Back from the raft goes back through the roof (its frames have no `when`), and past the offer, which is no longer hers
  assert.deepEqual(walkBack(clone(cat), ch05), ['z1', 'r06', 'r05', 'r04', 'r03', 'r02', 'a1']);
  // one who says "Not today" again goes on, and is offered it the next time
  const later = start4(cat4(st4), st4);
  read4(later, st4, { choices: { g27: 1 } });
  E.startChapter(later, ch05, 5000);
  assert.deepEqual(read4(later, { ch04: ch05, list: all }, { choices: { a2: 1 }, t: 5000 }).map(r => r.id), ['a1', 'a2', 'z1', 'z2']);
  assert.ok(!later.flags.foundSquall);
  // a cat who found him in chapter 4 never sees the offer
  const met = start4(cat4(st4), st4);
  read4(met, st4, { choices: { g27: 0 } });
  E.startChapter(met, ch05, 5000);
  assert.deepEqual(read4(met, { ch04: ch05, list: all }, { t: 5000 }).map(r => r.id), ['a1', 'z1', 'z2']);
});

test('the grown-ups corner: words for the flags a frame sets (found Squall, caught the fox’s “flew”) and for her Case File; the engine’s own flag is never listed', () => {
  require('../app/ui.js');
  const W = PC.ui.flagWords, { ch04 } = story4();
  Object.entries(ch04.frames).forEach(([id, f]) => Object.entries(f.sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v)));
  assert.match(W.foundSquall.true, /^found Squall on the tower roof/);
  assert.match(W.ch4CaughtFly.true, /^caught the fox’s “flew”/);
  assert.ok(W.caseFile.true);
  assert.deepEqual(PC.ui.quietFlags, { looked: 1, caseFileOpen: 1 });
  // her cards, as the corner lists them: every card she was given, one her file does not show yet marked so
  const st4 = story4(), cat = start4(cat4(st4), st4);
  read4(cat, st4, { choices: { g27: 0 }, stop: 'r06' });
  // (Back to the choice, as she would go: the frame that gave the card is then no longer behind her)
  delete cat.flags.foundSquall;
  while (cat.frame !== 'g27') assert.ok(E.back(cat, ch04));
  assert.deepEqual(E.cards(cat, st4.list, { all: true }).filter(c => !c.shown).map(c => c.id), ['squall-shapes']);
  assert.ok(!E.cards(cat, st4.list).some(c => c.id === 'squall-shapes'));
});

/* ================================================================ chapter 5 (docs/build.md, "Chapter 5 (v0.4)")
 * First, the proof that chapters 1 to 4 play exactly as they did: ten whole readings, recorded with
 * the engine chapter 4 shipped with (tests/fixtures/make-ch04-golden.js), compared digest by digest.
 * Then chapter 5's contract, on the fixture chapter 5 (tests/fixtures/chapters.js) beside the real
 * chapters 1 to 4. */
const { runs4: golden4Runs, compact4: golden4Compact, SCRIPTS4 } = require('./fixtures/make-ch04-golden.js');
const GOLDEN4 = require('./fixtures/ch04-golden.json');

test('chapters 1 to 4 play exactly as they did before chapter 5’s engine: every frame and what it shows (its card, her Case File, the pages she taps), every skip-count tap by tap, every question, picture, line and help, the Hollow, the book and the cat (tests/fixtures/ch04-golden.json)', () => {
  const S = realStories();
  assert.equal(GOLDEN4.engine, '0.4.0 (chapter 4, 2026-10-10)', 'recorded with the engine chapter 4 shipped with');
  assert.equal(GOLDEN4.runs.length, SCRIPTS4.length);
  // Chapter 7 (its spec, section 7, item 2 (a′)): this golden hashes every card's link as chapter 4 wrote it,
  // `when` and all, and chapter 7 widened `fox-flew`'s to either flag. So the readings run with that one
  // condition as chapter 4 shipped it (set back, and restored in the finally), and never re-recorded; and
  // at every frame of every reading the two conditions agree, so setting it back hides nothing.
  const link = S.ch04.cards['fox-flew'].link, now7 = link.when, then4 = { ch4CaughtFly: true };
  assert.deepEqual(now7, { not: { ch4CaughtFly: false, ch7Flew: false } });
  const caseFile = E.caseFile;
  let checked = 0, got, nows;
  link.when = then4;
  E.caseFile = function (cat) {
    assert.equal(E.matches(then4, cat), E.matches(now7, cat), 'at ' + (cat && cat.chapter) + ' ' + (cat && cat.frame) + ': chapter 4’s condition and chapter 7’s draw the same link');
    checked++;
    return caseFile.apply(E, arguments);
  };
  // (digested inside: the records hold the card definitions' own link objects)
  try { got = golden4Runs(E, [S.ch01, S.ch02, S.ch03, S.ch04]); nows = got.map(r => golden4Compact(r.run)); } finally { link.when = now7; E.caseFile = caseFile; }
  assert.equal(S.ch04.cards['fox-flew'].link.when, now7, 'set back as it is');
  const frames4 = got.reduce((n, r) => n + Object.values(r.run.frames).reduce((m, f) => m + f.length, 0), 0);
  assert.ok(checked >= frames4 && frames4 > 2000, 'checked at every frame: ' + checked + ' of ' + frames4);
  assert.ok(got.some(r => r.run.cat.flags.ch4CaughtFly) && got.some(r => !r.run.cat.flags.ch4CaughtFly), 'with the flag and without it');
  got.forEach((r, i) => {
    const now = nows[i], then = GOLDEN4.runs[i].run, name = GOLDEN4.runs[i].name;
    assert.equal(r.name, name);
    assert.deepEqual(now.frames, then.frames, name + ': the same frames, in the same order');
    Object.keys(then.shown).forEach(ch => {
      const a = now.shown[ch].split(' '), b = then.shown[ch].split(' ');
      b.forEach((h, n) => assert.equal(a[n], h, name + ': what ' + ch + ' ' + then.frames[ch][n] + ' shows (its scene, captions, balloons, options, its card, her Case File, its skip-count tap by tap, the page she taps)'));
    });
    assert.deepEqual(Object.keys(now.lessons), Object.keys(then.lessons), name + ': the same lessons');
    Object.keys(then.lessons).forEach(l => assert.deepEqual(now.lessons[l], then.lessons[l], name + ': ' + l + ', question by question (its picture, its words, its result, its whole help)'));
    assert.deepEqual(now.hollow, then.hollow, name + ': the Training Hollow, its rounds and its lines');
    assert.deepEqual([now.book, now.cat, now.status, now.extra, now.flags], [then.book, then.cat, then.status, then.extra, then.flags], name + ': her book, the cat at the end, the status, her cards and her file, the flags');
  });
  // the readings cover what chapter 4 can make of a cat: every specialty, both ways at the tower, the eye and the ear
  const flags = got.map(r => r.run.cat.flags);
  assert.deepEqual([...new Set(flags.map(f => f.specialty))].sort(), ['climbing', 'friends', 'noticing', 'sneaking', 'swimming']);
  assert.deepEqual([...new Set(flags.map(f => [f.ch3Told, !!f.foundSquall, !!f.ch4CaughtFly].join('/')))].sort(),
    ['false/false/false', 'false/true/false', 'false/true/true', 'true/false/false', 'true/false/true', 'true/true/false', 'true/true/true']);
  assert.ok(got.every(r => !Object.keys(r.run.cat.flags).some(k => /^ch5|foundPuddle|foundWisp/.test(k))), 'nothing of chapter 5 in a chapter-4 reading');
});

/* The fixture chapter 5 beside the real chapters 1 to 4 (it runs chapter 4's roof, borrows the 10s, the
 * 5s, the 2s and the 1s, and lays a card beside chapter 4's `fox-moon`). */
function story5() {
  const S = realStories(), fx = fixtures();
  return { ch01: S.ch01, ch02: S.ch02, ch03: S.ch03, ch04: S.ch04, ch05: fx.ch05, list: [S.ch01, S.ch02, S.ch03, S.ch04, fx.ch05] };
}
/* A cat who has read chapters 1 to 4: `flags` on top of a sneaking, talkative cat who went under the
 * bridge and told; her Case File as chapter 4 left it (the dug earth and the fox's FLEW caught for a
 * noticing cat, Squall's card for one who found him); `tens`/`tensMs`: her answers and times in
 * chapter 4's tens lesson, by fact. */
function cat5(st5, flags, tens, tensMs) {
  const cat = E.blankCat({ now: 1, id: 'c5' });
  cat.name = 'Moon'; cat.petname = 'Muffin';
  cat.finished = { ch01: 1, ch02: 2, ch03: 3, ch04: 4 };
  Object.assign(cat.flags, { specialty: 'sneaking', worry: 'talk', ch2Path: 'bridge', ch2Stone: 'nose', ch3Told: true, caseFile: true, caseFileOpen: true });
  if (flags && flags.specialty === 'noticing') cat.flags.ch4CaughtFly = true;
  Object.assign(cat.flags, flags || {});
  ['ch01-tails', 'ch02-ears', 'ch03-claws'].forEach(id => { cat.lessons[id] = { finished: true, noHelp: true }; });
  ['four-a-night', 'tidy'].concat(cat.flags.specialty === 'noticing' ? ['dug-earth'] : [], ['scale', 'fox-flew', 'fox-moon'], cat.flags.foundSquall ? ['squall-shapes'] : [], ['sprinkle-scales', 'cant-fly'])
    .forEach((id, i) => E.giveCard(cat, id, 'ch04', 100 + i));
  const { def, state } = E.chapterLesson(cat, st5.ch04, 'ch04-tens', 1, st5.list), seen = {};
  while (!E.counts.done(state)) {
    const q = E.counts.question(state), k = q.a + 'x' + q.b, i = seen[k] = (seen[k] || 0) + 1;
    const a = tens && tens[k] && tens[k][i - 1] != null ? tens[k][i - 1] : q.answer;
    E.logAnswer(cat, E.counts.answer(state, E.questionDef(def, q, st5.ch04, st5.list), a, tensMs && tensMs[k] != null ? tensMs[k] : 2000, 1).entry);
  }
  cat.lessons['ch04-tens'] = E.counts.summary(state);
  return cat;
}
/* A lesson's rows, answer by answer, as the page asks it (as lesson4): its words with their speakers'
 * labels (a caption has none), its picture, the steps its picture plays as it is asked, its result,
 * and after a miss the whole help. */
function lesson5(cat, st5, def, st, answers, ms) {
  const { ch05, list } = st5, seen = {}, out = [];
  while (!E.counts.done(st)) {
    const q = E.counts.question(st), k = q.a + 'x' + q.b;
    const i = seen[k] = (seen[k] || 0) + 1;
    const a = answers && answers[k] && answers[k][i - 1] != null ? answers[k][i - 1] : q.answer;
    const t = ms && ms[k] != null ? ms[k] : (ms && ms.all) || 2000;
    const D = E.questionDef(def, q, ch05, list);
    const prompt = E.promptLines(def, D, q).map(l => Object.assign({}, l, { label: l.who ? label4({ who: l.who }, cat, ch05) : null, text: E.fill(l.text, cat) }));
    const picture = E.lessonPicture(D, q, q.lit || 0), light = E.lightSteps(D, q);
    const r = E.counts.answer(st, D, a, t, 1);
    E.logAnswer(cat, r.entry);
    const row = { k: (q.filler ? 'F:' : q.retry ? 'R:' : '') + k + (r.correct ? '' : '✗'), q, D, prompt, picture, light, line: E.fill(r.line, cat), kind: r.lineKind,
      balloons: (r.balloons || []).map(b => Object.assign({}, b, { text: E.fill(b.text, cat) })), res: r, teacher: E.teacherOf(def, D), shows: r.shows ? r.shows.answers : null };
    if (!r.correct) { row.help = E.helpPlan(def, D, q, r); row.steps = E.helpSteps(row.help); }
    out.push(row);
    if (r.done) E.recordLesson(cat, st);
    else cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: ch05.id, state: st };
  }
  return out;
}
function play5(cat, st5, setId, answers, ms) {
  const { def, state } = E.chapterLesson(cat, st5.ch05, setId, 1, st5.list);
  return lesson5(cat, st5, def, state, answers, ms);
}
/* Read the fixture chapter 5 from where she is to its end (or to `stop`, before acting on it): what
 * every frame shows her. `choices: { o10: 1 }` picks an option (the first unless it says); `answers`:
 * wrong answers by fact, for every lesson on the way. A skip-count, a one-tap frame and the page of
 * questions are tapped through. */
function read5(cat, st5, o) {
  const { ch05, list } = st5, rows = [];
  o = o || {};
  let t = o.t || 1000;
  for (let guard = 0; guard < 400; guard++) {
    const id = E.frameId(cat, ch05), f = ch05.frames[id], kind = E.kindOf(f);
    const row = { id, kind, f, caps: E.captions(f, cat).map(c => E.fill(c, cat)),
      // (a speaker's coat and name come from the cast, as on the page: the nth balloon from a who is the nth of them)
      say: E.balloons(f, cat).map(b => {
        const mine = ((f.scene && f.scene.cast) || []).filter(c => c && c.who === b.who), m = mine[b.nth] || mine[0];
        return { who: b.who, label: label4(Object.assign({}, b, { variant: m && m.variant }), cat, ch05), text: E.fill(b.text, cat), kind: b.kind };
      }),
      cards: E.cardsOn(f, cat, ch05, list), file: E.cards(cat, list).map(c => c.id), counts: cat.counts.length, sfx: f.sfx || '',
      scene: f.scene ? E.resolveScene(f.scene, cat, list) : null };
    rows.push(row);
    if ((o.stop && id === o.stop) || kind === 'end') break;
    t += 10;
    if (kind === 'skip') { row.skip = E.skipFor(f.skip, cat); assert.ok(E.next(cat, ch05, t), id); }
    else if (kind === 'ask') { row.asked = []; for (let n = 1; n <= E.askView(f.ask, 99).total; n++) row.asked.push(E.askView(f.ask, n).pair); assert.ok(E.next(cat, ch05, t), id); }
    else if (kind === 'next' || kind === 'file') assert.ok(E.next(cat, ch05, t), id);
    else if (kind === 'scratch') { row.tap = E.tapWords(f); for (let c; (c = E.scratchTap(cat, ch05, t));) assert.fail('no row of bark in chapter 5: ' + c); assert.ok(E.next(cat, ch05, t), id); }
    else if (kind === 'choice') {
      const opts = E.options(f, cat);
      row.options = opts.map(x => E.fill(E.optionLabel(x.option, cat), cat));
      row.picked = (o.choices && o.choices[id]) || 0;
      assert.ok(E.choose(cat, ch05, opts[row.picked].index, t), id);
    } else if (kind === 'input') assert.ok(E.submitInput(cat, ch05, o.dream || '', t), id);
    else if (kind === 'counts') {
      const r = E.chapterLesson(cat, ch05, f.counts.set, t, list);
      E.beginLesson(cat, ch05, id, r.state);
      row.lesson = lesson5(cat, st5, r.def, r.state, o.answers, o.ms);
      assert.ok(E.finishCounts(cat, ch05, cat.lessons[f.counts.set], t), id);
    } else assert.fail('a frame of kind ' + kind + ' at ' + id);
  }
  return rows;
}
/* Everything a reading put on screen, as text (as words4). */
function words5(rows) {
  const out = [];
  rows.forEach(r => {
    out.push(...r.caps, ...r.say.map(b => b.label + ': ' + b.text), ...(r.options || []), ...r.cards.map(c => c.line), r.sfx);
    (r.asked || []).forEach(p => out.push(...p));
    (r.lesson || []).forEach(l => out.push(...l.prompt.map(p => (p.label || '') + ': ' + p.text), l.line, ...l.balloons.map(b => b.text), l.help ? l.help.intro : ''));
  });
  return out.join('\n');
}
const start5 = (cat, st5) => { E.startChapter(cat, st5.ch05, 500); return cat; };
const frame5 = (rows, id) => rows.find(r => r.id === id);
const ids5 = rows => rows.map(r => r.id);
/* The choices of a reading, by what she does: the roof (`up`), the witness (`first`: 'otters' |
 * 'heron'), the raft after the Roar (`lean`), Riffle's slip (`ask`), and how far she waits in the
 * reeds (`wait`: 0 yells at once, 1 after the dragonfly, 2 at the knees, 3 waits for the blink). */
function choices5(c) {
  return { t01: c.up ? 0 : 1, o10: c.lean ? 0 : 1, w01: c.first === 'heron' ? 1 : 0, s01: c.ask ? 0 : 1, m18: c.wait >= 1 ? 0 : 1, k02: c.wait >= 2 ? 0 : 1, k03: c.wait >= 3 ? 0 : 1 };
}

test('chapter 5 (the fixture) is sound, and every combination of told or kept, the specialty, the worry, Squall met before or not, the roof, the witness first, the two raft choices and the four ways through the reeds reaches the end with no frame that shows nothing; both orders give the same cards; “What the otters heard” is read exactly once, and Tallyheart is in none of its frames', () => {
  const st5 = story5(), { ch05, list } = st5;
  assert.deepEqual(E.checkStory(ch05, list), []);
  const lengths = new Set(), cardCounts = new Set();
  // forty cats (told or kept, five specialties, four worries) and thirty-six routes (Squall met before,
  // or the roof today, or not; the raft three ways; the reeds four): every cat walks a third of the
  // routes and every route is walked by a third of the cats, each in both orders
  const CATS = [], ROUTES = [];
  for (const ch3Told of [true, false]) for (const specialty of ['noticing', 'sneaking', 'climbing', 'swimming', 'friends']) for (const worry of ['small', 'water', 'talk', 'shiny']) CATS.push({ ch3Told, specialty, worry });
  for (const squall of ['met', 'up', 'no']) for (const raft of ['lean', 'ask', 'fine']) for (const wait of [0, 1, 2, 3]) ROUTES.push({ met: squall === 'met', up: squall === 'up', raft, wait });
  let walks = 0;
  CATS.forEach((who, ci) => ROUTES.forEach((route, ri) => {
    if ((ci + ri) % 3) return;
    const { ch3Told, specialty, worry } = who, { met, up, raft, wait } = route, byOrder = {};
    for (const first of ['otters', 'heron']) {
      const c = { ch3Told, specialty, worry, met, up, lean: raft === 'lean', ask: raft === 'ask', wait, first }, name = JSON.stringify(c);
      const cat = start5(cat5(st5, Object.assign({ ch3Told, specialty, worry }, met ? { foundSquall: true } : {})), st5);
      const before = cat.cards.length, rows = read5(cat, st5, { choices: choices5(c) });
      walks++;
      assert.equal(rows[rows.length - 1].id, 'd15', name);
      assert.ok(E.isFinished(cat, 'ch05'), name);
      // (a page of choices shows its options: her one more question for the heron has a screen of its own)
      rows.forEach(r => assert.ok(r.caps.length || r.say.length || r.lesson || r.options || ['input', 'end'].includes(r.kind), name + ': ' + r.id + ' shows nothing'));
      // the flags are what she did, and nothing else
      assert.deepEqual([!!cat.flags.ch5Roof, !!cat.flags.foundSquall, !!cat.flags.foundPuddle, !!cat.flags.foundWisp, cat.flags.ch5First], [up, met || up, raft !== 'fine', wait === 3, first], name);
      // "What the otters heard": exactly once, and never with Tallyheart
      const heard = rows.filter(r => /^h[ab]1$/.test(r.id));
      assert.deepEqual(heard.map(r => r.id), [first === 'otters' ? 'ha1' : 'hb1'], name);
      rows.filter(r => /^h[ab]\d/.test(r.id)).forEach(r => assert.ok(!r.say.some(b => b.who === 'tallyheart') && !((r.scene && r.scene.cast) || []).some(m => m.who === 'tallyheart'), name + ': Tallyheart at ' + r.id));
      // her new cards: five, a sixth for a noticing cat or a climber, and one for each dragonet met today
      const fresh = cat.cards.slice(before).map(k => k.id);
      assert.equal(fresh.length, 5 + (specialty === 'noticing' || specialty === 'climbing' ? 1 : 0) + (up ? 1 : 0) + (raft !== 'fine' ? 1 : 0) + (wait === 3 ? 1 : 0), name + ': ' + fresh);
      byOrder[first] = fresh.slice().sort();
      // every lesson on her way is finished: the six every cat counts, and a riddle for each dragonet
      const done = Object.keys(cat.lessons).filter(k => /^ch05/.test(k)).sort();
      assert.deepEqual(done, ['ch05-bill', 'ch05-catch', 'ch05-nines', 'ch05-otter', 'ch05-pile', 'ch05-tens'].concat(raft !== 'fine' ? ['ch05-puddle'] : [], wait === 3 ? ['ch05-wisp'] : []).sort(), name);
      assert.equal(!!cat.lessons['ch04-riddle'], up, name);
      lengths.add(rows.length); cardCounts.add(fresh.length);
    }
    assert.deepEqual(byOrder.otters, byOrder.heron, 'the same cards in both orders');
  }));
  assert.deepEqual([CATS.length, ROUTES.length, walks], [40, 36, 960]);
  assert.deepEqual([...cardCounts].sort(), [5, 6, 7, 8, 9]);
  assert.ok(lengths.size >= 12, 'the paths differ in length: ' + [...lengths].sort((a, b) => a - b));
  // the hub: after chapter 4, chapter 5 is the big button; afterwards chapter 6 is coming soon
  assert.equal(E.progress(cat5(st5), list).next.id, 'ch05');
  const done = start5(cat5(st5), st5); read5(done, st5);
  const p = E.progress(done, list);
  assert.deepEqual([p.next, p.soon && p.soon.title, p.latest.id, E.status(done, list)], [null, 'Chapter 6: The Snake in the Stones', 'ch05', 'Chapter 5 finished']);
});

test('the roof, offered again: the offer shows to a cat who has not met Squall and, with chapter 4’s labels, to one who met him in this chapter; never to one who met him in chapter 4 only, and never straight after the roof; “Not today” leads to Waffles’ “AGAIN, {petname}?” and then to the Crossing', () => {
  const st5 = story5(), { ch05, list } = st5, t01 = ch05.frames.t01;
  // the frame's `when`: not (foundSquall and no ch5Roof); `false` reads as unset
  const not = t01.when;
  assert.deepEqual(not, { not: { foundSquall: true, ch5Roof: false } });
  assert.deepEqual([{}, { foundSquall: true }, { foundSquall: true, ch5Roof: true }, { ch5Roof: true }].map(flags => E.shows(t01, { flags })), [true, false, true, true]);
  assert.equal(t01.else, 'c01');
  // a cat who has not met him: the roar, "still up there", and chapter 4's choice, worded for today
  const fresh = start5(cat5(st5), st5), a = read5(fresh, st5, { stop: 't01' });
  const offer = read5(fresh, st5, { stop: 'c01', choices: { t01: 1 } });
  assert.deepEqual(ids5(offer), ['t01', 'n01', 'c01']);
  assert.deepEqual([offer[0].sfx, offer[0].caps, offer[0].options], ['RAWWWRRR… hic!', ['Sprinkle’s littlest brother is still up there.'], ['Go up and find him. The river can wait a little.', 'Not today. Riffle is waiting.']]);
  assert.deepEqual(offer[1].say, [{ who: 'waffles', label: 'Princess Waffles', text: 'AGAIN, Muffin?', kind: 'shout' }]);
  assert.ok(!fresh.flags.foundSquall && !fresh.flags.ch5Roof && a.length);
  // a climber reads her own line there too
  const climber = start5(cat5(st5, { specialty: 'climbing' }), st5);
  assert.deepEqual(frame5(read5(climber, st5, { stop: 't01' }), 't01').caps, ['Sprinkle’s littlest brother is still up there.', 'Balcony, balcony, balcony, roof. You could still climb that.']);
  // going up runs chapter 4's roof (a climber climbs, everyone else rides the little room), sets both flags
  // on its last frame, and goes to the Crossing: the offer is not read again
  const up = start5(cat5(st5), st5), roof = read5(up, st5, { stop: 'c02' });
  assert.deepEqual(ids5(roof).slice(ids5(roof).indexOf('t01')), ['t01', 'r01', 'r02', 'r03', 'r04', 'r05', 'r06', 'c01', 'c02']);
  assert.deepEqual([up.flags.foundSquall, up.flags.ch5Roof], [true, true]);
  assert.deepEqual(frame5(roof, 'r03').lesson.map(r => r.k), ['7x5'], 'chapter 4’s riddle, as built there');
  assert.equal(frame5(roof, 'r03').lesson[0].prompt[0].label, 'The little dragon', 'chapter 5 carries the same `names`');
  assert.ok(E.hasCard(up, 'squall-shapes') && up.cards.find(c => c.id === 'squall-shapes').chapter === 'ch05', 'chapter 4’s card, given here');
  assert.deepEqual(ids5(read5(start5(cat5(st5, { specialty: 'climbing' }), st5), st5, { stop: 'r03' })).slice(-3), ['t01', 'r02', 'r03'], 'a climber takes the outside');
  // Back from the roof before its last frame, then "Not today": no flag, and the card is out of her file
  const half = start5(cat5(st5), st5);
  read5(half, st5, { stop: 'r05' });
  assert.ok(E.cards(half, list).some(c => c.id === 'squall-shapes'), 'on the roof, the card is going into her file');
  while (half.frame !== 't01') assert.ok(E.back(half, ch05));
  read5(half, st5, { choices: { t01: 1 } });
  assert.ok(!half.flags.foundSquall && !half.flags.ch5Roof && !E.cards(half, list).some(c => c.id === 'squall-shapes'));
  assert.ok(!E.dragonets(half, list).found.some(d => d.id === 'squall'), 'and no page for him in her book');
  // a cat who met him in chapter 4 reads no screen here: from "ask your river" straight to the Crossing
  const met = start5(cat5(st5, { foundSquall: true }), st5), straight = ids5(read5(met, st5, { stop: 'c03' }));
  assert.deepEqual(straight.slice(-3), ['h08', 'c01', 'c03'], 'no offer, and no "I found Squall!" (she told Riffle yesterday)');
  // a second reading by a cat who met him here: the roar and the choice, with the labels of a cat who knows him
  E.startChapter(up, ch05, 9000);
  const again = read5(up, st5, { stop: 'c03', choices: { t01: 1 }, t: 9000 }), o2 = frame5(again, 't01');
  assert.deepEqual([o2.caps, o2.options, o2.sfx], [[], ['Go up and see Squall again.', 'Not today. He’s guarding.'], 'RAWWWRRR… hic!']);
  assert.deepEqual(ids5(again).slice(-5), ['t01', 'n01', 'c01', 'c02', 'c03'], 'either pick is followed by "I found Squall!": it reads the flag');
  assert.equal(frame5(again, 'c02').say[0].text, 'I found Squall! Sprinkle’s littlest brother! He sees two skinny shapes go to the tracks. Every night.');
});

test('“found today”: none is three flags all unset, any is `not` over the three (E.matches reads false as unset); the news under the bridge shows exactly the lines for the dragonets met today, or “anyone new”, with “And Squall.” exactly when she met him in chapter 4; the pale-sister line shows once to a cat without foundWisp and never to one with it; no den line about dragonets without a find today', () => {
  const st5 = story5(), { ch05 } = st5;
  const NONE = { ch5Roof: false, foundPuddle: false, foundWisp: false }, ANY = { not: NONE };
  [[{}, true], [{ foundSquall: true }, true], [{ ch5Roof: true, foundSquall: true }, false], [{ foundPuddle: true }, false], [{ foundWisp: true }, false], [{ foundPuddle: true, foundWisp: true, ch5Roof: true }, false]]
    .forEach(([flags, none]) => assert.deepEqual([E.matches(NONE, { flags }), E.matches(ANY, { flags })], [none, !none], JSON.stringify(flags)));
  assert.deepEqual([ch05.frames.b04.when, ch05.frames.b05.when, ch05.frames.d08.when], [ANY, ANY, ANY]);
  const PALE = /pale sister is the best at hiding/;
  const news = (c, flags) => {
    const cat = start5(cat5(st5, flags), st5), rows = read5(cat, st5, { choices: choices5(c) });
    return { cat, rows, b03: frame5(rows, 'b03').say.map(b => b.label + ': ' + b.text), ids: ids5(rows), words: words5(rows) };
  };
  // nobody today, and nobody ever: "You will. You found me."; the hint on the news frame; no mud count, no den line
  let r = news({ up: false, lean: false, ask: false, wait: 0, first: 'otters' });
  assert.deepEqual(r.b03, ['Moonpaw: I didn’t find anyone new today.', 'Sprinkle: You will. You found me.', 'Sprinkle: My pale sister is the best at hiding. You have to wait till she blinks.']);
  assert.ok(!r.ids.includes('b04') && !r.ids.includes('b05') && !r.ids.includes('d08'));
  assert.equal(r.words.match(new RegExp(PALE.source, 'g')).length, 1);
  assert.match(frame5(r.rows, 'd12').caps.join(' '), /Sprinkle’s littlest brother is still up there/, 'bedtime’s hiccup, for a cat who has still not met him');
  // nobody today, but Squall in chapter 4: "And Squall."; still no count, no den line (a cat who met him yesterday has no news)
  r = news({ up: false, lean: false, ask: false, wait: 1, first: 'heron' }, { foundSquall: true });
  assert.deepEqual(r.b03, ['Moonpaw: I didn’t find anyone new today.', 'Sprinkle: You will. You found me. And Squall.', 'Sprinkle: My pale sister is the best at hiding. You have to wait till she blinks.']);
  assert.ok(!r.ids.includes('b04') && !r.ids.includes('d08'));
  assert.doesNotMatch(frame5(r.rows, 'd12').caps.join(' '), /still up there/);
  // the roof today: her brother's five; the hint after the mud count, never on the news frame
  r = news({ up: true, lean: false, ask: false, wait: 2, first: 'otters' });
  assert.deepEqual(r.b03, ['Moonpaw: I found your littlest brother. He says: five.']);
  assert.deepEqual(frame5(r.rows, 'b05').say.map(b => b.text), ['Mama’s count is coming back.', 'But my pale sister is the best at hiding. You have to wait till she blinks.']);
  assert.equal(r.words.match(new RegExp(PALE.source, 'g')).length, 1);
  assert.deepEqual(frame5(r.rows, 'd08').caps.concat(frame5(r.rows, 'd08').say.map(b => b.text)), ['Then you whisper the rest.', 'That is a LOT of dragon. And a lot to check. Together.']);
  // Puddle today (asked on the way home), by a cat who kept the secret and met Squall in chapter 4
  r = news({ up: false, lean: false, ask: true, wait: 0, first: 'heron' }, { foundSquall: true, ch3Told: false });
  assert.deepEqual(r.b03, ['Moonpaw: Puddle is under the otters’ raft. He says: five. Then he sank.', 'Sprinkle: He does that.']);
  assert.deepEqual([frame5(r.rows, 'd08').caps, frame5(r.rows, 'd08').say], [['You don’t tell her the rest. Your secret is getting bigger.'], []]);
  assert.equal(r.words.match(new RegExp(PALE.source, 'g')).length, 1, 'after the mud count');
  // all three today: a line each, in the day's order, and no hint at all (she has met the pale sister)
  r = news({ up: true, lean: true, ask: false, wait: 3, first: 'otters' });
  assert.deepEqual(r.b03, ['Moonpaw: I found your littlest brother. He says: five.', 'Moonpaw: Puddle is under the otters’ raft. He says: five. Then he sank.', 'Sprinkle: He does that.', 'Moonpaw: Wisp is in the reeds, being a heron. She held up five.']);
  assert.doesNotMatch(r.words, PALE);
  assert.deepEqual(frame5(r.rows, 'b05').say.map(b => b.text), ['Mama’s count is coming back.']);
  // Wisp alone
  r = news({ up: false, lean: false, ask: false, wait: 3, first: 'heron' });
  assert.deepEqual(r.b03, ['Moonpaw: Wisp is in the reeds, being a heron. She held up five.']);
  assert.doesNotMatch(r.words, PALE);
});

test('the mud count: a forepaw for Sprinkle and for every dragonet she has ever met, so two, three or four taps, ending on 10, 15 or 20; the page it turns to shows that number, never 25; seven forepaws are drawn and the rest stay dark; a skip’s `who` can never be empty (E.skipFor)', () => {
  const st5 = story5(), { ch05, list } = st5, raw = ch05.frames.b04.skip;
  assert.equal(raw.groups, undefined, 'the story gives no groups: the count is as long as the cats it is for');
  const cases = [[{ ch5Roof: true, foundSquall: true }, ['sprinkle', 'squall'], 10], [{ foundPuddle: true }, ['sprinkle', 'puddle'], 10], [{ foundWisp: true }, ['sprinkle', 'wisp'], 10],
    [{ foundSquall: true, foundPuddle: true }, ['sprinkle', 'squall', 'puddle'], 15], [{ foundSquall: true, foundWisp: true, foundPuddle: true, ch5Roof: true }, ['sprinkle', 'squall', 'puddle', 'wisp'], 20]];
  cases.forEach(([flags, who, total]) => {
    const cat = { flags }, sk = E.skipFor(raw, cat), n = who.length;
    assert.deepEqual([sk.who, sk.groups], [who.map(w => ({ who: w })), n], JSON.stringify(flags));
    assert.equal(raw.who.length, 4, 'the story’s own skip is never changed');
    // tap by tap: five claw marks a tap, the number in Sprinkle's balloon growing by five
    const counts = [];
    for (let t = 0; t <= n; t++) counts.push(E.skipView(sk, t).count);
    assert.deepEqual(counts, ['', '5…', '5… 10…', '5… 10… 15…', '5… 10… 15… 20…'].slice(0, n).concat([[5, 10, 15, 20].slice(0, n).join('… ') + '!']));
    assert.deepEqual([E.skipView(sk, n).done, E.skipView(sk, n).total, E.skipView(sk, n + 3).total, E.skipReached(sk)], [true, total, total, total]);
    // the picture: chapter 3's forepaws in the mud, seven of them; the first n hers to light, a glow on the next
    const p1 = E.skipPicture(sk, 1), last = E.skipPicture(sk, n);
    assert.deepEqual(p1, { table: 5, groups: n, per: 5, highlight: 5, totals: true, next: true, who: who.map(w => ({ who: w })), thing: 'claw', things: 'claws', paws: 'mud', kind: 'mud', of: 7 });
    assert.deepEqual([last.highlight, last.next, last.groups, last.of], [total, false, n, 7], 'seven are drawn, the first n hers to light; the rest stay dark, and nothing glows once her count is in');
    assert.equal(E.skipWords(sk, 'sprinkle').teacher, 'sprinkle');
  });
  const w = E.skipWords(E.skipFor(raw, {}), 'sprinkle');
  assert.deepEqual([w.label, w.aria, w.prompt, w.thing], ['Count the next forepaw.', 'Seven forepaws in the mud. Touch the glowing one.', '**Tap** a forepaw for everyone you’ve found.', 'claw']);
  assert.equal(w.noNumber, true, 'no big number over the mud: each forepaw has its own 5, 10, 15 under it, and the big one would sit on the next to light');
  // the page it turns to: the number she reached, for this cat (E.skipInto resolves the skip for her)
  const one = { flags: { foundPuddle: true } }, three = { flags: { foundSquall: true, foundPuddle: true, foundWisp: true } };
  assert.deepEqual([E.skipReached(E.skipInto(ch05, 'b05', one)), E.skipReached(E.skipInto(ch05, 'b05', three))], [10, 20], 'never the 25 of five taps');
  assert.equal(E.skipInto(ch05, 'b06', one), null);
  // a cat who met nobody today never reads the count (b04 and b05 are not hers): the page turn past
  // them lands on b06, and a count she never made hands no number on (it showed a big 5, or a 10)
  [{ flags: {} }, { flags: { foundSquall: true } }, { flags: { foundSquall: true, ch5Roof: false, foundPuddle: false, foundWisp: false } }].forEach(nobody => {
    assert.deepEqual([E.shows(ch05.frames.b04, nobody), E.landing(nobody, ch05, 'b04'), E.landing(nobody, ch05, ch05.frames.b04.skip.next)], [false, 'b06', 'b06'], JSON.stringify(nobody.flags));
    assert.equal(E.skipInto(ch05, 'b06', nobody), null, 'no number over the page after a count she never read');
    assert.equal(E.skipInto(ch05, 'b05', nobody), null);
  });
  // (with no cat, as the storyboard asks, the skip itself: the page it names)
  assert.equal(E.skipInto(ch05, 'b05'), raw);
  // the same for a count that keeps its picture (`keep`): a kept skip she never reads keeps nothing for her
  const kept = { id: 'k', frames: { k1: { when: { foundWisp: true }, skip: { table: 5, groups: 2, keep: true, next: 'k2' } }, k2: { say: [{ who: 'player', text: 'Ten.' }], next: 'k3' }, k3: { end: true } } };
  assert.equal(E.keptSkip(kept, 'k2', { flags: { foundWisp: true } }).id, 'k1');
  assert.equal(E.keptSkip(kept, 'k2', { flags: {} }), null);
  assert.equal(E.skipInto(kept, 'k2', { flags: {} }), null);
  assert.equal(E.keptSkip(kept, 'k2').id, 'k1', 'with no cat, the story as written');
  // in a reading: no cat who found nobody today reaches it, and it logs nothing
  const cat = start5(cat5(st5), st5), rows = read5(cat, st5, { choices: choices5({ up: false, lean: true, ask: false, wait: 3, first: 'otters' }) });
  const b04 = frame5(rows, 'b04');
  assert.deepEqual([b04.skip.groups, b04.skip.who.map(x => x.who), frame5(rows, 'b05').counts - b04.counts], [3, ['sprinkle', 'puddle', 'wisp'], 0]);
  // chapters 2 to 4's skips are handed back as they are (the very object)
  [st5.ch02, st5.ch03, st5.ch04].forEach(s => Object.values(s.frames).filter(f => f.skip).forEach(f => assert.equal(E.skipFor(f.skip, cat), f.skip)));
  // E.checkStory: somebody is always there to count; a skip without groups needs its who
  const bad = clone(ch05);
  bad.frames.b04.skip.who.forEach(x => { x.when = { foundSquall: true }; });
  assert.match(E.checkStory(bad, list).join('\n'), /b04: skip who can never be empty: one entry has no when/);
  const bad2 = clone(ch05); delete bad2.frames.b04.skip.who;
  assert.match(E.checkStory(bad2, list).join('\n'), /b04: skip needs a table and groups/);
  const bad3 = clone(ch05); bad3.frames.b04.skip.who[1].when = 'squall';
  assert.match(E.checkStory(bad3, list).join('\n'), /b04 skip who 1: when must be an object/);
});

test('Puddle: found after the Roar, she never reads the slip; one who did not reads it exactly once; Back from any frame of “Under the raft” before its last, then “Look up” and later “Puddles. Fine.”, leaves no foundPuddle, no page and no puddle-paws card, and nothing afterwards says “Puddle”; a second reading has its own labels', () => {
  const st5 = story5(), { ch05, list } = st5;
  const read = (c, flags) => { const cat = start5(cat5(st5, flags), st5); return { cat, rows: read5(cat, st5, { choices: choices5(c) }) }; };
  // found after the Roar: the same scene, its riddle, its card, the flag on its last frame; no slip later
  const a = read({ up: false, lean: true, ask: false, wait: 0, first: 'otters' });
  assert.deepEqual(ids5(a.rows).filter(id => /^u[ab]|^s0|^o1[01]|^w01/.test(id)), ['o10', 'ua1', 'ua2', 'ua3', 'ua4', 'ua5', 'ua6', 'ua7', 'w01']);
  assert.deepEqual([a.cat.flags.foundPuddle, E.hasCard(a.cat, 'puddle-paws'), !!a.cat.lessons['ch05-puddle']], [true, true, true]);
  assert.deepEqual(ch05.frames.ua7.sets, { foundPuddle: true });
  assert.deepEqual(ch05.frames.ub7.sets, ch05.frames.ua7.sets, 'both copies set the same flag, on their last frame');
  assert.ok(Object.keys(ch05.frames).filter(id => /^u[ab][1-6]$/.test(id)).every(id => !ch05.frames[id].sets), 'never the foot, never a choice');
  assert.equal(ch05.frames.w01.scene.opts.bubbles, true, 'the frame after it: he is seen to be up again');
  // not found after the Roar: the slip, exactly once; asking him runs the same scene in late light
  const b = read({ up: false, lean: false, ask: true, wait: 0, first: 'otters' });
  assert.deepEqual(ids5(b.rows).filter(id => /^u[ab]|^s0|^o1[01]/.test(id)), ['o10', 'o11', 's01', 's02', 'ub1', 'ub2', 'ub3', 'ub4', 'ub5', 'ub6', 'ub7']);
  assert.deepEqual(frame5(b.rows, 's02').say.map(x => x.text), ['I promised Granny I wouldn’t TELL. I’m only POINTING.']);
  assert.ok(Object.keys(ch05.frames).filter(id => /^ub\d$/.test(id)).every(id => ch05.frames[id].scene.opts.late === true) && !ch05.frames.ua2.scene.opts.late);
  assert.deepEqual(frame5(b.rows, 'ub3').lesson.map(r => r.k), ['4x10'], 'one Counts set for both copies');
  assert.ok(b.cat.flags.foundPuddle && E.hasCard(b.cat, 'puddle-paws'));
  // letting him keep his secret: nothing, answered kindly
  const c = read({ up: false, lean: false, ask: false, wait: 0, first: 'heron' });
  assert.deepEqual(ids5(c.rows).filter(id => /^u[ab]|^s0/.test(id)), ['s01', 's03']);
  assert.deepEqual(frame5(c.rows, 's03').say.map(x => x.text).concat(frame5(c.rows, 's03').caps), ['Best friend an otter ever had.', 'Under the logs, something goes blub.']);
  assert.ok(!c.cat.flags.foundPuddle && !E.hasCard(c.cat, 'puddle-paws'));
  assert.doesNotMatch(words5(c.rows), /\bPuddle\b/, 'his name is never on screen for her: the word she reads is “puddles”');
  assert.match(words5(c.rows), /It’s because of Pud— PUDDLES\. Raft puddles\. Not a name\./);
  // Back from any frame of the scene before its last, then "Look up", and later "Puddles. Fine."
  ['ua1', 'ua2', 'ua3', 'ua4', 'ua5', 'ua6'].forEach(stop => {
    const cat = start5(cat5(st5), st5);
    read5(cat, st5, { choices: choices5({ lean: true, first: 'otters' }), stop });
    if (stop === 'ua6') assert.ok(E.cards(cat, list).some(k => k.id === 'puddle-paws') && !cat.flags.foundPuddle, 'on the frame that gives the card, it is going into her file');
    while (cat.frame !== 'o10') assert.ok(E.back(cat, ch05), stop);
    const rest = read5(cat, st5, { choices: choices5({ lean: false, ask: false, wait: 0, first: 'otters' }) });
    assert.ok(!cat.flags.foundPuddle, stop);
    assert.ok(!E.cards(cat, list).some(k => k.id === 'puddle-paws'), stop + ': no card in her file (held, it is shown only with the flag)');
    assert.ok(!(E.dragonets(cat, list).found.some(d => d.id === 'puddle')), stop + ': no page in her book');
    assert.doesNotMatch(words5(rest), /\bPuddle\b/, stop + ': nothing afterwards says his name');
    assert.ok(!E.buildFullBook(cat, list).pages.some(pg => /Puddle/.test(pg.recap.join(' '))), stop);
  });
  // sticky: Back after the last frame keeps him, and a second reading reads the flag, with its own labels
  const d = start5(cat5(st5), st5);
  read5(d, st5, { choices: choices5({ lean: true, first: 'otters' }), stop: 'w01' });
  assert.ok(E.back(d, ch05) && E.back(d, ch05) && d.flags.foundPuddle);
  read5(d, st5, { choices: choices5({ lean: true, first: 'otters', wait: 0 }) });
  E.startChapter(d, ch05, 9000);
  const second = read5(d, st5, { choices: choices5({ lean: false, ask: false, wait: 0, first: 'heron' }), t: 9000 });
  assert.deepEqual(frame5(second, 'o10').options, ['Lean over, and say hello to Puddle.', 'Not now. He’s being a log.']);
  assert.ok(!ids5(second).includes('s01'), 'a cat who has found him never reads the slip');
  assert.deepEqual(frame5(second, 'b03').say.map(x => x.text), ['Puddle is under the otters’ raft. He says: five. Then he sank.', 'He does that.'], 'the lines under the bridge read the flag, not this reading’s choices');
  assert.equal(d.cards.filter(k => k.id === 'puddle-paws').length, 1);
});

test('Wisp: three choices to keep still, and stopping at any of them gives no flag and no card; the loud way out of the first has a tell; she has no balloon anywhere, and her name is on screen only for a cat who waited; a cat who found Puddle and then finds her reads the frame where his snout comes up, and no other cat does', () => {
  const st5 = story5(), { ch05, list } = st5;
  const read = (c, flags) => { const cat = start5(cat5(st5, flags), st5); return { cat, rows: read5(cat, st5, { choices: choices5(c) }) }; };
  // no frame has a balloon of hers, in any reading or in the story at all; both lines about her are Patience's
  Object.entries(ch05.frames).forEach(([id, f]) => assert.ok(!(f.say || []).some(b => b.who === 'wisp'), id));
  Object.values(ch05.counts).forEach(d => assert.ok(d.teacher !== 'wisp' && !JSON.stringify(d).includes('"who":"wisp"')));
  assert.deepEqual([ch05.frames.k05.say[0].who, ch05.frames.k06.say[0].who], ['patience', 'patience']);
  const out = [['q01', 'ONE! TWO!'], ['q02', 'THREE!'], ['q03', 'FIVE!']];
  [0, 1, 2].forEach(wait => {
    const r = read({ lean: false, ask: false, wait, first: 'heron' }), ids = ids5(r.rows);
    assert.deepEqual(ids.filter(id => /^[kq]\d/.test(id)), [['q01'], ['k01', 'k02', 'q02'], ['k01', 'k02', 'k03', 'q03']][wait]);
    assert.equal(frame5(r.rows, out[wait][0]).say[0].text, out[wait][1], 'each a small joke of its own');
    assert.equal(ids[ids.indexOf(out[wait][0]) + 1], 'f01', 'then straight on to the catch');
    assert.ok(!r.cat.flags.foundWisp && !E.hasCard(r.cat, 'wisp-fox') && !r.cat.lessons['ch05-wisp']);
    assert.doesNotMatch(words5(r.rows), /Wisp/, 'her name is nowhere');
    assert.equal(frame5(r.rows, 'f01').say[1].text, 'Frogs.');
    assert.deepEqual(frame5(r.rows, 'f02').caps, ['Down go the fish.']);
  });
  assert.match(frame5(read({ wait: 0, first: 'heron' }).rows, 'q01').caps[0], /One reed flinches\.$/);
  assert.equal(ch05.frames.q01.scene.opts.pale, 'flinch');
  // found: three waits, the blink, her riddle, her card, the flag on the last frame (the forepaw Tap)
  const w = read({ lean: false, ask: false, wait: 3, first: 'heron' });
  assert.deepEqual(ids5(w.rows).filter(id => /^[kq]\d/.test(id)), ['k01', 'k02', 'k03', 'k04', 'k05', 'k06', 'k08', 'k09', 'k10']);
  assert.deepEqual([ch05.frames.k10.sets, w.cat.flags.foundWisp, E.hasCard(w.cat, 'wisp-fox')], [{ foundWisp: true }, true, true]);
  assert.deepEqual(frame5(w.rows, 'k10').skip, { table: 5, groups: 1, who: [{ who: 'wisp' }], thing: 'claw', things: 'claws', label: 'Tap her forepaw.', prompt: '**Tap** her forepaw.', carry: false, next: 'f01' });
  assert.equal(frame5(w.rows, 'f01').say[1].text, 'A reed with knees.');
  assert.deepEqual(frame5(w.rows, 'f02').caps, ['Down go the fish. One for Patience. One for Wisp.'], 'she gets her half exactly when found');
  assert.deepEqual([ch05.frames.f02.scene.opts.fish, ch05.frames.f02.scene.opts.frogs], ['spare', 'sit']);
  // Back before the last frame, then "Enough!": no flag, no card in her file, her name nowhere afterwards
  const half = start5(cat5(st5), st5);
  read5(half, st5, { choices: choices5({ lean: false, wait: 3, first: 'heron' }), stop: 'k09' });
  assert.ok(E.cards(half, list).some(k => k.id === 'wisp-fox'), 'on the frame that gives it');
  while (half.frame !== 'k03') assert.ok(E.back(half, ch05));
  const rest = read5(half, st5, { choices: choices5({ lean: false, ask: false, wait: 2, first: 'heron' }) });
  assert.ok(!half.flags.foundWisp && !E.cards(half, list).some(k => k.id === 'wisp-fox'));
  assert.doesNotMatch(words5(rest), /Wisp/);
  // Puddle's snout in the reeds: only for a cat who found him after the Roar and then waits
  assert.deepEqual(ch05.frames.k07.when, { foundPuddle: true });
  const both = read({ lean: true, wait: 3, first: 'otters' }), k07 = frame5(both.rows, 'k07');
  assert.deepEqual(k07.say, [{ who: 'puddle', label: 'Puddle', text: 'WISP?', kind: undefined }, { who: 'puddle', label: 'Puddle', text: 'I’m a LOG.', kind: 'whisper' }]);
  assert.ok(!ids5(w.rows).includes('k07'));
  assert.ok(!ids5(read({ lean: false, ask: true, wait: 3, first: 'otters' }).rows).includes('k07'), 'found on the way home, the raft has left the marsh');
  // from the frame where Riffle dives to the one where he heaves the fish aboard, his pole holds the raft
  ['m17', 'm18', 'q01', 'q02', 'q03', 'k01', 'k02', 'k03', 'k04', 'k05', 'k06', 'k07', 'k09', 'k10', 'f01'].forEach(id => assert.equal(ch05.frames[id].scene.opts.pole, 'planted', id));
  assert.equal(frame5(both.rows, 'm17').say[1].text, 'Back in eighteen fish!');
});

test('the Roar: the old otter names it where he gives the rules (“the Roar”, “courage test”); no frame before that has the capitalised word in a caption or a balloon; Tallyheart’s first frame at the Crossing comes after it; the test cannot be failed; from the frame where she turns for home to the Old Bridge no balloon is hers', () => {
  const st5 = story5(), { ch05 } = st5;
  const cat = start5(cat5(st5, { worry: 'water', specialty: 'swimming' }), st5), rows = read5(cat, st5, { choices: choices5({ up: true, lean: true, wait: 3, first: 'heron' }) });
  const ids = ids5(rows), rules = ids.indexOf('c03'), text = r => r.caps.concat(r.say.map(b => b.text)).join(' ');
  assert.match(text(rows[rules]), /That’s the Roar\. It’s the courage test\./);
  rows.slice(0, rules).forEach(r => assert.doesNotMatch(text(r), /\bRoar\b/, r.id + ': the word is not on screen before the otter who runs it says it (Squall’s is a roar, small)'));
  const firstAtCrossing = rows.findIndex((r, i) => i > ids.indexOf('c01') - 1 && r.say.some(b => b.who === 'tallyheart'));
  assert.ok(firstAtCrossing > rules && rows[firstAtCrossing].id === 'c05');
  assert.deepEqual(rows[rules].options, ['“What if I move?”', '“What if I sneeze?”']);
  assert.deepEqual(ch05.frames.c03.choice.options.map(o => [o.sets, o.next]), [[{}, 'c04'], [{}, 'c04']], 'a light choice: one answer does for both');
  assert.match(frame5(rows, 'c04').say[0].text, /^Then you sit through it again tomorrow\./);
  // she turns for home at o08; after it, to the Old Bridge, no balloon is hers: a Counts frame's lines,
  // fillers, help and retries included (every answer missed once, so each of them comes round)
  const cat2 = start5(cat5(st5), st5);
  const all = read5(cat2, st5, { choices: choices5({ up: false, lean: true, wait: 3, first: 'otters' }), answers: { '4x10': [44], '7x2': [15], '9x2': [20], '7x1': [14], '4x5': [25] } });
  const from = ids5(all).indexOf('o08') + 1, to = ids5(all).indexOf('b01');
  assert.ok(from > 0 && to > from);
  all.slice(from, to).forEach(r => {
    assert.ok(!r.say.some(b => b.who === 'tallyheart'), r.id);
    (r.lesson || []).forEach(l => {
      assert.ok(l.teacher !== 'tallyheart' && !l.prompt.some(p => p.who === 'tallyheart') && !l.balloons.some(b => b.who === 'tallyheart'), r.id + ' ' + l.k);
      if (l.help) assert.ok(l.help.teacher !== 'tallyheart' && l.help.counter !== 'tallyheart' && l.help.says !== 'tallyheart', r.id + ' ' + l.k + ': its help');
    });
  });
  assert.deepEqual(all.slice(from, to).filter(r => r.lesson).map(r => r.id), ['ua3', 'm05', 'm16', 'k05', 'f01'], 'five Counts moments out on the water');
  // and nobody on the raft or in the marsh says "lives"
  assert.doesNotMatch(words5(all.slice(ids5(all).indexOf('o01'), to)), /\blives?\b/i);
});

test('lines for some cats only: the water worry’s places, a swimmer’s two, the sneaking cat’s socks on every path, a noticing cat’s Tap at the gap and what follows from it, a climber’s Tap on the pole, “Flew. Again.” for a cat who caught it, and “One hole in his story for certain” only when she also told', () => {
  const st5 = story5(), { ch05 } = st5;
  const read = (flags, c) => { const cat = start5(cat5(st5, flags), st5); const rows = read5(cat, st5, { choices: choices5(Object.assign({ up: false, lean: true, wait: 0, first: 'otters' }, c)) }); return { cat, rows, w: words5(rows), ids: ids5(rows) }; };
  const WATER = ['Your paws won’t move.', 'That’s what she promised, on your very first night.', 'And if you fall in, I’ll have you out before your tail gets wet. Otter’s honor.', 'You look down. Still deep. You look at your paws. Still here.',
    'The deep water is right under your nose. You look anyway.', 'Beside the mud, you can see the bottom. You look at it a lot.', 'And the deep water?', 'Still deep. I looked right at it.'];
  const wet = read({ worry: 'water' }), dry = read({ worry: 'small' });
  WATER.forEach(line => { assert.ok(wet.w.includes(line), line); assert.ok(!dry.w.includes(line), 'not for a cat without the worry: ' + line); });
  assert.ok(wet.ids.includes('c08') && wet.ids.includes('d03') && !dry.ids.includes('c08') && !dry.ids.includes('d03'));
  assert.ok(dry.w.includes('You’re the smallest thing on the whole wide river. You sit still anyway.') && !wet.w.includes('smallest thing'));
  // a swimmer: exactly one of her two lines at the raft, and her line at the catch only without the water worry
  const HELLO = 'Your first paw goes in the river, to say hello.', TAP = 'It isn’t one bit like a dripping tap.', HOOK = 'You hook the last string aboard. A wet paw! You don’t mind one bit.';
  const swim = read({ specialty: 'swimming', worry: 'talk' }), swimWet = read({ specialty: 'swimming', worry: 'water' });
  assert.deepEqual([swim.w.includes(HELLO), swim.w.includes(TAP), swim.w.includes(HOOK)], [true, false, true]);
  assert.deepEqual([swimWet.w.includes(HELLO), swimWet.w.includes(TAP), swimWet.w.includes(HOOK)], [false, true, false]);
  assert.ok(!dry.w.includes(HELLO) && !dry.w.includes(HOOK) && !wet.w.includes(TAP));
  assert.ok(swim.w.includes('You have a hundred questions. At two fish each, you pick one more.') && !wet.w.includes('a hundred questions'));
  assert.ok(read({ worry: 'shiny' }).w.includes('They flash like silver. You try very hard not to stare.') && !dry.w.includes('flash like silver'));
  // sneaking: on every path, in the Roar itself; and once more if she waits
  [0, 3].forEach(wait => {
    const s = read({ specialty: 'sneaking' }, { wait });
    assert.ok(s.w.includes('You’ve held still for socks. You can hold still for this.'), 'wait ' + wait);
    assert.equal(s.w.includes('Sock-hunting, all over again.'), wait === 3);
  });
  assert.ok(!read({ specialty: 'friends' }).w.includes('socks'));
  const pal = read({ specialty: 'friends' });
  ['The old otter nods at you, once. You know a friend’s nod when you see one.', 'Hello, Patience.', 'One grey feather lifts. For Patience, that’s a grin.'].forEach(l => { assert.ok(pal.w.includes(l)); assert.ok(!dry.w.includes(l)); });
  // noticing: only she has the Tap at the gap, holds `prints-pile`, reads the sweep and the match, and says her line at the den
  const sharp = read({ specialty: 'noticing' }), plain = read({ specialty: 'sneaking' });
  assert.deepEqual(sharp.ids.slice(1, 6), ['p02', 'p03n', 'p04', 'p05', 'p06']);
  assert.deepEqual(plain.ids.slice(1, 5), ['p02', 'p03', 'p05', 'p06']);
  assert.deepEqual([frame5(sharp.rows, 'p03n').kind, frame5(sharp.rows, 'p03n').tap, frame5(plain.rows, 'p03').kind],
    ['scratch', { kind: 'tap', prompt: '**Tap** the freshly dug earth behind the gap.', label: 'Look at the dug earth.', miss: 'rustle…' }, 'next']);
  assert.deepEqual(frame5(sharp.rows, 'p03n').caps, frame5(plain.rows, 'p03').caps, 'everyone reads the same screen; she has the Tap');
  assert.deepEqual(frame5(sharp.rows, 'p04').cards.map(c => [c.id, c.mark, c.showLine]), [['prints-pile', 'eye', true]], 'an eye card comes straight after a Tap');
  assert.ok(E.hasCard(sharp.cat, 'prints-pile') && !E.hasCard(plain.cat, 'prints-pile'));
  ['His tail sweeps the prints away. Nothing left to show anyone. But you saw them.', 'The same tiny prints as behind the pile!', 'And the same tiny prints were behind OUR pile. Till a tail swept them.', 'Waffles was up ALL night. With her nerves.']
    .forEach(l => { assert.ok(sharp.w.includes(l), l); assert.ok(!plain.w.includes(l), l); });
  // both lines that size the prints say "half the size of yours"
  assert.match(frame5(sharp.rows, 'p04').caps[0], /half the size of yours\.$/);
  assert.match(frame5(sharp.rows, 'm13').caps[1], /half the size of yours\.$/);
  // "Flew. Again.": only with ch4CaughtFly; "One hole in his story for certain": only when she also told
  assert.ok(sharp.ids.includes('ha4') && sharp.w.includes('Flew. Again. You know a dragon who can’t.') && !plain.ids.includes('ha4'));
  assert.ok(sharp.w.includes('One hole in his story for certain. Maybe two.'));
  const kept = read({ specialty: 'noticing', ch3Told: false });
  assert.ok(kept.ids.includes('ha4') && !kept.w.includes('One hole in his story'));
  assert.ok(!plain.w.includes('One hole in his story'));
  // climbing: only she has the Tap on the pole, holds `prints-tracks`, and says her line at the den
  const climb = read({ specialty: 'climbing' });
  assert.deepEqual(climb.ids.slice(climb.ids.indexOf('m12'), climb.ids.indexOf('m16') + 1), ['m12', 'm13c', 'm14', 'm15', 'm16'], '(she asked the otters first, so the fur is set beside the prints)');
  assert.deepEqual(plain.ids.slice(plain.ids.indexOf('m12'), plain.ids.indexOf('m16') + 1), ['m12', 'm13', 'm15', 'm16']);
  assert.deepEqual([frame5(climb.rows, 'm13c').tap.label, frame5(climb.rows, 'm13c').cards.map(c => c.id), frame5(climb.rows, 'm14').cards.map(c => c.id), frame5(plain.rows, 'm13').cards.map(c => c.id)],
    ['Run up the pole.', ['prints-marsh'], ['prints-tracks'], ['prints-marsh']]);
  assert.ok(E.hasCard(climb.cat, 'prints-tracks') && !E.hasCard(plain.cat, 'prints-tracks') && !E.hasCard(sharp.cat, 'prints-tracks'));
  ['From the top, you see where the prints go: off toward the train tracks.', 'And the prints run off toward the train tracks.'].forEach(l => { assert.ok(climb.w.includes(l)); assert.ok(!plain.w.includes(l)); });
  // the frame after the prints is read by a noticing cat, or one who asked the otters first; nobody else
  const heron = read({ specialty: 'sneaking' }, { first: 'heron' });
  assert.ok(!heron.ids.includes('m15') && heron.w.includes('Tiny prints there. Thin fur here. The same somebody?') && !heron.w.includes('Thin fur there.'));
  assert.deepEqual(frame5(read({ specialty: 'noticing' }, { first: 'heron' }).rows, 'm15').caps, ['The same tiny prints as behind the pile!']);
  assert.deepEqual(frame5(sharp.rows, 'm15').caps, ['The same tiny prints as behind the pile!', 'Thin fur there. Tiny prints here. The same somebody?']);
  // the telling at the den is read by every cat, with a second pair of balloons only for a noticing cat or a climber
  assert.deepEqual([frame5(plain.rows, 'd04').say.length, frame5(sharp.rows, 'd04').say.length, frame5(climb.rows, 'd04').say.length], [0, 2, 2]);
  [plain, sharp, climb].forEach(r => assert.match(frame5(r.rows, 'd04').caps[0], /the two small shapes\.$/));
  // her feet are never on the marsh: in every marsh picture she is on the raft (or up its pole)
  Object.entries(ch05.frames).filter(([, f]) => f.scene && f.scene.set === 'marsh').forEach(([id, f]) => f.scene.cast.filter(m => m.who === 'player').forEach(m => assert.ok(['raft-1', 'raft-2', 'pole-top'].includes(m.at), id + ': ' + m.at)));
  // heard, never seen; nothing solved; no card and no frame with the words the notes rule out
  const everything = JSON.stringify([ch05.frames, ch05.cards, ch05.counts, ch05.book]);
  ['weasel', 'tunnel', 'goose', 'gets bigger', 'himself told him', 'soggy', 'needle', 'Snip', 'Snatch'].forEach(w => assert.ok(!new RegExp(w, 'i').test(everything), w));
});

test('her Case File in chapter 5: nine new cards, none over twelve words; a link may name its partners (`link.with`); `fox-moon` and `heron-no-moon` lie touching from the marsh on, `squall-shapes` and `heron-shapes` whenever she holds both, `prints-pile` and `prints-marsh` for a noticing cat, and a climber who has met Squall has three in a row; `fox-moon` has no answers yet; chapter 4’s link is as it was', () => {
  const st5 = story5(), { ch05, ch04, list } = st5;
  assert.deepEqual(Object.keys(ch05.cards), ['prints-pile', 'puddle-paws', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'prints-tracks', 'wisp-fox']);
  Object.entries(ch05.cards).forEach(([id, c]) => assert.ok(c.line.split(/\s+/).length <= 12, id + ': ' + c.line.split(/\s+/).length + ' words'));
  assert.deepEqual(Object.entries(ch05.cards).map(([id, c]) => c.mark === 'eye' ? id : null).filter(Boolean), ['prints-pile', 'fur', 'prints-marsh', 'prints-tracks'], 'the eyes: every one something she tapped');
  assert.equal(ch05.cards['otter-fox'].line, 'The old otter says the fox told him the dragon story.');
  assert.deepEqual([ch05.cards['puddle-paws'].when, ch05.cards['wisp-fox'].when], [{ foundPuddle: true }, { foundWisp: true }]);
  assert.ok(!('answers' in ch04.cards['fox-moon']), 'the claim is not answered yet: Tallyheart says "not yet"');
  Object.values(ch05.cards).forEach(c => assert.ok(!('answers' in c), 'this chapter adds no answers (chapter 10’s)'));
  const read = (flags, c, stop) => { const cat = start5(cat5(st5, flags), st5); const rows = read5(cat, st5, { choices: choices5(Object.assign({ up: false, lean: false, ask: false, wait: 0, first: 'otters' }, c)), stop }); return { cat, rows }; };
  const links = cat => E.caseFile(cat, list).links.map(l => [l.cards.map(c => c.id).join(' + '), (l.lines || [l.line]).join(' | ')]);
  const near = (cat, a, b) => E.fileNeighbours(E.caseFile(cat, list), a, b);
  // before the marsh nothing new touches; from the frame that gives the heron's card on, the two moons do
  const early = read({}, {}, 'm07');
  assert.ok(E.hasCard(early.cat, 'heron-no-moon') && near(early.cat, 'fox-moon', 'heron-no-moon'));
  assert.deepEqual(links(early.cat), [['fox-moon + heron-no-moon', 'One of them is wrong.']]);
  assert.ok(!near(read({}, {}, 'm06').cat, 'fox-moon', 'heron-no-moon'), 'not before she holds both');
  const plain = read({});
  assert.deepEqual(links(plain.cat), [['fox-moon + heron-no-moon', 'One of them is wrong.']]);
  assert.deepEqual(E.caseFile(plain.cat, list).groups.map(g => [g.mark, g.cards.map(c => c.id)]),
    [['eye', ['four-a-night', 'tidy', 'scale', 'sprinkle-scales', 'cant-fly', 'fur', 'prints-marsh']], ['ear', ['fox-flew', 'otter-fox', 'heron-shapes']]], 'the linked cards leave their groups');
  // two ears that agree: a cat who has met Squall (in chapter 4, or this morning)
  const met = read({ foundSquall: true });
  assert.deepEqual(links(met.cat), [['fox-moon + heron-no-moon', 'One of them is wrong.'], ['squall-shapes + heron-shapes', 'Two saw them. The same two shapes?']]);
  assert.ok(near(met.cat, 'squall-shapes', 'heron-shapes') && !near(plain.cat, 'squall-shapes', 'heron-shapes'));
  assert.ok(near(read({}, { up: true }).cat, 'squall-shapes', 'heron-shapes'));
  // a noticing cat: the same prints, two eyes she compared herself; and chapter 4's link beside them, as it was
  const sharp = read({ specialty: 'noticing' });
  assert.deepEqual(links(sharp.cat), [['cant-fly + fox-flew', 'They can’t both be true.'], ['fox-moon + heron-no-moon', 'One of them is wrong.'], ['prints-pile + prints-marsh', 'The same prints.']]);
  assert.ok(near(sharp.cat, 'prints-pile', 'prints-marsh') && near(sharp.cat, 'cant-fly', 'fox-flew') && !near(sharp.cat, 'fox-flew', 'fox-moon'));
  E.caseFile(sharp.cat, list).links.forEach(l => assert.deepEqual(Object.keys(l), ['cards', 'line'], 'a pair is { cards, line }, as chapter 4 made it'));
  // a climber who has met Squall: his card lies between the heron's two shapes and her own sight from the pole
  const climb = read({ specialty: 'climbing', foundSquall: true });
  assert.deepEqual(links(climb.cat), [['fox-moon + heron-no-moon', 'One of them is wrong.'], ['prints-tracks + squall-shapes + heron-shapes', 'Both lead toward the tracks. | Two saw them. The same two shapes?']]);
  assert.ok(near(climb.cat, 'prints-tracks', 'squall-shapes') && near(climb.cat, 'squall-shapes', 'heron-shapes') && !near(climb.cat, 'prints-tracks', 'heron-shapes'), 'the two that lie side by side touch');
  const row = E.caseFile(climb.cat, list).links[1];
  assert.deepEqual([row.line, row.lines.length, row.cards.length], ['Both lead toward the tracks.', 2, 3]);
  // a climber who has not met him holds the card with nothing to lay it beside
  const alone = read({ specialty: 'climbing' });
  assert.ok(E.hasCard(alone.cat, 'prints-tracks') && links(alone.cat).length === 1 && !near(alone.cat, 'prints-tracks', 'squall-shapes'));
  // every card in a link is counted once, and none is lost
  [plain, met, sharp, climb].forEach(r => {
    const F = E.caseFile(r.cat, list), all = F.groups.reduce((a, g) => a.concat(g.cards), []).concat(F.links.reduce((a, l) => a.concat(l.cards), [])).map(c => c.id);
    assert.deepEqual(all.slice().sort(), E.cards(r.cat, list).map(c => c.id).sort());
    assert.equal(new Set(all).size, all.length);
  });
  // a card hidden by its `when` is never laid beside anything
  const half = read({}, { lean: true }, 'ua6');
  assert.ok(E.cards(half.cat, list).some(c => c.id === 'puddle-paws'));
  // E.checkStory: `with` is a list of known cards (hers or another chapter's), never the card itself; a link needs answers or with
  const bad = clone(ch05);
  bad.cards['heron-no-moon'].link.with = ['no-such-card']; bad.cards['prints-marsh'].link.with = ['prints-marsh']; bad.cards['prints-tracks'].link = { line: 'x' }; bad.cards.fur.link = { with: 'fox-moon' };
  const errs = E.checkStory(bad, list).join('\n');
  for (const want of [/card heron-no-moon: link with names an unknown card no-such-card/, /card prints-marsh: link with names the card itself/, /card prints-tracks: link needs answers \(the cards it is drawn touching\), or with/, /card fur: link with is a list of card ids/]) assert.match(errs, want);
  assert.match(E.checkStory(ch05).join('\n'), /card heron-no-moon: link with names an unknown card fox-moon/, 'alone, it cannot know chapter 4’s card');
});

test('Riffle’s seven questions (`ask`): a Tap that counts nothing; seven questions and seven answers in order, a pair of fish owed for each, the pairs before kept to read back; nothing is logged; the frame after it asks 7 × 2; the cloud holds eight pairs after “No.” and nine after the two shapes, and the same number before and after each free line', () => {
  const st5 = story5(), { ch05, list } = st5, f = ch05.frames.m04, ak = f.ask;
  assert.deepEqual([E.kindOf(f), E.exits(f)], ['ask', ['m05']]);
  const Q = ['Do you sleep standing up?', 'Is that leg tired?', 'Is that a dragonfly?', 'Do you see EVERYTHING?', 'Even at night?', 'Do you like otters?', 'Am I your favorite?'], A = ['Yes.', 'No.', 'Yes.', 'Yes.', 'Yes.', 'Yes.', 'No.'];
  assert.deepEqual(E.askView(ak, 0), { taps: 0, total: 7, done: false, who: 'riffle', to: 'patience', pair: null, before: [], owed: 0 });
  for (let n = 1; n <= 7; n++) {
    const v = E.askView(ak, n);
    assert.deepEqual([v.pair, v.before.length, v.owed, v.done], [[Q[n - 1], A[n - 1]], n - 1, n, n === 7]);
    assert.deepEqual(v.before, Q.slice(0, n - 1).map((q, i) => [q, A[i]]), 'the pairs before, oldest first');
    // the scene, drawn again: one more pair of fish in the thought cloud over the heron, and nothing else changed
    const sc = E.askScene(f.scene, ak, n);
    assert.equal(sc.opts.owed, n);
    assert.deepEqual(Object.assign({}, sc.opts, { owed: 0 }), f.scene.opts);
    assert.deepEqual(sc.cast, f.scene.cast);
  }
  assert.equal(f.scene.opts.owed, 0, 'the story’s own scene is never changed');
  assert.deepEqual(E.askView(ak, 99).taps, 7);
  assert.deepEqual(E.askWords(ak), { prompt: '**Tap** Riffle to let one out.', label: 'Ask the next question.' });
  assert.deepEqual(E.askWords({}), { prompt: '**Tap** to ask the next question.', label: 'Ask the next question.' });
  assert.equal(E.askScene({ set: 'x' }, { opt: 'asked', pairs: [['a', 'b']] }, 1).opts.asked, 1, '`opt` names another option');
  // in a reading: an interaction like Next; it logs nothing and sets nothing; then 7 × 2 on the same cloud
  const cat = start5(cat5(st5), st5), rows = read5(cat, st5, { choices: choices5({ up: false, lean: false, ask: false, wait: 0, first: 'heron' }) });
  const m04 = frame5(rows, 'm04'), m05 = frame5(rows, 'm05');
  assert.deepEqual(m04.asked, Q.map((q, i) => [q, A[i]]));
  assert.equal(m05.counts - m04.counts, 0, 'nothing logged');
  assert.deepEqual(m05.lesson.map(r => [r.k, r.q.answer]), [['7x2', 14]]);
  assert.deepEqual(m05.lesson[0].picture, { table: 2, groups: 7, per: 2, highlight: 0, kind: 'fish', layout: 'pairs', thought: true, who: undefined, thing: 'fish', things: 'fish' }, 'Patience’s thought cloud: seven pairs, none lit');
  assert.deepEqual(m05.say.map(b => b.label + ': ' + b.text), ['Patience: Seven answers.', 'Patience: Two fish for every answer.'], 'two balloons of its own: its page has something to read');
  // the cloud through her own two questions: 7, 7 (hello is free), 8 with "No.", 8, 8 or 8 (that one is free), 9 with the two shapes, then 9
  const owed = id => ch05.frames[id].scene.opts.owed;
  assert.deepEqual(['m05', 'm06', 'm07', 'm08', 'm09a', 'm09b', 'm10', 'm12', 'm16'].map(owed), [7, 7, 8, 8, 8, 8, 9, 9, 9]);
  assert.match(frame5(rows, 'm07').say[1].text, /^No\./);
  assert.deepEqual(frame5(rows, 'm16').lesson.map(r => [r.k, r.q.answer, r.picture.groups]), [['9x2', 18, 9]], 'the bill: the nine pairs she watched land');
  // E.checkStory
  const bad = clone(ch05);
  bad.frames.m04.ask.pairs = [['Only a question']]; bad.frames.m04.ask.who = 'coil'; bad.frames.m03.ask = { who: 'riffle', to: 'patience', pairs: [['a', 'b']], next: 'm04' };
  const errs = E.checkStory(bad, list).join('\n');
  for (const want of [/m04: ask pairs is a list of \[question, answer\]/, /m04: ask: coil is not in the frame’s cast/, /m03: needs exactly one of next\/choice\/input\/look\/counts\/skip\/scratch\/file\/ask\/end, has next,ask/]) assert.match(errs, want);
  // chapters 1 to 4 have no such frame
  [st5.ch01, st5.ch02, st5.ch03, st5.ch04].forEach(s => assert.ok(!Object.values(s.frames).some(fr => fr.ask)));
});

test('her book: Puddle’s page and Wisp’s, each only once found and each in its own pose; a cat who went up in chapter 5 reads “still roaring” on chapter 4’s page and “found Squall” only on chapter 5’s; one who found him in chapter 4 reads it there, and nothing about the roof on chapter 5’s', () => {
  const st5 = story5(), fx = fixtures(), list = [st5.ch01, st5.ch02, st5.ch03, fx.ch04, st5.ch05], ch05 = st5.ch05;
  const read = (flags, c) => { const cat = start5(cat5(st5, flags), st5); read5(cat, st5, { choices: choices5(Object.assign({ up: false, lean: false, ask: false, wait: 0, first: 'otters' }, c)) }); return cat; };
  const page = (cat, id) => E.buildFullBook(cat, list).pages.find(p => p.id === id).recap.join(' ');
  // the roof today: chapter 4's page (the fixture's, with the edit chapter 5's Build asks of it) and chapter 5's
  const today = read({}, { up: true });
  assert.match(page(today, 'ch04'), /Sprinkle’s littlest brother is still roaring, and hiccuping\./);
  assert.doesNotMatch(page(today, 'ch04'), /found Squall/);
  assert.match(page(today, 'ch05'), /On the roof of her old tower, she found Squall, the littlest dragonet, who told her about two skinny shapes/);
  const before = read({ foundSquall: true });
  assert.match(page(before, 'ch04'), /she found Squall, the littlest dragonet, who roars at airplanes and hiccups\./);
  assert.doesNotMatch(page(before, 'ch04'), /still roaring/);
  assert.doesNotMatch(page(before, 'ch05'), /Squall|roof/);
  const never = read({});
  assert.match(page(never, 'ch04'), /still roaring/);
  assert.doesNotMatch(page(never, 'ch05'), /Squall|Puddle|Wisp|forepaw for everyone/);
  assert.equal(page(never, 'ch05').split('. ').length > 6, true);
  // Squall's own page stays on foundSquall, whichever chapter she found him in; Puddle's and Wisp's on theirs
  const D = cat => (E.dragonets(cat, list) || { found: [] }).found.map(d => d.id + (d.pose ? ':' + d.pose : ''));
  assert.deepEqual([D(never), D(before), D(today)], [['sprinkle'], ['sprinkle', 'squall'], ['sprinkle', 'squall']]);
  const all = read({}, { up: true, lean: true, wait: 3 });
  assert.deepEqual(D(all), ['sprinkle', 'squall', 'puddle:head', 'wisp:blink'], 'in chapter order; each new page says the pose its dragonet is drawn in');
  assert.equal(E.dragonets(all, list).toFind, 3);
  const pud = E.dragonets(all, list).found[2];
  assert.deepEqual([pud.name, pud.chapter, pud.lines.length, pud.lines[1]], ['Puddle', 'ch05', 3, 'Moonpaw found him under the otters’ ferry raft. Mama says: stay where you land.']);
  assert.ok(!('pose' in E.dragonets(all, list).found[0]), 'Sprinkle sits, as she did');
  assert.match(page(all, 'ch05'), /Under the raft she found Puddle.*sat still until a pale reed blinked\. It was Wisp.*Sprinkle lit a forepaw for everyone found so far\./);
  assert.deepEqual(D(read({}, { ask: true })), ['sprinkle', 'puddle:head']);
  assert.deepEqual(D(read({}, { wait: 3 })), ['sprinkle', 'wisp:blink']);
  // a tom's page reads "his" and "he"; no dream typed: the chapter's own line
  const tom = cat5(st5); tom.look.sex = 'tom'; start5(tom, st5); read5(tom, st5, { choices: choices5({ up: true, lean: true, wait: 0, first: 'heron' }) });
  assert.match(page(tom, 'ch05'), /On the roof of his old tower, he found Squall.*Under the raft he found Puddle/);
  assert.equal(E.buildFullBook(tom, list).pages.find(p => p.id === 'ch05').dream, 'Moonpaw’s dream that night floated off down the river.');
  assert.deepEqual(E.buildFullBook(tom, list).teaser, { title: 'Chapter 6: The Snake in the Stones', lines: ['Tomorrow, you ask a nosy old snake what a secret costs.', 'And Tallyheart counts out guards for the pile.'], built: false, next: null });
  // E.checkStory: a pose is a word
  const bad = clone(ch05); bad.book.dragonet[0].pose = 7;
  assert.match(E.checkStory(bad, st5.list).join('\n'), /book\.dragonet puddle: pose is one of its poses/);
});

test('the tuck (a skip-count that runs backwards): fifty claws lit and a big 50; each tap curls one claw in on the next cat and steps the number back, 49, 48, 47, 46, and the fifth turns the page on 45; no number under any cat, tapped or kept, and never 18, 27 or 36; the kept picture stays up to the lesson', () => {
  const st5 = story5(), { ch05, list } = st5, f = ch05.frames.h05, sk = f.skip;
  assert.deepEqual([sk.table, sk.groups, sk.tuck, sk.keep, sk.thing, sk.things], [9, 5, true, true, 'claw', 'claws']);
  assert.deepEqual(sk.who.map(c => c.who), ['clancat', 'murmurchime', 'clancat', 'clancat', 'grizzled'], 'this chapter’s rim: the new warrior second, the old tom last');
  const views = [0, 1, 2, 3, 4, 5].map(n => E.skipView(sk, n));
  assert.deepEqual(views.map(v => v.total), [50, 49, 48, 47, 46, 45]);
  assert.deepEqual(views.map(v => v.count), ['', '49…', '49… 48…', '49… 48… 47…', '49… 48… 47… 46…', '49… 48… 47… 46… 45!']);
  assert.deepEqual(views.map(v => [v.tucked, v.highlight, v.done]), [[0, 50, false], [1, 49, false], [2, 48, false], [3, 47, false], [4, 46, false], [5, 45, true]]);
  assert.deepEqual(E.skipView(sk, 9).total, 45, 'never past the last cat');
  // the picture: the 9s' cats, `tucked` of them with a claw curled in, the claws still out all lit, the next cat glowing
  views.forEach((v, n) => {
    const p = E.skipPicture(sk, n);
    assert.deepEqual(p, { table: 9, groups: 5, per: 9, highlight: 50 - n, totals: false, next: n < 5, who: sk.who, thing: 'claw', things: 'claws', tuck: true, taps: n, tucked: n });
    assert.doesNotMatch(JSON.stringify(v.totals), /\b(9|18|27|36)\b/, 'no running total of nines anywhere');
  });
  assert.deepEqual(E.keptPicture(sk), { table: 9, groups: 5, per: 9, highlight: 45, totals: false, next: false, who: sk.who, thing: 'claw', things: 'claws', tuck: true, taps: 5, tucked: 5 });
  // chapters 3 and 4's kept pictures keep their totals, as they did
  assert.equal(E.keptPicture(st5.ch04.frames.f011.skip).totals, true);
  // the page it turns to is the Counts frame: the kept picture, 45 over it, until the lesson starts
  const cat = start5(cat5(st5), st5);
  read5(cat, st5, { stop: 'h06' });
  const kept = E.keptSkip(ch05, 'h06', cat);
  assert.deepEqual([kept.id, kept.skip.tuck, E.skipReached(kept.skip), E.skipReached(E.skipInto(ch05, 'h06', cat))], ['h05', true, 45, 45]);
  assert.equal(E.keptSkip(ch05, 'h07', cat), null, 'not past the lesson');
  assert.equal(cat.counts.length, cat5(st5).counts.length + 3, 'the Tap logs nothing: only the pile’s answer and the warm-up’s two are new');
  // its words: Tallyheart keeps the count (she speaks first on the frame); the hidden button; the instruction
  const w = E.skipWords(sk, 'tallyheart');
  assert.deepEqual([w.teacher, w.whisper, w.thing, w.things, w.label, w.prompt], ['tallyheart', false, 'claw', 'claws', 'Tuck in the next cat’s claw.', '**Tap** the cats, left to right.']);
  assert.equal(w.aria, 'Five cats sitting up, ten claws out on each. Touch the glowing cat to tuck one claw in.');
  assert.equal(E.skipWords({ table: 9, groups: 5 }, null).thing, 'claw', 'a table-9 skip says claws without being told');
  const bad = clone(ch05); bad.frames.h05.skip.tuck = 'yes';
  assert.match(E.checkStory(bad, list).join('\n'), /h05: skip tuck is true or false/);
});

test('the nines (`ch05-nines`): ten facts in the text’s order, no answer the one before plus or minus nine; every first ask and every retry plays the hop and the tuck and ends unlit, a filler and a Hollow round play neither; the words of each question; its praise, in order, names no total', () => {
  const st5 = story5(), { ch05, list } = st5, def = ch05.counts['ch05-nines'];
  const rows = play5(cat5(st5), st5, 'ch05-nines');
  assert.deepEqual(rows.map(r => r.k), ['2x9', '9x10', '4x9', '9x1', '9x6', '3x9', '9x8', '5x9', '7x9', '9x9']);
  const answers = rows.map(r => r.q.answer);
  assert.deepEqual(answers, [18, 90, 36, 9, 54, 27, 72, 45, 63, 81]);
  answers.forEach((a, i) => { if (i) assert.notEqual(Math.abs(a - answers[i - 1]), 9, 'no two consecutive answers differ by nine'); });
  assert.deepEqual(rows.map(r => r.q.groups).slice().sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'every number of cats from one to ten, once');
  rows.forEach(r => assert.deepEqual([r.q.per, r.q.table, r.q.light], [9, 9, 'tuck'], r.k));
  // the picture as asked: the hop (ten claws lit on every cat, none tucked), the tuck (one curls in on each: nine lit), then unlit
  rows.forEach(r => {
    const g = r.q.groups, base = { table: 9, groups: g, per: 9, kind: undefined, layout: undefined, thought: undefined, who: r.k === '2x9' ? def.facts[0].who : undefined, thing: 'life', things: 'lives' };
    assert.deepEqual(r.light.open, Object.assign({}, base, { highlight: g * 10, tuck: 0, tucked: 0 }), r.k + ': opens on the hop');
    assert.deepEqual(r.light.map(s => s.picture), [Object.assign({}, base, { highlight: g * 9, tuck: g, tucked: g }), Object.assign({}, base, { highlight: 0 })], r.k + ': the tuck, then unlit');
    assert.ok(r.light.every(s => s.wait > 500), 'each step can be seen');
    assert.deepEqual(r.picture, Object.assign({}, base, { highlight: 0 }), 'the still picture: nine out and one tucked (the art’s own default)');
  });
  // the words: the opener's hop and tuck spoken; ninety, four cats and six cats in words of their own; the rest ask for lives
  const ask = k => rows.find(r => r.k === k).prompt.map(p => p.label + ': ' + p.text).join(' | ');
  assert.equal(ask('2x9'), 'Tallyheart: Two cats. Hop by tens: twenty. Now tuck two in. How many lives?');
  assert.equal(ask('9x10'), 'Tallyheart: Ten cats. Ten tens make a hundred. Now tuck ten in.');
  assert.equal(ask('4x9'), 'Tallyheart: Four cats. Hop by tens. Then tuck four in.');
  assert.doesNotMatch(ask('4x9'), /forty|thirty|36|40/i, 'the steps named, and no number given');
  assert.equal(ask('9x6'), 'Tallyheart: Six cats. Six tens make sixty. Now tuck six in.');
  assert.deepEqual(['9x1', '3x9', '9x8', '5x9', '7x9', '9x9'].map(ask), ['One cat', 'Three cats', 'Eight cats', 'Five cats', 'Seven cats', 'Nine cats'].map(c => 'Tallyheart: ' + c + '. How many lives?'));
  // after a right answer: the lines the text gives five of them, praise dealt in order for the rest
  const said = k => { const r = rows.find(x => x.k === k); return r.balloons.length ? r.balloons.map(b => (b.who ? b.who + ': ' : '') + b.text).join(' | ') : r.line; };
  assert.equal(said('2x9'), 'Eighteen! Hop, then tuck.');
  assert.equal(said('9x10'), 'Ninety! Yesterday it was nine cats, ten claws each. Same ninety!');
  assert.equal(said('4x9'), 'Thirty-six! Now look. Three and six make nine. One and eight make nine. Every nines answer hides a nine!');
  assert.equal(said('9x6'), 'Fifty-four! Five and four. There’s your nine.');
  assert.equal(said('9x9'), 'tallyheart: EIGHTY-ONE! | murmurchime: Not mice.');
  const slow = play5(cat5(st5), st5, 'ch05-nines', null, { all: 5000 });
  assert.deepEqual(['9x1', '3x9', '9x8', '5x9', '7x9'].map(k => slow.find(r => r.k === k).line), def.praise, 'the praise, dealt in order');
  assert.equal(def.praise[def.praise.length - 1], 'Hop, then tuck!', 'the opener’s own line comes last');
  assert.equal(def.praise[0], 'Yes! Nine lives on every cat.');
  [].concat(def.praise, def.fast, def.fastAfterMiss, def.again || []).forEach(l => assert.doesNotMatch(l, /\d|eighteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred/i, 'no line names a total: ' + l));
  assert.equal(rows.find(r => r.k === '9x1').line, 'You didn’t even have to hop that time.', 'a quick answer');
  // a filler shows the still picture (she has got it right already); so does every question of a Hollow round
  const missLast = play5(cat5(st5), st5, 'ch05-nines', { '9x9': [80] });
  assert.deepEqual(missLast.slice(-4).map(r => [r.k, r.q.light, r.light.length]), [['9x9✗', 'tuck', 2], ['F:9x1', null, 0], ['F:2x9', null, 0], ['R:9x9', 'tuck', 2]]);
  // …and every retry plays them, the retry of a missed filler too (a filler itself never does)
  const missFill = play5(cat5(st5), st5, 'ch05-nines', { '9x9': [80], '9x1': [null, 10] });
  assert.deepEqual(missFill.slice(-5).map(r => [r.k, r.q.light, r.light.length]), [['9x9✗', 'tuck', 2], ['F:9x1✗', null, 0], ['F:2x9', null, 0], ['R:9x9', 'tuck', 2], ['R:9x1', 'tuck', 2]]);
  // (a borrowed pair is another set's picture: its retry plays nothing of the borrower's: Riffle's catch lights by strings)
  const lent = play5(cat5(st5), st5, 'ch05-catch', { '4x5': [19] }).find(r => /^F:/.test(r.k));
  assert.ok(lent && lent.q.from, 'the catch borrows');
  const lentKey = lent.q.a + 'x' + lent.q.b, wrong = {}; wrong['4x5'] = [19]; wrong[lentKey] = [1];
  const lentRows = play5(cat5(st5), st5, 'ch05-catch', wrong), lentRetry = lentRows.find(r => r.k === 'R:' + lentKey);
  assert.ok(lentRows.some(r => r.k === 'F:' + lentKey + '✗') && lentRetry, lentRows.map(r => r.k).join(' '));
  assert.deepEqual([lentRetry.q.light, lentRetry.light.length, lentRows.find(r => r.k === 'R:4x5').q.light], [null, 0, 'groups']);
  const cat = cat5(st5); cat.lessons['ch05-nines'] = { finished: true, noHelp: true };
  const H = E.hollowStart(cat, list, 1, 9);
  assert.ok(!('light' in H.def) && H.state.queue.every(q => !q.light) && !H.state.easiest);
  for (let q; (q = E.counts.question(H.state));) { assert.deepEqual([q.light, E.lightSteps(H.def, q).length], [null, 0]); E.counts.answer(H.state, H.def, q.answer, 2000, 1); }
  // a fact's own `light` wins over the set's; chapters 2 to 4's lights are as they were
  const mixed = E.counts.start({ table: 9, light: 'tuck', facts: [[2, 9], { a: 3, b: 9, light: 'groups' }] }, {});
  assert.deepEqual(mixed.queue.map(q => q.light), ['tuck', 'groups']);
  assert.deepEqual(E.lightSteps({}, { groups: 3, per: 2, table: 2, light: 'groups', lit: 0 }).map(s => [s.picture.highlight, s.wait]), [[2, 700], [4, 560], [6, 560]]);
  assert.deepEqual(E.lightSteps({}, { groups: 2, per: 10, table: 10, light: 'rows', lit: 0 }).map(s => [s.picture.highlight, s.wait]), [[10, 700], [20, 1000]]);
  assert.deepEqual(E.lightSteps({}, { groups: 2, per: 10, table: 10, light: null }).length, 0);
});

test('the nines’ help: Tallyheart swipes twice for every cat and hops by tens, then rubs one line out of every pair and steps back by ones; four openings for the four likeliest slips, checked in order; the digits line waits until the lesson has shown her that nines answers hide a nine', () => {
  const st5 = story5(), { ch05, list } = st5, def = ch05.counts['ch05-nines'];
  const HOP = 'That’s the hop! Now the tuck: one claw in for every cat.', ONE = 'So close! You tucked ONE claw. Tuck one in for every cat.';
  const NINE = 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.', CLOSE = 'Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.', FAR = CLOSE.replace('Close. ', '');
  const miss = (answers) => play5(cat5(st5), st5, 'ch05-nines', answers);
  const first = (rows, k) => rows.find(r => r.k === k + '✗'), again = (rows, k) => rows.find(r => r.k === 'R:' + k + '✗');
  // 4 × 9: the whole help
  const four = first(miss({ '4x9': [40] }), '4x9').help;
  assert.deepEqual([four.intro, four.teacher, four.counter, four.ground, four.style, four.pair, four.tuck, four.hops], [HOP, 'tallyheart', 'tallyheart', 'sand', 'swipe', true, true, 4]);
  assert.deepEqual(four.nums, [10, 20, 30, 40, 39, 38, 37, 36], 'the strip: 10 · 20 · 30 · 40, then 39 · 38 · 37 · 36');
  assert.deepEqual([four.groups, four.per, four.total, four.answer, four.step], [4, 9, 36, 36, 10]);
  const steps = E.helpSteps(four);
  assert.deepEqual(steps, [{ n: 10, counted: 10 }, { n: 20, counted: 20 }, { n: 30, counted: 30 }, { n: 40, counted: 40 }, { n: 39, counted: 40, rubbed: 1 }, { n: 38, counted: 40, rubbed: 2 }, { n: 37, counted: 40, rubbed: 3 }, { n: 36, counted: 40, rubbed: 4 }]);
  assert.deepEqual(E.sandOpts(four, 0), { groups: 4, per: 10, counted: 0, layout: undefined, ground: undefined, style: 'swipe', pair: true }, 'pairs of swipes, a pair to a cat, as the tens were scratched');
  assert.deepEqual(E.sandOpts(four, 20), { groups: 4, per: 10, counted: 20, layout: undefined, ground: undefined, style: 'swipe', pair: true });
  assert.deepEqual(E.sandOpts(four, 40, 3), { groups: 4, per: 10, counted: 40, layout: undefined, ground: undefined, style: 'swipe', pair: true, rubbed: 3 }, 'three pairs with a line rubbed out');
  // the four openings on 4 × 9 (its own line has not shown yet on a first ask, so 35 opens with "Close.")
  assert.equal(first(miss({ '4x9': [39] }), '4x9').help.intro, ONE);
  assert.equal(first(miss({ '4x9': [35] }), '4x9').help.intro, CLOSE);
  assert.equal(first(miss({ '4x9': [52] }), '4x9').help.intro, FAR, 'far off, and the digits line is not hers yet');
  // 9 × 6, the fifth fact: the 4 × 9 line has always shown by then
  assert.deepEqual([60, 59, 45, 52].map(a => first(miss({ '9x6': [a] }), '9x6').help.intro), [HOP, ONE, CLOSE, NINE]);
  assert.equal(first(miss({ '4x9': [35], '9x6': [52] }), '9x6').help.intro, NINE, 'shown by its miss line just as well');
  // 9 × 10, the second question: 80 is ten off (no "Close."), and no digits line before 4 × 9; on its retry, after it, the digits line
  const ninety = miss({ '9x10': [80, 80] });
  assert.deepEqual([first(ninety, '9x10').help.intro, again(ninety, '9x10').help.intro], [FAR, NINE]);
  assert.deepEqual(ninety.map(r => r.k).slice(0, 5), ['2x9', '9x10✗', '4x9', '9x1', 'R:9x10✗']);
  assert.equal(first(miss({ '9x10': [100] }), '9x10').help.intro, HOP);
  // 2 × 9, the opener: 19 is the one-tuck slip; 17 is "Close." at first and the digits line on its retry
  assert.equal(first(miss({ '2x9': [19] }), '2x9').help.intro, ONE);
  const two = miss({ '2x9': [17, 17] });
  assert.deepEqual([first(two, '2x9').help.intro, again(two, '2x9').help.intro], [CLOSE, NINE]);
  assert.equal(first(miss({ '2x9': [20] }), '2x9').help.intro, HOP);
  // 9 × 1 has one cat and one number: 10 is the hop, and nothing else is special about it
  const one = miss({ '9x1': [10] }), oneB = miss({ '9x1': [8] });
  assert.deepEqual([first(one, '9x1').help.intro, first(one, '9x1').help.nums, first(oneB, '9x1').help.intro], [HOP, [10, 9], CLOSE]);
  assert.ok(!first(oneB, '9x1').res.notNine && !first(oneB, '9x1').res.oneTuck);
  // the flags, as the engine reports them (independent; the plan takes the first that has a line)
  const r60 = first(miss({ '9x6': [60] }), '9x6').res, r59 = first(miss({ '9x6': [59] }), '9x6').res, r52 = first(miss({ '9x6': [52] }), '9x6').res;
  assert.deepEqual([[r60.tens, r60.oneTuck, r60.notNine], [r59.tens, r59.oneTuck, r59.notNine], [r52.tens, r52.oneTuck, r52.notNine, r52.near]], [[true, undefined, true], [undefined, true, true], [undefined, undefined, true, true]]);
  // 9 × 9 and 9 × 10 at their biggest: eighteen and twenty swipes, then nine or ten rubbed out
  const big = first(miss({ '9x9': [80] }), '9x9').help;
  assert.deepEqual([big.nums.length, big.nums[8], big.nums[9], big.nums[17], E.helpSteps(big)[17]], [18, 90, 89, 81, { n: 81, counted: 90, rubbed: 9 }]);
  assert.deepEqual(E.sandOpts(big, 90, 9).groups, 9);
  // in the Training Hollow the digits line may open the help from the first question; the help is the same two steps
  const cat = cat5(st5); cat.lessons['ch05-nines'] = { finished: true, noHelp: true };
  const H = E.hollowStart(cat, list, 1, 9), q0 = E.counts.question(H.state);
  const wrong = q0.answer === 9 ? 10 : q0.answer + (q0.answer % 10 === 9 ? 2 : 1);
  const res = E.counts.answer(H.state, H.def, wrong, 2000, 1), plan = E.helpPlan(H.def, H.def, q0, res);
  if (q0.answer !== 9 && wrong !== q0.groups * 10 && wrong !== q0.groups * 10 - 1) assert.equal(plan.intro, NINE, 'a first question in the Hollow: ' + q0.a + ' × ' + q0.b + ' answered ' + wrong);
  assert.ok(plan.tuck && plan.ground === 'sand');
  // every Hollow round's first miss: checked for all ten facts, one round each way
  [[3, 9, 28], [9, 3, 28], [7, 9, 64], [9, 8, 71]].forEach(([a, b, given]) => {
    const st = E.counts.start(H.def, { facts: [[a, b]], mode: 'hollow', set: 'hollow-9s' }), q = E.counts.question(st);
    assert.equal(E.helpPlan(H.def, H.def, q, E.counts.answer(st, H.def, given, 2000, 1)).intro, NINE, a + ' × ' + b + ' answered ' + given);
  });
  // chapters 1 to 4: no plan carries a key of chapter 5's
  const tens = E.counts.start(st5.ch04.counts['ch04-tens'], {}), tq = E.counts.question(tens), tp = E.helpPlan(st5.ch04.counts['ch04-tens'], null, tq, E.counts.answer(tens, st5.ch04.counts['ch04-tens'], 41, 2000, 1));
  assert.deepEqual(Object.keys(tp).sort(), ['answer', 'counter', 'ground', 'groups', 'intro', 'layout', 'line', 'nums', 'pair', 'per', 'step', 'style', 'teacher', 'total']);
  assert.deepEqual(E.helpSteps(tp), [10, 20, 30, 40].map(n => ({ n, counted: n })));
});

test('two answers in the sand (`shows`): with 4 × 9’s line, right or missed, 18 and 36 and never 90; with 2 × 9 missed, 36 alone, the line without “One and eight”, and nothing shows or says eighteen before its retry but its own help; a right retry finds the nine in her own eighteen; a missed 4 × 9 ends its help on the idea, the third time too', () => {
  const st5 = story5(), { ch05, list } = st5, def = ch05.counts['ch05-nines'], fact = def.facts[2];
  assert.deepEqual(fact.shows, { kind: 'answers', of: [[2, 9]], also: 'One and eight make nine. ' });
  const miss = (answers) => play5(cat5(st5), st5, 'ch05-nines', answers);
  // right the first time, 2 × 9 right before it: both answers, the whole line
  const clean = miss(null), r36 = clean.find(r => r.k === '4x9');
  assert.deepEqual([r36.shows, r36.res.shows], [[18, 36], { kind: 'answers', answers: [18, 36] }]);
  assert.equal(r36.balloons[0].text, 'Thirty-six! Now look. Three and six make nine. One and eight make nine. Every nines answer hides a nine!');
  assert.ok(!r36.shows.includes(90), 'ninety is hers to find');
  assert.ok(clean.every(r => r.k === '4x9' || r.shows === null), 'no other answer shows them');
  assert.deepEqual(E.answersOpts(null, r36.res.shows), { answers: [18, 36] });
  assert.deepEqual(E.answersOpts({ ground: 'earth' }, { answers: [36] }), { answers: [36], ground: 'earth' });
  // 4 × 9 missed, 2 × 9 right: the help ends on the same idea, over the same two answers, and it comes back
  const m = miss({ '4x9': [40] }), mm = m.find(r => r.k === '4x9✗'), back = m.find(r => r.k === 'R:4x9');
  assert.equal(mm.line, 'Thirty-six. Now look. Three and six make nine. One and eight make nine. Every nines answer hides a nine! We’ll come back to that one.');
  assert.deepEqual([mm.shows, mm.res.requeued, mm.help.line], [[18, 36], true, mm.res.line]);
  assert.deepEqual([back.balloons.map(b => b.text), back.shows], [['Thirty-six! Three and six. There’s your nine.'], null], 'right on its retry: the short form, and the cats again');
  assert.equal(back.prompt[0].text, 'Here’s that one again. Four cats. Hop by tens. Then tuck four in.');
  // missed three times: the idea each time; "We'll come back" only while it does
  const thrice = miss({ '4x9': [40, 39, 35] }), all3 = thrice.filter(r => /4x9✗/.test(r.k));
  assert.deepEqual(all3.map(r => [r.res.requeued, /Every nines answer hides a nine!/.test(r.line), /come back/.test(r.line), r.shows]), [[true, true, true, [18, 36]], [true, true, true, [18, 36]], [false, true, false, [18, 36]]]);
  assert.equal(all3[2].line, 'Thirty-six. Now look. Three and six make nine. One and eight make nine. Every nines answer hides a nine!');
  // 2 × 9 missed: its retry is the very next question after 4 × 9, so eighteen is neither scratched nor said
  [null, [40]].forEach(four => {
    const rows = miss(Object.assign({ '2x9': [17] }, four ? { '4x9': four } : {})), i4 = rows.findIndex(r => /^4x9/.test(r.k)), r4 = rows[i4], retry = rows[i4 + 1];
    assert.equal(retry.k, 'R:2x9');
    assert.deepEqual(r4.shows, [36], '36 alone');
    const line = four ? r4.line : r4.balloons[0].text;
    assert.equal(line, four ? 'Thirty-six. Now look. Three and six make nine. Every nines answer hides a nine! We’ll come back to that one.' : 'Thirty-six! Now look. Three and six make nine. Every nines answer hides a nine!');
    // from the frame's first question to that retry, eighteen is on screen only in 2 × 9's own help
    rows.slice(0, i4 + 1).forEach((r, i) => {
      const shownOrSaid = r.prompt.map(p => p.text).concat(r.line, r.balloons.map(b => b.text), r.shows || []).join(' ');
      assert.doesNotMatch(shownOrSaid, /eighteen|\b18\b|One and eight/i, r.k);
      if (r.help && i > 0) assert.ok(!r.help.nums.slice(-1).includes(18), r.k);
    });
    assert.deepEqual(rows[0].help.nums, [10, 20, 19, 18], 'its own help counts it out');
    assert.deepEqual(retry.balloons.map(b => b.text), ['Eighteen! One and eight. There’s your nine.'], 'she finds the nine in her own answer');
    assert.equal(retry.prompt[0].text, 'Here’s that one again. Two cats. How many lives?');
  });
  // 2 × 9 missed, then right, then 4 × 9 missed a second time: by now eighteen is hers, and it is scratched
  const late = miss({ '2x9': [17], '4x9': [40, 40] }).filter(r => /4x9✗/.test(r.k));
  assert.deepEqual(late.map(r => r.shows), [[36], [18, 36]]);
  assert.match(late[1].line, /One and eight make nine\./);
  // "with no ask of it still to come": a lesson that asks the pair again later (9 × 2, the same fact turned round)
  // keeps eighteen off the sand though she has just answered 2 × 9 right, and its line says nothing of one and eight
  const twice = clone(ch05);
  twice.counts['ch05-nines'].facts = [[2, 9], twice.counts['ch05-nines'].facts[2], [9, 2]];
  const list2 = list.slice(0, 4).concat([twice]);
  assert.deepEqual(E.checkStory(twice, list2), []);
  const L2 = E.chapterLesson(cat5(st5), twice, 'ch05-nines', 1, list2), seen2 = [];
  while (!E.counts.done(L2.state)) { const q2 = E.counts.question(L2.state), r2 = E.counts.answer(L2.state, L2.def, q2.answer, 2000, 1); seen2.push([q2.a + 'x' + q2.b, r2.shows ? r2.shows.answers : null, r2.balloons ? r2.balloons[0].text : null]); }
  assert.deepEqual(seen2, [['2x9', null, null], ['4x9', [36], 'Thirty-six! Now look. Three and six make nine. Every nines answer hides a nine!'], ['9x2', null, null]]);
  // the lesson state remembers that the idea has been shown (saved mid-lesson, it still does)
  const cat = cat5(st5), L = E.chapterLesson(cat, ch05, 'ch05-nines', 1, list);
  ['18', '90'].forEach(a => E.counts.answer(L.state, L.def, a, 2000, 1));
  assert.ok(!L.state.shown && L.state.easiest === true);
  E.counts.answer(L.state, L.def, 36, 2000, 1);
  assert.equal(L.state.shown, true);
  const saved = JSON.parse(JSON.stringify({ mode: 'chapter', frame: 'h06', chapter: 'ch05', state: L.state }));
  assert.ok(E.okLesson(saved));
  E.counts.answer(saved.state, L.def, 9, 2000, 1);   // 9 × 1
  assert.equal(E.helpPlan(L.def, L.def, E.counts.question(saved.state), E.counts.answer(saved.state, L.def, 52, 2000, 1)).intro, 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.');
  // E.checkStory: the shape of `shows`, and a fact's own miss lines
  const bad = clone(ch05), bf = bad.counts['ch05-nines'].facts;
  bf[2].shows = { kind: 'numbers' }; bf[4].shows = { kind: 'answers', of: 'two nines' }; bf[1].miss = 7; bf[0].light = 'hop'; bad.counts['ch05-nines'].light = 'both';
  const errs = E.checkStory(bad, list).join('\n');
  for (const want of [/ch05-nines: fact 2: shows is \{ kind: "answers", of, also \}/, /ch05-nines: fact 4: shows of is a list of facts/, /ch05-nines: fact 1: miss is a line/, /ch05-nines: fact 0: light is "groups", "rows" or "tuck"/, /counts ch05-nines: light is "groups", "rows" or "tuck"/]) assert.match(errs, want);
});

test('the nines fill their own gaps with the easiest of her right answers (`fillOrder: "easiest"` with no fillFrom): a missed 9 × 9 is followed by 9 × 1 and 2 × 9, a missed 7 × 9 by 9 × 9 and then 9 × 1; chapters 1 to 4’s lessons fill theirs with the latest, as they did', () => {
  const st5 = story5(), { ch05, list } = st5, def = ch05.counts['ch05-nines'];
  assert.deepEqual([def.fillOrder, def.fillFrom], ['easiest', undefined]);
  assert.deepEqual(E.checkStory(ch05, list), [], 'fillOrder may stand without fillFrom');
  const seq = answers => play5(cat5(st5), st5, 'ch05-nines', answers).map(r => r.k);
  assert.deepEqual(seq({ '9x9': [80] }).slice(-4), ['9x9✗', 'F:9x1', 'F:2x9', 'R:9x9']);
  assert.deepEqual(seq({ '7x9': [62] }).slice(-4), ['7x9✗', '9x9', 'F:9x1', 'R:7x9']);
  // when she missed the two easiest themselves, the next easiest she has got right
  assert.deepEqual(seq({ '9x9': [80], '9x1': [8, 8, 8], '2x9': [17, 17, 17] }).slice(-4), ['9x9✗', 'F:3x9', 'F:4x9', 'R:9x9']);
  // missed twice at the very end: the next two easy ones, not the same two again
  assert.deepEqual(seq({ '9x9': [80, 80] }).slice(-7), ['9x9✗', 'F:9x1', 'F:2x9', 'R:9x9✗', 'F:3x9', 'F:4x9', 'R:9x9']);
  // chapter 4's tens lesson, the same miss: the latest right answers, as it shipped
  const tens = st5.ch04.counts['ch04-tens'], st = E.counts.start(Object.assign({ id: 'ch04-tens' }, tens), { set: 'ch04-tens' }), out = [];
  for (let q; (q = E.counts.question(st));) { const wrong = q.a === 10 && q.b === 10 && !q.retry; out.push((q.filler ? 'F:' : q.retry ? 'R:' : '') + q.a + 'x' + q.b); E.counts.answer(st, tens, wrong ? 90 : q.answer, 2000, 1); }
  assert.deepEqual(out.slice(-4), ['10x10', 'F:7x10', 'F:10x9', 'R:10x10']);
  assert.ok(!st.easiest);
  // a set that borrows keeps the rule it had: `easiest` there sorts the pool it borrows, not its own
  assert.ok(!E.chapterLesson(cat5(st5), ch05, 'ch05-pile', 1, list).state.easiest);
});

test('the tens warm-up (`ch05-tens`): two questions; the hard pick sits first and may be 4 × 10 but never 3 × 10 or 5 × 10 (`warmHard.avoid`); 5 × 10 is written last, in Tallyheart’s words, with the five rim cats; what it borrows is never 4 × 10 or 5 × 10; none of the frame’s lines is said over its first question, so a hard pick answered quickly earns “Not today!”', () => {
  const st5 = story5(), { ch05, list } = st5, def = ch05.counts['ch05-tens'], f = ch05.frames.h01;
  assert.deepEqual([def.warmHard, def.avoid], [{ table: 10, at: 0, avoid: [[5, 10], [3, 10]] }, [[5, 10], [3, 10], [4, 10]]]);
  const facts = cat => E.lessonFacts(cat, Object.assign({ id: 'ch05-tens' }, def), list).map(x => (Array.isArray(x) ? x.join('x') : x.a + 'x' + x.b + (x.hard ? ' hard' : '')));
  // nothing was hard yesterday: 10 × 7, then 5 × 10
  assert.deepEqual(facts(cat5(st5)), ['10x7', '5x10']);
  // one hard ten: it takes the first question, as it was last asked
  assert.deepEqual(facts(cat5(st5, {}, { '10x9': [80] })), ['10x9 hard', '5x10']);
  assert.deepEqual(facts(cat5(st5, {}, null, { '10x8': 7000 })), ['10x8 hard', '5x10'], 'right but slow counts too');
  // 4 × 10 may be the hard pick (her own teacher asks it in the morning, before Puddle's riddle)
  assert.deepEqual(facts(cat5(st5, {}, { '4x10': [44] })), ['4x10 hard', '5x10'], 'for a cat whose only hard ten that is');
  // never 5 × 10 (asked anyway) nor 3 × 10 (the pile's): with only those hard, nothing is
  assert.deepEqual(facts(cat5(st5, {}, { '5x10': [5], '10x3': [13] })), ['10x7', '5x10']);
  assert.deepEqual(facts(cat5(st5, {}, { '5x10': [5], '10x3': [13], '10x8': [81] })), ['10x8 hard', '5x10']);
  // chapters 3 and 4's warm-ups read the set's own avoid, as they did
  assert.equal(st5.ch04.counts['ch04-claws'].warmHard.avoid, undefined);
  // the lesson: the engine words the first question itself; the second is Tallyheart's, with the rim cats
  const cat = cat5(st5, {}, { '10x9': [80] }), rows = play5(cat, st5, 'ch05-tens', null, { '10x9': 2500 });
  assert.deepEqual(rows.map(r => [r.k, r.prompt.map(p => p.text).join(' ')]), [['10x9', 'Nine cats. How many front claws?'], ['5x10', 'Five cats, ten front claws each. How many front claws?']]);
  assert.deepEqual([rows[0].kind, rows[0].line], ['remembered', 'Yesterday, 10 × 9 made you stop and think. Not today!']);
  assert.deepEqual(rows[1].balloons.map(b => b.text), ['Fifty!']);
  assert.deepEqual(rows[1].picture.who.map(c => c.who), ['clancat', 'murmurchime', 'clancat', 'clancat', 'grizzled']);
  assert.deepEqual(E.hardFacts(cat, 10, list), [], 'and it is no longer hard');
  // right but slow: "again, and you got it", and it stays hard
  const slow = cat5(st5, {}, { '10x9': [80] }), srow = play5(slow, st5, 'ch05-tens', null, { '10x9': 9000 })[0];
  assert.deepEqual([srow.kind, srow.line], ['rememberedSlow', '10 × 9 again, and you got it. It’s getting easier.']);
  assert.deepEqual(E.hardFacts(slow, 10, list), [[10, 9]]);
  // the Counts frame says none of its own lines again over that question (`intro: false`), so its clock is the fact's
  require('../app/ui.js');
  assert.equal(f.counts.intro, false);
  assert.deepEqual(PC.ui.speakers.lessonIntro([{ who: 'tallyheart', text: 'Tens first, to wake up your whiskers.' }], f.counts.intro === false), []);
  assert.equal(PC.ui.speakers.lessonIntro([{ who: 'tallyheart', text: 'x' }], false).length, 1, 'a frame that does not say so still says its one or two balloons again');
  assert.equal(E.readFirst({ set: 'ch05-tens', a: 10, b: 7 }, list, null, true), false, 'the opener is timed on itself');
  assert.equal(E.readFirst({ set: 'ch05-tens', a: 5, b: 10 }, list, null, false), true, '5 × 10 is read under its own prompt');
  // a plain 10 × 7 answered slowly this morning is hard for tomorrow; the same under a frame that said its lines would not be
  const fresh = cat5(st5); play5(fresh, st5, 'ch05-tens', null, { '10x7': 9000 });
  assert.deepEqual(E.hardFacts(fresh, 10, list), [[10, 7]]);
  const said = clone(ch05); delete said.frames.h01.counts.intro;
  const fresh2 = cat5(st5), list2 = [st5.ch01, st5.ch02, st5.ch03, st5.ch04, said];
  const L2 = E.chapterLesson(fresh2, said, 'ch05-tens', 1, list2);
  for (let q; (q = E.counts.question(L2.state));) E.logAnswer(fresh2, E.counts.answer(L2.state, L2.def, q.answer, 9000, 1).entry);
  assert.deepEqual(E.hardFacts(fresh2, 10, list2), [], 'read under a balloon, a slow right answer says nothing');
  // a miss borrows the easiest of yesterday's tens, after "One from yesterday.": 1 × 10 and 10 × 2; never 4 × 10 or 5 × 10
  const missed = play5(cat5(st5), st5, 'ch05-tens', { '10x7': [71, 71], '5x10': [5, 5] });
  assert.deepEqual(missed.map(r => r.k), ['10x7✗', '5x10✗', 'F:1x10', 'R:10x7✗', 'R:5x10✗', 'F:10x2', 'R:10x7', 'R:5x10']);
  missed.filter(r => r.q.filler).forEach(r => { assert.match(r.prompt[0].text, /^One from yesterday\. /); assert.ok(!['4x10', '10x4', '5x10', '10x5'].includes(r.q.a + 'x' + r.q.b), r.k); });
  assert.equal(missed.find(r => r.k === 'R:5x10✗').prompt.map(p => p.text).join(' '), 'Here’s that one again. Five cats, ten front claws each. How many front claws?');
  assert.doesNotMatch(JSON.stringify(def), /last one|\blast\b/i, 'nobody says "last"');
  const bad = clone(ch05); bad.counts['ch05-tens'].warmHard.avoid = 'the pile'; bad.frames.h01.counts.intro = 'no';
  assert.match(E.checkStory(bad, list).join('\n'), /h01: counts intro is false[\s\S]*counts ch05-tens: warmHard avoid is a list of facts/);
});

test('the pile’s one question (`ch05-pile`): three rows of ten, lit a row at a time, read under its caption; the frame’s four balloons are its own page’s; a miss is scratched in the earth a row at a time and borrows two of the easiest tens from yesterday, never 4 × 10 or 5 × 10', () => {
  const st5 = story5(), { ch05, list } = st5, f = ch05.frames.p02;
  assert.equal(f.say.length, 4, 'four balloons: the Counts frame’s own page has something to read');
  require('../app/ui.js');
  assert.deepEqual(PC.ui.speakers.lessonIntro(f.say, false), [], 'a whole conversation is not said again over the question');
  assert.equal(f.scene.opts.back, 'shadow', 'the back row is a dark band until the next screen');
  const clean = play5(cat5(st5), st5, 'ch05-pile');
  assert.deepEqual(clean.map(r => [r.k, r.q.answer, r.q.light, r.line, r.balloons.length]), [['3x10', 30, 'rows', '', 0]], 'no right line: the next screen is her answer’s reward');
  assert.deepEqual(clean[0].prompt, [{ text: 'You walk along the rows. One full row. Two. Three. How many pieces in three rows of ten?', kind: 'caption', label: null }]);
  assert.deepEqual(clean[0].picture, { table: 10, groups: 3, per: 10, highlight: 0, kind: 'prey', layout: 'rows', thought: undefined, who: undefined, thing: 'piece', things: 'pieces' });
  assert.deepEqual(clean[0].light.map(s => s.picture.highlight), [10, 20, 30]);
  const cat = cat5(st5), rows = play5(cat, st5, 'ch05-pile', { '3x10': [13] }), h = rows[0].help;
  assert.deepEqual(rows.map(r => r.k), ['3x10✗', 'F:1x10', 'F:10x2', 'R:3x10']);
  assert.deepEqual([h.intro, h.ground, h.layout, h.byRow, h.nums, h.teacher], ['Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.', 'earth', 'rows', true, [10, 20, 30], 'tallyheart']);
  assert.deepEqual(rows.slice(1, 3).map(r => r.prompt[0].text), ['One from yesterday. One cat. How many front claws?', 'One from yesterday. Two cats. How many front claws?'], 'asked as Tallyheart asked them yesterday: she is there');
  assert.equal(rows[3].prompt[0].text, 'Here’s that one again. Three rows of ten. How many pieces?');
  assert.deepEqual(E.hardFacts(cat5(st5), 10, list), [], 'a right first ask read under a prompt says nothing about speed');
  const twice = play5(cat5(st5), st5, 'ch05-pile', { '3x10': [13, 40] }).map(r => r.k);
  assert.deepEqual(twice, ['3x10✗', 'F:1x10', 'F:10x2', 'R:3x10✗', 'F:1x10', 'F:10x2', 'R:3x10'], 'with its two fresh pairs used, the easy ones again: never 4 × 10, Puddle’s riddle, nor 5 × 10');
});

test('the river’s Counts are Riffle’s, whole: the fish answers are 14, 18 and 20; a miss is scratched on a log of the raft, she counts, and the questions in between are fish too (“An easy one! One answer. How many fish?”); no line of Patience’s follows a miss, none of his says “first”, and none is one of the engine’s own sentences', () => {
  const st5 = story5(), { ch05, list } = st5;
  const DEFAULTS = ['Here’s that one again.', 'There. We\'ll come back to that one.', 'There. We’ll come back to that one.', 'There. Now you’ve seen it counted.', 'There it is. You remembered that one.', 'Yes! That one came back, and you knew it.', 'Let’s scratch it out together.', 'Yes!', 'Good work.'];
  const said = rows => rows.reduce((a, r) => a.concat(r.prompt.map(p => p.text), r.line, r.balloons.map(b => b.text), r.help ? [r.help.intro, r.help.line] : []), []).filter(Boolean);
  const clean = ['ch05-otter', 'ch05-bill', 'ch05-catch'].map(id => play5(cat5(st5), st5, id));
  assert.deepEqual(clean.map(rows => rows.map(r => [r.k, r.q.answer])), [[['7x2', 14]], [['9x2', 18]], [['4x5', 20]]]);
  // Riffle's fish: his wail over the frame's two balloons; right: he falls over backwards
  assert.deepEqual(clean[0][0].prompt.map(p => p.label + ': ' + p.text), ['Riffle: How many fish is THAT?']);
  assert.deepEqual(clean[0][0].balloons.map(b => b.who + ': ' + b.text), ['riffle: FOURTEEN?', 'riffle: For YES and NO?']);
  assert.deepEqual(clean[1][0].prompt.map(p => (p.label || 'caption') + ': ' + p.text), ['Patience: Nine answers.', 'Patience: Two fish for every answer.', 'caption: How many fish?']);
  assert.deepEqual(clean[1][0].balloons.map(b => b.who + ': ' + b.text), ['patience: Eighteen.', 'patience: Before sunset.']);
  assert.deepEqual(clean[1][0].picture, { table: 2, groups: 9, per: 2, highlight: 0, kind: 'fish', layout: 'pairs', thought: true, who: undefined, thing: 'fish', things: 'fish' });
  assert.deepEqual(clean[2][0].prompt, [{ text: 'Four strings, five fish on every string. How many fish?', kind: 'caption', label: null }]);
  assert.deepEqual(clean[2][0].balloons.map(b => b.who + ': ' + b.text), ['riffle: TWENTY!', 'player: Eighteen for Patience. Two to spare.']);
  assert.deepEqual([clean[2][0].q.light, clean[2][0].light.map(s => s.picture.highlight), clean[2][0].picture.layout], ['groups', [5, 10, 15, 20], 'strings'], 'four strings, lit a string at a time (the set’s own `light`)');
  // a miss, and a second miss, in each
  const cases = [['ch05-otter', '7x2', [15, 13], ['7x2✗', 'F:2x1', 'F:2x2', 'R:7x2✗', 'F:3x2', 'F:4x2', 'R:7x2'], 'Scratch it on the log! Two for every answer.', 'answer', 2],
    ['ch05-bill', '9x2', [20, 16], ['9x2✗', 'F:2x1', 'F:2x2', 'R:9x2✗', 'F:3x2', 'F:4x2', 'R:9x2'], 'Scratch it on the log! Two for every answer.', 'answer', 2],
    ['ch05-catch', '4x5', [25, 16], ['4x5✗', 'F:1x5', 'F:5x2', 'R:4x5✗', 'F:5x3', 'F:1x5', 'R:4x5'], 'Scratch it on the log! Five for every string.', 'string', 5]];
  cases.forEach(([id, k, wrong, seq, intro, unit, per]) => {
    const rows = play5(cat5(st5), st5, id, { [k]: wrong }), def = ch05.counts[id];
    assert.deepEqual(rows.map(r => r.k), seq, id);
    rows.forEach(r => {
      assert.equal(r.teacher, 'riffle', id + ' ' + r.k);
      // a borrowed pair takes nothing from its lender but the pair: this set's picture, this set's words
      assert.deepEqual([r.picture.kind, r.picture.layout, r.picture.thing, r.picture.per, r.picture.table], [def.picture.kind, def.picture.layout, 'fish', per, def.table], id + ' ' + r.k);
      if (r.q.filler) {
        assert.match(r.prompt[0].text, new RegExp('^An easy one! (One|Two|Three|Four) ' + unit + 's?\\. How many fish\\?$'), id + ' ' + r.k);
        assert.deepEqual([r.prompt.length, r.prompt[0].label, r.line, r.q.light], [1, 'Riffle', '', null], 'no praise at the marsh, and nothing lights by itself');
        assert.ok(r.q.groups <= (id === 'ch05-catch' ? 3 : 4), 'never more strings than he caught: ' + r.k);
      }
      if (r.help) {
        assert.deepEqual([r.help.intro, r.help.teacher, r.help.counter, r.help.ground, r.help.line], [intro, 'riffle', 'player', 'log', r.res.requeued ? 'Phew. That one again in a minute.' : 'There. Now we’ve counted it.'], id + ' ' + r.k);
        assert.equal(E.sandOpts(r.help, r.help.step).ground, 'log', 'never in mud (ReedClan’s) or sand');
      }
    });
    assert.equal(rows[3].prompt[0].text.split(' ').slice(0, 3).join(' '), 'The fish again!', 'a retry is his');
    assert.equal(rows[3].prompt[0].label, 'Riffle');
    const all = said(rows);
    all.forEach(t => { assert.ok(!DEFAULTS.includes(t), id + ': an engine default: ' + t); assert.doesNotMatch(t, /\bfirst\b/i, id + ': ' + t); });
    // after a miss nothing is Patience's, the retry's opening included (her right lines are an answer: they stay hers)
    rows.forEach((r, i) => { if (i > 0) assert.ok(!r.prompt.some(p => p.who === 'patience'), id + ' ' + r.k); });
  });
  assert.equal(play5(cat5(st5), st5, 'ch05-catch', { '4x5': [25] })[0].help.style, 'swipe', 'the fives are swiped, on the log as anywhere');
  assert.equal(play5(cat5(st5), st5, 'ch05-otter', { '7x2': [15] })[0].help.style, null);
  // a right retry: "You GOT it!" would be the set's `again`; the facts keep their own right lines there
  assert.deepEqual(play5(cat5(st5), st5, 'ch05-otter', { '7x2': [15] })[3].balloons.map(b => b.text), ['FOURTEEN?', 'For YES and NO?']);
  const lentBack = play5(cat5(st5), st5, 'ch05-otter', { '7x2': [15], '2x1': [3] });
  assert.deepEqual(lentBack.map(r => r.k), ['7x2✗', 'F:2x1✗', 'F:2x2', 'R:7x2', 'R:2x1']);
  assert.deepEqual([lentBack[4].prompt[0].text, lentBack[4].line, lentBack[1].help.ground], ['An easy one! One answer. How many fish?', 'You GOT it!', 'log'], 'a borrowed one coming back opens as it did, and is his to cheer');
  // "log" is a ground of its own
  assert.deepEqual(E.GROUNDS, ['sand', 'earth', 'mud', 'grit', 'log']);
  const bad = clone(ch05); bad.counts['ch05-otter'].ground = 'raft'; bad.counts['ch05-bill'].fillPicture = 'lender'; bad.counts['ch05-catch'].fillVoice = undefined; delete bad.counts['ch05-catch'].fillVoice;
  const errs = E.checkStory(bad, list).join('\n');
  for (const want of [/ch05-otter: ground is "sand", "earth", "mud", "grit" or "log"/, /ch05-bill: fillPicture is "borrower"/, /ch05-catch: fillPicture goes with fillVoice: "borrower"/]) assert.match(errs, want);
});

test('Puddle’s riddle and Wisp’s: his bump stars light a log at a time and she hops (no ground: `help: "picture"`); he borrows logs and bumps, never more than three logs; her set is lettered in captions, with one line of Patience’s, and borrows three herons and five; neither ever speaks one of the engine’s own sentences', () => {
  const st5 = story5(), { ch05, list } = st5;
  const DEFAULTS = ['Here’s that one again.', 'There. We’ll come back to that one.', 'There. Now you’ve seen it counted.', 'There it is. You remembered that one.', 'Yes! That one came back, and you knew it.', 'Let’s scratch it out together.', 'Yes!'];
  // Puddle
  const p = play5(cat5(st5), st5, 'ch05-puddle', { '4x10': [44, 30] });
  assert.deepEqual(p.map(r => r.k), ['4x10✗', 'F:1x10', 'F:10x2', 'R:4x10✗', 'F:10x3', 'F:1x10', 'R:4x10']);
  assert.deepEqual(p[0].prompt.map(x => x.label + ': ' + x.text), ['The big-footed dragon: Four logs in this raft. I’ve bumped my head ten times on every one. How many bumps?'], 'he has not said his name yet');
  assert.deepEqual(p[0].picture, { table: 10, groups: 4, per: 10, highlight: 0, kind: 'bumps', layout: undefined, thought: undefined, who: undefined, thing: 'bump', things: 'bumps' });
  assert.deepEqual([p[0].help.intro, p[0].help.picture, p[0].help.ground, p[0].help.counter, p[0].help.nums, p[0].help.style, p[0].help.pair, p[0].help.line],
    ['Count my bumps! You hop!', true, null, 'player', [10, 20, 30, 40], null, undefined, 'There! Let’s do that one again.']);
  assert.deepEqual(E.helpSteps(p[0].help).map(s => E.lessonPicture(p[0].D, p[0].q, s.counted).highlight), [10, 20, 30, 40], 'the same picture, a log more lit at each hop');
  assert.deepEqual(p.filter(r => r.q.filler).map(r => [r.prompt[0].text, r.picture.kind, r.picture.groups, r.line]),
    [['Do another one! One log. How many bumps?', 'bumps', 1, 'YES!'], ['Do another one! Two logs. How many bumps?', 'bumps', 2, 'You’re GOOD at bumps!'], ['Do another one! Three logs. How many bumps?', 'bumps', 3, 'YES!'], ['Do another one! One log. How many bumps?', 'bumps', 1, 'You’re GOOD at bumps!']]);
  assert.ok(p.every(r => r.q.groups <= 4 && r.teacher === 'puddle' && (!r.q.filler || r.q.groups <= 3)), 'never more logs than the raft has');
  assert.equal(p[3].prompt[0].text, 'My bumps again! Four logs, ten bumps on every one. How many bumps?');
  assert.deepEqual(p[6].balloons.map(b => b.who + ': ' + b.text), ['puddle: FORTY!', 'puddle: No wonder it hurts.']);
  const p3 = play5(cat5(st5), st5, 'ch05-puddle', { '4x10': [44, 30, 14] });
  assert.equal(p3.filter(r => /4x10✗/.test(r.k))[2].line, 'There! All my bumps, counted.', 'the last miss, in his words');
  assert.equal(play5(cat5(st5), st5, 'ch05-puddle', { '4x10': [44], '1x10': [1] }).find(r => r.k === 'R:1x10').line, 'You DID it!');
  // Wisp: nobody speaks in her set but Patience, once
  const w = play5(cat5(st5), st5, 'ch05-wisp', { '7x1': [14, 8] });
  assert.deepEqual(w.map(r => r.k), ['7x1✗', 'F:3x1', 'F:1x5', 'R:7x1✗', 'F:6x1', 'F:3x1', 'R:7x1']);
  w.forEach(r => {
    assert.equal(r.teacher, 'caption', r.k);
    r.prompt.forEach(x => assert.deepEqual([x.kind, x.who, x.label], ['caption', undefined, null], r.k + ': ' + x.text));
    r.balloons.forEach(b => assert.equal(b.kind, 'caption'));
    assert.deepEqual([r.picture.kind, r.picture.per, r.picture.thing], ['herons', 1, 'leg in the water']);
    if (r.help) assert.deepEqual([r.help.intro, r.help.says, r.help.counter, r.help.picture, r.help.ground, r.help.teacher], ['Look again. One leg each.', 'patience', 'player', true, null, 'caption'], 'Patience, without turning her head; and she counts them herself, by ones');
  });
  assert.deepEqual(w[0].prompt.map(x => x.text), ['Seven herons, each standing on one leg. How many legs in the water?']);
  assert.deepEqual(w[0].help.nums, [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(w.slice(1, 3).map(r => [r.prompt.map(x => x.text), r.picture.groups]), [[['She draws another one.', 'Three herons. How many legs in the water?'], 3], [['She draws another one.', 'Five herons. How many legs in the water?'], 5]], 'a caption of its own before the question’s');
  assert.deepEqual(w[3].prompt.map(x => x.text), ['She taps the seven herons again.', 'Seven herons, each standing on one leg. How many legs in the water?']);
  assert.deepEqual([w[0].line, w[3].line, w[6].balloons.map(b => b.text), w[1].line], ['She points at them again.', 'She points at them again.', ['She nods. Once.'], '']);
  assert.equal(play5(cat5(st5), st5, 'ch05-wisp', { '7x1': [14, 8, 6] }).filter(r => /7x1✗/.test(r.k))[2].line, 'She counts them with you, one by one.');
  assert.equal(play5(cat5(st5), st5, 'ch05-wisp', { '7x1': [14], '3x1': [4] }).find(r => r.k === 'R:3x1').line, 'She nods.');
  assert.deepEqual(E.spoken('caption', 'She nods.'), { text: 'She nods.', kind: 'caption' });
  assert.deepEqual(E.spoken('riffle', 'You GOT it!'), { who: 'riffle', text: 'You GOT it!' });
  // neither set ever falls back on a sentence of the engine's (a teacher's)
  [p, p3, w].forEach(rows => rows.forEach(r => [].concat(r.prompt.map(x => x.text), r.line, r.help ? [r.help.intro, r.help.line] : []).forEach(t => assert.ok(!DEFAULTS.includes(t), r.k + ': ' + t))));
  // one question each, extra to the chapter's sixteen
  assert.deepEqual([play5(cat5(st5), st5, 'ch05-puddle').length, play5(cat5(st5), st5, 'ch05-wisp').length], [1, 1]);
  const bad = clone(ch05); bad.counts['ch05-puddle'].help = 'sand'; bad.counts['ch05-wisp'].helpSays = 7;
  assert.match(E.checkStory(bad, list).join('\n'), /ch05-puddle: help is "picture"[\s\S]*ch05-wisp: helpSays is a line/);
});

test('a playthrough with no misses types sixteen answers, seventeen to nineteen with the riddles; the Taps that count log nothing: four paws aboard (counted in words by Tallyheart), nine claws in the log (her own thought, the scene drawn again as she taps, the roar growing), a forepaw each for Puddle and Wisp, and the bedtime nines', () => {
  const st5 = story5(), { ch05, list } = st5;
  const typed = c => { const cat = start5(cat5(st5), st5), n0 = cat.counts.length; read5(cat, st5, { choices: choices5(c) }); return cat.counts.length - n0; };
  assert.equal(typed({ up: false, lean: false, ask: false, wait: 0, first: 'otters' }), 16);
  assert.deepEqual([typed({ up: true, lean: false, ask: false, wait: 0, first: 'heron' }), typed({ up: false, lean: false, ask: true, wait: 3, first: 'heron' }), typed({ up: true, lean: true, wait: 3, first: 'otters' })], [17, 18, 19]);
  // paws aboard
  const board = ch05.frames.c06.skip, bw = E.skipWords(board, 'tallyheart');
  assert.deepEqual([0, 1, 2, 3, 4].map(n => E.skipView(board, n).count), ['', 'One.', 'One. Two.', 'One. Two. Three.', 'One. Two. Three. Four.']);
  assert.deepEqual([E.skipView(board, 3).say, E.skipView(board, 4).done, E.skipView(board, 4).total, E.skipView(board, 2).paws], ['Three.', true, 4, 'board']);
  assert.deepEqual(E.skipPicture(board, 2), { table: 1, groups: 4, per: 1, highlight: 2, totals: false, next: true, who: undefined, thing: 'paw', things: 'paws', paws: 'board', taps: 2 });
  assert.deepEqual([bw.teacher, bw.words, bw.whisper, bw.label, bw.aria, bw.prompt], ['tallyheart', true, false, 'Put the next paw on the raft.', 'Your four paws at the raft’s edge. Touch the glowing one.', '**Tap** each paw onto the raft.']);
  assert.equal(bw.noNumber, true, 'no big number over her paws: Tallyheart says the count');
  assert.deepEqual([E.skipOnScene(board), E.skipInto(ch05, 'c07'), board.carry], [false, null, false], 'a counting picture of her own paws; its number stays on its page');
  // nine claws in the log: no counting picture; the frame's scene with the step's options laid over it
  const f = ch05.frames.o03, log = f.skip, lw = E.skipWords(log, 'riffle');
  assert.deepEqual([lw.teacher, lw.think, lw.whisper, lw.label, lw.aria, lw.thing], ['player', true, false, 'Dig in the next claw.', 'Your two forepaws on a log. Touch anywhere to dig in the next claw.', 'claw']);
  // (the big number is the tuck's and the older counts' alone: no chapter 1 to 4 skip says `noNumber`)
  assert.deepEqual([E.skipWords(ch05.frames.h05.skip, 'tallyheart').noNumber, E.skipWords(ch05.frames.d11.skip, 'player').noNumber, E.skipWords({ table: 5, groups: 4, next: 'x' }).noNumber], [undefined, undefined, undefined]);
  assert.deepEqual([E.skipOnScene(log), E.skipView(log, 0).anywhere, E.skipView(log, 9).done, E.skipView(log, 9).total, E.skipView(log, 4).count], [true, true, true, 9, '1… 2… 3… 4…']);
  assert.equal(E.skipView(log, 9).count, '1… 2… 3… 4… 5… 6… 7… 8… 9!');
  const scenes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => E.skipScene(f.scene, log, n, ''));
  assert.deepEqual(scenes.map(s => s.scene.opts.plane), ['none', 'far', 'far', 'far', 'near', 'near', 'near', 'over', 'over', 'over'], 'three sizes are enough');
  assert.deepEqual(scenes.map(s => s.scene.opts.claws), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'a claw dug in at each tap, the tenth tucked');
  assert.deepEqual(scenes.map(s => s.sfx), ['', 'rrr…', 'rrr…', 'rrr…', 'RRRrrr…', 'RRRrrr…', 'RRRrrr…', 'RRRRRR…', 'RRRRRR…', 'RRRRRR…'], 'the roar, lettered larger at each step');
  assert.deepEqual(scenes.map(s => s.step), [-1, 0, 0, 0, 1, 1, 1, 2, 2, 2]);
  assert.deepEqual([f.scene.opts.plane, f.scene.opts.claws, scenes[9].scene.set, scenes[9].scene.cam], ['none', undefined, 'openriver', 'log'], 'the story’s own scene is never changed');
  assert.equal(E.skipScene(f.scene, log, 0, 'hush').sfx, 'hush', 'before the first step, the frame’s own lettering');
  // the forepaws: chapter 4's one-group skip, for Puddle and for Wisp
  ['ua7', 'ub7', 'k10'].forEach(id => {
    const sk = ch05.frames[id].skip, who = id === 'k10' ? 'wisp' : 'puddle';
    assert.deepEqual(E.skipPicture(sk, 1), { table: 5, groups: 1, per: 5, highlight: 5, totals: true, next: false, who: [{ who }], thing: 'claw', things: 'claws' });
    assert.deepEqual([E.skipView(sk, 1).total, E.skipView(sk, 1).done, E.skipInto(ch05, sk.next)], [5, true, null]);
  });
  // the bedtime nines: both forepaws together, one claw tucked, nine lit a tap, the murmur trailing off
  const bed = ch05.frames.d11.skip, w = E.skipWords(bed, 'player');
  assert.deepEqual([0, 1, 2, 5].map(n => E.skipView(bed, n).count), ['', '9…', '9… 18…', '9… 18… 27… 36… 45…']);
  assert.deepEqual(E.skipPicture(bed, 2), { table: 9, groups: 5, per: 9, highlight: 18, totals: false, next: true, who: undefined, thing: 'claw', things: 'claws', paws: 'own', both: true, taps: 2, lit: 'both', nextPaw: 'both' });
  assert.deepEqual([w.teacher, w.whisper, w.label, E.skipReached(E.skipInto(ch05, 'd12'))], ['player', true, 'Tap your forepaws.', 45]);
  // nothing here is an answer
  const cat = start5(cat5(st5), st5), rows = read5(cat, st5, { choices: choices5({ up: false, lean: true, wait: 3, first: 'otters' }) });
  ['h05', 'c06', 'o03', 'ua7', 'k10', 'b04', 'd11', 'm04', 'p01', 'ha6', 'm12'].forEach(id => { const i = ids5(rows).indexOf(id); assert.ok(i >= 0, id); assert.equal(rows[i + 1].counts, rows[i].counts, id + ' logs nothing'); });
  // E.checkStory: the new paws, and steps only where the scene stays up
  const bad = clone(ch05);
  bad.frames.c06.skip.steps = [{ from: 1, opts: { plane: 'far' } }]; bad.frames.o03.skip.steps = [{ opts: { plane: 'far' } }]; bad.frames.d11.skip.paws = 'all';
  delete bad.frames.o04.scene; bad.frames.o04.skip = { table: 1, groups: 2, paws: 'log', next: 'o05a' }; delete bad.frames.o04.choice;
  const errs = E.checkStory(bad, list).join('\n');
  for (const want of [/c06: skip steps redraw the frame’s scene/, /o03: skip steps is a list of \{ from, opts, sfx \}/, /d11: skip paws is "own", "both", "pile", "board", "log" or "mud"/, /o04: this skip-count is tapped on the frame’s own scene: it needs one/]) assert.match(errs, want);
});

test('the Training Hollow after chapter 5: it offers “Nine lives · the 9s” (never the pile, the warm-up, the fish or the riddles); Tallyheart’s lines there differ for the 5s, the 10s and the 9s; a round is the still picture, her sand, most recent fillers; the tree has five marks', () => {
  const st5 = story5(), { ch05, list } = st5;
  const cat = start5(cat5(st5), st5);
  read5(cat, st5, { choices: choices5({ up: true, lean: true, wait: 3, first: 'otters' }) });
  cat.lessons['ch04-tens'] = cat.lessons['ch04-tens'] || { finished: true };
  const learned = E.learnedCounts(cat, list);
  assert.deepEqual(learned.map(c => [c.table, c.setId]), [[1, 'ch01-tails'], [2, 'ch02-ears'], [5, 'ch03-claws'], [10, 'ch04-tens'], [9, 'ch05-nines']], 'in the order they are taught');
  const H = E.hollowLines(cat, list);
  assert.deepEqual(H.counts.map(c => c.name), ['Tails · the 1s', 'Ears · the 2s', 'Claws · the 5s', 'Both forepaws · the 10s', 'Nine lives · the 9s']);
  assert.equal(E.resolveScene({ set: 'hollow', opts: { marks: 'auto', glow: 'auto' } }, cat, list).opts.marks, 5);
  const lines = t => { const d = E.hollowDef(list, t); return [E.hollowRoundLine(d), E.hollowGlowNote(d, true), E.hollowWord(d)]; };
  assert.deepEqual(lines(9), ['A round of nines. Ready? Here we go.', 'Look! Your nines claw mark on the tree is glowing.', 'nines']);
  [0, 1, 2].forEach(i => assert.equal(new Set([lines(5)[i], lines(10)[i], lines(9)[i]]).size, 3, 'the 5s, the 10s and the 9s never read the same'));
  // the round's definition: the nines' own lines and help, and none of the story's machinery
  const def = E.hollowDef(list, 9);
  ['light', 'fillOrder', 'facts', 'firstPrompt', 'fillFrom', 'ground', 'help', 'helpSays', 'fillPicture'].forEach(k => assert.ok(!(k in def), k));
  assert.deepEqual([def.id, def.table, def.teacher, def.thing, def.unit, def.helpIntroNotNine], ['hollow-9s', 9, 'tallyheart', 'life', 'cat', ch05.counts['ch05-nines'].helpIntroNotNine]);
  const r = E.hollowStart(cat, list, 1, 9), ks = [];
  for (let q; (q = E.counts.question(r.state));) {
    ks.push(q.a + 'x' + q.b);
    assert.deepEqual([q.table, q.per, q.light], [9, 9, null]);
    assert.match(E.promptLines(r.def, r.def, q)[0].text, /^(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten) cats?\. How many lives\?$/);
    assert.deepEqual(E.lessonPicture(r.def, q, 0), { table: 9, groups: q.groups, per: 9, highlight: 0, kind: undefined, layout: undefined, thought: undefined, who: undefined, thing: 'life', things: 'lives' });
    E.counts.answer(r.state, r.def, q.answer, 2000, 1);
  }
  assert.deepEqual(ks.map(k => k.split('x').map(Number).sort((a, b) => a - b).join('x')).sort(), ['1x9', '2x9', '3x9', '4x9', '5x9', '6x9', '7x9', '8x9', '9x10', '9x9'].sort());
  // the grown-ups' table for the 9s takes its name from the set
  const t9 = E.factTables(cat, list).find(t => t.table === 9);
  assert.deepEqual([t9.name, t9.rows.length], ['Nine lives · the 9s', 10]);
  assert.equal(E.countFor(9, list).setId, 'ch05-nines');
  // chapter 5's other sets teach nothing new: the 10s' own set is still chapter 4's, the 2s' chapter 2's
  assert.deepEqual([E.countFor(10, list).setId, E.countFor(2, list).setId, E.countFor(5, list).setId, E.countFor(1, list).setId], ['ch04-tens', 'ch02-ears', 'ch03-claws', 'ch01-tails']);
});

test('one-tap frames (`scratch: { tap }`) on five new things, each with its instruction, its hidden button and its small answer to a tap anywhere else; the page picks the target named for the tap, and draws its own soft glow on it (PC.ui.taps)', () => {
  const st5 = story5(), { ch05, list } = st5;
  require('../app/ui.js');
  const T = PC.ui.taps;
  const taps = Object.entries(ch05.frames).filter(([, f]) => f.scratch).map(([id, f]) => [id, f.scratch.tap, E.tapWords(f)]);
  assert.deepEqual(taps.map(t => t[1]), ['nose', 'earth', 'fur', 'fur', 'mud', 'pole']);
  assert.deepEqual(taps.map(t => [t[2].kind, t[2].label, t[2].miss]), [['tap', 'Wake him up.', 'snnnrrk…'], ['tap', 'Look at the dug earth.', 'rustle…'], ['tap', 'Sniff the fur.', 'flutter…'], ['tap', 'Sniff the fur.', 'flutter…'], ['tap', 'Look at the mud.', 'ripple…'], ['tap', 'Run up the pole.', 'wobble…']]);
  assert.equal(taps[0][2].prompt, '**Tap** his nose to wake him up.');
  // chapter 4's glitter Tap has no small answer, and its words are what they were
  assert.deepEqual(E.tapWords({ scratch: { tap: 'glint', next: 'x' } }), { kind: 'tap', prompt: '**Tap** the glitter.', label: 'Look at the glitter.' });
  assert.deepEqual(E.tapWords({ scratch: { tap: 'nose', next: 'x' } }), { kind: 'tap', prompt: '', label: 'Tap it.' });
  // which of a picture's marks a tap is for: the one named for it; else the first glint or pc-tap
  const marsh = [{ tap: 'mud', cls: 'pc-tap' }, { tap: 'pole', cls: 'pc-tap' }];
  assert.deepEqual([T.pick(marsh, 'mud'), T.pick(marsh, 'pole'), T.pick(marsh, 'nose'), T.pick([], 'nose'), T.pick(null, 'x')], [0, 1, -1, -1, -1]);
  assert.equal(T.pick([{ cls: 'pc-tap' }, { tap: 'pole', cls: 'pc-tap' }], 'mud'), 0, 'an unnamed mark is anybody’s');
  assert.equal(T.pick([{ cls: 'pc-tap pc-tap-pole' }, { cls: 'pc-tap pc-tap-mud' }], 'mud'), 1);
  assert.equal(T.pick([{ art: 'glint' }], 'glint'), 0, 'chapter 4’s glint, as it was found');
  assert.equal(T.pick([{ cls: 'pc-tap' }, { art: 'glint' }], 'glint'), 1);
  assert.equal(T.pick([{ cls: 'pc-glint' }], 'glint'), 0);
  assert.equal(T.pick([{ art: 'fur' }], 'fur'), 0);
  // the page's glow: as wide as the thing and a little more, never smaller than a fingertip nor wider than a quarter of the panel
  assert.deepEqual([T.glow(0), T.glow(1), T.glow(5), T.glow(20), T.glow(undefined)], [9, 9, 12.5, 26, 9]);
  // a tap on it turns the page, a tap anywhere else does not (the hit test is chapter 4's)
  assert.ok(T.hit(1000, 625, { x: 30, y: 40 }, 300, 250, 3) && !T.hit(1000, 625, { x: 30, y: 40 }, 700, 500, 3));
  // the art's picture of her answers is used when it names them; else the page draws its own
  assert.equal(T.namesAnswers('<svg aria-label="Scratched in the sand: 18 and 36">', [18, 36]), true);
  assert.equal(T.namesAnswers('<svg aria-label="1 groups of 1 scratches in the sand" viewBox="0 0 118 136">', [18, 36]), false, 'an art that does not know `answers` draws a scratch');
  assert.equal(T.namesAnswers('<svg aria-label="36 alone">', [36]), true);
  assert.equal(T.namesAnswers('<svg aria-label="136 and 18">', [18, 36]), false, 'whole numbers');
  assert.equal(T.namesAnswers('', [36]), false);
  // E.checkStory: `miss` is a line, and belongs to a tap
  const bad = clone(ch05); bad.frames.p01.scratch.miss = 3;
  assert.match(E.checkStory(bad, list).join('\n'), /p01: scratch miss is a line/);
  // every eye card of the chapter comes straight after a Tap
  const cat = start5(cat5(st5, { specialty: 'noticing' }), st5), rows = read5(cat, st5, { choices: choices5({ lean: false, wait: 0, first: 'otters' }) });
  rows.forEach((r, i) => r.cards.filter(c => c.mark === 'eye' && !c.held).forEach(c => assert.ok(rows[i - 1].kind === 'scratch' || r.kind === 'scratch', c.id + ' at ' + r.id)));
});

test('speakers in chapter 5: “The big-footed dragon” until “I’m Puddle”, then “Puddle”, in the reeds too; Patience by name from her first balloon; the ferry otters as chapter 2 called them; Wisp has no label to need; the voices; and the grown-ups corner has words for every flag the chapter sets', () => {
  const st5 = story5(), { ch05, list } = st5;
  require('../app/ui.js');
  const Sp = PC.ui.speakers, cat = start5(cat5(st5), st5);
  const rows = read5(cat, st5, { choices: choices5({ up: true, lean: true, wait: 3, first: 'otters' }), answers: { '4x10': [44] } });
  const labels = id => frame5(rows, id).say.map(b => b.label);
  assert.deepEqual([labels('ua2'), labels('ua3')], [['The big-footed dragon', 'Moonpaw', 'The big-footed dragon'], ['Moonpaw', 'The big-footed dragon']]);
  frame5(rows, 'ua3').lesson.forEach(r => { r.prompt.forEach(p => assert.equal(p.label, 'The big-footed dragon', r.k)); assert.equal(label4({ who: r.teacher }, cat, ch05), 'The big-footed dragon', r.k + ': his praise, his miss line, his help'); });
  assert.deepEqual([labels('ua4'), labels('ua5'), labels('ua6'), labels('ua7'), labels('k07')], [['Puddle', 'Riffle'], ['Puddle'], ['Moonpaw', 'Puddle'], ['Puddle'], ['Puddle', 'Puddle']]);
  assert.equal(Sp.nameOn([{ who: 'puddle', name: 'Puddle', text: 'x' }], 'puddle'), 'Puddle');
  assert.deepEqual([labels('m05'), labels('m07')], [['Patience', 'Patience'], ['Moonpaw', 'Patience']]);
  assert.deepEqual([labels('c01'), labels('ha1'), labels('ha3')], [['Riffle', 'The old ferry otter'], ['Moonpaw', 'An otter'], ['Moonpaw', 'The old ferry otter']]);
  assert.deepEqual(labels('r02'), ['The little dragon'], 'chapter 5 labels Squall as chapter 4 does');
  assert.deepEqual(ch05.names, { squall: 'The little dragon', puddle: 'The big-footed dragon' });
  assert.deepEqual([Sp.NAMES.patience, Sp.NAMES.puddle, Sp.NAMES.wisp], ['Patience', 'Puddle', 'Wisp']);
  assert.equal(Sp.label({ who: 'puddle' }, { cat, story: st5.ch04, fill: t => t }), 'Puddle', 'a chapter without the label calls him by name');
  // Read to me: Patience low and slow, Puddle bright and quick
  assert.ok(Sp.pitch('patience') < Sp.pitch('glintstar') && Sp.rate('patience') < 0.9, 'low and slow');
  assert.ok(Sp.pitch('puddle') > 1.2 && Sp.rate('puddle') > 1, 'bright and quick');
  assert.deepEqual([Sp.pitch('tallyheart'), Sp.rate('tallyheart'), Sp.pitch('squall'), Sp.rate('sprinkle')], [0.92, 0.95, 1.7, 0.86], 'the others as they were');
  // the grown-ups corner: words for every flag a frame or an option of chapter 5 sets
  const W = PC.ui.flagWords;
  Object.entries(ch05.frames).forEach(([id, f]) => {
    Object.entries(f.sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v));
    ((f.choice && f.choice.options) || []).forEach(o => Object.entries(o.sets || {}).forEach(([k, v]) => assert.ok(W[k] && W[k][String(v)], id + ': words for ' + k + ': ' + v)));
  });
  assert.deepEqual([W.ch5First.otters, W.ch5First.heron, W.foundPuddle.true, W.foundWisp.true], ['asked the ferry otters first', 'asked the heron first', 'found Puddle under the ferry raft (later chapters remember)', 'found Wisp in the heron’s reeds (later chapters remember)']);
  assert.match(W.ch5Roof.true, /^met Squall in chapter 5/);
  assert.deepEqual(PC.ui.quietFlags, { looked: 1, caseFileOpen: 1 });
  // her cards, as the corner lists them: all of them, with one her file does not show yet marked so
  const half = start5(cat5(st5), st5);
  read5(half, st5, { choices: choices5({ lean: true, first: 'otters' }), stop: 'ua6' });
  while (half.frame !== 'o10') E.back(half, ch05);
  assert.deepEqual(E.cards(half, list, { all: true }).filter(c => !c.shown).map(c => c.id), ['puddle-paws']);
});

test('the save after chapter 5: still version 2, and nothing new is stored; a chapter-4 save opens with chapter 5 next; a nines lesson in progress goes through the store and is picked up at the same question, with what it has shown her', () => {
  const st5 = story5(), { ch05, list } = st5;
  const old = cat5(st5);
  assert.deepEqual(Object.keys(E.migrate({ version: 2, cats: [clone(old)], current: old.id }).cats[0]).sort(), Object.keys(E.blankCat({})).sort(), 'no new field on a cat');
  assert.equal(E.upNext(E.migrate({ version: 2, cats: [clone(old)], current: old.id }).cats[0], list).id, 'ch05');
  // mid-lesson, through the store
  const cat = start5(cat5(st5), st5);
  read5(cat, st5, { stop: 'h06' });
  const L = E.chapterLesson(cat, ch05, 'ch05-nines', 1, list);
  E.beginLesson(cat, ch05, 'h06', L.state);
  [17, 90, 40].forEach(a => { const q = E.counts.question(L.state); E.logAnswer(cat, E.counts.answer(L.state, E.questionDef(L.def, q, ch05, list), a, 2000, 1).entry); });
  cat.lesson = { mode: 'chapter', frame: 'h06', chapter: 'ch05', state: L.state };
  const mem = memStorage(), store = E.createStore(mem);
  store.save({ version: 2, cats: [cat], current: cat.id, settings: {} });
  const back = store.load().cats[0], Lb = E.lessonAt(back, ch05, 'h06');
  assert.ok(Lb, 'the lesson is handed back at its frame');
  assert.deepEqual([Lb.state.pos, Lb.state.shown, Lb.state.easiest, Lb.state.queue[Lb.state.pos].a + 'x' + Lb.state.queue[Lb.state.pos].b, Lb.state.queue[Lb.state.pos].light], [3, true, true, '2x9', 'tuck']);
  const q = E.counts.question(Lb.state), res = E.counts.answer(Lb.state, L.def, 18, 2000, 1);
  assert.deepEqual([q.retry, res.balloons.map(b => b.text)], [true, ['Eighteen! One and eight. There’s your nine.']]);
  // her flags and her cards from chapter 5 go through too
  const done = start5(cat5(st5), st5); read5(done, st5, { choices: choices5({ up: true, lean: true, wait: 3, first: 'heron' }) });
  store.save({ version: 2, cats: [done], current: done.id, settings: {} });
  const again = store.load().cats[0];
  assert.deepEqual([again.flags, again.cards, again.finished, again.lessons], [done.flags, done.cards, done.finished, done.lessons]);
  assert.deepEqual(E.caseFile(again, list), E.caseFile(done, list));
});

/* ================================================================ chapter 6 (the words: docs/build.md, "Chapter 6")
 * No engine key changes (the spec's "Engine needs"; one behaviour does: a Count is learned when its own
 * set is finished, tested in the hollow tests above and in story-ch06). The UI's speakers gain Coil, Sloshbank,
 * Sleet and ReedClan's cats by coat, their voices, the three poses that show no face, and the
 * grown-ups corner's words for `foundSleet`; chapters 1 to 5's labels, voices and faces are as they were. */
test('chapter 6’s speakers (PC.ui.speakers): Coil, Sloshbank, Sleet and ReedClan by coat, the chapter’s stand-in names and a balloon’s own name, their voices', () => {
  require('../app/ui.js');
  const Sp = PC.ui.speakers;
  const cat = E.blankCat({}); cat.name = 'Fern';
  const fill = t => E.fill(t, cat);
  // the chapter's `names`, as the spec gives them (a stand-in: the story builder writes app/story/ch06.js)
  const ch06 = { id: 'ch06', names: { coil: 'The snake', sleet: 'The silver-white dragon' } };
  const label = (s, story) => Sp.label(s, { cat, story, fill });
  assert.deepEqual([label({ who: 'coil' }, ch06), label({ who: 'coil', name: 'A voice' }, ch06), label({ who: 'coil', name: 'Coil' }, ch06), label({ who: 'coil' }, {})],
    ['The snake', 'A voice', 'Coil', 'Coil'], 'a stand-in until Riffle names him; a balloon’s own name wins; a chapter without it calls him Coil');
  assert.deepEqual([label({ who: 'sleet' }, ch06), label({ who: 'sleet', name: 'The long grass' }, ch06), label({ who: 'sleet', name: 'Sleet' }, ch06), label({ who: 'sleet' }, {})],
    ['The silver-white dragon', 'The long grass', 'Sleet', 'Sleet']);
  assert.equal(label({ who: 'sloshbank' }, ch06), 'Sloshbank');
  assert.deepEqual([1, 2, 3, 4].map(v => label({ who: 'reedclan', variant: v }, ch06)), ['ReedClan she-cat', 'Young ReedClan tom', 'A ReedClan cat', 'A ReedClan cat']);
  assert.equal(label({ who: 'reedclan' }, ch06), 'ReedClan she-cat', 'no variant is the first, as an otter’s and a dog’s are');
  assert.equal(label({ who: 'reedclan', variant: 9 }, ch06), 'A ReedClan cat');
  assert.deepEqual([Sp.NAMES.coil, Sp.NAMES.sloshbank, Sp.NAMES.sleet, Sp.NAMES.reedclan], ['Coil', 'Sloshbank', 'Sleet', 'A ReedClan cat']);
  // {name} in a balloon's own name is filled, as before ("{Murmur}chime")
  assert.equal(label({ who: 'murmurchime' }, ch06), 'Murmurchime');
  // Read to me: Coil low and very slow, Sloshbank low and slow, Sleet high, quick and loud, the young tom a little high
  assert.deepEqual([Sp.pitch('coil'), Sp.rate('coil')], [0.72, 0.7]);
  assert.deepEqual([Sp.pitch('sloshbank'), Sp.rate('sloshbank')], [0.62, 0.88]);
  assert.deepEqual([Sp.pitch('sleet'), Sp.rate('sleet')], [1.45, 1.04]);
  assert.ok(Sp.rate('coil') < Sp.rate('patience') && Sp.rate('coil') < Sp.rate('sloshbank'), 'Coil is the slowest voice in the game');
  assert.ok(Sp.pitch('sloshbank') < Sp.pitch('glintstar') && Sp.pitch('sloshbank') < Sp.pitch('coil'), 'the big stern tom the lowest but the old tom');
  assert.ok(Sp.pitch('sleet') > Sp.pitch('tallyheart') && Sp.rate('sleet') > 0.95);
  const young = Sp.pitch('reedclan', 2), she = Sp.pitch('reedclan', 1);
  assert.ok(young > she && young > 1 && young < Sp.pitch('player'), 'the young tom a little high: ' + young);
  assert.deepEqual([3, 4].map(v => Sp.pitch('reedclan', v)), [she, she]);
  // everyone from chapters 1 to 5 as they were
  assert.deepEqual(['tallyheart', 'glintstar', 'grizzled', 'riffle', 'sprinkle', 'reynard', 'squall', 'patience', 'puddle', 'wisp', 'player', 'clancat'].map(w => [Sp.pitch(w), Sp.rate(w)]),
    [[0.92, 0.95], [0.85, 0.95], [0.6, 0.95], [1.5, 0.95], [1.38, 0.86], [0.8, 0.82], [1.7, 1.02], [0.7, 0.8], [1.32, 1.05], [1.25, 0.95], [1.2, 0.95], [1.0, 0.95]]);
  assert.deepEqual([Sp.pitch('otter', 1), Sp.pitch('otter', 2), Sp.pitch('dog', 3)], [0.68, 1.05, 1.75]);
});

test('chapter 6’s faces not shown: a named balloon whose speaker is only a stone in the wall (Coil’s `stone`) or only grass and a tail’s tip (Sleet’s `hidden`, `tail`); every other pose shows the face, and chapters 1 to 5’s faces are as they were', () => {
  require('../app/ui.js');
  const Sp = PC.ui.speakers;
  assert.equal(Sp.faceHidden({ who: 'coil', name: 'A voice' }, { who: 'coil', pose: 'stone' }), true);
  assert.equal(Sp.faceHidden({ who: 'sleet', name: 'The long grass' }, { who: 'sleet', pose: 'hidden' }), true);
  assert.equal(Sp.faceHidden({ who: 'sleet', name: 'The long grass' }, { who: 'sleet', pose: 'tail' }), true);
  // shown: every other pose of theirs, named or not
  ['head', 'long', 'longer', 'still', 'listen', 'think', 'slide'].forEach(p => assert.equal(Sp.faceHidden({ who: 'coil', name: 'The snake' }, { who: 'coil', pose: p }), false, 'Coil ' + p));
  ['flat', 'point', 'call', 'puff', 'droop', 'sit', 'pawup'].forEach(p => assert.equal(Sp.faceHidden({ who: 'sleet', name: 'Sleet' }, { who: 'sleet', pose: p }), false, 'Sleet ' + p));
  // a balloon without its own name keeps its face, in any pose (the chapter's stand-in names are labels only)
  assert.equal(Sp.faceHidden({ who: 'coil' }, { who: 'coil', pose: 'stone' }), false);
  assert.equal(Sp.faceHidden({ who: 'sleet' }, { who: 'sleet', pose: 'hidden' }), false);
  // the old ones: eyes and hide still hide; the poses that came before still show
  assert.equal(Sp.faceHidden({ who: 'sprinkle', name: 'A small voice' }, { who: 'sprinkle', pose: 'eyes' }), true);
  assert.equal(Sp.faceHidden({ who: 'sprinkle', name: 'A muffled voice' }, { who: 'sprinkle', pose: 'hide' }), true);
  assert.equal(Sp.faceHidden({ who: 'sprinkle', name: 'A small voice' }, null), true, 'out of the picture: as before');
  ['sit', 'peek', 'tailup', 'unfold', 'head', 'flat'].forEach(p => assert.equal(Sp.faceHidden({ who: 'sprinkle', name: 'The dragon' }, { who: 'sprinkle', pose: p }), false, p));
  // every cast member of chapters 1 to 5, as a named speaker in the pose it is drawn in: the rule before chapter 6
  const before = (s, m) => !!s.name && (!m || m.pose === 'eyes' || m.pose === 'hide');
  const S = realStories();
  let n = 0;
  ['ch01', 'ch02', 'ch03', 'ch04', 'ch05'].forEach(ch => Object.entries(S[ch].frames).forEach(([id, f]) => ((f.scene && f.scene.cast) || []).forEach(c => {
    const b = { who: c.who, name: 'Somebody' };
    n++;
    assert.equal(Sp.faceHidden(b, c), before(b, c), ch + ' ' + id + ': ' + c.who + ' ' + c.pose);
  })));
  assert.ok(n > 1000, n + ' cast members');
});

test('chapter 6’s words in the grown-ups corner: foundSleet, for a she-cat and a tom; the flags before as they were', () => {
  require('../app/ui.js');
  const W = PC.ui.flagWords;
  assert.deepEqual(W.foundSleet, { 'true': 'found Sleet at the last post of the Barking Field (later chapters remember)' });
  const tom = E.blankCat({}); tom.look.sex = 'tom';
  assert.equal(E.fill(W.foundSleet.true, tom), W.foundSleet.true, 'nothing in it changes for a tom');
  assert.deepEqual([W.foundSquall.true, W.foundPuddle.true, W.foundWisp.true], ['found Squall on the tower roof (later chapters remember)', 'found Puddle under the ferry raft (later chapters remember)', 'found Wisp in the heron’s reeds (later chapters remember)']);
  assert.ok(!PC.ui.quietFlags.foundSleet, 'listed among what she did');
  // (chapter 7's ch7Flew comes after it)
  assert.deepEqual(Object.keys(W).slice(Object.keys(W).indexOf('foundWisp') + 1, Object.keys(W).indexOf('ch7Flew')), ['foundSleet'], 'chapter 6 adds one flag');
});

/* ================================================================ chapter 7 (the words: docs/build.md, "Chapter 7")
 * No engine key and no new behaviour; the one new flag, `ch7Flew`, sticky, set on the FLEW screen at the
 * Old Bridge on every path; chapter 4's `fox-flew` link reads it beside `ch4CaughtFly` (spec section 1). */
test('chapter 7’s words in the grown-ups corner: ch7Flew, for a she-cat and a tom; ch4CaughtFly’s words as they were; no new speaker, voice or face', () => {
  require('../app/ui.js');
  const W = PC.ui.flagWords;
  assert.deepEqual(W.ch7Flew, { 'true': 'saw Sprinkle try to fly at the Old Bridge: the fox’s “flew” can’t be true (later chapters remember)' });
  const tom = E.blankCat({}); tom.look.sex = 'tom';
  assert.equal(E.fill(W.ch7Flew.true, tom), W.ch7Flew.true, 'nothing in it changes for a tom');
  assert.deepEqual(W.ch4CaughtFly, { 'true': 'caught the fox’s “flew”: Sprinkle can’t fly (later chapters remember)' }, 'chapter 4’s flag means what it always meant');
  assert.ok(!PC.ui.quietFlags.ch7Flew, 'listed among what she did');
  // (chapter 8's foundHail comes after it)
  assert.deepEqual(Object.keys(W).slice(Object.keys(W).indexOf('foundSleet') + 1, Object.keys(W).indexOf('foundHail')), ['ch7Flew'], 'chapter 7 adds one flag');
  // no new speaker or face hidden: the speakers' names are chapter 6's (the golden below reads every label and voice of chapters 1 to 6;
  // chapter 8 appends its three after them)
  assert.deepEqual(Object.keys(PC.ui.speakers.NAMES).slice(0, Object.keys(PC.ui.speakers.NAMES).indexOf('hail')), ['tallyheart', 'glintstar', 'waffles', 'tallone', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'sparrow', 'moth', 'riffle', 'otter', 'dog',
    'sprinkle', 'murmurchime', 'reynard', 'squall', 'patience', 'puddle', 'wisp', 'coil', 'sloshbank', 'sleet', 'reedclan']);
  assert.equal(PC.ui.speakers.faceHidden({ who: 'coil', name: 'Coil' }, { who: 'coil', pose: 'stone' }), true, 'Coil’s “Quietly,” from the stones, as chapter 6 has it');
});

/* Chapters 1 to 6 as they shipped (spec section 7, item 2): ten whole readings recorded from the shipped
 * chapter-6 tree in a process of its own (tests/fixtures/make-ch06-golden.js), compared digest by digest
 * with today's tree; then every one of those readings' cats reading chapters 4 and 5 again with `ch7Flew`
 * and without; then the link's truth table. Today's runs are made once and shared. */
const G6 = require('./fixtures/make-ch06-golden.js');
const GOLDEN6 = require('./fixtures/ch06-golden.json');
let NOW6 = null;
function now6() {
  if (NOW6) return NOW6;
  const PC7 = require('./_load.js').load();
  require('../app/ui.js');
  const ctx = G6.context(PC7);
  NOW6 = { PC: PC7, ctx, runs: G6.SCRIPTS6.map(s => G6.run6(ctx, s)) };
  return NOW6;
}

test('chapters 1 to 6 play and render exactly as they shipped: every frame and what it shows (its scene and its drawing, its captions and what Read to me says, its balloons with their labels and voices, its options, its card and its drawing, her whole Case File with every card drawn, the pages she taps), every skip-count tap by tap, every question, picture, line and help hop by hop, the Hollow, the book, the grown-ups corner and the cat, for ten readings and a reread (tests/fixtures/ch06-golden.json)', () => {
  assert.equal(GOLDEN6.engine, '0.6.0 (chapter 6, 2026-10-18)', 'recorded with the engine chapter 6 shipped with');
  assert.equal(GOLDEN6.runs.length, G6.SCRIPTS6.length);
  const { runs } = now6();
  runs.forEach((r, i) => {
    const now = G6.compact6(r), then = GOLDEN6.runs[i].run, name = GOLDEN6.runs[i].name;
    assert.equal(r.name, name);
    assert.deepEqual(now.readings.map(x => x.chapter), then.readings.map(x => x.chapter), name + ': the same readings');
    then.readings.forEach((R, k) => {
      const N = now.readings[k], where = name + ', reading ' + (k + 1) + ' (' + R.chapter + ')';
      assert.deepEqual(N.frames, R.frames, where + ': the same frames, in the same order');
      assert.deepEqual(N.picked, R.picked, where + ': the same choices');
      const a = N.shown.split(' '), b = R.shown.split(' ');
      b.forEach((h, n) => assert.equal(a[n], h, where + ': what ' + R.frames[n] + ' shows (its scene and drawing, captions, balloons and their labels, options, its card, her Case File, its skip-count tap by tap, the page she taps); `node tests/fixtures/make-ch06-golden.js --diff DIR` writes it whole'));
      assert.deepEqual(N.lessons, R.lessons, where + ': every lesson, question by question (its pictures and their drawings, its words, its result, its whole help hop by hop)');
    });
    assert.deepEqual(now.hollow, then.hollow, name + ': the Training Hollow, its rounds and its lines');
    assert.deepEqual([now.book, now.corner, now.extra, now.cat, now.flags, now.status], [then.book, then.corner, then.extra, then.cat, then.flags, then.status],
      name + ': her book and its dragonets, the grown-ups corner, her cards and her file, the cat at the end, the flags, the status');
  });
  // the readings cover what chapters 1 to 6 can make of a cat, and none holds chapter 7's flag (no live save does)
  const flags = runs.map(r => r.end.flags);
  assert.ok(flags.every(f => !('ch7Flew' in f)));
  assert.deepEqual([...new Set(runs.map(r => r.readings[0].picked.find(p => p.startsWith('f014:'))))].sort(), ['f014:0', 'f014:1', 'f014:2', 'f014:3', 'f014:4'], 'every specialty');
  assert.deepEqual([...new Set(flags.map(f => f.worry))].sort(), ['shiny', 'small', 'talk', 'water'], 'every worry');
  for (const k of ['ch3Told', 'foundSquall', 'ch4CaughtFly', 'ch5Roof', 'foundPuddle', 'foundWisp', 'foundSleet']) {
    assert.ok(flags.some(f => f[k] === true) && flags.some(f => f[k] !== true), k + ': with it and without it');
  }
  assert.deepEqual([...new Set(flags.map(f => f.ch2Path))].sort(), ['bridge', 'river']);
  assert.deepEqual([...new Set(flags.map(f => f.ch5First))].sort(), ['heron', 'otters']);
  assert.ok(flags.some(f => !f.foundSquall && !f.ch5Roof), '“Not today” twice');
  const reread = runs.find(r => r.readings.length > 6);
  assert.deepEqual(reread.readings.map(x => x.chapter), ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch01', 'ch04', 'ch05']);
  assert.ok(reread.end.flags.ch4CaughtFly === true && reread.end.flags.specialty === 'climbing', 'caught FLEW as a noticing cat, then a climber');
  assert.ok(runs.every(r => r.readings.some(x => Object.keys(x.lessons).length)), 'every reading has its lessons');
  assert.ok(runs.some(r => r.readings.some(x => Object.values(x.lessons).some(rows => rows.some(rw => !rw.res.correct)))), 'and misses');
});

/* The page hands the engine every story it has loaded (ui.js: `stories()` is `PC.story`), not chapters 1 to
 * 6 alone. So the same ten readings again, chapters 1 to 6 read as before but every loaded story handed to
 * the engine everywhere else (the scenes, the cards, the Case File, the lessons, the Hollow, the book, the
 * status): what chapters 1 to 6 show must not move, whatever chapters come after them. Only what is about
 * the chapter after chapter 6 may: chapter 6's teaser in her book is built and leads to chapter 7 (its words
 * as they were), and the hub offers chapter 7 instead of “coming soon”. Chapters 8 to 10 leave even those
 * as they are, so any other difference here is a later chapter changing an earlier one. */
test('chapters 1 to 6 with every loaded story handed to the engine, as the page does: every reading (frame by frame, every lesson) and every Hollow round, the corner, her cards and file and the cat exactly as shipped; only chapter 6’s teaser (built, leading to chapter 7) and the hub’s next chapter move', () => {
  const { PC: PC7, ctx, runs } = now6();
  const E7 = PC7.engine, six = G6.CH.map(id => PC7.story[id]);
  const later = E7.chapters(PC7.story).filter(s => !G6.CH.includes(s.id));
  assert.equal(later[0] && later[0].id, 'ch07', 'chapter 7 is loaded after chapter 6');
  assert.deepEqual(E7.chapters(PC7.story).slice(0, 6).map(s => s.id), G6.CH, 'chapters 1 to 6 first, in order');
  // the drawings are shared with the first pass (memoized by what is drawn, which no list touches)
  const all = Object.assign({}, ctx, { read: six, list: PC7.story });
  G6.SCRIPTS6.forEach((s, i) => {
    const r = G6.run6(all, s), now = G6.compact6(r), then = GOLDEN6.runs[i].run, base = runs[i], name = GOLDEN6.runs[i].name;
    assert.equal(G6.compact6(base).book, then.book, name + ': the first pass is the golden');
    assert.deepEqual(now.readings, then.readings, name + ': every reading, frame by frame and every lesson, as shipped');
    assert.deepEqual(now.hollow, then.hollow, name + ': the Training Hollow, its rounds and its lines, as shipped');
    assert.deepEqual([now.corner, now.extra, now.cat, now.flags, now.status], [then.corner, then.extra, then.cat, then.flags, then.status],
      name + ': the grown-ups corner, her cards and her file, the cat at the end (her status too), the flags');
    // her book: every page and dragonet as shipped; chapter 6's teaser, its words as they were, now built and leading on
    const drop = (b) => Object.assign({}, b, { teaser: null });
    assert.deepEqual(drop(r.book), drop(base.book), name + ': her book but the teaser');
    assert.deepEqual([base.book.teaser.built, base.book.teaser.next], [false, null], name + ': as shipped, chapter 6 was the last');
    assert.deepEqual(r.book.teaser, Object.assign({}, base.book.teaser, { built: true, next: 'ch07' }), name + ': chapter 6’s teaser leads to chapter 7, nothing else in it moves');
    // the hub: chapter 7 up next instead of “coming soon”
    const p6 = E7.progress(r.end, six), pAll = E7.progress(r.end, PC7.story);
    assert.deepEqual([E7.upNext(r.end, six), p6.next, p6.soon && p6.soon.built], [null, null, false], name + ': with chapters 1 to 6, nothing next but the teaser');
    assert.deepEqual([E7.upNext(r.end, PC7.story).id, pAll.next.id, pAll.soon, pAll.latest.id], ['ch07', 'ch07', null, 'ch06'], name + ': with every chapter, chapter 7 is next');
  });
});

test('after chapter 7: every one of those cats, with ch7Flew, reads chapters 4 and 5 again exactly as she would without it (every frame and its drawing, every line, the card under each panel, every lesson, her book’s recaps and dragonet pages, the cat); her Case File differs only by FLEW and can’t-fly touching over “They can’t both be true.”, and only for a cat who did not catch FLEW at the border', () => {
  const { PC: PC7, ctx, runs } = now6();
  const E7 = PC7.engine, list = G6.CH.map(id => PC7.story[id]);
  const full = Object.assign({}, ctx, { full: true });
  const noDrawn = (file) => { const F = clone(file); F.groups.concat(F.links).forEach(g => g.cards.forEach(c => { if (c.link) delete c.link.drawn; })); return F; };
  let widened = 0, same = 0, frames = 0;
  runs.forEach((r, i) => {
    const s = G6.SCRIPTS6[i], name = r.name;
    const cats = [clone(r.end), clone(r.end)];
    cats[1].flags.ch7Flew = true;
    const read = cats.map(cat => {
      const out = [], clock = { t: 5e6 };
      ['ch04', 'ch05'].forEach(ch => G6.readChapter(full, cat, PC7.story[ch], s, s[ch] || {}, s.pick || {}, clock, out));
      return out;
    });
    const caught = r.end.flags.ch4CaughtFly === true;
    read[0].forEach((R, k) => {
      const N = read[1][k];
      assert.deepEqual(N.frames, R.frames, name + ': ' + R.chapter + ', the same frames');
      assert.deepEqual(N.lessons, R.lessons, name + ': ' + R.chapter + ', the same lessons');
      R.shown.forEach((a, n) => {
        const b = N.shown[n], where = name + ': ' + R.chapter + ' ' + R.frames[n];
        frames++;
        const strip = (x) => Object.assign({}, x, { file: null, fileArt: null });
        assert.deepEqual(strip(b), strip(a), where + ': all she sees but her Case File');
        assert.deepEqual([...b.fileArt].sort(), [...a.fileArt].sort(), where + ': the same cards drawn in her file');
        const holds = ['fox-flew', 'cant-fly'].every(id => a.file.groups.concat(a.file.links).some(g => g.cards.some(c => c.id === id)));
        if (caught || !holds) { assert.deepEqual(b.file, a.file, where + ': her Case File, the same'); same++; return; }
        // without the catch: the two touch across the groups, first among the links, over the line; nothing else moves
        const A0 = noDrawn(a.file), B0 = noDrawn(b.file);
        assert.deepEqual(B0.links[0].cards.map(c => c.id), ['cant-fly', 'fox-flew'], where);
        assert.equal(B0.links[0].line, 'They can’t both be true.', where);
        assert.deepEqual(B0.links.slice(1), A0.links, where + ': the other links as they were');
        assert.ok(!A0.links.some(L => L.cards.some(c => c.id === 'fox-flew' || c.id === 'cant-fly')), where + ': without the flag they lie apart');
        assert.deepEqual(B0.groups, A0.groups.map(g => Object.assign({}, g, { cards: g.cards.filter(c => c.id !== 'fox-flew' && c.id !== 'cant-fly') })), where + ': they leave their groups, and nothing else does');
        assert.deepEqual(Object.assign({}, B0, { groups: null, links: null }), Object.assign({}, A0, { groups: null, links: null }), where + ': the title and the count');
        widened++;
      });
    });
    // her book (every chapter's recap and every dragonet page) and the cat
    const books = cats.map(cat => { const b = E7.buildFullBook(cat, list); return clone({ title: b.title, pages: b.pages, dragonets: b.dragonets, teaser: b.teaser }); });
    assert.deepEqual(books[1], books[0], name + ': her book, the same');
    const fl = clone(cats[1].flags); delete fl.ch7Flew;
    assert.deepEqual(fl, cats[0].flags, name + ': the flags, but ch7Flew');
    assert.deepEqual(Object.assign({}, cats[1], { flags: null }), Object.assign({}, cats[0], { flags: null }), name + ': the cat, but her flags');
  });
  assert.ok(frames > 2000 && widened > 1000 && same > 500, frames + ' frames: ' + widened + ' with the link widened, ' + same + ' the same');
});

test('chapter 4’s FLEW link is drawn exactly when ch4CaughtFly or ch7Flew is true (a table of every combination, through E.caseFile and E.cards)', () => {
  const { PC: PC7, runs } = now6();
  const E7 = PC7.engine, list = G6.CH.map(id => PC7.story[id]);
  assert.deepEqual(PC7.story.ch04.cards['fox-flew'].link, { when: { not: { ch4CaughtFly: false, ch7Flew: false } }, line: 'They can’t both be true.' });
  const base = runs.find(r => !r.end.flags.ch4CaughtFly).end;
  const vals = [true, false, undefined];
  let n = 0;
  for (const a of vals) for (const b of vals) {
    const cat = clone(base);
    delete cat.flags.ch4CaughtFly; delete cat.flags.ch7Flew;
    if (a !== undefined) cat.flags.ch4CaughtFly = a;
    if (b !== undefined) cat.flags.ch7Flew = b;
    const want = a === true || b === true, F = E7.caseFile(cat, list), name = JSON.stringify({ ch4CaughtFly: a, ch7Flew: b });
    const flew = F.links.filter(L => L.cards.some(c => c.id === 'fox-flew'));
    assert.deepEqual(flew.map(L => [L.cards.map(c => c.id), L.line]), want ? [[['cant-fly', 'fox-flew'], 'They can’t both be true.']] : [], name);
    assert.equal(E7.fileNeighbours(F, 'cant-fly', 'fox-flew'), want || E7.fileNeighbours(Object.assign({}, F), 'cant-fly', 'fox-flew'), name);
    assert.equal(E7.matches(E7.cards(cat, list).find(c => c.id === 'fox-flew').link.when, cat), want, name);
    // without chapter 7's flag, exactly as chapter 4 shipped it
    if (b === undefined) assert.equal(E7.matches({ ch4CaughtFly: true }, cat), want, name);
    n++;
  }
  assert.equal(n, 9);
  // a cat who has not yet been given both cards has nothing to draw, flag or not
  const early = clone(base); early.cards = early.cards.filter(c => c.id !== 'cant-fly'); early.flags.ch7Flew = true;
  assert.ok(!E7.caseFile(early, list).links.some(L => L.cards.some(c => c.id === 'fox-flew')));
});

/* ================================================================ chapter 8 (the words: docs/build.md, "Chapter 8")
 * One engine change (spec section 6, approved under decision 46 and recorded in the README): a card link
 * may give a partner its own line, `link.lines: { <partner id>: line }`, over `link.line` for every other
 * partner; E.checkStory checks it as it checks `line`. No card of chapters 1 to 7 has `lines`, so their
 * files lie as they did (the golden of chapters 1 to 7 reads every one). The new flag `foundHail`, the
 * three new speakers and their voices (spec sections 1, 5 and 6). */
const CH8_CARDS = () => ({
  stash: { mark: 'eye', line: 'The weasels have a stash: our prey, and ReedClan’s.', link: { with: ['reed-pile'], line: 'Two piles robbed. One stash.' } },
  glass: { mark: 'eye', line: 'A heap of glass in the weasels’ stash, just like the ‘scale’.', link: { with: ['scale'], line: 'It’s not a scale. It’s GLASS.' } },
  'fox-brag': { mark: 'ear', line: 'Reynard calls ‘It FLEW off’ his little story. He wants the dry den.',
    link: { with: ['fox-flew', 'sleet-den'], line: 'He said FLEW. Now he calls it a story.', lines: { 'sleet-den': 'The same fine, dry den.' } } },
  'hail-shapes': { mark: 'ear', line: 'Hail says two skinny shapes cross her field every night, toward the tracks.', when: { foundHail: true } }
});
// a mock chapter 8 holding the spec's four cards (section 3), beside the real chapters 1 to 7
function mock8(cards) {
  return { id: 'ch08', number: 8, title: 'The Night Trail', start: 'a', cards: cards || CH8_CARDS(),
    frames: { a: { scene: { set: 'den', cam: 'nest' }, caption: ['Mice and voles, in tidy rows.'], card: 'stash', next: 'z' },
      z: { scene: { set: 'den', cam: 'nest' }, caption: ['The end.'], end: true } } };
}
const CH1TO7 = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07'];
function list8(cards) { const st = realStories(); return CH1TO7.map(id => st[id]).concat([mock8(cards)]); }
// a cat holding these cards in this order, each from the chapter that defines it, with these flags
function holder8(list, ids, flags) {
  const cat = E.blankCat({ now: 1, id: 'c8' });
  Object.assign(cat.flags, flags || {});
  ids.forEach((id, i) => { const ch = list.find(s => s.cards && s.cards[id]); assert.ok(ch, id); E.giveCard(cat, id, ch.id, 10 + i); });
  return cat;
}
// every card of chapters 4 to 7 a cat who found Sleet (and not Squall, Puddle or Wisp) holds, in the chapters' order, then chapter 8's three
const HELD7 = ['four-a-night', 'tidy', 'dug-earth', 'scale', 'fox-flew', 'fox-moon', 'sprinkle-scales', 'cant-fly', 'prints-pile', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes',
  'reed-pile', 'sleet-den', 'coil-diggers', 'waffles-no-moon', 'my-count', 'prints-sprinkle', 'tunnel'];
const HELD8 = HELD7.concat(['stash', 'glass', 'fox-brag']);
const rows8 = (cat, list) => E.caseFile(cat, list).links.map(L => [L.cards.map(c => c.id).join(' — '), (L.lines || [L.line]).join(' | ')]);

test('chapter 8’s engine change, the rows of spec section 3: can’t fly — FLEW — the brag — the den (each join over its own line), tidy — ReedClan’s pile — the stash, the scale — the glass; without `lines` the den’s join would read FLEW’s line', () => {
  const list = list8();
  const sleet = holder8(list, HELD8, { ch7Flew: true, foundSleet: true });
  assert.deepEqual(rows8(sleet, list), [
    ['cant-fly — fox-flew — fox-brag — sleet-den', 'They can’t both be true. | He said FLEW. Now he calls it a story. | The same fine, dry den.'],
    ['waffles-no-moon — fox-moon — heron-no-moon', 'Two say no moon. Only the fox says moon. | One of them is wrong.'],
    ['tidy — reed-pile — stash', 'Two piles. Both left tidy. | Two piles robbed. One stash.'],
    ['coil-diggers — tunnel', 'Coil felt them. Now I’ve seen where.'],
    ['scale — glass', 'It’s not a scale. It’s GLASS.']
  ]);
  const F = E.caseFile(sleet, list), brag = F.links[0];
  assert.deepEqual([brag.line, brag.lines.length, brag.cards.length], ['They can’t both be true.', 3, 4], 'a row of four: a line for each join, the first its `line`');
  assert.ok(E.fileNeighbours(F, 'fox-flew', 'fox-brag') && E.fileNeighbours(F, 'fox-brag', 'sleet-den') && !E.fileNeighbours(F, 'fox-flew', 'sleet-den') && !E.fileNeighbours(F, 'cant-fly', 'fox-brag'), 'only the cards side by side touch');
  assert.deepEqual(F.groups.map(g => [g.mark, g.cards.map(c => c.id)]),
    [['eye', ['four-a-night', 'dug-earth', 'sprinkle-scales', 'prints-pile', 'fur', 'my-count', 'prints-sprinkle']], ['ear', ['otter-fox', 'heron-shapes']]], 'every linked card leaves its group, and nothing else does');
  // without Sleet's card: the brag ends the FLEW row; without ch7Flew (a reread oddity): FLEW starts it
  const noSleet = holder8(list, HELD8.filter(id => id !== 'sleet-den'), { ch7Flew: true });
  assert.deepEqual(rows8(noSleet, list)[0], ['cant-fly — fox-flew — fox-brag', 'They can’t both be true. | He said FLEW. Now he calls it a story.']);
  const noFlew = holder8(list, HELD8, { foundSleet: true });
  assert.deepEqual(rows8(noFlew, list).filter(r => /fox-brag/.test(r[0])), [['fox-flew — fox-brag — sleet-den', 'He said FLEW. Now he calls it a story. | The same fine, dry den.']]);
  assert.ok(E.caseFile(noFlew, list).groups[0].cards.some(c => c.id === 'cant-fly'), 'can’t fly stays in its group');
  const noFlewNoSleet = holder8(list, HELD8.filter(id => id !== 'sleet-den'), {});
  assert.deepEqual(rows8(noFlewNoSleet, list).filter(r => /fox-brag/.test(r[0])), [['fox-flew — fox-brag', 'He said FLEW. Now he calls it a story.']]);
  E.caseFile(noFlewNoSleet, list).links.filter(L => L.cards.length === 2).forEach(L => assert.deepEqual(Object.keys(L), ['cards', 'line'], 'a pair is { cards, line }, as chapter 4 made it'));
  // the fallback the spec names (no `lines`): the den's join reads FLEW's words
  const plain = CH8_CARDS(); delete plain['fox-brag'].link.lines;
  const listP = list8(plain);
  assert.deepEqual(rows8(holder8(listP, HELD8, { ch7Flew: true, foundSleet: true }), listP)[0],
    ['cant-fly — fox-flew — fox-brag — sleet-den', 'They can’t both be true. | He said FLEW. Now he calls it a story. | He said FLEW. Now he calls it a story.']);
  // Hail's card touches nothing, and is shown only with foundHail (as squall-shapes and sleet-den are)
  const hail = holder8(list, HELD8.concat(['hail-shapes']), { ch7Flew: true, foundSleet: true, foundHail: true });
  assert.deepEqual(rows8(hail, list), rows8(sleet, list));
  assert.ok(E.caseFile(hail, list).groups[1].cards.some(c => c.id === 'hail-shapes'));
  assert.ok(!E.cards(holder8(list, HELD8.concat(['hail-shapes']), {}), list).some(c => c.id === 'hail-shapes'));
  // every card in a link is counted once, and none is lost
  [sleet, noSleet, noFlew, noFlewNoSleet, hail].forEach(cat => {
    const G = E.caseFile(cat, list), all = G.groups.reduce((a, g) => a.concat(g.cards), []).concat(G.links.reduce((a, l) => a.concat(l.cards), [])).map(c => c.id);
    assert.deepEqual(all.slice().sort(), E.cards(cat, list).map(c => c.id).sort());
    assert.equal(new Set(all).size, all.length);
  });
});

test('chapter 8’s engine change: the order of `with` matters, as the spec says (FLEW first, so the brag joins the FLEW row before the den joins the brag; the other order leaves two rows apart, since a row never merges with another)', () => {
  const swapped = CH8_CARDS(); swapped['fox-brag'].link.with = ['sleet-den', 'fox-flew'];
  const list = list8(swapped), cat = holder8(list, HELD8, { ch7Flew: true, foundSleet: true }), F = E.caseFile(cat, list);
  assert.deepEqual(rows8(cat, list).filter(r => /fox-flew|fox-brag/.test(r[0])), [['cant-fly — fox-flew', 'They can’t both be true.'], ['sleet-den — fox-brag', 'The same fine, dry den.']]);
  assert.ok(!E.fileNeighbours(F, 'fox-flew', 'fox-brag'), 'the brag lies apart from FLEW');
  // as the spec has it, the same cat gets the one row of four
  assert.deepEqual(rows8(cat, list8()).filter(r => /fox-brag/.test(r[0])).map(r => r[0]), ['cant-fly — fox-flew — fox-brag — sleet-den']);
});

test('chapter 8’s engine change, a truth table: with `lines` and without, one partner and two, each partner held or not, `line` given or not; a partner’s own line wins, every other partner joins over `line` (or the default), and a key `with` does not name changes nothing', () => {
  const DEF = 'They can’t both be true.';
  let n = 0;
  for (const W of [['p1'], ['p1', 'p2']]) for (const line of [undefined, 'Shared.']) {
    const linesAll = [undefined, {}, { p1: 'Own one.' }, { stray: 'Not a partner.' }];
    if (W.length === 2) linesAll.push({ p2: 'Own two.' }, { p1: 'Own one.', p2: 'Own two.' }, { p1: '', p2: 'Own two.' });
    for (const lines of linesAll) for (const held of W.length === 2 ? [[], ['p1'], ['p2'], ['p1', 'p2']] : [[], ['p1']]) {
      const link = { with: W }; if (line !== undefined) link.line = line; if (lines !== undefined) link.lines = lines;
      const cards = { p1: { mark: 'eye', line: 'One.' }, p2: { mark: 'eye', line: 'Two.' }, c: { mark: 'ear', line: 'The claim.', link } };
      const list = [mock8(cards)], cat = holder8(list, held.concat(['c']), {});
      const own = id => (lines && typeof lines[id] === 'string' && lines[id]) || line || DEF;
      const want = !held.length ? [] : held.length === 1 ? [[held[0] + ' — c', own(held[0])]] : [['p1 — c — p2', own('p1') + ' | ' + own('p2')]];
      const name = JSON.stringify({ W, line, lines, held });
      assert.deepEqual(rows8(cat, list), want, name);
      const L = E.caseFile(cat, list).links[0];
      if (L) assert.equal(L.line, own(held[0]), name + ': the row’s first line');
      // E.cards still copies the link as it stands, `lines` included, for the page
      assert.deepEqual(E.cards(cat, list).find(c => c.id === 'c').link, link, name);
      n++;
    }
  }
  assert.equal(n, 2 * 4 * 2 + 2 * 7 * 4);
  // a link that names its partners by `answers` (chapter 4's) is drawn as it was, `lines` or not
  const ans = { p1: { mark: 'eye', line: 'One.' }, c: { mark: 'ear', line: 'The claim.', answers: ['p1'], link: { line: 'Answered.', lines: { p1: 'Never read.' } } } };
  assert.deepEqual(rows8(holder8([mock8(ans)], ['p1', 'c'], {}), [mock8(ans)]), [['p1 — c', 'Answered.']]);
  // and a link whose `when` does not match draws nothing, `lines` or not
  const off = { p1: { mark: 'eye', line: 'One.' }, c: { mark: 'ear', line: 'The claim.', link: { when: { seen: true }, with: ['p1'], lines: { p1: 'Own.' } } } };
  assert.deepEqual(rows8(holder8([mock8(off)], ['p1', 'c'], {}), [mock8(off)]), []);
  assert.deepEqual(rows8(holder8([mock8(off)], ['p1', 'c'], { seen: true }), [mock8(off)]), [['p1 — c', 'Own.']]);
});

test('chapter 8’s engine change: E.checkStory checks `lines` as it checks `line` (an object; every key one of the link’s `with`, every value a line); the mock chapter and every chapter 1 to 7 story are clean, and no card of chapters 1 to 7 has `lines`', () => {
  const list = list8(), st = realStories();
  assert.deepEqual(E.checkStory(mock8(), list), [], 'the spec’s four cards');
  CH1TO7.forEach(id => {
    assert.deepEqual(E.checkStory(st[id], list), [], id);
    Object.entries(st[id].cards || {}).forEach(([cid, c]) => assert.ok(!(c.link && 'lines' in c.link), id + ' ' + cid + ': no lines'));
  });
  const bad = (lines, also) => { const cards = CH8_CARDS(); cards['fox-brag'].link.lines = lines; Object.assign(cards, also || {}); return E.checkStory(mock8(cards), list); };
  const BAD_SHAPE = 'card fox-brag: link lines is { <a card it touches>: its own line }';
  assert.deepEqual(bad('The same fine, dry den.'), [BAD_SHAPE], 'a line, not an object');
  assert.deepEqual(bad(['The same fine, dry den.']), [BAD_SHAPE], 'a list, not an object');
  assert.deepEqual(bad({ 'sleet-den': 'The same fine, dry den.', scale: 'Glass.' }), ['card fox-brag: link lines names a card its with does not: scale']);
  assert.deepEqual(bad({ 'sleet-den': '' }), ['card fox-brag: link lines for sleet-den needs its one line']);
  assert.deepEqual(bad({ 'sleet-den': '   ' }), ['card fox-brag: link lines for sleet-den needs its one line']);
  assert.deepEqual(bad({ 'sleet-den': 7 }), ['card fox-brag: link lines for sleet-den needs its one line']);
  assert.deepEqual(bad({ 'sleet-den': true, 'cant-fly': 'x' }), ['card fox-brag: link lines for sleet-den needs its one line', 'card fox-brag: link lines names a card its with does not: cant-fly']);
  assert.deepEqual(bad({}), [], 'an empty object names nobody');
  assert.deepEqual(bad(null), [], 'null is no lines');
  assert.deepEqual(bad(undefined), [], 'no lines');
  // a link drawn by its answers has no `with`, so any key of its `lines` is reported
  const ansLines = { 'my-claim': { mark: 'ear', line: 'A claim.', answers: ['scale'], link: { line: 'Answered.', lines: { scale: 'Glass.' } } } };
  assert.deepEqual(bad(undefined, ansLines), ['card my-claim: link lines names a card its with does not: scale']);
});

test('chapter 8’s words in the grown-ups corner and its speakers: foundHail, for a she-cat and a tom, and no route flag; Hail, Snip and Snatch named after chapter 7’s speakers, with their voices; every earlier voice as it was; no new face hidden', () => {
  require('../app/ui.js');
  const W = PC.ui.flagWords, Sp = PC.ui.speakers;
  assert.deepEqual(W.foundHail, { 'true': 'found Hail in the hollow log in the Barking Field (later chapters remember)' });
  const tom = E.blankCat({}); tom.look.sex = 'tom';
  assert.equal(E.fill(W.foundHail.true, tom), W.foundHail.true, 'nothing in it changes for a tom');
  assert.ok(!PC.ui.quietFlags.foundHail, 'listed among what she did');
  // (chapter 9 adds foundMizzle and ch9Roof after foundHail: its own test below)
  assert.deepEqual(Object.keys(W).slice(Object.keys(W).indexOf('ch7Flew'), Object.keys(W).indexOf('foundMizzle')), ['ch7Flew', 'foundHail'], 'chapter 8 adds one flag');
  assert.ok(!('ch8Route' in W), 'the route is not recorded (spec section 1)');
  // (chapter 9 names three more after snatch: its own test below)
  assert.deepEqual(Object.keys(Sp.NAMES).slice(0, Object.keys(Sp.NAMES).indexOf('thymeleaf')), ['tallyheart', 'glintstar', 'waffles', 'tallone', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'sparrow', 'moth', 'riffle', 'otter', 'dog',
    'sprinkle', 'murmurchime', 'reynard', 'squall', 'patience', 'puddle', 'wisp', 'coil', 'sloshbank', 'sleet', 'reedclan', 'hail', 'snip', 'snatch']);
  assert.deepEqual([Sp.NAMES.hail, Sp.NAMES.snip, Sp.NAMES.snatch], ['Hail', 'Snip', 'Snatch']);
  // the labels: the chapter's `names` until a balloon carries its own (spec section 5)
  const names = { snip: 'A weasel', snatch: 'A weasel', hail: 'The speckled dragonet' };
  const lab = (b, story) => Sp.label(b, { story, fill: t => t });
  assert.deepEqual(['snip', 'snatch', 'hail'].map(who => lab({ who }, { names })), ['A weasel', 'A weasel', 'The speckled dragonet']);
  assert.deepEqual([lab({ who: 'snip', name: 'Snip' }, { names }), lab({ who: 'snatch', name: 'Snatch' }, { names }), lab({ who: 'hail', name: 'Hail' }, { names }), lab({ who: 'hail', name: 'A white head' }, { names })],
    ['Snip', 'Snatch', 'Hail', 'A white head']);
  assert.deepEqual([lab({ who: 'dog', variant: 1, name: 'Good Boy' }, { names }), lab({ who: 'dog', variant: 2, name: 'Drop It' }, { names }), lab({ who: 'dog', variant: 3 }, { names }), lab({ who: 'dog', variant: 1, name: 'The dogs' }, { names })],
    ['Good Boy', 'Drop It', 'The tiny dog', 'The dogs'], 'the dogs by their labels until their names (the tiny one keeps his)');
  // Read to me: Hail bright and quick, Snip squeaky, Snatch a little lower, his mouth full
  assert.deepEqual(['hail', 'snip', 'snatch'].map(w => [Sp.pitch(w), Sp.rate(w)]), [[1.5, 1.08], [1.65, 1.12], [1.35, 1.0]]);
  const before = { tallyheart: [0.92, 0.95], glintstar: [0.85, 0.95], player: [1.2, 0.95], riffle: [1.5, 0.95], sprinkle: [1.38, 0.86], reynard: [0.8, 0.82], squall: [1.7, 1.02],
    patience: [0.7, 0.8], puddle: [1.32, 1.05], wisp: [1.25, 0.95], coil: [0.72, 0.7], sloshbank: [0.62, 0.88], sleet: [1.45, 1.04], reedclan: [1.0, 0.95], clancat: [1.0, 0.95], murmurchime: [1.3, 0.95] };
  Object.entries(before).forEach(([w, v]) => assert.deepEqual([Sp.pitch(w), Sp.rate(w)], v, w));
  assert.deepEqual([1, 2, 3].map(v => Sp.pitch('dog', v)), [0.55, 0.95, 1.75], 'the dogs’ voices as they were');
  // every new pose shows a face: no new faceHidden pose
  const POSES8 = { hail: ['sit', 'stand', 'bounce', 'run', 'peek', 'pawup', 'tilt'], snip: ['stand', 'up', 'run', 'skid', 'peek', 'point', 'curl'], snatch: ['stand', 'up', 'run', 'skid', 'peek', 'point', 'curl'],
    tallyheart: ['run'], player: ['run'], dog: ['lie'], reynard: ['trot'], riffle: ['scramble'] };
  Object.entries(POSES8).forEach(([who, poses]) => poses.forEach(pose => assert.equal(Sp.faceHidden({ who, name: 'Somebody' }, { who, pose }), false, who + ' ' + pose)));
  assert.equal(Sp.faceHidden({ who: 'sleet', name: 'The long grass' }, { who: 'sleet', pose: 'hidden' }), true, 'chapter 6’s as it was');
});

test('chapter 8’s Case File page: a row of four (the brag’s, for a cat who found Sleet) keeps each join’s line under its own join: the first kept left (`j0`), the last kept right (`j1`), the one between centred (`jm`); a pair and a row of three are lettered as they were', () => {
  const fs = require('node:fs'), path = require('node:path');
  const ui = fs.readFileSync(path.join(__dirname, '../app/ui.js'), 'utf8'), html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const m = /var side = function \(i\) \{ return (i === 0 \? 'j0' : i === joins\.length - 1 \? 'j1' : 'jm'); \};/.exec(ui);
  assert.ok(m, 'ui.js names each join’s side');
  const side = (joins, i) => eval(m[1]);   // the page's own expression, over a row's joins
  const classes = n => Array.from({ length: n }, (_, i) => side(Array(n), i));
  assert.deepEqual(classes(2), ['j0', 'j1'], 'a row of three: as chapter 5 lettered it (`j` + its index)');
  assert.deepEqual(classes(3), ['j0', 'jm', 'j1'], 'a row of four');
  assert.match(ui, /'<p class="cf-linkline ' \+ side\(i\) \+ '">'/);
  // the page's CSS keeps j0 left and j1 right; nothing styles jm, so it takes the line's own centring
  assert.match(html, /\.cf-linkline\{[^}]*text-align:center\}/);
  assert.doesNotMatch(html, /\.jm\b[^{]*\{[^}]*text-align/, 'nothing moves the middle line off centre');
  // and the engine hands the page the lines in order: the brag's row of four, three joins
  const list = list8(), F = E.caseFile(holder8(list, HELD8, { ch7Flew: true, foundSleet: true }), list);
  assert.deepEqual(classes(F.links[0].lines.length), ['j0', 'jm', 'j1']);
});

/* Chapter 9 (docs/chapters/09-featherlight.spec.md, sections 1 and 6, "Code beside the engine"): no engine
 * change, so only the version moves (its own test above); the page gains two flags' words in the grown-ups
 * corner and three speakers with their voices. */
test('chapter 9’s words in the grown-ups corner and its speakers: foundMizzle and ch9Roof, for a she-cat and a tom, last in the corner; Thymeleaf, Mizzle and GroveClan’s cats (by variant) named after chapter 8’s, with their voices; every earlier voice as it was; no new face hidden', () => {
  require('../app/ui.js');
  const W = PC.ui.flagWords, Sp = PC.ui.speakers;
  assert.deepEqual(W.foundMizzle, { 'true': 'found Mizzle in the old oak in GroveClan’s woods (later chapters remember)' });
  assert.deepEqual(W.ch9Roof, { 'true': 'met Squall in chapter 9: the roof, offered again ({their} book says so on chapter 9’s page)' });
  const tom = E.blankCat({}); tom.look.sex = 'tom';
  assert.equal(E.fill(W.foundMizzle.true, tom), W.foundMizzle.true, 'nothing in it changes for a tom');
  assert.equal(E.fill(W.ch9Roof.true, tom), 'met Squall in chapter 9: the roof, offered again (his book says so on chapter 9’s page)');
  assert.equal(E.fill(W.ch9Roof.true, E.blankCat({})), 'met Squall in chapter 9: the roof, offered again (her book says so on chapter 9’s page)');
  assert.ok(!PC.ui.quietFlags.foundMizzle && !PC.ui.quietFlags.ch9Roof, 'both listed among what she did');
  assert.deepEqual(Object.keys(W).slice(-2), ['foundMizzle', 'ch9Roof'], 'chapter 9 adds two flags, and they are the corner’s last');
  assert.deepEqual(Object.keys(W).slice(Object.keys(W).indexOf('foundHail') + 1), ['foundMizzle', 'ch9Roof'], 'right after chapter 8’s');
  // no choice flag (spec section 1: "No choice in this chapter sets anything")
  assert.ok(!Object.keys(W).some(k => /^ch9/.test(k) && k !== 'ch9Roof'), 'no other chapter-9 flag');
  // the speakers: three new names after chapter 8's, GroveClan's by variant (labels only: the brief, call 11)
  assert.deepEqual(Object.keys(Sp.NAMES).slice(Object.keys(Sp.NAMES).indexOf('snatch') + 1), ['thymeleaf', 'mizzle', 'groveclan']);
  assert.deepEqual([Sp.NAMES.thymeleaf, Sp.NAMES.mizzle, Sp.NAMES.groveclan], ['Thymeleaf', 'Mizzle', 'A GroveClan cat']);
  const lab = (b, story) => Sp.label(b, { story, fill: t => t });
  const names = { mizzle: 'The sleepy dragonet' };
  assert.deepEqual([lab({ who: 'thymeleaf' }, { names }), lab({ who: 'mizzle' }, { names }), lab({ who: 'mizzle', name: 'Mizzle' }, { names }), lab({ who: 'mizzle' }, {})],
    ['Thymeleaf', 'The sleepy dragonet', 'Mizzle', 'Mizzle'], 'Mizzle by the chapter’s name until her balloons carry her own');
  assert.deepEqual([1, 2, undefined].map(variant => lab({ who: 'groveclan', variant }, { names })), ['A GroveClan elder', 'A GroveClan apprentice', 'A GroveClan elder'], 'by variant; no variant reads as 1');
  assert.equal(lab({ who: 'squall', name: 'A voice' }, { names }), 'A voice', 'Squall’s shout from behind the pole');
  // Read to me: Thymeleaf low, warm and slow; Mizzle sweet and sleepy, slow; the elder old and slow
  assert.deepEqual([Sp.pitch('thymeleaf'), Sp.rate('thymeleaf')], [0.82, 0.85]);
  assert.deepEqual([Sp.pitch('mizzle'), Sp.rate('mizzle')], [1.35, 0.82]);
  assert.deepEqual([Sp.pitch('groveclan', 1), Sp.pitch('groveclan'), Sp.rate('groveclan')], [0.78, 0.78, 0.86], 'the elder by variant (no variant reads as 1)');
  assert.equal(Sp.pitch('groveclan', 2), 1, 'the apprentice keeps the default pitch: she never speaks');
  assert.ok(Sp.rate('thymeleaf') < 0.95 && Sp.rate('mizzle') < 0.95 && Sp.rate('groveclan') < 0.95, 'all three slower than the default');
  assert.ok(Sp.pitch('thymeleaf') < Sp.pitch('tallyheart') && Sp.pitch('mizzle') > Sp.pitch('player'), 'an old tom below Tallyheart; a little dragonet above the cats');
  // nobody else's voice changes
  const before = { tallyheart: [0.92, 0.95], glintstar: [0.85, 0.95], player: [1.2, 0.95], riffle: [1.5, 0.95], sprinkle: [1.38, 0.86], reynard: [0.8, 0.82], squall: [1.7, 1.02],
    patience: [0.7, 0.8], puddle: [1.32, 1.05], wisp: [1.25, 0.95], coil: [0.72, 0.7], sloshbank: [0.62, 0.88], sleet: [1.45, 1.04], reedclan: [1.0, 0.95], clancat: [1.0, 0.95], murmurchime: [1.3, 0.95],
    hail: [1.5, 1.08], snip: [1.65, 1.12], snatch: [1.35, 1.0], grizzled: [0.6, 0.95], waffles: [1.45, 0.95], snorer: [1.1, 0.95] };
  Object.entries(before).forEach(([w, v]) => assert.deepEqual([Sp.pitch(w), Sp.rate(w)], v, w));
  assert.deepEqual([1, 2, 3, 4].map(v => Sp.pitch('reedclan', v)), [1, 1.12, 1, 1], 'ReedClan’s by variant, as they were');
  assert.deepEqual([1, 2, 3].map(v => Sp.pitch('dog', v)), [0.55, 0.95, 1.75]);
  assert.equal(Sp.pitch('otter', 1), 0.68);
  // no new faceHidden pose: Squall's `hidden` is a pose name NO_FACE_POSES has had since chapter 6 (Sleet's)
  assert.equal(Sp.faceHidden({ who: 'squall', name: 'A voice' }, { who: 'squall', pose: 'hidden' }), true, 'his shout keeps its face to itself');
  assert.equal(Sp.faceHidden({ who: 'squall', name: 'Squall' }, { who: 'squall', pose: 'roar' }), false);
  const POSES9 = { thymeleaf: ['sit', 'stand', 'walk', 'crouch', 'pawup', 'lookup'], mizzle: ['curl', 'yawn', 'sit', 'wake', 'pawup'], groveclan: ['sit', 'stand', 'walk', 'pawup'],
    sprinkle: ['hop', 'flap', 'glide', 'fly', 'splash'], spider: ['spin', 'wave'] };
  Object.entries(POSES9).forEach(([who, poses]) => poses.forEach(pose => assert.equal(Sp.faceHidden({ who, name: 'Somebody' }, { who, pose }), false, who + ' ' + pose)));
  const ui = require('node:fs').readFileSync(require('node:path').join(__dirname, '../app/ui.js'), 'utf8');
  assert.match(ui, /var NO_FACE_POSES = \{ eyes: 1, hide: 1, stone: 1, hidden: 1, tail: 1 \};/, 'the list as chapter 6 left it');
});

/* The kept path's words in the grown-ups corner are no longer true after chapter 9 (its kept path tells
 * Tallyheart about Sprinkle, and Tallyheart tells Thymeleaf and Glintstar), and they are KEPT on purpose:
 * they describe the chapter 3 choice ("kept Sprinkle's secret"), and changing them would move the corner of
 * every kept cat in the goldens (chapters 1 to 8 byte-identical for every live save). Chapter 9's spec,
 * section 7, item 16. Do not "fix" this string: if it must change, that is a decision for the README, made
 * with the goldens re-recorded in the same change. */
test('FLAG_WORDS.ch3Told stays exactly as chapter 3 wrote it, on purpose (chapter 9’s spec, section 7, item 16): the words describe the chapter 3 choice, and the goldens pin them', () => {
  require('../app/ui.js');
  const W = PC.ui.flagWords;
  assert.deepEqual(W.ch3Told, {
    'true': 'told Tallyheart about Sprinkle, and Tallyheart helped hide her (later chapters remember)',
    'false': 'kept Sprinkle’s secret: only Riffle knows too (later chapters remember)'
  });
  const tom = E.blankCat({}); tom.look.sex = 'tom';
  assert.equal(E.fill(W.ch3Told.false, tom), W.ch3Told.false, 'the same for a tom');
});
