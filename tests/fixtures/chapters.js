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
 * ch04: chapter 4's contract (docs/build.md, "Chapter 4 (v0.4)"), below: the Case File and the 10s.
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
  const ch04 = chapter4();
  return { ch01, ch02, ch03, ch04 };
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

/* ch04: chapter 4's engine contract (docs/chapters/04-the-glittering-scale.md, "Build"; docs/build.md,
 * "Chapter 4 (v0.4)") in a few frames, with the text's own words: the claws warm-up (three questions,
 * 2 × 5 written last and never the hard pick nor a filler), the skip-count on the 10s that keeps its
 * totals, the tens lesson (the zero rule, 4 × 10's own line on its retry too, 6 × 10 hopping on from
 * fifty), the pile in rows of ten (two questions, help in the earth a row at a time, the easiest tens
 * borrowed), the glitter Tap, a light choice, the fox's labels ("The fox", then "Reynard"), the
 * noticing frame with its sticky `sets`, the told path's whisper, her first tap on the bark and her
 * first card (its line her balloon), the row of bark, the mark choice, the noticing cat's frame over
 * the bark, the `file` frame, the tower choice (its labels for a cat who has met him), the roof
 * (the riddle in "The little dragon"'s voice on the grit, the card given there and shown with the
 * flag, the forepaw Tap that sets `foundSquall`), "Not today", the bridge (a frame for a cat who
 * found him, a card, the noticing-and-kept frame, the promise Tap, the raft's three lines, tonight's
 * rows), the den frame with its two variants, the wing card in her nest, the bedtime tens, the dream,
 * the end, the book (Squall's page only when found) and a teaser. It borrows from `ch03-claws`: pass
 * chapter 3 (the real one, or the fixture) beside it. */
function chapter4() {
  const RIM = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 4 }, { who: 'grizzled' }];
  const hollow = (cam, cast, opts) => ({ set: 'hollow', cam, opts: Object.assign({ marks: 'auto', glow: 'auto' }, opts || {}), cast: cast || [], fx: ['day'] });
  const pile = (cam, opts, cast) => ({ set: 'pile', cam, opts: opts || {}, cast: cast || [], fx: ['morning'] });
  const den = (opts, cast) => ({ set: 'den', cam: 'nest', opts: Object.assign({ weather: 'clear', moon: false, stone: 'auto' }, opts || {}), cast: cast || [{ who: 'player', pose: 'lie', mood: 'sleepy', at: 'nest' }], fx: ['night'] });
  const bridge = (cam, cast, opts) => ({ set: 'bridge', cam, opts: opts || {}, cast: cast || [], fx: ['day'] });
  const TENS_HELP = 'Close. Let’s scratch it out together: two swipes for every cat, five lines a swipe.';
  const ROW_HELP = 'Let’s scratch it out: ten marks for every row.';
  const ROW_ZERO = 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.';
  return {
    id: 'ch04', number: 4, title: 'The Glittering Scale', start: 'g01',
    names: { reynard: 'The fox', squall: 'The little dragon' },
    cards: {
      'four-a-night': { mark: 'eye', line: 'Four gone every night.' },
      tidy: { mark: 'eye', line: 'The thief leaves the pile tidy.' },
      'dug-earth': { mark: 'eye', line: 'Freshly dug earth behind the pile.' },
      scale: { mark: 'eye', line: 'The ‘scale’ is smooth, like glass.' },
      'fox-flew': { mark: 'ear', line: 'The fox says it FLEW.', answers: ['cant-fly'], link: { when: { ch4CaughtFly: true }, line: 'They can’t both be true.' } },
      'fox-moon': { mark: 'ear', line: 'The fox says the MOON was out on the storm night.' },
      'squall-shapes': { mark: 'ear', line: 'Squall says two skinny shapes carry something to the tracks.', when: { foundSquall: true } },
      'sprinkle-scales': { mark: 'eye', line: 'Sprinkle’s scales are grey and bumpy.' },
      'cant-fly': { mark: 'eye', line: 'Sprinkle can’t fly.' }
    },
    frames: {
      g01: { scene: den({}, [{ who: 'player', pose: 'lie', mood: 'sleepy', at: 'nest' }]),
        caption: ['You open one eye. Was that a hiccup?', { when: { ch3Told: true }, text: 'She gives you a slow wink. You two share a secret now.' },
          { when: { ch3Told: false }, text: 'You sniff your paws. Do they still smell of fish?' }],
        say: [{ who: 'tallyheart', text: 'Up, {name}paw! Up, up, up!' }], sfx: '…hic!', next: 'g02' },
      g02: { scene: hollow('lesson', [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'sand-right', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'sand-left' }]),
        say: [{ who: 'tallyheart', text: 'Claws first, to wake up your whiskers.' }], counts: { set: 'ch04-claws', next: 'g03' } },
      g03: { say: [{ who: 'tallyheart', text: 'Two forepaws. Ten claws. Hold on to that ten. Today’s Count is made of it.' }],
        caption: [{ when: { ch3Told: true }, text: 'Her whiskers twitch. You both know somebody who eats a fish for every claw.' }, { when: { ch3Told: false }, text: 'You know somebody who eats a fish for every claw.' }], next: 'g04' },
      g04: { say: [{ who: 'tallyheart', text: 'Hop by tens. Ten, twenty, thirty! Touch each cat, and hop with me.' }],
        skip: { table: 10, groups: 5, who: RIM, thing: 'claw', things: 'claws', keep: true, prompt: '**Tap** the cats, left to right.', next: 'g05' } },
      g05: { say: [{ who: 'tallyheart', text: 'FIFTY!', kind: 'shout' }, { who: 'tallyheart', text: 'Now hold still.' }], next: 'g06' },
      g06: { say: [{ who: 'tallyheart', text: 'Five cats, ten front claws each. Five times ten makes fifty. And every number you land on ends in a zero.' }], counts: { set: 'ch04-tens', next: 'g07' } },
      g07: { scene: hollow('tree', [], { bark: 'falling' }), caption: ['A curl of bark drops by your paws.'], say: [{ who: 'tallyheart', text: 'Both forepaws. That’s your fourth Count.' }], sfx: 'SKRITCH!', next: 'g08' },
      g08: { scene: pile('wide', { rows: [10, 10, 10], back: 'shadow' }, [{ who: 'grizzled', pose: 'sit', mood: 'proud', at: 'beside' }, { who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'pile-right', facing: 'left' }]),
        caption: ['At the prey pile, the old tom is waiting beside three long rows.'], counts: { set: 'ch04-pile', next: 'g09' } },
      g09: { scene: pile('close', { rows: [10, 10, { n: 10, gap: [3, 4, 5, 6] }], dug: 'big' }),
        caption: ['Four empty spaces, side by side.', 'You didn’t count anything. You just saw it.', { when: { specialty: 'noticing' }, text: 'Behind the gap, the earth is freshly dug. Again.' }],
        say: [{ who: 'tallyheart', text: 'A gap shows in a heartbeat.' }], next: 'g10' },
      g10: { scene: pile('close', { rows: [10, 10, { n: 10, gap: [3, 4, 5, 6] }], dug: 'big', scale: true, glint: true }),
        caption: ['Then the sun slides over the towers. And in the gap, something glitters.'],
        scratch: { tap: 'glint', prompt: '**Tap** the glitter.', at: { x: 52, y: 44 }, next: 'g11' } },
      g11: { caption: ['Everybody looks up at the sky. You think of Sprinkle, and look hard at the scale.'], choice: { options: [
        { label: 'Look THROUGH it.', sets: {}, next: 'g12a' },
        { label: 'Look INTO it.', sets: {}, next: 'g12b' }
      ] } },
      g12a: { caption: ['The whole camp goes wavy, and a little green. Just like the patio door in the rain.'], next: 'g13' },
      g12b: { caption: ['A tiny cat looks back, with your face. Just like in the patio door, every evening.'], next: 'g13' },
      g13: { caption: ['There sits a fox, combing his enormous tail. He’s smiling before anyone speaks.'], say: [{ who: 'reynard', text: 'Ahem.' }], next: 'g14' },
      g14: { say: [{ who: 'glintstar', text: 'You are at our border, Reynard.' }, { who: 'reynard', name: 'Reynard', text: 'AT it, dear lady. Never over it.' },
        { who: 'reynard', name: 'Reynard', text: 'A DRAGON. It flew up out of your camp with its claws full of mice. Flap! Flap! Flap!', kind: 'whisper' }], next: 'g15' },
      g15: { when: { specialty: 'noticing' }, sets: { ch4CaughtFly: true }, caption: ['Wait. FLEW? Sprinkle’s wing droops. She can’t fly!', 'And you can’t say so. Not without telling everyone about Sprinkle.'], next: 'g16' },
      g16: { caption: ['But all around you, cats are nodding.'], choice: { options: [
        { label: '“Glintstar! Do we blame what we haven’t seen?”', sets: {}, next: 'g17' },
        { label: '“Did anyone else see it?”', sets: {}, next: 'g17' }
      ] } },
      g17: { when: { ch3Told: true }, say: [{ who: 'player', text: 'Shouldn’t we tell Glintstar about Sprinkle?', kind: 'whisper' },
        { who: 'tallyheart', text: 'Not yet. First we find out who took the prey. Then we tell her everything.', kind: 'whisper' }], next: 'g18' },
      g18: { scene: hollow('sand', [{ who: 'player', pose: 'lie', mood: 'worried', at: 'sand-left' }], { bark: 'sand' }), caption: ['This morning’s curl of bark still lies in the sand.'], say: [{ who: 'player', text: 'My head is full of fox.' }], next: 'g19' },
      g19: { scene: hollow('sand', [], { bark: 'sand' }), say: [{ who: 'player', text: 'A case file! A place to keep everything you find out.' }],
        scratch: { draws: 'four-a-night', prompt: '**Tap** the bark to scratch it.', next: 'g20' } },
      g20: { scene: hollow('lesson', [{ who: 'tallyheart', pose: 'sit', mood: 'proud', at: 'sand-right', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'sand-left' }]),
        card: { id: 'four-a-night', mark: false },
        say: [{ who: 'player', text: 'Four gone every night.' }, { who: 'tallyheart', text: 'A tally you can carry! One piece of bark, one thing you know.' }], next: 'g21' },
      g21: { scene: hollow('sand', [], { bark: 'row' }), say: [{ who: 'tallyheart', text: 'An eye for what you saw yourself. An ear for what you were only told.' }],
        scratch: { head: ['four-a-night'], cards: ['tidy', { id: 'dug-earth', when: { specialty: 'noticing' } }, 'scale'], prompt: '**Tap** each piece of bark to scratch what you saw.', next: 'g22' } },
      g22: { say: [{ who: 'tallyheart', text: 'Now the fox’s story. He says it FLEW. Which mark?' }], choice: { options: [
        { label: 'An eye: I saw it myself.', sets: {}, next: 'g23a' },
        { label: 'An ear: somebody told me.', sets: {}, next: 'g23b' }
      ] } },
      g23a: { card: 'fox-flew', say: [{ who: 'tallyheart', text: 'Did you see it fly?' }, { who: 'player', text: '…No.' }], caption: ['You scratch an ear.'], next: 'g24' },
      g23b: { card: 'fox-flew', say: [{ who: 'tallyheart', text: 'Sharp.' }], caption: ['You scratch an ear.'], next: 'g24' },
      g24: { card: 'fox-moon', caption: ['You scratch one more: a fox, and a moon. Another ear.'], say: [{ who: 'tallyheart', text: 'Not true yet. Not false yet. A thing to check.' }], next: 'g25' },
      g25: { when: { specialty: 'noticing' },
        say: [{ who: 'player', text: 'He said FLEW. And she can’t.', kind: 'whisper', when: { ch3Told: true } }, { who: 'tallyheart', text: 'One hole in his story. Find me more.', kind: 'whisper', when: { ch3Told: true } }],
        caption: [{ when: { ch3Told: false }, text: 'One of them is false already. But you can’t say so.' }], next: 'g26' },
      g26: { scene: hollow('lesson', [{ who: 'tallyheart', pose: 'sit', mood: 'happy', at: 'sand-right', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'proud', at: 'sand-left' }]),
        say: [{ who: 'tallyheart', text: 'And every time you find something out…' }, { who: 'player', text: 'Skritch.' }], file: { next: 'g27' } },
      g27: { scene: { set: 'tower', cam: 'up', opts: {}, cast: [{ who: 'waffles', pose: 'peer', mood: 'shout', at: 'railing' }], fx: ['day'] },
        caption: ['It comes from the roof of the tallest tower. Your old tower, where the red light blinks.',
          { when: { ch2Path: 'river' }, text: 'The same roar as before. Sprinkle’s littlest brother!' }, { when: { ch2Path: 'bridge' }, text: 'A roar with a hiccup, just as Sprinkle said. Her littlest brother!' },
          { when: { specialty: 'climbing' }, text: 'Balcony, balcony, balcony, roof. You could climb that.' }],
        sfx: 'RAWWWRRR… hic!',
        choice: { options: [
          { label: 'Go up and find him. Right now.', labelWhen: [{ when: { foundSquall: true }, label: 'Go up and see Squall again.' }], next: 'r01' },
          { label: 'Not today. Sprinkle first.', labelWhen: [{ when: { foundSquall: true }, label: 'Not today. He’s guarding.' }], next: 'n01' }
        ] } },
      r01: { when: { not: { specialty: 'climbing' } }, caption: ['The elevator! You jump, and whack the top button.'], sfx: 'DING!', next: 'r02' },
      r02: { caption: ['On the wide, flat roof, a dragon no bigger than you hugs the pole of the red light.'], say: [{ who: 'squall', text: 'AND STAY OUT, giant dragon!', kind: 'shout' }], next: 'r03' },
      r03: { say: [{ who: 'squall', text: 'HALT! Friend, or NOT friend?' }, { who: 'player', text: 'Friend! Sprinkle sent me.' }, { who: 'squall', text: 'PROVE it!' }], counts: { set: 'ch04-riddle', next: 'r04' } },
      r04: { say: [{ who: 'squall', text: 'And NOBODY’S MISSING!' }, { who: 'player', text: 'Not Sprinkle. She’s safe, under the Old Bridge.' },
        { who: 'squall', name: 'Squall', text: 'She IS? …I’m Squall. I’m the littlest. And the LOUDEST.' }], next: 'r05' },
      r05: { card: 'squall-shapes', caption: ['The train tracks!'], say: [{ who: 'squall', name: 'Squall', text: 'Every night, two skinny shapes go sneaking along down THERE, carrying something. To the long shiny lines.' }], next: 'r06' },
      r06: { sets: { foundSquall: true }, say: [{ who: 'squall', name: 'Squall', text: 'Can’t. I’m GUARDING. Tell Sprinkle: five. She’ll know.' }],
        skip: { table: 5, groups: 1, who: [{ who: 'squall' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: 'b01' } },
      n01: { say: [{ who: 'waffles', text: 'You’re LEAVING me with him?' }, { who: 'player', text: 'I’ll come back!' }], sfx: '…hic!', next: 'b01' },
      b01: { scene: bridge('back', [{ who: 'sprinkle', pose: 'sit', mood: 'happy', at: 'dragon' }, { who: 'player', pose: 'sit', mood: 'kind', at: 'beside' }]),
        caption: ['Under the Old Bridge, two big eyes shine.'],
        say: [{ who: 'player', text: 'I found your littlest brother. He says: five.', when: { foundSquall: true } },
          { who: 'player', text: 'Your littlest brother is still roaring.', when: { foundSquall: false } }, { who: 'sprinkle', text: 'Then he’s fine. He only stops to sleep.', when: { foundSquall: false } }], next: 'b02' },
      b02: { when: { foundSquall: true }, say: [{ who: 'sprinkle', text: 'Five and five. Ten. That’s two of us.', kind: 'whisper' }], next: 'b03' },
      b03: { card: 'sprinkle-scales', caption: ['You run a paw along it: bumpy, and soft, and grey as mist.'], say: [{ who: 'sprinkle', text: 'Then it’s not mine.' }], next: 'b04' },
      b04: { when: { specialty: 'noticing', ch3Told: false }, say: [{ who: 'player', text: 'And the fox says you FLEW.' }, { who: 'sprinkle', text: 'I WISH.' }], next: 'b05' },
      b05: { say: [{ who: 'player', text: 'Three friends, ten claws each.' }],
        skip: { table: 10, groups: 3, thing: 'claw', things: 'claws', teacher: 'player', paws: 'pile', prompt: '**Tap** the paws.', next: 'b06' } },
      b06: { say: [{ who: 'riffle', text: 'A thirty-claw promise!' }, { who: 'sprinkle', text: 'That beats fifteen.' }, { who: 'riffle', text: 'And tomorrow: my RAFT!' }],
        caption: [{ when: { worry: 'water', not: { specialty: 'swimming' } }, text: 'A raft. On the deep water. Your tummy flips over. But Riffle will be right there.' },
          { when: { specialty: 'swimming', worry: 'water' }, text: 'A raft. A dripping tap is one thing. The deep river is another. But Riffle will be right there.' },
          { when: { specialty: 'swimming', not: { worry: 'water' } }, text: 'A raft! Your paws can’t wait.' }], next: 'b07' },
      b07: { when: { foundSquall: true }, say: [{ who: 'player', text: 'Squall saw two skinny shapes going to the tracks. Every night.' }, { who: 'riffle', text: 'The TRACKS? At NIGHT? Raft first.' }], next: 'b08' },
      b08: { scene: pile('wide', { rows: [10, 10, 10, 10], scale: 'behind' }, [{ who: 'grizzled', pose: 'sit', mood: 'neutral', at: 'beside' }, { who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'pile-right', facing: 'left' }]),
        caption: ['At sunset, you and Tallyheart find the old tom by tonight’s pile.'], counts: { set: 'ch04-night', next: 'h01' } },
      // one frame, two variants: a cat who kept the secret, and one who told and found Squall (one who told and did not go up gets no frame)
      h01: { when: { not: { ch3Told: true, foundSquall: false } },
        say: [{ who: 'tallyheart', text: 'That was a fair question you asked at the border. If you ever have one for me, I’m right here.', when: { ch3Told: false } },
          { who: 'tallyheart', text: 'A thing to check. Together.', when: { ch3Told: true, foundSquall: true } }],
        caption: [{ when: { ch3Told: true, foundSquall: true }, text: 'At the den, you tell Tallyheart about Squall, and what he saw.' }], next: 'h02' },
      h02: { scene: den({ bark: 'auto', hidden: true }), card: 'cant-fly',
        caption: ['Then, in the dark, you scratch one more: a drooping wing.', { when: { not: { specialty: 'noticing' } }, text: 'She can’t go looking for her brothers and sisters. So you will.' },
          { when: { specialty: 'noticing' }, text: 'You hold it beside the fox’s FLEW. They can’t both be true.' }, 'Then the two pieces of bark about Sprinkle go under the moss.'], next: 'h03' },
      h03: { scene: den({ bark: 'auto', hidden: true }), say: [{ who: 'snorer', text: '…Do the paw thing.', kind: 'whisper' }],
        skip: { table: 10, groups: 5, thing: 'claw', things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', next: 'h04' } },
      h04: { caption: ['By fifty, he’s snoring.', { when: { foundSquall: true }, text: 'Goodnight, Squall.' }, { when: { foundSquall: false }, text: 'Sprinkle’s littlest brother is still up there. You’ll go up another day.' }], sfx: '…hic!', next: 'h05' },
      h05: { input: { kind: 'dream', next: 'h06' } },
      h06: { caption: ['End of Chapter Four.'], end: true }
    },
    counts: {
      'ch04-claws': {
        table: 5, thing: 'claw', things: 'claws', unit: 'paw', units: 'paws', teacher: 'tallyheart',
        facts: [[3, 5], [5, 7], { a: 2, b: 5, who: [{ who: 'tallyheart' }, { who: 'tallyheart' }], prompt: [{ who: 'tallyheart', text: 'Two forepaws, five claws each. How many claws?' }], retryPrompt: true,
          right: [{ who: 'tallyheart', text: 'Ten!' }], rightAgain: true }],
        warmHard: { table: 5, at: 1, alt: [[4, 5], [1, 5], [5, 5]] },
        avoid: [[2, 5]],
        fillFrom: 'ch03-claws', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
        ask: '{a} × {b}',
        praise: ['You hopped it!', 'Hopping by fives, like a real hunter.', 'Yes! Five claws on every forepaw.'],
        fast: ['You didn’t even have to hop that time.', 'Quick as a pounce!'],
        fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
        helpIntro: 'Close. Let’s scratch it out together: one swipe for every paw, five lines a swipe.',
        helpIntroFar: 'Let’s scratch it out together: one swipe for every paw, five lines a swipe.',
        helpIntroNotFive: 'Remember: hopping by fives, every number ends in a five or a zero. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.',
        done: null
      },
      'ch04-tens': {
        table: 10, thing: 'front claw', things: 'front claws', unit: 'cat', units: 'cats', teacher: 'tallyheart',
        label: 'Both forepaws', hollowThings: 'tens',
        facts: [
          { a: 4, b: 10, who: RIM.slice(0, 4), right: [{ who: 'tallyheart', text: 'You hopped it!' }], rightAgain: true },
          { a: 10, b: 2, right: [{ who: 'tallyheart', text: 'Twenty! Two cats, ten claws each. Or ten cats, two ears each. Same twenty!' }], rightAgain: true },
          [1, 10], [5, 10],
          { a: 6, b: 10, lit: 50, prompt: 'Six cats. The first five have fifty claws. Now hop on from fifty!', retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Sixty! Hear it? SIX-ty. Six tens. The answer hides in its own name.' }], rightAgain: true },
          [10, 8], [10, 3], [10, 9], [7, 10],
          { a: 10, b: 10, right: [{ who: 'tallyheart', text: 'A HUNDRED! The very last thing Glintstar asked {Murmur}chime.' }], rightAgain: true }
        ],
        firstPrompt: 'How many front claws on the first four cats?',
        ask: '{a} × {b}',
        praise: ['Yes! Ten front claws on every cat.', 'Hopping by tens, like a real hunter.', 'Tens are friendly, aren’t they?', 'Hop, hop, hop!', 'You hopped it!'],
        fast: ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.'],
        fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
        helpIntro: TENS_HELP, helpIntroFar: TENS_HELP.replace(/^Close\. /, ''),
        helpIntroNotTen: 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        done: 'That’s the tens.'
      },
      'ch04-pile': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'rows' },
        facts: [
          { a: 3, b: 10, picture: { kind: 'prey', layout: 'rows', thought: true },
            prompt: [{ who: 'grizzled', text: 'Best hunt since the storm.' }, { who: 'grizzled', text: 'Three rows of ten last night. How many pieces?' }],
            retryPrompt: 'Three rows of ten. How many pieces?', right: [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'It took me till the stars came out.' }], rightAgain: true },
          { a: 2, b: 10, light: 'rows', check: true,
            prompt: [{ kind: 'caption', text: 'You walk along the rows. One full row. Two full rows. How many pieces in two rows of ten?' }], retryPrompt: 'Two rows of ten. How many pieces?' }
        ],
        ask: '{a} × {b}', praise: [], ground: 'earth',
        helpIntro: ROW_HELP, helpIntroNotTen: ROW_ZERO,
        fillFrom: 'ch04-tens', fillOrder: 'easiest', avoid: [[4, 10]], fillIntro: 'One from this morning.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', again: ['There it is. You remembered that one.'],
        done: null
      },
      'ch04-riddle': {
        table: 5, thing: 'claw', things: 'claws', unit: 'forepaw', units: 'forepaws', teacher: 'squall',
        picture: { kind: 'grit' },
        facts: [{ a: 7, b: 5, prompt: 'Seven dragonets hold up one forepaw each. Five claws on every forepaw. How many claws does Mama count?',
          retryPrompt: 'Seven forepaws, five claws each. How many claws?', right: [{ who: 'squall', text: 'THIRTY-FIVE!', kind: 'shout' }], rightAgain: true }],
        ground: 'grit', helpCounter: 'you', helpIntro: 'Scratch it on the roof! You hop!',
        fillFrom: 'ch03-claws', fillOrder: 'easiest', fillVoice: 'borrower', avoid: [[2, 5]], fillIntro: 'Do another one!',
        againIntro: 'Mama’s count again!',
        ask: '{a} × {b}',
        praise: ['YES!', 'Hop, hop, HOP!'], fast: ['FAST! Faster than a giant dragon!'], again: ['You REMEMBERED!'],
        miss: 'There! We’ll count that one AGAIN.', missLast: 'There. Now we’ve counted it together.',
        done: null
      },
      'ch04-night': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'rows' },
        facts: [{ a: 4, b: 10, light: 'rows',
          prompt: [{ who: 'grizzled', text: 'Four rows of ten tonight.' }, { who: 'grizzled', text: 'How many pieces, counting cat?' }], retryPrompt: 'Four rows of ten. How many pieces?',
          right: [{ who: 'grizzled', text: 'Forty.' }, { kind: 'caption', text: 'He checks, under his breath.' }, { who: 'grizzled', text: 'Ten, twenty, thirty, forty. Hmph. Quicker than twos.', kind: 'whisper' }], rightAgain: true }],
        ask: '{a} × {b}', praise: [], ground: 'earth',
        helpIntro: ROW_HELP, helpIntroNotTen: ROW_ZERO,
        fillFrom: 'ch04-tens', fillOrder: 'easiest', avoid: [[3, 10], [2, 10]], fillIntro: 'One from this morning.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', again: ['There it is. You remembered that one.'],
        done: null
      }
    },
    book: {
      title: '{name}paw’s First Moon',
      recap: [
        { text: 'On {name}paw’s third morning, the pile lay in rows of ten, and a gap showed in a heartbeat.' },
        { text: '{name}paw started a Case File: a piece of bark for every clue.' },
        { when: { ch4CaughtFly: true }, text: '{They} caught one hole in the fox’s story: Reynard said the dragon flew, and Sprinkle can’t fly.' },
        { when: { foundSquall: true }, text: 'On the roof of {their} old tower, {they} found Squall, the littlest dragonet, who roars at airplanes and hiccups.' },
        { when: { foundSquall: false }, text: 'On the roof of {their} old tower, Sprinkle’s littlest brother is still roaring, and hiccuping.' }
      ],
      noDream: '{name}paw’s dream that night is not in the Case File.',
      dragonet: { id: 'squall', name: 'Squall', when: { foundSquall: true }, lines: ['The littlest of the clutch, slate grey with yellow flecks like sparks, and the loudest.', '{name}paw found him on the roof of the tallest tower.'] }
    },
    teaser: { title: 'Chapter 5: Riffle’s River', lines: ['Tomorrow, you ride Riffle’s raft, to ask the river who was awake on the storm night.'] }
  };
}

chapters.chapter3 = chapter3;
chapters.chapter4 = chapter4;
module.exports = chapters;
