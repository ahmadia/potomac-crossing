#!/usr/bin/env node
/* Potomac Crossing: the verbal storyboard.
 *
 *   node tools/storyboard.mjs                                               every chapter in app/story/ -> docs/storyboard/
 *   node tools/storyboard.mjs app/story/ch02.js [docs/storyboard/ch02.md]   one chapter
 *   node tools/storyboard.mjs --check-words   every set, camera, anchor, option value, pose, mood
 *                                             and effect in the art's vocabulary has words here
 *                                             (exit 1 and a list when one hasn't; tests run it)
 *
 * Reads a chapter (the UMD story file) and writes a Markdown storyboard of every frame in reading
 * order, with each choice's branches grouped under it: the shot (the frame's `board`), the scene
 * in plain words, the captions, the balloons with who says them, the sound effect, the condition
 * a line or an option shows under (`when`), a gift, and what the reader does next (the skip-count
 * and each Counts lesson, with its questions, included). Written for an illustrator, a grown-up
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
  riverbank: ['the river path below a muddy bank', 'the glass towers shining, and upside down in the water; the tallest tower has a little red light on its roof']
};
// the art's time of day for each set when fx names none, and how a set re-reads one (camp and
// hollow draw sunset as the last golden light); the river and the sky are always night
const SET_TOD = { room: 'sunset', tower: 'sunset', garden: 'sunset', camp: 'golden', hollow: 'golden', den: 'night', sky: 'night', river: 'night',
  title: 'sunset', pile: 'morning', bridge: 'day', field: 'day', crossing: 'day', riverbank: 'day' };
const TOD_MAP = { camp: { sunset: 'golden' }, hollow: { sunset: 'golden' }, pile: { sunset: 'golden' } };
const TOD_FIXED = { sky: 'night', river: 'night' };
const TOD_WORDS = { morning: 'in the morning', day: 'by day', sunset: 'at sunset', dusk: 'at dusk', night: 'at night', golden: 'in the last golden light' };
function todOf(sc) {
  const fx = sc.fx || [];
  let t = ['night', 'dusk', 'sunset', 'morning', 'day'].find(x => fx.includes(x)) || SET_TOD[sc.set] || null;
  if (TOD_MAP[sc.set] && TOD_MAP[sc.set][t]) t = TOD_MAP[sc.set][t];
  if (TOD_FIXED[sc.set]) t = TOD_FIXED[sc.set];
  return t;
}
function setWords(sc) {
  const d = SETS[sc.set], t = TOD_WORDS[todOf(sc)];
  if (!d) return 'Set: ' + sc.set + '.';
  return cap(sc.set) + ': ' + d[0] + (t ? ', ' + t : '') + (d[1] ? ' (' + d[1] + ')' : '') + '.';
}
const CAMS = {
  wide: 'wide shot', cushion: 'medium on the cushion', glass: 'close on the glass', outside: 'looking out through the glass at the garden',
  up: 'looking up', balcony: 'close on the balcony railing, city behind', 'balcony-close': 'close on Waffles at the balcony railing, the railing below her chin, city behind', paws: 'extreme close-up of paws on grass',
  step: 'the patio step and open door, at cat height', fence: 'the row of sparrows on the fence, a cat below', lamp: 'the top of the lamp post',
  meet: 'two cats, medium', hedge: 'the gap in the hedge', reveal: 'wide establishing shot', crowd: 'the cats, staring',
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
  pile: { wide: 'wide: the pile left of centre, Clan cats crowding round, the fountain’s edge at right', close: 'close: the pile fills the panel', low: 'medium two-shot beside the pile' },
  bridge: { bank: 'wide from the riverbank, the dark space under the near end at left', mouth: 'close on the dark from outside in the sun, a rock at the shadow’s edge',
    under: 'inside the dark, her view: mud with deep drag marks running into the dark, dry ground further back, drips', back: 'the very back of the dark' },
  field: { wide: 'wide shot of the field and its fence', fence: 'close on the wire, a nose squashed through, cats on the path', dogs: 'the dogs bouncing at the fence, seen from the path' },
  crossing: { wide: 'wide shot of the point, the river and the raft', low: 'looking up from the rocks: an airplane’s belly and its row of round windows, enormous and very low',
    rocks: 'medium on the rocks', raft: 'close on the raft' },
  riverbank: { path: 'wide along the water', water: 'close at the water’s edge', roof: 'looking up the tallest tower to its roof, the red light, sky', slide: 'the muddy bank down to the water' }
};
const WHO = {
  player: 'you (the reader’s cat)', tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles',
  tallone: 'the Tall One (legs, slippers and hands only)', grizzled: 'the grizzled old tom', snorer: 'the snoring apprentice',
  mutterer: 'the muttering apprentice', snorter: 'the snorting apprentice', clancat: 'a Clan cat', sparrow: 'a sparrow', moth: 'a moth',
  riffle: 'Riffle, the otter pup', otter: 'an otter', dog: 'a dog'
};
// otters and dogs by variant, as the game names them
const VARIANT_WHO = {
  otter: { 1: 'the old ferry otter', 2: 'an otter', 3: 'another otter' },
  dog: { 1: 'the huge shaggy dog', 2: 'the spotty dog', 3: 'the tiny dog (mostly bark)' }
};
const SPEAKER = {
  player: 'You', tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles', tallone: 'The Tall One',
  grizzled: 'Grizzled old tom', snorer: 'Snoring apprentice', mutterer: 'Muttering apprentice', snorter: 'Snorting apprentice',
  clancat: 'A Clan cat', sparrow: 'Sparrow', moth: 'Moth', riffle: 'Riffle', otter: 'An otter', dog: 'A dog'
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
  bounce: 'bouncing', howl: 'howling'
};
const OTTER_STAND = 'standing up on his hind legs';
const MOODS = {
  neutral: '', happy: 'happy', dreamy: 'dreamy', wonder: 'full of wonder', worried: 'worried', scared: 'scared', sleepy: 'sleepy',
  laugh: 'laughing', stern: 'stern', kind: 'kind', proud: 'proud', sniff: 'sniffing', shout: 'shouting', solemn: 'solemn'
};
const FX = {
  sunset: 'sunset light', dusk: 'dusk', night: 'night', stars: 'stars', skyriver: 'the Sky River', rain: 'rain',
  lightning: 'lightning', glow: 'a glow', purr: 'purring lines', sparkle: 'sparkles', zzz: 'sleepy zzz', motion: 'motion lines',
  shake: 'the panel shakes', flash: 'a white flash', morning: 'morning light, washed clean after the storm', day: 'daylight',
  bonk: 'a pebble bonks off the first one’s head, little stars circling the bump'
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
  'bank-top': 'popping up over the top of the bank', slope: 'on the muddy slope', bank: 'on the bank'
};
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

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

/* A scene option in words; '' when it adds nothing to say (a default, or off). */
function optWords(set, k, v) {
  if (k === 'door') return 'the door is ' + v;
  if (k === 'reflection') return v ? 'your reflection shows in the glass' : '';
  if (k === 'clan') return v ? 'tiny Clan cats in the garden' : '';
  if (k === 'sparrows') return v + ' sparrows on the fence';
  if (k === 'lampSparrow') return v ? 'a thirteenth sparrow on the lamp' : '';
  if (k === 'dish') return v ? 'a dish of water on the step' : '';
  if (k === 'towel') return v ? 'a folded towel beside the dish' : '';
  if (k === 'moth') return v ? 'a moth' : '';
  if (k === 'marks') return v === 'auto' ? 'one claw mark on the trunk for each Count she has learned' : v + ' claw mark' + (v === 1 ? '' : 's') + ' on the trunk';
  if (k === 'glow') {
    if (v === 'auto') return 'each claw mark glows if its Count glows in the Training Hollow';
    if (Array.isArray(v)) { const on = v.map((x, i) => (x ? ORD[i + 1] || String(i + 1) : '')).filter(Boolean); return on.length ? 'the ' + on.join(' and ') + ' claw mark' + (on.length === 1 ? '' : 's') + ' glow' + (on.length === 1 ? 's' : '') : ''; }
    return v ? 'the claw mark glows' : '';
  }
  if (k === 'weather') return v === 'storm' ? 'a storm outside' : v === 'cloudy' ? 'heavy cloud hides the stars, no rain' : 'clear weather';
  if (k === 'moon') return v ? 'a moon in the sky' : 'no moon';
  if (k === 'drips') return set === 'den' ? (v ? 'sun spots and dripping leaves' : '') : (v ? 'water drips' : 'no drips');
  if (k === 'puddles') return v ? 'puddles everywhere' : '';
  if (k === 'rainFountain') return v ? 'the fountain is full of rain' : '';
  if (k === 'splash') return v ? 'a huge splash' : '';
  if (k === 'pairs') return v + ' pair' + (v === 1 ? '' : 's') + ' of prey, stacked two high';
  if (k === 'lit') return v ? 'the first ' + v + ' stack' + (v === 1 ? '' : 's') + ' glow' + (v === 1 ? 's' : '') : '';
  if (k === 'dug') return v ? 'soft, lumpy, dug-up earth behind the pile' : '';
  if (k === 'train') return v ? 'an Ironsnake (a train) crossing on top' : '';
  if (k === 'eyes') return v === 'open' ? 'two big round shining eyes at the very back' : v === 'blink' ? 'the two big eyes, blinking' : '';
  if (k === 'drag') return v ? 'deep drag marks in the mud' : 'no drag marks';
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

  /* -------------------------------------------------------------- the graph */
  function exits(f) {
    if (!f || f.end) return [];
    if (f.choice) return f.choice.options.map(o => o.next);
    if (f.input) return [f.input.next];
    if (f.look) return [f.look.next];
    if (f.counts) return [f.counts.next];
    if (f.skip) return [f.skip.next];
    return f.next ? [f.next] : [];
  }
  function reach(id) {
    const order = [], seen = new Set([id]), queue = [id];
    while (queue.length) {
      const n = queue.shift(); order.push(n);
      for (const m of exits(F[n])) if (m && F[m] && !seen.has(m)) { seen.add(m); queue.push(m); }
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
    return POSES[c.pose] || c.pose;
  }
  // the cast extras the art draws (docs/build.md, "Chapter 2"): flat ears, the stone, her own purr, the pouf
  function extraWords(c) {
    const out = [];
    if (c.flatEars) out.push('ears laid flat');
    if (c.holds === 'stone') out.push(['stand', 'walk', 'peer', 'stretch'].includes(c.pose) && !c.holdAt ? 'carrying Riffle’s stone in the mouth' : 'Riffle’s stone at the front paws');
    if (c.purr) out.push('purring (the purr lines come from this one alone)');
    if (c.lift) out.push('lifted onto a pouf, the face above the rail');
    return out;
  }
  function sceneWords(sc) {
    if (!sc) return 'No scene: a plain panel.';
    const parts = [];
    parts.push(setWords(sc));
    if (sc.cam) parts.push('Camera: ' + ((SET_CAMS[sc.set] || {})[sc.cam] || CAMS[sc.cam] || sc.cam) + ' (`' + sc.cam + '`).');
    const cast = (sc.cast || []).map(c => {
      const bits = [whoWords(c)];
      const where = c.at && typeof c.at === 'object' ? 'at a spot of this frame’s own (x ' + c.at.x + ', y ' + c.at.y + ')' : ANCH[c.at] || (c.at ? 'at ' + c.at : null);
      const how = [poseWords(c), c.mood ? (MOODS[c.mood] != null ? MOODS[c.mood] : c.mood) : null, where, c.facing ? 'facing ' + c.facing : null]
        .concat(extraWords(c)).filter(Boolean).join(', ');
      const coat = c.variant && !VARIANT_WHO[c.who] ? ', coat ' + c.variant : '';
      if (how || coat) bits.push('(' + how + (c.size && c.size !== 1 ? ', size ×' + c.size : '') + coat + ')');
      return bits.join(' ');
    });
    parts.push(cast.length ? 'Cast: ' + cast.join('; ') + '.' : 'No one in shot.');
    const o = sc.opts || {};
    const opts = Object.keys(o).map(k => optWords(sc.set, k, o[k])).filter(Boolean);
    if (opts.length) parts.push('Also: ' + opts.join('; ') + '.');
    const fx = (sc.fx || []).map(x => FX[x] || x);
    if (fx.length) parts.push('Effects: ' + fx.join(', ') + '.');
    return parts.join(' ');
  }
  function speaker(b) {
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
    if (Array.isArray(x.who) && x.who.length) notes.push('its own cats in the picture');
    if (x.lit) notes.push('the first ' + x.lit + ' lit as it is asked');
    if (x.light) notes.push(x.light === 'rows' ? 'lit a row at a time as it is asked' : 'lit a group at a time as it is asked');
    if (x.prompt != null) notes.push('its own question' + (x.retryPrompt ? ', kept on its retry' : ''));
    else if (x.retryPrompt != null && x.retryPrompt !== true) notes.push('its own question on its retry');
    if (x.right != null) notes.push('its own lines after a right answer');
    if (x.rightAgain != null) notes.push('its own lines after a right retry');
    if (x.rightPicture) notes.push('then regrouped');
    if (x.check) notes.push('a check: a right one never makes the fact hard');
    return x.a + ' × ' + x.b + (notes.length ? ' (' + notes.join('; ') + ')' : '');
  }
  function pictureWords(p) {
    if (!p) return '';
    const bits = [p.kind === 'prey' ? 'prey' : 'cats'];
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
    const set = (story.counts || {})[f.counts.set] || {};
    const facts = (set.facts || []).map(factLabel).join(', ');
    const out = ['**Then the Counts lesson** `' + f.counts.set + '` (' + (set.things || 'things') + (set.picture ? ', ' + pictureWords(set.picture) : '') + '): ' + facts + '.'];
    if (set.warmHard) out[0] += ' It adapts: a ' + (set.warmHard.table || set.table) + 's fact that was hard for her last time takes question ' + ((set.warmHard.at || 0) + 1) + (set.warmHard.alt ? ', and its twin becomes ' + fact(set.warmHard.alt).a + ' × ' + fact(set.warmHard.alt).b : '') + '.';
    out[0] += ' She types each answer on the keypad; a miss gets the sand count and comes back two questions later' +
      (set.fillFrom ? ' (the questions in between come from `' + set.fillFrom + '`, never a pair asked already while there is another, each asked in that lesson’s picture and words' +
        (set.fillIntro ? ' after “' + q(set.fillIntro) + '”' : '') + ')' : '') + '. On to ' + f.counts.next + '.';
    const lines = [];
    (set.facts || []).forEach(x => {
      x = fact(x);
      if (x.prompt != null) {
        lines.push('- Asking ' + x.a + ' × ' + x.b + ':');
        if (typeof x.prompt === 'string') lines.push('  - **' + (SPEAKER[set.teacher] || 'Tallyheart') + '**: “' + q(x.prompt) + '”');
        else lines.push(...balloonLines(x.prompt, f));
      }
      const rp = x.retryPrompt === true ? x.prompt : x.retryPrompt;
      if (rp != null && rp !== false) {
        lines.push('- Asking ' + x.a + ' × ' + x.b + ' again after a miss:');
        if (typeof rp === 'string') lines.push('  - **' + (SPEAKER[set.teacher] || 'Tallyheart') + '**: “Here’s that one again. ' + q(rp) + '”');
        else lines.push('  - **' + (SPEAKER[set.teacher] || 'Tallyheart') + '**: “Here’s that one again.”', ...balloonLines(rp, f));
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
    });
    if (set.done) lines.push('- At the end: “' + q(set.done) + '”');
    if (lines.length) out.push('', lines.join('\n'));
    return out.join('\n');
  }
  function skipWords(f) {
    const s = f.skip, t = s.table || 2, g = s.groups || 5;
    const nums = Array.from({ length: g }, (_, i) => (i + 1) * t).join(', ');
    const who = (s.who || []).map(c => (c.who === 'clancat' ? 'a Clan cat' + (c.variant ? ' (coat ' + c.variant + ')' : '') : whoWords(c))).join(', ');
    return '**Then she counts by ' + t + 's** (the skip-count): ' + g + ' taps, one on each ' + (t === 2 ? 'cat' : 'group') + ' in turn (the next one glows; a tap anywhere else makes it wiggle), each lighting its ' + t + ' and adding its running total: ' + nums + '. Nothing can be got wrong, and nothing is logged.' +
      (who ? ' In the picture, left to right: ' + who + '.' : '') +
      (s.done ? ' Then: “' + q(s.done) + '”, and Next. On to ' + s.next + '.' : ' The last tap turns the page to ' + s.next + ', which shows the ' + (g * t) + '.');
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
    out.push('**Scene.** ' + sceneWords(f.scene));
    if (f.image) out.push('', '**Image.** `' + f.image + '` replaces the drawn panel.');
    const caps = asList(f.caption).map(c => (typeof c === 'string' ? { text: c } : c || {}));
    if (caps.length) { out.push(''); out.push('**Captions**'); out.push(''); out.push(caps.map(c => '> ' + q(c.text) + onlyIf(c.when)).join('\n>\n')); }
    const say = withVariants(f, asList(f.say));
    if (say.length) {
      out.push(''); out.push('**Balloons**'); out.push('');
      say.forEach(b => out.push('- **' + speaker(b) + '**' + kindWord(b.kind) + ': “' + q(b.text) + '”' + onlyIf(b.when)));
    }
    if (f.sfx) { out.push(''); out.push('**Sound effect:** ' + q(f.sfx)); }
    const into = ids0.find(k => F[k].skip && F[k].skip.next === id);
    if (into) { const sk = F[into].skip; out.push('', '**The count:** the skip-count’s ' + ((sk.groups || 5) * (sk.table || 2)) + ' (from ' + into + ') shows big over the picture, in the times-table font.'); }
    if (f.gift) {
      const g = E && E.gift(f.gift);
      out.push('', '**Gift:** ' + (g ? g.name + ' (from ' + g.from + ', `' + f.gift + '`)' : '`' + f.gift + '` (not in E.GIFTS)') +
        ' goes in her nest the first time she reaches this panel. My nest shows it under “From friends”; Back never takes it away.');
    }
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
            (b.option.when ? ' *This option shows only if ' + whenWords(b.option.when) + '.*' : ''));
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
  let choices = 0, inputs = 0, looks = 0, counts = 0, skips = 0, gifts = 0, sfx = 0, words = 0, balloons = 0, captions = 0, conditional = 0;
  for (const id of ids) {
    const f = F[id];
    if (f.scene && f.scene.set) setCount[f.scene.set] = (setCount[f.scene.set] || 0) + 1;
    if (f.choice) { choices++; f.choice.options.forEach(o => { if (o.when) conditional++; }); }
    if (f.input) inputs++;
    if (f.look) looks++;
    if (f.counts) counts++;
    if (f.skip) skips++;
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
  md.push('Where the reader makes a choice, each option’s frames are grouped under a **Branch** heading, and the branches meet again at the frame named after them. `{name}` is the first part of her Clan name (Moon makes Moonpaw), `{petname}` is what her Tall One calls her, and `{they}`/`{them}`/`{their}` become she/her/her or he/him/his.');
  md.push('');
  md.push('## At a glance');
  md.push('');
  md.push('| | |');
  md.push('|---|---|');
  md.push('| Frames | ' + ids.length + ' (' + mainLine + ' on the main line, ' + branchFrames + ' in branches) |');
  md.push('| One read-through | ' + (mainLine + shortest) + (longest !== shortest ? '–' + (mainLine + longest) : '') + ' panels, depending on her choices |');
  md.push('| Choices | ' + choices + ' |');
  md.push('| Things she types | ' + inputs + ' (' + ids.filter(id => F[id].input).map(id => F[id].input.kind).join(', ') + ') |');
  md.push('| Look chooser | ' + looks + ' |');
  md.push('| Counts lessons | ' + counts + ' (' + Object.keys(story.counts || {}).map(k => k + ': ' + ((story.counts[k].facts || []).length) + ' facts').join('; ') + ') |');
  if (skips) md.push('| Skip-counts | ' + skips + ' (' + ids.filter(id => F[id].skip).map(id => F[id].skip.groups + ' taps, by ' + F[id].skip.table + 's').join('; ') + ') |');
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
    S.anchors.forEach(a => { if (!ANCH[a]) missing.push(set + ' anchor ' + a); });
    Object.keys(S.opts).forEach(k => {
      const vals = S.opts[k] === 'number' ? [3] : S.opts[k];
      vals.forEach(val => { if (optWords(set, k, val).indexOf(k + ': ') === 0) missing.push(set + ' option ' + k + ': ' + JSON.stringify(val)); });
    });
  });
  v.poses.concat(...Object.values(v.otherPoses || {})).forEach(p => { if (!POSES[p]) missing.push('pose ' + p); });
  v.moods.forEach(m => { if (MOODS[m] == null) missing.push('mood ' + m); });
  v.fx.forEach(f => { if (!FX[f]) missing.push('effect ' + f); });
  v.cast.forEach(w => { if (!WHO[w] || !SPEAKER[w]) missing.push('cast ' + w); });
  if (missing.length) { console.error('No words in tools/storyboard.mjs for:\n  ' + [...new Set(missing)].join('\n  ')); process.exit(1); }
  console.log('Every set, camera, anchor, option, pose, mood, effect and cast member has words.');
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
