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
 * ch05: chapter 5's contract (docs/build.md, "Chapter 5 (v0.4)"), below: the 9s, the river and the marsh.
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
  const ch05 = chapter5();
  return { ch01, ch02, ch03, ch04, ch05 };
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
        // (chapter 5's Build, "The book": a cat who went up in chapter 5 found him there, not here)
        { when: { foundSquall: true, ch5Roof: false }, text: 'On the roof of {their} old tower, {they} found Squall, the littlest dragonet, who roars at airplanes and hiccups.' },
        { when: { foundSquall: false }, text: 'On the roof of {their} old tower, Sprinkle’s littlest brother is still roaring, and hiccuping.' },
        { when: { ch5Roof: true }, text: 'On the roof of {their} old tower, Sprinkle’s littlest brother is still roaring, and hiccuping.' }
      ],
      noDream: '{name}paw’s dream that night is not in the Case File.',
      dragonet: { id: 'squall', name: 'Squall', when: { foundSquall: true }, lines: ['The littlest of the clutch, slate grey with yellow flecks like sparks, and the loudest.', '{name}paw found him on the roof of the tallest tower.'] }
    },
    teaser: { title: 'Chapter 5: Riffle’s River', lines: ['Tomorrow, you ride Riffle’s raft, to ask the river who was awake on the storm night.'] }
  };
}

/* ch05: chapter 5's engine contract (docs/chapters/05-riffles-river.md, "Build"; docs/build.md,
 * "Chapter 5 (v0.4)"), with the text's own words, and its whole shape, so every path can be walked:
 * the old tom's nose (a one-tap frame with its small answer), the pile's one question on a Counts
 * frame that carries four balloons, the gap as two frames (a noticing cat taps the dug earth and
 * holds `prints-pile`), the tens warm-up with the hard pick first and `intro: false`, the tuck (a
 * skip-count that runs backwards and keeps its picture with no totals), the nines (the hop and the
 * tuck as each is asked, the four help openings, two answers in the sand, its own easiest fillers),
 * the roof offered again (chapter 4's frames, run here; `ch5Roof`), Waffles' "AGAIN?", the Crossing,
 * her four paws aboard, nine claws in the log with the scene redrawn as she taps, the light choices,
 * the shivering raft, "Under the raft" in its two places (Puddle's riddle on his own logs; the sticky
 * `foundPuddle`), the witness choice (`ch5First`), "What the otters heard" in its two places (a tuft
 * of fur to tap), the marsh (Riffle's seven questions, the fish Counts in his voice on a log, the
 * cloud that grows, a climber's pole), the three waits and their three ways out, Wisp's silent riddle
 * (`foundWisp`), the catch, the slip, the news under the bridge, the mud count (a forepaw for
 * everyone found), the den, the bedtime nines, the dream and the end; her book with two dragonet
 * pages, and a teaser. It runs chapter 4's roof (`ch04-riddle`, `squall-shapes`), borrows from
 * `ch04-tens`, `ch03-claws`, `ch02-ears` and `ch01-tails`, and touches `fox-moon`: pass chapters 1
 * to 4 (the real ones, or the fixtures) beside it. */
function chapter5() {
  const RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 4 }, { who: 'grizzled' }];
  const NONE = { ch5Roof: false, foundPuddle: false, foundWisp: false }, ANY = { not: NONE };
  const ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  const pile = (cam, opts, cast) => ({ set: 'pile', cam, opts: Object.assign({ rows: ROWS, scale: 'behind' }, opts || {}), cast: cast || [], fx: ['morning'] });
  const hollow = (cam, cast, opts) => ({ set: 'hollow', cam, opts: Object.assign({ marks: 'auto', glow: 'auto' }, opts || {}), cast: cast || [], fx: ['day'] });
  const rim = (tuck) => RIM.map((c, i) => Object.assign({ pose: 'situp', mood: 'happy', at: 'rim-' + (i + 1), facing: 'right' }, c, tuck ? { tuck: true } : {}));
  const crossing = (cam, cast, opts, late) => ({ set: 'crossing', cam, opts: Object.assign({ plane: 'none' }, opts || {}), cast: cast || [], fx: [late ? 'sunset' : 'day'] });
  const river = (cam, cast, opts) => ({ set: 'openriver', cam, opts: Object.assign({ plane: 'none' }, opts || {}), cast: cast || [], fx: ['day'] });
  const marsh = (cam, cast, opts) => ({ set: 'marsh', cam, opts: opts || {}, cast: cast || [], fx: ['day'] });
  const bridge = (cam, cast, opts) => ({ set: 'bridge', cam, opts: opts || {}, cast: cast || [], fx: ['sunset'] });
  const den = (cam, cast, opts, fx) => ({ set: 'den', cam, opts: Object.assign({ weather: 'clear', stone: 'auto', bark: 'auto', hidden: true }, opts || {}), cast: cast || [], fx: [fx || 'night'] });
  const me = (pose, at, more) => Object.assign({ who: 'player', pose: pose || 'sit', mood: 'happy', at: at }, more || {});
  const riffle = (pose, at, more) => Object.assign({ who: 'riffle', pose: pose || 'sit', mood: 'happy', at: at }, more || {});
  const patience = (pose) => ({ who: 'patience', pose: pose || 'stand', mood: 'neutral', at: 'shallows', facing: 'left' });
  const TENS_HELP = 'Close. Let’s scratch it out together: two swipes for every cat, five lines a swipe.';
  const ROW_HELP = 'Let’s scratch it out: ten marks for every row.';
  const ROW_ZERO = 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.';
  const NINES_HELP = 'Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.';
  // the three fish sets are Riffle's, whole: every word after a miss on the river is his or her own
  const FISH = { teacher: 'riffle', fillVoice: 'borrower', fillPicture: 'borrower', fillOrder: 'easiest', fillIntro: 'An easy one!', againIntro: 'The fish again!',
    miss: 'Phew. That one again in a minute.', missLast: 'There. Now we’ve counted it.', again: ['You GOT it!'], helpCounter: 'you', ground: 'log', ask: '{a} × {b}', praise: [], done: null };

  const frames = {};
  /* ---- the morning: the pile */
  Object.assign(frames, {
    p01: { scene: pile('rows', { back: 'shadow' }, [{ who: 'grizzled', pose: 'sit', mood: 'sleepy', at: 'beside', asleep: true, snail: true }, me('stand', 'pile-right', { facing: 'left' })]),
      caption: ['At sunrise, the old tom sits by the prey pile, as straight as a post. He’s guarding.', 'He’s guarding with his eyes shut. A snail is halfway up his ear.'], sfx: 'SNNNRRRK.',
      scratch: { tap: 'nose', prompt: '**Tap** his nose to wake him up.', label: 'Wake him up.', miss: 'snnnrrk…', next: 'p02' } },
    p02: { scene: pile('rows', { back: 'shadow' }, [{ who: 'grizzled', pose: 'sit', mood: 'scared', at: 'beside', snail: 'in' }, { who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'pile-right', facing: 'left' }, me('sit', 'pile-left')]),
      say: [{ who: 'grizzled', text: 'WHO GOES THERE? Oh. The counting cat. I was resting my eyes.' }, { who: 'tallyheart', text: 'All night?' }, { who: 'grizzled', text: 'They were VERY tired.' }, { who: 'player', text: 'You have a snail.' }],
      counts: { set: 'ch05-pile', next: 'p03n' } },
    // the gap is two frames, since a frame has one interaction: a noticing cat taps the dug earth
    p03n: { when: { specialty: 'noticing' }, else: 'p03', scene: pile('gap', { dug: 'big' }, [me('stand', 'pile-left')]),
      caption: ['Then the back row. Right in the middle: four empty spaces. Again.', 'You didn’t count that. You just saw it.'],
      scratch: { tap: 'earth', prompt: '**Tap** the freshly dug earth behind the gap.', label: 'Look at the dug earth.', miss: 'rustle…', next: 'p04' } },
    p03: { when: { not: { specialty: 'noticing' } }, scene: pile('gap', { dug: 'big' }, [me('stand', 'pile-left')]),
      caption: ['Then the back row. Right in the middle: four empty spaces. Again.', 'You didn’t count that. You just saw it.'], next: 'p05' },
    p04: { when: { specialty: 'noticing' }, scene: pile('gap', { dug: 'big', prints: true }), card: 'prints-pile', caption: ['Tiny prints. Each is half the size of yours.'], next: 'p05' },
    p05: { scene: pile('gap', { dug: 'big', swept: true }, [{ who: 'grizzled', pose: 'walk', mood: 'shout', at: 'beside' }, { who: 'tallyheart', pose: 'sit', mood: 'solemn', at: 'pile-right', facing: 'left' }]),
      caption: ['The old tom stomps around the pile to look.', { when: { specialty: 'noticing' }, text: 'His tail sweeps the prints away. Nothing left to show anyone. But you saw them.' }],
      say: [{ who: 'grizzled', text: 'The BACK row? AGAIN?' }, { who: 'tallyheart', text: 'Why is it always the back?' }], next: 'p06' },
    p06: { scene: pile('wide', {}, [{ who: 'glintstar', pose: 'sit', mood: 'stern', at: 'fountain-edge' }, { who: 'snorter', pose: 'sit', mood: 'proud', at: 'crowd-1' }]),
      say: [{ who: 'glintstar', text: 'Four more. Sixteen pieces in four nights.' }, { who: 'snorter', text: 'That dragon is getting FAT.' }], next: 'p07' },
    p07: { caption: [{ when: { ch3Told: true }, text: 'Tallyheart’s whiskers twitch. You both know a dragon who hasn’t taken one mouse.' },
      { when: { ch3Told: false }, text: 'You know a dragon who hasn’t taken one mouse. You don’t say a word.' }], next: 'p08' },
    p08: { say: [{ who: 'glintstar', text: 'Tallyheart. By tomorrow night, I want proper guards.' }, { who: 'grizzled', text: 'Tonight, I’m sitting on a pinecone.' }], next: 'h01' }
  });
  /* ---- the Training Hollow: tens first, then the nines */
  Object.assign(frames, {
    h01: { scene: hollow('wide', rim(false).concat([{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'tree-far', facing: 'left' }, me('sit', 'sand-left')]), { marks: 4 }),
      caption: ['In the Training Hollow, five cats sit up on the rim, claws out.'], say: [{ who: 'tallyheart', text: 'Tens first, to wake up your whiskers.' }],
      counts: { set: 'ch05-tens', intro: false, next: 'h02' } },
    h02: { say: [{ who: 'tallyheart', text: 'Hold on to that fifty. Today’s Count is the nines.' }], next: 'h03' },
    h03: { scene: hollow('lesson', [{ who: 'tallyheart', pose: 'situp', mood: 'kind', at: 'sand-right', facing: 'left' }, me('sit', 'sand-left')], { marks: 4 }),
      caption: ['Tallyheart holds out both forepaws.'], sfx: 'Shhnk! Shhnk!',
      say: [{ who: 'tallyheart', text: 'Ten front claws. And every cat has nine lives.' }, { who: 'grizzled', text: 'The elders swear by it. I’m an elder. I swear by it.' }], next: 'h04' },
    h04: { scene: hollow('lesson', [{ who: 'tallyheart', pose: 'situp', mood: 'kind', at: 'sand-right', facing: 'left', tuck: true }, me('situp', 'sand-left', { tuck: true })], { marks: 4 }),
      caption: ['Tallyheart curls one claw back in.'],
      say: [{ who: 'tallyheart', text: 'The elders count their lives on their claws. Nine claws out. One tucked in.' }, { who: 'player', text: 'What’s the tucked one for?' }, { who: 'grizzled', text: 'Hanging on to the other nine.' }], next: 'h05' },
    h05: { scene: hollow('wide', rim(false), { marks: 4 }),
      say: [{ who: 'tallyheart', text: 'So a nine is one less than a ten. One claw tucked in. Touch each cat, and tuck one in.' }],
      skip: { table: 9, groups: 5, tuck: true, who: RIM, thing: 'claw', things: 'claws', keep: true, prompt: '**Tap** the cats, left to right.', next: 'h06' } },
    h06: { scene: hollow('wide', rim(true), { marks: 4 }),
      say: [{ who: 'tallyheart', text: 'FORTY-FIVE! Five cats, nine lives each.' }, { who: 'tallyheart', text: 'Five tens make fifty. Tuck five in: forty-five. Five times nine makes forty-five.' }],
      counts: { set: 'ch05-nines', next: 'h07' } },
    h07: { scene: hollow('tree', []), caption: ['Tallyheart stretches up the leaning tree. A fifth claw mark.'], sfx: 'SKRITCH!',
      say: [{ who: 'tallyheart', text: 'Nine lives. That’s your fifth Count. And the trickiest one so far.' },
        { who: 'player', text: 'It’s only tens. With a claw tucked in.', when: { lessonClean: 'ch05-nines' } },
        { who: 'player', text: 'It’s tens. With a claw tucked in.', when: { not: { lessonClean: 'ch05-nines' } } },
        { who: 'tallyheart', text: 'That’s all a nine is.', when: { not: { lessonClean: 'ch05-nines' } } }], next: 'h08' },
    h08: { say: [{ who: 'tallyheart', text: 'Now go and ask your river. And stay on the otters’ raft. The marsh mud belongs to ReedClan.' }], next: 't01' }
  });
  /* ---- the roof, offered again: one frame, for a cat who has not met Squall, or met him here on an
   * earlier reading; chapter 4's roof frames, run here, their last one setting `ch5Roof` too */
  const roof = chapter4().frames;
  ['r01', 'r02', 'r03', 'r04', 'r05', 'r06'].forEach(id => { frames[id] = JSON.parse(JSON.stringify(roof[id])); });
  frames.r06.sets = { foundSquall: true, ch5Roof: true };
  frames.r06.skip.next = 'c01';
  Object.assign(frames, {
    t01: { when: { not: { foundSquall: true, ch5Roof: false } }, else: 'c01',
      scene: { set: 'tower', cam: 'up', opts: { light: true, roar: true }, cast: [me('lookup', 'foot')], fx: ['day'] },
      caption: [{ when: { foundSquall: false }, text: 'Sprinkle’s littlest brother is still up there.' },
        { when: { foundSquall: false, specialty: 'climbing' }, text: 'Balcony, balcony, balcony, roof. You could still climb that.' }],
      sfx: 'RAWWWRRR… hic!',
      choice: { options: [
        { label: 'Go up and find him. The river can wait a little.', labelWhen: [{ when: { ch5Roof: true }, label: 'Go up and see Squall again.' }], next: 'r01' },
        { label: 'Not today. Riffle is waiting.', labelWhen: [{ when: { ch5Roof: true }, label: 'Not today. He’s guarding.' }], next: 'n01' }
      ] } },
    n01: { scene: { set: 'tower', cam: 'balcony', opts: {}, cast: [{ who: 'waffles', pose: 'peer', mood: 'shout', at: 'railing' }], fx: ['day'] },
      say: [{ who: 'waffles', text: 'AGAIN, {petname}?', kind: 'shout' }], sfx: 'RAWWWRRR… hic!', next: 'c01' }
  });
  /* ---- the Crossing, and the Roar */
  Object.assign(frames, {
    c01: { scene: crossing('wide', [riffle('hug', 'raft-1', { holds: 'pole' }), { who: 'otter', variant: 1, pose: 'stand', mood: 'stern', at: 'rock-left' }, me('sit', 'shore')]),
      caption: ['At the Crossing, Riffle stands on the ferry raft, hugging a pole twice his size.'],
      say: [{ who: 'riffle', text: 'My RAFT!' }, { who: 'otter', text: 'MY raft. You hold the pole.' }], next: 'c02' },
    c02: { when: { ch5Roof: true }, say: [{ who: 'player', text: 'I found Squall! Sprinkle’s littlest brother! He sees two skinny shapes go to the tracks. Every night.', kind: 'whisper' },
      { who: 'riffle', text: 'The TRACKS? At NIGHT? Raft first.' }], next: 'c03' },
    c03: { scene: crossing('rocks', [{ who: 'otter', variant: 1, pose: 'stand', mood: 'stern', at: 'rock-left' }, me('sit', 'rock-right', { facing: 'left' })]),
      say: [{ who: 'otter', text: 'Every apprentice sits on my raft while a skymonster goes over. That’s the Roar. It’s the courage test.' }, { who: 'otter', text: 'Three rules: sit. Stay. No jumping in.' }],
      choice: { options: [{ label: '“What if I move?”', sets: {}, next: 'c04' }, { label: '“What if I sneeze?”', sets: {}, next: 'c04' }] } },
    c04: { say: [{ who: 'otter', text: 'Then you sit through it again tomorrow. Like Riffle. Eleven times.' }, { who: 'riffle', text: 'TEN!', kind: 'shout' }], next: 'c05' },
    c05: { scene: crossing('rocks', [{ who: 'tallyheart', pose: 'sit', mood: 'proud', at: 'rock-high', facing: 'left' }, me('sit', 'rock-right', { facing: 'left' })]),
      caption: ['And on the rocks sits Tallyheart.'], say: [{ who: 'tallyheart', text: 'A mentor never misses a first Roar.' }], next: 'c06' },
    c06: { scene: crossing('board', [], {}),
      caption: ['The raft sits low. And the water under it is wide, and deep.', { when: { worry: 'water' }, text: 'Your paws won’t move.' },
        { when: { specialty: 'swimming', not: { worry: 'water' } }, text: 'Your first paw goes in the river, to say hello.' },
        { when: { worry: 'water' }, text: 'That’s what she promised, on your very first night.' }],
      say: [{ who: 'tallyheart', text: 'One paw at a time. I’ll count.' }],
      skip: { table: 1, groups: 4, paws: 'board', teacher: 'tallyheart', carry: false, prompt: '**Tap** each paw onto the raft.', next: 'c07' } },
    c07: { say: [{ who: 'tallyheart', text: 'Four paws aboard. All there.' }, { who: 'tallyheart', text: 'Find me something truer than a fox’s story. For her.', kind: 'whisper', when: { ch3Told: true } }], next: 'c08' },
    c08: { when: { worry: 'water' }, caption: [{ when: { specialty: 'swimming' }, text: 'It isn’t one bit like a dripping tap.' }],
      say: [{ who: 'riffle', text: 'And if you fall in, I’ll have you out before your tail gets wet. Otter’s honor.' }], next: 'o01' },
    o01: { scene: river('wide', [me('sit', 'raft-1'), riffle('stand', 'pole')]), caption: ['Riffle pushes off, and the whole river shines. The glass towers stand on their heads in the water.'], next: 'o02' },
    o02: { scene: river('light', [], { plane: 'far' }), caption: ['Far down the river, a light. It grows. And grows.', 'It comes out very small.'],
      say: [{ who: 'riffle', text: 'SKYMONSTER!', kind: 'shout' }, { who: 'player', text: 'Airplane.' }], next: 'o03' },
    o03: { scene: river('log', [], { plane: 'none' }),
      say: [{ who: 'riffle', text: 'Sit STILL! I’m not allowed to hold your paw. But I’m right here.' }, { who: 'tallyheart', text: 'Nine claws in the log, {name}paw! One tucked for luck!' }],
      skip: { table: 1, groups: 9, paws: 'log', teacher: 'player', carry: false, prompt: '**Tap** to dig in your claws.',
        steps: [{ from: 1, opts: { plane: 'far' }, sfx: 'rrr…' }, { from: 4, opts: { plane: 'near' }, sfx: 'RRRrrr…' }, { from: 7, opts: { plane: 'over' }, sfx: 'RRRRRR…' }], next: 'o04' } },
    o04: { scene: river('sky', [], { plane: 'over' }), sfx: 'ROOOOOAAAAARRRRR!',
      caption: ['It sweeps right over you. The logs buzz. Your teeth buzz. Even your whiskers buzz.', { when: { worry: 'small' }, text: 'You’re the smallest thing on the whole wide river. You sit still anyway.' }],
      choice: { options: [{ label: 'Shut your eyes and count.', sets: {}, next: 'o05a' }, { label: 'Keep your eyes open and look up.', sets: {}, next: 'o05b' }] } },
    o05a: { say: [{ who: 'player', text: 'Ten. Twenty. Thirty. FORTY—' }], next: 'o06' },
    o05b: { scene: river('sky', [], { plane: 'over', face: true }), caption: ['Little round windows, all in a row. At one, a small face is pressed to the glass. You know that feeling.'], next: 'o06' },
    o06: { scene: river('raft', [me('sit', 'raft-1', { mood: 'scared', squeeze: true }), riffle('sit', 'raft-2')], { plane: 'gone' }),
      caption: [{ when: { specialty: 'sneaking' }, text: 'You’ve held still for socks. You can hold still for this.' }, 'You don’t move. Not an ear. Not one of nine claws.', 'Then it’s gone.'], next: 'o07' },
    o07: { scene: river('rocks', [riffle('scramble', 'raft-2')], { plane: 'gone' }), caption: ['On the rocks, otter tails go'], sfx: 'Slap! Slap! Slap!', say: [{ who: 'riffle', text: 'YOU DID IT!', kind: 'shout' }], next: 'o08' },
    o08: { scene: river('rocks', [{ who: 'tallyheart', pose: 'walk', mood: 'proud', at: 'far-rocks', facing: 'left' }], { plane: 'gone' }),
      caption: ['She turns for home.', { when: { specialty: 'friends' }, text: 'The old otter nods at you, once. You know a friend’s nod when you see one.' },
        { when: { worry: 'water' }, text: 'You look down. Still deep. You look at your paws. Still here.' }],
      say: [{ who: 'tallyheart', text: 'Not one claw! I counted!' }], next: 'o09' },
    o09: { scene: river('raft', [me('sit', 'raft-1'), riffle('whistle', 'raft-2')], { shiver: true }), caption: ['The river goes quiet. But the raft is still shivering. And still sitting too low.'], next: 'o10' },
    o10: { scene: river('raft', [me('sit', 'raft-1'), riffle('whistle', 'raft-2')], { shiver: true }), caption: ['It isn’t you. It isn’t Riffle. He’s whistling, and looking very hard at the sky.'],
      choice: { options: [
        { label: 'Lean over, and look under the raft.', labelWhen: [{ when: { foundPuddle: true }, label: 'Lean over, and say hello to Puddle.' }], next: 'ua1' },
        { label: 'Look up. Is another one coming?', labelWhen: [{ when: { foundPuddle: true }, label: 'Not now. He’s being a log.' }], next: 'o11' }
      ] } },
    o11: { caption: ['Only blue sky.'], say: [{ who: 'riffle', text: 'Rafts shiver. Ticklish logs. VERY ticklish.' }], next: 'w01' },
    w01: { scene: river('raft', [me('sit', 'raft-1'), riffle('stand', 'pole')], { bubbles: true }),
      say: [{ who: 'riffle', text: 'So who’s first? Otters HEAR everything. Patience the heron SEES everything.' }],
      choice: { options: [{ label: 'The ferry otters!', sets: { ch5First: 'otters' }, next: 'ha1' }, { label: 'Patience the heron!', sets: { ch5First: 'heron' }, next: 'm01' }] } }
  });
  /* ---- "Under the raft", written once and read in one of two places (after the Roar, or on the way
   * home after Riffle's slip, in late light): one Counts set, one card, the same sticky flag */
  function underRaft(p, next, late) {
    const sc = (cam, cast, opts) => river(cam, cast, Object.assign(late ? { late: true } : {}, opts || {}));
    const pud = (pose, mood) => ({ who: 'puddle', pose: pose, mood: mood || 'happy', at: 'beside' });
    const out = {};
    out[p + '1'] = { scene: sc('edge', [], { foot: true }),
      caption: ['You lean over the edge.', { when: { worry: 'water' }, text: 'The deep water is right under your nose. You look anyway.' }, 'Between two logs, a foot pokes up: blue-grey, and much too big. It wiggles.'], next: p + '2' };
    out[p + '2'] = { scene: sc('beside', [pud('head', 'worried')]), caption: ['Up pops a head.'], sfx: 'SPLOOSH!',
      say: [{ who: 'puddle', text: 'I’m not here. I’m a log.' }, { who: 'player', text: 'Logs don’t have feet.' }, { who: 'puddle', text: 'This one’s got four.' }], next: p + '3' };
    out[p + '3'] = { scene: sc('beside', [pud('head', 'wonder')]), caption: ['He sinks, blub, and pops up again.'],
      say: [{ who: 'player', text: 'Sprinkle sent me.' }, { who: 'puddle', text: 'SPRINKLE? Mama’s rule: strangers get a riddle!' }], counts: { set: 'ch05-puddle', next: p + '4' } };
    out[p + '4'] = { scene: sc('beside', [pud('head', 'happy'), riffle('hush', 'raft-2')]),
      say: [{ who: 'puddle', name: 'Puddle', text: 'I’m Puddle. The otters said: be a log. Till everybody stops shouting DRAGON. Logs get LOTS of fish.' }, { who: 'riffle', text: 'Granny only told me LAST NIGHT. I nearly popped!' }], next: p + '5' };
    out[p + '5'] = { scene: sc('beside', [pud('head', 'wonder')]),
      say: [{ who: 'puddle', name: 'Puddle', text: 'The storm rolled me right over a garden first. FLASH! A heap of mice. And something with clever little paws, picking them up. Very tidy.' }], next: p + '6' };
    out[p + '6'] = { scene: sc('beside', [pud('head', 'happy')]), card: 'puddle-paws',
      say: [{ who: 'player', text: 'Our PILE!' }, { who: 'puddle', name: 'Puddle', text: 'I said EEK. Then the river said SPLOOSH.' }], next: p + '7' };
    out[p + '7'] = { scene: sc('beside', [pud('pawup', 'happy')]), sets: { foundPuddle: true }, caption: ['He holds up a forepaw, and starts to sink.'],
      say: [{ who: 'puddle', name: 'Puddle', text: 'Mama says: stay where you land. So tell Sprinkle: five!' }],
      skip: { table: 5, groups: 1, who: [{ who: 'puddle' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: next } };
    return out;
  }
  Object.assign(frames, underRaft('ua', 'w01', false), underRaft('ub', 'hb1', true));
  /* ---- "What the otters heard", written once and read in one of two places: at the rocks right
   * after the Roar (she chose the otters), or at the Crossing on the way home (she chose the heron).
   * Tallyheart is in none of its frames: she went home after the Roar. */
  function otters(p, next, late, when, orElse) {
    const sc = (cam, cast, opts) => crossing(cam, cast, opts, late);
    const old = { who: 'otter', variant: 1, pose: 'stand', mood: 'solemn', at: 'rock-left' }, gossip = { who: 'otter', variant: 2, pose: 'sit', mood: 'happy', at: 'rock-right', facing: 'left' };
    const out = {};
    out[p + '1'] = Object.assign(when ? { when: when, else: orElse } : {}, { scene: sc('rocks', [gossip, old, me('sit', 'raft-1'), riffle('sit', 'raft-2')]),
      caption: [{ when: { ch5First: 'otters' }, text: 'Riffle pushes the raft back to the rocks.' }, { when: { ch5First: 'heron' }, text: 'At last, the Crossing again.' }],
      say: [{ who: 'player', text: 'What did you hear about the storm night?' }, { who: 'otter', text: 'A dragon as big as a bridge!' }],
      choice: { options: [{ label: '“Who told you that?”', sets: {}, next: p + '2a' }, { label: '“Did any of you SEE it?”', sets: {}, next: p + '2b' }] } });
    out[p + '2a'] = { scene: sc('rocks', [gossip]), say: [{ who: 'otter', text: 'A duck. A very honest duck.' }], next: p + '3' };
    out[p + '2b'] = { scene: sc('rocks', [gossip]), say: [{ who: 'otter', text: 'Well… no. A duck told me.' }], next: p + '3' };
    out[p + '3'] = { scene: sc('rocks', [old, me('sit', 'raft-1')]), card: 'otter-fox',
      say: [{ who: 'player', text: 'No bark for ducks.' }, { who: 'otter', text: 'The FOX told me himself. Twice. The dragon’s claws were full of mice. And off it flew.' }], next: p + '4' };
    out[p + '4'] = { when: { ch4CaughtFly: true }, caption: ['Flew. Again. You know a dragon who can’t.'], next: p + '5' };
    out[p + '5'] = { scene: sc('raft', [old], { tuft: true }), caption: ['He lifts the raft’s vine. Caught in it: a tuft of thin brown fur.'], say: [{ who: 'otter', text: 'And somebody’s been on my rocks in the dark.' }], next: p + '6' };
    out[p + '6'] = { scene: sc('raft', [old, riffle('sit', 'raft-2')], { tuft: true }),
      say: [{ who: 'riffle', text: 'Whose is it?' }, { who: 'otter', text: 'Not a dragon’s. Dragons don’t HAVE fur. …Probably.' }],
      scratch: { tap: 'fur', prompt: '**Tap** the fur to sniff it.', label: 'Sniff the fur.', miss: 'flutter…', next: p + '7' } };
    out[p + '7'] = { scene: sc('raft', [me('sniff', 'raft-1')], { tuft: true }), card: 'fur',
      caption: ['Somebody small.', { when: { ch5First: 'heron' }, text: 'Tiny prints there. Thin fur here. The same somebody?' }], next: next };
    return out;
  }
  Object.assign(frames, otters('ha', 'm01', false), otters('hb', 'b01', true, { ch5First: 'heron' }, 'b01'));
  /* ---- the marsh: everything happens from the raft */
  const onRaft = [me('sit', 'raft-1'), riffle('sit', 'raft-2')];
  Object.assign(frames, {
    m01: { scene: marsh('far', [{ who: 'clancat', variant: 2, pose: 'sit', at: 'log-1' }, { who: 'clancat', variant: 5, pose: 'sit', at: 'log-2' }, { who: 'clancat', variant: 6, pose: 'sit', at: 'log-3' }]),
      caption: ['The river slides into a wide, still marsh. In here, even the water whispers.', 'Far across it, three cats sit on a log. They don’t wave.'],
      say: [{ who: 'riffle', text: 'ReedClan. They always come in threes.', kind: 'whisper' }], next: 'm02' },
    m02: { scene: marsh('heron', [patience()].concat(onRaft), { dragonfly: 'beak' }), caption: ['In the shallows stands a tall grey-blue bird, on one leg. A dragonfly is asleep on her beak.'], next: 'm03' },
    m03: { scene: marsh('wide', [patience()].concat(onRaft), { dragonfly: 'beak' }),
      say: [{ who: 'riffle', text: 'That’s Patience. Two fish for every answer. Before the storm, it was ONE. Nobody knows why.', kind: 'whisper' }], next: 'm04' },
    m04: { scene: marsh('wide', [patience(), me('sit', 'raft-1'), riffle('hop', 'raft-2', { mood: 'wonder', glow: true })], { dragonfly: 'beak', owed: 0 }), caption: ['Riffle is bursting with questions.'],
      ask: { who: 'riffle', to: 'patience', prompt: '**Tap** Riffle to let one out.', next: 'm05', pairs: [
        ['Do you sleep standing up?', 'Yes.'], ['Is that leg tired?', 'No.'], ['Is that a dragonfly?', 'Yes.'], ['Do you see EVERYTHING?', 'Yes.'], ['Even at night?', 'Yes.'], ['Do you like otters?', 'Yes.'], ['Am I your favorite?', 'No.']] } },
    m05: { scene: marsh('wide', [patience('eye')].concat(onRaft), { dragonfly: 'beak', owed: 7 }),
      say: [{ who: 'patience', text: 'Seven answers.' }, { who: 'patience', text: 'Two fish for every answer.' }], counts: { set: 'ch05-otter', next: 'm06' } },
    m06: { scene: marsh('wide', [patience('feather')].concat(onRaft), { dragonfly: 'beak', owed: 7 }),
      caption: [{ when: { specialty: 'friends' }, text: 'One grey feather lifts. For Patience, that’s a grin.' }],
      say: [{ who: 'riffle', text: 'I was only saying HELLO!' }, { who: 'patience', text: 'You did not say hello. Hello is free.' }, { who: 'player', text: 'Hello, Patience.', when: { specialty: 'friends' } }], next: 'm07' },
    m07: { scene: marsh('heron', [patience('shut')].concat(onRaft), { dragonfly: 'beak', owed: 8 }), card: 'heron-no-moon', caption: ['The fox said the moon came out. So you check.'],
      say: [{ who: 'player', text: 'Was the moon out on the storm night?' }, { who: 'patience', text: 'No. The fish come up for the moon. That night, I went hungry.' }], next: 'm08' },
    m08: { scene: marsh('heron', [patience()].concat(onRaft), { dragonfly: 'beak', owed: 8 }), caption: [{ when: { worry: 'talk' }, text: 'You have a hundred questions. At two fish each, you pick one more.' }],
      choice: { options: [{ label: '“Who took our prey?”', sets: {}, next: 'm09a' }, { label: '“What did you SEE on the storm night?”', sets: {}, next: 'm09b' }] } },
    m09a: { scene: marsh('heron', [patience()].concat(onRaft), { dragonfly: 'beak', owed: 8 }), caption: ['So you ask what she SAW on the storm night.'],
      say: [{ who: 'patience', text: 'I do not guess. Guessing is for otters. That one is free.' }], next: 'm10' },
    m09b: { scene: marsh('heron', [patience('eye')].concat(onRaft), { dragonfly: 'beak', owed: 8 }), caption: ['One yellow eye turns to you.'], say: [{ who: 'patience', text: 'A good question.' }], next: 'm10' },
    m10: { scene: marsh('heron', [patience('eye')].concat(onRaft), { dragonfly: 'beak', owed: 9 }), card: 'heron-shapes',
      say: [{ who: 'patience', text: 'When the rain stopped: two small shapes, crossing my mud. Each one carrying something. I do not guess what.' }], next: 'm11' },
    m11: { when: { foundSquall: true }, say: [{ who: 'player', text: 'Just what Squall saw!', kind: 'whisper' }, { who: 'riffle', text: 'He saw them. She saw them. Same two shapes!', kind: 'whisper' }], next: 'm12' },
    m12: { scene: marsh('wide', [patience('point')].concat(onRaft), { dragonfly: 'beak', owed: 9, prints: true, tap: 'mud' }),
      say: [{ who: 'patience', text: 'They come back every night. They do not wipe their feet. That is not an answer. It is a complaint.' }],
      scratch: { tap: 'mud', prompt: '**Tap** the mud to look closer.', label: 'Look at the mud.', miss: 'ripple…', next: 'm13c' } },
    // the prints are two frames, as the gap is: for a climber a one-tap frame on the pole; both give the card
    m13c: { when: { specialty: 'climbing' }, else: 'm13', scene: marsh('mud', [riffle('stand', 'raft-2', { holds: 'pole' })], { prints: true, tap: 'pole' }), card: 'prints-marsh',
      caption: ['Tiny prints, in a line across the mud.', 'You hold your paw over one. It’s half the size of yours.'],
      scratch: { tap: 'pole', prompt: '**Tap** Riffle’s pole to run up it.', label: 'Run up the pole.', miss: 'wobble…', next: 'm14' } },
    m13: { when: { not: { specialty: 'climbing' } }, scene: marsh('mud', [], { prints: true }), card: 'prints-marsh',
      caption: ['Tiny prints, in a line across the mud.', 'You hold your paw over one. It’s half the size of yours.'], next: 'm15' },
    m14: { when: { specialty: 'climbing' }, scene: marsh('pole', [me('peer', 'pole-top')], { prints: true }), card: 'prints-tracks',
      caption: ['From the top, you see where the prints go: off toward the train tracks.'], next: 'm15' },
    // a frame only some cats read: a noticing cat, a cat who asked the otters first
    m15: { when: { not: { ch5First: 'heron', not: { specialty: 'noticing' } } },
      caption: [{ when: { specialty: 'noticing' }, text: 'The same tiny prints as behind the pile!' }, { when: { ch5First: 'otters' }, text: 'Thin fur there. Tiny prints here. The same somebody?' }], next: 'm16' },
    m16: { scene: marsh('wide', [patience('eye')].concat(onRaft), { dragonfly: 'beak', owed: 9 }), say: [{ who: 'patience', text: 'Seven answers for the otter. Two for the cat.' }], counts: { set: 'ch05-bill', next: 'm17' } },
    m17: { scene: marsh('wide', [patience(), me('sit', 'raft-1'), riffle('dive', 'raft-2')], { dragonfly: 'beak', pole: 'planted' }), sfx: 'SPLOOSH!', caption: ['He’s already diving.'],
      say: [{ who: 'player', text: 'Nine twos. Or two nines. Same eighteen!' }, { who: 'riffle', text: 'Back in eighteen fish!' }], next: 'm18' },
    m18: { scene: marsh('wide', [patience(), me('sit', 'raft-1')], { dragonfly: 'beak', pole: 'planted' }),
      caption: ['His pole stands in the mud, holding the raft still.', { when: { worry: 'water' }, text: 'Beside the mud, you can see the bottom. You look at it a lot.' }],
      choice: { options: [{ label: 'Sit still and watch the reeds, like Patience.', next: 'k01' }, { label: 'Count the fish for Riffle, out loud.', next: 'q01' }] } },
    q01: { scene: marsh('reeds', [patience('shut'), me('sit', 'raft-1', { mood: 'shout' })], { pole: 'planted', frogs: 'jump', pale: 'flinch' }),
      caption: ['Every frog jumps in. Patience shuts both eyes. One reed flinches.'], say: [{ who: 'player', text: 'ONE! TWO!', kind: 'shout' }], next: 'f01' },
    k01: { scene: marsh('reeds', [patience(), me('loaf', 'raft-1')], { pole: 'planted', dragonfly: 'beak', pale: 'reed' }), caption: ['Nothing happens. Now and then, a wet head pops up with a fish.'], next: 'k02' },
    k02: { scene: marsh('reeds', [patience(), me('loaf', 'raft-1')], { pole: 'planted', dragonfly: 'nose', pale: 'reed' }),
      caption: ['Then the dragonfly leaves Patience’s beak, and lands on your nose. You sat still through the Roar. You can sit still for a dragonfly.', { when: { specialty: 'sneaking' }, text: 'Sock-hunting, all over again.' }],
      choice: { options: [{ label: 'Keep still.', next: 'k03' }, { label: 'Enough! Count fish for Riffle.', next: 'q02' }] } },
    q02: { scene: marsh('reeds', [patience(), me('sit', 'raft-1', { mood: 'shout' })], { pole: 'planted', frogs: 'jump', dragonfly: 'none' }), caption: ['The dragonfly leaves. So do the frogs.'], say: [{ who: 'player', text: 'THREE!', kind: 'shout' }], next: 'f01' },
    k03: { scene: marsh('reeds', [patience(), me('loaf', 'raft-1')], { pole: 'planted', dragonfly: 'nose', pale: 'knees' }), caption: ['Still nothing. But one reed is paler than the others. And reeds don’t have knees.'],
      choice: { options: [{ label: 'Keep very, very still.', next: 'k04' }, { label: 'Enough! Count fish for Riffle.', next: 'q03' }] } },
    q03: { scene: marsh('reeds', [patience(), me('sit', 'raft-1', { mood: 'shout' })], { pole: 'planted', frogs: 'jump', pale: 'reed' }), caption: ['When you look back, every reed looks the same.'], say: [{ who: 'player', text: 'FIVE!', kind: 'shout' }], next: 'f01' },
    k04: { scene: marsh('reeds', [patience(), me('loaf', 'raft-1')], { pole: 'planted', dragonfly: 'nose', pale: 'blink' }), caption: ['The pale reed blinks.', 'It isn’t a reed. It’s a dragonet, pale as mist, standing on one leg.'], next: 'k05' },
    k05: { scene: marsh('wisp', [{ who: 'wisp', pose: 'shh', mood: 'shy', at: 'reed' }, patience()], { pole: 'planted' }),
      caption: ['She lays one claw across her snout.', 'Then, slowly, one pale claw draws in the mud.'],
      say: [{ who: 'patience', text: 'She believes she is a heron. I have not corrected her.' }, { who: 'player', text: 'Sprinkle sent me.', kind: 'whisper' }], counts: { set: 'ch05-wisp', next: 'k06' } },
    k06: { scene: marsh('wisp', [{ who: 'wisp', pose: 'nod', mood: 'shy', at: 'reed' }, patience()], { pole: 'planted' }),
      say: [{ who: 'patience', text: 'She fell into my reeds in the storm. She told me her name: Wisp. Not a word since. She stands well.' }], next: 'k07' },
    k07: { when: { foundPuddle: true }, scene: marsh('wisp', [{ who: 'wisp', pose: 'shh', mood: 'shy', at: 'reed' }, { who: 'puddle', pose: 'nostrils', mood: 'happy', at: 'raft-2' }], { pole: 'planted', snout: true }),
      caption: ['A blue-grey snout pokes up between the logs.', 'Wisp lays one claw across her snout.'],
      say: [{ who: 'puddle', name: 'Puddle', text: 'WISP?' }, { who: 'puddle', name: 'Puddle', text: 'I’m a LOG.', kind: 'whisper' }], next: 'k08' },
    k08: { caption: ['So THAT’s why it’s two.'], say: [{ who: 'patience', text: 'Two fish for every answer. One for me. One for her.' }], next: 'k09' },
    k09: { scene: marsh('draw', [{ who: 'wisp', pose: 'draw', mood: 'shy', at: 'reed' }], { pole: 'planted', drawing: 'fox' }), card: 'wisp-fox',
      caption: ['She draws again. A fox. Something small falling from its mouth, with shine lines. A ring of ripples.'], say: [{ who: 'player', text: 'Have you seen anything strange, Wisp?' }], next: 'k10' },
    k10: { scene: marsh('wisp', [{ who: 'wisp', pose: 'pawup', mood: 'shy', at: 'reed' }], { pole: 'planted' }), sets: { foundWisp: true },
      caption: ['Where it fell, there’s only deep green water now.', 'Then Wisp holds up one forepaw. You can nearly see the reeds through it.'],
      skip: { table: 5, groups: 1, who: [{ who: 'wisp' }], thing: 'claw', things: 'claws', label: 'Tap her forepaw.', prompt: '**Tap** her forepaw.', carry: false, next: 'f01' } },
    f01: { scene: marsh('wide', [patience(), me('sit', 'raft-1'), riffle('scramble', 'raft-2')], { fish: 'strings', pole: 'planted' }), sfx: 'SPLOOSH!',
      caption: ['Riffle heaves four strings of fish onto the raft, puffing.', { when: { worry: 'shiny' }, text: 'They flash like silver. You try very hard not to stare.' },
        { when: { specialty: 'swimming', not: { worry: 'water' } }, text: 'You hook the last string aboard. A wet paw! You don’t mind one bit.' }],
      say: [{ who: 'riffle', text: 'What did I miss?' }, { who: 'player', text: 'A reed with knees.', when: { foundWisp: true } }, { who: 'player', text: 'Frogs.', when: { foundWisp: false } }],
      counts: { set: 'ch05-catch', next: 'f02' } },
    f02: { scene: marsh('wide', [patience('gulp')].concat(onRaft), { fish: 'spare', frogs: 'sit' }), sfx: 'Gulp. Gulp. Gulp.',
      caption: [{ when: { foundWisp: false }, text: 'Down go the fish.' }, { when: { foundWisp: true }, text: 'Down go the fish. One for Patience. One for Wisp.' }],
      say: [{ who: 'patience', text: 'I am full. You dive well, otter.' }], next: 'f03' },
    f03: { scene: marsh('heron', [patience('eye'), me('sit', 'raft-1'), riffle('groan', 'raft-2')], { fish: 'spare' }),
      say: [{ who: 'patience', text: 'One more answer. Free. Ask the one who never shuts his eyes.' }, { who: 'riffle', text: 'Snakes don’t have eyelids. She means COIL. That nosy old thing trades secrets like pebbles.' }], next: 's01' },
    // the slip: only for a cat who has not found Puddle
    s01: { when: { foundPuddle: false }, else: 'hb1', scene: river('raft', [me('sit', 'raft-1'), riffle('stand', 'pole', { holds: 'pole' })], { late: true }),
      say: [{ who: 'riffle', text: 'Heavy today. It’s because of Pud— PUDDLES. Raft puddles. Not a name.' }],
      choice: { options: [{ label: '“Riffle. What’s under the raft?”', next: 's02' }, { label: '“Puddles. Fine.”', next: 's03' }] } },
    s02: { scene: river('raft', [riffle('point', 'pole')], { late: true }), say: [{ who: 'riffle', text: 'I promised Granny I wouldn’t TELL. I’m only POINTING.' }], next: 'ub1' },
    s03: { scene: river('raft', [riffle('stand', 'pole')], { late: true, bubbles: true }), caption: ['Under the logs, something goes blub.'], say: [{ who: 'riffle', text: 'Best friend an otter ever had.' }], next: 'hb1' }
  });
  /* ---- the Old Bridge, the den, bedtime */
  Object.assign(frames, {
    b01: { scene: bridge('bank', [me('walk', 'bank-left'), riffle('swim', 'bank-right')]), caption: ['At the rocks, Riffle ties up the raft, and swims beside you up the river.', 'You purr at him the whole way.'],
      say: [{ who: 'riffle', text: 'Worth it.' }], next: 'b02' },
    b02: { scene: bridge('back', [], { eyes: 'sprinkle' }),
      caption: [{ when: { ch3Told: true }, text: 'Under the Old Bridge, two big eyes shine. They peek over Tallyheart’s branch.' },
        { when: { ch3Told: false }, text: 'At the Old Bridge, you check the bank first. No ginger ears. Under the bridge, two big eyes shine.' }],
      say: [{ who: 'sprinkle', text: 'Tell me EVERYTHING.' }], next: 'b03' },
    // the news: a line for each dragonet met today, or "anyone new" (with "And Squall." exactly when she met him in chapter 4)
    b03: { scene: bridge('back', [{ who: 'sprinkle', pose: 'sit', mood: 'wonder', at: 'dragon' }, me('sit', 'beside')]),
      say: [{ who: 'player', text: 'I didn’t find anyone new today.', when: NONE },
        { who: 'sprinkle', text: 'You will. You found me.', when: Object.assign({ foundSquall: false }, NONE) },
        { who: 'sprinkle', text: 'You will. You found me. And Squall.', when: Object.assign({ foundSquall: true }, NONE) },
        { who: 'player', text: 'I found your littlest brother. He says: five.', when: { ch5Roof: true } },
        { who: 'player', text: 'Puddle is under the otters’ raft. He says: five. Then he sank.', when: { foundPuddle: true } },
        { who: 'sprinkle', text: 'He does that.', when: { foundPuddle: true } },
        { who: 'player', text: 'Wisp is in the reeds, being a heron. She held up five.', when: { foundWisp: true } },
        { who: 'sprinkle', text: 'My pale sister is the best at hiding. You have to wait till she blinks.', when: NONE }], next: 'b04' },
    // the mud count: a forepaw for Sprinkle and for every dragonet she has ever met; only when she met one today
    b04: { when: ANY, scene: bridge('back', [{ who: 'sprinkle', pose: 'draw', mood: 'happy', at: 'dragon' }, me('sit', 'beside')], { mudPaws: 7 }),
      caption: ['Sprinkle has drawn her six little forepaws in the mud again. Now she draws one more.'], say: [{ who: 'sprinkle', text: 'Mine.' }],
      skip: { table: 5, paws: 'mud', teacher: 'sprinkle', thing: 'claw', things: 'claws', prompt: '**Tap** a forepaw for everyone you’ve found.',
        who: [{ who: 'sprinkle' }, { who: 'squall', when: { foundSquall: true } }, { who: 'puddle', when: { foundPuddle: true } }, { who: 'wisp', when: { foundWisp: true } }], next: 'b05' } },
    b05: { when: ANY, scene: bridge('back', [{ who: 'sprinkle', pose: 'sit', mood: 'happy', at: 'dragon' }, me('sit', 'beside')], { mudPaws: 7 }),
      say: [{ who: 'sprinkle', text: 'Mama’s count is coming back.', kind: 'whisper' },
        { who: 'sprinkle', text: 'But my pale sister is the best at hiding. You have to wait till she blinks.', when: { foundWisp: false } }], next: 'b06' },
    b06: { scene: bridge('back', [{ who: 'sprinkle', pose: 'check', mood: 'wonder', at: 'dragon' }, me('sit', 'beside')]), caption: ['Sprinkle looks down at her own enormous feet.'],
      say: [{ who: 'player', text: 'Somebody small crosses the marsh every night. With prints half the size of mine.' }, { who: 'sprinkle', text: 'Then they’re VERY small.' }], next: 'd01' },
    d01: { scene: den('outside', [{ who: 'tallyheart', pose: 'sit', mood: 'proud', at: 'entrance-right', facing: 'left' }, me('sit', 'entrance-left')], { moon: true }, 'dusk'), caption: ['At the den, Tallyheart is waiting.'],
      say: [{ who: 'tallyheart', text: 'Every warrior in this Clan has sat where you sat today. Glintstar. {Murmur}chime. Me.' }],
      choice: { options: [{ label: '“Did you jump in?”', sets: {}, next: 'd02' }, { label: '“Were you scared?”', sets: {}, next: 'd02' }] } },
    d02: { caption: ['She touches her nose to your ear.'], say: [{ who: 'tallyheart', text: 'I counted. Very loudly.' }, { who: 'tallyheart', text: 'And now you’ve sat there too.' }], next: 'd03' },
    d03: { when: { worry: 'water' }, say: [{ who: 'tallyheart', text: 'And the deep water?' }, { who: 'player', text: 'Still deep. I looked right at it.' }], next: 'd04' },
    // the telling: every cat reads it, with a pair of balloons more for a noticing cat and another for a climber
    d04: { caption: ['You tell her about the duck, the fur, the prints, and the two small shapes.'],
      say: [{ who: 'player', text: 'And the same tiny prints were behind OUR pile. Till a tail swept them.', when: { specialty: 'noticing' } }, { who: 'tallyheart', text: 'A thing to check.', when: { specialty: 'noticing' } },
        { who: 'player', text: 'And the prints run off toward the train tracks.', when: { specialty: 'climbing' } }, { who: 'tallyheart', text: 'A thing to check.', when: { specialty: 'climbing' } }], next: 'd05' },
    d05: { say: [{ who: 'player', text: 'And the fox says moon. The heron says no moon.' }, { who: 'tallyheart', text: 'Two stories. One sky. So who’s wrong?' }],
      choice: { options: [{ label: '“The fox!”', sets: {}, next: 'd06a' }, { label: '“I don’t know yet.”', sets: {}, next: 'd06b' }] } },
    d06a: { say: [{ who: 'tallyheart', text: 'Maybe. But a counting cat says: not yet.' }], next: 'd07' },
    d06b: { say: [{ who: 'tallyheart', text: 'Good. That’s the hardest thing to say.' }], next: 'd07' },
    d07: { caption: [{ when: { specialty: 'noticing' }, text: 'Waffles was up ALL night. With her nerves.' }],
      say: [{ who: 'tallyheart', text: 'One hole in his story for certain. Maybe two.', kind: 'whisper', when: { ch4CaughtFly: true, ch3Told: true } },
        { who: 'tallyheart', text: 'Then find me somebody else who was awake when the rain stopped.' }], next: 'd08' },
    d08: { when: ANY, caption: [{ when: { ch3Told: true }, text: 'Then you whisper the rest.' }, { when: { ch3Told: false }, text: 'You don’t tell her the rest. Your secret is getting bigger.' }],
      say: [{ who: 'tallyheart', text: 'That is a LOT of dragon. And a lot to check. Together.', when: { ch3Told: true } }], next: 'd09' },
    d09: { scene: den('nest', [me('lie', 'nest', { mood: 'sleepy' })]), sfx: 'SNNNRRRK.',
      caption: ['In your nest: skritch, skritch. Today’s bark goes along the mossy edge.', { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' }, { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' },
        'From the prey pile comes a small “Ow.” Then, a little later:'], next: 'd10' },
    d10: { scene: den('inside', [me('lie', 'nest', { mood: 'sleepy' }), { who: 'snorer', pose: 'lie', mood: 'sleepy', at: 'sleeper-1' }]),
      say: [{ who: 'snorer', text: '{name}paw? Did you really sit through the Roar?', kind: 'whisper' }, { who: 'player', text: 'Not one claw moved.' }, { who: 'snorer', text: '…Do the paw thing.' }], next: 'd11' },
    d11: { scene: den('nest', [me('lie', 'nest', { mood: 'sleepy' })]), say: [{ who: 'player', text: 'Nine. Eighteen. Twenty-seven…', kind: 'whisper' }],
      skip: { table: 9, groups: 5, thing: 'claw', things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', next: 'd12' } },
    d12: { caption: ['By forty-five, he’s snoring too.', { when: { foundSquall: false }, text: '…hic! Sprinkle’s littlest brother is still up there.' }], say: [{ who: 'snorer', text: 'That’s a NEW paw thing.' }], next: 'd13' },
    d13: { scene: { set: 'sky', cam: 'up', cast: [], fx: ['night', 'skyriver'] }, caption: ['Tomorrow: Coil. What does a nosy old snake want for a secret? You hope it isn’t fish.', 'Over the rosebush, the Sky River shines, and you fall asleep.'], next: 'd14' },
    d14: { caption: ['What did {name}paw dream about, the night {they} sat through the Roar?'], input: { kind: 'dream', next: 'd15' } },
    d15: { caption: ['End of Chapter Five.'], end: true }
  });

  return {
    id: 'ch05', number: 5, title: 'Riffle’s River', start: 'p01',
    names: { squall: 'The little dragon', puddle: 'The big-footed dragon' },
    cards: {
      'prints-pile': { mark: 'eye', line: 'Tiny prints in the dug earth behind the pile.' },
      'puddle-paws': { mark: 'ear', line: 'Puddle says clever little paws picked up mice on the storm night.', when: { foundPuddle: true } },
      'otter-fox': { mark: 'ear', line: 'The old otter says the fox told him the dragon story.' },
      fur: { mark: 'eye', line: 'Thin brown fur at the Crossing. Not cat. Not otter. Not fox.' },
      // four pairs lie touching, and none is a claim with its answer: a link names its partners itself
      'heron-no-moon': { mark: 'ear', line: 'Patience says there was NO moon on the storm night.', link: { with: ['fox-moon'], line: 'One of them is wrong.' } },
      'heron-shapes': { mark: 'ear', line: 'Patience says two small shapes crossed her mud, carrying something.', link: { with: ['squall-shapes'], line: 'Two saw them. The same two shapes?' } },
      'prints-marsh': { mark: 'eye', line: 'Tiny prints in the marsh mud. Much smaller than a cat’s.', link: { with: ['prints-pile'], line: 'The same prints.' } },
      'prints-tracks': { mark: 'eye', line: 'The tiny prints run toward the train tracks.', link: { with: ['squall-shapes'], line: 'Both lead toward the tracks.' } },
      'wisp-fox': { mark: 'ear', line: 'Wisp drew a fox dropping something glittering in the reeds.', when: { foundWisp: true } }
    },
    frames: frames,
    counts: {
      'ch05-pile': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'rows' },
        facts: [{ a: 3, b: 10, light: 'rows', check: true,
          prompt: [{ kind: 'caption', text: 'You walk along the rows. One full row. Two. Three. How many pieces in three rows of ten?' }], retryPrompt: 'Three rows of ten. How many pieces?' }],
        ask: '{a} × {b}', praise: [], ground: 'earth',
        helpIntro: ROW_HELP, helpIntroNotTen: ROW_ZERO,
        fillFrom: 'ch04-tens', fillOrder: 'easiest', avoid: [[5, 10], [4, 10]], fillIntro: 'One from yesterday.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', again: ['There it is. You remembered that one.'],
        done: null
      },
      'ch05-tens': {
        table: 10, thing: 'front claw', things: 'front claws', unit: 'cat', units: 'cats', teacher: 'tallyheart',
        facts: [[10, 7], { a: 5, b: 10, who: RIM, prompt: ['Five cats, ten front claws each. How many front claws?'], retryPrompt: true, right: ['Fifty!'], rightAgain: true }],
        // the hard slot is the first question here, and its `avoid` is its own: 4 × 10 may be the hard pick, never a borrowed one
        warmHard: { table: 10, at: 0, avoid: [[5, 10], [3, 10]] },
        avoid: [[5, 10], [3, 10], [4, 10]],
        fillFrom: 'ch04-tens', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
        ask: '{a} × {b}',
        praise: ['Yes! Ten front claws on every cat.', 'Hopping by tens, like a real hunter.', 'Tens are friendly, aren’t they?', 'Hop, hop, hop!', 'You hopped it!'],
        fast: ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.'],
        fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
        helpIntro: TENS_HELP, helpIntroFar: TENS_HELP.replace(/^Close\. /, ''),
        helpIntroNotTen: 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.',
        done: null
      },
      'ch05-nines': {
        table: 9, thing: 'life', things: 'lives', unit: 'cat', units: 'cats', teacher: 'tallyheart',
        label: 'Nine lives', hollowThings: 'nines',
        // the hop and the tuck, on every first ask and every retry; its own gaps filled with the easiest
        light: 'tuck', fillOrder: 'easiest',
        facts: [
          { a: 2, b: 9, who: RIM.slice(0, 2), right: ['Eighteen! Hop, then tuck.'], rightAgain: ['Eighteen! One and eight. There’s your nine.'] },
          { a: 9, b: 10, prompt: 'Ten cats. Ten tens make a hundred. Now tuck ten in.', retryPrompt: true, right: ['Ninety! Yesterday it was nine cats, ten claws each. Same ninety!'], rightAgain: true },
          { a: 4, b: 9, prompt: 'Four cats. Hop by tens. Then tuck four in.', retryPrompt: true,
            right: ['Thirty-six! Now look. Three and six make nine. {also}Every nines answer hides a nine!'],
            rightAgain: ['Thirty-six! Three and six. There’s your nine.'],
            miss: 'Thirty-six. Now look. Three and six make nine. {also}Every nines answer hides a nine! We’ll come back to that one.',
            missLast: 'Thirty-six. Now look. Three and six make nine. {also}Every nines answer hides a nine!',
            shows: { kind: 'answers', of: [[2, 9]], also: 'One and eight make nine. ' } },
          [9, 1],
          { a: 9, b: 6, prompt: 'Six cats. Six tens make sixty. Now tuck six in.', retryPrompt: true, right: ['Fifty-four! Five and four. There’s your nine.'], rightAgain: true },
          [3, 9], [9, 8], [5, 9], [7, 9],
          { a: 9, b: 9, right: [{ who: 'tallyheart', text: 'EIGHTY-ONE!' }, { who: 'murmurchime', text: 'Not mice.' }], rightAgain: true }
        ],
        firstPrompt: 'Two cats. Hop by tens: twenty. Now tuck two in. How many lives?',
        ask: '{a} × {b}',
        praise: ['Yes! Nine lives on every cat.', 'Tens, with a claw tucked in. That’s all a nine is.', 'You tucked it!', 'Hop, hop, tuck!', 'Hop, then tuck!'],
        fast: ['You didn’t even have to hop that time.', 'Quick as a pounce!', 'You knew that one before I finished asking.'],
        fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
        helpIntro: NINES_HELP, helpIntroFar: NINES_HELP.replace(/^Close\. /, ''),
        helpIntroTens: 'That’s the hop! Now the tuck: one claw in for every cat.',
        helpIntroOneTuck: 'So close! You tucked ONE claw. Tuck one in for every cat.',
        helpIntroNotNine: 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        done: 'That’s the nines.'
      },
      'ch05-otter': Object.assign({}, FISH, {
        table: 2, thing: 'fish', things: 'fish', unit: 'answer', units: 'answers',
        picture: { kind: 'fish', layout: 'pairs', thought: true },
        facts: [{ a: 7, b: 2, prompt: [{ who: 'riffle', text: 'How many fish is THAT?' }], retryPrompt: 'Seven answers, two fish for every answer. How many fish?',
          right: [{ who: 'riffle', text: 'FOURTEEN?' }, { who: 'riffle', text: 'For YES and NO?' }], rightAgain: true }],
        helpIntro: 'Scratch it on the log! Two for every answer.', fillFrom: 'ch02-ears'
      }),
      'ch05-bill': Object.assign({}, FISH, {
        table: 2, thing: 'fish', things: 'fish', unit: 'answer', units: 'answers',
        picture: { kind: 'fish', layout: 'pairs', thought: true },
        facts: [{ a: 9, b: 2, prompt: [{ who: 'patience', text: 'Nine answers.' }, { who: 'patience', text: 'Two fish for every answer.' }, { kind: 'caption', text: 'How many fish?' }],
          retryPrompt: 'Nine answers, two fish for every answer. How many fish?',
          right: [{ who: 'patience', text: 'Eighteen.' }, { who: 'patience', text: 'Before sunset.' }], rightAgain: true }],
        helpIntro: 'Scratch it on the log! Two for every answer.', fillFrom: 'ch02-ears', avoid: [[7, 2]]
      }),
      'ch05-catch': Object.assign({}, FISH, {
        table: 5, thing: 'fish', things: 'fish', unit: 'string', units: 'strings',
        picture: { kind: 'fish', layout: 'strings' }, light: 'groups',
        facts: [{ a: 4, b: 5, prompt: [{ kind: 'caption', text: 'Four strings, five fish on every string. How many fish?' }], retryPrompt: true,
          right: [{ who: 'riffle', text: 'TWENTY!' }, { who: 'player', text: 'Eighteen for Patience. Two to spare.' }], rightAgain: true }],
        helpIntro: 'Scratch it on the log! Five for every string.', fillFrom: 'ch03-claws', avoid: [[5, 5]]
      }),
      'ch05-puddle': {
        table: 10, thing: 'bump', things: 'bumps', unit: 'log', units: 'logs', teacher: 'puddle',
        picture: { kind: 'bumps' },
        facts: [{ a: 4, b: 10, prompt: 'Four logs in this raft. I’ve bumped my head ten times on every one. How many bumps?', retryPrompt: 'Four logs, ten bumps on every one. How many bumps?',
          right: [{ who: 'puddle', text: 'FORTY!' }, { who: 'puddle', text: 'No wonder it hurts.' }], rightAgain: true }],
        // the help lights his own bump stars a log at a time, and she hops; nothing is scratched under a raft
        help: 'picture', helpCounter: 'you', helpIntro: 'Count my bumps! You hop!',
        fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', avoid: [[4, 10], [5, 10]], fillIntro: 'Do another one!',
        againIntro: 'My bumps again!',
        ask: '{a} × {b}',
        praise: ['YES!', 'You’re GOOD at bumps!'], again: ['You DID it!'],
        miss: 'There! Let’s do that one again.', missLast: 'There! All my bumps, counted.',
        done: null
      },
      'ch05-wisp': {
        // a silent set: nobody speaks in it but Patience, once; every other line is a caption
        table: 1, thing: 'leg in the water', things: 'legs in the water', unit: 'heron', units: 'herons', teacher: 'caption',
        picture: { kind: 'herons' },
        facts: [{ a: 7, b: 1, prompt: [{ kind: 'caption', text: 'Seven herons, each standing on one leg. How many legs in the water?' }], retryPrompt: true,
          right: [{ kind: 'caption', text: 'She nods. Once.' }], rightAgain: true }],
        help: 'picture', helpCounter: 'you', helpSays: 'patience', helpIntro: 'Look again. One leg each.',
        fillFrom: 'ch01-tails', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', avoid: [[1, 1], [4, 1]], fillIntro: 'She draws another one.',
        againIntro: 'She taps the seven herons again.',
        ask: '{a} × {b}',
        praise: [], again: ['She nods.'],
        miss: 'She points at them again.', missLast: 'She counts them with you, one by one.',
        done: null
      }
    },
    book: {
      title: '{name}paw’s First Moon',
      recap: [
        { text: 'On {name}paw’s fourth morning, the old tom was guarding the pile with his eyes shut and a snail on his ear, and four more pieces were gone: sixteen in four nights.' },
        { text: 'Tallyheart taught {name}paw {their} fifth Count, nine lives: a ten with one claw tucked in.' },
        { when: { ch5Roof: true }, text: 'On the roof of {their} old tower, {they} found Squall, the littlest dragonet, who told {them} about two skinny shapes that go to the tracks every night.' },
        { text: '{name}paw sat through the Roar, the apprentices’ courage test, on the otters’ raft, and did not move one of nine claws. Tallyheart counted.' },
        { when: { foundPuddle: true }, text: 'Under the raft {they} found Puddle, who has four big feet and says he is a log. Puddle saw clever little paws picking up mice on the storm night.' },
        { text: 'The old ferry otter said the fox had told him the dragon story, twice, and showed {name}paw a tuft of thin brown fur.' },
        { text: 'Patience the heron said there was no moon on the storm night, and that two small shapes crossed her mud. There were tiny prints in it. It cost eighteen fish.' },
        { when: { foundWisp: true }, text: '{name}paw sat still until a pale reed blinked. It was Wisp, who stands on one leg like a heron, and drew a fox dropping something glittering in the reeds.' },
        { when: ANY, text: 'Under the Old Bridge, Sprinkle lit a forepaw for everyone found so far. Mama’s count is coming back.' },
        { text: 'That night, Tallyheart said every warrior has sat through the Roar. She counted through hers, very loudly.' }
      ],
      noDream: '{name}paw’s dream that night floated off down the river.',
      dragonet: [
        { id: 'puddle', name: 'Puddle', when: { foundPuddle: true }, pose: 'head',
          lines: ['Blue-grey, with feet much too big for him. He says he is a log.', '{name}paw found him under the otters’ ferry raft. Mama says: stay where you land.', 'He says five, and then he sinks. He always pops up again. Five more claws, counted.'] },
        { id: 'wisp', name: 'Wisp', when: { foundWisp: true }, pose: 'blink',
          lines: ['So pale you can nearly see the reeds through her. She thinks she is a heron.', '{name}paw found her in Patience’s reeds, by keeping very, very still.', 'She stands on one leg, and draws what she has seen. Five more claws, counted.'] }
      ]
    },
    teaser: { title: 'Chapter 6: The Snake in the Stones', lines: ['Tomorrow, you ask a nosy old snake what a secret costs.', 'And Tallyheart counts out guards for the pile.'] }
  };
}

chapters.chapter3 = chapter3;
chapters.chapter4 = chapter4;
chapters.chapter5 = chapter5;
module.exports = chapters;
