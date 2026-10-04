#!/usr/bin/env node
/* Potomac Crossing: the verbal storyboard.
 *
 *   node tools/storyboard.mjs [app/story/ch01.js] [docs/storyboard/ch01.md]
 *
 * Reads a chapter (the UMD story file) and writes a Markdown storyboard of every frame in reading
 * order, with each choice's branches grouped under it: the shot (the frame's `board`), the scene
 * in plain words, the captions, the balloons with who says them, the sound effect, and what the
 * reader does next. Written for an illustrator, a grown-up reading along, or anyone checking the
 * chapter without playing it. No dependencies.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const storyPath = resolve(process.argv[2] || resolve(ROOT, 'app/story/ch01.js'));
const outPath = resolve(process.argv[3] || resolve(ROOT, 'docs/storyboard', basename(storyPath, '.js') + '.md'));

const PC = require(storyPath);
const stories = (PC && PC.story) || (globalThis.PC && globalThis.PC.story) || {};
const story = stories[basename(storyPath, '.js')] || Object.values(stories)[0];
if (!story || !story.frames) {
  console.error('No story found in ' + storyPath);
  process.exit(1);
}

/* ------------------------------------------------------------------ plain words (docs/build.md) */
const SETS = {
  room: 'the ground-floor home at dusk (tall glass patio door, round cushion, lamp, rug, plants; through the glass: lawn, hedge, fence, lamp post, glowing glass towers, airplanes)',
  tower: 'outside, looking up a glass tower at dusk (balconies, one ground-floor window)',
  garden: 'the lawn between the patio and the hedge at dusk (fence with sparrows, lamp post, hedge with a gap, patio step)',
  camp: 'CrystalClan’s camp, the wild garden behind the hedge in the last golden light (bramble dens, ferns, mossy stone paths, a dry stone fountain, glass towers all around)',
  hollow: 'the Training Hollow, a sandy hollow at the edge of camp under an old leaning tree, with a sun patch',
  den: 'the apprentices’ den under an enormous rosebush, at night',
  sky: 'the night sky over camp and the Sky River (the Milky Way)',
  river: 'from the camp’s edge toward the river at night: the Old Bridge’s dark shape, the water',
  title: 'the river at dusk, glass towers, a bridge, one cat on a wall'
};
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
  sky: { up: 'looking up, mostly sky' }
};
const WHO = {
  player: 'you (the reader’s cat)', tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles',
  tallone: 'the Tall One (legs, slippers and hands only)', grizzled: 'the grizzled old tom', snorer: 'the snoring apprentice',
  mutterer: 'the muttering apprentice', snorter: 'the snorting apprentice', clancat: 'a Clan cat', sparrow: 'a sparrow', moth: 'a moth'
};
const SPEAKER = {
  player: 'You', tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles', tallone: 'The Tall One',
  grizzled: 'Grizzled old tom', snorer: 'Snoring apprentice', mutterer: 'Muttering apprentice', snorter: 'Snorting apprentice',
  clancat: 'A Clan cat', sparrow: 'Sparrow', moth: 'Moth'
};
const POSES = {
  sit: 'sitting', stand: 'standing', walk: 'walking', crouch: 'crouching', curl: 'curled up', loaf: 'tucked into a loaf',
  lookup: 'looking up', flat: 'pressed flat', lie: 'lying down', fall: 'tumbling over laughing', stretch: 'stretching up',
  peer: 'peering', perch: 'perched', fluffed: 'fluffed up', fly: 'flying', water: 'watering the plants', 'set-dish': 'setting down a dish'
};
const MOODS = {
  neutral: '', happy: 'happy', dreamy: 'dreamy', wonder: 'full of wonder', worried: 'worried', scared: 'scared', sleepy: 'sleepy',
  laugh: 'laughing', stern: 'stern', kind: 'kind', proud: 'proud', sniff: 'sniffing', shout: 'shouting', solemn: 'solemn'
};
const FX = {
  sunset: 'sunset light', dusk: 'dusk', night: 'night', stars: 'stars', skyriver: 'the Sky River', rain: 'rain',
  lightning: 'lightning', glow: 'a glow', purr: 'purring lines', sparkle: 'sparkles', zzz: 'sleepy zzz', motion: 'motion lines',
  shake: 'the panel shakes', flash: 'a white flash'
};
const ANCH = {
  cushion: 'on the cushion', floor: 'on the floor', glass: 'at the glass', doorway: 'in the doorway', window: 'behind the ground-floor window',
  railing: 'at the balcony railing', step: 'on the patio step', lawn: 'on the lawn', 'fence-foot': 'at the foot of the fence',
  'lamp-top': 'on top of the lamp post', 'hedge-gap': 'at the gap in the hedge', entrance: 'at the camp entrance',
  'fountain-top': 'on top of the fountain', 'fountain-foot': 'at the foot of the fountain', 'crowd-left': 'in the crowd, left',
  'crowd-right': 'in the crowd, right', ferns: 'in the ferns', center: 'in the middle of camp', 'sand-left': 'on the sand, left',
  'sand-right': 'on the sand, right', sunpatch: 'in the sun patch', tree: 'by the tree', 'entrance-left': 'at the entrance, left',
  'entrance-right': 'at the entrance, right', nest: 'in the nest', 'sleeper-1': 'in a nest, left', 'sleeper-2': 'in a nest, right',
  'ground-left': 'on the ground, left', 'ground-right': 'on the ground, right', wall: 'on the wall'
};

/* ------------------------------------------------------------------ the graph */
const F = story.frames;
function exits(f) {
  if (!f || f.end) return [];
  if (f.choice) return f.choice.options.map(o => o.next);
  if (f.input) return [f.input.next];
  if (f.look) return [f.look.next];
  if (f.counts) return [f.counts.next];
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

/* ------------------------------------------------------------------ text */
const q = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
function sceneWords(sc) {
  if (!sc) return 'No scene: a plain panel.';
  const parts = [];
  parts.push((SETS[sc.set] ? cap(sc.set) + ': ' + SETS[sc.set] : 'Set: ' + sc.set) + '.');
  if (sc.cam) parts.push('Camera: ' + ((SET_CAMS[sc.set] || {})[sc.cam] || CAMS[sc.cam] || sc.cam) + ' (`' + sc.cam + '`).');
  const cast = (sc.cast || []).map(c => {
    const bits = [c.who === 'player' ? 'you' : (WHO[c.who] || c.who)];
    const how = [POSES[c.pose] || c.pose, c.mood ? (MOODS[c.mood] != null ? MOODS[c.mood] : c.mood) : null, ANCH[c.at] || (c.at ? 'at ' + c.at : null), c.facing ? 'facing ' + c.facing : null]
      .filter(Boolean).join(', ');
    if (how) bits.push('(' + how + (c.size && c.size !== 1 ? ', size ×' + c.size : '') + (c.variant ? ', coat ' + c.variant : '') + ')');
    return bits.join(' ');
  });
  parts.push(cast.length ? 'Cast: ' + cast.join('; ') + '.' : 'No one in shot.');
  const o = sc.opts || {};
  const opts = Object.keys(o).map(k => {
    const v = o[k];
    if (k === 'door') return 'the door is ' + v;
    if (k === 'reflection') return v ? 'your reflection shows in the glass' : '';
    if (k === 'clan') return v ? 'tiny Clan cats in the garden' : '';
    if (k === 'sparrows') return v + ' sparrows on the fence';
    if (k === 'lampSparrow') return v ? 'a thirteenth sparrow on the lamp' : '';
    if (k === 'dish') return v ? 'a dish of water on the step' : '';
    if (k === 'moth') return v ? 'a moth' : '';
    if (k === 'marks') return v + ' claw mark' + (v === 1 ? '' : 's') + ' on the trunk';
    if (k === 'glow') return v ? 'the claw mark glows' : '';
    if (k === 'weather') return v === 'storm' ? 'a storm outside' : v === 'cloudy' ? 'heavy cloud hides the moon and stars, no rain' : 'clear weather';
    if (k === 'splash') return v ? 'a huge splash' : '';
    return k + ': ' + JSON.stringify(v);
  }).filter(Boolean);
  if (opts.length) parts.push('Also: ' + opts.join('; ') + '.');
  const fx = (sc.fx || []).map(x => FX[x] || x);
  if (fx.length) parts.push('Effects: ' + fx.join(', ') + '.');
  return parts.join(' ');
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function speaker(b) { return b.name ? b.name + ' (' + (SPEAKER[b.who] || b.who) + ')' : (SPEAKER[b.who] || b.who || 'Someone'); }
function kindWord(k) { return k === 'shout' ? ', shouting' : k === 'whisper' ? ', whispering' : k === 'think' ? ', thinking' : k && k !== 'say' ? ', ' + k : ''; }
function interaction(f) {
  if (f.end) return '**Then:** the chapter ends, and the book page opens: the recap of the reader’s choices, the dream line and the portrait.';
  if (f.choice) return '**Then she chooses** (see the branches below).';
  if (f.input) {
    const k = f.input.kind, s = (f.input.suggestions || []).join(' · ');
    if (k === 'petname') return '**Then she picks or types her pet name** (' + s + '), then on to ' + f.input.next + '.';
    if (k === 'clanname') return '**Then she types the first part of her Clan name**, with a live preview (“You will be: Moonpaw”); ideas only if she asks (' + s + '). On to ' + f.input.next + '.';
    if (k === 'dream') return '**Then she may type a dream for her book**, or skip. On to ' + f.input.next + '.';
    return '**Then she types** (' + k + '). On to ' + f.input.next + '.';
  }
  if (f.look) return '**Then she chooses her look in the reflection**: she-cat or tom, fur, marking, eyes; the reflection redraws as she picks. On to ' + f.look.next + '.';
  if (f.counts) {
    const set = (story.counts || {})[f.counts.set] || {};
    const facts = (set.facts || []).map(x => x[0] + ' × ' + x[1]).join(', ');
    return '**Then the Counts lesson** `' + f.counts.set + '` (' + (set.things || 'things') + '): ' + facts + '. She types each answer on the keypad; a miss gets the sand count and comes back two questions later. On to ' + f.counts.next + '.';
  }
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
  const caps = [].concat(f.caption || []);
  if (caps.length) { out.push(''); out.push('**Captions**'); out.push(''); out.push(caps.map(c => '> ' + q(c)).join('\n>\n')); }
  const say = [].concat(f.say || []);
  if (say.length) {
    out.push(''); out.push('**Balloons**'); out.push('');
    say.forEach(b => out.push('- **' + speaker(b) + '**' + kindWord(b.kind) + ': “' + q(b.text) + '”'));
  }
  if (f.sfx) { out.push(''); out.push('**Sound effect:** ' + q(f.sfx)); }
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
        out.push('*If she chooses this' + (sets ? ' (sets ' + sets + ')' : '') + '. ' + (b.items.length ? b.items.length + ' frame' + (b.items.filter(x => x.frame).length === 1 ? '' : 's') : 'No extra frames') + ', then back to ' + (it.merge || 'the end') + '.*');
        out.push('');
        out.push(render(b.items, Math.min(level + 2, 6), false));
      });
      if (it.merge) { out.push('*The branches meet again at ' + it.merge + '.*'); out.push(''); }
    }
  }
  return out.join('\n');
}

/* ------------------------------------------------------------------ summary */
const ids = Object.keys(F);
const reachable = new Set(reach(story.start));
const setCount = {};
let choices = 0, inputs = 0, looks = 0, counts = 0, sfx = 0, words = 0, balloons = 0, captions = 0;
for (const id of ids) {
  const f = F[id];
  if (f.scene && f.scene.set) setCount[f.scene.set] = (setCount[f.scene.set] || 0) + 1;
  if (f.choice) choices++;
  if (f.input) inputs++;
  if (f.look) looks++;
  if (f.counts) counts++;
  if (f.sfx) sfx++;
  [].concat(f.caption || []).forEach(c => { captions++; words += q(c).split(' ').length; });
  [].concat(f.say || []).forEach(b => { balloons++; words += q(b.text).split(' ').length; });
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
md.push('- **Captions**: the narration boxes, read first. **Balloons**: who speaks, in order. **Sound effect**: the big lettering.');
md.push('- **Then**: what the reader does next (tap Next, choose, type, pick a look, or do a Counts lesson).');
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
md.push('| Captions and balloons | ' + captions + ' captions, ' + balloons + ' balloons, about ' + words + ' words in all |');
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
  md.push('Title: *' + q(story.book.title || '{name}paw’s First Moon') + '*. Lines shown when their condition matches the reader’s choices:');
  md.push('');
  story.book.recap.forEach(r => {
    const when = r.when ? Object.keys(r.when).map(k => k + ' = ' + JSON.stringify(r.when[k])).join(', ') : 'always';
    md.push('- (' + when + ') ' + q(r.text));
  });
  if (story.book.noDream) md.push('- (no dream typed) ' + q(story.book.noDream));
  md.push('');
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, md.join('\n').replace(/\n{3,}/g, '\n\n'));
console.log('Wrote ' + relative(ROOT, outPath) + ': ' + ids.length + ' frames, ' + choices + ' choices.');
