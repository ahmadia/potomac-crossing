/* Chapter 9: Featherlight.
 *
 * The story (docs/chapters/09-featherlight.md, Draft v0.4, final) cut into graphic-novel panels,
 * per the frame contract in docs/build.md; its spec (docs/chapters/09-featherlight.spec.md, v0.2)
 * is the build's contract for the two flags, the Counts sets, the card, the art, the pages she taps
 * and the book. Each frame is one moment: a drawn scene, a written storyboard (`board`) for a future
 * illustrator, short captions, speech balloons and sound effects (no caption here runs on into its
 * sound, so no frame needs `sfxRead`), and exactly one interaction. Frame ids run in reading order,
 * the order of the story's screens, f001 to f140 with no letters (no choice here has outcome panels
 * of its own). The optional scenes are numbered where they sit, ahead of the screen they rejoin:
 *   the oak            “Climb up to the hollow.” (read “Go and see Mizzle again.” by a cat who has
 *                      found her: `labelWhen`, chapter 8's way with the log) turns to Mizzle's scene
 *                      (f045–f055); “Ask the elder which moss.” to the elder's screen (f044), which
 *                      leads straight on past it; both meet at “You gather the soft silver moss.” (f056);
 *   the roar           at the tower (f062, for a cat who has never met Squall, with `else` to its twin
 *                      f063 for a cat who knows him): “Go up and find Sprinkle’s littlest brother.” turns
 *                      to chapter 4's roof scene, its own frames run again by `roof()` (f066–f079, by
 *                      first light); “Just the dew today.” to the twin, passed over, and on to the little
 *                      room (f064, f065), which leads straight on past the roof; both meet at the dew (f080).
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line of narration that
 * follows a balloon on one screen of the story opens the next panel, or the panel is split in two (the
 * spec's build notes list the screens where the order matters), and no panel holds five boxes. A line
 * the story marks [if …] carries a `when`. A speaker's lines on a panel are one balloon: where the story
 * gives a speaker a second paragraph only some cats read (Riffle's Hail line under the bridge, Mizzle's
 * five after her nap line, our cat's Mizzle line at the case), the balloon is written twice with
 * opposite `when`s, the longer one holding both paragraphs, so a reader sees one balloon of theirs; only
 * Glintstar's ruling and her promise are two balloons in a row (the spec's "her two balloons"). A scene
 * cannot vary by flag, so where the picture differs (the first panel under the Old Bridge, with the told
 * path's branch; the dew, with Squall at his pole or only his tail tip behind it) the panel is two frames,
 * one after the other, with opposite `when`s.
 *   ch3Told       told: Riffle at the hedge (f006–f009), the first panel under the bridge (f089, with
 *                 the branch), “This is Thymeleaf,” (f094) and its caption (f095); kept: “Too big to
 *                 carry” (f010–f014), the kept caption at the wall (f030), the kept panel under the
 *                 bridge (f090) and Sprinkle hiding (f092, f093); Tallyheart's openings to Glintstar (f121)
 *   specialty     f003 (noticing: no new prints), f034/f035 (friends: “Thank you, Sloshbank!”), the
 *                 practice (f102 noticing, f103 climbing, f104 sneaking, f105 friends, f107/f108 swimming)
 *   worry         f038 (water), f040 (small), f082–f084 (shiny), f129 (talk)
 *   foundSquall   the roar (f062/f063), the dew (f080–f086), the remedy (f091, f098)
 *   ch9Roof       the dew (f080, f082, f083)
 *   foundHail     f007 (told: Riffle's list), f097 (his five), f098
 *   foundMizzle   the oak's label (f043), f097 (her five), f098, the case (f119)
 *   found before  any dragonet: f013 (kept: the others, name by name), f055 (Mizzle's “I’ve found more of you!”)
 *   ch2Stone      f132 (her stone)
 *   lessonClean   f029 (the ninth mark's two pairs of lines)
 * Two flags are set by reaching a frame, for good: `foundMizzle` on Mizzle's last screen (f055, the
 * leaf Tap), and `foundSquall` with `ch9Roof` on the roof copy's last frame (f079, chapter 4's forepaw
 * Tap). No choice sets anything.
 *
 * The start frame always shows (E.checkStory): the story opens on a screen both paths read (“At
 * sunrise, the whole Clan is waiting by the pile.”), so it is the start, and there is no title panel.
 *
 * Speakers: Thymeleaf is “Thymeleaf” from his first balloon (Tallyheart has just said his name);
 * GroveClan's elder is labelled by her variant (“A GroveClan elder”), and the apprentice never speaks;
 * Mizzle is “The sleepy dragonet” (the chapter's `names`) until “I’m Mizzle.” (f049), her riddle
 * included. The roof copy is chapter 4's: Squall is “The little dragon” (the chapter's `names`, as
 * chapter 5's) until “I’m Squall”, and his balloons carry `name` from there on, as they do on the dew
 * for a cat who knows him; for a cat who has never met him he is only his tail tip behind the red light,
 * “A voice” (f081). Coil is “Coil” (chapter 7's call); the grey tom is the snoring apprentice.
 *
 * Staging calls the spec left open, or that its spots could not hold (each looked at in a render):
 * under the Old Bridge Thymeleaf sits at Sprinkle's chest, between our cat and her (a spot of his own,
 * MENDER): at the bridge's `beside` he sat right behind Tallyheart across the nook, only his ears showing;
 * the sneaking cat's quiet landing is at the bank's `watch-4`, since at `run-2` Sprinkle's `flat` head
 * covered her; Sprinkle lifts facing her friends, so her tail never sweeps over their faces; on the
 * little bridge Tallyheart is at `near-1` and our cat at `near-2` (the other way round hid our cat in
 * Tallyheart's chest); the tree close-up is empty when the ninth mark is scratched (a stretching cat's
 * forepaws covered it, as the nest owner found). From the review (2026-10-26): while Sprinkle's wings are
 * open under the bridge (f095 to f100, one move) Tallyheart sits by the wall facing in (chapter 7's spot for
 * her open wings, BY_WALL), since across the nook she sat in front of the hurt wing, the rub Tap's target,
 * and those frames keep the lettering off the drooping wing (`wing: true`, chapter 7's); Thymeleaf sits a
 * little nearer the front (MENDER_LOW) where her peek or her claws came down to his head (f093, f095);
 * Riffle flops on his back a little in from the hedge's edge (FLOP), so his face stays in the panel (f007).
 * The art draws a layer's cast in the order it is listed, never by depth, so where two cats meet the one
 * further back is listed first (the README's “Casts are listed back to front”: f037, f039, f040, and f112,
 * Charlie's chapter 8 bug), and the one the `motion` streaks trail is listed first (f114: Sprinkle; f106's glide
 * draws its own speed lines, and its streaks, which ran behind our cat, are gone).
 * The book's entries are one sentence each, so every path reads 7 to 10 sentences (the spec's proposal ran
 * to 15 with both optional scenes).
 *
 * Text conventions: second person, present tense (“you”); typographic apostrophes and quotes (’ “ ” …)
 * so nothing needs escaping. Time of day comes from fx. Day 9: `morning` at the pile, behind it, in
 * Thymeleaf's den and in the Hollow; `day` at the ReedClan border and in GroveClan's woods; `sunset` at
 * the wall's end on the way home. Day 10: `morning` at the tower, on the roof (the copy's every frame
 * too) and back in Thymeleaf's den; `day` under the Old Bridge and on its sunny bank. Then `dusk` at the
 * pile for the montage (the twelfth evening's moon, `moon: 12`), `day` on the bank on the last day, and
 * `night` in the den on evening 13 (the case, Glintstar, bedtime; `moon: 13` where the sky shows).
 * tests/story-ch09.test.js checks all of this; tools/storyboard.mjs turns it into docs/storyboard/ch09.md.
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
  function fid(n) { return 'f' + ('00' + n).slice(-3); }

  /* The five cats on the hollow's rim, left to right (chapters 5 to 8's), sitting up. In the `lesson`
   * camera the cats at `sand-left` and `sand-right` sit right in front of `rim-2` and `rim-4`, so
   * `close` leaves those two out. Nobody leaves the rim in this chapter. */
  function rim(close) {
    var out = [c('clancat', 'situp', 'proud', 'rim-1', 'right', { variant: 1 })];
    if (!close) out.push(c('murmurchime', 'situp', 'happy', 'rim-2', 'right'));
    out.push(c('clancat', 'situp', 'neutral', 'rim-3', 'left', { variant: 3 }));
    if (!close) out.push(c('clancat', 'situp', 'proud', 'rim-4', 'left', { variant: 5 }));
    out.push(c('grizzled', 'situp', 'stern', 'rim-5', 'left'));
    return out;
  }

  // Scene options that stay the same through a place
  // The ninth morning's pile: four rows of ten, every one whole, the “scale” on the bare earth behind it;
  // the back row a dark band in the brambles' shadow until she walks round to it, then the dug earth heaped
  // behind and, round the back, the tunnel's mouth left open (`tunnel: true`), as proof
  var ROWS = [10, 10, 10, 10];
  var PILE_SHADE = { rows: ROWS, back: 'shadow', scale: 'behind', tap: 'back' };
  var PILE = { rows: ROWS, scale: 'behind', dug: 'big' };
  var REAR = merge(PILE, { tunnel: true });
  // and at dusk on the montage, the twelfth evening's moon
  var MONTAGE = merge(PILE, { moon: 12 });
  // our cat close beside Tallyheart behind the pile (chapter 8's spot on `rear`, beside `rear-2`), for her
  // secret: her tail curls round her (a caption), and the whisper
  var NOSE = { x: 860, y: 960, h: 380 };
  // Riffle at the hedge's edge (chapter 8's spot on `rear`, well clear of `rear-2`)
  var HEDGE = { x: 1430, y: 962, h: 380 };
  // and Riffle flopped on his back there (`fall`), a little in from the edge, so his face stays in the panel
  var FLOP = { x: 1360, y: 962, h: 360 };
  // Tallyheart under the Old Bridge: across the nook (chapters 6 to 8's told spot), on both paths now; and
  // Thymeleaf with the remedy at Sprinkle's chest, between our cat and her (a spot of his own: at the
  // bridge's `beside` he sat right behind Tallyheart across the nook, only his ears showing)
  var ACROSS = { x: 1250, y: 900, h: 330 };
  var MENDER = { x: 820, y: 905, h: 290 };
  // (where Sprinkle's head or claws come down to his: her `peek` (f093), his `crouch` at her open wings (f095),
  // he sits a little nearer the front, so his head is clear of her snout and her claws)
  var MENDER_LOW = { x: 820, y: 965, h: 290 };
  // Tallyheart by the wall, facing in (chapter 7's spot for Sprinkle's open wings), while Sprinkle's wings are open
  // (f095 to f100): across the nook she sat in front of the hurt wing, the rub Tap's target
  var BY_WALL = { x: 300, y: 960, h: 330 };
  // the tree: eight marks until Tallyheart scratches the ninth (f028), nine from then on
  var H8 = { marks: 8, glow: 'auto' };
  var H9 = { marks: 9, glow: 'auto' };
  // the tower at first light, its windows lit; the roar from the roof; the little room's DING
  var TOWER = { chime: true, light: true };
  var ROAR = merge(TOWER, { roar: true });
  var DING = { chime: true, ding: true };
  // the roof at first light: the rain puddle silver with dew; without Squall in sight, an airplane high over it
  var DEW = { dew: true };
  var DEW_PLANE = { dew: true, plane: true };
  // the Old Bridge: Sprinkle's big prints in the mud and the stone leg; the told path's first panel has
  // Tallyheart's branch over her nook (chapter 4's rule)
  var BACK = { prints: true, stones: true };
  // and while her wings are open, the lettering keeps off the drooping one (chapter 7's `wing: true`)
  var WINGS = merge(BACK, { wing: true });
  // the sunny bank at the bridge's foot: the bright shallows and the sand, the reeds standing again
  var BANK = { shallows: true, drag: false };
  // The den on evening 13: the case laid out on the floor (`case`), her glass in its leaf beside the rows
  // but while it is in her paws; then bedtime, her glass and secret bark back under the moss, and the
  // thirteenth evening's moon, nearly round, in the doorway's patch of sky
  var CASE = { weather: 'clear', stone: 'auto', bark: 'auto', glass: true, read: 0 };
  var CASE7 = merge(CASE, { read: 7 });
  var CASE7_LEAF = merge(CASE7, { glass: false });
  var DEN_GLASS = { weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true, glass: true };
  var DEN_MOON = merge(DEN_GLASS, { moon: 13 });
  // the told path and the kept path; the dragonets she has met; the specialties and worries the story reads
  var TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
  var SQUALL = { foundSquall: true }, NO_SQUALL = { foundSquall: false };
  var HAIL = { foundHail: true }, NO_HAIL = { not: { foundHail: true } };
  var MIZZLE = { foundMizzle: true }, NO_MIZZLE = { not: { foundMizzle: true } };
  var NOTICING = { specialty: 'noticing' }, FRIENDS = { specialty: 'friends' };
  var SHINY = { worry: 'shiny' };
  // any dragonet she has found before: not all five still unfound (E.matches' `not`)
  var FOUND_ONE = { not: { foundSquall: false, foundPuddle: false, foundWisp: false, foundSleet: false, foundHail: false } };
  var NONE_FOUND = { foundSquall: false, foundPuddle: false, foundWisp: false, foundSleet: false, foundHail: false };
  // a dragonet whose “five” reaches Sprinkle under the bridge today
  var FIVE_ONE = { not: { foundSquall: false, foundHail: false, foundMizzle: false } };
  // the herbs: Thymeleaf among his leaves, our cat and Tallyheart, and the little spider in her web
  function herbs(thymeleaf, player, tallyheart, spider) {
    return [c('thymeleaf', thymeleaf[0], thymeleaf[1], 'herbs-1', thymeleaf[2] || 'right', thymeleaf[3]),
      c('player', player[0], player[1], 'herbs-2', 'left', player[2]),
      c('tallyheart', tallyheart[0], tallyheart[1], 'herbs-3', 'left', tallyheart[2]),
      c('spider', spider || 'spin', 'happy', 'web', 'left')];
  }
  // under the Old Bridge: our cat, Sprinkle in her nook, Thymeleaf at her chest with the remedy in its leaf (at
  // MENDER, or the spot given), Tallyheart across the nook (listed after Sprinkle, so she is drawn over the tail),
  // or by the wall facing in (BY_WALL, while Sprinkle's wings are open)
  function bridge(sprinkle, player, thymeleaf, tallyheart, more) {
    return [c('sprinkle', sprinkle[0], sprinkle[1], 'dragon', 'left', sprinkle[2]),
      c('player', player[0], player[1], 'back-left', 'right', player[2]),
      c('thymeleaf', thymeleaf[0], thymeleaf[1], thymeleaf[3] || MENDER, 'right', merge({ holds: 'leaf' }, thymeleaf[2] || {})),
      c('tallyheart', tallyheart[0], tallyheart[1], tallyheart[2] || ACROSS, tallyheart[2] === BY_WALL ? 'right' : 'left')].concat(more || []);
  }
  // the sunny bank: our cat and Riffle watching from the bank's edge, side by side
  function watchers(player, riffle) {
    return [c('player', player[0], player[1], 'watch-1', 'right', player[2]), c('riffle', riffle[0], riffle[1], 'watch-2', 'right')];
  }
  // GroveClan's two: the elder stepping out between the trunks, the apprentice peeking from the fern behind her
  function grove(elder, apprentice) {
    var out = [c('groveclan', elder[0], elder[1], 'elder', 'left', { variant: 1 })];
    if (apprentice) out.push(c('groveclan', apprentice[0], apprentice[1], 'fern', 'left', { variant: 2 }));
    return out;
  }
  // the case: our cat at the rows' near left, Tallyheart across them
  function caseCats(player, tallyheart, more) {
    return [c('player', player[0], player[1], 'case-1', 'right', player[2]), c('tallyheart', tallyheart[0], tallyheart[1], 'case-2', 'left')].concat(more || []);
  }

  var frames = {

    /* ------------------------------------------------------------------ All forty */

    f001: {
      // the eighth morning count, said and not asked (the brief's call 2): the walk round the back is its Tap
      scene: S('pile', 'rows', PILE_SHADE,
        [c('clancat', 'sit', 'wonder', 'crowd-2', 'right', { variant: 3 }), c('clancat', 'sit', 'neutral', 'crowd-1', 'right', { variant: 4 }),
         c('clancat', 'sit', 'neutral', 'pile-left', 'right', { variant: 2 }), c('glintstar', 'sit', 'solemn', 'crowd-3', 'left'),
         c('tallyheart', 'sit', 'solemn', 'pile-right', 'left'), c('player', 'stand', 'wonder', 'beside', 'left')], ['morning']),
      board: 'WIDE, FROM THE FRONT, SUNRISE, THE TAP PICTURE. The whole Clan waits round the prey pile in the first gold light, four rows of ten, and the back row is only a dark band in the brambles’ shadow; Glintstar sits silver and still at the right and asks for the count, Tallyheart beside her. In play the shadowed back row glows softly; one tap walks our cat round to it and turns the page. Caption top left; her balloon level.',
      caption: ['At sunrise, the whole Clan is waiting by the pile.'],
      say: [{ who: 'glintstar', text: '{name}paw. The count, please.' }],
      scratch: { tap: 'back', prompt: '**Tap** to walk round the back.', label: 'Walk round the back.', next: 'f002' }
    },

    f002: {
      scene: S('pile', 'gap', PILE,
        [c('player', 'crouch', 'proud', 'pile-left', 'right')], ['morning']),
      board: 'MEDIUM, THE BACK ROW. Out of the shadow now, the back row: ten pieces in a tidy line, every place in its middle filled, and behind them the old heap of dug earth with nothing new on it. Our cat crouches before the row and says it flatly, as a counter does, then lets itself smile. Caption top left; its balloon three short lines.',
      caption: ['The middle of the back row: no gaps.'],
      say: [{ who: 'player', text: 'Forty. All forty. Not one piece gone.' }],
      next: 'f003'
    },

    f003: {
      // the noticing cat's line opens a panel of its own: nose to the earth
      when: NOTICING,
      scene: S('pile', 'gap', PILE,
        [c('player', 'crouch', 'sniff', 'pile-left', 'right')], ['morning']),
      board: 'CLOSE-UP, THE BACK ROW, A NOTICING CAT ONLY. Our cat has its nose right down at the earth behind the row, sniff lines curling up, and finds the old dug heap dry and crumbly with not one fresh scrape and not one new tiny print in it. Its whiskers are forward and its eyes half shut to think. One caption at the top.',
      caption: ['No new dug earth. No new tiny prints.'],
      next: 'f004'
    },

    f004: {
      scene: S('pile', 'wide', PILE,
        [c('glintstar', 'stand', 'kind', 'fountain-edge', 'left'), c('player', 'sit', 'proud', 'pile-left', 'right'),
         c('clancat', 'sit', 'happy', 'beside', 'left', { variant: 2 }), c('clancat', 'sit', 'shout', 'crowd-2', 'left', { variant: 4 }),
         c('grizzled', 'sit', 'proud', 'crowd-3', 'left', { holds: 'pinecone', holdAt: 'paws' })], ['morning']),
      board: 'WIDE, COMEDY BEAT. The guards sit up cheering round the whole pile, and at the front the old tom lifts his pinecone in both paws as proud as if he had guarded it all by himself; Glintstar on the fountain’s edge smiles. Our cat sits up straight at the end of the rows. Caption top left; his balloon a boast.',
      caption: ['The guards cheer.'],
      say: [{ who: 'grizzled', text: 'It was my PINECONE.' }],
      next: 'f005'
    },

    f005: {
      // round the back by morning: the roots lifted and the tunnel's mouth left open, as proof
      scene: S('pile', 'rear', REAR,
        [c('player', 'sit', 'wonder', 'rear-1', 'right'), c('tallyheart', 'sit', 'sleepy', 'rear-2', 'left')], ['morning']),
      board: 'MEDIUM, AT CAT HEIGHT, ROUND THE BACK, MORNING. Behind the back row the roots are still lifted and the round mouth of the weasels’ tunnel lies open in the dug earth in the morning light; Tallyheart sits beside it with a huge yawn, her eyes heavy after a night on watch, and our cat leans in to hear. Caption top left; her balloon a sleepy whisper.',
      caption: ['Behind the pile, Tallyheart yawns.'],
      say: [{ who: 'tallyheart', text: 'I sat by their tunnel all night. Not one weasel came up it. We leave it open, for the Gathering. It’s proof.', kind: 'whisper' }],
      next: 'f006'
    },

    /* ------------------------------------------------------------------ Every bit (told) */

    f006: {
      when: TOLD,
      scene: S('pile', 'rear', REAR,
        [c('player', 'sit', 'wonder', 'rear-1', 'right'), c('tallyheart', 'sit', 'sleepy', 'rear-2', 'left'),
         c('riffle', 'stand', 'happy', HEDGE, 'left', { tap: 'ears' })], ['morning']),
      board: 'MEDIUM, ROUND THE BACK, THE TOLD PATH ONLY, THE TAP PICTURE. A wet otter nose pushes through the hedge at the right edge of the panel, and Riffle stands there dripping and bursting with questions, his small round ears pricked; Tallyheart blinks at him sleepily beside the tunnel’s mouth. In play his ears glow softly; one tap tells him every bit and turns the page. Caption top left; his balloon a loud whisper.',
      caption: ['A wet nose pokes through the hedge. Riffle!'],
      say: [{ who: 'riffle', text: 'Psst! Granny says the dogs barked half the night. Something HAPPENED. Tell me EVERY bit!', kind: 'whisper' }],
      scratch: { tap: 'ears', prompt: '**Tap** to tell him EVERY bit.', label: 'Tell Riffle every bit.', next: 'f007' }
    },

    f007: {
      when: TOLD,
      scene: S('pile', 'rear', REAR,
        [c('player', 'sit', 'proud', 'rear-1', 'right'), c('tallyheart', 'sit', 'happy', 'rear-2', 'left'),
         c('riffle', 'fall', 'shout', FLOP, 'left')], ['morning']),
      board: 'MEDIUM, ROUND THE BACK, THE TOLD PATH ONLY, COMEDY BEAT. Riffle hears the whole night trail and flops flat on his back by the hedge, paws in the air, tail flung out; a row of small insets floats over our cat like a list: a tunnel, two weasels, a fox, a stash, a heap of glass. Tallyheart grins. Captions top left; his balloon a wail.',
      caption: [
        'The tunnel. The weasels. The fox. The stash. The glass.',
        { when: HAIL, text: 'And Hail, in her log.' },
        'Riffle flops onto his back.'
      ],
      say: [
        { who: 'riffle', text: 'WEASELS? A FOX? A heap of GLASS? And I was ASLEEP?', kind: 'shout', when: NO_HAIL },
        { who: 'riffle', text: 'WEASELS? A FOX? A heap of GLASS? A dragon who thinks she’s a DOG? And I was ASLEEP?', kind: 'shout', when: HAIL }
      ],
      next: 'f008'
    },

    f008: {
      when: TOLD,
      scene: S('pile', 'rear', REAR,
        [c('player', 'sit', 'happy', 'rear-1', 'right'), c('tallyheart', 'sit', 'happy', 'rear-2', 'left'),
         c('riffle', 'scramble', 'happy', HEDGE, 'right')], ['morning']),
      board: 'MEDIUM, ROUND THE BACK, THE TOLD PATH ONLY, COMEDY BEAT. Riffle is already back on all fours and diving for the hedge, tail last, with the news, his shout flying out behind him; our cat and Tallyheart watch him go. Motion lines trail behind his tail. His balloon a shout.',
      say: [{ who: 'riffle', text: 'I’m telling Sprinkle!', kind: 'shout' }],
      next: 'f009'
    },

    f009: {
      when: TOLD,
      scene: S('pile', 'rear', REAR,
        [c('player', 'sit', 'happy', 'rear-1', 'right'), c('tallyheart', 'sit', 'kind', 'rear-2', 'left')], ['morning']),
      board: 'MEDIUM, ROUND THE BACK, THE TOLD PATH ONLY, COMEDY BEAT. The hedge at the right edge of the panel is still swinging where an otter went through it, a few leaves fluttering down, and nobody is there at all. Our cat and Tallyheart look at each other across the tunnel’s mouth. One caption at the top.',
      caption: ['And he’s gone.'],
      next: 'f010'
    },

    /* ------------------------------------------------------------------ Too big to carry (kept) */

    f010: {
      when: KEPT,
      scene: S('pile', 'rear', REAR,
        [c('player', 'sit', 'shy', 'rear-1', 'right'), c('tallyheart', 'sit', 'sleepy', 'rear-2', 'left')], ['morning']),
      board: 'MEDIUM, ROUND THE BACK, THE KEPT PATH ONLY. Our cat sits very still by the tunnel’s mouth with its ears low, and a thought bubble over its head holds Sprinkle under the Old Bridge with one crumpled wing, the bubble swelling bigger and bigger. Tallyheart, sleepy beside the hole, has not noticed yet. Captions top left.',
      caption: ['Sprinkle still can’t fly, and a hurt wing needs a medicine cat.', 'Your secret is getting bigger.'],
      next: 'f011'
    },

    f011: {
      when: KEPT,
      scene: S('pile', 'rear', REAR,
        [c('player', 'sit', 'shy', 'rear-1', 'right'), c('tallyheart', 'sit', 'kind', 'rear-2', 'left')], ['morning']),
      board: 'MEDIUM, ROUND THE BACK, THE KEPT PATH ONLY. Our cat lifts its head and says her name, small and brave, and Tallyheart is wide awake at once, turning her whole big ginger self toward it with her torn ear tipped close. The tunnel’s mouth lies open between them. Two balloons, our cat’s small, hers warm.',
      say: [
        { who: 'player', text: 'Tallyheart? My secret is too big to carry by myself.' },
        { who: 'tallyheart', text: 'I’m right here.' }
      ],
      next: 'f012'
    },

    f012: {
      // close beside her (chapter 8's spot), her tail round her a caption: the whisper is Tallyheart's ear
      when: KEPT,
      scene: S('pile', 'rear', REAR,
        [c('tallyheart', 'sit', 'kind', 'rear-2', 'left', { tap: 'ears' }), c('player', 'sit', 'happy', NOSE, 'right')], ['morning']),
      board: 'MEDIUM TWO-SHOT, ROUND THE BACK, THE KEPT PATH ONLY, THE TAP PICTURE. Our cat has come close beside Tallyheart, and her long ginger tail curls round it, warm as a blanket; she bends her torn ear down to listen. In play her ears glow softly; one tap whispers the secret into them and turns the page. Caption top left; her balloon soft.',
      caption: ['Her tail curls round you.'],
      say: [{ who: 'tallyheart', text: 'I always was.' }],
      scratch: { tap: 'ears', prompt: '**Tap** to whisper it.', label: 'Whisper it.', next: 'f013' }
    },

    f013: {
      when: KEPT,
      scene: S('pile', 'rear', REAR,
        [c('tallyheart', 'sit', 'wonder', 'rear-2', 'left'), c('player', 'sit', 'solemn', NOSE, 'right')], ['morning']),
      board: 'MEDIUM TWO-SHOT, ROUND THE BACK, THE KEPT PATH ONLY. Our cat whispers on into Tallyheart’s ear, and a small inset shows what it tells: a misty dragonet curled in a nook under the Old Bridge, one wing crumpled, with a row of small dragon silhouettes beside her for a cat who has met others. Tallyheart’s eyes go round. Captions top left.',
      caption: [
        'The last of it: the dragonets. Sprinkle, under the Old Bridge, with her hurt wing.',
        { when: FOUND_ONE, text: 'Then the others you’ve found, name by name.' }
      ],
      next: 'f014'
    },

    f014: {
      when: KEPT,
      scene: S('pile', 'rear', REAR,
        [c('tallyheart', 'sit', 'kind', 'rear-2', 'left'), c('player', 'sit', 'shy', NOSE, 'right')], ['morning']),
      board: 'MEDIUM TWO-SHOT, ROUND THE BACK, THE KEPT PATH ONLY. Tallyheart is not cross at all: she sniffs our cat’s fur with a slow, knowing smile, as if a fishy puzzle had just come out, and our cat peeks up at her, hardly daring to ask. Then she touches her nose to its ear. Three balloons, hers warm, our cat’s tiny.',
      say: [
        { who: 'tallyheart', text: 'I knew there was something under that moss. So THAT’S why you smell of fish.' },
        { who: 'player', text: 'You’re not angry?' },
        { who: 'tallyheart', text: 'Angry? You fed a hungry friend. Thank you for telling me.' }
      ],
      next: 'f015'
    },

    f015: {
      // both paths: Tallyheart walks off, her tail up, and her tail is the Tap
      scene: S('pile', 'rear', REAR,
        [c('player', 'stand', 'happy', 'rear-1', 'right'), c('tallyheart', 'walk', 'proud', 'rear-2', 'right', { tailUp: true, tap: 'tail' })], ['morning']),
      board: 'MEDIUM, ROUND THE BACK, THE TAP PICTURE. Tallyheart is on her feet and already padding off toward the camp, her tail straight up like a flag to follow, and calls back over her shoulder with a new job in her voice; our cat jumps up behind her. In play her raised tail glows softly; one tap follows her and turns the page. Her balloon brisk.',
      say: [{ who: 'tallyheart', text: 'We know who took the prey. Now we mend a friend. Whatever the Clans decide, Sprinkle needs her wings by the full moon. Come and meet Thymeleaf, our medicine cat.' }],
      scratch: { tap: 'tail', prompt: '**Tap** to follow Tallyheart.', label: 'Follow Tallyheart.', next: 'f016' }
    },

    /* ------------------------------------------------------------------ Thymeleaf */

    f016: {
      // his den: a camera of the camp (`herbs`); he talks to his leaves, his back to the visitors
      scene: S('camp', 'herbs', {},
        herbs(['sit', 'kind', 'left'], ['sit', 'wonder'], ['sit', 'happy']), ['morning']),
      board: 'WIDE, THYMELEAF’S DEN, MORNING. A nook of the bramble dens hung with a curtain of drying leaves, bunches upside down along the canes and leaves laid out on a ledge of stones, all green and gold in the morning light; an old oatmeal-grey tom with long white whiskers and a sprig of mint behind his ear sits murmuring to a bunch of leaves. A tiny spider spins in her web in the top corner. Captions top left; his balloon soft.',
      caption: ['At the edge of the camp hangs a curtain of drying leaves. It smells of mint.', 'Inside, a twinkly-eyed tom is talking to his leaves.'],
      say: [{ who: 'thymeleaf', text: 'There, there. You’ll be dry by sunset.' }],
      next: 'f017'
    },

    f017: {
      scene: S('camp', 'herbs', {},
        herbs(['sit', 'happy'], ['sit', 'wonder'], ['sit', 'happy']), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN. The old tom turns round with his green-gold eyes twinkling and greets his visitors as if they were the best surprise of the morning. Our cat sits very politely on its tail. His balloon cheerful.',
      say: [{ who: 'thymeleaf', text: 'Tallyheart! And the apprentice who counts things. Careful of my leaves. They’re shy.' }],
      next: 'f018'
    },

    f018: {
      scene: S('camp', 'herbs', {},
        herbs(['sit', 'wonder'], ['sit', 'worried'], ['stand', 'solemn']), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN. Tallyheart stands and talks low and long, and a small inset over her shows it all: the Old Bridge, a misty dragonet, one crumpled wing. The old tom’s ears go straight up and his bushy brows lift. Captions top left.',
      caption: ['Tallyheart tells him everything.', 'Thymeleaf’s ears go up.'],
      next: 'f019'
    },

    f019: {
      // his four things: an ask whose asker answers himself, two balloons of his a tap (the spec's call 11)
      scene: S('camp', 'herbs', {},
        herbs(['pawup', 'kind', 'right', { glow: true }], ['sit', 'wonder'], ['sit', 'happy']), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN, THE TAP PICTURE. The old tom raises one white forepaw with its claws out, ready to count off four things, glowing softly with the plan of a remedy; four small insets wait in a row above him, empty. In play each tap on him letters the next thing and why, two balloons of his, root, moss, mint and dew; after the fourth the page turns. His balloon warm and sure.',
      say: [{ who: 'thymeleaf', text: 'A wing is a wing. I’ll make her a remedy: wing medicine. I need four things, one from every corner of the river.' }],
      ask: {
        who: 'thymeleaf', to: 'thymeleaf', prompt: '**Tap** his claws.', label: 'Hear the next thing.',
        pairs: [
          ['Reed root, from ReedClan.', 'It holds it all together.'],
          ['Oak moss, from GroveClan.', 'It calms the hurt.'],
          ['River mint, from the otters’ Holt.', 'It cools.'],
          ['And dew from the glass towers,', 'gathered high up at first light.']
        ],
        next: 'f020'
      }
    },

    f020: {
      scene: S('camp', 'herbs', {},
        herbs(['sit', 'happy'], ['sit', 'proud'], ['sit', 'kind']), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN. Our cat sits bolt upright at the word towers, its chest puffed out, and a small inset shows the tallest glass tower with its red light; Tallyheart answers for the otters with a nod, and a second inset shows a round otter holt in a riverbank. Two balloons, our cat’s proud, hers brisk.',
      say: [
        { who: 'player', text: 'The towers? That’s MY corner!' },
        { who: 'tallyheart', text: 'And the Holt is Riffle’s. I’ll send word.' }
      ],
      next: 'f021'
    },

    f021: {
      scene: S('camp', 'herbs', {},
        herbs(['sit', 'kind'], ['sit', 'worried'], ['sit', 'solemn']), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN. The old tom counts on his white toes, everything in eights, calm as a pond, while our cat’s eyes go wide at the size of the sum; a small inset shows a moon not yet round. He answers with a twinkle. Three balloons, his slow, our cat’s worried, his again.',
      say: [
        { who: 'thymeleaf', text: 'Good. Everything goes in eights. Eight drops of dew a day. Eight days, if a wing is stubborn.' },
        { who: 'player', text: 'But the full moon is in five days!' },
        { who: 'thymeleaf', text: 'Then we’d better hurry.' }
      ],
      next: 'f022'
    },

    f022: {
      // the spider's two sides: the first tap lights the four legs on one side, the second the other four
      scene: S('camp', 'herbs', {},
        herbs(['sit', 'happy'], ['sit', 'happy'], ['sit', 'happy'], 'wave'), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN, THE TAP PICTURE. In the top corner of the den a tiny round garden spider stops spinning and waves one front leg at our cat, friendly as anything, and our cat waves a paw back. In play the counting picture takes the panel: one smiling spider close up, four legs on each side, the first side glowing; one tap lights it and puts 4 in our cat’s balloon, the next lights the other side, 8, and turns the page. Captions top left.',
      caption: ['In a corner of the den, a tiny spider stops spinning and waves a leg at you.', 'You wave back.'],
      skip: { table: 4, groups: 2, who: [{ who: 'spider' }], thing: 'leg', things: 'legs', teacher: 'player', label: 'Count the next four legs.', prompt: '**Tap** her legs.', next: 'f023' }
    },

    f023: {
      scene: S('camp', 'herbs', {},
        herbs(['sit', 'happy'], ['sit', 'happy'], ['sit', 'proud'], 'wave'), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN. A big 8 floats over the panel, and the spider in her web is still waving; Tallyheart points out her two sides with her nose, and our cat bounces where it sits, remembering yesterday’s paws. Three balloons, hers plain, our cat’s an excited squeak, hers again pleased.',
      say: [
        { who: 'tallyheart', text: 'Eight legs. Four on each side. An eight is two fours.' },
        { who: 'player', text: 'Two fours! Like a four is two twos!' },
        { who: 'tallyheart', text: 'Exactly. Doubling, AGAIN. That’s today’s Count.' }
      ],
      next: 'f024'
    },

    /* ------------------------------------------------------------------ Spiders’ legs */

    f024: {
      // the warm-up's hard pick comes first, so none of these lines is said again over it (`intro: false`)
      scene: S('hollow', 'wide', H8,
        rim().concat([c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'happy', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THEN THE COUNTS. The sandy Training Hollow in the morning sun, eight claw marks on the leaning tree, and five cats sitting up on the rim; Tallyheart waits past the tree and our cat sits ready in the sun patch. In the Counts picture cats stand side-on, four paws each, none lit; after a miss she hops the sand by fours, two and two. Caption top left; the keypad sits below the panel.',
      caption: ['In the Training Hollow, five cats sit up on the rim.'],
      say: [{ who: 'tallyheart', text: 'Fours first, to wake up your whiskers.' }],
      counts: { set: 'ch09-fours', intro: false, next: 'f025' }
    },

    f025: {
      // five spiders: the counting picture draws the lesson's spiders (the spec's section 7, item 10)
      scene: S('hollow', 'sand', H8,
        [c('tallyheart', 'crouch', 'solemn', 'sand-left', 'right', { claws: true }), c('player', 'crouch', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'CLOSE-UP, ON THE SAND, THE TAP PICTURE. Tallyheart crouches over the smooth sand, claws out on one forepaw, scratching five little spiders in a row, a round body and four legs on each side, and our cat crouches nose down across from her. In play the counting picture takes the panel: five smiling spiders, the first glowing; each tap lights her eight legs, four and four, and a big number over them grows by eight, 8, 16, 24, 32, 40. Caption top left; her balloon short.',
      caption: ['In the sand, Tallyheart scratches five little spiders, four legs on each side.'],
      say: [{ who: 'tallyheart', text: 'Hop by eights.' }],
      skip: { table: 8, groups: 5, thing: 'leg', things: 'legs', teacher: 'tallyheart', label: 'Count the next spider’s legs.', prompt: '**Tap** the spiders.', carry: false, next: 'f026' }
    },

    f026: {
      // Tallyheart's eight Counts: eight taps that count nothing; each letters her question and our cat's answer
      scene: S('hollow', 'wide', H8,
        rim().concat([c('tallyheart', 'sit', 'happy', 'tree-far', 'left', { size: 1.2, glow: true }), c('player', 'sit', 'wonder', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE, THE TAP PICTURE. Tallyheart sits past the leaning tree with its eight claw marks plain on the trunk, glowing softly with a secret, while the rim cats lean in; our cat sits bolt upright in the sun patch with its mouth open. In play each tap on her letters her next Count in her balloon and our cat’s answer in its own, the eights it already knows, one for every mark; after the eighth the page turns. Her balloon low; our cat’s a squeak.',
      say: [
        { who: 'tallyheart', text: 'Forty! Now, a secret. You already know most of the eights. One from every mark on this tree.' },
        { who: 'player', text: 'AGAIN?', kind: 'shout' }
      ],
      ask: {
        who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
        pairs: [
          ['Tails?', 'Eight cats, eight tails!'],
          ['Ears?', 'Eight cats, sixteen ears!'],
          ['Claws?', 'Eight forepaws, forty claws!'],
          ['Both forepaws?', 'Eight cats, eighty claws!'],
          ['Nine lives?', 'Eight cats, seventy-two lives!'],
          ['Patrols?', 'Eight patrols, twenty-four guards!'],
          ['Whiskers?', 'Eight cheeks, forty-eight whiskers!'],
          ['Paws?', 'Eight cats, thirty-two paws. That was YESTERDAY!']
        ],
        next: 'f027'
      }
    },

    f027: {
      // her balloon is read on the frame and not again (`intro: false`): 2 × 8's own line is the first question's
      scene: S('hollow', 'lesson', H8,
        rim(true).concat([c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')]), ['morning']),
      board: 'MEDIUM TWO-SHOT, THEN THE COUNTS. Tallyheart sweeps the sand smooth between them for the two new ones and nods at one side of a spider, then the other. In the Counts picture that many smiling spiders sit in tidy rows of five, four legs on each side, none lit; after a miss she scratches eight marks for every spider, four and four, and hops them by eights. Her balloon warm; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Only two are new. Seven spiders, and eight spiders. For those, count one side, and double it!' }],
      counts: { set: 'ch09-eights', intro: false, next: 'f028' }
    },

    f028: {
      // the tree close-up with nobody in it (chapters 6 to 8's): a stretching cat's forepaws would cover the ninth mark
      scene: S('hollow', 'tree', H9, [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score a ninth claw mark into the bark under the other eight; the marks stand four, four and one now, the older ones deeper and darker than the new one. The SKRITCH! runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'A ninth claw mark.'],
      sfx: 'SKRITCH!',
      next: 'f029'
    },

    f029: {
      // in the wide view, where the nine marks show
      scene: S('hollow', 'wide', H9,
        rim().concat([c('tallyheart', 'sit', 'proud', 'tree-far', 'left', { size: 1.2 }), c('player', 'sit', 'proud', 'sunpatch-2', 'right')]), ['morning']),
      board: 'WIDE. Nine claw marks on the leaning tree now, and Tallyheart sitting past the trunk with her torn ear tipped across the Hollow toward our cat, the rim cats nodding along. A cat who never needed the sand says it with a bounce, and Tallyheart tops it; a cat who did says it plainly, and Tallyheart answers it warmly. Her balloons warm; our cat’s sure of itself.',
      say: [
        { who: 'tallyheart', text: 'Spiders’ legs. That’s your ninth Count.' },
        { who: 'player', text: 'Not one miss!', when: { lessonClean: 'ch09-eights' } },
        { who: 'tallyheart', text: 'Not ONE. Even the spiders are impressed.', when: { lessonClean: 'ch09-eights' } },
        { who: 'player', text: 'Some were tricky.', when: { not: { lessonClean: 'ch09-eights' } } },
        { who: 'tallyheart', text: 'You never gave up. Tricky gets easy. Like flying.', when: { not: { lessonClean: 'ch09-eights' } } }
      ],
      next: 'f030'
    },

    /* ------------------------------------------------------------------ Reed root */

    f030: {
      // the call and the rustle, nobody in the reeds (one sound a frame)
      scene: S('title', 'end', { rustle: true },
        [c('tallyheart', 'stand', 'solemn', 'end-2', 'right'), c('player', 'stand', 'wonder', 'end-1', 'right')], ['day']),
      board: 'WIDE, THE BORDER. The old wall’s stones step down and stop, and past the last of them the tall reeds begin, the river beyond; Tallyheart and our cat stand on the dry ground at the wall’s end, and Tallyheart calls out across the line. Among the reeds something moves, and rustle lines tremble over the stems. Captions top left, the second for the kept path; her balloon a call.',
      caption: [
        'Along the old stone wall you go, with Tallyheart, to its end.',
        { when: KEPT, text: 'Last night she said, “Next time, you take ME.” This time, you do.' }
      ],
      say: [{ who: 'tallyheart', text: 'ReedClan!', kind: 'shout' }],
      sfx: 'Rustle.',
      next: 'f031'
    },

    f031: {
      scene: S('title', 'end', {},
        [c('tallyheart', 'stand', 'solemn', 'end-2', 'right'), c('player', 'stand', 'wonder', 'end-1', 'right'),
         c('sloshbank', 'stand', 'stern', 'reed-1', 'left')], ['day']),
      board: 'WIDE, THE BORDER. Out of the reeds steps one huge stern brown tom, mud to the elbows, and stops on his own side of the line, water dripping off his belly fur; the two CrystalClan cats wait on the dry ground. Nobody else comes out. Caption top left; the drip lettered small by his belly.',
      caption: ['Out steps Sloshbank.'],
      sfx: 'Drip.',
      next: 'f032'
    },

    f032: {
      // the light choice: both to the next screen, no outcome panel, nothing set
      scene: S('title', 'meet', {},
        [c('sloshbank', 'stand', 'stern', 'reed-1', 'left'), c('tallyheart', 'sit', 'solemn', 'end-2', 'right'),
         c('player', 'sit', 'wonder', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, THE CHOICE. Tallyheart sits down slowly and politely at the line and asks, and the big brown tom looks down his nose at the word CrystalClan as if he had smelled it; our cat looks from one to the other. Two balloons, hers plain, his heavy; the choices sit below the panel.',
      say: [
        { who: 'tallyheart', text: 'We need reed root. For a remedy.' },
        { who: 'sloshbank', text: 'For a CrystalClan remedy?' }
      ],
      choice: {
        options: [
          { label: '“For a friend who’s hurt.”', sets: {}, next: 'f033' },
          { label: 'Dip your head, very politely.', sets: {}, next: 'f033' }
        ]
      }
    },

    f033: {
      scene: S('title', 'meet', {},
        [c('sloshbank', 'sit', 'stern', 'reed-1', 'left'), c('tallyheart', 'sit', 'solemn', 'end-2', 'right'),
         c('player', 'sit', 'shy', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT. The big brown tom sits and looks at our cat for a long, long time, one more drop falling from his belly fur, and a small inset shows the little apprentice at this same border who once asked him a fair question. Then his heavy brows lift a little. Caption top left; the drip lettered small; his balloon slow.',
      caption: ['He looks at you for a long time.'],
      say: [{ who: 'sloshbank', text: 'You asked a fair question, once. ReedClan will think about it.' }],
      sfx: 'Drip.',
      next: 'f034'
    },

    f034: {
      when: FRIENDS,
      scene: S('title', 'meet', {},
        [c('sloshbank', 'sit', 'stern', 'reed-1', 'left'), c('tallyheart', 'sit', 'solemn', 'end-2', 'right'),
         c('player', 'stand', 'happy', 'end-1', 'right')], ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, A FRIENDLY CAT ONLY. Our cat bounces up onto its toes on the dry side of the line and thanks him with its whole face, much too warmly for a border; the big brown tom does not move a whisker. Tallyheart hides a smile. Our cat’s balloon bright.',
      say: [{ who: 'player', text: 'Thank you, Sloshbank!' }],
      next: 'f035'
    },

    f035: {
      when: FRIENDS,
      scene: S('title', 'meet', {},
        [c('sloshbank', 'sit', 'kind', 'reed-1', 'left'), c('tallyheart', 'sit', 'kind', 'end-2', 'right'),
         c('player', 'stand', 'happy', 'end-1', 'right')], ['day']),
      board: 'CLOSE-UP, A FRIENDLY CAT ONLY. The big brown tom’s face, stern as ever, but one ear gives a single small twitch and the corner of his mouth almost lifts. Behind him the reeds stand tall and still. One caption at the top.',
      caption: ['His ear twitches. Almost a smile.'],
      next: 'f036'
    },

    f036: {
      scene: S('title', 'end', { rustle: true },
        [c('tallyheart', 'stand', 'kind', 'end-2', 'right'), c('player', 'stand', 'wonder', 'end-1', 'right')], ['day']),
      board: 'WIDE, THE BORDER. The reeds have swallowed the big brown tom again, and only their rustling stems show where he went; Tallyheart and our cat stand on the dry ground at the wall’s end, looking at the line. Not one CrystalClan paw is on the mud. One caption at the top.',
      caption: ['The reeds close behind him.'],
      next: 'f037'
    },

    /* ------------------------------------------------------------------ GroveClan. Riffle carries his mint
     * on every grove frame up to the roll Tap; from “Thank you.” on it is in her leaf with the moss. */

    f037: {
      scene: S('grove', 'bridge', {},
        [c('player', 'stand', 'wonder', 'near-2', 'right'), c('tallyheart', 'stand', 'kind', 'near-1', 'right'),
         c('riffle', 'stand', 'happy', 'span-2', 'left', { holds: 'mint' })], ['day']),
      board: 'WIDE, THE LITTLE BRIDGE. Down the river path a little old footbridge with low stone sides crosses a narrow channel of clear, bright water, and on its far side the very old trees of the woods begin; Riffle stands on the bridge hugging a bunch of mint as big as his head. Our cat and Tallyheart come up at the near end. Captions top left; his balloon proud.',
      caption: ['Down the river path, a little bridge crosses a narrow channel.', 'Riffle is waiting on it, with a bunch of mint as big as his head.'],
      say: [{ who: 'riffle', text: 'Granny says it’s the BEST mint. She says that about everything.' }],
      next: 'f038'
    },

    f038: {
      scene: S('grove', 'bridge', {},
        [c('tallyheart', 'stand', 'kind', 'near-1', 'right'), c('player', 'walk', 'wonder', 'span-1', 'right', { tap: 'paw' }),
         c('riffle', 'stand', 'happy', 'span-2', 'left', { holds: 'mint' })], ['day']),
      board: 'WIDE, THE LITTLE BRIDGE, THE TAP PICTURE. Our cat steps onto the footbridge one careful paw at a time, the clear water sparkling far below the low stone side, and Riffle waits ahead with his mint; Tallyheart follows at the near end. In play its lifted front paw glows softly; one tap carries it over and turns the page. Caption top left, for a cat who worries about water.',
      caption: [{ when: { worry: 'water' }, text: 'The water is down THERE. You are up HERE. One paw at a time.' }],
      scratch: { tap: 'paw', prompt: '**Tap** to cross.', label: 'Cross the bridge.', next: 'f039' }
    },

    f039: {
      // the visitors wait at the bridge's end to be asked in
      scene: S('grove', 'wide', {},
        [c('player', 'sit', 'wonder', 'edge-1', 'right'), c('riffle', 'sit', 'happy', 'edge-3', 'right', { holds: 'mint' }),
         c('tallyheart', 'sit', 'solemn', 'edge-2', 'right')], ['day']),
      board: 'WIDE, GROVECLAN’S WOODS, THE BRIGHT AFTERNOON. Over the bridge the trees rise enormous across the whole panel, trunks wider than a den, roots like arms, ferns and dappled green-gold light on soft ground; the three visitors sit very small at the bridge’s end, waiting. Tallyheart leans down to whisper. Caption top left; her balloon a whisper.',
      caption: ['Over the bridge, the trees are very, very old.'],
      say: [{ who: 'tallyheart', text: 'GroveClan’s woods. The oldest Clan. We wait here to be asked in. Best manners.', kind: 'whisper' }],
      next: 'f040'
    },

    f040: {
      scene: S('grove', 'wide', {},
        [c('player', 'sit', 'wonder', 'edge-1', 'right'), c('riffle', 'sit', 'happy', 'edge-3', 'right', { holds: 'mint' }),
         c('tallyheart', 'sit', 'solemn', 'edge-2', 'right')].concat(grove(['stand', 'kind'], ['sit', 'shy'])), ['day']),
      board: 'WIDE, GROVECLAN’S WOODS. Out from between two huge trunks pads an upright old she-cat with a dappled grey-brown coat and a white muzzle, and behind her a small dappled apprentice peeks out of a fern, all eyes; the three visitors at the bridge’s end sit up straight. Captions top left, the first for a cat who worries about being small; her balloon one word.',
      caption: [{ when: { worry: 'small' }, text: 'Next to these trees, EVERYBODY is small.' }, 'Out pads a GroveClan elder with a white muzzle.'],
      say: [{ who: 'groveclan', text: 'CrystalClan.' }],
      next: 'f041'
    },

    f041: {
      // an action beat inside her quote: it opens this panel
      scene: S('grove', 'meet', {},
        [c('player', 'sit', 'wonder', 'meet-1', 'right'), c('tallyheart', 'sit', 'proud', 'meet-2', 'right'),
         c('riffle', 'sit', 'happy', 'meet-3', 'right', { holds: 'mint' })].concat(grove(['sit', 'happy'], ['sit', 'shy'])), ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, UNDER THE TREES. The old elder turns her sharp hazel eyes on Tallyheart and her whiskers twitch with a memory, and a small inset shows a tiny ginger apprentice at a Gathering, counting everybody out loud; Tallyheart gives a wry smile. Caption top left; the elder’s balloon dry, Tallyheart’s one word.',
      caption: ['She looks at Tallyheart.'],
      say: [
        { who: 'groveclan', text: 'I remember YOU. A little apprentice who counted EVERYTHING at the Gathering. Out loud.' },
        { who: 'tallyheart', text: 'Hmph.' }
      ],
      next: 'f042'
    },

    f042: {
      scene: S('grove', 'meet', {},
        [c('player', 'sit', 'kind', 'meet-1', 'right'), c('tallyheart', 'sit', 'kind', 'meet-2', 'right'),
         c('riffle', 'sit', 'happy', 'meet-3', 'right', { holds: 'mint' })].concat(grove(['sit', 'kind'], ['sit', 'shy'])), ['day']),
      board: 'MEDIUM, AT CAT HEIGHT, UNDER THE TREES. Our cat asks in its very best manners, paws together, and the old elder looks it up and down and gives one slow nod toward the woods behind her; the apprentice in the fern peeks out a little further. Two balloons, our cat’s polite, the elder’s short.',
      say: [
        { who: 'player', text: 'Please, may we have some oak moss? For a friend who’s hurt.' },
        { who: 'groveclan', text: 'You asked. Take what you need from the old oak.' }
      ],
      next: 'f043'
    },

    f043: {
      // the hollow is the optional scene: its first option read her way by a cat who has found Mizzle
      scene: S('grove', 'oak', {},
        [c('player', 'lookup', 'wonder', 'root-1', 'right'), c('tallyheart', 'sit', 'kind', 'root-2', 'right'),
         c('riffle', 'sit', 'happy', 'root-3', 'right', { holds: 'mint' })].concat(grove(['sit', 'proud'])), ['day']),
      board: 'WIDE, THE OLD OAK, THE CHOICE. An enormous old oak furry with moss, green, gold and grey, roots like arms at its foot, and high in its trunk a round hollow; our cat tips its head right back to look at it, while the elder talks on and on beside the oak. A tiny snore drifts out of the hollow. Captions top left; the snore lettered small by the hollow; the choices sit below the panel.',
      caption: ['The old oak is furry with moss: green, gold and grey.', 'High in the trunk is a hollow. Out of it comes a tiny snore.', 'The elder doesn’t hear it. She’s busy remembering.'],
      sfx: 'Zzz… snrk.',
      choice: {
        options: [
          { label: 'Climb up to the hollow.', labelWhen: [{ when: MIZZLE, label: 'Go and see Mizzle again.' }], sets: {}, next: 'f045' },
          { label: 'Ask the elder which moss.', sets: {}, next: 'f044' }
        ]
      }
    },

    f044: {
      // only after “Ask the elder which moss.”: she points at the north side, where the silver moss is
      scene: S('grove', 'oak', {},
        [c('player', 'sit', 'wonder', 'root-1', 'right'), c('tallyheart', 'sit', 'kind', 'root-2', 'right'),
         c('riffle', 'sit', 'happy', 'root-3', 'right', { holds: 'mint' })].concat(grove(['pawup', 'kind'])), ['day']),
      board: 'WIDE, THE OLD OAK, ONLY FOR A CAT WHO ASKS THE ELDER. The elder lifts one forepaw and points across the roots to the oak’s shaded north side, where low on the bark grows a soft patch of silver moss, paler than all the rest; our cat follows her paw with its eyes. Her balloon slow and pleased with itself.',
      say: [{ who: 'groveclan', text: 'The softest moss is the silver kind. On the north side, where the sun never looks. I remember that too.' }],
      next: 'f056'
    },

    /* ------------------------------------------------------------------ The hollow in the oak: f045…f055,
     * the optional scene. Tallyheart waits below with the elder, and no cat of GroveClan sees into the
     * hollow. Mizzle is “The sleepy dragonet” until “I’m Mizzle.” (f049), her riddle included; her last
     * screen (f055) sets `foundMizzle` for good, with the leaf Tap. */

    f045: {
      // up the trunk: a climber's stretch, and Riffle folding his paws (sitting proud: no otter pose folds its arms)
      scene: S('grove', 'oak', {},
        [c('player', 'stretch', 'happy', 'trunk', 'right'), c('riffle', 'sit', 'proud', 'root-2', 'right', { holds: 'mint' }),
         c('tallyheart', 'sit', 'kind', 'root-3', 'right')].concat(grove(['sit', 'neutral'])), ['day']),
      board: 'LOW ANGLE, THE OLD OAK. Our cat stretches up the mossy trunk toward the round hollow high above, claws in the soft green moss, and down among the roots Riffle sits back with his mint in his paws and his nose in the air, very much in charge; Tallyheart and the elder wait below. Captions top left; his balloon grand.',
      caption: ['Up you climb.', 'Below, Riffle folds his paws.'],
      say: [{ who: 'riffle', text: 'Otters don’t climb. Otters SUPERVISE.' }],
      next: 'f046'
    },

    f046: {
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'wonder', 'lip', 'right'), c('mizzle', 'curl', 'sleepy', 'nook', 'left', { asleep: true })], ['day', 'zzz']),
      board: 'MEDIUM, INSIDE THE HOLLOW. A snug round nook of old wood lined with soft moss, warm green-gold light coming in at the opening on the left, where our cat’s head and shoulders have just appeared; curled on the moss, tail round her nose, sleeps a little dragonet, pearly green with a soft pink-lilac shimmer. A small zzz rises from her. One caption at the top.',
      caption: ['In the hollow, curled on moss, is a little dragonet. She’s pearly green, and fast asleep.'],
      next: 'f047'
    },

    f047: {
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'happy', 'lip', 'right'), c('mizzle', 'yawn', 'sleepy', 'nook', 'left')], ['day']),
      board: 'MEDIUM, INSIDE THE HOLLOW. The little pearly dragonet lifts her head and opens one big sleepy lilac eye, then the other stays shut while she gives an enormous round yawn; our cat at the opening grins. The yawn is lettered long and wobbly. Caption top left; her balloons dreamy, our cat’s plain.',
      caption: ['One eye opens.'],
      say: [
        { who: 'mizzle', text: 'Oh. Hello. Are you a dream? You’re a very nice dream.' },
        { who: 'player', text: 'I’m a cat.' },
        { who: 'mizzle', text: 'Even nicer.' }
      ],
      sfx: 'Yaaawn.',
      next: 'f048'
    },

    f048: {
      // her riddle: its balloon is said again over the question (the default), the question its own words
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'wonder', 'lip', 'right'), c('mizzle', 'sit', 'sleepy', 'nook', 'left', { asleep: 'half' })], ['day']),
      board: 'MEDIUM, INSIDE THE HOLLOW, THEN THE COUNTS. The little dragonet sits up on her moss with her eyelids drooping and offers a sleepy riddle, nodding off halfway through it. In the Counts picture six little twigs stand side by side, eight acorns on each in two clusters of four, none lit; after a miss she wakes and they light a twig at a time as she hops by eights. Her balloon dreamy, the snore small; the keypad sits below the panel.',
      say: [{ who: 'mizzle', text: 'Want a sleepy question? When I can’t sleep, I count acorns. Eight on every twig. Six twigs.' }],
      sfx: 'Zzz.',
      counts: { set: 'ch09-mizzle', next: 'f049' }
    },

    f049: {
      // “I'm Mizzle.”: from this balloon on, her balloons carry her name
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'wonder', 'lip', 'right'), c('mizzle', 'sit', 'happy', 'nook', 'left')], ['day']),
      board: 'MEDIUM, INSIDE THE HOLLOW. The little dragonet introduces herself with a sleepy smile, and a small inset shows a big misty dragon far away saying something motherly; our cat leans in through the opening and asks the one question that matters. Her balloon soft; our cat’s careful.',
      say: [
        { who: 'mizzle', name: 'Mizzle', text: 'I’m Mizzle. Mama says stay where you land. So I’m napping.' },
        { who: 'player', text: 'Are you Sprinkle’s sister?' }
      ],
      next: 'f050'
    },

    f050: {
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'kind', 'lip', 'right'), c('mizzle', 'wake', 'worried', 'nook', 'left')], ['day']),
      board: 'MEDIUM, INSIDE THE HOLLOW. At her sister’s name the little dragonet’s eyes fly wide open for the first time, both of them, and her frills spring up; our cat answers her gently and plainly from the opening. Caption top left; her balloon a gasp, our cat’s calm.',
      caption: ['Both eyes open.'],
      say: [
        { who: 'mizzle', name: 'Mizzle', text: 'SPRINKLE? Is she safe?', kind: 'shout' },
        { who: 'player', text: 'She’s safe, under the Old Bridge. But her wing is hurt.' }
      ],
      next: 'f051'
    },

    f051: {
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'wonder', 'lip', 'right'), c('mizzle', 'wake', 'sad', 'nook', 'left')], ['day']),
      board: 'MEDIUM, INSIDE THE HOLLOW. The little dragonet tells it softly, and a small inset shows the storm night: a flash of lightning over the big bridge and a misty dragonet tumbling down out of the rain, one wing already crumpled. Our cat’s ears go straight up. Her balloon low.',
      say: [{ who: 'mizzle', name: 'Mizzle', text: 'I know. In the storm, in a flash of lightning, I saw her tumble down by the big bridge. Her wing was hurt already. Before the rain even stopped.' }],
      next: 'f052'
    },

    f052: {
      // her card: what she saw, given here (her file shows it once her scene is finished, `foundMizzle`)
      card: 'mizzle-wing',
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'proud', 'lip', 'right'), c('mizzle', 'sit', 'sleepy', 'nook', 'left')], ['day']),
      board: 'CLOSE-UP, OUR CAT AT THE OPENING. Our cat’s eyes are wide and sharp, and a thought bubble over its head holds a fox on the riverbank calling It FLEW, with a big cross through the word, beside a dragonet who cannot lift her wing. The little dragonet behind is already drowsing again. Captions in a column; the new card appears under the panel, an ear in its corner.',
      caption: ['The fox says the dragon FLEW off when the rain stopped.', 'With a hurt wing? She COULDN’T!'],
      next: 'f053'
    },

    f053: {
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'kind', 'lip', 'right'), c('mizzle', 'sit', 'sleepy', 'nook', 'left', { asleep: 'half' })], ['day']),
      board: 'MEDIUM, INSIDE THE HOLLOW. Our cat tells her the good news kindly, and a small inset shows an old grey tom mixing leaves on a flat stone; the little dragonet’s eyelids are sliding shut again, her head nodding toward her moss. Our cat’s balloon soft.',
      say: [{ who: 'player', text: 'We’re making her a remedy. With oak moss.' }],
      next: 'f054'
    },

    f054: {
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'wonder', 'lip', 'right'), c('mizzle', 'pawup', 'wonder', 'nook', 'left')], ['day']),
      board: 'MEDIUM, INSIDE THE HOLLOW. At the word moss the little dragonet sits bolt upright, wide awake for once, and points one claw out past the opening and down, toward the oak’s shaded north side; a small inset shows a patch of soft silver moss low on the bark. Caption top left; her balloon very sure.',
      caption: ['Mizzle sits up, wide awake for once.'],
      say: [{ who: 'mizzle', name: 'Mizzle', text: 'Then you need the RIGHT moss. Not the green. That’s for cats. The soft silver kind, on the north side. That’s for WINGS.' }],
      next: 'f055'
    },

    f055: {
      // her last screen: `foundMizzle`, for good, by reaching it; the leaf in our cat's paws is the Tap
      sets: { foundMizzle: true },
      scene: S('grove', 'hollow', {},
        [c('player', 'crouch', 'kind', 'lip', 'right', { holds: 'leaf', holdAt: 'paws', tap: 'leaf' }), c('mizzle', 'curl', 'sleepy', 'nook', 'left', { asleep: 'half' })], ['day']),
      board: 'MEDIUM, INSIDE THE HOLLOW, THE TAP PICTURE. The little dragonet curls back up on her moss with her tail round her nose, mumbling her message more and more slowly as she drifts off; our cat at the opening holds a big soft leaf in its paws. In play the leaf glows softly; one tap tucks it over her like a blanket and turns the page. Her balloon trailing off; the snore small.',
      say: [
        { who: 'player', text: 'I’ve found more of you!', when: FOUND_ONE },
        { who: 'mizzle', name: 'Mizzle', text: 'Mmm. Tell me… after my nap. Tell Sprinkle: five. And tell her I’m…', when: FOUND_ONE },
        { who: 'mizzle', name: 'Mizzle', text: 'Tell Sprinkle: five. And tell her I’m…', when: NONE_FOUND }
      ],
      sfx: 'Zzz.',
      scratch: { tap: 'leaf', prompt: '**Tap** to tuck a leaf over her.', label: 'Tuck a leaf over her.', next: 'f056' }
    },

    /* ------------------------------------------------------------------ the moss, every cat */

    f056: {
      scene: S('grove', 'oak', {},
        [c('tallyheart', 'sit', 'kind', 'root-1', 'right'), c('player', 'crouch', 'happy', 'moss', 'right', { holds: 'leaf', holdAt: 'paws', tap: 'leaf' }),
         c('riffle', 'sit', 'happy', 'root-3', 'right', { holds: 'mint' })].concat(grove(['sit', 'kind'])), ['day']),
      board: 'MEDIUM, THE OLD OAK, THE TAP PICTURE. Low on the oak’s shaded north side our cat crouches at the patch of soft silver moss and peels a piece of it gently into the big leaf at its paws; Tallyheart, Riffle and the elder watch from the roots. In play the leaf glows softly; one tap rolls the moss up in it and turns the page. One caption at the top.',
      caption: ['You gather the soft silver moss.'],
      scratch: { tap: 'leaf', prompt: '**Tap** to roll it in a leaf.', label: 'Roll the moss in a leaf.', next: 'f057' }
    },

    f057: {
      // her leaf holds the moss and Riffle's mint now: his paws are empty
      scene: S('grove', 'oak', {},
        [c('tallyheart', 'sit', 'kind', 'root-1', 'right'), c('riffle', 'sit', 'happy', 'root-2', 'right'),
         c('player', 'sit', 'kind', 'root-3', 'right', { holds: 'leaf', holdAt: 'paws' })].concat(grove(['sit', 'kind'])), ['day']),
      board: 'MEDIUM, THE OLD OAK. Our cat turns to the elder with the rolled leaf at its paws, the moss and Riffle’s mint tucked inside it together now, and thanks her; Riffle sits back with his paws empty and his job done. The elder dips her white muzzle. Our cat’s balloon warm.',
      say: [{ who: 'player', text: 'Thank you.' }],
      next: 'f058'
    },

    f058: {
      scene: S('grove', 'oak', {},
        [c('tallyheart', 'sit', 'happy', 'root-1', 'right'), c('riffle', 'sit', 'happy', 'root-2', 'right'),
         c('player', 'crouch', 'kind', 'root-3', 'left', { holds: 'leaf', holdAt: 'paws' })].concat(grove(['sit', 'happy'])), ['day']),
      board: 'MEDIUM, THE OLD OAK, COMEDY BEAT. Our cat turns round and dips its head, very politely, to the enormous mossy trunk itself, its leaf of moss and mint at its paws, and the old elder’s whiskers lift in a smile she cannot hide. Riffle copies the bow. Caption top left; her balloon dry and pleased.',
      caption: ['And, very politely, the oak.'],
      say: [{ who: 'groveclan', text: 'A polite one. I’ll remember you.' }],
      next: 'f059'
    },

    f059: {
      // on the way home at the wall's end, in the late gold: the root on the dry stones, and a wet pawprint
      scene: S('title', 'end', { root: true, tap: 'root' },
        [c('tallyheart', 'stand', 'kind', 'end-2', 'right'), c('player', 'stand', 'wonder', 'end-1', 'right', { holds: 'leaf' })], ['sunset']),
      board: 'WIDE, THE BORDER AT SUNSET. The old wall’s end in the late gold light, and across the last dry stones, short of the mud, lies a long pale reed root, with one dark wet pawprint on the stone beside it; somebody drips, unseen, in the reeds. Our cat and Tallyheart stop on the dry ground. In play the root glows softly; one tap tucks it into her leaf with the moss and turns the page. Captions top left; the drip lettered small in the reeds.',
      caption: ['On the way home, at the old wall’s end: a long, pale root on the dry stones.', 'And one wet pawprint.', 'In the reeds, somebody drips.', 'ReedClan thought about it.'],
      sfx: 'Drip.',
      scratch: { tap: 'root', prompt: '**Tap** to take the root.', label: 'Take the root.', next: 'f060' }
    },

    /* ------------------------------------------------------------------ First light */

    f060: {
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'shout', 'railing', 'left'), c('player', 'lookup', 'wonder', 'foot', 'right', { holds: 'leaf' })], ['morning']),
      board: 'LOW ANGLE, TALL PANEL, FIRST LIGHT. Straight up the glass tower before the sun is up, its windows lit, the morning sky pale: our cat at its foot with a leaf for the dew, head tipped right back, and nineteen floors up a fluffy white face pops over the railing, bow askew, wide awake. The red light blinks at the very top. Captions at the bottom; her squeal runs all the way down.',
      caption: ['Next morning, before the sun, you’re at your old tower with a leaf for the dew.', 'Up on her balcony, Waffles is already awake.'],
      say: [{ who: 'waffles', text: '{petname}! DARLING! At DAWN?', kind: 'shout' }],
      next: 'f061'
    },

    f061: {
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'happy', 'railing', 'left'), c('player', 'lookup', 'happy', 'foot', 'right', { holds: 'leaf' })], ['morning']),
      board: 'LOW ANGLE, TALL PANEL, COMEDY BEAT. The same view up the tower: our cat calls up through cupped paws, and Waffles throws back her head and announces her news to the whole sky, quivering with delight. The red light blinks at the very top. Two balloons, our cat’s a shout, hers grand.',
      say: [
        { who: 'player', text: 'I need dew from the roof!', kind: 'shout' },
        { who: 'waffles', text: 'I’m being USEFUL. How THRILLING.' }
      ],
      next: 'f062'
    },

    f062: {
      // the roof offered once more (chapter 4's scene, promised in chapter 5): only for a cat who has never met
      // Squall; a cat who knows him is turned to the twin (`else`). Going up leads to the roof copy, whose last
      // frame sets `foundSquall` and `ch9Roof`; “Just the dew today.” sets nothing
      when: NO_SQUALL, else: 'f063',
      scene: S('tower', 'up', ROAR,
        [c('waffles', 'peer', 'worried', 'railing', 'left'), c('player', 'lookup', 'wonder', 'foot', 'right', { holds: 'leaf' })], ['morning']),
      board: 'LOW ANGLE, TALL PANEL, ONLY FOR A CAT WHO HAS NEVER MET SQUALL, THE CHOICE. The same view up the tower at first light, and at the very top by the red light jagged roar lines shake the sky on both sides of the roof; Waffles ducks behind her railing, and our cat at the foot stares up. Caption at the top; the choices sit below the panel.',
      caption: ['From the roof comes a roar, and a tiny hiccup.'],
      choice: {
        options: [
          { label: 'Go up and find Sprinkle’s littlest brother.', sets: {}, next: 'f066' },
          { label: '“Just the dew today.”', sets: {}, next: 'f063' }
        ]
      }
    },

    f063: {
      when: SQUALL,
      scene: S('tower', 'up', ROAR,
        [c('waffles', 'peer', 'worried', 'railing', 'left'), c('player', 'lookup', 'happy', 'foot', 'right', { holds: 'leaf' })], ['morning']),
      board: 'LOW ANGLE, TALL PANEL, ONLY FOR A CAT WHO KNOWS SQUALL. The same view up the tower at first light, and at the very top by the red light jagged roar lines shake the sky on both sides of the roof; Waffles ducks behind her railing, and our cat at the foot grins up at a voice it knows. Caption at the top.',
      caption: ['From the roof comes a roar, and a tiny hiccup.'],
      next: 'f064'
    },

    /* ------------------------------------------------------------------ the little room (every cat who does not
     * go up to the roof scene): chapter 4's ride, its look up the tower */

    f064: {
      scene: S('tower', 'up', TOWER,
        [c('waffles', 'peer', 'shout', 'railing', 'left'), c('player', 'sit', 'happy', 'foot', 'right', { holds: 'leaf', holdAt: 'paws', tap: 'nose' })], ['morning']),
      board: 'LOW ANGLE, TALL PANEL, THE TAP PICTURE. The same view up the tower: Waffles leans far out over her railing with her bow dangling and shouts her directions all the way down, and our cat sits at the tower’s foot with its leaf at its paws, nose ready. In play its nose glows softly; one tap rides it up and turns the page. Her balloon a shout all the way down the glass.',
      say: [{ who: 'waffles', text: 'The little room that goes DING! It’s TERRIFYING. Press the top button, darling. With your NOSE.', kind: 'shout' }],
      scratch: { tap: 'nose', prompt: '**Tap** to ride up.', label: 'Ride up.', next: 'f065' }
    },

    f065: {
      // the art letters the small DING! at the very top itself (`ding: true`): no sound effect here
      scene: S('tower', 'up', DING,
        [c('waffles', 'peer', 'happy', 'railing', 'left')], ['morning']),
      board: 'LOW ANGLE, TALL PANEL. The same view up the tower in the first light, and nobody at its foot now: only Waffles at her railing, and a small DING! lettered at the very top beside the red light. No button, no doorway, no Tall One: the captions say how our cat got there. Captions at the bottom.',
      caption: ['The little room hums. Your tummy goes UP.', 'The roof!'],
      next: 'f080'
    },

    /* ------------------------------------------------------------------ The roof scene: f066…f079 are chapter
     * 4's frames, added below by roof(), by first light */

    /* ------------------------------------------------------------------ The dew: every dew frame is on the roof's
     * `two`, at first light, our cat crouched at the puddle's edge with her leaf. A pair by `foundSquall` (Squall
     * at his pole, or only his tail tip behind it), then the trailing captions, then the Counts frames, a pair. */

    f080: {
      when: SQUALL,
      scene: S('roof', 'two', DEW,
        [c('squall', 'roar', 'shout', 'pole', 'right'), c('player', 'crouch', 'wonder', 'puddle', 'right', { holds: 'leaf', holdAt: 'paws' })], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE ROOF AT FIRST LIGHT, ONLY FOR A CAT WHO KNOWS SQUALL. By the red light’s pole the rain puddle has turned silver with dew, tiny beads catching the low sun on the grit round it, and our cat crouches at its edge with its leaf; behind, the little slate dragonet throws back his head and roars hello. A tiny hiccup bounces him. Caption top left; his balloon huge; the hiccup small.',
      caption: ['By the red light, the rain puddle is silver with dew.'],
      say: [
        { who: 'squall', name: 'Squall', text: 'I’m still GUARDING! Tell Sprinkle: FIVE! LOUDLY!', kind: 'shout', when: { ch9Roof: false } },
        { who: 'squall', name: 'Squall', text: 'I’ll guard the dew!', kind: 'shout', when: { ch9Roof: true } }
      ],
      sfx: 'Hic!',
      next: 'f081'
    },

    f081: {
      // a cat who has never met him: only his tail tip behind the pole, and an airplane high over it ("A voice")
      when: NO_SQUALL,
      scene: S('roof', 'two', DEW_PLANE,
        [c('squall', 'hidden', 'shout', 'pole', 'right'), c('player', 'crouch', 'wonder', 'puddle', 'right', { holds: 'leaf', holdAt: 'paws' })], ['morning']),
      board: 'MEDIUM, THE ROOF AT FIRST LIGHT, ONLY FOR A CAT WHO HAS NEVER MET SQUALL. By the red light’s pole the rain puddle has turned silver with dew, and our cat crouches at its edge with its leaf; an airplane sweeps high over the roof, and from behind the pole comes a shout, with nothing of the shouter but a slate tail tip flecked with yellow and a little ring of hiccup mist. Captions top left; the balloon’s tail points behind the pole.',
      caption: ['By the red light, the rain puddle is silver with dew.', 'From behind the red light:'],
      say: [{ who: 'squall', name: 'A voice', text: 'AND STAY OUT, giant dragon!', kind: 'shout' }],
      sfx: 'Hic!',
      next: 'f082'
    },

    f082: {
      when: { foundSquall: true, ch9Roof: true },
      scene: S('roof', 'two', DEW,
        [c('squall', 'roar', 'shout', 'pole', 'right'), c('player', 'crouch', 'wonder', 'puddle', 'right', { holds: 'leaf', holdAt: 'paws' })], ['morning']),
      board: 'MEDIUM TWO-SHOT, ONLY FOR A CAT WHO MET SQUALL ON THE ROOF TODAY. The same silver puddle and the little dragonet roaring at his pole, and over our cat a small inset shows two long, low, skinny shapes, weasels, with a cross over them and nobody coming back. Our cat’s eyes are sharp. Captions top left, the second for a cat who loves shiny things.',
      caption: ['Two skinny shapes, he said. Now you know EXACTLY who they are. And they haven’t come back.', { when: SHINY, text: 'It sparkles. You don’t stare. Much.' }],
      next: 'f083'
    },

    f083: {
      when: { foundSquall: true, ch9Roof: false, worry: 'shiny' },
      scene: S('roof', 'two', DEW,
        [c('squall', 'roar', 'shout', 'pole', 'right'), c('player', 'crouch', 'wonder', 'puddle', 'right', { holds: 'leaf', holdAt: 'paws' })], ['morning']),
      board: 'MEDIUM TWO-SHOT, ONLY FOR A CAT WHO KNOWS SQUALL AND LOVES SHINY THINGS. The same silver puddle sparkling in the first sun, every bead of dew a tiny star, and our cat at its edge keeps its eyes politely on its leaf, mostly; the little dragonet roars on at his pole. One caption at the top.',
      caption: ['It sparkles. You don’t stare. Much.'],
      next: 'f084'
    },

    f084: {
      when: NO_SQUALL,
      scene: S('roof', 'two', DEW_PLANE,
        [c('squall', 'hidden', 'shout', 'pole', 'right'), c('player', 'crouch', 'wonder', 'puddle', 'right', { holds: 'leaf', holdAt: 'paws' })], ['morning']),
      board: 'MEDIUM, ONLY FOR A CAT WHO HAS NEVER MET SQUALL. The same silver puddle at first light, and at the foot of the red light’s pole the slate tail tip twitches importantly beside its ring of mist; our cat looks at it, amused, and keeps its own business at the puddle. Captions top left, the second for a cat who loves shiny things.',
      caption: ['Somebody small is busy guarding.', { when: SHINY, text: 'It sparkles. You don’t stare. Much.' }],
      next: 'f085'
    },

    f085: {
      when: SQUALL,
      scene: S('roof', 'two', DEW,
        [c('squall', 'roar', 'shout', 'pole', 'right'), c('player', 'crouch', 'wonder', 'puddle', 'right', { holds: 'leaf', holdAt: 'paws' })], ['morning']),
      board: 'MEDIUM TWO-SHOT, ONLY FOR A CAT WHO KNOWS SQUALL, THEN THE COUNTS. Our cat crouches over the silver puddle with its leaf, counting the dew it needs, while the little dragonet guards at his pole behind. In the Counts picture four rows of eight dewdrops shine, four and four in every row, none lit; after a miss they light a row at a time as our cat counts by eights. Caption top left; the keypad sits below the panel.',
      caption: ['Eight drops a day, for four days, to the full moon.'],
      counts: { set: 'ch09-dew', next: 'f086' }
    },

    f086: {
      when: NO_SQUALL,
      scene: S('roof', 'two', DEW_PLANE,
        [c('squall', 'hidden', 'shout', 'pole', 'right'), c('player', 'crouch', 'wonder', 'puddle', 'right', { holds: 'leaf', holdAt: 'paws' })], ['morning']),
      board: 'MEDIUM, ONLY FOR A CAT WHO HAS NEVER MET SQUALL, THEN THE COUNTS. Our cat crouches over the silver puddle with its leaf, counting the dew it needs, while a tail tip guards at the foot of the pole. In the Counts picture four rows of eight dewdrops shine, four and four in every row, none lit; after a miss they light a row at a time as our cat counts by eights. Caption top left; the keypad sits below the panel.',
      caption: ['Eight drops a day, for four days, to the full moon.'],
      counts: { set: 'ch09-dew', next: 'f087' }
    },

    /* ------------------------------------------------------------------ The remedy */

    f087: {
      scene: S('camp', 'herbs', { remedy: 'four' },
        herbs(['sit', 'proud'], ['sit', 'happy'], ['sit', 'kind']), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN, MORNING. On the flat mixing stone four things lie in a row in the green morning light, a long pale root, a roll of soft silver moss, a bunch of mint and a curled leaf of dew drops, and the old tom looks them over, very pleased; our cat and Tallyheart sit by, and the spider spins in her web. One caption at the top.',
      caption: ['In Thymeleaf’s den, four things lie in a row: root, moss, mint and dew.'],
      next: 'f088'
    },

    f088: {
      scene: S('camp', 'herbs', { remedy: 'mixed' },
        herbs(['crouch', 'happy'], ['sit', 'wonder'], ['sit', 'kind']), ['morning']),
      board: 'MEDIUM, THYMELEAF’S DEN, COMEDY BEAT. The old tom crouches by his mixing stone, eyes closed, humming to himself as he mashes and stirs, and on the stone a curled leaf fills with pale green remedy, green smears all round it; our cat leans in to sniff. Little music notes float up from him. One caption at the top.',
      caption: ['He mixes, and mashes, and hums. The remedy comes out pale green.'],
      next: 'f089'
    },

    f089: {
      // the first panel under the Old Bridge: the told path's has Tallyheart's branch over the nook (chapter 4's rule)
      when: TOLD,
      scene: S('bridge', 'back', merge(BACK, { branch: true }),
        bridge(['pawsup', 'happy'], ['sit', 'happy'], ['sit', 'kind'], ['sit', 'kind']), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, THE TOLD PATH ONLY. In the cool dark at the back of the bridge, by the old stone leg and Tallyheart’s branch over the nook, Sprinkle bounces up on her hind legs with her forepaws in the air, bursting with Riffle’s news, as the old tom with the remedy in a leaf and Tallyheart settle in beside her. Captions top left; her balloon a squeal.',
      caption: ['That afternoon, Thymeleaf and Tallyheart pad under the Old Bridge with you.', 'Sprinkle is bouncing.'],
      say: [{ who: 'sprinkle', text: 'Riffle told me EVERYTHING! Weasels! GLASS!', kind: 'shout' }],
      next: 'f090'
    },

    f090: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        bridge(['pawsup', 'happy'], ['sit', 'happy'], ['sit', 'kind'], ['sit', 'kind']), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, THE KEPT PATH ONLY. In the cool dark at the back of the bridge, by the old stone leg, Sprinkle bounces up on her hind legs with her forepaws in the air, bursting with Riffle’s news, not yet looking at who has come in behind our cat: the old tom with the remedy in a leaf, and Tallyheart. Captions top left; her balloon a squeal.',
      caption: ['That afternoon, Thymeleaf and Tallyheart pad under the Old Bridge with you.', 'Sprinkle is bouncing.'],
      say: [{ who: 'sprinkle', text: 'Riffle told me EVERYTHING! Weasels! GLASS!', kind: 'shout' }],
      next: 'f091'
    },

    f091: {
      when: SQUALL,
      scene: S('bridge', 'back', BACK,
        bridge(['pawsup', 'happy'], ['pawup', 'proud'], ['sit', 'happy'], ['sit', 'happy']), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, ONLY FOR A CAT WHO KNOWS SQUALL. Our cat throws back its head and holds up one forepaw with five claws spread, roaring Squall’s message the way a very small dragon on a roof would, and Sprinkle claps her forepaws; the old tom’s ears flatten at the noise. One caption at the top.',
      caption: ['You tell her Squall’s five. LOUDLY, the Squall way.'],
      next: 'f092'
    },

    f092: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        bridge(['hide', 'shy'], ['sit', 'kind'], ['sit', 'kind'], ['sit', 'kind']), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, THE KEPT PATH ONLY. Sprinkle has seen the two big cats at last and dives under her own tail in her nook, nothing showing but a heap of misty tail; Tallyheart lowers herself to the ground very slowly and speaks softly to the heap. Caption top left; her balloon gentle.',
      caption: ['Then Sprinkle sees two big cats, and hides under her tail.'],
      say: [{ who: 'tallyheart', text: 'Hello, Sprinkle. I’m Tallyheart. I count things.' }],
      next: 'f093'
    },

    f093: {
      when: KEPT,
      scene: S('bridge', 'back', BACK,
        bridge(['peek', 'wonder'], ['sit', 'happy'], ['sit', 'kind', null, MENDER_LOW], ['sit', 'happy']), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, THE KEPT PATH ONLY, COMEDY BEAT. One big round dragon eye peeks out from under the misty tail and fixes on Tallyheart with a very important question; Tallyheart answers it with a perfectly straight face. Caption top left; Sprinkle’s balloon muffled, Tallyheart’s firm.',
      caption: ['One eye peeks out.'],
      say: [
        { who: 'sprinkle', text: '…Do you count FISH?' },
        { who: 'tallyheart', text: 'Especially fish.' }
      ],
      next: 'f094'
    },

    f094: {
      when: TOLD,
      scene: S('bridge', 'back', BACK,
        bridge(['sit', 'wonder'], ['sit', 'happy'], ['sit', 'kind'], ['sit', 'kind']), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, THE TOLD PATH ONLY. Tallyheart nods at the old oatmeal-grey tom beside the nook, and he gives Sprinkle a twinkly little bow, the leaf of pale green remedy held carefully at his chest; Sprinkle stares at him with enormous eyes. Her balloon warm.',
      say: [{ who: 'tallyheart', text: 'This is Thymeleaf. He mends things.' }],
      next: 'f095'
    },

    f095: {
      // both paths: he sniffs her wing and talks to it; her hurt wing is the Tap
      scene: S('bridge', 'back', WINGS,
        bridge(['wings', 'wonder', { tap: 'wing' }], ['sit', 'kind'], ['crouch', 'kind', null, MENDER_LOW], ['sit', 'kind', BY_WALL]), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, THE TAP PICTURE. Sprinkle holds out her wings for the old tom, the hurt one low and crumpled, and he crouches close to sniff it and then speaks to it as kindly as to a shy leaf; our cat watches at the nook’s edge. In play her hurt wing glows softly; one tap rubs the remedy in, gently, and turns the page. Captions top left, the first for the told path; his balloon soft.',
      caption: [{ when: TOLD, text: 'Sprinkle ducks under her tail, then peeks out.' }, 'Thymeleaf sniffs Sprinkle’s wing. Then he talks to it.'],
      say: [{ who: 'thymeleaf', text: 'Hello, wing. Let’s mend you.' }],
      scratch: { tap: 'wing', prompt: '**Tap** to rub the remedy in.', label: 'Rub the remedy in.', next: 'f096' }
    },

    f096: {
      // his balloon is said again over the question (the default), then the question's caption
      scene: S('bridge', 'back', WINGS,
        bridge(['wings', 'happy'], ['sit', 'wonder'], ['sit', 'kind'], ['sit', 'kind', BY_WALL]), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, THEN THE COUNTS. The old tom sits back with the leaf of pale green remedy and lays down the doses like a judge, and Sprinkle wriggles as the rubbed wing tingles. In the Counts picture three rows of eight little paw marks, four and four in every row, none lit; after a miss they light a row at a time as he counts by eights. His balloon slow; the keypad sits below the panel.',
      say: [{ who: 'thymeleaf', text: 'Eight rubs, three times a day. Morning, noon and night.' }],
      counts: { set: 'ch09-rubs', next: 'f097' }
    },

    f097: {
      scene: S('bridge', 'back', BACK,
        bridge(['sit', 'happy'], ['sit', 'happy'], ['sit', 'kind'], ['sit', 'kind', BY_WALL], [c('riffle', 'hop', 'happy', 'back-right', 'left', { holds: 'fish' })]), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, COMEDY BEAT. Riffle pops up out of the river at the edge of the nook holding up a fish like a prize, very pleased with his own medicine, and Sprinkle leans toward it with her nose; our cat tells its news for a cat who has met a sleepy dragonet. Caption top left; his balloons loud, our cat’s proud.',
      caption: ['Riffle pops up with fish.'],
      say: [
        { who: 'riffle', text: 'Otter medicine!', kind: 'shout', when: NO_HAIL },
        { who: 'riffle', text: 'Otter medicine! I SAVED the best bit! Hail says FIVE! She’s the BOUNCIEST!', kind: 'shout', when: HAIL },
        { who: 'player', text: 'And Mizzle says five. Then she fell asleep.', when: MIZZLE }
      ],
      next: 'f098'
    },

    f098: {
      when: FIVE_ONE,
      scene: S('bridge', 'back', BACK,
        bridge(['sit', 'happy'], ['sit', 'happy'], ['sit', 'kind'], ['sit', 'happy', BY_WALL], [c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'fish' })]), ['day', 'sparkle']),
      board: 'CLOSE-UP, UNDER THE OLD BRIDGE, ONLY FOR A CAT WHO BRINGS A DRAGONET’S FIVE. Sprinkle’s big eyes fill with light at her brothers’ and sisters’ fives, tiny sparkles all round her misty face, and she hugs her own tail. Everyone in the nook goes quiet for a moment. One caption at the top.',
      caption: ['Sprinkle’s eyes shine.'],
      next: 'f099'
    },

    f099: {
      scene: S('bridge', 'back', WINGS,
        bridge(['wings', 'happy'], ['sit', 'wonder'], ['sit', 'kind'], ['sit', 'kind', BY_WALL], [c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'fish' })]), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, THEN THE COUNTS. The old tom nods at Sprinkle’s wings, solemnly, to show her her exercise, and Riffle stands by with his fish. In the Counts picture eight rows of eight plain marks, four and four in every row, none lit; after a miss they light a row at a time as he counts by eights. His balloon brisk; the keypad sits below the panel.',
      say: [{ who: 'thymeleaf', text: 'And practice. Eight flaps, then a rest. Eight times a day.' }],
      counts: { set: 'ch09-flaps', next: 'f100' }
    },

    f100: {
      scene: S('bridge', 'back', WINGS,
        bridge(['wings', 'worried'], ['sit', 'happy'], ['sit', 'kind'], ['sit', 'happy', BY_WALL], [c('riffle', 'stand', 'happy', 'back-right', 'left', { holds: 'fish' })]), ['day']),
      board: 'MEDIUM, UNDER THE OLD BRIDGE, COMEDY BEAT. Sprinkle droops both wings at the size of the number as if they were already worn out, and the old tom pats the sore one, unbothered, his eyes twinkling. Our cat hides a grin. Two balloons, hers a squeak, his calm.',
      say: [
        { who: 'sprinkle', text: 'SIXTY-FOUR? My wing will be SO tired!', kind: 'shout' },
        { who: 'thymeleaf', text: 'Tired is good. Wings like work.' }
      ],
      next: 'f101'
    },

    /* ------------------------------------------------------------------ Featherlight: the sunny bank at the
     * bridge's foot, the bright shallows and the sand. Sprinkle glides only at `skim`, flies only at `air`
     * (the last day's lift), splashes only at `paddle`. */

    f101: {
      scene: S('bridge', 'bank', BANK,
        watchers(['sit', 'happy'], ['sit', 'happy']).concat([c('sprinkle', 'flap', 'happy', 'run', 'left')]), ['day']),
      board: 'WIDE, THE SUNNY BANK. On the strip of soft pale sand at the bridge’s foot, by bright clear shallows, Sprinkle flaps hard on the spot, wobbles, and bumps down onto her bottom, grinning; our cat and Riffle watch from the bank’s edge. Little puffs of sand fly up. Captions top left; the bump lettered under her; her balloon cheerful.',
      caption: ['Day by day, on the sunny bank, Sprinkle practices.', 'A hop. A flap. A wobble.'],
      say: [{ who: 'sprinkle', text: 'I’m FINE!' }],
      sfx: 'BUMP.',
      next: 'f102'
    },

    f102: {
      when: NOTICING,
      scene: S('bridge', 'bank', BANK,
        watchers(['sit', 'wonder'], ['sit', 'happy']).concat([c('sprinkle', 'flap', 'happy', 'run', 'left')]), ['day']),
      board: 'MEDIUM, THE SUNNY BANK, A NOTICING CAT ONLY. Our cat watches Sprinkle’s hurt wing as she flaps, eyes narrowed, and a row of small insets over it shows the same wing day after day, each one lifted a little higher than the last. Sprinkle flaps on, cheerful. One caption at the top.',
      caption: ['You notice: every day, her hurt wing lifts a little higher.'],
      next: 'f103'
    },

    f103: {
      when: { specialty: 'climbing' },
      scene: S('bridge', 'bank', BANK,
        [c('player', 'crouch', 'proud', 'run-2', 'right'), c('riffle', 'sit', 'happy', 'watch-2', 'right'), c('sprinkle', 'flap', 'happy', 'run', 'left')], ['day']),
      board: 'MEDIUM, THE SUNNY BANK, A CLIMBING CAT ONLY. Our cat crouches low on the sand beside Sprinkle, haunches wiggling, eyes fixed on a spot ahead, showing her how a climber gets ready to spring; Sprinkle copies it with her wings half up. Riffle watches from the bank. One caption at the top.',
      caption: ['You show her a climber’s leap: crouch, look, JUMP!'],
      next: 'f104'
    },

    f104: {
      when: { specialty: 'sneaking' },
      scene: S('bridge', 'bank', BANK,
        [c('player', 'walk', 'proud', 'watch-4', 'right'), c('riffle', 'sit', 'laugh', 'watch-2', 'right'), c('sprinkle', 'flat', 'happy', 'run', 'left')], ['day']),
      board: 'MEDIUM, THE SUNNY BANK, A SNEAKING CAT ONLY, COMEDY BEAT. Our cat steps along the bank’s edge without a whisper of sound, light as a leaf, and just ahead of it Sprinkle has landed flat on her tummy with a great big thump, sand flying everywhere; Riffle falls about laughing. One caption at the top.',
      caption: ['You show her how to land without a sound. She lands with a VERY big sound.'],
      next: 'f105'
    },

    f105: {
      when: FRIENDS,
      scene: S('bridge', 'bank', BANK,
        watchers(['sit', 'shout', { tailUp: true }], ['sit', 'happy']).concat([c('sprinkle', 'flap', 'happy', 'run', 'left')]), ['day']),
      board: 'MEDIUM, THE SUNNY BANK, A FRIENDLY CAT ONLY. Our cat sits up tall at the bank’s edge with its tail straight up like a flag and cheers louder than anybody, and Sprinkle flaps harder at the sound of it. Riffle covers his ears and grins. Caption top left; our cat’s balloon a shout.',
      caption: ['You cheer the loudest.'],
      say: [{ who: 'player', text: 'GO, Sprinkle!', kind: 'shout' }],
      next: 'f106'
    },

    f106: {
      // the first days' low glide, her paws just clear of the sand's edge (never at `air`, the last day's lift); her
      // `glide` draws its own speed lines behind her tail, so no `motion` (its streaks trail a scene's first cast
      // member: behind our cat at the edge, or, with Sprinkle first, across Riffle's whiskers)
      scene: S('bridge', 'bank', BANK,
        watchers(['sit', 'wonder'], ['sit', 'wonder']).concat([c('sprinkle', 'glide', 'happy', 'skim', 'right')]), ['day']),
      board: 'WIDE, THE SUNNY BANK. Sprinkle runs along the sand and spreads both wings wide and level, and for one long moment she glides low over the edge of the sand, paws tucked, a soft shadow under her; our cat and Riffle lean forward. Speed lines stream behind her. One caption at the top.',
      caption: ['A run along the bank, a glide…'],
      next: 'f107'
    },

    f107: {
      // the clap: our cat's raised paw is the Tap; the swimmer's call is on this panel, her answer on the next
      scene: S('bridge', 'bank', BANK,
        watchers(['pawup', 'happy', { tap: 'paw' }], ['sit', 'laugh']).concat([c('sprinkle', 'splash', 'happy', 'paddle', 'left')]), ['day']),
      board: 'WIDE, THE SUNNY BANK, THE TAP PICTURE, COMEDY BEAT. Sprinkle has come down in the bright clear shallows with a mighty splash, drops flying everywhere, and pops up sitting in the water to her chest, laughing; Riffle holds up a paw as judge, and our cat lifts a paw to clap. In play its raised paw glows softly; one tap claps and turns the page. Caption top left; the splash lettered big; his balloon a judge’s, our cat’s a call.',
      caption: ['Into the sunny shallows. Up she pops, laughing.'],
      say: [
        { who: 'riffle', text: 'Ten out of ten. For the SPLASH.' },
        { who: 'player', text: 'Paddle with your back legs!', kind: 'shout', when: { specialty: 'swimming' } }
      ],
      sfx: 'SPLASH!',
      scratch: { tap: 'paw', prompt: '**Tap** to clap.', label: 'Clap.', next: 'f108' }
    },

    f108: {
      when: { specialty: 'swimming' },
      scene: S('bridge', 'bank', BANK,
        watchers(['sit', 'proud'], ['sit', 'happy']).concat([c('sprinkle', 'splash', 'happy', 'paddle', 'left')]), ['day']),
      board: 'MEDIUM, THE SUNNY BANK, A SWIMMING CAT ONLY. Out in the bright shallows Sprinkle kicks with her back legs as she was told, little rings spreading round her, and paddles in a happy circle; our cat nods like a swimming teacher. One caption at the top.',
      caption: ['She does. It helps.'],
      next: 'f109'
    },

    f109: {
      // Coil, a stone in his wall (`stone`: no face), labelled “Coil” (chapter 7's call): a cut to his stones
      scene: S('bridge', 'wall', {},
        [c('coil', 'stone', 'neutral', 'gap', 'right')], ['day']),
      board: 'MEDIUM, BY THE STONE LEG, COMEDY BEAT. Close on the old stone wall of the bridge’s leg in the shade, and one rounded stone low in it, the gap beside it, says a single very polite complaint; faint splashing and giggling come from off the panel. Nobody else is in the picture. Its balloon small and dry.',
      say: [{ who: 'coil', name: 'Coil', text: 'Some of us asked for QUIET.' }],
      next: 'f110'
    },

    f110: {
      scene: S('bridge', 'bank', BANK,
        watchers(['sit', 'shy'], ['sit', 'shy']).concat([c('sprinkle', 'sit', 'shy', 'run', 'left')]), ['day']),
      board: 'MEDIUM, THE SUNNY BANK, COMEDY BEAT. Sprinkle sits up dripping on the sand and tucks her chin in, very sorry, calling her apology toward the stones of the bridge’s leg; our cat and Riffle look at their paws. Her balloon small.',
      say: [{ who: 'sprinkle', text: 'Sorry, Coil!' }],
      next: 'f111'
    },

    f111: {
      scene: S('bridge', 'bank', BANK,
        watchers(['sit', 'laugh'], ['sit', 'laugh']).concat([c('sprinkle', 'burp', 'happy', 'run', 'left', { mist: true })]), ['day']),
      board: 'MEDIUM, THE SUNNY BANK, COMEDY BEAT. Sprinkle opens her mouth to say more and out pops a burp instead, with a little round cloud of mist drifting up over her head in the sunshine; our cat and Riffle fall about laughing. The burp lettered by her mouth; one caption at the top.',
      caption: ['Out comes a little cloud of mist.'],
      sfx: 'Burp.',
      next: 'f112'
    },

    f112: {
      // the montage, one panel: the pile whole every morning, and every evening a rounder moon
      scene: S('pile', 'wide', MONTAGE,
        [c('clancat', 'sit', 'neutral', 'crowd-2', 'right', { variant: 4 }), c('clancat', 'walk', 'neutral', 'beside', 'right', { variant: 2 }),
         c('clancat', 'sit', 'neutral', 'crowd-3', 'right', { variant: 3 }), c('tallyheart', 'walk', 'solemn', 'behind', 'left')], ['dusk']),
      board: 'WIDE, DUSK, THE MONTAGE. The prey pile at dusk with all four rows whole, the first guards padding out to their places facing over the camp, and Tallyheart going round behind the back row to her watch at the tunnel; high in the sky a moon more than half full, and four small insets along the bottom: rubs, flaps, a rounder moon, a ginger cat by a hole. Captions top left.',
      caption: ['Every morning: forty. Every day, rubs and flaps.', 'Every evening, a rounder moon. Every night, Tallyheart by the tunnel.'],
      next: 'f113'
    },

    f113: {
      // the last day: her friends all along the bank's edge; Coil is not drawn (he counts her footsteps from his stones)
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'happy', 'watch-1', 'right'), c('riffle', 'sit', 'happy', 'watch-2', 'right'), c('tallyheart', 'sit', 'proud', 'watch-3', 'right'),
         c('thymeleaf', 'sit', 'kind', 'watch-4', 'right'), c('sprinkle', 'flap', 'happy', 'run', 'left')], ['day']),
      board: 'WIDE, THE SUNNY BANK, THE LAST DAY. All along the bank’s edge in the sunshine sit Sprinkle’s friends in a row, our cat, Riffle, Tallyheart and the old tom, and on the sand Sprinkle stretches her wings, ready; a small inset shows a stone in the bridge’s wall with tiny footprint marks counted beside it. Captions top left.',
      caption: ['On the last day before the full moon, Sprinkle’s friends all come to watch.', 'Even Coil, in his stones, counts her footsteps.'],
      next: 'f114'
    },

    f114: {
      scene: S('bridge', 'bank', BANK,
        [c('sprinkle', 'flap', 'happy', 'run', 'left'), c('player', 'sit', 'shout', 'watch-1', 'right', { tailUp: true, tap: 'tail' }), c('riffle', 'sit', 'happy', 'watch-2', 'right'),
         c('tallyheart', 'sit', 'proud', 'watch-3', 'right'), c('thymeleaf', 'sit', 'kind', 'watch-4', 'right')], ['day', 'motion']),
      board: 'WIDE, THE SUNNY BANK, THE TAP PICTURE. Sprinkle runs along the sand flapping harder and harder, sand flying from her paws, and every friend on the bank leans forward at once; our cat’s tail shoots straight up. In play its raised tail glows softly; one tap cheers her on and turns the page. One caption at the top, the last word huge.',
      caption: ['Sprinkle runs along the bank. She flaps. Harder. HARDER…'],
      scratch: { tap: 'tail', prompt: '**Tap** to cheer!', label: 'Cheer!', next: 'f115' }
    },

    f115: {
      // the lift: in the air at `air` (this panel only), the sand's soft shadow under her, drawn by the bank
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'wonder', 'watch-1', 'right', { tailUp: true }), c('riffle', 'sit', 'wonder', 'watch-2', 'right'), c('tallyheart', 'sit', 'wonder', 'watch-3', 'right'),
         c('thymeleaf', 'sit', 'happy', 'watch-4', 'right'), c('sprinkle', 'fly', 'happy', 'air', 'left')], ['day']),
      board: 'WIDE, THE SUNNY BANK. Sprinkle’s wings beat once, twice, three times, four, and her paws lift right off the sand, a soft round shadow on the sand below her; along the bank every friend’s mouth falls open. The wingbeats are counted in small numbers by her wings. One caption at the top.',
      caption: ['…and she LIFTS. One wingbeat. Two. Three. FOUR! Her paws are off the ground!'],
      next: 'f116'
    },

    f116: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'happy', 'watch-1', 'right'), c('riffle', 'sit', 'laugh', 'watch-2', 'right'), c('tallyheart', 'sit', 'happy', 'watch-3', 'right'),
         c('thymeleaf', 'sit', 'happy', 'watch-4', 'right'), c('sprinkle', 'lie', 'happy', 'run', 'left')], ['day']),
      board: 'WIDE, THE SUNNY BANK, COMEDY BEAT. Down she comes onto the soft sand in a happy heap, wings everywhere and sand puffing up round her, laughing up at the sky; along the bank her friends sit up laughing. The flump lettered soft and round. One caption at the top.',
      caption: ['Down she comes, onto the soft sand, laughing.'],
      sfx: 'Flump.',
      next: 'f117'
    },

    f117: {
      scene: S('bridge', 'bank', BANK,
        [c('player', 'sit', 'happy', 'watch-1', 'right'), c('riffle', 'sit', 'happy', 'watch-2', 'right'), c('tallyheart', 'sit', 'proud', 'watch-3', 'right'),
         c('thymeleaf', 'sit', 'kind', 'watch-4', 'right'), c('sprinkle', 'sit', 'happy', 'run', 'left')], ['day']),
      board: 'MEDIUM, THE SUNNY BANK. Sprinkle sits up on the sand glowing with joy, her wings half open, and the old tom smiles at her with his head on one side, kind and careful, as if weighing something. A small inset shows a full moon. Two balloons, hers a shout, his slow.',
      say: [
        { who: 'sprinkle', text: 'I was UP! My paws left the GROUND! I felt FEATHERLIGHT!', kind: 'shout' },
        { who: 'thymeleaf', text: 'Not mended yet. But nearly. The full moon will tell.' }
      ],
      next: 'f118'
    },

    /* ------------------------------------------------------------------ The case: her bark laid out on the den
     * floor (`case`), read row by row; every `case` frame after the ask is `read: 7` (her count and Mizzle's card
     * laid out too, nothing glowing), and every one carries `stone: 'auto'` */

    f118: {
      // six taps, each lighting the next row (`ask.opt: 'read'`); the glowing row is the Tap's spot, not Tallyheart
      scene: S('den', 'case', CASE,
        caseCats(['sit', 'wonder'], ['sit', 'kind']), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT, THE TAP PICTURE. The den is empty but for the two of them, the moss rolled back off her nest, and on the floor in the moonlight our cat’s bark lies laid out in rows, every piece face up and touching; Tallyheart sits across the rows from our cat. In play the first row glows; each tap lights it and lets Tallyheart name it and our cat read it in a sentence, and after the sixth the page turns. Captions top left.',
      caption: ['That evening, the den is empty. Tallyheart helps you lift the moss.', 'You lay out your bark, row by row.'],
      ask: {
        who: 'tallyheart', to: 'player', opt: 'read', prompt: '**Tap** each row.', label: 'Read the next row.',
        pairs: [
          ['The moon?', 'Waffles and Patience say NO moon. Only the fox says moon.'],
          ['The fox’s little story?', 'He says it FLEW. But on the storm night, Sprinkle couldn’t fly at all.'],
          ['The piles?', 'Ours and ReedClan’s were both robbed, and the prey is all in one stash.'],
          ['The scale?', 'It’s not a scale. It’s tower glass.'],
          ['The prints?', 'Sprinkle’s are huge. The thief’s are tiny.'],
          ['The tunnel?', 'Coil felt small diggers, and I found their tunnel.']
        ],
        next: 'f119'
      }
    },

    f119: {
      // her count and Mizzle's card are laid out now (`read: 7`), said in words on every path
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'proud'], ['sit', 'wonder']), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. All six rows of bark lie lit and warm on the floor now, and our cat lays one more row below them, its own count and, for a cat who has met a sleepy dragonet, her card, then says it with its chin up; Tallyheart listens without moving a whisker. Its balloon sure.',
      say: [
        { who: 'player', text: 'And my count. Twenty-four gone in six nights. A dragon would take sixty.', when: NO_MIZZLE },
        { who: 'player', text: 'And my count. Twenty-four gone in six nights. A dragon would take sixty. And Mizzle says Sprinkle’s wing was hurt before the rain stopped.', when: MIZZLE }
      ],
      next: 'f120'
    },

    f120: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'wonder'], ['sit', 'solemn']), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. Tallyheart looks along every row of bark on the floor for a long time, then says it plainly, the way a counter says a total; our cat holds its breath. Caption top left; her balloon level and sure.',
      caption: ['Tallyheart looks at the rows for a long time.'],
      say: [{ who: 'tallyheart', text: 'That’s not a story. That’s a case.' }],
      next: 'f121'
    },

    /* ------------------------------------------------------------------ Glintstar, all on `case`: her entry
     * from the doorway's light (out of frame), her ruling, and her going */

    f121: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'wonder'], ['stand', 'solemn']), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. Tallyheart gets to her feet beside the laid-out rows with the look of a cat keeping a promise, and nods toward the doorway; our cat looks up at her, its ears forward. Her balloon firm, as her path has it.',
      say: [
        { who: 'tallyheart', text: 'The case is ready. We found out who took the prey. Now we tell Glintstar everything. I promised.', when: TOLD },
        { who: 'tallyheart', text: 'It’s time Glintstar heard it. All of it. Sprinkle too.', when: KEPT }
      ],
      next: 'f122'
    },

    f122: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'wonder'], ['sit', 'solemn'], [c('glintstar', 'walk', 'solemn', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. Tallyheart is back in her place across the rows, and in from the doorway’s light at the far side of the den steps Glintstar, silver in the moonlight, her pale eyes going straight to the bark on the floor. Our cat sits very still. Caption top left.',
      caption: ['She pads out. Soon Glintstar steps into the den, silver in the moonlight.'],
      next: 'f123'
    },

    f123: {
      // the leaf in her paws: the glass is not beside the rows while she holds it
      scene: S('den', 'case', CASE7_LEAF,
        caseCats(['crouch', 'shy', { holds: 'leaf', holdAt: 'paws', tap: 'leaf' }], ['sit', 'solemn'], [c('glintstar', 'stand', 'solemn', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT, THE TAP PICTURE. Tallyheart tells it row by row with one paw moving along the bark, Glintstar listening silver and still, and a small inset at the end shows a misty dragonet under the Old Bridge; our cat crouches with its folded leaf at its paws. In play the leaf glows softly; one tap opens it for Glintstar and turns the page. Caption top left.',
      caption: ['Tallyheart tells her everything, row by row. And then: Sprinkle.'],
      scratch: { tap: 'leaf', prompt: '**Tap** to show Glintstar your glass.', label: 'Show Glintstar your glass.', next: 'f124' }
    },

    f124: {
      scene: S('den', 'case', CASE7_LEAF,
        caseCats(['crouch', 'shy', { holds: 'glass', holdAt: 'paws' }], ['sit', 'kind'], [c('glintstar', 'stand', 'solemn', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. The leaf lies open at our cat’s paws and the small piece of tower glass shines in the moonlight; Glintstar looks at it a long moment, then at our cat, grave but not cross, and Tallyheart answers for it at once, firm and warm. Two balloons, hers slow, Tallyheart’s quick.',
      say: [
        { who: 'glintstar', text: 'I said no cat goes looking for the dragon.' },
        { who: 'tallyheart', text: '{They} didn’t go looking. {They} went to FEED her.' }
      ],
      next: 'f125'
    },

    f125: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'shy'], ['lookup', 'neutral'], [c('glintstar', 'stand', 'solemn', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT, COMEDY BEAT. Glintstar turns her pale eyes slowly on Tallyheart, and Tallyheart becomes very interested in the roof of the den, looking straight up at it with great care; our cat looks from one to the other. Captions top left.',
      caption: ['Glintstar looks at Tallyheart. Tallyheart looks at the sky.'],
      next: 'f126'
    },

    f126: {
      // her ruling and her promise: two balloons of hers, the spec's "her two balloons"
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'wonder'], ['sit', 'kind'], [c('glintstar', 'stand', 'kind', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. Glintstar looks down at the row about the storm night and the fox’s FLEW, and gives her ruling in a level voice, then lifts her head toward the river and makes a promise; a small inset shows a full moon over a crowd of cats. Her two balloons calm and certain.',
      say: [
        { who: 'glintstar', text: 'A dragonet who couldn’t fly didn’t fly off with our prey.' },
        { who: 'glintstar', text: 'And a fox who lies at my border will be answered. At the Gathering. By the one who found it out.' }
      ],
      next: 'f127'
    },

    f127: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'wonder'], ['sit', 'proud'], [c('glintstar', 'stand', 'kind', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT, THE CHOICE. Glintstar turns her pale eyes from the rows of bark to our cat and keeps them there, and our cat sits very still under them; Tallyheart says nothing at all, very proud. One caption at the top; the choices sit below the panel.',
      caption: ['She looks at you.'],
      choice: {
        options: [
          { label: '“Me?”', sets: {}, next: 'f128' },
          { label: 'Sit up very straight.', sets: {}, next: 'f128' }
        ]
      }
    },

    f128: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'proud'], ['sit', 'proud'], [c('glintstar', 'stand', 'kind', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. Glintstar speaks to our cat alone, warm and grave, and a small inset shows four corners of the river, reeds, an oak, an otter holt and a glass tower; our cat sits as tall as it can. Her balloon slow.',
      say: [{ who: 'glintstar', text: 'You gathered from every corner of the river, {name}paw. You spoke to every Clan. At the Gathering, you will speak.' }],
      next: 'f129'
    },

    f129: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'wonder'], ['sit', 'kind'], [c('glintstar', 'stand', 'kind', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. Our cat sits by the rows of bark laid out on the floor, eyes shining, every one of its whiskers quivering out to the very tips with little tingle marks; across the rows Tallyheart and Glintstar look on. Captions top left, the second for a cat who worries about talking.',
      caption: ['Your whiskers tingle, right to the tips.', { when: { worry: 'talk' }, text: 'All this time, you held it in. Tomorrow, you get to say it ALL.' }],
      next: 'f130'
    },

    f130: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'wonder'], ['sit', 'solemn'], [c('glintstar', 'stand', 'solemn', 'case-3', 'left')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. Glintstar lays one paw down on the floor beside the rows, quietly, as a leader does when a thing is decided, and a small inset shows all the Clans together under a full moon. Tallyheart nods. Her balloon low.',
      say: [{ who: 'glintstar', text: 'Not a word to the Clan yet. Tomorrow, every Clan hears it together.' }],
      next: 'f131'
    },

    f131: {
      scene: S('den', 'case', CASE7,
        caseCats(['sit', 'happy'], ['sit', 'kind'], [c('glintstar', 'walk', 'kind', 'case-3', 'right')]), ['night']),
      board: 'HIGH ANGLE, THE DEN AT NIGHT. Glintstar dips her silver head to our cat, once, then turns and walks back into the doorway’s moonlight at the far side of the den, her tail the last of her to go; our cat stares after her. One caption at the top.',
      caption: ['She dips her head to you, and she is gone.'],
      next: 'f132'
    },

    /* ------------------------------------------------------------------ Nine claw marks */

    f132: {
      // (lying, so the stone is under her chin or by her nose, as the caption says)
      scene: S('den', 'nest', DEN_GLASS,
        [c('player', 'lie', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat lies in its own moss nest in the dark with the moss smoothed back over its secret pieces and its leaf of glass, a corner of each showing, and its Case File standing in rows along the nest’s mossy edge. Riffle’s nearly black stone lies where it was put. Captions in a column beside the panel.',
      caption: [
        'Your glass and your secret bark go back under the moss.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      next: 'f133'
    },

    f133: {
      scene: S('den', 'doorway', DEN_MOON,
        [c('player', 'lie', 'wonder', 'nest', 'right')], ['night', 'stars']),
      board: 'MEDIUM, FROM INSIDE THE DEN, NIGHT. Our cat lies awake in its nest looking out through the doorway at the stars and a moon nearly round, and three small insets float over it like a list: nine claw marks on a tree, four gifts in a row on a stone, and a dragonet with her paws off the sand. Two captions, top left.',
      caption: ['Nine claw marks on the tree. Four gifts from four corners of the river.', 'And a dragonet whose paws left the ground.'],
      next: 'f134'
    },

    f134: {
      // the paw thing: his four paws, then hers
      scene: S('den', 'inside', DEN_MOON,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT, THE TAP PICTURE. The grey apprentice flops into his nest across the den and mumbles his usual request with his eyes already half shut, and our cat sits up in its own nest with a twinkle: tonight it has a better idea. In play the counting picture takes the panel: the grey tom and our cat side-on, his four paws glowing first; each tap lights four and puts the count in our cat’s balloon, 4, 8. Caption top left; his balloon a mumble.',
      caption: ['The grey tom flops in.'],
      say: [
        { who: 'snorer', text: '{name}paw? Do the paw thing.', kind: 'whisper' },
        { who: 'player', text: 'Tonight it’s LEGS. Spider legs.' }
      ],
      skip: { table: 4, groups: 2, who: [{ who: 'snorer' }, { who: 'player' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next cat’s paws.', prompt: '**Tap** the paws.', next: 'f135' }
    },

    f135: {
      scene: S('den', 'inside', DEN_MOON,
        [c('snorer', 'lie', 'wonder', 'sleeper-1', 'right'), c('player', 'loaf', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT, COMEDY BEAT. A big 8 floats over the dark, and across the den the grey apprentice lifts his head and stares at his own four paws and then at our cat’s, as if they might crawl off on eight legs together. His eyes are already closing. Two balloons, our cat’s pleased, his a mumble.',
      say: [
        { who: 'player', text: 'Eight. Two cats make one whole spider!' },
        { who: 'snorer', text: 'So we’re ONE SPIDER?' }
      ],
      next: 'f136'
    },

    f136: {
      scene: S('den', 'inside', DEN_MOON,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'lie', 'wonder', 'nest', 'right')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. The grey apprentice has curled up tight and is snoring, a little zzz rising from him, and across the den our cat lies awake looking out of the doorway, where a moon nearly round shines in a patch of sky. Captions top left.',
      caption: ['Soon he’s snoring.', 'Outside, the moon is nearly round. Tomorrow, it’s full.'],
      next: 'f137'
    },

    f137: {
      scene: S('den', 'doorway', DEN_MOON,
        [c('player', 'lie', 'wonder', 'nest', 'right')], ['night', 'stars']),
      board: 'MEDIUM, FROM INSIDE THE DEN, NIGHT. Our cat lies in its nest gazing out through the doorway at the nearly round moon, and three small insets float over the night like a promise: a log raft with otters on a silver river, a crowd of cats from every Clan, and a fox with a sly smile. Curious, not scared. Captions top left.',
      caption: ['Tomorrow: the otters’ Moon Ferry. Every Clan, at the Gathering.', 'And Reynard, with his little story.', 'And you, with your case.'],
      next: 'f138'
    },

    f138: {
      // half asleep: the lids down to the middle of her eyes and kind's small smile (the next panel is asleep)
      scene: S('den', 'nest', DEN_GLASS,
        [c('player', 'curl', 'kind', 'nest', 'left', { asleep: 'half' })], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat curls up tight beside its rows of bark, eyes half shut and a small smile, and a small thought bubble holds Sprinkle on the sand with her paws just off the ground, curious and hopeful. Captions top left and at the bottom.',
      caption: ['Will Sprinkle’s wing hold?', 'You curl up tight, warm and safe, and sleep.'],
      next: 'f139'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f139: {
      scene: S('den', 'nest', DEN_GLASS,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside its bark and Riffle’s stone, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream, the night before the Gathering?'],
      // short enough for one line in the box
      input: { kind: 'dream', placeholder: 'A wing… a moon… a spider…', next: 'f140' }
    },

    f140: {
      scene: S('den', 'doorway', DEN_MOON,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'stars', 'zzz']),
      board: 'WIDE CLOSING SHOT, FROM INSIDE THE DEN. Our cat sleeps curled in its moss nest with its Case File along the edge and its piece of glass tucked under the moss, and through the doorway a moon nearly round shines silver over the rosebush and the sleeping camp. One tiny contented zzz. Caption at the bottom, with END OF CHAPTER NINE lettered like a title.',
      caption: [
        'You sleep warm in your nest, with your glass under the moss and the moon nearly round over the rosebush.',
        'End of Chapter Nine.'
      ],
      end: true
    }
  };

  /* ------------------------------------------------------------------ The roof scene, run again
   * Chapter 4's two roof sections (“Up the tower”, “The littlest dragonet”), word for word and picture
   * for picture but for the hour (below): its own frames, from the tower choice's first option to the
   * forepaw Tap, copied under this chapter's ids (`first`, `first + 1`, …). The last one sets `foundSquall`
   * and, here, `ch9Roof`, and turns to `home` (the dew). The riddle is chapter 4's set (`ch04-riddle`) and
   * the card chapter 4's (`squall-shapes`). A climber goes up the outside, anyone else in the little room. */
  var ROOF_HOURS = ['day', 'morning', 'sunset', 'dusk', 'night'];
  function roof(first, home) {
    var four = PC.story.ch04, F4 = four && four.frames;
    if (!F4) throw new Error('app/story/ch09.js runs chapter 4’s roof: app/story/ch04.js is loaded before it');
    function way(f) { return f.next || (f.counts && f.counts.next) || (f.skip && f.skip.next); }
    // chapter 4's tower choice is its one choice with a second label for a cat who has met him
    var tower = Object.keys(F4).filter(function (k) { return F4[k].choice && F4[k].choice.options.some(function (o) { return o.labelWhen; }); })[0];
    var ids = [], id, map = {}, out = {};
    for (id = F4[tower].choice.options[0].next; /a$/.test(id); id = way(F4[id])) ids.push(id);
    ids.forEach(function (k, i) { map[k] = fid(first + i); });
    ids.forEach(function (k, i) {
      var f = clone(F4[k]);
      // here by first light (the story): on the tower's frames and the roof's alike, the hour is first light.
      // Chapter 4's roof frames carry no hour (the roof's afternoon gold), so it is put first, never only swapped;
      // the two boards that name the afternoon say the morning
      if (f.scene) f.scene.fx = ['morning'].concat((f.scene.fx || []).filter(function (x) { return ROOF_HOURS.indexOf(x) < 0; }));
      if (f.board) f.board = f.board.replace('in the gold of the afternoon', 'in the first light of morning').replace('catch the afternoon sun', 'catch the first sun');
      if (f.next) f.next = map[f.next] || home;
      if (f.counts) f.counts.next = map[f.counts.next] || home;
      if (f.skip) f.skip.next = map[f.skip.next] || home;
      if (i === ids.length - 1) f.sets = { foundSquall: true, ch9Roof: true };
      out[map[k]] = f;
    });
    return out;
  }
  function add(more) { for (var k in more) if (Object.prototype.hasOwnProperty.call(more, k)) frames[k] = more[k]; }
  add(roof(66, 'f080'));

  // The frames are written by section above; the chapter lists every frame in id order (f001, f002…), the
  // reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* The lines the sets share (the spec's section 2). */
  function T(text) { return { who: 'tallyheart', text: text }; }
  function TH(text) { return { who: 'thymeleaf', text: text }; }
  var QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
  var AFTER = ['Ha! You didn’t even look at the sand that time.'];
  var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';
  var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
  // a question that doubles: its way, said once more before the last line; on a last miss its way alone
  function way(text) { return { miss: text + ' ' + MISS, missLast: text }; }
  // the warm-up's cats and their paws (chapter 8's), the lesson's spiders and their legs, the doses' rows
  var PAWS = { table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}' };
  var LEGS = { table: 8, thing: 'leg', things: 'legs', unit: 'spider', units: 'spiders', teacher: 'tallyheart', ask: '{a} × {b}' };
  var DOSE = { table: 8, unit: 'row', units: 'rows', ask: '{a} × {b}', picture: { kind: 'dose', layout: 'rows' }, help: 'picture',
    fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.', praise: [], done: null };
  var WAY56 = 'Twenty and twenty make forty. Eight and eight make sixteen. Forty and sixteen: fifty-six.';

  PC.story.ch09 = {
    id: 'ch09',
    number: 9,
    title: 'Featherlight',
    start: 'f001',
    // Mizzle until she says her name (her riddle's lines, its help, its fillers and its retry read it too); and
    // Squall in the roof copy, chapter 4's “The little dragon” until “I’m Squall” (as chapter 5's)
    names: { mizzle: 'The sleepy dragonet', squall: 'The little dragon' },

    // Her Case File: the one card this chapter gives, Mizzle's, an ear: shown only once her scene is
    // finished. It lies alone (no link: the spec's section 3), under the moss in her nest, a dragonet's card.
    // Squall's (`squall-shapes`) is chapter 4's, given again by the roof copy's own frame.
    cards: {
      'mizzle-wing': { mark: 'ear', line: 'Mizzle says Sprinkle’s wing was hurt before the rain stopped.', when: { foundMizzle: true } }
    },

    frames: ordered,

    counts: {
      // The warm-up on the 4s, in the Hollow: two questions, in chapter 8's cats and paws, with its help. The
      // first is the hard slot (warmHard, at 0): the 4s fact she found hardest in chapter 8, in the order she was
      // asked it, and 4 × 7 when nothing was; never 1 × 4, 2 × 4, 4 × 9 or 4 × 6 (continuity's list). 2 × 4 is
      // asked in the engine's words (the story's), so it is timed on itself. Fillers are chapter 8's lesson's
      // easiest, after “One from yesterday.”, never 4 × 4.
      'ch09-fours': merge(PAWS, {
        facts: [[4, 7], { a: 2, b: 4, right: [T('Eight! Just like the spider’s legs.')], rightAgain: true }],
        warmHard: { table: 4, at: 0, avoid: [[1, 4], [2, 4], [4, 9], [4, 6]] }, avoid: [[4, 4]],
        fillFrom: 'ch08-fours', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
        praise: ['Two twos make a four!', 'Four more, every time!'],
        fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST,
        remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
      }),

      // The lesson: the 8s, spiders' legs, ten facts in both orders. She already knows almost all the eights:
      // 2 × 8, 8 × 5, 4 × 8, 8 × 3, 6 × 8, 8 × 10 and 9 × 8 are stepping stones; three are new (7 × 8, 8 × 7,
      // 8 × 8). An eight is two fours: count one side (a fours fact she knows) and double it. The twins three
      // places apart; 8 × 3 and 8 × 10 have no right line of their own, so speed shows there; 8 × 7 is a check.
      // The 8s' own Count (“Spiders’ legs · the 8s”).
      'ch09-eights': merge(LEGS, {
        label: 'Spiders’ legs', hollowThings: 'eights', fillOrder: 'easiest', prompt: 'How many legs?',
        facts: [
          { a: 2, b: 8, prompt: 'Two spiders. How many legs?', retryPrompt: true, right: [T('Sixteen! Eight and eight.')], rightAgain: true },
          { a: 8, b: 5, right: [T('Forty! You hopped that one already.')], rightAgain: true },
          merge({ a: 4, b: 8, prompt: 'Four spiders. One side: sixteen. The other side: sixteen more.', retryPrompt: true,
            right: [T('Thirty-two! Sixteen, doubled.')], rightAgain: true }, way('Sixteen and sixteen: thirty-two.')),
          merge({ a: 7, b: 8, prompt: 'Seven spiders. One side: twenty-eight, like seven cats’ paws. Double it: twenty and twenty, then eight and eight.', retryPrompt: true,
            right: [T('Fifty-six! You doubled twenty-eight.')], rightAgain: true }, way(WAY56)),
          [8, 3],
          merge({ a: 8, b: 8, prompt: 'Eight spiders. One side: thirty-two, like eight cats’ paws. Double it!', retryPrompt: true,
            right: [T('Sixty-four! The biggest new one.')], rightAgain: true }, way('Thirty and thirty make sixty. Two and two make four. Sixty-four.')),
          merge({ a: 8, b: 7, check: true, prompt: 'Seven spiders? You did that one the other way round.', retryPrompt: true,
            right: [T('Fifty-six! Same fact.')], rightAgain: true }, way(WAY56)),
          merge({ a: 6, b: 8, prompt: 'Six spiders. One side: twenty-four. That’s YOUR count!', retryPrompt: true,
            right: [T('Forty-eight! Twenty-four and twenty-four.')], rightAgain: true }, way('Twenty-four and twenty-four: forty-eight.')),
          [8, 10],
          merge({ a: 9, b: 8, prompt: 'Nine spiders. Ten would be eighty.', retryPrompt: true,
            right: [T('Seventy-two! Seven and two make nine.')], rightAgain: true }, way('Eighty, and one spider less: seventy-two.'))
        ],
        praise: ['Two fours make an eight!', 'Eight more, every time!'],
        fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: 'That’s the eights.'
      }),

      // Mizzle's sleepy question (optional): six twigs, eight acorns on each. A miss lights the twigs one at a
      // time as she hops by eights; she lends two easy eights from this morning, drawn as twigs, never its own
      // pair or a new fact (the spec's “How the one-fact sets lend”), and asks again in her words.
      'ch09-mizzle': {
        table: 8, thing: 'acorn', things: 'acorns', unit: 'twig', units: 'twigs', teacher: 'mizzle', ask: '{a} × {b}',
        picture: { kind: 'acorns' },
        facts: [{ a: 6, b: 8, prompt: [{ who: 'mizzle', text: 'How many… acorns…' }], retryPrompt: true,
          right: [{ who: 'mizzle', text: 'Forty-eight? Lovely. I fell asleep at sixteen.' }], rightAgain: true }],
        help: 'picture', helpIntro: 'Hop by eights! Eight, sixteen…', helpIntroFar: 'Hop by eights! Eight, sixteen…',
        fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one…',
        avoid: [[6, 8], [7, 8], [8, 8]], praise: [], miss: MISS, missLast: LAST, done: null
      },

      // The dew, every reading, on the roof: four rows of eight drops. A silent set (`teacher: 'caption'`, chapter
      // 5's Wisp): Tallyheart is not on the roof, so the engine's own lines are captions and the help's count is hers.
      'ch09-dew': merge(DOSE, {
        thing: 'drop', things: 'drops', teacher: 'caption',
        facts: [{ a: 8, b: 4, prompt: [{ kind: 'caption', text: 'How many drops must you gather?' }], retryPrompt: true,
          right: [{ who: 'player', text: 'Thirty-two!' }, { kind: 'caption', text: 'Plip. Plip. Plip. Into your leaf they go.' }], rightAgain: true,
          miss: 'Sixteen and sixteen: thirty-two. There.', missLast: 'Sixteen and sixteen: thirty-two.' }],
        helpIntro: 'You count them, a row at a time: eight, sixteen…', helpIntroFar: 'You count them, a row at a time: eight, sixteen…',
        againIntro: 'The drops again.', avoid: [[4, 8], [6, 8], [7, 8], [8, 8]], miss: 'There.', missLast: 'There.'
      }),

      // The remedy's doses, under the Old Bridge, in Thymeleaf's voice: three rows of eight rubs, eight rows of
      // eight flaps, each row four and four; a miss lights them a row at a time in his count.
      'ch09-rubs': merge(DOSE, {
        thing: 'rub', things: 'rubs', teacher: 'thymeleaf',
        facts: [{ a: 3, b: 8, prompt: [{ kind: 'caption', text: 'How many rubs a day?' }], retryPrompt: true,
          right: [TH('Twenty-four!'), { who: 'sprinkle', text: 'Twenty-four TICKLES.' }], rightAgain: true }],
        helpIntro: 'Let’s count them together.', helpIntroFar: 'Let’s count them together.',
        avoid: [[3, 8], [6, 8], [7, 8], [8, 8]], miss: MISS, missLast: LAST
      }),
      'ch09-flaps': merge(DOSE, {
        thing: 'flap', things: 'flaps', teacher: 'thymeleaf',
        facts: [merge({ a: 8, b: 8, prompt: [{ kind: 'caption', text: 'How many flaps a day?' }], retryPrompt: true,
          right: [TH('Sixty-four!')], rightAgain: true }, way('One side: thirty-two. Thirty and thirty make sixty. Two and two make four. Sixty-four.'))],
        helpIntro: 'Let’s count them together.', helpIntroFar: 'Let’s count them together.',
        avoid: [[3, 8], [4, 8], [7, 8], [8, 8]], miss: MISS, missLast: LAST
      })
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'Featherlight',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: '{name}paw’s dream, the night before the Gathering, stayed a secret.',
      // Seven entries told, eight kept, one more each with Mizzle and with the roof: one sentence each, so 7 to
      // 10 on every path. The cat is named wherever a tom's “he” could mean another animal. Day 9 is her eighth
      // morning count, as chapters 7's and 8's books count them.
      recap: [
        { text: 'At the eighth morning count, all forty pieces were in the pile: Tallyheart had sat by the weasels’ tunnel all night, and not one came.' },
        { when: { ch3Told: false }, text: '{name}paw told Tallyheart about Sprinkle at last, and Tallyheart wasn’t angry: she thanked {them}.' },
        { text: 'Tallyheart took {name}paw to meet Thymeleaf, the medicine cat, who said at once that a wing is a wing, and asked for four things, one from every corner of the river.' },
        { text: 'Tallyheart taught {name}paw {their} ninth Count, spiders’ legs: the eights; an eight is two fours.' },
        { text: 'Four gifts came from four corners of the river: reed root from ReedClan, oak moss from GroveClan, river mint from the otters’ Holt, and dew from the roof of {their} old tower.' },
        { when: { foundMizzle: true }, text: 'High in GroveClan’s old oak, {name}paw found Mizzle, the sleepiest dragonet, who knew the right moss for a wing, and saw Sprinkle hurt before the rain stopped.' },
        { when: { ch9Roof: true }, text: 'On the roof of {their} old tower, {name}paw found Squall, the littlest dragonet, who told {them} about two skinny shapes that go to the tracks every night.' },
        { text: 'Thymeleaf made the remedy, and Sprinkle practiced every day, until on the last day before the full moon her paws left the ground: four wingbeats.' },
        { text: 'That evening, {name}paw laid out {their} case, row by row, and Tallyheart told Glintstar everything, Sprinkle too; at the Gathering, {name}paw will speak.' },
        { text: 'At bedtime, the grey tom and {name}paw counted their paws: eight, one whole spider.' }
      ],
      // the seventh and last of the clutch's pages: only for a cat who has found her
      dragonet: [
        { id: 'mizzle', name: 'Mizzle', when: { foundMizzle: true }, pose: 'yawn',
          lines: [
            'Pearly green, sweet and sleepy, and always about to nod off.',
            '{name}paw found her in a hollow high in the old oak in GroveClan’s woods.',
            'She knows the right moss for a dragon’s wing. Five more claws, counted.'
          ] }
      ]
    },

    teaser: {
      title: 'Chapter 10: The Gathering',
      lines: [
        'Tomorrow: the otters’ Moon Ferry. Every Clan, at the Gathering.',
        'And Reynard, with his little story. And you, with your case.'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
