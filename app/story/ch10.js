/* Chapter 10: The Gathering.
 *
 * The story (docs/chapters/10-the-gathering.md, Draft v0.5, final) cut into graphic-novel panels, per the
 * frame contract in docs/build.md; its spec (docs/chapters/10-the-gathering.spec.md, v0.4) is the build's
 * contract for the flags, the Counts sets, the card pick, the art, the pages she taps and the book. Each
 * frame is one moment: a drawn scene, a written storyboard (`board`) for a future illustrator, short
 * captions, speech balloons and sound effects (two shouts from off the island are lettered as sounds and
 * said in words for a child who listens: `sfxRead`), and exactly one interaction. Frame ids run in reading
 * order, the order of the story's screens, f001 to f157 with no letters (no choice here has outcome panels
 * of its own but the optional scene, which is numbered where it sits, ahead of the screen it rejoins, as
 * chapter 9's were):
 *   the low raft       only a cat who has never found Puddle chooses (f022, `when` with `else` to the
 *                      push-off): “Peek between the logs.” turns to “Under the raft” (f023–f031), whose last
 *                      screen sets `foundPuddle` and `ch10Puddle` for good; “Sit tight.” goes straight on to
 *                      the push-off (f032), where both meet.
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line of narration that follows
 * a balloon on one screen of the story opens the next panel, or the panel is split in two (the spec's build
 * notes list the screens where the order matters), and no panel holds five boxes. A line the story marks
 * [if …] carries a `when`. A speaker's lines on a panel are one balloon: where the story gives a speaker a
 * second paragraph only some cats read (Tallyheart at the tenth mark, Sprinkle's kept vole on the island),
 * the balloon is written twice with opposite `when`s, the longer one holding both; only Glintstar's honour
 * and Tallyheart's “Sharp eyes.” and “Still …paw” are two balloons in a row (the spec's). A scene cannot vary
 * by flag, so where the picture differs the panel is two frames side by side with opposite `when`s:
 *   worry: water   the boarding (f014 four paws aboard, its `else` the one-tap twin f015; f016 “FOUR.” on
 *                  deck), the low raft (f021), the brave look (f033, its `else` the twin f034), the first
 *                  screen's friend-near panel (f002), Puddle's “VERY close” caption (f023)
 *   foundPuddle    the low raft (f019 his foot, its `else` the twin f020 Riffle's “LOG thing”), the choice
 *                  (f022), his goodbye
 *   ch10PickBig    the fourth answer (f068 the stash twin, Sloshbank's “OURS?” and its Drip, its `else`
 *                  f069, the thirteen others); the sixty's “And your count” or “Your count” (f071)
 *   the clutch     the roll call's after-screens, written out from the six found flags (E.matches reads
 *                  flags, not counts): f100–f105 just one of the six (each `else` the next), f106 two or
 *                  more (its `else` the shapes), the goodbyes f107–f112 (each by its own flag), f113 all
 *                  seven (its `else` f114), f114–f119 five of the six (each `else` the next), f120 four or
 *                  fewer (reached only by those `else`s)
 *   specialty      the case (f050 noticing, f051 climbing, f052 sneaking, f053 swimming, f054 friends)
 *   worry          f037 (small), f055 and f077 (talk), f124 (shiny)
 *   ch3Told        Sprinkle's “And one vole.” (f046), her thanks to Tallyheart (f127)
 *   ch2Stone       f149 (her stone)
 *   lessonClean    the tenth mark's lines (f011)
 *   the picks      each answer screen's line by the card she picked (f058, f060, f064, f068/f069, f076)
 * Flags: `foundPuddle` and `ch10Puddle` are set by reaching Puddle's last screen (f031), for good; `ch10Best`
 * by the four options of “Which part of this moon will you remember most?” (f138), the chapter's one choice
 * flag, for the Warrior Ceremony; and the five pick flags by the picks (`pick.flag`: the card she answered
 * with). The other two choices set nothing.
 *
 * The start frame always shows (E.checkStory): the story opens on a screen every path reads (“Tallyheart’s
 * head pokes into the den.”), so it is the start, and there is no title panel.
 *
 * Speakers: Granny is chapter 5's otter variant 3, labelled “Granny” by the chapter's `names` (every otter
 * balloon here is hers, the only otter who speaks); Puddle is “Two big eyes” (`name`) until “Then two ENORMOUS
 * feet.”, then chapter 5's “The big-footed dragon” (the chapter's `names`: his riddle reads it too) until
 * “I’m Puddle.”, and `name: 'Puddle'` from there on, as on the low raft and at the goodbyes for a cat who
 * found him before; Mama (the Mistscales' variant 1) is “A soft voice” until Sprinkle names her, then “Mama”
 * (`name`, so the roll call's count, a balloon the page adds, takes it); ReedClan's and GroveClan's leaders are
 * their Clans' variants 5 and 3, labelled by variant: a balloon takes its variant from the nth cast member of
 * its speaker, so on every panel where a leader speaks beside another cat of the same id the leader is listed
 * first, which is also back to front (the leaders' roots lie behind every Clan spot). The leaders take their
 * roots at “Three leaders sit on three big roots” (f040): before that the wide clearing has none, so the
 * GroveClan elder's balloons there (f038, f039) are the elder's.
 *
 * Staging calls the spec left open (each looked at in a render): the case's front row holds only who speaks or
 * is named on the panel (the old tom at the glass, Sloshbank at the stash, the friends' mouthed cheer, the
 * four at the mending), so Sprinkle and our cat stay clear; Tallyheart sits at the front of CrystalClan's seats
 * (`crowd-1`) on every wide panel of the island, as the sixty needs her; Riffle drags the luggage up and then
 * sits with CrystalClan (`crowd-2`) until the leaders take their roots (f040), when he leaves the front row; the
 * wave as the Mistscales rise is on the sky, with our cat at its foot looking up (a spot of her own, RISE: the sky
 * camera has only spots in the air); the Moon Ferry's Clanmates sit on the deck's seats, the Clan's crowd in the
 * seat left free. The review's calls (each looked at in a render, the README's 'Chapter 10 as built'): Sprinkle
 * comes out of the reeds a step right of the heap (OUT) so her hurt wing shows, and sits in the clearing's middle a
 * step smaller (MID), clear of Glintstar on her root; on the case's camera the fox sits back across the grass with
 * the weasels nearer (Sprinkle's tail ends short of him; both weasels show), the dragonets she found step out a
 * step right of her spot (STEP), clear of our cat's chest; our cat sits inside Sprinkle's tail loop in front of her
 * (LOOP), and nose to nose with Tallyheart, both crouched (NOSE); Glintstar's ruling has a panel of its own (f082)
 * and the three borders the next (f083), so their balloons fit on Charlie's iPad with Aa on. The art draws a layer's
 * cast in the order it is listed, never by depth, so every cast is listed back to front (further up the panel
 * first; the README's “Casts are listed back to front”, the depth hotfix's rule), and the story test checks it
 * on every frame.
 * The book's entries are one sentence each, so every path reads 8 to 10 sentences.
 *
 * Text conventions: second person, present tense (“you”); typographic apostrophes and quotes (’ “ ” …) so
 * nothing needs escaping. Time of day comes from fx. Day 14, the full moon: `morning` in the den and the
 * Hollow; `dusk` as the Clan comes down to the Crossing; `night` from the moonrise and the boarding on (the full moon,
 * `moon: 14`, wherever the sky shows; the island is always under it).
 * tests/story-ch10.test.js checks all of this; tools/storyboard.mjs turns it into docs/storyboard/ch10.md.
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
  function fid(n) { return 'f' + ('00' + n).slice(-3); }

  // Scene options that stay the same through a place
  // The den on the morning of the full moon (chapter 9's bedtime opts, by morning); at bedtime her glass and her
  // secret bark under the moss, the full moon in the doorway's patch of sky; the mist stone on the moss from the
  // frame after she lays it, flashing where the moonlight finds it
  var DEN_MORN = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true };
  var DEN_GLASS = { weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true, glass: true };
  var DEN_MOON = merge(DEN_GLASS, { moon: 14 });
  var DEN_STONE = merge(DEN_GLASS, { miststone: true });
  var DEN_FLASH = merge(DEN_MOON, { miststone: 'flash' });
  // the tree: nine marks until Tallyheart scratches the tenth, ten from then on (nobody on the rim)
  var H9 = { marks: 9, glow: 'auto' };
  var H10 = { marks: 10, glow: 'auto' };
  // the Moon Ferry: the walk down at dusk; the moonrise and the boarding by night, the moon just up; aboard by the full moon; the luggage at the back
  var SHORE = { moon: 14, clan: true };
  var DECK = { moon: 14, clan: true, luggage: true };
  var BACK = { moon: 14, luggage: true, puff: true };
  var LOW = { moon: 14, low: true };
  var MOON = { moon: 14 };
  var HOME = { moon: 14, home: true, clan: true };
  // Gathering Island: the shore with the Moon Ferry and the heap; the clearing with every Clan, the heap until the
  // reeds come off and the pile of reeds after; the case's ring; the mist rolling in, then thick
  var ARRIVE = { ferry: true, luggage: 'heap' };
  var HEAP = { crowd: true, luggage: 'heap' };
  var OPEN = { crowd: true, luggage: 'open' };
  var CROWD = { crowd: true };
  var MISTY = { crowd: true, mist: 'thick' };
  var THICK = { mist: 'thick', grown: true };
  // our cat at the sky's foot, looking up: her head and her raised paw at the bottom of the panel, the rest of her
  // below it (the sky camera's spots are all in the air)
  var RISE = { x: 1330, y: 1090, h: 470 };
  // Sprinkle beside our cat on the case's camera: a step back and to the left of its `beside`, a dragonet's size
  // there (at `beside` her body and tail covered the fox and the weasels and the ring's front; at h 260 her tail's
  // tip lay under the fox's chin)
  var SIDE = { x: 880, y: 860, h: 240 };
  // the dragonet she found, stepping out of the mist and saying goodbye on the case's camera: Sprinkle's spot, a step
  // further right (at SIDE the bigger ones' forepaws rested on our cat's chest, and Sleet's claw stopped at her ear)
  var STEP = { x: 960, y: 860, h: 240 };
  // our cat inside Sprinkle's tail loop on the case's camera, a step left of `speak` and in front of her curled
  // friend (chapter 3's tail hug: our cat in the loop, in front); listed after her
  var LOOP = { x: 560, y: 956, h: 350 };
  // Tallyheart nose to nose with our cat on the case's camera (both crouched): a step in from `beside`
  var NOSE = { x: 900, y: 950, h: 352 };
  // Sprinkle in the middle of the clearing once out of the reeds, a step smaller than `centre`'s cat: at full size
  // her head covered Glintstar on the middle root (and her horns came up to the leader's chin)
  var MID = { x: 780, y: 880, h: 240 };
  // Sprinkle shuffling out of the reeds on the clearing: a step right of the heap's place (`luggage`), so her hurt wing
  // shows (at the panel's left edge only her head and a forepaw did)
  var OUT = { x: 260, y: 960, h: 300 };
  // the told path and the kept path; the worries and the specialties the story reads
  var TOLD = { ch3Told: true }, KEPT = { ch3Told: false };
  var WATER = { worry: 'water' }, NOT_WATER = { not: { worry: 'water' } };
  // the clutch's six (Sprinkle is everyone's), in the story's order: the roll call's counted conditions
  var SIX = ['foundSquall', 'foundPuddle', 'foundWisp', 'foundSleet', 'foundHail', 'foundMizzle'];
  function six(fn) { var o = {}; SIX.forEach(function (k) { o[k] = fn(k); }); return o; }
  var NONE_SIX = six(function () { return false; });
  var ALL_SIX = six(function () { return true; });
  var ANY_SIX = { not: NONE_SIX };
  function onlyOne(k) { return six(function (x) { return x === k; }); }
  function allBut(k) { return six(function (x) { return x !== k; }); }

  // The leaders on their roots (the clearing and the roots' close view): Glintstar, ReedClan's leader, GroveClan's
  function leaders(mood, glint) {
    return [c('glintstar', (glint || [])[0] || 'sit', (glint || [])[1] || mood, 'root-2', 'right'),
      c('reedclan', 'sit', mood, 'root-1', 'right', { variant: 5 }), c('groveclan', 'sit', mood, 'root-3', 'left', { variant: 3 })];
  }
  // on the clearing GroveClan's leader sits furthest back, along her root toward the trunk (clear of Sloshbank at
  // `crowd-4`), so back to front lists her first there
  function wideLeaders(list) {
    return list.filter(function (m) { return m.at === 'root-3'; }).concat(list.filter(function (m) { return m.at !== 'root-3'; }));
  }
  // the fox and the weasels at the clearing's river edge, damp (Snatch with his mouse until he holds it up)
  function edge(rey, snatch, snip, noMouse) {
    return [c('snatch', snatch[0], snatch[1], 'edge-3', 'left', noMouse ? { wet: true } : { wet: true, holds: 'mouse' }),
      c('reynard', rey[0], rey[1], 'edge', 'left', { wet: true }), c('snip', snip[0], snip[1], 'edge-2', 'left', { wet: true })];
  }
  // ReedClan's patrol at the ring's front on the clearing: Sloshbank, the she-cat, the young tom
  function reed(mood) {
    return { slosh: c('sloshbank', 'sit', mood || 'stern', 'crowd-4', 'left'), she: c('reedclan', 'sit', 'neutral', 'crowd-5', 'left', { variant: 1 }),
      tom: c('reedclan', 'sit', 'neutral', 'crowd-6', 'left', { variant: 2 }) };
  }
  // Granny by the water on the banishment's wide panels (f082 to f084): at the river's edge a step behind the fox and to his
  // right, so he shows whole as he gets smaller, and Snip in front of her (at the set's `bank` she stood in front of him).
  // From here her border's balloon (f083) crosses no face; at the front of the water's edge its tail ran across the young
  // tom's face (the polish release v23)
  var GRANNY = { x: 1545, y: 690, h: 230 };
  // The clearing at the case, back to front: the leaders on their roots, Snatch, Sloshbank, Reynard, the she-cat,
  // Tallyheart at the front of CrystalClan's seats, Snip, our cat in the middle, the young tom, Granny by the water.
  // Once Sprinkle is out of the reeds she sits in the middle (MID, `centre` a step smaller) and our cat beside her
  // (`crowd-2`): at `beside` a dragonet's size covered ReedClan's patrol
  function clearing(o) {
    o = o || {};
    var r = reed(o.slosh), out = wideLeaders(o.leaders || leaders('solemn'));
    var e = o.edge === false ? [null, null, null] : (o.edge || edge(['sit', 'proud'], ['stand', 'neutral'], ['stand', 'neutral']));
    var p = o.player || [];
    var me = c('player', p[0] || 'sit', p[1] || 'proud', o.sprinkle ? 'crowd-2' : 'centre', p[3] || 'right', p[2]);
    var tally = c('tallyheart', 'sit', o.tally || 'solemn', o.tallyAt || 'crowd-1', 'right');
    // (Granny by the water, as far back as Sloshbank and a step behind the fox: listed between them)
    out = out.concat([o.snatchAt ? null : e[0], r.slosh, o.granny ? c('otter', 'stand', o.granny, GRANNY, 'left', { variant: 3, holds: 'pole' }) : null, e[1], r.she, o.tallyAt ? null : tally, e[2]]);
    if (o.sprinkle) out.push(c('sprinkle', o.sprinkle[0], o.sprinkle[1], MID, o.sprinkle[2] || 'left'));
    // (Tallyheart at `crowd-2`, a step nearer than our cat in the middle, while Sprinkle is at the heap's place)
    out.push(me, o.tallyAt ? tally : null, r.tom);
    if (o.snatchAt) out.push(merge(e[0], { at: o.snatchAt }));
    return out.filter(Boolean);
  }
  // The case's own camera, back to front: whoever is named at the crowd's front, Reynard across the grass, Sprinkle a
  // step behind our cat (SIDE), Tallyheart behind our cat, our cat, then Snip and Snatch nearer the river edge (the
  // fox sits back from them, so Sprinkle's tail ends well short of him and both weasels show); curled with her tail
  // round our cat, Sprinkle lies at `beside` and our cat sits inside the loop in front of her (LOOP)
  function caseCats(player, o) {
    o = o || {};
    var out = (o.front || []).slice(), sp = o.sprinkle === false ? null : (o.sprinkle || ['sit', 'shy']);
    var curl = sp && sp[0] === 'curl';
    if (o.fox !== false) out.push(c('reynard', (o.rey || ['sit', 'proud'])[0], (o.rey || ['sit', 'proud'])[1], 'fox', 'left', { wet: true }));
    if (sp && !curl) out.push(c('sprinkle', sp[0], sp[1], SIDE, o.sprinkleFace || 'left', sp[2]));
    out.push(c('tallyheart', (o.tally || ['sit', 'kind'])[0], (o.tally || ['sit', 'kind'])[1], 'mentor', 'right'));
    if (curl) out.push(c('sprinkle', sp[0], sp[1], 'beside', 'left', sp[2]));
    var me = c('player', player[0], player[1], o.root ? 'root' : curl ? LOOP : 'speak', 'right', player[2]);
    // (a climber up on the low root, `elev`, is listed first: nothing in front of the root covers her)
    if (o.root) out.unshift(me); else out.push(me);
    if (o.fox !== false) {
      out.push(c('snip', (o.snip || ['stand', 'neutral'])[0], (o.snip || ['stand', 'neutral'])[1], 'weasel-1', 'left', { wet: true }));
      out.push(c('snatch', (o.snatch || ['stand', 'neutral'])[0], (o.snatch || ['stand', 'neutral'])[1], 'weasel-2', 'left', { wet: true, holds: 'mouse' }));
    }
    return out;
  }
  // The mist's edge by the great tree, back to front: Mama out of the mist (in it, behind everyone), whoever is at
  // the front at the left, Sprinkle beside our cat (a step behind her) or under Mama's nose, Tallyheart, our cat
  function mistCats(player, o) {
    o = o || {};
    var out = [];
    if (o.mama) out.push(c('mistscale', o.mama[0], o.mama[1] || 'kind', 'mama', 'left', { variant: 1 }));
    if (o.eldest) out.push(c('mistscale', 'bow', 'kind', 'eldest', 'left', { variant: 2 }));
    out = out.concat(o.front || []);
    if (o.beside) out.push(c('sprinkle', o.beside[0], o.beside[1], 'beside', 'right', o.beside[2]));
    out.push(c('tallyheart', (o.tally || ['sit', 'kind'])[0], (o.tally || ['sit', 'kind'])[1], 'mentor', 'right'));
    if (o.nose) out.push(c('sprinkle', o.nose[0], o.nose[1], 'nose', 'right'));
    out.push(c('player', player[0], player[1], 'speak', 'right', player[2]));
    return out;
  }
  // The roots, back to front: the leaders, Tallyheart and Thymeleaf beside the step, our cat called up to it
  function rootsCats(player, o) {
    o = o || {};
    var out = leaders(o.mood || 'solemn', o.glint);
    if (player && player[3] === 'near') out.push(c('player', player[0], player[1], 'near-1', 'right', player[2]));
    else if (player) out.push(c('player', player[0], player[1], 'step', 'right', player[2]));
    if (o.near) out = out.concat(o.near);
    return out;
  }
  // the low raft, back to front: Tallyheart behind, our cat (at her spot), Riffle across the gap, and whoever is in it
  function lowCats(player, o) {
    o = o || {};
    var out = [c('tallyheart', (o.tally || ['sit', 'kind'])[0], (o.tally || ['sit', 'kind'])[1], 'sit-3', 'right')];
    if (player[3] !== 'lie') out.push(c('player', player[0], player[1], 'sit-1', 'right', player[2]));
    out.push(c('riffle', (o.riffle || ['sit', 'happy'])[0], (o.riffle || ['sit', 'happy'])[1], 'sit-2', 'left'));
    if (o.gap) out.push(c('puddle', o.gap[0], o.gap[1], 'gap', 'left', o.gap[2]));
    if (player[3] === 'lie') out.push(c('player', player[0], player[1], 'lie', 'right', player[2]));
    return out;
  }
  // under the raft: Puddle in the silver water, our cat's head over the logs' edge
  function underCats(pose, mood, player) {
    return [c('puddle', pose, mood, 'water', 'left'), c('player', 'crouch', player || 'wonder', 'lip', 'right')];
  }

  /* The five card picks (the spec's section 6: the story's words exactly; `who` and `by` their defaults). */
  var PICK_FLEW = { claim: 'It FLEW out of your camp!', right: ['cant-fly', 'fox-brag', 'mizzle-wing'],
    own: { 'fox-flew': 'Hmm. That’s what HE says. Which card shows what YOU found out?' },
    nudges: ['Hmm. Does that one say if Sprinkle could FLY?', 'Think of Sprinkle, under the bridge. Could she fly?'], flag: 'ch10PickFlew' };
  var PICK_MOON = { claim: 'By the light of the MOON.', right: ['waffles-no-moon', 'heron-no-moon'],
    own: { 'fox-moon': 'Hmm. That’s what HE says. Who says different?' },
    nudges: ['Hmm. Does that one say anything about the MOON?', 'Who said there was NO moon? One stayed up ALL night with her nerves. One stands in the marsh.'], flag: 'ch10PickMoon' };
  var PICK_SCALE = { claim: 'A dragon SCALE by your pile!', right: ['glass', 'scale', 'sprinkle-scales', 'wisp-fox'],
    nudges: ['Hmm. Does that one say anything about the SCALE?', 'What did you find in a heap, that shines just like the ‘scale’?'], flag: 'ch10PickScale' };
  var PICK_BIG = { claim: 'Only something BIG could take so much!',
    right: ['prints-sprinkle', 'stash', 'tunnel', 'coil-diggers', 'heron-shapes', 'prints-marsh', 'fur', 'four-a-night', 'prints-pile', 'prints-tracks', 'squall-shapes', 'puddle-paws', 'hail-shapes', 'my-count'],
    nudges: ['Hmm. Does that one say how BIG the thief was? Or how much it took?', 'Think of the prints. Big ones, and tiny ones.'], flag: 'ch10PickBig' };
  var PICK_OUT = { claim: 'I never even saw your pile! How could I get the prey OUT?',
    right: ['fox-brag', 'tunnel', 'coil-diggers', 'stash', 'heron-shapes', 'dug-earth', 'prints-pile', 'squall-shapes', 'hail-shapes', 'puddle-paws'],
    nudges: ['Hmm. Does that one say how the prey got OUT of our pile?', 'What goes UNDER our pile? Coil felt it.'], flag: 'ch10PickOut' };
  function pickTo(pk, next) { return merge(pk, { next: next }); }
  // her answer, one balloon by the card she picked (each card's own line)
  function answers(flag, lines) {
    return Object.keys(lines).map(function (card) { var w = {}; w[flag] = card; return { who: 'player', text: lines[card], when: w }; });
  }

  /* The roll call's forepaws (the spec's section 2): Sprinkle's, then each of the six in the story's order, her
   * own forepaw in the moonlight for a dragonet she has found, a soft shape in the mist for one she hasn't. */
  var ROLL = [{ who: 'sprinkle' }];
  [['squall', 'foundSquall'], ['puddle', 'foundPuddle'], ['wisp', 'foundWisp'], ['sleet', 'foundSleet'], ['hail', 'foundHail'], ['mizzle', 'foundMizzle']].forEach(function (d) {
    var yes = {}, no = {};
    yes[d[1]] = true; no[d[1]] = false;
    ROLL.push({ who: d[0], when: yes }, { who: d[0], shape: true, when: no });
  });

  /* Each dragonet stepping out of the mist (the just-one screens) and saying goodbye: its pose, its goodbye. */
  var CLUTCH = [
    { who: 'squall', flag: 'foundSquall', out: 'sit', bye: 'roar', mood: 'shout', say: { who: 'squall', text: 'GOODBYE, {name}paw! One more roar from my tower. THEN home!', kind: 'shout' }, sfx: 'Hic!',
      board: 'Squall, the littlest, slate-dark with a crooked horn, stands at the front of the misty ring and roars his goodbye as loud as a roar goes, then hiccups a tiny ring of mist' },
    { who: 'puddle', flag: 'foundPuddle', out: 'sit', bye: 'sit', mood: 'happy', say: { who: 'puddle', name: 'Puddle', text: 'Bye, {name}paw! I’ll miss being a log.' },
      board: 'Puddle sits on the moonlit grass on his two ENORMOUS feet, blue-grey and grinning, and wiggles his toes at our cat one last time' },
    { who: 'wisp', flag: 'foundWisp', out: 'nod', bye: 'draw', mood: 'happy', caption: 'Wisp says nothing. She draws a little cat in the earth: you.',
      board: 'Wisp, the quiet one, sits on the grass and draws with one claw, and in the earth in front of her a little cat appears, four legs, two ears and a tail' },
    { who: 'sleet', flag: 'foundSleet', out: 'sit', bye: 'point', mood: 'proud', say: { who: 'sleet', text: 'Roll call DONE. Goodbye, {name}paw. That’s an ORDER.', kind: 'shout' },
      board: 'Sleet, silver-white and very important, points one claw skyward like a captain giving orders, chest puffed out, eyes shining' },
    { who: 'hail', flag: 'foundHail', out: 'stand', bye: 'bounce', mood: 'happy', say: { who: 'hail', text: 'Bye, {name}paw! Can I come BACK? Can I bring the DOGS?' },
      board: 'Hail, speckled and bouncy, cannot keep still: she bounces on the grass with her tail wagging like a puppy’s, asking two things at once' },
    { who: 'mizzle', flag: 'foundMizzle', out: 'sit', bye: 'yawn', mood: 'sleepy', say: { who: 'mizzle', text: 'Bye-bye, {name}paw. The silver moss WORKED.' },
      board: 'Mizzle, pearly green, gives an enormous sleepy yawn on the grass, then smiles a slow smile at our cat with her eyes half shut' }
  ];

  var frames = {

    /* ------------------------------------------------------------------ Full moon */

    f001: {
      scene: S('den', 'inside', DEN_MORN,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'situp', 'wonder', 'nest', 'right'),
         c('tallyheart', 'peer', 'happy', 'doorway', 'left')], ['morning']),
      board: 'WIDE, INSIDE THE DEN, EARLY MORNING. The grey apprentice is still asleep in a curl across the den, and our cat sits up in its moss nest blinking; a big ginger head with a torn ear has poked in through the doorway, its whiskers twitching with news. Caption top left; her balloon a happy whisper.',
      caption: ['Tallyheart’s head pokes into the den.'],
      say: [{ who: 'tallyheart', text: 'Big day. Counts this morning. The Moon Ferry at dusk. And tonight, the Gathering.', kind: 'whisper' }],
      next: 'f002'
    },

    f002: {
      // the friend-near line for a water-worry cat, on the chapter's first screen (the same picture)
      when: WATER,
      scene: S('den', 'inside', DEN_MORN,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'situp', 'worried', 'nest', 'right'),
         c('tallyheart', 'peer', 'kind', 'doorway', 'left')], ['morning']),
      board: 'WIDE, INSIDE THE DEN, A WATER-WORRY CAT ONLY. Our cat’s ears go flat at the thought of a river in the dark, and a small inset over its head shows a wide river at night, silver under the moon; Tallyheart’s head in the doorway softens at once, her eyes warm and steady. Caption top left; her balloon gentle.',
      caption: ['The Moon Ferry. On the river. At NIGHT.'],
      say: [{ who: 'tallyheart', text: 'I’ll be right beside you. Every paw of the way.' }],
      next: 'f003'
    },

    f003: {
      scene: S('den', 'nest', DEN_MORN,
        [c('player', 'sit', 'wonder', 'nest', 'left')], ['morning', 'sparkle']),
      board: 'CLOSE-UP, THE NEST, MORNING. Our cat sits up in its nest with its whiskers standing out and its tail tip twitching, little sparkles of excitement round its ears; a small inset shows a round silver moon. Its Case File stands in rows along the mossy edge. Two captions in a column.',
      caption: ['Glintstar gave you one moon. Tonight, it’s over.', 'Your whiskers tingle.'],
      next: 'f004'
    },

    /* ------------------------------------------------------------------ Clutches of seven: nobody on the rim
     * (the clutch is news on the island: “Not a word to the Clan yet.”) */

    f004: {
      // the warm-up's hard pick comes first, so none of these lines is said again over it (`intro: false`)
      scene: S('hollow', 'wide', H9,
        [c('player', 'sit', 'happy', 'sunpatch-2', 'right'), c('tallyheart', 'sit', 'kind', 'tree-far', 'left', { size: 1.2 })], ['morning']),
      board: 'WIDE, THEN THE COUNTS. The sandy Training Hollow in the morning sun with nine claw marks on the leaning tree, and nobody at all on the rim; Tallyheart waits past the tree and our cat sits in the sun patch. In the Counts picture smiling spiders sit in rows, four legs on each side, none lit; after a miss she hops the sand by eights, four and four. Caption top left; the keypad sits below the panel.',
      caption: ['The Training Hollow is empty. Just you and Tallyheart.'],
      say: [{ who: 'tallyheart', text: 'Eights first, to wake up your whiskers.' }],
      counts: { set: 'ch10-eights', intro: false, next: 'f005' }
    },

    f005: {
      scene: S('hollow', 'lesson', H9,
        [c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THE HOLLOW. Tallyheart sits on the smooth sand with her chest out and a twinkle in her eye, and asks it like a riddle; our cat leans in across from her, ears up. The rim behind them is empty in the sunshine. Her balloon a little grand.',
      say: [{ who: 'tallyheart', text: 'Now, today’s Count. Your LAST new one. What comes in sevens?' }],
      next: 'f006'
    },

    f006: {
      scene: S('hollow', 'lesson', H9,
        [c('tallyheart', 'sit', 'happy', 'sand-left', 'right'), c('player', 'situp', 'shout', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, COMEDY BEAT. Our cat bounces up onto its haunches with the answer bursting out, and a small inset shows a clutch of seven little misty dragonets in a row; Tallyheart nods, very pleased. Caption top left; our cat’s balloon a shout, hers warm.',
      caption: ['You KNOW.'],
      say: [
        { who: 'player', text: 'Sprinkle’s clutch! Sprinkle, and her six brothers and sisters!', kind: 'shout' },
        { who: 'tallyheart', text: 'A clutch of seven. Exactly.' }
      ],
      next: 'f007'
    },

    f007: {
      // the five clutches: the counting picture draws the lesson's clutches (the spec's section 7, item 2)
      scene: S('hollow', 'sand', H9,
        [c('tallyheart', 'crouch', 'happy', 'sand-left', 'right', { claws: true }), c('player', 'crouch', 'wonder', 'sand-right', 'left')], ['morning']),
      board: 'CLOSE-UP, ON THE SAND, THE TAP PICTURE. Tallyheart crouches over the smooth sand with her claws out, scratching five little clutches of dragonets, seven in each, a row of four over a row of three; our cat crouches nose down across from her. In play the counting picture takes the panel: five clutches, the first glowing; each tap lights its seven and a big number grows by seven, 7, 14, 21, 28, 35. Caption top left; her balloon short.',
      caption: ['In the sand, Tallyheart scratches five clutches of little dragonets, seven in each.'],
      say: [{ who: 'tallyheart', text: 'Hop by sevens.' }],
      skip: { table: 7, groups: 5, thing: 'dragonet', things: 'dragonets', teacher: 'tallyheart', label: 'Count the next clutch.', prompt: '**Tap** the clutches.', carry: false, next: 'f008' }
    },

    f008: {
      // the tree's one pair: her line, then our cat's (chapter 9's tree Tap, made one pair); 49 is never said
      scene: S('hollow', 'wide', H9,
        [c('player', 'sit', 'wonder', 'sunpatch-2', 'right'), c('tallyheart', 'sit', 'happy', 'tree-far', 'left', { size: 1.2, glow: true })], ['morning']),
      board: 'WIDE, THE TAP PICTURE. Tallyheart sits past the leaning tree with its nine claw marks plain on the trunk, glowing softly with a secret, and our cat sits bolt upright in the sun patch with its mouth open. In play one tap on her letters her line and our cat’s run of sevens in its own balloon, stumbling at the one it does not know; then the page turns. Her balloon low; our cat’s a squeak.',
      say: [
        { who: 'tallyheart', text: 'Thirty-five! Now, a secret. You already know the sevens. ALL of them but one. One from every mark on this tree.' },
        { who: 'player', text: 'ALL of them?', kind: 'shout' }
      ],
      ask: {
        who: 'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Say the sevens with her.',
        pairs: [['Say them with me. Seven…', 'Fourteen, twenty-one, twenty-eight, thirty-five, forty-two… um… fifty-six, sixty-three, seventy!']],
        next: 'f009'
      }
    },

    f009: {
      // her balloon is read on the frame and not again (`intro: false`): 2 × 7's own line is the first question's
      scene: S('hollow', 'lesson', H9,
        [c('tallyheart', 'sit', 'proud', 'sand-left', 'right'), c('player', 'sit', 'happy', 'sand-right', 'left')], ['morning']),
      board: 'MEDIUM TWO-SHOT, THEN THE COUNTS. Tallyheart sweeps the sand smooth between them for the one new fact. In the Counts picture that many clutches of seven little dragonets sit in tidy rows, a row of four over a row of three in each, none lit; after a miss she scratches seven marks for every clutch, four and three, and hops them by sevens. Her balloon warm; the keypad sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Only one is new. Seven clutches. Seven sevens. We’ll hop to it.' }],
      counts: { set: 'ch10-sevens', intro: false, next: 'f010' }
    },

    f010: {
      // the tree close-up with nobody in it (chapters 6 to 9's): a stretching cat's forepaws would cover the tenth mark
      scene: S('hollow', 'tree', H10, [], ['morning']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel and score a tenth claw mark into the bark under the other nine; the marks stand four, four and two now, the older ones deeper and darker than the new one. The SKRITCH runs along the new scratch; captions top left.',
      caption: ['Tallyheart stretches up the leaning tree.', 'A tenth claw mark.'],
      sfx: 'SKRITCH!',
      next: 'f011'
    },

    f011: {
      // in the wide view, where the ten marks show; her line written twice by lessonClean (one balloon of hers)
      scene: S('hollow', 'wide', H10,
        [c('player', 'sit', 'proud', 'sunpatch-2', 'right'), c('tallyheart', 'sit', 'proud', 'tree-far', 'left', { size: 1.2 })], ['morning']),
      board: 'WIDE. Ten claw marks on the leaning tree now, and Tallyheart sitting past the trunk with her torn ear tipped across the empty Hollow toward our cat. A cat who never needed the sand gets her highest praise; a cat who did says it plainly, and Tallyheart answers it warmly. Her balloons proud; our cat’s honest.',
      say: [
        { who: 'tallyheart', text: 'Clutches of seven. That’s your tenth Count. Every Count a warrior needs. Not one miss. Not even the new one.', when: { lessonClean: 'ch10-sevens' } },
        { who: 'tallyheart', text: 'Clutches of seven. That’s your tenth Count. Every Count a warrior needs.', when: { not: { lessonClean: 'ch10-sevens' } } },
        { who: 'player', text: 'Some were tricky.', when: { not: { lessonClean: 'ch10-sevens' } } },
        { who: 'tallyheart', text: 'And you kept going. That’s the whole secret.', when: { not: { lessonClean: 'ch10-sevens' } } }
      ],
      next: 'f012'
    },

    /* ------------------------------------------------------------------ The Moon Ferry */

    f012: {
      scene: S('ferry', 'shore', SHORE,
        [c('tallyheart', 'walk', 'happy', 'bank-3', 'right'), c('otter', 'stand', 'kind', 'pole', 'left', { variant: 3, holds: 'pole' }),
         c('riffle', 'hop', 'shout', 'log-1', 'left'), c('player', 'walk', 'wonder', 'bank-1', 'right')], ['dusk']),
      board: 'WIDE, THE CROSSING AT DUSK. Rose and lilac light over the river, the round moon just up over the water, and the otters’ long line of log rafts tied along the flat stones; the whole Clan pads down to them, and on the front raft Riffle hops up and down while Granny, a sandy otter, leans on a long pole at its far end. Caption top left; his balloon a shout.',
      caption: ['At dusk, the whole Clan pads down to the Crossing, to the otters’ long line of rafts.'],
      say: [{ who: 'riffle', text: 'The MOON FERRY! Granny’s steering. Everybody ON!', kind: 'shout' }],
      next: 'f013'
    },

    f013: {
      scene: S('ferry', 'shore', SHORE,
        [c('tallyheart', 'walk', 'happy', 'bank-3', 'right'), c('otter', 'stand', 'kind', 'pole', 'left', { variant: 3, holds: 'pole' }),
         c('riffle', 'stand', 'happy', 'log-1', 'left'), c('player', 'walk', 'proud', 'bank-1', 'right', { holds: 'leaf', holdAt: 'mouth' })], ['dusk']),
      board: 'MEDIUM, THE STONES AT DUSK. Our cat pads down the stones carrying a folded leaf in its mouth, very careful and very proud, and a small inset shows the piece of tower glass wrapped safe inside it. The rafts wait at the water’s edge. One caption at the top.',
      caption: ['Your glass is with you, safe in its leaf. For proof.'],
      next: 'f014'
    },

    f014: {
      // a water-worry cat: four paws aboard, one a tap, Tallyheart counting (chapter 5's own skip); its twin, f015
      when: WATER, else: 'f015',
      scene: S('ferry', 'shore', SHORE,
        [c('otter', 'stand', 'kind', 'pole', 'left', { variant: 3, holds: 'pole' }), c('riffle', 'stand', 'happy', 'log-1', 'left'),
         c('tallyheart', 'sit', 'kind', 'bank-1', 'right'), c('player', 'stand', 'worried', 'edge', 'right')], ['night']),
      board: 'MEDIUM, AT THE STONES’ EDGE, A WATER-WORRY CAT ONLY, THE TAP PICTURE. The round moon has come up over the river, which shines silver-blue and bright, and our cat stands at the very edge of the stones with all four paws planted, Tallyheart close behind it. In play the counting picture takes the panel: its own four paws at the edge, the next one glowing; each tap sets one down on the logs and Tallyheart counts it in words. Caption top left; her balloon steady.',
      caption: ['The full moon comes up, big and round. The river shines silver-blue.'],
      say: [{ who: 'tallyheart', text: 'One paw at a time. I’ll count.' }],
      skip: { table: 1, groups: 4, paws: 'board', teacher: 'tallyheart', carry: false, prompt: '**Tap** each paw onto the raft.', next: 'f016' }
    },

    f015: {
      when: NOT_WATER,
      scene: S('ferry', 'shore', SHORE,
        [c('otter', 'stand', 'kind', 'pole', 'left', { variant: 3, holds: 'pole' }), c('riffle', 'stand', 'happy', 'log-1', 'left'),
         c('tallyheart', 'sit', 'kind', 'bank-1', 'right'), c('player', 'walk', 'happy', 'edge', 'right', { tap: 'paw' })], ['night']),
      board: 'MEDIUM, AT THE STONES’ EDGE, NOT FOR A WATER-WORRY CAT, THE TAP PICTURE. The round moon has come up over the river, which shines silver-blue and bright, and our cat steps up to the front raft’s near logs with one paw lifted, Riffle waiting aboard. In play its lifted front paw glows softly; one tap steps it aboard and turns the page. Caption top left.',
      caption: ['The full moon comes up, big and round. The river shines silver-blue.'],
      scratch: { tap: 'paw', prompt: '**Tap** to step aboard.', label: 'Step aboard.', next: 'f017' }
    },

    f016: {
      when: WATER,
      // (no Clan crowd on this medium shot: its nearest seats were the biggest figures in the panel, in front of her)
      scene: S('ferry', 'deck', { moon: 14, luggage: true },
        [c('otter', 'stand', 'kind', 'pole', 'right', { variant: 3, holds: 'pole' }), c('player', 'sit', 'proud', 'front', 'right'),
         c('tallyheart', 'sit', 'kind', 'beside', 'left'), c('riffle', 'sit', 'happy', 'back', 'left')], ['night']),
      board: 'MEDIUM, ABOARD BY MOONLIGHT, A WATER-WORRY CAT ONLY. Our cat sits on the logs of the front raft with all four paws aboard and its chin up, astonished at itself, and Tallyheart sits close at its side; the river all round is silver under the full moon. One caption at the top.',
      caption: ['One. Two. Three. FOUR. You’re ON. Tallyheart is right beside you.'],
      next: 'f017'
    },

    f017: {
      scene: S('ferry', 'back', BACK,
        [c('tallyheart', 'sit', 'wonder', 'back-2', 'right'), c('riffle', 'hush', 'happy', 'heap', 'left'), c('player', 'sit', 'wonder', 'back-3', 'right')], ['night']),
      board: 'MEDIUM, THE BACK OF THE RAFT, COMEDY BEAT. A big round heap of loose green-gold reeds takes up the back of the raft, and a little cloud of mist has just puffed out of its top; Riffle stands in front of it with a paw to his lips, far too innocent. Our cat and Tallyheart stare. Captions top left; his balloon a hasty whisper.',
      caption: ['At the very back sits a big heap of reeds.', 'The heap burps. A little cloud of mist puffs out.'],
      say: [{ who: 'riffle', text: 'That’s… luggage. VERY important luggage.' }],
      next: 'f018'
    },

    f018: {
      scene: S('ferry', 'back', BACK,
        [c('glintstar', 'lookup', 'kind', 'back-2', 'right'), c('riffle', 'hush', 'happy', 'heap', 'left'),
         c('tallyheart', 'lookup', 'kind', 'back-3', 'right'), c('otter', 'stand', 'kind', 'back-1', 'right', { variant: 3, holds: 'pole' })], ['night']),
      board: 'MEDIUM, THE BACK OF THE RAFT, COMEDY BEAT. The grown-ups who know: Granny the sandy otter gives the heap a slow wink, and Tallyheart and Glintstar both lift their faces to the moon at exactly the same moment, as if the sky were very interesting. Riffle keeps guard. One caption at the top.',
      caption: ['Granny winks. Tallyheart looks at the sky. So does Glintstar.'],
      next: 'f019'
    },

    f019: {
      // the low raft, a pair by `foundPuddle`: his foot between the logs, or Riffle's “LOG thing” (f020)
      when: { foundPuddle: true }, else: 'f020',
      scene: S('ferry', 'low', LOW,
        lowCats(['sit', 'happy'], { riffle: ['sit', 'laugh'], gap: ['foot', 'happy'] }), ['night']),
      board: 'LOW ANGLE, AT CAT HEIGHT ON THE LOGS, ONLY FOR A CAT WHO HAS FOUND PUDDLE. The front raft rides so low that the silver water laps right at the logs’ tops, and in the gap between two logs a huge blue-grey foot waves up out of the water; our cat grins at it. Captions top left; the blub small; his balloon a whisper from under the logs.',
      caption: ['The front raft rides low. Very low.', 'Between the logs, a big blue-grey foot waves.'],
      say: [{ who: 'puddle', name: 'Puddle', text: 'Tonight I’m a FAST log!', kind: 'whisper' }],
      sfx: 'Blub.',
      next: 'f021'
    },

    f020: {
      when: { foundPuddle: false },
      scene: S('ferry', 'low', LOW,
        lowCats(['sit', 'wonder'], { riffle: ['hush', 'worried'] }), ['night']),
      board: 'LOW ANGLE, AT CAT HEIGHT ON THE LOGS, ONLY FOR A CAT WHO HAS NEVER FOUND PUDDLE. The front raft rides so low that the silver water laps right at the logs’ tops, and a bubble pops in the gap between two logs; Riffle answers much too fast, his eyes darting. Caption top left; the blub small; his balloon a gabble.',
      caption: ['The front raft rides low. Very low.'],
      say: [{ who: 'riffle', text: 'Logs ride low. It’s a LOG thing.' }],
      sfx: 'Blub.',
      next: 'f021'
    },

    f021: {
      when: WATER,
      scene: S('ferry', 'low', LOW,
        lowCats(['sit', 'proud'], { tally: ['sit', 'kind'] }), ['night']),
      board: 'MEDIUM, ON THE LOGS, A WATER-WORRY CAT ONLY. Tallyheart sits on the low logs as calm as a stone, not one whisker moving, and our cat copies her exactly, chin up, the silver water lapping at the logs. One caption at the top.',
      caption: ['Tallyheart doesn’t even blink. So you don’t either.'],
      next: 'f022'
    },

    f022: {
      // the choice only a cat who has never found Puddle sees; everyone else goes straight to the push-off
      when: { foundPuddle: false }, else: 'f032',
      scene: S('ferry', 'low', LOW,
        lowCats(['sit', 'wonder'], { riffle: ['whistle', 'neutral'] }), ['night']),
      board: 'LOW ANGLE, AT CAT HEIGHT, ONLY FOR A CAT WHO HAS NEVER FOUND PUDDLE, THE CHOICE. The gap between the two middle logs is a wedge of silver water with rings still spreading, and our cat looks at it hard; Riffle whistles a little tune with his eyes on the sky. Nobody is in the gap. The choices sit below the panel.',
      choice: {
        options: [
          { label: 'Peek between the logs.', sets: {}, next: 'f023' },
          { label: 'Sit tight.', sets: {}, next: 'f032' }
        ]
      }
    },

    /* ------------------------------------------------------------------ Under the raft: f023…f031, the optional
     * scene, for a cat who has never found Puddle, before the Moon Ferry pushes off. His balloons are “Two big
     * eyes” until his feet come up, then chapter 5's “The big-footed dragon” until “I’m Puddle.”; whatever he
     * and our cat say of Sprinkle is whispered. Its last screen (f031) sets `foundPuddle` and `ch10Puddle`. */

    f023: {
      scene: S('ferry', 'low', MOON,
        lowCats(['flat', 'wonder', null, 'lie'], { riffle: ['sit', 'wonder'], gap: ['eyes', 'wonder'] }), ['night']),
      board: 'LOW ANGLE, ON THE LOGS, THE OPTIONAL SCENE. Our cat lies flat on the logs with its chin over the gap, peering down into the silver water, and out of it two big round eyes and the top of a blue-grey head look straight back up; Riffle and Tallyheart sit beside it, busy with the Clan. Captions top left; the blub small; the balloon a tiny hello.',
      caption: [
        'You lie flat on the logs and peek down between them. Up front, the Clan is busy finding seats.',
        { when: WATER, text: 'Your nose is VERY close to the river. You peek anyway.' },
        'Two big eyes look up at you, out of the silver water.'
      ],
      say: [{ who: 'puddle', name: 'Two big eyes', text: 'Hello.' }],
      sfx: 'Blub.',
      next: 'f024'
    },

    f024: {
      scene: S('ferry', 'under', MOON, underCats('eyes', 'wonder', 'wonder'), ['night']),
      board: 'HIGH ANGLE, STRAIGHT DOWN INTO THE GAP. Silver water fills the panel with the moon’s round reflection in it, and in the middle two big round eyes float very still, very sure of themselves; at the top edge our cat’s head and forepaws lean over the logs. A bubble rises. Three balloons, the eyes’ calm, our cat’s doubtful.',
      say: [
        { who: 'puddle', name: 'Two big eyes', text: 'I’m a log.' },
        { who: 'player', text: 'Logs don’t have eyes.' },
        { who: 'puddle', name: 'Two big eyes', text: 'This one does.' }
      ],
      sfx: 'Blub.',
      next: 'f025'
    },

    f025: {
      scene: S('ferry', 'under', MOON, underCats('log', 'happy', 'happy'), ['night']),
      board: 'HIGH ANGLE, INTO THE GAP, COMEDY BEAT. Up out of the silver water pops a whole blue-grey dragonet head with a wide grin, and then, floating up beside it, two ENORMOUS webbed feet, waggling; our cat’s eyes go round at the top edge. One caption at the top.',
      caption: ['Up pops a blue-grey head. Then two ENORMOUS feet.'],
      next: 'f026'
    },

    f026: {
      // his riddle: chapter 5's set, run as chapter 5 ran it; its balloon is said again over the question (the default)
      scene: S('ferry', 'under', MOON, underCats('head', 'happy', 'wonder'), ['night']),
      board: 'HIGH ANGLE, INTO THE GAP, THEN THE COUNTS. The blue-grey head bobs in the silver water and asks a riddle, very pleased with it. In the Counts picture four logs lie side by side from underneath, ten bumps on each, none lit; after a miss our cat hops them by tens, a log at a time. His balloon bouncy; the keypad sits below the panel.',
      say: [{ who: 'puddle', text: 'Want a log riddle?' }],
      counts: { set: 'ch05-puddle', next: 'f027' }
    },

    f027: {
      // “I'm Puddle.”: from this balloon on, his balloons carry his name
      scene: S('ferry', 'under', MOON, underCats('head', 'proud', 'kind'), ['night']),
      board: 'HIGH ANGLE, INTO THE GAP. The blue-grey dragonet introduces himself with his chin up, and our cat leans right down over the logs to whisper the news; at the name his eyes go huge and a burst of bubbles boils up round him. Three balloons, his proud, our cat’s whisper, his a whispered squeak.',
      say: [
        { who: 'puddle', name: 'Puddle', text: 'I’m Puddle. Mama says stay where you land. I landed under a raft.' },
        { who: 'player', text: 'Sprinkle’s safe. She’s in the luggage.', kind: 'whisper' },
        { who: 'puddle', name: 'Puddle', text: 'Sprinkle?', kind: 'whisper' }
      ],
      sfx: 'Blub blub!',
      next: 'f028'
    },

    f028: {
      // his card: chapter 5's, the same id and line, given again here to a cat who meets him
      card: 'puddle-paws',
      scene: S('ferry', 'under', MOON, underCats('head', 'wonder', 'wonder'), ['night']),
      board: 'HIGH ANGLE, INTO THE GAP. Puddle tells it with his eyes wide, treading the silver water, and a thought cloud over his head shows the storm night: a flash of lightning over a garden, and two small clever paws lifting a mouse, nothing more of their owner. His balloon breathless; the new card appears under the panel, an ear in its corner.',
      say: [{ who: 'puddle', name: 'Puddle', text: 'On the storm night, in a flash, I saw something with clever little paws, picking up mice. Very tidy.' }],
      next: 'f029'
    },

    f029: {
      scene: S('ferry', 'low', MOON,
        lowCats(['sit', 'happy'], { riffle: ['sit', 'happy'], gap: ['head', 'happy'] }), ['night']),
      board: 'LOW ANGLE, ON THE LOGS. Puddle’s head pokes up between the logs, and he shouts his message as loudly as anybody can while whispering, cheeks puffed out; our cat, Riffle and Tallyheart sit round the gap trying not to laugh. His balloon a whisper in big letters.',
      say: [{ who: 'puddle', name: 'Puddle', text: 'Tell Sprinkle: FIVE!', kind: 'whisper' }],
      next: 'f030'
    },

    f030: {
      scene: S('ferry', 'low', MOON,
        lowCats(['sit', 'laugh'], { riffle: ['sit', 'laugh'], gap: ['head', 'wonder'] }), ['night']),
      board: 'LOW ANGLE, ON THE LOGS, COMEDY BEAT. From the back of the raft the reed heap gives one small happy burp, and a tiny puff of mist floats up from it in the moonlight; Puddle’s eyes go round in the gap. Our cat and Riffle giggle. Caption top left; his balloon a whisper.',
      caption: ['From the luggage: a happy burp.'],
      say: [{ who: 'puddle', name: 'Puddle', text: 'Oh. She HEARD.', kind: 'whisper' }],
      next: 'f031'
    },

    f031: {
      // his last screen: `foundPuddle` and `ch10Puddle`, for good, by reaching it; our cat's wave is the Tap
      sets: { foundPuddle: true, ch10Puddle: true },
      scene: S('ferry', 'low', MOON,
        lowCats(['pawup', 'happy', { tap: 'paw' }], { riffle: ['sit', 'happy'], gap: ['foot', 'happy'] }), ['night']),
      board: 'LOW ANGLE, ON THE LOGS, THE TAP PICTURE. Puddle has bobbed down and popped up again, and his huge blue-grey foot waves up out of the gap; our cat sits on the logs with one forepaw raised. In play its raised paw glows softly; one tap waves goodbye, the foot waves back, and the page turns. Caption top left; his balloon a whisper.',
      caption: ['He sinks, and pops up again.'],
      say: [{ who: 'puddle', name: 'Puddle', text: 'FIVE anyway!', kind: 'whisper' }],
      scratch: { tap: 'paw', prompt: '**Tap** to wave to Puddle.', label: 'Wave to Puddle.', next: 'f032' }
    },

    /* ------------------------------------------------------------------ the push-off, every cat */

    f032: {
      // the Moon Ferry Counts: every voice of the set is aboard, in the picture (Tallyheart and the six who cheer)
      scene: S('ferry', 'deck', DECK,
        [c('otter', 'stand', 'kind', 'pole', 'right', { variant: 3, holds: 'pole' }), c('glintstar', 'sit', 'solemn', 'seat-4', 'left'),
         c('thymeleaf', 'sit', 'kind', 'seat-3', 'right'), c('snorer', 'sit', 'worried', 'seat-5', 'left'), c('murmurchime', 'sit', 'happy', 'seat-2', 'right'),
         c('player', 'sit', 'worried', 'front', 'right'), c('tallyheart', 'sit', 'kind', 'beside', 'left'), c('grizzled', 'sit', 'solemn', 'seat-1', 'right'),
         c('riffle', 'sit', 'happy', 'back', 'left')], ['night']),
      board: 'WIDE, ABOARD, THEN THE COUNTS. The Moon Ferry glides upriver under the full moon, Granny poling at the front and the Clan sitting very straight along the logs, nobody saying a word; Tallyheart turns to our cat with a grin. In the Counts picture each question is one of her Counts in its own picture, unlit; after a miss Tallyheart scratches it on a log and hops it with her. Captions top left; her balloon brave; the keypad sits below the panel.',
      caption: ['Granny pushes off with her long pole, and the Moon Ferry glides upriver.', 'Nobody says a word. Big Gathering nerves.'],
      say: [{ who: 'tallyheart', text: 'At my first Gathering, I was so nervous, I counted EVERYTHING. Out loud. So let’s count.' }],
      counts: { set: 'ch10-ferry', intro: false, next: 'f033' }
    },

    f033: {
      // the brave look, a pair by `worry`: the water cat's look down at the river (f034 its twin)
      when: WATER, else: 'f034',
      scene: S('ferry', 'low', MOON,
        [c('player', 'peer', 'happy', 'sit-1', 'right'), c('tallyheart', 'sit', 'kind', 'sit-2', 'left')], ['night']),
      board: 'LOW ANGLE, AT THE RAFT’S EDGE, A WATER-WORRY CAT ONLY. Our cat leans right over the logs on purpose and looks down into the river, deep and silver and full of the moon’s reflection, and finds it is smiling; Tallyheart watches with one eyebrow up. Captions top left; her balloon dry, our cat’s cheerful.',
      caption: ['You look down at the river, on purpose.', 'Deep, and silver, and full of moon. You forgot to be scared!'],
      say: [
        { who: 'tallyheart', text: 'Nerves?' },
        { who: 'player', text: 'What nerves?' }
      ],
      next: 'f035'
    },

    f034: {
      when: NOT_WATER,
      scene: S('ferry', 'low', MOON,
        [c('player', 'peer', 'happy', 'sit-1', 'right'), c('tallyheart', 'sit', 'kind', 'sit-2', 'left')], ['night']),
      board: 'LOW ANGLE, AT THE RAFT’S EDGE, NOT FOR A WATER-WORRY CAT. Our cat leans over the logs and looks at the river, silver and full of the moon, as the last of the Counts settles; Tallyheart watches it with one eyebrow up. Two balloons, hers dry, our cat’s cheerful.',
      say: [
        { who: 'tallyheart', text: 'Nerves?' },
        { who: 'player', text: 'What nerves?' }
      ],
      next: 'f035'
    },

    /* ------------------------------------------------------------------ Gathering Island */

    f035: {
      scene: S('island', 'shore', ARRIVE,
        [c('otter', 'stand', 'happy', 'raft', 'right', { variant: 3, holds: 'pole' }), c('tallyheart', 'walk', 'solemn', 'land-2', 'right'),
         c('player', 'walk', 'wonder', 'land-1', 'right'), c('riffle', 'scramble', 'happy', 'drag', 'right')], ['night']),
      board: 'WIDE, THE ISLAND’S SHORE, NIGHT. The Moon Ferry has bumped onto a round island’s pebbly shore under a huge moon, and up the slope the crown of one great tree spreads over a clearing full of cats; our cat steps off onto the mud, and behind it Riffle hauls the reed heap up out of the water. Captions top left; the giggle lettered small by the heap.',
      caption: ['The Moon Ferry bumps onto Gathering Island. Under one great tree, every Clan is here.', 'Riffle and Granny drag the luggage up behind you. It giggles.'],
      next: 'f036'
    },

    f036: {
      // ReedClan's patrol at the ring's front from here on: Sloshbank, the she-cat and the young tom
      scene: S('island', 'wide', HEAP,
        [reed().slosh, reed().she, c('tallyheart', 'sit', 'proud', 'crowd-1', 'right'), c('player', 'sit', 'wonder', 'centre', 'right'),
         c('riffle', 'sit', 'happy', 'crowd-2', 'right'), reed().tom], ['night']),
      board: 'WIDE, THE CLEARING UNDER THE GREAT TREE. A ring of cats from every Clan sits round the moonlit grass under the great tree, and the three big roots behind are still empty; a huge mud-brown tom at the front of the marsh cats nods once at CrystalClan, water dripping off his belly fur. Our cat sits very still in the middle. The drip lettered small; his balloon one word.',
      say: [{ who: 'sloshbank', text: 'CrystalClan.' }],
      sfx: 'Drip.',
      next: 'f037'
    },

    f037: {
      when: { worry: 'small' },
      scene: S('island', 'wide', HEAP,
        [reed().slosh, reed().she, c('tallyheart', 'sit', 'kind', 'crowd-1', 'right'), c('player', 'situp', 'proud', 'centre', 'right'),
         c('riffle', 'sit', 'happy', 'crowd-2', 'right'), reed().tom], ['night']),
      board: 'WIDE, THE CLEARING, A CAT WHO WORRIES ABOUT BEING SMALL ONLY. All round the ring the cats of three Clans tower over our cat, and our cat sits up as tall as it can go in the middle of the grass, ears straight up, chin high. One caption at the top.',
      caption: ['So many cats, and you’re the smallest. You sit up very tall.'],
      next: 'f038'
    },

    f038: {
      scene: S('island', 'wide', HEAP,
        [c('groveclan', 'sit', 'happy', 'elder', 'right', { variant: 1 }), reed().slosh, reed().she, c('tallyheart', 'sit', 'proud', 'crowd-1', 'right'),
         c('player', 'sit', 'wonder', 'centre', 'right'), c('riffle', 'sit', 'happy', 'crowd-2', 'right'), reed().tom], ['night']),
      board: 'WIDE, THE CLEARING. At the back of the ring an old dappled she-cat with a white muzzle spots Tallyheart and her whiskers twitch with an old joke; Tallyheart looks down her nose. Our cat looks from one to the other. Caption top left; the elder’s balloon dry, Tallyheart’s one word.',
      caption: ['The GroveClan elder spots Tallyheart.'],
      say: [
        { who: 'groveclan', text: 'Still counting out loud?' },
        { who: 'tallyheart', text: 'Hmph.' }
      ],
      next: 'f039'
    },

    f039: {
      scene: S('island', 'wide', HEAP,
        [c('groveclan', 'sit', 'kind', 'elder', 'right', { variant: 1 }), reed().slosh, reed().she, c('tallyheart', 'sit', 'kind', 'crowd-1', 'right'),
         c('player', 'crouch', 'kind', 'centre', 'left', { tap: 'nose' }), c('riffle', 'sit', 'happy', 'crowd-2', 'right'), reed().tom], ['night']),
      board: 'WIDE, THE CLEARING, THE TAP PICTURE. The old GroveClan elder turns her sharp eyes on our cat and remembers it from the woods; our cat ducks its head, nose low. In play its nose glows softly; one tap dips its head very politely and turns the page. Her balloon pleased.',
      say: [{ who: 'groveclan', text: 'And the polite one.' }],
      scratch: { tap: 'nose', prompt: '**Tap** to dip your head, very politely.', label: 'Dip your head.', next: 'f040' }
    },

    f040: {
      // the leaders take their roots
      scene: S('island', 'roots', CROWD,
        rootsCats(['lookup', 'wonder', null, 'near'], { near: [c('tallyheart', 'sit', 'solemn', 'near-2', 'left')] }), ['night']),
      board: 'LOW ANGLE, THE GREAT TREE’S ROOTS. Three big roots run out from the trunk like arms, and on each sits a leader: a broad russet tom with a notched ear on the left, Glintstar silver in the middle, a tall dappled she-cat on the right; the moon shines down through the crown. Our cat looks up from below. Caption top left; Glintstar’s balloon solemn.',
      caption: ['Three leaders sit on three big roots of the great tree.'],
      say: [{ who: 'glintstar', text: 'Tonight is the truce. Under the Accord, nobody hunts anybody. And every Clan hears the dragon’s case.' }],
      next: 'f041'
    },

    f041: {
      // Reynard's arrival is chapter 8's trot (he has no walk); Snatch has a mouse, of course
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'stand', 'neutral', 'weasel-2', 'left', { wet: true, holds: 'mouse' }), c('reynard', 'trot', 'proud', 'fox', 'left', { wet: true }),
         c('snip', 'stand', 'neutral', 'weasel-1', 'left', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE, COMEDY BEAT. Up the bank from the silver river trots a red fox with his tail held high, rather too pleased with himself and dripping wet, his fur flattened in spikes; two skinny weasels drip along behind him, and one has a mouse in his mouth. Captions top left.',
      caption: ['Up from the river comes a fox. A rather DAMP fox.', 'Snip and Snatch drip along behind him. Snatch is holding a mouse. Of course he is.'],
      next: 'f042'
    },

    f042: {
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'stand', 'neutral', 'weasel-2', 'left', { wet: true, holds: 'mouse' }), c('reynard', 'bow', 'happy', 'fox', 'left', { wet: true }),
         c('snip', 'stand', 'neutral', 'weasel-1', 'left', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE. The fox sweeps into a long, low bow to the whole clearing, one forepaw forward and his damp tail flourished up behind him, charming and vain; the weasels stand dripping behind him. His balloon smooth as butter.',
      say: [{ who: 'reynard', text: 'Good evening, my dear Clans! And Glintstar, what lovely FUR. Nearly as lovely as mine.' }],
      next: 'f043'
    },

    f043: {
      scene: S('island', 'wide', HEAP,
        clearing({ leaders: leaders('solemn', ['sit', 'stern']), edge: edge(['sit', 'proud'], ['stand', 'neutral'], ['stand', 'neutral']), player: ['sit', 'wonder'] }), ['night']),
      board: 'WIDE, THE CLEARING. Glintstar sits on her root in the middle without one whisker of a smile, and every Clan looks from her to the damp fox at the river edge; our cat sits in the middle of the grass with its ears up. Caption top left; her balloon level and cool.',
      caption: ['Glintstar does not smile.'],
      say: [{ who: 'glintstar', text: 'Reynard, tell your story. {name}paw will answer it.' }],
      next: 'f044'
    },

    f044: {
      scene: S('island', 'wide', HEAP,
        clearing({ edge: edge(['chest', 'laugh'], ['stand', 'neutral'], ['stand', 'neutral']), player: ['sit', 'shy'] }), ['night']),
      board: 'WIDE, THE CLEARING. The fox puffs out his chest and laughs at the little cat in the middle, and the ring murmurs; on her root Glintstar answers in two words, calm as the moon. The reed heap sits at the clearing’s left edge. Two balloons, his sneering, hers short.',
      say: [
        { who: 'reynard', text: 'A PILLOW cat? How SWEET. And where is your DRAGON?' },
        { who: 'glintstar', text: 'She’s here.' }
      ],
      next: 'f045'
    },

    f045: {
      scene: S('island', 'wide', merge(HEAP, { tap: 'reeds' }),
        clearing({ player: ['sit', 'proud'] }), ['night']),
      board: 'WIDE, THE CLEARING, THE TAP PICTURE. Glintstar nods down from her root to our cat, and every head in the ring turns to the lumpy reed heap at the clearing’s left edge. In play the heap glows softly; one tap pulls the reeds away and turns the page. One caption at the top.',
      caption: ['She nods to you.'],
      scratch: { tap: 'reeds', prompt: '**Tap** to pull the reeds off the luggage.', label: 'Pull the reeds off.', next: 'f046' }
    },

    f046: {
      // her kept line, the same balloon written twice by `ch3Told` (one balloon of hers)
      scene: S('island', 'wide', OPEN,
        clearing({ player: ['sit', 'kind'], tallyAt: 'crowd-2' }).concat([c('sprinkle', 'sit', 'shy', OUT, 'right')]), ['night']),
      board: 'WIDE, THE CLEARING. The reeds lie pulled off in a loose pile, and out of them shuffles a misty grey dragonet with one wing drooping, much smaller than anybody expected, looking at her paws; the whole ring stares. Caption top left; her balloon very small.',
      caption: ['Out shuffles Sprinkle, her hurt wing drooping.'],
      say: [
        { who: 'sprinkle', text: 'Hello. I didn’t take your prey. I only ate Riffle’s fish.', when: TOLD },
        { who: 'sprinkle', text: 'Hello. I didn’t take your prey. I only ate Riffle’s fish. And one vole. {name}paw gave it to me.', when: KEPT }
      ],
      next: 'f047'
    },

    f047: {
      scene: S('island', 'wide', OPEN,
        clearing({ player: ['walk', 'kind', { tap: 'paw' }, 'left'], tallyAt: 'crowd-2' }).concat([c('sprinkle', 'sit', 'shy', OUT, 'right')]), ['night']),
      board: 'WIDE, THE CLEARING, THE TAP PICTURE, COMEDY BEAT. Every cat in the ring melts at once, heads tipped, and on the left root the broad ReedClan leader peers down in disbelief at the small grey dragonet; our cat is already walking over to her. In play its lifted paw glows softly; one tap sits it close beside Sprinkle and turns the page. Caption top left; his balloon astonished.',
      caption: ['Every Clan gasps. Then every Clan goes, “Awww.”'],
      say: [{ who: 'reedclan', text: 'THAT’S the dragon?' }],
      scratch: { tap: 'paw', prompt: '**Tap** to sit beside her.', label: 'Sit beside Sprinkle.', next: 'f048' }
    },

    f048: {
      // Reynard's THERE! points with his nose (`think`), from where he stands
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'kind'], { rey: ['think', 'shout'], sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT IN THE CLEARING. Our cat sits close beside Sprinkle, who makes herself as small as a dragon can, and whispers to her; across the grass at the river edge the fox stretches out his nose at them both from where he stands. Two balloons, our cat’s a whisper, his a cry.',
      say: [
        { who: 'player', text: 'I’m right here.', kind: 'whisper' },
        { who: 'reynard', text: 'THERE! There’s your THIEF!', kind: 'shout' }
      ],
      next: 'f049'
    },

    /* ------------------------------------------------------------------ The case */

    f049: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'worried'], { sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT. Every face in the ring behind is turned on our cat, eyes shining in the moonlight, and the fox at the river edge waits with his head on one side. Our cat swallows. One caption at the top.',
      caption: ['Every eye in the clearing is on you.'],
      next: 'f050'
    },

    f050: {
      when: { specialty: 'noticing' },
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'sniff'], { snatch: ['up', 'neutral'], sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, A NOTICING CAT ONLY. Our cat’s nose twitches toward the river edge, where the skinny weasel sits up with his mouse in his paws, and a curl of smell drifts over from it; a small inset shows CrystalClan’s prey pile. Our cat narrows its eyes. One caption at the top.',
      caption: ['You notice the mouse in Snatch’s paws. It smells of YOUR camp.'],
      next: 'f051'
    },

    f051: {
      when: { specialty: 'climbing' },
      scene: S('island', 'case', CROWD,
        caseCats(['stand', 'proud'], { root: true, sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, A CLIMBER ONLY. Our cat has hopped up onto a low root of the great tree behind Sprinkle and stands on it in the moonlight, so the whole ring can see it, chin up. One caption at the top.',
      caption: ['You hop up onto a root of the great tree, so every Clan can see you.'],
      next: 'f052'
    },

    f052: {
      when: { specialty: 'sneaking' },
      scene: S('island', 'case', CROWD,
        caseCats(['walk', 'proud'], { sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, A SNEAKING CAT ONLY. The quiet cat who has slipped about unseen all moon steps forward into a pool of bright moonlight, every eye on it for once, and does not mind at all. One caption at the top.',
      caption: ['All moon, you’ve been quiet as a shadow. Tonight, you step into the moonlight.'],
      next: 'f053'
    },

    f053: {
      when: { specialty: 'swimming' },
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { rey: ['sit', 'proud'], sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, A SWIMMER ONLY. Our cat eyes the dripping fox up and down, and a thought bubble over its head shows a cat streaking across the river past a puffing fox. Our cat’s whiskers twitch with a secret smile. One caption at the top.',
      caption: ['Reynard SWAM here, you think. You could have swum it faster.'],
      next: 'f054'
    },

    f054: {
      when: { specialty: 'friends' },
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'happy'], { front: [c('reedclan', 'sit', 'happy', 'front-4', 'left', { variant: 2 }), c('reedclan', 'sit', 'happy', 'front-1', 'right', { variant: 1 })], sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, A FRIENDLY CAT ONLY. Across the clearing at the front of the ring, the ReedClan she-cat and the young tom catch our cat’s eye and both mouth the same three words at it, without a sound, ears up. Our cat sits a little taller. One caption at the top.',
      caption: ['Across the clearing, the ReedClan she-cat and the young tom both mouth, “You can DO it!”'],
      next: 'f055'
    },

    f055: {
      when: { worry: 'talk' },
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, A CAT WHO WORRIES ABOUT TALKING ONLY. Our cat takes a deep breath with its mouth shut tight, and a small inset shows all the things it never said this moon, bottled up; then it lifts its chin. One caption at the top.',
      caption: ['All this time, you held it in. You hold it in no longer.'],
      next: 'f056'
    },

    f056: {
      // Tallyheart teaches the pick, once
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'wonder'], { tally: ['crouch', 'kind'], sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT. Tallyheart leans close behind our cat and whispers into its ear, and a small inset shows its Case File, rows of bark with their little pictures; nobody else can hear. Her balloon a whisper.',
      say: [{ who: 'tallyheart', text: 'Your Case File. Pick the card that shows he’s wrong.', kind: 'whisper' }],
      next: 'f057'
    },

    f057: {
      // the first pick, on the fox's own camera, for his bow
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'stand', 'neutral', 'weasel-2', 'left', { wet: true, holds: 'mouse' }), c('reynard', 'bow', 'proud', 'fox', 'left', { wet: true }),
         c('snip', 'stand', 'neutral', 'weasel-1', 'left', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE, THE PICK. The fox bows low to the whole ring, one paw on his heart, and tells his tale with his eyes half shut, as if it were poetry; a small inset over him shows a dragon flying off with its claws full of mice. In play her Case File opens over the page under his claim, and she picks the card that answers it. Caption top left; his balloon grand.',
      caption: ['Reynard bows low.'],
      say: [{ who: 'reynard', text: 'On the storm night, I saw it with my own eyes. A dragon! It FLEW out of your camp, its claws full of mice!' }],
      pick: pickTo(PICK_FLEW, 'f058')
    },

    f058: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { rey: ['flap', 'worried'], sprinkle: ['sit', 'sad'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat answers the claim plainly, chin up, with the card it picked shining in a small inset; beside it Sprinkle shows her drooping wing, and across the grass the fox flaps his paws in the air, backing up his story. Three balloons, our cat’s steady, hers small, his flustered.',
      say: answers('ch10PickFlew', {
        'cant-fly': 'On the storm night, Sprinkle couldn’t fly at all. Her wing was hurt. She couldn’t fly off with ANYTHING.',
        'mizzle-wing': 'Her wing was hurt before the rain even stopped. Mizzle saw it. She COULDN’T fly!',
        'fox-brag': 'Nothing flew. I heard you call it your little STORY!'
      }).concat([
        { who: 'sprinkle', text: 'That night, I couldn’t even FLAP.' },
        { who: 'reynard', text: 'Did I say FLEW? I meant… hopped. Very HIGH.' }
      ]),
      next: 'f059'
    },

    f059: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { rey: ['chest', 'proud'], tally: ['sit', 'proud'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE PICK. Tallyheart murmurs the score into our cat’s ear, and across the grass the fox puffs out his chest and tries again, pointing his nose up at the full moon itself. In play her Case File opens over the page under his claim, and she picks the card that answers it. Two balloons, hers a whisper, his smooth.',
      say: [
        { who: 'tallyheart', text: 'That’s one.', kind: 'whisper' },
        { who: 'reynard', text: 'But I saw it clearly, by the light of the MOON.' }
      ],
      pick: pickTo(PICK_MOON, 'f060')
    },

    f060: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { rey: ['sit', 'worried'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat names its two witnesses, and two small insets hang over it side by side: a white cat with a bow sitting up all night on a balcony, and a grey heron standing in the dark marsh, neither with any moon. The fox’s smile slips. Our cat’s balloon sure.',
      say: answers('ch10PickMoon', {
        'heron-no-moon': 'There was NO moon that night. Patience the heron says so. And so does Princess Waffles.',
        'waffles-no-moon': 'There was NO moon that night. Princess Waffles was up ALL night with her nerves. The heron says so too.'
      }),
      next: 'f061'
    },

    f061: {
      // GroveClan's leader speaks: first among GroveClan's cast (her root lies behind every Clan spot)
      scene: S('island', 'wide', OPEN,
        clearing({ leaders: [c('glintstar', 'sit', 'solemn', 'root-2', 'right'), c('reedclan', 'sit', 'wonder', 'root-1', 'right', { variant: 5 }), c('groveclan', 'lookup', 'wonder', 'root-3', 'left', { variant: 3 })],
          player: ['sit', 'solemn'], sprinkle: ['sit', 'shy'] }), ['night']),
      board: 'WIDE, THE CLEARING, COMEDY BEAT. On the right-hand root the tall dappled GroveClan leader tips her head, quite puzzled, and asks the whole clearing a question; down in the middle our cat answers gravely, as if that explained everything. Two balloons, hers puzzled, our cat’s solemn.',
      say: [
        { who: 'groveclan', text: 'Who is Princess Waffles?' },
        { who: 'player', text: 'She’s very sensitive.' }
      ],
      next: 'f062'
    },

    f062: {
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'stand', 'neutral', 'weasel-2', 'left', { wet: true, holds: 'mouse' }), c('reynard', 'think', 'worried', 'fox', 'left', { wet: true }),
         c('snip', 'stand', 'worried', 'weasel-1', 'left', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE, COMEDY BEAT. The fox clears his throat into his paw with a little cough, his eyes sliding sideways, and the weasels behind him look at the sky. A moonbeam lands right on him. Caption top left; his balloon a mumble.',
      caption: ['Reynard coughs.'],
      say: [{ who: 'reynard', text: 'A very… moony sort of dark.' }],
      next: 'f063'
    },

    f063: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { front: [c('grizzled', 'situp', 'shout', 'front-4', 'left')], rey: ['comb', 'happy'], tally: ['sit', 'proud'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE PICK. Tallyheart whispers the score, and the fox smooths his whiskers and tries his shiniest tale, while at the front of the ring the old grizzled tom bobs up and down, sure he saw it too. In play her Case File opens over the page under his claim, and she picks the card that answers it. Three balloons, hers a whisper, his slick, the old tom’s a shout.',
      say: [
        { who: 'tallyheart', text: 'That’s two.', kind: 'whisper' },
        { who: 'reynard', text: 'Well, it left a dragon SCALE by your pile! Shiny! Glittering!' },
        { who: 'grizzled', text: 'I SAW it!', kind: 'shout' }
      ],
      pick: pickTo(PICK_SCALE, 'f064')
    },

    f064: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud', { holds: 'leaf', holdAt: 'paws', tap: 'leaf' }], { front: [c('grizzled', 'situp', 'wonder', 'front-4', 'left')] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TAP PICTURE. Our cat answers with the card it picked and sits up over the folded leaf on the grass at its paws, with something hard and flat inside it; the old tom at the front of the ring leans in to see. In play the leaf glows softly; one tap opens it in front of every Clan and turns the page. Our cat’s balloon certain.',
      say: answers('ch10PickScale', {
        glass: 'It’s not a scale. It’s GLASS. Tower glass. There’s a whole heap of it by the train tracks.',
        scale: 'It’s not a scale. It’s GLASS. Tower glass. I lived behind glass my whole life.',
        'sprinkle-scales': 'Sprinkle’s scales are grey and bumpy. Not shiny at all. That ‘scale’ is GLASS.',
        'wisp-fox': 'Wisp saw a FOX drop something glittering. Not a scale. GLASS.'
      }),
      scratch: { tap: 'leaf', prompt: '**Tap** to show every Clan your glass.', label: 'Show every Clan your glass.', next: 'f065' }
    },

    f065: {
      // (close on her paws, as the mist stone's f122: on the case camera the glass was a speck at her forepaw)
      scene: S('island', 'paws', {},
        [c('player', 'crouch', 'proud', 'close', 'right', { holds: 'glass', holdAt: 'paws' })], ['night', 'sparkle']),
      board: 'EXTREME CLOSE-UP, OUR CAT’S PAWS. The leaf lies open between our cat’s forepaws, and the piece of tower glass on it shines in the moonlight, smooth and clear and flat, a little rainbow at its edge. One caption at the top.',
      caption: ['Your piece of glass shines in the moonlight. Smooth. Clear. Flat.'],
      next: 'f066'
    },

    f066: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { front: [c('grizzled', 'situp', 'wonder', 'front-4', 'left')], tally: ['crouch', 'happy'], rey: ['sit', 'worried'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT. At the front of the ring the old tom stares at our cat with his mouth open; Tallyheart leans close behind our cat and whispers the score with a gleam in her eye; across the grass the fox shifts his paws, his tail very still. His balloon an indignant squawk, then hers a whisper.',
      say: [
        { who: 'grizzled', text: 'Glass? I said DRAGON about GLASS?' },
        { who: 'tallyheart', text: 'That’s three.', kind: 'whisper' }
      ],
      next: 'f067'
    },

    f067: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'solemn'], { rey: ['flap', 'stern'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE PICK. The fox’s tail twitches, and he flings his paws wide to show the size of a great big dragon, bigger and bigger; our cat waits, very calm. In play her Case File opens over the page under his claim, and she picks the card that answers it. Caption top left; his balloon loud.',
      caption: ['Reynard’s tail twitches.'],
      say: [{ who: 'reynard', text: 'Then who else could take so much prey? Only something BIG. A great big dragon!' }],
      pick: pickTo(PICK_BIG, 'f068')
    },

    f068: {
      // the fourth answer, a pair by `ch10PickBig`: the stash, with Sloshbank's “OURS?” and its Drip (f069 the rest)
      when: { ch10PickBig: 'stash' }, else: 'f069',
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { front: [c('sloshbank', 'situp', 'shout', 'front-4', 'left')], rey: ['sit', 'worried'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, BUT ONLY AFTER THE STASH CARD. Our cat names the two weasels and their stash, and a small inset shows the heap of stolen prey down by the train tracks; at the front of the ring the huge mud-brown ReedClan tom sits bolt upright. Two balloons, our cat’s sure, his a bellow; the drip lettered small.',
      say: [
        { who: 'player', text: 'Two weasels. All the prey is in their stash. Ours, and ReedClan’s too.', when: { ch10PickBig: 'stash' } },
        { who: 'sloshbank', text: 'OURS?', kind: 'shout' }
      ],
      sfx: 'Drip.',
      next: 'f070'
    },

    f069: {
      when: { not: { ch10PickBig: 'stash' } },
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { rey: ['sit', 'worried'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, NOT FOR A CAT WHO PICKED THE STASH. Our cat answers with the card it picked, and a small inset over it shows what that card says: tiny prints, or a tunnel, or two skinny shapes, or a count. The fox’s ears go back. Our cat’s balloon plain and sure.',
      say: answers('ch10PickBig', {
        'prints-sprinkle': 'Somebody SMALL. The thief’s prints are tiny. Sprinkle’s are huge.',
        tunnel: 'Somebody small. The thief came up a tunnel under our pile, much too small for a dragon. We left it open, for proof.',
        'coil-diggers': 'Small diggers. Coil felt them under our pile. Small ones. Not a dragon.',
        'heron-shapes': 'Two SMALL shapes. Patience saw them cross her mud, carrying something.',
        'prints-marsh': 'The thief’s prints in the marsh are tiny. Much smaller than a cat’s!',
        fur: 'Dragons don’t have FUR. The thief left thin brown fur at the Crossing. Weasel fur.',
        'four-a-night': 'Only four a night. A dragon would eat LOTS more.',
        'prints-pile': 'Somebody SMALL. Tiny prints, right behind our pile.',
        'prints-tracks': 'Somebody SMALL. Tiny prints, all the way to the train tracks.',
        'squall-shapes': 'Squall saw the thieves from his roof. Two SKINNY shapes. Not one big dragon.',
        'puddle-paws': 'Puddle saw the thief’s paws. Clever LITTLE paws, picking up mice.',
        'hail-shapes': 'Hail saw the thieves every night. Two skinny shapes, with muddy mice.',
        'my-count': 'Not a dragon. Look at my COUNT.'
      }),
      next: 'f070'
    },

    f070: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'happy'], { snatch: ['hidepaws', 'neutral'], snip: ['hidepaws', 'neutral'], rey: ['sit', 'worried'], sprinkle: ['pawup', 'happy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, COMEDY BEAT. Sprinkle holds up one forepaw, as big as a heron’s foot, for the whole ring to see; across the grass both weasels stand up straight with their own tiny paws hidden behind their backs, eyes wide and innocent. Two captions top left.',
      caption: ['Sprinkle holds up a forepaw. It’s as big as a heron’s foot.', 'Snip and Snatch quickly hide their tiny paws behind their backs.'],
      next: 'f071'
    },

    f071: {
      // the sixty: Glintstar's line by the fourth pick; Tallyheart at the front of CrystalClan's seats letters its help
      // (`intro: false`, as chapter 5's bill: said again over the question, the frame's two balloons made the page tall
      // enough to scroll on a 1080 x 720 iPad with Aa, and Glintstar's first line went under the top bar; the
      // question's own prompt is her last sentence, the line the frame already showed)
      scene: S('island', 'wide', OPEN,
        clearing({ tally: 'kind', sprinkle: ['sit', 'happy'], player: ['sit', 'proud'] }), ['night']),
      board: 'WIDE, THE CLEARING, THEN THE COUNTS. Glintstar leans down from her root and asks for the count she asked for days ago, and our cat in the middle of the grass says it out loud to every Clan. In the Counts picture six nights of ten marks lie scratched in a row, unlit; after a miss Tallyheart lights them a night at a time, by tens. Two balloons; the keypad sits below the panel.',
      say: [
        { who: 'glintstar', text: 'And your count, {name}paw? I said bring it.', when: { not: { ch10PickBig: 'my-count' } } },
        { who: 'glintstar', text: 'Your count. I said bring it.', when: { ch10PickBig: 'my-count' } },
        { who: 'player', text: 'Four a night, for six nights: twenty-four. And a dragon who eats ten fish a meal, for six nights?' }
      ],
      counts: { set: 'ch10-sixty', intro: false, next: 'f072' }
    },

    f072: {
      // the weasels' two lines on the fox's own camera, where they are big enough to be seen
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'stand', 'shout', 'weasel-2', 'left', { wet: true, holds: 'mouse' }), c('reynard', 'sit', 'worried', 'fox', 'left', { wet: true }),
         c('snip', 'stand', 'worried', 'weasel-1', 'left', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE, COMEDY BEAT. Behind the fox the skinny weasel with the mouse in his mouth pipes up, outraged at being undercounted, and the fox shuts his eyes. Every head in the ring turns. His balloon a squawk.',
      say: [{ who: 'snatch', text: 'Twenty-four? It was a HUNDRED, at LEAST!', kind: 'shout' }],
      next: 'f073'
    },

    f073: {
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'stand', 'scared', 'weasel-2', 'left', { wet: true, holds: 'mouse' }), c('reynard', 'think', 'worried', 'fox', 'left', { wet: true }),
         c('snip', 'point', 'shout', 'weasel-1', 'right', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE, COMEDY BEAT. Every cat in the ring turns to stare at the skinny weasel at once, and his sister jabs a paw at him with her fur on end; the fox looks at the moon. Caption top left; her balloon a squeak.',
      caption: ['Every cat looks at Snatch.'],
      say: [{ who: 'snip', text: 'SHHH!', kind: 'shout' }],
      next: 'f074'
    },

    f074: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { tally: ['crouch', 'happy'], rey: ['sit', 'worried'], snatch: ['stand', 'scared'], snip: ['stand', 'stern'] }), ['night']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT. Tallyheart leans in behind our cat and whispers the score, her whiskers twitching with a smile she is hiding from the whole ring; across the grass the weasels glare at each other. Her balloon a whisper.',
      say: [{ who: 'tallyheart', text: 'That’s four.', kind: 'whisper' }],
      next: 'f075'
    },

    f075: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'solemn'], { rey: ['chest', 'laugh'], snatch: ['stand', 'worried'], snip: ['stand', 'worried'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE PICK. The fox throws back his head and laughs, a little too loudly, his chest puffed out, and waves a paw at his weasels as if they were nothing to do with him. In play her Case File opens over the page under his claim, and she picks the card that answers it. Caption top left; his balloon loud and airy.',
      caption: ['Reynard laughs, a little too loudly.'],
      say: [{ who: 'reynard', text: 'My friends can’t count! And me? I never even saw your pile! How could I get the prey OUT?' }],
      pick: pickTo(PICK_OUT, 'f076')
    },

    f076: {
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'proud'], { tally: ['sit', 'proud'], rey: ['sit', 'scared'], snatch: ['stand', 'worried'], snip: ['stand', 'worried'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT. Our cat answers the last claim with the card it picked, and a small inset shows how the prey got out from under the pile; behind it Tallyheart sits up with a proud glow. The fox has gone quite still. Two balloons, our cat’s ringing, hers a whisper.',
      say: answers('ch10PickOut', {
        'fox-brag': 'You didn’t NEED to. I heard you tell your weasels: ‘Rob later. And keep it TIDY.’ You want Sprinkle’s dry den!',
        tunnel: 'You didn’t NEED to. Your weasels came up UNDER it. Through a tunnel. It’s still open. Come and see!',
        'coil-diggers': 'You didn’t NEED to. Your weasels dug UNDER it. Coil felt them, every night.',
        stash: 'You didn’t NEED to. Your weasels did it for you. Our prey is in their stash!',
        'dug-earth': 'You didn’t NEED to. Your weasels dug UNDER it. The earth behind our pile was freshly dug.',
        'prints-pile': 'You didn’t NEED to. Your weasels came up behind it. Their tiny prints are in the dug earth.',
        'heron-shapes': 'You didn’t NEED to. Your weasels carried it off for you. Patience saw them, crossing her mud!',
        'squall-shapes': 'You didn’t NEED to. Your weasels carried it off for you. Squall saw them, from his roof!',
        'hail-shapes': 'You didn’t NEED to. Your weasels carried it off for you, right across Hail’s field!',
        'puddle-paws': 'You didn’t NEED to. Your weasels did it for you. Puddle saw their clever little paws!'
      }).concat([{ who: 'tallyheart', text: 'Five.', kind: 'whisper' }]),
      next: 'f077'
    },

    f077: {
      when: { worry: 'talk' },
      scene: S('island', 'case', CROWD,
        caseCats(['sit', 'happy'], { tally: ['sit', 'proud'], rey: ['sit', 'scared'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, A CAT WHO WORRIES ABOUT TALKING ONLY. Our cat lets out a long breath and its whole face lights up: it said every word, out loud, to every Clan, and nobody had to shout. A small inset shows an empty bottle, its cork popped. One caption at the top.',
      caption: ['You said it ALL. You never once had to shout LIAR.'],
      next: 'f078'
    },

    /* ------------------------------------------------------------------ Snip and Snatch */

    f078: {
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'point', 'shout', 'weasel-2', 'left', { wet: true, holds: 'mouse' }), c('reynard', 'sit', 'worried', 'fox', 'left', { wet: true }),
         c('snip', 'point', 'shout', 'weasel-1', 'right', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE, COMEDY BEAT. The two weasels turn on each other beside the fox, each pointing a paw at the other’s nose, fur bristling, and the fox sits looking pained. Nobody touches anybody. Caption top left; two balloons, his and hers, both shouts.',
      caption: ['Snip looks at Snatch. Snatch looks at Snip.'],
      say: [
        { who: 'snatch', text: 'It was HER idea!', kind: 'shout' },
        { who: 'snip', text: 'It was the FOX’S idea!', kind: 'shout' }
      ],
      next: 'f079'
    },

    f079: {
      // the confession: an ask lettering two balloons a tap, Snatch and Snip by turns (three taps of two)
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'stand', 'shout', 'weasel-2', 'left', { wet: true, holds: 'mouse', glow: true }), c('reynard', 'sit', 'sad', 'fox', 'left', { wet: true }),
         c('snip', 'stand', 'shout', 'weasel-1', 'right', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE, THE TAP PICTURE, COMEDY BEAT. The weasels cannot stop now: the one with the mouse glows softly, bursting to tell, and the fox sits with his ears drooping. In play each tap on him letters the next two things they blurt out, his then hers; after the third the page turns. Caption top left.',
      caption: ['And then it ALL tumbles out.'],
      ask: {
        who: 'snatch', to: 'snip', prompt: '**Tap** the weasels.', label: 'Hear the next bit.',
        pairs: [
          ['Two each, every night, he said!', 'Up the TUNNEL!'],
          ['Keep it TIDY!', 'Leave the shiny bit by the pile!'],
          ['Then the dragon’s dry den is HIS!', 'And WE can’t even COUNT!']
        ],
        next: 'f080'
      }
    },

    f080: {
      scene: S('island', 'fox', CROWD,
        [c('snatch', 'stand', 'neutral', 'weasel-2', 'left', { wet: true, holds: 'mouse' }), c('reynard', 'sit', 'solemn', 'fox', 'left', { wet: true }),
         c('snip', 'stand', 'neutral', 'weasel-1', 'left', { wet: true })], ['night']),
      board: 'CLOSE-UP, THE FOX, COMEDY BEAT. The fox sits with his ears down and gives one long, tired sigh, the very picture of a fox let down by his staff; behind him the weasels shuffle. His balloon a sigh.',
      say: [{ who: 'reynard', text: 'Weasels.' }],
      next: 'f081'
    },

    f081: {
      scene: S('island', 'wide', OPEN,
        clearing({ leaders: leaders('solemn', ['sit', 'stern']), edge: edge(['sit', 'worried'], ['up', 'happy'], ['stand', 'worried']), sprinkle: ['sit', 'happy'], snatchAt: 'bank' }), ['night']),
      board: 'WIDE, THE CLEARING, COMEDY BEAT. By the water at the front the skinny weasel holds up his mouse in both paws, very hopeful, and from her root in the middle Glintstar answers in three words that settle it. The ring holds its breath, then grins. Caption top left; his balloon hopeful, hers firm.',
      caption: ['Snatch holds up his mouse.'],
      say: [
        { who: 'snatch', text: 'This one’s mine, though.' },
        { who: 'glintstar', text: 'It is NOT.' }
      ],
      next: 'f082'
    },

    f082: {
      // the ruling alone; the other two leaders' and Granny's borders on the next panel, the same picture (f083): with Aa
      // on at 1080 x 720 and 1080 x 700 the four balloons could not letter on this crowded panel, and stacked beside it
      // they ran Back and Next under the screen
      scene: S('island', 'wide', OPEN,
        clearing({ leaders: leaders('stern', ['stand', 'stern']), edge: edge(['sit', 'scared'], ['stand', 'worried'], ['stand', 'worried'], true), sprinkle: ['sit', 'happy'], granny: 'stern' }), ['night']),
      board: 'WIDE, THE CLEARING. Glintstar stands on her root and rules, calm and very firm, and every Clan listens in silence while the fox at the river edge gets smaller. One balloon, hers.',
      say: [
        { who: 'glintstar', text: 'Reynard. You lied at my border, and you lied here. From tonight, stay past the last post. Not one paw in our territory.' }
      ],
      next: 'f083'
    },

    f083: {
      // both leaders first among their Clans' cast; Granny by the water
      scene: S('island', 'wide', OPEN,
        clearing({ leaders: leaders('stern', ['stand', 'stern']), edge: edge(['sit', 'scared'], ['stand', 'worried'], ['stand', 'worried'], true), sprinkle: ['sit', 'happy'], granny: 'stern' }), ['night']),
      board: 'WIDE, THE CLEARING. The other two leaders and Granny the otter by the water add their own borders one after another, while the fox at the river edge gets smaller and smaller. Three balloons, each firmer than the last.',
      say: [
        { who: 'reedclan', text: 'Or ReedClan’s.' },
        { who: 'groveclan', text: 'Or GroveClan’s.' },
        { who: 'otter', text: 'Or the RIVER. Once you’ve swum home.' }
      ],
      next: 'f084'
    },

    f084: {
      // every cat on the island standing (the set's crowd too), our cat's step the Tap
      scene: S('island', 'wide', { crowd: 'standing', luggage: 'open' },
        clearing({ leaders: leaders('stern', ['stand', 'stern']).map(function (m) { return merge(m, { pose: 'stand' }); }),
          edge: edge(['sit', 'scared'], ['stand', 'scared'], ['stand', 'scared'], true), player: ['stand', 'proud', { tap: 'paw' }], sprinkle: ['sit', 'happy'], granny: 'proud' }).map(function (m) {
          return m.who === 'tallyheart' || m.who === 'sloshbank' || (m.who === 'reedclan' && m.variant !== 5) ? merge(m, { pose: 'stand' }) : m;
        }), ['night']),
      board: 'WIDE, THE CLEARING, THE TAP PICTURE. All round the ring every cat of every Clan rises to its feet at once, and every otter too, a whole moonlit wall of whiskers facing the fox; our cat stands up in the middle with them. In play its front paw glows softly; one tap takes one step toward the fox with every Clan, and the page turns. One caption at the top.',
      caption: ['Every cat on the island stands up, and every otter too.'],
      scratch: { tap: 'paw', prompt: '**Tap** to take a step with every Clan.', label: 'Take a step with every Clan.', next: 'f085' }
    },

    f085: {
      scene: S('island', 'fox', { crowd: 'standing' },
        [c('snatch', 'stand', 'scared', 'weasel-2', 'left', { wet: true }), c('reynard', 'sit', 'worried', 'fox', 'left', { wet: true }),
         c('snip', 'stand', 'scared', 'weasel-1', 'left', { wet: true })], ['night']),
      board: 'MEDIUM, THE CLEARING’S EDGE. The fox looks left and right along a whole standing ring of cats, every one of them looking back at him, and his damp tail droops; the weasels edge behind him toward the water. His balloon a feeble joke.',
      caption: ['Reynard looks at all those cats.'],
      say: [{ who: 'reynard', text: 'Well. This is all very… DAMP.' }],
      next: 'f086'
    },

    f086: {
      // the swim, a little row going away from the bank, the fox furthest out (listed first); the dogs' goodbye a sound
      // from far off, said in words for a child who listens
      scene: S('island', 'fox', { crowd: 'standing' },
        [c('reynard', 'swim', 'sad', 'water', 'right', { wet: true }), c('snip', 'swim', 'worried', 'water-2', 'right', { wet: true }),
         c('snatch', 'swim', 'worried', 'water-3', 'right', { wet: true })], ['night']),
      board: 'WIDE, THE RIVER’S EDGE. The fox slinks into the silver river and paddles away, only his head and the line of his back above the water, the two weasels paddling after him in a little row; the standing ring watches from the bank. Far off over the water the dogs’ goodbye is lettered huge and wobbly. Captions top left.',
      caption: ['Back into the river he slinks, with Snip and Snatch paddling after him.', 'Far, far away, the Barking Field dogs start up.'],
      sfx: 'BYE, GIANT SQUIRREL!',
      sfxRead: 'Bye, giant squirrel!',
      next: 'f087'
    },

    f087: {
      scene: S('island', 'roots', CROWD,
        rootsCats(null, { mood: 'kind', glint: ['sit', 'kind'] }), ['night']),
      board: 'LOW ANGLE, THE GREAT TREE’S ROOTS. Glintstar speaks from her root in the middle, warm now, and the ReedClan leader on his root nods slowly; the moon shines through the crown above them. Her balloon brisk.',
      say: [{ who: 'glintstar', text: 'Tomorrow, CrystalClan and ReedClan bring their prey home from the stash.' }],
      next: 'f088'
    },

    f088: {
      // Glintstar comes down to the clearing's edge, facing Sprinkle
      scene: S('island', 'wide', OPEN,
        [c('groveclan', 'sit', 'kind', 'root-3', 'left', { variant: 3 }), c('reedclan', 'sit', 'kind', 'root-1', 'right', { variant: 5 }), reed('kind').slosh,
         c('glintstar', 'stand', 'kind', 'edge', 'left'), reed().she, c('tallyheart', 'sit', 'kind', 'crowd-1', 'right'),
         c('sprinkle', 'sit', 'shy', MID, 'right'), c('player', 'sit', 'happy', 'crowd-2', 'right'), reed().tom], ['night']),
      board: 'WIDE, THE CLEARING. Glintstar has come down from her root to the clearing’s edge and faces the small grey dragonet across the grass, her head lowered, kind and honest, saying sorry for every Clan. Sprinkle sits very still beside our cat. Caption top left; her balloon grave and warm.',
      caption: ['Glintstar turns to Sprinkle.'],
      say: [{ who: 'glintstar', text: 'Sprinkle of the Mistscales. Every Clan was ready to blame you. We were wrong.' }],
      next: 'f089'
    },

    /* ------------------------------------------------------------------ The mist */

    f089: {
      scene: S('island', 'mist', { mist: 'rolling', tap: 'mist' },
        mistCats(['sit', 'wonder'], { beside: ['sniff', 'happy'] }), ['night']),
      board: 'WIDE, THE CLEARING’S EDGE BY THE GREAT TREE, THE TAP PICTURE. A soft bank of silver mist comes rolling up off the river into the clearing, the moon glowing right through it, and Sprinkle lifts her nose and sniffs, her eyes shining. In play the mist glows softly; one tap swirls it and turns the page. Captions top left; her balloon a whisper of joy.',
      caption: ['Then the mist comes, up the river, cool and soft.', 'The moon glows right through it. Everything shines silver.', 'Sprinkle sniffs the air.'],
      say: [{ who: 'sprinkle', text: 'That’s MY mist.' }],
      scratch: { tap: 'mist', prompt: '**Tap** the mist.', label: 'Look at the mist.', next: 'f090' }
    },

    f090: {
      // the Tap's response: the tip of a huge soft tail in the mist, and Mama's face (chapter 6's call 13)
      scene: S('island', 'mist', { mist: 'thick', tail: true },
        mistCats(['sit', 'wonder'], { mama: ['lean', 'kind'], beside: ['sit', 'wonder'], tally: ['sit', 'wonder'] }), ['night']),
      board: 'WIDE, THE MIST. The tip of a huge soft grey tail curls through the silver mist, and out of it leans a great, gentle face as big as a den, grey as a rain cloud, with big kind eyes and two soft horns; the rest of her is only mist behind the tree. Captions top left; her balloon soft and low.',
      caption: ['Out of the mist leans a great, gentle face, grey as a rain cloud, with big, kind eyes.', 'The rest of her is as big as a bridge.'],
      say: [{ who: 'mistscale', name: 'A soft voice', text: 'Sprinkle?' }],
      next: 'f091'
    },

    f091: {
      scene: S('island', 'mist', { mist: 'thick' },
        mistCats(['sit', 'happy'], { mama: ['lean', 'happy'], beside: ['sit', 'shout'] }), ['night']),
      board: 'MEDIUM, THE MIST. Sprinkle springs up with her whole face shining and cries out to the great grey face in the mist, her drooping wing forgotten; our cat beside her is already smiling. Her balloon a joyful shout.',
      say: [{ who: 'sprinkle', text: 'MAMA!', kind: 'shout' }],
      next: 'f092'
    },

    f092: {
      scene: S('island', 'mist', THICK,
        mistCats(['lookup', 'wonder'], { mama: ['lean', 'kind'], front: [c('grizzled', 'lookup', 'wonder', 'front-1', 'right')], beside: ['sit', 'happy'], tally: ['lookup', 'wonder'] }), ['night']),
      board: 'LOW ANGLE, THE MIST. Every cat tips its head back, and back, to take in the great gentle shapes in the mist, and the old grizzled tom’s mouth falls open; Tallyheart whispers with her eyes on the sky. Caption top left; her balloon a whisper, his awed.',
      caption: ['Every Clan looks up, and up.'],
      say: [
        { who: 'tallyheart', text: 'Mistscales. They keep the Accord too.', kind: 'whisper' },
        { who: 'grizzled', text: 'Now THAT is a dragon.' }
      ],
      next: 'f093'
    },

    f093: {
      scene: S('island', 'mist', THICK,
        mistCats(['sit', 'happy', { tailUp: true, tap: 'tail' }], { mama: ['lean', 'kind'], beside: ['flap', 'happy'] }), ['night']),
      board: 'MEDIUM, THE MIST, THE TAP PICTURE. Sprinkle runs across the grass toward her Mama, flapping both wings, harder and harder, the mended one too; our cat sits with its tail straight up, ready to cheer. In play its raised tail glows softly; one tap cheers with every Clan and turns the page. One caption at the top.',
      caption: ['Sprinkle runs. She flaps. Harder. HARDER…'],
      scratch: { tap: 'tail', prompt: '**Tap** to cheer!', label: 'Cheer!', next: 'f094' }
    },

    f094: {
      scene: S('island', 'sky', THICK,
        [c('sprinkle', 'fly', 'happy', 'fly', 'right')], ['night', 'motion']),
      board: 'LOW ANGLE, LOOKING UP PAST THE GREAT TREE’S CROWN. Sprinkle flies, really flies, both wings wide and even, up over the clearing and round the great tree in the moonlight, with speed lines behind her and the great soft shapes of the Mistscales in the mist. Three captions, the last at the bottom.',
      caption: ['…and she FLIES. Up over the clearing, round the great tree, all the way to her Mama’s nose.', 'Her wing holds.', 'The fox said she flew. That night, she couldn’t. Tonight, at last, she can.'],
      next: 'f095'
    },

    f095: {
      // chapter 9's gifts come home: the four who gave them, at the ring's front
      scene: S('island', 'case', MISTY,
        caseCats(['lookup', 'happy'], { fox: false, sprinkle: false, tally: ['lookup', 'happy'],
          front: [c('groveclan', 'sit', 'kind', 'front-2', 'right', { variant: 1 }), c('riffle', 'hop', 'shout', 'front-4', 'left'), c('sloshbank', 'sit', 'kind', 'front-3', 'left'),
            c('thymeleaf', 'lookup', 'happy', 'front-1', 'right')] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE RING’S FRONT. Four faces look up at the sky together, each remembering a gift: the old oatmeal medicine cat who mixed the remedy, the huge mud-brown ReedClan tom whose root it was, the old GroveClan elder whose moss it was, and Riffle, who brought the otters’ mint, hopping on the spot. Our cat watches them, glowing. Four balloons; the drip lettered small.',
      say: [
        { who: 'thymeleaf', text: 'The full moon has told us. Mended.' },
        { who: 'sloshbank', text: 'So THAT’S what our root was for.' },
        { who: 'groveclan', text: 'And our moss. I’ll remember that.' },
        { who: 'riffle', text: 'TEN out of ten! And NO splash!', kind: 'shout' }
      ],
      sfx: 'Drip.',
      next: 'f096'
    },

    /* ------------------------------------------------------------------ The roll call */

    f096: {
      scene: S('island', 'mist', THICK,
        mistCats(['sit', 'happy'], { mama: ['nuzzle', 'kind'], nose: ['sit', 'happy'] }), ['night']),
      board: 'MEDIUM, THE MIST. The great grey face lowers its nose all the way down to the little dragonet on the grass and nuzzles her very softly, eyes half shut; Sprinkle beams. Then the big head lifts to call. Caption top left; three balloons, Mama’s soft, Sprinkle’s proud, Mama’s a call.',
      caption: ['Mama nuzzles Sprinkle, very softly.'],
      say: [
        { who: 'mistscale', name: 'Mama', text: 'There you are. You stayed where you landed. Mostly.' },
        { who: 'sprinkle', text: 'And then I FLEW!' },
        { who: 'mistscale', name: 'Mama', text: 'ROLL CALL!', kind: 'shout' }
      ],
      next: 'f097'
    },

    f097: {
      // the HERE! panel: a plain frame of its own, so the sound has its words (`sfxRead`); Mama `lift`
      scene: S('island', 'mist', merge(THICK, { small: 'some' }),
        mistCats(['sit', 'wonder'], { mama: ['lift', 'happy'], nose: ['sit', 'happy'] }), ['night']),
      board: 'WIDE, THE MIST. Mama lifts her great head high and calls, mouth a little open, and out of the mist all round come small soft dragonet shapes, near and far, and their answers are lettered small and bright all over the silver. Our cat turns this way and that. One caption at the top.',
      caption: ['Out of the mist, from near and far, come small voices.'],
      sfx: 'HERE! HERE! HERE!',
      sfxRead: 'Here! Here! Here!',
      next: 'f098'
    },

    f098: {
      // the roll call: seven forepaws, Sprinkle's and each of the six by its found flag (the misty shapes for the
      // ones she never met); Mama keeps the count (her balloon's name)
      scene: S('island', 'mist', merge(THICK, { small: 'some' }),
        mistCats(['sit', 'wonder'], { mama: ['lift', 'kind'], nose: ['sit', 'happy'] }), ['night']),
      board: 'WIDE, THE MIST, THE TAP PICTURE. Mama calls for forepaws, and seven small forepaws go up in a row in the moonlight. In play the counting picture takes the panel: the clutch in a row, Sprinkle’s paw and the found ones’ in the moonlight, the others misty shapes; each tap lights one forepaw’s five claws, 5, 10 and on to 35. Captions top left; her balloon a call.',
      caption: [
        { when: { foundWisp: true }, text: 'Somewhere, Wisp nods.' },
        { when: { foundWisp: false }, text: 'Somewhere, a quiet one nods.' }
      ],
      say: [{ who: 'mistscale', name: 'Mama', text: 'Forepaws UP.' }],
      skip: { table: 5, groups: 7, teacher: 'mistscale', thing: 'claw', things: 'claws', label: 'Count the next forepaw.', prompt: '**Tap** each forepaw.', carry: false, who: ROLL, next: 'f099' }
    },

    f099: {
      scene: S('island', 'mist', merge(THICK, { small: 'some' }),
        mistCats(['sit', 'happy'], { mama: ['lean', 'happy'], beside: ['pawup', 'happy'] }), ['night']),
      board: 'MEDIUM, THE MIST. Mama’s great eyes crinkle with relief, and beside our cat Sprinkle holds up her forepaw as if she has just won something; small shapes bob in the silver mist. Two balloons, Mama’s soft, Sprinkle’s a squeal.',
      say: [
        { who: 'mistscale', name: 'Mama', text: 'Thirty-five. And nobody’s missing.' },
        { who: 'sprinkle', text: 'Not ONE!', kind: 'shout' }
      ],
      next: 'f100'
    }
  };

  /* The roll call's after-screens, written out from the six found flags (the spec's section 5, "The roll call"):
   * the just-one screens (f100–f105, each `else` the next), the any-found screen (f106, `else` the shapes), the
   * goodbyes (f107–f112, each by its own flag, the last on to the shapes), the all-seven screen (f113, `else`
   * f114), the five-of-six screens (f114–f119, each `else` the next) and the four-or-fewer screen (f120). */
  var n = 100;
  var STEP_OUT = 'Out of the mist, the dragonet you found comes to stand beside you.';
  CLUTCH.forEach(function (d, i) {
    frames[fid(n + i)] = {
      when: onlyOne(d.flag), else: fid(n + i + 1),
      // (each dragonet a step behind our cat, at Sprinkle's spot a step right (STEP): at `beside` the clutch's bigger
      // ones covered her)
      scene: S('island', 'case', MISTY,
        [c(d.who, d.out, 'happy', STEP, 'left')].concat(caseCats(['sit', 'happy'], { fox: false, sprinkle: false, tally: ['sit', 'happy'] })), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ONLY FOR A CAT WHO HAS FOUND ' + d.who.toUpperCase() + ' AND NO OTHER OF THE SIX. Out of the silver mist behind the ring steps the one dragonet our cat found, ' +
        { squall: 'Squall, small and slate-dark', puddle: 'Puddle, blue-grey on his enormous feet', wisp: 'Wisp, the quiet one', sleet: 'Sleet, silver-white and proud', hail: 'Hail, speckled and bouncing', mizzle: 'Mizzle, pearly green and sleepy' }[d.who] +
        ', and comes to stand at its side. Our cat’s face lights up. One caption at the top.',
      caption: [STEP_OUT],
      next: fid(107 + i)
    };
  });
  frames.f106 = {
    when: ANY_SIX, else: 'f113',
    scene: S('island', 'case', merge(MISTY, { small: 'coming' }),
      caseCats(['sit', 'happy'], { fox: false, sprinkle: false, tally: ['sit', 'happy'] }), ['night']),
    board: 'MEDIUM, AT CAT HEIGHT, ONLY FOR A CAT WHO HAS FOUND TWO OR MORE OF THE SIX. Out of the silver mist small dragonet shapes come stepping toward our cat one after another, still misty at the edges, the ones it found coming to stand beside it. Our cat sits up very straight. One caption at the top.',
    caption: ['Small shapes step out of the mist: the dragonets you found.'],
    next: 'f107'
  };
  CLUTCH.forEach(function (d, i) {
    var w = {};
    w[d.flag] = true;
    var f = {
      when: w,
      scene: S('island', 'case', merge(MISTY, d.who === 'wisp' ? { drawing: 'cat' } : {}),
        [c(d.who, d.bye, d.mood, STEP, 'left', { tap: 'nose' })].concat(caseCats(['sit', 'kind'], { fox: false, sprinkle: false, tally: ['sit', 'kind'] })), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, ONLY FOR A CAT WHO HAS FOUND ' + d.who.toUpperCase() + ', THE TAP PICTURE. ' + d.board +
        '. In play its snout glows softly; one tap says goodbye and turns the page. ' + (d.caption ? 'One caption at the top.' : 'One balloon, its own.'),
      scratch: { tap: 'nose', prompt: '**Tap** to say goodbye.', label: 'Say goodbye.', next: fid(108 + i) }
    };
    if (d.caption) f.caption = [d.caption];
    if (d.say) f.say = [d.say];
    if (d.sfx) f.sfx = d.sfx;
    frames[fid(107 + i)] = f;
  });
  frames.f113 = {
    // all seven found: the eldest's bow (decision 20's small extra; all seven get home either way)
    when: ALL_SIX, else: 'f114',
    scene: S('island', 'mist', THICK,
      mistCats(['crouch', 'proud', { tap: 'nose' }], { eldest: true, front: [c('groveclan', 'sit', 'wonder', 'front-1', 'right', { variant: 1 })] }), ['night']),
    board: 'WIDE, THE MIST, ONLY FOR A CAT WHO HAS FOUND ALL SEVEN, THE TAP PICTURE. Out of the mist comes a second great face, grey and weathered with lichen-pale spots and heavy old eyelids, and bows all the way down to the grass in front of our cat; the old GroveClan elder stares. In play our cat’s nose glows softly; one tap bows back and turns the page. Captions top left; her balloon hushed.',
    caption: ['Then, out of the mist, comes the eldest of ALL the Mistscales, older than the great tree.', 'The eldest bows low to you, all the way to the grass.'],
    say: [{ who: 'groveclan', text: 'A Mistscale, bowing to a cat. I’ll remember THAT.', kind: 'whisper' }],
    scratch: { tap: 'nose', prompt: '**Tap** to bow back.', label: 'Bow back.', next: 'f121' }
  };
  SIX.forEach(function (k, i) {
    frames[fid(114 + i)] = {
      when: allBut(k), else: fid(115 + i),
      scene: S('island', 'mist', merge(THICK, { small: 'one' }),
        mistCats(['sit', 'wonder'], { mama: ['lean', 'kind'], nose: ['sit', 'happy'] }), ['night']),
      board: 'WIDE, THE MIST, ONLY FOR A CAT WHO HAS FOUND FIVE OF THE SIX. Far back in the silver mist one small soft dragonet shape waits, faceless and misty, a sister or brother our cat has never met; it seems to look this way. Our cat looks back. One caption at the top.',
      caption: ['One more small shape waits in the mist, a dragonet you’ve never met. To be met another time.'],
      next: 'f121'
    };
  });
  frames.f120 = {
    // reached only by the five-of-six screens' `else`s: four or fewer of the six found
    scene: S('island', 'mist', merge(THICK, { small: 'some' }),
      mistCats(['sit', 'wonder'], { mama: ['lean', 'kind'], nose: ['sit', 'happy'] }), ['night']),
    board: 'WIDE, THE MIST. Far back in the silver mist several small soft dragonet shapes wait, faceless and misty, brothers and sisters our cat has never met; they seem to look this way. Our cat looks back, curious. One caption at the top.',
    caption: ['Other small shapes wait in the mist, dragonets you’ve never met. To be met another time.'],
    next: 'f121'
  };

  var more = {

    /* ------------------------------------------------------------------ The mist stone */

    f121: {
      scene: S('island', 'case', MISTY,
        caseCats(['pawup', 'wonder', { tap: 'paw' }], { fox: false, sprinkle: ['fly', 'happy', { holds: 'pebble' }], tally: ['sit', 'kind'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, THE TAP PICTURE. Sprinkle flutters down out of the sky to our cat, low over the grass, holding her plain grey pebble in her claws, and our cat lifts a paw. In play its raised paw glows softly; one tap holds out its paws for the pebble and turns the page. Caption top left; her balloon shy.',
      caption: ['Sprinkle flutters down. In her claws is her plain grey pebble, smooth as an egg.'],
      say: [{ who: 'sprinkle', text: 'This is for you.' }],
      scratch: { tap: 'paw', prompt: '**Tap** to hold out your paws.', label: 'Hold out your paws.', next: 'f122' }
    },

    f122: {
      scene: S('island', 'paws', {},
        [c('sprinkle', 'lookdown', 'happy', 'above', 'left'), c('player', 'crouch', 'wonder', 'close', 'right', { holds: 'miststone', holdAt: 'paws', flash: true, tap: 'stone' })], ['night', 'sparkle']),
      board: 'EXTREME CLOSE-UP, OUR CAT’S PAWS, THE TAP PICTURE. In our cat’s forepaws lies the plain grey pebble, and as the full moon touches it a band of blue and green light flashes across its face; Sprinkle leans down from above, delighted. In play the stone glows softly; one tap tilts it so it flashes again, and turns the page. Two captions top left.',
      caption: ['The full moon shines on the pebble.', 'And it FLASHES. Blue! Green! Blue again!'],
      scratch: { tap: 'stone', prompt: '**Tap** to tilt it.', label: 'Tilt the stone.', next: 'f123' }
    },

    f123: {
      scene: S('island', 'mist', THICK,
        mistCats(['situp', 'wonder', { holds: 'miststone', flash: true }], { mama: ['lean', 'kind'], beside: ['sit', 'happy'] }), ['night']),
      board: 'MEDIUM, THE MIST. Mama’s great gentle face leans close to our cat and the flashing stone in its paws, her eyes kind, and Sprinkle sits beside our cat, very pleased with her present. Two balloons, Mama’s low and slow, Sprinkle’s warm.',
      say: [
        { who: 'mistscale', name: 'Mama', text: 'A mist stone. Grey, until the moonlight finds it. Our thanks. You saved one of our own.' },
        { who: 'sprinkle', text: 'When the moonlight finds it, that’s me, saying hello.' }
      ],
      next: 'f124'
    },

    f124: {
      when: { worry: 'shiny' },
      scene: S('island', 'paws', {},
        [c('player', 'crouch', 'happy', 'close', 'right', { holds: 'miststone', holdAt: 'paws', flash: true })], ['night', 'sparkle']),
      board: 'EXTREME CLOSE-UP, OUR CAT’S PAWS, A CAT WHO WORRIES ABOUT SHINY THINGS ONLY. Our cat holds the flashing stone close in its forepaws, sparkles all round it, and for once there is nobody to say no; a small inset shows a shiny thing it once had to give back. One caption at the top.',
      caption: ['It sparkles. It shines. And this one, you get to KEEP.'],
      next: 'f125'
    },

    /* ------------------------------------------------------------------ Goodbye */

    f125: {
      scene: S('island', 'case', MISTY,
        caseCats(['sit', 'kind'], { fox: false, front: [c('riffle', 'sit', 'happy', 'fox', 'left')], sprinkle: ['sit', 'happy'], sprinkleFace: 'right' }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT. Sprinkle goes round her friends one by one in the misty moonlight, and turns first to the young otter sitting across the grass from her, who sits up very straight. Caption top left; her balloon grateful.',
      caption: ['Sprinkle says goodbye to everyone, by name.'],
      say: [{ who: 'sprinkle', text: 'Riffle. Thank you for ALL the fish.' }],
      next: 'f126'
    },

    f126: {
      scene: S('island', 'case', MISTY,
        caseCats(['sit', 'kind'], { fox: false, front: [c('riffle', 'sit', 'sad', 'fox', 'left')], sprinkle: ['sit', 'kind'], sprinkleFace: 'right' }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT, COMEDY BEAT. The young otter sniffs very loudly, his whiskers trembling and his eyes suspiciously wet, and looks hard at the sky. Caption top left; his balloon a wobbly protest.',
      caption: ['Riffle sniffs.'],
      say: [{ who: 'riffle', text: 'Otters don’t cry. That’s river water.' }],
      next: 'f127'
    },

    f127: {
      // her thanks, one balloon written twice by `ch3Told`
      scene: S('island', 'case', MISTY,
        caseCats(['sit', 'kind'], { fox: false, front: [c('thymeleaf', 'sit', 'happy', 'front-4', 'left')], tally: ['sit', 'happy'], sprinkle: ['sit', 'happy'] }), ['night']),
      board: 'MEDIUM, AT CAT HEIGHT. Sprinkle thanks Tallyheart and then the old medicine cat, and the old tom shakes one paw at her mended wing as if it were a puppy; Tallyheart’s eyes are very bright. Three balloons, hers warm, his stern and twinkly, hers again a giggle.',
      say: [
        { who: 'sprinkle', text: 'Tallyheart. Thank you for keeping my secret. Thymeleaf. Thank you for my wing.', when: TOLD },
        { who: 'sprinkle', text: 'Tallyheart. Thank you for coming to meet me. Keep counting. ESPECIALLY fish. Thymeleaf. Thank you for my wing.', when: KEPT },
        { who: 'thymeleaf', text: 'Goodbye, wing. Behave.' },
        { who: 'sprinkle', text: 'And tell Coil I’ll be QUIET now.' }
      ],
      next: 'f128'
    },

    f128: {
      // her farewell, one balloon by whether she found any of the six
      scene: S('island', 'case', MISTY,
        caseCats(['sit', 'sad'], { fox: false, sprinkle: ['curl', 'kind'], tally: ['sit', 'kind'] }), ['night']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT. Sprinkle curls down close beside our cat on the moonlit grass and wraps her long misty tail round it, the way she did under the Old Bridge; our cat leans into her. Caption top left; her balloon soft.',
      caption: ['Then Sprinkle wraps her tail round you, the way she did under the bridge.'],
      say: [
        { who: 'sprinkle', text: '{name}paw. You came into the dark, and you found me. You promised to look for them. And you did.', when: ANY_SIX },
        { who: 'sprinkle', text: '{name}paw. You came into the dark, and you found me. And now we’re ALL going home.', when: NONE_SIX }
      ],
      next: 'f129'
    },

    f129: {
      // the light choice: both to the next screen, nothing set
      scene: S('island', 'case', MISTY,
        caseCats(['sit', 'sad'], { fox: false, sprinkle: ['curl', 'happy'], tally: ['sit', 'kind'] }), ['night']),
      board: 'CLOSE-UP, OUR CAT AND SPRINKLE, THE CHOICE. Our cat’s face is happy and sad at once, its eyes shining, and it whispers into Sprinkle’s misty neck; her tail is still round it. Caption top left; its balloon a whisper; the choices sit below the panel.',
      caption: ['You’re happy. You’re sad. You’re both at once.'],
      say: [{ who: 'player', text: 'Goodbye, Sprinkle.', kind: 'whisper' }],
      choice: {
        options: [
          { label: '“Fly SAFE!”', sets: {}, next: 'f130' },
          { label: 'Hug her back, tight.', sets: {}, next: 'f130' }
        ]
      }
    },

    f130: {
      // the leaving: our cat at the sky's foot, looking up, her wave the Tap (a spot of her own: RISE)
      scene: S('island', 'sky', { rising: true, zip: true, grown: true },
        [c('sprinkle', 'fly', 'happy', 'far', 'right', { tailUp: true }), c('player', 'pawup', 'sad', RISE, 'left', { tap: 'paw' })], ['night']),
      board: 'LOW ANGLE, LOOKING UP, THE TAP PICTURE. The great soft shapes of the Mistscales rise into the sky and away upriver, the mist rolling after them, while one tiny winged shape zips off the other way toward the far towers; high up, a small grey dragonet waves her tail. Our cat looks up from the bottom of the panel with a paw raised. In play its paw glows softly; one tap waves back and turns the page.',
      caption: ['The Mistscales rise, and the mist rolls away upriver with them, toward home.', 'One small shape zips off the other way, toward the glass towers.', 'The last thing you see is Sprinkle’s tail, waving.'],
      sfx: 'Hic!',
      scratch: { tap: 'paw', prompt: '**Tap** to wave back.', label: 'Wave back.', next: 'f131' }
    },

    /* ------------------------------------------------------------------ One moon */

    f131: {
      scene: S('island', 'roots', CROWD,
        rootsCats(['walk', 'wonder', { tap: 'paw' }, 'near'], { mood: 'kind', near: [c('tallyheart', 'sit', 'proud', 'near-2', 'left')] }), ['night']),
      board: 'LOW ANGLE, THE GREAT TREE’S ROOTS, THE TAP PICTURE. Glintstar on her root in the middle beckons our cat with a nod, and the other two leaders look down kindly; our cat starts forward from the ring with one paw lifted. In play its lifted paw glows softly; one tap steps it up to the tree and turns the page. One caption at the top.',
      caption: ['Glintstar calls you up to the great tree.'],
      scratch: { tap: 'paw', prompt: '**Tap** to step up.', label: 'Step up.', next: 'f132' }
    },

    f132: {
      scene: S('island', 'roots', CROWD,
        rootsCats(['sit', 'wonder'], { mood: 'kind', near: [c('tallyheart', 'sit', 'proud', 'near-1', 'right'), c('thymeleaf', 'sit', 'happy', 'near-2', 'left')] }), ['night']),
      board: 'LOW ANGLE, THE GREAT TREE’S ROOTS. Our cat sits at the foot of the middle root, very small under the three leaders, and Glintstar looks down at it with the moon behind her. Tallyheart and the old medicine cat sit close by. Her balloon solemn.',
      say: [{ who: 'glintstar', text: 'One moon ago, you came to us from behind the glass. Tonight, your moon is over.' }],
      next: 'f133'
    },

    f133: {
      // Glintstar's honour: two paragraphs in a row, two balloons (the spec's)
      scene: S('island', 'roots', CROWD,
        rootsCats(['sit', 'shy'], { mood: 'kind', near: [c('tallyheart', 'sit', 'happy', 'near-1', 'right'), c('thymeleaf', 'sit', 'happy', 'near-2', 'left')] }), ['night']),
      board: 'LOW ANGLE, THE GREAT TREE’S ROOTS. Glintstar speaks to the whole Gathering, and small insets float over our cat like a list: an empty place in the pile, a fish for a hungry dragonet, a row of bark cards. Our cat ducks its head, shy. Two balloons, both hers.',
      say: [
        { who: 'glintstar', text: 'Tallyheart said to judge you by what you do, not by where you sleep. So we have.' },
        { who: 'glintstar', text: 'You noticed what was missing. You fed a friend who was hungry. You found out the truth, and you said it, to every Clan.' }
      ],
      next: 'f134'
    },

    f134: {
      scene: S('island', 'roots', CROWD,
        rootsCats(['crouch', 'proud', { tap: 'nose' }], { mood: 'happy', glint: ['stand', 'happy'], near: [c('tallyheart', 'sit', 'proud', 'near-1', 'right'), c('thymeleaf', 'sit', 'happy', 'near-2', 'left')] }), ['night']),
      board: 'LOW ANGLE, THE GREAT TREE’S ROOTS, THE TAP PICTURE. Glintstar stands on her root and says it to every Clan, and below her our cat lowers its head with its nose to the grass. In play its nose glows softly; one tap bows, with tremendous dignity, and turns the page. Her balloon ringing.',
      say: [{ who: 'glintstar', text: '{name}paw, you belong to CrystalClan.' }],
      scratch: { tap: 'nose', prompt: '**Tap** to bow, with tremendous dignity.', label: 'Bow.', next: 'f135' }
    },

    f135: {
      scene: S('island', 'wide', merge(OPEN, { bubbles: true }),
        [c('groveclan', 'sit', 'happy', 'root-3', 'left', { variant: 3 }), c('glintstar', 'sit', 'happy', 'root-2', 'right'), c('reedclan', 'sit', 'happy', 'root-1', 'right', { variant: 5 }),
         reed('happy').slosh, reed().she, c('tallyheart', 'sit', 'happy', 'crowd-1', 'right'), c('player', 'sit', 'happy', 'centre', 'right'), reed().tom], ['night', 'purr']),
      board: 'WIDE, THE CLEARING. Every cat in the ring purrs at once, CrystalClan first, then ReedClan, then GroveClan, the purr drawn as warm rings over the whole clearing, and the otters by the water try to join in and only make bubbles. Our cat sits in the middle, glowing. Two captions top left.',
      caption: ['The whole Clan purrs your name. Then ReedClan does. Then GroveClan.', 'The otters try too. It sounds like bubbles.'],
      next: 'f136'
    },

    f136: {
      // nose to nose (no art draws two cats touching); her two paragraphs, two balloons (the spec's)
      scene: S('island', 'case', CROWD,
        [c('player', 'crouch', 'happy', 'speak', 'right'), c('tallyheart', 'crouch', 'kind', NOSE, 'left')], ['night']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT. Tallyheart bends her big ginger head down to our cat’s, nose to nose, her torn ear tipped close, and whispers just for it; a small inset shows a thirteenth sparrow in a row of twelve. Caption top left; her two balloons whispers.',
      caption: ['Tallyheart presses her head against yours.'],
      say: [
        { who: 'tallyheart', text: 'Sharp eyes. I knew it, from the thirteenth sparrow.', kind: 'whisper' },
        { who: 'tallyheart', text: 'Still {name}paw, for now. Your warrior name is coming. And this moon will be in it.', kind: 'whisper' }
      ],
      next: 'f137'
    },

    f137: {
      // the line that hands chapter 10 to the Warrior Counts
      scene: S('island', 'case', CROWD,
        [c('player', 'crouch', 'wonder', 'speak', 'right'), c('tallyheart', 'crouch', 'kind', NOSE, 'left')], ['night']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT. Our cat asks the one-word question with its whole face, and Tallyheart answers, still nose to nose, and a small inset shows the camp’s fountain with a row of Counts round it. Two balloons, both whispers.',
      say: [
        { who: 'player', text: 'When?', kind: 'whisper' },
        { who: 'tallyheart', text: 'When you pass your Warrior Counts. They’re yours, whenever you’re ready. At the fountain, like {Murmur}chime.', kind: 'whisper' }
      ],
      next: 'f138'
    },

    f138: {
      // the chapter's one choice flag, for the Warrior Ceremony: `ch10Best`
      scene: S('island', 'case', CROWD,
        [c('player', 'sit', 'wonder', 'speak', 'right'), c('tallyheart', 'sit', 'kind', 'beside', 'left')], ['night']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT, THE CHOICE. Tallyheart sits back and looks at our cat with her head on one side, and four small insets float between them: a misty dragonet, a ring of friends, a row of bark, a claw-marked tree. Her balloon gentle; the choices sit below the panel.',
      say: [{ who: 'tallyheart', text: 'Which part of this moon will you remember most?' }],
      choice: {
        options: [
          { label: '“Sprinkle.”', sets: { ch10Best: 'sprinkle' }, next: 'f139' },
          { label: '“My friends.”', sets: { ch10Best: 'friends' }, next: 'f139' },
          { label: '“Finding the truth.”', sets: { ch10Best: 'truth' }, next: 'f139' },
          { label: '“The Counts!”', sets: { ch10Best: 'counts' }, next: 'f139' }
        ]
      }
    },

    f139: {
      scene: S('island', 'case', CROWD,
        [c('player', 'sit', 'happy', 'speak', 'right'), c('tallyheart', 'sit', 'happy', 'beside', 'left')], ['night']),
      board: 'MEDIUM TWO-SHOT, AT CAT HEIGHT. Tallyheart smiles the widest smile of the whole moon and answers with her eyes crinkled, the full moon bright behind the two of them. Her balloon warm.',
      say: [
        { who: 'tallyheart', text: 'Me too. Every full moon.', when: { ch10Best: 'sprinkle' } },
        { who: 'tallyheart', text: 'Me too. Every one of them.', when: { ch10Best: 'friends' } },
        { who: 'tallyheart', text: 'Me too. So will every Clan.', when: { ch10Best: 'truth' } },
        { who: 'tallyheart', text: 'Ha! Me too.', when: { ch10Best: 'counts' } }
      ],
      next: 'f140'
    },

    /* ------------------------------------------------------------------ Home */

    f140: {
      // the hook: a badger's old track (module 2's), curious, never scary
      scene: S('island', 'shore', { print: true, ferry: true, tap: 'print' },
        [c('otter', 'stand', 'wonder', 'raft', 'right', { variant: 3, holds: 'pole' }), c('tallyheart', 'stand', 'wonder', 'land-2', 'left'),
         c('player', 'crouch', 'sniff', 'print', 'right')], ['night']),
      board: 'MEDIUM, THE ISLAND’S SHORE, THE TAP PICTURE. On the moonlit mud by the water our cat’s paw has landed beside one big old print, a wide pad and five toes in a row with long digging claw marks, dry and cracked at its edges; Granny the otter and Tallyheart look at it, curious. In play the print glows softly; one tap sniffs it, very carefully, and turns the page. Captions top left; two balloons.',
      caption: ['On the island’s shore, your paw lands beside a BIG print in the mud:', 'five toes in a row, and claws made for digging.'],
      say: [
        { who: 'otter', text: 'Badger. An old track. From far upriver.' },
        { who: 'tallyheart', text: 'A thing to check. Another day.' }
      ],
      scratch: { tap: 'print', prompt: '**Tap** to sniff it, very carefully.', label: 'Sniff the print.', next: 'f141' }
    },

    f141: {
      scene: S('ferry', 'river', HOME,
        [c('otter', 'stand', 'happy', 'pole', 'left', { variant: 3, holds: 'pole' }), c('player', 'sit', 'happy', 'raft-2', 'right'),
         c('riffle', 'sit', 'happy', 'raft-1', 'left', { tap: 'ears' })], ['night']),
      board: 'WIDE, THE RIVER, THE TAP PICTURE. The Moon Ferry bumps home against the Crossing’s stones under the high full moon, small seated cats all along its logs, and at the front our cat and Riffle sit side by side, talking. In play his small round ears glow softly; one tap hugs him and turns the page. Three balloons.',
      say: [
        { who: 'riffle', text: 'Best Gathering EVER.' },
        { who: 'player', text: 'See you tomorrow?' },
        { who: 'riffle', text: 'And the day after. And the day after THAT!' }
      ],
      scratch: { tap: 'ears', prompt: '**Tap** to hug him.', label: 'Hug Riffle.', next: 'f142' }
    },

    f142: {
      // the walk home by moonlight; Coil is not drawn, so his words are the caption's quote
      scene: S('riverbank', 'path', MOON,
        [c('player', 'walk', 'happy', 'path-left', 'right'), c('tallyheart', 'walk', 'kind', 'path-right', 'right')], ['night']),
      board: 'WIDE, THE RIVER PATH BY MOONLIGHT. Our cat and Tallyheart walk home along the pale path past the Old Bridge, the river silver below them; from somewhere in the bridge’s old stones comes a dry little voice, lettered in a caption. Two captions top left.',
      caption: ['Past the Old Bridge, on the walk home, a voice in the stones whispers,', '“Quiet at last. I’ll miss the burps.”'],
      next: 'f143'
    },

    f143: {
      scene: S('riverbank', 'roof', { moon: 14, roar: true, flyer: true },
        [c('player', 'lookup', 'happy', 'path-left', 'right'), c('tallyheart', 'lookup', 'happy', 'path-right', 'left')], ['night']),
      board: 'LOW ANGLE, FROM THE PATH. Up at the top of the tallest tower by its little red light, a very small roar and a tiny hiccup come from up there, and then one small winged shape flies off upriver across the moon; our cat and Tallyheart look up from the path. Captions top left.',
      caption: [
        'From the tallest tower: one last roar, and a tiny hiccup. Then a small shape flies off upriver.',
        { when: { foundSquall: true }, text: 'Squall, saying goodbye. LOUDLY.' }
      ],
      next: 'f144'
    },

    f144: {
      scene: S('tower', 'up', { moon: 14, chime: true, light: true },
        [c('waffles', 'peer', 'shout', 'railing', 'left'), c('player', 'lookup', 'happy', 'foot', 'right')], ['night']),
      board: 'LOW ANGLE, TALL PANEL, NIGHT. The glass tower is dark blue against the stars with its windows lit gold, the full moon high over it, and nineteen floors up a fluffy white face pops over the balcony railing, bow askew; our cat calls up from the foot of it. Two balloons, hers a squeal, our cat’s a shout.',
      say: [
        { who: 'waffles', text: '{petname}! DARLING! I saw MIST! And DRAGONS!', kind: 'shout' },
        { who: 'player', text: 'Every Clan heard about you tonight! You were a WITNESS!', kind: 'shout' }
      ],
      next: 'f145'
    },

    f145: {
      scene: S('tower', 'up', { moon: 14, chime: true, light: true },
        [c('waffles', 'peer', 'wonder', 'railing', 'left'), c('player', 'lookup', 'happy', 'foot', 'right')], ['night']),
      board: 'LOW ANGLE, TALL PANEL, COMEDY BEAT. Up at the railing the white cat peers down, overcome, her eyes enormous; the moon shines on her bow. Our cat grins up at her. Her balloon a gasp.',
      say: [{ who: 'waffles', text: 'ME? At the GATHERING?', kind: 'shout' }],
      next: 'f146'
    },

    f146: {
      scene: S('tower', 'up', { moon: 14, chime: true, light: true },
        [c('waffles', 'peer', 'dreamy', 'railing', 'left'), c('player', 'pawup', 'happy', 'foot', 'right', { tap: 'paw' })], ['night']),
      board: 'LOW ANGLE, TALL PANEL, THE TAP PICTURE, COMEDY BEAT. The white cat sways at the railing with her eyes rolled up dreamily and leans back out of sight, quite overcome; down below our cat lifts a paw to wave. In play its raised paw glows softly; one tap waves up at her and turns the page. Caption top left; her balloon a faint.',
      caption: ['She sways.'],
      say: [{ who: 'waffles', text: 'I have to lie DOWN.' }],
      scratch: { tap: 'paw', prompt: '**Tap** to wave up at her.', label: 'Wave up at Waffles.', next: 'f147' }
    },

    f147: {
      scene: S('den', 'outside', { weather: 'clear', moon: 14 },
        [c('player', 'walk', 'proud', 'doorway', 'left'), c('grizzled', 'sit', 'proud', 'entrance-left', 'right'), c('murmurchime', 'sit', 'happy', 'entrance-right', 'left')], ['night']),
      board: 'WIDE, THE CAMP AT NIGHT, COMEDY BEAT. Under the full moon the old grizzled tom sits by the den’s entrance with his nose in the air, very wise all of a sudden, and our cat pads up to him with a look; the tortoiseshell warrior on the other side hides a grin. Caption top left; three balloons.',
      caption: ['In camp:'],
      say: [
        { who: 'grizzled', text: 'I always said that dragon was innocent.' },
        { who: 'player', text: 'You said that GLASS was a dragon’s.' },
        { who: 'grizzled', text: 'An innocent mistake.' }
      ],
      next: 'f148'
    },

    f148: {
      scene: S('den', 'outside', { weather: 'clear', moon: 14 },
        [c('player', 'sit', 'happy', 'doorway', 'right'), c('grizzled', 'sit', 'sleepy', 'entrance-left', 'right'), c('murmurchime', 'sit', 'proud', 'entrance-right', 'left')], ['night']),
      board: 'MEDIUM, THE CAMP AT NIGHT. The young tortoiseshell warrior turns to our cat with her chest out and promises, and a small inset shows the camp’s fountain with a cat sitting her Counts in front of a cheering row. Her balloon proud.',
      say: [{ who: 'murmurchime', text: 'When you sit your Warrior Counts, I’ll be right at the front.' }],
      next: 'f149'
    },

    /* ------------------------------------------------------------------ Ten claw marks */

    f149: {
      // (lying, so the stone is under her chin or by her nose, as the caption says)
      scene: S('den', 'nest', DEN_GLASS,
        [c('player', 'lie', 'happy', 'nest', 'left')], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat flops down in its own moss nest at last, its glass and its secret bark tucked under the moss, its Case File in rows along the mossy edge; Riffle’s nearly black stone lies where it was put. Captions in a column beside the panel.',
      caption: [
        'Your nest, at last.',
        { when: { ch2Stone: 'nose' }, text: 'Riffle’s stone is by your nose.' },
        { when: { ch2Stone: 'chin' }, text: 'Riffle’s stone is under your chin.' }
      ],
      next: 'f150'
    },

    f150: {
      scene: S('den', 'inside', DEN_MOON,
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('player', 'sit', 'happy', 'nest', 'left')], ['night']),
      board: 'WIDE, INSIDE THE DEN, NIGHT. Across the den the grey apprentice flops into his nest and mumbles his usual request with his eyes already shut, and our cat sits up in its own nest, ready to count. The full moon shines in at the doorway. His balloon a mumble.',
      say: [{ who: 'snorer', text: 'Do the paw thing…', kind: 'whisper' }],
      next: 'f151'
    },

    f151: {
      scene: S('den', 'inside', DEN_MOON,
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('player', 'sit', 'laugh', 'nest', 'left')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN, NIGHT, COMEDY BEAT. The grey apprentice has curled up tight and is snoring, a little zzz rising from him, before our cat has counted a single paw; our cat sits in its nest with a paw half raised, giggling. One caption at the top.',
      caption: ['He’s snoring before you can.'],
      next: 'f152'
    },

    f152: {
      // the stone goes on the moss and into My nest, a gift from Sprinkle
      gift: 'mist-stone',
      scene: S('den', 'nest', DEN_GLASS,
        [c('player', 'situp', 'kind', 'nest', 'left', { holds: 'miststone', tap: 'stone' })], ['night']),
      board: 'CLOSE-UP, THE NEST, THE TAP PICTURE. Our cat sits up in its nest holding the grey stone in both forepaws, and a small inset shows the leaning tree with its ten claw marks; the moss waits beside its glass and the corners of its bark. In play the stone glows softly; one tap lays it on the moss and turns the page. Three captions in a column.',
      caption: ['Ten claw marks on the tree.', '“One day, there’ll be ten marks here,” Tallyheart said, on your third day.', 'And today is that day.'],
      scratch: { tap: 'stone', prompt: '**Tap** to lay the mist stone on the moss.', label: 'Lay the stone on the moss.', next: 'f153' }
    },

    f153: {
      // the hook once more, before the doorway and the stone: her last look before sleep is home
      scene: S('island', 'shore', { print: true }, [], ['night']),
      board: 'INSERT, THE ISLAND’S SHORE, FAR AWAY. Nobody is there now: only the moonlit mud at the water’s edge and one big old print in it, five toes in a row and long claw marks, dry at its edges, the silver river beyond. Quiet and curious, never dark. One caption at the top.',
      caption: ['Out on the island, the badger’s old track lies in the moonlight. What is a badger LIKE?'],
      next: 'f154'
    },

    f154: {
      scene: S('den', 'doorway', DEN_FLASH,
        [c('player', 'lie', 'kind', 'nest', 'right')], ['night', 'stars']),
      board: 'MEDIUM, FROM INSIDE THE DEN, NIGHT. The full moon looks in at the doorway, round and silver, and on the moss beside our cat the grey stone flashes a band of blue and green; our cat lies with its chin on its paws, smiling at it. Caption top left; its balloon a whisper.',
      caption: ['In the doorway, the full moon looks in. Your stone flashes, blue and green.'],
      say: [{ who: 'player', text: 'Hello, Sprinkle.', kind: 'whisper' }],
      next: 'f155'
    },

    f155: {
      // half asleep: the lids down to the middle of her eyes and kind's small smile (the next panel is asleep)
      scene: S('den', 'nest', DEN_STONE,
        [c('player', 'curl', 'kind', 'nest', 'left', { asleep: 'half' })], ['night']),
      board: 'CLOSE-UP, NIGHT. Our cat curls up tight in its nest beside the grey stone and its glass, eyes half shut and a small smile, and a thought bubble holds two pictures side by side: a dark doorway with no moon at all, and the same doorway with a round full moon. Captions top left and at the bottom.',
      caption: ['On your very first night, there was no moon at all.', 'Tonight it’s round and full. And you’re HOME.', 'You curl up tight, warm and safe, and sleep.'],
      next: 'f156'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f156: {
      scene: S('den', 'nest', DEN_STONE,
        [c('player', 'curl', 'sleepy', 'nest', 'left')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest beside its stone and its bark, paws twitching, and above its head a big empty dream bubble edged with tiny stars, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream, the night of the Gathering?'],
      // short enough for one line in the box
      input: { kind: 'dream', placeholder: 'A mist stone… a moon… a fox…', next: 'f157' }
    },

    f157: {
      // the closing frame: the den's stone close-up, the stone flashing, her sleeping tail's tip at the bottom
      scene: S('den', 'stone', DEN_FLASH,
        [c('player', 'curl', 'sleepy', 'tail', 'left', { asleep: true })], ['night']),
      board: 'EXTREME CLOSE-UP, THE MOSS AT THE NEST’S EDGE, CLOSING SHOT. The mist stone lies big in the middle of the soft moss in the moonlight from the doorway, a band of blue and green flashing across its grey face, the corner of a curl of bark and the glass’s leaf beside it, and the tip of a sleeping tail at the bottom. Caption at the bottom, with END OF CHAPTER TEN lettered like a title.',
      caption: ['On the moss, your mist stone flashes blue and green under the full moon.', 'End of Chapter Ten. The end of {name}paw’s First Moon.'],
      end: true
    }
  };
  Object.keys(more).forEach(function (k) { frames[k] = more[k]; });

  // The frames are written by section above; the chapter lists every frame in id order (f001, f002…), the
  // reading order a storyboard and the tests expect.
  var ordered = {};
  Object.keys(frames).sort().forEach(function (k) { ordered[k] = frames[k]; });

  /* The lines the sets share (the spec's section 2). */
  function T(text) { return { who: 'tallyheart', text: text }; }
  var QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
  var AFTER = ['Ha! You didn’t even look at the sand that time.'];
  var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';
  var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
  // a question with a way: said once more before the last line; on a last miss its way alone
  function way(text) { return { miss: text + ' ' + MISS, missLast: text }; }
  // chapter 9's spiders and their legs; the 7s' clutches of seven little dragonets
  var LEGS = { table: 8, thing: 'leg', things: 'legs', unit: 'spider', units: 'spiders', teacher: 'tallyheart', ask: '{a} × {b}' };
  var CLUTCHES = { table: 7, thing: 'dragonet', things: 'dragonets', unit: 'clutch', units: 'clutches', teacher: 'tallyheart', ask: '{a} × {b}' };
  var WAY49 = 'Six sevens is forty-two. One more seven: forty-nine.';
  var WAY56 = 'Twenty and twenty make forty. Eight and eight make sixteen. Forty and sixteen: fifty-six.';   // chapter 9's, exactly

  PC.story.ch10 = {
    id: 'ch10',
    number: 10,
    title: 'The Gathering',
    start: 'f001',
    // Puddle, chapter 5's “The big-footed dragon” from his feet to his name (his riddle's lines, its help, its
    // fillers and its retry read it too); Granny, chapter 5's otter variant 3, the only otter who speaks here
    names: { puddle: 'The big-footed dragon', otter: 'Granny' },

    // No new card: chapter 5's `puddle-paws` is given again by "Under the raft" (f028) to a cat who meets him here.
    cards: {},

    frames: ordered,

    counts: {
      // The warm-up on the 8s, in the empty Hollow: two questions, in chapter 9's spiders, with its help. The first
      // is the hard slot (warmHard, at 0): the 8s fact she found hardest in chapter 9, in the order she was asked it,
      // and 8 × 8 when nothing was; never 1 × 8, 2 × 8, 4 × 8, 6 × 8 or 9 × 8 (chapter 9's spec, section 8). 2 × 8
      // is asked in the engine's words (the story's), so it is timed on itself. Fillers are chapter 9's lesson's
      // easiest, after “One from the spiders.”, never 6 × 8 (the Moon Ferry's eight), 8 × 8 or 7 × 8.
      'ch10-eights': merge(LEGS, {
        facts: [[8, 8], { a: 2, b: 8, right: [T('Sixteen! Eight and eight.')], rightAgain: true }],
        warmHard: { table: 8, at: 0, avoid: [[1, 8], [2, 8], [4, 8], [6, 8], [8, 9]] }, avoid: [[6, 8]],
        fillFrom: 'ch09-eights', fillOrder: 'easiest', fillIntro: 'One from the spiders.',
        praise: ['Two fours make an eight!', 'Eight more, every time!'],
        fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST,
        remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
        rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
      }),

      // The lesson: the 7s, clutches of seven, ten facts in both orders (five each way). She knows every seven but
      // 7 × 7, the one new fact, asked with stepping stones (6 × 7 three before it, lit 42) and again on the Moon
      // Ferry. 7 × 5, 7 × 3, 10 × 7 and 7 × 1 are asked “How many dragonets?” and timed on themselves. The 7s' own
      // Count (“Clutches of seven · the 7s”).
      'ch10-sevens': merge(CLUTCHES, {
        label: 'Clutches of seven', hollowThings: 'sevens', fillOrder: 'easiest', prompt: 'How many dragonets?',
        facts: [
          { a: 2, b: 7, prompt: 'Two clutches. How many dragonets?', retryPrompt: true, right: [T('Fourteen! Seven and seven.')] },
          { a: 7, b: 5, right: [T('Thirty-five! You hopped that one already.')] },
          [7, 3],
          merge({ a: 4, b: 7, prompt: 'Four clutches. Two clutches, doubled.', retryPrompt: true, right: [T('Twenty-eight!')] },
            way('Fourteen and fourteen. Ten and ten make twenty. Four and four make eight. Twenty-eight.')),
          merge({ a: 6, b: 7, lit: 35, prompt: 'Six clutches. Five sevens is thirty-five. One more seven…', retryPrompt: true,
            right: [T('Forty-two!')] }, way('Five sevens is thirty-five. One more seven: forty-two.')),
          [10, 7],
          [7, 1],
          merge({ a: 7, b: 7, lit: 42, prompt: 'Seven clutches. Six sevens is forty-two. One more seven…', retryPrompt: true,
            right: [T('Forty-nine! The new one.')], rightAgain: true }, way(WAY49)),
          merge({ a: 7, b: 8, prompt: 'Eight clutches? You did that one with spiders. Twenty-eight, doubled.', retryPrompt: true,
            right: [T('Fifty-six!')] }, way(WAY56)),
          merge({ a: 9, b: 7, prompt: 'Nine clutches. Ten would be seventy.', retryPrompt: true,
            right: [T('Sixty-three! Six and three make nine.')] }, way('Seventy, and one clutch less: sixty-three.'))
        ],
        praise: ['Seven more, every time!'],
        fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: 'That’s the sevens.'
      }),

      // The Moon Ferry Counts, upriver at night: eight answers touching all ten tables, the easiest first, each fact
      // its own Count's picture (`table` on each: chapter 7's mixed lesson), Tallyheart calling it by name and a
      // Clanmate cheering (every cheer kept on its retry). Help is the picture scratched on a log. Fillers are chapter
      // 2's easy ears, after “One more!”, in the ferry's words and with no cheer; never one of the ferry's own pairs.
      // 7 × 7 comes last, as seven rows of seven marks on the log (never clutches: Sprinkle is still luggage).
      'ch10-ferry': {
        table: 2, thing: 'leg', things: 'legs', teacher: 'tallyheart', ask: '{a} × {b}', ground: 'log',
        fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillIntro: 'One more!', avoid: [[2, 5]],
        facts: [
          { a: 8, b: 1, table: 1, prompt: 'Tails! Eight cats.', retryPrompt: true, right: [{ who: 'murmurchime', text: 'Eight!' }], rightAgain: true },
          { a: 5, b: 2, table: 2, prompt: 'Ears! Five cats.', retryPrompt: true, right: [{ who: 'snorer', text: 'Ten!' }], rightAgain: true },
          { a: 3, b: 10, table: 10, prompt: 'Both forepaws! Three cats.', retryPrompt: true,
            right: [{ who: 'riffle', text: 'Thirty! That’s a LOT of claws.' }], rightAgain: true },
          { a: 6, b: 3, table: 3, prompt: 'Patrols! Six patrols.', retryPrompt: true,
            right: [{ who: 'grizzled', text: 'Eighteen guards. Not ONE of them with a pinecone.' }], rightAgain: true },
          { a: 4, b: 6, table: 6, picture: { kind: 'cheeks' }, prompt: 'Whiskers! Four cheeks.', retryPrompt: true,
            right: [{ who: 'glintstar', text: 'Twenty-four. I remember that count.' }], rightAgain: true },
          { a: 9, b: 4, table: 4, prompt: 'Paws! Nine cats.', retryPrompt: true,
            right: [{ kind: 'caption', text: 'Thump! Granny bangs her pole.' }, { who: 'otter', variant: 3, text: 'Thirty-six!' }], rightAgain: true },
          { a: 6, b: 8, table: 8, prompt: 'Spiders’ legs! Six spiders.', retryPrompt: true,
            right: [{ who: 'thymeleaf', text: 'Forty-eight!' }, { kind: 'caption', text: 'From the luggage: a happy puff of mist.' }], rightAgain: true },
          merge({ a: 7, b: 7, table: 7, picture: { kind: 'marks', ground: 'log' }, prompt: 'And the new one. Seven sevens!', retryPrompt: 'Seven sevens!',
            right: [T('Forty-nine!'), { kind: 'caption', text: 'The whole Moon Ferry cheers.' }], rightAgain: true }, way(WAY49))
        ],
        praise: [], helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: null
      },

      // The sixty, at the case: chapter 7's sum said again (10 × 6, on the 10s as chapter 7's sixties were), in chapter
      // 7's picture, six nights of ten marks. The frame's two balloons are its question, not said again over it (f071's
      // `intro: false`); its own prompt is her last sentence, the same line as its retry's, so a sixty picked up
      // mid-question is asked in words too. A miss lights the nights by tens in Tallyheart's count,
      // then two easy tens from chapter 4, “An easy one.”, in the sixty's own picture and words.
      'ch10-sixty': {
        table: 10, thing: 'fish', things: 'fish', unit: 'night', units: 'nights', teacher: 'tallyheart', ask: '{a} × {b}',
        picture: { kind: 'marks' },
        facts: [{ a: 10, b: 6, prompt: [{ who: 'player', text: 'And a dragon who eats ten fish a meal, for six nights?' }], retryPrompt: [{ who: 'player', text: 'And a dragon who eats ten fish a meal, for six nights?' }],
          right: [{ who: 'player', text: 'SIXTY!' }, { who: 'glintstar', text: 'A good count.' }], rightAgain: true }],
        help: 'picture', helpIntro: HOP, helpIntroFar: HOP_FAR,
        fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
        praise: [], miss: MISS, missLast: LAST, done: null
      }
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'The Gathering',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: '{name}paw’s dream, the night of the Gathering, stayed a secret.',
      // Eight entries on every reading, one more with Puddle found here and one more with all seven: one sentence
      // each, so 8 to 10 on every path. The cat is named wherever a tom's “he” could mean another animal. No dragonet
      // page: Puddle's is chapter 5's (true as it stands: the Moon Ferry is the otters' ferry raft).
      recap: [
        { text: 'On the morning of the Gathering, Tallyheart taught {name}paw {their} tenth Count, clutches of seven: the sevens.' },
        { text: 'At dusk the otters’ Moon Ferry carried CrystalClan upriver under the full moon, and Tallyheart ran the Counts to steady everyone’s nerves.' },
        { when: { ch10Puddle: true }, text: 'Under the Moon Ferry, {name}paw found Puddle, Sprinkle’s brother with the enormous feet, who saw clever little paws picking up mice on the storm night.' },
        { text: 'On Gathering Island, Reynard told every Clan his story, and {name}paw answered it, card by card, out loud.' },
        { text: 'Snip and Snatch blamed each other and told everything, and every Clan, standing together, sent the fox and the weasels away past the last post.' },
        { text: 'Then the Mistscales came in the mist for their clutch, and Sprinkle’s wing held: she flew to her Mama.' },
        { when: ALL_SIX, text: 'The eldest Mistscale bowed low to {name}paw, the cat who found all seven.' },
        { text: 'Sprinkle pressed her grey pebble into {name}paw’s paws, and under the full moon it flashed blue and green: a mist stone.' },
        { text: 'In front of every Clan, Glintstar said that {name}paw belongs to CrystalClan, and Tallyheart said {their} warrior name is coming, with this moon in it.' },
        { text: 'At bedtime there were ten claw marks on the tree, and a mist stone on the moss.' }
      ]
    },

    // the Warrior Ceremony's (docs/warrior-counts.md, section 1): what her book shows under this chapter's page while
    // the Ceremony is unbuilt; the Warrior Counts' page puts “Your ceremony is coming soon.” in its place once she has passed
    teaser: {
      title: 'The Warrior Ceremony',
      lines: ['Pass your Warrior Counts, and the Clan will gather for your name.']
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
