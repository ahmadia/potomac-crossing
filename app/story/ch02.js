/* Chapter 2: After the Storm.
 *
 * The approved text (docs/chapters/02-after-the-storm.md, v0.5) cut into graphic-novel panels,
 * per the frame contract in docs/build.md (its last section, "Chapter 2 (v0.3)", for what is new).
 * Each frame is one moment: a drawn scene, a written storyboard (`board`) for a future
 * illustrator, short captions, speech balloons and sound effects, and exactly one interaction.
 * Frame ids run in reading order; a short choice's branch frames carry a letter, one per option
 * (f031a, f031b), and rejoin at the next number. The path choice (f084) splits the chapter in two
 * long branches that run side by side under the same numbers: the Old Bridge is `a` (f085a…f101a),
 * the river is `b` (f085b…f097b), and both go on to f102, "Home".
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line that reacts
 * to a balloon goes in the next panel, and a choice's spoken option is not echoed as a balloon
 * (the label already said it). A line the text marks [if …] carries a `when`.
 *
 * Text conventions: second person, present tense ("you"); typographic apostrophes and quotes
 * (’ “ ” …) so nothing needs escaping. Time of day comes from fx: `morning` in camp, `day` on
 * the walk, `sunset` on the way home, `night` in the den, and no moon (the den's `moon` is off).
 * tests/story-ch02.test.js checks all of this; tools/storyboard.mjs turns it into
 * docs/storyboard/ch02.md.
 */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.story = PC.story || {};

  /* One cast member: who, pose, mood, anchor, facing, plus optional size/variant. */
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

  /* The five soggy cats drying on the hollow's rim, left to right (the skip-count's `who`, too):
   * four Clan cats and, fifth, the grizzled old tom. `old` is false once he has stalked off. */
  var RIM = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 },
    { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  // In the `lesson` camera the cats at `sand-left` and `sand-right` sit right in front of `rim-2` and
  // `rim-4`, so `close` leaves those two out (they are hidden there anyway). `flat`: the old tom's
  // ears laid flat (cats.js `flatEars`), as he is after being counted.
  function rim(old, oldMood, close, flat) {
    var out = [c('clancat', 'sit', 'stern', 'rim-1', 'right', { variant: 1 })];
    if (!close) out.push(c('clancat', 'loaf', 'sleepy', 'rim-2', 'right', { variant: 2 }));
    out.push(c('clancat', 'sit', 'stern', 'rim-3', 'left', { variant: 3 }));
    if (!close) out.push(c('clancat', 'sit', 'sleepy', 'rim-4', 'left', { variant: 5 }));
    if (old) out.push(c('grizzled', 'sit', oldMood || 'stern', 'rim-5', 'left', flat ? { flatEars: true } : null));
    return out;
  }
  // Scene options that stay the same through a place
  var DEN_AM = { weather: 'clear', drips: true };
  // At night Riffle's stone lies in her nest: between her paws at f108, where she looks at it and
  // picks its place; from then on where she put it (`stone: 'auto'`: E.resolveScene fills it from
  // the choice's `ch2Stone`, 'nose' or 'chin')
  var DEN_PM = { weather: 'clear', moon: false, stone: 'auto' };
  var DEN_STONE = { weather: 'clear', moon: false, stone: true };
  var GARDEN = { dish: true, towel: true };
  var CAMP = { puddles: true, rainFountain: true };
  var HOLLOW1 = { marks: 1, glow: 'auto' };
  var HOLLOW2 = { marks: 2, glow: 'auto' };
  var PILE = { pairs: 8, dug: true };
  // The Old Bridge from the bank and at the mouth of the dark: no drag marks. They lie in the dark
  // under the deck (the `under` and `back` cameras keep the set's default), and they are the bridge
  // path's own find (f088a), so neither path sees them from outside.
  var BANK = { drag: false };
  var BANK_TRAIN = { train: true, drag: false };

  var frames = {

    /* ------------------------------------------------------------------ The morning after */

    f001: {
      scene: S('den', 'nest', DEN_AM,
        [c('player', 'curl', 'sleepy', 'nest', 'right')], ['morning']),
      board: 'CLOSE-UP. Morning in the apprentices’ den: our cat is curled tight in its moss nest, eyes screwed shut, as one fat raindrop falls from a rose leaf and lands right on its nose with a tiny splash. Sun spots dapple the moss, and every leaf above is dripping. The two small drips are lettered pale and the big PLIP! lands right at the nose.',
      caption: ['A cold raindrop lands on your nose.'],
      sfx: 'Drip. Drip. PLIP!',
      next: 'f002'
    },

    f002: {
      scene: S('den', 'inside', DEN_AM,
        [c('player', 'sit', 'worried', 'nest', 'left', { size: 1.3 }), c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'),
         c('mutterer', 'curl', 'sleepy', 'sleeper-2', 'left')], ['morning', 'zzz']),
      board: 'MEDIUM, INSIDE THE DEN. Our cat sits up in its nest with a startled look down at its own tummy, while a little thought bubble shows a full food bowl from the old life behind the glass. The two other apprentices sleep on in their nests, and morning light pours through the doorway onto puddles on the floor. The rumble is lettered big and wobbly across the bottom of the panel.',
      caption: ['That’s your tummy. It still thinks breakfast comes in a bowl.'],
      sfx: 'GRRRRMMMBLE!',
      next: 'f003'
    },

    f003: {
      scene: S('den', 'doorway', DEN_AM,
        [c('tallyheart', 'crouch', 'happy', 'doorway', 'left'), c('player', 'sit', 'wonder', 'nest', 'right')], ['morning']),
      board: 'MEDIUM, FROM INSIDE THE DEN. Tallyheart’s big ginger head pokes in through the bright doorway, whiskers wet, torn ear perked, grinning; our cat looks up from its nest at left. Behind her the morning is washed clean and sparkling with drops. Caption top left; her cheerful balloon beside her head.',
      caption: ['A big ginger head pokes in at the doorway.'],
      say: [{ who: 'tallyheart', text: 'Morning, {name}paw! Seven puddles between here and the Training Hollow. I counted. Now go get a drink.' }],
      next: 'f004'
    },

    /* ------------------------------------------------------------------ The dish on the step */

    f004: {
      scene: S('garden', 'hedge', {},
        [c('player', 'walk', 'happy', 'hedge-gap', 'left')], ['morning', 'sparkle']),
      board: 'MEDIUM. Our cat squeezes out of the low tunnel in the hedge, back into its old garden, leaves shaking down drops onto its fur. The morning light is pale gold and everything glistens after the storm. Caption top left, over the wet leaves.',
      caption: ['You slip through the hedge to your old garden.'],
      next: 'f005'
    },

    f005: {
      scene: S('garden', 'step', GARDEN,
        [c('player', 'stand', 'wonder', 'lawn', 'left')], ['morning', 'sparkle']),
      board: 'MEDIUM, AT CAT HEIGHT. The patio step and the tall glass door, still open a crack, with a neatly folded towel waiting on the step beside the blue dish. Our cat stands on the wet lawn looking at it all, touched. Caption along the top, with room around the towel.',
      caption: ['The glass door is still open a crack, and a folded towel waits on the step, in case you come home soggy.'],
      next: 'f006'
    },

    f006: {
      scene: S('garden', 'step', GARDEN,
        [c('player', 'flat', 'happy', 'step', 'right')], ['morning', 'sparkle']),
      board: 'CLOSE-UP. Our cat crouches on the step and laps from its old blue dish, brim-full of rainwater, eyes closed in happiness. A ripple spreads across the water and the sky shines in it. One caption at the top, quiet and warm.',
      caption: ['Your dish is full of rain. It tastes like home.'],
      next: 'f007'
    },

    f007: {
      scene: S('tower', 'up', {},
        [c('waffles', 'peer', 'shout', 'railing', 'left')], ['morning']),
      board: 'LOW ANGLE, TALL PANEL. From the garden we look straight up the glass tower in the morning sun: nineteen floors up, a tiny fluffy white head pokes over a balcony railing, mouth wide open. The tower glass reflects clean blue sky and the last scraps of storm cloud. Caption at the bottom; the shout balloon’s tail runs all the way up to her.',
      caption: ['A voice shrieks from nineteen floors up.'],
      say: [{ who: 'waffles', text: '{petname}! DARLING! You’re ALIVE!', kind: 'shout' }],
      next: 'f008'
    },

    f008: {
      scene: S('garden', 'step', GARDEN,
        [c('player', 'lookup', 'happy', 'step', 'right')], ['morning', 'sparkle']),
      board: 'LOW ANGLE. Our cat sits on the patio step beside the dish and the towel, head tipped right back, calling up toward the tower with its chest puffed out a little. The open crack of the glass door glows behind. Its balloon rises out of the top of the panel.',
      say: [{ who: 'player', text: 'I’m {name}paw now, Waffles.' }],
      next: 'f009'
    },

    f009: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'sit', 'shout', 'railing', 'left')], ['morning']),
      board: 'MEDIUM. Waffles sits on her balcony with one paw pressed to her chest like a stage actress, her fur still frizzed from a sleepless night. The city behind her is rinsed bright, with puddles shining on the rooftops. Two balloons stack down the right, the second one jagged with capitals.',
      say: [
        { who: 'waffles', text: 'Of course you are, {petname}.' },
        { who: 'waffles', text: 'I was up ALL night with my nerves! The THUNDER! That CRASH!' }
      ],
      next: 'f010'
    },

    f010: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'fall', 'dreamy', 'railing', 'left', { lift: true })], ['morning']),
      board: 'MEDIUM, COMEDY BEAT. Waffles has flopped onto her back on her pink pouf by the railing, paws in the air and one paw across her forehead, her upside-down face clear above the rail. A small inset above her shows last night’s sky: stars and clouds, and no moon at all. Caption top left; her balloon floats over her fluffy tummy.',
      caption: ['Waffles flops onto her back.'],
      say: [{ who: 'waffles', text: 'And not a sliver of moon all night long, darling. I couldn’t even see my own bow.' }],
      next: 'f011'
    },

    f011: {
      scene: S('tower', 'balcony-close', {},
        [c('waffles', 'loaf', 'proud', 'railing', 'left')], ['morning']),
      board: 'CLOSE-UP. Waffles’ flat face on the railing, one paw patting the pink bow on her head, eyes half closed with relief. The bow is a little squashed but definitely there. Caption top left, her small balloon beside the bow.',
      caption: ['She pats it.'],
      say: [{ who: 'waffles', text: 'Still there.' }],
      next: 'f012'
    },

    f012: {
      scene: S('garden', 'hedge', {},
        [c('tallyheart', 'walk', 'happy', 'hedge-gap', 'left')], ['morning', 'sparkle']),
      board: 'MEDIUM. Tallyheart shoulders her way out of the hedge gap, wet leaves sticking to her ginger fur, already bright and busy. The garden behind our cat’s point of view sparkles. Caption top left; her balloon short and brisk.',
      caption: ['Tallyheart pushes through the hedge.'],
      say: [{ who: 'tallyheart', text: 'There you are. Counts!' }],
      next: 'f013'
    },

    f013: {
      scene: S('tower', 'balcony-close', {},
        [c('waffles', 'loaf', 'dreamy', 'railing', 'left')], ['morning']),
      board: 'CLOSE-UP, CUTAWAY. Waffles rests her chin on the railing with a long, tragic sigh, drawn as a little puff of breath. She waves one paw down at the garden, like a queen sending a knight off to war. Caption top left, her balloon soft.',
      caption: ['Waffles sighs.'],
      say: [{ who: 'waffles', text: 'Duty calls, darling.' }],
      next: 'f014'
    },

    /* ------------------------------------------------------------------ Ears */

    f014: {
      scene: S('hollow', 'wide', HOLLOW1,
        [c('tallyheart', 'walk', 'happy', 'sunpatch', 'right'), c('player', 'walk', 'wonder', 'sunpatch-2', 'right')], ['morning', 'sparkle']),
      board: 'WIDE. The Training Hollow after the rain: the wet sand glitters, drops sparkle on every root and leaf, and the old leaning tree still wears its one claw mark. Tallyheart and our cat pad in from the left. Caption top left, in the bright morning sky.',
      caption: ['The Training Hollow glitters after the rain.'],
      next: 'f015'
    },

    f015: {
      scene: S('hollow', 'lesson', HOLLOW1,
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'crouch', 'happy', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM, LESSON. Tallyheart and our cat face each other across the damp sand, Tallyheart flicking her tail like a teacher and our cat crouched forward, ready. For the warm-up, a picture of cats in a row, one tail each, appears above the sand; after a miss, she scratches one line per tail and counts them out. Her balloon at the top; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'First, tails. To wake up your whiskers.' }],
      counts: { set: 'ch02-tails', next: 'f016' }
    },

    f016: {
      scene: S('hollow', 'lesson', HOLLOW1,
        [c('tallyheart', 'sit', 'happy', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart flicks both ears forward and back, drawn with little motion ticks, as if showing them off; our cat tilts its head. Damp sand between them. Caption top left, then her balloon, then our cat’s small question.',
      caption: ['Tallyheart flicks her ears.'],
      say: [
        { who: 'tallyheart', text: 'Now: ears. Every cat has two.' },
        { who: 'player', text: 'Why ears?' }
      ],
      next: 'f017'
    },

    f017: {
      scene: S('hollow', 'lesson', HOLLOW1,
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right', { size: 1.2 })], ['morning']),
      board: 'CLOSE-UP. Tallyheart leans in, amber eyes bright, and a small inset beside her shows the prey pile stacked in neat pairs. Her two ears, the ragged one and the whole one, are drawn just like the pairs in the inset. Her balloon beside her head.',
      say: [{ who: 'tallyheart', text: 'Because the hunters stack the prey pile in pairs. Two by two, like ears.' }],
      next: 'f018'
    },

    f018: {
      scene: S('hollow', 'wide', HOLLOW1, rim(true), ['morning', 'sparkle']),
      board: 'WIDE. Along the far rim of the hollow, five soggy cats sit in a row drying in the sun, every one fluffed up into a grumpy ball like a dandelion clock; the fifth, at the right end by the tree, is the grizzled old tom. Tallyheart and our cat watch from just out of the panel, so the five cats are the only cats in it. Caption across the top.',
      caption: ['Along the rim, five soggy cats sit drying in the sun, fluffed up like grumpy dandelions.'],
      next: 'f019'
    },

    f019: {
      scene: S('hollow', 'wide', HOLLOW1,
        rim(true).concat([c('tallyheart', 'stand', 'proud', 'tree-far', 'left', { size: 1.2 })]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. The five soggy cats on the rim, left to right, the fifth the grizzled old tom by the old tree, and Tallyheart standing on the far side of the trunk, apart from the row, ready to hop along with the count. In play the counting picture takes the panel: the same five cats in a row, the next one to tap glowing softly; each tap lights that cat’s two ears and a big number above the picture grows by two. Tallyheart’s balloon at the top; the count runs under each cat.',
      say: [{ who: 'tallyheart', text: 'Don’t count ears one by one. Hop by twos: two, four, six! Touch each cat, and hop with me.' }],
      skip: { table: 2, groups: 5, who: RIM, next: 'f020' }
    },

    f020: {
      scene: S('hollow', 'lesson', HOLLOW1,
        rim(true, 'stern', true, true).concat([c('tallyheart', 'sit', 'laugh', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM. Up on the rim, the grizzled old tom flattens both ears and glares down at our cat, and all ten ears in the row are still lit; a big 10 floats over the picture. Below, Tallyheart laughs out loud. Caption top left; her two balloons, the TEN! big and bold.',
      caption: ['The grizzled old tom flattens his ears at you.'],
      say: [
        { who: 'tallyheart', text: 'TEN!', kind: 'shout' },
        { who: 'tallyheart', text: 'Flat ears still count.' }
      ],
      next: 'f021'
    },

    f021: {
      scene: S('hollow', 'wide', HOLLOW1,
        rim(true).concat([c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 })]), ['morning']),
      board: 'WIDE. The five soggy cats sit in a row along the rim, the old tom at the end by the old tree, and only they are counted: Tallyheart sits apart on the far side of the trunk, bigger and nearer, and points her tail back along the row, cat by cat; our cat follows it from just out of the panel. Small 2s hang over the five cats like a sum written in the air. Her balloon at the top right, over her.',
      say: [{ who: 'tallyheart', text: 'Five cats, two ears each. Five times two makes ten.' }],
      next: 'f022'
    },

    f022: {
      scene: S('hollow', 'wide', HOLLOW1,
        rim(false).concat([c('grizzled', 'walk', 'stern', 'tree', 'right'), c('tallyheart', 'sit', 'kind', 'sunpatch', 'right'),
          c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. The grizzled old tom has climbed down off the rim and stalks away past the leaning tree toward camp, tail stiff and nose in the air. The four other soggy cats watch him go. Caption top left.',
      caption: ['The old tom stalks off toward camp.'],
      next: 'f023'
    },

    f023: {
      scene: S('hollow', 'lesson', HOLLOW1,
        rim(false, null, true).concat([c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'crouch', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM, LESSON. Tallyheart and our cat face each other over the sand for the new Count. For each question a picture of cats in a row, two ears each, appears above the sand; after a miss she scratches two short lines per cat, like a pair of ears, and hops along them two at a time. Caption at the top; the keypad sits below the panel.',
      caption: ['Tallyheart smooths the sand.'],
      counts: { set: 'ch02-ears', next: 'f024' }
    },

    f024: {
      scene: S('hollow', 'tree', HOLLOW2, [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score a second claw mark into the bark, right beside the first, curls of bark springing away. The first mark looks a little deeper and darker than the new one. The SKRITCH! runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'A second claw mark, right beside the first.'],
      sfx: 'SKRITCH!',
      next: 'f025'
    },

    f025: {
      scene: S('hollow', 'wide', HOLLOW2,
        rim(false).concat([c('tallyheart', 'sit', 'kind', 'tree', 'left'), c('player', 'lookup', 'wonder', 'sunpatch', 'right')]), ['morning', 'sparkle']),
      board: 'WIDE. The whole hollow in morning light, the two claw marks side by side on the old tree, the first one deeper. Tallyheart sits proud and kind at the foot of the trunk, and our cat gazes up at the marks. Her balloons rise along the trunk, the last one small.',
      say: [
        { who: 'tallyheart', text: 'Ears. That’s your second Count. And look: your first mark is a little deeper. That’s what practice does.' },
        { who: 'tallyheart', text: 'Tomorrow: claws.' }
      ],
      next: 'f026'
    },

    /* ------------------------------------------------------------------ The prey pile */

    f026: {
      scene: S('pile', 'wide', PILE,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('tallyheart', 'sit', 'kind', 'crowd-1', 'right'),
         c('grizzled', 'lie', 'proud', 'beside', 'left'), c('clancat', 'sit', 'neutral', 'crowd-2', 'left', { variant: 4 }),
         c('clancat', 'sit', 'happy', 'crowd-3', 'left', { variant: 2 })], ['morning']),
      board: 'WIDE. A shady corner of camp under a low arch of brambles, the dry fountain’s edge at right: the prey pile sits in the arch’s mouth, mice and voles drawn as soft round shapes with their tails tucked in and their eyes shut, stacked neatly two high. Clan cats hang about hungrily, and the grizzled old tom lies beside the pile. Captions top left.',
      caption: [
        'Under an arch of brambles is the prey pile. There are mice and voles with their tails tucked in, all stacked in pairs.',
        'It smells like breakfast.'
      ],
      next: 'f027'
    },

    f027: {
      scene: S('pile', 'low', PILE,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('tallyheart', 'sit', 'kind', 'beside', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT. Our cat and Tallyheart sit on either side of the pile under the bramble arch, eight neat stacks between them. Behind the pile is a small patch of soft, lumpy, freshly dug earth, easy to miss. A caption top left for the cat who notices; Tallyheart’s balloon at right.',
      caption: [{ when: { specialty: 'noticing' }, text: 'Behind the pile, the earth looks freshly dug. Rain, probably.' }],
      say: [{ who: 'tallyheart', text: 'Every morning an apprentice counts the pile. Today, that’s you.' }],
      next: 'f028'
    },

    f028: {
      scene: S('pile', 'low', PILE,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('grizzled', 'lie', 'proud', 'beside', 'left')], ['morning']),
      board: 'MEDIUM, THEN THE COUNTS. The grizzled old tom lies stretched beside the pile like a king on his treasure, chin up, eyes half closed; above his head a thought cloud shows last night’s pile under an evening sky with no moon, ten pairs high. Then the real pile, its stacks lit one at a time as our cat noses them, with no number shown. His balloon at top right; the keypad sits below the panel.',
      caption: ['The old tom lies beside the pile as if it’s treasure.'],
      say: [{ who: 'grizzled', text: 'My patrol stacked that last night, before the storm. Ten pairs. I bet a pillow cat doesn’t even know how many that is.' }],
      counts: { set: 'ch02-pile', next: 'f029' }
    },

    f029: {
      scene: S('pile', 'close', { pairs: 8, lit: 8, dug: true }, [], ['morning']),
      board: 'INSERT. The pile fills the panel, all eight stacks glowing warm gold, sixteen pieces in neat pairs. A faint ghost of the old tom’s thought cloud, ten stacks tall, hangs over it, and the gap between them is plain to see. Captions stacked at top left.',
      caption: ['Eight pairs. Sixteen.', 'You stop. Ten pairs, the old tom said. Ten pairs is twenty.'],
      next: 'f030'
    },

    f030: {
      scene: S('camp', 'entrance', CAMP,
        [c('player', 'sit', 'wonder', 'entrance', 'right', { size: 1.8 })], ['morning']),
      board: 'CLOSE-UP. Our cat’s face fills the panel, eyes wide and ears straight up, the moment the numbers don’t match. The camp behind is soft and blurred, with puddles shining. One caption, short and big; the choices sit below the panel.',
      caption: ['Sixteen is not twenty.'],
      choice: {
        options: [
          { label: 'Say it out loud: “There should be twenty!”', sets: { ch2SaidAloud: true }, next: 'f031a' },
          { label: 'Whisper it to Tallyheart.', sets: { ch2SaidAloud: false }, next: 'f031b' }
        ]
      }
    },

    f031a: {
      scene: S('pile', 'wide', PILE,
        [c('player', 'stand', 'shout', 'pile-left', 'right'), c('tallyheart', 'sit', 'wonder', 'crowd-1', 'right'),
         c('grizzled', 'lie', 'stern', 'beside', 'left'), c('clancat', 'sit', 'wonder', 'crowd-2', 'left', { variant: 4 }),
         c('clancat', 'stand', 'wonder', 'crowd-3', 'left', { variant: 2 }), c('glintstar', 'sit', 'neutral', 'fountain-edge', 'left')], ['morning']),
      board: 'WIDE. Our cat stands by the pile with its mouth wide open, and its voice is drawn as rings rolling out across the whole camp; every head turns, even Glintstar’s on the fountain’s edge. A startled bird flaps up out of the brambles. Caption top left.',
      caption: ['Your voice rings across camp, louder than you meant it to.'],
      next: 'f032'
    },

    f031b: {
      scene: S('pile', 'low', PILE,
        [c('player', 'sit', 'proud', 'pile-left', 'right'), c('tallyheart', 'stand', 'shout', 'beside', 'left')], ['morning']),
      board: 'MEDIUM. Our cat has just whispered in Tallyheart’s ear; now Tallyheart stands up tall beside the pile and booms it out to the whole camp, one paw pointing at our cat so everyone knows whose count it was. Our cat sits small and proud. Caption top left; her balloon big.',
      caption: ['Tallyheart tells the whole camp.'],
      say: [{ who: 'tallyheart', text: '{name}paw says there should be twenty!', kind: 'shout' }],
      next: 'f032'
    },

    f032: {
      scene: S('pile', 'wide', PILE,
        [c('player', 'sit', 'worried', 'pile-left', 'right'), c('tallyheart', 'sit', 'solemn', 'crowd-1', 'right'),
         c('grizzled', 'sit', 'stern', 'beside', 'left'), c('clancat', 'sit', 'solemn', 'crowd-2', 'left', { variant: 4 }),
         c('clancat', 'sit', 'solemn', 'crowd-3', 'left', { variant: 2 }), c('glintstar', 'sit', 'neutral', 'fountain-edge', 'left')], ['morning']),
      board: 'WIDE. Every cat around the pile has frozen mid-step and mid-chew, ears up, staring. Only the grizzled old tom moves: he sits up with a low growl, hackles prickling. Caption top left; his balloon spiky.',
      caption: ['All around the pile, cats go very still.'],
      say: [{ who: 'grizzled', text: 'Nonsense.' }],
      next: 'f033'
    },

    f033: {
      scene: S('pile', 'low', PILE,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('tallyheart', 'sit', 'kind', 'beside', 'left')], ['morning']),
      board: 'MEDIUM, THEN THE COUNTS. Tallyheart answers calmly beside the pile, one paw raised like a teacher, while the old tom glowers somewhere out of the panel. In the Counts picture the pile lights up again a new way: the eight top pieces as one row, then the eight bottom pieces as another. Her balloon at the top; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Then we check. The way a warrior does: the other way around.' }],
      counts: { set: 'ch02-check', next: 'f034' }
    },

    f034: {
      scene: S('pile', 'low', PILE,
        [c('grizzled', 'sit', 'stern', 'beside', 'left'), c('player', 'sit', 'neutral', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM. The grizzled old tom turns his back on the sum and on Tallyheart, grumbling into his whiskers, and shuffles closer to the pile. Our cat watches him go. His balloon small and gruff.',
      say: [{ who: 'grizzled', text: 'Tricks.' }],
      next: 'f035'
    },

    f035: {
      scene: S('pile', 'wide', PILE,
        [c('grizzled', 'crouch', 'solemn', 'beside', 'left'), c('player', 'sit', 'wonder', 'pile-left', 'right'),
         c('tallyheart', 'sit', 'kind', 'crowd-1', 'right'), c('snorer', 'stand', 'sleepy', 'crowd-3', 'left'),
         c('glintstar', 'sit', 'neutral', 'fountain-edge', 'left')], ['morning', 'zzz']),
      board: 'WIDE, COMEDY BEAT. The old tom crouches nose to the pile, tapping each piece one by one with a slow paw, a long trail of tiny numbers floating off behind him. Nearby, the skinny grey apprentice has fallen asleep standing up, head drooping, little zzz rising. Captions top left.',
      caption: ['He counts it himself, one piece at a time.', 'It takes so long that the skinny grey apprentice falls asleep standing up.'],
      next: 'f036'
    },

    f036: {
      scene: S('pile', 'low', PILE,
        [c('grizzled', 'sit', 'solemn', 'beside', 'left'), c('player', 'sit', 'wonder', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM. The old tom sits back from the pile at last, deadpan, whiskers drooping, as if the number tastes sour. Our cat waits politely. Two small balloons from him, each starting with a long pause.',
      say: [
        { who: 'grizzled', text: '…Sixteen.' },
        { who: 'grizzled', text: '…Hmph.' }
      ],
      next: 'f037'
    },

    f037: {
      scene: S('pile', 'low', PILE,
        [c('player', 'sit', 'worried', 'pile-left', 'right'), c('tallyheart', 'sit', 'solemn', 'beside', 'left')], ['morning']),
      board: 'MEDIUM. Tallyheart’s smile drops away and her face goes still and serious, ears level, while our cat looks up at her across the pile. The bramble shade feels a little darker. Caption top left; her balloon slow and heavy, the last word alone.',
      caption: ['Then Tallyheart stops smiling.'],
      say: [{ who: 'tallyheart', text: 'Twenty last night. Sixteen this morning. Four pieces of prey. Gone.' }],
      next: 'f038'
    },

    f038: {
      scene: S('camp', 'entrance', CAMP,
        [c('tallyheart', 'sit', 'kind', 'entrance', 'right', { size: 1.8 })], ['morning']),
      board: 'CLOSE-UP. Tallyheart’s face, amber eyes fixed on our cat, knowing and a little proud, the torn ear cocked. It is the same look she gave in the sandy hollow on the very first evening. Caption top left; her balloon beside her.',
      caption: ['She looks at you.'],
      say: [{ who: 'tallyheart', text: 'Remember? Know your Counts, and you can always tell when something’s missing.' }],
      next: 'f039'
    },

    f039: {
      scene: S('camp', 'fountain', CAMP,
        [c('glintstar', 'stand', 'stern', 'fountain-top', 'left')], ['morning']),
      board: 'LOW ANGLE. Glintstar rises to her paws on the old fountain, its basins brimming with rainwater that mirrors the sky, her silver fur bright in the morning sun. She looks down over the whole camp. Caption top left; her balloon cool and clear.',
      caption: ['Glintstar stands up on the fountain.'],
      say: [{ who: 'glintstar', text: 'Not one cat noticed, except the newest.' }],
      next: 'f040'
    },

    f040: {
      scene: S('camp', 'crowd', CAMP,
        [c('clancat', 'stand', 'worried', 'crowd-left', 'right', { variant: 2 }), c('clancat', 'sit', 'neutral', 'crowd-right', 'left', { variant: 4 }),
         c('player', 'sit', 'wonder', 'center', 'left'), c('glintstar', 'stand', 'solemn', 'fountain-top', 'left')], ['morning']),
      board: 'MEDIUM. A Clan cat at the edge of the crowd blurts out an explanation, paws spread, as if that settles it. The cats around it shuffle and nod uncertainly, and puddles shine between them. Its balloon at top left.',
      say: [{ who: 'clancat', text: 'The storm blew them away!' }],
      next: 'f041'
    },

    f041: {
      scene: S('pile', 'wide', PILE,
        [c('glintstar', 'stand', 'solemn', 'fountain-edge', 'left'), c('player', 'sit', 'wonder', 'pile-left', 'right'),
         c('tallyheart', 'sit', 'kind', 'crowd-1', 'right'), c('grizzled', 'sit', 'solemn', 'beside', 'left')], ['morning']),
      board: 'WIDE. The pile in plain view: eight stacks, every pair lined up perfectly straight, not a whisker out of place, while Glintstar looks down on it from the fountain’s edge. A few windblown leaves lie everywhere else in camp, but none on the pile. Caption top left; Glintstar’s balloon dry and level.',
      caption: ['But every stack is still neat, every pair lined up straight.'],
      say: [{ who: 'glintstar', text: 'The wind does not tidy up after itself.' }],
      next: 'f042'
    },

    f042: {
      scene: S('camp', 'crowd', CAMP,
        [c('snorter', 'stand', 'shout', 'center', 'left'), c('glintstar', 'stand', 'stern', 'fountain-top', 'left'),
         c('clancat', 'sit', 'scared', 'crowd-left', 'right', { variant: 3 }), c('mutterer', 'sit', 'scared', 'crowd-right', 'left')], ['morning']),
      board: 'MEDIUM, LOW ANGLE. The black-and-white apprentice bounces up in the middle of the crowd, eyes huge, paws flung wide, and the cats near him flinch; above them on the fountain Glintstar cuts him off with one stern look. His balloon wobbly and loud, hers flat and final.',
      say: [
        { who: 'snorter', name: 'An apprentice', text: 'Maybe whatever crashed in the river ATE them!', kind: 'shout' },
        { who: 'glintstar', text: 'Enough. We don’t blame what we haven’t seen.' }
      ],
      next: 'f043'
    },

    f043: {
      scene: S('camp', 'reveal', CAMP,
        [c('glintstar', 'sit', 'kind', 'fountain-top', 'left'), c('tallyheart', 'sit', 'proud', 'fountain-foot', 'right'),
         c('player', 'sit', 'wonder', 'center', 'left')], ['morning']),
      board: 'WIDE. The whole camp in fresh morning light, puddles everywhere, the fountain full of rain. Glintstar turns from the crowd to Tallyheart at the fountain’s foot, and our cat in the middle of the clearing perks up at the sound of its name. Caption top left; Glintstar’s balloon from the fountain top.',
      caption: ['She turns to Tallyheart.'],
      say: [{ who: 'glintstar', text: 'Walk the borders today, and take {name}paw.' }],
      next: 'f044'
    },

    f044: {
      scene: S('pile', 'low', { pairs: 8, dug: true, vole: true },
        [c('player', 'crouch', 'happy', 'pile-left', 'right'), c('tallyheart', 'sit', 'kind', 'beside', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart nudges one plump vole off the pile with her nose toward our cat, who crouches over it, delighted. The vole is a soft round cartoon shape with its eyes shut. Caption top left; her balloon warm.',
      caption: ['Tallyheart nudges a plump vole your way.'],
      say: [{ who: 'tallyheart', text: 'Counting cats eat first.' }],
      next: 'f045'
    },

    /* ------------------------------------------------------------------ The wall above the river */

    f045: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'walk', 'happy', 'wall', 'right'), c('player', 'walk', 'wonder', 'wall-2', 'right')], ['day']),
      board: 'WIDE. Tallyheart leads our cat along the top of an old stone wall high above the river, the whole territory spread out below in the sun: the Old Bridge far off at one end, the glass towers shining behind. Tallyheart’s tail sweeps out over it all like a map pointer. Caption top left; her balloon proud.',
      caption: ['Tallyheart leads you along an old stone wall above the river.'],
      say: [{ who: 'tallyheart', text: 'From the Old Bridge to the Barking Field, it’s all CrystalClan’s.' }],
      next: 'f046'
    },

    /* ------------------------------------------------------------------ The Old Bridge */

    f046: {
      scene: S('bridge', 'bank', BANK,
        [c('tallyheart', 'sit', 'solemn', 'reeds', 'left'), c('player', 'sit', 'wonder', 'bank-right', 'left')], ['day']),
      board: 'WIDE, FROM THE RIVERBANK. The Old Bridge by day: old stone legs, a long iron truss on top, the river brown and swirly after the storm. All along the bank the reeds are bent and broken flat, and Tallyheart sits among them looking hard at the damage, our cat beside her. Caption top left; her balloon low.',
      caption: ['At the Old Bridge, the reeds along the bank are bent and broken.'],
      say: [{ who: 'tallyheart', text: 'This is where the crash came from.' }],
      next: 'f047'
    },

    f047: {
      scene: S('bridge', 'bank', BANK,
        [c('tallyheart', 'stand', 'stern', 'reeds', 'right'), c('player', 'sit', 'wonder', 'bank-right', 'left')], ['day']),
      board: 'WIDE, FROM THE RIVERBANK. Tallyheart stands up among the broken reeds and points her long striped tail back at the deep, dark space under the bridge, very serious. Our cat sits beside her in the sunshine, peering past her into the dark. Caption top left; her balloon trails off into three dots.',
      caption: ['She points her tail at the dark under the bridge.'],
      say: [{ who: 'tallyheart', text: 'Best den on the whole river. And no cat goes under there. Not ever. Because…' }],
      next: 'f048'
    },

    f048: {
      scene: S('bridge', 'mouth', BANK_TRAIN,
        [c('player', 'stand', 'scared', 'sun', 'right'), c('tallyheart', 'sit', 'shout', 'edge', 'right')], ['day', 'motion']),
      board: 'MEDIUM, ACTION, AT THE MOUTH OF THE DARK. A long train clatters across the bridge right overhead, wheels and cars and grit shaking down; our cat has shot straight up in the air in the sunshine, every hair on end, and is landing facing the wrong way. Tallyheart carries on talking at the shadow’s edge. The big CLANKETY-CLANK! runs along the bridge, captions top left.',
      caption: ['A train clatters over the bridge, right above your heads. You jump so high you land facing the other way.'],
      sfx: 'CLANKETY-CLANK!',
      next: 'f049'
    },

    f049: {
      scene: S('bridge', 'mouth', BANK_TRAIN,
        [c('tallyheart', 'sit', 'shout', 'edge', 'right'), c('player', 'sit', 'scared', 'sun', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Tallyheart, mid-explanation, mouth wide open, one paw raised to make her point; but her words are squashed flat under the rumble of the train’s cars and wheels right overhead. Our cat sits with its back to her, ears pinned flat. The RUMMMBLE fills the top of the panel; caption at the bottom.',
      caption: ['Tallyheart’s mouth is still moving, but all you can hear is the train.'],
      sfx: 'RUMMMBLE-RUMMMBLE!',
      next: 'f050'
    },

    f050: {
      scene: S('bridge', 'mouth', BANK,
        [c('tallyheart', 'sit', 'proud', 'edge', 'right'), c('player', 'sit', 'solemn', 'sun', 'right')], ['day']),
      board: 'MEDIUM. The train is gone and the mouth of the dark is quiet again; Tallyheart sits back at the shadow’s edge, chin up, very pleased with herself, finishing her speech. Our cat still sits in the sun facing the wrong way. Caption top left; her balloon starts with three dots.',
      caption: ['Tallyheart looks very pleased with herself.'],
      say: [{ who: 'tallyheart', text: '…and THAT is the whole reason.' }],
      next: 'f051'
    },

    f051: {
      scene: S('bridge', 'mouth', BANK,
        [c('player', 'sit', 'solemn', 'sun', 'left', { size: 1.9 })], ['day']),
      board: 'MEDIUM CLOSE-UP. Our cat’s face, perfectly blank: level brows, half-closed eyes, ears a little askew from the noise. A tiny drift of grit settles on its head. One caption, small, in the corner.',
      caption: ['You didn’t hear a word.'],
      next: 'f052'
    },

    /* ------------------------------------------------------------------ The Barking Field */

    f052: {
      scene: S('field', 'wide', {},
        [c('dog', 'sit', 'neutral', 'field', 'left', { variant: 1 }), c('tallyheart', 'stand', 'stern', 'path-right', 'left'),
         c('player', 'walk', 'wonder', 'path-left', 'right')], ['day']),
      board: 'WIDE. The Barking Field: a muddy square of grass behind a tall wire fence, with a hollow log lying far inside it. Our cat pads along the path outside, and Tallyheart, a little ahead, stops and turns back to warn it, while a big shaggy shape sits far off in the field. Caption top left; her balloon firm.',
      caption: ['Next comes the Barking Field, behind a tall wire fence.'],
      say: [{ who: 'tallyheart', text: 'Dogs. They belong to Tallwalkers. Tall Ones, you’d say. We go AROUND. Always.' }],
      next: 'f053'
    },

    f053: {
      scene: S('field', 'wide', {},
        [c('dog', 'bounce', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'jump', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'bounce', 'shout', 'dog-3', 'left', { variant: 3 }), c('tallyheart', 'stand', 'solemn', 'path-right', 'left'),
         c('player', 'flat', 'scared', 'path-left', 'right')], ['day']),
      board: 'WIDE, ACTION. Three dogs come galloping across the field at the fence, ears flying, mud splashing; our cat flattens itself on the path. Tallyheart doesn’t even blink. Huge WOOFs burst across the whole panel.',
      sfx: 'WOOF! WOOF! WOOOOOF!',
      next: 'f054'
    },

    f054: {
      scene: S('field', 'dogs', {},
        [c('dog', 'jump', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'bounce', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'jump', 'shout', 'dog-3', 'left', { variant: 3 })], ['day']),
      board: 'MEDIUM, ACTION, FROM THE PATH. The three dogs bounce off the wire one after another, the fence bulging around each of them: a huge shaggy one, a spotty one, and a tiny one whose mouth is bigger than the rest of it. The sound effect hops along the fence; caption at the top.',
      caption: ['Three dogs bounce off the fence: a huge shaggy one, a spotty one, and a tiny one who is mostly bark.'],
      sfx: 'BOING! BOING! BOING!',
      next: 'f055'
    },

    f055: {
      scene: S('field', 'fence', {},
        [c('dog', 'jump', 'happy', 'dog-1', 'left', { variant: 1 }), c('player', 'sit', 'wonder', 'path-right', 'right'),
         c('tallyheart', 'sit', 'stern', 'path-left', 'right')], ['day']),
      board: 'CLOSE-UP ON THE WIRE. The shaggy dog squashes his big wet nose through a diamond of the fence, his tongue out and his eyes hidden under his fringe, right in front of our cat, with Tallyheart a step behind it. Our cat leans back, whiskers twitching. Caption top left, his balloon huge and friendly; the choices sit below the panel.',
      caption: ['The shaggy one squashes his nose through the wire.'],
      say: [{ who: 'dog', text: 'HI! Are you a squirrel?', kind: 'shout' }],
      choice: {
        options: [
          { label: '“No. I’m a cat.”', sets: {}, next: 'f056' },
          { label: '“I’m a CAT. A wild one!”', sets: {}, next: 'f056' }
        ]
      }
    },

    f056: {
      scene: S('field', 'dogs', {},
        [c('dog', 'sit', 'wonder', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'wonder', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'wonder', 'dog-3', 'left', { variant: 3 })], ['day']),
      board: 'MEDIUM, FROM THE PATH. All three dogs have stopped dead and sat down in a row behind the fence, heads tilted the same way, completely baffled by our cat. A tennis ball rolls to a stop beside them. Caption top left; the shaggy dog’s balloon, then the spotty dog’s.',
      caption: ['All three dogs stop.'],
      say: [
        { who: 'dog', text: 'What’s a cat?' },
        { who: 'dog', text: 'Like a squirrel, but rude.' }
      ],
      next: 'f057'
    },

    f057: {
      scene: S('field', 'wide', {},
        [c('tallyheart', 'walk', 'kind', 'path-left', 'right'), c('player', 'walk', 'happy', 'path-right', 'right'),
         c('dog', 'sit', 'wonder', 'dog-1', 'right', { variant: 1 }), c('dog', 'sit', 'wonder', 'dog-2', 'right', { variant: 2 }),
         c('dog', 'sit', 'wonder', 'dog-3', 'right', { variant: 3 })], ['day']),
      board: 'WIDE. Tallyheart steers our cat on along the path with her tail, murmuring out of the side of her mouth, while the three dogs sit behind the fence and stare after them. A tennis ball lies forgotten in the mud. Her balloon small and dry.',
      say: [{ who: 'tallyheart', text: 'Three dogs, six ears, and not one idea.', kind: 'whisper' }],
      next: 'f058'
    },

    f058: {
      scene: S('field', 'dogs', {},
        [c('dog', 'howl', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'howl', 'happy', 'dog-2', 'right', { variant: 2 }),
         c('dog', 'howl', 'happy', 'dog-3', 'right', { variant: 3 })], ['day']),
      board: 'MEDIUM, COMEDY BEAT. The three dogs throw their heads back and howl their goodbye at the fence, noses to the sky, tails wagging madly. The cats are already out of the panel. Caption top left; one big shared balloon.',
      caption: ['Behind you, all three dogs howl.'],
      say: [{ who: 'dog', text: 'BYE, RUDE SQUIRREL!', kind: 'shout' }],
      next: 'f059'
    },

    /* ------------------------------------------------------------------ The Crossing */

    f059: {
      scene: S('crossing', 'wide', { plane: 'high' },
        [c('player', 'sit', 'wonder', 'rock-left', 'right'), c('tallyheart', 'sit', 'kind', 'rock-right', 'left'),
         c('otter', 'sun', 'sleepy', 'raft-1', 'left', { variant: 1 }), c('otter', 'sun', 'sleepy', 'raft-2', 'left', { variant: 2 }),
         c('otter', 'sun', 'sleepy', 'raft-3', 'left', { variant: 3 })], ['day']),
      board: 'WIDE ESTABLISHING. The Crossing at Gravelly Point: a rocky point where the river opens out wide and shining, airplanes strung across the sky, and a raft of logs tied with vines riding a little low at the water’s edge. Three otters lie on it with their tummies to the sun, and Tallyheart sits between our cat and the deep water. Captions top left.',
      caption: [
        'The path ends at a rocky point where the river opens wide. Otters sun their tummies on a raft of logs tied with vines.',
        { when: { worry: 'water' }, text: 'Tallyheart quietly steps between you and the wide, deep water.' }
      ],
      next: 'f060'
    },

    f060: {
      scene: S('crossing', 'rocks', {},
        [c('player', 'sit', 'wonder', 'rock-left', 'right'), c('tallyheart', 'sit', 'proud', 'rock-right', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT ON THE ROCKS. Tallyheart presents the Crossing with a sweep of her tail like a tour guide; our cat looks completely lost. The wide river glitters behind them. Her balloon, then our cat’s small one.',
      say: [
        { who: 'tallyheart', text: 'The Crossing. The otters’ ferry, right under the skymonsters.' },
        { who: 'player', text: 'The what?' }
      ],
      next: 'f061'
    },

    f061: {
      scene: S('crossing', 'low', { plane: 'low' },
        [c('player', 'flat', 'scared', 'rock-left', 'right'), c('tallyheart', 'flat', 'scared', 'rock-right', 'left'),
         c('otter', 'sun', 'sleepy', 'raft-1', 'left', { variant: 1 })], ['day']),
      board: 'LOW ANGLE, ACTION. Something gigantic blots out the sky just overhead, roaring, and pebbles jump on the rocks; our cat is pressed flat with its eyes squeezed shut, and even big Tallyheart has flattened her ears. Out on the raft, an otter keeps sunbathing. The ROAR stretches across the whole top of the panel; captions at the bottom.',
      caption: ['Something enormous sweeps over, so low the stones rattle. You flatten yourself on the rocks. Even Tallyheart’s ears go flat.'],
      sfx: 'ROOOOOAAAAARRRRR!',
      next: 'f062'
    },

    f062: {
      scene: S('crossing', 'raft', { plane: 'low' },
        [c('otter', 'sun', 'sleepy', 'raft-1', 'left', { variant: 1 }), c('otter', 'sun', 'sleepy', 'raft-2', 'left', { variant: 2 }),
         c('otter', 'sun', 'sleepy', 'raft-3', 'left', { variant: 3 })], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Close on the raft: three otters lie on their backs with their eyes shut and their paws folded on their tummies, perfectly relaxed, while the airplane’s shadow slides off the water. The old one’s long white whiskers trail in the river. One caption, deadpan.',
      caption: ['The otters don’t look up.'],
      next: 'f063'
    },

    f063: {
      scene: S('crossing', 'rocks', {},
        [c('player', 'sit', 'worried', 'rock-left', 'right'), c('riffle', 'juggle', 'worried', 'rock-high', 'left'),
         c('tallyheart', 'sit', 'wonder', 'rock-right', 'left')], ['day', 'bonk']),
      board: 'MEDIUM. A smooth pebble bounces off the top of our cat’s head with little stars; up on a high rock, a sleek brown otter pup juggles the rest of his pebbles, wincing. Tallyheart looks up. The BONK! pops right at the head; caption top left, his balloon from the high rock.',
      caption: ['Something hard bounces off your head.'],
      say: [{ who: 'riffle', name: 'An otter pup', text: 'OOPS! Sorry! That one’s slippery!', kind: 'shout' }],
      sfx: 'BONK!',
      next: 'f064'
    },

    f064: {
      scene: S('crossing', 'rocks', { pebbles: true },
        [c('player', 'sit', 'wonder', 'rock-left', 'right'), c('riffle', 'juggle', 'happy', 'pebbles', 'left'),
         c('tallyheart', 'sit', 'kind', 'rock-right', 'left')], ['day']),
      board: 'MEDIUM. The otter pup scrambles down beside our cat, still juggling three pebbles at once, all bounce and whiskers, beaming. He has a cream throat and chin, small round ears and a thick rudder of a tail. Caption top left; his balloon bubbly.',
      caption: ['An otter pup comes scrambling over the rocks, juggling the rest of his pebbles.'],
      say: [{ who: 'riffle', text: 'You’re the pillow cat who counted the prey pile! News floats fast! I’m Riffle!' }],
      next: 'f065'
    },

    f065: {
      scene: S('crossing', 'raft', {},
        [c('tallyheart', 'sit', 'kind', 'shore', 'right'), c('otter', 'sit', 'shout', 'raft-1', 'left', { variant: 1 }),
         c('otter', 'sun', 'sleepy', 'raft-2', 'left', { variant: 2 }), c('otter', 'sun', 'sleepy', 'raft-3', 'left', { variant: 3 })], ['day']),
      board: 'MEDIUM. Tallyheart leans politely toward the oldest ferry otter, grey-muzzled, his long white whiskers trailing in the water; he cups a paw to his ear and bellows back. The other two otters doze on. Caption top left; his balloon loud.',
      caption: ['Tallyheart asks the oldest ferry otter about strangers.'],
      say: [{ who: 'otter', text: 'WHAT? Speak up! There’s a skymonster COMING!', kind: 'shout' }],
      next: 'f066'
    },

    /* ------------------------------------------------------------------ Airplanes */

    f066: {
      scene: S('crossing', 'low', { plane: 'low' },
        [c('player', 'lookup', 'wonder', 'rock-left', 'right'), c('tallyheart', 'flat', 'scared', 'rock-right', 'left'),
         c('otter', 'sit', 'neutral', 'raft-1', 'left', { variant: 1 }), c('otter', 'sun', 'sleepy', 'raft-2', 'left', { variant: 2 }),
         c('otter', 'sun', 'sleepy', 'raft-3', 'left', { variant: 3 })], ['day']),
      board: 'LOW ANGLE. The airplane sweeps in again, enormous and very low, but this time our cat sits up and looks straight at it while Tallyheart ducks. Its belly fills the top of the panel. Captions at the bottom; the ROAR across the plane.',
      caption: ['He’s right.', 'This time you don’t duck. You look up.'],
      sfx: 'ROOOOOAAAAARRRRR!',
      next: 'f067'
    },

    f067: {
      scene: S('crossing', 'low', { plane: 'low' },
        [c('player', 'lookup', 'wonder', 'rock-left', 'right', { size: 1.6 }), c('tallyheart', 'flat', 'scared', 'rock-right', 'left'),
         c('otter', 'sit', 'neutral', 'raft-1', 'left', { variant: 1 }), c('otter', 'sun', 'sleepy', 'raft-2', 'left', { variant: 2 }),
         c('otter', 'sun', 'sleepy', 'raft-3', 'left', { variant: 3 })], ['day']),
      board: 'LOW ANGLE, CLOSE. The row of little round windows runs along the airplane’s side right above our cat’s big upturned face, while Tallyheart still ducks flat on her rock behind. A thought cloud beside it shows the Tall One’s glowing box seen from behind her chair, an airplane on its screen, no faces. Caption at the bottom.',
      caption: ['A row of little round windows runs along the skymonster’s side, just like the airplanes on the Tall One’s glowing box.'],
      next: 'f068'
    },

    f068: {
      scene: S('crossing', 'rocks', { pebbles: true },
        [c('player', 'stand', 'shout', 'rock-left', 'right'), c('riffle', 'stand', 'wonder', 'pebbles', 'left'),
         c('tallyheart', 'sit', 'wonder', 'rock-right', 'left'), c('otter', 'sit', 'neutral', 'shore', 'left', { variant: 1 })], ['day']),
      board: 'MEDIUM. Our cat stands up on its rock, chest out, one paw pointing at the sky, absolutely sure; Riffle, Tallyheart and the old ferry otter stare at it. A small airplane drifts on toward the airport behind. Our cat’s balloon big; the choices sit below the panel.',
      say: [{ who: 'player', text: 'That’s not a skymonster. That’s an AIRPLANE!', kind: 'shout' }],
      choice: {
        options: [
          { label: '“Tall Ones ride inside, eating tiny crunchy snacks.”', sets: {}, next: 'f069a' },
          { label: '“Tall Ones ride inside. It has a bathroom. In the SKY.”', sets: {}, next: 'f069b' }
        ]
      }
    },

    f069a: {
      scene: S('crossing', 'raft', {},
        [c('otter', 'sit', 'worried', 'raft-1', 'left', { variant: 1 }), c('riffle', 'stand', 'shout', 'raft-2', 'left'),
         c('otter', 'sun', 'sleepy', 'raft-3', 'left', { variant: 2 }), c('otter', 'float', 'happy', 'water', 'left', { variant: 3 }),
         c('player', 'sit', 'proud', 'shore', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Riffle stands on the raft with both paws cupped round his mouth, yelling straight into the old ferry otter’s ear; the old otter’s whiskers blow back. A tiny inset shows a bag of crunchy snacks. Caption top left; Riffle’s balloon jagged.',
      caption: ['Riffle shouts it into the old otter’s ear.'],
      say: [{ who: 'riffle', text: 'The pillow cat says Tallwalkers ride INSIDE! Eating SNACKS!', kind: 'shout' }],
      next: 'f070'
    },

    f069b: {
      scene: S('crossing', 'raft', {},
        [c('otter', 'sit', 'worried', 'raft-1', 'left', { variant: 1 }), c('riffle', 'stand', 'shout', 'raft-2', 'left'),
         c('otter', 'sun', 'sleepy', 'raft-3', 'left', { variant: 2 }), c('otter', 'float', 'happy', 'water', 'left', { variant: 3 }),
         c('player', 'sit', 'proud', 'shore', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Riffle stands on the raft with both paws cupped round his mouth, yelling straight into the old ferry otter’s ear; the old otter’s whiskers blow back. A tiny inset shows a little door with a cloud behind it. Caption top left; Riffle’s balloon jagged.',
      caption: ['Riffle shouts it into the old otter’s ear.'],
      say: [{ who: 'riffle', text: 'The pillow cat says Tallwalkers ride INSIDE! With a BATHROOM!', kind: 'shout' }],
      next: 'f070'
    },

    f070: {
      scene: S('crossing', 'raft', {},
        [c('otter', 'swim', 'laugh', 'water', 'left', { variant: 1 }), c('riffle', 'hug', 'laugh', 'raft-1', 'left'),
         c('otter', 'sun', 'laugh', 'raft-2', 'left', { variant: 2 }), c('otter', 'sun', 'laugh', 'raft-3', 'left', { variant: 3 }),
         c('player', 'sit', 'laugh', 'shore', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. All the otters roll about on the raft helpless with laughter, and the old one has toppled clean off the edge into the river with a huge splash. Our cat laughs on the shore. SPLOOSH! erupts out of the water.',
      caption: ['The otters laugh so hard that the old one falls off the raft.'],
      sfx: 'SPLOOSH!',
      next: 'f071'
    },

    f071: {
      scene: S('crossing', 'raft', {},
        [c('otter', 'stand', 'solemn', 'raft-1', 'left', { variant: 1 }), c('riffle', 'sit', 'happy', 'raft-2', 'left'),
         c('otter', 'sun', 'laugh', 'raft-3', 'left', { variant: 2 }), c('player', 'sit', 'happy', 'shore', 'right')], ['day']),
      board: 'MEDIUM. The old ferry otter hauls himself back onto the raft, streaming water, whiskers dripping, and delivers his verdict with a perfectly straight face. Riffle bites his lip to stop from giggling. Caption top left; the old otter’s balloon slow and dry.',
      caption: ['He climbs back on, dripping.'],
      say: [{ who: 'otter', text: 'Tallwalkers. INSIDE a skymonster. On PURPOSE. And I’m a duck.' }],
      next: 'f072'
    },

    f072: {
      scene: S('crossing', 'rocks', { pebbles: true },
        [c('player', 'sit', 'happy', 'rock-left', 'right'), c('riffle', 'stand', 'happy', 'pebbles', 'left'),
         c('tallyheart', 'sit', 'kind', 'rock-right', 'left')], ['day']),
      board: 'MEDIUM. Riffle bounces up beside our cat with his paws clasped, eyes shining, then screws up his face as he admits the truth, then beams again. Tallyheart watches. His balloon wobbles through all three moods.',
      say: [{ who: 'riffle', text: 'I believe you! Well, no, I don’t. But I LOVE it.' }],
      next: 'f073'
    },

    f073: {
      scene: S('crossing', 'wide', { plane: 'high' },
        [c('player', 'sit', 'proud', 'rock-left', 'right'), c('riffle', 'sit', 'happy', 'pebbles', 'left'),
         c('tallyheart', 'sit', 'kind', 'rock-right', 'left'), c('otter', 'sit', 'laugh', 'raft-1', 'left', { variant: 1 }),
         c('otter', 'sun', 'laugh', 'raft-2', 'left', { variant: 2 }), c('otter', 'sun', 'happy', 'raft-3', 'left', { variant: 3 })], ['day']),
      board: 'WIDE. The whole Crossing again: the otters still chuckling on the raft, Tallyheart hiding a smile in her whiskers, and our cat sitting very straight and calm on its rock. High above, another airplane drifts down toward the airport, windows and all. Captions top left, the second one smaller.',
      caption: ['Nobody believes you. Even Tallyheart hides a smile in her whiskers.', 'But you know what you know.'],
      next: 'f074'
    },

    /* ------------------------------------------------------------------ A favorite stone */

    f074: {
      scene: S('crossing', 'rocks', { pebbles: true },
        [c('player', 'sit', 'wonder', 'rock-left', 'right'), c('riffle', 'sit', 'neutral', 'pebbles', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT. Riffle sits by his heap of pebbles, for once almost serious, explaining something very important with one paw raised. Our cat listens closely. His balloon at the top.',
      say: [{ who: 'riffle', text: 'Every otter keeps a favorite stone. And every otter gives one to each new friend.' }],
      next: 'f075'
    },

    f075: {
      scene: S('crossing', 'rocks', { pebbles: true },
        [c('player', 'sit', 'wonder', 'rock-left', 'right', { holds: 'stone' }), c('riffle', 'scramble', 'kind', 'pebbles', 'left')], ['day', 'sparkle']),
      board: 'CLOSE-UP. Riffle has dug in his heap of pebbles, and now he leans in low and sets a smooth, nearly black pebble in our cat’s paws: a white stripe runs all the way around it, unbroken. A tiny sparkle on the stripe. Caption along the top.',
      caption: ['He digs out a smooth dark pebble with a white stripe all the way around, and sets it in your paws.'],
      gift: 'riffle-stone',
      next: 'f076'
    },

    f076: {
      scene: S('crossing', 'low', { plane: 'none' },
        [c('player', 'sit', 'happy', 'rock-left', 'right', { size: 1.55, holds: 'stone' }), c('riffle', 'stand', 'proud', 'rock-right', 'left', { size: 1.55 }),
         c('otter', 'sun', 'sleepy', 'raft-2', 'left', { variant: 2 }), c('otter', 'sun', 'sleepy', 'raft-3', 'left', { variant: 3 })], ['day']),
      board: 'LOW ANGLE, TWO-SHOT ON THE ROCKS. Riffle stands tall beside our cat and puffs out his cream chest, proud of his gift, announcing their friendship; our cat holds the stone close. Far out on the raft behind, the other otters doze. His balloon bouncy, and below it our cat’s answer for a friendly cat.',
      say: [
        { who: 'riffle', text: 'That stripe means it’s lucky. Now we’re friends. I make friends FAST!' },
        { who: 'player', text: 'So do I.', when: { specialty: 'friends' } }
      ],
      next: 'f077'
    },

    f077: {
      scene: S('crossing', 'rocks', { pebbles: true },
        [c('player', 'sit', 'happy', 'rock-left', 'right', { holds: 'stone', purr: true }), c('riffle', 'stand', 'wonder', 'pebbles', 'left')], ['day', 'purr']),
      board: 'MEDIUM. Our cat closes its eyes and purrs, soft golden ripple lines spreading from it, while Riffle leans in with his eyes gone perfectly round. Captions top left; his balloon small and amazed.',
      caption: ['You have nothing to give him back. So you do the only thing a cat can do: you purr.', 'Riffle’s eyes go round.'],
      say: [{ who: 'riffle', text: 'Is your TUMMY talking?' }],
      next: 'f078'
    },

    f078: {
      scene: S('crossing', 'rocks', { pebbles: true },
        [c('player', 'sit', 'happy', 'rock-left', 'right', { holds: 'stone' }), c('riffle', 'sit', 'wonder', 'pebbles', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT. Our cat smiles and explains, the stone at its front paws, and Riffle listens with his head on one side. The river sparkles behind them. Our cat’s balloon at the top.',
      say: [{ who: 'player', text: 'It means thank you.' }],
      next: 'f079'
    },

    f079: {
      scene: S('crossing', 'rocks', { pebbles: true },
        [c('player', 'sit', 'happy', 'rock-left', 'right', { holds: 'stone' }), c('riffle', 'hug', 'happy', 'pebbles', 'left'),
         c('tallyheart', 'sit', 'kind', 'rock-right', 'left')], ['day']),
      board: 'MEDIUM. Riffle squeezes his own thick tail in a hug, eyes shut with joy, wriggling from nose to toes. Tallyheart, behind, softens too. Caption top left; his balloon warm.',
      caption: ['Riffle hugs his own tail.'],
      say: [{ who: 'riffle', text: 'Best sound I ever heard.' }],
      next: 'f080'
    },

    /* ------------------------------------------------------------------ The way home */

    f080: {
      scene: S('riverbank', 'water', {},
        [c('player', 'walk', 'happy', 'path-left', 'right'), c('riffle', 'swim', 'happy', 'water', 'right'),
         c('tallyheart', 'walk', 'kind', 'path-right', 'right')], ['day']),
      board: 'MEDIUM. Our cat and Tallyheart walk the narrow path at the water’s edge, and Riffle swims alongside, head and back above the water. For a cat who likes water, one paw dips in to say hello and Riffle cheers. Captions top left.',
      caption: [
        'Riffle swims beside you, back up the river.',
        { when: { specialty: 'swimming' }, text: 'You dip a paw in to say hello to the river, and Riffle cheers.' }
      ],
      next: 'f081'
    },

    f081: {
      scene: S('bridge', 'bank', BANK,
        [c('tallyheart', 'stand', 'stern', 'reeds', 'right', { size: 1.25 }), c('player', 'sit', 'neutral', 'bank-right', 'left'),
         c('riffle', 'sit', 'neutral', 'bank-left', 'right')], ['day']),
      board: 'WIDE, FROM THE RIVERBANK. Back at the Old Bridge, Tallyheart stops on the bank and gives her orders, very firm, one paw raised; our cat and Riffle listen. The dark space under the bridge waits at left. Caption top left; her balloon serious.',
      caption: ['At the Old Bridge, Tallyheart stops.'],
      say: [{ who: 'tallyheart', text: 'I need to mark our border again. Stay with Riffle. And not one paw under the Old Bridge.' }],
      next: 'f082'
    },

    f082: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'lookup', 'wonder', 'bank-right', 'right'), c('riffle', 'stand', 'happy', 'reeds', 'right')], ['day']),
      board: 'WIDE. Only the tip of a ginger tail is still visible, whisking away over the top of the bank at the right; our cat and Riffle look after it. The bridge and its dark space sit quietly behind them. Caption top left.',
      caption: ['She bounds up the bank and out of sight.'],
      next: 'f083'
    },

    f083: {
      scene: S('bridge', 'mouth', BANK,
        [c('player', 'sit', 'wonder', 'sun', 'left', { size: 1.35 })], ['day']),
      board: 'MEDIUM. Our cat sits in the sunshine right at the mouth of the dark under the bridge, staring in; the cool shadow begins a whisker away from its nose. Drips fall somewhere inside. Captions top left, the second one for a sneaky cat.',
      caption: [
        'The dark under the bridge is right beside you. You never did hear why no cat goes in there.',
        { when: { specialty: 'sneaking' }, text: 'You could slip in without a sound, like sneaking up on socks.' }
      ],
      next: 'f084'
    },

    f084: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'wonder', 'bank-left', 'left'), c('riffle', 'stand', 'happy', 'reeds', 'left')], ['day']),
      board: 'WIDE. Riffle bounces by the reeds, pointing downriver with his whole body, while our cat sits between him and the dark under the bridge, looking from one to the other. The choice is drawn in the picture: sunshine and Riffle one way, the dark the other. His balloon eager; the choices sit below the panel.',
      say: [{ who: 'riffle', text: 'Come on! There’s a spot down there where the skymonsters come SO low your whiskers buzz!' }],
      choice: {
        options: [
          { label: 'Sneak one look under the Old Bridge, even though it’s not allowed.', sets: { ch2Path: 'bridge' }, next: 'f085a' },
          { label: 'Go down to the river with Riffle.', sets: { ch2Path: 'river' }, next: 'f085b' }
        ]
      }
    },

    /* ------------------------------------------------------------------ Under the bridge (ch2Path: bridge) */

    f085a: {
      scene: S('bridge', 'mouth', BANK,
        [c('riffle', 'stand', 'scared', 'edge', 'right'), c('player', 'sit', 'wonder', 'sun', 'left')], ['day']),
      board: 'MEDIUM. Riffle’s fur stands straight up all over, so he looks like a startled brush, and he backs away from the shadow’s edge shaking his head. Our cat sits in the sun looking past him into the dark. Caption top left; his balloon wobbly.',
      caption: ['Riffle’s fur stands straight up.'],
      say: [{ who: 'riffle', text: 'Under THERE? Nope, nope, nope! I’ll keep watch!' }],
      next: 'f086a'
    },

    f086a: {
      scene: S('bridge', 'mouth', BANK,
        [c('riffle', 'stand', 'worried', 'rock', 'right'), c('player', 'walk', 'wonder', 'edge', 'left')], ['day']),
      board: 'MEDIUM. Riffle has hopped up onto a big rock at the edge of the shadow, standing tall on his hind legs like a lookout, while our cat walks slowly into the cool dark below. A last stripe of sunlight lies across its back. Caption top left.',
      caption: ['He hops onto a rock at the edge of the shadow.'],
      next: 'f087a'
    },

    f087a: {
      scene: S('bridge', 'under', {},
        [c('player', 'walk', 'wonder', 'mud', 'right')], ['day']),
      board: 'WIDE, HER VIEW. Inside the dark under the bridge: slivers of daylight and river between the stone legs at left, cool blue shadows, mud by the water and dry ground rising toward the back. Our cat steps in, small. Caption top left.',
      caption: ['You step into the dark. It’s cool in here, and dry further back.'],
      next: 'f088a'
    },

    f088a: {
      scene: S('bridge', 'under', { drag: true },
        [c('player', 'crouch', 'sniff', 'mud', 'right')], ['day']),
      board: 'WIDE, HER VIEW. Our cat crouches nose-down over deep drag marks, two long grooves with scuffs between them, that come up out of the river through the soft mud and run on into the dark. Drips fall from the deck above. Caption along the top.',
      caption: ['Deep drag marks come up out of the river, through the mud, and on into the dark.'],
      next: 'f089a'
    },

    f089a: {
      scene: S('bridge', 'under', {},
        [c('player', 'crouch', 'worried', 'inside', 'right')], ['day']),
      board: 'WIDE, HER VIEW. Our cat is small and far in now, creeping along the drag marks one paw at a time, ears turned forward to a sound from the back. The sound is drawn only as a soft wet sniffle line. Captions top left, the second one gentle.',
      caption: ['You follow them, one paw at a time. Then you hear it: a small, wet sniffle.', 'It doesn’t sound scary. It sounds sad.'],
      next: 'f090a'
    },

    f090a: {
      scene: S('bridge', 'back', { eyes: 'none' },
        [c('player', 'lookup', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM, FROM BEHIND. Our cat, seen from behind at the bottom left, peers into the very back of the dark: a heap of old stones with a dry nook in it, and nothing to see. Its whisper is a small, soft balloon.',
      say: [{ who: 'player', text: 'Hello?', kind: 'whisper' }],
      next: 'f091a'
    },

    f091a: {
      scene: S('bridge', 'back', { eyes: 'open' },
        [c('player', 'lookup', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, FROM BEHIND. In the dry nook among the stones, two big round eyes have opened, shining softly like river stones in the dark, gentle and sad, not scary. Our cat holds very still. Caption at the top, away from the eyes.',
      caption: ['At the very back, two big eyes open. Round as river stones, and shining.'],
      next: 'f092a'
    },

    f092a: {
      scene: S('bridge', 'back', { eyes: 'blink' },
        [c('player', 'lookup', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, FROM BEHIND. The same picture, but the two eyes are half closed in a slow, sleepy blink. Nothing else moves. Caption at the top, three short pieces with space between.',
      caption: ['They blink at you. Once. Slowly.'],
      next: 'f093a'
    },

    f093a: {
      scene: S('bridge', 'back', { eyes: 'none' },
        [c('player', 'lookup', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM, FROM BEHIND. The nook is empty dark again, as if the eyes were never there; only drips fall from the deck, each with a tiny ring where it lands. Our cat stares at the place. Caption at the top.',
      caption: ['Then they’re gone. There’s only the dark, and the drip, drip, drip.'],
      next: 'f094a'
    },

    f094a: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'walk', 'scared', 'reeds', 'left'), c('tallyheart', 'stand', 'worried', 'bank-right', 'left')], ['day']),
      board: 'WIDE, COMEDY BEAT. Out in the sunshine, our cat backs away from the dark with its eyes still on it, and bumps its rump straight into Tallyheart’s big soft chest, which is right there. Her fur is puffed up twice its size. Caption top left, ending on dots before the bump.',
      caption: ['You back out into the sunshine… and bump right into something big and soft and ginger.'],
      next: 'f095a'
    },

    f095a: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'worried', 'reeds', 'right'), c('tallyheart', 'stand', 'worried', 'bank-right', 'left')], ['day']),
      board: 'MEDIUM WIDE. Tallyheart looms over our cat, fur still on end, more frightened than cross; a small inset shows her view from the top of the bank, first one apprentice by the bridge, then none. Our cat looks up guiltily. Her balloon at top right.',
      say: [{ who: 'tallyheart', text: 'I looked down from the bank and counted one apprentice. Then I counted none.' }],
      next: 'f096a'
    },

    f096a: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'worried', 'reeds', 'right'), c('tallyheart', 'crouch', 'sniff', 'bank-right', 'left')], ['day']),
      board: 'MEDIUM. Tallyheart sniffs our cat over from nose to tail, counting as she goes, while our cat stands still and lets her. Little sniff lines and a tally of paws float around them. Captions top left; her balloon a checklist.',
      caption: ['Her fur is puffed up with worry. She sniffs you over.'],
      say: [{ who: 'tallyheart', text: 'Four paws. One tail. Two ears. All there.' }],
      next: 'f097a'
    },

    f097a: {
      scene: S('bridge', 'mouth', BANK,
        [c('tallyheart', 'sit', 'kind', 'sun', 'left', { size: 1.1 }), c('player', 'lookup', 'worried', 'sun-edge', 'right')], ['day']),
      board: 'MEDIUM. Out in the sunshine at the mouth of the dark, Tallyheart sits down heavily and lets out a long breath, drawn as a slow curl of air; her fur settles flat again. Our cat, just out of the shadow, sits close beside her and looks up at her face, which is gentle and honest. Caption top left; her balloon quiet.',
      caption: ['She lets out a long, long breath.'],
      say: [{ who: 'tallyheart', text: 'I’m not angry. I was scared. That’s different.' }],
      next: 'f098a'
    },

    f098a: {
      scene: S('bridge', 'bank', BANK,
        [c('tallyheart', 'sit', 'solemn', 'bank-right', 'left'), c('player', 'sit', 'wonder', 'reeds', 'right')], ['day']),
      board: 'WIDE. Tallyheart nods toward the heap of old stones under the bridge as she explains, and a small inset shows a long, sleek water snake coiled among stones, more nosy than nasty. Our cat listens with big eyes. Her balloons at the top.',
      say: [
        { who: 'tallyheart', text: 'A water snake named Coil lives in those stones.' },
        { who: 'tallyheart', text: 'Snakes never made the Accord, our promise not to hunt each other. That’s why we stay out.' }
      ],
      next: 'f099a'
    },

    f099a: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'wonder', 'reeds', 'right'), c('tallyheart', 'sit', 'kind', 'bank-right', 'left')], ['day']),
      board: 'MEDIUM WIDE. Our cat speaks up, ears forward, eager to be believed; Tallyheart waves it away with a flick of her tail, sure she knows. The dark under the bridge waits behind them. Our cat’s balloon, then hers.',
      say: [
        { who: 'player', text: 'I saw eyes. They blinked at me.' },
        { who: 'tallyheart', text: 'That’ll be Coil. Nosy old thing.' }
      ],
      next: 'f100a'
    },

    f100a: {
      scene: S('bridge', 'mouth', BANK,
        [c('riffle', 'stand', 'shout', 'rock', 'right'), c('player', 'sit', 'wonder', 'sun-edge', 'left'),
         c('tallyheart', 'sit', 'wonder', 'sun', 'left')], ['day']),
      board: 'MEDIUM. Riffle pops up from behind his rock like a jack-in-the-box, one paw raised like a know-it-all, eyes wide; our cat and Tallyheart both turn to look at him. A tiny inset shows a snake’s eye with a clear scale over it and no eyelid. His balloon bursts from the rock.',
      caption: ['Riffle pops up from behind his rock.'],
      say: [{ who: 'riffle', text: 'Snakes can’t blink! They don’t have eyelids!' }],
      next: 'f101a'
    },

    f101a: {
      scene: S('bridge', 'mouth', BANK,
        [c('riffle', 'sit', 'worried', 'rock', 'right'), c('player', 'sit', 'worried', 'sun-edge', 'right'),
         c('tallyheart', 'sit', 'solemn', 'sun', 'left', { size: 1.1 })], ['day']),
      board: 'MEDIUM. In the sunshine at the mouth, Tallyheart turns and looks back into the dark under the bridge, and her torn ear twitches once. Nothing looks back; Riffle on his rock and our cat wait for her word. Caption top left; her balloon short, the last word firm.',
      caption: ['Tallyheart looks back at the dark. Her torn ear twitches.'],
      say: [{ who: 'tallyheart', text: 'Hm. Whatever’s under there, it isn’t for apprentices. Home.' }],
      next: 'f102'
    },

    /* ------------------------------------------------------------------ Down by the river (ch2Path: river) */

    f085b: {
      scene: S('riverbank', 'slide', {},
        [c('riffle', 'slide', 'happy', 'slope', 'right'), c('player', 'sit', 'wonder', 'bank-top', 'right')], ['day']),
      board: 'MEDIUM, ACTION. Riffle zooms down the slick muddy bank on his belly, paws tucked in, whiskers streaming, toward the water at the bottom; our cat peeks over the top of the bank. A long muddy streak marks his slide. Caption top left; his WHEEE! stretched long, the SPLOOSH! at the water.',
      caption: ['Riffle slides down the muddy bank on his belly.'],
      say: [{ who: 'riffle', text: 'WHEEEEE!', kind: 'shout' }],
      sfx: 'SPLOOSH!',
      next: 'f086b'
    },

    f086b: {
      scene: S('riverbank', 'path', {},
        [c('player', 'walk', 'wonder', 'path-left', 'right'), c('riffle', 'swim', 'happy', 'water', 'right')], ['day']),
      board: 'WIDE. A narrow path runs along the water at the foot of the muddy bank; above it the glass towers shine, and the same towers hang upside down in the river, rippling. Our cat walks the path, well back from the edge when it worries about water, while Riffle swims happily. Captions top left.',
      caption: [
        'You follow him to a narrow path by the water. The glass towers shine in the sun, and upside down in the river too.',
        { when: { worry: 'water' }, text: 'You keep well back from the deep water. Riffle doesn’t mind one bit.' }
      ],
      next: 'f087b'
    },

    f087b: {
      scene: S('riverbank', 'water', {},
        [c('player', 'sit', 'wonder', 'path-left', 'right'), c('riffle', 'swim', 'happy', 'water', 'left')], ['day']),
      board: 'MEDIUM. Our cat sits on the path and asks, while Riffle bobs upright in the water below and answers with great relish, wiggling his whiskers. A small inset shows a long sleek snake whispering into a frog’s ear. Our cat’s balloon, then Riffle’s.',
      say: [
        { who: 'player', text: 'Why does nobody go under the Old Bridge?' },
        { who: 'riffle', text: 'COIL! A water snake. He knows everybody’s secrets, and he trades them like pebbles.' }
      ],
      next: 'f088b'
    },

    f088b: {
      scene: S('riverbank', 'water', {},
        [c('player', 'lookup', 'wonder', 'path-left', 'right'), c('riffle', 'float', 'happy', 'water', 'left')], ['day']),
      board: 'MEDIUM. Riffle floats on his back in the water, juggling three pebbles on his tummy, and points one paw at the sky. Our cat looks where he points. Caption top left; his balloon gleeful.',
      caption: ['Riffle flops onto his back in the water, juggling pebbles on his tummy.'],
      say: [{ who: 'riffle', text: 'Here comes a skymonster!' }],
      next: 'f089b'
    },

    f089b: {
      scene: S('riverbank', 'path', { plane: 'low' },
        [c('player', 'lookup', 'wonder', 'path-left', 'right'), c('riffle', 'float', 'laugh', 'water', 'right')], ['day']),
      board: 'WIDE, ACTION. An airplane sweeps over very low above the river, and its huge shadow slides across the water, right over Riffle, who squeals with joy. Our cat watches it go. The ROAR across the sky; caption top left.',
      caption: ['An airplane sweeps over, so low that its shadow slides across the river.'],
      say: [{ who: 'riffle', text: 'WHEEEEEE!', kind: 'shout' }],
      sfx: 'ROOOOOAAAAARRRRR!',
      next: 'f090b'
    },

    f090b: {
      scene: S('riverbank', 'path', { roar: true },
        [c('player', 'lookup', 'scared', 'path-left', 'right'), c('riffle', 'float', 'wonder', 'water', 'right')], ['day']),
      board: 'WIDE. From the top of the tallest tower, jagged sound lines burst out and roar back at the departing airplane; nothing else can be seen up there. Our cat and Riffle both snap their heads up. Captions top left; the roar lettered small and grumpy, its hic! tiny.',
      caption: ['And then, from high up among the towers, something roars BACK.', 'It’s smaller than the airplane’s roar, and grumpier, with a tiny hiccup at the end.'],
      sfx: 'RAWWWRRR… hic!',
      next: 'f091b'
    },

    f091b: {
      scene: S('riverbank', 'water', {},
        [c('player', 'lookup', 'wonder', 'path-left', 'right'), c('riffle', 'float', 'scared', 'water', 'left')], ['day']),
      board: 'MEDIUM. Riffle has stopped juggling with his mouth open, and his pebbles drop one by one into the river, each with a little splash ring. Our cat stares up at the towers. Caption top left; his whisper small; the plips lettered small along the water.',
      caption: ['Riffle’s pebbles drop into the river.'],
      say: [{ who: 'riffle', text: 'Did a TOWER just roar back at a skymonster?', kind: 'whisper' }],
      sfx: 'Plip. Plip. Plop.',
      next: 'f092b'
    },

    f092b: {
      scene: S('riverbank', 'roof', { light: true }, [], ['day']),
      board: 'LOW ANGLE, HER VIEW. Looking straight up the tallest tower, the one up behind camp, all the way to its roof: only glass, sky, and a little red light blinking on a mast. Nothing moves. Caption at the bottom; the blinks lettered small by the light.',
      caption: ['The roar came from the tallest tower, up behind camp. But up there you see only glass, and sky, and a little red light on its roof.'],
      sfx: 'Blink. Blink. Blink.',
      next: 'f093b'
    },

    f093b: {
      scene: S('riverbank', 'water', {},
        [c('player', 'sit', 'solemn', 'path-left', 'right'), c('riffle', 'swim', 'wonder', 'water', 'left')], ['day']),
      board: 'MEDIUM. Riffle squints up at our cat as if consulting a great expert, and our cat answers with total certainty. The red light still blinks far up behind them. His balloon, then our cat’s short one.',
      say: [
        { who: 'riffle', text: 'You’re the airplane expert. Do airplanes have friends on roofs?' },
        { who: 'player', text: 'No.' }
      ],
      next: 'f094b'
    },

    f094b: {
      scene: S('riverbank', 'water', {},
        [c('player', 'sit', 'happy', 'path-left', 'right'), c('riffle', 'swim', 'wonder', 'water', 'left')], ['day']),
      board: 'MEDIUM CLOSE-UP. Riffle’s eyes go huge and sparkly as a wonderful idea arrives, and he rubs his paws together. Our cat grins. Caption top left; his balloon thrilled.',
      caption: ['Riffle’s eyes go huge.'],
      say: [{ who: 'riffle', text: 'Then I’m going to have to START a rumor!' }],
      next: 'f095b'
    },

    f095b: {
      scene: S('riverbank', 'slide', {},
        [c('tallyheart', 'sit', 'wonder', 'bank-top', 'right'), c('player', 'stand', 'shout', 'path-left', 'left'),
         c('riffle', 'swim', 'happy', 'water', 'left')], ['day']),
      board: 'MEDIUM. Tallyheart’s ginger head pops up over the top of the muddy bank; our cat runs to the foot of it, bursting with news, and Riffle splashes up in the water behind. Caption top left; two excited balloons.',
      caption: ['Tallyheart’s head pops up over the bank.'],
      say: [
        { who: 'player', text: 'The TOWER roared back!', kind: 'shout' },
        { who: 'riffle', text: 'I heard it too!' }
      ],
      next: 'f096b'
    },

    f096b: {
      scene: S('riverbank', 'path', {},
        [c('tallyheart', 'walk', 'kind', 'path-right', 'left'), c('player', 'sit', 'wonder', 'path-left', 'right'),
         c('riffle', 'swim', 'happy', 'water', 'left')], ['day']),
      board: 'WIDE. Tallyheart has come down to the path and waves the whole business away with a flick of her tail, already heading home. Our cat and Riffle look at each other. Her balloon brisk.',
      say: [{ who: 'tallyheart', text: 'A Tallwalker noise, I expect. Home time!' }],
      next: 'f097b'
    },

    f097b: {
      scene: S('riverbank', 'path', {},
        [c('tallyheart', 'walk', 'worried', 'path-left', 'left'), c('player', 'walk', 'happy', 'path-right', 'left'),
         c('riffle', 'swim', 'happy', 'water', 'left')], ['day']),
      board: 'WIDE. The three of them head home along the river, but Tallyheart’s torn ear is turned back toward the tallest tower behind them, twitching, as if it is still listening. The red light blinks far off. Caption top left.',
      caption: ['But all the way along the river, her torn ear keeps twitching toward the towers.'],
      next: 'f102'
    },

    /* ------------------------------------------------------------------ Home */

    f102: {
      scene: S('riverbank', 'water', {},
        [c('riffle', 'swim', 'happy', 'water', 'right'), c('player', 'sit', 'happy', 'path-left', 'right', { holds: 'stone' }),
         c('tallyheart', 'sit', 'kind', 'path-right', 'left')], ['day']),
      board: 'MEDIUM. Riffle splashes away downriver, waving one webbed paw over his shoulder, a trail of bubbles behind him; our cat watches him go with the stone held close. Tallyheart waits. Caption top left; his two balloons trailing back toward us.',
      caption: ['Riffle splashes off downriver.'],
      say: [
        { who: 'riffle', text: 'Bye!' },
        { who: 'riffle', text: 'Keep the stone! It’s lucky! Probably!' }
      ],
      next: 'f103'
    },

    f103: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'walk', 'kind', 'wall', 'left'), c('player', 'walk', 'happy', 'wall-2', 'left')], ['sunset']),
      board: 'WIDE. Sunset over the river: Tallyheart and our cat walk home along the top of the old stone wall, the glass towers glowing orange behind, and one by one, airplanes drift down over the river toward the airport. The tallest tower’s little red light winks in the dusk. Captions top left.',
      caption: [
        'You walk home along the wall at sunset.',
        { when: { specialty: 'climbing' }, text: 'You measure the tallest tower with your eyes. Just a very tall curtain, really.' },
        'One by one, the planes drift down over the river.'
      ],
      next: 'f104'
    },

    f104: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'lookup', 'neutral', 'wall', 'right'), c('player', 'lookup', 'proud', 'wall-2', 'right')], ['sunset']),
      board: 'WIDE. The two cats have stopped on the wall and sit side by side, both watching the planes; Tallyheart names them her way and our cat answers its way, without looking round. The sky goes pink and gold. Two short balloons, one each.',
      say: [
        { who: 'tallyheart', text: 'Skymonsters.' },
        { who: 'player', text: 'Airplanes.' }
      ],
      next: 'f105'
    },

    f105: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'lookup', 'dreamy', 'wall', 'right'), c('player', 'sit', 'happy', 'wall-2', 'right')], ['sunset']),
      board: 'WIDE. Tallyheart walks on a few pawsteps, then stops and looks up at the next plane, trying the new word slowly, as if tasting it. Our cat watches her sideways, hiding a smile. Caption top left; her balloons small, with a pause between the two halves of the word.',
      caption: ['Tallyheart is quiet for a few pawsteps. Then she tries it out.'],
      say: [
        { who: 'tallyheart', text: 'Air… planes.' },
        { who: 'tallyheart', text: 'Hm.' }
      ],
      next: 'f106'
    },

    f106: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'walk', 'kind', 'wall', 'left'), c('player', 'walk', 'happy', 'wall-2', 'left')], ['sunset']),
      board: 'WIDE. The two cats walk on along the wall into the sunset together, Tallyheart thoughtful and not laughing at all, our cat with its tail held high. A plane hums overhead. One caption at the top.',
      caption: ['That’s all. But she doesn’t laugh.'],
      next: 'f107'
    },

    f107: {
      scene: S('pile', 'low', { pairs: 8 },
        [c('grizzled', 'sit', 'solemn', 'beside', 'left'), c('player', 'walk', 'happy', 'pile-left', 'right')], ['sunset']),
      board: 'MEDIUM. Back in camp in the last golden light, the grizzled old tom sits by the restacked pile, touching the stacks two at a time with his paw, lips moving; as our cat walks past, he mutters without looking up. The bramble arch glows orange. Captions top left; his whisper gruff and small.',
      caption: ['Back in camp, the old tom sits by the pile, counting it under his breath. By twos.', 'As you pass, he mutters.'],
      say: [{ who: 'grizzled', text: 'Sharp eyes.', kind: 'whisper' }],
      next: 'f108'
    },

    f108: {
      scene: S('den', 'nest', DEN_STONE,
        [c('player', 'loaf', 'wonder', 'nest', 'right')], ['night']),
      board: 'CLOSE-UP. In the dark den, our cat lies in its moss nest gazing at the lucky stone between its paws: nearly black, with a white stripe all the way around. Faint starlight falls through the rose leaves. Caption top left; the choices sit below the panel.',
      caption: ['In the den, you look at Riffle’s stone. Your first gift from a friend. Where should it go?'],
      choice: {
        options: [
          { label: 'By your nose, where you can see it.', sets: { ch2Stone: 'nose' }, next: 'f109' },
          { label: 'Under your chin, cool and smooth.', sets: { ch2Stone: 'chin' }, next: 'f109' }
        ]
      }
    },

    f109: {
      scene: S('den', 'doorway', DEN_PM,
        [c('tallyheart', 'crouch', 'kind', 'doorway', 'left'), c('player', 'loaf', 'happy', 'nest', 'right')], ['night', 'stars']),
      board: 'MEDIUM, FROM INSIDE THE DEN. Tallyheart looks in at the starry doorway, her face soft and proud, and our cat looks up from its nest. Behind her the sky is full of stars, with no moon. Caption top left; her balloons warm and slow.',
      caption: ['Tallyheart looks in at the doorway.'],
      say: [
        { who: 'tallyheart', text: 'You did well today, {name}paw. The Clan needed a counting cat this morning, and it had one.' },
        { who: 'tallyheart', text: 'Glintstar wants you to count the pile again tomorrow. Sleep.' }
      ],
      next: 'f110'
    },

    f110: {
      scene: S('den', 'inside', DEN_PM,
        [c('player', 'lie', 'wonder', 'nest', 'right'), c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'),
         c('mutterer', 'curl', 'sleepy', 'sleeper-2', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN. Our cat lies awake in its nest with its eyes open in the dark, and a thought bubble above it shows the prey pile’s neat stacks with a gap where four pieces should be. The other two apprentices sleep. Caption top left.',
      caption: ['You lie in the dark and think. Four pieces of prey, gone, and the stacks left so neat.'],
      next: 'f111'
    },

    f111: {
      scene: S('den', 'nest', DEN_PM,
        [c('player', 'loaf', 'wonder', 'nest', 'right')], ['night']),
      board: 'CLOSE-UP. Our cat’s face in the dark nest, chin on paws, eyes open and shining with determination, the stone right where it was put. A thought bubble shows what it met on the way home, by the path it took: two big eyes blinking in the dark, or a tower roof with a little red light. Captions top left, the last sentence a little bigger.',
      caption: [
        { when: { ch2Path: 'bridge' }, text: 'A small, sad sniffle, and two big eyes that blinked. Snakes can’t blink. So who was it?' },
        { when: { ch2Path: 'river' }, text: 'A roar from a rooftop, with a hiccup at the end. Towers don’t roar. So who did?' },
        'Something strange is happening on your river. Tomorrow, you’re going to find out what.'
      ],
      next: 'f112'
    },

    f112: {
      scene: S('den', 'inside', DEN_PM,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('mutterer', 'curl', 'sleepy', 'sleeper-2', 'left'),
         c('player', 'lie', 'dreamy', 'nest', 'right')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN. The skinny grey apprentice sleeps flat on his back with his mouth open, snoring, and the little tortoiseshell twitches in her nest, muttering; our cat lies in its nest, eyes still half open, drifting toward sleep. Soft blue starlight. Caption top left; her tiny dreamy balloon.',
      caption: ['The skinny grey apprentice snores. The little she-cat mutters in her sleep.'],
      say: [{ who: 'mutterer', text: 'Four mice… gone… four mice…', kind: 'whisper' }],
      next: 'f113'
    },

    f113: {
      scene: S('den', 'outside', DEN_PM, [], ['night', 'stars', 'skyriver']),
      board: 'WIDE. The rosebush den from outside under a clear night sky: the Sky River pours across it from corner to corner, with no moon anywhere, and a soft glow of moss inside the den. Everything is still. Caption at the bottom.',
      caption: ['Over the rosebush, the Sky River shines. Your stone is right where you put it, and you fall asleep.'],
      next: 'f114'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f114: {
      scene: S('den', 'nest', DEN_PM,
        [c('player', 'curl', 'sleepy', 'nest', 'right')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside the lucky stone, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream about, after {their} first walk around the territory?'],
      input: { kind: 'dream', next: 'f115' }
    },

    f115: {
      scene: S('den', 'doorway', DEN_PM,
        [c('player', 'curl', 'sleepy', 'nest', 'right')], ['night', 'stars', 'skyriver', 'zzz']),
      board: 'WIDE CLOSING SHOT, FROM INSIDE THE DEN. Our cat sleeps curled in its moss nest with the striped stone tucked in the moss, and through the doorway the Sky River shines over the rosebush, with no moon. One tiny contented zzz. Caption at the bottom, with END OF CHAPTER TWO lettered like a title.',
      caption: [
        'You sleep warm in your nest, with a friend’s lucky stone in the moss and the Sky River shining over the rosebush.',
        'End of Chapter Two.'
      ],
      end: true
    }
  };

  // The two paths are written one after the other above; the chapter lists every frame in id order
  // (f085a, f085b, f086a…), the reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* Chapter 1's tails lines, for the warm-up (the text: "uses chapter 1's tails lines"). */
  var TAILS_PRAISE = [
    'Ha! Easy, yes? Again.',
    'Yes! One tail for every cat.',
    'Right again. Tails never trick a sharp-eyed cat.',
    'Good! You’re counting like a Clan cat already.',
    'That’s it. One cat, one tail. Next!'
  ];

  PC.story.ch02 = {
    id: 'ch02',
    number: 2,
    title: 'After the Storm',
    start: 'f001',
    frames: ordered,

    counts: {
      // The warm-up on the 1s: 1 × 4, then 7 × 1, or the 1s fact that was hardest for her last time
      // (warmHard: it takes question 2, and if it is 1 × 4 or 4 × 1, 1 × 3 opens instead). Two
      // questions can't hold a miss's two-question gap, so it borrows from chapter 1's tails lesson
      // (fillFrom), each borrowed question after "One from last night." (fillIntro).
      'ch02-tails': {
        table: 1, thing: 'tail', things: 'tails', teacher: 'tallyheart',
        facts: [[1, 4], [7, 1]],
        warmHard: { table: 1, at: 1, alt: [1, 3] },
        fillFrom: 'ch01-tails',
        fillIntro: 'One from last night.',
        ask: '{a} × {b}',
        praise: TAILS_PRAISE,
        fast: ['You didn’t even have to count that time.'],
        fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
        helpIntro: 'Close. Let’s scratch it out together: one line for every tail.',
        helpIntroFar: 'Let’s scratch it out together: one line for every tail.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        done: 'Still got your tails. Good.'
      },

      // The lesson: the 2s, eleven answers in both orders; every number from 1 to 10 once (5 twice).
      'ch02-ears': {
        table: 2, thing: 'ear', things: 'ears', teacher: 'tallyheart',
        facts: [
          // the first question's picture is the first three cats on the rim, the ones she just tapped
          { a: 3, b: 2, who: RIM.slice(0, 3) }, [2, 5], [4, 2], [2, 1],
          // five pairs of ears sliding into two rows of five: same ten
          { a: 5, b: 2, right: [{ who: 'tallyheart', text: 'Five pairs of ears. Or five left ears and five right ears. Same ten!' }],
            rightPicture: { groups: 2, per: 5 } },
          // the first past ten: hop on from ten
          // (the first five cats' ten ears glow as it is asked; the retry keeps the prompt)
          { a: 2, b: 6, lit: 10, prompt: 'Six cats. The first five cats have ten ears. Now hop on from ten!', retryPrompt: true },
          [7, 2], [2, 2], [2, 8], [9, 2], [2, 10]
        ],
        ask: '{a} × {b}',
        praise: [
          'You hopped it!',
          'Two by two, like a real hunter.',
          'Yes! Two ears for every cat.',
          'Two ears, every time.',
          'Ears are trickier than tails, and you’re doing it anyway.'
        ],
        fast: [
          'You didn’t even have to hop that time.',
          'Quick as a pounce!',
          'You knew that one before I finished asking.'
        ],
        fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
        // asked over the three-cat picture on the lesson's first question (the first three on the rim)
        firstPrompt: 'How many ears on the first three?',
        helpIntro: 'Close. Let’s scratch it out together: two lines for every cat, like ears.',
        helpIntroFar: 'Let’s scratch it out together: two lines for every cat, like ears.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        done: 'That’s the twos.'
      },

      // The pile, one Counts moment: the old tom's boast (ten pairs, in a thought cloud), then her
      // own count of this morning's pile (eight pairs, its stacks lit one at a time as she noses
      // them). No praise and no closing screen: the story answers. A miss borrows this morning's ears
      // ("One from this morning.") so the retry still comes two questions later.
      'ch02-pile': {
        table: 2, thing: 'piece', things: 'pieces', unit: 'pair', units: 'pairs', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'stacks' },
        fillFrom: 'ch02-ears',
        fillIntro: 'One from this morning.',
        facts: [
          { a: 10, b: 2, picture: { kind: 'prey', layout: 'stacks', thought: true },
            prompt: [{ who: 'grizzled', text: 'Ten pairs. How many pieces?' }],
            right: [{ who: 'grizzled', text: 'Lucky guess.' }, { who: 'tallyheart', text: 'Luck doesn’t hop by twos.' }],
            rightAgain: [{ who: 'grizzled', text: 'Hmph.' }, { who: 'tallyheart', text: 'One morning of ears, and {they}’s hopping already.' }] },
          // the text's narration, lettered as a caption box above the keypad (a prompt line of kind 'caption')
          { a: 8, b: 2, light: 'groups', check: true,
            prompt: [{ kind: 'caption', text: 'You touch your nose to each little stack.' },
              { kind: 'caption', text: 'One pair. Two pairs. Three… Eight pairs. And that’s all. How many pieces?' }] }
        ],
        ask: '{a} × {b}',
        praise: [],
        helpIntro: 'Close. Let’s scratch it out: two marks for every pair.',
        helpIntroFar: 'Let’s scratch it out: two marks for every pair.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        again: ['There it is. You remembered that one.'],
        done: ''
      },

      // The warrior's check, "the other way around": two rows of eight.
      'ch02-check': {
        table: 2, thing: 'piece', things: 'pieces', unit: 'pair', units: 'pairs', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'stacks' },
        fillFrom: 'ch02-ears',
        fillIntro: 'One from this morning.',
        facts: [
          { a: 2, b: 8, groups: 2, per: 8, picture: { kind: 'prey', layout: 'rows' }, light: 'rows', check: true,
            prompt: 'Two rows of eight. How many pieces?', retryPrompt: true }
        ],
        ask: '{a} × {b}',
        praise: [],
        helpIntro: 'Close. Let’s scratch it out: a row of eight, and another row of eight.',
        helpIntroFar: 'Let’s scratch it out: a row of eight, and another row of eight.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        again: ['There it is. You remembered that one.'],
        done: ''
      }
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'After the Storm',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: 'After all that walking, {name}paw’s dream stayed a secret too.',
      recap: [
        { text: 'The morning after the storm, Tallyheart taught {name}paw {their} second Count, the ears, and scratched a second claw mark beside the first.' },
        { text: 'Then {they} counted the prey pile, stacked in pairs, and found only sixteen pieces where the old tom’s patrol had stacked twenty.' },

        { when: { ch2SaidAloud: true }, text: '{name}paw said so out loud, and {their} voice rang across the whole camp.' },
        { when: { ch2SaidAloud: false }, text: '{name}paw whispered it to Tallyheart, and Tallyheart told the whole camp who had noticed.' },

        { text: 'Four pieces of prey were gone, and Glintstar said not one cat had noticed, except the newest.' },
        { text: 'On {their} first walk around the territory, three dogs at the Barking Field decided {they} was a rude squirrel.' },
        { text: 'At the Crossing, an otter pup named Riffle gave {them} a lucky stone, and nobody believed {them} about airplanes.' },

        { when: { ch2Path: 'bridge' }, text: 'On the way home, {they} sneaked under the Old Bridge and saw two big eyes blink in the dark, though snakes can’t blink.' },
        { when: { ch2Path: 'river' }, text: 'On the way home, {they} heard something on the tallest tower roar back at an airplane, with a tiny hiccup at the end.' },

        { text: 'That night, Riffle’s lucky stone lay in {name}paw’s nest, and {they} wondered what strange thing was happening on the river.' }
      ]
    },

    teaser: {
      title: 'Chapter 3: Under the Old Bridge',
      lines: [
        'Tomorrow, Tallyheart has a new Count for you: claws.',
        'And under the Old Bridge, someone is very hungry, and very far from home.'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
