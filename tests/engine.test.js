/* Engine tests: node --test tests/ */
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
  assert.deepEqual(cat.choices.d, { index: 1, label: 'Step out slowly.' });
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
  assert.equal(cat.dream, '');
  assert.equal(cat.frame, 'z');
  assert.equal(cat.done, true);
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
  assert.equal(cat.hollow.cleanRounds, 0);
  r = round(false); assert.equal(r.glowNow, false);
  r = round(false); assert.equal(r.glowNow, false);
  assert.equal(cat.hollow.glow, false);
  r = round(false);
  assert.equal(r.glowNow, true);
  assert.equal(cat.hollow.glow, true);
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
  assert.equal(save.v, 1);
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
  assert.deepEqual(loaded.cats[0].hollow, { rounds: 0, cleanRounds: 0, glow: false });
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
  // answering it right: she remembers
  while (saved.pos < pos9) { const q = E.counts.question(saved); E.counts.answer(saved, def, q.answer, 2000, 1); }
  const r = E.counts.answer(saved, def, 9, 6000, 1);
  assert.equal(r.lineKind, 'remembered');
  assert.equal(r.line, 'Last time ' + own[0] + ' × ' + own[1] + ' made you stop and think. Not today!');
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
