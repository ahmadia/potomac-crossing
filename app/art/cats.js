/* Potomac Crossing: character art.
 *
 * Cats, the Tall One, the sparrow and the moth, (chapter 2) Riffle the otter pup, the ferry otters
 * and the three dogs of the Barking Field, (chapter 3) Sprinkle, (chapter 4) Reynard the fox and
 * Squall, and (chapter 5) Patience the heron, Puddle and Wisp, drawn in code as flat papercut SVG,
 * plus the Counts pictures (cats in rows, one counted thing each; chapter 2's prey pile, running
 * totals and the old tom's thought cloud) and the sand tallies.
 *
 *   PC.art.character(who, opts) -> { svg, w, h, head: {x, y}, headBox, bounds, held?, pole?, paw?, bill? }
 *       who: a cast id (vocab.cast). opts: { pose, mood, facing: 'left'|'right', variant, look }.
 *       A Clan cat given `look` (the player's) never wears her coat: one in her fur wears a spare
 *       coat, not on the Clan cats listed in `taken` (their variants); PC.art.clanVariant(v, look,
 *       taken) says which. The scenes and the Counts pictures pass both.
 *       headBox and bounds ({ x0, y0, x1, y1 } in the box) are for balloon tails, close-ups and
 *       keeping props off faces; the cats and the otters and dogs report them.
 *       Cats also take `flatEars: true` (ears laid flat whatever the mood: the old tom on the rim,
 *       f020) and `holds: 'stone'` (Riffle's lucky stone) with `holdAt`: 'paws' | 'mouth' | 'chin' |
 *       'nose' (unset: in the mouth on its feet, else at the paws). A cat holding something reports
 *       `held: { what, at, x, y, r }` in its box, for a sparkle on the stone.
 *   PC.art.cat(opts)            -> same shape, a cat from opts.look
 *   PC.art.countsPicture({ table, groups, per, highlight, kind, layout, totals, next, who, thought, look })
 *       -> '<svg ...>...</svg>' (docs/build.md, "Counts art"; chapter 1's calls are unchanged)
 *   PC.art.preyFallback({ kind, lit, part, facing }) -> { svg, w, h }: our own prey, used when the
 *       pile set's PC.art.prey (app/art/sets/pile.js, looked up at call time) is missing
 *   PC.art.sand({ groups, per, counted, layout, ground, style }) -> '<svg ...>...</svg>': `layout: 'rows'`
 *       is `groups` rows of `per` lit a column at a time (the check's two rows of eight); `ground:
 *       'earth'` scratches them in the earth beside the pile instead of the sand, `'mud'` in the mud
 *       under the Old Bridge; `style: 'swipe'` draws a claw swipe a group, `per` short parallel lines
 *   PC.art.vocab.{cast, poses, moods, looks, otherPoses, clanVariants, variants}
 *
 * Chapter 3 (docs/build.md, "Chapter 3 (v0.4)"):
 *   - `sprinkle` (PC.art.character('sprinkle', { pose, mood, facing, holds: 'pebble', tear, mist,
 *     squeeze })): the Mistscale dragonet, 640 x 340, every pose in vocab.otherPoses.sprinkle and every
 *     mood. Her `curl` also returns `nest` ({ x, y } in her box: where whoever she curls round sits,
 *     about 185 of her units in front of her, the bridge's `beside` from `dragon`) and `front` (a group
 *     in her box: her tail's near loop, to draw over them).
 *   - every character takes the moods `sad` and `shy`; cats the poses `pawup` and `tummy`; otters
 *     `dive` and `hush`; `murmurchime` is the tortie (the mutterer's look) once she is named.
 *   - cast extras: cats `claws`, `puffed`, `squeeze`, `moss`, `tear`, `mist`, `holds: 'vole' |
 *     'pebble'` (beside 'stone'); otters `holds: 'fish' | 'fish2'` (held reports what, at, x, y, r),
 *     `tear`, `mist`, `squeeze` (dogs too), and in `juggle` `pebbles: 4 | 5` (four on the arc, and
 *     the fifth, plain round brown, in his paw; three by default).
 *   - countsPicture: the 5s with `who` (each forepaw in that character's fur, the character small
 *     behind it; Sprinkle's paws bigger and grey, one Sprinkle behind a run of her own), `kind: 'mud'`
 *     (little forepaws drawn in the mud, `per` claw marks each), `paws: 'own'` with `look` (her own two
 *     forepaws on the moss at night, the glow taking turns, left, right; the totals in a row beneath).
 *
 * Chapter 4 (docs/build.md, "Chapter 4 (v0.4)"; the text's Art needs):
 *   - `reynard` (the fox; 300 x 230): poses vocab.otherPoses.reynard (sit, comb, chest, think, lean,
 *     flap, slip, dash), every mood drawn his way, the extra `flick: true`. Three-quarter view always,
 *     a closed smile that is on in every pose but `slip`, no teeth, never taller than Tallyheart.
 *   - `squall` (the littlest dragonet; 250 x 190): poses vocab.otherPoses.squall (hug, sit, roar,
 *     hiccup, halt, tall, point, snap, pawup), every mood, `tear`, `mist`, `squeeze`. In hug, roar and
 *     halt the pole stands on the centre line of his box (the anchor's x) and the result carries
 *     `pole: { x, w }`; `pole: true` draws a plain pole. `pawup` reports `paw: { x, y, r }`, and
 *     `lit: n` lights n of its five claws.
 *   - Sprinkle gains `check`, `tailout` and `tailup`; cats the pose `situp` (claws out; `claws: false`
 *     sheathes them) and the extras `wink: true` and `holds: 'bark'` (sitting up, anything held is held
 *     up between the two raised forepaws).
 *   - countsPicture: the 10s (any picture of ten things a group that is not prey or rows): a cat's two
 *     forepaws a group, the cat small behind, `who` as for the 5s (Sprinkle and Squall too), at most
 *     five to a row; `kind: 'grit'` (or `kind: 'mud', ground: 'grit'`: little forepaws scratched in
 *     the roof's grit); `paws: 'own'` at table 10 (or `both: true`, or `paws: 'both'`: her two forepaws
 *     patted down together, one glow, one group); `paws: 'promise'` (or 'pile': six piled forepaws,
 *     Sprinkle's, hers and Riffle's, lit a pair at a time); a `who` of one `squall` on the 5s (his one
 *     raised forepaw); and a run of two of one named cat on the 5s is drawn as that cat's own pair.
 *   - sand: `ground: 'grit'`; `style: 'swipe'` with `pair: true` (two swipes a group, a pair to a box);
 *     `layout: 'rows'` with `step` equal to `per` lights a whole row at a time.
 *
 * Chapter 5 (docs/build.md, "Chapter 5 (v0.4)"; the text's Art needs and Build notes):
 *   - `patience` (the great blue heron; 330 x 460): poses vocab.otherPoses.patience (stand, eye, shut,
 *     point, gulp, full, feather). Always in profile (her head never turns); one mood, level: `mood`
 *     changes nothing. `squeeze: true` shuts her eye tight (with `shut`: the picture of both eyes
 *     shut); `dragonfly: true` puts the dragonfly asleep on her bill (none unless asked: the marsh
 *     set's `dragonfly` option says where it is). The result carries `bill: { x, y }`, where it sits.
 *   - `puddle` (Sprinkle's brother; 480 x 250 in the water, 640 x 340 sitting): poses foot, head, log,
 *     sink, pawup, nostrils (each laid out on a waterline at the bottom of his box, nothing drawn
 *     below it) and sit (all of him: what an unknown pose draws, for his page in her book). Every mood;
 *     `tear`, `mist`, `squeeze`. `pawup` reports `paw: { x, y, r }` and `lit: n` lights its claws.
 *   - `wisp` (the pale sister; 320 x 300): poses reed, blink, shh, draw, nod, flinch, gulp, pawup. One
 *     thin veil (a group's opacity) over all of her but her eyes, which are solid; a thinner one over
 *     her wing and a forepaw that is up or out. Every mood (her cheeks are always a little pink, and
 *     a happy Wisp keeps her eyes open); `squeeze`, `tear`. `pawup`: `paw`, and `lit: n` lights the
 *     claws pale as frost. An unknown pose draws `blink`.
 *   - cats, extras: `tuck: true` (a raised paw's dewclaw curled back in: sitting up, nine claws out),
 *     `asleep: true` (eyes shut whatever the mood; chapter 7, `asleep: 'half'`: half asleep, heavy
 *     upper lids down to the middle of the eyes whatever the mood, which keeps its mouth: our cat
 *     curling up to sleep with a small smile), `snail: true | 'in'` (a snail halfway up the
 *     whole ear; its horns pulled in), `buzz: true` (short zigzags along her outline and zigzag
 *     whiskers: the Roar), `dragonfly: true` (on her nose, her eyes turned in to it), `tap: 'nose'`
 *     (the nose marked for the page as the thing to tap: an unpainted <g class="pc-tap pc-tap-nose">;
 *     the page draws the glow. A sleeper with a snail on his ear is marked without being told;
 *     `tap: false` says no). `reach: true` on `crouch` (crouched at an edge, the near forepaw held
 *     out and down over it, touching nothing: her paw over a print in the marsh mud); the result
 *     carries `reach: { x, y, r, edge }` (that paw, and the line of the edge, in her box).
 *   - otters: the poses whistle, groan (the two the Build notes name), flip, hop, point, fall and slap;
 *     `holds: 'pole'` in `hug` (hugging a pole twice his size) and `stand` (poling): the pole runs
 *     out of his box, and the result carries `pole: { x0, y0, x1, y1, w }` (its foot first) and
 *     `held: { what: 'pole', … }` (his paws on it); `tap: 'pole'` marks it there (pc-tap pc-tap-pole).
 *   - Sprinkle gains `lookdown` (looking down at her own enormous feet).
 *   - anyone: `glow: true` wraps the drawing with a soft glow behind it (class pc-next: the one to tap).
 *   - PC.art.dragonfly({ asleep, facing }) -> { svg, w: 40, h: 28 }: the dragonfly by itself.
 *   - countsPicture: the 9s (nine things a group: the 10s' picture with one claw tucked in and unlit,
 *     the same claw on every cat, the tenth as the picture counts them: the right-hand paw's dewclaw;
 *     `tuck: 0 | n` for the hop and the cats that have tucked, `tuck: true` with `taps` for the tuck
 *     Tap, which never draws a number under a cat); `paws: 'both'` at per 9 (the bedtime nines: the
 *     tenth, seen from her own eyes, is her right paw's outer toe); `kind: 'fish'` (`layout: 'pairs'`, in a daylight thought cloud with
 *     `thought`; `layout: 'strings'`, each string a reed looped round the tails); `kind: 'bumps'` (the
 *     raft from underneath); `kind: 'herons'` (scratched in the mud, each on one leg); `paws: 'board'`
 *     (her four paws onto the raft), `paws: 'log'` (her claws in the log, Riffle's forepaw beside
 *     them; `plane` for the skymonster in its sky), `paws: 'mud'` with `of` (seven forepaws, the first
 *     `groups` to count); a `who` of one `puddle` or `wisp` on the 5s (their forepaw Taps, in the
 *     water and among the reeds); `kind: 'answers'` with `answers` (as the sand draws them).
 *   - sand: `ground: 'log'` (a log of the raft); `style: 'swipe', pair: true` with `rubbed: n` (the
 *     nines' second phase: one line rubbed out of the first n pairs, the rest lit; also `tucked`,
 *     `tuck: n`, or `tuck: true` to read it from `counted`); `answers: [18, 36]` (her answers
 *     scratched in the sand).
 *   - vocab.extras: the cast extras by name, with their values.
 *
 * Chapter 6 (docs/chapters/06-the-snake-in-the-stones.spec.md, section 4, and its one-tap table):
 *   - `coil` (the water snake; 720 x 160): poses vocab.otherPoses.coil (stone, head, long, longer,
 *     still, listen, think, slide), every mood drawn his way. His head at the bottom middle of his box
 *     in every pose (the bridge's `gap` anchor puts it in his gap), facing right, his body trailing
 *     back along the bottom line (mirrored facing left); one scale for every pose. Two round eyes that
 *     never shut (no lids: no pose, mood or extra closes them; `stone` and `slide` turn his head into
 *     the gap), a mouth always shut: no tongue, no fangs. `tap: 'stone'`, `tap: 'eyes'`.
 *   - `sloshbank` (a cat, 228 x 228: bigger than Tallyheart, who fills a cat's box): solid brown,
 *     darker legs, his belly wet with drops falling and one on the ground, big muddy paws. Every cat
 *     pose and mood.
 *   - `reedclan` (cats, `variant` 1 to 4): four marsh coats of their own, none of LOOKS.fur's nine and
 *     none of CLAN's, sleek and wet (`sheen`), mud to the elbows; a `look` changes nothing (no
 *     clanVariant: none of them is ever her coat), in character() and in the Counts pictures' `who`.
 *   - `sleet` (the eldest dragonet; Sprinkle's 640 x 340 box): poses vocab.otherPoses.sleet (hidden,
 *     tail, flat, point, call, puff, droop, sit, pawup); `sit` is what an unknown pose draws. `pawup`
 *     reports `paw`, `lit: n` lights its claws frost-white; `grass: true` a tuft on his head.
 *   - any cat, `starry: true`: the starry cat, whatever the coat (and whoever the entry names).
 *   - cats: `holds: 'pinecone'` (holdAt chin, paws, nose, mouth; held up sitting up), `tap: 'pinecone'`,
 *     `tap: 'paw'` (the raised forepaw in pawup; else the front paw on the ground), `tap: 'ears'`.
 *   - Riffle and the otters: the pose `puff` (cheeks puffed, holding his breath), `tap: 'cheeks'`;
 *     `holds: 'pebbles'` (three plain brown, in both forepaws; `holdAt: 'paws'`: in a row on the
 *     ground at his feet), `tap: 'pebbles'`; `holds: 'string'` (PC.art.prey.string's three fish from
 *     one forepaw, looked up when drawn). `held` reports pebbles and the string too.
 *   - countsPicture: `kind: 'roll'` (Sleet's roll call: `groups` little plain dragonets in one row,
 *     `per` HERE!s over each head, lit in order); a `who` of one `sleet` on the 5s (his forepaw in
 *     the long grass); Sleet among the dragonets of the 5s, 9s and 10s; `reedclan` in any `who`.
 *
 * Chapter 7 (docs/chapters/07-the-counts-dont-lie.spec.md, section 4): no new cast, pose or mood.
 *   - cast extras: Riffle's `tap: 'fish'` (with `holds: 'string'`: the string's box, unpainted, class
 *     pc-tap pc-tap-fish: the toss Tap) and Sprinkle's `tap: 'mist'` (with her mist, as `burp` draws
 *     it: the cloud, pc-tap pc-tap-mist: the HURP Tap); vocab.extras.tap gains 'fish' and 'mist'.
 *   - countsPicture, the 6s' cheeks (`kind: 'cheeks'` or `'cheeks-top'` at per 6, or `thing: 'whisker'`
 *     at per 6 with no kind; per 6 with neither draws as it always has): one to ten cheeks close up,
 *     each a group of six whiskers in two rows of three, in the `who` entry's coat (else the rim's coats
 *     in order), lit cheek by cheek, top row then bottom; `cheeks-top` lights every top row from the
 *     start; THE FACE RULE: two consecutive `who` entries with the same who and variant are one face,
 *     its two cheeks side by side on one card, puffed round. `thing: 'whisker'` at per 3: one big cheek,
 *     its two rows the two groups. `thing: 'gap'`: the pile's back row close up, three pieces, `groups`
 *     empty pressed places, three pieces. `kind: 'marks'`: the nights, `per` short scratches each, side
 *     by side in the sand or (`ground: 'mud'`) the mud.
 *   - sand at per 6: each group two short rows of three, one above the other (every other per as before).
 *   The game's cats keep two whiskers a side: six on a cheek exist only in these Counts close-ups.
 *
 * Chapter 8 (docs/chapters/08-the-night-trail.spec.md, section 4). Everything is appended (cast, poses,
 * extras: earlier ids never move) and off unless asked for, so chapters 1 to 7 draw as they did:
 *   - `hail` (the speckled dragonet, Squall's size; 250 x 200): poses vocab.otherPoses.hail (sit, stand,
 *     bounce, run, peek, pawup, tilt); `sit` is what an unknown pose draws. Every mood; `pawup` reports
 *     `paw` and `lit: n` lights its claws. White with grey speckles, dark eyes, never toothy.
 *   - `snip` and `snatch` (the weasels; 220 x 150): poses stand, up, run, skid, peek, point, curl; `up`
 *     is what an unknown pose draws. Every mood; `holds: 'mouse'` (`holdAt: 'mouth' | 'paws'`, reported
 *     as `held`), `asleep: true`. No teeth, ever.
 *   - cats: the pose `run`; `tailUp: true` (sit, stand, crouch, walk: the tail straight up, its tip
 *     curled; she is fitted to her box as with it down, so her size never changes) and `tap: 'tail'`;
 *     `holds: 'leaf' | 'glass'` and `tap: 'leaf'`. Riffle: `tap: 'ears' | 'paw' | 'tail'`, `tailUp`.
 *     The dogs: the pose `lie`, and `asleep: true`. Reynard: the pose `trot`.
 *   - countsPicture: `thing: 'paw'` at per 2 (one cat's four paws, the front pair the first group, the
 *     back pair the second); `kind: 'dogs'` (the table-4 tiles: dogs, Hail and cats, four paws each,
 *     lit an animal at a time; a `who` longer than `groups` draws its first); `kind: 'marks'` with
 *     `layout: 'pairs'` (each night's marks two and two). The sand at per 4: two and two a group.
 *
 * `svg` is markup for a group (no outer <svg>) drawn in a local box 0..w x 0..h, with the
 * character's feet centred at (w/2, h). Every character is drawn facing right and mirrored for
 * facing left. Ids (clip paths, shapes) carry a module counter, so many characters can share
 * one panel. Sizes are in the cats' units: a cat's box is 200 x 200 (a sitting cat about 160
 * tall), and the scenes scale every drawing by that box, so Riffle's 250 box, the adult otters'
 * 330 and the dogs' (470 shaggy, 330 spotty, 160 tiny) make them the right size beside the cats.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});

  // ------------------------------------------------------------------ helpers

  var serial = 0;
  function N(v) { var r = Math.round(v * 10) / 10; return String(r === 0 ? 0 : r); }
  function pt(p) { return N(p[0]) + ',' + N(p[1]); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerp2(p, q, t) { return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)]; }
  function add(p, v, k) { k = k == null ? 1 : k; return [p[0] + v[0] * k, p[1] + v[1] * k]; }
  function unit(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1; return [v[0] / l, v[1] / l]; }
  function dist(p, q) { var x = q[0] - p[0], y = q[1] - p[1]; return Math.sqrt(x * x + y * y); }
  function deg(v) { return Math.atan2(v[1], v[0]) * 180 / Math.PI; }
  function rand(seed) { var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  function intOr(v, d) { v = parseInt(v, 10); return isNaN(v) ? d : v; }

  function rgb(h) {
    h = String(h).replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function hex(c) {
    return '#' + c.map(function (v) {
      v = clamp(Math.round(v), 0, 255);
      return (v < 16 ? '0' : '') + v.toString(16);
    }).join('');
  }
  function mix(a, b, t) {
    var x = rgb(a), y = rgb(b);
    return hex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; }));
  }

  // affine matrices [a, b, c, d, e, f]
  function mul(m, n) {
    return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
      m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
      m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
  }
  function mT(x, y) { return [1, 0, 0, 1, x, y]; }
  function mS(x, y) { return [x, 0, 0, y == null ? x : y, 0, 0]; }
  function mR(a) { var r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; }
  function apply(m, p) { return [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]]; }
  function mStr(m) { return 'matrix(' + m.map(function (v) { return Math.round(v * 1000) / 1000; }).join(',') + ')'; }

  // ------------------------------------------------------------------ geometry

  // Smooth open run through points (Catmull-Rom as cubic Beziers), starting at p[0].
  function cr(p) {
    var s = '';
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      s += 'C' + pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' +
        pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + pt(p2);
    }
    return s;
  }
  function crClosed(p) {
    var n = p.length, s = 'M' + pt(p[0]);
    for (var i = 0; i < n; i++) {
      var p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      s += 'C' + pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' +
        pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + pt(p2);
    }
    return s + 'Z';
  }
  function area(p) {
    var a = 0;
    for (var i = 0; i < p.length; i++) { var q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; }
    return a / 2;
  }
  // Fluffy outline: an outward bump between each pair of points.
  function scallop(p, k) {
    var s = 'M' + pt(p[0]), sw = area(p) > 0 ? 1 : 0;
    for (var i = 0; i < p.length; i++) {
      var q = p[(i + 1) % p.length], r = dist(p[i], q) * (k || 0.62);
      s += 'A' + N(r) + ' ' + N(r) + ' 0 0 ' + sw + ' ' + pt(q);
    }
    return s + 'Z';
  }
  // Fur on end: every other point pushed outward.
  function spiky(p, amt) {
    var cw = area(p) > 0, n = p.length, out = [];
    for (var i = 0; i < n; i++) {
      var a = p[(i - 1 + n) % n], b = p[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1];
      var nn = unit(cw ? [dy, -dx] : [-dy, dx]);
      out.push(add(p[i], nn, i % 2 ? amt : -0.5));
    }
    return 'M' + out.map(pt).join('L') + 'Z';
  }
  function sampleArc(out, c, a0, a1, step) {
    var n = Math.max(2, Math.ceil(Math.abs(a1 - a0) * c[2] / step));
    for (var i = 0; i < n; i++) {
      var a = lerp(a0, a1, i / n);
      out.push([c[0] + c[2] * Math.cos(a), c[1] + c[2] * Math.sin(a)]);
    }
  }
  function sampleLine(out, p, q, step) {
    var n = Math.max(1, Math.ceil(dist(p, q) / step));
    for (var i = 0; i < n; i++) out.push(lerp2(p, q, i / n));
  }
  // Ellipse (cx, cy, rx, ry, rotation in degrees).
  function ellipseG(cx, cy, rx, ry, rot, step) {
    var m = mul(mT(cx, cy), mR(rot || 0));
    var p1 = apply(m, [-rx, 0]), p2 = apply(m, [rx, 0]);
    var d = 'M' + pt(p1) + 'A' + N(rx) + ' ' + N(ry) + ' ' + N(rot || 0) + ' 0 1 ' + pt(p2) +
      'A' + N(rx) + ' ' + N(ry) + ' ' + N(rot || 0) + ' 0 1 ' + pt(p1) + 'Z';
    var pts = [], n = Math.max(8, Math.round(Math.PI * (rx + ry) / (step || 10)));
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n;
      pts.push(apply(m, [rx * Math.cos(a), ry * Math.sin(a)]));
    }
    return { d: d, pts: pts };
  }
  // Smooth hull around two circles [x, y, r]: torsos, legs.
  function hull2(a, b, step) {
    step = step || 10;
    var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy);
    if (d + Math.min(a[2], b[2]) <= Math.max(a[2], b[2]) + 0.01) {
      var c = a[2] >= b[2] ? a : b;
      return ellipseG(c[0], c[1], c[2], c[2], 0, step);
    }
    var ang = Math.atan2(dy, dx), phi = Math.acos(clamp((a[2] - b[2]) / d, -1, 1));
    function on(c, t) { return [c[0] + c[2] * Math.cos(t), c[1] + c[2] * Math.sin(t)]; }
    var a1 = on(a, ang + phi), b1 = on(b, ang + phi), b2 = on(b, ang - phi), a2 = on(a, ang - phi);
    var lb = 2 * phi > Math.PI ? 1 : 0, la = 2 * Math.PI - 2 * phi > Math.PI ? 1 : 0;
    var path = 'M' + pt(a1) + 'L' + pt(b1) + 'A' + N(b[2]) + ' ' + N(b[2]) + ' 0 ' + lb + ' 0 ' + pt(b2) +
      'L' + pt(a2) + 'A' + N(a[2]) + ' ' + N(a[2]) + ' 0 ' + la + ' 0 ' + pt(a1) + 'Z';
    var pts = [];
    sampleArc(pts, b, ang + phi, ang - phi, step);
    sampleLine(pts, b2, a2, step);
    sampleArc(pts, a, ang - phi, ang + phi - 2 * Math.PI, step);
    sampleLine(pts, a1, b1, step);
    return { d: path, pts: pts };
  }
  // A tapering tube along a cubic Bezier: tails.
  function bez(P, t) {
    var u = 1 - t;
    return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
      u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]];
  }
  function bezD(P, t) {
    var u = 1 - t;
    return [3 * u * u * (P[1][0] - P[0][0]) + 6 * u * t * (P[2][0] - P[1][0]) + 3 * t * t * (P[3][0] - P[2][0]),
      3 * u * u * (P[1][1] - P[0][1]) + 6 * u * t * (P[2][1] - P[1][1]) + 3 * t * t * (P[3][1] - P[2][1])];
  }
  function tube(P, wf, n) {
    n = n || 9;
    var L = [], R = [], C = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, p = bez(P, t), tg = unit(bezD(P, Math.min(0.999, Math.max(0.001, t)))), nn = [-tg[1], tg[0]], w = wf(t);
      L.push(add(p, nn, w)); R.push(add(p, nn, -w)); C.push({ p: p, n: nn, t: tg, w: w });
    }
    var w1 = C[n].w;
    var d = 'M' + pt(L[0]) + cr(L) + 'A' + N(w1) + ' ' + N(w1) + ' 0 0 0 ' + pt(R[n]) + cr(R.slice().reverse()) + 'Z';
    var tip = add(C[n].p, C[n].t, w1);
    var pts = L.concat([add(add(C[n].p, C[n].n, w1 * 0.7), C[n].t, w1 * 0.7), tip, add(add(C[n].p, C[n].n, -w1 * 0.7), C[n].t, w1 * 0.7)], R.slice().reverse());
    return { d: d, pts: pts, at: function (t) {
      var p = bez(P, t), tg = unit(bezD(P, clamp(t, 0.001, 0.999)));
      return { p: p, n: [-tg[1], tg[0]], t: tg, w: wf(t) };
    } };
  }
  // An irregular rounded blob (tortie and calico patches).
  function blob(cx, cy, r, seed) {
    var p = [];
    for (var i = 0; i < 7; i++) {
      var a = Math.PI * 2 * i / 7 + seed * 0.9, k = 0.74 + 0.36 * rand(seed * 7 + i);
      p.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]);
    }
    return crClosed(p);
  }
  // A wedge stroke from s toward e, `w` wide at s, tapering to a point.
  function wedge(s, e, w, bend) {
    var d = unit([e[0] - s[0], e[1] - s[1]]), nn = [-d[1], d[0]];
    var a = add(s, nn, w / 2), b = add(s, nn, -w / 2), m = add(lerp2(s, e, 0.5), bend || [0, 0]);
    return 'M' + pt(a) + 'Q' + pt(add(m, nn, w * 0.42)) + ' ' + pt(e) + 'Q' + pt(add(m, nn, -w * 0.42)) + ' ' + pt(b) + 'Z';
  }
  function mul2(v, k) { return [v[0] * k, v[1] * k]; }
  // Axis-aligned bounding box of points, rounded to 0.1: { x0, y0, x1, y1 }.
  function boxOf(list) {
    var b = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    list.forEach(function (q) { b.x0 = Math.min(b.x0, q[0]); b.y0 = Math.min(b.y0, q[1]); b.x1 = Math.max(b.x1, q[0]); b.y1 = Math.max(b.y1, q[1]); });
    ['x0', 'y0', 'x1', 'y1'].forEach(function (k) { b[k] = Math.round(b[k] * 10) / 10; });
    return b;
  }
  // Scale every coordinate pair of an M/L/C/Q path.
  function scalePath(d, sx, sy) {
    var i = 0;
    return d.replace(/-?\d*\.?\d+/g, function (v) { var r = (i++ % 2 === 0) ? +v * sx : +v * sy; return N(r); });
  }

  // A drawing context: collects <defs> and hands out unique ids.
  function Ren() { this.base = 'pc' + (++serial).toString(36); this.k = 0; this.defs = ''; }
  Ren.prototype.id = function () { return this.base + '-' + (this.k++).toString(36); };
  // A filled, shaded, outlined part. `inner` is drawn clipped to the part.
  Ren.prototype.part = function (d, o) {
    var pid = this.id(), cid = this.id();
    this.defs += '<path id="' + pid + '" d="' + d + '"/><clipPath id="' + cid + '"><use href="#' + pid + '"/></clipPath>';
    return '<use href="#' + pid + '" fill="' + o.dark + '"/>' +
      '<g clip-path="url(#' + cid + ')"><use href="#' + pid + '" x="' + N(o.sx || 0) + '" y="' + N(o.sy || 0) + '" fill="' + o.fill + '"/>' + (o.inner || '') + '</g>' +
      '<use href="#' + pid + '" fill="none" stroke="' + o.line + '" stroke-width="' + (o.lw || 2.4) + '" stroke-linejoin="round"/>';
  };

  // ------------------------------------------------------------------ colours

  var EYES = {
    green: '#8fca66', amber: '#f4aa2b', blue: '#79b9ee', copper: '#e27a32',
    ice: '#c8e9fa', gold: '#efc236', yellow: '#e7d548', hazel: '#b9b85a'
  };
  var FUR = {
    black: { base: '#3d3844', line: '#18161c', light: '#5b5465', feat: '#a89fb6', whisk: '#d6cfe0', nose: '#cf8597', earIn: '#bd8494' },
    white: { base: '#fbf8f2', line: '#a39787', light: '#ffffff', shade: '#e3dbcd' },
    'silver-tabby': { base: '#c3cbd4', line: '#5a6574', stripe: '#6c7886', light: '#e4e9ef', pattern: 'tabby' },
    'brown-tabby': { base: '#b5895b', line: '#4c3522', stripe: '#5b3f27', light: '#d5ae80', pattern: 'tabby' },
    ginger: { base: '#e8913a', line: '#8f4a1b', stripe: '#b5602a', light: '#f7b86e', pattern: 'tabby' },
    cream: { base: '#f2dbb1', line: '#a3855a', stripe: '#d8b47f', light: '#fcf0da', pattern: 'tabby' },
    grey: { base: '#9ea5ad', line: '#4f565e', light: '#c3c9cf' },
    tortie: { base: '#3f3330', line: '#1b1412', light: '#5e4b44', feat: '#b89c8d', whisk: '#dccbbf', nose: '#c98a80', earIn: '#c08b8b', pattern: 'tortie', patches: ['#da853b', '#ecb877'] },
    calico: { base: '#fbf8f2', line: '#998b7b', light: '#ffffff', shade: '#e4dbcd', pattern: 'calico', patches: ['#e3893a', '#3d3844'] }
  };
  var WHITE = '#fcf9f3';
  // On pale fur a white marking would vanish: there it is a touch brighter than the fur and edged
  // with a soft ink line, so its shape reads. Mid and dark furs keep plain white markings.
  var PALE = { white: 1, cream: 1, calico: 1 };
  var MARK_EDGE = ' stroke="#1b1622" stroke-opacity=".4" stroke-width="1.8" stroke-linejoin="round"';
  function markFill(sp) { return (sp.marks && sp.marks.fill) || WHITE; }
  function markEdge(sp) { return sp.marks && sp.marks.edge ? MARK_EDGE : ''; }

  function palette(fur, over) {
    var f = {}, k;
    var src = FUR[fur] || FUR['brown-tabby'];
    for (k in src) f[k] = src[k];
    for (k in (over || {})) f[k] = over[k];
    f.shade = f.shade && !(over && over.base && !over.shade) ? f.shade : mix(f.base, f.line, 0.2);
    f.shade2 = mix(f.base, f.line, 0.36);
    f.farFill = mix(f.base, f.line, 0.13);
    f.feat = f.feat || f.line;
    f.whisk = f.whisk || mix(f.line, f.base, 0.25);
    f.nose = f.nose || '#ee8a9c';
    f.earIn = f.earIn || '#f4a5b4';
    if (f.patches) f.patchShade = f.patches.map(function (c) { return mix(c, f.line, 0.2); });
    return f;
  }

  // ------------------------------------------------------------------ cast

  var LOOKS = {
    fur: ['black', 'white', 'silver-tabby', 'brown-tabby', 'ginger', 'cream', 'grey', 'tortie', 'calico'],
    marking: ['none', 'white-paws', 'white-chest', 'back-stripe', 'nose-splash'],
    eyes: ['green', 'amber', 'blue', 'copper', 'odd']
  };
  // chapter 3 appends 'pawup' (sitting, one forepaw raised) and 'tummy' (on her back, paws in the air);
  // chapter 4 'situp' (on the haunches, both forepaws raised, claws out: "We look like squirrels")
  // chapter 8 'run' (flat out: the chase home)
  var CAT_POSES = ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer', 'pawup', 'tummy', 'situp', 'run'];
  // 'solemn' is appended last so earlier indexes never move (deadpan dignity: level brows, half-lidded eyes, a straight mouth);
  // chapter 3 appends 'sad' (homesick: brows up, drooping lids, a wobbly mouth) and 'shy' (eyes down, a small smile, a blush)
  var MOODS = ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn', 'sad', 'shy'];
  // chapter 2 appends the otters and the dogs, chapter 3 Sprinkle and Murmurchime (the tortie,
  // named a warrior: the mutterer's own look, so her speaker label can change), chapter 4 Reynard the
  // fox and Squall, the littlest dragonet; earlier ids never move
  // chapter 5 Patience the heron, and Sprinkle's brother Puddle and pale sister Wisp
  // chapter 6 Coil the water snake, the ReedClan speaker Sloshbank and the other ReedClan cats (by
  // variant), and Sleet, the eldest dragonet; chapter 8 Hail, the speckled dragonet, and Snip and
  // Snatch, the weasels
  var CAST_IDS = ['player', 'tallyheart', 'glintstar', 'waffles', 'tallone', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'sparrow', 'moth',
    'riffle', 'otter', 'dog', 'sprinkle', 'murmurchime', 'reynard', 'squall', 'patience', 'puddle', 'wisp',
    'coil', 'sloshbank', 'reedclan', 'sleet', 'hail', 'snip', 'snatch'];
  var OTHER_POSES = { sparrow: ['perch', 'fluffed'], moth: ['fly'], tallone: ['stand', 'water', 'set-dish'] };

  var PRESETS = {
    tallyheart: { fur: 'ginger', over: { base: '#E8913A', stripe: '#B5602A', line: '#8a4517', light: '#f6b56c' },
      marks: { chest: '#f9e6c6' }, muzzle: '#f9e6c6', eyes: ['amber', 'amber'], sex: 'she',
      scale: 1.12, bulk: 1.2, legW: 1.08, notch: true, tailW: 1.15 },
    glintstar: { fur: 'silver-tabby', over: { base: '#B9C2CC', stripe: '#7a8592', line: '#525d6b', light: '#dde3ea' },
      marks: { chest: '#e9edf2' }, eyes: ['ice', 'ice'], sex: 'she', scale: 1.05, bulk: 0.84, legW: 0.88,
      headX: 0.94, earS: 1.14, rot: -4, tailW: 0.9, lashes: true },
    waffles: { fur: 'white', over: { base: '#fefcf8', shade: '#e9e0f0', line: '#8c7ea3', light: '#ffffff' },
      eyes: ['copper', 'copper'], sex: 'she', scale: 1.0, bulk: 1.34, legW: 1.25,
      fluffy: true, flatFace: true, bow: true, tailW: 1.5 },
    grizzled: { fur: 'black', over: { base: '#5d4535', line: '#2a1e15', light: '#7c604b', feat: '#cdb8a6', whisk: '#e2d4c6', nose: '#b97d78', earIn: '#b98a84' },
      muzzle: '#aaa29b', marks: { chin: '#aaa29b' }, eyes: ['gold', 'gold'], sex: 'tom', scale: 1.06, bulk: 1.1,
      scar: true, ragged: true, heavyBrows: true },
    snorer: { fur: 'grey', over: { base: '#a3a9b0', line: '#555c64' }, eyes: ['yellow', 'yellow'], sex: 'tom',
      scale: 0.86, bulk: 0.76, legW: 0.84, tailW: 0.82, headX: 0.98 },
    mutterer: { fur: 'tortie', eyes: ['green', 'green'], sex: 'she', scale: 0.8, bulk: 0.96 },
    murmurchime: { fur: 'tortie', eyes: ['green', 'green'], sex: 'she', scale: 0.8, bulk: 0.96 },
    snorter: { fur: 'black', marks: { chest: WHITE, paws: true, splash: true }, muzzle: WHITE,
      eyes: ['yellow', 'yellow'], sex: 'tom', scale: 0.86, bulk: 0.92 }
  };
  var CLAN = [
    { fur: 'brown-tabby', eyes: ['green', 'green'], sex: 'tom', scale: 0.98, bulk: 1.02 },
    { fur: 'black', eyes: ['amber', 'amber'], sex: 'she', scale: 0.95, bulk: 0.95 },
    { fur: 'cream', eyes: ['copper', 'copper'], sex: 'she', scale: 0.94, bulk: 1 },
    { fur: 'grey', marks: { paws: true, chest: WHITE }, muzzle: WHITE, eyes: ['green', 'green'], sex: 'tom', scale: 1, bulk: 1.05 },
    { fur: 'calico', eyes: ['amber', 'amber'], sex: 'she', scale: 0.93, bulk: 0.98 },
    { fur: 'ginger', marks: { paws: true, chest: WHITE, splash: true }, muzzle: WHITE, eyes: ['hazel', 'hazel'], sex: 'tom', scale: 1, bulk: 1.06 }
  ];

  // Chapter 6: ReedClan, the marsh Clan across the border. Sleek and wet-looking (`sheen`), mud to the
  // elbows (`mud: 'elbows'`), so the patrol reads apart from CrystalClan at a glance. Their four coats
  // are marsh coats of their own (the spec's call 20): solid colours that are none of LOOKS.fur's nine
  // and none of CLAN's, each visibly apart from all of them (tests/cats.test.js measures it), so no
  // ReedClan cat ever wears the player's coat and no `look` or clanVariant is needed: a `look` passed
  // in changes nothing. Drawn on the plain grey palette with every colour of it replaced (no pattern).
  //   1 the ReedClan she-cat: sleek, dark grey-brown, a pale belly, calm amber eyes
  //   2 the young ReedClan tom: lanky, sandy, big ears, eager
  //   3 a smoky grey (darker and browner than `grey`, lighter than `black`)
  //   4 a fawn (darker and warmer than `cream`)
  var REED = [
    { fur: 'grey', coat: 'reed-grey-brown', over: { base: '#6b5a4e', line: '#2b221c', light: '#8f7c6f', feat: '#231b16', whisk: '#e3d8cc', nose: '#b07d76', earIn: '#b98f87' },
      marks: { chest: '#d9cdbd' }, muzzle: '#d9cdbd', eyes: ['amber', 'amber'], sex: 'she', scale: 0.95, bulk: 0.9, legW: 0.92, headX: 0.96, tailW: 0.9,
      sheen: true, mud: 'elbows' },
    { fur: 'grey', coat: 'reed-sandy', over: { base: '#d8ba7e', line: '#7a5a2a', light: '#ecd6a6', nose: '#d99a8c', earIn: '#eab3a6' },
      eyes: ['green', 'green'], sex: 'tom', scale: 0.95, bulk: 0.8, legW: 0.86, earS: 1.28, tailW: 0.84, sheen: true, mud: 'elbows' },
    { fur: 'grey', coat: 'reed-smoky', over: { base: '#7d7b7a', line: '#363433', light: '#a4a19f', earIn: '#c49b9f', nose: '#b98a8f' },
      eyes: ['copper', 'copper'], sex: 'she', scale: 0.94, bulk: 0.94, legW: 0.95, sheen: true, mud: 'elbows' },
    { fur: 'grey', coat: 'reed-fawn', over: { base: '#c4a088', line: '#6b4c39', light: '#dcc1ae', nose: '#c98a80', earIn: '#e2a99e' },
      eyes: ['gold', 'gold'], sex: 'tom', scale: 0.98, bulk: 1, sheen: true, mud: 'elbows' }
  ];
  // Sloshbank, the ReedClan speaker: big, heavy and stern, solid brown with darker legs (no tabby
  // stripes), bigger than Tallyheart; his belly fur clumped wet with water always dripping off it
  // (`wet`: a few drops falling, one on the ground) and big muddy paws (`mud: 'paws'`, `pawK`)
  PRESETS.sloshbank = { fur: 'grey', coat: 'sloshbank', over: { base: '#86603f', line: '#36230f', light: '#a37c58', feat: '#2a1b0c', whisk: '#e8d9c4', nose: '#a8705f', earIn: '#c69a86' },
    muzzle: '#9a7552', eyes: ['hazel', 'hazel'], sex: 'tom', scale: 1.22, bulk: 1.34, legW: 1.14, tailW: 1.2, heavyBrows: true,
    darkLegs: true, wet: true, mud: 'paws', pawK: 1.22 };
  // The starry cat (chapter 6's dream; not new cast: `starry: true` on a cat). Starlight whatever her
  // coat: pale blue-white, a little see-through, small stars inside her outline, a soft glow at her
  // edge, a kind face. Nobody she knows: every cat drawn starry is this one (no torn ear, no silver
  // tabby, no bow, no scar), whoever the cast entry names.
  var STARRY = { fur: 'white', over: { base: '#dde8fb', shade: '#bccdee', line: '#7c93cb', light: '#ffffff', feat: '#5b6fa8', whisk: '#ffffff', nose: '#cdb9ea', earIn: '#c9d5f6' },
    eyes: ['#fff0b3', '#fff0b3'], sex: 'she', scale: 0.95, bulk: 0.94, starry: true };

  function specFromLook(look) {
    look = look || {};
    var fur = FUR[look.fur] ? look.fur : 'brown-tabby';
    var m = look.marking || 'none', marks = {}, eyes, wf = PALE[fur] ? '#ffffff' : WHITE;
    if (m === 'white-paws') marks.paws = true;
    if (m === 'white-chest') marks.chest = wf;
    if (m === 'back-stripe') marks.back = true;
    if (m === 'nose-splash') marks.splash = true;
    if (PALE[fur] && (marks.paws || marks.chest || marks.splash)) { marks.fill = wf; marks.edge = true; }
    if (look.eyes === 'odd') eyes = ['blue', 'green'];
    else eyes = [EYES[look.eyes] ? look.eyes : 'green', EYES[look.eyes] ? look.eyes : 'green'];
    var tom = look.sex === 'tom' || look.sex === 'he';
    return { fur: fur, marks: marks, muzzle: (marks.chest || marks.splash) ? wf : null, eyes: eyes,
      sex: tom ? 'tom' : 'she', scale: 0.86, bulk: tom ? 0.98 : 0.92 };
  }
  function resolve(s) {
    var sp = {}, k;
    for (k in s) sp[k] = s[k];
    sp.pal = palette(s.fur, s.over);
    sp.pattern = sp.pal.pattern || null;
    sp.marks = s.marks || {};
    sp.iris = (s.eyes || ['green', 'green']).map(function (e) { return EYES[e] || e; });
    return sp;
  }

  // ------------------------------------------------------------------ poses
  // Canonical cat faces right; ground at y = 196 in a 200 x 200 box.
  // Circles are [x, y, r]; legs [[top], [bottom]]; paws [x, y]; haunch [cx, cy, rx, ry, rot].
  // Tails are cubic Beziers from the base outward.

  var POSES = {
    sit: { hip: [74, 165, 30], chest: [113, 131, 22], head: [116, 84, 0],
      far: [{ leg: [[109, 146, 8], [111, 189, 6]], paw: [115, 191] }],
      haunch: [82, 171, 27, 23, -24], backPaws: [[107, 191]],
      near: [{ leg: [[124, 146, 9], [126, 189, 6.5]], paw: [130, 191] }],
      tail: 'wrap', front: { wrap: 1 },
      tails: { wrap: [[52, 184], [32, 199], [104, 200], [150, 184]], up: [[48, 178], [16, 172], [16, 106], [38, 100]],
        down: [[48, 184], [32, 192], [22, 192], [14, 184]], out: [[47, 180], [26, 180], [14, 168], [12, 148]] } },
    lookup: { hip: [74, 165, 30], chest: [111, 131, 22], head: [108, 82, -28], look: [0.4, -4],
      far: [{ leg: [[107, 146, 8], [111, 189, 6]], paw: [115, 191] }],
      haunch: [82, 171, 27, 23, -24], backPaws: [[107, 191]],
      near: [{ leg: [[122, 146, 9], [126, 189, 6.5]], paw: [130, 191] }],
      tail: 'wrap', front: { wrap: 1 },
      tails: { wrap: [[52, 184], [32, 199], [104, 200], [150, 184]], up: [[48, 178], [16, 172], [16, 106], [38, 100]],
        down: [[48, 184], [32, 192], [22, 192], [14, 184]], out: [[47, 180], [26, 180], [14, 168], [12, 148]] } },
    stand: { hip: [64, 130, 22], chest: [114, 128, 24], head: [148, 88, 0],
      far: [{ leg: [[110, 142, 8], [108, 189, 6]], paw: [112, 191] }, { leg: [[58, 142, 9], [53, 189, 6]], paw: [57, 191] }],
      near: [{ thigh: [68, 142, 16, 22, 12], leg: [[70, 150, 9], [66, 189, 6.5]], paw: [70, 191] }, { leg: [[122, 142, 9], [124, 189, 6.5]], paw: [128, 191] }],
      tail: 'up',
      tails: { up: [[45, 124], [20, 118], [18, 68], [38, 60]], out: [[45, 126], [26, 126], [12, 114], [12, 96]],
        down: [[45, 128], [28, 140], [22, 168], [30, 186]], wrap: [[45, 128], [28, 140], [22, 168], [30, 186]] } },
    walk: { hip: [64, 132, 22], chest: [114, 132, 24], head: [148, 94, 5],
      far: [{ leg: [[110, 144, 8], [97, 189, 6]], paw: [101, 191] }, { leg: [[58, 144, 9], [73, 189, 6]], paw: [77, 191] }],
      near: [{ thigh: [66, 144, 16, 22, 30], leg: [[66, 152, 9], [48, 189, 6.5]], paw: [52, 191] }, { leg: [[122, 144, 9], [140, 188, 6.5]], paw: [144, 190] }],
      tail: 'up',
      tails: { up: [[45, 126], [20, 120], [18, 70], [38, 62]], out: [[45, 128], [26, 128], [12, 116], [12, 98]],
        down: [[45, 130], [28, 142], [22, 170], [30, 186]], wrap: [[45, 130], [28, 142], [22, 170], [30, 186]] } },
    crouch: { hip: [72, 164, 24], chest: [118, 172, 20], head: [148, 152, 6],
      far: [{ leg: [[116, 180, 7], [132, 191, 5]], paw: [137, 192] }, { paw: [50, 192] }],
      haunch: [72, 174, 24, 18, -8], backPaws: [[94, 192]],
      near: [{ leg: [[126, 182, 8], [146, 191, 6]], paw: [151, 192] }],
      tail: 'low', moodTail: false,
      tails: { low: [[52, 160], [32, 164], [18, 172], [14, 152]] } },
    curl: { hip: [92, 168, 29], chest: [112, 168, 27], head: [138, 164, 18], look: [0, 1],
      near: [{ paw: [154, 192] }, { paw: [143, 193] }],
      tail: 'wrap', front: { wrap: 1 }, moodTail: false,
      tails: { wrap: [[66, 182], [60, 198], [126, 200], [168, 188]] } },
    loaf: { hip: [78, 167, 29], chest: [118, 168, 28], head: [138, 126, 0],
      far: [{ paw: [140, 192] }], near: [{ paw: [152, 193] }],
      tail: 'wrap', front: { wrap: 1 },
      tails: { wrap: [[54, 180], [38, 196], [92, 198], [126, 190]], up: [[54, 156], [26, 150], [24, 92], [48, 84]],
        flag: [[54, 156], [26, 150], [24, 92], [48, 84]], down: [[52, 184], [34, 192], [22, 192], [14, 184]],
        out: [[52, 178], [30, 182], [16, 176], [12, 158]] } },
    flat: { hip: [64, 185, 13], chest: [118, 184, 14], head: [148, 168, 6], earBias: 26,
      far: [{ paw: [162, 193] }, { paw: [46, 193] }], near: [{ paw: [172, 194] }],
      tail: 'flat', moodTail: false,
      tails: { flat: [[52, 187], [36, 194], [22, 194], [12, 190]] } },
    lie: { hip: [66, 175, 22], chest: [110, 173, 22], head: [140, 134, 0],
      far: [{ leg: [[104, 185, 7], [144, 190, 5]], paw: [149, 191] }],
      haunch: [70, 179, 24, 17, 0], backPaws: [[94, 192]],
      near: [{ leg: [[114, 187, 8], [154, 191, 6]], paw: [160, 192] }],
      tail: 'flat', moodTail: false,
      tails: { flat: [[46, 183], [30, 194], [18, 194], [12, 184]] } },
    fall: { hip: [56, 172, 22], chest: [100, 170, 24], head: [146, 160, -34], belly: true, look: [1, -1],
      far: [{ leg: [[68, 156, 8], [78, 116, 6]], paw: [79, 111], up: true }, { leg: [[104, 152, 8], [114, 114, 6]], paw: [115, 109], up: true }],
      near: [{ leg: [[54, 158, 9], [44, 118, 6.5]], paw: [43, 113], up: true }, { leg: [[92, 154, 9], [92, 112, 6.5]], paw: [92, 107], up: true }],
      tail: 'curl', moodTail: false,
      tails: { curl: [[38, 178], [16, 188], [10, 152], [26, 142]] } },
    stretch: { hip: [86, 160, 22], chest: [104, 114, 21], head: [110, 80, -18], look: [0.6, -4],
      far: [{ leg: [[110, 108, 7], [148, 52, 5]], paw: [152, 47] }, { paw: [104, 192] }],
      haunch: [84, 170, 20, 25, 15], backPaws: [[100, 192]],
      near: [{ leg: [[118, 114, 8], [164, 60, 6]], paw: [168, 54], afterHead: true }],
      tail: 'down', moodTail: false,
      tails: { down: [[68, 178], [52, 190], [38, 194], [26, 186]] } },
    peer: { hip: [78, 165, 26], chest: [116, 133, 22], head: [146, 98, 14], look: [1.6, 2.6],
      far: [{ leg: [[118, 136, 7], [152, 122, 5]], paw: [158, 121] }],
      haunch: [80, 173, 24, 21, -20], backPaws: [[102, 192]],
      near: [{ leg: [[128, 140, 8], [160, 127, 6]], paw: [166, 125] }],
      tail: 'down',
      tails: { down: [[52, 182], [32, 194], [20, 188], [18, 168]], up: [[52, 172], [22, 166], [20, 102], [42, 96]],
        wrap: [[52, 182], [32, 194], [20, 188], [18, 168]], out: [[52, 178], [30, 178], [16, 166], [14, 146]] } },
    // chapter 3: sitting, the near forepaw raised in front of the chest, pads toward us (the rim's
    // five raised paws, "Can I put my paw down now?"); `claws: true` puts its claws out
    pawup: { hip: [74, 165, 30], chest: [112, 131, 22], head: [112, 84, -3], look: [0.4, 0],
      far: [{ leg: [[108, 146, 8], [111, 189, 6]], paw: [115, 191] }],
      haunch: [82, 171, 27, 23, -24], backPaws: [[107, 191]],
      near: [{ leg: [[124, 142, 9], [150, 126, 6.5]], paw: [156, 121], up: true, raise: true }],
      tail: 'wrap', front: { wrap: 1 },
      tails: { wrap: [[52, 184], [32, 199], [104, 200], [150, 184]], up: [[48, 178], [16, 172], [16, 106], [38, 100]],
        down: [[48, 184], [32, 192], [22, 192], [14, 184]], out: [[47, 180], [26, 180], [14, 168], [12, 148]] } },
    // on her back, paws in the air, soft and still (rolling over for a friend): calmer than `fall`
    tummy: { hip: [60, 178, 21], chest: [104, 176, 23], head: [148, 168, -22], belly: true, look: [1, -1.4],
      far: [{ leg: [[70, 166, 8], [80, 138, 6]], paw: [82, 133], up: true }, { leg: [[108, 160, 8], [124, 140, 6]], paw: [127, 135], up: true }],
      near: [{ leg: [[58, 168, 9], [48, 140, 6.5]], paw: [46, 135], up: true }, { leg: [[96, 162, 9], [102, 134, 6.5]], paw: [103, 129], up: true }],
      tail: 'flat', moodTail: false,
      tails: { flat: [[42, 186], [26, 194], [14, 194], [6, 188]] } },
    // chapter 4: sitting up on the haunches like a squirrel, both forepaws held up in front of the
    // chest, pads toward us, claws out (Tallyheart's "Two forepaws. Ten claws", the five on the rim:
    // "We look like squirrels"). The far forepaw is drawn in front of the chest too (`far` on a near
    // limb: the far side's shade, the near side's place in the drawing order).
    situp: { hip: [80, 166, 29], chest: [100, 126, 22], head: [102, 77, 0], look: [0.4, 0], claws: true,
      far: [],
      haunch: [86, 172, 27, 23, -32], backPaws: [[112, 191]],
      near: [{ leg: [[103, 130, 8], [118, 127, 6]], paw: [124, 121], up: true, far: true },
        { leg: [[110, 135, 9], [137, 131, 6.5]], paw: [144, 125], up: true }],
      tail: 'wrap', front: { wrap: 1 },
      tails: { wrap: [[58, 184], [36, 199], [100, 200], [142, 186]], up: [[54, 178], [22, 172], [22, 106], [44, 100]],
        down: [[54, 184], [38, 192], [28, 192], [20, 184]], out: [[53, 180], [32, 180], [20, 168], [18, 148]] } },
    // chapter 8: running flat out (the chase home): the body low and long, the forelegs reaching, the
    // hind legs pushing off behind, the tail streaming out behind; her eyes open, whatever the mood
    run: { hip: [56, 140, 21], chest: [114, 136, 23], head: [154, 110, 8], look: [0.6, 0], openEyes: true,
      far: [{ leg: [[110, 148, 7.5], [150, 166, 5.5]], paw: [156, 167] }, { leg: [[54, 150, 8.5], [26, 176, 5.5]], paw: [21, 179] }],
      near: [{ thigh: [60, 148, 16, 21, -40], leg: [[56, 158, 9], [20, 186, 6.5]], paw: [15, 190] }, { leg: [[122, 148, 9], [166, 184, 6.5]], paw: [172, 188] }],
      tail: 'stream', moodTail: false,
      tails: { stream: [[40, 134], [22, 126], [8, 122], [-6, 114]] } }
  };
  // chapter 8, not a pose of the vocabulary: `stand` with the near and far legs set a little apart, so
  // all four paws show along the ground, two and two (one cat's paws counted by pairs: the Counts art's)
  POSES.stand4 = { hip: [64, 130, 22], chest: [114, 128, 24], head: [148, 88, 0],
    far: [{ leg: [[110, 142, 8], [110, 189, 6]], paw: [113, 191] }, { leg: [[58, 142, 9], [39, 189, 6]], paw: [42, 191] }],
    near: [{ thigh: [66, 142, 16, 22, 4], leg: [[68, 150, 9], [63, 189, 6.5]], paw: [67, 191] }, { leg: [[122, 142, 9], [134, 189, 6.5]], paw: [138, 191] }],
    tail: 'up', tails: POSES.stand.tails };
  // chapter 8, `tailUp: true` (sit, stand, crouch, walk): the tail held straight up, its tip curled
  // over toward her head, standing well above the ears of a crouching cat (Tallyheart's tail sticking
  // up out of the weeds; "Your tail goes straight up."). `tap: 'tail'` marks its tip.
  var TAIL_UP = {
    sit: [[50, 176], [36, 138], [30, 70], [54, 60]],
    stand: [[46, 124], [36, 90], [32, 44], [56, 36]],
    walk: [[46, 126], [36, 92], [32, 46], [56, 38]],
    crouch: [[54, 154], [42, 112], [38, 58], [62, 48]]
  };

  // chapter 5, `reach: true` on a crouching cat (her paw held over a tiny print in the marsh mud,
  // from the raft: "You hold your paw over one. It's half the size of yours."). An extra, not a pose:
  // crouched at an edge, nose down, the near forepaw held out and down past the edge, pads down,
  // touching nothing. That paw hangs below the line her other feet are on, so the fit (in buildCat)
  // rests IT on the bottom of her box and lifts the rest of her; the result says where both are
  // (`reach: { x, y, r, edge }`, in her box: the paw's middle and half-width, and the line of the
  // edge she is crouched on), and whoever places her puts that line on the edge.
  var REACH = {
    crouch: { hip: [72, 164, 24], chest: [118, 172, 20], head: [150, 151, 13], look: [1.2, 2.8],
      far: [{ leg: [[116, 180, 7], [132, 191, 5]], paw: [137, 192] }, { paw: [50, 192] }],
      haunch: [72, 174, 24, 18, -8], backPaws: [[94, 192]],
      near: [{ leg: [[127, 180, 8], [157, 207, 6.5]], paw: [162, 213], reach: true }],
      tail: 'low', moodTail: false,
      tails: { low: [[52, 160], [32, 164], [18, 172], [14, 152]] } }
  };

  // poses whose head rests on top of the chest, so it follows a slim cat's lower chest down
  var NECK_FOLLOWS = { sit: 1, lookup: 1, lie: 1, loaf: 1, stand: 1, walk: 1, peer: 1, stretch: 1, pawup: 1, situp: 1, stand4: 1 };

  var MOOD_TAIL = { happy: 'up', proud: 'up', wonder: 'up', laugh: 'up', shout: 'up', dreamy: 'wrap',
    kind: 'wrap', sleepy: 'wrap', worried: 'down', stern: 'out', sniff: 'out', sad: 'down', shy: 'wrap' };
  var EAR_ANG = { neutral: 0, happy: -2, dreamy: 4, wonder: -6, worried: 24, scared: 58, sleepy: 14, laugh: 6,
    stern: -10, kind: 3, proud: -4, sniff: -6, shout: 10, solemn: -3, sad: 30, shy: 14 };
  var HEAD_ROT = { proud: -12, laugh: -8, shout: -6, wonder: -5, sleepy: 7, worried: 4, sniff: 7, scared: 5, dreamy: -6, solemn: -9, sad: 6, shy: 9 };
  var EYE_KIND = { neutral: 'open', happy: 'arc', dreamy: 'lidUp', wonder: 'wonder', worried: 'open', scared: 'scared',
    sleepy: 'closed', laugh: 'squeeze', stern: 'lidFlat', kind: 'lidKind', proud: 'arc', sniff: 'lidSoft', shout: 'open', solemn: 'lidHalf',
    sad: 'lidSad', shy: 'lidShy' };
  var BROW = { worried: [-5, 3], scared: [-6, 3], stern: [5, -4], shout: [-4, -5], solemn: [-3, -3], sad: [-7, 3.5], shy: [-3.5, 1.5] };   // shout is excitement in this story (calls, cheers, "Thirteen!"), so raised brows, never cross; solemn: level, no frown
  // upper lids for the 'lid' eye kinds: [inner corner y, curve control y, outer corner y], in eye coordinates
  // lidKind: soft, a little lifted, so a kind face reads warm and never sly (it looks at you, pupils centred)
  // lidSad: high at the inner corner, drooping to the outer (homesick); lidShy: lowered, the eyes looking down
  // lidDrowsy (chapter 7, `asleep: 'half'`): heavy, down to the middle of the eye, its edge sagging a little in
  // the middle, so what shows of the eye is a soft crescent (a content cat's slow blink, never a glare)
  var LID = { lidSoft: [2, -10.5, -2], lidFlat: [3.4, 1.4, -4.6], lidHalf: [-0.4, 0.4, -1.2], lidKind: [1.2, -12.8, -3.4], lidDrowsy: [-1.6, 4.0, -0.4],
    lidSad: [-7.6, -8.6, -1.4], lidShy: [1.4, -8.8, -0.6] };
  var BLUSH = { happy: 1, laugh: 1, kind: 1, dreamy: 1, proud: 1, wonder: 1, shy: 1 };

  // ------------------------------------------------------------------ the head

  var HEAD = 'M-27,-24C-14,-33 14,-33 27,-24C36,-17 39,-6 38,4L45,10L37,13L42,19L33,19C24,29 -24,29 -33,19L-42,19L-37,13L-45,10L-38,4C-39,-6 -36,-17 -27,-24Z';
  var EAR = 'M-13,4Q-9,-14 1,-31Q9,-14 14,4Z';
  var EAR_NOTCH = 'M-13,4Q-9,-14 1,-31L7,-23L-1,-18L9,-12Q12,-5 14,4Z';
  var EAR_RAG = 'M-13,4Q-9,-14 -1,-28L2,-25L3,-29L8,-18L5,-15L10,-11Q12,-5 14,4Z';
  var EAR_IN = 'M-7,2Q-4,-11 1,-21Q5,-11 7,2Z';
  var EAR_IN_NOTCH = 'M-7,2Q-5,-10 -3,-15L1,-13Q5,-7 7,2Z';
  var EYE = 'M-9.6,2C-9.6,-6.7 -4.8,-11.2 0.8,-11.2C6.2,-11.2 9.6,-7 9.6,-2C9.6,5.6 5,11.2 -0.4,11.2C-5.6,11.2 -9.6,7.4 -9.6,2Z';
  var EYE_TOP = 'M-9.6,2C-9.6,-6.7 -4.8,-11.2 0.8,-11.2C6.2,-11.2 9.6,-7 9.6,-2';
  var EYE_BOT = 'M-9.6,2C-9.6,7.4 -5.6,11.2 -0.4,11.2C5,11.2 9.6,5.6 9.6,-2';
  var MOUTH = {
    w: 'M0,11.6V13.4M-5.6,12.4Q-2.8,16.4 0,13.4Q2.8,16.4 5.6,12.4',
    smile: 'M0,11.6V13.6M-7.6,11.2Q-3.8,17.4 0,13.6Q3.8,17.4 7.6,11.2',
    line: 'M0,11.6V14M-4.6,14.2H4.6',
    wavy: 'M0,11.6V13.2M-5.4,15.4Q-2.7,12.4 0,14.6Q2.7,16.8 5.4,14',
    frown: 'M0,11.6V13.6M-6,15.8Q0,12.2 6,15.8',
    // chapter 3: sad's wobbly mouth (turned down, trembling) and shy's small smile
    wobble: 'M0,11.6V13.4M-6.2,16.6Q-4.6,13.6 -3.1,15.2Q-1.6,16.8 0,15Q1.6,16.8 3.1,15.2Q4.6,13.6 6.2,16.6',
    small: 'M0,11.6V13.2M-4.2,12.6Q-2.1,15.6 0,13.2Q2.1,15.6 4.2,12.6'
  };

  function earColor(sp, side) {
    var p = sp.pal;
    if (sp.pattern === 'tortie') return side < 0 ? p.patches[0] : p.base;
    if (sp.pattern === 'calico') return side < 0 ? p.patches[0] : p.patches[1];
    return p.base;
  }

  // Ear tips and outer corners in head coordinates (for fitting the cat in its box).
  function earTips(sp, mood, bias) {
    var ff = !!sp.flatFace, hx = sp.headX || (sp.sex === 'tom' ? 1.06 : 1);
    var ea = Math.min(72, (EAR_ANG[mood] || 0) + bias), th = (16 + ea) * Math.PI / 180;
    var ex = (ff ? 25 : 21) * hx, ey = ff ? -16 : -21, es = (sp.earS || 1) * (ff ? 0.74 : 1), out = [];
    [-1, 1].forEach(function (side) {
      [[1, -31], [14, 4], [7, -14]].forEach(function (q) {
        var x = q[0] * es, y = q[1] * es;
        out.push([side * (x * Math.cos(th) - y * Math.sin(th)) + side * ex, x * Math.sin(th) + y * Math.cos(th) + ey]);
      });
    });
    return out;
  }

  // The middle of each ear in head coordinates, for glows that follow the ears when they flatten.
  function earMids(sp, mood, bias) {
    var ff = !!sp.flatFace, hx = sp.headX || (sp.sex === 'tom' ? 1.06 : 1);
    var ea = Math.min(72, (EAR_ANG[mood] || 0) + bias), th = (16 + ea) * Math.PI / 180;
    var ex = (ff ? 25 : 21) * hx, ey = ff ? -16 : -21, es = (sp.earS || 1) * (ff ? 0.74 : 1);
    return [-1, 1].map(function (side) {
      var x = 1 * es, y = -15 * es;
      return [side * (x * Math.cos(th) - y * Math.sin(th)) + side * ex, x * Math.sin(th) + y * Math.cos(th) + ey];
    });
  }

  function headSvg(R, sp, mood, ctx) {
    var p = sp.pal, ff = !!sp.flatFace, tx = ff ? 3 : 4, F = ctx.F;
    var hx = sp.headX || (sp.sex === 'tom' ? 1.06 : 1);
    var s = '';
    // ears
    var ea = Math.min(72, (EAR_ANG[mood] || 0) + (ctx.earBias || 0));
    var ex = (ff ? 25 : 21) * hx, ey = ff ? -16 : -21, es = (sp.earS || 1) * (ff ? 0.74 : 1);
    [-1, 1].forEach(function (side) {
      var vs = side * F;
      var shape = sp.notch && vs === 1 ? EAR_NOTCH : sp.ragged && vs === 1 ? EAR_RAG : EAR;
      s += '<g transform="translate(' + N(side * ex) + ',' + ey + ') scale(' + side + ',1) rotate(' + N(16 + ea) + ') scale(' + N(es) + ')">' +
        '<path d="' + shape + '" fill="' + earColor(sp, side) + '" stroke="' + p.line + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="' + (shape === EAR_NOTCH ? EAR_IN_NOTCH : EAR_IN) + '" fill="' + p.earIn + '"/></g>';
    });
    // chapter 3, `puffed: true`: the fur round the face stands on end too
    if (ctx.puffed) s += '<path d="' + spiky(ellipseG(0, 3, sp.fluffy ? 54 : 49, sp.fluffy ? 42 : 37, 0, 7).pts, 7) + '" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="2.2" stroke-linejoin="round"/>';
    // the head shape
    var hd;
    if (sp.fluffy) {
      var hp = [];
      for (var i = 0; i < 24; i++) {
        var a = Math.PI * 2 * i / 24, c = Math.cos(a), sn = Math.sin(a);
        var cheek = Math.max(0, sn) * Math.abs(c) * 10;
        hp.push([c * (44 + cheek), sn * 33 + (sn > 0 ? sn * 2 : 0) - 1]);
      }
      hd = scallop(hp, 0.66);
    } else {
      hd = hx === 1 ? HEAD : scalePath(HEAD, hx, 1);
    }
    var inner = '<ellipse cx="-9" cy="-21" rx="14" ry="5.5" transform="rotate(-10 -9 -21)" fill="' + p.light + '" opacity=".55"/>';
    if (sp.pattern === 'tortie') {
      inner += '<path d="' + blob(-30, -14, 27, 3) + '" fill="' + p.patches[0] + '"/><path d="' + blob(24, -27, 10, 5) + '" fill="' + p.patches[1] + '"/>' +
        '<path d="' + blob(30, 14, 7, 9) + '" fill="' + p.patches[0] + '"/>';
    } else if (sp.pattern === 'calico') {
      inner += '<path d="' + blob(-30, -14, 26, 3) + '" fill="' + p.patches[0] + '"/><path d="' + blob(28, -24, 16, 6) + '" fill="' + p.patches[1] + '"/>';
    } else if (sp.pattern === 'tabby') {
      inner += '<path d="M' + (tx - 7) + ',-30L' + (tx - 5) + ',-19M' + tx + ',-32L' + tx + ',-20M' + (tx + 7) + ',-30L' + (tx + 5) + ',-19' +
        'M40,-3L31,0M41,6L32,6M-40,-3L-31,0M-41,6L-32,6" stroke="' + p.stripe + '" stroke-width="3.4" stroke-linecap="round" fill="none"/>';
    }
    if (sp.marks.back) inner += '<path d="M' + tx + ',-34L' + tx + ',-18" stroke="' + mix(p.base, p.line, 0.6) + '" stroke-width="5" stroke-linecap="round"/>';
    // chapter 6: a wet, sleek head (ReedClan): a bright streak over the crown
    if (ctx.sheen) inner += '<path class="pc-sheen" d="M-22,-21Q-6,-30 14,-26" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".6"/>';
    if (sp.marks.chest || sp.marks.chin) inner += '<ellipse cx="' + tx + '" cy="' + (sp.marks.chin ? 24 : 23) + '" rx="' + (sp.marks.chin ? 13 : 17) + '" ry="' + (sp.marks.chin ? 6 : 8) + '" fill="' + (sp.marks.chin || sp.marks.chest) + '"' + (sp.marks.chin ? '' : markEdge(sp)) + '/>';
    if (sp.marks.splash) {
      inner += '<path d="M' + (tx - 3.5) + ',-24Q' + tx + ',-27 ' + (tx + 3.5) + ',-24L' + (tx + 6) + ',2Q' + (tx + 12) + ',10 ' + tx + ',16Q' + (tx - 12) + ',10 ' + (tx - 6) + ',2Z" fill="' + markFill(sp) + '"' + markEdge(sp) + '/>';
    }
    if (sp.fluffy) {
      // a Persian's ruff under the chin
      var rp = [];
      for (var ri = 0; ri < 16; ri++) { var ra = Math.PI * 2 * ri / 16; rp.push([Math.cos(ra) * 40, 30 + Math.sin(ra) * 15]); }
      s += '<path d="' + scallop(rp, 0.7) + '" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="2.2" stroke-linejoin="round"/>';
    }
    s += R.part(hd, { fill: p.base, dark: p.shade, line: p.line, sx: ctx.sx * 0.8, sy: -3.2, inner: inner });
    // chapter 3, `moss: true`: a clump of moss pulled down over the ears (the skinny grey tom, before sunrise)
    if (ctx.moss) s += mossCap(ff);

    // muzzle puffs and chin
    var muz = sp.muzzle || p.light, my = ff ? 10.5 : 12.8, mr = ff ? 7.6 : 6.6;
    s += '<g fill="' + muz + '"><circle cx="' + N(tx - 5.6) + '" cy="' + my + '" r="' + mr + '"/><circle cx="' + N(tx + 5.6) + '" cy="' + my + '" r="' + mr + '"/></g>';

    // eyes (chapter 3, `squeeze: true`: squeezed shut whatever the mood)
    var kind = EYE_KIND[mood] || 'open';
    // chapter 5, `asleep: true`: eyes shut whatever the mood (the old tom on guard, "resting his eyes");
    // chapter 7, `asleep: 'half'`: half asleep, heavy lids down to the middle of the eyes, sagging a little
    // (lidDrowsy; solemn's level lids read as deadpan), with the mood's own mouth and blush: our cat
    // curling up to sleep with a small smile (f103)
    // chapter 8, running flat out (`run`): her eyes open, whatever the mood would shut them with
    if (ctx.openEyes && (kind === 'arc' || kind === 'closed' || kind === 'squeeze')) kind = 'open';
    if (ctx.asleep) kind = ctx.asleep === 'half' ? 'lidDrowsy' : 'closed';
    if (ctx.squeeze) kind = 'squeeze';
    var exd = ff ? 17 : 15.5, eyY = ff ? 1 : -1, ek = ff ? 1.1 : 1;
    var look = ctx.look || [1.4, 0];
    var eid = R.id(), ecl = R.id();
    R.defs += '<path id="' + eid + '" d="' + EYE + '"/><clipPath id="' + ecl + '"><use href="#' + eid + '"/></clipPath>';
    [-1, 1].forEach(function (side) {
      var vs = side * F, iris = vs < 0 ? sp.iris[0] : sp.iris[1];
      var cx = tx + side * exd, k = ek * (kind === 'wonder' ? 1.14 : kind === 'scared' ? 1.08 : 1);
      var lid = p.base;
      if (sp.pattern === 'tortie' || sp.pattern === 'calico') lid = side < 0 ? p.patches[0] : p.base;
      if (sp.pattern === 'calico' && side > 0) lid = p.base;
      // chapter 4, `wink: true`: the front eye shut in a smiling arc, the other open (Tallyheart's
      // slow wink at the doorway); a face whose eyes the mood shuts opens the back one to wink
      var ekind = !ctx.wink || ctx.asleep ? kind : side === 1 ? 'arc' : (kind === 'arc' || kind === 'closed' || kind === 'squeeze') ? 'open' : kind;
      // chapter 5, a dragonfly on her nose: both eyes turn in and down to look at it
      s += '<g transform="translate(' + N(cx) + ',' + N(eyY) + ') scale(' + N(side * k) + ',' + N(k) + ')">' + eyeSvg(ekind, iris, ctx.dragonfly ? [-3.2 * side, 3] : look, side, p, lid, eid, ecl, sp) + '</g>';
    });
    // brows
    var br = BROW[mood] || (sp.heavyBrows ? [1, -1] : null);
    if (br) {
      var shut = kind === 'arc' || kind === 'closed' || kind === 'squeeze';
      var bw = sp.heavyBrows ? 3.4 : 2.5, by = -17 - (kind === 'wonder' ? 2 : 0) - (shut ? 4 : 0);
      s += '<path d="M' + N(tx - 7) + ',' + N(by + br[0]) + 'L' + N(tx - 21) + ',' + N(by + br[1]) + 'M' + N(tx + 7) + ',' + N(by + br[0]) + 'L' + N(tx + 21) + ',' + N(by + br[1]) +
        '" stroke="' + p.feat + '" stroke-width="' + bw + '" stroke-linecap="round" fill="none"/>';
    }
    // scar over his right eye (the viewer's left)
    if (sp.scar) {
      var sside = -F, scx = tx + sside * exd;
      s += '<path d="M' + N(scx - 6 * sside) + ',-26Q' + N(scx + 1 * sside) + ',-6 ' + N(scx + 6 * sside) + ',13" stroke="#dba79f" stroke-width="2.8" fill="none" stroke-linecap="round"/>';
    }
    // blush
    if (BLUSH[mood]) {
      s += '<g fill="#ff8aa5" opacity=".42"><ellipse cx="' + N(tx - 22) + '" cy="10" rx="5.6" ry="3.2"/><ellipse cx="' + N(tx + 22) + '" cy="10" rx="5.6" ry="3.2"/></g>';
    }
    // nose and mouth
    var ny = ff ? -3.4 : 0, ns = mood === 'sniff' ? 1.3 : 1;
    // chapter 5, the nose to tap ("Tap his nose to wake him up"): marked for the page, which makes it glow
    if (ctx.tap) s += tapMark('nose', tx, ny + 10, 10.5);
    s += '<g transform="translate(' + tx + ',' + ny + ')">';
    var ml = p.feat === p.line ? mix(p.line, '#000', 0.1) : p.feat;
    if (ctx.mouthFull) {
      // a mouthful (her supper vole): no mouth of the mood's, only the cheeks puffed round it
      s += '<path d="M-13,13Q-15,18 -11,22M13,13Q15,18 11,22" stroke="' + ml + '" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".55"/>';
    } else if (mood === 'laugh' || mood === 'shout') {
      var big = mood === 'shout';
      s += '<path d="' + (big ? 'M-8.5,12Q0,9.6 8.5,12Q9.6,29 0,30Q-9.6,29 -8.5,12Z' : 'M-8,12Q0,13.2 8,12Q6.6,25 0,25Q-6.6,25 -8,12Z') + '" fill="#7a2c3b" stroke="' + ml + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="' + (big ? 'M-5,25Q0,19 5,25Q3,29.4 0,29.4Q-3,29.4 -5,25Z' : 'M-4.6,21.6Q0,17.6 4.6,21.6Q2.4,24.6 0,24.6Q-2.4,24.6 -4.6,21.6Z') + '" fill="#f2879a"/>';
    } else if (mood === 'wonder' || mood === 'scared') {
      s += '<path d="M0,11.6V12.8" stroke="' + ml + '" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="0" cy="16" rx="' + (mood === 'scared' ? 2.4 : 2.8) + '" ry="3.3" fill="#7a2c3b" stroke="' + ml + '" stroke-width="1.6"/>';
    } else {
      var mk = { happy: 'smile', dreamy: 'smile', kind: 'smile', proud: 'smile', worried: 'wavy', stern: 'frown', solemn: 'line', sad: 'wobble', shy: 'small' }[mood] || 'w';
      s += '<path d="' + MOUTH[mk] + '" stroke="' + ml + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    }
    s += '<path d="M-3.8,7.2Q0,6 3.8,7.2Q2.2,10.6 0,11.7Q-2.2,10.6 -3.8,7.2Z" transform="scale(' + ns + ')" fill="' + p.nose + '" stroke="' + mix(p.nose, '#5a2a33', 0.45) + '" stroke-width="1.2" stroke-linejoin="round"/>';
    s += '</g>';
    // whiskers (a flat face's eyes sit low and big: its whiskers start below them, never across them)
    var wy = ff ? 15 : 12;
    if (ctx.buzz) {
      // chapter 5, `buzz: true` ("Even your whiskers buzz"): every whisker a fine zigzag
      var wz = '';
      [[1, wy, wy - 4], [1, wy + 3, wy + 5], [-1, wy, wy - 4], [-1, wy + 3, wy + 5]].forEach(function (w) { wz += zig([tx + w[0] * 11, w[1]], [tx + w[0] * 36, w[2]], 7, 1.7); });
      s += '<path class="pc-buzz" d="' + wz + '" stroke="' + p.whisk + '" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".85"/>';
    } else
    // (the cat whose nose is to be tapped: his whiskers carry a class, so the page can make them jump)
    s += '<path' + (ctx.tap ? ' class="pc-whiskers"' : '') + ' d="M' + N(tx + 11) + ',' + wy + 'L' + N(tx + 34) + ',' + N(wy - 4) + 'M' + N(tx + 11) + ',' + N(wy + 3) + 'L' + N(tx + 34) + ',' + N(wy + 5) +
      'M' + N(tx - 11) + ',' + wy + 'L' + N(tx - 34) + ',' + N(wy - 4) + 'M' + N(tx - 11) + ',' + N(wy + 3) + 'L' + N(tx - 34) + ',' + N(wy + 5) +
      '" stroke="' + p.whisk + '" stroke-width="1.2" stroke-linecap="round" opacity=".75"/>';
    // extras
    if (mood === 'sniff') {
      s += '<path d="M48,-8q3,-3 6,0t6,0M51,1q3,-3 6,0t6,0M48,10q3,-3 6,0t6,0" stroke="' + p.feat + '" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".7"/>';
    }
    if (mood === 'laugh') {
      s += '<g fill="#9fd6f7" stroke="#5aa6d6" stroke-width=".8"><path d="M' + N(tx + 28) + ',2q3,4 0,6q-3,-2 0,-6Z"/><path d="M' + N(tx - 28) + ',2q3,4 0,6q-3,-2 0,-6Z"/></g>';
    }
    if (sp.bow) {
      var bx = -F * 24;
      s += '<g transform="translate(' + N(bx) + ',-27) rotate(' + (-F * 18) + ')"><path d="M0,0C-6,-11 -19,-9 -17,1C-15,10 -6,6 0,0ZM0,0C6,-11 19,-9 17,1C15,10 6,6 0,0Z" fill="#f47aa8" stroke="#c24c7c" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M-12,-2L-5,0M12,-2L5,0" stroke="#d9608f" stroke-width="1.4" stroke-linecap="round"/><circle r="4" fill="#ff9cc2" stroke="#c24c7c" stroke-width="1.6"/></g>';
    }
    // chapter 3: a misty tear under the front eye; a little cloud of breath in front of the mouth
    if (ctx.tear) s += tearSvg(tx + exd + 1, eyY + 12 * ek, 1);
    if (ctx.mist) s += mistSvg(tx + 46, ff ? 12 : 15, 1);
    // chapter 5: a snail halfway up one ear (the whole ear, never the torn or ragged one), riding it
    // wherever the ear goes; `snail: 'in'`, its horns pulled in. And a dragonfly on the nose.
    if (ctx.snail) {
      s += '<g transform="translate(' + N(-F * ex) + ',' + ey + ') scale(' + (-F) + ',1) rotate(' + N(16 + ea) + ') scale(' + N(es) + ')">' + snailSvg(3.5, -12, -78, 1.3, ctx.snail === 'in') + '</g>';
    }
    if (ctx.dragonfly) s += dragonflySvg(tx - 1, ny + 5.5, 0, 0.62, false, F);
    return s;
  }

  // ------------------------------------------------------------------ chapter 5 extras, shared

  // A zigzag from a to b: `n` teeth, `amp` high (a buzzing whisker, a buzz mark).
  function zig(a, b, n, amp) {
    var d = unit([b[0] - a[0], b[1] - a[1]]), nn = [-d[1], d[0]], s = 'M' + pt(a);
    for (var i = 1; i <= n; i++) {
      var q = lerp2(a, b, i / n);
      s += 'L' + pt(i === n ? q : add(q, nn, i % 2 ? amp : -amp));
    }
    return s;
  }
  // The mark on something to tap: an unpainted circle the size of the thing, class `pc-tap` and
  // `pc-tap-NAME` (a frame's `scratch: { tap: NAME }` finds the one it names, else the first: app/
  // ui.js, tapPick). Nothing is drawn: the page puts its own soft glow on the thing, as big as this.
  function tapMark(name, x, y, r) {
    return '<g class="pc-tap pc-tap-' + name + '"><circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r) + '" fill="none"/></g>';
  }
  // A snail: a soft cream foot, a spiral shell the colour of a ripe apricot (it shows on the old
  // tom's dark ear), two horns with a dot at each tip. (x, y) is the middle of its foot; `rot` turns
  // it (0: heading along +x, its shell above it); `inn`: the horns pulled in, the head drawn back.
  var SNAIL = { foot: '#f3e6c0', footLine: '#9c8752', shell: '#f0b55c', shellLine: '#a4622a', whorl: '#b8762f', shine: '#fbdc9a' };
  function snailSvg(x, y, rot, k, inn) {
    var s = '<path d="' + (inn ? 'M-9,2.4Q-9.4,-1.6 -4,-2Q2,-2.6 5.6,-1.2Q7.4,0.4 6.4,2.4Z' : 'M-9,2.4Q-9.4,-1.6 -4,-2Q4,-2.8 8,-3.2Q11.6,-3 11.4,0Q10.6,2.4 7,2.4Z') +
      '" fill="' + SNAIL.foot + '" stroke="' + SNAIL.footLine + '" stroke-width="1.1" stroke-linejoin="round"/>';
    if (!inn) {
      s += '<g class="pc-horns"><path d="M9,-2.6L10.4,-8.6M10.6,-2.2L14.2,-7" stroke="' + SNAIL.footLine + '" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
        '<g fill="' + SNAIL.footLine + '"><circle cx="10.5" cy="-9.2" r="1.25"/><circle cx="14.6" cy="-7.5" r="1.25"/></g></g>';
    } else s += '<path d="M4.4,-1.4q1.2,-1.4 2.2,0" stroke="' + SNAIL.footLine + '" stroke-width=".9" stroke-linecap="round" fill="none"/>';
    s += '<circle cx="-1.4" cy="-5.2" r="6.4" fill="' + SNAIL.shell + '" stroke="' + SNAIL.shellLine + '" stroke-width="1.3"/>' +
      '<path d="M-1.4,-5.2m3.9,0a3.9,3.9 0 1 1 -3.9,-3.9a2.5,2.5 0 1 1 -2.4,2.9" stroke="' + SNAIL.whorl + '" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M-5.4,-8.6q2,-2 4.6,-2.2" stroke="' + SNAIL.shine + '" stroke-width="1.1" stroke-linecap="round" fill="none"/>';
    return '<g class="pc-snail' + (inn ? ' pc-snail-in' : '') + '" transform="translate(' + N(x) + ',' + N(y) + ') rotate(' + N(rot) + ') scale(' + N(k) + ')">' + s + '</g>';
  }
  // A dragonfly: a slim teal body in segments, a round head, two pairs of glassy wings. (x, y) is
  // where its feet rest; `rot` turns it (0: lying along +x, its head at +x); `asleep`: the wings laid
  // back together over its tail (Patience's dragonfly, asleep on her bill), else held up and out.
  // `F` is -1 where the drawing it sits on will be mirrored (it faces the same way either way).
  var DFLY = { body: '#2f97a8', line: '#1c5f6c', head: '#3db1b6', wing: '#e4f6f7', wingLine: '#7dbcc6', eye: '#12414b' };
  function dragonflySvg(x, y, rot, k, asleep, F) {
    var wings = '';
    (asleep ? [[-152, 19], [-164, 17]] : [[-128, 17], [-104, 18], [-66, 15], [-48, 14]]).forEach(function (w, i) {
      var r = w[0] * Math.PI / 180, cx = 4.6 + Math.cos(r) * w[1] * 0.55, cy = -5 + Math.sin(r) * w[1] * 0.55;
      wings += '<ellipse cx="' + N(cx) + '" cy="' + N(cy) + '" rx="' + N(w[1] * 0.55) + '" ry="' + (asleep ? 3 : 3.4) + '" transform="rotate(' + w[0] + ' ' + N(cx) + ' ' + N(cy) + ')" opacity="' + (i % 2 ? '.7' : '.86') + '"/>';
    });
    var s = '<g fill="' + DFLY.wing + '" stroke="' + DFLY.wingLine + '" stroke-width=".9">' + wings + '</g>' +
      '<path d="M-17,-2.2Q-6,-3.4 3,-4.4" stroke="' + DFLY.line + '" stroke-width="3.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M-17,-2.2Q-6,-3.4 3,-4.4" stroke="' + DFLY.body + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M-12.4,-4.2v2.6M-8,-4.8v2.8M-3.6,-5.4v2.8" stroke="' + DFLY.line + '" stroke-width=".8" fill="none"/>' +
      '<ellipse cx="5.4" cy="-5" rx="4.4" ry="3.3" fill="' + DFLY.body + '" stroke="' + DFLY.line + '" stroke-width="1"/>' +
      '<circle cx="10.6" cy="-5.2" r="2.9" fill="' + DFLY.head + '" stroke="' + DFLY.line + '" stroke-width="1"/>' +
      (asleep ? '<path d="M9.6,-5.4q1.3,1.1 2.6,0" stroke="' + DFLY.eye + '" stroke-width=".8" stroke-linecap="round" fill="none"/>' : '<circle cx="11.5" cy="-6" r="1" fill="' + DFLY.eye + '"/>') +
      '<path d="M3,-2.2l-1.4,2.2M6,-2l0.4,2M8.6,-2.4l1.8,2.2" stroke="' + DFLY.line + '" stroke-width=".7" stroke-linecap="round" fill="none"/>';
    return '<g class="pc-dragonfly" transform="translate(' + N(x) + ',' + N(y) + ') rotate(' + N(rot) + ') scale(' + N(k * (F === -1 ? -1 : 1)) + ',' + N(k) + ')">' + s + '</g>';
  }

  // ------------------------------------------------------------------ chapter 3 extras, shared

  // A misty tear: a pale drop with a soft trail up to the eye. (x, y) is the drop's top, k its size.
  function tearSvg(x, y, k) {
    return '<g class="pc-tear" transform="translate(' + N(x) + ',' + N(y) + ') scale(' + N(k) + ')">' +
      '<path d="M0,-9Q-1.4,-4 -0.4,0" stroke="#cfe9f7" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M0,0C-4.4,6 -4.8,9.4 -2.6,11.6C-1,13 1.6,13 3,11.4C4.8,9.2 4,6 0,0Z" fill="#e4f4fc" stroke="#7fb4d3" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<ellipse cx="-1" cy="8.6" rx="1.1" ry="1.8" fill="#fff"/></g>';
  }
  // A little cloud of mist: breath in the cool dark, or a burp. (x, y) is its middle, k its size;
  // it drifts away to the right (the way the face looks, before any mirroring).
  var MIST = [[-9, 2, 7], [-1, -3, 8.6], [8, 1, 7.4], [1, 5, 7], [15, -4, 4.4], [21, -9, 2.8]];
  function mistSvg(x, y, k) {
    var c = MIST.map(function (q) { return '<circle cx="' + N(q[0]) + '" cy="' + N(q[1]) + '" r="' + N(q[2]) + '"/>'; }).join('');
    return '<g class="pc-mist" transform="translate(' + N(x) + ',' + N(y) + ') scale(' + N(k) + ')">' +
      '<g fill="none" stroke="#9fb0b8" stroke-width="2.4" opacity=".6">' + c + '</g><g fill="#f1f6f8" opacity=".94">' + c + '</g>' +
      '<path d="M-6,-1q4,-4 8,-1" stroke="#ffffff" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>';
  }
  var MIST_BOX = [[-17, -12], [24, -12], [-17, 13], [24, 13]];
  // A clump of moss pulled over a cat's ears, in head coordinates: a soft mossy cap over the top of
  // the head, bulging where the ears are under it and draping down each side, never over the eyes.
  function mossCap(ff) {
    var y0 = ff ? 5 : 0, pts = [[-55, 2], [-57, -18], [-49, -40], [-36, -60], [-22, -50], [0, -48], [22, -50], [36, -60], [49, -40], [57, -18], [55, 2], [46, 6], [39, -12], [22, -22], [0, -24], [-22, -22], [-39, -12], [-46, 6]]
      .map(function (q) { return [q[0], q[1] + y0]; });
    var d = crClosed(pts), fuzz = '';
    for (var i = 0; i < 11; i++) {
      var q = pts[i], nx = pts[i + 1], dx = nx[0] - q[0], dy = nx[1] - q[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
      var m = [(q[0] + nx[0]) / 2, (q[1] + nx[1]) / 2];
      fuzz += 'M' + pt(m) + 'l' + N(dy / l * 5) + ',' + N(-dx / l * 5) + 'M' + pt(q) + 'l' + N(dy / l * 3.6) + ',' + N(-dx / l * 3.6);
    }
    return '<g class="pc-moss"><path d="' + d + '" fill="#7aa055" stroke="#3f5f2a" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M-30,' + (-44 + y0) + 'Q0,' + (-40 + y0) + ' 30,' + (-44 + y0) + 'Q14,' + (-30 + y0) + ' 0,' + (-31 + y0) + 'Q-14,' + (-30 + y0) + ' -30,' + (-44 + y0) + 'Z" fill="#93ba68" opacity=".7"/>' +
      '<path d="' + fuzz + '" stroke="#3f5f2a" stroke-width="2" stroke-linecap="round"/>' +
      '<g fill="#5d8240"><circle cx="-26" cy="' + (-36 + y0) + '" r="2.6"/><circle cx="4" cy="' + (-38 + y0) + '" r="3"/><circle cx="28" cy="' + (-34 + y0) + '" r="2.4"/><circle cx="-46" cy="' + (-14 + y0) + '" r="2.2"/><circle cx="47" cy="' + (-16 + y0) + '" r="2.2"/><circle cx="-12" cy="' + (-28 + y0) + '" r="1.8"/></g>' +
      '<path d="M-50,' + (-6 + y0) + 'q-2,8 2,14M50,' + (-6 + y0) + 'q2,8 -2,14" stroke="#5d8240" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>';
  }
  var MOSS_BOX = [[-56, -60], [58, -60], [-56, 10], [58, 10]];

  // One eye in local coordinates (outer corner at +x).
  function eyeSvg(kind, iris, look, side, p, lid, eid, ecl, sp) {
    var lc = p.line === p.feat ? p.line : mix(p.line, '#000', 0.2), she = sp.sex !== 'tom';
    var lash = she ? '<path d="M8.6,-3.4L13.6,-7.6" stroke="' + lc + '" stroke-width="2.2" stroke-linecap="round"/>' : '';
    if (kind === 'arc') return '<path d="M-9,3.4Q0,-9 9.4,1.6" stroke="' + p.feat + '" stroke-width="3.3" fill="none" stroke-linecap="round"/>';
    if (kind === 'closed') return '<path d="M-9,-0.6Q0,7.6 9.4,-2.2" stroke="' + p.feat + '" stroke-width="3" fill="none" stroke-linecap="round"/>' + (she ? '<path d="M9.4,-2.2L13.2,-4.4" stroke="' + p.feat + '" stroke-width="2" stroke-linecap="round"/>' : '');
    if (kind === 'squeeze') return '<path d="M7.6,-6.4L-5.4,0L7.6,6.4" stroke="' + p.feat + '" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    var lx = look[0] * side, ly = look[1];
    var pupil, hl;
    if (kind === 'wonder') {
      pupil = '<circle cx="' + N(lx) + '" cy="' + N(ly + 0.5) + '" r="6.2" fill="#221b26"/>';
      hl = '<circle cx="' + N(lx - 3.4 * side) + '" cy="' + N(ly - 3.6) + '" r="3.9" fill="#fff"/><circle cx="' + N(lx + 3 * side) + '" cy="' + N(ly + 3.6) + '" r="1.9" fill="#fff"/><circle cx="' + N(lx + 3.6 * side) + '" cy="' + N(ly - 4.6) + '" r="1.1" fill="#fff"/>';
    } else if (kind === 'scared') {
      pupil = '<ellipse cx="' + N(lx * 0.4) + '" cy="0.5" rx="1.9" ry="3.6" fill="#221b26"/>';
      hl = '<circle cx="' + N(-3.4 * side) + '" cy="-4.6" r="2.4" fill="#fff"/>';
    } else {
      // lidHalf: looking down her nose; lidShy: eyes down; lidSad: big wet eyes under drooping lids
      var py = kind === 'lidUp' ? -2.2 : ly + (kind === 'lidSoft' ? 1.6 : kind === 'lidHalf' ? 2.4 : kind === 'lidShy' ? 4.6 : kind === 'lidSad' ? 0.6 : 0.4);
      pupil = '<ellipse cx="' + N(kind === 'lidUp' ? lx * 0.5 : lx) + '" cy="' + N(py) + '" rx="' + (kind === 'lidSad' ? '3.8' : '3.4') + '" ry="7" fill="#221b26"/>';
      hl = kind === 'lidUp' ? '<circle cx="' + N(-3.2 * side) + '" cy="1.4" r="2.6" fill="#fff"/><circle cx="' + N(2.6 * side) + '" cy="5.6" r="1.3" fill="#fff"/>' :
        kind === 'lidSad' ? '<circle cx="' + N(lx - 3 * side) + '" cy="' + N(py - 1.6) + '" r="2.9" fill="#fff"/><circle cx="' + N(lx + 2.6 * side) + '" cy="' + N(py + 4.4) + '" r="1.5" fill="#fff"/>' +
          '<path d="M-7.4,7.8Q0,11 7.4,7.8" stroke="#ffffff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".75"/>' :
        kind.indexOf('lid') === 0 ? '<circle cx="' + N(lx - 2.6 * side) + '" cy="' + N(Math.max(py, 0) + 2.6) + '" r="2.2" fill="#fff"/>' :
        '<circle cx="' + N(lx - 3.3 * side) + '" cy="' + N(ly - 4.4) + '" r="3.2" fill="#fff"/><circle cx="' + N(lx + 2.6 * side) + '" cy="' + N(ly + 4.4) + '" r="1.5" fill="#fff"/>';
    }
    var g = '<g clip-path="url(#' + ecl + ')"><use href="#' + eid + '" fill="' + iris + '"/>' +
      '<ellipse cx="0" cy="-11" rx="13" ry="7.6" fill="' + mix(iris, p.line, 0.38) + '" opacity=".75"/>' +
      '<ellipse cx="0" cy="11.6" rx="10" ry="5" fill="' + mix(iris, '#ffffff', 0.38) + '"/>' + pupil + hl;
    if (kind === 'lidUp') {
      // dreamy: an arched upper lid, eyes gazing up
      return g + '<path d="M-13,-1.6Q0,-12.6 13,-5.6L13,-15L-13,-15Z" fill="' + lid + '"/></g>' +
        '<use href="#' + eid + '" fill="none" stroke="' + lc + '" stroke-width="1.8"/>' +
        '<path d="M-9.8,-1.4Q0,-11.6 9.8,-5.2" stroke="' + lc + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
        (she ? '<path d="M9.6,-5.2L14,-8.4" stroke="' + lc + '" stroke-width="2" stroke-linecap="round"/>' : '');
    }
    if (kind.indexOf('lid') === 0) {
      var ld = LID[kind] || LID.lidSoft, iy = ld[0], cy = ld[1], oy = ld[2];
      g += '<path d="M-12,' + iy + 'Q0,' + cy + ' 12,' + oy + 'L12,-14L-12,-14Z" fill="' + lid + '"/></g>' +
        '<path d="' + EYE_BOT + '" stroke="' + lc + '" stroke-width="2" fill="none"/>' +
        '<path d="M-9.6,' + iy + 'Q0,' + cy + ' 9.6,' + oy + '" stroke="' + lc + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>' + (she ? '<path d="M9.4,' + oy + 'L13.6,' + (oy - 3.4) + '" stroke="' + lc + '" stroke-width="2" stroke-linecap="round"/>' : '');
      return g;
    }
    return g + '</g><use href="#' + eid + '" fill="none" stroke="' + lc + '" stroke-width="2"/>' +
      '<path d="' + EYE_TOP + '" stroke="' + lc + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>' + lash;
  }

  // ------------------------------------------------------------------ a held prop: Riffle's lucky stone

  // opts.flatEars lays the ears this much flatter than the mood's (the old tom counted on the rim)
  var FLAT_EARS = 46;
  // Smooth, nearly black, with one unbroken white band all the way around (chapter 2's Art needs).
  // Centred on 0,0, about a quarter of a head wide.
  var STONE = 'M-10.5,0.6C-10.5,-4.6 -5.4,-7.2 0.4,-7.2C6.4,-7.2 10.6,-4 10.6,0.4C10.6,4.8 6,7.2 -0.2,7.2C-6,7.2 -10.5,5 -10.5,0.6Z';
  var STONE_RX = 10.5, STONE_GROUND = 189;
  var HOLD_AT = { paws: 1, mouth: 1, chin: 1, nose: 1 };
  // a cat on its feet carries the stone in its mouth; sitting or lying, it keeps it at its paws
  var HOLD_MOUTH = { stand: 1, walk: 1, peer: 1, stretch: 1, run: 1 };

  function stoneSvg(R, c, k, rot, sx) {
    var inner = '<ellipse cx="0" cy="5.6" rx="12" ry="4" fill="#141218" opacity=".45"/>' +
      '<path d="M2.2,-8.6Q-3.4,0 2.2,8.6" stroke="#fbf7ee" stroke-width="3.6" fill="none"/>' +
      '<ellipse cx="-5.2" cy="-3.4" rx="3.4" ry="1.5" transform="rotate(-16 -5.2 -3.4)" fill="#9b97a8" opacity=".75"/>';
    return '<g class="pc-stone" transform="translate(' + N(c[0]) + ',' + N(c[1]) + ') rotate(' + N(rot) + ') scale(' + N(k) + ')">' +
      R.part(STONE, { fill: '#2e2b36', dark: '#1d1b23', line: '#0f0e13', sx: sx * 0.4, sy: -1.6, inner: inner, lw: 1.8 }) + '</g>';
  }

  // Chapter 3's other two held things. Sprinkle's pebble: smooth and egg-shaped, mid grey with a
  // faint green-blue cast (a tumbled labradorite at a dull angle), matte, never banded, no flash:
  // clearly lighter than Riffle's nearly black banded stone. Centred on 0,0, a little smaller.
  var PEBBLE = 'M0,-10.6C5.4,-10.6 8.6,-4.8 8.6,1C8.6,6.8 4.8,10.6 0,10.6C-4.8,10.6 -8.6,6.8 -8.6,1C-8.6,-4.8 -5.4,-10.6 0,-10.6Z';
  var PEBBLE_COL = { fill: '#868f90', dark: '#6c7576', line: '#3e4647', light: '#b9c2c1', cast: '#6c9c99' };
  function pebbleSvg(R, c, k, rot, sx) {
    var inner = '<ellipse cx="3.4" cy="5" rx="7.4" ry="6.4" fill="' + PEBBLE_COL.cast + '" opacity=".3"/>' +
      '<ellipse cx="-3" cy="-4.6" rx="3.4" ry="2" transform="rotate(-32 -3 -4.6)" fill="' + PEBBLE_COL.light + '" opacity=".75"/>';
    return '<g class="pc-sprinkle-pebble" transform="translate(' + N(c[0]) + ',' + N(c[1]) + ') rotate(' + N(rot) + ') scale(' + N(k) + ')">' +
      R.part(PEBBLE, { fill: PEBBLE_COL.fill, dark: PEBBLE_COL.dark, line: PEBBLE_COL.line, sx: sx * 0.4, sy: -1.6, inner: inner, lw: 1.8 }) + '</g>';
  }
  // Prey in a mouth or at the paws: the pile set's PC.art.prey (looked up when drawn, as the Counts
  // pictures do), else our own soft prey. Whole, eyes shut, no blood. (cx, cy) is its middle, `wd`
  // its width; `rot` turns it; facing 'right' puts its head forward (before any mirroring).
  function preyHeld(kind, cx, cy, wd, rot, facing, cls) {
    var fn = typeof art.prey === 'function' ? art.prey : preyFallback, q = null;
    try { q = fn({ kind: kind, lit: false, seed: 5, facing: facing || 'right', part: 'body' }); } catch (e) { q = null; }
    if (!q || typeof q.svg !== 'string' || !q.svg || !(q.w > 0) || !(q.h > 0)) q = preyFallback({ kind: kind, lit: false, facing: facing || 'right', part: 'body' });
    var svg = q.svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''), k = wd / q.w;
    return '<g class="' + (cls || 'pc-held') + '" transform="translate(' + N(cx) + ',' + N(cy) + ') rotate(' + N(rot || 0) + ') translate(' + N(-q.w * k / 2) + ',' + N(-q.h * k / 2) + ') scale(' + N(k) + ')">' + svg + '</g>';
  }
  function voleSvg(c, k, rot, flip) { return preyHeld('vole', c[0], c[1], 46 * k, rot, flip ? 'left' : 'right', 'pc-vole'); }
  // Chapter 4's held thing, `holds: 'bark'`: a curl of pale, papery bark from the Training Tree, about
  // the size of a paw (a blank piece of her Case File; the cards themselves are app/art/cards.js, and
  // these are its colours: the pale face she scratches on, the darker outside where one end still
  // curls over). Centred on 0,0, about 24 wide. Flat, matte, no ids.
  var BARK_COL = { face: '#EDE1C5', edge: '#8A7350', grain: '#CDBB93', lip: '#B48D61', lipEdge: '#7A5C3C', under: '#7C6444' };
  function barkSvg(c, k, rot) {
    return '<g class="pc-bark" transform="translate(' + N(c[0]) + ',' + N(c[1]) + ') rotate(' + N(rot) + ') scale(' + N(k) + ')">' +
      '<path d="M-10.4,5.6L6.8,5.2C9.6,5.2 11.6,3.8 12,1.4L12.4,2.6C12,5.4 9.8,6.8 7,6.8L-9.6,7.2Z" fill="' + BARK_COL.under + '"/>' +
      '<path d="M-11.2,3.2C-11.8,-1.8 -9.2,-4.8 -4.8,-4.9L5.4,-5.3C9.4,-5.5 12,-2.8 11.8,0.9C11.6,3.6 9.6,5.2 6.8,5.2L-7,5.6C-9.6,5.7 -11,4.9 -11.2,3.2Z" fill="' + BARK_COL.face + '" stroke="' + BARK_COL.edge + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M-7.6,-1.8h3.6M-2.4,1.2h4M-6.4,3h2.6M0.6,-2.6h2.4" stroke="' + BARK_COL.grain + '" stroke-width="1.1" stroke-linecap="round" fill="none"/>' +
      '<path d="M5.4,-5.3C9.4,-5.5 12,-2.8 11.8,0.9C11.6,3.6 9.6,5.2 6.8,5.2C9,3.4 9.4,0.6 8.4,-1.8C7.8,-3.4 6.8,-4.6 5.4,-5.3Z" fill="' + BARK_COL.lip + '" stroke="' + BARK_COL.lipEdge + '" stroke-width="1.2" stroke-linejoin="round"/></g>';
  }
  // Chapter 8's held things. `holds: 'leaf'`: a green leaf folded over round something small (her
  // proof), its midrib along the fold, the little bump of what is inside it, a stalk; about 30 long,
  // centred on 0,0. `holds: 'glass'`: the same leaf opened flat on the ground, seen a little from
  // above (its veins showing), and on it the small clear piece of tower glass: flat, straight-edged,
  // a pale blue-green edge and two white glints, shining. About 40 wide. Flat, matte, no ids.
  var LEAF_COL = { fill: '#79a24a', dark: '#5d8436', line: '#34521c', rib: '#b9d48a', vein: '#9fc06d', stalk: '#6b5a2c' };
  function leafSvg(c, k, rot) {
    return '<g class="pc-leaf" transform="translate(' + N(c[0]) + ',' + N(c[1]) + ') rotate(' + N(rot) + ') scale(' + N(k) + ')">' +
      '<path d="M-15,1.4l-4.6,1.8" stroke="' + LEAF_COL.stalk + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M-15.2,1.2C-11,-5.6 -2,-9.6 5,-8.6C10.6,-7.8 14.6,-4 16,0.6C11,3.6 2.6,5.4 -4.6,4.6C-9.6,4 -13.4,2.8 -15.2,1.2Z" fill="' + LEAF_COL.fill + '" stroke="' + LEAF_COL.line + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M-6.4,-4.8C-3.6,-9.4 3.4,-10.2 6,-6.2C3.4,-4.6 -2.6,-4 -6.4,-4.8Z" fill="' + LEAF_COL.dark + '" opacity=".75"/>' +
      '<path d="M-14.4,1.4C-6,3.4 4,3.2 15.4,0.6" stroke="' + LEAF_COL.rib + '" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<path d="M-8,-1.8q2.4,-2.6 4.4,-0.4M2,-3.2q2.6,-2.4 4.6,0.2" stroke="' + LEAF_COL.vein + '" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/></g>';
  }
  function glassLeafSvg(c, k, rot) {
    return '<g class="pc-glass" transform="translate(' + N(c[0]) + ',' + N(c[1]) + ') rotate(' + N(rot) + ') scale(' + N(k) + ')">' +
      '<path d="M-21,0.6l-4.2,1.4" stroke="' + LEAF_COL.stalk + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M-21,0.4C-13,-6.8 4,-8 13.4,-5C18,-3.4 20.6,-1.2 21.4,0.6C18,4 8,6.6 -2,6.4C-10,6.2 -17.6,3.8 -21,0.4Z" fill="' + LEAF_COL.fill + '" stroke="' + LEAF_COL.line + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M-20,0.6C-8,0.8 8,0.4 21,0.6M-12,0.6l-3.4,-3.6M-12,0.8l-3,3.2M-3,0.6l-3,-4.6M-3,0.7l-2.6,4.2M6,0.6l-2.4,-4.4M6,0.6l-2,4" stroke="' + LEAF_COL.rib + '" stroke-width="1" fill="none" stroke-linecap="round" opacity=".85"/>' +
      '<path class="pc-glass-piece" d="M-8.4,-1.4L4,-5.8L10,1.2L-2,4.6Z" fill="#dcf3ef" fill-opacity=".9" stroke="#5aa99d" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M-5.6,-1.2L3,-4.2M-0.4,2.6L6.6,0.4" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M3.2,-9.6Q3.8,-6.4 7,-5.8Q3.8,-5.2 3.2,-2Q2.6,-5.2 -0.6,-5.8Q2.6,-6.4 3.2,-9.6Z" fill="#ffffff" stroke="#bfe6df" stroke-width=".7" stroke-linejoin="round"/>' +
      '<circle cx="7.4" cy="1.2" r="1.2" fill="#ffffff"/></g>';
  }
  // what a cat can hold, and how far each reaches from its middle (for the boxes)
  var HOLD_RX = { stone: STONE_RX, pebble: 9, vole: 23, bark: 12.5 };
  HOLD_RX.leaf = 16; HOLD_RX.glass = 22;
  var HOLD_RY = { leaf: 9, glass: 9 };
  function heldSvg(R, h, sx) {
    if (h.what === 'leaf') return leafSvg(h.c, h.k, h.rot);
    if (h.what === 'glass') return glassLeafSvg(h.c, h.k, h.rot);
    if (h.what === 'pebble') return pebbleSvg(R, h.c, h.k, h.rot, sx);
    if (h.what === 'vole') return voleSvg(h.c, h.k, h.rot, h.flip);
    if (h.what === 'bark') return barkSvg(h.c, h.k, h.rot);
    if (h.what === 'pinecone') return pineconeSvg(h.c, h.k, h.rot);
    return stoneSvg(R, h.c, h.k, h.rot, sx);
  }

  // Where a held stone goes: opts.holdAt 'paws' (at the toes of the front paws), 'mouth', 'chin'
  // (tucked in between the paws, right under the chin) or 'nose' (on the ground a little way in
  // front, where she can see it). Unset, a cat on its feet carries it in its mouth and any other cat
  // keeps it at its paws; a cat tumbling over ('fall') holds nothing. `c` is in the cat's body
  // coordinates, or the head's for 'mouth'; `k` scales the stone (a kitten's pebble, a third of a head).
  // Chapter 3: `holds: 'pebble'` (Sprinkle's grey pebble) goes where the stone would; `holds: 'vole'`
  // is carried in the mouth (her supper, out to the hedge) unless holdAt says otherwise (the old tom
  // pushing her one, `holdAt: 'paws'`); on her back ('tummy') a cat holds nothing either.
  function holdPlace(o, pose, P, hm, sp) {
    if (!HOLD_RX[o.holds] || pose === 'fall' || pose === 'tummy') return null;
    var what = o.holds, vole = what === 'vole';
    var at = HOLD_AT[o.holdAt] ? o.holdAt : HOLD_MOUTH[pose] || vole ? 'mouth' : 'paws';
    var tx = sp.flatFace ? 3 : 4, k = vole ? 1 : 1.3, rx = HOLD_RX[what];
    // chapter 6: the old tom's pinecone, placed by rules of its own
    if (what === 'pinecone') return pinePlace(at, P, hm, tx);
    // chapter 8: her leaf, and the glass on it (at her forepaws only), by rules of their own
    if (what === 'leaf' || what === 'glass') return leafPlace(what, what === 'glass' ? 'paws' : at, P, hm, tx);
    // a vole in the mouth sits on the mouth itself, its back just under the nose (a mouthful: the
    // mood's own mouth is not drawn, headSvg's mouthFull)
    if (at === 'mouth') return vole ? { what: what, rx: rx, at: at, c: [tx + 8, 20], k: 1, rot: -5 } : { what: what, rx: rx, at: at, c: [tx + 1, 22], k: 1, rot: -6 };
    if (at === 'chin') {
      // on the ground under the chin; a chin already on the ground (curled up) rests on it from
      // behind, so the stone peeks out in front
      var ch = apply(hm, [tx, 33]), low = Math.max(0, ch[1] - STONE_GROUND);
      if (vole) return { what: what, rx: rx, at: at, c: [ch[0] + 6 + low * 1.3, STONE_GROUND - 6], k: k, rot: 0 };
      return { what: what, rx: rx, at: at, c: [ch[0] + low * 1.3, STONE_GROUND - (STONE_RX * (k - 1)) * 0.7], k: k, rot: -8 };
    }
    // the front paw: whichever forepaw on the ground is furthest forward
    var fp = null;
    (P.near || []).concat(P.far || []).forEach(function (L) { if (L.paw && !L.up && (!fp || L.paw[0] > fp[0])) fp = L.paw; });
    if (!fp) {
      // chapter 4, sitting up (`situp`): no forepaw is on the ground, so it is held up between the two
      // raised forepaws, at her chest
      var ups = (P.near || []).concat(P.far || []).filter(function (L) { return L.paw && L.up; });
      if (ups.length) {
        var ux = 0, uy = 0;
        ups.forEach(function (L) { ux += L.paw[0] / ups.length; uy += L.paw[1] / ups.length; });
        return { what: what, rx: rx, at: at, c: [ux + 1, uy + (vole ? 3 : 5)], k: vole ? 0.8 : 1.15, rot: vole ? 0 : -6 };
      }
      fp = apply(hm, [tx, 30]);
    }
    if (vole) return { what: what, rx: rx, at: at, c: [fp[0] + (at === 'nose' ? 44 : 28), Math.min(STONE_GROUND, fp[1] - 3) - 5], k: k, rot: 0 };
    return { what: what, rx: rx, at: at, c: [fp[0] + (at === 'nose' ? 34 : 13), Math.min(STONE_GROUND, fp[1] - 3) - (STONE_RX * (k - 1)) * 0.7], k: k, rot: at === 'nose' ? 5 : -4 };
  }

  // Claws out (chapter 3's `claws: true`): on a raised paw, pads toward us, four claws over the toes
  // and the dewclaw at its side, five in all, as the Counts count them; on a paw on the ground, the
  // tips of three showing at its front. `high` (chapter 4's `situp`, "Two forepaws. Ten claws."):
  // the dewclaw stands up beside the toes, as the Counts' forepaw draws it. Lying back along the
  // foreleg (chapter 3's `pawup`, unchanged) it is hidden behind the near leg when both paws are
  // held out level, and a child who counts the picture gets eight.
  var CLAW = 'M-1.5,0Q-1.4,-4.6 0.9,-7.4Q1.3,-3.8 1.5,0Z';
  // chapter 5, `tuck: true` ("Nine claws out. One tucked in."): the dewclaw of a raised paw curled
  // back in, a short dull stub where the claw stood (the same claw the Counts pictures tuck)
  var CLAW_IN = 'M-1.9,0Q-2.3,-3.3 -0.2,-3.9Q2.2,-3.5 1.9,0Z', TUCKED_CAT = '#7d7262';
  function catClaws(pp, up, far, lw, p, high, tuck) {
    var k = Math.sqrt(lw), s = '', list;
    if (up) list = [[-5, -7.2, -28], [-1.8, -8.4, -9], [1.8, -8.4, 9], [5, -7.2, 28], high ? [-7.6, -3.4, -58] : [-6.9, 1, -86]];
    else list = [[9.8, -2.6, 64], [10.8, 0.6, 92], [9.6, 3.6, 118]];
    list.forEach(function (c, i) {
      if (tuck && up && i === 4) {
        s += '<path class="pc-tucked" transform="translate(' + N(pp[0] + c[0] * k) + ',' + N(pp[1] + c[1] * k) + ') rotate(' + c[2] + ') scale(' + N(k * 1.1) + ')" d="' + CLAW_IN + '" fill="' + (far ? '#6f6557' : TUCKED_CAT) + '" stroke="#463e33" stroke-width=".8"/>';
        return;
      }
      s += '<path transform="translate(' + N(pp[0] + (up ? 0 : 1) + c[0] * k) + ',' + N(pp[1] + c[1] * k) + ') rotate(' + c[2] + ') scale(' + N(k * 1.1) + ')" d="' + CLAW + '"/>';
    });
    return '<g class="pc-claws" fill="' + (far ? '#ebe4d6' : '#fdf9ef') + '" stroke="' + p.line + '" stroke-width=".9" stroke-linejoin="round">' + s + '</g>';
  }

  // ------------------------------------------------------------------ chapter 6 extras, shared

  // Marsh mud on a leg or a paw (ReedClan to the elbows, Sloshbank's paws)
  var MUD_C = { fill: '#5d4431', far: '#523b2a', light: '#8a6b52' };
  // Several marks to tap under one name (two ears, two eyes, two cheeks): unpainted circles in one
  // group of class pc-tap pc-tap-NAME, whose box the page glows (as tapMark's one)
  function tapMarks(name, list) {
    return '<g class="pc-tap pc-tap-' + name + '">' + list.map(function (c) { return '<circle cx="' + N(c[0]) + '" cy="' + N(c[1]) + '" r="' + N(c[2]) + '" fill="none"/>'; }).join('') + '</g>';
  }
  // A drop of water falling: (x, y) its middle, k its size
  function dropSvg(x, y, k) {
    return '<g class="pc-drop" transform="translate(' + N(x) + ',' + N(y) + ') scale(' + N(k) + ')"><path d="M0,-5.4C-2.8,-0.8 -3.8,1.8 -2.4,3.8C-1.2,5.2 1.2,5.2 2.4,3.8C3.8,1.8 2.8,-0.8 0,-5.4Z" fill="#dcf0fa" stroke="#5f9fc2" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<ellipse cx="-0.9" cy="1.8" rx=".8" ry="1.3" fill="#fff"/></g>';
  }
  // The drip on the ground: a little splash of water, (x, y) its middle on the ground line
  function puddleSvg(x, y, k) {
    return '<g class="pc-puddle" transform="translate(' + N(x) + ',' + N(y) + ') scale(' + N(k) + ')"><ellipse cx="0" cy="0" rx="8.6" ry="2.4" fill="#c4e3f2" stroke="#5f9fc2" stroke-width="1.1"/>' +
      '<path d="M-6,-2.4l-2.4,-3.2M0,-3l0,-3.6M6,-2.4l2.4,-3.2" stroke="#5f9fc2" stroke-width="1.2" stroke-linecap="round" fill="none"/></g>';
  }
  // A four-pointed star of light (the starry cat's), (x, y) its middle, r its reach
  function starSvg(x, y, r) {
    var k = r * 0.28;
    return '<path d="M' + N(x) + ',' + N(y - r) + 'Q' + N(x + k) + ',' + N(y - k) + ' ' + N(x + r) + ',' + N(y) + 'Q' + N(x + k) + ',' + N(y + k) + ' ' + N(x) + ',' + N(y + r) +
      'Q' + N(x - k) + ',' + N(y + k) + ' ' + N(x - r) + ',' + N(y) + 'Q' + N(x - k) + ',' + N(y - k) + ' ' + N(x) + ',' + N(y - r) + 'Z"/>';
  }
  // Chapter 6's held thing, `holds: 'pinecone'`: a big pinecone (the old tom's pillow on guard): rows
  // of woody scales, a stalk at its broad end. Lying along x, centred on 0,0, about 47 long and 25 high.
  var PINE = { fill: '#8d5b30', line: '#40280f', scale: '#5a3818', light: '#c08a54' };
  var PINE_RX = 23, PINE_RY = 12.5;
  HOLD_RX.pinecone = PINE_RX;
  function pineconeSvg(c, k, rot) {
    var sc = '';
    [[-14, [-6.4, 0, 6.4]], [-6, [-9, -3, 3, 9]], [2, [-8.4, -2.8, 2.8, 8.4]], [10, [-5.4, 0, 5.4]], [16.4, [-2.2, 2.2]]].forEach(function (row) {
      row[1].forEach(function (y) { sc += 'M' + N(row[0] - 3.4) + ',' + N(y - 1.4) + 'q3.4,4.2 6.8,0'; });
    });
    return '<g class="pc-pinecone" transform="translate(' + N(c[0]) + ',' + N(c[1]) + ') rotate(' + N(rot) + ') scale(' + N(k) + ')">' +
      '<path d="M-21,0l-5,-1.6" stroke="' + PINE.line + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M-21,0C-21,-8 -12,-12.5 -2,-12.5C9,-12.5 17,-6 22,0C17,6 9,12.5 -2,12.5C-12,12.5 -21,8 -21,0Z" fill="' + PINE.fill + '" stroke="' + PINE.line + '" stroke-width="1.7" stroke-linejoin="round"/>' +
      '<path d="' + sc + '" stroke="' + PINE.scale + '" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M-14,-8.2q8,-4 18,-2.8" stroke="' + PINE.light + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/></g>';
  }
  // Where a pinecone goes (holdPlace's own rules for it, so the stone's never move): carried in the
  // mouth, crosswise; on the ground under the chin (asleep on it), at the paws or by the nose; held
  // up between the paws sitting up
  function pinePlace(at, P, hm, tx) {
    var k = 1.1, gy = 196.5 - PINE_RY * k;
    if (at === 'mouth') return { what: 'pinecone', rx: PINE_RX, at: at, c: [tx + 7, 23], k: 0.78, rot: -6 };
    if (at === 'chin') {
      var ch = apply(hm, [tx, 33]), low = Math.max(0, ch[1] - STONE_GROUND);
      return { what: 'pinecone', rx: PINE_RX, at: at, c: [ch[0] + 6 + low * 1.3, gy], k: k, rot: 0 };
    }
    var fp = null;
    (P.near || []).concat(P.far || []).forEach(function (L) { if (L.paw && !L.up && (!fp || L.paw[0] > fp[0])) fp = L.paw; });
    if (!fp) {
      var ups = (P.near || []).concat(P.far || []).filter(function (L) { return L.paw && L.up; });
      if (ups.length) {
        var ux = 0, uy = 0;
        ups.forEach(function (L) { ux += L.paw[0] / ups.length; uy += L.paw[1] / ups.length; });
        return { what: 'pinecone', rx: PINE_RX, at: at, c: [ux + 1, uy + 6], k: 0.8, rot: -8 };
      }
      fp = apply(hm, [tx, 30]);
    }
    return { what: 'pinecone', rx: PINE_RX, at: at, c: [fp[0] + (at === 'nose' ? 44 : 24), gy], k: k, rot: at === 'nose' ? 4 : -3 };
  }

  // Where her leaf goes (chapter 8): carried crosswise in the mouth (walking, standing, running);
  // else lying on the ground in front of her forepaws (sitting, crouching, lying), or held up between
  // them sitting up. The glass, the leaf opened flat, always lies on the ground at her forepaws.
  function leafPlace(what, at, P, hm, tx) {
    var glass = what === 'glass', rx = HOLD_RX[what];
    if (at === 'mouth') return { what: what, rx: rx, at: at, c: [tx + 9, 21], k: 1, rot: -8 };
    if (at === 'chin') {
      var ch = apply(hm, [tx, 33]), low = Math.max(0, ch[1] - STONE_GROUND);
      return { what: what, rx: rx, at: at, c: [ch[0] + 8 + low * 1.3, glass ? 191 : 190], k: 1, rot: 0 };
    }
    // (the forward-most forepaw on the ground: a paw up on a tree or a railing holds nothing)
    var fp = null;
    (P.near || []).concat(P.far || []).forEach(function (L) { if (L.paw && !L.up && L.paw[1] > 180 && (!fp || L.paw[0] > fp[0])) fp = L.paw; });
    if (!fp) {
      var ups = (P.near || []).concat(P.far || []).filter(function (L) { return L.paw && L.up; });
      if (ups.length && !glass) {
        var ux = 0, uy = 0;
        ups.forEach(function (L) { ux += L.paw[0] / ups.length; uy += L.paw[1] / ups.length; });
        return { what: what, rx: rx, at: at, c: [ux + 1, uy + 6], k: 0.9, rot: -6 };
      }
      fp = [apply(hm, [tx, 30])[0], 192];
    }
    return { what: what, rx: rx, at: at, c: [fp[0] + (glass ? 30 : 21) + (at === 'nose' ? 16 : 0), Math.min(192, fp[1]) - (glass ? 2.4 : 3.4)], k: glass ? 1.4 : 1.15, rot: glass ? 0 : -3 };
  }

  // ------------------------------------------------------------------ a whole cat

  function buildCat(sp, o) {
    o = o || {};
    var pose = POSES[o.pose] ? o.pose : 'sit';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var facing = o.facing === 'left' ? 'left' : 'right', F = facing === 'right' ? 1 : -1;
    // (chapter 5, `reach: true`: crouched at an edge, one forepaw held out and down over it)
    var P = (o.reach === true && REACH[pose]) || POSES[pose], p = sp.pal, R = new Ren();
    var bulk = sp.bulk || 1, lw = Math.sqrt(bulk) * (sp.legW || 1), scared = mood === 'scared';
    var sx = -2.2 * F, sy = -3.6;
    var fl = !!sp.fluffy;
    // chapter 3, `puffed: true`: fur puffed up to twice its size, whatever the face is doing
    var puffed = !!o.puffed;

    function shape(g) {
      if (fl) return scallop(g.pts, 0.66);
      return g.d;
    }
    function grow(c) { var r = c[2] * bulk * (scared ? 1.06 : 1) * (puffed ? 1.24 : 1); return [c[0], c[1] + c[2] - r, r]; }

    // ----- torso
    var hip = grow(P.hip), chest = grow(P.chest);
    var tg = hull2(hip, chest, fl ? 14 : 10);
    var ax = unit([chest[0] - hip[0], chest[1] - hip[1]]);
    if (dist(hip, chest) < 1) ax = [1, 0];
    var spine = P.belly ? [-ax[1], ax[0]] : [ax[1], -ax[0]];
    var tIn = '';
    if (!fl && !P.belly) {
      // a soft rim of light along the back
      tIn += '<path d="M' + pt(add(add(hip, spine, hip[2] - 4.5), ax, 2)) + 'L' + pt(add(add(chest, spine, chest[2] - 4.5), ax, -4)) +
        '" stroke="' + p.light + '" stroke-width="4" stroke-linecap="round" opacity=".5"/>';
    }
    if (P.belly) {
      var bc = lerp2(hip, chest, 0.5);
      tIn += ellipseG(bc[0] - spine[0] * (chest[2] * 0.6), bc[1] - spine[1] * (chest[2] * 0.6), (dist(hip, chest) / 2 + chest[2]) * 0.82, chest[2] * 0.62, deg(ax)).d.replace(/^/, '<path fill="' + (sp.marks.chest || p.light) + '"' + (sp.marks.chest ? markEdge(sp) : '') + ' d="') + '"/>';
    }
    if (sp.pattern === 'tabby') {
      var st = '';
      for (var k = 0; k < 6; k++) {
        var t = -0.42 + k * 0.32, c = lerp2(hip, chest, t), r = lerp(hip[2], chest[2], clamp(t, 0, 1));
        var s0 = add(c, spine, r + 4), e0 = add(add(c, spine, -r * (k % 2 ? 0.05 : 0.38)), ax, 4);
        st += wedge(s0, e0, k % 2 ? 7 : 9, mul2(ax, -5));
      }
      tIn += '<path d="' + st + '" fill="' + p.stripe + '"/>';
    } else if (sp.pattern === 'tortie' || sp.pattern === 'calico') {
      var c1 = add(hip, spine, hip[2] * 0.3), c2 = add(add(chest, spine, chest[2] * 0.2), ax, -chest[2] * 0.2);
      tIn += '<path d="' + blob(c1[0], c1[1], hip[2] * 0.95, 1) + '" fill="' + p.patches[0] + '"/>' +
        '<path d="' + blob(c2[0], c2[1], chest[2] * 0.7, 2) + '" fill="' + p.patches[sp.pattern === 'calico' ? 1 : 0] + '"/>';
      if (sp.pattern === 'tortie') {
        var c3 = lerp2(hip, chest, 0.55);
        tIn += '<path d="' + blob(c3[0] - spine[0] * 6, c3[1] - spine[1] * 6, 9, 4) + '" fill="' + p.patches[1] + '"/>';
      }
    }
    if (sp.marks.back) {
      tIn += '<path d="M' + pt(add(add(hip, spine, hip[2]), ax, -hip[2] * 0.8)) + 'L' + pt(add(add(chest, spine, chest[2]), ax, chest[2] * 0.5)) +
        '" stroke="' + mix(p.base, p.line, 0.6) + '" stroke-width="13" stroke-linecap="round"/>';
    }
    if (sp.marks.chest && !P.belly) {
      var bcen = add(add(chest, ax, chest[2] * 0.5), spine, -chest[2] * 0.4);
      tIn += '<path fill="' + sp.marks.chest + '"' + markEdge(sp) + ' d="' + ellipseG(bcen[0], bcen[1], chest[2] * 0.66, chest[2] * 1.05, deg(ax)).d + '"/>';
    }
    // chapter 6, ReedClan's sleek wet coats (`sheen`): a bright wet streak along the back, two short
    // ones on the flank (no Clan cat and no player's coat has it)
    if (sp.sheen && !P.belly && !fl) {
      var sb0 = add(add(hip, spine, hip[2] - 7.5), ax, 5), sb1 = add(add(chest, spine, chest[2] - 7.5), ax, -3), smid = lerp2(hip, chest, 0.42);
      tIn += '<path class="pc-sheen" d="M' + pt(sb0) + 'L' + pt(sb1) + 'M' + pt(add(add(smid, spine, hip[2] * 0.15), ax, -9)) + 'l' + N(ax[0] * 15) + ',' + N(ax[1] * 15) +
        'M' + pt(add(add(smid, spine, -hip[2] * 0.2), ax, 3)) + 'l' + N(ax[0] * 10) + ',' + N(ax[1] * 10) + '" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".62"/>';
    }
    var torsoD = (scared || puffed) && !fl ? spiky(tg.pts, puffed ? 8 : 4.5) : puffed ? scallop(tg.pts, 0.8) : shape(tg);
    var torso = R.part(torsoD, { fill: p.base, dark: p.shade, line: p.line, sx: sx, sy: sy, inner: tIn });

    // ----- legs, paws, haunches
    function legPart(L, far) {
      var top = [L.leg[0][0], L.leg[0][1], L.leg[0][2] * lw], bot = [L.leg[1][0], L.leg[1][1], L.leg[1][2] * lw];
      var g = hull2(top, bot, 8), inn = '';
      var lax = unit([bot[0] - top[0], bot[1] - top[1]]), ln = [-lax[1], lax[0]];
      if (sp.pattern === 'tabby') {
        var b = '';
        [0.35, 0.6, 0.85].forEach(function (t) {
          var c = lerp2(top, bot, t), r = lerp(top[2], bot[2], t) + 3;
          b += 'M' + pt(add(c, ln, -r)) + 'L' + pt(add(c, ln, r));
        });
        inn += '<path d="' + b + '" stroke="' + p.stripe + '" stroke-width="3.6"/>';
      } else if (sp.pattern === 'tortie' && far) {
        var cc = lerp2(top, bot, 0.4);
        inn += '<path d="' + blob(cc[0], cc[1], top[2] * 1.4, 6) + '" fill="' + p.patches[0] + '"/>';
      } else if (sp.pattern === 'calico' && !far) {
        inn += '<path d="' + blob(top[0], top[1], top[2] * 1.6, 8) + '" fill="' + p.patches[0] + '"/>';
      }
      if (sp.marks.paws) {
        var wc = lerp2(top, bot, 0.92);
        inn += '<path fill="' + markFill(sp) + '"' + markEdge(sp) + ' d="' + ellipseG(wc[0], wc[1], bot[2] * 2.2, dist(top, bot) * 0.3, deg(lax) + 90).d + '"/>';
      }
      // chapter 6: ReedClan's mud to the elbows (`mud: 'elbows'`), Sloshbank's muddy paws (`'paws'`):
      // the leg from a wavy line down, mud brown
      if (sp.mud) {
        var mfr = sp.mud === 'elbows' ? 0.26 : 0.66, mc = lerp2(top, bot, mfr), mw = Math.max(top[2], bot[2]) + 6;
        var ma0 = add(mc, ln, mw), ma1 = add(mc, ln, -mw);
        inn += '<path class="pc-mud" d="M' + pt(ma0) + 'Q' + pt(add(add(mc, ln, mw * 0.5), lax, 3.4)) + ' ' + pt(mc) + 'Q' + pt(add(add(mc, ln, -mw * 0.5), lax, -3.4)) + ' ' + pt(ma1) +
          'L' + pt(add(ma1, lax, 90)) + 'L' + pt(add(ma0, lax, 90)) + 'Z" fill="' + (far ? MUD_C.far : MUD_C.fill) + '"/>' +
          '<path d="M' + pt(add(add(mc, ln, mw * 0.3), lax, 7)) + 'l' + N(lax[0] * 6) + ',' + N(lax[1] * 6) + '" stroke="' + MUD_C.light + '" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>';
      }
      var legFill = sp.darkLegs ? mix(p.base, p.line, far ? 0.34 : 0.24) : far ? p.farFill : p.base;
      return R.part(fl ? scallop(g.pts, 0.6) : g.d, { fill: legFill, dark: far ? p.shade2 : p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, inner: inn });
    }
    function paw(pp, far, up) {
      var col = sp.mud ? (far ? MUD_C.far : MUD_C.fill) : sp.marks.paws ? (far ? mix(markFill(sp), p.line, 0.12) : markFill(sp)) : (far ? p.farFill : p.base);
      var rx = 9.6 * Math.sqrt(lw) * (sp.pawK || 1), ry = 5.8 * Math.sqrt(lw) * (sp.pawK || 1);
      var e = ellipseG(pp[0] + (up ? 0 : 1), pp[1], up ? ry * 1.15 : rx, up ? rx * 0.82 : ry, 0, 6);
      var s = '<path d="' + (fl ? scallop(e.pts, 0.6) : e.d) + '" fill="' + col + '" stroke="' + p.line + '" stroke-width="2.2"/>';
      if (up) {
        s += '<g fill="' + p.earIn + '"><ellipse cx="' + N(pp[0]) + '" cy="' + N(pp[1] + 1.4) + '" rx="3.6" ry="2.8"/><circle cx="' + N(pp[0] - 4) + '" cy="' + N(pp[1] - 3.6) + '" r="1.5"/><circle cx="' + N(pp[0]) + '" cy="' + N(pp[1] - 4.6) + '" r="1.5"/><circle cx="' + N(pp[0] + 4) + '" cy="' + N(pp[1] - 3.6) + '" r="1.5"/></g>';
      } else if (!far && !fl) {
        s += '<path d="M' + N(pp[0] + 3) + ',' + N(pp[1] + 1) + 'v3.4M' + N(pp[0] + 7) + ',' + N(pp[1]) + 'v3.4" stroke="' + p.line + '" stroke-width="1.3" stroke-linecap="round" opacity=".6"/>';
      }
      return s;
    }
    function haunchPart(h) {
      var g = ellipseG(h[0], h[1] + (h[3] * bulk - h[3]) * -0.4, h[2] * Math.sqrt(bulk), h[3] * Math.sqrt(bulk), h[4], 9), inn = '';
      if (sp.pattern === 'tabby') {
        var st = '';
        [-150, -118, -86].forEach(function (a) {
          var r = (a + h[4]) * Math.PI / 180, s0 = [h[0] + Math.cos(r) * h[2] * 1.15, h[1] + Math.sin(r) * h[3] * 1.15];
          st += wedge(s0, lerp2(s0, [h[0], h[1]], 0.75), 7);
        });
        inn += '<path d="' + st + '" fill="' + p.stripe + '"/>';
      } else if (sp.pattern === 'tortie') {
        inn += '<path d="' + blob(h[0] + 4, h[1] - 6, h[3] * 0.7, 11) + '" fill="' + p.patches[1] + '"/>';
      } else if (sp.pattern === 'calico') {
        inn += '<path d="' + blob(h[0] - 6, h[1] - 4, h[3] * 0.9, 12) + '" fill="' + p.patches[1] + '"/>';
      }
      return R.part(fl ? scallop(g.pts, 0.62) : g.d, { fill: p.base, dark: p.shade, line: mix(p.line, p.base, 0.3), lw: 2.1, sx: sx * 0.7, sy: sy * 0.7, inner: inn });
    }
    function limb(L, far) {
      var s = '';
      if (L.thigh) s += haunchPart(L.thigh);
      if (L.leg) s += legPart(L, far);
      if (L.paw) s += paw(L.paw, far, L.up);
      if (L.paw && clawPaws.indexOf(L) >= 0) s += catClaws(L.paw, L.up, far, lw, p, pose === 'situp', L === tuckPaw);
      return s;
    }
    // chapter 3, `claws: true`: claws out on a raised paw (every raised paw), else on the forepaw
    // furthest forward
    // chapter 5, `tuck: true`: claws out, and one of them curled back in: the dewclaw of the raised
    // forepaw nearest us (sitting up: nine claws out, one tucked in)
    var clawPaws = [], tuckPaw = null;
    if (o.claws || o.tuck || (P.claws && o.claws !== false)) {
      (P.near || []).concat(P.far || []).forEach(function (L) { if (L.paw && L.up) clawPaws.push(L); });
      if (!clawPaws.length) {
        var fwd = null;
        (P.near || []).forEach(function (L) { if (L.paw && (!fwd || L.paw[0] > fwd.paw[0])) fwd = L; });
        if (fwd) clawPaws.push(fwd);
      }
      if (o.tuck) (P.near || []).forEach(function (L) { if (L.paw && L.up && !L.far) tuckPaw = L; });
    }

    // ----- tail
    var mode = P.tail;
    if (o.tail && P.tails[o.tail]) mode = o.tail;
    else if (P.moodTail !== false) {
      var mt = scared ? ((pose === 'stand' || pose === 'walk') ? 'up' : null) : MOOD_TAIL[mood];
      if (mt && P.tails[mt]) mode = mt;
    }
    var TP = P.tails[mode];
    // chapter 8, `tailUp: true`: straight up, its tip curled over (in the poses that have it; behind her).
    // She is fitted to her box as she is with her tail down (below), so she is the same size, her head
    // where it was, with her tail up or not (a big cat in a long pose is fitted by its width).
    var tailUp = o.tailUp === true && TAIL_UP[pose] && o.reach !== true;
    if (tailUp) { mode = 'straight'; TP = TAIL_UP[pose]; }
    var w0 = 6.6 * (sp.tailW || 1) * Math.sqrt(bulk), w1 = 4.6 * (sp.tailW || 1) * (mode === 'wrap' ? 0.8 : 1);
    var puff = puffed ? 2.1 : scared ? 1.55 : 1;
    var tw = function (t) {
      var w = lerp(w0, w1, t) * puff;
      if (fl) w *= 1 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15));
      return w;
    };
    var tl = tube(TP, tw, fl ? 11 : 9);
    // a tail never sinks into the ground: lift the free end, keep the base attached
    var lowT = Math.max.apply(null, tl.pts.map(function (q) { return q[1]; })) + (fl ? 3 : 1.2) + (scared || puffed ? 3.6 : 0);
    if (lowT > 197.5) {
      var dl = lowT - 197.5;
      TP = [TP[0], [TP[1][0], TP[1][1] - dl * 0.7], [TP[2][0], TP[2][1] - dl], [TP[3][0], TP[3][1] - dl]];
      tl = tube(TP, tw, fl ? 11 : 9);
    }
    var tIn2 = '';
    if (sp.pattern === 'tabby') {
      var rings = '';
      [0.22, 0.42, 0.62, 0.8].forEach(function (t) {
        var a = tl.at(t), r = a.w * 1.5;
        rings += 'M' + pt(add(a.p, a.n, r)) + 'L' + pt(add(a.p, a.n, -r));
      });
      var tip = tl.at(1);
      tIn2 += '<path d="' + rings + '" stroke="' + p.stripe + '" stroke-width="4.4"/><circle cx="' + N(tip.p[0]) + '" cy="' + N(tip.p[1]) + '" r="' + N(tip.w * 2.1) + '" fill="' + p.stripe + '"/>';
    } else if (sp.pattern === 'tortie' || sp.pattern === 'calico') {
      var bands = '';
      [[0.3, 0], [0.75, sp.pattern === 'calico' ? 1 : 0]].forEach(function (b) {
        var a = tl.at(b[0]);
        bands += '<circle cx="' + N(a.p[0]) + '" cy="' + N(a.p[1]) + '" r="' + N(a.w * 2.2) + '" fill="' + p.patches[b[1]] + '"/>';
      });
      tIn2 += bands;
    }
    if (sp.marks.back) {
      var cl = [];
      for (var q = 0; q <= 6; q++) cl.push(tl.at(q / 6).p);
      tIn2 += '<path d="M' + pt(cl[0]) + cr(cl) + '" stroke="' + mix(p.base, p.line, 0.6) + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    }
    var tailD = (scared || puffed) && !fl ? spiky(tl.pts, puffed ? 6 : 3.6) : (fl ? scallop(tl.pts, 0.66) : tl.d);
    var tailSvg = R.part(tailD, { fill: p.base, dark: p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, inner: tIn2 });
    var tailFront = !!(P.front && P.front[mode]);

    // ----- head placement
    var hrot = P.head[2] + (HEAD_ROT[mood] || 0) * (pose === 'curl' || pose === 'flat' ? 0.5 : 1) + (sp.rot || 0);
    // a slim cat's chest is smaller and sits lower (grow keeps its bottom); a head resting on top of
    // the chest comes down with it, or the head floats with a gap under the chin (fountain-close's
    // sit; the skinny grey tom lying asleep in the storm, f077). Not where the head rests on the
    // ground beside the chest (curl, flat, crouch, fall): there it is already attached.
    var neckDrop = NECK_FOLLOWS[pose] ? Math.max(0, (chest[1] - chest[2]) - (P.chest[1] - P.chest[2])) : 0;
    var hpos = [P.head[0] + (mood === 'sniff' ? 5 : 0), P.head[1] + neckDrop + (mood === 'sniff' ? 2 : mood === 'proud' || mood === 'solemn' ? -2 : 0)];
    var hsc = sp.headS || 1;
    var hm = mul(mT(hpos[0], hpos[1]), mul(mR(hrot), mS(hsc)));
    // opts.flatEars: ears laid flat with any mood ("The grizzled old tom flattens his ears at you"),
    // as the Counts picture lays the old tom's ears flat once they are counted
    var oEar = (o.earBias || 0) + (o.flatEars ? FLAT_EARS : 0);
    // ----- a held prop (opts.holds: 'stone', Riffle's lucky stone), placed before the head is drawn
    var hold = holdPlace(o, pose, P, hm, sp);
    var hctx = { F: F, sx: sx, earBias: (P.earBias || 0) + oEar, look: [(mood === 'kind' ? 0.4 : mood === 'shy' ? 0 : 1.4) + (P.look ? P.look[0] : 0), P.look ? P.look[1] : 0] };
    // chapter 3's face extras: moss over the ears, eyes squeezed shut, a misty tear, a cloud of breath
    if (puffed) hctx.puffed = true;
    if (o.moss) hctx.moss = true;
    if (o.squeeze) hctx.squeeze = true;
    if (o.tear) hctx.tear = true;
    if (o.mist) hctx.mist = true;
    if (o.wink) hctx.wink = true;
    // chapter 5's: asleep (eyes shut, whatever the mood), a snail on one ear (`'in'`: its horns
    // pulled in), buzzing whiskers, a dragonfly on the nose, and the nose to tap, marked for the page
    // (`tap: 'nose'`; or, no `tap` given, the sleeper with a snail on his ear, as the first screen draws him)
    if (o.asleep) hctx.asleep = o.asleep === 'half' ? 'half' : true;
    if (o.snail) hctx.snail = o.snail === 'in' ? 'in' : true;
    if (o.buzz) hctx.buzz = true;
    if (o.dragonfly) hctx.dragonfly = true;
    if (o.tap === 'nose' || o.tap === true || (o.tap == null && o.asleep && o.snail && o.snail !== 'in')) hctx.tap = true;
    if (hold && (hold.what === 'vole' || hold.what === 'pinecone' || hold.what === 'leaf') && hold.at === 'mouth') hctx.mouthFull = true;
    // chapter 6, ReedClan's wet sheen on the head too
    if (sp.sheen) hctx.sheen = true;
    if (P.openEyes) hctx.openEyes = true;
    var head = '<g transform="' + mStr(hm) + '">' + headSvg(R, sp, mood, hctx) + (hold && hold.at === 'mouth' ? heldSvg(R, hold, sx) : '') + '</g>';

    // ----- chapter 6, Sloshbank's wet belly (`wet`): the fur along it clumped in wet points, a few
    // drops falling off it, and one on the ground under him, whatever the pose
    var wetSvg = '', wetClumps = '', puddle = '', wetPts = [];
    if (sp.wet) {
      if (!P.belly) {
        var clumps = '';
        [0.14, 0.3, 0.46, 0.62, 0.78, 0.94].forEach(function (t, i) {
          var c = lerp2(hip, chest, t), r = lerp(hip[2], chest[2], clamp(t, 0, 1)), q = add(c, spine, -r * 0.95);
          clumps += wedge(add(q, spine, 3), add(add(q, spine, -(i % 2 ? 6 : 8.4)), ax, -1.6), 7.6);
          wetPts.push(add(q, spine, -8.4));
        });
        wetClumps = '<path class="pc-wet" d="' + clumps + '" fill="' + p.shade + '" stroke="' + p.line + '" stroke-width="1.4" stroke-linejoin="round"/>';
        [[0.52, 14], [0.86, 29], [0.3, 40]].forEach(function (d) {
          var c = lerp2(hip, chest, d[0]), r = lerp(hip[2], chest[2], d[0]), q = add(c, spine, -r - d[1]);
          if (q[1] < 186) { wetSvg += dropSvg(q[0], q[1], 1.1); wetPts.push([q[0] - 4, q[1] - 7], [q[0] + 4, q[1] + 6]); }
        });
        // lying low, his belly near the ground: the one about to land
        if (wetSvg.indexOf('pc-drop') < 0) { var lq = lerp2(hip, chest, 0.66); wetSvg += dropSvg(lq[0] + 12, 186, 1.1); }
      } else {
        var bq = lerp2(hip, chest, 0.5);
        wetSvg += dropSvg(bq[0] + 26, Math.min(186, bq[1] + 4), 1.1);
      }
      var gq = lerp2(hip, chest, 0.66);
      puddle = puddleSvg(gq[0], 195.6, 1);
      wetPts.push([gq[0] - 11, 189], [gq[0] + 11, 197]);
    }

    // ----- assemble back to front
    var body = '';
    if (!tailFront) body += tailSvg;
    (P.far || []).forEach(function (L) { body += limb(L, true); });
    body += torso + puddle;
    if (P.haunch) body += haunchPart(P.haunch);
    body += wetClumps;
    (P.backPaws || []).forEach(function (pp) { body += paw(pp, false); });
    (P.near || []).forEach(function (L) { if (!L.afterHead) body += limb(L, !!L.far); });
    if (tailFront) body += tailSvg;
    body += wetSvg;
    // under the chin, the chin rests on it; at the paws or by the nose it lies in front of everything
    if (hold && hold.at === 'chin') body += heldSvg(R, hold, sx);
    body += head;
    (P.near || []).forEach(function (L) { if (L.afterHead) body += limb(L, false); });
    if (hold && (hold.at === 'paws' || hold.at === 'nose')) body += heldSvg(R, hold, sx);
    // chapter 5, `buzz: true` (the Roar: "The logs buzz. Your teeth buzz. Even your whiskers buzz."):
    // short zigzags hugging her outline, each lying along it, never streaming off it: she is
    // shaking, and nothing blows
    var buzzPts = [];
    if (o.buzz) {
      var bz = '', ring = [];
      // round the head: either cheek, over each ear; along the back, the chest, and the tail
      [[-52, 2, 90], [54, 2, 90], [-30, -44, 30], [32, -44, -30], [0, 40, 0]].forEach(function (q) { ring.push([apply(hm, [q[0], q[1]]), q[2] + hrot]); });
      var bmid = lerp2(hip, chest, 0.5), brad = lerp(hip[2], chest[2], 0.5);
      ring.push([add(bmid, spine, brad + 9), deg(ax)], [add(add(hip, ax, -hip[2] - 9), spine, 2), deg(ax) + 90], [add(add(chest, ax, chest[2] + 9), spine, -4), deg(ax) + 90]);
      var tq = tl.at(0.6);
      ring.push([add(tq.p, tq.n, tq.w + 8), deg(tq.t)]);
      ring.forEach(function (q, qi) {
        var r = q[1] * Math.PI / 180, d = [Math.cos(r), Math.sin(r)], len = qi % 2 ? 9 : 11.5;
        bz += zig(add(q[0], d, -len), add(q[0], d, len), 6, 2.6);
        buzzPts.push(add(q[0], d, -len - 2), add(q[0], d, len + 2));
      });
      body += '<path class="pc-buzz" d="' + bz + '" stroke="' + p.line + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".62"/>';
    }

    // ----- fit: keep the whole cat inside the 200 x 200 box (big cats in long poses shrink a little)
    var pts = tg.pts.concat(tl.pts);
    function addPts(a) { pts = pts.concat(a); }
    if (buzzPts.length) addPts(buzzPts);
    if (wetPts.length) addPts(wetPts);
    (P.far || []).concat(P.near || []).forEach(function (L) {
      if (L.leg) addPts([L.leg[0], L.leg[1]].map(function (c) { return [c[0], c[1]]; }));
      if (L.paw) addPts([[L.paw[0] - 11, L.paw[1] - 7], [L.paw[0] + 12, L.paw[1] + 7]]);
    });
    clawPaws.forEach(function (L) { addPts(L.up ? [[L.paw[0] - 12, L.paw[1] - 17], [L.paw[0] + 12, L.paw[1] - 17]] : [[L.paw[0] + 17, L.paw[1] - 2]]); });
    (P.backPaws || []).forEach(function (pp) { addPts([[pp[0] - 11, pp[1] - 7], [pp[0] + 12, pp[1] + 7]]); });
    var hb = [[-47, -6], [47, -6], [-44, 22], [44, 22], [0, 30], [0, -34]].concat(earTips(sp, mood, (P.earBias || 0) + oEar));
    if (mood === 'sniff') hb.push([66, -4]);
    if (fl) hb.push([-48, 26], [48, 26], [-50, 0], [50, 0], [-30, 43], [30, 43], [0, 47]);
    if (puffed) hb.push([fl ? -61 : -56, 3], [fl ? 61 : 56, 3], [0, fl ? 48 : 43], [0, fl ? -42 : -37]);
    if (o.moss) hb = hb.concat(MOSS_BOX.map(function (q) { return [q[0], q[1] + (fl ? 5 : 0)]; }));
    if (o.tear) hb.push([(fl ? 3 : 4) + (fl ? 17 : 15.5) + 6, (fl ? 1 : -1) + 27]);
    if (o.mist) hb = hb.concat(MIST_BOX.map(function (q) { return [q[0] + (fl ? 3 : 4) + 46, q[1] + (fl ? 12 : 15)]; }));
    addPts(hb.map(function (q) { return apply(hm, q); }));
    // the held stone, in body coordinates (in the mouth it moves with the head)
    var heldC = hold ? (hold.at === 'mouth' ? apply(hm, hold.c) : hold.c) : null, heldR = hold ? hold.rx * hold.k * (hold.at === 'mouth' ? hsc : 1) : 0;
    // (chapter 8: a leaf lies flat, so it is not as tall as it is long)
    var heldRy = hold && HOLD_RY[hold.what] ? HOLD_RY[hold.what] * hold.k * (hold.at === 'mouth' ? hsc : 1) : heldR;
    if (heldC) addPts([[heldC[0] - heldR - 2, heldC[1] - heldRy], [heldC[0] + heldR + 2, heldC[1] + heldRy]]);
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    var mg = 3 + (scared || puffed ? 4.5 : 0) + (puffed ? 3 : 0) + (fl ? 3 : 0), sc = sp.scale || 1;
    // rest the lowest point on the ground line
    var dy = Math.min(0, 198 - (y1 + 1.5 + (scared || puffed ? 2 : 0) + (fl ? 3 : 0)));
    sc = Math.min(sc, 200 / (x1 - x0 + 2 * mg), 197 / (197 - (y0 + dy) + mg));
    var left = 100 + (x0 - mg - 100) * sc, right = 100 + (x1 + mg - 100) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > 200) dx = 200 - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, 200, 0], mul(mT(100 + dx, 197), mul(mS(sc), mT(-100, -197 + dy))));
    if (tailUp) {
      // (chapter 8: placed exactly as with her tail down; the raised tail stays inside the box in every pose that has it)
      var down = {}, dk;
      for (dk in o) down[dk] = o[dk];
      down.tailUp = false; down.tap = null;
      var dm = buildCat(sp, down)._marks;
      M = dm.M; sc = dm.scale;
    }
    var hc = apply(M, apply(hm, [2, -4]));
    // boxes in the 200 x 200 box (after the fit and any mirroring): the head with its ears, ruff and
    // bow, and the whole cat. The scenes use them to frame close-ups and keep props off the face.
    var hbAll = hb.slice();
    if (sp.bow) { var bwx = -F * 24; hbAll.push([bwx - 21, -40], [bwx + 21, -40], [bwx - 21, -15], [bwx + 21, -15]); }
    var headBox = boxOf(hbAll.map(function (q) { return apply(M, apply(hm, q)); }));
    var bounds = boxOf(pts.map(function (q) { return apply(M, q); }));
    // ----- chapter 6, the things to tap, marked for the page (unpainted): the pinecone held, her
    // raised forepaw (else the front paw on the ground: a pat), her two ears
    if (o.tap === 'pinecone' && heldC && hold.what === 'pinecone') body += tapMark('pinecone', heldC[0], heldC[1], heldR + 4);
    if (o.tap === 'paw') {
      var tpaw = null;
      (P.near || []).concat(P.far || []).forEach(function (L) { if (L.paw && L.up && (!tpaw || L.raise)) tpaw = L; });
      if (!tpaw) (P.near || []).concat(P.far || []).forEach(function (L) { if (L.paw && (!tpaw || L.paw[0] > tpaw.paw[0])) tpaw = L; });
      if (tpaw) body += tapMark('paw', tpaw.paw[0], tpaw.paw[1] - (tpaw.up ? 2 : 1), 13 * Math.sqrt(lw) * (sp.pawK || 1));
    }
    if (o.tap === 'ears') body += tapMarks('ears', earMids(sp, mood, (P.earBias || 0) + oEar).map(function (q) { var e = apply(hm, q); return [e[0], e[1], 13 * (sp.earS || 1) * hsc]; }));
    // ----- chapter 8: the leaf she holds (or the glass on it), and her tail's tip (raised with `tailUp`)
    if (o.tap === 'leaf' && heldC && (hold.what === 'leaf' || hold.what === 'glass')) body += tapMark('leaf', heldC[0], heldC[1], heldR + 4);
    if (o.tap === 'tail') { var ttip = tl.at(1), tq = add(ttip.p, ttip.t, -ttip.w * 0.6); body += tapMark('tail', tq[0], tq[1], 14); }
    // ----- chapter 6, the starry cat: a soft glow at her edge, a little see-through, small stars
    // inside her outline (the back, the chest, the haunch, the tail, the brow)
    if (sp.starry) {
      var gid = R.id(), stars = '';
      R.defs += '<radialGradient id="' + gid + '"><stop offset=".55" stop-color="#eef4ff" stop-opacity=".62"/><stop offset=".8" stop-color="#d2e1ff" stop-opacity=".34"/><stop offset="1" stop-color="#c4d6ff" stop-opacity="0"/></radialGradient>';
      var sl = [[hip[0] - hip[2] * 0.3, hip[1] - hip[2] * 0.36, 6.2], [hip[0] + hip[2] * 0.3, hip[1] + hip[2] * 0.16, 4.2], [chest[0] - chest[2] * 0.1, chest[1] - chest[2] * 0.38, 5.4],
        [lerp(hip[0], chest[0], 0.5), lerp(hip[1], chest[1], 0.5) + 2, 3.6], [chest[0] + chest[2] * 0.3, chest[1] + chest[2] * 0.3, 3.2]];
      if (P.haunch) sl.push([P.haunch[0] - 4, P.haunch[1] - 3, 4.8]);
      [[0.42, 3.8], [0.78, 3]].forEach(function (q) { var a = tl.at(q[0]).p; sl.push([a[0], a[1], q[1]]); });
      [[-17, -19, 4.4], [19, -18, 3.4], [2, -26, 2.8]].forEach(function (q) { var a = apply(hm, [q[0], q[1]]); sl.push([a[0], a[1], q[2] * hsc]); });
      sl.forEach(function (q) { stars += starSvg(q[0], q[1], q[2]); });
      body = '<ellipse class="pc-starglow" cx="' + N((x0 + x1) / 2) + '" cy="' + N((y0 + y1) / 2) + '" rx="' + N((x1 - x0) / 2 + 9) + '" ry="' + N((y1 - y0) / 2 + 8) + '" fill="url(#' + gid + ')"/>' +
        '<g class="pc-starry" opacity=".86">' + body + '<g class="pc-stars" fill="#ffffff" stroke="#fff3b8" stroke-width=".8" stroke-linejoin="round">' + stars + '</g></g>';
    }
    var svg = '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>';
    var paws = [];
    (P.far || []).concat(P.near || []).forEach(function (L) { if (L.paw) paws.push(apply(M, L.paw)); });
    (P.backPaws || []).forEach(function (pp) { paws.push(apply(M, pp)); });
    var out = {
      svg: svg, w: 200, h: 200, head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: headBox, bounds: bounds,
      _marks: { M: M, scale: sc, tail: tailD, tailTip: add(tl.at(1).p, tl.at(1).t, tl.at(1).w * 0.6), ears: (oEar ? earMids(sp, mood, (P.earBias || 0) + oEar) : [[-21, -38], [21, -38]]).map(function (q) { return apply(M, apply(hm, q)); }), paws: paws,
        chestTop: apply(M, [chest[0], chest[1] - chest[2]]) }
    };
    // chapter 5, `reach`: where the paw she holds out is, and the line of the edge she crouches on
    (P.near || []).forEach(function (L) {
      if (!L.reach || !L.paw) return;
      var rp = apply(M, L.paw), ed = apply(M, [100, 197]);
      out.reach = { x: Math.round(rp[0] * 10) / 10, y: Math.round(rp[1] * 10) / 10, r: Math.round(9.6 * Math.sqrt(lw) * sc * 10) / 10, edge: Math.round(ed[1] * 10) / 10 };
    });
    if (heldC) {
      // where the stone is, in the 200 x 200 box: for a sparkle on it, or a balloon to point past it
      var hcM = apply(M, heldC);
      out.held = { what: hold.what, at: hold.at, x: Math.round(hcM[0] * 10) / 10, y: Math.round(hcM[1] * 10) / 10, r: Math.round(heldR * sc * 10) / 10 };
    }
    return out;
  }

  // ------------------------------------------------------------------ the Tall One
  // 260 x 620, feet centred at (130, 620). Legs, slippers, a cardigan, a hand, a green
  // watering can. Never a face: her cardigan and arm run on far above the box (to y = -900),
  // so wherever a camera crops her, she simply continues out of the top of the panel.

  function tallOne(o) {
    var pose = OTHER_POSES.tallone.indexOf(o.pose) >= 0 ? o.pose : 'stand';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren();
    var C = { base: '#c6b2e0', shade: '#ab95cd', line: '#7a66a1', rib: '#b6a0d6' };
    var T = { base: '#93b8e3', shade: '#789fd1', line: '#50739e' };
    var S = { base: '#f8aecb', shade: '#ea90b5', line: '#c56b92', tip: '#fdd5e5' };
    var K = { base: '#ecb892', shade: '#d89d76', line: '#a9704d' };
    var G = { base: '#5db36e', shade: '#469356', line: '#2b6a3b', light: '#8ad49a' };
    var s = '';
    function part(d, c, far, inner) { return R.part(d, { fill: far ? c.shade : c.base, dark: far ? mix(c.shade, c.line, 0.25) : c.shade, line: c.line, sx: -3 * F, sy: -4, inner: inner, lw: 2.8 }); }
    function slipper(cx, cy, far) {
      var g = ellipseG(cx, cy, 41, 19, 0, 10);
      return R.part(scallop(g.pts, 0.62), { fill: far ? S.shade : S.base, dark: mix(S.shade, S.line, 0.2), line: S.line, sx: -2 * F, sy: -4, lw: 2.6,
        inner: '<ellipse cx="' + N(cx - 6) + '" cy="' + N(cy - 9) + '" rx="26" ry="7" fill="' + S.tip + '" opacity=".7"/>' }) +
        '<circle cx="' + N(cx + 26) + '" cy="' + N(cy - 8) + '" r="8" fill="' + S.tip + '" stroke="' + S.line + '" stroke-width="2"/>';
    }
    function can(x, y, rot, k) {
      return '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ') scale(' + (k || 1) + ')">' +
        '<path d="M50,24L82,-14L88,-10L60,34Z" fill="' + G.base + '" stroke="' + G.line + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<ellipse cx="86" cy="-13" rx="5" ry="9" transform="rotate(38 86 -13)" fill="' + G.light + '" stroke="' + G.line + '" stroke-width="2.4"/>' +
        '<path d="M8,0Q30,-34 52,0" fill="none" stroke="' + G.line + '" stroke-width="9" stroke-linecap="round"/><path d="M8,0Q30,-34 52,0" fill="none" stroke="' + G.base + '" stroke-width="4.6" stroke-linecap="round"/>' +
        R.part('M0,6Q0,0 8,0L56,0Q64,0 64,6L66,62Q66,70 58,70L6,70Q-2,70 -2,62Z', { fill: G.base, dark: G.shade, line: G.line, sx: -3, sy: -3, lw: 2.6,
          inner: '<rect x="8" y="8" width="8" height="54" rx="4" fill="' + G.light + '" opacity=".8"/><path d="M-4,22H70" stroke="' + G.shade + '" stroke-width="3"/>' }) + '</g>';
    }
    function hand(x, y, rot) {
      return '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')">' +
        R.part('M-18,0Q-22,28 -6,34Q12,38 18,24Q22,10 18,0Z', { fill: K.base, dark: K.shade, line: K.line, sx: -2, sy: -3, lw: 2.4 }) +
        '<path d="M-10,22Q-2,28 8,22M-12,14Q-2,20 10,14" stroke="' + K.line + '" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/></g>';
    }
    function sleeve(d, cuffD) {
      return part(d, C, false, '') + R.part(cuffD, { fill: C.rib, dark: C.shade, line: C.line, lw: 2.4 });
    }
    var rib = '';
    for (var x = 34; x < 214; x += 10) rib += 'M' + x + ',158V200';
    var cardigan = function (bottomY, tilt) {
      return '<g transform="rotate(' + tilt + ' 120 0)">' + part('M28,-900L212,-900L218,' + bottomY + 'Q120,' + (bottomY + 18) + ' 22,' + bottomY + 'Z', C, false,
        '<path d="M20,' + (bottomY - 30) + 'Q120,' + (bottomY - 12) + ' 222,' + (bottomY - 30) + 'L230,' + (bottomY + 30) + 'L10,' + (bottomY + 30) + 'Z" fill="' + C.rib + '"/>' +
        '<path d="' + rib.replace(/158/g, String(bottomY - 26)).replace(/V200/g, 'V' + (bottomY + 20)) + '" stroke="' + C.shade + '" stroke-width="2"/>' +
        '<path d="M108,-900L132,-900L128,' + (bottomY + 10) + 'L112,' + (bottomY + 10) + 'Z" fill="#f4ecdd"/>' +
        '<path d="M50,96L96,96L94,140Q72,148 52,140Z" fill="' + C.shade + '" stroke="' + C.line + '" stroke-width="2"/>' +
        '<g fill="#f5e6c8" stroke="' + C.line + '" stroke-width="1.6"><circle cx="138" cy="34" r="5"/><circle cx="138" cy="84" r="5"/><circle cx="138" cy="134" r="5"/></g>') + '</g>';
    };
    var head;
    if (pose === 'set-dish') {
      // bending down to set a dish of water on the step
      s += can(12, 548, -6);
      s += part('M58,200L116,200Q168,270 184,334Q194,372 172,398L126,574L84,572L130,392Q144,364 130,336Q100,272 58,200Z', T, true, '<path d="M156,340Q168,362 160,382" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += part('M108,200L170,200Q214,276 222,334Q228,374 206,394L168,578L124,576L164,388Q174,360 162,334Q138,272 108,200Z', T, false, '<path d="M196,340Q208,362 200,384" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += cardigan(250, 8);
      s += slipper(100, 598, true) + slipper(152, 600, false);
      s += sleeve('M196,-900L236,-900L236,-10Q254,280 248,532L210,536Q206,280 196,-10Z', 'M208,518L250,514L252,546L208,550Z');
      s += '<ellipse cx="228" cy="604" rx="31" ry="10" fill="#9fd2ea" stroke="#4f8fb3" stroke-width="2.4"/><ellipse cx="228" cy="600" rx="24" ry="5.6" fill="#d6f1fc"/>';
      s += hand(229, 550, 0);
      head = [150, 8];
    } else if (pose === 'water') {
      s += part('M66,170L122,170L118,574L78,574Z', T, true, '<path d="M92,520Q100,540 92,560" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += part('M118,170L178,170L176,576L132,576Z', T, false, '<path d="M150,520Q158,540 150,562" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += cardigan(186, 0);
      s += slipper(98, 598, true) + slipper(158, 600, false);
      s += sleeve('M162,-900L204,-900L214,-10Q230,90 230,172L192,182Q190,90 172,-10Z', 'M190,168L230,160L234,190L194,198Z');
      s += can(176, 206, 28, 0.86);
      s += hand(214, 194, -14);
      var drops = '';
      [[236, 290], [248, 318], [240, 352], [252, 384], [234, 412], [248, 446], [238, 486]].forEach(function (d) {
        drops += '<path d="M' + d[0] + ',' + d[1] + 'q4,7 0,10q-4,-3 0,-10Z"/>';
      });
      s += '<g fill="#9fd6f7" stroke="#4f97c4" stroke-width="1.2">' + drops + '</g>';
      head = [130, 8];
    } else {
      s += part('M66,170L122,170L118,574L78,574Z', T, true, '<path d="M92,520Q100,540 92,560" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += part('M118,170L178,170L176,576L132,576Z', T, false, '<path d="M150,520Q158,540 150,562" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += cardigan(186, 0);
      s += slipper(98, 598, true) + slipper(158, 600, false);
      s += sleeve('M174,-900L214,-900L214,-10Q222,140 218,256L182,262Q176,140 174,-10Z', 'M180,244L220,240L222,270L180,274Z');
      s += can(168, 304, 0);
      s += hand(200, 280, 0);
      head = [130, 8];
    }
    var M = F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, 260, 0];
    var hc = apply(M, head);
    return { svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + s + '</g>', w: 260, h: 620, head: { x: hc[0], y: hc[1] } };
  }

  // ------------------------------------------------------------------ sparrow and moth

  function sparrow(o) {
    var fluffed = o.pose === 'fluffed', F = o.facing === 'left' ? -1 : 1, R = new Ren();
    var c = { body: '#b07c4e', dark: '#7d5531', belly: '#efe0c4', cap: '#8a7466', line: '#5e3f24', cheek: '#f5ead6' };
    var s = '';
    if (fluffed) {
      s += '<path d="M10,26L1,22L3,30L11,31Z" fill="' + c.dark + '" stroke="' + c.line + '" stroke-width="1.2" stroke-linejoin="round"/>';
      var g = ellipseG(22, 25, 16, 14, 0, 5);
      s += R.part(scallop(g.pts, 0.6), { fill: c.body, dark: c.dark, line: c.line, lw: 1.3, sx: -1.2 * F, sy: -1.6,
        inner: '<ellipse cx="25" cy="31" rx="12" ry="8" fill="' + c.belly + '"/><path d="M8,26Q18,20 26,27Q18,34 9,31Z" fill="' + c.dark + '"/><path d="M12,26L20,27M12,29L19,30" stroke="' + c.belly + '" stroke-width="1" opacity=".8"/>' +
          '<path d="M14,13Q24,4 34,13Q26,12 14,13Z" fill="' + c.cap + '"/><ellipse cx="31" cy="20" rx="5" ry="3.4" fill="' + c.cheek + '"/>' });
      s += '<path d="M28.6,16.4Q30.6,18.4 32.8,16.4" stroke="#221b26" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
      s += '<path d="M36,17.6L40.4,19L36,20.8Z" fill="#d8993f" stroke="' + c.line + '" stroke-width=".9" stroke-linejoin="round"/>';
      s += '<path d="M33.5,22.5Q35.5,25 34,27" stroke="#3a2a22" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    } else {
      s += '<path d="M13,26L1,17L3,27L12,31Z" fill="' + c.dark + '" stroke="' + c.line + '" stroke-width="1.2" stroke-linejoin="round"/>';
      s += '<path d="M18,33L17,39M17,39L14,40M17,39L19,40M24,33L25,39M25,39L22,40M25,39L27,40" stroke="#9b6a43" stroke-width="1.3" stroke-linecap="round" fill="none"/>';
      s += R.part(ellipseG(21, 25, 12.5, 10, -8, 6).d, { fill: c.body, dark: c.dark, line: c.line, lw: 1.3, sx: -1 * F, sy: -1.4,
        inner: '<ellipse cx="24" cy="30" rx="9" ry="6.4" fill="' + c.belly + '"/><path d="M9,23Q19,16 28,24Q19,32 9,28Z" fill="' + c.dark + '"/><path d="M13,23L21,24.6M12,26L20,27.4" stroke="' + c.belly + '" stroke-width="1" opacity=".8"/>' });
      s += R.part(ellipseG(30, 14.5, 8.4, 8, 0, 5).d, { fill: c.body, dark: c.dark, line: c.line, lw: 1.3, sx: -1 * F, sy: -1.2,
        inner: '<path d="M21,12Q29,3 38,11Q30,9.6 21,12Z" fill="' + c.cap + '"/><ellipse cx="30.6" cy="17.4" rx="4.6" ry="3.2" fill="' + c.cheek + '"/><path d="M34,19Q36,22 34,23.6" stroke="#3a2a22" stroke-width="2.4" fill="none"/>' });
      s += '<circle cx="33.4" cy="12.6" r="1.9" fill="#221b26"/><circle cx="32.8" cy="11.9" r=".7" fill="#fff"/>';
      s += '<path d="M37.6,13.2L43,15L37.6,17Z" fill="#d8993f" stroke="' + c.line + '" stroke-width=".9" stroke-linejoin="round"/>';
    }
    var M = F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, 44, 0];
    var hc = apply(M, fluffed ? [29, 17] : [30, 14]);
    return { svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + s + '</g>', w: 44, h: 40, head: { x: hc[0], y: hc[1] } };
  }

  function moth(o) {
    var F = o.facing === 'left' ? -1 : 1;
    var c = { wing: '#f3ead6', shade: '#e0cfac', spot: '#c7ae84', line: '#a38a62', body: '#b99c72' };
    var s = '<circle cx="20" cy="18" r="17" fill="#fff4c6" opacity=".38"/>' +
      '<g stroke="' + c.line + '" stroke-width="1.1" stroke-linejoin="round">' +
      '<path d="M19,19Q6,30 7,33Q14,34 20,22Z" fill="' + c.shade + '"/><path d="M21,19Q32,28 33,32Q26,34 20,22Z" fill="' + c.shade + '"/>' +
      '<path d="M19,17Q8,2 2,7Q-1,18 19,21Z" fill="' + c.wing + '"/><path d="M21,17Q31,1 38,5Q41,17 21,21Z" fill="' + c.wing + '"/></g>' +
      '<g fill="' + c.spot + '"><circle cx="9" cy="11" r="2.4"/><circle cx="31" cy="9.6" r="2.4"/><circle cx="13" cy="28" r="1.4"/><circle cx="27" cy="27" r="1.4"/></g>' +
      '<ellipse cx="20" cy="20" rx="2.8" ry="8" fill="' + c.body + '" stroke="' + c.line + '" stroke-width="1.1"/>' +
      '<path d="M19,12.6Q15,6 12,4M21,12.6Q25,6 28,4" stroke="' + c.line + '" stroke-width="1" fill="none" stroke-linecap="round"/>' +
      '<path d="M13,6l-1.5,-1M14,7.6l-1.6,-.6M27,6l1.5,-1M26,7.6l1.6,-.6" stroke="' + c.line + '" stroke-width=".8"/>' +
      '<circle cx="20" cy="12.6" r="2.3" fill="' + c.body + '" stroke="' + c.line + '" stroke-width="1"/>';
    var M = F === 1 ? mul(mT(20, 18), mul(mR(8), mT(-20, -18))) : mul([-1, 0, 0, 1, 40, 0], mul(mT(20, 18), mul(mR(8), mT(-20, -18))));
    var hc = apply(M, [20, 13]);
    return { svg: '<g transform="' + mStr(M) + '">' + s + '</g>', w: 40, h: 36, head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 } };
  }

  // ------------------------------------------------------------------ otters and dogs (chapter 2)
  // Drawn like the cats: flat papercut parts and a frontal face on a side-on body, facing right and
  // mirrored for facing left. Each pose is laid out in the species' own units with the ground (or,
  // swimming and floating, the waterline) at y = 0 and the feet centred on x = 0; the preset gives
  // the scale, the head size and the box. Nothing is drawn below a waterline. Riffle is a pup: a
  // big head, big eyes, a short body. The dogs are big-hearted and dim, never menacing: no teeth.

  // chapter 3 appends 'dive' (a head-first leap into the river, SPLOOSH) and 'hush' (a paw over his mouth)
  // chapter 5 appends 'whistle' (whistling, eyes fixed on the sky) and 'groan' (eyes rolled up: Coil's
  // name), the two the text's Build notes name, and 'flip' (a somersault), 'hop' (hopping on the
  // spot), 'point' (pointing straight down), 'fall' (falling over backwards) and 'slap' (a tail
  // slapped down: the ferry otters' applause)
  // chapter 6 appends 'puff' (cheeks puffed round, holding his breath, eyes wide: "All the way out")
  var OTTER_POSES = ['stand', 'sit', 'scramble', 'swim', 'float', 'juggle', 'slide', 'hug', 'sun', 'dive', 'hush',
    'whistle', 'groan', 'flip', 'hop', 'point', 'fall', 'slap', 'puff'];
  // chapter 8 appends 'lie' (lying down, head on forepaws: the heap of dogs asleep by the fence)
  var DOG_POSES = ['stand', 'jump', 'sit', 'bounce', 'howl', 'lie'];
  OTHER_POSES.riffle = OTTER_POSES; OTHER_POSES.otter = OTTER_POSES; OTHER_POSES.dog = DOG_POSES;
  var OTTER_HEAD = [[0, -25], [-19, -23.5], [-30, -15], [-33.5, -1], [-29.5, 12.5], [-18, 21.5], [0, 25], [18, 21.5], [29.5, 12.5], [33.5, -1], [30, -15], [19, -23.5]];
  var DOG_HEAD = [[0, -30], [-21, -27.5], [-31, -15], [-33, 1], [-28, 17], [-15, 26], [0, 28.5], [15, 26], [28, 17], [33, 1], [31, -15], [21, -27.5]];
  var BEAST_INK = '#2a1c18';
  var TONGUE = '#f28a9c';

  var BEASTS = {
    riffle: { kind: 'otter', pup: true, scale: 0.69, headS: 1.34, eyeS: 1.24, bulk: 0.9, legW: 0.95, tailL: 0.86, box: [250, 250],
      whiskers: 'long', pal: { base: '#8c5a36', line: '#3b2415', light: '#bd875a', belly: '#f5e2c0', muzzle: '#f5e2c0', nose: '#2e1c15', earIn: '#c9906b', whisk: '#fbf3e4' } },
    otter: [
      // the old ferry otter: grey muzzle, white brows, long white whiskers that trail in the water
      { kind: 'otter', old: true, scale: 1, headS: 1.12, eyeS: 0.92, bulk: 1.08, legW: 1.05, box: [330, 330], whiskers: 'trail', brows: true,
        pal: { base: '#75604c', line: '#32271e', light: '#9d8670', belly: '#ddd5c8', muzzle: '#d3ccc1', nose: '#2b2320', earIn: '#a98a78', whisk: '#ffffff', brow: '#f6f3ec' } },
      { kind: 'otter', scale: 0.96, headS: 1.1, bulk: 1, box: [330, 330], whiskers: 'short',
        pal: { base: '#5c3b28', line: '#26160d', light: '#83593f', belly: '#ead4b2', muzzle: '#ead4b2', nose: '#21140f', earIn: '#a87660', whisk: '#f3e6d0' } },
      { kind: 'otter', scale: 0.92, headS: 1.12, bulk: 0.96, box: [330, 330], whiskers: 'short',
        pal: { base: '#a8784b', line: '#4a2f18', light: '#cf9f70', belly: '#f7e8cb', muzzle: '#f7e8cb', nose: '#2e1c15', earIn: '#d39a7c', whisk: '#fff8ea' } }
    ],
    dog: [
      // huge and shaggy: a sheepdog mop, a fringe over his eyes, a sky-blue bandana
      { kind: 'dog', shaggy: true, scale: 2.05, headS: 0.98, eyeS: 1, bulk: 1.22, legW: 1.4, box: [470, 470], ears: 'shaggy', fringe: true,
        bandana: '#62b6e4', goofy: true,
        pal: { base: '#f4f0e7', line: '#777b84', saddle: '#a9aeb7', muzzle: '#fdfbf6', nose: '#2b2427', earFill: '#a9aeb7', light: '#ffffff' } },
      // spotty: white with black spots, black ears, a red collar
      { kind: 'dog', spots: true, scale: 1.42, headS: 1, eyeS: 1, bulk: 1, legW: 1, box: [330, 330], ears: 'floppy', collar: '#e0503f',
        pal: { base: '#fbfaf5', line: '#57525c', spot: '#2f2b31', muzzle: '#ffffff', nose: '#2b2427', earFill: '#2f2b31', light: '#ffffff', shade: '#e2dfdb' } },
      // tiny and mostly bark: big ears, big eyes, a big voice, a blue collar
      { kind: 'dog', tiny: true, scale: 0.5, headS: 1.52, eyeS: 1.18, bulk: 0.92, legW: 0.74, box: [160, 160], ears: 'pointy', collar: '#4f8fd6',
        pal: { base: '#dda067', line: '#7c4c22', light: '#f0c08c', belly: '#f8e6c9', muzzle: '#f8e6c9', nose: '#2b2427', earIn: '#f4a5b4' } }
    ]
  };

  function beastPal(src) {
    var f = {}, k;
    for (k in src) f[k] = src[k];
    f.shade = f.shade || mix(f.base, f.line, 0.2);
    f.shade2 = mix(f.base, f.line, 0.34);
    f.farFill = mix(f.base, f.line, 0.13);
    f.light = f.light || mix(f.base, '#ffffff', 0.3);
    f.belly = f.belly || f.base;
    f.muzzle = f.muzzle || f.belly;
    f.whisk = f.whisk || mix(f.line, f.base, 0.3);
    f.earIn = f.earIn || '#f4a5b4';
    f.feat = mix(f.line, '#000', 0.25);
    return f;
  }
  function beastSpec(who, o) {
    var src = who === 'riffle' ? BEASTS.riffle : BEASTS[who][clamp(intOr(o.variant, 1), 1, 3) - 1];
    var sp = {}, k;
    for (k in src) sp[k] = src[k];
    sp.who = who;
    sp.pal = beastPal(src.pal);
    sp.headS = sp.headS || 1; sp.eyeS = sp.eyeS || 1; sp.bulk = sp.bulk || 1; sp.legW = sp.legW || 1;
    return sp;
  }

  // A tube with round caps at both ends: an otter's long body.
  function capsule(P, wf, n) {
    n = n || 12;
    var L = [], Rr = [], C = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, q = bez(P, t), tg = unit(bezD(P, clamp(t, 0.001, 0.999))), nn = [-tg[1], tg[0]], w = wf(t);
      L.push(add(q, nn, w)); Rr.push(add(q, nn, -w)); C.push({ p: q, n: nn, t: tg, w: w });
    }
    var w0 = C[0].w, w1 = C[n].w;
    var d = 'M' + pt(L[0]) + cr(L) + 'A' + N(w1) + ' ' + N(w1) + ' 0 0 0 ' + pt(Rr[n]) + cr(Rr.slice().reverse()) + 'A' + N(w0) + ' ' + N(w0) + ' 0 0 0 ' + pt(L[0]) + 'Z';
    var pts = L.concat([add(C[n].p, C[n].t, w1)], Rr.slice().reverse(), [add(C[0].p, C[0].t, -w0)]);
    return { d: d, pts: pts, at: function (t) {
      var q = bez(P, t), tg = unit(bezD(P, clamp(t, 0.001, 0.999)));
      return { p: q, n: [-tg[1], tg[0]], t: tg, w: wf(t) };
    } };
  }
  function ss(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  // width along an otter's body: the rump, the widest point at tm, the neck
  function bodyW(w, tm) { return function (t) { return t < tm ? lerp(w[0], w[1], ss(t / tm)) : lerp(w[1], w[2], ss((t - tm) / (1 - tm))); }; }
  // where the head's centre goes when a bigger head sits on the same neck
  function headAt(sp, x, y, rot) {
    var up = (sp.headS - 1) * (sp.kind === 'dog' ? 26 : 23), r = (rot || 0) * Math.PI / 180;
    return [x + Math.sin(r) * up, y - Math.cos(r) * up, rot || 0];
  }
  function rotP(v, deg) { var r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; }

  // Riffle's pebbles: a rusty red, tan and chalk white among the greys, so none of his reads as
  // Sprinkle's plain grey one (#868f90) beside it (chapter 3's "other colors again"); `col` overrides
  function pebble(x, y, r, seed, lk, col) {
    var cols = ['#8f8a85', '#b4583c', '#b8a585', '#e6dfcf', '#a49a91'], c = col || cols[Math.floor(rand(seed) * cols.length)];
    var e = ellipseG(x, y, r * (1.12 + rand(seed + 1) * 0.2), r * (0.86 + rand(seed + 2) * 0.12), (rand(seed + 3) - 0.5) * 50, 4);
    return '<path class="pc-pebble" d="' + e.d + '" fill="' + c + '" stroke="' + mix(c, '#000', 0.5) + '" stroke-width="' + N(1.8 * lk) + '"/>' +
      '<ellipse cx="' + N(x - r * 0.35) + '" cy="' + N(y - r * 0.35) + '" rx="' + N(r * 0.38) + '" ry="' + N(r * 0.22) + '" transform="rotate(-30 ' + N(x - r * 0.35) + ' ' + N(y - r * 0.35) + ')" fill="#fff" opacity=".55"/>';
  }

  // ----- the otter poses (adult units: an adult otter sits about 190 tall)
  function oArm(top, end, r0, r1, kind) { return { leg: [[top[0], top[1], r0], [end[0], end[1], r1]], paw: end, pk: kind || 'hand' }; }
  var OTTER_POSE = {
    sit: function (sp, mood) {
      // a round, comfortable sit, leaning back a little on the tail
      var h = headAt(sp, 22, -150, 0), P = {
        body: { P: [[-18, -35], [-27, -74], [-8, -108], [12, -128]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-42, -16], [-70, -5], [-94, -3], [-112, -9]], w: [19, 4.2] },
        far: [{ paw: [4, -5], pk: 'foot' }, oArm([22, -102], [40, -80], 7.5, 5.5)],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [20, -6], pk: 'foot' }, oArm([13, -104], [33, -74], 9, 7)],
        head: h
      };
      otterGesture(P, sp, mood, h, [13, -104]);
      return P;
    },
    stand: function (sp, mood, o) {
      // chapter 5, `holds: 'pole'`: poling. The long pole slants up past his shoulder, behind his
      // head, both forepaws round it, its foot out over the edge of the raft
      if (o && o.holds === 'pole') {
        return {
          body: { P: [[-4, -44], [-8, -100], [2, -158], [10, -190]], w: [33, 35, 18], tm: 0.25 },
          tail: { P: [[-26, -26], [-54, -10], [-76, -4], [-98, -9]], w: [19, 4.2] },
          far: [{ leg: [[0, -30, 10], [4, -10, 8]], paw: [6, -5], pk: 'foot' }],
          near: [{ thigh: [6, -38, 22, 27, -16], leg: [[10, -28, 11], [16, -10, 8]], paw: [20, -6], pk: 'foot' },
            { leg: [[22, -150, 7.5], [47, -117, 5.5]], paw: [48, -114], pk: 'hand', far: true },
            { leg: [[14, -164, 9], [40, -152, 7]], paw: [42, -150], pk: 'hand' }],
          head: headAt(sp, 16, -212, 4), pole: { a: [64, 14], b: [4, -430], grip: [42, -150] }
        };
      }
      var h = headAt(sp, 12, -214, 0), P = {
        body: { P: [[-4, -44], [-10, -100], [-2, -160], [6, -192]], w: [33, 35, 18], tm: 0.25 },
        tail: { P: [[-26, -26], [-54, -10], [-76, -4], [-98, -9]], w: [19, 4.2] },
        far: [{ leg: [[0, -30, 10], [4, -10, 8]], paw: [6, -5], pk: 'foot' }, oArm([20, -164], [36, -142], 7.5, 5.5)],
        near: [{ thigh: [6, -38, 22, 27, -16], leg: [[10, -28, 11], [16, -10, 8]], paw: [20, -6], pk: 'foot' }, oArm([12, -166], [32, -138], 9, 7)],
        head: h
      };
      otterGesture(P, sp, mood, h, [12, -168]);
      return P;
    },
    juggle: function (sp, mood, o) {
      var h = headAt(sp, 12, -214, 0), hs = sp.headS;
      var nr = [h[0] + 34 * hs + 10, h[1] - 22 * hs], fr = [h[0] - 34 * hs - 8, h[1] - 24 * hs];
      // three pebbles in the air (chapter 2's), or, as a cast extra, `pebbles: 4` (four on the arc)
      // and `pebbles: 5` (four on the arc and the fifth, plain round brown, in his near paw)
      var n = o && (o.pebbles === 4 || o.pebbles === 5) ? o.pebbles : 3;
      var a = [fr[0] + 4, h[1] - 66 * hs], top = [h[0] + 4, h[1] - 88 * hs], c = [nr[0] - 6, h[1] - 64 * hs];
      var pts = [a, top], pebs = [[a[0], a[1], 9], [top[0], top[1], 9.5], [c[0], c[1], 8.5]];
      if (n >= 4) {
        // the fourth, between the top of the arc and the near paw, a mossy green of its own (listed
        // last, so the other three keep chapter 2's colours)
        var d = [lerp(top[0], c[0], 0.55) + 6 * hs, lerp(top[1], c[1], 0.55) - 12 * hs];
        pts.push(d); pebs.push([d[0], d[1], 8.5, '#7f9a5a']);
      }
      pts.push(c);
      var arcs = [[fr, a]];
      for (var i = 1; i < pts.length; i++) arcs.push([pts[i - 1], pts[i]]);
      var P = {
        body: { P: [[-4, -44], [-10, -100], [-2, -160], [6, -192]], w: [33, 35, 18], tm: 0.25 },
        tail: { P: [[-26, -26], [-54, -10], [-76, -4], [-98, -9]], w: [19, 4.2] },
        far: [{ leg: [[0, -30, 10], [4, -10, 8]], paw: [6, -5], pk: 'foot' }, oArm([-2, -176], fr, 8, 6)],
        near: [{ thigh: [6, -38, 22, 27, -16], leg: [[10, -28, 11], [16, -10, 8]], paw: [20, -6], pk: 'foot' }, oArm([16, -176], nr, 9, 7)],
        head: h, pebbles: pebs, arcs: arcs
      };
      if (n === 5) P.fifth = [nr[0] + 2, nr[1] - 14, 10.5];
      return P;
    },
    scramble: function (sp) {
      return {
        body: { P: [[-58, -58], [-36, -94], [16, -98], [42, -76]], w: [30, 34, 20], tm: 0.35 },
        tail: { P: [[-82, -62], [-110, -64], [-128, -78], [-146, -92]], w: [18, 4.2] },
        far: [{ leg: [[-64, -52, 12], [-94, -20, 7]], paw: [-99, -12], pk: 'foot', rot: 24 }, { leg: [[34, -68, 9], [62, -32, 6]], paw: [66, -27], pk: 'hand' }],
        near: [{ thigh: [-54, -60, 23, 20, 32], leg: [[-56, -48, 12], [-80, -12, 8]], paw: [-84, -7], pk: 'foot', rot: 12 }, { leg: [[42, -66, 10], [70, -18, 7]], paw: [74, -11], pk: 'hand' }],
        head: headAt(sp, 66, -96, 4)
      };
    },
    swim: function (sp, mood) {
      var h = headAt(sp, 54, -34, 0), P = {
        water: 0,
        body: { P: [[-96, 14], [-60, 4], [0, 2], [34, 4]], w: [24, 30, 20], tm: 0.5 },
        tail: { P: [[-108, 8], [-130, -8], [-148, -12], [-162, -4]], w: [14, 4] },
        far: [], near: [], head: h,
        ripples: [[h[0], 34], [-26, 70], [-150, 26]]
      };
      if (/^(happy|laugh|shout)$/.test(mood)) P.near.push({ leg: [[h[0] + 26 * sp.headS, 6, 8], [h[0] + 44 * sp.headS, -40, 6]], paw: [h[0] + 46 * sp.headS, -46], pk: 'hand', afterHead: true, wave: true });
      return P;
    },
    float: function (sp, mood) {
      var h = headAt(sp, 58, -26, 28), P = {
        water: 0,
        body: { P: [[-84, 4], [-50, -8], [10, -8], [44, -2]], w: [26, 30, 20], tm: 0.45, bellyUp: true },
        tail: { P: [[-104, 2], [-124, -6], [-142, -6], [-158, -2]], w: [16, 4] },
        far: [{ leg: [[-70, -22, 9], [-74, -46, 7]], paw: [-74, -52], pk: 'sole', rot: -8 }, oArm([22, -28], [20, -52], 7, 5.5)],
        near: [{ leg: [[-60, -24, 10], [-62, -50, 7.5]], paw: [-61, -57], pk: 'sole', rot: 6 }, oArm([32, -26], [34, -50], 8, 6)],
        head: h,
        ripples: [[-10, 110], [-150, 24]]
      };
      if (sp.pup) {
        // Riffle's pebbles: tossed over his tummy; dropping, with a plip, when something startles him
        if (/^(wonder|scared|worried|shout)$/.test(mood)) P.drops = [[128, -50, 7], [142, -24, 7.5], [118, -9, 6.5]];
        else if (/^(sleepy|dreamy|kind|solemn)$/.test(mood)) P.pebbles = [[-6, -46, 7.5], [10, -48, 7]];
        else { P.pebbles = [[6, -86, 8], [30, -104, 8.5], [52, -84, 7.5]]; P.arcs = [[[20, -54], [6, -86]], [[6, -86], [30, -104]], [[30, -104], [52, -84]]]; }
      }
      return P;
    },
    sun: function (sp) {
      return {
        body: { P: [[-84, -30], [-50, -40], [10, -40], [44, -34]], w: [28, 32, 21], tm: 0.45, bellyUp: true },
        tail: { P: [[-104, -24], [-126, -11], [-146, -6], [-162, -9]], w: [18, 4] },
        far: [{ leg: [[-68, -56, 9], [-80, -82, 7]], paw: [-82, -88], pk: 'sole', rot: -14 }, oArm([24, -62], [6, -72], 7, 5.5)],
        near: [{ leg: [[-58, -58, 10], [-62, -88, 7.5]], paw: [-62, -95], pk: 'sole', rot: 4 }, oArm([32, -60], [16, -74], 8, 6)],
        head: headAt(sp, 64, -50, 62)
      };
    },
    slide: function (sp) {
      return {
        body: { P: [[-84, -26], [-50, -30], [10, -30], [42, -28]], w: [24, 28, 19], tm: 0.45 },
        tail: { P: [[-104, -22], [-128, -18], [-148, -14], [-168, -12]], w: [17, 4] },
        far: [{ leg: [[20, -18, 7], [0, -9, 5.5]], paw: [-3, -8], pk: 'hand' }],
        near: [{ leg: [[-72, -18, 10], [-102, -9, 7]], paw: [-108, -8], pk: 'foot', rot: 180 }, { leg: [[30, -16, 8], [8, -8, 6]], paw: [4, -7], pk: 'hand' }],
        head: headAt(sp, 66, -46, -6),
        mud: [[104, -14, 6.5], [116, -34, 4.6], [98, -50, 3.6], [122, -8, 3.2]],
        speed: true, tilt: 12
      };
    },
    hug: function (sp, mood, o) {
      // chapter 5, `holds: 'pole'`: hugging a pole twice his size ("You hold the pole."). He stands,
      // both arms round it and his cheek against it; it stands upright in front of his chest
      if (o && o.holds === 'pole') {
        return {
          body: { P: [[-12, -44], [-20, -100], [-12, -158], [-4, -190]], w: [33, 35, 18], tm: 0.25 },
          tail: { P: [[-34, -26], [-62, -10], [-84, -4], [-106, -9]], w: [19, 4.2] },
          far: [{ leg: [[-8, -30, 10], [-4, -10, 8]], paw: [-2, -5], pk: 'foot' }],
          near: [{ thigh: [-2, -38, 22, 27, -16], leg: [[2, -28, 11], [8, -10, 8]], paw: [12, -6], pk: 'foot' },
            { leg: [[8, -168, 7.5], [36, -176, 5.5]], paw: [39, -175], pk: 'hand', far: true },
            { leg: [[0, -160, 9], [30, -140, 7]], paw: [33, -138], pk: 'hand' }],
          head: headAt(sp, 2, -212, 12), pole: { a: [27, 4], b: [27, -470], grip: [33, -138] }
        };
      }
      return {
        body: { P: [[-18, -35], [-25, -76], [-8, -110], [10, -130]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-40, -22], [-14, -12], [66, -16], [38, -98]], w: [19, 6.5] }, tailFront: true,
        far: [{ paw: [2, -5], pk: 'foot' }],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [24, -6], pk: 'foot' },
          { leg: [[20, -106, 7.5], [44, -92, 5.5]], paw: [46, -88], pk: 'hand', afterTail: true, far: true },
          { leg: [[10, -104, 9], [38, -78, 7]], paw: [40, -74], pk: 'hand', afterTail: true }],
        head: headAt(sp, 20, -152, 12)
      };
    },
    // chapter 3: a head-first leap off the bank into the river ("Hungry? I'm an OTTER!" SPLOOSH):
    // in the air over the water, forepaws tucked, tail streaming behind, the splash just below
    dive: function (sp) {
      return {
        body: { P: [[-62, -150], [-28, -164], [18, -146], [42, -112]], w: [26, 31, 19], tm: 0.42 },
        tail: { P: [[-84, -146], [-116, -150], [-140, -168], [-158, -196]], w: [17, 4.2] },
        far: [{ leg: [[-66, -156, 9], [-92, -176, 6.5]], paw: [-97, -180], pk: 'foot', rot: -150 }, { leg: [[26, -134, 7], [40, -120, 5.5]], paw: [43, -117], pk: 'hand' }],
        near: [{ thigh: [-56, -146, 21, 17, -18], leg: [[-60, -152, 10], [-84, -186, 7]], paw: [-88, -191], pk: 'foot', rot: -130 }, { leg: [[34, -128, 8], [50, -112, 6]], paw: [53, -108], pk: 'hand' }],
        head: headAt(sp, 62, -86, 36),
        splash: [96, 0], speed: true, speedAt: [-120, -120]
      };
    },
    // a paw over his mouth (shut like a clam): sitting, the near forepaw pressed to his mouth
    hush: function (sp, mood) {
      var h = headAt(sp, 22, -150, 0), hs = sp.headS, mouth = [h[0] + 2 * hs, h[1] + 14 * hs];
      return {
        body: { P: [[-18, -35], [-27, -74], [-8, -108], [12, -128]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-42, -16], [-70, -5], [-94, -3], [-112, -9]], w: [19, 4.2] },
        far: [{ paw: [4, -5], pk: 'foot' }, oArm([22, -102], [40, -80], 7.5, 5.5)],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [20, -6], pk: 'foot' },
          { leg: [[16, -104, 9], [mouth[0] + 6, mouth[1] + 10, 6.5]], paw: mouth, pk: 'hand', k: 1.55, afterHead: true }],
        head: h
      };
    },
    // chapter 5. Whistling, and looking very hard at the sky: sitting, paws folded on his tummy, his
    // head tipped back, lips pursed, two notes drifting up (the picture of somebody with a secret)
    whistle: function (sp) {
      return {
        body: { P: [[-18, -35], [-27, -74], [-8, -108], [10, -128]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-42, -16], [-70, -5], [-94, -3], [-112, -9]], w: [19, 4.2] },
        far: [{ paw: [4, -5], pk: 'foot' }, oArm([20, -102], [28, -70], 7.5, 5.5)],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [20, -6], pk: 'foot' }, oArm([11, -104], [18, -64], 9, 7)],
        head: headAt(sp, 14, -150, -26), look: [0.7, -2.6], mouth: 'whistle', notes: true
      };
    },
    // groaning ("She means COIL."): slumped back, arms hanging, his head rolled back and his eyes
    // rolled up to the sky; a bore, never a fright
    groan: function (sp) {
      return {
        body: { P: [[-14, -35], [-30, -70], [-22, -104], [-8, -124]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-40, -16], [-68, -5], [-92, -3], [-110, -9]], w: [19, 4.2] },
        far: [{ paw: [8, -5], pk: 'foot' }, oArm([0, -100], [14, -52], 7.5, 5.5)],
        near: [{ thigh: [0, -27, 24, 19, -10], paw: [24, -6], pk: 'foot' }, oArm([-10, -100], [-2, -46], 9, 7)],
        head: headAt(sp, -6, -146, -20), roll: true, mouth: 'groan'
      };
    },
    // a somersault ("YOU DID IT!"): upside down in the air, heels over head, his tail flying round
    // after him, and a ring of swoosh to say which way he is turning
    flip: function (sp) {
      return {
        body: { P: [[-26, -196], [-50, -160], [-22, -116], [14, -98]], w: [27, 32, 19], tm: 0.4 },
        tail: { P: [[-36, -212], [-70, -236], [-108, -214], [-112, -172]], w: [17, 4.2] },
        far: [{ leg: [[-24, -206, 9], [-4, -232, 6.5]], paw: [0, -237], pk: 'foot', rot: -50 }, oArm([10, -112], [-14, -86], 7.5, 5.5)],
        near: [{ thigh: [-20, -192, 21, 17, -34], leg: [[-12, -200, 10], [16, -220, 7]], paw: [21, -224], pk: 'foot', rot: -32 }, oArm([20, -104], [54, -112], 9, 7)],
        head: headAt(sp, 30, -74, 164), spin: [-6, -150, 106]
      };
    },
    // hopping on the spot, bursting with a question: both feet off the ground, forepaws up
    hop: function (sp) {
      var up = 24;
      return {
        body: { P: [[-4, -44 - up], [-10, -100 - up], [-2, -160 - up], [6, -192 - up]], w: [33, 35, 18], tm: 0.25 },
        tail: { P: [[-26, -26 - up], [-52, -22 - up], [-78, -34 - up], [-92, -58 - up]], w: [19, 4.2] },
        far: [{ leg: [[0, -30 - up, 10], [8, -12 - up, 8]], paw: [12, -8 - up], pk: 'foot', rot: 18 }, oArm([20, -164 - up], [44, -186 - up], 7.5, 5.5)],
        near: [{ thigh: [6, -38 - up, 22, 27, -16], leg: [[10, -28 - up, 11], [20, -12 - up, 8]], paw: [25, -9 - up], pk: 'foot', rot: 18 }, oArm([12, -166 - up], [40, -170 - up], 9, 7)],
        head: headAt(sp, 12, -214 - up, -4), hopMarks: true
      };
    },
    // "I'm only POINTING.": sitting, one arm straight down at the logs, one finger out, and his face
    // turned up to us as if the arm were none of his business
    point: function (sp) {
      return {
        body: { P: [[-18, -35], [-27, -74], [-8, -108], [12, -128]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-42, -16], [-70, -5], [-94, -3], [-112, -9]], w: [19, 4.2] },
        far: [{ paw: [4, -5], pk: 'foot' }, oArm([22, -102], [36, -78], 7.5, 5.5)],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [20, -6], pk: 'foot' },
          { leg: [[14, -104, 9], [56, -46, 6.5]], paw: [58, -42], pk: 'point', dir: [0.16, 1], afterHead: true }],
        head: headAt(sp, 22, -150, -6), look: [0.4, -1.2]
      };
    },
    // falling over backwards ("FOURTEEN?"): on his back, feet in the air, arms flung wide
    fall: function (sp) {
      return {
        body: { P: [[12, -33], [-22, -43], [-58, -57], [-84, -67]], w: [33, 36, 19], tm: 0.32, bellyUp: true },
        tail: { P: [[34, -23], [58, -9], [84, -6], [106, -12]], w: [18, 4.2] },
        far: [{ leg: [[20, -41, 10], [42, -81, 7]], paw: [45, -87], pk: 'sole', rot: 18 }, oArm([-74, -75], [-56, -113], 7.5, 5.5)],
        near: [{ thigh: [18, -37, 22, 18, -36], leg: [[28, -43, 11], [62, -71, 8]], paw: [67, -75], pk: 'sole', rot: 44 }, oArm([-80, -63], [-112, -37], 9, 7)],
        head: headAt(sp, -100, -89, -58), look: [0, -1.4], thud: [[-60, -6], [-16, -4]]
      };
    },
    // chapter 6. Holding his breath ("All the way out. Not a word."): sitting up very straight, his
    // forepaws pressed to his tummy, his cheeks puffed round, his eyes wide
    puff: function (sp) {
      return {
        body: { P: [[-18, -35], [-26, -76], [-10, -112], [8, -132]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-42, -16], [-70, -5], [-94, -3], [-112, -9]], w: [19, 4.2] },
        far: [{ paw: [4, -5], pk: 'foot' }, oArm([18, -104], [24, -72], 7.5, 5.5)],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [20, -6], pk: 'foot' }, oArm([9, -106], [16, -66], 9, 7)],
        head: headAt(sp, 16, -154, 0), look: [0.6, -0.2], mouth: 'puff', puff: true
      };
    },
    // the ferry otters' applause ("otter tails go Slap! Slap! Slap!"): sitting up, the tail swung
    // high behind and coming down flat, the smack marks where it lands
    slap: function (sp, mood) {
      var h = headAt(sp, 22, -150, 0), P = {
        body: { P: [[-18, -35], [-27, -74], [-8, -108], [12, -128]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-40, -24], [-76, -70], [-118, -58], [-132, -12]], w: [19, 7] },
        far: [{ paw: [4, -5], pk: 'foot' }, oArm([22, -102], [42, -90], 7.5, 5.5)],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [20, -6], pk: 'foot' }, oArm([13, -104], [36, -84], 9, 7)],
        head: h, smack: [-134, -2]
      };
      return P;
    }
  };
  // Riffle waves when he's happy; the old ferry otter cups a paw to his ear when he shouts ("WHAT?").
  function otterGesture(P, sp, mood, h, shoulder) {
    var hs = sp.headS;
    if (sp.old && mood === 'shout') {
      var ear = [h[0] + 30 * hs, h[1] - 6 * hs];
      P.near[P.near.length - 1] = { leg: [[shoulder[0] + 4, shoulder[1] + 2, 9], [ear[0] + 4, ear[1] + 8, 6.5]], paw: ear, pk: 'cup', afterHead: true };
    } else if (sp.pup && mood === 'happy') {
      var pw = [h[0] + 40 * hs, h[1] - 34 * hs];
      P.near[P.near.length - 1] = { leg: [[shoulder[0] + 4, shoulder[1], 9], [pw[0] - 2, pw[1] + 6, 6.5]], paw: pw, pk: 'hand', wave: true };
    }
  }

  // ----- the dog poses (dog units: a standard dog stands about 150 tall)
  var DOG_POSE = {
    stand: function (sp) {
      return {
        neck: [[36, -94, 16], [48, -112, 15]],
        torso: [[-34, -78, 22], [28, -80, 26]],
        tails: { up: [[-54, -88], [-70, -100], [-74, -122], [-64, -138]], down: [[-54, -76], [-62, -60], [-58, -42], [-46, -34]] },
        far: [{ leg: [[-40, -70, 9], [-44, -10, 6]], paw: [-40, -6] }, { leg: [[20, -66, 8], [20, -10, 6]], paw: [24, -6] }],
        near: [{ thigh: [-32, -70, 18, 25, 14], leg: [[-30, -56, 9], [-28, -10, 6.5]], paw: [-24, -6] }, { leg: [[34, -64, 9], [37, -10, 6.5]], paw: [41, -6] }],
        head: headAt(sp, 56, -124, 0)
      };
    },
    sit: function (sp) {
      return {
        neck: [[18, -96, 16], [24, -114, 15]],
        torso: [[-22, -38, 28], [12, -82, 24]],
        haunch: [-18, -34, 26, 22, -22],
        tails: { up: [[-48, -14], [-66, -6], [-82, -6], [-94, -16]], down: [[-44, -12], [-30, -3], [-6, -3], [8, -6]] },
        far: [{ paw: [-2, -5] }, { leg: [[10, -70, 8], [14, -10, 6]], paw: [18, -6] }],
        near: [{ paw: [12, -6] }, { leg: [[21, -70, 9], [25, -10, 6.5]], paw: [29, -6] }],
        head: headAt(sp, 28, -128, 0)
      };
    },
    howl: function (sp) {
      return {
        neck: [[18, -96, 16], [22, -116, 15]],
        torso: [[-22, -38, 28], [12, -82, 24]],
        haunch: [-18, -34, 26, 22, -22],
        tails: { up: [[-48, -14], [-66, -6], [-82, -6], [-94, -16]], down: [[-44, -12], [-30, -3], [-6, -3], [8, -6]] },
        far: [{ paw: [-2, -5] }, { leg: [[10, -70, 8], [14, -10, 6]], paw: [18, -6] }],
        near: [{ paw: [12, -6] }, { leg: [[21, -70, 9], [25, -10, 6.5]], paw: [29, -6] }],
        head: headAt(sp, 18, -132, -34), howl: true
      };
    },
    jump: function (sp) {
      return {
        neck: [[16, -122, 16], [26, -140, 15]],
        torso: [[-24, -50, 22], [12, -106, 25]],
        tails: { up: [[-40, -58], [-60, -62], [-74, -78], [-76, -98]], down: [[-40, -50], [-52, -40], [-52, -24], [-44, -16]] },
        far: [{ leg: [[-28, -42, 9], [-20, -10, 6]], paw: [-16, -6] }, { leg: [[18, -112, 8], [46, -128, 6]], paw: [51, -130], up: true }],
        near: [{ thigh: [-22, -48, 18, 25, -24], leg: [[-18, -36, 9], [-8, -10, 6.5]], paw: [-4, -6] }, { leg: [[24, -108, 9], [56, -118, 6.5]], paw: [61, -119], up: true }],
        head: headAt(sp, 34, -158, -4)
      };
    },
    bounce: function (sp) {
      return {
        neck: [[36, -110, 16], [46, -128, 15]],
        torso: [[-32, -96, 21], [28, -98, 25]],
        tails: { up: [[-52, -104], [-68, -114], [-72, -134], [-62, -150]], down: [[-52, -98], [-66, -96], [-80, -100], [-90, -108]] },
        far: [{ leg: [[-38, -88, 9], [-58, -64, 6]], paw: [-62, -60] }, { leg: [[22, -88, 8], [42, -62, 6]], paw: [46, -58] }],
        near: [{ thigh: [-30, -92, 18, 22, 40], leg: [[-30, -80, 9], [-46, -58, 6.5]], paw: [-50, -54] }, { leg: [[34, -86, 9], [56, -64, 6.5]], paw: [60, -60] }],
        head: headAt(sp, 56, -140, -6), air: true
      };
    },
    // chapter 8: lying down, the body low along the ground, the hind leg tucked under, both forelegs
    // stretched out in front and the head resting on them, chin down, the paws showing past it
    lie: function (sp) {
      var f = Math.max(0, sp.headS - 1) * 40;   // (a big head, the tiny dog's: the paws a little further out)
      return {
        neck: [[30, -34, 16], [42, -36, 15]],
        torso: [[-36, -27, 24], [20, -29, 25]],
        haunch: [-32, -24, 26, 18, -6],
        tails: { up: [[-58, -20], [-76, -16], [-92, -16], [-104, -24]], down: [[-58, -14], [-72, -6], [-88, -4], [-102, -7]] },
        far: [{ leg: [[24, -14, 8], [98 + f, -8, 6]], paw: [104 + f, -6] }],
        near: [{ paw: [-8, -5] }, { leg: [[30, -12, 9], [108 + f, -7, 6.5]], paw: [115 + f, -6] }],
        head: headAt(sp, 52, -34, 4)
      };
    }
  };

  // floppy ears: hanging angle (0 = straight down, 90 = straight out) by mood
  var FLOP = { neutral: 14, happy: 34, dreamy: 12, wonder: 44, worried: 4, scared: -6, sleepy: 6, laugh: 30, stern: 10, kind: 16, proud: 26, sniff: 30, shout: 52, solemn: 8, sad: -2, shy: 8 };
  var DOG_ROT = { wonder: 16, worried: -10, shy: 12 };   // puzzled dogs tilt their heads (and shy ones)
  var BEAST_MOUTH = {
    otter: { neutral: 'w', happy: 'smile', dreamy: 'smile', wonder: 'o', worried: 'wavy', scared: 'o', sleepy: 'w', laugh: 'open', stern: 'frown', kind: 'smile', proud: 'smile', sniff: 'w', shout: 'bark', solemn: 'line', sad: 'wobble', shy: 'small' },
    dog: { neutral: 'w', happy: 'tongue', dreamy: 'smile', wonder: 'o', worried: 'wavy', scared: 'o', sleepy: 'w', laugh: 'open', stern: 'frown', kind: 'smile', proud: 'tongue', sniff: 'w', shout: 'bark', solemn: 'line', sad: 'wobble', shy: 'small' }
  };

  // One round eye in local coordinates (outer corner at +x). Otters have shiny all-dark eyes; dogs
  // have whites, so a dim, kind dog can look a little this way and that.
  function beastEye(kind, r, look, side, lid, ink, eid, ecl, sclera) {
    if (kind === 'arc') return '<path d="M' + N(-r) + ',' + N(r * 0.3) + 'Q0,' + N(-r * 1.15) + ' ' + N(r) + ',' + N(r * 0.3) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.5) + '" fill="none" stroke-linecap="round"/>';
    if (kind === 'closed') return '<path d="M' + N(-r) + ',' + N(-r * 0.15) + 'Q0,' + N(r * 0.75) + ' ' + N(r) + ',' + N(-r * 0.15) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.46) + '" fill="none" stroke-linecap="round"/>';
    if (kind === 'squeeze') return '<path d="M' + N(r * 0.85) + ',' + N(-r * 0.75) + 'L' + N(-r * 0.6) + ',0L' + N(r * 0.85) + ',' + N(r * 0.75) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.48) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    var lx = look[0] * side * r * 0.22, ly = look[1] * r * 0.22, g = '<g clip-path="url(#' + ecl + ')">';
    var white = sclera || kind === 'scared';
    if (white) {
      var pr = kind === 'scared' ? r * 0.36 : kind === 'wonder' ? r * 0.7 : r * 0.6;
      var px = lx * (kind === 'scared' ? 0.4 : 1), py = ly + (kind === 'lidUp' ? -r * 0.32 : kind === 'lidHalf' ? r * 0.2 : kind === 'lidShy' ? r * 0.36 : 0);
      g += '<use href="#' + eid + '" fill="#fffdf8"/><circle cx="' + N(px) + '" cy="' + N(py) + '" r="' + N(pr) + '" fill="' + BEAST_INK + '"/>' +
        '<circle cx="' + N(px - pr * 0.4 * side) + '" cy="' + N(py - pr * 0.42) + '" r="' + N(pr * 0.4) + '" fill="#fff"/>' +
        (kind === 'scared' ? '' : '<circle cx="' + N(px + pr * 0.38 * side) + '" cy="' + N(py + pr * 0.4) + '" r="' + N(pr * 0.16) + '" fill="#fff"/>');
    } else {
      var hy = kind === 'lidUp' ? r * 0.1 : kind.indexOf('lid') === 0 ? r * 0.05 : -r * 0.38;
      g += '<use href="#' + eid + '" fill="' + BEAST_INK + '"/><ellipse cx="0" cy="' + N(r * 0.62) + '" rx="' + N(r * 0.72) + '" ry="' + N(r * 0.36) + '" fill="#6b4535" opacity=".75"/>' +
        '<circle cx="' + N(lx - r * 0.3 * side) + '" cy="' + N(ly + hy) + '" r="' + N(r * (kind === 'wonder' ? 0.42 : 0.34)) + '" fill="#fff"/>' +
        '<circle cx="' + N(lx + r * 0.32 * side) + '" cy="' + N(ly + hy + r * 0.66) + '" r="' + N(r * 0.15) + '" fill="#fff"/>' +
        (kind === 'wonder' ? '<circle cx="' + N(lx + r * 0.36 * side) + '" cy="' + N(ly - r * 0.5) + '" r="' + N(r * 0.13) + '" fill="#fff"/>' : '');
    }
    var LB = { lidSoft: [0.1, -1.0, -0.15], lidFlat: [0.3, 0.1, -0.4], lidHalf: [-0.05, 0.05, -0.12], lidUp: [-0.15, -1.05, -0.5],
      lidSad: [-0.78, -0.86, -0.12], lidShy: [0.1, -0.9, 0.02] }[kind];
    if (LB) {
      g += '<path d="M' + N(-r * 1.4) + ',' + N(LB[0] * r) + 'Q0,' + N(LB[1] * r) + ' ' + N(r * 1.4) + ',' + N(LB[2] * r) + 'L' + N(r * 1.4) + ',' + N(-r * 1.6) + 'L' + N(-r * 1.4) + ',' + N(-r * 1.6) + 'Z" fill="' + lid + '"/></g>' +
        '<path d="M' + N(-r * 1.02) + ',' + N(LB[0] * r) + 'Q0,' + N(LB[1] * r) + ' ' + N(r * 1.02) + ',' + N(LB[2] * r) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.34) + '" fill="none" stroke-linecap="round"/>';
      return g + (white ? '<use href="#' + eid + '" fill="none" stroke="' + ink + '" stroke-width="' + N(r * 0.2) + '"/>' : '');
    }
    return g + '</g>' + (white ? '<use href="#' + eid + '" fill="none" stroke="' + ink + '" stroke-width="' + N(r * 0.24) + '"/>' : '');
  }

  // Ears, in head coordinates (drawn behind the head). Returns markup; `pts` collects tips for the head box.
  function beastEars(sp, mood, ctx, pts, lk) {
    var p = sp.pal, s = '';
    if (sp.kind === 'otter') {
      var low = mood === 'scared' || mood === 'worried' ? 6 : 0;
      [-1, 1].forEach(function (side) {
        var x = side * 26, y = -16 + low;
        s += '<circle cx="' + x + '" cy="' + y + '" r="7.6" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="' + N(2.2 * lk) + '"/><circle cx="' + N(x - side * 0.6) + '" cy="' + N(y + 0.8) + '" r="3.8" fill="' + p.earIn + '"/>';
        pts.push([x - 8, y - 8], [x + 8, y - 8]);
      });
      return s;
    }
    if (sp.ears === 'pointy') {
      var ea = Math.min(64, (EAR_ANG[mood] || 0) + (ctx.earBias || 0));
      [-1, 1].forEach(function (side) {
        var th = 22 + ea, tr = 'translate(' + (side * 19) + ',-19) scale(' + side + ',1) rotate(' + N(th) + ') scale(1.36)';
        s += '<g transform="' + tr + '"><path d="' + EAR + '" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="' + N(1.6 * lk) + '" stroke-linejoin="round"/><path d="' + EAR_IN + '" fill="' + p.earIn + '"/></g>';
        var m = mul(mT(side * 19, -19), mul(mS(side, 1), mul(mR(th), mS(1.36))));
        pts.push(apply(m, [1, -31]), apply(m, [14, 4]), apply(m, [-13, 4]));
      });
      return s;
    }
    var shag = sp.ears === 'shaggy', ang = ctx.flop != null ? ctx.flop : (FLOP[mood] == null ? 14 : FLOP[mood]) * (shag ? 0.6 : 1);
    var ear = shag ? 'M-9,0C-16,14 -16,40 -6,50C2,56 14,48 14,32C14,16 10,5 8,0Z' : 'M-7,0C-12,10 -12,30 -4,38C2,42 10,36 10,24C10,12 7,4 6,0Z';
    [-1, 1].forEach(function (side) {
      var ax = side * (shag ? 34 : 25), ay = shag ? -8 : -22;
      var m = mul(mT(ax, ay), mul(mS(side, 1), mR(-ang)));
      var d = ear;
      if (shag) {
        var ep = [];
        for (var i = 0; i < 13; i++) { var a = Math.PI * 2 * i / 13; ep.push([3 + Math.cos(a) * (12 + 2 * Math.max(0, Math.sin(a))), 27 + Math.sin(a) * 29]); }
        d = scallop(ep, 0.6);
      }
      s += '<g transform="' + mStr(m) + '"><path d="' + d + '" fill="' + p.earFill + '" stroke="' + p.line + '" stroke-width="' + N(2.2 * lk) + '" stroke-linejoin="round"/></g>';
      pts.push(apply(m, [-12, 4]), apply(m, [12, 4]), apply(m, [2, shag ? 58 : 41]), apply(m, [-12, 28]), apply(m, [shag ? 17 : 14, 28]));
    });
    return s;
  }

  function beastHead(R, sp, mood, ctx, lk) {
    var p = sp.pal, F = ctx.F, dog = sp.kind === 'dog', s = '', pts = [];
    var kind = EYE_KIND[mood] || 'open';
    if (kind === 'lidKind') kind = 'lidSoft';   // the cats' warmer kind lids; otters and dogs keep theirs
    if (ctx.squeeze) kind = 'squeeze';           // chapter 3, `squeeze: true`: eyes squeezed shut
    if (ctx.howl && kind === 'open') kind = 'closed';
    if (ctx.puff && !ctx.squeeze) kind = 'wonder';   // chapter 6, holding his breath: eyes wide
    if (ctx.asleep) kind = 'closed';                 // chapter 8, the dogs asleep in a heap (`asleep: true`)
    var ink = p.feat;
    s += beastEars(sp, mood, ctx, pts, lk);
    // collar or bandana behind the chin
    if (sp.collar) {
      s += '<path d="M-21,23Q0,32 21,23L21,31Q0,41 -21,31Z" fill="' + sp.collar + '" stroke="' + mix(sp.collar, '#000', 0.4) + '" stroke-width="' + N(1.8 * lk) + '" stroke-linejoin="round"/>' +
        '<circle cx="6" cy="40" r="4.6" fill="#f2c14e" stroke="#a87a22" stroke-width="' + N(1.5 * lk) + '"/>';
      pts.push([6, 45]);
    }
    if (sp.bandana) {
      s += '<path d="M-30,20Q0,31 30,20L6,52Q0,56 -6,52Z" fill="' + sp.bandana + '" stroke="' + mix(sp.bandana, '#000', 0.4) + '" stroke-width="' + N(2 * lk) + '" stroke-linejoin="round"/>' +
        '<g fill="#fff" opacity=".85"><circle cx="-14" cy="28" r="2.2"/><circle cx="8" cy="30" r="2.2"/><circle cx="-2" cy="40" r="2"/><circle cx="16" cy="25" r="1.8"/></g>';
      pts.push([0, 56]);
    }
    // the head shape
    var hd, hp;
    if (sp.shaggy) {
      hp = [];
      for (var i = 0; i < 26; i++) {
        var a = Math.PI * 2 * i / 26, c = Math.cos(a), sn = Math.sin(a);
        hp.push([c * (40 + Math.max(0, sn) * Math.abs(c) * 7), sn * 36 - 2]);
      }
      hd = scallop(hp, 0.62);
      pts = pts.concat(hp.map(function (q) { return [q[0] * 1.08, q[1] * 1.08]; }));
    } else {
      hp = dog ? DOG_HEAD : OTTER_HEAD;
      hd = crClosed(hp);
      pts = pts.concat(hp);
    }
    var inner = '<ellipse cx="-9" cy="' + (dog ? -20 : -16) + '" rx="14" ry="5.5" transform="rotate(-10 -9 -18)" fill="' + p.light + '" opacity=".5"/>';
    if (!dog) inner += '<ellipse cx="0" cy="22" rx="16" ry="8" fill="' + p.belly + '"/>';
    if (sp.tiny) inner += '<path d="M0,-30Q-5,-14 -3,2L3,2Q5,-14 0,-30Z" fill="' + p.belly + '"/>';
    if (sp.spots) {
      // one big patch round one eye (always her left: it stays put when she turns), and a few freckles
      var pside = -F;
      inner += '<path d="' + blob(pside * 14, -9, 11, 2) + '" fill="' + p.spot + '"/>' +
        '<g fill="' + p.spot + '"><circle cx="' + (-pside * 20) + '" cy="-21" r="3.4"/><circle cx="' + (-pside * 9) + '" cy="-26" r="2.4"/><circle cx="' + (pside * 2) + '" cy="-22" r="2.2"/></g>';
    }
    s += R.part(hd, { fill: p.base, dark: p.shade, line: p.line, sx: ctx.sx * 0.8, sy: -3.2 * lk, inner: inner, lw: N(2.4 * lk) });
    // muzzle
    var my = dog ? 13 : 9;
    if (dog) {
      var mrx = sp.shaggy ? 21 : 17, mry = sp.shaggy ? 15 : 12.5;
      if (sp.shaggy) {
        var mp = [];
        for (var j = 0; j < 14; j++) { var b = Math.PI * 2 * j / 14; mp.push([Math.cos(b) * mrx, my + Math.sin(b) * mry]); }
        s += '<path d="' + scallop(mp, 0.6) + '" fill="' + p.muzzle + '" stroke="' + p.line + '" stroke-width="' + N(1.6 * lk) + '" stroke-opacity=".7"/>';
      } else {
        s += '<ellipse cx="0" cy="' + my + '" rx="' + mrx + '" ry="' + mry + '" fill="' + p.muzzle + '" stroke="' + p.line + '" stroke-width="' + N(1.6 * lk) + '" stroke-opacity=".7"/>';
      }
      pts.push([0, my + mry + 1]);
    } else if (ctx.puff) {
      // chapter 6, his cheeks puffed round: two balloons of fur bulging past his face, the muzzle fat
      s += '<g class="pc-cheeks" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="' + N(2.2 * lk) + '"><circle cx="-25" cy="13" r="18"/><circle cx="25" cy="13" r="18"/></g>' +
        '<g fill="' + p.light + '" opacity=".6"><ellipse cx="-29" cy="5" rx="6.4" ry="3.6" transform="rotate(-20 -29 5)"/><ellipse cx="21" cy="5" rx="6.4" ry="3.6" transform="rotate(20 21 5)"/></g>' +
        '<g fill="#ff8aa5" opacity=".35"><ellipse cx="-27" cy="17" rx="7" ry="4"/><ellipse cx="27" cy="17" rx="7" ry="4"/></g>' +
        '<g fill="' + p.muzzle + '"><circle cx="-10" cy="' + (my + 2) + '" r="12.6"/><circle cx="10" cy="' + (my + 2) + '" r="12.6"/></g>' +
        '<g fill="' + mix(p.muzzle, p.line, 0.45) + '"><circle cx="-7" cy="11.6" r="1"/><circle cx="-12" cy="9.4" r="1"/><circle cx="-12.6" cy="14" r="1"/><circle cx="7" cy="11.6" r="1"/><circle cx="12" cy="9.4" r="1"/><circle cx="12.6" cy="14" r="1"/></g>';
      pts.push([-44, 13], [44, 13], [-26, 32], [26, 32]);
    } else {
      s += '<g fill="' + p.muzzle + '"><circle cx="-7.6" cy="' + my + '" r="9.6"/><circle cx="7.6" cy="' + my + '" r="9.6"/></g>' +
        '<g fill="' + mix(p.muzzle, p.line, 0.45) + '"><circle cx="-6" cy="10.5" r="1"/><circle cx="-10.5" cy="8.5" r="1"/><circle cx="-11" cy="12.5" r="1"/><circle cx="6" cy="10.5" r="1"/><circle cx="10.5" cy="8.5" r="1"/><circle cx="11" cy="12.5" r="1"/></g>';
    }
    // eyes
    var er = (dog ? (sp.tiny ? 6 : 5.8) : 5.4) * sp.eyeS, ex = dog ? (sp.shaggy ? 15 : 13.5) : 13, ey = dog ? (sp.shaggy ? -4 : -8) : -7;
    var ek = kind === 'wonder' ? 1.16 : kind === 'scared' ? 1.1 : 1;
    var eid = R.id(), ecl = R.id();
    R.defs += '<path id="' + eid + '" d="M' + N(-er) + ',0A' + N(er) + ' ' + N(er * 1.12) + ' 0 1 1 ' + N(er) + ',0A' + N(er) + ' ' + N(er * 1.12) + ' 0 1 1 ' + N(-er) + ',0Z"/><clipPath id="' + ecl + '"><use href="#' + eid + '"/></clipPath>';
    var look = ctx.look || [1, 0];
    [-1, 1].forEach(function (side) {
      var lk2 = look;
      // the shaggy dog's eyes don't quite agree on where to look
      if (sp.goofy && kind === 'open') lk2 = [look[0] + (side < 0 ? -0.8 : 0.6), look[1] + (side < 0 ? 0.6 : -0.3)];
      var lidc = p.base, ink2 = ink;
      // the eye inside the spotty dog's patch: lids of patch colour, and light lines where the eye is shut
      if (sp.spots && side === -F) { lidc = p.spot; if (/^(arc|closed|squeeze)$/.test(kind)) ink2 = '#f3eee4'; }
      // chapter 5, a groan: the eyes rolled up, whites showing, the pupils half under the lids
      if (ctx.roll) s += '<g transform="translate(' + N(side * ex) + ',' + ey + ') scale(' + N(side * 1.08) + ',1.08)">' + beastEye('open', er, [0.5, -3.3], side, lidc, ink2, eid, ecl, true) + '</g>';
      else
      s += '<g transform="translate(' + N(side * ex) + ',' + ey + ') scale(' + N(side * ek) + ',' + N(ek) + ')">' + beastEye(kind, er, lk2, side, lidc, ink2, eid, ecl, dog) + '</g>';
    });
    // the shaggy dog's fringe, over the top of his eyes
    if (sp.fringe) {
      var fy = ey - er * ({ arc: 1.15, closed: 0.95, squeeze: 1.1, wonder: 1.45, scared: 1.45, lidUp: 0.8 }[kind] || 0.35);
      var fd = '';
      // the top: a little outside the head's own outline
      var ftop = [];
      for (var f = 0; f <= 12; f++) {
        var fa = lerp(Math.PI - Math.asin(clamp((fy + 2) / 39, -1, 1)), 2 * Math.PI + Math.asin(clamp((fy + 2) / 39, -1, 1)), f / 12);
        ftop.push([Math.cos(fa) * 42, Math.sin(fa) * 39 - 2]);
      }
      fd = 'M' + pt(ftop[0]) + cr(ftop);
      // the bottom edge: seven locks, the middle ones longest
      var xr = ftop[12][0], xl = ftop[0][0];
      for (var fi = 1; fi <= 7; fi++) {
        var xa = lerp(xr, xl, fi / 7), dip = 3 + 4 * Math.sin(Math.PI * fi / 7);
        fd += 'Q' + pt([lerp(xr, xl, (fi - 0.5) / 7), fy + dip * 2]) + ' ' + pt([xa, fy + (fi === 7 ? -2 : 1)]);
      }
      fd += 'Z';
      s += '<path d="' + fd + '" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="' + N(1.8 * lk) + '" stroke-linejoin="round"/>' +
        '<path d="M-24,' + N(fy - 14) + 'q3,7 1,13M-8,' + N(fy - 17) + 'q3,7 1,14M8,' + N(fy - 17) + 'q-3,7 -1,14M24,' + N(fy - 14) + 'q-3,7 -1,13" stroke="' + p.line + '" stroke-width="' + N(1.4 * lk) + '" fill="none" stroke-linecap="round" opacity=".45"/>';
      pts.push([0, -43]);
    }
    // brows: the moods' brows, or the old otter's white bushy ones
    var br = BROW[mood] || (sp.brows ? [0, -1] : null);
    if (br && !sp.fringe) {
      var shut = kind === 'arc' || kind === 'closed' || kind === 'squeeze';
      var by = ey - er * 1.25 - 4 - (kind === 'wonder' ? 2 : 0) - (shut ? 2 : 0);
      var bc = sp.brows ? p.brow : ink, bw = sp.brows ? 4.2 : 2.6;
      s += '<path d="M' + N(-ex + 6) + ',' + N(by + br[0]) + 'L' + N(-ex - 7) + ',' + N(by + br[1]) + 'M' + N(ex - 6) + ',' + N(by + br[0]) + 'L' + N(ex + 7) + ',' + N(by + br[1]) +
        '" stroke="' + bc + '" stroke-width="' + N(bw * lk) + '" stroke-linecap="round" fill="none"/>';
    }
    if (BLUSH[mood]) s += '<g fill="#ff8aa5" opacity=".4"><ellipse cx="' + N(-ex - 9) + '" cy="' + N(ey + 12) + '" rx="5.6" ry="3.2"/><ellipse cx="' + N(ex + 9) + '" cy="' + N(ey + 12) + '" rx="5.6" ry="3.2"/></g>';
    // nose and mouth
    var mk = ctx.howl ? 'howl' : ctx.mouth || BEAST_MOUTH[sp.kind][mood] || 'w';
    if (dog && sp.goofy && mk === 'w') mk = 'tongue';
    var ny = dog ? 4 : 1.5, nk = (mood === 'sniff' ? 1.25 : 1) * (sp.shaggy ? 1.15 : sp.tiny ? 0.85 : 1), mo = '';
    var my0 = dog ? 12 : 9.5;   // where the mouth starts, under the nose
    var msw = function (w) { return ' stroke="' + ink + '" stroke-width="' + N(w) + '" stroke-linecap="round" stroke-linejoin="round"'; };
    var mstroke = msw(1.9 * lk);
    var tongueD = function (x, y, w, l) { return '<path d="M' + N(x - w) + ',' + N(y) + 'Q' + N(x - w * 1.1) + ',' + N(y + l) + ' ' + N(x) + ',' + N(y + l) + 'Q' + N(x + w * 1.1) + ',' + N(y + l) + ' ' + N(x + w) + ',' + N(y) + 'Z" fill="' + TONGUE + '" stroke="' + mix(TONGUE, '#7a2c3b', 0.5) + '" stroke-width="' + N(1.4 * lk) + '"/><path d="M' + N(x) + ',' + N(y + 1) + 'V' + N(y + l * 0.6) + '" stroke="' + mix(TONGUE, '#7a2c3b', 0.4) + '" stroke-width="' + N(1.1 * lk) + '"/>'; };
    var W = dog ? 1.25 : 1;
    if (mk === 'open' || mk === 'bark' || mk === 'howl') {
      var big = mk === 'bark' ? 1.25 : mk === 'howl' ? 0.85 : 1, top = my0 + 2;
      if (mk === 'howl') mo += '<ellipse cx="0" cy="' + N(top + 7) + '" rx="' + N(6 * W) + '" ry="' + N(8.5) + '" fill="#7a2c3b"' + mstroke + '/><ellipse cx="0" cy="' + N(top + 11) + '" rx="' + N(3.6 * W) + '" ry="3" fill="' + TONGUE + '"/>';
      else {
        var hw = 9 * W * big, dep = 14 * big;
        mo += '<path d="M' + N(-hw) + ',' + N(top) + 'Q0,' + N(top - 1.5) + ' ' + N(hw) + ',' + N(top) + 'Q' + N(hw * 1.05) + ',' + N(top + dep) + ' 0,' + N(top + dep + 1) + 'Q' + N(-hw * 1.05) + ',' + N(top + dep) + ' ' + N(-hw) + ',' + N(top) + 'Z" fill="#7a2c3b"' + mstroke + '/>' +
          '<path d="M' + N(-hw * 0.6) + ',' + N(top + dep * 0.72) + 'Q0,' + N(top + dep * 0.36) + ' ' + N(hw * 0.6) + ',' + N(top + dep * 0.72) + 'Q' + N(hw * 0.3) + ',' + N(top + dep + 0.6) + ' 0,' + N(top + dep + 0.6) + 'Q' + N(-hw * 0.3) + ',' + N(top + dep + 0.6) + ' ' + N(-hw * 0.6) + ',' + N(top + dep * 0.72) + 'Z" fill="' + TONGUE + '"/>';
        pts.push([0, top + dep + 2]);
      }
    } else if (mk === 'o') {
      mo += '<path d="M0,' + N(my0) + 'V' + N(my0 + 2) + '"' + mstroke + ' fill="none"/><ellipse cx="0" cy="' + N(my0 + 6) + '" rx="' + N((mood === 'scared' ? 2.6 : 3.2) * W) + '" ry="' + N(3.8 * W) + '" fill="#7a2c3b"' + mstroke + '/>';
    } else if (mk === 'whistle') {
      // lips pursed, a little to the front, and two short puffs of breath
      mo += '<path d="M0,' + N(my0) + 'V' + N(my0 + 2) + '"' + mstroke + ' fill="none"/><ellipse cx="2.4" cy="' + N(my0 + 5.6) + '" rx="2.5" ry="2.9" fill="#7a2c3b"' + mstroke + '/>' +
        '<path d="M8.5,' + N(my0 + 3.6) + 'l4.6,-1.6M8.8,' + N(my0 + 7) + 'l4.8,0.4"' + msw(1.3 * lk) + ' fill="none" opacity=".55"/>';
    } else if (mk === 'groan') {
      // a long downturned "uuugh"
      mo += '<path d="M0,' + N(my0) + 'V' + N(my0 + 2) + '"' + mstroke + ' fill="none"/>' +
        '<path d="M-8,' + N(my0 + 5.4) + 'Q0,' + N(my0 + 0.8) + ' 8,' + N(my0 + 5.4) + 'Q7,' + N(my0 + 13.6) + ' 0,' + N(my0 + 13.8) + 'Q-7,' + N(my0 + 13.6) + ' -8,' + N(my0 + 5.4) + 'Z" fill="#7a2c3b"' + mstroke + '/>' +
        '<path d="M-4.4,' + N(my0 + 11.6) + 'Q0,' + N(my0 + 8.6) + ' 4.4,' + N(my0 + 11.6) + 'Q2.2,' + N(my0 + 13.2) + ' 0,' + N(my0 + 13.2) + 'Q-2.2,' + N(my0 + 13.2) + ' -4.4,' + N(my0 + 11.6) + 'Z" fill="' + TONGUE + '"/>';
      pts.push([0, my0 + 15]);
    } else {
      var paths = {
        w: 'M0,' + my0 + 'V' + (my0 + 3) + 'M-7,' + (my0 + 2) + 'Q-3.5,' + (my0 + 7.5) + ' 0,' + (my0 + 3) + 'Q3.5,' + (my0 + 7.5) + ' 7,' + (my0 + 2),
        smile: 'M0,' + my0 + 'V' + (my0 + 3) + 'M-9.5,' + (my0 + 1) + 'Q-4.8,' + (my0 + 9.5) + ' 0,' + (my0 + 3) + 'Q4.8,' + (my0 + 9.5) + ' 9.5,' + (my0 + 1),
        wavy: 'M0,' + my0 + 'V' + (my0 + 2) + 'M-6.5,' + (my0 + 5) + 'Q-3.2,' + (my0 + 1.5) + ' 0,' + (my0 + 4) + 'Q3.2,' + (my0 + 6.5) + ' 6.5,' + (my0 + 3.5),
        frown: 'M0,' + my0 + 'V' + (my0 + 2.5) + 'M-7,' + (my0 + 5.5) + 'Q0,' + (my0 + 1.5) + ' 7,' + (my0 + 5.5),
        line: 'M0,' + my0 + 'V' + (my0 + 3) + 'M-5.5,' + (my0 + 3.4) + 'H5.5',
        // chapter 3: sad's wobbly mouth, shy's small smile
        wobble: 'M0,' + my0 + 'V' + (my0 + 2.5) + 'M-7,' + (my0 + 6.6) + 'Q-5.2,' + (my0 + 3.2) + ' -3.5,' + (my0 + 5) + 'Q-1.7,' + (my0 + 6.8) + ' 0,' + (my0 + 4.8) + 'Q1.7,' + (my0 + 6.8) + ' 3.5,' + (my0 + 5) + 'Q5.2,' + (my0 + 3.2) + ' 7,' + (my0 + 6.6),
        small: 'M0,' + my0 + 'V' + (my0 + 3) + 'M-6,' + (my0 + 1.6) + 'Q-3,' + (my0 + 6.6) + ' 0,' + (my0 + 3) + 'Q3,' + (my0 + 6.6) + ' 6,' + (my0 + 1.6),
        // chapter 6: shut tight on a held breath, a small pucker
        puff: 'M0,' + my0 + 'V' + (my0 + 3.6) + 'M-3.4,' + (my0 + 4.4) + 'Q0,' + (my0 + 6.2) + ' 3.4,' + (my0 + 4.4)
      };
      var mp2 = mk === 'tongue' ? paths.smile : paths[mk] || paths.w;
      if (mk === 'tongue') mo += tongueD(sp.goofy ? 3.5 : 1.5, my0 + 4, 5.2 * W, 12 * W);
      mo += '<path d="' + mp2 + '" transform="scale(' + N(W) + ',1)"' + msw(1.9 * lk / W) + ' fill="none"/>';
      if (mk === 'tongue') pts.push([3, my0 + 18 * W]);
    }
    s += mo;
    var nose = dog ? 'M-9,0Q0,-3.5 9,0Q8.5,7.5 0,10Q-8.5,7.5 -9,0Z' : 'M-7,-1Q0,-3 7,-1Q6.4,5 0,7.4Q-6.4,5 -7,-1Z';
    s += '<g transform="translate(0,' + ny + ') scale(' + N(nk) + ')"><path d="' + nose + '" fill="' + p.nose + '" stroke="' + mix(p.nose, '#000', 0.3) + '" stroke-width="' + N(1.2 * lk) + '" stroke-linejoin="round"/>' +
      '<ellipse cx="-3" cy="' + (dog ? 1.2 : 0.4) + '" rx="' + (dog ? 3.2 : 2.4) + '" ry="1.5" fill="#fff" opacity=".55"/></g>';
    // whiskers
    if (!dog) {
      var wc = p.whisk, wsw = N(1.3 * lk), wd = '';
      [-1, 1].forEach(function (side) {
        for (var k = 0; k < 3; k++) {
          var x0 = side * 13, y0 = 7 + k * 3.2;
          if (sp.whiskers === 'trail') {
            var tipY = (ctx.trail || 38) + k * 5, tipX = side * (40 + k * 8);
            wd += 'M' + N(x0) + ',' + N(y0) + 'C' + N(side * (30 + k * 4)) + ',' + N(y0 - 3) + ' ' + N(side * (38 + k * 6)) + ',' + N(y0 + 10) + ' ' + N(tipX) + ',' + N(tipY);
            pts.push([tipX, tipY]);
          } else {
            var len = sp.whiskers === 'long' ? 54 : 44;
            wd += 'M' + N(x0) + ',' + N(y0) + 'Q' + N(side * len * 0.6) + ',' + N(y0 - 4 + k * 2) + ' ' + N(side * len) + ',' + N(y0 - 6 + k * 6);
          }
        }
      });
      s += '<path d="' + wd + '" stroke="' + wc + '" stroke-width="' + (sp.whiskers === 'trail' ? N(1.7 * lk) : wsw) + '" fill="none" stroke-linecap="round" opacity="' + (sp.whiskers === 'trail' ? '.95' : '.8') + '"/>';
    }
    if (mood === 'sniff') s += '<path d="M38,-6q3,-3 6,0t6,0M41,3q3,-3 6,0t6,0M38,12q3,-3 6,0t6,0" stroke="' + ink + '" stroke-width="' + N(1.7 * lk) + '" fill="none" stroke-linecap="round" opacity=".6"/>';
    if (mood === 'laugh') s += '<g fill="#9fd6f7" stroke="#5aa6d6" stroke-width="' + N(0.8 * lk) + '"><path d="M' + N(ex + 13) + ',' + N(ey + 6) + 'q3,4 0,6q-3,-2 0,-6Z"/><path d="M' + N(-ex - 13) + ',' + N(ey + 6) + 'q3,4 0,6q-3,-2 0,-6Z"/></g>';
    if (mood === 'worried' || mood === 'scared') s += '<path d="M' + N(ex + 19) + ',' + N(ey - 12) + 'q4,7 0,10q-4,-3 0,-10Z" fill="#bfe6fb" stroke="#5aa6d6" stroke-width="' + N(1 * lk) + '"/>';
    // chapter 3: a misty tear; a little cloud of breath
    if (ctx.tear) { s += tearSvg(ex + er * 0.3, ey + er * 1.1, 0.9); pts.push([ex + 5, ey + er * 1.1 + 13]); }
    if (ctx.mist) { s += mistSvg(46, my0 + 2, 0.9); MIST_BOX.forEach(function (q) { pts.push([46 + q[0] * 0.9, my0 + 2 + q[1] * 0.9]); }); }
    // chapter 6, `tap: 'cheeks'`: his two cheeks marked for the page (puffed up in `puff`)
    if (ctx.tapCheeks) s += tapMarks('cheeks', ctx.puff ? [[-25, 13, 19], [25, 13, 19]] : [[-17, 10, 11], [17, 10, 11]]);
    // chapter 8, `tap: 'ears'` (Riffle's small round ears: the whisper Tap)
    if (ctx.tapEars) { var elow = mood === 'scared' || mood === 'worried' ? 6 : 0; s += tapMarks('ears', [[-26, -16 + elow, 12], [26, -16 + elow, 12]]); }
    return { svg: s, pts: pts };
  }

  // ----- chapter 6, what Riffle holds: three plain brown pebbles (`holds: 'pebbles'`), cupped in both
  // forepaws in front of his chest, or (`holdAt: 'paws'`) set down neatly in a row on the ground in
  // front of his feet; and (`holds: 'string'`) the reed string of three fish hanging from one forepaw.
  // `juggle` keeps its own three in the air and holds nothing else.
  function handOf(P, side) {
    var h = null;
    (P[side] || []).forEach(function (L) { if (L.paw && (L.pk === 'hand' || L.pk === 'cup' || L.pk === 'point')) h = L; });
    return h;
  }
  function setHand(L, q) { L.paw = q; L.pk = 'hand'; if (L.leg) L.leg = [L.leg[0], [q[0], q[1], L.leg[1][2]]]; }
  function otterHold(P, o) {
    var near = handOf(P, 'near'), far = handOf(P, 'far');
    if (o.holds === 'pebbles') {
      if (o.holdAt === 'paws') {
        var fx = -1e9, gy = P.water != null ? P.water : 0;
        (P.near || []).concat(P.far || []).forEach(function (L) { if (L.paw && L.pk === 'foot' && L.paw[0] > fx) fx = L.paw[0]; });
        if (fx < -1e8) fx = 20;
        return { what: 'pebbles', at: 'ground', list: [[fx + 25, gy - 8.6, 8.6], [fx + 43, gy - 8, 8], [fx + 60, gy - 8.4, 8.4]] };
      }
      var h = near || far;
      if (!h) return null;
      var c = [h.paw[0] + 4, h.paw[1] - 2];
      if (near) setHand(near, [c[0] + 7, c[1] + 3]);
      if (far) setHand(far, [c[0] - 6, c[1] + 1]);
      return { what: 'pebbles', at: 'paws', list: [[c[0] - 5, c[1] - 6, 7.6], [c[0] + 8.4, c[1] - 5, 7.4], [c[0] + 1.8, c[1] - 16.6, 7.4]] };
    }
    var hs = near || far;
    if (!hs) return null;
    // his arm let down at his side to carry it (no wave: that paw is busy)
    if (hs.leg && hs.leg[0][1] < -60) { setHand(hs, [hs.leg[0][0] + 14, hs.leg[0][1] + 52]); hs.wave = false; }
    return { what: 'string', at: 'paws', from: hs.paw.slice(), hand: hs };
  }
  // a plain round brown pebble (the fifth's colours: chapter 3's, plain, never Sprinkle's grey)
  function plainPebble(x, y, r, bk) {
    return '<circle class="pc-pebble pc-plain" cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r) + '" fill="#93704F" stroke="#5D4331" stroke-width="' + N(1.8 * bk) + '"/>' +
      '<ellipse cx="' + N(x - r * 0.35) + '" cy="' + N(y - r * 0.35) + '" rx="' + N(r * 0.36) + '" ry="' + N(r * 0.22) + '" transform="rotate(-30 ' + N(x - r * 0.35) + ' ' + N(y - r * 0.35) + ')" fill="#C8A27D" opacity=".8"/>';
  }
  // the string of fish, hanging from (0, 0): the pile set's PC.art.prey.string, looked up when drawn,
  // else our own (the same fish, the same reed loop over their tails: nothing goes through a fish)
  function fishString(count, len) {
    var fn = art.prey && typeof art.prey.string === 'function' ? art.prey.string : null, svg = '';
    if (fn) { try { svg = fn({ count: count, len: len }); } catch (e) { svg = ''; } }
    if (typeof svg === 'string' && svg) return svg;
    var body = '', rx = len * (0.07 + count * 0.022), ly = len * 0.13, lw = Math.max(1.5, len * 0.045);
    for (var i = 0; i < count; i++) {
      var ang = 90 + (i - (count - 1) / 2) * 13, a = ang * Math.PI / 180;
      body += preyHeld('fish', Math.cos(a) * len * 0.44, Math.sin(a) * len * 0.44, len, ang, 'right', 'pc-fish');
    }
    return '<g data-part="fish-string" data-fish-count="' + count + '"><path d="M' + N(-rx) + ',' + N(ly) + 'A' + N(rx) + ' ' + N(len * 0.06) + ' 0 0 1 ' + N(rx) + ',' + N(ly) + '" fill="none" stroke="#70824E" stroke-width="' + N(lw) + '"/>' + body +
      '<path d="M' + N(-rx) + ',' + N(ly) + 'A' + N(rx) + ' ' + N(len * 0.06) + ' 0 0 0 ' + N(rx) + ',' + N(ly) + '" fill="none" stroke="#9BAC66" stroke-width="' + N(lw) + '" stroke-linecap="round"/></g>';
  }

  function buildBeast(sp, o) {
    var dog = sp.kind === 'dog';
    var list = dog ? DOG_POSES : OTTER_POSES, pose = list.indexOf(o.pose) >= 0 ? o.pose : 'sit';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), p = sp.pal;
    var P = (dog ? DOG_POSE : OTTER_POSE)[pose](sp, mood, o);
    var held6 = !dog && (o.holds === 'pebbles' || o.holds === 'string') && pose !== 'juggle' ? otterHold(P, o) : null;
    var sc0 = sp.scale, bk = 0.95 / sc0, lk = 0.95 / (sc0 * sp.headS);
    var sx = -2.4 * F * bk, sy = -3.6 * bk, fl = !!sp.shaggy, scared = mood === 'scared';
    var bulk = sp.bulk, lw = Math.sqrt(bulk) * sp.legW;
    var pts = [], body = '';
    function addPts(a) { pts = pts.concat(a); }
    function outline(g) { return fl ? scallop(g.pts, 0.64) : scared && !fl ? spiky(g.pts, 4) : g.d; }

    // ----- the trunk
    var trunk = '', inner = '', neckSvg = '';
    if (P.body) {
      var B = P.body, wfb = bodyW([B.w[0] * bulk, B.w[1] * bulk, B.w[2] * Math.sqrt(bulk)], B.tm);
      var cap = capsule(B.P, wfb, 14), bs = B.bellyUp ? -1 : 1;
      // the lighter belly, and the cream throat and chest
      var band = function (f, col, op) {
        var outer = [], inn = [];
        for (var i = 0; i <= 14; i++) {
          var t = i / 14, a = cap.at(t), fr = f(t);
          outer.push(add(a.p, a.n, bs * (a.w + 6)));
          inn.push(add(a.p, a.n, bs * a.w * (1 - 2 * fr)));
        }
        return '<path d="M' + pt(outer[0]) + cr(outer) + 'L' + pt(inn[14]) + cr(inn.slice().reverse()) + 'Z" fill="' + col + '"' + (op ? ' opacity="' + op + '"' : '') + '/>';
      };
      inner += band(function () { return 0.36; }, p.light, 0.45);
      inner += band(function (t) { return t < 0.4 ? 0 : 0.55 * ss((t - 0.4) / 0.45); }, p.belly);
      var rim = [];
      for (var ri = 2; ri <= 12; ri++) { var ra = cap.at(ri / 14); rim.push(add(ra.p, ra.n, -bs * (ra.w - 4.5))); }
      if (!B.bellyUp) inner += '<path d="M' + pt(rim[0]) + cr(rim) + '" stroke="' + p.light + '" stroke-width="' + N(4 * bk) + '" fill="none" stroke-linecap="round" opacity=".55"/>';
      trunk = R.part(scared ? spiky(cap.pts, 4.2) : cap.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx, sy: sy, inner: inner, lw: N(2.4 * bk) });
      addPts(cap.pts);
    } else {
      var hip = P.torso[0], chest = P.torso[1];
      var gr = function (c) { var r = c[2] * bulk; return [c[0], c[1] + c[2] - r, r]; };
      hip = gr(hip); chest = gr(chest);
      var tg = hull2(hip, chest, fl ? 14 : 10);
      if (sp.spots) {
        [[0.15, -0.5, 0.5, 1], [0.4, 0.35, 0.42, 2], [0.68, -0.4, 0.36, 3], [0.9, 0.2, 0.3, 4], [-0.1, 0.4, 0.32, 5], [0.55, -0.05, 0.22, 6]].forEach(function (q) {
          var c = lerp2(hip, chest, q[0]), r = lerp(hip[2], chest[2], clamp(q[0], 0, 1));
          inner += '<path d="' + blob(c[0], c[1] + q[1] * r, r * q[2], q[3]) + '" fill="' + p.spot + '"/>';
        });
      }
      if (sp.shaggy) inner += '<path d="' + ellipseG(hip[0] + 6, hip[1] - hip[2] * 0.35, hip[2] * 1.5, hip[2] * 0.95, -6).d + '" fill="' + p.saddle + '"/>';
      if (sp.tiny) inner += '<path d="' + ellipseG(chest[0] + chest[2] * 0.45, chest[1] + chest[2] * 0.35, chest[2] * 0.62, chest[2] * 0.85, -20).d + '" fill="' + p.belly + '"/>';
      if (!fl) inner += '<path d="M' + pt([hip[0] + 2, hip[1] - hip[2] + 4.5]) + 'L' + pt([chest[0] - 4, chest[1] - chest[2] + 4.5]) + '" stroke="' + p.light + '" stroke-width="' + N(4 * bk) + '" stroke-linecap="round" opacity=".5"/>';
      trunk = R.part(outline(tg), { fill: p.base, dark: p.shade, line: p.line, sx: sx, sy: sy, inner: inner, lw: N(2.4 * bk) });
      addPts(tg.pts);
      if (P.haunch) {
        var hg = ellipseG(P.haunch[0], P.haunch[1], P.haunch[2] * Math.sqrt(bulk), P.haunch[3] * Math.sqrt(bulk), P.haunch[4], 9);
        trunk += R.part(fl ? scallop(hg.pts, 0.62) : hg.d, { fill: p.base, dark: p.shade, line: mix(p.line, p.base, 0.3), lw: N(2.1 * bk), sx: sx * 0.7, sy: sy * 0.7,
          inner: sp.shaggy ? '<path d="' + ellipseG(P.haunch[0] - 4, P.haunch[1] - 8, P.haunch[2], P.haunch[3] * 0.8, 0).d + '" fill="' + p.saddle + '"/>' : sp.spots ? '<path d="' + blob(P.haunch[0] + 2, P.haunch[1] - 4, P.haunch[3] * 0.45, 7) + '" fill="' + p.spot + '"/>' : '' });
        addPts(hg.pts);
      }
      var nk0 = [P.neck[0][0], P.neck[0][1], P.neck[0][2] * bulk], nk1 = [P.neck[1][0], P.neck[1][1], P.neck[1][2] * Math.sqrt(bulk)];
      var ng = hull2(nk0, nk1, 8);
      neckSvg = R.part(fl ? scallop(ng.pts, 0.6) : ng.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, lw: N(2.3 * bk) });
      addPts(ng.pts);
    }

    // ----- legs and paws
    function legPart(L, far) {
      var top = [L.leg[0][0], L.leg[0][1], L.leg[0][2] * lw], bot = [L.leg[1][0], L.leg[1][1], L.leg[1][2] * lw];
      var g = hull2(top, bot, 8), inn = '';
      if (sp.spots && !far) inn += '<path d="' + blob(lerp(top[0], bot[0], 0.45), lerp(top[1], bot[1], 0.45), top[2] * 0.7, top[0] + 3) + '" fill="' + p.spot + '"/>';
      if (sp.shaggy && L.leg[0][0] < 0) inn += '<path d="' + ellipseG(top[0], top[1], top[2] * 1.8, top[2] * 2.4, 0).d + '" fill="' + p.saddle + '"/>';
      addPts([[top[0] - top[2], top[1]], [top[0] + top[2], top[1]], [bot[0] - bot[2], bot[1]], [bot[0] + bot[2], bot[1]]]);
      return R.part(fl ? scallop(g.pts, 0.6) : g.d, { fill: far ? p.farFill : p.base, dark: far ? p.shade2 : p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, inner: inn, lw: N(2.3 * bk) });
    }
    function paw(L, far) {
      var q = L.paw, col = far ? p.farFill : p.base, s = '', k = Math.sqrt(lw), line = ' stroke="' + p.line + '" stroke-width="' + N(2.1 * bk) + '"';
      var rot = L.rot || 0, toe = ' stroke="' + p.line + '" stroke-width="' + N(1.3 * bk) + '" stroke-linecap="round" opacity=".6" fill="none"';
      if (L.pk === 'foot') {
        // a flat webbed hind foot, toes forward
        var fe = ellipseG(q[0], q[1], 17 * k, 7 * k, rot, 6);
        s += '<path d="' + fe.d + '" fill="' + col + '"' + line + '/>' +
          '<path d="M' + pt(add(q, rotP([8 * k, -3], rot))) + 'l' + N(5 * k) + ',2M' + pt(add(q, rotP([9 * k, 1.5], rot))) + 'l' + N(5 * k) + ',1" transform="rotate(0)"' + toe + '/>';
        addPts(fe.pts);
      } else if (L.pk === 'sole') {
        // the sole of a webbed foot, seen from below: four toes fanned, with webbing
        var m = 'translate(' + N(q[0]) + ',' + N(q[1]) + ') rotate(' + rot + ') scale(' + N(k) + ')';
        s += '<g transform="' + m + '"><path d="M-9,10Q-14,-2 -12,-10Q-6,-15 0,-14Q6,-15 12,-10Q14,-2 9,10Q0,15 -9,10Z" fill="' + col + '"' + line + '/>' +
          '<g fill="' + mix(p.line, p.base, 0.35) + '"><ellipse cx="0" cy="3" rx="5" ry="4.2"/><circle cx="-8" cy="-7" r="2.3"/><circle cx="-2.8" cy="-10.5" r="2.3"/><circle cx="2.8" cy="-10.5" r="2.3"/><circle cx="8" cy="-7" r="2.3"/></g></g>';
        addPts([[q[0] - 14, q[1] - 16], [q[0] + 14, q[1] + 14]]);
      } else if (L.pk === 'point') {
        // chapter 5: a fist with one finger out, pointing along L.dir (straight down at the logs)
        var pd = unit(L.dir || [0, 1]), pn = [-pd[1], pd[0]], tip = add(q, pd, 17 * k), pe = ellipseG(q[0], q[1], 7.6 * k, 6.6 * k, 0, 5);
        var fg = hull2([q[0] + pd[0] * 4, q[1] + pd[1] * 4, 3.4 * k], [tip[0], tip[1], 2.5 * k], 4);
        s += '<path d="' + fg.d + '" fill="' + col + '"' + line + '/><path d="' + pe.d + '" fill="' + col + '"' + line + '/>' +
          '<path d="M' + pt(add(add(q, pn, 3.4 * k), pd, 1)) + 'l' + N(pn[0] * 1.6 + pd[0] * 3) + ',' + N(pn[1] * 1.6 + pd[1] * 3) + 'M' + pt(add(add(q, pn, -3.4 * k), pd, 1)) + 'l' + N(-pn[0] * 1.6 + pd[0] * 3) + ',' + N(-pn[1] * 1.6 + pd[1] * 3) + '"' + toe + '/>';
        addPts(pe.pts); addPts(fg.pts);
      } else if (L.pk === 'hand' || L.pk === 'cup') {
        var he = ellipseG(q[0], q[1], 7.4 * k * (L.k || 1), 6.4 * k * (L.k || 1), rot, 5);
        s += '<path d="' + he.d + '" fill="' + col + '"' + line + '/>';
        if (L.pk === 'cup') s += '<path d="M' + N(q[0] - 3) + ',' + N(q[1] - 7) + 'q-5,7 0,13" stroke="' + p.line + '" stroke-width="' + N(1.6 * bk) + '" fill="none" stroke-linecap="round"/>';
        else s += '<path d="M' + N(q[0] + 2) + ',' + N(q[1] - 4) + 'l2,-2M' + N(q[0] + 4) + ',' + N(q[1]) + 'l3,-1"' + toe + '/>';
        addPts(he.pts);
      } else {
        // dog paws (the shaggy dog's are mops)
        var de = ellipseG(q[0] + (L.up ? 0 : 1), q[1], (L.up ? 7 : 10) * k, (L.up ? 9 : 6.2) * k, L.up ? -20 : 0, 6);
        s += '<path d="' + (fl ? scallop(de.pts, 0.6) : de.d) + '" fill="' + col + '"' + line + '/>';
        if (!far && !fl && !L.up) s += '<path d="M' + N(q[0] + 3) + ',' + N(q[1] + 1) + 'v3.4M' + N(q[0] + 7) + ',' + N(q[1]) + 'v3.4"' + toe + '/>';
        addPts(de.pts);
      }
      if (L.wave) {
        s += '<path d="M' + N(q[0] + 12) + ',' + N(q[1] - 14) + 'q6,6 0,14M' + N(q[0] + 18) + ',' + N(q[1] - 18) + 'q9,10 0,22M' + N(q[0] - 12) + ',' + N(q[1] - 14) + 'q-6,6 0,14" stroke="' + p.line + '" stroke-width="' + N(1.8 * bk) + '" fill="none" stroke-linecap="round" opacity=".55"/>';
        addPts([[q[0] + 22, q[1] - 20], [q[0] - 16, q[1] - 16]]);
      }
      return s;
    }
    function limb(L, far) {
      var s = '';
      if (L.thigh) {
        var tg2 = ellipseG(L.thigh[0], L.thigh[1], L.thigh[2] * Math.sqrt(bulk), L.thigh[3] * Math.sqrt(bulk), L.thigh[4], 9);
        s += R.part(fl ? scallop(tg2.pts, 0.62) : tg2.d, { fill: p.base, dark: p.shade, line: mix(p.line, p.base, 0.3), lw: N(2.1 * bk), sx: sx * 0.7, sy: sy * 0.7,
          inner: sp.shaggy ? '<path d="' + ellipseG(L.thigh[0] - 4, L.thigh[1] - 8, L.thigh[2], L.thigh[3] * 0.8, 0).d + '" fill="' + p.saddle + '"/>' : sp.spots ? '<path d="' + blob(L.thigh[0] + 2, L.thigh[1] - 6, L.thigh[3] * 0.4, 8) + '" fill="' + p.spot + '"/>' : '' });
        addPts(tg2.pts);
      }
      if (L.leg) s += legPart(L, far || L.far);
      if (L.paw) s += paw(L, far || L.far);
      return s;
    }

    // ----- the tail
    var TP, tw0, tw1;
    if (P.tail) { TP = P.tail.P; tw0 = P.tail.w[0] * Math.sqrt(bulk); tw1 = P.tail.w[1]; }
    else {
      var droop = scared || mood === 'worried' || mood === 'sleepy' || mood === 'solemn' || mood === 'sad';
      TP = P.tails[droop ? 'down' : 'up']; tw0 = 7 * Math.sqrt(bulk) * (sp.shaggy ? 1.3 : 1); tw1 = 4.4 * (sp.shaggy ? 1.6 : 1);
    }
    // chapter 8, `tailUp: true` (Riffle's thick rudder tail stuck straight up, out of the weeds), on
    // dry land; its tip, with `tap: 'tail'`
    var tailUp = !dog && o.tailUp === true && P.tail && P.water == null;
    if (tailUp) { var tb0 = TP[0]; TP = [tb0, [tb0[0] - 12, tb0[1] - 40], [tb0[0] - 10, tb0[1] - 84], [tb0[0] + 2, tb0[1] - 116]]; tw1 = Math.max(tw1, 7.5); }
    if (sp.tailL && sp.tailL !== 1) {
      var b0 = TP[0];
      TP = TP.map(function (q, i) { return i ? [b0[0] + (q[0] - b0[0]) * sp.tailL, b0[1] + (q[1] - b0[1]) * sp.tailL] : q; });
    }
    var twf = function (t) {
      var w = lerp(tw0, tw1, Math.pow(t, P.tail ? 1.25 : 0.8)) * (scared ? 1.4 : 1);
      if (fl) w *= 1 + 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.1));
      return w;
    };
    var tl = tube(TP, twf, fl ? 11 : 10);
    var tailIn = '';
    if (sp.spots) { var ta = tl.at(0.55); tailIn += '<circle cx="' + N(ta.p[0]) + '" cy="' + N(ta.p[1]) + '" r="' + N(ta.w * 1.6) + '" fill="' + p.spot + '"/>'; }
    if (sp.kind === 'otter') { var tc = []; for (var q = 0; q <= 6; q++) { var tq = tl.at(q / 6); tc.push(add(tq.p, tq.n, -tq.w * 0.45)); } tailIn += '<path d="M' + pt(tc[0]) + cr(tc) + '" stroke="' + p.light + '" stroke-width="' + N(3 * bk) + '" fill="none" stroke-linecap="round" opacity=".45"/>'; }
    var tailSvg = R.part(fl ? scallop(tl.pts, 0.66) : scared ? spiky(tl.pts, 3.4) : tl.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, inner: tailIn, lw: N(2.3 * bk) });
    addPts(tl.pts);
    if (dog && /^(happy|laugh|shout|proud)$/.test(mood) && !P.tail) {
      // a wag
      var tip = tl.at(1), wg = add(tip.p, tip.t, 6);
      tailSvg += '<path d="M' + pt(add(wg, tip.n, 10)) + 'q6,-6 12,0M' + pt(add(wg, tip.n, -10)) + 'q-6,-6 -12,0" stroke="' + p.line + '" stroke-width="' + N(1.8 * bk) + '" fill="none" stroke-linecap="round" opacity=".55"/>';
    }

    // ----- the head
    var hrot = P.head[2] + (dog ? (DOG_ROT[mood] != null ? DOG_ROT[mood] : (HEAD_ROT[mood] || 0) * 0.6) : (HEAD_ROT[mood] || 0));
    var hpos = [P.head[0] + (mood === 'sniff' ? 4 : 0), P.head[1] + (mood === 'proud' || mood === 'solemn' ? -2 : 0)];
    var hm = mul(mT(hpos[0], hpos[1]), mul(mR(hrot), mS(sp.headS)));
    var flop = P.air ? 150 : P.howl ? 2 : null;
    var trail = P.water != null && sp.whiskers === 'trail' ? Math.max(20, (P.water - hpos[1]) / sp.headS + 2) : 38;
    var bctx = { F: F, sx: sx, look: [1.2, P.howl ? -1 : 0], flop: flop, howl: P.howl, trail: trail };
    // chapter 5's poses: where the eyes go (the sky), the pose's own mouth, eyes rolled up
    if (P.look) bctx.look = [1.2 * P.look[0], P.look[1]];
    if (P.mouth) bctx.mouth = P.mouth;
    if (P.roll && !o.squeeze) bctx.roll = true;
    if (P.puff) bctx.puff = true;
    if (!dog && o.tap === 'cheeks') bctx.tapCheeks = true;
    if (!dog && o.tap === 'ears') bctx.tapEars = true;
    if (dog && o.asleep) bctx.asleep = true;
    if (o.squeeze) bctx.squeeze = true;
    if (o.tear) bctx.tear = true;
    if (o.mist) bctx.mist = true;
    var hd = beastHead(R, sp, mood, bctx, lk);
    // chapter 3, `holds: 'fish' | 'fish2'`: one fish, or two, crosswise in an otter's mouth (Riffle's catch)
    var fishHeld = !dog && (o.holds === 'fish' || o.holds === 'fish2') ? o.holds : null;
    if (fishHeld) {
      hd.svg += fishHeld === 'fish2' ? preyHeld('fish', -4, 13, 80, -9, 'right', 'pc-fish') + preyHeld('fish', 8, 28, 80, 7, 'right', 'pc-fish') : preyHeld('fish', 4, 18, 86, -5, 'right', 'pc-fish');
      hd.pts.push([-44, 0], [50, 0], [-44, 40], [50, 40]);
    }
    var headSvg = '<g transform="' + mStr(hm) + '">' + hd.svg + '</g>';
    var headPts = hd.pts.map(function (q2) { return apply(hm, q2); });
    addPts(headPts);

    // ----- chapter 5, `holds: 'pole'` (Riffle's raft pole, twice his size): a long peeled pole, a
    // few knots, drawn between his body and his arms. It runs out of his box (the fit and the boxes
    // are his own), and the result says where it is (`pole`) and where he grips it (`held`).
    // `tap: 'pole'`: marked where his paws are on it (class pc-tap pc-tap-pole: the climber's Tap).
    var poleSvg = '';
    if (P.pole) {
      var pa = P.pole.a, pb = P.pole.b, pd = unit([pb[0] - pa[0], pb[1] - pa[1]]), pn = [-pd[1], pd[0]], plen = dist(pa, pb);
      var pg = hull2([pa[0], pa[1], 5.6], [pb[0], pb[1], 4.6], 14), knots = '';
      [0.16, 0.37, 0.61, 0.83].forEach(function (t, i) {
        var kq = add(pa, pd, plen * t);
        knots += '<path d="M' + pt(add(kq, pn, -5.2)) + 'Q' + pt(add(kq, pd, i % 2 ? 3 : -3)) + ' ' + pt(add(kq, pn, 5.2)) + '" stroke="#8a6436" stroke-width="' + N(1.5 * bk) + '" fill="none" opacity=".7"/>';
      });
      poleSvg = '<g class="pc-pole">' + R.part(pg.d, { fill: '#cba469', dark: '#a8804a', line: '#6b4a26', sx: -2.2 * F, sy: 0, lw: N(2.2 * bk),
        inner: '<path d="M' + pt(add(pa, pn, F * 2.2)) + 'L' + pt(add(pb, pn, F * 1.8)) + '" stroke="#e6c995" stroke-width="2.4" opacity=".6"/>' + knots }) + '</g>';
      if (o.tap === 'pole') { var tq = add(P.pole.grip, pd, 8); poleSvg += tapMark('pole', tq[0], tq[1], 26); }
    }

    // ----- assemble back to front
    if (!P.tailFront) body += tailSvg;
    (P.far || []).forEach(function (L) { body += limb(L, true); });
    body += neckSvg + trunk + poleSvg;
    (P.near || []).forEach(function (L) { if (!L.afterHead && !L.afterTail) body += limb(L, false); });
    if (P.tailFront) body += tailSvg;
    (P.near || []).forEach(function (L) { if (L.afterTail) body += limb(L, false); });
    body += headSvg;
    (P.near || []).forEach(function (L) { if (L.afterHead) body += limb(L, false); });

    // ----- water, pebbles, mud, sound
    var over = '';
    if (P.water != null) {
      var cid = R.id();
      R.defs += '<clipPath id="' + cid + '"><rect x="-2000" y="-2000" width="4000" height="' + N(2000 + P.water) + '"/></clipPath>';
      body = '<g clip-path="url(#' + cid + ')">' + body + '</g>';
      pts = pts.filter(function (q3) { return q3[1] <= P.water + 0.5; });
      var rp = '';
      (P.ripples || []).forEach(function (rr) {
        rp += 'M' + N(rr[0] - rr[1]) + ',' + N(P.water) + 'Q' + N(rr[0]) + ',' + N(P.water + 9) + ' ' + N(rr[0] + rr[1]) + ',' + N(P.water);
        rp += 'M' + N(rr[0] - rr[1] * 0.7) + ',' + N(P.water - 1) + 'Q' + N(rr[0]) + ',' + N(P.water - 6) + ' ' + N(rr[0] + rr[1] * 0.7) + ',' + N(P.water - 1);
        addPts([[rr[0] - rr[1], P.water], [rr[0] + rr[1], P.water]]);
      });
      if (sp.whiskers === 'trail' && pose === 'swim') {
        var wt = apply(hm, [0, trail + 4]);
        rp += 'M' + N(wt[0] - 52) + ',' + N(P.water - 1) + 'q10,-5 20,0M' + N(wt[0] + 32) + ',' + N(P.water - 1) + 'q10,-5 20,0';
      }
      over += '<path d="' + rp + '" stroke="#ffffff" stroke-width="' + N(3 * bk) + '" fill="none" stroke-linecap="round" opacity=".75"/>';
    }
    (P.arcs || []).forEach(function (a) {
      var m2 = lerp2(a[0], a[1], 0.5);
      over += '<path d="M' + pt(a[0]) + 'Q' + pt([m2[0], Math.min(a[0][1], a[1][1]) - 16]) + ' ' + pt(a[1]) + '" stroke="' + p.line + '" stroke-width="' + N(1.6 * bk) + '" stroke-dasharray="' + N(3 * bk) + ' ' + N(5 * bk) + '" fill="none" stroke-linecap="round" opacity=".45"/>';
    });
    (P.pebbles || []).forEach(function (pb, i) { over += pebble(pb[0], pb[1], pb[2], i * 3 + 1, bk, pb[3]); addPts([[pb[0] - pb[2] * 1.4, pb[1] - pb[2] * 1.2], [pb[0] + pb[2] * 1.4, pb[1] + pb[2] * 1.2]]); });
    if (P.fifth) {
      // the fifth: plain, round and brown (the colours of the BONK pebble in scenes.js), in his paw
      var f5 = P.fifth;
      over += '<circle class="pc-pebble pc-fifth" cx="' + N(f5[0]) + '" cy="' + N(f5[1]) + '" r="' + N(f5[2]) + '" fill="#93704F" stroke="#5D4331" stroke-width="' + N(1.8 * bk) + '"/>' +
        '<ellipse cx="' + N(f5[0] - f5[2] * 0.35) + '" cy="' + N(f5[1] - f5[2] * 0.35) + '" rx="' + N(f5[2] * 0.36) + '" ry="' + N(f5[2] * 0.22) + '" transform="rotate(-30 ' + N(f5[0] - f5[2] * 0.35) + ' ' + N(f5[1] - f5[2] * 0.35) + ')" fill="#C8A27D" opacity=".8"/>';
      addPts([[f5[0] - f5[2] * 1.3, f5[1] - f5[2] * 1.3], [f5[0] + f5[2] * 1.3, f5[1] + f5[2] * 1.3]]);
    }
    (P.drops || []).forEach(function (pb, i) {
      over += pebble(pb[0], pb[1], pb[2], i * 3 + 1, bk) + '<path d="M' + N(pb[0] - 2) + ',' + N(pb[1] - pb[2] - 4) + 'v-8M' + N(pb[0] + 4) + ',' + N(pb[1] - pb[2] - 3) + 'v-6" stroke="' + p.line + '" stroke-width="' + N(1.5 * bk) + '" stroke-linecap="round" opacity=".5"/>';
      addPts([[pb[0] - pb[2] * 1.4, pb[1] - pb[2] - 14], [pb[0] + pb[2] * 1.4, pb[1] + pb[2] * 1.2]]);
    });
    if (P.drops) over += '<path d="M106,0q12,-7 24,0M136,0q8,-5 16,0" stroke="#ffffff" stroke-width="' + N(2.6 * bk) + '" fill="none" stroke-linecap="round" opacity=".8"/>';
    // chapter 6: his three plain pebbles (in his paws, or in a row at his feet), or the fish string
    // (hanging from his forepaw, which is drawn again over the reed knot); and `tap: 'pebbles'`
    var heldAt6 = null;
    if (held6 && held6.what === 'pebbles') {
      var pc6 = [0, 0];
      held6.list.forEach(function (q) { over += plainPebble(q[0], q[1], q[2], bk); addPts([[q[0] - q[2] - 1.5, q[1] - q[2] - 1.5], [q[0] + q[2] + 1.5, q[1] + q[2] + 1.5]]); pc6 = [pc6[0] + q[0] / 3, pc6[1] + q[1] / 3]; });
      heldAt6 = { c: pc6, r: held6.at === 'ground' ? 30 : 16 };
      if (o.tap === 'pebbles') over += tapMark('pebbles', pc6[0], pc6[1], heldAt6.r + 4);
    } else if (held6 && held6.what === 'string') {
      var hf = held6.from, top6 = P.water != null ? P.water : 0, len6 = clamp((top6 - 6 - (hf[1] + 3)) / 0.96, 26, 72);
      over += '<g class="pc-string" transform="translate(' + N(hf[0]) + ',' + N(hf[1] + 3) + ')">' + fishString(3, len6) + '</g>' + paw(held6.hand, false);
      addPts([[hf[0] - len6 * 0.32, hf[1]], [hf[0] + len6 * 0.32, hf[1] + 3 + len6 * 0.96]]);
      heldAt6 = { c: [hf[0], hf[1] + 3 + len6 * 0.55], r: len6 * 0.5 };
      // chapter 7, `tap: 'fish'` (the toss Tap): the string marked for the page, its box, unpainted
      if (o.tap === 'fish') over += '<g class="pc-tap pc-tap-fish"><rect x="' + N(hf[0] - len6 * 0.36) + '" y="' + N(hf[1] - 2) + '" width="' + N(len6 * 0.72) + '" height="' + N(len6 * 0.96 + 9) + '" fill="none"/></g>';
    }
    // chapter 8, Riffle's `tap: 'paw'` (his near forepaw: the pull-through Tap, in `scramble`) and `tap: 'tail'` (its tip)
    if (!dog && o.tap === 'paw') { var th8 = handOf(P, 'near') || handOf(P, 'far'); if (th8) over += tapMark('paw', th8.paw[0], th8.paw[1], 13 * Math.sqrt(lw)); }
    if (!dog && o.tap === 'tail') { var tt8 = tl.at(1), tq8 = add(tt8.p, tt8.t, -tt8.w * 0.5); over += tapMark('tail', tq8[0], tq8[1], 15); }
    (P.mud || []).forEach(function (md, i) {
      over += '<path d="' + blob(md[0], md[1], md[2], i + 2) + '" fill="#7a5638" stroke="#4e3420" stroke-width="' + N(1.2 * bk) + '"/>';
      addPts([[md[0] - md[2], md[1] - md[2]], [md[0] + md[2], md[1] + md[2]]]);
    });
    if (P.speed && !P.speedAt) over += '<path d="M-150,-44h-26M-140,-56h-18M-156,-32h-14" stroke="' + p.line + '" stroke-width="' + N(2 * bk) + '" stroke-linecap="round" opacity=".4"/>';
    if (P.speedAt) {
      // the dive's swoosh: short lines streaming up and back from the leap
      var sa = P.speedAt;
      over += '<path d="M' + N(sa[0]) + ',' + N(sa[1]) + 'l-30,-34M' + N(sa[0] + 18) + ',' + N(sa[1] - 6) + 'l-22,-26M' + N(sa[0] - 12) + ',' + N(sa[1] + 14) + 'l-20,-24" stroke="' + p.line + '" stroke-width="' + N(2 * bk) + '" stroke-linecap="round" opacity=".4"/>';
      addPts([[sa[0] - 32, sa[1] - 40]]);
    }
    if (P.splash) {
      // where the dive meets the river: a ring of water flung up, drops in the air
      var sp0 = P.splash, sr = '';
      [[-34, -26, 7], [-18, -40, 6], [0, -46, 7.5], [18, -40, 6], [34, -26, 7], [-48, -10, 5], [48, -10, 5]].forEach(function (d) {
        sr += '<path d="M' + N(sp0[0] + d[0]) + ',' + N(sp0[1] + d[1] - d[2]) + 'q' + N(d[2] * 0.8) + ',' + N(d[2]) + ' 0,' + N(d[2] * 1.7) + 'q' + N(-d[2] * 0.8) + ',' + N(-d[2] * 0.6) + ' 0,' + N(-d[2] * 1.7) + 'Z"/>';
      });
      over += '<path d="M' + N(sp0[0] - 54) + ',' + N(sp0[1] - 2) + 'Q' + N(sp0[0]) + ',' + N(sp0[1] - 30) + ' ' + N(sp0[0] + 54) + ',' + N(sp0[1] - 2) + 'Q' + N(sp0[0]) + ',' + N(sp0[1] - 12) + ' ' + N(sp0[0] - 54) + ',' + N(sp0[1] - 2) + 'Z" fill="#d8eef8" stroke="#6aa6c8" stroke-width="' + N(2 * bk) + '" stroke-linejoin="round"/>' +
        '<g fill="#e6f5fc" stroke="#6aa6c8" stroke-width="' + N(1.6 * bk) + '">' + sr + '</g>';
      addPts([[sp0[0] - 56, sp0[1] - 56], [sp0[0] + 56, sp0[1]]]);
    }
    if (P.air) {
      over += '<path d="M-44,-26q10,8 20,0M-10,-20q10,8 20,0M24,-26q10,8 20,0" stroke="' + p.line + '" stroke-width="' + N(2.2 * bk) + '" fill="none" stroke-linecap="round" opacity=".45"/>';
      addPts([[-46, -16], [46, -16]]);
    }
    // chapter 5's marks. Two notes drifting up from a whistle:
    if (P.notes) {
      [[42, 4, 1, -8], [60, -20, 0.82, 10]].forEach(function (nt) {
        var c = apply(hm, [nt[0], nt[1]]), kn = nt[2] * sp.headS;
        over += '<g class="pc-note" transform="translate(' + N(c[0]) + ',' + N(c[1]) + ') rotate(' + nt[3] + ') scale(' + N(kn) + ')" opacity=".72">' +
          '<ellipse cx="0" cy="0" rx="4.4" ry="3.3" transform="rotate(-22)" fill="' + p.line + '"/><path d="M4,-1V-15Q9,-13.4 10,-8.6" stroke="' + p.line + '" stroke-width="1.9" fill="none" stroke-linecap="round"/></g>';
        addPts([[c[0] - 6 * kn, c[1] - 17 * kn], [c[0] + 12 * kn, c[1] + 5 * kn]]);
      });
    }
    // the ring of a somersault: most of a circle round him, an arrowhead at its leading end
    if (P.spin) {
      var sq = P.spin, a0 = -200 * Math.PI / 180, a1 = 60 * Math.PI / 180, e0 = [sq[0] + Math.cos(a0) * sq[2], sq[1] + Math.sin(a0) * sq[2]], e1 = [sq[0] + Math.cos(a1) * sq[2], sq[1] + Math.sin(a1) * sq[2]];
      var et = [-Math.sin(a1), Math.cos(a1)], en = [Math.cos(a1), Math.sin(a1)];
      over += '<g class="pc-spin" stroke="' + p.line + '" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".42">' +
        '<path d="M' + pt(e0) + 'A' + N(sq[2]) + ' ' + N(sq[2]) + ' 0 1 1 ' + pt(e1) + '" stroke-width="' + N(2.4 * bk) + '" stroke-dasharray="' + N(15 * bk) + ' ' + N(9 * bk) + '"/>' +
        '<path d="M' + pt(add(add(e1, et, -13), en, -9)) + 'L' + pt(e1) + 'L' + pt(add(add(e1, et, -13), en, 9)) + '" stroke-width="' + N(2.6 * bk) + '"/></g>';
      addPts([[sq[0] - sq[2], sq[1] - sq[2]], [sq[0] + sq[2], sq[1] + sq[2] * 0.9]]);
    }
    // a hop: the little marks on the ground where he was
    if (P.hopMarks) {
      over += '<path d="M-12,-3q10,-7 20,0M22,-3q8,-6 16,0M-24,-7l-8,-6M52,-7l8,-6" stroke="' + p.line + '" stroke-width="' + N(2.2 * bk) + '" fill="none" stroke-linecap="round" opacity=".45"/>';
      addPts([[-34, -1], [62, -1]]);
    }
    // a thud (falling over backwards) and a smack (a tail slapped down): short lines flying up from where it landed
    (P.thud || []).forEach(function (th) {
      over += '<path d="M' + N(th[0] - 16) + ',' + N(th[1]) + 'l-9,-7M' + N(th[0]) + ',' + N(th[1] - 3) + 'l0,-10M' + N(th[0] + 16) + ',' + N(th[1]) + 'l9,-7" stroke="' + p.line + '" stroke-width="' + N(2 * bk) + '" fill="none" stroke-linecap="round" opacity=".4"/>';
    });
    if (P.smack) {
      var sk = P.smack;
      over += '<g class="pc-smack" stroke="' + p.line + '" fill="none" stroke-linecap="round" opacity=".5"><path d="M' + N(sk[0] - 12) + ',' + N(sk[1] - 12) + 'l-13,-12M' + N(sk[0] - 22) + ',' + N(sk[1] - 2) + 'l-17,-2M' + N(sk[0] + 6) + ',' + N(sk[1] - 20) + 'l3,-15M' + N(sk[0] + 22) + ',' + N(sk[1] - 12) + 'l11,-10" stroke-width="' + N(2.4 * bk) + '"/>' +
        '<path d="M' + N(sk[0] - 30) + ',' + N(sk[1]) + 'q14,-9 28,0M' + N(sk[0] + 4) + ',' + N(sk[1]) + 'q12,-8 24,0" stroke-width="' + N(2 * bk) + '"/></g>';
      addPts([[sk[0] - 42, sk[1] - 26], [sk[0] + 34, sk[1] - 36]]);
    }
    if (P.howl) {
      var mt = apply(hm, [0, -46]);
      over += '<path d="M' + N(mt[0] - 14) + ',' + N(mt[1]) + 'q-6,-8 0,-16t0,-16M' + N(mt[0]) + ',' + N(mt[1] - 6) + 'q-6,-8 0,-16t0,-16M' + N(mt[0] + 14) + ',' + N(mt[1]) + 'q-6,-8 0,-16t0,-16" stroke="' + p.line + '" stroke-width="' + N(2 * bk) + '" fill="none" stroke-linecap="round" opacity=".5"/>';
      addPts([[mt[0] - 22, mt[1] - 40], [mt[0] + 20, mt[1]]]);
    }

    // ----- fit into the box: the feet (or the waterline) centred at the bottom
    var Wb = sp.box[0], Hb = sp.box[1], g0 = 3, tilt = P.tilt || 0;
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    // a tilted pose (sliding nose-down the bank) turns about its feet
    (tilt ? pts.map(function (q8) { return rotP(q8, tilt); }) : pts).forEach(function (q4) { x0 = Math.min(x0, q4[0]); x1 = Math.max(x1, q4[0]); y0 = Math.min(y0, q4[1]); y1 = Math.max(y1, q4[1]); });
    // rest the lowest point on the ground line (puffed-up fur, a fat tail), never below it
    var lift = P.water == null && y1 > 0 ? y1 : 0;
    y0 -= lift; y1 -= lift;
    var mg = 4 / sc0, sc = sc0;
    sc = Math.min(sc, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (Math.max(0, y1) - (y0 - mg)));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mul(mS(sc), mul(mT(0, -lift), mR(tilt)))));
    var hc = apply(M, apply(hm, [0, -2]));
    var earsAt = (dog ? [[-26, -26], [26, -26]] : [[-26, -18], [26, -18]]).map(function (e) { return apply(M, apply(hm, e)); });
    return {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + over + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q5) { return apply(M, P.water != null ? [q5[0], Math.min(q5[1], P.water)] : q5); })),
      bounds: boxOf(pts.map(function (q6) { return apply(M, q6); })),
      _marks: { M: M, scale: sc, ears: earsAt, paws: (P.far || []).concat(P.near || []).filter(function (L) { return L.paw; }).map(function (L) { return apply(M, L.paw); }) },
      held: fishHeld ? (function () { var c = apply(M, apply(hm, [0, 18])); return { what: fishHeld, at: 'mouth', x: Math.round(c[0] * 10) / 10, y: Math.round(c[1] * 10) / 10, r: Math.round(36 * sp.headS * sc * 10) / 10 }; })()
        : P.pole ? (function () { var c = apply(M, P.pole.grip); return { what: 'pole', at: 'paws', x: Math.round(c[0] * 10) / 10, y: Math.round(c[1] * 10) / 10, r: Math.round(8 * sc * 10) / 10 }; })()
        : heldAt6 ? (function () { var c = apply(M, heldAt6.c); return { what: held6.what, at: held6.at, x: Math.round(c[0] * 10) / 10, y: Math.round(c[1] * 10) / 10, r: Math.round(heldAt6.r * sc * 10) / 10 }; })() : undefined,
      // the pole's line in his box, its foot first (it runs on above the box): for a set that must keep off it
      pole: P.pole ? (function () { var a = apply(M, P.pole.a), b = apply(M, P.pole.b); return { x0: Math.round(a[0] * 10) / 10, y0: Math.round(a[1] * 10) / 10, x1: Math.round(b[0] * 10) / 10, y1: Math.round(b[1] * 10) / 10, w: Math.round(11 * sc * 10) / 10 }; })() : undefined
    };
  }

  // ------------------------------------------------------------------ Sprinkle (chapter 3)
  // A Mistscale dragonet about a heron's size: sitting, her head is well above Tallyheart's (her
  // box is 640 x 340 in the cats' units; sitting she stands about 290 tall, a sitting Tallyheart
  // about 175). A long neck and a tail that goes on and on; mist-grey scales in soft ridges along her
  // back, matte and pale at the edges (nothing about her shines); a paler belly; big round shining
  // eyes, the same amber eyes as chapter 2's under the bridge; a gentle rounded face with two small
  // soft nubs for horns, never toothy. Five long pale claws on each forepaw, as big as a heron's
  // foot, always easy to count. Two wings of fog-pale skin: the left spreads like a grey sail, the
  // right droops low and only half opens, held close (no wound, no bend, nothing crooked: it is only
  // sore). Drawn facing right, side on, with a frontal face, like the cats; mirrored for facing left
  // with her right wing kept her right (the drooping one), as Tallyheart keeps her torn left ear.
  // Laid out in her own units: the ground at y = 0, her feet about x = 0.

  // chapter 4 appends 'check' (looking herself over, nose to tail), 'tailout' (holding out her tail to
  // be felt) and 'tailup' (her tail lifting from her face: `hide`, a moment later)
  // chapter 5 appends 'lookdown' (looking down at her own enormous feet)
  var SPRINKLE_POSES = ['eyes', 'unfold', 'hide', 'sniff', 'sit', 'wings', 'flat', 'gulp', 'burp', 'pawsup', 'pawup', 'draw', 'touch', 'peek', 'curl', 'lie',
    'check', 'tailout', 'tailup', 'lookdown'];
  OTHER_POSES.sprinkle = SPRINKLE_POSES;
  var DZ_BOX = [640, 340];
  var DZ = { base: '#a8b1b6', line: '#4e585f', light: '#cdd4d7', belly: '#dfe4e1', bellyLine: '#bcc3bf', ridge: '#b9c1c5', ridgeEdge: '#e9edee',
    wing: '#d3dbde', vein: '#9eaab0', wingLine: '#6d7b82', claw: '#f4ecd9', clawLine: '#6f6857', nub: '#d8ddd9', pad: '#c3cacb', mouth: '#5d3844', nostril: '#59636a' };
  DZ.shade = mix(DZ.base, DZ.line, 0.2); DZ.far = mix(DZ.base, DZ.line, 0.13); DZ.farShade = mix(DZ.base, DZ.line, 0.3); DZ.wingFar = mix(DZ.wing, DZ.line, 0.14);
  DZ.feat = mix(DZ.line, '#000', 0.2);

  // A tube along a chain of cubic Beziers (one smooth outline, no seams): necks and long tails.
  // wf(u) gives the half-width at u, the fraction of the length from the base.
  function chainTube(segs, wf, n) {
    n = n || 8;
    var C = [];
    segs.forEach(function (P, si) {
      for (var i = si ? 1 : 0; i <= n; i++) {
        var t = i / n;
        C.push({ p: bez(P, t), t: unit(bezD(P, clamp(t, 0.001, 0.999))) });
      }
    });
    var Lc = [0];
    for (var i = 1; i < C.length; i++) Lc.push(Lc[i - 1] + dist(C[i - 1].p, C[i].p));
    var tot = Lc[Lc.length - 1] || 1, Lp = [], Rp = [];
    C.forEach(function (c, j) { c.u = Lc[j] / tot; c.w = wf(c.u); c.n = [-c.t[1], c.t[0]]; Lp.push(add(c.p, c.n, c.w)); Rp.push(add(c.p, c.n, -c.w)); });
    var e = C[C.length - 1], w1 = e.w;
    var d = 'M' + pt(Lp[0]) + cr(Lp) + 'A' + N(w1) + ' ' + N(w1) + ' 0 0 0 ' + pt(Rp[Rp.length - 1]) + cr(Rp.slice().reverse()) + 'Z';
    var pts = Lp.concat([add(e.p, e.t, w1)], Rp.slice().reverse());
    return { d: d, pts: pts, C: C, at: function (u) {
      u = clamp(u, 0, 1);
      for (var k = 1; k < C.length; k++) if (C[k].u >= u) { var a = C[k - 1], b = C[k], f = (u - a.u) / ((b.u - a.u) || 1); return { p: lerp2(a.p, b.p, f), t: unit(lerp2(a.t, b.t, f)), n: unit(lerp2(a.n, b.n, f)), w: lerp(a.w, b.w, f) }; }
      return { p: e.p, t: e.t, n: e.n, w: e.w };
    } };
  }

  // The soft ridges down her back: rounded plates half hidden behind the outline, pale at the edges.
  // `side(c)` says which side of the tube is her back there (+1 the tube's left normal, -1 the right).
  function ridgeRow(tb, u0, u1, count, kr, side) {
    var s = '';
    for (var i = 0; i < count; i++) {
      var u = lerp(u0, u1, count === 1 ? 0.5 : i / (count - 1)), c = tb.at(u), sg = side(c), r = Math.max(2.4, c.w * kr);
      var q = add(c.p, c.n, sg * c.w * 0.86);
      s += '<circle cx="' + N(q[0]) + '" cy="' + N(q[1]) + '" r="' + N(r) + '"/>';
    }
    return s;
  }
  function ridgesSvg(inner) {
    return '<g fill="' + DZ.ridge + '" stroke="' + DZ.line + '" stroke-width="2" class="pc-ridges">' + inner + '</g>' +
      '<g fill="none" stroke="' + DZ.ridgeEdge + '" stroke-width="2" opacity=".8">' + inner.replace(/ r="([\d.]+)"/g, function (m, r) { return ' r="' + N(Math.max(1, +r - 3)) + '"'; }) + '</g>';
  }
  var UPPER = function (c) { return c.n[1] <= 0 ? 1 : -1; };
  var BACKWARD = function (c) { return c.n[0] <= 0 ? 1 : -1; };

  // One forepaw, as big as a heron's foot: a rounded palm and five long pale claws, fanned so every
  // one can be counted. Local: the wrist at 0,0, the paw reaching along +x; `rot` turns it (-90:
  // raised, claws up). `claws`: 'spread' (all five long), 'one' (one drawing in the mud, the rest
  // curled), 'hold' (curled round something). `pads` shows the paler pads (a raised paw, toward us).
  // Chapter 5: the palette may name the light a counted claw glows with (`glow`, `glow2`,
  // `glowLine`: Wisp's are pale as frost); `tuck` curls the fifth finger in and never lights it (the
  // 9s); `only: 'lit'` returns just the glow and the lit claws (to lay over a see-through paw).
  var DZ_FINGERS = [-60, -30, 0, 30, 60], DZ_FINGERS_REST = [-46, -31, -16, -2, 12];
  function dzPaw(x, y, rot, k, o) {
    o = o || {};
    var far = !!o.far, fill = far ? DZ.far : DZ.base, dark = far ? DZ.farShade : DZ.shade, claws = o.claws || 'spread';
    var glowC = DZ.glow || GLOW, glowC2 = DZ.glow2 || GLOW2, glowL = DZ.glowLine || '#d18b12';
    var m = mul(mT(x, y), mul(mR(rot), mS(k))), C = [16, 0], fan = o.fan || (o.rest ? DZ_FINGERS_REST : DZ_FINGERS);
    var fingers = '', cl = '', clLit = '', glows = '', pads = '', pts = [[-2, 0], [34, 0], [16, -16], [16, 16]], clawAt = [], lit = o.lit || 0;
    fan.forEach(function (a, i) {
      var r = a * Math.PI / 180, dir = [Math.cos(r), Math.sin(r)], nn = [-dir[1], dir[0]];
      var curl = claws === 'hold' || (claws === 'one' && i !== 2) || (o.tuck && i === 4), fc = add(C, dir, curl ? 18 : 23);
      fingers += '<ellipse cx="' + N(fc[0]) + '" cy="' + N(fc[1]) + '" rx="' + (curl ? 8 : 10) + '" ry="6.8" transform="rotate(' + N(a) + ' ' + N(fc[0]) + ' ' + N(fc[1]) + ')"/>';
      if (o.pads) pads += '<circle cx="' + N(fc[0] + dir[0] * 2) + '" cy="' + N(fc[1] + dir[1] * 2) + '" r="3.8"/>';
      // the claw: pale, long and gently curved like a talon, one from each finger's tip (curled ones short)
      var b = add(C, dir, curl ? 25 : 31), len = curl ? 8 : 20, cd = curl ? unit(add(dir, nn, 0.9)) : dir;
      var tip = add(add(b, cd, len), nn, curl ? 0 : 2.6), b0 = add(b, nn, 5.6), b1 = add(b, nn, -5.6), mid = add(lerp2(b, tip, 0.5), nn, curl ? 1 : 1.8);
      // a gentle claw: barely hooked, its tip rounded off
      var t0 = add(tip, nn, 1.3), t1 = add(tip, nn, -1.3);
      var cp = '<path d="M' + pt(add(b0, dir, -3)) + 'Q' + pt(add(mid, nn, 3.2)) + ' ' + pt(t0) + 'Q' + pt(add(tip, cd, 1.8)) + ' ' + pt(t1) + 'Q' + pt(add(mid, nn, -3.2)) + ' ' + pt(add(b1, dir, -3)) + 'Z"/>';
      // a counted claw glows (the Counts pictures: her forepaws held up)
      if (i < lit && !(o.tuck && i === 4)) { clLit += cp; glows += '<circle cx="' + N(mid[0]) + '" cy="' + N(mid[1]) + '" r="15" fill="' + glowC + '" opacity=".55"/>'; } else cl += cp;
      pts.push(tip, add(fc, dir, 10)); clawAt.push(mid);
    });
    var s = glows + '<ellipse cx="' + C[0] + '" cy="' + C[1] + '" rx="18" ry="16" fill="' + fill + '" stroke="' + DZ.line + '" stroke-width="2.2"/>' +
      '<g fill="' + fill + '" stroke="' + DZ.line + '" stroke-width="2">' + fingers + '</g>' +
      '<ellipse cx="' + (C[0] - 2) + '" cy="' + C[1] + '" rx="14" ry="12.6" fill="' + fill + '"/>';
    if (o.pads) s += '<g fill="' + DZ.pad + '"><ellipse cx="' + (C[0] - 2) + '" cy="' + C[1] + '" rx="9" ry="8.4"/>' + pads + '</g>';
    else s += '<path d="M6,-9Q16,-14 26,-9" stroke="' + dark + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>';
    s += '<g class="pc-dclaws" fill="' + (far ? '#e3dccd' : DZ.claw) + '" stroke="' + DZ.clawLine + '" stroke-width="1.8" stroke-linejoin="round">' + cl + '</g>';
    if (clLit) s += '<g class="pc-dclaws pc-lit" fill="' + glowC2 + '" stroke="' + glowL + '" stroke-width="1.8" stroke-linejoin="round">' + clLit + '</g>';
    if (o.only === 'lit') s = clLit ? glows + '<g class="pc-dclaws pc-lit" fill="' + glowC2 + '" stroke="' + glowL + '" stroke-width="1.8" stroke-linejoin="round">' + clLit + '</g>' : '';
    return { svg: '<g transform="' + mStr(m) + '">' + s + '</g>', pts: pts.map(function (q) { return apply(m, q); }), claws: clawAt.map(function (q) { return apply(m, q); }) };
  }
  // a hind foot on the ground: long and rounded, three broad toes, short pale claws
  function dzFoot(x, y, rot, k, far) {
    var fill = far ? DZ.far : DZ.base, s = '';
    s += '<path d="M-26,-2C-28,-16 -10,-22 8,-18C24,-15 38,-12 44,-4C48,1 40,4 30,4L-20,4C-26,4 -26,1 -26,-2Z" fill="' + fill + '" stroke="' + DZ.line + '" stroke-width="2.2" stroke-linejoin="round"/>';
    s += '<g fill="' + fill + '" stroke="' + DZ.line + '" stroke-width="2"><ellipse cx="40" cy="0" rx="9" ry="6.4"/><ellipse cx="30" cy="2.4" rx="8" ry="5.6"/></g>';
    s += '<g fill="' + DZ.claw + '" stroke="' + DZ.clawLine + '" stroke-width="1.4"><path d="M47,-2Q55,-1 57,4Q51,4 47,3Z"/><path d="M37,1Q44,2 46,6Q40,7 36,5Z"/></g>';
    return '<g transform="translate(' + N(x) + ',' + N(y) + ') rotate(' + N(rot || 0) + ') scale(' + N(k || 1) + ')">' + s + '</g>';
  }

  // The wings, as seen from her right side, relative to the shoulder: the wrist, the tips of the
  // fingers (the scalloped edge runs between them) and where the skin meets her side. The right wing
  // is always lower and only half open: 'droop' folded, 'half' as open as it goes; the left 'fold'
  // or 'spread' (the grey sail). 'tight': pressed flat to her back (squeezed flat).
  var DZ_WING = {
    fold: { w: [-36, -24], tips: [[-124, -6], [-110, 10], [-88, 18]], b: [-58, 24] },
    tight: { w: [-38, -10], tips: [[-116, 6], [-100, 14], [-80, 18]], b: [-50, 20] },
    droop: { w: [-34, 22], tips: [[-66, 104], [-100, 110], [-124, 88]], b: [-100, 30] },
    half: { w: [8, 28], tips: [[12, 116], [-24, 138], [-62, 132], [-94, 98]], b: [-76, 36] },
    spread: { w: [-46, -78], tips: [[-64, -170], [-124, -158], [-172, -116], [-190, -58]], b: [-100, 24] },
    // chapter 4, Squall's: a stubby wing held up and open, all it will do (never used for Sprinkle)
    stub: { w: [-30, -70], tips: [[-34, -150], [-84, -142], [-124, -104], [-136, -52]], b: [-70, 20] },
    // chapter 5, Wisp's: folded long down her back like a heron's, and (`flick`) jerked half open
    long: { w: [-20, 4], tips: [[-30, 132], [-46, 104], [-46, 64]], b: [-30, 22] },
    flick: { w: [-34, -12], tips: [[-70, 104], [-88, 70], [-80, 30]], b: [-34, 22] }
  };
  // the far side's droop hangs a little further back, so it shows past her haunch; the far 'half'
  // (her sore right wing when she faces left and opens both) hangs half open behind her back, above
  // her tail, low and scalloped, so it reads as a second wing that won't open all the way
  var DZ_WING_FAR = {
    droop: { w: [-40, 26], tips: [[-84, 112], [-126, 114], [-156, 88]], b: [-110, 32] },
    half: { w: [-60, 6], tips: [[-110, 70], [-170, 80], [-222, 60], [-250, 18]], b: [-120, 20] }
  };
  function dzWing(state, S, far, k, sw) {
    sw = sw || 1;   // a stubby wing's bone and ribs are drawn finer (Squall's)
    var W = (far && DZ_WING_FAR[state]) || DZ_WING[state] || DZ_WING.fold, m = mul(mT(S[0], S[1]), mS(k || 1));
    var flat = function (q) { return [q[0], Math.min(q[1], -4)]; };
    var w = flat(apply(m, W.w)), tips = W.tips.map(function (q) { return flat(apply(m, q)); }), b = flat(apply(m, W.b)), s0 = S;
    var d = 'M' + pt(s0) + 'L' + pt(w) + 'L' + pt(tips[0]);
    for (var i = 1; i < tips.length; i++) {
      var mid = lerp2(tips[i - 1], tips[i], 0.5), c = lerp2(mid, w, 0.2);
      d += 'Q' + pt(c) + ' ' + pt(tips[i]);
    }
    var mid2 = lerp2(tips[tips.length - 1], b, 0.5);
    d += 'Q' + pt(lerp2(mid2, w, 0.16)) + ' ' + pt(b) + 'Z';
    var veins = '';
    tips.slice(1).forEach(function (t) { veins += 'M' + pt(w) + 'L' + pt(lerp2(w, t, 0.94)); });
    var fill = far ? DZ.wingFar : DZ.wing;
    var svg = '<path class="pc-wing" d="' + d + '" fill="' + fill + '" stroke="' + DZ.wingLine + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="' + veins + '" stroke="' + DZ.vein + '" stroke-width="' + N(2.6 * (sw < 1 ? 0.75 : 1)) + '" stroke-linecap="round" fill="none"/>' +
      '<path d="M' + pt(s0) + 'L' + pt(w) + 'L' + pt(lerp2(w, tips[0], 0.96)) + '" stroke="' + (far ? DZ.far : DZ.base) + '" stroke-width="' + N(9 * sw) + '" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
      '<path d="M' + pt(s0) + 'L' + pt(w) + 'L' + pt(lerp2(w, tips[0], 0.96)) + '" stroke="' + DZ.line + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".55"/>';
    return { svg: svg, pts: [s0, w, b].concat(tips) };
  }

  // Her round amber eye, in eye coordinates (radius r, outer corner at +x): the iris glowing amber,
  // a big round pupil (nothing about her is slit or sharp), a bright shine. Lids by mood, in her skin.
  var DZ_LID = { lidSoft: [0.1, -1.0, -0.15], lidFlat: [0.25, 0.05, -0.35], lidHalf: [-0.05, 0.05, -0.12], lidUp: [-0.15, -1.05, -0.5],
    lidSad: [-0.8, -0.86, -0.14], lidShy: [0.12, -0.92, 0.04] };
  function dzEye(kind, r, look, side, gid, eid, ecl) {
    var ink = DZ.eyeInk || DZ.feat;
    if (kind === 'arc') return '<path d="M' + N(-r) + ',' + N(r * 0.3) + 'Q0,' + N(-r * 1.1) + ' ' + N(r) + ',' + N(r * 0.3) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.3) + '" fill="none" stroke-linecap="round"/>';
    if (kind === 'closed') return '<path d="M' + N(-r) + ',' + N(-r * 0.1) + 'Q0,' + N(r * 0.7) + ' ' + N(r) + ',' + N(-r * 0.1) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.28) + '" fill="none" stroke-linecap="round"/>';
    if (kind === 'squeeze') return '<path d="M' + N(r * 0.8) + ',' + N(-r * 0.62) + 'L' + N(-r * 0.5) + ',0L' + N(r * 0.8) + ',' + N(r * 0.62) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.3) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    var lx = look[0] * side * r * 0.2, ly = look[1] * r * 0.2;
    var pr = kind === 'scared' ? r * 0.3 : kind === 'wonder' ? r * 0.56 : r * 0.47;
    var py = ly + r * 0.08 + (kind === 'lidShy' ? r * 0.3 : kind === 'lidHalf' ? r * 0.16 : kind === 'lidUp' ? -r * 0.2 : 0);
    var g = '<g clip-path="url(#' + ecl + ')"><use href="#' + eid + '" fill="url(#' + gid + ')"/>' +
      '<circle cx="' + N(lx) + '" cy="' + N(py) + '" r="' + N(pr) + '" fill="' + (DZ.pupil || '#1c1828') + '"/>' +
      '<circle cx="' + N(lx - r * 0.3 * side) + '" cy="' + N(py - r * 0.3) + '" r="' + N(r * (DZ.shine ? DZ.shine * (kind === 'wonder' ? 1.2 : 1) : kind === 'wonder' ? 0.27 : 0.22)) + '" fill="#fff"/>' +
      '<circle cx="' + N(lx + r * 0.24 * side) + '" cy="' + N(py + r * 0.3) + '" r="' + N(r * 0.09) + '" fill="#fff" opacity=".9"/>' +
      (kind === 'lidSad' ? '<path d="M' + N(-r * 0.7) + ',' + N(r * 0.66) + 'Q0,' + N(r * 0.98) + ' ' + N(r * 0.7) + ',' + N(r * 0.66) + '" stroke="#fff" stroke-width="' + N(r * 0.1) + '" fill="none" stroke-linecap="round" opacity=".8"/>' : '');
    var LB = DZ_LID[kind];
    if (LB) {
      g += '<path d="M' + N(-r * 1.4) + ',' + N(LB[0] * r) + 'Q0,' + N(LB[1] * r) + ' ' + N(r * 1.4) + ',' + N(LB[2] * r) + 'L' + N(r * 1.4) + ',' + N(-r * 1.6) + 'L' + N(-r * 1.4) + ',' + N(-r * 1.6) + 'Z" fill="' + DZ.base + '"/></g>' +
        '<path d="M' + N(-r * 1.02) + ',' + N(LB[0] * r) + 'Q0,' + N(LB[1] * r) + ' ' + N(r * 1.02) + ',' + N(LB[2] * r) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.16) + '" fill="none" stroke-linecap="round"/>';
    } else g += '</g>';
    return g + '<use href="#' + eid + '" fill="none" stroke="' + ink + '" stroke-width="' + N(r * 0.13) + '"/>';
  }
  function dzEyeDefs(R, r) {
    // (the palette may name its own three eye colours, centre to rim: Wisp's pale gold)
    var gid = R.id(), eid = R.id(), ecl = R.id(), ec = DZ.eye || ['#fff4c8', '#f7c65c', '#c98b30'];
    R.defs += '<radialGradient id="' + gid + '" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="' + ec[0] + '"/><stop offset=".5" stop-color="' + ec[1] + '"/><stop offset="1" stop-color="' + ec[2] + '"/></radialGradient>' +
      '<path id="' + eid + '" d="M' + N(-r) + ',0A' + N(r) + ' ' + N(r) + ' 0 1 1 ' + N(r) + ',0A' + N(r) + ' ' + N(r) + ' 0 1 1 ' + N(-r) + ',0Z"/><clipPath id="' + ecl + '"><use href="#' + eid + '"/></clipPath>';
    return { gid: gid, eid: eid, ecl: ecl };
  }

  // Her head, frontal, in head coordinates (about 108 wide): nubs, little side frills, the eyes, a
  // pale snout with two nostrils, and a small mouth that never shows a tooth.
  var DZ_HEAD = [[0, -44], [-24, -42], [-42, -32], [-52, -14], [-54, 6], [-48, 24], [-34, 38], [-16, 45], [0, 47], [16, 45], [34, 38], [48, 24], [54, 6], [52, -14], [42, -32], [24, -42]];
  var DZ_MOUTH = { neutral: 'soft', happy: 'smile', dreamy: 'smile', wonder: 'o', worried: 'wavy', scared: 'o', sleepy: 'soft', laugh: 'open', stern: 'flat',
    kind: 'wobsmile', proud: 'smile', sniff: 'soft', shout: 'big', solemn: 'flat', sad: 'wobble', shy: 'small' };
  var DZ_BROW = { worried: [-6, 3], scared: [-7, 3], sad: [-8, 4], shy: [-4, 2], stern: [3, -2], solemn: [-1, -1] };
  function dzHead(R, mood, ctx) {
    var s = '', pts = DZ_HEAD.slice(), ink = DZ.feat, kind = EYE_KIND[mood] || 'open';
    if (kind === 'lidKind') kind = 'lidSoft';
    // chapter 5: a pose's own eyes (`eyes`: Puddle being a log and Wisp being a reed shut theirs)
    if (ctx.eyes) kind = ctx.eyes;
    if (ctx.squeeze) kind = 'squeeze';
    // frills at the sides, soft and pale, two ribs each; then the nubs
    [-1, 1].forEach(function (side) {
      s += '<g transform="translate(' + (side * 48) + ',-14) scale(' + side + ',1) rotate(' + (mood === 'scared' || mood === 'sad' || mood === 'worried' ? 22 : mood === 'shy' ? 12 : 0) + ')">' +
        '<path d="M-2,-12Q16,-20 24,-8Q26,2 18,8Q8,12 -2,8Z" fill="' + DZ.wing + '" stroke="' + DZ.wingLine + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M2,-4L18,-10M2,2L18,2" stroke="' + DZ.vein + '" stroke-width="1.8" stroke-linecap="round"/></g>';
      s += '<g transform="translate(' + (side * 18) + ',-38) rotate(' + (side * 14) + ')"><path d="M-8,6Q-8,-9 0,-14Q8,-9 8,6Z" fill="' + DZ.nub + '" stroke="' + DZ.line + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M-3,-6Q0,-9 3,-6" stroke="#ffffff" stroke-width="1.6" fill="none" opacity=".7"/></g>';
      pts.push([side * 76, -20], [side * 76, 0], [side * 24, -54]);
    });
    var inner = '<ellipse cx="-12" cy="-24" rx="20" ry="7" transform="rotate(-10 -12 -24)" fill="' + DZ.light + '" opacity=".55"/>' +
      // soft scales on the brow, matte
      '<path d="M-14,-30q7,-6 14,0q7,-6 14,0M-7,-36q7,-5 14,0" stroke="' + DZ.shade + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>';
    s += R.part(crClosed(DZ_HEAD), { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: ctx.sx * 0.8, sy: -3.6, inner: inner, lw: 2.6 });
    // chapter 5, Puddle's bump (he has bumped his head ten times on every log): a small round lump
    // between his nubs, a little pink, with two short lines to say it smarts
    if (ctx.bump) {
      s += '<g class="pc-bump"><path d="M-12,-37Q-13,-52 -1,-53Q11,-52 10,-37Z" fill="' + mix(DZ.base, '#f0a3b0', 0.42) + '" stroke="' + DZ.line + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M-6,-46Q-2,-50 3,-47" stroke="#ffffff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".75"/>' +
        '<path d="M-14,-58l-5,-7M-1,-61l0,-9M12,-58l5,-7" stroke="' + DZ.line + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/></g>';
      pts.push([-20, -68], [18, -68], [0, -72]);
    }
    // the snout, paler; nostrils
    s += '<ellipse cx="0" cy="22" rx="31" ry="20" fill="' + DZ.belly + '"/><path d="M-26,30Q0,44 26,30" stroke="' + DZ.bellyLine + '" stroke-width="1.6" fill="none" opacity=".7"/>' +
      '<g fill="' + DZ.nostril + '"><ellipse cx="-8" cy="13" rx="2.8" ry="2" transform="rotate(-20 -8 13)"/><ellipse cx="8" cy="13" rx="2.8" ry="2" transform="rotate(20 8 13)"/></g>';
    // eyes (chapter 5, `splitEyes`: handed back on their own, for Wisp, whose eyes are the one solid thing about her)
    var er = 15.5, ex = 23, ey = -6, E = dzEyeDefs(R, er), look = ctx.look || [1, 0], eyesSvg = '';
    var ek = kind === 'wonder' ? 1.1 : kind === 'scared' ? 1.06 : 1;
    [-1, 1].forEach(function (side) {
      eyesSvg += '<g transform="translate(' + N(side * ex) + ',' + ey + ') scale(' + N(side * ek) + ',' + N(ek) + ')">' + dzEye(kind, er, look, side, E.gid, E.eid, E.ecl) + '</g>';
    });
    if (!ctx.splitEyes) s += eyesSvg;
    var br = (ctx.brows && ctx.brows[mood]) || DZ_BROW[mood];
    if (br) {
      var shut = kind === 'arc' || kind === 'closed' || kind === 'squeeze', by = ey - er - 6 - (shut ? 2 : 0);
      s += '<path d="M' + N(-ex + 9) + ',' + N(by + br[0]) + 'L' + N(-ex - 9) + ',' + N(by + br[1]) + 'M' + N(ex - 9) + ',' + N(by + br[0]) + 'L' + N(ex + 9) + ',' + N(by + br[1]) +
        '" stroke="' + (DZ.brow || DZ.shade) + '" stroke-width="' + (DZ.brow ? '4.2' : '3.4') + '" stroke-linecap="round" fill="none"/>';
    }
    // chapter 6, `grass: true` (Sleet): a tuft of long grass on his head, between his horn nubs
    if (ctx.grass) {
      s += '<g class="pc-grass-tuft" fill="none" stroke-linecap="round"><path d="M-4,-40Q-14,-62 -30,-70M0,-41Q2,-66 -6,-84M4,-40Q14,-60 28,-64M-1,-41Q-6,-58 -18,-62" stroke="#7e8a3c" stroke-width="3.6"/>' +
        '<path d="M-4,-40Q-14,-62 -30,-70M0,-41Q2,-66 -6,-84M4,-40Q14,-60 28,-64" stroke="#b9c06a" stroke-width="1.6"/></g>';
      pts.push([-32, -72], [-8, -86], [30, -66]);
    }
    if (BLUSH[mood] || ctx.blush) s += '<g fill="#f2a3b4" opacity=".4"><ellipse cx="-36" cy="16" rx="8" ry="4.6"/><ellipse cx="36" cy="16" rx="8" ry="4.6"/></g>';
    // the mouth
    var mk = ctx.mouth || DZ_MOUTH[mood] || 'soft', my = 30, mo = '', st = ' stroke="' + ink + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
    if (mk === 'o' || mk === 'big' || mk === 'gulp') {
      var orx = mk === 'big' ? 10 : mk === 'gulp' ? 12 : 6, ory = mk === 'big' ? 11 : mk === 'gulp' ? 9 : 6.4;
      mo += '<ellipse cx="0" cy="' + N(my + ory * 0.4) + '" rx="' + orx + '" ry="' + ory + '" fill="' + DZ.mouth + '"' + st + '/>' +
        (mk === 'o' ? '' : '<ellipse cx="0" cy="' + N(my + ory * 0.95) + '" rx="' + N(orx * 0.6) + '" ry="' + N(ory * 0.4) + '" fill="#f08a9c"/>');
      pts.push([0, my + ory * 1.5]);
    } else if (mk === 'open') {
      mo += '<path d="M-14,' + my + 'Q0,' + (my + 3) + ' 14,' + my + 'Q10,' + (my + 15) + ' 0,' + (my + 16) + 'Q-10,' + (my + 15) + ' -14,' + my + 'Z" fill="' + DZ.mouth + '"' + st + '/>' +
        '<path d="M-7,' + (my + 11) + 'Q0,' + (my + 7) + ' 7,' + (my + 11) + 'Q4,' + (my + 15) + ' 0,' + (my + 15) + 'Q-4,' + (my + 15) + ' -7,' + (my + 11) + 'Z" fill="#f08a9c"/>';
      pts.push([0, my + 17]);
    } else {
      var md = {
        soft: 'M-9,' + my + 'Q0,' + (my + 5) + ' 9,' + my,
        smile: 'M-14,' + (my - 2) + 'Q0,' + (my + 10) + ' 14,' + (my - 2),
        wobsmile: 'M-13,' + (my - 1) + 'Q-9,' + (my + 4) + ' -5,' + (my + 3) + 'Q-2,' + (my + 2) + ' 0,' + (my + 5) + 'Q2,' + (my + 2) + ' 5,' + (my + 3) + 'Q9,' + (my + 4) + ' 13,' + (my - 1),
        wavy: 'M-10,' + (my + 3) + 'Q-5,' + (my - 1) + ' 0,' + (my + 2) + 'Q5,' + (my + 5) + ' 10,' + (my + 1),
        wobble: 'M-11,' + (my + 5) + 'Q-8,' + (my) + ' -5,' + (my + 2.6) + 'Q-2.5,' + (my + 5) + ' 0,' + (my + 2.4) + 'Q2.5,' + (my + 5) + ' 5,' + (my + 2.6) + 'Q8,' + (my) + ' 11,' + (my + 5),
        flat: 'M-9,' + (my + 2) + 'Q0,' + (my + 1) + ' 9,' + (my + 2),
        small: 'M-7,' + my + 'Q0,' + (my + 5) + ' 7,' + my
      }[mk] || 'M-9,' + my + 'Q0,' + (my + 5) + ' 9,' + my;
      mo += '<path d="' + md + '" fill="none"' + st + '/>';
    }
    s += mo;
    // sniff lines: the mood, or the pose (she sniffs you all over, shy eyes and all)
    if (mood === 'sniff' || ctx.sniff) s += '<path d="M50,8q3,-3 6,0t6,0M53,17q3,-3 6,0t6,0M50,26q3,-3 6,0t6,0" stroke="' + ink + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>';
    if (mood === 'laugh') s += '<g fill="#9fd6f7" stroke="#5aa6d6" stroke-width="1"><path d="M40,2q3,4 0,6q-3,-2 0,-6Z"/><path d="M-40,2q3,4 0,6q-3,-2 0,-6Z"/></g>';
    // the extras: a misty tear rolling down beside her nose; a cloud of breath, or of burp
    if (ctx.tear) { s += tearSvg(13, 6, 1.5); pts.push([20, 28]); }
    if (ctx.mist) { var mk2 = ctx.mistK || 1.3, mx = ctx.mistX || 54; s += mistSvg(mx, my + 2, mk2); MIST_BOX.forEach(function (q) { pts.push([mx + q[0] * mk2, my + 2 + q[1] * mk2]); }); }
    // chapter 7, `tap: 'mist'` (the HURP Tap): the cloud marked for the page, unpainted
    if (ctx.mist && ctx.tapMist) s += tapMark('mist', mx + 3.5 * mk2, my + 2, 22 * mk2);
    return { svg: s, pts: pts, eyes: ctx.splitEyes ? eyesSvg : '' };
  }

  // The poses, in her units (the ground at y = 0). hip and chest are circles [x, y, r] (the torso);
  // haunch an ellipse [cx, cy, rx, ry, rot]; neck and tail chains of cubic Beziers; head [x, y, rot];
  // arms run from a shoulder circle to a paw [x, y] turned `rot`; feet are hind feet [x, y, rot].
  // `wings` names the left and right wings' states; `S` is where they meet her shoulders.
  var DZ_HS = 1.2;   // her head's scale: about 130 wide, a big gentle face on a long neck
  var DZ_TAIL_SIT = [[[-90, -40], [-130, -22], [-170, -13], [-214, -13]], [[-214, -13], [-252, -13], [-282, -18], [-292, -40]], [[-292, -40], [-298, -58], [-284, -70], [-270, -60]]];
  var DZ_SIT = { hip: [-40, -60, 58], chest: [2, -112, 44], haunch: [-46, -48, 54, 40, -14],
    feet: [[-32, -6, 0, true], [-8, -4, 0]], S: [-4, -140],
    neck: [[[10, -140], [18, -172], [30, -196], [44, -214]]], neckW: [32, 24], head: [50, -238, 0],
    tail: DZ_TAIL_SIT, tailW: [32, 7], tailFront: false,
    // her two resting forepaws apart, the far one under her chest and the near one forward, so each
    // shows its own five claws (side by side they read as one fan of seven or eight)
    arms: [{ top: [10, -118, 15], paw: [12, -8], rot: -10, far: true }, { top: [24, -112, 17], paw: [96, -6], rot: -8 }],
    hold: [70, -112], wings: { left: 'fold', right: 'droop' } };
  function dzPose(pose) {
    var P = {}, k;
    for (k in DZ_SIT) P[k] = DZ_SIT[k];
    var TAIL_BACK = [[[-108, -38], [-158, -22], [-196, -13], [-238, -13]], [[-238, -13], [-270, -13], [-292, -22], [-296, -46]]];
    switch (pose) {
      case 'wings': P.wings = { left: 'spread', right: 'half' }; break;
      case 'pawup': P.arms = [DZ_SIT.arms[0], { top: [24, -114, 17], paw: [100, -150], rot: -84, up: true }]; P.head = [44, -238, -2]; P.hold = null; break;
      case 'pawsup': P.arms = [{ top: [12, -120, 15], paw: [138, -196], rot: -76, up: true, far: true }, { top: [24, -114, 17], paw: [98, -128], rot: -92, up: true }]; P.head = [40, -238, -3]; P.hold = null; break;
      case 'gulp': P.neck = [[[10, -140], [14, -178], [22, -206], [30, -222]]]; P.head = [34, -246, -38]; P.mouth = 'gulp'; P.look = [0.6, -2]; break;
      case 'burp': P.head = [48, -238, -12]; P.mouth = 'o'; P.mist = true; P.mistK = 2.2; P.mistX = 70; break;
      case 'sniff':
        P.hip = [-62, -56, 56]; P.chest = [-10, -104, 42]; P.haunch = [-66, -46, 52, 40, -10]; P.S = [-16, -128];
        P.neck = [[[2, -122], [44, -140], [88, -128], [114, -104]]]; P.neckW = [30, 23]; P.head = [124, -96, 10];
        P.arms = [{ top: [-2, -100, 15], paw: [-12, -8], rot: -10, far: true }, { top: [12, -96, 17], paw: [72, -6], rot: -8 }];
        P.feet = [[-52, -6, 0, true], [-28, -4, 0]]; P.tail = TAIL_BACK; P.tailFront = false; P.hold = null; P.sniff = true; break;
      case 'draw':
        P.hip = [-58, -54, 56]; P.chest = [-4, -98, 42]; P.haunch = [-62, -44, 52, 40, -10]; P.S = [-10, -122];
        P.neck = [[[8, -116], [50, -132], [86, -118], [104, -94]]]; P.neckW = [30, 23]; P.head = [112, -84, 12]; P.look = [0.4, 2.6];
        P.arms = [{ top: [4, -94, 15], paw: [42, -8], rot: -10, far: true }, { top: [18, -90, 17], paw: [124, -45], rot: 22, claws: 'one' }];
        P.feet = [[-48, -6, 0, true], [-24, -4, 0]]; P.groove = [[200, -2], [250, -5]]; P.tail = TAIL_BACK; P.tailFront = false; P.hold = null; break;
      case 'unfold':
        P.hip = [-72, -50, 50]; P.chest = [-16, -98, 40]; P.haunch = [-76, -42, 48, 38, -12]; P.S = [-22, -122];
        P.neck = [[[-8, -114], [8, -170], [30, -218], [50, -246]]]; P.neckW = [30, 22]; P.head = [58, -262, -4];
        P.arms = [{ top: [-8, -92, 15], paw: [-18, -8], rot: -10, far: true }, { top: [4, -88, 17], paw: [66, -6], rot: -8 }];
        P.feet = [[-62, -6, 0, true], [-38, -4, 0]];
        P.tail = [[[-118, -34], [-172, -20], [-216, -12], [-264, -12]], [[-264, -12], [-304, -12], [-332, -16], [-354, -30]]]; P.tailFront = false; P.hold = null; break;
      case 'lie': case 'touch': case 'peek':
        P.hip = [-72, -42, 42]; P.chest = [6, -50, 42]; P.haunch = [-74, -34, 52, 32, 0]; P.S = [-2, -82];
        P.neck = [[[22, -70], [34, -108], [44, -140], [52, -160]]]; P.neckW = [30, 22]; P.head = [58, -180, 0];
        P.arms = [{ top: [16, -40, 15], paw: [72, -8], rot: -6, far: true }, { top: [32, -38, 17], paw: [102, -6], rot: -4 }];
        P.feet = [[-68, -6, 0, true], [-46, -4, 0]];
        P.tail = [[[-112, -30], [-172, -14], [-228, -12], [-286, -16]], [[-286, -16], [-318, -18], [-336, -30], [-332, -52]]]; P.tailFront = false;
        P.hold = [104, -30]; P.wings = { left: 'fold', right: 'droop' };
        if (pose === 'touch') { P.arms = [P.arms[0], { top: [32, -38, 17], paw: [196, -8], rot: -2 }]; P.head = [62, -176, 8]; P.look = [0.8, 1.6]; P.hold = null; }
        if (pose === 'peek') { P.neck = [[[22, -70], [42, -98], [66, -116], [86, -122]]]; P.head = [100, -128, 18]; P.look = [1.8, 0]; P.hold = null; }
        break;
      case 'flat':
        P.hip = [-60, -30, 30]; P.chest = [26, -30, 30]; P.haunch = [-62, -24, 40, 22, 0]; P.S = [10, -54];
        P.neck = [[[44, -30], [70, -26], [96, -28], [118, -38]]]; P.neckW = [26, 22]; P.head = [142, -56, 6];
        P.arms = [{ top: [40, -24, 13], paw: [160, -8], rot: -26, far: true }, { top: [52, -22, 14], paw: [196, -8], rot: -16 }];
        P.feet = [[-74, -6, 0, true], [-50, -4, 0]];
        P.tail = [[[-86, -24], [-140, -12], [-200, -10], [-262, -12]], [[-262, -12], [-300, -12], [-320, -18], [-332, -26]]]; P.tailFront = false; P.hold = null;
        P.wings = { left: 'tight', right: 'tight' }; P.shake = true; break;
      case 'hide':
        P.hip = [-46, -48, 48]; P.chest = [16, -70, 40]; P.haunch = [-50, -38, 48, 36, -6]; P.S = [4, -96];
        P.neck = [[[28, -86], [52, -102], [70, -104], [82, -100]]]; P.neckW = [28, 22]; P.head = [92, -100, 12];
        P.arms = [{ top: [24, -60, 14], paw: [22, -8], rot: -10, far: true }, { top: [38, -56, 16], paw: [104, -6], rot: -8 }];
        P.feet = [[-40, -6, 0, true], [-16, -4, 0]];
        // the tail rises behind her rump, arches high over her back and comes down onto her face,
        // its broad end laid across both eyes like a blindfold: all the rest of her stays in plain
        // sight (chest, belly, both forepaws, haunch, hind feet, the drooping wing, her snout).
        // `tailBroad` [u0, u1, w]: the tube narrows to w by u0 and widens to tailW[1] by u1, a paddle
        P.tail = [[[-66, -60], [-130, -90], [-150, -180], [-90, -215]], [[-90, -215], [-40, -240], [20, -215], [38, -160]],
          [[38, -160], [44, -122], [72, -108], [150, -96]]];
        // 'face': the tail is drawn behind her like any other (its root in her rump, behind both
        // wings), and again over her head inside `faceClip` [x, y, w, h], where it lies on her face
        P.tailW = [26, 21]; P.tailBroad = [0.7, 0.82, 13]; P.tailFront = 'face'; P.faceClip = [24, -260, 200, 200]; P.hold = null; break;
      case 'curl':
        // curled on the ground, her head resting low, looking at whoever is at the next anchor (the
        // bridge's `beside`, about 185 of her units in front of her), her tail running round behind
        // them and back across their front (`nest`: where they sit; `front`: the tail's near part,
        // to draw over them)
        P.hip = [-96, -40, 40]; P.chest = [-24, -48, 40]; P.haunch = [-100, -32, 48, 30, 4]; P.S = [-30, -78];
        P.neck = [[[-6, -62], [26, -74], [58, -66], [80, -50]]]; P.neckW = [30, 22]; P.head = [100, -58, 14]; P.look = [1.6, 0.6];
        P.arms = [{ top: [-30, -36, 14], paw: [22, -8], rot: -6, far: true }, { top: [-16, -32, 16], paw: [44, -6], rot: -4 }];
        P.feet = [[-92, -6, 0, true], [-70, -4, 0]];
        P.tail = [[[-130, -28], [-176, -36], [-168, -58], [-90, -60]], [[-90, -60], [40, -62], [222, -58], [270, -36]], [[270, -36], [300, -16], [272, -3], [204, -4]], [[204, -4], [172, -4], [150, -8], [142, -18]]];
        P.tailW = [32, 8]; P.tailFront = false; P.frontClip = [118, -24, 210, 44]; P.nest = [185, 0]; P.hold = null; break;
      case 'eyes': P.eyesOnly = true; P.head = [60, -120, 0]; break;
      case 'tailup':
        // `hide`, a moment later ("I know you didn't." The tail lifts a little): the same huddle, the
        // tail's broad end raised off her eyes to lie across her brow, so both eyes peek out under it
        P.hip = [-46, -48, 48]; P.chest = [16, -70, 40]; P.haunch = [-50, -38, 48, 36, -6]; P.S = [4, -96];
        P.neck = [[[28, -86], [52, -102], [70, -104], [82, -100]]]; P.neckW = [28, 22]; P.head = [92, -100, 8]; P.look = [1.4, -1.2];
        P.arms = [{ top: [24, -60, 14], paw: [22, -8], rot: -10, far: true }, { top: [38, -56, 16], paw: [104, -6], rot: -8 }];
        P.feet = [[-40, -6, 0, true], [-16, -4, 0]];
        P.tail = [[[-66, -60], [-130, -90], [-150, -180], [-90, -215]], [[-90, -215], [-40, -240], [16, -216], [34, -174]],
          [[34, -174], [42, -148], [74, -144], [154, -148]]];
        P.tailW = [26, 19]; P.tailBroad = [0.7, 0.82, 13]; P.tailFront = 'face'; P.faceClip = [24, -290, 210, 230]; P.hold = null; break;
      case 'check':
        // "A SHINY scale?" She looks herself over, nose to tail: sitting, her long neck bent back over
        // her shoulder, her face turned down along her own back, and her tail brought up to be looked at
        P.neck = [[[10, -140], [44, -196], [26, -262], [-34, -262]], [[-34, -262], [-64, -262], [-84, -246], [-92, -226]]]; P.neckW = [32, 23]; P.neckSide = UPPER;
        P.head = [-104, -196, 16]; P.look = [-1.5, 1.7];
        P.tail = [[[-90, -40], [-140, -24], [-196, -22], [-232, -46]], [[-232, -46], [-262, -66], [-262, -110], [-226, -124]],
          [[-226, -124], [-204, -132], [-186, -122], [-182, -106]]];
        P.arms = [DZ_SIT.arms[0], { top: [24, -112, 17], paw: [84, -6], rot: -8 }]; P.hold = null; break;
      case 'tailout':
        // "Then it's not mine." She holds out her tail to be felt: it comes round in front of her and
        // lies across her two forepaws, held out at a cat's reach and sloping down to a cat's raised
        // paw, its bumpy ridges uppermost (the held-out part has plates of its own, below: the card
        // this panel gives is "grey and bumpy")
        P.head = [48, -236, 9]; P.look = [1.2, 1.8];
        P.tail = [[[-90, -40], [-124, -6], [-70, -8], [-16, -14]], [[-16, -14], [36, -20], [62, -52], [112, -60]],
          [[112, -60], [162, -66], [222, -52], [276, -30]]];
        P.tailW = [30, 9]; P.tailFront = true;
        P.arms = [{ top: [10, -118, 15], paw: [66, -34], rot: -24, far: true, claws: 'hold' }, { top: [24, -112, 17], paw: [112, -40], rot: -18, claws: 'hold' }];
        P.hold = null; break;
      case 'lookdown':
        // chapter 5 ("Sprinkle looks down at her own enormous feet. 'Then they're VERY small.'"):
        // sitting, her long neck arched forward and down, her face over her own two forepaws
        P.neck = [[[10, -140], [24, -196], [70, -216], [96, -184]]]; P.neckW = [32, 23]; P.neckSide = UPPER;
        P.head = [104, -160, 15]; P.look = [0.1, 3.2]; P.hold = null; break;
    }
    return P;
  }

  // (chapter 5: `K` is what differs for a dragonet drawn on her model, in his own palette: Puddle,
  // sitting. `pawK` and `footK` size the feet, `wings` names both wings' states, `bump` his bump.)
  function buildSprinkle(o, K) {
    o = o || {}; K = K || {};
    var pose = SPRINKLE_POSES.indexOf(o.pose) >= 0 ? o.pose : 'sit';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    // (chapter 6: `K.P`, a pose of a dragonet's own on her model: Sleet's)
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), P = K.P || dzPose(pose);
    var sx = -2.4 * F, sy = -3.6, pts = [], body = '', pawAt = null;
    function addPts(a) { pts = pts.concat(a); }
    var hrot = P.head[2] + (HEAD_ROT[mood] || 0) * 0.6;
    var hm = mul(mT(P.head[0] + (mood === 'sniff' ? 4 : 0), P.head[1]), mul(mR(hrot), mS(P.eyesOnly ? 1 : DZ_HS)));
    var hctx = { sx: sx, look: P.look || [1, 0], mouth: P.mouth, sniff: !!P.sniff };
    if (o.squeeze) hctx.squeeze = true;
    if (o.tear) hctx.tear = true;
    if (o.mist || P.mist) { hctx.mist = true; if (P.mist) { hctx.mistK = P.mistK; hctx.mistX = P.mistX; } }
    if (o.tap === 'mist') hctx.tapMist = true;
    if (K.bump) hctx.bump = true;
    // chapter 6, Sleet: his bossy brows, whatever the mood (`K.brows`), and the tuft of long grass on his head
    if (K.brows) hctx.brows = K.brows;
    if (K.grass) hctx.grass = true;
    var hd, headPts, hold = null, front = '';

    if (P.eyesOnly) {
      // only her eyes in the dark: two big round shining eyes and their soft glow
      var E = dzEyeDefs(R, 15.5), kind = EYE_KIND[mood] || 'open', gl = R.id();
      if (kind === 'lidKind') kind = 'lidSoft';
      if (o.squeeze) kind = 'squeeze';
      R.defs += '<radialGradient id="' + gl + '"><stop offset="0" stop-color="#ffe6a6" stop-opacity=".5"/><stop offset=".55" stop-color="#ffd27a" stop-opacity=".16"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>';
      var es = '<ellipse cx="0" cy="-4" rx="70" ry="46" fill="url(#' + gl + ')"/>';
      [-1, 1].forEach(function (side) { es += '<g transform="translate(' + (side * 23) + ',-6) scale(' + side + ',1)">' + dzEye(kind, 15.5, [0.6, 0], side, E.gid, E.eid, E.ecl) + '</g>'; });
      body = '<g class="pc-eyes-only" transform="' + mStr(hm) + '">' + es + '</g>';
      headPts = [[-44, -26], [44, -26], [-44, 14], [44, 14]].map(function (q) { return apply(hm, q); });
      addPts([[-70, -50], [70, -50], [-70, 42], [70, 42]].map(function (q) { return apply(hm, q); }));
      addPts([[0, 0]]);
    } else {
      // ----- torso, belly, haunch
      var hip = P.hip, chest = P.chest, tg = hull2(hip, chest, 10);
      var ax = unit([chest[0] - hip[0], chest[1] - hip[1]]), spine = [ax[1], -ax[0]];
      var tIn = '<path d="' + ellipseG(lerp(hip[0], chest[0], 0.55) - spine[0] * chest[2] * 0.55, lerp(hip[1], chest[1], 0.55) - spine[1] * chest[2] * 0.55,
        (dist(hip, chest) / 2 + chest[2]) * 0.8, chest[2] * 0.62, deg(ax)).d + '" fill="' + DZ.belly + '"/>';
      // belly scales: soft bands across the pale front
      var bands = '';
      for (var bi = 0; bi < 5; bi++) {
        var bt = 0.15 + bi * 0.19, bcn = add(lerp2(hip, chest, bt), spine, -lerp(hip[2], chest[2], bt) * 0.62), bw2 = lerp(hip[2], chest[2], bt) * 0.5;
        bands += 'M' + pt(add(bcn, ax, -bw2 * 0.15)) + 'q' + N(-spine[0] * bw2 * 0.5) + ',' + N(-spine[1] * bw2 * 0.5) + ' ' + N(-spine[0] * bw2) + ',' + N(-spine[1] * bw2);
      }
      tIn += '<path d="' + bands + '" stroke="' + DZ.bellyLine + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>';
      // a few soft scales on her side, matte
      var sc0 = lerp2(hip, chest, 0.35);
      tIn += '<path d="M' + pt(add(sc0, spine, hip[2] * 0.35)) + 'q8,7 16,0q8,7 16,0M' + pt(add(add(sc0, spine, hip[2] * 0.1), ax, 14)) + 'q8,7 16,0" stroke="' + DZ.shade + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>' +
        '<path d="M' + pt(add(add(hip, spine, hip[2] - 6), ax, 4)) + 'L' + pt(add(add(chest, spine, chest[2] - 6), ax, -4)) + '" stroke="' + DZ.light + '" stroke-width="5" stroke-linecap="round" opacity=".5"/>';
      var torso = R.part(tg.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx, sy: sy, inner: tIn, lw: 2.6 });
      addPts(tg.pts);
      var hg = ellipseG(P.haunch[0], P.haunch[1], P.haunch[2], P.haunch[3], P.haunch[4], 10);
      var haunch = R.part(hg.d, { fill: DZ.base, dark: DZ.shade, line: mix(DZ.line, DZ.base, 0.25), lw: 2.4, sx: sx * 0.7, sy: sy * 0.7,
        inner: '<path d="M' + N(P.haunch[0] - P.haunch[2] * 0.5) + ',' + N(P.haunch[1] - P.haunch[3] * 0.3) + 'q10,8 20,0q10,8 20,0" stroke="' + DZ.shade + '" stroke-width="2" fill="none" opacity=".55"/>' });
      addPts(hg.pts);
      // the back's ridges, from the shoulders to the rump
      var spineTube = { at: function (u) { var c = lerp2(chest, hip, u), r = lerp(chest[2], hip[2], u); return { p: c, n: spine, w: r }; } };
      var torsoRidges = ridgeRow(spineTube, 0.05, 1.05, 6, 0.24, function () { return 1; });

      // ----- neck (and its pale throat) and tail
      var nw = P.neckW || DZ_SIT.neckW, neck = chainTube(P.neck, function (u) { return lerp(nw[0], nw[1], u); }, 10);
      var throat = [];
      neck.C.forEach(function (c) { throat.push(add(c.p, c.n, c.w * 0.5)); });
      var neckSvg = R.part(neck.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx * 0.7, sy: sy * 0.7, lw: 2.4,
        inner: '<path d="M' + pt(throat[0]) + cr(throat) + '" stroke="' + DZ.belly + '" stroke-width="' + N(nw[1] * 0.9) + '" fill="none" stroke-linecap="round"/>' });
      addPts(neck.pts);
      var neckRidges = ridgeRow(neck, 0.1, 0.8, 4, 0.36, P.neckSide || function (c) { return -1; });
      var tw = P.tailW || DZ_SIT.tailW, broad = P.tailBroad || null;
      var twf = function (u) {
        if (!broad) return lerp(tw[0], tw[1], Math.pow(u, 0.9));
        if (u < broad[0]) return lerp(tw[0], broad[2], u / broad[0]);
        var e = clamp((u - broad[0]) / (broad[1] - broad[0]), 0, 1);
        return lerp(broad[2], tw[1], e * e * (3 - 2 * e));
      };
      var tail = chainTube(P.tail, twf, 9), tlow = Math.max.apply(null, tail.pts.map(function (q) { return q[1]; }));
      for (var ti = 0; ti < 3 && tlow > -1; ti++) {
        // a tail never sinks into the ground: lift all of it but its base, which stays in the body
        var tdy = tlow + 1.5;
        P.tail = P.tail.map(function (seg, si) { return seg.map(function (q, qi) { return [q[0], q[1] - (si === 0 && qi === 0 ? Math.min(tdy, 12) : tdy)]; }); });
        tail = chainTube(P.tail, twf, 9);
        tlow = Math.max.apply(null, tail.pts.map(function (q) { return q[1]; }));
      }
      var tailSvg = R.part(tail.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx * 0.6, sy: sy * 0.6, lw: 2.4,
        inner: (function () { var c = []; for (var q = 0; q <= 16; q++) { var a = tail.at(q / 16); c.push(add(a.p, a.n, -UPPER(a) * a.w * 0.5)); } return '<path d="M' + pt(c[0]) + cr(c) + '" stroke="' + DZ.belly + '" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>'; })() });
      addPts(tail.pts);
      // (`tailout`: the usual plates stand a quarter of the tail's width proud, about 3 units where the
      // held-out tail is 9 to 12 wide, so it drew smooth; from her paws to the tip they are bigger)
      var tailRidges = pose === 'tailout' ? ridgeRow(tail, 0.04, 0.3, 4, 0.4, UPPER) + ridgeRow(tail, 0.36, 0.97, 11, 0.74, UPPER) : ridgeRow(tail, 0.04, 0.9, 11, 0.4, UPPER);

      // ----- wings: her right wing is the near one when she faces right
      var rightNear = F === 1, S = P.S, WG = K.wings || P.wings;
      var nearW = dzWing(rightNear ? WG.right : WG.left, S, false, 1), farW = dzWing(rightNear ? WG.left : WG.right, add(S, [-14, -6]), true, 1);
      addPts(nearW.pts); addPts(farW.pts);

      // ----- arms and paws, feet
      var arms = P.arms.slice(), held = null;
      if (o.holds === 'pebble') {
        if (P.hold) {
          // held tight in her claws, at her chest: both paws curled round it
          var hp = P.hold;
          arms = [{ top: arms[0].top, paw: [hp[0] - 4, hp[1] - 14], rot: -40, far: true, claws: 'hold' }, { top: arms[1].top, paw: [hp[0] - 22, hp[1] + 12], rot: -30, claws: 'hold' }];
          held = { c: [hp[0] + 14, hp[1] - 4], k: 2, rot: -14, at: 'front' };
        } else {
          var fp2 = arms[arms.length - 1].paw;
          held = { c: [fp2[0] + 78, -17], k: 1.5, rot: 80, at: 'nose' };
        }
      }
      function armSvg(A) {
        // shoulder to elbow to paw: the elbow bends back (a resting paw) or down (a raised one)
        var rest = !A.up && A.claws !== 'hold' && A.claws !== 'one', restUp = !rest ? 0 : K.pawK ? 10 * K.pawK : 12;
        var top = [A.top[0], A.top[1], A.top[2]], end = [A.paw[0], A.paw[1] - restUp, A.top[2] * 0.64];
        var dv = unit([end[0] - top[0], end[1] - top[1]]), pp = [-dv[1], dv[0]], len = dist(top, end);
        // the elbow bends back from an upright arm, and up from one reaching along the ground
        if (Math.abs(dv[1]) < 0.5 ? pp[1] > 0 : pp[0] > 0) pp = [-pp[0], -pp[1]];
        var el = A.elbow || add(lerp2(top, end, 0.46), pp, Math.min(18, len * 0.14)), elc = [el[0], el[1], A.top[2] * 0.8];
        var g1 = hull2(top, elc, 8), g2 = hull2(elc, end, 8);
        var pw = dzPaw(A.paw[0], A.paw[1] - restUp, rest ? 0 : A.rot, K.pawK || 1.2, K.lit != null && A.up ? { far: A.far, pads: A.up, claws: A.claws, rest: rest, lit: K.lit } : { far: A.far, pads: A.up, claws: A.claws, rest: rest });
        addPts(g1.pts); addPts(g2.pts); addPts(pw.pts);
        // (chapter 6, `K.paw`: where a raised forepaw is, for its Tap and the Counts picture)
        if (K.paw && A.up && !pawAt) { var pk6 = K.pawK || 1.2, pcen = apply(mul(mT(A.paw[0], A.paw[1] - restUp), mul(mR(A.rot), mS(pk6))), [26, 0]); pawAt = [pcen[0], pcen[1], 40 * pk6]; }
        var o2 = { fill: A.far ? DZ.far : DZ.base, dark: A.far ? DZ.farShade : DZ.shade, line: DZ.line, sx: sx * 0.6, sy: sy * 0.6, lw: 2.2 };
        return R.part(g1.d, o2) + R.part(g2.d, o2) + '<circle cx="' + N(el[0]) + '" cy="' + N(el[1]) + '" r="' + N(A.top[2] * 0.8 - 1.2) + '" fill="' + o2.fill + '"/>' + pw.svg;
      }
      var fk = K.footK || 1;
      var feet = P.feet.map(function (f) { addPts([[f[0] - 28 * fk, f[1] - 20 * fk], [f[0] + 58 * fk, f[1] + 4]]); return dzFoot(f[0], f[1], f[2], fk, f[3]); });

      // ----- the head
      hd = dzHead(R, mood, hctx);
      headPts = hd.pts.map(function (q) { return apply(hm, q); });
      addPts(headPts);
      var headSvg = '<g transform="' + mStr(hm) + '">' + hd.svg + '</g>';

      // ----- assemble back to front
      body += farW.svg;
      if (!P.tailFront || P.tailFront === 'face') body += ridgesSvg(tailRidges) + tailSvg;
      if (!o.noArms) body += armSvg(arms[0]);
      body += feet[0];
      body += ridgesSvg(torsoRidges) + torso + haunch + feet[1];
      if (P.tailFront === true || P.tailFront === 'front') body += ridgesSvg(tailRidges) + tailSvg;
      body += ridgesSvg(neckRidges) + nearW.svg + neckSvg;
      // (chapter 6, `armsBehind`: Sleet flat on his belly, his chin over his forepaws)
      if (P.armsBehind && !o.noArms) body += armSvg(arms[1]);
      body += headSvg;
      if (P.tailFront === 'over') body += ridgesSvg(tailRidges) + tailSvg;
      if (P.tailFront === 'face') {
        var fcid = R.id(), fcl = P.faceClip;
        R.defs += '<clipPath id="' + fcid + '"><rect x="' + N(fcl[0]) + '" y="' + N(fcl[1]) + '" width="' + N(fcl[2]) + '" height="' + N(fcl[3]) + '"/></clipPath>';
        body += '<g clip-path="url(#' + fcid + ')">' + ridgesSvg(tailRidges) + tailSvg + '</g>';
      }
      if (!o.noArms && !P.armsBehind) body += armSvg(arms[1]);
      if (held && held.at === 'front') body += pebbleSvg(R, held.c, held.k, held.rot, sx);
      if (held && held.at === 'nose') body += pebbleSvg(R, held.c, held.k, held.rot, sx);
      if (held) addPts([[held.c[0] - 11 * held.k, held.c[1] - 11 * held.k], [held.c[0] + 11 * held.k, held.c[1] + 10.6 * held.k]]);
      if (P.frontClip) {
        // the part of her tail that passes in front of whoever she curls round, on its own, to draw
        // over them (`front`, in the same box): the tail clipped to the hollow's front
        var fid = 'pcdzf' + (++serial).toString(36), fc = P.frontClip;
        front = '<defs><clipPath id="' + fid + '"><rect x="' + N(fc[0]) + '" y="' + N(fc[1]) + '" width="' + N(fc[2]) + '" height="' + N(fc[3]) + '"/></clipPath></defs>' +
          '<g clip-path="url(#' + fid + ')">' + ridgesSvg(tailRidges) + '<path d="' + tail.d + '" fill="' + DZ.base + '" stroke="' + DZ.line + '" stroke-width="2.4" stroke-linejoin="round"/></g>';
      }
      if (P.groove) {
        // the line her claw draws in the mud
        body += '<path d="M' + pt(P.groove[0]) + 'Q' + pt([lerp(P.groove[0][0], P.groove[1][0], 0.5), P.groove[0][1] - 6]) + ' ' + pt(P.groove[1]) + '" stroke="#5c4532" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>';
        addPts(P.groove);
      }
      if (P.seed) {
        // chapter 6 (Sleet's `puff`): a grass seed falling off his puffed-out chest, beside it and above the
        // long grass, big enough to see (the size of a claw), its stalk and two fall marks
        var sd = P.seed;
        body += '<g class="pc-seed"><path d="M' + N(sd[0]) + ',' + N(sd[1]) + 'q5,-14 1.6,-27" stroke="#8a8a40" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          '<ellipse cx="' + N(sd[0]) + '" cy="' + N(sd[1]) + '" rx="5.8" ry="12" transform="rotate(24 ' + N(sd[0]) + ' ' + N(sd[1]) + ')" fill="#d8c982" stroke="#7a6a2c" stroke-width="2.2"/>' +
          '<path d="M' + N(sd[0] + 14) + ',' + N(sd[1] - 29) + 'v16M' + N(sd[0] + 24) + ',' + N(sd[1] - 19) + 'v13" stroke="' + DZ.line + '" stroke-width="2.6" stroke-linecap="round" opacity=".45"/></g>';
        addPts([[sd[0] - 12, sd[1] - 36], [sd[0] + 28, sd[1] + 14]]);
      }
      if (P.shake && (mood === 'scared' || mood === 'worried' || o.squeeze)) {
        // shaking all over: little tremble marks at both ends
        body += '<path d="M-118,-70q-6,8 0,16t0,16M-134,-62q-6,8 0,16M206,-70q6,8 0,16t0,16M222,-62q6,8 0,16" stroke="' + DZ.line + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".5"/>';
        addPts([[-140, -74], [226, -74]]);
      }
      hold = held;
    }

    // ----- fit: her feet centred at the bottom of her box (a long pose may shift, never shrink much)
    var Wb = DZ_BOX[0], Hb = DZ_BOX[1], g0 = 3;
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    var lift = y1 > 0 ? y1 : 0, mg = 4;
    y0 -= lift; y1 -= lift;
    var sc = Math.min(1, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (Math.max(0, y1) - (y0 - mg)));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mul(mS(sc), mT(0, -lift))));
    var hc = apply(M, apply(hm, [0, 0]));
    var out = {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q) { return apply(M, q); })),
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })),
      _marks: { M: M, scale: sc }
    };
    if (front) out.front = '<g transform="' + mStr(M) + '">' + front + '</g>';
    if (P.nest) { var ns = apply(M, P.nest); out.nest = { x: Math.round(ns[0] * 10) / 10, y: Math.round(ns[1] * 10) / 10 }; }
    if (hold) { var hc2 = apply(M, hold.c); out.held = { what: 'pebble', at: hold.at === 'front' ? 'paws' : hold.at, x: Math.round(hc2[0] * 10) / 10, y: Math.round(hc2[1] * 10) / 10, r: Math.round(9 * hold.k * sc * 10) / 10 }; }
    if (pawAt) { var pw6 = apply(M, pawAt); out.paw = { x: Math.round(pw6[0] * 10) / 10, y: Math.round(pw6[1] * 10) / 10, r: Math.round(pawAt[2] * sc * 10) / 10 }; }
    return out;
  }

  // ------------------------------------------------------------------ Reynard (chapter 4)
  // The fox at the border: lean and long-legged, about Tallyheart's size sitting (never taller: his
  // ear tips come to hers), longer in the leg and much longer in the tail, and sitting very neatly.
  // Bright red-orange, a cream chin and chest, four black socks he keeps clean, an enormous brush
  // with a white tip. Half-closed amber eyes that don't smile, and a wide closed-mouth smile that is
  // always on, its corner turned up: the mouth's resting shape. No teeth, ever; never a snarl; his
  // mouth never opens. His head is always drawn in three-quarter view, the long muzzle toward the
  // way he faces and his eyes on whoever he is talking to, never out at the reader (never full
  // face). Charming, smug, hushed, wounded, startled: every mood is drawn his way, lids and brows
  // and ears, and the smile stays, except in the `slip` pose (one panel: the smile gone flat, the
  // eyes fully open, the ears back). Extra: `flick: true` (one ear flicks; the smile holds).
  // Laid out in his own units, the ground at y = 0 and his feet about x = 0, facing right; his box
  // is 300 x 230 in the cats' units, his feet centred on its bottom edge.

  // chapter 8 appends 'trot' (along the tracks on all fours, his tail held high, smiling)
  var FOX_POSES = ['sit', 'comb', 'chest', 'think', 'lean', 'flap', 'slip', 'dash', 'trot'];
  OTHER_POSES.reynard = FOX_POSES;
  var FOX_BOX = [300, 230], FOX_SCALE = 0.965;   // (the scale keeps his ear tips under Tallyheart's in every pose and mood)
  var FX = { base: '#e2632a', line: '#7b2d12', light: '#f6975a', cream: '#fbeed6', creamLine: '#cdab80', sock: '#352d2e', sockLine: '#151112', sockLight: '#5a5052',
    tip: '#fffaf0', nose: '#241b1d', eye: '#f3a72e', eyeDark: '#b96f18', pupil: '#2a1d16', earIn: '#f6dcc0', mouth: '#5a2412' };
  FX.shade = mix(FX.base, FX.line, 0.2); FX.far = mix(FX.base, FX.line, 0.14); FX.farShade = mix(FX.base, FX.line, 0.32);
  FX.sockFar = mix(FX.sock, '#000000', 0.22); FX.creamShade = mix(FX.cream, FX.creamLine, 0.45);

  // How each mood sits on his face: `open` how far the lids are up (0.5 is his resting half-closed
  // look), `brow` [the inner end, the outer end] lifted (minus is up), `ear` how far the ears are laid
  // back, `rot` the head's tilt, `gaze` where the pupils sit, `smile` how far the corner turns up.
  var FOX_MOOD = {
    neutral: { open: 0.5 }, happy: { open: 0.42, smile: 1.25, cheek: 1 }, dreamy: { open: 0.5, gaze: [0.4, -1.5], rot: -5 },
    wonder: { open: 0.82, brow: [-2.6, -2.2], ear: -4 }, worried: { open: 0.62, brow: [-3.6, 1.6], ear: 14, smile: 0.8 },
    scared: { open: 0.95, brow: [-3.4, 0], ear: 30, smile: 0.7, tiny: true }, sleepy: { open: 0.08, rot: 6, ear: 8 },
    laugh: { open: 0.3, smile: 1.4, cheek: 1, rot: -6 }, stern: { open: 0.4, brow: [1.8, -0.6], flat: true },
    kind: { open: 0.5, smile: 1.1, brow: [-0.8, 0] }, proud: { open: 0.34, smile: 1.3, rot: -9, brow: [-1.2, -0.6] },
    sniff: { open: 0.5, rot: 5, sniff: true }, shout: { open: 0.72, brow: [-2.2, -1.6], smile: 1.1 },
    solemn: { open: 0.4, flat: true, smile: 0.85, rot: -3 }, sad: { open: 0.56, brow: [-4.4, 2.2], ear: 20, smile: 0.7, rot: 6 },
    shy: { open: 0.46, gaze: [-0.6, 1.5], rot: 8, smile: 0.9 }
  };

  // One of his eyes, in its own coordinates (the inner corner, by the muzzle, at +x): an almond of
  // amber under a heavy lid in his own red. `open` 0..1; a fully open eye (the slip) shows its white.
  function foxEye(R, k, M, far) {
    // (the far eye is drawn mirrored, so its gaze is turned back: both eyes look the same way)
    var open = M.open == null ? 0.5 : M.open, wide = open > 0.9, eid = R.id(), ecl = R.id();
    var EYE_D = wide ? 'M-8.6,0.6Q-2.4,-9.4 8.2,-0.8Q1.6,7.6 -8.6,0.6Z' : 'M-8.6,0.8Q-2,-7.8 8.2,-0.6Q1.5,6.2 -8.6,0.8Z';
    R.defs += '<path id="' + eid + '" d="' + EYE_D + '"/><clipPath id="' + ecl + '"><use href="#' + eid + '"/></clipPath>';
    var g = M.gaze || [1.5, 0], px = clamp(1.2 + g[0], -3, 3.6) * (far ? -1 : 1), py = clamp(-0.3 + g[1], -2, 2), s = '';
    if (open < 0.14) {
      // shut: one soft line
      return '<path d="M-8.4,0.6Q-0.6,3.6 8,-0.4" stroke="' + FX.line + '" stroke-width="' + N(2.3 / k) + '" fill="none" stroke-linecap="round"/>';
    }
    s += '<g clip-path="url(#' + ecl + ')"><use href="#' + eid + '" fill="' + (wide ? '#fff8ea' : FX.eye) + '"/>';
    if (wide) s += '<circle cx="' + N(px - 0.6) + '" cy="' + N(py) + '" r="4.3" fill="' + FX.eye + '" stroke="' + FX.eyeDark + '" stroke-width=".8"/>';
    else s += '<path d="M-10,-9H10V-2.2Q0,-3.4 -10,-1.4Z" fill="' + FX.eyeDark + '" opacity=".55"/>';
    s += '<circle cx="' + N(px) + '" cy="' + N(py) + '" r="' + (M.tiny || wide ? 1.7 : 2.7) + '" fill="' + FX.pupil + '"/>' +
      '<circle cx="' + N(px - 1.5) + '" cy="' + N(py - 1.5) + '" r="' + (far ? 0.8 : 1) + '" fill="#fff"/>';
    // the lid: down from the top to the line `ly` (lower at the outer corner: sleepy, sly, never cross)
    var ly = lerp(3.4, -4.2, open), lyo = ly + (M.flat ? 0.2 : 1.1), lyi = ly - (M.flat ? 0.2 : 0.5);
    if (!wide) s += '<path d="M-11,' + N(lyo) + 'Q-1,' + N(ly - 1.3) + ' 10,' + N(lyi) + 'V-12H-11Z" fill="' + (far ? FX.far : FX.base) + '"/>';
    // a happy cheek pushes the lower lid up a little: the eye narrows from below, the smile never reaches it
    if (M.cheek) s += '<path d="M-11,7Q0,1.4 10,5.4V9H-11Z" fill="' + (far ? FX.far : FX.base) + '"/>';
    s += '</g><use href="#' + eid + '" fill="none" stroke="' + FX.line + '" stroke-width="' + N(1.3 / k) + '" stroke-linejoin="round"/>';
    if (!wide) s += '<path d="M-8.8,' + N(Math.min(1, lyo)) + 'Q-1,' + N(ly - 1.3) + ' 8.4,' + N(Math.min(0, lyi)) + '" stroke="' + FX.line + '" stroke-width="' + N(2.3 / k) + '" fill="none" stroke-linecap="round"/>';
    return s;
  }

  // His head, in head coordinates, three-quarter view toward +x: the far ear, the near ear, the cream
  // ruff of his near cheek, the skull and long muzzle, the eyes, the nose and the closed smile.
  var FOX_HEAD = [[-6, -25], [8, -27], [20, -22.5], [28, -14], [36, -5], [46, 2.6], [53, 6.6], [56, 10.6], [52.6, 15.4],
    [42, 18.6], [30, 21], [18, 24], [6, 28.6], [-8, 30], [-20, 27], [-27, 18], [-29.4, 6], [-28, -8], [-20, -19]];
  function foxEar(d, dIn, dTip, pivot, ang, far) {
    return '<g transform="rotate(' + N(ang) + ' ' + pivot[0] + ' ' + pivot[1] + ')"><path d="' + d + '" fill="' + (far ? FX.far : FX.base) + '" stroke="' + FX.line + '" stroke-width="2.3" stroke-linejoin="round"/>' +
      '<path d="' + dIn + '" fill="' + FX.earIn + '"/><path d="' + dTip + '" fill="' + FX.sock + '" stroke="' + FX.sockLine + '" stroke-width="1.6" stroke-linejoin="round"/></g>';
  }
  function foxHead(R, mood, ctx) {
    var M = {}, src = FOX_MOOD[mood] || FOX_MOOD.neutral, k, s = '', pts = FOX_HEAD.slice();
    for (k in src) M[k] = src[k];
    if (ctx.gaze) M.gaze = ctx.gaze;
    // eyes turned up (thinking, watching his own flapping) lift the lids enough to show them
    if (M.gaze && M.gaze[1] < -1 && (M.open == null ? 0.5 : M.open) > 0.14) M.open = Math.max(M.open == null ? 0.5 : M.open, 0.74);
    if (ctx.slip) { M.open = 1; M.tiny = true; M.brow = [-3.6, -2.6]; M.ear = 46; M.cheek = 0; M.flat = false; M.sniff = false; }
    var back = -(M.ear || 0) - (ctx.earBack || 0), sx = ctx.sx;
    // ears: the far one first; `flick` turns the near one out and back, with two little ticks
    var nearAng = back * 0.9 - (ctx.flick ? 34 : 0), farAng = back * 0.8;
    s += foxEar('M9,-26Q12,-45 22,-58Q30,-42 31,-17Z', 'M14,-26.6Q16,-41 22,-50Q27,-39 27.6,-21.6Z', 'M14.6,-45Q17.4,-52.6 22,-58Q26.2,-51 28.2,-42.6Q21,-46.6 14.6,-45Z', [20, -22], farAng, true);
    s += foxEar('M-25,-13Q-24,-40 -15,-60Q-2,-44 3,-25Z', 'M-19.4,-17Q-18.4,-38 -14.4,-51Q-5.4,-38 -2,-24.6Z', 'M-23,-43.4Q-20,-53 -15,-60Q-9.6,-52.6 -5.6,-43.6Q-14.4,-47.6 -23,-43.4Z', [-11, -19], nearAng, false);
    [[22, -58, 20, -22, farAng], [-15, -60, -11, -19, nearAng], [-25, -13, -11, -19, nearAng], [31, -17, 20, -22, farAng]].forEach(function (e) {
      var m = mul(mT(e[2], e[3]), mul(mR(e[4]), mT(-e[2], -e[3])));
      pts.push(apply(m, [e[0], e[1]]));
    });
    if (ctx.flick) {
      var tipm = mul(mT(-11, -19), mul(mR(nearAng), mT(11, 19))), t0 = apply(tipm, [-15, -60]);
      // (the ticks sit beside the ear, never above it: a flick makes him no taller)
      s += '<path d="M' + pt(add(t0, [-8, -2])) + 'l-7,-3M' + pt(add(t0, [-9, 5])) + 'l-8,1M' + pt(add(t0, [-6, 12])) + 'l-7,4" stroke="' + FX.line + '" stroke-width="1.9" stroke-linecap="round" opacity=".6" fill="none"/>';
      pts.push(add(t0, [-17, -5]), add(t0, [-14, 17]));
    }
    // the cream ruff of his near cheek: soft tufts back and down from under the ear
    s += '<path d="M-12,10L-34,13.6Q-29,18 -25,19.6L-36,27.6Q-28,30 -21,28.6L-25,37.6Q-12,36 -2,27Z" fill="' + FX.cream + '" stroke="' + FX.creamLine + '" stroke-width="2" stroke-linejoin="round"/>';
    pts.push([-36, 27.6], [-34, 13.6], [-25, 37.6]);
    // the skull and muzzle; inside it the cream of the muzzle, chin and cheek
    var inner = '<ellipse cx="2" cy="-18" rx="15" ry="5" transform="rotate(-8 2 -18)" fill="' + FX.light + '" opacity=".55"/>' +
      '<path d="M58,9.4Q46,10.6 34,8.6Q22,7 12,11.6Q2,16.6 -8,10Q-18,4 -31,9.6L-34,40H60Z" fill="' + FX.cream + '"/>' +
      '<path d="M40,-0.6Q32,-6 27,-13" stroke="' + FX.shade + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/>';
    s += R.part(crClosed(FOX_HEAD), { fill: FX.base, dark: FX.shade, line: FX.line, sx: sx * 0.7, sy: -2.6, inner: inner, lw: 2.4 });
    // eyes: the far one smaller, past the bridge of his nose
    var ek = ctx.slip ? 1.16 : 1;
    s += '<g transform="translate(31,-7.6) rotate(-7) scale(' + N(-0.8 * ek) + ',' + N(0.8 * ek) + ')">' + foxEye(R, 0.8, M, true) + '</g>';
    s += '<g transform="translate(10.4,-4.2) rotate(9) scale(' + N(1.22 * ek) + ')">' + foxEye(R, 1.22, M, false) + '</g>';
    // brows: short and calm, never drawn together into a frown
    var br = M.brow || [0, 0], shut = (M.open == null ? 0.5 : M.open) < 0.14;
    var by = -13.6 - (ctx.slip ? 2.4 : 0) + (shut ? 2 : 0);
    s += '<path d="M17.6,' + N(by - 0.6 + br[0]) + 'Q10,' + N(by - 2.6 + (br[0] + br[1]) / 2) + ' 3,' + N(by + 0.8 + br[1]) + '" stroke="' + FX.line + '" stroke-width="2.3" stroke-linecap="round" fill="none" opacity=".85"/>' +
      '<path d="M26,' + N(by - 1.6 + br[0]) + 'Q30,' + N(by - 3 + (br[0] + br[1]) / 2) + ' 35,' + N(by - 0.8 + br[1]) + '" stroke="' + FX.line + '" stroke-width="1.9" stroke-linecap="round" fill="none" opacity=".8"/>';
    // the nose, and a few whiskers swept back
    s += '<path d="M49,5.4Q54,4.2 56.8,7.8Q58,11.6 54.4,13.2Q50.6,13.4 49.4,10.2Q48.6,7.6 49,5.4Z" fill="' + FX.nose + '" stroke="#0e0a0b" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<ellipse cx="52.6" cy="7.6" rx="1.9" ry="1.1" transform="rotate(-20 52.6 7.6)" fill="#fff" opacity=".6"/>';
    s += '<path d="M38,14.6l-8,9.4M34.4,15.2l-10.4,6.6M41.4,15l-4.4,10.4" stroke="' + FX.creamLine + '" stroke-width="1.2" stroke-linecap="round" opacity=".7" fill="none"/>';
    // the mouth: one closed line along the muzzle, its corner turned up into his cheek (the smile that
    // is always on); in the slip it runs flat and stops short. Never open: nothing behind it to draw.
    var sm = M.smile == null ? 1 : M.smile, md;
    if (ctx.slip) md = 'M51,14.6Q38,18.2 23,17.8';
    else md = 'M51,14.6Q40,19.4 26,17.8Q' + N(17.4 - sm * 0.8) + ',' + N(16.8 - sm * 0.2) + ' ' + N(14.6 - sm * 1.9) + ',' + N(13.4 - sm * 3.6);
    s += '<path class="pc-fox-mouth" d="' + md + '" stroke="' + FX.mouth + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    if (!ctx.slip) s += '<path d="M' + N(14.6 - sm * 1.9 - 2.6) + ',' + N(13.4 - sm * 3.6 + 2.4) + 'q-1.8,-2.8 0.8,-5.6" stroke="' + FX.mouth + '" stroke-width="1.5" stroke-linecap="round" fill="none" opacity=".7"/>';
    if (M.sniff) s += '<path d="M62,2q3,-3 6,0t6,0M64,10q3,-3 6,0t6,0M62,18q3,-3 6,0t6,0" stroke="' + FX.line + '" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".6"/>';
    if (M.sniff) pts.push([76, 0], [76, 20]);
    if (ctx.slip) {
      // one bead of worry, flying off his brow
      s += '<path d="M-2,-33q4.6,6.6 0,10q-4.6,-3.4 0,-10Z" transform="rotate(-24 -2 -28)" fill="#cfeaf9" stroke="#6aa6c8" stroke-width="1.2"/>';
      pts.push([-10, -36]);
    }
    return { svg: s, pts: pts };
  }

  // The brush: a tube along a chain of Beziers, slim at the root, full in the middle and drawn to a
  // point, its edge in soft locks that sweep toward the tip, the last quarter white.
  function foxTail(R, segs, o) {
    var maxW = o.maxW || 18;
    var wf = function (u) { return u < 0.55 ? lerp(9, maxW, ss(u / 0.55)) : lerp(maxW, 2.6, Math.pow(ss((u - 0.55) / 0.45), 1.15)); };
    var tb = chainTube(segs, wf, o.bristle ? 13 : 7), C = tb.C, n = C.length, i, d, e = C[n - 1], tip = add(e.p, e.t, e.w + 3);
    // lift a brush that would sink into the ground: all of it but its root
    var low = -1e9;
    tb.pts.forEach(function (q) { low = Math.max(low, q[1]); });
    if (low > -1.5 && !o.lifted) {
      var dl = low + 1.5;
      return foxTail(R, segs.map(function (sg, si) { return sg.map(function (q, qi) { return [q[0], q[1] - (si === 0 && qi === 0 ? Math.min(dl, 8) : dl)]; }); }),
        { maxW: maxW, bristle: o.bristle, far: o.far, sx: o.sx, lifted: true });
    }
    var L = C.map(function (c) { return add(c.p, c.n, c.w); }), Rr = C.map(function (c) { return add(c.p, c.n, -c.w); });
    if (o.bristle) {
      // startled: every lock on end
      var all = L.concat([tip], Rr.slice().reverse());
      d = spiky(all, 5);
    } else {
      d = 'M' + pt(L[0]);
      for (i = 1; i < n; i++) { var a = L[i - 1], b = L[i], nn = C[i].n, bu = Math.min(4.2, C[i].w * 0.3); d += 'Q' + pt(add(lerp2(a, b, 0.72), nn, bu)) + ' ' + pt(b); }
      d += 'Q' + pt(add(lerp2(L[n - 1], tip, 0.5), e.n, 1.4)) + ' ' + pt(tip) + 'Q' + pt(add(lerp2(tip, Rr[n - 1], 0.5), e.n, -1.4)) + ' ' + pt(Rr[n - 1]);
      for (i = n - 1; i > 0; i--) { var a2 = Rr[i], b2 = Rr[i - 1], n2 = C[i].n, bu2 = Math.min(4.2, C[i].w * 0.3); d += 'Q' + pt(add(lerp2(a2, b2, 0.28), n2, -bu2)) + ' ' + pt(b2); }
      d += 'Z';
    }
    // the white tip: everything past a ragged line across the brush at about three quarters
    var c0 = tb.at(0.74), c1 = tb.at(0.8), zig = 'M' + pt(add(c0.p, c0.n, c0.w + 9));
    [[0.62, 1], [0.3, 0], [0, 1], [-0.3, 0], [-0.62, 1]].forEach(function (z) { var c = z[1] ? c1 : c0; zig += 'L' + pt(add(c.p, c.n, c.w * z[0])); });
    zig += 'L' + pt(add(c0.p, c0.n, -(c0.w + 9)));
    var far = [];
    for (i = 0; i < n; i++) if (C[i].u > 0.8) far.push(add(C[i].p, C[i].n, -(C[i].w + 12)));
    far.push(add(tip, e.t, 14));
    for (i = n - 1; i >= 0; i--) if (C[i].u > 0.8) far.push(add(C[i].p, C[i].n, C[i].w + 12));
    zig += far.map(function (q) { return 'L' + pt(q); }).join('') + 'Z';
    var mid = [];
    for (i = 1; i < n - 1; i++) if (C[i].u < 0.7) mid.push(add(C[i].p, C[i].n, UPPER(C[i]) * C[i].w * 0.45));
    var inner = (mid.length > 1 ? '<path d="M' + pt(mid[0]) + cr(mid) + '" stroke="' + FX.light + '" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>' : '') +
      '<path class="pc-fox-tip" d="' + zig + '" fill="' + FX.tip + '"/>';
    var pts = L.concat([tip], Rr).map(function (q) { return q; });
    if (o.bristle) L.concat([tip], Rr).forEach(function (q) { pts.push([q[0] - 6, q[1] - 6], [q[0] + 6, q[1] + 6]); });
    return { svg: R.part(d, { fill: o.far ? FX.far : FX.base, dark: o.far ? FX.farShade : FX.shade, line: FX.line, sx: o.sx * 0.6, sy: -2.2, inner: inner, lw: 2.4 }), pts: pts, at: tb.at, tip: tip };
  }

  // The poses. hip and chest are circles [x, y, r] (the lean torso); neck two circles; head [x, y,
  // rot]; haunch an ellipse; `hind` the lower hind legs (black) and paws; `fore` the forelegs: `up`
  // the red upper leg (two circles), `low` the black sock, `paw` [x, y, rot]; `at` says when a leg
  // is drawn ('back' behind the body, 'tail' after the brush, 'head' after the head; else before the
  // head). `tailAt`: 'back', 'mid' (round his feet, behind his forelegs) or 'front'.
  var FOX_SIT = { hip: [-34, -36, 29], chest: [2, -74, 22], neck: [[4, -87, 15.5], [15, -109, 12.5]], head: [25, -121, 0],
    haunch: [-30, -29, 29, 24, -22],
    hind: [{ foot: [[-20, -9, 7.5], [4, -6.6, 6.4]], paw: [9, -5.8] }],
    fore: [{ up: [[4, -66, 8.5], [14, -36, 6.5]], low: [[14, -36, 6.4], [17, -10, 5.4]], paw: [21.6, -5.6, 0], far: true, at: 'back' },
      { up: [[6, -66, 9], [8, -36, 7]], low: [[8, -36, 6.8], [9, -10, 5.8]], paw: [13.6, -5.6, 0] }],
    tail: [[[-60, -30], [-84, -8], [-34, -20], [-4, -19]], [[-4, -19], [16, -18], [32, -15], [48, -11]]], tailAt: 'mid' };
  function foxPose(pose) {
    var P = {}, k;
    for (k in FOX_SIT) P[k] = FOX_SIT[k];
    switch (pose) {
      case 'comb':
        // combing his enormous tail: the brush brought round and up across his front, the near
        // forepaw drawing its claws down through it, his eyes on the Clan all the while
        P.head = [25, -121, 7];
        P.tail = [[[-60, -30], [-84, -6], [-30, -22], [4, -22]], [[4, -22], [34, -22], [50, -40], [50, -62]], [[50, -62], [50, -78], [47, -92], [40, -102]]];
        P.tailAt = 'front';
        P.fore = [{ up: [[-2, -66, 8.5], [12, -52, 6.5]], low: [[12, -52, 6.4], [30, -44, 5.4]], paw: [36, -42, -20], far: true, at: 'back' },
          { up: [[8, -66, 9], [26, -56, 7]], low: [[26, -56, 6.8], [41, -70, 5.8]], paw: [46, -75, -50], at: 'tail', comb: true }];
        break;
      case 'chest':
        // "I have beautiful manners": a paw laid on his cream chest, his head a little bowed
        P.head = [25, -120, 9];
        P.fore = [FOX_SIT.fore[0], { up: [[8, -68, 9], [24, -57, 7]], low: [[24, -57, 6.8], [12, -76, 5.8]], paw: [8, -81, -128] }];
        break;
      case 'think':
        // eyes up, thinking ("Not the ducks."): a paw to his chin
        P.head = [24, -122, -9]; P.gaze = [0.2, -2];
        P.fore = [FOX_SIT.fore[0], { up: [[8, -68, 9], [29, -62, 7]], low: [[29, -62, 6.8], [40, -86, 5.8]], paw: [42, -92, -78] }];
        break;
      case 'lean':
        // leaning in to whisper ("A DRAGON"): chest forward and low, the far forepaw up beside his muzzle
        P.hip = [-42, -36, 29]; P.chest = [10, -66, 22]; P.neck = [[18, -77, 15.5], [43, -93, 12.5]]; P.head = [56, -101, 11];
        P.haunch = [-38, -29, 29, 24, -18]; P.hind = [{ foot: [[-28, -9, 7.5], [-4, -6.6, 6.4]], paw: [1, -5.8] }];
        P.fore = [{ up: [[10, -62, 8.5], [42, -62, 6.5]], low: [[42, -62, 6.4], [74, -80, 5.4]], paw: [79, -85, -66], far: true, at: 'back' },
          { up: [[16, -58, 9], [24, -34, 7]], low: [[24, -34, 6.8], [27, -10, 5.8]], paw: [31.6, -5.6, 0] }];
        P.tail = [[[-68, -30], [-92, -8], [-42, -20], [-12, -19]], [[-12, -19], [8, -18], [22, -15], [36, -11]]];
        break;
      case 'flap':
        // "Flap! Flap! Flap!": up on his haunches, both forepaws flapping like wings (a pantomime, comic)
        P.hip = [-30, -35, 28.5]; P.chest = [-8, -76, 22]; P.neck = [[-6, -90, 15.5], [2, -110, 12.5]]; P.head = [10, -122, -8]; P.gaze = [0.6, -1.6];
        P.haunch = [-26, -28, 29, 24, -30];
        P.fore = [{ up: [[-12, -74, 8.5], [-38, -86, 6.5]], low: [[-38, -86, 6.4], [-62, -106, 5.4]], paw: [-67, -111, -138], far: true, at: 'back', flap: -1 },
          { up: [[0, -72, 9], [28, -82, 7]], low: [[28, -82, 6.8], [54, -100, 5.8]], paw: [59.6, -104.6, -40], flap: 1 }];
        P.tail = [[[-54, -23], [-92, -29], [-122, -23], [-140, -39]], [[-140, -39], [-156, -55], [-146, -79], [-126, -81]]]; P.tailAt = 'back';
        break;
      case 'slip':
        // one heartbeat: the smile gone flat, the eyes fully open, the ears back, the brush on end
        P.head = [22, -122, -4]; P.slip = true;
        P.tail = [[[-57, -25], [-98, -37], [-128, -33], [-140, -60]], [[-140, -60], [-150, -84], [-134, -104], [-114, -102]]]; P.tailAt = 'back'; P.bristle = true;
        break;
      case 'dash':
        // dashing off into the long grass, tail last: stretched out low, ears back
        P.hip = [-36, -52, 24]; P.chest = [24, -56, 22]; P.neck = [[36, -64, 14.5], [58, -78, 12]]; P.head = [72, -86, 8]; P.earBack = 34;
        P.haunch = null; P.thigh = [-40, -46, 20, 25, 42];
        P.hind = [{ foot: [[-44, -30, 7], [-72, -12, 5.6]], paw: [-80, -8, 26], far: true, at: 'back' }, { foot: [[-52, -38, 8], [-86, -26, 6.2]], paw: [-94, -23, 20] }];
        P.fore = [{ up: [[20, -46, 8.5], [42, -30, 6.5]], low: [[42, -30, 6.4], [66, -12, 5.4]], paw: [72.6, -7, 34], far: true, at: 'back' },
          { up: [[28, -48, 9], [54, -38, 7]], low: [[54, -38, 6.8], [84, -24, 5.8]], paw: [91, -20, 24] }];
        P.tail = [[[-56, -54], [-92, -64], [-130, -74], [-176, -70]]]; P.tailAt = 'back'; P.speed = true;
        break;
      case 'trot':
        // chapter 8: trotting along the tracks, pleased with himself: on all fours, level, his head up,
        // the near forepaw and the far hind paw lifted together, his brush held high in a sweep behind
        P.hip = [-36, -62, 24]; P.chest = [22, -66, 22]; P.neck = [[30, -76, 15], [42, -98, 12.5]]; P.head = [52, -112, 3];
        P.haunch = null; P.thigh = [-38, -58, 20, 26, 10];
        P.hind = [{ foot: [[-36, -44, 7], [-28, -22, 5.6]], paw: [-23, -18, -24], far: true, at: 'back' }, { foot: [[-44, -48, 8], [-54, -10, 6.2]], paw: [-50, -5.8, 0] }];
        P.fore = [{ up: [[14, -60, 8.5], [10, -34, 6.5]], low: [[10, -34, 6.4], [6, -10, 5.4]], paw: [10.6, -5.6, 0], far: true, at: 'back' },
          { up: [[24, -58, 9], [40, -42, 7]], low: [[40, -42, 6.8], [38, -24, 5.8]], paw: [44, -21, -16] }];
        P.tail = [[[-58, -66], [-88, -76], [-108, -98], [-112, -126]], [[-112, -126], [-114, -146], [-100, -162], [-84, -160]]]; P.tailAt = 'back';
        break;
    }
    return P;
  }

  function buildFox(o) {
    o = o || {};
    var pose = FOX_POSES.indexOf(o.pose) >= 0 ? o.pose : 'sit';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), P = foxPose(pose), sx = -2.4 * F, sy = -3.4, pts = [];
    function addPts(a) { pts = pts.concat(a); }
    function part(g, far, inner, lw) { addPts(g.pts); return R.part(g.d, { fill: far ? FX.far : FX.base, dark: far ? FX.farShade : FX.shade, line: FX.line, sx: sx * 0.6, sy: sy * 0.6, inner: inner || '', lw: lw || 2.3 }); }
    function sock(g, far) { addPts(g.pts); return R.part(g.d, { fill: far ? FX.sockFar : FX.sock, dark: FX.sockLine, line: FX.sockLine, sx: sx * 0.5, sy: sy * 0.5, lw: 2.1 }); }
    // a black paw: on the ground a neat oval, two toes marked; raised, a little longer, turned `rot`
    function pawSvg(q, far, comb) {
      var rot = q[2] || 0, g = ellipseG(q[0], q[1], 10, 5.8, rot, 5), s = '';
      addPts(g.pts);
      s += '<path d="' + g.d + '" fill="' + (far ? FX.sockFar : FX.sock) + '" stroke="' + FX.sockLine + '" stroke-width="2.1"/>';
      var toe = function (u, v) { return pt(add(q, rotP([u, v], rot))); };
      if (!far) s += '<path d="M' + toe(3.4, -0.6) + 'L' + toe(3.6, 3.4) + 'M' + toe(6.8, -1) + 'L' + toe(7, 2.6) + '" stroke="' + FX.sockLight + '" stroke-width="1.3" stroke-linecap="round" opacity=".8"/>';
      if (comb) {
        // his claws, drawn down through the fur: four pale tips and the furrows they leave
        var cl = '', lines = '';
        [-3.6, -1.2, 1.2, 3.6].forEach(function (v) {
          var a = add(q, rotP([9, v], rot)), b = add(q, rotP([14.6, v * 1.1], rot));
          cl += '<path d="M' + pt(add(a, rotP([0, -1.1], rot))) + 'L' + pt(b) + 'L' + pt(add(a, rotP([0, 1.1], rot))) + 'Z"/>';
          lines += 'M' + pt(add(q, rotP([17, v * 1.3], rot))) + 'L' + pt(add(q, rotP([31, v * 1.7 + 1.4], rot)));
        });
        s += '<path d="' + lines + '" stroke="' + FX.shade + '" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".8"/>' +
          '<g class="pc-fox-claws" fill="#fdf9ef" stroke="' + FX.sockLine + '" stroke-width=".8" stroke-linejoin="round">' + cl + '</g>';
        addPts([add(q, rotP([32, 0], rot))]);
      }
      return s;
    }
    function foreleg(L) {
      var s = part(hull2(L.up[0], L.up[1], 8), L.far) + sock(hull2(L.low[0], L.low[1], 8), L.far) + pawSvg(L.paw, L.far, L.comb);
      if (L.flap) {
        // the flapping: two arcs sweeping above and below the paw
        var q = L.paw, f = L.flap, a0 = add(q, [f * 10, -16]), b0 = add(q, [f * 16, 6]);
        s += '<path d="M' + pt(a0) + 'q' + N(f * 9) + ',-7 ' + N(f * 3) + ',-17M' + pt(add(a0, [f * 8, 4])) + 'q' + N(f * 7) + ',-5 ' + N(f * 3) + ',-12M' + pt(b0) + 'q' + N(f * 9) + ',6 ' + N(f * 4) + ',16M' + pt(add(b0, [f * 7, -4])) + 'q' + N(f * 6) + ',4 ' + N(f * 3) + ',10' +
          '" stroke="' + FX.line + '" stroke-width="2" stroke-linecap="round" fill="none" opacity=".5"/>';
        addPts([add(a0, [f * 16, -20]), add(b0, [f * 16, 20])]);
      }
      return s;
    }
    function hindleg(L) { return sock(hull2(L.foot[0], L.foot[1], 8), L.far) + pawSvg(L.paw, L.far); }

    // ----- the torso: lean, a soft light along the back, the cream of his chest down its front
    var hip = P.hip, chest = P.chest, tg = hull2(hip, chest, 10);
    var ax = unit([chest[0] - hip[0], chest[1] - hip[1]]), spine = [ax[1], -ax[0]];
    var bib = ellipseG(chest[0] - spine[0] * chest[2] * 0.56 + ax[0] * 2, chest[1] - spine[1] * chest[2] * 0.56 + ax[1] * 2, chest[2] * 0.6, chest[2] * 1.3, deg(ax) + 90 + 8);
    var tIn = '<path d="' + bib.d + '" fill="' + FX.cream + '"/>' +
      '<path d="M' + pt(add(add(hip, spine, hip[2] - 5), ax, 2)) + 'L' + pt(add(add(chest, spine, chest[2] - 5), ax, -4)) + '" stroke="' + FX.light + '" stroke-width="4.4" stroke-linecap="round" opacity=".5"/>';
    var torso = part(tg, false, tIn, 2.5);
    var haunch = '';
    if (P.haunch) haunch = part(ellipseG(P.haunch[0], P.haunch[1], P.haunch[2], P.haunch[3], P.haunch[4], 9), false, '', 2.2);
    if (P.thigh) haunch = part(ellipseG(P.thigh[0], P.thigh[1], P.thigh[2], P.thigh[3], P.thigh[4], 9), false, '', 2.2);
    // ----- the neck, its throat cream
    var nk = hull2(P.neck[0], P.neck[1], 8), nax = unit([P.neck[1][0] - P.neck[0][0], P.neck[1][1] - P.neck[0][1]]), nn = [-nax[1], nax[0]];
    var thr = [add(P.neck[0], nn, P.neck[0][2] * 0.62), add(P.neck[1], nn, P.neck[1][2] * 0.62)];
    var neck = part(nk, false, '<path d="M' + pt(add(thr[0], nax, -14)) + 'L' + pt(add(thr[1], nax, 12)) + '" stroke="' + FX.cream + '" stroke-width="' + N(P.neck[1][2] * 1.1) + '" stroke-linecap="round"/>', 2.3);
    // ----- the brush
    var tl = foxTail(R, P.tail, { sx: sx, bristle: !!P.bristle });
    addPts(tl.pts);
    // ----- the head
    var hrot = P.head[2] + ((FOX_MOOD[mood] || {}).rot || 0) * (pose === 'slip' ? 0 : 1);
    var hm = mul(mT(P.head[0], P.head[1]), mR(hrot));
    var hd = foxHead(R, mood, { sx: sx, slip: !!P.slip, gaze: P.gaze, earBack: P.earBack || 0, flick: !!o.flick });
    var headPts = hd.pts.map(function (q) { return apply(hm, q); });
    addPts(headPts);
    var headSvg = '<g class="pc-fox-head" transform="' + mStr(hm) + '">' + hd.svg + '</g>';

    // ----- assemble back to front
    var body = '', at = function (L, w) { return (L.at || '') === w; };
    if (P.tailAt === 'back') body += tl.svg;
    P.hind.forEach(function (L) { if (at(L, 'back')) body += hindleg(L); });
    P.fore.forEach(function (L) { if (at(L, 'back')) body += foreleg(L); });
    body += torso + haunch;
    P.hind.forEach(function (L) { if (!at(L, 'back')) body += hindleg(L); });
    if (P.tailAt === 'mid') body += tl.svg;
    body += neck;
    P.fore.forEach(function (L) { if (!L.at) body += foreleg(L); });
    if (P.tailAt === 'front') body += tl.svg;
    P.fore.forEach(function (L) { if (at(L, 'tail')) body += foreleg(L); });
    body += headSvg;
    P.fore.forEach(function (L) { if (at(L, 'head')) body += foreleg(L); });
    if (P.speed) {
      body += '<path d="M-150,-34h-34M-166,-48h-26M-140,-22h-24M-190,-92h-22" stroke="' + FX.line + '" stroke-width="2.2" stroke-linecap="round" opacity=".4"/>';
      addPts([[-214, -92], [-192, -22]]);
    }

    // ----- fit: his feet centred at the bottom of his box
    var Wb = FOX_BOX[0], Hb = FOX_BOX[1], g0 = 3, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    var lift = y1, mg = 4;
    y0 -= lift; y1 -= lift;
    var sc = Math.min(FOX_SCALE, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (Math.max(0, y1) - (y0 - mg)));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mul(mS(sc), mT(0, -lift))));
    var hc = apply(M, apply(hm, [13, -1]));
    return {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q) { return apply(M, q); })),
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })),
      _marks: { M: M, scale: sc }
    };
  }

  // ------------------------------------------------------------------ Squall (chapter 4)
  // The littlest dragonet, on the tower roof: a Mistscale built like his sister Sprinkle and about a
  // third her size, no bigger than our cat (sitting, the tips of his nubs come to her ear tips), with
  // a big head and stubby wings. Slate, the dark blue-grey of a storm cloud, with small yellow flecks
  // over his back, his wing edges and the tip of his tail, like sparks; the same matte ridged scales
  // (nothing on him shines either); a paler belly; round shining amber eyes under fierce little
  // brows; two soft nubs for horns; five pale claws on each forepaw. Every hiccup is a jolt that
  // bounces him on the spot, crosses his eyes and puffs one small ring of mist. Lovable and funny,
  // all bluster: never toothy, never frightening.
  // He is drawn with his sister's painters (dzPaw, dzFoot, dzWing, dzEye, the ridges), in his own
  // colours: `DZ` is the palette of the dragonet being drawn (withScales swaps it and puts it back).
  // His box is 250 x 190 in the cats' units, his feet centred on its bottom edge. In the poses where
  // he holds the pole of the red light (`hug`, `roar`, `halt`) the POLE STANDS ON THAT CENTRE LINE,
  // behind him: he sits beside it (on the side away from the way he faces), his forelegs and tail
  // wrapped round it, so a set that puts its pole at the anchor's x has him holding it; the result
  // then carries `pole: { x, w }` (in his box). `pole: true` draws a plain pole there for a page with
  // no set (the gallery, a test). The other poses are centred on his own feet, like anyone's.
  // `pawup` reports `paw: { x, y, r }` (the raised forepaw, for a close-up), and `lit: n` lights the
  // first n of its five claws (the roof's Tap).

  var SQUALL_POSES = ['hug', 'sit', 'roar', 'hiccup', 'halt', 'tall', 'point', 'snap', 'pawup'];
  OTHER_POSES.squall = SQUALL_POSES;
  var SQ_BOX = [250, 190], SQ_HS = 0.74, SQK = 0.56, SQ_POLE_W = 14, SQ_SCALE = 0.93;
  var SQ = { base: '#5f6c7e', line: '#28303c', light: '#8a97a9', belly: '#b6bfc9', bellyLine: '#8f9aa7', ridge: '#74818f', ridgeEdge: '#a7b2be',
    wing: '#8c99aa', vein: '#637082', wingLine: '#394351', claw: '#f4ecd9', clawLine: '#6f6857', nub: '#98a4b2', pad: '#929dab', mouth: '#5d3844', nostril: '#2c3440',
    fleck: '#f6d24e', fleckEdge: '#b98c1e' };
  SQ.shade = mix(SQ.base, SQ.line, 0.2); SQ.far = mix(SQ.base, SQ.line, 0.13); SQ.farShade = mix(SQ.base, SQ.line, 0.3); SQ.wingFar = mix(SQ.wing, SQ.line, 0.16);
  SQ.feat = mix(SQ.line, '#000', 0.2);
  function withScales(pal, fn) { var keep = DZ; DZ = pal; try { return fn(); } finally { DZ = keep; } }

  // his yellow flecks, like sparks: little matte diamonds
  function sqFlecks(list) {
    var s = '';
    list.forEach(function (f, i) {
      var r = f[2] || (i % 2 ? 2.2 : 2.9);
      s += '<path d="M0,' + N(-r) + 'L' + N(r * 0.66) + ',0L0,' + N(r) + 'L' + N(-r * 0.66) + ',0Z" transform="translate(' + N(f[0]) + ',' + N(f[1]) + ') rotate(' + N((i * 37) % 50 - 25) + ')"/>';
    });
    return s ? '<g class="pc-flecks" fill="' + SQ.fleck + '" stroke="' + SQ.fleckEdge + '" stroke-width=".7" stroke-linejoin="round">' + s + '</g>' : '';
  }
  // one small ring of mist, puffed out by a hiccup: little puffs in a ring, drifting up and away
  function mistRing(x, y, k) {
    var c = '';
    for (var i = 0; i < 11; i++) { var a = Math.PI * 2 * i / 11; c += '<circle cx="' + N(Math.cos(a) * 12.5) + '" cy="' + N(Math.sin(a) * 9) + '" r="' + N(3.5 + (i % 3) * 0.5) + '"/>'; }
    return '<g class="pc-mist pc-ring" transform="translate(' + N(x) + ',' + N(y) + ') rotate(-16) scale(' + N(k) + ')">' +
      '<g fill="none" stroke="#9fb0b8" stroke-width="2.4" opacity=".6">' + c + '</g><g fill="#f1f6f8" opacity=".95">' + c + '</g></g>';
  }

  // His head, frontal like his sister's, rounder: a baby's big head. Brows: fierce little ones (the
  // inner ends low) whatever the mood, unless the mood lifts them (worried, scared, sad, shy, wonder).
  var SQ_HEAD = [[0, -46], [-26, -43], [-46, -31], [-56, -12], [-57, 8], [-50, 26], [-36, 39], [-17, 46], [0, 48], [17, 46], [36, 39], [50, 26], [57, 8], [56, -12], [46, -31], [26, -43]];
  var SQ_BROW = { neutral: [5.6, -3.6], stern: [6.4, -4], proud: [5, -4], shout: [5.6, -4.4], solemn: [4.6, -2.6], sniff: [4.6, -3], sleepy: [2.4, -1],
    happy: [3.2, -2.4], laugh: [3.2, -3], kind: [2.6, -1.8], dreamy: [2.4, -2], wonder: [-1.4, -3], worried: [-5.4, 3], scared: [-6.4, 3], sad: [-7, 4], shy: [-3.4, 2] };
  function sqHead(R, mood, ctx) {
    var s = '', pts = SQ_HEAD.slice(), ink = DZ.feat, kind = EYE_KIND[mood] || 'open';
    if (kind === 'lidKind') kind = 'lidSoft';
    if (ctx.cross && (kind === 'open' || kind.indexOf('lid') === 0 || kind === 'arc')) kind = 'wonder';
    if (ctx.squeeze) kind = 'squeeze';
    var droop = mood === 'scared' || mood === 'sad' || mood === 'worried' ? 24 : mood === 'shy' ? 12 : 0;
    [-1, 1].forEach(function (side) {
      // little frills at the sides, and the nubs
      s += '<g transform="translate(' + (side * 51) + ',-12) scale(' + N(side * 0.86) + ',0.86) rotate(' + droop + ')">' +
        '<path d="M-2,-12Q16,-20 24,-8Q26,2 18,8Q8,12 -2,8Z" fill="' + DZ.wing + '" stroke="' + DZ.wingLine + '" stroke-width="2.3" stroke-linejoin="round"/>' +
        '<path d="M2,-4L18,-10M2,2L18,2" stroke="' + DZ.vein + '" stroke-width="2" stroke-linecap="round"/></g>';
      s += '<g transform="translate(' + (side * 19) + ',-40) rotate(' + (side * 16) + ')"><path d="M-8.4,6Q-8.4,-8.4 0,-13Q8.4,-8.4 8.4,6Z" fill="' + DZ.nub + '" stroke="' + DZ.line + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M-3,-5.6Q0,-8.4 3,-5.6" stroke="#ffffff" stroke-width="1.6" fill="none" opacity=".5"/></g>';
      pts.push([side * 75, -24], [side * 75, -2], [side * 26, -55]);
    });
    var inner = '<ellipse cx="-13" cy="-25" rx="21" ry="7.4" transform="rotate(-10 -13 -25)" fill="' + DZ.light + '" opacity=".5"/>' +
      '<path d="M-14,-31q7,-6 14,0q7,-6 14,0M-7,-37q7,-5 14,0" stroke="' + DZ.shade + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>' +
      sqFlecks([[-33, -24], [-20, -37, 2.2], [27, -33], [39, -19, 2.2], [3, -42, 2]]);
    s += R.part(crClosed(SQ_HEAD), { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: ctx.sx * 0.8, sy: -3.6, inner: inner, lw: 2.9 });
    // the snout, paler; nostrils
    s += '<ellipse cx="0" cy="24" rx="30" ry="18.6" fill="' + DZ.belly + '"/><path d="M-25,31Q0,44 25,31" stroke="' + DZ.bellyLine + '" stroke-width="1.8" fill="none" opacity=".7"/>' +
      '<g fill="' + DZ.nostril + '"><ellipse cx="-7.6" cy="15" rx="2.9" ry="2.1" transform="rotate(-20 -7.6 15)"/><ellipse cx="7.6" cy="15" rx="2.9" ry="2.1" transform="rotate(20 7.6 15)"/></g>';
    // eyes: round and shining, his sister's amber; a hiccup crosses them
    var er = 16.5, ex = 24.5, ey = -5, E = dzEyeDefs(R, er), look = ctx.look || [1, 0];
    var ek = kind === 'wonder' ? 1.08 : kind === 'scared' ? 1.05 : 1;
    [-1, 1].forEach(function (side) {
      var lk = ctx.cross ? [-side * 2.5, 0.5] : look;
      s += '<g transform="translate(' + N(side * ex) + ',' + ey + ') scale(' + N(side * ek) + ',' + N(ek) + ')">' + dzEye(kind, er, lk, side, E.gid, E.eid, E.ecl) + '</g>';
    });
    // the fierce little brows
    var br = SQ_BROW[mood] || SQ_BROW.neutral, shut = kind === 'arc' || kind === 'closed' || kind === 'squeeze', by = ey - er - 5.4 - (shut ? 1 : 0) - (kind === 'wonder' ? 1.6 : 0);
    s += '<path class="pc-brows" d="M' + N(-ex + 10) + ',' + N(by + br[0]) + 'L' + N(-ex - 9) + ',' + N(by + br[1]) + 'M' + N(ex - 10) + ',' + N(by + br[0]) + 'L' + N(ex + 9) + ',' + N(by + br[1]) +
      '" stroke="' + DZ.line + '" stroke-width="5" stroke-linecap="round" fill="none"/>';
    if (BLUSH[mood]) s += '<g fill="#f2a3b4" opacity=".38"><ellipse cx="-38" cy="17" rx="8" ry="4.6"/><ellipse cx="38" cy="17" rx="8" ry="4.6"/></g>';
    // the mouth: the mood's, or the pose's (a roar's big round O, a hiccup's little "hic", a snap)
    var mk = ctx.mouth || DZ_MOUTH[mood] || 'soft', my = 31, mo = '', st = ' stroke="' + ink + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"';
    if (mk === 'roar') {
      mo += '<ellipse cx="0" cy="' + (my + 5) + '" rx="15.6" ry="16.4" fill="' + DZ.mouth + '"' + st + '/><ellipse cx="0" cy="' + (my + 14.6) + '" rx="9" ry="5.4" fill="#f08a9c"/>';
      pts.push([0, my + 23]);
    } else if (mk === 'hic') {
      mo += '<ellipse cx="3" cy="' + (my + 2.6) + '" rx="4.4" ry="5" fill="' + DZ.mouth + '"' + st + '/>';
    } else if (mk === 'chomp') {
      mo += '<path d="M-16,' + (my - 2) + 'Q0,' + (my - 5) + ' 16,' + (my - 2) + 'Q14,' + (my + 15) + ' 0,' + (my + 16) + 'Q-14,' + (my + 15) + ' -16,' + (my - 2) + 'Z" fill="' + DZ.mouth + '"' + st + '/>' +
        '<path d="M-8,' + (my + 11) + 'Q0,' + (my + 6) + ' 8,' + (my + 11) + 'Q5,' + (my + 15) + ' 0,' + (my + 15) + 'Q-5,' + (my + 15) + ' -8,' + (my + 11) + 'Z" fill="#f08a9c"/>';
      pts.push([0, my + 18]);
    } else if (mk === 'o' || mk === 'big' || mk === 'gulp') {
      var orx = mk === 'big' ? 10.6 : mk === 'gulp' ? 12 : 6, ory = mk === 'big' ? 11.6 : mk === 'gulp' ? 9 : 6.4;
      mo += '<ellipse cx="0" cy="' + N(my + ory * 0.4) + '" rx="' + orx + '" ry="' + ory + '" fill="' + DZ.mouth + '"' + st + '/>' +
        (mk === 'o' ? '' : '<ellipse cx="0" cy="' + N(my + ory * 0.95) + '" rx="' + N(orx * 0.6) + '" ry="' + N(ory * 0.4) + '" fill="#f08a9c"/>');
      pts.push([0, my + ory * 1.5]);
    } else if (mk === 'open') {
      mo += '<path d="M-14,' + my + 'Q0,' + (my + 3) + ' 14,' + my + 'Q10,' + (my + 15) + ' 0,' + (my + 16) + 'Q-10,' + (my + 15) + ' -14,' + my + 'Z" fill="' + DZ.mouth + '"' + st + '/>' +
        '<path d="M-7,' + (my + 11) + 'Q0,' + (my + 7) + ' 7,' + (my + 11) + 'Q4,' + (my + 15) + ' 0,' + (my + 15) + 'Q-4,' + (my + 15) + ' -7,' + (my + 11) + 'Z" fill="#f08a9c"/>';
      pts.push([0, my + 17]);
    } else {
      var md = {
        soft: 'M-9,' + my + 'Q0,' + (my + 5) + ' 9,' + my,
        smile: 'M-14,' + (my - 2) + 'Q0,' + (my + 10) + ' 14,' + (my - 2),
        wobsmile: 'M-13,' + (my - 1) + 'Q-9,' + (my + 4) + ' -5,' + (my + 3) + 'Q-2,' + (my + 2) + ' 0,' + (my + 5) + 'Q2,' + (my + 2) + ' 5,' + (my + 3) + 'Q9,' + (my + 4) + ' 13,' + (my - 1),
        wavy: 'M-10,' + (my + 3) + 'Q-5,' + (my - 1) + ' 0,' + (my + 2) + 'Q5,' + (my + 5) + ' 10,' + (my + 1),
        // his chin wobbling ("Except everybody.")
        wobble: 'M-12,' + (my + 5.4) + 'Q-9,' + (my - 0.6) + ' -6,' + (my + 2.6) + 'Q-3,' + (my + 5.6) + ' 0,' + (my + 2.4) + 'Q3,' + (my + 5.6) + ' 6,' + (my + 2.6) + 'Q9,' + (my - 0.6) + ' 12,' + (my + 5.4),
        flat: 'M-9,' + (my + 2) + 'Q0,' + (my + 1) + ' 9,' + (my + 2),
        small: 'M-7,' + my + 'Q0,' + (my + 5) + ' 7,' + my
      }[mk] || 'M-9,' + my + 'Q0,' + (my + 5) + ' 9,' + my;
      mo += '<path d="' + md + '" fill="none"' + st + '/>';
      if (mk === 'wobble') mo += '<path d="M-7,' + (my + 11) + 'q3.4,-2.4 7,0t7,0" stroke="' + DZ.bellyLine + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
    }
    s += mo;
    if (mood === 'sniff') s += '<path d="M52,10q3,-3 6,0t6,0M55,19q3,-3 6,0t6,0M52,28q3,-3 6,0t6,0" stroke="' + ink + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>';
    if (mood === 'laugh') s += '<g fill="#9fd6f7" stroke="#5aa6d6" stroke-width="1"><path d="M42,3q3,4 0,6q-3,-2 0,-6Z"/><path d="M-42,3q3,4 0,6q-3,-2 0,-6Z"/></g>';
    if (ctx.snap) {
      s += '<path d="M24,' + (my - 4) + 'l9,-6M27,' + (my + 6) + 'l11,0M24,' + (my + 15) + 'l9,6" stroke="' + ink + '" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".5"/>';
      pts.push([40, my - 12], [40, my + 22]);
    }
    if (ctx.tear) { s += tearSvg(14, 8, 1.5); pts.push([21, 30]); }
    if (ctx.mist) { s += mistSvg(56, my + 2, 1.3); MIST_BOX.forEach(function (q) { pts.push([56 + q[0] * 1.3, my + 2 + q[1] * 1.3]); }); }
    if (ctx.ring) { s += mistRing(74, my - 34, 1.4); pts.push([52, my - 54], [98, my - 54], [52, my - 14], [98, my - 14]); }
    return { svg: s, pts: pts };
  }

  // The poses, in his own units (the ground at y = 0), laid out as his sister's are: hip and chest
  // circles, a haunch, a neck and a tail (chains of Beziers), head [x, y, rot], two arms (the far one
  // first), two hind feet, the wings' root `S` and their states. An arm marked `free` hangs or
  // reaches as it is turned (not resting on the ground).
  var SQ_SIT = { hip: [-14, -30, 28], chest: [6, -52, 23], haunch: [-18, -23, 27, 21, -12],
    feet: [[-10, -3, 0, true], [2, -2, 0]], S: [-12, -60],
    neck: [[[8, -64], [10, -72], [13, -80], [15, -86]]], neckW: [17, 15], head: [16, -98, 0],
    tail: [[[-36, -16], [-58, -7], [-78, -6], [-96, -9]], [[-96, -9], [-110, -11], [-120, -20], [-118, -34]]], tailW: [15, 4.6], tailFront: false,
    arms: [{ top: [4, -50, 8], paw: [8, -4], rot: -10, far: true }, { top: [12, -48, 9], paw: [38, -3], rot: -8 }],
    wings: { near: 'fold', far: 'fold' } };
  // beside the pole (which stands at x = 0): the same sit, 40 to the back, a cheek against the pole,
  // his tail brought round its foot from behind him (it runs behind his own feet, so only its end
  // shows, across the foot of the pole and hooked up on the far side)
  var SQ_POLE = { hip: [-54, -30, 28], chest: [-34, -52, 23], haunch: [-58, -23, 27, 21, -12],
    feet: [[-50, -3, 0, true], [-38, -2, 0]], S: [-52, -60],
    neck: [[[-32, -64], [-32, -72], [-31, -80], [-30, -86]]], head: [-30, -99, 9],
    tail: [[[-70, -16], [-60, -2], [-40, -5], [-20, -6]], [[-20, -6], [-4, -7], [10, -7], [21, -11]], [[21, -11], [31, -15], [32, -29], [22, -34]]], pole: true };
  function sqPose(pose) {
    var P = {}, k;
    for (k in SQ_SIT) P[k] = SQ_SIT[k];
    if (pose === 'hug' || pose === 'roar' || pose === 'halt') for (k in SQ_POLE) P[k] = SQ_POLE[k];
    switch (pose) {
      case 'hug':
        // at the foot of the pole, forelegs and tail wrapped round it, hind feet on the roof
        P.arms = [{ top: [-30, -50, 8], paw: [-8, -57], rot: -8, far: true, claws: 'hold' }, { top: [-24, -44, 9], paw: [-8, -36], rot: 6, claws: 'hold' }];
        P.look = [1.6, 0.2]; break;
      case 'roar':
        // still hugging the pole, head thrown back, his mouth a big round O ("AND STAY OUT, giant dragon!")
        P.arms = [{ top: [-30, -50, 8], paw: [-8, -57], rot: -8, far: true, claws: 'hold' }, { top: [-24, -44, 9], paw: [-8, -36], rot: 6, claws: 'hold' }];
        P.neck = [[[-32, -64], [-36, -72], [-40, -80], [-43, -86]]]; P.head = [-47, -102, -30];
        P.mouth = 'roar'; P.look = [0.6, -1.8]; P.wings = { near: 'stub', far: 'stub' }; break;
      case 'halt':
        // "HALT!": one arm still round the pole, the other out with one claw up
        P.arms = [{ top: [-30, -50, 8], paw: [-8, -46], rot: -2, far: true, claws: 'hold' }, { top: [-24, -47, 9], paw: [22, -76], rot: -80, up: true, claws: 'one' }];
        P.head = [-30, -99, 2]; P.look = [1.8, 0]; break;
      case 'hiccup':
        // a hiccup: bounced off the roof, forepaws flung out, eyes crossed, one ring of mist
        P.arms = [{ top: [2, -52, 8], paw: [-30, -68], rot: -150, far: true, up: true }, { top: [12, -50, 9], paw: [46, -64], rot: -40, up: true }];
        P.head = [16, -100, -5]; P.cross = true; P.mouth = 'hic'; P.ring = true; P.bounce = 7; P.wings = { near: 'stub', far: 'stub' };
        P.tail = [[[-36, -18], [-60, -12], [-84, -18], [-98, -36]], [[-98, -36], [-106, -50], [-100, -62], [-90, -64]]]; break;
      case 'tall':
        // the pole let go ("She IS?"): standing as tall as he can, chest out, wings up
        P.hip = [-6, -40, 26]; P.chest = [4, -68, 23]; P.haunch = [-8, -31, 24, 26, -4]; P.feet = [[-12, -3, 0, true], [2, -2, 0]]; P.S = [-12, -76];
        P.neck = [[[6, -82], [8, -92], [10, -100], [12, -106]]]; P.head = [13, -119, -9];
        // fists on his hips, elbows out
        P.arms = [{ top: [-2, -66, 8], paw: [-12, -51], rot: 62, far: true, claws: 'hold', elbow: [-22, -60] }, { top: [12, -64, 9], paw: [27, -53], rot: 118, claws: 'hold', elbow: [33, -60] }];
        P.tail = [[[-26, -22], [-50, -12], [-74, -10], [-94, -16]], [[-94, -16], [-108, -20], [-116, -32], [-110, -44]]];
        P.wings = { near: 'stub', far: 'stub' }; break;
      case 'point':
        // pointing a claw from beside the pole, out past the camp
        P.arms = [SQ_SIT.arms[0], { top: [12, -50, 9], paw: [50, -57], rot: 8, claws: 'one', free: true }];
        P.head = [18, -98, 3]; P.look = [1.9, 0.5]; break;
      case 'snap':
        // snapping at a moth: neck out, jaws going
        P.neck = [[[8, -64], [15, -73], [22, -82], [28, -88]]]; P.head = [34, -104, -15]; P.mouth = 'chomp'; P.snap = true; P.look = [1.4, -1.5];
        P.arms = [SQ_SIT.arms[0], { top: [12, -50, 9], paw: [44, -38], rot: -28, free: true }];
        P.wings = { near: 'stub', far: 'stub' }; break;
      case 'pawup':
        // one forepaw raised, pads toward us, five claws out ("Tell Sprinkle: five.")
        P.arms = [SQ_SIT.arms[0], { top: [12, -50, 9], paw: [64, -68], rot: -84, up: true, raised: true }];
        P.head = [12, -98, -3]; break;
    }
    return P;
  }

  function buildSquall(o) { o = o || {}; return withScales(SQ, function () { return squallDraw(o); }); }
  function squallDraw(o) {
    var pose = SQUALL_POSES.indexOf(o.pose) >= 0 ? o.pose : 'sit';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), P = sqPose(pose);
    var sx = -2.4 * F, sy = -3.4, pts = [], body = '', pawAt = null;
    function addPts(a) { pts = pts.concat(a); }

    // ----- torso, belly, haunch
    var hip = P.hip, chest = P.chest, tg = hull2(hip, chest, 8);
    var ax = unit([chest[0] - hip[0], chest[1] - hip[1]]), spine = [ax[1], -ax[0]];
    var tIn = '<path d="' + ellipseG(lerp(hip[0], chest[0], 0.55) - spine[0] * chest[2] * 0.55, lerp(hip[1], chest[1], 0.55) - spine[1] * chest[2] * 0.55,
      (dist(hip, chest) / 2 + chest[2]) * 0.8, chest[2] * 0.62, deg(ax)).d + '" fill="' + DZ.belly + '"/>';
    var bands = '';
    for (var bi = 0; bi < 4; bi++) {
      var bt = 0.2 + bi * 0.22, bcn = add(lerp2(hip, chest, bt), spine, -lerp(hip[2], chest[2], bt) * 0.62), bw2 = lerp(hip[2], chest[2], bt) * 0.5;
      bands += 'M' + pt(add(bcn, ax, -bw2 * 0.15)) + 'q' + N(-spine[0] * bw2 * 0.5) + ',' + N(-spine[1] * bw2 * 0.5) + ' ' + N(-spine[0] * bw2) + ',' + N(-spine[1] * bw2);
    }
    tIn += '<path d="' + bands + '" stroke="' + DZ.bellyLine + '" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M' + pt(add(add(hip, spine, hip[2] - 5), ax, 3)) + 'L' + pt(add(add(chest, spine, chest[2] - 5), ax, -3)) + '" stroke="' + DZ.light + '" stroke-width="4" stroke-linecap="round" opacity=".5"/>';
    // sparks along his back
    var fl = [];
    [[0.02, 0.5], [0.3, 0.72], [0.52, 0.42], [0.78, 0.66], [1.02, 0.4]].forEach(function (f) { fl.push(add(lerp2(hip, chest, f[0]), spine, lerp(hip[2], chest[2], clamp(f[0], 0, 1)) * f[1])); });
    tIn += sqFlecks(fl);
    var torso = R.part(tg.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx, sy: sy, inner: tIn, lw: 2.5 });
    addPts(tg.pts);
    var hg = ellipseG(P.haunch[0], P.haunch[1], P.haunch[2], P.haunch[3], P.haunch[4], 8);
    var haunch = R.part(hg.d, { fill: DZ.base, dark: DZ.shade, line: mix(DZ.line, DZ.base, 0.25), lw: 2.3, sx: sx * 0.7, sy: sy * 0.7,
      inner: '<path d="M' + N(P.haunch[0] - P.haunch[2] * 0.5) + ',' + N(P.haunch[1] - P.haunch[3] * 0.25) + 'q6,5 12,0q6,5 12,0" stroke="' + DZ.shade + '" stroke-width="1.8" fill="none" opacity=".6"/>' +
        sqFlecks([[P.haunch[0] - P.haunch[2] * 0.3, P.haunch[1] - P.haunch[3] * 0.55, 2.2]]) });
    addPts(hg.pts);
    var spineTube = { at: function (u) { var c = lerp2(chest, hip, u), r = lerp(chest[2], hip[2], u); return { p: c, n: spine, w: r }; } };
    var torsoRidges = ridgeRow(spineTube, 0.1, 1.02, 4, 0.25, function () { return 1; });

    // ----- neck (short) and tail (stubby beside his sister's)
    var nw = P.neckW, neck = chainTube(P.neck, function (u) { return lerp(nw[0], nw[1], u); }, 6), throat = [];
    neck.C.forEach(function (c) { throat.push(add(c.p, c.n, c.w * 0.5)); });
    var neckSvg = R.part(neck.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx * 0.7, sy: sy * 0.7, lw: 2.3,
      inner: '<path d="M' + pt(throat[0]) + cr(throat) + '" stroke="' + DZ.belly + '" stroke-width="' + N(nw[1] * 0.9) + '" fill="none" stroke-linecap="round"/>' });
    addPts(neck.pts);
    var tw = P.tailW, twf = function (u) { return lerp(tw[0], tw[1], Math.pow(u, 0.9)); }, TS = P.tail;
    var tail = chainTube(TS, twf, 8), tlow = Math.max.apply(null, tail.pts.map(function (q) { return q[1]; }));
    for (var ti = 0; ti < 3 && tlow > -1; ti++) {
      // a tail never sinks into the roof: lift all of it but its root
      var tdy = tlow + 1.5;
      TS = TS.map(function (seg, si) { return seg.map(function (q, qi) { return [q[0], q[1] - (si === 0 && qi === 0 ? Math.min(tdy, 6) : tdy)]; }); });
      tail = chainTube(TS, twf, 8);
      tlow = Math.max.apply(null, tail.pts.map(function (q) { return q[1]; }));
    }
    var tfl = [];
    [[0.7, 0.3], [0.8, -0.35], [0.88, 0.25], [0.95, -0.1]].forEach(function (f) { var a = tail.at(f[0]); tfl.push([a.p[0] + a.n[0] * a.w * f[1], a.p[1] + a.n[1] * a.w * f[1], 2]); });
    var tailSvg = R.part(tail.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx * 0.6, sy: sy * 0.6, lw: 2.3,
      inner: (function () { var c = []; for (var q = 0; q <= 12; q++) { var a = tail.at(q / 12 * 0.66); c.push(add(a.p, a.n, -UPPER(a) * a.w * 0.5)); } return '<path d="M' + pt(c[0]) + cr(c) + '" stroke="' + DZ.belly + '" stroke-width="3.6" fill="none" stroke-linecap="round" opacity=".7"/>'; })() + sqFlecks(tfl) });
    addPts(tail.pts);
    var tailRidges = ridgeRow(tail, 0.08, 0.86, 6, 0.42, UPPER);

    // ----- stubby wings: half the size of anything that could lift him
    var WK = 0.46, S = P.S;
    var nearW = dzWing(P.wings.near, S, false, WK, 0.5), farW = dzWing(P.wings.far, add(S, [-8, -3]), true, WK, 0.5);
    addPts(nearW.pts); addPts(farW.pts);
    function wingFlecks(W) { var w = W.pts[1], f = []; W.pts.slice(3).forEach(function (t, i) { if (i < 3) f.push(lerp2(w, t, 0.8).concat([2])); }); return sqFlecks(f); }

    // ----- arms and paws, feet
    function armSvg(A) {
      var rest = !A.up && !A.free && A.claws !== 'hold' && A.claws !== 'one', off = rest ? 12 * SQK / 1.2 : 0;
      var top = [A.top[0], A.top[1], A.top[2]], end = [A.paw[0], A.paw[1] - off, A.top[2] * 0.66];
      var dv = unit([end[0] - top[0], end[1] - top[1]]), pp = [-dv[1], dv[0]], len = dist(top, end);
      if (Math.abs(dv[1]) < 0.5 ? pp[1] > 0 : pp[0] > 0) pp = [-pp[0], -pp[1]];
      var el = A.elbow || add(lerp2(top, end, 0.46), pp, Math.min(7, len * 0.14)), elc = [el[0], el[1], A.top[2] * 0.82];
      var g1 = hull2(top, elc, 6), g2 = hull2(elc, end, 6);
      var pw = dzPaw(A.paw[0], A.paw[1] - off, rest ? 0 : A.rot, SQK, { far: A.far, pads: A.up, claws: A.claws, rest: rest, lit: A.raised ? clamp(o.lit === true ? 5 : intOr(o.lit, 0), 0, 5) : 0 });
      addPts(g1.pts); addPts(g2.pts); addPts(pw.pts);
      if (A.raised) { var cc = apply(mul(mT(A.paw[0], A.paw[1]), mul(mR(A.rot), mS(SQK))), [26, 0]); pawAt = [cc[0], cc[1], 44 * SQK]; }
      var o2 = { fill: A.far ? DZ.far : DZ.base, dark: A.far ? DZ.farShade : DZ.shade, line: DZ.line, sx: sx * 0.6, sy: sy * 0.6, lw: 2.1 };
      return R.part(g1.d, o2) + R.part(g2.d, o2) + '<circle cx="' + N(el[0]) + '" cy="' + N(el[1]) + '" r="' + N(A.top[2] * 0.82 - 1.1) + '" fill="' + o2.fill + '"/>' + pw.svg;
    }
    var feet = P.feet.map(function (f) { addPts([[f[0] - 14, f[1] - 10], [f[0] + 29, f[1] + 2]]); return dzFoot(f[0], f[1], f[2], 0.5, f[3]); });

    // ----- the head
    var hrot = P.head[2] + (HEAD_ROT[mood] || 0) * 0.6;
    var hm = mul(mT(P.head[0], P.head[1]), mul(mR(hrot), mS(SQ_HS)));
    var hctx = { sx: sx, look: P.look || [1, 0], mouth: P.mouth, cross: !!P.cross, snap: !!P.snap, ring: !!P.ring };
    // a roar is roared with his eyes screwed shut, unless the mood opens them (a frightened roar)
    if (o.squeeze || (pose === 'roar' && !/^(scared|wonder|worried|sad)$/.test(mood))) hctx.squeeze = true;
    if (o.tear) hctx.tear = true;
    if (o.mist) hctx.mist = true;
    var hd = sqHead(R, mood, hctx);
    var headPts = hd.pts.map(function (q) { return apply(hm, q); });
    addPts(headPts);
    var headSvg = '<g transform="' + mStr(hm) + '">' + hd.svg + '</g>';

    // ----- assemble back to front
    if (o.pole) body += '<rect class="pc-pole" x="' + N(-SQ_POLE_W / 2) + '" y="-192" width="' + SQ_POLE_W + '" height="192" fill="#8f939b" stroke="#4c5057" stroke-width="2.2"/>' +
      '<rect x="' + N(-SQ_POLE_W / 2 + 2.4) + '" y="-190" width="2.6" height="188" fill="#c3c6cc" opacity=".7"/>';
    body += farW.svg + wingFlecks(farW);
    if (!P.tailFront) body += ridgesSvg(tailRidges) + tailSvg;
    if (!o.noArms) body += armSvg(P.arms[0]);
    body += feet[0];
    body += ridgesSvg(torsoRidges) + torso + haunch + feet[1];
    if (P.tailFront) body += ridgesSvg(tailRidges) + tailSvg;
    body += nearW.svg + wingFlecks(nearW) + neckSvg;
    body += headSvg;
    if (!o.noArms) body += armSvg(P.arms[1]);
    if (P.bounce) {
      // the jolt: he has left the roof by a claw's width; two little marks where he was
      var by = P.bounce;
      body += '<path d="M-34,' + N(by - 1.6) + 'q8,-5 16,0M2,' + N(by - 1.6) + 'q8,-5 16,0M-56,' + N(by - 3) + 'l-7,-5M40,' + N(by - 3) + 'l7,-5" stroke="' + DZ.line + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".5"/>';
      addPts([[-64, by - 1], [48, by - 1]]);
    }

    // ----- fit: his feet (or, bounced, the marks under them) on the bottom line of his box
    var Wb = SQ_BOX[0], Hb = SQ_BOX[1], g0 = 3, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    var lift = y1 > 0 ? y1 : 0, mg = 4;
    y0 -= lift; y1 -= lift;
    var sc = Math.min(SQ_SCALE, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (Math.max(0, y1) - (y0 - mg)));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    // a pose that holds the pole never slides off it: the pole stays on the centre line
    if (!P.pole) { if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right; }
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mul(mS(sc), mT(0, -lift))));
    var hc = apply(M, apply(hm, [0, 0]));
    var out = {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q) { return apply(M, q); })),
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })),
      _marks: { M: M, scale: sc }
    };
    if (P.pole) out.pole = { x: Wb / 2, w: Math.round(SQ_POLE_W * sc * 10) / 10 };
    if (pawAt) { var pc = apply(M, pawAt); out.paw = { x: Math.round(pc[0] * 10) / 10, y: Math.round(pc[1] * 10) / 10, r: Math.round(pawAt[2] * sc * 10) / 10 }; }
    return out;
  }

  // ------------------------------------------------------------------ Hail (chapter 8)
  // The little speckled dragonet in the hollow log in the Barking Field: a Mistscale on Sprinkle's
  // model (her painters, as Squall and Sleet are drawn), little, about Squall's size (sitting, no
  // taller than our cat). WHITE WITH GREY SPECKLES all over (round, like hailstones' shadows), pale
  // grey ridges along her back, pale grey wing membranes folded small, a creamy belly, two soft horn
  // nubs, big round DARK eyes with a big shine, eager brows (lifted: full of questions), and a bouncy
  // curl at the end of her tail. Plainly not Sleet (silver-white, blue-grey shade, bold blue eyes under
  // bossy brows) and not Wisp (see-through pale): she is solid, warm white, speckled, dark-eyed. Never
  // toothy, never fierce. Her box is 250 x 200 in the cats' units, her feet centred on its bottom edge.
  //   sit      what an unknown pose draws
  //   stand    on all fours, side-on
  //   bounce   mid-hop, all four paws off the ground, wings half out, tail up (BOING)
  //   run      running flat out round the field, wings flapping a little
  //   peek     head and shoulders up, forepaws on a rim (the log's near rim is the field's, over the rest)
  //   pawup    one forepaw raised, curious ("Can I touch it?"); reports `paw`, `lit: n` lights its claws
  //   tilt     her head tilted, full of questions
  // Every mood, drawn her way (Sprinkle's). `tear`, `mist`, `squeeze` as her family's.
  var HAIL_POSES = ['sit', 'stand', 'bounce', 'run', 'peek', 'pawup', 'tilt'];
  OTHER_POSES.hail = HAIL_POSES;
  var HL_BOX = [250, 200], HL_HS = 0.74, HLK = 0.56, HL_SCALE = 0.9;
  var HL = { base: '#f6f4f0', line: '#7a7680', light: '#ffffff', belly: '#fbf3df', bellyLine: '#ddd2b8', ridge: '#c8c9cf', ridgeEdge: '#f0f1f3',
    wing: '#d9dbe0', vein: '#b2b6bf', wingLine: '#8a8f99', claw: '#f8f2e4', clawLine: '#8b8478', nub: '#e2e0e4', pad: '#dedbe0', mouth: '#6a4652', nostril: '#8f8a94',
    speck: '#aaa8b2', speckEdge: '#8d8a95', eye: ['#7c6c72', '#3e3138', '#1f171c'], pupil: '#100c0f', shine: 0.31 };
  HL.shade = mix(HL.base, HL.line, 0.16); HL.far = mix(HL.base, HL.line, 0.12); HL.farShade = mix(HL.base, HL.line, 0.26); HL.wingFar = mix(HL.wing, HL.line, 0.14);
  HL.feat = mix(HL.line, '#000', 0.3); HL.eyeInk = mix(HL.line, '#000', 0.35);

  // her speckles: little round grey dots, a few bigger than the rest
  function hlSpecks(list) {
    var s = '';
    list.forEach(function (f, i) { s += '<circle cx="' + N(f[0]) + '" cy="' + N(f[1]) + '" r="' + N(f[2] || (i % 3 ? 1.9 : 2.7)) + '"/>'; });
    return s ? '<g class="pc-specks" fill="' + HL.speck + '" stroke="' + HL.speckEdge + '" stroke-width=".5">' + s + '</g>' : '';
  }
  // Her head, frontal like her family's, round as a baby's: her brows lifted and soft (eager: never
  // the fierce little brows of her brother Squall), her eyes big, round and dark with a big shine.
  var HL_BROW = { neutral: [-3, -1.6], happy: [-3.6, -1.8], dreamy: [-2, -1.2], wonder: [-5, -2.4], worried: [-6, 2.4], scared: [-7, 2.6], sleepy: [-1, 0],
    laugh: [-3.6, -2], stern: [1.6, -1.6], kind: [-2.6, -1.2], proud: [-2.4, -2.4], sniff: [-2, -1], shout: [-5, -3], solemn: [-1, -1], sad: [-7, 3.6], shy: [-4, 1.6] };
  function hlHead(R, mood, ctx) {
    var s = '', pts = SQ_HEAD.slice(), ink = DZ.feat, kind = EYE_KIND[mood] || 'open';
    if (kind === 'lidKind') kind = 'lidSoft';
    if (ctx.squeeze) kind = 'squeeze';
    var droop = mood === 'scared' || mood === 'sad' || mood === 'worried' ? 22 : mood === 'shy' ? 10 : 0;
    [-1, 1].forEach(function (side) {
      // little soft frills at the sides, pale grey, and the two nubs
      s += '<g transform="translate(' + (side * 50) + ',-10) scale(' + N(side * 0.78) + ',0.78) rotate(' + droop + ')">' +
        '<path d="M-2,-11Q14,-18 22,-7Q24,2 17,7Q8,11 -2,7Z" fill="' + DZ.wing + '" stroke="' + DZ.wingLine + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M2,-3L16,-8M2,2L16,2" stroke="' + DZ.vein + '" stroke-width="1.8" stroke-linecap="round"/></g>';
      s += '<g transform="translate(' + (side * 18) + ',-40) rotate(' + (side * 14) + ')"><path d="M-7.6,6Q-8,-7.4 0,-11.6Q8,-7.4 7.6,6Z" fill="' + DZ.nub + '" stroke="' + DZ.line + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M-2.8,-4.6Q0,-7.2 2.8,-4.6" stroke="#ffffff" stroke-width="1.6" fill="none" opacity=".6"/></g>';
      pts.push([side * 70, -22], [side * 70, -2], [side * 24, -54]);
    });
    var inner = '<ellipse cx="-13" cy="-25" rx="21" ry="7.4" transform="rotate(-10 -13 -25)" fill="' + DZ.light + '" opacity=".6"/>' +
      '<path d="M-14,-31q7,-6 14,0q7,-6 14,0M-7,-37q7,-5 14,0" stroke="' + DZ.shade + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>' +
      hlSpecks([[-36, -20], [-44, -6, 1.8], [-24, -36], [-8, -42, 1.7], [30, -34], [41, -18], [46, -4, 1.8], [10, -40, 2]]);
    s += R.part(crClosed(SQ_HEAD), { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: ctx.sx * 0.8, sy: -3.6, inner: inner, lw: 2.7 });
    // the snout, creamy; two small nostrils
    s += '<ellipse cx="0" cy="24" rx="29" ry="18" fill="' + DZ.belly + '"/><path d="M-24,31Q0,43 24,31" stroke="' + DZ.bellyLine + '" stroke-width="1.8" fill="none" opacity=".7"/>' +
      '<g fill="' + DZ.nostril + '"><ellipse cx="-7" cy="15" rx="2.6" ry="1.9" transform="rotate(-20 -7 15)"/><ellipse cx="7" cy="15" rx="2.6" ry="1.9" transform="rotate(20 7 15)"/></g>';
    // eyes: big, round and dark, a big shine in each
    var er = 18, ex = 24, ey = -4, E = dzEyeDefs(R, er), look = ctx.look || [1, 0];
    var ek = kind === 'wonder' ? 1.08 : kind === 'scared' ? 1.05 : 1;
    [-1, 1].forEach(function (side) {
      s += '<g transform="translate(' + N(side * ex) + ',' + ey + ') scale(' + N(side * ek) + ',' + N(ek) + ')">' + dzEye(kind, er, look, side, E.gid, E.eid, E.ecl) + '</g>';
    });
    // the eager brows: soft arcs, lifted
    var br = HL_BROW[mood] || HL_BROW.neutral, shut = kind === 'arc' || kind === 'closed' || kind === 'squeeze', by = ey - er - 6 - (shut ? 1 : 0) - (kind === 'wonder' ? 1.6 : 0);
    s += '<path class="pc-brows" d="M' + N(-ex + 9) + ',' + N(by + br[0]) + 'Q' + N(-ex) + ',' + N(by + Math.min(br[0], br[1]) - 3) + ' ' + N(-ex - 9) + ',' + N(by + br[1]) +
      'M' + N(ex - 9) + ',' + N(by + br[0]) + 'Q' + N(ex) + ',' + N(by + Math.min(br[0], br[1]) - 3) + ' ' + N(ex + 9) + ',' + N(by + br[1]) +
      '" stroke="' + DZ.line + '" stroke-width="3.4" stroke-linecap="round" fill="none"/>';
    pts.push([0, by - 6]);
    if (BLUSH[mood]) s += '<g fill="#f2a3b4" opacity=".42"><ellipse cx="-38" cy="17" rx="8" ry="4.6"/><ellipse cx="38" cy="17" rx="8" ry="4.6"/></g>';
    // the mouth: the mood's (a squeak's round O, a laugh's open smile: never a tooth)
    var mk = DZ_MOUTH[mood] || 'soft', my = 31, mo = '', st = ' stroke="' + ink + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
    if (mk === 'o' || mk === 'big') {
      var orx = mk === 'big' ? 9.6 : 5.6, ory = mk === 'big' ? 10.6 : 6;
      mo += '<ellipse cx="0" cy="' + N(my + ory * 0.4) + '" rx="' + orx + '" ry="' + ory + '" fill="' + DZ.mouth + '"' + st + '/>' +
        (mk === 'o' ? '' : '<ellipse cx="0" cy="' + N(my + ory * 0.95) + '" rx="' + N(orx * 0.6) + '" ry="' + N(ory * 0.4) + '" fill="#f08a9c"/>');
      pts.push([0, my + ory * 1.5]);
    } else if (mk === 'open') {
      mo += '<path d="M-13,' + my + 'Q0,' + (my + 3) + ' 13,' + my + 'Q9.6,' + (my + 14) + ' 0,' + (my + 15) + 'Q-9.6,' + (my + 14) + ' -13,' + my + 'Z" fill="' + DZ.mouth + '"' + st + '/>' +
        '<path d="M-6.6,' + (my + 10) + 'Q0,' + (my + 6.6) + ' 6.6,' + (my + 10) + 'Q3.8,' + (my + 14) + ' 0,' + (my + 14) + 'Q-3.8,' + (my + 14) + ' -6.6,' + (my + 10) + 'Z" fill="#f08a9c"/>';
      pts.push([0, my + 16]);
    } else {
      var md = {
        soft: 'M-8,' + my + 'Q0,' + (my + 5) + ' 8,' + my,
        smile: 'M-13,' + (my - 2) + 'Q0,' + (my + 10) + ' 13,' + (my - 2),
        wobsmile: 'M-12,' + (my - 1) + 'Q-8,' + (my + 4) + ' -4.6,' + (my + 3) + 'Q-2,' + (my + 2) + ' 0,' + (my + 5) + 'Q2,' + (my + 2) + ' 4.6,' + (my + 3) + 'Q8,' + (my + 4) + ' 12,' + (my - 1),
        wavy: 'M-9,' + (my + 3) + 'Q-4.6,' + (my - 1) + ' 0,' + (my + 2) + 'Q4.6,' + (my + 5) + ' 9,' + (my + 1),
        wobble: 'M-11,' + (my + 5) + 'Q-8,' + (my - 0.6) + ' -5.4,' + (my + 2.6) + 'Q-2.6,' + (my + 5.4) + ' 0,' + (my + 2.4) + 'Q2.6,' + (my + 5.4) + ' 5.4,' + (my + 2.6) + 'Q8,' + (my - 0.6) + ' 11,' + (my + 5),
        flat: 'M-8,' + (my + 2) + 'Q0,' + (my + 0.6) + ' 8,' + (my + 2),
        small: 'M-6.4,' + my + 'Q0,' + (my + 5) + ' 6.4,' + my
      }[mk] || 'M-8,' + my + 'Q0,' + (my + 5) + ' 8,' + my;
      mo += '<path d="' + md + '" fill="none"' + st + '/>';
    }
    s += mo;
    if (mood === 'sniff') s += '<path d="M52,10q3,-3 6,0t6,0M55,19q3,-3 6,0t6,0M52,28q3,-3 6,0t6,0" stroke="' + ink + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>';
    if (mood === 'laugh') s += '<g fill="#9fd6f7" stroke="#5aa6d6" stroke-width="1"><path d="M42,3q3,4 0,6q-3,-2 0,-6Z"/><path d="M-42,3q3,4 0,6q-3,-2 0,-6Z"/></g>';
    if (ctx.tilt) {
      // a question in the air: two little curved marks beside her head
      s += '<path d="M58,-44q6,-8 12,-2q4,6 -4,10l0,4M64,-22v1.6" stroke="' + ink + '" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".55"/>';
      pts.push([74, -50], [74, -18]);
    }
    if (ctx.tear) { s += tearSvg(14, 8, 1.5); pts.push([21, 30]); }
    if (ctx.mist) { s += mistSvg(56, my + 2, 1.3); MIST_BOX.forEach(function (q) { pts.push([56 + q[0] * 1.3, my + 2 + q[1] * 1.3]); }); }
    return { svg: s, pts: pts };
  }

  // Her poses, in her own units (the ground at y = 0), laid out as Squall's are (SQ_SIT): hip and
  // chest circles, a haunch, a neck and a tail (chains of Beziers, her tail ending in a bouncy curl),
  // head [x, y, rot], two forelegs (the far one first), two hind feet, the wings' root `S` and states.
  var HL_CURL = function (x, y, up) {
    // the curl at the end of her tail, from (x, y): over and round, like a spring
    var u = up ? -1 : 1;
    return [[[x, y], [x - 14, y - 6 * u - 4], [x - 20, y - 26], [x - 6, y - 32]], [[x - 6, y - 32], [x + 6, y - 36], [x + 10, y - 22], [x + 1, y - 19]]];
  };
  var HL_SIT = { hip: [-14, -30, 28], chest: [6, -52, 23], haunch: [-18, -23, 27, 21, -12],
    feet: [[-10, -3, 0, true], [2, -2, 0]], S: [-12, -60],
    neck: [[[8, -64], [10, -72], [13, -80], [15, -86]]], neckW: [17, 15], head: [16, -98, 0],
    tail: [[[-36, -16], [-58, -7], [-80, -6], [-96, -14]]].concat(HL_CURL(-96, -14)), tailW: [15, 4.4], tailFront: false,
    arms: [{ top: [4, -50, 8], paw: [8, -4], rot: -10, far: true }, { top: [12, -48, 9], paw: [38, -3], rot: -8 }],
    wings: { near: 'fold', far: 'fold' } };
  function hlPose(pose) {
    var P = {}, k;
    for (k in HL_SIT) P[k] = HL_SIT[k];
    switch (pose) {
      case 'stand':
        // on all fours, side-on: her chest up on straight forelegs, her neck up, her tail out behind and curled.
        // Her four feet stand apart on the ground, each pair stepped (the far one of each pair behind the near
        // one, and clear of it), and her forepaws rest plainly, claws tucked: the Counts pictures count them
        P.hip = [-30, -46, 24]; P.chest = [22, -58, 22]; P.haunch = [-32, -36, 24, 23, -6];
        P.feet = [[-60, -3, 0, true], [-25, -2, 0]]; P.S = [-10, -70];
        P.neck = [[[30, -66], [36, -76], [41, -86], [44, -94]]]; P.head = [48, -108, 0];
        P.arms = [{ top: [12, -56, 8], paw: [10, -4], rot: -10, far: true, claws: 'hold', rest: true }, { top: [28, -54, 9], paw: [46, -3], rot: -8, claws: 'hold', rest: true }];
        P.tail = [[[-52, -46], [-72, -48], [-90, -52], [-102, -60]]].concat(HL_CURL(-102, -60, true)); break;
      case 'bounce':
        // BOING: mid-hop, every paw off the ground, the hind feet tucked, the forepaws out, wings half out, tail up
        P.hip = [-28, -64, 24]; P.chest = [20, -70, 22]; P.haunch = [-30, -56, 24, 23, 18];
        P.feet = [[-44, -34, 28, true], [-30, -30, 22]]; P.S = [-12, -84];
        P.neck = [[[28, -78], [33, -88], [37, -98], [40, -106]]]; P.head = [44, -120, -6]; P.look = [1.2, -0.6];
        P.arms = [{ top: [12, -68, 8], paw: [34, -44], rot: 40, far: true, free: true }, { top: [24, -66, 9], paw: [48, -42], rot: 28, free: true }];
        P.tail = [[[-50, -68], [-66, -78], [-76, -96], [-74, -114]]].concat(HL_CURL(-74, -114, true));
        P.wings = { near: 'stub', far: 'stub' }; P.hop = true; break;
      case 'run':
        // flat out round the field: stretched long, the forelegs reaching, the hind feet pushing off
        // behind, her neck out, her wings flapping a little
        P.hip = [-30, -36, 23]; P.chest = [24, -44, 22]; P.haunch = [-36, -28, 23, 22, 34];
        P.feet = [[-62, -10, 26, true], [-50, -4, 14]]; P.S = [-10, -56];
        P.neck = [[[34, -54], [42, -62], [50, -68], [56, -74]]]; P.head = [62, -86, 6]; P.look = [1.6, 0.2];
        P.arms = [{ top: [16, -44, 8], paw: [52, -22], rot: 6, far: true, free: true }, { top: [28, -42, 9], paw: [66, -8], rot: 0, free: true }];
        P.tail = [[[-52, -36], [-76, -38], [-98, -44], [-112, -56]]].concat(HL_CURL(-112, -56, true));
        P.wings = { near: 'stub', far: 'stub' }; P.speed = true; break;
      case 'peek':
        // popped up out of the log: sitting up tall, both forepaws resting on its rim, leaning out
        P.hip = [-10, -28, 26]; P.chest = [4, -58, 22]; P.haunch = [-14, -22, 25, 20, -14]; P.S = [-8, -66];
        P.neck = [[[8, -70], [11, -78], [14, -86], [16, -92]]]; P.head = [18, -104, -4]; P.look = [1.4, -0.4];
        P.arms = [{ top: [8, -58, 8], paw: [30, -50], rot: 4, far: true, claws: 'hold' }, { top: [16, -56, 9], paw: [44, -48], rot: 6, claws: 'hold' }];
        P.tail = [[[-34, -14], [-50, -8], [-62, -10], [-70, -18]]]; P.tailW = [14, 5]; break;
      case 'pawup':
        // one forepaw raised, pads toward us, five claws out, curious ("Can I touch it?")
        P.arms = [HL_SIT.arms[0], { top: [12, -50, 9], paw: [62, -70], rot: -84, up: true, raised: true }];
        P.head = [12, -98, -6]; P.look = [1.6, -0.6]; break;
      case 'tilt':
        // her head tilted right over, full of questions
        P.head = [18, -96, -24]; P.look = [1.2, -1]; P.tilt = true; break;
    }
    return P;
  }

  function buildHail(o) { o = o || {}; return withScales(HL, function () { return hailDraw(o); }); }
  function hailDraw(o) {
    var pose = HAIL_POSES.indexOf(o.pose) >= 0 ? o.pose : 'sit';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), P = hlPose(pose);
    var sx = -2.4 * F, sy = -3.4, pts = [], body = '', pawAt = null, pawMarks = [];
    function addPts(a) { pts = pts.concat(a); }

    // ----- torso, belly, haunch, speckled all over
    var hip = P.hip, chest = P.chest, tg = hull2(hip, chest, 8);
    var ax = unit([chest[0] - hip[0], chest[1] - hip[1]]), spine = [ax[1], -ax[0]];
    var tIn = '<path d="' + ellipseG(lerp(hip[0], chest[0], 0.55) - spine[0] * chest[2] * 0.55, lerp(hip[1], chest[1], 0.55) - spine[1] * chest[2] * 0.55,
      (dist(hip, chest) / 2 + chest[2]) * 0.8, chest[2] * 0.62, deg(ax)).d + '" fill="' + DZ.belly + '"/>';
    var bands = '';
    for (var bi = 0; bi < 4; bi++) {
      var bt = 0.2 + bi * 0.22, bcn = add(lerp2(hip, chest, bt), spine, -lerp(hip[2], chest[2], bt) * 0.62), bw2 = lerp(hip[2], chest[2], bt) * 0.5;
      bands += 'M' + pt(add(bcn, ax, -bw2 * 0.15)) + 'q' + N(-spine[0] * bw2 * 0.5) + ',' + N(-spine[1] * bw2 * 0.5) + ' ' + N(-spine[0] * bw2) + ',' + N(-spine[1] * bw2);
    }
    tIn += '<path d="' + bands + '" stroke="' + DZ.bellyLine + '" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M' + pt(add(add(hip, spine, hip[2] - 5), ax, 3)) + 'L' + pt(add(add(chest, spine, chest[2] - 5), ax, -3)) + '" stroke="' + DZ.light + '" stroke-width="4" stroke-linecap="round" opacity=".7"/>';
    var sp0 = [];
    [[-0.1, 0.55, 2.8], [0.12, 0.2], [0.25, 0.68], [0.4, 0.38, 2.9], [0.55, 0.72], [0.68, 0.12, 2.2], [0.82, 0.5], [0.98, 0.3, 2.6], [0.3, -0.1, 1.8], [0.62, 0.0, 1.8]].forEach(function (f) {
      var c = add(lerp2(hip, chest, f[0]), spine, lerp(hip[2], chest[2], clamp(f[0], 0, 1)) * f[1]); sp0.push([c[0], c[1], f[2]]);
    });
    tIn += hlSpecks(sp0);
    var torso = R.part(tg.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx, sy: sy, inner: tIn, lw: 2.4 });
    addPts(tg.pts);
    var hg = ellipseG(P.haunch[0], P.haunch[1], P.haunch[2], P.haunch[3], P.haunch[4], 8);
    var haunch = R.part(hg.d, { fill: DZ.base, dark: DZ.shade, line: mix(DZ.line, DZ.base, 0.25), lw: 2.2, sx: sx * 0.7, sy: sy * 0.7,
      inner: '<path d="M' + N(P.haunch[0] - P.haunch[2] * 0.5) + ',' + N(P.haunch[1] - P.haunch[3] * 0.25) + 'q6,5 12,0q6,5 12,0" stroke="' + DZ.shade + '" stroke-width="1.6" fill="none" opacity=".6"/>' +
        hlSpecks([[P.haunch[0] - P.haunch[2] * 0.3, P.haunch[1] - P.haunch[3] * 0.5, 2.4], [P.haunch[0] + P.haunch[2] * 0.25, P.haunch[1] - P.haunch[3] * 0.1, 1.8], [P.haunch[0] - P.haunch[2] * 0.05, P.haunch[1] + P.haunch[3] * 0.35, 2]]) });
    addPts(hg.pts);
    var spineTube = { at: function (u) { var c = lerp2(chest, hip, u), r = lerp(chest[2], hip[2], u); return { p: c, n: spine, w: r }; } };
    var torsoRidges = ridgeRow(spineTube, 0.1, 1.02, 4, 0.25, function () { return 1; });

    // ----- neck and tail (the tail ends in a bouncy curl)
    var nw = P.neckW, neck = chainTube(P.neck, function (u) { return lerp(nw[0], nw[1], u); }, 6), throat = [];
    neck.C.forEach(function (c) { throat.push(add(c.p, c.n, c.w * 0.5)); });
    var neckSvg = R.part(neck.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx * 0.7, sy: sy * 0.7, lw: 2.2,
      inner: '<path d="M' + pt(throat[0]) + cr(throat) + '" stroke="' + DZ.belly + '" stroke-width="' + N(nw[1] * 0.9) + '" fill="none" stroke-linecap="round"/>' +
        hlSpecks([lerp2(neck.C[1].p, neck.C[2].p, 0.5).concat([1.8]), add(neck.C[neck.C.length - 2].p, neck.C[neck.C.length - 2].n, -4).concat([2])]) });
    addPts(neck.pts);
    var tw = P.tailW, twf = function (u) { return lerp(tw[0], tw[1], Math.pow(u, 0.8)); }, TS = P.tail;
    var tail = chainTube(TS, twf, 8), tlow = Math.max.apply(null, tail.pts.map(function (q) { return q[1]; }));
    for (var ti = 0; ti < 3 && tlow > -1; ti++) {
      var tdy = tlow + 1.5;
      TS = TS.map(function (seg, si) { return seg.map(function (q, qi) { return [q[0], q[1] - (si === 0 && qi === 0 ? Math.min(tdy, 6) : tdy)]; }); });
      tail = chainTube(TS, twf, 8);
      tlow = Math.max.apply(null, tail.pts.map(function (q) { return q[1]; }));
    }
    var tsp = [];
    [[0.3, 0.2], [0.48, -0.3], [0.64, 0.25]].forEach(function (f) { var a = tail.at(f[0]); tsp.push([a.p[0] + a.n[0] * a.w * f[1], a.p[1] + a.n[1] * a.w * f[1], 1.9]); });
    var tailSvg = R.part(tail.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx * 0.6, sy: sy * 0.6, lw: 2.2,
      inner: (function () { var c = []; for (var q = 0; q <= 12; q++) { var a = tail.at(q / 12 * 0.6); c.push(add(a.p, a.n, -UPPER(a) * a.w * 0.5)); } return '<path d="M' + pt(c[0]) + cr(c) + '" stroke="' + DZ.belly + '" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".8"/>'; })() + hlSpecks(tsp) });
    addPts(tail.pts);
    var tailRidges = ridgeRow(tail, 0.08, 0.6, 5, 0.42, UPPER);

    // ----- small wings, folded (half out when she bounces or runs)
    var WK = 0.44, S = P.S;
    var nearW = dzWing(P.wings.near, S, false, WK, 0.5), farW = dzWing(P.wings.far, add(S, [-8, -3]), true, WK, 0.5);
    addPts(nearW.pts); addPts(farW.pts);
    function wingSpecks(W) { var w = W.pts[1], f = []; W.pts.slice(3).forEach(function (t, i) { if (i < 3) f.push(lerp2(w, t, 0.62).concat([1.6])); }); return hlSpecks(f); }

    // ----- forelegs and paws, hind feet
    function armSvg(A) {
      // (a resting forepaw: flat on the ground, its fingers close; `rest: true` with claws 'hold' keeps it so,
      // claws tucked: Hail standing)
      var rest = !A.up && !A.free && (A.rest === true || (A.claws !== 'hold' && A.claws !== 'one')), off = rest ? 12 * HLK / 1.2 : 0;
      var top = [A.top[0], A.top[1], A.top[2]], end = [A.paw[0], A.paw[1] - off, A.top[2] * 0.66];
      var dv = unit([end[0] - top[0], end[1] - top[1]]), pp = [-dv[1], dv[0]], len = dist(top, end);
      if (Math.abs(dv[1]) < 0.5 ? pp[1] > 0 : pp[0] > 0) pp = [-pp[0], -pp[1]];
      var el = A.elbow || add(lerp2(top, end, 0.46), pp, Math.min(7, len * 0.14)), elc = [el[0], el[1], A.top[2] * 0.82];
      var g1 = hull2(top, elc, 6), g2 = hull2(elc, end, 6);
      var pw = dzPaw(A.paw[0], A.paw[1] - off, rest ? 0 : A.rot, HLK, { far: A.far, pads: A.up, claws: A.claws, rest: rest, lit: A.raised ? clamp(o.lit === true ? 5 : intOr(o.lit, 0), 0, 5) : 0 });
      addPts(g1.pts); addPts(g2.pts); addPts(pw.pts);
      pawMarks.push(apply(mul(mT(A.paw[0], A.paw[1] - off), mul(mR(rest ? 0 : A.rot), mS(HLK))), [16, 0]));
      if (A.raised) { var cc = apply(mul(mT(A.paw[0], A.paw[1]), mul(mR(A.rot), mS(HLK))), [26, 0]); pawAt = [cc[0], cc[1], 44 * HLK]; }
      var o2 = { fill: A.far ? DZ.far : DZ.base, dark: A.far ? DZ.farShade : DZ.shade, line: DZ.line, sx: sx * 0.6, sy: sy * 0.6, lw: 2 };
      return R.part(g1.d, o2) + R.part(g2.d, o2) + '<circle cx="' + N(el[0]) + '" cy="' + N(el[1]) + '" r="' + N(A.top[2] * 0.82 - 1.1) + '" fill="' + o2.fill + '"/>' + pw.svg;
    }
    var feet = P.feet.map(function (f) {
      var fm = mul(mT(f[0], f[1]), mul(mR(f[2] || 0), mS(0.5)));
      addPts([[f[0] - 14, f[1] - 10], [f[0] + 29, f[1] + 2]].map(function (q, i) { return i ? apply(fm, [57, 4]) : apply(fm, [-28, -22]); }));
      pawMarks.push(apply(fm, [12, -6]));
      return dzFoot(f[0], f[1], f[2], 0.5, f[3]);
    });

    // ----- the head
    var hrot = P.head[2] + (HEAD_ROT[mood] || 0) * 0.6;
    var hm = mul(mT(P.head[0], P.head[1]), mul(mR(hrot), mS(HL_HS)));
    var hctx = { sx: sx, look: P.look || [1, 0], tilt: !!P.tilt };
    if (o.squeeze) hctx.squeeze = true;
    if (o.tear) hctx.tear = true;
    if (o.mist) hctx.mist = true;
    var hd = hlHead(R, mood, hctx);
    var headPts = hd.pts.map(function (q) { return apply(hm, q); });
    addPts(headPts);
    var headSvg = '<g transform="' + mStr(hm) + '">' + hd.svg + '</g>';

    // ----- assemble back to front
    body += farW.svg + wingSpecks(farW);
    if (!P.tailFront) body += ridgesSvg(tailRidges) + tailSvg;
    body += armSvg(P.arms[0]);
    body += feet[0];
    body += ridgesSvg(torsoRidges) + torso + haunch + feet[1];
    if (P.tailFront) body += ridgesSvg(tailRidges) + tailSvg;
    body += nearW.svg + wingSpecks(nearW) + neckSvg;
    body += headSvg;
    body += armSvg(P.arms[1]);
    if (P.hop) {
      // BOING: she is in the air; little marks on the ground where she took off
      body += '<path d="M-44,-1.6q8,-5 16,0M-6,-1.6q8,-5 16,0M-62,-3l-7,-5M30,-3l7,-5" stroke="' + DZ.line + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".5"/>';
      addPts([[-70, -1], [38, -1]]);
    }
    if (P.speed) {
      body += '<path d="M-150,-40h-26M-142,-56h-18M-156,-24h-14" stroke="' + DZ.line + '" stroke-width="2.2" stroke-linecap="round" opacity=".42"/>';
      addPts([[-176, -56], [-142, -24]]);
    }

    // ----- fit: her feet (or, in the air, the marks under them) on the bottom line of her box
    var Wb = HL_BOX[0], Hb = HL_BOX[1], g0 = 3, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    var lift = y1 > 0 ? y1 : 0, mg = 4;
    y0 -= lift; y1 -= lift;
    var sc = Math.min(HL_SCALE, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (Math.max(0, y1) - (y0 - mg)));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mul(mS(sc), mT(0, -lift))));
    var hc = apply(M, apply(hm, [0, 0]));
    var out = {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q) { return apply(M, q); })),
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })),
      // (the Counts pictures light her four paws: the two hind feet, then the two forepaws)
      _marks: { M: M, scale: sc, paws: pawMarks.map(function (q) { return apply(M, q); }) }
    };
    if (pawAt) { var pc = apply(M, pawAt); out.paw = { x: Math.round(pc[0] * 10) / 10, y: Math.round(pc[1] * 10) / 10, r: Math.round(pawAt[2] * sc * 10) / 10 }; }
    return out;
  }

  // ------------------------------------------------------------------ Snip and Snatch (chapter 8)
  // The two weasels by the tracks, sister and brother: long thin bodies, short legs, small round ears,
  // pointed noses, black bead eyes with a shine, short tails; thin brown fur, like the tuft caught on
  // the raft's vine at the Crossing (crossing.js's FUR). Funny, greedy, quick, never cruel: small
  // mouths, NO TEETH OR FANGS EVER, never a snarl. Snip (she) is a little smaller and lighter, golden-
  // brown, with a white chin and bib down her front and a pale tail tip; the squeaky one (her mouth
  // opens a little wider when she talks). Snatch (he) is darker chestnut, with a cream belly, a black
  // tail tip and a round full tummy. Drawn side-on in profile (a pointed nose reads only so), facing
  // right, mirrored for facing left. The box is 220 x 150 in the cats' units, the feet centred on its
  // bottom edge; sitting `up`, the top of Snatch's head is about 88 above his feet (about 0.62 of our
  // cat's, sitting, as scenes.js measures them) and Snip's about 80 (0.57): "half your size", inside
  // scenes.js's SIZE_BAND (0.5 to 0.65), so the scenes draw them as drawn and Snip stays the smaller.
  //   stand    on all fours, the long body low
  //   up       sitting up tall on the hind legs, forepaws tucked: the look-out (what an unknown pose draws)
  //   run      bounding, the back arched
  //   skid     front paws braced, the back end swinging round, dust flying
  //   peek     head and shoulders out of a hole (a set draws the hole's lip over the rest)
  //   point    sitting up, one forepaw out, pointing: the squabble
  //   curl     curled up asleep, the tail round the nose (eyes shut: "two tiny snores")
  // Every mood, drawn their way (`shout` a squeak, `laugh` cheeky, `stern` a pout). Extras: `holds:
  // 'mouse'` (PC.art.prey's mouse, eyes shut, its tail dangling: in the mouth, or at the forepaws
  // sitting up: `holdAt: 'mouth' | 'paws'`, unset 'paws' sitting up and 'mouth' otherwise); `asleep:
  // true` (eyes shut, whatever the mood). The result reports `held` for a mouse.
  var WEASEL_POSES = ['stand', 'up', 'run', 'skid', 'peek', 'point', 'curl'];
  OTHER_POSES.snip = WEASEL_POSES; OTHER_POSES.snatch = WEASEL_POSES;
  var WZ_BOX = [220, 150];
  var WEASELS = {
    snip: { k: 0.77, tummy: 1, pal: { base: '#a8743f', line: '#4c3015', light: '#d6a86e', bib: '#fdf9ef', tip: '#f4e5c3', earIn: '#e6a79d', nose: '#2a1a14', ink: '#1d120d' }, bib: true },
    snatch: { k: 0.85, tummy: 1.3, pal: { base: '#7c4a29', line: '#381f0f', light: '#a9744b', bib: '#f1dfbb', tip: '#1d1513', earIn: '#d79b8e', nose: '#1d1310', ink: '#140c09' }, belly: true }
  };
  function wzPal(src) {
    var f = {}, k;
    for (k in src) f[k] = src[k];
    f.shade = mix(f.base, f.line, 0.2); f.far = mix(f.base, f.line, 0.22); f.farShade = mix(f.base, f.line, 0.36); f.fur = mix(f.base, f.line, 0.45);
    return f;
  }
  // a leg: [top x, y, r], [end x, y, r], the paw [x, y]; `far` behind the body; `point` a forepaw held out pointing
  function wzLeg(top, end, paw, far, extra) { var L = { top: top, end: end, paw: paw, far: !!far }, k; for (k in (extra || {})) L[k] = extra[k]; return L; }
  function wzPose(pose) {
    switch (pose) {
      case 'stand': return {
        body: [[-46, -22], [-22, -30], [6, -30], [26, -26]], bodyW: [11, 12, 10.5], tm: 0.45, haunch: [-40, -20, 13, 12, 0],
        legs: [wzLeg([-36, -18, 5.4], [-33, -4, 3.8], [-31, -2.6], true), wzLeg([18, -22, 5], [21, -4, 3.6], [23, -2.6], true),
          wzLeg([-44, -18, 6.2], [-46, -4, 4.2], [-44, -2.8]), wzLeg([24, -22, 5.6], [30, -4, 4], [32, -2.8])],
        neck: [[[22, -28], [30, -33], [36, -38], [41, -42]]], neckW: [9.5, 8], head: [50, -46, 8],
        tail: [[-54, -24], [-68, -27], [-80, -32], [-90, -38]], tailW: [5.6, 3.2] };
      case 'run': return {
        body: [[-40, -26], [-34, -56], [8, -62], [24, -40]], bodyW: [11, 12, 10.5], tm: 0.5, haunch: [-38, -28, 13, 12, 34],
        legs: [wzLeg([-36, -24, 5.4], [-56, -10, 3.8], [-60, -7.6], true), wzLeg([20, -36, 5], [38, -16, 3.6], [42, -13], true),
          wzLeg([-42, -26, 6.2], [-62, -5, 4.2], [-66, -3], false), wzLeg([26, -34, 5.6], [48, -7, 4], [52, -4.4])],
        neck: [[[22, -40], [30, -43], [37, -45], [43, -47]]], neckW: [9.5, 8], head: [52, -48, 8],
        tail: [[-46, -30], [-60, -36], [-73, -40], [-86, -40]], tailW: [5.6, 3.2], speed: true };
      case 'skid': return {
        body: [[-36, -34], [-20, -32], [4, -26], [22, -24]], bodyW: [11, 12, 10.5], tm: 0.45, haunch: [-34, -32, 13, 12, 22],
        legs: [wzLeg([-30, -30, 5.4], [-44, -20, 3.8], [-48, -18.6], true), wzLeg([16, -22, 5], [34, -4, 3.6], [37, -2.6], true),
          wzLeg([-36, -32, 6.2], [-52, -26, 4.2], [-56, -24.6]), wzLeg([22, -22, 5.6], [42, -4, 4], [45, -2.8])],
        neck: [[[20, -26], [25, -32], [28, -38], [30, -44]]], neckW: [9.5, 8], head: [34, -54, -12],
        tail: [[-44, -36], [-56, -46], [-62, -58], [-58, -70]], tailW: [5.6, 3.2], skid: true };
      case 'peek': return {
        body: [[0, 0], [0, -8], [2, -16], [4, -24]], chain: true, bodyW: [11, 11, 10.5], tm: 0.5,
        legs: [wzLeg([4, -18, 5], [12, -7, 3.6], [14, -4.4], true), wzLeg([8, -18, 5.6], [20, -6, 4], [22, -3.6])],
        neck: [[[4, -22], [6, -28], [8, -34], [10, -38]]], neckW: [9.5, 8], head: [14, -48, -2] };
      case 'point': return {
        body: [[-2, -12], [-2, -30], [2, -46], [6, -58]], bodyW: [13, 11.5, 10], tm: 0.42, haunch: [-4, -10, 14, 11, -10],
        legs: [wzLeg([-6, -6, 5], [6, -3, 3.6], [8, -2.4], true), wzLeg([8, -50, 4.6], [16, -43, 3.4], [17, -41], true),
          wzLeg([2, -6, 6], [14, -3, 4.2], [16, -2.6]), wzLeg([12, -51, 5.2], [34, -54, 3.6], [38, -54.6], false, { point: true })],
        neck: [[[6, -56], [8, -62], [10, -68], [12, -72]]], neckW: [9, 8], head: [17, -82, -4], up: true,
        tail: [[-10, -8], [-26, -4], [-38, -3], [-48, -6]], tailW: [5.6, 3.2] };
      case 'curl': return {
        body: [[[-16, -6], [-28, -20], [-20, -40], [-2, -40]], [[-2, -40], [16, -40], [26, -26], [20, -12]]], chain: true, bodyW: [13, 12.5, 10], tm: 0.5,
        legs: [wzLeg([16, -12, 5], [24, -4, 3.6], [27, -3], false)],
        head: [14, -14, 26], curl: true, asleep: true,
        tail: [[-18, -6], [-4, 2], [22, 0], [36, -10]], tailW: [5.6, 3.4], tailFront: true };
    }
    // up: sitting up tall on the hind legs, forepaws tucked in front of the chest (the look-out)
    return {
      body: [[-2, -12], [-2, -30], [2, -46], [6, -58]], bodyW: [13, 11.5, 10], tm: 0.42, haunch: [-4, -10, 14, 11, -10],
      legs: [wzLeg([-6, -6, 5], [6, -3, 3.6], [8, -2.4], true), wzLeg([8, -50, 4.6], [16, -43, 3.4], [17, -41], true),
        wzLeg([2, -6, 6], [14, -3, 4.2], [16, -2.6]), wzLeg([12, -51, 5.2], [20, -42, 3.8], [21.6, -40])],
      neck: [[[6, -56], [8, -62], [10, -68], [12, -72]]], neckW: [9, 8], head: [17, -82, -4], up: true,
      tail: [[-10, -8], [-26, -4], [-38, -3], [-48, -6]], tailW: [5.6, 3.2] };
  }
  // the moods on a weasel's face: the eye ('bead', 'arc', 'shut', 'half', 'big', 'ring', 'down'), the
  // brow (none, or [inner y, outer y] above the eye), the mouth, and how far the head turns
  var WZ_MOOD = {
    neutral: ['bead', null, 'w', 0], happy: ['arc', null, 'smile', -4], dreamy: ['half', null, 'smile', -6], wonder: ['big', [-2.6, -1], 'o', -4],
    worried: ['bead', [-3, 1.6], 'wavy', 4], scared: ['ring', [-3.4, 1.6], 'o', 4], sleepy: ['shut', null, 'w', 7], laugh: ['arc', null, 'grin', -7],
    stern: ['bead', [1.2, -1.2], 'pout', 2], kind: ['arc', null, 'smile', 0], proud: ['arc', null, 'smile', -10], sniff: ['bead', null, 'w', 4],
    shout: ['big', [-2.4, -1.4], 'squeak', -6], solemn: ['half', [-0.4, -0.4], 'flat', -3], sad: ['down', [-3.4, 1.8], 'frown', 7], shy: ['down', null, 'small', 8]
  };
  var WZ_HEAD = 'M20,1C20,-2 16.4,-5 10.6,-8.2C4.6,-11.4 -4,-13.2 -10,-11.2C-15,-9.4 -17,-3 -16,3C-15,8 -10,10.4 -3,10.4C4.4,10.4 12,8.4 17,5.4C19,4.2 20,3 20,1Z';
  function weaselHead(R, sp, mood, ctx) {
    var p = sp.pal, s = '', pts = [[-17, -14], [21, -12], [21, 11], [-17, 11]], ink = p.ink;
    var M = WZ_MOOD[mood] || WZ_MOOD.neutral, eye = ctx.asleep ? 'shut' : M[0];
    // the far ear just showing behind, the near one round, on top at the back of the head
    s += '<circle cx="-13" cy="-9.4" r="4.4" fill="' + p.far + '" stroke="' + p.line + '" stroke-width="1.5"/>';
    s += '<circle cx="-7" cy="-11.6" r="5.2" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="1.6"/><circle cx="-6.6" cy="-11" r="2.6" fill="' + p.earIn + '"/>';
    pts.push([-12, -17.6], [-1.4, -17.2]);
    var inner = '<path d="M17,5.4C12,8.4 4,10.4 -3,10.4C-8.6,10.4 -12.6,8.6 -14.6,5.4C-8,6.6 2,6.2 10,4.2C13,3.4 15.8,3.8 17,5.4Z" fill="' + p.bib + '"/>' +
      '<ellipse cx="-2" cy="-7" rx="9" ry="2.6" transform="rotate(-12 -2 -7)" fill="' + p.light + '" opacity=".55"/>' +
      '<path d="M-12,-5l2.6,1.2M-13,0l3,0.6M-9.6,-8.4l2.2,1.6" stroke="' + p.fur + '" stroke-width="1" stroke-linecap="round" opacity=".7"/>';
    s += R.part(WZ_HEAD, { fill: p.base, dark: p.shade, line: p.line, sx: ctx.sx * 0.5, sy: -1.6, inner: inner, lw: 1.8 });
    // the nose: a little black bead at the tip, a shine on it
    s += '<ellipse cx="19.2" cy="0.6" rx="2.9" ry="2.3" fill="' + p.nose + '"/><circle cx="18.4" cy="-0.2" r=".8" fill="#ffffff" opacity=".7"/>';
    // whiskers, fine
    s += '<path d="M15,3.6L30,-1M15.4,4.6L31,4M15,5.6L28.6,9" stroke="' + p.light + '" stroke-width=".8" stroke-linecap="round" opacity=".85"/>';
    pts.push([31, -2], [31, 9]);
    // the eye: a black bead with a shine, or the mood's
    var ex = 6, ey = -3.4;
    if (eye === 'arc') s += '<path d="M' + N(ex - 3.6) + ',' + N(ey + 1) + 'Q' + ex + ',' + N(ey - 3.6) + ' ' + N(ex + 3.6) + ',' + N(ey + 1) + '" stroke="' + ink + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
    else if (eye === 'shut') s += '<path d="M' + N(ex - 3.6) + ',' + N(ey) + 'Q' + ex + ',' + N(ey + 2.8) + ' ' + N(ex + 3.6) + ',' + N(ey) + '" stroke="' + ink + '" stroke-width="1.7" fill="none" stroke-linecap="round"/>';
    else {
      var er = eye === 'big' ? 3.8 : eye === 'ring' ? 3.5 : 3.2, ly = eye === 'down' ? 0.9 : 0;
      if (eye === 'ring') s += '<circle cx="' + ex + '" cy="' + ey + '" r="' + N(er + 1.6) + '" fill="#ffffff" stroke="' + ink + '" stroke-width=".9"/>';
      s += '<circle cx="' + ex + '" cy="' + N(ey + ly) + '" r="' + N(er) + '" fill="' + ink + '"/><circle cx="' + N(ex - 1.1) + '" cy="' + N(ey + ly - 1.3) + '" r="' + N(er * 0.36) + '" fill="#ffffff"/>' +
        '<circle cx="' + N(ex + 1.2) + '" cy="' + N(ey + ly + 1.2) + '" r="' + N(er * 0.15) + '" fill="#ffffff" opacity=".9"/>';
      if (eye === 'half') s += '<path d="M' + N(ex - 4.4) + ',' + N(ey - 0.4) + 'Q' + ex + ',' + N(ey - 1.6) + ' ' + N(ex + 4.4) + ',' + N(ey - 0.4) + 'L' + N(ex + 4.4) + ',' + N(ey - 5) + 'L' + N(ex - 4.4) + ',' + N(ey - 5) + 'Z" fill="' + p.base + '" stroke="' + ink + '" stroke-width="1.2" stroke-linejoin="round"/>';
      if (eye === 'down') s += '<path d="M' + N(ex - 4.2) + ',' + N(ey - 1.8) + 'Q' + ex + ',' + N(ey - 3.4) + ' ' + N(ex + 4.2) + ',' + N(ey - 0.8) + '" stroke="' + ink + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
    }
    if (M[1] && eye !== 'shut') s += '<path d="M' + N(ex + 3.6) + ',' + N(ey - 6 + M[1][0]) + 'L' + N(ex - 3.4) + ',' + N(ey - 6 + M[1][1]) + '" stroke="' + ink + '" stroke-width="1.4" stroke-linecap="round" fill="none"/>';
    if (BLUSH[mood]) s += '<ellipse cx="7" cy="4.6" rx="3.6" ry="2" fill="#ff8aa5" opacity=".42"/>';
    // the mouth: small, under the snout; a squeak, a grin or an O open a little (Snip's a little
    // wider), and inside only a dark mouth and a pink tongue: never a tooth
    var mo = '', st = ' stroke="' + ink + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"', wide = sp.squeaky ? 1.25 : 1;
    if (ctx.mouthFull) mo = '';
    else if (M[2] === 'squeak' || M[2] === 'o') {
      var rx = (M[2] === 'squeak' ? 2.4 : 1.8) * wide, ry = (M[2] === 'squeak' ? 3 : 2.2) * wide;
      mo += '<ellipse class="pc-mouth" cx="13.6" cy="' + N(6.4 + ry * 0.4) + '" rx="' + N(rx) + '" ry="' + N(ry) + '" fill="#6e2a35"' + st + '/>';
      if (M[2] === 'squeak') mo += '<ellipse cx="13.6" cy="' + N(6.4 + ry * 1.05) + '" rx="' + N(rx * 0.6) + '" ry="' + N(ry * 0.36) + '" fill="#ef8a9b"/>';
      pts.push([13.6, 7 + ry * 2]);
    } else if (M[2] === 'grin') {
      mo += '<path class="pc-mouth" d="M17.4,4.6Q14.6,' + N(10.6 * wide) + ' 8,6.6Q12.6,6.8 17.4,4.6Z" fill="#6e2a35"' + st + '/><path d="M15,7.6Q12.6,9.6 10.4,7.6" stroke="#ef8a9b" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
    } else {
      var md = { w: 'M17,5.2Q13.4,7.2 10,5.8', smile: 'M17.2,4.8Q13.4,8.6 9.4,5.4', wavy: 'M17,5.4Q15,7.4 13.4,6Q11.8,4.8 10,6.4', frown: 'M17,6.6Q13.4,4.4 10,6.8',
        flat: 'M17,5.6L10.4,6', small: 'M16.6,5.2Q14,7.2 11.4,5.8', pout: 'M17,5.4Q15.6,8.4 13,7.4Q11.6,6.8 10.6,7.2' }[M[2]] || 'M17,5.2Q13.4,7.2 10,5.8';
      mo += '<path class="pc-mouth" d="' + md + '" fill="none"' + st + '/>';
    }
    s += mo;
    if (mood === 'sniff') s += '<path d="M24,-5q2,-2 4,0t4,0M25,1q2,-2 4,0t4,0" stroke="' + ink + '" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".6"/>';
    if (mood === 'laugh') s += '<path d="M-1,-6q2,3 0,4q-2,-1 0,-4Z" fill="#9fd6f7" stroke="#5aa6d6" stroke-width=".7"/>';
    if (mood === 'worried' || mood === 'scared') s += '<path d="M-3,-15q3,5 0,7q-3,-2 0,-7Z" fill="#bfe6fb" stroke="#5aa6d6" stroke-width=".8"/>';
    return { svg: s, pts: pts, turn: M[3] };
  }
  // the mouse a weasel holds: PC.art.prey's (eyes shut), with its tail dangling
  function wzMouse(c, wd, rot, tailDir) {
    var r = rot * Math.PI / 180, back = [c[0] - Math.cos(r) * wd * 0.46, c[1] - Math.sin(r) * wd * 0.46];
    var td = tailDir || [0, 1];
    return '<g class="pc-mouse">' + '<path d="M' + pt(back) + 'q' + N(td[0] * 4 - 2) + ',' + N(td[1] * 8) + ' ' + N(td[0] * 2 + 1) + ',' + N(td[1] * 14) + 'q' + N(td[0] * 2 + 3) + ',' + N(td[1] * 5) + ' ' + N(td[0] * 3 - 1) + ',' + N(td[1] * 10) +
      '" stroke="#c99a92" stroke-width="1.8" fill="none" stroke-linecap="round"/>' + preyHeld('mouse', c[0], c[1], wd, rot, 'right', 'pc-held') + '</g>';
  }
  function buildWeasel(who, o) {
    o = o || {};
    var sp = WEASELS[who] || WEASELS.snip, p = wzPal(sp.pal);
    sp = { pal: p, k: sp.k, tummy: sp.tummy, bib: sp.bib, belly: sp.belly, squeaky: who === 'snip' };
    var pose = WEASEL_POSES.indexOf(o.pose) >= 0 ? o.pose : 'up';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), P = wzPose(pose), sx = -1.8 * F, sy = -2.4, pts = [], body = '', over = '';
    function addPts(a) { pts = pts.concat(a); }
    var asleep = !!o.asleep || !!P.asleep;
    var hold = o.holds === 'mouse' ? (o.holdAt === 'mouth' || o.holdAt === 'paws' ? o.holdAt : pose === 'up' ? 'paws' : 'mouth') : null;
    if (hold === 'paws' && !P.up) hold = 'ground';

    // ----- the long body: a capsule (or a chain, curled), the belly or bib along its underside, thin fur along its back
    var bw = P.bodyW, tk = sp.tummy, wf = function (t) { var w = bodyW(bw, P.tm)(t); return w * (1 + (tk - 1) * Math.sin(Math.PI * clamp((t - 0.15) / 0.6, 0, 1)) * 0.5); };
    var cap = P.chain ? chainTube(Array.isArray(P.body[0][0]) ? P.body : [P.body], function (u) { return wf(u); }, 10) : capsule(P.body, wf, 14);
    var bat = cap.at;
    var band = function (f, col, op) {
      var outer = [], inn = [];
      for (var i = 0; i <= 16; i++) { var t = i / 16, a = bat(t), fr = f(t); outer.push(add(a.p, a.n, a.w + 6)); inn.push(add(a.p, a.n, a.w * (1 - 2 * fr))); }
      return '<path d="M' + pt(outer[0]) + cr(outer) + 'L' + pt(inn[16]) + cr(inn.slice().reverse()) + 'Z" fill="' + col + '"' + (op ? ' opacity="' + op + '"' : '') + '/>';
    };
    var bIn = band(function () { return 0.4; }, p.light, 0.35);
    if (sp.belly) bIn += band(function (t) { return t < 0.08 ? 0 : 0.3 + 0.12 * Math.sin(Math.PI * clamp((t - 0.15) / 0.6, 0, 1)) * tk; }, p.bib);
    if (sp.bib) bIn += band(function (t) { return t < 0.5 ? 0.06 * ss(t / 0.5) : 0.06 + 0.4 * ss((t - 0.5) / 0.32); }, p.bib);
    var fur = '';
    [0.18, 0.34, 0.5, 0.66, 0.82].forEach(function (t, i) { var a = bat(t), q = add(a.p, a.n, -a.w * 0.82); fur += 'M' + pt(q) + 'l' + N(-a.t[0] * 4 - a.n[0] * (i % 2 ? 2 : 3)) + ',' + N(-a.t[1] * 4 - a.n[1] * (i % 2 ? 2 : 3)); });
    bIn += '<path d="' + fur + '" stroke="' + p.fur + '" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".7"/>';
    var bodySvg = R.part(cap.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx, sy: sy, inner: bIn, lw: 1.9 });
    addPts(cap.pts);
    var haunch = '';
    if (P.haunch) {
      var hg = ellipseG(P.haunch[0], P.haunch[1], P.haunch[2], P.haunch[3], P.haunch[4], 8);
      haunch = R.part(hg.d, { fill: p.base, dark: p.shade, line: mix(p.line, p.base, 0.25), lw: 1.7, sx: sx * 0.7, sy: sy * 0.7,
        inner: '<path d="M' + N(P.haunch[0] - P.haunch[2] * 0.4) + ',' + N(P.haunch[1] - P.haunch[3] * 0.4) + 'l3,1.6M' + N(P.haunch[0]) + ',' + N(P.haunch[1] - P.haunch[3] * 0.62) + 'l3,1.4" stroke="' + p.fur + '" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>' });
      addPts(hg.pts);
    }
    // ----- the neck (its throat the bib's colour), the short tail (its tip pale, or black)
    var neckSvg = '';
    if (P.neck) {
      var nk = chainTube(P.neck, function (u) { return lerp(P.neckW[0], P.neckW[1], u); }, 6), thr = [];
      nk.C.forEach(function (c) { thr.push(add(c.p, c.n, c.w * 0.62)); });
      neckSvg = R.part(nk.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, lw: 1.8,
        inner: '<path d="M' + pt(thr[0]) + cr(thr) + '" stroke="' + p.bib + '" stroke-width="' + N(P.neckW[1] * (sp.bib ? 0.95 : 0.7)) + '" fill="none" stroke-linecap="round"/>' });
      addPts(nk.pts);
    }
    var tailSvg = '';
    if (P.tail) {
      var tlw = function (t) { return lerp(P.tailW[0], P.tailW[1], t); }, tl = tube(P.tail, tlw, 8), tip = tl.at(1);
      var tipIn = '';
      for (var q = 0.72; q <= 1.001; q += 0.07) { var ta = tl.at(Math.min(1, q)); tipIn += '<circle cx="' + N(ta.p[0]) + '" cy="' + N(ta.p[1]) + '" r="' + N(ta.w * 2.4) + '"/>'; }
      tipIn = '<g fill="' + p.tip + '">' + tipIn + '<circle cx="' + N(tip.p[0] + tip.t[0] * 3) + '" cy="' + N(tip.p[1] + tip.t[1] * 3) + '" r="' + N(tip.w * 2.6) + '"/></g>';
      tailSvg = R.part(tl.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx * 0.5, sy: sy * 0.5, lw: 1.7, inner: tipIn });
      addPts(tl.pts);
    }
    // ----- the legs, short, and the paws (a forepaw held out pointing: one claw-less toe forward)
    var heldAt = null;
    function legSvg(L) {
      var g = hull2(L.top, L.end, 6), col = L.far ? p.far : p.base, dk = L.far ? p.farShade : p.shade;
      var s2 = R.part(g.d, { fill: col, dark: dk, line: p.line, sx: sx * 0.4, sy: sy * 0.4, lw: 1.6 });
      var pe = ellipseG(L.paw[0] + (L.point ? 1.5 : 0.8), L.paw[1], L.point ? 4.6 : 5.2, 3, L.point ? 0 : 0, 5);
      s2 += '<path d="' + pe.d + '" fill="' + col + '" stroke="' + p.line + '" stroke-width="1.5"/>';
      if (L.point) s2 += '<path d="M' + N(L.paw[0] + 4) + ',' + N(L.paw[1] - 0.6) + 'l6,-1.4" stroke="' + p.line + '" stroke-width="2.6" stroke-linecap="round"/><path d="M' + N(L.paw[0] + 4) + ',' + N(L.paw[1] - 0.6) + 'l6,-1.4" stroke="' + col + '" stroke-width="1.2" stroke-linecap="round"/>';
      addPts(g.pts); addPts(pe.pts);
      if (L.point) addPts([[L.paw[0] + 12, L.paw[1] - 3]]);
      return s2;
    }
    var farLegs = '', nearLegs = '';
    P.legs.forEach(function (L) { if (L.far) farLegs += legSvg(L); else nearLegs += legSvg(L); });
    // ----- the head
    var hd = weaselHead(R, sp, mood, { sx: sx, asleep: asleep, mouthFull: hold === 'mouth' });
    var hrot = P.head[2] + (P.curl ? 0 : hd.turn);
    var hm = mul(mT(P.head[0], P.head[1]), mR(hrot));
    var headSvg = '<g transform="' + mStr(hm) + '">' + hd.svg + '</g>';
    addPts(hd.pts.map(function (q2) { return apply(hm, q2); }));
    // ----- the mouse: across the jaws, its tail dangling; or held up against the chest between the forepaws
    var mouseSvg = '';
    if (hold === 'mouth') {
      var mc = apply(hm, [13, 8.6]);
      mouseSvg = '<g transform="' + mStr(hm) + '">' + wzMouse([13, 8.6], 28, -4, [-0.2, 1]) + '</g>';
      heldAt = mc; addPts([apply(hm, [-3, 2]), apply(hm, [29, 2]), apply(hm, [-3, 30]), apply(hm, [29, 16])]);
    } else if (hold === 'paws') {
      // (pointing, the near forepaw is busy: the mouse is in the far one, tucked)
      var fp = P.legs.filter(function (L) { return L.top[1] < -30 && !L.point && (pose === 'point' ? L.far : !L.far); })[0] || P.legs[P.legs.length - 1];
      var pc = [fp.paw[0] + 1, fp.paw[1] + 6];
      mouseSvg = wzMouse(pc, 26, -72, [0.3, 1]);
      heldAt = pc; addPts([[pc[0] - 10, pc[1] - 16], [pc[0] + 10, pc[1] + 30]]);
    } else if (hold === 'ground') {
      var gp = P.legs.filter(function (L) { return !L.far; }).reduce(function (a, L) { return !a || L.paw[0] > a.paw[0] ? L : a; }, null);
      var gc = [gp.paw[0] + 18, -5];
      mouseSvg = wzMouse(gc, 26, 0, [-1, 0.1]);
      heldAt = gc; addPts([[gc[0] - 16, gc[1] - 8], [gc[0] + 14, 0]]);
    }
    // ----- assemble back to front
    if (!P.tailFront) body += tailSvg;
    body += farLegs + haunch + bodySvg + neckSvg + nearLegs;
    if (P.tailFront) body += tailSvg;
    if (hold === 'paws') body += mouseSvg;
    body += headSvg;
    if (hold === 'mouth' || hold === 'ground') body += mouseSvg;
    if (P.curl && hold !== 'mouth') {
      // two tiny snores: little z's drifting up
      body += '<g class="pc-zz" fill="none" stroke="' + p.line + '" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity=".55"><path d="M30,-34h5l-5,5h5"/><path d="M38,-46h4l-4,4h4"/></g>';
      addPts([[30, -48], [43, -28]]);
    }
    if (P.speed) { body += '<path d="M-100,-30h-20M-94,-42h-14M-104,-18h-12" stroke="' + p.line + '" stroke-width="1.8" stroke-linecap="round" opacity=".42"/>'; addPts([[-120, -42], [-94, -18]]); }
    if (P.skid) {
      // the braced front paws ploughing up dust, and the back end swinging round
      body += '<g fill="#d8c7a4" stroke="#8e7a58" stroke-width="1.1" opacity=".85"><circle cx="54" cy="-5" r="4.6"/><circle cx="60" cy="-10" r="3.4"/><circle cx="49" cy="-11" r="2.8"/></g>' +
        '<path d="M8,-1.4h22M-8,-1.4h10" stroke="' + p.line + '" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>' +
        '<path d="M-62,-40q-10,10 -6,24M-70,-34q-8,8 -5,18" stroke="' + p.line + '" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".42"/>';
      addPts([[64, -15], [-74, -40], [-74, -10]]);
    }

    // ----- fit: the feet centred on the bottom of the box, every weasel at the same scale (Snip a little smaller)
    var Wb = WZ_BOX[0], Hb = WZ_BOX[1], g0 = 3, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    pts.forEach(function (q3) { x0 = Math.min(x0, q3[0]); x1 = Math.max(x1, q3[0]); y0 = Math.min(y0, q3[1]); y1 = Math.max(y1, q3[1]); });
    var lift = y1 > 0 ? y1 : 0, mg = 3;
    y0 -= lift; y1 -= lift;
    var sc = Math.min(sp.k, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (Math.max(0, y1) - (y0 - mg)));
    var cx0 = (x0 + x1) / 2, left = Wb / 2 + (x0 - cx0 * (P.up || P.curl || pose === 'peek' ? 0 : 1) - mg) * sc, dx = 0;
    // (an animal on all fours is centred on its whole length; sitting up, on its feet)
    var ox = P.up || P.curl || pose === 'peek' ? 0 : -cx0;
    left = Wb / 2 + (x0 + ox - mg) * sc;
    var right = Wb / 2 + (x1 + ox + mg) * sc;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mul(mS(sc), mT(ox, -lift))));
    var hc = apply(M, apply(hm, [2, -1]));
    var out = {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + over + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(hd.pts.map(function (q4) { return apply(M, apply(hm, q4)); })),
      bounds: boxOf(pts.map(function (q5) { return apply(M, q5); })),
      _marks: { M: M, scale: sc }
    };
    if (heldAt) { var hcM = apply(M, heldAt); out.held = { what: 'mouse', at: hold === 'ground' ? 'paws' : hold, x: Math.round(hcM[0] * 10) / 10, y: Math.round(hcM[1] * 10) / 10, r: Math.round(15 * sc * 10) / 10 }; }
    return out;
  }

  // ------------------------------------------------------------------ Patience (chapter 5)
  // A great blue heron, the marsh's eyewitness: taller than Tallyheart, standing on one leg in the
  // shallows. Blue-grey, a long neck held in an S, a white face with a black stripe that runs back
  // into a thin plume, a long yellow bill, one round yellow eye to the viewer, long dark legs. Drawn
  // in profile, facing right, and mirrored for facing left: HER HEAD NEVER TURNS (to look at the
  // raft only her eye does; to point at the mud her whole neck reaches down). One mood, level, in
  // every pose: `mood` is accepted and changes nothing. Her box is 330 x 460 in the cats' units (she
  // stands about 320 tall; the room above is for `gulp`, her neck stretched up), her standing foot
  // on the centre of its bottom edge.
  //   stand    one leg, neck folded
  //   eye      the near eye turned down to the raft
  //   shut     the eye shut (`squeeze: true`: shut tight, the picture of both eyes shut)
  //   point    the bill pointing down at the mud
  //   gulp     the neck up, a fish going down as a small bump
  //   full     the neck a little rounder
  //   feather  one grey feather lifted at the back of her head: her grin
  // `dragonfly: true` puts the dragonfly asleep on her bill (the marsh set's `dragonfly` option
  // says where it is in a panel; the result's `bill` is where it sits, for a set that draws its
  // own). The thought cloud of owed fish is the marsh set's.
  var HERON_POSES = ['stand', 'eye', 'shut', 'point', 'gulp', 'full', 'feather'];
  OTHER_POSES.patience = HERON_POSES;
  var HN_BOX = [330, 460];
  var HN = { body: '#8799ad', line: '#3b4757', light: '#b2c0cf', wing: '#74879d', wingEdge: '#55657a', dark: '#46546a', neck: '#b7c1ce', front: '#f5f3ec', streak: '#4b5666',
    face: '#fbf9f3', cap: '#242a33', bill: '#f0bf38', billTop: '#d59c22', billLine: '#7c5c16', eye: '#f8d840', eyeRing: '#b98f14', pupil: '#17161c',
    leg: '#6f695e', legLine: '#34312c', thigh: '#a67a5c', plume: '#dfe6ec' };
  HN.shade = mix(HN.body, HN.line, 0.2);
  var HN_POSE = {
    stand: { neck: [[[38, -190], [66, -212], [52, -240], [30, -252]], [[30, -252], [8, -264], [10, -290], [30, -300]]], head: [45, -307, 4] },
    point: { neck: [[[38, -190], [62, -218], [80, -226], [95, -216]]], head: [109, -205, 62] },
    gulp: { neck: [[[38, -190], [60, -228], [28, -272], [46, -322]]], head: [50, -340, -58], bump: [0.55, 9, 0.08] }
  };
  var HN_HS = 1.3;   // her head's scale: bigger than a real heron's, so her eye can be read
  function buildPatience(o) {
    o = o || {};
    var pose = HERON_POSES.indexOf(o.pose) >= 0 ? o.pose : 'stand';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), P = HN_POSE[pose] || HN_POSE.stand;
    var sx = -2.2 * F, sy = -3.2, pts = [], s = '';
    function addPts(a) { pts = pts.concat(a); }
    function ln(d, col, w, extra) { return '<path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" fill="none" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/>'; }
    // a long thin leg: a dark line with a paler one inside it
    function leg(list, far) {
      var d = 'M' + list.map(pt).join('L');
      return ln(d, HN.legLine, 8) + ln(d, far ? mix(HN.leg, HN.legLine, 0.35) : HN.leg, 4.8);
    }
    // ----- the leg she stands on: thigh, the joint that bends backward, the long shank, three toes forward and one back
    var stand = leg([[2, -130], [-6, -68], [0, -4]]) + '<circle cx="-6" cy="-68" r="4.8" fill="' + HN.leg + '" stroke="' + HN.legLine + '" stroke-width="1.6"/>' +
      leg([[0, -4], [27, -1.6]]) + leg([[0, -4], [20, -7.4]]) + leg([[0, -4], [-13, -1.6]]);
    addPts([[-15, 0], [29, 0], [-10, -68]]);
    // the other, folded up under her
    var tuck = leg([[16, -128], [32, -104], [14, -98]], true) + leg([[14, -98], [7, -92]], true) + leg([[14, -98], [9, -101.5]], true);
    // ----- the body: a long egg, tilted, the chest high; the folded wing over it, its long dark flight feathers reaching past the tail
    var bodyD = crClosed([[47, -196], [22, -215], [-20, -207], [-56, -178], [-80, -148], [-56, -141], [-16, -128], [24, -136], [47, -164]]);
    var wingD = crClosed([[30, -201], [0, -208], [-36, -196], [-70, -162], [-90, -138], [-58, -146], [-22, -146], [16, -158]]);
    var feathers = '';
    [[-4, -170, 26], [-26, -164, 24], [-46, -156, 20], [8, -182, 22], [-14, -184, 22], [-36, -178, 20]].forEach(function (f) {
      feathers += 'M' + N(f[0] + f[2] * 0.5) + ',' + N(f[1] - 5) + 'Q' + N(f[0]) + ',' + N(f[1] + 8) + ' ' + N(f[0] - f[2] * 0.5) + ',' + N(f[1] - 3);
    });
    var body = R.part(bodyD, { fill: HN.body, dark: HN.shade, line: HN.line, sx: sx, sy: sy, lw: 2.4,
      inner: '<ellipse cx="12" cy="-146" rx="36" ry="13" fill="' + HN.light + '" opacity=".75"/>' });
    var wing = R.part(wingD, { fill: HN.wing, dark: mix(HN.wing, HN.line, 0.2), line: HN.line, sx: sx * 0.7, sy: sy * 0.7, lw: 2.2,
      inner: '<path d="M-34,-176L-96,-128L-52,-140Z" fill="' + HN.dark + '"/><path d="' + feathers + '" stroke="' + HN.wingEdge + '" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>' +
        '<path d="M-58,-160L-82,-140M-48,-156L-70,-140" stroke="' + HN.line + '" stroke-width="1.4" opacity=".55"/>' });
    addPts([[49, -198], [-92, -136], [-18, -126], [20, -217]]);
    // long pale plumes: three over the chest, two down her back
    var plumes = ln('M40,-186Q46,-166 38,-146', HN.line, 4.2) + ln('M40,-186Q46,-166 38,-146', HN.plume, 2.4) +
      ln('M34,-184Q36,-164 28,-150', HN.line, 4.2) + ln('M34,-184Q36,-164 28,-150', HN.plume, 2.4) +
      ln('M45,-180Q52,-164 48,-150', HN.line, 4.2) + ln('M45,-180Q52,-164 48,-150', HN.plume, 2.4);
    var back = ln('M4,-207Q-30,-200 -58,-176', HN.plume, 2.2, ' opacity=".9"') + ln('M-6,-206Q-36,-196 -66,-166', HN.plume, 2.2, ' opacity=".8"');
    var thigh = '<ellipse cx="5" cy="-131" rx="13" ry="9.6" transform="rotate(-18 5 -131)" fill="' + HN.thigh + '" stroke="' + HN.line + '" stroke-width="1.8"/>';
    // ----- the neck, in an S: paler than her back, white down the front with dark streaks; `full`, a
    // little rounder low down; `gulp`, a fish on its way down as one small bump
    var bump = P.bump || (pose === 'full' ? [0.27, 7.5, 0.2] : null);
    var nwf = function (u) { return lerp(15.5, 10, u) + (bump ? bump[1] * Math.exp(-Math.pow((u - bump[0]) / (bump[2] || 0.09), 2)) : 0); };
    var neck = chainTube(P.neck, nwf, 10), front = [];
    neck.C.forEach(function (c) { front.push(add(c.p, c.n, c.w * 0.46)); });
    var fd = 'M' + pt(front[0]) + cr(front);
    var neckSvg = R.part(neck.d, { fill: HN.neck, dark: mix(HN.neck, HN.line, 0.2), line: HN.line, sx: sx * 0.6, sy: sy * 0.6, lw: 2.2,
      inner: '<path d="' + fd + '" stroke="' + HN.front + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        '<path d="' + fd + '" stroke="' + HN.streak + '" stroke-width="2.2" fill="none" stroke-dasharray="5 8" stroke-linecap="round" opacity=".8"/>' });
    addPts(neck.pts);
    // ----- the head, in its own coordinates (the bill along +x): white, the black stripe from over
    // her eye back into two thin plumes, the long two-coloured bill, the one round yellow eye
    var hm = mul(mT(P.head[0], P.head[1]), mul(mR(P.head[2]), mS(HN_HS))), hs = '';
    hs += ln('M-15,-4Q-34,-2 -52,9', HN.cap, 3) + ln('M-15,-1Q-32,6 -46,17', HN.cap, 2.4);
    if (pose === 'feather') {
      // her grin: one grey feather lifted at the back of her crown, two small ticks beside it
      hs += '<path class="pc-grin" d="M-9,-11Q-22,-20 -25,-37Q-13,-30 -5,-13Z" fill="' + HN.body + '" stroke="' + HN.line + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        ln('M-12,-16Q-18,-24 -21,-31', HN.light, 1.2) + ln('M-31,-33l-4,-5M-33,-25l-6,-2', HN.line, 1.5, ' opacity=".5"');
    }
    hs += '<path d="M15,-7.4L79,-1.4L15,0.8Z" fill="' + HN.billTop + '" stroke="' + HN.billLine + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M15,0.8L79,-1.4L15,7Z" fill="' + HN.bill + '" stroke="' + HN.billLine + '" stroke-width="1.6" stroke-linejoin="round"/>' +
      ln('M16,0.8L74,-1.2', HN.billLine, 1.2, ' opacity=".8"');
    hs += R.part(crClosed([[-17, -2], [-13, -11], [-2, -14.4], [10, -11.6], [17.6, -4], [16.6, 5], [8, 10], [-6, 10], [-15, 6]]), { fill: HN.face, dark: mix(HN.face, HN.line, 0.16), line: HN.line, sx: sx * 0.4, sy: -1.6, lw: 2,
      inner: '<path d="M9,-14Q-8,-17 -20,-5L-18,2Q-9,-8 3,-8.6Q8,-9 11,-12Z" fill="' + HN.cap + '"/>' });
    hs += ln('M10.6,-3.4L15.6,-2.6', HN.streak, 1.6);
    // the eye: open and level; turned down to the raft; shut; shut tight
    var ex = 5.2, ey = -3.6, er = 5.5;
    if (pose === 'shut') {
      hs += '<circle cx="' + ex + '" cy="' + ey + '" r="' + er + '" fill="' + HN.face + '" stroke="' + mix(HN.face, HN.line, 0.3) + '" stroke-width="1"/>' +
        ln('M' + N(ex - 4.6) + ',' + N(ey - 0.4) + 'Q' + ex + ',' + N(ey + 3.6) + ' ' + N(ex + 4.6) + ',' + N(ey - 0.4), HN.cap, 2);
      if (o.squeeze) hs += ln('M' + N(ex - 5.6) + ',' + N(ey + 1.2) + 'l-3.4,1.6M' + N(ex - 5.4) + ',' + N(ey - 1.6) + 'l-3.6,-1.2M' + N(ex - 3.4) + ',' + N(ey + 3.6) + 'Q' + ex + ',' + N(ey + 6.4) + ' ' + N(ex + 3.4) + ',' + N(ey + 3.6), HN.cap, 1.2, ' opacity=".7"');
    } else {
      var turned = pose === 'eye', px = ex + (turned ? 1.3 : pose === 'point' ? 1.6 : pose === 'gulp' ? 0.6 : 0.8), py = ey + (turned ? 2 : pose === 'point' ? 0.8 : pose === 'gulp' ? -0.6 : 0);
      hs += '<circle cx="' + ex + '" cy="' + ey + '" r="' + N(er + (turned ? 0.5 : 0)) + '" fill="' + HN.eye + '" stroke="' + HN.eyeRing + '" stroke-width="1.3"/>' +
        '<circle class="pc-pupil" cx="' + N(px) + '" cy="' + N(py) + '" r="' + (turned ? 2.9 : 2.6) + '" fill="' + HN.pupil + '"/><circle cx="' + N(px - 1) + '" cy="' + N(py - 1.1) + '" r=".95" fill="#fff"/>';
    }
    // the dragonfly, asleep on her bill
    if (o.dragonfly) hs += dragonflySvg(44, -5.6, -5, 0.92, true);
    var headPts = [[-20, -17], [80, -17], [-20, 12], [80, 9], [-54, 10], [-48, 19]];
    if (pose === 'feather') headPts.push([-27, -39], [-41, -27]);
    if (o.dragonfly) headPts.push([28, -22], [58, -22]);
    headPts = headPts.map(function (q) { return apply(hm, q); });
    addPts(headPts);
    s = '<g class="pc-heron">' + tuck + stand + ln('M-64,-170L-90,-140', HN.dark, 9) + body + thigh + wing + back + neckSvg + plumes +
      '<g transform="' + mStr(hm) + '">' + hs + '</g></g>';
    // ----- fit: the standing foot on the middle of the bottom edge
    var Wb = HN_BOX[0], Hb = HN_BOX[1], g0 = 3, x0 = 1e9, x1 = -1e9, y0 = 1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); });
    var mg = 4, sc = Math.min(1, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (mg - y0));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mS(sc)));
    var hc = apply(M, apply(hm, [4, -3])), bl = apply(M, apply(hm, [44, -5.6]));
    return {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + s + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q) { return apply(M, q); })),
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })),
      bill: { x: Math.round(bl[0] * 10) / 10, y: Math.round(bl[1] * 10) / 10 },
      _marks: { M: M, scale: sc }
    };
  }

  // ------------------------------------------------------------------ Puddle (chapter 5)
  // Sprinkle's brother under the ferry raft: a Mistscale on her model and about her size, blue-grey
  // (bluer and a shade darker than her mist-grey), the same matte ridged scales, a paler belly,
  // round friendly eyes, two soft nubs for horns, a small bump between them (he has bumped his head
  // ten times on every log), and four feet a size and a half too big, five pale claws on each.
  // Funny and friendly: cheerful, clumsy, bad at hiding. He is drawn with his sister's painters in
  // his own colours (withScales). Every pose the text gives him is in the water: laid out with the
  // waterline at y = 0, NOTHING DRAWN BELOW IT (never a shape under the raft), and the waterline on
  // the bottom edge of his box (480 x 250 in the water; sitting, his sister's 640 x 340), so a water
  // anchor takes him.
  //   foot      one foot up through the gap between two logs, wiggling
  //   head      his head out of the water beside the raft
  //   log       floating very straight, eyes shut ("I'm a log.")
  //   sink      only bubbles and the tip of a nose
  //   pawup     one forepaw raised and his chin dipping: his eyes and his grin stay above the water
  //             (`lit: n` lights n of its five claws; the result carries `paw: { x, y, r }`)
  //   nostrils  two nostrils and a string of bubbles (between the logs: he is up again)
  //   sit       all of him, sitting, as his sister sits (his page in her book, his speaker's face):
  //             what an unknown pose draws
  // Every mood (the text's are happy, wonder, worried, proud); `tear`, `mist`, `squeeze`.
  var PUDDLE_POSES = ['foot', 'head', 'log', 'sink', 'pawup', 'nostrils', 'sit'];
  OTHER_POSES.puddle = PUDDLE_POSES;
  var PD_BOX = [480, 250], PD_PAW = 1.8, PD_FOOT = 1.5;
  // (base, line, light and nostril are the marsh set's for the snout it draws between the logs: one Puddle, whoever draws him)
  var PD = { base: '#8fa3b8', line: '#3f4d5e', light: '#b9c7d5', belly: '#d7e2ea', bellyLine: '#a9bbca', ridge: '#a3b5c7', ridgeEdge: '#dee8f0',
    wing: '#bfcfdd', vein: '#889cb0', wingLine: '#57687b', claw: '#f4ecd9', clawLine: '#6f6857', nub: '#c6d3de', pad: '#b3c2cf', mouth: '#5d3844', nostril: '#4a5868' };
  PD.shade = mix(PD.base, PD.line, 0.2); PD.far = mix(PD.base, PD.line, 0.13); PD.farShade = mix(PD.base, PD.line, 0.3); PD.wingFar = mix(PD.wing, PD.line, 0.14);
  PD.feat = mix(PD.line, '#000', 0.2);
  // a bubble; rings on the water round something that has just come up (or gone down)
  function bubble(x, y, r) {
    return '<circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r) + '" fill="#eef8fc" fill-opacity=".55" stroke="#6ea9c8" stroke-width="' + N(Math.max(1.2, r * 0.22)) + '"/>' +
      '<path d="M' + N(x - r * 0.5) + ',' + N(y - r * 0.2) + 'Q' + N(x - r * 0.4) + ',' + N(y - r * 0.6) + ' ' + N(x) + ',' + N(y - r * 0.62) + '" stroke="#ffffff" stroke-width="' + N(Math.max(1, r * 0.2)) + '" fill="none" stroke-linecap="round"/>';
  }
  function waterRings(list) {
    var d = '';
    list.forEach(function (rr) {
      d += 'M' + N(rr[0] - rr[1]) + ',0Q' + N(rr[0]) + ',' + N(rr[2] || 9) + ' ' + N(rr[0] + rr[1]) + ',0';
      d += 'M' + N(rr[0] - rr[1] * 0.7) + ',-1Q' + N(rr[0]) + ',-6 ' + N(rr[0] + rr[1] * 0.7) + ',-1';
    });
    return '<path class="pc-ripple" d="' + d + '" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".78"/>';
  }
  function buildPuddle(o) { o = o || {}; return withScales(PD, function () { return puddleDraw(o); }); }
  function puddleDraw(o) {
    var pose = PUDDLE_POSES.indexOf(o.pose) >= 0 ? o.pose : 'sit';
    if (pose === 'sit') {
      var os = {}, k;
      for (k in o) os[k] = o[k];
      os.pose = 'sit';
      return buildSprinkle(os, { pawK: PD_PAW, footK: PD_FOOT, wings: { left: 'fold', right: 'fold' }, bump: true });
    }
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), sx = -2.4 * F, sy = -3.6;
    var pts = [], under = '', over = '', headPts = null, headAt0 = null, pawAt = null;
    function addPts(a) { pts = pts.concat(a); }
    function part(d, far, lw) { return R.part(d, { fill: far ? DZ.far : DZ.base, dark: far ? DZ.farShade : DZ.shade, line: DZ.line, sx: sx * 0.6, sy: sy * 0.6, lw: lw || 2.4 }); }
    function face(x, y, rot, ctx) {
      var hm = mul(mT(x, y), mul(mR(rot + (HEAD_ROT[mood] || 0) * 0.5), mS(DZ_HS)));
      ctx.sx = sx; ctx.bump = true;
      if (o.squeeze) ctx.squeeze = true;
      if (o.tear) ctx.tear = true;
      if (o.mist) ctx.mist = true;
      var hd = dzHead(R, mood, ctx);
      headPts = hd.pts.map(function (q) { return apply(hm, q); });
      headAt0 = apply(hm, [0, 0]);
      addPts(headPts);
      return '<g transform="' + mStr(hm) + '">' + hd.svg + '</g>';
    }
    // a stretch of his back above the water: a low hump, his ridges along it
    function hump(a, b) {
      var g = hull2(a, b, 10), tb = { at: function (u) { return { p: lerp2(a, b, u), n: [0, -1], w: lerp(a[2], b[2], u) }; } };
      addPts(g.pts);
      return ridgesSvg(ridgeRow(tb, 0.08, 0.92, 4, 0.26, function () { return 1; })) + part(g.d);
    }
    if (pose === 'head') {
      // his head and neck out of the water, a bit of his back behind; drops off his chin
      var nk = chainTube([[[-16, 30], [-12, -2], [-6, -22], [0, -40]]], function (u) { return lerp(31, 26, u); }, 8), th = [];
      nk.C.forEach(function (c) { th.push(add(c.p, c.n, c.w * 0.5)); });
      under += hump([-104, 8, 30], [-44, 6, 34]);
      under += R.part(nk.d, { fill: DZ.base, dark: DZ.shade, line: DZ.line, sx: sx * 0.7, sy: sy * 0.7, lw: 2.4,
        inner: '<path d="M' + pt(th[0]) + cr(th) + '" stroke="' + DZ.belly + '" stroke-width="22" fill="none" stroke-linecap="round"/>' });
      addPts(nk.pts);
      under += face(4, -88, -3, { look: [1, 0] });
      over += waterRings([[-6, 62], [-76, 44, 7], [70, 22, 6]]) +
        '<g fill="#dff1fa" stroke="#6ea9c8" stroke-width="1.4"><path d="M-30,-22q4,7 0,10q-4,-3 0,-10Z"/><path d="M34,-14q3.4,6 0,8.6q-3.4,-2.6 0,-8.6Z"/></g>';
      addPts([[-124, 0], [96, 0]]);
    } else if (pose === 'pawup') {
      // "So tell Sprinkle: five!" One big forepaw up, pads toward us, and his chin already under:
      // the water comes to just below his grin
      under += hump([-150, 16, 28], [-92, 14, 30]);
      under += face(-34, -41, 5, { look: [1.3, -0.4] });
      var a0 = [50, 30, 20], a1 = [72, -48, 15], ag = hull2(a0, a1, 8);
      var pw = dzPaw(72, -50, -86, PD_PAW, { pads: true, lit: clamp(o.lit === true ? 5 : intOr(o.lit, 0), 0, 5) });
      under += part(ag.d) + pw.svg;
      addPts(ag.pts); addPts(pw.pts);
      var pc = apply(mul(mT(72, -50), mul(mR(-86), mS(PD_PAW))), [26, 0]);
      pawAt = [pc[0], pc[1], 44 * PD_PAW];
      over += waterRings([[-34, 70], [62, 30, 7], [-130, 34, 6]]);
      addPts([[-166, 0], [96, 0]]);
    } else if (pose === 'log') {
      // being a log: stretched out dead straight along the top of the water, eyes shut, smiling;
      // his back and his ridges show, the tip of his tail, and two of the four feet that give him away
      var bt = { at: function (u) { return { p: [lerp(-136, 100, u), 9], n: [0, -1], w: 31 }; } };
      var bg = hull2([-136, 9, 31], [100, 9, 31], 12), tg2 = hull2([-210, 14, 17], [-156, 10, 27], 8);
      under += part(tg2.d) + ridgesSvg(ridgeRow(bt, 0.04, 0.96, 9, 0.24, function () { return 1; })) + part(bg.d);
      addPts(bg.pts); addPts(tg2.pts);
      var f1 = dzPaw(-110, 30, -96, PD_FOOT, { pads: true }), f2 = dzPaw(54, 30, -85, PD_FOOT, { pads: true });
      under += f1.svg + f2.svg;
      addPts(f1.pts); addPts(f2.pts);
      under += face(152, -47, 0, { look: [1, 0], eyes: mood === 'laugh' ? 'squeeze' : 'closed', mouth: /^(worried|scared|sad|wonder)$/.test(mood) ? null : 'smile' });
      over += waterRings([[152, 66], [-30, 96, 7], [-196, 26, 5]]);
      addPts([[-224, 0], [220, 0]]);
    } else if (pose === 'sink' || pose === 'nostrils') {
      // going under, or just up again: the tip of his nose (two nostrils on a pale snout), and
      // bubbles. `nostrils` is the least of him there can be: it fits between two logs.
      var deep = pose === 'nostrils', w = deep ? 22 : 30, hh = deep ? 11 : 19;
      under += R.part('M' + N(-w) + ',4Q' + N(-w) + ',' + N(-hh) + ' 0,' + N(-hh - 2) + 'Q' + w + ',' + N(-hh) + ' ' + w + ',4Z', { fill: DZ.belly, dark: mix(DZ.belly, DZ.line, 0.18), line: DZ.line, sx: sx * 0.5, sy: -2, lw: 2.4,
        inner: '<path d="M' + N(-w) + ',4Q' + N(-w) + ',' + N(-hh * 0.2) + ' 0,' + N(-hh * 0.1) + 'Q' + w + ',' + N(-hh * 0.2) + ' ' + w + ',4Z" fill="' + DZ.base + '" opacity=".5"/>' });
      under += '<g fill="' + DZ.nostril + '"><ellipse cx="-8" cy="' + N(-hh * 0.56) + '" rx="3.4" ry="2.4" transform="rotate(-20 -8 ' + N(-hh * 0.56) + ')"/><ellipse cx="8" cy="' + N(-hh * 0.56) + '" rx="3.4" ry="2.4" transform="rotate(20 8 ' + N(-hh * 0.56) + ')"/></g>';
      var bub = deep ? [[26, -14, 4.6], [34, -30, 3.6], [29, -44, 2.8], [36, -56, 2.2]] : [[-44, -16, 6.4], [-54, -38, 4.6], [-42, -56, 3.4], [44, -14, 5.4], [54, -32, 3.8], [47, -50, 2.8], [8, -44, 3]];
      bub.forEach(function (b) { over += bubble(b[0], b[1], b[2]); addPts([[b[0] - b[2] - 2, b[1] - b[2] - 2], [b[0] + b[2] + 2, b[1] + b[2]]]); });
      over += deep ? waterRings([[0, 30, 5]]) : waterRings([[0, 58], [0, 92, 12]]);
      headPts = [[-w - 4, -hh - 6], [w + 4, -hh - 6], [-w - 4, 0], [w + 4, 0]];
      headAt0 = [0, -hh * 0.5];
      addPts(headPts); addPts(deep ? [[-34, 0], [42, 0]] : [[-94, 0], [94, 0]]);
    } else {
      // `foot`: "Between two logs, a foot pokes up: blue-grey, and much too big. It wiggles."
      var l0 = [-2, 34, 19], l1 = [3, -30, 14], lg = hull2(l0, l1, 8), ft = dzPaw(3, -32, -84, PD_PAW * 1.06, { pads: true });
      under += part(lg.d) + ft.svg;
      addPts(lg.pts); addPts(ft.pts);
      over += '<path class="pc-wiggle" d="M-64,-96q-9,11 0,22t0,22M-80,-84q-7,8 0,17M70,-100q9,11 0,22t0,22M86,-88q7,8 0,17" stroke="' + DZ.line + '" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".5"/>';
      headPts = [[-52, -150], [58, -150], [-52, -24], [58, -24]];
      headAt0 = [3, -84];
      addPts([[-90, -104], [96, -104], [-30, 0], [30, 0]]);
    }
    // ----- nothing below the waterline; the rings and bubbles lie on it
    var cid = R.id();
    R.defs += '<clipPath id="' + cid + '"><rect x="-2000" y="-2000" width="4000" height="2000"/></clipPath>';
    var body = '<g clip-path="url(#' + cid + ')">' + under + '</g>' + over;
    pts = pts.filter(function (q) { return q[1] <= 0.5; });
    // ----- fit: the waterline on the bottom of his box
    var Wb = PD_BOX[0], Hb = PD_BOX[1], g0 = 3, x0 = 1e9, x1 = -1e9, y0 = 1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); });
    var mg = 4, sc = Math.min(1, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (mg - y0));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mS(sc)));
    var hc = apply(M, headAt0);
    var out = {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q) { return apply(M, [q[0], Math.min(q[1], 0)]); })),
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })),
      _marks: { M: M, scale: sc }
    };
    if (pawAt) { var pcM = apply(M, pawAt); out.paw = { x: Math.round(pcM[0] * 10) / 10, y: Math.round(pcM[1] * 10) / 10, r: Math.round(pawAt[2] * sc * 10) / 10 }; }
    return out;
  }

  // ------------------------------------------------------------------ Wisp (chapter 5)
  // Sprinkle's pale sister in the heron's reeds: a Mistscale on her model, slighter and longer in
  // the neck, so pale she is nearly see-through. She is drawn as a fine outline with a pearl-white
  // fill thin enough that what is behind her shows through, most of all through her wings and a
  // raised forepaw; her pale gold eyes are the one solid thing about her, and warm. She believes she
  // is a heron: she stands on one leg (the leg has a knee, which is how you tell her from a reed),
  // her wings folded long down her back like a heron's. Daylight in every picture: no glow, no
  // shine of her own, nothing ghostly; a small smile and a little pink in her cheeks. She never
  // speaks. Drawn with her sister's painters in her own colours, at four-fifths their size (so her
  // lines are finer); her box is 320 x 300, her foot on the middle of its bottom edge.
  //   reed    still, eyes shut: one more reed, but paler, and with a knee
  //   blink   eyes open (what an unknown pose draws: her page in the book)
  //   shh     one claw across her snout
  //   draw    one claw down in the mud (her drawings are the marsh set's, and the Counts pictures')
  //   nod     once
  //   flinch  the one jerk a yelling cat sees (eyes squeezed shut: her open eyes are `blink`'s)
  //   gulp    a small bump going down her long neck
  //   pawup   one forepaw raised, five claws (`lit: n` lights them pale as frost; `paw: { x, y, r }`)
  // Every mood; `squeeze`, `tear`.
  var WISP_POSES = ['reed', 'blink', 'shh', 'draw', 'nod', 'flinch', 'gulp', 'pawup'];
  OTHER_POSES.wisp = WISP_POSES;
  var WS_BOX = [320, 300], WS_SCALE = 0.8, WS_HS = 1.08, WS_BODY = 0.74, WS_THIN = 0.48;
  var WS = { base: '#f2efe4', line: '#868f86', light: '#ffffff', belly: '#fbf9f2', bellyLine: '#cbd1c5', ridge: '#eae8dd', ridgeEdge: '#ffffff',
    wing: '#f7f5ed', vein: '#c3cabe', wingLine: '#949d93', claw: '#fdfbf3', clawLine: '#a5a191', nub: '#f6f4eb', pad: '#e2e5da', mouth: '#c58f9a', nostril: '#9fa79d',
    eye: ['#fffbe6', '#f7e29c', '#e0bf63'], pupil: '#3a2f22', eyeInk: '#6f6650', glow: '#cfeeff', glow2: '#ffffff', glowLine: '#79b3d6' };
  WS.shade = mix(WS.base, WS.line, 0.16); WS.far = mix(WS.base, WS.line, 0.1); WS.farShade = mix(WS.base, WS.line, 0.24); WS.wingFar = mix(WS.wing, WS.line, 0.1);
  WS.feat = mix(WS.line, '#000', 0.12);
  var WS_STAND = { foot: [0, 0], knee: [13, -58], hip: [-6, -112, 29], chest: [10, -158, 24], S: [0, -170],
    neck: [[[16, -176], [28, -208], [6, -238], [18, -266]]], neckW: [15.5, 12], head: [22, -298, 0],
    tail: [[[-24, -110], [-44, -84], [-38, -46], [-46, -17]], [[-46, -17], [-49, -8], [-43, -4], [-35, -9]]], tailW: [13, 4.2],
    fold: [[30, -110], [16, -88]], wing: 'long',
    arms: [{ top: [10, -150, 8], paw: [25, -134], rot: -26, far: true, rest: true }, { top: [17, -148, 9], paw: [31, -128], rot: -16, rest: true }] };
  function wsPose(pose) {
    var P = {}, k;
    for (k in WS_STAND) P[k] = WS_STAND[k];
    switch (pose) {
      case 'reed': P.eyes = 'closed'; break;
      case 'shh':
        // one claw laid across her snout, as a finger is laid to lips
        P.arms = [WS_STAND.arms[0], { top: [17, -150, 9], paw: [35, -226], rot: -95, claws: 'one', thin: true }]; P.look = [1, 0.4]; break;
      case 'pawup':
        P.arms = [WS_STAND.arms[0], { top: [17, -150, 9], paw: [62, -196], rot: -84, up: true, raised: true, thin: true }]; P.head = [20, -298, -3]; break;
      case 'nod':
        P.neck = [[[16, -176], [28, -208], [8, -236], [22, -262]]]; P.head = [28, -290, 15]; P.look = [0.8, 1.8]; P.nod = true; break;
      case 'gulp':
        // her half of the fee going down: head tipped back, one small bump half-way down her neck
        P.neck = [[[16, -176], [28, -208], [4, -238], [12, -268]]]; P.head = [13, -300, -22]; P.bump = [0.5, 9.5]; P.look = [0.6, -1.6]; break;
      case 'flinch':
        // one jerk: her neck kinked, her head thrown back, the folded leg kicked out, her wing jolted open
        P.neck = [[[16, -176], [46, -202], [-12, -230], [8, -260]]]; P.head = [8, -292, -9]; P.wing = 'flick';
        // (her eyes squeezed shut: the two open gold eyes are the blink's, for a cat who kept still)
        P.fold = [[40, -96], [44, -66]]; P.jolt = true; P.squeeze = true; break;
      case 'draw':
        // still on one leg, folded down over the mud, one claw drawing in it
        P.knee = [26, -44]; P.hip = [-14, -88, 29]; P.chest = [26, -112, 24]; P.S = [14, -126];
        P.neck = [[[40, -122], [70, -146], [100, -132], [108, -100]]]; P.head = [112, -72, 16]; P.look = [0.3, 2.8];
        P.tail = [[[-36, -92], [-66, -82], [-84, -52], [-88, -22]], [[-88, -22], [-90, -8], [-82, -2], [-74, -8]]];
        P.fold = [[14, -62], [-8, -50]]; P.wing = 'long';
        P.arms = [{ top: [26, -100, 8], paw: [42, -82], rot: -10, far: true, rest: true }, { top: [34, -98, 9], paw: [62, -51], rot: 52, claws: 'one', thin: true }];
        P.groove = [[102, -3], [140, -6]]; break;
    }
    return P;
  }
  function buildWisp(o) { o = o || {}; return withScales(WS, function () { return wispDraw(o); }); }
  function wispDraw(o) {
    var pose = WISP_POSES.indexOf(o.pose) >= 0 ? o.pose : 'blink';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), P = wsPose(pose), sx = -2.2 * F, sy = -3, pts = [], pawAt = null;
    function addPts(a) { pts = pts.concat(a); }
    function part(d, far, lw, inner) { return R.part(d, { fill: far ? DZ.far : DZ.base, dark: far ? DZ.farShade : DZ.shade, line: DZ.line, sx: sx * 0.6, sy: sy * 0.6, lw: lw || 2.2, inner: inner }); }
    var hip = P.hip, chest = P.chest;
    // ----- the leg she stands on: thigh, a knobbly knee, shin, a long foot; and the other, folded up under her
    var kn = P.knee, thigh = hull2([hip[0] + 2, hip[1] + 10, 13], [kn[0], kn[1], 8.6], 6), shin = hull2([kn[0], kn[1], 8], [P.foot[0] + 1, P.foot[1] - 12, 6.4], 6);
    var legSvg = part(shin.d) + dzFoot(P.foot[0] - 10, P.foot[1] - 4, 0, 0.92) + part(thigh.d) +
      '<circle class="pc-knee" cx="' + N(kn[0]) + '" cy="' + N(kn[1]) + '" r="10.6" fill="' + DZ.base + '" stroke="' + DZ.line + '" stroke-width="2.2"/>' +
      '<path d="M' + N(kn[0] - 4) + ',' + N(kn[1] - 3) + 'q4,-4 8,-1" stroke="' + DZ.light + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>';
    addPts(thigh.pts); addPts(shin.pts); addPts([[P.foot[0] - 36, P.foot[1] - 22], [P.foot[0] + 44, P.foot[1]], [kn[0] + 11, kn[1]]]);
    var fk = P.fold[0], ff = P.fold[1], fthigh = hull2([hip[0] + 8, hip[1] + 8, 12], [fk[0], fk[1], 8], 6), fshin = hull2([fk[0], fk[1], 7.6], [ff[0], ff[1], 6], 6);
    var foldSvg = part(fthigh.d, true) + part(fshin.d, true) + dzFoot(ff[0], ff[1], deg([ff[0] - fk[0], ff[1] - fk[1]]) + 20, 0.6, true) +
      '<circle cx="' + N(fk[0]) + '" cy="' + N(fk[1]) + '" r="8.6" fill="' + DZ.far + '" stroke="' + DZ.line + '" stroke-width="2"/>';
    addPts(fthigh.pts); addPts(fshin.pts); addPts([[ff[0] - 20, ff[1] - 16], [ff[0] + 20, ff[1] + 16]]);
    // ----- torso and belly, her ridges
    var tg = hull2(hip, chest, 8), ax = unit([chest[0] - hip[0], chest[1] - hip[1]]), spine = [ax[1], -ax[0]];
    var tIn = '<path d="' + ellipseG(lerp(hip[0], chest[0], 0.55) - spine[0] * chest[2] * 0.5, lerp(hip[1], chest[1], 0.55) - spine[1] * chest[2] * 0.5, (dist(hip, chest) / 2 + chest[2]) * 0.8, chest[2] * 0.6, deg(ax)).d + '" fill="' + DZ.belly + '"/>' +
      '<path d="M' + pt(add(add(hip, spine, hip[2] - 5), ax, 3)) + 'L' + pt(add(add(chest, spine, chest[2] - 5), ax, -3)) + '" stroke="' + DZ.light + '" stroke-width="4" stroke-linecap="round" opacity=".6"/>';
    var torso = part(tg.d, false, 2.3, tIn);
    addPts(tg.pts);
    var spineTube = { at: function (u) { var c = lerp2(chest, hip, u), r = lerp(chest[2], hip[2], u); return { p: c, n: spine, w: r }; } };
    var torsoRidges = ridgeRow(spineTube, 0.1, 1, 4, 0.24, function () { return 1; });
    // ----- her long neck (a bump in it when she swallows) and her tail, which hangs like one more reed
    var nw = P.neckW, bump = P.bump;
    var neck = chainTube(P.neck, function (u) { return lerp(nw[0], nw[1], u) + (bump ? bump[1] * Math.exp(-Math.pow((u - bump[0]) / 0.1, 2)) : 0); }, 10), throat = [];
    neck.C.forEach(function (c) { throat.push(add(c.p, c.n, c.w * 0.5)); });
    var neckSvg = part(neck.d, false, 2.2, '<path d="M' + pt(throat[0]) + cr(throat) + '" stroke="' + DZ.belly + '" stroke-width="' + N(nw[1] * 0.9) + '" fill="none" stroke-linecap="round"/>');
    addPts(neck.pts);
    var neckRidges = ridgeRow(neck, 0.12, 0.84, 5, 0.34, pose === 'draw' ? UPPER : function () { return -1; });
    var tw = P.tailW, tail = chainTube(P.tail, function (u) { return lerp(tw[0], tw[1], Math.pow(u, 0.9)); }, 8);
    var tailSvg = part(tail.d, false, 2.2);
    addPts(tail.pts);
    var tailRidges = ridgeRow(tail, 0.06, 0.8, 6, 0.4, BACKWARD);
    // ----- one long wing down her back
    var wing = dzWing(P.wing, P.S, false, 1, 0.6);
    addPts(wing.pts);
    // ----- arms: folded on her chest, or the near one doing what the pose asks; the raised paw and
    // the wing are the thinnest of her
    var litN = clamp(o.lit === true ? 5 : intOr(o.lit, 0), 0, 5), litSvg = '';
    function armSvg(A) {
      var top = [A.top[0], A.top[1], A.top[2]], end = [A.paw[0], A.paw[1], A.top[2] * 0.66];
      var dv = unit([end[0] - top[0], end[1] - top[1]]), pp = [-dv[1], dv[0]], len = dist(top, end);
      if (Math.abs(dv[1]) < 0.5 ? pp[1] > 0 : pp[0] > 0) pp = [-pp[0], -pp[1]];
      var el = add(lerp2(top, end, 0.46), pp, Math.min(8, len * 0.14)), elc = [el[0], el[1], A.top[2] * 0.82];
      var g1 = hull2(top, elc, 6), g2 = hull2(elc, end, 6), po = { far: A.far, pads: A.up, claws: A.claws };
      // (a forepaw at rest is folded small against her chest: a soft mitt, its claws tucked away)
      var pw = A.rest ? { svg: '<ellipse cx="' + N(A.paw[0] + 4) + '" cy="' + N(A.paw[1] + 2) + '" rx="10.5" ry="8.6" transform="rotate(' + A.rot + ' ' + N(A.paw[0] + 4) + ' ' + N(A.paw[1] + 2) + ')" fill="' + (A.far ? DZ.far : DZ.base) + '" stroke="' + DZ.line + '" stroke-width="2"/>' +
        '<path d="M' + N(A.paw[0] + 9) + ',' + N(A.paw[1] - 2) + 'l3.4,1.2M' + N(A.paw[0] + 10) + ',' + N(A.paw[1] + 3) + 'l3.4,0.4" stroke="' + DZ.line + '" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>', pts: [[A.paw[0] - 8, A.paw[1] - 8], [A.paw[0] + 16, A.paw[1] + 12]] }
        : dzPaw(A.paw[0], A.paw[1], A.rot, 0.9, po);
      addPts(g1.pts); addPts(g2.pts); addPts(pw.pts);
      if (A.raised) {
        var cc = apply(mul(mT(A.paw[0], A.paw[1]), mul(mR(A.rot), mS(0.9))), [26, 0]);
        pawAt = [cc[0], cc[1], 40];
        if (litN) litSvg = dzPaw(A.paw[0], A.paw[1], A.rot, 0.9, { pads: true, lit: litN, only: 'lit' }).svg;
      }
      return part(g1.d, A.far, 2) + part(g2.d, A.far, 2) + '<circle cx="' + N(el[0]) + '" cy="' + N(el[1]) + '" r="' + N(A.top[2] * 0.82 - 1) + '" fill="' + (A.far ? DZ.far : DZ.base) + '"/>' + pw.svg;
    }
    var farArm = armSvg(P.arms[0]), nearArm = armSvg(P.arms[1]);
    // ----- the head: her sister's face, a size smaller; the eyes drawn apart from it, solid
    var hrot = P.head[2] + (HEAD_ROT[mood] || 0) * 0.6;
    var hm = mul(mT(P.head[0], P.head[1] - 4), mul(mR(hrot), mS(WS_HS)));
    var hctx = { sx: sx, look: P.look || [1, 0], splitEyes: true, blush: true };
    // her eyes are what there is of her to see: a happy or a proud Wisp smiles with them open (only
    // being a reed, or a mouthful going down, shuts them)
    if (P.eyes) hctx.eyes = P.eyes;
    else if ((mood === 'happy' || mood === 'proud') && pose !== 'gulp') hctx.eyes = 'open';
    if (P.wide && (mood === 'neutral' || mood === 'happy' || mood === 'kind')) hctx.eyes = 'wonder';
    if (o.squeeze || P.squeeze) hctx.squeeze = true;
    if (o.tear) hctx.tear = true;
    var hd = dzHead(R, mood, hctx), headPts = hd.pts.map(function (q) { return apply(hm, q); });
    addPts(headPts);
    // ----- assemble: all of her but her eyes behind one thin veil (one group, so she is the same
    // thinness all through and her own parts never show through each other); the wing, and an arm
    // that is up or out, thinner still; then her eyes
    var marks = '';
    if (P.groove) {
      marks += '<path d="M' + pt(P.groove[0]) + 'Q' + pt([lerp(P.groove[0][0], P.groove[1][0], 0.5), P.groove[0][1] - 5]) + ' ' + pt(P.groove[1]) + '" stroke="#5c4532" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>';
      addPts(P.groove);
    }
    if (P.nod) {
      var nq = apply(hm, [-66, -34]);
      marks += '<path d="M' + pt(nq) + 'q-10,10 -6,26M' + pt(add(nq, [-12, 2])) + 'q-7,7 -5,17" stroke="' + DZ.line + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".6"/>';
      addPts([add(nq, [-20, 0])]);
    }
    if (P.jolt) {
      marks += '<path d="M-62,-150l-12,-7M-66,-128l-14,0M70,-232l12,-8M74,-208l14,-1M52,-86l11,7" stroke="' + DZ.line + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>';
      addPts([[-82, -158], [90, -242]]);
    }
    var thinArm = !!P.arms[1].thin;
    var body = '<g class="pc-veil" opacity="' + WS_BODY + '">' + ridgesSvg(tailRidges) + tailSvg + foldSvg + farArm + ridgesSvg(torsoRidges) + torso + legSvg +
      ridgesSvg(neckRidges) + neckSvg + (thinArm ? '' : nearArm) + '<g transform="' + mStr(hm) + '">' + hd.svg + '</g></g>' +
      '<g class="pc-veil pc-thin" opacity="' + WS_THIN + '">' + wing.svg + '</g>' +
      '<g class="pc-eyes" transform="' + mStr(hm) + '">' + hd.eyes + '</g>' +
      (thinArm ? '<g class="pc-veil pc-thin" opacity="' + (WS_THIN + 0.1) + '">' + nearArm + '</g>' : '') + litSvg + marks;
    // ----- fit: her foot on the middle of the bottom of her box, at four-fifths of her sister's scale
    var Wb = WS_BOX[0], Hb = WS_BOX[1], g0 = 3, x0 = 1e9, x1 = -1e9, y0 = 1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); });
    var mg = 4, sc = Math.min(WS_SCALE, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (mg - y0));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mS(sc)));
    var hc = apply(M, apply(hm, [0, 0]));
    var out = {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q) { return apply(M, q); })),
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })),
      _marks: { M: M, scale: sc }
    };
    if (pawAt) { var pcM = apply(M, pawAt); out.paw = { x: Math.round(pcM[0] * 10) / 10, y: Math.round(pcM[1] * 10) / 10, r: Math.round(pawAt[2] * sc * 10) / 10 }; }
    return out;
  }

  // ------------------------------------------------------------------ Coil (chapter 6)
  // The water snake in the Old Bridge's stones: a northern water snake (the real Potomac kind, not
  // venomous), brown with darker cross-bands and a cream belly, a rounded head (never a viper's
  // arrow) and two round eyes shiny as wet pebbles: round pupils, a shine dot in each, and NO EYELIDS:
  // no pose, mood or extra ever closes them (in `stone` and `slide` his head is turned into his gap
  // and they do not show; they are never shut). His mouth is always shut: no tongue, no fangs, ever.
  // Very polite, very slow: his head tilted as if listening. Funny-creepy, never frightening: he never
  // strikes, squeezes, rears up or comes toward anyone; his body runs sideways along the wall's foot,
  // away from whoever he faces.
  // One box for every pose (720 x 160, the cats' units), drawn at one scale, so his head is the same
  // size in every panel: HIS HEAD AT THE BOX'S BOTTOM CENTRE (where a cat's feet are: the bridge's
  // `gap` anchor puts it in his gap, at any scale), facing right, his body trailing back from it along
  // the bottom line as far as the pose shows (mirrored facing left). His head is about 50 wide, about
  // half a cat's, no bigger than a stone of the wall.
  //   stone   only his head, turned into the gap: its top one more rounded stone (the stones Tap)
  //   head    the head out of the gap, tilted politely, two round eyes, mouth shut (the first sight)
  //   long    the head and a first loop of body along the wall's foot
  //   longer  "Then MORE of him": loops and loops along the wall's foot, off to the left
  //   still   lying along the wall, his head raised a little (his talking pose)
  //   listen  his chin flat on the floor (feeling the footsteps)
  //   think   his head tilted up
  //   slide   sliding back into the gap, the head gone in, the tail end last
  // Every mood, drawn his way (eyes always open; a small closed smile at most; `sniff` an offended
  // lift of the chin). Extras: `tap: 'stone'` (his head, as one more stone) and `tap: 'eyes'`.
  var COIL_POSES = ['stone', 'head', 'long', 'longer', 'still', 'listen', 'think', 'slide'];
  OTHER_POSES.coil = COIL_POSES;
  var COIL_BOX = [720, 160], COIL_HS = 0.94;   // (his head's scale: well under three fifths of our cat's)
  var CL = { base: '#8a6a4a', band: '#5a4130', line: '#382618', light: '#b3936f', belly: '#efe0bf', bellyLine: '#c4ae86',
    iris: ['#e2b462', '#a26d2c', '#4a2f14'], pupil: '#120c07', feat: '#2b1c11', dark: '#1b130d' };
  CL.shade = mix(CL.base, CL.line, 0.22);
  // the head, three-quarter view facing right (head units, its middle at 0,0): the snout at +x, both
  // round eyes on the near side of the top, the cream jaw below
  var COIL_HEAD = [[36, 0.6], [34.6, -5.6], [28.6, -10.8], [18, -14.6], [5, -16.6], [-8, -16], [-18, -12.4], [-23.6, -5.6], [-24, 2.4], [-19.6, 8.6], [-9, 11.6], [6, 12.2], [21, 10.4], [31.4, 6.6]];
  // the back of his head, turned into the gap: a rounded stone
  var COIL_DOME = [[-24, 1.6], [-22.6, -8.4], [-15, -15.6], [-3, -18.6], [9.6, -17], [19, -11], [24.2, -2.4], [22, 3.2], [0, 4.6], [-19.6, 4]];
  var COIL_EYES = [[14.4, -5.4, 5.8], [1.6, -8.2, 5.1]];   // near, far: [x, y, r]
  // his moods: [head turn, brow inner, brow outer, pupil size, look x, look y, mouth] (a small closed
  // smile at most: laughing, he smiles and tips his head back)
  var COIL_MOOD = {
    neutral: [6, 0, 0, 1, 0.9, 0.1, 'line'], happy: [4, -0.6, 0.8, 1, 0.9, 0, 'smile'], dreamy: [-4, -1, 1, 1.05, 0.3, -1.1, 'smile'],
    wonder: [2, -2.6, -1.4, 1.28, 0.8, -0.2, 'line'], worried: [8, -2.8, 1.6, 0.9, 0.9, 0.3, 'wavy'], scared: [10, -3.4, 1.8, 0.62, 1.3, 0, 'wavy'],
    sleepy: [12, 0.6, 1.4, 0.82, 0.5, 1, 'line'], laugh: [-6, -1, 1, 1, 0.8, -0.3, 'smile'], stern: [2, 2.6, -1.6, 0.92, 1, 0.2, 'flat'],
    kind: [8, -0.6, 0.8, 1.08, 0.8, 0.2, 'smile'], proud: [-10, 0.6, -0.4, 1, 1, -0.4, 'smile'], sniff: [-16, -1.6, -2.4, 0.86, 1.3, -0.7, 'purse'],
    shout: [-2, -2.4, -2, 1.1, 1, 0, 'line'], solemn: [-4, 0.8, 0.8, 0.94, 0.9, 0.2, 'flat'], sad: [10, -3, 2, 1.06, 0.6, 0.9, 'down'], shy: [12, -1.4, 1, 1, 0.4, 1.4, 'small']
  };
  // the closed mouth, from the snout back (never open: no tongue, no fang, no gap)
  var COIL_MOUTH = {
    line: 'M33.4,3.6Q18,7.4 2,5.8', smile: 'M33.4,3.4Q18,9 1.6,3.4q-1.6,-0.8 -2,-2.8',
    flat: 'M33.4,4.4L2,6', wavy: 'M33.4,4Q26,2.4 19,5.2T3,6.6', down: 'M33.4,3.6Q18,4.6 2,8.6', small: 'M32.4,4.2Q24,6.8 14,5.6',
    purse: 'M33.6,4Q29,6.8 23,5.2M24.2,3.4q-1.3,1.7 0,3.4'
  };
  function coilEye(R, x, y, r, mk, gid) {
    var px = x + mk[4] * r * 0.22, py = y + mk[5] * r * 0.2, pr = r * 0.46 * mk[3];
    return '<g class="pc-eye"><circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r) + '" fill="url(#' + gid + ')" stroke="' + CL.line + '" stroke-width="1.6"/>' +
      '<circle class="pc-pupil" cx="' + N(px) + '" cy="' + N(py) + '" r="' + N(pr) + '" fill="' + CL.pupil + '"/>' +
      '<circle class="pc-shine" cx="' + N(x - r * 0.32) + '" cy="' + N(y - r * 0.36) + '" r="' + N(r * 0.3) + '" fill="#ffffff"/>' +
      '<circle cx="' + N(x + r * 0.34) + '" cy="' + N(y + r * 0.3) + '" r="' + N(r * 0.12) + '" fill="#ffffff" opacity=".9"/>' +
      '<path d="M' + N(x - r * 0.78) + ',' + N(y - r * 0.2) + 'A' + N(r * 0.82) + ' ' + N(r * 0.82) + ' 0 0 1 ' + N(x + r * 0.2) + ',' + N(y - r * 0.8) + '" stroke="#ffffff" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".55"/></g>';
  }
  // his head (head units); `dome`: only the back of it, turned into the gap (no eyes, no mouth). In the
  // `stone` pose, before anyone has seen him, that dome reads as one more rounded stone of the wall: his
  // brown taken most of the way to the old stones' blue-grey, and no bands (sliding back in, `slide`, it
  // is his own brown)
  var CL_STONE = { base: mix(CL.base, '#56627e', 0.62), shade: mix(CL.shade, '#36405a', 0.62), line: mix(CL.line, '#1c2234', 0.5), light: mix(CL.light, '#8d98b2', 0.62) };
  function coilHead(R, mood, dome, stone) {
    var mk = COIL_MOOD[mood] || COIL_MOOD.neutral, s = '', pts = (dome ? COIL_DOME : COIL_HEAD).slice();
    if (dome) {
      var K = stone ? CL_STONE : CL;
      s += R.part(crClosed(COIL_DOME), { fill: K.base, dark: K.shade, line: K.line, sx: -1.6, sy: -2.4, lw: 2,
        inner: (stone ? '' : '<g fill="' + CL.band + '"><ellipse cx="-11" cy="-8" rx="6" ry="4.6" transform="rotate(-14 -11 -8)"/><ellipse cx="6" cy="-11" rx="5.4" ry="3.6" transform="rotate(10 6 -11)"/><ellipse cx="18" cy="-3" rx="3.6" ry="3"/></g>') +
          '<ellipse cx="-4" cy="-13" rx="9" ry="2.8" transform="rotate(-6 -4 -13)" fill="' + K.light + '" opacity=".6"/>' });
      return { svg: s, pts: pts, eyes: [] };
    }
    s += R.part(crClosed(COIL_HEAD), { fill: CL.base, dark: CL.shade, line: CL.line, sx: -1.6, sy: -2.4, lw: 2,
      inner: '<path d="M-24,4Q6,7 36,2L36,14L-24,14Z" fill="' + CL.belly + '"/><path d="M-16,10Q8,14.4 32,7.4" stroke="' + CL.bellyLine + '" stroke-width="1.2" fill="none" opacity=".8"/>' +
        '<g fill="' + CL.band + '"><ellipse cx="-14" cy="-8.6" rx="5.6" ry="4" transform="rotate(-20 -14 -8.6)"/><ellipse cx="-4" cy="-15" rx="4.6" ry="2.4"/><ellipse cx="24" cy="-11.6" rx="3.6" ry="2" transform="rotate(14 24 -11.6)"/></g>' +
        '<ellipse cx="6" cy="-13.6" rx="9" ry="2.2" transform="rotate(-4 6 -13.6)" fill="' + CL.light + '" opacity=".55"/>' });
    var gid = R.id();
    R.defs += '<radialGradient id="' + gid + '" cx=".4" cy=".36" r=".72"><stop offset="0" stop-color="' + CL.iris[0] + '"/><stop offset=".55" stop-color="' + CL.iris[1] + '"/><stop offset="1" stop-color="' + CL.iris[2] + '"/></radialGradient>';
    // the far eye first (it sits a little behind), then the near one; over each, the scale that
    // makes his brow (it tilts with the mood; he has no lids at all)
    var eyes = '', brows = '';
    [COIL_EYES[1], COIL_EYES[0]].forEach(function (e, i) {
      var near = i === 1, ex = e[0], ey = e[1], r = e[2];
      eyes += coilEye(R, ex, ey, r, mk, gid);
      var b0 = ey - r - 2.6 + (near ? mk[1] : mk[2]), b1 = ey - r - 2.6 + (near ? mk[2] : mk[1]);
      brows += 'M' + N(ex - r * 1.02) + ',' + N(b0) + 'Q' + N(ex) + ',' + N(Math.min(b0, b1) - 2.2) + ' ' + N(ex + r * 1.02) + ',' + N(b1);
      pts.push([ex - r - 1, ey - r - 6], [ex + r + 1, ey - r - 6]);
    });
    s += '<g class="pc-coil-eyes">' + eyes + '</g><path class="pc-brow" d="' + brows + '" stroke="' + CL.band + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    s += '<ellipse cx="31.6" cy="-3.6" rx="1.6" ry="1.1" transform="rotate(-20 31.6 -3.6)" fill="' + CL.feat + '"/>';
    s += '<path class="pc-mouth" d="' + (COIL_MOUTH[mk[6]] || COIL_MOUTH.line) + '" stroke="' + CL.feat + '" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    if (mood === 'sniff') s += '<path d="M41,-12q3,-3 6,0t6,0M43,-4q3,-3 6,0t6,0" stroke="' + CL.feat + '" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".55"/>';
    if (mood === 'worried' || mood === 'scared') s += '<path d="M-14,-27q3.4,6 0,8.6q-3.4,-2.6 0,-8.6Z" fill="#bfe6fb" stroke="#5aa6d6" stroke-width="1"/>';
    return { svg: s, pts: pts, eyes: COIL_EYES.map(function (e) { return [e[0], e[1], e[2]]; }) };
  }
  // His body's centre line, head end first (the ground at y = 0, his head at x = 0): from the neck,
  // a run along the floor, then `loops` loops (each rises away from us, toward the wall, comes back
  // and crosses over itself, as a cursive l does), or with `wave` a gentle undulation, then the tail.
  function coilLine(L) {
    var out = [], i;
    function push(q) { var last = out[out.length - 1]; if (!last || dist(last, q) > 0.6) out.push(q); }
    L.neck.forEach(function (P) { for (i = 0; i <= 10; i++) push(bez(P, i / 10)); });
    var st = out[out.length - 1], n = Math.round(48 * (L.turns || 0));
    for (i = 1; i <= n; i++) {
      var th = Math.PI * 2 * (L.turns || 0) * i / n;
      push([st[0] - (L.r * th + L.d * Math.sin(th)), st[1] - (L.d - L.d * Math.cos(th)) * L.k]);
    }
    (L.tail || []).forEach(function (P) {
      var e = out[out.length - 1], Q = P.map(function (q, qi) { return qi ? [e[0] + q[0], e[1] + q[1]] : e; });
      for (i = 1; i <= 12; i++) push(bez(Q, i / 12));
    });
    return out;
  }
  var COIL_LINES = {
    head: { neck: [[[-6, -10], [-12, -11], [-18, -13], [-24, -16]]], stub: true },
    long: { neck: [[[-8, -10], [-18, -11], [-30, -11], [-42, -11]]], turns: 1, r: 17, d: 34, k: 0.62, tail: [[[0, 0], [-26, 0], [-52, 1], [-74, -3]]] },
    longer: { neck: [[[-8, -10], [-16, -11], [-26, -11], [-34, -11]]], turns: 3, r: 14.4, d: 31, k: 0.6, tail: [[[0, 0], [-12, 0], [-24, -1], [-36, -5]]] },
    still: { neck: [[[-6, -22], [-14, -12], [-26, -10], [-46, -11]]], turns: 2, r: 19, d: 8, k: 0.9, tail: [[[0, 0], [-14, 0], [-28, -1], [-40, -5]]] },
    listen: { neck: [[[-8, -9], [-18, -10], [-30, -10], [-46, -11]]], turns: 2, r: 19, d: 8, k: 0.9, tail: [[[0, 0], [-14, 0], [-28, -1], [-40, -5]]] },
    think: { neck: [[[-6, -30], [-12, -14], [-26, -10], [-46, -11]]], turns: 2, r: 19, d: 8, k: 0.9, tail: [[[0, 0], [-14, 0], [-28, -1], [-40, -5]]] },
    slide: { neck: [[[-6, -9], [-20, -10], [-36, -11], [-52, -11]]], turns: 1.5, r: 21, d: 5, k: 0.9, tail: [[[0, 0], [-16, -1], [-30, -8], [-40, -22]]], slide: true }
  };
  var COIL_HEAD_AT = { stone: [0, -6.6, 0], head: [0, -17, 6], long: [0, -17, 5], longer: [0, -17, 5], still: [0, -31, 0], listen: [0, -14, 9], think: [0, -38, -20], slide: [0, -6.6, 0] };
  // one stretch of his body: a filled tube along the points (its start left open, so the stretch
  // before it, drawn first, runs on under it with no seam), his cross-bands and his cream belly
  // clipped inside, the outline round its sides and its far end only
  function coilPiece(R, C, sx, sy) {
    var Lp = C.map(function (c) { return add(c.p, c.n, c.w); }), Rp = C.map(function (c) { return add(c.p, c.n, -c.w); }), e = C[C.length - 1];
    var run = 'M' + pt(Lp[0]) + cr(Lp) + 'A' + N(e.w) + ' ' + N(e.w) + ' 0 0 0 ' + pt(Rp[Rp.length - 1]) + cr(Rp.slice().reverse());
    var pid = R.id(), cid = R.id(), belly = [], top = [], bands = '';
    R.defs += '<path id="' + pid + '" d="' + run + 'Z"/><clipPath id="' + cid + '"><use href="#' + pid + '"/></clipPath>';
    C.forEach(function (c) { belly.push(add(c.p, c.up, -c.w * 0.66)); top.push(add(c.p, c.up, c.w * 0.5)); });
    C.forEach(function (c) { if (c.band) bands += 'M' + pt(add(c.p, c.up, c.w + 3)) + 'L' + pt(add(c.p, c.up, -c.w * 0.3)); });
    var bw = Math.max(2.4, C[0].w * 0.62), inner = '<path d="M' + pt(belly[0]) + cr(belly) + '" stroke="' + CL.belly + '" stroke-width="' + N(bw) + '" fill="none" stroke-linecap="round"/>' +
      (bands ? '<path class="pc-bands" d="' + bands + '" stroke="' + CL.band + '" stroke-width="' + N(Math.max(2.2, C[0].w * 0.66)) + '" fill="none"/>' : '') +
      '<path d="M' + pt(top[0]) + cr(top) + '" stroke="' + CL.light + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/>';
    return '<use href="#' + pid + '" fill="' + CL.shade + '"/><g clip-path="url(#' + cid + ')"><use href="#' + pid + '" x="' + N(sx) + '" y="' + N(sy) + '" fill="' + CL.base + '"/>' + inner + '</g>' +
      '<path d="' + run + '" fill="none" stroke="' + CL.line + '" stroke-width="2.1" stroke-linejoin="round"/>';
  }
  function buildCoil(o) {
    o = o || {};
    var pose = COIL_POSES.indexOf(o.pose) >= 0 ? o.pose : 'head';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral', mk = COIL_MOOD[mood];
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), sx = -1.6 * F, sy = -2.4, pts = [], body = '', over = '';
    var dome = pose === 'stone' || pose === 'slide', HA = COIL_HEAD_AT[pose];
    // (the head's middle, 6 behind its snout's reach, on the box's centre line)
    var hm = mul(mT(HA[0], HA[1]), mul(mR(HA[2] + (dome ? 0 : mk[0])), mul(mS(COIL_HS), mT(dome ? 0 : -6, 0))));
    // ----- the body, in stretches of about 40, head end first: each drawn over the one before, so
    // where a loop comes back over itself, the later part lies on top
    var LD = COIL_LINES[pose];
    if (LD) {
      var C0 = coilLine(LD), Ls = [0];
      for (var i = 1; i < C0.length; i++) Ls.push(Ls[i - 1] + dist(C0[i - 1], C0[i]));
      var tot = Ls[Ls.length - 1] || 1, taper = LD.stub ? 0 : Math.min(150, tot * 0.45), sgn = 1, nextBand = 26;
      var C = C0.map(function (q, j) {
        var a = C0[Math.max(0, j - 1)], b = C0[Math.min(C0.length - 1, j + 1)], t = unit([b[0] - a[0], b[1] - a[1]]), n = [-t[1], t[0]];
        var s = Ls[j], w = LD.stub ? lerp(9.6, 8.6, s / tot) : s < 16 ? lerp(9.4, 11.4, s / 16) : s > tot - taper ? lerp(11.4, 1.8, Math.pow((s - (tot - taper)) / taper, 1.15)) : 11.4;
        if (Math.abs(n[1]) > 0.3) sgn = n[1] <= 0 ? 1 : -1;
        var c = { p: q, n: n, w: w, s: s, up: [n[0] * sgn, n[1] * sgn] };
        if (s >= nextBand && s < tot - 6) { c.band = true; nextBand += 21; }
        return c;
      });
      var cut = 40, from = 0;
      for (var k2 = 1; k2 < C.length; k2++) {
        if (C[k2].s - C[from].s >= cut || k2 === C.length - 1) { body += coilPiece(R, C.slice(from, k2 + 1), sx * 0.6, sy * 0.6); from = k2; }
      }
      C.forEach(function (c) { pts.push(add(c.p, c.n, c.w + 1), add(c.p, c.n, -c.w - 1)); });
      if (LD.slide) {
        // slow slide lines along his back, toward the gap; the tail end last, lifting
        [[-70, -30], [-130, -30], [-190, -30]].forEach(function (q) { over += '<path d="M' + N(q[0] - 14) + ',' + N(q[1]) + 'h22M' + N(q[0] - 6) + ',' + N(q[1] - 7) + 'h14" stroke="' + CL.line + '" stroke-width="1.8" stroke-linecap="round" opacity=".42"/>'; });
        var tt = C[C.length - 1].p;
        over += '<path d="M' + N(tt[0] - 6) + ',' + N(tt[1] - 6) + 'q-6,-4 -8,-11M' + N(tt[0] + 4) + ',' + N(tt[1] - 10) + 'q-3,-5 -2,-12" stroke="' + CL.line + '" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".4"/>';
        pts.push([tt[0] - 16, tt[1] - 22], [-204, -34]);
      }
    }
    // ----- the head (last: nothing of him ever lies over his face)
    var hd = coilHead(R, mood, dome, pose === 'stone');
    body += '<g transform="' + mStr(hm) + '">' + hd.svg + '</g>';
    var headPts = hd.pts.map(function (q) { return apply(hm, q); });
    pts = pts.concat(headPts);
    // ----- the things to tap (unpainted marks for the page): his head as one more stone; his eyes
    if (o.tap === 'stone' || (o.tap === 'eyes' && dome)) { var tc = apply(hm, [0, -6]); over += tapMark(o.tap, tc[0], tc[1], 26); }
    else if (o.tap === 'eyes') over += tapMarks('eyes', hd.eyes.map(function (e) { var q = apply(hm, [e[0], e[1]]); return [q[0], q[1], e[2] + 3]; }));
    // ----- one scale for every pose: his head at the bottom centre of the box, the body trailing back
    var Wb = COIL_BOX[0], Hb = COIL_BOX[1];
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mT(Wb / 2, Hb - 3));
    var hc = apply(M, apply(hm, [dome ? 0 : 6, 0]));
    return {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + over + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q) { return apply(M, q); })),
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })),
      _marks: { M: M, scale: 1 }
    };
  }

  // ------------------------------------------------------------------ Sleet (chapter 6)
  // The eldest dragonet (a he), spying on the fox from the long grass at the last post: a Mistscale
  // on his sister's model and about her size (sitting, his head well above a cat's; her 640 x 340 box),
  // silver-white scales with a cool blue-grey shade in the ridges, a paler belly, round bold blue eyes
  // under bossy brows (the brows whatever the mood), two soft horn nubs, never toothy, five
  // frost-white claws on each forepaw, both wings folded (no sore wing: that is Sprinkle's). Bold and
  // bossy, sure he is in charge of the whole clutch. Drawn with his sister's painters in his own
  // colours (withScales, as Puddle sits).
  //   hidden  in the long grass, nothing of him showing but the grass bent where he is ("PSST!")
  //   tail    only the tip of a scaly silver-white tail flicking up out of the grass ("HMPH!")
  //   flat    flat on his belly, chin down, spying
  //   point   one claw pointing ("You, otter: stop wiggling.")
  //   call    head up, mouth a round O: the roll call
  //   puff    chest puffed out, a grass seed falling off it
  //   droop   head low, tail drooping
  //   sit     all of him, sitting: what an unknown pose draws (his page in her book)
  //   pawup   one forepaw raised, five claws (`lit: n` lights n of them frost-white; reports `paw`)
  // Every mood; `tear`, `mist`, `squeeze`; `grass: true` (a tuft of long grass on his head).
  var SLEET_POSES = ['hidden', 'tail', 'flat', 'point', 'call', 'puff', 'droop', 'sit', 'pawup'];
  OTHER_POSES.sleet = SLEET_POSES;
  var SL = { base: '#e1e7ed', line: '#59687a', light: '#ffffff', belly: '#f5f8fa', bellyLine: '#c4cfda', ridge: '#b3c2d2', ridgeEdge: '#eef3f8',
    wing: '#edf1f5', vein: '#a9b7c6', wingLine: '#7a8899', claw: '#fbfdff', clawLine: '#86a3ba', nub: '#f2f5f8', pad: '#d3dce5', mouth: '#5d3844', nostril: '#748395',
    eye: ['#eef8ff', '#6fb0e6', '#2b679f'], pupil: '#121c2a', eyeInk: '#3a4757', glow: '#cfeeff', glow2: '#ffffff', glowLine: '#79b3d6', brow: '#4d5b6b' };
  SL.shade = mix(SL.base, SL.line, 0.2); SL.far = mix(SL.base, SL.line, 0.13); SL.farShade = mix(SL.base, SL.line, 0.3); SL.wingFar = mix(SL.wing, SL.line, 0.14);
  SL.feat = mix(SL.line, '#000', 0.2);
  // bossy brows: the inner ends low, whatever the mood, unless the mood lifts them
  var SL_BROW = { neutral: [4.6, -3.4], happy: [3, -2.6], dreamy: [2, -2], wonder: [-1.4, -3.2], worried: [-5, 3], scared: [-6, 3], sleepy: [2.4, -1.2],
    laugh: [3, -3], stern: [6, -4.2], kind: [2.4, -1.8], proud: [5, -4.4], sniff: [5, -3.6], shout: [4.4, -4.6], solemn: [4, -2.6], sad: [-6.6, 4], shy: [-3, 2] };
  function slPose(pose) {
    var P = {}, k;
    for (k in DZ_SIT) P[k] = DZ_SIT[k];
    P.wings = { left: 'fold', right: 'fold' };
    switch (pose) {
      case 'pawup': P.arms = [DZ_SIT.arms[0], { top: [24, -114, 17], paw: [118, -128], rot: -80, up: true }]; P.head = [44, -238, -2]; P.hold = null; break;
      case 'flat':
        // (laid out short, so his front, chin over his forepaws, is no further forward than it is
        // sitting: at the last post, flat in the grass is still past the post)
        P.hip = [-92, -30, 30]; P.chest = [-12, -30, 30]; P.haunch = [-94, -24, 40, 22, 0]; P.S = [-28, -54];
        P.neck = [[[8, -30], [26, -32], [40, -36], [52, -46]]]; P.neckW = [26, 22]; P.head = [72, -62, 8]; P.look = [1.8, 0.5];
        P.arms = [{ top: [2, -24, 13], paw: [70, -8], rot: -16, far: true }, { top: [14, -22, 14], paw: [90, -6], rot: -10 }]; P.armsBehind = true;
        P.feet = [[-106, -6, 0, true], [-82, -4, 0]];
        P.tail = [[[-118, -24], [-166, -12], [-210, -10], [-250, -12]], [[-250, -12], [-280, -14], [-296, -22], [-300, -34]]]; P.tailFront = false; P.hold = null;
        P.wings = { left: 'tight', right: 'tight' }; break;
      case 'point':
        P.arms = [DZ_SIT.arms[0], { top: [24, -112, 17], paw: [148, -132], rot: -20, claws: 'one' }]; P.head = [50, -238, 4]; P.look = [1.7, 0.5]; P.hold = null; break;
      case 'call':
        P.neck = [[[10, -140], [16, -180], [24, -210], [32, -232]]]; P.head = [36, -252, -24]; P.mouth = 'big'; P.look = [0.5, -1.6]; P.hold = null; break;
      case 'puff':
        P.chest = [16, -122, 60]; P.S = [-6, -156]; P.hip = [-40, -62, 58];
        P.neck = [[[16, -158], [20, -188], [30, -212], [42, -228]]]; P.head = [44, -252, -16]; P.look = [1, -0.6]; P.seed = [118, -150]; P.hold = null;
        P.arms = [{ top: [18, -112, 15], paw: [20, -8], rot: -10, far: true }, { top: [34, -104, 17], paw: [104, -6], rot: -8 }]; break;
      case 'droop':
        P.neck = [[[10, -140], [34, -168], [62, -172], [82, -154]]]; P.head = [94, -146, 16]; P.look = [0.3, 2.6];
        P.tail = [[[-108, -38], [-158, -16], [-200, -8], [-246, -8]], [[-246, -8], [-280, -8], [-300, -9], [-318, -12]]];
        P.wings = { left: 'droop', right: 'droop' }; P.hold = null; break;
    }
    return P;
  }
  // The long grass where he hides, in his box's units (the ground at y = 0): a clump of blades, the
  // middle ones bent over and pressed down where he lies. `bent`: how many lie bent. Returns the svg
  // and the clump's box.
  var LONG_GRASS = ['#a9ad5d', '#c3c071', '#8f9a4c', '#b8b265'];
  function longGrass(cx, wide, tall, bent, seed) {
    var s = '', n = Math.round(wide / 11), pts = [];
    for (var i = 0; i < n; i++) {
      var f = n === 1 ? 0.5 : i / (n - 1), x = cx - wide / 2 + wide * f + (rand(seed + i) - 0.5) * 6, h = tall * (0.62 + 0.38 * Math.sin(Math.PI * f)) * (0.86 + rand(seed + i * 3) * 0.2);
      var mid = Math.abs(f - 0.5) < bent / n / 2, lean = (rand(seed + i * 7) - 0.5) * 26 + (f - 0.5) * 30, col = LONG_GRASS[i % LONG_GRASS.length], w = 4.6 + (i % 3) * 1.2;
      var top = mid ? [x + (f < 0.5 ? -1 : 1) * h * 0.55, -h * 0.42] : [x + lean, -h], c1 = mid ? [x + (f < 0.5 ? -0.2 : 0.2) * h, -h * 0.8] : [x + lean * 0.2, -h * 0.55];
      s += '<path d="M' + N(x - w / 2) + ',0Q' + pt(c1) + ' ' + pt(top) + 'Q' + pt([c1[0] + w * 0.6, c1[1] + 4]) + ' ' + N(x + w / 2) + ',0Z" fill="' + col + '" stroke="#6f7a35" stroke-width="1.3" stroke-linejoin="round"/>';
      pts.push(top, [x - w, 0], [x + w, 0]);
    }
    // seed heads on the tall blades
    for (var j = 0; j < n; j += 3) { var q = pts[j * 3]; s += '<ellipse cx="' + N(q[0]) + '" cy="' + N(q[1] - 4) + '" rx="2.4" ry="5.6" fill="#d6c98a" stroke="#8e7f3c" stroke-width="1"/>'; pts.push([q[0], q[1] - 10]); }
    return { svg: '<g class="pc-long-grass">' + s + '</g>', pts: pts };
  }
  function buildSleet(o) { o = o || {}; return withScales(SL, function () { return sleetDraw(o); }); }
  function sleetDraw(o) {
    var pose = SLEET_POSES.indexOf(o.pose) >= 0 ? o.pose : 'sit';
    if (pose !== 'hidden' && pose !== 'tail') {
      var os = {}, k;
      for (k in o) if (k !== 'holds') os[k] = o[k];
      os.pose = pose === 'flat' || pose === 'pawup' ? pose : 'sit';
      var K = { P: slPose(pose), brows: SL_BROW, wings: slPose(pose).wings, paw: pose === 'pawup', grass: o.grass === true };
      if (pose === 'pawup') K.lit = clamp(o.lit === true ? 5 : intOr(o.lit, 0), 0, 5);
      return buildSprinkle(os, K);
    }
    // only the grass bent where he is; or the tip of his tail flicking up out of it
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), body = '', pts = [], headPts;
    var gr = longGrass(10, 300, 150, pose === 'hidden' ? 7 : 3, 41);
    if (pose === 'tail') {
      // (after review: a dragonet's tail, not a bent white stick. Thick at the grass and tapering to a
      // point, it rises well clear of the grass's tips and curls over in the flick: his silver-white, a
      // paler underside, the blue-grey plates along its back, three scale arcs across it, and the flick's
      // motion lines round the curl)
      var tip = chainTube([[[-16, -30], [-10, -100], [0, -156], [22, -194]], [[22, -194], [42, -226], [80, -234], [98, -212]]],
        function (u) { return lerp(23, 2.2, Math.pow(u, 0.8)); }, 10);
      var rid = ridgeRow(tip, 0.1, 0.84, 8, 0.5, UPPER), arcs = '', under = [];
      [0.36, 0.48, 0.6].forEach(function (u) {
        var a = tip.at(u), w = a.w * 0.92;
        arcs += 'M' + pt(add(a.p, a.n, w)) + 'Q' + pt(add(a.p, a.t, w * 0.8)) + ' ' + pt(add(a.p, a.n, -w));
      });
      for (var q = 0; q <= 14; q++) { var a = tip.at(0.06 + q / 14 * 0.8); under.push(add(a.p, a.n, -UPPER(a) * a.w * 0.55)); }
      body += ridgesSvg(rid) + R.part(tip.d, { fill: DZ.base, dark: DZ.farShade, line: DZ.line, sx: -4 * F, sy: -3, lw: 2.8,
        inner: '<path d="M' + pt(under[0]) + cr(under) + '" stroke="' + DZ.belly + '" stroke-width="8" fill="none" stroke-linecap="round" opacity=".85"/>' +
          '<path class="pc-scales" d="' + arcs + '" stroke="' + DZ.line + '" stroke-width="2.8" fill="none" stroke-linecap="round" opacity=".75"/>' });
      // the flick: motion lines round the curl, on the side it flicks to and behind it
      body += '<path class="pc-flick" d="M58,-252q30,-2 48,20M76,-264q32,4 46,32M114,-200q8,10 4,24M-4,-212q-14,-10 -12,-28" stroke="' + DZ.line + '" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>';
      pts = pts.concat(tip.pts, [[124, -266], [-18, -242]]);
      headPts = [[26, -246], [108, -246], [26, -186], [108, -186]];
    } else {
      // a few short lines where the grass trembles
      body += '<path class="pc-rustle" d="M-60,-128l-10,-10M-48,-140l-4,-14M74,-126l10,-10M62,-140l4,-14" stroke="#6f7a35" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>';
      pts.push([-74, -156], [88, -156]);
      headPts = [[-46, -130], [66, -130], [-46, -60], [66, -60]];
    }
    body = gr.svg.replace('<g class="pc-long-grass">', '<g class="pc-long-grass pc-behind">') + body + longGrass(10, 210, 92, 0, 77).svg;
    pts = pts.concat(gr.pts);
    var Wb = DZ_BOX[0], Hb = DZ_BOX[1];
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mT(Wb / 2, Hb - 3));
    var hb = boxOf(headPts.map(function (q) { return apply(M, q); })), hc = [(hb.x0 + hb.x1) / 2, (hb.y0 + hb.y1) / 2];
    return {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 }, headBox: hb,
      bounds: boxOf(pts.map(function (q) { return apply(M, q); })), _marks: { M: M, scale: 1 }
    };
  }

  // ------------------------------------------------------------------ public: characters

  // A Clan cat never wears her coat. An 8-year-old must find herself at a glance, and two brown
  // tabbies side by side read as twins (chapter 2's rim, with a cat in the first default look). A
  // Clan cat whose coat is the player's fur (as drawn: a brown tabby when her look names none)
  // wears a spare instead: the first of CLAN_SPARE that is not her fur and not on another Clan cat
  // in the same picture (`taken`: their variants). With no `look` (a character drawn on its own) the
  // variant is as asked. The scenes pass the player's look for every Clan cat in the cast, and the
  // Counts pictures for every Clan cat their `who` puts in a place, so a rim cat keeps one coat
  // from the panel to the counting picture.
  var CLAN_SPARE = [4, 6, 2, 3, 5, 1];
  function clanVariant(v, look, taken) {
    v = clamp(intOr(v, 1), 1, 6);
    if (!look || typeof look !== 'object') return v;
    var fur = specFromLook(look).fur, i;
    if (CLAN[v - 1].fur !== fur) return v;
    taken = Array.isArray(taken) ? taken.map(function (t) { return clamp(intOr(t, 1), 1, 6); }) : [];
    for (i = 0; i < CLAN_SPARE.length; i++) if (CLAN[CLAN_SPARE[i] - 1].fur !== fur && taken.indexOf(CLAN_SPARE[i]) < 0) return CLAN_SPARE[i];
    for (i = 0; i < CLAN_SPARE.length; i++) if (CLAN[CLAN_SPARE[i] - 1].fur !== fur) return CLAN_SPARE[i];
    return v;
  }

  // A drawing in a box `k` times its own, the same shape, its feet still on the bottom centre: every
  // point it reports scaled with it (Sloshbank's, 228 x 228 for a cat's 200)
  var BIG_BOX = 1.14;
  function bigBox(r, k) {
    function sc(b) { return b ? { x0: Math.round(b.x0 * k * 10) / 10, y0: Math.round(b.y0 * k * 10) / 10, x1: Math.round(b.x1 * k * 10) / 10, y1: Math.round(b.y1 * k * 10) / 10 } : b; }
    function sp(q) { return q ? Object.assign({}, q, { x: Math.round(q.x * k * 10) / 10, y: Math.round(q.y * k * 10) / 10 }, q.r != null ? { r: Math.round(q.r * k * 10) / 10 } : {}) : q; }
    var out = { svg: '<g transform="scale(' + k + ')">' + r.svg + '</g>', w: Math.round(r.w * k), h: Math.round(r.h * k), head: sp(r.head), headBox: sc(r.headBox), bounds: sc(r.bounds),
      _marks: { M: mul(mS(k), r._marks.M), scale: r._marks.scale * k, chestTop: r._marks.chestTop ? [r._marks.chestTop[0] * k, r._marks.chestTop[1] * k] : null } };
    if (r.held) out.held = sp(r.held);
    if (r.reach) out.reach = Object.assign(sp(r.reach), { edge: Math.round(r.reach.edge * k * 10) / 10 });
    return out;
  }

  function catSpec(who, o) {
    // chapter 6: the starry cat, whoever the entry names (and ReedClan's coats, which no look changes)
    if (o.starry === true) return resolve(STARRY);
    if (who === 'player') return resolve(specFromLook(o.look));
    if (who === 'clancat') return resolve(CLAN[clanVariant(o.variant, o.look, o.taken) - 1]);
    if (who === 'reedclan') return resolve(REED[clamp(intOr(o.variant, 1), 1, 4) - 1]);
    return resolve(PRESETS[who]);
  }

  art.character = function (who, opts) {
    var o = opts || {};
    var r;
    if (who === 'tallone') r = tallOne(o);
    else if (who === 'sparrow') r = sparrow(o);
    else if (who === 'moth') r = moth(o);
    else if (who === 'riffle' || who === 'otter' || who === 'dog') r = buildBeast(beastSpec(who, o), o);
    else if (who === 'sprinkle') r = buildSprinkle(o);
    else if (who === 'reynard') r = buildFox(o);
    else if (who === 'squall') r = buildSquall(o);
    else if (who === 'patience') r = buildPatience(o);
    else if (who === 'puddle') r = buildPuddle(o);
    else if (who === 'wisp') r = buildWisp(o);
    else if (who === 'coil') r = buildCoil(o);
    else if (who === 'sleet') r = buildSleet(o);
    // chapter 8: Hail, the speckled dragonet; Snip and Snatch, the weasels
    else if (who === 'hail') r = buildHail(o);
    else if (who === 'snip' || who === 'snatch') r = buildWeasel(who, o);
    else r = buildCat(catSpec(PRESETS[who] || who === 'player' || who === 'clancat' || who === 'reedclan' ? who : 'clancat', o), o);
    // chapter 6: Sloshbank is bigger than Tallyheart, who already fills a cat's box, so his drawing
    // comes in a bigger box (BIG_BOX times a cat's: the scenes scale every box alike, by a cat's)
    if (who === 'sloshbank' && o.starry !== true) r = bigBox(r, BIG_BOX);
    var out = { svg: r.svg, w: r.w, h: r.h, head: r.head };
    if (r.headBox) {
      out.headBox = r.headBox; out.bounds = r.bounds;
      if (r._marks.chestTop) out.chestTop = { x: r._marks.chestTop[0], y: r._marks.chestTop[1] };
    }
    if (r.held) out.held = r.held;
    // Sprinkle curled round someone: her tail's near loop, to draw over them, and where they sit
    if (r.front) out.front = r.front;
    if (r.nest) out.nest = r.nest;
    // Squall: the pole he holds (its line in his box), and his raised forepaw
    if (r.pole) out.pole = r.pole;
    if (r.paw) out.paw = r.paw;
    // a cat with `reach`: the paw she holds out over the edge, and the line of the edge
    if (r.reach) out.reach = r.reach;
    // Patience: where a dragonfly sits on her bill
    if (r.bill) out.bill = r.bill;
    // chapter 5, `glow: true` on anyone: a soft glow behind them (class pc-next, as a Counts picture
    // marks the next thing to tap: Riffle hopping on the spot, bursting with a question). The
    // character's own group comes straight after the glow, so the page wiggles the two together.
    if (o.glow && r.bounds) {
      var gb = r.bounds, gm = Math.max(8, (gb.y1 - gb.y0) * 0.07);
      out.svg = '<g class="pc-glowing">' + nextGlowSoft(gb.x0 - gm, gb.y0 - gm, gb.x1 - gb.x0 + gm * 2, gb.y1 - gb.y0 + gm * 1.4, '.5') + r.svg + '</g>';
    }
    return out;
  };
  // The dragonfly by itself, for a set that puts it somewhere of its own: { svg, w, h }, a group in
  // a 40 x 28 box, its feet on the middle of the bottom edge. `asleep`: wings laid back.
  art.dragonfly = function (opts) {
    var o = opts || {};
    return { svg: '<g>' + dragonflySvg(20, 26, 0, 1, !!o.asleep, o.facing === 'left' ? -1 : 1) + '</g>', w: 40, h: 28 };
  };

  art.clanVariant = clanVariant;

  art.cat = function (opts) {
    var o = opts || {};
    var r = buildCat(resolve(specFromLook(o.look)), o);
    var out = { svg: r.svg, w: r.w, h: r.h, head: r.head, headBox: r.headBox, bounds: r.bounds };
    if (r.held) out.held = r.held;
    return out;
  };

  // ------------------------------------------------------------------ public: counts pictures

  var GLOW = '#ffb21f', GLOW2 = '#ffe36e';
  var CLAN_LOOKS = [3, 1, 6, 4, 2, 5];

  function cell(inner, x, y, k) { return '<g transform="translate(' + N(x) + ',' + N(y) + ') scale(' + k + ')">' + inner + '</g>'; }

  // a raised forepaw, pads toward us, with five claws (four toes and the dewclaw)
  function forepaw(lit, base) {
    var fur = '#e8913a', line = '#8f4a1b', pad = '#f4a5b4', s = '';
    var claws = [[-30, -40, -14], [-11, -54, -5], [11, -54, 5], [30, -40, 14], [-46, 2, -60]];
    s += '<path d="M-38,10Q-50,-30 -30,-48Q0,-70 30,-48Q50,-30 38,10Q30,60 0,62Q-30,60 -38,10Z" fill="' + fur + '" stroke="' + line + '" stroke-width="3"/>';
    s += '<path d="M-14,28Q0,8 14,28Q20,44 0,46Q-20,44 -14,28Z" fill="' + pad + '" stroke="' + mix(pad, line, 0.4) + '" stroke-width="1.6"/>';
    s += '<g fill="' + pad + '" stroke="' + mix(pad, line, 0.4) + '" stroke-width="1.4"><ellipse cx="-24" cy="-18" rx="8" ry="9"/><ellipse cx="-8" cy="-30" rx="8" ry="9.5"/><ellipse cx="8" cy="-30" rx="8" ry="9.5"/><ellipse cx="24" cy="-18" rx="8" ry="9"/><ellipse cx="-34" cy="14" rx="5" ry="6"/></g>';
    claws.forEach(function (c, i) {
      var on = i < lit, ang = c[2];
      var t = 'translate(' + c[0] + ',' + c[1] + ') rotate(' + ang + ')';
      if (on) s += '<circle cx="' + c[0] + '" cy="' + (c[1] - 8) + '" r="13" fill="' + GLOW + '" opacity=".55"/>';
      s += '<path transform="' + t + '" d="M-4,0Q-3,-14 2,-22Q3,-12 4,0Z" fill="' + (on ? GLOW2 : '#fbf6ea') + '" stroke="' + (on ? '#d18b12' : '#9a8a72') + '" stroke-width="1.6" stroke-linejoin="round"/>';
    });
    return s;
  }

  function sparkle(x, y, r) {
    var k = r * 0.2;
    return '<path d="M' + N(x) + ',' + N(y - r) + 'Q' + N(x + k) + ',' + N(y - k) + ' ' + N(x + r) + ',' + N(y) + 'Q' + N(x + k) + ',' + N(y + k) + ' ' + N(x) + ',' + N(y + r) +
      'Q' + N(x - k) + ',' + N(y + k) + ' ' + N(x - r) + ',' + N(y) + 'Q' + N(x - k) + ',' + N(y - k) + ' ' + N(x) + ',' + N(y - r) + 'Z" fill="#fffbe8" stroke="#eea20c" stroke-width="1.6" stroke-linejoin="round"/>';
  }
  function glow(x, y, r) {
    return '<circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r) + '" fill="' + GLOW + '" opacity=".45"/><circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r * 0.62) + '" fill="' + GLOW2 + '" opacity=".75"/>';
  }
  function countsCat(gi, extra) {
    var s = {}, src = CLAN[CLAN_LOOKS[gi % 6] - 1], k;
    for (k in src) s[k] = src[k];
    for (k in (extra || {})) s[k] = extra[k];
    return resolve(s);
  }

  // The drawing spec of a cast member a Counts picture's `who` puts in a place: the player in her
  // look, a Clan cat never in her coat (clanVariant, against the other Clan cats in `who`; her fur
  // as drawn when the picture is given no look), anyone else as drawn in the scenes.
  function whoSpec(o, e) {
    if (e.who === 'player') return specFromLook(e.look || o.look);
    if (e.who === 'clancat') {
      var taken = (o.who || []).filter(function (w) { return w && w.who === 'clancat'; }).map(function (w) { return w.variant; });
      return CLAN[clanVariant(e.variant, o.look || {}, taken) - 1];
    }
    // chapter 6: a ReedClan cat in its own marsh coat, by variant (no look changes it: none is hers)
    if (e.who === 'reedclan') return REED[clamp(intOr(e.variant, 1), 1, 4) - 1];
    return PRESETS[e.who] || CLAN[0];
  }

  // A Counts character: the Clan cat for this place, or the cast member `who` puts there. `lit` is
  // whether this one's things are all counted: then `litMood` applies, and the grizzled old tom
  // flattens his ears ("Flat ears still count").
  function countsChar(o, idx, extra, co, lit) {
    var e = o.who && o.who[idx];
    if (!e || !e.who) return buildCat(countsCat(idx, extra), co);
    var oo = {}, k;
    for (k in co) oo[k] = co[k];
    if (e.pose) oo.pose = e.pose;
    if (e.mood) oo.mood = e.mood;
    if (lit && (e.litMood || e.who === 'grizzled')) {
      oo.mood = e.litMood || 'stern';
      if (e.flatEars !== false && (e.flatEars || e.who === 'grizzled')) oo.earBias = 46;
    }
    if (e.who === 'riffle' || e.who === 'otter' || e.who === 'dog') {
      // fitted into the cat's 200 x 200 cell, feet on its ground line
      var r = buildBeast(beastSpec(e.who, e), oo), kk = Math.min(1, 196 / r.w, 196 / r.h);
      var tx = 100 - r.w * kk / 2, ty = 197 - (r.h - 3) * kk, Mc = mul([1, 0, 0, 1, tx, ty], mS(kk));
      return { svg: '<g transform="' + mStr(Mc) + '">' + r.svg + '</g>', _marks: { M: mul(Mc, r._marks.M), ears: r._marks.ears.map(function (q) { return apply(Mc, q); }), paws: [] } };
    }
    var src = whoSpec(o, e);
    var sp = {};
    for (k in src) sp[k] = src[k];
    for (k in (extra || {})) sp[k] = extra[k];
    return buildCat(resolve(sp), oo);
  }

  // A running total under a counted group (2, 4, 6…), in the times-table font.
  function totalNum(x, y, n, dark) {
    return '<text class="pc-total" x="' + N(x) + '" y="' + N(y) + '" text-anchor="middle" font-family="Andika, ui-rounded, system-ui, sans-serif" font-weight="700" font-size="36"' +
      ' fill="' + (dark ? '#fff6d6' : '#6a3d12') + '" stroke="' + (dark ? '#33284a' : '#fffaf0') + '" stroke-width="6" stroke-linejoin="round" paint-order="stroke">' + n + '</text>';
  }
  // The soft glow on the next group to count.
  function nextGlow(x, y, w, h) {
    return '<rect class="pc-next" x="' + N(x) + '" y="' + N(y) + '" width="' + N(w) + '" height="' + N(h) + '" rx="26" fill="#fff3c2" opacity=".8" stroke="#f2b23a" stroke-width="3.5" stroke-dasharray="12 9"/>';
  }
  function svgDoc(W, H, label, inner) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + ' ' + N(H) + '" role="img" aria-label="' + label + '">' + inner + '</svg>';
  }
  // The old tom's boast: the picture in a thought cloud, last night under an evening sky (no moon),
  // with the little bubbles trailing down to whoever is thinking it (bottom left; `thought: 'right'`).
  function thoughtDoc(W, H, label, body, side, groundY) {
    var id = 'pct' + (++serial).toString(36), m = 50, cw = W + m * 2, ch = H + m * 2, trail = 84;
    var pts = [], n = Math.max(12, Math.round((cw + ch) / 62));
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * (i + 0.5) / n, c = Math.cos(a), sn = Math.sin(a);
      pts.push([cw / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.6) * (cw / 2 - 20), ch / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.6) * (ch / 2 - 20)]);
    }
    var cloud = scallop(pts, 0.6), sky = ['#3B3A74', '#5F4F8E', '#8E64A0', '#C9738A', '#E58E7A', '#F2AE7A'], st = '';
    sky.forEach(function (col, k) { st += '<stop offset="' + N(k / (sky.length - 1)) + '" stop-color="' + col + '"/>'; });
    var stars = '';
    for (var k2 = 0; k2 < 14; k2++) stars += '<circle cx="' + N(30 + rand(k2 * 7 + 1) * (cw - 60)) + '" cy="' + N(24 + rand(k2 * 7 + 2) * ch * 0.4) + '" r="' + N(1.2 + rand(k2 * 7 + 3) * 1.6) + '"/>';
    var s = '<defs><linearGradient id="' + id + '-sky" x1="0" y1="0" x2="0" y2="1">' + st + '</linearGradient><clipPath id="' + id + '-c"><path d="' + cloud + '"/></clipPath></defs>' +
      '<path d="' + cloud + '" fill="url(#' + id + '-sky)"/>' +
      '<g clip-path="url(#' + id + '-c)"><g fill="#fff8e6" opacity=".85">' + stars + '</g>' +
      groundEllipse(cw, ch, m + (groundY == null ? H - 24 : groundY)) + '</g>' +
      '<g transform="translate(' + m + ',' + m + ')">' + body + '</g>' +
      '<path d="' + cloud + '" fill="none" stroke="#6f5d8c" stroke-width="13" stroke-linejoin="round"/><path d="' + cloud + '" fill="none" stroke="#fffaf0" stroke-width="8" stroke-linejoin="round"/>';
    var dir = side === 'right' ? 1 : -1;
    [[0.24, 18, 18], [0.15, 50, 12], [0.09, 74, 7.5]].forEach(function (b) {
      var bx = dir < 0 ? cw * b[0] : cw * (1 - b[0]), by = ch - 6 + b[1];
      s += '<circle cx="' + N(bx) + '" cy="' + N(by) + '" r="' + b[2] + '" fill="#fffaf0" stroke="#6f5d8c" stroke-width="2.6"/>';
    });
    return svgDoc(cw, ch + trail, 'A thought: ' + label, s);
  }

  // the ground under the remembered pile: a low, wide hill whose top is at y
  function groundEllipse(cw, ch, y) {
    var ry = (ch - y) + 60;
    return '<ellipse cx="' + N(cw / 2) + '" cy="' + N(y + ry) + '" rx="' + N(cw * 0.8) + '" ry="' + N(ry) + '" fill="#7a6170"/>' +
      '<ellipse cx="' + N(cw / 2) + '" cy="' + N(y + ry) + '" rx="' + N(cw * 0.8) + '" ry="' + N(ry) + '" fill="none" stroke="#9a7f8c" stroke-width="5" opacity=".8"/>';
  }

  // ----- chapter 3: the 5s

  // A raised forepaw in a given cat's fur (its pads, its white paws, a tabby's bars, a tortie's or
  // calico's patches), the same shape and five claws as chapter 1's ginger forepaw, lit in the same
  // order. `sp` is a resolved spec (or { pal } for an otter or a dog).
  // Chapter 5, `tuck` (the 9s: "Nine claws out. One tucked in."): the fifth claw, the dewclaw, is
  // curled back in, short and dark ("the claw goes dark": it shows on any fur, white paws too), and
  // never lit: the same claw on every cat.
  var TUCKED = { fill: '#7d7262', line: '#463e33' };
  function tuckedClaw(x, y, rot, k) {
    return '<g class="pc-tucked" transform="translate(' + x + ',' + y + ') rotate(' + rot + ') scale(' + (k || 1) + ')"><path d="M-5.6,0Q-7,-10.4 0.2,-12.4Q7.2,-10.6 5.6,0Z" fill="' + TUCKED.fill + '" stroke="' + TUCKED.line + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M-2.4,-3.2Q0.4,-7.6 3.2,-4.4" stroke="' + TUCKED.line + '" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".85"/></g>';
  }
  function furPaw(lit, sp, tuck) {
    var p = sp.pal, fur = sp.marks && sp.marks.paws ? markFill(sp) : p.base, line = p.line, pad = p.earIn || '#f4a5b4', s = '';
    var claws = [[-30, -40, -14], [-11, -54, -5], [11, -54, 5], [30, -40, 14], [-46, 2, -60]], cid = 'pcfp' + (++serial).toString(36);
    var PAW = 'M-38,10Q-50,-30 -30,-48Q0,-70 30,-48Q50,-30 38,10Q30,60 0,62Q-30,60 -38,10Z', inner = '';
    if (!(sp.marks && sp.marks.paws)) {
      if (sp.pattern === 'tabby') inner += '<path d="M-44,40Q0,30 44,40M-46,22Q0,12 46,22" stroke="' + p.stripe + '" stroke-width="7" fill="none"/>';
      else if (sp.pattern === 'tortie') inner += '<path d="' + blob(-22, 18, 26, 4) + '" fill="' + p.patches[0] + '"/><path d="' + blob(22, -34, 16, 6) + '" fill="' + p.patches[1] + '"/>';
      else if (sp.pattern === 'calico') inner += '<path d="' + blob(20, 22, 26, 5) + '" fill="' + p.patches[0] + '"/><path d="' + blob(-24, -30, 16, 7) + '" fill="' + p.patches[1] + '"/>';
    }
    s += '<defs><clipPath id="' + cid + '"><path d="' + PAW + '"/></clipPath></defs><path d="' + PAW + '" fill="' + fur + '"/>' +
      (inner ? '<g clip-path="url(#' + cid + ')">' + inner + '</g>' : '') + '<path d="' + PAW + '" fill="none" stroke="' + line + '" stroke-width="3"/>';
    s += '<path d="M-14,28Q0,8 14,28Q20,44 0,46Q-20,44 -14,28Z" fill="' + pad + '" stroke="' + mix(pad, line, 0.4) + '" stroke-width="1.6"/>';
    s += '<g fill="' + pad + '" stroke="' + mix(pad, line, 0.4) + '" stroke-width="1.4"><ellipse cx="-24" cy="-18" rx="8" ry="9"/><ellipse cx="-8" cy="-30" rx="8" ry="9.5"/><ellipse cx="8" cy="-30" rx="8" ry="9.5"/><ellipse cx="24" cy="-18" rx="8" ry="9"/><ellipse cx="-34" cy="14" rx="5" ry="6"/></g>';
    claws.forEach(function (c, i) {
      if (tuck && i === 4) { s += tuckedClaw(c[0], c[1], c[2]); return; }
      var on = i < lit;
      if (on) s += '<circle cx="' + c[0] + '" cy="' + (c[1] - 8) + '" r="13" fill="' + GLOW + '" opacity=".55"/>';
      s += '<path transform="translate(' + c[0] + ',' + c[1] + ') rotate(' + c[2] + ')" d="M-4,0Q-3,-14 2,-22Q3,-12 4,0Z" fill="' + (on ? GLOW2 : '#fbf6ea') + '" stroke="' + (on ? '#d18b12' : '#9a8a72') + '" stroke-width="1.6" stroke-linejoin="round"/>';
    });
    return s;
  }
  // Sprinkle's forearm in a Counts picture: plain grey, outlined
  function R0part(d) { return '<path d="' + d + '" fill="' + DZ.base + '" stroke="' + DZ.line + '" stroke-width="3" stroke-linejoin="round"/>'; }
  // a softer next-glow, for the pictures where it sits over a character or the night
  function nextGlowSoft(x, y, w, h, op) {
    return '<rect class="pc-next" x="' + N(x) + '" y="' + N(y) + '" width="' + N(w) + '" height="' + N(h) + '" rx="26" fill="#fff3c2" opacity="' + (op || '.5') + '" stroke="#f2b23a" stroke-width="3.5" stroke-dasharray="12 9"/>';
  }

  // ----- chapter 4: the 10s (both forepaws)

  // The roof's grit, pale and dry: Squall's seven little forepaws are scratched in it, and its help.
  var GRIT = { patch: '#cfcabd', edge: '#958f83', dots: '#a59f92', box: '#bbb5a6', groove: '#4d4840', shine: '#f6f3ea', wet: '#bdb7a9', word: 'grit', pale: true };

  // A dragonet's forepaw held up in a Counts picture, pads toward us, claws spread, on a forearm that
  // comes up from below (the colours are `DZ`'s: Sprinkle's, or Squall's inside withScales).
  function dragonPawUp(cx, top, k, litN, lean, bottom, tuck) {
    var fa = [cx + lean, bottom, 19 * k], fb = [cx, top + 56 * k, 14.4 * k], fg = hull2(fa, fb, 8);
    return R0part(fg.d) + '<path d="M' + N(cx - 9 * k + lean * 0.4) + ',' + N(top + 88 * k) + 'q' + N(4.6 * k) + ',' + N(4.6 * k) + ' ' + N(9 * k) + ',0q' + N(4.6 * k) + ',' + N(4.6 * k) + ' ' + N(9 * k) + ',0" stroke="' + DZ.shade + '" stroke-width="2.4" fill="none"/>' +
      dzPaw(cx, top + 58 * k, -90, k, tuck ? { pads: true, lit: litN, tuck: true } : { pads: true, lit: litN }).svg;
  }
  // Squall, small behind his own forepaws (he sits; the arms are the picture's)
  function squallBehind(e, lit, wide, top) {
    var d = buildSquall({ pose: 'sit', mood: lit && e.litMood ? e.litMood : e.mood || 'proud', facing: e.facing, noArms: true });
    var b = d.bounds, k = Math.min((wide - 12) / (b.x1 - b.x0), 104 / (b.y1 - b.y0), 0.8);
    return '<g transform="translate(' + N(wide / 2 - d.head.x * k) + ',' + N(top - b.y0 * k) + ') scale(' + N(k) + ')">' + d.svg + '</g>';
  }

  // The 10s: each group is chapter 3's forepaw doubled. A cat's two big forepaws held up side by
  // side, pads toward us, five long claws each (the dewclaws inward, like thumbs), and the cat small
  // behind them, so the ten can be counted (a whole cat with ten tiny claws can't be, at nine or ten
  // cats). Lit a claw at a time in order, the left paw and then the right: the skip-count and
  // `lit: 50` light whole cats. At most five cats to a row, so 10 × 10 is two rows of five. `who`
  // puts those characters in the places (each paw in that cat's fur); a place without one is a Clan
  // cat, in the order the other Counts pictures seat them.
  // Chapter 5, the 9s (`nine`: any picture of nine things a group that is not prey, rows or one of
  // the paws pictures): the same group with one claw curled in and unlit, the same claw on every cat
  // (the dewclaw of the right-hand paw, the tenth in lit order), so nine can be counted and the
  // tucked one seen. `highlight` counts nine a cat. `tuck` says how many cats, from the first, have
  // curled theirs in: every one when it is left out (the still picture: nine out, one tucked);
  // `tuck: 0` or false, none (the hop: with `highlight` at ten a cat, or at nine a cat or more,
  // every claw on every cat is lit); `tuck: n`, the first n. `tuck: true` is the tuck Tap's picture,
  // tap by tap and kept: every claw that is out is lit, the cats tapped so far (`taps`; else read
  // from `highlight`, which the engine gives as nine a tap or as the claws still lit) have curled
  // one in, the next one glows, and NO NUMBER IS EVER DRAWN UNDER A CAT, whatever `totals` says.
  function tensPicture(o, groups, nine) {
    var per = nine ? 9 : 10, hl = clamp(intOr(o.highlight, 0), 0, 10 * groups);
    if (!nine) hl = clamp(intOr(o.highlight, 0), 0, per * groups);
    var TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / per) : -1;
    var tapMode = nine && o.tuck === true, tuckN = 0, left = hl;
    if (nine) {
      if (tapMode) {
        var raw = intOr(o.highlight, 0);
        tuckN = o.taps != null ? intOr(o.taps, 0) : o.tucked != null ? intOr(o.tucked, 0) : raw <= 9 * groups && raw % 9 === 0 ? raw / 9 : 10 * groups - raw;
        tuckN = clamp(tuckN, 0, groups);
        TOT = 0; nextG = o.next && tuckN < groups ? tuckN : -1;
      } else {
        tuckN = o.tuck === false || o.hop === true ? 0 : typeof o.tuck === 'number' ? clamp(o.tuck | 0, 0, groups) : groups;
        // the hop: nothing tucked yet, and all of it lit
        if (!tuckN && hl >= 9 * groups) left = hl = 10 * groups;
        if (tuckN >= groups) left = hl = Math.min(hl, 9 * groups);
        nextG = -1;
        if (o.next) { var acc = 0; for (var ni = 0; ni < groups; ni++) { var no = ni < tuckN ? 9 : 10; if (hl < acc + no) { nextG = ni; break; } acc += no; } }
      }
    }
    var CW = 204, CH = 204, PT = 66, pad = 18, cols = Math.max(1, Math.min(5, groups)), rows = Math.max(1, Math.ceil(groups / 5));
    var W = pad * 2 + cols * CW, H = pad * 2 + rows * (CH + TOT), body = '', who = o.who || [];
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / 5), col = gi % 5, inRow = Math.min(5, groups - row * 5);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT), g = '';
      var e = who[gi], litN = clamp(hl - gi * per, 0, per), litAll = litN >= per, l0 = Math.min(5, litN), l1 = Math.max(0, litN - 5);
      var tucked = nine && gi < tuckN;
      if (nine) {
        var outN = tucked ? 9 : 10;
        litN = tapMode ? outN : clamp(left, 0, outN); left -= outN;
        litAll = tapMode ? tucked : litN >= outN; l0 = Math.min(5, litN); l1 = Math.max(0, litN - 5);
      }
      if (e && (e.who === 'sprinkle' || e.who === 'squall' || e.who === 'puddle' || e.who === 'wisp' || e.who === 'sleet')) {
        // a dragonet's own two forepaws: Sprinkle's bigger and grey, Squall's a cat's size and slate
        // (chapter 5: Puddle's blue-grey, Wisp's pearl, each small behind its own; chapter 6: Sleet's silver)
        var sq = e.who === 'squall';
        g += withScales(sq ? SQ : e.who === 'puddle' ? PD : e.who === 'wisp' ? WS : e.who === 'sleet' ? SL : DZ, function () {
          var behind;
          if (sq) behind = squallBehind(e, litAll, CW, 2);
          else if (e.who !== 'sprinkle') behind = dragonetBehind(e, litAll, CW, 2);
          else {
            var d = buildSprinkle({ pose: e.pose || 'sit', mood: litAll && e.litMood ? e.litMood : e.mood || 'happy', facing: e.facing, noArms: true });
            var b = d.bounds, kd = Math.min((CW - 16) / (b.x1 - b.x0), 150 / (b.y1 - b.y0));
            behind = '<g transform="translate(' + N(CW / 2 - d.head.x * kd) + ',' + N(4 - b.y0 * kd) + ') scale(' + N(kd) + ')">' + d.svg + '</g>';
          }
          var pk = sq ? 0.9 : 1.08, off = sq ? 46 : 50;
          return behind + '<g transform="translate(' + N(CW) + ',0) scale(-1,1)">' + dragonPawUp(CW / 2 + off, PT + 26, pk, l0, 16, CH + TOT + 40) + '</g>' +
            dragonPawUp(CW / 2 + off, PT + 26, pk, l1, 16, CH + TOT + 40, tucked);
        });
      } else {
        var c = countsChar(o, gi, null, { pose: 'sit', mood: 'happy', facing: 'right' }, litAll), kc = 0.6, sp;
        g += '<g transform="translate(' + N(CW / 2 - (c.head ? c.head.x : 100) * kc) + ',2) scale(' + kc + ')">' + c.svg + '</g>';
        if (e && (e.who === 'riffle' || e.who === 'otter' || e.who === 'dog')) sp = { pal: beastSpec(e.who, e).pal };
        else if (e && e.who) sp = resolve(whoSpec(o, e));
        else sp = countsCat(gi);
        // the left paw is the right one mirrored: the dewclaws meet in the middle, like thumbs
        g += '<g transform="translate(' + N(CW / 2 - 58) + ',' + (PT + 72) + ') scale(-0.86,0.86)">' + furPaw(l0, sp) + '</g>' + cell(tucked ? furPaw(l1, sp, true) : furPaw(l1, sp), CW / 2 + 58, PT + 72, 0.86);
      }
      if (gi === nextG) body += nextGlowSoft(x0 + 6, y0 + PT - 8, CW - 12, CH - PT + 8 + TOT * 0.5, '.55');
      body += cell(g, x0, y0, 1);
      if (TOT && litAll) body += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * per, false);
    }
    var label = groups + (groups === 1 ? ' cat' : ' cats') + ' sitting up, both forepaws out: 10 front claws each', cid = 'pctp' + (++serial).toString(36);
    if (nine) label = groups + (groups === 1 ? ' cat' : ' cats') + ' sitting up, both forepaws out: ' + (!tuckN ? 'ten claws out on each' : tuckN < groups ? 'ten claws out, and ' + tuckN + (tuckN === 1 ? ' cat has' : ' cats have') + ' tucked one in' : 'nine claws out and one tucked in on each');
    return svgDoc(W, H, label, '<defs><clipPath id="' + cid + '"><rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22"/></clipPath></defs>' +
      '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc"/><g clip-path="url(#' + cid + ')">' + body + '</g>' +
      '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="none" stroke="#c4d6b6" stroke-width="3"/>');
  }

  // the moss of her nest in the dark, as chapter 3's bedtime picture has it
  function mossNight(W, H) {
    var s = '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="26" fill="#1d332f" stroke="#2c4a42" stroke-width="3"/>', lumps = [];
    for (var i = 0; i < 14; i++) lumps.push('<path d="' + blob(30 + rand(i * 3 + 1) * (W - 60), 40 + rand(i * 3 + 2) * (H - 80), 26 + rand(i * 3 + 3) * 22, i + 2) + '" fill="' + (i % 2 ? '#2b4a41' : '#24403a') + '"/>');
    return s + lumps.join('') + '<g fill="#3b6253" opacity=".7">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (j) { return '<circle cx="' + N(24 + rand(j * 11 + 5) * (W - 48)) + '" cy="' + N(24 + rand(j * 11 + 6) * (H - 48)) + '" r="' + N(3 + rand(j) * 3) + '"/>'; }).join('') + '</g>';
  }
  // Chapter 4's bedtime tap (`paws: 'own'` at table 10, or `paws: 'both'`): her own two forepaws on
  // the moss in the dark, patted down together. Before a tap both glow softly, as one; each tap
  // lights all ten claws and leaves the little marks of a pat beside them (they change sides with
  // every tap, so the picture moves each time); the totals, when asked for, in a row beneath. Both
  // paws are one group after the glow, so they wiggle together.
  function bothPawsPicture(o, groups, per) {
    var sp = resolve(specFromLook(o.look)), half = Math.ceil(per / 2), hl = clamp(intOr(o.highlight, 0), 0, groups * per);
    var taps = Math.ceil(hl / per), litN = taps ? hl - (taps - 1) * per : 0;
    var next = !!o.next && taps < groups, TOT = o.totals ? 64 : 0;
    var PW = 210, gap = 24, pad = 30, PH = 250, W = pad * 2 + PW * 2 + gap, H = pad * 2 + PH + TOT, body = '', g = '';
    var py = pad + PH - 96 + (taps ? 5 : 0);
    // chapter 5, the bedtime nines (per 9): the tenth claw (her right paw's outer toe) stays tucked, nine light at a tap
    if (per === 9) for (var k9 = 0; k9 < 2; k9++) g += cell(k9 ? ownPaw(sp, clamp(litN - 5, 0, 4), 1, true) : ownPaw(sp, Math.min(5, litN), -1), pad + k9 * (PW + gap) + PW / 2, py, 1);
    else
    for (var k = 0; k < 2; k++) g += cell(ownPaw(sp, k ? clamp(litN - half, 0, half) : Math.min(half, litN), k ? 1 : -1), pad + k * (PW + gap) + PW / 2, py, 1);
    if (taps) {
      // the pat: short soft marks in the moss beside the toes
      var odd = taps % 2, pat = '';
      [pad + PW / 2, pad + PW + gap + PW / 2].forEach(function (cx, i) {
        var sd = (i ? 1 : -1) * (odd ? 1 : -1), ty = py - 62;
        pat += 'M' + N(cx + sd * 66) + ',' + N(ty) + 'q' + N(sd * 9) + ',-7 ' + N(sd * 6) + ',-18M' + N(cx + sd * 76) + ',' + N(ty + 20) + 'q' + N(sd * 10) + ',-2 ' + N(sd * 15) + ',-11' +
          'M' + N(cx - sd * 62) + ',' + N(ty + 8) + 'q' + N(-sd * 7) + ',-5 ' + N(-sd * 5) + ',-13';
      });
      g += '<path class="pc-pat" d="' + pat + '" stroke="#9fc4ae" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".75"/>';
    }
    if (next) body += nextGlowSoft(pad + 8, pad - 6, W - pad * 2 - 16, PH + 4, '.32');
    body += '<g class="pc-paws">' + g + '</g>';
    if (TOT) for (var t = 0; t < taps && t < groups; t++) {
      if ((t + 1) * per > hl) break;
      body += totalNum(pad + (W - pad * 2) * (t + 0.5) / groups, H - pad - 12, (t + 1) * per, true);
    }
    var label = 'Your own two forepaws on the moss, patted down together: ' + (per === 9 ? 'nine claws out and one tucked in' : per + ' claws') + ', ' + groups + ' taps';
    return svgDoc(W, H, label, mossNight(W, H) + body);
  }

  // Riffle's forepaw from above, toes away from him (up): sleek brown, five short toes with the skin
  // stretched between them (webbed), little pale claws. Its palm at 0,0; `litN` claws lit, left to right.
  var OTTER_PAW = { base: '#8c5a36', line: '#3b2415', light: '#bd875a', web: '#b98a62', claw: '#f6e9cf' };
  function otterPawTop(litN) {
    var Q = OTTER_PAW, toes = [-58, -29, 0, 29, 58], s = '', web = '', digits = '', claws = '', glows = '';
    function at(a, r) { var t = (a - 90) * Math.PI / 180; return [Math.cos(t) * r, Math.sin(t) * r]; }
    web = 'M' + pt(at(-58, 22));
    toes.forEach(function (a, i) {
      web += 'L' + pt(at(a, 47));
      if (i < 4) web += 'Q' + pt(at(a + 14.5, 36)) + ' ' + pt(at(toes[i + 1], 47));
    });
    web += 'L' + pt(at(58, 22)) + 'Z';
    toes.forEach(function (a, i) {
      var c = at(a, 38), tip = at(a, 50), end = at(a, 63), on = i < litN, nn = at(a + 90, 3.4);
      digits += '<ellipse cx="' + N(c[0]) + '" cy="' + N(c[1]) + '" rx="8.6" ry="12.6" transform="rotate(' + a + ' ' + N(c[0]) + ' ' + N(c[1]) + ')"/>';
      if (on) glows += '<circle cx="' + N((tip[0] + end[0]) / 2) + '" cy="' + N((tip[1] + end[1]) / 2) + '" r="11" fill="' + GLOW + '" opacity=".6"/>';
      claws += '<path d="M' + pt(add(tip, nn)) + 'L' + pt(end) + 'L' + pt(add(tip, nn, -1)) + 'Z" fill="' + (on ? GLOW2 : Q.claw) + '" stroke="' + (on ? '#d18b12' : Q.line) + '" stroke-width="1.5" stroke-linejoin="round"/>';
    });
    s += '<path d="M-24.4,270L-21,26Q-22,8 -19,-6H19Q22,8 21,26L24.4,270Z" fill="' + Q.base + '" stroke="' + Q.line + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M-11,258L-10,30" stroke="' + Q.light + '" stroke-width="7" stroke-linecap="round" opacity=".45"/>' +
      '<path d="' + web + '" fill="' + Q.web + '" stroke="' + Q.line + '" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<g fill="' + Q.base + '" stroke="' + Q.line + '" stroke-width="2.6">' + digits + '</g>' +
      '<ellipse cx="0" cy="2" rx="29" ry="27" fill="' + Q.base + '" stroke="' + Q.line + '" stroke-width="3"/>' +
      '<ellipse cx="0" cy="-8" rx="24" ry="17" fill="' + Q.base + '"/>' +
      '<ellipse cx="-8" cy="-6" rx="12" ry="7.4" transform="rotate(-18 -8 -6)" fill="' + Q.light + '" opacity=".5"/>' + glows + '<g class="pc-oclaws">' + claws + '</g>';
    return s;
  }

  // The promise under the Old Bridge (`paws: 'promise'`; chapter 4's skip, three taps): six forepaws
  // in a pile, seen from above as she sees them, fanned so all thirty claws show. Sprinkle's two, big
  // and grey, held out first and lowest, wide apart; her own two on top of them, her arms coming up
  // from the bottom of the picture (her fur from `look`); Riffle's two, webbed and brown, slapped on
  // top from beside her. Each friend's toes lie clear of the paws above them, in three tiers: ten
  // claws, ten claws, ten claws. Lit one friend's pair at a time, in pile order (10, 20, 30); the
  // next pair glows softly, its group straight after the glow, so that pair wiggles. `totals` letters
  // the three numbers in a row beneath, as the bedtime picture does.
  function promisePicture(o, groups, per) {
    var hl = clamp(intOr(o.highlight, 0), 0, 30), done = Math.floor(hl / 10), part = hl - done * 10;
    var next = !!o.next && done < 3 ? done : -1, TOT = o.totals ? 64 : 0;
    // the pile is laid out round x = 480; the picture is a close window on it (VX, VY its corner)
    var VX = 196, VY = 150, W = 568, HA = 366, H = HA + TOT, id = 'pcpr' + (++serial).toString(36), sp = resolve(specFromLook(o.look)), body = '';
    function litOf(i) { return i < done ? 10 : i === done ? part : 0; }
    // the dry floor at the back of the dark, in a warm pool of light
    var bg = '<defs><radialGradient id="' + id + '-g" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#ead3aa"/><stop offset=".55" stop-color="#bfa27e"/><stop offset="1" stop-color="#5a5060"/></radialGradient>' +
      '<clipPath id="' + id + '-c"><rect x="4" y="4" width="' + (W - 8) + '" height="' + (HA - 8) + '" rx="24"/></clipPath></defs>' +
      (TOT ? '<rect x="4" y="' + (HA - 40) + '" width="' + (W - 8) + '" height="' + (TOT + 36) + '" rx="24" fill="#352d3f"/>' : '') +
      '<rect x="4" y="4" width="' + (W - 8) + '" height="' + (HA - 8) + '" rx="24" fill="url(#' + id + '-g)"/>';
    var dust = '';
    for (var i = 0; i < 30; i++) dust += '<ellipse cx="' + N(20 + rand(i * 5 + 1) * (W - 40)) + '" cy="' + N(20 + rand(i * 5 + 2) * (HA - 40)) + '" rx="' + N(2 + rand(i * 5 + 3) * 4) + '" ry="' + N(1.2 + rand(i * 5 + 4) * 2.2) + '"/>';
    bg += '<g fill="#6b5a4f" opacity=".28">' + dust + '</g>';
    // Sprinkle's: under everyone's, her palms beneath her friend's toes, her long digits and claws
    // fanned out beyond them; her forearms come up from below, either side of the cat's
    var SK = 1.42, sPair = '';
    [-1, 1].forEach(function (sd, k) {
      var wx = 480 + sd * 78, wy = 300, rot = -90 - sd * 8, r = rot * Math.PI / 180;
      // (every arm runs only a little past the window's edge: the UI wiggles a pair about the foot of its own box)
      var back = [wx - Math.cos(r) * 262, wy - Math.sin(r) * 262];
      sPair += '<path d="' + hull2([back[0], back[1], 29], [wx + Math.cos(r) * 6, wy + Math.sin(r) * 6, 24], 10).d + '" fill="' + DZ.base + '" stroke="' + DZ.line + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M' + pt([wx - Math.cos(r) * 44 - sd * 22 - 9, wy - Math.sin(r) * 44]) + 'q4.6,5 9,0q4.6,5 9,0M' + pt([wx - Math.cos(r) * 92 - sd * 20 - 10, wy - Math.sin(r) * 92]) + 'q5,5.6 10,0q5,5.6 10,0" stroke="' + DZ.shade + '" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>' +
        dzPaw(wx, wy, rot, SK, { lit: k ? clamp(litOf(0) - 5, 0, 5) : Math.min(5, litOf(0)), fan: [-38, -19, 0, 19, 38] }).svg;
    });
    // her own: straight up the middle, her arms running off the bottom of the picture
    var PK = 0.8, pPair = '';
    [-1, 1].forEach(function (sd, k) {
      // (the arm is drawn over the paw's own wrist, so no line crosses it: a white paw reads as a sock)
      var cx = 480 + sd * 50, cy = 350, arm = '<rect x="-43.6" y="84" width="87.2" height="170" fill="' + sp.pal.base + '"/>';
      if (sp.pattern === 'tabby') arm += '<path d="M-44,112Q0,100 44,112M-44,146Q0,134 44,146M-44,180Q0,168 44,180M-44,214Q0,202 44,214" stroke="' + sp.pal.stripe + '" stroke-width="8" fill="none"/>';
      else if (sp.pattern === 'tortie' || sp.pattern === 'calico') arm += '<path d="' + blob(sd * 8, 138, 24, 4 + k) + '" fill="' + sp.pal.patches[0] + '"/><path d="' + blob(-sd * 10, 204, 22, 7 + k) + '" fill="' + sp.pal.patches[sp.pattern === 'calico' ? 1 : 0] + '"/>';
      arm += '<path d="M-43.6,84V254M43.6,84V254" stroke="' + sp.pal.line + '" stroke-width="3" fill="none"/>';
      pPair += '<g transform="translate(' + cx + ',' + cy + ') scale(' + PK + ')">' + ownPaw(sp, k ? clamp(litOf(1) - 5, 0, 5) : Math.min(5, litOf(1)), sd) + arm + '</g>';
    });
    // Riffle's: slapped on top from beside her, on her wrists (the far paw a little up and round from
    // the near one, which is drawn after it: at [562, 424, -60] its fifth claw lay under the near arm,
    // and the picture showed 29 claws)
    var rPair = '';
    [[572, 410, -50], [480, 452, -68]].forEach(function (q, k) {
      rPair += '<g transform="translate(' + q[0] + ',' + q[1] + ') rotate(' + q[2] + ')">' + otterPawTop(k ? Math.min(5, litOf(2)) : clamp(litOf(2) - 5, 0, 5)) + '</g>';
    });
    var pairs = [[sPair, [298, 186, 364, 128]], [pPair, [380, 258, 200, 148]], [rPair, [408, 362, 204, 132]]];
    pairs.forEach(function (pr, i) {
      if (i === next) body += nextGlowSoft(pr[1][0], pr[1][1], pr[1][2], pr[1][3], i ? '.42' : '.5');
      body += '<g class="pc-pair">' + pr[0] + '</g>';
    });
    var tot = '';
    if (TOT) for (var t = 0; t < done; t++) tot += totalNum(W * (t + 0.5) / 3, H - 18, (t + 1) * 10, true);
    var label = 'Six forepaws in a pile: Sprinkle’s two, your two and Riffle’s two, ten claws to each friend';
    return svgDoc(W, H, label, bg + '<g clip-path="url(#' + id + '-c)"><g transform="translate(' + (-VX) + ',' + (-VY) + ')">' + body + '</g></g>' +
      '<rect x="4" y="4" width="' + (W - 8) + '" height="' + (HA - 8) + '" rx="24" fill="none" stroke="#3a3144" stroke-width="3"/>' + tot);
  }

  // The 5s with `who`: each place a forepaw held up in that character's fur, big, with the
  // character small behind it (the rim's five raised paws, the fifth visibly the old tom's).
  // Sprinkle's paws are bigger and grey, with her long pale claws; places in a row that are the same
  // character (Sprinkle's two forepaws) share one of her behind them.
  function whoPawsPicture(o, groups) {
    var per = 5, hl = clamp(intOr(o.highlight, 0), 0, per * groups);
    var TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / per) : -1;
    var CW = 176, CH = 232, PT = 92, pad = 18, cols = Math.max(1, Math.min(5, groups)), rows = Math.max(1, Math.ceil(groups / 5));
    var W = pad * 2 + cols * CW, H = pad * 2 + rows * (CH + TOT), body = '';
    var who = o.who || [];
    function same(a, b) { return a && b && a.who && a.who === b.who && a.who !== 'clancat' && a.who !== 'player' && (a.variant || 1) === (b.variant || 1); }
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / 5), col = gi % 5, inRow = Math.min(5, groups - row * 5);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT), g = '';
      var e = who[gi], litN = clamp(hl - gi * per, 0, per), litAll = litN >= per;
      // a run of the same character: drawn once, behind the run, in its first place
      var first = !(gi % 5) || !same(who[gi - 1], e), run = 1;
      while (gi + run < groups && (gi + run) % 5 && same(who[gi + run], e)) run++;
      if (e && e.who && first) {
        if (e.who === 'sprinkle') {
          // Sprinkle, small behind her own forepaws: her face over the middle of the run
          var d = buildSprinkle({ pose: e.pose || 'sit', mood: litAll && e.litMood ? e.litMood : e.mood || 'happy', facing: e.facing, noArms: true });
          var b = d.bounds, k = Math.min((CW * run - 16) / (b.x1 - b.x0), 150 / (b.y1 - b.y0)), hx = d.head.x;
          g += '<g transform="translate(' + N(CW * run / 2 - hx * k) + ',' + N(4 - b.y0 * k) + ') scale(' + N(k) + ')">' + d.svg + '</g>';
        } else if (e.who === 'squall') {
          // chapter 4: Squall, small behind his own raised forepaw
          g += squallBehind(e, litAll, CW * run, 4);
        } else if (e.who === 'puddle' || e.who === 'wisp' || e.who === 'sleet') {
          // chapter 5: Puddle (sitting) or Wisp, small behind a forepaw of their own (chapter 6: Sleet)
          g += dragonetBehind(e, litAll, CW * run, 4);
        } else {
          var c = countsChar(o, gi, null, { pose: 'sit', mood: 'happy', facing: 'right' }, litAll), kc = 0.6;
          // chapter 4: a named cat with a run of her own forepaws (Tallyheart's two, for 2 × 5) sits
          // behind the middle of them
          if (run > 1) g += '<g transform="translate(' + N(CW * run / 2 - (c.head ? c.head.x : 100) * kc) + ',4) scale(' + kc + ')">' + c.svg + '</g>';
          else g += '<g transform="translate(' + N(CW / 2 - 100 * kc - 10) + ',4) scale(' + kc + ')">' + c.svg + '</g>';
        }
      }
      if (e && e.who === 'squall') {
        // his own forepaw: a cat's size, slate, five pale claws
        g += withScales(SQ, function () { return dragonPawUp(CW / 2, PT + 10, 1.12, litN, 0, CH + TOT + 40); });
      } else if (e && e.who === 'sleet') {
        // chapter 6: Sleet's, silver, five claws frost-white when counted
        g += withScales(SL, function () { return dragonPawUp(CW / 2, PT + 16, 1.16, litN, 0, CH + TOT + 40); });
      } else if (e && (e.who === 'puddle' || e.who === 'wisp')) {
        // Puddle's, blue-grey and a size and a half too big; Wisp's, pearl-pale
        var pdl = e.who === 'puddle';
        g += withScales(pdl ? PD : WS, function () { return (pdl ? '' : '<g opacity="' + (WS_THIN + 0.24) + '">') + dragonPawUp(CW / 2, PT + (pdl ? 30 : 16), pdl ? 1.5 : 1.16, pdl ? litN : 0, 0, CH + TOT + 40) + (pdl ? '' : '</g>' + (litN ? dzPaw(CW / 2, PT + 16 + 58 * 1.16, -90, 1.16, { pads: true, lit: litN, only: 'lit' }).svg : '')); });
      } else if (e && e.who === 'sprinkle') {
        // her forearm reaches up from below, the paw held high, claws spread
        var side = run > 1 || (gi % 5 && same(who[gi - 1], e)) ? (first ? -1 : 1) : 0, fa = [CW / 2 + side * 34, CH + TOT + 40, 25], fb = [CW / 2, PT + 74, 19], fg = hull2(fa, fb, 8);
        g += R0part(fg.d) + '<path d="M' + N(CW / 2 - 12 + side * 14) + ',' + N(PT + 116) + 'q6,6 12,0q6,6 12,0" stroke="' + DZ.shade + '" stroke-width="2.4" fill="none"/>';
        g += dzPaw(CW / 2, PT + 76, -90, 1.32, { pads: true, lit: litN }).svg;
      } else {
        var sp;
        if (e && (e.who === 'riffle' || e.who === 'otter' || e.who === 'dog')) sp = { pal: beastSpec(e.who, e).pal };
        else if (e && e.who) sp = resolve(whoSpec(o, e));
        // one cat's own two forepaws (a run of two of the same named cat): the left one mirrored, so
        // the dewclaws meet in the middle like thumbs, as a group of the 10s is drawn
        var pairL = sp && e && e.who && e.who !== 'clancat' && e.who !== 'player' && first && (gi % 5) < 4 && gi + 1 < groups && same(who[gi + 1], e) && !(gi + 2 < groups && (gi + 2) % 5 && same(who[gi + 2], e));
        if (pairL) g += '<g transform="translate(' + N(CW / 2 - 8) + ',' + (PT + 72) + ') scale(-0.94,0.94)">' + furPaw(litN, sp) + '</g>';
        else g += sp ? cell(furPaw(litN, sp), CW / 2 + 8, PT + 72, 0.94) : cell(forepaw(litN), CW / 2 + 8, PT + 72, 0.94);
      }
      if (gi === nextG) body += nextGlowSoft(x0 + 8, y0 + PT - 14, CW - 16, CH - PT + 14 + TOT * 0.5, '.55');
      body += cell(g, x0, y0, 1);
      if (TOT && litAll) body += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * per, !!o.thought);
    }
    var label = groups + ' forepaws held up, 5 claws each', cid = 'pcwp' + (++serial).toString(36);
    return svgDoc(W, H, label, '<defs><clipPath id="' + cid + '"><rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22"/></clipPath></defs>' +
      '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc"/><g clip-path="url(#' + cid + ')">' + body + '</g>' +
      '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="none" stroke="#c4d6b6" stroke-width="3"/>');
  }

  // Little forepaws drawn in the mud with one claw (Sprinkle's six brothers and sisters): a palm and
  // `per` claw marks each, lit in order. Two rows when there are more than five.
  var MUD = { patch: '#6f5a47', edge: '#4c3b2c', dots: '#5a4738', box: '#5d4a3b', groove: '#2a1f17', shine: '#9b8270', wet: '#7c6754', word: 'mud' };
  function mudPicture(o, groups, per) {
    // chapter 4: `kind: 'grit'` (or `ground: 'grit'`) scratches them in the roof's pale grit instead
    var G = o.kind === 'grit' || o.ground === 'grit' ? GRIT : MUD;
    var hl = clamp(intOr(o.highlight, 0), 0, groups * per), TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / per) : -1;
    // chapter 5, `paws: 'mud'` (Mama's count coming back): seven little forepaws are drawn (`of`),
    // and the count lights the first `groups` of them, one for Sprinkle and one for each dragonet
    // found; the rest stay dark, and nothing ever glows on them
    var count = groups;
    if (o.paws === 'mud') { groups = clamp(intOr(o.of, 7), Math.max(1, count), 10); if (nextG >= count) nextG = -1; }
    var perRow = groups <= 5 ? Math.max(1, groups) : Math.ceil(groups / 2), rows = Math.max(1, Math.ceil(groups / perRow));
    var CW = 156, CH = 160, pad = 26, W = pad * 2 + perRow * CW, H = pad * 2 + rows * (CH + TOT), body = '';
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / perRow), col = gi % perRow, inRow = Math.min(perRow, groups - row * perRow);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT), g = '', cx = CW / 2, cy = CH * 0.7;
      var wob = function (i) { return (rand(gi * 13 + i) - 0.5) * 3; };
      // the palm, drawn as a groove
      var palm = 'M' + N(cx - 26) + ',' + N(cy + 4 + wob(1)) + 'Q' + N(cx - 30) + ',' + N(cy - 22) + ' ' + N(cx) + ',' + N(cy - 24 + wob(2)) + 'Q' + N(cx + 30) + ',' + N(cy - 22) + ' ' + N(cx + 26) + ',' + N(cy + 4 + wob(3)) +
        'Q' + N(cx + 20) + ',' + N(cy + 26) + ' ' + N(cx) + ',' + N(cy + 26 + wob(4)) + 'Q' + N(cx - 20) + ',' + N(cy + 26) + ' ' + N(cx - 26) + ',' + N(cy + 4 + wob(1)) + 'Z';
      g += '<path d="' + palm + '" stroke="' + G.groove + '" stroke-width="4.6" fill="none" stroke-linejoin="round"/><path d="' + palm + '" transform="translate(1.6,1.4)" stroke="' + G.shine + '" stroke-width="1.4" fill="none" opacity=".8"/>';
      for (var j = 0; j < per; j++) {
        var a = (-146 + (per > 1 ? 112 * j / (per - 1) : 56)) * Math.PI / 180, r0 = 47, r1 = 64;
        // a toe: a little loop drawn in the mud
        var tc = [cx + Math.cos(a) * 36, cy - 2 + Math.sin(a) * 36];
        g += '<ellipse cx="' + N(tc[0]) + '" cy="' + N(tc[1]) + '" rx="7.4" ry="9.6" transform="rotate(' + N(a * 180 / Math.PI + 90) + ' ' + N(tc[0]) + ' ' + N(tc[1]) + ')" stroke="' + G.groove + '" stroke-width="3.6" fill="none"/>';
        var p0 = [cx + Math.cos(a) * r0, cy - 2 + Math.sin(a) * r0], p1 = [cx + Math.cos(a) * r1 + wob(j + 5), cy - 2 + Math.sin(a) * r1];
        var lit = gi * per + j < hl, d1 = 'M' + pt(p0) + 'L' + pt(p1);
        if (lit) g += '<path d="' + d1 + '" stroke="#ffd25e" stroke-width="13" stroke-linecap="round" opacity=".55"/>';
        g += '<path class="pc-mudclaw" d="' + d1 + '" stroke="' + (lit ? '#e39a12' : G.groove) + '" stroke-width="4.6" stroke-linecap="round"/>' +
          '<path d="' + d1 + '" transform="translate(1.6,1.2)" stroke="' + (lit ? '#fff4c2' : G.shine) + '" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>';
      }
      if (gi === nextG) body += nextGlowSoft(x0 + 6, y0 + 2, CW - 12, CH - 4 + TOT * 0.5, '.45');
      body += cell(g, x0, y0, 1);
      if (TOT && hl >= (gi + 1) * per) body += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * per, !G.pale);
    }
    // the mud: a soft wobbly patch, wet patches and grit
    var edge = [], n = 28;
    for (var i = 0; i < n; i++) {
      var aa = Math.PI * 2 * i / n, kk = 0.97 + 0.03 * rand(i * 5 + 2), c = Math.cos(aa), sn = Math.sin(aa);
      edge.push([W / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.42) * (W / 2 - 5) * kk, H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * kk]);
    }
    var grit = '';
    for (var dd = 0; dd < Math.round(W * H / 1100); dd++) grit += '<circle cx="' + N(W / 2 + (rand(dd * 7 + 3) - 0.5) * (W - 60)) + '" cy="' + N(H / 2 + (rand(dd * 7 + 4) - 0.5) * (H - 40)) + '" r="' + N(0.8 + rand(dd) * 1.4) + '"/>';
    var wet = '<ellipse cx="' + N(W * 0.22) + '" cy="' + N(H * 0.8) + '" rx="' + N(W * 0.12) + '" ry="10" fill="' + G.wet + '" opacity=".6"/><ellipse cx="' + N(W * 0.78) + '" cy="' + N(H * 0.16) + '" rx="' + N(W * 0.1) + '" ry="8" fill="' + G.wet + '" opacity=".5"/>';
    var label = groups + ' little forepaws ' + (G.pale ? 'scratched in the grit' : 'drawn in the mud') + ', ' + per + ' claw marks each';
    if (o.paws === 'mud') label += ': ' + count + ' of them to count';
    return svgDoc(W, H, label, '<path d="' + crClosed(edge) + '" fill="' + G.patch + '" stroke="' + G.edge + '" stroke-width="3"/>' + wet + '<g fill="' + G.dots + '" opacity=".7">' + grit + '</g>' + body);
  }

  // Her own two forepaws on the moss, in the dark (the bedtime tap): seen from above, her fur and
  // markings from `look`, claws out. The glow takes turns, left, right, left, right: the paw just
  // tapped has its claws lit, the next one glows softly; the running totals in a row beneath.
  function ownPawPath() { return 'M-44,92C-50,30 -52,-30 -42,-46C-46,-60 -32,-70 -24,-64C-22,-78 -4,-80 -2,-70C2,-80 22,-78 24,-64C32,-70 46,-60 42,-46C52,-30 50,30 44,92Z'; }
  // (chapter 5: `tuck` curls in the last claw of the count, never lit: seen from her own eyes her
  // claws are counted left to right, so the tenth is the outer toe of her right paw, as the open
  // river's `log` camera has it ("The tenth claw stays tucked."); `dig` marks the wood at the tip of
  // every lit claw: a claw dug into the raft's log)
  function ownPaw(sp, litN, side, tuck, dig) {
    var p = sp.pal, white = sp.marks && sp.marks.paws, fur = white ? markFill(sp) : p.base, line = p.line, s = '', inner = '';
    var cid = 'pcop' + (++serial).toString(36), PAW = ownPawPath();
    if (!white) {
      if (sp.pattern === 'tabby') inner += '<path d="M-50,30Q0,18 50,30M-50,54Q0,42 50,54M-50,78Q0,66 50,78" stroke="' + p.stripe + '" stroke-width="8" fill="none"/>';
      else if (sp.pattern === 'tortie') inner += '<path d="' + blob(side * 18, 20, 30, 4) + '" fill="' + p.patches[0] + '"/><path d="' + blob(-side * 20, -36, 16, 6) + '" fill="' + p.patches[1] + '"/>';
      else if (sp.pattern === 'calico') inner += '<path d="' + blob(-side * 16, 26, 30, 5) + '" fill="' + p.patches[0] + '"/><path d="' + blob(side * 22, -30, 16, 7) + '" fill="' + p.patches[1] + '"/>';
    }
    inner += '<ellipse cx="-12" cy="-44" rx="16" ry="7" transform="rotate(-14 -12 -44)" fill="' + (white ? '#ffffff' : p.light) + '" opacity=".5"/>';
    s += '<defs><clipPath id="' + cid + '"><path d="' + PAW + '"/></clipPath></defs><path d="' + PAW + '" fill="' + fur + '"/><g clip-path="url(#' + cid + ')">' + inner + '</g>' +
      '<path d="' + PAW + '" fill="none" stroke="' + line + '" stroke-width="3"' + (white && sp.marks.edge ? ' stroke-opacity=".9"' : '') + '/>';
    // the toes: three creases at the front
    s += '<path d="M-24,-56Q-22,-48 -22,-40M-2,-62Q-1,-52 -1,-44M22,-56Q20,-48 20,-40" stroke="' + mix(fur, line, 0.6) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    // five claws: four over the toes, then the dewclaw on the inner side
    var claws = [[-34, -62, -30], [-13, -76, -9], [11, -76, 9], [33, -62, 30], [-side * 48, -8, -side * 74]];
    if (side > 0) claws = [claws[4], claws[0], claws[1], claws[2], claws[3]];   // counted left to right
    var tuckAt = side > 0 ? 4 : 0;
    claws.forEach(function (c, i) {
      if (tuck && i === tuckAt) { s += tuckedClaw(c[0], c[1], c[2], 1.1); return; }
      var on = (tuck && side < 0 ? i - 1 : i) < litN;
      if (on) s += '<circle cx="' + c[0] + '" cy="' + (c[1] - 8) + '" r="14" fill="' + GLOW + '" opacity=".6"/>';
      s += '<path transform="translate(' + c[0] + ',' + c[1] + ') rotate(' + c[2] + ')" d="M-4.4,0Q-3.4,-15 2,-24Q3.4,-13 4.4,0Z" fill="' + (on ? GLOW2 : '#fbf6ea') + '" stroke="' + (on ? '#d18b12' : '#9a8a72') + '" stroke-width="1.6" stroke-linejoin="round"/>';
      if (on && dig) s += '<path class="pc-dig" transform="translate(' + c[0] + ',' + c[1] + ') rotate(' + c[2] + ')" d="M-7,-25l5,-5M2,-26l0,-7M9,-24l5,-5" stroke="#5a3b20" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>';
    });
    return s;
  }
  function ownPawsPicture(o, groups, per) {
    var sp = resolve(specFromLook(o.look)), hl = clamp(intOr(o.highlight, 0), 0, groups * per);
    var taps = Math.ceil(hl / per), litPaw = taps ? (taps - 1) % 2 : -1, litN = taps ? hl - (taps - 1) * per : 0;
    var nextP = o.next && taps < groups ? taps % 2 : -1, TOT = o.totals ? 64 : 0;
    var PW = 210, gap = 24, pad = 30, PH = 250, W = pad * 2 + PW * 2 + gap, H = pad * 2 + PH + TOT, body = '';
    // the moss in the dark
    var moss = '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="26" fill="#1d332f" stroke="#2c4a42" stroke-width="3"/>';
    var lumps = [];
    for (var i = 0; i < 14; i++) lumps.push('<path d="' + blob(30 + rand(i * 3 + 1) * (W - 60), 40 + rand(i * 3 + 2) * (H - 80), 26 + rand(i * 3 + 3) * 22, i + 2) + '" fill="' + (i % 2 ? '#2b4a41' : '#24403a') + '"/>');
    moss += lumps.join('') + '<g fill="#3b6253" opacity=".7">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (j) { return '<circle cx="' + N(24 + rand(j * 11 + 5) * (W - 48)) + '" cy="' + N(24 + rand(j * 11 + 6) * (H - 48)) + '" r="' + N(3 + rand(j) * 3) + '"/>'; }).join('') + '</g>';
    for (var k = 0; k < 2; k++) {
      var x0 = pad + k * (PW + gap), g = '';
      g += ownPaw(sp, k === litPaw ? litN : 0, k ? 1 : -1);
      if (k === nextP) body += nextGlowSoft(x0 + 10, pad - 6, PW - 20, PH + 4, '.32');
      body += cell(g, x0 + PW / 2, pad + PH - 96, 1);
    }
    if (TOT) for (var t = 0; t < taps && t < groups; t++) {
      if ((t + 1) * per > hl) break;
      body += totalNum(pad + (W - pad * 2) * (t + 0.5) / groups, H - pad - 12, (t + 1) * per, true);
    }
    var label = 'Your own two forepaws on the moss, ' + per + ' claws each, ' + groups + ' taps';
    return svgDoc(W, H, label, moss + body);
  }

  // ------------------------------------------------------------------ chapter 5's counts pictures

  // A dragonet small behind a forepaw of its own, in a `who` picture: Puddle sitting, Wisp standing.
  function dragonetBehind(e, lit, wide, top) {
    var d = e.who === 'puddle' ? buildPuddle({ pose: 'sit', mood: lit && e.litMood ? e.litMood : e.mood || 'happy', facing: e.facing, noArms: true })
      : e.who === 'sleet' ? buildSleet({ pose: 'sit', mood: lit && e.litMood ? e.litMood : e.mood || 'proud', facing: e.facing, noArms: true })
      : buildWisp({ pose: 'blink', mood: lit && e.litMood ? e.litMood : e.mood || 'happy', facing: e.facing });
    var b = d.bounds, k = Math.min((wide - 12) / (b.x1 - b.x0), 130 / (b.y1 - b.y0), 0.8);
    return '<g transform="translate(' + N(wide / 2 - d.head.x * k) + ',' + N(top - b.y0 * k) + ') scale(' + N(k) + ')">' + d.svg + '</g>';
  }
  // The open river's water and the marsh's reeds, as flat backdrops for a small picture. The river
  // is the open river set's own day water (app/art/sets/openriver.js, WATER.day: `top` its `far`,
  // `water` its `mid`, `deep` its `near`): bright blue, the Crossing's water a page further out.
  // Change them together (tests/set-openriver.test.js holds the two files to each other).
  var RIVER = { top: '#b4d9ec', water: '#74b2d4', deep: '#58a2be', line: '#eef8fb', rim: '#4c8fae' };
  function reedsBack(W, H, seed) {
    var s = '', n = Math.round(W / 26);
    for (var i = 0; i < n; i++) {
      var x = 10 + (W - 20) * (i + rand(seed + i) * 0.7) / n, top = 14 + rand(seed + i * 3) * H * 0.3, bend = (rand(seed + i * 7) - 0.5) * 34;
      s += '<path d="M' + N(x) + ',' + N(H) + 'Q' + N(x + bend * 0.3) + ',' + N(H * 0.5) + ' ' + N(x + bend) + ',' + N(top) + '" stroke="' + (i % 3 ? '#86a868' : '#6f9656') + '" stroke-width="' + N(5 + (i % 3) * 1.6) + '" fill="none" stroke-linecap="round"/>';
    }
    return s;
  }
  // One dragonet's one forepaw, to tap (chapter 5: "Tell Sprinkle: five!"): the whole small scene
  // the Tap needs, since neither is ever out of the water or the reeds. Puddle: his chin dipping, his
  // eyes and his grin above the water, the forepaw up beside him. Wisp: on one leg among the reeds,
  // which show through her and through the forepaw she holds up. `highlight` lights the claws
  // (Wisp's pale as frost); `next` glows softly round the paw (the group after the glow is the
  // dragonet, so the page wiggles it).
  function onePawPicture(o, e) {
    var pdl = e.who === 'puddle', hl = clamp(intOr(o.highlight, 0), 0, 5), W = 560, H = 350, id = 'pcpaw_' + (++serial).toString(36);
    var d = pdl ? buildPuddle({ pose: 'pawup', mood: hl >= 5 && e.litMood ? e.litMood : e.mood || 'happy', facing: e.facing, lit: hl })
      : buildWisp({ pose: 'pawup', mood: hl >= 5 && e.litMood ? e.litMood : e.mood || 'happy', facing: e.facing, lit: hl });
    var b = d.bounds, k = pdl ? 1.02 : 1.1, wl = pdl ? H - 96 : H - 12;
    var tx = pdl ? W / 2 - (b.x0 + b.x1) / 2 * k : W / 2 - (b.x0 + b.x1) / 2 * k, ty = wl - (d.h - 3) * k;
    var back = pdl ? '<rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" fill="' + RIVER.top + '"/><rect x="4" y="' + N(wl) + '" width="' + (W - 8) + '" height="' + N(H - wl) + '" fill="' + RIVER.water + '"/>' +
      '<path d="M40,' + N(wl + 34) + 'q26,-9 52,0M330,' + N(wl + 52) + 'q30,-10 60,0M150,' + N(wl + 70) + 'q22,-8 44,0M430,' + N(wl + 22) + 'q20,-7 40,0" stroke="' + RIVER.line + '" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>'
      : '<rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" fill="#cfe0b6"/>' + reedsBack(W, H, 5) + '<rect x="4" y="' + (H - 26) + '" width="' + (W - 8) + '" height="26" fill="#a9bf8a" opacity=".8"/>';
    var glowR = '', px = tx + d.paw.x * k, py = ty + d.paw.y * k, pr = d.paw.r * k;
    if (o.next && hl < 5) glowR = nextGlowSoft(px - pr - 14, py - pr - 18, pr * 2 + 28, pr * 2 + 32, pdl ? '.5' : '.42');
    var body = back + glowR + '<g transform="translate(' + N(tx) + ',' + N(ty) + ') scale(' + N(k) + ')">' + d.svg + '</g>';
    if (pdl) body += '<rect x="4" y="' + N(wl) + '" width="' + (W - 8) + '" height="' + N(H - wl) + '" fill="' + RIVER.water + '" opacity=".35"/>';
    var label = pdl ? 'Puddle in the water, one big forepaw held up: five claws' : 'Wisp among the reeds, one pale forepaw held up: five claws';
    return svgDoc(W, H, label, '<defs><clipPath id="' + id + '"><rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="22"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' + body + '</g><rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="22" fill="none" stroke="' + (pdl ? RIVER.rim : '#8fa873') + '" stroke-width="3"/>');
  }

  // ----- chapter 6's counts pictures
  // Sleet's one forepaw, to tap ("Tell Sprinkle: five!"), in the long grass at the last post: all of
  // him sitting up in it, the grass over his lower half, the forepaw held up above it; `highlight`
  // lights its five claws frost-white; `next` glows softly round the paw.
  function sleetPawPicture(o, e) {
    var hl = clamp(intOr(o.highlight, 0), 0, 5), W = 560, H = 350, id = 'pcpaw_' + (++serial).toString(36);
    var d = buildSleet({ pose: 'pawup', mood: hl >= 5 && e.litMood ? e.litMood : e.mood || 'proud', facing: e.facing, lit: hl });
    var b = d.bounds, k = Math.min((W - 40) / (b.x1 - b.x0), (H - 14) / (b.y1 - b.y0));
    var tx = W / 2 - (b.x0 + b.x1) / 2 * k, ty = H - 4 - (d.h - 3) * k;
    var px = tx + d.paw.x * k, py = ty + d.paw.y * k, pr = d.paw.r * k, glowR = '';
    var back = '<rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" fill="#dfe6c4"/><g transform="translate(0,' + N(H - 4) + ')" opacity=".7">' + longGrass(W / 2, W + 40, H * 0.6, 0, 13).svg + '</g>';
    if (o.next && hl < 5) glowR = nextGlowSoft(px - pr - 14, py - pr - 18, pr * 2 + 28, pr * 2 + 32, '.45');
    var body = back + glowR + '<g transform="translate(' + N(tx) + ',' + N(ty) + ') scale(' + N(k) + ')">' + d.svg + '</g>' +
      '<g transform="translate(0,' + N(H - 4) + ')">' + longGrass(W / 2, W + 20, Math.max(40, Math.min(H * 0.42, H - 4 - py - pr - 10)), 0, 29).svg + '</g>';
    return svgDoc(W, H, 'Sleet in the long grass, one silver forepaw held up: five claws', '<defs><clipPath id="' + id + '"><rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="22"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' + body + '</g><rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="22" fill="none" stroke="#9aa86a" stroke-width="3"/>');
  }
  // A little dragonet for the roll call: plain and pale, all alike (no clutch colours: nobody she
  // has not met is spoiled), sitting, its mouth a small round O (calling HERE!). In a 128 x 120 cell,
  // its feet on the bottom middle.
  var ROLL = { base: '#efece4', line: '#8a8c90', belly: '#fbfaf6', wing: '#f5f3ee', nub: '#f7f5f0', eye: '#4b5560', mouth: '#9a6b74' };
  function littleDragonet() {
    var c = ROLL, s = '', st = ' stroke="' + c.line + '" stroke-width="2.1" stroke-linejoin="round"';
    // the tail curling round in front of its feet, its ridges, a little folded wing
    s += '<path d="M42,106C24,112 10,104 12,92C14,82 26,84 26,92" stroke="' + c.line + '" stroke-width="7.6" fill="none" stroke-linecap="round"/><path d="M42,106C24,112 10,104 12,92C14,82 26,84 26,92" stroke="' + c.base + '" stroke-width="4.4" fill="none" stroke-linecap="round"/>';
    s += '<g fill="' + c.belly + '"' + st + '><circle cx="40" cy="76" r="4.2"/><circle cx="47" cy="70" r="4.2"/><circle cx="55" cy="66" r="4"/></g>';
    s += '<ellipse cx="58" cy="90" rx="23" ry="21" fill="' + c.base + '"' + st + '/><ellipse cx="65" cy="95" rx="12" ry="14" fill="' + c.belly + '"/>';
    s += '<path d="M50,68Q36,54 28,60Q34,64 30,70Q38,70 36,77Q46,76 52,80Z" fill="' + c.wing + '"' + st + '/>';
    // the neck and the head: a rounded snout forward, two round nubs, two eyes, a round O of a mouth
    s += '<path d="M60,74Q60,58 68,48L80,52Q72,62 74,76Z" fill="' + c.base + '"/><path d="M60,74Q60,58 68,48M80,52Q72,62 74,76" stroke="' + c.line + '" stroke-width="2.1" fill="none"/>';
    s += '<g fill="' + c.nub + '"' + st + '><path d="M63,28Q62,20 66,19Q70,21 69,28Z"/><path d="M76,27Q76,19 80,18Q84,21 82,28Z"/></g>';
    s += '<circle cx="72" cy="38" r="15" fill="' + c.base + '"' + st + '/><ellipse cx="83" cy="46" rx="11" ry="8" fill="' + c.belly + '"' + st + '/><ellipse cx="72" cy="40" rx="11" ry="9" fill="' + c.base + '"/>';
    s += '<g fill="' + c.eye + '"><circle cx="67" cy="35" r="3.2"/><circle cx="78" cy="34.4" r="3.2"/></g><g fill="#ffffff"><circle cx="66" cy="34" r="1.1"/><circle cx="77" cy="33.4" r="1.1"/></g>';
    s += '<g fill="' + c.line + '"><circle cx="87" cy="43" r="1"/><circle cx="91" cy="44" r="1"/></g><ellipse cx="86" cy="50" rx="3" ry="3.4" fill="' + c.mouth + '" stroke="' + c.line + '" stroke-width="1.2"/>';
    s += '<g fill="' + c.base + '"' + st + '><ellipse cx="52" cy="110" rx="9" ry="5"/><ellipse cx="72" cy="110" rx="9" ry="5"/></g>';
    return '<g class="pc-dragonet">' + s + '</g>';
  }
  // Sleet's riddle (`kind: 'roll'`): "There are seven of us… and we each shout HERE! three times."
  // `groups` little dragonets in one row, `per` (three) HERE!s lettered over every head; `highlight`
  // lights the HEREs in order, a dragonet's three bottom to top (the help lights a dragonet's three at
  // a time); `totals` and `next` as the other pictures have them.
  function rollPicture(o, groups, per) {
    var n = clamp(per, 1, 5), hl = clamp(intOr(o.highlight, 0), 0, n * groups);
    var TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / n) : -1;
    var CW = 128, DH = 120, HT = 30 * n + 8, pad = 18, CH = HT + DH;
    var W = pad * 2 + Math.max(1, groups) * CW, H = pad * 2 + CH + TOT, body = '';
    for (var gi = 0; gi < groups; gi++) {
      var x0 = pad + gi * CW, y0 = pad, g = '', litAll = hl >= (gi + 1) * n;
      if (gi === nextG) body += nextGlowSoft(x0 + 6, y0 - 4, CW - 12, CH + 8 + TOT * 0.5, '.5');
      g += '<ellipse cx="64" cy="' + N(HT + DH - 6) + '" rx="40" ry="6" fill="#3f5a2e" opacity=".14"/>';
      g += '<g transform="translate(0,' + N(HT) + ')">' + littleDragonet() + '</g>';
      for (var j = 0; j < n; j++) {
        var on = gi * n + j < hl, hx = 64 + (j % 2 ? 9 : -7), hy = HT - 8 - j * 30, rot = j % 2 ? 6 : -5;
        if (on) g += '<ellipse cx="' + N(hx) + '" cy="' + N(hy - 9) + '" rx="38" ry="15" fill="' + GLOW + '" opacity=".45"/>';
        g += '<text class="pc-here' + (on ? ' pc-lit' : '') + '" x="' + N(hx) + '" y="' + N(hy) + '" transform="rotate(' + rot + ' ' + N(hx) + ' ' + N(hy - 9) + ')" text-anchor="middle"' +
          ' font-family="Bangers, &quot;Marker Felt&quot;, Impact, sans-serif" font-size="25" letter-spacing="1"' +
          (on ? ' fill="' + GLOW2 + '" stroke="#b5700c"' : ' fill="#fffaf0" stroke="#9a8f7a"') + ' stroke-width="4" stroke-linejoin="round" paint-order="stroke">HERE!</text>';
      }
      body += cell(g, x0, y0, 1);
      if (TOT && litAll) body += totalNum(x0 + CW / 2, y0 + CH + 32, (gi + 1) * n, false);
    }
    var label = groups + (groups === 1 ? ' dragonet' : ' dragonets') + ', ' + ['', 'one HERE', 'two HEREs', 'three HEREs', 'four HEREs', 'five HEREs'][n] + ' each';
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>' +
      '<path d="M8,' + N(pad + CH - 10) + 'H' + N(W - 8) + 'V' + N(H - 22) + 'Q' + N(W - 8) + ',' + N(H - 8) + ' ' + N(W - 22) + ',' + N(H - 8) + 'H22Q8,' + N(H - 8) + ' 8,' + N(H - 22) + 'Z" fill="#cfdcae" opacity=".7"/>' + body);
  }

  // A fish for a Counts picture: the pile set's PC.art.prey fish when it is there (as the prey
  // pictures and Riffle's catch use it), else our own. Small and silver, its eye shut. Returns its
  // three layers ({ glow, body, spark }), `len` long, its middle at (cx, cy), turned `rot`.
  function fishParts(cx, cy, len, rot, lit, seed, facing) {
    var fn = typeof art.prey === 'function' ? art.prey : preyFallback, out = { glow: '', body: '', spark: '' };
    function layer(f, part) {
      var q = null;
      try { q = f({ kind: 'fish', lit: lit, seed: seed, facing: facing || 'right', part: part }); } catch (e) { q = null; }
      return q && typeof q.svg === 'string' && q.w > 0 && q.h > 0 ? q : null;
    }
    var b = layer(fn, 'body');
    if (!b || !b.svg || (b.kind && b.kind !== 'fish')) { fn = preyFallback; b = layer(fn, 'body'); }
    var k = len / b.w, at = 'translate(' + N(cx) + ',' + N(cy) + ') rotate(' + N(rot || 0) + ') translate(' + N(-b.w * k / 2) + ',' + N(-b.h * k / 2) + ') scale(' + N(k) + ')';
    function put(q) {
      var svg = q && q.svg ? q.svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '') : '';
      return svg ? '<g transform="' + at + '">' + svg + '</g>' : '';
    }
    out.body = put(b);
    if (lit) { out.glow = put(layer(fn, 'glow')); out.spark = put(layer(fn, 'spark')); }
    return out;
  }
  // A thought cloud by day (Patience's: what the otter owes her), with the little bubbles trailing
  // down to whoever is thinking it (bottom left; `side: 'right'`). The old tom's boast keeps its
  // evening sky (thoughtDoc).
  function thoughtDay(W, H, label, body, side) {
    var id = 'pcday_' + (++serial).toString(36), m = 46, cw = W + m * 2, ch = H + m * 2, trail = 84;
    var pts = [], n = Math.max(12, Math.round((cw + ch) / 62));
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * (i + 0.5) / n, c = Math.cos(a), sn = Math.sin(a);
      pts.push([cw / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.6) * (cw / 2 - 20), ch / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.6) * (ch / 2 - 20)]);
    }
    var cloud = scallop(pts, 0.6);
    var s = '<defs><linearGradient id="' + id + '-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3eff3"/></linearGradient></defs>' +
      '<path d="' + cloud + '" fill="url(#' + id + '-sky)"/><g transform="translate(' + m + ',' + m + ')">' + body + '</g>' +
      '<path d="' + cloud + '" fill="none" stroke="#7d93a6" stroke-width="12" stroke-linejoin="round"/><path d="' + cloud + '" fill="none" stroke="#ffffff" stroke-width="7" stroke-linejoin="round"/>';
    var dir = side === 'right' ? 1 : -1;
    [[0.24, 18, 18], [0.15, 50, 12], [0.09, 74, 7.5]].forEach(function (b) {
      var bx = dir < 0 ? cw * b[0] : cw * (1 - b[0]), by = ch - 6 + b[1];
      s += '<circle cx="' + N(bx) + '" cy="' + N(by) + '" r="' + b[2] + '" fill="#ffffff" stroke="#7d93a6" stroke-width="2.6"/>';
    });
    return svgDoc(cw, ch + trail, 'A thought: ' + label, s);
  }
  // Fish (`kind: 'fish'`). In pairs (the 2s: two fish for every answer): `groups` pairs, each two
  // small silver fish side by side, eyes shut; up to five pairs in a row, more than five in two
  // rows (seven as four and three), and nine in rows of three. `thought: true` is Patience's
  // thought cloud. `layout: 'strings'` is Riffle's catch: see fishStrings.
  function fishPicture(o, groups, per) {
    if (o.layout === 'strings') return fishStrings(o, groups, per);
    var hl = clamp(intOr(o.highlight, 0), 0, groups * per), TOT = o.totals ? 40 : 0, nextG = o.next ? Math.floor(hl / per) : -1;
    var perRow = groups <= 5 ? Math.max(1, groups) : groups === 9 ? 3 : Math.ceil(groups / 2), rows = Math.max(1, Math.ceil(groups / perRow));
    var FL = 88, FH = 31, CW = FL + 34, CH = per * FH + 22, pad = 20, W = pad * 2 + perRow * CW, H = pad * 2 + rows * (CH + TOT);
    var under = '', halos = '', bodies = '', sparks = '', totals = '', dark = false;
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / perRow), col = gi % perRow, inRow = Math.min(perRow, groups - row * perRow);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT);
      // a pair lies on a soft patch of its own, so two fish read as one answer's fee
      under += '<rect x="' + N(x0 + 7) + '" y="' + N(y0 + 5) + '" width="' + N(CW - 14) + '" height="' + N(CH - 10) + '" rx="18" fill="' + (o.thought ? '#d9e8ee' : '#cfe2e6') + '" opacity=".75"/>';
      if (gi === nextG) under += nextGlow(x0 + 3, y0 + 1, CW - 6, CH - 2);
      for (var j = 0; j < per; j++) {
        var f = fishParts(x0 + CW / 2 + (j % 2 ? 3 : -3), y0 + 11 + FH / 2 + j * FH, FL, 0, gi * per + j < hl, gi * 7 + j + 3);
        halos += f.glow; bodies += f.body; sparks += f.spark;
      }
      if (TOT && hl >= (gi + 1) * per) totals += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * per, dark);
    }
    var label = groups + (groups === 1 ? ' pair' : ' pairs') + ' of fish' + (per === 2 ? '' : ', ' + per + ' fish each'), body = under + halos + bodies + sparks + totals;
    if (per === 1) label = groups + ' fish';
    if (o.thought) return thoughtDay(W, H, label, body, o.thought);
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6f1f2" stroke="#b9d2d6" stroke-width="3"/>' + body);
  }
  // Riffle's catch (`kind: 'fish', layout: 'strings'`): `groups` strings laid across the raft's
  // logs, `per` fish on every string, hanging side by side by their tails from a reed that is
  // looped round each tail: nothing goes through a fish, no hook, no blood, every eye shut. Lit a
  // string at a time. One row up to three strings; four as two and two; more, three or four to a row.
  var LOGS = { wood: '#c39b68', dark: '#a37a4b', line: '#6f4d2a', seam: '#7f5a33', grain: '#b08a58', light: '#d9b683', reed: '#6f9a4a', reedLine: '#476a2c' };
  function logsBack(W, H, logH) {
    var s = '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="' + LOGS.wood + '"/>', n = Math.max(1, Math.round((H - 8) / logH)), lh = (H - 8) / n;
    for (var i = 0; i < n; i++) {
      var y = 4 + i * lh;
      if (i) s += '<path d="M4,' + N(y) + 'H' + N(W - 4) + '" stroke="' + LOGS.seam + '" stroke-width="5" opacity=".75"/><path d="M4,' + N(y + 4) + 'H' + N(W - 4) + '" stroke="' + LOGS.light + '" stroke-width="2.4" opacity=".6"/>';
      for (var j = 0; j < 4; j++) {
        var gx = 30 + rand(i * 9 + j * 3 + 1) * (W - 140), gy = y + lh * (0.24 + 0.52 * rand(i * 5 + j * 11 + 2)), gl = 44 + rand(i + j * 7) * 70;
        s += '<path d="M' + N(gx) + ',' + N(gy) + 'q' + N(gl / 2) + ',' + N((j % 2 ? -3 : 3)) + ' ' + N(gl) + ',0" stroke="' + LOGS.grain + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>';
      }
    }
    return s;
  }
  function fishStrings(o, groups, per) {
    var hl = clamp(intOr(o.highlight, 0), 0, groups * per), TOT = o.totals ? 40 : 0, nextG = o.next ? Math.floor(hl / per) : -1;
    var perRow = groups <= 3 ? Math.max(1, groups) : groups === 4 ? 2 : groups <= 6 ? 3 : groups <= 8 ? 4 : 5, rows = Math.max(1, Math.ceil(groups / perRow));
    var FL = 96, FW = 37, CW = per * FW + 44, CH = FL + 52, pad = 22, W = pad * 2 + perRow * CW, H = pad * 2 + rows * (CH + TOT);
    var under = '', halos = '', bodies = '', over = '', sparks = '', totals = '', id = 'pcfish_' + (++serial).toString(36);
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / perRow), col = gi % perRow, inRow = Math.min(perRow, groups - row * perRow);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT), ry = y0 + 20, fx0 = x0 + (CW - per * FW) / 2 + FW / 2;
      var lit = hl >= (gi + 1) * per;
      if (gi === nextG) under += nextGlowSoft(x0 + 4, y0 + 2, CW - 8, CH - 4, '.6');
      // the reed: one long green stem laid across, a loop of it round every tail
      var reed = 'M' + N(x0 + 10) + ',' + N(ry + 2) + 'Q' + N(x0 + CW / 2) + ',' + N(ry - 5) + ' ' + N(x0 + CW - 10) + ',' + N(ry + 1);
      under += '<path d="' + reed + '" stroke="' + LOGS.reedLine + '" stroke-width="7.4" fill="none" stroke-linecap="round"/><path d="' + reed + '" stroke="' + LOGS.reed + '" stroke-width="4.6" fill="none" stroke-linecap="round"/>';
      for (var j = 0; j < per; j++) {
        var fx = fx0 + j * FW, f = fishParts(fx, ry + 8 + FL / 2, FL, 90, gi * per + j < hl, gi * 11 + j + 5);
        halos += f.glow; bodies += f.body; sparks += f.spark;
        // the loop, over the narrow of the tail
        over += '<ellipse cx="' + N(fx) + '" cy="' + N(ry + 23) + '" rx="8.6" ry="4.6" fill="none" stroke="' + LOGS.reedLine + '" stroke-width="5"/><ellipse cx="' + N(fx) + '" cy="' + N(ry + 23) + '" rx="8.6" ry="4.6" fill="none" stroke="' + LOGS.reed + '" stroke-width="2.6"/>' +
          '<path d="M' + N(fx) + ',' + N(ry + 18) + 'V' + N(ry + 1) + '" stroke="' + LOGS.reedLine + '" stroke-width="4.6" stroke-linecap="round"/><path d="M' + N(fx) + ',' + N(ry + 18) + 'V' + N(ry + 1) + '" stroke="' + LOGS.reed + '" stroke-width="2.4" stroke-linecap="round"/>';
      }
      if (TOT && lit) totals += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * per, false);
    }
    var label = groups + (groups === 1 ? ' string' : ' strings') + ' of fish on the raft, ' + per + ' fish on every string';
    return svgDoc(W, H, label, '<defs><clipPath id="' + id + '"><rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' + logsBack(W, H, (CH + TOT) / 2) + '</g>' + under + halos + bodies + over + sparks + totals +
      '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="none" stroke="' + LOGS.line + '" stroke-width="3"/>');
  }
  // Puddle's riddle (`kind: 'bumps'`): the raft from underneath, in green sunny water. `groups`
  // logs one above another, `per` little bump stars on every one (ten: five, a gap, five), lit in
  // order, so the help can light a log at a time. Never more logs than the raft has is the
  // engine's rule; nothing else is under the raft.
  function bumpStar(x, y, r, lit) {
    var d = '', i, a;
    for (i = 0; i < 10; i++) { a = -Math.PI / 2 + Math.PI * i / 5; d += (i ? 'L' : 'M') + N(x + Math.cos(a) * (i % 2 ? r * 0.44 : r)) + ',' + N(y + Math.sin(a) * (i % 2 ? r * 0.44 : r)); }
    return (lit ? '<circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r * 1.5) + '" fill="' + GLOW + '" opacity=".6"/>' : '') +
      '<path class="pc-bump' + (lit ? ' pc-lit' : '') + '" d="' + d + 'Z" fill="' + (lit ? GLOW2 : '#f6ecd0') + '" stroke="' + (lit ? '#d18b12' : '#8a6c3c') + '" stroke-width="1.8" stroke-linejoin="round"/>';
  }
  // the open river from underneath (its `under` camera's water: WATER.day.under down to its edge)
  var UNDER_WATER = { top: '#c4e9f1', low: '#88c0db', ray: '#f4fbfd' };
  function bumpsPicture(o, groups, per) {
    var hl = clamp(intOr(o.highlight, 0), 0, groups * per), TOT = o.totals ? 78 : 0, nextG = o.next ? Math.floor(hl / per) : -1;
    var SW = 50, gap5 = 26, LH = 78, lg = 16, pad = 26, rowW = per * SW + Math.floor((per - 1) / 5) * gap5, LW = rowW + 96;
    var W = pad * 2 + LW + TOT, H = pad * 2 + Math.max(1, groups) * LH + (Math.max(1, groups) - 1) * lg, id = 'pcraft_' + (++serial).toString(36), body = '', totals = '';
    // the water, seen from below: blue and sunny (the open river's own), brightest where the sky shows between the logs
    var back = '<defs><linearGradient id="' + id + '-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + UNDER_WATER.top + '"/><stop offset="1" stop-color="' + UNDER_WATER.low + '"/></linearGradient>' +
      '<clipPath id="' + id + '-c"><rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22"/></clipPath></defs>' +
      '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="url(#' + id + '-w)"/>';
    var rays = '';
    for (var ri = 0; ri < 5; ri++) rays += '<path d="M' + N(W * (0.1 + ri * 0.2)) + ',0l' + N(-40 + ri * 6) + ',' + N(H) + 'l46,0l' + N(34 - ri * 6) + ',' + N(-H) + 'Z" fill="' + UNDER_WATER.ray + '" opacity=".16"/>';
    back += '<g clip-path="url(#' + id + '-c)">' + rays + '</g>';
    for (var gi = 0; gi < groups; gi++) {
      var y0 = pad + gi * (LH + lg), x0 = pad, cy = y0 + LH / 2;
      if (gi === nextG) body += nextGlowSoft(x0 - 8, y0 - 6, LW + 16, LH + 12, '.6');
      // a log from below: dark and wet, round ends, a little weed
      body += '<rect x="' + x0 + '" y="' + N(y0) + '" width="' + LW + '" height="' + LH + '" rx="' + N(LH / 2) + '" fill="#7b5a3c" stroke="#3f2b1a" stroke-width="3"/>' +
        '<path d="M' + N(x0 + 30) + ',' + N(y0 + 15) + 'H' + N(x0 + LW - 30) + '" stroke="#96724d" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +
        '<path d="M' + N(x0 + 60 + gi * 37 % 200) + ',' + N(y0 + LH - 2) + 'q4,10 -2,18M' + N(x0 + LW - 90 - gi * 53 % 160) + ',' + N(y0 + LH - 2) + 'q-4,9 2,16" stroke="#5f8a4e" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>';
      for (var j = 0; j < per; j++) {
        var bx = x0 + 48 + SW / 2 + j * SW + Math.floor(j / 5) * gap5;
        body += bumpStar(bx, cy + (j % 2 ? 7 : -7), 13.5, gi * per + j < hl);
      }
      if (TOT && hl >= (gi + 1) * per) totals += totalNum(pad + LW + TOT / 2 + 6, cy + 13, (gi + 1) * per, true);
    }
    // the vines that lash the logs together, across them all near either end
    var vines = '';
    if (groups > 1) [pad + 24, pad + LW - 24].forEach(function (vx) {
      vines += '<path d="M' + N(vx) + ',' + N(pad - 4) + 'V' + N(H - pad + 4) + '" stroke="#3f5a2a" stroke-width="11" stroke-linecap="round"/><path d="M' + N(vx) + ',' + N(pad - 4) + 'V' + N(H - pad + 4) + '" stroke="#6f9450" stroke-width="6.4" stroke-linecap="round"/>';
    });
    var label = 'The raft from underneath: ' + groups + (groups === 1 ? ' log, ' : ' logs, ') + per + ' bumps on ' + (groups === 1 ? 'it' : 'every one');
    return svgDoc(W, H, label, back + body + vines + totals + '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="none" stroke="' + RIVER.rim + '" stroke-width="3"/>');
  }
  // Wisp's riddle (`kind: 'herons'`): little herons scratched in the mud with one claw, as simply
  // as a card's picture, each standing on one leg. `groups` herons (one leg in the water each),
  // lit in order: what lights is the leg, the thing counted. Up to six in a row; seven, four above
  // three (the scene's own drawing: marsh.js, `drawing: 'herons'`); more, in two rows.
  function heronsPicture(o, groups, per) {
    var G = MUD, hl = clamp(intOr(o.highlight, 0), 0, groups * per), TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / per) : -1;
    // (seven are four above three, as her claw draws them in the mud: the picture is her drawing)
    var perRow = groups === 7 ? 4 : groups < 7 ? Math.max(1, groups) : Math.ceil(groups / 2), rows = Math.max(1, Math.ceil(groups / perRow));
    var CW = 118, CH = 186, pad = 28, W = pad * 2 + perRow * CW, H = pad * 2 + rows * (CH + TOT), body = '';
    function scratch(d, lit, w) {
      return (lit ? '<path d="' + d + '" stroke="#ffd25e" stroke-width="' + ((w || 4.6) + 8.4) + '" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".55"/>' : '') +
        '<path d="' + d + '" stroke="' + (lit ? '#e39a12' : G.groove) + '" stroke-width="' + (w || 4.6) + '" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
        '<path d="' + d + '" transform="translate(1.6,1.3)" stroke="' + (lit ? '#fff4c2' : G.shine) + '" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".85"/>';
    }
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / perRow), col = gi % perRow, inRow = Math.min(perRow, groups - row * perRow);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT), cx = CW / 2 - 8, wb = (rand(gi * 13 + 4) - 0.5) * 4, g = '';
      var lit = gi * per < hl;
      // the body, the S of the neck, a small head, the long bill and one plume; the other leg folded up
      g += scratch('M' + N(cx - 26) + ',' + N(84 + wb) + 'Q' + N(cx - 22) + ',62 ' + N(cx + 4) + ',62Q' + N(cx + 26) + ',64 ' + N(cx + 24) + ',80Q' + N(cx + 14) + ',98 ' + N(cx - 8) + ',96Q' + N(cx - 22) + ',94 ' + N(cx - 34) + ',' + N(90 + wb) + 'Z', false);
      g += scratch('M' + N(cx + 20) + ',68Q' + N(cx + 40) + ',52 ' + N(cx + 26) + ',40Q' + N(cx + 12) + ',30 ' + N(cx + 22) + ',20', false);
      g += scratch('M' + N(cx + 22) + ',20a7,6.4 0 1 1 9,-4', false, 4) + scratch('M' + N(cx + 33) + ',15L' + N(cx + 60) + ',' + N(19 + wb * 0.5), false, 4) + scratch('M' + N(cx + 22) + ',10L' + N(cx + 8) + ',6', false, 3.4);
      g += scratch('M' + N(cx + 6) + ',96L' + N(cx + 15) + ',112L' + N(cx + 4) + ',118', false, 4);
      // the one leg she stands on, down into the water: this is what is counted
      for (var j = 0; j < per; j++) {
        var lx = cx - 6 + j * 12, on = gi * per + j < hl;
        g += scratch('M' + N(lx) + ',96L' + N(lx - 2 + wb * 0.4) + ',160M' + N(lx - 2) + ',160l-10,5M' + N(lx - 2) + ',160l11,5', on) +
          scratch('M' + N(lx - 22) + ',150q7,-6 14,0M' + N(lx + 6) + ',150q7,-6 14,0', on, 3.2);
      }
      if (gi === nextG) body += nextGlowSoft(x0 + 5, y0 + 2, CW - 10, CH - 4 + TOT * 0.5, '.45');
      body += cell(g, x0, y0, 1);
      if (TOT && hl >= (gi + 1) * per) body += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * per, true);
    }
    var edge = [], n = 28;
    for (var i = 0; i < n; i++) {
      var aa = Math.PI * 2 * i / n, kk = 0.97 + 0.03 * rand(i * 5 + 2), c = Math.cos(aa), sn = Math.sin(aa);
      edge.push([W / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.42) * (W / 2 - 5) * kk, H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * kk]);
    }
    var grit = '';
    for (var dd = 0; dd < Math.round(W * H / 1100); dd++) grit += '<circle cx="' + N(W / 2 + (rand(dd * 7 + 3) - 0.5) * (W - 60)) + '" cy="' + N(H / 2 + (rand(dd * 7 + 4) - 0.5) * (H - 40)) + '" r="' + N(0.8 + rand(dd) * 1.4) + '"/>';
    var label = groups + (groups === 1 ? ' heron' : ' herons') + ' scratched in the mud, each standing on ' + (per === 1 ? 'one leg' : per + ' legs');
    return svgDoc(W, H, label, '<path d="' + crClosed(edge) + '" fill="' + G.patch + '" stroke="' + G.edge + '" stroke-width="3"/><g fill="' + G.dots + '" opacity=".7">' + grit + '</g>' + body);
  }
  // Answers scratched in the sand (chapter 5: her two-number nines answers, 18 and 36, for "Every
  // nines answer hides a nine!"): each number scratched big, its two numerals a little apart, a
  // light scratch under each. `answers: [18, 36]`; `ground` as the sand takes it.
  function answersPicture(o) {
    var G = GROUNDS[o.ground] || GROUNDS.sand, list = (Array.isArray(o.answers) ? o.answers : []).map(function (a) { return String(a).replace(/[^0-9]/g, '').slice(0, 3); }).filter(function (a) { return a; });
    var DW = 78, gapN = 86, pad = 44, widths = list.map(function (a) { return a.length * DW; }), total = 0;
    widths.forEach(function (w, i) { total += w + (i ? gapN : 0); });
    var W = pad * 2 + Math.max(DW * 2, total), H = 230, x = (W - total) / 2, body = '';
    var edge = [], n = 28;
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n, k = 0.97 + 0.03 * rand(i * 3 + 1), c = Math.cos(a), sn = Math.sin(a);
      edge.push([W / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.42) * (W / 2 - 5) * k, H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * k]);
    }
    var dots = '';
    for (var d = 0; d < Math.round(W * H / 900); d++) dots += '<circle cx="' + N(W / 2 + (rand(d * 5 + 2) - 0.5) * (W - 60)) + '" cy="' + N(H / 2 + (rand(d * 5 + 3) - 0.5) * (H - 40)) + '" r="' + N(0.8 + rand(d) * 1.4) + '"/>';
    list.forEach(function (num, ni) {
      var w = widths[ni];
      body += '<rect x="' + N(x - 16) + '" y="34" width="' + N(w + 32) + '" height="150" rx="20" fill="' + G.box + '" opacity=".5"/>';
      num.split('').forEach(function (dg, di) {
        var tx = x + di * DW + DW / 2;
        body += '<text class="pc-answer" x="' + N(tx + 2.4) + '" y="150" text-anchor="middle" font-family="Andika, ui-rounded, system-ui, sans-serif" font-weight="700" font-size="124" fill="' + G.shine + '" opacity=".9">' + dg + '</text>' +
          '<text class="pc-answer" x="' + N(tx) + '" y="148" text-anchor="middle" font-family="Andika, ui-rounded, system-ui, sans-serif" font-weight="700" font-size="124" fill="' + G.groove + '">' + dg + '</text>';
      });
      body += '<path d="M' + N(x + 6) + ',170q' + N(w / 2 - 6) + ',7 ' + N(w - 12) + ',0" stroke="' + G.groove + '" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".55"/>';
      x += w + gapN;
    });
    var label = list.length ? 'Scratched in the ' + G.word + ': ' + list.join(' and ') : 'Nothing scratched in the ' + G.word + ' yet';
    return svgDoc(W, H, label, '<path d="' + crClosed(edge) + '" fill="' + G.patch + '" stroke="' + G.edge + '" stroke-width="3"/><g fill="' + G.dots + '" opacity=".7">' + dots + '</g>' + body);
  }
  // A forepaw's long foreleg, running off the bottom of a picture seen from her own eyes (the
  // promise draws hers the same way): in her fur, a tabby's bars, a tortie's or a calico's patches.
  function ownArm(sp, side, len) {
    var a = '<rect x="-43.6" y="84" width="87.2" height="' + len + '" fill="' + sp.pal.base + '"/>', y;
    if (sp.pattern === 'tabby') { var st = ''; for (y = 112; y < 84 + len; y += 34) st += 'M-44,' + y + 'Q0,' + (y - 12) + ' 44,' + y; a += '<path d="' + st + '" stroke="' + sp.pal.stripe + '" stroke-width="8" fill="none"/>'; }
    else if (sp.pattern === 'tortie' || sp.pattern === 'calico') a += '<path d="' + blob(side * 8, 138, 24, 4) + '" fill="' + sp.pal.patches[0] + '"/><path d="' + blob(-side * 10, 204, 22, 7) + '" fill="' + sp.pal.patches[sp.pattern === 'calico' ? 1 : 0] + '"/>';
    return a + '<path d="M-43.6,84V' + (84 + len) + 'M43.6,84V' + (84 + len) + '" stroke="' + sp.pal.line + '" stroke-width="3" fill="none"/>';
  }
  // Four paws onto the raft (`paws: 'board'`; "One paw at a time. I'll count."): seen from her own
  // eyes, her four paws in a row at the edge of the rocks, a narrow strip of water, the raft's
  // first logs beyond it. Each tap sets the next paw down on the logs (the raft dips: rings on the
  // water at its edge); the next one to move glows softly. `taps` paws are aboard (else
  // `highlight`); `totals` letters one, two, three, four beside the paws that are.
  var BOARD_WATER = '#4d7890';
  function boardPicture(o, groups, per) {
    var sp = resolve(specFromLook(o.look)), n = Math.max(1, groups), taps = clamp(o.taps != null ? intOr(o.taps, 0) : Math.floor(intOr(o.highlight, 0) / Math.max(1, per)), 0, n);
    var W = 660, H = 420, id = 'pcboard_' + (++serial).toString(36), PK = 0.62, colW = (W - 80) / n, body = '';
    var rockY = 306, logY = 228, dip = taps ? 2 + taps * 1.5 : 0;
    // the raft's logs (two of them, running across), dipping a little under each paw; the water; the rocks' edge
    // (the water is the Crossing's deep strip, the colour of the page before and after: BOARD_WATER)
    var back = '<rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" fill="' + BOARD_WATER + '"/>' +
      '<g transform="translate(0,' + N(dip) + ')"><rect x="-20" y="-30" width="' + (W + 40) + '" height="' + (logY + 62) + '" fill="' + LOGS.wood + '"/>' +
      '<path d="M-20,' + (logY - 92) + 'H' + (W + 20) + '" stroke="' + LOGS.seam + '" stroke-width="6" opacity=".8"/><path d="M-20,' + (logY - 86) + 'H' + (W + 20) + '" stroke="' + LOGS.light + '" stroke-width="3" opacity=".6"/>' +
      '<path d="M40,' + (logY - 150) + 'q60,5 120,0M300,' + (logY - 170) + 'q50,-4 100,0M470,' + (logY - 40) + 'q50,4 100,0M120,' + (logY - 22) + 'q40,-4 80,0M520,' + (logY - 130) + 'q30,4 70,0M250,' + (logY - 62) + 'q30,4 60,0" stroke="' + LOGS.grain + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M-20,' + (logY + 32) + 'H' + (W + 20) + '" stroke="' + LOGS.line + '" stroke-width="5"/>' +
      '<path d="M150,-30V' + (logY + 30) + 'M' + (W - 150) + ',-30V' + (logY + 30) + '" stroke="#48692f" stroke-width="12"/><path d="M150,-30V' + (logY + 30) + 'M' + (W - 150) + ',-30V' + (logY + 30) + '" stroke="#7a9f55" stroke-width="6.6"/></g>';
    var rings = '';
    for (var r = 0; r < taps; r++) { var rx = 40 + colW * (r + 0.5); rings += 'M' + N(rx - 62) + ',' + (logY + 42) + 'q14,8 28,0M' + N(rx + 34) + ',' + (logY + 42) + 'q14,8 28,0'; }
    back += (rings ? '<path class="pc-dip" d="' + rings + '" stroke="#ffffff" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".85"/>' : '');
    var rock = 'M-20,' + (H + 20) + 'L-20,' + (rockY + 6);
    for (var q = 0; q <= 8; q++) rock += 'L' + N(-20 + (W + 40) * q / 8) + ',' + N(rockY + (q % 2 ? -7 : 5) + rand(q * 3 + 1) * 6);
    back += '<path d="' + rock + 'L' + (W + 20) + ',' + (H + 20) + 'Z" fill="#a9a7a0" stroke="#6b6963" stroke-width="3" stroke-linejoin="round"/>' +
      '<g fill="#8f8d86" opacity=".7"><ellipse cx="90" cy="' + (rockY + 70) + '" rx="40" ry="9"/><ellipse cx="' + (W - 120) + '" cy="' + (rockY + 96) + '" rx="54" ry="10"/><ellipse cx="330" cy="' + (rockY + 120) + '" rx="34" ry="7"/></g>' +
      '<g fill="#c9c7bf" opacity=".8"><ellipse cx="200" cy="' + (rockY + 30) + '" rx="30" ry="6"/><ellipse cx="' + (W - 250) + '" cy="' + (rockY + 44) + '" rx="26" ry="5"/></g>';
    for (var i = 0; i < n; i++) {
      var cx = 40 + colW * (i + 0.5), aboard = i < taps, side = i % 2 ? 1 : -1, cy = aboard ? logY - 12 + dip : rockY + 58;
      if (i === taps && o.next) body += nextGlowSoft(cx - 50, cy - 66, 100, 112, '.5');
      body += '<g class="pc-paw' + (aboard ? ' pc-aboard' : '') + '" transform="translate(' + N(cx) + ',' + N(cy) + ') scale(' + PK + ')">' + ownPaw(sp, 0, side) + ownArm(sp, side, 520) + '</g>';
      if (o.totals && aboard) body += totalNum(cx + 44, cy - 44, (i + 1) * Math.max(1, per), false);
    }
    var label = 'Your four paws at the edge of the rocks: ' + (taps ? taps + ' on the raft' : 'none on the raft yet');
    return svgDoc(W, H, label, '<defs><clipPath id="' + id + '"><rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="24"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' + back + body + '</g><rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="24" fill="none" stroke="#5f8f77" stroke-width="3"/>');
  }
  // An airplane over the river, as the log Tap's sky shows it at three sizes: a glint far off, a
  // shape with wings, a belly filling the top of the picture (always well above the water).
  function skyPlane(W, size) {
    if (size === 'far') return '<g class="pc-plane" transform="translate(' + N(W * 0.7) + ',44)"><circle r="15" fill="#fffbe6" opacity=".7"/>' + sparkle(0, 0, 9) + '</g>';
    if (size === 'near') return '<g class="pc-plane" transform="translate(' + N(W * 0.64) + ',54)"><path d="M-2,-12L0,-40L2,-12Z" fill="#dfe4e9" stroke="#5f6b78" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M-34,-27H34" stroke="#5f6b78" stroke-width="6" stroke-linecap="round"/><path d="M-34,-27H34" stroke="#dfe4e9" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M-12,2L-104,-6L-106,0L-12,12ZM12,2L104,-6L106,0L12,12Z" fill="#dfe4e9" stroke="#5f6b78" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<g fill="#c9d0d8" stroke="#5f6b78" stroke-width="2.2"><ellipse cx="-50" cy="9" rx="8" ry="7"/><ellipse cx="50" cy="9" rx="8" ry="7"/></g>' +
      '<ellipse cx="0" cy="0" rx="17" ry="16" fill="#eef1f4" stroke="#5f6b78" stroke-width="2.6"/><path d="M-9,-5Q0,-10 9,-5L7,0Q0,-3 -7,0Z" fill="#8fc0de" stroke="#5f6b78" stroke-width="1.6" stroke-linejoin="round"/></g>';
    if (size === 'over') {
      var wn = '';
      for (var i = 0; i < 9; i++) wn += '<circle cx="' + N(W * 0.14 + i * W * 0.09) + '" cy="' + N(74 - Math.abs(i - 4) * 2.4) + '" r="9.6"/>';
      return '<g class="pc-plane"><path d="M-40,-40H' + N(W + 40) + 'V46Q' + N(W / 2) + ',132 -40,46Z" fill="#eef1f4" stroke="#5f6b78" stroke-width="3.4"/>' +
        '<path d="M-40,30Q' + N(W / 2) + ',112 ' + N(W + 40) + ',30" stroke="#cfd6dd" stroke-width="9" fill="none"/><g fill="#8fc0de" stroke="#5f6b78" stroke-width="2.4">' + wn + '</g></g>';
    }
    return '';
  }
  // Her claws in the log (`paws: 'log'`; the Roar: "Nine claws in the log! One tucked for luck!"):
  // seen from her own eyes, her two forepaws on a log of the raft, Riffle's webbed forepaw planted
  // on the same log close beside them, not touching (his arm coming in from the picture's edge);
  // beyond the log the flat bright river, the rocks, a small ginger cat on them with a paw up, and
  // the sky. Each tap digs one claw into the wood, left to right, and lights it; the tenth stays
  // tucked. `taps` claws are in (else `highlight`). `plane: 'far' | 'near' | 'over'` draws the
  // skymonster in the sky at that size (`plane: true`: by the taps, 1-3, 4-6, 7 on); left out, the
  // sky is empty (a page that redraws its own scene behind this picture needs no second airplane).
  function logPicture(o, groups, per) {
    var sp = resolve(specFromLook(o.look)), n = clamp(groups || 9, 1, 9), taps = clamp(o.taps != null ? intOr(o.taps, 0) : Math.floor(intOr(o.highlight, 0) / Math.max(1, per)), 0, n);
    var W = 780, H = 470, id = 'pclog_' + (++serial).toString(36), horizon = 120, logTop = 196;
    var plane = o.plane === true ? (taps >= 7 ? 'over' : taps >= 4 ? 'near' : 'far') : o.plane === 'far' || o.plane === 'near' || o.plane === 'over' ? o.plane : '';
    var back = '<rect x="4" y="4" width="' + (W - 8) + '" height="' + horizon + '" fill="#c4e6f4"/>' + skyPlane(W, plane) +
      // the far shore and the Crossing's rocks, Tallyheart on them
      '<path d="M4,' + (horizon - 12) + 'Q200,' + (horizon - 26) + ' 420,' + (horizon - 14) + 'T' + (W - 4) + ',' + (horizon - 16) + 'V' + (horizon + 4) + 'H4Z" fill="#9dbb8b"/>' +
      '<rect x="4" y="' + horizon + '" width="' + (W - 8) + '" height="' + (logTop - horizon + 20) + '" fill="' + RIVER.water + '"/>' +
      '<path d="M60,' + (horizon + 30) + 'q30,-7 60,0M300,' + (horizon + 48) + 'q26,-6 52,0M560,' + (horizon + 26) + 'q30,-7 60,0M430,' + (horizon + 60) + 'q18,-5 36,0" stroke="' + RIVER.line + '" stroke-width="3" fill="none" stroke-linecap="round" opacity=".65"/>' +
      '<path d="M96,' + (horizon + 12) + 'q14,-30 44,-30q22,-14 46,0q30,2 40,30Z" fill="#a9a7a0" stroke="#6b6963" stroke-width="2.4" stroke-linejoin="round"/>';
    var th = buildCat(resolve(PRESETS.tallyheart), { pose: 'pawup', mood: 'shout', facing: 'right' });
    back += '<g transform="translate(128,' + (horizon - 67) + ') scale(0.3)">' + th.svg + '</g>';
    // the log: all the way across, bark along its far edge, the grain running with it
    back += '<rect x="-20" y="' + logTop + '" width="' + (W + 40) + '" height="' + (H - logTop + 30) + '" fill="' + LOGS.wood + '"/>' +
      '<path d="M-20,' + logTop + 'H' + (W + 20) + '" stroke="' + LOGS.line + '" stroke-width="6"/><path d="M-20,' + (logTop + 9) + 'H' + (W + 20) + '" stroke="' + LOGS.light + '" stroke-width="5" opacity=".7"/>' +
      '<path d="M40,' + (logTop + 44) + 'q70,6 150,0M330,' + (logTop + 30) + 'q60,-5 130,0M560,' + (logTop + 64) + 'q50,5 120,0M90,' + (logTop + 150) + 'q40,-4 90,0M600,' + (logTop + 190) + 'q40,4 100,0M30,' + (logTop + 236) + 'q50,5 110,0" stroke="' + LOGS.grain + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
    var body = '', lx = 236, rx = 430, py = 372;
    if (o.next && taps < n) body += nextGlowSoft(lx - 104, py - 118, rx - lx + 208, 190, '.3');
    body += '<g class="pc-paws">' + cell(ownPaw(sp, Math.min(5, taps), -1, false, true) + ownArm(sp, -1, 200), lx, py, 1) + cell(ownPaw(sp, clamp(taps - 5, 0, 4), 1, true, true) + ownArm(sp, 1, 200), rx, py, 1) + '</g>';
    // Riffle's: right there on the same log, a paw's width off
    body += '<g class="pc-riffle" transform="translate(628,372) rotate(-16)">' + otterPawTop(0) + '</g>';
    var label = 'Your two forepaws on the raft’s log, Riffle’s beside them: ' + taps + (taps === 1 ? ' claw' : ' claws') + ' dug in, one tucked';
    return svgDoc(W, H, label, '<defs><clipPath id="' + id + '"><rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="24"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' + back + body + '</g><rect x="4" y="4" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="24" fill="none" stroke="' + LOGS.line + '" stroke-width="3"/>');
  }

  // ----- chapter 7: the 6s' cheeks close up, her whiskers on one cheek, the back row's gaps, the nights
  // (docs/chapters/07-the-counts-dont-lie.spec.md, section 4). Each is reached only by a `kind` or a
  // `thing` no chapter before 7 passes, so no earlier picture changes. The game's cats keep two
  // whiskers a side: six on a cheek, two rows of three, exist only in these close-ups.

  // The rim's coats, in order, for cheeks with no `who` (round again): never a face, never her coat
  var RIM_COATS = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
  // the cats a cheek can be (anyone else in a `who` takes the rim's coat for that place)
  var CHEEK_CATS = { player: 1, clancat: 1, reedclan: 1, tallyheart: 1, glintstar: 1, waffles: 1, grizzled: 1, snorer: 1, mutterer: 1, snorter: 1, murmurchime: 1, sloshbank: 1 };
  function cheekCoat(o, gi) {
    var e = Array.isArray(o.who) ? o.who[gi] : null;
    if (e && CHEEK_CATS[e.who]) return resolve(whoSpec(o, e));
    return resolve(whoSpec({ who: RIM_COATS, look: o.look }, RIM_COATS[gi % RIM_COATS.length]));
  }
  // THE FACE RULE: two consecutive `who` entries with the same `who` and the same `variant` (both
  // absent counts as the same) are one character's face close up, its two cheeks side by side and
  // puffed round, one group each: 1 its left cheek, 2 its right, 0 a cheek of its own. Pairs are
  // taken from the left, so the entry after a pair starts afresh; with no `who`, no faces.
  function cheekFaces(o, groups) {
    var who = Array.isArray(o.who) ? o.who : [], out = [];
    var v = function (e) { return e.variant == null ? '' : String(e.variant); };
    for (var i = 0; i < groups; i++) {
      var a = who[i], b = who[i + 1];
      if (i + 1 < groups && a && b && a.who && a.who === b.who && v(a) === v(b)) { out.push(1, 2); i++; } else out.push(0);
    }
    return out;
  }
  // One cheek close up: the left half of a face as we look at it, in face coordinates (the face's
  // middle line at x = 0, the eye near the top, the chin at y = 200): the cheek in the cat's coat, its
  // muzzle puff with six whisker dots in two rows of three, and the six whiskers, thin curves fanning
  // out to the left past the cheek: three on top, three below. `lit(j)` lights whisker j (0 to 2 the
  // top row, from the top; 3 to 5 the row below). o: `puff` (puffed round: a face), `right` (the
  // face's right half, which the caller mirrors: the other eye, no scar), `sliver` (the other cheek's
  // edge beside a single cheek: fur and puff only). Returns { fur, rows: [top, bottom], boxes }: the
  // rows are drawn after the fur, so a caller can glow one; `boxes` are the rows' boxes.
  var CHEEK_DOTS = [[-20, 93], [-37, 98], [-54, 103], [-54, 131], [-37, 136], [-20, 141]];
  var CHEEK_TIPS = [[-194, 46], [-194, 69], [-194, 92], [-194, 142], [-194, 165], [-194, 188]];
  var CHEEK_LINE = { unlit: '#3b302a', lit: '#c27a0c' };
  function cheekHalf(sp, lit, o) {
    o = o || {};
    var p = sp.pal, puff = !!o.puff, line = p.line, muz = sp.muzzle || p.light, id = 'pcck' + (++serial).toString(36);
    var outl = puff ? 'M-60,-46C-112,-42 -150,-8 -158,38C-162,58 -164,72 -164,84L-176,94L-165,100L-172,110C-182,148 -160,184 -112,194C-74,202 -32,203 0,203'
      : 'M-60,-46C-108,-42 -138,-8 -145,38C-149,60 -151,76 -150,88L-162,99L-150,105L-159,118L-145,122C-139,148 -119,170 -89,182C-60,193 -28,197 0,197';
    var fillD = outl + 'L4,203L4,-46Z', inner = '';
    // the markings, inside the whole face (so one that crosses the middle line, a blaze or a pale chin,
    // is never cut there, and the other half draws the same over it): a tabby's forehead stripes and two
    // short thick bars at the cheek's edge (never like a whisker, and clear of them), a tortie's or
    // calico's patches, a blaze down the nose, a pale chin
    if (sp.pattern === 'tabby') inner += '<path d="M-12,-50L-11,2M-32,-48L-29,-4M-146,22L-128,28M-148,38L-130,42" stroke="' + p.stripe + '" stroke-width="9" stroke-linecap="round" fill="none"/>';
    else if (sp.pattern === 'tortie') inner += '<path d="' + blob(-112, 30, 40, 3) + '" fill="' + p.patches[0] + '"/><path d="' + blob(-70, 182, 22, 5) + '" fill="' + p.patches[1] + '"/>';
    else if (sp.pattern === 'calico') inner += '<path d="' + blob(-106, 22, 44, 3) + '" fill="' + p.patches[0] + '"/><path d="' + blob(-30, -40, 20, 6) + '" fill="' + p.patches[1] + '"/>';
    if (sp.marks.back) inner += '<path d="M0,-50L0,-10" stroke="' + mix(p.base, line, 0.6) + '" stroke-width="16" stroke-linecap="round"/>';
    if (sp.marks.splash) inner += '<path d="M10,-50Q14,8 22,44Q38,76 24,100L-24,100Q-38,76 -22,44Q-14,8 -10,-50Z" fill="' + markFill(sp) + '"' + markEdge(sp) + '/>';
    if (sp.marks.chin || sp.marks.chest) inner += '<ellipse cx="0" cy="198" rx="62" ry="28" fill="' + (sp.marks.chin || sp.marks.chest) + '"/>';
    inner += '<ellipse cx="-106" cy="12" rx="32" ry="12" transform="rotate(-28 -106 12)" fill="' + p.light + '" opacity=".5"/>';
    if (puff) inner += '<path d="M-156,132Q-150,104 -126,94" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".4"/>';
    var fur = '<defs><clipPath id="' + id + '"><path d="' + fillD + '"/><path d="' + fillD + '" transform="scale(-1,1)"/></clipPath></defs><path class="pc-fur" d="' + fillD + '" fill="' + p.base + '"/>' +
      '<g clip-path="url(#' + id + ')">' + inner + '</g><path d="' + outl + '" stroke="' + line + '" stroke-width="3.4" fill="none" stroke-linejoin="round"/>';
    // the muzzle puff the whiskers grow from
    var mc = puff ? [-34, 124, 44] : [-30, 120, 38];
    fur += '<circle class="pc-muzzle" cx="' + mc[0] + '" cy="' + mc[1] + '" r="' + mc[2] + '" fill="' + muz + '" stroke="' + mix(muz, line, 0.4) + '" stroke-width="2" stroke-opacity=".55"/>';
    if (o.sliver) return { fur: fur, rows: ['', ''], boxes: [] };
    // the eye (the left one as we look; the right one on a face's right half), as the scenes draw it
    var ed = 'pcce' + (++serial).toString(36);
    fur += '<defs><path id="' + ed + '" d="' + EYE + '"/><clipPath id="' + ed + 'c"><use href="#' + ed + '"/></clipPath></defs>' +
      '<g transform="translate(-66,36) scale(-2.1,2.1)">' + eyeSvg(puff ? 'wonder' : 'open', sp.iris[o.right ? 1 : 0], [0.8, 0.6], -1, p, p.base, ed, ed + 'c', sp) + '</g>';
    if (sp.scar && !o.right) fur += '<path d="M-52,-16Q-66,26 -80,68" stroke="#dba79f" stroke-width="6" fill="none" stroke-linecap="round"/>';
    // the nose and the mouth, on the middle line (a puffed face holds its breath: the mouth shut small)
    var ml = p.feat === p.line ? mix(p.line, '#000', 0.1) : p.feat;
    fur += '<path d="' + (puff ? 'M0,98V108M0,108Q-6,114 -13,110' : 'M0,98V114M0,114Q-9,126 -22,117') + '" stroke="' + ml + '" stroke-width="3.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M-3.8,7.2Q0,6 3.8,7.2Q2.2,10.6 0,11.7Q-2.2,10.6 -3.8,7.2Z" transform="translate(0,56) scale(3.6)" fill="' + p.nose + '" stroke="' + mix(p.nose, '#5a2a33', 0.45) + '" stroke-width=".5" stroke-linejoin="round"/>';
    // the six whiskers, each from its dot: a dark edge and a pale core, so they show on any coat and
    // on the card; lit, gold with a glow behind
    var rows = ['', ''], boxes = [[1e9, 1e9, -1e9, -1e9], [1e9, 1e9, -1e9, -1e9]], dx = puff ? -4 : 0, dy = puff ? 3 : 0, reach = puff ? -10 : 0;
    for (var j = 0; j < 6; j++) {
      var r = j < 3 ? 0 : 1, on = !!lit(j), d0 = [CHEEK_DOTS[j][0] + dx, CHEEK_DOTS[j][1] + dy], t = [CHEEK_TIPS[j][0] + reach, CHEEK_TIPS[j][1] + dy];
      var m = [(d0[0] + t[0]) / 2, (d0[1] + t[1]) / 2 + (r ? 7 : -7)], wd = 'M' + pt(d0) + 'Q' + pt(m) + ' ' + pt(t), w = '';
      if (on) w += '<path d="' + wd + '" stroke="' + GLOW + '" stroke-width="14" stroke-linecap="round" fill="none" opacity=".5"/>';
      w += '<path class="pc-whisker' + (on ? ' pc-lit' : '') + '" d="' + wd + '" stroke="' + (on ? CHEEK_LINE.lit : CHEEK_LINE.unlit) + '" stroke-width="5.6" stroke-linecap="round" fill="none"/>' +
        '<path d="' + wd + '" stroke="' + (on ? GLOW2 : '#fbf6ea') + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
        '<circle cx="' + N(d0[0]) + '" cy="' + N(d0[1]) + '" r="4.6" fill="' + (on ? GLOW2 : mix(line, '#000', 0.15)) + '"' + (on ? ' stroke="' + CHEEK_LINE.lit + '" stroke-width="1.6"' : '') + '/>';
      rows[r] += w;
      var b = boxes[r];
      [d0, t, m].forEach(function (q) { b[0] = Math.min(b[0], q[0]); b[1] = Math.min(b[1], q[1]); b[2] = Math.max(b[2], q[0]); b[3] = Math.max(b[3], q[1]); });
    }
    return { fur: fur, rows: rows, boxes: boxes };
  }

  // The 6s: `groups` cheeks close up (one to ten, up to five a row; six to ten: five, then the rest),
  // each a group of six whiskers, two rows of three; a face (THE FACE RULE above) is its two cheeks
  // side by side on one card, puffed round, and never split across a row. `highlight` lights whiskers
  // in order, cheek by cheek, each cheek's top three then its bottom three; `kind: 'cheeks-top'` lights
  // every cheek's top three from the start, whatever `highlight` says. `totals`: the running total
  // under each cheek; `next`: the next cheek glowing (pc-next, the tap target).
  function cheeksPicture(o, groups) {
    var per = 6, hl = clamp(intOr(o.highlight, 0), 0, per * groups), top = o.kind === 'cheeks-top';
    var TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / per) : -1;
    var CW = 220, CH = 206, pad = 18, face = cheekFaces(o, groups), slot = [], col = 0, inRow = [0], gi;
    for (gi = 0; gi < groups; gi++) {
      if (col >= 5 || (face[gi] === 1 && col >= 4)) { col = 0; inRow.push(0); }
      slot.push([col, inRow.length - 1]); col++; inRow[inRow.length - 1]++;
    }
    var cols = Math.max(1, Math.max.apply(null, inRow)), rows = inRow.length;
    var W = pad * 2 + cols * CW, H = pad * 2 + rows * (CH + TOT), defs = '', cards = '', body = '', clip = [];
    var X = function (k) { return pad + (W - pad * 2 - inRow[slot[k][1]] * CW) / 2 + slot[k][0] * CW; };
    var Y = function (k) { return pad + slot[k][1] * (CH + TOT); };
    // the cards first (a face's one card under both its cheeks), so a glow shows on its card
    for (gi = 0; gi < groups; gi++) {
      if (face[gi] === 2) { clip[gi] = clip[gi - 1]; continue; }
      var cid = 'pccc' + (++serial).toString(36), rr = 'x="' + N(X(gi) + 6) + '" y="' + N(Y(gi) + 6) + '" width="' + N((face[gi] === 1 ? 2 : 1) * CW - 12) + '" height="' + N(CH - 6) + '" rx="22"';
      defs += '<clipPath id="' + cid + '"><rect ' + rr + '/></clipPath>';
      cards += '<rect class="pc-card" ' + rr + ' fill="#d6e5c8"/>';
      clip[gi] = cid;
    }
    for (gi = 0; gi < groups; gi++) {
      var sp = cheekCoat(o, gi), litN = clamp(hl - gi * per, 0, per), x0 = X(gi), y0 = Y(gi), g;
      var lit = function (j) { return j < litN || (top && j < 3); };
      if (face[gi]) {
        var hf = cheekHalf(sp, lit, { puff: true, right: face[gi] === 2 });
        g = '<g transform="translate(' + N(face[gi] === 1 ? x0 + CW : x0) + ',' + N(y0 + 2) + ')' + (face[gi] === 2 ? ' scale(-1,1)' : '') + '">' + hf.fur + hf.rows[0] + hf.rows[1] + '</g>';
      } else {
        // a cheek of its own: the nose whole at the card's edge, a sliver of the other cheek beyond it
        var one = cheekHalf(sp, lit), other = cheekHalf(sp, lit, { sliver: true });
        g = '<g transform="translate(' + N(x0 + CW - 32) + ',' + N(y0 + 8) + ') scale(.92)"><g transform="scale(-1,1)">' + other.fur + '</g>' + one.fur + one.rows[0] + one.rows[1] + '</g>';
      }
      if (gi === nextG) body += nextGlowSoft(x0 + 1, y0 + 1, CW - 2, CH + 4 + TOT * 0.5, '.7');
      body += '<g class="pc-cheek' + (face[gi] ? ' pc-face' : '') + '" clip-path="url(#' + clip[gi] + ')">' + g + '</g>';
      if (TOT && litN >= per) body += totalNum(x0 + CW / 2, y0 + CH + 32, (gi + 1) * per, false);
    }
    var label = groups + (groups === 1 ? ' cheek, six whiskers' : ' cheeks, six whiskers each');
    return svgDoc(W, H, label, '<defs>' + defs + '</defs><rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>' + cards + body);
  }

  // Her whiskers (the 3s' skip, `thing: 'whisker'`): one big cheek close up in who[0]'s coat
  // (Tallyheart's), its two rows of three the two groups: the top row first, then the row below.
  // `highlight` 3 lights the top row, 6 both; `totals` puts 3 and 6 beside the rows; `next` glows
  // on the next row.
  function oneCheekPicture(o, groups) {
    var per = 3, n = clamp(groups, 1, 2), hl = clamp(intOr(o.highlight, 0), 0, per * n), nextR = o.next && hl < per * n ? Math.floor(hl / per) : -1;
    // a 16:10 picture with a clear band along the top (where the page puts the big number) and the
    // card in the middle, the totals to its left, beside the rows
    var K = 1.46, W = 640, H = 400, cw = Math.round(30 + 224 * K), TW = o.totals ? 74 : 0, cx0 = Math.round((W - cw - TW) / 2 + TW), cy0 = 58;
    var mx = cx0 + cw - 30 * K, my = cy0 + 4, sp = cheekCoat(o, 0), lit = function (j) { return j < hl; };
    var one = cheekHalf(sp, lit), other = cheekHalf(sp, lit, { sliver: true }), cid = 'pcco' + (++serial).toString(36);
    var card = 'x="' + N(cx0) + '" y="' + cy0 + '" width="' + N(cw) + '" height="' + N(H - cy0 - 14) + '" rx="26"';
    var at = 'translate(' + N(mx) + ',' + N(my) + ') scale(' + K + ')', body = '', tot = '';
    for (var r = 0; r < n; r++) {
      var b = one.boxes[r], x0 = mx + b[0] * K, y0 = my + b[1] * K, x1 = mx + b[2] * K, y1 = my + b[3] * K;
      if (r === nextR) body += nextGlowSoft(x0 - 12, y0 - 14, x1 - x0 + 26, y1 - y0 + 28, '.55');
      body += '<g class="pc-row" transform="' + at + '">' + one.rows[r] + '</g>';
      if (o.totals && hl >= (r + 1) * per) tot += totalNum(cx0 - 34, (y0 + y1) / 2 + 13, (r + 1) * per, false);
    }
    return svgDoc(W, H, 'One cheek: two rows of three whiskers', '<defs><clipPath id="' + cid + '"><rect ' + card + '/></clipPath></defs>' +
      '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/><rect ' + card + ' fill="#d6e5c8"/>' +
      '<g class="pc-cheek" clip-path="url(#' + cid + ')"><g transform="' + at + '"><g transform="scale(-1,1)">' + other.fur + '</g>' + one.fur + '</g>' + body + '</g>' + tot);
  }

  // The back row close up (the gaps' skip, `thing: 'gap'`): three pieces, `groups` empty places pressed
  // in the earth, three pieces (PC.art.prey's mice and voles, eyes shut, as the pile draws them). Each
  // empty place is a group: the next glows, a lit one is outlined in gold; `totals` 1, 2, 3… under them.
  var GAP_EARTH = { patch: '#c9a679', edge: '#94724b', dots: '#a98760', press: '#a88459', lip: '#e2c79c', rim: '#7f603e' };
  function gapsPicture(o, groups) {
    var n = clamp(groups, 1, 10), hl = clamp(intOr(o.highlight, 0), 0, n), TOT = o.totals ? 52 : 0, nextG = o.next && hl < n ? hl : -1;
    var fn = typeof art.prey === 'function' ? art.prey : preyFallback, SW = 100, PW = 90, PH = 56, pad = 24, slots = n + 6;
    var W = pad * 2 + slots * SW, H = pad * 2 + 112 + TOT, base = pad + 92, body = '', E = GAP_EARTH;
    function piece(cx, c) {
      var q0 = { kind: preyKind(c, 0), lit: false, seed: 300 + c, facing: 'right', part: 'body' }, q = null;
      try { q = fn(q0); } catch (e) { q = null; }
      if (!q || typeof q.svg !== 'string' || !q.svg || !(q.w > 0 && q.h > 0)) q = preyFallback(q0);
      var k = Math.min(PW / q.w, PH / q.h), svg = q.svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
      return '<ellipse cx="' + N(cx) + '" cy="' + N(base - 2) + '" rx="' + N(PW * 0.48) + '" ry="7" fill="#5a4026" opacity=".22"/>' +
        '<g transform="translate(' + N(cx - q.w * k / 2) + ',' + N(base - q.h * k) + ') scale(' + N(k) + ')">' + svg + '</g>';
    }
    // the earth: a long soft strip, crumbs
    body += '<rect x="6" y="' + N(pad + 6) + '" width="' + N(W - 12) + '" height="' + N(112 - 6) + '" rx="40" fill="' + E.patch + '" stroke="' + E.edge + '" stroke-width="3"/>';
    var crumbs = '';
    for (var d = 0; d < slots * 3; d++) crumbs += '<circle cx="' + N(20 + rand(d * 5 + 2) * (W - 40)) + '" cy="' + N(pad + 18 + rand(d * 5 + 3) * 84) + '" r="' + N(1 + rand(d) * 1.6) + '"/>';
    body += '<g fill="' + E.dots + '" opacity=".7">' + crumbs + '</g>';
    for (var c = 0; c < slots; c++) {
      var cx = pad + c * SW + SW / 2, gi = c - 3;
      if (gi < 0 || gi >= n) { body += piece(cx, c); continue; }
      // an empty place: the earth pressed smooth where a piece lay last night
      var on = gi < hl, place = '<ellipse cx="' + N(cx) + '" cy="' + N(base - 10) + '" rx="40" ry="15" fill="' + E.press + '"/>' +
        '<ellipse cx="' + N(cx) + '" cy="' + N(base - 13) + '" rx="31" ry="9" fill="' + E.lip + '" opacity=".55"/>' +
        '<path d="M' + N(cx - 38) + ',' + N(base - 6) + 'q38,12 76,0" stroke="' + E.rim + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>';
      if (on) place = '<ellipse cx="' + N(cx) + '" cy="' + N(base - 10) + '" rx="48" ry="22" fill="' + GLOW + '" opacity=".35"/>' + place +
        '<ellipse class="pc-lit" cx="' + N(cx) + '" cy="' + N(base - 10) + '" rx="42" ry="17" fill="none" stroke="' + GLOW + '" stroke-width="5"/>';
      if (gi === nextG) body += nextGlowSoft(cx - SW / 2 + 4, pad + 2, SW - 8, 114 + TOT * 0.5, '.6');
      body += '<g class="pc-gap">' + place + '</g>';
      if (TOT && on) body += totalNum(cx, base + 64, gi + 1, false);
    }
    return svgDoc(W, H, 'The back row: ' + (n === 4 ? 'four' : n) + ' empty place' + (n === 1 ? '' : 's'), body);
  }

  // The nights (`kind: 'marks'`): `groups` nights side by side in one row (seven to ten: two rows),
  // each a cluster of `per` short upright scratches (four in a row; ten as two rows of five), a clear
  // gap between nights and nothing else to count (no moon, no number); in the sand, or `ground: 'mud'`.
  // `highlight` lights the marks in order, a night at a time.
  // (chapter 8, `layout: 'pairs'`: each night's marks scratched in pairs, a gap between the pairs:
  // four are two and two. Without it the marks draw exactly as chapter 7's.)
  function marksPicture(o, groups, per) {
    var G = GROUNDS[o.ground] || GROUNDS.sand, n = clamp(groups, 1, 10), hl = clamp(intOr(o.highlight, 0), 0, n * per);
    var pairs = o.layout === 'pairs', PG = pairs ? 14 : 0;
    var SP = 17, LEN = 40, gap = 34, pad = 26, perRow = pairs ? (per <= 6 ? per : Math.ceil(per / 4) * 2) : Math.min(per, 5), subRows = Math.ceil(per / perRow);
    var cw = perRow * SP + 26 + (pairs ? Math.floor((perRow - 1) / 2) * PG : 0), ch = subRows * (LEN + 12) + 18, perLine = n <= 6 ? n : Math.ceil(n / 2), lines = Math.ceil(n / perLine);
    var W = pad * 2 + perLine * cw + (perLine - 1) * gap, H = pad * 2 + lines * ch + (lines - 1) * 18, edge = [];
    for (var i = 0; i < 28; i++) {
      var a = Math.PI * 2 * i / 28, k = 0.97 + 0.03 * rand(i * 3 + 1), c = Math.cos(a), sn = Math.sin(a);
      edge.push([W / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.42) * (W / 2 - 5) * k, H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * k]);
    }
    var s = groundPatch(G, W, H, edge), dots = '';
    for (var d = 0; d < Math.round(W * H / 900); d++) dots += '<circle cx="' + N(W / 2 + (rand(d * 5 + 2) - 0.5) * (W - 60)) + '" cy="' + N(H / 2 + (rand(d * 5 + 3) - 0.5) * (H - 40)) + '" r="' + N(0.8 + rand(d) * 1.4) + '"/>';
    s += '<g fill="' + G.dots + '" opacity=".7">' + dots + '</g>';
    for (var g = 0; g < n; g++) {
      var line = Math.floor(g / perLine), inLine = Math.min(perLine, n - line * perLine);
      var x0 = (W - (inLine * cw + (inLine - 1) * gap)) / 2 + (g % perLine) * (cw + gap), y0 = pad + line * (ch + 18), night = '';
      night += '<rect x="' + N(x0) + '" y="' + N(y0) + '" width="' + N(cw) + '" height="' + N(ch) + '" rx="18" fill="' + G.box + '" opacity=".55"/>';
      for (var j = 0; j < per; j++) {
        var sx = x0 + 13 + SP / 2 + (j % perRow) * SP + (pairs ? Math.floor((j % perRow) / 2) * PG : 0), sy = y0 + 12 + Math.floor(j / perRow) * (LEN + 12), on = g * per + j < hl;
        var d1 = 'M' + N(sx + 4) + ',' + N(sy) + 'Q' + N(sx + 1) + ',' + N(sy + LEN / 2) + ' ' + N(sx - 4) + ',' + N(sy + LEN);
        if (on) night += '<path d="' + d1 + '" stroke="#ffd25e" stroke-width="13" stroke-linecap="round" fill="none" opacity=".55"/>';
        night += '<path class="pc-mark' + (on ? ' pc-lit' : '') + '" d="' + d1 + '" stroke="' + (on ? '#e39a12' : G.groove) + '" stroke-width="4.6" stroke-linecap="round" fill="none"/>' +
          '<path d="' + d1 + '" transform="translate(1.8,0)" stroke="' + (on ? '#fff4c2' : G.shine) + '" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".9"/>';
      }
      s += '<g class="pc-night">' + night + '</g>';
    }
    var label = n + (n === 1 ? ' night, ' : ' nights, ') + per + (per === 1 ? ' mark' : ' marks') + (n === 1 ? '' : ' each') + (pairs && per > 1 ? (per === 4 ? ', two and two' : ', in pairs') : '');
    return svgDoc(W, H, label, s);
  }

  // ----- chapter 8: one cat's paws, a pair at a time (`thing: 'paw'` at per 2, no kind: "A four is two
  // twos"). One big cat (who[0]: Tallyheart's ginger tabby; a Clan cat if there is none), side-on,
  // standing, her four paws plain along the bottom: the FRONT PAIR is the first group and the BACK PAIR
  // the second; `highlight` 2 lights the front pair, 4 all four; `totals` puts 2 and 4 under the pairs;
  // `next` glows round the next pair to tap.
  function pawPairsPicture(o) {
    var hl = clamp(intOr(o.highlight, 0), 0, 4), TOT = o.totals ? 50 : 0, nextP = o.next && hl < 4 ? Math.floor(hl / 2) : -1;
    // she faces left, so her front pair (counted first) is on the left and the glow, the lit pairs and their
    // totals read 2, 4 from left to right, as every other counting picture does
    var c = countsChar(o, 0, null, { pose: 'stand4', mood: hl >= 4 ? 'proud' : 'happy', facing: 'left' }, hl >= 4), b = c.bounds;
    var W = 470, H = 330 + TOT, gY = 292, K = Math.min(2.1, (gY - 22) / (197 - b.y0), (W - 40) / (b.x1 - b.x0));
    // a little left of centre, so the big number the page puts over the picture (ui.js drawBigNum: top centre, a
    // tenth of the panel wide) stands clear of her ears
    var ox = Math.max(20 - b.x0 * K, W / 2 - (b.x0 + b.x1) / 2 * K - 64), oy = gY - 197 * K;
    var paws = c._marks.paws.slice(0, 4).sort(function (a, b) { return a[0] - b[0]; });   // the front pair first (on the left)
    var at = function (q) { return [ox + q[0] * K, oy + q[1] * K]; };
    var body = '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>';
    body += '<ellipse cx="' + N(ox + (b.x0 + b.x1) / 2 * K) + '" cy="' + N(oy + 196 * K) + '" rx="' + N(72 * K) + '" ry="' + N(8 * K) + '" fill="#3f5a2e" opacity=".14"/>';
    var glows = '', marks = '', tot = '';
    [0, 1].forEach(function (pi) {
      var a = at(paws[pi * 2]), b = at(paws[pi * 2 + 1]), lit = hl >= (pi + 1) * 2, mx = (a[0] + b[0]) / 2, gy = Math.max(a[1], b[1]);
      if (pi === nextP) body += nextGlowSoft(Math.min(a[0], b[0]) - 34, gy - 46, Math.abs(a[0] - b[0]) + 68, 70, '.75');
      if (lit) glows += glow(a[0], a[1], 26) + glow(b[0], b[1], 26);
      marks += '<g class="pc-pair' + (lit ? ' pc-lit' : '') + '"><circle cx="' + N(a[0]) + '" cy="' + N(a[1]) + '" r="1" fill="none"/><circle cx="' + N(b[0]) + '" cy="' + N(b[1]) + '" r="1" fill="none"/></g>';
      if (TOT && lit) tot += totalNum(mx, gy + 52, (pi + 1) * 2, false);
    });
    body += glows + '<g transform="translate(' + N(ox) + ',' + N(oy) + ') scale(' + K + ')">' + c.svg + '</g>' + marks + tot;
    return svgDoc(W, H, 'One cat: two front paws and two back paws', body);
  }

  // ----- chapter 8, `kind: 'dogs'` (Hail's riddle: "Three dogs, and me. Four paws each!"): the table-4
  // picture's tiles, each animal of `who` side-on, standing, its four paws lit in order an animal at a
  // time. The dogs by variant (shaggy, spotty, tiny: big, middling and small, each fitted to its tile),
  // with glows at their paws as a cat's; Hail standing, her two hind feet and two forepaws; a cat in the
  // list as the table-4 picture draws it. A `who` longer than `groups` draws its first `groups`.
  var DOG_TILE = { dog: [1, 0.86, 0.7], hail: 0.9 };
  function dogsPicture(o, groups) {
    var n = clamp(groups, 1, 10), t = 4, hl = clamp(intOr(o.highlight, 0), 0, t * n);
    var TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / t) : -1;
    var cols = Math.max(1, Math.min(5, n)), rows = Math.max(1, Math.ceil(n / 5));
    var pad = 18, CW = 176, CH = 150, body = '', count = 0;
    var W = pad * 2 + cols * CW, H = pad * 2 + rows * (CH + TOT);
    for (var gi = 0; gi < n; gi++) {
      var row = Math.floor(gi / 5), col = gi % 5, inRow = Math.min(5, n - row * 5);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT), g = '';
      var litAll = hl >= (gi + 1) * t, e = o.who && o.who[gi];
      if (gi === nextG) body += nextGlow(x0 + 8, y0 + 4, CW - 16, CH + TOT * 0.5 - 4);
      g += '<ellipse cx="100" cy="196" rx="70" ry="8" fill="#3f5a2e" opacity=".14"/>';
      var drawn, paws, mood = litAll ? 'happy' : (e && e.mood) || 'happy';
      if (e && (e.who === 'dog' || e.who === 'hail')) {
        var r = e.who === 'dog' ? buildBeast(beastSpec('dog', e), { pose: 'stand', mood: mood, variant: e.variant }) : buildHail({ pose: 'stand', mood: mood });
        var bx = r.bounds || boxOf([[0, 0], [r.w, r.h]]), fit = Math.min(190 / (bx.x1 - bx.x0), 178 / (r.h - bx.y0));
        var kk = fit * (e.who === 'dog' ? DOG_TILE.dog[clamp(intOr(e.variant, 1), 1, 3) - 1] : DOG_TILE.hail);
        var cx = (bx.x0 + bx.x1) / 2, Mc = mul(mT(100 - cx * kk, 197 - r.h * kk), mS(kk));
        drawn = '<g transform="' + mStr(Mc) + '">' + r.svg + '</g>';
        paws = (r._marks.paws || []).slice(0, 4).map(function (q) { return apply(Mc, q); });
      } else {
        var c4 = countsChar(o, gi, null, { pose: 'stand', mood: 'happy' }, litAll);
        drawn = c4.svg; paws = c4._marks.paws.slice(0, 4);
      }
      var pg = '';
      paws.sort(function (a, b) { return a[0] - b[0]; }).forEach(function (pp) {
        if (count < hl) pg += glow(pp[0], pp[1] - 3, 17);
        count++;
      });
      g += '<g class="pc-animal">' + pg + drawn + '</g>';
      body += cell(g, x0 - 2, y0 - 38, 0.9);
      count = (gi + 1) * t;
      if (TOT && litAll) body += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * t, false);
    }
    var label = n + (n === 1 ? ' animal, four paws' : ' animals, four paws each');
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>' + body);
  }

  art.countsPicture = function (opts) {
    var o = opts || {};
    var table = clamp(intOr(o.table, 1), 1, 10), groups = clamp(intOr(o.groups, 1), 0, 20);
    // per: how many things each group holds (it defaults to the table; 2 × 8 can be pictured as two rows of eight)
    var per = o.per == null ? table : clamp(intOr(o.per, table), 1, 10);
    // chapter 3: her own two forepaws (the bedtime tap), little paws drawn in the mud, and the 5s with `who`
    // chapter 4: the promise's six piled forepaws; her own two patted down together (the 10s' bedtime
    // tap); little paws scratched in the roof's grit; and the 10s, a cat's two forepaws a group
    // chapter 5: her four paws onto the raft, her claws in the log, the seven forepaws in the mud
    // under the bridge; the answers scratched in the sand; fish (in pairs, or on strings), the
    // raft's logs from underneath, herons scratched in the mud; a dragonet's one forepaw in the
    // water or the reeds; and the 9s, the 10s' group with one claw tucked in
    if (o.kind === 'answers' || (Array.isArray(o.answers) && !o.kind)) return answersPicture(o);
    if (o.paws === 'board') return boardPicture(o, groups, per);
    if (o.paws === 'log') return logPicture(o, groups, per);
    if (o.paws === 'promise' || o.paws === 'pile') return promisePicture(o, groups, per);
    if (o.paws === 'both' || (o.paws === 'own' && (per === 10 || o.both === true))) return bothPawsPicture(o, groups, per);
    if (o.paws === 'own') return ownPawsPicture(o, groups, per);
    if (o.paws === 'mud' || o.kind === 'mud' || o.kind === 'grit') return mudPicture(o, groups, per);
    if (o.kind === 'fish') return fishPicture(o, groups, per);
    if (o.kind === 'bumps') return bumpsPicture(o, groups, per);
    if (o.kind === 'herons') return heronsPicture(o, groups, per);
    // chapter 6: Sleet's roll call (a row of little dragonets, three HEREs over every head), and his
    // one raised forepaw in the long grass
    if (o.kind === 'roll') return rollPicture(o, groups, per);
    // chapter 7: the nights' marks in the sand or the mud (before the 10s' forepaws); the 6s' cheeks
    // close up (a lesson's `kind`, or a skip's `thing: 'whisker'` at per 6; per 6 with neither draws as
    // it always has); her whiskers, one cheek's two rows (`thing: 'whisker'` at per 3, before the 3s'
    // patrols); the back row's empty places (`thing: 'gap'`, before the 1s' tails)
    if (o.kind === 'marks') return marksPicture(o, Math.max(1, groups), per);
    if (per === 6 && (o.kind === 'cheeks' || o.kind === 'cheeks-top' || (!o.kind && o.thing === 'whisker'))) return cheeksPicture(o, clamp(groups, 1, 10));
    if (per === 3 && !o.kind && o.thing === 'whisker') return oneCheekPicture(o, groups);
    if (!o.kind && o.thing === 'gap') return gapsPicture(o, groups);
    // chapter 8: one cat's four paws, a pair at a time (`thing: 'paw'` at per 2, before the 2s' ears),
    // and the field's four (`kind: 'dogs'`: dogs, Hail and cats, four paws each)
    if (per === 2 && !o.kind && o.thing === 'paw' && o.layout !== 'rows') return pawPairsPicture(o);
    if (o.kind === 'dogs') return dogsPicture(o, Math.max(1, groups));
    if (per === 5 && groups === 1 && Array.isArray(o.who) && o.who[0] && o.who[0].who === 'sleet' && o.layout !== 'rows' && o.kind !== 'prey') return sleetPawPicture(o, o.who[0]);
    if (per === 5 && groups === 1 && Array.isArray(o.who) && o.who[0] && (o.who[0].who === 'puddle' || o.who[0].who === 'wisp') && o.layout !== 'rows' && o.kind !== 'prey') return onePawPicture(o, o.who[0]);
    if (per === 5 && o.layout !== 'rows' && o.kind !== 'prey' && Array.isArray(o.who) && o.who.some(function (e) { return e && e.who; })) return whoPawsPicture(o, groups);
    if (o.kind === 'prey') return preyPicture(o, groups, per);
    if (o.layout === 'rows') return thingRows(o, table, groups, per);
    if (per === 10) return tensPicture(o, groups);
    if (per === 9) return tensPicture(o, groups, true);
    var t = per;
    var hl = clamp(intOr(o.highlight, 0), 0, t * groups);
    var TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / Math.max(1, t)) : -1;
    var cols = Math.max(1, Math.min(5, groups)), rows = Math.max(1, Math.ceil(groups / 5));
    var pad = 18, body = '', count = 0;
    // (a patrol's tile is wide enough for its three walkers, all on their own green card: chapter 6)
    var spec = { 1: [176, 128], 2: [176, 170], 3: [236, 128], 4: [176, 150], 5: [150, 150], 10: [250, 150] }[t] || [176, 176];
    var CW = spec[0], CH = spec[1];
    var W = pad * 2 + cols * CW, H = pad * 2 + rows * (CH + TOT);
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / 5), col = gi % 5, inRow = Math.min(5, groups - row * 5);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT), g = '';
      var litAll = hl >= (gi + 1) * t;
      if (gi === nextG) body += nextGlow(x0 + 8, y0 + 4, CW - 16, CH + TOT * 0.5 - 4);
      if (t === 1) {
        // sleepy loaves with their tails up: the tails are what you count
        var c1 = countsChar(o, gi, { tailW: 1.35, scale: 1 }, { pose: 'loaf', mood: 'sleepy', tail: 'flag' }, litAll);
        var lit = count < hl; count++;
        g += '<ellipse cx="100" cy="196" rx="68" ry="9" fill="#3f5a2e" opacity=".14"/>';
        if (lit && c1._marks.tail) {
          g += '<g transform="' + mStr(c1._marks.M) + '"><path d="' + c1._marks.tail + '" fill="' + GLOW + '" stroke="' + GLOW + '" stroke-width="28" stroke-linejoin="round" opacity=".38"/>' +
            '<path d="' + c1._marks.tail + '" fill="none" stroke="' + GLOW2 + '" stroke-width="12" stroke-linejoin="round"/></g>';
        } else if (lit) g += glow(100, 150, 60);
        g += c1.svg;
        if (lit && c1._marks.tailTip) { var tip = apply(c1._marks.M, c1._marks.tailTip); g += sparkle(tip[0] - 2, tip[1] - 12, 9); }
        body += cell(g, x0 - 6, y0 - 62, 0.9);
      } else if (t === 2) {
        var c2 = countsChar(o, gi, null, { pose: 'sit', mood: 'happy' }, litAll);
        g += '<ellipse cx="100" cy="196" rx="54" ry="8" fill="#3f5a2e" opacity=".14"/>';
        var eg = '';
        c2._marks.ears.forEach(function (e) { if (count < hl) eg += glow(e[0], e[1] + 4, 24); count++; });
        g += eg + c2.svg;
        body += cell(g, x0 - 2, y0 - 18, 0.9);
      } else if (t === 3) {
        // a patrol of three
        g += '<rect x="4" y="10" width="' + (CW - 8) + '" height="' + (CH - 16) + '" rx="20" fill="#d6e5c8"/>';
        for (var k3 = 0; k3 < 3; k3++) {
          var c3 = countsChar(o, gi * 3 + k3, null, { pose: 'walk', mood: 'happy' }, count < hl), gg = '';
          if (count < hl) gg += glow(100, 140, 66);
          count++;
          // the three walkers spaced as before, the third ending inside the card (a walker's drawing runs from
          // about 19 to 195 of its 200 box), never on the next patrol's card or the picture's edge
          g += cell(gg + c3.svg, 2 + k3 * 62, 12 + (k3 % 2) * 4, 0.52);
        }
        body += cell(g, x0, y0, 1);
      } else if (t === 4) {
        var c4 = countsChar(o, gi, null, { pose: 'stand', mood: 'happy' }, litAll);
        g += '<ellipse cx="100" cy="196" rx="70" ry="8" fill="#3f5a2e" opacity=".14"/>';
        var pg = '';
        c4._marks.paws.slice(0, 4).sort(function (a, b) { return a[0] - b[0]; }).forEach(function (pp) {
          if (count < hl) pg += glow(pp[0], pp[1], 17);
          count++;
        });
        g += pg + c4.svg;
        body += cell(g, x0 - 2, y0 - 38, 0.9);
      } else if (t === 5 || t === 10) {
        var paws = t === 5 ? 1 : 2;
        for (var pi = 0; pi < paws; pi++) {
          var litN = clamp(hl - count, 0, 5); count += 5;
          g += cell(forepaw(litN), 70 + pi * 110, 84, 1);
        }
        body += cell(g, x0, y0, 1);
      } else {
        // the other tables: a cat and its pebbles, `table` of them, in rows of five
        var c6 = countsChar(o, gi, null, { pose: 'sit', mood: 'kind' }, litAll);
        g += cell(c6.svg, 30, 0, 0.6);
        for (var j = 0; j < t; j++) {
          var px = 24 + (j % 5) * 26, py = 132 + Math.floor(j / 5) * 22;
          if (count < hl) g += glow(px, py, 14);
          count++;
          g += '<ellipse cx="' + px + '" cy="' + py + '" rx="9" ry="7" fill="#a9b3bd" stroke="#5f6a76" stroke-width="2"/><ellipse cx="' + (px - 3) + '" cy="' + (py - 3) + '" rx="3" ry="2" fill="#fff" opacity=".7"/>';
        }
        body += cell(g, x0 + 8, y0, 1);
      }
      count = (gi + 1) * t;
      if (TOT && litAll) body += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * t, !!o.thought);
    }
    var thing = { 1: 'tail', 2: 'ears', 3: 'cats', 4: 'paws', 5: 'claws', 10: 'claws' }[t] || 'pebbles';
    var unit = { 3: 'patrols', 5: 'forepaws', 10: 'pairs of forepaws' }[t] || 'cats';
    var label = groups + ' ' + unit + ', ' + t + ' ' + thing + ' each';
    if (o.thought) return thoughtDoc(W, H, label, body, o.thought, pad + CH - 14);
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>' + body);
  };

  // ----- things in rows: 5 × 2's ears sliding into two rows of five (the left ears, then the right ears)

  function thingRows(o, table, groups, per) {
    var hl = clamp(intOr(o.highlight, 0), 0, groups * per);
    var TW = 74, TH = 92, gap5 = 26, padX = 30, padY = 22, rowGap = 12, TOT = o.totals ? 84 : 0;
    var rowW = per * TW + Math.floor((per - 1) / 5) * gap5;
    var W = padX * 2 + rowW + TOT, H = padY * 2 + groups * TH + (groups - 1) * rowGap, body = '';
    var nextR = o.next ? Math.floor(hl / per) : -1;
    function furOf(j) {
      var e = o.who && o.who[j];
      if (e && (e.who === 'riffle' || e.who === 'otter' || e.who === 'dog')) { var bs = beastSpec(e.who, e); return { sp: { pal: bs.pal }, beast: true }; }
      if (e && e.who) {
        return { sp: resolve(whoSpec(o, e)) };
      }
      return { sp: countsCat(j) };
    }
    for (var r = 0; r < groups; r++) {
      var yc = padY + r * (TH + rowGap) + TH / 2;
      if (r === nextR) body += nextGlow(padX - 12, yc - TH / 2 - 4, rowW + 24, TH + 8);
      for (var j = 0; j < per; j++) {
        var idx = r * per + j, lit = idx < hl;
        var xc = padX + j * TW + Math.floor(j / 5) * gap5 + TW / 2;
        if (lit) body += glow(xc, yc, 36);
        if (table === 2) {
          // an ear, in the colour of the cat it came from: the left ears in the first row, the right ears in the second
          var f = furOf(j), side = r % 2 ? 1 : -1, pal = f.sp.pal;
          var col = f.beast ? (pal.earFill || pal.base) : earColor(f.sp, side);
          body += '<g transform="translate(' + N(xc) + ',' + N(yc + 34) + ') rotate(' + (side * 12) + ') scale(' + (side * 2.15) + ',2.15)">' +
            '<path d="' + EAR + '" fill="' + col + '" stroke="' + pal.line + '" stroke-width="1.3" stroke-linejoin="round"/><path d="' + EAR_IN + '" fill="' + (pal.earIn || '#f4a5b4') + '"/></g>';
        } else {
          body += '<ellipse cx="' + N(xc) + '" cy="' + N(yc) + '" rx="22" ry="17" fill="#a9b3bd" stroke="#5f6a76" stroke-width="3"/><ellipse cx="' + N(xc - 7) + '" cy="' + N(yc - 6) + '" rx="7" ry="4.5" fill="#fff" opacity=".7"/>';
        }
      }
      if (TOT && hl >= (r + 1) * per) body += totalNum(padX + rowW + TOT / 2 + 6, yc + 13, (r + 1) * per, !!o.thought);
    }
    var thing = { 1: 'tails', 2: 'ears', 4: 'paws', 5: 'claws', 10: 'claws' }[table] || 'pebbles';
    var label = groups + ' rows of ' + per + ' ' + thing;
    if (o.thought) return thoughtDoc(W, H, label, body, o.thought);
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>' + body);
  }

  // ----- prey: the pile in stacks (or rows); every piece drawn by PC.art.prey, the pile set's prey

  // Our own soft prey, for when PC.art.prey isn't there: a mouse, a vole (the pile's), or a silver
  // fish (the otters', never in the pile). Eyes shut, tails tucked in, no blood. In its own box,
  // resting on the bottom centre.
  function preyFallback(q) {
    q = q || {};
    var kind = q.kind === 'vole' || q.kind === 'fish' ? q.kind : 'mouse', lit = !!q.lit, s = '', gl = '', w, h;
    if (kind === 'fish') {
      w = 86; h = 38;
      var c = { body: '#c3ced7', back: '#7e8f9c', belly: '#eef3f6', line: '#55626d' };
      if (lit) gl = '<ellipse cx="44" cy="20" rx="50" ry="25" fill="' + GLOW + '" opacity=".45"/><ellipse cx="44" cy="20" rx="34" ry="15" fill="' + GLOW2 + '" opacity=".7"/>';
      s += '<path d="M20,20L3,7Q8,20 3,33Z" fill="' + c.back + '" stroke="' + c.line + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M44,9Q52,0 61,8Z" fill="' + c.back + '" stroke="' + c.line + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="' + crClosed([[17, 20], [30, 10], [52, 7], [72, 11], [84, 20], [72, 28], [52, 32], [30, 30]]) + '" fill="' + c.body + '" stroke="' + c.line + '" stroke-width="2.2"/>' +
        '<path d="M24,17Q48,6 80,16Q52,12 24,17Z" fill="' + c.back + '" opacity=".7"/><path d="M28,25Q52,33 76,24Q52,29 28,25Z" fill="' + c.belly + '"/>' +
        '<path d="M60,12Q56,20 60,28" stroke="' + c.line + '" stroke-width="1.6" fill="none" opacity=".7"/>' +
        '<path d="M67,16Q70,19 73,16" stroke="' + c.line + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<path d="M34,15q4,-3 8,0M42,15q4,-3 8,0M38,21q4,-3 8,0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/>';
    } else {
      var vole = kind === 'vole';
      w = vole ? 66 : 72; h = 44;
      var m = vole ? { body: '#8f603d', line: '#4b301c', light: '#c4946a', ear: '#7a5033' } : { body: '#a68d79', line: '#5e4a3b', light: '#dccbb9', ear: '#a68d79' };
      var body = vole ? [[6, 28], [10, 15], [24, 8], [42, 8], [55, 14], [63, 24], [62, 32], [50, 39], [28, 41], [10, 38]] :
        [[6, 30], [11, 17], [26, 11], [44, 11], [56, 15], [67, 23], [70, 30], [64, 35], [50, 40], [30, 42], [11, 40]];
      var nx = vole ? 62 : 70, ny = vole ? 28 : 30;
      if (lit) gl = '<ellipse cx="' + N(w / 2) + '" cy="27" rx="' + N(w * 0.6) + '" ry="26" fill="' + GLOW + '" opacity=".45"/><ellipse cx="' + N(w / 2) + '" cy="27" rx="' + N(w * 0.42) + '" ry="16" fill="' + GLOW2 + '" opacity=".7"/>';
      s += '<path d="M9,35C0,41 12,47 30,43" stroke="#d99aa0" stroke-width="' + (vole ? 2.4 : 2.8) + '" fill="none" stroke-linecap="round"/>' +
        '<path d="' + crClosed(body) + '" fill="' + m.body + '" stroke="' + m.line + '" stroke-width="2.2"/>' +
        '<ellipse cx="34" cy="36" rx="20" ry="4.5" fill="' + m.light + '" opacity=".55"/>' +
        '<ellipse cx="26" cy="17" rx="13" ry="4" fill="' + m.light + '" opacity=".4"/>' +
        '<circle cx="' + (vole ? 46 : 49) + '" cy="' + (vole ? 13 : 14) + '" r="' + (vole ? 4.6 : 7.6) + '" fill="' + m.ear + '" stroke="' + m.line + '" stroke-width="1.8"/>' +
        (vole ? '' : '<circle cx="49" cy="14.5" r="4" fill="#f2a7b0"/>') +
        '<path d="M' + (nx - 13) + ',' + (ny - 6) + 'Q' + (nx - 10) + ',' + (ny - 3) + ' ' + (nx - 7) + ',' + (ny - 6) + '" stroke="' + m.line + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<circle cx="' + nx + '" cy="' + ny + '" r="2.4" fill="#e98f9b"/>' +
        '<path d="M' + (nx - 4) + ',' + (ny + 2) + 'l-9,3M' + (nx - 4) + ',' + (ny + 3) + 'l-8,6" stroke="' + m.line + '" stroke-width="1" opacity=".5"/>';
    }
    var sp = lit ? sparkle(w * 0.78, 6, 8) : '';
    var inner = q.part === 'glow' ? gl : q.part === 'body' ? s : q.part === 'spark' ? sp : gl + s + sp;
    if (q.facing === 'left') inner = '<g transform="translate(' + w + ',0) scale(-1,1)">' + inner + '</g>';
    return { svg: inner ? '<g>' + inner + '</g>' : '', w: w, h: h, kind: kind };
  }
  art.preyFallback = preyFallback;

  // Which prey sits at column c, level l (0 = the bottom of its stack): mice and voles only, as the
  // text says (the Clan doesn't fish; PC.art.prey's fish kind is the otters'). The same place always
  // holds the same piece, so 8 stacks of 2 and 2 rows of 8 show the same pile.
  function preyKind(c, l) { return (c + l) % 2 ? 'vole' : 'mouse'; }

  function preyPicture(o, groups, per) {
    var rows = o.layout === 'rows', hl = clamp(intOr(o.highlight, 0), 0, groups * per);
    var fn = typeof art.prey === 'function' ? art.prey : preyFallback;
    var PW = 84, PH = 50, STEP = 40, dark = !!o.thought, body = '', halos = '', sparks = '', under = '', totals = '';
    // one piece, in three layers (every halo behind every body, every sparkle on top), as the pile set stacks them
    function layer(f, q0, part) {
      var q = null, a = {}, k;
      for (k in q0) a[k] = q0[k];
      a.part = part;
      try { q = f(a); } catch (e) { q = null; }
      return q && typeof q.svg === 'string' && q.w > 0 && q.h > 0 ? q : null;
    }
    function piece(cx, base, c, l, lit) {
      var q0 = { kind: preyKind(c, l), lit: lit, seed: c * 10 + l + 1, facing: l % 2 ? 'left' : 'right' }, f = fn;
      var b = layer(f, q0, 'body');
      if (!b || !b.svg) { f = preyFallback; b = layer(f, q0, 'body'); }
      var k = Math.min(PW / b.w, PH / b.h), at = 'translate(' + N(cx - b.w * k / 2) + ',' + N(base - b.h * k) + ') scale(' + N(k) + ')';
      var put = function (q) {
        var svg = q && q.svg ? q.svg : '';
        if (/^\s*<svg/.test(svg)) svg = svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
        return svg ? '<g transform="' + at + '">' + svg + '</g>' : '';
      };
      if (lit) { halos += put(layer(f, q0, 'glow')); sparks += put(layer(f, q0, 'spark')); }
      return put(b);
    }
    var W, H, pad = 24, TOT, label, groundAt;
    if (!rows) {
      // `groups` stacks of `per`, at most five stacks to a row; each stack counted top to bottom
      TOT = o.totals ? 48 : 0;
      var SW = PW + 26, SH = (per - 1) * STEP + PH, cols = Math.max(1, Math.min(5, groups)), nrow = Math.max(1, Math.ceil(groups / 5));
      var CH = SH + 22 + TOT;
      W = pad * 2 + cols * SW; H = pad * 2 + nrow * CH;
      var nextS = o.next ? Math.floor(hl / per) : -1;
      for (var gi = 0; gi < groups; gi++) {
        var row = Math.floor(gi / 5), col = gi % 5, inRow = Math.min(5, groups - row * 5);
        var cx = pad + (W - pad * 2 - inRow * SW) / 2 + col * SW + SW / 2, top = pad + row * CH, base = top + SH + 6;
        if (gi === nextS) under += nextGlow(cx - SW / 2 + 4, top - 8, SW - 8, SH + 26);
        under += '<ellipse cx="' + N(cx) + '" cy="' + N(base - 2) + '" rx="' + N(PW * 0.52) + '" ry="7" fill="' + (dark ? '#1c1424' : '#6b4f33') + '" opacity="' + (dark ? '.45' : '.2') + '"/>';
        for (var l = 0; l < per; l++) {
          var j = per - 1 - l;   // counted from the top
          body += piece(cx, base - l * STEP, gi, l, gi * per + j < hl);
        }
        if (TOT && hl >= (gi + 1) * per) totals += totalNum(cx, base + 40, (gi + 1) * per, dark);
      }
      label = groups + (groups === 1 ? ' stack' : ' stacks') + ' of ' + per + ' prey';
      groundAt = pad + SH - 4;
    } else {
      // `groups` rows of `per`, one above another like the pile's top and bottom layers; the top row first
      TOT = o.totals ? 84 : 0;
      var CW2 = PW + 12, gap5 = 22, rowW = per * CW2 + Math.floor((per - 1) / 5) * gap5, RH = STEP + 8;
      W = pad * 2 + rowW + TOT; H = pad * 2 + (groups - 1) * RH + PH + 14;
      var nextR = o.next ? Math.floor(hl / per) : -1, bottom = pad + (groups - 1) * RH + PH + 4;
      for (var c = 0; c < per; c++) {
        var sx2 = pad + c * CW2 + Math.floor(c / 5) * gap5 + CW2 / 2;
        under += '<ellipse cx="' + N(sx2) + '" cy="' + N(bottom - 2) + '" rx="' + N(PW * 0.5) + '" ry="7" fill="' + (dark ? '#1c1424' : '#6b4f33') + '" opacity="' + (dark ? '.45' : '.2') + '"/>';
      }
      if (nextR >= 0 && nextR < groups) under += nextGlow(pad - 10, pad + nextR * RH - 6, rowW + 20, PH + 12);
      // the bottom row first, so the rows above sit on it
      for (var r = groups - 1; r >= 0; r--) {
        var baseR = pad + r * RH + PH, lvl = groups - 1 - r;
        for (var c2 = 0; c2 < per; c2++) {
          var xr = pad + c2 * CW2 + Math.floor(c2 / 5) * gap5 + CW2 / 2;
          body += piece(xr, baseR, c2, lvl, r * per + c2 < hl);
        }
        if (TOT && hl >= (r + 1) * per) totals += totalNum(pad + rowW + TOT / 2 + 4, baseR - PH / 2 + 13, (r + 1) * per, dark);
      }
      label = groups + (groups === 1 ? ' row' : ' rows') + ' of ' + per + ' prey';
      groundAt = pad + PH - 6;
    }
    body = under + halos + body + sparks + totals;
    if (o.thought) return thoughtDoc(W, H, label, body, o.thought, groundAt);
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#efe4cb" stroke="#d6c29c" stroke-width="3"/>' + body);
  }

  // ------------------------------------------------------------------ public: sand tallies

  // Sand (or, `ground: 'earth'`, the earth beside the prey pile). `groups` clusters of `per`
  // scratches, lit in order; or, `layout: 'rows'`, `groups` rows of `per` lit a column at a time,
  // top and bottom together (two rows of eight: 2, 4 … 16, as the check's help counts them).
  var GROUNDS = {
    sand: { patch: '#efd6a2', edge: '#cfae72', dots: '#d3b57c', box: '#e3c68c', groove: '#9c7440', shine: '#fbecc8', word: 'sand' },
    earth: { patch: '#a27a55', edge: '#7a5638', dots: '#7a5638', box: '#8f6a48', groove: '#4e3524', shine: '#c9a27a', word: 'earth' },
    // chapter 3: the mud under the Old Bridge, where Sprinkle swipes
    mud: { patch: MUD.patch, edge: MUD.edge, dots: MUD.dots, box: MUD.box, groove: MUD.groove, shine: MUD.shine, word: 'mud' },
    // chapter 4: the pale grit of the tower roof, where Squall swipes
    grit: { patch: GRIT.patch, edge: GRIT.edge, dots: GRIT.dots, box: GRIT.box, groove: GRIT.groove, shine: GRIT.shine, word: 'grit' },
    // chapter 5: a log of the otters' raft, where Riffle has her scratch out his fish with one claw
    // (the marks pale where the wood is cut, as a claw leaves them)
    log: { patch: '#b78b5a', edge: '#6f4d2a', dots: '#9c7446', box: '#a67a4b', groove: '#4d3219', shine: '#f0d6a6', word: 'log', log: true }
  };
  // The patch the scratches are in: a soft wobbly blob of sand, earth, mud or grit; for the raft's
  // log, a length of the log itself, bark along both edges and the grain running with it.
  function groundPatch(G, W, H, edge) {
    if (!G.log) return '<path d="' + crClosed(edge) + '" fill="' + G.patch + '" stroke="' + G.edge + '" stroke-width="3"/>';
    var s = '<rect x="3" y="8" width="' + N(W - 6) + '" height="' + N(H - 16) + '" rx="' + N(Math.min(46, (H - 16) / 2)) + '" fill="' + G.patch + '" stroke="' + G.edge + '" stroke-width="3.4"/>' +
      '<path d="M34,17H' + N(W - 34) + '" stroke="#d2ab78" stroke-width="5" stroke-linecap="round" opacity=".75"/><path d="M34,' + N(H - 17) + 'H' + N(W - 34) + '" stroke="#8f683f" stroke-width="5" stroke-linecap="round" opacity=".75"/>', g = '';
    for (var i = 0; i < Math.max(3, Math.round(W * H / 16000)); i++) {
      var gx = 24 + rand(i * 7 + 3) * (W - 150), gy = 26 + rand(i * 11 + 5) * (H - 52), gl = 50 + rand(i * 3 + 1) * 70;
      g += 'M' + N(gx) + ',' + N(gy) + 'q' + N(gl / 2) + ',' + (i % 2 ? '-3' : '3') + ' ' + N(gl) + ',0';
    }
    return s + '<path d="' + g + '" stroke="' + G.dots + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/>';
  }
  art.sand = function (opts) {
    var o = opts || {};
    // chapter 5: answers scratched in the sand (`answers: [18, 36]`: the picture of "Every nines answer hides a nine!")
    if (o.kind === 'answers' || Array.isArray(o.answers)) return answersPicture(o);
    var groups = clamp(intOr(o.groups, 1), 0, 20), per = clamp(intOr(o.per, 1), 1, 10);
    var counted = clamp(intOr(o.counted, 0), 0, groups * per);
    var G = GROUNDS[o.ground] || GROUNDS.sand, rows = o.layout === 'rows';
    var SP = 17, LEN = 40, gap = 16, pad = 26, gap5 = 12, W, H, boxes = [], spots = [];
    // chapter 5, the nines' help: pairs of swipes hopped by tens, then one line in each pair rubbed
    // out, a cat at a time, the count stepping back by ones (4 x 9: 10, 20, 30, 40; 39, 38, 37, 36).
    // `rubbed: n` (or `tucked`, or `tuck: n`) rubs the last line out of the first n pairs; `tuck:
    // true` reads n from `counted`, the lines still standing. Every line left standing is lit.
    if (o.style === 'swipe' && !rows && o.pair && (o.rubbed != null || o.tucked != null || o.tuck != null)) {
      var lines = groups * Math.max(1, Math.round(per / 2)) * 2, rawC = clamp(intOr(o.counted, 0), 0, lines);
      var rub = o.rubbed != null ? intOr(o.rubbed, 0) : o.tucked != null ? intOr(o.tucked, 0) : o.tuck === true ? lines - rawC : intOr(o.tuck, 0);
      rub = clamp(rub, 0, groups);
      return pairSwipes(G, groups, per, rub ? lines : rawC, rub);
    }
    if (o.style === 'swipe' && !rows) return o.pair ? pairSwipes(G, groups, per, counted) : swipes(G, groups, per, counted);
    // chapter 4: a help that hops by the row (`step` equal to `per`: the pile's rows of ten, 10 · 20 ·
    // 30) lights a whole row at a time; any other step keeps the column at a time (two rows of eight)
    var byRow = rows && per > 1 && intOr(o.step, 0) === per;
    if (rows) {
      // one long row per group, a little gap after every five
      var rw = per * SP + Math.floor((per - 1) / 5) * gap5 + 26, rh = LEN + 18;
      W = pad * 2 + rw; H = pad * 2 + Math.max(1, groups) * rh + (Math.max(1, groups) - 1) * gap;
      for (var r = 0; r < groups; r++) {
        var ry0 = pad + r * (rh + gap);
        boxes.push([pad, ry0, rw, rh]);
        // column by column: the scratch in row r, column j is counted (j * groups + r)th
        for (var jr = 0; jr < per; jr++) spots.push([pad + 13 + SP / 2 + jr * SP + Math.floor(jr / 5) * gap5, ry0 + 9, byRow ? r * per + jr : jr * groups + r, r]);
      }
    } else {
      // (chapter 7: six to a group are two short rows of three, one above the other, the top row lit
      // first, "six is two threes"; every other `per` as before, rows of five)
      // (chapter 8: four to a group are two and two, a pair, a gap and a pair, "a four is two twos")
      var perRow = per === 6 ? 3 : Math.min(per, 5), subRows = Math.ceil(per / perRow), PG4 = per === 4 ? 16 : 0;
      var cw = perRow * SP + 26 + PG4, ch = subRows * (LEN + 12) + 18;
      var cols = Math.max(1, Math.min(5, groups)), nrows = Math.max(1, Math.ceil(groups / 5)), idx = 0;
      W = pad * 2 + cols * cw + (cols - 1) * gap; H = pad * 2 + nrows * ch + (nrows - 1) * gap;
      for (var g = 0; g < groups; g++) {
        var row = Math.floor(g / 5), col = g % 5, inRow = Math.min(5, groups - row * 5);
        var x0 = (W - (inRow * cw + (inRow - 1) * gap)) / 2 + col * (cw + gap), y0 = pad + row * (ch + gap);
        boxes.push([x0, y0, cw, ch]);
        for (var j = 0; j < per; j++) spots.push([x0 + 13 + SP / 2 + (j % perRow) * SP + (PG4 && j % perRow >= 2 ? PG4 : 0), y0 + 12 + Math.floor(j / perRow) * (LEN + 12), idx++, g]);
      }
    }
    // the patch, a soft wobbly blob
    var edge = [], n = 28;
    for (var i = 0; i < n; i++) {
      // a squircle, so the corner clusters still sit on it
      var a = Math.PI * 2 * i / n, k = 0.97 + 0.03 * rand(i * 3 + 1), c = Math.cos(a), sn = Math.sin(a);
      edge.push([W / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.42) * (W / 2 - 5) * k,
        H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * k]);
    }
    var s = groundPatch(G, W, H, edge);
    var dots = '';
    for (var d = 0; d < Math.round(W * H / 900); d++) {
      var dx = W / 2 + (rand(d * 5 + 2) - 0.5) * (W - 60), dy = H / 2 + (rand(d * 5 + 3) - 0.5) * (H - 40);
      dots += '<circle cx="' + N(dx) + '" cy="' + N(dy) + '" r="' + N(0.8 + rand(d) * 1.4) + '"/>';
    }
    if (!G.log) s += '<g fill="' + G.dots + '" opacity=".7">' + dots + '</g>';
    // each group's box, then its scratches
    spots.forEach(function (q, si) {
      var b = boxes[q[3]];
      if (!si || spots[si - 1][3] !== q[3]) s += '<rect x="' + N(b[0]) + '" y="' + N(b[1]) + '" width="' + N(b[2]) + '" height="' + N(b[3]) + '" rx="18" fill="' + G.box + '" opacity=".55"/>';
      var sx = q[0], sy = q[1], lit = q[2] < counted;
      var d1 = 'M' + N(sx + 4) + ',' + N(sy) + 'Q' + N(sx + 1) + ',' + N(sy + LEN / 2) + ' ' + N(sx - 4) + ',' + N(sy + LEN);
      if (lit) s += '<path d="' + d1 + '" stroke="#ffd25e" stroke-width="13" stroke-linecap="round" fill="none" opacity=".55"/>';
      s += '<path d="' + d1 + '" stroke="' + (lit ? '#e39a12' : G.groove) + '" stroke-width="4.6" stroke-linecap="round" fill="none"/>' +
        '<path d="' + d1 + '" transform="translate(1.8,0)" stroke="' + (lit ? '#fff4c2' : G.shine) + '" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".9"/>';
    });
    var label = rows ? groups + (groups === 1 ? ' row' : ' rows') + ' of ' + per + ' scratches in the ' + G.word : groups + ' groups of ' + per + ' scratches in the ' + G.word + (PG4 ? ', two and two' : '');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + ' ' + N(H) + '" role="img" aria-label="' + label + '">' + s + '</svg>';
  };

  // Chapter 3's claw swipes: one swipe a group, `per` short parallel claw lines raked slantwise
  // (five for the 5s), lit a line at a time (a swipe at a time when the help hops by fives).
  function swipes(G, groups, per, counted) {
    var SP = 13, LEN = 54, gap = 16, pad = 26, cw = per * SP + 52, ch = LEN + 36;
    var cols = Math.max(1, Math.min(5, groups)), nrows = Math.max(1, Math.ceil(groups / 5)), s = '', idx = 0;
    var W = pad * 2 + cols * cw + (cols - 1) * gap, H = pad * 2 + nrows * ch + (nrows - 1) * gap;
    var edge = [], n = 28;
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n, k = 0.97 + 0.03 * rand(i * 3 + 1), c = Math.cos(a), sn = Math.sin(a);
      edge.push([W / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.42) * (W / 2 - 5) * k, H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * k]);
    }
    s += groundPatch(G, W, H, edge);
    var dots = '';
    for (var d = 0; d < Math.round(W * H / 900); d++) dots += '<circle cx="' + N(W / 2 + (rand(d * 5 + 2) - 0.5) * (W - 60)) + '" cy="' + N(H / 2 + (rand(d * 5 + 3) - 0.5) * (H - 40)) + '" r="' + N(0.8 + rand(d) * 1.4) + '"/>';
    if (!G.log) s += '<g fill="' + G.dots + '" opacity=".7">' + dots + '</g>';
    for (var g = 0; g < groups; g++) {
      var row = Math.floor(g / 5), col = g % 5, inRow = Math.min(5, groups - row * 5);
      var x0 = (W - (inRow * cw + (inRow - 1) * gap)) / 2 + col * (cw + gap), y0 = pad + row * (ch + gap);
      s += '<rect x="' + N(x0) + '" y="' + N(y0) + '" width="' + N(cw) + '" height="' + N(ch) + '" rx="18" fill="' + G.box + '" opacity=".55"/>';
      for (var j = 0; j < per; j++) {
        // a claw line: slanting down to the right, a little curved, every line of a swipe alike
        var sx = x0 + 24 + j * SP, sy = y0 + 16, lit = idx++ < counted;
        var d1 = 'M' + N(sx) + ',' + N(sy) + 'Q' + N(sx + 12) + ',' + N(sy + LEN * 0.45) + ' ' + N(sx + 20) + ',' + N(sy + LEN);
        if (lit) s += '<path d="' + d1 + '" stroke="#ffd25e" stroke-width="12" stroke-linecap="round" fill="none" opacity=".55"/>';
        s += '<path class="pc-swipe" d="' + d1 + '" stroke="' + (lit ? '#e39a12' : G.groove) + '" stroke-width="4.6" stroke-linecap="round" fill="none"/>' +
          '<path d="' + d1 + '" transform="translate(1.8,0)" stroke="' + (lit ? '#fff4c2' : G.shine) + '" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".9"/>';
      }
    }
    var label = groups + (groups === 1 ? ' swipe' : ' swipes') + ' of ' + per + ' claw lines in the ' + G.word;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + ' ' + N(H) + '" role="img" aria-label="' + label + '">' + s + '</svg>';
  }

  // Chapter 4's tens (`style: 'swipe'` with `pair: true`): two swipes a group, a cat's two forepaws,
  // `per / 2` claw lines a swipe (five for the 10s), a pair to a box and never split across rows, lit a
  // line at a time (a pair at a time when the help hops by tens). Two, three or four pairs to a row:
  // whichever draws the lines biggest in a 16:10 panel (seven to ten pairs come out three to a row:
  // nine as 3, 3, 3 and ten as 3, 3, 3 and 1; up to six, two to a row).
  function pairSwipes(G, groups, per, counted, rubbed) {
    var half = Math.max(1, Math.round(per / 2)), SP = 13, LEN = 54, gap = 16, pad = 26, edge0 = 16;
    rubbed = rubbed || 0;
    var sw = (half - 1) * SP + 20, cw = sw * 2 + edge0 * 3, ch = LEN + 36, perRow = 2, best = 0;
    var fit = [2, 3, 4].map(function (pr) {
      var c = Math.max(1, Math.min(pr, groups)), r = Math.max(1, Math.ceil(groups / pr));
      var k = Math.min(1600 / (pad * 2 + c * cw + (c - 1) * gap), 1000 / (pad * 2 + r * ch + (r - 1) * gap));
      best = Math.max(best, k);
      return [pr, k];
    });
    // the most pairs to a row that still draws them nearly as big as the best fit (fewer rows to read)
    fit.forEach(function (f) { if (f[1] >= best * 0.88) perRow = f[0]; });
    var cols = Math.max(1, Math.min(perRow, groups)), nrows = Math.max(1, Math.ceil(groups / perRow)), s = '', idx = 0;
    var W = pad * 2 + cols * cw + (cols - 1) * gap, H = pad * 2 + nrows * ch + (nrows - 1) * gap;
    var edge = [], n = 28;
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n, k2 = 0.97 + 0.03 * rand(i * 3 + 1), c2 = Math.cos(a), sn = Math.sin(a);
      edge.push([W / 2 + (c2 < 0 ? -1 : 1) * Math.pow(Math.abs(c2), 0.42) * (W / 2 - 5) * k2, H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * k2]);
    }
    s += groundPatch(G, W, H, edge);
    var dots = '';
    for (var d = 0; d < Math.round(W * H / 900); d++) dots += '<circle cx="' + N(W / 2 + (rand(d * 5 + 2) - 0.5) * (W - 60)) + '" cy="' + N(H / 2 + (rand(d * 5 + 3) - 0.5) * (H - 40)) + '" r="' + N(0.8 + rand(d) * 1.4) + '"/>';
    if (!G.log) s += '<g fill="' + G.dots + '" opacity=".7">' + dots + '</g>';
    for (var g = 0; g < groups; g++) {
      var row = Math.floor(g / perRow), col = g % perRow, inRow = Math.min(perRow, groups - row * perRow);
      var x0 = (W - (inRow * cw + (inRow - 1) * gap)) / 2 + col * (cw + gap), y0 = pad + row * (ch + gap);
      s += '<rect class="pc-pairbox" x="' + N(x0) + '" y="' + N(y0) + '" width="' + N(cw) + '" height="' + N(ch) + '" rx="18" fill="' + G.box + '" opacity=".55"/>';
      for (var j = 0; j < half * 2; j++) {
        // the same claw line as a single swipe's: slanting down to the right, a little curved
        var sx = x0 + edge0 + (j < half ? j * SP : sw + edge0 + (j - half) * SP), sy = y0 + 16, gone = g < rubbed && j === half * 2 - 1, lit = !gone && idx++ < counted;
        var d1 = 'M' + N(sx) + ',' + N(sy) + 'Q' + N(sx + 12) + ',' + N(sy + LEN * 0.45) + ' ' + N(sx + 20) + ',' + N(sy + LEN);
        if (gone) {
          // one line rubbed out with a paw: a smear where it was, the ghost of the groove under it
          s += '<path class="pc-rubbed" d="' + d1 + '" stroke="' + G.patch + '" stroke-width="13" stroke-linecap="round" fill="none"/>' +
            '<path d="' + d1 + '" stroke="' + G.groove + '" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1.5 8" fill="none" opacity=".4"/>' +
            '<path d="M' + N(sx - 3) + ',' + N(sy + LEN * 0.3) + 'q11,5 20,0M' + N(sx + 3) + ',' + N(sy + LEN * 0.62) + 'q11,5 20,0" stroke="' + G.shine + '" stroke-width="2" stroke-linecap="round" fill="none" opacity=".7"/>';
          continue;
        }
        if (lit) s += '<path d="' + d1 + '" stroke="#ffd25e" stroke-width="12" stroke-linecap="round" fill="none" opacity=".55"/>';
        s += '<path class="pc-swipe" d="' + d1 + '" stroke="' + (lit ? '#e39a12' : G.groove) + '" stroke-width="4.6" stroke-linecap="round" fill="none"/>' +
          '<path d="' + d1 + '" transform="translate(1.8,0)" stroke="' + (lit ? '#fff4c2' : G.shine) + '" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".9"/>';
      }
    }
    var label = groups + (groups === 1 ? ' pair' : ' pairs') + ' of swipes, ' + half + ' claw lines a swipe, in the ' + G.word;
    if (rubbed) label += ': one line rubbed out of ' + (rubbed === groups ? 'every pair' : rubbed + (rubbed === 1 ? ' pair' : ' pairs'));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + ' ' + N(H) + '" role="img" aria-label="' + label + '">' + s + '</svg>';
  }

  // ------------------------------------------------------------------ vocabulary

  // Drawings face right before any flip. character() also honours opts.facing itself (mirroring the
  // drawing while keeping one-sided details, like Tallyheart's torn left ear, on the correct side).
  art.characterFacing = 'right';

  var vocab = art.vocab || (art.vocab = {});
  vocab.cast = CAST_IDS.slice();
  vocab.poses = CAT_POSES.slice();
  vocab.moods = MOODS.slice();
  vocab.looks = { fur: LOOKS.fur.slice(), marking: LOOKS.marking.slice(), eyes: LOOKS.eyes.slice() };
  vocab.otherPoses = { sparrow: OTHER_POSES.sparrow.slice(), moth: OTHER_POSES.moth.slice(), tallone: OTHER_POSES.tallone.slice(),
    riffle: OTTER_POSES.slice(), otter: OTTER_POSES.slice(), dog: DOG_POSES.slice(), sprinkle: SPRINKLE_POSES.slice(),
    reynard: FOX_POSES.slice(), squall: SQUALL_POSES.slice(),
    patience: HERON_POSES.slice(), puddle: PUDDLE_POSES.slice(), wisp: WISP_POSES.slice(),
    coil: COIL_POSES.slice(), sleet: SLEET_POSES.slice(),
    hail: HAIL_POSES.slice(), snip: WEASEL_POSES.slice(), snatch: WEASEL_POSES.slice() };
  // chapter 5: the cast extras by name (a cast entry's own keys; `scenes.js` passes them through),
  // with the values each takes, for the gallery and the tools
  // (chapter 6: holds pinecone, pebbles and string; taps paw, ears, pinecone, pebbles, cheeks, stone
  // and eyes; `starry` on any cat; Sleet's `grass`)
  // (chapter 7: taps fish, Riffle's string, and mist, Sprinkle's burp; earlier ids never move)
  // (chapter 7 also: `asleep: 'half'`, half asleep, after chapter 5's `true`)
  // (chapter 8: taps tail, a raised tail's tip, and leaf, her leaf or the glass on it; holds leaf, glass
  // and mouse, Snatch's; `tailUp` on a cat or Riffle, after the rest)
  vocab.extras = { tuck: [true], asleep: [true, 'half'], snail: [true, 'in'], buzz: [true], dragonfly: [true], glow: [true],
    tap: ['nose', 'pole', 'paw', 'ears', 'pinecone', 'pebbles', 'cheeks', 'stone', 'eyes', 'fish', 'mist', 'tail', 'leaf'],
    holds: ['stone', 'pebble', 'vole', 'bark', 'fish', 'fish2', 'pole', 'pinecone', 'pebbles', 'string', 'leaf', 'glass', 'mouse'], reach: [true], starry: [true], grass: [true],
    tailUp: [true] };
  vocab.clanVariants = [1, 2, 3, 4, 5, 6];
  // who takes a `variant`, and which: clancat 1-6 (coats), otter 1-3 (1 the old ferry otter), dog 1-3 (1 shaggy, 2 spotty, 3 tiny),
  // reedclan 1-4 (1 the ReedClan she-cat, 2 the young ReedClan tom, 3 and 4 two more marsh coats)
  vocab.variants = { clancat: [1, 2, 3, 4, 5, 6], otter: [1, 2, 3], dog: [1, 2, 3], reedclan: [1, 2, 3, 4] };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
