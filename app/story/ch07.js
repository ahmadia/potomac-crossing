/* Chapter 7: The Counts Don’t Lie.
 *
 * The story (docs/chapters/07-the-counts-dont-lie.md, Draft v0.4, final) cut into graphic-novel panels,
 * per the frame contract in docs/build.md; its spec (docs/chapters/07-the-counts-dont-lie.spec.md, v0.3)
 * is the build's contract for the flag, the Counts sets, the cards, the art, the pages she taps and the
 * book. Each frame is one moment: a drawn scene, a written storyboard (`board`) for a future
 * illustrator, short captions, speech balloons and sound effects (the wind chime rings from far up the
 * tower and the burp by Sprinkle's mouth: `sfxAt`; the skritch in her nest, whose caption runs on into
 * it, is said in words for a child who listens: `sfxRead`), and exactly one interaction. Frame ids run
 * in reading order. A choice's outcomes carry a letter and rejoin at a plain number:
 *   a light choice     its two outcomes at the next number, `a` and `b` (f006a, f006b, is grass soft),
 *                      one panel each; sniff or listen at the tunnel is the told path's choice (f088 →
 *                      f089a, f089b) and the kept path's (f090 → f091a, f091b), each with its own two
 *                      panels, the same on both: the storyboard walks a choice's branches to where they
 *                      meet, so a choice reached only by `else` would be missing from it;
 *   the sums' choices  one answer does for both, on one outcome panel with her card (f039 → f040, the
 *                      told path's; f055 → f056, the kept path's); the FLEW screen (f069) has none.
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line of narration that
 * follows a balloon on one screen of the story opens the next panel, or the panel is split in two (the
 * spec's build notes list the screens where the order matters; “Sorry, Coil,” everybody whispers. is a
 * caption after his line, so it is a panel of its own, f076; at the tunnel the told path's two whispers,
 * hers and Tallyheart's, are a panel each, f087 and f088, so each balloon's tail goes to its own speaker).
 * A line the story marks [if …] carries a `when`. A scene cannot vary by flag, so where Tallyheart's
 * being there changes the picture the panel is two frames, one after the other, with opposite `when`s
 * (the told path's with her in it, first, leading to the kept path's twin, which leads on): whichever is
 * not hers is passed over. The close shots she would not be in are written once: the bridge's `wall`,
 * `under` and `print`, and the pile's `hole`.
 *   ch3Told       the sum in the Hollow: told f036–f040 (the dragon's ten fish, the sixty, the two lines,
 *                 the told sum choice and its card), kept f041–f043 (“For a DRAGON.”, her thought) and
 *                 f046/f047 (“Back by sunset”, her hot ears); under the bridge every `back` panel
 *                 (f048/f049 the branch or the bank, with the toss Tap, f050/f051, f058/f059, f060/f061,
 *                 f067/f068 FLY, f070/f071, f072/f073), and the kept path's own sixty there (f053–f056,
 *                 the kept sum choice and its card); at dusk f079/f080, f081/f082 (the slip round),
 *                 f083/f084 (the roots), f087 and f088/f090 (the tunnel choice), f093/f094, f095/f096
 *   specialty     f067 (noticing: “Tallyheart looks at you.”), f067/f068 (noticing, with ch4CaughtFly:
 *                 “I KNEW it!”), f082/f083 (sneaking), f083/f084 (noticing: the dug earth; any other:
 *                 Coil's “Under”), f092 (climbing: the tracks, a screen of its own)
 *   worry         f086 (one line each, at the tunnel's mouth)
 *   ch2Stone      f097 (her stone)
 *   lessonClean   f032 (the seventh mark's two pairs of lines)
 * One flag is set, by reaching a frame, for good: `ch7Flew`, on the FLEW screen (f069), every path. No
 * choice sets anything, and nothing here sets `ch4CaughtFly` (it still means a noticing cat's catch at
 * the border in chapter 4; chapter 4's `fox-flew` link reads either flag).
 *
 * Speakers: everyone on screen has been on screen before, so the chapter has no `names`. Coil is “Coil”
 * (his balloons carry `name`, so his head as a stone keeps its face to itself, `faceHidden`); the grey
 * tom is the snoring apprentice of chapters 1 to 6.
 *
 * Text conventions: second person, present tense (“you”); typographic apostrophes and quotes (’ “ ” …)
 * so nothing needs escaping. Time of day comes from fx: `night` in the den as she wakes, `morning` at
 * her old step, the tower, the pile and the Hollow, `day` under the Old Bridge, `sunset` at the pile,
 * `dusk` at the pile and round the back (the seventh evening's moon from “The moon comes out, fatter
 * again.”, `moon: 7`, on `wide`), `night` in the den.
 * tests/story-ch07.test.js checks all of this; tools/storyboard.mjs turns it into docs/storyboard/ch07.md.
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

  /* The five cats on the hollow's rim, left to right (chapters 5 and 6's), sitting up. In the `lesson`
   * camera the cats at `sand-left` and `sand-right` sit right in front of `rim-2` and `rim-4`, so
   * `close` leaves those two out. They are also the five cheeks she hops by sixes (the skip's `who`). */
  var RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 },
    { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  function rim(close) {
    var out = [c('clancat', 'situp', 'proud', 'rim-1', 'right', { variant: 1 })];
    if (!close) out.push(c('murmurchime', 'situp', 'happy', 'rim-2', 'right'));
    out.push(c('clancat', 'situp', 'neutral', 'rim-3', 'left', { variant: 3 }));
    if (!close) out.push(c('clancat', 'situp', 'proud', 'rim-4', 'left', { variant: 5 }));
    out.push(c('grizzled', 'situp', 'stern', 'rim-5', 'left'));
    return out;
  }

  // Scene options that stay the same through a place
  // Waffles' tower: the wind chime on her balcony in every panel
  var TOWER = { chime: true };
  // The sixth morning's pile: four rows of ten, the back row with four empty places right in its middle,
  // the “scale” on the bare earth behind it. Until she walks round to it the back row is a dark band in
  // the brambles' shadow; then the gap and the freshly dug earth.
  var ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  var PILE_SHADE = { rows: ROWS, back: 'shadow', scale: 'behind' };
  var PILE_GAP = { rows: ROWS, scale: 'behind', dug: 'big' };
  // At sunset the day's hunting has filled it again: forty pieces in four full rows. From “The moon
  // comes out, fatter again.” the seventh evening's moon is in the sky (`wide` only here). Round the back
  // (`rear`, no sky) the low roots hang over the dug earth until she lifts them (`tap: 'roots'`); from
  // the mouth on they stay lifted (`tunnel: true`); the close shot of the mouth (`hole`) always has them up.
  var EVE = { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' };
  var MOON = merge(EVE, { moon: 7 });
  var ROOTS = merge(EVE, { tap: 'roots' });
  var OPEN = merge(EVE, { tunnel: true });
  // the first guards at dusk: small, past the rows at the front, side-on, looking out over the camp
  function guards() {
    return [c('clancat', 'sit', 'neutral', 'guard-1', 'left', { variant: 2 }), c('clancat', 'sit', 'neutral', 'guard-2', 'right', { variant: 4 }),
      c('clancat', 'stand', 'neutral', 'guard-3', 'right', { variant: 3 })];
  }
  // the tree: six marks until Tallyheart scratches the seventh (f031), seven from then on
  var H6 = { marks: 6, glow: 'auto' };
  var H7 = { marks: 7, glow: 'auto' };
  // the two lines scratched to scale, a short one for twenty-four and a long one for sixty, with their
  // numbers (in the Hollow's sand, and in the mud under the Old Bridge on the kept path)
  var CMP = [24, 60];
  // the Old Bridge: Sprinkle's big prints in the mud (as in chapters 3 to 6) and the stone leg beside her
  // nook with Coil's gap low in it (`stones`, the `back` camera's); `wall` is that leg close
  var BACK = { prints: true, stones: true };
  // the FLY pair, where Sprinkle tries her wings: the lettering keeps off her drooping wing (final review)
  var FLY = { prints: true, stones: true, wing: true };
  var UNDER = { prints: true };
  // the three-shot under the arch (chapter 6's): Riffle on the mud at the left, facing in
  var RIFFLE = { x: 400, y: 940 };
  // our cat nose to nose with Tallyheart on the sand (“You come VERY close.”)
  var CLOSE = { x: 820, y: 892, h: 280 };
  // our cat in front of the rows, between Glintstar and Tallyheart (`low` has room for two at its ends)
  var FRONT = { x: 820, y: 940, h: 390 };
  // Tallyheart under the bridge on the told path: across the nook, in front of Sprinkle's tail and left of
  // Riffle (chapter 6's spot; listed after Sprinkle, so she is drawn over the tail, and before Riffle). At
  // `near` she sits on top of our cat at `back-left`
  var ACROSS = { x: 1250, y: 900, h: 330 };
  // where Sprinkle tries her wings on the told path (FLY): Tallyheart by the wall behind our cat, facing in,
  // listed before our cat (drawn behind her), so nobody stands in front of the hurt wing, the evidence the
  // chapter turns on (final review: across the nook she hid it)
  var BY_WALL = { x: 300, y: 960, h: 330 };
  // our cat in the loop of Sprinkle's curled tail, in front of her (she faces left, so the loop is on her
  // left): chapter 3's spot for the same hug (ch03 f089b), drawn at 0.9
  var TAIL = { x: 750, y: 822 };
  // The den at night: Riffle's stone where she put it, her Case File along the mossy edge of her nest,
  // and the pieces she must keep secret under the moss (Sprinkle's two, Coil's, and from tonight her
  // count, Sprinkle's prints and the tunnel)
  var DEN = { weather: 'clear', moon: false, stone: 'auto' };
  var DEN_BARK = merge(DEN, { bark: 'auto', hidden: true });
  // the told path and the kept path
  var TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
  var NOTICING = { specialty: 'noticing' }, NOT_NOTICING = { not: { specialty: 'noticing' } };
  var CAUGHT = { specialty: 'noticing', ch4CaughtFly: true };

  var frames = {

    /* ------------------------------------------------------------------ The wind chime */

    f001: {
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'sit', 'wonder', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, BEFORE DAWN. Our cat sits bolt upright in its moss nest in the grey dark before sunrise, ears straight up, eyes wide, still half inside a dream; a small inset shows a wind chime turning on a high balcony. Its rows of bark stand along the mossy edge. Two captions, top left and at the bottom.',
      caption: ['You wake before the sun. A wind chime is still ringing in your ears, from your dream.', 'Who was up there, awake, when the rain stopped? You know EXACTLY who.'],
      next: 'f002'
    },

    f002: {
      // the chime rings from far up, so it is lettered near the top edge, over the step's open sky
      scene: S('garden', 'step', { dish: true },
        [c('player', 'sit', 'wonder', 'step', 'right', { tap: 'ears' })], ['morning']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TAP PICTURE. Our cat sits on its old patio step in the first morning light beside the blue dish, brim-full of water, and tips one ear toward a faint ringing from somewhere very high above. In play our cat’s ears glow softly; one tap tips its head right back to look up the tower, and the page turns. Captions top left; the ting lettered small near the top edge.',
      caption: ['Through the gap in the hedge, to your old step. Your dish of water is there, full.', 'Far, far up, a wind chime rings.'],
      sfx: 'Ting-a-ling.',
      sfxAt: [70, 12],
      scratch: { tap: 'ears', prompt: '**Tap** to look up.', label: 'Look up.', next: 'f003' }
    },

    f003: {
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'shout', 'railing', 'left')], ['morning']),
      board: 'LOW ANGLE, TALL PANEL. From the step we look straight up the glass tower in the morning sun: nineteen floors up, a tiny fluffy white head pops over a balcony railing beside a wind chime, mouth wide open. The glass reflects a clean pale sky. Her shout balloon’s tail runs all the way up to her.',
      say: [{ who: 'waffles', text: '{petname}! DARLING!', kind: 'shout' }],
      next: 'f004'
    },

    f004: {
      scene: S('tower', 'balcony', TOWER,
        [c('waffles', 'peer', 'happy', 'railing', 'left')], ['morning']),
      board: 'MEDIUM, NINETEEN FLOORS UP. Princess Waffles leans so far over her balcony railing that her pink bow dangles, beaming down at the garden, the wind chime swinging beside her geranium. The city stretches away behind her in the morning light. Caption top left; her balloon thrilled, then smug.',
      caption: ['Princess Waffles leans over her balcony.'],
      say: [{ who: 'waffles', text: 'You came BACK! The whole tower is talking about you. Well. I am.' }],
      next: 'f005'
    },

    f005: {
      // a light choice: her answer to each, a panel each; it sets nothing
      scene: S('tower', 'balcony-close', TOWER,
        [c('waffles', 'peer', 'dreamy', 'railing', 'left')], ['morning']),
      board: 'CLOSE-UP, NINETEEN FLOORS UP. Waffles rests her flat face on the railing and gazes down at the lawn far below as if it were a faraway country; a small inset shows the little room with its sliding door and a DING over it, Waffles fainting in front of it. She has never once touched grass. Her balloon wistful, then dramatic; the choices sit below the panel.',
      say: [{ who: 'waffles', text: 'Tell me one thing, {petname}. Is grass SOFT? I’d come and see. But the little room that goes DING? Fine for BRAVE cats. For ME, it’s TERRIFYING.' }],
      choice: {
        options: [
          { label: '“Very soft.”', sets: {}, next: 'f006a' },
          { label: '“Very WET.”', sets: {}, next: 'f006b' }
        ]
      }
    },

    f006a: {
      scene: S('tower', 'balcony-close', TOWER,
        [c('waffles', 'loaf', 'dreamy', 'railing', 'left')], ['morning']),
      board: 'CLOSE-UP, NINETEEN FLOORS UP. Waffles sinks down on the railing with her chin on her paws and lets out a long, happy sigh, eyes half shut, picturing soft grass she will never walk on. A little puff of breath drifts from her nose. Her balloon a sigh.',
      say: [{ who: 'waffles', text: 'I KNEW it.' }],
      next: 'f007'
    },

    f006b: {
      scene: S('tower', 'balcony-close', TOWER,
        [c('waffles', 'peer', 'sniff', 'railing', 'left')], ['morning']),
      board: 'CLOSE-UP, NINETEEN FLOORS UP, COMEDY BEAT. Waffles pulls her head back from the railing with her nose wrinkled and her eyes screwed half shut, as if somebody had offered her a puddle. One paw rises to her bow. Her balloon prim and final.',
      say: [{ who: 'waffles', text: 'Ew. Tell me no more.' }],
      next: 'f007'
    },

    f007: {
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'shout', 'railing', 'left'), c('player', 'lookup', 'wonder', 'foot', 'right')], ['morning']),
      board: 'LOW ANGLE, TALL PANEL. Straight up the glass tower: our cat small at its foot with its head tipped right back, calling up, and Waffles a white puff at her railing nineteen floors above, nearly toppling over at one thrilling word. Our cat’s balloon rises from the bottom of the panel; hers comes back down, jagged.',
      say: [
        { who: 'player', text: 'Waffles, I need a witness. Were you awake on the storm night?' },
        { who: 'waffles', text: 'A WITNESS?', kind: 'shout' }
      ],
      next: 'f008'
    },

    f008: {
      scene: S('tower', 'balcony', TOWER,
        [c('waffles', 'sit', 'proud', 'railing', 'left', { puffed: true })], ['morning']),
      board: 'MEDIUM, NINETEEN FLOORS UP, COMEDY BEAT. Waffles sits up on her balcony with every hair fluffed out to twice her size, chest high, one paw pressed to it like a great actress about to give her finest speech. A small inset shows her at night with her paws over her eyes, wide awake. Caption top left; her balloon grand, the capitals heavy.',
      caption: ['She fluffs herself up.'],
      say: [{ who: 'waffles', text: 'Darling, I was BORN for this. I was up ALL night with my nerves. My Tall One says I’m DRAMATIC. I’m not. I’m SENSITIVE.' }],
      next: 'f009'
    },

    f009: {
      // her “And?” ends this panel, so “NO moon.” is the page she turns to
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'dreamy', 'railing', 'left'), c('player', 'lookup', 'wonder', 'foot', 'right')], ['morning']),
      board: 'LOW ANGLE, TALL PANEL. The same view straight up the tower: our cat at its foot asks its one careful question, and far above Waffles leans her chin on the railing and gazes at the sky, remembering; a small inset shows the storm night’s sky, rain stopping. Our cat’s last balloon is one small word. Three balloons, up, down, up.',
      say: [
        { who: 'player', text: 'When the rain stopped, was the moon out?' },
        { who: 'waffles', text: 'The moon calms my nerves. So the moment the rain stopped, I looked for it.' },
        { who: 'player', text: 'And?' }
      ],
      next: 'f010'
    },

    f010: {
      scene: S('tower', 'balcony-close', TOWER,
        [c('waffles', 'loaf', 'solemn', 'railing', 'left')], ['morning']),
      board: 'CLOSE-UP, NINETEEN FLOORS UP, THE WITNESS. Waffles looks straight out of the panel, perfectly serious for once, her flat face level on the railing; a small inset shows a black sky over the towers with no moon in it at all, and beside it a glowing box switched off, just as black. Her balloon slow and certain.',
      say: [{ who: 'waffles', text: 'NO moon. Not a sliver. Black as the glowing box when my Tall One switches it off.' }],
      next: 'f011'
    },

    f011: {
      // the moon answered by a second witness: Waffles' card, which lies beside the fox's moon in her file
      card: 'waffles-no-moon',
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'proud', 'railing', 'left'), c('player', 'lookup', 'happy', 'foot', 'right')], ['morning']),
      board: 'LOW ANGLE, TALL PANEL. Our cat at the tower’s foot grins up at the balcony, putting two and two together, and nineteen floors above Waffles tosses her head so her bow bounces; a small inset shows a muddier, smaller our cat on its second day, listening to her on this same step. Our cat’s balloon amazed, hers grand; the new card appears under the panel, an ear in its corner.',
      say: [
        { who: 'player', text: 'You told me that on my second day. I didn’t know it mattered.' },
        { who: 'waffles', text: 'Darling. EVERYTHING I say matters.' }
      ],
      next: 'f012'
    },

    f012: {
      scene: S('tower', 'balcony', TOWER,
        [c('waffles', 'peer', 'kind', 'railing', 'left')], ['morning']),
      board: 'MEDIUM, NINETEEN FLOORS UP. Waffles leans on her railing and looks down at the garden with an unexpectedly soft face; a small inset shows the Tall One’s slippers and a hand setting the blue dish down on the step in the early morning. The first gold light touches the balcony. Her balloon gentle.',
      say: [{ who: 'waffles', text: 'I see your Tall One fill that dish, you know. Every single morning.' }],
      next: 'f013'
    },

    f013: {
      // the wave is the tap: our cat is drawn already waving, and so is Waffles
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'pawup', 'happy', 'railing', 'left'), c('player', 'pawup', 'happy', 'foot', 'right', { tap: 'paw' })], ['morning']),
      board: 'LOW ANGLE, TALL PANEL, THE TAP PICTURE. The sun peeks up between the towers behind the glass and lights its edge gold; at the foot our cat lifts a forepaw to wave goodbye, and nineteen floors up a fluffy white paw waves back over the railing. In play our cat’s raised paw glows softly; one tap waves it and turns the page. Caption top left; her balloon a cheer.',
      caption: ['Between the towers, the sun peeks up. The count!'],
      say: [{ who: 'waffles', text: 'Go, {petname}. Count things. Be FABULOUS.' }],
      scratch: { tap: 'paw', prompt: '**Tap** to wave goodbye.', label: 'Wave goodbye.', next: 'f014' }
    },

    /* ------------------------------------------------------------------ The sixth count */

    f014: {
      // her balloon is not said again over the question: the caption is the question's own (`intro: false`)
      // the three guards in one column at the left, listed back to front so each nearer cat is drawn over the one behind
      scene: S('pile', 'rows', PILE_SHADE,
        [c('clancat', 'sit', 'sleepy', 'crowd-2', 'right', { variant: 3 }), c('clancat', 'sit', 'sleepy', 'crowd-1', 'right', { variant: 4 }),
         c('clancat', 'sit', 'sleepy', 'pile-left', 'right', { variant: 2 }),
         c('tallyheart', 'sit', 'solemn', 'crowd-3', 'left'), c('player', 'sit', 'wonder', 'beside', 'left')], ['morning']),
      board: 'WIDE, FROM THE FRONT, SUNRISE, THEN THE COUNTS. The prey pile in its rows under the bramble arch in the first gold light, the back row only a dark band in the brambles’ shadow; three guards at the left end of the rows yawn enormously after a whole night of watching, and the Clan waits round the rest. Tallyheart and our cat stand ready at the right. In the Counts picture the three front rows light one at a time as our cat walks along them, with no number shown; the keypad sits below the panel.',
      caption: ['By the prey pile, the last guards are yawning. The whole Clan is waiting.'],
      say: [{ who: 'tallyheart', text: '{name}paw. Eighteen guards. Let’s see if it worked.' }],
      counts: { set: 'ch07-pile', intro: false, next: 'f015' }
    },

    f015: {
      scene: S('pile', 'rows', merge(PILE_SHADE, { tap: 'back' }),
        [c('tallyheart', 'sit', 'solemn', 'crowd-3', 'left'), c('player', 'stand', 'wonder', 'beside', 'left')], ['morning']),
      board: 'WIDE, FROM THE FRONT, THE TAP PICTURE. The three front rows are counted and the back row still lies in the brambles’ shadow, a dark band nobody can see into; our cat steps toward it, Tallyheart watching. In play the shadowed back row glows softly; one tap walks our cat round to it and turns the page. One caption at the top.',
      caption: ['The back row is still in the brambles’ shadow.'],
      scratch: { tap: 'back', prompt: '**Tap** to walk round the back.', label: 'Walk round the back.', next: 'f016' }
    },

    f016: {
      // the back row close up, out of the shadow: she counts the gaps herself, before anyone says it
      scene: S('pile', 'gap', PILE_GAP,
        [c('player', 'crouch', 'wonder', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM, THE REVEAL, THE TAP PICTURE. Our cat has walked round to the back row, out of the bramble shadow now: three pieces, then empty places pressed into the earth, then three more, and behind them a soft heap of freshly dug earth. In play the counting picture takes the panel: the back row close up, the next empty place glowing; each tap lights one and puts the count in our cat’s balloon, 1, 2, 3, 4. Caption top left, well clear of the gap.',
      caption: ['Right in the middle of the back row: empty spaces.'],
      skip: { table: 1, groups: 4, thing: 'gap', things: 'gaps', teacher: 'player', label: 'Count the next empty space.', prompt: '**Tap** the empty spaces.', carry: false, next: 'f017' }
    },

    f017: {
      scene: S('pile', 'gap', PILE_GAP,
        [c('player', 'sit', 'worried', 'pile-left', 'right'), c('tallyheart', 'sit', 'solemn', 'beside', 'left'), c('murmurchime', 'stand', 'scared', 'pile-right', 'left')], ['morning']),
      board: 'MEDIUM, THE BACK ROW. Our cat sits back from the four empty places and says it first, before anybody else, and Tallyheart and the little tortoiseshell warrior arrive behind it and stop dead. The hole is right in the middle of the row, exactly where every other morning’s was. Our cat’s balloon two flat words.',
      say: [{ who: 'player', text: 'Four gone.' }],
      next: 'f018'
    },

    f018: {
      scene: S('pile', 'wide', PILE_GAP,
        [c('glintstar', 'stand', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'),
         c('player', 'sit', 'worried', 'pile-left', 'right'), c('murmurchime', 'stand', 'shout', 'crowd-1', 'right'),
         c('clancat', 'sit', 'shy', 'beside', 'left', { variant: 2 }), c('clancat', 'sit', 'shy', 'crowd-2', 'left', { variant: 4 }),
         c('grizzled', 'sit', 'sad', 'crowd-3', 'left', { holds: 'pinecone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE. Cats crowd round the rows in the morning light and the little tortoiseshell warrior bounces up indignantly at the left, sure she kept her eyes open all night, then admits to one tiny blink with a pinch of two claws. Glintstar stands silver and still on the fountain’s edge. Caption top left; her balloon loud, the last bit sheepish.',
      caption: ['Still tidy. Still the back.'],
      say: [{ who: 'murmurchime', text: 'FOUR? But we had EIGHTEEN guards! I didn’t blink once. Well. One very SMALL blink.' }],
      next: 'f019'
    },

    f019: {
      // the last guards where they sat at the count, at the left end of the rows (back to front, as f014)
      scene: S('pile', 'rows', PILE_GAP,
        [c('clancat', 'sit', 'shy', 'crowd-2', 'right', { variant: 3 }), c('clancat', 'sit', 'shy', 'crowd-1', 'right', { variant: 4 }),
         c('clancat', 'sit', 'shy', 'pile-left', 'right', { variant: 2 }), c('tallyheart', 'sit', 'solemn', 'crowd-3', 'left'),
         c('grizzled', 'sit', 'sad', 'beside', 'left', { holds: 'pinecone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE, FROM THE FRONT, A QUIET BEAT. The last guards sit at the left end of the rows with their heads down, looking at their own paws, and across the rows Tallyheart stares at the gap in the back row as if it were a sum that will not come out; at the front the old tom holds his pinecone in both paws. Nobody is cross with anybody but themselves. Captions top left; her balloon level and puzzled.',
      caption: ['The last guards look at their paws.', 'Tallyheart stares at the gap.'],
      say: [{ who: 'tallyheart', text: 'Eighteen guards. The pile was all there when our watch ended. And not one guard saw a thing.' }],
      next: 'f020'
    },

    f020: {
      // the old tom's line, after hers on the same screen: a panel of its own (the screen is long)
      scene: S('pile', 'low', PILE_GAP,
        [c('grizzled', 'sit', 'sad', 'pile-left', 'right', { holds: 'pinecone', holdAt: 'paws' }), c('tallyheart', 'sit', 'solemn', 'beside', 'left')], ['morning']),
      board: 'MEDIUM, LOW, COMEDY BEAT. The old tom sits at the end of the rows clutching his pinecone to his chest and sighs that nobody ever listens to him, and across the rows Tallyheart gives him a long, flat look. The gap is in the back row behind them. His balloon a grumble, the capitals loud.',
      say: [{ who: 'grizzled', text: 'They wouldn’t let me guard with my pinecone. And LOOK what happens.' }],
      next: 'f021'
    },

    f021: {
      scene: S('pile', 'wide', PILE_GAP,
        [c('glintstar', 'stand', 'kind', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'),
         c('player', 'stand', 'wonder', 'pile-left', 'right'), c('murmurchime', 'sit', 'shy', 'crowd-1', 'right'),
         c('clancat', 'sit', 'shy', 'beside', 'left', { variant: 2 }), c('clancat', 'sit', 'neutral', 'crowd-2', 'left', { variant: 4 }),
         c('grizzled', 'sit', 'sad', 'crowd-3', 'left', { holds: 'pinecone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE. Glintstar speaks from the fountain’s edge, calm and kind, to the guards as much as to anybody, and their heads come up a little; then our cat stands up at the front of the crowd and asks the one question nobody has an answer for. The gap sits in the middle of the back row. Her balloon level; our cat’s a puzzled shout.',
      say: [
        { who: 'glintstar', text: 'Nobody here is to blame. You guarded well. Somebody is very clever.' },
        { who: 'player', text: 'But why is it ALWAYS the back?' }
      ],
      next: 'f022'
    },

    f022: {
      scene: S('pile', 'low', PILE_GAP,
        [c('glintstar', 'stand', 'solemn', 'pile-left', 'right'), c('player', 'sit', 'wonder', FRONT, 'left'), c('tallyheart', 'sit', 'proud', 'beside', 'left')], ['morning']),
      board: 'MEDIUM, LOW. Nobody answers, and Glintstar turns to our cat across the rows and gives it a job; Tallyheart, beside her, already has the answer half worked out and a twinkle in her eye about which Count comes next. A small inset shows six nights in a row, each with four small gaps. Caption top left; Glintstar’s balloon an order, Tallyheart’s a riddle.',
      caption: ['Nobody knows.'],
      say: [
        { who: 'glintstar', text: 'Four more. Six nights now. How many is that? {name}paw, bring me the count at sunset.' },
        { who: 'tallyheart', text: 'Four a night, for six nights. That’s a job for the sixes. Guess which Count is next?' }
      ],
      next: 'f023'
    },

    /* ------------------------------------------------------------------ Whiskers */

    f023: {
      // the warm-up's hard pick comes first, so none of these lines is said again over it (`intro: false`)
      scene: S('hollow', 'wide', H6,
        rim().concat([c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'happy', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THEN THE COUNTS. The sandy Training Hollow in the morning sun, six claw marks on the leaning tree, and along the rim five cats sitting up on their haunches: the little tortoiseshell warrior second, the grizzled old tom last. Tallyheart waits past the tree and our cat sits ready in the sun patch. For the warm-up patrols of three cats walk along a path, none lit; after a miss she scratches three marks in the sand for every patrol and hops along them. Caption top left, her balloon bright; the keypad sits below the panel.',
      caption: ['In the Training Hollow, five cats sit up on the rim.'],
      say: [{ who: 'tallyheart', text: 'Threes first, to wake up your whiskers.' }],
      counts: { set: 'ch07-threes', intro: false, next: 'f024' }
    },

    f024: {
      scene: S('hollow', 'wide', H6,
        rim().concat([c('tallyheart', 'sit', 'happy', 'tree-far', 'left', { size: 1.2 }), c('player', 'stand', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. All the way across the Hollow from the sun patch, Tallyheart beckons our cat with one ginger paw, a secret in her eyes, and our cat gets up to come. The five on the rim lean in to see what happens. Her balloon warm, the last two words coaxing.',
      say: [{ who: 'tallyheart', text: 'Speaking of whiskers. Today’s Count is the sixes. Come close. Closer.' }],
      next: 'f025'
    },

    f025: {
      // nose to nose: the art has no leaning back, and the closeness is the joke
      scene: S('hollow', 'lesson', H6,
        rim(true).concat([c('tallyheart', 'sit', 'laugh', 'sand-left', 'right'), c('player', 'stand', 'happy', CLOSE, 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT, COMEDY BEAT. Our cat has come right up to Tallyheart on the sand, so close their noses nearly bump and it has to go cross-eyed to see her, and Tallyheart laughs out loud. The rim cats grin behind them. Caption top left; her balloon a laugh.',
      caption: ['You come VERY close.'],
      say: [{ who: 'tallyheart', text: 'Not THAT close.' }],
      next: 'f026'
    },

    f026: {
      // her whiskers, two rows of three: the cheek stays up on the page after (`keep`)
      scene: S('hollow', 'lesson', H6,
        rim(true).concat([c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT, THE TAP PICTURE. Tallyheart turns her big ginger cheek to our cat, patient, and our cat leans in to look. In play the counting picture takes the panel: one cheek close up with six whiskers in two rows of three, the top row glowing; one tap lights it and puts 3 in our cat’s balloon, the next lights the row below, 6, and turns the page. Captions top left.',
      caption: ['She turns her cheek to you.', 'Up close, you can count her whiskers.'],
      skip: { table: 3, groups: 2, who: [{ who: 'tallyheart' }], thing: 'whisker', things: 'whiskers', teacher: 'player', label: 'Count the next row of whiskers.', prompt: '**Tap** her whiskers.', keep: true, next: 'f027' }
    },

    f027: {
      scene: S('hollow', 'lesson', H6,
        rim(true).concat([c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT. The cheek stays up in play, both rows of whiskers lit with 3 and 6 beside them under a big 6, and Tallyheart sits back proud of her face; our cat looks from the cheek to her and back, working it out. Her balloons plain and sure; our cat’s a squeak of discovery.',
      say: [
        { who: 'tallyheart', text: 'Six whiskers on one cheek. Three on top, three below. Six is two threes.' },
        { who: 'player', text: 'So a six is a three, TWICE?' },
        { who: 'tallyheart', text: 'Exactly.' }
      ],
      next: 'f028'
    },

    f028: {
      scene: S('hollow', 'wide', H6,
        rim().concat([c('tallyheart', 'stand', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. One after another the five cats on the rim turn their heads and offer our cat a cheek, the old tom last and grumpiest about it, and Tallyheart stands past the tree ready to count. In play the counting picture takes the panel: five cheeks close up in a row, each in its rim cat’s coat, the first glowing; each tap lights its six whiskers, three and three, and a big number over them grows by six, 6, 12, 18, 24, 30. Caption top left; her balloon at the top.',
      caption: ['One at a time, the cats on the rim turn a cheek to you.'],
      say: [{ who: 'tallyheart', text: 'Now hop by sixes. Touch each cheek.' }],
      skip: { table: 6, groups: 5, who: RIM, thing: 'whisker', things: 'whiskers', teacher: 'tallyheart', label: 'Count the next cheek.', prompt: '**Tap** the cheeks.', carry: false, next: 'f029' }
    },

    f029: {
      // Tallyheart's six Counts: six taps that count nothing; each letters her question and our cat's answer
      scene: S('hollow', 'wide', H6,
        rim().concat([c('tallyheart', 'sit', 'happy', 'tree-far', 'left', { size: 1.2, glow: true }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. Tallyheart sits past the leaning tree with its six claw marks plain on the trunk, glowing softly with a secret, and our cat sits bolt upright in the sun patch with its mouth open. In play each tap on her letters her next Count in her balloon and our cat’s answer in its own, the sixes it already knows, one for every mark; the pairs before stay small under the panel, the marks stay as they are, and after the sixth the page turns. Her balloon low; our cat’s a squeak.',
      say: [
        { who: 'tallyheart', text: 'Thirty! Now, a secret. You already know most of the sixes. One from every mark on this tree.' },
        { who: 'player', text: 'I DO?', kind: 'shout' }
      ],
      ask: {
        who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
        pairs: [
          ['Tails?', 'Six cats, six tails!'],
          ['Ears?', 'Six cats, twelve ears!'],
          ['Claws?', 'Six forepaws, thirty claws!'],
          ['Both forepaws?', 'Six cats, sixty claws!'],
          ['Nine lives?', 'Six cats, fifty-four lives!'],
          ['Patrols?', 'Six patrols, eighteen guards!']
        ],
        next: 'f030'
      }
    },

    f030: {
      // her balloon is read on the frame and not again (`intro: false`): 2 × 6's own line is the first question's
      scene: S('hollow', 'lesson', H6,
        rim(true).concat([c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT, THEN THE COUNTS. Tallyheart sits down on the sand in front of our cat and sweeps it smooth with one paw for the new ones, delighted with her pupil. In the Counts picture that many cheeks close up, three whiskers on top and three below, a doubling one with every top row already lit; after a miss she scratches six marks for every cheek, three and three, and hops along them by sixes. Her balloon warm; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Six of them you knew already. Only four are new. For those, start from one you know and hop, or double the threes.' }],
      counts: { set: 'ch07-sixes', intro: false, next: 'f031' }
    },

    f031: {
      scene: S('hollow', 'tree', H7, [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score a seventh claw mark into the bark beside the sixth; the marks stand four and three now, a little smaller, and the older ones look deeper and darker than the new one. The SKRITCH! runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'A seventh claw mark.'],
      sfx: 'SKRITCH!',
      next: 'f032'
    },

    f032: {
      // in the wide view, where the seven marks show (the `lesson` camera sees only the edge of the tree)
      scene: S('hollow', 'wide', H7,
        rim().concat([c('tallyheart', 'sit', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'proud', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. Seven claw marks on the leaning tree now, and Tallyheart sitting past the trunk with her torn ear tipped across the Hollow toward our cat. A cat who never needed the sand says it lightly, and Tallyheart tops it; a cat who did says it plainly, and Tallyheart answers it warmly. Her balloons warm; our cat’s sure of itself.',
      say: [
        { who: 'tallyheart', text: 'Whiskers. That’s your seventh Count.' },
        { who: 'player', text: 'And I knew most of it already.', when: { lessonClean: 'ch07-sixes' } },
        { who: 'tallyheart', text: 'Now you know all of it.', when: { lessonClean: 'ch07-sixes' } },
        { who: 'player', text: 'Some were tricky.', when: { not: { lessonClean: 'ch07-sixes' } } },
        { who: 'tallyheart', text: 'Tricky. And you worked out every one.', when: { not: { lessonClean: 'ch07-sixes' } } }
      ],
      next: 'f033'
    },

    /* ------------------------------------------------------------------ Can’t be fooled */

    f033: {
      // the rim cats bound off along it to breakfast (the first two are gone already); from here the rim is empty
      scene: S('hollow', 'wide', H7,
        [c('murmurchime', 'walk', 'happy', 'rim-1', 'left'), c('clancat', 'walk', 'happy', 'rim-2', 'left', { variant: 5 }), c('grizzled', 'walk', 'happy', 'rim-3', 'left'),
         c('tallyheart', 'sit', 'wonder', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'happy', 'tree', 'right')], ['morning']),
      board: 'WIDE. The cats on the rim bound off along it toward breakfast, the old tom last, and by the leaning tree our cat has Tallyheart to itself at last and tells her its news; a small inset shows Waffles at her railing. Tallyheart’s ears shoot up, and she counts the witnesses off on her claws. Caption top left; her balloon delighted, then sure.',
      caption: ['The cats on the rim bound off to breakfast. At last, you can tell Tallyheart about Waffles.'],
      say: [{ who: 'tallyheart', text: 'No moon? Not a sliver? I asked you for somebody else who was awake. You found her! Two witnesses, Patience and Waffles. One fox.' }],
      next: 'f034'
    },

    f034: {
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'stand', 'solemn', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart gets to her feet on the empty sand, all business now, and smooths a clean patch between them with one paw; our cat sits up straight. The leaning tree’s seven marks are at the edge of the panel. Her balloon short and brisk.',
      say: [{ who: 'tallyheart', text: 'Now. Glintstar’s question.' }],
      next: 'f035'
    },

    f035: {
      // the frame has no balloon: the caption is its own, the question the fact's. “In the sand she scratches…”:
      // her claws are out on the forepaw at the sand (`claws` on `crouch`: the camera is too close for a
      // raised paw, which would take her head out of the panel); the marks themselves are the Counts picture's
      scene: S('hollow', 'sand', H7,
        [c('tallyheart', 'crouch', 'solemn', 'sand-left', 'right', { claws: true }), c('player', 'crouch', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'CLOSE-UP, ON THE SAND, THEN THE COUNTS. Tallyheart crouches over a smooth patch of sand and scratches it with one forepaw, claws out, four short marks, then a space, then four more, a night at a time, and our cat crouches nose down across from her, watching each little group appear. In the Counts picture six nights stand side by side in the sand, four marks each, none lit; after a miss the marks light a night at a time as she hops by fours. Caption top left; the keypad sits below the panel.',
      caption: ['In the sand she scratches four marks for every night. One night. Two. Three, four, five, six.'],
      counts: { set: 'ch07-gone', next: 'f036' }
    },

    f036: {
      when: TOLD,
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE TOLD PATH ONLY. Tallyheart sits back beside her marks in the sand with the corner of a smile, and lowers her voice to a secret only the two of them share; a small inset shows a misty dragonet under a bridge with a fish in her jaws. Our cat’s ears prick. Her balloon low and sly.',
      say: [{ who: 'tallyheart', text: 'Now, a dragon. I know one who eats ten fish a meal.' }],
      next: 'f037'
    },

    f037: {
      // her balloon is said again over the question, with the question's caption: the two read together
      when: TOLD,
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'sit', 'happy', 'sand-left', 'right', { wink: true }), c('player', 'sit', 'laugh', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE TOLD PATH ONLY, THEN THE COUNTS. Tallyheart gives our cat one slow wink, and our cat grins back: they both know exactly which dragon. In the Counts picture six nights stand side by side in the sand, ten marks each in two rows of five, none lit; after a miss they light a night at a time, ten, twenty, thirty, all the way to sixty. Caption top left; her balloon low; the keypad sits below the panel.',
      caption: ['She winks.'],
      say: [{ who: 'tallyheart', text: 'If she were our thief, that’s ten every night.' }],
      counts: { set: 'ch07-dragon', next: 'f038' }
    },

    f038: {
      when: TOLD,
      scene: S('hollow', 'sand', merge(H7, { compare: CMP }), [], ['morning']),
      board: 'INSERT, CLOSE ON THE SAND, THE TOLD PATH ONLY. Two straight lines scratched one above the other in the smooth sand, starting together at the left: a short one with 24 scratched beside it, and a long one, two and a half times as long, with 60. Nothing else is in the panel; the difference is the picture. Caption top left, clear of the lines.',
      caption: ['Tallyheart draws two lines in the sand. A short one, for twenty-four. A long one, for sixty.'],
      next: 'f039'
    },

    f039: {
      // a choice only the told path sees: the kept path is turned straight to its own frames (`else`)
      when: TOLD, else: 'f041',
      scene: S('hollow', 'lesson', merge(H7, { compare: CMP }),
        [c('tallyheart', 'sit', 'solemn', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE TOLD PATH ONLY. The two lines lie scratched in the sand between them, the short one and the long one with their numbers, and Tallyheart taps the short one with a claw as she says it plainly; a small inset shows a dragonet’s supper, ten fish, beside a mouse’s, four crumbs. Our cat stares at the lines. Her balloon slow and clear; the choices sit below the panel.',
      say: [{ who: 'tallyheart', text: 'Twenty-four is much, much less than sixty. A hungry dragon would take far more. Ten every single night, not four. Four is a SMALL supper.' }],
      choice: {
        options: [
          { label: '“So it WASN’T Sprinkle!”', sets: {}, next: 'f040' },
          { label: '“So the thief is somebody SMALL!”', sets: {}, next: 'f040' }
        ]
      }
    },

    f040: {
      // her own count, an eye: one card on both paths (the kept path's at the bridge, f056)
      when: TOLD,
      card: 'my-count',
      scene: S('hollow', 'sand', merge(H7, { compare: CMP }), [], ['morning']),
      board: 'INSERT, CLOSE ON THE SAND, THE TOLD PATH ONLY. The two lines again, 24 and 60, alone in the smooth sand, the short one and the long one, as plain as a sum can be. Nothing else needs to be in the panel. One caption at the top; the new card appears under the panel, an eye in its corner.',
      caption: ['The Counts don’t lie.'],
      next: 'f041'
    },

    f041: {
      when: KEPT,
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'sit', 'solemn', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE KEPT PATH ONLY. Tallyheart sits over her six nights of marks in the sand and reads the answer back slowly, as if it does not quite taste right. Our cat sits very still across from her. Her balloon thoughtful.',
      say: [{ who: 'tallyheart', text: 'Twenty-four pieces in six nights.' }],
      next: 'f042'
    },

    f042: {
      when: KEPT,
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'sit', 'stern', 'sand-left', 'right'), c('player', 'sit', 'worried', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE KEPT PATH ONLY. Tallyheart frowns down at the marks, brows drawn together, and pokes the little groups of four with a claw as if they had told her a fib; a small inset shows a huge shadowy dragon beside four tiny crumbs. Our cat goes stiff. Caption top left; her balloon puzzled, the last word heavy.',
      caption: ['She frowns at the sand.'],
      say: [{ who: 'tallyheart', text: 'Four a night. That’s a very small supper. For a DRAGON.' }],
      next: 'f043'
    },

    f043: {
      // her thought: the caption only
      when: KEPT,
      scene: S('hollow', 'wide', H7,
        [c('tallyheart', 'sit', 'solemn', 'sand-left', 'right'), c('player', 'sit', 'shy', 'sand-right', 'left')], ['morning']),
      board: 'WIDE, THE KEPT PATH ONLY. The whole empty Hollow, and the two of them small on the sand in the middle of it: our cat presses its mouth shut tight, bursting with a thing it cannot say, and a small thought bubble over its head holds Sprinkle under the bridge with ten fish in a row. Tallyheart is still looking at the sand. One caption at the top.',
      caption: ['You KNOW a dragon who eats ten fish a meal! But you can’t say so without saying who.'],
      next: 'f044'
    },

    f044: {
      // the chapter's warm moment, said once, on both paths: no promise
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, A WARM BEAT. Tallyheart looks up from the sand straight at our cat, her amber eyes soft and her torn ear tipped toward it, and says it the way she says a sum is right. The sun lies warm on both of them. Caption top left; her balloon quiet and sure.',
      caption: ['Tallyheart looks at you, warm as a sunny stone.'],
      say: [{ who: 'tallyheart', text: 'Everybody in camp says ‘dragon’. But you counted. A warrior who knows {their} Counts can’t be fooled.' }],
      next: 'f045'
    },

    f045: {
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'sit', 'proud', 'sand-right', 'left', { size: 1.12 })], ['morning']),
      board: 'MEDIUM TWO-SHOT, A QUIET BEAT. Our cat sits up as tall as it can go, chest out and chin up, nearly level with Tallyheart’s ear, trying very hard to look calm about it. Tallyheart pretends not to notice, and fails. One caption at the top, a smile in it.',
      caption: ['You feel taller. Almost as tall as Tallyheart.'],
      next: 'f046'
    },

    f046: {
      when: KEPT,
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'stand', 'laugh', 'sand-left', 'right'), c('player', 'sit', 'shy', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE KEPT PATH ONLY. Tallyheart is on her feet, off to her own day’s work, and tosses one last order over her shoulder with a wrinkle of her nose; a small inset shows our cat yesterday, smelling of fish, little stink lines rising. Our cat freezes. Her balloon teasing.',
      say: [{ who: 'tallyheart', text: 'Back by sunset. And if you come back smelling of fish again, wash first.' }],
      next: 'f047'
    },

    f047: {
      when: KEPT,
      scene: S('hollow', 'wide', H7,
        [c('tallyheart', 'walk', 'happy', 'tree-far', 'right', { size: 1.2 }), c('player', 'sit', 'shy', 'sunpatch-2', 'right', { flatEars: true })], ['morning']),
      board: 'WIDE, THE KEPT PATH ONLY, COMEDY BEAT. Tallyheart pads off past the leaning tree, tail high, and in the sun patch our cat sits alone with its ears laid flat and the tips of them glowing pink. Nobody else is in the Hollow to see. One caption at the top.',
      caption: ['Your ears go hot.'],
      next: 'f048'
    },

    /* ------------------------------------------------------------------ Under the Old Bridge */

    f048: {
      when: TOLD,
      scene: S('bridge', 'back', merge(BACK, { branch: true }),
        [c('sprinkle', 'peek', 'wonder', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'right'), c('tallyheart', 'sit', 'kind', ACROSS, 'left'),
         c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'string', tap: 'fish' })], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY, THE TAP PICTURE. In the cool dark at the very back of the bridge, beside the old stone leg, two big round eyes shine over the heap of sticks, then a pale snout that has smelled fish; Tallyheart settles in across the nook, and Riffle holds up his reed string of three fish. In play the string glows softly; one tap tosses a fish to her and turns the page. Captions top left; her balloon a squeal.',
      caption: ['Tallyheart takes you straight to the Old Bridge.', 'Two big eyes peek over Tallyheart’s branch, and Riffle is there with fish.'],
      say: [{ who: 'sprinkle', text: 'FISH!', kind: 'shout' }],
      scratch: { tap: 'fish', prompt: '**Tap** to toss her one.', label: 'Toss her a fish.', next: 'f049' }
    },

    f049: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'wonder', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'right'), c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'string', tap: 'fish' })], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY, THE TAP PICTURE. In the cool dark at the very back of the bridge, beside the old stone leg, Sprinkle sits up in her nook with her eyes on Riffle’s reed string of three fish; a small inset shows the empty bank our cat looked along first, with no ginger ears on it. In play the string glows softly; one tap tosses a fish to her and turns the page. Caption top left; her balloon a squeal.',
      caption: ['At the Old Bridge, you check the bank first. No ginger ears. Riffle is there with fish.'],
      say: [{ who: 'sprinkle', text: 'FISH!', kind: 'shout' }],
      scratch: { tap: 'fish', prompt: '**Tap** to toss her one.', label: 'Toss her a fish.', next: 'f050' }
    },

    f050: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'gulp', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'proud', 'back-left', 'right'), c('tallyheart', 'sit', 'kind', ACROSS, 'left'),
         c('riffle', 'stand', 'shout', 'back-right', 'left', { holds: 'string' })], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY. Sprinkle gulps the fish down neck stretched, a lump going down each time, while Tallyheart nods our cat on to tell it, and our cat lays out the numbers like a judge; Riffle bounces on his toes and blurts out his part much too loudly. Three balloons, the last a shout; the gulps lettered down her neck.',
      say: [
        { who: 'tallyheart', text: 'Tell them.' },
        { who: 'player', text: 'The Counts say it wasn’t Sprinkle. Four a night, for six nights: twenty-four. A dragon would eat SIXTY.' },
        { who: 'riffle', text: 'It’s TRUE! She eats TEN a meal. I’ve caught every single one!', kind: 'shout' }
      ],
      sfx: 'Gulp. Gulp. Gulp.',
      next: 'f051'
    },

    f051: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'gulp', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'proud', 'back-left', 'right'), c('riffle', 'stand', 'shout', 'back-right', 'left', { holds: 'string' })], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY. Sprinkle gulps the fish down neck stretched, a lump going down each time, while our cat tells Riffle the morning’s count; Riffle bounces on his toes and blurts out the one number he knows best, much too loudly. Two balloons, the second a shout; the gulps lettered down her neck.',
      say: [
        { who: 'player', text: 'Twenty-four gone in six nights. Four every night.' },
        { who: 'riffle', text: 'TEN! She always eats TEN. I’ve caught every single one!', kind: 'shout' }
      ],
      sfx: 'Gulp. Gulp. Gulp.',
      next: 'f052'
    },

    f052: {
      // Coil, a stone in his wall again (`stone`: no face), labelled “Coil”
      scene: S('bridge', 'wall', {},
        [c('coil', 'stone', 'neutral', 'gap', 'right'), c('player', 'sit', 'wonder', 'back-left', 'left'),
         c('riffle', 'hush', 'shy', 'back-right', 'left'), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, BY THE STONE LEG, COMEDY BEAT. One rounded stone low in the wall says a single polite word, and everyone freezes; Riffle clamps a webbed paw over his own mouth and squeaks the rest through it. Sprinkle’s head leans in from the right. The voice’s balloon small; Riffle’s a tiny whisper.',
      say: [
        { who: 'coil', name: 'Coil', text: 'Quietly.' },
        { who: 'riffle', text: '…ten.', kind: 'whisper' }
      ],
      next: 'f053'
    },

    f053: {
      // the kept path's sixty, in Riffle's voice: his whisper is said again over the question
      when: KEPT,
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', 'inside', 'left'), c('player', 'sit', 'wonder', 'mud', 'right'),
         c('riffle', 'stand', 'kind', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, THE KEPT PATH ONLY, THEN THE COUNTS. Under the arch, the bright river a strip at the left: Riffle leans close to our cat on the mud and whispers his sum behind one paw, very seriously, while Sprinkle licks her lips in her nook. In the Counts picture six nights stand side by side in the mud, ten marks each, none lit; after a miss they light a night at a time as Riffle hops by tens. His balloon a whisper; the keypad sits below the panel.',
      say: [{ who: 'riffle', text: 'If SHE were the thief, she’d take ten every night.', kind: 'whisper' }],
      counts: { set: 'ch07-riffle', next: 'f054' }
    },

    f054: {
      when: KEPT,
      scene: S('bridge', 'under', merge(UNDER, { compare: CMP }),
        [c('sprinkle', 'sit', 'wonder', 'inside', 'left'), c('player', 'pawup', 'wonder', 'mud', 'right', { claws: true }),
         c('riffle', 'sit', 'wonder', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, THE KEPT PATH ONLY. Our cat reaches out a forepaw, claws out, and scratches two straight lines in the smooth mud at the front, one under the other: a short one with 24 beside it, and a long one, two and a half times as long, with 60. Riffle and Sprinkle crane to see. One caption at the top, clear of the lines.',
      caption: ['You scratch two lines in the mud. A short one, for twenty-four. A long one, for sixty.'],
      next: 'f055'
    },

    f055: {
      // a choice only the kept path sees: the told path is turned straight on (`else`)
      when: KEPT, else: 'f057',
      scene: S('bridge', 'under', merge(UNDER, { compare: CMP }),
        [c('sprinkle', 'sit', 'wonder', 'inside', 'left'), c('player', 'sit', 'solemn', 'mud', 'right'),
         c('riffle', 'sit', 'wonder', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, THE KEPT PATH ONLY. The two lines lie in the mud, the short one and the long one with their numbers, and our cat sits back beside them and whispers what they mean; Riffle’s eyes go from one line to the other and back. Sprinkle peers down from her nook. Our cat’s balloon a whisper; the choices sit below the panel.',
      say: [{ who: 'player', text: 'Twenty-four is much, much less than sixty. A hungry dragon would take far more. Ten every single night, not four. Four is a SMALL supper.', kind: 'whisper' }],
      choice: {
        options: [
          { label: '“So it WASN’T you, Sprinkle!”', sets: {}, next: 'f056' },
          { label: '“So the thief is somebody SMALL!”', sets: {}, next: 'f056' }
        ]
      }
    },

    f056: {
      // her own count, an eye: the told path's is in the Hollow (f040)
      when: KEPT,
      card: 'my-count',
      scene: S('bridge', 'under', merge(UNDER, { compare: CMP }),
        [c('sprinkle', 'sit', 'happy', 'inside', 'left'), c('player', 'sit', 'happy', 'mud', 'right'),
         c('riffle', 'sit', 'happy', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, THE KEPT PATH ONLY. Riffle nods solemnly at the two lines in the mud, as wise as an otter can look, and whispers the chapter’s whole point; our cat grins. Sprinkle leans further out of her nook, beginning to understand. His balloon a whisper; the new card appears under the panel, an eye in its corner.',
      say: [{ who: 'riffle', text: 'The Counts don’t lie.', kind: 'whisper' }],
      next: 'f057'
    },

    f057: {
      // our cat and Riffle turned to her (Coil, a stone, says nothing here); her two lines in one balloon, so
      // the first one's tail never runs under the second
      scene: S('bridge', 'wall', {},
        [c('coil', 'stone', 'neutral', 'gap', 'right'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('riffle', 'sit', 'happy', 'back-right', 'right'), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, BY THE STONE LEG. Sprinkle’s head comes down from the right, her big eyes perfectly round, and she can hardly believe the numbers are on her side; then she thinks about it, and is outraged at how little four is. Our cat and Riffle beam up at her. Caption top left; her balloon a wondering whisper, then a wail.',
      caption: ['Sprinkle’s eyes go round.'],
      say: [{ who: 'sprinkle', text: 'The Counts LIKE me? Only FOUR a night? I’d still be HUNGRY!' }],
      next: 'f058'
    },

    f058: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'right'), c('tallyheart', 'sit', 'happy', ACROSS, 'left'),
         c('riffle', 'stand', 'laugh', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY. Sprinkle sits up as tall as a dragonet can in her nook and announces it to the whole bridge, wings quivering with happiness, while Tallyheart watches from across the nook with a smile and Riffle laughs. Her balloon bursting, the last word huge.',
      say: [{ who: 'sprinkle', text: 'I KNEW I didn’t do it. But now the NUMBERS know!' }],
      next: 'f059'
    },

    f059: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'right'), c('riffle', 'stand', 'laugh', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY. Sprinkle sits up as tall as a dragonet can in her nook and announces it to the whole bridge, wings quivering with happiness, while our cat beams and Riffle laughs. Her balloon bursting, the last word huge.',
      say: [{ who: 'sprinkle', text: 'I KNEW I didn’t do it. But now the NUMBERS know!' }],
      next: 'f060'
    },

    f060: {
      // her tail round our cat: in the loop of her curl, in front of her (TAIL, chapter 3's spot), Sprinkle
      // listed first so the tail's near loop is drawn over the cat
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'curl', 'happy', 'dragon', 'left'), c('tallyheart', 'sit', 'happy', 'near', 'right'),
         c('player', 'sit', 'happy', TAIL, 'right', { size: 0.9 }), c('riffle', 'stand', 'laugh', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY, A WARM BEAT. Sprinkle wraps her long cool tail round our cat in a happy hug, her scales bumpy against its fur, and our cat leans into it with its eyes shut; Tallyheart pretends to look at the river. Captions top left.',
      caption: ['She wraps her tail round you. It’s cool and bumpy, and very, very happy.'],
      next: 'f061'
    },

    f061: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'curl', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'happy', TAIL, 'right', { size: 0.9 }), c('riffle', 'stand', 'laugh', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY, A WARM BEAT. Sprinkle wraps her long cool tail round our cat in a happy hug, her scales bumpy against its fur, and our cat leans into it with its eyes shut; Riffle pretends to look at the river. Captions top left.',
      caption: ['She wraps her tail round you. It’s cool and bumpy, and very, very happy.'],
      next: 'f062'
    },

    f062: {
      // the prints drawn since chapter 3 and never mentioned: the target is the one in the open mud right
      // of her (the nearest is off the bottom edge, the next under her)
      scene: S('bridge', 'under', merge(UNDER, { tap: 'print' }),
        [c('sprinkle', 'sit', 'happy', 'inside', 'left'), c('player', 'crouch', 'wonder', 'mud', 'right'),
         c('riffle', 'stand', 'wonder', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, THE TAP PICTURE. Under the arch our cat crouches on the mud and looks down: beside the long drag marks from the river, Sprinkle’s own prints from the storm night still lie in the mud, big ones with five long claws, as big as a heron’s foot. In play the nearest whole print glows softly; one tap holds our cat’s paw over it and turns the page. Captions in a column beside the panel.',
      caption: ['When she lets go, you look down.', 'Beside the long drag marks from the river, her prints from the storm night are still in the mud.', 'Big ones, with five long claws.'],
      scratch: { tap: 'print', prompt: '**Tap** a print to hold your paw over it.', label: 'Hold your paw over a print.', next: 'f063' }
    },

    f063: {
      scene: S('bridge', 'print', {},
        [c('player', 'crouch', 'wonder', 'over', 'right', { reach: true })], ['day']),
      board: 'CLOSE-UP, AT CAT HEIGHT, ON THE MUD. Our cat holds one forepaw just over the broad heel of Sprinkle’s big print, touching nothing, and the print shows all round it with room to spare, its five toes and long claws fanned out far beyond the paw; a small inset shows the marsh mud, where the same paw was twice the size of a tiny print. Caption top left; our cat’s balloon certain.',
      caption: ['Your whole paw fits inside, with room to spare.'],
      say: [{ who: 'player', text: 'The thief’s prints in the marsh are TINY. Half the size of my paw.' }],
      next: 'f064'
    },

    f064: {
      // Sprinkle's prints: her card, an eye
      card: 'prints-sprinkle',
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', 'inside', 'left'), c('player', 'sit', 'happy', 'mud', 'right'),
         c('riffle', 'stand', 'happy', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN. Riffle points from the big prints in the mud up to Sprinkle in her nook and back, whispering as loudly as a whisper can go; a small inset shows Patience the heron’s long-toed foot beside one of the prints, the same size. Sprinkle looks proudly at her own feet. His balloon a loud whisper; the new card appears under the panel, an eye in its corner.',
      say: [{ who: 'riffle', text: 'Hers are as big as Patience’s feet. Even her FEET say she didn’t do it!', kind: 'whisper' }],
      next: 'f065'
    },

    f065: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'pawsup', 'happy', 'inside', 'left'), c('player', 'sit', 'laugh', 'mud', 'right'),
         c('riffle', 'hop', 'happy', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN. Sprinkle bounces up in her nook with both forepaws in the air, too happy to sit still, and Riffle hops with her on the mud; our cat laughs. The light from the river ripples across the arch. Her balloon a shout of joy.',
      say: [{ who: 'sprinkle', text: 'I’m so happy I could FLY!', kind: 'shout' }],
      next: 'f066'
    },

    f066: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'wings', 'sad', 'inside', 'left'), c('player', 'sit', 'worried', 'mud', 'right'),
         c('riffle', 'stand', 'sad', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, A QUIET BEAT. Sprinkle opens both wings wide in her nook: the left one lifts high and fine, but the right one only droops, crumpled at the tip, and will not rise. Her face falls a little; Riffle and our cat go quiet. Captions top left; her balloon small.',
      caption: ['She lifts her wings.', 'Her good wing goes up. Her hurt wing won’t.'],
      say: [{ who: 'sprinkle', text: 'Oh. Not yet.' }],
      next: 'f067'
    },

    f067: {
      when: TOLD,
      scene: S('bridge', 'back', FLY,
        [c('sprinkle', 'wings', 'sad', 'dragon', 'left'), c('tallyheart', 'stand', 'solemn', BY_WALL, 'right'),
         c('player', 'sit', 'wonder', 'back-left', 'right'), c('riffle', 'stand', 'wonder', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY. Sprinkle holds her wings out in her nook, the good one high and the hurt one drooping, crumpled at the tip, in plain sight with nobody in front of it. Tallyheart, by the wall behind our cat, has gone perfectly still, staring at the drooping wing, and a small inset shows the fox at the Gathering with his paws spread, a dragon soaring in his story. A noticing cat sees her turn to look straight at it. Caption top left, by her specialty; her balloon slow; our cat’s, for a cat who caught it at the border, a cry.',
      caption: [
        { when: NOT_NOTICING, text: 'Tallyheart goes very still.' },
        { when: NOTICING, text: 'Tallyheart looks at you.' }
      ],
      say: [
        { who: 'tallyheart', text: 'FLY. The fox said the dragon FLEW out of camp.', when: NOT_NOTICING },
        { who: 'tallyheart', text: 'The fox said the dragon FLEW. There’s the hole in his story. Now we’ve SEEN it.', when: NOTICING },
        { who: 'player', text: 'I KNEW it! I knew it at the border!', when: CAUGHT }
      ],
      next: 'f068'
    },

    f068: {
      when: KEPT,
      scene: S('bridge', 'back', FLY,
        [c('sprinkle', 'wings', 'sad', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'right'), c('riffle', 'stand', 'shout', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY. Riffle stops wiggling all at once and stares at the drooping wing, and a small inset shows the fox at the Gathering with his paws spread, a dragon soaring in his story. Our cat’s ears go up. Caption top left; his balloon a yelp; our cat’s, for a cat who caught it at the border, a cry.',
      caption: ['Riffle stops wiggling.'],
      say: [
        { who: 'riffle', text: 'Wait. The fox said she FLEW out of camp!' },
        { who: 'player', text: 'I KNEW it! I knew it at the border!', when: CAUGHT }
      ],
      next: 'f069'
    },

    f069: {
      // FLEW against can't-fly, for every cat: reaching this screen sets `ch7Flew` for good (chapter 4's
      // card link reads it); the choice sets nothing and has no outcome panel
      sets: { ch7Flew: true },
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'wings', 'sad', 'inside', 'left'), c('player', 'sit', 'solemn', 'mud', 'right'),
         c('riffle', 'stand', 'solemn', RIFFLE, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, THE TURN. Sprinkle sits in her nook with her hurt wing drooping, and two small insets float over our cat’s head side by side: the fox’s claim, a dragon with spread wings flying away over the camp, and the truth, Sprinkle’s crumpled wing. Our cat looks from one to the other. Captions top left; the choices sit below the panel.',
      caption: ['The fox says it FLEW. Sprinkle can’t fly.', 'They can’t both be true.'],
      choice: {
        options: [
          { label: '“So Reynard LIED!”', sets: {}, next: 'f070' },
          { label: '“The fox’s story isn’t TRUE!”', sets: {}, next: 'f070' }
        ]
      }
    },

    f070: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'proud', 'back-left', 'right'), c('tallyheart', 'sit', 'stern', ACROSS, 'left'),
         c('riffle', 'stand', 'laugh', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY. Tallyheart counts the fox’s mistakes off on two claws, cool as a judge, and Riffle slaps his knee and crows; a small inset shows a riverbank full of round otter holes. Sprinkle looks happily from one to the other. Her balloon level; his a crow.',
      say: [
        { who: 'tallyheart', text: 'No moon, and no flying.' },
        { who: 'riffle', text: 'That story’s got more holes than a riverbank!' }
      ],
      next: 'f071'
    },

    f071: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'proud', 'back-left', 'right'), c('riffle', 'stand', 'laugh', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY. Our cat counts the fox’s mistakes off on two claws, cool as a judge, and Riffle slaps his knee and crows; a small inset shows a riverbank full of round otter holes. Sprinkle looks happily from one to the other. Our cat’s balloon level; his a crow.',
      say: [
        { who: 'player', text: 'No moon, and no flying.' },
        { who: 'riffle', text: 'That story’s got more holes than a riverbank!' }
      ],
      next: 'f072'
    },

    f072: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'right'), c('tallyheart', 'stand', 'proud', ACROSS, 'left'),
         c('riffle', 'stand', 'happy', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY. Tallyheart stands tall across the nook and promises it, and a small inset shows the full moon over the Gathering, every Clan listening; Sprinkle, for the first time ever, is pleased about her wing. Her balloon firm; Sprinkle’s delighted.',
      say: [
        { who: 'tallyheart', text: 'And at the Gathering, every Clan will hear it.' },
        { who: 'sprinkle', text: 'For once, I’m GLAD I can’t fly!' }
      ],
      next: 'f073'
    },

    f073: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'right'), c('riffle', 'stand', 'proud', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY. Riffle puffs out his chest and rubs his paws together at the thought of the full moon, and a small inset shows the Gathering, every Clan listening; Sprinkle, for the first time ever, is pleased about her wing. His balloon gleeful; Sprinkle’s delighted.',
      say: [
        { who: 'riffle', text: 'Wait till the Gathering hears THAT.' },
        { who: 'sprinkle', text: 'For once, I’m GLAD I can’t fly!' }
      ],
      next: 'f074'
    },

    f074: {
      // the burp is lettered by her mouth, and the cloud is the thing to tap
      scene: S('bridge', 'wall', {},
        [c('coil', 'stone', 'neutral', 'gap', 'right'), c('player', 'sit', 'laugh', 'back-left', 'right'),
         c('riffle', 'sit', 'laugh', 'back-right', 'right'), c('sprinkle', 'burp', 'happy', 'dragon', 'left', { mist: true, tap: 'mist' })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, BY THE STONE LEG, THE TAP PICTURE. Sprinkle’s head pokes in from the right, so happy that a little round cloud of mist pops out of her mouth with a burp, and our cat and Riffle fall about laughing. In play the cloud glows softly; one tap puffs it away and turns the page. Caption top left; the HURP lettered by her mouth.',
      caption: ['She’s so happy, she burps a little cloud of mist.'],
      sfx: 'HURP.',
      sfxAt: [80, 50],
      scratch: { tap: 'mist', prompt: '**Tap** the little cloud of mist.', label: 'Puff the mist away.', next: 'f075' }
    },

    f075: {
      scene: S('bridge', 'wall', {},
        [c('coil', 'head', 'kind', 'gap', 'right'), c('player', 'sit', 'shy', 'back-left', 'left'),
         c('riffle', 'hush', 'shy', 'back-right', 'left'), c('sprinkle', 'sit', 'shy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, BY THE STONE LEG. The stone in the gap lifts and is Coil’s long brown head again, his round eyes shiny and unblinking, and he says it as if it were the dullest news in the world. The mist is gone. His balloon slow and patient, the last words firm.',
      say: [{ who: 'coil', name: 'Coil', text: 'She can’t fly. I could have told you. Nobody asked. Now, QUIET, please.' }],
      next: 'f076'
    },

    f076: {
      // narration after his balloon: a panel of its own, the whisper lettered as a caption, quote and all
      scene: S('bridge', 'wall', {},
        [c('coil', 'slide', 'kind', 'gap', 'right'), c('player', 'sit', 'shy', 'back-left', 'left'),
         c('riffle', 'hush', 'shy', 'back-right', 'left'), c('sprinkle', 'sit', 'shy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, BY THE STONE LEG, COMEDY BEAT. Coil slides back into his gap head first, satisfied, and all three of them hunch their shoulders and whisper at once; Riffle holds a paw over his mouth, Sprinkle tucks her chin in. Nobody moves a whisker. One caption at the top.',
      caption: ['“Sorry, Coil,” everybody whispers.'],
      next: 'f077'
    },

    /* ------------------------------------------------------------------ A good count */

    f077: {
      scene: S('pile', 'wide', EVE,
        [c('glintstar', 'stand', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'proud', 'pile-right', 'left'),
         c('player', 'sit', 'proud', 'pile-left', 'right'), c('murmurchime', 'sit', 'wonder', 'crowd-1', 'right'),
         c('snorter', 'sit', 'wonder', 'crowd-2', 'right'), c('grizzled', 'sit', 'sleepy', 'crowd-3', 'left')], ['sunset']),
      board: 'WIDE, SUNSET. The whole Clan sits in a ring round the prey pile in the orange light, forty pieces in four full rows again, and Glintstar on the fountain’s edge asks for the count; our cat answers out loud for everyone, steady and clear. Caption top left; her balloon level; our cat’s sure.',
      caption: ['At sunset, the Clan sits round the pile again. Forty pieces, in four rows.'],
      say: [
        { who: 'glintstar', text: '{name}paw. How many in six nights?' },
        { who: 'player', text: 'Twenty-four. Four every night. Guards or no guards.' }
      ],
      next: 'f078'
    },

    f078: {
      // she hears twenty-four and never sixty, which would show that a dragon is known
      scene: S('pile', 'low', EVE,
        [c('glintstar', 'stand', 'solemn', 'pile-left', 'right'), c('player', 'sit', 'solemn', FRONT, 'left'), c('grizzled', 'sit', 'wonder', 'beside', 'left')], ['sunset']),
      board: 'MEDIUM, LOW, SUNSET. Glintstar weighs the number slowly across the rows, and the old tom offers his idea with great hope; our cat keeps its mouth shut on the other number, and a small thought bubble over its head holds a sixty with a paw over it. Caption top left; her balloons level, his hopeful.',
      caption: ['You don’t say sixty. Not without saying who.'],
      say: [
        { who: 'glintstar', text: 'Twenty-four. A good count.' },
        { who: 'grizzled', text: 'Maybe it’s a SMALL dragon.' },
        { who: 'glintstar', text: 'The dragon’s case is for the Gathering. Bring your count. Until then, we guard.' }
      ],
      next: 'f079'
    },

    /* ------------------------------------------------------------------ Always the back */

    f079: {
      // the guards at the front of the pile face out, away from it, over the camp (f079 to f082); our cat
      // turns to Tallyheart, behind her at the left end, to whisper
      when: TOLD,
      scene: S('pile', 'wide', MOON,
        [c('clancat', 'walk', 'neutral', 'beside', 'right', { variant: 2 }), c('clancat', 'sit', 'neutral', 'crowd-2', 'right', { variant: 4 }),
         c('clancat', 'sit', 'neutral', 'crowd-3', 'right', { variant: 3 }), c('tallyheart', 'sit', 'kind', 'crowd-1', 'right'),
         c('player', 'sit', 'wonder', 'pile-left', 'left')], ['dusk']),
      board: 'WIDE, DUSK, THE TOLD PATH ONLY. The light is going over the pile; the first guards pad out to their places round the front, and over the towers the moon comes out, fatter than last night. At the left end of the rows our cat leans to Tallyheart and whispers. Caption top left; our cat’s balloon a whisper.',
      caption: ['At dusk, the first guards take their places. The moon comes out, fatter again.'],
      say: [{ who: 'player', text: 'I want to see the back.', kind: 'whisper' }],
      next: 'f080'
    },

    f080: {
      when: KEPT,
      scene: S('pile', 'wide', MOON,
        [c('clancat', 'walk', 'neutral', 'beside', 'right', { variant: 2 }), c('clancat', 'sit', 'neutral', 'crowd-2', 'right', { variant: 4 }),
         c('clancat', 'sit', 'neutral', 'crowd-3', 'right', { variant: 3 }),
         c('player', 'sit', 'wonder', 'pile-left', 'right')], ['dusk']),
      board: 'WIDE, DUSK, THE KEPT PATH ONLY. The light is going over the pile; the first guards pad out to their places round the front, and over the towers the moon comes out, fatter than last night. At the left end of the rows our cat sits alone, looking at the dark back row. One caption at the top.',
      caption: ['At dusk, the first guards take their places. The moon comes out, fatter again.'],
      next: 'f081'
    },

    f081: {
      when: TOLD,
      scene: S('pile', 'wide', merge(MOON, { tap: 'back' }),
        [c('clancat', 'sit', 'neutral', 'beside', 'right', { variant: 2 }), c('clancat', 'sit', 'neutral', 'crowd-2', 'right', { variant: 4 }),
         c('clancat', 'sit', 'neutral', 'crowd-3', 'right', { variant: 3 }), c('tallyheart', 'stand', 'wonder', 'crowd-1', 'right'),
         c('player', 'stand', 'wonder', 'pile-left', 'right')], ['dusk']),
      board: 'WIDE, DUSK, THE TOLD PATH ONLY, THE TAP PICTURE. Tallyheart’s ears shoot straight up and she gets to her feet beside our cat, ready; the guards face out over the camp and nobody looks round. In play the back row glows softly; one tap walks the two of them round behind it and turns the page. Caption top left; her balloon a low whisper.',
      caption: ['Tallyheart’s ears go up.'],
      say: [{ who: 'tallyheart', text: 'Let’s look.', kind: 'whisper' }],
      scratch: { tap: 'back', prompt: '**Tap** to slip round the back.', label: 'Slip round the back.', next: 'f082' }
    },

    f082: {
      when: KEPT,
      scene: S('pile', 'wide', merge(MOON, { tap: 'back' }),
        [c('clancat', 'sit', 'neutral', 'beside', 'right', { variant: 2 }), c('clancat', 'sit', 'neutral', 'crowd-2', 'right', { variant: 4 }),
         c('clancat', 'sit', 'neutral', 'crowd-3', 'right', { variant: 3 }),
         c('player', 'stand', 'wonder', 'pile-left', 'right')], ['dusk']),
      board: 'WIDE, DUSK, THE KEPT PATH ONLY, THE TAP PICTURE. The guards are still settling in round the front of the pile, close enough to call, all facing out over the camp; our cat gets up quietly at the left end of the rows. In play the back row glows softly; one tap slips our cat round behind it and turns the page. Captions top left, the last for a sneaking cat.',
      caption: [
        'The guards are still settling in, round the front, close enough to call.',
        'Nobody is looking at you.',
        { when: { specialty: 'sneaking' }, text: 'Your paws go silent. Not one guard looks round.' }
      ],
      scratch: { tap: 'back', prompt: '**Tap** to slip round the back.', label: 'Slip round the back.', next: 'f083' }
    },

    f083: {
      // round the back: the told path's sneaking line opens this panel
      when: TOLD,
      scene: S('pile', 'rear', ROOTS,
        guards().concat([c('player', 'stand', 'wonder', 'rear-1', 'right'), c('tallyheart', 'sit', 'wonder', 'rear-2', 'left')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE TOLD PATH ONLY, THE TAP PICTURE. Behind the back row, under the bramble arch: the dug earth heaped up and the low roots hanging over its foot, the rows seen from behind and the guards small and far off at the front; our cat and Tallyheart crouch on either side of the heap. In play the roots glow softly; one tap lifts them and turns the page. Captions top left, by her specialty; her balloon a whisper.',
      caption: [
        { when: { specialty: 'sneaking' }, text: 'Your paws go silent. Not one guard looks round.' },
        { when: NOTICING, text: 'Behind the back row is the dug earth. You’ve seen it every morning.' },
        { when: NOTICING, text: 'Tonight, you look closer. It goes in UNDER the roots.' },
        { when: NOT_NOTICING, text: 'Always the back. Why? Then you remember Coil, in the stones:' },
        { when: NOT_NOTICING, text: '“Small diggers come and go. Under your Clan’s pile.” UNDER!' }
      ],
      say: [{ who: 'tallyheart', text: 'A snake’s secret.', kind: 'whisper' }],
      scratch: { tap: 'roots', prompt: '**Tap** the bramble roots.', label: 'Lift the roots.', next: 'f084' }
    },

    f084: {
      when: KEPT,
      scene: S('pile', 'rear', ROOTS,
        guards().concat([c('player', 'stand', 'wonder', 'rear-1', 'right')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE KEPT PATH ONLY, THE TAP PICTURE. Behind the back row, under the bramble arch: the dug earth heaped up and the low roots hanging over its foot, the rows seen from behind and the guards small and far off at the front; our cat alone beside the heap. In play the roots glow softly; one tap lifts them and turns the page. Captions top left, by her specialty.',
      caption: [
        { when: NOTICING, text: 'Behind the back row is the dug earth. You’ve seen it every morning.' },
        { when: NOTICING, text: 'Tonight, you look closer. It goes in UNDER the roots.' },
        { when: NOT_NOTICING, text: 'Always the back. Why? Then you remember Coil, in the stones:' },
        { when: NOT_NOTICING, text: '“Small diggers come and go. Under your Clan’s pile.” UNDER!' }
      ],
      scratch: { tap: 'roots', prompt: '**Tap** the bramble roots.', label: 'Lift the roots.', next: 'f085' }
    },

    f085: {
      scene: S('pile', 'hole', EVE,
        [c('player', 'crouch', 'wonder', 'brink', 'right')], ['dusk']),
      board: 'CLOSE-UP, AT CAT HEIGHT, THE REVEAL. Under the lifted roots, in the face of the dug earth, a round dark hole goes down and in under the pile, its far end black; our cat crouches at its edge, and the hole is about as wide as its shoulders. The back row’s backs line the top of the panel. Captions top left.',
      caption: ['Under the roots, in the dug earth, is a round, dark hole. It goes down, and in, under the pile.', 'It’s the mouth of a tunnel.'],
      next: 'f086'
    },

    f086: {
      // the tunnel: her card, an eye, which lies beside Coil's
      card: 'tunnel',
      scene: S('pile', 'hole', EVE,
        [c('player', 'crouch', 'worried', 'brink', 'right')], ['dusk']),
      board: 'CLOSE-UP, AT CAT HEIGHT. Our cat measures the mouth with its eyes: far too small for anything as big as a dragon, and just right for something with tiny feet; a small inset shows Sprinkle’s huge print beside a tiny one. It is quite empty. Captions top left, the last by her worry; the new card appears under the panel, an eye in its corner.',
      caption: [
        'It’s much too small for a dragon. Just right for somebody with TINY feet.',
        { when: { worry: 'small' }, text: 'A small cat could just squeeze in, you think. A small cat like you.' },
        { when: { worry: 'water' }, text: 'At least it isn’t wet.' },
        { when: { worry: 'talk' }, text: 'You want to tell EVERYBODY. You whisper instead.' },
        { when: { worry: 'shiny' }, text: 'Nothing shines in there. Only earth, and roots.' }
      ],
      next: 'f087'
    },

    f087: {
      // her deduction, a panel of its own on the told path (the kept path's twin carries it with the choice,
      // f090): Tallyheart's line follows on the next panel with the choice, so each whisper has a tail of its
      // own and never runs through the other's balloon. A kept reader passes it over to f088, which turns
      // her on to f090 (`else`)
      when: TOLD,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'crouch', 'wonder', 'rear-1', 'right'), c('tallyheart', 'sit', 'wonder', 'rear-2', 'left')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE TOLD PATH ONLY. The roots are parted and the dark mouth shows in the dug earth between our cat and Tallyheart, and our cat whispers the whole thing out as it comes together, while Tallyheart stares at the mouth, ears pricked. The guards are small shapes at the front. Our cat’s balloon a whisper.',
      say: [
        { who: 'player', text: 'So THAT’S why it’s always the back. The guards watch the pile. The thief comes up from UNDER it.', kind: 'whisper' }
      ],
      next: 'f088'
    },

    f088: {
      // the tunnel choice, by path, each with its own two outcome panels (the same pictures and words): a choice
      // reached only by `else` would be missing from the storyboard, which walks a choice's branches to where they meet
      when: TOLD, else: 'f090',
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'wonder', 'rear-1', 'right'), c('tallyheart', 'sit', 'wonder', 'rear-2', 'left')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE TOLD PATH ONLY. Tallyheart stares wide-eyed at the spot where she sat all through the first watch, right beside the mouth, more astonished than afraid, and our cat sits up across from her. The guards are small shapes at the front. Her balloon an appalled whisper; the choices sit below the panel.',
      say: [
        { who: 'tallyheart', text: 'And I SAT here. Right beside it!', kind: 'whisper' }
      ],
      choice: {
        options: [
          { label: 'Sniff the tunnel.', sets: {}, next: 'f089a' },
          { label: 'Listen at the tunnel.', sets: {}, next: 'f089b' }
        ]
      }
    },

    f089a: {
      scene: S('pile', 'hole', EVE,
        [c('player', 'crouch', 'sniff', 'brink', 'right')], ['dusk']),
      board: 'CLOSE-UP, AT CAT HEIGHT. Our cat puts its nose right to the edge of the hole and sniffs, eyes narrowed, whiskers forward; faint curls of smell drift up out of the dark, and nothing else. Nobody goes in. One caption at the top.',
      caption: ['Earth. And, very faintly, mice.'],
      next: 'f090'
    },

    f089b: {
      scene: S('pile', 'hole', EVE,
        [c('player', 'crouch', 'wonder', 'brink', 'right')], ['dusk']),
      board: 'CLOSE-UP, AT CAT HEIGHT. Our cat crouches at the edge of the hole with one ear turned toward it, holding its breath, listening as hard as a cat can; the dark inside is perfectly still. Nobody goes in. One caption at the top.',
      caption: ['Not a sound. Whoever dug it isn’t here.'],
      next: 'f090'
    },

    f090: {
      when: KEPT, else: 'f092',
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'crouch', 'wonder', 'rear-1', 'right')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE KEPT PATH ONLY. The roots are parted and the dark mouth shows in the dug earth beside our cat, alone behind the back row, as the whole thing comes together in its head. The guards are small shapes at the front, looking the other way. Its balloon a whisper; the choices sit below the panel.',
      say: [{ who: 'player', text: 'So THAT’S why it’s always the back. The guards watch the pile. The thief comes up from UNDER it.', kind: 'whisper' }],
      choice: {
        options: [
          { label: 'Sniff the tunnel.', sets: {}, next: 'f091a' },
          { label: 'Listen at the tunnel.', sets: {}, next: 'f091b' }
        ]
      }
    },

    f091a: {
      scene: S('pile', 'hole', EVE,
        [c('player', 'crouch', 'sniff', 'brink', 'right')], ['dusk']),
      board: 'CLOSE-UP, AT CAT HEIGHT. Our cat puts its nose right to the edge of the hole and sniffs, eyes narrowed, whiskers forward; faint curls of smell drift up out of the dark, and nothing else. Nobody goes in. One caption at the top.',
      caption: ['Earth. And, very faintly, mice.'],
      next: 'f092'
    },

    f091b: {
      scene: S('pile', 'hole', EVE,
        [c('player', 'crouch', 'wonder', 'brink', 'right')], ['dusk']),
      board: 'CLOSE-UP, AT CAT HEIGHT. Our cat crouches at the edge of the hole with one ear turned toward it, holding its breath, listening as hard as a cat can; the dark inside is perfectly still. Nobody goes in. One caption at the top.',
      caption: ['Not a sound. Whoever dug it isn’t here.'],
      next: 'f092'
    },

    f092: {
      // the climber's screen of its own, straight after the choice
      when: { specialty: 'climbing' },
      scene: S('pile', 'wide', merge(MOON, { tracks: true }),
        [c('player', 'stand', 'wonder', 'arch', 'right')], ['dusk']),
      board: 'WIDE, DUSK, A CLIMBING CAT ONLY. Our cat stands on top of the bramble arch over the pile, big enough to see plainly, looking out past the towers, and far off, low over the hedge, the train tracks catch the last light: two bright rails on a dark bed with the sleepers across it, running off behind the tallest tower; a small inset shows a line of tiny prints running that way. The moon hangs above. Captions in a column beside the panel.',
      caption: ['You climb the bramble arch for a look.', 'Far off, past the towers, the train tracks shine in the last light.', 'The tiny prints ran that way.'],
      next: 'f093'
    },

    f093: {
      when: TOLD,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'wonder', 'rear-1', 'right'), c('tallyheart', 'sit', 'solemn', 'rear-2', 'left')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE TOLD PATH ONLY. Our cat sits up by the mouth, ready to pounce on whatever comes out, and Tallyheart shakes her head slowly and makes a plan instead; a small inset shows a dotted trail running from the hole off into the dark. Our cat’s balloon eager; hers low and certain.',
      say: [
        { who: 'player', text: 'Do we wait here and pounce?' },
        { who: 'tallyheart', text: 'Not tonight. If we pounce here, we’ll never find where our prey GOES. Tomorrow night, you and I find out where it comes out.' }
      ],
      next: 'f094'
    },

    f094: {
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'worried', 'rear-1', 'right')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE KEPT PATH ONLY. Our cat sits alone beside the mouth with one paw lifted toward the guards and puts it down again; a small thought bubble holds Tallyheart’s questioning face, and behind it Coil, the bridge and Sprinkle all tumbling out at once. Captions in a column beside the panel.',
      caption: ['You don’t follow it. Not tonight. Not without Riffle.', 'You nearly call Tallyheart. But she’d ask what ELSE you know.', 'And then it would all come out: Coil. The bridge. Sprinkle.'],
      next: 'f095'
    },

    f095: {
      when: TOLD,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'solemn', 'rear-1', 'right'), c('tallyheart', 'sit', 'solemn', 'rear-2', 'left')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE TOLD PATH ONLY. Tallyheart sits across the open mouth from our cat, the roots still lifted over it, and gives our cat a long, level look that seals the secret between them. The guards at the front never turn. Her balloon low and firm.',
      say: [{ who: 'tallyheart', text: 'Not a word to the Clan yet. A hole isn’t a thief. Not yet.' }],
      next: 'f096'
    },

    f096: {
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'solemn', 'rear-1', 'right')]), ['dusk']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE KEPT PATH ONLY. Our cat sits by the dark mouth with its secret growing bigger by the moment; a small thought bubble holds Riffle with his ears up, listening. The guards at the front never turn. Two captions, top left.',
      caption: ['Your secret just got bigger. Now it goes all the way under the pile.', 'Tomorrow, you’ll tell Riffle. He heard Coil too.'],
      next: 'f097'
    },

    /* ------------------------------------------------------------------ Seven claw marks */

    f097: {
      // (lying, so the stone is under her chin or by her nose, as the caption says); the skritch runs on
      // from the first caption, and is said in words for a child who listens
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'lie', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat lies in its own moss nest in the dark, and along the nest’s mossy edge its Case File stands in rows, Waffles’ new curl of bark in front; the pieces it must keep secret lie under the moss, a corner of each showing. Riffle’s nearly black stone lies where it was put. Captions in a column beside the panel; the skritch small and pale.',
      caption: [
        'In your nest:',
        'Waffles’ curl of bark goes along the mossy edge. Three more curls go under the moss.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      sfx: 'skritch, skritch.',
      sfxRead: 'skritch, skritch.',
      next: 'f098'
    },

    f098: {
      scene: S('den', 'doorway', DEN_BARK,
        [c('player', 'lie', 'wonder', 'nest', 'left')], ['night', 'stars']),
      board: 'MEDIUM, FROM INSIDE THE DEN, NIGHT. Our cat lies awake in its nest looking out through the doorway at the stars, and four small insets float over it like a list: seven claw marks on a tree, a heron and a fluffy white cat under a moonless sky, a fox with his paws crossed behind his back, and a dark round hole. Two captions, top left.',
      caption: ['Seven claw marks on the tree. Two witnesses: no moon.', 'One fox who LIED. And under the pile, a tunnel.'],
      next: 'f099'
    },

    f099: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'lie', 'wonder', 'sleeper-1', 'right'), c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. Across the empty middle nest the grey apprentice lifts his head and whispers his usual request, eyes like saucers; our cat sits up in its own nest with a new game ready. Two small balloons, his a whisper.',
      say: [
        { who: 'snorer', text: '{name}paw? Do the paw thing.', kind: 'whisper' },
        { who: 'player', text: 'It’s whiskers tonight. Hold still.' }
      ],
      next: 'f100'
    },

    f100: {
      // his face and hers, close: two consecutive entries of one cat are one face, its two cheeks
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'sit', 'happy', 'sleeper-1', 'right'), c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT, THE TAP PICTURE. The grey apprentice and our cat both puff out their cheeks as round as they will go, which is very silly, and try not to laugh. In play the counting picture takes the panel: his face and hers close up side by side, cheeks puffed, the next cheek glowing; each tap lights its six whiskers and puts the next number in our cat’s balloon, 6, 12, 18, 24. One caption at the top.',
      caption: ['He puffs out his cheeks. You puff out yours.'],
      skip: { table: 6, groups: 4, who: [{ who: 'snorer' }, { who: 'snorer' }, { who: 'player' }, { who: 'player' }], thing: 'whisker', things: 'whiskers', teacher: 'player', label: 'Count the next cheek.', prompt: '**Tap** the cheeks.', next: 'f101' }
    },

    f101: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. A big 24 floats over the dark, and across the empty middle nest the grey apprentice has sunk back down with his chin on his paws, amazed at his own face. His eyes are already closing. His balloon a mumble.',
      say: [{ who: 'snorer', text: 'TWENTY-FOUR? Between us? I never knew we had so MANY.' }],
      next: 'f102'
    },

    f102: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'lie', 'wonder', 'nest', 'left')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. The grey apprentice has curled up tight and is snoring, a little zzz rising from him, and across the den our cat lies awake a moment longer; a small thought bubble holds the dark round hole and a dotted line running from it off into the night. Two captions, top left.',
      caption: ['Soon he’s snoring.', 'Somewhere, that tunnel comes out. Where?'],
      next: 'f103'
    },

    f103: {
      // half asleep: the lids down to the middle of her eyes and kind's small smile (`kind` alone looks out,
      // wide awake; the next panel, f104, is asleep, eyes shut)
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'curl', 'kind', 'nest', 'left', { asleep: 'half' })], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat curls up tight beside its rows of bark, eyes half shut and a small smile, and a small thought bubble holds tomorrow night: two cats on a dark trail, the second Tallyheart for a cat who told and Riffle for one who kept the secret. Captions top left and at the bottom.',
      caption: [
        { when: TOLD, text: 'Tomorrow night, you and Tallyheart will find out.' },
        { when: KEPT, text: 'Tomorrow night, you and Riffle will find out.' },
        'You curl up tight, warm and safe, and sleep.'
      ],
      next: 'f104'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f104: {
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside its bark and Riffle’s stone, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream, the night the Counts didn’t lie?'],
      // short enough for one line in the box
      input: { kind: 'dream', placeholder: 'A tunnel… whiskers… sixty…', next: 'f105' }
    },

    f105: {
      scene: S('den', 'doorway', DEN_BARK,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'stars', 'skyriver', 'zzz']),
      board: 'WIDE CLOSING SHOT, FROM INSIDE THE DEN. Our cat sleeps curled in its moss nest with its Case File along the edge, both forepaws tucked under its chin, and through the doorway the Sky River shines over the rosebush and the sleeping camp. One tiny contented zzz. Caption at the bottom, with END OF CHAPTER SEVEN lettered like a title.',
      caption: [
        'You sleep warm in your nest, with seven claw marks on the tree and the Sky River shining over the rosebush.',
        'End of Chapter Seven.'
      ],
      end: true
    }
  };

  // The frames are written by section above; the chapter lists every frame in id order (f006a, f006b,
  // f007…), the reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* The lines the sets share (the spec's section 2). */
  function T(text) { return { who: 'tallyheart', text: text }; }
  var QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
  var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';
  var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
  // the warm-up is chapter 6's patrols: the generic question is “Four patrols. How many cats?”
  var PATROLS = { table: 3, thing: 'cat', things: 'cats', unit: 'patrol', units: 'patrols', teacher: 'tallyheart', ask: '{a} × {b}' };
  // the lesson's cheeks: that many cheeks close up, three whiskers on top and three below
  var CHEEKS = { table: 6, thing: 'whisker', things: 'whiskers', unit: 'cheek', units: 'cheeks', teacher: 'tallyheart',
    ask: '{a} × {b}', picture: { kind: 'cheeks' } };
  // the story's sums: nights of marks scratched in the sand (or the mud)
  var NIGHTS = { thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', ask: '{a} × {b}' };
  // a question that doubles or steps: its way, said once more before the last line; on a last miss its way alone
  function way(text) { return { miss: text + ' ' + MISS, missLast: text }; }
  // a question that doubles opens with every cheek's top row lit (art only: `E.lessonPicture` passes the kind)
  var TOP = { kind: 'cheeks-top' };
  // 2 × 6, “That’s one whole cat.”: one cat's two cheeks, drawn as one face (two entries of one cat)
  var ONE_CAT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }];

  PC.story.ch07 = {
    id: 'ch07',
    number: 7,
    title: 'The Counts Don’t Lie',
    start: 'f001',

    // Her Case File: the four cards this chapter gives, in the order she gets them. A card's picture is
    // its own id (app/art/cards.js). Waffles' lies at the end of the row Patience's and the fox's moon
    // make (two witnesses against one fox); the tunnel lies touching Coil's diggers. Her count, Sprinkle's
    // prints and the tunnel go under the moss in her nest on every path (the den's `hidden`).
    cards: {
      'waffles-no-moon': { mark: 'ear', line: 'Waffles says there was NO moon on the storm night.',
        link: { with: ['fox-moon'], line: 'Two say no moon. Only the fox says moon.' } },
      'my-count': { mark: 'eye', line: 'My count: twenty-four gone in six nights. A dragon would take sixty.' },
      'prints-sprinkle': { mark: 'eye', line: 'Sprinkle’s prints are huge. The thief’s are tiny.' },
      tunnel: { mark: 'eye', line: 'A tunnel under the back of the pile, too small for a dragon.',
        link: { with: ['coil-diggers'], line: 'Coil felt them. Now I’ve seen where.' } }
    },

    frames: ordered,

    counts: {
      // The sixth morning count, one question, chapter 6's: the three front rows she walks along, lit a row
      // at a time, with no number shown. No praise: the gap answers. A miss is scratched in the earth, ten
      // marks a row, and borrows the two easiest tens on the pile's own rows (never four or five full rows).
      'ch07-pile': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'rows' },
        facts: [{ a: 3, b: 10, light: 'rows', check: true,
          prompt: [{ kind: 'caption', text: 'Three front rows of ten. How many pieces?' }], retryPrompt: true }],
        ask: '{a} × {b}', praise: [], ground: 'earth',
        helpIntro: 'Let’s scratch it out: ten marks for every row.',
        helpIntroNotTen: 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.',
        fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower',
        avoid: [[4, 10], [5, 10]], fillIntro: 'An easy one.',
        miss: MISS, missLast: LAST, again: ['There it is. You remembered that one.'], done: null
      },

      // The warm-up on the 3s, in the Hollow: two questions, on chapter 6's patrols, with its help. The first
      // is the hard slot (warmHard, at 0): the 3s fact she found hardest in chapter 6, in the order she was
      // asked it, and 7 × 3 when nothing was; never one another day timed (1 × 3, 3 × 2, 3 × 9, 3 × 10), nor
      // 3 × 4, which comes second anyway. Fillers are chapter 6's lesson's easiest: “One from yesterday.”
      'ch07-threes': merge(PATROLS, {
        facts: [[7, 3], { a: 4, b: 3, right: [T('Twelve! Hold on to that.')], rightAgain: true }],
        warmHard: { table: 3, at: 0, avoid: [[1, 3], [3, 2], [3, 9], [3, 10], [3, 4]] }, avoid: [[3, 4]],
        fillFrom: 'ch06-threes', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
        praise: ['Hop, hop, hop!', 'Three more, every time!', 'You hopped it!'],
        fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
        helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST,
        remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
      }),

      // The lesson: the 6s, cheeks, ten facts in both orders. She already knows most of the sixes: 2 × 6,
      // 5 × 6 and 6 × 3 are stepping stones; seven are new (6 × 6, 6 × 4, 6 × 7, 6 × 8, 4 × 6, 7 × 6,
      // 8 × 6). The method is double the threes (6 × 3, 6 × 4, 6 × 7, 6 × 8 open with every top row lit) or
      // step off one she knows (6 × 6 off 5 × 6, its five cheeks lit). Twins are three places apart, so a
      // missed one comes back before its twin. 8 × 6 is a check: a quick right answer there, straight after a
      // missed 6 × 8's retry, never hides that miss from chapter 8. The 6s' own Count (“Whiskers · the 6s”).
      'ch07-sixes': merge(CHEEKS, {
        label: 'Whiskers', hollowThings: 'sixes', fillOrder: 'easiest', prompt: 'How many whiskers?',
        facts: [
          { a: 2, b: 6, who: ONE_CAT, prompt: 'Two cheeks? That’s one whole cat.', retryPrompt: true, right: [T('Twelve! Six and six.')], rightAgain: true },
          { a: 5, b: 6, right: [T('Thirty! You hopped that one already.')], rightAgain: true },
          merge({ a: 6, b: 6, lit: 30, prompt: 'Six cheeks. Five cheeks made thirty. One more cheek: six more.', retryPrompt: true,
            right: [T('Thirty-six! That’s a new one.')], rightAgain: true }, way('Five cheeks made thirty. Six more: thirty-six.')),
          merge({ a: 6, b: 3, picture: TOP, prompt: 'Three cheeks. Three threes on top: nine. Three threes below: nine more.', retryPrompt: true,
            right: [T('Eighteen, like the guards! Nine and nine. That’s doubling.')], rightAgain: true }, way('Nine and nine: eighteen.')),
          merge({ a: 6, b: 4, picture: TOP, prompt: 'Four cheeks. Four threes on top: twelve, like your warm-up. Four threes below: twelve more.', retryPrompt: true,
            right: [T('Twenty-four! You doubled the threes.')], rightAgain: true }, way('Twelve and twelve: twenty-four.')),
          merge({ a: 6, b: 7, picture: TOP, prompt: 'Seven cheeks. Seven threes on top: twenty-one. Twenty-one below, too. Twenty-one and twenty-one: twenty and twenty, then one and one.', retryPrompt: true,
            right: [T('Forty-two! You doubled twenty-one.')], rightAgain: true }, way('Twenty and twenty make forty. One and one make two. Forty-two.')),
          merge({ a: 6, b: 8, picture: TOP, prompt: 'Eight cheeks. Eight threes on top: twenty-four. Twenty-four below, too. Twenty-four and twenty-four: twenty and twenty, then four and four.', retryPrompt: true,
            right: [T('Forty-eight! The hardest one, and you did it.')], rightAgain: true }, way('Twenty and twenty make forty. Four and four make eight. Forty-eight.')),
          { a: 4, b: 6, prompt: 'Four cheeks? You did that one, turned round.', retryPrompt: true, right: [T('Twenty-four! Same fact.')], rightAgain: true },
          { a: 7, b: 6, prompt: 'Seven cheeks? You did that one the other way round.', retryPrompt: true, right: [T('Forty-two! Same fact.')], rightAgain: true },
          { a: 8, b: 6, check: true, right: [T('Forty-eight! Same fact.')], rightAgain: true }
        ],
        praise: ['Two threes make a six!', 'Six more, every time!', 'Three and three, every cheek!'],
        fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
        helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: 'That’s the sixes.'
      }),

      // The twenty-four, every path: six nights of four marks in the sand. The fact's own `table: 4`
      // pictures it as six nights of four and hops the help by fours, a night at a time; the set stays
      // table 6, so the 6s are still the lesson's Count. Its fillers are two easy sixes the lesson lends, in
      // Tallyheart's voice and the lesson's cheeks; never thirty-six, the lesson's newest.
      'ch07-gone': merge(NIGHTS, {
        table: 6, teacher: 'tallyheart', picture: { kind: 'marks' },
        facts: [merge({ a: 4, b: 6, table: 4,
          prompt: [{ kind: 'caption', text: 'Four gone a night, for six nights. How many gone?' }], retryPrompt: true,
          right: [T('Twenty-four! Four every night, for six nights. You just did that one with the whiskers!')], rightAgain: true },
          way('Three nights make twelve. Six nights is twice that. Twelve and twelve: twenty-four.'))],
        help: 'picture', helpIntro: HOP, helpIntroFar: HOP_FAR,
        fillFrom: 'ch07-sixes', fillOrder: 'easiest', fillVoice: 'borrower', fillIntro: 'An easy one.', avoid: [[6, 6]],
        praise: [], miss: MISS, missLast: LAST, done: null
      }),

      // The sixty, told path, in the Hollow: ten marks a night for six nights, typed in the twenty-four's
      // order (a night's count, then the nights). A miss lights the marks a night at a time, then “Tens land
      // on a zero.”; the fillers are one night and then two nights of ten marks.
      'ch07-dragon': merge(NIGHTS, {
        table: 10, teacher: 'tallyheart', picture: { kind: 'marks' },
        facts: [{ a: 10, b: 6, prompt: [{ kind: 'caption', text: 'Ten a night, for six nights. How many would a dragon take?' }], retryPrompt: true,
          right: [T('Sixty! Ten a night adds up fast.')], rightAgain: true }],
        help: 'picture', helpIntro: HOP, helpIntroFar: HOP_FAR,
        fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
        praise: [], miss: 'Tens land on a zero. ' + MISS, missLast: 'Tens land on a zero.', done: null
      }),

      // The sixty, kept path, under the Old Bridge: the told path's sum in Riffle's voice, its marks in the
      // mud. His whisper on the frame is said again over the question; the question's own words are his
      // second whisper; his right line a shout, then a whisper.
      'ch07-riffle': merge(NIGHTS, {
        table: 10, teacher: 'riffle', picture: { kind: 'marks', ground: 'mud' },
        facts: [{ a: 10, b: 6, prompt: [{ who: 'riffle', kind: 'whisper', text: 'Six nights. How many would she take?' }], retryPrompt: true,
          right: [{ who: 'riffle', kind: 'shout', text: 'SIXTY!' }, { who: 'riffle', kind: 'whisper', text: '…sixty.' }], rightAgain: true }],
        help: 'picture', helpIntro: 'Hop by tens! Ten, twenty…', helpIntroFar: 'Hop by tens! Ten, twenty…',
        fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
        praise: [], miss: MISS, missLast: LAST, done: null
      })
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'The Counts Don’t Lie',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: '{name}paw’s dream that night went uncounted.',
      // Seven entries on every path, nine or ten sentences: the sum by the path she took (told, the whole
      // sum with Tallyheart; kept, the sixty with Riffle), and who found the tunnel. The cat is named
      // wherever a tom's “he” could mean another animal. No dragonet page: nobody new is found.
      recap: [
        { text: 'Before the sun was up, {name}paw asked Princess Waffles about the storm night. NO moon, she said, not a sliver: two witnesses against one fox.' },
        { text: 'At the sixth morning count, four more pieces were gone, though eighteen guards had watched all night: twenty-four in six nights.' },
        { text: 'Tallyheart taught {name}paw {their} seventh Count, whiskers: the sixes.' },
        { when: { ch3Told: true }, text: 'Then {name}paw and Tallyheart worked it out: four a night for six nights is twenty-four, but a dragon who eats ten fish a meal would have taken sixty.' },
        { when: { ch3Told: false }, text: 'Then {name}paw and Tallyheart counted twenty-four in six nights, and Riffle helped {name}paw work out that a dragon who eats ten fish a meal would have taken sixty.' },
        // (the two claims named, so no “they” is left for a child to pin on Sprinkle and Reynard)
        { text: 'Under the Old Bridge, Sprinkle’s prints were huge; the thief’s, in the marsh, were tiny. Sprinkle tried to fly, and couldn’t, so Reynard’s story that the dragon FLEW can’t be true.' },
        { when: { ch3Told: true }, text: 'At dusk, behind the back row, {name}paw and Tallyheart found the mouth of a tunnel under the bramble roots, much too small for a dragon.' },
        { when: { ch3Told: false }, text: 'At dusk, behind the back row, {name}paw found the mouth of a tunnel under the bramble roots, much too small for a dragon.' },
        { text: 'That night, the grey tom and {name}paw counted their whiskers: twenty-four, between them.' }
      ]
    },

    teaser: {
      title: 'Chapter 8: The Night Trail',
      lines: [
        'Tomorrow night, a trail in the dark.',
        'Where does that tunnel come out?'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
