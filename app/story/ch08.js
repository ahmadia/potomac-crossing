/* Chapter 8: The Night Trail.
 *
 * The story (docs/chapters/08-the-night-trail.md, Draft v0.4, final) cut into graphic-novel panels,
 * per the frame contract in docs/build.md; its spec (docs/chapters/08-the-night-trail.spec.md, v0.2)
 * is the build's contract for the flag, the Counts sets, the cards, the art, the pages she taps and
 * the book. Each frame is one moment: a drawn scene, a written storyboard (`board`) for a future
 * illustrator, short captions, speech balloons and sound effects (the skritch in her nest and the
 * sniff behind her, whose captions run on into them, and the sneeze on a panel of its own, are said in
 * words for a child who listens: `sfxRead`), and exactly one interaction. Frame ids run in reading
 * order, the order of the story's screens. Tonight's two routes are numbered one after the other: the
 * tunnel (f037–f051), then the Barking Field (f052–f079, with the hollow log, Hail's optional scene,
 * f080–f092), and both meet at the weasel holes, on a panel of the new place written once (f093). A
 * light choice's outcomes carry a letter and rejoin at a plain number:
 *   the fork           sniff the left way or the right is the told path's choice (f045 → f046a, f046b)
 *                      and the kept path's (f047 → f048a, f048b), each with its own two panels: the
 *                      storyboard walks a choice's branches to where they meet, so the told outcomes
 *                      lead on to the kept choice (which a told reader passes over), as chapter 7's
 *                      tunnel choice did;
 *   “I’m sorry.”       the kept path's choice at home (f152 → f153a, f153b);
 *   the fox            glare or tongue, one outcome panel each path, “He doesn’t see. Good.” (f118 →
 *                      f119, f120 → f121);
 *   the route          written once at the tunnel's mouth (f036 → f037, f052);
 *   the hollow log     written once, from the path (f062 → f080, Hail's scene, or f063, “Not
 *                      tonight.”, and the specialty chain). Its first option is “Who’s in the log?”,
 *                      read “Go and see Hail again.” by a cat who has found her (`labelWhen`, chapter
 *                      6's way with Sleet: one branch, so the storyboard lists Hail's scene once).
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line of narration that
 * follows a balloon on one screen of the story opens the next panel, or the panel is split in two (the
 * spec's build notes list the screens where the order matters), and no panel holds five boxes (the
 * inside of the tunnel's noticing line opens the next panel; the fox's den, with a Puddle cat's line,
 * is split at a speaker, f113/f114). A line the story marks [if …] carries a `when`. A scene cannot vary
 * by flag, so where the friend is in the picture (Tallyheart on the told path, Riffle on the kept) the
 * panel is two frames, one after the other, with opposite `when`s (the told path's first, leading to its
 * kept twin, which leads on): whichever is not hers is passed over. The close shots that hold neither
 * are written once: the tunnel's `crawl` of our cat alone, the Barking Field's `dogs` and `fence` with
 * the dogs and Hail, the weasels' `holes`, the fox's `brag`, the stash. Likewise a picture with Hail in
 * it after her scene (the chase at the fence) is two frames by `foundHail`.
 *   ch3Told       the seventh count (told f002–f004, kept f005), the Hollow's last words (f023; kept
 *                 f024, f025), the Old Bridge (kept f026–f029), round the back (f031–f035), the tunnel
 *                 (told f037, f040, f041, f045–f046b; kept f038, f042–f044, f047–f048b, and its end,
 *                 f050/f051), the field (f052–f057, f060/f061, the way past the dogs f064–f079, the hollow log's
 *                 BOING f080/f081, Hail's “five” f091/f092), the weasel holes (f094–f099, f103–f106),
 *                 the fox (f107–f110, f118–f121), the stash (f124/f125), the chase (f136–f139), home
 *                 (told f147–f149, kept f150–f156) and the warm moment's last line (f158)
 *   specialty     f039's next panel (noticing: tiny prints, f040/f042), f096/f097 (noticing: prints
 *                 round every hole), the Barking Field's way past the dogs (f064/f065 sneaking,
 *                 f066/f067 climbing, f068–f073 friends, f074–f079 noticing or swimming), f126/f127 (sneaking)
 *   worry         f036 (small, water), f039 (small), f118/f120 (talk), f126/f127 (small, and every
 *                 other worry), f129 and f131 (shiny)
 *   foundHail     f062 (the log's label), the chase's dogs (f141–f146)
 *   found before  f086 (any dragonet: her news to Hail), f100 (Squall), f113 (Puddle; Sleet or
 *                 not), f131 (Wisp)
 *   ch2Stone      f159 (her stone)
 *   lessonClean   f020 (the eighth mark's two pairs of lines)
 * One flag is set, by reaching a frame, for good: `foundHail`, on Hail's last screen (f091/f092, the
 * slip-past Tap), on both paths. No choice sets anything; nothing records which way she went.
 *
 * The start frame always shows (E.checkStory): the story opens on a told screen and a kept one, so the
 * chapter opens on its title over her nest before dawn (f001), the builder's own, as the end page is.
 *
 * Speakers: the weasels are “A weasel” and Hail “The speckled dragonet” (the chapter's `names`) until
 * the story tells who is who: Snip's and Snatch's balloons carry `name` from “Snip is the squeaky one.”
 * on (f102), Hail's from “I’m Hail!” (f084; her first, from the log, is “A white head”). The dogs are
 * “The shaggy dog” (variant 1, Good Boy), “The spotty dog” (2, Drop It) and “The tiny dog” (3) until
 * “I’m GOOD BOY!” and “I’m DROP IT!” (f059), and “Good Boy” and “Drop It” from then on (“BYE, RUDE
 * SQUIRRELS!” is Good Boy's, as “The dogs”). A frame's nth balloon from a dog is the nth dog in its
 * cast. Coil is “Coil” (chapter 7's call); the grey tom is the snoring apprentice.
 *
 * Text conventions: second person, present tense (“you”); typographic apostrophes and quotes (’ “ ” …)
 * so nothing needs escaping. Time of day comes from fx: `night` in the den as she wakes, `morning` at
 * the pile and in the Hollow, `day` under the Old Bridge (kept), `dusk` at the pile for “The sun goes
 * down…” (the eighth evening's half moon, `moon: 8`), and `night` from round the back of the pile on:
 * the tunnel, the Barking Field, the bank by the tracks, home, the den.
 * tests/story-ch08.test.js checks all of this; tools/storyboard.mjs turns it into docs/storyboard/ch08.md.
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

  /* The five cats on the hollow's rim, left to right (chapters 5 to 7's), sitting up. In the `lesson`
   * camera the cats at `sand-left` and `sand-right` sit right in front of `rim-2` and `rim-4`, so
   * `close` leaves those two out. They are also the five cats whose paws she counts as they hop down
   * and pad past her (the skip's `who`); from then on the rim is empty. */
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
  // the rim cats on their feet, hopping down off it one by one to pad past her
  function hopping() {
    return [c('clancat', 'walk', 'happy', 'rim-1', 'left', { variant: 1 }), c('murmurchime', 'walk', 'happy', 'rim-2', 'left'),
      c('clancat', 'walk', 'happy', 'rim-3', 'left', { variant: 3 }), c('clancat', 'walk', 'proud', 'rim-4', 'left', { variant: 5 }),
      c('grizzled', 'walk', 'neutral', 'rim-5', 'left')];
  }

  // Scene options that stay the same through a place
  // The den at night: Riffle's stone where she put it, her Case File along the mossy edge of her nest
  // and her secret pieces under the moss; from bedtime her piece of glass in its leaf under the moss
  // too, and on the last panels the eighth evening's half moon in the doorway's patch of sky
  var DEN = { weather: 'clear', moon: false, stone: 'auto' };
  var DEN_BARK = merge(DEN, { bark: 'auto', hidden: true });
  var DEN_GLASS = merge(DEN_BARK, { glass: true });
  var DEN_MOON = merge(DEN_GLASS, { moon: 8 });
  // Tallyheart crouched beside her nest as she wakes (the spec's spot on `inside`, measured beside
  // `nest` at x 1060; `sleeper-2`, the tortoiseshell's empty nest, is across the den)
  var WAKE = { x: 1250, y: 896, h: 250 };
  // The seventh morning's pile: four rows of ten, the back row with four empty places right in its
  // middle, the “scale” on the bare earth behind it (chapter 7's): the back row a dark band in the
  // brambles' shadow until she walks round to it; then the gap and the dug earth
  var ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  var PILE_SHADE = { rows: ROWS, back: 'shadow', scale: 'behind' };
  var PILE_GAP = { rows: ROWS, scale: 'behind', dug: 'big' };
  // At dusk the day's hunting has filled it again, and the half moon is high in the sky (`wide`); from
  // round the back on it is night, the roots lifted and the tunnel's mouth open (`tunnel: true`),
  // where she wriggles in (`tap: 'mouth'`); the close shot of the mouth (`hole`) always has them up
  var EVE = { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' };
  var DUSK = merge(EVE, { moon: 8, tap: 'back' });
  var OPEN = merge(EVE, { tunnel: true });
  var MOUTH = merge(OPEN, { tap: 'mouth' });
  // our cat nose to nose with Tallyheart behind the pile (the spec's spot on `rear`, beside `rear-2`,
  // measured on the frame: at x 1000 her head stood right under Tallyheart's; at 860 they meet)
  var NOSE = { x: 860, y: 960, h: 380 };
  // Riffle waving goodbye at the hedge: the right edge of `rear`, well clear of `rear-2`, where Tallyheart is
  // waiting on the next panel (so he never seems to turn into her)
  var HEDGE = { x: 1430, y: 962, h: 380 };
  // the talk at home, close (`hole`, at the tunnel's mouth behind the back row): our cat at `brink`, Tallyheart across
  // the mouth from her, sitting (a spot of the frame's own, measured on `hole`: her head well clear of the mouth)
  var TALK = { x: 1220, y: 958, h: 470 };
  // and our cat leaning into Tallyheart's side there (her tail curls round her: a caption), her head at her chest
  var LEAN = { x: 1060, y: 960, h: 470 };
  // the first guards: small, past the rows at the front, side-on, looking out over the camp
  function guards() {
    return [c('clancat', 'sit', 'neutral', 'guard-1', 'left', { variant: 2 }), c('clancat', 'sit', 'neutral', 'guard-2', 'right', { variant: 4 }),
      c('clancat', 'stand', 'neutral', 'guard-3', 'right', { variant: 3 })];
  }
  // the tree: seven marks until Tallyheart scratches the eighth (f019), eight from then on
  var H7 = { marks: 7, glow: 'auto' };
  var H8 = { marks: 8, glow: 'auto' };
  // the Old Bridge: Sprinkle's big prints in the mud and the stone leg with Coil's gap low in it
  var BACK = { prints: true, stones: true };
  // the Barking Field and the bank by the tracks at night, under the eighth evening's half moon; the
  // way past the dogs and the slip past at the end of Hail's scene are the path's own Tap
  var NIGHT_SKY = { moon: 8 };
  var PATH = { moon: 8, tap: 'path' };
  // our cat on the `dogs` camera's path, clear of its one puddle (x 670 to 930, under `trail-1`): dry on every
  // page, as the water-worry cat was told (“Neither way is wet.”). Lying flat in the grass at the path's edge,
  // ahead of the friend at `path-left` (the set draws grass over a cat lying flat there at night); sitting up to
  // talk to Hail at the wire, just left of the puddle
  var FLAT = { x: 470, y: 975, h: 285 };
  var BY_WIRE = { x: 520, y: 968, h: 286 };
  // the told path and the kept path; Hail found or not; the worries and specialties the story reads
  var TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
  var HAIL = { foundHail: true }, NO_HAIL = { foundHail: false };
  var SMALL = { worry: 'small' }, NOT_SMALL = { not: { worry: 'small' } };
  var NOTICING = { specialty: 'noticing' }, SNEAKING = { specialty: 'sneaking' };
  // the way past the dogs, by specialty, each with the friend in the picture: Tallyheart (told) or Riffle (kept)
  var SNEAK_TOLD = { specialty: 'sneaking', ch3Told: true }, SNEAK_KEPT = { specialty: 'sneaking', ch3Told: false };
  var CLIMB_TOLD = { specialty: 'climbing', ch3Told: true }, CLIMB_KEPT = { specialty: 'climbing', ch3Told: false };
  var FRIENDS_TOLD = { specialty: 'friends', ch3Told: true }, FRIENDS_KEPT = { specialty: 'friends', ch3Told: false };
  var FETCH_TOLD = { specialty: ['noticing', 'swimming'], ch3Told: true }, FETCH_KEPT = { specialty: ['noticing', 'swimming'], ch3Told: false };
  // any dragonet she has found before: not all four still unfound (E.matches' `not`)
  var FOUND_ONE = { not: { foundSquall: false, foundPuddle: false, foundSleet: false, foundWisp: false } };
  var frames = {

    /* ------------------------------------------------------------------ The title */

    f001: {
      // the start frame shows to everyone: the chapter's title, the builder's own, over her nest
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz']),
      board: 'CLOSE-UP, THE TITLE PANEL, BEFORE DAWN. Our cat sleeps curled tight in its moss nest in the deep dark of the den, its rows of bark standing along the mossy edge and the corners of its secret pieces showing under the moss. One small zzz rises. The chapter’s title is lettered across the top of the panel like a title page.',
      caption: ['Chapter 8: The Night Trail'],
      next: 'f002'
    },

    /* ------------------------------------------------------------------ The seventh count */

    f002: {
      when: TOLD,
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'lie', 'wonder', 'nest', 'right'),
         c('tallyheart', 'crouch', 'wonder', WAKE, 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, BEFORE DAWN, THE TOLD PATH ONLY. It is still dark under the rosebush, and a big ginger paw reaches into the panel and pokes our cat in its nest; Tallyheart crouches beside the nest, eyes shining in the gloom, and across the den the grey apprentice sleeps on. Caption top left; her balloon a whisper.',
      caption: ['A paw pokes you awake. It’s still dark.'],
      say: [{ who: 'tallyheart', text: 'Psst. {name}paw.', kind: 'whisper' }],
      next: 'f003'
    },

    f003: {
      // her eyes shining: the narration between her two lines opens this panel
      when: TOLD,
      scene: S('den', 'doorway', DEN_BARK,
        [c('player', 'lie', 'wonder', 'nest', 'right'),
         c('tallyheart', 'crouch', 'wonder', WAKE, 'left')], ['night']),
      board: 'MEDIUM TWO-SHOT, INSIDE THE DEN, THE TOLD PATH ONLY. Tallyheart leans in over the nest and whispers the night’s news, bursting with it; a small inset shows her lying by the roots with her eyes shut like a sleepy old cat while four pieces of prey, one after another, bump down into a dark hole (no thief drawn). Our cat’s ears go straight up. Caption top left; her balloon a long, thrilled whisper.',
      caption: ['Tallyheart’s eyes are shining.'],
      say: [{ who: 'tallyheart', text: 'They CAME. I lay by the roots with my eyes shut, like a sleepy old cat. Scrape, scrape. Then bump, bump, bump, bump: four pieces of prey, going DOWN the hole.', kind: 'whisper' }],
      next: 'f004'
    },

    f004: {
      when: TOLD,
      scene: S('den', 'doorway', DEN_BARK,
        [c('player', 'sit', 'wonder', 'nest', 'right'),
         c('tallyheart', 'crouch', 'solemn', WAKE, 'left')], ['night']),
      board: 'MEDIUM TWO-SHOT, INSIDE THE DEN, THE TOLD PATH ONLY. Our cat sits up in its nest and whispers its question, and Tallyheart shakes her head slowly, a hunter with a plan; a small inset shows a dotted trail running from the hole to the hedge and on toward two far shiny lines. The doorway behind them is still dark. Two balloons, both whispers.',
      say: [
        { who: 'player', text: 'Did you pounce?', kind: 'whisper' },
        { who: 'tallyheart', text: 'No. If we pounce here, we’ll never find where our prey GOES. I followed the sound as far as the hedge. It went on, toward the train tracks.', kind: 'whisper' }
      ],
      next: 'f005'
    },

    f005: {
      when: KEPT,
      scene: S('pile', 'wide', PILE_SHADE,
        [c('clancat', 'sit', 'sleepy', 'beside', 'left', { variant: 2 }), c('clancat', 'sit', 'sleepy', 'crowd-2', 'left', { variant: 4 }),
         c('clancat', 'sit', 'sleepy', 'crowd-3', 'left', { variant: 3 }), c('murmurchime', 'stand', 'shout', 'crowd-1', 'right'),
         c('player', 'sit', 'wonder', 'pile-left', 'right')], ['morning']),
      board: 'WIDE, FIRST LIGHT, THE KEPT PATH ONLY. By the prey pile the last guards of the night yawn enormously, and the little tortoiseshell warrior bounces up at the left to report, very loudly, that nothing happened at all; the back row is still a dark band in the brambles’ shadow. Our cat sits at the end of the rows. Caption top left; her balloon a shout.',
      caption: ['By the prey pile, the last guards are yawning.'],
      say: [{ who: 'murmurchime', text: 'Nothing. We saw NOTHING. Not one thing.', kind: 'shout' }],
      next: 'f006'
    },

    f006: {
      // her balloon is not said again over the question: the caption is the question's own (`intro: false`)
      scene: S('pile', 'rows', PILE_SHADE,
        [c('clancat', 'sit', 'sleepy', 'crowd-2', 'right', { variant: 3 }), c('clancat', 'sit', 'sleepy', 'crowd-1', 'right', { variant: 4 }),
         c('clancat', 'sit', 'neutral', 'pile-left', 'right', { variant: 2 }), c('glintstar', 'sit', 'solemn', 'crowd-3', 'left'),
         c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'), c('player', 'sit', 'wonder', 'beside', 'left')], ['morning']),
      board: 'WIDE, FROM THE FRONT, SUNRISE, THEN THE COUNTS. The whole Clan waits round the prey pile in the first gold light, the back row only a dark band in the brambles’ shadow; Glintstar sits silver and still at the right and asks for the count, and Tallyheart and our cat stand ready beside her. In the Counts picture the three front rows light one at a time, with no number shown; the keypad sits below the panel.',
      caption: ['At sunrise, the whole Clan is waiting by the pile.'],
      say: [{ who: 'glintstar', text: '{name}paw. The count, please.' }],
      counts: { set: 'ch08-pile', intro: false, next: 'f007' }
    },

    f007: {
      scene: S('pile', 'rows', merge(PILE_SHADE, { tap: 'back' }),
        [c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'), c('player', 'stand', 'wonder', 'beside', 'left')], ['morning']),
      board: 'WIDE, FROM THE FRONT, THE TAP PICTURE. The three front rows are counted and the back row still lies in the brambles’ shadow, a dark band nobody can see into; our cat steps toward it, Tallyheart watching. In play the shadowed back row glows softly; one tap walks our cat round to it and turns the page. One caption at the top.',
      caption: ['The back row is still in the brambles’ shadow.'],
      scratch: { tap: 'back', prompt: '**Tap** to walk round the back.', label: 'Walk round the back.', next: 'f008' }
    },

    f008: {
      scene: S('pile', 'gap', PILE_GAP,
        [c('player', 'crouch', 'wonder', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM, THE BACK ROW. Out of the shadow now, the back row: three pieces, then four empty places pressed into the earth right in its middle, then three more, and the fresh heap of dug earth behind; our cat crouches before it and says it first, flatly, as a counter does. Caption top left, well clear of the gap; its balloon two short lines.',
      caption: ['Right in the middle of the back row: four empty spaces.'],
      say: [{ who: 'player', text: 'Four gone. Still tidy.' }],
      next: 'f009'
    },

    f009: {
      // nobody is blamed: the guards look at their paws (`shy`), nobody is stern
      scene: S('pile', 'wide', PILE_GAP,
        [c('clancat', 'sit', 'shy', 'crowd-2', 'left', { variant: 4 }), c('glintstar', 'stand', 'kind', 'fountain-edge', 'left'),
         c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'), c('player', 'sit', 'wonder', 'pile-left', 'right'),
         c('clancat', 'sit', 'shy', 'beside', 'left', { variant: 2 }), c('grizzled', 'sit', 'sad', 'crowd-3', 'left', { holds: 'pinecone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE. The guards sit with their heads down, looking at their own paws, while Glintstar on the fountain’s edge speaks calmly to all of them; at the front the old tom clutches his pinecone and groans at the size of the number. The gap sits in the middle of the back row. Caption top left; her balloon level, his a groan.',
      caption: ['The guards look at their paws.'],
      say: [
        { who: 'glintstar', text: 'Nobody here is to blame. Seven nights now.' },
        { who: 'grizzled', text: 'Four a night, for SEVEN nights? That’s more than I’ve got WHISKERS.' }
      ],
      next: 'f010'
    },

    /* ------------------------------------------------------------------ Paws */

    f010: {
      // the warm-up's hard pick comes first, so none of these lines is said again over it (`intro: false`)
      scene: S('hollow', 'wide', H7,
        rim().concat([c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'happy', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THEN THE COUNTS. The sandy Training Hollow in the morning sun, seven claw marks on the leaning tree, and five cats sitting up on the rim; Tallyheart waits past the tree with a new job in her eyes and our cat sits ready in the sun patch. In the Counts picture cheeks close up, three whiskers on top and three below, none lit; after a miss she hops the sand by sixes. Caption top left; the keypad sits below the panel.',
      caption: ['In the Training Hollow, five cats sit up on the rim.'],
      say: [{ who: 'tallyheart', text: 'Four a night? That’s a job for the fours. But first, sixes, to wake up your whiskers.' }],
      counts: { set: 'ch08-sixes', intro: false, next: 'f011' }
    },

    f011: {
      scene: S('hollow', 'lesson', H7,
        rim(true).concat([c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart sits on the sand facing our cat with a riddle twinkling in her eyes, and taps the ground between them with one paw; the rim cats lean in behind. Our cat thinks hard. Her balloon a sly question.',
      say: [{ who: 'tallyheart', text: 'Today’s Count is right under you. What has every cat got FOUR of?' }],
      next: 'f012'
    },

    f012: {
      // the art has no looking-down pose: crouched, her head low over her own paws
      scene: S('hollow', 'sand', H7,
        [c('player', 'crouch', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'CLOSE-UP, ON THE SAND. Our cat crouches with its head right down over its own four paws on the sand, as if it had never seen them before, and the answer hits it all at once. Its ears shoot up. Caption top left; our cat’s balloon a squeak of discovery.',
      caption: ['You look down.'],
      say: [{ who: 'player', text: 'PAWS!', kind: 'shout' }],
      next: 'f013'
    },

    f013: {
      scene: S('hollow', 'lesson', H7,
        rim(true).concat([c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart nods, pleased, and lifts one big ginger forepaw a little off the sand to show it; our cat sits up straight and looks at its own. The rim cats look down at their paws too. Her balloon plain.',
      say: [{ who: 'tallyheart', text: 'Four paws on every cat.' }],
      next: 'f014'
    },

    f014: {
      // her four paws, two pairs: the cat stays up on the page after (`keep`)
      scene: S('hollow', 'lesson', H7,
        rim(true).concat([c('tallyheart', 'stand', 'kind', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT, THE TAP PICTURE. Tallyheart gets to her feet and stands side-on to our cat, very still, so all four of her paws show plainly on the sand. In play the counting picture takes the panel: one ginger cat close up, side-on, the front pair of paws glowing; one tap lights them and puts 2 in our cat’s balloon, the next lights the back pair, 4, and turns the page. Caption top left; her balloon short.',
      caption: ['She stands so you can see all of hers.'],
      say: [{ who: 'tallyheart', text: 'Count mine.' }],
      skip: { table: 2, groups: 2, who: [{ who: 'tallyheart' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next pair of paws.', prompt: '**Tap** her paws.', keep: true, next: 'f015' }
    },

    f015: {
      scene: S('hollow', 'lesson', H7,
        rim(true).concat([c('tallyheart', 'stand', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT. The ginger cat stays up in play, both pairs of paws lit with 2 and 4 under them and a big 4 over them, and Tallyheart points out the two pairs with her nose; our cat bounces where it sits, remembering yesterday’s whiskers. Three balloons, hers plain, our cat’s an excited squeak, hers again pleased.',
      say: [
        { who: 'tallyheart', text: 'Two front paws. Two back paws. A four is two twos.' },
        { who: 'player', text: 'Two twos! Like a six is two threes!' },
        { who: 'tallyheart', text: 'Exactly. Doubling, AGAIN.' }
      ],
      next: 'f016'
    },

    f016: {
      // the rim cats on their feet, hopping down: the skip's `who` is the five of them, in their coats
      scene: S('hollow', 'wide', H7,
        hopping().concat([c('tallyheart', 'sit', 'happy', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. One after another the five cats on the rim hop down into the Hollow and pad past our cat in a line, the old tom last and slowest, and Tallyheart sits past the tree ready to count them. In play the counting picture takes the panel: five cats side-on in their own coats, the first glowing; each tap lights its four paws and a big number over them grows by four, 4, 8, 12, 16, 20. Caption top left; her balloon at the top.',
      caption: ['One by one, the cats on the rim hop down and pad past you.'],
      say: [{ who: 'tallyheart', text: 'Hop by fours. Four paws on every cat.' }],
      skip: { table: 4, groups: 5, who: RIM, thing: 'paw', things: 'paws', teacher: 'tallyheart', label: 'Count the next cat’s paws.', prompt: '**Tap** the cats as they go by.', carry: false, next: 'f017' }
    },

    f017: {
      // Tallyheart's seven Counts: seven taps that count nothing; each letters her question and our cat's answer
      scene: S('hollow', 'wide', H7,
        [c('tallyheart', 'sit', 'happy', 'tree-far', 'left', { size: 1.2, glow: true }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')], ['morning']),
      board: 'WIDE, THE TAP PICTURE. The rim is empty now, and Tallyheart sits past the leaning tree with its seven claw marks plain on the trunk, glowing softly with a secret; our cat sits bolt upright in the sun patch with its mouth open. In play each tap on her letters her next Count in her balloon and our cat’s answer in its own, the fours it already knows, one for every mark; after the seventh the page turns. Her balloon low; our cat’s a squeak.',
      say: [
        { who: 'tallyheart', text: 'Twenty! Now, a secret. You already know most of the fours. One from every mark on this tree.' },
        { who: 'player', text: 'I DO?', kind: 'shout' }
      ],
      ask: {
        who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
        pairs: [
          ['Tails?', 'Four cats, four tails!'],
          ['Ears?', 'Four cats, eight ears!'],
          ['Claws?', 'Four forepaws, twenty claws!'],
          ['Both forepaws?', 'Four cats, forty claws!'],
          ['Nine lives?', 'Four cats, thirty-six lives!'],
          ['Patrols?', 'Four patrols, twelve guards!'],
          ['Whiskers?', 'Four cheeks, twenty-four whiskers. That’s MY count!']
        ],
        next: 'f018'
      }
    },

    f018: {
      // her balloon is read on the frame and not again (`intro: false`): 2 × 4's own line is the first question's
      scene: S('hollow', 'lesson', H7,
        [c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THEN THE COUNTS. Tallyheart sweeps the sand smooth between them for the three new ones, and lifts a front paw and then a back paw to show the doubling. In the Counts picture that many cats stand side-on in rows of five, four paws each, none lit, but eight cats open with seven already lit; after a miss she scratches four marks for every cat, two and two, and hops them by fours. Her balloon warm; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Seven of them you knew already. Only three are new: the paws of four cats, seven cats and eight cats. For those, hop from one you know. Or count the front paws, and double it!' }],
      counts: { set: 'ch08-fours', intro: false, next: 'f019' }
    },

    f019: {
      scene: S('hollow', 'tree', H8, [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score an eighth claw mark into the bark beside the seventh; the marks stand four and four now, the older ones deeper and darker than the new one. The SKRITCH! runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'An eighth claw mark.'],
      sfx: 'SKRITCH!',
      next: 'f020'
    },

    f020: {
      // in the wide view, where the eight marks show (the `lesson` camera sees only the edge of the tree)
      scene: S('hollow', 'wide', H8,
        [c('tallyheart', 'sit', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'proud', 'sunpatch-2', 'right')], ['morning']),
      board: 'WIDE. Eight claw marks on the leaning tree now, and Tallyheart sitting past the trunk with her torn ear tipped across the empty Hollow toward our cat. A cat who never needed the sand says it with a bounce, and Tallyheart tops it; a cat who did says it plainly, and Tallyheart answers it warmly. Her balloons warm; our cat’s sure of itself.',
      say: [
        { who: 'tallyheart', text: 'Paws. That’s your eighth Count.' },
        { who: 'player', text: 'Not one miss!', when: { lessonClean: 'ch08-fours' } },
        { who: 'tallyheart', text: 'Not one. The fours are yours now.', when: { lessonClean: 'ch08-fours' } },
        { who: 'player', text: 'Some were tricky.', when: { not: { lessonClean: 'ch08-fours' } } },
        { who: 'tallyheart', text: 'You worked every one out. Tomorrow, the new ones will be old ones.', when: { not: { lessonClean: 'ch08-fours' } } }
      ],
      next: 'f021'
    },

    /* ------------------------------------------------------------------ Twenty-eight */

    f021: {
      scene: S('hollow', 'lesson', H8,
        [c('tallyheart', 'stand', 'solemn', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart gets to her feet on the empty sand, all business now, and smooths a clean patch between them with one paw; our cat sits up straight. The leaning tree’s eight marks are at the edge of the panel. Her balloon short and brisk.',
      say: [{ who: 'tallyheart', text: 'Now. Let’s count what’s gone.' }],
      next: 'f022'
    },

    f022: {
      // the frame has no balloon: the caption is its own, the question the fact's; her claws out on the
      // forepaw at the sand (chapter 7's), the marks themselves the Counts picture's
      scene: S('hollow', 'sand', H8,
        [c('tallyheart', 'crouch', 'solemn', 'sand-left', 'right', { claws: true }), c('player', 'crouch', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'CLOSE-UP, ON THE SAND, THEN THE COUNTS. Tallyheart crouches over the smooth sand and scratches it with one forepaw, claws out, two marks and a space and two more, a night at a time, and our cat crouches nose down across from her, watching each little group appear. In the Counts picture seven nights stand side by side in the sand, four marks each in two pairs, none lit; after a miss they light a night at a time as she hops by fours. Caption top left; the keypad sits below the panel.',
      caption: ['In the sand she scratches four marks for every night. Seven nights.'],
      counts: { set: 'ch08-gone', next: 'f023' }
    },

    f023: {
      when: TOLD,
      scene: S('hollow', 'lesson', H8,
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE TOLD PATH ONLY. Tallyheart sits back beside her seven nights of marks and says the number softly, as if it were a promise, and our cat leans in to whisper back; a small inset shows two cats on a silver trail under a half moon. The Hollow is empty around them. Three balloons, hers low and certain.',
      say: [
        { who: 'tallyheart', text: 'Twenty-eight. Tonight, we follow them all the way.' },
        { who: 'player', text: 'Just us?' },
        { who: 'tallyheart', text: 'Just us. Not a word to the Clan yet. Nap this afternoon. A night trail needs sharp eyes.' }
      ],
      next: 'f024'
    },

    f024: {
      when: KEPT,
      scene: S('hollow', 'lesson', H8,
        [c('tallyheart', 'stand', 'stern', 'sand-left', 'right'), c('player', 'sit', 'worried', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE KEPT PATH ONLY. Tallyheart frowns down at the seven nights of marks as if they had told her a fib, then gets to her feet and sends our cat off for the day with a flick of her tail. Our cat sits very still. Her balloon puzzled, then brisk.',
      say: [{ who: 'tallyheart', text: 'Twenty-eight. And not one guard saw a thing. Off you go. Back by sunset.' }],
      next: 'f025'
    },

    f025: {
      // her thought: the caption only
      when: KEPT,
      scene: S('hollow', 'wide', H8,
        [c('tallyheart', 'walk', 'solemn', 'tree-far', 'right', { size: 1.2 }), c('player', 'sit', 'shy', 'sunpatch-2', 'right')], ['morning']),
      board: 'WIDE, THE KEPT PATH ONLY. Tallyheart pads off past the leaning tree, and in the sun patch our cat presses its mouth shut tight, bursting with a thing it cannot say; a small thought bubble over its head holds a dark round hole and an arrow pointing UP out of it. Nobody else is in the Hollow. One caption at the top.',
      caption: ['You know why: they come from UNDER! But you can’t say so. Not without telling everything.'],
      next: 'f026'
    },

    f026: {
      // Coil a stone in his wall (`stone`: no face); Riffle's string of fish, and his ears are the Tap
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'stone', 'neutral', 'gap', 'right', { size: 1.45 }), c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'right'), c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'string', tap: 'ears' })], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY, THE TAP PICTURE. In the cool dark at the back of the Old Bridge, beside the stone leg, Sprinkle sits up in her nook with her eyes on Riffle’s reed string of fish, and our cat leans toward the otter with a secret; a small inset shows the empty bank it checked first, with no ginger ears on it. In play Riffle’s small round ears glow softly; one tap whispers in them and turns the page. Captions top left.',
      caption: ['At the Old Bridge, you check the bank first. No ginger ears.', 'Riffle is there, with fish for Sprinkle.'],
      scratch: { tap: 'ears', prompt: '**Tap** to whisper in Riffle’s ear.', label: 'Whisper in Riffle’s ear.', next: 'f027' }
    },

    f027: {
      // he drops a fish: the string is gone from his paws (the fish itself is not drawn)
      when: KEPT,
      scene: S('bridge', 'wall', {},
        [c('coil', 'stone', 'neutral', 'gap', 'right'), c('player', 'sit', 'wonder', 'back-left', 'right'),
         c('riffle', 'stand', 'shout', 'back-right', 'left'), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, BY THE STONE LEG, THE KEPT PATH ONLY, COMEDY BEAT. Riffle has dropped his fish and stands bolt upright with his whiskers out, squeaking the news far too loudly, and our cat winces; Sprinkle’s head leans in from the right. One stone low in the wall seems to listen. His balloon a squeak, the capitals huge.',
      say: [{ who: 'riffle', text: 'A TUNNEL? Under your PILE?', kind: 'shout' }],
      next: 'f028'
    },

    f028: {
      // Coil, a stone in his wall again, labelled “Coil” (chapter 7's call)
      when: KEPT,
      scene: S('bridge', 'wall', {},
        [c('coil', 'stone', 'neutral', 'gap', 'right'), c('player', 'sit', 'shy', 'back-left', 'left'),
         c('riffle', 'hush', 'shy', 'back-right', 'left'), c('sprinkle', 'sit', 'shy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, BY THE STONE LEG, THE KEPT PATH ONLY, COMEDY BEAT. One rounded stone low in the wall says a single polite word, and everyone freezes; Riffle clamps a webbed paw over his own mouth and squeaks the last word through it. Sprinkle tucks her chin in. The stone’s balloon small; Riffle’s a tiny whisper.',
      say: [
        { who: 'coil', name: 'Coil', text: 'Quietly.' },
        { who: 'riffle', text: '…pile.', kind: 'whisper' }
      ],
      next: 'f029'
    },

    f029: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'stone', 'neutral', 'gap', 'right', { size: 1.45 }), c('sprinkle', 'sit', 'worried', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'right'), c('riffle', 'stand', 'proud', 'back-right', 'left')], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY. Riffle puffs out his chest and whispers his granny’s news with great importance, already sure he is coming tonight; a small inset shows a high bank full of round holes. Sprinkle leans out of her nook, worried and eager at once. His balloon a loud whisper; hers soft.',
      say: [
        { who: 'riffle', text: 'Granny says the bank by the tracks is full of holes. Something RUDE lives in them. I’m COMING!', kind: 'whisper' },
        { who: 'sprinkle', text: 'Be careful. And come back and TELL me.' }
      ],
      next: 'f030'
    },

    /* ------------------------------------------------------------------ The night trail */

    f030: {
      // written once: on the told path Tallyheart is already behind the back row
      scene: S('pile', 'wide', DUSK,
        [c('clancat', 'sit', 'neutral', 'crowd-2', 'right', { variant: 4 }), c('clancat', 'walk', 'neutral', 'beside', 'right', { variant: 2 }),
         c('clancat', 'sit', 'neutral', 'crowd-3', 'right', { variant: 3 }), c('player', 'stand', 'wonder', 'pile-left', 'right')], ['dusk']),
      board: 'WIDE, DUSK, THE TAP PICTURE. The sun is going down over the pile and the first guards pad out to their places round the front, all facing out over the camp; high in the sky a bright half moon is already out, and the camp begins to turn silver. Our cat stands alone at the left end of the rows. In play the back row glows softly; one tap slips our cat round behind it and turns the page. Captions top left.',
      caption: ['The sun goes down, and the first guards take their places, facing out.', 'High in the sky, the moon is already out: a bright half moon. The camp turns silver.'],
      scratch: { tap: 'back', prompt: '**Tap** to slip round the back.', label: 'Slip round the back.', next: 'f031' }
    },

    f031: {
      when: TOLD,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'stand', 'wonder', 'rear-1', 'right'), c('tallyheart', 'sit', 'kind', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, NIGHT, THE TOLD PATH ONLY. Behind the back row the roots are lifted and the round dark mouth of the tunnel shows in the dug earth, moonlight on the heap; Tallyheart is already waiting beside it, and our cat pads up to her. The guards are small shapes at the front, facing out. One caption at the top.',
      caption: ['Behind the back row, Tallyheart is waiting by the round, dark hole.'],
      next: 'f032'
    },

    f032: {
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'stand', 'wonder', 'rear-1', 'right'), c('riffle', 'stand', 'happy', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, NIGHT, THE KEPT PATH ONLY. Behind the back row a wet otter nose has pushed through the hedge, and Riffle stands grinning beside the round dark mouth of the tunnel in the dug earth, moonlight on the heap; our cat pads up to him. The guards are small shapes at the front, facing out. Captions top left.',
      caption: ['Behind the back row, a wet nose pokes through the hedge. Riffle!', 'And there’s the round, dark hole, under the roots.'],
      next: 'f033'
    },

    f033: {
      when: TOLD,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'wonder', 'rear-1', 'right'), c('tallyheart', 'sit', 'proud', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE TOLD PATH ONLY. Tallyheart sits across the open mouth from our cat and lays out the night’s two ways as if they were a sum to choose from; a small inset shows a dark tunnel on one side and a fence with three sleeping dogs on the other. Her balloon a whisper.',
      say: [{ who: 'tallyheart', text: 'Two ways to the tracks. Through their tunnel, or around the Barking Field. Your trail. You choose.', kind: 'whisper' }],
      next: 'f034'
    },

    f034: {
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'wonder', 'rear-1', 'right'), c('riffle', 'stand', 'proud', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE KEPT PATH ONLY. Riffle stands across the open mouth from our cat and lays out the night’s two ways in a loud whisper; a small inset shows a dark tunnel on one side and a fence with three sleeping dogs on the other. His balloon a whisper.',
      say: [{ who: 'riffle', text: 'Two ways to the tracks. Through the tunnel, or around the Barking Field.', kind: 'whisper' }],
      next: 'f035'
    },

    f035: {
      // his head at the mouth's right rim: Riffle at `poke`, on all fours
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'happy', 'rear-1', 'right'), c('riffle', 'scramble', 'happy', 'poke', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE KEPT PATH ONLY, COMEDY BEAT. Riffle drops onto all fours and pokes his long head right up to the mouth of the tunnel, sniffing, his whole body wriggling with pride at how bendy he is; our cat watches, amused. Caption top left; his balloon a cheerful boast.',
      caption: ['He pokes his head in.'],
      say: [{ who: 'riffle', text: 'I’d fit. Otters are bendy.' }],
      next: 'f036'
    },

    f036: {
      // the route, written once at the mouth: our cat at the brink, the mouth the width of her shoulders.
      // It sets nothing: nothing after the weasel holes reads which way she went
      scene: S('pile', 'hole', EVE,
        [c('player', 'crouch', 'wonder', 'brink', 'right')], ['night']),
      board: 'CLOSE-UP, AT CAT HEIGHT, THE CHOICE. Our cat crouches at the brink of the round dark hole in the dug earth, and the mouth is about as wide as its own shoulders; moonlight lies on the heap and the roots hang lifted above. Its tail twitches as it decides. Captions top left, by her worry; the choices sit below the panel.',
      caption: [
        { when: SMALL, text: 'A small cat could just squeeze in. A small cat like you.' },
        { when: { worry: 'water' }, text: 'Neither way is wet. You check twice.' }
      ],
      choice: {
        options: [
          { label: '“Through the tunnel.”', sets: {}, next: 'f037' },
          { label: '“Around the Barking Field.”', sets: {}, next: 'f052' }
        ]
      }
    },

    /* ------------------------------------------------------------------ Through the tunnel: f037…f051.
     * The friend is in no `crawl` panel of the told path: Tallyheart goes over the top, and her counting
     * and the dogs' snores are lettered from above, never drawn. Every tunnel panel is inside the tunnel. */

    f037: {
      // her nose at the mouth's right rim, her shoulders far wider than it (she cannot put her head in:
      // the art puts no head inside a hole); the mouth's box, clear of her head, is the Tap
      when: TOLD,
      scene: S('pile', 'rear', MOUTH,
        guards().concat([c('player', 'stand', 'wonder', 'rear-1', 'right'), c('tallyheart', 'crouch', 'proud', 'poke', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TUNNEL’S MOUTH, THE TOLD PATH ONLY, THE TAP PICTURE. Tallyheart crouches with her nose right at the rim of the mouth, her big ginger shoulders far too wide for it, and gives a wry, knowing smile at herself; our cat stands ready on the other side. In play the dark mouth glows softly; one tap wriggles our cat in, head, shoulders, tail, and turns the page. Captions top left; her balloon a whisper.',
      caption: ['Tallyheart pokes her head in, just to see. Her shoulders stick.'],
      say: [{ who: 'tallyheart', text: 'Hmph. Just as I thought. You go under. I’ll go over. Listen for me.', kind: 'whisper' }],
      scratch: { tap: 'mouth', prompt: '**Tap** to wriggle in.', label: 'Wriggle in.', next: 'f038' }
    },

    f038: {
      when: KEPT,
      scene: S('pile', 'rear', MOUTH,
        guards().concat([c('player', 'stand', 'wonder', 'rear-1', 'right'), c('riffle', 'stand', 'happy', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TUNNEL’S MOUTH, THE KEPT PATH ONLY, THE TAP PICTURE. Riffle bows our cat toward the round dark mouth with a sweep of his paw, very polite, very excited; our cat stands ready at its edge. In play the dark mouth glows softly; one tap wriggles our cat in first, head, shoulders, tail, and turns the page. His balloon a whisper.',
      say: [{ who: 'riffle', text: 'You first. You found it!', kind: 'whisper' }],
      scratch: { tap: 'mouth', prompt: '**Tap** to wriggle in.', label: 'Wriggle in.', next: 'f039' }
    },

    f039: {
      // written once: our cat alone; the noticing cat's prints open the next panel (no panel holds five boxes)
      scene: S('tracks', 'crawl', {},
        [c('player', 'crouch', 'wonder', 'crawl-1', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, AT CAT HEIGHT. Our cat crawls along a tunnel of dark earth just wide enough for it, the roof low over its ears and roots hanging down; everything is dim blue-grey, but its eyes are wide and it can see. Faint tiny prints run both ways on the soft floor. Captions in a column at the top.',
      caption: [
        'Inside, it’s just wide enough for you. And dark.',
        'But cats see well in the dark, even pillow cats.',
        'Roots. Earth. And the smell of mice.',
        { when: SMALL, text: 'You fit PERFECTLY. Small cats fit where big cats can’t!' }
      ],
      next: 'f040'
    },

    f040: {
      // sitting up under the roots: her raised forepaw at the roof is the Tap
      when: TOLD,
      scene: S('tracks', 'crawl', {},
        [c('player', 'pawup', 'wonder', 'crawl-1', 'right', { tap: 'paw' })], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE TOLD PATH ONLY, THE TAP PICTURE. Our cat sits up as far as the low roof lets it and lifts one forepaw to the hanging roots overhead, listening hard, wondering if anybody is up there. In play its raised paw glows softly; one tap taps the roof, ever so softly, and turns the page. Captions top left, the first for a noticing cat.',
      caption: [
        { when: NOTICING, text: 'In the soft earth: tiny prints, coming and going.' },
        'Is Tallyheart still up there?'
      ],
      scratch: { tap: 'paw', prompt: '**Tap** the roof, softly.', label: 'Tap the roof.', next: 'f041' }
    },

    f041: {
      when: TOLD,
      scene: S('tracks', 'crawl', {},
        [c('player', 'crouch', 'laugh', 'crawl-1', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE TOLD PATH ONLY. Our cat crawls on with a wide grin in the dark, its ears tipped up toward the roof, where very faint numbers drift down through the earth from a big cat walking overhead; nobody else is drawn. Captions at the top, the counting lettered small and pale as if from far above.',
      caption: ['From above, very faint: “Forty-one. Forty-two. Forty-three…”', 'It’s Tallyheart, counting her pawsteps over your head. You grin in the dark.'],
      next: 'f042'
    },

    f042: {
      // the tunnel narrows behind her: the earth's lip over Riffle's back half; his forepaw is the Tap
      when: KEPT,
      scene: S('tracks', 'crawl', { tight: true },
        [c('player', 'crouch', 'worried', 'crawl-1', 'left'), c('riffle', 'scramble', 'worried', 'crawl-2', 'right', { tap: 'paw' })], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE KEPT PATH ONLY, THE TAP PICTURE. Riffle has poured into the tunnel after our cat like water down a drain, but where it narrows behind it he is stuck fast, front half wriggling, back half wedged in the earth, and our cat turns round to him. In play his near forepaw glows softly; one tap tugs him through and turns the page. Captions top left; his balloon a small whisper.',
      caption: [
        { when: NOTICING, text: 'In the soft earth: tiny prints, coming and going.' },
        'Riffle comes in after you. He doesn’t squeeze. He POURS. Then:'
      ],
      say: [{ who: 'riffle', text: 'Um. I’m stuck.', kind: 'whisper' }],
      scratch: { tap: 'paw', prompt: '**Tap** to pull Riffle through.', label: 'Pull Riffle through.', next: 'f043' }
    },

    f043: {
      when: KEPT,
      scene: S('tracks', 'crawl', {},
        [c('player', 'crouch', 'laugh', 'crawl-1', 'left'), c('riffle', 'scramble', 'laugh', 'crawl-2', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE KEPT PATH ONLY, COMEDY BEAT. Riffle shoots free of the narrow bit with a POP and lands flat in a heap of loose earth behind our cat, gasping and grinning; little clods bounce off the walls. The POP! bursts across the tunnel; his balloon breathless.',
      say: [{ who: 'riffle', text: 'Otters are bendy. Mostly.' }],
      sfx: 'POP!',
      next: 'f044'
    },

    f044: {
      when: KEPT,
      scene: S('tracks', 'crawl', {},
        [c('player', 'crouch', 'solemn', 'crawl-1', 'right'), c('riffle', 'scramble', 'happy', 'crawl-2', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE KEPT PATH ONLY, COMEDY BEAT. Our cat crawls on in front with a long-suffering face, and Riffle bounces along behind it on all fours asking the same question again and again. The tunnel goes on and on into the blue-grey dark. Three small balloons, his, its, his.',
      say: [
        { who: 'riffle', text: 'Are we nearly there?' },
        { who: 'player', text: 'No.' },
        { who: 'riffle', text: 'Are we nearly there NOW?' }
      ],
      next: 'f045'
    },

    f045: {
      // the fork, told: a choice only the told path sees; the kept path is turned to its own (`else`)
      when: TOLD, else: 'f047',
      scene: S('tracks', 'fork', {},
        [c('player', 'crouch', 'wonder', 'fork-1', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE FORK, THE TOLD PATH ONLY. The low tunnel splits in two in front of our cat, two small dark ways, each just wide enough for it, with a root hanging between them, and our cat stops at the split, whiskers forward; faint numbers drift down through the roof from far above. Captions top left, the counting small and pale; the choices sit below the panel.',
      caption: ['The tunnel splits in two. Which way?', 'Far above: “A hundred and ten. A hundred and eleven…” Tallyheart is still counting.'],
      choice: {
        options: [
          { label: 'Sniff the left way.', sets: {}, next: 'f046a' },
          { label: 'Sniff the right way.', sets: {}, next: 'f046b' }
        ]
      }
    },

    f046a: {
      scene: S('tracks', 'fork', { worm: true },
        [c('player', 'crouch', 'sniff', 'fork-1', 'left')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE FORK, COMEDY BEAT. Our cat sticks its nose into the left way and wrinkles it; one pink worm pokes out of the earth wall right in front of its face and waves. Nothing else is down there at all. One caption at the top.',
      caption: ['Worms. Just worms. The other way, then!'],
      next: 'f047'
    },

    f046b: {
      scene: S('tracks', 'fork', {},
        [c('player', 'crouch', 'happy', 'fork-1', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE FORK. Our cat sticks its nose into the right way and its whole face lights up: faint curls of mouse smell drift out of the dark, lots of them. Its tail goes up. One caption at the top.',
      caption: ['Mice! LOTS of mice. This way!'],
      next: 'f047'
    },

    f047: {
      when: KEPT, else: 'f049',
      scene: S('tracks', 'fork', {},
        [c('player', 'crouch', 'wonder', 'fork-1', 'left'), c('riffle', 'scramble', 'wonder', 'fork-2', 'left')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE FORK, THE KEPT PATH ONLY. The low tunnel splits in two in front of our cat, two small dark ways, each just wide enough for it, with a root hanging between them, and our cat stops at the split, whiskers forward; Riffle, close behind, bumps into its tail. One caption at the top; the choices sit below the panel.',
      caption: ['The tunnel splits in two. Which way?'],
      choice: {
        options: [
          { label: 'Sniff the left way.', sets: {}, next: 'f048a' },
          { label: 'Sniff the right way.', sets: {}, next: 'f048b' }
        ]
      }
    },

    f048a: {
      scene: S('tracks', 'fork', { worm: true },
        [c('player', 'crouch', 'sniff', 'fork-1', 'left'), c('riffle', 'scramble', 'laugh', 'fork-2', 'left')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE FORK, COMEDY BEAT. Our cat sticks its nose into the left way and wrinkles it; one pink worm pokes out of the earth wall right in front of its face and waves, and Riffle, behind, snorts with laughter. Nothing else is down there at all. One caption at the top.',
      caption: ['Worms. Just worms. The other way, then!'],
      next: 'f049'
    },

    f048b: {
      scene: S('tracks', 'fork', {},
        [c('player', 'crouch', 'happy', 'fork-1', 'right'), c('riffle', 'scramble', 'happy', 'fork-2', 'left')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, THE FORK. Our cat sticks its nose into the right way and its whole face lights up: faint curls of mouse smell drift out of the dark, lots of them, and Riffle, behind, licks his lips. Its tail goes up. One caption at the top.',
      caption: ['Mice! LOTS of mice. This way!'],
      next: 'f049'
    },

    f049: {
      // the dogs over her head, heard, never drawn: their sleep-talk lettered as captions
      scene: S('tracks', 'crawl', {},
        [c('player', 'crouch', 'wonder', 'crawl-1', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE TUNNEL, AT CAT HEIGHT. Our cat freezes mid-crawl and rolls its eyes up at the roof, where muffled, doggy snoring rumbles down through the roots; a small inset shows three dogs asleep in a heap on the grass right above. Nothing else is drawn. Captions in a column, the sleep-talk wobbly and small.',
      caption: [
        'On and on you go. Then, right over your head, something snores. Something doggy.',
        '“Mmmf. Squirrel,” it mumbles. “Who’s a Good Boy? ME.”',
        '“Drop it,” mumbles another. “That’s my NAME.”',
        'You’re right under the Barking Field!'
      ],
      next: 'f050'
    },

    f050: {
      // wriggling out: the end hole's lip over her back half, head and shoulders out
      when: TOLD,
      scene: S('tracks', 'wide', NIGHT_SKY,
        [c('player', 'crouch', 'happy', 'tunnel-end', 'right'), c('tallyheart', 'sit', 'proud', 'foot-2', 'left')], ['night']),
      board: 'WIDE, THE RAILWAY BANK, NIGHT, THE TOLD PATH ONLY. Our cat wriggles out of a hole at the foot of a high grassy bank into the silver moonlight, and two long rails shine on top of it; Tallyheart is sitting right there in the grass at the bank’s foot, very pleased with her number. The half moon hangs high. Caption top left; her balloon a proud whisper.',
      caption: ['At last: moonlight! You wriggle out at the foot of a high bank. So THAT’S where it comes out!', 'Tallyheart is sitting right there.'],
      say: [{ who: 'tallyheart', text: 'Three hundred and twelve pawsteps. And I tiptoed round the dogs.', kind: 'whisper' }],
      next: 'f051'
    },

    f051: {
      when: KEPT,
      scene: S('tracks', 'wide', NIGHT_SKY,
        [c('player', 'sit', 'stern', 'foot-1', 'left'), c('riffle', 'scramble', 'happy', 'tunnel-end', 'right')], ['night']),
      board: 'WIDE, THE RAILWAY BANK, NIGHT, THE KEPT PATH ONLY, COMEDY BEAT. Our cat is out at the foot of a high grassy bank in the silver moonlight, two long rails shining on top of it, and Riffle pops out of the hole behind it with earth on his nose and his paws flung wide. Our cat turns and shushes him fiercely. Captions top left; his balloon a shout, its a hiss.',
      caption: ['At last: moonlight! You wriggle out at the foot of a high bank. So THAT’S where it comes out!', 'Riffle pops out behind you, earth on his nose.'],
      say: [
        { who: 'riffle', text: 'Ta-DA!', kind: 'shout' },
        { who: 'player', text: 'SHH!', kind: 'whisper' }
      ],
      next: 'f093'
    },

    /* ------------------------------------------------------------------ Around the Barking Field: f052…f079.
     * The friend walks beside her on the path; the close shots of the dogs at the fence (`dogs`) are
     * written once, with no cat in them. Home is to the left and the tracks to the right on every field
     * camera: the trail out faces right. */

    f052: {
      when: TOLD,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'walk', 'wonder', 'rear-1', 'right'), c('tallyheart', 'stand', 'kind', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE FIELD ROUTE, THE TOLD PATH ONLY. Our cat steps away from the round dark mouth toward the hedge, and Tallyheart gets up to go with it, laying down the one rule for the night. The guards are small shapes at the front. Her balloon a firm whisper.',
      say: [{ who: 'tallyheart', text: 'Then we go together. Round the near side. Not one paw past the post.', kind: 'whisper' }],
      next: 'f053'
    },

    f053: {
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'walk', 'wonder', 'rear-1', 'right'), c('riffle', 'stand', 'stern', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, THE FIELD ROUTE, THE KEPT PATH ONLY. Our cat steps away from the round dark mouth toward the hedge, and Riffle, for once the sensible one, lays down the one rule for the night with his chin up. The guards are small shapes at the front. His balloon a firm whisper.',
      say: [{ who: 'riffle', text: 'Round the near side. Not one paw past the post.', kind: 'whisper' }],
      next: 'f054'
    },

    f054: {
      when: TOLD,
      scene: S('field', 'wide', NIGHT_SKY,
        [c('dog', 'lie', 'sleepy', 'heap-1', 'left', { variant: 1, asleep: true }), c('dog', 'lie', 'sleepy', 'heap-2', 'left', { variant: 2, asleep: true }),
         c('dog', 'lie', 'sleepy', 'heap-3', 'left', { variant: 3, asleep: true }),
         c('player', 'walk', 'wonder', 'path-left', 'right'), c('tallyheart', 'walk', 'kind', 'path-right', 'right')], ['night', 'zzz']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, THE TOLD PATH ONLY. The whole field is silver in the moonlight, the wire and the path shining, and inside the fence three dogs lie asleep in one heap, snoring; on the path our cat and Tallyheart walk right, toward the tracks, without a sound. The half moon hangs over the towers. Captions top left; the snores lettered over the heap.',
      caption: ['The Barking Field is silver in the moonlight.', 'Inside the fence, three dogs are asleep in a heap.', 'Tallyheart pads beside you, quiet as moss.'],
      sfx: 'Snore. Snore. Snore.',
      next: 'f055'
    },

    f055: {
      when: KEPT,
      scene: S('field', 'wide', NIGHT_SKY,
        [c('dog', 'lie', 'sleepy', 'heap-1', 'left', { variant: 1, asleep: true }), c('dog', 'lie', 'sleepy', 'heap-2', 'left', { variant: 2, asleep: true }),
         c('dog', 'lie', 'sleepy', 'heap-3', 'left', { variant: 3, asleep: true }),
         c('player', 'walk', 'wonder', 'path-left', 'right'), c('riffle', 'scramble', 'solemn', 'path-right', 'right')], ['night', 'zzz']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, THE KEPT PATH ONLY. The whole field is silver in the moonlight, the wire and the path shining, and inside the fence three dogs lie asleep in one heap, snoring; on the path our cat and Riffle go right, toward the tracks, Riffle on all fours with his mouth clamped shut. Captions top left; the snores lettered over the heap.',
      caption: ['The Barking Field is silver in the moonlight.', 'Inside the fence, three dogs are asleep in a heap.', 'Riffle pads beside you, not saying a word. For once.'],
      sfx: 'Snore. Snore. Snore.',
      next: 'f056'
    },

    f056: {
      // the biggest dog's head up out of the heap (`lie` is head on forepaws); the other two still asleep
      when: TOLD,
      scene: S('field', 'wide', NIGHT_SKY,
        [c('dog', 'sit', 'shout', 'heap-1', 'left', { variant: 1 }), c('dog', 'lie', 'sleepy', 'heap-2', 'left', { variant: 2, asleep: true }),
         c('dog', 'lie', 'sleepy', 'heap-3', 'left', { variant: 3, asleep: true }),
         c('player', 'stand', 'scared', 'path-left', 'right'), c('tallyheart', 'stand', 'worried', 'path-right', 'right')], ['night']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, THE TOLD PATH ONLY. One shaggy head jerks up out of the sleeping heap, ears high, and our cat and Tallyheart freeze mid-step on the silver path. The other two dogs are still snoring. Caption top left; his balloon a bark.',
      caption: ['One ear twitches.'],
      say: [{ who: 'dog', text: 'WHO’S THERE?', kind: 'shout' }],
      next: 'f057'
    },

    f057: {
      when: KEPT,
      scene: S('field', 'wide', NIGHT_SKY,
        [c('dog', 'sit', 'shout', 'heap-1', 'left', { variant: 1 }), c('dog', 'lie', 'sleepy', 'heap-2', 'left', { variant: 2, asleep: true }),
         c('dog', 'lie', 'sleepy', 'heap-3', 'left', { variant: 3, asleep: true }),
         c('player', 'stand', 'scared', 'path-left', 'right'), c('riffle', 'scramble', 'scared', 'path-right', 'right')], ['night']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, THE KEPT PATH ONLY. One shaggy head jerks up out of the sleeping heap, ears high, and our cat and Riffle freeze mid-step on the silver path. The other two dogs are still snoring. Caption top left; his balloon a bark.',
      caption: ['One ear twitches.'],
      say: [{ who: 'dog', text: 'WHO’S THERE?', kind: 'shout' }],
      next: 'f058'
    },

    f058: {
      // written once: the three at the fence, their balloons the shaggy, the spotty and the tiny one's
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'jump', 'shout', 'dog-1', 'right', { variant: 1 }), c('dog', 'bounce', 'shout', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'bounce', 'shout', 'dog-3', 'left', { variant: 3 })], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, ACTION. All three dogs come bounding to the wire at once, shaggy, spotty and tiny, paws up on the fence and noses through it, barking their heads off at the path; the wire rattles. Nobody can tell which of them is cleverest. Three balloons, barked.',
      say: [
        { who: 'dog', text: 'A SQUIRREL!', kind: 'shout' },
        { who: 'dog', text: 'It’s a CAT.' },
        { who: 'dog', text: 'A cat is just a BIG squirrel!', kind: 'shout' }
      ],
      next: 'f059'
    },

    f059: {
      // their names: from here on their balloons carry them (the tiny one keeps his label)
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'sit', 'proud', 'dog-1', 'right', { variant: 1 }), c('dog', 'sit', 'proud', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'howl', 'shout', 'dog-3', 'left', { variant: 3 })], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, COMEDY BEAT. The biggest, shaggiest dog sits up tall and announces himself, enormously proud, and the spotty one copies him at once; the tiny one just throws back his head and barks at the moon. Two balloons, proud barks.',
      say: [
        { who: 'dog', name: 'Good Boy', text: 'I’m GOOD BOY! That’s my NAME!', kind: 'shout' },
        { who: 'dog', name: 'Drop It', text: 'I’m DROP IT!', kind: 'shout' }
      ],
      next: 'f060'
    },

    f060: {
      when: TOLD,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'proud', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'proud', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'howl', 'shout', 'dog-3', 'right', { variant: 3 }),
         c('player', 'sit', 'laugh', 'path-left', 'right'), c('tallyheart', 'sit', 'kind', 'path-right', 'left')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, THE TOLD PATH ONLY. The tiny dog behind the wire keeps barking at nothing, and on the path our cat leans to Tallyheart and whispers the joke behind one paw; a small inset shows a Tall One at a back door shouting at a dog with a slipper in its mouth. Tallyheart’s whiskers twitch. Caption top left; our cat’s balloon a whisper.',
      caption: ['The third one just barks. He forgets his name a lot.'],
      say: [{ who: 'player', text: 'That’s what their Tall Ones shout at them all day. So that’s what they think their names are.', kind: 'whisper' }],
      next: 'f061'
    },

    f061: {
      when: KEPT,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'proud', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'proud', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'howl', 'shout', 'dog-3', 'right', { variant: 3 }),
         c('player', 'sit', 'laugh', 'path-left', 'right'), c('riffle', 'sit', 'laugh', 'path-right', 'left')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, THE KEPT PATH ONLY. The tiny dog behind the wire keeps barking at nothing, and on the path our cat leans to Riffle and whispers the joke behind one paw; a small inset shows a Tall One at a back door shouting at a dog with a slipper in its mouth. Riffle has to hold his nose not to laugh. Caption top left; our cat’s balloon a whisper.',
      caption: ['The third one just barks. He forgets his name a lot.'],
      say: [{ who: 'player', text: 'That’s what their Tall Ones shout at them all day. So that’s what they think their names are.', kind: 'whisper' }],
      next: 'f062'
    },

    f062: {
      // the hollow log: written once, from the path (the cats are where we look from). The first option
      // leads to Hail's scene (f080…f092); a cat who has found her reads it her way. “Not tonight.” sets nothing
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'stand', 'wonder', 'dog-1', 'right', { variant: 1 }), c('dog', 'sit', 'wonder', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'wonder', 'dog-3', 'left', { variant: 3 }), c('hail', 'peek', 'wonder', 'log', 'left')], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, THE CHOICE. Behind the three dogs at the wire, far inside the field, a white head with grey speckles pops up out of the dark mouth of a hollow log, round eyes shining with delight at the sight of visitors. The dogs have not noticed. Caption top left; her balloon bright; the choices sit below the panel.',
      caption: ['From the hollow log far inside the fence, a white head pops up.'],
      say: [{ who: 'hail', name: 'A white head', text: 'Ooh! Visitors!' }],
      choice: {
        options: [
          { label: '“Who’s in the log?”', labelWhen: [{ when: HAIL, label: '“Go and see Hail again.”' }], sets: {}, next: 'f080' },
          { label: '“Not tonight. Keep going.”', sets: {}, next: 'f063' }
        ]
      }
    },

    f063: {
      scene: S('field', 'wide', NIGHT_SKY,
        [c('dog', 'stand', 'neutral', 'dog-1', 'right', { variant: 1 }), c('dog', 'sit', 'neutral', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'sleepy', 'dog-3', 'left', { variant: 3 })], ['night']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT. Far inside the fence the hollow log lies dark and empty again in the moonlight, the white head gone; the three dogs stand along the wire still peering at the path. The silver path runs on to the right. One caption at the top.',
      caption: ['The white head ducks back in.'],
      next: 'f064'
    },

    /* The way past the dogs: a chain, each panel only for its specialty, each ending on the slip-past
     * Tap (the path's own mark), each Tap leading to the next panel of the chain (passed over when it is
     * not hers) and the last to the weasel holes (f093). The friend is beside her all the way (brief, call
     * 11), so every panel is a told and a kept twin, Tallyheart or Riffle in the picture, the lines the same:
     * the sneak (f064/f065), the fence top (f066/f067), hello (f068–f070 told, f071–f073 kept), the fetch
     * (f074–f076 told, f077–f079 kept). */

    f064: {
      // the friend flat behind her at the path's edge, both creeping toward the tracks
      when: SNEAK_TOLD,
      scene: S('field', 'dogs', PATH,
        [c('dog', 'stand', 'sniff', 'dog-1', 'right', { variant: 1 }), c('dog', 'stand', 'sniff', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'stand', 'sniff', 'dog-3', 'left', { variant: 3 }), c('tallyheart', 'flat', 'solemn', 'path-left', 'right'), c('player', 'flat', 'wonder', FLAT, 'right')], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, A SNEAKING CAT ONLY, THE TOLD PATH, THE TAP PICTURE. Our cat lies flat as a shadow in the silver grass at the edge of the path, Tallyheart pressed flat behind it, and behind the wire three dogs sniff and sniff at the air, noses everywhere but the right place. In play the path ahead glows softly; one tap slips our cat past and turns the page. Caption top left; his balloon baffled.',
      caption: ['You drop flat in the grass. Your paws go silent. The dogs sniff and sniff.'],
      say: [{ who: 'dog', name: 'Good Boy', text: 'Where did the squirrel GO?' }],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f065' }
    },

    f065: {
      when: SNEAK_KEPT,
      scene: S('field', 'dogs', PATH,
        [c('dog', 'stand', 'sniff', 'dog-1', 'right', { variant: 1 }), c('dog', 'stand', 'sniff', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'stand', 'sniff', 'dog-3', 'left', { variant: 3 }), c('riffle', 'scramble', 'worried', 'path-left', 'right'), c('player', 'flat', 'wonder', FLAT, 'right')], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, A SNEAKING CAT ONLY, THE KEPT PATH, THE TAP PICTURE. Our cat lies flat as a shadow in the silver grass at the edge of the path, Riffle low on all fours behind it, holding his breath, and behind the wire three dogs sniff and sniff at the air, noses everywhere but the right place. In play the path ahead glows softly; one tap slips our cat past and turns the page. Caption top left; his balloon baffled.',
      caption: ['You drop flat in the grass. Your paws go silent. The dogs sniff and sniff.'],
      say: [{ who: 'dog', name: 'Good Boy', text: 'Where did the squirrel GO?' }],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f066' }
    },

    f066: {
      // nobody watches the ground: the friend pads past on the path below her
      when: CLIMB_TOLD,
      scene: S('field', 'wide', PATH,
        [c('dog', 'jump', 'shout', 'dog-1', 'right', { variant: 1 }), c('dog', 'jump', 'shout', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'jump', 'shout', 'dog-3', 'left', { variant: 3 }), c('player', 'walk', 'proud', 'fence-top', 'right'),
         c('tallyheart', 'walk', 'kind', 'path-right', 'right')], ['night']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, A CLIMBING CAT ONLY, THE TOLD PATH, THE TAP PICTURE. Our cat walks along the top rail of the fence against the starry sky, light as a leaf, tail high, while below it three dogs leap and bark at its tail and never once look at the ground, where Tallyheart pads quietly along the path. In play the path ahead glows softly; one tap slips our cat past and turns the page. Captions top left.',
      caption: ['Up onto the fence top you go, and along it, light as a leaf. Dogs can’t climb!', 'All three bark at your tail, and nobody watches the ground.'],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f067' }
    },

    f067: {
      when: CLIMB_KEPT,
      scene: S('field', 'wide', PATH,
        [c('dog', 'jump', 'shout', 'dog-1', 'right', { variant: 1 }), c('dog', 'jump', 'shout', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'jump', 'shout', 'dog-3', 'left', { variant: 3 }), c('player', 'walk', 'proud', 'fence-top', 'right'),
         c('riffle', 'scramble', 'solemn', 'path-right', 'right')], ['night']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, A CLIMBING CAT ONLY, THE KEPT PATH, THE TAP PICTURE. Our cat walks along the top rail of the fence against the starry sky, light as a leaf, tail high, while below it three dogs leap and bark at its tail and never once look at the ground, where Riffle slinks along the path on all fours with his mouth clamped shut. In play the path ahead glows softly; one tap slips our cat past and turns the page. Captions top left.',
      caption: ['Up onto the fence top you go, and along it, light as a leaf. Dogs can’t climb!', 'All three bark at your tail, and nobody watches the ground.'],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f068' }
    },

    f068: {
      // the friend sits back on the path behind her, ears up
      when: FRIENDS_TOLD,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'stand', 'wonder', 'dog-1', 'left', { variant: 1 }), c('dog', 'stand', 'wonder', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'stand', 'wonder', 'dog-3', 'right', { variant: 3 }), c('tallyheart', 'sit', 'wonder', 'path-left', 'right'), c('player', 'pawup', 'happy', 'path-right', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, A FRIENDLY CAT ONLY, THE TOLD PATH. Our cat walks right up to the wire, lifts one forepaw and waves at the three dogs as if they were old friends, and all three stop dead in astonishment, ears up; behind it on the path Tallyheart sits up, her eyes round. The moon shines on the wire. Its balloon a cheerful call.',
      say: [{ who: 'player', text: 'Hello, dogs!', kind: 'shout' }],
      next: 'f069'
    },

    f069: {
      when: FRIENDS_TOLD,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'sad', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'wonder', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'wonder', 'dog-3', 'right', { variant: 3 }), c('tallyheart', 'sit', 'kind', 'path-left', 'right'), c('player', 'sit', 'kind', 'path-right', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, A FRIENDLY CAT ONLY, THE TOLD PATH. The biggest dog sits down slowly behind the wire, deeply moved, and says the saddest true thing he knows, and the other two nod; our cat sits on the path, listening kindly, and Tallyheart behind it softens too. Caption top left; his balloon soft and amazed.',
      caption: ['The dogs stop.'],
      say: [{ who: 'dog', name: 'Good Boy', text: 'Nobody ever says HELLO to us.' }],
      next: 'f070'
    },

    f070: {
      when: FRIENDS_TOLD,
      scene: S('field', 'fence', PATH,
        [c('dog', 'sit', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'happy', 'dog-3', 'right', { variant: 3 }), c('tallyheart', 'walk', 'happy', 'path-left', 'right'), c('player', 'walk', 'happy', 'path-right', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, A FRIENDLY CAT ONLY, THE TOLD PATH, THE TAP PICTURE. All three dogs sit behind the wire wagging so hard their whole back ends wag too, and our cat trots past them along the silver path, tail up, Tallyheart close behind. In play the path ahead glows softly; one tap slips our cat past and turns the page. One caption at the top.',
      caption: ['While all three wag, you trot past.'],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f071' }
    },

    f071: {
      when: FRIENDS_KEPT,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'stand', 'wonder', 'dog-1', 'left', { variant: 1 }), c('dog', 'stand', 'wonder', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'stand', 'wonder', 'dog-3', 'right', { variant: 3 }), c('riffle', 'sit', 'wonder', 'path-left', 'right'), c('player', 'pawup', 'happy', 'path-right', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, A FRIENDLY CAT ONLY, THE KEPT PATH. Our cat walks right up to the wire, lifts one forepaw and waves at the three dogs as if they were old friends, and all three stop dead in astonishment, ears up; behind it on the path Riffle sits bolt upright, his mouth an O. The moon shines on the wire. Its balloon a cheerful call.',
      say: [{ who: 'player', text: 'Hello, dogs!', kind: 'shout' }],
      next: 'f072'
    },

    f072: {
      when: FRIENDS_KEPT,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'sad', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'wonder', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'wonder', 'dog-3', 'right', { variant: 3 }), c('riffle', 'sit', 'kind', 'path-left', 'right'), c('player', 'sit', 'kind', 'path-right', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, A FRIENDLY CAT ONLY, THE KEPT PATH. The biggest dog sits down slowly behind the wire, deeply moved, and says the saddest true thing he knows, and the other two nod; our cat sits on the path, listening kindly, and Riffle behind it looks quite moved too. Caption top left; his balloon soft and amazed.',
      caption: ['The dogs stop.'],
      say: [{ who: 'dog', name: 'Good Boy', text: 'Nobody ever says HELLO to us.' }],
      next: 'f073'
    },

    f073: {
      when: FRIENDS_KEPT,
      scene: S('field', 'fence', PATH,
        [c('dog', 'sit', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'happy', 'dog-3', 'right', { variant: 3 }), c('riffle', 'scramble', 'happy', 'path-left', 'right'), c('player', 'walk', 'happy', 'path-right', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, A FRIENDLY CAT ONLY, THE KEPT PATH, THE TAP PICTURE. All three dogs sit behind the wire wagging so hard their whole back ends wag too, and our cat trots past them along the silver path, tail up, Riffle bouncing along behind. In play the path ahead glows softly; one tap slips our cat past and turns the page. One caption at the top.',
      caption: ['While all three wag, you trot past.'],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f074' }
    },

    f074: {
      // the flick is over: Tallyheart's paw still up, the pinecone gone over the fence
      when: FETCH_TOLD,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'stand', 'wonder', 'dog-1', 'left', { variant: 1 }), c('dog', 'stand', 'wonder', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'stand', 'wonder', 'dog-3', 'right', { variant: 3 }),
         c('player', 'sit', 'wonder', 'path-left', 'right'), c('tallyheart', 'pawup', 'shout', 'path-right', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, A NOTICING OR SWIMMING CAT ONLY, THE TOLD PATH. Tallyheart’s forepaw is still up from a flick, and a small inset shows a pinecone spinning high over the fence into the field; the three dogs’ heads all turn up after it. Our cat watches, impressed. Caption top left; her balloon a shout.',
      caption: ['Tallyheart flicks a pinecone over the fence.'],
      say: [{ who: 'tallyheart', text: 'FETCH!', kind: 'shout' }],
      next: 'f075'
    },

    f075: {
      when: FETCH_TOLD,
      scene: S('field', 'wide', NIGHT_SKY,
        [c('dog', 'bounce', 'shout', 'ring-1', 'right', { variant: 1 }), c('dog', 'bounce', 'shout', 'ring-2', 'right', { variant: 2 }),
         c('dog', 'bounce', 'happy', 'ring-3', 'left', { variant: 3 }),
         c('player', 'walk', 'laugh', 'path-left', 'right'), c('tallyheart', 'walk', 'proud', 'path-right', 'right')], ['night', 'motion']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, A NOTICING OR SWIMMING CAT ONLY, THE TOLD PATH. Three dogs race away from the fence across the silver field after the pinecone, ears flapping, all trying to get there first, while on the path our cat and Tallyheart walk on. Caption top left; two balloons, both barked.',
      caption: ['Three dogs race after it.'],
      say: [
        { who: 'dog', name: 'Good Boy', text: 'MINE!', kind: 'shout' },
        { who: 'dog', name: 'Drop It', text: 'No, MINE!', kind: 'shout' }
      ],
      next: 'f076'
    },

    f076: {
      when: FETCH_TOLD,
      scene: S('field', 'wide', PATH,
        [c('dog', 'bounce', 'shout', 'ring-1', 'right', { variant: 1 }), c('dog', 'bounce', 'shout', 'ring-2', 'right', { variant: 2 }),
         c('dog', 'sit', 'wonder', 'ring-3', 'left', { variant: 3 }),
         c('player', 'walk', 'happy', 'path-left', 'right'), c('tallyheart', 'walk', 'happy', 'path-right', 'right')], ['night']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, A NOTICING OR SWIMMING CAT ONLY, THE TOLD PATH, THE TAP PICTURE. Far out in the field the two big dogs tussle over the pinecone, getting their own names in a muddle, and the tiny one sits watching them, puzzled; nobody watches the path. In play the path ahead glows softly; one tap slips our cat and Tallyheart past and turns the page. Two balloons, barked.',
      say: [
        { who: 'dog', name: 'Good Boy', text: 'Drop it!', kind: 'shout' },
        { who: 'dog', name: 'Drop It', text: 'I AM Drop It!', kind: 'shout' }
      ],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f077' }
    },

    f077: {
      when: FETCH_KEPT,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'stand', 'wonder', 'dog-1', 'left', { variant: 1 }), c('dog', 'stand', 'wonder', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'stand', 'wonder', 'dog-3', 'right', { variant: 3 }),
         c('player', 'sit', 'wonder', 'path-left', 'right'), c('riffle', 'point', 'laugh', 'path-right', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, A NOTICING OR SWIMMING CAT ONLY, THE KEPT PATH. Riffle’s paw is still out from a flick, and a small inset shows a pebble skipping high over the fence into the field; the three dogs’ heads all turn up after it. Our cat watches, impressed. Caption top left; his balloon a shout.',
      caption: ['Riffle flicks a pebble over the fence.'],
      say: [{ who: 'riffle', text: 'FETCH!', kind: 'shout' }],
      next: 'f078'
    },

    f078: {
      when: FETCH_KEPT,
      scene: S('field', 'wide', NIGHT_SKY,
        [c('dog', 'bounce', 'shout', 'ring-1', 'right', { variant: 1 }), c('dog', 'bounce', 'shout', 'ring-2', 'right', { variant: 2 }),
         c('dog', 'bounce', 'happy', 'ring-3', 'left', { variant: 3 }),
         c('player', 'walk', 'laugh', 'path-left', 'right'), c('riffle', 'scramble', 'proud', 'path-right', 'right')], ['night', 'motion']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, A NOTICING OR SWIMMING CAT ONLY, THE KEPT PATH. Three dogs race away from the fence across the silver field after the pebble, ears flapping, all trying to get there first, while on the path our cat and Riffle go on. Caption top left; two balloons, both barked.',
      caption: ['Three dogs race after it.'],
      say: [
        { who: 'dog', name: 'Good Boy', text: 'MINE!', kind: 'shout' },
        { who: 'dog', name: 'Drop It', text: 'No, MINE!', kind: 'shout' }
      ],
      next: 'f079'
    },

    f079: {
      when: FETCH_KEPT,
      scene: S('field', 'wide', PATH,
        [c('dog', 'bounce', 'shout', 'ring-1', 'right', { variant: 1 }), c('dog', 'bounce', 'shout', 'ring-2', 'right', { variant: 2 }),
         c('dog', 'sit', 'wonder', 'ring-3', 'left', { variant: 3 }),
         c('player', 'walk', 'happy', 'path-left', 'right'), c('riffle', 'scramble', 'happy', 'path-right', 'right')], ['night']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, A NOTICING OR SWIMMING CAT ONLY, THE KEPT PATH, THE TAP PICTURE. Far out in the field the two big dogs tussle over the pebble, getting their own names in a muddle, and the tiny one sits watching them, puzzled; nobody watches the path. In play the path ahead glows softly; one tap slips our cat and Riffle past and turns the page. Two balloons, barked.',
      say: [
        { who: 'dog', name: 'Good Boy', text: 'Drop it!', kind: 'shout' },
        { who: 'dog', name: 'Drop It', text: 'I AM Drop It!', kind: 'shout' }
      ],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f093' }
    },

    /* ------------------------------------------------------------------ The hollow log: f080…f092, the
     * optional scene. Hail is “The speckled dragonet” until “I’m Hail!” (f084), her riddle included; her
     * last screen (f091/f092) sets `foundHail` for good, with the slip-past Tap. */

    f080: {
      // her first appearance: nothing in front of her at the wire (the spotty dog bounds up from far back, by the
      // log, after her), her big round eyes shining (`wonder`), and the BOING lettered up over the trees, off her
      // (`sfxAt`)
      when: TOLD,
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'bounce', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'bounce', 'happy', 'field', 'left', { variant: 2 }),
         c('dog', 'bounce', 'happy', 'dog-3', 'left', { variant: 3 }), c('hail', 'bounce', 'wonder', 'wire', 'left'),
         c('player', 'sit', 'wonder', 'path-left', 'right'), c('tallyheart', 'sit', 'wonder', 'path-right', 'left')], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, THE TOLD PATH ONLY. A little dragonet, white with grey speckles, comes bouncing out of the log and right up to the wire, all four paws off the ground at every hop, nothing in front of her, and the three dogs bound after her, wagging, the spotty one still far back by the log; on the path our cat and Tallyheart stare. The BOING lettered high over the trees, clear of her; captions top left; her balloon a whisper.',
      caption: ['Out bounces a little dragonet, white with grey speckles, right up to the fence.', 'The dogs bound after her, wagging.'],
      say: [{ who: 'tallyheart', text: 'Another one!', kind: 'whisper' }],
      sfx: 'BOING. BOING. BOING.',
      sfxAt: [55, 32],
      next: 'f081'
    },

    f081: {
      when: KEPT,
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'bounce', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'bounce', 'happy', 'field', 'left', { variant: 2 }),
         c('dog', 'bounce', 'happy', 'dog-3', 'left', { variant: 3 }), c('hail', 'bounce', 'wonder', 'wire', 'left'),
         c('player', 'sit', 'wonder', 'path-left', 'right'), c('riffle', 'sit', 'shout', 'path-right', 'left')], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, THE KEPT PATH ONLY. A little dragonet, white with grey speckles, comes bouncing out of the log and right up to the wire, all four paws off the ground at every hop, nothing in front of her, and the three dogs bound after her, wagging, the spotty one still far back by the log; on the path Riffle nearly falls over. The BOING lettered high over the trees, clear of her; captions top left; his balloon a squeak.',
      caption: ['Out bounces a little dragonet, white with grey speckles, right up to the fence.', 'The dogs bound after her, wagging.'],
      say: [{ who: 'riffle', text: 'ANOTHER dragon!', kind: 'shout' }],
      sfx: 'BOING. BOING. BOING.',
      sfxAt: [55, 32],
      next: 'f082'
    },

    f082: {
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('hail', 'tilt', 'wonder', 'wire', 'left'), c('player', 'sit', 'wonder', 'path-left', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT. The speckled dragonet presses her face to the wire, head tilted all the way over, and fires questions at our cat faster than it can blink, staring at its swishing tail; behind her two dogs sit wagging. Her balloon a tumble of questions.',
      say: [{ who: 'hail', text: 'Hello! Are you a cat? I’m a dog. Well, the dogs THINK I’m a dog. Do I look like a dog? Why is your tail so SWISHY? Can I touch it?' }],
      next: 'f083'
    },

    f083: {
      // her riddle: its balloon is said again over the question (the default), the question its own words
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'sit', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'happy', 'dog-3', 'left', { variant: 3 }), c('hail', 'stand', 'proud', 'wire', 'left')], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, THEN THE COUNTS. The speckled dragonet stands proudly at the wire among her three dogs, all four of them in a row with their paws plain on the grass, and offers a riddle like a present. In the Counts picture the three dogs and the dragonet stand side-on, four paws each, none lit; after a miss she hops by fours and their paws light an animal at a time. Her balloon bouncy; the keypad sits below the panel.',
      say: [{ who: 'hail', text: 'Want a riddle? Here’s one! Three dogs, and me. That’s four of us. Four paws each!' }],
      counts: { set: 'ch08-hail', next: 'f084' }
    },

    f084: {
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('hail', 'bounce', 'proud', 'wire', 'left'), c('player', 'sit', 'wonder', 'path-left', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT. The speckled dragonet bounces up and down at the wire and introduces herself with enormous pride, and a small inset shows a misty dragonet under a bridge; our cat leans in and asks the one question that matters. Her balloon a cheerful shout; our cat’s careful.',
      say: [
        { who: 'hail', name: 'Hail', text: 'I’m Hail! Mama says stay where you land. So now I’m a DOG.' },
        { who: 'player', text: 'Are you Sprinkle’s sister?' }
      ],
      next: 'f085'
    },

    f085: {
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'sit', 'wonder', 'dog-1', 'right', { variant: 1 }), c('dog', 'sit', 'wonder', 'dog-3', 'left', { variant: 3 }), c('hail', 'bounce', 'worried', 'wire', 'left'),
         c('player', 'sit', 'kind', BY_WIRE, 'right')], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT. At her sister’s name the speckled dragonet bounces higher and higher at the wire, frantic to know, and the two dogs behind her look at each other; our cat answers her gently and plainly from the path. Her balloon a string of shouts; our cat’s calm.',
      say: [
        { who: 'hail', name: 'Hail', text: 'SPRINKLE? Is she safe? Is she? IS she?', kind: 'shout' },
        { who: 'player', text: 'Under the Old Bridge. She’s safe.' }
      ],
      next: 'f086'
    },

    f086: {
      when: FOUND_ONE,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('hail', 'bounce', 'happy', 'wire', 'left'), c('player', 'sit', 'proud', 'path-left', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, ONLY FOR A CAT WHO HAS FOUND ANOTHER DRAGONET. Our cat says it with a proud little lift of the chin, and the speckled dragonet goes off like a firework at the wire, wanting every single name at once. The dogs wag along. Our cat’s balloon proud; hers a shout.',
      say: [
        { who: 'player', text: 'And I’ve found more of you!' },
        { who: 'hail', name: 'Hail', text: 'MORE? WHO? Tell me EVERYTHING!', kind: 'shout' }
      ],
      next: 'f087'
    },

    f087: {
      // her card: what she saw, given here (her file shows it once her scene is finished, `foundHail`)
      card: 'hail-shapes',
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('hail', 'tilt', 'wonder', 'wire', 'left'), c('player', 'sit', 'wonder', 'path-left', 'right')], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT. The speckled dragonet tilts her head at our cat with her nose to the wire, and a small inset shows two long, low shapes squeezing under the fence in the dark, carrying something, heading off toward two far shining lines. Our cat’s ears go straight up. Caption top left for a cat who has found others; her balloon puzzled; the new card appears under the panel, an ear in its corner.',
      caption: [{ when: FOUND_ONE, text: 'You tell her, name by name.' }],
      say: [{ who: 'hail', name: 'Hail', text: 'Are you following the skinny ones? Every night, two skinny shapes squeeze under this fence. With MUDDY mice. Off to the long shiny lines! Don’t they have their OWN mice?' }],
      next: 'f088'
    },

    f088: {
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'stand', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'stand', 'happy', 'dog-3', 'left', { variant: 3 }), c('hail', 'bounce', 'laugh', 'wire', 'left'),
         c('player', 'sit', 'wonder', BY_WIRE, 'right')], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT. The speckled dragonet springs high at the wire with a mischievous grin, already crouching to go, and the dogs prick up their ears behind her, sensing a game. Our cat watches from the path. Her balloon a cheerful boast.',
      say: [{ who: 'hail', name: 'Hail', text: 'Want to get past the dogs? Watch THIS!' }],
      next: 'f089'
    },

    f089: {
      scene: S('field', 'wide', NIGHT_SKY,
        [c('hail', 'run', 'laugh', 'ring-1', 'right'), c('dog', 'stand', 'wonder', 'dog-1', 'right', { variant: 1 }),
         c('dog', 'stand', 'wonder', 'dog-2', 'left', { variant: 2 }), c('dog', 'stand', 'wonder', 'dog-3', 'left', { variant: 3 })], ['night', 'motion']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT. The speckled dragonet bounces off across the silver field, away from the fence, wings flapping a little, and calls back over her shoulder; the three dogs along the wire turn their heads to her all at once. Caption top left; her balloon a shout.',
      caption: ['Hail bounces off across the field.'],
      say: [{ who: 'hail', name: 'Hail', text: 'DOGS! Chase me!', kind: 'shout' }],
      next: 'f090'
    },

    f090: {
      scene: S('field', 'wide', NIGHT_SKY,
        [c('dog', 'bounce', 'happy', 'ring-1', 'right', { variant: 1 }), c('hail', 'run', 'laugh', 'ring-2', 'right'),
         c('dog', 'bounce', 'happy', 'ring-3', 'left', { variant: 3 }), c('dog', 'bounce', 'happy', 'ring-4', 'left', { variant: 2 })], ['night', 'motion']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, COMEDY BEAT. Round and round the hollow log they go in a great silly loop across the moonlit field, the speckled dragonet in front and the three dogs bouncing after her, ears flying, nobody catching anybody. Motion lines curl round the circle. One caption at the top.',
      caption: ['Three dogs chase her in a big, silly circle. Round. And round. And ROUND.'],
      next: 'f091'
    },

    f091: {
      // her last screen: `foundHail`, for good, by reaching it (both twins carry it)
      when: TOLD,
      sets: { foundHail: true },
      scene: S('field', 'wide', PATH,
        [c('dog', 'bounce', 'happy', 'ring-1', 'right', { variant: 1 }), c('dog', 'bounce', 'happy', 'ring-2', 'right', { variant: 2 }),
         c('hail', 'run', 'happy', 'ring-3', 'left'), c('dog', 'bounce', 'happy', 'ring-4', 'left', { variant: 3 }),
         c('player', 'walk', 'happy', 'path-left', 'right'), c('tallyheart', 'walk', 'happy', 'path-right', 'right')], ['night', 'motion']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, THE TOLD PATH ONLY, THE TAP PICTURE. Far out in the field the speckled dragonet comes round the loop again with the dogs bouncing behind her, and shouts her message across the moonlight; on the path our cat and Tallyheart slip quietly by. In play the path ahead glows softly; one tap slips them past and turns the page. Her balloon a happy shout.',
      say: [{ who: 'hail', name: 'Hail', text: 'Tell Sprinkle: five! And tell her I’m the BOUNCIEST!', kind: 'shout' }],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f092' }
    },

    f092: {
      when: KEPT,
      sets: { foundHail: true },
      scene: S('field', 'wide', PATH,
        [c('dog', 'bounce', 'happy', 'ring-1', 'right', { variant: 1 }), c('dog', 'bounce', 'happy', 'ring-2', 'right', { variant: 2 }),
         c('hail', 'run', 'happy', 'ring-3', 'left'), c('dog', 'bounce', 'happy', 'ring-4', 'left', { variant: 3 }),
         c('player', 'walk', 'happy', 'path-left', 'right'), c('riffle', 'scramble', 'happy', 'path-right', 'right')], ['night', 'motion']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, THE KEPT PATH ONLY, THE TAP PICTURE. Far out in the field the speckled dragonet comes round the loop again with the dogs bouncing behind her, and shouts her message across the moonlight; on the path our cat and Riffle slip quietly by. In play the path ahead glows softly; one tap slips them past and turns the page. Her balloon a happy shout.',
      say: [{ who: 'hail', name: 'Hail', text: 'Tell Sprinkle: five! And tell her I’m the BOUNCIEST!', kind: 'shout' }],
      scratch: { tap: 'path', prompt: '**Tap** to slip past.', label: 'Slip past.', next: 'f093' }
    },

    /* ------------------------------------------------------------------ The weasel holes: both routes meet.
     * Nobody of the Clan on the rails or the sleepers; the weasels are “A weasel” until f102. */

    f093: {
      // the new place, written once: both routes meet here; nobody in the picture yet
      scene: S('tracks', 'wide', NIGHT_SKY, [], ['night']),
      board: 'WIDE ESTABLISHING SHOT, THE RAILWAY BANK, NIGHT. A high grassy bank rises across the whole panel in the silver moonlight, and on top of it run two long rails, shining, over their sleepers; all along the bank’s face are dark round holes, big and small, with tall weeds along its foot. The half moon hangs high over far towers. Captions top left.',
      caption: ['A high bank rises in the moonlight. On top run two long, shiny lines: the train tracks.', 'All along the bank are holes, like the one under your pile.'],
      next: 'f094'
    },

    f094: {
      when: TOLD,
      scene: S('tracks', 'wide', NIGHT_SKY,
        [c('player', 'sit', 'wonder', 'foot-1', 'right'), c('tallyheart', 'sit', 'solemn', 'foot-2', 'left')], ['night']),
      board: 'WIDE, THE RAILWAY BANK, NIGHT, THE TOLD PATH ONLY. At the foot of the bank our cat sits looking up at the holes and the shining rails, and Tallyheart sits beside it and lays down the rule of this place in a low voice. Nobody else is about. Her balloon a low whisper.',
      say: [{ who: 'tallyheart', text: 'Not fox country. Nobody’s land. The trains own it. Not one paw on the rails.', kind: 'whisper' }],
      next: 'f095'
    },

    f095: {
      when: KEPT,
      scene: S('tracks', 'wide', NIGHT_SKY,
        [c('player', 'sit', 'wonder', 'foot-1', 'right'), c('riffle', 'stand', 'solemn', 'foot-2', 'left')], ['night']),
      board: 'WIDE, THE RAILWAY BANK, NIGHT, THE KEPT PATH ONLY. At the foot of the bank our cat sits looking up at the holes and the shining rails, and Riffle stands beside it reciting his granny’s rule with great importance. Nobody else is about. His balloon a whisper.',
      say: [{ who: 'riffle', text: 'Not fox country. Granny says it’s nobody’s land. The trains own it. Not one paw on the rails!', kind: 'whisper' }],
      next: 'f096'
    },

    f096: {
      // the noticing cat's prints open this panel; the tall weeds at the bank's foot are the Tap
      when: TOLD,
      scene: S('tracks', 'wide', { moon: 8, tap: 'weeds' },
        [c('player', 'crouch', 'worried', 'foot-1', 'right'), c('tallyheart', 'crouch', 'worried', 'foot-2', 'left')], ['night']),
      board: 'WIDE, THE RAILWAY BANK, NIGHT, THE TOLD PATH ONLY, THE TAP PICTURE. Squeaky voices drift out of the holes in the bank, coming closer, and our cat and Tallyheart drop low at its foot, looking for cover; faint tiny prints ring every hole. In play the tall weeds along the foot of the bank glow softly; one tap hides the two of them in the weeds and turns the page. Captions top left, the first for a noticing cat.',
      caption: [{ when: NOTICING, text: 'Round every hole: tiny prints. Five little toes, close together.' }, 'Voices! Squeaky ones, coming closer.'],
      scratch: { tap: 'weeds', prompt: '**Tap** to hide in the tall weeds.', label: 'Hide in the weeds.', next: 'f097' }
    },

    f097: {
      when: KEPT,
      scene: S('tracks', 'wide', { moon: 8, tap: 'weeds' },
        [c('player', 'crouch', 'worried', 'foot-1', 'right'), c('riffle', 'scramble', 'worried', 'foot-2', 'left')], ['night']),
      board: 'WIDE, THE RAILWAY BANK, NIGHT, THE KEPT PATH ONLY, THE TAP PICTURE. Squeaky voices drift out of the holes in the bank, coming closer, and our cat and Riffle drop low at its foot, looking for cover; faint tiny prints ring every hole. In play the tall weeds along the foot of the bank glow softly; one tap hides the two of them in the weeds and turns the page. Captions top left, the first for a noticing cat.',
      caption: [{ when: NOTICING, text: 'Round every hole: tiny prints. Five little toes, close together.' }, 'Voices! Squeaky ones, coming closer.'],
      scratch: { tap: 'weeds', prompt: '**Tap** to hide in the tall weeds.', label: 'Hide in the weeds.', next: 'f098' }
    },

    f098: {
      when: TOLD,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('snatch', 'up', 'neutral', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'wonder', 'hole-2', 'left'),
         c('player', 'crouch', 'wonder', 'weeds-1', 'right'), c('tallyheart', 'crouch', 'solemn', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE TOLD PATH ONLY. From low in the weeds we look up the bank: out of two holes pop two long, thin, quick little shapes and sit up, one with a mouse in its paws, and in the weeds our cat and Tallyheart hold perfectly still with only their ears and eyes showing. The rails shine at the top. Caption top left; her balloon the faintest whisper.',
      caption: ['Out of two holes pop two skinny shapes: long, thin and quick.'],
      say: [{ who: 'tallyheart', text: 'Weasels.', kind: 'whisper' }],
      next: 'f099'
    },

    f099: {
      when: KEPT,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('snatch', 'up', 'neutral', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'wonder', 'hole-2', 'left'),
         c('player', 'crouch', 'wonder', 'weeds-1', 'right'), c('riffle', 'scramble', 'scared', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE KEPT PATH ONLY. From low in the weeds we look up the bank: out of two holes pop two long, thin, quick little shapes and sit up, one with a mouse in its paws, and in the weeds our cat and Riffle hold perfectly still, Riffle mouthing a word with no sound at all. The rails shine at the top. Captions top left, the second his silent word (no balloon: he makes no sound).',
      caption: ['Out of two holes pop two skinny shapes: long, thin and quick.', '“WEASELS,” Riffle mouths, without a sound.'],
      next: 'f100'
    },

    f100: {
      // written once, close on the two at their holes (Squall's two shapes, for a cat who found him)
      scene: S('tracks', 'holes', {},
        [c('snatch', 'up', 'neutral', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'right')], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, THE REVEAL. The two of them out in the moonlight at last: long thin bodies in thin brown fur, short legs, round ears, bead eyes, tiny five-toed feet; one sits up tall with a mouse held in its forepaws and the other sits up at the next hole, a white bib on her front. Small insets show a tuft of brown fur caught at the Crossing and a line of tiny prints in the marsh. Captions top left.',
      caption: [{ when: { foundSquall: true }, text: 'Just what Squall saw from his roof!' }, 'Thin brown fur, like the tuft at the Crossing. Tiny feet, like the prints in the marsh.', 'The thieves!'],
      next: 'f101'
    },

    f101: {
      scene: S('tracks', 'holes', {},
        [c('snatch', 'up', 'laugh', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'point', 'shout', 'hole-2', 'left')], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, COMEDY BEAT. The smaller, golden one points a tiny furious claw down at the other and squeaks, and the darker, rounder one sits up with a mouse in his paws, rolling his eyes at her. Neither of them looks at the weeds. Two balloons, hers a squeak, his smug.',
      say: [
        { who: 'snip', text: 'I carried MORE than you, Snatch! I carried a VOLE!', kind: 'shout' },
        { who: 'snatch', text: 'A vole is just a fat mouse, Snip. Two a night each, through the tunnel. Same as ALWAYS!' }
      ],
      next: 'f102'
    },

    f102: {
      // the caption tells them apart: from here on their balloons carry their names
      scene: S('tracks', 'holes', {},
        [c('snatch', 'up', 'proud', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left')], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, COMEDY BEAT. The two sit up side by side on the bank doing sums on their claws and getting them wrong: the golden one with the white bib squeaks, and the dark round one with the mouse gives his answer with great confidence. Caption top left; her balloon a squeak, his very sure of himself.',
      caption: ['Snip is the squeaky one. Snatch is holding a mouse. Snatch is ALWAYS holding a mouse.'],
      say: [
        { who: 'snip', name: 'Snip', text: 'Seven nights of it! That’s… LOTS.' },
        { who: 'snatch', name: 'Snatch', text: 'That’s a HUNDRED.' }
      ],
      next: 'f103'
    },

    f103: {
      // her sum, in the earth at the bank's foot: the told set's help is Tallyheart's
      when: TOLD,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('snatch', 'up', 'proud', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left'),
         c('player', 'crouch', 'proud', 'weeds-1', 'right'), c('tallyheart', 'crouch', 'wonder', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE TOLD PATH ONLY, THEN THE COUNTS. Down in the weeds our cat puts out a claw and starts scratching marks in the earth, very quietly, while up the bank the two weasels go on arguing; Tallyheart watches the scratching. In the Counts picture seven nights of two marks each lie in the mud, none lit; after a miss they light a night at a time as she hops by twos. Caption top left; the keypad sits below the panel.',
      caption: ['These two can’t count. But YOU can.'],
      counts: { set: 'ch08-snip', next: 'f104' }
    },

    f104: {
      // the kept path's: all in Riffle's voice
      when: KEPT,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('snatch', 'up', 'proud', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left'),
         c('player', 'crouch', 'proud', 'weeds-1', 'right'), c('riffle', 'scramble', 'wonder', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE KEPT PATH ONLY, THEN THE COUNTS. Down in the weeds our cat puts out a claw and starts scratching marks in the earth, very quietly, while up the bank the two weasels go on arguing; Riffle watches the scratching with his whiskers twitching. In the Counts picture seven nights of two marks each lie in the mud, none lit; after a miss they light a night at a time as Riffle hops by twos. Caption top left; the keypad sits below the panel.',
      caption: ['These two can’t count. But YOU can.'],
      counts: { set: 'ch08-riffle', next: 'f105' }
    },

    f105: {
      when: TOLD,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('snatch', 'up', 'proud', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left'),
         c('player', 'crouch', 'proud', 'weeds-1', 'right'), c('tallyheart', 'crouch', 'proud', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE TOLD PATH ONLY. Our cat looks from its two rows of scratches up to the weasels and back, and the numbers click together; Tallyheart, beside it in the weeds, says the thing she always says. Caption top left; two balloons, both whispers.',
      caption: ['And fourteen for Snatch. Fourteen and fourteen: twenty-eight.'],
      say: [
        { who: 'player', text: 'That’s OUR twenty-eight!', kind: 'whisper' },
        { who: 'tallyheart', text: 'The Counts don’t lie.', kind: 'whisper' }
      ],
      next: 'f106'
    },

    f106: {
      when: KEPT,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('snatch', 'up', 'proud', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left'),
         c('player', 'crouch', 'proud', 'weeds-1', 'right'), c('riffle', 'scramble', 'proud', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE KEPT PATH ONLY. Our cat looks from its two rows of scratches up to the weasels and back, and the numbers click together; Riffle, beside it in the weeds, says it as solemnly as an otter can. Caption top left; two balloons, both whispers.',
      caption: ['And fourteen for Snatch. Fourteen and fourteen: twenty-eight.'],
      say: [
        { who: 'player', text: 'That’s OUR twenty-eight!', kind: 'whisper' },
        { who: 'riffle', text: 'The Counts don’t lie.', kind: 'whisper' }
      ],
      next: 'f107'
    },

    /* ------------------------------------------------------------------ The fox: always up on the tracks,
     * far above the cats, never looking their way, never near her; he leaves before the chase. */

    f107: {
      when: TOLD,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('reynard', 'trot', 'happy', 'rails', 'right'), c('snatch', 'up', 'wonder', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'wonder', 'hole-2', 'left'),
         c('player', 'crouch', 'worried', 'weeds-1', 'right'), c('tallyheart', 'crouch', 'solemn', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE TOLD PATH ONLY. Far above, along the rails against the moonlit sky, trots a small fox shape with his tail held high, smiling to himself, and the weasels sit up at their holes to greet him; down in the weeds our cat and Tallyheart flatten their ears, the breeze in their faces. Captions top left.',
      caption: ['Then a smell you know. FOX.', 'Along the tracks trots Reynard, tail high, smiling his big smile.', 'The wind blows from him to you. He can’t smell you.'],
      next: 'f108'
    },

    f108: {
      when: KEPT,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('reynard', 'trot', 'happy', 'rails', 'right'), c('snatch', 'up', 'wonder', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'wonder', 'hole-2', 'left'),
         c('player', 'crouch', 'worried', 'weeds-1', 'right'), c('riffle', 'scramble', 'scared', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE KEPT PATH ONLY. Far above, along the rails against the moonlit sky, trots a small fox shape with his tail held high, smiling to himself, and the weasels sit up at their holes to greet him; down in the weeds our cat and Riffle flatten themselves, the breeze in their faces. Captions top left.',
      caption: ['Then a smell you know. FOX.', 'Along the tracks trots Reynard, tail high, smiling his big smile.', 'The wind blows from him to you. He can’t smell you.'],
      next: 'f109'
    },

    f109: {
      // the friend's raised tail is the Tap; Reynard on the tracks never looks their way
      when: TOLD,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('reynard', 'comb', 'happy', 'rails', 'right'), c('snatch', 'up', 'wonder', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'wonder', 'hole-2', 'left'),
         c('player', 'crouch', 'scared', 'weeds-1', 'right'), c('tallyheart', 'crouch', 'solemn', 'weeds-2', 'left', { tailUp: true, tap: 'tail' })], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE TOLD PATH ONLY, THE TAP PICTURE, COMEDY BEAT. Out of the top of the weeds, plain as a flag, sticks the tip of Tallyheart’s ginger tail, and our cat stares at it in horror; far above, the fox on the rails is busy admiring his own tail and sees nothing. In play the tail’s tip glows softly; one tap pulls it down and turns the page. One caption at the top.',
      caption: ['Uh-oh. The tip of Tallyheart’s tail is sticking up out of the weeds!'],
      scratch: { tap: 'tail', prompt: '**Tap** the tail to pull it down.', label: 'Pull the tail down.', next: 'f110' }
    },

    f110: {
      when: KEPT,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('reynard', 'comb', 'happy', 'rails', 'right'), c('snatch', 'up', 'wonder', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'wonder', 'hole-2', 'left'),
         c('player', 'crouch', 'scared', 'weeds-1', 'right'), c('riffle', 'scramble', 'happy', 'weeds-2', 'left', { tailUp: true, tap: 'tail' })], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE KEPT PATH ONLY, THE TAP PICTURE, COMEDY BEAT. Out of the top of the weeds, plain as a flag, sticks Riffle’s thick otter tail, and our cat stares at it in horror while Riffle has no idea; far above, the fox on the rails is busy admiring his own tail and sees nothing. In play the tail’s tip glows softly; one tap pulls it down and turns the page. One caption at the top.',
      caption: ['Uh-oh. Riffle’s tail is sticking up out of the weeds!'],
      scratch: { tap: 'tail', prompt: '**Tap** the tail to pull it down.', label: 'Pull the tail down.', next: 'f111' }
    },

    f111: {
      // written once: the fox on the rails against the moon, the weasels sitting up on the slope below
      scene: S('tracks', 'brag', NIGHT_SKY,
        [c('reynard', 'chest', 'happy', 'rails', 'right'), c('snip', 'up', 'happy', 'slope-1', 'right'), c('snatch', 'up', 'happy', 'slope-2', 'left', { holds: 'mouse' })], ['night']),
      board: 'LOW ANGLE, UP THE BANK, NIGHT. Reynard stands on the rails at the top of the bank against the half moon and the stars, chest out and smiling his big smile, and below him on the slope the two weasels sit up tall to listen, like pupils. No cat of the Clan is in this picture. His balloon smooth and grand.',
      say: [{ who: 'reynard', text: 'Good evening, my clever little paws.' }],
      next: 'f112'
    },

    f112: {
      scene: S('tracks', 'brag', NIGHT_SKY,
        [c('reynard', 'comb', 'happy', 'rails', 'right'), c('snip', 'up', 'wonder', 'slope-1', 'right'), c('snatch', 'up', 'wonder', 'slope-2', 'left', { holds: 'mouse' })], ['night']),
      board: 'LOW ANGLE, UP THE BANK, NIGHT. On the rails Reynard turns to admire his own magnificent tail in the moonlight, combing it with a paw, and purrs his plan to nobody in particular; a small inset shows the dark, dry arch under the Old Bridge. The weasels gaze up. Caption top left; his balloon dreamy.',
      caption: ['He admires his tail.'],
      say: [{ who: 'reynard', text: 'And such a fine, dry den, waiting just for me.' }],
      next: 'f113'
    },

    f113: {
      // what she remembers opens the panel (a found dragonet's line where its clue comes true; the border's
      // dry den for every cat), then Snip's question, close on the weasels: the fox's two lines are the next panel
      scene: S('tracks', 'holes', {},
        [c('snatch', 'up', 'happy', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'shout', 'hole-2', 'right')], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT. Close on the two weasels sitting up at their holes and gazing up the bank at the fox, the golden one bouncing with her question, the dark one hugging his mouse; small insets float over them of a fox at the border saying something about a den, and, for a cat who found him, a blue-grey dragonet pretending to be a log. Captions top left; her balloon a squeak.',
      caption: [
        { when: { foundPuddle: true }, text: 'Clever little paws. Just what Puddle saw!' },
        { when: { foundSleet: false }, text: 'A fine, dry den. He said that at the border!' },
        { when: { foundSleet: true }, text: 'A fine, dry den. He said that at the border, and Sleet heard it too!' }
      ],
      say: [{ who: 'snip', name: 'Snip', text: 'Under the Old Bridge! When is it yours?', kind: 'shout' }],
      next: 'f114'
    },

    f114: {
      scene: S('tracks', 'brag', NIGHT_SKY,
        [c('reynard', 'chest', 'proud', 'rails', 'right'), c('snip', 'up', 'happy', 'slope-1', 'right'), c('snatch', 'up', 'laugh', 'slope-2', 'left', { holds: 'mouse', holdAt: 'mouth' })], ['night']),
      board: 'LOW ANGLE, UP THE BANK, NIGHT. Reynard puffs out his chest on the rails and tells his plan to the moon, and a small inset shows cats at a Gathering chasing a dragon shape away; below him the dark weasel cheers with a mouse stuffed in his mouth. His balloon grand; the weasel’s muffled.',
      say: [
        { who: 'reynard', text: 'At the Gathering, the Clans will chase their dragon away. Then the den is MINE.' },
        { who: 'snatch', name: 'Snatch', text: 'And their pile is OURS!' }
      ],
      next: 'f115'
    },

    f115: {
      scene: S('tracks', 'brag', NIGHT_SKY,
        [c('reynard', 'sit', 'solemn', 'rails', 'right'), c('snip', 'up', 'happy', 'slope-1', 'right'), c('snatch', 'up', 'happy', 'slope-2', 'left', { holds: 'mouse' })], ['night']),
      board: 'LOW ANGLE, UP THE BANK, NIGHT, COMEDY BEAT. Reynard sits down on the rails and looks at the ceiling of the sky with a long-suffering face, the way a teacher looks at a class that will never learn; below him the two weasels grin up at him, delighted with themselves. Caption top left; his balloon one weary word.',
      caption: ['Reynard sighs.'],
      say: [{ who: 'reynard', text: 'Weasels.' }],
      next: 'f116'
    },

    f116: {
      scene: S('tracks', 'brag', NIGHT_SKY,
        [c('reynard', 'flap', 'laugh', 'rails', 'right'), c('snip', 'up', 'wonder', 'slope-1', 'right'), c('snatch', 'up', 'wonder', 'slope-2', 'left', { holds: 'mouse' })], ['night']),
      board: 'LOW ANGLE, UP THE BANK, NIGHT. Up on the rails Reynard spreads his forepaws wide and acts it all out like a story by a fire, and small insets show a glittering bit left behind a pile and a dragon shape flying off under the moon. The weasels are enchanted. His balloon a performance, the last word huge.',
      say: [{ who: 'reynard', text: 'One shiny bit by their pile. One little story: ‘It FLEW off, by moonlight!’ And the whole Clan said DRAGON.' }],
      next: 'f117'
    },

    f117: {
      // his brag: her card, an ear (it joins FLEW's row, and a Sleet cat's dry den at its end)
      card: 'fox-brag',
      scene: S('tracks', 'brag', NIGHT_SKY,
        [c('reynard', 'chest', 'laugh', 'rails', 'right'), c('snip', 'up', 'laugh', 'slope-1', 'right'), c('snatch', 'up', 'laugh', 'slope-2', 'left', { holds: 'mouse' })], ['night']),
      board: 'LOW ANGLE, UP THE BANK, NIGHT. Reynard throws his head back on the rails with a soft little yip of a laugh, enormously pleased with himself, eyes closed, and the weasels giggle along below without quite knowing why. The half moon sits just behind his ear. Caption top left; his balloon low and smug; the new card appears under the panel, an ear in its corner.',
      caption: ['He laughs, a soft little yip.'],
      say: [{ who: 'reynard', text: 'Nobody saw a thing.' }],
      next: 'f118'
    },

    f118: {
      // a choice only the told path sees: the kept path is turned straight to its own (`else`)
      when: TOLD, else: 'f120',
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('reynard', 'comb', 'proud', 'rails', 'right'), c('snatch', 'up', 'happy', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left'),
         c('player', 'crouch', 'stern', 'weeds-1', 'right'), c('tallyheart', 'crouch', 'stern', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE TOLD PATH ONLY. Far above, the fox fluffs up his tail on the rails, terribly vain, and down in the weeds our cat glares up at him with its fur on end; Tallyheart’s ears are flat. Captions top left, the second for a cat who worries about talking; the choices sit below the panel.',
      caption: ['He fluffs his tail. He is VERY pleased with himself.', { when: { worry: 'talk' }, text: 'You want to jump up and shout LIAR! You hold it in. For the Gathering.' }],
      choice: {
        options: [
          { label: 'Glare at him.', sets: {}, next: 'f119' },
          { label: 'Stick out your tongue.', sets: {}, next: 'f119' }
        ]
      }
    },

    f119: {
      // the outcome of the glare and of the tongue alike: our cat pleased with herself (`proud`), true after either
      when: TOLD,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('reynard', 'comb', 'happy', 'rails', 'right'), c('snatch', 'up', 'happy', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left'),
         c('player', 'crouch', 'proud', 'weeds-1', 'right'), c('tallyheart', 'crouch', 'kind', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE TOLD PATH ONLY. Our cat has made its face at the fox and looks very pleased with itself, and far above he goes on combing his tail without the faintest idea; Tallyheart’s whiskers twitch with a smile she is trying to hide. One caption at the top.',
      caption: ['He doesn’t see. Good.'],
      next: 'f120'
    },

    f120: {
      when: KEPT, else: 'f122',
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('reynard', 'comb', 'proud', 'rails', 'right'), c('snatch', 'up', 'happy', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left'),
         c('player', 'crouch', 'stern', 'weeds-1', 'right'), c('riffle', 'scramble', 'stern', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE KEPT PATH ONLY. Far above, the fox fluffs up his tail on the rails, terribly vain, and down in the weeds our cat glares up at him with its fur on end; Riffle scowls beside it. Captions top left, the second for a cat who worries about talking; the choices sit below the panel.',
      caption: ['He fluffs his tail. He is VERY pleased with himself.', { when: { worry: 'talk' }, text: 'You want to jump up and shout LIAR! You hold it in. For the Gathering.' }],
      choice: {
        options: [
          { label: 'Glare at him.', sets: {}, next: 'f121' },
          { label: 'Stick out your tongue.', sets: {}, next: 'f121' }
        ]
      }
    },

    f121: {
      when: KEPT,
      scene: S('tracks', 'hide', NIGHT_SKY,
        [c('reynard', 'comb', 'happy', 'rails', 'right'), c('snatch', 'up', 'happy', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'happy', 'hole-2', 'left'),
         c('player', 'crouch', 'proud', 'weeds-1', 'right'), c('riffle', 'scramble', 'laugh', 'weeds-2', 'left')], ['night']),
      board: 'MEDIUM, IN THE TALL WEEDS, NIGHT, THE KEPT PATH ONLY. Our cat has made its face at the fox and looks very pleased with itself, and far above he goes on combing his tail without the faintest idea; Riffle has both paws over his mouth to keep the giggles in. One caption at the top.',
      caption: ['He doesn’t see. Good.'],
      next: 'f122'
    },

    f122: {
      scene: S('tracks', 'brag', NIGHT_SKY,
        [c('reynard', 'trot', 'happy', 'rails', 'right'), c('snip', 'up', 'sleepy', 'slope-1', 'right'), c('snatch', 'up', 'sleepy', 'slope-2', 'left', { holds: 'mouse' })], ['night']),
      board: 'LOW ANGLE, UP THE BANK, NIGHT. Reynard sets off along the rails at an easy trot, tail high, tossing his orders back over his shoulder, and the two weasels below him yawn hugely, ready for bed. He never once looks down at the weeds. His balloon cheerful and sly.',
      say: [{ who: 'reynard', text: 'Nap now, my little sneaks. Rob later. And keep it TIDY.' }],
      next: 'f123'
    },

    f123: {
      // nobody in the picture: the fox gone along the tracks, the weasels down their hole (heard, not seen)
      scene: S('tracks', 'holes', {}, [], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, A QUIET BEAT. The bank is empty in the moonlight now, the fox gone along the tracks and the two weasels gone down a little hole, and from the hole come two tiny snores; the biggest hole, to the right, sits dark and waiting. Captions top left; the squeaky snores lettered small by the little hole.',
      caption: ['He trots off along the tracks, humming.', 'The weasels pop down a little hole. Soon: two tiny snores.'],
      sfx: 'Squee. Squee.',
      next: 'f124'
    },

    /* ------------------------------------------------------------------ The stash */

    f124: {
      when: TOLD,
      scene: S('tracks', 'holes', {},
        [c('player', 'crouch', 'wonder', 'stash-mouth', 'right'), c('tallyheart', 'sit', 'solemn', 'watch', 'right')], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, THE TOLD PATH ONLY. Our cat creeps up to the biggest hole in the bank, as wide as its own shoulders, and Tallyheart, far too big for it, settles in the weeds a little way off to keep watch. Caption top left; her balloon a whisper.',
      caption: ['Now’s your chance. You creep to the biggest hole.'],
      say: [{ who: 'tallyheart', text: 'Too small for me. I’ll keep watch.', kind: 'whisper' }],
      next: 'f125'
    },

    f125: {
      when: KEPT,
      scene: S('tracks', 'holes', {},
        [c('player', 'crouch', 'wonder', 'stash-mouth', 'right'), c('riffle', 'scramble', 'solemn', 'watch', 'right')], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, THE KEPT PATH ONLY. Our cat creeps up to the biggest hole in the bank, as wide as its own shoulders, and Riffle settles low in the weeds a little way off, keeping watch with very wide eyes. Captions top left.',
      caption: ['Now’s your chance. You creep to the biggest hole.', 'Riffle keeps watch.'],
      next: 'f126'
    },

    f126: {
      // a small cat's echo of the tunnel's brave moment: she wriggles in (the friend out of this close shot)
      when: SMALL,
      scene: S('tracks', 'holes', { tap: 'stash' },
        [c('player', 'crouch', 'proud', 'stash-mouth', 'right')], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, A SMALL CAT ONLY, THE TAP PICTURE. Our cat crouches at the mouth of the biggest hole, which is exactly as wide as its shoulders and not a whisker more, and grins: this is a small cat’s job. In play the dark mouth glows softly; one tap wriggles our cat in, the moonlight with it, and turns the page. Captions top left, the first for a sneaking cat.',
      caption: [{ when: SNEAKING, text: 'Your paws go silent. Not one weasel stirs.' }, 'A tight squeeze. In you go!'],
      scratch: { tap: 'stash', prompt: '**Tap** to wriggle in.', label: 'Wriggle in.', next: 'f127' }
    },

    f127: {
      when: NOT_SMALL,
      scene: S('tracks', 'holes', { tap: 'stash' },
        [c('player', 'crouch', 'wonder', 'stash-mouth', 'right')], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, EVERY CAT BUT A SMALL ONE, THE TAP PICTURE. Our cat crouches at the mouth of the biggest hole, as wide as its own shoulders, and stretches its neck to look in, whiskers first. In play the dark mouth glows softly; one tap puts its head in, the moonlight with it, and turns the page. A caption top left for a sneaking cat.',
      caption: [{ when: SNEAKING, text: 'Your paws go silent. Not one weasel stirs.' }],
      scratch: { tap: 'stash', prompt: '**Tap** to peek inside.', label: 'Peek inside.', next: 'f128' }
    },

    f128: {
      // the stash: her card, an eye (it lies at the end of the two robbed piles' row)
      card: 'stash',
      scene: S('tracks', 'stash', {},
        [c('player', 'crouch', 'sniff', 'stash-in', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE BIGGEST HOLE, NIGHT. A low earthen chamber with roots in its roof, lit by a shaft of moonlight from the mouth where our cat’s head and shoulders have come in; along the back lie mice and voles in perfectly tidy rows, some with muddy bellies and feet. Our cat sniffs. Captions top left; the new card appears under the panel, an eye in its corner.',
      caption: ['Mice and voles, in tidy rows. Of COURSE they’re tidy.', 'Some smell of your camp. Some smell of marsh mud. ReedClan’s prey too!'],
      next: 'f129'
    },

    f129: {
      scene: S('tracks', 'stash', {},
        [c('player', 'crouch', 'wonder', 'stash-in', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE BIGGEST HOLE, NIGHT. Beside the tidy rows of prey lies a heap of something that catches the shaft of moonlight and throws it back in white glints and pale blue-green edges, and our cat’s eyes go round. For a cat who loves shiny things its paw twitches, and stays where it is. Captions in a column at the top.',
      caption: [
        'Beside the prey is a heap of something that glitters in the moonlight.',
        { when: { worry: 'shiny' }, text: 'It sparkles. It shines.' },
        { when: { worry: 'shiny' }, text: 'It’s the shiniest thing you’ve ever seen, and your paw wants it SO much.' },
        { when: { worry: 'shiny' }, text: 'You keep your paw still. You KNOW what it is.' }
      ],
      next: 'f130'
    },

    f130: {
      // the glass: her card, an eye (it lies touching the “scale”); her whisper's speaker at the panel's edge
      card: 'glass',
      scene: S('tracks', 'stash-close', {},
        [c('player', 'crouch', 'solemn', 'near', 'right')], ['night']),
      board: 'CLOSE-UP, THE HEAP OF GLASS, NIGHT. Close on the heap: smooth, clear, flat pieces with straight edges, the moonlight shining right through them, one big piece in front, and the corner of our cat’s face and a forepaw at the panel’s edge; a small inset shows a pillow cat with its nose against a tall glass patio door. Captions top left; its balloon a whisper; the new card appears under the panel, an eye in its corner.',
      caption: ['Smooth. Clear. Flat. Just like the “scale” behind the back row.', 'You saw it every day as a pillow cat. You lived behind it: your old patio door.'],
      say: [{ who: 'player', text: 'It’s not a scale. It’s GLASS.', kind: 'whisper' }],
      next: 'f131'
    },

    f131: {
      // one small piece at the heap's near edge is the Tap
      scene: S('tracks', 'stash', { tap: 'glass' },
        [c('player', 'crouch', 'proud', 'stash-in', 'right')], ['night']),
      board: 'MEDIUM, INSIDE THE BIGGEST HOLE, NIGHT, THE TAP PICTURE. Our cat looks at the glittering heap the way a warrior looks at evidence, and a small inset shows a fox dropping a glittering bit behind a pile; one small, smooth piece lies by itself at the near edge of the heap. In play that piece glows softly; one tap wraps it in a leaf and turns the page. Captions in a column at the top.',
      caption: [
        'Tower glass. The fox’s “one shiny bit”!',
        { when: { foundWisp: true }, text: 'Wisp drew a fox dropping something that glittered. Glass, like THIS!' },
        'Proof.',
        { when: { worry: 'shiny' }, text: 'Not for keeping. For proof.' }
      ],
      scratch: { tap: 'glass', prompt: '**Tap** to take one small piece.', label: 'Take one small piece.', next: 'f132' }
    },

    f132: {
      scene: S('tracks', 'stash', {},
        [c('player', 'crouch', 'worried', 'stash-in', 'right', { holds: 'leaf', holdAt: 'paws' })], ['night']),
      board: 'MEDIUM, INSIDE THE BIGGEST HOLE, NIGHT, COMEDY BEAT. Our cat has the folded leaf with its piece of glass held tight in its forepaws, and its nose has begun to wrinkle and twitch at the smell of the place, eyes watering. Little stink lines rise off the prey. Caption top left; its balloon a growing ah.',
      caption: ['Then your nose tickles. The stash smells of weasel. Weasel smells like very old socks.'],
      say: [{ who: 'player', text: 'Ah… ah…' }],
      next: 'f133'
    },

    f133: {
      // the sneeze alone on its panel, said in words for a child who listens (`sfxRead`)
      scene: S('tracks', 'holes', {},
        [c('player', 'crouch', 'worried', 'stash-mouth', 'right', { holds: 'leaf', holdAt: 'paws', squeeze: true })], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, COMEDY BEAT. Halfway out of the biggest hole, our cat sneezes the biggest sneeze of its life, eyes squeezed shut and whiskers blown forward, the leaf still clutched safe in its paws; the moonlit bank seems to jump. The ACHOO! fills the top of the panel.',
      sfx: 'ACHOO!',
      sfxRead: 'a great big sneeze: ACHOO!',
      next: 'f134'
    },

    /* ------------------------------------------------------------------ The chase: more funny than scary.
     * Nobody is hurt and nobody is caught; the dogs see the weasels off. */

    f134: {
      // the first caption runs on into its sound, said in words for a child who listens
      scene: S('tracks', 'holes', {},
        [c('snatch', 'peek', 'sniff', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'wonder', 'hole-2', 'right'),
         c('player', 'crouch', 'scared', 'stash-mouth', 'right', { holds: 'leaf', holdAt: 'paws' })], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT. Behind our cat, out of a little hole, pokes a dark pointed nose with a mouse still in its mouth, sniffing the air, and up the slope the golden weasel pops up too, ears high; our cat freezes at the biggest hole with its back to them. Captions top left, the sniff small and pale; his balloon muffled through the mouse.',
      caption: ['Behind you:', 'Snatch pokes his head out of a hole, mouse and all.'],
      sfx: 'sniff, sniff.',
      sfxRead: 'sniff, sniff.',
      say: [{ who: 'snatch', name: 'Snatch', text: 'I smell CAT.' }],
      next: 'f135'
    },

    f135: {
      scene: S('tracks', 'holes', {},
        [c('snatch', 'peek', 'shout', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'up', 'stern', 'hole-2', 'right'),
         c('player', 'crouch', 'scared', 'stash-mouth', 'left', { holds: 'leaf', holdAt: 'paws' })], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, COMEDY BEAT. The golden weasel rolls her eyes at her brother from up the slope, and the dark one, still with his mouse, points his whole quivering nose straight at our cat, who has turned round with its eyes like saucers. Two balloons, hers scornful, his triumphant.',
      say: [
        { who: 'snip', name: 'Snip', text: 'You ALWAYS smell cat. We ROB cats.' },
        { who: 'snatch', name: 'Snatch', text: 'This one’s RIGHT HERE!', kind: 'shout' }
      ],
      next: 'f136'
    },

    f136: {
      // her front paw, mid-stride, is the Tap; the leaf in her mouth
      when: TOLD,
      scene: S('tracks', 'holes', {},
        [c('snatch', 'point', 'shout', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'point', 'shout', 'hole-2', 'right'),
         c('tallyheart', 'stand', 'stern', 'watch', 'right'), c('player', 'run', 'scared', 'stash-mouth', 'left', { holds: 'leaf', holdAt: 'mouth', tap: 'paw' })], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, THE TOLD PATH ONLY, THE TAP PICTURE, COMEDY BEAT. Both weasels point at our cat and squeak at once, each telling the other to do it, and Tallyheart springs up out of the weeds with her orders; our cat is already off, the leaf in its mouth. In play its front paw glows softly; one tap runs and turns the page. Four balloons, squeaks and then hers, firm.',
      say: [
        { who: 'snatch', name: 'Snatch', text: 'GET THAT CAT!', kind: 'shout' },
        { who: 'snip', name: 'Snip', text: 'No, YOU get that cat!', kind: 'shout' },
        { who: 'snatch', name: 'Snatch', text: 'We BOTH get that cat!', kind: 'shout' },
        { who: 'tallyheart', text: 'Run! Get the glass HOME. Weasels can wait.' }
      ],
      scratch: { tap: 'paw', prompt: '**Tap** to RUN!', label: 'Run!', next: 'f137' }
    },

    f137: {
      when: KEPT,
      scene: S('tracks', 'holes', {},
        [c('snatch', 'point', 'shout', 'hole-1', 'right', { holds: 'mouse' }), c('snip', 'point', 'shout', 'hole-2', 'right'),
         c('riffle', 'scramble', 'scared', 'watch', 'right'), c('player', 'run', 'scared', 'stash-mouth', 'left', { holds: 'leaf', holdAt: 'mouth', tap: 'paw' })], ['night']),
      board: 'MEDIUM, ON THE BANK’S FACE, NIGHT, THE KEPT PATH ONLY, THE TAP PICTURE, COMEDY BEAT. Both weasels point at our cat and squeak at once, each telling the other to do it, and Riffle bursts out of the weeds squeaking louder than both; our cat is already off, the leaf in its mouth. In play its front paw glows softly; one tap runs and turns the page. Four balloons, all squeaks.',
      say: [
        { who: 'snatch', name: 'Snatch', text: 'GET THAT CAT!', kind: 'shout' },
        { who: 'snip', name: 'Snip', text: 'No, YOU get that cat!', kind: 'shout' },
        { who: 'snatch', name: 'Snatch', text: 'We BOTH get that cat!', kind: 'shout' },
        { who: 'riffle', text: 'RUN!', kind: 'shout' }
      ],
      scratch: { tap: 'paw', prompt: '**Tap** to RUN!', label: 'Run!', next: 'f138' }
    },

    f138: {
      // home is to the left: everyone runs left, the weasels behind
      when: TOLD,
      scene: S('field', 'wide', NIGHT_SKY,
        [c('player', 'run', 'scared', 'path-left', 'left', { holds: 'leaf', holdAt: 'mouth' }), c('tallyheart', 'run', 'stern', 'path-right', 'left'),
         c('snip', 'run', 'shout', 'trail-1', 'left'), c('snatch', 'run', 'shout', 'trail-2', 'left', { holds: 'mouse' })], ['night', 'motion']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, THE TOLD PATH ONLY, ACTION. Down the silver path past the field our cat runs flat out with the leaf in its mouth and Tallyheart right beside it, and behind them come two small weasels bounding along, squeaking with all their might, one of them still carrying a mouse. Caption top left; her balloon a squeaky threat.',
      caption: ['Down the bank you run, round the near side of the field, two weasels behind you.'],
      say: [{ who: 'snip', name: 'Snip', text: 'Come BACK! We’ll… we’ll SQUEAK at you!', kind: 'shout' }],
      next: 'f139'
    },

    f139: {
      when: KEPT,
      scene: S('field', 'wide', NIGHT_SKY,
        [c('player', 'run', 'scared', 'path-left', 'left', { holds: 'leaf', holdAt: 'mouth' }), c('riffle', 'scramble', 'scared', 'path-right', 'left'),
         c('snip', 'run', 'shout', 'trail-1', 'left'), c('snatch', 'run', 'shout', 'trail-2', 'left', { holds: 'mouse' })], ['night', 'motion']),
      board: 'WIDE, THE BARKING FIELD AT NIGHT, THE KEPT PATH ONLY, ACTION. Down the silver path past the field our cat runs flat out with the leaf in its mouth and Riffle scrambling beside it, and behind them come two small weasels bounding along, squeaking with all their might, one of them still carrying a mouse. Caption top left; her balloon a squeaky threat.',
      caption: ['Down the bank you run, round the near side of the field, two weasels behind you.'],
      say: [{ who: 'snip', name: 'Snip', text: 'Come BACK! We’ll… we’ll SQUEAK at you!', kind: 'shout' }],
      next: 'f140'
    },

    f140: {
      // the weasels alone on the path: written once
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('snip', 'run', 'shout', 'trail-1', 'left'), c('snatch', 'run', 'worried', 'trail-2', 'left', { holds: 'mouse' })], ['night', 'motion']),
      board: 'MEDIUM, ON THE PATH BY THE FENCE, NIGHT, COMEDY BEAT. The two weasels bound along the silver path, tiny and furious and very, very loud, the golden one in front looking back to shout at the dark one, who lags behind puffing, his mouse clamped in his jaws. The dark field behind the fence is quiet. Captions top left; her balloon a squeak, his a muffled refusal.',
      caption: ['They’re half your size. They’re very, very LOUD.', 'Snatch is slow. He won’t drop his mouse.'],
      say: [
        { who: 'snip', name: 'Snip', text: 'Drop the MOUSE!', kind: 'shout' },
        { who: 'snatch', name: 'Snatch', text: 'NEVER!', kind: 'shout' }
      ],
      next: 'f141'
    },

    f141: {
      when: NO_HAIL,
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'jump', 'shout', 'dog-1', 'right', { variant: 1 }), c('dog', 'jump', 'shout', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'jump', 'shout', 'dog-3', 'left', { variant: 3 }),
         c('snip', 'run', 'scared', 'trail-1', 'left'), c('snatch', 'run', 'scared', 'trail-2', 'left', { holds: 'mouse' })], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, EVERY CAT BUT ONE WHO HAS FOUND HAIL, ACTION. Up from the grass inside the fence leap three dogs, wide awake and delighted, paws on the wire, bouncing along it at the sight of two small brown things on the path; the weasels’ eyes go round. Captions top left; his balloon a joyful bark.',
      caption: ['Inside the fence, three dogs leap up.', 'They bounce along the fence, barking their heads off.'],
      say: [{ who: 'dog', name: 'Good Boy', text: 'SQUIRRELS!', kind: 'shout' }],
      next: 'f142'
    },

    f142: {
      when: HAIL,
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'jump', 'shout', 'dog-1', 'right', { variant: 1 }), c('dog', 'jump', 'shout', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'jump', 'shout', 'dog-3', 'left', { variant: 3 }), c('hail', 'bounce', 'shout', 'wire', 'left'),
         c('snip', 'run', 'scared', 'trail-1', 'left'), c('snatch', 'run', 'scared', 'trail-2', 'left', { holds: 'mouse' })], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, ONLY FOR A CAT WHO HAS FOUND HAIL, ACTION. The speckled dragonet comes bouncing to the wire and points her whole self at the two small brown things on the path, calling her dogs, and the three dogs leap up beside her, delighted; the weasels’ eyes go round. Her balloon a joyful shout.',
      say: [{ who: 'hail', name: 'Hail', text: 'DOGS! SQUIRRELS! THAT way!', kind: 'shout' }],
      next: 'f143'
    },

    f143: {
      when: NO_HAIL,
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'howl', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'bounce', 'shout', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'bounce', 'shout', 'dog-3', 'left', { variant: 3 }),
         c('snip', 'skid', 'scared', 'trail-1', 'right'), c('snatch', 'skid', 'scared', 'trail-2', 'right', { holds: 'mouse' })], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, EVERY CAT BUT ONE WHO HAS FOUND HAIL, COMEDY BEAT. The three dogs bounce along the wire barking their heads off, and on the path the two weasels skid to a stop in a spray of dust, front paws braced, and spin round for home. The dogs wave them off happily. Caption top left; the big dog’s balloon a cheerful bark.',
      caption: ['Snip and Snatch skid to a stop. They spin round, and run all the way back.'],
      say: [{ who: 'dog', name: 'The dogs', text: 'BYE, RUDE SQUIRRELS!', kind: 'shout' }],
      next: 'f144'
    },

    f144: {
      when: HAIL,
      scene: S('field', 'dogs', NIGHT_SKY,
        [c('dog', 'howl', 'happy', 'dog-1', 'right', { variant: 1 }), c('dog', 'bounce', 'shout', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'bounce', 'shout', 'dog-3', 'left', { variant: 3 }), c('hail', 'bounce', 'laugh', 'wire', 'left'),
         c('snip', 'skid', 'scared', 'trail-1', 'right'), c('snatch', 'skid', 'scared', 'trail-2', 'right', { holds: 'mouse' })], ['night']),
      board: 'MEDIUM, AT THE FENCE, NIGHT, ONLY FOR A CAT WHO HAS FOUND HAIL, COMEDY BEAT. Three dogs and one speckled dragonet bounce along the wire barking their heads off, and on the path the two weasels skid to a stop in a spray of dust, front paws braced, and spin round for home. Everyone behind the wire is having the best night ever. Captions top left; the big dog’s balloon a cheerful bark.',
      caption: ['Three dogs and one speckled dragonet bounce along the fence, barking their heads off.', 'Snip and Snatch skid to a stop. They spin round, and run all the way back.'],
      say: [{ who: 'dog', name: 'The dogs', text: 'BYE, RUDE SQUIRRELS!', kind: 'shout' }],
      next: 'f145'
    },

    f145: {
      // her raised paw is the Tap: she waves to the dogs
      when: NO_HAIL,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('dog', 'sit', 'happy', 'dog-3', 'right', { variant: 3 }), c('player', 'pawup', 'happy', 'path-left', 'right', { tap: 'paw' })], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, EVERY CAT BUT ONE WHO HAS FOUND HAIL, THE TAP PICTURE. The path is empty of weasels now, and the three dogs sit panting happily behind the wire; our cat, the leaf safe, lifts a forepaw to them from the path. In play its raised paw glows softly; one tap waves goodbye and turns the page. One caption at the top.',
      caption: ['Nobody’s hurt.'],
      scratch: { tap: 'paw', prompt: '**Tap** to wave goodbye.', label: 'Wave goodbye.', next: 'f146' }
    },

    f146: {
      when: HAIL,
      scene: S('field', 'fence', NIGHT_SKY,
        [c('dog', 'sit', 'happy', 'dog-1', 'left', { variant: 1 }), c('dog', 'sit', 'happy', 'dog-2', 'left', { variant: 2 }),
         c('hail', 'pawup', 'happy', 'wire', 'left'),
         c('player', 'pawup', 'happy', 'path-left', 'right', { tap: 'paw' })], ['night']),
      board: 'MEDIUM, ON THE PATH BY THE WIRE, NIGHT, ONLY FOR A CAT WHO HAS FOUND HAIL, THE TAP PICTURE. The path is empty of weasels now; the dogs sit panting happily behind the wire and the speckled dragonet waves a forepaw through it, and our cat, the leaf safe, lifts a forepaw back. In play its raised paw glows softly; one tap waves goodbye and turns the page. One caption at the top.',
      caption: ['Nobody’s hurt.'],
      scratch: { tap: 'paw', prompt: '**Tap** to wave goodbye.', label: 'Wave goodbye.', next: 'f147' }
    },

    /* ------------------------------------------------------------------ Home: behind the pile, where the
     * trail began. Tallyheart is there on both paths. */

    f147: {
      // the leaf at her forepaws is the Tap
      when: TOLD,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'crouch', 'happy', 'rear-1', 'right', { holds: 'leaf', holdAt: 'paws', tap: 'leaf' }), c('tallyheart', 'sit', 'kind', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BEHIND THE PILE, NIGHT, THE TOLD PATH ONLY, THE TAP PICTURE. Back through the hedge behind the back row, the guards small and quiet at the front, our cat crouches with the folded leaf at its forepaws, and Tallyheart settles beside it, both of them breathing hard and grinning. In play the leaf glows softly; one tap opens it and turns the page. One caption at the top.',
      caption: ['Through the hedge, behind the pile, you’re safe.'],
      scratch: { tap: 'leaf', prompt: '**Tap** to put down the glass.', label: 'Put down the glass.', next: 'f148' }
    },

    f148: {
      when: TOLD,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'crouch', 'proud', 'rear-1', 'right', { holds: 'glass' }), c('tallyheart', 'sit', 'wonder', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BEHIND THE PILE, NIGHT, THE TOLD PATH ONLY. The leaf lies open on the ground and the small clear piece on it shines in the moonlight; Tallyheart leans down and looks at it for a long, long time, and a small inset shows the “scale” lying behind the back row. Caption top left; her balloon slow.',
      caption: ['Tallyheart looks at it for a long time.'],
      say: [{ who: 'tallyheart', text: 'So THAT’S our dragon’s scale.' }],
      next: 'f149'
    },

    f149: {
      when: TOLD,
      scene: S('pile', 'hole', EVE,
        [c('player', 'sit', 'proud', 'brink', 'right', { holds: 'glass' }), c('tallyheart', 'sit', 'solemn', TALK, 'left')], ['night']),
      board: 'MEDIUM CLOSE TWO-SHOT, AT CAT HEIGHT, AT THE TUNNEL’S MOUTH BEHIND THE PILE, NIGHT, THE TOLD PATH ONLY. Tallyheart sits up very straight across the tunnel’s dark mouth from our cat and counts the night’s findings off on her claws like a judge, and three small insets float over them: two weasels, a smiling fox, a heap of glass. Our cat listens with its chest out. Her balloon level and certain.',
      say: [{ who: 'tallyheart', text: 'Weasels. A fox who wants a den. And a heap of glass. This goes to the Gathering, with the whole story. Every Clan should hear it.' }],
      next: 'f150'
    },

    f150: {
      // he waves: Riffle's `hop` stands him up tall with a forepaw raised by his cheek (his `point` points down)
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'stand', 'happy', 'rear-1', 'right', { holds: 'leaf' }), c('riffle', 'hop', 'happy', HEDGE, 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BEHIND THE PILE, NIGHT, THE KEPT PATH ONLY. At the hedge behind the back row Riffle stands up tall on the spot and waves goodbye, one forepaw raised by his cheek, and makes his promise, and our cat stands with the leaf in its mouth; the guards are small and quiet at the front. Caption top left; his balloon a solemn whisper, the last bit sly.',
      caption: ['At the hedge, Riffle waves goodbye.'],
      say: [{ who: 'riffle', text: 'Otter’s honor. I’ll tell NOBODY. Except Sprinkle.', kind: 'whisper' }],
      next: 'f151'
    },

    f151: {
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'stand', 'scared', 'rear-1', 'right', { holds: 'leaf' }), c('tallyheart', 'sit', 'worried', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BEHIND THE PILE, NIGHT, THE KEPT PATH ONLY. Our cat turns from the hedge and stops dead: behind the back row, beside the open mouth of the tunnel, a big ginger shape sits waiting in the moonlight, very still, not cross, just waiting. One caption at the top.',
      caption: ['Behind the pile, a big ginger shape is waiting in the moonlight. Tallyheart.'],
      next: 'f152'
    },

    f152: {
      // a choice only the kept path sees: the told path is turned past to the shared warm moment (`else`)
      when: KEPT, else: 'f157',
      scene: S('pile', 'hole', EVE,
        [c('player', 'sit', 'shy', 'brink', 'right', { holds: 'leaf', holdAt: 'paws' }), c('tallyheart', 'sit', 'worried', TALK, 'left')], ['night']),
      board: 'MEDIUM CLOSE TWO-SHOT, AT CAT HEIGHT, AT THE TUNNEL’S MOUTH BEHIND THE PILE, NIGHT, THE KEPT PATH ONLY. Across the tunnel’s dark mouth, Tallyheart looks our cat over from ears to tail, counting, and lets out a long breath; she is not angry, and that is worse. Our cat sits small with the leaf at its paws. Two balloons, hers: the first quiet, the second very quiet; the choices sit below the panel.',
      say: [
        { who: 'tallyheart', text: 'Twenty-six pawsteps from the hedge. And four paws. All there.' },
        { who: 'tallyheart', text: 'I came to say goodnight. Your nest was empty. I’m not angry. I was scared.' }
      ],
      choice: {
        options: [
          { label: '“I’m sorry.”', sets: {}, next: 'f153a' },
          { label: '“But I found the THIEVES!”', sets: {}, next: 'f153b' }
        ]
      }
    },

    f153a: {
      // no art draws a tail round another cat: the caption says it, and the picture has them together, close at
      // the tunnel's mouth, her head against Tallyheart's chest (Tallyheart drawn first, so our cat is in front)
      scene: S('pile', 'hole', EVE,
        [c('tallyheart', 'sit', 'kind', TALK, 'left'), c('player', 'sit', 'happy', LEAN, 'right', { holds: 'leaf', holdAt: 'paws' })], ['night']),
      board: 'MEDIUM CLOSE TWO-SHOT, AT CAT HEIGHT, AT THE TUNNEL’S MOUTH BEHIND THE PILE, NIGHT, A WARM BEAT. Tallyheart moves close and her big ginger tail curls round our cat, and our cat leans into her side with its eyes shut. Nothing more needs saying. One caption at the top.',
      caption: ['Her tail curls round you.'],
      next: 'f154'
    },

    f153b: {
      scene: S('pile', 'hole', EVE,
        [c('player', 'sit', 'proud', 'brink', 'right', { holds: 'leaf', holdAt: 'paws' }), c('tallyheart', 'sit', 'wonder', TALK, 'left')], ['night']),
      board: 'MEDIUM CLOSE TWO-SHOT, AT CAT HEIGHT, AT THE TUNNEL’S MOUTH BEHIND THE PILE, NIGHT, COMEDY BEAT. Tallyheart’s ears shoot straight up and her eyes go perfectly round, all the worry knocked out of her at once. Our cat sits up proud with the leaf at its paws. Her balloon two astonished words.',
      say: [{ who: 'tallyheart', text: 'You WHAT?' }],
      next: 'f154'
    },

    f154: {
      // the leaf at her forepaws is the Tap
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'crouch', 'solemn', 'rear-1', 'right', { holds: 'leaf', holdAt: 'paws', tap: 'leaf' }), c('tallyheart', 'sit', 'wonder', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BEHIND THE PILE, NIGHT, THE KEPT PATH ONLY, THE TAP PICTURE. Our cat tells it all to Tallyheart, and small insets float over its head one by one, a tunnel, two weasels, a fox on the rails, a stash, while a thought bubble keeps a misty dragonet tucked away to itself. In play the folded leaf at its paws glows softly; one tap opens it and turns the page. Captions top left.',
      caption: ['You tell her everything: the tunnel, the weasels, the fox, the stash.', 'Everything but the dragonets. Not yet.'],
      scratch: { tap: 'leaf', prompt: '**Tap** to show her the glass.', label: 'Show her the glass.', next: 'f155' }
    },

    f155: {
      when: KEPT,
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'crouch', 'proud', 'rear-1', 'right', { holds: 'glass' }), c('tallyheart', 'sit', 'wonder', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BEHIND THE PILE, NIGHT, THE KEPT PATH ONLY. The leaf lies open on the ground and the small clear piece on it shines in the moonlight; Tallyheart leans down and looks at it for a long, long time, and a small inset shows the “scale” lying behind the back row. Caption top left; her balloon slow, then sharp.',
      caption: ['Tallyheart looks at it for a long time.'],
      say: [{ who: 'tallyheart', text: 'So THAT’S our dragon’s scale. A fox’s trick.' }],
      next: 'f156'
    },

    f156: {
      when: KEPT,
      scene: S('pile', 'hole', EVE,
        [c('player', 'sit', 'proud', 'brink', 'right', { holds: 'glass' }), c('tallyheart', 'sit', 'solemn', TALK, 'left')], ['night']),
      board: 'MEDIUM CLOSE TWO-SHOT, AT CAT HEIGHT, AT THE TUNNEL’S MOUTH BEHIND THE PILE, NIGHT, THE KEPT PATH ONLY. Tallyheart sits up very straight across the tunnel’s mouth, the worry gone and the warrior back, and says what will happen next as plainly as a sum; a small inset shows the full moon over the Gathering, every Clan listening. Her balloon level and certain.',
      say: [{ who: 'tallyheart', text: 'This goes to the Gathering. Every Clan should hear it.' }],
      next: 'f157'
    },

    f157: {
      // the warm moment, said once, on both paths: nose to nose behind the pile, no promise
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('tallyheart', 'stand', 'kind', 'rear-2', 'left'), c('player', 'stand', 'happy', NOSE, 'right')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BEHIND THE PILE, NIGHT, A WARM BEAT. Tallyheart bends her big ginger head and touches her nose to our cat’s, nose to nose in the moonlight behind the back row, her amber eyes soft; the guards at the front never turn. Caption top left; her balloon quiet and sure.',
      caption: ['She touches her nose to yours.'],
      say: [{ who: 'tallyheart', text: 'A night trail, a fox and a stash. You stayed calm, and took one piece, for proof. That’s how a warrior thinks.' }],
      next: 'f158'
    },

    f158: {
      scene: S('pile', 'rear', OPEN,
        guards().concat([c('player', 'sit', 'proud', 'rear-1', 'right', { tailUp: true, holds: 'glass' }), c('tallyheart', 'sit', 'kind', 'rear-2', 'left')]), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BEHIND THE PILE, NIGHT. Our cat sits up as tall as it can with its tail sticking straight up like a flag, curled over at the tip, and Tallyheart, across the open mouth, gives it a long look; a small inset, for a cat who told, shows Riffle bouncing with questions. Captions top left; her balloon, for a cat who kept the secret, firm but kind.',
      caption: ['Your tail goes straight up.', { when: TOLD, text: 'Tomorrow, Riffle will want to hear EVERY bit.' }],
      say: [{ who: 'tallyheart', text: 'But next time, you take ME. Not just Riffle.', when: KEPT }],
      next: 'f159'
    },

    /* ------------------------------------------------------------------ Eight claw marks */

    f159: {
      // (lying, so the stone is under her chin or by her nose, as the caption says); the skritch runs on
      // from the first caption, and is said in words for a child who listens
      scene: S('den', 'nest', DEN_GLASS,
        [c('player', 'lie', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat lies in its own moss nest in the dark, and along the nest’s mossy edge its Case File stands in rows; under the moss lie its secret pieces, a corner of each showing, and beside them the tip of a leaf with one small glint. Riffle’s nearly black stone lies where it was put. Captions in a column beside the panel; the skritch small and pale.',
      caption: [
        'In your nest:',
        'New curls of bark. And under the moss, in its leaf, your glass.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      sfx: 'skritch, skritch.',
      sfxRead: 'skritch, skritch.',
      next: 'f160'
    },

    f160: {
      scene: S('den', 'doorway', DEN_MOON,
        [c('player', 'lie', 'wonder', 'nest', 'right')], ['night', 'stars']),
      board: 'MEDIUM, FROM INSIDE THE DEN, NIGHT. Our cat lies awake in its nest looking out through the doorway at the stars and the half moon, and four small insets float over it like a list: eight claw marks on a tree, two weasels arguing over their claws, a fox on the rails, and a heap of glass. Two captions, top left.',
      caption: ['Eight claw marks on the tree. Two weasels who can’t count.', 'One fox who wants a den. And a “scale” that was only ever glass.'],
      next: 'f161'
    },

    f161: {
      // the paw thing at last: his four paws, then hers
      scene: S('den', 'inside', DEN_MOON,
        [c('snorer', 'lie', 'wonder', 'sleeper-1', 'right'), c('player', 'sit', 'laugh', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT, THE TAP PICTURE. Across the empty middle nest the grey apprentice lifts his head and whispers his usual request, eyes like saucers, and our cat sits up in its own nest, grinning: tonight it means it. In play the counting picture takes the panel: the grey tom and our cat side-on, his four paws glowing first; each tap lights four and puts the count in our cat’s balloon, 4, 8. Two small balloons, his a whisper.',
      say: [
        { who: 'snorer', text: '{name}paw? Where WERE you? …Do the paw thing.', kind: 'whisper' },
        { who: 'player', text: 'Tonight it really IS the paw thing.' }
      ],
      skip: { table: 4, groups: 2, who: [{ who: 'snorer' }, { who: 'player' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next cat’s paws.', prompt: '**Tap** the paws.', next: 'f162' }
    },

    f162: {
      scene: S('den', 'inside', DEN_MOON,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. A big 8 floats over the dark, and across the empty middle nest the grey apprentice has sunk back down with his chin on his paws, peering at his own feet as if somebody had sneaked extra ones in. His eyes are already closing. His balloon a mumble.',
      say: [{ who: 'snorer', text: 'EIGHT? I only ever use four.' }],
      next: 'f163'
    },

    f163: {
      // the half moon in the doorway's patch of sky
      scene: S('den', 'inside', DEN_MOON,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'lie', 'wonder', 'nest', 'right')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. The grey apprentice has curled up tight and is snoring, a little zzz rising from him, and across the den our cat lies awake looking out of the doorway, where the half moon shines in a patch of sky; a small inset shows a full moon over a crowd of cats. Captions top left.',
      caption: ['Soon he’s snoring.', 'Outside, the moon is half full. When it’s full, it’s the Gathering.', 'Every Clan will hear the truth, and decide about the dragon.'],
      next: 'f164'
    },

    f164: {
      // half asleep: the lids down to the middle of her eyes and kind's small smile (the next panel is asleep)
      scene: S('den', 'nest', DEN_GLASS,
        [c('player', 'curl', 'kind', 'nest', 'left', { asleep: 'half' })], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat curls up tight beside its rows of bark, eyes half shut and a small smile, and a small thought bubble holds Sprinkle under the Old Bridge trying to lift her crumpled wing, curious, not sad. Captions top left and at the bottom.',
      caption: ['Whatever the Clans decide, Sprinkle needs to FLY again. And her hurt wing still won’t lift.', 'How do you mend a dragon’s wing?', 'You curl up tight, warm and safe, and sleep.'],
      next: 'f165'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f165: {
      scene: S('den', 'nest', DEN_GLASS,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside its bark and Riffle’s stone, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream, after the night trail?'],
      // short enough for one line in the box
      input: { kind: 'dream', placeholder: 'A tunnel… weasels… glass…', next: 'f166' }
    },

    f166: {
      scene: S('den', 'doorway', DEN_MOON,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'stars', 'zzz']),
      board: 'WIDE CLOSING SHOT, FROM INSIDE THE DEN. Our cat sleeps curled in its moss nest with its Case File along the edge and its piece of glass tucked under the moss, and through the doorway the half moon shines silver over the rosebush and the sleeping camp. One tiny contented zzz. Caption at the bottom, with END OF CHAPTER EIGHT lettered like a title.',
      caption: [
        'You sleep warm in your nest, with your glass under the moss and the half moon shining over the rosebush.',
        'End of Chapter Eight.'
      ],
      end: true
    }
  };

  // The frames are written by section above; the chapter lists every frame in id order (f046a, f046b,
  // f047…), the reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* The lines the sets share (the spec's section 2). */
  function T(text) { return { who: 'tallyheart', text: text }; }
  var QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
  var AFTER = ['Ha! You didn’t even look at the sand that time.'];
  var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';
  var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
  // a question that doubles or steps: its way, said once more before the last line; on a last miss its way alone
  function way(text) { return { miss: text + ' ' + MISS, missLast: text }; }
  // the warm-up's cheeks (chapter 7's), the lesson's cats and their paws, the story's nights of marks
  var CHEEKS = { table: 6, thing: 'whisker', things: 'whiskers', unit: 'cheek', units: 'cheeks', teacher: 'tallyheart',
    ask: '{a} × {b}', picture: { kind: 'cheeks' } };
  var PAWS = { table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}' };
  var NIGHTS = { thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', ask: '{a} × {b}' };
  // 2 × 6, “One whole cat.”: one cat's two cheeks, drawn as one face (two entries of one cat; chapter 7's)
  var ONE_CAT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }];
  // Hail's riddle: the three dogs, then Hail, four paws each
  var FIELD = [{ who: 'dog', variant: 1 }, { who: 'dog', variant: 2 }, { who: 'dog', variant: 3 }, { who: 'hail' }];

  PC.story.ch08 = {
    id: 'ch08',
    number: 8,
    title: 'The Night Trail',
    start: 'f001',
    // the three she meets tonight, until each is told apart or named (a lesson's lines read these too:
    // Hail's riddle, its help, its fillers and its retry)
    names: { snip: 'A weasel', snatch: 'A weasel', hail: 'The speckled dragonet' },

    // Her Case File: the four cards this chapter can give, in the order she can get them. A card's picture
    // is its own id (app/art/cards.js). Hail's is shown only once her scene is finished; the brag joins
    // FLEW's row (and lays a Sleet cat's dry den at its end, over a line of its own: `lines`); the stash lies
    // at the end of the two robbed piles' row; the glass touches the “scale”. All four go under the moss in
    // her nest on every path (the den's `hidden`): proof for the Gathering, and a dragonet's.
    cards: {
      'hail-shapes': { mark: 'ear', line: 'Hail says two skinny shapes cross her field every night, toward the tracks.', when: { foundHail: true } },
      'fox-brag': { mark: 'ear', line: 'Reynard calls ‘It FLEW off’ his little story. He wants the dry den.',
        link: { with: ['fox-flew', 'sleet-den'], line: 'He said FLEW. Now he calls it a story.', lines: { 'sleet-den': 'The same fine, dry den.' } } },
      stash: { mark: 'eye', line: 'The weasels have a stash: our prey, and ReedClan’s.',
        link: { with: ['reed-pile'], line: 'Two piles robbed. One stash.' } },
      glass: { mark: 'eye', line: 'A heap of glass in the weasels’ stash, just like the ‘scale’.',
        link: { with: ['scale'], line: 'It’s not a scale. It’s GLASS.' } }
    },

    frames: ordered,

    counts: {
      // The seventh morning count, one question, chapter 7's: the three front rows she walks along, lit a
      // row at a time, with no number shown. No praise: the gap answers. A miss is scratched in the earth,
      // ten marks a row, and borrows the two easiest tens on the pile's own rows.
      'ch08-pile': {
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

      // The warm-up on the 6s, in the Hollow: two questions, in chapter 7's cheeks, with its help. The first
      // is the hard slot (warmHard, at 0): the 6s fact she found hardest in chapter 7, in the order she was
      // asked it, and 6 × 8 when nothing was; never one another day timed, nor 4 × 6, the 4s lesson's own
      // (“YOUR count”). Fillers are chapter 7's lesson's easiest, after “One from yesterday.”, never 6 × 6.
      'ch08-sixes': merge(CHEEKS, {
        facts: [[6, 8], { a: 2, b: 6, who: ONE_CAT, prompt: 'Two cheeks? One whole cat.', retryPrompt: true,
          right: [T('Twelve! Six and six. That’s doubling.')], rightAgain: true }],
        warmHard: { table: 6, at: 0, avoid: [[1, 6], [2, 6], [3, 6], [6, 9], [6, 10], [4, 6]] }, avoid: [[6, 6], [4, 6]],
        fillFrom: 'ch07-sixes', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
        praise: ['Two threes make a six!', 'Six more, every time!', 'Three and three, every cheek!'],
        fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST,
        remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
      }),

      // The lesson: the 4s, paws, ten facts in both orders. She already knows most of the fours: 2 × 4,
      // 4 × 5, 3 × 4, 4 × 6 and 10 × 4 are stepping stones; five are new (4 × 4, 4 × 7, 4 × 8, 7 × 4,
      // 8 × 4). A four is two twos: count the front paws and double (4 × 4, 4 × 7, in their words), or step
      // off one she knows (4 × 8 off 4 × 7, its seven cats lit). Twins three places apart, so a missed one
      // comes back before its twin; 3 × 4 and 10 × 4 have no right line of their own, so speed shows there;
      // 8 × 4 is a check. The 4s' own Count (“Paws · the 4s”).
      'ch08-fours': merge(PAWS, {
        label: 'Paws', hollowThings: 'fours', fillOrder: 'easiest', prompt: 'How many paws?',
        facts: [
          { a: 2, b: 4, prompt: 'Two cats. How many paws?', retryPrompt: true, right: [T('Eight! Four and four.')], rightAgain: true },
          { a: 4, b: 5, right: [T('Twenty! You hopped that one already.')], rightAgain: true },
          merge({ a: 4, b: 4, prompt: 'Four cats. Front paws: eight. Back paws: eight more.', retryPrompt: true,
            right: [T('Sixteen! Eight and eight. You doubled it.')], rightAgain: true }, way('Eight and eight: sixteen.')),
          [3, 4],
          merge({ a: 4, b: 7, prompt: 'Seven cats. Front paws: fourteen. Back paws: fourteen more. Fourteen and fourteen: ten and ten, then four and four.', retryPrompt: true,
            right: [T('Twenty-eight! You doubled fourteen.')], rightAgain: true }, way('Ten and ten make twenty. Four and four make eight. Twenty-eight.')),
          merge({ a: 4, b: 8, lit: 28, prompt: 'Eight cats. Seven cats made twenty-eight. One more cat: four more paws.', retryPrompt: true,
            right: [T('Thirty-two! The biggest new one.')], rightAgain: true }, way('Twenty-eight, and four more: thirty-two.')),
          { a: 4, b: 6, prompt: 'Six cats? That’s YOUR count!', retryPrompt: true, right: [T('Twenty-four! Four a night, for six nights.')], rightAgain: true },
          { a: 7, b: 4, prompt: 'Seven cats? You did that one the other way round.', retryPrompt: true, right: [T('Twenty-eight! Same fact.')], rightAgain: true },
          { a: 8, b: 4, check: true, right: [T('Thirty-two! Same fact.')], rightAgain: true },
          [10, 4]
        ],
        praise: ['Two twos make a four!', 'Four more, every time!'],
        fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: 'That’s the fours.'
      }),

      // The twenty-eight, every path: seven nights of four marks in the sand, two and two. On the 4s, set
      // and fact; one fact, so the lesson stays the 4s' own Count. A miss lights the marks a night at a time,
      // hopping by fours; its fillers are two easy fours the lesson lends, drawn as nights, never 4 × 4.
      'ch08-gone': merge(NIGHTS, {
        table: 4, teacher: 'tallyheart', picture: { kind: 'marks', layout: 'pairs' },
        facts: [merge({ a: 4, b: 7, prompt: [{ kind: 'caption', text: 'Four gone a night, for seven nights. How many gone?' }], retryPrompt: true,
          right: [T('Twenty-eight! Just like seven cats’ paws.')], rightAgain: true }, way('Two and two, every night. Fourteen and fourteen: twenty-eight.'))],
        help: 'picture', helpIntro: HOP, helpIntroFar: HOP_FAR,
        fillFrom: 'ch08-fours', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.', avoid: [[3, 4], [4, 4]],
        praise: [], miss: MISS, missLast: LAST, done: null
      }),

      // Hail's riddle (optional): three dogs and her, four paws each. A miss lights the paws an animal at a
      // time as she hops by fours; she lends two easy fours from this morning in her own picture (two dogs,
      // three dogs: never five or six animals, the field has four) and asks again in her words.
      'ch08-hail': {
        table: 4, thing: 'paw', things: 'paws', unit: 'dog', units: 'dogs', teacher: 'hail', ask: '{a} × {b}',
        picture: { kind: 'dogs' }, who: FIELD,
        facts: [{ a: 4, b: 4, prompt: [{ who: 'hail', text: 'How many paws go round and round this field?' }], retryPrompt: true,
          right: [{ who: 'hail', text: 'SIXTEEN! Did you count them? ALL of them? Can I count YOURS?' }], rightAgain: true }],
        help: 'picture', helpIntro: 'Hop by fours! Four, eight…', helpIntroFar: 'Hop by fours! Four, eight…',
        fillFrom: 'ch08-fours', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one!', avoid: [[4, 5], [4, 6]],
        praise: [], miss: MISS, missLast: LAST, done: null
      },

      // Snip's share, told path, at the weasel holes: two marks a night for seven nights, scratched in the
      // earth at the bank's foot (the mud), on the 2s, a table she knows. Her right line is her own whisper.
      'ch08-snip': merge(NIGHTS, {
        table: 2, teacher: 'tallyheart', picture: { kind: 'marks', ground: 'mud' },
        facts: [{ a: 2, b: 7, prompt: [{ kind: 'caption', text: 'You scratch two marks a night, for seven nights. How many did Snip carry?' }], retryPrompt: true,
          right: [{ who: 'player', kind: 'whisper', text: 'Fourteen!' }], rightAgain: true }],
        help: 'picture', helpIntro: 'Let’s hop it together. Two, four…', helpIntroFar: 'Let’s hop it together. Two, four…',
        fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
        praise: [], miss: MISS, missLast: LAST, done: null
      }),

      // Snip's share, kept path: the told sum in Riffle's voice throughout
      'ch08-riffle': merge(NIGHTS, {
        table: 2, teacher: 'riffle', picture: { kind: 'marks', ground: 'mud' },
        facts: [{ a: 2, b: 7, prompt: [{ kind: 'caption', text: 'You scratch two marks a night, for seven nights. How many did Snip carry?' }], retryPrompt: true,
          right: [{ who: 'player', kind: 'whisper', text: 'Fourteen!' }], rightAgain: true }],
        help: 'picture', helpIntro: 'Hop by twos! Two, four…', helpIntroFar: 'Hop by twos! Two, four…',
        fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one!', againIntro: 'That one again!',
        praise: [], miss: 'There! Again in a bit.', missLast: 'There! Now you’ve seen it.', done: null
      })
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'The Night Trail',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: '{name}paw’s dream that night stayed under the moss.',
      // Seven entries on every path, eight with Hail, nine or ten sentences: who walked the trail with her
      // (told, Tallyheart, who had heard the thieves and let them go; kept, Riffle, and Tallyheart waiting at
      // home). Nothing says which way she went. The cat is named wherever a tom's “he” could mean another animal.
      recap: [
        { text: 'At the seventh morning count, four more pieces were gone from the back row: twenty-eight in seven nights.' },
        { text: 'Tallyheart taught {name}paw {their} eighth Count, paws: the fours. A four is two twos.' },
        { when: { ch3Told: true }, text: 'That night, {name}paw and Tallyheart, who had heard the thieves come and let them go, followed the trail all the way to the weasel holes by the train tracks.' },
        { when: { ch3Told: false }, text: 'That night, {name}paw and Riffle followed the thieves’ trail all the way to the weasel holes by the train tracks.' },
        { when: { foundHail: true }, text: 'In the Barking Field, {name}paw found Hail, a bouncy speckled dragonet who lives in a hollow log and lets the dogs think she is a dog.' },
        { text: 'The thieves were two weasels, Snip and Snatch, and {name}paw heard Reynard brag that once the Clans chase the dragon away, the dry den under the Old Bridge will be his.' },
        { text: 'In the weasels’ stash lay prey from both Clans, and a heap of tower glass. The “scale” was only ever glass, and {name}paw took one small piece, for proof.' },
        { when: { ch3Told: true }, text: 'Tallyheart says it all goes to the Gathering, where every Clan should hear it.' },
        { when: { ch3Told: false }, text: 'Tallyheart was waiting at home, more scared than cross, and {name}paw told her everything but the dragonets.' },
        { text: 'At bedtime, the grey tom and {name}paw counted their paws: eight, between them.' }
      ],
      // the sixth of the seven dragonets' pages: only for a cat who has found her
      dragonet: [
        { id: 'hail', name: 'Hail', when: { foundHail: true }, pose: 'bounce',
          lines: [
            'White with grey speckles, and the bounciest of the clutch.',
            '{name}paw found her in a hollow log in the Barking Field, where the dogs think she is a dog.',
            'She says five, and that she’s the BOUNCIEST. Five more claws, counted.'
          ] }
      ]
    },

    teaser: {
      title: 'Chapter 9: Featherlight',
      lines: [
        'Sprinkle has to fly by the full moon.',
        'How do you mend a dragon’s wing?'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
