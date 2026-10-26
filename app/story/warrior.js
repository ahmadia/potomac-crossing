/* The Warrior Counts: the story around the test (docs/warrior-counts.md, v0.4; README decisions 48
 * and 49).
 *
 * Not a chapter: `PC.warrior`, never `PC.story.*`, so E.chapters, the storyboards of chapters 1 to 10
 * and the goldens never see it. It opens once chapter 10 is finished (`after`) and is taken from the
 * hub. She sits where {Murmur}paw sat in chapter 3 (`f016` to `f024`): the camp, Glintstar on the
 * fountain (`fountain-top`), our cat at chapter 3's foot of the fountain (`FOOT`), Tallyheart right
 * beside her (`BESIDE`, a point; the sand is drawn only for a miss), and {Murmur}chime at the front of
 * the crowd.
 * Glintstar asks every question; Tallyheart praises, notices and scratches out a miss.
 *
 * The shape (section 7, "The story file"):
 *
 *   after      'ch10'.
 *   scene      the question panel, the same for all 55 questions. It is written with the crowd
 *              (`crowd: true`), and the page draws it with `crowd` as the sitting's `st.crowd`: the
 *              whole Clan watches until she has a finished sitting, then the camp is quiet (decision 49).
 *   open       `first`, `again`, `quiet`: lists of frames, the opening of a sitting (E.warriorOpen
 *              says which); `resume`: the runner's `intro` (a list of one balloon) over the question a
 *              sitting picks up at.
 *   aside      `late`, `practice`: Tallyheart's line, said once when the sitting before was set aside.
 *              It goes at the start of her balloon on the opening's one panel (`again` or `quiet`),
 *              before "Every Count, same as before." (a sitting set aside has answers in it, so it is
 *              an attempt, and the next opening is never `first`).
 *   halfway    one frame, after the 28th answer; written with the crowd, drawn like `scene` (`crowd`
 *              as `st.crowd`). Its one button, "Keep going", is the page's.
 *   beats      `{ 14: [lines], 42: [lines] }`: Tallyheart's words at those pauses, in order (the
 *              positions are E.WARRIOR_BEATS'; 28 is `halfway`).
 *   pass, notYet, afterPass
 *              the result's frames. Each is `{ frames, <variant>: frame, … }`: `frames` is the list
 *              played in order (Next, and the big Back); an entry is a frame, or a slot
 *              `{ by: [variant keys], else?: frame }`, which plays the frame under the key that
 *              E.warriorResult's variant names (the first of `by` it names), else its `else`, else
 *              nothing. The keys: `pass.clean` (55 right) and `pass.quiet` (a pass in a quiet sitting:
 *              she had a finished sitting before it, so the Clan comes running); `notYet.first`,
 *              `second`, `later` (which not-yet it is); `notYet.better`, `close`, `plain` (Tallyheart's
 *              number, only when it is good news; the slot's `else` is 45 or 46 right, no better than
 *              last time: the number and nothing more); `afterPass.clean` (55) and `afterPass.number`
 *              (50 to 54: her number is good news; the slot's `else`, under 50, says none). Never by
 *              `when`: E.matches reads flags and looks, not an attempt. Every frame here is drawn as
 *              written.
 *   counts     the sitting's lines, Tallyheart's: `praise`, `fast` (about one right answer in five gets
 *              a word: blank entries between the lines), `remembered`, `rememberedSlow` (four each, in
 *              turn, a blank between: every other hard fact she gets right gets a word), `missLast`
 *              (four, in turn), and 10 × 10's own (`last`: its `prompt`, the caption and Glintstar's
 *              balloon; its `right`, our cat's shout; its `missLast`). No `fastAfterMiss`, no help
 *              openings (each anchor Count's own).
 *
 * Frames follow the frame contract (docs/build.md, "The frame": `scene`, `board`, `caption`, `say`)
 * and have no interaction key: the page plays each list with Next and Back, and puts its own buttons
 * on the last. A balloon with `chips: true` has her missed pairs written out under it, in Andika
 * ("7 × 8 = 56"), up to six, the named Counts' first; its `one`, when it has one, is its words over a
 * single chip ("This was the tricky one.").
 *
 * Tokens: the cat's own ({name}, {petname}, {Murmur}/{murmur}; no pronoun is needed, she is "you")
 * and the result's, filled first by the engine in number words (E.countWords): {right} and {Right}
 * (right answers), {last} and {Last} (her last finished sitting's), {short} (50 less {right}), and
 * {tricky}, the one or two Counts her misses fall in ("the 7s and the 8s"). {Right} and {Last} start
 * a sentence. Text conventions as the chapters': second person, present tense, typographic
 * apostrophes and quotes, morning light. No new art: the camp, the crowd, the cats, the old tom.
 * tests/warrior-story.test.js checks all of this.
 */
(function (root) {
  var PC = root.PC || (root.PC = {});

  /* One cast member: who, pose, mood, anchor, facing, plus optional extras. */
  function c(who, pose, mood, at, facing, extra) {
    var o = { who: who, pose: pose };
    if (mood) o.mood = mood;
    o.at = at;
    o.facing = facing;
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) o[k] = extra[k];
    return o;
  }
  /* One scene: set, camera, options, cast, effects. */
  function S(set, cam, opts, cast, fx) {
    return { set: set, cam: cam, opts: opts || {}, cast: cast || [], fx: fx || [] };
  }

  // the whole Clan crowded round the fountain (chapter 3's), and the quiet camp
  var CROWD = { crowd: true };
  var QUIET = {};
  // chapter 3's foot of the fountain, in the clear space in front of the basin, under Glintstar (the
  // camp's `fountain-foot` anchor sits left of the basin); and Tallyheart's place right beside it
  var FOOT = { x: 760, y: 860 };
  var BESIDE = { x: 950, y: 872 };
  // the tower's balcony keeps the wind chime from chapter 3 on
  var TOWER = { chime: true };
  // the walk toward the Hollow, at the camp's edge among the ferns: our cat a step ahead, Tallyheart
  // just behind; then the two of them sitting there, face to face
  var WALK_YOU = { x: 1420, y: 935 }, WALK_TALLY = { x: 1250, y: 880 };
  var SIT_YOU = { x: 1250, y: 930 }, SIT_TALLY = { x: 1440, y: 920 };
  // where {Murmur}chime comes to sit, close, on a quiet morning
  var CLOSE = { x: 1130, y: 880 };

  // Glintstar on the fountain; our cat at its foot; Tallyheart beside her; {Murmur}chime at the front
  function glint(mood, extra) { return c('glintstar', 'sit', mood, 'fountain-top', 'left', extra); }
  function you(mood, extra) { return c('player', 'sit', mood, FOOT, 'right', extra); }
  function tally(mood, extra) { return c('tallyheart', 'sit', mood, BESIDE, 'left', extra); }
  function chime(mood, extra) { return c('murmurchime', 'sit', mood, 'crowd-right', 'left', extra); }

  /* ------------------------------------------------------------------ the question panel */

  var scene = S('camp', 'crowd', CROWD, [glint('neutral'), you('neutral'), tally('kind'), chime('happy')], ['morning']);

  /* ------------------------------------------------------------------ the openings */

  var first = [
    {
      scene: S('camp', 'reveal', CROWD, [glint('solemn'), you('wonder'), chime('happy')], ['morning']),
      board: 'WIDE. The whole Clan crowds in rows around the old fountain in the morning sun, every cat turned toward it, with Glintstar on top, as on the day Murmurpaw was tested. This time it is our cat who sits alone in the clear space at the fountain’s foot, small and very still. Caption top left, over the towers.',
      caption: ['The whole Clan crowds around the fountain. This time, you sit at its foot.']
    },
    {
      scene: S('camp', 'crowd', CROWD, [glint('solemn'), you('happy'), tally('kind'), chime('laugh')], ['morning']),
      board: 'MEDIUM. Big ginger Tallyheart settles down right beside our cat at the fountain’s foot, close enough to touch, and our cat leans a little toward her. At the front of the crowd Murmurchime grins a wide, friendly grin. One caption at the top.',
      caption: ['Tallyheart sits down right beside you.']
    },
    {
      scene: S('camp', 'fountain-close', CROWD, [glint('solemn')], ['morning']),
      board: 'CLOSE-UP, LOW ANGLE. Glintstar on the fountain top, head and shoulders, pale eyes calm and steady, saying the rule once, in the same words as on Murmurpaw’s morning. No gesture, only the words. Her balloon fills the space beside her.',
      say: [{ who: 'glintstar', text: 'To become a warrior, a cat answers every Count up to ten times ten, and gets nine in every ten right.' }]
    },
    {
      scene: S('camp', 'crowd', CROWD, [glint('solemn'), you('neutral'), tally('kind'), chime('happy')], ['morning']),
      board: 'MEDIUM. Tallyheart leans down to our cat at the fountain’s foot and speaks for it alone, her torn ear tipped toward it, the crowd hushed behind. Our cat listens, ears forward. Her balloon small and quiet; the first question comes next.',
      say: [{ who: 'tallyheart', text: 'If one gets away from you, we’ll scratch it out together, like always. It won’t count as right. But it won’t stop you, either.', kind: 'whisper' }]
    }
  ];

  var again = [
    {
      scene: S('camp', 'reveal', CROWD, [glint('solemn'), you('neutral'), tally('kind'), chime('happy')], ['morning']),
      board: 'WIDE. Once more the whole Clan gathers in rows around the old fountain, Glintstar on top, our cat at its foot with Tallyheart beside it. Murmurchime waves her tail from the front of the crowd. Caption top left; Tallyheart’s balloon small and warm.',
      caption: ['The Clan gathers at the fountain again.'],
      say: [{ who: 'tallyheart', text: 'Every Count, same as before. I’m right here.' }]
    }
  ];

  var quiet = [
    {
      scene: S('camp', 'reveal', QUIET, [glint('neutral'), you('neutral'), tally('kind'), chime('happy'),
        c('clancat', 'loaf', 'sleepy', 'ferns', 'left', { variant: 2 }), c('clancat', 'walk', 'neutral', 'crowd-left', 'right', { variant: 4 })], ['morning']),
      board: 'WIDE, A QUIET MORNING. The camp goes about its day: one cat dozes in the ferns and another pads past a den, and nobody crowds the fountain. Glintstar waits on top, our cat sits at its foot with Tallyheart beside it, and Murmurchime has come to watch. Caption top left; Tallyheart’s balloon small and warm.',
      caption: ['The camp is quiet. Glintstar waits on the fountain, and {Murmur}chime comes to watch.'],
      say: [{ who: 'tallyheart', text: 'Every Count, same as before. I’m right here.' }]
    }
  ];

  var resume = [{ who: 'tallyheart', text: 'Where were we? Ah, yes.' }];

  var aside = {
    late: 'It’s been a while, so we start fresh.',
    practice: 'You’ve been practicing, so we start fresh.'
  };

  /* ------------------------------------------------------------------ halfway, and the pauses */

  var halfway = {
    scene: S('camp', 'crowd', CROWD, [glint('kind'), you('happy'), c('tallyheart', 'crouch', 'happy', BESIDE, 'left', { tailUp: true }),
      c('murmurchime', 'stand', 'happy', 'crowd-right', 'left', { tailUp: true })], ['morning']),
    board: 'MEDIUM. Halfway: Murmurchime stands with her tail straight up, and Glintstar looks down from the fountain, kind. Beside our cat, Tallyheart stretches long and low, front paws out and tail up, to show how. Two balloons; one button under the panel.',
    say: [
      { who: 'glintstar', text: 'Halfway, {name}paw.' },
      { who: 'tallyheart', text: 'Big stretch first. Front paws out, tail up. Like this.' }
    ]
  };

  var beats = {
    14: ['One paw done. Your whiskers are wide awake now.'],
    42: ['Three paws done. Just one more paw.']
  };

  /* ------------------------------------------------------------------ the pass */

  var named = {
    scene: S('camp', 'fountain-close', QUIET, [glint('kind')], ['morning', 'glow']),
    board: 'CLOSE-UP, LOW ANGLE, A PASS. Glintstar looks down from the fountain top with a rare small smile, and the morning light rings around her, as on Murmurpaw’s morning. She only speaks: no touch, no ceremony gesture. Her balloon beside her.',
    say: [{ who: 'glintstar', text: '{name}paw. Every Count up to ten times ten, and {right} of them right.' }]
  };
  var named55 = {
    scene: S('camp', 'fountain-close', QUIET, [glint('kind')], ['morning', 'glow']),
    board: 'CLOSE-UP, LOW ANGLE, ONLY FOR A PASS WITH EVERY ONE RIGHT. Glintstar looks down from the fountain top with a rare small smile, and the morning light rings around her, brighter than ever. She only speaks: no touch, no ceremony gesture. Her balloon beside her.',
    say: [{ who: 'glintstar', text: '{name}paw. Every Count up to ten times ten. Every one. Not one missed. Like {Murmur}chime.' }]
  };
  var running = {
    scene: S('camp', 'reveal', QUIET, [glint('kind'), you('wonder'), tally('happy'), c('murmurchime', 'stand', 'shout', 'crowd-right', 'left'),
      c('clancat', 'run', 'happy', 'entrance', 'right', { variant: 1 }), c('clancat', 'run', 'happy', 'ferns', 'left', { variant: 3 }),
      c('clancat', 'run', 'happy', 'crowd-left', 'right', { variant: 5 })], ['morning']),
    board: 'WIDE, ONLY FOR A PASS IN A QUIET SITTING. Murmurchime throws back her head and yowls to the whole camp, and from every den and fern the Clan comes running toward the fountain. Our cat sits at the foot, amazed. Caption top left.',
    caption: ['{Murmur}chime yowls, and the whole Clan comes running.']
  };
  var tails = {
    scene: S('camp', 'reveal', CROWD, [c('glintstar', 'stand', 'kind', 'fountain-top', 'left'), you('happy'), tally('happy', { tailUp: true }),
      chime('happy', { tailUp: true })], ['morning', 'sparkle']),
    board: 'WIDE, A PASS. The whole Clan crowds around the fountain, and every tail goes straight up, Tallyheart’s and Murmurchime’s first, little sparkles of joy over the crowd. Later art: every crowd tail raised. Glintstar stands tall on top; caption top left, her balloon proud.',
    caption: ['Every tail in the crowd goes straight up.'],
    say: [{ who: 'glintstar', text: 'Tonight, the Clan gathers again. For your warrior name.' }]
  };
  var waffles = {
    scene: S('tower', 'balcony', TOWER, [c('waffles', 'peer', 'shout', 'railing', 'left')], ['morning']),
    board: 'MEDIUM, CUTAWAY, A PASS. Far above camp, Princess Waffles leans over her balcony railing, mouth wide, bow askew, the little wind chime swaying beside her geranium. Caption top left; her shout jagged.',
    caption: ['Far above, Princess Waffles leans over the railing.'],
    say: [{ who: 'waffles', text: 'Did {petname} PASS? Somebody TELL me, darlings!', kind: 'shout' }]
  };

  var pass = {
    frames: [{ by: ['clean'], else: named }, { by: ['quiet'] }, tails, waffles],
    clean: named55,
    quiet: running
  };

  /* ------------------------------------------------------------------ the not-yet */

  var NOT_YET = { who: 'glintstar', text: 'Not yet, {name}paw. The Counts will wait for you.' };
  var notFirst = {
    scene: S('camp', 'crowd', CROWD, [glint('kind'), you('wonder'), tally('kind'), chime('happy'),
      c('grizzled', 'sit', 'laugh', 'crowd-left', 'right')], ['morning']),
    board: 'MEDIUM, ONLY FOR A FIRST NOT-YET. Glintstar speaks kindly from the fountain to our cat at its foot, with the whole Clan around. Then from the front of the crowd the grizzled old tom calls out much too loudly, grinning, and our cat turns to him in surprise. Two balloons, both plain, as his lines are in chapters 3 to 6.',
    // (a plain balloon: a shout is lettered all in capitals, and his one capital word would stand out from nothing)
    say: [NOT_YET, { who: 'grizzled', text: 'Took me THREE tries. Don’t tell anyone.' }]
  };
  var notSecond = {
    scene: S('camp', 'crowd', QUIET, [glint('kind'), you('neutral'), tally('kind'), c('murmurchime', 'sit', 'kind', CLOSE, 'left')], ['morning']),
    board: 'MEDIUM, ONLY FOR A SECOND NOT-YET. On a quiet morning Glintstar speaks kindly from the fountain, and Murmurchime, sitting close beside our cat and Tallyheart, leans in like a denmate sharing a secret. Two balloons, hers warm.',
    say: [NOT_YET, { who: 'murmurchime', text: 'I {murmur}ed mine in the den every night, remember? You heard me.' }]
  };
  var notLater = {
    scene: S('camp', 'crowd', QUIET, [glint('kind'), you('neutral'), tally('kind'), c('murmurchime', 'sit', 'happy', CLOSE, 'left')], ['morning']),
    board: 'MEDIUM, ONLY FROM A THIRD NOT-YET ON. On a quiet morning Glintstar speaks kindly from the fountain, and Murmurchime, sitting close beside our cat and Tallyheart, gives a firm, friendly nod. Two balloons, hers warm and sure.',
    say: [NOT_YET, { who: 'murmurchime', text: 'The Counts aren’t going anywhere. And neither am I.' }]
  };

  // Tallyheart walks our cat toward the Hollow; her number only when it is good news
  function walk(mood, text, board) {
    return {
      scene: S('camp', 'ferns', QUIET, [c('player', 'walk', mood, WALK_YOU, 'right'), c('tallyheart', 'walk', 'kind', WALK_TALLY, 'right')], ['morning']),
      board: board,
      caption: ['Tallyheart walks with you toward the Hollow.'],
      say: [{ who: 'tallyheart', text: text }]
    };
  }
  var GOOD = '{Right} right today. Fifty is a pass.';
  var newsGood = walk('happy', GOOD,
    'MEDIUM, ONLY FOR FORTY-FIVE OR FORTY-SIX RIGHT, NO BETTER THAN LAST TIME. Our cat pads through the ferns at the edge of camp toward the Hollow, Tallyheart a step behind with her head bent to it, warm. Caption top left; her balloon short.');
  var newsBetter = walk('happy', GOOD + ' Last time it was {last}!',
    'MEDIUM, ONLY WHEN SHE GOT MORE RIGHT THAN LAST TIME. Our cat pads through the ferns at the edge of camp toward the Hollow, Tallyheart a step behind with her head bent to it, delighted. Caption top left; her balloon bright.');
  var newsClose = walk('happy', GOOD + ' So close. Just {short} more next time.',
    'MEDIUM, ONLY FOR FORTY-SEVEN TO FORTY-NINE RIGHT, NO BETTER THAN LAST TIME. Our cat pads through the ferns at the edge of camp toward the Hollow, Tallyheart a step behind with her head bent to it, warm and sure. Caption top left; her balloon short.');
  var newsPlain = walk('neutral', 'You worked hard on every one.',
    'MEDIUM, ONLY FOR FEWER THAN FORTY-FIVE RIGHT, NO BETTER THAN LAST TIME. Our cat pads through the ferns at the edge of camp toward the Hollow, Tallyheart a step behind with her head bent to it, warm and proud of it. Caption top left; her balloon short, with no number in it.');
  var tricky = {
    scene: S('camp', 'ferns', QUIET, [c('player', 'sit', 'neutral', SIT_YOU, 'right'), c('tallyheart', 'pawup', 'kind', SIT_TALLY, 'left')], ['morning']),
    board: 'MEDIUM TWO-SHOT. At the edge of camp, near the Hollow, Tallyheart sits with one forepaw raised, as if counting, and our cat sits facing her. Under her first balloon the tricky ones are written out, each with its answer; her second balloon sends them both to practice.',
    say: [
      { who: 'tallyheart', text: 'These were the tricky ones.', chips: true },
      { who: 'tallyheart', text: 'Let’s practice {tricky} in the Training Hollow. I’ll ask those first. Then try again, whenever you like.' }
    ]
  };

  var notYet = {
    frames: [{ by: ['first', 'second', 'later'], else: notLater }, { by: ['better', 'close', 'plain'], else: newsGood }, tricky],
    first: notFirst,
    second: notSecond,
    later: notLater,
    better: newsBetter,
    close: newsClose,
    plain: newsPlain
  };

  /* ------------------------------------------------------------------ after the pass */

  // her number only when it is good news (decision 49): a passing score, 50 to 54, says it; under 50, none
  var againRight = {
    scene: S('camp', 'crowd', QUIET, [glint('kind'), you('happy'), tally('kind'), chime('happy')], ['morning']),
    board: 'MEDIUM, AFTER THE PASS, ONLY WITH FIFTY TO FIFTY-FOUR RIGHT. On a quiet morning Glintstar looks down from the fountain, pleased, at our cat sitting at its foot, with Tallyheart beside it and Murmurchime watching. Under Tallyheart’s balloon the tricky ones are written out, each with its answer.',
    say: [
      { who: 'glintstar', text: '{Right} right, {name}paw. Your pass is yours for good.' },
      { who: 'tallyheart', text: 'These were the tricky ones.', one: 'This was the tricky one.', chips: true }
    ]
  };
  var againPlain = {
    scene: S('camp', 'crowd', QUIET, [glint('kind'), you('neutral'), tally('kind'), chime('happy')], ['morning']),
    board: 'MEDIUM, AFTER THE PASS, WITH FEWER THAN FIFTY RIGHT. On a quiet morning Glintstar looks down from the fountain, warm and steady, at our cat sitting at its foot, with Tallyheart beside it and Murmurchime watching. Her balloon has no number in it; under Tallyheart’s the tricky ones are written out, each with its answer.',
    say: [
      { who: 'glintstar', text: 'Your pass is yours for good, {name}paw.' },
      { who: 'tallyheart', text: 'These were the tricky ones.', chips: true }
    ]
  };
  var again55 = {
    scene: S('camp', 'crowd', QUIET, [glint('kind'), you('happy'), tally('happy'), chime('happy', { tailUp: true })], ['morning', 'glow']),
    board: 'MEDIUM, AFTER THE PASS, ONLY WITH EVERY ONE RIGHT. On a quiet morning Glintstar looks down from the fountain with a rare small smile, the light ringing around her, and Murmurchime’s tail goes straight up. Our cat sits at the foot beside Tallyheart, beaming.',
    say: [{ who: 'glintstar', text: 'Every one. Not one missed. Like {Murmur}chime.' }]
  };

  var afterPass = {
    frames: [{ by: ['clean', 'number'], else: againPlain }],
    clean: again55,
    number: againRight
  };

  /* ------------------------------------------------------------------ the sitting's lines */

  // about one right answer in five gets a word: each line `at` its place in a run of five, the rest
  // blank. The runner keeps a turn for each list (a quick answer takes the next `fast`, never two in a
  // row, else the next `praise`), so the praise lines start three in and the quick ones at once: for a
  // child who is always quick, always slow or anything steady between, two words never fall together
  function sparse(lines, at) {
    var out = [];
    lines.forEach(function (l) { for (var i = 0; i < 5; i++) out.push(i === at ? l : ''); });
    return out;
  }

  var counts = {
    praise: sparse(['Yes.', 'Good.', 'That’s it.', 'Steady paws.'], 3),
    fast: sparse(['Quick as a pounce!', 'Snap! Just like that.', 'Fast as a sparrow.', 'Sure and quick.'], 0),
    // her hard facts, right: four lines each, in turn (one turn shared by both lists, as the runner keeps
    // it), a blank between, so every other one gets a word and none comes back every few questions
    remembered: [
      'Last time, {a} × {b} made you stop and think. Not today!', '',
      '{a} × {b}! That one used to be tricky.', '',
      'No stopping on {a} × {b} this time.', '',
      'Quick! {a} × {b} used to take a while.', ''
    ],
    rememberedSlow: [
      '{a} × {b} again, and you got it. It’s getting easier.', '',
      'You worked out {a} × {b}. Good.', '',
      '{a} × {b} was tricky last time. You got it.', '',
      '{a} × {b}. It gets easier every time.', ''
    ],
    missLast: [
      'There. Now you’ve seen it. On we go.',
      'That’s a tricky one. On to the next.',
      'There it is. You’re doing fine. Keep going.',
      'Now it’s in the sand. On we go.'
    ],
    last: {
      prompt: [{ text: 'At last:', kind: 'caption' }, { who: 'glintstar', text: 'Ten times ten.' }],
      right: [{ who: 'player', text: 'A HUNDRED!', kind: 'shout' }],
      missLast: 'There. A hundred. And that’s every Count!'
    }
  };

  PC.warrior = {
    after: 'ch10',
    scene: scene,
    open: { first: first, again: again, quiet: quiet, resume: resume },
    aside: aside,
    halfway: halfway,
    beats: beats,
    pass: pass,
    notYet: notYet,
    afterPass: afterPass,
    counts: counts
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
