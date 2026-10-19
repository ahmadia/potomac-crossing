/* Chapter 6: The Snake in the Stones.
 *
 * The story (docs/chapters/06-the-snake-in-the-stones.md, Draft v0.4) cut into graphic-novel panels,
 * per the frame contract in docs/build.md; its spec (docs/chapters/06-the-snake-in-the-stones.spec.md,
 * v0.2) is the build's contract for the flag, the Counts sets, the cards, the art, the pages she taps
 * and the book. Each frame is one moment: a drawn scene, a written storyboard (`board`) for a future
 * illustrator, short captions, speech balloons and sound effects (the drips say where they are
 * lettered, by Sloshbank's belly, and the first snore over the old tom: `sfxAt`; the skritch in her
 * nest, whose caption runs on into it, is said in words for a child who listens: `sfxRead`), and
 * exactly one interaction. Frame ids run in
 * reading order. A choice's outcomes carry a letter and rejoin at a plain number:
 *   a light choice     its two outcomes at the next number, `a` and `b` (f022a, f022b, the marching
 *                      order; f127a, f127b, the starry cat), one panel each;
 *   the fair question  asking it unfairly first is `a` (f035a, f036a: Tallyheart's nudge, then the
 *     (f034)           fair one); asking it fair goes straight on to the admission (f037);
 *   the fox trail      following it is `a` (f049a…f068a, "The last post": Sleet), "Not today" is `b`
 *     (f048)           (f049b, f050b); both meet under the Old Bridge (f069);
 *   Coil's question    one answer does for both, and there is no outcome panel (f100: “Never”, f101).
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line of narration that
 * follows a balloon on one screen of the story opens the next panel, or the panel is split in two
 * (the spec's build notes list the screens where the order matters). A line the story marks [if …]
 * carries a `when`. A scene cannot vary by flag, so where Tallyheart's being there changes the
 * picture the panel is two frames, one after the other, with opposite `when`s (the told path's with
 * her in it, the kept path's without): whichever is not hers is passed over. The close shots she
 * would not be in are written once: the last post's `border-fox`, the dogs, the bridge's `wall` (a
 * composition of its own, with none of her spots) and its view in from the mouth (`under`).
 *   ch3Told       f042/f043 (the way home: her wink, or "back by sunset"), f044 (kept: she pads off),
 *                 f046/f047 (the old fox smell: "Old."), f049b/f050b (“HMPH!”), and in “The last
 *                 post” every `border-two` panel (f049a/f050a "Not one paw past the post", f053a/f054a,
 *                 f057a/f058a, f061a/f062a, f063a/f064a "The eldest… And the bossiest.", f066a/f067a);
 *                 under the bridge every `back` panel (f069/f070 the branch or the bank, f078/f079,
 *                 f082/f083, f089/f090, f093/f094, f098/f099 the snake's secret, f101/f102), the
 *                 told path's own f084 ("the ginger one") and f085 (her rule), the kept path's f086
 *                 (Coil tells it), f087 (kept: "Your ears go hot."), f100 (kept: the snake's secret as
 *                 narration), f075 (told: her tail round you); on the bank f105/f106; at sunset f112
 *                 (kept: the hairball) and f113 (her two lines at the back)
 *   foundSleet    f048 (the fox trail's two labels), f072/f073 (his news, or the tail she saw), f074
 *                 (“Her eyes shine.”, after his news, opening the next panel)
 *   specialty     f033 (noticing: Sloshbank's big muddy paws)
 *   worry         f026 (one line each, at Sloshbank)
 *   ch2Stone      f119 (her stone)
 *   lessonClean   f014 (the sixth mark's two pairs of lines)
 *   found before  f061a/f062a (her news to Sleet: one balloon in eight forms, by foundSquall,
 *                 foundPuddle and foundWisp)
 * One flag is set, by reaching a frame, for good: `foundSleet`, on the last frame of “The last post”
 * (f068a, his forepaw Tap). No choice sets anything.
 *
 * Speakers: Coil is “A voice” while he is a stone (f074), “The snake” at his first sight (the chapter's
 * `names`), and “Coil” from Riffle's “Coil,” on (`name`). Sleet is “The long grass” while he is bent
 * grass or a tail (`name`), “The silver-white dragon” (the chapter's `names`, which his riddle reads
 * too) until “I'm Sleet”, and “Sleet” from then on. The starry cat is a Clan cat in starlight
 * (`starry: true`) whose balloon carries `name: 'The starry cat'`. ReedClan's young tom and she-cat are
 * labelled by their coats (`reedclan` 2 and 1).
 *
 * Text conventions: second person, present tense (“you”); typographic apostrophes and quotes (’ “ ” …)
 * so nothing needs escaping. Time of day comes from fx: `morning` at the pile and in the Hollow, `day`
 * from the patrol to the bridge, `sunset` at the pile, `dusk` for the first watch's start, `night` for
 * the watch (the sixth evening's moon from “The moon comes out”, `moon: 6`), the den and the dream.
 * tests/story-ch06.test.js checks all of this; tools/storyboard.mjs turns it into docs/storyboard/ch06.md.
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

  /* The five cats on the hollow's rim, left to right (chapter 5's: the warm-up's picture and 3 × 9's
   * three cats), sitting up. In the `lesson` camera the cats at `sand-left` and `sand-right` sit right
   * in front of `rim-2` and `rim-4`, so `close` leaves those two out; `noMurmur` leaves her out (she has
   * bounded down to the sand). */
  var RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 },
    { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  function rim(close, noMurmur) {
    var out = [c('clancat', 'situp', 'proud', 'rim-1', 'right', { variant: 1 })];
    if (!close && !noMurmur) out.push(c('murmurchime', 'situp', 'happy', 'rim-2', 'right'));
    out.push(c('clancat', 'situp', 'neutral', 'rim-3', 'left', { variant: 3 }));
    if (!close) out.push(c('clancat', 'situp', 'proud', 'rim-4', 'left', { variant: 5 }));
    out.push(c('grizzled', 'situp', 'stern', 'rim-5', 'left'));
    return out;
  }
  /* The patrol of three that trots along the top of the Hollow: on the far bank in front of the brambles,
   * its feet just above the five sitters' heads and each walker in a gap between two of them, smaller for
   * the distance and drawn behind them, so the three read as a line of their own and never as part of the
   * rim (`h` fixes the size: depth would make them too small). From “More patrols stop on the path to
   * watch.” a second patrol has come along behind the first and stopped on the path at the left, closer
   * together and a clear gap from the first: the same three coats in another order (no two of one coat
   * side by side across the gap), none of them a rim cat's. */
  var PATROL = [{ x: 570, y: 580, h: 170, z: 'behind' }, { x: 710, y: 580, h: 170, z: 'behind' }, { x: 850, y: 580, h: 170, z: 'behind' }];
  var PATROL2 = [{ x: 65, y: 580, h: 170, z: 'behind' }, { x: 190, y: 580, h: 170, z: 'behind' }, { x: 315, y: 580, h: 170, z: 'behind' }];
  function patrol(pose, mood, facing) {
    return [c('clancat', pose, mood, PATROL[0], facing, { variant: 2 }), c('clancat', pose, mood, PATROL[1], facing, { variant: 4 }),
      c('clancat', pose, mood, PATROL[2], facing, { variant: 6 })];
  }
  function patrol2(pose, mood, facing) {
    return [c('clancat', pose, mood, PATROL2[0], facing, { variant: 6 }), c('clancat', pose, mood, PATROL2[1], facing, { variant: 2 }),
      c('clancat', pose, mood, PATROL2[2], facing, { variant: 4 })];
  }

  // Scene options that stay the same through a place
  // The fifth morning's pile: four rows of ten, the back row with four empty places right in its middle,
  // the “scale” on the bare earth behind it. Until she walks round to it the back row is a dark band in
  // the brambles' shadow; then the gap and the freshly dug earth.
  var ROWS = [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }];
  var PILE_SHADE = { rows: ROWS, back: 'shadow', scale: 'behind' };
  var PILE_GAP = { rows: ROWS, scale: 'behind', dug: 'big' };
  // At sunset the day's hunting has filled it again: forty pieces in four full rows. From “The moon
  // comes out, a little fatter.” the sixth evening's moon is in the sky (`wide` and `low` only).
  var EVE = { rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' };
  var MOON = merge(EVE, { moon: 6 });
  // the first watch's third cat sits down beside Tallyheart behind the back row (`low`'s `behind` is
  // A(610, 742, 186), drawn behind the rows): on her left, clear of the dug earth on her right, the two
  // facing right, so Tallyheart's tail is on {Murmur}chime's side
  var WATCH = { x: 490, y: 742, h: 186, z: 'behind' };
  // the tree: five marks until Tallyheart scratches the sixth (f013)
  var H5 = { marks: 5, glow: 'auto' };
  var H6 = { marks: 6, glow: 'auto' };
  // the Old Bridge: Sprinkle's big prints in the mud (as in chapters 3 to 5) and, from this chapter,
  // the stone leg beside her nook with Coil's gap low in it (`stones`, the `back` camera's); the `wall`
  // camera is that leg close, a composition of its own
  var BACK = { prints: true, stones: true };
  // Coil in `back`, the wider shot of the nook, is drawn half as big again (`size`), so that beside the
  // cats he is the size he is in the close `wall` shot (his head about two fifths of our cat's in both:
  // smaller than a cat's head and a stone of the wall, his eyes big enough to read) and never jumps
  // from one panel to the next
  var FAR = { size: 1.45 };
  // Tallyheart under the bridge on the told path, while Coil talks: across the nook from his gap, in
  // front of Sprinkle's tail and left of Riffle (listed after Sprinkle, so she is drawn over the tail,
  // and before Riffle). At `near` she sat right in front of his gap, in the line from his head to his
  // balloons, so his balloons' tails ran across her face and his lines looked like hers. The arrival
  // (f069), where he says nothing, keeps her at `near`
  var ACROSS = { x: 1250, y: 900, h: 330 };
  var UNDER = { prints: true };
  // The den at night: Riffle's stone where she put it, her Case File along the mossy edge of her nest,
  // and the pieces she must keep secret under the moss (Sprinkle's two and, from tonight, Coil's)
  var DEN = { weather: 'clear', moon: false, stone: 'auto' };
  var DEN_BARK = merge(DEN, { bark: 'auto', hidden: true });
  // the first watch walking round the pile, seen through the den's doorway (its opening is x 1180 to 1600, the
  // grass beyond it from y 740): small, in single file
  var GUARDS = [{ x: 1330, y: 805, h: 64 }, { x: 1395, y: 805, h: 64 }, { x: 1460, y: 805, h: 64 }];
  // the told path and the kept path
  var TOLD = { ch3Told: true }, KEPT = { ch3Told: false };

  var frames = {

    /* ------------------------------------------------------------------ Asleep on guard */

    f001: {
      // the old tom alone at the left end of the rows, the two who have just come up at the right, so the
      // snore is lettered over him and nobody else
      scene: S('pile', 'rows', PILE_SHADE,
        [c('tallyheart', 'walk', 'kind', 'crowd-3', 'left'), c('player', 'stand', 'wonder', 'beside', 'left'),
         c('grizzled', 'lie', 'sleepy', 'pile-left', 'right', { asleep: true, holds: 'pinecone', holdAt: 'chin', tap: 'pinecone' })], ['morning']),
      board: 'WIDE, FROM THE FRONT, SUNRISE, THE TAP PICTURE. The prey pile in its rows under the bramble arch in the first gold light, the back row only a dark band in the brambles’ shadow, and at the front the grizzled old tom lying flat out, fast asleep, his chin propped on a big pinecone. Our cat and Tallyheart have just come up at the other end of the rows. In play the pinecone glows softly; a tap on it rolls it out from under his chin and turns the page, and a tap anywhere else only makes him snore louder. Captions top left; the snore lettered over his head.',
      caption: ['At sunrise, the old tom is guarding the prey pile. He’s fast asleep on his pinecone.'],
      sfx: 'SNNNRRRK.',
      // lettered over him, above his head and clear of the caption at the top left and the pinecone's glow (the
      // page would put it top right, over Tallyheart)
      sfxAt: [24, 60],
      scratch: { tap: 'pinecone', prompt: '**Tap** the pinecone.', label: 'Roll the pinecone.', miss: 'SNNNRRRK!', next: 'f002' }
    },

    f002: {
      // three balloons: none is said again over the question (a whole conversation is not said twice)
      scene: S('pile', 'rows', PILE_SHADE,
        [c('tallyheart', 'sit', 'solemn', 'crowd-3', 'left'), c('player', 'sit', 'happy', 'beside', 'left'),
         c('grizzled', 'sit', 'scared', 'pile-left', 'right', { holds: 'pinecone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE, FROM THE FRONT, COMEDY BEAT, THEN THE COUNTS. The old tom has shot upright, eyes like saucers, fur on end, and the pinecone has rolled out from under his chin to his front paws; Tallyheart sits across the rows from him, perfectly deadpan, our cat beside her. In the Counts picture the three front rows light one at a time as our cat walks along them, with no number shown, and the back row stays a dark band. Caption top left, his balloons loud then sheepish, hers dry; the keypad sits below the panel.',
      caption: ['He blinks.'],
      say: [
        { who: 'grizzled', text: 'WHO GOES THERE?', kind: 'shout' },
        { who: 'grizzled', text: 'I sat on it to stay awake. Then I lay on it. Then it was a pillow.' },
        { who: 'tallyheart', text: 'So I see. {name}paw, the morning count is yours.' }
      ],
      counts: { set: 'ch06-pile', next: 'f003' }
    },

    f003: {
      scene: S('pile', 'gap', PILE_GAP,
        [c('player', 'crouch', 'wonder', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM, THE REVEAL. Our cat has walked round to the back row, out of the bramble shadow now, and stops dead: three pieces, then four bare places pressed into the earth, then three more, and behind the hole a soft heap of freshly dug earth. The hole sits right in the middle of the panel, exactly where yesterday’s was, and the rows on either side are as neat as ever. Captions top left, well clear of the gap.',
      caption: ['Then the back row. Right in the middle: four empty spaces. Again.', 'Still tidy. Still the back.'],
      next: 'f004'
    },

    f004: {
      scene: S('pile', 'wide', PILE_GAP,
        [c('glintstar', 'stand', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'),
         c('player', 'sit', 'worried', 'pile-left', 'right'), c('snorter', 'sit', 'proud', 'crowd-1', 'right'),
         c('murmurchime', 'sit', 'stern', 'crowd-2', 'left'), c('grizzled', 'sit', 'sleepy', 'crowd-3', 'left', { holds: 'pinecone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE. Cats crowd in round the rows, and Glintstar rises on the fountain’s edge at the right, silver and still, to say the count out loud for the whole Clan. At the left the black-and-white apprentice puffs out his chest, quite sure he knows where the prey is going, and across the pile the little tortoiseshell warrior narrows her eyes and mutters her own idea. Glintstar’s balloon cool and level; his cheerful, the last word enormous; hers a mutter.',
      say: [
        { who: 'glintstar', text: 'Four more. Twenty pieces in five nights. Tonight, the pile gets proper guards.' },
        { who: 'snorter', text: 'It’s the DRAGON.' },
        { who: 'murmurchime', text: 'Or ReedClan.', kind: 'whisper' }
      ],
      next: 'f005'
    },

    /* ------------------------------------------------------------------ Patrols */

    f005: {
      // the warm-up's hard pick comes first, so none of these lines is said again over it (`intro: false`)
      scene: S('hollow', 'wide', H5,
        rim().concat([c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'happy', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THEN THE COUNTS. The sandy Training Hollow in the morning sun, five claw marks on the leaning tree, and along the rim five cats sitting up on their haunches with every claw out: the little tortoiseshell warrior second, the grizzled old tom last. Tallyheart waits past the tree and our cat sits ready in the sun patch. For the warm-up a picture of cats sitting up in a row appears, all ten claws lit, then one curled in on each; after a miss she swipes the sand twice a cat, hops by tens and rubs one line out a cat. Caption top left, her balloon bright; the keypad sits below the panel.',
      caption: ['In the Training Hollow, five cats sit up on the rim.'],
      say: [{ who: 'tallyheart', text: 'Nines first, to wake up your whiskers.' }],
      counts: { set: 'ch06-nines', intro: false, next: 'f006' }
    },

    f006: {
      scene: S('hollow', 'lesson', H5,
        rim(true).concat([c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart sits down on the sand in front of our cat, the rim cats still sitting up behind them, and holds the last answer up like a prize before she moves on. Our cat’s ears prick: something new is coming. Her balloon warm, three short sentences.',
      say: [{ who: 'tallyheart', text: 'Twenty-seven lives. Hold on to that. Today’s Count is the threes.' }],
      next: 'f007'
    },

    f007: {
      // the patrol along the top of the Hollow, above and behind the five sitters
      scene: S('hollow', 'wide', H5,
        patrol('walk', 'proud', 'right').concat(rim(), [c('tallyheart', 'stand', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. Along the far edge of the Hollow, above and behind the five sitters on the rim, three Clan cats trot by in single file, tails straight up, the very picture of a patrol. Tallyheart points them out with her chin from past the tree, and our cat cranes to watch them go. Captions top left; her balloon plain and sure.',
      caption: ['Along the top of the Hollow, a patrol trots by. Three cats, tails up.'],
      say: [{ who: 'tallyheart', text: 'A patrol is three cats.' }],
      next: 'f008'
    },

    f008: {
      // the question is the fact's own (Tallyheart's balloon), so the frame carries only the caption
      scene: S('hollow', 'wide', H5,
        patrol2('stand', 'happy', 'right').concat(patrol('stand', 'happy', 'left'), rim(), [c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THEN THE COUNTS. The patrol has stopped on the path along the top of the Hollow to watch the lesson, and turned round, tails still up; a second patrol of three has come along behind them and stopped on the path too, a little way off, looking down at the sand. In the Counts picture four patrols of three walk along the path, none lit; after a miss Tallyheart scratches three marks in the sand for every patrol and hops along them. One caption at the top; the keypad sits below the panel.',
      caption: ['More patrols stop on the path to watch.'],
      counts: { set: 'ch06-four', next: 'f009' }
    },

    f009: {
      scene: S('hollow', 'wide', H5,
        patrol2('stand', 'happy', 'right').concat(patrol('stand', 'happy', 'left'), rim(), [c('tallyheart', 'stand', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'happy', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. Tallyheart stands past the tree and lifts one paw, ready to hop along with our cat. In play the counting picture takes the panel: five patrols of three on the path, the first one glowing softly; each tap lights its three cats and a big number over them grows by three as she says it, 3, 6, 9, 12, 15, and a tap anywhere else only wiggles the glowing patrol. Her balloon at the top.',
      say: [{ who: 'tallyheart', text: 'Hop by threes, like you hopped the twos. Touch each patrol.' }],
      skip: { table: 3, groups: 5, teacher: 'tallyheart', thing: 'cat', things: 'cats', label: 'Count the next patrol.', prompt: '**Tap** the patrols.', next: 'f010' }
    },

    f010: {
      scene: S('hollow', 'lesson', H5,
        rim(true).concat([c('tallyheart', 'pawup', 'proud', 'sand-left', 'right', { claws: true }), c('player', 'sit', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT. A big 15 floats over the sand, and Tallyheart holds up one forepaw with all five claws out, turning it this way and that, as if the fact were a pebble she could look at from both sides. Our cat looks from the paw to the number. Her two balloons, the second slower.',
      say: [
        { who: 'tallyheart', text: 'Fifteen! Five patrols of three.' },
        { who: 'tallyheart', text: 'And three forepaws, five claws each? Fifteen too. It’s the same fact, turned round.' }
      ],
      next: 'f011'
    },

    f011: {
      // Tallyheart's five Counts: five taps that count nothing; each letters her question and our cat's answer
      scene: S('hollow', 'lesson', H5,
        rim(true).concat([c('tallyheart', 'sit', 'happy', 'sand-left', 'right', { glow: true }), c('player', 'sit', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT, THE TAP PICTURE. Tallyheart leans in with a secret in her eyes, glowing softly, and our cat sits bolt upright with its mouth open. In play each tap on her letters her next Count in her balloon and our cat’s answer in its own, the threes it already knows; the pairs before stay small under the panel, the five claw marks stay as they are, and after the fifth the page turns. Her balloon low; our cat’s a squeak.',
      say: [
        { who: 'tallyheart', text: 'Now here’s a secret. You already know half the threes.' },
        { who: 'player', text: 'I DO?', kind: 'shout' }
      ],
      ask: {
        who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
        pairs: [
          ['Tails?', 'Three cats, three tails!'],
          ['Ears?', 'Three cats, six ears!'],
          ['Claws?', 'Three forepaws, fifteen claws!'],
          ['Both forepaws?', 'Three cats, thirty claws. Like this morning’s three rows!'],
          ['Nine lives?', 'Three cats, twenty-seven. Just now!']
        ],
        next: 'f012'
      }
    },

    f012: {
      // her balloon is said again over the first question (so 1 × 3 is read, not timed)
      scene: S('hollow', 'lesson', H5,
        rim(true).concat([c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT, THEN THE COUNTS. Tallyheart sits back, delighted with her pupil, and sweeps the sand smooth with one paw for the new ones. In the Counts picture that many patrols of three walk along the path, the ones a question steps off already lit; after a miss she scratches three marks in the sand for every patrol and hops along them by threes. Her balloon warm; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Five threes, and you knew every one. That’s half! For a new one, start from one you know, and hop.' }],
      counts: { set: 'ch06-threes', next: 'f013' }
    },

    f013: {
      scene: S('hollow', 'tree', H6, [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score a sixth claw mark into the bark, beside the fifth, in the second row under the first three; the older marks look a little deeper and darker than the new one. The SKRITCH! runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'A sixth claw mark.'],
      sfx: 'SKRITCH!',
      next: 'f014'
    },

    f014: {
      // in the wide view, where the six marks show (the `lesson` camera sees only the edge of the tree)
      scene: S('hollow', 'wide', H6,
        rim().concat([c('tallyheart', 'sit', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'proud', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. Six claw marks on the leaning tree now, and Tallyheart sitting past the trunk with her torn ear tipped across the Hollow toward our cat, who sums the whole lesson up in one breath. A cat who never needed the sand says it lightly, and Tallyheart tops it; a cat who did says it plainly, and Tallyheart finishes it for her. Her balloons warm; our cat’s sure of itself.',
      say: [
        { who: 'tallyheart', text: 'Patrols. That’s your sixth Count.' },
        { who: 'player', text: 'And I already knew half of it.', when: { lessonClean: 'ch06-threes' } },
        { who: 'tallyheart', text: 'Now you know all of it.', when: { lessonClean: 'ch06-threes' } },
        { who: 'player', text: 'I already knew half of it.', when: { not: { lessonClean: 'ch06-threes' } } },
        { who: 'tallyheart', text: 'And you hopped the other half.', when: { not: { lessonClean: 'ch06-threes' } } }
      ],
      next: 'f015'
    },

    /* ------------------------------------------------------------------ Your first patrol */

    f015: {
      scene: S('hollow', 'lesson', H6,
        rim(true).concat([c('tallyheart', 'stand', 'proud', 'sand-left', 'right'), c('player', 'stand', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT. Tallyheart is already on her feet, tail high, and our cat scrambles up to match her: the lesson is over and the day’s real work is starting. A small inset shows three cats walking along a wall toward a bank of tall reeds. Her balloon brisk, three short sentences.',
      say: [{ who: 'tallyheart', text: 'Now, a real patrol. The ReedClan border. And a patrol is three.' }],
      next: 'f016'
    },

    f016: {
      scene: S('hollow', 'wide', H6,
        rim().concat([c('tallyheart', 'stand', 'shout', 'tree-far', 'left', { size: 1.2 }), c('player', 'stand', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. Tallyheart throws her head back and calls up to the rim, and every one of the five sitters looks round at once; the little tortoiseshell sitting second from the left stops washing a paw. Our cat watches from the sun patch. Caption top left; her balloon a call.',
      caption: ['She calls up to the rim:'],
      say: [{ who: 'tallyheart', text: 'I need a warrior!', kind: 'shout' }],
      next: 'f017'
    },

    f017: {
      // (no cat pose leaps: she comes down the slope at a run, at a spot of her own between the rim and the sand)
      scene: S('hollow', 'wide', H6,
        rim(false, true).concat([c('murmurchime', 'walk', 'laugh', { x: 720, y: 846 }, 'right'), c('tallyheart', 'stand', 'kind', 'tree-far', 'left', { size: 1.2 }),
          c('player', 'stand', 'happy', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, ACTION. The little tortoiseshell comes bounding down the slope from the rim in a shower of sand, her place on the rim empty behind her, and pulls up in front of Tallyheart, beaming. She has been a warrior for one day and is not used to it yet. Caption top left; her balloon a delighted shout.',
      caption: ['{Murmur}chime bounds down.'],
      say: [{ who: 'murmurchime', text: 'I’m a WARRIOR!', kind: 'shout' }],
      next: 'f018'
    },

    f018: {
      scene: S('hollow', 'lesson', H6,
        rim(true).concat([c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('murmurchime', 'sit', 'wonder', { x: 785, y: 905 }, 'left'),
          c('player', 'sit', 'wonder', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM, THREE ON THE SAND. The three of them sit together on the sand of the Hollow, the new warrior still blinking at her own word. Tallyheart looks past her, straight at our cat, and says it plainly, the way she says a sum is right. Caption top left; her balloon warm and level.',
      caption: ['{Murmur}chime still sounds surprised.'],
      say: [{ who: 'tallyheart', text: 'A border patrol is a warrior’s work. And today, you’re on one.' }],
      next: 'f019'
    },

    f019: {
      scene: S('hollow', 'lesson', H6,
        rim(true).concat([c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'stand', 'proud', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT, A QUIET BEAT. Our cat stands very still, trying to look calm about it, while its tail has shot straight up behind it like a flag on a pole. Tallyheart pretends not to notice, and fails. Caption top left, a smile in it.',
      caption: ['Your tail goes straight up. You didn’t even tell it to.'],
      next: 'f020'
    },

    f020: {
      // the patrol walks the wall facing right, toward its far end and the reeds; the leader is the rightmost
      scene: S('title', 'wide', {},
        [c('murmurchime', 'walk', 'happy', 'wall-2', 'right'), c('player', 'walk', 'proud', 'wall', 'right'),
         c('tallyheart', 'walk', 'solemn', 'wall-3', 'right')], ['day']),
      board: 'WIDE. The river shining below, the city behind it, and three cats walking in single file along the top of the old stone wall, small against the sky: Tallyheart in front, our cat in the middle, the little tortoiseshell behind. Tallyheart’s lips move as she walks; she is counting her steps. Captions top left; her balloon a whisper, the numbers trailing off.',
      caption: ['Three cats, along the old stone wall above the river.', 'Tallyheart counts her steps under her breath:'],
      say: [{ who: 'tallyheart', text: 'Four hundred and one. Four hundred and two…', kind: 'whisper' }],
      next: 'f021'
    },

    f021: {
      // a light choice: the marching order, drawn on its two outcomes; it sets nothing
      scene: S('title', 'wide', {},
        [c('murmurchime', 'stand', 'happy', 'wall-2', 'right'), c('player', 'stand', 'wonder', 'wall', 'left'),
         c('tallyheart', 'stand', 'kind', 'wall-3', 'left')], ['day']),
      board: 'WIDE. The three of them have stopped for a moment on top of the wall, and Tallyheart looks back over her shoulder at our cat, leaving the question open. Our cat looks from the front of the line to the back of it. One caption at the top; the choices sit below the panel.',
      caption: ['Where do you walk?'],
      choice: {
        options: [
          { label: 'Lead the way!', sets: {}, next: 'f022a' },
          { label: 'Walk in the middle.', sets: {}, next: 'f022b' }
        ]
      }
    },

    f022a: {
      scene: S('title', 'wide', {},
        [c('murmurchime', 'walk', 'happy', 'wall-2', 'right'), c('tallyheart', 'walk', 'kind', 'wall', 'right'),
         c('player', 'walk', 'proud', 'wall-3', 'right')], ['day']),
      board: 'WIDE. Our cat marches out in front along the top of the wall, chin up, and Tallyheart follows right behind it, the little tortoiseshell last. Tallyheart’s eyes are on the reeds ahead, not on our cat, which is the best praise there is. Her balloon short and approving.',
      say: [{ who: 'tallyheart', text: 'Sharp eyes.' }],
      next: 'f023'
    },

    f022b: {
      scene: S('title', 'wide', {},
        [c('murmurchime', 'walk', 'laugh', 'wall-2', 'right'), c('player', 'walk', 'happy', 'wall', 'right'),
         c('tallyheart', 'walk', 'solemn', 'wall-3', 'right')], ['day']),
      board: 'WIDE. Our cat walks in the middle of the line, Tallyheart leading, and behind it the little tortoiseshell leans forward to whisper a secret from her own first day. A small inset shows a much smaller tortoiseshell nose to bark with a tree. Her balloon a whisper.',
      say: [{ who: 'murmurchime', text: 'My first patrol, I walked into a tree.', kind: 'whisper' }],
      next: 'f023'
    },

    f023: {
      scene: S('title', 'end', { rustle: true },
        [c('murmurchime', 'stand', 'worried', 'end-3', 'right'), c('tallyheart', 'stand', 'stern', 'end-2', 'right'),
         c('player', 'stand', 'wonder', 'end-1', 'right')], ['day']),
      board: 'WIDE, THE BORDER. The old wall’s stones step down and stop, and past the last of them a bank of tall reeds begins, the river beyond; the three cats stand on the dry ground at the wall’s end, looking at the line. Among the reeds something is moving, and rustle lines tremble over the stems. Captions top left.',
      caption: ['At the end of the wall, the reeds begin. That’s the border.', 'The reeds rustle.'],
      next: 'f024'
    },

    f024: {
      scene: S('title', 'end', {},
        [c('murmurchime', 'stand', 'worried', 'end-3', 'right'), c('tallyheart', 'sit', 'solemn', 'end-2', 'right'),
         c('player', 'stand', 'wonder', 'end-1', 'right'), c('sloshbank', 'stand', 'stern', 'reed-1', 'left'),
         c('reedclan', 'stand', 'wonder', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'stand', 'neutral', 'reed-3', 'left', { variant: 1 })], ['day']),
      board: 'WIDE, THE BORDER. Out of the reeds, one after another, step three cats with sleek wet coats and mud to the elbows, and stop on their own side of the line: a huge stern brown tom in front, a lanky sandy young tom, a calm grey-brown she-cat. Tallyheart sits down, slowly and politely, and says it out of the side of her mouth. Caption top left; her balloon a whisper.',
      caption: ['Out step three cats: one, two, three.'],
      say: [{ who: 'tallyheart', text: 'ReedClan. They always come in threes.', kind: 'whisper' }],
      next: 'f025'
    },

    /* ------------------------------------------------------------------ Three and three */

    f025: {
      // the drips are his: lettered small by his belly
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'wonder', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'stand', 'stern', 'reed-1', 'left'), c('murmurchime', 'sit', 'worried', 'end-3', 'right'),
         c('tallyheart', 'sit', 'solemn', 'end-2', 'right'), c('player', 'sit', 'wonder', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THREE AND THREE. Our three on the dry ground at the wall’s end, ReedClan’s three at the edge of their reeds, face to face across the line; the big brown tom in front of his patrol is stern and solid, and his belly fur hangs in wet clumps, water dripping off it onto the ground. Our cat looks up at him. Caption top left; the drips lettered small beside his belly.',
      caption: ['The biggest is a stern brown tom. Water drips off his belly.'],
      sfx: 'Drip. Drip.',
      sfxAt: [67, 90],
      next: 'f026'
    },

    f026: {
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'wonder', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'sit', 'stern', 'reed-1', 'left'), c('murmurchime', 'sit', 'worried', 'end-3', 'right'),
         c('tallyheart', 'sit', 'solemn', 'end-2', 'right'), c('player', 'stand', 'proud', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The two big cats dip their heads to each other across the line, one name each and not a word more, the way leaders do at a border. Our cat stands very straight between them in its own way, by the cat it is. Caption top left, by her worry; the two balloons one word each.',
      caption: [
        { when: { worry: 'small' }, text: 'He’s as big as three of you. You stand up tall anyway.' },
        { when: { worry: 'water' }, text: 'A drip lands on your paw. It’s only one drip.' },
        { when: { worry: 'talk' }, text: 'You have a hundred questions. You hold them in. For now.' },
        { when: { worry: 'shiny' }, text: 'The drops sparkle as they fall. You try not to watch.' }
      ],
      say: [
        { who: 'tallyheart', text: 'Sloshbank.' },
        { who: 'sloshbank', text: 'Tallyheart.' }
      ],
      next: 'f027'
    },

    f027: {
      scene: S('title', 'meet', {},
        [c('reedclan', 'stand', 'happy', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'sit', 'stern', 'reed-1', 'left'), c('murmurchime', 'sit', 'worried', 'end-3', 'right'),
         c('tallyheart', 'sit', 'solemn', 'end-2', 'right'), c('player', 'sit', 'shy', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The big brown tom turns his heavy head and looks straight down at our cat, and a small inset shows what he saw yesterday: a little cat on a log raft in the marsh, staring hard at the mud. Behind him the young sandy tom bobs up eagerly to add his bit. Caption top left; his balloon stern, the capitals heavy; the young tom’s eager.',
      caption: ['Sloshbank looks straight at you.'],
      say: [
        { who: 'sloshbank', text: 'Yesterday, a CrystalClan apprentice was on our marsh. On a raft. LOOKING at our MUD.' },
        { who: 'reedclan', text: 'Looking VERY hard.' }
      ],
      next: 'f028'
    },

    f028: {
      // his two balloons are said again over the question; the right balloons are hers and his
      scene: S('title', 'end', {},
        [c('murmurchime', 'sit', 'worried', 'end-3', 'right'), c('tallyheart', 'sit', 'solemn', 'end-2', 'right'),
         c('player', 'sit', 'shy', 'end-1', 'right'), c('sloshbank', 'sit', 'proud', 'reed-1', 'left'),
         c('reedclan', 'sit', 'happy', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 })], ['day']),
      board: 'WIDE, THE BORDER, THEN THE COUNTS. The two patrols across the line, and behind ReedClan’s three the reeds stand thick and tall, any number of cats could be in there; our cat shrinks a little. In the Counts picture three patrols of three walk along a path, every one of them in a sleek marsh coat, none lit; after a miss Tallyheart scratches three lines a patrol in the earth at the end of the wall and hops along them. Caption top left; his balloons proud; the keypad sits below the panel.',
      caption: ['That was you.'],
      say: [
        { who: 'sloshbank', text: 'Three of our patrols watched.' },
        { who: 'sloshbank', text: 'Three cats in every one.' }
      ],
      counts: { set: 'ch06-watchers', next: 'f029' }
    },

    f029: {
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'wonder', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'stand', 'stern', 'reed-1', 'left'), c('murmurchime', 'sit', 'worried', 'end-3', 'right'),
         c('tallyheart', 'sit', 'solemn', 'end-2', 'right'), c('player', 'sit', 'wonder', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The big brown tom rises to his feet, the drips falling faster, and leans across the line just far enough to make his point and not one whisker further. Our cat holds its ground. His balloon one cold question.',
      say: [{ who: 'sloshbank', text: 'So what is CrystalClan after?' }],
      next: 'f030'
    },

    f030: {
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'scared', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'stand', 'shout', 'reed-1', 'left'), c('murmurchime', 'stand', 'shout', 'end-3', 'right', { puffed: true }),
         c('tallyheart', 'sit', 'stern', 'end-2', 'right'), c('player', 'sit', 'worried', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, A FLASH OF TEMPER. The little tortoiseshell warrior is up on her feet with her fur fluffed out to twice her size, and the big brown tom bristles straight back at her, water flying off his belly. Our cat sits frozen between them. Caption top left; her balloon hot, his louder, one drip lettered small by his belly.',
      caption: ['{Murmur}chime’s fur fluffs up.'],
      say: [
        { who: 'murmurchime', text: 'What is ReedClan after? Somebody’s taking OUR prey!' },
        { who: 'sloshbank', text: 'Are you calling ReedClan THIEVES?', kind: 'shout' }
      ],
      sfx: 'Drip.',
      sfxAt: [67, 90],
      next: 'f031'
    },

    f031: {
      scene: S('title', 'end', {},
        [c('murmurchime', 'sit', 'shy', 'end-3', 'right'), c('tallyheart', 'stand', 'stern', 'end-2', 'right'),
         c('player', 'sit', 'worried', 'end-1', 'right'), c('sloshbank', 'stand', 'stern', 'reed-1', 'left'),
         c('reedclan', 'sit', 'worried', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 })], ['day']),
      board: 'WIDE, THE BORDER. Tallyheart rises to her full height between the two patrols, calm as a stone, and both sides go quiet; the little tortoiseshell sits back down, fur slowly flattening. Nobody has put a paw over the line. Her balloon level and final, three short sentences.',
      say: [{ who: 'tallyheart', text: 'Nobody is calling anybody anything. Not at a border. Not under the Accord.' }],
      next: 'f032'
    },

    f032: {
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'wonder', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'sit', 'stern', 'reed-1', 'left'), c('murmurchime', 'sit', 'neutral', 'end-3', 'right'),
         c('tallyheart', 'sit', 'kind', 'end-2', 'right'), c('player', 'sit', 'solemn', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat lifts its chin and owns up across the line, as plainly as it can, looking the big brown tom in the eye; a small inset shows the raft again, and our cat on it with one paw held over the mud, touching nothing. The tom’s ears flick. Its balloon steady, three short sentences.',
      say: [{ who: 'player', text: 'The apprentice on the raft was me. I never touched your mud. I was asking who took our prey.' }],
      next: 'f033'
    },

    f033: {
      scene: S('title', 'meet', {},
        [c('reedclan', 'stand', 'happy', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'sit', 'proud', 'reed-1', 'left'), c('murmurchime', 'sit', 'neutral', 'end-3', 'right'),
         c('tallyheart', 'sit', 'solemn', 'end-2', 'right'), c('player', 'sit', 'wonder', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The big brown tom puffs himself up with ReedClan pride, and the young tom behind him blurts out the rest before anybody can stop him. For a noticing cat a small inset shows the brown tom’s enormous muddy paw beside one tiny print. Caption top left for a noticing cat; his balloon proud, the young tom’s quick.',
      caption: [{ when: { specialty: 'noticing' }, text: 'Sloshbank’s paws are big and muddy. Nothing like the tiny prints.' }],
      say: [
        { who: 'sloshbank', text: 'Nothing crosses our marsh without ReedClan seeing it.' },
        { who: 'reedclan', text: 'Except at night.' }
      ],
      next: 'f034'
    },

    f034: {
      // the fair question: asking it unfairly first costs one nudge from Tallyheart (f035a, f036a); it sets nothing.
      // The she-cat sits pressed against the young tom's rear (a spot of her own, whole in the panel), calm;
      // his eyes round and his tail out (`wonder`) for her to sit on
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'wonder', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', { x: 1440, y: 950, h: 285 }, 'left', { variant: 1 }),
         c('sloshbank', 'sit', 'solemn', 'reed-1', 'left'), c('murmurchime', 'sit', 'laugh', 'end-3', 'right'),
         c('tallyheart', 'sit', 'solemn', 'end-2', 'right'), c('player', 'sit', 'wonder', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, COMEDY BEAT. The calm grey-brown she-cat at the back of ReedClan’s patrol shifts her weight, quite casually, onto the young tom’s tail, and his eyes go very round. The big brown tom pretends nothing happened, and our cat has a question ready. Caption top left; his balloon a yelp; the choices sit below the panel.',
      caption: ['The ReedClan she-cat sits on his tail.'],
      say: [{ who: 'reedclan', text: 'OW.' }],
      choice: {
        options: [
          { label: '“Did ReedClan take our prey?”', sets: {}, next: 'f035a' },
          { label: '“Has anything gone from YOUR pile too?”', sets: {}, next: 'f037' }
        ]
      }
    },

    f035a: {
      scene: S('title', 'end', {},
        [c('murmurchime', 'sit', 'worried', 'end-3', 'right'), c('tallyheart', 'sit', 'kind', 'end-2', 'right'),
         c('player', 'sit', 'shy', 'end-1', 'right'), c('sloshbank', 'stand', 'shout', 'reed-1', 'left', { puffed: true }),
         c('reedclan', 'sit', 'worried', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'stern', 'reed-3', 'left', { variant: 1 })], ['day']),
      board: 'WIDE, THE BORDER, ONLY FOR A CAT WHO ASKED IT UNFAIRLY. Every hair on the big brown tom stands on end, and across the line his whole patrol stiffens; behind our cat Tallyheart leans down to its ear and murmurs, without taking her eyes off him. Our cat’s ears go back. Caption top left; her balloon a small whisper.',
      caption: ['Sloshbank’s fur goes up.'],
      say: [{ who: 'tallyheart', text: 'Ask it fair.', kind: 'whisper' }],
      next: 'f036a'
    },

    f036a: {
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'wonder', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'sit', 'stern', 'reed-1', 'left'), c('murmurchime', 'sit', 'neutral', 'end-3', 'right'),
         c('tallyheart', 'sit', 'kind', 'end-2', 'right'), c('player', 'sit', 'solemn', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, ONLY FOR A CAT WHO ASKED IT UNFAIRLY. Our cat takes a breath, sits up straight and asks again, as a counting cat would: not who did it, but what is missing. The big brown tom’s fur slowly lies down. Caption top left; our cat’s balloon careful and clear.',
      caption: ['So you do:'],
      say: [{ who: 'player', text: 'Has anything gone from YOUR pile too?' }],
      next: 'f037'
    },

    f037: {
      // the admission, and the scene's turn: ReedClan's card
      card: 'reed-pile',
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'sad', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'sad', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'sit', 'sad', 'reed-1', 'left'), c('murmurchime', 'sit', 'wonder', 'end-3', 'right'),
         c('tallyheart', 'sit', 'kind', 'end-2', 'right'), c('player', 'sit', 'wonder', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TURN. The big brown tom is quiet for a long time, the drips the only thing moving, and then his great head sinks and he admits it, low, to the ground between his paws; a small inset shows a tidy row of prey in the reeds with one gap in it. His patrol looks away. Caption top left, the drips small by his belly; his first balloon proud, his second hardly more than a breath; the new card appears under the panel, an ear in its corner.',
      caption: ['Sloshbank is quiet for a long time.'],
      sfx: 'Drip. Drip.',
      sfxAt: [67, 90],
      say: [
        { who: 'sloshbank', text: 'ReedClan does not LOSE prey.' },
        { who: 'sloshbank', text: 'But somebody has been taking it. Night after night. And leaving our pile TIDY.', kind: 'whisper' }
      ],
      next: 'f038'
    },

    f038: {
      scene: S('title', 'end', {},
        [c('murmurchime', 'sit', 'wonder', 'end-3', 'right'), c('tallyheart', 'sit', 'solemn', 'end-2', 'right'),
         c('player', 'sit', 'wonder', 'end-1', 'right'), c('sloshbank', 'sit', 'solemn', 'reed-1', 'left'),
         c('reedclan', 'sit', 'wonder', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 })], ['day']),
      board: 'WIDE, THE BORDER. The two patrols sit across the line looking at each other in a new way, and the little tortoiseshell works it out slowly, out loud, ear by ear. Tallyheart says the rest for both Clans. Her balloon slow; Tallyheart’s quiet and certain.',
      say: [
        { who: 'murmurchime', text: 'Then it isn’t ReedClan. And it isn’t us.' },
        { who: 'tallyheart', text: 'Somebody is robbing us both.' }
      ],
      next: 'f039'
    },

    f039: {
      scene: S('title', 'meet', {},
        [c('reedclan', 'sit', 'happy', 'reed-2', 'left', { variant: 2 }), c('reedclan', 'sit', 'neutral', 'reed-3', 'left', { variant: 1 }),
         c('sloshbank', 'stand', 'proud', 'reed-1', 'left'), c('murmurchime', 'sit', 'neutral', 'end-3', 'right'),
         c('tallyheart', 'sit', 'kind', 'end-2', 'right'), c('player', 'sit', 'wonder', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, COMEDY BEAT. The big brown tom gets to his feet, all his pride back, and Tallyheart answers him with a perfectly straight face; he opens his mouth, shuts it, and settles for something smaller. One drip falls into the silence. His balloons proud, then grudging; hers easy; the drip lettered small by his belly.',
      say: [
        { who: 'sloshbank', text: 'ReedClan will find the thief first.' },
        { who: 'tallyheart', text: 'Then tell us when you do.' },
        { who: 'sloshbank', text: '…ReedClan will think about it.' }
      ],
      sfx: 'Drip.',
      sfxAt: [67, 90],
      next: 'f040'
    },

    f040: {
      // the wave is the tap: our cat is drawn already waving back. The reeds have closed behind the big
      // tom and the she-cat (nobody seen, the stems still rustling: the set's `rustle`); only the young tom
      // is left on the line
      scene: S('title', 'end', { rustle: true },
        [c('murmurchime', 'stand', 'proud', 'end-3', 'right'), c('tallyheart', 'sit', 'kind', 'end-2', 'right'),
         c('player', 'pawup', 'happy', 'end-1', 'right', { tap: 'paw' }), c('reedclan', 'pawup', 'happy', 'reed-1', 'left', { variant: 2 })], ['day']),
      board: 'WIDE, THE BORDER, THE TAP PICTURE. ReedClan’s patrol has gone back into its reeds, the stems still swaying with rustle lines where the big brown tom and the she-cat went in, but the young sandy tom has stopped on the line, looked back, and lifted a paw to wave. In play our cat’s raised forepaw glows softly; one tap waves it back and turns the page, and the little tortoiseshell’s tail waves too. Captions top left.',
      caption: ['The reeds close behind them.', 'But the young tom looks back, and waves at the three of you.'],
      scratch: { tap: 'paw', prompt: '**Tap** to wave back.', label: 'Wave back.', next: 'f041' }
    },

    /* ------------------------------------------------------------------ The fox trail */

    f041: {
      // home along the wall: facing left now, the way they came, the tortoiseshell in front (at `wall-2`,
      // where she runs off from on the next panel) turned back to hear her errand; our cat at the back (at
      // `wall-3`, where Tallyheart turns to it next), so nobody changes ends between panels
      scene: S('title', 'wide', {},
        [c('murmurchime', 'stand', 'wonder', 'wall-2', 'right'), c('tallyheart', 'stand', 'solemn', 'wall', 'left'),
         c('player', 'stand', 'happy', 'wall-3', 'left')], ['day']),
      board: 'WIDE. The three of them on top of the old wall again, walking home the way they came, the little tortoiseshell in front, until Tallyheart stops short; the tortoiseshell turns back to hear her errand. The river shines below. Caption top left; her balloon an order, kindly given.',
      caption: ['On the way home, Tallyheart stops.'],
      say: [{ who: 'tallyheart', text: '{Murmur}chime, tell Glintstar what ReedClan said.' }],
      next: 'f042'
    },

    f042: {
      when: TOLD,
      scene: S('title', 'wide', {},
        [c('murmurchime', 'walk', 'proud', 'wall-2', 'left'), c('tallyheart', 'sit', 'happy', 'wall', 'right', { wink: true }),
         c('player', 'sit', 'happy', 'wall-3', 'left')], ['day']),
      board: 'WIDE, THE TOLD PATH ONLY. The little tortoiseshell is off along the wall at a run, tail straight up, and as soon as her back is turned Tallyheart gives our cat one slow wink; a small inset shows a string of fish and a pair of big round eyes in the dark under a bridge. Our cat grins. Captions top left; her balloon low, a shared secret.',
      caption: ['Off she runs.', 'Then Tallyheart winks at you.'],
      say: [{ who: 'tallyheart', text: 'Come on. Somebody under a bridge is hungry.' }],
      next: 'f043'
    },

    f043: {
      when: KEPT,
      scene: S('title', 'wide', {},
        [c('murmurchime', 'walk', 'proud', 'wall-2', 'left'), c('tallyheart', 'sit', 'solemn', 'wall', 'right'),
         c('player', 'sit', 'wonder', 'wall-3', 'left')], ['day']),
      board: 'WIDE, THE KEPT PATH ONLY. The little tortoiseshell is off along the wall at a run, tail straight up, and Tallyheart turns to our cat with one more order before she goes her own way. Our cat sits up straight and nods, thinking hard about a string of fish. Caption top left; her balloon brisk.',
      caption: ['Off she runs.'],
      say: [{ who: 'tallyheart', text: 'And you, {name}paw: back by sunset. Tonight, you guard.' }],
      next: 'f044'
    },

    f044: {
      // (the kept path's own line opens this panel: she pads off after the balloon before)
      scene: S('field', 'fence', {},
        [c('player', 'walk', 'happy', 'path-left', 'right'), c('riffle', 'stand', 'happy', 'path-right', 'left', { holds: 'string' })], ['day']),
      board: 'MEDIUM, ALONG THE FENCE. The path outside the Barking Field’s tall wire fence, and Riffle waiting on it, bouncing on his toes, a reed string of three fish hanging from one forepaw. Our cat trots up to him. Captions top left, the first for a cat who kept the secret.',
      caption: [
        { when: KEPT, text: 'Tallyheart pads off, counting her steps.' },
        'At the Barking Field, Riffle is waiting, with a string of fish for Sprinkle.'
      ],
      next: 'f045'
    },

    f045: {
      // the tiny dog shouts: the first dog in the cast
      scene: S('field', 'dogs', {},
        [c('dog', 'bounce', 'shout', 'dog-3', 'left', { variant: 3 }), c('dog', 'jump', 'happy', 'dog-1', 'right', { variant: 1 }),
         c('dog', 'bounce', 'happy', 'dog-2', 'left', { variant: 2 }), c('player', 'sit', 'laugh', 'path-left', 'right'),
         c('riffle', 'stand', 'stern', 'path-right', 'left', { holds: 'string' })], ['day']),
      board: 'MEDIUM, ACTION, FROM THE PATH. The three dogs gallop along the inside of the fence beside them, ears flying, the tiny one yapping the loudest; Riffle draws himself up with enormous dignity, his string of fish swinging. Our cat tries not to laugh. Caption top left; the tiny dog’s balloon a yap, Riffle’s offended.',
      caption: ['Three dogs gallop along the fence.'],
      say: [
        { who: 'dog', text: 'BYE, WET SQUIRREL!', kind: 'shout' },
        { who: 'riffle', text: 'I’m an OTTER.' }
      ],
      next: 'f046'
    },

    f046: {
      when: TOLD,
      scene: S('field', 'border', {},
        [c('tallyheart', 'sit', 'sniff', 'left', 'right'), c('riffle', 'stand', 'wonder', 'right', 'right', { holds: 'string' }),
         c('player', 'stand', 'sniff', 'lead', 'right')], ['day']),
      board: 'WIDE, THE TOLD PATH ONLY. The fence turns at its last post and the long golden grass of fox country begins past it; at the corner our cat lifts its nose into the air, and Tallyheart beside it sniffs once, judging. Riffle wrinkles his whiskers. Captions top left; her balloon one word.',
      caption: ['Your nose twitches. A fox smell, an old one, drifts along the fence from the last post.', 'Tallyheart sniffs.'],
      say: [{ who: 'tallyheart', text: 'Old.' }],
      next: 'f047'
    },

    f047: {
      when: KEPT,
      scene: S('field', 'border', {},
        [c('riffle', 'stand', 'wonder', 'right', 'right', { holds: 'string' }), c('player', 'stand', 'sniff', 'lead', 'right')], ['day']),
      board: 'WIDE, THE KEPT PATH ONLY. The fence turns at its last post and the long golden grass of fox country begins past it; at the corner our cat lifts its nose into the air, testing a smell, and Riffle wrinkles his whiskers beside it. Nothing moves in the grass yet. One caption at the top.',
      caption: ['Your nose twitches. A fox smell, an old one, drifts along the fence from the last post.'],
      next: 'f048'
    },

    f048: {
      // Sleet's offer: following the trail leads to “The last post” (f049a…f068a), whose last frame sets
      // `foundSleet`; “Not today” sets nothing. A cat who has met him reads the choice his way.
      scene: S('field', 'border-fox', {},
        [c('sleet', 'tail', 'happy', 'grass', 'left'), c('player', 'sit', 'wonder', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE LONG GRASS. Past the last post the long golden grass fills the panel, and out of it, just for a moment, flicks the tip of a scaly silver-white tail, then is gone; the edge of our cat’s face is in the near corner, staring. Nobody else has seen it. One caption at the top; the choices sit below the panel.',
      caption: ['There, in the long grass, a scaly silver-white tail flicks.'],
      choice: {
        options: [
          { label: 'Follow the fox trail to the last post.', labelWhen: [{ when: { foundSleet: true }, label: 'Go and see Sleet again.' }], sets: {}, next: 'f049a' },
          { label: 'Not today. Sprinkle’s fish are waiting.', labelWhen: [{ when: { foundSleet: true }, label: 'Not today. He’s spying.' }], sets: {}, next: 'f049b' }
        ]
      }
    },

    /* ------------------------------------------------------------------ The last post (a): f049a…f068a.
     * Riffle is here on every path, Tallyheart on the told path only: every `border-two` panel, where
     * her spot is in the picture, is two frames by `ch3Told`. She never steps past the last post, and
     * the fox is never seen. */

    f049a: {
      when: TOLD,
      scene: S('field', 'border-two', {},
        [c('tallyheart', 'sit', 'stern', 'left', 'right'), c('riffle', 'stand', 'worried', 'right', 'right', { holds: 'string' }),
         c('player', 'sit', 'wonder', 'lead', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TOLD PATH ONLY. At the fence’s very last post the trodden path stops dead, and past it the long grass of fox country stands taller than a cat, whispering; our cat sits at the post’s foot with Riffle and Tallyheart beside it. Tallyheart lays down the rule without raising her voice. Captions top left; her balloon firm.',
      caption: ['The smell is strongest at the fence’s last post.', 'Past it, the long grass of fox country whispers.'],
      say: [{ who: 'tallyheart', text: 'Not one paw past the post.' }],
      next: 'f050a'
    },

    f050a: {
      when: KEPT,
      scene: S('field', 'border-two', {},
        [c('riffle', 'stand', 'stern', 'right', 'right', { holds: 'string' }), c('player', 'sit', 'wonder', 'lead', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE KEPT PATH ONLY. At the fence’s very last post the trodden path stops dead, and past it the long grass of fox country stands taller than a cat, whispering; our cat sits at the post’s foot. Riffle, for once, is the sensible one, and says so with his chin up. Captions top left; his balloon firm.',
      caption: ['The smell is strongest at the fence’s last post.', 'Past it, the long grass of fox country whispers.'],
      say: [{ who: 'riffle', text: 'Not one paw past the post.' }],
      next: 'f051a'
    },

    f051a: {
      // nothing of him shows but the grass bent where he lies: no face in the stacked balloons
      scene: S('field', 'border-fox', {},
        [c('sleet', 'hidden', 'proud', 'grass', 'left'), c('player', 'sit', 'scared', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE LONG GRASS. The long grass just past the post, and in one place it is bent flat in a long shape that is certainly not the wind, and it is talking; the edge of our cat’s face jumps in the near corner. Nobody can be seen at all. Two balloons from the grass itself, the first a loud hiss of a whisper.',
      say: [
        { who: 'sleet', name: 'The long grass', text: 'PSST!' },
        { who: 'sleet', name: 'The long grass', text: 'Don’t look! You are being SPIED on!' }
      ],
      next: 'f052a'
    },

    f052a: {
      scene: S('field', 'border-fox', {},
        [c('sleet', 'flat', 'proud', 'grass', 'left', { grass: true }), c('player', 'sit', 'wonder', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE LONG GRASS, THE REVEAL. A silver-white snout pokes out of the grass, then all the rest: a silver-white dragonet about Sprinkle’s size, lying flat on his belly with his chin down and a tuft of long grass stuck on his head between two horn nubs, looking extremely pleased with himself. He is past the post; our cat’s face at the near corner is not. Two captions at the top.',
      caption: ['A silver-white snout pokes out.', 'Then a whole silver-white dragonet, flat on his belly, with grass on his head.'],
      next: 'f053a'
    },

    f053a: {
      when: TOLD,
      scene: S('field', 'border-two', {},
        [c('tallyheart', 'sit', 'solemn', 'left', 'right'), c('riffle', 'stand', 'shout', 'right', 'right', { holds: 'string' }),
         c('player', 'sit', 'wonder', 'lead', 'right'), c('sleet', 'point', 'stern', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TOLD PATH ONLY. The silver-white dragonet has propped himself up in the grass past the post and points one bossy claw straight at Riffle, whispering at the top of his voice; Riffle puffs up indignantly on the path. Tallyheart watches the pair of them with one eyebrow raised. Caption top left; his balloon a loud whisper; Riffle’s a squawk.',
      caption: ['He whispers, very loudly:'],
      say: [
        { who: 'sleet', text: 'I’m spying on the ENEMY. You, otter: stop wiggling.', kind: 'whisper' },
        { who: 'riffle', text: 'You’re not the boss of ME!' }
      ],
      next: 'f054a'
    },

    f054a: {
      when: KEPT,
      scene: S('field', 'border-two', {},
        [c('riffle', 'stand', 'shout', 'right', 'right', { holds: 'string' }), c('player', 'sit', 'wonder', 'lead', 'right'),
         c('sleet', 'point', 'stern', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE KEPT PATH ONLY. The silver-white dragonet has propped himself up in the grass past the post and points one bossy claw straight at Riffle, whispering at the top of his voice; Riffle puffs up indignantly on the path. Our cat sits between them at the post’s foot. Caption top left; his balloon a loud whisper; Riffle’s a squawk.',
      caption: ['He whispers, very loudly:'],
      say: [
        { who: 'sleet', text: 'I’m spying on the ENEMY. You, otter: stop wiggling.', kind: 'whisper' },
        { who: 'riffle', text: 'You’re not the boss of ME!' }
      ],
      next: 'f055a'
    },

    f055a: {
      scene: S('field', 'border-fox', {},
        [c('sleet', 'point', 'proud', 'grass', 'left', { grass: true }), c('player', 'sit', 'kind', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE DRAGONET. Our cat leans in from the near corner and says the words that open every door, and the silver-white dragonet draws himself up with the grass still on his head, one claw raised like a judge. He is in charge, and wishes everybody to know it. Our cat’s balloon soft; his grand.',
      say: [
        { who: 'player', text: 'Sprinkle sent me.' },
        { who: 'sleet', text: 'I’m in charge of Sprinkle. I’m in charge of EVERYBODY. Riddle first!' }
      ],
      next: 'f056a'
    },

    f056a: {
      // his two balloons are this Counts frame's own, said again over the question with the caption
      scene: S('field', 'border-fox', {},
        [c('sleet', 'call', 'happy', 'grass', 'left', { grass: true }), c('player', 'sit', 'wonder', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE DRAGONET, THEN THE COUNTS. The silver-white dragonet throws his head back with his mouth a round O and shouts the roll call into the sky; a small inset shows seven little dragonets in a row, each with three HEREs over its head. In the Counts picture the seven little dragonets take the panel, all alike and pale, three HERE!s over every head, none lit; after a miss the HEREs light a dragonet at a time as our cat hops by threes. His balloon loud, the HEREs biggest; the keypad sits below the panel.',
      // one balloon (every word kept): two made the question's page taller than an iPad's screen, and it
      // opened scrolled, its first balloon under the top bar
      say: [{ who: 'sleet', text: 'There are seven of us. When Mama calls, every one of us shouts HERE three times. HERE! HERE! HERE!' }],
      counts: { set: 'ch06-sleet', next: 'f057a' }
    },

    f057a: {
      // “I’m Sleet”: from this balloon on, his balloons carry his name
      when: TOLD,
      scene: S('field', 'border-two', {},
        [c('tallyheart', 'sit', 'kind', 'left', 'right'), c('riffle', 'stand', 'wonder', 'right', 'right', { holds: 'string' }),
         c('player', 'sit', 'happy', 'lead', 'right'), c('sleet', 'sit', 'proud', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TOLD PATH ONLY. The dragonet sits up tall in the grass past the post for the first time, all of his silver-white chest showing, and introduces himself to the three on the path as if he were a leader at a Gathering. Tallyheart dips her head to him politely. His balloon proud.',
      say: [{ who: 'sleet', name: 'Sleet', text: 'I’m Sleet. The eldest. I do the roll call.' }],
      next: 'f058a'
    },

    f058a: {
      when: KEPT,
      scene: S('field', 'border-two', {},
        [c('riffle', 'stand', 'wonder', 'right', 'right', { holds: 'string' }), c('player', 'sit', 'happy', 'lead', 'right'),
         c('sleet', 'sit', 'proud', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE KEPT PATH ONLY. The dragonet sits up tall in the grass past the post for the first time, all of his silver-white chest showing, and introduces himself to the two on the path as if he were a leader at a Gathering. Riffle tries not to be impressed. His balloon proud.',
      say: [{ who: 'sleet', name: 'Sleet', text: 'I’m Sleet. The eldest. I do the roll call.' }],
      next: 'f059a'
    },

    f059a: {
      scene: S('field', 'border-fox', {},
        [c('sleet', 'puff', 'proud', 'grass', 'left', { grass: true }), c('player', 'sit', 'happy', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE DRAGONET, COMEDY BEAT. Sleet puffs his silver chest out as far as it will go, chin high, and a single grass seed drops off it and spins away down the panel. He does not notice. One caption at the top.',
      caption: ['He puffs out his chest. A grass seed falls off.'],
      next: 'f060a'
    },

    f060a: {
      scene: S('field', 'border-fox', {},
        [c('sleet', 'droop', 'sad', 'grass', 'left', { grass: true }), c('player', 'sit', 'kind', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE DRAGONET, A QUIET BEAT. All the puff goes out of him: Sleet’s head sinks low and his long tail droops in the grass, and for a moment he looks much smaller than the eldest of anybody. The edge of our cat’s face is in the near corner, listening. Caption top left; his balloon small.',
      caption: ['Then his tail droops.'],
      say: [{ who: 'sleet', name: 'Sleet', text: 'But nobody answers my roll call now. The storm blew them all away.' }],
      next: 'f061a'
    },

    f061a: {
      // her news to him is one balloon, in eight forms: every sibling she has found, in order
      when: TOLD,
      scene: S('field', 'border-two', {},
        [c('tallyheart', 'sit', 'kind', 'left', 'right'), c('riffle', 'stand', 'kind', 'right', 'right', { holds: 'string' }),
         c('player', 'pawup', 'kind', 'lead', 'right'), c('sleet', 'sit', 'wonder', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TOLD PATH ONLY. Our cat lifts a forepaw at the post’s foot and gives Sleet the news, one sibling at a time, and small insets float over its head for each: a mist-grey dragonet under a bridge, and, for a cat who has found them, a slate one on a roof, a blue-grey snout under a raft, a pale one among reeds. Sleet’s eyes go wider with every one. Our cat’s balloon gentle.',
      say: [
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge.', when: { foundSquall: false, foundPuddle: false, foundWisp: false } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Squall’s on the tallest tower.', when: { foundSquall: true, foundPuddle: false, foundWisp: false } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Puddle’s under the otters’ raft.', when: { foundSquall: false, foundPuddle: true, foundWisp: false } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Wisp’s in the heron’s reeds.', when: { foundSquall: false, foundPuddle: false, foundWisp: true } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Squall’s on the tallest tower. Puddle’s under the otters’ raft.', when: { foundSquall: true, foundPuddle: true, foundWisp: false } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Squall’s on the tallest tower. Wisp’s in the heron’s reeds.', when: { foundSquall: true, foundPuddle: false, foundWisp: true } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Puddle’s under the otters’ raft. Wisp’s in the heron’s reeds.', when: { foundSquall: false, foundPuddle: true, foundWisp: true } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Squall’s on the tallest tower. Puddle’s under the otters’ raft. Wisp’s in the heron’s reeds.', when: { foundSquall: true, foundPuddle: true, foundWisp: true } }
      ],
      next: 'f062a'
    },

    f062a: {
      when: KEPT,
      scene: S('field', 'border-two', {},
        [c('riffle', 'stand', 'kind', 'right', 'right', { holds: 'string' }), c('player', 'pawup', 'kind', 'lead', 'right'),
         c('sleet', 'sit', 'wonder', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE KEPT PATH ONLY. Our cat lifts a forepaw at the post’s foot and gives Sleet the news, one sibling at a time, and small insets float over its head for each: a mist-grey dragonet under a bridge, and, for a cat who has found them, a slate one on a roof, a blue-grey snout under a raft, a pale one among reeds. Sleet’s eyes go wider with every one. Our cat’s balloon gentle.',
      say: [
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge.', when: { foundSquall: false, foundPuddle: false, foundWisp: false } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Squall’s on the tallest tower.', when: { foundSquall: true, foundPuddle: false, foundWisp: false } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Puddle’s under the otters’ raft.', when: { foundSquall: false, foundPuddle: true, foundWisp: false } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Wisp’s in the heron’s reeds.', when: { foundSquall: false, foundPuddle: false, foundWisp: true } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Squall’s on the tallest tower. Puddle’s under the otters’ raft.', when: { foundSquall: true, foundPuddle: true, foundWisp: false } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Squall’s on the tallest tower. Wisp’s in the heron’s reeds.', when: { foundSquall: true, foundPuddle: false, foundWisp: true } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Puddle’s under the otters’ raft. Wisp’s in the heron’s reeds.', when: { foundSquall: false, foundPuddle: true, foundWisp: true } },
        { who: 'player', text: 'Sprinkle’s safe. Under the Old Bridge. Squall’s on the tallest tower. Puddle’s under the otters’ raft. Wisp’s in the heron’s reeds.', when: { foundSquall: true, foundPuddle: true, foundWisp: true } }
      ],
      next: 'f063a'
    },

    f063a: {
      when: TOLD,
      scene: S('field', 'border-two', {},
        [c('tallyheart', 'sit', 'happy', 'left', 'right'), c('riffle', 'stand', 'happy', 'right', 'right', { holds: 'string' }),
         c('player', 'sit', 'happy', 'lead', 'right'), c('sleet', 'sit', 'proud', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TOLD PATH ONLY, COMEDY BEAT. Sleet sits up taller than ever, quite sure he arranged the whole thing himself, and on the path Tallyheart murmurs her verdict into our cat’s ear with her whiskers twitching. Riffle snorts. His balloon smug; hers a whisper.',
      say: [
        { who: 'sleet', name: 'Sleet', text: 'I KNEW it. I’m a very good eldest.' },
        { who: 'tallyheart', text: 'The eldest. And the bossiest.', kind: 'whisper' }
      ],
      next: 'f064a'
    },

    f064a: {
      when: KEPT,
      scene: S('field', 'border-two', {},
        [c('riffle', 'stand', 'happy', 'right', 'right', { holds: 'string' }), c('player', 'sit', 'happy', 'lead', 'right'),
         c('sleet', 'sit', 'proud', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE KEPT PATH ONLY, COMEDY BEAT. Sleet sits up taller than ever, quite sure he arranged the whole thing himself, his chest out and the grass still on his head. On the path Riffle rolls his eyes at our cat. His balloon smug.',
      say: [{ who: 'sleet', name: 'Sleet', text: 'I KNEW it. I’m a very good eldest.' }],
      next: 'f065a'
    },

    f065a: {
      // he heard it; the fox is never seen
      card: 'sleet-den',
      scene: S('field', 'border-fox', {},
        [c('sleet', 'sit', 'solemn', 'grass', 'left', { grass: true }), c('player', 'sit', 'wonder', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE DRAGONET. Sleet leans close to the post and reports like a spy, rolling his eyes at the dullness of it; a small inset shows the long grass far out in fox country, empty, with a speech curl rising from somewhere deep in it. The fox himself is nowhere in the picture. His two balloons, the second very bored; the new card appears under the panel, an ear in its corner.',
      say: [
        { who: 'sleet', name: 'Sleet', text: 'I spy on the fox. Far out in the grass, he talks to himself.' },
        { who: 'sleet', name: 'Sleet', text: '‘Such a fine, dry den,’ he says. Over and over. VERY boring.' }
      ],
      next: 'f066a'
    },

    f066a: {
      when: TOLD,
      scene: S('field', 'border-two', {},
        [c('tallyheart', 'sit', 'kind', 'left', 'right'), c('riffle', 'stand', 'wonder', 'right', 'right', { holds: 'string' }),
         c('player', 'sit', 'kind', 'lead', 'right'), c('sleet', 'flat', 'stern', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TOLD PATH ONLY. Our cat asks it gently from the post’s foot, and Sleet flattens himself back down in the grass with great importance, a dragonet on duty. Tallyheart says nothing; this is not her question. Our cat’s balloon soft; his proud, the last word huge.',
      say: [
        { who: 'player', text: 'Come with us?' },
        { who: 'sleet', name: 'Sleet', text: 'Can’t. I’m SPYING. The fox has never once seen me. I’m GRASS.' }
      ],
      next: 'f067a'
    },

    f067a: {
      when: KEPT,
      scene: S('field', 'border-two', {},
        [c('riffle', 'stand', 'wonder', 'right', 'right', { holds: 'string' }), c('player', 'sit', 'kind', 'lead', 'right'),
         c('sleet', 'flat', 'stern', 'grass', 'left', { grass: true })], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE KEPT PATH ONLY. Our cat asks it gently from the post’s foot, and Sleet flattens himself back down in the grass with great importance, a dragonet on duty. Riffle peers at the tuft on his head. Our cat’s balloon soft; his proud, the last word huge.',
      say: [
        { who: 'player', text: 'Come with us?' },
        { who: 'sleet', name: 'Sleet', text: 'Can’t. I’m SPYING. The fox has never once seen me. I’m GRASS.' }
      ],
      next: 'f068a'
    },

    f068a: {
      // the scene's last frame: by now she has read his name, his riddle, his news and his “five”
      sets: { foundSleet: true },
      scene: S('field', 'border-fox', {},
        [c('sleet', 'pawup', 'proud', 'grass', 'left', { grass: true }), c('player', 'sit', 'kind', 'left', 'right')], ['day']),
      board: 'CLOSE-UP, THE DRAGONET, THE TAP PICTURE. Sleet holds one silver forepaw up out of the long grass past the post, five frost-white claws spread, as solemn as he can manage with grass on his head. In play the counting picture takes the panel: his one raised forepaw, glowing softly; one tap lights its five claws frost-white, a big 5 grows over them, and the page turns. Caption top left; his balloon full of orders.',
      caption: ['He holds up one silver forepaw.'],
      say: [{ who: 'sleet', name: 'Sleet', text: 'Mama says: stay where you land. Tell Sprinkle: five. And that I’m in charge.' }],
      skip: { table: 5, groups: 1, who: [{ who: 'sleet' }], thing: 'claw', things: 'claws', label: 'Tap his forepaw.', prompt: '**Tap** his forepaw.', carry: false, next: 'f069' }
    },

    /* ------------------------------------------------------------------ Not today (b): one panel, by path */

    f049b: {
      when: TOLD,
      scene: S('field', 'border', {},
        [c('tallyheart', 'walk', 'kind', 'left', 'left'), c('riffle', 'stand', 'laugh', 'right', 'left', { holds: 'string' }),
         c('player', 'walk', 'happy', 'lead', 'left'), c('sleet', 'tail', 'stern', 'grass', 'left')], ['day']),
      board: 'WIDE, THE TOLD PATH ONLY, COMEDY BEAT. Our cat, Riffle and Tallyheart turn their backs on the last post and set off along the fence toward the river, Riffle waving his string of fish like a flag; behind them, past the post, the tip of a silver-white tail jerks up out of the long grass in a huff. Nobody looks round. Riffle’s balloon cheerful; the grass’s an offended snort.',
      say: [
        { who: 'riffle', text: 'Fish don’t wait. They get SMELLY.' },
        { who: 'sleet', name: 'The long grass', text: 'HMPH!' }
      ],
      next: 'f050b'
    },

    f050b: {
      when: KEPT,
      scene: S('field', 'border', {},
        [c('riffle', 'stand', 'laugh', 'right', 'left', { holds: 'string' }), c('player', 'walk', 'happy', 'lead', 'left'),
         c('sleet', 'tail', 'stern', 'grass', 'left')], ['day']),
      board: 'WIDE, THE KEPT PATH ONLY, COMEDY BEAT. Our cat and Riffle turn their backs on the last post and set off along the fence toward the river, Riffle waving his string of fish like a flag; behind them, past the post, the tip of a silver-white tail jerks up out of the long grass in a huff. Neither of them looks round. Riffle’s balloon cheerful; the grass’s an offended snort.',
      say: [
        { who: 'riffle', text: 'Fish don’t wait. They get SMELLY.' },
        { who: 'sleet', name: 'The long grass', text: 'HMPH!' }
      ],
      next: 'f069'
    },

    /* ------------------------------------------------------------------ Under the Old Bridge: every path meets here */

    f069: {
      when: TOLD,
      scene: S('bridge', 'back', merge(BACK, { branch: true }),
        [c('sprinkle', 'peek', 'wonder', 'dragon', 'left'), c('tallyheart', 'sit', 'kind', 'near', 'right'),
         c('player', 'sit', 'happy', 'back-left', 'right'), c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'string' })], ['day']),
      board: 'MEDIUM, THE TOLD PATH ONLY. In the cool dark at the very back of the bridge, beside the old stone leg, a heap of sticks lies across the nook just as Tallyheart left it, and over the top of it two big round eyes shine, then a pale snout that has smelled fish. Tallyheart settles in by the near wall as if she had always been coming here. One caption at the top.',
      caption: ['Under the Old Bridge, two big eyes peek over Tallyheart’s branch.'],
      next: 'f070'
    },

    f070: {
      when: KEPT,
      // her eyes open exactly where her face is in the panels after (`eyes: 'sprinkle'`)
      scene: S('bridge', 'back', merge(BACK, { eyes: 'sprinkle' }),
        [c('player', 'sit', 'happy', 'back-left', 'right'), c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'string' })], ['day']),
      board: 'MEDIUM, THE KEPT PATH ONLY. In the cool dark at the very back of the bridge, beside the old stone leg, two big round eyes open and shine like river stones; a small inset shows the empty bank our cat looked along first, with no ginger ears anywhere on it. Riffle holds up the fish. Captions top left, away from the eyes.',
      caption: ['At the Old Bridge, you check the bank first. No ginger ears.', 'Under the bridge, two big eyes shine.'],
      next: 'f071'
    },

    f071: {
      // the wide view under the arch, the three-shot with the fish (chapter 5's f143)
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'gulp', 'happy', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'laugh', 'mud', 'right'),
         c('riffle', 'stand', 'happy', { x: 400, y: 940 }, 'right', { holds: 'string' })], ['day']),
      board: 'WIDE, HER VIEW IN. Under the arch, the bright river a strip at the left: Sprinkle has come right out into the open of her nook and gulps the fish off Riffle’s string one after another, neck stretched, a lump going down each time. Our cat and Riffle sit on the mud in front of her, delighted. Her first balloon a squeal, her second bursting; the gulps lettered down her neck.',
      say: [
        { who: 'sprinkle', text: 'FISH!', kind: 'shout' },
        { who: 'sprinkle', text: 'Now tell me EVERYTHING.' }
      ],
      sfx: 'Gulp. Gulp. Gulp.',
      next: 'f072'
    },

    f072: {
      // a screen of its own, in two frames one after the other: his news for a cat who has met him (on
      // this reading or an earlier one), the tail she saw for everyone else
      when: { foundSleet: true },
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', { x: 1000, y: 760 }, 'left', { tear: true }), c('player', 'pawup', 'proud', 'mud', 'right'),
         c('riffle', 'sit', 'happy', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, ONLY FOR A CAT WHO HAS MET SLEET. Our cat holds up a forepaw, five claws spread, the way a bossy silver-white dragonet held up his, and Sprinkle answers fondly, one happy misty tear in her eye; a small inset shows Sleet in the long grass with a tuft on his head. Riffle grins. Our cat’s balloon proud; hers fond.',
      say: [
        { who: 'player', text: 'Sleet says: five. And he’s in charge.' },
        { who: 'sprinkle', text: 'He ALWAYS says that.' }
      ],
      next: 'f073'
    },

    f073: {
      when: { foundSleet: false },
      scene: S('bridge', 'under', UNDER,
        [c('sprinkle', 'sit', 'happy', { x: 1000, y: 760 }, 'left'), c('player', 'sit', 'wonder', 'mud', 'right'),
         c('riffle', 'sit', 'happy', { x: 400, y: 940 }, 'right')], ['day']),
      board: 'WIDE, HER VIEW IN, EVERY CAT BUT ONE WHO HAS MET SLEET. Our cat tells Sprinkle about the tail in the long grass, and a small inset shows it, a scaly silver-white tip flicking out of golden stems; Sprinkle laughs and names nobody, but she knows exactly whose it is. Riffle looks from one to the other. Our cat’s balloon eager; hers fond.',
      say: [
        { who: 'player', text: 'I saw a silver-white tail!' },
        { who: 'sprinkle', text: 'My eldest brother LOVES long grass.' }
      ],
      next: 'f074'
    },

    f074: {
      // Coil, heard and not yet seen: a stone in the wall (`stone` shows no face), “A voice”
      scene: S('bridge', 'wall', {},
        [c('coil', 'stone', 'neutral', 'gap', 'right'), c('player', 'sit', 'happy', 'back-left', 'right'),
         c('riffle', 'juggle', 'happy', 'back-right', 'left'), c('sprinkle', 'sit', 'happy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, BY THE STONE LEG. Our cat sits with its back to the old stone leg of the bridge, telling the border with its paws, while Riffle juggles three pebbles and Sprinkle’s head and neck lean in from the right to listen. Low in the wall behind them is a dark gap, and in it one rounded stone; then a voice comes out of the wall, slow and polite. Captions top left, the first, her eyes shining, for a cat who has met Sleet; our cat’s balloon dripping with drama; the voice’s small.',
      // her eyes shine at his news (narration after a balloon opens the next panel), for a cat who has met him
      caption: [{ when: { foundSleet: true }, text: 'Her eyes shine.' }, 'So you tell her about the border. Riffle juggles three pebbles.'],
      say: [
        { who: 'player', text: '…and Sloshbank’s belly went drip, drip, drip.' },
        { who: 'coil', name: 'A voice', text: 'Hello. And THEN?' }
      ],
      next: 'f075'
    },

    f075: {
      // (her tail round you is the told path's caption only: the picture is the same on both paths)
      scene: S('bridge', 'wall', {},
        [c('coil', 'stone', 'neutral', 'gap', 'right', { tap: 'stone' }), c('player', 'sit', 'wonder', 'back-left', 'left'),
         c('riffle', 'hop', 'worried', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TAP PICTURE. Our cat has spun round to face the wall: nothing there but old fitted stones and one dark gap low down, and Riffle has hopped smartly behind it, pebbles clutched to his chest, pushing it forward. In play one stone in the gap glows softly; a tap on it turns the page, and a tap anywhere else only drips water from the arch. Captions top left, the last for the told path; his balloon generous.',
      caption: ['You look round. Only stones.', 'Riffle hops behind you.', { when: TOLD, text: 'Tallyheart’s tail curls round you.' }],
      say: [{ who: 'riffle', text: 'After you. You ask the questions.' }],
      scratch: { tap: 'stone', prompt: '**Tap** the stones to find the voice.', label: 'Find the voice.', miss: 'drip…', next: 'f076' }
    },

    f076: {
      // his first sight: a head no bigger than the stone it was, mouth shut, tilted politely; “The snake”
      scene: S('bridge', 'wall', {},
        [c('coil', 'head', 'kind', 'gap', 'right'), c('player', 'sit', 'wonder', 'back-left', 'left'),
         c('riffle', 'stand', 'worried', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'sniff', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The stone in the gap was never a stone: it lifts, and it is a long brown head, rounded, no bigger than the stones around it, with two round eyes as shiny as wet pebbles that do not blink at all. He tilts it politely, mouth shut, as if he had been waiting for them for ages. Captions top left; his balloon slow, every word on its own.',
      caption: ['It isn’t a stone. It’s a long brown head, with two round eyes, shiny as wet pebbles.', 'They don’t blink.'],
      say: [{ who: 'coil', text: 'How… do… you… do. You must be the counting cat.' }],
      next: 'f077'
    },

    f077: {
      // from Riffle's “Coil,” on, his balloons carry his name
      scene: S('bridge', 'wall', {},
        [c('coil', 'longer', 'happy', 'gap', 'right'), c('player', 'sit', 'stern', 'back-left', 'left'),
         c('riffle', 'stand', 'shy', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'sniff', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, COMEDY BEAT. Out of the gap comes more of him, and then more, loop after brown loop sliding along the foot of the wall away from the cats and off the edge of the panel, as if he would never end. Riffle squeaks a very bright hello and tries to back away; our cat stays exactly where it is. Caption top left; Riffle’s balloon high and fast; our cat’s two firm words.',
      caption: ['Then more of him. Then MORE of him.'],
      say: [
        { who: 'riffle', text: 'Coil. Hi! Lovely stones! We were just leaving!' },
        { who: 'player', text: 'We were NOT.' }
      ],
      next: 'f078'
    },

    f078: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'long', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'sniff', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'left'), c('tallyheart', 'sit', 'stern', ACROSS, 'left'),
         c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE TOLD PATH ONLY. The whole of the nook: the water snake lies with his head out of his gap and one long loop of him along the foot of the stone leg, the rest gone into the shadows, his head raised a little, as comfortable as a cushion; across the nook, in front of Sprinkle’s tail, Tallyheart sits watching him without blinking either. Riffle leans to our cat behind one paw. His balloon courteous; Riffle’s a whisper.',
      say: [
        { who: 'coil', name: 'Coil', text: 'Do forgive me for not getting up. I never get up.' },
        { who: 'riffle', text: 'He’s not scary. He’s just… LONG.', kind: 'whisper' }
      ],
      next: 'f079'
    },

    f079: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'long', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'sniff', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'left'), c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE KEPT PATH ONLY. The whole of the nook: the water snake lies with his head out of his gap and one long loop of him along the foot of the stone leg, the rest gone into the shadows, his head raised a little, as comfortable as a cushion. Sprinkle sniffs at him from her nook, and Riffle leans to our cat behind one paw. His balloon courteous; Riffle’s a whisper.',
      say: [
        { who: 'coil', name: 'Coil', text: 'Do forgive me for not getting up. I never get up.' },
        { who: 'riffle', text: 'He’s not scary. He’s just… LONG.', kind: 'whisper' }
      ],
      next: 'f080'
    },

    f080: {
      // snakes feel footsteps: she asks, and on the next panel he answers and she taps the fact herself
      // (the Tap's panel holds only his answer, lettered over his head, so no balloon or its tail lies
      // over her raised paw)
      scene: S('bridge', 'wall', {},
        [c('coil', 'listen', 'kind', 'gap', 'right'), c('player', 'sit', 'wonder', 'back-left', 'left'),
         c('riffle', 'hop', 'happy', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The snake lays his chin flat on the floor, eyes open and very still, listening with his whole jaw, and our cat sits forward and asks him, while behind it Riffle hops from foot to foot. Our cat’s balloon curious.',
      say: [{ who: 'player', text: 'How long were you listening?' }],
      next: 'f081'
    },

    f081: {
      scene: S('bridge', 'wall', {},
        [c('coil', 'listen', 'kind', 'gap', 'right'), c('player', 'pawup', 'wonder', 'back-left', 'left', { tap: 'paw' }),
         c('riffle', 'hop', 'happy', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TAP PICTURE. The snake answers without lifting his chin from the floor, and our cat lifts one forepaw over the sand, wondering, while Riffle hops behind it. In play our cat’s raised paw glows softly; a tap pats it down on the sand and turns the page, and a tap anywhere else only pats the sand too. His balloon patient, at the top, over his head.',
      say: [{ who: 'coil', name: 'Coil', text: 'Since you came down the bank. Snakes feel footsteps.' }],
      scratch: { tap: 'paw', prompt: '**Tap** the ground, softly.', label: 'Pat the ground.', miss: 'pat…', next: 'f082' }
    },

    f082: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'listen', 'happy', 'gap', 'right', FAR), c('sprinkle', 'sit', 'wonder', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'left'), c('tallyheart', 'sit', 'stern', ACROSS, 'left'),
         c('riffle', 'hop', 'scared', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE TOLD PATH ONLY. Our cat’s paw is down flat on the sand, and the snake, chin still on the floor, names the footsteps one by one like a list he has kept for years; at the word hopping Riffle freezes in mid-hop, one foot in the air. Tallyheart’s ears go back a little. His balloon slow and pleased.',
      say: [{ who: 'coil', name: 'Coil', text: 'Light paws. And hopping paws.' }],
      next: 'f083'
    },

    f083: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'listen', 'happy', 'gap', 'right', FAR), c('sprinkle', 'sit', 'wonder', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'left'), c('riffle', 'hop', 'scared', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE KEPT PATH ONLY. Our cat’s paw is down flat on the sand, and the snake, chin still on the floor, names the footsteps one by one like a list he has kept for years; at the word hopping Riffle freezes in mid-hop, one foot in the air. Sprinkle peers down at her own feet. His balloon slow and pleased.',
      say: [{ who: 'coil', name: 'Coil', text: 'Light paws. And hopping paws.' }],
      next: 'f084'
    },

    f084: {
      // the told path only: she has come under his bridge for three days, and never met him
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'still', 'happy', 'gap', 'right', FAR), c('sprinkle', 'sit', 'wonder', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'left'), c('tallyheart', 'sit', 'wonder', ACROSS, 'left'),
         c('riffle', 'stand', 'shy', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE TOLD PATH ONLY. Riffle has put his foot down very slowly, and the snake turns his head an inch toward the big ginger cat across the nook, who has been coming down here for three days counting her steps; a small inset shows her doing it, and two round eyes in the wall watching. For once Tallyheart is the one caught out. Caption top left; his balloons mild; hers short.',
      caption: ['Riffle stops hopping.'],
      say: [
        { who: 'coil', name: 'Coil', text: 'And the ginger one. For three days she’s come under my bridge. She counts her steps.' },
        { who: 'tallyheart', text: 'I never saw you.' },
        { who: 'coil', name: 'Coil', text: 'I saw you. Every time.' }
      ],
      next: 'f085'
    },

    f085: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'still', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'left'), c('tallyheart', 'stand', 'stern', ACROSS, 'left'),
         c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE TOLD PATH ONLY, COMEDY BEAT. Tallyheart stands up to her full height and points out, with dignity, that the rule was about him; the snake agrees completely and adds one detail, and a small inset shows a much crosser Tallyheart stamping a paw on the bank. Our cat’s whiskers twitch. Her balloon stern; his mild.',
      say: [
        { who: 'tallyheart', text: 'Not one paw under the Old Bridge. I made that rule because of YOU.' },
        { who: 'coil', name: 'Coil', text: 'I know. You stamped when you said it.' }
      ],
      next: 'f086'
    },

    f086: {
      // the kept path's form: Coil tells it, and “Your ears go hot.” opens the next panel
      when: KEPT,
      scene: S('bridge', 'wall', {},
        [c('coil', 'still', 'kind', 'gap', 'right'), c('player', 'sit', 'shy', 'back-left', 'left'),
         c('riffle', 'stand', 'shy', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE KEPT PATH ONLY. Riffle has put his foot down very slowly, and the snake, lying along the wall’s foot, turns his round unblinking eyes on our cat and tells it something it did not know; a small inset shows a big ginger cat on the bank stamping one paw. Our cat sits very still. Caption top left; his balloon mild.',
      caption: ['Riffle stops hopping.'],
      say: [{ who: 'coil', name: 'Coil', text: 'Your ginger mentor made a rule because of me. Not one paw under the Old Bridge. She stamped when she said it.' }],
      next: 'f087'
    },

    f087: {
      scene: S('bridge', 'wall', {},
        [c('coil', 'still', 'neutral', 'gap', 'right', { tap: 'eyes' }), c('player', 'sit', 'shy', 'back-left', 'left'),
         c('riffle', 'stand', 'wonder', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'sniff', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TAP PICTURE. Sprinkle sticks her nose in the air at the snake and tells on him, very offended, and he does not so much as blink. In play his two round eyes glow softly; one tap waves our cat’s paw in front of them and turns the page. Caption top left for a cat who kept the secret; her balloon indignant.',
      caption: [{ when: KEPT, text: 'Your ears go hot.' }],
      say: [{ who: 'sprinkle', text: 'He watches me SLEEP. It’s RUDE.' }],
      scratch: { tap: 'eyes', prompt: '**Tap** to wave at his eyes.', label: 'Wave at his eyes.', next: 'f088' }
    },

    f088: {
      scene: S('bridge', 'wall', {},
        [c('coil', 'still', 'happy', 'gap', 'right'), c('player', 'pawup', 'wonder', 'back-left', 'left'),
         c('riffle', 'stand', 'wonder', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'sniff', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat waves a forepaw right in front of the snake’s face, and his two round eyes stay open, shiny and unbothered, not one flicker. He explains it as if it were good news; Sprinkle is not persuaded. His balloon pleased; hers flat.',
      say: [
        { who: 'coil', name: 'Coil', text: 'I have no eyelids. I never shut my eyes. So I see EVERYBODY’S business.' },
        { who: 'sprinkle', text: 'STILL RUDE.' }
      ],
      next: 'f089'
    },

    f089: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'still', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'wonder', 'dragon', 'left'),
         c('player', 'sit', 'solemn', 'back-left', 'left'), c('tallyheart', 'sit', 'solemn', ACROSS, 'left'),
         c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE TOLD PATH ONLY. Our cat sits up straight and gets down to business, and a small inset shows the heron in her shallows; the snake tilts his head with polite interest and names his price question in return. Riffle has an answer ready at once. Our cat’s balloon careful; his smooth; Riffle’s one hopeful word.',
      say: [
        { who: 'player', text: 'Patience said to ask you. The one who never shuts his eyes.' },
        { who: 'coil', name: 'Coil', text: 'How kind of her. And what will you give me for a secret?' },
        { who: 'riffle', text: 'Fish?' }
      ],
      next: 'f090'
    },

    f090: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'still', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'wonder', 'dragon', 'left'),
         c('player', 'sit', 'solemn', 'back-left', 'left'), c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE KEPT PATH ONLY. Our cat sits up straight and gets down to business, and a small inset shows the heron in her shallows; the snake tilts his head with polite interest and names his price question in return. Riffle has an answer ready at once. Our cat’s balloon careful; his smooth; Riffle’s one hopeful word.',
      say: [
        { who: 'player', text: 'Patience said to ask you. The one who never shuts his eyes.' },
        { who: 'coil', name: 'Coil', text: 'How kind of her. And what will you give me for a secret?' },
        { who: 'riffle', text: 'Fish?' }
      ],
      next: 'f091'
    },

    f091: {
      scene: S('bridge', 'wall', { train: true },
        [c('coil', 'think', 'neutral', 'gap', 'right'), c('player', 'sit', 'wonder', 'back-left', 'left'),
         c('riffle', 'stand', 'worried', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, COMEDY BEAT. The snake tips his head up to think, and thinks for so long that a whole train goes rumbling over the bridge above them, grit pattering down in front of the wall; everyone waits. At last he gives his verdict on fish. Caption top left; his balloon slow and final.',
      caption: ['Coil thinks about it. A whole train rumbles over.'],
      say: [{ who: 'coil', name: 'Coil', text: 'Fish are NOISY.' }],
      next: 'f092'
    },

    f092: {
      scene: S('bridge', 'wall', {},
        [c('coil', 'still', 'sniff', 'gap', 'right'), c('player', 'sit', 'wonder', 'back-left', 'left'),
         c('riffle', 'stand', 'wonder', 'back-right', 'left', { holds: 'pebbles' }), c('sprinkle', 'sit', 'shy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The snake lifts his chin, offended, and lists everything that has been wrong with his bridge since the storm; small insets show pebbles, a sniffling dragonet, a flapping fish and a mouth that never closes. At the end Riffle asks the obvious question in perfect innocence. His balloon long and weary; Riffle’s one word.',
      say: [
        { who: 'coil', name: 'Coil', text: 'Since the storm, my bridge is SO noisy. Pebbles. Sniffling. Fish, flapping. And an otter who never, ever stops talking.' },
        { who: 'riffle', text: 'Who?' }
      ],
      next: 'f093'
    },

    f093: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'still', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'laugh', 'back-left', 'right'), c('tallyheart', 'sit', 'laugh', ACROSS, 'right'),
         c('riffle', 'stand', 'shy', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE TOLD PATH ONLY, COMEDY BEAT. Every head in the nook turns to Riffle at once, Tallyheart’s included, and Riffle looks behind himself to see who they mean. The snake names his price quite kindly. Caption top left; his balloon gentle and firm.',
      caption: ['Everybody looks at Riffle.'],
      say: [{ who: 'coil', name: 'Coil', text: 'A secret, for some quiet. No juggling under my bridge.' }],
      next: 'f094'
    },

    f094: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'still', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'laugh', 'back-left', 'right'), c('riffle', 'stand', 'shy', 'back-right', 'left', { holds: 'pebbles' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE KEPT PATH ONLY, COMEDY BEAT. Every head in the nook turns to Riffle at once, and Riffle looks behind himself to see who they mean. The snake names his price quite kindly. Caption top left; his balloon gentle and firm.',
      caption: ['Everybody looks at Riffle.'],
      say: [{ who: 'coil', name: 'Coil', text: 'A secret, for some quiet. No juggling under my bridge.' }],
      next: 'f095'
    },

    f095: {
      scene: S('bridge', 'wall', {},
        [c('coil', 'still', 'neutral', 'gap', 'right'), c('player', 'sit', 'happy', 'back-left', 'left'),
         c('riffle', 'stand', 'sad', 'back-right', 'left', { holds: 'pebbles', tap: 'pebbles' }), c('sprinkle', 'sit', 'wonder', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TAP PICTURE. Riffle stands clutching his three pebbles to his chest like treasure, looking from them to the snake and back. In play the pebbles glow softly; one tap sets all three down on the sand at his feet, very gently, and turns the page. One caption at the top.',
      caption: ['Riffle still has three pebbles in his paws.'],
      scratch: { tap: 'pebbles', prompt: '**Tap** to put the pebbles down.', label: 'Put the pebbles down.', next: 'f096' }
    },

    f096: {
      scene: S('bridge', 'wall', {},
        [c('coil', 'still', 'happy', 'gap', 'right'), c('player', 'sit', 'kind', 'back-left', 'left'),
         c('riffle', 'stand', 'sad', 'back-right', 'left', { holds: 'pebbles', holdAt: 'paws' }), c('sprinkle', 'sit', 'happy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The three pebbles lie in a neat row on the sand at Riffle’s feet, and Riffle lays one webbed paw on his chest with a sigh as deep as the river, the way an otter makes a promise. The snake looks very satisfied. His balloon a solemn sigh.',
      say: [{ who: 'riffle', text: 'Otter’s honor.' }],
      next: 'f097'
    },

    f097: {
      // the secret, very quietly: Coil's card
      card: 'coil-diggers',
      scene: S('bridge', 'wall', {},
        [c('coil', 'still', 'solemn', 'gap', 'right'), c('player', 'sit', 'wonder', 'back-left', 'left'),
         c('riffle', 'sit', 'wonder', 'back-right', 'left', { holds: 'pebbles', holdAt: 'paws' }), c('sprinkle', 'sniff', 'shy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE SECRET. Sprinkle gives one very small sniff, and in the hush the snake lowers his head toward our cat and says it so quietly that they all lean in; a small inset shows the prey pile seen from the side, and under the ground beneath it a few short scrape marks, nothing more. Nobody moves. Captions top left; his balloon a whisper; the new card appears under the panel, an ear in its corner.',
      caption: ['Sprinkle sniffs. Very, very quietly.', 'Coil’s voice goes very quiet. He likes quiet.'],
      say: [{ who: 'coil', name: 'Coil', text: 'Every night, small diggers come and go. Under your Clan’s pile. Scrape, scrape. I feel them.', kind: 'whisper' }],
      next: 'f098'
    },

    f098: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'listen', 'neutral', 'gap', 'right', FAR), c('sprinkle', 'sit', 'worried', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'left'), c('tallyheart', 'sit', 'solemn', ACROSS, 'left'),
         c('riffle', 'stand', 'worried', 'back-right', 'left', { holds: 'pebbles', holdAt: 'paws' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE TOLD PATH ONLY. Riffle whispers the question everybody wants, and the snake lays his chin on the floor again: feet are all he feels. Across the nook Tallyheart narrows her eyes and files it away, the way she files a sum that is not finished. Riffle’s balloon a whisper; his plain; hers a murmur.',
      say: [
        { who: 'riffle', text: 'Diggers? WHO?', kind: 'whisper' },
        { who: 'coil', name: 'Coil', text: 'I feel feet. Not faces.' },
        { who: 'tallyheart', text: 'A snake’s secret. A thing to check.', kind: 'whisper' }
      ],
      next: 'f099'
    },

    f099: {
      // (the kept path's “A snake's secret. A thing to check.” is narration: it opens the next panel)
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'listen', 'neutral', 'gap', 'right', FAR), c('sprinkle', 'sit', 'worried', 'dragon', 'left'),
         c('player', 'sit', 'wonder', 'back-left', 'left'), c('riffle', 'stand', 'worried', 'back-right', 'left', { holds: 'pebbles', holdAt: 'paws' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE KEPT PATH ONLY. Riffle whispers the question everybody wants, and the snake lays his chin on the floor again: feet are all he feels. Sprinkle looks from one to the other, worried. Riffle’s balloon a whisper; his plain.',
      say: [
        { who: 'riffle', text: 'Diggers? WHO?', kind: 'whisper' },
        { who: 'coil', name: 'Coil', text: 'I feel feet. Not faces.' }
      ],
      next: 'f100'
    },

    f100: {
      // a light choice: one answer does for both (“Never. Not to anybody.”), and it sets nothing
      scene: S('bridge', 'wall', {},
        [c('coil', 'still', 'kind', 'gap', 'right'), c('player', 'sit', 'worried', 'back-left', 'left'),
         c('riffle', 'sit', 'shout', 'back-right', 'left', { holds: 'pebbles', holdAt: 'paws' }), c('sprinkle', 'sit', 'shy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. Sprinkle’s head comes low and shy toward the wall and she asks it in the smallest voice she has; the snake answers as if it were the plainest thing in the world, and Riffle is outraged on her behalf. Our cat looks at the round eyes and thinks of a fox. Caption top left for a cat who kept the secret; four balloons back and forth; the choices sit below the panel.',
      caption: [{ when: KEPT, text: 'A snake’s secret. A thing to check.' }],
      say: [
        { who: 'sprinkle', text: 'Did you always know I was here?', kind: 'whisper' },
        { who: 'coil', name: 'Coil', text: 'Since the night you fell in. I felt you land.' },
        { who: 'riffle', text: 'And you never TOLD?' },
        { who: 'coil', name: 'Coil', text: 'Nobody asked.' }
      ],
      choice: {
        options: [
          { label: '“Would you tell the FOX?”', sets: {}, next: 'f101' },
          { label: '“Would you tell ANYBODY?”', sets: {}, next: 'f101' }
        ]
      }
    },

    f101: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'still', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'left'), c('tallyheart', 'sit', 'kind', ACROSS, 'left'),
         c('riffle', 'stand', 'wonder', 'back-right', 'left', { holds: 'pebbles', holdAt: 'paws' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE TOLD PATH ONLY. The snake says it simply and without a blink, and Sprinkle’s whole face changes, though she will not admit it; then he asks, very politely, for what he was promised. Tallyheart dips her head to him for the first time. His balloons calm; hers a whisper.',
      say: [
        { who: 'coil', name: 'Coil', text: 'Never. Not to anybody. And I never trade with foxes. Foxes never leave anyone alone.' },
        { who: 'sprinkle', text: 'That’s the nicest thing he’s ever said. He’s still rude.', kind: 'whisper' },
        { who: 'coil', name: 'Coil', text: 'Now. Quiet, please.' }
      ],
      next: 'f102'
    },

    f102: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        [c('coil', 'still', 'kind', 'gap', 'right', FAR), c('sprinkle', 'sit', 'happy', 'dragon', 'left'),
         c('player', 'sit', 'happy', 'back-left', 'left'), c('riffle', 'stand', 'wonder', 'back-right', 'left', { holds: 'pebbles', holdAt: 'paws' })], ['day']),
      board: 'MEDIUM, THE NOOK, THE KEPT PATH ONLY. The snake says it simply and without a blink, and Sprinkle’s whole face changes, though she will not admit it; then he asks, very politely, for what he was promised. Our cat lets out a breath it did not know it was holding. His balloons calm; hers a whisper.',
      say: [
        { who: 'coil', name: 'Coil', text: 'Never. Not to anybody. And I never trade with foxes. Foxes never leave anyone alone.' },
        { who: 'sprinkle', text: 'That’s the nicest thing he’s ever said. He’s still rude.', kind: 'whisper' },
        { who: 'coil', name: 'Coil', text: 'Now. Quiet, please.' }
      ],
      next: 'f103'
    },

    f103: {
      scene: S('bridge', 'wall', {},
        [c('coil', 'slide', 'kind', 'gap', 'right'), c('player', 'sit', 'happy', 'back-left', 'left'),
         c('riffle', 'sit', 'happy', 'back-right', 'left', { holds: 'pebbles', holdAt: 'paws' }), c('sprinkle', 'sit', 'happy', 'dragon', 'left')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The snake slides back into his gap, slowly, slowly, head first and the long tail last, until there is only a rounded stone in the wall again; Sprinkle leans down to our cat and whispers an order for next time. Caption top left; her balloon a whisper, the last word loud anyway.',
      caption: ['Slowly, slowly, he slides back into the stones.'],
      say: [{ who: 'sprinkle', text: 'Bring more fish. QUIET ones.', kind: 'whisper' }],
      next: 'f104'
    },

    f104: {
      scene: S('bridge', 'mouth', {},
        [c('player', 'walk', 'happy', 'sun-edge', 'right'), c('riffle', 'puff', 'neutral', 'sun', 'right', { tap: 'cheeks' })], ['day']),
      board: 'WIDE, AT THE MOUTH OF THE BRIDGE, THE TAP PICTURE. Our cat and Riffle come out of the dark under the arch into the daylight, and Riffle walks with his cheeks puffed out round as two apples, eyes wide, holding in every word he has. In play his cheeks glow softly; one tap makes them rounder still and turns the page. One caption at the top.',
      caption: ['Riffle doesn’t say one word all the way out.'],
      scratch: { tap: 'cheeks', prompt: '**Tap** his puffed-up cheeks.', label: 'Tap his cheeks.', next: 'f105' }
    },

    f105: {
      when: TOLD,
      scene: S('bridge', 'bank', { drag: false },
        [c('tallyheart', 'sit', 'laugh', 'reeds', 'left'), c('player', 'sit', 'laugh', 'bank-left', 'right'),
         c('riffle', 'hop', 'shout', 'bank-right', 'left')], ['day']),
      board: 'WIDE, FROM THE RIVERBANK, THE TOLD PATH ONLY. Out on the sunny bank Riffle explodes, leaping into the air with all four paws flung out and every word he held in coming out at once; our cat laughs, and Tallyheart, by the reeds, laughs with it. The Old Bridge stands dark and quiet behind them. Caption top left; his balloon enormous.',
      caption: ['On the bank, he bursts.'],
      say: [{ who: 'riffle', text: 'THAT was the longest I’ve EVER been quiet!', kind: 'shout' }],
      next: 'f106'
    },

    f106: {
      when: KEPT,
      scene: S('bridge', 'bank', { drag: false },
        [c('player', 'sit', 'laugh', 'bank-left', 'right'), c('riffle', 'hop', 'shout', 'bank-right', 'left')], ['day']),
      board: 'WIDE, FROM THE RIVERBANK, THE KEPT PATH ONLY. Out on the sunny bank Riffle explodes, leaping into the air with all four paws flung out and every word he held in coming out at once, and our cat laughs so hard it has to sit down. The Old Bridge stands dark and quiet behind them. Caption top left; his balloon enormous.',
      caption: ['On the bank, he bursts.'],
      say: [{ who: 'riffle', text: 'THAT was the longest I’ve EVER been quiet!', kind: 'shout' }],
      next: 'f107'
    },

    /* ------------------------------------------------------------------ Eighteen guards */

    f107: {
      scene: S('pile', 'wide', EVE,
        [c('glintstar', 'stand', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'),
         c('player', 'sit', 'wonder', 'pile-left', 'right'), c('murmurchime', 'sit', 'wonder', 'crowd-1', 'right'),
         c('snorter', 'sit', 'proud', 'crowd-2', 'right'), c('grizzled', 'sit', 'scared', 'crowd-3', 'left')], ['sunset']),
      board: 'WIDE, SUNSET. The whole Clan sits in a ring round the prey pile in the orange light, forty pieces in four full rows, and Glintstar on the fountain’s edge gives them ReedClan’s news. The grizzled old tom throws up his paws, quite sure he knows who to blame. Caption top left; her balloon level; his outraged.',
      caption: ['At sunset, the whole Clan sits round the prey pile. Forty pieces, in four rows.'],
      say: [
        { who: 'glintstar', text: 'ReedClan has been robbed too.' },
        { who: 'grizzled', text: 'ReedClan TOO? That dragon is EVERYWHERE.' }
      ],
      next: 'f108'
    },

    f108: {
      scene: S('pile', 'low', EVE,
        [c('glintstar', 'stand', 'solemn', 'pile-left', 'right'), c('tallyheart', 'sit', 'proud', 'beside', 'left')], ['sunset']),
      board: 'MEDIUM, LOW, SUNSET. Across the rows from each other, Glintstar settles the matter in a few cool words and turns to Tallyheart, who is ready; she counts the three jobs off on one ginger paw, the way she counts everything. The whole Clan is listening out of the panel. Glintstar’s balloon cool; Tallyheart’s practical.',
      say: [
        { who: 'glintstar', text: 'We don’t blame what we haven’t seen. We guard. Tallyheart?' },
        { who: 'tallyheart', text: 'ReedClan cats always come in threes. One to look. One to listen. One to run for help.' }
      ],
      next: 'f109'
    },

    f109: {
      // her balloon is said again over the question; the right line is the old tom's
      scene: S('pile', 'wide', EVE,
        [c('glintstar', 'sit', 'solemn', 'fountain-edge', 'left'), c('tallyheart', 'stand', 'kind', 'pile-right', 'left'),
         c('player', 'sit', 'wonder', 'pile-left', 'right'), c('murmurchime', 'sit', 'happy', 'crowd-1', 'right'),
         c('snorter', 'sit', 'wonder', 'crowd-2', 'right'), c('grizzled', 'sit', 'sleepy', 'crowd-3', 'left')], ['sunset']),
      board: 'WIDE, SUNSET, THEN THE COUNTS. Tallyheart stands up by the rows and lays out the night for the whole Clan, sweeping one paw round the pile from sunset to sunrise. In the Counts picture six patrols of three walk along a path, none lit; after a miss she scratches three lines a patrol in the earth beside the pile and hops along them. Her balloon clear and practical; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Tonight, our guards do the same. Six patrols, one after another, sunset to sunrise. Three cats in every one.' }],
      counts: { set: 'ch06-guards', next: 'f110' }
    },

    f110: {
      scene: S('pile', 'low', EVE,
        [c('grizzled', 'sit', 'sad', 'pile-left', 'right'), c('tallyheart', 'sit', 'solemn', 'beside', 'left')], ['sunset']),
      board: 'MEDIUM, LOW, SUNSET, COMEDY BEAT. Across the rows Tallyheart answers the old tom with a perfectly straight face, and he asks the only question that matters to him, very hopefully, his ears drooping; she does not even blink. Her balloons deadpan; his small and hopeful.',
      // his “Then I can SLEEP.” opens this panel (the question's right line is only “Eighteen!”), so a cat who
      // missed it three times, and never heard the right line, reads what Tallyheart answers
      say: [
        { who: 'grizzled', text: 'Then I can SLEEP.' },
        { who: 'tallyheart', text: 'You can. In your NEST.' },
        { who: 'grizzled', text: 'No pinecone?' },
        { who: 'tallyheart', text: 'No pinecone.' }
      ],
      next: 'f111'
    },

    f111: {
      scene: S('pile', 'rows', EVE,
        [c('player', 'sit', 'proud', 'pile-left', 'right'), c('tallyheart', 'sit', 'kind', 'beside', 'left')], ['sunset']),
      board: 'WIDE, FROM THE FRONT, SUNSET. The four full rows of the pile stretch between our cat and Tallyheart, every piece lit orange, and she looks across them at our cat as if the pile were a sum the two of them are doing together. A small inset shows tomorrow’s morning count. Her balloon warm and serious.',
      say: [{ who: 'tallyheart', text: 'Eighteen guards. That’s what the Counts are for. In the morning, your count tells us if it worked.' }],
      next: 'f112'
    },

    f112: {
      // the kept path's hairball (narration after her balloon before) opens this panel
      scene: S('pile', 'wide', EVE,
        [c('tallyheart', 'stand', 'proud', 'pile-right', 'left'), c('player', 'sit', 'solemn', 'pile-left', 'right'),
         c('murmurchime', 'stand', 'happy', 'crowd-1', 'right')], ['dusk']),
      board: 'WIDE, DUSK. The light is going and the pile is a grey shape; Tallyheart names the first watch, and the little tortoiseshell warrior hops to her feet. For a cat who kept the secret, a small thought bubble over its head holds a snake’s round eye and a closed mouth. Captions top left for a cat who kept the secret; her balloon brisk.',
      caption: [
        { when: KEPT, text: 'You don’t tell her what Coil said. You can’t, without telling her where you heard it.' },
        { when: KEPT, text: 'It sits in your tummy like a hairball.' }
      ],
      say: [{ who: 'tallyheart', text: 'First watch. Me, {Murmur}chime, and you.' }],
      next: 'f113'
    },

    f113: {
      // the back row, close: she takes it, to look (her two lines by the path she took)
      scene: S('pile', 'gap', EVE,
        [c('tallyheart', 'sit', 'stern', 'behind', 'left'), c('player', 'sit', 'wonder', 'pile-left', 'right'),
         c('murmurchime', 'stand', 'proud', 'pile-right', 'left')], ['dusk']),
      board: 'MEDIUM, THE BACK ROW, DUSK. Tallyheart settles down behind the back row, right where the gaps have been every morning, and fixes her eyes on it; on the told path she says it under her breath with a glance at our cat. Our cat and the little tortoiseshell take their places. Caption top left; her balloon grim and a little funny.',
      caption: ['She takes the back, to look.'],
      say: [
        { who: 'tallyheart', text: 'Why is it always the back? Tonight, I AM the back.', when: KEPT },
        { who: 'tallyheart', text: 'Always the back. And a snake’s secret. Tonight, I AM the back.', kind: 'whisper', when: TOLD }
      ],
      next: 'f114'
    },

    f114: {
      scene: S('pile', 'wide', MOON,
        [c('tallyheart', 'sit', 'stern', 'behind', 'left'), c('murmurchime', 'walk', 'proud', 'crowd-1', 'right'),
         c('player', 'sit', 'wonder', 'pile-left', 'right')], ['night']),
      board: 'WIDE, NIGHT, THE FIRST WATCH. The pile under the dark brambles, Tallyheart a still shape behind the back row, the little tortoiseshell pacing round the outside, and our cat sitting at the front with its ears straight up. Over the towers a crescent moon has come out, a little fatter than last night’s. Three captions, top left and at the bottom.',
      caption: ['{Murmur}chime walks round and round, ready to run for help.', 'You sit at the front, ears up. You’re the one to listen.', 'The moon comes out, a little fatter.'],
      next: 'f115'
    },

    f115: {
      scene: S('pile', 'low', MOON,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('murmurchime', 'walk', 'sleepy', 'beside', 'left'),
         c('tallyheart', 'sit', 'stern', 'behind', 'left')], ['night']),
      board: 'MEDIUM, LOW, NIGHT. Nothing at all is happening: the rows lie still, the moon hangs in its patch of sky, and the little tortoiseshell walks past our cat for the hundredth time, slower now, eyelids drooping. She mumbles something about mice. Captions top left; her balloon a sleepy mumble.',
      caption: ['Nothing happens. Not one thing.', '{Murmur}chime walks slower. And slower.'],
      say: [{ who: 'murmurchime', text: 'Mice…', kind: 'whisper' }],
      next: 'f116'
    },

    f116: {
      // side by side behind the back row (the spec: no art draws a tail across another cat; the caption
      // carries it): both face right, so Tallyheart's tail is on her left, where {Murmur}chime dozes (a
      // spot of her own on `behind`'s line, drawn behind the rows as it is, clear of the dug earth)
      scene: S('pile', 'low', MOON,
        [c('player', 'sit', 'scared', 'pile-left', 'right', { tap: 'ears' }), c('murmurchime', 'sit', 'sleepy', WATCH, 'right'),
         c('tallyheart', 'sit', 'kind', 'behind', 'right')], ['night']),
      board: 'MEDIUM, LOW, NIGHT, THE TAP PICTURE. Behind the back row the little tortoiseshell has nodded off sitting up, side by side with Tallyheart, and the tip of Tallyheart’s tail is tickling her nose awake; then, out of the dark, a rustle, and our cat goes stiff. In play our cat’s ears glow softly; one tap swivels them toward the sound and turns the page. Captions top left.',
      caption: ['Tallyheart’s tail tickles her nose.', 'A rustle!'],
      scratch: { tap: 'ears', prompt: '**Tap** your ears to listen.', label: 'Listen.', next: 'f117' }
    },

    f117: {
      scene: S('pile', 'low', MOON,
        [c('player', 'sit', 'wonder', 'pile-left', 'right'), c('grizzled', 'walk', 'sleepy', 'beside', 'left', { holds: 'pinecone', holdAt: 'mouth' }),
         c('murmurchime', 'sit', 'wonder', WATCH, 'right'), c('tallyheart', 'sit', 'stern', 'behind', 'right')], ['night']),
      board: 'MEDIUM, LOW, NIGHT, COMEDY BEAT. It is only the old tom, shuffling out of the dark past the rows with his pinecone in his mouth, inspecting the guards he is not one of, while the three on the first watch stare at him: the little tortoiseshell wide awake now beside Tallyheart behind the back row. He mumbles round the pinecone without stopping. Caption top left; his balloon a muffled mumble.',
      caption: ['Out shuffles the old tom, with his pinecone.'],
      say: [{ who: 'grizzled', text: 'Just checking.', kind: 'whisper' }],
      next: 'f118'
    },

    f118: {
      // the second watch's three: black, grey and cream, so no ginger coat stands beside Tallyheart (a
      // ginger-and-white guard there read as a second Tallyheart in the dark)
      scene: S('pile', 'wide', MOON,
        [c('clancat', 'stand', 'sleepy', 'crowd-2', 'left', { variant: 2 }), c('clancat', 'stand', 'sleepy', 'crowd-3', 'left', { variant: 4 }),
         c('clancat', 'stand', 'sleepy', 'fountain-edge', 'left', { variant: 3 }), c('tallyheart', 'stand', 'kind', 'beside', 'left'),
         c('murmurchime', 'sit', 'sleepy', 'crowd-1', 'right'), c('player', 'sit', 'happy', 'pile-left', 'right')], ['night']),
      board: 'WIDE, NIGHT. The old tom’s tail vanishes into the dark at one side, and from the other three yawning cats arrive to take the second watch; the pile lies whole under the moon, forty pieces, all there. Tallyheart stands and stretches, satisfied. Captions top left; her balloon calm.',
      caption: ['And off he shuffles.', 'Then three yawning cats come for the second watch. Forty pieces, all there.'],
      say: [{ who: 'tallyheart', text: 'Nothing. Good. Nothing is the best thing a guard can see.' }],
      next: 'f119'
    },

    /* ------------------------------------------------------------------ The threes thing */

    f119: {
      // (lying, so the stone is under her chin or by her nose, as the caption says); the skritch runs on
      // from the first caption, and is said in words for a child who listens
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'lie', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat lies in its own moss nest in the dark, and along the nest’s mossy edge its Case File stands in rows, today’s two new pieces of bark in front; the pieces it must keep secret lie under the moss, a corner of each showing. Riffle’s nearly black stone lies where it was put. Captions top left, the last by where she put the stone; the skritch small and pale.',
      caption: [
        'In your nest:',
        'Today’s bark goes along the mossy edge.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      sfx: 'skritch, skritch.',
      sfxRead: 'skritch, skritch.',
      next: 'f120'
    },

    f120: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'lie', 'wonder', 'sleeper-1', 'right'), c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. Across the empty middle nest the grey apprentice lifts his head and whispers, eyes like saucers, hoping for a battle; our cat answers from its own nest, a little sorry to disappoint him. Then he asks for the same thing he always asks for. Three small balloons, his last one a little embarrassed.',
      say: [
        { who: 'snorer', text: '{name}paw? Did you catch anybody?', kind: 'whisper' },
        { who: 'player', text: 'Only the old tom.' },
        { who: 'snorer', text: '…Do the paw thing.', kind: 'whisper' }
      ],
      next: 'f121'
    },

    f121: {
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, IN THE DARK, THE TAP PICTURE. Our cat lies in its nest with its forepaws stretched out on the moss and explains tonight’s count. In play the counting picture takes the panel: six patrols of three walking round a pile, the next one glowing softly; each tap lights its three cats and puts the next number in our cat’s murmur, 3, 6, 9, 12, 15, 18, and a tap anywhere else only wiggles the glowing patrol. Its balloon at the top.',
      say: [{ who: 'player', text: 'It’s threes tonight. Six guard patrols.' }],
      skip: { table: 3, groups: 6, teacher: 'player', thing: 'cat', things: 'cats', label: 'Count the next patrol.', prompt: '**Tap** the patrols.', next: 'f122' }
    },

    f122: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. A big 18 floats over the dark, and across the empty middle nest the grey apprentice has sunk back down with his chin on his paws, correcting our cat with the last of his strength. His eyes are already shut. His balloon a mumble.',
      say: [{ who: 'snorer', text: 'That’s not a paw thing. That’s a GUARD thing.' }],
      next: 'f123'
    },

    f123: {
      scene: S('den', 'inside', DEN_BARK,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. The grey apprentice has curled up tight and is snoring, a little zzz rising from him, and across the den our cat has curled up too, its eyes drifting shut. Starlight comes in through the rose leaves. One caption at the top.',
      caption: ['Soon he’s snoring. And then, so are you.'],
      next: 'f124'
    },

    /* ------------------------------------------------------------------ The starry cat: the dream, no card */

    f124: {
      scene: S('sky', 'walk', {},
        [c('player', 'walk', 'wonder', 'star-1', 'right')], ['night', 'stars']),
      board: 'WIDE, THE DREAM. A broad soft path of stars runs across the dark blue sky from the near corner up and away into the distance, and our cat walks along it, every step sinking a little into the starlight as if into moss; far, far below, the city’s lights are tiny. Nothing else is there yet. One caption at the top.',
      caption: ['You’re walking on the Sky River, on stars as soft as moss.'],
      next: 'f125'
    },

    f125: {
      // a Clan cat in starlight: nobody she knows, and never named
      scene: S('sky', 'walk', {},
        [c('player', 'walk', 'wonder', 'star-1', 'right'), c('clancat', 'sit', 'kind', 'star-2', 'left', { variant: 1, starry: true })], ['night', 'stars']),
      board: 'WIDE, THE DREAM. Further along the path of stars sits a cat made of starlight, pale blue-white and a little see-through, with small stars inside her and a soft glow at her edges; she is nobody our cat knows, and she is waiting for it. Our cat stops walking. Two captions, top left.',
      caption: ['A cat made of starlight sits waiting: one of the cats who came before.', 'You don’t know her. But she feels kind.'],
      next: 'f126'
    },

    f126: {
      // a light choice: her two answers, each a panel; it sets nothing
      scene: S('sky', 'walk', {},
        [c('player', 'sit', 'wonder', 'star-1', 'right'), c('clancat', 'sit', 'kind', 'star-2', 'left', { variant: 1, starry: true })], ['night', 'stars']),
      board: 'WIDE, THE DREAM. The starry cat speaks, softly, and her words seem to come from all round the sky at once; our cat sits down on the stars to listen. Her balloon gentle, the two sentences slow; the choices sit below the panel.',
      say: [{ who: 'clancat', name: 'The starry cat', text: 'Count what’s missing, little one. Then ask who was there to see it.' }],
      choice: {
        options: [
          { label: '“Who are you?”', sets: {}, next: 'f127a' },
          { label: '“Who was there?”', sets: {}, next: 'f127b' }
        ]
      }
    },

    f127a: {
      scene: S('sky', 'walk', {},
        [c('player', 'sit', 'happy', 'star-1', 'right', { purr: true }), c('clancat', 'sit', 'happy', 'star-2', 'left', { variant: 1, starry: true, purr: true })], ['night', 'stars', 'purr']),
      board: 'WIDE, THE DREAM. The starry cat does not answer; she only purrs, and small rings of sound roll out from her across the stars like the rumble of a train far away, and our cat purrs back without meaning to. The question stays a question. One caption at the top.',
      caption: ['She only purrs, like a train far away.'],
      next: 'f128'
    },

    f127b: {
      scene: S('sky', 'walk', {},
        [c('player', 'sit', 'wonder', 'star-1', 'right'), c('clancat', 'peer', 'kind', 'star-2', 'left', { variant: 1, starry: true })], ['night', 'stars']),
      board: 'WIDE, THE DREAM. The starry cat leans out over the edge of the path of stars and looks down, past them, toward the world far below, and our cat follows her gaze. She does not say a word. One caption at the top.',
      caption: ['She looks down, past the stars.'],
      next: 'f128'
    },

    f128: {
      scene: S('sky', 'below', {}, [], ['night', 'stars']),
      board: 'HIGH ANGLE, THE DREAM, LOOKING DOWN. Past the river’s edge of starlight, far below, the city’s streets of light and the glass towers seen from above, the tallest with its red light blinking; and on one balcony nineteen floors up, with a lit door and a geranium, a wind chime catches the starlight and rings. Nobody is on the balcony. Two captions, the second a question.',
      caption: ['Far below is your old tower. On a balcony nineteen floors up, a wind chime rings.', 'Who was up there, awake, when the rain stopped?'],
      next: 'f129'
    },

    f129: {
      // the guards: three small shapes far off across the dark camp, in single file through the doorway (on
      // the grass beyond it, small with distance, inside its arch)
      scene: S('den', 'doorway', DEN_BARK,
        [c('player', 'lie', 'wonder', 'nest', 'left'), c('clancat', 'walk', 'neutral', GUARDS[0], 'right', { variant: 2 }),
         c('clancat', 'walk', 'neutral', GUARDS[1], 'right', { variant: 4 }), c('clancat', 'walk', 'neutral', GUARDS[2], 'right', { variant: 6 })], ['night', 'stars']),
      board: 'MEDIUM, FROM INSIDE THE DEN, NIGHT. Our cat lies awake in its moss nest, warm, looking out through the doorway at the starry night, and far off across the dark camp three small shapes pass by in single file, on watch round the pile. Everything is safe. Two captions, top left.',
      caption: ['You wake up in your nest, warm and safe.', 'Outside, the guards walk round the pile, three by three.'],
      next: 'f130'
    },

    f130: {
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'curl', 'solemn', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat curls up tight beside its rows of bark, eyes half shut, and a small thought bubble holds tomorrow: the four rows of the pile in the morning light, and a big question mark over the back row. One caption at the top, a question, then one at the bottom.',
      caption: ['Tomorrow, your sixth morning count. Will anything be missing?', 'You curl up tight, and sleep.'],
      next: 'f131'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f131: {
      scene: S('den', 'nest', DEN_BARK,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside its bark and Riffle’s stone, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What else did {name}paw dream, the night of {their} first patrol?'],
      // short enough for one line in the box
      input: { kind: 'dream', placeholder: 'A snake… stars… a wind chime…', next: 'f132' }
    },

    f132: {
      scene: S('den', 'doorway', DEN_BARK,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'stars', 'skyriver', 'zzz']),
      board: 'WIDE CLOSING SHOT, FROM INSIDE THE DEN. Our cat sleeps curled in its moss nest with its Case File along the edge, both forepaws tucked under its chin, and through the doorway the Sky River shines over the rosebush and the sleeping camp. One tiny contented zzz. Caption at the bottom, with END OF CHAPTER SIX lettered like a title.',
      caption: [
        'You sleep warm in your nest, with six claw marks on the tree and the Sky River shining over the rosebush.',
        'End of Chapter Six.'
      ],
      end: true
    }
  };

  // The frames are written by section above; the chapter lists every frame in id order (f022a, f022b,
  // f023…), the reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* The lines the sets share. */
  function T(text) { return { who: 'tallyheart', text: text }; }
  // the two quick lines (the story's): “You didn't even have to hop” is chapter 4's, and not today's
  var QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
  var NINES_HELP = 'Close. Let’s scratch it out together: hop by tens, then tuck one in for every cat.';
  var HOP = 'Close. Let’s hop it together.';
  // Every 3s set but Sleet's is Tallyheart's, in patrols of three cats: the generic question is “Five
  // patrols. How many cats?”
  var PATROLS = { table: 3, thing: 'cat', things: 'cats', unit: 'patrol', units: 'patrols', teacher: 'tallyheart', ask: '{a} × {b}' };
  // the story questions that borrow from the lesson: a borrowed pair is asked and drawn as the borrowing
  // question's own (on the same patrols, in the same voice), the easiest first
  var BORROW = { fillFrom: 'ch06-threes', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower' };
  // a lesson question that steps off the one before: its own miss lines (and on a last miss the first two sentences)
  function step(made, next) {
    return { miss: made + '. One more hop: ' + next + '. We’ll come back to that one.', missLast: made + '. One more hop: ' + next + '.' };
  }
  // ReedClan's watchers: nine cats in their own marsh coats, three patrols, never two of one coat side by side
  function r(n) { return { who: 'reedclan', variant: n }; }
  var REED9 = [r(3), r(1), r(4), r(2), r(3), r(1), r(4), r(2), r(3)];

  PC.story.ch06 = {
    id: 'ch06',
    number: 6,
    title: 'The Snake in the Stones',
    start: 'f001',
    // the two she meets today, until each is named (a lesson's lines read these too: Sleet's riddle,
    // its help, its fillers and its retry)
    names: { coil: 'The snake', sleet: 'The silver-white dragon' },

    // Her Case File: the three cards this chapter can give, in the order she can get them. A card's
    // picture is its own id (app/art/cards.js). ReedClan's lies touching chapter 4's `tidy` from the
    // moment she holds both (two piles, both left tidy); Sleet's is shown only once his scene is finished;
    // Coil's goes under the moss in her nest on every path (the den's `hidden`).
    cards: {
      'reed-pile': { mark: 'ear', line: 'Sloshbank says ReedClan’s pile is robbed too, and left tidy.',
        link: { with: ['tidy'], line: 'Two piles. Both left tidy.' } },
      // given at the last post; her file shows it only once that scene is finished
      'sleet-den': { mark: 'ear', line: 'Sleet says the fox talks about ‘a fine, dry den’.', when: { foundSleet: true } },
      'coil-diggers': { mark: 'ear', line: 'Coil says small diggers come and go under our pile.' }
    },

    frames: ordered,

    counts: {
      // The pile, one question, its own Counts moment: the morning count. The three front rows she walks
      // along, lit a row at a time, with no number shown. No praise: the gap answers. A miss is scratched
      // in the earth, ten marks a row, and borrows the two easiest tens on the pile's own rows (never four
      // or five full rows: the pile has three).
      'ch06-pile': {
        table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
        picture: { kind: 'prey', layout: 'rows' },
        facts: [{ a: 3, b: 10, light: 'rows', check: true,
          prompt: [{ kind: 'caption', text: 'Three full rows of ten. How many pieces?' }], retryPrompt: true }],
        ask: '{a} × {b}', praise: [], ground: 'earth',
        helpIntro: 'Let’s scratch it out: ten marks for every row.',
        helpIntroNotTen: 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.',
        fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower',
        avoid: [[4, 10], [5, 10]], fillIntro: 'An easy one.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        again: ['There it is. You remembered that one.'], done: null
      },

      // The warm-up on the 9s, in the Hollow: two questions, with chapter 5's hop and tuck. The first is the
      // hard slot (warmHard, at 0): the 9s fact she found hardest in chapter 5, and 7 × 9 when nothing was;
      // never 3 × 9 (asked anyway, second), nor 2 × 9 or 9 × 10, whose timed answers can be older chapters'
      // (the line says “Yesterday”). 3 × 9 is the rim's three cats, in her words. Fillers are chapter 5's
      // nines, in chapter 5's words: “One from yesterday.” Nobody says “last”.
      'ch06-nines': {
        table: 9, thing: 'life', things: 'lives', unit: 'cat', units: 'cats', teacher: 'tallyheart', light: 'tuck',
        facts: [[7, 9], { a: 3, b: 9, who: RIM.slice(0, 3), prompt: 'Three cats, nine lives each. How many lives?',
          retryPrompt: true, right: [T('Twenty-seven! Hop, then tuck.')], rightAgain: true }],
        warmHard: { table: 9, at: 0, avoid: [[3, 9], [2, 9], [9, 10]] }, avoid: [[3, 9]],
        fillFrom: 'ch05-nines', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
        ask: '{a} × {b}', praise: ['Yes! Nine lives on every cat.', 'Tens, with a claw tucked in. That’s all a nine is.'],
        fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the scratches that time.'],
        helpIntro: NINES_HELP, helpIntroFar: NINES_HELP.replace(/^Close\.\s*/, ''),
        helpIntroTens: 'That’s the hop! Now the tuck: one claw in for every cat.',
        helpIntroOneTuck: 'So close! You tucked ONE claw. Tuck one in for every cat.',
        helpIntroNotNine: 'Remember: the two numbers in a nines answer make nine. Let’s scratch it out together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
      },

      // Four patrols on the path (one question, before the lesson): she may count every cat, which makes
      // the hop worth having. A miss hops the sand 3, 6, 9, 12 and borrows the lesson's easiest (one patrol,
      // then two), asked on the same path. The question is Tallyheart's balloon; the frame has the caption.
      'ch06-four': merge(merge(PATROLS, BORROW), {
        facts: [{ a: 4, b: 3, prompt: 'How many cats in four patrols?', retryPrompt: true,
          right: [T('Twelve! Now let’s hop. It’s quicker.')], rightAgain: true }],
        praise: [], helpIntro: HOP, helpIntroFar: 'Let’s hop it together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', done: null
      }),

      // The lesson: the 3s, patrols, ten facts in both orders. She already knows half the threes: 1 × 3,
      // 3 × 2 and 3 × 5 are stepping stones; seven are new (3 × 3, 6 × 3, 7 × 3, 3 × 8, 3 × 4, 3 × 7,
      // 8 × 3), each new one stepping off one she has just done (its made patrols already lit: `lit`) or
      // turning round one she has typed today. Twins are three places apart, so a missed one comes back
      // before its twin. 8 × 3 is a check: a quick right answer there, straight after a missed 3 × 8's
      // retry, never hides that miss from chapter 7. The 3s' own Count (the Hollow's “Patrols · the 3s”).
      'ch06-threes': merge(PATROLS, {
        label: 'Patrols', hollowThings: 'threes', fillOrder: 'easiest',
        facts: [
          { a: 1, b: 3, right: [T('Three! One patrol, one hop.')], rightAgain: true },
          merge({ a: 3, b: 2, lit: 3, prompt: 'Two patrols. One patrol made three. Hop three more.', retryPrompt: true,
            right: [T('Six! You’ve known that one since your second day.')], rightAgain: true }, step('One patrol made three', 'six')),
          merge({ a: 3, b: 3, lit: 6, prompt: 'Three patrols. Two patrols made six. Hop three more.', retryPrompt: true,
            right: [T('Nine! That’s a new one.')], rightAgain: true }, step('Two patrols made six', 'nine')),
          { a: 3, b: 5, right: [T('Fifteen! Like the claws.')], rightAgain: true },
          merge({ a: 6, b: 3, lit: 15, prompt: 'Six patrols. Five patrols made fifteen. Hop three more.', retryPrompt: true }, step('Five patrols made fifteen', 'eighteen')),
          merge({ a: 7, b: 3, lit: 18, prompt: 'Seven patrols. Six patrols made eighteen. Hop three more.', retryPrompt: true }, step('Six patrols made eighteen', 'twenty-one')),
          merge({ a: 3, b: 8, lit: 21, prompt: 'Eight patrols. Seven patrols made twenty-one. Hop three more.', retryPrompt: true }, step('Seven patrols made twenty-one', 'twenty-four')),
          { a: 3, b: 4, prompt: 'Four patrols? You did that one already.', retryPrompt: true,
            right: [T('Twelve! Same fact, turned round.')], rightAgain: true },
          { a: 3, b: 7, prompt: 'Seven patrols? You did that one the other way round.', retryPrompt: true,
            right: [T('Twenty-one! Same fact.')], rightAgain: true },
          { a: 8, b: 3, check: true, right: [T('Twenty-four! Same fact.')], rightAgain: true }
        ],
        praise: ['Hop, hop, hop!', 'Three more, every time!', 'You hopped it!'],
        fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
        helpIntro: HOP, helpIntroFar: 'Let’s hop it together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.',
        done: 'That’s the threes.'
      }),

      // ReedClan's watchers, at the border: three patrols of three, in ReedClan's own coats (the set's
      // `who`, so a borrowed pair wears them too). Help in the earth at the end of the wall. Her “NINE?”
      // and his answer are the right lines, on the retry too.
      'ch06-watchers': merge(merge(PATROLS, BORROW), {
        who: REED9,
        facts: [{ a: 3, b: 3, prompt: [{ kind: 'caption', text: 'How many ReedClan cats watched you?' }], retryPrompt: true,
          right: [{ who: 'player', text: 'NINE? I only saw three!' }, { who: 'sloshbank', text: 'That is the point of reeds.' }], rightAgain: true }],
        ground: 'earth', praise: [], helpIntro: HOP, helpIntroFar: 'Let’s hop it together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', done: null
      }),

      // Sleet's riddle (optional): his roll call, seven little dragonets with three HERE!s over every head.
      // A miss lights the HEREs a dragonet at a time as she hops (her own count, nothing scratched); he
      // lends “A smaller roll call!” (never more dragonets than the clutch) and asks again in his words.
      'ch06-sleet': merge(BORROW, {
        table: 3, thing: 'HERE', things: 'HEREs', unit: 'dragonet', units: 'dragonets', teacher: 'sleet', ask: '{a} × {b}',
        picture: { kind: 'roll' },
        facts: [{ a: 7, b: 3, prompt: [{ kind: 'caption', text: 'How many times does Mama hear HERE?' }],
          retryPrompt: 'Seven of us, three HEREs each. How many HEREs?',
          right: [{ who: 'sleet', text: 'TWENTY-ONE! You pass. Not past the post!' }], rightAgain: true }],
        help: 'picture', helpCounter: 'you', helpIntro: 'Count every HERE! Hop by threes.',
        avoid: [[7, 3]], againIntro: 'My roll call AGAIN!', fillIntro: 'A smaller roll call!',
        praise: [], again: ['You pass!'],
        miss: 'There! I’ll ask you AGAIN in a minute.', missLast: 'There!', done: null
      }),

      // The guards, at sunset: six patrols of three, CrystalClan's own. Help in the earth beside the pile;
      // the old tom has the right line.
      'ch06-guards': merge(merge(PATROLS, BORROW), {
        facts: [{ a: 3, b: 6, prompt: [{ kind: 'caption', text: 'How many guards?' }], retryPrompt: true,
          right: [{ who: 'grizzled', text: 'Eighteen!' }], rightAgain: true }],
        ground: 'earth', praise: [], helpIntro: HOP, helpIntroFar: 'Let’s hop it together.',
        miss: 'There. We’ll come back to that one.', missLast: 'There. Now you’ve seen it counted.', done: null
      })
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'The Snake in the Stones',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: '{name}paw’s dream that night was as quiet as the first watch.',
      // A page says “found” only for a dragonet found in this chapter: Sleet's line reads `foundSleet`
      // (only this chapter offers him). Nothing here depends on told or kept, and nothing solves the case.
      recap: [
        { text: 'On {name}paw’s fifth morning, the old tom was asleep on his pinecone, and twenty pieces were gone in five nights.' },
        { text: 'Tallyheart taught {name}paw {their} sixth Count, patrols: the threes.' },
        { text: 'On {their} first border patrol, {name}paw met Sloshbank of ReedClan, whose pile is robbed too, and left tidy.' },
        { when: { foundSleet: true }, text: 'At the last post of the Barking Field, {name}paw found Sleet, the eldest dragonet, spying on the fox. Sleet heard the fox talk about a fine, dry den.' },
        { text: 'Under the Old Bridge, Coil the snake traded a secret for some quiet: small diggers come and go under the pile every night.' },
        { text: 'At sunset, Tallyheart counted out eighteen guards, six patrols of three. On the first watch, nothing happened at all.' },
        { text: 'That night {name}paw dreamed of a starry cat on the Sky River, who told {them} to count what’s missing, and then ask who was there to see it.' }
      ],
      // the fifth of the seven dragonets' pages: only for a cat who has found him
      dragonet: [
        { id: 'sleet', name: 'Sleet', when: { foundSleet: true }, pose: 'puff',
          lines: [
            'Silver-white, the eldest, and in charge of EVERYBODY. He does the roll call.',
            '{name}paw found him at the last post of the Barking Field, spying on the fox from the long grass.',
            'He says five, and that he’s in charge. Five more claws, counted.'
          ] }
      ]
    },

    teaser: {
      title: 'Chapter 7: The Counts Don’t Lie',
      lines: [
        'Tomorrow, your sixth morning count, after a night of guards.',
        'Will the pile still add up?'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
