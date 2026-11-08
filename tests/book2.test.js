/* Book two, the engine (docs/take-aways.md v0.3, section 7; section 10, step 6): node --test
 *
 * A `module` key on chapters (E.moduleOf: absent is 1), Read my book in volumes (E.books, E.buildFullBook's third
 * argument), the store on a module 2 chapter's page (`book.store`), the winter sleepers (E.sleepers, `book.sleeper`),
 * the badger page (E.badgerPage, `book.badger`), the keepsake that closes a volume (`book.keepsake`), and E.checkStory's
 * guards for each. Nothing a player can reach changes: no chapter 1 to 11 has a `module` or any of the four keys, so
 * every golden end cat's book is what v23's E.buildFullBook made (a verbatim copy of it below), key for key, and stays
 * so for a cat who has finished module 2 chapters. Module 2's chapters here are the take-aways kit's stand-ins
 * (tests/fixtures/takes-stub.js, `module: 2`), each given a `book` as the plan describes it.
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./_load.js');
const PC = load();
const E = PC.engine;
const stub = require('./fixtures/takes-stub.js');
const clone = (o) => JSON.parse(JSON.stringify(o));
const MODULE1 = () => E.chapters(PC.story);

/* v23's E.buildFullBook, verbatim (app/engine.js as shipped in potomac-crossing-v23), run on today's engine: the book a
 * cat had before book two. */
function buildFullBookV23(cat, stories) {
  var list = E.chapters(stories);
  var first = list[0];
  var pages = list.filter(function (s) { return E.isFinished(cat, s.id); }).map(function (s) {
    var b = E.buildBook(s, cat);
    return { id: s.id, number: s.number || 1, heading: b.chapter, recap: b.recap, dream: b.dream, dreamText: b.dreamText };
  });
  var latest = pages.length ? E.chapter(pages[pages.length - 1].id, list) : null;
  return {
    title: E.fill((first && first.book && first.book.title) || '{name}paw’s First Moon', cat),
    pages: pages,
    dragonets: E.dragonets(cat, list),
    teaser: latest ? E.teaser(latest, cat, list) : null
  };
}

/* The stand-in module 2 chapters, each with a `book`: chapter 12's title and store (133), chapter 13's groundhog (found
 * only with foundGroundhog) and its badger lines, 14 and 16's rumours and sightings, 17's crossing, 21's stone tooth. */
const BADGER = {
  13: [{ row: 'sat', say: { text: 'A badger SAT on my whole patrol!', who: 'the old tom' } },
    { row: 'size', say: { text: 'As big as a FOX!', who: 'the ferry otters' } },
    { row: 'mice', saw: { text: 'Shallow holes, turned earth, no fur or feathers: she digs for worms.' } }],
  14: [{ row: 'size', say: { text: 'As big as a DOG.', who: 'ReedClan' } }],
  16: [{ row: 'mice', say: { text: 'It ate EIGHT HUNDRED ELEVEN mice!', who: 'Snip and Snatch' } }],
  17: [{ row: 'size', saw: { text: 'As big as three cats. And grumpy.' } }]
};
function two() {
  const s = stub();
  s.list.forEach((c) => {
    c.book = { recap: [{ text: 'Chapter ' + c.number + ' for {name}{ending}.' }, { when: { foundGroundhog: true }, text: 'A groundhog said hello.' }] };
    if (c.number <= 17) c.book.store = { 12: 133, 13: 158, 14: 245, 15: 344, 16: 356, 17: 319 }[c.number];
    if (BADGER[c.number]) c.book.badger = clone(BADGER[c.number]);
  });
  s.ch12.book.title = '{name}{ending}’s First Frost-Time';
  s.ch12.book.dream = '{name}{ending}’s dream: “{dream}”';
  s.ch13.book.sleeper = { id: 'groundhog', name: 'the groundhog', when: { foundGroundhog: true }, lines: ['Round, brown and grumpy: “I was ASLEEP.”'] };
  s.ch14.book.sleeper = { id: 'salamander', name: 'the spotted salamander', lines: 'Black with yellow spots.', pose: 'curl' };
  s.ch21.book.keepsake = { id: 'stone-tooth', name: 'The stone tooth', lines: ['Harrumph dug it up for {name}{ending}.'] };
  return s;
}
function catOf(over) {
  return Object.assign({ name: 'Fern', petname: 'Biscuit', look: { sex: 'she', fur: 'calico', marking: 'white-paws', eyes: 'odd' }, flags: {}, finished: {}, dreams: {} }, over || {});
}
const finishUpTo = (cat, list, n) => { list.forEach((s) => { if ((s.number || 1) <= n) cat.finished[s.id] = true; }); return cat; };

/* ------------------------------------------------------------------ the goldens: the first volume is v23's book */

let GOLD = null;
function goldenCats() {
  if (GOLD) return GOLD;
  require('../app/ui.js');
  const G7 = require('./fixtures/make-ch07-golden.js');
  const ctx = G7.context7(PC);
  GOLD = G7.SCRIPTS7.map((s) => clone(G7.run7(ctx, s).end));
  return GOLD;
}

test('every golden end cat\'s book (the chapter-7 golden\'s twelve readings, each also with chapters 8 to 11 finished and a warrior name) is v23\'s, key for key: no new key, with or without module 2\'s chapters loaded beside them', () => {
  const cats = goldenCats();
  assert.equal(cats.length, 12);
  const all = MODULE1().concat(two().list);
  let n = 0;
  cats.forEach((c0) => {
    const more = clone(c0);
    ['ch08', 'ch09', 'ch10', 'ch11'].forEach((id) => { more.finished[id] = true; });
    more.ending = 'butterscotch';
    [c0, more].forEach((cat) => {
      const was = buildFullBookV23(cat, PC.story);
      assert.deepEqual(E.buildFullBook(cat, PC.story), was);
      assert.deepEqual(Object.keys(E.buildFullBook(cat, PC.story)), ['title', 'pages', 'dragonets', 'teaser']);
      assert.deepEqual(E.buildFullBook(cat, PC.story, 1), was, 'the volume named: the same');
      // module 2's chapters built but none finished: the same book (chapter 11's teaser now says Next, as v23's did for any built chapter)
      assert.deepEqual(E.buildFullBook(cat, all), buildFullBookV23(cat, all));
      assert.deepEqual(E.books(cat, all).map((v) => v.module), [1]);
      n++;
    });
  });
  assert.equal(n, 24);
});

test('E.moduleOf: a chapter\'s `module`, else 1; every chapter 1 to 11 and the Warrior Counts\' story is module 1; the stand-ins are module 2', () => {
  MODULE1().forEach((s) => { assert.equal(E.moduleOf(s), 1, s.id); assert.equal(s.module, undefined, s.id + ' has no module key'); });
  two().list.forEach((s) => assert.equal(E.moduleOf(s), 2, s.id));
  assert.equal(E.moduleOf(null), 1);
  assert.equal(E.moduleOf({ module: '2' }), 1, 'a string is not a module');
  assert.equal(E.moduleOf({ module: 1.5 }), 1);
});

test('nothing else reads `module`: E.chapters, E.upNext, E.progress and the hub go on by number, the same with every module key taken away', () => {
  const s = two(), all = MODULE1().concat(s.list);
  const bare = all.map((c) => { const x = Object.assign({}, c); delete x.module; return x; });
  [10, 11, 12, 13].forEach((n) => {
    const cat = finishUpTo(catOf({ ending: 'heart' }), all, n);
    assert.deepEqual(E.chapters(all).map((c) => c.id), E.chapters(bare).map((c) => c.id));
    const up = E.upNext(cat, all), up0 = E.upNext(cat, bare);
    assert.equal(up && up.id, up0 && up0.id, 'up next after ' + n);
    const p = E.progress(cat, all), p0 = E.progress(cat, bare);
    assert.deepEqual([p.latest && p.latest.id, p.next && p.next.id, p.finished.map((c) => c.id)], [p0.latest && p0.latest.id, p0.next && p0.next.id, p0.finished.map((c) => c.id)]);
  });
});

/* ------------------------------------------------------------------ the volumes */

test('E.books: one volume until a module 2 chapter is finished, then two, each titled by its first chapter\'s book.title; a reread of chapter 1 keeps "{name}paw’s First Moon"', () => {
  const s = two(), all = MODULE1().concat(s.list);
  const cat = finishUpTo(catOf(), all, 11);
  assert.deepEqual(E.books(catOf(), all), [], 'no chapter finished: no volume');
  assert.deepEqual(E.books(cat, all), [{ module: 1, title: 'Fernpaw’s First Moon' }]);
  cat.ending = 'heart';
  assert.deepEqual(E.books(cat, all), [{ module: 1, title: 'Fernpaw’s First Moon' }], 'a warrior name changes nothing in the first volume');
  cat.finished.ch12 = true;
  assert.deepEqual(E.books(cat, all), [{ module: 1, title: 'Fernpaw’s First Moon' }, { module: 2, title: 'Fernheart’s First Frost-Time' }]);
  // chapter 1 read again: her first volume keeps its title and its pages' {name}paw
  const b1 = E.buildFullBook(cat, all);
  assert.equal(b1.title, 'Fernpaw’s First Moon');
  assert.ok(b1.pages[0].recap.join(' ').includes('Fernpaw'));
  assert.ok(!b1.pages.some((p) => p.store != null), 'no store on a module 1 page');
  // a cat not yet named sees {name}{ending} as {name}paw, as everywhere
  assert.equal(E.books(finishUpTo(catOf(), all, 12), all)[1].title, 'Fernpaw’s First Frost-Time');
  // a module 2 chapter with no book.title of its own first: the module's own title
  const notitle = all.map((c) => (c.id === 'ch12' ? Object.assign({}, c, { book: Object.assign({}, c.book, { title: undefined }) }) : c));
  assert.equal(E.books(cat, notitle)[1].title, 'Fernheart’s First Frost-Time');
});

test('the first volume for a cat with module 2 finished: v23\'s keys, module 1\'s pages and dragonets only, and no teaser for a chapter she has read (chapter 11\'s, once chapter 12 is finished)', () => {
  const s = two(), all = MODULE1().concat(s.list);
  const cat = finishUpTo(catOf({ ending: 'heart' }), all, 11);
  const before = E.buildFullBook(cat, all);
  assert.equal(before.teaser.next, 'ch12', 'chapter 12 built, not finished: chapter 11\'s teaser points at it');
  cat.finished.ch12 = true;
  cat.finished.ch13 = true;
  const b = E.buildFullBook(cat, all);
  assert.deepEqual(Object.keys(b), ['title', 'pages', 'dragonets', 'teaser']);
  assert.deepEqual(b.pages, before.pages, 'the same eleven pages');
  assert.deepEqual(b.dragonets, before.dragonets);
  assert.equal(b.teaser, null, 'never a promise of what she has read');
  assert.deepEqual(E.buildFullBook(cat, all, 1), b);
});

test('the second volume: its title, a page per finished module 2 chapter with the store as that chapter left it (133 after chapter 12), its own teaser, and its new keys', () => {
  const s = two(), all = MODULE1().concat(s.list);
  const cat = finishUpTo(catOf({ ending: 'heart', dreams: { ch12: 'i saw a fox in the snow' } }), all, 12);
  const b = E.buildFullBook(cat, all, 2);
  assert.deepEqual(Object.keys(b), ['title', 'pages', 'dragonets', 'teaser', 'sleepers', 'badger', 'keepsake']);
  assert.equal(b.title, 'Fernheart’s First Frost-Time');
  assert.deepEqual(b.pages.map((p) => [p.id, p.number, p.store]), [['ch12', 12, 133]]);
  assert.deepEqual(b.pages[0].recap, ['Chapter 12 for Fernheart.']);
  assert.equal(b.pages[0].dream, 'Fernheart’s dream: “I saw a fox in the snow.”');
  assert.equal(b.pages[0].heading, 'Chapter 12: Stand-in 12');
  assert.deepEqual(b.teaser, { title: 'Chapter 13: Stand-in 13', lines: [], built: true, next: 'ch13' });
  assert.equal(b.dragonets, null);
  assert.equal(b.sleepers, null);
  assert.equal(b.badger, null);
  assert.equal(b.keepsake, null);
  // a page whose chapter has no store has no `store`; a store of 0 is drawn (an empty store is a count too)
  const zero = all.map((c) => (c.id === 'ch12' ? Object.assign({}, c, { book: Object.assign({}, c.book, { store: 0 }) }) : c));
  assert.equal(E.buildFullBook(cat, zero, 2).pages[0].store, 0);
  const none = all.map((c) => (c.id === 'ch12' ? Object.assign({}, c, { book: { recap: [] } }) : c));
  assert.ok(!('store' in E.buildFullBook(cat, none, 2).pages[0]));
  // the whole of module 2: chapter 21 last, no teaser after it, the keepsake closing the volume
  finishUpTo(cat, all, 21);
  const end = E.buildFullBook(cat, all, 2);
  assert.equal(end.pages.length, 10);
  assert.equal(end.teaser, null);
  assert.deepEqual(end.keepsake, { id: 'stone-tooth', name: 'The stone tooth', lines: ['Harrumph dug it up for Fernheart.'], chapter: 'ch21' });
});

test('the sleepers, as the dragonets: a finished chapter\'s found sleeper is a page (its `when` met), the rest silhouettes (E.SLEEPERS 7); null until one is found; never before its chapter is finished', () => {
  const s = two(), all = MODULE1().concat(s.list);
  assert.equal(E.SLEEPERS, 7);
  const cat = finishUpTo(catOf({ ending: 'heart' }), all, 13);
  assert.equal(E.sleepers(cat, all), null, 'chapter 13 finished without finding the groundhog');
  assert.equal(E.buildFullBook(cat, all, 2).sleepers, null);
  cat.flags.foundGroundhog = true;
  const sp = E.buildFullBook(cat, all, 2).sleepers;
  assert.deepEqual(sp, { found: [{ id: 'groundhog', name: 'the groundhog', lines: ['Round, brown and grumpy: “I was ASLEEP.”'], chapter: 'ch13' }], toFind: 6 });
  // found while reading chapter 14, but chapter 14 not finished: no page yet (a dragonet's `when` would show it)
  const mid = finishUpTo(catOf({ ending: 'heart', flags: { foundGroundhog: true } }), all, 12);
  assert.equal(E.sleepers(mid, all), null, 'chapter 13 not finished');
  cat.finished.ch14 = true;
  const sp2 = E.sleepers(cat, all);
  assert.deepEqual(sp2.found.map((d) => [d.id, d.lines, d.pose]), [['groundhog', ['Round, brown and grumpy: “I was ASLEEP.”'], undefined], ['salamander', ['Black with yellow spots.'], 'curl']]);
  assert.equal(sp2.toFind, 5);
  // the first volume never has them
  assert.ok(!('sleepers' in E.buildFullBook(cat, all)));
});

test('the badger page fills and crosses as chapters finish: a row once one of its lines is from a finished chapter, in the order first seen, one row per answer, its rumours crossed once a sighting shows', () => {
  const s = two(), all = MODULE1().concat(s.list);
  const cat = finishUpTo(catOf({ ending: 'heart' }), all, 12);
  assert.equal(E.badgerPage(cat, all), null, 'nothing before chapter 13');
  cat.finished.ch13 = true;
  let bg = E.buildFullBook(cat, all, 2).badger;
  assert.deepEqual(bg.rows.map((r) => [r.row, r.say.length, r.saw.length, r.crossed]), [['sat', 1, 0, false], ['size', 1, 0, false], ['mice', 0, 1, true]]);
  assert.deepEqual(bg.rows[0].say[0], { text: 'A badger SAT on my whole patrol!', who: 'the old tom', chapter: 'ch13' });
  cat.finished.ch14 = true;
  bg = E.badgerPage(cat, all);
  assert.deepEqual(bg.rows[1].say.map((l) => l.who), ['the ferry otters', 'ReedClan'], 'the "as big as" rumours share their row');
  cat.finished.ch15 = true;
  cat.finished.ch16 = true;
  bg = E.badgerPage(cat, all);
  assert.deepEqual(bg.rows.map((r) => r.row), ['sat', 'size', 'mice'], 'rows keep the order first seen');
  assert.deepEqual(bg.rows[2].say.map((l) => l.text), ['It ate EIGHT HUNDRED ELEVEN mice!']);
  assert.equal(bg.rows[2].crossed, true, 'a rumour arriving after its answer is crossed at once');
  assert.equal(bg.rows[1].crossed, false);
  cat.finished.ch17 = true;
  bg = E.badgerPage(cat, all);
  assert.equal(bg.rows[1].crossed, true, 'chapter 17\'s sighting crosses all three');
  assert.deepEqual(bg.rows[1].saw, [{ text: 'As big as three cats. And grumpy.', chapter: 'ch17' }]);
  // lines of an unfinished chapter never show, even with a later one finished
  delete cat.finished.ch14;
  assert.deepEqual(E.badgerPage(cat, all).rows[1].say.map((l) => l.who), ['the ferry otters']);
});

/* ------------------------------------------------------------------ E.checkStory's guards */

test('E.checkStory: chapters 1 to 11 and the stand-ins produce no new error; each book two guard fires on its own fault and says what the key is', () => {
  const s = two(), all = MODULE1().concat(s.list);
  all.forEach((c) => assert.deepEqual(E.checkStory(c, all), [], c.id));
  MODULE1().forEach((c) => assert.deepEqual(E.checkStory(c, PC.story), [], c.id));
  const errsOf = (patch, id = 'ch13') => {
    const list = all.map((c) => (c.id === id ? patch(clone(c)) || c : c));
    const me = list.find((c) => c.id === id);
    // (a stub's frames survive the clone: plain data)
    return E.checkStory(me, list);
  };
  const has = (errs, re) => assert.ok(errs.some((e) => re.test(e)), JSON.stringify(errs));
  // module
  has(errsOf((c) => { c.module = 3; return c; }), /^module is 1 or 2/);
  has(errsOf((c) => { c.module = '2'; return c; }), /^module is 1 or 2/);
  has(errsOf((c) => { c.number = 9; return c; }), /module 2’s chapters come after module 1’s: chapter 10/);
  has(errsOf((c) => { c.module = 1; c.number = 25; delete c.book; return c; }), /module 2’s chapters come after module 1’s: chapter 12 \(ch12\) is module 2/);
  // the four keys belong to module 2
  ['store', 'sleeper', 'badger', 'keepsake'].forEach((k) => {
    const one = { id: 'x', number: 11, start: 'f001', frames: { f001: { board: 'X.', end: true } } };
    one.book = { [k]: { store: 5, sleeper: { id: 'z', name: 'Z', lines: ['z'] }, badger: [], keepsake: { id: 'k', name: 'K', lines: ['k'] } }[k] };
    has(E.checkStory(one, [one]), new RegExp('^book\\.' + k + ' is book two’s: the chapter needs module: 2'));
    assert.deepEqual(E.checkStory(Object.assign({}, one, { module: 2 }), [one]), [], 'the same on a module 2 chapter: no error');
  });
  // book.store
  [-1, 1000, 13.5, '133', null].forEach((v) => {
    const errs = errsOf((c) => { c.book.store = v; return c; });
    if (v === null) assert.deepEqual(errs, [], 'null is absent');
    else has(errs, /^book\.store is the store’s count, a whole number 0 to 999/);
  });
  assert.deepEqual(errsOf((c) => { c.book.store = 0; return c; }), []);
  assert.deepEqual(errsOf((c) => { c.book.store = 999; return c; }), []);
  // book.sleeper
  has(errsOf((c) => { c.book.sleeper = { id: 'groundhog', name: 'the groundhog' }; return c; }), /^book\.sleeper is \{ id, name, lines, when\?, pose\? \}/);
  has(errsOf((c) => { c.book.sleeper = [c.book.sleeper]; return c; }), /^book\.sleeper is \{ id, name, lines/);
  has(errsOf((c) => { c.book.sleeper.line = 'x'; return c; }), /^book\.sleeper groundhog takes id, name, lines, when, pose: not line/);
  has(errsOf((c) => { c.book.sleeper.pose = ''; return c; }), /^book\.sleeper groundhog: pose is one of its poses/);
  has(errsOf((c) => { c.book.sleeper.when = 'found'; return c; }), /^book\.sleeper groundhog: when must be an object/);
  has(errsOf((c) => { c.book.sleeper.id = 'salamander'; return c; }), /^book\.sleeper salamander: chapter 14 has this sleeper too/);
  const eight = all.map((c) => (c.number >= 13 && c.number <= 20 ? Object.assign({}, c, { book: Object.assign({}, c.book, { sleeper: { id: 's' + c.number, name: 'S', lines: ['s'] } }) }) : c));
  has(E.checkStory(eight.find((c) => c.id === 'ch20'), eight), /^book\.sleeper s20: more than 7 sleepers across the chapters \(E\.SLEEPERS\)/);
  assert.deepEqual(E.checkStory(eight.find((c) => c.id === 'ch13'), eight.filter((c) => c.id !== 'ch20')), [], 'seven: none over');
  // book.badger
  has(errsOf((c) => { c.book.badger = { row: 'sat' }; return c; }), /^book\.badger is a list of/);
  has(errsOf((c) => { c.book.badger[0].row = ''; return c; }), /^book\.badger 0: row is a string/);
  has(errsOf((c) => { c.book.badger[0].saw = { text: 'x' }; return c; }), /^book\.badger 0: exactly one of say or saw/);
  has(errsOf((c) => { delete c.book.badger[0].say; return c; }), /^book\.badger 0: exactly one of say or saw/);
  has(errsOf((c) => { c.book.badger[1].say = { text: 'As big as a FOX!' }; return c; }), /^book\.badger 1: say is \{ text, who \}/);
  has(errsOf((c) => { c.book.badger[2].saw = { text: '' }; return c; }), /^book\.badger 2: saw is \{ text \}/);
  has(errsOf((c) => { c.book.badger[2].saw.who = 'her'; return c; }), /^book\.badger 2 saw takes text: not who/);
  has(errsOf((c) => { c.book.badger[0].crossed = true; return c; }), /^book\.badger 0 takes row, say, saw: not crossed/);
  has(errsOf((c) => { c.book.badger[0] = 'sat'; return c; }), /^book\.badger 0: is \{ row, say/);
  // book.keepsake
  has(errsOf((c) => { c.book.keepsake = { id: 'stone-tooth', name: 'The stone tooth' }; return c; }, 'ch21'), /^book\.keepsake is \{ id, name, lines \}/);
  has(errsOf((c) => { c.book.keepsake.picture = 'tooth'; return c; }, 'ch21'), /^book\.keepsake stone-tooth takes id, name, lines: not picture/);
});
