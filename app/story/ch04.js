/* Chapter 4: The Glittering Scale.
 *
 * The text (docs/chapters/04-the-glittering-scale.md, v0.4) cut into graphic-novel panels, per the
 * frame contract in docs/build.md (its sections "Chapter 2 (v0.3)", "Chapter 3 (v0.4)" and "Chapter 4
 * (v0.4)"; the text's "Build" notes are the spec for the Counts sets, the Case File's cards and the
 * pages she taps). Each frame is one moment: a drawn scene, a written storyboard (`board`) for a
 * future illustrator, short captions, speech balloons and sound effects, and exactly one interaction.
 * Frame ids run in reading order; a light choice's two outcomes carry a letter each (f029a, f029b)
 * and rejoin at the next number. The tower choice (f075) splits the afternoon in two branches that
 * run side by side under the same numbers: going up is `a` (f076a…f089a: the way up, then the roof),
 * "Not today" is `b` (f076b…f078b), and both go on to f090, under the Old Bridge.
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line that reacts to a
 * balloon goes in the next panel, and a choice's spoken option is not echoed as a balloon (the label
 * already said it). A line the text marks [if …] carries a `when`. Where a flag changes the picture
 * and not only a line, the panel is a frame with a `when` (a plain number, like chapter 3's f081;
 * the page turns straight past it for everyone else):
 *   ch3Told       f003 (her wink) or f004 (you sniff your paws); f058 (the whisper on the way home);
 *                 f070 (her errand) or f071 (your own reason); f090 (the eyes over her branch) or
 *                 f091 (the eyes in the dark)
 *   specialty     f043 (noticing: the catch, which sets `ch4CaughtFly` for good), f068 (noticing:
 *                 over the bark, a whisper if she told, a caption if she kept), f100 (noticing and
 *                 kept: "I WISH"), f076a (a climber's way up) or f077a and f078a (everyone else's),
 *                 f107 (a swimmer without the water worry)
 *   worry         f106 (water: the raft, by whether she swims)
 *   foundSquall   f093 ("Five and five"), f108 to f110 ("Raft first"), and f113, the den, for a cat
 *                 who kept the secret or who told and found him (`not: { ch3Told: true, foundSquall:
 *                 false }`). The roof's last frame, f089a, sets it, for good.
 *
 * Voices heard and not seen: the hiccup at sunrise and at bedtime is a sound effect; the new warrior
 * shouts from outside the panel (f031); "somebody" mutters from the back of the Clan (f047); the
 * bridge's `paws` close-up has nobody in it but paws (f103, f104). Reynard is "The fox" and Squall
 * "The little dragon" (the chapter's `names`, which a lesson's lines read too) until each is named on
 * screen; from then on his balloons carry `name`.
 *
 * Her Case File: a frame's `card` gives a card and shows it under the panel (f062, f066, f067,
 * f087a, f098, f115); the row of bark (f063) gives two or three more as she taps them.
 *
 * Text conventions: second person, present tense ("you"); typographic apostrophes and quotes
 * (’ “ ” …) so nothing needs escaping. Time of day comes from fx: `morning` from the hiccup to the
 * pile, `day` from the border to the bridge, `sunset` at tonight's pile, `dusk` at the den (the one
 * moon so far: thin, low, and only from outside), `night` in her nest (no moon). The roof alone names
 * no time of day: it is drawn in its own afternoon gold. Every bridge `under` and `back` scene draws
 * Sprinkle's prints beside the drag marks (`prints: true`). In her nest at bedtime she faces left in
 * every panel, so her row of bark stays on one side. tests/story-ch04.test.js checks all of this;
 * tools/storyboard.mjs turns it into docs/storyboard/ch04.md.
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
   * question's picture): four Clan cats and last the grizzled old tom. Never chapter 3's list:
   * Murmurchime sat second there, and today she is on patrol until she skids into camp. */
  var RIM = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 2 }, { who: 'clancat', variant: 3 },
    { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  // On the rim, sitting up, both forepaws raised, claws out. In the `lesson` camera the cats at
  // `sand-left` and `sand-right` sit right in front of `rim-2` and `rim-4`, so `close` leaves those
  // two out (hidden there anyway). `tom`: the old tom's mood.
  function rim(close, tom) {
    var out = [c('clancat', 'situp', 'proud', 'rim-1', 'right', { variant: 1 })];
    if (!close) out.push(c('clancat', 'situp', 'happy', 'rim-2', 'right', { variant: 2 }));
    out.push(c('clancat', 'situp', 'neutral', 'rim-3', 'left', { variant: 3 }));
    if (!close) out.push(c('clancat', 'situp', 'proud', 'rim-4', 'left', { variant: 5 }));
    out.push(c('grizzled', 'situp', tom || 'stern', 'rim-5', 'left'));
    return out;
  }
  // FLUMP: the same five in a heap (the hollow's `heap: true` closes the rim spots into a pile;
  // listed first to fifth, which is the order they are drawn in)
  function heap() {
    return [c('clancat', 'flat', 'wonder', 'rim-1', 'right', { variant: 1 }), c('clancat', 'lie', 'laugh', 'rim-2', 'right', { variant: 2 }),
      c('clancat', 'tummy', 'happy', 'rim-3', 'left', { variant: 3 }), c('clancat', 'fall', 'laugh', 'rim-4', 'left', { variant: 5 }),
      c('grizzled', 'flat', 'stern', 'rim-5', 'left')];
  }
  // The four behind Glintstar at the border, left to right: the old tom, the black-and-white
  // apprentice, the grey tom and Murmurchime (moods in that order; `turn`: the two on our cat's right
  // look back at her)
  function clan4(a, b, d, e, turn) {
    return [c('grizzled', 'sit', a, 'back-1', 'right'), c('snorter', 'sit', b, 'back-2', 'right'),
      c('snorer', 'sit', d, 'back-3', turn ? 'left' : 'right'), c('murmurchime', 'sit', e, 'back-4', turn ? 'left' : 'right')];
  }

  // Scene options that stay the same through a place
  // The den: no moon at night (night four after a new moon: a thin crescent at dusk, set by bedtime),
  // and Riffle's stone where she put it in chapter 2 (`stone: 'auto'`)
  var DEN = { weather: 'clear', moon: false, stone: 'auto' };
  // the dusk panels from outside: the young moon, thin as a curl of bark, low over the towers
  var DEN_DUSK = { weather: 'clear', moon: true, stone: 'auto' };
  // from "skritch, skritch": her Case File along the mossy edge of her nest (`bark: 'auto'`: as many
  // pieces as she holds cards); from the wing card on, the two about Sprinkle under the moss
  var DEN_BARK = merge(DEN, { bark: 'auto' });
  var DEN_HID = merge(DEN, { bark: 'auto', hidden: true });
  // the tree: three marks until Tallyheart scratches the fourth (f016)
  var H3 = { marks: 3, glow: 'auto' };
  var H4 = { marks: 4, glow: 'auto' };
  // The row of bark on the sand after the bark Tap (f063), as she has scratched it by each panel: the
  // Tap's own list (a noticing cat's has the dug earth), then the fox's two as she scratches them. A
  // list, not every card she holds, so a second reading still shows this scene's row
  // (E.resolveScene keeps the entries that are hers and hands the art each picture and mark)
  var ROW = ['four-a-night', 'tidy', { id: 'dug-earth', when: { specialty: 'noticing' } }, 'scale'];
  var ROW_FLEW = ROW.concat('fox-flew'), ROW_MOON = ROW.concat('fox-flew', 'fox-moon');
  // The third morning's pile, Tallyheart's way: three rows of ten, the back row with four empty
  // places right in its middle. Until our cat walks round to it (f020) the back row is a dark band in
  // the brambles' shadow; then the gap, and the dug earth behind it; and from the frame where the sun
  // reaches it (f024) the "scale", leaning in the gap, glinting
  var ROWS = [10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  var PILE_SHADE = { rows: ROWS, back: 'shadow' };
  var PILE_GAP = { rows: ROWS, dug: 'big' };
  var PILE_SUN = { rows: ROWS, dug: 'big', scale: true, glint: true };
  // tonight: four full rows, laid a little forward of the "scale", which lies where it was found,
  // beside this morning's dug earth
  var PILE_NIGHT = { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' };
  // the tower from below: Waffles' wind chime, and (from the roar on) the red light at the very top
  var TOWER = { chime: true };
  var TOWER_LIT = { chime: true, light: true };
  // The Old Bridge from the bank: no drag marks (they lie in the dark under the deck). Inside the
  // dark: the drag marks (the set's default) and, beside them, Sprinkle's big prints; on the told
  // path's first panel, Tallyheart's branch still heaped across the back
  var BANK = { drag: false };
  var UNDER = { prints: true };
  var BACK = { prints: true };
  var BACK_BRANCH = { prints: true, branch: true };

  var frames = {

    /* ------------------------------------------------------------------ A hiccup, and a new rule */

    f001: {
      scene: S('den', 'nest', DEN,
        [c('player', 'loaf', 'sleepy', 'nest', 'right', { wink: true })], ['morning']),
      board: 'CLOSE-UP, SUNRISE. Our cat lies tucked in its moss nest in the first grey-gold light, one eye open and the other still shut, Riffle’s stone where it was put. A tiny hiccup is lettered small, high and far away at the top of the panel, as if it had drifted in from the sky. Caption below it.',
      sfx: '…hic!',
      caption: ['You open one eye. Was that a hiccup, far away and very high up?'],
      next: 'f002'
    },

    f002: {
      scene: S('den', 'inside', DEN,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'sit', 'wonder', 'nest', 'right'),
         c('tallyheart', 'crouch', 'happy', 'doorway', 'left')], ['morning', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, SUNRISE. Morning light pours in at the doorway, where big ginger Tallyheart pokes her head in, grinning; the grey tom sleeps on, and the middle nest is an empty ring of moss. Our cat sits up in its nest and blinks at her. Caption top left; her balloon bright and bouncy.',
      caption: ['Tallyheart pokes her head in at the doorway.'],
      say: [{ who: 'tallyheart', text: 'Up, {name}paw! Up, up, up!' }],
      next: 'f003'
    },

    f003: {
      when: { ch3Told: true },
      scene: S('den', 'doorway', DEN,
        [c('tallyheart', 'crouch', 'kind', 'doorway', 'left', { wink: true }), c('player', 'sit', 'happy', 'nest', 'right')], ['morning']),
      board: 'MEDIUM, FROM INSIDE THE DEN, THE TOLD PATH ONLY. In the bright doorway Tallyheart shuts one amber eye in a slow, deliberate wink, just for our cat, and our cat grins back from its nest. Nobody else is awake to see it. One caption at the top.',
      caption: ['She gives you a slow wink. You two share a secret now.'],
      next: 'f004'
    },

    f004: {
      when: { ch3Told: false },
      scene: S('den', 'nest', DEN,
        [c('player', 'crouch', 'sniff', 'nest', 'right')], ['morning']),
      board: 'CLOSE-UP, THE KEPT PATH ONLY. Our cat crouches in its nest with its nose down at its own forepaws, sniffing them anxiously, little sniff lines curling up. Later art: a faint fish shape in the sniff lines. One caption at the top.',
      caption: ['You sniff your paws. Do they still smell of fish?'],
      next: 'f005'
    },

    f005: {
      scene: S('den', 'inside', DEN,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'sit', 'wonder', 'nest', 'right'),
         c('tallyheart', 'pawup', 'proud', 'doorway', 'left')], ['morning']),
      board: 'WIDE, INSIDE THE DEN. Tallyheart sits in the doorway with one paw raised like a teacher making a point, very pleased with herself, and a small inset shows her idea: prey laid out in neat rows of ten with one piece missing, the gap plain to see. Our cat listens from its nest. Her two balloons, the second one proud.',
      say: [
        { who: 'tallyheart', text: 'Eight pieces gone in two nights. So I made a rule.' },
        { who: 'tallyheart', text: 'Rows of ten! Then if anything’s missing, a gap shows in a heartbeat.' }
      ],
      next: 'f006'
    },

    f006: {
      scene: S('den', 'doorway', DEN,
        [c('tallyheart', 'stand', 'kind', 'doorway', 'left'), c('player', 'stand', 'wonder', 'nest', 'right')], ['morning']),
      board: 'MEDIUM, FROM INSIDE THE DEN. Tallyheart stands in the bright doorway, already half turned to go, and our cat is up on all four paws in its nest with its eyes wide. The camp is green and gold behind her. Three balloons: hers brisk, our cat’s small and amazed, and her last one already on its way out.',
      say: [
        { who: 'tallyheart', text: 'The hunters stacked it my way last night. And Glintstar wants you to count the rows.' },
        { who: 'player', text: 'By TENS?' },
        { who: 'tallyheart', text: 'Both forepaws today. Come on!' }
      ],
      next: 'f007'
    },


    /* ------------------------------------------------------------------ Both forepaws */

    f007: {
      scene: S('hollow', 'lesson', H3,
        [c('tallyheart', 'pawup', 'proud', 'sand-left', 'right', { claws: true }), c('player', 'sit', 'happy', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM, THEN THE COUNTS. In the sandy Training Hollow, three claw marks on the leaning tree behind them, Tallyheart holds up one forepaw with its five claws out and our cat sits ready. For the warm-up a picture of forepaws in a row, five claws each, appears; after a miss she swipes the sand once a paw and hops along by fives. Her balloon at the top; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Claws first, to wake up your whiskers.' }],
      counts: { set: 'ch04-claws', next: 'f008' }
    },

    f008: {
      scene: S('hollow', 'lesson', H3,
        [c('tallyheart', 'situp', 'proud', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM, LESSON. Tallyheart sits up on her haunches like a huge ginger squirrel and holds out both forepaws toward our cat, all ten claws flicking out at once. Our cat’s eyes go from one paw to the other. Caption top left, a small SHHNK! by each paw, then her two balloons.',
      caption: ['Tallyheart sits up and holds out both forepaws.'],
      sfx: 'Shhnk! Shhnk!',
      say: [
        { who: 'tallyheart', text: 'Two forepaws. Ten claws.' },
        { who: 'tallyheart', text: 'Hold on to that ten. Today’s Count is made of it.' }
      ],
      next: 'f009'
    },

    f009: {
      scene: S('hollow', 'lesson', H3,
        [c('tallyheart', 'situp', 'happy', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM, A QUIET BEAT. Tallyheart still sits up with both forepaws out, and above our cat’s head a small thought bubble holds a big grey dragonet happily gulping fish, one for every claw. On the told path her whiskers twitch at the same thought; on the kept path the thought is our cat’s alone. One caption at the top, by the path she took.',
      caption: [
        { when: { ch3Told: true }, text: 'Her whiskers twitch. You both know somebody who eats a fish for every claw.' },
        { when: { ch3Told: false }, text: 'You know somebody who eats a fish for every claw.' }
      ],
      next: 'f010'
    },

    f010: {
      scene: S('hollow', 'wide', H3,
        rim().concat([c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. Along the hollow’s rim five cats sit up on their haunches in a row, forepaws in the air and claws out, wobbling a little, the grizzled old tom at the right end with a face like thunder. Tallyheart waits past the old tree and our cat watches from the sun patch. Caption top left; the old tom’s balloon small and sour.',
      caption: ['Along the rim, five cats sit up too.'],
      say: [{ who: 'grizzled', text: 'We look like squirrels.' }],
      next: 'f011'
    },

    f011: {
      scene: S('hollow', 'wide', H3,
        rim().concat([c('tallyheart', 'stand', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. All five rim cats sit up with both forepaws out; Tallyheart stands apart past the trunk, ready to hop along. In play the counting picture takes the panel: five pairs of forepaws in a row, each cat small behind its own, the next cat glowing softly; each tap lights its ten claws and a big number grows by ten. Her balloon at the top.',
      say: [{ who: 'tallyheart', text: 'Hop by tens. Ten, twenty, thirty! Touch each cat, and hop with me.' }],
      skip: { table: 10, groups: 5, who: RIM, thing: 'claw', things: 'claws', keep: true, prompt: '**Tap** the cats, left to right.', next: 'f012' }
    },

    f012: {
      scene: S('hollow', 'lesson', H3,
        rim(true).concat([c('tallyheart', 'sit', 'laugh', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM. All fifty claws on the rim are still lit and a big 50 floats over the picture, with the running totals under the cats. Up on the rim the old tom wobbles on his haunches, and below Tallyheart cheers, then holds up a paw for stillness. Her balloons, the first one huge.',
      say: [
        { who: 'tallyheart', text: 'FIFTY!', kind: 'shout' },
        { who: 'tallyheart', text: 'Now hold still.' }
      ],
      next: 'f013'
    },

    f013: {
      scene: S('hollow', 'lesson', H3,
        rim(true).concat([c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'crouch', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM, THEN THE COUNTS. The five totals, 10, 20, 30, 40 and 50, stay in a row under the cats while Tallyheart points her tail along them. Then a picture of cats sitting up in a row, ten front claws each, appears for every question; after a miss she swipes the sand twice a cat, five claw lines a swipe, and hops along the pairs by tens. Her balloons at the top; the keypad sits below the panel.',
      say: [
        { who: 'tallyheart', text: 'Five cats, ten front claws each.' },
        { who: 'tallyheart', text: 'Five times ten makes fifty. And every number you land on ends in a zero.' }
      ],
      counts: { set: 'ch04-tens', next: 'f014' }
    },

    f014: {
      scene: S('hollow', 'wide', H3,
        rim(false, 'shout').concat([c('tallyheart', 'sit', 'wonder', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'laugh', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, COMEDY BEAT. The five rim cats are still sitting up with their forepaws out, trembling with the effort, and the old tom wheezes through his whiskers. Tallyheart, past the tree, looks round with her eyes wide: she had forgotten all about them. His balloon strained; hers small and guilty.',
      say: [
        { who: 'grizzled', text: 'NOW can we put them down?' },
        { who: 'tallyheart', text: 'Oh! I forgot you were there.' }
      ],
      next: 'f015'
    },

    f015: {
      scene: S('hollow', 'wide', merge(H3, { heap: true }),
        heap().concat([c('tallyheart', 'sit', 'laugh', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'laugh', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, COMEDY BEAT. All five rim cats have toppled into one furry heap on the rim, legs and tails every which way, the old tom somewhere near the bottom with only his scowl showing. Nobody is hurt, and one cat is laughing. The FLUMP! is lettered big over the heap with little puffs of dust.',
      sfx: 'FLUMP!',
      next: 'f016'
    },

    f016: {
      scene: S('hollow', 'tree', merge(H4, { bark: 'falling' }), [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score a fourth claw mark into the bark just under the other three, which look a little deeper and darker than the new one. One pale curl of bark springs loose and starts to fall. The SKRITCH! runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'A fourth claw mark.'],
      sfx: 'SKRITCH!',
      next: 'f017'
    },

    f017: {
      // behind the tree the old tom stalks off toward camp, very stiffly: he is at the pile first
      scene: S('hollow', 'wide', merge(H4, { bark: 'falling' }),
        [c('player', 'lookup', 'wonder', 'tree', 'right'), c('tallyheart', 'sit', 'proud', 'sand-left', 'right'),
         c('grizzled', 'walk', 'stern', 'tree-far', 'right')], ['morning']),
      board: 'WIDE. Four claw marks on the old tree now, and one pale curl of bark drifting down from the newest, straight toward our cat, who sits at the foot of the trunk looking up. Tallyheart has dropped back onto the sand, proud; past the tree the old tom stalks off toward camp, very stiffly, his tail like a poker. Caption top left; her balloon warm.',
      caption: ['A curl of bark drops by your paws.'],
      say: [{ who: 'tallyheart', text: 'Both forepaws. That’s your fourth Count.' }],
      next: 'f018'
    },

    f018: {
      scene: S('hollow', 'lesson', merge(H4, { bark: 'sand' }),
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'lookup', 'wonder', 'tree', 'right')], ['morning']),
      board: 'MEDIUM TWO-SHOT. Our cat looks up at the four marks on the trunk, counting them, and Tallyheart sits on the sand behind it with her torn ear tipped toward it. The curl of bark lies forgotten on the sand between them. Our cat’s balloon a little wistful; hers short and sure.',
      say: [
        { who: 'player', text: 'Four marks. {Murmur}chime has ten.' },
        { who: 'tallyheart', text: 'She started with one.' }
      ],
      next: 'f019'
    },

    /* ------------------------------------------------------------------ The gap */

    f019: {
      scene: S('pile', 'rows', PILE_SHADE,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('grizzled', 'sit', 'proud', 'beside', 'left')], ['morning']),
      board: 'WIDE, FROM THE FRONT, THEN THE COUNTS. The prey pile laid out Tallyheart’s way under the bramble arch: two long rows of ten in the morning light, and a third at the back that is only a dark band in the brambles’ shadow, with nothing in it to make out. The old tom sits at the front, chest out; above his head a thought cloud shows last night’s pile under the first stars, three rows of ten. In the Counts picture the two front rows light one at a time as our cat walks along them, with no number shown. Caption top left; the keypad sits below the panel.',
      caption: ['At the prey pile, the old tom is waiting beside three long rows.'],
      counts: { set: 'ch04-pile', next: 'f020' }
    },

    f020: {
      scene: S('pile', 'gap', PILE_GAP,
        [c('player', 'crouch', 'wonder', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM, THE REVEAL. Our cat has walked round to the back row, out of the bramble shadow now, and stops dead: three pieces, then four bare places pressed into the earth, then three pieces more. The hole sits right in the middle of the panel. Caption top left, well clear of the gap.',
      caption: ['Then you come to the back row. Right in the middle, there’s a hole.'],
      next: 'f021'
    },

    f021: {
      scene: S('pile', 'rows', PILE_GAP, [], ['morning']),
      board: 'INSERT, FROM THE FRONT. The whole pile with nobody in the way: two full rows of ten, every piece straight and facing the same way, and the back row with its four empty places side by side. Nothing else is out of line anywhere, which is what makes the hole shout. Captions stacked at top left.',
      caption: ['Four empty spaces, side by side. All the other pieces lie in tidy rows.', 'You didn’t count anything. You just saw it.'],
      next: 'f022'
    },

    f022: {
      scene: S('pile', 'gap', PILE_GAP,
        [c('player', 'sit', 'worried', 'pile-left', 'right'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'left', { flatEars: true })], ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart has come up beside the back row, ears flat, her face very still, and says her own rule back to herself, quietly. Behind the gap the earth is soft, dark and freshly dug, a crumbly heap that only a noticing cat remarks on. Caption top left for that cat; her balloon small.',
      caption: [{ when: { specialty: 'noticing' }, text: 'Behind the gap, the earth is freshly dug. Again.' }],
      say: [{ who: 'tallyheart', text: 'A gap shows in a heartbeat.', kind: 'whisper' }],
      next: 'f023'
    },

    f023: {
      scene: S('pile', 'wide', PILE_GAP,
        [c('glintstar', 'stand', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'right'),
         c('player', 'sit', 'worried', 'pile-left', 'right'), c('clancat', 'sit', 'worried', 'crowd-1', 'right', { variant: 3 }),
         c('clancat', 'sit', 'scared', 'crowd-3', 'right', { variant: 5 })], ['morning']),
      board: 'WIDE. Cats crowd in round the rows from every side, and Glintstar rises on the fountain’s edge at the right, silver and still, to say the count out loud for the whole Clan. Every face is turned to her. Her two balloons cool and level, the second one heavier.',
      say: [
        { who: 'glintstar', text: 'Four the first night. Four the next. Four last night.' },
        { who: 'glintstar', text: 'Twelve pieces in three nights.' }
      ],
      next: 'f024'
    },

    f024: {
      scene: S('pile', 'gap', PILE_SUN,
        [c('player', 'crouch', 'wonder', 'pile-left', 'right'), c('grizzled', 'sit', 'wonder', 'pile-right', 'left')], ['morning']),
      board: 'MEDIUM, THE TAP PICTURE. A shaft of morning sun slides in under the brambles and lands in the gap, and there, leaning against the next piece in the row, something small flashes like a star. Our cat and the old tom stare at it. In play the glint pulses softly; a tap on it makes it flare and turns the page, and a tap anywhere else only makes it twinkle. Caption top left, clear of the glitter.',
      caption: ['Then the sun slides over the towers. And in the gap, something glitters.'],
      scratch: { tap: 'glint', next: 'f025' }
    },

    /* ------------------------------------------------------------------ The glittering scale */

    f025: {
      scene: S('pile', 'scale', PILE_SUN, [], ['morning']),
      board: 'EXTREME CLOSE-UP. The thing in the gap, as big as a cat’s paw: a flat, clear plate, round at one end and bluntly pointed at the other, smooth at every edge, faintly green where it is thickest, with the sun flashing off it. It leans on the mouse beside it, and nobody touches it. Captions top left, the second for a cat who loves shiny things.',
      caption: [
        'It’s as big as your paw: flat, smooth, and shaped like a giant fish’s scale.',
        { when: { worry: 'shiny' }, text: 'You saw it a heartbeat before anyone else. You always do, with shiny things.' }
      ],
      next: 'f026'
    },

    f026: {
      scene: S('pile', 'low', PILE_SUN,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('grizzled', 'sit', 'scared', 'beside', 'left', { puffed: true })], ['morning']),
      board: 'MEDIUM TWO-SHOT. Beside the rows the grizzled old tom has gone stiff, every hair on end, staring at the shining thing in the gap, and announces what it must be at the top of his voice. Our cat looks from him to the scale. His balloon loud, the last word enormous.',
      say: [{ who: 'grizzled', text: 'No snake has a scale that big. That’s a DRAGON’s.' }],
      next: 'f027'
    },

    f027: {
      scene: S('camp', 'crowd', { crowd: true, puddles: true, rainFountain: true },
        [c('tallyheart', 'sit', 'solemn', 'center', 'right', { size: 1.2 }), c('player', 'lookup', 'worried', { x: 990, y: 930 }, 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, IN THE UPROAR. The word jumps from cat to cat round the fountain, heads turning, fur rising, and is lettered three times across the panel, each one bigger than the last. In the middle of it Tallyheart looks down at our cat and our cat looks up at her, both very still: on the told path the look says everything; on the kept path a small wriggling bubble sits over our cat’s head. Captions top left, the second by the path she took.',
      caption: [
        'The word runs around camp.',
        { when: { ch3Told: true }, text: 'Tallyheart’s eyes meet yours. Not a word.' },
        { when: { ch3Told: false }, text: 'Inside you, the secret wriggles.' }
      ],
      sfx: 'Dragon. Dragon. DRAGON!',
      next: 'f028'
    },


    f028: {
      scene: S('pile', 'rows', PILE_SUN,
        [c('player', 'crouch', 'wonder', 'crowd-2', 'right'), c('tallyheart', 'lookup', 'worried', 'pile-left', 'right'),
         c('grizzled', 'lookup', 'scared', 'beside', 'left'), c('clancat', 'lookup', 'scared', 'crowd-3', 'left', { variant: 3 })], ['morning']),
      board: 'WIDE, FROM THE FRONT. Every cat round the rows has tipped its head back to search the sky for wings, and only our cat, small beside the back row, looks the other way: down, hard, at the shining thing in the gap. A small thought bubble over its head holds a shy grey dragonet. Caption top left; the choices sit below the panel.',
      caption: ['Everybody looks up at the sky. You think of Sprinkle, and look hard at the scale.'],
      choice: {
        options: [
          { label: 'Look THROUGH it.', sets: {}, next: 'f029a' },
          { label: 'Look INTO it.', sets: {}, next: 'f029b' }
        ]
      }
    },

    f029a: {
      scene: S('pile', 'through', PILE_SUN, [], ['morning']),
      board: 'POV, THROUGH THE SCALE. Our cat’s view with its chin on the earth: inside the outline of the scale the whole camp bends and wobbles, cats and brambles and towers all gone wavy and a little green, while outside the outline everything is straight. A small inset remembers the patio door on a rainy day, the garden running down the glass. One caption at the top.',
      caption: ['The whole camp goes wavy, and a little green. Just like the patio door in the rain.'],
      next: 'f030'
    },

    f029b: {
      scene: S('pile', 'mirror', PILE_SUN, [], ['morning']),
      board: 'POV, INTO THE SCALE. Our cat’s view leaning over it: in the clear plate a tiny cat looks back, in our cat’s own fur and eyes, with sky and bramble leaves behind its ears. A small inset remembers the patio door at dusk and the same small face in the glass. One caption at the top.',
      caption: ['A tiny cat looks back, with your face. Just like in the patio door, every evening.'],
      next: 'f030'
    },

    f030: {
      scene: S('pile', 'gap', PILE_SUN,
        [c('player', 'sit', 'happy', 'pile-left', 'right'), c('snorter', 'sit', 'proud', 'pile-right', 'left')], ['morning']),
      board: 'MEDIUM, COMEDY BEAT. Our cat sits back from the gap, sure of what it has seen, and the black-and-white apprentice on the other side of the row nods wisely, as certain as a cat can be who has never seen a dragon. The scale glints between them. Our cat’s balloon first, then his, very grand.',
      say: [
        { who: 'player', text: 'It’s like GLASS.' },
        { who: 'snorter', text: 'Dragon scales are probably MADE of glass.' }
      ],
      next: 'f031'
    },

    f031: {
      // the shout comes from outside the panel: the new warrior, back from her first patrol
      scene: S('pile', 'wide', PILE_SUN,
        [c('glintstar', 'stand', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'),
         c('player', 'sit', 'wonder', 'pile-left', 'right'), c('clancat', 'sit', 'worried', 'crowd-1', 'right', { variant: 3 })], ['morning']),
      board: 'WIDE. Glintstar stands on the fountain’s edge above the rows and the frightened cats, calm as cold water, and begins to say her own rule; before she can finish, a shout from outside the panel cuts across her and every head whips round. Her balloon breaks off at a dash. The shout comes in jagged from the panel’s edge.',
      say: [
        { who: 'glintstar', text: 'A scale is not a dragon. And we don’t blame what we haven’t—' },
        { who: 'murmurchime', text: 'GLINTSTAR!', kind: 'shout' }
      ],
      next: 'f032'
    },

    f032: {
      scene: S('camp', 'reveal', { puddles: true, rainFountain: true },
        [c('murmurchime', 'walk', 'shout', 'entrance', 'right'), c('glintstar', 'stand', 'solemn', 'fountain-top', 'left')], ['morning', 'motion']),
      board: 'WIDE, ACTION. The little tortoiseshell warrior skids into camp through the entrance, paws ploughing up the moss, motion lines behind her, eyes enormous. Across the clearing Glintstar turns on the fountain to meet her. Caption top left; her balloons breathless, the last word the strangest.',
      caption: ['{Murmur}chime skids into camp, back from her first patrol as a warrior.'],
      say: [
        { who: 'murmurchime', text: 'A FOX! At the border!', kind: 'shout' },
        { who: 'murmurchime', text: 'He says he saw who took our prey. And he’s SMILING.' }
      ],
      next: 'f033'
    },

    /* ------------------------------------------------------------------ The smiling fox */

    f033: {
      scene: S('field', 'wide', {},
        // half the Clan: the four who stand behind Glintstar at the border come along the fence first
        // (listed first, so drawn behind), then Tallyheart, our cat between the grown cats, and Glintstar
        [c('grizzled', 'walk', 'stern', { x: 130, y: 900 }, 'right'), c('snorter', 'walk', 'scared', { x: 330, y: 884 }, 'right'),
         c('snorer', 'walk', 'worried', { x: 640, y: 886 }, 'right'), c('murmurchime', 'walk', 'worried', { x: 910, y: 890 }, 'right'),
         c('tallyheart', 'walk', 'worried', 'path-left', 'right'), c('player', 'walk', 'worried', { x: 770, y: 950 }, 'right'),
         c('glintstar', 'walk', 'solemn', 'path-right', 'right')], ['day']),
      board: 'WIDE. The path along the Barking Field’s tall wire fence, and half the Clan hurrying along it behind Glintstar, tails low, toward the long golden grass at its far corner. Our cat trots between the grown cats to keep up. Captions top left, the second for a sneaking cat.',
      caption: [
        'You hurry after Glintstar with half the Clan, past the Barking Field, to the long grass.',
        { when: { specialty: 'sneaking' }, text: 'You slip between the warriors’ legs, right to the front. Sock practice.' }
      ],
      next: 'f034'
    },

    f034: {
      scene: S('field', 'border', {},
        [c('reynard', 'comb', 'happy', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'wonder', 'left', 'right'), c('tallyheart', 'sit', 'stern', 'right', 'right')].concat(clan4('stern', 'scared', 'worried', 'worried')), ['day']),
      board: 'WIDE, THE BORDER. The fence turns at its last post, the mown path ends, and the long golden grass begins; just past the post sits a lean red fox, very neatly, drawing his claws through the white tip of an enormous tail. He is smiling already. On the path the Clan stands in a knot behind Glintstar, Tallyheart and our cat at her shoulders. Captions top left, the second for a friendly cat; the choices sit below the panel.',
      caption: [
        'There sits a fox, combing his enormous tail. He’s smiling before anyone speaks.',
        { when: { specialty: 'friends' }, text: 'You know what a friend’s smile looks like. This isn’t one.' }
      ],
      choice: {
        options: [
          { label: 'Sit close to Tallyheart.', sets: {}, next: 'f035a' },
          { label: 'Look at his eyes.', sets: {}, next: 'f035b' }
        ]
      }
    },

    f035a: {
      scene: S('field', 'border-two', {},
        // (our cat at a spot of this panel's own, tucked against her side: at `left` the two sit a
        // tail's width apart, under "Her shoulder is warm against yours")
        [c('reynard', 'comb', 'happy', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'shy', { x: 352, y: 988 }, 'right'), c('tallyheart', 'sit', 'stern', 'right', 'right')], ['day']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT. Our cat has pressed itself against Tallyheart’s big ginger shoulder, which sits squarely between it and the fox; beyond that shoulder the fox goes on combing his tail, smiling in the grass. Tallyheart does not look down, but she leans in a little. One caption at the top.',
      caption: ['Her shoulder is warm against yours.'],
      next: 'f036'
    },

    f035b: {
      scene: S('field', 'border-fox', {},
        [c('reynard', 'sit', 'solemn', 'fox', 'left'), c('tallyheart', 'sit', 'stern', 'right', 'right'), c('player', 'sit', 'wonder', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE FOX, CHEST UP. The fox in three-quarter view, the closed smile turned up at its corners as always, but the half-shut amber eyes above it are flat and cool and fixed on Glintstar, never on us. A corner of Tallyheart’s ears and the edge of our cat’s face sit in the near edge of the panel, looking up at him. One caption at the top.',
      caption: ['They aren’t smiling at all.'],
      next: 'f036'
    },

    f036: {
      scene: S('field', 'border', {},
        [c('reynard', 'chest', 'proud', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'wonder', 'left', 'right'), c('tallyheart', 'sit', 'stern', 'right', 'right')].concat(clan4('stern', 'wonder', 'worried', 'worried')), ['day']),
      board: 'WIDE, THE BORDER. Glintstar stands at the very end of the path, one pace short of the last post, and names him; the fox lays one black-socked paw on his cream chest, the picture of good manners, and stays exactly where he is. Not one of his paws is on the Clan’s side. Her balloon level; his long and smooth.',
      say: [
        { who: 'glintstar', text: 'You are at our border, Reynard.' },
        { who: 'reynard', name: 'Reynard', text: 'AT it, dear lady. Never over it. I have beautiful manners. Ask anyone.' }
      ],
      next: 'f037'
    },

    f037: {
      scene: S('field', 'border-fox', {},
        [c('reynard', 'think', 'dreamy', 'fox', 'left'), c('tallyheart', 'sit', 'stern', 'right', 'right'), c('player', 'sit', 'wonder', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, COMEDY BEAT. The fox rolls his eyes up to the sky and taps his chin with one claw, thinking it over honestly, the smile never moving. A tiny inset shows three very cross ducks. Caption top left; his balloon short.',
      caption: ['He thinks.'],
      say: [{ who: 'reynard', name: 'Reynard', text: 'Not the ducks.' }],
      next: 'f038'
    },

    f038: {
      scene: S('field', 'border-two', {},
        [c('reynard', 'sit', 'proud', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'wonder', 'left', 'right'), c('tallyheart', 'sit', 'stern', 'right', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Beyond Tallyheart’s shoulder the fox begins his story, looking pained at the very idea of hunting for himself; Tallyheart cuts in flatly without moving, and he answers her without a blink. Three balloons, his two smooth, hers dry.',
      say: [
        { who: 'reynard', name: 'Reynard', text: 'It was the night of the storm. I was out hunting. With my OWN paws—' },
        { who: 'tallyheart', text: 'In a storm?' },
        { who: 'reynard', name: 'Reynard', text: 'I adore weather.' }
      ],
      next: 'f039'
    },

    f039: {
      scene: S('field', 'border-fox', {},
        [c('reynard', 'sit', 'dreamy', 'fox', 'left'), c('tallyheart', 'sit', 'stern', 'right', 'right'), c('player', 'sit', 'wonder', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE FOX. He lifts his muzzle and half closes his eyes as if he can see it all again, and a small inset shows what he describes: storm clouds parting over the camp and a big round moon sailing out. The corner of Tallyheart’s ears does not move. His balloon slow, trailing off.',
      say: [{ who: 'reynard', name: 'Reynard', text: 'The rain stopped. The moon came out. And there, in the moonlight…' }],
      next: 'f040'
    },

    f040: {
      // the one panel where he leans in: never his close-up (that camera would leave our cat alone
      // with him, and Tallyheart's corner there sits under his leaning muzzle), always the two-shot,
      // Tallyheart's shoulder between him and our cat
      scene: S('field', 'border-two', {},
        [c('reynard', 'lean', 'solemn', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'scared', 'left', 'right'), c('tallyheart', 'sit', 'stern', 'right', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE FOX LEANS IN. From beyond the post he leans toward the Clan with one paw up beside his muzzle, as if passing on a secret, eyes on Glintstar, and breathes the word. Glintstar does not move. Tallyheart’s shoulder is squarely between him and our cat, whose ear flicks back. His whisper balloon small, the letters tall.',
      say: [{ who: 'reynard', name: 'Reynard', text: 'A DRAGON.', kind: 'whisper' }],
      next: 'f041'
    },

    f041: {
      scene: S('field', 'border', {},
        [c('reynard', 'flap', 'happy', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'scared', 'left', 'right'), c('tallyheart', 'sit', 'stern', 'right', 'right')].concat(clan4('scared', 'scared', 'scared', 'worried')), ['day']),
      board: 'WIDE, THE BORDER, COMEDY BEAT. The fox sits up and flaps both forepaws like wings, acting it out, enjoying himself enormously, and a small inset shows his story: a huge dark dragon lifting off over the brambles with its claws full of mice, a round moon behind it. Behind Glintstar the Clan cats shrink together. His balloon wide, the three flaps lettered one after another.',
      say: [{ who: 'reynard', name: 'Reynard', text: 'It flew up out of your camp with its claws full of mice. Flap! Flap! Flap!' }],
      next: 'f042'
    },

    f042: {
      scene: S('field', 'border-two', {},
        [c('reynard', 'chest', 'sad', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'worried', 'left', 'right'), c('tallyheart', 'sit', 'solemn', 'right', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, COMEDY BEAT. The fox sighs over the dry den under the Old Bridge as if it were a cushion left out in the rain, then presses a paw to his chest, all wounded innocence, the smile still on. In front of him Tallyheart answers in one word without so much as a twitch of her torn ear, and our cat goes very still against her shoulder. His two balloons silky; hers tiny and flat.',
      say: [
        { who: 'reynard', name: 'Reynard', text: 'And down it flew, under your Old Bridge. Such a fine, dry den. Too good for a monster.' },
        { who: 'reynard', name: 'Reynard', text: 'Would I fib?' },
        { who: 'tallyheart', text: 'Yes.' }
      ],
      next: 'f043'
    },


    f043: {
      // noticing only: the path's one catch. Reaching it sets the flag, for good
      when: { specialty: 'noticing' },
      sets: { ch4CaughtFly: true },
      scene: S('field', 'border-two', {},
        [c('player', 'sit', 'wonder', 'left', 'right'), c('tallyheart', 'sit', 'stern', 'right', 'right'),
         c('glintstar', 'stand', 'solemn', 'lead', 'right'), c('reynard', 'comb', 'proud', 'fox', 'left')], ['day']),
      board: 'MEDIUM, A NOTICING CAT ONLY. Our cat’s ears shoot straight up and its eyes go round: over its head a small thought bubble holds Sprinkle with her right wing drooping, half open. Then its mouth shuts tight, because Tallyheart, Glintstar and half the Clan are all close enough to hear. Captions stacked at top left.',
      caption: ['Wait. FLEW? Sprinkle’s wing droops. She can’t fly!', 'And you can’t say so. Not without telling everyone about Sprinkle.'],
      next: 'f044'
    },

    f044: {
      scene: S('field', 'border', {},
        [c('reynard', 'comb', 'proud', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'worried', 'left', 'right'), c('tallyheart', 'sit', 'stern', 'right', 'right')].concat(clan4('solemn', 'scared', 'scared', 'worried')), ['day']),
      board: 'WIDE, THE BORDER. All along the path the Clan cats are nodding to one another, eyes wide, already sure, while the fox goes back to combing his tail as if the matter were settled. Our cat, small at the front, looks round at them. Caption top left; the choices sit below the panel.',
      caption: ['But all around you, cats are nodding.'],
      choice: {
        options: [
          { label: '“Glintstar! Do we blame what we haven’t seen?”', sets: {}, next: 'f045a' },
          { label: '“Did anyone else see it?”', sets: {}, next: 'f045b' }
        ]
      }
    },

    f045a: {
      scene: S('field', 'border-fox', {},
        // (`wonder`: his eyes as wide as they go with the smile still on. `proud` all but shut them, on "With
        // these very eyes")
        [c('reynard', 'chest', 'wonder', 'fox', 'left'), c('tallyheart', 'sit', 'stern', 'right', 'right'), c('player', 'sit', 'solemn', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE FOX. He turns his smile a little toward the small voice, lays a paw on his chest again and widens his amber eyes for one moment to show how well they work. He still does not look at us. His balloon smooth as cream.',
      say: [{ who: 'reynard', name: 'Reynard', text: 'Ah, but I HAVE seen. With these very eyes.' }],
      next: 'f046'
    },

    f045b: {
      scene: S('field', 'border-fox', {},
        [c('reynard', 'think', 'happy', 'fox', 'left'), c('tallyheart', 'sit', 'stern', 'right', 'right'), c('player', 'sit', 'solemn', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE FOX. He looks up at the sky as if counting who else might have been awake, finds nobody, and shrugs one neat shoulder. The smile does not change at all. His balloon light and easy.',
      say: [{ who: 'reynard', name: 'Reynard', text: 'Only me. Foxes stay up late.' }],
      next: 'f046'
    },

    f046: {
      scene: S('field', 'border-two', {},
        [c('player', 'sit', 'worried', 'left', 'right'), c('tallyheart', 'sit', 'kind', 'right', 'left'),
         c('glintstar', 'stand', 'solemn', 'lead', 'left'), c('reynard', 'sit', 'proud', 'fox', 'left'),
         c('grizzled', 'sit', 'stern', 'back-1', 'right'), c('snorter', 'sit', 'wonder', 'back-2', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat sits at the front with its question still hanging in the air, and every head on the path has turned to it: Glintstar’s, Tallyheart’s, the old tom’s and the apprentice’s behind. Even the fox’s ears tip its way. Captions top left, each for its own cat.',
      caption: [
        'Every head turns to you.',
        { when: { worry: 'small' }, text: 'You’re the smallest cat at the border. You said it anyway.' },
        { when: { worry: 'talk' }, text: 'The words were out before you could stop them. For once, you’re glad.' }
      ],
      next: 'f047'
    },

    f047: {
      // "somebody mutters": nobody in the picture owns it (a voice from the back of the Clan)
      scene: S('field', 'border', {},
        [c('reynard', 'sit', 'proud', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'solemn', 'left', 'right'), c('tallyheart', 'stand', 'stern', 'right', 'right')].concat(clan4('stern', 'wonder', 'worried', 'wonder')), ['day']),
      board: 'WIDE, THE BORDER. A mutter comes from somewhere in the knot of cats at the back, nobody owning it, and Tallyheart gets to her feet beside our cat, shoulder to shoulder, and answers it for the whole path to hear. Our cat sits a little straighter. The mutter comes in small from the panel’s edge; her balloon firm.',
      say: [
        { who: 'clancat', name: 'Somebody', text: 'A pillow cat, sticking up for a DRAGON?' },
        { who: 'tallyheart', text: 'An apprentice, asking a fair question.' }
      ],
      next: 'f048'
    },

    /* ------------------------------------------------------------------ Until the full moon */

    f048: {
      scene: S('field', 'border-two', {},
        [c('glintstar', 'stand', 'solemn', 'lead', 'right'), c('reynard', 'sit', 'happy', 'fox', 'left'),
         c('player', 'sit', 'wonder', 'left', 'right'), c('tallyheart', 'sit', 'proud', 'right', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Glintstar faces the fox across the last post, level and still, her pale eyes on his, and speaks as plainly as she counts. The fox’s smile holds, but he has stopped combing. Her two balloons cool, the second one for him alone.',
      say: [
        { who: 'glintstar', text: 'It is a fair question. The Mistscales keep the Accord: our promise not to hunt each other.' },
        { who: 'glintstar', text: 'You never made that promise, Reynard.' }
      ],
      next: 'f049'
    },

    f049: {
      scene: S('field', 'border', {},
        [c('reynard', 'sit', 'happy', 'fox', 'left'), c('glintstar', 'sit', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'wonder', 'left', 'right'), c('tallyheart', 'sit', 'solemn', 'right', 'right')].concat(clan4('stern', 'worried', 'worried', 'solemn')), ['day']),
      board: 'WIDE, THE BORDER. Glintstar sits down at the end of the path with her tail curled round her paws, in no hurry at all, and the Clan cats behind her shift and look at one another. A small inset shows the shining thing in the gap. Her two balloons, the second short and heavy.',
      say: [
        { who: 'glintstar', text: 'So I won’t chase anyone off this river just because one fox says so.' },
        { who: 'glintstar', text: 'But there was a scale.' }
      ],
      next: 'f050'
    },

    f050: {
      scene: S('field', 'border-fox', {},
        [c('reynard', 'sit', 'happy', 'fox', 'left', { flick: true }), c('glintstar', 'stand', 'solemn', 'lead', 'right')], ['day']),
      board: 'CLOSE-UP, THE FOX LISTENS. The fox hears his sentence with the smile perfectly in place, but one black-tipped ear flicks once, and that is all he gives away. The edge of Glintstar’s silver face is at the left of the panel, where his eyes are fixed. Her two balloons come from there, the first one slow.',
      say: [
        { who: 'glintstar', text: 'The dragon has until the full moon. At the Gathering, every Clan will hear your story, Reynard.' },
        { who: 'glintstar', text: 'Then they decide if the dragon must leave the river.' }
      ],
      next: 'f051'
    },

    f051: {
      scene: S('field', 'border', {},
        [c('reynard', 'sit', 'proud', 'fox', 'left'), c('glintstar', 'stand', 'solemn', 'lead', 'right'),
         c('player', 'sit', 'worried', 'left', 'right'), c('tallyheart', 'sit', 'solemn', 'right', 'right')].concat(clan4('stern', 'worried', 'scared', 'solemn')), ['day']),
      board: 'WIDE, THE BORDER. Glintstar gives the order without taking her eyes off the fox, so that he hears it too: the seven cats small on the path under a wide day sky, the long grass shining beyond the post. Nobody moves. Her balloon carries to the back of the row.',
      say: [{ who: 'glintstar', text: 'Until then, no cat goes looking for it.' }],
      next: 'f052'
    },

    f052: {
      scene: S('field', 'border-two', {},
        [c('glintstar', 'stand', 'kind', 'lead', 'left'), c('player', 'lookup', 'wonder', 'left', 'right'),
         c('tallyheart', 'sit', 'kind', 'right', 'left'), c('reynard', 'sit', 'proud', 'fox', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Glintstar’s pale eyes travel along the row of cats and stop on the smallest one at the front, and stay there. Our cat looks back, hardly breathing. Caption top left; her balloon quiet, meant for whoever is listening hardest.',
      caption: ['Her eyes find you.'],
      say: [{ who: 'glintstar', text: 'And if any cat finds me something truer than a fox’s story, I will hear it.' }],
      next: 'f053'
    },

    f053: {
      scene: S('field', 'border-two', {},
        [c('player', 'sit', 'solemn', 'left', 'right'), c('tallyheart', 'sit', 'kind', 'right', 'left'),
         c('glintstar', 'stand', 'solemn', 'lead', 'left'), c('reynard', 'comb', 'proud', 'fox', 'left')], ['day']),
      board: 'MEDIUM, CLOSE ON OUR CAT. Our cat holds Glintstar’s look, and a small inset remembers another evening: the silver leader on the fountain, the whole Clan staring, and the same words said to a pillow cat. Tallyheart’s shoulder is warm beside it. Caption top left; the choices sit below the panel.',
      caption: ['Until the full moon. That’s how long Glintstar gave you, too.'],
      choice: {
        options: [
          { label: 'Nod.', sets: {}, next: 'f054a' },
          { label: 'Stand up tall.', sets: {}, next: 'f054b' }
        ]
      }
    },

    f054a: {
      scene: S('field', 'border-two', {},
        // (Tallyheart `dreamy`, facing our cat: `proud` raises her tail, across Glintstar's face from here)
        [c('glintstar', 'stand', 'kind', 'lead', 'left'), c('player', 'sit', 'proud', 'left', 'right'),
         c('tallyheart', 'sit', 'dreamy', 'right', 'left'), c('reynard', 'comb', 'proud', 'fox', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat dips its head once, and across the row Glintstar dips hers in answer, one small exact nod and no more, the way she does everything. Tallyheart pretends not to notice and is plainly delighted. One caption at the top.',
      caption: ['Glintstar nods back, just once.'],
      next: 'f055'
    },

    f054b: {
      scene: S('field', 'border-two', {},
        // (Tallyheart `kind`, her tail round her feet: `proud` raises it across our standing cat's face;
        // and she keeps facing right: turned left, her cheek covers our cat's nose)
        [c('glintstar', 'stand', 'kind', 'lead', 'left'), c('player', 'stand', 'proud', 'left', 'right'),
         c('tallyheart', 'sit', 'kind', 'right', 'right'), c('reynard', 'comb', 'proud', 'fox', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat stands up on all four paws and stretches as tall as an apprentice can, which brings its ears to about the height of Tallyheart’s shoulder. Glintstar is looking straight at it all the same. One caption at the top, gently funny.',
      caption: ['It isn’t very tall. Glintstar sees you anyway.'],
      next: 'f055'
    },

    f055: {
      scene: S('field', 'border', {},
        [c('dog', 'bounce', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'jump', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'bounce', 'shout', 'dog-3', 'left', { variant: 3 }), c('reynard', 'sit', 'proud', 'fox', 'left'),
         c('glintstar', 'stand', 'solemn', 'lead', 'right'), c('player', 'sit', 'wonder', 'left', 'right'),
         c('tallyheart', 'sit', 'wonder', 'right', 'right')].concat(clan4('stern', 'wonder', 'wonder', 'wonder')), ['day']),
      board: 'WIDE, THE BORDER, COMEDY BEAT. Behind the wire that runs away past the fox, three dogs spring up out of the field like toast, the huge shaggy one, the spotty one and the tiny one, tongues out, delighted to have found someone new. The fox has his back to them. The two BOINGs bounce along the fence; caption top left; the shaggy dog’s balloon enormous.',
      sfx: 'BOING! BOING!',
      caption: ['Behind the fence, three dogs bounce up.'],
      say: [{ who: 'dog', text: 'HI! Are you a GIANT SQUIRREL?', kind: 'shout' }],
      next: 'f056'
    },

    f056: {
      scene: S('field', 'border-fox', {},
        [c('reynard', 'slip', 'scared', 'fox', 'left'), c('dog', 'jump', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'bounce', 'happy', 'dog-3', 'left', { variant: 3 }), c('tallyheart', 'sit', 'wonder', 'right', 'right'),
         c('player', 'sit', 'wonder', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE SLIP. For one panel only the fox’s smile is gone: his mouth a flat line, his amber eyes wide open at last, ears laid back, and behind him happy dog faces crowd the wire. Nothing else about him moves. Caption top left; his balloon quick and thin.',
      caption: ['For one heartbeat, the fox’s smile slips.'],
      say: [{ who: 'reynard', name: 'Reynard', text: '…Must dash.' }],
      next: 'f057'
    },

    f057: {
      scene: S('field', 'dogs', { foxTail: true },
        [c('dog', 'jump', 'shout', 'dog-1', 'right', { variant: 1 }), c('dog', 'bounce', 'happy', 'dog-2', 'right', { variant: 2 }),
         c('dog', 'bounce', 'happy', 'dog-3', 'right', { variant: 3 }), c('player', 'sit', 'laugh', 'path-left', 'right')], ['day']),
      board: 'WIDE, COMEDY BEAT. From the path: the three dogs bounce at the wire, barking their goodbyes, and at the edge of the panel a white-tipped tail is just vanishing into the tall golden grass. Our cat watches it go with its whiskers twitching. Caption top left; the dogs’ shout big and friendly.',
      caption: ['And he does.'],
      say: [{ who: 'dog', text: 'BYE, GIANT SQUIRREL!', kind: 'shout' }],
      next: 'f058'
    },

    f058: {
      // told only, once the fox has gone and the Clan is out of hearing: never at the border
      when: { ch3Told: true },
      scene: S('title', 'wide', {},
        [c('tallyheart', 'walk', 'solemn', 'wall', 'left'), c('player', 'walk', 'worried', 'wall-2', 'left')], ['day']),
      board: 'WIDE, THE TOLD PATH ONLY. On the old stone wall above the river, the rest of the Clan far ahead and out of hearing, our cat walks close in front of Tallyheart and looks back at her. She bends her torn ear down to answer. Caption top left; both balloons small whispers, hers the longer.',
      caption: ['On the way home…'],
      say: [
        { who: 'player', text: 'Shouldn’t we tell Glintstar about Sprinkle?', kind: 'whisper' },
        { who: 'tallyheart', text: 'Not yet. First we find out who took the prey. Then we tell her everything.', kind: 'whisper' }
      ],
      next: 'f059'
    },

    /* ------------------------------------------------------------------ The Case File */

    f059: {
      scene: S('hollow', 'wide', merge(H4, { bark: 'sand' }),
        [c('player', 'flat', 'worried', 'tree', 'left'), c('tallyheart', 'sit', 'kind', 'sunpatch-3', 'right')], ['day']),
      board: 'WIDE. The Training Hollow at midday, four claw marks on the leaning tree, and our cat flopped flat on its tummy in the shade under it, worn through. Tallyheart settles nearby; this morning’s curl of bark still lies on the sand. Caption top left; our cat’s balloon a groan.',
      caption: ['Back in the Training Hollow, you flop down under the leaning tree.'],
      say: [{ who: 'player', text: 'My head is full of fox.' }],
      next: 'f060'
    },

    f060: {
      scene: S('hollow', 'sand', merge(H4, { bark: 'sand' }), [], ['day']),
      board: 'INSERT, CLOSE ON THE SAND. The pale curl of bark from this morning, lying where it fell, its papery inside turned up to the light like a blank page. Above it a thought bubble holds the Tall One’s glowing box: a tiny picture of someone with a notebook, finding what went missing. Captions stacked at top left.',
      caption: [
        'This morning’s curl of bark still lies in the sand.',
        'On the Tall One’s glowing box, things went missing all the time. And whoever found them always had one thing.'
      ],
      next: 'f061'
    },

    f061: {
      scene: S('hollow', 'lesson', merge(H4, { bark: 'sand' }),
        [c('tallyheart', 'sit', 'wonder', 'sand-left', 'right'), c('player', 'stand', 'shout', 'sand-right', 'left')], ['day']),
      board: 'MEDIUM, THE TAP PICTURE. Our cat has jumped up with its tail straight in the air, the idea shining out of it, the curl of bark at its paws, and Tallyheart tilts her head. In play the bark takes the panel: one blank curl on the sand, glowing softly; a tap scratches this morning’s row into it, six little mice and four empty places, and turns the page. Our cat’s balloon bursting.',
      say: [{ who: 'player', text: 'A case file! A place to keep everything you find out.' }],
      scratch: { draws: 'four-a-night', next: 'f062' }
    },

    f062: {
      // her first card: its line is her own balloon, so it is lettered once; no mark on it yet
      card: { id: 'four-a-night', mark: false },
      scene: S('hollow', 'lesson', H4,
        [c('tallyheart', 'sit', 'happy', 'sand-left', 'right'), c('player', 'sit', 'proud', 'sand-right', 'left', { holds: 'bark' })], ['day']),
      board: 'MEDIUM TWO-SHOT. Our cat sits with the scratched piece of bark at its paws, the row with its gap plain on it, and reads it out like a rule; Tallyheart’s whole face lights up. Under the panel the card itself appears: the little row, no mark on it yet. Our cat’s balloon carries the card’s line; hers is delighted.',
      say: [
        { who: 'player', text: 'Four gone every night.' },
        { who: 'tallyheart', text: 'A tally you can carry! One piece of bark, one thing you know.' }
      ],
      next: 'f063'
    },

    f063: {
      scene: S('hollow', 'wide', merge(H4, { bark: 'row' }),
        [c('tallyheart', 'stretch', 'happy', 'tree', 'right'), c('player', 'sit', 'wonder', 'sand-left', 'right')], ['day']),
      board: 'WIDE, THE TAP PICTURE. Tallyheart reaches up the trunk and peels off more pale bark in long curls, and the pieces lie in a row on the sand beside the first card. In play the row takes the panel: her first card at its head, then blank curls, the next one glowing; each tap scratches a picture in, puts a small eye in its corner and letters its line beneath it. Caption top left; her balloon gives the rule.',
      caption: ['She peels off more bark.'],
      say: [{ who: 'tallyheart', text: 'An eye for what you saw yourself. An ear for what you were only told.' }],
      scratch: {
        head: ['four-a-night'],
        cards: ['tidy', { id: 'dug-earth', when: { specialty: 'noticing' } }, 'scale'],
        prompt: '**Tap** each piece of bark to scratch what you saw.',
        next: 'f064'
      }
    },

    f064: {
      scene: S('hollow', 'lesson', merge(H4, { bark: 'row', cards: ROW, blank: 1 }),
        [c('tallyheart', 'pawup', 'kind', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT. Tallyheart holds up one paw over a blank piece of bark and tips her head at our cat like a teacher who already knows the answer; the scratched row lies on the sand between them. Our cat frowns at the blank piece, one claw ready. Her balloon a question; the choices sit below the panel.',
      say: [{ who: 'tallyheart', text: 'Now the fox’s story. He says it FLEW. Which mark?' }],
      choice: {
        options: [
          { label: 'An eye: I saw it myself.', sets: {}, next: 'f065a' },
          { label: 'An ear: somebody told me.', sets: {}, next: 'f065b' }
        ]
      }
    },

    f065a: {
      scene: S('hollow', 'lesson', merge(H4, { bark: 'row', cards: ROW, blank: 1 }),
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'sit', 'shy', 'sand-right', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT. Tallyheart asks it gently, head on one side, with no sting in it at all, and our cat thinks, looks at its own claw, and owns up. A small inset shows the fox flapping his forepaws: something heard, not something seen. Her balloon soft; our cat’s very small.',
      say: [
        { who: 'tallyheart', text: 'Did you see it fly?' },
        { who: 'player', text: '…No.' }
      ],
      next: 'f066'
    },

    f065b: {
      scene: S('hollow', 'lesson', merge(H4, { bark: 'row', cards: ROW, blank: 1 }),
        [c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'proud', 'sand-right', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT. Tallyheart’s whiskers spread in a grin and she pats the sand once with her paw, pleased, the way she does for a quick answer in a lesson. Our cat sits a little taller. Her balloon one word.',
      say: [{ who: 'tallyheart', text: 'Sharp.' }],
      next: 'f066'
    },

    f066: {
      card: 'fox-flew',
      scene: S('hollow', 'sand', merge(H4, { bark: 'row', cards: ROW_FLEW }), [], ['day']),
      board: 'INSERT, CLOSE ON THE SAND. One of our cat’s claws finishes a small notched triangle in the corner of a fresh piece of bark: an ear. On the bark, in thin scratched lines, a fox’s head and two flapping wings. One caption at the top; the new card appears under the panel with its line.',
      caption: ['You scratch an ear.'],
      next: 'f067'
    },

    f067: {
      card: 'fox-moon',
      scene: S('hollow', 'lesson', merge(H4, { bark: 'row', cards: ROW_MOON }),
        [c('tallyheart', 'sit', 'solemn', 'sand-left', 'right'), c('player', 'crouch', 'solemn', 'sand-right', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT. Our cat bends over another piece of bark, the tip of its tongue showing, scratching a fox’s head and a round moon, and marks its corner with an ear. Tallyheart looks at the two fox cards side by side and weighs them like prey. Caption top left; her balloon careful, three short sentences.',
      caption: ['You scratch one more: a fox, and a moon. Another ear.'],
      say: [{ who: 'tallyheart', text: 'Not true yet. Not false yet. A thing to check.' }],
      next: 'f068'
    },

    f068: {
      // noticing only, one frame with two variants: she whispers it if she told; she can't if she kept
      when: { specialty: 'noticing' },
      scene: S('hollow', 'lesson', merge(H4, { bark: 'row', cards: ROW_MOON }),
        [c('tallyheart', 'crouch', 'kind', 'sand-left', 'right'), c('player', 'sit', 'worried', 'sand-right', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT, A NOTICING CAT ONLY. Our cat looks at the bark that says the fox’s dragon flew, and a small thought bubble holds Sprinkle’s drooping wing. On the told path it leans to Tallyheart’s ear and she bends to listen; on the kept path it sits with its mouth shut tight. The told path’s two whispers, or the kept path’s one caption.',
      caption: [{ when: { specialty: 'noticing', ch3Told: false }, text: 'One of them is false already. But you can’t say so.' }],
      say: [
        { who: 'player', text: 'He said FLEW. And she can’t.', kind: 'whisper', when: { specialty: 'noticing', ch3Told: true } },
        { who: 'tallyheart', text: 'One hole in his story. Find me more.', kind: 'whisper', when: { specialty: 'noticing', ch3Told: true } }
      ],
      next: 'f069'
    },

    f069: {
      scene: S('hollow', 'lesson', H4,
        [c('tallyheart', 'sit', 'happy', 'sand-left', 'right'), c('player', 'sit', 'proud', 'sand-right', 'left', { holds: 'bark' })], ['day']),
      board: 'MEDIUM TWO-SHOT. Tallyheart starts the sentence and waits, and our cat finishes it with its little stack of bark at its paws, grinning. In play a curl of bark appears in the corner of the page, glowing: her Case File. A tap opens it, her cards lying on moss under two headings, and closing it turns the page. Two balloons, hers trailing off, our cat’s one word.',
      say: [
        { who: 'tallyheart', text: 'And every time you find something out…' },
        { who: 'player', text: 'Skritch.' }
      ],
      file: { next: 'f070' }
    },

    /* ------------------------------------------------------------------ The neighbors upstairs */

    f070: {
      when: { ch3Told: true },
      scene: S('hollow', 'lesson', H4,
        [c('tallyheart', 'crouch', 'kind', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left', { holds: 'bark' })], ['day']),
      board: 'MEDIUM TWO-SHOT, THE TOLD PATH ONLY. Tallyheart lowers her head level with our cat’s and speaks softly, counting the leader’s words out one by one as if they were prey: the order forbids looking, and a cat who knows where her friend is has no need to look. Our cat’s ears lift. Her two whisper balloons, the second one an errand.',
      say: [
        { who: 'tallyheart', text: 'No cat goes LOOKING for it. You don’t have to look.', kind: 'whisper' },
        { who: 'tallyheart', text: 'Go before sunset. Tell Sprinkle gently.', kind: 'whisper' }
      ],
      next: 'f071'
    },

    f071: {
      when: { ch3Told: false },
      scene: S('hollow', 'wide', H4,
        [c('player', 'sit', 'solemn', 'sunpatch', 'right', { holds: 'bark' }), c('tallyheart', 'walk', 'kind', 'tree-far', 'right')], ['day']),
      board: 'WIDE, THE KEPT PATH ONLY. Tallyheart is going on ahead toward camp, and our cat sits alone in the sun patch with its bark, weighing two rules as carefully as a counting cat should. Two small insets: Tallyheart saying not one paw, and Glintstar at the border. Captions stacked at top left.',
      caption: [
        'Not one paw under the Old Bridge, Tallyheart said. No cat goes looking, Glintstar said.',
        'But you don’t have to look. And Sprinkle should hear about the fox from a friend.'
      ],
      next: 'f072'
    },

    f072: {
      scene: S('garden', 'step', { dish: true },
        [c('player', 'crouch', 'happy', 'step', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat’s old patio step in the afternoon sun, the dish of water still put out for it, and our cat crouched over it, lapping. Later art: an inset of its nest in the den, the little stack of bark tucked along the mossy edge. One caption at the top.',
      caption: ['You tuck your bark into your nest, and slip through the hedge for a drink.'],
      next: 'f073'
    },

    f073: {
      scene: S('tower', 'balcony-close', TOWER,
        [c('waffles', 'peer', 'shout', 'railing', 'left')], ['day']),
      board: 'CLOSE-UP, NINETEEN FLOORS UP. Princess Waffles hangs over her balcony railing with her bow askew, the wind chime jangling beside her geranium, shrieking down at the garden. She has plainly not slept for three days. Her two shout balloons, jagged, the second listing her troubles.',
      say: [
        { who: 'waffles', text: '{petname}! DARLING!', kind: 'shout' },
        { who: 'waffles', text: 'It’s the neighbors upstairs! Three days of ROARING! And the HICCUPS!', kind: 'shout' }
      ],
      next: 'f074'
    },

    f074: {
      scene: S('tower', 'up', merge(TOWER_LIT, { roar: true }),
        [c('waffles', 'peer', 'scared', 'railing', 'left'), c('player', 'lookup', 'wonder', 'foot', 'right')], ['day']),
      board: 'LOW ANGLE, TALL PANEL. Straight up the glass tower by day: our cat small at its foot, Waffles a white dot at her railing nineteen floors up, and at the very top the little red light on its mast, with jagged roar lines shaking the sky on both sides of the roof. The roar is lettered huge down the glass, its hiccup small at the end. Captions at the bottom.',
      sfx: 'RAWWWRRR… hic!',
      caption: [
        'It comes from the roof of the tallest tower. Your old tower, where the red light blinks.',
        'The Clan calls it Tallwalker noise.'
      ],
      next: 'f075'
    },

    f075: {
      // the tower choice: no flag. Going up leads to the roof, whose last frame sets `foundSquall`;
      // "Not today" sets nothing. A cat who has met him already reads the choice his way.
      scene: S('garden', 'wide', { dish: true },
        [c('player', 'lookup', 'wonder', 'lawn', 'left')], ['day']),
      board: 'WIDE. The old garden by day, the dish on the step and the gap in the hedge behind, and our cat alone on the lawn with its head tipped right back, staring up past the balconies at the roof it used to live under. A small thought bubble holds a tiny dragonet, roaring, with a hiccup. Captions top left, each for its own cat; the choices sit below the panel.',
      caption: [
        { when: { ch2Path: 'river' }, text: 'The same roar as before. Sprinkle’s littlest brother!' },
        { when: { ch2Path: 'bridge' }, text: 'A roar with a hiccup, just as Sprinkle said. Her littlest brother!' },
        { when: { specialty: 'climbing' }, text: 'Balcony, balcony, balcony, roof. You could climb that.' }
      ],
      choice: {
        options: [
          { label: 'Go up and find him. Right now.', labelWhen: [{ when: { foundSquall: true }, label: 'Go up and see Squall again.' }], sets: {}, next: 'f076a' },
          { label: 'Not today. Sprinkle first.', labelWhen: [{ when: { foundSquall: true }, label: 'Not today. He’s guarding.' }], sets: {}, next: 'f076b' }
        ]
      }
    },

    /* ------------------------------------------------------------------ Up the tower (a) */

    f076a: {
      when: { specialty: 'climbing' },
      scene: S('tower', 'up', TOWER_LIT,
        [c('player', 'walk', 'happy', 'corner', 'left'), c('waffles', 'peer', 'shout', 'railing', 'left')], ['day']),
      board: 'LOW ANGLE, TALL PANEL, A CLIMBING CAT ONLY. Straight up the glass tower: our cat, small and sure, on a balcony halfway up its right edge with a dotted line of leaps below it, balcony to balcony, and Waffles’ white face turning to follow as it shoots past her floor. The red light blinks at the very top. Caption at the bottom; her squeal runs all the way up.',
      caption: ['It’s only a very tall curtain, really. Up you go, balcony to balcony.'],
      say: [{ who: 'waffles', text: 'The OUTSIDE? {THEY}’S DOING IT!', kind: 'shout' }],
      next: 'f077a'
    },

    f077a: {
      when: { not: { specialty: 'climbing' } },
      scene: S('tower', 'up', TOWER_LIT,
        [c('waffles', 'peer', 'shout', 'railing', 'left'), c('player', 'lookup', 'wonder', 'foot', 'right')], ['day']),
      board: 'LOW ANGLE, TALL PANEL, EVERY CAT BUT A CLIMBER. Straight up the glass tower: our cat at its foot, outside on the ground, looking up, and Waffles nineteen floors above it, leaning out so far that her bow dangles, calling down advice. The red light blinks at the very top. Her balloon’s tail runs all the way down the glass.',
      say: [{ who: 'waffles', text: 'Take the little room, darling! The one that goes DING!', kind: 'shout' }],
      next: 'f078a'
    },

    f078a: {
      // the art letters the small DING! at the very top itself (`ding: true`): no sound effect here
      when: { not: { specialty: 'climbing' } },
      scene: S('tower', 'up', merge(TOWER, { ding: true }),
        [c('waffles', 'peer', 'happy', 'railing', 'left')], ['day']),
      board: 'LOW ANGLE, TALL PANEL, EVERY CAT BUT A CLIMBER. The same view up the tower, and nobody at its foot now: only Waffles at her railing, and a small DING! lettered at the very top beside the red light. No button, no doorway, no Tall One: the caption says how our cat got there. Caption at the bottom.',
      caption: ['The elevator! You jump, and whack the top button.'],
      next: 'f079a'
    },

    /* ------------------------------------------------------------------ The littlest dragonet (a) */

    f079a: {
      scene: S('roof', 'wide', {},
        [c('squall', 'hug', 'stern', 'pole', 'right'), c('player', 'stand', 'wonder', 'door', 'right')], []),
      board: 'WIDE, THE ROOF. The tower’s wide flat roof in the gold of the afternoon: pale grit, a low wall all the way round, a rain puddle, the little hut with its door propped open by a brick, and in the middle one pole with a small red light. At its foot sits a dragonet no bigger than a cat, slate grey with yellow flecks like sparks, hugging the pole with his forelegs and his tail. Our cat has just stepped out of the door. Captions top left.',
      caption: [
        'On the wide, flat roof, a dragon no bigger than you hugs the pole of the red light.',
        'He’s slate grey, with yellow flecks like sparks.'
      ],
      next: 'f080a'
    },

    f080a: {
      scene: S('roof', 'sky', { plane: true },
        [c('squall', 'roar', 'shout', 'pole', 'right'), c('player', 'lookup', 'wonder', 'beside', 'left')], []),
      board: 'LOW ANGLE, LOOKING UP. From the roof’s floor: the pole, the red light, and far above it an airplane sweeping across the sky, near enough to show its row of windows, never level with the roof. At the foot of the pole the little dragonet throws back his head and roars straight up at it, mouth a perfect round O, eyes screwed shut. The airplane’s roar is lettered across the sky; caption top left; his shout below.',
      sfx: 'ROOOOOAAAAARRRRR!',
      caption: ['An airplane sweeps over.'],
      say: [{ who: 'squall', text: 'AND STAY OUT, giant dragon!', kind: 'shout' }],
      next: 'f081a'
    },

    f081a: {
      scene: S('roof', 'pole', {},
        [c('squall', 'hiccup', 'wonder', 'pole', 'right')], []),
      board: 'CLOSE-UP, COMEDY BEAT. His own small roar ends in a hiccup that bounces him on the spot: eyes crossed, wings out, one neat ring of mist popping from his mouth. He is still at the foot of his pole, on the roof’s floor. The roar is lettered round him, its hiccup tiny at the end.',
      sfx: 'RAWWWRRR… hic!',
      next: 'f082a'
    },

    f082a: {
      scene: S('roof', 'two', {},
        [c('squall', 'halt', 'stern', 'pole', 'right'), c('player', 'sit', 'kind', 'beside', 'left')], []),
      board: 'MEDIUM TWO-SHOT, THEN THE COUNTS. Cat and dragonet at the same height: he keeps one arm round his pole and thrusts the other forepaw out, one claw up, like a very small guard, and our cat sits down politely to show it means no harm. In the Counts picture he scratches seven little forepaws in the grit as he asks, five claw marks each, four above three; after a miss he swipes the grit once a forepaw and our cat does the hopping. His balloons fierce, our cat’s friendly; the keypad sits below the panel.',
      say: [
        { who: 'squall', text: 'HALT! Friend, or NOT friend?' },
        { who: 'player', text: 'Friend! Sprinkle sent me.' },
        { who: 'squall', text: 'PROVE it!' }
      ],
      counts: { set: 'ch04-riddle', next: 'f083a' }
    },

    f083a: {
      scene: S('roof', 'two', { grit: 'paws' },
        [c('squall', 'roar', 'proud', 'pole', 'right'), c('player', 'sit', 'happy', 'beside', 'left')], []),
      board: 'MEDIUM TWO-SHOT. Seven little forepaws are scratched in the grit now, five claw marks each, and the dragonet throws his head back and roars the end of Mama’s morning count to the sky, proud as a rooster. Our cat’s ears flatten at the noise. His balloon huge.',
      say: [{ who: 'squall', text: 'And NOBODY’S MISSING!', kind: 'shout' }],
      next: 'f084a'
    },

    f084a: {
      scene: S('roof', 'pole', { grit: 'paws' },
        [c('squall', 'hug', 'sad', 'pole', 'right')], []),
      board: 'CLOSE-UP. The roar runs out. He looks down at the seven small paws in the grit, then at his own forepaws wrapped round his pole, and his chin begins to wobble under the fierce little brows. Caption top left; his balloon small, the smallest thing he has said.',
      caption: ['Then his chin wobbles.'],
      say: [{ who: 'squall', text: 'Except everybody.' }],
      next: 'f085a'
    },

    f085a: {
      // "I'm Squall": from this balloon on, his balloons carry his name
      scene: S('roof', 'two', { grit: 'paws' },
        [c('squall', 'tall', 'proud', 'pole', 'right'), c('player', 'sit', 'kind', 'beside', 'left')], []),
      board: 'MEDIUM TWO-SHOT. At the news he lets go of the pole altogether and stands as tall as he can, fists on hips, which brings his nubby horns level with our cat’s ears. The wobble is gone as if it had never been. Four balloons, back and forth, his loud and our cat’s dry.',
      say: [
        { who: 'player', text: 'Not Sprinkle. She’s safe, under the Old Bridge.' },
        { who: 'squall', name: 'Squall', text: 'She IS? …I’m Squall. I’m the littlest. And the LOUDEST.' },
        { who: 'player', text: 'I noticed.' },
        { who: 'squall', name: 'Squall', text: 'I notice things TOO.' }
      ],
      next: 'f086a'
    },

    f086a: {
      scene: S('roof', 'over', {},
        [c('squall', 'point', 'proud', 'pole', 'right'), c('player', 'sit', 'wonder', 'beside', 'right')], []),
      board: 'MEDIUM, OVER THE WALL. From the middle of the roof, the top of the low wall runs across the panel and the whole view lies beyond it: the green patch of camp behind its hedge, the river, the Old Bridge, and two shiny lines running away. Beside his pole the dragonet points one claw out past the hedge, toward those lines and never into camp. Caption top left; his balloon full of importance.',
      caption: ['He points down, past your camp.'],
      say: [{ who: 'squall', name: 'Squall', text: 'Every night, two skinny shapes go sneaking along down THERE, carrying something. To the long shiny lines.' }],
      next: 'f087a'
    },

    f087a: {
      // given on the roof, shown in her file from here on only once the roof scene is finished
      card: 'squall-shapes',
      scene: S('roof', 'over', {}, [], []),
      board: 'POV, OVER THE WALL. The view alone, the way our cat suddenly sees it: past the hedge, the two shiny lines of the track catch the afternoon sun and run off behind the Old Bridge. A small thought bubble holds a rumbling train. One caption at the top; the new card appears under the panel, an ear in its corner.',
      caption: ['The train tracks!'],
      next: 'f088a'
    },

    f088a: {
      scene: S('roof', 'two', { moth: true, grit: 'paws' },
        [c('squall', 'snap', 'happy', 'pole', 'right'), c('player', 'sit', 'kind', 'beside', 'left')], []),
      board: 'MEDIUM TWO-SHOT. Our cat tips its head toward the roof door; the dragonet shakes his and snaps happily at a pale moth circling down from his red light, perfectly at home. Behind him the rain puddle shines. Our cat’s balloon a question; his cheerful and full of crunch.',
      say: [
        { who: 'player', text: 'Come down with me?' },
        { who: 'squall', name: 'Squall', text: 'Can’t. I’m GUARDING. And my light brings me moths. CRUNCHY ones.' }
      ],
      next: 'f089a'
    },

    f089a: {
      // the roof scene's last frame: by now she has read his name, his riddle and his "five"
      sets: { foundSquall: true },
      scene: S('roof', 'paw', {},
        [c('squall', 'pawup', 'proud', 'pole', 'right'), c('player', 'sit', 'wonder', 'beside', 'left')], []),
      board: 'EXTREME CLOSE-UP, THE TAP PICTURE. One small slate forepaw held up at the height of our cat’s nose, five pale claws spread, the dragonet’s proud face behind it. In play the counting picture takes the panel: his one raised forepaw, glowing softly; one tap lights its five claws, a big 5 grows over them, and the page turns. His balloon at the top.',
      say: [{ who: 'squall', name: 'Squall', text: 'Tell Sprinkle: five. She’ll know.' }],
      skip: { table: 5, groups: 1, who: [{ who: 'squall' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: 'f090' }
    },

    /* ------------------------------------------------------------------ Not today (b) */

    f076b: {
      scene: S('tower', 'up', TOWER_LIT,
        [c('waffles', 'peer', 'sad', 'railing', 'left'), c('player', 'walk', 'kind', 'foot', 'left')], ['day']),
      board: 'LOW ANGLE, TALL PANEL. Straight up the glass tower: Waffles drooping over her railing nineteen floors up, bow at half mast, and our cat at the tower’s foot already turning toward the hedge, calling back over its shoulder. The red light blinks at the very top. Her wail runs all the way down; our cat’s promise goes up to meet it.',
      say: [
        { who: 'waffles', text: 'You’re LEAVING me with him?', kind: 'shout' },
        { who: 'player', text: 'I’ll come back!' }
      ],
      next: 'f077b'
    },

    f077b: {
      scene: S('riverbank', 'roof', { roar: true, light: true },
        [c('player', 'lookup', 'kind', 'path-left', 'right')], ['day']),
      board: 'LOW ANGLE. From the river path, looking back and up at the tallest tower: its roof, the little hut, the mast and the red light blinking, with a few small jagged lines round it where a very small roar comes out. Our cat, at the bottom corner, lifts its head to listen. Caption top left; the hiccup tiny and far away.',
      caption: ['Far above, a very small roar answers.'],
      sfx: '…hic!',
      next: 'f078b'
    },

    f078b: {
      scene: S('bridge', 'bank', BANK,
        [c('riffle', 'slide', 'happy', 'reeds', 'left'), c('player', 'sit', 'happy', 'bank-left', 'right')], ['day']),
      board: 'WIDE, FROM THE RIVERBANK. The Old Bridge by day, the dark space under its near end at left, and Riffle shooting down the muddy bank on his tummy, all four paws out, to land at our cat’s feet with news bursting out of him. Caption top left; his one balloon over his head, bouncy, its last two words very solemn.',
      caption: ['At the Old Bridge, Riffle comes sliding down the bank.'],
      // one balloon, as the text has it: a second one from the same speaker is chained below the
      // first, which here is across his sliding body
      say: [{ who: 'riffle', text: 'Six rumors about a dragon as big as a BRIDGE! And I didn’t start ONE of them. Otter’s honor!' }],
      next: 'f090'
    },

    /* ------------------------------------------------------------------ That's not mine */

    f090: {
      when: { ch3Told: true },
      scene: S('bridge', 'back', BACK_BRANCH,
        [c('sprinkle', 'peek', 'wonder', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right')], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY. In the cool dark at the very back of the bridge, a heap of old sticks lies across the nook, just as Tallyheart left it, and over the top of it two big round eyes shine, then a pale snout. Our cat sits down in front of the heap, glad to see them. Captions top left.',
      caption: ['Under the Old Bridge, two big eyes shine.', 'They peek over Tallyheart’s branch.'],
      next: 'f091'
    },

    f091: {
      when: { ch3Told: false },
      // her eyes open exactly where her face is in the next panel (`eyes: 'sprinkle'`)
      scene: S('bridge', 'back', merge(BACK, { eyes: 'sprinkle' }),
        [c('player', 'sit', 'kind', 'back-left', 'right')], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY. In the cool dark at the very back of the bridge, two big round eyes open and shine softly, like river stones, exactly where they shone yesterday. Our cat sits down in front of them, glad to see them. One caption at the top, away from the eyes.',
      caption: ['Under the Old Bridge, two big eyes shine.'],
      next: 'f092'
    },

    f092: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'scramble', 'happy', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle has come out into the open of her nook and sits up, mist-grey and pleased, as Riffle squeezes in at our cat’s side, damp and wriggling. Our cat gives her the news of her littlest brother, whichever news it has. Caption top left; our cat’s balloon, and for a cat who did not go up, Sprinkle’s easy answer.',
      caption: ['Riffle wriggles in beside you.'],
      say: [
        { who: 'player', text: 'I found your littlest brother. He says: five.', when: { foundSquall: true } },
        { who: 'player', text: 'Your littlest brother is still roaring.', when: { foundSquall: false } },
        { who: 'sprinkle', text: 'Then he’s fine. He only stops to sleep.', when: { foundSquall: false } }
      ],
      next: 'f093'
    },

    f093: {
      when: { foundSquall: true },
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'pawup', 'happy', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, ONLY FOR A CAT WHO FOUND HIM. Sprinkle lifts one big grey forepaw, its five pale claws spread, and holds it up beside an invisible smaller one, her eyes shining wet and happy. A small inset shows a little slate forepaw held up on a far roof. Caption top left; her whisper balloon counts.',
      caption: ['Sprinkle holds up her own forepaw.'],
      say: [{ who: 'sprinkle', text: 'Five and five. Ten. That’s two of us.', kind: 'whisper' }],
      next: 'f094'
    },

    f094: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'laugh', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'kind', 'mud', 'right'),
         c('riffle', 'sit', 'happy', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN. The three friends in the cool dark, daylight and river at the left, and our cat telling the whole morning with its paws: three small insets float over it, a row with a gap, a shining scale, and a smiling fox with three dogs bouncing behind him. Sprinkle giggles at the dogs, not yet knowing what comes next. One long caption across the top; our cat’s balloon quiet and plain.',
      caption: ['Then you tell her: the missing prey, the shiny scale, the fox. And the three dogs. She likes the dogs.'],
      say: [{ who: 'player', text: 'The fox says it was you.' }],
      next: 'f095'
    },


    f095: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'hide', 'scared', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle has whipped the broad end of her tail up over her eyes again, all the rest of her in plain sight and trembling, and her voice squeaks out from behind it. Our cat leans toward her. Caption top left; her first balloon a squeak that fills the nook, the next wobbly, the tail’s small and exact; the choices sit below the panel.',
      caption: ['Sprinkle hides her face under her tail.'],
      say: [
        { who: 'sprinkle', text: 'I DIDN’T!', kind: 'shout' },
        { who: 'sprinkle', text: 'I only ate Riffle’s fish!' },
        { who: 'sprinkle', name: 'The tail', text: 'And one vole. You gave me that one.', when: { ch3Told: false } }
      ],
      choice: {
        options: [
          { label: '“I know you didn’t.”', sets: {}, next: 'f096a' },
          { label: '“A thief would have kept Riffle’s juggling pebble. You rolled it back.”', sets: {}, next: 'f096b' }
        ]
      }
    },

    f096a: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'tailup', 'shy', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'happy', 'near', 'right')], ['day']),
      board: 'MEDIUM. The tail over Sprinkle’s face lifts a little, just enough for both big amber eyes to look out from under it at our cat. Our cat waits, and does not look away. One caption at the top.',
      caption: ['The tail lifts a little.'],
      next: 'f097'
    },

    f096b: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'tailup', 'shy', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'juggle', 'shout', 'near', 'right', { pebbles: 5 })], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Riffle shoots up onto his hind legs with his pebbles flying and the plain brown one, the very one, held high in his paw like evidence at a trial. Under her lifting tail Sprinkle’s eyes peep out at it. His balloon triumphant.',
      say: [{ who: 'riffle', text: 'My FIFTH favorite!', kind: 'shout' }],
      next: 'f097'
    },

    f097: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'check', 'wonder', 'dragon', 'left'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. Sprinkle bends her long neck right back over her own shoulder and inspects herself from nose to tail, ridge by matte grey ridge, with great seriousness. Nothing on her shines anywhere. Caption top left; her balloons puzzled, then certain; our cat’s whisper for a cat who loves shiny things.',
      caption: ['Sprinkle looks herself over, nose to tail.'],
      say: [
        { who: 'sprinkle', text: 'A SHINY scale?' },
        { who: 'sprinkle', text: 'I’m not shiny anywhere. I’ve checked. I LOVE shiny.' },
        { who: 'player', text: 'I know. Me too.', kind: 'whisper', when: { worry: 'shiny' } }
      ],
      next: 'f098'
    },

    f098: {
      card: 'sprinkle-scales',
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'tailout', 'kind', 'dragon', 'left'), c('player', 'pawup', 'wonder', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle brings her long tail round and holds it out across her forepaws for our cat to feel, ridges up, and our cat reaches one paw gently to it: soft bumps, grey as mist, with no shine at all. Caption top left; her balloon plain and sure; the new card appears under the panel, an eye in its corner.',
      caption: ['She holds out her tail. You run a paw along it: bumpy, and soft, and grey as mist.'],
      say: [{ who: 'sprinkle', text: 'Then it’s not mine.' }],
      next: 'f099'
    },

    f099: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'wonder', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'proud', 'mud', 'right'),
         c('riffle', 'stand', 'wonder', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, COMEDY BEAT. Our cat explains glass with both paws, a tiny inset showing a tall tower made of windows, and Riffle scratches his head at the idea of a dragon wearing one. Sprinkle looks from one to the other. Three balloons, our cat’s last one small and stubborn.',
      say: [
        { who: 'player', text: 'The shiny one is like GLASS. The clear stuff in Tall Ones’ walls.' },
        { who: 'riffle', text: 'Why would a dragon wear a WALL?' },
        { who: 'player', text: 'I don’t know. Yet.' }
      ],
      next: 'f100'
    },

    f100: {
      // noticing and kept only: the one friend she can tell
      when: { specialty: 'noticing', ch3Told: false },
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'wings', 'sad', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, ONLY FOR A NOTICING CAT WHO KEPT THE SECRET. Our cat tells her the one word it could not say at the border, and Sprinkle opens her wings, the left wide and the right drooping, half open, and looks round at it with a sigh. Riffle’s mouth falls open as he works it out. Our cat’s balloon careful; hers two wistful words.',
      say: [
        { who: 'player', text: 'And the fox says you FLEW.' },
        { who: 'sprinkle', text: 'I WISH.' }
      ],
      next: 'f101'
    },

    f101: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'shy', 'dragon', 'left'), c('player', 'sit', 'proud', 'back-left', 'right'),
         c('riffle', 'sit', 'happy', 'near', 'right')], ['day']),
      board: 'MEDIUM. Our cat sits up straight and says it like a promise, and a small inset shows its nest with a row of bark along the mossy edge. Sprinkle listens with her head on one side, hardly daring to hope. Our cat’s balloon steady.',
      say: [{ who: 'player', text: 'I’m keeping a Case File. One true thing at a time, until the whole Clan knows it wasn’t you.' }],
      next: 'f102'
    },

    f102: {
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'pawsup', 'shy', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'happy', 'near', 'right')], ['day']),
      board: 'MEDIUM. Sprinkle holds up both big grey forepaws, claws spread, toward the two of them, and looks at our cat. Riffle is already wriggling closer. Caption top left; her balloon one small word.',
      caption: ['Sprinkle holds out both forepaws.'],
      say: [{ who: 'sprinkle', text: 'Promise?' }],
      next: 'f103'
    },

    f103: {
      // the promise Tap: the panel after it letters 10, 20, 30 itself (`hop`), so the tap carries no big number on
      scene: S('bridge', 'paws', { pawsIn: 'both' }, [], ['day']),
      board: 'EXTREME CLOSE-UP, THE TAP PICTURE. Six forepaws piled in a warm pool of light: Sprinkle’s two big grey ones at the bottom, our cat’s two on top of them, Riffle’s two webbed brown ones on top of those, fanned so that all thirty claws show. In play each tap lights one friend’s ten claws and the number in our cat’s own balloon grows by ten. Caption top left; our cat’s balloon comes in from the edge.',
      caption: ['Yours go on top. Then Riffle’s.'],
      say: [{ who: 'player', text: 'Three friends, ten claws each.' }],
      skip: { table: 10, groups: 3, thing: 'claw', things: 'claws', teacher: 'player', paws: 'pile', prompt: '**Tap** the paws.', carry: false, next: 'f104' }
    },

    f104: {
      scene: S('bridge', 'paws', { pawsIn: 'both', hop: true }, [], ['day']),
      board: 'EXTREME CLOSE-UP. The same six paws, every one of the thirty claws lit warm gold now, with 10, 20 and 30 lettered beside their rows. Nobody lets go. Riffle’s balloon pops in from one edge and Sprinkle’s from the other, hers quietly proud.',
      say: [
        { who: 'riffle', text: 'A thirty-claw promise!' },
        { who: 'sprinkle', text: 'That beats fifteen.' }
      ],
      next: 'f105'
    },

    f105: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'happy', 'mud', 'right'),
         c('riffle', 'stand', 'shout', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN. Riffle bounces up on his hind legs with his paws flung wide, and a small inset shows what he means: a log raft tied with vines, bobbing on the bright river. Sprinkle and our cat look at him. His two balloons, the first a shout, the second a plan.',
      say: [
        { who: 'riffle', text: 'And tomorrow: my RAFT!', kind: 'shout' },
        { who: 'riffle', text: 'Somebody on this river was awake on the storm night.' }
      ],
      next: 'f106'
    },

    f106: {
      // the water worry's raft line, by whether she swims (a swimmer with the worry reads her own)
      when: { worry: 'water' },
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'kind', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'worried', 'mud', 'left'),
         c('riffle', 'sit', 'kind', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, ONLY FOR A CAT WHO WORRIES ABOUT WATER. Our cat looks out past the mouth of the dark at the wide brown river, and its tummy turns over: a tiny inset shows a raft bobbing on deep water. Riffle sits close on the river side, between it and the water. Sprinkle watches from her nook. One caption at the top, by the cat she is.',
      caption: [
        { when: { worry: 'water', not: { specialty: 'swimming' } }, text: 'A raft. On the deep water. Your tummy flips over. But Riffle will be right there.' },
        { when: { specialty: 'swimming', worry: 'water' }, text: 'A raft. A dripping tap is one thing. The deep river is another. But Riffle will be right there.' }
      ],
      next: 'f107'
    },

    f107: {
      when: { specialty: 'swimming', not: { worry: 'water' } },
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', { x: 1000, y: 760 }, 'left'), c('player', 'stand', 'happy', 'mud', 'left'),
         c('riffle', 'stand', 'happy', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, ONLY FOR A SWIMMING CAT. Our cat is on its feet at the edge of the daylight, tail up, already leaning toward the river as if the raft were tied up there now. Riffle grins at it. Sprinkle watches from her nook. One caption at the top.',
      caption: [{ when: { specialty: 'swimming', not: { worry: 'water' } }, text: 'A raft! Your paws can’t wait.' }],
      next: 'f108'
    },

    f108: {
      // found only: the roof's lead, said once to the two friends making tomorrow's plan, and parked
      when: { foundSquall: true },
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'wonder', 'dragon', 'left'), c('player', 'sit', 'solemn', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['day']),
      board: 'MEDIUM, ONLY FOR A CAT WHO FOUND HIM. Our cat passes on what the littlest dragonet saw from his roof, and a small inset shows it as he told it: two long low smudges beyond the hedge, and two shiny lines. Sprinkle and Riffle listen, heads up. Our cat’s balloon low.',
      say: [{ who: 'player', text: 'Squall saw two skinny shapes going to the tracks. Every night.' }],
      next: 'f109'
    },

    f109: {
      // Riffle's answer, in a panel of its own. Said in our cat's panel it had to sit to the right of
      // her balloon (it reads after it), across the picture from him and against Sprinkle's face: his
      // squeak read as hers
      when: { foundSquall: true },
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'wonder', 'dragon', 'left'), c('player', 'sit', 'solemn', 'back-left', 'right'),
         c('riffle', 'stand', 'scared', 'near', 'right')], ['day']),
      board: 'MEDIUM, ONLY FOR A CAT WHO FOUND HIM. Riffle shoots up on his hind legs, his whiskers standing straight out. Sprinkle and our cat look at him. His balloon a squeak, right over his own head.',
      say: [{ who: 'riffle', text: 'The TRACKS? At NIGHT?' }],
      next: 'f110'
    },

    f110: {
      when: { foundSquall: true },
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'kind', 'dragon', 'left'), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'hug', 'worried', 'near', 'right')], ['day']),
      board: 'MEDIUM, ONLY FOR A CAT WHO FOUND HIM. Riffle squeezes his own thick tail in both arms like a pillow and makes up his mind, very firmly, about the order of things. Sprinkle and our cat let him. Caption top left; his balloon two decided words.',
      caption: ['Riffle hugs his tail.'],
      say: [{ who: 'riffle', text: 'Raft first.' }],
      next: 'f111'
    },

    /* ------------------------------------------------------------------ Forty */

    f111: {
      scene: S('pile', 'rows', PILE_NIGHT,
        [c('tallyheart', 'sit', 'kind', 'crowd-1', 'right'), c('player', 'sit', 'happy', 'pile-left', 'right'),
         c('grizzled', 'sit', 'proud', 'beside', 'left')], ['sunset']),
      board: 'WIDE, FROM THE FRONT, SUNSET, THEN THE COUNTS. Tonight’s pile glows orange under the bramble arch: four full rows of ten, laid a little forward of where the scale was found, so that it lies on the bare earth behind the back row, beside the dug earth, one small glint in the shade. The old tom sits at the front, and across the rows from him our cat, with Tallyheart at its shoulder. In the Counts picture the four rows light a row at a time, with no number shown; after a miss Tallyheart scratches ten marks a row in the earth. Caption top left; the keypad sits below the panel.',
      caption: ['At sunset, you and Tallyheart find the old tom by tonight’s pile.'],
      counts: { set: 'ch04-night', next: 'f112' }
    },

    /* ------------------------------------------------------------------ Home */

    f112: {
      scene: S('den', 'outside', DEN_DUSK,
        // (our cat short of the doorway, Tallyheart a few steps behind: in the next panel she has walked
        // on past and sat down at its far side)
        [c('tallyheart', 'walk', 'kind', { x: 250, y: 884 }, 'right'), c('player', 'lookup', 'wonder', 'entrance-left', 'right')], ['dusk']),
      board: 'WIDE, DUSK. The rosebush den from outside in the rose-grey dusk, and low over the towers at the right a moon as thin as a paring of bark, the first moon of the whole story. Our cat has stopped on the way in to look up at it; Tallyheart comes up behind. Caption across the top.',
      caption: ['Low over the towers hangs a moon as thin as a curl of bark. When it’s round, the Clans will gather.'],
      next: 'f113'
    },

    f113: {
      // one frame, two variants: a cat who kept the secret, and one who told and found Squall (a cat
      // who told and did not go up has no frame here)
      when: { not: { ch3Told: true, foundSquall: false } },
      scene: S('den', 'outside', DEN_DUSK,
        // (Tallyheart at the doorway's far side, our cat at its near side: the one who speaks sits on
        // the right. Her second balloon has to follow her first, below it or to its right; with our cat
        // on her right it landed against our cat's face, and read as our cat's)
        [c('tallyheart', 'sit', 'kind', 'entrance-right', 'left'), c('player', 'sit', 'wonder', 'entrance-left', 'right')], ['dusk']),
      board: 'WIDE, AT THE DEN, DUSK, NOT FOR A CAT WHO TOLD AND DID NOT GO UP. Tallyheart has walked on past and sat down at the far side of the den’s doorway, the thin moon over the towers behind her, and bends her head to our cat across the dark opening. On the kept path her torn ear twitches and she offers an open door, asking nothing; on the told path, for a cat who went up the tower, she listens to its news of the roof and nods once. Captions top left and her balloons, by the path she took.',
      caption: [
        { when: { ch3Told: false }, text: 'At the den, Tallyheart stops. Her torn ear twitches.' },
        { when: { ch3Told: true, foundSquall: true }, text: 'At the den, you tell Tallyheart about Squall, and what he saw.' }
      ],
      say: [
        { who: 'tallyheart', text: 'That was a fair question you asked at the border.', when: { ch3Told: false } },
        { who: 'tallyheart', text: 'If you ever have one for me, I’m right here.', when: { ch3Told: false } },
        { who: 'tallyheart', text: 'A thing to check. Together.', when: { ch3Told: true, foundSquall: true } }
      ],
      next: 'f114'
    },

    f114: {
      // (lying: sitting up, the den draws the stone on the moss at her paws for 'nose' and 'chin' alike,
      // and the caption says which)
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'lie', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat lies in its own moss nest in the dark, and along the nest’s mossy edge its Case File stands in a row, each piece of bark overlapping the next like roof tiles, the newest in front. Riffle’s nearly black stone lies where it was put. Captions top left.',
      caption: [
        'In your nest: skritch, skritch. Your Case File goes along the mossy edge.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      next: 'f115'
    },

    f115: {
      // the secret card, scratched at night on both paths. For the cat who caught the fox's "flew" (a
      // noticing cat: she holds his card from the row of bark), that card lies beside it under the
      // panel, as the caption says: `held`, shown and never given here
      card: ['cant-fly', { id: 'fox-flew', when: { specialty: 'noticing' }, held: true }],
      scene: S('den', 'doorway', DEN_BARK,
        // (sitting up, the bark between her two forepaws at her chest: at her feet it lay under the stone)
        [c('player', 'situp', 'solemn', 'nest', 'left', { holds: 'bark' })], ['night']),
      board: 'MEDIUM, FROM INSIDE THE DEN, IN THE DARK. Our cat holds one last piece of bark up in both forepaws, the doorway a patch of night behind it, and scratches a single shape that hangs from a shoulder down to the ground: a drooping wing. For a noticing cat the fox’s card lies right beside it for this one panel; for every other cat a small thought bubble holds six little dragonets scattered along the river. Captions top left, the second by the cat she is; the new card appears under the panel, an eye in its corner, and for a noticing cat the fox’s card, with its ear, beside it.',
      caption: [
        'Then, in the dark, you scratch one more: a drooping wing.',
        { when: { not: { specialty: 'noticing' } }, text: 'She can’t go looking for her brothers and sisters. So you will.' },
        { when: { specialty: 'noticing' }, text: 'You hold it beside the fox’s FLEW. They can’t both be true.' }
      ],
      next: 'f116'
    },


    f116: {
      // on both paths: two pieces fewer in the row, two corners of bark under the moss
      scene: S('den', 'nest', DEN_HID,
        [c('player', 'loaf', 'solemn', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, IN THE DARK. The row along the nest’s edge is two pieces shorter now, and at its inner end two small corners of bark poke out from under the moss, where our cat has just patted it down over them. Its face is serious. One caption at the top.',
      caption: ['Then the two pieces of bark about Sprinkle go under the moss.'],
      next: 'f117'
    },

    f117: {
      scene: S('den', 'inside', DEN_HID,
        [c('snorer', 'sit', 'scared', 'sleeper-1', 'right'), c('player', 'loaf', 'kind', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. The grey apprentice is sitting bolt upright in his nest in the dark, eyes like saucers, whispering across the empty middle nest; our cat answers from its own nest without a moment’s doubt. No moon, only starlight through the rose leaves. Three small balloons, his last one a little embarrassed.',
      say: [
        { who: 'snorer', text: '{name}paw? What if the dragon comes here?', kind: 'whisper' },
        { who: 'player', text: 'It won’t. I promise.' },
        { who: 'snorer', text: '…Do the paw thing.', kind: 'whisper' }
      ],
      next: 'f118'
    },

    f118: {
      scene: S('den', 'nest', DEN_HID,
        [c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, IN THE DARK, THE TAP PICTURE. Our cat lies in its nest with both forepaws stretched out on the moss in front of it. In play the counting picture takes the panel: its own two forepaws on dark moss, glowing softly together; each tap pats them down, lights all ten claws and puts the next number in its murmur, 10, 20, 30, 40, and the fifth tap turns the page. Its murmur balloon at the top.',
      say: [{ who: 'player', text: 'Ten. Twenty. Thirty…', kind: 'whisper' }],
      skip: { table: 10, groups: 5, thing: 'claw', things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', next: 'f119' }
    },

    f119: {
      // only now, with him asleep: a hiccup, as the first was, never a bare roar in the dark
      scene: S('den', 'inside', DEN_HID,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'loaf', 'kind', 'nest', 'left')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. A big 50 floats over the dark, and across the empty middle nest the grey apprentice has curled up tight and is snoring, a little zzz rising from him. Only then, from far away and very high up, comes one tiny hiccup, lettered small in the dark of the doorway, and our cat turns an ear to it and smiles. Captions top left, the second by whether she has met him.',
      sfx: '…hic!',
      caption: [
        'By fifty, he’s snoring.',
        { when: { foundSquall: true }, text: 'Goodnight, Squall.' },
        { when: { foundSquall: false }, text: 'Sprinkle’s littlest brother is still up there. You’ll go up another day.' }
      ],
      next: 'f120'
    },


    f120: {
      scene: S('den', 'nest', DEN_HID,
        [c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP. Our cat settles its chin on its paws beside the row of bark, eyes half shut, and a small thought bubble holds tomorrow: a log raft on the river, an otter pup at the pole, and a fresh blank curl of bark. Captions top left, the second with a small smile in it.',
      caption: ['Tomorrow, you and Riffle will ask who was awake on the storm night.', 'And you have plenty of bark.'],
      next: 'f121'
    },

    f121: {
      scene: S('den', 'outside', DEN, [], ['night', 'stars', 'skyriver']),
      board: 'WIDE. The rosebush den from outside under a clear night sky: the Sky River pours across it from corner to corner, the thin moon long since set, and a soft glow of moss inside the den. Everything is still. Caption at the bottom.',
      caption: ['Over the rosebush, the Sky River shines, and you fall asleep.'],
      next: 'f122'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f122: {
      scene: S('den', 'nest', DEN_HID,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside its row of bark and Riffle’s stone, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream about, the night {they} started {their} Case File?'],
      // short enough for one line in the box
      input: { kind: 'dream', placeholder: 'A fox… bark… a hiccup…', next: 'f123' }
    },

    f123: {
      scene: S('den', 'doorway', DEN_HID,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'stars', 'skyriver', 'zzz']),
      board: 'WIDE CLOSING SHOT, FROM INSIDE THE DEN. Our cat sleeps curled in its moss nest with its Case File along the edge and two small corners of bark under the moss, and through the doorway the Sky River shines over the rosebush. One tiny contented zzz. Caption at the bottom, with END OF CHAPTER FOUR lettered like a title.',
      caption: [
        'You sleep warm in your nest, with your Case File along its mossy edge and the Sky River shining over the rosebush.',
        'End of Chapter Four.'
      ],
      end: true
    }
  };

  // The two afternoons are written one after the other above; the chapter lists every frame in id
  // order (f076a, f076b, f077a…), the reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* Chapter 3's claws lines, for the warm-up (the text: "Chapter 3's claws lines (praise, fast, help,
   * helpIntroNotFive, remembered, rememberedSlow)"). The warm-up is in the Hollow, so "sand" is true. */
  var CLAWS_PRAISE = [
    'Hopping by fives, like a real hunter.',
    'Yes! Five claws on every forepaw.',
    'Claws are trickier than ears, and you’re doing it anyway.',
    'Hop, hop, hop!',
    'You hopped it!'
  ];
  var QUICK = [
    'You didn’t even have to hop that time.',
    'Quick as a pounce!',
    'You knew that one before I finished asking.'
  ];
  var CLAWS_HELP = 'Close. Let’s scratch it out together: one swipe for every paw, five lines a swipe.';
  var TENS_HELP = 'Close. Let’s scratch it out together: two swipes for every cat, five lines a swipe.';
  // at the pile, morning and night: ten marks a row in the earth, lit a whole row at a time
  var ROW_HELP = 'Let’s scratch it out: ten marks for every row.';
  var ROW_ZERO = 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.';

  PC.story.ch04 = {
    id: 'ch04',
    number: 4,
    title: 'The Glittering Scale',
    start: 'f001',
    // the fox and the littlest dragonet until each is named on screen (a lesson's lines read these
    // too: every balloon of the riddle, its help, its fillers and its retry is "The little dragon")
    names: { reynard: 'The fox', squall: 'The little dragon' },

    // Her Case File: every card that exists by the end of chapter 4, in the order she can get them.
    // A card's picture is its own id (app/art/cards.js). `fox-flew` is answered by `cant-fly`
    // (stored for chapter 10); the two are drawn touching only once she has made the link herself:
    // a noticing cat at the border (`ch4CaughtFly`), or anyone at chapter 7's Old Bridge, where she
    // sees Sprinkle try to fly (`ch7Flew`; chapter 7 never sets `ch4CaughtFly`). `not` over two keys
    // matches when either flag is true (E.matches reads false as unset).
    cards: {
      'four-a-night': { mark: 'eye', line: 'Four gone every night.' },
      tidy: { mark: 'eye', line: 'The thief leaves the pile tidy.' },
      'dug-earth': { mark: 'eye', line: 'Freshly dug earth behind the pile.' },
      scale: { mark: 'eye', line: 'The ‘scale’ is smooth, like glass.' },
      'fox-flew': { mark: 'ear', line: 'The fox says it FLEW.', answers: ['cant-fly'],
        link: { when: { not: { ch4CaughtFly: false, ch7Flew: false } }, line: 'They can’t both be true.' } },
      'fox-moon': { mark: 'ear', line: 'The fox says the MOON was out on the storm night.' },
      // given on the roof; her file shows it only once the roof scene is finished
      'squall-shapes': { mark: 'ear', line: 'Squall says two skinny shapes carry something to the tracks.', when: { foundSquall: true } },
      'sprinkle-scales': { mark: 'eye', line: 'Sprinkle’s scales are grey and bumpy.' },
      'cant-fly': { mark: 'eye', line: 'Sprinkle can’t fly.' }
    },

    frames: ordered,

    counts: {
      // The warm-up on the 5s, in the Hollow: 3 × 5, then 5 × 7, or the 5s fact that was hardest for
      // her in chapter 3 (warmHard: it takes question 2), then 2 × 5, written last, in Tallyheart's
      // words, with one cat's two forepaws for its picture. The opener is never one of her top hard
      // facts nor the hard fact's pair: the first of 4 × 5, 1 × 5 and 5 × 5 that is neither opens
      // instead. 2 × 5 is never the hard pick nor a borrowed question (avoid): it is asked anyway.
      // Nothing says "last", and no closing line: a retry or a borrowed question can follow 2 × 5,
      // and the bridge to today's Count is the next frame's text.
      'ch04-claws': {
        table: 5, thing: 'claw', things: 'claws', unit: 'paw', units: 'paws', teacher: 'tallyheart',
        facts: [
          [3, 5], [5, 7],
          { a: 2, b: 5, who: [{ who: 'tallyheart' }, { who: 'tallyheart' }],
            prompt: [{ who: 'tallyheart', text: 'Two forepaws, five claws each. How many claws?' }], retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Ten!' }], rightAgain: true }
        ],
        warmHard: { table: 5, at: 1, alt: [[4, 5], [1, 5], [5, 5]] },
        avoid: [[2, 5]],
        fillFrom: 'ch03-claws',
        fillOrder: 'easiest',
        fillIntro: 'One from yesterday.',
        ask: '{a} × {b}',
        praise: CLAWS_PRAISE,
        fast: QUICK,
        fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
        helpIntro: CLAWS_HELP,
        helpIntroFar: CLAWS_HELP.replace(/^Close\.\s*/, ''),
        helpIntroNotFive: 'Remember: hopping by fives, every number ends in a five or a zero. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.',
        done: null
      },

      // The lesson: the 10s, both forepaws, ten answers in both orders; every number from 1 to 10
      // once. It opens on the four cats she just tapped; after the bridged 6 × 10, no answer is the one
      // before plus or minus ten. Its unit is a whole cat, and a cat has claws behind too: "front
      // claws" in every question the engine words for itself, in the lesson or lent to the pile. It
      // lends its easiest questions to the pile, morning and night, so its quick-after-a-miss line
      // says "scratches", never "sand".
      'ch04-tens': {
        table: 10, thing: 'front claw', things: 'front claws', unit: 'cat', units: 'cats', teacher: 'tallyheart',
        label: 'Both forepaws', hollowThings: 'tens',
        facts: [
          // the first four cats on the rim, the ones she just tapped (forty claws): always the
          // text's "You hopped it!", on a right retry too
          { a: 4, b: 10, who: RIM.slice(0, 4), right: [{ who: 'tallyheart', text: 'You hopped it!' }], rightAgain: true },
          { a: 10, b: 2, right: [{ who: 'tallyheart', text: 'Twenty! Two cats, ten claws each. Or ten cats, two ears each. Same twenty!' }],
            rightAgain: true },
          [1, 10], [5, 10],
          // the first past fifty: hop on from it (the first five cats' claws glow as it is asked)
          { a: 6, b: 10, lit: 50, prompt: 'Six cats. The first five have fifty claws. Now hop on from fifty!', retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Sixty! Hear it? SIX-ty. Six tens. The answer hides in its own name.' }],
            rightAgain: true },
          [10, 8], [10, 3], [10, 9], [7, 10],
          { a: 10, b: 10, right: [{ who: 'tallyheart', text: 'A HUNDRED! The very last thing Glintstar asked {Murmur}chime.' }],
            rightAgain: true }
        ],
        firstPrompt: 'How many front claws on the first four cats?',
        ask: '{a} × {b}',
        // dealt in order: the first is true of every cat on every question, wherever it lands, and
        // "You hopped it!" is 4 × 10's own line, so it comes last
        praise: [
          'Yes! Ten front claws on every cat.',
          'Hopping by tens, like a real hunter.',
          'Tens are friendly, aren’t they?',
          'Hop, hop, hop!',
          'You hopped it!'
        ],
        fast: QUICK,
        fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
        helpIntro: TENS_HELP,
        helpIntroFar: TENS_HELP.replace(/^Close\.\s*/, ''),
        helpIntroNotTen: 'Remember: hopping by tens, every number ends in a zero. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        done: 'That’s the tens.'
      },

      // The pile, one Counts moment: the old tom's count of last night (three rows of ten, in a
      // thought cloud), then the two full rows she walks along, lit a row at a time, and those two
      // rows only: the shadowed back row is the frame's scene, never the Counts picture. No praise and
      // no closing screen: the story answers. A miss is scratched in the earth, ten marks a row, and
      // borrows the easiest of this morning's tens (never tonight's 4 × 10).
      'ch04-pile': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'rows' },
        facts: [
          { a: 3, b: 10, picture: { kind: 'prey', layout: 'rows', thought: true },
            prompt: [{ who: 'grizzled', text: 'Best hunt since the storm.' }, { who: 'grizzled', text: 'Three rows of ten last night. How many pieces?' }],
            retryPrompt: 'Three rows of ten. How many pieces?',
            right: [{ who: 'grizzled', text: 'Hmph.' }, { who: 'grizzled', text: 'It took me till the stars came out.' }],
            rightAgain: true },
          // the text's narration, lettered as caption boxes above the keypad; its clock runs over them
          { a: 2, b: 10, light: 'rows', check: true,
            prompt: [{ kind: 'caption', text: 'You walk along the rows. One full row. Two full rows.' },
              { kind: 'caption', text: 'How many pieces in two rows of ten?' }],
            retryPrompt: 'Two rows of ten. How many pieces?' }
        ],
        ask: '{a} × {b}',
        praise: [],
        ground: 'earth',
        helpIntro: ROW_HELP,
        helpIntroNotTen: ROW_ZERO,
        fillFrom: 'ch04-tens',
        fillOrder: 'easiest',
        avoid: [[4, 10]],
        fillIntro: 'One from this morning.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        again: ['There it is. You remembered that one.'],
        done: null
      },

      // Squall's riddle: Mama's morning count, a password only a friend of the clutch knows. Seven
      // little forepaws scratched in the roof's grit, no dragonet behind them. A miss is swiped in the
      // grit by him and hopped by the player; it comes back as "Mama's count again!", with the easiest
      // of chapter 3's claws in between, in his voice, never Sprinkle's dinner (2 × 5).
      'ch04-riddle': {
        table: 5, thing: 'claw', things: 'claws', unit: 'forepaw', units: 'forepaws', teacher: 'squall',
        picture: { kind: 'grit' },
        facts: [
          { a: 7, b: 5,
            prompt: 'Seven dragonets hold up one forepaw each. Five claws on every forepaw. How many claws does Mama count?',
            retryPrompt: 'Seven forepaws, five claws each. How many claws?',
            right: [{ who: 'squall', text: 'THIRTY-FIVE!', kind: 'shout' }],
            rightAgain: true }
        ],
        ground: 'grit',
        helpCounter: 'you',
        helpIntro: 'Scratch it on the roof! You hop!',
        fillFrom: 'ch03-claws',
        fillOrder: 'easiest',
        fillVoice: 'borrower',
        avoid: [[2, 5]],
        fillIntro: 'Do another one!',
        againIntro: 'Mama’s count again!',
        ask: '{a} × {b}',
        praise: ['YES!', 'Hop, hop, HOP!'],
        fast: ['FAST! Faster than a giant dragon!'],
        again: ['You REMEMBERED!'],
        miss: 'There! We’ll count that one AGAIN.',
        missLast: 'There. Now we’ve counted it together.',
        done: null
      },

      // Tonight's pile: the lesson's opener again, in the story's own picture, four rows lit a row at
      // a time. A miss borrows 1 × 10 and 5 × 10, whether or not she went up in between (avoid: the
      // morning pile's own rows, which its sibling set asked).
      'ch04-night': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'rows' },
        facts: [
          { a: 4, b: 10, light: 'rows',
            prompt: [{ who: 'grizzled', text: 'Four rows of ten tonight.' }, { who: 'grizzled', text: 'How many pieces, counting cat?' }],
            retryPrompt: 'Four rows of ten. How many pieces?',
            right: [{ who: 'grizzled', text: 'Forty.' }, { kind: 'caption', text: 'He checks, under his breath.' },
              { who: 'grizzled', text: 'Ten, twenty, thirty, forty. Hmph. Quicker than twos.', kind: 'whisper' }],
            rightAgain: true }
        ],
        ask: '{a} × {b}',
        praise: [],
        ground: 'earth',
        helpIntro: ROW_HELP,
        helpIntroNotTen: ROW_ZERO,
        fillFrom: 'ch04-tens',
        fillOrder: 'easiest',
        avoid: [[3, 10], [2, 10]],
        fillIntro: 'One from this morning.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        again: ['There it is. You remembered that one.'],
        done: null
      }
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'The Glittering Scale',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: '{name}paw’s dream that night is not in the Case File.',
      recap: [
        { text: 'On {name}paw’s third morning, the pile lay in rows of ten, and a gap showed in a heartbeat: four more pieces gone, twelve in three nights.' },
        { text: 'Tallyheart taught {name}paw {their} fourth Count, both forepaws, and scratched a fourth claw mark on the tree.' },
        { text: 'In the gap lay a glittering ‘scale,’ smooth, like glass.' },
        { text: 'A smiling fox named Reynard came to the border and said he saw a dragon fly off with the prey by moonlight. Most of the Clan believed him.' },
        { text: '{name}paw asked a fair question, and Glintstar gave the dragon until the full moon.' },
        { text: '{name}paw started a Case File: a piece of bark for every clue, with an eye for what {they} saw and an ear for what {they} was told.' },

        // ("Reynard said", not "he said": for a tom the line began "He caught…: he said…", two different he's)
        { when: { ch4CaughtFly: true }, text: '{They} caught one hole in the fox’s story: Reynard said the dragon flew, and Sprinkle can’t fly.' },

        // the roof, for a cat who found him: two sentences, or (for a cat who also caught the fox's
        // "flew", whose page would otherwise run to eleven) the same two as one. A page says "found"
        // only for a dragonet found in its own chapter: a cat who said "Not today" here and went up
        // in chapter 5 (`ch5Roof`, set with `foundSquall` by chapter 5's roof) reads on this page
        // that he was still roaring, and on chapter 5's that she found him
        { when: { foundSquall: true, ch5Roof: false, ch9Roof: false, not: { ch4CaughtFly: true } }, text: 'On the roof of {their} old tower, {they} found Squall, the littlest dragonet, who roars at airplanes and hiccups.' },
        { when: { foundSquall: true, ch5Roof: false, ch9Roof: false, not: { ch4CaughtFly: true } }, text: 'Squall told {them} about two skinny shapes that go to the tracks every night. A thing to check.' },
        { when: { foundSquall: true, ch5Roof: false, ch9Roof: false, ch4CaughtFly: true }, text: 'On the roof of {their} old tower, {they} found Squall, the littlest dragonet, who told {them} about two skinny shapes that go to the tracks every night.' },
        { when: { foundSquall: false }, text: 'On the roof of {their} old tower, Sprinkle’s littlest brother is still roaring, and hiccuping.' },
        { when: { ch5Roof: true }, text: 'On the roof of {their} old tower, Sprinkle’s littlest brother is still roaring, and hiccuping.' },
        // (chapter 9's: `ch5Roof` too can be set when chapter 5's roof is read again from the middle of chapter
        // 9's roof copy, so this line stands back for it and the page says "still roaring" once)
        { when: { ch9Roof: true, ch5Roof: false }, text: 'On the roof of {their} old tower, Sprinkle’s littlest brother is still roaring, and hiccuping.' },

        { text: 'Under the Old Bridge, Sprinkle looked herself over and said the scale wasn’t hers, and three friends made a thirty-claw promise.' },
        { text: 'That night there were forty in the rows, a moon as thin as a curl of bark, and a grey tom who fell asleep by fifty.' }
      ],
      // the second of the seven dragonets' pages: only for a cat who has found him, whichever
      // chapter she finds him in
      dragonet: {
        id: 'squall',
        name: 'Squall',
        when: { foundSquall: true },
        lines: [
          'The littlest of the clutch, slate grey with yellow flecks like sparks, and the loudest.',
          '{name}paw found him on the roof of the tallest tower, hugging the pole of the red light and roaring at airplanes.',
          'He thinks they are giant dragons.',
          'His roar ends in a hiccup. Five more claws, counted.'
        ]
      }
    },

    teaser: {
      title: 'Chapter 5: Riffle’s River',
      lines: [
        'Tomorrow, you ride Riffle’s raft, to ask the river who was awake on the storm night.',
        'And forty pieces lie in their rows.'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
