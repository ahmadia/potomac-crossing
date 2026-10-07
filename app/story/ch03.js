/* Chapter 3: Under the Old Bridge.
 *
 * The text (docs/chapters/03-under-the-old-bridge.md, v0.4) cut into graphic-novel panels, per the
 * frame contract in docs/build.md (its sections "Chapter 2 (v0.3)" and "Chapter 3 (v0.4)"; the
 * text's "Build" notes are the spec for the Counts sets). Each frame is one moment: a drawn scene, a
 * written storyboard (`board`) for a future illustrator, short captions, speech balloons and sound
 * effects, and exactly one interaction. Frame ids run in reading order; a short choice's branch
 * frames carry a letter, one per option (f006a, f006b), and rejoin at the next number (an option
 * whose outcome takes two panels keeps its letter on both, f006b and f007b; one with no outcome of
 * its own goes straight on). The path choice (f086) splits the chapter in two long branches that run
 * side by side under the same numbers: telling Tallyheart is `a` (f087a…f098a), keeping the secret
 * is `b` (f087b…f102b), and both go on to f103, "Home". Each long branch has one light choice of its
 * own, whose two outcomes take the next letters: `c` and `d` on the told path (f090c, f090d), `e`
 * and `f` on the kept path (f094e, f094f).
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line that reacts to a
 * balloon goes in the next panel, and a choice's spoken option is not echoed as a balloon (the label
 * already said it). A line the text marks [if …] carries a `when`; the river path's screen of its own
 * (f081) is a frame with a `when`. A voice the story hasn't shown yet is a balloon with a `name` and
 * no one in the picture ("A voice in the dark", "A small voice"), the bridge's `paws` close-up (the
 * promise) has no one in it but paws, and the new warrior is heard from across camp at bedtime: those
 * are the only balloons whose speaker isn't drawn (the text's "heard, not seen").
 * The tortie is `mutterer` (labelled "{Murmur}paw" by the chapter's `names`) until Glintstar names
 * her, and `murmurchime` after; `{Murmur}`/`{murmur}` read "Mutter" for a player whose own Clan name
 * is Murmur.
 *
 * Text conventions: second person, present tense ("you"); typographic apostrophes and quotes
 * (’ “ ” …) so nothing needs escaping. Time of day comes from fx: `night` in the den before sunrise
 * (no moon), `morning` in camp, `day` at the bridge, `sunset` from "The light turns gold", `dusk` on
 * the way home, `night` in the den, and no moon anywhere (the den's `moon` is off). Every bridge
 * `under` and `back` scene draws Sprinkle's prints beside the drag marks (`prints: true`).
 * tests/story-ch03.test.js checks all of this; tools/storyboard.mjs turns it into
 * docs/storyboard/ch03.md.
 */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.story = PC.story || {};

  /* One cast member: who, pose, mood, anchor, facing, plus optional size/variant/extras. */
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
  function merge(a, b) {
    var o = {}, k;
    for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) o[k] = a[k];
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) o[k] = b[k];
    return o;
  }

  /* The five cats on the hollow's rim, left to right (the skip-count's `who`, and the first
   * question's picture): two Clan cats, Murmurchime, a third Clan cat, and last the grizzled old tom. */
  var RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 },
    { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  // On the rim, a forepaw up, claws out. `oldUp`: the old tom's paw is up too. In the `lesson` camera
  // the cats at `sand-left` and `sand-right` sit right in front of `rim-2` and `rim-4`, so `close`
  // leaves those two out (hidden there anyway).
  function rim(oldUp, close) {
    var out = [c('clancat', 'pawup', 'proud', 'rim-1', 'right', { variant: 1, claws: true })];
    if (!close) out.push(c('murmurchime', 'pawup', 'happy', 'rim-2', 'right', { claws: true }));
    out.push(c('clancat', 'pawup', 'neutral', 'rim-3', 'left', { variant: 3, claws: true }));
    if (!close) out.push(c('clancat', 'pawup', 'proud', 'rim-4', 'left', { variant: 5, claws: true }));
    out.push(oldUp ? c('grizzled', 'pawup', 'stern', 'rim-5', 'left', { claws: true }) : c('grizzled', 'sit', 'stern', 'rim-5', 'left'));
    return out;
  }

  // Scene options that stay the same through a place
  // The den: no moon (night three after a new moon), and Riffle's stone where she put it in chapter 2
  // (`stone: 'auto'`: E.resolveScene fills it from `ch2Stone`, 'nose' or 'chin')
  var DEN = { weather: 'clear', moon: false, stone: 'auto' };
  // the second morning's pile: seven pairs, and the dug earth behind it a little bigger
  var PILE = { pairs: 7, dug: 'big' };
  // the Warrior Counts: the whole Clan crowded round the fountain; the tortie alone in the clear space
  // in front of the basin, under Glintstar (the camp's `fountain-foot` anchor sits left of the basin,
  // beside the crowd and Tallyheart; chapter 1 uses it, so it stays)
  var CROWD = { crowd: true };
  var FOOT = { x: 760, y: 860 };
  var HOLLOW2 = { marks: 2, glow: 'auto' };
  var HOLLOW3 = { marks: 3, glow: 'auto' };
  // The Old Bridge from the bank and at the mouth of the dark: no drag marks (they lie in the dark
  // under the deck, as in chapter 2). `pebble`: Riffle's fifth juggling pebble, in the dark, rolling
  // out, at her paws.
  var BANK = { drag: false };
  var MOUTH_IN = { drag: false, pebble: 'in' };
  var MOUTH_OUT = { drag: false, pebble: 'out' };
  var MOUTH_PAWS = { drag: false, pebble: 'paws' };
  // Inside the dark: the drag marks (the set's default) and, beside them, Sprinkle's big prints
  var UNDER = { prints: true };
  var BACK = { prints: true };
  // the told path, once Tallyheart has dragged the fallen branch across the back (f095a)
  var BACK_BRANCH = { prints: true, branch: true };
  var BACK_TRAIN = { prints: true, train: true };
  var TOWER = { chime: true };

  var frames = {

    /* ------------------------------------------------------------------ Before sunrise */

    f001: {
      scene: S('den', 'nest', DEN,
        [c('player', 'curl', 'sleepy', 'nest', 'right')], ['night']),
      board: 'CLOSE-UP, IN THE DARK. Our cat sleeps curled in its moss nest before sunrise, Riffle’s stone where it was put, and the den is black and blue with no moon. A small whisper balloon drifts in from the dark at the edge of the panel, from someone we cannot see.',
      say: [{ who: 'mutterer', name: 'A voice in the dark', text: 'Nine times nine… eighty-one mice. No! Not mice. Eighty-one.', kind: 'whisper' }],
      next: 'f002'
    },

    f002: {
      scene: S('den', 'nest', DEN,
        [c('player', 'loaf', 'wonder', 'nest', 'right')], ['night']),
      board: 'CLOSE-UP, IN THE DARK. Our cat’s eyes have opened in the nest, shining in the dark, its head up. Later art: a small thought bubble of what it remembers from yesterday, by the path it took: a soft wet sniffle line in the dark under the bridge, or a tower roof with a tiny hiccup. Captions top left.',
      caption: [
        'A whisper wakes you. The den is still dark.',
        { when: { ch2Path: 'bridge' }, text: 'For a heartbeat, you think of the sniffle under the bridge.' },
        { when: { ch2Path: 'river' }, text: 'For a heartbeat, you think of the roar with a hiccup.' }
      ],
      next: 'f003'
    },

    f003: {
      scene: S('den', 'inside', DEN,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('mutterer', 'sit', 'worried', 'sleeper-2', 'left', { squeeze: true }),
         c('player', 'loaf', 'wonder', 'nest', 'left')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, BEFORE SUNRISE. The little tortoiseshell sits bolt upright in her nest with her eyes squeezed tight shut, lips moving, while the skinny grey apprentice sleeps on and our cat watches from its own nest. No moon: only faint starlight through the rose leaves. Caption top left.',
      caption: ['The little tortoiseshell sits bolt upright in her nest, eyes squeezed shut.'],
      next: 'f004'
    },

    f004: {
      scene: S('den', 'inside', DEN,
        [c('snorer', 'lie', 'stern', 'sleeper-1', 'right', { moss: true }), c('mutterer', 'sit', 'worried', 'sleeper-2', 'left'),
         c('player', 'loaf', 'wonder', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN. The skinny grey apprentice has dragged a clump of moss over his ears like a cap and groans from under it; the tortoiseshell opens her eyes and answers him, very serious. Our cat looks from one to the other. Caption top left; his balloon grumpy, hers earnest.',
      caption: ['The skinny grey tom pulls moss over his ears.'],
      say: [
        { who: 'snorer', text: '{Murmur}paw. You’ve been {murmur}ing ALL night.' },
        { who: 'mutterer', text: 'I can’t help it. It’s my Warrior Counts today.' }
      ],
      next: 'f005'
    },

    f005: {
      scene: S('den', 'nest', DEN,
        [c('mutterer', 'sit', 'scared', { x: 920, y: 900 }, 'right'), c('player', 'sit', 'kind', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, TWO-SHOT. Murmurpaw has crept over to the edge of our cat’s nest and gulps hard, her green eyes huge at the thought of the whole Clan watching. Our cat sits up in its nest and turns to her. Caption top left, her balloon wobbly; the choices sit below the panel.',
      caption: ['{Murmur}paw gulps.'],
      say: [{ who: 'mutterer', text: 'In front of EVERYONE.' }],
      choice: {
        options: [
          { label: '“You’ll be great. You count in your sleep!”', sets: {}, next: 'f006a' },
          { label: '“I’ll purr the loudest when you pass.”', sets: {}, next: 'f006b' }
        ]
      }
    },

    f006a: {
      scene: S('den', 'nest', DEN,
        [c('mutterer', 'sit', 'wonder', { x: 920, y: 900 }, 'right'), c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, TWO-SHOT, COMEDY BEAT. At the edge of our cat’s nest Murmurpaw’s eyes pop wide in astonishment, ears straight up, while our cat answers with a sly little grin. Her balloon big and squeaky, then our cat’s small dry one.',
      say: [
        { who: 'mutterer', text: 'I DO?' },
        { who: 'player', text: 'Mice, mostly.' }
      ],
      next: 'f008'
    },

    f006b: {
      scene: S('den', 'nest', DEN,
        [c('mutterer', 'sit', 'shy', { x: 920, y: 900 }, 'right'), c('player', 'sit', 'kind', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, TWO-SHOT. At the edge of our cat’s nest Murmurpaw looks down at her paws and repeats the words very quietly, trying them on, a tiny smile starting. Her whisper balloon small and soft.',
      say: [{ who: 'mutterer', text: 'When I pass.', kind: 'whisper' }],
      next: 'f007b'
    },

    f007b: {
      scene: S('den', 'inside', DEN,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right', { moss: true }), c('mutterer', 'sit', 'proud', { x: 920, y: 900 }, 'right'),
         c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN. The two cats at the edge of our cat’s nest, the grey tom asleep under his moss cap; Murmurpaw has lifted her chin and squared her small shoulders, as if the words have made her a little taller. Our cat smiles. One short caption at the top.',
      caption: ['She sounds braver.'],
      next: 'f008'
    },

    f008: {
      scene: S('den', 'nest', DEN,
        [c('mutterer', 'sit', 'sniff', { x: 920, y: 900 }, 'right'), c('player', 'sit', 'wonder', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, TWO-SHOT. At the edge of the nest Murmurpaw leans in toward our cat and sniffs it, nose wrinkling, little sniff lines in the air between them. Our cat holds still and lets her. Caption top left; her balloon matter-of-fact.',
      caption: ['She sniffs you.'],
      say: [{ who: 'mutterer', text: 'You still smell a bit like soap.' }],
      next: 'f009'
    },

    f009: {
      scene: S('den', 'nest', DEN,
        [c('mutterer', 'sit', 'shy', { x: 920, y: 900 }, 'right'), c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, A QUIET BEAT. Murmurpaw tucks her head down shyly and looks away, the smallest smile on her face, which for her is a hug. Our cat is warm all over. Caption top left, then her whisper, tiny.',
      caption: ['Then, very quietly:'],
      say: [{ who: 'mutterer', text: 'Thanks.', kind: 'whisper' }],
      next: 'f010'
    },

    /* ------------------------------------------------------------------ The second count */

    f010: {
      scene: S('den', 'inside', DEN,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right', { moss: true }), c('player', 'sit', 'happy', 'nest', 'right'),
         c('tallyheart', 'crouch', 'happy', 'doorway', 'left')], ['morning', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, SUNRISE. Morning light pours in at the doorway, where Tallyheart crouches grinning; the tortoiseshell’s nest is an empty ring of moss, and the grey tom snores on under his moss cap. For the warm-up a picture of cats in a row, two ears each, appears; after a miss she scratches two lines a cat in the earth by the doorway. Caption top left, her balloon bright; the keypad sits below the panel.',
      caption: ['By sunrise, {Murmur}paw’s nest is empty, and Tallyheart is at the doorway.'],
      say: [{ who: 'tallyheart', text: 'Morning, {name}paw! Ears first, to wake up your whiskers.' }],
      counts: { set: 'ch03-ears', next: 'f011' }
    },

    f011: {
      scene: S('den', 'doorway', DEN,
        [c('tallyheart', 'stand', 'happy', 'doorway', 'right'), c('player', 'stand', 'happy', 'nest', 'right')], ['morning']),
      board: 'MEDIUM, FROM INSIDE THE DEN. Tallyheart turns in the bright doorway and flicks her tail toward camp, already on her way, and our cat hops up out of its nest to follow. Her balloon brisk, at the top.',
      say: [{ who: 'tallyheart', text: 'Now, count the prey pile.' }],
      next: 'f012'
    },

    f012: {
      scene: S('pile', 'low', PILE,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('grizzled', 'sit', 'proud', 'beside', 'left')], ['morning']),
      board: 'MEDIUM, THEN THE COUNTS. The grizzled old tom sits up beside the pile, chest out, very pleased with himself; above his head a thought cloud shows last night’s pile under an evening sky, nine pairs high. Behind the pile the patch of dug earth is bigger than yesterday, a dark heap of crumbs. In the Counts picture the real pile lights one stack at a time as our cat noses them, with no number shown. Captions top left, his balloon at top right; the keypad sits below the panel.',
      caption: [
        'At the pile, the old tom sits up.',
        { when: { specialty: 'noticing' }, text: 'The dug earth behind the pile is bigger. It hasn’t rained since the storm.' }
      ],
      say: [{ who: 'grizzled', text: 'Nine pairs at sunset. I counted them myself. By twos.' }],
      counts: { set: 'ch03-pile', next: 'f013' }
    },

    f013: {
      scene: S('pile', 'close', merge(PILE, { lit: 7 }), [], ['morning']),
      board: 'INSERT. The pile fills the panel, all seven stacks glowing warm gold, fourteen pieces in neat pairs. Later art: a faint ghost of the old tom’s thought cloud, nine stacks, over it, so the gap is plain to see. Captions stacked at top left.',
      caption: ['Seven pairs. Fourteen.', 'Fourteen is not eighteen.'],
      next: 'f014'
    },

    f014: {
      scene: S('pile', 'low', PILE,
        [c('player', 'sit', 'worried', 'pile-left', 'right'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'left', { flatEars: true })], ['morning']),
      board: 'MEDIUM TWO-SHOT. Across the short pile Tallyheart’s ears go flat against her head and her face turns still and serious; our cat looks up at her. The bramble arch is shadowy. Caption top left; her balloon slow, the last word alone.',
      caption: ['Tallyheart’s ears go flat.'],
      say: [{ who: 'tallyheart', text: 'Four more pieces. Gone.' }],
      next: 'f015'
    },

    f015: {
      scene: S('camp', 'fountain', CROWD,
        [c('glintstar', 'stand', 'solemn', 'fountain-top', 'left')], ['morning']),
      board: 'LOW ANGLE. Glintstar stands on the old dry fountain in the morning sun, silver fur bright against the glass towers, while the heads of the Clan crowd along the bottom of the panel looking up at her. Caption top left; her two balloons cool and level.',
      caption: ['Glintstar stands on the fountain.'],
      say: [
        { who: 'glintstar', text: 'Four on the night of the storm. Four last night. Eight pieces in two nights.' },
        { who: 'glintstar', text: 'But today, {Murmur}paw takes her Warrior Counts.' }
      ],
      next: 'f016'
    },

    /* ------------------------------------------------------------------ The Warrior Counts */

    f016: {
      scene: S('camp', 'reveal', CROWD,
        [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left'), c('mutterer', 'sit', 'worried', FOOT, 'right', { size: 0.85 }),
         c('tallyheart', 'sit', 'kind', 'crowd-left', 'right'), c('player', 'sit', 'wonder', 'entrance', 'right')], ['morning']),
      board: 'WIDE. The whole Clan crowds in rows around the old fountain, every cat turned toward it, with Glintstar on top and little Murmurpaw alone at its foot. Our cat squeezes in at the front of the crowd beside big ginger Tallyheart. Caption top left, over the towers.',
      caption: ['The whole Clan crowds around the fountain. You squeeze in beside Tallyheart.'],
      next: 'f017'
    },

    f017: {
      scene: S('camp', 'crowd', CROWD,
        [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left'), c('mutterer', 'sit', 'worried', FOOT, 'right', { size: 0.85 })], ['morning']),
      board: 'MEDIUM, CLOSER. Murmurpaw sits all alone in the clear space at the fountain’s foot, tail wrapped tight round her paws, the crowd of cats a wall behind her and Glintstar high above. She looks very small. Caption top left.',
      caption: ['{Murmur}paw sits alone at the fountain’s foot. She looks very small.'],
      next: 'f018'
    },

    f018: {
      scene: S('camp', 'fountain-close', CROWD,
        [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left')], ['morning']),
      board: 'CLOSE-UP, LOW ANGLE. Glintstar on the fountain top, head and shoulders, pale eyes calm and steady, saying the rule plainly once for everyone. No muzzle, no gesture, only the words. Her balloon fills the space beside her.',
      say: [{ who: 'glintstar', text: 'To become a warrior, a cat answers every Count up to ten times ten, and gets nine in every ten right.' }],
      next: 'f019'
    },

    f019: {
      scene: S('camp', 'crowd', CROWD,
        [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left'), c('mutterer', 'sit', 'neutral', FOOT, 'right', { size: 0.85 })], ['morning']),
      board: 'MEDIUM. Glintstar asks from the fountain top and Murmurpaw answers from its foot, quick and sure, without a pause. Four balloons zigzag between them, each with its numbers lettered small beside it (7 × 8, 56, 9 × 6, 54). The crowd watches in silence. One caption at the top.',
      caption: ['{Murmur}paw answers, quick and sure.'],
      say: [
        { who: 'glintstar', text: 'Seven times eight.', digits: '7 × 8' },
        { who: 'mutterer', text: 'Fifty-six.', digits: '56' },
        { who: 'glintstar', text: 'Nine times six.', digits: '9 × 6' },
        { who: 'mutterer', text: 'Fifty-four.', digits: '54' }
      ],
      next: 'f020'
    },

    f020: {
      scene: S('camp', 'reveal', CROWD,
        [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left'), c('mutterer', 'sit', 'neutral', FOOT, 'right', { size: 0.85 }),
         c('tallyheart', 'sit', 'kind', 'crowd-left', 'right'), c('player', 'sit', 'wonder', 'entrance', 'right')], ['morning']),
      board: 'WIDE. The whole camp from above the crowd, the fountain in the middle, Glintstar on top and Murmurpaw small at its foot, our cat and Tallyheart at the front. Two balloons, the question and the answer, each with its numbers lettered small (2 × 9, 18).',
      say: [
        { who: 'glintstar', text: 'Two times nine.', digits: '2 × 9' },
        { who: 'mutterer', text: 'Eighteen.', digits: '18' }
      ],
      next: 'f021'
    },

    f021: {
      scene: S('camp', 'ferns', CROWD,
        [c('player', 'sit', 'wonder', 'ferns', 'left')], ['morning', 'sparkle']),
      board: 'MEDIUM, CLOSE ON OUR CAT, ACROSS THE CROWD. In the middle of the crowd our cat’s ears shoot up and its eyes go wide and bright, little sparks of recognition round it. Later art: a tiny inset of the old tom’s thought cloud, nine pairs. One caption at the top.',
      caption: ['You know that one! You counted it this morning.'],
      next: 'f022'
    },

    f022: {
      scene: S('camp', 'crowd', CROWD,
        [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left'), c('mutterer', 'sit', 'proud', FOOT, 'right')], ['morning']),
      board: 'MEDIUM. Murmurpaw sits up taller at the fountain’s foot, chin lifted, drawn bigger than before, while Glintstar asks the next one. Her answer bursts out bright. Caption top left; the two balloons with their numbers lettered small (6 × 5, 30).',
      caption: ['{Murmur}paw sits up taller.'],
      say: [
        { who: 'glintstar', text: 'Six times five.', digits: '6 × 5' },
        { who: 'mutterer', text: 'Thirty!', digits: '30' }
      ],
      next: 'f023'
    },

    f023: {
      scene: S('camp', 'crowd', CROWD,
        [c('glintstar', 'stand', 'kind', 'fountain-top', 'left'), c('mutterer', 'stand', 'shout', FOOT, 'right', { size: 1.1 })], ['morning']),
      board: 'MEDIUM, THE CLIMAX. The sun has climbed higher; a long trail of tiny unlettered question balloons, no numbers in them, curls away behind Glintstar to show how long it has gone on (later art). Murmurpaw is on her feet now, mouth wide, shouting the last answer to the sky. Caption top left; the last two balloons with their numbers (10 × 10, 100), hers huge.',
      caption: ['On and on it goes. At last:'],
      say: [
        { who: 'glintstar', text: 'Ten times ten.', digits: '10 × 10' },
        { who: 'mutterer', text: 'A HUNDRED!', kind: 'shout', digits: '100' }
      ],
      next: 'f024'
    },

    f024: {
      scene: S('camp', 'fountain', CROWD,
        [c('glintstar', 'sit', 'kind', 'fountain-top', 'left')], ['morning', 'glow']),
      board: 'LOW ANGLE. Glintstar looks down from the fountain with a rare small smile, and the morning light rings around her; the Clan’s heads along the bottom of the panel are turned up to her, hushed. She only speaks: no touch, no ceremony gesture. Her two balloons, the name last and largest.',
      say: [
        { who: 'glintstar', text: '{Murmur}paw. Every night, you {murmur}ed your Counts in the dark. Today, they rang out clear as a chime.' },
        { who: 'glintstar', text: 'Your warrior name is {Murmur}chime.' }
      ],
      next: 'f025'
    },

    f025: {
      scene: S('camp', 'purr', CROWD,
        [c('glintstar', 'sit', 'kind', 'fountain-top', 'left', { size: 0.8 }), c('murmurchime', 'sit', 'happy', FOOT, 'right', { size: 0.8 }),
         c('tallyheart', 'sit', 'happy', 'crowd-left', 'right', { size: 0.8 }), c('player', 'sit', 'happy', 'entrance', 'right', { size: 0.8 })], ['morning', 'purr']),
      board: 'WIDE, THE WHOLE CAMP. Every cat in the crowd has closed its eyes and is purring, golden ripple lines rolling out over the clearing from all of them at once, and Murmurchime sits alone and happy at the fountain’s foot. Later art: her new name lettered softly in the air above the camp. Captions top left.',
      caption: ['One by one, the cats begin to purr. The whole camp hums her new name.', '{Murmur}chime.'],
      next: 'f026'
    },

    f026: {
      scene: S('tower', 'balcony', TOWER,
        [c('waffles', 'peer', 'shout', 'railing', 'left')], ['morning']),
      board: 'MEDIUM, CUTAWAY. Far above camp, Princess Waffles leans over her balcony railing, mouth wide, bow askew; beside her geranium a little wind chime of silver tubes sways in the breeze. Caption top left; her shout jagged; the choices sit below the panel.',
      caption: ['Far above, a tiny voice wails.'],
      say: [{ who: 'waffles', text: 'WHAT did they call her? Speak UP, darlings!', kind: 'shout' }],
      choice: {
        options: [
          { label: 'Purr her new name, as loud as you can.', sets: {}, next: 'f027a' },
          { label: 'Close your eyes, and pretend they’re purring your name.', sets: {}, next: 'f027b' }
        ]
      }
    },

    f027a: {
      scene: S('camp', 'ferns', CROWD,
        [c('murmurchime', 'sit', 'kind', 'ferns', 'left')], ['morning', 'purr']),
      board: 'MEDIUM, ACROSS THE CROWD. Over the heads of the purring cats, Murmurchime catches our cat’s eye and grins a wide, friendly grin, whiskers forward, like two denmates sharing a joke. Our cat’s loud purr is drawn as a big golden ripple coming in from the edge of the panel. Caption top left.',
      caption: ['Across the crowd, {Murmur}chime catches your eye and grins.'],
      next: 'f028'
    },

    f027b: {
      scene: S('camp', 'ferns', CROWD,
        [c('player', 'sit', 'happy', 'ferns', 'left', { purr: true })], ['morning', 'purr']),
      board: 'MEDIUM, CLOSE ON OUR CAT. In the middle of the purring crowd our cat has closed its eyes, smiling, purring in golden ripples. Later art: its own name floating faintly in the ripples, almost but not quite there. One caption at the top.',
      caption: ['For one heartbeat, you can almost hear it.'],
      next: 'f028'
    },

    f028: {
      scene: S('camp', 'crowd', CROWD,
        [c('tallyheart', 'sit', 'kind', 'center', 'right', { size: 1.2 }), c('player', 'lookup', 'wonder', { x: 990, y: 930 }, 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. As the crowd begins to break up, Tallyheart looks down at our cat right below her, her face soft, her torn ear tipped toward it. Our cat looks up at her. Caption top left; her balloon small and quiet.',
      caption: ['Beside you, Tallyheart leans down.'],
      say: [{ who: 'tallyheart', text: 'One day, that’ll be you.', kind: 'whisper' }],
      next: 'f029'
    },

    f029: {
      scene: S('camp', 'entrance', {},
        [c('player', 'sit', 'dreamy', 'entrance', 'right', { size: 0.85 })], ['morning', 'sparkle']),
      board: 'HIGH ANGLE, CLOSE ON OUR CAT. Our cat sits very still, whiskers tingling with little sparkles, dreaming. Later art: a dreamy thought bubble with a can of tuna and a garden seen through a glass door, both small next to a big, shining warrior name with no letters yet. Caption across the top.',
      caption: ['You want it so much your whiskers tingle. More than tuna. More than you wanted the garden, all those evenings behind the glass.'],
      next: 'f030'
    },

    f030: {
      scene: S('camp', 'crowd', {},
        [c('tallyheart', 'pawup', 'kind', 'center', 'right', { size: 1.2 }), c('player', 'stand', 'shout', { x: 1100, y: 930 }, 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. The camp has emptied around the fountain. Our cat stands up with its tail straight in the air, worried and then fierce, and Tallyheart answers calmly, one paw raised as she counts what it already has. Three balloons, the last one bold.',
      say: [
        { who: 'player', text: 'But that’s SO many Counts.' },
        { who: 'tallyheart', text: 'It is. And you already know two: tails and ears.' },
        { who: 'player', text: 'Then teach me the next one. NOW.' }
      ],
      next: 'f031'
    },

    f031: {
      scene: S('camp', 'crowd', {},
        [c('tallyheart', 'pawup', 'laugh', 'center', 'right', { size: 1.2, claws: true }), c('player', 'stand', 'happy', { x: 1100, y: 930 }, 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart throws back her head and laughs out loud, delighted, and our cat grins up at her. A little claw glints at the tip of her raised paw. Caption top left; her balloon short.',
      caption: ['Tallyheart laughs.'],
      say: [{ who: 'tallyheart', text: 'Claws, then.' }],
      next: 'f032'
    },

    /* ------------------------------------------------------------------ Claws */

    f032: {
      scene: S('hollow', 'lesson', HOLLOW2,
        [c('tallyheart', 'pawup', 'proud', 'sand-left', 'right', { claws: true }), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM, LESSON. In the sandy Training Hollow, Tallyheart holds up one big ginger forepaw toward our cat and flicks out her claws, five of them, curved and gleaming. Our cat’s eyes follow them. Caption top left, the little SHHNK! by her claws, then her balloon.',
      caption: ['In the Training Hollow, Tallyheart holds up one forepaw.'],
      sfx: 'Shhnk!',
      say: [{ who: 'tallyheart', text: 'Claws. Five on every forepaw.' }],
      next: 'f033'
    },

    f033: {
      scene: S('hollow', 'wide', HOLLOW2,
        rim(true).concat([c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. Along the hollow’s rim, five cats sit in a row, each holding up a forepaw with the claws out, Murmurchime proudest of all; the grizzled old tom at the right end has put his up last, with a stern, grudging face. Tallyheart waits past the old tree. Captions top left; Murmurchime’s balloon cheerful.',
      caption: ['Along the rim, five cats hold up a forepaw each, claws out.', 'The old tom’s paw goes up last.'],
      say: [{ who: 'murmurchime', text: 'Warrior claws.' }],
      next: 'f034'
    },

    f034: {
      scene: S('hollow', 'wide', HOLLOW2,
        rim(true).concat([c('tallyheart', 'stand', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. All five rim cats hold up a forepaw, claws out; Tallyheart stands apart past the trunk, ready to hop along. In play the counting picture takes the panel: five raised forepaws in a row, each cat small behind its paw, the next paw glowing softly; each tap lights its five claws and a big number grows by five. Her balloon at the top.',
      say: [{ who: 'tallyheart', text: 'Hop by fives. Five, ten, fifteen! Touch each paw, and hop with me.' }],
      skip: { table: 5, groups: 5, who: RIM, keep: true, next: 'f035' }
    },

    f035: {
      scene: S('hollow', 'lesson', HOLLOW2,
        rim(true, true).concat([c('tallyheart', 'sit', 'laugh', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM. All twenty-five claws on the rim are still lit and a big 25 floats over the picture, with the running totals under the paws. Up on the rim the old tom holds his paw in the air with a long-suffering face, and below Tallyheart cheers. Her balloon big, his small and dry.',
      say: [
        { who: 'tallyheart', text: 'TWENTY-FIVE!', kind: 'shout' },
        { who: 'grizzled', text: 'Can I put my paw down now?' }
      ],
      next: 'f036'
    },

    f036: {
      scene: S('hollow', 'lesson', HOLLOW2,
        rim(false, true).concat([c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'crouch', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM, THEN THE COUNTS. The five paws’ running totals, 5, 10, 15, 20 and 25, stay in a row under the picture while Tallyheart points her tail along them. Then a picture of forepaws in a row, five claws each, appears for every question; after a miss she swipes the sand once a paw, five claw lines a swipe, and hops along them by fives. Her balloons at the top; the keypad sits below the panel.',
      say: [
        { who: 'tallyheart', text: 'Five paws, five claws each.' },
        { who: 'tallyheart', text: 'Five times five makes twenty-five. And every number you land on ends in a five or a zero.' }
      ],
      counts: { set: 'ch03-claws', next: 'f037' }
    },

    f037: {
      scene: S('hollow', 'tree', HOLLOW3, [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score a third claw mark into the bark beside the other two, curls of bark springing away. The first two marks look a little deeper and darker than the new one. The SKRITCH! runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'A third claw mark.'],
      sfx: 'SKRITCH!',
      next: 'f038'
    },

    f038: {
      scene: S('hollow', 'wide', HOLLOW3,
        [c('tallyheart', 'sit', 'kind', 'tree', 'left'), c('player', 'lookup', 'wonder', 'sunpatch', 'right')], ['morning', 'sparkle']),
      board: 'WIDE. The whole hollow in morning light, three claw marks side by side on the old tree and plenty of bare bark beside them. Tallyheart sits at the foot of the trunk, and our cat gazes up at the marks, then away toward camp. Her balloons rise along the trunk; our cat’s answer is small.',
      say: [
        { who: 'tallyheart', text: 'Claws. That’s your third Count. And your ears mark is deeper already. One day, there’ll be ten marks here.' },
        { who: 'player', text: 'Like {Murmur}chime.' }
      ],
      next: 'f039'
    },

    /* ------------------------------------------------------------------ The fifth pebble */

    f039: {
      scene: S('hollow', 'lesson', HOLLOW3,
        [c('tallyheart', 'sit', 'stern', 'sand-left', 'right'), c('player', 'stand', 'happy', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart raises one paw to give the rule one more time, and our cat, already turning to go, rolls its eyes and finishes it for her. The sand between them is smooth again. Her balloon breaks off with a dash, and our cat’s picks it up.',
      say: [
        { who: 'tallyheart', text: 'Go and find your otter. And remember: not one paw—' },
        { who: 'player', text: '—under the Old Bridge. I know.' }
      ],
      next: 'f040'
    },

    f040: {
      scene: S('bridge', 'bank', BANK,
        [c('riffle', 'juggle', 'happy', 'reeds', 'left', { pebbles: 5 }), c('player', 'walk', 'happy', 'bank-right', 'left')], ['day']),
      board: 'WIDE, FROM THE RIVERBANK. The Old Bridge by day, its stone legs and iron truss, the dark space under the near end at left. Riffle stands on the bank among the reeds juggling four pebbles with a fifth in his paw, and bounces with joy as our cat arrives. Caption top left; his balloon bouncy.',
      caption: ['Riffle is waiting on the bank by the Old Bridge, juggling.'],
      say: [{ who: 'riffle', text: 'You came! Watch! FIVE pebbles!', kind: 'shout' }],
      next: 'f041'
    },

    f041: {
      scene: S('bridge', 'bank', BANK,
        [c('riffle', 'juggle', 'worried', 'reeds', 'left', { pebbles: 4 }), c('player', 'sit', 'wonder', 'bank-right', 'left')], ['day', 'bonk']),
      board: 'WIDE, COMEDY BEAT. Four pebbles arc over Riffle’s head in a neat loop, and the fifth, plain round and brown, bonks right off the top of his head with little stars. Our cat winces. The count is lettered along the arc, the BONK! right at his head.',
      caption: ['One, two, three, four…'],
      sfx: 'BONK!',
      next: 'f042'
    },

    f042: {
      scene: S('bridge', 'mouth', MOUTH_IN,
        [c('riffle', 'stand', 'scared', 'sun-edge', 'left'), c('player', 'sit', 'wonder', 'sun', 'left')], ['day']),
      board: 'MEDIUM, AT THE MOUTH OF THE DARK. The brown pebble has bounced away into the deep shadow under the bridge, a faint glint far inside, and Riffle stands with both paws on his cheeks, wailing. Our cat stares into the dark. Caption top left; the plinks shrink as they go in; his balloons dramatic, then sheepish.',
      caption: ['Number five bounces off his head, into the dark under the bridge.'],
      sfx: 'Plink… plink… plonk.',
      say: [
        { who: 'riffle', text: 'My favorite!', kind: 'shout' },
        { who: 'riffle', text: 'Well. My fifth favorite.' }
      ],
      next: 'f043'
    },

    f043: {
      scene: S('bridge', 'mouth', MOUTH_PAWS,
        [c('riffle', 'stand', 'scared', 'sun-edge', 'left'), c('player', 'sit', 'wonder', 'sun', 'left')], ['day']),
      board: 'MEDIUM, AT THE MOUTH. Slowly the brown pebble has rolled back out of the dark and come to rest right in front of our cat’s forepaws. Riffle leans close and whispers with huge eyes; our cat whispers back. Caption top left, their whispers small; the choices sit below the panel.',
      caption: ['Slowly, the pebble rolls back out, right to your paws.'],
      say: [
        { who: 'riffle', text: 'Snakes can’t roll pebbles. They don’t have PAWS.', kind: 'whisper' },
        { who: 'player', text: 'Or eyelids.', kind: 'whisper', when: { ch2Path: 'bridge' } }
      ],
      choice: {
        options: [
          { label: 'Roll it back in.', sets: {}, next: 'f044a' },
          { label: 'Whisper, “Hello?”', sets: {}, next: 'f044b' }
        ]
      }
    },

    f044a: {
      scene: S('bridge', 'mouth', MOUTH_OUT,
        [c('riffle', 'stand', 'wonder', 'sun-edge', 'left'), c('player', 'sit', 'wonder', 'sun', 'left')], ['day']),
      board: 'MEDIUM. Our cat has nudged the pebble back into the dark, and here it comes again, rolling out toward them with little dashed hops. Riffle and our cat watch it come, side by side. The plinks hop along its path; caption at the top.',
      caption: ['Out it rolls again.'],
      sfx: 'Plink… plink…',
      next: 'f045'
    },

    f044b: {
      scene: S('bridge', 'mouth', MOUTH_PAWS,
        [c('riffle', 'hug', 'scared', 'sun-edge', 'left'), c('player', 'crouch', 'wonder', 'sun', 'left')], ['day']),
      board: 'MEDIUM. Our cat crouches low and leans toward the dark with its whisker tips trembling, and deep in the shadow something shifts. Riffle hugs his tail, his fur rising. One caption, small.',
      caption: ['Something in the dark shuffles.'],
      next: 'f045'
    },

    f045: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'wonder', 'edge', 'left'), c('riffle', 'stand', 'scared', 'rock', 'right')], ['day']),
      board: 'WIDE, FROM THE BANK. Two small figures at the mouth of the big dark space under the bridge: our cat sits at the shadow’s edge and Riffle clings to the rock above. The voice comes out of the dark, its balloons pale and polite, the second one hurried. Our cat’s question in between.',
      say: [
        { who: 'sprinkle', name: 'A small voice', text: 'You dropped that.' },
        { who: 'player', text: 'Who’s there?' },
        { who: 'sprinkle', name: 'A small voice', text: 'Nobody. Nobody’s in here at all.' }
      ],
      next: 'f046'
    },

    f046: {
      scene: S('bridge', 'mouth', MOUTH_PAWS,
        [c('riffle', 'scramble', 'scared', 'sun-edge', 'left'), c('player', 'sit', 'neutral', 'sun', 'left')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. A huge rumble rolls out of the dark and the ground trembles; Riffle scrambles for it, fur on end, but our cat sits perfectly unimpressed. The rumble is lettered big and wobbly across the shadow; his yelp, then our cat’s dry correction.',
      sfx: 'GRRRRRRRMMMMMMBLE!',
      say: [
        { who: 'riffle', text: 'COIL!', kind: 'shout' },
        { who: 'player', text: 'That’s not a snake. That’s a TUMMY.' }
      ],
      next: 'f047'
    },

    f047: {
      scene: S('bridge', 'mouth', MOUTH_PAWS,
        [c('riffle', 'stand', 'worried', 'sun-edge', 'left'), c('player', 'sit', 'worried', 'sun', 'left', { size: 1.35 })], ['day']),
      board: 'MEDIUM. Our cat sits in the sunshine at the mouth of the dark, ears turned forward to a sound from deep inside, drawn only as a soft wet sniffle line, and Riffle listens beside it. Its face goes gentle. Captions top left, the second one for a cat who came this way yesterday.',
      caption: [
        'Then comes a sniffle, small and wet and sad.',
        { when: { ch2Path: 'bridge' }, text: 'The same sniffle as before.' }
      ],
      next: 'f048'
    },

    f048: {
      scene: S('bridge', 'mouth', MOUTH_PAWS,
        [c('player', 'sit', 'solemn', 'sun', 'left', { size: 1.8 })], ['day']),
      board: 'CLOSE-UP. Our cat’s face, thinking hard, the dark under the bridge at its shoulder. A small inset remembers its first night in the storm: big ginger Tallyheart lying across the den doorway, rain behind her, so it wouldn’t be alone. Caption across the top.',
      caption: ['Tallyheart said not one paw. But on your first night, in the storm, she lay across the doorway so you wouldn’t be alone.'],
      next: 'f049'
    },

    f049: {
      scene: S('bridge', 'mouth', MOUTH_PAWS,
        [c('riffle', 'stand', 'worried', 'sun-edge', 'left'), c('player', 'stand', 'solemn', 'sun', 'left')], ['day']),
      board: 'MEDIUM. Our cat stands up and faces the dark, chin high and tail up, small but certain, while Riffle stares at it. The shadow waits a pawstep away. Caption top left; our cat’s balloon short and firm.',
      caption: ['Nobody should be hungry and alone in the dark.'],
      say: [{ who: 'player', text: 'I’m going in.' }],
      next: 'f050'
    },

    f050: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'walk', 'solemn', 'edge', 'left'), c('riffle', 'hug', 'worried', 'rock', 'right')], ['day']),
      board: 'WIDE, FROM THE BANK. Our cat steps into the shadow under the bridge, and up on the rock Riffle squeezes his own thick tail in a nervous hug, then begins to clamber down after it. Caption top left; his balloon wobbly but brave.',
      caption: ['Riffle hugs his tail.'],
      say: [{ who: 'riffle', text: 'Then I’m coming too. Slowly. Behind you.' }],
      next: 'f051'
    },

    /* ------------------------------------------------------------------ Under the Old Bridge */

    f051: {
      scene: S('bridge', 'under', UNDER,
        [c('player', 'walk', 'wonder', 'mud', 'right'), c('riffle', 'stand', 'worried', { x: 380, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN. Inside the cool dark under the bridge: slivers of daylight and river at left, the drag marks running back into the dark beside a trail of big five-clawed prints, never remarked on, and iron beams crossing overhead. Our cat pads in without a sound and Riffle tiptoes behind. Captions top left, each for its own cat.',
      caption: [
        { when: { specialty: 'sneaking' }, text: 'Your sock-sneaking paws don’t make a sound.' },
        'It’s cool under the bridge, and dry at the back.',
        { when: { ch2Path: 'bridge' }, text: 'The drag marks are still here.' },
        { when: { ch2Path: 'river' }, text: 'Deep drag marks run up out of the river and into the dark.' },
        { when: { specialty: 'climbing' }, text: 'Iron beams cross the dark above. What a place to climb!' }
      ],
      next: 'f052'
    },

    f052: {
      // her eyes open exactly where her face is in the next panel (`eyes: 'sprinkle'`)
      scene: S('bridge', 'back', merge(BACK, { eyes: 'sprinkle' }),
        [c('player', 'lookup', 'wonder', 'back-left', 'right'), c('riffle', 'stand', 'scared', 'near', 'right')], ['day']),
      board: 'MEDIUM. In the dry nook at the very back of the dark, two big round eyes open, shining softly like river stones, gentle rather than scary. Our cat, nearer, and Riffle behind it hold very still. Captions at the top, away from the eyes.',
      caption: [
        'At the very back, two big eyes open, round as river stones.',
        { when: { ch2Path: 'bridge' }, text: 'The same two eyes. This time, they don’t vanish.' }
      ],
      next: 'f053'
    },

    f053: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'unfold', 'scared', 'dragon', 'left'), c('player', 'stand', 'scared', 'back-left', 'right', { puffed: true }),
         c('riffle', 'stand', 'scared', 'near', 'right')], ['day']),
      board: 'MEDIUM, THE REVEAL. Something unfolds out of the dark nook, piece by piece: a long neck, a ridged back, a tail that goes on and on, all soft mist-grey. Our cat’s fur puffs up to twice its size and Riffle’s whiskers stand straight out. Captions top left.',
      caption: ['Something unfolds in the dark. A long neck. A ridged back. A tail that goes on and on.', 'Your fur puffs up to twice its size.'],
      next: 'f054'
    },

    f054: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'scared', 'dragon', 'left'), c('player', 'sit', 'scared', 'back-left', 'right', { puffed: true }),
         c('riffle', 'stand', 'scared', 'near', 'right')], ['day']),
      board: 'MEDIUM. The whole creature sits there in the gloom, as big as a heron, matte scales the color of mist, two fog-pale wings folded at its sides, the right one hanging lower. It looks just as frightened as they are. Caption top left; Riffle’s squeak small.',
      caption: ['It’s as big as a heron, with scales the color of mist. And wings.'],
      say: [{ who: 'riffle', text: 'Eek!' }],
      next: 'f055'
    },

    f055: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'hide', 'scared', 'inside', 'left'), c('player', 'sit', 'scared', 'mud', 'right', { puffed: true }),
         c('riffle', 'stand', 'scared', { x: 420, y: 930 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, COMEDY BEAT. At the far back the creature squeaks even louder than Riffle and whips its long tail up over its face to hide, as if that makes it invisible; our cat and Riffle, nearer, jump. The squeak is lettered huge and wobbly from behind the tail.',
      say: [{ who: 'sprinkle', name: 'The dragon', text: 'EEEEEK!', kind: 'shout' }],
      next: 'f056'
    },

    f056: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'hide', 'scared', 'dragon', 'left'), c('player', 'sit', 'wonder', 'back-left', 'right'),
         c('riffle', 'stand', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. The dragon sits very still with the broad end of its tail held over its eyes, the rest of it in plain sight, trembling a little. Our cat and Riffle stare at it. The muffled balloon comes from behind the tail, its letters a little squashed.',
      say: [{ who: 'sprinkle', name: 'A muffled voice', text: 'You can’t see me.' }],
      next: 'f057'
    },

    f057: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'hide', 'scared', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'stand', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM. The same hiding dragon, all of it visible except its eyes, and our cat tilts its head with its fur slowly settling back down. The small balloon from behind the tail is shaky. Caption top left; the choices sit below the panel.',
      caption: ['You can see all of her, except her eyes.'],
      say: [{ who: 'sprinkle', name: 'A muffled voice', text: 'Please don’t eat me.' }],
      choice: {
        options: [
          { label: '“Eat you? I’ve only ever eaten one vole!”', sets: {}, next: 'f059' },
          { label: 'Roll over and show her your tummy.', sets: {}, next: 'f058b' }
        ]
      }
    },

    f058b: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'hide', 'shy', 'dragon', 'left'), c('player', 'tummy', 'happy', 'back-left', 'right'),
         c('riffle', 'stand', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM. Our cat has flopped over onto its back on the dry ground, paws in the air and tummy up, perfectly trusting. Riffle stares in amazement, and the dragon’s tail lifts a tiny bit so one eye can peep. One caption at the top.',
      caption: ['Cats only do that for friends.'],
      next: 'f059'
    },

    f059: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sniff', 'shy', 'dragon', 'left'), c('player', 'sit', 'wonder', { x: 720, y: 900 }, 'right'),
         c('riffle', 'stand', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM. The tail comes down slowly, and the dragon stretches its long neck out and sniffs our cat all over, little sniff lines puffing from a pale snout. Its eyes are big, amber and shy. Caption top left; her balloons soft, one only for a cat who came here yesterday.',
      caption: ['Slowly, the tail comes down. She sniffs you all over.'],
      say: [
        { who: 'sprinkle', name: 'The dragon', text: 'You’re the one who said hello. I was too shy.', kind: 'whisper', when: { ch2Path: 'bridge' } },
        { who: 'sprinkle', name: 'The dragon', text: 'You smell like… tuna?' }
      ],
      next: 'f060'
    },

    f060: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'shy', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'proud', 'mud', 'right'),
         c('riffle', 'sit', 'wonder', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN. The three of them in the cool dark: our cat sits up straight and introduces itself politely, and the dragon, sitting tall now, answers shyly with a little dip of her head. Riffle listens from the side. Our cat’s balloon, then hers.',
      say: [
        { who: 'player', text: 'I used to be a pillow cat. I’m {name}paw.' },
        { who: 'sprinkle', text: 'I’m Sprinkle. A Mistscale dragonet.' }
      ],
      next: 'f061'
    },

    f061: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'shy', 'dragon', 'left'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('riffle', 'stand', 'shout', 'near', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Riffle bounces on his hind legs with his paws flung wide to show how big an island is, and a tiny inset shows a huge misty shape the size of an island. Sprinkle answers with quiet dignity. His balloon jagged, hers small.',
      say: [
        { who: 'riffle', text: 'A MISTSCALE? Granny says Mistscales are as big as ISLANDS!', kind: 'shout' },
        { who: 'sprinkle', text: 'I’m not finished growing yet.' }
      ],
      next: 'f062'
    },

    f062: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left', { holds: 'pebble' }), c('player', 'sit', 'wonder', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle holds a pebble tight against her pale chest in both forepaws: smooth and egg-shaped, mid grey with the faintest green-blue cast, and no stripe at all. Our cat leans in to look. Captions top left, the first for a friendly cat; her balloon, then our cat’s whisper for a cat who loves shiny things.',
      caption: [
        { when: { specialty: 'friends' }, text: 'She’s the shyest new friend you’ve ever made. And the biggest.' },
        'In her claws she holds a pebble tight: plain grey, and smooth as an egg.'
      ],
      say: [
        { who: 'sprinkle', text: 'Mistscales love smooth stones.' },
        { who: 'player', text: 'Me too. Especially shiny ones.', kind: 'whisper', when: { worry: 'shiny' } }
      ],
      next: 'f063'
    },

    f063: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'shy', 'dragon', 'left', { holds: 'pebble' }), c('player', 'sit', 'wonder', 'back-left', 'right'),
         c('riffle', 'juggle', 'wonder', 'near', 'right', { pebbles: 5 })], ['day']),
      board: 'MEDIUM. Sprinkle looks wistfully at the plain brown pebble, back in Riffle’s paw while his others fly, then down at her own grey one. Caption top left; her balloon honest and a little sad.',
      caption: ['She looks at Riffle’s juggling pebble.'],
      say: [{ who: 'sprinkle', text: 'I wanted to keep that one. But it isn’t mine. So I rolled it back.' }],
      next: 'f064'
    },

    /* ------------------------------------------------------------------ A hurt wing */

    f064: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'wings', 'sad', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'worried', 'mud', 'right'),
         c('riffle', 'sit', 'worried', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN. Sprinkle opens her wings in the dark: the left one spreads wide like a grey sail, but the right one droops low and only half opens, held close. No mark on it, nothing bent; it is simply sore. Caption across the top.',
      caption: ['Sprinkle opens her wings. The left one spreads like a grey sail. The right one droops low and won’t open all the way. It’s sore.'],
      next: 'f065'
    },

    f065: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'sad', 'dragon', 'left'), c('player', 'sit', 'worried', 'back-left', 'right'),
         c('riffle', 'sit', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle folds her good wing and looks up at the strip of sky between the bridge stones, homesick. A small inset shows a storm sky with a little grey shape tumbling down through the clouds. Her balloon quiet.',
      say: [{ who: 'sprinkle', text: 'The storm threw me out of the sky. I can’t fly.' }],
      next: 'f066'
    },

    f066: {
      scene: S('bridge', 'back', BACK_TRAIN,
        [c('sprinkle', 'flat', 'scared', 'dragon', 'left', { squeeze: true }), c('player', 'crouch', 'scared', 'back-left', 'right'),
         c('riffle', 'stand', 'scared', 'near', 'right')], ['day']),
      board: 'MEDIUM, ACTION. A train thunders across the bridge overhead and grit shakes down through the beams; Sprinkle squeezes herself flat against the ground with her eyes shut tight, shaking all over, counting her claws one by one. The CLANKETY-CLANK! runs along the top; caption top left, her balloon wobbly.',
      caption: ['A train clatters overhead. Sprinkle squeezes flat, shaking all over.'],
      sfx: 'CLANKETY-CLANK! RUMMMBLE-RUMMMBLE!',
      say: [{ who: 'sprinkle', text: 'Mama says count your claws. One… two… three…', kind: 'whisper' }],
      next: 'f067'
    },

    f067: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'flat', 'scared', 'dragon', 'left'), c('player', 'sit', 'kind', { x: 1060, y: 900 }, 'left'),
         c('riffle', 'stand', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM. Our cat has gone to Sprinkle and presses its whole small side against her big trembling flank, steady and calm, the way Tallyheart once lay across a doorway. The last grit settles. Caption top left; our cat’s balloon gentle.',
      caption: ['You press against her side.'],
      say: [{ who: 'player', text: 'It’s only a train. I’m right here.' }],
      next: 'f068'
    },

    /* ------------------------------------------------------------------ Ten fish */

    f068: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'shy', 'dragon', 'left'), c('player', 'sit', 'wonder', 'back-left', 'right'),
         c('riffle', 'stand', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Sprinkle’s tummy rumbles so loudly that the stones buzz, and she ducks her head, embarrassed, a paw on her middle. Our cat and Riffle look at her tummy. The rumble is lettered round her middle; her balloon small.',
      sfx: 'GRRRRRRRMMMMMMBLE!',
      say: [{ who: 'sprinkle', text: 'Sorry. I haven’t eaten since the storm.' }],
      next: 'f069'
    },

    f069: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', { x: 1200, y: 700 }, 'left'), c('riffle', 'dive', 'proud', 'mud', 'left'), c('player', 'sit', 'wonder', { x: 900, y: 800 }, 'left')], ['day']),
      board: 'WIDE, ACTION. Riffle puffs out his cream chest, then launches himself head-first toward the river at the edge of the dark, a fountain of spray bursting up where he hits the water. Our cat watches from the dry ground, and Sprinkle, deeper in, watches happily. Caption top left, his balloon proud, SPLOOSH! at the water.',
      caption: ['Riffle puffs out his chest.'],
      say: [{ who: 'riffle', text: 'Hungry? I’m an OTTER!', kind: 'shout' }],
      sfx: 'SPLOOSH!',
      next: 'f070'
    },

    f070: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'gulp', 'happy', 'dragon', 'left'), c('riffle', 'stand', 'proud', 'back-left', 'right', { holds: 'fish' }),
         c('player', 'sit', 'happy', 'near', 'right')], ['day']),
      board: 'MEDIUM, A RUN OF GULPS. Riffle stands dripping with another fish in his mouth, and Sprinkle tips her head back and gulps one down whole, eyes shut with bliss, while a little heap of drips shows where the others came from. For a swimming cat, a fish wriggles between its paws in a tiny inset. Caption top left, the three GULPs lettered one after another.',
      caption: [
        'He’s back with a fish. Then another. Then a third.',
        { when: { specialty: 'swimming' }, text: 'You wade in, and a fish slips right between your paws.' }
      ],
      sfx: 'GULP. GULP. GULP.',
      next: 'f071'
    },

    f071: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'burp', 'happy', 'dragon', 'left', { mist: true }), c('riffle', 'stand', 'laugh', 'back-left', 'right'),
         c('player', 'sit', 'laugh', 'near', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Sprinkle burps, and a small round cloud of mist puffs out of her mouth and floats up toward the beams; she looks surprised and pleased. Riffle points at it, squealing with delight. Caption top left; his balloon jagged.',
      caption: ['Then Sprinkle burps, and out puffs a little cloud of mist.'],
      say: [{ who: 'riffle', text: 'She burps CLOUDS!', kind: 'shout' }],
      next: 'f072'
    },

    f072: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'), c('riffle', 'sit', 'happy', 'back-left', 'right'),
         c('player', 'sit', 'happy', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle sits up, much happier, and dips her head politely to Riffle in thanks. Then she explains with great seriousness, as if it is the most ordinary thing in the world. Her balloon at the top.',
      say: [{ who: 'sprinkle', text: 'Thank you. At home, I eat a fish for every claw on my forepaws.' }],
      next: 'f073'
    },

    f073: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'pawsup', 'happy', 'dragon', 'left'), c('riffle', 'sit', 'wonder', 'back-left', 'right'),
         c('player', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, THEN THE COUNTS. Sprinkle holds up both forepaws with the claws spread, five long pale claws on each, and starts counting them one at a time. In the Counts picture her two big grey forepaws rise in a row; after a miss she swipes the mud once a paw and our cat does the hopping. Caption top left, her balloon slow; the keypad sits below the panel.',
      caption: ['She holds up both forepaws.'],
      say: [{ who: 'sprinkle', text: 'One… two… three…' }],
      counts: { set: 'ch03-dinner', next: 'f074' }
    },

    f074: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'happy', 'mud', 'right'),
         c('riffle', 'sit', 'worried', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, COMEDY BEAT. Riffle has sat down heavily with his mouth hanging open at the thought of so much fishing, while Sprinkle nods placidly and our cat tries not to laugh. A tiny inset shows a mountain of fish. Three balloons, Riffle’s last one glum.',
      say: [
        { who: 'riffle', text: 'Ten fish. Every MEAL?' },
        { who: 'sprinkle', text: 'Usually.' },
        { who: 'riffle', text: 'I’m going to need a bigger mouth.' }
      ],
      next: 'f075'
    },

    /* ------------------------------------------------------------------ Six brothers and sisters */

    f075: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sniff', 'sad', 'dragon', 'left', { holds: 'pebble' }), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle holds her grey pebble to her snout and breathes it in, eyes half shut. A misty thought bubble shows seven little dragonets in a row at sunrise, each holding up one forepaw, and a big grey Mama counting along them. Caption top left; her balloon wistful.',
      caption: ['Sprinkle sniffs her pebble.'],
      say: [{ who: 'sprinkle', text: 'It smells like home. Every morning, all seven of us hold up a forepaw, and Mama counts the claws. Thirty-five, and nobody’s missing.' }],
      next: 'f076'
    },

    f076: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'pawup', 'sad', 'dragon', 'left'), c('player', 'sit', 'worried', 'back-left', 'right'),
         c('riffle', 'sit', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle holds up one forepaw alone, its five pale claws spread, and looks at it as though it is far too few. Our cat and Riffle go quiet. Caption top left; her balloon small, the last word alone.',
      caption: ['She holds up one forepaw.'],
      say: [{ who: 'sprinkle', text: 'This morning, there was only mine. Five.' }],
      next: 'f077'
    },

    f077: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'sad', 'dragon', 'left', { tear: true }), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM CLOSE. A single misty tear rolls down beside Sprinkle’s pale snout, more cloud than water. A small inset shows a stormy river with six little grey shapes blown in all directions along it. Caption top left; her balloon soft.',
      caption: ['A misty tear rolls down her nose.'],
      say: [{ who: 'sprinkle', text: 'The storm blew my six brothers and sisters all along the river.' }],
      next: 'f078'
    },

    f078: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'draw', 'sad', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'kind', 'mud', 'right'),
         c('riffle', 'sit', 'worried', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, THEN THE COUNTS. Sprinkle bends low and, with one long claw, draws little forepaws in the soft mud, one after another, six of them, each with five claw marks. Our cat and Riffle watch in silence. In the Counts picture the six forepaws fill the panel, none lit until she answers. Caption top left; the keypad sits below the panel.',
      caption: ['With one claw, she draws six little forepaws in the mud, one for each.'],
      counts: { set: 'ch03-six', next: 'f079' }
    },

    f079: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'sad', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle sniffs hard and gazes at the strip of daylight toward the river, then lifts her chin bravely, as if repeating something she has been told many times. Our cat stays close. Caption top left; her two balloons, the second firmer.',
      caption: ['Sprinkle sniffs.'],
      say: [
        { who: 'sprinkle', text: 'Six of us, out there somewhere. And I can’t fly to find them.' },
        { who: 'sprinkle', text: 'But Mistscales are tough. Mama says so.' }
      ],
      next: 'f080'
    },

    f080: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'), c('player', 'sit', 'wonder', 'back-left', 'right'),
         c('riffle', 'sit', 'laugh', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle smiles a wobbly smile, remembering, and a little inset shows the smallest dragonet of all, roaring with his mouth wide open and hiccuping at the end of it. Riffle giggles. Her balloons, the second only for a cat who came this way yesterday.',
      say: [
        { who: 'sprinkle', text: 'My littlest brother roars at everything. And when he roars, he hiccups.' },
        { who: 'sprinkle', text: 'If you ever hear a roar with a hiccup, that’s him.', when: { ch2Path: 'bridge' } }
      ],
      next: 'f081'
    },

    f081: {
      when: { ch2Path: 'river' },
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'wings', 'happy', 'dragon', 'left'), c('player', 'stand', 'shout', 'back-left', 'right'),
         c('riffle', 'stand', 'happy', 'near', 'right')], ['day']),
      board: 'MEDIUM, THE RIVER PATH ONLY. Our cat jumps up with its paws spread, bursting with the news, and Sprinkle’s good wing flies open in joy. A small inset shows the tallest tower’s roof and its little red light. Three balloons, the first two loud.',
      say: [
        { who: 'player', text: 'We heard him! On the tallest tower!', kind: 'shout' },
        { who: 'sprinkle', text: 'THAT’S HIM!', kind: 'shout' },
        { who: 'sprinkle', text: 'He climbs when he’s scared. He’s safe up high.' }
      ],
      next: 'f082'
    },

    f082: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sniff', 'shy', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle lowers her long neck until her big amber eyes are level with our cat’s, and asks, hardly daring to. Riffle holds his breath. Her balloon small; the choices sit below the panel.',
      say: [{ who: 'sprinkle', text: 'Will you look for them? Please?' }],
      choice: {
        options: [
          { label: '“We’ll look for every one of them.”', sets: {}, next: 'f083' },
          { label: '“All along the river. I promise.”', sets: {}, next: 'f083' }
        ]
      }
    },

    f083: {
      scene: S('bridge', 'paws', { pawsIn: true }, [], ['day']),
      board: 'EXTREME CLOSE-UP, THE PROMISE. Three forepaws piled together in a warm pool of light: our cat’s, held out at the bottom; Sprinkle’s big grey one with its five long pale claws laid gently on it; and Riffle’s brown webbed paw slapped on top. They are fanned so every one of the fifteen claws shows. Caption top left; Riffle’s balloon pops in from the edge.',
      caption: ['You hold out a forepaw. Sprinkle sets her big forepaw on yours. Riffle slaps his on top.'],
      say: [{ who: 'riffle', text: 'Me too!' }],
      next: 'f084'
    },

    f084: {
      scene: S('bridge', 'paws', { pawsIn: true, hop: true }, [], ['day']),
      board: 'EXTREME CLOSE-UP. The same three paws, and now each forepaw’s five claws are lit warm gold as Sprinkle hops along them by fives, with a number beyond each: 5 by our cat’s, 10 by hers, 15 by Riffle’s. Her balloons come in from the edge, the second one proud.',
      say: [
        { who: 'sprinkle', text: 'Three forepaws.' },
        { who: 'sprinkle', text: 'Five, ten, fifteen! I’ve never made a fifteen-claw promise before.' }
      ],
      next: 'f085'
    },

    /* ------------------------------------------------------------------ Tell or keep */

    f085: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'worried', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'wonder', 'mud', 'right'),
         c('riffle', 'sit', 'wonder', { x: 400, y: 940 }, 'right')], ['sunset']),
      board: 'WIDE, HER VIEW IN, SUNSET. Long bands of golden light now stretch across the floor of the dark from the river, and the beams overhead catch it. Sprinkle sits in the gold with her head tilted, suddenly anxious, and asks her question. Caption top left; her balloon small.',
      caption: ['The light turns gold. Time to go home.'],
      say: [{ who: 'sprinkle', text: 'Will you tell your Clan about me?' }],
      next: 'f086'
    },

    f086: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'worried', 'dragon', 'left'), c('player', 'sit', 'solemn', 'back-left', 'right'),
         c('riffle', 'sit', 'worried', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Our cat sits very still, thinking, while Sprinkle and Riffle wait; a small inset remembers the black-and-white apprentice in camp with his paws flung wide, shouting about whatever crashed in the river. The gold light makes long shadows. Caption top left; the choices sit below the panel.',
      caption: ['You remember what an apprentice cried when the prey went missing: “Maybe whatever crashed in the river ATE them!”'],
      choice: {
        options: [
          { label: 'Tell Tallyheart. She’ll know what to do.', sets: { ch3Told: true }, next: 'f087a' },
          { label: 'Keep the secret. Just you, Riffle and Sprinkle.', sets: { ch3Told: false }, next: 'f087b' }
        ]
      }
    },

    /* ------------------------------------------------------------------ Telling Tallyheart (ch3Told: true) */

    f087a: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'shy', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Our cat explains with one paw raised, describing someone big and ginger, and a tiny inset shows Tallyheart smiling. Sprinkle listens, worried but trusting, and nods. Our cat’s balloon, then her whisper.',
      say: [
        { who: 'player', text: 'I know a cat who can help. She’s big and ginger, and kind.' },
        { who: 'sprinkle', text: 'If you trust her, I’ll try.', kind: 'whisper' }
      ],
      next: 'f088a'
    },

    f088a: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'sit', 'kind', 'wall', 'left'), c('player', 'stand', 'worried', 'wall-2', 'right')], ['sunset']),
      board: 'WIDE, SUNSET. On the old stone wall high above the river, the towers glowing orange, our cat runs up to Tallyheart, who sits watching the water, and the words tumble out of it all at once. Caption top left; our cat’s balloon in a rush.',
      caption: ['You find Tallyheart on the wall at sunset.'],
      say: [{ who: 'player', text: 'I went under the Old Bridge. Someone there needs help.' }],
      next: 'f089a'
    },

    f089a: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'sit', 'scared', 'wall', 'left', { puffed: true }), c('player', 'sit', 'worried', 'wall-2', 'right')], ['sunset']),
      board: 'WIDE, SUNSET. Tallyheart’s fur puffs up all over at once until she is twice her size against the orange sky, her eyes round. Our cat sits very small beside her. Caption top left; her one-word balloon, for a cat who went under yesterday too; the choices sit below the panel.',
      caption: ['Her fur puffs up.'],
      say: [{ who: 'tallyheart', text: 'AGAIN?', kind: 'shout', when: { ch2Path: 'bridge' } }],
      choice: {
        options: [
          { label: '“Are you angry?”', sets: {}, next: 'f090c' },
          { label: '“Come and see. Please?”', sets: {}, next: 'f090d' }
        ]
      }
    },

    f090c: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'sit', 'solemn', 'wall', 'left', { puffed: true }), c('player', 'sit', 'worried', 'wall-2', 'right')], ['sunset']),
      board: 'WIDE, SUNSET. Tallyheart closes her eyes and breathes slowly in and out, her puffed fur beginning to settle, counting on her claws under her breath. Then she opens her eyes and stands. Her two balloons, the second short and decided.',
      say: [
        { who: 'tallyheart', text: 'A little. I’m counting to ten. Slowly.' },
        { who: 'tallyheart', text: 'Show me.' }
      ],
      next: 'f091a'
    },

    f090d: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'sit', 'solemn', 'wall', 'left', { puffed: true }), c('player', 'sit', 'worried', 'wall-2', 'right')], ['sunset']),
      board: 'WIDE, SUNSET. Tallyheart closes her eyes and counts silently, one claw tapping the wall for each number, while her puffed fur slowly settles. Then she opens her eyes and stands. Caption top left; her balloon short and decided.',
      caption: ['Tallyheart counts to ten. Slowly.'],
      say: [{ who: 'tallyheart', text: 'Show me.' }],
      next: 'f091a'
    },

    f091a: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'hide', 'scared', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('tallyheart', 'sit', 'kind', 'back-right', 'left'), c('riffle', 'sit', 'wonder', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. In the dark at the back, Sprinkle has hidden her face under her tail again, and big Tallyheart has sat down without a sound, very still, and counts her over with her eyes. Our cat and Riffle wait. Caption top left; Tallyheart’s balloon slow and wondering; the tail’s tiny reply.',
      caption: ['In the dark, Sprinkle hides her face under her tail. Tallyheart sits down without a sound.'],
      say: [
        { who: 'tallyheart', text: 'Four legs. Two wings. One tail. One… Mistscale.' },
        { who: 'sprinkle', name: 'The tail', text: 'Hello.' }
      ],
      next: 'f092a'
    },

    f092a: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'hide', 'shy', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('tallyheart', 'sit', 'kind', 'back-right', 'left'), c('riffle', 'sit', 'wonder', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Tallyheart leans a little closer to the hiding dragonet and speaks gently and plainly, her torn ear tipped forward. The tail twitches. Her balloon kind.',
      say: [{ who: 'tallyheart', text: 'Hello, little one. I’m Tallyheart. I count things.' }],
      next: 'f093a'
    },

    f093a: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'pawup', 'happy', 'dragon', 'left'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('tallyheart', 'sit', 'happy', 'back-right', 'left'), c('riffle', 'sit', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Sprinkle has come out from behind her tail and holds up a forepaw proudly, its five claws spread, and Tallyheart smiles. Our cat and Riffle grin at each other. Caption top left; Sprinkle’s balloon proud, Tallyheart’s warm.',
      caption: ['Sprinkle peeks out.'],
      say: [
        { who: 'sprinkle', text: 'I count claws. By FIVES.' },
        { who: 'tallyheart', text: 'Then we’ll get along.' }
      ],
      next: 'f094a'
    },

    f094a: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'shy', { x: 1000, y: 760 }, 'left'), c('tallyheart', 'sit', 'solemn', 'mud', 'left'),
         c('player', 'sit', 'worried', { x: 380, y: 945 }, 'right'), c('riffle', 'sit', 'worried', { x: 220, y: 958 }, 'right')], ['sunset']),
      board: 'WIDE, HER VIEW IN, SUNSET. Tallyheart sits between the dragonet and the way out and turns to our cat, very serious and thoughtful. A small inset shows the black-and-white apprentice pointing an accusing paw. Her balloon level and careful.',
      say: [{ who: 'tallyheart', text: 'Prey goes missing, and a hungry stranger turns up. Some cats would add that up too fast. So for now, this stays between us.' }],
      next: 'f095a'
    },

    f095a: {
      scene: S('bridge', 'back', BACK_BRANCH,
        [c('sprinkle', 'peek', 'wonder', 'dragon', 'left'), c('player', 'sit', 'wonder', 'back-left', 'right'),
         c('tallyheart', 'stand', 'proud', 'back-right', 'left'), c('riffle', 'sit', 'wonder', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Tallyheart has dragged a big fallen branch, forked and leafy, across the back of the nook, and Sprinkle peers over it, wide-eyed, only her head above the sticks; from outside it would look like an old heap of sticks. Caption top left; her balloon firm.',
      caption: ['She drags a fallen branch across the back, where Sprinkle sleeps. Now it looks like a heap of old sticks.'],
      say: [{ who: 'tallyheart', text: 'No cat comes under the Old Bridge. That’s the rule.' }],
      next: 'f096a'
    },

    f096a: {
      scene: S('bridge', 'back', BACK_BRANCH,
        [c('sprinkle', 'peek', 'shy', 'dragon', 'left'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('tallyheart', 'sit', 'kind', 'back-right', 'left'), c('riffle', 'sit', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Tallyheart turns and looks straight at our cat with a twinkle in her eye and the corner of a smile, and our cat grins sheepishly back. Sprinkle watches over the branch. Caption top left; her balloon dry.',
      caption: ['She looks at you.'],
      say: [{ who: 'tallyheart', text: 'Well. Almost no cat.' }],
      next: 'f097a'
    },

    f097a: {
      scene: S('bridge', 'back', BACK_BRANCH,
        [c('sprinkle', 'peek', 'shy', 'dragon', 'left'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('tallyheart', 'sit', 'proud', 'back-right', 'left'), c('riffle', 'stand', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Sprinkle confesses her appetite in a tiny voice from behind the branch, Riffle bounces with an idea, and Tallyheart sits up tall like an ambassador sending a message. Three balloons, the last one grand.',
      say: [
        { who: 'sprinkle', text: 'I eat ten fish at a meal.', kind: 'whisper' },
        { who: 'riffle', text: 'Granny has LOTS of fish!' },
        { who: 'tallyheart', text: 'Tell your granny that Tallyheart of CrystalClan is asking.' }
      ],
      next: 'f098a'
    },

    f098a: {
      scene: S('title', 'wide', {},
        [c('tallyheart', 'walk', 'kind', 'wall', 'left'), c('player', 'walk', 'happy', 'wall-2', 'left')], ['dusk']),
      board: 'WIDE, DUSK. Tallyheart and our cat walk home together along the old stone wall in the last of the light, the towers lighting up behind them, and she looks down at it with quiet pride. Caption top left; her balloon warm.',
      caption: ['On the way home…'],
      say: [{ who: 'tallyheart', text: 'You broke the rule. And then you came and told me. That took more courage than going in.' }],
      next: 'f103'
    },

    /* ------------------------------------------------------------------ Keeping the secret (ch3Told: false) */

    f087b: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'shy', 'dragon', 'left'), c('player', 'sit', 'solemn', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Our cat looks Sprinkle straight in her big amber eyes and makes its promise, one paw on its chest. Sprinkle’s face softens. Our cat’s balloon short and solemn.',
      say: [{ who: 'player', text: 'I won’t tell. Not anyone.' }],
      next: 'f088b'
    },

    f088b: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'curl', 'happy', 'dragon', 'left'), c('player', 'sit', 'happy', { x: 750, y: 822 }, 'right', { size: 0.9 }),
         c('riffle', 'sit', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, SUNSET. Sprinkle lies down and curls her long, long tail all the way round our cat, very gently, so it sits snug in a ring of soft grey scales, eyes closed with happiness. A wisp of mist drifts round them. Captions top left.',
      caption: ['Sprinkle wraps her tail around you, very gently.', 'It’s like being hugged by fog.'],
      next: 'f089b'
    },

    f089b: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'), c('player', 'sit', 'solemn', 'back-left', 'right'),
         c('riffle', 'hush', 'proud', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, COMEDY BEAT. Riffle swears his oath with a paw pressed over his mouth, then forgets and keeps chattering about clams, until our cat gives him a look; he clamps the paw back on. Sprinkle giggles. His balloons, our cat’s one word, then his muffled last one.',
      say: [
        { who: 'riffle', text: 'Otter’s honor. My mouth is SHUT. Shut like a clam. Clams are very—' },
        { who: 'player', text: 'Riffle.' },
        { who: 'riffle', text: 'Shut.' }
      ],
      next: 'f090b'
    },

    f090b: {
      scene: S('pile', 'low', merge(PILE, { vole: true }),
        [c('player', 'crouch', 'solemn', 'pile-left', 'right'), c('grizzled', 'crouch', 'kind', { x: 760, y: 1000 }, 'left')], ['sunset']),
      board: 'MEDIUM, SUNSET. Back in camp the pile glows orange under the bramble arch, and the grizzled old tom pushes one plump vole across to our cat with his nose. Our cat looks at it, then away toward the river, not eating. Caption across the top.',
      caption: ['But one otter can’t catch ten fish a meal. So at sunset, when the old tom pushes you a vole, you don’t eat it.'],
      next: 'f091b'
    },

    // Out of camp: she carries her supper from the pile toward the hedge, where the whole camp (and
    // Waffles, nineteen floors up) can see her; at the hedge she comes out into her old garden and
    // meets Tallyheart on the lawn, coming home from the wall at sunset (the told path's f088a)
    f091b: {
      scene: S('camp', 'reveal', {},
        [c('player', 'walk', 'solemn', 'entrance', 'left', { holds: 'vole' })], ['sunset']),
      board: 'WIDE, SUNSET. Across the golden camp, the fountain and the dens behind it, our cat pads away from the pile toward the hedge with the vole held carefully in its mouth, its shadow long on the grass. The glass towers rise behind, catching the sunset. Caption top left.',
      caption: ['You carry it toward the hedge.'],
      next: 'f092b'
    },

    f092b: {
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'shout', 'railing', 'left')], ['sunset']),
      board: 'LOW ANGLE, TALL PANEL. Straight up the glass tower at sunset: nineteen floors up, a tiny fluffy white head pokes over a balcony railing, beside a tiny wind chime, mouth wide open. Caption at the bottom; the shout balloons’ tails run all the way up to her.',
      caption: ['A voice shrieks from nineteen floors up.'],
      say: [
        { who: 'waffles', text: '{petname}! DARLING!', kind: 'shout' },
        { who: 'waffles', text: 'Why are you taking your SUPPER for a WALK?', kind: 'shout' }
      ],
      next: 'f093b'
    },

    f093b: {
      scene: S('garden', 'hedge', {},
        [c('tallyheart', 'sit', 'wonder', 'hedge-side', 'right'), c('player', 'stand', 'scared', 'hedge-gap', 'left', { holds: 'vole' })], ['sunset']),
      board: 'MEDIUM, SUNSET. Our cat comes out through the gap in the hedge into its old garden, and there on the lawn, right in front of its nose, sits big ginger Tallyheart, coming home. It freezes, half out of the gap, the vole in its mouth. Caption top left; her balloon a question; the choices sit below the panel.',
      caption: ['It’s Tallyheart.'],
      say: [{ who: 'tallyheart', text: '{name}paw?' }],
      choice: {
        options: [
          { label: 'Say, “Mmmf.”', sets: {}, next: 'f094e' },
          { label: 'Hold very, very still.', sets: {}, next: 'f094f' }
        ]
      }
    },

    f094e: {
      scene: S('garden', 'hedge', {},
        [c('tallyheart', 'sit', 'wonder', 'hedge-side', 'right'), c('player', 'stand', 'worried', 'hedge-gap', 'left', { holds: 'vole' })], ['sunset']),
      board: 'MEDIUM, COMEDY BEAT. Tallyheart tilts her head, puzzled, and our cat answers through a mouthful of vole, cheeks bulging, perfectly serious. Two balloons, the second muffled and lumpy.',
      say: [
        { who: 'tallyheart', text: 'What?' },
        { who: 'player', text: 'Mmmf mmf.' }
      ],
      next: 'f095b'
    },

    f094f: {
      scene: S('garden', 'hedge', {},
        [c('tallyheart', 'sit', 'solemn', 'hedge-side', 'right'), c('player', 'stand', 'worried', 'hedge-gap', 'left', { holds: 'vole' })], ['sunset']),
      board: 'MEDIUM, COMEDY BEAT. Our cat stands frozen like a statue, eyes wide, not breathing, the vole dangling very obviously from its mouth, while Tallyheart looks at the vole and then at our cat. One caption, deadpan.',
      caption: ['It doesn’t help. You’re holding a vole.'],
      next: 'f095b'
    },

    f095b: {
      scene: S('garden', 'hedge', {},
        [c('tallyheart', 'sit', 'sniff', 'hedge-side', 'right'), c('player', 'stand', 'worried', 'hedge-gap', 'left', { holds: 'vole' })], ['sunset']),
      board: 'MEDIUM. Tallyheart leans in and sniffs our cat’s fur, little sniff lines curling up, and her whiskers twitch at a smell of river and fish. Our cat tries to look innocent. Caption top left; her balloon dry.',
      caption: ['Tallyheart sniffs you.'],
      say: [{ who: 'tallyheart', text: 'You smell of fish. Been with that otter again?' }],
      next: 'f096b'
    },

    f096b: {
      // close at the gap, framed on our cat (first in the cast): the nod has to read on its face
      scene: S('garden', 'hedge-close', {},
        [c('player', 'stand', 'shy', 'hedge-gap', 'left', { holds: 'vole' }), c('tallyheart', 'sit', 'solemn', 'hedge-side', 'right')], ['sunset']),
      board: 'CLOSE-UP, SUNSET, THE TWO OF THEM AT THE GAP. Our cat nods, eyes down, the vole bobbing, and the nod is true; but a small thought bubble beside it holds a big grey dragonet curled in the dark under the bridge, the part it is not saying. Captions top left, the last one quieter.',
      caption: ['You nod. It’s true. It just isn’t all of it.'],
      next: 'f097b'
    },

    f097b: {
      scene: S('garden', 'hedge', {},
        [c('tallyheart', 'sit', 'solemn', 'hedge-side', 'right'), c('player', 'stand', 'worried', 'hedge-gap', 'left', { holds: 'vole' })], ['sunset']),
      board: 'MEDIUM. Tallyheart’s torn ear twitches once, and she gives our cat a long, steady look that sees more than it says. Then she steps aside to let it pass. Caption top left; her balloon short.',
      caption: ['Her torn ear twitches. For a long moment, she just looks at you.'],
      say: [{ who: 'tallyheart', text: 'Back before dark.' }],
      next: 'f098b'
    },

    f098b: {
      scene: S('pile', 'wide', PILE,
        [c('grizzled', 'lie', 'stern', 'beside', 'left'), c('clancat', 'crouch', 'happy', 'crowd-1', 'right', { variant: 2 }),
         c('clancat', 'sit', 'neutral', 'crowd-3', 'left', { variant: 4 })], ['sunset']),
      board: 'WIDE, CUTAWAY. Supper by the pile in the last of the sunset: Clan cats eat their share, and the grizzled old tom, lying by the stacks, snorts through his whiskers at the very idea of carrying supper about. Caption top left; his balloon grumpy.',
      caption: ['The old tom snorts.'],
      say: [{ who: 'grizzled', text: 'In MY day, we ATE our prey.' }],
      next: 'f099b'
    },

    f099b: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'gulp', 'happy', 'dragon', 'left'), c('player', 'sit', 'happy', 'back-left', 'right')], ['dusk']),
      board: 'MEDIUM, DUSK. Under the bridge in the soft rose light, Sprinkle tips her head back and swallows the whole vole in one gulp, then makes a polite, thoughtful face. Our cat watches, pleased. Caption top left; her balloon careful.',
      caption: ['Under the bridge, Sprinkle swallows the vole in one gulp.'],
      say: [{ who: 'sprinkle', text: 'It’s very… furry. Thank you.' }],
      next: 'f100b'
    },

    f100b: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('riffle', 'stand', 'proud', 'near', 'right', { holds: 'fish2' })], ['dusk']),
      board: 'MEDIUM, DUSK, COMEDY BEAT. Riffle pops up dripping from the river side with two fish crossways in his mouth, very proud, and tries to talk through them. Sprinkle’s eyes light up. SPLOOSH! at the water, caption top left, his balloon squashed.',
      caption: ['Riffle pops up with two fish in his mouth.'],
      sfx: 'SPLOOSH!',
      say: [{ who: 'riffle', text: 'Dewivewy!' }],
      next: 'f101b'
    },

    f101b: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'laugh', 'dragon', 'left'), c('player', 'sit', 'laugh', 'back-left', 'right'),
         c('riffle', 'stand', 'happy', 'near', 'right', { holds: 'fish2' })], ['dusk']),
      board: 'MEDIUM, DUSK. Riffle stands proudly holding out his two fish like a waiter, while Sprinkle and our cat laugh. A tiny inset shows a delivery parcel with a bow. One caption at the top.',
      caption: ['He means “Delivery!”'],
      next: 'f102b'
    },

    f102b: {
      scene: S('title', 'wide', {},
        [c('player', 'walk', 'worried', 'wall', 'left'), c('moth', 'fly', null, { x: 1050, y: 700 }, 'left', { size: 1.9 }),
         c('moth', 'fly', null, { x: 1180, y: 640 }, 'left', { size: 1.5 })], ['dusk']),
      board: 'WIDE, DUSK. Our cat runs home alone along the old stone wall in the falling dark, its heart thumping, drawn as little beat lines. Only two pale moths flutter beside it, and the towers light up behind. Caption top left; relief, not fear.',
      caption: ['You run home through the dusk, your heart thumping. Only the moths come with you.'],
      next: 'f103'
    },

    /* ------------------------------------------------------------------ Home */

    f103: {
      scene: S('den', 'inside', DEN,
        // she leans out of her own nest to the empty middle ring, her nose at its rim
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'crouch', 'sniff', { x: 880, y: 884 }, 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. The tortoiseshell’s old nest, the middle one, is an empty ring of moss now, and our cat leans over to it from its own nest and touches its nose to the moss, wistful. The grey tom sleeps; no moon, only starlight through the rose leaves. Captions top left.',
      caption: ['Back in the den, {Murmur}chime’s nest is empty. She sleeps with the warriors now.', 'You touch your nose to her old moss. One day.'],
      next: 'f104'
    },

    f104: {
      scene: S('den', 'nest', DEN,
        [c('player', 'loaf', 'wonder', 'nest', 'right')], ['night']),
      board: 'CLOSE-UP. Our cat settles in its own nest in the dark, Riffle’s nearly black stone with its white band right where it was put. A thought bubble holds a different stone, egg-smooth and grey, held in a big grey paw. Captions top left.',
      caption: [
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' },
        'You think of another stone, plain and grey, in a dragonet’s claws. Tonight, she’s a little less hungry.'
      ],
      next: 'f105'
    },

    f105: {
      scene: S('den', 'inside', DEN,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'lie', 'wonder', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN. Our cat lies awake with its eyes open, a small secret drawn as a light little bubble, or a wriggling one, over its head. From somewhere across the dark camp a faint, sleepy voice drifts in. Captions top left, the voice’s balloon pale.',
      caption: [
        { when: { ch3Told: true }, text: 'Tallyheart knows. Riffle knows. A secret shared feels lighter.' },
        { when: { ch3Told: false }, text: 'Only you and Riffle know. The secret is small, but it wriggles.' },
        'Then, from across camp, faint and sleepy:'
      ],
      say: [{ who: 'murmurchime', text: 'Nine times nine, eighty-one… Nine times nine… Mice…', kind: 'whisper' }],
      next: 'f106'
    },

    f106: {
      scene: S('den', 'nest', DEN,
        [c('player', 'loaf', 'happy', 'nest', 'right')], ['night']),
      board: 'CLOSE-UP, IN THE DARK, THE TAP PICTURE. Our cat smiles in its nest and pats its two forepaws on the moss, one, then the other, murmuring. In play the counting picture takes the panel: its own two forepaws on dark moss, the glow taking turns, left, right; each tap lights that paw’s five claws, and the number goes into its murmur. Captions at the top.',
      caption: ['Even warriors practice.', 'In the dark, you tap your forepaws on the moss, one, then the other.'],
      skip: { table: 5, groups: 4, paws: 'own', next: 'f107' }
    },

    f107: {
      scene: S('den', 'inside', DEN,
        [c('snorer', 'lie', 'stern', 'sleeper-1', 'right', { moss: true }), c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, COMEDY BEAT. A big 20 floats over the dark, and in the next nest the skinny grey tom drags the moss back over his ears with a groan. Our cat grins into its paws. Caption top left; his balloon long-suffering.',
      caption: ['From the next nest, the skinny grey tom groans.'],
      say: [{ who: 'snorer', text: 'Oh no. Not ANOTHER one.' }],
      next: 'f108'
    },

    f108: {
      scene: S('riverbank', 'path', {}, [], ['night', 'stars']),
      board: 'WIDE, NIGHT. The river path in the dark, nobody on it: the water still and black, the glass towers’ windows lit, and far up on the tallest tower a little red light blinking. Here and there along the water and up among the rooftops, tiny question marks hang in the night. Caption across the top.',
      caption: ['Somewhere along the river, six more dragonets are waiting to be found. And one of them hiccups when he roars.'],
      next: 'f109'
    },

    f109: {
      scene: S('den', 'outside', DEN, [], ['night', 'stars', 'skyriver']),
      board: 'WIDE. The rosebush den from outside under a clear night sky: the Sky River pours across it from corner to corner, with no moon anywhere, and a soft glow of moss inside the den. Everything is still. Caption at the bottom.',
      caption: ['Over the rosebush, the Sky River shines, and you fall asleep.'],
      next: 'f110'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f110: {
      scene: S('den', 'nest', DEN,
        [c('player', 'curl', 'sleepy', 'nest', 'right')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside Riffle’s stone, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream about, the night {they} met Sprinkle?'],
      // short enough for one line in the box (the default wraps and clips on an iPad)
      input: { kind: 'dream', placeholder: 'Sprinkle… ten fish… a hiccup…', next: 'f111' }
    },

    f111: {
      scene: S('den', 'doorway', DEN,
        [c('player', 'curl', 'sleepy', 'nest', 'right')], ['night', 'stars', 'skyriver', 'zzz']),
      board: 'WIDE CLOSING SHOT, FROM INSIDE THE DEN. Our cat sleeps curled in its moss nest with Riffle’s striped stone tucked where it was put, and through the doorway the Sky River shines over the rosebush, with no moon. One tiny contented zzz. Caption at the bottom, with END OF CHAPTER THREE lettered like a title.',
      caption: [
        'You sleep warm in your nest, with Riffle’s stone in the moss and the Sky River shining over the rosebush.',
        'End of Chapter Three.'
      ],
      end: true
    }
  };

  // The two paths are written one after the other above; the chapter lists every frame in id order
  // (f087a, f087b, f088a…), the reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* Chapter 2's ears lines, for the warm-up (the text: "Chapter 2's ears praise, fast, fastAfterMiss,
   * help and remembered / rememberedSlow lines"). */
  var EARS_PRAISE = [
    'You hopped it!',
    'Two by two, like a real hunter.',
    'Yes! Two ears for every cat.',
    'Two ears, every time.',
    'Ears are trickier than tails, and you’re doing it anyway.'
  ];
  var EARS_FAST = [
    'You didn’t even have to hop that time.',
    'Quick as a pounce!',
    'You knew that one before I finished asking.'
  ];
  // chapter 2's ears `fastAfterMiss`, which says scratches: true at the den doorway too
  var EARS_AFTER_MISS = ['Ha! You didn’t even look at the scratches that time.'];
  var EARS_HELP = 'Close. Let’s scratch it out together: two lines for every cat, like ears.';

  PC.story.ch03 = {
    id: 'ch03',
    number: 3,
    title: 'Under the Old Bridge',
    start: 'f001',
    // the tortie's label until Glintstar names her (then she is `murmurchime`): Murmurpaw, or
    // Mutterpaw for a player whose own Clan name is Murmur
    names: { mutterer: '{Murmur}paw' },
    frames: ordered,

    counts: {
      // The warm-up on the 2s: 4 × 2, then 6 × 2, or the 2s fact that was hardest for her in
      // chapter 2 (warmHard: it takes question 2). The opener is never one of her top hard facts nor
      // the hard fact's pair: the first of 2 × 3, 2 × 2 and 2 × 1 that is neither opens instead. It
      // stays off the pile's two pairs (avoid), for its hard fact and for what it borrows. No closing
      // screen: "Now, count the prey pile" carries her on. Help is scratched in the earth by the doorway.
      'ch03-ears': {
        table: 2, thing: 'ear', things: 'ears', teacher: 'tallyheart',
        facts: [[4, 2], [6, 2]],
        warmHard: { table: 2, at: 1, alt: [[2, 3], [2, 2], [2, 1]] },
        avoid: [[9, 2], [7, 2]],
        ground: 'earth',
        fillFrom: 'ch02-ears',
        fillIntro: 'One from yesterday.',
        ask: '{a} × {b}',
        praise: EARS_PRAISE,
        fast: EARS_FAST,
        fastAfterMiss: EARS_AFTER_MISS,
        helpIntro: EARS_HELP,
        helpIntroFar: 'Let’s scratch it out together: two lines for every cat, like ears.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.',
        done: null
      },

      // The pile, one Counts moment: the old tom's sunset count (nine pairs, in a thought cloud), then
      // her own count of this morning's pile (seven pairs, its stacks lit one at a time as she noses
      // them). No praise and no closing screen: the story answers. A miss borrows yesterday's ears.
      'ch03-pile': {
        table: 2, thing: 'piece', things: 'pieces', unit: 'pair', units: 'pairs', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'stacks' },
        fillFrom: 'ch02-ears',
        fillIntro: 'One from yesterday.',
        facts: [
          { a: 9, b: 2, picture: { kind: 'prey', layout: 'stacks', thought: true },
            prompt: [{ who: 'grizzled', text: 'Nine pairs. How many pieces?' }],
            right: [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'Right.' }],
            rightAgain: true },
          // the text's narration, lettered as caption boxes above the keypad; its clock runs over them
          { a: 7, b: 2, light: 'groups', check: true,
            prompt: [{ kind: 'caption', text: 'You touch your nose to each little stack.' },
              { kind: 'caption', text: 'One pair. Two pairs… Seven pairs. And that’s all. How many pieces?' }] }
        ],
        ask: '{a} × {b}',
        praise: [],
        helpIntro: 'Close. Let’s scratch it out: two marks for every pair.',
        helpIntroFar: 'Let’s scratch it out: two marks for every pair.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        again: ['There it is. You remembered that one.'],
        done: null
      },

      // The lesson: the 5s, ten answers in both orders; every number from 1 to 10 once (5 in 5 × 5).
      // After the bridged 5 × 6, no answer is the one before plus or minus five.
      'ch03-claws': {
        table: 5, thing: 'claw', things: 'claws', unit: 'paw', units: 'paws', teacher: 'tallyheart',
        facts: [
          // the first four paws on the rim, the ones she just tapped (twenty claws): she has just
          // hopped them, so it's always the text's "You hopped it!", never "didn't even have to hop"
          { a: 4, b: 5, who: RIM.slice(0, 4), right: [{ who: 'tallyheart', text: 'You hopped it!' }], rightAgain: true },
          { a: 5, b: 2, right: [{ who: 'tallyheart', text: 'Ten! Two paws, five claws each. Yesterday it was five cats, two ears each. Same ten!' }],
            rightAgain: true },
          [1, 5], [5, 5],
          // the first past twenty-five: hop on from it (the first five paws' claws glow as it is asked)
          { a: 5, b: 6, lit: 25, prompt: 'Six paws. The first five have twenty-five claws. Now hop on from twenty-five!', retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Thirty! {Murmur}chime knew it the other way around this morning. Now you know both.' }],
            rightAgain: true },
          [5, 8], [5, 3], [9, 5], [7, 5], [10, 5]
        ],
        firstPrompt: 'How many claws on the first four paws?',
        ask: '{a} × {b}',
        // "You hopped it!" is 4 × 5's own line, so it comes last here, not again two questions later
        praise: [
          'Hopping by fives, like a real hunter.',
          'Yes! Five claws on every forepaw.',
          'Claws are trickier than ears, and you’re doing it anyway.',
          'Hop, hop, hop!',
          'You hopped it!'
        ],
        fast: [
          'You didn’t even have to hop that time.',
          'Quick as a pounce!',
          'You knew that one before I finished asking.'
        ],
        fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
        helpIntro: 'Close. Let’s scratch it out together: one swipe for every paw, five lines a swipe.',
        helpIntroFar: 'Let’s scratch it out together: one swipe for every paw, five lines a swipe.',
        helpIntroNotFive: 'Remember: hopping by fives, every number ends in a five or a zero. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        done: 'That’s the fives.'
      },

      // Sprinkle's dinner: her two forepaws, claws spread. The player teaches her to hop. A miss is
      // swiped in the mud by Sprinkle and hopped by the player; it comes back in Sprinkle's words, with
      // this morning's claws in between, the easiest first, in Sprinkle's own cheerful voice.
      'ch03-dinner': {
        table: 5, thing: 'fish', things: 'fish', unit: 'forepaw', units: 'forepaws', teacher: 'sprinkle',
        facts: [
          { a: 2, b: 5, who: [{ who: 'sprinkle' }, { who: 'sprinkle' }],
            prompt: [{ who: 'player', text: 'Hop by fives!' }, { kind: 'caption', text: 'Two forepaws, five claws each. How many fish at a meal?' }],
            retryPrompt: 'Two forepaws, five claws each. How many fish at a meal?',
            right: [{ who: 'sprinkle', text: 'TEN! How did you DO that?' }, { who: 'player', text: 'Five, ten. Hopping!' }],
            rightAgain: [{ who: 'sprinkle', text: 'TEN! Hopping really works!' }] }
        ],
        ground: 'mud',
        helpCounter: 'you',
        helpIntro: 'Let’s scratch it in the mud. You hop!',
        fillFrom: 'ch03-claws',
        fillIntro: 'Count another one with me.',
        fillOrder: 'easiest',
        fillVoice: 'borrower',
        againIntro: 'Let’s count my dinner again!',
        ask: '{a} × {b}',
        praise: ['Hop, hop, hop! Like you showed me.', 'My claws say yes!'],
        fast: ['Even faster than Mama!'],
        fastAfterMiss: ['You didn’t even look at the mud!'],
        again: ['You remembered! I knew you would.'],
        miss: 'There! We’ll count that one again soon.',
        missLast: 'There. Now we’ve counted it together.',
        done: null
      },

      // Six forepaws in the mud, one for each brother and sister. Two screens after a misty tear, so
      // it speaks quietly, with lines of its own and no Mama line.
      'ch03-six': {
        table: 5, thing: 'claw', things: 'claws', unit: 'forepaw', units: 'forepaws', teacher: 'sprinkle',
        picture: { kind: 'mud' },
        facts: [
          { a: 6, b: 5,
            prompt: [{ kind: 'caption', text: 'Six forepaws, five claws each. How many claws in the mud?' }],
            right: [{ who: 'sprinkle', text: 'Thirty claws.', kind: 'whisper' }],
            rightAgain: true }
        ],
        ground: 'mud',
        helpCounter: 'you',
        helpIntro: 'Let’s scratch it in the mud. You hop!',
        fillFrom: 'ch03-claws',
        fillIntro: 'Count another one with me.',
        fillOrder: 'easiest',
        fillVoice: 'borrower',
        againIntro: 'Let’s count them again.',
        ask: '{a} × {b}',
        praise: ['Yes. Five claws each.'],
        fast: ['You knew that one.'],
        fastAfterMiss: ['You knew that one.'],
        again: ['Yes. Five claws each.'],
        miss: 'There. We’ll count them again in a moment.',
        missLast: 'There. Now we’ve counted them together.',
        done: null
      }
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'Under the Old Bridge',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: 'After all that, {name}paw’s dream stayed a secret too.',
      recap: [
        { text: 'On {name}paw’s second morning, the pile was short again: four more pieces gone, eight in two nights.' },
        { text: '{They} watched {Murmur}paw answer the Warrior Counts in front of the whole Clan and become {Murmur}chime, and Tallyheart said, ‘One day, that’ll be you.’' },
        { text: 'Tallyheart taught {name}paw {their} third Count, the claws, and scratched a third claw mark on the tree.' },
        { text: 'Under the Old Bridge, {they} found Sprinkle, a Mistscale dragonet with a hurt wing, who eats ten fish at a meal.' },
        { text: 'Sprinkle’s six brothers and sisters are somewhere along the river.' },

        { when: { ch3Told: true }, text: '{name}paw told Tallyheart, and Tallyheart helped hide Sprinkle behind a fallen branch.' },
        { when: { ch3Told: false }, text: '{name}paw kept Sprinkle’s secret, carried {their} own supper to the bridge, and nearly got caught.' },

        { text: 'That night, {name}paw fell asleep counting claws.' }
      ],
      // the first of the seven dragonets' pages (module-1, "Her book"): found by everyone in this chapter
      dragonet: {
        id: 'sprinkle',
        name: 'Sprinkle',
        lines: [
          'A Mistscale dragonet, as big as a heron, with scales the color of mist.',
          '{name}paw found her under the Old Bridge, with a hurt wing and an empty tummy.',
          'She eats ten fish at a meal, and now she counts her claws by fives.'
        ]
      }
    },

    teaser: {
      title: 'Chapter 4: The Glittering Scale',
      lines: [
        'Tomorrow, Tallyheart has a new Count for you: both forepaws.',
        'And somewhere high above the river, someone hiccups.'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
