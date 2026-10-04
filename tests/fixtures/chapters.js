/* Small fixture chapters for tests/engine.test.js: every chapter-2 feature of the frame contract
 * (docs/build.md, "Chapter 2 (v0.3)") in a few frames each, so the engine is tested without the
 * real chapter 2. A fresh copy on every call:
 *
 *   const chapters = require('./fixtures/chapters.js');   const { ch01, ch02 } = chapters();
 *
 * ch01: chapter 1's interactions in miniature (look, pet name, a choice, Clan name, the 1s, a
 *       dream, the end), with a teaser for chapter 2.
 * ch02: `when` on captions, balloons and options (flags, lessonClean, firstTry, not), an adaptive
 *       warm-up (warmHard), a skip-count, the 2s with facts as objects (prompt, right,
 *       rightPicture), a pile lesson that fills from the 2s (fillFrom), the claw marks from the
 *       cat (marks/glow 'auto'), a gift, a path choice, a dream, the end, and a teaser for chapter 3
 *       (not built).
 * Not a test file (node --test only runs *.test.js).
 */
'use strict';

function chapters() {
  const ch01 = {
    id: 'ch01', number: 1, title: 'Through the Glass', start: 'f001',
    frames: {
      f001: { scene: { set: 'room', cam: 'wide', cast: [{ who: 'player', pose: 'sit', at: 'cushion' }], fx: ['sunset'] }, caption: ['Hello, {petname}.'], next: 'f002' },
      f002: { look: { next: 'f003' } },
      f003: { input: { kind: 'petname', suggestions: ['Muffin', 'Biscuit'], next: 'f004' } },
      f004: { choice: { options: [
        { label: 'Noticing', sets: { specialty: 'noticing' }, next: 'f005' },
        { label: 'Swimming', sets: { specialty: 'swimming' }, next: 'f005' },
        { label: 'Worried about water', sets: { worry: 'water' }, next: 'f005' }
      ] } },
      f005: { input: { kind: 'clanname', suggestions: ['Moon', 'Fern'], next: 'f006' } },
      f006: { counts: { set: 'ch01-tails', next: 'f007' } },
      f007: { scene: { set: 'hollow', cam: 'tree', opts: { marks: 'auto', glow: 'auto' }, cast: [] }, next: 'f008' },
      f008: { input: { kind: 'dream', next: 'f009' } },
      f009: { caption: ['End of Chapter One.'], end: true }
    },
    counts: {
      'ch01-tails': {
        table: 1, thing: 'tail', things: 'tails', teacher: 'tallyheart',
        facts: [[3, 1], [1, 5], [6, 1], [1, 1], [9, 1]],
        praise: ['Ha! Easy, yes?', 'Good.'], fast: ['You didn’t even have to count that time.'],
        miss: 'There. We’ll come back to that one.', done: 'Tails are easy.'
      }
    },
    book: {
      title: '{name}paw’s First Moon',
      dream: '{name}paw’s dream: “{dream}”',
      noDream: '{name}paw slept too soundly to dream.',
      recap: [
        { text: '{name}paw stepped through the glass.' },
        { when: { specialty: 'noticing' }, text: '{They} noticed everything.' }
      ]
    },
    teaser: { title: 'Chapter 2: After the Storm', lines: ['Tomorrow, {name}paw: ears.'] }
  };

  const ch02 = {
    id: 'ch02', number: 2, title: 'After the Storm', start: 'a01',
    frames: {
      a01: {
        scene: { set: 'crossing', cam: 'raft', cast: [
          { who: 'otter', variant: 1, pose: 'sit', at: 'raft-1' },
          { who: 'otter', variant: 2, pose: 'float', at: 'raft-2' }
        ] },
        caption: ['Morning.', { when: { specialty: 'noticing' }, text: 'The earth behind the pile is dug up.' }, { when: { worry: 'water' }, text: 'Tallyheart steps between you and the water.' }],
        say: [
          { who: 'otter', text: 'WHAT? SPEAK UP!' },
          { who: 'otter', text: 'Psst, it’s deep.', when: { worry: 'water' } },
          { who: 'otter', text: 'Hello, cat!' }
        ],
        next: 'a02'
      },
      a02: { counts: { set: 'ch02-tails', next: 'a03' } },
      a03: {
        say: [{ who: 'tallyheart', text: 'Tap each cat, and say it with me.' }],
        skip: { table: 2, groups: 5, who: [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 4 }, { who: 'grizzled' }], next: 'a04', done: 'TEN! Flat ears still count.' }
      },
      a04: { counts: { set: 'ch02-ears', next: 'a05' } },
      a05: {
        scene: { set: 'hollow', cam: 'tree', opts: { marks: 'auto', glow: 'auto' }, cast: [] },
        say: [
          { who: 'tallyheart', text: 'Your first mark is a little deeper.', when: { lessonClean: 'ch02-tails' } },
          { who: 'tallyheart', text: 'Your first mark is still there.', when: { not: { lessonClean: 'ch02-tails' } } }
        ],
        next: 'a06'
      },
      a06: { counts: { set: 'ch02-pile', next: 'a07' } },
      a07: {
        say: [
          { who: 'grizzled', text: 'Lucky guess.', when: { firstTry: '10x2' } },
          { who: 'grizzled', text: 'Hmph.', when: { not: { firstTry: '10x2' } } }
        ],
        next: 'a08'
      },
      a08: { choice: { options: [
        { label: 'Say it out loud.', sets: { ch2SaidAloud: true }, next: 'a09' },
        { label: 'Whisper it.', sets: { ch2SaidAloud: false }, next: 'a09' },
        { label: 'Splash it out (swimmers only).', when: { specialty: 'swimming' }, sets: { ch2SaidAloud: true }, next: 'a09' }
      ] } },
      a09: { caption: ['He sets it in your paws.'], gift: 'riffle-stone', next: 'a10' },
      a10: { choice: { options: [
        { label: 'Peek under the Old Bridge.', sets: { ch2Path: 'bridge' }, next: 'b01' },
        { label: 'Go down to the river.', sets: { ch2Path: 'river' }, next: 'r01' }
      ] } },
      b01: { caption: ['Two big eyes blink.'], next: 'a11' },
      r01: { caption: ['RAWWWRRR… hic!'], next: 'a11' },
      a11: { input: { kind: 'dream', next: 'a12' } },
      a12: { caption: ['End of Chapter Two.'], end: true }
    },
    counts: {
      'ch02-tails': {
        table: 1, thing: 'tail', things: 'tails', teacher: 'tallyheart',
        facts: [[1, 4], [7, 1]],
        warmHard: { table: 1, at: 1, alt: [1, 3] },
        remembered: 'Last time, that one made you stop and think. Not today!',
        done: 'Still got your tails. Good.'
      },
      'ch02-ears': {
        table: 2, thing: 'ear', things: 'ears', unit: 'cat', units: 'cats', teacher: 'tallyheart',
        facts: [[3, 2], [2, 5], { a: 2, b: 6, prompt: 'Six cats. Past ten now: the first five make ten. Keep hopping!' },
          { a: 5, b: 2, right: [{ who: 'tallyheart', text: 'Five pairs of ears. Same ten!' }], rightPicture: { groups: 2, per: 5 } },
          [2, 8], [9, 2]],
        praise: ['You hopped it!', 'Two by two.'], fast: ['Quick as a pounce!'],
        helpIntro: 'Close. Let’s scratch it out together: two lines for every cat, like ears.',
        miss: 'There. We’ll come back to that one.', done: 'That’s the twos.'
      },
      'ch02-pile': {
        table: 2, thing: 'piece', things: 'pieces', unit: 'pair', units: 'pairs', teacher: 'tallyheart',
        picture: { kind: 'prey' }, fillFrom: 'ch02-ears',
        facts: [
          { a: 10, b: 2, picture: { kind: 'prey', thought: true }, prompt: [{ who: 'grizzled', text: 'Ten pairs. I bet a pillow cat can’t count that.' }], right: [{ who: 'player', text: 'Twenty.' }] },
          { a: 8, b: 2 },
          { a: 2, b: 8, groups: 2, per: 8, picture: { kind: 'prey', layout: 'rows' } }
        ],
        praise: ['Yes.'], done: ''
      }
    },
    book: {
      recap: [
        { text: '{name}paw counted the prey pile.' },
        { when: { ch2Path: 'bridge' }, text: '{They} peeked under the Old Bridge.' },
        { when: { ch2Path: 'river' }, text: '{They} heard a tower roar.' }
      ]
    },
    teaser: { title: 'Chapter 3: Under the Old Bridge', lines: ['Something sniffles in the dark.'] }
  };

  return { ch01, ch02 };
}

module.exports = chapters;
