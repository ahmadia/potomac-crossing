/* Small fixture chapters for tests/engine.test.js: every chapter-2 feature of the frame contract
 * (docs/build.md, "Chapter 2 (v0.3)") in a few frames each, so the engine is tested without the
 * real chapter 2. A fresh copy on every call:
 *
 *   const chapters = require('./fixtures/chapters.js');   const { ch01, ch02, ch03 } = chapters();
 *
 * ch01: chapter 1's interactions in miniature (look, pet name, a choice, Clan name, the 1s, a
 *       dream, the end), with a teaser for chapter 2.
 * ch02: `when` on captions, balloons and options (flags, lessonClean, firstTry, not), an adaptive
 *       warm-up (warmHard), a skip-count, the 2s with facts as objects (prompt, right,
 *       rightPicture), a pile lesson that fills from the 2s (fillFrom), the claw marks from the
 *       cat (marks/glow 'auto'), a gift, a path choice, a dream, the end, and a teaser for chapter 3
 *       (not built).
 * ch03: chapter 3's contract (docs/build.md, "Chapter 3 (v0.4)"), below.
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

  const ch03 = chapter3();
  return { ch01, ch02, ch03 };
}

/* ch03: chapter 3's engine contract (docs/chapters/03-under-the-old-bridge.md, "Build"; docs/build.md,
 * "Chapter 3 (v0.4)") in a few frames: the tortie's labels and the {Murmur} token, a light choice,
 * the adaptive ears warm-up (an ordered alt list, `avoid`, help in the earth, borrowing yesterday's
 * ears), the pile (9 × 2 in a thought cloud, 7 × 2 a check), the Warrior Counts' digits, the
 * skip-count on the 5s that keeps its totals, the claws lesson with its five-or-zero help, Sprinkle's
 * two sets in her own voice (help in the mud, the player hopping, borrowing the easiest claws),
 * a frame shown only on the river path, the tell-or-keep choice, the bedtime hop on her own
 * forepaws, the dream, the end, the book's dragonet page and a teaser. Every set's lines are the
 * text's. It borrows from `ch02-ears`: pass chapter 2 (the real one, or the fixture) beside it. */
function chapter3() {
  const RIM = [{ who: 'clancat', variant: 1 }, { who: 'mutterer' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 4 }, { who: 'grizzled' }];
  const den = (fx) => ({ set: 'den', cam: 'inside', opts: { weather: 'clear', moon: false, stone: 'auto' },
    cast: [{ who: 'player', pose: 'lie', mood: 'sleepy', at: 'nest' }, { who: 'snorer', pose: 'curl', mood: 'sleepy', at: 'sleeper-1', moss: true }], fx: [fx] });
  const bridge = (cam, cast, opts) => ({ set: 'bridge', cam, opts: opts || {}, cast: cast || [], fx: ['day'] });
  const EARS_PRAISE = ['You hopped it!', 'Two by two, like a real hunter.', 'Yes! Two ears for every cat.', 'Two ears, every time.', 'Ears are trickier than tails, and you’re doing it anyway.'];
  return {
    id: 'ch03', number: 3, title: 'Under the Old Bridge', start: 'd01',
    names: { mutterer: '{Murmur}paw' },
    frames: {
      d01: {
        scene: Object.assign(den('night'), { cast: [{ who: 'player', pose: 'lie', mood: 'sleepy', at: 'nest' }, { who: 'mutterer', pose: 'sit', mood: 'worried', at: 'sleeper-2', squeeze: true }] }),
        caption: ['A whisper wakes you.', { when: { ch2Path: 'bridge' }, text: 'For a heartbeat, you think of the sniffle under the bridge.' },
          { when: { ch2Path: 'river' }, text: 'For a heartbeat, you think of the roar with a hiccup.' }],
        say: [{ who: 'snorer', text: '{Murmur}paw. You’ve been {murmur}ing ALL night.' }, { who: 'mutterer', text: 'It’s my Warrior Counts today.' }],
        next: 'd02'
      },
      d02: { choice: { options: [
        { label: '“You count in your sleep!”', sets: {}, next: 'd03a' },
        { label: '“I’ll purr the loudest when you pass.”', sets: {}, next: 'd03b' }
      ] } },
      d03a: { say: [{ who: 'mutterer', text: 'I DO?' }], next: 'd04' },
      d03b: { say: [{ who: 'mutterer', text: 'When I pass.', kind: 'whisper' }], next: 'd04' },
      d04: { scene: { set: 'den', cam: 'doorway', opts: { weather: 'clear' }, cast: [{ who: 'tallyheart', pose: 'sit', mood: 'happy', at: 'doorway' }], fx: ['morning'] },
        say: [{ who: 'tallyheart', text: 'Morning, {name}paw! Ears first, to wake up your whiskers.' }], counts: { set: 'ch03-ears', next: 'd05' } },
      d05: { say: [{ who: 'tallyheart', text: 'Now, count the prey pile.' }], counts: { set: 'ch03-pile', next: 'd06' } },
      d06: {
        say: [{ who: 'glintstar', text: 'Seven times eight.', digits: '7 × 8' }, { who: 'mutterer', text: 'Fifty-six.', digits: '56' }],
        next: 'd07'
      },
      d07: {
        say: [{ who: 'tallyheart', text: 'Hop by fives. Five, ten, fifteen!' }],
        skip: { table: 5, groups: 5, who: RIM, thing: 'claw', things: 'claws', keep: true, next: 'd08' }
      },
      d08: { say: [{ who: 'tallyheart', text: 'TWENTY-FIVE!', kind: 'shout' }, { who: 'grizzled', text: 'Can I put my paw down now?' }], next: 'd09' },
      d09: { say: [{ who: 'tallyheart', text: 'Five paws, five claws each. Five times five makes twenty-five.' }], counts: { set: 'ch03-claws', next: 'd10' } },
      d10: { scene: { set: 'hollow', cam: 'tree', opts: { marks: 'auto', glow: 'auto' }, cast: [] }, say: [{ who: 'tallyheart', text: 'Claws. That’s your third Count.' }], next: 'd11' },
      d11: { scene: bridge('mouth', [{ who: 'player', pose: 'sit', mood: 'wonder', at: 'edge' }], { pebble: 'paws' }),
        say: [{ who: 'sprinkle', name: 'A small voice', text: 'You dropped that.' }], next: 'd12' },
      d12: { scene: bridge('back', [{ who: 'sprinkle', pose: 'pawsup', mood: 'happy', at: 'dragon' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'beside' }]),
        say: [{ who: 'sprinkle', text: 'At home, I eat a fish for every claw on my forepaws.' }], counts: { set: 'ch03-dinner', next: 'd13' } },
      d13: { scene: bridge('under', [{ who: 'sprinkle', pose: 'draw', mood: 'sad', at: 'mud', tear: true }]),
        say: [{ who: 'sprinkle', text: 'The storm blew my six brothers and sisters all along the river.', kind: 'whisper' }],
        caption: ['Six forepaws, five claws each. How many claws in the mud?'], counts: { set: 'ch03-six', next: 'd14' } },
      d14: { when: { ch2Path: 'river' }, say: [{ who: 'player', text: 'We heard him! On the tallest tower!', kind: 'shout' }, { who: 'sprinkle', text: 'THAT’S HIM!' }], next: 'd15' },
      d15: { choice: { prompt: 'Will you tell your Clan about me?', options: [
        { label: 'Tell Tallyheart.', sets: { ch3Told: true }, next: 't01' },
        { label: 'Keep the secret.', sets: { ch3Told: false }, next: 'k01' }
      ] } },
      t01: { caption: ['You find Tallyheart on the wall at sunset.'], next: 'd16' },
      k01: { caption: ['You carry your supper toward the hedge.'], next: 'd16' },
      d16: { scene: Object.assign(den('night'), {}), caption: [{ when: { ch3Told: true }, text: 'A secret shared feels lighter.' }, { when: { ch3Told: false }, text: 'The secret is small, but it wriggles.' }],
        skip: { table: 5, groups: 4, paws: 'own', next: 'd17' } },
      d17: { say: [{ who: 'snorer', text: 'Oh no. Not ANOTHER one.' }], next: 'd18' },
      d18: { input: { kind: 'dream', next: 'd19' } },
      d19: { caption: ['End of Chapter Three.'], end: true }
    },
    counts: {
      'ch03-ears': {
        table: 2, thing: 'ear', things: 'ears', teacher: 'tallyheart',
        facts: [[4, 2], [6, 2]],
        warmHard: { table: 2, at: 1, alt: [[2, 3], [2, 2], [2, 1]] },
        avoid: [[9, 2], [7, 2]],
        ground: 'earth', fillFrom: 'ch02-ears', fillIntro: 'One from yesterday.',
        ask: '{a} × {b}', praise: EARS_PRAISE,
        fast: ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.'],
        helpIntro: 'Close. Let’s scratch it out together: two lines for every cat, like ears.',
        helpIntroFar: 'Let’s scratch it out together: two lines for every cat, like ears.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.',
        done: null
      },
      'ch03-pile': {
        table: 2, thing: 'piece', things: 'pieces', unit: 'pair', units: 'pairs', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'stacks' }, fillFrom: 'ch02-ears', fillIntro: 'One from yesterday.',
        facts: [
          { a: 9, b: 2, picture: { kind: 'prey', layout: 'stacks', thought: true }, prompt: [{ who: 'grizzled', text: 'Nine pairs. How many pieces?' }],
            right: [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'Right.' }], rightAgain: true },
          { a: 7, b: 2, light: 'groups', check: true,
            prompt: [{ kind: 'caption', text: 'You touch your nose to each little stack. One pair. Two pairs… Seven pairs. And that’s all. How many pieces?' }] }
        ],
        ask: '{a} × {b}', praise: [],
        helpIntro: 'Close. Let’s scratch it out: two marks for every pair.', helpIntroFar: 'Let’s scratch it out: two marks for every pair.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', again: ['There it is. You remembered that one.'],
        done: null
      },
      'ch03-claws': {
        table: 5, thing: 'claw', things: 'claws', unit: 'paw', units: 'paws', teacher: 'tallyheart',
        facts: [
          { a: 4, b: 5, who: RIM.slice(0, 4) },
          { a: 5, b: 2, right: [{ who: 'tallyheart', text: 'Ten! Two paws, five claws each. Yesterday it was five cats, two ears each. Same ten!' }], rightAgain: true },
          [1, 5], [5, 5],
          { a: 5, b: 6, lit: 25, prompt: 'Six paws. The first five have twenty-five claws. Now hop on from twenty-five!', retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Thirty! Murmurchime knew it the other way around this morning. Now you know both.' }], rightAgain: true },
          [5, 8], [5, 3], [9, 5], [7, 5], [10, 5]
        ],
        firstPrompt: 'How many claws on the first four paws?',
        ask: '{a} × {b}',
        praise: ['You hopped it!', 'Hopping by fives, like a real hunter.', 'Yes! Five claws on every forepaw.', 'Claws are trickier than ears, and you’re doing it anyway.', 'Hop, hop, hop!'],
        fast: ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.'],
        fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
        helpIntro: 'Close. Let’s scratch it out together: one swipe for every paw, five lines a swipe.',
        helpIntroFar: 'Let’s scratch it out together: one swipe for every paw, five lines a swipe.',
        helpIntroNotFive: 'Remember: hopping by fives, every number ends in a five or a zero. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        done: 'That’s the fives.'
      },
      'ch03-dinner': {
        table: 5, thing: 'fish', things: 'fish', unit: 'forepaw', units: 'forepaws', teacher: 'sprinkle',
        facts: [{ a: 2, b: 5, who: [{ who: 'sprinkle' }, { who: 'sprinkle' }],
          prompt: [{ who: 'player', text: 'Hop by fives!' }, { kind: 'caption', text: 'Two forepaws, five claws each. How many fish at a meal?' }],
          retryPrompt: 'Two forepaws, five claws each. How many fish at a meal?',
          right: [{ who: 'sprinkle', text: 'TEN! How did you DO that?' }, { who: 'player', text: 'Five, ten. Hopping!' }],
          rightAgain: [{ who: 'sprinkle', text: 'TEN! Hopping really works!' }] }],
        ground: 'mud', helpCounter: 'you', helpIntro: 'Let’s scratch it in the mud. You hop!',
        fillFrom: 'ch03-claws', fillIntro: 'Count another one with me.', fillOrder: 'easiest', fillVoice: 'borrower',
        againIntro: 'Let’s count my dinner again!',
        ask: '{a} × {b}',
        praise: ['Hop, hop, hop! Like you showed me.', 'My claws say yes!'], fast: ['Even faster than Mama!'],
        fastAfterMiss: ['You didn’t even look at the mud!'], again: ['You remembered! I knew you would.'],
        miss: 'There! We’ll count that one again soon.', missLast: 'There. Now we’ve counted it together.',
        done: null
      },
      'ch03-six': {
        table: 5, thing: 'claw', things: 'claws', unit: 'forepaw', units: 'forepaws', teacher: 'sprinkle',
        picture: { kind: 'mud' },
        facts: [{ a: 6, b: 5, right: [{ who: 'sprinkle', text: 'Thirty claws.', kind: 'whisper' }], rightAgain: true }],
        ground: 'mud', helpCounter: 'you', helpIntro: 'Let’s scratch it in the mud. You hop!',
        fillFrom: 'ch03-claws', fillIntro: 'Count another one with me.', fillOrder: 'easiest', fillVoice: 'borrower',
        againIntro: 'Let’s count them again.',
        ask: '{a} × {b}',
        praise: ['Yes. Five claws each.'], again: ['Yes. Five claws each.'], fast: ['You knew that one.'], fastAfterMiss: ['You knew that one.'],
        miss: 'There. We’ll count them again in a moment.', missLast: 'There. Now we’ve counted them together.',
        done: null
      }
    },
    book: {
      title: '{name}paw’s First Moon',
      recap: [
        { text: 'Under the Old Bridge, {they} found Sprinkle, a Mistscale dragonet with a hurt wing.' },
        { when: { ch3Told: true }, text: '{name}paw told Tallyheart, and Tallyheart helped hide Sprinkle behind a fallen branch.' },
        { when: { ch3Told: false }, text: '{name}paw kept Sprinkle’s secret, carried {their} own supper to the bridge, and nearly got caught.' }
      ],
      noDream: 'After all that, {name}paw’s dream stayed a secret too.',
      dragonet: { id: 'sprinkle', name: 'Sprinkle', lines: ['A Mistscale dragonet, as big as a heron.', '{name}paw found her under the Old Bridge.'] }
    },
    teaser: { title: 'Chapter 4: The Glittering Scale', lines: ['Tomorrow, Tallyheart has a new Count for you: both forepaws.'] }
  };
}

chapters.chapter3 = chapter3;
module.exports = chapters;
