#!/usr/bin/env node
/* Potomac Crossing: the verbal storyboard.
 *
 *   node tools/storyboard.mjs                                               every chapter in app/story/ -> docs/storyboard/
 *   node tools/storyboard.mjs app/story/ch02.js [docs/storyboard/ch02.md]   one chapter
 *   node tools/storyboard.mjs app/story/warrior.js [docs/storyboard/warrior.md]   the Warrior Counts
 *                                             (`PC.warrior`: its openings, the question panel, the sitting's
 *                                             lines and pauses, the halfway page and every result's pages;
 *                                             written with every chapter when the file is there)
 *   node tools/storyboard.mjs --check-words   every set, camera, anchor, option value, pose, mood,
 *                                             effect and cast extra in the art's vocabulary has words here
 *                                             (exit 1 and a list when one hasn't; tests run it)
 *   node tools/storyboard.mjs --check-words more.json   the same, with the names in more.json added to
 *                                             the art's (a chapter's art needs, checked before the art lands)
 *
 * Reads a chapter (the UMD story file) and writes a Markdown storyboard of every frame in reading
 * order, with each choice's branches grouped under it: the shot (the frame's `board`), the scene
 * in plain words, the captions, the balloons with who says them, the sound effect, the condition
 * a line or an option shows under (`when`), a gift, and what the reader does next (the skip-count
 * and each Counts lesson, with its questions, included). Chapter 3 on: a frame shown only `when` it
 * matches, a balloon's `digits`, a skip-count that keeps its totals or hops on her own forepaws, the
 * Counts sets' new keys (an ordered warm-up alt, `avoid`, `ground`, `helpCounter`, `fillOrder`,
 * `fillVoice`, `againIntro`, `helpIntroNotFive`, `done: null`), the chapter's speaker `names`, and
 * the book's dragonet page; each printed only where a chapter uses it, so earlier storyboards stay
 * as they were. Chapter 4 on: the Case File's cards (the chapter's `cards`, a frame's `card`), flags a
 * frame sets for good (`sets`), the pages she taps (`scratch`: the row of bark, her first tap, the
 * glint; `file`: her Case File opened the first time), an option's label for a reader it matches
 * (`labelWhen`), a frame's `else`, the skip-counts on both forepaws, on the pile of six and on one
 * forepaw, the Counts sets' new keys (`label`, `hollowThings`, `helpIntroNotTen`, the roof's grit),
 * and a dragonet page shown only when she has found him. Chapter 5 on: the open river and the marsh,
 * the heron and the two dragonets found there, the questions she taps out of an otter (`ask`), the
 * one-tap frames on anything but the glitter (with the small answer to a tap anywhere else), the
 * skip-count's new forms (the tuck, her paws aboard, nine claws in the log with its `steps`, the mud
 * count with a `who` that depends on her, the bedtime nines), the Counts sets' new keys (a set's own
 * `light`, the 9s' three help openings, a fact's own miss lines and the answers it `shows`, a silent
 * set lettered in captions, `help: 'picture'`, `helpSays`, `fillPicture`, the raft's log for a ground,
 * a warm-up's own `avoid`, a Counts frame's `intro: false`), cards that name the cards they touch
 * (`link.with`), and a dragonet's own pose in her book. Chapter 6 on: the wall's far end where
 * ReedClan meets her, the dream on the Sky River, Coil's wall under the bridge (`wall` its own
 * picture), the last post's long grass, the pile's moon, Coil, Sloshbank, ReedClan by coat and Sleet
 * in their poses (each character's own words where a shared pose word would be wrong), the new holds
 * and taps, the starry cat, Sleet's roll call, a Counts set's own cast for its pictures, and the
 * questions Tallyheart taps out on the tree. Chapter 7 on: round the back of the pile (`rear`, `hole`:
 * the tunnel's mouth, the roots over it, the guards past the rows, the climber on the arch, the tracks
 * far off), her paw over Sprinkle's print (`print`, `over`), the two lines of the comparison
 * (`compare`), the taps on the back row, the roots, the print, Riffle's fish and Sprinkle's mist, the
 * Counts pictures of cheeks (`cheeks`, `cheeks-top`; a `who` pair as one face), of nights of marks
 * (`marks`) and the skip-counts on the back row's empty places (`gap`) and on whiskers (`whisker`, one
 * cheek at the 3s, cheeks at the 6s), the sand at the 6s, a set's own question words (`prompt`), and a
 * card link's `not` whose values are all false read as an or. Chapter 8 on: the railway bank by the
 * tracks (`tracks`: the bank, the weeds, the holes, the brag, the stash and its glass, and the tunnel's
 * inside, `crawl` and `fork`, in place words of their own), the Barking Field at night (its moon, the
 * heap, the log, the wire, the ring, the fence top, the trail), the pile's `poke` and the tunnel's mouth
 * tapped, the den's half moon and her glass, Hail, Snip and Snatch in their own poses, the cats' run, the
 * dogs lying down, Reynard's trot, the raised tail, the leaf and the glass in it, the mouse, a tap mark
 * someone else carries (Riffle's ears and paw, the friend's tail), one cat's paws a pair at a time and
 * cats' paws by fours, the field's four animals, nights of marks two and two, the sand at the 4s, and a
 * card link's own line for each partner (`lines`). Chapter 9 on: GroveClan's woods (`grove`: the little
 * bridge, the old trees, the elder's place, the old oak and the hollow in it, the oak and the hollow in place
 * words of their own), Thymeleaf's den in the camp (`herbs`, the spider's web, the remedy), the case laid out
 * on the den floor (`case`, a row lit a tap, `read`) under a nearly round moon (`moon: 13`), the reed root at
 * the wall's end, the roof's dew at first light, the sunny shallows by the Old Bridge and the bank's new spots;
 * Thymeleaf, Mizzle, GroveClan's cats by variant and the spider in their poses, Sprinkle in flight, Squall
 * behind the pole, Riffle's mint, the wing and the root tapped, her own nose and tail tapped; the Counts
 * pictures of spiders (and one spider's two sides), doses in rows of eight (drops, paw marks, marks), twigs of
 * acorns, the sand at the 8s four and four; the questions somebody answers himself, and the rows of her case
 * tapped out one by one. Chapter 10 on: the otters' Moon Ferry (`ferry`: the boarding at dusk, the deck, the
 * luggage, the low raft and the gap under it, the river) and Gathering Island (`island`: the shore and the
 * badger's print, the clearing under the great tree, the leaders' roots, the case, the fox at the river's
 * edge, the mist and the Mistscales, the sky, her paws with the stone) in place words of their own, the full
 * moon over the den, the tower and the riverbank, the mist stone and its close-up, the Hollow's ten marks;
 * the grown Mistscales by variant (Mama, the eldest), the leaders and GroveClan's crowd by coat, Granny by the
 * chapter's name, Puddle's eyes, Reynard's bow and the weasels' hidden paws, the swim, wet fur, the stone held
 * and tapped, the dragonets' snouts tapped; the clutches of seven and the sand at the 7s four and three, the
 * mixed Moon Ferry Counts on a log, the roll call's forepaws with the clutch's shapes; the two weasels' ask;
 * and the card pick (`pick`: the claim, the right cards, the nudges, her pick remembered, and a `when` that
 * reads it in the card's own line), which the tool's own graph follows. Chapter 12 on: Chispapaw's Spanish (a
 * `lang: 'es'` balloon printed *[es]* with its Spanish and its English, a {es:key} token as «its Spanish», the paw thing
 * counted in her Spanish, a set's `echo`), Chispapaw herself and her collar off, a cat carrying a mouse, the store on the
 * dry den's floor under the Old Bridge (its camera, spots and Tap), its plan in the Training Hollow's sand with its glow
 * and Tap, the quick marks (her square round like a cookie), the third spot at the hedge and the den's moon at 16; every
 * earlier storyboard exactly as it was. Chapter 13 on: the camp's first frost (and the dawn patrol's trails through it) and
 * the two spots by the ferns, the spread forty-three in the Hollow's sand, Chispapaw's collar left in the den, the big dig
 * by GroveClan's old oak (its close-up, the marks' close-up, its spots, the marks beside it and its two Taps: the grove's
 * `marks` and `tap` worded before the Hollow's claw marks), the groundhog in its poses, a curled cat's tail straight up;
 * every earlier storyboard exactly as it was. Written for an illustrator, a
 * grown-up reading along, or anyone checking the chapter without playing it. No dependencies.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve, relative, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const E = require(join(ROOT, 'app/engine.js')).engine;   // for the gifts' names
// chapter 12: module 2's words (PC.words: the kit's English and Chispapaw's Spanish), beside the engine
require(join(ROOT, 'app/story/words.js'));

/* ------------------------------------------------------------------ plain words (docs/build.md) */
// Each set: [where, what is in it], and the time of day it is drawn in when the frame's fx names
// none (the art's own default, app/art/scenes.js and app/art/sets/*.js). The scene line says the
// frame's own time of day, from its fx, the way the art reads it: "the den, in the morning".
const SETS = {
  room: ['the ground-floor home', 'tall glass patio door, round cushion, lamp, rug, plants; through the glass: lawn, hedge, fence, lamp post, glowing glass towers, airplanes'],
  tower: ['outside, looking up a glass tower', 'balconies, one ground-floor window'],
  garden: ['the lawn between the patio and the hedge', 'fence with sparrows, lamp post, hedge with a gap, patio step'],
  camp: ['CrystalClan’s camp, the wild garden behind the hedge', 'bramble dens, ferns, mossy stone paths, a dry stone fountain, glass towers all around'],
  hollow: ['the Training Hollow, a sandy hollow at the edge of camp under an old leaning tree', 'a sun patch'],
  den: ['the apprentices’ den under an enormous rosebush', ''],
  sky: ['the night sky over camp and the Sky River', 'the Milky Way'],
  river: ['from the camp’s edge toward the river', 'the Old Bridge’s dark shape, the water'],
  title: ['the river, glass towers, a bridge', 'one cat on a wall'],
  pile: ['the prey pile in camp, a shady corner under an arch of brambles, the fountain’s edge at the right', 'mice and voles, soft and round with their tails tucked in, all eyes shut, stacked in pairs'],
  bridge: ['the Old Bridge, the rail bridge, at its near (Virginia) end', 'stone legs, an iron truss on top, brown swirly water, squashed reeds'],
  field: ['the Barking Field from the path outside its tall wire fence', 'a muddy square of grass'],
  crossing: ['the Crossing at Gravelly Point', 'a rocky point where the river opens wide and shining, the otters’ log raft tied with vines, airplanes low overhead'],
  riverbank: ['the river path below a muddy bank', 'the glass towers shining, and upside down in the water; the tallest tower has a little red light on its roof'],
  // chapter 4
  roof: ['the roof of the tallest tower, flat and wide', 'pale grit underfoot, a low wall all the way round, one pole in the middle with a small red light, a little hut with the roof door propped open, a rain puddle; sky everywhere; beyond the wall, small and bright, the camp, the river, the Old Bridge and the two shiny lines of the track'],
  // chapter 5
  openriver: ['the open river, out on the otters’ ferry raft', 'wide bright water, the Crossing’s own sunny blue, never dark; the Crossing’s rocks close behind, a few raft-lengths off; the glass towers standing on their heads in the water, the tallest with its red light; far across, a tall white needle of stone above the trees; the raft is four logs lashed with vines, riding low, with a long pole; nothing is ever drawn as a shape under it, and nobody but an otter or a dragonet is ever in the water'],
  marsh: ['the marsh, seen from the otters’ raft', 'still water behind a low bank, reeds taller than a cat, lily pads, mist low on the water, a mud flat beside the raft with shallow water over its edge, clear enough to show the bottom; among the pale reeds one reed is paler than the rest; our cat never leaves the raft: the mud is ReedClan’s'],
  // chapter 8: the trail's end, always at night, moonlit and silver, never black; nobody of the Clan on the rails
  tracks: ['the railway bank by the tracks, past the Barking Field: nobody’s land, the trains own it', 'a high grassy bank, on its flat top the ballast, the sleepers and two long rails bright in the moonlight; along its face five or six holes (dark ovals with a lip of earth), faint tiny prints round every one, the biggest low on the right, a little one left of it, two more higher up, the tunnel’s end at the very foot at the left; tall weeds along the foot, taller than a sitting cat’s ears; dark earth and short grass in front; stars and the moon; moonlit and silver, never frightening'],
  // chapter 9: GroveClan's woods, over the little bridge, always by day: green and gold, never dark
  grove: ['GroveClan’s woods, over the little bridge from the river path', 'a little old footbridge with low stone sides over a narrow channel of clear, bright water; very old, very tall trees, wide trunks and roots like arms, ferns, dappled green-gold light on soft ground; nothing frightening, never dark'],
  // chapter 10: the otters' Moon Ferry upriver, and Gathering Island under the full moon (never dark, either of them)
  ferry: ['the otters’ Moon Ferry, a line of log rafts on the moonlit river', 'logs lashed with reeds, the front raft (the ferry itself) biggest and nearest, more rafts tied behind it in a line; the river silver-blue under the full moon, bright and clear, never black, moonlight on every ripple; the far banks dark green but lit, the glass towers far off downriver; the raft never tips, nothing in the water is dark under a cat, and every otter in it is cast, never drawn by the set'],
  island: ['Gathering Island, a round island in the river', 'one great tree in the middle, very old and wide-crowned, never named, its huge roots running out across a clearing of short moonlit grass; the three leaders sit on three big roots, never in the branches; the crowd of every Clan sits round the clearing; the shore pebbles and soft mud; everything silver under the full moon, nothing frightening']
};
// the art's time of day for each set when fx names none, and how a set re-reads one (camp and
// hollow draw sunset as the last golden light); the river and the sky are always night
const SET_TOD = { room: 'sunset', tower: 'sunset', garden: 'sunset', camp: 'golden', hollow: 'golden', den: 'night', sky: 'night', river: 'night',
  title: 'sunset', pile: 'morning', bridge: 'day', field: 'day', crossing: 'day', riverbank: 'day', roof: 'golden', openriver: 'day', marsh: 'day', tracks: 'night', grove: 'day',
  // chapter 10: the Moon Ferry is drawn at dusk (the boarding) and by night; the island is always night, under the full moon
  ferry: 'night', island: 'night' };
const TOD_MAP = { camp: { sunset: 'golden' }, hollow: { sunset: 'golden' }, pile: { sunset: 'golden' }, roof: { sunset: 'golden' } };
const TOD_FIXED = { sky: 'night', river: 'night', tracks: 'night', island: 'night' };
const TOD_WORDS = { morning: 'in the morning', day: 'by day', sunset: 'at sunset', dusk: 'at dusk', night: 'at night', golden: 'in the last golden light' };
// a set's own words for a time of day (the roof's gold is the afternoon's)
// (chapter 9: the roof by morning is first light, when the dew lies on its puddle; GroveClan's woods by day are the bright afternoon)
const SET_TOD_WORDS = { roof: { golden: 'in the gold of the afternoon', morning: 'at first light' }, marsh: { day: 'in the afternoon light' }, grove: { day: 'in the bright afternoon' },
  // (the open river has two lights: the day, and the late gold of the way home)
  openriver: { sunset: 'in the late gold of the way home', dusk: 'in the late gold of the way home', night: 'in the late gold of the way home' },
  // (chapter 8: the Barking Field at night, drawn by no earlier chapter)
  field: { night: 'at night, silver in the moonlight' },
  // (chapter 10: the Moon Ferry's boarding at dusk and its night, Gathering Island's night, the glass tower by night: drawn by no earlier chapter)
  ferry: { dusk: 'at dusk, rose and lilac light on the water, the moon just up', night: 'at night, by the light of the full moon' },
  island: { night: 'at night under the full moon, high and bright silver, never dark' },
  tower: { night: 'at night, the glass dark blue against a starry sky, many windows lit warm gold, the balcony nineteen floors up lit by its window, the red light on the tallest tower beside' } };
function todOf(sc) {
  const fx = sc.fx || [];
  let t = ['night', 'dusk', 'sunset', 'morning', 'day'].find(x => fx.includes(x)) || SET_TOD[sc.set] || null;
  if (TOD_MAP[sc.set] && TOD_MAP[sc.set][t]) t = TOD_MAP[sc.set][t];
  if (TOD_FIXED[sc.set]) t = TOD_FIXED[sc.set];
  return t;
}
// chapter 6: a set's second composition, seen only through its own cameras, in words of its own
const WALL_END = ['the old stone wall’s far end above the river, where its stones stop and tall reeds begin: the border with ReedClan', 'the river behind and below'];
const DREAM = ['the dream: the Sky River', 'a broad soft path of stars underfoot, dark blue all round, the city’s lights tiny far below'];
// chapter 7: round the back of the prey pile, a composition of its own (the camp beyond, no sky)
const PILE_REAR = ['round the back of the prey pile, under the bramble arch', 'the low roots of the arch, the dug earth heaped behind the back row, the back row seen from behind, the camp past the pile’s front; no sky'];
const PILE_HOLE = ['the tunnel’s mouth, round the back of the prey pile', 'the dug earth, the bramble roots lifted over it, the back row’s backs along the top'];
// chapter 8: the weasels' tunnel under the Barking Field, and the stash inside the biggest hole, each a composition of the bank's own
const TRACKS_TUNNEL = ['inside the weasels’ tunnel, under the Barking Field', 'dark earth walls close round, roots hanging from a low roof, a soft earth floor with faint tiny prints going both ways; dim blue-grey and readable, no light source; never frightening'];
const TRACKS_STASH = ['inside the biggest hole in the bank: the weasels’ stash', 'a low earthen chamber with roots in its roof, a shaft of moonlight from the mouth at the left; along the back, mice and voles in tidy rows (eyes shut, no blood), about a third of them with darker, muddy bellies and feet (ReedClan’s); beside them on the right a heap of tower glass: flat, clear, angular pieces with straight edges, glittering white and pale blue-green, the “scale”’s look'];
// chapter 9: the old oak and the hollow high in it (GroveClan's woods), and Thymeleaf's den, a nook of the camp of its own
const GROVE_OAK = ['the old oak in GroveClan’s woods', 'an enormous trunk furry with moss, green, gold and grey; low on its shaded north side a patch of soft silver moss; roots like arms at its foot; high in the trunk the hollow, a round opening, its inside a soft dusk-green, never black; bright afternoon light through the leaves'];
const GROVE_HOLLOW = ['inside the hollow, high in the old oak', 'a snug round nook of old wood lined with soft moss, warm green-gold light through the opening at the left; a cosy nook, never a dark hole'];
// chapter 13: the big dig at the old oak's roots, close (the `dig` composition: its cameras `dig` and `marks`)
const GROVE_DIG = ['the big dig at the old oak’s roots in GroveClan’s woods', 'the oak’s mossy foot and a root like an arm across the ground at the left, and under that root a smaller round doorway, half under fallen leaves; in the middle the big dig, a wide, shallow hole, its inside soft warm earth-brown (never black), earth thrown back in two loose heaps either side, five long scratches raking down its near side; at the right a patch of flat bare earth among the leaf litter; ferns at the back; dappled afternoon light; nothing frightening, nothing dark in the holes'];
const HERBS = ['Thymeleaf’s den, a nook of the bramble dens at the camp’s edge', 'a curtain of drying leaves across the top (bunches of leaves and stems hung upside down from the brambles), more bunches along the walls, a ledge of stones with leaves laid out to dry, a flat mixing stone on the floor, and in the top corner a small web where a tiny spider lives; green, warm light through the leaves'];
const SET_COMP = { title: { end: WALL_END, meet: WALL_END }, sky: { walk: DREAM, below: DREAM }, pile: { rear: PILE_REAR, hole: PILE_HOLE },
  grove: { oak: GROVE_OAK, hollow: GROVE_HOLLOW, dig: GROVE_DIG, marks: GROVE_DIG }, camp: { herbs: HERBS },
  bridge: { wall: ['the Old Bridge’s stone leg, under the bridge beside Sprinkle’s nook', 'a wall of big old fitted stones, its foot on the dry floor, one dark gap low in it'],
    // chapter 12: the store, in the dry den
    store: ['the dry den, the very back of the dark under the Old Bridge where Sprinkle slept', 'the old stone leg’s big fitted stones at the left, the nook’s heap of old stones at the back, the dry floor wide and flat across the lower half, the way in at the right'] },
  tracks: { crawl: TRACKS_TUNNEL, fork: TRACKS_TUNNEL, stash: TRACKS_STASH, 'stash-close': TRACKS_STASH },
  // chapter 10: the island's shore, and the sky over it
  island: { shore: ['Gathering Island’s shore', 'pebbles and soft mud at the water’s edge, the river silver behind; up the slope, the great tree’s crown and the clearing’s edge'],
    sky: ['the sky over Gathering Island', 'the full moon, the great tree’s crown, the top edge of the mist'] } };
function setWords(sc) {
  const d = (SET_COMP[sc.set] || {})[sc.cam] || SETS[sc.set], t = (SET_TOD_WORDS[sc.set] || {})[todOf(sc)] || TOD_WORDS[todOf(sc)];
  if (!d) return 'Set: ' + sc.set + '.';
  // chapter 4's pile is laid out Tallyheart's way: in rows, not in pairs
  const what = sc.set === 'pile' && sc.opts && sc.opts.rows ? d[1].replace('stacked in pairs', 'laid out in rows') : d[1];
  return cap(sc.set) + ': ' + d[0] + (t ? ', ' + t : '') + (what ? ' (' + what + ')' : '') + '.';
}
const CAMS = {
  wide: 'wide shot', cushion: 'medium on the cushion', glass: 'close on the glass', outside: 'looking out through the glass at the garden',
  up: 'looking up', balcony: 'close on the balcony railing, city behind', 'balcony-close': 'close on Waffles at the balcony railing, the railing below her chin, city behind', paws: 'extreme close-up of paws on grass',
  step: 'the patio step and open door, at cat height', fence: 'the row of sparrows on the fence, a cat below', lamp: 'the top of the lamp post',
  meet: 'two cats, medium', hedge: 'the gap in the hedge', 'hedge-close': 'close at the gap in the hedge, at cat height', reveal: 'wide establishing shot', crowd: 'the cats, staring',
  fountain: 'low angle up at the fountain top', 'fountain-close': 'close on the fountain top, head and shoulders', entrance: 'high angle down at the newcomer', ferns: 'in the ferns', purr: 'wide, the whole camp',
  lesson: 'two cats, medium, over the sand', sand: 'close on the sand', tree: 'close on the trunk', inside: 'inside',
  nest: 'close on one nest', doorway: 'from inside, looking out at the entrance', cats: 'from behind two cats looking up',
  crash: 'wide: lightning and a huge splash plume far off'
};
// camera names that mean something different in a particular set
const SET_CAMS = {
  den: { outside: 'outside the den, the rosebush from the front', inside: 'inside the den',
    // chapter 9: the case laid out on the den floor
    case: 'close, from a little above, on the den floor in front of her nest at night, the moonlight coming from the doorway out of frame; her nest at the back with its moss rolled back',
    // chapter 10: the chapter's last panel
    stone: 'extreme close on the moss at her nest’s edge in the moonlight from the doorway: the mist stone big in the middle, the corner of a curl of bark, her glass’s leaf, the tip of her sleeping tail' },
  // chapter 9: Thymeleaf's den
  camp: { herbs: 'from just inside the den’s mouth, at cat height: the drying leaves at the left, the mixing stone on the floor, the little web high in the top corner' },
  tower: { up: 'looking up the tower, from the ground-floor window to a balcony nineteen floors up' },
  sky: { up: 'looking up, mostly sky',
    // chapter 6: the dream
    walk: 'on the Sky River: our cat walking on the stars, the starry cat sitting further along',
    below: 'looking down past the Sky River’s edge: the glass towers far below, the tallest with its red light, and one balcony nineteen floors up with a wind chime catching the starlight; nobody on it' },
  // chapter 6: the wall's far end, where ReedClan's border begins
  title: { end: 'wide: the end of the wall at the left, where its stones stop, the tall reeds at the right',
    meet: 'at cat height: three cats each side, face to face across the line where the stones stop' },
  pile: { wide: 'wide: the pile left of centre, Clan cats crowding round, the fountain’s edge at right', close: 'close: the pile fills the panel', low: 'medium two-shot beside the pile',
    // chapter 4: the pile in rows of ten
    rows: 'from the front: the rows running back under the brambles', gap: 'close on the back row: its gap, and the earth behind it',
    scale: 'close on the “scale” where it leans in the gap', through: 'through the “scale”: the camp, wavy and a little green',
    mirror: 'into the “scale”: her own small face looking back',
    // chapter 5
    'gap-close': 'very close on the dug earth behind the gap',
    // chapter 7: round the back, and the tunnel's mouth
    rear: 'round the back, at cat height, from behind the back row: the low roots of the bramble arch nearest, the dug earth heaped under them, then the back row seen from behind, and past the pile’s front the camp',
    hole: 'close on the tunnel’s mouth from behind, at cat height: a round dark hole in the dug earth under the lifted roots, going down and in under the pile, its far end dark; much too small for a dragon, about as wide as a small cat’s shoulders' },
  bridge: { bank: 'wide from the riverbank, the dark space under the near end at left', mouth: 'close on the dark from outside in the sun, a rock at the shadow’s edge',
    under: 'inside the dark, her view: mud with deep drag marks running into the dark, dry ground further back, drips', back: 'the very back of the dark',
    paws: 'extreme close-up of forepaws piled together',
    // chapter 6: Coil's wall, a picture of its own
    wall: 'at cat height, close on the stone leg across the middle distance: its dark gap low in it, about a quarter to a third of the way across, the dry floor in front',
    // chapter 7: her paw over Sprinkle's print
    print: 'at cat height, close on the mud: one of Sprinkle’s big prints in front (five long claw marks, as big as a heron’s foot), the drag marks’ edge at one side',
    // chapter 12: the store on the dry den's floor
    store: 'at cat height in the dry den: the floor wide and flat in front, low in the picture, the way in at the right (long gold shafts reaching in at sunset, a soft rose light at dusk)' },
  field: { wide: 'wide shot of the field and its fence', fence: 'close on the wire, a nose squashed through, cats on the path', dogs: 'the dogs bouncing at the fence, seen from the path',
    // chapter 4: the border, at the fence's far corner
    border: 'wide, both sides of the fence’s last post: the path in front, the long golden grass beyond', 'border-two': 'at cat height: Tallyheart’s shoulder between the fox and our cat',
    'border-fox': 'the fox chest-up, in three-quarter view, a corner of Tallyheart in the near edge; never full face' },
  crossing: { wide: 'wide shot of the point, the river and the raft', low: 'looking up from the rocks: an airplane’s belly and its row of round windows, enormous and very low',
    rocks: 'medium on the rocks', raft: 'close on the raft',
    // chapter 5
    board: 'close on the edge of the rocks and the raft’s first log, from her own eyes: her four paws' },
  riverbank: { path: 'wide along the water', water: 'close at the water’s edge', roof: 'looking up the tallest tower to its roof, the red light, sky', slide: 'the muddy bank down to the water' },
  roof: { wide: 'wide: the pole in the middle of the roof, the roof door at one side', pole: 'close on the foot of the pole', two: 'two at the same height, by the pole',
    over: 'from beside the pole, out over the top of the low wall to the view beyond: the camp, the river, the track', sky: 'looking up from the foot of the pole: sky, an airplane well above the roof',
    paw: 'close on one small forepaw held up, five claws out, at our cat’s nose height' },
  // chapter 5
  openriver: { wide: 'wide, the wonder screen: the raft small on the shining river, the towers and their reflections, the white needle far off',
    raft: 'at cat height on the logs, shoulder to shoulder; the rocks behind, with the otters on them', light: 'far down the river: one bright light low in the sky, growing; the raft in the near corner',
    log: 'close, from her own eyes: her two forepaws on a log, Riffle’s webbed forepaw planted on the same log beside them, not touching; the flat water, the rocks behind with a raised paw on the tall one, and all the sky above',
    sky: 'straight up from the raft: the airplane’s belly and its row of little round windows', rocks: 'from the raft, looking back at the rocks: the otters slapping their tails on the water',
    edge: 'close on the raft’s edge and the gap between two logs', beside: 'the water beside the raft', under: 'the raft from underneath: four logs in a row, ten little bump stars on each, sunny green water all round' },
  marsh: { wide: 'wide: the raft at the left edge, the heron in the shallows, the reeds behind her', far: 'far across the water: a log, and three cats on it in a row, small, no faces to read',
    heron: 'the heron tall in the panel; our cat and Riffle low in the corner, on the logs', mud: 'close on the mud beside the raft, from the raft: the logs across the top, the mud below them with one great heron print',
    pole: 'from the top of Riffle’s pole, looking down and away: the mud, and two shiny lines far off', reeds: 'the stand of reeds', wisp: 'close among the reeds', draw: 'close on the mud at the reeds’ foot' },
  // chapter 8: every camera of the bank in words of its own (the global words for `wide` and the rest are other sets')
  tracks: { wide: 'wide: the whole bank from the tall weeds at its foot to the two rails along its top, the tunnel’s end low at the left, the biggest hole low at the right, the sky above',
    hide: 'at cat height in the tall weeds at the bank’s foot, looking up the bank: the weeds’ tops across the bottom fifth of the panel, the bank rising beyond with its holes, the rails at the top against the moonlit sky',
    holes: 'close on the bank’s face at weasel height: the little hole at the left, a second small hole just beside it and a little higher, the biggest hole at the right, its mouth about as wide as a small cat’s shoulders (a little bigger than the pile’s tunnel); faint tiny prints round every hole; tall weeds at the left edge',
    brag: 'low angle up the bank from beside the holes: the rails at the top against the moon and stars, the slope falling away to the bottom corners; nobody of the Clan in this shot',
    stash: 'inside the chamber, at cat height: the mouth and its shaft of moonlight at the left, the tidy rows of prey along the back, the heap of glass on the right',
    'stash-close': 'close on the heap of glass in the stash: smooth, clear, flat pieces, the moonlight shining through them, one big piece in front',
    crawl: 'inside the tunnel, at cat height: the earth walls close round a crawling cat, just wide enough; the roof low, just clearing a sitting cat’s ears at the front, where roots hang down, and lower behind',
    fork: 'inside the tunnel where it splits in two: two dark ways, left and right, a root between them' },
  // chapter 10: every camera of the Moon Ferry and of Gathering Island in words of its own (the global `wide`, `back`,
  // `low` and the rest are other sets'); the den's close-up on the mist stone
  ferry: { shore: 'the Crossing’s edge at dusk: the flat stones and pebbles at the left, the line of rafts tied along the bank, the front raft’s near end at the stones’ edge, the rafts behind it going off upriver; the full moon rising',
    deck: 'aboard the front raft, from its back end looking forward, upriver: the logs running away from us, the Clan seated along both sides, the front end and the poler against the moonlit river, the full moon ahead and high',
    back: 'close on the very back of the front raft: the heap of reeds (the luggage) taking the right half, its reeds loose and green-gold in the moonlight, a cat’s height and more; the river behind',
    low: 'at cat height on the front raft’s logs, close: the water lapping at the logs’ tops in silver rings, and between two logs a gap of silver water',
    under: 'looking straight down into the gap between two logs: the silver water filling the panel, the logs’ wet tops at the edges, the moon’s reflection, a cat’s face reflected at the top edge; never dark',
    river: 'wide: the Moon Ferry on the river under the full moon, the front raft with its poler and its small seated cats, the line of rafts behind' },
  island: { shore: 'at the water’s edge, looking up the slope: the shore in front, the great tree’s crown and the clearing’s edge above it',
    wide: 'wide: the clearing under the great tree, every Clan: the trunk at the middle back, its three big roots running out, a leader on each; the crowd in a wide ring (CrystalClan at the left, ReedClan’s marsh coats at the right, GroveClan’s dappled coats at the back), the river at the far right edge',
    roots: 'closer on the great tree’s three roots: the leaders sitting up on them, the trunk’s bark behind, moonlight through the crown',
    case: 'at cat height in the clearing: our cat a little left of centre in the moonlight, the crowd’s front behind, and across the grass at the right the clearing’s river edge',
    fox: 'close on the fox at the clearing’s edge, the river behind him; in the water at the right, the way off the island',
    mist: 'the clearing’s edge by the great tree, the mist rolling in off the river: the trunk at the left, the mist a soft silver bank filling the right half, the moon glowing through it',
    sky: 'looking up past the great tree’s crown into the sky, for the flight and the leaving',
    paws: 'close on our cat’s forepaws held out on the moonlit grass, with room above for Sprinkle’s head and claws' },
  // chapter 9: every camera of GroveClan's woods in words of its own (the global `wide` and `meet` are other sets')
  grove: { bridge: 'the approach: the river path’s near bank at the left, the little old footbridge (low stone sides, a worn flat top) over the narrow channel of clear, bright water, and on its far side the very old trees of the woods',
    wide: 'wide, over the bridge: the bridge’s end small at the left, the woods rising across the panel, huge trunks, green-gold light, ferns; the visitors small under the trees',
    meet: 'at cat height under the trees: the elder at the right, the visitors at the left',
    oak: 'the old oak from its foot: the mossy trunk filling the panel, roots like arms at the bottom, the silver moss low on its shaded side, the round hollow high up',
    hollow: 'inside the hollow, close: the mossy nook, the round opening at the left with the green-gold light coming in',
    // chapter 13: the dig close, and the flat earth beside it close
    dig: 'the dig close, at cat height: the oak’s foot and the smaller doorway at the left, the big dig in the middle, the flat bare earth at the right',
    marks: 'close on the flat bare earth beside the dig: the dig’s near rim with two of its long curved scratches at the panel’s left edge, the rest the flat earth; no face in it (its balloons come from off the panel)' }
};
const WHO = {
  player: 'you (the reader’s cat)', tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles',
  tallone: 'the Tall One (legs, slippers and hands only)', grizzled: 'the grizzled old tom', snorer: 'the snoring apprentice',
  mutterer: 'the muttering apprentice', snorter: 'the snorting apprentice', clancat: 'a Clan cat', sparrow: 'a sparrow', moth: 'a moth',
  riffle: 'Riffle, the otter pup', otter: 'an otter', dog: 'a dog',
  // chapter 3
  sprinkle: 'Sprinkle, a Mistscale dragonet (about a heron’s size, mist-grey, her right wing drooping)', murmurchime: 'Murmurchime, the tortoiseshell warrior',
  // chapter 4
  reynard: 'Reynard, the fox (lean and red-orange, four black socks, an enormous white-tipped tail, a closed-mouth smile that is always on; no teeth, ever)',
  squall: 'Squall, the littlest dragonet (no bigger than a cat, slate grey with yellow flecks like sparks, stubby wings)',
  // chapter 5
  patience: 'Patience, a great blue heron (taller than Tallyheart, blue-grey, a long neck held in an S, a white face with a black stripe and a thin plume, a long yellow bill, one round yellow eye; her head never turns)',
  puddle: 'Puddle, a Mistscale dragonet (about Sprinkle’s size, blue-grey, with four feet a size and a half too big, round friendly eyes)',
  wisp: 'Wisp, a Mistscale dragonet (slighter than Sprinkle and longer in the neck, so pale the reeds show through her, pale gold eyes; she stands on one leg; she never speaks)',
  // chapter 6
  coil: 'Coil, a northern water snake (brown with darker cross-bands, a cream belly, a rounded head no bigger than a stone of the wall, two round eyes shiny as wet pebbles that never shut; his mouth always shut: no tongue, no fangs; his body runs sideways along the wall’s foot, away from the cats)',
  sloshbank: 'Sloshbank, the ReedClan tom (big, heavy and stern, solid brown with darker legs, bigger than Tallyheart; his belly fur clumped wet, always dripping, big muddy paws)',
  reedclan: 'a ReedClan cat (a sleek, wet-looking marsh coat, mud to the elbows)',
  sleet: 'Sleet, the eldest dragonet (a Mistscale about Sprinkle’s size, silver-white with a blue-grey shade in the ridges, a paler belly, round bold eyes under bossy brows, two soft horn nubs, five frost-white claws a forepaw; never toothy)',
  // chapter 8
  hail: 'Hail, a Mistscale dragonet (little: about Squall’s size, no taller sitting than you; white with round grey speckles all over, like hailstones’ shadows, pale grey ridges along her back, pale grey wings folded small, a pale belly, two soft horn nubs, big round dark eyes with a big shine, eager brows, a bouncy curl in her tail; never toothy, never fierce)',
  snip: 'Snip, the weasel sister (long and thin, short legs, small round ears, a pointed nose, black bead eyes with a shine, thin fur like the tuft at the Crossing; the smaller of the two, light golden-brown with a white chin and bib, a pale tail tip; about half your size; funny and greedy, never cruel: no teeth ever shown)',
  snatch: 'Snatch, the weasel brother (long and thin, short legs, small round ears, a pointed nose, black bead eyes with a shine, thin fur like the tuft at the Crossing; darker chestnut with a cream belly, a black tail tip and a round full tummy; about half your size; funny and greedy, never cruel: no teeth ever shown)',
  // chapter 9
  thymeleaf: 'Thymeleaf, CrystalClan’s medicine cat (an old, calm tom: soft, long oatmeal-grey fur, a white chest and white paws, a little thin at the shoulders, a greyer muzzle, long white whiskers, bushy pale brows, green-gold eyes with a twinkle, and a sprig of mint tucked behind one ear)',
  mizzle: 'Mizzle, the last dragonet (a Mistscale, little: sitting no taller than you; pearly green, pale green scales with a soft pearl sheen, a pale green-white belly, soft rounded ridges, small folded wings, two soft horn nubs, a short round snout, big sleepy eyes with heavy lids; sweet, never toothy)',
  groveclan: 'a GroveClan cat (a woodland coat, dappled like sun through leaves)',
  spider: 'a tiny garden spider (a small round smooth body, no hair, no fangs, two dot eyes and a little smile, four legs on each side, soft brown with a pale pattern on her back; friendly, never creepy, never crawling toward anyone)',
  // chapter 10
  mistscale: 'a grown Mistscale (huge, gentle and misty, never frightening: a great head and neck leaning out of the mist, the body never drawn; mist-grey scales like Sprinkle’s but larger and softer, ridges like rounded hills, big kind eyes, the mouth shut, two soft horns; no teeth, no claws shown)',
  // chapter 12
  chispapaw: 'Chispapaw, a small cream pillow cat with a dark brown face, ears, paws and tail, big ears, blue eyes and a collar with a tiny bell',
  // chapter 13
  groundhog: 'the groundhog (round and brown, plump and soft: a grizzled warm brown coat, darker on the back, a paler gingery belly, a short furry tail, small round ears close to the head, a blunt dark nose with whiskers, small dark sleepy eyes under heavy lids, short legs and little dark paws; something BIG: sitting up, about your sitting height and twice as round; grumpy in the brows and the mouth, never a tooth, never frightening; nothing like a badger: no stripes, no black-and-white face)'
};
// otters and dogs by variant, as the game names them
const VARIANT_WHO = {
  otter: { 1: 'the old ferry otter', 2: 'an otter', 3: 'another otter' },
  dog: { 1: 'the huge shaggy dog', 2: 'the spotty dog', 3: 'the tiny dog (mostly bark)' },
  // chapter 6: ReedClan by coat, none of them hers or a Clan cat's
  reedclan: { 1: 'the ReedClan she-cat (sleek, dark grey-brown, a pale belly, calm amber eyes; mud to the elbows)', 2: 'the young ReedClan tom (lanky and sandy, big ears, eager; mud to the elbows)',
    3: 'a ReedClan cat (smoky dark grey, mud to the elbows)', 4: 'a ReedClan cat (fawn, mud to the elbows)',
    // chapter 10: ReedClan's leader (a label only)
    5: 'ReedClan’s leader (big, broad and grand: a marsh coat of deep brown with reed-dark stripes, a pale grey chest, a notch in one ear, wise amber eyes)' },
  // chapter 9: GroveClan's two, by coat, unnamed (labels only)
  groveclan: { 1: 'the GroveClan elder (a she-cat: a dappled grey-brown coat, the dapples like sun through leaves, a white muzzle, grey hairs at her ears; upright and sharp-eyed, hazel eyes, kind)',
    2: 'the GroveClan apprentice (small, apprentice-sized: dappled fawn and cream, big eyes, a scrap of moss on one ear; shy)',
    // chapter 10: GroveClan's leader, and two coats for the island's crowd (anonymous)
    3: 'GroveClan’s leader (tall and lean: a dappled woodland coat, grey-brown dapples like the elder’s but darker, a white chest and white forepaws, long whiskers, calm green eyes)',
    4: 'a GroveClan cat (light grey-brown woodland dapples)', 5: 'a GroveClan cat (ginger-brown woodland dapples)' },
  // chapter 10: the grown Mistscales, labels only ("Mama" is a title)
  mistscale: { 1: 'Mama, Sprinkle’s mother, a grown Mistscale (huge, gentle and misty, never frightening: a great head and neck leaning out of the mist, the rest of her in the mist; grey as a rain cloud, Sprinkle’s colour grown; ridges like rounded hills, big kind eyes, the mouth shut, two soft horns; no teeth, no claws shown)',
    2: 'the eldest Mistscale (as big as Mama, gentle, never frightening: a great head and neck out of the mist, grey and weathered, a paler muzzle, a few lichen-pale spots, heavy-lidded old eyes; never silver-white; no teeth, no claws shown)' }
};
const SPEAKER = {
  player: 'You', tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles', tallone: 'The Tall One',
  grizzled: 'Grizzled old tom', snorer: 'Snoring apprentice', mutterer: 'Muttering apprentice', snorter: 'Snorting apprentice',
  clancat: 'A Clan cat', sparrow: 'Sparrow', moth: 'Moth', riffle: 'Riffle', otter: 'An otter', dog: 'A dog',
  sprinkle: 'Sprinkle', murmurchime: 'Murmurchime', reynard: 'Reynard', squall: 'Squall',
  patience: 'Patience', puddle: 'Puddle', wisp: 'Wisp',
  coil: 'Coil', sloshbank: 'Sloshbank', reedclan: 'A ReedClan cat', sleet: 'Sleet',
  hail: 'Hail', snip: 'Snip', snatch: 'Snatch',
  thymeleaf: 'Thymeleaf', mizzle: 'Mizzle', groveclan: 'A GroveClan cat', spider: 'The spider',
  mistscale: 'A Mistscale',
  chispapaw: 'Chispapaw',
  groundhog: 'The groundhog'
};
const VARIANT_SPEAKER = {
  otter: { 1: 'The old ferry otter', 2: 'An otter', 3: 'An otter' },
  dog: { 1: 'The shaggy dog', 2: 'The spotty dog', 3: 'The tiny dog' },
  reedclan: { 1: 'ReedClan she-cat', 2: 'Young ReedClan tom', 3: 'A ReedClan cat', 4: 'A ReedClan cat', 5: 'ReedClan’s leader' },
  groveclan: { 1: 'A GroveClan elder', 2: 'A GroveClan apprentice', 3: 'GroveClan’s leader', 4: 'A GroveClan cat', 5: 'A GroveClan cat' },
  mistscale: { 1: 'Mama', 2: 'The eldest Mistscale' }
};
const POSES = {
  sit: 'sitting', stand: 'standing', walk: 'walking', crouch: 'crouching', curl: 'curled up', loaf: 'tucked into a loaf',
  lookup: 'looking up', flat: 'pressed flat', lie: 'lying down', fall: 'tumbling over laughing', stretch: 'stretching up',
  peer: 'peering', perch: 'perched', fluffed: 'fluffed up', fly: 'flying', water: 'watering the plants', 'set-dish': 'setting down a dish',
  // otters and dogs (chapter 2)
  scramble: 'scrambling', swim: 'swimming, head and back above the water', float: 'floating on his back, tummy up', juggle: 'juggling pebbles',
  slide: 'belly-sliding', hug: 'hugging his own tail', sun: 'lying on his back in the sun', jump: 'jumping up, paws on the fence',
  bounce: 'bouncing', howl: 'howling',
  // chapter 3: cats, otters, and Sprinkle
  pawup: 'one forepaw raised', tummy: 'on her back, paws in the air', dive: 'diving', hush: 'a paw over his mouth',
  eyes: 'only her eyes, shining in the dark', unfold: 'unfolding: a long neck, a ridged back, a tail that goes on and on',
  hide: 'hiding her face under her tail', sniff: 'sniffing', wings: 'wings open, the right one drooping, half open', gulp: 'head back, gulping',
  burp: 'burping a little cloud of mist', pawsup: 'both forepaws up, claws spread', draw: 'drawing in the mud with one claw',
  touch: 'a forepaw laid gently forward', peek: 'peeking out',
  // chapter 4: the cats sitting up, Sprinkle, Reynard and Squall
  situp: 'sitting up on the haunches, both forepaws raised, claws out',
  check: 'looking herself over, nose to tail', tailout: 'holding out her tail', tailup: 'her tail lifting from her face',
  comb: 'combing his enormous tail with his claws', chest: 'a paw on his chest', think: 'eyes up, thinking', lean: 'leaning in to whisper', flap: 'both forepaws flapping',
  slip: 'the smile gone flat for one heartbeat, eyes fully open, ears back', dash: 'dashing off, tail last',
  roar: 'head back, roaring, his mouth a round O', hiccup: 'bounced by a hiccup, eyes crossed, one ring of mist', halt: 'one claw out', tall: 'standing as tall as he can',
  point: 'pointing a claw', snap: 'snapping at a moth',
  // chapter 5: Riffle and the otters, Sprinkle, the heron, Puddle and Wisp
  whistle: 'whistling, eyes fixed on the sky', groan: 'groaning, eyes rolled up', flip: 'turning a somersault', hop: 'hopping on the spot', slap: 'slapping his tail on the water',
  lookdown: 'looking down at her own enormous feet',
  eye: 'her near eye turned to the raft', shut: 'one eye shut', full: 'her neck a little rounder: full', feather: 'one grey feather lifted (for her, a grin)',
  foot: 'one big foot poking up, wiggling', head: 'his head out of the water, a small bump on it', log: 'floating very straight, eyes shut: being a log', sink: 'sinking: bubbles and the tip of a nose',
  nostrils: 'two nostrils and a string of bubbles', reed: 'standing still among the reeds, eyes shut: one more reed, but paler, and with a knee', blink: 'eyes open',
  shh: 'one claw laid across her snout', nod: 'nodding, once', flinch: 'one jerk, among reeds that do not move',
  // chapter 6: Coil's and Sleet's poses and Riffle's puff, plainly (each character's own words are below)
  stone: 'still as a stone, no face showing', long: 'stretched out long', longer: 'stretched out longer still', still: 'lying still, head raised a little',
  listen: 'chin flat on the ground, listening', hidden: 'hidden in the long grass: only the grass bent where it is', tail: 'only the tip of a tail showing',
  call: 'head up, calling', puff: 'puffed out', droop: 'head low, tail drooping',
  // chapter 8: the cats' run (the chase), Hail's tilt, the weasels' look-out and skid, Reynard's trot, plainly (each character's own words are below)
  run: 'running flat out, body low and long, forelegs reaching, hind legs pushing, tail streaming behind', tilt: 'head tilted, full of questions',
  up: 'sitting up tall on the hind legs, forepaws tucked', skid: 'skidding to a stop', trot: 'trotting along',
  // chapter 9: the spider's, Mizzle's and Sprinkle's new poses, plainly (each character's own words are below)
  spin: 'spinning a thread', wave: 'one leg raised, waving', yawn: 'yawning', wake: 'wide awake',
  glide: 'gliding, wings spread wide', splash: 'splashing in the water',
  // chapter 10: the grown Mistscales', Reynard's bow, the weasels' hidden paws, plainly (each character's own words are below)
  nuzzle: 'nuzzling, the head lowered', lift: 'the head lifted high, calling', bow: 'bowing low', hidepaws: 'standing up, the forepaws hidden behind the back',
  // chapter 13: the groundhog's, plainly (its own words are below)
  doze: 'dozing, curled up', sleep: 'asleep, curled up'
};
const OTTER_STAND = 'standing up on his hind legs';
const SPRINKLE_POSE = { curl: 'curled up, her tail wrapped round whoever is beside her', flat: 'squeezed flat',
  // chapter 9: Sprinkle practising, on the sunny bank (her hurt right wing a little lower than the good one; never a fall that hurts)
  hop: 'a hop off the sand, all four paws up, wings half open', flap: 'both wings up, flapping hard, her hurt right wing a little lower and stiffer than the good one',
  glide: 'gliding low, wings spread wide, paws tucked', fly: 'up in the air, both wings up mid-beat, paws off the ground, joyful',
  splash: 'sitting up in the bright shallows, water to her chest, drops flying, laughing' };
// a pose that means something of its own for the fox or the littlest dragonet
const REYNARD_POSE = { sit: 'sitting very neatly',
  // chapter 8: along the tracks
  trot: 'trotting along on all fours, tail high, his smile on',
  // chapter 10: on Gathering Island, and off it (never toward her or Sprinkle, never a tooth)
  bow: 'a low sweeping bow, one forepaw forward, his tail flourished up behind: charming, vain',
  swim: 'swimming away: only his head and the line of his back above the water, ears flat, his tail floating behind (no splash at anyone)' };
const SQUALL_POSE = { hug: 'sitting at the foot of the pole, forelegs and tail wrapped round it', pawup: 'one forepaw raised, five claws out',
  // chapter 9: out of sight behind the red light's pole (never his face)
  hidden: 'out of sight behind the red light’s pole: nothing of him but the tip of his slate tail with its yellow flecks, curled round the pole’s foot, and a small ring of hiccup mist rising beside it' };
// chapter 5: poses that mean something of their own for an otter, the heron or the two dragonets found here
const OTTER_POSE = { point: 'pointing straight down', fall: 'falling over backwards',
  // chapter 6: Riffle holding his breath under the bridge
  puff: 'cheeks puffed round, holding his breath, eyes wide' };
const PATIENCE_POSE = { stand: 'standing on one leg, neck folded', point: 'her bill pointing down at the mud', gulp: 'neck up, a fish going down as a small bump' };
const PUDDLE_POSE = { pawup: 'one forepaw raised and his chin dipping, his eyes and his grin still above the water', sit: 'sitting, his big feet out in front of him',
  // chapter 10: under the Moon Ferry (nothing dark under him)
  eyes: 'only his two big round eyes and the top of his head above the silver water, a ring of ripples round them' };
const WISP_POSE = { blink: 'standing on one leg among the reeds, her eyes open', draw: 'one pale claw down in the mud, drawing', gulp: 'a small bump going down her long neck', pawup: 'one forepaw raised, five claws out, pale as frost' };
// chapter 6: every pose of Coil's and of Sleet's in his own words (the global `head` is Puddle's,
// `slide` Riffle's, `flat` a cat's, `puff` Riffle's cheeks); Coil's eyes are never shut, and his body
// always runs sideways along the wall's foot, away from the cats
const COIL_POSE = { stone: 'only his head, turned into the gap so its top reads as one more rounded stone of the wall; no eyes showing',
  head: 'his head out of the gap, tilted politely: two round eyes, shiny as wet pebbles, mouth shut', long: 'his head out and a first loop of body along the wall’s foot',
  longer: 'loops and loops of him along the wall’s foot, in and out of the stones’ shadow', still: 'lying along the wall, head raised a little: talking',
  listen: 'chin flat on the floor: feeling footsteps', think: 'head tilted up, eyes open, thinking', slide: 'sliding back into the gap, the tail end last' };
const SLEET_POSE = { hidden: 'in the long grass: nothing of him showing but the grass bent where he is', tail: 'only the tip of a scaly silver-white tail, flicking up out of the grass',
  flat: 'flat on his belly in the grass, chin down: spying', point: 'one claw pointing', call: 'head up, his mouth a round O: the roll call',
  puff: 'his chest puffed out, a grass seed falling off it', droop: 'head low, his tail drooping', sit: 'sitting up, all of him',
  pawup: 'one forepaw raised, five frost-white claws out' };
// (his moods are drawn his way: a snake's sniff is an offended lift of the chin)
const COIL_MOOD = { sniff: 'an offended lift of the chin' };
// chapter 8: Hail's poses, the weasels' (both drawn alike), the dogs' new one and Reynard's, in their own words;
// a weasel's moods are drawn the weasels' way (a shout is a squeak, a laugh cheeky, stern a pout)
const HAIL_POSE = { sit: 'sitting up, bright-eyed', stand: 'standing on all fours, side-on', bounce: 'mid-hop, all four paws off the ground, wings half out, tail up',
  run: 'running flat out round the field, wings flapping a little', peek: 'head and shoulders up, the rest of her below', pawup: 'one forepaw raised, curious', tilt: 'head tilted, full of questions' };
const WEASEL_POSE = { stand: 'on all fours, the long body low, side-on', up: 'sitting up tall on the hind legs, forepaws tucked: a weasel’s look-out', run: 'bounding, the back arched',
  skid: 'skidding to a stop: front paws braced, the back end swinging round', peek: 'head and shoulders out of a hole, the hole’s lip over the rest', point: 'one forepaw out, pointing', curl: 'curled up small, nose to tail',
  // chapter 10: caught out, and off the island
  hidepaws: 'standing up, the tiny forepaws hidden behind the back, eyes wide and innocent', swim: 'swimming, the head up, paddling after the fox' };
const WEASEL_MOOD = { shout: 'squeaking', laugh: 'cheeky', stern: 'pouting' };
const DOG_POSE = { lie: 'lying down, head on forepaws' };
// chapter 9: Mizzle's poses (sweet and sleepy, never toothy) and the spider's (tiny, friendly, never crawling toward anyone)
const MIZZLE_POSE = { curl: 'curled up on the moss, her tail round her nose', yawn: 'head up, one eye open, a big round yawn (no teeth)', sit: 'sitting up, drowsy',
  wake: 'sitting up straight, both eyes wide open, frills and ears up: wide awake for once', pawup: 'one forepaw raised, a claw pointing' };
const SPIDER_POSE = { spin: 'in her corner on a few threads, spinning', wave: 'one front leg raised, waving' };
// chapter 10: the grown Mistscales, a great head and neck out of the mist (her moods are drawn her way: kind is her resting face)
const MISTSCALE_POSE = { lean: 'her great face leaning out of the mist', nuzzle: 'her great head lowered, nose down to a small dragonet’s height, eyes half shut',
  lift: 'her great head lifted high, the mouth a little open in a call (no teeth)', bow: 'the head bowed all the way down to the grass, eyes closed, the neck a long curve' };
// chapter 13: the groundhog's poses (grumpy, never a tooth; its face tucked away while it dozes)
const GROUNDHOG_POSE = { doze: 'curled up round in its doorway, its back and bottom toward us, the face tucked down out of sight (only the back of its head and its small round ears over its shoulder), its short furry tail and the soles of its hind feet at the bottom: its bottom sticking out in the cold',
  wake: 'still curled in its doorway, its head up and turned to us over its shoulder, both eyes open: its whole grumpy face',
  sit: 'sitting up on its haunches, its forepaws folded on its belly, talking', yawn: 'sitting up, an enormous round yawn, eyes squeezed shut (no teeth)',
  sleep: 'curled round, side on, its face showing, eyes shut, a little smile: asleep' };
const MOODS = {
  neutral: '', happy: 'happy', dreamy: 'dreamy', wonder: 'full of wonder', worried: 'worried', scared: 'scared', sleepy: 'sleepy',
  laugh: 'laughing', stern: 'stern', kind: 'kind', proud: 'proud', sniff: 'sniffing', shout: 'shouting', solemn: 'solemn',
  sad: 'sad (homesick, a wobbly mouth)', shy: 'shy (eyes down, a small smile)'
};
const FX = {
  sunset: 'sunset light', dusk: 'dusk', night: 'night', stars: 'stars', skyriver: 'the Sky River', rain: 'rain',
  lightning: 'lightning', glow: 'a glow', purr: 'purring lines', sparkle: 'sparkles', zzz: 'sleepy zzz', motion: 'motion lines',
  shake: 'the panel shakes', flash: 'a white flash', morning: 'morning light, washed clean after the storm', day: 'daylight',
  bonk: 'a pebble bonks off the first one’s head, little stars circling the bump', mist: 'a little cloud of mist'
};
const ANCH = {
  cushion: 'on the cushion', floor: 'on the floor', glass: 'at the glass', doorway: 'in the doorway', window: 'behind the ground-floor window',
  railing: 'at the balcony railing', step: 'on the patio step', lawn: 'on the lawn', 'fence-foot': 'at the foot of the fence',
  'lamp-top': 'on top of the lamp post', 'hedge-gap': 'at the gap in the hedge', entrance: 'at the camp entrance',
  'fountain-top': 'on top of the fountain', 'fountain-foot': 'at the foot of the fountain', 'crowd-left': 'in the crowd, left',
  'crowd-right': 'in the crowd, right', ferns: 'in the ferns', center: 'in the middle of camp', 'sand-left': 'on the sand, left',
  'sand-right': 'on the sand, right', sunpatch: 'in the sun patch', 'sunpatch-2': 'at the sun patch’s far left edge', 'sunpatch-3': 'at the sun patch’s right edge, by the sand',
  tree: 'by the tree', 'tree-far': 'on the far side of the old tree, apart from the rim', 'entrance-left': 'at the entrance, left',
  'entrance-right': 'at the entrance, right', nest: 'in the nest', 'sleeper-1': 'in a nest, left', 'sleeper-2': 'in a nest, right',
  'ground-left': 'on the ground, left', 'ground-right': 'on the ground, right', wall: 'on the wall', 'wall-2': 'on the wall, left',
  // (chapter 6: the front of a patrol walking right along the wall)
  'wall-3': 'on the wall, right, at the front',
  'rim-1': 'on the rim, first', 'rim-2': 'on the rim, second', 'rim-3': 'on the rim, third', 'rim-4': 'on the rim, fourth', 'rim-5': 'on the rim, fifth',
  // chapter 2's sets
  'pile-left': 'left of the pile', 'pile-right': 'right of the pile', beside: 'lying beside the pile', 'crowd-1': 'in the crowd', 'crowd-2': 'in the crowd',
  'crowd-3': 'in the crowd', 'fountain-edge': 'up on the fountain’s edge', 'bank-left': 'on the bank, left', 'bank-right': 'on the bank, right',
  reeds: 'in the squashed reeds', rock: 'up on the rock at the shadow’s edge', edge: 'at the shadow’s edge', sun: 'in the sunshine outside',
  'sun-edge': 'in the sun, just out of the shadow',
  mud: 'in the mud by the water', inside: 'inside the dark', near: 'seen from behind, looking in', 'path-left': 'on the path, left',
  'path-right': 'on the path, right', 'dog-1': 'at the fence', 'dog-2': 'at the fence', 'dog-3': 'at the fence', field: 'far off in the field',
  'rock-left': 'on the rocks, left', 'rock-right': 'on the rocks, right', 'rock-high': 'up on a high rock', shore: 'on the shore',
  pebbles: 'by a heap of pebbles', 'raft-1': 'on the raft', 'raft-2': 'on the raft', 'raft-3': 'on the raft', water: 'in the water',
  'bank-top': 'popping up over the top of the bank', slope: 'on the muddy slope', bank: 'on the bank',
  // chapter 3
  dragon: 'in Sprinkle’s spot at the very back', 'back-left': 'at the back, left', 'back-right': 'at the back, right', 'hedge-side': 'beside the hedge',
  // chapter 4
  pole: 'at the foot of the pole', door: 'by the roof door', fox: 'in the long grass just past the last post', lead: 'at the front of the Clan, on the path',
  left: 'at the leader’s left shoulder', right: 'at the leader’s right shoulder', 'back-1': 'behind them on the path', 'back-2': 'behind them on the path',
  'back-3': 'behind them on the path', 'back-4': 'behind them on the path', corner: 'small on a balcony halfway up the tower', foot: 'at the foot of the tower',
  // chapter 5
  behind: 'behind the back row, having walked round the pile', 'far-rocks': 'far off, on the Crossing’s tall rock', shallows: 'in the shallows', reed: 'among the pale reeds',
  'pole-top': 'at the top of Riffle’s pole', 'log-1': 'on the log across the water', 'log-2': 'on the log across the water', 'log-3': 'on the log across the water',
  'raft-edge': 'at the very edge of the raft, on the front lip of its near log, over the mud',
  // chapter 6: the wall's far end (CrystalClan on the stones' side, ReedClan out of the reeds; the first of each nearest the line), the dream
  'end-1': 'at the wall’s end, nearest the line where the stones stop', 'end-2': 'at the wall’s end, second from the line', 'end-3': 'at the wall’s end, furthest from the line',
  'reed-1': 'stepping out of the reeds, nearest the line', 'reed-2': 'stepping out of the reeds, second from the line', 'reed-3': 'stepping out of the reeds, furthest from the line',
  'star-1': 'on the Sky River', 'star-2': 'further along the Sky River'
};
// anchor names that mean something different in a particular set
const SET_ANCH = { bridge: { beside: 'pressed against Sprinkle’s side',
    // chapter 12: round the store on the dry den's floor (the camera `store`)
    'store-left': 'at the front left of the store', 'store-right': 'at the front right of the store',
    'store-back-1': 'behind the store, a step back', 'store-back-2': 'behind the store, two steps back', 'store-back-3': 'behind the store, three steps back',
    'way-in': 'at the right, by the way in',
    // chapter 9: the sunny bank's new spots (the sand strip and the shallows at the bridge's foot)
    run: 'on the strip of soft sand at the water’s edge, mid-right', 'run-2': 'on the sand just left of the first spot', skim: 'low over the sand’s edge by the water, paws just clear of the sand',
    air: 'up in the air above the sand, paws a little more than her own leg’s length off it', paddle: 'in the bright shallows at the sand’s edge, the water over the legs, rings and drops all round',
    'watch-1': 'on the bank at the left, watching, first', 'watch-2': 'on the bank at the left, watching, second', 'watch-3': 'on the bank at the left, watching, third', 'watch-4': 'on the bank at the left, watching, fourth',
    // chapter 6: Coil's place, in `back` and in `wall`
    gap: 'at the dark gap low in the stone wall',
    // chapter 7: in `print`, her paw over the print
    over: 'crouched over the print, her near forepaw held just over its heel pad' },
  // chapter 7: round the back (`rear`), at the tunnel's mouth (`hole`), and on top of the arch (`wide`)
  pile: { 'rear-1': 'round the back, left of the roots over the tunnel’s mouth', 'rear-2': 'round the back, right of the roots over the tunnel’s mouth',
    'guard-1': 'small, past the rows at the pile’s front: a guard settling in, looking out over the camp', 'guard-2': 'small, past the rows at the pile’s front: a second guard settling in',
    'guard-3': 'small, past the rows at the pile’s front: a third guard settling in', brink: 'crouched at the very edge of the tunnel’s mouth',
    arch: 'standing on top of the bramble arch over the pile, as big as a cat by the back row',
    // chapter 8: at the tunnel's mouth, round the back
    poke: 'crouched at the tunnel mouth’s right edge, the nose at its rim, the shoulders plainly wider than the mouth' },
  // chapter 8: the bank by the tracks, its holes, the stash and the tunnel's inside
  tracks: { 'tunnel-end': 'in the tunnel’s end hole at the bank’s foot, the hole’s lip over the back half: head and shoulders out, wriggling out',
    'foot-1': 'on the ground at the bank’s foot, right of the tunnel’s end', 'foot-2': 'on the ground at the bank’s foot, beside the first, further right',
    'hole-1': 'at the little hole in the bank, small', 'hole-2': 'at the second small hole, just beside the little one and a little higher, small',
    rails: 'up on the tracks along the top of the bank, far above the cats, small', 'weeds-1': 'in the tall weeds at the bank’s foot, left: weeds drawn over her up to the eyes (ears, eyes and the top of the head above)',
    'weeds-2': 'in the tall weeds at the bank’s foot, right: weeds drawn over her up to the eyes (ears, eyes and the top of the head above)',
    'stash-mouth': 'crouched at the biggest hole, the head at its mouth (the mouth about as wide as her shoulders)',
    watch: 'a little way off at the left among the weeds, weeds over the legs: keeping watch',
    'slope-1': 'at the foot of the slope, bottom left, looking up', 'slope-2': 'at the foot of the slope, bottom right, looking up',
    'stash-in': 'at the chamber’s left edge, in from the mouth: head, shoulders and forepaws in the chamber, the rest cut off by the mouth’s rim',
    near: 'the corner of her face and a forepaw at the panel’s left edge, drawn bigger than the panel',
    'crawl-1': 'crawling at the front, facing right, where the roof just clears a sitting cat’s ears', 'crawl-2': 'behind, at the left, partly cut off by the panel’s edge',
    'fork-1': 'at the split, facing the way she sniffs', 'fork-2': 'behind her at the split' },
  // chapter 6: Sleet's spot, nearer than the fox's, close enough to talk across the post
  field: { grass: 'low in the long grass just past the last post, close enough to talk across it',
    // chapter 8: the field at night (the way to the tracks is to the right, home to the left)
    'heap-1': 'lying close to the others inside the fence, near it, behind the wire: the first of the heap', 'heap-2': 'lying close to the others inside the fence, behind the wire: the second of the heap',
    'heap-3': 'lying close to the others inside the fence, behind the wire: the third of the heap',
    log: 'at the hollow log’s mouth far inside the fence, the log’s near rim over the lower body: head and shoulders out',
    wire: 'inside the fence, right up at the wire beside the dogs',
    'ring-1': 'running round the big circle in the field round the hollow log, inside the fence (the first of four places on it, facing along the loop)', 'ring-2': 'on the big circle round the hollow log, the second place',
    'ring-3': 'on the big circle round the hollow log, the third place', 'ring-4': 'on the big circle round the hollow log, the fourth place',
    'fence-top': 'up on the fence’s top rail, in front of the wire',
    'trail-1': 'on the path, further along toward the tracks, the nearer of two places', 'trail-2': 'on the path, further along toward the tracks, the further of two places' },
  roof: { beside: 'beside the pole',
    // chapter 9: at the rain puddle, clear of the pole's spot and of the wall
    puddle: 'crouched at the rain puddle’s edge, clear of the pole and the wall' },
  // chapter 9: GroveClan's woods (the visitors never past the bridge's end until the elder asks them in)
  grove: { 'near-1': 'on the near bank at the bridge’s foot', 'near-2': 'on the near bank at the bridge’s foot, beside the first',
    'span-1': 'on the little bridge, at its near end, stepping on', 'span-2': 'on the little bridge, further across', far: 'at the bridge’s far end, under the old trees',
    'edge-1': 'at the bridge’s end, waiting to be asked in, first', 'edge-2': 'at the bridge’s end, waiting to be asked in, second', 'edge-3': 'at the bridge’s end, waiting to be asked in, third',
    elder: 'at the right, the elder’s place', fern: 'behind the elder, half hidden by a fern: a face and ears showing',
    'meet-1': 'under the trees at the left, nearest the elder', 'meet-2': 'under the trees at the left, beside the first', 'meet-3': 'under the trees at the left, furthest from the elder',
    'root-1': 'at the old oak’s foot among the roots, first', 'root-2': 'at the old oak’s foot among the roots, second', 'root-3': 'at the old oak’s foot among the roots, third',
    trunk: 'on the oak’s trunk partway up toward the hollow, climbing', moss: 'crouched low at the soft silver moss on the oak’s shaded north side',
    nook: 'on the moss in the hollow', lip: 'at the hollow’s opening: head, shoulders and forepaws in, the rest cut off by the opening’s rim (below the forepaws)',
    // chapter 13: in front of the old oak, clear of the dig; and the dig close (the doorway, the dig, the flat earth)
    'oak-near': 'on the ground in front of the old oak’s trunk, clear of the dig and the doorway',
    'door-1': 'in front of the small doorway, crouched facing it', 'door-2': 'beside the first at the doorway, a step back, facing it',
    doorway: 'in the small doorway itself, its lower half under the drift of fallen leaves (no ground shadow)', 'dig-front': 'at the front middle, before the dig, facing it',
    'marks-1': 'at the front right by the flat earth, facing the marks', 'marks-2': 'at the front right by the flat earth, beside the first, facing the marks',
    'dig-elder': 'at the back right, facing the dig', 'dig-fern': 'at the back left, half hidden by a fern: a face and ears showing' },
  // chapter 9: Thymeleaf's den in the camp (`herbs`), and the case laid out on the den floor (`case`)
  camp: { 'herbs-1': 'among the drying leaves at the left', 'herbs-2': 'at the right of the den', 'herbs-3': 'at the right of the den, further right still', web: 'high in the den’s top corner, on the little web (a spot about the size of a cat’s forepaw)',
    // chapter 13: by the ferns, for the crouch
    'ferns-1': 'at the front left, near the ferns', 'ferns-2': 'at the front middle, toward the ferns, with room before the nose for a pounce' },
  den: { 'case-1': 'at the near left of the rows of bark', 'case-2': 'across the rows at the right', 'case-3': 'at the far side, standing by the doorway’s light',
    // chapter 10: on the stone close-up, her sleeping tail
    tail: 'curled at the panel’s bottom edge: only her tail’s tip',
    // chapter 11: the warriors' next nest (`nextNest`), beside hers on the nest close-up
    'next-nest': 'in the next nest, at the left edge of the close-up' },
  // chapter 12: a third cat at the hedge, on the lawn just right of the gap
  garden: { 'hedge-right': 'on the lawn just right of the gap in the hedge, near the panel’s right edge' },
  // chapter 10: the Moon Ferry (the Crossing's stones, the deck, the raft's back, the low logs and the gap, the river) and
  // Gathering Island (the shore, the clearing, the roots, the case, the fox's edge, the mist, the sky, her paws); a spot
  // that reads differently through one camera is in CAM_ANCH below
  ferry: { 'bank-1': 'on the Crossing’s flat stones, walking down to the rafts, first', 'bank-2': 'on the stones, walking down to the rafts, second', 'bank-3': 'on the stones, walking down to the rafts, third',
    edge: 'at the stones’ edge by the front raft, about to step aboard', 'log-1': 'just aboard, on the front raft’s near logs', 'log-2': 'on the front raft’s near logs, beside the first',
    pole: 'standing at the front raft’s far end with the long pole',
    'seat-1': 'seated along the raft’s logs, in the first of six seats (three down each side, the near ones bigger)', 'seat-2': 'seated along the logs, in the second seat', 'seat-3': 'seated along the logs, in the third seat',
    'seat-4': 'seated along the logs, in the fourth seat', 'seat-5': 'seated along the logs, in the fifth seat', 'seat-6': 'seated along the logs, in the sixth seat',
    front: 'mid-raft at the left', beside: 'mid-raft, beside her', back: 'at the raft’s near right corner, beside the luggage', heap: 'beside the heap of reeds',
    'back-1': 'at the raft’s back end, left of the heap, first', 'back-2': 'at the raft’s back end, left of the heap, second', 'back-3': 'at the raft’s back end, left of the heap, third',
    gap: 'in the silver water between two logs (no ground shadow: the set draws its rings)', lie: 'lying flat on the logs at the gap’s edge, chin over it',
    'sit-1': 'on the logs beside the gap, first', 'sit-2': 'on the logs beside the gap, second', 'sit-3': 'on the logs beside the gap, third',
    water: 'in the silver water in the middle of the gap (no ground shadow)', lip: 'at the gap’s top edge, looking down: head and forepaws, the rest cut off by the edge',
    'raft-1': 'small on the front raft, first', 'raft-2': 'small on the front raft, second' },
  island: { 'land-1': 'stepping off onto the shore, up the slope, first', 'land-2': 'stepping off onto the shore, second', 'land-3': 'stepping off onto the shore, third',
    raft: 'at the Moon Ferry’s front, at the water’s edge', drag: 'on the mud beside the luggage, dragging it', print: 'on the mud beside the badger’s print',
    'root-1': 'on the great tree’s left root', 'root-2': 'on the great tree’s middle root', 'root-3': 'on the great tree’s right root',
    'crowd-1': 'at the front of the ring, CrystalClan’s side at the left, first', 'crowd-2': 'at the front of the ring, CrystalClan’s side, second', 'crowd-3': 'at the front of the ring, CrystalClan’s side, third',
    'crowd-4': 'at the front of the ring, ReedClan’s side at the right, first', 'crowd-5': 'at the front of the ring, ReedClan’s side, second', 'crowd-6': 'at the front of the ring, ReedClan’s side, third',
    elder: 'at the back left of the ring, in front of the roots', centre: 'in the middle of the clearing', beside: 'beside her in the middle of the clearing',
    edge: 'at the clearing’s river edge, at the right', 'edge-2': 'at the clearing’s river edge, second', 'edge-3': 'at the clearing’s river edge, third',
    bank: 'at the river edge, in front of the fox’s place, by the water', luggage: 'at the clearing’s left edge, by the reed heap',
    step: 'below the middle root, where a cat called up to the tree stands', 'near-1': 'beside the step, first', 'near-2': 'beside the step, second',
    speak: 'a little left of centre in the moonlight', mentor: 'behind her at the left', root: 'up on a low root of the great tree behind her, where every Clan can see',
    fox: 'at the clearing’s river edge, at the right', 'weasel-1': 'at the river edge beside the fox, first', 'weasel-2': 'at the river edge beside the fox, second',
    'front-1': 'at the crowd’s front behind her, first', 'front-2': 'at the crowd’s front behind her, second', 'front-3': 'at the crowd’s front behind her, third', 'front-4': 'at the crowd’s front behind her, fourth',
    water: 'in the river, swimming away, first (no ground shadow)', 'water-2': 'in the river, swimming away, second (no ground shadow)', 'water-3': 'in the river, swimming away, third (no ground shadow)',
    mama: 'out of the mist at the right, the face about two cats tall', eldest: 'lower and further right, out of the mist, the face bowing to the grass',
    nose: 'on the grass under Mama’s lowered nose', fly: 'in the air over the clearing, round the great tree (no ground under her)', far: 'far up the river, small, in the air',
    close: 'close in front, the forepaws and chest filling the lower panel', above: 'leaning down from the top right, her claws over the paws below' },
  // chapter 5: on the open river, `pole` is the poling spot and `beside` is in the water (an otter's place, or a dragonet's)
  openriver: { pole: 'at the poling spot, at the raft’s end', beside: 'in the water beside the raft' } };
// chapter 8: an anchor that reads differently through one camera of a set (the weasels' holes close up, the weeds' view
// up the bank, the fox on the rails beside the weasels, the dogs' own stretch of the path)
const CAM_ANCH = {
  tracks: { holes: { 'hole-1': 'at the little hole, on the slope in front of it (a weasel here about half a cat’s height)', 'hole-2': 'at the second small hole, just beside the little one and a little higher, on the slope in front of it' },
    hide: { 'hole-1': 'at the little hole up the bank, mid-distance, smaller than a cat’s head in the weeds', 'hole-2': 'at the second small hole up the bank, mid-distance, smaller than a cat’s head in the weeds', rails: 'up on the tracks at the top of the bank, never bigger than a cat’s head in the weeds' },
    brag: { rails: 'on the rails at the top of the bank, against the moon and stars, at a fox’s size beside the weasels' } },
  field: { dogs: { 'trail-1': 'along the middle of the path, the nearer of two places', 'trail-2': 'along the middle of the path, the further of two places' } },
  // chapter 9: the elder and the apprentice where each camera of GroveClan's woods puts them
  grove: { wide: { elder: 'stepping out from between the trunks at the right' },
    oak: { elder: 'beside the oak, at the right' } },
  // chapter 10: the poler on the deck and small on the river; the island's spots on its closer cameras
  ferry: { deck: { pole: 'standing at the front end with her pole, against the moonlit river' }, river: { pole: 'poling at the front raft’s end, small' } },
  island: { case: { beside: 'at her right, between her and the fox' },
    mist: { beside: 'on the grass beside her, facing the mist', speak: 'at the left, facing the mist', 'front-1': 'at the left beside her, facing the mist', 'front-2': 'at the left beside her, second, facing the mist' },
    fox: { fox: 'at the clearing’s edge, the river behind', 'weasel-1': 'at the fox’s heels, first', 'weasel-2': 'at the fox’s heels, second' },
    sky: { nose: 'high at the right, beside Mama’s face in the mist (in the air)' } }
};
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
// chapter 5: what a one-tap frame's `tap` is, in words
const TAPS = { nose: 'the old tom’s nose', earth: 'the freshly dug earth', fur: 'the tuft of fur', mud: 'the mud', pole: 'Riffle’s pole',
  // chapter 6
  pinecone: 'the old tom’s pinecone', paw: 'her own raised forepaw', stone: 'the stones in the wall (one of them is the snake’s head)', eyes: 'the snake’s two open eyes',
  pebbles: 'the pebbles in Riffle’s paws', cheeks: 'Riffle’s puffed-up cheeks', ears: 'her own ears',
  // chapter 7
  back: 'the back row of the pile', roots: 'the low bramble roots', print: 'the nearest of Sprinkle’s big prints', fish: 'the reed string of fish in Riffle’s paw',
  mist: 'Sprinkle’s little cloud of mist',
  // chapter 8: the tunnel's mouth, the path past the dogs, the bank's weeds, the biggest hole, the piece of glass, the leaf
  mouth: 'the tunnel’s round dark mouth', path: 'the path ahead, the way to the tracks', weeds: 'the tall weeds at the bank’s foot', stash: 'the biggest hole’s mouth',
  glass: 'one small piece of glass at the heap’s near edge', leaf: 'the leaf in her paws', tail: 'the tip of a tail sticking straight up',
  // chapter 9: the reed root at the wall's end, Sprinkle's hurt wing
  root: 'the long pale root on the dry stones', wing: 'Sprinkle’s hurt right wing',
  // chapter 10: Gathering Island's reed heap (its own words are SET_TAPS', below)
  reeds: 'the heap of reeds over the luggage' };
// chapter 8: a tap mark somebody else carries is theirs (Riffle's ears, his near forepaw, the friend's tail); our cat's
// forepaw mid-run is her front paw, not a raised one. Every tap of chapters 5 to 7 reads as it did.
// (chapter 9: a cat's ears are a cat's; only Riffle's are small and round)
const TAP_WHO = { ears: (w, c) => w + (c && c.who !== 'riffle' ? '’s ears' : '’s small round ears'), paw: w => w + '’s near forepaw', tail: w => 'the tip of ' + w + '’s tail, sticking straight up' };
const TAP_SELF = { paw: { run: 'her own front paw, mid-stride',
  // chapter 9: stepping onto the little bridge
  walk: 'her own front paw, mid-step',
  // chapter 10: standing with every Clan, a step toward the fox
  stand: 'her own front paw, ready to step' } };
// chapter 9: a mark on our cat herself, in any pose: her own nose ("With your NOSE."), her own raised tail
const TAP_MINE = { nose: 'her own nose', tail: 'the tip of her own tail, sticking straight up' };
// chapter 10: a set's own tap marks (Gathering Island's reed heap, its mist bank, the badger's print: the global
// `mist` and `print` are Sprinkle's), a mark on our cat through one camera (her two forepaws held out for the stone),
// and the dragonets' snouts at their goodbyes (a cast member's `tap: 'nose'`: the old tom's nose is chapter 5's)
const SET_TAPS = { island: { reeds: 'the heap of reeds over the luggage', mist: 'the soft silver bank of mist rolling in', print: 'the badger’s big old print in the mud' } };
const CAM_TAPS = { island: { paws: { paw: 'her own two forepaws, held out in the moonlight' } } };
const DRAGONETS = new Set(['sprinkle', 'squall', 'puddle', 'wisp', 'sleet', 'hail', 'mizzle']), DRAGONET_SHE = new Set(['sprinkle', 'wisp', 'hail', 'mizzle']);

// chapter 10: the twenty cards every cat holds at the Gathering (the spec's section 3: the thinnest file, on every
// path); a pick's right card outside them is one only some cats hold (`my-count` among them: a reread can drop it)
const EVERY_CAT_HOLDS = new Set(['cant-fly', 'fox-flew', 'fox-brag', 'waffles-no-moon', 'fox-moon', 'heron-no-moon', 'tidy', 'reed-pile', 'stash', 'coil-diggers',
  'tunnel', 'scale', 'glass', 'four-a-night', 'sprinkle-scales', 'fur', 'prints-marsh', 'prints-sprinkle', 'otter-fox', 'heron-shapes']);
// a claim's one word in capitals (two letters or more), the word the strip lights: the engine's rule when it has one
const claimWord = claim => (typeof E.pickWord === 'function' ? E.pickWord(claim) : ((String(claim || '').match(/[A-Z][A-Z’']*[A-Z]/g) || []).length === 1 ? String(claim).match(/[A-Z][A-Z’']*[A-Z]/)[0] : null));

// chapter 10: the 7s' picture, and a lesson of every Count mixed (the Moon Ferry's: its facts carry two tables or
// more), each fact drawn and hopped as its own Count
const CLUTCHES = 'clutches of seven little dragonets, each a row of four over a row of three (four sisters and three brothers), small, mist-grey, round-eyed and smiling, never toothy; the clutches in rows of five with space between, never touching';
function mixedSet(set) {
  const t = new Set(asList(set && set.facts).map(f => (Array.isArray(f) ? null : f && f.table)).filter(Boolean));
  return t.size > 1;
}
function mixedPicture(x, set) {
  const t = x.table || set.table, n = x.b === t ? x.a : x.b, N = numWord(n), kind = x.picture && x.picture.kind;
  if (kind === 'marks') return N + ' row' + (n === 1 ? '' : 's') + ' of ' + numWord(t) + ' marks scratched ' + (x.picture.ground === 'log' ? 'on a log’s top' : x.picture.ground === 'mud' ? 'in the mud' : 'in the sand') +
    (t === 7 ? ', each row four and three with a gap' : '') + ', lit in order';
  if (kind === 'cheeks' || t === 6) return N + ' cheeks close up, six whiskers on each, three on top and three below';
  if (t === 8 && set.thing === 'leg') return N + ' spiders from above, eight legs each, four on each side';
  if (t === 7 && set.thing === 'dragonet') return N + ' clutches of seven little dragonets';
  const BY = { 1: ' cats’ tails', 2: ' cats’ ears', 3: ' patrols of three cats', 4: ' cats side-on, standing, four paws each, five to a row', 5: ' raised forepaws, five claws each',
    9: ' cats’ both forepaws, one claw tucked in: nine each', 10: ' cats’ both forepaws, ten claws each' };
  return BY[t] ? (t === 1 && n === 1 ? 'one cat’s tail' : N + BY[t]) : N + ' groups of ' + numWord(t);
}
const STEP_WORDS = { 1: 'the 1s one by one', 2: 'the 2s by twos', 3: 'the 3s by threes', 4: 'the 4s by fours, two and two', 5: 'the 5s by fives', 6: 'the 6s by sixes, three and three',
  7: 'the 7s by sevens, four and three', 8: 'the 8s by eights, four and four', 9: 'the 9s by tens, one tucked in for every cat', 10: 'the 10s by tens, two swipes a cat' };
const mixedSteps = set => [...new Set(asList(set.facts).map(f => (Array.isArray(f) ? set.table : f.table || set.table)))].map(t => STEP_WORDS[t] || 'the ' + t + 's by ' + t + 's').join('; ');

/* ------------------------------------------------------------------ helpers */
// (chapter 12: a {es:key} token printed as «its Spanish», as the page letters it; no line of chapters 1 to 11 has one)
const q = s => E.esMarks(String(s == null ? '' : s)).replace(/\s+/g, ' ').trim();
// chapter 12: a whole Spanish line (`lang: 'es'`), printed *[es]* with its Spanish and its English, as E.esLine letters them
function esSaid(text, x) {
  const m = /^«([\s\S]*)»\n\(([\s\S]*)\)$/.exec(E.esLine(text, null, x));
  return m ? '*[es]* “' + q(m[1]) + '” (' + q(m[2]) + ')' : '“' + q(text) + '”';
}
// chapter 11: the legend's sentence for her warrior ending (the Warrior Counts' always; a chapter's where it has the token)
const ENDING_WORDS = '`{ending}` is her warrior ending, `paw` until the Ceremony (Fernpaw, then Fernheart).';
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
const asList = x => (x == null ? [] : Array.isArray(x) ? x : [x]);
function factWords(k) {
  const m = /^(\d+)\s*[x×]\s*(\d+)$/.exec(String(k).trim());
  return m ? m[1] + ' × ' + m[2] : String(k);
}
/* A `when` in words: "specialty is noticing and not (the ch02-tails lesson went without help)".
 * Chapter 7: `or` reads a `not` whose every value is false as the or it is ("ch4CaughtFly or ch7Flew is
 * true": chapter 4's FLEW link, which reads either flag). It is asked for by a card link's condition
 * alone, so chapter 5's "found today" (`not` over three flags, all false: its frames and its book line)
 * prints as it always has. */
/* Chapter 10: a card pick's flag (the card she answered the claim with) reads in the card's own line, whole:
 * "she answered with “Sprinkle can’t fly.”", and a `not` of pick flags alone "unless she answered with “…”".
 * PICK.flags holds the flags of the chapter being boarded, PICK.line a card's line (both set by board()). */
const PICK = { flags: {}, line: () => null };
const answered = v => 'she answered with ' + asList(v).map(id => (PICK.line(id) ? '“' + q(PICK.line(id)) + '”' : '`' + id + '`')).join(' or ');
const pickValue = v => typeof v === 'string' || (Array.isArray(v) && v.length && v.every(x => typeof x === 'string'));
function whenWords(w, or) {
  if (!w || typeof w !== 'object') return '';
  return Object.keys(w).map(k => {
    const v = w[k];
    if (or && k === 'not' && v && typeof v === 'object' && Object.keys(v).length && Object.keys(v).every(x => v[x] === false)) return Object.keys(v).join(' or ') + ' is true';
    if (PICK.flags[k] && pickValue(v)) return answered(v);
    if (k === 'not' && v && typeof v === 'object' && Object.keys(v).length && Object.keys(v).every(x => PICK.flags[x] && pickValue(v[x]))) return 'unless ' + whenWords(v);
    if (k === 'not') return 'not (' + whenWords(v) + ')';
    if (k === 'lessonClean') return asList(v).map(s => 'the ' + s + ' lesson went without help').join(' or ');
    if (k === 'firstTry') return asList(v).map(f => 'she got ' + factWords(f) + ' right the first time').join(' or ');
    if (Array.isArray(v)) return k + ' is ' + v.map(x => JSON.stringify(x)).join(' or ');
    if (v === true) return k + ' is true';
    if (v === false) return k + ' is false or not set';
    return k + ' is ' + JSON.stringify(v);
  }).join(' and ');
}
// a condition after "only if", or (chapter 10) "unless …" as it stands
const ifWords = w => { const t = whenWords(w); return t.indexOf('unless ') === 0 ? t : 'only if ' + t; };
const onlyIf = w => (w ? ' *(' + ifWords(w) + ')*' : '');
const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const numWord = n => NUMW[n] || String(n);
// a number as the store holds it: "one square, three rows and three loose"
const storeWords = n => { const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10, parts = [];
  if (h) parts.push(numWord(h) + (h === 1 ? ' square' : ' squares')); if (t) parts.push(numWord(t) + (t === 1 ? ' row' : ' rows')); if (o) parts.push(numWord(o) + ' loose');
  return parts.length ? parts.slice(0, -1).join(', ') + (parts.length > 1 ? ' and ' : '') + parts[parts.length - 1] : 'nothing'; };
// the take-aways kit (docs/take-aways.md): the take page's picture, the engine's kinds (E.takeKind) and steps (E.TAKE_STEPS)
const TAKE_PICTURE = { store: 'the store’s prey in squares, rows and loose', marks: 'the quick picture on sand: squares, lines and dots' };
const TAKE_KIND_WORDS = { none: 'no spread', ones: 'a row to spread', tens: 'a square to spread', both: 'a row and a square to spread', zero: 'across a zero', zeros: 'across two zeros' };
const TAKE_STEP_WORDS = { none: 'the column, two digits then three, nothing to spread', ones2: 'a row to spread, two digits', ones: 'a row to spread, three digits', tens: 'a square to spread',
  both: 'a row and a square to spread', mixed: 'mixed kinds: deciding whether to spread, and an answer with no hundreds left', zero: 'across a zero', zeros: 'across two zeros' };
/* The pile in rows (chapter 4): `rows: [10, 10, { n: 10, gap: [3, 4, 5, 6] }]`, front to back. */
function rowsWords(v) {
  const rows = asList(v).map(r => (typeof r === 'number' ? { n: r, gap: [] } : { n: (r && r.n) || 0, gap: asList(r && r.gap) }));
  const n = rows.length, same = rows.every(r => r.n === rows[0].n);
  const out = [(same ? numWord(n) + ' row' + (n === 1 ? '' : 's') + ' of ' + numWord(rows[0].n) : 'rows of ' + rows.map(r => r.n).join(', ')) + ', running back under the brambles'];
  rows.forEach((r, i) => {
    if (!r.gap.length) return;
    const first = Math.min(...r.gap), after = r.n - Math.max(...r.gap) - 1;
    out.push('the ' + (i === n - 1 ? 'back' : ORD[i + 1] || 'next') + ' row has ' + numWord(r.gap.length) + ' empty places side by side, ' + (first === after ? 'right in its middle' : 'in it') +
      ' (' + numWord(first) + ' pieces, the gap, ' + numWord(after) + ' pieces)');
  });
  return out.join('; ');
}

/* The row of bark on the sand as she has scratched it by this panel (chapter 4, the hollow's `bark:
 * 'row'` with `cards`): the cards in order, by id, an entry with a `when` marked as only hers, then
 * the blank pieces. */
function sandRowWords(cards, blank) {
  const list = asList(cards).map(c => (c && typeof c === 'object' ? '`' + (c.id || c.picture) + '`' + (c.when ? ' (only if ' + whenWords(c.when) + ')' : '') : '`' + c + '`'));
  const n = Math.max(0, Math.round(+blank || 0));
  return 'the row of bark on the sand, scratched as far as she has got: ' + list.join(', ') + (n ? ', then ' + numWord(n) + ' blank piece' + (n === 1 ? '' : 's') : '');
}

// the cast extras the art draws (docs/build.md, "Chapter 2"): flat ears, the stone, her own purr, the pouf
function castExtraWords(c, set) {
  const out = [];
  if (c.flatEars) out.push('ears laid flat');
  if (c.holds === 'stone') out.push(['stand', 'walk', 'peer', 'stretch'].includes(c.pose) && !c.holdAt ? 'carrying Riffle’s stone in the mouth' : 'Riffle’s stone at the front paws');
  if (c.purr) out.push('purring (the purr lines come from this one alone)');
  if (c.lift) out.push('lifted onto a pouf, the face above the rail');
  // chapter 3's extras
  if (c.holds === 'pebble') out.push('holding her plain grey pebble, smooth as an egg');
  if (c.holds === 'vole') out.push('a vole in the mouth');
  if (c.holds === 'fish') out.push('a fish in the mouth');
  if (c.holds === 'fish2') out.push('two fish in the mouth');
  if (c.tear) out.push('a misty tear');
  if (c.mist) out.push('a little cloud of mist');
  if (c.claws) out.push('claws out');
  if (c.puffed) out.push('fur puffed up double');
  if (c.squeeze) out.push('eyes squeezed shut');
  if (c.moss) out.push('moss pulled over the ears');
  if (c.pebbles === 4) out.push('four pebbles in the air');
  if (c.pebbles === 5) out.push('four pebbles in the air and the fifth, plain round brown, in his paw');
  // chapter 4's extras
  if (c.holds === 'bark') out.push('holding a curl of pale bark');
  // chapter 12: Chispapaw's collar off (chapter 13's morning she leaves the bell in her nest)
  if (c.collar === false) out.push('without her collar and bell');
  if (c.wink) out.push('one slow wink');
  if (c.flick) out.push('one ear flicks');
  // chapter 5's extras
  if (c.tuck) out.push('one claw curled back in: nine out, one tucked');
  // (chapter 6: the old tom asleep lying on his pinecone is not sitting up; chapter 7: `'half'`, half asleep)
  if (c.asleep === 'half') out.push('eyes half shut, heavy-lidded: half asleep');
  else if (c.asleep) out.push(['lie', 'curl', 'loaf', 'flat', 'sun'].includes(c.pose) ? 'eyes shut: asleep' : 'eyes shut: asleep sitting up');
  if (c.snail) out.push(c.snail === 'in' ? 'a snail on one ear, its horns pulled in' : 'a snail halfway up one ear');
  if (c.holds === 'pole') out.push(c.pose === 'hug' ? 'hugging the raft’s pole, twice his size' : 'holding the raft’s long pole');
  if (c.buzz) out.push('buzzing all over: short zigzags along the outline (shaking, with nothing blowing)');
  if (c.dragonfly) out.push(c.who === 'patience' ? 'a dragonfly asleep on her bill' : 'a dragonfly on the nose');
  if (c.glow) out.push('glowing softly: the one she taps');
  // (chapter 10: a dragonet's goodbye is tapped on the snout)
  if (c.tap === 'nose' && DRAGONETS.has(c.who)) out.push('the snout is what she taps');
  else if (c.tap === 'nose' || c.tap === true) out.push('the nose is what she taps');
  if (c.tap === 'pole') out.push('the pole, where the paws hold it, is what she taps');
  // (chapter 7: under the Old Bridge the print is Sprinkle's, and her paw is the small one)
  if (c.reach) out.push(set === 'bridge' ? 'one forepaw held out and down, touching nothing: just over the heel pad of one of Sprinkle’s big prints, the pad showing all round it and the five toes and long claws fanned out beyond, toward us, room to spare (her paw about a fifth of its length)' :
    'one forepaw held out and down over the edge, touching nothing: over a tiny print in the mud, half the paw’s size, the paw’s small shadow on it');
  // chapter 6's extras: what is held and where (`holdAt`), what she taps, the starry cat, Sleet's tuft
  const AT = { chin: 'under the chin', paws: 'at the front paws', mouth: 'in the mouth' };
  if (c.holds === 'pinecone') out.push(c.holdAt === 'chin' ? 'a big pinecone under the chin' : c.holdAt === 'paws' ? 'a big pinecone at the front paws' : c.holdAt === 'mouth' ? 'carrying a big pinecone in the mouth' : 'holding a big pinecone');
  if (c.holds === 'pebbles') out.push(c.holdAt === 'paws' ? 'three plain round brown pebbles set down neatly on the ground in front of the feet' : 'three plain round brown pebbles held in the forepaws');
  if (c.holds === 'string') out.push('a reed string of three fish hanging from one forepaw (eyes shut, nothing through a fish)');
  if (c.holdAt && !c.holds) out.push('what is held goes ' + (AT[c.holdAt] || c.holdAt));
  if (c.tap === 'pinecone') out.push('the pinecone is what she taps');
  // (chapter 8: mid-run the paw she taps is the front one; Riffle's, scrambling, is his near forepaw)
  // (chapter 9: stepping onto the little bridge, the front paw mid-step)
  // (chapter 10: standing, the front paw ready to step)
  if (c.tap === 'paw') out.push(c.pose === 'run' ? 'the front paw, mid-stride, is what she taps' : c.pose === 'scramble' ? 'the near forepaw is what she taps' : c.pose === 'walk' ? 'the front paw, mid-step, is what she taps' :
    c.pose === 'stand' && c.who === 'player' ? 'the front paw, ready to step, is what she taps' :
    // (chapter 10: on the island's close-up of her paws, both are held out for the stone)
    set === 'island' && c.at === 'close' ? 'her two forepaws, held out, are what she taps' : 'the raised forepaw is what she taps');
  if (c.tap === 'ears') out.push(c.who === 'riffle' ? 'his small round ears are what she taps' : 'the ears are what she taps');
  // (chapter 10: the mist stone she holds is said with it, below; chapter 6's stone is the snake's head in the wall)
  if (c.tap === 'stone' && c.holds !== 'miststone') out.push('the head, turned into the gap like one more stone of the wall, is what she taps');
  if (c.tap === 'eyes') out.push('the two round open eyes are what she taps');
  if (c.tap === 'pebbles') out.push('the pebbles are what she taps');
  if (c.tap === 'cheeks') out.push('the puffed-up cheeks are what she taps');
  // chapter 7: Riffle's fish to toss, Sprinkle's burp
  if (c.tap === 'fish') out.push('the string of fish is what she taps');
  if (c.tap === 'mist') out.push('the little cloud of mist is what she taps');
  // chapter 8: the raised tail, the leaf with the glass folded in it (or open on the ground), Snatch's mouse
  // (chapter 13: a curled cat's tail rising straight up out of the curl)
  if (c.tailUp === true) out.push(c.who === 'riffle' ? 'his thick rudder tail stuck straight up' : c.pose === 'curl' ? 'the tail rising straight up out of the curl, its tip soft' : 'the tail held straight up, its tip curled over');
  if (c.tap === 'tail') out.push('the raised tail’s tip is what she taps');
  // (chapter 9: Thymeleaf's leaf holds the remedy)
  if (c.holds === 'leaf' && c.who === 'thymeleaf') out.push((c.holdAt || (['stand', 'walk', 'run'].includes(c.pose) ? 'mouth' : 'paws')) === 'mouth' ? 'the remedy, pale green, curled in a leaf carried in the mouth' : 'the remedy, pale green, curled in a leaf at the front paws');
  else if (c.holds === 'leaf') out.push((c.holdAt || (['stand', 'walk', 'run'].includes(c.pose) ? 'mouth' : 'paws')) === 'mouth' ? 'a leaf folded round something small, carried in the mouth' : 'a leaf folded round something small, at the front paws');
  if (c.holds === 'glass') out.push('the leaf open on the ground at the front paws, the small clear piece of glass on it shining');
  if (c.tap === 'leaf') out.push('the leaf is what she taps');
  if (c.holds === 'mouse') out.push(c.holdAt === 'paws' ? 'a mouse held in the forepaws (eyes shut, its tail dangling)' : 'a mouse in the mouth (eyes shut, its tail dangling)');
  if (c.starry) out.push('drawn in starlight: pale blue-white, a little see-through, small stars inside the outline, a soft glow at the edge, a kind face');
  if (c.grass) out.push('a tuft of long grass on the head, between the horn nubs');
  // chapter 9: Riffle's river mint, Sprinkle's hurt wing tapped (the rub)
  if (c.holds === 'mint') out.push(c.holdAt === 'mouth' ? 'a bunch of river mint as big as his head, carried in the mouth' : 'a bunch of river mint as big as his head, held in the forepaws');
  if (c.tap === 'wing') out.push(c.who === 'sprinkle' ? 'her hurt right wing is what she taps' : 'the wing is what she taps');
  // chapter 10: the mist stone in her paws (grey, until the moonlight finds it: then its flash), wet fur off the river
  if (c.holds === 'miststone') out.push((c.holdAt === 'paws' ? 'the mist stone in one forepaw over the moss' : 'the mist stone held out in her two forepaws') + ': a smooth grey pebble, egg-shaped, the size of her paw' +
    (c.flash === true ? ', flashing blue and green in the moonlight (a band of blue and green light across its face, the rest still grey)' : ''));
  else if (c.flash === true) out.push('flashing blue and green in the moonlight');
  if (c.tap === 'stone' && c.holds === 'miststone') out.push('the mist stone is what she taps');
  if (c.wet === true) out.push('wet through: a little darker, the fur flattened and spiky at its edges, two or three drips falling');
  return out;
}


/* Chapter 7: `compare: [24, 60]`, two straight lines scratched to scale, each with its number (the
 * bridge's in the mud, the Hollow's in the sand); false draws none. Any other value is a shape nobody
 * gave, and has no words. */
function timesWords(r) {
  const whole = Math.floor(r), half = Math.abs(r - whole - 0.5) < 1e-9;
  if (Math.abs(r - whole) < 1e-9) return whole === 2 ? 'twice as long as' : numWord(whole) + ' times as long as';
  return half ? numWord(whole) + ' and a half times as long as' : 'about ' + numWord(Math.round(r)) + ' times as long as';
}
function compareWords(set, v) {
  if (v === false || v == null) return '';
  if (!Array.isArray(v) || v.length !== 2 || !v.every(n => typeof n === 'number' && n > 0)) return 'compare: ' + JSON.stringify(v);
  const lo = Math.min(v[0], v[1]), hi = Math.max(v[0], v[1]);
  return 'two straight lines scratched ' + (set === 'bridge' ? 'in the open mud at the front' : 'in the sand between them') + ', the long one ' + timesWords(hi / lo) +
    ' the short one: “' + lo + '” by the short line and “' + hi + '” by the long one';
}

/* A scene option in words; '' when it adds nothing to say (a default, or off). Chapter 9: the camera
 * too, for an option that reads differently through one (the den's bark and glass on the case). */
// chapter 9: the six rows of the case, in the order she reads them, and what is in each
const CASE_ROWS = ['the moon', 'FLEW', 'the piles', 'the scale', 'the prints', 'the tunnel'];
function readWords(v) {
  if (v === 0) return 'no row lit yet; the first row (the moon) glows: the row she taps next';
  if (Number.isInteger(v) && v > 0 && v < 6) return 'the first ' + numWord(v) + ' row' + (v === 1 ? '' : 's') + ' lit, the bark warm (' + CASE_ROWS.slice(0, v).join(', ').replace(/, ([^,]*)$/, ' and $1') +
    '); the next row (' + CASE_ROWS[v] + ') glows: the row she taps next';
  if (v === 6) return 'all six rows lit, the bark warm; nothing glowing';
  if (v === 7) return 'all six rows lit, and a seventh laid out and lit below them, out of the face-down stack: her own count (`my-count`) and Mizzle’s card (`mizzle-wing`), each only if she holds it; nothing glowing';
  return 'read: ' + JSON.stringify(v);
}
// chapter 10: the full moon where each place shows it (the den's is the art's clock: full and round)
const MOON14 = { ferry: 'the full moon, round and bright, wherever the sky or the water shows it',
  riverbank: 'the full moon over the towers, and under it the river silver, moonlight on its ripples (never the black water of a dark night); the path pale in the moonlight',
  tower: 'the full moon high over the towers' };
/* Chapter 10: the Moon Ferry's and Gathering Island's options, set by set (`clan`, `crowd`, `luggage`, `bubbles`,
 * `drawing`, `print` and `tap` read otherwise on other sets); null for a name the set does not have, which then reads
 * as any other set's (the moon on the ferry). */
function ferryIslandWords(set, k, v) {
  const bare = k + ': ' + JSON.stringify(v);
  // a flag's words, or a list's: what each value says ('' for off: false, or 'none'); a value nobody gave is bare
  const flag = w => (v === true ? w : v === false ? '' : bare), pickOf = m => (Object.prototype.hasOwnProperty.call(m, v) ? m[v] : v === 'none' ? '' : bare);
  if (set === 'ferry') {
    if (k === 'clan') return flag('the rest of CrystalClan seated along the logs of the front raft and the rafts behind, small, in their coats');
    if (k === 'luggage') return flag('the heap of reeds at the back of the front raft (the luggage), round and lumpy, nothing of Sprinkle showing');
    if (k === 'puff') return flag('a little cloud of mist puffing out of the heap of reeds');
    if (k === 'low') return flag('the front raft riding low: the water lapping right at the logs’ tops, never over them');
    if (k === 'home') return flag('the raft bumping in at the Crossing’s stones, the moon high');
    return null;
  }
  if (k === 'crowd') return v === false ? '' : pickOf({ true: 'every Clan in a wide ring round the clearing, small seated cats in their Clans’ coats (CrystalClan’s, ReedClan’s marsh coats, GroveClan’s dapples) and a few otters, clear of the cast',
    standing: 'every Clan in the ring on its feet: every cat and every otter standing' });
  if (k === 'luggage') return pickOf({ heap: 'the reed heap (the luggage), round and lumpy', open: 'the reeds pulled off the luggage, lying in a pile' });
  if (k === 'ferry') return flag('the Moon Ferry’s front raft at the water’s edge');
  if (k === 'print') return flag('the badger’s old track in the mud: one big print, a wide pad and five toes in a row, long digging claw marks, old and dry at its edges, in bright moonlight (never fresh, and never the animal)');
  if (k === 'mist') return pickOf({ rolling: 'the mist coming up the river: a low silver bank over the water and the clearing’s edge, the moon glowing through it',
    thick: 'the mist thick round the great tree too, the moon glowing through it, everything silver, never grey-dark' });
  if (k === 'tail') return flag('the tip of a huge, soft grey tail curling through the mist');
  if (k === 'grown') return flag('the other grown Mistscales, great soft grey shapes in the mist: gentle, no faces, no teeth or claws');
  if (k === 'small') return pickOf({ one: 'one small dragonet shape in the mist, grey, soft and faceless', some: 'three or four small dragonet shapes in the mist, grey, soft and faceless',
    coming: 'small dragonet shapes stepping out of the mist toward her, still misty' });
  if (k === 'rising') return flag('the Mistscales rising into the mist and away upriver, great soft shapes going up, a small one with them');
  if (k === 'zip') return flag('one small winged shape zipping off the other way, toward the towers far downriver, a little ring of hiccup mist behind it');
  if (k === 'drawing') return pickOf({ cat: 'a little cat scratched in the earth in front of the dragonet beside her: four legs, two ears and a tail' });
  if (k === 'bubbles') return flag('little bubbles rising over the otters in the crowd');
  if (k === 'tap') return pickOf({ reeds: 'the heap of reeds over the luggage is what she taps', mist: 'the soft silver bank of mist is what she taps', print: 'the badger’s print is what she taps' });
  return null;
}
// chapter 12: the store's pieces in words, as the kit's picture lays them out ("one square, three rows and three loose")
function storePieces(n, empty) {
  const h = Math.floor(n / 100), r = Math.floor(n / 10) % 10, l = n % 10, e = empty ? 'empty ' : '';
  const parts = [h ? numWord(h) + ' ' + e + (h === 1 ? 'square' : 'squares') : '', r ? numWord(r) + ' ' + e + (r === 1 ? 'row' : 'rows') : '', l ? numWord(l) + ' ' + (empty ? (l === 1 ? 'empty place for loose' : 'empty places for loose') : 'loose') : ''].filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0] || '';
}
// the store under the Old Bridge (prey, on the floor) and its plan in the Training Hollow (empty pressed places, never prey)
function storeOptWords(set, v) {
  const n = typeof v === 'number' && v === Math.floor(v) && v > 0 && v <= 999 ? v : 0;
  if (!n) return v === false || v === 0 ? '' : 'store: ' + JSON.stringify(v);
  return set === 'hollow' ? 'the store’s plan in the sand: ' + storePieces(n, true) + ' (the kit’s store picture, every piece a pale dashed pressed place: the store is empty till sunset)'
    : 'the store laid out on the floor: ' + storePieces(n) + ', ' + n + ' (the kit’s store picture, low on the floor, at one fixed scale with its top edge fixed)';
}
// the quick way to scratch a count, in the Hollow's sand: one set of marks each, right to left
function quickWords(v) {
  const sets = ['Tallyheart’s at her paws', 'then Chispapaw’s beside it, her square round like a cookie', 'then yours beside hers'];
  if (v === 0 || v === false) return '';
  if (![1, 2, 3].includes(v)) return 'quick: ' + JSON.stringify(v);
  return 'the quick way to scratch a count, scratched in the sand: ' + (v === 1 ? 'one set' : numWord(v) + ' sets') + ' of a square, a line and a dot (a hundred, a ten, a loose), right to left, a little apart: ' + sets.slice(0, v).join(', ');
}
// chapter 13: the camp's first frost (and the dawn patrol's three trails through it), the spread forty-three in the
// Hollow's sand (never "rows" of five: a row is a ten), and GroveClan's big dig with the marks beside it (always one long
// line and eight little pokes: never dots, a count, a number or claw marks; nobody has read them)
function frostWords(v) {
  const frost = 'the first frost, at first light: every fern edged and tipped silver-white with rime (still green under it), the moss and the mossy path stones pale with rime, the grass silvered, a white rim on the dry fountain’s edge and on the tops of the bramble dens, a few soft glints; the sky clear and pale, cold and bright';
  return v === true ? frost : v === 'prints' ? frost + ', and three trails of small pawprints pressed green through the white, side by side, from the dens across the camp toward the entrance at the left (many prints a trail, never a number to count)' :
    v === false ? '' : 'frost: ' + JSON.stringify(v);
}
function spreadWords(v) {
  return v === 'standing' ? 'Tallyheart’s forty-three scratched in the sand at her paws, the quick way: four lines and three dots' :
    v === 'spread' ? 'the same forty-three, spread: one line crossed out, and ten new dots in a scratched frame under the three old ones, five and five' :
    v === 'two' ? 'Tallyheart’s spread forty-three at her paws and yours beside it, nearest you: the same marks twice, a little apart (each with one line crossed out and ten new dots in a scratched frame, five and five)' :
    v === false ? '' : 'spreadMarks: ' + JSON.stringify(v);
}
function digWords(k, v) {
  if (k === 'dig') return v === true ? 'the big dig at the old oak’s roots, on the trunk’s sunny right side: a wide, shallow hole under a root, its inside soft warm earth-brown (never black), earth thrown back in two loose heaps either side, five long scratches raking down its near side; just left of it, between it and a root, a smaller round doorway, half under fallen leaves; no fur, no feathers' :
    v === false ? '' : 'dig: ' + JSON.stringify(v);
  if (k === 'marks') return v === 'leaves' ? 'beyond the dig, on the flat bare earth, by themselves: one long line and eight little pokes scratched in the earth, half under fallen leaves (the line’s top end and a few of the pokes showing)' :
    v === 'bare' ? 'beyond the dig, on the flat bare earth, the leaves brushed aside to the edges: one long line and eight little pokes scratched in the earth, all of them plain' :
    v === false ? '' : 'marks: ' + JSON.stringify(v);
  return v === 'leaves' ? 'the fallen leaves over the marks are what she taps' : v === 'marks' ? 'the marks on the flat earth are what she taps' : v === 'none' || !v ? '' : 'tap: ' + JSON.stringify(v);
}
function optWords(set, k, v, all, cam) {
  if (set === 'ferry' || set === 'island') { const w = ferryIslandWords(set, k, v); if (w != null) return w; }
  // chapter 13: GroveClan's dig and the marks beside it, before the Hollow's claw marks and the global taps (optWords keys on
  // the option's name, and the grove's `marks: 'leaves'` would otherwise print the Hollow's claw marks on the trunk)
  if (set === 'grove' && (k === 'dig' || k === 'marks' || k === 'tap')) return digWords(k, v);
  if (k === 'frost' && set === 'camp') return frostWords(v);
  if (k === 'spreadMarks' && set === 'hollow') return spreadWords(v);
  if (k === 'collar' && set === 'den') return v === true ? 'Chispapaw’s collar, narrow and red with its tiny round gold bell, lying curled in a little hollow pressed in the moss beside the nest, on the side away from the grey tom' : v === false ? '' : k + ': ' + JSON.stringify(v);
  // chapter 12: the store under the bridge and its plan in the Hollow, the plan's glow, the quick marks, their two Taps
  if (k === 'store' && (set === 'bridge' || set === 'hollow')) return storeOptWords(set, v);
  if (k === 'storeGlow' && set === 'hollow') return v === 'hundreds' ? 'the squares of the store’s plan glowing' : v === 'tens' ? 'the rows of the store’s plan glowing' : v === false ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'quick' && set === 'hollow') return quickWords(v);
  if (k === 'tap' && set === 'hollow' && v === 'squares') return 'the whole store’s plan in the sand is what she taps (the squares)';
  if (k === 'tap' && set === 'bridge' && v === 'store') return 'the store on the floor is what she taps';
  // (chapter 10: the mist stone on her moss, grey or flashing; the small shape flying off over the riverbank)
  if (k === 'miststone') return v === true || v === 'flash' ? 'the mist stone on the moss of her nest, beside her glass in its leaf and the corners of her secret bark: a smooth grey pebble, egg-shaped, the size of her paw' +
    (v === 'flash' ? ', flashing blue and green in the moonlight from the doorway (a band of blue and green light across its face, the rest still grey)' : '') : v === false ? '' : k + ': ' + JSON.stringify(v);
  // (chapter 11: the warriors' next nest beside hers, on the den's nest close-up)
  if (k === 'nextNest') return v === true ? 'a second nest at the left edge of the close-up, a plain moss ring partly cut off by the panel’s edge (the next nest, with the warriors); her own nest a little to its right, with everything on it' : v === false ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'flyer') return v === true ? 'a small winged shape flying off upriver across the sky by the red light, slate-dark, wings out, a tiny ring of hiccup mist behind it' : v === false ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'door') return 'the door is ' + v;
  if (k === 'reflection') return v ? 'your reflection shows in the glass' : '';
  if (k === 'clan') return v ? 'tiny Clan cats in the garden' : '';
  if (k === 'sparrows') return v + ' sparrows on the fence';
  if (k === 'lampSparrow') return v ? 'a thirteenth sparrow on the lamp' : '';
  if (k === 'dish') return v ? 'a dish of water on the step' : '';
  if (k === 'towel') return v ? 'a folded towel beside the dish' : '';
  if (k === 'moth') return v ? 'a moth' : '';
  // chapter 4: the roof, the tower from below, the border, the pile in rows, the bark
  if (k === 'plane' && set === 'roof') return v ? 'an airplane passing well above the roof' : '';
  if (k === 'grit') return v === 'paws' ? 'seven little forepaws scratched in the grit, five claw marks each' : '';
  if (k === 'ding') return v ? 'a small “DING!” lettered at the very top, beside the red light' : '';
  if (k === 'foxTail') return v ? 'a white-tipped tail going into the long grass' : '';
  if (k === 'rows') return rowsWords(v);
  if (k === 'back') return v === 'shadow' ? 'the back row is a dark band in the brambles’ shadow: no gap, no dug earth and no “scale” can be made out' : '';
  if (k === 'scale') return v === 'behind' ? 'the “scale” where it was found, on the bare earth behind the back row: a small glint under the brambles' : v ? 'the “scale” in the gap, leaning on the next piece' : '';
  if (k === 'glint') return v ? 'the sun reaches the “scale”: it glitters' : '';
  if (k === 'heap') return v ? 'the five rim cats all in a heap' : '';
  // (chapter 7: count-free; chapter 6 hides three and chapter 7 six)
  if (k === 'hidden') return v ? 'her secret cards under the moss, a corner showing for each' : '';
  // the row of bark's own cards and blank pieces are said with the row itself (`bark`, below)
  if (k === 'cards' || k === 'blank') return '';
  if (k === 'bark') {
    // (chapter 9: on the case, her bark is laid out on the floor in rows, not along the nest's edge)
    if (set === 'den' && cam === 'case') return v === 'auto' ? 'her bark laid out on the floor in six rows, each piece face up, the pieces of a row touching: the moon (`waffles-no-moon`, `fox-moon`, `heron-no-moon`), FLEW (`cant-fly`, `fox-flew`, `fox-brag`, and `sleet-den` at its end if she holds it), the piles (`tidy`, `reed-pile`, `stash`), the scale (`scale`, `glass`), the prints (`prints-sprinkle`) and the tunnel (`coil-diggers`, `tunnel`); every other piece she holds stacked face down by the nest’s edge, unread' :
      v ? numWord(+v) + ' piece' + (+v === 1 ? '' : 's') + ' of bark laid out on the floor' : '';
    if (set === 'den') return v === 'auto' ? 'her Case File along the mossy edge of her nest: a piece of bark for each card she holds, overlapping like roof tiles' :
      v ? numWord(+v) + ' piece' + (+v === 1 ? '' : 's') + ' of bark along the mossy edge of her nest' : '';
    if (v === 'row' && all && Array.isArray(all.cards)) return sandRowWords(all.cards, all.blank);
    return v === 'falling' ? 'a curl of pale bark falling from the trunk' : v === 'sand' ? 'a curl of bark lying on the sand' : v === 'row' ? 'blank curls of bark in a row on the sand' : '';
  }
  // (chapter 10: all ten, as the art lays them, in rows of four)
  if (k === 'marks') return v === 'auto' ? 'one claw mark on the trunk for each Count she has learned' : v === 10 ? 'ten claw marks on the trunk, in rows of four, four and two: one for every Count' : v + ' claw mark' + (v === 1 ? '' : 's') + ' on the trunk';
  if (k === 'glow') {
    if (v === 'auto') return 'each claw mark glows if its Count glows in the Training Hollow';
    if (Array.isArray(v)) { const on = v.map((x, i) => (x ? ORD[i + 1] || String(i + 1) : '')).filter(Boolean); return on.length ? 'the ' + on.join(' and ') + ' claw mark' + (on.length === 1 ? '' : 's') + ' glow' + (on.length === 1 ? 's' : '') : ''; }
    return v ? 'the claw mark glows' : '';
  }
  if (k === 'weather') return v === 'storm' ? 'a storm outside' : v === 'cloudy' ? 'heavy cloud hides the stars, no rain' : 'clear weather';
  // (chapter 5: a number is a crescent of that many nights, drawn a little fatter than the night before's;
  // chapter 8: the eighth evening's is a half moon, bright, and the night silver, not black; chapter 9: the
  // twelfth evening's more than half, the thirteenth's nearly round, the eve of the full moon)
  // (chapter 10: the fourteenth evening's is the full moon)
  // (chapter 12: the sixteenth evening's, one past full and waning, high and silver)
  if (k === 'moon') return typeof v === 'number' ? (v === 14 ? MOON14[set] || 'the moon full and round, fourteen evenings old' : v === 8 ? 'a bright half moon, eight evenings old' : v === 13 ? 'the moon nearly round, thirteen evenings old' :
    v === 16 ? 'the moon one evening past full, waning, sixteen evenings old, high and silver' :
    v > 8 && v < 13 ? 'the moon more than half and growing, ' + numWord(v) + ' evenings old' : v > 8 ? 'the moon, ' + v + ' evenings old' : 'a crescent moon, a little fatter than last night’s') : v ? 'a moon in the sky' : 'no moon';
  if (k === 'drips') return set === 'den' ? (v ? 'sun spots and dripping leaves' : '') : (v ? 'water drips' : 'no drips');
  if (k === 'puddles') return v ? 'puddles everywhere' : '';
  if (k === 'rainFountain') return v ? 'the fountain is full of rain' : '';
  if (k === 'splash') return v ? 'a huge splash' : '';
  if (k === 'pairs') return v + ' pair' + (v === 1 ? '' : 's') + ' of prey, stacked two high';
  if (k === 'lit') return v ? 'the first ' + v + ' stack' + (v === 1 ? '' : 's') + ' glow' + (v === 1 ? 's' : '') : '';
  if (k === 'dug') return v === 'big' ? 'a bigger patch of soft, lumpy, dug-up earth behind the pile' : v ? 'soft, lumpy, dug-up earth behind the pile' : '';
  if (k === 'train') return v ? 'an Ironsnake (a train) crossing on top' : '';
  if (k === 'eyes') return v === 'open' ? 'two big round shining eyes at the very back' : v === 'blink' ? 'the two big eyes, blinking' :
    v === 'sprinkle' ? 'two big round shining eyes in the dark, her size, just where her face is when she sits up in the nook' : '';
  if (k === 'drag') return v ? 'deep drag marks in the mud' : 'no drag marks';
  // chapter 5, the open river: the skymonster at three sizes, always well above the raft (nothing blows, the water stays flat)
  if (k === 'plane' && set === 'openriver') return v === 'far' ? 'far down the river, a light low in the sky: the skymonster, a glint' : v === 'near' ? 'the skymonster nearer: a shape with wings' :
    v === 'over' ? 'the skymonster right overhead, its belly filling the top of the panel' : v === 'gone' ? 'the skymonster gone: empty sky again' : '';
  if (k === 'plane') return v === 'low' ? (set === 'riverbank' ? 'an airplane low over the river, its shadow on the water' : 'an airplane very low overhead') : v === 'high' ? 'an airplane high up' : 'no airplane';
  if (k === 'pebbles') return v ? 'a heap of pebbles' : '';
  if (k === 'roar') return v ? 'jagged sound lines from the tower roof' : '';
  if (k === 'light') return v ? 'the little red light blinks on the tallest roof' : 'the red light is off';
  if (k === 'stone') {
    if (v === 'auto') return 'Riffle’s lucky stone in her nest, right where she put it (by her nose or under her chin, as she chose)';
    if (v === 'nose') return 'Riffle’s lucky stone in her nest, by her nose';
    if (v === 'chin') return 'Riffle’s lucky stone in her nest, under her chin';
    return v ? 'Riffle’s lucky stone in her nest, between her paws' : '';
  }
  if (k === 'depth') {
    if (v === 'auto') return 'each claw mark as deep as her practice has made it';
    const dw = ['fresh', 'deeper', 'deepest'];
    return Array.isArray(v) ? 'the claw marks ' + v.map(d => dw[d === true ? 1 : +d] || 'fresh').join(', ') : 'every claw mark ' + (dw[v === true ? 1 : +v] || 'fresh');
  }
  if (k === 'vole') return v ? 'one plump vole nudged off the top of a stack, lying in front of the pile' : '';
  // chapter 3
  if (k === 'chime') return v ? 'a wind chime on Waffles’ balcony, beside her geranium' : '';
  if (k === 'crowd') return v ? 'the whole Clan crowded round the fountain, rows of cats behind' : '';
  if (k === 'pebble') return v === 'in' ? 'Riffle’s fifth pebble, plain round brown, in the dark' : v === 'out' ? 'the brown pebble rolling out of the dark' : v === 'paws' ? 'the brown pebble at her paws' : '';
  if (k === 'branch') return v ? 'fallen branches heaped across the back, like a pile of old sticks, up to Sprinkle’s chin' : '';
  // chapter 6: Coil's wall beside Sprinkle's nook, the rustle in the reeds at the wall's end
  if (k === 'stones') return v ? 'the bridge’s stone leg beside Sprinkle’s nook: a wall of big old fitted stones, its foot on the dry floor, with one dark gap low in it' : '';
  if (k === 'wing') return v ? 'her drooping wing kept clear of the lettering: no balloon or caption over it' : '';
  if (k === 'rustle') return v ? 'rustle lines in the reeds; nobody seen' : '';
  // chapter 5: tiny prints, behind the pile and in the marsh's mud (the bridge's are Sprinkle's)
  if (k === 'prints' && set === 'pile') return v ? 'tiny prints in the dug earth, each half the size of a cat’s' : '';
  if (k === 'prints' && set === 'marsh') return v ? 'a line of tiny prints across the mud, beside one great heron print' : '';
  if (k === 'prints') return v ? 'Sprinkle’s big five-claw prints in the mud beside the drag marks' : 'no prints';
  if (k === 'pawsIn') return v === 'both' ? 'six forepaws piled together, fanned so all thirty claws show: two of hers, Sprinkle’s two in grey, Riffle’s two in webbed brown' :
    v ? 'three forepaws piled together, fanned so all fifteen claws show: hers, Sprinkle’s grey, Riffle’s webbed brown' : '';
  // chapter 4's promise piles both forepaws of each friend: the hop lights a pair at a time, by tens
  if (k === 'hop') return !v ? '' : all && all.pawsIn === 'both' ? 'every friend’s ten claws lit warm gold, with 10, 20 and 30 lettered beyond them in pile order' :
    'every paw’s five claws lit warm gold, with 5, 10 and 15 lettered beyond them in pile order';
  // chapter 5: the open river, the marsh, and what the places from before gain
  if (k === 'shiver') return v ? 'small rings all round the raft: it is shivering' : '';
  if (k === 'foot') return v ? 'a blue-grey foot, much too big, poking up between two logs' : '';
  if (k === 'bubbles') return v ? 'two nostrils and a string of bubbles between the logs: he is up again' : '';
  if (k === 'late') return v ? 'late gold light, for the way home' : '';
  if (k === 'face') return v ? 'at one of the little round windows, one small face pressed to the glass (never a wave)' : '';
  if (k === 'claws') return +v ? numWord(+v) + ' of her claws dug into the log, each lit gold; the tenth stays tucked' : '';
  // (on the way home, the open river's and the Crossing's: the one string that still has fish on it)
  if (k === 'fish' && (set === 'openriver' || set === 'crossing')) return v === 'spare' ? 'the reed string with its two spare fish lying on the raft’s logs (eyes shut, no hook, no blood)' : '';
  if (k === 'fish') return v === 'strings' ? 'four strings of fish on the logs, five on every string (each string a reed looped round the tails; eyes shut, no hook, no blood)' :
    v === 'spare' ? 'three emptied reed strings on the logs, and the fourth with its two spare fish still on it' : '';
  if (k === 'owed') return +v ? 'a thought cloud over the heron, with ' + numWord(+v) + ' pair' + (+v === 1 ? '' : 's') + ' of small silver fish in it (what she is owed)' : '';
  if (k === 'pole') return v === 'planted' ? 'Riffle’s pole planted in the mud beside the raft, holding it still' : '';
  if (k === 'dragonfly') return v === 'beak' ? 'a dragonfly asleep on the heron’s beak' : v === 'nose' ? 'the dragonfly on our cat’s nose' : '';
  if (k === 'frogs') return v === 'jump' ? 'every frog jumping in' : 'frogs sitting on the lily pads';
  if (k === 'pale') return v === 'flinch' ? 'one pale reed jerks, once, among reeds that do not' : v === 'knees' ? 'one reed is paler than the others, and it has knees' :
    v === 'blink' ? 'the pale reed has two eyes, open' : 'one reed is paler than the rest';
  if (k === 'snout') return v ? 'a blue-grey snout poking up between the raft’s logs' : '';
  if (k === 'drawing') return v === 'herons' ? 'her drawing in the mud: seven little herons, each standing on one leg' :
    v === 'fox' ? 'her drawing in the mud: a fox, something small falling from its mouth with shine lines, a ring of ripples' : '';
  if (k === 'tap') return v === 'mud' ? 'a patch of the mud beside the raft is what she taps' : v === 'pole' ? 'the pole in Riffle’s paws is what she taps' :
    // chapter 7: the pile's back row and its roots, the print under the Old Bridge (a value nobody gave has no words)
    v === 'back' ? 'the back row is what she taps' : v === 'roots' ? 'the low bramble roots are what she taps' : v === 'print' ? 'the nearest of Sprinkle’s big prints is what she taps' :
    // chapter 8: the tunnel's mouth (the pile), the path ahead (the field), the bank's weeds, the biggest hole and one piece of the glass (the tracks)
    v === 'mouth' ? 'the tunnel’s round dark mouth is what she taps' : v === 'path' ? 'the path ahead, the way to the tracks at the right, is what she taps' :
    v === 'weeds' ? 'the tall weeds at the bank’s foot are what she taps' : v === 'stash' ? 'the biggest hole’s mouth is what she taps' :
    v === 'glass' ? 'one small piece at the near edge of the heap of glass is what she taps' :
    // chapter 9: the reed root at the wall's end
    v === 'root' ? 'the long pale root on the dry stones is what she taps' :
    v === 'none' || !v ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'swept') return v ? 'the dug earth swept flat by a tail: the prints are gone' : '';
  if (k === 'tuft') return v ? 'a tuft of thin brown fur caught in the raft’s vine' : '';
  if (k === 'mudPaws') return +v ? numWord(+v) + ' little forepaws drawn in the mud, five claw marks each' : '';
  // chapter 7: round the back of the pile, the tracks far off, and the two lines of the comparison
  if (k === 'tunnel') return v ? 'the roots lifted back, and under them the round dark mouth of a small tunnel in the dug earth, going down and in under the pile' : '';
  if (k === 'tracks') return v ? 'far off past the towers, low at the horizon, the train tracks catching the last light: two bright rails on a dark bed, the sleepers across it, running off behind the tallest tower' : '';
  if (k === 'compare') return compareWords(set, v);
  // chapter 8: the tunnel's tight place and its worm (the tracks), her glass in her nest (the den)
  if (k === 'tight') return v === true ? 'the tunnel narrows at the back: an earth lip and roots drawn over the back half of whoever is there' : v === false ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'worm') return v === true ? 'one pink worm poking out of the left way’s wall' : v === false ? '' : k + ': ' + JSON.stringify(v);
  // (chapter 9: on the case, her glass lies beside the rows, out of its hiding place)
  if (k === 'glass' && set === 'den' && cam === 'case') return v === true ? 'her piece of glass in its leaf, lying open beside the rows, shining' : v === false ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'glass' && set === 'den') return v === true ? 'her piece of glass in its leaf, tucked under the moss beside the corners of bark: the leaf’s tip and one small glint showing' : v === false ? '' : k + ': ' + JSON.stringify(v);
  // chapter 9: Thymeleaf's remedy (the camp's `herbs`), the case's rows (the den's `case`), the reed root at the
  // wall's end (the title), the dew on the roof's puddle, the sunny shallows by the Old Bridge
  if (k === 'remedy') return v === 'four' ? 'on the mixing stone, the four things in a row: a long pale root, a roll of soft silver moss, a bunch of mint and a curled leaf holding dew drops' :
    v === 'mixed' ? 'on the mixing stone, one curled leaf of pale green remedy, the stone smeared green' : v === 'none' || !v ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'read') return readWords(v);
  if (k === 'root') return v === true ? 'a long, pale reed root lying along the dry stones at the wall’s end (never in the mud or the reeds), and beside it one wet pawprint, dark on the dry stone' : v === false ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'dew') return v === true ? 'the rain puddle silver with dew at first light, its surface pale and bright, tiny beads of dew on the grit round it catching the low sun' : v === false ? '' : k + ': ' + JSON.stringify(v);
  if (k === 'shallows') return v === true ? 'the water at the bank’s edge bright and clear in the sun: pale green-gold over a sandy bottom you can see, sparkles and small rings, and a strip of soft pale sand along it, tucked at the bridge’s foot behind the reeds; never dark' : v === false ? '' : k + ': ' + JSON.stringify(v);
  return k + ': ' + JSON.stringify(v);
}
/* ------------------------------------------------------------------ one chapter */
/* ------------------------------------------------------------------ the Warrior Counts
 * PC.warrior as one story the board can walk: every frame under an id of its own (`first-1`, `halfway`,
 * `pass-clean`, `notyet-3`…), each list's frames joined by `next`, the last of each naming what comes
 * after it (`after`); and the result's pages, each a list of its versions ({ key, id, same }). */
const VARIANT_WORDS = {
  'pass.clean': 'every one right (55 of 55)', 'pass.quiet': 'a pass in a quiet sitting (she had a finished sitting before it): the Clan comes running',
  'notYet.first': 'her first not-yet (a sitting with the whole Clan watching)', 'notYet.second': 'her second not-yet', 'notYet.later': 'her third not-yet, and every one after',
  'notYet.better': 'more right than her last finished sitting', 'notYet.close': '47 to 49 right, no more than last time', 'notYet.plain': 'fewer than 45 right, no more than last time: no number',
  'afterPass.clean': 'every one right, after the pass', 'afterPass.number': 'fifty to fifty-four right, after the pass: a passing score, so her number'
};
function warriorStory(W) {
  const frames = {}, lists = {}, after = {}, pages = {};
  const seen = new Map();
  const put = (id, f, next) => { frames[id] = Object.assign({}, f, { next: next }); seen.set(f, id); return id; };
  const list = (name, fl, last, lastWords) => {
    lists[name] = [];
    asList(fl).forEach((f, i, a) => lists[name].push(put(name + '-' + (i + 1), f, i + 1 < a.length ? name + '-' + (i + 2) : '§' + name)));
    after[name] = lastWords;
  };
  const o = W.open || {};
  list('first', o.first, null, '**Then:** the first question.');
  list('again', o.again, null, '**Then:** the first question.');
  list('quiet', o.quiet, null, '**Then:** the first question.');
  lists.halfway = [put('halfway', asList(W.halfway)[0] || {}, '§halfway')];
  after.halfway = '**Then:** one button, “Keep going”, and the 29th question. No Back: the page comes after an answer.';
  const BUTTONS = {
    pass: '**Then:** her buttons, “Camp” and “To your ceremony” (the big one: the Ceremony chapter from its first page); while the Ceremony is not built, “Your ceremony is coming soon.” in its place, and “Camp”.',
    notYet: '**Then:** her buttons, “Camp” and “The Training Hollow” (the big one; “Back to the Training Hollow” while a round there is in progress). Trying again is on the hub, any time.',
    afterPass: '**Then:** her buttons, “The Training Hollow” and “Camp” (the big one).'
  };
  ['pass', 'notYet', 'afterPass'].forEach(kind => {
    const src = W[kind] || {}, name = kind.toLowerCase(), entries = asList(src.frames);
    pages[kind] = entries.map((e, i) => {
      const last = i === entries.length - 1, nx = last ? '§' + name : '(the next page)';
      if (!e || !e.by) return [{ id: put(name + '-' + (i + 1), e || {}, nx) }];
      const out = asList(e.by).filter(k => src[k]).map(k => (seen.has(src[k]) ? { key: k, same: seen.get(src[k]), id: seen.get(src[k]) } : { key: k, id: put(name + '-' + k, src[k], nx) }));
      if (e.else) out.push(seen.has(e.else) ? { same: seen.get(e.else), id: seen.get(e.else) } : { id: put(name + '-' + (i + 1), e.else, nx) });
      else out.push({ id: null });
      return out;
    });
    after[name] = BUTTONS[kind];
    after['(the next page)'] = '**Then:** Next, to the next page.';
  });
  Object.keys(frames).forEach(id => { if (frames[id].next === '(the next page)') frames[id].next = '§(the next page)'; });
  return { id: 'warrior', title: 'The Warrior Counts', frames, start: lists.first[0] || Object.keys(frames)[0], lists, after, pages };
}

function board(storyPath, outPath) {
  const PC = require(storyPath);
  // the Warrior Counts (app/story/warrior.js): not a chapter but `PC.warrior`, its frames in lists,
  // boarded as one story of its own (warriorStory) and written under its own headings (below)
  const W = basename(storyPath, '.js') === 'warrior' ? ((PC && PC.warrior) || (globalThis.PC && globalThis.PC.warrior) || null) : null;
  const stories = (PC && PC.story) || (globalThis.PC && globalThis.PC.story) || {};
  const story = W ? warriorStory(W) : stories[basename(storyPath, '.js')] || Object.values(stories)[0];
  if (!story || !story.frames) {
    console.error('No story found in ' + storyPath);
    process.exit(1);
  }
  const F = story.frames;
  const ids0 = Object.keys(F);
  /* Chapter 10: a card by its definition: this chapter's, else a chapter's beside it, else one of the game's own
   * (a fixture chapter beside no other); and the card picks' flags, which a `when` reads by the card's line. */
  let gameCards = null;
  function cardDef(id) {
    const own = (story.cards || {})[id];
    if (own) return own;
    for (const st of siblings()) if (st.cards && st.cards[id]) return st.cards[id];
    if (!gameCards) {
      gameCards = {};
      const dir = join(ROOT, 'app/story');
      try {
        readdirSync(dir).filter(x => /^ch\d+\.js$/.test(x)).sort().forEach(x => {
          const P = require(join(dir, x)), st = ((P && P.story) || {})[basename(x, '.js')];
          if (st && st.cards) Object.keys(st.cards).forEach(k => { if (!gameCards[k]) gameCards[k] = st.cards[k]; });
        });
      } catch (e) { /* no game beside it: the card's id alone */ }
    }
    return gameCards[id] || null;
  }
  PICK.flags = {};
  PICK.line = id => { const d = cardDef(id); return d && typeof d.line === 'string' ? d.line : null; };
  ids0.forEach(id => { const pk = F[id] && F[id].pick; if (pk && typeof pk.flag === 'string') PICK.flags[pk.flag] = true; });
  // chapter 5: the other chapters beside this one (app/story/chNN.js), loaded only when a frame here
  // runs one of their Counts sets (the roof found later: chapter 4's riddle)
  let sibs = null;
  function siblings() {
    if (sibs) return sibs;
    sibs = [];
    try {
      readdirSync(dirname(storyPath)).filter(x => /^ch\d+\.js$/.test(x) && x !== basename(storyPath)).sort().forEach(x => {
        const P = require(join(dirname(storyPath), x)), st = ((P && P.story) || {})[basename(x, '.js')];
        if (st && st.frames) sibs.push(st);
      });
    } catch (e) { sibs = []; }
    return sibs;
  }

  /* -------------------------------------------------------------- the graph */
  function exits(f) {
    if (!f || f.end) return [];
    if (f.choice) return f.choice.options.map(o => o.next);
    if (f.input) return [f.input.next];
    if (f.look) return [f.look.next];
    if (f.counts) return [f.counts.next];
    if (f.skip) return [f.skip.next];
    if (f.scratch) return [f.scratch.next];
    if (f.file) return [f.file.next];
    if (f.ask) return [f.ask.next];
    // (chapter 10: a card pick turns the page only by a right pick)
    if (f.pick) return [f.pick.next];
    return f.next ? [f.next] : [];
  }
  // every way on from a frame: its exits, and where the page turns when its `when` doesn't match (`else`)
  const ways = f => (f && f.else ? exits(f).concat([f.else]) : exits(f));
  function reach(id) {
    const order = [], seen = new Set([id]), queue = [id];
    while (queue.length) {
      const n = queue.shift(); order.push(n);
      for (const m of ways(F[n])) if (m && F[m] && !seen.has(m)) { seen.add(m); queue.push(m); }
    }
    return order;
  }
  function mergePoint(targets) {
    const sets = targets.map(t => new Set(reach(t)));
    for (const n of reach(targets[0])) if (sets.every(s => s.has(n))) return n;
    return null;
  }
  /* Reading order: a list of { frame } and { choice, branches: [{ option, items }], merge }. */
  /* (chapter 10: `lost`, the frames the walk would never board because only an `else` reaches them, a twin or a chain
   * of counted conditions: each is boarded right after the frame whose `else` names it, and its own `else` after it;
   * `only` keeps such a walk to those frames. Without them, as in chapters 1 to 9, the walk is as it always was.) */
  function walk(start, stopAt, seen, lost, only) {
    const items = [];
    let id = start;
    while (id && F[id] && id !== stopAt && !seen.has(id) && (!only || lost.has(id))) {
      seen.add(id);
      const f = F[id];
      items.push({ frame: id });
      if (lost && f.else && lost.has(f.else) && !seen.has(f.else)) items.push(...walk(f.else, null, seen, lost, true));
      if (f.choice) {
        const targets = f.choice.options.map(o => o.next);
        const merge = mergePoint(targets);
        const branches = f.choice.options.map(o => ({ option: o, items: walk(o.next, merge, new Set(seen), lost, only) }));
        branches.forEach(b => b.items.forEach(function mark(it) { if (it.frame) seen.add(it.frame); if (it.branches) it.branches.forEach(bb => bb.items.forEach(mark)); }));
        items.push({ choice: id, branches, merge });
        id = merge;
      } else id = exits(f)[0];
    }
    return items;
  }
  const order0 = walk(story.start, null, new Set());
  const boarded = new Set();
  (function mark(items) { items.forEach(it => { if (it.frame) boarded.add(it.frame); if (it.branches) it.branches.forEach(b => mark(b.items)); }); })(order0);
  const lost = new Set(reach(story.start).filter(id => !boarded.has(id)));
  const order = lost.size ? walk(story.start, null, new Set(), lost) : order0;

  /* -------------------------------------------------------------- text */
  // chapter 10: the chapter names its one speaking otter (`names.otter`: Granny, chapter 5's otter variant 3), so the cast does too
  const grannyOtter = c => !!(story.names && story.names.otter === 'Granny' && c && c.variant === 3);
  function whoWords(c) {
    if (c.who === 'player') return 'you';
    if (c.who === 'otter' && grannyOtter(c)) return 'Granny, the old otter who poles the Moon Ferry';
    if (VARIANT_WHO[c.who]) return VARIANT_WHO[c.who][c.variant || 1] || WHO[c.who];
    return WHO[c.who] || c.who;
  }
  /* Chapter 7: the cheeks of a Counts picture, left to right, by the face rule: two entries in a row
   * with the same `who` and variant are one face close up, its two cheeks puffed round (pairs taken
   * from the left); any other entry is one cat's cheek. */
  function cheekWords(list) {
    const L = asList(list), out = [];
    const name = c => (c.who === 'clancat' ? 'a Clan cat' + (c.variant ? ' (coat ' + c.variant + ')' : '') : whoWords(c));
    for (let i = 0; i < L.length; i++) {
      const c = L[i] || {}, d = L[i + 1];
      if (d && d.who === c.who && (d.variant || null) === (c.variant || null)) { out.push((c.who === 'player' ? 'your face' : 'the face of ' + name(c)) + ', its two cheeks puffed round'); i++; }
      else out.push(c.who === 'player' ? 'one of your cheeks' : 'a cheek of ' + name(c));
    }
    return out.join('; ');
  }
  function poseWords(c) {
    // (chapter 10: Granny, the chapter's own name for its one otter, is a she)
    if (c.who === 'otter' && grannyOtter(c) && (c.pose === 'stand' || (c.pose === 'hug' && c.holds === 'pole'))) return 'standing up on her hind legs';
    if (c.pose === 'stand' && (c.who === 'otter' || c.who === 'riffle')) return OTTER_STAND;
    // (chapter 5: with the raft's pole in his arms, the hug is the pole's: the extras say so)
    if (c.pose === 'hug' && c.holds === 'pole') return OTTER_STAND;
    if (c.who === 'sprinkle' && SPRINKLE_POSE[c.pose]) return SPRINKLE_POSE[c.pose];
    if (c.who === 'reynard' && REYNARD_POSE[c.pose]) return REYNARD_POSE[c.pose];
    if (c.who === 'squall' && SQUALL_POSE[c.pose]) return SQUALL_POSE[c.pose];
    if ((c.who === 'otter' || c.who === 'riffle') && OTTER_POSE[c.pose]) return OTTER_POSE[c.pose];
    if (c.who === 'patience' && PATIENCE_POSE[c.pose]) return PATIENCE_POSE[c.pose];
    if (c.who === 'puddle' && PUDDLE_POSE[c.pose]) return PUDDLE_POSE[c.pose];
    if (c.who === 'wisp' && WISP_POSE[c.pose]) return WISP_POSE[c.pose];
    // chapter 6
    if (c.who === 'coil' && COIL_POSE[c.pose]) return COIL_POSE[c.pose];
    if (c.who === 'sleet' && SLEET_POSE[c.pose]) return SLEET_POSE[c.pose];
    // chapter 8
    if (c.who === 'hail' && HAIL_POSE[c.pose]) return HAIL_POSE[c.pose];
    if ((c.who === 'snip' || c.who === 'snatch') && WEASEL_POSE[c.pose]) return WEASEL_POSE[c.pose];
    if (c.who === 'dog' && DOG_POSE[c.pose]) return DOG_POSE[c.pose];
    // chapter 9
    if (c.who === 'mizzle' && MIZZLE_POSE[c.pose]) return MIZZLE_POSE[c.pose];
    if (c.who === 'spider' && SPIDER_POSE[c.pose]) return SPIDER_POSE[c.pose];
    // chapter 10 (a pose a Mistscale was never given draws `lean`); Sprinkle leaning down with the pebble over her paws
    if (c.who === 'mistscale') return MISTSCALE_POSE[c.pose] || MISTSCALE_POSE.lean;
    // chapter 13 (a pose the groundhog was never given draws `sleep`)
    if (c.who === 'groundhog') return GROUNDHOG_POSE[c.pose] || GROUNDHOG_POSE.sleep;
    if (c.who === 'sprinkle' && c.pose === 'lookdown' && c.holds === 'pebble') return 'leaning down from above, looking down';
    return POSES[c.pose] || c.pose;
  }
  const extraWords = (c, set) => castExtraWords(c, set);
  function sceneWords(sc) {
    if (!sc) return 'No scene: a plain panel.';
    const parts = [];
    parts.push(setWords(sc));
    if (sc.cam) parts.push('Camera: ' + ((SET_CAMS[sc.set] || {})[sc.cam] || CAMS[sc.cam] || sc.cam) + ' (`' + sc.cam + '`).');
    const cast = (sc.cast || []).map(c => {
      const bits = [whoWords(c)];
      const where = c.at && typeof c.at === 'object' ? 'at a spot of this frame’s own (x ' + c.at.x + ', y ' + c.at.y + ')' :
        ((CAM_ANCH[sc.set] || {})[sc.cam] || {})[c.at] || (SET_ANCH[sc.set] || {})[c.at] || ANCH[c.at] || (c.at ? 'at ' + c.at : null);
      const mood = c.who === 'coil' && COIL_MOOD[c.mood] ? COIL_MOOD[c.mood] : (c.who === 'snip' || c.who === 'snatch') && WEASEL_MOOD[c.mood] ? WEASEL_MOOD[c.mood] : MOODS[c.mood] != null ? MOODS[c.mood] : c.mood;
      const how = [poseWords(c), c.mood ? mood : null, where, c.facing ? 'facing ' + c.facing : null]
        .concat(extraWords(c, sc.set)).filter(Boolean).join(', ');
      const coat = c.variant && !VARIANT_WHO[c.who] ? ', coat ' + c.variant : '';
      if (how || coat) bits.push('(' + how + (c.size && c.size !== 1 ? ', size ×' + c.size : '') + coat + ')');
      return bits.join(' ');
    });
    parts.push(cast.length ? 'Cast: ' + cast.join('; ') + '.' : 'No one in shot.');
    const o = sc.opts || {};
    const opts = Object.keys(o).map(k => optWords(sc.set, k, o[k], o, sc.cam)).filter(Boolean);
    if (opts.length) parts.push('Also: ' + opts.join('; ') + '.');
    const fx = (sc.fx || []).map(x => FX[x] || x);
    if (fx.length) parts.push('Effects: ' + fx.join(', ') + '.');
    return parts.join(' ');
  }
  function speaker(b) {
    // a chapter's own names for a speaker (chapter 3's tortie: "{Murmur}paw")
    if (!b.name && story.names && typeof story.names[b.who] === 'string') b = Object.assign({}, b, { name: story.names[b.who] });
    let base = SPEAKER[b.who] || b.who || 'Someone';
    if (VARIANT_SPEAKER[b.who] && b.variant) base = VARIANT_SPEAKER[b.who][b.variant] || base;
    return b.name ? b.name + ' (' + base + ')' : base;
  }
  function kindWord(k) { return k === 'shout' ? ', shouting' : k === 'whisper' ? ', whispering' : k === 'think' ? ', thinking' : k && k !== 'say' ? ', ' + k : ''; }
  /* The speaker's variant comes from the cast: the nth balloon from a who is the nth of them. */
  function withVariants(f, list) {
    const cast = (f.scene && f.scene.cast) || [], nth = {};
    return list.map(b => {
      if (typeof b === 'string') b = { text: b };
      const k = nth[b.who] = nth[b.who] == null ? 0 : nth[b.who] + 1;
      const mine = cast.filter(c => c && c.who === b.who);
      const m = mine[k] || mine[0];
      return Object.assign({}, b, { variant: b.variant || (m && m.variant) });
    });
  }
  function fact(f) {
    if (Array.isArray(f)) return { a: f[0], b: f[1] };
    return f || {};
  }
  function factLabel(f, set) {
    const x = fact(f);
    const notes = [];
    if (x.table) notes.push('from the ' + x.table + 's');
    if (x.groups != null || x.per != null) notes.push('pictured as ' + (x.groups != null ? x.groups : '?') + ' × ' + (x.per != null ? x.per : '?'));
    // (chapter 10: in a lesson of every Count mixed, each fact is drawn as its own Count)
    if (mixedSet(set)) notes.push('drawn as ' + mixedPicture(x, set));
    else if (x.picture) notes.push(pictureWords(x.picture, set));
    // (chapter 7: in a cheeks picture its own cats are cheeks, a pair in a row one face)
    const cheeks = set && set.picture && /^cheeks/.test(set.picture.kind || '');
    if (Array.isArray(x.who) && x.who.length) notes.push(cheeks ? 'drawn as ' + cheekWords(x.who) : x.who.every(c => c && c.who === 'sprinkle') ? 'Sprinkle’s own forepaws in the picture' : 'its own cats in the picture');
    // (chapter 8: on the paws, `lit` counts paws, four to a cat)
    if (x.lit && set && set.thing === 'paw' && set.table === 4 && x.lit % 4 === 0) notes.push('its first ' + numWord(x.lit / 4) + ' cats’ paws lit as it is asked (' + x.lit + ')');
    // (chapter 10: on the clutches, `lit` counts dragonets, seven to a clutch)
    else if (x.lit && set && set.thing === 'dragonet' && set.table === 7 && x.lit % 7 === 0) notes.push('its first ' + numWord(x.lit / 7) + ' clutches lit as it is asked (' + x.lit + ')');
    else if (x.lit) notes.push('the first ' + x.lit + ' lit as it is asked');
    if (x.light) notes.push(x.light === 'rows' ? 'lit a row at a time as it is asked' : x.light === 'tuck' ? 'the hop and the tuck as it is asked' : 'lit a group at a time as it is asked');
    // (chapter 10: an empty prompt is no words at all: the frame's own balloons, said again over it, ask it)
    if (Array.isArray(x.prompt) && !x.prompt.length) notes.push('no words of its own: the frame’s balloons ask it' + (x.retryPrompt != null && x.retryPrompt !== true ? ', and its own question on its retry' : ''));
    else if (x.prompt != null) notes.push('its own question' + (x.retryPrompt === true ? ', kept on its retry' : x.retryPrompt ? ', and another of its own on its retry' : ''));
    else if (x.retryPrompt != null && x.retryPrompt !== true) notes.push('its own question on its retry');
    if (x.right != null) notes.push('its own lines after a right answer');
    if (x.rightAgain != null) notes.push('its own lines after a right retry');
    if (x.rightPicture) notes.push('then regrouped');
    if (x.check) notes.push('a check: a right one never makes the fact hard');
    // chapter 5
    if (x.miss != null || x.missLast != null) notes.push('its own lines after a miss');
    if (x.shows) notes.push('her answers scratched in the sand with its line');
    return x.a + ' × ' + x.b + (notes.length ? ' (' + notes.join('; ') + ')' : '');
  }
  // chapter 9: a dose's mark, by its set's `thing` (dew drops, rubs, flaps)
  const DOSE_MARK = { drop: 'round dewdrops, each with a highlight', rub: 'small paw marks (a pad and four toes)', flap: 'short plain strokes' };
  function pictureWords(p, set) {
    if (!p) return '';
    const grit = p.kind === 'grit' || (p.kind === 'mud' && p.ground === 'grit');
    // chapter 5: fish (in pairs, or on strings), the raft's logs from underneath, herons scratched in the mud
    const five = p.kind === 'fish' ? (p.layout === 'strings' ? 'fish on reed strings' : 'fish in pairs') : p.kind === 'bumps' ? 'the raft from underneath, bump stars on its logs' : p.kind === 'herons' ? 'little herons scratched in the mud' :
      // chapter 6: Sleet's roll call
      p.kind === 'roll' ? 'little dragonets in a row, all alike and pale, three HERE!s lettered over every head' :
      // chapter 7: cheeks close up, six whiskers each (the doubling questions open with every top row lit); nights of marks
      p.kind === 'cheeks' ? 'cheeks close up, six whiskers on each: three on top, three below' :
      p.kind === 'cheeks-top' ? 'cheeks close up, six whiskers on each, every cheek’s top three lit from the start' :
      // chapter 8: the twenty-eight's marks two and two (`layout: 'pairs'`); the Barking Field's four animals
      p.kind === 'marks' && p.layout === 'pairs' ? 'nights side by side, scratched in the ' + (p.ground === 'mud' ? 'mud' : 'sand') + ', each night’s short upright marks in pairs, two and two with a gap between, and nothing else' :
      p.kind === 'marks' ? 'nights side by side, scratched in the ' + (p.ground === 'mud' ? 'mud' : 'sand') + ', a cluster of short upright marks for each night and nothing else' :
      p.kind === 'dogs' ? 'the animals of the set’s own cast side-on, standing, four paws each (a dog’s paws marked so they light), lit an animal at a time' :
      // chapter 9: Thymeleaf's doses in rows of eight, each row four and four; Mizzle's twigs of acorns
      p.kind === 'dose' ? 'rows of eight ' + (DOSE_MARK[set && set.thing] || 'marks') + ', each row four and four with a gap, stacked top to bottom, lit a mark at a time' :
      p.kind === 'acorns' ? 'short twigs side by side, each with a leaf or two and eight acorns in two clusters of four, lit an acorn at a time' : null;
    const bits = [five || (p.kind === 'prey' ? 'prey' : grit ? 'forepaws scratched in the roof’s grit' : p.kind === 'mud' ? 'forepaws drawn in the mud' : 'cats')];
    if (p.layout === 'rows' && p.kind !== 'dose') bits.push('in rows');
    if (p.thought) bits.push('in a thought cloud');
    return bits.join(' ');
  }
  // a prompt's lines: balloons with their speakers, and (kind 'caption') narration in a caption box
  function balloonLines(list, f) {
    return withVariants(f || {}, asList(list)).map(b => b.kind === 'caption' ? '  - *Caption*: ' + q(b.text)
      : '  - **' + speaker(b) + '**' + kindWord(b.kind) + ': ' + (b.lang === 'es' ? esSaid(b.text) : '“' + q(b.text) + '”'));
  }
  /* Chapter 12: a set's `echo`, in a line under its set: Chispapaw's Spanish after a right answer (a Counts set's first, or
   * the pairs it lists; a take set's listed problems right or helped, never a twin, or its first right in every column). */
  function echoWords(set, take) {
    const ec = set && set.echo, lines = ec && typeof ec === 'object' ? asList(ec.lines).filter(l => l && typeof l.text === 'string') : [];
    if (!lines.length) return null;
    const pairs = Array.isArray(ec.on) ? ec.on.map(p => (Array.isArray(p) ? p : [p && p.a, p && p.b])) : [];
    const x0 = ec.on === 'first' ? (take ? null : [7, 8]) : pairs[0];
    const x = x0 ? { a: x0[0], b: x0[1], answer: take ? x0[0] - x0[1] : x0[0] * x0[1] } : null;
    const said = l => (l.lang === 'es' ? (x ? esSaid(l.text, x) : '*[es]* ' + q(l.text)) : '“' + q(E.esMarks(l.text, x)) + '”') + (l.who !== lines[0].who ? ' (' + (SPEAKER[l.who] || l.who) + ')' : '');
    const who = SPEAKER[lines[0].who] || lines[0].who || 'Chispapaw', sign = take ? ' − ' : ' × ', list = pairs.map(p => p[0] + sign + p[1]).join(', ');
    if (ec.on === 'first') return '- ' + who + ' echoes ' + (take ? 'the first problem right in every column' : 'her first right answer (a retry counts)') + ' in Spanish, once: ' + lines.map(said).join(', then ') +
      (x ? ' for ' + x.a + sign + x.b : '') + (take ? '' : ', after the line that answer earned, all waiting for Next') + '.';
    return '- After ' + list + (take ? ', right or helped (never its twin)' : ', right') + ', ' + who + ' echoes it in Spanish: ' + lines.map(said).join(', then ') + '.';
  }
  /* The take-aways kit (docs/take-aways.md, sections 1 to 3 and 8): a Counts frame whose set is a take set
   * (`op: '-'`) is boarded in the Counts frame's place, its problems as she sees them written ("254 − 131"),
   * never as a Count. Only a take set reaches this, so chapters 1 to 11 board as they always have. */
  function takeSetOf(f) {
    if (!f || !f.counts) return null;
    const own = (story.counts || {})[f.counts.set], found = own || E.countsSet(f.counts.set, story, siblings());
    return found && found.op === '-' ? { set: found, own: !!own } : null;
  }
  function takesWords(f) {
    const { set, own } = takeSetOf(f), teacher = set.teacher || 'tallyheart';
    const kit = k => (set.lines && set.lines[k] != null ? set.lines[k] : E.TAKE_LINES[k]);
    const fill = (t, nums) => q(E.takeFill(String(t == null ? '' : t), nums || {}));
    const first = v => (Array.isArray(v) ? v.find(x => typeof x === 'string' && x.trim()) || '' : typeof v === 'string' ? v : '');
    const says = t => (teacher === 'caption' ? '  - *Caption*: ' + t : '  - **' + (SPEAKER[teacher] || 'Tallyheart') + '**: “' + t + '”');
    const lines = list => asList(list).map(b => (typeof b === 'string' ? says(q(b)) : balloonLines([b], f)[0]));
    const facts = asList(set.facts).map(x => (Array.isArray(x) ? { a: x[0], b: x[1] } : x || {}));
    const reg = x => (E.TAKE_REGROUP.includes(x.regroup) ? x.regroup : E.TAKE_REGROUP.includes(set.regroup) ? set.regroup : 'hers');
    const sum = x => x.a + ' − ' + x.b;
    const label = x => {
      const notes = [];
      if (x.picture && x.picture.kind !== (set.picture || {}).kind) notes.push('drawn as ' + TAKE_PICTURE[x.picture.kind === 'marks' ? 'marks' : 'store']);
      if (Array.isArray(x.prompt) && !x.prompt.length) notes.push('no words of its own');
      else if (x.prompt != null) notes.push('its own question');
      if (x.right != null) notes.push('its own lines once it is right in every column');
      const how = reg(x) === 'show' ? ', worked' : reg(x) === 'tap' ? ', tapped' : '';
      return { text: sum(x) + how + (notes.length ? ' (' + notes.join('; ') + ')' : ''), more: !!(how || notes.length) };
    };
    const labels = facts.map(label);
    const list = labels.map((l, i) => l.text + (i < labels.length - 1 ? (l.more ? '; ' : ', ') : '')).join('');
    if (!own) return '**Then the take-aways** `' + f.counts.set + '`, another chapter’s, run here as it is there (see that chapter’s storyboard): ' + list + '. On to ' + f.counts.next + '.';
    const out = ['**Then the take-aways** `' + f.counts.set + '` (' + TAKE_PICTURE[(set.picture || {}).kind === 'marks' ? 'marks' : 'store'] + '): ' + list + '.'];
    // what each problem needs, by the engine's own kinds (and the two flags the chapters' rules read)
    const kinds = [];
    facts.forEach(x => {
      const p = E.takePlan(x.a, x.b);
      if (!p) { kinds.push({ k: 'not one the kit asks (the guards refuse it)', list: [sum(x)] }); return; }
      const k = E.takeKind(p), fl = E.takeFlags(p), flags = [fl.noHundreds ? 'no hundreds left' : '', fl.leavesZero ? 'leaves a zero' : ''].filter(Boolean);
      const g = kinds.find(o => o.k === TAKE_KIND_WORDS[k]) || kinds[kinds.push({ k: TAKE_KIND_WORDS[k], list: [] }) - 1];
      g.list.push(sum(x) + (flags.length ? ' [' + flags.join(', ') + ']' : ''));
    });
    if (kinds.length) out[0] += ' Each needs: ' + kinds.map(o => o.k + ' (' + o.list.join(', ') + ')').join('; ') + '.';
    if (set.teach) out[0] += ' Its step: `' + set.teach + '` (' + (TAKE_STEP_WORDS[set.teach] || set.teach) + '); once it is finished, Count the store may ask that step.';
    if (set.warm === true) out[0] += ' First a made warm-up, new each time: a two-digit take-away with a row to spread (a twin of 43 − 16), never one of this chapter’s answers, introduced “' + fill(first(kit('warmIntro'))) + '”';
    const modes = facts.map(reg);
    if (modes.includes('show')) out[0] += ' A worked one is ' + (SPEAKER[teacher] || 'Tallyheart') + '’s: before she types a column that needs a spread, the picture spreads as the lines say why; in a column that needs none, its line in full.';
    if (modes.includes('tap')) out[0] += ' In a tapped one, the zone to spread from glows and the keypad waits until she taps it.';
    out[0] += ' She writes each answer under the column a digit at a time, ones first, with OK after each; a slip gets that column scratched out in the sand (the help writes its digit, and the rest is hers), ' +
      (set.twins === false ? 'and a helped one does not come back (`twins: false`).' : 'and a helped one comes back as a twin (new numbers, the same shape) ' + numWord(E.REQUEUE_GAP || 2) + ' problems later.') + ' On to ' + f.counts.next + '.';
    // (the kit v0.4, decision 57: a set's own marks page, before its first problem with a spread to make)
    if (set.marks && typeof set.marks === 'object') out.push('', marksPageWords(set, facts, lines));
    const more = [];
    const bare = facts.find(x => x.prompt == null);
    if (bare) more.push('- Asking a problem with no words of its own: its column alone, and Read to me says it in words (“' + fill(first(kit('ask')), { a: bare.a, b: bare.b }) + '”).');
    facts.forEach(x => {
      if (x.prompt != null && !(Array.isArray(x.prompt) && !x.prompt.length)) more.push('- Asking ' + sum(x) + ':', ...lines(x.prompt));
      if (x.right != null) more.push('- After ' + sum(x) + ', right in every column the first time:', ...lines(x.right));
    });
    // (chapter 12: a set's echo, Chispapaw's Spanish at the problem's end, after the kit's end line)
    const ew = echoWords(set, true);
    if (ew) more.push(ew);
    if (Array.isArray(set.praise)) more.push('- Praise for a problem right in every column the first time, in turn (a blank one says nothing): ' + set.praise.filter(p => typeof p === 'string' && p.trim()).map(p => '“' + q(p) + '”').join(', '));
    if (set.lines && typeof set.lines === 'object') Object.keys(set.lines).forEach(k => {
      const v = set.lines[k], forms = v && typeof v === 'object' && !Array.isArray(v) ? Object.keys(v).map(fk => fk + ': “' + q(v[fk]) + '”').join(', ') : asList(v).map(x => '“' + q(x) + '”').join(', ');
      more.push('- In place of the kit’s `' + k + '`: ' + forms + '.');
    });
    if (set.done) more.push('- At the end: “' + q(set.done) + '”');
    else if (set.done === '' || set.done === null) more.push('- No closing line: the next frame goes straight on.');
    if (more.length) out.push('', more.join('\n'));
    return out.join('\n');
  }
  /* The kit v0.4's marks page (decision 57; docs/take-aways.md, section 1a): a take set's `marks` ({ lines, one, above }),
   * shown by the take page before the first problem that asks a spread move (the made warm-up's, when it has one) while
   * she has no marks yet; its lines, after-lines and labels as the engine gives them (E.takeMarksPage). */
  function marksPageWords(set, facts, lines) {
    const page = typeof E.takeMarksPage === 'function' ? E.takeMarksPage(set, null)
      : { lines: asList(set.marks.lines), options: [{ style: 'one', label: 'A little 1 in front' }, { style: 'above', label: 'The new number on top' }], after: { one: asList(set.marks.one), above: asList(set.marks.above) } };
    const label = st => (page.options.find(o => o.style === st) || { label: st }).label;
    const spread = x => { const p = E.takePlan(x.a, x.b); return !!p && E.takeKind(p) !== 'none'; };
    const firstSpread = facts.find(spread);
    const when = set.warm === true ? 'before the made warm-up’s prompt (it always has a row to spread)' : firstSpread ? 'before ' + firstSpread.a + ' − ' + firstSpread.b + '’s prompt, the first problem here with a spread to make' : null;
    return ['**Then the marks page** (the kit’s; ' + (when ? when + ', while she has no marks yet: her pick is saved as her marks, and she can change it on the Hollow’s shelf, My marks' : 'it never shows here: no problem in this set has a spread to make') + '): two picture buttons in the column’s place, 43 − 16 done in each style, “' +
      label('one') + '” on the left and “' + label('above') + '” on the right. The lines come one balloon at a time, each picture glowing with its own, and the buttons go live after the last; a tap picks (the button pressed) and letters that pick’s line, and she can switch while it shows; its reading time, or a tap on the stack or the panel, goes on. Read to me says the lines, then the labels.',
    '- Its lines, in order:', ...lines(page.lines),
    '- After “' + label('one') + '”:', ...lines(page.after.one),
    '- After “' + label('above') + '”:', ...lines(page.after.above)].join('\n');
  }
  function countsWords(f) {
    // chapter 5: a Counts frame may run another chapter's set (the roof, found later: chapter 4's riddle)
    const own = (story.counts || {})[f.counts.set], found = own || E.countsSet(f.counts.set, story, siblings()), set = found || {};
    if (!found) return '**Then the Counts lesson** `' + f.counts.set + '`, another chapter’s, run here as it is there (see that chapter’s storyboard). On to ' + f.counts.next + '.';
    const facts = (set.facts || []).map(x => factLabel(x, set)).join(', ');
    // (chapter 8: the paws of the 4s are the table-4 picture as drawn since chapter 1, no `kind`)
    // (chapter 9: the 8s' legs are spiders, from above, keyed on `thing: 'leg'`, no `kind`)
    // (chapter 10: the 7s are clutches, keyed on `thing: 'dragonet'`, no `kind`)
    const pic = set.picture ? ', ' + pictureWords(set.picture, set) : set.thing === 'paw' ? ', cats side-on, standing, four paws each, five to a row, lit a cat at a time' :
      set.thing === 'leg' ? ', spiders from above, eight legs each, four on each side, five to a row with space between, never touching, lit a leg at a time (a spider’s left four, then her right four)' :
      set.thing === 'dragonet' ? ', ' + CLUTCHES + ', lit a dragonet at a time (a clutch’s top four, then its bottom three)' : '';
    // (chapter 10: a lesson of every Count mixed, each fact in its own Count's picture: the Moon Ferry's)
    const mixed = mixedSet(set);
    const out = ['**Then the Counts lesson** `' + f.counts.set + '`' + (own ? '' : ', another chapter’s, run here as it is there') + ' (' + (mixed ? 'every Count mixed, each fact in its own Count’s picture' : (set.things || 'things') + pic) + '): ' + facts + '.'];
    // a line the set's teacher says; in a set nobody speaks in (`teacher: 'caption'`), a caption
    const silent = set.teacher === 'caption', teacherSays = t => (silent ? '  - *Caption*: ' + t : '  - **' + (SPEAKER[set.teacher] || 'Tallyheart') + '**: “' + t + '”');
    const pairs = list => asList(list).map(x => fact(x).a + ' × ' + fact(x).b);
    const altIsList = set.warmHard && Array.isArray(set.warmHard.alt) && (Array.isArray(set.warmHard.alt[0]) || (set.warmHard.alt[0] && typeof set.warmHard.alt[0] === 'object'));
    if (set.warmHard && altIsList) {
      out[0] += ' It adapts: a ' + (set.warmHard.table || set.table) + 's fact that was hard for her last time takes question ' + ((set.warmHard.at || 0) + 1) +
        (set.avoid ? ' (never ' + pairs(set.avoid).join(' or ') + ', either way round, while there is another)' : '') +
        ', and when the opener is one of her hardest facts or that fact’s pair, the first of ' + pairs(set.warmHard.alt).join(', ') + ' that is neither opens instead.';
    } else if (set.warmHard) out[0] += ' It adapts: a ' + (set.warmHard.table || set.table) + 's fact that was hard for her last time takes question ' + ((set.warmHard.at || 0) + 1) +
      (set.warmHard.avoid ? ' (never ' + pairs(set.warmHard.avoid).join(' or ') + ', either way round)' : '') + (set.warmHard.alt ? ', and its twin becomes ' + fact(set.warmHard.alt).a + ' × ' + fact(set.warmHard.alt).b : '') + '.';
    // chapter 5: a set's own `light`, and a Counts frame that says none of its lines again
    if (set.light === 'tuck') out[0] += ' Every question it asks first, and every retry, plays the two steps in its picture without a word: all ten claws lit on every cat (the hop), one curling in on each (the tuck), then unlit, and she types. A question lent to fill a gap shows the still picture.';
    else if (set.light) out[0] += ' Its picture lights a ' + (set.light === 'rows' ? 'row' : 'group') + ' at a time as each question is asked.';
    // (worded from the set's first fact: a fact with its own question is asked in it and read first, so only
    // a miss there counts as hard; a check is never timed; only a fact with neither is asked in the engine's
    // words and timed on itself)
    if (f.counts.intro === false) {
      const first = fact(asList(set.facts)[0]), own = first.prompt != null && first.prompt !== false;
      out[0] += ' None of this frame’s own lines is said again over the first question: ' +
        (own ? 'it is asked in its own words' : 'it is asked in the engine’s own words') +
        (first.check ? ', and as a check it is never timed.' : own ? ', read first, so only a miss there counts as hard.' : ', and timed on itself.');
    }
    // chapter 6: a set's own cast in the places of its picture (ReedClan's watchers), the questions it lends included when they are asked as its own
    if (Array.isArray(set.who) && set.who.length) out[0] += ' Its picture has its own cast in the places, left to right: ' +
      set.who.map(c => (c && (c.who === 'clancat' || c.who === 'reedclan') ? (c.who === 'clancat' ? 'a Clan cat' : 'a ReedClan cat') + (c.variant ? ' (coat ' + c.variant + ')' : '') : whoWords(c || {}))).join(', ') +
      (set.fillPicture === 'borrower' ? ', the questions it lends included' : '') + '.';
    // where a miss is scratched, and who keeps the count (chapter 3's keys; a set without them reads as chapter 2's)
    const GROUND = { sand: 'on the sand', earth: 'in the earth', mud: 'in the mud', grit: 'in the roof’s grit', log: 'on a log of the raft' };
    // chapter 5: a help that scratches nothing (`help: 'picture'`: the set's own picture lit a group at a time);
    // the 9s' help in two phases; a log of the raft; a set nobody swipes in
    // (chapter 7: nights of marks light a night at a time as the teacher hops; the 6s are scratched three and three)
    const marks = set.picture && set.picture.kind === 'marks';
    const missWords = set.help === 'picture' && marks ? 'a miss gets the set’s own picture lit a night at a time, ' + (set.helpCounter === 'you' ? 'the player keeping the count,' : (SPEAKER[set.teacher] || 'Tallyheart') + ' hopping it,') :
      // (chapter 8: the field's four animals light an animal at a time, their teacher hopping it by fours)
      set.help === 'picture' && set.picture && set.picture.kind === 'dogs' ? 'a miss gets the set’s own picture lit an animal at a time, ' + (SPEAKER[set.teacher] || 'Tallyheart') + ' hopping it by ' + (set.table || 4) + 's,' :
      // (chapter 9: the doses light a row of eight at a time, the dew's in her own count (nobody speaks there), the remedy's in its teacher's; Mizzle's twigs a twig at a time)
      set.help === 'picture' && set.picture && set.picture.kind === 'dose' ? 'a miss gets the set’s own picture lit a row at a time, ' + (set.teacher === 'caption' || set.helpCounter === 'you' ? 'the player keeping the count by eights,' : (SPEAKER[set.teacher] || 'Tallyheart') + ' counting it by eights,') :
      set.help === 'picture' && set.picture && set.picture.kind === 'acorns' ? 'a miss gets the set’s own picture lit a twig at a time, ' + (SPEAKER[set.teacher] || 'Tallyheart') + ' hopping it by eights,' :
      set.help === 'picture' ? 'a miss gets the set’s own picture lit a group at a time, the player keeping the count,' :
      // (chapter 10: every Count mixed, on a log: each fact's own Count scratched and hopped in its own steps)
      mixed && set.ground && !set.helpCounter ? 'a miss gets the fact’s own Count scratched ' + (GROUND[set.ground] || 'on the sand') + ' and hopped together in its own steps (' + mixedSteps(set) + '),' :
      set.ground || set.helpCounter ? 'a miss gets the count scratched ' + (GROUND[set.ground] || 'on the sand') +
      (set.helpCounter === 'you' ? ', ' + (set.ground === 'log' ? 'the player scratching and keeping the count herself' : (SPEAKER[set.teacher] || 'the teacher') + ' swiping and the player keeping the count') : '') + ',' :
      set.table === 9 ? 'a miss gets the sand count in two steps (two swipes for every cat, hopped by tens; then one line rubbed out of every pair, stepping back by ones)' :
      set.table === 6 ? 'a miss gets the sand count (six marks for every ' + (set.unit || 'group') + ', scratched three and three: two short rows of three, one above the other)' :
      // (chapter 8: the 4s are scratched two and two, a gap between the pairs, and hopped by fours from the first)
      set.table === 4 ? 'a miss gets the sand count (four marks for every ' + (set.unit || 'group') + ', scratched two and two with a gap between the pairs, hopped by fours from the first)' :
      // (chapter 9: the 8s are scratched four and four, a gap between the fours, and hopped by eights from the first)
      set.table === 8 ? 'a miss gets the sand count (eight marks for every ' + (set.unit || 'group') + ', scratched four and four with a gap between the fours, hopped by eights from the first)' :
      // (chapter 10: the 7s are scratched four and three, a gap between, and hopped by sevens from the first)
      set.table === 7 ? 'a miss gets the sand count (seven marks for every ' + (set.unit || 'group') + ', scratched four and three with a gap between, hopped by sevens from the first)' : 'a miss gets the sand count';
    out[0] += ' She types each answer on the keypad; ' + missWords + ' and comes back two questions later' +
      (set.fillFrom ? ' (the questions in between come from `' + set.fillFrom + '`' + (set.fillOrder === 'easiest' ? ', the easiest first' : '') +
        ', never a pair asked already while there is another, each asked ' + (set.fillPicture === 'borrower' ? 'as this lesson’s own question, in its picture and its voice' :
        'in that lesson’s picture and ' + (set.fillVoice === 'borrower' ? 'this lesson’s own voice' : 'words')) +
        (set.fillIntro ? ' after “' + q(set.fillIntro) + '”' : '') + ')' : set.fillOrder === 'easiest' ? ' (the questions in between are the easiest of her right answers in this lesson, not the latest)' : '') + '. On to ' + f.counts.next + '.';
    const lines = [];
    // (chapter 7: a set's own words for a question with none of its own)
    if (typeof set.prompt === 'string' && set.prompt) lines.push('- Asking a question with no words of its own:', teacherSays(q(set.prompt)));
    (set.facts || []).forEach(x => {
      x = fact(x);
      if (Array.isArray(x.prompt) && !x.prompt.length) lines.push('- Asking ' + x.a + ' × ' + x.b + ': no more words (the frame’s own balloons, said again over the question, ask it).');
      else if (x.prompt != null) {
        lines.push('- Asking ' + x.a + ' × ' + x.b + ':');
        if (typeof x.prompt === 'string') lines.push(teacherSays(q(x.prompt)));
        else lines.push(...balloonLines(x.prompt, f));
      }
      const rp = x.retryPrompt === true ? x.prompt : x.retryPrompt;
      if (rp != null && rp !== false) {
        lines.push('- Asking ' + x.a + ' × ' + x.b + ' again after a miss:');
        const again = set.againIntro || 'Here’s that one again.';
        if (typeof rp === 'string') lines.push(silent ? teacherSays(again) + '\n' + teacherSays(q(rp)) : teacherSays(again + ' ' + q(rp)));
        else lines.push(teacherSays(again), ...balloonLines(rp, f));
      }
      if (x.right != null) {
        lines.push('- After ' + x.a + ' × ' + x.b + ', right the first time' + (x.rightPicture ? ' (the picture regroups as ' + (x.rightPicture.groups) + ' × ' + (x.rightPicture.per) + ')' : '') + ':');
        lines.push(...balloonLines(x.right, f));
      }
      const ra = x.rightAgain === true ? x.right : x.rightAgain != null ? x.rightAgain : (x.rightPicture ? x.right : null);
      if (ra != null && ra !== false) {
        lines.push('- After ' + x.a + ' × ' + x.b + ', right on its retry' + (x.rightPicture ? ' (regrouped again)' : '') + ':');
        lines.push(...balloonLines(asList(ra).map(b => (typeof b === 'string' ? { text: b } : b)), f));
      }
      // chapter 5: a fact's own lines after a miss, and the answers scratched in the sand with its lines
      if (x.miss != null) lines.push('- After a miss on ' + x.a + ' × ' + x.b + ', when it comes back:', teacherSays(q(x.miss)));
      if (x.missLast != null) lines.push('- After a miss on ' + x.a + ' × ' + x.b + ', when it does not:', teacherSays(q(x.missLast)));
      if (x.shows) lines.push('- With the lines after ' + x.a + ' × ' + x.b + ', right the first time or missed: her answers scratched in the sand, ' + pairs(x.shows.of).map(pr => pr.split(' × ').reduce((a, b) => a * b)).concat([x.a * x.b]).join(' and ') +
        ' (' + (pairs(x.shows.of).length ? pairs(x.shows.of).join(', ') + ' only once she has answered it right with no ask of it still to come; ' : '') + '`{also}` in those lines is “' + q(x.shows.also || '') + '” when they are all there, and nothing when not).');
    });
    // (chapter 12: a set's echo, Chispapaw's Spanish after a right answer)
    const ew = echoWords(set, false);
    if (ew) lines.push(ew);
    if (set.againIntro) lines.push('- Before a question comes back: “' + q(set.againIntro) + '”');
    if (set.helpIntroNotFive) lines.push('- After a miss that ends in neither a five nor a zero: “' + q(set.helpIntroNotFive) + '”');
    if (set.helpIntroNotTen) lines.push('- After a miss that doesn’t end in a zero: “' + q(set.helpIntroNotTen) + '”');
    // chapter 5: the 9s' openings, in the order they are checked; who says a help's first line when the teacher doesn't
    if (set.helpIntroTens) lines.push('- After a miss that is the tens (the hop without the tuck): “' + q(set.helpIntroTens) + '”');
    if (set.helpIntroOneTuck) lines.push('- After a miss that is the tens less one (one claw tucked, for two cats or more): “' + q(set.helpIntroOneTuck) + '”');
    if (set.helpIntroNotNine) lines.push('- After a miss whose two numbers don’t make nine, once the lesson has shown her that they should (in the Training Hollow, always): “' + q(set.helpIntroNotNine) + '”');
    if (set.helpSays) lines.push('- The help’s first line is said by ' + (SPEAKER[set.helpSays] || set.helpSays) + (set.helpIntro ? ': “' + q(set.helpIntro) + '”' : '.'));
    if (silent) lines.push('- Nobody speaks in this set: every line the engine words itself (the question, a retry’s opening, the lines after a miss) is lettered as a caption.');
    if (set.label || set.hollowThings) lines.push('- In the Training Hollow: ' + [set.label ? 'its button reads “' + q(set.label) + ' · the ' + set.table + 's”' : '', set.hollowThings ? 'Tallyheart calls it “' + q(set.hollowThings) + '”' : ''].filter(Boolean).join(', and ') + '.');
    if (set.done) lines.push('- At the end: “' + q(set.done) + '”');
    else if (set.done === null) lines.push('- No closing line: the next frame goes straight on.');
    if (lines.length) out.push('', lines.join('\n'));
    return out.join('\n');
  }
  function skipWords(f) {
    const s = f.skip, t = s.table || 2, g = s.groups || 5;
    const nums = Array.from({ length: g }, (_, i) => (i + 1) * t).join(', ');
    const who = (s.who || []).map(c => (c.who === 'clancat' ? 'a Clan cat' + (c.variant ? ' (coat ' + c.variant + ')' : '') : whoWords(c))).join(', ');
    // chapter 4: an instruction under the panel, the hidden button's own words, a number that stays on its page
    const more = (s.prompt ? ' The instruction under the panel: “' + q(s.prompt).replace(/\*\*/g, '') + '”' : '') + (s.label ? ' For VoiceOver, a hidden button: “' + q(s.label) + '”' : '');
    const turns = ' The ' + (g === 1 ? 'tap' : 'last tap') + ' turns the page to ' + s.next + (s.carry === false ? ', which does not show the number' : ', which shows the ' + (g * t)) + '.';
    // chapter 5: the tuck, her paws aboard, nine claws in the log, the mud count
    if (s.tuck) {
      const start = g * 10, back = Array.from({ length: g }, (_, i) => start - i - 1).join(', ');
      return '**Then she tucks a claw in on each cat** (the skip-count, backwards): the ' + numWord(g) + ' cats sit up with all ' + start + ' claws lit and a big ' + start + ' over them; ' + g + ' taps, one on each cat in turn (the next one glows; a tap anywhere else makes it wiggle), each curling one of its claws in (the claw goes dark) and stepping the number back by one: ' + back + '. No number is ever shown under a cat, only the big one over them all. Nothing can be got wrong, and nothing is logged.' +
        (who ? ' In the picture, left to right: ' + who + '.' : '') +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : ' The last tap turns the page to ' + s.next + ', which shows the ' + (start - g) + '.') +
        (s.keep ? ' The picture stays on the pages after it, up to the lesson: nine claws lit and one dark on every cat, ' + (start - g) + ' over them, and still no number under any cat.' : '') + more;
    }
    if (s.paws === 'board') {
      const words = ['', 'One.', 'Two.', 'Three.', 'Four.', 'Five.', 'Six.'];
      return '**Then she steps aboard, a paw at a time** (the skip-count, in words): ' + g + ' taps, her own ' + numWord(g) + ' paws at the edge of the rocks (in play they take the panel; the next one glows; a tap anywhere else makes it wiggle), each setting that paw down on the logs, the raft dipping, while ' +
        (SPEAKER[s.teacher] || 'Tallyheart') + ' counts it: ' + Array.from({ length: g }, (_, i) => words[i + 1] || String(i + 1)).join(' ') + ' Nothing can be got wrong, and nothing is logged.' + turns + more;
    }
    if (s.paws === 'log') {
      const steps = asList(s.steps).map(st => 'from tap ' + st.from + ', ' + Object.keys(st.opts || {}).map(k => optWords(f.scene && f.scene.set, k, st.opts[k], st.opts) || (k + ': ' + JSON.stringify(st.opts[k]))).join('; ') + (st.sfx ? ' (lettered along the top: ' + q(st.sfx) + ')' : ''));
      return '**Then she digs her claws into the log, one at a time** (the skip-count; this scene stays on screen, drawn again at every tap): ' + g + ' taps, anywhere, each digging one claw into the wood and putting the next number in her own thought: ' + nums + '. The tenth claw stays tucked. Nothing can be got wrong, and nothing is logged.' +
        (steps.length ? ' As she taps, the scene changes: ' + steps.join('; ') + '.' : '') + turns + more;
    }
    if (s.paws === 'mud') {
      const each = (s.who || []).map(c => (SPEAKER[c.who] || whoWords(c)) + (c.when ? ' (only if ' + whenWords(c.when) + ')' : ''));
      const sure = (s.who || []).filter(c => !c.when).length, most = (s.who || []).length;
      return '**Then she lights a forepaw for everyone found** (the skip-count, by ' + t + 's): seven little forepaws drawn in the mud (in play they take the panel); a tap for each of ' + each.join(', ') + ', so ' + (most > sure ? 'up to ' + numWord(most) : numWord(sure)) + ' taps (the next forepaw glows; a tap anywhere else makes it wiggle), each lighting its ' + numWord(t) + ' claw marks and putting the next number in ' +
        (SPEAKER[s.teacher] || 'the counter') + '’s balloon: ' + Array.from({ length: most }, (_, i) => (i + 1) * t).join(', ') + '. The other forepaws stay dark. Nothing can be got wrong, and nothing is logged. The last tap turns the page to ' + s.next +
        (s.carry === false ? ', which does not show the number.' : ', which shows the number she reached (' + Array.from({ length: most - sure + 1 }, (_, i) => (sure + i) * t).filter(n => n > t || sure > 1).join(', ').replace(/, ([^,]*)$/, ' or $1') + ').') + more;
    }
    // chapter 12: a count in Chispapaw's Spanish words (`lang: 'es'`), out loud, its English with the last tap, then Next
    if (s.lang === 'es') {
      const v = E.skipView(s, g), m = /^«([^»]*)»/.exec(v.count || ''), sp = m ? m[1] : '', by = SPEAKER[s.teacher] || 'Chispapaw';
      return '**Then the paw thing in ' + by + '’s Spanish** (the skip-count, by ' + t + 's): ' + q(sp) + ' (' + q(v.gloss || '') + '). ' + g + ' taps' +
        (s.paws === 'both' ? ', her own two forepaws patted down together each time (they glow; a tap anywhere else makes them wiggle), each lighting all ' + numWord(t) + ' claws' : '') +
        ' and putting the next number in ' + by + '’s balloon, out loud, in Spanish words lettered in italics (“' + q(E.skipView(s, 1).count.replace(/[«»]/g, '')) + '”, then “' + q(E.skipView(s, Math.min(2, g)).count.replace(/[«»]/g, '')) + '” …); Read to me says each number in the Spanish voice (with none, in English). With the last tap the English goes under it in parentheses, and the page waits for Next (a Spanish count never turns its own page). Nothing can be got wrong, and nothing is logged. On to ' + s.next +
        (s.carry === false ? ', which does not show the number' : ', which shows the ' + (g * t)) + '.' + more;
    }
    if (s.paws === 'both') {
      return '**Then she hops by ' + t + 's on both forepaws** (the skip-count): ' + g + ' taps, her own two forepaws patted down together each time (they glow; a tap anywhere else makes them wiggle), each lighting all ' + numWord(t) + ' claws' + (t === 9 ? ' (one claw stays tucked in)' : '') + ' and putting the next number in her own murmur: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) + more;
    }
    if (s.paws === 'pile') {
      return '**Then she hops by ' + t + 's on the pile of forepaws** (the skip-count): ' + g + ' taps, one for each friend (the next pair of forepaws glows; a tap anywhere else makes it wiggle), each lighting that friend’s ' + numWord(t) + ' claws and putting the next number in her own balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) + more;
    }
    // chapter 7: the back row's empty places, the whiskers on one cheek (the 3s), and cheeks (the 6s)
    const counter = s.teacher === 'player' ? 'her own' : (SPEAKER[s.teacher] || 'Tallyheart') + '’s';
    if (s.thing === 'gap') {
      return '**Then she counts the empty places** (the skip-count, by ' + t + 's): the back row close up on the earth, its ' + numWord(g) + ' empty pressed places among the pieces (in play they take the panel); ' + g +
        ' taps, one on each empty place in turn (the next one glows; a tap anywhere else makes it wiggle), each outlining it in gold and putting the next number under it and in ' + counter + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) + more;
    }
    if (s.thing === 'whisker' && t === 3) {
      const whose = asList(s.who).map(c => (c.who === 'player' ? 'your own' : (SPEAKER[c.who] || whoWords(c)) + '’s'))[0];
      return '**Then she counts the whiskers on one cheek** (the skip-count, by 3s): one cheek close up' + (whose ? ', ' + whose : '') + ', six whiskers in two rows of three (in play it takes the panel); ' + g +
        ' taps, a row at a time from the top (the next row glows; a tap anywhere else makes it wiggle), each lighting its three whiskers and putting the running total beside it and in ' + counter + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) +
        (s.keep ? ' The cheek stays on the plain pages after it, both rows lit, ' + nums.replace(/, ([^,]*)$/, ' and $1') + ' beside them.' : '') + more;
    }
    if (s.thing === 'whisker') {
      const cheeks = asList(s.who).length ? cheekWords(s.who) : '';
      return '**Then she counts by ' + t + 's on the cheeks** (the skip-count): ' + numWord(g) + ' cheeks close up in a row, ' + numWord(t) + ' whiskers on each, three on top and three below' + (cheeks ? ' (left to right: ' + cheeks + ')' : '') + '; ' + g +
        ' taps, one on each cheek in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting its whiskers, top row then bottom, and adding its running total under it and in ' + counter + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) +
        (s.keep ? ' The running totals stay under the cheeks on the plain pages after it.' : '') + more;
    }
    // chapter 8: one cat's paws a pair at a time (the 2s: her front pair, then her back pair; a four is two twos), and cats' paws by fours
    if (s.thing === 'paw' && t === 2) {
      const whose = asList(s.who).map(c => (c.who === 'player' ? 'your own' : (SPEAKER[c.who] || whoWords(c)) + '’s'))[0];
      return '**Then she counts one cat’s paws, a pair at a time** (the skip-count, by 2s): one cat close up' + (whose ? ', ' + whose : '') + ', side-on, standing, four paws plain at the bottom (in play the cat takes the panel); ' + g +
        ' taps, ' + (g === 2 ? 'the front pair, then the back pair' : 'a pair at a time') + ' (the next pair glows; a tap anywhere else makes it wiggle), each lighting its two paws and putting the running total under it and in ' + counter + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) +
        (s.keep ? ' The cat stays on the plain pages after it, both pairs of paws lit, ' + nums.replace(/, ([^,]*)$/, ' and $1') + ' under them.' : '') + more;
    }
    if (s.thing === 'paw') {
      return '**Then she counts by ' + t + 's on the cats’ paws** (the skip-count): ' + numWord(g) + ' cats side-on, standing, ' + numWord(t) + ' paws each (in play they take the panel); ' + g +
        ' taps, one on each cat in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting its ' + numWord(t) + ' paws and putting its running total under it and in ' + counter + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (who ? ' In the picture, left to right: ' + who + '.' : '') +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) +
        (s.keep ? ' The running totals stay under the cats on the pages after it.' : '') + more;
    }
    // chapter 9: one spider's legs a side at a time (the 4s: an eight is two fours), and spiders' legs by eights
    if (s.thing === 'leg' && t === 4) {
      return '**Then she counts one spider’s legs, a side at a time** (the skip-count, by 4s): one spider close up, from above, four legs on each side (in play she takes the panel); ' + g +
        ' taps, ' + (g === 2 ? 'one side, then the other' : 'a side at a time') + ' (the next side glows; a tap anywhere else makes it wiggle), each lighting its four legs and putting the running total beside it and in ' + counter + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) +
        (s.keep ? ' The spider stays on the plain pages after it, both sides lit, ' + nums.replace(/, ([^,]*)$/, ' and $1') + ' beside them.' : '') + more;
    }
    if (s.thing === 'leg') {
      return '**Then she counts by ' + t + 's on the spiders’ legs** (the skip-count): ' + numWord(g) + ' spiders from above, ' + numWord(t) + ' legs each, four on each side (in play they take the panel); ' + g +
        ' taps, one on each spider in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting her ' + numWord(t) + ' legs, four and four, and putting its running total under her and in ' + counter + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) +
        (s.keep ? ' The running totals stay under the spiders on the pages after it.' : '') + more;
    }
    // chapter 10: the clutches by 7s, and the clutch's forepaws (every `who` a dragonet: seven in one row, the ones she
    // never found soft grey shapes in the mist), counted in the voice of whoever keeps the count (Mama, by her variant)
    if (s.thing === 'dragonet' && t === 7) {
      return '**Then she counts by 7s on the clutches** (the skip-count): ' + numWord(g) + ' ' + CLUTCHES + ' (in play they take the panel); ' + g +
        ' taps, one on each clutch in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting its seven dragonets, the row of four and then the row of three, and putting its running total under it and in ' + counter + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) +
        (s.keep ? ' The running totals stay under the clutches on the pages after it.' : '') + more;
    }
    if (t === 5 && g > 1 && asList(s.who).length > 1 && asList(s.who).every(c => c && DRAGONETS.has(c.who))) {
      const keeper = ((f.scene && f.scene.cast) || []).find(c => c && c.who === s.teacher);
      const by = s.teacher === 'player' ? 'her own' : ((VARIANT_SPEAKER[s.teacher] || {})[(keeper && keeper.variant) || 1] || SPEAKER[s.teacher] || 'Tallyheart') + '’s';
      const each = asList(s.who).map(c => (c.shape ? 'a soft grey dragonet shape, faceless, in a wisp of mist, behind a misty grey forepaw whose five claws light pale silver' :
        (SPEAKER[c.who] || whoWords(c)) + ', small behind a raised forepaw of ' + (DRAGONET_SHE.has(c.who) ? 'her' : 'his') + ' own') + onlyIf(c.when));
      return '**Then she counts the clutch’s forepaws** (the skip-count, by 5s): ' + numWord(g) + ' forepaws raised in one row, the clutch in a row (in play they take the panel), one for each of these that is hers, in order: ' + each.join('; ') + '; ' + g +
        ' taps, one on each forepaw in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting its five claws and putting the running total in ' + by + ' balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) + more;
    }
    if (g === 1) {
      const whose = (s.who || []).map(c => SPEAKER[c.who] || whoWords(c)).join(', ');
      return '**Then she taps ' + (whose ? 'the forepaw ' + whose + ' holds up' : 'the one forepaw') + '** (one tap; the forepaw glows, and a tap anywhere else makes it wiggle): its ' + numWord(t) + ' claws light and a big ' + t + ' grows over them. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) + more;
    }
    if (t === 10) {
      return '**Then she counts by 10s** (the skip-count): ' + g + ' taps, one on each cat in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting the ten claws on its two forepaws and adding its running total: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (who ? ' In the picture, left to right: ' + who + '.' : '') +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) +
        (s.keep ? ' The running totals stay under the cats on the pages after it, up to the lesson.' : '') + more;
    }
    if (s.paws === 'own') {
      return '**Then she hops by ' + t + 's on her own forepaws** (the skip-count): ' + g + ' taps on her own two forepaws, left, right, left, right (the next one glows; a tap anywhere else makes it wiggle), each lighting that paw’s claws and putting the next number in her own murmur: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : ' The last tap turns the page to ' + s.next + ', which shows the ' + (g * t) + '.');
    }
    // (chapter 6: the 3s are patrols of three cats)
    return '**Then she counts by ' + t + 's** (the skip-count): ' + g + ' taps, one on each ' + (t === 2 ? 'cat' : t === 5 ? 'raised forepaw' : t === 3 ? 'patrol' : 'group') + ' in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting its ' + (t === 5 ? 'five claws' : t === 3 ? 'three cats' : t) + ' and adding its running total: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
      (who ? ' In the picture, left to right: ' + who + '.' : '') +
      (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : ' The last tap turns the page to ' + s.next + ', which shows the ' + (g * t) + '.') +
      (s.keep ? ' The running totals stay under the ' + (t === 5 ? 'paws' : 'groups') + ' on the pages after it, up to the lesson.' : '') + more;
  }
  /* A card as the storyboard names it: “its line” (`id`, an eye card: she saw it herself). */
  function cardWords(id) {
    const c = (story.cards || {})[id];
    if (!c) return '`' + id + '` (a card another chapter defines)';
    return '“' + q(c.line) + '” (`' + id + '`, ' + (c.mark === 'ear' ? 'an ear: she was told' : 'an eye: she saw it herself') + ')';
  }
  const cardList = x => asList(x).map(c => (typeof c === 'string' ? { id: c } : c || {}));
  /* What a one-tap frame's `tap` is, in words (chapter 5), and chapter 8's: the mark of that name on the cast
   * member who carries it, when that is somebody other than our cat (TAP_WHO), or on her in a pose of its own (TAP_SELF). */
  function tapTarget(f) {
    const t = f.scratch.tap, c = ((f.scene && f.scene.cast) || []).find(m => m && m.tap === t);
    const sc = f.scene || {};
    // (chapter 10: a dragonet's snout, the mist stone she holds, her two forepaws held out, the island's own marks)
    if (c && t === 'nose' && DRAGONETS.has(c.who)) return (SPEAKER[c.who] || whoWords(c)) + '’s snout';
    if (c && t === 'stone' && c.holds === 'miststone') return 'the mist stone in her paws';
    if (c && c.who === 'player' && (((CAM_TAPS[sc.set] || {})[sc.cam] || {})[t])) return CAM_TAPS[sc.set][sc.cam][t];
    if (!c && (SET_TAPS[sc.set] || {})[t]) return SET_TAPS[sc.set][t];
    if (c && c.who !== 'player' && TAP_WHO[t]) return TAP_WHO[t](SPEAKER[c.who] || whoWords(c), c);
    if (c && c.who === 'player' && TAP_SELF[t] && TAP_SELF[t][c.pose]) return TAP_SELF[t][c.pose];
    if (c && c.who === 'player' && TAP_MINE[t]) return TAP_MINE[t];
    return TAPS[t] || 'the ' + q(t);
  }
  /* The pages she taps (chapter 4): the row of bark, her first tap on the one curl, the glint. */
  function scratchWords(f) {
    const s = f.scratch;
    const tail = (s.prompt ? ' The instruction under the panel: “' + q(s.prompt).replace(/\*\*/g, '') + '”' : '') + (s.label ? ' For VoiceOver, a hidden button: “' + q(s.label) + '”' : '');
    // chapter 5: one tap on anything else in a scene (the old tom's nose, a tuft of fur, a patch of mud):
    // the page's own soft glow on it, and a small answer to a tap anywhere else
    if (s.tap && s.tap !== 'glint') {
      return '**Then she taps ' + tapTarget(f) + '** (one tap, on this scene): it glows softly; a tap on it turns the page to ' + s.next +
        '; a tap anywhere else gets a small answer' + (s.miss ? ' (lettered small beside it: “' + q(s.miss) + '”)' : '') + ' and nothing more. Nothing can be got wrong, and nothing is logged.' +
        (s.at ? ' The spot is ' + s.at.x + '% across the panel and ' + s.at.y + '% down.' : '') + tail;
    }
    if (s.tap) {
      return '**Then she taps the ' + (s.tap === 'glint' ? 'glitter' : q(s.tap)) + '** (one tap, on this scene): a soft star pulses on it; a tap on it makes it flare and turns the page to ' + s.next +
        '; a tap anywhere else makes it twinkle. Nothing can be got wrong, and nothing is logged.' + (s.at ? ' The spot is ' + s.at.x + '% across the panel and ' + s.at.y + '% down.' : '') + tail;
    }
    if (s.draws && !cardList(s.cards).length) {
      return '**Then she taps the bark to scratch it** (one tap; in play the one curl of bark takes the panel, glowing): the picture of ' + cardWords(s.draws) +
        ' is scratched into it, with a small “skritch”; no card is given yet, and no line is lettered. The tap turns the page to ' + s.next + '.' + tail;
    }
    const cards = cardList(s.cards), head = cardList(s.head);
    return '**Then she scratches the bark, a tap for each piece** (in play the pieces of bark take the panel, in a row on the ' + (s.ground || 'sand') + '; the next one glows, and a tap anywhere else makes it wiggle): ' +
      (head.length ? head.map(c => cardWords(c.id)).join(', ') + ' lie' + (head.length === 1 ? 's' : '') + ' at the head of the row, scratched already. ' : '') +
      'Each tap scratches the next picture in (a small “skritch”), letters its line under it and puts the card in her Case File: ' +
      cards.map(c => cardWords(c.id) + onlyIf(c.when)).join('; ') + '. Nothing can be got wrong, and nothing is logged. The last tap turns the page to ' + s.next + '.' + tail;
  }
  /* The questions she taps out of somebody (chapter 5): each tap one question and its answer. */
  // (chapter 6: the asker may be a she, the answer the reader's own, and a scene that shows nothing owed says so)
  const SHE = { tallyheart: 1, glintstar: 1, waffles: 1, sprinkle: 1, murmurchime: 1, patience: 1, wisp: 1 };
  function askWords(f) {
    const a = f.ask, pairs = asList(a.pairs), n = pairs.length, who = SPEAKER[a.who] || a.who, to = SPEAKER[a.to] || a.to;
    const him = SHE[a.who] ? 'her' : 'him', his = SHE[a.who] ? 'her' : 'his';
    const opts = (f.scene && f.scene.opts) || {}, owed = Object.prototype.hasOwnProperty.call(opts, a.opt || 'owed');
    const tail = (a.prompt ? ' The instruction under the panel: “' + q(a.prompt).replace(/\*\*/g, '') + '”' : '') + (a.label ? ' For VoiceOver, a hidden button: “' + q(a.label) + '”' : '');
    const answer = a.to === 'player' ? 'your own answer in your balloon' : to + '’s answer in ' + (SHE[a.to] ? 'hers' : 'his');
    // chapter 9: the rows of her case, tapped out one by one (`opt: 'read'`: the scene marks the next row, and the tap lights it)
    if (a.opt === 'read') return '**Then she taps the rows of her case, one at a time** (' + numWord(n) + ' taps, on this scene, counting nothing): the next row of bark glows (the scene marks it; ' + who + ' does not glow); a tap on it letters ' + who + '’s next question in ' + his + ' balloon and ' + answer +
      ', and lights that row (the scene’s `read` goes up by one, and the row after it glows); the pairs before stay under the panel, small, to read back. A tap anywhere else makes the glowing row hop. No number is shown, nothing can be got wrong, and nothing is logged. After the last one: Next → ' + a.next + '.' + tail +
      '\n\n' + pairs.map((pr, i) => (i + 1) + '. **' + who + '**: “' + q(pr[0]) + '” **' + to + '**: “' + q(pr[1]) + '”').join('\n');
    // chapter 10: the two weasels telling it all, by turns: two balloons a tap, his and then hers
    const WEASEL_SHE = { snip: 1 }, weasels = w => w === 'snip' || w === 'snatch';
    if (weasels(a.who) && weasels(a.to) && a.who !== a.to) {
      const hm = WEASEL_SHE[a.who] ? 'her' : 'him', hs = WEASEL_SHE[a.who] ? 'her' : 'his', theirs = WEASEL_SHE[a.to] ? 'hers' : 'his';
      return '**Then she taps the weasels, once for each pair of lines** (' + numWord(n) + ' taps, on this scene, counting nothing): ' + who + ' glows softly; a tap on ' + hm + ' letters ' + hs + ' next line in ' + hs + ' balloon and ' + to + '’s in ' + theirs +
        ', two balloons a tap, by turns' + (owed ? ', and adds one to what the scene shows' : ', and the scene stays as it is') + '; the pairs before stay under the panel, small, to read back. A tap anywhere else makes ' + hm + ' hop. No number is shown, nothing can be got wrong, and nothing is logged. After the last one: Next → ' + a.next + '.' + tail +
        '\n\n' + pairs.map((pr, i) => (i + 1) + '. **' + who + '**: “' + q(pr[0]) + '” **' + to + '**: “' + q(pr[1]) + '”').join('\n');
    }
    // chapter 9: an asker who answers himself (Thymeleaf naming his four things): two balloons of his own a tap
    if (a.to === a.who) return '**Then she taps ' + who + ', once for each pair of ' + his + ' lines** (' + numWord(n) + ' taps, on this scene, counting nothing): ' + who + ' glows softly; a tap on ' + him + ' letters ' + his + ' next line in ' + his + ' balloon and the one after it in a second balloon of ' + his + ' own' +
      (owed ? ', and adds one to what the scene shows' : ', and the scene stays as it is') + '; the pairs before stay under the panel, small, to read back. A tap anywhere else makes ' + him + ' hop. No number is shown, nothing can be got wrong, and nothing is logged. After the last one: Next → ' + a.next + '.' + tail +
      '\n\n' + pairs.map((pr, i) => (i + 1) + '. **' + who + '**: “' + q(pr[0]) + '” then “' + q(pr[1]) + '”').join('\n');
    return '**Then she taps ' + who + ', once for each question** (' + numWord(n) + ' taps, on this scene, counting nothing): ' + who + ' glows softly; a tap on ' + him + ' letters ' + his + ' next question in ' + his + ' balloon and ' +
      (a.to === 'player' ? 'your own answer in your balloon' : to + '’s answer in ' + (SHE[a.to] ? 'hers' : 'his')) +
      (owed ? ', and adds one to what the scene shows is owed (a pair of fish in the thought cloud over the heron)' : ', and the scene stays as it is') + '; the pairs before stay under the panel, small, to read back. A tap anywhere else makes ' + him + ' hop. No number is shown, nothing can be got wrong, and nothing is logged. After the last one: Next → ' + a.next + '.' +
      (a.prompt ? ' The instruction under the panel: “' + q(a.prompt).replace(/\*\*/g, '') + '”' : '') + (a.label ? ' For VoiceOver, a hidden button: “' + q(a.label) + '”' : '') +
      '\n\n' + pairs.map((pr, i) => (i + 1) + '. **' + who + '**: “' + q(pr[0]) + '” **' + to + '**: “' + q(pr[1]) + '”').join('\n');
  }
  function fileWords(f) {
    const p = f.file && f.file.prompt ? f.file.prompt : '**Tap** your Case File. You can open it any time.';
    return '**Then she opens her Case File, for the first time**: its curl of bark has appeared in the top bar, glowing (and is there on every page from now on). The instruction under the panel: “' + q(p).replace(/\*\*/g, '') +
      '” A tap on the curl opens the real screen: her cards on moss, under “What I saw myself” and “What I was told (to check)”. Closing it turns the page to ' + f.file.next + '.';
  }
  /* The card pick (chapter 10): Reynard's claim over her whole Case File, the cards that answer it (a card outside
   * the twenty every cat holds marked as only some cats'), the nudges, the glow, her pick remembered. */
  function pickWords(f) {
    const p = f.pick, who = p.who || 'reynard', name = SPEAKER[who] || who, word = claimWord(p.claim), n = asList(p.nudges);
    const right = asList(p.right).map(id => (PICK.line(id) ? q(PICK.line(id)) + ' ' : '') + '(`' + id + '`' + (EVERY_CAT_HOLDS.has(id) ? '' : ', a card only some cats hold') + ')');
    const own = Object.keys(p.own || {}).map(id => (who === 'reynard' ? 'The fox’s own card' : cap(name) + '’s own card') + ' (`' + id + '`): “' + q(p.own[id]) + '”');
    const tail = (typeof p.prompt === 'string' ? ' The instruction under the panel: “' + q(p.prompt).replace(/\*\*/g, '') + '”' : '') + (typeof p.label === 'string' && p.label ? ' For VoiceOver, a hidden button: “' + q(p.label) + '”' : '');
    return '**Pick a card.** Her Case File opens over the panel, every card face up as her file lays them, under ' + name + '’s claim “' + q(p.claim) + '”' + (word ? ' (' + word + ' lit)' : '') + '. Right: ' + right.join(', ') + '.' +
      (own.length ? ' ' + own.join(' ') : '') + (n[0] ? ' Any other card: “' + q(n[0]) + '”' : '') + (n[1] ? ' A second wrong card: “' + q(n[1]) + '”' : '') +
      ' After a third, the right cards she holds glow. Her pick is remembered (`' + p.flag + '`).' + tail + ' A right pick turns the page to ' + p.next + '.';
  }
  function interaction(f) {
    if (f.end) return '**Then:** the chapter ends, and her book opens at this chapter’s page: the recap of the reader’s choices and the dream line.';
    if (f.choice) return '**Then she chooses** (see the branches below).';
    if (f.input) {
      const k = f.input.kind, s = (f.input.suggestions || []).join(' · ');
      if (k === 'petname') return '**Then she picks or types her pet name** (' + s + '), then on to ' + f.input.next + '.';
      if (k === 'clanname') return '**Then she types the first part of her Clan name**, with a live preview (“You will be: Moonpaw”); ideas only if she asks (' + s + '). On to ' + f.input.next + '.';
      if (k === 'dream') return '**Then she may type a dream for her book**, or skip. On to ' + f.input.next + '.';
      // chapter 11: her own warrior ending (the Type screen), refused in place by the frame's own lines
      if (k === 'ending') {
        const rf = f.input.refuse || {}, set = f.input.sets || {};
        const no = [['own', 'her own name or no letter'], ['star', 'star'], ['paw', 'paw'], ['kit', 'kit (kitten, kitty)'], ['clan', 'a Clan cat’s whole name']]
          .filter(([key]) => rf[key] && rf[key].text)
          .map(([key, why]) => why + ', ' + (key === 'clan' ? 'that cat (Tallyheart, Thymeleaf or {Murmur}chime)' : SPEAKER[rf[key].who] || rf[key].who) + ': “' + q(rf[key].text) + '”');
        return '**Then she types her own ending** after her name, with a live preview (“You will be: Fernheart”); refused, kindly, with another try on the same screen: ' + no.join('; ') + '.' +
          (Object.keys(set).length ? ' Accepted, it sets ' + Object.keys(set).map(x => '`' + x + ': ' + JSON.stringify(set[x]) + '`').join(', ') + '.' : '') + ' On to ' + f.input.next + '.';
      }
      return '**Then she types** (' + k + '). On to ' + f.input.next + '.';
    }
    if (f.look) return '**Then she chooses her look in the reflection**: she-cat or tom, fur, marking, eyes; the reflection redraws as she picks. On to ' + f.look.next + '.';
    if (f.counts) return takeSetOf(f) ? takesWords(f) : countsWords(f);
    if (f.skip) return skipWords(f);
    if (f.scratch) return scratchWords(f);
    if (f.file) return fileWords(f);
    if (f.ask) return askWords(f);
    if (f.pick) return pickWords(f);
    return '**Then:** Next → ' + f.next + '.';
  }
  function frameMd(id, level, n) {
    const f = F[id], h = '#'.repeat(level);
    const out = [];
    out.push(h + ' ' + id + (n ? ' · panel ' + n : ''));
    out.push('');
    if (f.board) out.push('**Shot.** ' + q(f.board));
    else out.push('**Shot.** (no board written)');
    out.push('');
    if (f.when) out.push('**Shows ' + ifWords(f.when).replace(/^(only if|unless) /, '$1** ') + '; otherwise the page turns straight on to ' + (f.else || exits(f)[0]) + '.', '');
    out.push('**Scene.** ' + sceneWords(f.scene));
    if (f.image) out.push('', '**Image.** `' + f.image + '` replaces the drawn panel.');
    const caps = asList(f.caption).map(c => (typeof c === 'string' ? { text: c } : c || {}));
    if (caps.length) { out.push(''); out.push('**Captions**'); out.push(''); out.push(caps.map(c => '> ' + q(c.text) + onlyIf(c.when)).join('\n>\n')); }
    const say = withVariants(f, asList(f.say));
    if (say.length) {
      out.push(''); out.push('**Balloons**'); out.push('');
      say.forEach(b => out.push('- **' + speaker(b) + '**' + kindWord(b.kind) + ': ' + (b.lang === 'es' ? esSaid(b.text) : '“' + q(b.text) + '”') + onlyIf(b.when) +
        (b.digits ? ' *(lettered small beside it, in Andika: ' + q(b.digits) + ')*' : '') +
        // (the Warrior Counts: her missed pairs written out under this balloon)
        (b.chips ? ' *(under it, her missed pairs written out in Andika, each with its answer (“7 × 8 = 56”), up to six, the tricky Counts’ first, a pair with a 1 last)*' : '') +
        (b.one ? ' *(over a single chip: “' + q(b.one) + '”)*' : '')));
    }
    // (chapter 5, `sfxAt`: a frame that says where its sound is lettered, in hundredths of the panel;
    // `sfxRead`: the sound in words, said by Read to me after the caption that runs on into it)
    if (f.sfx) {
      out.push(''); out.push('**Sound effect:** ' + q(f.sfx) + (Array.isArray(f.sfxAt) ? ' *(lettered where the frame says: its middle ' + f.sfxAt[0] + ' across and ' + f.sfxAt[1] + ' down, in hundredths of the panel)*' : '') +
        (typeof f.sfxRead === 'string' && f.sfxRead ? ' *(Read to me never reads a sound effect; here it says the sound in words, right after the caption that runs on into it: “' + q(f.sfxRead) + '”)*' : ''));
    }
    const into = ids0.find(k => F[k].skip && F[k].skip.next === id && F[k].skip.carry !== false);
    // (chapter 5: a count as long as the cats it is for shows the number she reached; the tuck, where it stopped)
    if (into && F[into].skip.groups == null) out.push('', '**The count:** the number the skip-count reached for her (from ' + into + ') shows big over the picture, in the times-table font.');
    else if (into) { const sk = F[into].skip; out.push('', '**The count:** the skip-count’s ' + ((sk.groups || 5) * (sk.table || 2)) + ' (from ' + into + ') shows big over the picture, in the times-table font.'); }
    // (a frame that draws a picture of its own, a skip-count, the questions she taps out or a row of bark, never shows the kept one: the page draws its own)
    const kept = f.skip || f.ask || (f.scratch && !f.scratch.tap) ? null : E.keptSkip(story, id);
    if (kept && kept.skip.tuck) out.push('', '**The picture stays:** in place of this scene, the counting picture from ' + kept.id + ', nine claws lit and one tucked in on every cat, ' + ((kept.skip.groups || 5) * 9) + ' over them and no number under any cat' + (f.counts ? ', until the lesson starts' : '') + '; the balloons sit beside it.');
    // (chapter 7: one cheek's two rows of whiskers, their totals beside them)
    else if (kept && kept.skip.thing === 'whisker' && kept.skip.table === 3) out.push('', '**The cheek stays:** in place of this scene, the cheek from ' + kept.id + ', both rows of whiskers lit, ' +
      Array.from({ length: kept.skip.groups || 2 }, (_, i) => (i + 1) * 3).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' beside them' + (f.counts ? ', until the lesson starts' : '') + '; the balloons sit beside it.');
    // (chapter 8: one cat's two pairs of paws, their totals under them)
    else if (kept && kept.skip.thing === 'paw' && kept.skip.table === 2) out.push('', '**The paws stay:** in place of this scene, the cat from ' + kept.id + ', side-on, both pairs of paws lit, ' +
      Array.from({ length: kept.skip.groups || 2 }, (_, i) => (i + 1) * 2).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' under them' + (f.counts ? ', until the lesson starts' : '') + '; the balloons sit beside it.');
    else if (kept) out.push('', '**The totals stay:** in place of this scene, the counting picture from ' + kept.id + ', every ' + (kept.skip.thing === 'whisker' ? 'cheek' : kept.skip.thing === 'gap' ? 'empty place' : kept.skip.table === 5 ? 'paw' : kept.skip.table === 10 ? 'cat' : 'group') + ' lit, its running totals (' +
      Array.from({ length: kept.skip.groups || 5 }, (_, i) => (i + 1) * (kept.skip.table || 2)).join(', ') + ') under them' + (f.counts ? ', until the lesson starts' : '') + '; the balloons sit beside it.');
    if (f.gift) {
      const g = E && E.gift(f.gift);
      out.push('', '**Gift:** ' + (g ? g.name + ' (from ' + g.from + ', `' + f.gift + '`)' : '`' + f.gift + '` (not in E.GIFTS)') +
        ' goes in her nest the first time she reaches this panel. My nest shows it under “From friends”; Back never takes it away.');
    }
    // chapter 4: flags set by reaching the frame, and the cards it gives
    if (f.sets) out.push('', '**Set for good:** ' + Object.keys(f.sets).map(k => '`' + k + ': ' + JSON.stringify(f.sets[k]) + '`').join(', ') +
      ', by reaching this panel. Nothing unsets it: not Back, not a second reading.');
    cardList(f.card).forEach(c => {
      const def = (story.cards || {})[c.id] || {};
      const said = asList(f.say).some(b => b && q(b.text) === q(def.line));
      // a card she already holds, laid beside the new one for this panel (`held`): shown, never given here
      if (c.held === true) {
        out.push('', '**Beside it:** ' + cardWords(c.id) + onlyIf(c.when) + ', a card she already holds, lies beside the new one under the panel for this one panel: its picture, its mark' +
          (c.line === false || said ? '' : ' and its line') + '. Nothing is given.');
        return;
      }
      out.push('', '**New card:** ' + cardWords(c.id) + onlyIf(c.when) + ' goes into her Case File the first time she reaches this panel, and is shown under the panel: its picture' +
        (c.mark === false ? ', with no mark yet' : ' and its mark') + (c.line === false || said ? ' (its line is a balloon here, so it is lettered once)' : ', and its line') +
        '. Back never takes it away.' + (def.when ? ' Her Case File shows it only once ' + whenWords(def.when) + ' (and on this panel).' : ''));
    });
    out.push(''); out.push(interaction(f));
    out.push('');
    return out.join('\n');
  }
  let panelNo = 0;
  function render(items, level, onMain) {
    const out = [];
    for (const it of items) {
      if (it.frame) {
        if (onMain) panelNo++;
        out.push(frameMd(it.frame, level, onMain ? panelNo : 0));
      } else if (it.branches) {
        const letters = 'ABCDEFGHIJ';
        it.branches.forEach((b, i) => {
          const sets = b.option.sets ? Object.keys(b.option.sets).map(k => '`' + k + ': ' + JSON.stringify(b.option.sets[k]) + '`').join(', ') : '';
          const label = q(b.option.label), quoted = /^[“"]/.test(label) ? label : '“' + label + '”';
          out.push('#'.repeat(Math.min(level + 1, 6)) + ' Branch ' + letters[i] + ' (from ' + it.choice + '): ' + quoted);
          out.push('');
          out.push('*If she chooses this' + (sets ? ' (sets ' + sets + ')' : '') + '. ' + (b.items.length ? b.items.length + ' frame' + (b.items.filter(x => x.frame).length === 1 ? '' : 's') : 'No extra frames') + ', then back to ' + (it.merge || 'the end') + '.*' +
            (b.option.when ? ' *This option shows ' + ifWords(b.option.when) + '.*' : '') +
            asList(b.option.labelWhen).map(v => ' *For a reader whose ' + whenWords(v.when) + ', the option reads: “' + q(v.label) + '”*').join(''));
          out.push('');
          out.push(render(b.items, Math.min(level + 2, 6), false));
        });
        if (it.merge) { out.push('*The branches meet again at ' + it.merge + '.*'); out.push(''); }
      }
    }
    return out.join('\n');
  }

  /* -------------------------------------------------------------- summary */
  const ids = Object.keys(F);
  const reachable = new Set(reach(story.start));
  const setCount = {};
  let choices = 0, inputs = 0, looks = 0, counts = 0, takes = 0, skips = 0, gifts = 0, sfx = 0, words = 0, balloons = 0, captions = 0, conditional = 0, taps = 0;
  for (const id of ids) {
    const f = F[id];
    if (f.scene && f.scene.set) setCount[f.scene.set] = (setCount[f.scene.set] || 0) + 1;
    if (f.choice) { choices++; f.choice.options.forEach(o => { if (o.when) conditional++; }); }
    if (f.input) inputs++;
    if (f.look) looks++;
    if (f.counts) { if (takeSetOf(f)) takes++; else counts++; }
    if (f.skip) skips++;
    if (f.scratch || f.file || f.ask) taps++;
    if (f.gift) gifts++;
    if (f.sfx) sfx++;
    asList(f.caption).forEach(c => { const t = typeof c === 'string' ? c : (c && c.text) || ''; captions++; words += q(t).split(' ').length; if (c && c.when) conditional++; });
    asList(f.say).forEach(b => { balloons++; words += q(b.text).split(' ').length; if (b.when) conditional++; });
  }
  let mainLine = 0, shortest = 0, longest = 0;
  (function countMain(items) {
    for (const it of items) {
      if (it.frame) mainLine++;
      if (it.branches) {
        const lens = it.branches.map(b => b.items.filter(x => x.frame).length);
        shortest += Math.min.apply(null, lens); longest += Math.max.apply(null, lens);
      }
    }
  })(order);
  const branchFrames = ids.length - mainLine;
  /* One read-through, counted by walking it, when some frame shows only to some readers (a frame's
   * `when`: chapter 3's f081, chapter 4's nineteen): every way through the choices, for every reader
   * those `when`s tell apart. A frame that doesn't match is passed over, and a frame's `sets` and
   * the chosen option's are flags from there on. With no such frame the branch arithmetic above is
   * exact already. */
  const readThrough = (() => {
    const vals = {};
    const note = w => Object.keys(w || {}).forEach(k => { if (k === 'not') note(w.not); else (vals[k] = vals[k] || new Set([undefined])).add(w[k]); });
    ids.forEach(id => note(F[id].when));
    const keys = Object.keys(vals);
    if (!keys.length) return null;
    /* (chapter 10: a flag the frames read only as true or false needs no reader for "not set" beside the one for false:
     * E.matches reads false as "false or not set", so the two walk alike, unless a list somewhere names the flag. The
     * same numbers, from far fewer readers: chapter 10's six found flags alone were 729 of them.) */
    const listed = new Set();
    const lists = w => Object.keys(w || {}).forEach(k => { if (k === 'not') lists(w.not); else if (Array.isArray(w[k])) listed.add(k); });
    ids.forEach(id => { lists(F[id].when); if (F[id].choice) F[id].choice.options.forEach(o => lists(o.when)); });
    keys.forEach(k => { const vs = [...vals[k]].filter(x => x !== undefined); if (vs.includes(false) && vs.every(x => x === true || x === false) && !listed.has(k)) vals[k].delete(undefined); });
    const span = (id, cat, memo) => {
      const key = id + ' ' + JSON.stringify(cat.flags);
      if (memo[key]) return memo[key];
      const f = F[id];
      if (f.when && !E.matches(f.when, cat)) return (memo[key] = span(f.else || exits(f)[0], cat, memo));
      const then = f.sets ? { flags: Object.assign({}, cat.flags, f.sets) } : cat;
      const rest = f.choice ?
        f.choice.options.filter(o => !o.when || E.matches(o.when, then)).map(o => span(o.next, { flags: Object.assign({}, then.flags, o.sets) }, memo)) :
        exits(f).slice(0, 1).map(n => span(n, then, memo));
      return (memo[key] = [1 + (rest.length ? Math.min(...rest.map(r => r[0])) : 0), 1 + (rest.length ? Math.max(...rest.map(r => r[1])) : 0)]);
    };
    let readers = [{}];
    keys.forEach(k => { readers = readers.flatMap(fl => [...vals[k]].map(v => (v === undefined ? fl : Object.assign({}, fl, { [k]: v })))); });
    const all = readers.map(flags => span(story.start, { flags }, {}));
    return [Math.min(...all.map(r => r[0])), Math.max(...all.map(r => r[1]))];
  })();
  const readLo = readThrough ? readThrough[0] : mainLine + shortest, readHi = readThrough ? readThrough[1] : mainLine + longest;
  const unreachable = ids.filter(id => !reachable.has(id));

  if (W) {
    writeWarrior();
    return;
  }
  /* The Warrior Counts' storyboard (docs/warrior-counts.md): where it opens, the question panel, the
   * openings, the sitting's lines and pauses, the halfway page and the result's pages, each frame as a
   * chapter's is boarded (frameMd), its last line saying what comes after it. */
  function writeWarrior() {
    const md = [], L = story.lists, C = W.counts || {};
    const then = (id, n, level) => frameMd(id, level || 4, n).replace(/\*\*Then:\*\* Next → §([^.]*)\./, (m, k) => story.after[k] || m);
    md.push('# Storyboard: The Warrior Counts');
    md.push('');
    md.push('*Generated by `tools/storyboard.mjs` from `' + relative(ROOT, storyPath) + '`. Do not edit by hand: change the story file and run `node tools/storyboard.mjs` again.*');
    md.push('');
    md.push('## How to read this');
    md.push('');
    md.push('The Warrior Counts are not a chapter: no choices, one sitting of 55 questions, every pair up to ten times ten once, and the frames around it (`PC.warrior`, docs/warrior-counts.md). Each frame is boarded as a chapter’s is (**Shot**, **Scene**, **Captions**, **Balloons**, **Then**). The opening’s frames and the result’s are played in order with Next and the big Back beside it; a result page that depends on how the sitting went is listed with each of its versions.');
    md.push('');
    md.push('`{name}` is the first part of her Clan name, `{petname}` what her Tall One calls her, and `{Murmur}`/`{murmur}` the tortoiseshell’s name word (Murmur, or Mutter for a reader whose own Clan name is Murmur). ' + ENDING_WORDS + ' The result’s own words come first, in number words: `{right}`/`{Right}` her right answers, `{last}`/`{Last}` her last finished sitting’s, `{short}` fifty less `{right}`, and `{tricky}` the one or two Counts her misses fall in (“the 7s and the 8s”); a capital starts a sentence.');
    md.push('');
    md.push('## At a glance');
    md.push('');
    md.push('| | |');
    md.push('|---|---|');
    md.push('| Opens | once `' + (W.after || 'ch10') + '` is finished, from the hub’s big button (never the Training Hollow); after the pass, a quiet “The Warrior Counts again” |');
    md.push('| A sitting | 55 questions, 10 × 10 always last; 50 right passes; a miss gets the sand’s help once and is not asked again; four paw prints, no score, no clock |');
    const inResult = kind => new Set([].concat(...story.pages[kind].map(pg => pg.map(v => v.id).filter(Boolean)))).size;
    md.push('| Frames | ' + ids.length + ' (the openings ' + (L.first.length + L.again.length + L.quiet.length) + ', halfway ' + L.halfway.length +
      ', the pass ' + inResult('pass') + ', the not-yet ' + inResult('notYet') + ', after the pass ' + inResult('afterPass') + ') |');
    md.push('| Captions and balloons | ' + captions + ' captions, ' + balloons + ' balloons, about ' + words + ' words in all |');
    md.push('| Scenes | ' + Object.keys(setCount).map(k => k + ' ' + setCount[k]).join(' · ') + ' |');
    md.push('');
    md.push('## The hub');
    md.push('');
    md.push('Once `' + (W.after || 'ch10') + '` is finished the big button is the Warrior Counts’ until she passes, and no chapter’s “coming soon” shows:');
    md.push('');
    md.push('- a result she has not seen to its last button: **The Warrior Counts** / *Glintstar is waiting* (it opens the result again);');
    md.push('- never sat: **The Warrior Counts** / *When you’re ready*;');
    md.push('- a sitting to pick up (an answer in it, within two hours of when she was last there, nothing practiced since): **Keep going** / *The Warrior Counts · third paw*;');
    md.push('- after a not-yet: **The Warrior Counts** / *Try again whenever you like*;');
    md.push('- passed: the Ceremony’s chapter button, as any chapter’s, and under it, quietly, **The Warrior Counts again**; while the Ceremony is not built, “Your ceremony is coming soon.” in its place, here and in her book. A sitting again whose result she has not seen waits in the quiet slot, **The Warrior Counts: Glintstar is waiting**, and the Ceremony keeps the big one.');
    md.push('');
    md.push('## The question panel');
    md.push('');
    md.push('**Scene.** ' + sceneWords(W.scene));
    md.push('');
    md.push('The same panel for all 55. It is drawn with the crowd until she has a finished sitting; after that the camp is quiet: the same panel without the crowd (the halfway page too).');
    md.push('');
    md.push('Under the panel Glintstar asks each question in her balloon, in words (“Seven times eight.”), then the question line in Andika (“7 × 8 = ?”) and the keypad. Above the question line, four paw prints, one a quarter (14, 14, 14 and 13 questions): the one she is on fills a little at every answer, a miss the same as a right one. Read to me says Glintstar’s balloon, not the question line. On a miss the panel turns to Tallyheart’s sand, the count scratched out in the pair’s anchor Count’s way.');
    md.push('');
    const fin = C.finale || C.last || {};
    if (fin.prompt) md.push('**The last question, 10 × 10:**', '', ...balloonLines(fin.prompt, { scene: W.scene }).map(l => l.replace(/^ {2}/, '')), '');
    if (fin.right) md.push('**Right:**', '', ...balloonLines(fin.right, { scene: W.scene }).map(l => l.replace(/^ {2}/, '')), '');
    if (fin.missLast) md.push('**Missed:** the sand, then Tallyheart: “' + q(fin.missLast) + '”', '');
    md.push('## The opening');
    md.push('');
    md.push('### The first sitting');
    md.push('');
    L.first.forEach((id, i) => md.push(then(id, i + 1)));
    md.push('### Again, the Clan watching (sittings set aside, none finished)');
    md.push('');
    L.again.forEach((id, i) => md.push(then(id, i + 1)));
    md.push('### Again, the camp quiet (after a finished sitting)');
    md.push('');
    L.quiet.forEach((id, i) => md.push(then(id, i + 1)));
    const aside = W.aside || {};
    md.push('### When the sitting before was set aside');
    md.push('');
    md.push('Tallyheart says why, once, at the start of her balloon on that one panel, before “Every Count, same as before.” (also when the sitting before was opened and left with no answer, which is dropped, not recorded; never on the first opening):');
    md.push('');
    if (aside.late) md.push('- two hours went by (`late`): “' + q(aside.late) + '”');
    if (aside.practice) md.push('- she practiced other Counts in between (`practice`): “' + q(aside.practice) + '”');
    md.push('');
    md.push('### A sitting picked up');
    md.push('');
    md.push('Within two hours of when she was last there, with nothing practiced since, it picks up at the same question, under:');
    md.push('');
    md.push(...balloonLines(W.open && W.open.resume, { scene: W.scene }).map(l => l.replace(/^ {2}/, '')));
    md.push('');
    md.push('(A sitting picked up before its first answer plays its own opening again.)');
    md.push('');
    md.push('## The sitting');
    md.push('');
    const said = x => asList(x).filter(l => typeof l === 'string' ? l : l && l.text);
    const ln = x => said(x).map(l => '“' + q(typeof l === 'string' ? l : l.text) + '”').join(', ');
    const praise = asList(C.praise), fast = asList(C.fast);
    md.push('Tallyheart’s lines (Glintstar asks every question):');
    md.push('');
    md.push('- After a right answer, now and then (' + said(praise).length + ' of the ' + praise.length + ' praise entries say something; a blank says nothing and the next question comes): ' + ln(praise) + '. Quick ones: ' + ln(fast) + '.');
    if (C.remembered) md.push('- Right on one of her hard facts, every other one, in turn (' + said(C.remembered).length + ' lines, a blank between): quick, ' + ln(C.remembered) + '; slow, ' + ln(C.rememberedSlow) + '. A long line stays until it is read (about 0.4 s a word) or said to its end.');
    if (C.missLast) md.push('- After a miss, in turn, never one twice running: ' + ln(C.missLast) + '.');
    md.push('- No line after a miss for the right answers that follow (no `fastAfterMiss`), and none that counts what is left.');
    md.push('');
    md.push('### The pauses');
    md.push('');
    const nth = n => n + (n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th');
    Object.keys(W.beats || {}).sort((a, b) => a - b).forEach(k => md.push('- After the ' + nth(+k) + ' answer, Tallyheart: ' + ln(W.beats[k])));
    md.push('');
    md.push('Each stays 2.5 s, or 3.5 s when its line is over six words, or as long as its words take to read (0.6 s and 0.38 s a word) when that is longer (with Read to me on, until it has been said, and half a second more; at most that long again after that); a tap moves on. No Back: a pause comes after an answer. A sitting picked up right at a pause says “Where were we? Ah, yes.” in it, first, and the pause waits for all of it.');
    md.push('');
    md.push('### The halfway page, after the 28th answer');
    md.push('');
    L.halfway.forEach((id, i) => md.push(then(id, i + 1)));
    md.push('## The result');
    md.push('');
    md.push('Every page has the big Back beside Next; the last has two buttons, and either marks the result seen (until then the hub reopens it).');
    md.push('');
    [['pass', 'The pass: 50 or more right'], ['notYet', 'The not-yet: 49 or fewer'], ['afterPass', 'After the pass: a sitting again, for a clean sweep']].forEach(([kind, head]) => {
      md.push('### ' + head);
      md.push('');
      story.pages[kind].forEach((pg, i) => {
        if (pg.length === 1 && !pg[0].key) { md.push(then(pg[0].id, i + 1)); return; }
        md.push('#### Page ' + (i + 1) + ', by how the sitting went');
        md.push('');
        pg.forEach(v => {
          md.push('*' + (v.key ? cap(VARIANT_WORDS[kind + '.' + v.key] || v.key) + ' (`' + kind + '.' + v.key + '`)' : 'Otherwise') + (v.same ? ': the same frame as `' + v.same + '`.*' : v.id ? ':*' : ': no page.*'));
          md.push('');
          if (v.id && !v.same) md.push(then(v.id, 0, 5));
        });
      });
    });
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, md.join('\n').replace(/\n{3,}/g, '\n\n'));
    console.log('Wrote ' + relative(ROOT, outPath) + ': ' + ids.length + ' frames.');
  }

  const md = [];
  md.push('# Storyboard: Chapter ' + (story.number || '') + ', ' + story.title);
  md.push('');
  md.push('*Generated by `tools/storyboard.mjs` from `' + relative(ROOT, storyPath) + '`. Do not edit by hand: change the story file and run `node tools/storyboard.mjs` again.*');
  md.push('');
  md.push('## How to read this');
  md.push('');
  md.push('Every screen of the game is one comic panel, called a frame. Frames are listed in reading order. Each one has:');
  md.push('');
  md.push('- **Shot**: the storyboard, written for an illustrator (camera, who is where, what the moment feels like, where the lettering goes).');
  md.push('- **Scene**: what the game draws today, in plain words: the set, the camera, who is in shot and how, and any effects.');
  md.push('- **Captions**: the narration boxes, read first. **Balloons**: who speaks, in order. **Sound effect**: the big lettering. A line marked *(only if …)* shows only to a reader whose choices match.');
  md.push('- **Then**: what the reader does next (tap Next, choose, type, pick a look, count by twos, or do a Counts lesson' + (takes ? ' or a take-away lesson' : '') + ').');
  md.push('');
  md.push('Where the reader makes a choice, each option’s frames are grouped under a **Branch** heading, and the branches meet again at the frame named after them. `{name}` is the first part of her Clan name (Moon makes Moonpaw), `{petname}` is what her Tall One calls her, and `{they}`/`{them}`/`{their}` become she/her/her or he/him/his.' +
    (/\{(Murmur|murmur|MURMUR)\}/.test(JSON.stringify(story)) ? ' `{Murmur}`/`{murmur}` is the tortoiseshell’s name word: Murmur (Murmurpaw, Murmurchime, murmuring), or Mutter for a reader whose own Clan name is Murmur.' : '') +
    // (chapter 11: her warrior ending, only where a story has it)
    (/\{ending\}/.test(JSON.stringify(story)) ? ' ' + ENDING_WORDS : ''));
  md.push('');
  md.push('## At a glance');
  md.push('');
  md.push('| | |');
  md.push('|---|---|');
  md.push('| Frames | ' + ids.length + ' (' + mainLine + ' on the main line, ' + branchFrames + ' in branches) |');
  md.push('| One read-through | ' + readLo + (readHi !== readLo ? '–' + readHi : '') + ' panels, depending on her choices |');
  md.push('| Choices | ' + choices + ' |');
  md.push('| Things she types | ' + inputs + ' (' + ids.filter(id => F[id].input).map(id => F[id].input.kind).join(', ') + ') |');
  md.push('| Look chooser | ' + looks + ' |');
  md.push('| Counts lessons | ' + counts + ' (' + Object.keys(story.counts || {}).filter(k => !(story.counts[k] && story.counts[k].op === '-')).map(k => k + ': ' + ((story.counts[k].facts || []).length) + ' facts').join('; ') + ') |');
  // (the take-aways kit: a take set's frames, a row of their own, never a Count)
  if (takes) md.push('| Take-aways | ' + takes + ' (' + Object.keys(story.counts || {}).filter(k => story.counts[k] && story.counts[k].op === '-').map(k => { const n = asList(story.counts[k].facts).length; return k + ': ' + n + (n === 1 ? ' problem' : ' problems') + (story.counts[k].warm === true ? ', a made warm-up first' : ''); }).join('; ') + ') |');
  // (chapter 5: a count as long as the cats it is for has no number of taps of its own; the tuck counts back)
  const skipTaps = sk => (sk.groups == null ? (asList(sk.who).filter(c => !c.when).length || 1) + ' to ' + asList(sk.who).length + ' taps, by ' : sk.groups + (sk.groups === 1 ? ' tap, by ' : ' taps, by ')) + (sk.tuck ? 'ones, back from ' + sk.groups * 10 : sk.table + 's');
  if (skips) md.push('| Skip-counts | ' + skips + ' (' + ids.filter(id => F[id].skip).map(id => skipTaps(F[id].skip)).join('; ') + ') |');
  // (chapter 9: the rows of her case, and an asker who answers himself)
  // (chapter 10: the two weasels, by turns)
  const askTaps = a => (a.opt === 'read' ? 'the ' + numWord(asList(a.pairs).length) + ' rows of her case' : /^(snip|snatch)$/.test(a.who) && /^(snip|snatch)$/.test(a.to) && a.who !== a.to ? 'the weasels’ ' + numWord(asList(a.pairs).length) + ' pairs of lines' :
    (SPEAKER[a.who] || a.who) + '’s ' + numWord(asList(a.pairs).length) + (a.to === a.who ? ' pairs of lines' : ' questions'));
  if (taps) md.push('| Other things she taps | ' + ids.filter(id => F[id].scratch || F[id].file || F[id].ask).map(id => (F[id].file ? 'her Case File' : F[id].ask ? askTaps(F[id].ask) :
    F[id].scratch.tap ? (F[id].scratch.tap === 'glint' ? 'the glitter' : TAPS[F[id].scratch.tap] ? tapTarget(F[id]) : 'the ' + F[id].scratch.tap) :
    F[id].scratch.draws && !cardList(F[id].scratch.cards).length ? 'the bark' : 'a row of bark') + ' (' + id + ')').join(', ') + ' |');
  // (chapter 10: the card picks, a row of their own)
  const picks = ids.filter(id => F[id].pick);
  if (picks.length) md.push('| Card picks | ' + picks.length + ' (' + picks.join(', ') + ') |');
  if (story.cards) md.push('| Case File cards | ' + Object.keys(story.cards).length + ' (' + Object.keys(story.cards).filter(k => story.cards[k].mark !== 'ear').length + ' eyes, ' + Object.keys(story.cards).filter(k => story.cards[k].mark === 'ear').length + ' ears) |');
  if (gifts) md.push('| Gifts | ' + ids.filter(id => F[id].gift).map(id => { const g = E && E.gift(F[id].gift); return (g ? g.name.split(':')[0] : F[id].gift) + ' (' + id + ')'; }).join(', ') + ' |');
  md.push('| Captions and balloons | ' + captions + ' captions, ' + balloons + ' balloons, about ' + words + ' words in all |');
  if (conditional) md.push('| Lines and options that depend on her choices | ' + conditional + ' |');
  md.push('| Sound effects | ' + sfx + ' |');
  md.push('| Scenes | ' + Object.keys(setCount).map(k => k + ' ' + setCount[k]).join(' · ') + ' |');
  if (unreachable.length) md.push('| Not reachable from the start | ' + unreachable.join(', ') + ' |');
  md.push('');
  md.push('## The chapter');
  md.push('');
  md.push(render(order, 3, true));
  if (story.cards) {
    md.push('## The Case File’s cards');
    md.push('');
    md.push('A piece of bark for each thing she finds out: one picture scratched in, one line, and a mark in a corner (an eye for what she saw herself, an ear for what she was only told). Each goes into her Case File at the panel that gives it, in this order:');
    md.push('');
    md.push('| Card | Mark | Its line | Given at | Notes |');
    md.push('|---|---|---|---|---|');
    const givenAt = cid => ids.filter(id => cardList(F[id].card).some(c => c.id === cid && c.held !== true) || (F[id].scratch && cardList(F[id].scratch.cards).some(c => c.id === cid)));
    Object.keys(story.cards).forEach(cid => {
      const c = story.cards[cid], notes = [];
      if (c.picture && c.picture !== cid) notes.push('picture `' + c.picture + '`');
      if (c.when) notes.push('her file shows it only once ' + whenWords(c.when));
      if (asList(c.answers).length) notes.push('answered by ' + asList(c.answers).map(a => '`' + a + '`').join(', ') + ' (for chapter 10)');
      // (chapter 5: a link may name the cards it touches itself)
      // (chapter 8: a partner's own line, `lines`: each partner named with the line it joins over, in the order of `with`, the order the joins are made)
      const own = c.link && c.link.lines && typeof c.link.lines === 'object' && Object.keys(c.link.lines).length ? c.link.lines : null;
      if (own && asList(c.link.with).length) notes.push('drawn touching ' + asList(c.link.with).map(a => '`' + a + '` over “' + q(typeof own[a] === 'string' && own[a] ? own[a] : c.link.line || 'They can’t both be true.') + '”' + (own[a] ? ' (its own line)' : '')).join(', then ') +
        (c.link.when ? ', once ' + whenWords(c.link.when, true) : ', each from the moment she holds it and this one'));
      else if (c.link && asList(c.link.with).length) notes.push('drawn touching ' + asList(c.link.with).map(a => '`' + a + '`').join(', ') + (c.link.when ? ' once ' + whenWords(c.link.when, true) : ' from the moment she holds both') + ': “' + q(c.link.line || 'They can’t both be true.') + '”');
      else if (c.link) notes.push('drawn touching ' + (asList(c.answers).length ? 'them' : 'its answers') + (c.link.when ? ' once ' + whenWords(c.link.when, true) : '') + ': “' + q(c.link.line || 'They can’t both be true.') + '”');
      md.push('| `' + cid + '` | ' + (c.mark === 'ear' ? 'ear' : 'eye') + ' | ' + q(c.line) + ' | ' + (givenAt(cid).join(', ') || 'another chapter') + ' | ' + notes.join('; ') + ' |');
    });
    md.push('');
  }
  if (story.book && story.book.recap) {
    md.push('## The book page');
    md.push('');
    md.push('Title: *' + q(story.book.title || '{name}paw’s First Moon') + '*. This chapter’s page, under “Chapter ' + (story.number || 1) + ': ' + story.title + '”. Lines shown when their condition matches the reader’s choices:');
    md.push('');
    story.book.recap.forEach(r => {
      md.push('- (' + (r.when ? 'if ' + whenWords(r.when) : 'always') + ') ' + q(r.text));
    });
    if (story.book.noDream) md.push('- (no dream typed) ' + q(story.book.noDream));
    // (book two: the store under the recap, drawn small by the take-aways kit's picture)
    if (typeof story.book.store === 'number') md.push('', '**In the store:** under the recap, small, the store picture of ' + story.book.store + ' (' + storeWords(story.book.store) + '), with “In the store:” in Comic Neue and ' + story.book.store + ' in Andika; it prints with the page.');
    md.push('');
    asList(story.book.dragonet).forEach(dn => {
      md.push('**A dragonet page:** ' + q(dn.name) + ' (`' + dn.id + '`), found in this chapter' + (dn.when ? ' by a reader whose ' + whenWords(dn.when) + ' (the page is there only then)' : '') +
        '. Her book gains a page for ' + q(dn.name) + (dn.pose ? ' (drawn ' + poseWords({ who: dn.id, pose: dn.pose }) + ')' : '') +
        ', with room for her own drawing, beside the clutch still to find (silhouettes, seven dragonets in all):');
      md.push('');
      md.push(asList(dn.lines).map(l => '> ' + q(l)).join('\n>\n'));
      md.push('');
    });
  }
  if (story.teaser) {
    md.push('## Coming next');
    md.push('');
    md.push('Shown at the end of her book and in the hub while the next chapter isn’t built: **' + q(story.teaser.title) + '**' + (asList(story.teaser.lines).length ? '' : '.'));
    md.push('');
    // a paragraph each, as the book shows them
    md.push(asList(story.teaser.lines).map(l => '> ' + q(l)).join('\n>\n'));
    md.push('');
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, md.join('\n').replace(/\n{3,}/g, '\n\n'));
  console.log('Wrote ' + relative(ROOT, outPath) + ': ' + ids.length + ' frames, ' + choices + ' choices.');
}

/* ------------------------------------------------------------------ the words cover the vocabulary
 * The art's vocabulary (PC.art.vocab, as index.html loads the art) against the words above: a new
 * anchor, camera, option, pose, mood or effect with no words here would print as its bare id.
 * Chapter 6: `more` (a JSON file in the vocabulary's own shape: `sets.<id>.{cams, anchors, opts}`,
 * `poses`, `otherPoses.<who>`, `moods`, `fx`, `cast`, `extras.<key>`, `variants.<who>`) is added to
 * the art's first, so a chapter's new names are checked before its art lands. A cast member drawn by
 * variant with words by variant (an otter, a dog, a ReedClan cat) has words for each of its variants. */
function addVocab(v, x) {
  const union = (a, b) => [...new Set((a || []).concat(b || []))];
  Object.keys(x.sets || {}).forEach(set => {
    const S = v.sets[set] || (v.sets[set] = { cams: [], anchors: [], opts: {} }), X = x.sets[set] || {};
    S.cams = union(S.cams, X.cams); S.anchors = union(S.anchors, X.anchors); S.opts = Object.assign({}, S.opts, X.opts || {});
  });
  ['poses', 'moods', 'fx', 'cast'].forEach(k => { if (x[k]) v[k] = union(v[k], x[k]); });
  ['otherPoses', 'extras', 'variants'].forEach(k => Object.keys(x[k] || {}).forEach(w => { v[k] = v[k] || {}; v[k][w] = union(v[k][w], x[k][w]); }));
  return v;
}
function checkWords(more) {
  const { load } = require(join(ROOT, 'tests/_load.js'));
  const v = JSON.parse(JSON.stringify(load().art.vocab)), missing = [];
  if (more) addVocab(v, JSON.parse(readFileSync(resolve(more), 'utf8')));
  Object.keys(v.sets).forEach(set => {
    const S = v.sets[set];
    if (!SETS[set]) missing.push('set ' + set);
    if (!SET_TOD[set]) missing.push('set ' + set + ': its time of day');
    S.cams.forEach(cam => { if (!((SET_CAMS[set] || {})[cam] || CAMS[cam])) missing.push(set + ' camera ' + cam); });
    S.anchors.forEach(a => { if (!((SET_ANCH[set] || {})[a] || ANCH[a])) missing.push(set + ' anchor ' + a); });
    Object.keys(S.opts).forEach(k => {
      const vals = S.opts[k] === 'number' ? [3] : Array.isArray(S.opts[k]) ? S.opts[k] : [true];
      vals.forEach(val => { if (optWords(set, k, val).indexOf(k + ': ') === 0) missing.push(set + ' option ' + k + ': ' + JSON.stringify(val)); });
    });
  });
  v.poses.concat(...Object.values(v.otherPoses || {})).forEach(p => { if (!POSES[p]) missing.push('pose ' + p); });
  v.moods.forEach(m => { if (MOODS[m] == null) missing.push('mood ' + m); });
  v.fx.forEach(f => { if (!FX[f]) missing.push('effect ' + f); });
  v.cast.forEach(w => { if (!WHO[w] || !SPEAKER[w]) missing.push('cast ' + w); });
  // (chapter 5: the cast extras the art names, each value of each)
  Object.keys(v.extras || {}).forEach(k => (v.extras[k] || []).forEach(val => {
    if (!castExtraWords({ who: 'player', pose: 'sit', [k]: val }).length) missing.push('cast extra ' + k + ': ' + JSON.stringify(val));
  }));
  // (chapter 6: ReedClan's cats are told apart by coat, as the otters and the dogs are)
  Object.keys(v.variants || {}).filter(w => VARIANT_WHO[w] || VARIANT_SPEAKER[w]).forEach(w => (v.variants[w] || []).forEach(n => {
    if (!(VARIANT_WHO[w] || {})[n] || !(VARIANT_SPEAKER[w] || {})[n]) missing.push('cast ' + w + ' variant ' + n);
  }));
  if (missing.length) { console.error('No words in tools/storyboard.mjs for:\n  ' + [...new Set(missing)].join('\n  ')); process.exit(1); }
  console.log('Every set, camera, anchor, option, pose, mood, effect, cast member and cast extra has words.');
}

/* ------------------------------------------------------------------ main */
const argv = process.argv.slice(2);
if (argv[0] === '--check-words') checkWords(argv[1]);
else if (argv.length) {
  const storyPath = resolve(argv[0]);
  board(storyPath, resolve(argv[1] || resolve(ROOT, 'docs/storyboard', basename(storyPath, '.js') + '.md')));
} else {
  const dir = join(ROOT, 'app/story');
  readdirSync(dir).filter(f => /^ch\d+\.js$/.test(f)).sort().forEach(f => {
    board(join(dir, f), join(ROOT, 'docs/storyboard', basename(f, '.js') + '.md'));
  });
  // the Warrior Counts, when the story file is there
  if (readdirSync(dir).includes('warrior.js')) board(join(dir, 'warrior.js'), join(ROOT, 'docs/storyboard/warrior.md'));
}
