#!/usr/bin/env node
/* Potomac Crossing: the verbal storyboard.
 *
 *   node tools/storyboard.mjs                                               every chapter in app/story/ -> docs/storyboard/
 *   node tools/storyboard.mjs app/story/ch02.js [docs/storyboard/ch02.md]   one chapter
 *   node tools/storyboard.mjs --check-words   every set, camera, anchor, option value, pose, mood,
 *                                             effect and cast extra in the art's vocabulary has words here
 *                                             (exit 1 and a list when one hasn't; tests run it)
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
 * (`link.with`), and a dragonet's own pose in her book. Written for an illustrator, a grown-up
 * reading along, or anyone checking the chapter without playing it. No dependencies.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const E = require(join(ROOT, 'app/engine.js')).engine;   // for the gifts' names

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
  marsh: ['the marsh, seen from the otters’ raft', 'still water behind a low bank, reeds taller than a cat, lily pads, mist low on the water, a mud flat beside the raft with shallow water over its edge, clear enough to show the bottom; among the pale reeds one reed is paler than the rest; our cat never leaves the raft: the mud is ReedClan’s']
};
// the art's time of day for each set when fx names none, and how a set re-reads one (camp and
// hollow draw sunset as the last golden light); the river and the sky are always night
const SET_TOD = { room: 'sunset', tower: 'sunset', garden: 'sunset', camp: 'golden', hollow: 'golden', den: 'night', sky: 'night', river: 'night',
  title: 'sunset', pile: 'morning', bridge: 'day', field: 'day', crossing: 'day', riverbank: 'day', roof: 'golden', openriver: 'day', marsh: 'day' };
const TOD_MAP = { camp: { sunset: 'golden' }, hollow: { sunset: 'golden' }, pile: { sunset: 'golden' }, roof: { sunset: 'golden' } };
const TOD_FIXED = { sky: 'night', river: 'night' };
const TOD_WORDS = { morning: 'in the morning', day: 'by day', sunset: 'at sunset', dusk: 'at dusk', night: 'at night', golden: 'in the last golden light' };
// a set's own words for a time of day (the roof's gold is the afternoon's)
const SET_TOD_WORDS = { roof: { golden: 'in the gold of the afternoon' }, marsh: { day: 'in the afternoon light' },
  // (the open river has two lights: the day, and the late gold of the way home)
  openriver: { sunset: 'in the late gold of the way home', dusk: 'in the late gold of the way home', night: 'in the late gold of the way home' } };
function todOf(sc) {
  const fx = sc.fx || [];
  let t = ['night', 'dusk', 'sunset', 'morning', 'day'].find(x => fx.includes(x)) || SET_TOD[sc.set] || null;
  if (TOD_MAP[sc.set] && TOD_MAP[sc.set][t]) t = TOD_MAP[sc.set][t];
  if (TOD_FIXED[sc.set]) t = TOD_FIXED[sc.set];
  return t;
}
function setWords(sc) {
  const d = SETS[sc.set], t = (SET_TOD_WORDS[sc.set] || {})[todOf(sc)] || TOD_WORDS[todOf(sc)];
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
  den: { outside: 'outside the den, the rosebush from the front', inside: 'inside the den' },
  tower: { up: 'looking up the tower, from the ground-floor window to a balcony nineteen floors up' },
  sky: { up: 'looking up, mostly sky' },
  pile: { wide: 'wide: the pile left of centre, Clan cats crowding round, the fountain’s edge at right', close: 'close: the pile fills the panel', low: 'medium two-shot beside the pile',
    // chapter 4: the pile in rows of ten
    rows: 'from the front: the rows running back under the brambles', gap: 'close on the back row: its gap, and the earth behind it',
    scale: 'close on the “scale” where it leans in the gap', through: 'through the “scale”: the camp, wavy and a little green',
    mirror: 'into the “scale”: her own small face looking back',
    // chapter 5
    'gap-close': 'very close on the dug earth behind the gap' },
  bridge: { bank: 'wide from the riverbank, the dark space under the near end at left', mouth: 'close on the dark from outside in the sun, a rock at the shadow’s edge',
    under: 'inside the dark, her view: mud with deep drag marks running into the dark, dry ground further back, drips', back: 'the very back of the dark',
    paws: 'extreme close-up of forepaws piled together' },
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
    pole: 'from the top of Riffle’s pole, looking down and away: the mud, and two shiny lines far off', reeds: 'the stand of reeds', wisp: 'close among the reeds', draw: 'close on the mud at the reeds’ foot' }
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
  wisp: 'Wisp, a Mistscale dragonet (slighter than Sprinkle and longer in the neck, so pale the reeds show through her, pale gold eyes; she stands on one leg; she never speaks)'
};
// otters and dogs by variant, as the game names them
const VARIANT_WHO = {
  otter: { 1: 'the old ferry otter', 2: 'an otter', 3: 'another otter' },
  dog: { 1: 'the huge shaggy dog', 2: 'the spotty dog', 3: 'the tiny dog (mostly bark)' }
};
const SPEAKER = {
  player: 'You', tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles', tallone: 'The Tall One',
  grizzled: 'Grizzled old tom', snorer: 'Snoring apprentice', mutterer: 'Muttering apprentice', snorter: 'Snorting apprentice',
  clancat: 'A Clan cat', sparrow: 'Sparrow', moth: 'Moth', riffle: 'Riffle', otter: 'An otter', dog: 'A dog',
  sprinkle: 'Sprinkle', murmurchime: 'Murmurchime', reynard: 'Reynard', squall: 'Squall',
  patience: 'Patience', puddle: 'Puddle', wisp: 'Wisp'
};
const VARIANT_SPEAKER = {
  otter: { 1: 'The old ferry otter', 2: 'An otter', 3: 'An otter' },
  dog: { 1: 'The shaggy dog', 2: 'The spotty dog', 3: 'The tiny dog' }
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
  shh: 'one claw laid across her snout', nod: 'nodding, once', flinch: 'one jerk, among reeds that do not move'
};
const OTTER_STAND = 'standing up on his hind legs';
const SPRINKLE_POSE = { curl: 'curled up, her tail wrapped round whoever is beside her', flat: 'squeezed flat' };
// a pose that means something of its own for the fox or the littlest dragonet
const REYNARD_POSE = { sit: 'sitting very neatly' };
const SQUALL_POSE = { hug: 'sitting at the foot of the pole, forelegs and tail wrapped round it', pawup: 'one forepaw raised, five claws out' };
// chapter 5: poses that mean something of their own for an otter, the heron or the two dragonets found here
const OTTER_POSE = { point: 'pointing straight down', fall: 'falling over backwards' };
const PATIENCE_POSE = { stand: 'standing on one leg, neck folded', point: 'her bill pointing down at the mud', gulp: 'neck up, a fish going down as a small bump' };
const PUDDLE_POSE = { pawup: 'one forepaw raised and his chin dipping, his eyes and his grin still above the water', sit: 'sitting, his big feet out in front of him' };
const WISP_POSE = { blink: 'standing on one leg among the reeds, her eyes open', draw: 'one pale claw down in the mud, drawing', gulp: 'a small bump going down her long neck', pawup: 'one forepaw raised, five claws out, pale as frost' };
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
  'raft-edge': 'at the very edge of the raft, on the front lip of its near log, over the mud'
};
// anchor names that mean something different in a particular set
const SET_ANCH = { bridge: { beside: 'pressed against Sprinkle’s side' }, roof: { beside: 'beside the pole' },
  // chapter 5: on the open river, `pole` is the poling spot and `beside` is in the water (an otter's place, or a dragonet's)
  openriver: { pole: 'at the poling spot, at the raft’s end', beside: 'in the water beside the raft' } };
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
// chapter 5: what a one-tap frame's `tap` is, in words
const TAPS = { nose: 'the old tom’s nose', earth: 'the freshly dug earth', fur: 'the tuft of fur', mud: 'the mud', pole: 'Riffle’s pole' };

/* ------------------------------------------------------------------ helpers */
const q = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
const asList = x => (x == null ? [] : Array.isArray(x) ? x : [x]);
function factWords(k) {
  const m = /^(\d+)\s*[x×]\s*(\d+)$/.exec(String(k).trim());
  return m ? m[1] + ' × ' + m[2] : String(k);
}
/* A `when` in words: "specialty is noticing and not (the ch02-tails lesson went without help)". */
function whenWords(w) {
  if (!w || typeof w !== 'object') return '';
  return Object.keys(w).map(k => {
    const v = w[k];
    if (k === 'not') return 'not (' + whenWords(v) + ')';
    if (k === 'lessonClean') return asList(v).map(s => 'the ' + s + ' lesson went without help').join(' or ');
    if (k === 'firstTry') return asList(v).map(f => 'she got ' + factWords(f) + ' right the first time').join(' or ');
    if (Array.isArray(v)) return k + ' is ' + v.map(x => JSON.stringify(x)).join(' or ');
    if (v === true) return k + ' is true';
    if (v === false) return k + ' is false or not set';
    return k + ' is ' + JSON.stringify(v);
  }).join(' and ');
}
const onlyIf = w => (w ? ' *(only if ' + whenWords(w) + ')*' : '');
const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const numWord = n => NUMW[n] || String(n);
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
function castExtraWords(c) {
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
  if (c.wink) out.push('one slow wink');
  if (c.flick) out.push('one ear flicks');
  // chapter 5's extras
  if (c.tuck) out.push('one claw curled back in: nine out, one tucked');
  if (c.asleep) out.push('eyes shut: asleep sitting up');
  if (c.snail) out.push(c.snail === 'in' ? 'a snail on one ear, its horns pulled in' : 'a snail halfway up one ear');
  if (c.holds === 'pole') out.push(c.pose === 'hug' ? 'hugging the raft’s pole, twice his size' : 'holding the raft’s long pole');
  if (c.buzz) out.push('buzzing all over: short zigzags along the outline (shaking, with nothing blowing)');
  if (c.dragonfly) out.push(c.who === 'patience' ? 'a dragonfly asleep on her bill' : 'a dragonfly on the nose');
  if (c.glow) out.push('glowing softly: the one she taps');
  if (c.tap === 'nose' || c.tap === true) out.push('the nose is what she taps');
  if (c.tap === 'pole') out.push('the pole, where the paws hold it, is what she taps');
  if (c.reach) out.push('one forepaw held out and down over the edge, touching nothing: over a tiny print in the mud, half the paw’s size, the paw’s small shadow on it');
  return out;
}


/* A scene option in words; '' when it adds nothing to say (a default, or off). */
function optWords(set, k, v, all) {
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
  if (k === 'hidden') return v ? 'two of the pieces of bark under the moss, two corners showing' : '';
  // the row of bark's own cards and blank pieces are said with the row itself (`bark`, below)
  if (k === 'cards' || k === 'blank') return '';
  if (k === 'bark') {
    if (set === 'den') return v === 'auto' ? 'her Case File along the mossy edge of her nest: a piece of bark for each card she holds, overlapping like roof tiles' :
      v ? numWord(+v) + ' piece' + (+v === 1 ? '' : 's') + ' of bark along the mossy edge of her nest' : '';
    if (v === 'row' && all && Array.isArray(all.cards)) return sandRowWords(all.cards, all.blank);
    return v === 'falling' ? 'a curl of pale bark falling from the trunk' : v === 'sand' ? 'a curl of bark lying on the sand' : v === 'row' ? 'blank curls of bark in a row on the sand' : '';
  }
  if (k === 'marks') return v === 'auto' ? 'one claw mark on the trunk for each Count she has learned' : v + ' claw mark' + (v === 1 ? '' : 's') + ' on the trunk';
  if (k === 'glow') {
    if (v === 'auto') return 'each claw mark glows if its Count glows in the Training Hollow';
    if (Array.isArray(v)) { const on = v.map((x, i) => (x ? ORD[i + 1] || String(i + 1) : '')).filter(Boolean); return on.length ? 'the ' + on.join(' and ') + ' claw mark' + (on.length === 1 ? '' : 's') + ' glow' + (on.length === 1 ? 's' : '') : ''; }
    return v ? 'the claw mark glows' : '';
  }
  if (k === 'weather') return v === 'storm' ? 'a storm outside' : v === 'cloudy' ? 'heavy cloud hides the stars, no rain' : 'clear weather';
  // (chapter 5: a number is a crescent of that many nights, drawn a little fatter than the night before's)
  if (k === 'moon') return typeof v === 'number' ? 'a crescent moon, a little fatter than last night’s' : v ? 'a moon in the sky' : 'no moon';
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
  if (k === 'tap') return v === 'mud' ? 'a patch of the mud beside the raft is what she taps' : v === 'pole' ? 'the pole in Riffle’s paws is what she taps' : '';
  if (k === 'swept') return v ? 'the dug earth swept flat by a tail: the prints are gone' : '';
  if (k === 'tuft') return v ? 'a tuft of thin brown fur caught in the raft’s vine' : '';
  if (k === 'mudPaws') return +v ? numWord(+v) + ' little forepaws drawn in the mud, five claw marks each' : '';
  return k + ': ' + JSON.stringify(v);
}
/* ------------------------------------------------------------------ one chapter */
function board(storyPath, outPath) {
  const PC = require(storyPath);
  const stories = (PC && PC.story) || (globalThis.PC && globalThis.PC.story) || {};
  const story = stories[basename(storyPath, '.js')] || Object.values(stories)[0];
  if (!story || !story.frames) {
    console.error('No story found in ' + storyPath);
    process.exit(1);
  }
  const F = story.frames;
  const ids0 = Object.keys(F);
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
  function walk(start, stopAt, seen) {
    const items = [];
    let id = start;
    while (id && F[id] && id !== stopAt && !seen.has(id)) {
      seen.add(id);
      const f = F[id];
      items.push({ frame: id });
      if (f.choice) {
        const targets = f.choice.options.map(o => o.next);
        const merge = mergePoint(targets);
        const branches = f.choice.options.map(o => ({ option: o, items: walk(o.next, merge, new Set(seen)) }));
        branches.forEach(b => b.items.forEach(function mark(it) { if (it.frame) seen.add(it.frame); if (it.branches) it.branches.forEach(bb => bb.items.forEach(mark)); }));
        items.push({ choice: id, branches, merge });
        id = merge;
      } else id = exits(f)[0];
    }
    return items;
  }
  const order = walk(story.start, null, new Set());

  /* -------------------------------------------------------------- text */
  function whoWords(c) {
    if (c.who === 'player') return 'you';
    if (VARIANT_WHO[c.who]) return VARIANT_WHO[c.who][c.variant || 1] || WHO[c.who];
    return WHO[c.who] || c.who;
  }
  function poseWords(c) {
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
    return POSES[c.pose] || c.pose;
  }
  const extraWords = castExtraWords;
  function sceneWords(sc) {
    if (!sc) return 'No scene: a plain panel.';
    const parts = [];
    parts.push(setWords(sc));
    if (sc.cam) parts.push('Camera: ' + ((SET_CAMS[sc.set] || {})[sc.cam] || CAMS[sc.cam] || sc.cam) + ' (`' + sc.cam + '`).');
    const cast = (sc.cast || []).map(c => {
      const bits = [whoWords(c)];
      const where = c.at && typeof c.at === 'object' ? 'at a spot of this frame’s own (x ' + c.at.x + ', y ' + c.at.y + ')' : (SET_ANCH[sc.set] || {})[c.at] || ANCH[c.at] || (c.at ? 'at ' + c.at : null);
      const how = [poseWords(c), c.mood ? (MOODS[c.mood] != null ? MOODS[c.mood] : c.mood) : null, where, c.facing ? 'facing ' + c.facing : null]
        .concat(extraWords(c)).filter(Boolean).join(', ');
      const coat = c.variant && !VARIANT_WHO[c.who] ? ', coat ' + c.variant : '';
      if (how || coat) bits.push('(' + how + (c.size && c.size !== 1 ? ', size ×' + c.size : '') + coat + ')');
      return bits.join(' ');
    });
    parts.push(cast.length ? 'Cast: ' + cast.join('; ') + '.' : 'No one in shot.');
    const o = sc.opts || {};
    const opts = Object.keys(o).map(k => optWords(sc.set, k, o[k], o)).filter(Boolean);
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
  function factLabel(f) {
    const x = fact(f);
    const notes = [];
    if (x.table) notes.push('from the ' + x.table + 's');
    if (x.groups != null || x.per != null) notes.push('pictured as ' + (x.groups != null ? x.groups : '?') + ' × ' + (x.per != null ? x.per : '?'));
    if (x.picture) notes.push(pictureWords(x.picture));
    if (Array.isArray(x.who) && x.who.length) notes.push(x.who.every(c => c && c.who === 'sprinkle') ? 'Sprinkle’s own forepaws in the picture' : 'its own cats in the picture');
    if (x.lit) notes.push('the first ' + x.lit + ' lit as it is asked');
    if (x.light) notes.push(x.light === 'rows' ? 'lit a row at a time as it is asked' : x.light === 'tuck' ? 'the hop and the tuck as it is asked' : 'lit a group at a time as it is asked');
    if (x.prompt != null) notes.push('its own question' + (x.retryPrompt === true ? ', kept on its retry' : x.retryPrompt ? ', and another of its own on its retry' : ''));
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
  function pictureWords(p) {
    if (!p) return '';
    const grit = p.kind === 'grit' || (p.kind === 'mud' && p.ground === 'grit');
    // chapter 5: fish (in pairs, or on strings), the raft's logs from underneath, herons scratched in the mud
    const five = p.kind === 'fish' ? (p.layout === 'strings' ? 'fish on reed strings' : 'fish in pairs') : p.kind === 'bumps' ? 'the raft from underneath, bump stars on its logs' : p.kind === 'herons' ? 'little herons scratched in the mud' : null;
    const bits = [five || (p.kind === 'prey' ? 'prey' : grit ? 'forepaws scratched in the roof’s grit' : p.kind === 'mud' ? 'forepaws drawn in the mud' : 'cats')];
    if (p.layout === 'rows') bits.push('in rows');
    if (p.thought) bits.push('in a thought cloud');
    return bits.join(' ');
  }
  // a prompt's lines: balloons with their speakers, and (kind 'caption') narration in a caption box
  function balloonLines(list, f) {
    return withVariants(f || {}, asList(list)).map(b => b.kind === 'caption' ? '  - *Caption*: ' + q(b.text)
      : '  - **' + speaker(b) + '**' + kindWord(b.kind) + ': “' + q(b.text) + '”');
  }
  function countsWords(f) {
    // chapter 5: a Counts frame may run another chapter's set (the roof, found later: chapter 4's riddle)
    const own = (story.counts || {})[f.counts.set], found = own || E.countsSet(f.counts.set, story, siblings()), set = found || {};
    if (!found) return '**Then the Counts lesson** `' + f.counts.set + '`, another chapter’s, run here as it is there (see that chapter’s storyboard). On to ' + f.counts.next + '.';
    const facts = (set.facts || []).map(factLabel).join(', ');
    const out = ['**Then the Counts lesson** `' + f.counts.set + '`' + (own ? '' : ', another chapter’s, run here as it is there') + ' (' + (set.things || 'things') + (set.picture ? ', ' + pictureWords(set.picture) : '') + '): ' + facts + '.'];
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
    if (f.counts.intro === false) out[0] += ' None of this frame’s own lines is said again over the first question: it is asked in the engine’s own words, and timed on itself.';
    // where a miss is scratched, and who keeps the count (chapter 3's keys; a set without them reads as chapter 2's)
    const GROUND = { sand: 'on the sand', earth: 'in the earth', mud: 'in the mud', grit: 'in the roof’s grit', log: 'on a log of the raft' };
    // chapter 5: a help that scratches nothing (`help: 'picture'`: the set's own picture lit a group at a time);
    // the 9s' help in two phases; a log of the raft; a set nobody swipes in
    const missWords = set.help === 'picture' ? 'a miss gets the set’s own picture lit a group at a time, the player keeping the count,' :
      set.ground || set.helpCounter ? 'a miss gets the count scratched ' + (GROUND[set.ground] || 'on the sand') +
      (set.helpCounter === 'you' ? ', ' + (set.ground === 'log' ? 'the player scratching and keeping the count herself' : (SPEAKER[set.teacher] || 'the teacher') + ' swiping and the player keeping the count') : '') + ',' :
      set.table === 9 ? 'a miss gets the sand count in two steps (two swipes for every cat, hopped by tens; then one line rubbed out of every pair, stepping back by ones)' : 'a miss gets the sand count';
    out[0] += ' She types each answer on the keypad; ' + missWords + ' and comes back two questions later' +
      (set.fillFrom ? ' (the questions in between come from `' + set.fillFrom + '`' + (set.fillOrder === 'easiest' ? ', the easiest first' : '') +
        ', never a pair asked already while there is another, each asked ' + (set.fillPicture === 'borrower' ? 'as this lesson’s own question, in its picture and its voice' :
        'in that lesson’s picture and ' + (set.fillVoice === 'borrower' ? 'this lesson’s own voice' : 'words')) +
        (set.fillIntro ? ' after “' + q(set.fillIntro) + '”' : '') + ')' : set.fillOrder === 'easiest' ? ' (the questions in between are the easiest of her right answers in this lesson, not the latest)' : '') + '. On to ' + f.counts.next + '.';
    const lines = [];
    (set.facts || []).forEach(x => {
      x = fact(x);
      if (x.prompt != null) {
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
    if (s.paws === 'both') {
      return '**Then she hops by ' + t + 's on both forepaws** (the skip-count): ' + g + ' taps, her own two forepaws patted down together each time (they glow; a tap anywhere else makes them wiggle), each lighting all ' + numWord(t) + ' claws' + (t === 9 ? ' (one claw stays tucked in)' : '') + ' and putting the next number in her own murmur: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
        (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : turns) + more;
    }
    if (s.paws === 'pile') {
      return '**Then she hops by ' + t + 's on the pile of forepaws** (the skip-count): ' + g + ' taps, one for each friend (the next pair of forepaws glows; a tap anywhere else makes it wiggle), each lighting that friend’s ' + numWord(t) + ' claws and putting the next number in her own balloon: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
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
    return '**Then she counts by ' + t + 's** (the skip-count): ' + g + ' taps, one on each ' + (t === 2 ? 'cat' : t === 5 ? 'raised forepaw' : 'group') + ' in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting its ' + (t === 5 ? 'five claws' : t) + ' and adding its running total: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
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
  /* The pages she taps (chapter 4): the row of bark, her first tap on the one curl, the glint. */
  function scratchWords(f) {
    const s = f.scratch;
    const tail = (s.prompt ? ' The instruction under the panel: “' + q(s.prompt).replace(/\*\*/g, '') + '”' : '') + (s.label ? ' For VoiceOver, a hidden button: “' + q(s.label) + '”' : '');
    // chapter 5: one tap on anything else in a scene (the old tom's nose, a tuft of fur, a patch of mud):
    // the page's own soft glow on it, and a small answer to a tap anywhere else
    if (s.tap && s.tap !== 'glint') {
      return '**Then she taps ' + (TAPS[s.tap] || 'the ' + q(s.tap)) + '** (one tap, on this scene): it glows softly; a tap on it turns the page to ' + s.next +
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
  function askWords(f) {
    const a = f.ask, pairs = asList(a.pairs), n = pairs.length, who = SPEAKER[a.who] || a.who, to = SPEAKER[a.to] || a.to;
    return '**Then she taps ' + who + ', once for each question** (' + numWord(n) + ' taps, on this scene, counting nothing): ' + who + ' glows softly; a tap on him letters his next question in his balloon and ' + to + '’s answer in hers, and adds one to what the scene shows is owed (a pair of fish in the thought cloud over the heron); the pairs before stay under the panel, small, to read back. A tap anywhere else makes him hop. No number is shown, nothing can be got wrong, and nothing is logged. After the last one: Next → ' + a.next + '.' +
      (a.prompt ? ' The instruction under the panel: “' + q(a.prompt).replace(/\*\*/g, '') + '”' : '') + (a.label ? ' For VoiceOver, a hidden button: “' + q(a.label) + '”' : '') +
      '\n\n' + pairs.map((pr, i) => (i + 1) + '. **' + who + '**: “' + q(pr[0]) + '” **' + to + '**: “' + q(pr[1]) + '”').join('\n');
  }
  function fileWords(f) {
    const p = f.file && f.file.prompt ? f.file.prompt : '**Tap** your Case File. You can open it any time.';
    return '**Then she opens her Case File, for the first time**: its curl of bark has appeared in the top bar, glowing (and is there on every page from now on). The instruction under the panel: “' + q(p).replace(/\*\*/g, '') +
      '” A tap on the curl opens the real screen: her cards on moss, under “What I saw myself” and “What I was told (to check)”. Closing it turns the page to ' + f.file.next + '.';
  }
  function interaction(f) {
    if (f.end) return '**Then:** the chapter ends, and her book opens at this chapter’s page: the recap of the reader’s choices and the dream line.';
    if (f.choice) return '**Then she chooses** (see the branches below).';
    if (f.input) {
      const k = f.input.kind, s = (f.input.suggestions || []).join(' · ');
      if (k === 'petname') return '**Then she picks or types her pet name** (' + s + '), then on to ' + f.input.next + '.';
      if (k === 'clanname') return '**Then she types the first part of her Clan name**, with a live preview (“You will be: Moonpaw”); ideas only if she asks (' + s + '). On to ' + f.input.next + '.';
      if (k === 'dream') return '**Then she may type a dream for her book**, or skip. On to ' + f.input.next + '.';
      return '**Then she types** (' + k + '). On to ' + f.input.next + '.';
    }
    if (f.look) return '**Then she chooses her look in the reflection**: she-cat or tom, fur, marking, eyes; the reflection redraws as she picks. On to ' + f.look.next + '.';
    if (f.counts) return countsWords(f);
    if (f.skip) return skipWords(f);
    if (f.scratch) return scratchWords(f);
    if (f.file) return fileWords(f);
    if (f.ask) return askWords(f);
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
    if (f.when) out.push('**Shows only if** ' + whenWords(f.when) + '; otherwise the page turns straight on to ' + (f.else || exits(f)[0]) + '.', '');
    out.push('**Scene.** ' + sceneWords(f.scene));
    if (f.image) out.push('', '**Image.** `' + f.image + '` replaces the drawn panel.');
    const caps = asList(f.caption).map(c => (typeof c === 'string' ? { text: c } : c || {}));
    if (caps.length) { out.push(''); out.push('**Captions**'); out.push(''); out.push(caps.map(c => '> ' + q(c.text) + onlyIf(c.when)).join('\n>\n')); }
    const say = withVariants(f, asList(f.say));
    if (say.length) {
      out.push(''); out.push('**Balloons**'); out.push('');
      say.forEach(b => out.push('- **' + speaker(b) + '**' + kindWord(b.kind) + ': “' + q(b.text) + '”' + onlyIf(b.when) +
        (b.digits ? ' *(lettered small beside it, in Andika: ' + q(b.digits) + ')*' : '')));
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
    const kept = E.keptSkip(story, id);
    if (kept && kept.skip.tuck) out.push('', '**The picture stays:** in place of this scene, the counting picture from ' + kept.id + ', nine claws lit and one tucked in on every cat, ' + ((kept.skip.groups || 5) * 9) + ' over them and no number under any cat' + (f.counts ? ', until the lesson starts' : '') + '; the balloons sit beside it.');
    else if (kept) out.push('', '**The totals stay:** in place of this scene, the counting picture from ' + kept.id + ', every ' + (kept.skip.table === 5 ? 'paw' : kept.skip.table === 10 ? 'cat' : 'group') + ' lit, its running totals (' +
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
            (b.option.when ? ' *This option shows only if ' + whenWords(b.option.when) + '.*' : '') +
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
  let choices = 0, inputs = 0, looks = 0, counts = 0, skips = 0, gifts = 0, sfx = 0, words = 0, balloons = 0, captions = 0, conditional = 0, taps = 0;
  for (const id of ids) {
    const f = F[id];
    if (f.scene && f.scene.set) setCount[f.scene.set] = (setCount[f.scene.set] || 0) + 1;
    if (f.choice) { choices++; f.choice.options.forEach(o => { if (o.when) conditional++; }); }
    if (f.input) inputs++;
    if (f.look) looks++;
    if (f.counts) counts++;
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
  md.push('- **Then**: what the reader does next (tap Next, choose, type, pick a look, count by twos, or do a Counts lesson).');
  md.push('');
  md.push('Where the reader makes a choice, each option’s frames are grouped under a **Branch** heading, and the branches meet again at the frame named after them. `{name}` is the first part of her Clan name (Moon makes Moonpaw), `{petname}` is what her Tall One calls her, and `{they}`/`{them}`/`{their}` become she/her/her or he/him/his.' +
    (/\{(Murmur|murmur|MURMUR)\}/.test(JSON.stringify(story)) ? ' `{Murmur}`/`{murmur}` is the tortoiseshell’s name word: Murmur (Murmurpaw, Murmurchime, murmuring), or Mutter for a reader whose own Clan name is Murmur.' : ''));
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
  md.push('| Counts lessons | ' + counts + ' (' + Object.keys(story.counts || {}).map(k => k + ': ' + ((story.counts[k].facts || []).length) + ' facts').join('; ') + ') |');
  // (chapter 5: a count as long as the cats it is for has no number of taps of its own; the tuck counts back)
  const skipTaps = sk => (sk.groups == null ? (asList(sk.who).filter(c => !c.when).length || 1) + ' to ' + asList(sk.who).length + ' taps, by ' : sk.groups + (sk.groups === 1 ? ' tap, by ' : ' taps, by ')) + (sk.tuck ? 'ones, back from ' + sk.groups * 10 : sk.table + 's');
  if (skips) md.push('| Skip-counts | ' + skips + ' (' + ids.filter(id => F[id].skip).map(id => skipTaps(F[id].skip)).join('; ') + ') |');
  if (taps) md.push('| Other things she taps | ' + ids.filter(id => F[id].scratch || F[id].file || F[id].ask).map(id => (F[id].file ? 'her Case File' : F[id].ask ? (SPEAKER[F[id].ask.who] || F[id].ask.who) + '’s ' + numWord(asList(F[id].ask.pairs).length) + ' questions' :
    F[id].scratch.tap ? (F[id].scratch.tap === 'glint' ? 'the glitter' : TAPS[F[id].scratch.tap] || 'the ' + F[id].scratch.tap) :
    F[id].scratch.draws && !cardList(F[id].scratch.cards).length ? 'the bark' : 'a row of bark') + ' (' + id + ')').join(', ') + ' |');
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
      if (c.link && asList(c.link.with).length) notes.push('drawn touching ' + asList(c.link.with).map(a => '`' + a + '`').join(', ') + (c.link.when ? ' once ' + whenWords(c.link.when) : ' from the moment she holds both') + ': “' + q(c.link.line || 'They can’t both be true.') + '”');
      else if (c.link) notes.push('drawn touching ' + (asList(c.answers).length ? 'them' : 'its answers') + (c.link.when ? ' once ' + whenWords(c.link.when) : '') + ': “' + q(c.link.line || 'They can’t both be true.') + '”');
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
    md.push('');
    asList(story.book.dragonet).forEach(dn => {
      md.push('**A dragonet page:** ' + q(dn.name) + ' (`' + dn.id + '`), found in this chapter' + (dn.when ? ' by a reader whose ' + whenWords(dn.when) + ' (the page is there only then)' : '') +
        '. Her book gains a page for ' + q(dn.name) + (dn.pose ? ' (drawn ' + (((dn.id === 'puddle' ? PUDDLE_POSE : dn.id === 'wisp' ? WISP_POSE : {})[dn.pose]) || POSES[dn.pose] || dn.pose) + ')' : '') +
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
 * anchor, camera, option, pose, mood or effect with no words here would print as its bare id. */
function checkWords() {
  const { load } = require(join(ROOT, 'tests/_load.js'));
  const v = load().art.vocab, missing = [];
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
  if (missing.length) { console.error('No words in tools/storyboard.mjs for:\n  ' + [...new Set(missing)].join('\n  ')); process.exit(1); }
  console.log('Every set, camera, anchor, option, pose, mood, effect, cast member and cast extra has words.');
}

/* ------------------------------------------------------------------ main */
const argv = process.argv.slice(2);
if (argv[0] === '--check-words') checkWords();
else if (argv.length) {
  const storyPath = resolve(argv[0]);
  board(storyPath, resolve(argv[1] || resolve(ROOT, 'docs/storyboard', basename(storyPath, '.js') + '.md')));
} else {
  const dir = join(ROOT, 'app/story');
  readdirSync(dir).filter(f => /^ch\d+\.js$/.test(f)).sort().forEach(f => {
    board(join(dir, f), join(ROOT, 'docs/storyboard', basename(f, '.js') + '.md'));
  });
}
