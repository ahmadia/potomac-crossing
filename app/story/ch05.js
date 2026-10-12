/* Chapter 5: Riffle’s River.
 *
 * The text (docs/chapters/05-riffles-river.md, v0.4) cut into graphic-novel panels, per the frame
 * contract in docs/build.md (its sections for chapters 2 to 5; the text’s “Art needs” and “Build”
 * notes are the spec for the sets, the Counts sets, the Case File’s cards and the pages she taps).
 * Each frame is one moment: a drawn scene, a written storyboard (`board`) for a future illustrator,
 * short captions, speech balloons and sound effects (two frames say where their sound is lettered:
 * the Roar’s `sfxAt`, in the sky, and the “blub…” on the way home; three, whose caption runs on into
 * the sound, say it in words for a child who listens: `sfxRead`, never lettered), and exactly one
 * interaction. Frame ids run in reading order. A choice’s outcomes carry a letter and rejoin at a plain number:
 *   a light choice     its two outcomes at the next number, `a` and `b` (f051a, f051b), one panel
 *                      each; her question for Patience has two panels on its first (f086a, f087a);
 *                      two light choices have one answer for both options and no outcome panel
 *                      (the old otter’s rules, f039; the den’s first question, f152);
 *   the tower (f021)   going up is `a` (f022a…f035a: chapter 4’s way up and roof, its own frames,
 *                      copied here by `roof()`), “Not today” is `b` (f022b); both meet at the Crossing;
 *   the raft (f057)    leaning over is `a` (f058a…f065a, “Under the raft”), looking up is `b` (f058b);
 *   the witness (f066) the otters first is `a` (f067a…f074a, “What the otters heard”); the heron
 *                      first goes straight on to the marsh (f075);
 *   the reeds (f098)   keeping still is `a` (f099a…f112a, “The pale reed”); each of the three loud
 *                      ways out is two panels, her yell and what it does (f099b f100b, f101b f102b,
 *                      f102c f103c), and all meet at “Twenty fish” (f113);
 *   the slip (f121)    asking is `a` (f122a, then “Under the raft” again, f123a…f130a, and the
 *                      bubbles, f131a); “Puddles. Fine.” is `b` (f122b, f123b).
 * “Under the raft” and “What the otters heard” are each written once, as a function that returns
 * its frames, and read in one of two places and two lights: after the Roar, or on the way home in
 * the late gold (`late: true`). The second copy of the otters (f132…f139) sits behind `when: {
 * ch5First: 'heron' }, else` on its first frame.
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line that reacts to a
 * balloon goes in the next panel, and a choice’s spoken option is not echoed as a balloon. A line the
 * text marks [if …] carries a `when`. Where a flag changes the picture, or the line is a screen of
 * its own, the panel is a frame with a `when` (the page turns straight past it for everyone else:
 * to its `else` where it names one, and otherwise to wherever it leads):
 *   specialty     f003 and f005 (noticing: her Tap on the dug earth, and the prints), f004 (everyone
 *                 else’s gap); f091 and f093 (climbing: her Tap on the pole, and the view from its
 *                 top), f092 (everyone else’s prints): each trio stands in a line, f003 → f004 →
 *                 f005, so a reader passes over the one or two that are not hers and every frame is
 *                 on the storyboard’s line; f082 (friends: a feather lifts); f114 (a
 *                 swimmer without the water worry: a wet paw); f160 (noticing: Waffles was up all
 *                 night); f094 (noticing, or the otters first)
 *   foundSquall   f021 (the roof offered again: not for a cat who met him in chapter 4 and not
 *                 here), f089 (“Just what Squall saw!”)
 *   ch5Roof       f037 and f038 (“I found Squall!” … “Raft first.”), f145 (her news of the littlest
 *                 brother)
 *   ch3Told       f044 (her whisper at the raft), f141 (the eyes over her branch) or f142 (the bank
 *                 checked first)
 *   worry         f045 (water: Riffle’s promise), f155 (water: “Still deep.”)
 *   ch4CaughtFly  the otters’ fourth frame (f070a, f135: “Flew. Again.”)
 *   foundPuddle   f107a and f108a (his snout in the reeds), f121 (the slip: only without it), f146
 *                 (her news of him, and “He does that.”)
 *   foundWisp     f116 (the gulp for everyone else) and f117 (the gulp with her in it, her own
 *                 small bump going down): two frames in a line, as the gap’s are; f147 (her news of
 *                 her sister)
 *   found today   f144 (nobody new: none of the three); f148 and f149 (the mud count), f161 (the
 *                 rest, whispered or kept): any of `ch5Roof`, `foundPuddle`, `foundWisp`
 * Three flags are set by reaching a frame, for good (`sets`): `foundSquall` and `ch5Roof` on the
 * roof’s last frame, `foundPuddle` on the last frame of “Under the raft” (both copies), `foundWisp`
 * on the last frame of “The pale reed”. One choice sets a flag: the witness she asks first
 * (`ch5First`).
 *
 * Voices heard and not seen: Riffle on the Roar’s panel, which is her own view (f049: his forepaw
 * and his shoulder are the picture’s); the old tom’s “Ow.” and his snore at bedtime (a caption, a
 * sound effect); Squall’s hiccup at bedtime (a caption). Wisp has no balloon anywhere: Patience
 * speaks for her. Squall is “The little dragon” and Puddle “The big-footed dragon” (the chapter’s
 * `names`, which a lesson’s lines read too) until each says his name; from then on his balloons
 * carry `name`.
 *
 * Text conventions: second person, present tense (“you”); typographic apostrophes and quotes
 * (’ “ ” …) so nothing needs escaping. Time of day comes from fx: `morning` at the pile and in the
 * Hollow, `day` from the tower to the marsh and home down the river (the way home is the day’s late
 * gold: the open river’s and the Crossing’s `late: true`), `sunset` at the Old Bridge, `dusk` at the
 * den (the fifth evening’s moon, `moon: 5`), `night` in her nest (no moon). The roof is chapter 4’s,
 * in this chapter’s own hour: `day`, not chapter 4’s afternoon gold (she goes up between the lesson
 * and the Crossing). Our cat is on the raft in every marsh picture (at its very edge, a paw held
 * out over a print, on f091 and f092); from the frame where Riffle dives (f097) to the end of the
 * marsh his pole stands planted in the mud, and from the frame where Patience points at them (f090)
 * to the end of the marsh the prints stay in the mud. On the way home the string with the two spare fish lies on
 * the raft (`fish: 'spare'`, the open river’s and the Crossing’s). After “She turns for home” (f055)
 * Tallyheart is in no frame until the den. One panel is not in the text: f131a, the raft gliding
 * home after “Under the raft” with two nostrils and a “blub…” between its logs (the Build note wants
 * the bubbles on the frame after each copy of that scene, and on this path the next frame of the
 * text is at the Crossing or the Old Bridge, whose pictures have no raft to put them under). tests/story-ch05.test.js checks all of
 * this; tools/storyboard.mjs turns it into docs/storyboard/ch05.md.
 */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.story = PC.story || {};
  // The roof is chapter 4’s, run here: its frames are copied from chapter 4’s story, which the page
  // loads first. (Node, when this file is loaded alone, as tools/storyboard.mjs does: fetch it.)
  if (!PC.story.ch04 && typeof module !== 'undefined' && module.exports && typeof require === 'function') require('./ch04.js');

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
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fid(n, letter) { return 'f' + ('00' + n).slice(-3) + (letter || ''); }

  /* The five cats on the hollow’s rim, left to right (the tuck’s `who`, and the first question’s
   * picture): Murmurchime second, as in chapter 3 (she has a line from there after 9 × 9), and
   * last the grizzled old tom. */
  var RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 },
    { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  // On the rim, sitting up, both forepaws raised, claws out. In the `lesson` camera the cats at
  // `sand-left` and `sand-right` sit right in front of `rim-2` and `rim-4`, so `close` leaves those
  // two out. `tuck`: one claw curled in on each (after the Tap, never before). `tom`: his mood.
  function rim(close, tuck, tom) {
    var x = tuck ? { tuck: true } : {};
    var out = [c('clancat', 'situp', 'proud', 'rim-1', 'right', merge({ variant: 1 }, x))];
    if (!close) out.push(c('murmurchime', 'situp', 'happy', 'rim-2', 'right', x));
    out.push(c('clancat', 'situp', 'neutral', 'rim-3', 'left', merge({ variant: 3 }, x)));
    if (!close) out.push(c('clancat', 'situp', 'proud', 'rim-4', 'left', merge({ variant: 5 }, x)));
    out.push(c('grizzled', 'situp', tom || 'stern', 'rim-5', 'left', x));
    return out;
  }

  // Scene options that stay the same through a place
  // The fourth morning’s pile: four rows of ten, the back row with four empty places right in its
  // middle (chapter 4’s places), the “scale” on the bare earth behind it, where chapter 4 left it.
  // Until she walks round to it the back row is a dark band in the brambles’ shadow; then the gap
  // and the freshly dug earth; for a noticing cat tiny prints in it; then the earth swept flat.
  var ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  var PILE_SHADE = { rows: ROWS, back: 'shadow', scale: 'behind' };
  var PILE_GAP = { rows: ROWS, scale: 'behind', dug: 'big' };
  var PILE_PRINTS = merge(PILE_GAP, { prints: true });
  var PILE_SWEPT = merge(PILE_GAP, { swept: true });
  // the tree: four marks until Tallyheart scratches the fifth (f018). No bark falls today.
  var H4 = { marks: 4, glow: 'auto' };
  var H5 = { marks: 5, glow: 'auto' };
  // the tower from below, as chapter 4 drew it: Waffles’ wind chime, the red light at the very top
  var TOWER_LIT = { chime: true, light: true };
  // the Crossing: no airplane in its sky until the Roar, which the old otter names first
  var CROSS = { plane: 'none' };
  var CROSS_FUR = { plane: 'none', tuft: true };
  // the open river: its sky is empty until the light far down the river
  var RIVER = { plane: 'none' };
  // …and on the way home, in the day's late gold, with the string of two spare fish lying on the
  // logs (“Eighteen for Patience. Two to spare.”: the marsh's last panels have it on the raft, and it
  // rides home there, at the Crossing too)
  var HOMEWARD = { plane: 'none', late: true, fish: 'spare' };
  // The Old Bridge from the bank: no drag marks (they lie in the dark under the deck). Inside the
  // dark: the drag marks (the set’s default) and, beside them, Sprinkle’s big prints.
  var BANK = { drag: false };
  var UNDER = { prints: true };
  var BACK = { prints: true };
  var BACK_PAWS = { prints: true, mudPaws: 7 };
  // The den: at dusk the fifth evening’s moon, a little fatter than chapter 4’s, from outside over
  // the towers and from inside in the doorway’s sky; none at night. Riffle’s stone where she put it
  // (`stone: 'auto'`); inside, her Case File along the mossy edge of her nest (`bark: 'auto'`), the
  // two pieces about Sprinkle still under the moss (`hidden`, chapter 4’s).
  var DEN = { weather: 'clear', moon: false, stone: 'auto' };
  var DEN_DUSK = { weather: 'clear', moon: 5, stone: 'auto' };
  var DEN_DUSK_IN = merge(DEN_DUSK, { bark: 'auto', hidden: true });
  var DEN_BARK = merge(DEN, { bark: 'auto', hidden: true });
  // “found today”: she met a dragonet in this chapter (none: nobody new today)
  var NONE = { ch5Roof: false, foundPuddle: false, foundWisp: false };
  var ANY = { not: NONE };

  var frames = {

    /* ------------------------------------------------------------------ Resting his eyes */

    f001: {
      // (the old tom at the left end of the rows, the two who have just come up at the right, our cat
      // at the front and Tallyheart further back along the rows, so neither stands on the other: the
      // snore is lettered at the left of the panel, over the sleeper and nobody else)
      scene: S('pile', 'rows', PILE_SHADE,
        [c('tallyheart', 'walk', 'kind', 'crowd-3', 'left'), c('player', 'stand', 'wonder', 'beside', 'left'),
         c('grizzled', 'sit', 'sleepy', 'pile-left', 'right', { asleep: true, snail: true })], ['morning']),
      board: 'WIDE, FROM THE FRONT, SUNRISE, THE TAP PICTURE. The prey pile in its rows under the bramble arch in the first gold light, the back row only a dark band in the brambles’ shadow, and at the front the grizzled old tom sitting as straight as a post with his eyes shut, a snail halfway up one ear. Our cat and Tallyheart have just come up on the other side. In play his nose glows softly; a tap on it makes his whiskers jump and the snail pull in its horns, and turns the page, and a tap anywhere else only makes him snore again. Captions top left; the snore lettered over his head.',
      caption: [
        'At sunrise, the old tom sits by the prey pile, as straight as a post. He’s guarding.',
        'He’s guarding with his eyes shut. A snail is halfway up his ear.'
      ],
      sfx: 'SNNNRRRK.',
      scratch: { tap: 'nose', prompt: '**Tap** his nose to wake him up.', label: 'Wake him up.', miss: 'snnnrrk…', next: 'f002' }
    },

    f002: {
      // the old tom’s four balloons are this Counts frame’s own: read on its page before she starts
      // (three balloons or more are not said again over the first question)
      scene: S('pile', 'rows', PILE_SHADE,
        [c('tallyheart', 'sit', 'solemn', 'crowd-3', 'left'), c('player', 'sit', 'happy', 'beside', 'left'),
         c('grizzled', 'sit', 'scared', 'pile-left', 'right', { snail: 'in' })], ['morning']),
      board: 'WIDE, FROM THE FRONT, COMEDY BEAT, THEN THE COUNTS. The old tom has shot awake, eyes like saucers, fur on end, the snail on his ear pulled right into its shell; Tallyheart sits across the rows from him, perfectly deadpan, our cat beside her. In the Counts picture the three front rows light one at a time as our cat walks along them, with no number shown, and the back row stays a dark band. Caption top left, his balloons loud then sheepish, hers dry, our cat’s last and smallest; the keypad sits below the panel.',
      caption: ['He blinks.'],
      say: [
        { who: 'grizzled', text: 'WHO GOES THERE? Oh. The counting cat. I was resting my eyes.' },
        { who: 'tallyheart', text: 'All night?' },
        { who: 'grizzled', text: 'They were VERY tired.' },
        { who: 'player', text: 'You have a snail.' }
      ],
      counts: { set: 'ch05-pile', next: 'f003' }
    },

    f003: {
      // a noticing cat only: her Tap on the freshly dug earth, which turns to its close-up. (A frame
      // has one interaction, so the gap is two frames with opposite `when`s, one after the other:
      // whichever does not show to her is passed over, so her Tap lands on her prints, and every
      // other cat's page turns from the gap to the old tom. No `else`: each of the three is on the
      // line, where the storyboard lists it.)
      when: { specialty: 'noticing' },
      scene: S('pile', 'gap', PILE_GAP,
        [c('player', 'crouch', 'wonder', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM, THE TAP PICTURE, A NOTICING CAT ONLY. Our cat has walked round to the back row, out of the bramble shadow now: three pieces, then four bare places pressed into the earth, then three more, and behind the hole a soft, crumbly heap of freshly dug earth. In play the dug earth glows softly; a tap on it turns the page to its close-up, and a tap anywhere else only rustles the brambles. Captions top left, well clear of the gap.',
      caption: ['Then the back row. Right in the middle: four empty spaces. Again.', 'You didn’t count that. You just saw it.'],
      scratch: { tap: 'earth', prompt: '**Tap** the freshly dug earth behind the gap.', label: 'Look at the dug earth.', miss: 'rustle…', next: 'f004' }
    },

    f004: {
      when: { not: { specialty: 'noticing' } },
      scene: S('pile', 'gap', PILE_GAP,
        [c('player', 'crouch', 'wonder', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM, THE REVEAL, EVERY CAT BUT A NOTICING ONE. Our cat has walked round to the back row, out of the bramble shadow now, and stops dead: three pieces, then four bare places pressed into the earth, then three more. The hole sits right in the middle of the panel, exactly where yesterday’s was. Captions top left, well clear of the gap.',
      caption: ['Then the back row. Right in the middle: four empty spaces. Again.', 'You didn’t count that. You just saw it.'],
      next: 'f005'
    },

    f005: {
      when: { specialty: 'noticing' },
      card: 'prints-pile',
      scene: S('pile', 'gap-close', PILE_PRINTS, [], ['morning']),
      board: 'EXTREME CLOSE-UP, A NOTICING CAT ONLY. The dug earth behind the gap, close enough to count its crumbs: a short line of tiny prints runs across the loose soil, each a little pad with its toes close together, and along the bottom edge the gap’s pressed places. A small inset shows our cat’s own paw beside one, twice its size. One caption at the top; the new card appears under the panel, an eye in its corner.',
      caption: ['Tiny prints. Each is half the size of yours.'],
      next: 'f006'
    },

    f006: {
      scene: S('pile', 'gap', PILE_SWEPT,
        [c('grizzled', 'walk', 'stern', 'behind', 'left'), c('player', 'sit', 'wonder', 'pile-left', 'right'),
         c('tallyheart', 'sit', 'solemn', 'pile-right', 'left')], ['morning']),
      board: 'MEDIUM, COMEDY BEAT. The old tom has stomped all the way round the four rows to the back one and glares down at the hole, his tail lashing across the dug earth behind him and sweeping it flat in long strokes. Our cat and Tallyheart sit at the two ends of the row, watching him. Caption top left; his balloon loud and outraged.',
      caption: ['The old tom stomps around the pile to look.'],
      say: [{ who: 'grizzled', text: 'The BACK row? AGAIN?' }],
      next: 'f007'
    },

    f007: {
      scene: S('pile', 'low', PILE_SWEPT,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('tallyheart', 'sit', 'worried', 'beside', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, A QUIET BEAT. Beside the rows Tallyheart looks slowly from the old tom’s post at the front to the gap at the back, working something out and not getting there. Our cat watches her; behind the pile the earth lies swept smooth, with nothing on it to show anyone. Caption top left for a noticing cat; her balloon slow, a question for nobody.',
      caption: [{ when: { specialty: 'noticing' }, text: 'His tail sweeps the prints away. Nothing left to show anyone. But you saw them.' }],
      say: [{ who: 'tallyheart', text: 'Why is it always the back?' }],
      next: 'f008'
    },

    f008: {
      scene: S('pile', 'wide', PILE_SWEPT,
        [c('glintstar', 'stand', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'right'),
         c('player', 'sit', 'worried', 'pile-left', 'right'), c('snorter', 'sit', 'proud', 'crowd-1', 'right'),
         c('grizzled', 'sit', 'stern', 'crowd-3', 'left')], ['morning']),
      board: 'WIDE. Cats crowd in round the rows, and Glintstar rises on the fountain’s edge at the right, silver and still, to say the count out loud for the whole Clan. At the left the black-and-white apprentice puffs out his chest, quite sure he knows where the prey is going. Her balloon cool and level; his cheerful, the last word enormous.',
      say: [
        { who: 'glintstar', text: 'Four more. Sixteen pieces in four nights.' },
        { who: 'snorter', text: 'That dragon is getting FAT.' }
      ],
      next: 'f009'
    },

    f009: {
      scene: S('pile', 'low', PILE_SWEPT,
        [c('player', 'sit', 'solemn', 'pile-left', 'right'), c('tallyheart', 'sit', 'kind', 'beside', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, A QUIET BEAT. Our cat sits very still beside the rows with its mouth shut, and over its head a small thought bubble holds a shy grey dragonet with not one mouse anywhere near her. On the told path Tallyheart’s whiskers twitch at the same thought; on the kept path she is only looking at the pile. One caption at the top, by the path she took.',
      caption: [
        { when: { ch3Told: true }, text: 'Tallyheart’s whiskers twitch. You both know a dragon who hasn’t taken one mouse.' },
        { when: { ch3Told: false }, text: 'You know a dragon who hasn’t taken one mouse. You don’t say a word.' }
      ],
      next: 'f010'
    },

    f010: {
      scene: S('pile', 'wide', PILE_SWEPT,
        [c('glintstar', 'sit', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'kind', 'pile-right', 'right'),
         c('player', 'sit', 'wonder', 'pile-left', 'right'), c('snorter', 'sit', 'wonder', 'crowd-1', 'right'),
         c('grizzled', 'sit', 'proud', 'crowd-3', 'left')], ['morning']),
      board: 'WIDE, COMEDY BEAT. Glintstar gives her order from the fountain’s edge, looking straight at Tallyheart, who dips her head. Below them the old tom lifts his chin and announces his own plan for tonight, and a small inset shows it: one very prickly pinecone. Her balloon level; his grim and proud.',
      say: [
        { who: 'glintstar', text: 'Tallyheart. By tomorrow night, I want proper guards.' },
        { who: 'grizzled', text: 'Tonight, I’m sitting on a pinecone.' }
      ],
      next: 'f011'
    },

    /* ------------------------------------------------------------------ Nine lives */

    f011: {
      // the warm-up’s hard pick comes first, so none of these lines is said again over it (`intro: false`)
      scene: S('hollow', 'wide', H4,
        rim().concat([c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'happy', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THEN THE COUNTS. The sandy Training Hollow in the morning sun, four claw marks on the leaning tree, and along the rim five cats sitting up on their haunches with their forepaws in the air and every claw out: the little tortoiseshell warrior second, the grizzled old tom last. Tallyheart waits past the tree and our cat sits ready in the sun patch. For the warm-up a picture of cats sitting up in a row appears, ten front claws each; after a miss she swipes the sand twice a cat and hops along by tens. Caption top left, her balloon bright; the keypad sits below the panel.',
      caption: ['In the Training Hollow, five cats sit up on the rim, claws out.'],
      say: [{ who: 'tallyheart', text: 'Tens first, to wake up your whiskers.' }],
      counts: { set: 'ch05-tens', intro: false, next: 'f012' }
    },

    f012: {
      scene: S('hollow', 'lesson', H4,
        rim(true).concat([c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart sits down on the sand in front of our cat with the rim cats still sitting up behind them, and holds the last answer up like a prize before she moves on. Our cat’s ears prick: something new is coming. Her balloon warm, two short sentences.',
      say: [{ who: 'tallyheart', text: 'Hold on to that fifty. Today’s Count is the nines.' }],
      next: 'f013'
    },

    f013: {
      scene: S('hollow', 'lesson', H4,
        rim(true, false, 'proud').concat([c('tallyheart', 'situp', 'proud', 'sand-left', 'right', { size: 1.1 }), c('player', 'sit', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM, LESSON. Tallyheart sits up on her haunches and holds out both forepaws toward our cat, all ten claws flicking out at once. Up on the rim behind her the old tom, sitting up too, lifts his grey chin to back her up. Caption top left, a small SHHNK! by each paw; her balloon first, then his, very solemn.',
      caption: ['Tallyheart holds out both forepaws.'],
      sfx: 'Shhnk! Shhnk!',
      say: [
        { who: 'tallyheart', text: 'Ten front claws. And every cat has nine lives.' },
        { who: 'grizzled', text: 'The elders swear by it. I’m an elder. I swear by it.' }
      ],
      next: 'f014'
    },

    f014: {
      // hers is the only tucked claw before the Tap (and our cat’s, copying her): the rim keeps all ten out
      scene: S('hollow', 'lesson', H4,
        rim(true).concat([c('tallyheart', 'situp', 'kind', 'sand-left', 'right', { size: 1.1, tuck: true }),
          c('player', 'situp', 'wonder', 'sand-right', 'left', { tuck: true })]), ['morning']),
      board: 'MEDIUM, LESSON. Tallyheart, still sitting up, curls one claw back into her paw: nine long claws out, and one dark, tucked place where the tenth was. Our cat has sat up to copy her, tongue out with the effort, one small claw curled in too; the rim cats behind keep all ten out. Caption top left; her balloon counts it out.',
      caption: ['Tallyheart curls one claw back in.'],
      say: [{ who: 'tallyheart', text: 'The elders count their lives on their claws. Nine claws out. One tucked in.' }],
      next: 'f015'
    },

    f015: {
      scene: S('hollow', 'lesson', H4,
        rim(true, false, 'solemn').concat([c('tallyheart', 'situp', 'happy', 'sand-left', 'right', { size: 1.1, tuck: true }),
          c('player', 'situp', 'wonder', 'sand-right', 'left', { tuck: true })]), ['morning']),
      board: 'MEDIUM, COMEDY BEAT. Our cat peers at its own tucked claw and asks, and the old tom answers from the rim without a flicker, as if it were the oldest wisdom in the Clan. Tallyheart’s whiskers spread in a grin she tries to hide. Our cat’s balloon curious; his deadpan.',
      say: [
        { who: 'player', text: 'What’s the tucked one for?' },
        { who: 'grizzled', text: 'Hanging on to the other nine.' }
      ],
      next: 'f016'
    },

    f016: {
      scene: S('hollow', 'wide', H4,
        rim().concat([c('tallyheart', 'stand', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. All five rim cats sit up with every claw out; Tallyheart stands apart past the trunk, ready to count along. In play the counting picture takes the panel: five pairs of forepaws in a row, each cat small behind its own, all fifty claws lit and a big 50 over them, the next cat glowing softly; each tap curls one of its claws in, the claw goes dark and the big number steps back by one. No number is ever shown under a cat. Her balloon at the top.',
      say: [{ who: 'tallyheart', text: 'So a nine is one less than a ten. One claw tucked in. Touch each cat, and tuck one in.' }],
      skip: { table: 9, groups: 5, tuck: true, who: RIM, thing: 'claw', things: 'claws', keep: true, prompt: '**Tap** the cats, left to right.', next: 'f017' }
    },

    f017: {
      // Murmurchime is in this frame’s cast: after 9 × 9 she has a line from the rim
      scene: S('hollow', 'wide', H4,
        rim(false, true).concat([c('tallyheart', 'sit', 'laugh', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'happy', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THEN THE COUNTS. On every rim cat nine claws are lit and one is tucked in dark, a big 45 floats over the picture, and no cat has a number under it; Tallyheart, past the tree, says the whole sum in order. Then for every question a picture of cats sitting up in a row appears: all ten claws light on each, one curls in on each, and the claws go quiet before she types. After a miss Tallyheart swipes the sand twice a cat and hops by tens, then rubs out one line a cat and steps back by ones. Her balloons at the top, the first one huge; the keypad sits below the panel.',
      say: [
        { who: 'tallyheart', text: 'FORTY-FIVE!', kind: 'shout' },
        { who: 'tallyheart', text: 'Five cats, nine lives each. Five tens make fifty. Tuck five in: forty-five. Five times nine makes forty-five.' }
      ],
      counts: { set: 'ch05-nines', next: 'f018' }
    },

    f018: {
      scene: S('hollow', 'tree', H5, [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score a fifth claw mark into the bark, beside the fourth, in the second row under the first three; the older marks look a little deeper and darker than the new one. No bark falls today: she has plenty. The SKRITCH! runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'A fifth claw mark.'],
      sfx: 'SKRITCH!',
      next: 'f019'
    },

    f019: {
      scene: S('hollow', 'lesson', H5,
        [c('player', 'sit', 'proud', 'sand-left', 'right'), c('tallyheart', 'sit', 'proud', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT. Five claw marks on the leaning tree now, and Tallyheart back down on the sand, her torn ear tipped toward our cat, who sums the whole lesson up in one breath. A cat who never needed the scratches says only; a cat who did says it plainly, and Tallyheart finishes it for her. Her balloon warm; our cat’s sure of itself; her last one, for the cat who needed help, an echo of her own praise.',
      say: [
        { who: 'tallyheart', text: 'Nine lives. That’s your fifth Count. And the trickiest one so far.' },
        { who: 'player', text: 'It’s only tens. With a claw tucked in.', when: { lessonClean: 'ch05-nines' } },
        { who: 'player', text: 'It’s tens. With a claw tucked in.', when: { not: { lessonClean: 'ch05-nines' } } },
        { who: 'tallyheart', text: 'That’s all a nine is.', when: { not: { lessonClean: 'ch05-nines' } } }
      ],
      next: 'f020'
    },

    /* ------------------------------------------------------------------ Ask the river */

    f020: {
      scene: S('hollow', 'wide', H5,
        [c('player', 'stand', 'happy', 'sunpatch-3', 'right'), c('tallyheart', 'sit', 'kind', 'tree', 'left')], ['morning']),
      board: 'WIDE. The Hollow emptying, five marks on the tree, and Tallyheart sending our cat off toward the river with one paw lifted like a counting cat giving an exact rule. Our cat is already on its feet with its tail up; a small inset shows a log raft and, beyond it, reeds standing in mud with a line drawn round them. Her balloon brisk, three sentences.',
      say: [{ who: 'tallyheart', text: 'Now go and ask your river. And stay on the otters’ raft. The marsh mud belongs to ReedClan.' }],
      next: 'f021'
    },

    f021: {
      // The roof offered again, on one screen: only for a cat who has not met Squall, or who met him
      // here on an earlier reading (she reads the roar and the choice his way). A cat who met him in
      // chapter 4 goes straight to the Crossing. Going up leads to chapter 4’s roof, whose last frame
      // sets `foundSquall` and `ch5Roof`; “Not today” sets nothing.
      when: { not: { foundSquall: true, ch5Roof: false } },
      else: 'f036',
      scene: S('tower', 'up', merge(TOWER_LIT, { roar: true }),
        [c('player', 'lookup', 'wonder', 'foot', 'right')], ['day']),
      board: 'LOW ANGLE, TALL PANEL, NOT FOR A CAT WHO MET HIM IN CHAPTER FOUR. Straight up the glass tower by day: our cat small at its foot with its head tipped right back, nobody at the railing nineteen floors up, and at the very top the little red light on its mast, with jagged roar lines shaking the sky on both sides of the roof. The roar is lettered huge down the glass, its hiccup small at the end. Captions at the top, the second and third for a cat who has not met him; the choices sit below the panel.',
      caption: [
        'From the tallest tower:',
        { when: { foundSquall: false }, text: 'Sprinkle’s littlest brother is still up there.' },
        { when: { foundSquall: false, specialty: 'climbing' }, text: 'Balcony, balcony, balcony, roof. You could still climb that.' }
      ],
      sfx: 'RAWWWRRR… hic!',
      // (heard, with Read to me on: “From the tallest tower:” “a roar, and a tiny hiccup.”)
      sfxRead: 'a roar, and a tiny hiccup.',
      choice: {
        options: [
          { label: 'Go up and find him. The river can wait a little.', labelWhen: [{ when: { ch5Roof: true }, label: 'Go up and see Squall again.' }], sets: {}, next: 'f022a' },
          { label: 'Not today. Riffle is waiting.', labelWhen: [{ when: { ch5Roof: true }, label: 'Not today. He’s guarding.' }], sets: {}, next: 'f022b' }
        ]
      }
    },

    /* ------------------------------------------------------------------ Up the tower, and the
     * littlest dragonet (a): f022a…f035a are chapter 4’s frames, added below by roof() */

    /* ------------------------------------------------------------------ Not today (b) */

    f022b: {
      // chapter 4’s “Not today” panel, a day on: her one new line, with the pet name she never stops using
      scene: S('tower', 'up', TOWER_LIT,
        [c('waffles', 'peer', 'sad', 'railing', 'left'), c('player', 'walk', 'kind', 'foot', 'left')], ['day']),
      board: 'LOW ANGLE, TALL PANEL. Straight up the glass tower: Waffles drooping over her railing nineteen floors up, bow at half mast, and our cat at the tower’s foot already turning toward the hedge and the river. The red light blinks at the very top. Her wail runs all the way down the glass.',
      say: [{ who: 'waffles', text: 'AGAIN, {petname}?', kind: 'shout' }],
      next: 'f036'
    },

    /* ------------------------------------------------------------------ The Crossing */

    f036: {
      scene: S('crossing', 'wide', CROSS,
        [c('otter', 'stand', 'stern', 'rock-right', 'right', { variant: 1 }), c('otter', 'sit', 'happy', 'rock-left', 'right', { variant: 2 }),
         c('otter', 'float', 'happy', 'water', 'left', { variant: 3 }), c('player', 'walk', 'happy', 'pebbles', 'right'),
         c('riffle', 'hug', 'proud', 'raft-1', 'left', { holds: 'pole' })], ['day']),
      board: 'WIDE. The Crossing by day: grey rocks running out into the wide shining river, the ferry otters sunning on them, and tied up at the last rock the log raft, four logs lashed with vines. On it stands Riffle, hugging a pole twice his own size and beaming; the old ferry otter, grey in the muzzle, stands on the nearest rock with his paws on his hips. Our cat trots out along the rocks. Caption top left; Riffle’s balloon a crow, the old otter’s flat.',
      caption: ['At the Crossing, Riffle stands on the ferry raft, hugging a pole twice his size.'],
      say: [
        { who: 'riffle', text: 'My RAFT!', kind: 'shout' },
        { who: 'otter', text: 'MY raft. You hold the pole.' }
      ],
      next: 'f037'
    },

    f037: {
      // only a cat who went up this morning: chapter 4’s “Raft first”, a day late, in two panels
      when: { ch5Roof: true },
      scene: S('crossing', 'raft', CROSS,
        [c('player', 'sit', 'happy', 'shore', 'right'), c('riffle', 'hug', 'wonder', 'raft-1', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM TWO-SHOT, ONLY FOR A CAT WHO WENT UP THE TOWER TODAY. At the rocks’ edge our cat stretches up toward the raft and whispers its news, and a small inset shows it: a little slate dragonet on a far roof, and two long low smudges going to two shiny lines. Riffle bends down from the logs to listen, still wrapped round his pole. Both balloons are our cat’s, small whispers.',
      say: [
        { who: 'player', text: 'I found Squall! Sprinkle’s littlest brother!', kind: 'whisper' },
        { who: 'player', text: 'He sees two skinny shapes go to the tracks. Every night.', kind: 'whisper' }
      ],
      next: 'f038'
    },

    f038: {
      when: { ch5Roof: true },
      scene: S('crossing', 'raft', CROSS,
        [c('player', 'sit', 'kind', 'shore', 'right'), c('riffle', 'hug', 'worried', 'raft-1', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM TWO-SHOT, ONLY FOR A CAT WHO WENT UP THE TOWER TODAY. Riffle’s whiskers stand straight out and he squeezes his pole in both arms like a pillow, the way he squeezes his tail; then he makes up his mind, very firmly, about the order of things. Our cat lets him. Caption top left; his first balloon a squeak, his second two decided words.',
      caption: ['Riffle hugs his pole.'],
      say: [
        { who: 'riffle', text: 'The TRACKS? At NIGHT?' },
        { who: 'riffle', text: 'Raft first.' }
      ],
      next: 'f039'
    },

    f039: {
      // the Roar is named and explained here, once, by the otter who runs it, before anyone else says
      // the word and before any skymonster appears. A light choice: one answer does for both.
      // (He is the only otter in this picture: a speaker's second balloon belongs to the second of them.)
      scene: S('crossing', 'rocks', CROSS,
        [c('otter', 'stand', 'stern', 'rock-right', 'left', { variant: 1 }), c('player', 'sit', 'wonder', 'pebbles', 'right')], ['day']),
      board: 'MEDIUM, ON THE ROCKS. The old ferry otter draws himself up in front of our cat, long white whiskers trailing, and lays down the law of his raft, counting the three rules off on one webbed paw. A small inset shows what he means: a log raft, an apprentice sitting on it, and a tiny airplane far above. Our cat listens with its ears forward. His two balloons gruff; the choices sit below the panel.',
      say: [
        { who: 'otter', text: 'Every apprentice sits on my raft while a skymonster goes over. That’s the Roar. It’s the courage test.' },
        { who: 'otter', text: 'Three rules: sit. Stay. No jumping in.' }
      ],
      choice: {
        options: [
          { label: '“What if I move?”', sets: {}, next: 'f040' },
          { label: '“What if I sneeze?”', sets: {}, next: 'f040' }
        ]
      }
    },

    f040: {
      scene: S('crossing', 'wide', CROSS,
        [c('otter', 'stand', 'happy', 'rock-right', 'right', { variant: 1 }), c('otter', 'sit', 'laugh', 'rock-left', 'right', { variant: 2 }),
         c('otter', 'float', 'laugh', 'water', 'left', { variant: 3 }), c('player', 'sit', 'happy', 'pebbles', 'right'),
         c('riffle', 'hug', 'shout', 'raft-1', 'left', { holds: 'pole' })], ['day']),
      board: 'WIDE, COMEDY BEAT. The old otter jerks a thumb at the raft, where Riffle is hugging his pole, and the other ferry otters roll about on their rocks. Riffle shouts back across the water, deeply wronged by one whole try. The old otter’s balloon dry; Riffle’s a yell from the raft.',
      say: [
        { who: 'otter', text: 'Then you sit through it again tomorrow. Like Riffle. Eleven times.' },
        { who: 'riffle', text: 'TEN!', kind: 'shout' }
      ],
      next: 'f041'
    },

    f041: {
      // her first frame at the Crossing: after the old otter has said what the Roar is
      scene: S('crossing', 'rocks', CROSS,
        [c('tallyheart', 'sit', 'proud', 'rock-high', 'left'), c('otter', 'sit', 'happy', 'rock-left', 'right', { variant: 2 }),
         c('player', 'lookup', 'happy', 'pebbles', 'right')], ['day']),
      board: 'MEDIUM, ON THE ROCKS. Up on the tallest rock, with the whole river behind her, sits big ginger Tallyheart, tail curled round her paws, as if she had been there all morning. Our cat tips its head back to look up at her, delighted. Caption top left; her balloon warm and sure.',
      caption: ['And on the rocks sits Tallyheart.'],
      say: [{ who: 'tallyheart', text: 'A mentor never misses a first Roar.' }],
      next: 'f042'
    },

    f042: {
      scene: S('crossing', 'board', CROSS,
        [c('tallyheart', 'sit', 'kind', 'rock-right', 'right'), c('player', 'stand', 'wonder', 'shore', 'right'),
         c('riffle', 'stand', 'happy', 'raft-3', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TAP PICTURE. The rocks’ last ledge at the left, the raft’s first log at the right, and a strip of deep water between them; our cat stands at the very edge with all four paws planted, Tallyheart close at its shoulder, Riffle waiting at the far end of the logs. In play the counting picture takes the panel: her own four paws at the edge of the rocks, the next one glowing softly; each tap sets it down on the logs, the raft dips, and Tallyheart counts it in words. Captions top left, by the cat she is; her balloon steady.',
      caption: [
        'The raft sits low. And the water under it is wide, and deep.',
        { when: { worry: 'water' }, text: 'Your paws won’t move.' },
        { when: { specialty: 'swimming', not: { worry: 'water' } }, text: 'Your first paw goes in the river, to say hello.' }
      ],
      say: [{ who: 'tallyheart', text: 'One paw at a time. I’ll count.' }],
      skip: { table: 1, groups: 4, paws: 'board', teacher: 'tallyheart', carry: false, prompt: '**Tap** each paw onto the raft.', next: 'f043' }
    },

    f043: {
      scene: S('crossing', 'board', CROSS,
        [c('tallyheart', 'sit', 'proud', 'shore', 'right'), c('player', 'crouch', 'happy', 'raft-1', 'left'),
         c('riffle', 'stand', 'happy', 'raft-3', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat is aboard, crouched low and wide on the first log with all four paws spread, looking back at the rocks, where Tallyheart sits at the very edge of the ledge and counts the paws over once more with her eyes. The water between them is a paw’s width. Caption top left for a cat who worries about water; her balloon proud and plain.',
      caption: [{ when: { worry: 'water' }, text: 'That’s what she promised, on your very first night.' }],
      say: [{ who: 'tallyheart', text: 'Four paws aboard. All there.' }],
      next: 'f044'
    },

    f044: {
      // told only: Glintstar’s own words from the border, in her ear (Riffle is still at the raft’s far
      // end, where the panel before has him, turned away: an otter it is too low for)
      when: { ch3Told: true },
      scene: S('crossing', 'board', CROSS,
        [c('tallyheart', 'crouch', 'kind', 'shore', 'right'), c('player', 'sit', 'wonder', 'raft-1', 'left'),
         c('riffle', 'stand', 'happy', 'raft-3', 'right', { holds: 'pole' })], ['day']),
      board: 'CLOSE-UP, AT CAT HEIGHT, THE TOLD PATH ONLY. Tallyheart stretches out from the ledge until her torn ear is almost touching our cat’s, and says it too low for an otter to hear; at the far end of the logs Riffle leans on his pole with his back to them, looking out over the river. A small inset remembers the border: the silver leader, alone on her rock. Caption top left; her whisper balloon small, its last two words smaller still.',
      caption: ['She leans close.'],
      say: [{ who: 'tallyheart', text: 'Find me something truer than a fox’s story. For her.', kind: 'whisper' }],
      next: 'f045'
    },

    f045: {
      // the water worry only: a screen of her own, before the raft leaves the rocks
      when: { worry: 'water' },
      scene: S('crossing', 'raft', CROSS,
        [c('player', 'sit', 'worried', 'raft-2', 'right'), c('riffle', 'stand', 'kind', 'raft-3', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM TWO-SHOT, ONLY FOR A CAT WHO WORRIES ABOUT WATER. On the logs, our cat sits very upright in the exact middle of the raft, as far from every edge as it can get, and Riffle plants his pole beside it and lays one webbed paw on his chest like a knight. The river round them is bright and wide. Caption top left for a swimmer; his balloon a solemn promise.',
      caption: [{ when: { specialty: 'swimming' }, text: 'It isn’t one bit like a dripping tap.' }],
      say: [{ who: 'riffle', text: 'And if you fall in, I’ll have you out before your tail gets wet. Otter’s honor.' }],
      next: 'f046'
    },

    /* ------------------------------------------------------------------ The Roar */

    f046: {
      scene: S('openriver', 'wide', RIVER,
        [c('tallyheart', 'sit', 'kind', 'far-rocks', 'right'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'stand', 'happy', 'pole', 'left', { holds: 'pole' })], ['day']),
      board: 'WIDE, THE WONDER PANEL. The raft small on a huge shining river, every ripple a spark, the glass towers standing on their heads in the water with the tallest one’s red light upside down among them, and far across, above the trees, one tall white needle of stone. Riffle poles; our cat sits in the middle of the logs, staring; Tallyheart and the otters are small on the rocks behind. Two captions, one at the top and one at the bottom, clear of the raft.',
      // (two boxes: one caption this long would go beside the panel and shrink it, and this is the big one)
      caption: ['Riffle pushes off, and the whole river shines.', 'The glass towers stand on their heads in the water.'],
      next: 'f047'
    },

    f047: {
      scene: S('openriver', 'light', merge(RIVER, { plane: 'far' }),
        [c('tallyheart', 'sit', 'kind', 'far-rocks', 'right'), c('player', 'lookup', 'wonder', 'raft-1', 'right'),
         c('riffle', 'hop', 'shout', 'raft-2', 'right')], ['day']),
      board: 'WIDE, LOOKING DOWN THE RIVER. Far down the bright water, low in the sky, hangs one small steady light, and it is coming this way. On the raft in the near corner Riffle jumps up and down with both paws flung up at it and yells; our cat, beside him, says what it really is in a voice no bigger than a moth. Caption top left; his balloon enormous, our cat’s tiny.',
      caption: ['Far down the river, a light. It grows. And grows.'],
      say: [
        { who: 'riffle', text: 'SKYMONSTER!', kind: 'shout' },
        { who: 'player', text: 'Airplane.', kind: 'whisper' }
      ],
      next: 'f048'
    },

    f048: {
      scene: S('openriver', 'raft', merge(RIVER, { plane: 'far' }),
        [c('tallyheart', 'sit', 'proud', 'far-rocks', 'right'), c('player', 'sit', 'worried', 'raft-1', 'right'),
         c('riffle', 'stand', 'shout', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS. At cat height on the raft: our cat sits small in the middle of it, ears a little back, and Riffle spins round to it with both paws out, every whisker serious. On the rocks behind them, a few raft-lengths off, Tallyheart sits up on the tall rock and the otters watch. Caption top left; his balloon a bark.',
      caption: ['It comes out very small.'],
      say: [{ who: 'riffle', text: 'Sit STILL!', kind: 'shout' }],
      next: 'f049'
    },

    f049: {
      // The Roar’s panel is her own view: her two forepaws and Riffle’s forepaw are the picture’s own,
      // so only Tallyheart, on the tall rock, is in the cast (Riffle is heard, his paw and shoulder seen).
      // The scene stays up and is drawn again at every tap, with her claws and the skymonster’s size.
      scene: S('openriver', 'log', merge(RIVER, { plane: 'far' }),
        [c('tallyheart', 'pawup', 'proud', 'far-rocks', 'right', { claws: true })], ['day']),
      board: 'POV, THE ROAR, THE TAP PICTURE. Her own two forepaws on a log of the raft, close, and planted on the same log right beside them, not touching, Riffle’s webbed forepaw, his brown shoulder at the panel’s edge; beyond the flat bright water Tallyheart sits up on the tall rock with one paw raised, and all the sky above is for the skymonster. In play each tap digs one claw into the wood and puts the next number in her own thought, the skymonster grows from a glint to a shape with wings to a belly filling the top of the panel, and a roar is lettered larger along the top; the tenth claw stays tucked. Caption top left; Riffle’s balloon comes in from his edge, Tallyheart’s call from the rocks.',
      caption: ['Riffle plops down beside you, shoulder to shoulder.'],
      say: [
        { who: 'riffle', text: 'I’m not allowed to hold your paw. But I’m right here.' },
        { who: 'tallyheart', text: 'Nine claws in the log, {name}paw! One tucked for luck!', kind: 'shout' }
      ],
      skip: {
        table: 1, groups: 9, paws: 'log', teacher: 'player', carry: false, prompt: '**Tap** to dig in your claws.',
        steps: [{ from: 1, opts: { plane: 'far' }, sfx: 'rrr…' }, { from: 4, opts: { plane: 'near' }, sfx: 'RRRrrr…' }, { from: 7, opts: { plane: 'over' }, sfx: 'RRRRRR…' }],
        next: 'f050'
      }
    },

    f050: {
      scene: S('openriver', 'raft', merge(RIVER, { plane: 'over' }),
        [c('tallyheart', 'pawup', 'proud', 'far-rocks', 'right', { claws: true }), c('player', 'sit', 'scared', 'raft-1', 'right', { buzz: true }),
         c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS, THE LOUDEST PANEL. The skymonster sweeps over, far above the raft, its white belly and its row of little round windows filling the top of the panel, and everything on the logs buzzes: our cat sits bolt still with its fur and whiskers drawn in zigzags, Riffle shoulder to shoulder beside it. Nothing blows, the water stays flat, and on the rocks Tallyheart still has her paw up. The roar is lettered across the whole sky; captions below it, the second for a cat who worries about being small; the choices sit below the panel.',
      sfx: 'ROOOOOAAAAARRRRR!',
      // (in the sky, under the airplane and clear of the pair on the logs: left to itself the lettering
      // lands across the bottom of the panel, over them)
      sfxAt: [62, 34],
      caption: [
        'It sweeps right over you. The logs buzz. Your teeth buzz. Even your whiskers buzz.',
        { when: { worry: 'small' }, text: 'You’re the smallest thing on the whole wide river. You sit still anyway.' }
      ],
      choice: {
        options: [
          { label: 'Shut your eyes and count.', sets: {}, next: 'f051a' },
          { label: 'Keep your eyes open and look up.', sets: {}, next: 'f051b' }
        ]
      }
    },

    f051a: {
      scene: S('openriver', 'raft', merge(RIVER, { plane: 'over' }),
        [c('tallyheart', 'pawup', 'proud', 'far-rocks', 'right', { claws: true }), c('player', 'sit', 'scared', 'raft-1', 'right', { buzz: true, squeeze: true }),
         c('riffle', 'sit', 'kind', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS. Our cat has screwed its eyes shut and counts by tens at the top of its small voice, each number a little higher than the last, until the roar swallows the count. Riffle sits pressed beside it, looking up for both of them. Its balloon wobbles upward and breaks off at a dash.',
      say: [{ who: 'player', text: 'Ten. Twenty. Thirty. FORTY—' }],
      next: 'f052'
    },

    f051b: {
      scene: S('openriver', 'sky', merge(RIVER, { plane: 'over', face: true }),
        [c('player', 'lookup', 'wonder', 'raft-1', 'right'), c('riffle', 'stand', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'LOW ANGLE, STRAIGHT UP. From the raft, looking straight up: the airplane’s long pale belly crossing the whole sky, and along it a row of little round windows, and at one of them a small face pressed to the glass, looking down. Our cat’s and Riffle’s heads are at the bottom edge, tipped right back. Two captions: the windows at the top left, the face at the bottom.',
      caption: ['Little round windows, all in a row.', 'At one, a small face is pressed to the glass. You know that feeling.'],
      next: 'f052'
    },

    f052: {
      scene: S('openriver', 'log', merge(RIVER, { plane: 'gone', claws: 9 }),
        [c('tallyheart', 'sit', 'proud', 'far-rocks', 'right')], ['day']),
      board: 'POV, HER OWN PAWS. The same log and the same two forepaws, nine claws dug into the wood and the tenth tucked in, not one of them moved; Riffle’s webbed forepaw is still planted beside them. Above, the sky is suddenly empty and the water is as flat as it ever was. Captions top left, the first for a sneaking cat, the last one small in all that quiet sky.',
      caption: [
        { when: { specialty: 'sneaking' }, text: 'You’ve held still for socks. You can hold still for this.' },
        'You don’t move. Not an ear. Not one of nine claws.',
        'Then it’s gone.'
      ],
      next: 'f053'
    },

    f053: {
      scene: S('openriver', 'rocks', merge(RIVER, { plane: 'gone' }),
        [c('tallyheart', 'sit', 'proud', 'far-rocks', 'left'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('riffle', 'flip', 'laugh', 'raft-2', 'left')], ['day']),
      board: 'WIDE, FROM THE RAFT, LOOKING BACK. Riffle turns a whole somersault on the logs, a ring of motion round him, and on the rocks behind, close enough to count, the three ferry otters slap their thick tails on the water in applause, spray flying. Our cat sits in the middle of it all, dazed and grinning; a small airplane is going away at the edge of the sky. Captions top left, the slaps lettered along the rocks; his shout over his own head.',
      caption: ['Riffle turns a somersault.', 'On the rocks, otter tails go'],
      sfx: 'Slap! Slap! Slap!',
      // (heard between the caption it finishes and his shout)
      sfxRead: 'Slap! Slap! Slap!',
      say: [{ who: 'riffle', text: 'YOU DID IT!', kind: 'shout' }],
      next: 'f054'
    },

    f054: {
      scene: S('openriver', 'raft', merge(RIVER, { plane: 'gone' }),
        [c('tallyheart', 'pawup', 'proud', 'far-rocks', 'right'), c('player', 'sit', 'proud', 'raft-1', 'left'),
         c('riffle', 'stand', 'happy', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS. Our cat and Riffle look back at the rocks, where Tallyheart stands tall on her rock and calls across the water, one paw still up, counting on it. The otters sit round her like a jury that has made up its mind. Her balloon carries all the way to the raft.',
      say: [{ who: 'tallyheart', text: 'Not one claw! I counted!', kind: 'shout' }],
      next: 'f055'
    },

    f055: {
      // from here to the den, no balloon in any frame is hers
      scene: S('openriver', 'rocks', merge(RIVER, { plane: 'gone' }),
        [c('tallyheart', 'walk', 'kind', 'far-rocks', 'right'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('riffle', 'sit', 'happy', 'raft-2', 'left')], ['day']),
      board: 'WIDE, FROM THE RAFT, LOOKING BACK. On the tall rock Tallyheart turns and pads away toward camp, tail high, without looking round; she has seen what she came for. Below her the grey-muzzled old otter gives our cat one small nod. Captions top left, each for its own cat.',
      caption: [
        'She turns for home.',
        { when: { specialty: 'friends' }, text: 'The old otter nods at you, once. You know a friend’s nod when you see one.' },
        { when: { worry: 'water' }, text: 'You look down. Still deep. You look at your paws. Still here.' }
      ],
      next: 'f056'
    },

    /* ------------------------------------------------------------------ Something under the raft */

    f056: {
      scene: S('openriver', 'raft', merge(RIVER, { shiver: true }),
        [c('player', 'sit', 'wonder', 'raft-1', 'right'), c('riffle', 'sit', 'happy', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS. The sky is empty and the river has gone as smooth as glass, but small rings keep spreading from under every side of the raft, and the logs ride lower in the water than four logs should. Our cat looks down at its own paws, puzzled. One caption at the top.',
      caption: ['The river goes quiet. But the raft is still shivering. And still sitting too low.'],
      next: 'f057'
    },

    f057: {
      // module-1’s first way to Puddle. Leaning over leads under the raft, whose last frame sets
      // `foundPuddle`; looking up sets nothing. A cat who knows him reads the choice his way.
      scene: S('openriver', 'edge', merge(RIVER, { shiver: true }),
        [c('riffle', 'whistle', 'shy', 'raft-2', 'right'), c('player', 'sit', 'wonder', 'raft-1', 'right')], ['day']),
      board: 'HIGH ANGLE, CLOSE ON THE LOGS. From above the raft’s edge: our cat sitting quite still, the rings still spreading from under the logs, and Riffle beside it whistling a little tune, his eyes fixed on the sky and nowhere else. He is not one bit frightened; he is being very careful not to look down. One caption at the top; the choices sit below the panel.',
      caption: ['It isn’t you. It isn’t Riffle. He’s whistling, and looking very hard at the sky.'],
      choice: {
        options: [
          { label: 'Lean over, and look under the raft.', labelWhen: [{ when: { foundPuddle: true }, label: 'Lean over, and say hello to Puddle.' }], sets: {}, next: 'f058a' },
          { label: 'Look up. Is another one coming?', labelWhen: [{ when: { foundPuddle: true }, label: 'Not now. He’s being a log.' }], sets: {}, next: 'f058b' }
        ]
      }
    },

    /* ------------------------------------------------------------------ Under the raft (a):
     * f058a…f065a, added below by underRaft() */

    f058b: {
      scene: S('openriver', 'sky', RIVER,
        [c('player', 'lookup', 'wonder', 'raft-1', 'right'), c('riffle', 'stand', 'shy', 'raft-2', 'left')], ['day']),
      board: 'LOW ANGLE, STRAIGHT UP. From the raft, looking straight up: nothing but wide blue sky and one small cloud. Our cat’s head is at the bottom edge, tipped back to search it, and beside it Riffle talks very fast, his eyes sliding away to one side. Caption top left; his balloon quick and much too cheerful.',
      // (on a second reading the option reads “Not now. He’s being a log.”: she has not looked up for
      // another airplane, so that caption is not hers; Riffle keeps the game up for both)
      caption: [{ when: { foundPuddle: false }, text: 'Only blue sky.' }],
      say: [{ who: 'riffle', text: 'Rafts shiver. Ticklish logs. VERY ticklish.' }],
      next: 'f066'
    },

    /* ------------------------------------------------------------------ Who’s first */

    f066: {
      // the chapter’s one path flag: both witnesses are always asked, only the order changes. The
      // first panel after “Under the raft”: two nostrils and a string of bubbles between the logs.
      scene: S('openriver', 'raft', merge(RIVER, { bubbles: true }),
        [c('player', 'sit', 'happy', 'raft-1', 'right'), c('riffle', 'stand', 'happy', 'pole', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM, ON THE LOGS. Riffle leans on his pole at the end of the raft and offers the whole river with one sweep of his paw: a small inset shows a knot of gossiping otters on one side and a tall still heron on the other. Between two logs, unnoticed by him, two small nostrils and a string of bubbles have come up. His balloon bouncy; the choices sit below the panel.',
      say: [{ who: 'riffle', text: 'So who’s first? Otters HEAR everything. Patience the heron SEES everything.' }],
      choice: {
        options: [
          { label: 'The ferry otters!', sets: { ch5First: 'otters' }, next: 'f067a' },
          { label: 'Patience the heron!', sets: { ch5First: 'heron' }, next: 'f075' }
        ]
      }
    },

    /* ------------------------------------------------------------------ What the otters heard (a):
     * f067a…f074a, added below by otters() */

    /* ------------------------------------------------------------------ The marsh */

    f075: {
      scene: S('marsh', 'wide', { dragonfly: 'beak' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'stand', 'happy', 'raft-2', 'right', { holds: 'pole' })], ['day']),
      board: 'WIDE, THE MARSH. The river has slid in behind a low bank into still green water: reeds taller than a cat, lily pads with frogs on them, mist lying low, and the raft nosing up to a mud flat at the left. Far off in the shallows stands a tall grey-blue bird, and among the pale reeds behind her one reed is a little paler than the rest. One caption at the top; everything here is quiet.',
      caption: ['The river slides into a wide, still marsh. In here, even the water whispers.'],
      next: 'f076'
    },

    f076: {
      // ReedClan on screen for the first time: three small cats on a far log, no faces to read
      scene: S('marsh', 'far', { dragonfly: 'beak' },
        [c('clancat', 'sit', 'neutral', 'log-1', 'left', { variant: 2 }), c('clancat', 'sit', 'neutral', 'log-2', 'left', { variant: 5 }),
         c('clancat', 'sit', 'neutral', 'log-3', 'left', { variant: 6 }), c('patience', 'stand', null, 'shallows', 'left'),
         c('player', 'sit', 'wonder', 'raft-1', 'right'), c('riffle', 'stand', 'worried', 'raft-2', 'right', { holds: 'pole' })], ['day']),
      board: 'WIDE, ACROSS THE WATER. Far across the marsh, small in the mist, three cats sit in a row on a half-sunk log, watching the raft; they are too far off to have faces, and not one of them moves. In the near corner Riffle mutters out of the side of his mouth, and our cat stares back at them. Caption top left; his balloon a low mutter.',
      caption: ['Far across it, three cats sit on a log. They don’t wave.'],
      say: [{ who: 'riffle', text: 'ReedClan. They always come in threes.', kind: 'whisper' }],
      next: 'f077'
    },

    f077: {
      scene: S('marsh', 'heron', { dragonfly: 'beak' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'stand', 'wonder', 'raft-2', 'right', { holds: 'pole' })], ['day']),
      board: 'LOW ANGLE, THE HERON. A great blue heron fills most of the panel, standing on one long dark leg in the shallows: blue-grey, her neck folded in an S, a white face with a black stripe that runs back into a thin plume, one round yellow eye, and a dragonfly fast asleep on her long yellow bill. Our cat and Riffle are small on the logs in the corner, looking up. One caption at the top.',
      caption: ['In the shallows stands a tall grey-blue bird, on one leg. A dragonfly is asleep on her beak.'],
      next: 'f078'
    },

    f078: {
      scene: S('marsh', 'mud', { dragonfly: 'beak' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'stand', 'kind', 'raft-2', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM TWO-SHOT, ON THE RAFT. Riffle bends down to our cat’s ear behind one webbed paw and explains the heron like a pup explaining a shop: a small inset shows one fish, then two. Beyond the mud the heron stands exactly as she stood, and has not looked at them once. Both balloons are his, whispers, the second puzzled.',
      say: [
        { who: 'riffle', text: 'That’s Patience. Two fish for every answer.', kind: 'whisper' },
        { who: 'riffle', text: 'Before the storm, it was ONE. Nobody knows why.', kind: 'whisper' }
      ],
      next: 'f079'
    },

    f079: {
      // Riffle’s seven questions: seven taps that count nothing; each lays a pair of fish in the cloud
      scene: S('marsh', 'wide', { dragonfly: 'beak', owed: 0 },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('riffle', 'hop', 'wonder', 'raft-2', 'right', { glow: true })], ['day']),
      board: 'WIDE, THE TAP PICTURE. Riffle hops on the spot at the raft’s end, glowing softly, so full of questions that his whiskers shake; the heron stands in the shallows and does not turn her head. In play each tap on him pops his next question out into his balloon, with her answer beside it in hers, and lays one more pair of small silver fish in a thought cloud over her head: what he owes, with no number anywhere. A tap anywhere else only makes him hop. Caption top left.',
      caption: ['Riffle is bursting with questions.'],
      ask: {
        who: 'riffle', to: 'patience', prompt: '**Tap** Riffle to let one out.',
        pairs: [
          ['Do you sleep standing up?', 'Yes.'],
          ['Is that leg tired?', 'No.'],
          ['Is that a dragonfly?', 'Yes.'],
          ['Do you see EVERYTHING?', 'Yes.'],
          ['Even at night?', 'Yes.'],
          ['Do you like otters?', 'Yes.'],
          ['Am I your favorite?', 'No.']
        ],
        next: 'f080'
      }
    },

    f080: {
      // Patience’s two balloons are this Counts frame’s own; Riffle’s wail is the question’s prompt
      scene: S('marsh', 'heron', { dragonfly: 'beak', owed: 7 },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'worried', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON, THEN THE COUNTS. The heron, tall in the panel, with the thought cloud over her head: seven pairs of small silver fish, eyes shut, side by side, one pair for each answer. She says the sum without moving anything but her bill, and on the logs Riffle’s mouth falls open. In the Counts picture the cloud takes the panel, none of its fish lit; after a miss our cat scratches a log of the raft, two marks for every answer. Her balloons level; the keypad sits below the panel.',
      say: [
        { who: 'patience', text: 'Seven answers.' },
        { who: 'patience', text: 'Two fish for every answer.' }
      ],
      counts: { set: 'ch05-otter', next: 'f081' }
    },

    f081: {
      scene: S('marsh', 'wide', { dragonfly: 'beak', owed: 7 },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('riffle', 'fall', 'shout', 'raft-2', 'left')], ['day']),
      board: 'WIDE, COMEDY BEAT. Riffle lies flat on his back on the logs, all four paws in the air, protesting to the sky; the heron answers without turning her head, the seven pairs still floating in her cloud. Our cat looks from one to the other. His balloon a wail, hers flat; our cat’s small polite one for a cat who makes friends.',
      say: [
        { who: 'riffle', text: 'I was only saying HELLO!' },
        { who: 'patience', text: 'You did not say hello. Hello is free.' },
        { who: 'player', text: 'Hello, Patience.', when: { specialty: 'friends' } }
      ],
      next: 'f082'
    },

    f082: {
      // friends only: her answer to a hello. Nothing lands in the cloud: hello is free
      when: { specialty: 'friends' },
      scene: S('marsh', 'heron', { dragonfly: 'beak', owed: 7 },
        [c('patience', 'feather', null, 'shallows', 'left'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON, ONLY FOR A CAT WHO MAKES FRIENDS. Nothing about the heron changes, except that one long grey feather on her back lifts a little and settles again. Our cat sits up straighter on the logs, pleased; the cloud over her still holds seven pairs and no more. One caption at the top.',
      caption: ['One grey feather lifts. For Patience, that’s a grin.'],
      next: 'f083'
    },

    f083: {
      scene: S('marsh', 'mud', { dragonfly: 'beak', owed: 7 },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'solemn', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE RAFT. Our cat sits up at the raft’s edge, facing the heron across the mud, and asks its first question as carefully as a counting cat counts; a small inset shows a round moon sailing out of storm clouds. Riffle holds his breath behind it. Caption top left; our cat’s balloon plain and clear.',
      caption: ['The fox said the moon came out. So you check.'],
      say: [{ who: 'player', text: 'Was the moon out on the storm night?' }],
      next: 'f084'
    },

    f084: {
      // a paid answer: the eighth pair of fish lands in the cloud with “No.”
      card: 'heron-no-moon',
      scene: S('marsh', 'heron', { dragonfly: 'beak', owed: 8 },
        [c('patience', 'shut', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON. The heron’s near eye closes as she remembers, and an eighth pair of fish drops into the cloud over her head; a small inset shows her standing in the same shallows under a black, clouded sky, with nothing rising to the surface. Our cat and Riffle look up from the logs. Caption top left; her balloons level; the new card appears under the panel, an ear in its corner.',
      caption: ['One eye shuts.'],
      say: [
        { who: 'patience', text: 'No.' },
        { who: 'patience', text: 'The fish come up for the moon. That night, I went hungry.' }
      ],
      next: 'f085'
    },

    f085: {
      // the detective’s choice, on a screen of its own: a light choice, nudged, never failed
      scene: S('marsh', 'wide', { dragonfly: 'beak', owed: 8 },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'happy', 'raft-2', 'right')], ['day']),
      board: 'WIDE. The whole marsh again, the heron waiting in the shallows with eight pairs of fish over her head, and our cat on the raft with a mouthful of questions and the price of each one floating in plain sight. Riffle watches the cloud, counting on his toes. Caption top left for a cat who talks when nervous; the choices sit below the panel.',
      caption: [{ when: { worry: 'talk' }, text: 'You have a hundred questions. At two fish each, you pick one more.' }],
      choice: {
        options: [
          { label: '“Who took our prey?”', sets: {}, next: 'f086a' },
          { label: '“What did you SEE on the storm night?”', sets: {}, next: 'f086b' }
        ]
      }
    },

    f086a: {
      // the wrong question costs nothing: no fish lands in the cloud
      scene: S('marsh', 'heron', { dragonfly: 'beak', owed: 8 },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'shy', 'raft-1', 'right'),
         c('riffle', 'sit', 'worried', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON. The heron does not move, and the cloud over her head stays at eight pairs: she will not sell a guess. On the logs Riffle looks a little hurt, and our cat thinks again. Her balloon dry, three short sentences.',
      say: [{ who: 'patience', text: 'I do not guess. Guessing is for otters. That one is free.' }],
      next: 'f087a'
    },

    f087a: {
      scene: S('marsh', 'mud', { dragonfly: 'beak', owed: 8 },
        [c('patience', 'eye', null, 'shallows', 'left'), c('player', 'sit', 'solemn', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE RAFT. Our cat sits up again at the raft’s edge and asks the other question, the one a witness can answer, one paw lifted a little as it speaks. Across the mud the heron’s yellow eye has turned its way. One caption at the top.',
      caption: ['So you ask what she SAW on the storm night.'],
      next: 'f088'
    },

    f086b: {
      scene: S('marsh', 'heron', { dragonfly: 'beak', owed: 8 },
        [c('patience', 'eye', null, 'shallows', 'left'), c('player', 'sit', 'proud', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON. For the first time the heron’s round yellow eye swivels down to the raft and rests on our cat, and stays there, while the rest of her stays as still as a post. Riffle’s whiskers stand out in surprise. Caption top left; her balloon three words.',
      caption: ['One yellow eye turns to you.'],
      say: [{ who: 'patience', text: 'A good question.' }],
      next: 'f088'
    },

    f088: {
      // her second paid answer: the ninth pair lands
      card: 'heron-shapes',
      scene: S('marsh', 'heron', { dragonfly: 'beak', owed: 9 },
        [c('patience', 'eye', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON. A ninth pair of fish drops into the cloud as the heron tells what she saw, and a small inset shows it her way: wet mud under a black sky, and two long low smudges crossing it, each with a smaller smudge at its front end, nothing of them clear. Our cat listens without blinking. Her two balloons slow and exact; the new card appears under the panel, an ear in its corner.',
      say: [
        { who: 'patience', text: 'When the rain stopped: two small shapes, crossing my mud.' },
        { who: 'patience', text: 'Each one carrying something. I do not guess what.' }
      ],
      next: 'f089'
    },

    f089: {
      // only a cat who has met Squall, in chapter 4 or this morning: two accounts that never met agree
      when: { foundSquall: true },
      scene: S('marsh', 'mud', { dragonfly: 'beak', owed: 9 },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'stand', 'wonder', 'raft-2', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM TWO-SHOT, ON THE RAFT, ONLY FOR A CAT WHO HAS MET SQUALL. Our cat and Riffle put their heads together on the logs, and two small insets float over them, side by side: a little slate dragonet pointing down from a roof, and the heron’s two smudges on the mud. Beyond the mud the heron pretends not to hear. Both balloons whispers, his counting on two toes.',
      say: [
        { who: 'player', text: 'Just what Squall saw!', kind: 'whisper' },
        { who: 'riffle', text: 'He saw them. She saw them. Same two shapes!', kind: 'whisper' }
      ],
      next: 'f090'
    },

    f090: {
      scene: S('marsh', 'wide', { dragonfly: 'beak', owed: 9, prints: true, tap: 'mud' },
        [c('patience', 'point', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'right')], ['day']),
      board: 'WIDE, THE TAP PICTURE. The heron lowers her long bill until it points at the mud flat beside the raft, where something has been walking, and adds one more thing for nothing; the nine pairs stay nine. In play a patch of the mud glows softly; a tap on it turns the page to the close-up, and a tap anywhere else only ripples the water. Her two balloons, the second very dry.',
      say: [
        { who: 'patience', text: 'They come back every night. They do not wipe their feet.' },
        { who: 'patience', text: 'That is not an answer. It is a complaint.' }
      ],
      scratch: { tap: 'mud', prompt: '**Tap** the mud to look closer.', label: 'Look at the mud.', miss: 'ripple…', next: 'f091' }
    },

    f091: {
      // a climber only: the prints, and her Tap on Riffle’s pole (the prints are two frames with
      // opposite `when`s, one after the other, as the gap is; both give the card). Her paw is held
      // over one from the raft’s edge (`raft-edge`, crouched, `reach`): the size of it is the clue
      when: { specialty: 'climbing' },
      card: 'prints-marsh',
      scene: S('marsh', 'mud', { dragonfly: 'beak', owed: 9, prints: true, tap: 'pole' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'crouch', 'wonder', 'raft-edge', 'right', { reach: true }),
         c('riffle', 'stand', 'wonder', 'raft-2', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM, FROM THE RAFT, THE TAP PICTURE, A CLIMBING CAT ONLY. The mud below the raft’s edge: a line of tiny prints runs across it beside one great three-toed heron print, and our cat, crouched at the very edge of the logs, holds one forepaw out and down over a print without touching the mud: the print is half the size of the paw. In play the pole in Riffle’s paws glows softly; a tap on it sends our cat up it and turns the page, and a tap anywhere else only makes Riffle wobble. Captions top left; the new card appears under the panel, an eye in its corner.',
      caption: ['Tiny prints, in a line across the mud.', 'You hold your paw over one. It’s half the size of yours.'],
      scratch: { tap: 'pole', prompt: '**Tap** Riffle’s pole to run up it.', label: 'Run up the pole.', miss: 'wobble…', next: 'f092' }
    },

    f092: {
      when: { not: { specialty: 'climbing' } },
      card: 'prints-marsh',
      scene: S('marsh', 'mud', { dragonfly: 'beak', owed: 9, prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'crouch', 'wonder', 'raft-edge', 'right', { reach: true }),
         c('riffle', 'stand', 'wonder', 'raft-2', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM, FROM THE RAFT, EVERY CAT BUT A CLIMBER. The mud below the raft’s edge: a line of tiny prints runs across it beside one great three-toed heron print, and our cat, crouched at the very edge of the logs, holds one forepaw out and down over a print without touching the mud: the print is half the size of the paw. Riffle leans on his pole to look. Captions top left; the new card appears under the panel, an eye in its corner.',
      caption: ['Tiny prints, in a line across the mud.', 'You hold your paw over one. It’s half the size of yours.'],
      next: 'f093'
    },

    f093: {
      when: { specialty: 'climbing' },
      card: 'prints-tracks',
      scene: S('marsh', 'pole', { prints: true },
        [c('player', 'crouch', 'wonder', 'pole-top', 'right')], ['day']),
      board: 'HIGH ANGLE, FROM THE TOP OF THE POLE, A CLIMBING CAT ONLY. Our cat clings to the very top of Riffle’s pole, high over the reed tops, and from up here the line of tiny prints can be followed all the way across the mud and off along a far bank, toward two long shiny lines. Nothing else moves in the whole marsh. One caption at the top; the new card appears under the panel, an eye in its corner.',
      caption: ['From the top, you see where the prints go: off toward the train tracks.'],
      next: 'f094'
    },

    f094: {
      // a screen only some cats read: a noticing cat (the pile’s prints), a cat who asked the otters
      // first (their fur); for everyone else the page turns straight on to the bill
      when: { not: { ch5First: 'heron', not: { specialty: 'noticing' } } },
      scene: S('marsh', 'mud', { dragonfly: 'beak', owed: 9, prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE RAFT, ONLY FOR A NOTICING CAT OR ONE WHO ASKED THE OTTERS FIRST. Our cat sits back on the logs above the prints, and a small thought bubble holds what they remind it of: for a noticing cat a crumbly heap of earth with tiny prints in it, for a cat who has been to the otters a tuft of fur on a vine. Riffle watches its face. Captions top left, each for its own cat.',
      caption: [
        { when: { specialty: 'noticing' }, text: 'The same tiny prints as behind the pile!' },
        { when: { ch5First: 'otters' }, text: 'Thin fur there. Tiny prints here. The same somebody?' }
      ],
      next: 'f095'
    },

    f095: {
      // (from here to the end of the marsh the prints stay in the mud: nobody wipes them, and “They
      // come back every night”. Only the two close cameras among the reeds have no mud for them.)
      scene: S('marsh', 'heron', { dragonfly: 'beak', owed: 9, prints: true },
        [c('patience', 'eye', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'worried', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON, THEN THE COUNTS. The heron presents the bill, her eye on the raft, and the cloud over her head is full: nine pairs of small silver fish in three rows of three. Riffle clutches his whiskers. In the Counts picture the nine pairs take the panel, none lit; after a miss our cat scratches a log of the raft, two marks for every answer. Her balloon level; the keypad sits below the panel.',
      say: [{ who: 'patience', text: 'Seven answers for the otter. Two for the cat.' }],
      // (`intro: false`: said again over the question, with her two balloons and the caption, it made
      // the tallest lesson screen in the chapter, and a phone hid the top row of the nine pairs)
      counts: { set: 'ch05-bill', intro: false, next: 'f096' }
    },

    f096: {
      scene: S('marsh', 'mud', { dragonfly: 'beak', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'proud', 'raft-1', 'right'),
         c('riffle', 'stand', 'wonder', 'raft-2', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM TWO-SHOT, ON THE RAFT. Our cat turns to Riffle, delighted with itself, and holds up the two Counts of the day side by side: a small inset shows nine pairs of fish, and two cats with nine claws out. Riffle is already eyeing the water. Its balloon quick and proud.',
      say: [{ who: 'player', text: 'Nine twos. Or two nines. Same eighteen!' }],
      next: 'f097'
    },

    f097: {
      // from here to the catch she is alone on the logs: his pole stands planted in the mud, and he
      // says where he is going and that he is coming back
      scene: S('marsh', 'wide', { dragonfly: 'beak', pole: 'planted', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('riffle', 'dive', 'happy', { x: 660, y: 640 }, 'right')], ['day']),
      board: 'WIDE, ACTION. Riffle is in the air over the green water in a long brown arc, nose down, shouting back over his shoulder, and a ring of ripples is already opening where he will go in. His pole stands planted in the mud beside the raft, a twist of vine round it, holding the logs still. The SPLOOSH! is lettered across the water; caption top left; his balloon trails behind him.',
      sfx: 'SPLOOSH!',
      caption: ['He’s already diving.'],
      say: [{ who: 'riffle', text: 'Back in eighteen fish!', kind: 'shout' }],
      next: 'f098'
    },

    f098: {
      // the first of three choices to keep still: stopping at any of them sets nothing and costs nothing
      scene: S('marsh', 'heron', { dragonfly: 'beak', pole: 'planted', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON. Our cat is alone on the logs now, and the picture says why that is safe: the pole stands in the mud holding the raft against the flat, the water beside it is shallow enough to show every pebble on the bottom, and a ring of ripples marks where Riffle went down. The heron stands over it all, still as a reed. Captions top left, the second for a cat who worries about water; the choices sit below the panel.',
      caption: [
        'His pole stands in the mud, holding the raft still.',
        { when: { worry: 'water' }, text: 'Beside the mud, you can see the bottom. You look at it a lot.' }
      ],
      choice: {
        options: [
          { label: 'Sit still and watch the reeds, like Patience.', sets: {}, next: 'f099a' },
          { label: 'Count the fish for Riffle, out loud.', sets: {}, next: 'f099b' }
        ]
      }
    },

    /* ------------------------------------------------------------------ The loud way out (b):
     * two panels, her yell and what it does; a tell for a child who picked it: one reed flinches */

    f099b: {
      scene: S('marsh', 'wide', { dragonfly: 'beak', pole: 'planted', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'stand', 'shout', 'raft-1', 'right'),
         c('riffle', 'swim', 'happy', { x: 690, y: 690 }, 'left', { holds: 'fish' })], ['day']),
      board: 'WIDE, COMEDY BEAT. Our cat stands at the raft’s edge and yells the count across the whole silent marsh as Riffle’s wet head pops up with the first fish in his mouth, and then the second. The frogs on their lily pads have gone rigid. Its balloon huge and jagged.',
      say: [{ who: 'player', text: 'ONE! TWO!', kind: 'shout' }],
      next: 'f100b'
    },

    f100b: {
      scene: S('marsh', 'reeds', { pole: 'planted', frogs: 'jump', pale: 'flinch', prints: true },
        [c('patience', 'shut', null, 'shallows', 'left', { squeeze: true }), c('player', 'sit', 'shout', 'raft-1', 'right')], ['day']),
      board: 'WIDE, THE REEDS, COMEDY BEAT. Every frog in the marsh is in the air at once, rings spreading where the first ones have landed, and the heron has shut both eyes tight, the dragonfly gone from her bill. In the stand of pale reeds behind her, one reed jerks, once, among reeds that do not. One caption at the top.',
      caption: ['Every frog jumps in. Patience shuts both eyes. One reed flinches.'],
      next: 'f113'
    },

    /* ------------------------------------------------------------------ The pale reed (a) */

    f099a: {
      scene: S('marsh', 'reeds', { dragonfly: 'beak', pole: 'planted', pale: 'reed', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'loaf', 'kind', 'raft-1', 'right'),
         c('riffle', 'swim', 'happy', { x: 900, y: 880 }, 'left', { holds: 'fish' })], ['day']),
      board: 'WIDE, THE REEDS. Our cat has folded itself into a loaf on the logs and watches the stand of reeds the way the heron does, without moving a whisker. Out on the water Riffle’s wet head has popped up with a fish in his mouth; the frogs sit on their pads; one reed is paler than the rest. One caption at the top.',
      caption: ['Nothing happens. Now and then, a wet head pops up with a fish.'],
      next: 'f100a'
    },

    f100a: {
      scene: S('marsh', 'heron', { pole: 'planted', pale: 'reed', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'loaf', 'wonder', 'raft-1', 'right', { dragonfly: true })], ['day']),
      board: 'LOW ANGLE, THE HERON. The dragonfly has left the heron’s bill and settled on the very tip of our cat’s nose, wings flat, and our cat, still a loaf on the logs, has gone cross-eyed looking at it. The heron stands exactly as before. Captions top left, the last for a sneaking cat; the choices sit below the panel.',
      caption: [
        'Then the dragonfly leaves Patience’s beak, and lands on your nose.',
        'You sat still through the Roar. You can sit still for a dragonfly.',
        { when: { specialty: 'sneaking' }, text: 'Sock-hunting, all over again.' }
      ],
      choice: {
        options: [
          { label: 'Keep still.', sets: {}, next: 'f101a' },
          { label: 'Enough! Count fish for Riffle.', sets: {}, next: 'f101b' }
        ]
      }
    },

    f101b: {
      scene: S('marsh', 'wide', { pole: 'planted', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'stand', 'shout', 'raft-1', 'right'),
         c('riffle', 'swim', 'happy', { x: 690, y: 690 }, 'left', { holds: 'fish' })], ['day']),
      board: 'WIDE, COMEDY BEAT. Our cat jumps to its feet on the logs and bellows the count as Riffle’s head comes up with another fish, the dragonfly shooting off its nose like a spark. The heron does not turn her head. Its balloon huge and jagged.',
      say: [{ who: 'player', text: 'THREE!', kind: 'shout' }],
      next: 'f102b'
    },

    f102b: {
      scene: S('marsh', 'reeds', { pole: 'planted', frogs: 'jump', pale: 'reed', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'happy', 'raft-1', 'right')], ['day']),
      board: 'WIDE, THE REEDS. The dragonfly is a speck over the far water, and the frogs are all in mid-leap, rings opening under them. The stand of reeds is only a stand of reeds, the pale one as still as the rest. One caption at the top.',
      caption: ['The dragonfly leaves. So do the frogs.'],
      next: 'f113'
    },

    f101a: {
      scene: S('marsh', 'reeds', { pole: 'planted', pale: 'knees', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'loaf', 'wonder', 'raft-1', 'right', { dragonfly: true })], ['day']),
      board: 'WIDE, THE REEDS. The same stand of reeds, and the same nothing; but low down, where the pale reed meets the water, the stems have parted a little, and behind them is a thin pale leg with a knobbly knee in it. Our cat, the dragonfly still on its nose, has noticed. One caption at the top; the choices sit below the panel.',
      caption: ['Still nothing. But one reed is paler than the others. And reeds don’t have knees.'],
      choice: {
        options: [
          { label: 'Keep very, very still.', sets: {}, next: 'f102a' },
          { label: 'Enough! Count fish for Riffle.', sets: {}, next: 'f102c' }
        ]
      }
    },

    f102c: {
      scene: S('marsh', 'wide', { pole: 'planted', pale: 'reed', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'stand', 'shout', 'raft-1', 'right'),
         c('riffle', 'swim', 'happy', { x: 690, y: 690 }, 'left', { holds: 'fish' })], ['day']),
      board: 'WIDE, COMEDY BEAT. Our cat cannot bear it one moment longer: it leaps up on the logs and shouts the count at Riffle’s wet head, which has just come up with another fish. The dragonfly is gone, and the heron sighs through her bill. Its balloon huge and jagged.',
      say: [{ who: 'player', text: 'FIVE!', kind: 'shout' }],
      next: 'f103c'
    },

    f103c: {
      scene: S('marsh', 'reeds', { pole: 'planted', frogs: 'jump', pale: 'reed', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right')], ['day']),
      board: 'WIDE, THE REEDS. Our cat looks back at the stand of reeds, and it is only reeds: no leg, no knee, every stem as straight and as still as its neighbour, the frogs gone from their pads. Whatever was there has made itself a reed again. One caption at the top.',
      caption: ['When you look back, every reed looks the same.'],
      next: 'f113'
    },

    f102a: {
      scene: S('marsh', 'reeds', { pole: 'planted', pale: 'blink', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'loaf', 'wonder', 'raft-1', 'right', { dragonfly: true })], ['day']),
      board: 'WIDE, THE REEDS. High up in the pale reed, where its plume should be, two round pale gold eyes have opened, and shut, and opened again. Our cat does not move so much as an ear. One caption at the top, small.',
      caption: ['The pale reed blinks.'],
      next: 'f103a'
    },

    f103a: {
      scene: S('marsh', 'wisp', { pole: 'planted' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('wisp', 'blink', 'shy', 'reed', 'left'),
         c('player', 'loaf', 'wonder', 'raft-1', 'right', { dragonfly: true })], ['day']),
      board: 'MEDIUM, THE PALE DRAGONET. Among the reeds, beside the heron and standing exactly as she stands, on one thin leg: a dragonet so pale the stems show through her wings, long in the neck, wings folded down her back like a heron’s, with two warm gold eyes that are the only solid thing about her. Broad daylight, and nothing ghostly: she looks a little embarrassed. Our cat is a loaf on the logs at the panel’s edge, the dragonfly still on its nose. One caption at the top.',
      caption: ['It isn’t a reed. It’s a dragonet, pale as mist, standing on one leg.'],
      next: 'f104a'
    },

    f104a: {
      // she never speaks: the heron says the joke for her
      scene: S('marsh', 'wisp', { pole: 'planted' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('wisp', 'shh', 'shy', 'reed', 'left'),
         c('player', 'sit', 'kind', 'raft-1', 'right')], ['day']),
      board: 'MEDIUM, COMEDY BEAT. The pale dragonet lays one claw across her snout, as serious as a librarian, and the heron beside her explains without turning her head or changing her face in the least. On the logs at the edge of the panel our cat whispers back, as quietly as it can. Caption top left; the heron’s balloon dry; our cat’s a whisper.',
      caption: ['She lays one claw across her snout.'],
      say: [
        { who: 'patience', text: 'She believes she is a heron. I have not corrected her.' },
        { who: 'player', text: 'Sprinkle sent me.', kind: 'whisper' }
      ],
      next: 'f105a'
    },

    f105a: {
      // a silent set: every line the engine words is a caption; only Patience speaks in it, once
      scene: S('marsh', 'draw', { pole: 'planted', drawing: 'herons' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right')], ['day']),
      board: 'CLOSE-UP, THE MUD AT HER FOOT, THEN THE COUNTS. One pale forepaw comes down into the panel, and its claw draws in the wet mud as simply as a card’s picture: seven little herons, four above three, each on one leg. The raft, our cat and the heron are small beyond. In the Counts picture the seven herons take the panel; after a miss they light one at a time and our cat counts them by ones. One caption at the top; the keypad sits below the panel.',
      caption: ['Then, slowly, one pale claw draws in the mud.'],
      counts: { set: 'ch05-wisp', next: 'f106a' }
    },

    f106a: {
      scene: S('marsh', 'wisp', { pole: 'planted', drawing: 'herons' },
        [c('patience', 'eye', null, 'shallows', 'left'), c('wisp', 'nod', 'shy', 'reed', 'left'),
         c('player', 'sit', 'happy', 'raft-1', 'right')], ['day']),
      board: 'MEDIUM. The pale dragonet nods, once, and goes back to standing; the heron’s eye rests on the raft while she tells the little there is to tell. A small inset shows a storm, and a pale shape tumbling down into the reeds. Her two balloons level, the last three words the highest praise she has.',
      say: [
        { who: 'patience', text: 'She fell into my reeds in the storm. She told me her name: Wisp.' },
        { who: 'patience', text: 'Not a word since. She stands well.' }
      ],
      next: 'f107a'
    },

    f107a: {
      // only a cat who found Puddle after the Roar: he is under the very raft she is sitting on
      when: { foundPuddle: true },
      scene: S('marsh', 'heron', { pole: 'planted', snout: true, prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('wisp', 'blink', 'wonder', 'reed', 'left'),
         c('player', 'sit', 'wonder', 'raft-1', 'right'), c('puddle', 'nostrils', 'happy', { x: 270, y: 946 }, 'right')], ['day']),
      board: 'LOW ANGLE, COMEDY BEAT, ONLY FOR A CAT WHO HAS FOUND PUDDLE. Between two logs of the raft, right beside our cat’s paws, the tip of a blue-grey snout has come up, two nostrils and a string of bubbles, and it is shouting at the reeds. Among them the pale dragonet’s gold eyes go as round as coins. Caption top left; the snout’s balloon enormous.',
      caption: ['A blue-grey snout pokes up between the logs.'],
      say: [{ who: 'puddle', name: 'Puddle', text: 'WISP?', kind: 'shout' }],
      next: 'f108a'
    },

    f108a: {
      when: { foundPuddle: true },
      scene: S('marsh', 'heron', { pole: 'planted', snout: true, prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('wisp', 'shh', 'shy', 'reed', 'left'),
         c('player', 'sit', 'laugh', 'raft-1', 'right'), c('puddle', 'nostrils', 'proud', { x: 270, y: 946 }, 'right')], ['day']),
      board: 'LOW ANGLE, COMEDY BEAT, ONLY FOR A CAT WHO HAS FOUND PUDDLE. The pale dragonet lays one claw across her snout at her brother, exactly as she did at our cat, and the blue-grey snout between the logs sinks to a pair of nostrils and whispers back, immensely pleased with itself. The heron looks at nobody. Caption top left; the snout’s balloon a loud whisper.',
      caption: ['Wisp lays one claw across her snout.'],
      say: [{ who: 'puddle', name: 'Puddle', text: 'I’m a LOG.', kind: 'whisper' }],
      next: 'f109a'
    },

    f109a: {
      scene: S('marsh', 'wisp', { pole: 'planted', drawing: 'herons' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('wisp', 'blink', 'shy', 'reed', 'left'),
         c('player', 'sit', 'wonder', 'raft-1', 'right')], ['day']),
      board: 'MEDIUM. The heron and the pale dragonet side by side, each on one leg, the same shape at two sizes; the heron states her price again and, for once, what becomes of it. A small inset shows two fish, one going each way. Her balloon level, three short sentences.',
      say: [{ who: 'patience', text: 'Two fish for every answer. One for me. One for her.' }],
      next: 'f110a'
    },

    f110a: {
      scene: S('marsh', 'heron', { pole: 'planted', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('wisp', 'blink', 'shy', 'reed', 'left'),
         c('player', 'sit', 'kind', 'raft-1', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON AND THE DRAGONET. Our cat, on the logs, looks from the tall bird to the small pale one and understands the price at last; then it asks its question straight across the water to the dragonet, gently. She tips her head to listen. Caption top left; our cat’s balloon soft.',
      caption: ['So THAT’s why it’s two.'],
      say: [{ who: 'player', text: 'Have you seen anything strange, Wisp?' }],
      next: 'f111a'
    },

    f111a: {
      // an ear, though nobody said a word: it is what she was shown, not what she saw happen
      card: 'wisp-fox',
      scene: S('marsh', 'draw', { pole: 'planted', drawing: 'fox' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right')], ['day']),
      board: 'CLOSE-UP, THE MUD AT HER FOOT. The pale forepaw draws again, slowly, in thin lines: a fox’s head, something small falling from its mouth with little shine lines round it, and under that a ring of ripples. Nothing else: no night, no place, no name. One caption, beside the panel so the drawing stays clear; the new card appears with it, an ear in its corner.',
      // (one box, in the column: the drawing is kept clear and the heron's and our cat's heads take the top,
      // so a second box has no corner of the panel to go in, however the words are cut)
      caption: ['She draws again. A fox. Something small falling from its mouth, with shine lines. A ring of ripples.'],
      next: 'f112a'
    },

    f112a: {
      // the scene’s last frame: by now she has read her name, her riddle and her drawing. She never
      // speaks, so the count is our cat’s own (`teacher: 'player'`: the “5!” in her balloon)
      sets: { foundWisp: true },
      scene: S('marsh', 'wisp', { pole: 'planted', drawing: 'fox' },
        [c('patience', 'stand', null, 'shallows', 'left'), c('wisp', 'pawup', 'shy', 'reed', 'left'),
         c('player', 'sit', 'wonder', 'raft-1', 'right')], ['day']),
      board: 'MEDIUM, THE TAP PICTURE. The pale dragonet lifts one forepaw toward the raft, where our cat sits as still as she does, five claws spread, so thin that the reeds behind show through it; past her the green water lies flat and deep and tells nothing. In play the counting picture takes the panel: her one raised forepaw, glowing softly; one tap lights its five claws, pale as frost, a big 5 grows over them, counted in our cat’s own small balloon since Wisp says nothing, and the page turns. Captions top left.',
      caption: ['Where it fell, there’s only deep green water now.', 'Then Wisp holds up one forepaw. You can nearly see the reeds through it.'],
      skip: { table: 5, groups: 1, who: [{ who: 'wisp' }], teacher: 'player', thing: 'claw', things: 'claws', label: 'Tap her forepaw.', prompt: '**Tap** her forepaw.', carry: false, next: 'f113' }
    },

    /* ------------------------------------------------------------------ Twenty fish */

    f113: {
      scene: S('marsh', 'wide', { pole: 'planted', fish: 'strings', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('riffle', 'scramble', 'happy', 'raft-2', 'left')], ['day']),
      board: 'WIDE, ACTION. Riffle hauls himself over the raft’s edge in a shower of drops and flops four strings of fish across the logs, each string a reed looped round five tails, the fish small and silver with their eyes shut. Our cat hops clear of the splash; the frogs are back on their pads. The SPLOOSH! is lettered over the water; captions top left, the second for a cat who loves shiny things.',
      sfx: 'SPLOOSH!',
      caption: [
        'Riffle heaves four strings of fish onto the raft, puffing.',
        { when: { worry: 'shiny' }, text: 'They flash like silver. You try very hard not to stare.' }
      ],
      next: 'f114'
    },

    f114: {
      // a swimmer who is not afraid of the water: she helps from the raft (nobody but an otter or a
      // dragonet is ever in the water)
      when: { specialty: 'swimming', not: { worry: 'water' } },
      scene: S('marsh', 'mud', { pole: 'planted', fish: 'strings', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'pawup', 'happy', 'raft-1', 'right'),
         c('riffle', 'scramble', 'happy', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE RAFT, ONLY FOR A SWIMMING CAT WITHOUT THE WATER WORRY. Our cat reaches down from the logs and hooks the last string of fish aboard with one forepaw, river running off its fur to the elbow, and looks at the wet paw with surprise and then with pride. Riffle, half over the edge, cheers it on. One caption at the top.',
      caption: ['You hook the last string aboard. A wet paw! You don’t mind one bit.'],
      next: 'f115'
    },

    f115: {
      // “What did I miss?” and her answer are read on this page before the count
      scene: S('marsh', 'mud', { pole: 'planted', fish: 'strings', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'solemn', 'raft-1', 'right'),
         c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE RAFT, THEN THE COUNTS. Riffle sits dripping among his catch, puffing like a bellows, the four strings laid side by side across the logs, and our cat answers him with a perfectly straight face. In the Counts picture the four strings take the panel, five fish on every string, lit a string at a time; after a miss our cat scratches a log of the raft, five marks for every string. His balloon breathless; our cat’s short, by what it found; the keypad sits below the panel.',
      say: [
        { who: 'riffle', text: 'What did I miss?' },
        { who: 'player', text: 'A reed with knees.', when: { foundWisp: true } },
        { who: 'player', text: 'Frogs.', when: { foundWisp: false } }
      ],
      counts: { set: 'ch05-catch', next: 'f116' }
    },

    f116: {
      // what goes down is named, on a panel of its own, with the frogs alive on their pads. Two
      // frames with opposite `when`s, one after the other (as the pile's gap and the marsh's prints
      // are): a scene cannot change its cast by a flag, and a cat who found Wisp sees her get her half.
      // This one is everybody else's: nothing in the reeds is seen to eat.
      when: { foundWisp: false },
      scene: S('marsh', 'wide', { pole: 'planted', fish: 'spare', frogs: 'sit', prints: true },
        [c('patience', 'gulp', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'happy', 'raft-2', 'right')], ['day']),
      board: 'WIDE, EVERY CAT BUT ONE WHO FOUND WISP. The heron’s neck is stretched straight up and a small bump is travelling down it; on the logs lie three emptied reed strings and a fourth with its two spare fish still on it, and every frog sits safe on its lily pad, watching. In the pale reeds behind her nothing is seen to eat. The three gulps are lettered down her neck; one caption at the top.',
      caption: ['Down go the fish.'],
      sfx: 'Gulp. Gulp. Gulp.',
      next: 'f117'
    },

    f117: {
      // for a cat who found Wisp: the same panel with her in it, out from among the reeds, her own
      // small bump going down
      when: { foundWisp: true },
      scene: S('marsh', 'wide', { pole: 'planted', fish: 'spare', frogs: 'sit', prints: true },
        [c('patience', 'gulp', null, 'shallows', 'left'), c('wisp', 'gulp', 'happy', 'reed', 'left'),
         c('player', 'sit', 'wonder', 'raft-1', 'right'), c('riffle', 'sit', 'happy', 'raft-2', 'right')], ['day']),
      board: 'WIDE, ONLY FOR A CAT WHO FOUND WISP. The heron’s neck is stretched straight up and a small bump is travelling down it; among the pale reeds behind her the pale dragonet stands in plain sight now, her head tipped back the same way and a small bump of her own going down her long neck. On the logs lie three emptied reed strings and a fourth with its two spare fish still on it, and every frog sits safe on its lily pad, watching. The three gulps are lettered down the heron’s neck; one caption at the top.',
      caption: ['Down go the fish. One for Patience. One for Wisp.'],
      sfx: 'Gulp. Gulp. Gulp.',
      next: 'f118'
    },

    f118: {
      scene: S('marsh', 'heron', { pole: 'planted', fish: 'spare', frogs: 'sit', prints: true },
        [c('patience', 'full', null, 'shallows', 'left'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('riffle', 'sit', 'shy', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON. The heron stands a little rounder in the neck than before, looking straight ahead as she always does, and says it to the air over the dripping otter pup on the logs. Riffle goes pink under his fur and does not know where to look. Her balloon level: two short sentences, the second the best thing she has said all day.',
      say: [{ who: 'patience', text: 'I am full. You dive well, otter.' }],
      next: 'f119'
    },

    f119: {
      scene: S('marsh', 'heron', { pole: 'planted', fish: 'spare', frogs: 'sit', prints: true },
        [c('patience', 'eye', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'sit', 'happy', 'raft-2', 'right')], ['day']),
      board: 'LOW ANGLE, THE HERON. Now the eye moves to our cat and stays on it, round and yellow and unblinking, while she gives one thing away for nothing: a riddle with eyelids in it. Our cat sits very straight under that eye. Caption top left; her balloon slow, three short sentences.',
      caption: ['One yellow eye turns to you.'],
      say: [{ who: 'patience', text: 'One more answer. Free. Ask the one who never shuts his eyes.' }],
      next: 'f120'
    },

    f120: {
      // Coil is a bore to him, not a fright: he groans, and never hugs his tail here
      scene: S('marsh', 'mud', { pole: 'planted', fish: 'spare', frogs: 'sit', prints: true },
        [c('patience', 'stand', null, 'shallows', 'left'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('riffle', 'groan', 'solemn', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM TWO-SHOT, ON THE RAFT, COMEDY BEAT. Riffle throws his head back and groans at the sky, eyes rolled up, paws dangling, the way a pup groans at a chore; a small inset shows a fat old snake peering out between two stones, looking nosy and nothing worse. Our cat’s ears prick with interest. Caption top left; his two balloons weary.',
      caption: ['Riffle groans.'],
      say: [
        { who: 'riffle', text: 'Snakes don’t have eyelids. She means COIL.' },
        { who: 'riffle', text: 'That nosy old thing trades secrets like pebbles.' }
      ],
      next: 'f121'
    },

    /* ------------------------------------------------------------------ Raft puddles */

    f121: {
      // module-1’s second way to Puddle: only for a cat who has not found him. He never finishes the
      // name. Asking leads under the raft (the same scene, in late light); letting him keep his
      // secret sets nothing.
      when: { foundPuddle: false },
      else: 'f132',
      scene: S('openriver', 'raft', HOMEWARD,
        [c('player', 'sit', 'wonder', 'raft-1', 'right'), c('riffle', 'stand', 'worried', 'pole', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM, ON THE LOGS, LATE LIGHT, ONLY FOR A CAT WHO HAS NOT FOUND PUDDLE. The river has turned to gold and Riffle is poling for home, puffing, leaning his whole weight on the pole; halfway through a sentence his eyes go wide and he claps the sentence shut and starts another. Our cat’s ears swivel toward him. Caption top left; his balloon stumbles in the middle; the choices sit below the panel.',
      caption: ['Riffle pushes off for home.'],
      say: [{ who: 'riffle', text: 'Heavy today. It’s because of Pud— PUDDLES. Raft puddles. Not a name.' }],
      choice: {
        options: [
          { label: '“Riffle. What’s under the raft?”', sets: {}, next: 'f122a' },
          { label: '“Puddles. Fine.”', sets: {}, next: 'f122b' }
        ]
      }
    },

    f122a: {
      // he never breaks his word: she asks, and he points. Then “Under the raft” (f123a…f130a)
      scene: S('openriver', 'raft', HOMEWARD,
        [c('player', 'sit', 'happy', 'raft-1', 'right'), c('riffle', 'point', 'shy', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS, LATE LIGHT, COMEDY BEAT. Riffle stands with his chin up and his eyes on the horizon, the picture of an otter keeping a promise, while one webbed forepaw points straight down between the logs. His pole lies forgotten along the raft. His balloon very dignified.',
      say: [{ who: 'riffle', text: 'I promised Granny I wouldn’t TELL. I’m only POINTING.' }],
      next: 'f123a'
    },

    f131a: {
      // the first panel after “Under the raft”, on the way home too: he is seen to be up again
      scene: S('openriver', 'raft', merge(HOMEWARD, { bubbles: true }),
        [c('player', 'sit', 'happy', 'raft-1', 'right'), c('riffle', 'stand', 'happy', 'pole', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM, ON THE LOGS, LATE LIGHT. The raft glides on down the gold river toward the rocks, Riffle poling and whistling for real this time, our cat sitting in the middle of the logs with its tail curled round its paws. Between two logs two small blue-grey nostrils ride along, and a string of bubbles rises beside them. The one small sound is lettered pale beside the bubbles.',
      sfx: 'blub…',
      // (pale and small, on the water just above the bubbles: left to itself it went to the top
      // corner, by the sun, as far from them as the panel is wide)
      sfxAt: [20, 70],
      next: 'f132'
    },

    f122b: {
      scene: S('openriver', 'raft', HOMEWARD,
        [c('player', 'sit', 'kind', 'raft-1', 'right'), c('riffle', 'stand', 'happy', 'pole', 'left', { holds: 'pole' })], ['day']),
      board: 'MEDIUM, ON THE LOGS, LATE LIGHT. Our cat settles back down on the logs and lets the matter drop, and Riffle’s whole face shines with relief; he poles on down the gold river, lighter by one worry. He says it to the sky, and means it. His balloon warm.',
      say: [{ who: 'riffle', text: 'Best friend an otter ever had.' }],
      next: 'f123b'
    },

    f123b: {
      scene: S('openriver', 'edge', merge(HOMEWARD, { bubbles: true }),
        [c('riffle', 'whistle', 'happy', 'raft-2', 'right'), c('player', 'sit', 'happy', 'raft-1', 'right')], ['day']),
      board: 'HIGH ANGLE, CLOSE ON THE LOGS, LATE LIGHT. From above the raft’s edge in the gold light: our cat and Riffle on the logs, both looking carefully at nothing, and in the gap between two logs a string of bubbles rising, with two small nostrils just showing behind it. Nobody says a word about it. One caption at the top.',
      caption: ['Under the logs, something goes blub.'],
      next: 'f132'
    },

    /* ------------------------------------------------------------------ What the otters heard, for
     * a cat who asked the heron first: f132…f139, added below by otters() */

    /* ------------------------------------------------------------------ Mama’s count */

    f140: {
      scene: S('bridge', 'bank', BANK,
        [c('riffle', 'swim', 'happy', 'water', 'left'), c('player', 'walk', 'happy', 'bank-right', 'left', { purr: true })], ['sunset', 'purr']),
      board: 'WIDE, FROM THE RIVERBANK, SUNSET. The Old Bridge black against an orange sky, the sun going down behind its iron truss, and our cat trotting along the bank toward the dark space under its near end, purring so hard that small rings of sound come off it. In the river beside it Riffle swims along on his front, only his head and his back showing, grinning from ear to ear. Captions top left; his balloon two words.',
      caption: ['At the rocks, Riffle ties up the raft, and swims beside you up the river.', 'You purr at him the whole way.'],
      say: [{ who: 'riffle', text: 'Worth it.' }],
      next: 'f141'
    },

    f141: {
      when: { ch3Told: true },
      scene: S('bridge', 'back', merge(BACK, { branch: true }),
        [c('sprinkle', 'peek', 'wonder', 'dragon', 'left'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('riffle', 'scramble', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, THE TOLD PATH ONLY. In the cool dark at the very back of the bridge, the last orange light reaching in along the mud, a heap of old sticks lies across the nook just as Tallyheart left it, and over the top of it two big round eyes shine, then a pale snout. Our cat sits down in front of the heap as Riffle scrambles in behind, dripping. Captions top left.',
      caption: ['Under the Old Bridge, two big eyes shine.', 'They peek over Tallyheart’s branch.'],
      next: 'f142'
    },

    f142: {
      when: { ch3Told: false },
      // her eyes open exactly where her face is in the next panel (`eyes: 'sprinkle'`)
      scene: S('bridge', 'back', merge(BACK, { eyes: 'sprinkle' }),
        [c('player', 'sit', 'happy', 'back-left', 'right'), c('riffle', 'scramble', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, THE KEPT PATH ONLY. In the cool dark at the very back of the bridge, the last orange light reaching in along the mud, two big round eyes open and shine like river stones, exactly where they shone yesterday. Our cat sits down in front of them as Riffle scrambles in behind, dripping; a small inset shows the empty bank it looked along first. Captions top left, away from the eyes.',
      caption: ['At the Old Bridge, you check the bank first. No ginger ears.', 'Under the bridge, two big eyes shine.'],
      next: 'f143'
    },

    f143: {
      // the wide view under the arch (chapters 3 and 4's three-shot), between the eyes in the dark
      // and the news: no reader has five panels in a row from the back of the nook
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'happy', 'mud', 'right'),
         c('riffle', 'sit', 'happy', { x: 400, y: 940 }, 'right')], ['sunset']),
      board: 'WIDE, HER VIEW IN. Under the arch in the dim orange light, the sunset river a bright strip at the left: Sprinkle has come right out into the open of her nook and sits up as tall as she can, mist-grey, so eager that her drooping wing trembles. Our cat and Riffle settle on the mud in front of her, full of the day. Her balloon bursting, the last word enormous.',
      say: [{ who: 'sprinkle', text: 'Tell me EVERYTHING.' }],
      next: 'f144'
    },

    f144: {
      // nobody new today: Sprinkle comforts, and tells her how the pale sister hides (no name)
      when: NONE,
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'kind', 'dragon', 'left'), c('player', 'sit', 'shy', 'back-left', 'right'),
         c('riffle', 'sit', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, ONLY FOR A CAT WHO FOUND NOBODY NEW TODAY. Sprinkle has come out into the open of her nook and sits up, mist-grey in the dim orange light; our cat owns up with its ears a little down, and she answers as if it were the easiest sum in the world. Riffle nods along. Our cat’s balloon small; her two warm, the second a secret passed on.',
      say: [
        { who: 'player', text: 'I didn’t find anyone new today.' },
        { who: 'sprinkle', text: 'You will. You found me.', when: { foundSquall: false } },
        { who: 'sprinkle', text: 'You will. You found me. And Squall.', when: { foundSquall: true } },
        { who: 'sprinkle', text: 'My pale sister is the best at hiding. You have to wait till she blinks.' }
      ],
      next: 'f145'
    },

    f145: {
      // her news of the littlest brother, for a cat who went up today, in the same wide view as
      // “Tell me EVERYTHING.” (the lines read the flags, not this reading’s choices). Each of her
      // three pieces of news has a panel of its own: one balloon of hers, and Sprinkle’s answer
      // where she has one (three balloons in one panel crossed their tails over Sprinkle).
      when: { ch5Roof: true },
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'wonder', { x: 1000, y: 760 }, 'left'), c('player', 'pawup', 'proud', 'mud', 'right'),
         c('riffle', 'sit', 'happy', { x: 400, y: 940 }, 'right')], ['sunset']),
      board: 'WIDE, HER VIEW IN, ONLY FOR A CAT WHO WENT UP THE TOWER TODAY. Under the arch our cat begins the day’s news with a forepaw lifted, five claws spread, the way a small dragon on a roof held up his. Sprinkle’s eyes go round, and Riffle grins: he has heard this one already. Our cat’s balloon proud.',
      say: [{ who: 'player', text: 'I found your littlest brother. He says: five.' }],
      next: 'f146'
    },

    f146: {
      // her news of Puddle, and the answer of a sister who knows him
      when: { foundPuddle: true },
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'kind', 'dragon', 'left'), c('player', 'pawup', 'proud', 'back-left', 'right'),
         c('riffle', 'sit', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, ONLY FOR A CAT WHO FOUND PUDDLE. Closer now, at the back of the nook: our cat lifts a forepaw for the brother under the raft, and tells how he went down with it still held up. Sprinkle does not so much as blink at the news that he sank. Our cat’s balloon proud; her one answer perfectly calm.',
      say: [
        { who: 'player', text: 'Puddle is under the otters’ raft. He says: five. Then he sank.' },
        { who: 'sprinkle', text: 'He does that.' }
      ],
      next: 'f147'
    },

    f147: {
      when: { foundWisp: true },
      scene: S('bridge', 'back', BACK,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left', { tear: true }), c('player', 'pawup', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, ONLY FOR A CAT WHO FOUND WISP. Our cat lifts a forepaw once more, for the pale sister in the reeds, and a small inset shows her: a dragonet on one leg beside a heron, holding up five frost-pale claws. Sprinkle’s eyes fill, and Riffle’s mouth falls open: nobody had told him. Our cat’s balloon gentle.',
      say: [{ who: 'player', text: 'Wisp is in the reeds, being a heron. She held up five.' }],
      next: 'f148'
    },

    f148: {
      // the mud count: a forepaw for Sprinkle and for every dragonet she has ever met (two to four
      // taps: 10, 15 or 20), only when she met one today
      when: ANY,
      scene: S('bridge', 'back', BACK_PAWS,
        [c('sprinkle', 'draw', 'happy', 'dragon', 'left'), c('player', 'sit', 'wonder', 'back-left', 'right'),
         c('riffle', 'sit', 'wonder', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, THE TAP PICTURE, ONLY FOR A CAT WHO MET A DRAGONET TODAY. In the mud in front of her nook Sprinkle has drawn six little forepaws again, four above three with one place empty, and now one long pale claw draws the seventh: her own. In play the counting picture takes the panel: seven little forepaws in the mud, hers glowing first; each tap lights five claw marks, one forepaw for everyone found, and the number in her balloon grows by five. Caption top left; her balloon one word.',
      caption: ['Sprinkle has drawn her six little forepaws in the mud again. Now she draws one more.'],
      say: [{ who: 'sprinkle', text: 'Mine.' }],
      skip: {
        table: 5, paws: 'mud', teacher: 'sprinkle', thing: 'claw', things: 'claws', prompt: '**Tap** a forepaw for everyone you’ve found.',
        who: [{ who: 'sprinkle' }, { who: 'squall', when: { foundSquall: true } }, { who: 'puddle', when: { foundPuddle: true } }, { who: 'wisp', when: { foundWisp: true } }],
        next: 'f149'
      }
    },

    f149: {
      when: ANY,
      scene: S('bridge', 'back', BACK_PAWS,
        [c('sprinkle', 'sit', 'happy', 'dragon', 'left', { tear: true }), c('player', 'sit', 'kind', 'back-left', 'right'),
         c('riffle', 'sit', 'happy', 'near', 'right')], ['sunset']),
      board: 'MEDIUM, ONLY FOR A CAT WHO MET A DRAGONET TODAY. The lit forepaws glow in the mud, the number she reached floating big over them, and Sprinkle looks at them as if they were the clutch itself, one happy misty tear on her cheek. Our cat and Riffle sit close on either side. Her first balloon a whisper; her second, for a cat who has not met the pale one, a secret passed on.',
      say: [
        { who: 'sprinkle', text: 'Mama’s count is coming back.', kind: 'whisper' },
        { who: 'sprinkle', text: 'But my pale sister is the best at hiding. You have to wait till she blinks.', when: { foundWisp: false } }
      ],
      next: 'f150'
    },

    f150: {
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'wonder', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'solemn', 'mud', 'right'),
         c('riffle', 'sit', 'wonder', { x: 400, y: 940 }, 'right')], ['sunset']),
      board: 'WIDE, HER VIEW IN. The three friends in the cool dark, the sunset river a strip of orange at the left, and our cat telling the afternoon with one paw held over the mud; a small inset shows a line of tiny prints beside that paw. Sprinkle listens with her head on one side, her own big five-clawed prints all round her in the mud. Our cat’s balloon low and plain.',
      say: [{ who: 'player', text: 'Somebody small crosses the marsh every night. With prints half the size of mine.' }],
      next: 'f151'
    },

    f151: {
      // clue 4, planted as a joke by the owner of the biggest feet in the story
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'lookdown', 'wonder', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'happy', 'mud', 'right'),
         c('riffle', 'sit', 'laugh', { x: 400, y: 940 }, 'right')], ['sunset']),
      board: 'WIDE, HER VIEW IN, COMEDY BEAT. Sprinkle bends her long neck and studies her own enormous feet, one of them planted in one of her own enormous prints, and works it out with great seriousness. Riffle has both paws over his mouth; our cat’s whiskers twitch. Caption top left; her balloon solemn.',
      caption: ['Sprinkle looks down at her own enormous feet.'],
      say: [{ who: 'sprinkle', text: 'Then they’re VERY small.' }],
      next: 'f152'
    },

    /* ------------------------------------------------------------------ Very loudly */

    f152: {
      // the warrior thread, one moment: a light choice, and one answer does for both
      scene: S('den', 'outside', DEN_DUSK,
        [c('player', 'sit', 'happy', 'entrance-left', 'right'), c('tallyheart', 'sit', 'proud', 'entrance-right', 'left')], ['dusk']),
      board: 'WIDE, AT THE DEN, DUSK. The rosebush den in the rose-grey dusk, and Tallyheart sitting at the far side of its doorway, waiting; over her, low above the towers, hangs a crescent moon a little fatter than last night’s. Our cat sits down at the near side of the doorway, tired and pleased. Caption top left; her balloon slow, three names counted out; the choices sit below the panel.',
      caption: ['At the den, Tallyheart is waiting.'],
      say: [{ who: 'tallyheart', text: 'Every warrior in this Clan has sat where you sat today. Glintstar. {Murmur}chime. Me.' }],
      choice: {
        options: [
          { label: '“Did you jump in?”', sets: {}, next: 'f153' },
          { label: '“Were you scared?”', sets: {}, next: 'f153' }
        ]
      }
    },

    f153: {
      scene: S('den', 'outside', DEN_DUSK,
        [c('player', 'sit', 'wonder', 'entrance-left', 'right'), c('tallyheart', 'sit', 'solemn', 'entrance-right', 'left')], ['dusk']),
      board: 'WIDE, AT THE DEN, COMEDY BEAT. Tallyheart answers with a perfectly straight face, looking off over the camp as if she could still hear herself, and a small inset shows a much smaller ginger apprentice on a raft with her eyes shut and her mouth wide open. Our cat stares at her. Her balloon two short sentences, the second the joke.',
      say: [{ who: 'tallyheart', text: 'I counted. Very loudly.' }],
      next: 'f154'
    },

    f154: {
      scene: S('den', 'doorway', DEN_DUSK_IN,
        [c('player', 'sit', 'happy', 'entrance-left', 'right'), c('tallyheart', 'sit', 'kind', 'doorway', 'left')], ['dusk']),
      board: 'MEDIUM, FROM INSIDE THE DEN, DUSK. The doorway from inside, a patch of dusk sky with the fat crescent moon in it, and in it the two of them close together: Tallyheart has leaned down and touched her nose to our cat’s ear. Our cat holds very still, the way it held still on the raft. Caption top left; her balloon quiet and sure.',
      caption: ['She touches her nose to your ear.'],
      say: [{ who: 'tallyheart', text: 'And now you’ve sat there too.' }],
      next: 'f155'
    },

    f155: {
      when: { worry: 'water' },
      scene: S('den', 'outside', DEN_DUSK,
        [c('player', 'sit', 'proud', 'entrance-left', 'right'), c('tallyheart', 'sit', 'kind', 'entrance-right', 'left')], ['dusk']),
      board: 'WIDE, AT THE DEN, ONLY FOR A CAT WHO WORRIES ABOUT WATER. Tallyheart asks it lightly, her torn ear tipped, and our cat answers with its chin up; a small inset shows the wide bright river from the middle of a raft, and two small paws on a log. Nobody says the water is any smaller. Her balloon gentle; our cat’s plain and a little proud.',
      say: [
        { who: 'tallyheart', text: 'And the deep water?' },
        { who: 'player', text: 'Still deep. I looked right at it.' }
      ],
      next: 'f156'
    },

    f156: {
      // the telling: every cat reads it, with a pair of balloons more for a noticing cat or a climber
      // (in the wide view: from inside the doorway the two balloons' tails crossed, and both read as hers)
      scene: S('den', 'outside', DEN_DUSK,
        [c('player', 'sit', 'wonder', 'entrance-left', 'right'), c('tallyheart', 'sit', 'solemn', 'entrance-right', 'left')], ['dusk']),
      board: 'WIDE, AT THE DEN, DUSK. At the doorway our cat tells the day with its paws, and four small insets float over it in a row: a duck, a tuft of fur on a vine, a line of tiny prints, and two long low smudges on wet mud. Tallyheart listens to every one without a word, weighing them like prey. Caption top left; for a noticing cat or a climber, one more thing of its own and her short answer.',
      caption: ['You tell her about the duck, the fur, the prints, and the two small shapes.'],
      say: [
        { who: 'player', text: 'And the same tiny prints were behind OUR pile. Till a tail swept them.', when: { specialty: 'noticing' } },
        { who: 'tallyheart', text: 'A thing to check.', when: { specialty: 'noticing' } },
        { who: 'player', text: 'And the prints run off toward the train tracks.', when: { specialty: 'climbing' } },
        { who: 'tallyheart', text: 'A thing to check.', when: { specialty: 'climbing' } }
      ],
      next: 'f157'
    },

    f157: {
      scene: S('den', 'outside', DEN_DUSK,
        [c('player', 'sit', 'solemn', 'entrance-left', 'right'), c('tallyheart', 'sit', 'kind', 'entrance-right', 'left')], ['dusk']),
      board: 'WIDE, AT THE DEN, DUSK. Our cat lays the two claims side by side, and two small insets show her two cards side by side: the fox’s moon, and the heron’s black sky. Tallyheart looks up at the real moon over the towers, then back at our cat, and puts it as a question. Our cat’s balloon first; hers three short sentences; the choices sit below the panel.',
      say: [
        { who: 'player', text: 'And the fox says moon. The heron says no moon.' },
        { who: 'tallyheart', text: 'Two stories. One sky. So who’s wrong?' }
      ],
      choice: {
        options: [
          { label: '“The fox!”', sets: {}, next: 'f158a' },
          { label: '“I don’t know yet.”', sets: {}, next: 'f158b' }
        ]
      }
    },

    f158a: {
      scene: S('den', 'doorway', DEN_DUSK_IN,
        [c('player', 'sit', 'wonder', 'entrance-left', 'right'), c('tallyheart', 'sit', 'kind', 'entrance-right', 'left')], ['dusk']),
      board: 'MEDIUM, FROM INSIDE THE DEN, DUSK. Tallyheart tips her head, not saying no, and holds up one paw the way she does over a sum that is not finished yet. Our cat shuts its mouth and thinks about it. Her balloon gentle, two short sentences.',
      say: [{ who: 'tallyheart', text: 'Maybe. But a counting cat says: not yet.' }],
      next: 'f159'
    },

    f158b: {
      scene: S('den', 'doorway', DEN_DUSK_IN,
        [c('player', 'sit', 'solemn', 'entrance-left', 'right'), c('tallyheart', 'sit', 'proud', 'entrance-right', 'left')], ['dusk']),
      board: 'MEDIUM, FROM INSIDE THE DEN, DUSK. Tallyheart’s whiskers spread in a slow grin and she dips her head to our cat, the way she does for the best answers in the Hollow. Our cat sits a little taller in the doorway. Her balloon warm, two short sentences.',
      say: [{ who: 'tallyheart', text: 'Good. That’s the hardest thing to say.' }],
      next: 'f159'
    },

    f159: {
      scene: S('den', 'outside', DEN_DUSK,
        [c('player', 'sit', 'wonder', 'entrance-left', 'right'), c('tallyheart', 'sit', 'kind', 'entrance-right', 'left')], ['dusk']),
      board: 'WIDE, AT THE DEN, DUSK. Tallyheart gives our cat tomorrow’s job, looking out over the darkening camp to where the rain stopped four nights ago; a small inset shows a wet night, and a question mark where a watcher should be. For the cat who caught the fox’s flew and told her, she bends close first and whispers. Her whisper balloon small; her other balloon an errand.',
      say: [
        { who: 'tallyheart', text: 'One hole in his story for certain. Maybe two.', kind: 'whisper', when: { ch4CaughtFly: true, ch3Told: true } },
        { who: 'tallyheart', text: 'Then find me somebody else who was awake when the rain stopped.' }
      ],
      next: 'f160'
    },

    f160: {
      // noticing only: she remembers what people say (module-1’s route to the moon for a noticing cat)
      when: { specialty: 'noticing' },
      scene: S('den', 'doorway', DEN_DUSK_IN,
        [c('player', 'sit', 'dreamy', 'entrance-left', 'right'), c('tallyheart', 'sit', 'kind', 'entrance-right', 'left')], ['dusk']),
      board: 'MEDIUM, FROM INSIDE THE DEN, A NOTICING CAT ONLY. Our cat’s eyes go far away, and over its head a thought bubble holds a fluffy white pillow cat hanging over a balcony railing in the middle of the night, bow askew, wide awake. Tallyheart, beside it in the doorway, sees it thinking and says nothing. One caption at the top.',
      caption: ['Waffles was up ALL night. With her nerves.'],
      next: 'f161'
    },

    f161: {
      // only for a cat who met a dragonet today: whispered on the told path, kept on the other
      when: ANY,
      scene: S('den', 'outside', DEN_DUSK,
        [c('player', 'sit', 'kind', 'entrance-left', 'right'), c('tallyheart', 'crouch', 'kind', 'entrance-right', 'left')], ['dusk']),
      board: 'WIDE, AT THE DEN, ONLY FOR A CAT WHO MET A DRAGONET TODAY. On the told path our cat stretches up to Tallyheart’s torn ear and whispers the rest, and she bends low to hear it, her eyes going wide; on the kept path it looks at its own paws and says nothing, a small wriggling bubble over its head. The moon has slid a little lower over the towers. Caption top left and her balloon, or the one caption, by the path she took.',
      caption: [
        { when: { ch3Told: true }, text: 'Then you whisper the rest.' },
        { when: { ch3Told: false }, text: 'You don’t tell her the rest. Your secret is getting bigger.' }
      ],
      say: [{ who: 'tallyheart', text: 'That is a LOT of dragon. And a lot to check. Together.', when: { ch3Told: true } }],
      next: 'f162'
    },

    f162: {
      // (lying, so the stone is under her chin or by her nose, as the caption says)
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'lie', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat lies in its own moss nest in the dark, and along the nest’s mossy edge its Case File stands in two rows now, yesterday’s bark behind and today’s in front, each piece overlapping the next like roof tiles. Riffle’s nearly black stone lies where it was put. Captions top left, the second by where she put the stone.',
      caption: [
        'In your nest: skritch, skritch. Today’s bark goes along the mossy edge.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      next: 'f163'
    },

    f163: {
      // heard, not seen: the old tom on his pinecone, and asleep again (chapter 6 opens on twenty)
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'lie', 'wonder', 'sleeper-1', 'right'), c('player', 'sit', 'wonder', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. Our cat sits up in its nest with one ear turned to the doorway, and across the empty middle nest the grey apprentice lifts his head too. From far off in the dark camp comes one small yelp, lettered tiny in the doorway, and after a pause a long familiar snore, lettered larger. Caption top left; no moon, only starlight through the rose leaves.',
      caption: ['From the prey pile comes a small “Ow.” Then, a little later:'],
      sfx: 'SNNNRRRK.',
      // (the joke’s last word, for a child who listens: nobody can say “SNNNRRRK.”)
      sfxRead: 'a long, long snore.',
      next: 'f164'
    },

    f164: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'sit', 'wonder', 'sleeper-1', 'right'), c('player', 'loaf', 'proud', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. The grey apprentice is sitting up in his nest in the dark, eyes like saucers, whispering across the empty middle nest; our cat answers from its own nest, trying not to sound too pleased, and fails. Three small balloons, his last one a little embarrassed.',
      say: [
        { who: 'snorer', text: '{name}paw? Did you really sit through the Roar?', kind: 'whisper' },
        { who: 'player', text: 'Not one claw moved.' },
        { who: 'snorer', text: '…Do the paw thing.', kind: 'whisper' }
      ],
      next: 'f165'
    },

    f165: {
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, IN THE DARK, THE TAP PICTURE. Our cat lies in its nest with both forepaws stretched out on the moss in front of it. In play the counting picture takes the panel: its own two forepaws on dark moss, glowing softly together, one claw tucked in; each tap pats them down, lights the nine claws and puts the next number in its murmur, 9, 18, 27, 36, and the fifth tap turns the page. Its murmur balloon at the top.',
      say: [{ who: 'player', text: 'Nine. Eighteen. Twenty-seven…', kind: 'whisper' }],
      skip: { table: 9, groups: 5, thing: 'claw', things: 'claws', paws: 'both', prompt: '**Tap** your forepaws.', next: 'f166' }
    },

    f166: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. A big 45 floats over the dark, and across the empty middle nest the grey apprentice has sunk back down with his chin on his paws, eyelids drooping, getting one last remark out before sleep takes him. Our cat keeps its paws exactly where they are. His balloon a mumble, trailing off.',
      say: [{ who: 'snorer', text: 'That’s a NEW paw thing.' }],
      next: 'f167'
    },

    f167: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'loaf', 'kind', 'nest', 'left')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. The grey apprentice has curled up tight and is snoring, a little zzz rising from him, and our cat smiles at him across the dark. For a cat who has not met the littlest dragonet, one tiny hiccup drifts in from far away and very high up, and it turns an ear to it. Captions top left, the second only for that cat.',
      caption: [
        'By forty-five, he’s snoring too.',
        { when: { foundSquall: false }, text: '…hic! Sprinkle’s littlest brother is still up there.' }
      ],
      next: 'f168'
    },

    f168: {
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'loaf', 'dreamy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP. Our cat settles its chin on its paws beside its two rows of bark, eyes half shut, and a small thought bubble holds tomorrow: a fat old snake peering out between two stones with a pebble balanced on his nose, and beside him one very small fish with a question mark over it. One caption at the top, a smile in its last sentence.',
      caption: ['Tomorrow: Coil. What does a nosy old snake want for a secret? You hope it isn’t fish.'],
      next: 'f169'
    },

    f169: {
      scene: S('den', 'outside', DEN, [], ['night', 'stars', 'skyriver']),
      board: 'WIDE. The rosebush den from outside under a clear night sky: the Sky River pours across it from corner to corner, the crescent moon long since set, and a soft glow of moss inside the den. Everything is still. Caption at the bottom.',
      caption: ['Over the rosebush, the Sky River shines, and you fall asleep.'],
      next: 'f170'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f170: {
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside its rows of bark and Riffle’s stone, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream about, the night {they} sat through the Roar?'],
      // short enough for one line in the box
      input: { kind: 'dream', placeholder: 'A skymonster… fish… a blink…', next: 'f171' }
    },

    f171: {
      scene: S('den', 'doorway', DEN_BARK,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'stars', 'skyriver', 'zzz']),
      board: 'WIDE CLOSING SHOT, FROM INSIDE THE DEN. Our cat sleeps curled in its moss nest with its Case File along the edge in two rows, both forepaws tucked under its chin, and through the doorway the Sky River shines over the rosebush. One tiny contented zzz. Caption at the bottom, with END OF CHAPTER FIVE lettered like a title.',
      caption: [
        'You sleep warm in your nest, with nine claws out and one tucked in, and the Sky River shining over the rosebush.',
        'End of Chapter Five.'
      ],
      end: true
    }
  };

  /* ------------------------------------------------------------------ The roof, shared
   * Chapter 4’s two roof sections (“Up the tower”, “The littlest dragonet”), word for word and
   * picture for picture but for the hour (below): its own frames, from the tower choice’s first
   * option to the forepaw Tap, copied under this chapter’s ids (`first`, `first + 1`, …, all `a`). The last one sets
   * `foundSquall` and, here, `ch5Roof`, and turns to `home` (the Crossing). The riddle is chapter
   * 4’s set (`ch04-riddle`) and the card chapter 4’s (`squall-shapes`). */
  var ROOF_HOURS = ['day', 'morning', 'sunset', 'dusk', 'night'];
  function roof(first, home) {
    var four = PC.story.ch04, F4 = four && four.frames;
    if (!F4) throw new Error('app/story/ch05.js runs chapter 4’s roof: app/story/ch04.js is loaded before it');
    function way(f) { return f.next || (f.counts && f.counts.next) || (f.skip && f.skip.next); }
    // chapter 4’s tower choice is its one choice with a second label for a cat who has met him
    var tower = Object.keys(F4).filter(function (k) { return F4[k].choice && F4[k].choice.options.some(function (o) { return o.labelWhen; }); })[0];
    var ids = [], id, map = {}, out = {};
    for (id = F4[tower].choice.options[0].next; /a$/.test(id); id = way(F4[id])) ids.push(id);
    ids.forEach(function (k, i) { map[k] = fid(first + i, 'a'); });
    ids.forEach(function (k, i) {
      var f = clone(F4[k]);
      // she climbs it in the morning here, between the lesson and the Crossing: the roof in plain
      // daylight, as the tower below it and the Crossing after it are (chapter 4 went up in the
      // afternoon's gold, the roof set's own light), and the two boards that name the hour say so
      if (f.scene && f.scene.set === 'roof') {
        f.scene.fx = ['day'].concat((f.scene.fx || []).filter(function (x) { return ROOF_HOURS.indexOf(x) < 0; }));
        if (f.board) f.board = f.board.replace('in the gold of the afternoon', 'in the bright day').replace('catch the afternoon sun', 'catch the sun');
      }
      if (f.next) f.next = map[f.next] || home;
      if (f.counts) f.counts.next = map[f.counts.next] || home;
      if (f.skip) f.skip.next = map[f.skip.next] || home;
      if (i === ids.length - 1) f.sets = { foundSquall: true, ch5Roof: true };
      out[map[k]] = f;
    });
    return out;
  }

  /* ------------------------------------------------------------------ Under the raft
   * Optional, and read in one of two places: after the Roar (`late` false: f058a…f065a, on to “Who’s
   * first”), or on the way home after Riffle’s slip (`late` true: f123a…f130a, in the late gold, on
   * to the bubbles). One Counts set, one card; both last frames set `foundPuddle`. He is never a
   * shape under the water: a foot, then a head; and his last picture has his eyes and his grin
   * above it. Every balloon of his is “The big-footed dragon” until “I’m Puddle”. In all eight panels
   * the order is Riffle, our cat, Puddle: the `edge` and `beside` cameras see the raft from its other
   * side (their `raft-2` is to the left of their `raft-1`), so in the three `raft`-camera panels our
   * cat sits at `raft-2`, next to the water he is in, and Riffle at `raft-1` behind her. */
  function underRaft(n, next, late) {
    var L = late ? { late: true, fish: 'spare' } : {}, out = {};
    var LIGHT = late ? ', LATE LIGHT' : '';
    function id(i) { return fid(n + i, 'a'); }
    function R(more) { return merge(merge(RIVER, L), more || {}); }
    out[id(0)] = {
      scene: S('openriver', 'edge', R({ foot: true, shiver: true }),
        [c('riffle', 'whistle', 'shy', 'raft-2', 'right'), c('player', 'peer', 'wonder', 'raft-1', 'right')], ['day']),
      board: 'HIGH ANGLE, CLOSE ON THE LOGS' + LIGHT + '. Our cat leans right out over the raft’s edge, nose down to the gap between two logs, and up through that gap pokes a foot: blue-grey, scaly, far too big for whatever it belongs to, with five pale claws, wiggling. Riffle whistles harder than ever and looks at the sky. Captions top left, the middle one for a cat who worries about water.',
      caption: [
        'You lean over the edge.',
        { when: { worry: 'water' }, text: 'The deep water is right under your nose. You look anyway.' },
        'Between two logs, a foot pokes up: blue-grey, and much too big. It wiggles.'
      ],
      next: id(1)
    };
    out[id(1)] = {
      scene: S('openriver', 'beside', R(),
        [c('riffle', 'hush', 'worried', 'raft-2', 'right'), c('player', 'peer', 'wonder', 'raft-1', 'right'),
         c('puddle', 'head', 'worried', 'beside', 'left')], ['day']),
      board: 'MEDIUM, BESIDE THE RAFT' + LIGHT + ', COMEDY BEAT. In the bright water beside the logs a head has popped up, in plain sight: a blue-grey dragonet’s, round friendly eyes, two soft nubs for horns, a small bump on top, river running off it. Our cat peers down at it from the raft’s edge; behind, Riffle has clapped a paw over his own mouth. The SPLOOSH! rings round the head; caption top left; three balloons, back and forth, the head’s very earnest.',
      sfx: 'SPLOOSH!',
      caption: ['Up pops a head.'],
      say: [
        { who: 'puddle', text: 'I’m not here. I’m a log.' },
        { who: 'player', text: 'Logs don’t have feet.' },
        { who: 'puddle', text: 'This one’s got four.' }
      ],
      next: id(2)
    };
    out[id(2)] = {
      scene: S('openriver', 'raft', R(),
        [c('riffle', 'sit', 'happy', 'raft-1', 'right'), c('player', 'sit', 'kind', 'raft-2', 'right'),
         c('puddle', 'head', 'wonder', 'beside', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS' + LIGHT + '. At cat height on the raft: our cat and Riffle on the logs, and in the water at the raft’s end the blue-grey head, eyes going as round as lily pads at one word. Our cat says it gently, the way it said it on a roof or under a bridge. Its balloon soft; the head’s a shout.',
      say: [
        { who: 'player', text: 'Sprinkle sent me.' },
        { who: 'puddle', text: 'SPRINKLE?', kind: 'shout' }
      ],
      next: id(3)
    };
    out[id(3)] = {
      scene: S('openriver', 'beside', R(),
        [c('riffle', 'sit', 'happy', 'raft-2', 'right'), c('player', 'sit', 'happy', 'raft-1', 'right'),
         c('puddle', 'head', 'happy', 'beside', 'left')], ['day']),
      board: 'MEDIUM, BESIDE THE RAFT' + LIGHT + ', THEN THE COUNTS. A ring of ripples where he went under, and the head already up again in the middle of it, grinning, water streaming off its bump; he remembers his manners, or his mother’s. In the Counts picture the raft is seen from underneath: four logs in a row, ten little bump stars on every one; after a miss the stars light a log at a time and our cat hops by tens. Caption top left; his balloon loud; the keypad sits below the panel.',
      caption: ['He sinks, blub, and pops up again.'],
      say: [{ who: 'puddle', text: 'Mama’s rule: strangers get a riddle!' }],
      counts: { set: 'ch05-puddle', next: id(4) }
    };
    out[id(4)] = {
      // “I’m Puddle”: from this balloon on, his balloons carry his name
      scene: S('openriver', 'raft', R(),
        [c('riffle', 'stand', 'laugh', 'raft-1', 'right'), c('player', 'sit', 'happy', 'raft-2', 'right'),
         c('puddle', 'head', 'proud', 'beside', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS' + LIGHT + '. The head in the water introduces itself, proud of its orders, and a small inset shows them: three ferry otters solemnly pointing at a log. On the raft Riffle bounces on his toes, bursting with a whole night of not telling. The head’s two balloons cheerful; Riffle’s a squeak of relief.',
      say: [
        { who: 'puddle', name: 'Puddle', text: 'I’m Puddle. The otters said: be a log. Till everybody stops shouting DRAGON.' },
        { who: 'puddle', name: 'Puddle', text: 'Logs get LOTS of fish.' },
        { who: 'riffle', text: 'Granny only told me LAST NIGHT. I nearly popped!' }
      ],
      next: id(5)
    };
    out[id(5)] = {
      scene: S('openriver', 'beside', R(),
        [c('riffle', 'sit', 'wonder', 'raft-2', 'right'), c('player', 'sit', 'wonder', 'raft-1', 'right'),
         c('puddle', 'head', 'wonder', 'beside', 'left')], ['day']),
      board: 'MEDIUM, BESIDE THE RAFT' + LIGHT + '. Puddle tells it with his eyes wide, treading water, and a thought cloud over his head shows what one flash of lightning showed him from the air: a heap of mice in a garden, and over it two small paws and nothing more of their owner, lifting a mouse away. Our cat leans out to listen. His two balloons breathless.',
      say: [
        { who: 'puddle', name: 'Puddle', text: 'The storm rolled me right over a garden first. FLASH! A heap of mice.' },
        { who: 'puddle', name: 'Puddle', text: 'And something with clever little paws, picking them up. Very tidy.' }
      ],
      next: id(6)
    };
    out[id(6)] = {
      // his card holds what he said (paws, mice, the storm night): “Our PILE!” is hers
      card: 'puddle-paws',
      scene: S('openriver', 'raft', R(),
        [c('riffle', 'sit', 'wonder', 'raft-1', 'right'), c('player', 'stand', 'shout', 'raft-2', 'right'),
         c('puddle', 'head', 'happy', 'beside', 'left')], ['day']),
      board: 'MEDIUM, ON THE LOGS' + LIGHT + ', COMEDY BEAT. Our cat is on its feet on the logs, tail straight up, and the head in the water finishes its story with great satisfaction: a small inset shows a blue-grey dragonet tumbling out of a storm cloud and a river coming up to meet him. Riffle looks from one to the other. Our cat’s balloon a yelp; his cheerful; the new card appears under the panel, an ear in its corner.',
      say: [
        { who: 'player', text: 'Our PILE!' },
        { who: 'puddle', name: 'Puddle', text: 'I said EEK. Then the river said SPLOOSH.' }
      ],
      next: id(7)
    };
    out[id(7)] = {
      // the scene’s last frame: by now she has read his name, his riddle and his “five”
      sets: { foundPuddle: true },
      scene: S('openriver', 'beside', R(),
        [c('riffle', 'sit', 'happy', 'raft-2', 'right'), c('player', 'sit', 'kind', 'raft-1', 'right'),
         c('puddle', 'pawup', 'happy', 'beside', 'left')], ['day']),
      board: 'MEDIUM, BESIDE THE RAFT' + LIGHT + ', THE TAP PICTURE. Puddle holds one big blue-grey forepaw up out of the water, five pale claws spread, and his chin dips under while his eyes and his grin stay above it, perfectly cheerful. In play the counting picture takes the panel: his one raised forepaw, glowing softly; one tap lights its five claws, a big 5 grows over them, and the page turns. Caption top left; his balloon full of importance.',
      caption: ['He holds up a forepaw, and starts to sink.'],
      say: [{ who: 'puddle', name: 'Puddle', text: 'Mama says: stay where you land. So tell Sprinkle: five!' }],
      skip: { table: 5, groups: 1, who: [{ who: 'puddle' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: next }
    };
    return out;
  }

  /* ------------------------------------------------------------------ What the otters heard
   * Read exactly once, in one of two places: at the rocks right after the Roar, for a cat who chose
   * the otters (`late` false: f067a…f074a, on to the marsh), or at the Crossing on the way home, for
   * a cat who chose the heron (`late` true: f132…f139, in late light, behind `when … else` on its
   * first frame, on to the Old Bridge). Nothing in it changes but two lines. Tallyheart is in none
   * of its frames: she went home after the Roar. The old otter is the first otter in a cast when he
   * speaks, the gossip when he does (the nth balloon from a `who` belongs to the nth of them). */
  function otters(n, letter, next, late) {
    var out = {}, LIGHT = late ? ', LATE LIGHT' : '';
    function id(i) { return fid(n + i, letter); }
    function X(more) { return merge(late ? HOMEWARD : CROSS, more || {}); }
    var old = function (pose, mood) { return c('otter', pose, mood, 'shore', 'right', { variant: 1 }); };
    out[id(0)] = merge(late ? { when: { ch5First: 'heron' }, else: next } : {}, {
      scene: S('crossing', 'wide', X(),
        [c('otter', 'stand', 'happy', 'rock-right', 'right', { variant: 2 }), c('otter', 'sit', 'happy', 'pebbles', 'right', { variant: 3 }),
         old('sit', 'solemn'), c('player', 'sit', 'wonder', 'raft-1', 'left'), c('riffle', 'sit', 'happy', 'raft-2', 'left')], ['day']),
      board: 'WIDE, AT THE ROCKS' + LIGHT + (late ? ', ONLY FOR A CAT WHO ASKED THE HERON FIRST' : '') + '. The raft noses in against the Crossing’s rocks, where the ferry otters are sunning in a heap of whiskers and gossip, the old one by his mooring vine. Our cat asks from the logs, and the nearest otter answers at once, paws flung wide to show how big. Caption top left; our cat’s balloon first, his delighted; the choices sit below the panel.',
      caption: [late ? 'At last, the Crossing again.' : 'Riffle pushes the raft back to the rocks.'],
      say: [
        { who: 'player', text: 'What did you hear about the storm night?' },
        { who: 'otter', text: 'A dragon as big as a bridge!' }
      ],
      choice: {
        options: [
          { label: '“Who told you that?”', sets: {}, next: fid(n + 1, 'a') },
          { label: '“Did any of you SEE it?”', sets: {}, next: fid(n + 1, 'b') }
        ]
      }
    });
    out[fid(n + 1, 'a')] = {
      scene: S('crossing', 'rocks', X(),
        [c('otter', 'stand', 'proud', 'rock-right', 'right', { variant: 2 }), c('otter', 'sit', 'happy', 'pebbles', 'right', { variant: 3 })], ['day']),
      board: 'MEDIUM, ON THE ROCKS' + LIGHT + ', COMEDY BEAT. The gossiping otter draws himself up and names his witness with enormous dignity, one paw on his chest; a small inset shows a duck, looking as honest as a duck can. The otter beside him nods hard. His balloon proud.',
      say: [{ who: 'otter', text: 'A duck. A very honest duck.' }],
      next: id(2)
    };
    out[fid(n + 1, 'b')] = {
      scene: S('crossing', 'rocks', X(),
        [c('otter', 'stand', 'shy', 'rock-right', 'right', { variant: 2 }), c('otter', 'sit', 'happy', 'pebbles', 'right', { variant: 3 })], ['day']),
      board: 'MEDIUM, ON THE ROCKS' + LIGHT + ', COMEDY BEAT. The gossiping otter’s paws come slowly down and he looks at his own toes; a small inset shows where his dragon came from: a duck, quacking behind one wing. The otter beside him looks away. His balloon small.',
      say: [{ who: 'otter', text: 'Well… no. A duck told me.' }],
      next: id(2)
    };
    out[id(2)] = {
      // one claim, as she was told it: who the old otter had the story from
      card: 'otter-fox',
      scene: S('crossing', 'raft', X(),
        [old('stand', 'stern'), c('player', 'sit', 'solemn', 'raft-1', 'left'), c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, AT THE RAFT' + LIGHT + '. Our cat gives its verdict on ducks from the logs, and the old ferry otter, on the last rock by his vine, snorts and tops it; a small inset shows a smiling fox on a riverbank, flapping both forepaws like wings. Riffle’s ears go up. Our cat’s balloon dry; the old otter’s gruff and sure; the new card appears under the panel, an ear in its corner.',
      say: [
        { who: 'player', text: 'No bark for ducks.' },
        { who: 'otter', text: 'The FOX told me himself. Twice. The dragon’s claws were full of mice. And off it flew.' }
      ],
      next: id(3)
    };
    out[id(3)] = {
      // only a cat who caught “flew” at the border in chapter 4: one thought, and nothing said aloud
      when: { ch4CaughtFly: true },
      scene: S('crossing', 'board', X(),
        [old('sit', 'stern'), c('player', 'sit', 'solemn', 'raft-1', 'left'), c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'CLOSE-UP, AT CAT HEIGHT' + LIGHT + ', ONLY FOR A CAT WHO CAUGHT FLEW AT THE BORDER. Our cat, on the first log, goes very still, and over its head a small thought bubble holds a mist-grey dragonet with her right wing drooping, half open. Its mouth stays shut: the old otter is two steps away. One caption at the top.',
      caption: ['Flew. Again. You know a dragon who can’t.'],
      next: id(4)
    };
    out[id(4)] = {
      scene: S('crossing', 'raft', X({ tuft: true }),
        [old('stand', 'stern'), c('player', 'sit', 'wonder', 'raft-1', 'left'), c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, AT THE RAFT' + LIGHT + '. The old otter hooks one claw under the raft’s mooring vine and lifts it taut between his rock and the first log, and there, caught in a twist of it, hangs a small tuft of thin brown fur. Our cat and Riffle crane to see. Caption top left; his balloon a grumble.',
      caption: ['He lifts the raft’s vine. Caught in it: a tuft of thin brown fur.'],
      say: [{ who: 'otter', text: 'And somebody’s been on my rocks in the dark.' }],
      next: id(5)
    };
    out[id(5)] = {
      scene: S('crossing', 'board', X({ tuft: true }),
        [old('stand', 'solemn'), c('player', 'sit', 'wonder', 'raft-1', 'left'), c('riffle', 'stand', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT' + LIGHT + '. The taut vine runs across the middle of the panel with the tuft of fur hanging from it, and on either side of it the three of them: the old otter on his ledge, our cat and Riffle on the logs, Riffle asking the only question that matters. The old otter answers a little too fast. Riffle’s balloon short; the old otter’s sure of itself.',
      say: [
        { who: 'riffle', text: 'Whose is it?' },
        { who: 'otter', text: 'Not a dragon’s. Dragons don’t HAVE fur.' }
      ],
      next: id(6)
    };
    out[id(6)] = {
      scene: S('crossing', 'raft', X({ tuft: true }),
        [old('hush', 'shy'), c('player', 'sit', 'wonder', 'raft-1', 'left'), c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, AT THE RAFT' + LIGHT + ', THE TAP PICTURE. The old otter coughs into one webbed paw, his eyes sliding off toward his raft and whatever is under it, and adds one word more. In play the tuft of fur on the vine glows softly; a tap on it brings our cat’s nose down to it and turns the page, and a tap anywhere else only makes it flutter. Caption top left; his balloon one small word.',
      caption: ['He coughs.'],
      say: [{ who: 'otter', text: '…Probably.' }],
      scratch: { tap: 'fur', prompt: '**Tap** the fur to sniff it.', label: 'Sniff the fur.', miss: 'flutter…', next: id(7) }
    };
    out[id(7)] = {
      // the card is what her nose can vouch for, and no more
      card: 'fur',
      scene: S('crossing', 'raft', X({ tuft: true }),
        [old('stand', 'wonder'), c('player', 'crouch', 'sniff', 'raft-1', 'left'), c('riffle', 'sit', 'wonder', 'raft-2', 'left')], ['day']),
      board: 'MEDIUM, AT THE RAFT' + LIGHT + '. Our cat stretches out from the first log with its nose almost on the tuft of fur, sniff lines curling up, eyes half shut to think; whoever left it was thin, and quick, and nobody it has ever met. The old otter holds the vine still for it. ' + (late ? 'Captions top left' : 'One caption at the top') + '; the new card appears under the panel, an eye in its corner.',
      caption: late ? ['Somebody small.', 'Tiny prints there. Thin fur here. The same somebody?'] : ['Somebody small.'],
      next: next
    };
    return out;
  }

  function add(more) { for (var k in more) if (Object.prototype.hasOwnProperty.call(more, k)) frames[k] = more[k]; }
  add(roof(22, 'f036'));
  add(underRaft(58, 'f066', false));
  add(otters(67, 'a', 'f075', false));
  add(underRaft(123, 'f131a', true));
  add(otters(132, '', 'f140', true));

  // The frames are written by section above; the chapter lists every frame in id order (f022a, f022b,
  // f023a…), the reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* Chapter 4’s tens lines, for the warm-up (the text: “chapter 4’s tens lines for praise, fast and
   * help”), and its pile’s help, for this morning’s rows. */
  var QUICK = [
    'You didn’t even have to hop that time.',
    'Quick as a pounce!',
    'You knew that one before I finished asking.'
  ];
  var TENS_HELP = 'Close. Let’s scratch it out together: two swipes for every cat, five lines a swipe.';
  var ROW_HELP = 'Let’s scratch it out: ten marks for every row.';
  var ROW_ZERO = 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.';
  var NINES_HELP = 'Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.';
  /* The three fish sets are Riffle’s, whole: Tallyheart went home after the Roar, so every word after
   * a miss on the river is his or her own. A borrowed pair takes nothing from its lender but the pair
   * (asked and drawn as fish), the help is scratched on a log of the raft, and she counts it herself. */
  function fish(more) {
    return merge({
      teacher: 'riffle', fillVoice: 'borrower', fillPicture: 'borrower', fillOrder: 'easiest', fillIntro: 'An easy one!',
      againIntro: 'The fish again!', miss: 'Phew. That one again in a minute.', missLast: 'There. Now we’ve counted it.',
      again: ['You GOT it!'], helpCounter: 'you', ground: 'log', ask: '{a} × {b}', praise: [], done: null
    }, more);
  }

  PC.story.ch05 = {
    id: 'ch05',
    number: 5,
    title: 'Riffle’s River',
    start: 'f001',
    // the two dragonets she may meet today, until each says his name (a lesson’s lines read these
    // too: every balloon of a riddle, its help, its fillers and its retry)
    names: { squall: 'The little dragon', puddle: 'The big-footed dragon' },

    // Her Case File: the nine cards this chapter can give, in the order she can get them (chapter
    // 4’s `squall-shapes`, given on the roof, is chapter 4’s). A card’s picture is its own id
    // (app/art/cards.js). Four pairs lie touching in her file from the moment she holds both, and
    // none is a claim with its answer: a link names its partners itself (`with`). `fox-moon` is not
    // answered yet (“not yet”): the chapter that brings the third witness adds its `answers`.
    cards: {
      'prints-pile': { mark: 'eye', line: 'Tiny prints in the dug earth behind the pile.' },
      // given under the raft; her file shows it only once that scene is finished
      'puddle-paws': { mark: 'ear', line: 'Puddle says clever little paws picked up mice on the storm night.', when: { foundPuddle: true } },
      'otter-fox': { mark: 'ear', line: 'The old otter says the fox told him the dragon story.' },
      fur: { mark: 'eye', line: 'Thin brown fur at the Crossing. Not cat. Not otter. Not fox.' },
      'heron-no-moon': { mark: 'ear', line: 'Patience says there was NO moon on the storm night.',
        link: { with: ['fox-moon'], line: 'One of them is wrong.' } },
      'heron-shapes': { mark: 'ear', line: 'Patience says two small shapes crossed her mud, carrying something.',
        link: { with: ['squall-shapes'], line: 'Two saw them. The same two shapes?' } },
      'prints-marsh': { mark: 'eye', line: 'Tiny prints in the marsh mud. Much smaller than a cat’s.',
        link: { with: ['prints-pile'], line: 'The same prints.' } },
      'prints-tracks': { mark: 'eye', line: 'The tiny prints run toward the train tracks.',
        link: { with: ['squall-shapes'], line: 'Both lead toward the tracks.' } },
      // given in the reeds; her file shows it only once that scene is finished
      'wisp-fox': { mark: 'ear', line: 'Wisp drew a fox dropping something glittering in the reeds.', when: { foundWisp: true } }
    },

    frames: ordered,

    counts: {
      // The pile, one question, its own Counts moment: the morning count. The three front rows she
      // walks along, lit a row at a time, with no number shown; the shadowed back row is the frame’s
      // scene, never the Counts picture. No praise and no closing screen: the gap answers. A miss is
      // scratched in the earth, ten marks a row, and borrows the easiest of yesterday’s tens (never
      // 5 × 10, which the warm-up asks, nor 4 × 10, which is Puddle’s riddle).
      'ch05-pile': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'rows' },
        facts: [
          { a: 3, b: 10, light: 'rows', check: true,
            prompt: [{ kind: 'caption', text: 'You walk along the rows. One full row. Two. Three.' },
              { kind: 'caption', text: 'How many pieces in three rows of ten?' }],
            retryPrompt: 'Three rows of ten. How many pieces?' }
        ],
        ask: '{a} × {b}',
        praise: [],
        ground: 'earth',
        helpIntro: ROW_HELP,
        helpIntroNotTen: ROW_ZERO,
        fillFrom: 'ch04-tens',
        fillOrder: 'easiest',
        avoid: [[5, 10], [4, 10]],
        fillIntro: 'One from yesterday.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        again: ['There it is. You remembered that one.'],
        done: null
      },

      // The warm-up on the 10s, in the Hollow: two questions. The first is adaptive, the hard slot
      // (warmHard, at 0): the 10s fact that was hardest for her in chapter 4, and 10 × 7 when nothing
      // was. It may be 4 × 10 (the hard pick’s own avoid list); it is never the pile’s 3 × 10 nor
      // 5 × 10, which are asked anyway. Then 5 × 10, written last, in Tallyheart’s words, with the
      // five rim cats for its picture. A borrowed question is never 4 × 10 (the set’s avoid). Nothing
      // says “last”, and no closing line: the bridge to today’s Count is the next frame’s text.
      'ch05-tens': {
        table: 10, thing: 'front claw', things: 'front claws', unit: 'cat', units: 'cats', teacher: 'tallyheart',
        facts: [
          [10, 7],
          { a: 5, b: 10, who: RIM,
            prompt: [{ who: 'tallyheart', text: 'Five cats, ten front claws each. How many front claws?' }], retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Fifty!' }], rightAgain: true }
        ],
        warmHard: { table: 10, at: 0, avoid: [[5, 10], [3, 10]] },
        avoid: [[5, 10], [3, 10], [4, 10]],
        fillFrom: 'ch04-tens',
        fillOrder: 'easiest',
        fillIntro: 'One from yesterday.',
        ask: '{a} × {b}',
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
        remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.',
        done: null
      },

      // The lesson: the 9s, nine lives, ten answers in both orders; every number from 1 to 10 once;
      // no answer is the one before plus or minus nine. A nine is a ten with one claw tucked in:
      // whenever a question is asked in the lesson, the first time or on its retry, its picture hops
      // (all ten claws lit on every cat) and tucks (one curls in on each) before she types
      // (`light: 'tuck'`); a question lent to fill a gap shows the still picture, and so does the
      // Hollow. Its own gaps are filled with the easiest of her right answers (`fillOrder` alone).
      // The second idea, the check, arrives with 4 × 9, right or missed: her two-number answers
      // scratched in the sand (`shows`), eighteen only when she has given it and is not about to be
      // asked it again ({also}).
      'ch05-nines': {
        table: 9, thing: 'life', things: 'lives', unit: 'cat', units: 'cats', teacher: 'tallyheart',
        label: 'Nine lives', hollowThings: 'nines',
        light: 'tuck',
        fillOrder: 'easiest',
        facts: [
          // the first two cats on the rim: the hop and the tuck spoken in the question
          { a: 2, b: 9, who: RIM.slice(0, 2), right: [{ who: 'tallyheart', text: 'Eighteen! Hop, then tuck.' }],
            rightAgain: [{ who: 'tallyheart', text: 'Eighteen! One and eight. There’s your nine.' }] },
          // ninety, which she typed yesterday the other way round: the new way lands on a number she knows
          { a: 9, b: 10, prompt: 'Ten cats. Ten tens make a hundred. Now tuck ten in.', retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Ninety! Yesterday it was nine cats, ten claws each. Same ninety!' }], rightAgain: true },
          // the steps named and no number given; then the check, on every path
          { a: 4, b: 9, prompt: 'Four cats. Hop by tens. Then tuck four in.', retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Thirty-six! Now look. Three and six make nine. {also}Every nines answer hides a nine!' }],
            rightAgain: [{ who: 'tallyheart', text: 'Thirty-six! Three and six. There’s your nine.' }],
            miss: 'Thirty-six. Now look. Three and six make nine. {also}Every nines answer hides a nine! We’ll come back to that one.',
            missLast: 'Thirty-six. Now look. Three and six make nine. {also}Every nines answer hides a nine!',
            shows: { kind: 'answers', of: [[2, 9]], also: 'One and eight make nine. ' } },
          [9, 1],
          // the first past five cats, bridged as chapters 3 and 4 bridged their sixth
          { a: 9, b: 6, prompt: 'Six cats. Six tens make sixty. Now tuck six in.', retryPrompt: true,
            right: [{ who: 'tallyheart', text: 'Fifty-four! Five and four. There’s your nine.' }], rightAgain: true },
          [3, 9], [9, 8], [5, 9], [7, 9],
          // the first words of chapter 3, with the cat who murmured them sitting on the rim
          { a: 9, b: 9, right: [{ who: 'tallyheart', text: 'EIGHTY-ONE!' }, { who: 'murmurchime', text: 'Not mice.' }], rightAgain: true }
        ],
        firstPrompt: 'Two cats. Hop by tens: twenty. Now tuck two in. How many lives?',
        ask: '{a} × {b}',
        // dealt in order: the first is true of every question, and “Hop, then tuck!”, the opener’s
        // own line, comes last
        praise: [
          'Yes! Nine lives on every cat.',
          'Tens, with a claw tucked in. That’s all a nine is.',
          'You tucked it!',
          'Hop, hop, tuck!',
          'Hop, then tuck!'
        ],
        fast: QUICK,
        fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
        helpIntro: NINES_HELP,
        helpIntroFar: NINES_HELP.replace(/^Close\.\s*/, ''),
        helpIntroTens: 'That’s the hop! Now the tuck: one claw in for every cat.',
        helpIntroOneTuck: 'So close! You tucked ONE claw. Tuck one in for every cat.',
        helpIntroNotNine: 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.',
        missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        done: 'That’s the nines.'
      },

      // Riffle’s fish: Patience’s thought cloud, the seven pairs her seven answers put there, none
      // lit. Her two balloons are the frame’s own; his wail is the question.
      'ch05-otter': fish({
        table: 2, thing: 'fish', things: 'fish', unit: 'answer', units: 'answers',
        picture: { kind: 'fish', layout: 'pairs', thought: true },
        facts: [
          { a: 7, b: 2, prompt: [{ who: 'riffle', text: 'How many fish is THAT?' }],
            retryPrompt: 'Seven answers, two fish for every answer. How many fish?',
            right: [{ who: 'riffle', text: 'FOURTEEN?' }, { who: 'riffle', text: 'For YES and NO?' }], rightAgain: true }
        ],
        helpIntro: 'Scratch it on the log! Two for every answer.',
        fillFrom: 'ch02-ears'
      }),

      // The bill: the nine pairs she has watched land in the cloud, in rows of three. Asked by
      // Patience in the same breath as the frame’s line; nobody praises her at the marsh.
      'ch05-bill': fish({
        table: 2, thing: 'fish', things: 'fish', unit: 'answer', units: 'answers',
        picture: { kind: 'fish', layout: 'pairs', thought: true },
        facts: [
          { a: 9, b: 2, prompt: [{ who: 'patience', text: 'Nine answers.' }, { who: 'patience', text: 'Two fish for every answer.' },
              { kind: 'caption', text: 'How many fish?' }],
            retryPrompt: 'Nine answers, two fish for every answer. How many fish?',
            right: [{ who: 'patience', text: 'Eighteen.' }, { who: 'patience', text: 'Before sunset.' }], rightAgain: true }
        ],
        helpIntro: 'Scratch it on the log! Two for every answer.',
        fillFrom: 'ch02-ears',
        avoid: [[7, 2]]
      }),

      // Riffle’s catch: four strings of fish laid across the logs, five on every string, lit a
      // string at a time. A miss borrows one string and two (three and one again after a second):
      // never five strings beside the four he caught.
      'ch05-catch': fish({
        table: 5, thing: 'fish', things: 'fish', unit: 'string', units: 'strings',
        picture: { kind: 'fish', layout: 'strings' },
        light: 'groups',
        facts: [
          { a: 4, b: 5, prompt: [{ kind: 'caption', text: 'Four strings, five fish on every string. How many fish?' }], retryPrompt: true,
            right: [{ who: 'riffle', text: 'TWENTY!' }, { who: 'player', text: 'Eighteen for Patience. Two to spare.' }], rightAgain: true }
        ],
        helpIntro: 'Scratch it on the log! Five for every string.',
        fillFrom: 'ch03-claws',
        avoid: [[5, 5]]
      }),

      // Puddle’s riddle: the raft from underneath, four logs in a row, ten bump stars on every one.
      // A miss lights his own stars a log at a time (no scratching under a raft) and she hops by
      // tens; he borrows two easy ones on his own logs (one, then two; three and one again after a
      // second miss): never more logs than the raft has.
      'ch05-puddle': {
        table: 10, thing: 'bump', things: 'bumps', unit: 'log', units: 'logs', teacher: 'puddle',
        picture: { kind: 'bumps' },
        facts: [
          { a: 4, b: 10, prompt: 'Four logs in this raft. I’ve bumped my head ten times on every one. How many bumps?',
            retryPrompt: 'Four logs, ten bumps on every one. How many bumps?',
            right: [{ who: 'puddle', text: 'FORTY!' }, { who: 'puddle', text: 'No wonder it hurts.' }], rightAgain: true }
        ],
        help: 'picture',
        helpCounter: 'you',
        helpIntro: 'Count my bumps! You hop!',
        fillFrom: 'ch04-tens',
        fillOrder: 'easiest',
        fillVoice: 'borrower',
        fillPicture: 'borrower',
        avoid: [[4, 10], [5, 10]],
        fillIntro: 'Do another one!',
        againIntro: 'My bumps again!',
        ask: '{a} × {b}',
        praise: ['YES!', 'You’re GOOD at bumps!'],
        again: ['You DID it!'],
        miss: 'There! Let’s do that one again.',
        missLast: 'There! All my bumps, counted.',
        done: null
      },

      // Wisp’s riddle, drawn and never spoken: a silent set. Every line the engine words is a
      // caption (`teacher: 'caption'`); only Patience speaks in it, once, to open the help. The
      // herons light one at a time and she counts by ones; the two smaller drawings she borrows are
      // three herons and five.
      'ch05-wisp': {
        table: 1, thing: 'leg in the water', things: 'legs in the water', unit: 'heron', units: 'herons', teacher: 'caption',
        picture: { kind: 'herons' },
        facts: [
          { a: 7, b: 1, prompt: [{ kind: 'caption', text: 'Seven herons, each standing on one leg. How many legs in the water?' }], retryPrompt: true,
            right: [{ kind: 'caption', text: 'She nods. Once.' }], rightAgain: true }
        ],
        help: 'picture',
        helpCounter: 'you',
        helpSays: 'patience',
        helpIntro: 'Look again. One leg each.',
        fillFrom: 'ch01-tails',
        fillOrder: 'easiest',
        fillVoice: 'borrower',
        fillPicture: 'borrower',
        avoid: [[1, 1], [4, 1]],
        fillIntro: 'She draws another one.',
        againIntro: 'She taps the seven herons again.',
        ask: '{a} × {b}',
        praise: [],
        again: ['She nods.'],
        miss: 'She points at them again.',
        missLast: 'She counts them with you, one by one.',
        done: null
      }
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'Riffle’s River',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: '{name}paw’s dream that night floated off down the river.',
      // A page says “found” only for a dragonet found in this chapter: the roof’s line reads
      // `ch5Roof`, never `foundSquall` (chapter 4’s page has the other half of the rule). A tom's page
      // never has two different he's in one sentence (the otter and him, Puddle and him): the cat is
      // named there, or Puddle is.
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
      // the third and fourth of the seven dragonets’ pages: each only for a cat who has found it
      dragonet: [
        { id: 'puddle', name: 'Puddle', when: { foundPuddle: true }, pose: 'head',
          lines: [
            'Blue-grey, with feet much too big for him. He says he is a log.',
            '{name}paw found him under the otters’ ferry raft. Mama says: stay where you land.',
            'He says five, and then he sinks. He always pops up again. Five more claws, counted.'
          ] },
        { id: 'wisp', name: 'Wisp', when: { foundWisp: true }, pose: 'blink',
          lines: [
            'So pale you can nearly see the reeds through her. She thinks she is a heron.',
            '{name}paw found her in Patience’s reeds, by keeping very, very still.',
            'She stands on one leg, and draws what she has seen. Five more claws, counted.'
          ] }
      ]
    },

    teaser: {
      title: 'Chapter 6: The Snake in the Stones',
      lines: [
        'Tomorrow, you ask a nosy old snake what a secret costs.',
        'And Tallyheart counts out guards for the pile.'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
