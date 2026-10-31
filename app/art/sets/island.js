/* Potomac Crossing · app/art/sets/island.js
 *
 * The set: Gathering Island (chapter 10, "The Gathering"; docs/chapters/10-the-gathering.spec.md, section 4, "The new
 * set, island"). A round island in the river, its shore of pebbles and soft mud, and in the middle one great tree,
 * very old and wide-crowned (never named), its huge roots running out across a clearing of short moonlit grass.
 * Always at night under the full moon, high (`todFixed`: there is no `moon` option, and any hour a frame names draws
 * the same night), bright silver and NEVER dark: the grass silver-green, the bark silver-grey, the water silver-blue,
 * the sky a clear moonlit blue. The three leaders sit on three big roots, never in the branches. The crowd of every
 * Clan sits round the clearing (the kit's crowd: K.crowd, scenes.js). Nothing is frightening: the mist is soft and
 * silver with the moon glowing through it; the grown Mistscales are gentle soft shapes in it, with no faces; the
 * badger's print is old and dry, never fresh, never with the animal.
 *
 * Eight cameras, each a composition of its own in the 1600 x 1000 world, with its own anchors:
 *   shore  the island's shore: the river silver at the left, the water's edge, soft mud and pebbles, the slope
 *          rising to the right to the clearing's edge, the great tree's crown up at the right. Anchors `land-1`,
 *          `land-2`, `land-3` (stepping off onto the shore, up the slope, facing right), `raft` (at the Moon Ferry's
 *          front, at the water's edge), `drag` (on the mud beside the luggage), `print` (on the mud beside the print,
 *          facing it).
 *   wide   the clearing under the great tree: the trunk at the middle back, its three big roots running out, the
 *          crowd in a wide ring (CrystalClan at the left, ReedClan at the right, GroveClan at the back, a few
 *          otters by the water), the river at the far right edge. Anchors `root-1`, `root-2`, `root-3` (on the three
 *          roots, left to right, a little bigger), `crowd-1` ... `crowd-6` (the ring's front: the left three
 *          CrystalClan's, the right three ReedClan's), `elder` (the ring's back left, in front of the roots),
 *          `centre`, `beside`, `edge`, `edge-2`, `edge-3` (the river edge, right, facing left), `bank` (at the
 *          water, right, in front of `edge`), `luggage` (at the clearing's left edge, where the reed heap is).
 *          DEPTH: every root lies further up the panel (a smaller y) than every crowd-* spot and the elder, so a
 *          leader is always the farther of two cats of the same Clan: back to front lists the leader first.
 *   roots  closer on the three roots, the trunk's bark behind, moonlight through the crown. Anchors `root-1`,
 *          `root-2`, `root-3`, `step` (below root-2), `near-1`, `near-2` (beside `step`).
 *   case   at cat height in the clearing: the crowd's front behind, the great tree's trunk at the left edge and one
 *          low root reaching out behind her, across the grass at the right the river edge. Anchors `speak` (facing
 *          right), `beside` (at her right, facing her), `mentor` (behind her at the left), `root` (on the low root:
 *          `elev`), `fox` (across the grass toward the river edge, sitting back), `weasel-1`, `weasel-2` (nearer, at
 *          the river edge; all three facing left), `front-1` ... `front-4` (the crowd's front behind her).
 *   fox    close at the clearing's edge, the river behind and at the right. Anchors `fox` (facing left), `weasel-1`,
 *          `weasel-2` (behind him), `water`, `water-2`, `water-3` (in the river, swimming away in a row from the
 *          bank, `water` furthest out: `air`; the set draws rings over whoever is there).
 *   mist   the clearing's edge by the great tree: the trunk at the left, the right half for the mist (with `mist`)
 *          and the moon glowing high at the right. Anchors `mama` (her face and neck out of the mist at the right:
 *          the anchor's height her face's height; `elev`), `eldest` (lower and further right, bowing to the grass;
 *          `elev`; her neck goes down into the mist below the panel, so the spot is a little under its bottom edge),
 *          `nose` (on the grass under Mama's nose), `beside` (beside our cat, facing the mist, a step further back than
 *          her: Sprinkle's tail lies behind her, so back to front draws our cat over it), `speak`,
 *          `mentor`, `front-1`, `front-2` (at the left, facing right).
 *   sky    looking up past the great tree's crown (at the bottom left): the full moon big, the sky, the towers
 *          tiny far off downriver at the bottom left, the mist's top edge along the bottom right (with `mist`).
 *          Anchors `fly`, `nose`, `far`: all `elev` and `air` (in the air, no ground, no shadow).
 *   paws   close on our cat's chest and forepaws held out in the moonlight, on the grass, with room above at the
 *          right for Sprinkle leaning down. Anchors `close` (our cat, very big) and `above` (Sprinkle: `elev`).
 *
 * Options (every one off by default; off draws exactly as left out):
 *   crowd: true | 'standing'   (wide, roots, case, fox) every Clan round the clearing: K.crowd's small cats, kept
 *                  clear of the frame's cast, in anonymous coats only: CrystalClan's clancat (no who and no
 *                  variant: the camp's CROWD_COATS), ReedClan's reedclan 3 and 4, GroveClan's groveclan 4 and 5
 *                  and the otters 1 and 2, each seat with its who and variant. 'standing' gives every seat the
 *                  pose `stand` (wide, fox: "Every cat on the island stands up, and every otter too.")
 *   luggage: 'none' | 'heap' | 'open'   (shore, wide) the reed heap, round and lumpy; 'open' the reeds pulled off,
 *                  lying in a loose pile (<g data-art="luggage">, <g data-art="reeds-open">)
 *   ferry: true    (shore) the Moon Ferry's front raft at the water's edge
 *   print: true    (shore) the badger's old track in the mud: one big print, a wide pad and five toes in a row, long
 *                  digging claw marks, dry and cracked at its edges, in bright moonlight (<g data-art="print">)
 *   mist: 'none' | 'rolling' | 'thick'   (wide, roots, case, fox, mist, sky) soft silver mist coming up the river:
 *                  'rolling' a low bank over the water and the clearing's edge, 'thick' round the great tree too,
 *                  the moon always glowing through it; with 'thick' on `mist` and `sky`, a thin veil in the `over`
 *                  layer at the panel's right only, never over a face at speak, mentor, nose or mama
 *                  (<g data-art="mist" data-mist="…">, <g data-art="veil">)
 *   tail: true     (mist) the tip of a huge soft grey tail curling through the mist (<g data-art="tail">)
 *   grown: true    (mist, sky) the other grown Mistscales as great soft grey shapes in the mist, gentle, with no
 *                  faces, teeth or claws (<g data-art="grown">)
 *   small: 'none' | 'one' | 'some' | 'coming'   (case, mist) small dragonet shapes in the mist, grey, soft and
 *                  faceless: one; three or four; or stepping out of the mist toward her (<g data-art="small">)
 *   rising: true   (sky) the Mistscales rising into the mist and away upriver, a small one with them (<g data-art="rising">)
 *   zip: true      (sky) one small winged shape zipping off the other way, toward the towers far downriver, a little
 *                  ring of hiccup mist behind it (<g data-art="zip">)
 *   drawing: 'none' | 'cat'   (case) a little cat scratched in the earth in front of `beside`: four legs, two ears
 *                  and a tail (<g data-art="drawing">)
 *   bubbles: true  (wide, with the crowd) little bubbles rising over the otters in the crowd (<g data-art="bubbles">)
 *   tap: 'none' | 'reeds' | 'mist' | 'print'   an unpainted <rect class="pc-tap" data-tap="…"> (the tracks' and the
 *                  pile's): 'reeds' on the heap (wide, with `luggage: 'heap'`), 'mist' on the mist bank (mist, with
 *                  `mist`), 'print' on the print (shore, with `print`). Nothing is painted; the box goes first in `keep`
 *
 * The moon is always in `keep` where it shows.
 *
 * PC.art.islandInfo() -> the geometry the tests read: the roots, the water and the mud by camera, the print, the
 * heap, the seats each camera gives the crowd, the veil's zone.
 *
 * Registered with PC.art.defineSet (app/art/scenes.js) after sets/ferry.js, whose raft and heap it shares
 * (PC.art.ferryParts); painters come from PC.art.kit.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});
  var K = art.kit;
  if (!K || !art.defineSet) {
    if (typeof module !== 'undefined' && module.exports) module.exports = PC;
    return;
  }

  var n = K.n, rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke, pts = K.pts, g = K.g,
    mix = K.mix, lerp = K.lerp, clamp = K.clamp, rng = K.rng, blob = K.blob, mound = K.mound, bladeD = K.bladeD, leafD = K.leafD, A = K.anchor;
  var FP = art.ferryParts || null;

  // ------------------------------------------------------------------ colours: a silver night under the full moon

  // Every colour a step lighter and cooler than the camp's night: the grass silver-green, the bark silver-grey, the
  // water silver-blue, the crown's leaves the darkest thing there and still lit. Nothing near black.
  var C = {
    sky: ['#1E3266', '#29447E', '#385690', '#4E6EA8', '#7090C4'], skyGlow: '#DCE6FA',
    water: ['#B6CAEC', '#9DB6E0', '#88A6D8', '#7A98CE'], waterLit: '#E2EBFC', rip: '#F2F6FF', ripDk: '#7E98C6',
    bank: '#4C7470', bankLit: '#A9CBBE', tree: '#44706A', treeLit: '#72A092',
    grass: '#739E8C', grassFar: '#8DB2A2', grassNear: '#618E7C', grassLt: '#A6CABA', blade: '#527C6C', bladeLt: '#BCDCCC',
    bark: '#8E8698', barkLt: '#B8B2C4', barkDk: '#6E6678', barkLine: '#5E5868', barkSheen: '#DCD8E8',
    leaf: '#3C6862', leafMid: '#4B7A72', leafLt: '#689A8E', leafSilver: '#A9CFC4', branch: '#6E6678',
    mud: '#A09A9C', mudLt: '#BEB8B8', mudDk: '#86808A', mudWet: '#909AB2', pebble: '#C2C6D0', pebbleDk: '#9A9EAE',
    printIn: '#857E8E', printRim: '#B8B2BE', printDry: '#D6D0DA', crack: '#7C7488',
    mist: '#EEF2FA', mistMid: '#DCE4F2', mistGrey: '#C6D0E0', shape: '#A9B4C8', shapeDk: '#97A2B8', shapeLt: '#C4CDDC',
    towerTop: '#7690B6', tower: '#56729A', towerLit: '#FFDB92', earth: '#7E7486', bubble: '#F4F8FF'
  };

  // ------------------------------------------------------------------ helpers

  function smooth(P, closed) {
    var d = 'M' + n(P[0][0]) + ' ' + n(P[0][1]), i;
    for (i = 1; i < P.length - 1; i++) d += 'Q' + n(P[i][0]) + ' ' + n(P[i][1]) + ' ' + n((P[i][0] + P[i + 1][0]) / 2) + ' ' + n((P[i][1] + P[i + 1][1]) / 2);
    d += 'L' + n(P[P.length - 1][0]) + ' ' + n(P[P.length - 1][1]);
    return closed ? d + 'Z' : d;
  }
  function boxAttr(b) { return n(b[0]) + ' ' + n(b[1]) + ' ' + n(b[2]) + ' ' + n(b[3]); }
  function inPoly(P, x, y) {
    var inside = false;
    for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
      if (((P[i][1] > y) !== (P[j][1] > y)) && (x < (P[j][0] - P[i][0]) * (y - P[i][1]) / ((P[j][1] - P[i][1]) || 1e-9) + P[i][0])) inside = !inside;
    }
    return inside;
  }
  function polyBox(P) {
    var xs = P.map(function (q) { return q[0]; }), ys = P.map(function (q) { return q[1]; });
    return [Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys)];
  }
  function keepBox(S, b) { (S.keep = S.keep || []).push({ x: b[0], y: b[1], w: b[2] - b[0], h: b[3] - b[1] }); }
  // the Tap's target: an unpainted rect of class pc-tap named data-tap (the tracks'), first in keep; nothing painted
  function tapRect(S, name, b) {
    (S.keep = S.keep || []).unshift({ x: b[0] - 4, y: b[1] - 4, w: b[2] - b[0] + 8, h: b[3] - b[1] + 8 });
    return rect(b[0], b[1], b[2] - b[0], b[3] - b[1], 'none', { 'class': 'pc-tap', 'data-tap': name, 'pointer-events': 'none' });
  }
  function opt(S, k, none) { var v = S.opts[k]; return v == null || v === false ? none : v; }
  function at(S, name) {
    var a = (S.anchorMap || {})[name], cast = S.cast || [];
    if (!a) return null;
    for (var i = 0; i < cast.length; i++) if (cast[i] && cast[i].at === name) return { m: cast[i], a: a };
    return null;
  }
  // where a cast member's head is drawn (world units), as scenes.js places it: the cats' units, a sitting Clan cat's
  // height to the spot's h; for a grown Mistscale a generous box round her face (the spot's h tall, leaning out of the
  // mist the way she faces). Without the drawings, a sitting cat's head
  function headAt(S, m, a) {
    var fn = art.character, who = m.who || 'clancat', H = a.h * (m.size > 0 ? +m.size : 1), face = m.facing || a.face || 'right';
    var o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: face };
    if (m.variant != null) o.variant = m.variant;
    if (who === 'player') o.look = S.look || {};
    var ch = null, ref = null;
    if (typeof fn === 'function' && !fn.placeholder) { try { ch = fn(who, o); ref = fn('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }); } catch (e) { ch = null; } }
    if (who === 'mistscale') {
      // her face (the spot's h tall, the scene rule) leaning out of the mist toward the way she faces, generously: her
      // head turns and lifts by pose, and nothing of the veil may cross it
      return face === 'left' ? [a.x - H * 1.25, a.y - H * 1.95, a.x + H * 0.35, a.y - H * 0.3] : [a.x - H * 0.35, a.y - H * 1.95, a.x + H * 1.25, a.y - H * 0.3];
    }
    if (!ch || !ch.headBox || !ref || !(ref.h > 0)) return [a.x - H * 0.25, a.y - H * 0.85, a.x + H * 0.25, a.y - H * 0.38];
    var s = H / ref.h, hb = ch.headBox;
    var x0 = a.x + (hb.x0 - ch.w / 2) * s, x1 = a.x + (hb.x1 - ch.w / 2) * s;
    return [Math.min(x0, x1), a.y + (hb.y0 - ch.h) * s, Math.max(x0, x1), a.y + (hb.y1 - ch.h) * s];
  }
  function meets(p, q, pad) { pad = pad || 0; return p[0] < q[2] + pad && p[2] > q[0] - pad && p[1] < q[3] + pad && p[3] > q[1] - pad; }

  // ------------------------------------------------------------------ painters

  function skyBack(S, y1, mx, my) {
    var st = [];
    for (var i = 0; i < C.sky.length; i++) st.push([i / (C.sky.length - 1), C.sky[i]]);
    var s = rect(-10, -10, 1620, y1 + 20, S.linU(st, 0, 0, 0, y1));
    s += circ(mx, my, 760, S.radU([[0, C.skyGlow, 0.42], [0.35, C.skyGlow, 0.14], [1, C.skyGlow, 0]], mx, my, 760));
    s += K.stars(S, 0, 0, 1600, y1 * 0.9, Math.round(1600 * y1 / 3000), 7101 + Math.round(y1));
    return g(s, { 'data-art': 'sky' });
  }
  // the full moon, round and high, its glow; kept clear of the lettering
  function fullMoon(S, x, y, r) {
    keepBox(S, [x - r - 10, y - r - 10, x + r + 10, y + r + 10]);
    var glow = circ(x, y, r * 4.4, S.radU([[0, '#F4F8FF', 0.45], [0.4, '#DCE6FF', 0.15], [1, '#DCE6FF', 0]], x, y, r * 4.4));
    return g(glow + K.waxingMoon(S, x, y, r, 12, 14), { 'data-art': 'moon', 'data-age': '14', 'data-at': n(x) + ' ' + n(y) + ' ' + n(r) });
  }
  function farBank(S, x0, x1, y, hgt, seed) {
    if (FP) return FP.farBank(S, x0, x1, y, hgt, seed);
    return rect(x0, y - hgt, x1 - x0, hgt + 8, C.bank);
  }
  // silver water inside a polygon: the gradient, the sky's sheen, ripples
  function water(S, P, seed, sheenX) {
    var r = rng(seed), b = polyBox(P), clip = S.clip('isw' + seed, path(smooth(P, true), '#fff'));
    var s = rect(b[0] - 10, b[1] - 10, b[2] - b[0] + 20, b[3] - b[1] + 20, S.linU([[0, C.water[0]], [0.35, C.water[1]], [0.75, C.water[2]], [1, C.water[3]]], 0, b[1], 0, b[3]));
    s += ell(sheenX == null ? (b[0] + b[2]) / 2 : sheenX, b[1] + (b[3] - b[1]) * 0.3, (b[2] - b[0]) * 0.7 + 200, (b[3] - b[1]) * 0.45, S.radU([[0, C.waterLit, 0.5], [1, C.waterLit, 0]], sheenX == null ? (b[0] + b[2]) / 2 : sheenX, b[1] + (b[3] - b[1]) * 0.3, (b[2] - b[0]) * 0.7 + 200));
    var rip = '', rip2 = '', dk = '';
    for (var i = 0; i < 40; i++) {
      var t = Math.pow(r(), 1.3), y = lerp(b[1] + 6, b[3], t), w = lerp(14, 110, t) * (0.6 + r() * 0.8), x = lerp(b[0] - 20, b[2] + 20, r());
      if (i % 3 === 0) dk += 'M' + n(x) + ' ' + n(y + 3) + 'q' + n(w / 2) + ' 3 ' + n(w) + ' 0';
      else if (i % 3 === 1) rip += 'M' + n(x) + ' ' + n(y) + 'q' + n(w / 2) + ' ' + n(-3 - t * 3) + ' ' + n(w) + ' 0';
      else rip2 += 'M' + n(x) + ' ' + n(y) + 'h' + n(w * 0.7);
    }
    s += stroke(dk, C.ripDk, 2.4, { opacity: 0.3 }) + stroke(rip, C.rip, 2.6, { opacity: 0.8 }) + stroke(rip2, C.rip, 2, { opacity: 0.6, 'class': 'pcs-glint' });
    // the bright line where it meets the land (the outline's points inside the panel)
    var edge = P.filter(function (q) { return q[0] > -10 && q[0] < 1610 && q[1] > -10 && q[1] < 1010; });
    return g(g(s, { 'clip-path': clip }) + (edge.length > 1 ? stroke(smooth(edge), C.rip, 3, { opacity: 0.6 }) : ''), { 'data-art': 'water', 'data-box': boxAttr(b) });
  }
  // short moonlit grass over a region (its top edge P, left to right), down to the bottom of the panel
  function grass(S, P, seed, count) {
    var r = rng(seed), top = Math.min.apply(null, P.map(function (q) { return q[1]; }));
    var d = smooth(P) + 'L' + n(P[P.length - 1][0]) + ' 1010L' + n(P[0][0]) + ' 1010Z';
    var s = path(d, S.linU([[0, C.grassFar], [0.45, C.grass], [1, C.grassNear]], 0, top, 0, 1000));
    // soft patches of moonlight and of the crown's shade (still light), then tufts
    var lit = '', sh = '';
    for (var i = 0; i < 10; i++) { var px = lerp(P[0][0], P[P.length - 1][0], r()), py = lerp(top + 30, 980, r()), k = lerp(0.5, 1.4, (py - top) / (1000 - top)); var bl = blob(px, py, (80 + r() * 120) * k, (12 + r() * 14) * k, 9, r, 0.3, 0.3); if (i % 2) lit += bl; else sh += bl; }
    s += path(sh, C.grassNear, { opacity: 0.35 }) + path(lit, C.grassLt, { opacity: 0.4 });
    var a = '', b = '';
    for (i = 0; i < (count || 120); i++) {
      var tx = lerp(P[0][0], P[P.length - 1][0], r()), ty = lerp(top + 8, 1000, Math.pow(r(), 0.7)), k2 = lerp(0.4, 1.5, (ty - top) / (1000 - top));
      var dd = '';
      for (var j = 0; j < 3; j++) dd += bladeD(tx + (j - 1) * 5 * k2, ty, (10 + r() * 12) * k2, (j - 1) * 5 * k2, 1.8 * k2);
      if (r() < 0.55) a += dd; else b += dd;
    }
    s += path(a, C.blade, { opacity: 0.7 }) + path(b, C.bladeLt, { opacity: 0.75 });
    return g(s, { 'data-art': 'grass' });
  }
  // bark: a trunk outline filled silver-grey, the moonlit side (the right) lighter, its grain and a few burls
  function barkFill(S, d, x0, x1, y0, y1, seed) {
    var r = rng(seed), s = path(d, S.linU([[0, C.barkDk], [0.35, C.bark], [0.75, C.barkLt], [1, C.bark]], x0, 0, x1, 0));
    var grain = '', clip = S.clip('isbark' + seed, path(d, '#fff'));
    for (var i = 0; i < 26; i++) { var gx = lerp(x0, x1, r()), dx = (r() - 0.5) * 50; grain += 'M' + n(gx) + ' ' + n(y0 - 20) + 'Q' + n(gx + dx) + ' ' + n((y0 + y1) / 2) + ' ' + n(gx - dx * 0.6) + ' ' + n(y1 + 20); }
    var burls = '';
    for (i = 0; i < 5; i++) { var bx = lerp(x0 + 40, x1 - 40, r()), by = lerp(y0 + 60, y1 - 40, r()); burls += ell(bx, by, 16 + r() * 18, 22 + r() * 22, C.barkDk, { opacity: 0.5 }) + ell(bx + 3, by - 2, 8 + r() * 6, 12 + r() * 8, C.barkLt, { opacity: 0.6 }); }
    return s + g(stroke(grain, C.barkLine, 3, { opacity: 0.35 }) + burls + stroke('M' + n(lerp(x0, x1, 0.78)) + ' ' + n(y0 - 20) + 'Q' + n(lerp(x0, x1, 0.82)) + ' ' + n((y0 + y1) / 2) + ' ' + n(lerp(x0, x1, 0.76)) + ' ' + n(y1 + 20), C.barkSheen, 14, { opacity: 0.3 }), { 'clip-path': clip });
  }
  // the great tree's crown: one wide old dome of leaves from x0 to x1, its top at `top` (above the panel, often) and
  // its low edge at `low`; lobes all round its outline, the moonlit ones silver along their tops, leaves scattered
  // over it, and under its low edge a few branches and the bark showing
  function crown(S, x0, x1, top, low, seed, o) {
    o = o || {};
    var r = rng(seed), cx = (x0 + x1) / 2, rx = (x1 - x0) / 2, ry = (low - top) / 2, cy = (top + low) / 2, i;
    var lr = Math.max(40, Math.min(rx, ry) * 0.26);
    var shade = '', mid = '', lit = '', rims = '', lv = '', lv2 = '', br = '';
    // the mass, then lobes round the outline: the underside in shade, the upper right in moonlight
    shade += blob(cx, cy, rx * 0.96, ry * 0.94, 14, r, 0.08, 0.12);
    for (i = 0; i < 30; i++) {
      var a = (i / 30) * Math.PI * 2, ex = cx + Math.cos(a) * rx * 0.86, ey = cy + Math.sin(a) * ry * 0.84, rr = lr * (0.7 + r() * 0.6);
      var d = blob(ex, ey, rr, rr * 0.8, 9, r, 0.25, 0.3);
      if (Math.sin(a) > 0.35) shade += d; else if (Math.cos(a) > -0.2 && Math.sin(a) < 0) lit += d; else mid += d;
      if (Math.sin(a) < -0.1 && Math.cos(a) > -0.6) rims += 'M' + n(ex - rr * 0.7) + ' ' + n(ey - rr * 0.45) + 'Q' + n(ex) + ' ' + n(ey - rr * 0.95) + ' ' + n(ex + rr * 0.7) + ' ' + n(ey - rr * 0.4);
    }
    // inner clumps, lighter toward the moon (the upper right)
    for (i = 0; i < (o.clumps || 16); i++) {
      var u = r(), v = r(), px = cx + (u - 0.5) * rx * 1.5, py = cy + (v - 0.6) * ry * 1.2, rq = lr * (0.6 + r() * 0.5);
      var dq = blob(px, py, rq, rq * 0.75, 8, r, 0.3, 0.3);
      if (u + (1 - v) > 1.15) lit += dq; else mid += dq;
    }
    for (i = 0; i < (o.leaves || 90); i++) {
      var ang = r() * Math.PI * 2, rad = Math.sqrt(r()), lx = cx + Math.cos(ang) * rx * rad * 0.95, ly = cy + Math.sin(ang) * ry * rad * 0.92;
      var leaf = leafD(lx, ly, 12 + r() * 14, Math.PI / 2 + (r() - 0.5) * 1.8, 5 + r() * 3);
      if (Math.cos(ang) - Math.sin(ang) > 0.3) lv += leaf; else lv2 += leaf;
    }
    // branches under its low edge, between the hanging lobes
    for (i = 0; i < (o.branches || 5); i++) {
      var bx = lerp(x0 + rx * 0.3, x1 - rx * 0.3, (i + 0.5) / (o.branches || 5)) + (r() - 0.5) * 40, by = cy + ry * 0.62;
      br += 'M' + n(cx + (bx - cx) * 0.2) + ' ' + n(low + 40) + 'Q' + n(lerp(cx, bx, 0.6)) + ' ' + n(by + 30) + ' ' + n(bx) + ' ' + n(by - 20);
    }
    var s = stroke(br, C.branch, Math.max(6, lr * 0.22), { 'stroke-linecap': 'round' }) + path(shade, C.leaf) + path(mid, C.leafMid) + path(lit, C.leafLt) +
      path(lv2, C.leafMid, { opacity: 0.9 }) + path(lv, C.leafSilver, { opacity: 0.55 }) + stroke(rims, C.leafSilver, Math.max(3, lr * 0.08), { opacity: 0.7 });
    return g(s, { 'data-art': 'crown', 'data-box': boxAttr([x0, top, x1, low]) });
  }
  // a big root: a tapering band along a centreline [[x, y, thick], …], rounded: its top lit by the moon, its
  // underside in soft shade, the bark's grain running along it, its end rounded into the ground
  function rootBand(S, P, seed) {
    var top = [], bot = [], N = [], i;
    for (i = 0; i < P.length; i++) {
      var q0 = P[Math.max(0, i - 1)], q1 = P[Math.min(P.length - 1, i + 1)], tx = q1[0] - q0[0], ty = q1[1] - q0[1], tl = Math.hypot(tx, ty) || 1;
      var nx = -ty / tl, ny = tx / tl;
      if (ny > 0) { nx = -nx; ny = -ny; }
      N.push([nx, ny]);
      top.push([P[i][0] + nx * P[i][2] / 2, P[i][1] + ny * P[i][2] / 2]);
      bot.push([P[i][0] - nx * P[i][2] / 2, P[i][1] - ny * P[i][2] / 2 + P[i][2] * 0.12]);
    }
    var d = smooth(top) + smooth(bot.slice().reverse()).replace(/^M/, 'L') + 'Z';
    var b = polyBox(top.concat(bot)), grain = '';
    [-0.28, 0, 0.3].forEach(function (t) { grain += smooth(P.map(function (q, k) { return [q[0] - N[k][0] * q[2] * t, q[1] - N[k][1] * q[2] * t]; })); });
    var s = path(d, S.linU([[0, C.barkLt], [0.45, C.bark], [1, C.barkDk]], 0, b[1], 0, b[3]));
    s += stroke(grain, C.barkLine, Math.max(2, P[0][2] * 0.025), { opacity: 0.35 }) + stroke(smooth(top), C.barkSheen, Math.max(3, P[0][2] * 0.06), { opacity: 0.6 });
    // where it goes into the ground: a soft shade on the grass under it
    s = path(blob(P[P.length - 1][0], P[P.length - 1][1] + P[P.length - 1][2] * 0.5, P[P.length - 1][2] * 1.6, P[P.length - 1][2] * 0.4, 8, rng(seed), 0.2, 0.2), C.grassNear, { opacity: 0.5 }) + s;
    return g(s, { 'data-art': 'root' });
  }
  // the root's top at x, from its centreline
  function rootTop(P, x) {
    for (var i = 1; i < P.length; i++) {
      var a = P[i - 1], b = P[i];
      if ((x - a[0]) * (x - b[0]) <= 0) { var t = (x - a[0]) / ((b[0] - a[0]) || 1); return lerp(a[1], b[1], t) - lerp(a[2], b[2], t) / 2; }
    }
    return null;
  }
  // the full moon glowing through the mist in front of it: its disc again, softer, and a wide silver glow
  function moonThrough(S, M) {
    return g(circ(M[0], M[1], M[2] * 3.2, S.radU([[0, '#FFFFFF', 0.5], [0.45, '#F2F6FF', 0.18], [1, '#F2F6FF', 0]], M[0], M[1], M[2] * 3.2)) + circ(M[0], M[1], M[2] * 0.98, '#FFF6DC', { opacity: 0.8 }), { 'data-art': 'moon-glow' });
  }
  // soft silver mist: a bank of blurred rounds between x0 and x1, from y0 to y1, the moon's glow through it
  function mistBank(S, x0, x1, y0, y1, seed, op, glow) {
    var r = rng(seed), s = '', s2 = '';
    for (var i = 0; i < 22; i++) {
      var x = lerp(x0, x1, r()), y = lerp(y0 + (y1 - y0) * 0.25, y1, r()), rx = 80 + r() * 160, ry = 40 + r() * 70;
      var e = ell(x, y, rx, ry, i % 3 ? C.mist : C.mistMid); if (i % 2) s += e; else s2 += e;
    }
    var body = rect(x0, lerp(y0, y1, 0.5), x1 - x0, (y1 - y0) * 0.5 + 10, S.linU([[0, C.mist, 0], [0.4, C.mistMid, 0.8], [1, C.mist, 0.9]], 0, lerp(y0, y1, 0.5), 0, y1));
    var out = g(body + s2 + s, { filter: S.blur('ismist' + Math.round(op * 10), 22), opacity: n(op) });
    if (glow) out += circ(glow[0], glow[1], glow[2], S.radU([[0, '#FFFFFF', 0.4], [0.5, '#F2F6FF', 0.16], [1, '#F2F6FF', 0]], glow[0], glow[1], glow[2]));
    return out;
  }
  // a soft grey shape in the mist: a grown Mistscale's head on its long neck, rounded, gentle, faceless (no eyes, no
  // mouth, no teeth, no claws), two soft horns, rounded ridges like hills down the back of its neck; (x, y) the head's
  // middle, k its size, dir the way it faces
  function grownShape(S, x, y, k, dir, seed) {
    var f = dir < 0 ? -1 : 1, X = function (u) { return x + f * u * k; }, Y = function (v) { return y + v * k; }, r = rng(seed);
    // the neck: a short thick curve down into the mist
    var neck = 'M' + n(X(-110)) + ' ' + n(Y(20)) + 'Q' + n(X(-190)) + ' ' + n(Y(130)) + ' ' + n(X(-170)) + ' ' + n(Y(300)) + 'L' + n(X(-20)) + ' ' + n(Y(300)) +
      'Q' + n(X(-30)) + ' ' + n(Y(150)) + ' ' + n(X(30)) + ' ' + n(Y(60)) + 'Z';
    // the head: a big rounded skull and a long soft snout, two soft horns swept back, a rounded brow; no face
    var head = ell(X(-10), Y(0), 150 * k, 96 * k, C.shape) + ell(X(120), Y(30), 96 * k, 58 * k, C.shape) + ell(X(170), Y(40), 50 * k, 40 * k, C.shape);
    var horns = 'M' + n(X(-80)) + ' ' + n(Y(-60)) + 'Q' + n(X(-170)) + ' ' + n(Y(-120)) + ' ' + n(X(-200)) + ' ' + n(Y(-86)) + 'Q' + n(X(-140)) + ' ' + n(Y(-60)) + ' ' + n(X(-90)) + ' ' + n(Y(-24)) + 'Z' +
      'M' + n(X(-20)) + ' ' + n(Y(-84)) + 'Q' + n(X(-90)) + ' ' + n(Y(-160)) + ' ' + n(X(-120)) + ' ' + n(Y(-130)) + 'Q' + n(X(-70)) + ' ' + n(Y(-90)) + ' ' + n(X(-30)) + ' ' + n(Y(-50)) + 'Z';
    var ridge = '';
    for (var i = 0; i < 3; i++) ridge += circ(X(-150 - i * 14), Y(70 + i * 70), (30 - i * 4) * k, C.shapeDk);
    var rim = 'M' + n(X(-120)) + ' ' + n(Y(-60)) + 'Q' + n(X(0)) + ' ' + n(Y(-120)) + ' ' + n(X(120)) + ' ' + n(Y(-10)) + 'Q' + n(X(180)) + ' ' + n(Y(4)) + ' ' + n(X(212)) + ' ' + n(Y(34));
    // mist over its lower part: it leans out of the mist
    var veil = '';
    for (i = 0; i < 6; i++) veil += ell(X(-100 + (r() - 0.5) * 160), Y(220 + r() * 80), (110 + r() * 60) * k, (50 + r() * 26) * k, C.mist);
    return g(ridge + path(neck, C.shape) + path(horns, C.shapeDk) + head + stroke(rim, C.shapeLt, 10 * k, { opacity: 0.85, 'stroke-linecap': 'round' }) + g(veil, { opacity: 0.9 }), { 'data-shape': 'grown' });
  }
  // a small dragonet shape in the mist, sitting: round body, round head with a little snout, a folded wing, a curl of
  // tail round its feet; grey, soft, faceless. (x, y) its feet, k its size (1: about 180 tall), dir the way it faces
  function smallShape(S, x, y, k, dir) {
    var f = dir < 0 ? -1 : 1, X = function (u) { return x + f * u * k; }, Y = function (v) { return y + v * k; }, s = '';
    s += path('M' + n(X(-44)) + ' ' + n(Y(-6)) + 'Q' + n(X(-110)) + ' ' + n(Y(-4)) + ' ' + n(X(-96)) + ' ' + n(Y(-44)) + 'Q' + n(X(-84)) + ' ' + n(Y(-64)) + ' ' + n(X(-66)) + ' ' + n(Y(-52)), 'none', { stroke: C.shape, 'stroke-width': n(16 * k), 'stroke-linecap': 'round' });
    s += ell(X(0), Y(-52), 52 * k, 54 * k, C.shape);
    s += ell(X(22), Y(-128), 40 * k, 36 * k, C.shape) + ell(X(56), Y(-120), 22 * k, 16 * k, C.shape);
    s += path('M' + n(X(-12)) + ' ' + n(Y(-98)) + 'Q' + n(X(-70)) + ' ' + n(Y(-130)) + ' ' + n(X(-80)) + ' ' + n(Y(-90)) + 'Q' + n(X(-50)) + ' ' + n(Y(-72)) + ' ' + n(X(-20)) + ' ' + n(Y(-56)) + 'Z', C.shapeDk);
    s += path('M' + n(X(6)) + ' ' + n(Y(-158)) + 'l' + n(f * -8 * k) + ' ' + n(-22 * k) + 'l' + n(f * 18 * k) + ' ' + n(14 * k) + 'Z' + 'M' + n(X(30)) + ' ' + n(Y(-162)) + 'l' + n(f * 2 * k) + ' ' + n(-22 * k) + 'l' + n(f * 14 * k) + ' ' + n(18 * k) + 'Z', C.shapeDk);
    s += stroke('M' + n(X(-10)) + ' ' + n(Y(-150)) + 'Q' + n(X(30)) + ' ' + n(Y(-172)) + ' ' + n(X(60)) + ' ' + n(Y(-134)), C.shapeLt, 6 * k, { opacity: 0.8, 'stroke-linecap': 'round' });
    return g(s, { 'data-shape': 'small' });
  }
  // the mist's shapes over a bank: blurred so they are part of it
  function inMist(S, svg, key, attr) { return g(g(svg, { filter: S.blur(key, 4), opacity: 0.85 }), attr); }
  // the luggage: the ferry's heap of reeds; 'open', the reeds pulled off and lying in a loose pile
  function heap(S, cx, base, w, hgt, seed) {
    if (FP) return FP.reedHeap(S, cx, base, w, hgt, seed);
    return g(path(mound(cx - w / 2, cx + w / 2, base, base - hgt, 7, rng(seed), 0.22, 0.18, 0.22), '#A2B06E'), { 'data-art': 'luggage', 'data-box': boxAttr([cx - w / 2, base - hgt, cx + w / 2, base]) });
  }
  function reedsOpen(S, cx, base, w, seed) {
    var r = rng(seed), a = '', b = '', c = '';
    for (var i = 0; i < 90; i++) {
      var x = cx + (r() - 0.5) * w, y = base - r() * w * 0.12, L = 40 + r() * 80, ang = (r() - 0.5) * 0.7;
      var dd = 'M' + n(x) + ' ' + n(y) + 'q' + n(L * 0.5 * Math.cos(ang)) + ' ' + n(-6 + L * 0.3 * Math.sin(ang)) + ' ' + n(L * Math.cos(ang)) + ' ' + n(L * Math.sin(ang));
      if (i % 3 === 0) a += dd; else if (i % 3 === 1) b += dd; else c += dd;
    }
    var N = FP ? FP.night : { reed: '#A2B06E', reedDk: '#7C8C52', reedGold: '#D8C67E' };
    return g(ell(cx, base - 4, w * 0.55, w * 0.07, C.blade, { opacity: 0.3 }) + stroke(a, N.reedDk, 3.4, { opacity: 0.8 }) + stroke(b, N.reed, 3) + stroke(c, N.reedGold, 2.6), { 'data-art': 'reeds-open', 'data-box': boxAttr([cx - w / 2 - 40, base - w * 0.2, cx + w / 2 + 60, base + 6]) });
  }
  // the crowd round the clearing: the kit's helper (scenes.js), guarded; 'standing' stands every seat up
  function crowdOf(S, seats, k0) {
    var c = S.opts.crowd;
    if (!(c === true || c === 'standing') || !K.crowd) return '';
    var list = c === 'standing' ? seats.map(function (st) { var q = st.slice(); q[3] = 'stand'; return q; }) : seats;
    return K.crowd(S, list, k0) || '';
  }
  // silver rings round whoever is in the water at a spot (a cover, drawn just after them)
  function ringsOver(S, name, a, k) {
    var w = a.h * k, y = a.y - a.h * 0.02;
    var s = stroke('M' + n(a.x - w) + ' ' + n(y + 2) + 'A' + n(w) + ' ' + n(w * 0.18) + ' 0 0 0 ' + n(a.x + w) + ' ' + n(y + 2) +
      'M' + n(a.x - w * 1.35) + ' ' + n(y + 10) + 'A' + n(w * 1.35) + ' ' + n(w * 0.25) + ' 0 0 0 ' + n(a.x - w * 0.3) + ' ' + n(y + w * 0.26) +
      'M' + n(a.x + w * 0.4) + ' ' + n(y + w * 0.26) + 'A' + n(w * 1.35) + ' ' + n(w * 0.25) + ' 0 0 0 ' + n(a.x + w * 1.35) + ' ' + n(y + 10), C.rip, Math.max(2.4, a.h * 0.012), { opacity: 0.85 });
    return g(s, { 'data-part': 'cover-' + name, 'data-box': boxAttr([a.x - w * 1.35, y - w * 0.18, a.x + w * 1.35, y + w * 0.26]) });
  }
  function towersFar(S, list) { return FP ? FP.farTowers(S, list) : ''; }

  // ------------------------------------------------------------------ SHORE: the island's shore

  var SHORE = {
    water: [[-30, 520], [520, 520], [560, 600], [520, 700], [600, 800], [700, 880], [760, 1012], [-30, 1012]],
    // the slope's top edge (the clearing's edge), left to right; the mud below it to the water
    slope: [[480, 560], [700, 600], [900, 620], [1100, 600], [1300, 560], [1640, 520]],
    raft: { p0: [-160, 900], p1: [420, 872], dx: 70, dy: 120, logs: 4 },
    heap: [640, 968, 260, 210], print: { x: 960, y: 944, s: 1.2 }, moon: [760, 110, 46]
  };
  function badgerPrint(S, x, y, k) {
    var s = '', r = rng(7301);
    // the pad: wide, kidney-shaped, pressed into the mud; its rim raised, pale and dry and a little cracked
    var pad = 'M' + n(x - 90 * k) + ' ' + n(y + 6 * k) + 'Q' + n(x - 92 * k) + ' ' + n(y - 34 * k) + ' ' + n(x - 40 * k) + ' ' + n(y - 36 * k) + 'Q' + n(x) + ' ' + n(y - 26 * k) + ' ' + n(x + 40 * k) + ' ' + n(y - 36 * k) +
      'Q' + n(x + 92 * k) + ' ' + n(y - 34 * k) + ' ' + n(x + 90 * k) + ' ' + n(y + 6 * k) + 'Q' + n(x + 80 * k) + ' ' + n(y + 34 * k) + ' ' + n(x) + ' ' + n(y + 34 * k) + 'Q' + n(x - 80 * k) + ' ' + n(y + 34 * k) + ' ' + n(x - 90 * k) + ' ' + n(y + 6 * k) + 'Z';
    s += stroke(pad, C.printRim, 6 * k) + path(pad, C.printIn) + path(pad, 'none', { stroke: C.crack, 'stroke-width': n(2 * k), opacity: 0.5, transform: 'translate(0 ' + n(3 * k) + ')' });
    // five toes in a row, nearly straight across above it
    var toes = '', rims = '', claws = '';
    for (var i = 0; i < 5; i++) {
      var tx = x + (i - 2) * 38 * k, ty = y - 62 * k - Math.abs(i - 2) * 4 * k;
      rims += ell(tx, ty - 3 * k, 19 * k, 15 * k, C.printRim);
      toes += ell(tx, ty, 16 * k, 12 * k, C.printIn);
      // long digging claw marks running on from each toe, a little gap first
      claws += 'M' + n(tx + (i - 2) * 2 * k) + ' ' + n(ty - 22 * k) + 'L' + n(tx + (i - 2) * 6 * k) + ' ' + n(ty - 70 * k);
    }
    s += rims + toes + stroke(claws, C.printRim, 11 * k, { 'stroke-linecap': 'round' }) + stroke(claws, C.printIn, 7 * k, { 'stroke-linecap': 'round' });
    // old and dry: fine cracks round its edges, pale dry crumbs, the moon bright on the rims
    var cracks = '';
    for (i = 0; i < 14; i++) { var a = r() * Math.PI * 2, rr = (100 + r() * 30) * k, cx2 = x + Math.cos(a) * rr, cy2 = y - 20 * k + Math.sin(a) * rr * 0.55; cracks += 'M' + n(cx2) + ' ' + n(cy2) + 'l' + n((r() - 0.5) * 30 * k) + ' ' + n((r() - 0.5) * 16 * k) + 'l' + n((r() - 0.5) * 20 * k) + ' ' + n((r() - 0.5) * 12 * k); }
    s += stroke(cracks, C.crack, 2 * k, { opacity: 0.6 });
    s += stroke(pad, C.printDry, 2 * k, { opacity: 0.8 });
    var box = [x - 110 * k, y - 140 * k, x + 110 * k, y + 40 * k];
    return g(s, { 'data-art': 'print', 'data-box': boxAttr(box), 'data-old': 'dry' });
  }
  function drawShore(S) {
    var back = '', L = SHORE, o = S.opts, r = rng(7201), i;
    back += skyBack(S, 560, L.moon[0], L.moon[1]) + fullMoon(S, L.moon[0], L.moon[1], L.moon[2]);
    back += farBank(S, -20, 1640, 520, 34, 7202);
    // the great tree's crown up at the right, over the clearing's edge
    back += g(barkFill(S, 'M1270 520L1300 300Q1320 240 1380 230L1460 230Q1520 240 1530 300L1560 520Z', 1270, 1560, 230, 520, 7204) + crown(S, 1000, 1840, 20, 380, 7203, { leaves: 60 }), { filter: S.shadow('m') });
    // the mud and pebbles from the water's edge up to the clearing's edge, then the grass of the clearing
    var mudTop = L.slope.concat([[1640, 1012], [480, 1012]]);
    back += grass(S, [[470, 470], [700, 520], [900, 548], [1100, 530], [1300, 500], [1640, 470]], 7205, 50);
    back += path(smooth(L.slope) + 'L1640 1012L480 1012Z', S.linU([[0, C.mudLt], [0.5, C.mud], [1, C.mudDk]], 0, 520, 0, 1000));
    back += stroke(smooth(L.slope), C.grassNear, 6, { opacity: 0.6 });
    var peb = '', peb2 = '', wet = '';
    for (i = 0; i < 46; i++) {
      var px = lerp(480, 1600, r()), py = lerp(580, 1000, Math.pow(r(), 0.8)), k = lerp(0.5, 1.3, (py - 560) / 440);
      if (!inPoly(mudTop, px, py)) continue;
      var pb = blob(px, py, (5 + r() * 9) * k, (3 + r() * 4) * k, 7, r, 0.3, 0.3); if (r() < 0.6) peb += pb; else peb2 += pb;
    }
    back += path(peb2, C.pebbleDk, { opacity: 0.7 }) + path(peb, C.pebble, { opacity: 0.8 });
    back += water(S, L.water, 7206, 300);
    // the water's edge: wet mud, a bright line
    wet += stroke(smooth(L.water.slice(1, 7)), C.mudWet, 22, { opacity: 0.6 }) + stroke(smooth(L.water.slice(1, 7)), C.rip, 3, { opacity: 0.9 });
    back += wet;
    if (o.ferry === true) {
      var R = L.raft;
      back += FP ? g(FP.raftSide(S, R.p0, R.p1, R.dx, R.dy, R.logs, 7211, { art: 'ferry' }).svg, { filter: S.shadow('s') }) + FP.rope(S, [R.p1[0] + 40, R.p1[1] - 40], [560, 860]) : '';
    }
    if (o.print === true) back += badgerPrint(S, L.print.x, L.print.y, L.print.s);
    if (o.luggage === 'heap') back += heap(S, L.heap[0], L.heap[1], L.heap[2], L.heap[3], 7221);
    else if (o.luggage === 'open') back += reedsOpen(S, L.heap[0], L.heap[1], L.heap[2], 7222);
    var front = '';
    if (o.tap === 'print' && o.print === true) front += tapRect(S, 'print', [L.print.x - 110 * L.print.s, L.print.y - 140 * L.print.s, L.print.x + 110 * L.print.s, L.print.y + 40 * L.print.s]);
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ WIDE: the clearing under the great tree

  var WIDE = {
    horizon: 420, moon: [1470, 92, 48],
    trunk: 'M690 340Q676 420 640 470Q600 500 560 512L1040 512Q1000 500 960 470Q924 420 910 340L910 -20L690 -20Z',
    // the three roots' centrelines [x, y, thick]: running out left, toward us, and right; each leader's feet on its top
    roots: {
      'root-1': [[690, 490, 84], [600, 520, 70], [520, 556, 52], [420, 590, 36], [320, 616, 22]],
      'root-2': [[740, 520, 96], [800, 556, 100], [860, 520, 96]],
      'root-3': [[910, 490, 84], [1000, 520, 70], [1080, 556, 52], [1180, 590, 36], [1280, 616, 22]]
    },
    river: [[1640, 440], [1470, 452], [1500, 560], [1520, 700], [1500, 850], [1536, 1012], [1640, 1012]],
    luggage: [140, 970, 280, 230],
    // the crowd's seats, [x, y, facing, pose, size, who, variant]: GroveClan at the back, CrystalClan at the left
    // (no who: the camp's coats), ReedClan at the right, two otters by the water
    seats: [
      [664, 560, 'right', 'sit', 0.84, 'groveclan', 4],
      [220, 604, 'right', 'sit', 0.88, 'groveclan', 4], [380, 588, 'right', 'sit', 0.86, 'groveclan', 5], [646, 608, 'right', 'sit', 0.86, 'groveclan', 5],
      [954, 608, 'left', 'sit', 0.86, 'groveclan', 4], [1220, 590, 'left', 'sit', 0.86, 'groveclan', 5], [1340, 606, 'left', 'sit', 0.88, 'groveclan', 4],
      [60, 690, 'right', 'sit', 0.9], [190, 730, 'right', 'sit', 0.9], [470, 700, 'right', 'sit', 0.88], [610, 690, 'right', 'sit', 0.88], [40, 860, 'right', 'sit', 0.92],
      [1000, 690, 'left', 'sit', 0.88, 'reedclan', 3], [1260, 690, 'left', 'sit', 0.9, 'reedclan', 4], [1390, 720, 'left', 'sit', 0.9, 'reedclan', 3],
      [1430, 620, 'left', 'sit', 0.9, 'otter', 1], [1500, 760, 'left', 'sit', 0.92, 'otter', 2],
      // (and where a full clearing still leaves room: between the first two roots, at the far left, by the water at the back)
      [80, 600, 'right', 'sit', 0.88], [1556, 560, 'left', 'sit', 0.86, 'otter', 1]
    ]
  };
  function drawWide(S) {
    var back = '', over = '', front = '', W = WIDE, o = S.opts, mist = opt(S, 'mist', 'none');
    back += skyBack(S, W.horizon + 40, W.moon[0], W.moon[1]) + fullMoon(S, W.moon[0], W.moon[1], W.moon[2]);
    back += farBank(S, -20, 1640, W.horizon, 34, 7401);
    back += water(S, [[-30, W.horizon], [1640, W.horizon], [1640, 470], [-30, 470]], 7402, 1400);
    // the clearing's grass, its far edge just under the far bank, the river at the far right edge
    back += grass(S, [[-30, 452], [400, 462], [800, 466], [1200, 462], [1640, 452]], 7403, 160);
    back += water(S, W.river, 7404, 1560);
    // the great tree: trunk, its three roots, the crown over everything at the top
    back += g(barkFill(S, W.trunk, 560, 1040, -20, 512, 7405), { 'data-art': 'trunk', filter: S.shadow('m') });
    var roots = '';
    ['root-1', 'root-3', 'root-2'].forEach(function (k, i) { roots += rootBand(S, W.roots[k], 7411 + i); });
    back += g(roots, { filter: S.shadow('s') });
    back += crown(S, 120, 1240, -170, 310, 7406, { leaves: 130, clumps: 22, branches: 6 });
    if (mist === 'thick') back += g(mistBank(S, 300, 1300, 260, 560, 7421, 0.38, [W.moon[0], W.moon[1], 380]), { 'data-art': 'mist', 'data-mist': 'thick-tree' });
    // the crowd in its ring, then (over the otters) their bubbles
    var others = [], otters = [];
    W.seats.forEach(function (st) { (st[5] === 'otter' ? otters : others).push(st); });
    back += crowdOf(S, others, 0);
    var ot = crowdOf(S, otters, others.length);
    back += ot;
    if (o.bubbles === true && ot) back += bubblesOver(S, ot);
    if (mist !== 'none') back += g(mistBank(S, 1240, 1660, 400, 800, 7422, mist === 'thick' ? 0.72 : 0.6, null) + mistBank(S, -40, 1660, 400, 520, 7423, mist === 'thick' ? 0.55 : 0.42, null), { 'data-art': 'mist', 'data-mist': mist }) + moonThrough(S, W.moon);
    var Lg = W.luggage;
    if (o.luggage === 'heap') back += heap(S, Lg[0], Lg[1], Lg[2], Lg[3], 7431);
    else if (o.luggage === 'open') back += reedsOpen(S, Lg[0] + 40, Lg[1], Lg[2], 7432);
    if (o.tap === 'reeds' && o.luggage === 'heap') front += tapRect(S, 'reeds', [Lg[0] - Lg[2] / 2, Lg[1] - Lg[3], Lg[0] + Lg[2] / 2, Lg[1]]);
    return { back: back, over: over, front: front };
  }
  // bubbles over each otter K.crowd drew (it marks each with its head box)
  function bubblesOver(S, svg) {
    var s = '', i = 0, re = /data-head="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/g, m;
    while ((m = re.exec(svg))) {
      var hx = (+m[1] + +m[3]) / 2, hy = +m[2], w = +m[3] - +m[1], r = rng(7441 + i++);
      for (var j = 0; j < 5; j++) {
        var bx = hx + (r() - 0.5) * w * 0.8, by = hy - 14 - j * w * 0.18 - r() * 10, br = w * (0.05 + r() * 0.05);
        s += g(circ(bx, by, br, C.bubble, { opacity: 0.35 }) + circ(bx, by, br, 'none', { stroke: C.bubble, 'stroke-width': n(Math.max(1.4, br * 0.22)) }) + circ(bx - br * 0.35, by - br * 0.35, br * 0.25, '#FFFFFF'),
          { 'class': 'pcs-float', style: 'animation-delay:-' + (j * 1.1 + r()).toFixed(1) + 's' });
      }
    }
    return s ? g(s, { 'data-art': 'bubbles' }) : '';
  }

  // ------------------------------------------------------------------ ROOTS: closer on the three roots

  var ROOTS = {
    trunk: 'M300 -20L340 300Q330 480 260 600L1340 600Q1270 480 1260 300L1300 -20Z',
    roots: {
      'root-1': [[660, 596, 190], [560, 640, 150], [450, 690, 112], [330, 738, 90], [230, 774, 70], [130, 822, 50], [20, 870, 34]],
      'root-2': [[600, 690, 120], [800, 720, 160], [1000, 690, 120]],
      'root-3': [[940, 596, 190], [1040, 640, 150], [1150, 690, 112], [1270, 738, 90], [1370, 774, 70], [1470, 822, 50], [1580, 870, 34]]
    },
    seats: [[70, 960, 'right', 'sit', 0.92], [1530, 960, 'left', 'sit', 0.92, 'reedclan', 4], [170, 1000, 'right', 'sit', 0.96, 'groveclan', 5], [1430, 1000, 'left', 'sit', 0.96, 'otter', 1]]
  };
  function drawRoots(S) {
    var back = '', R = ROOTS, mist = opt(S, 'mist', 'none');
    back += skyBack(S, 600, 1500, 86) + fullMoon(S, 1500, 86, 40);
    back += grass(S, [[-30, 560], [400, 570], [800, 580], [1200, 570], [1640, 560]], 7501, 110);
    back += g(barkFill(S, R.trunk, 260, 1340, -20, 600, 7502), { 'data-art': 'trunk', filter: S.shadow('m') });
    // moonlight through the crown: soft shafts down the bark
    back += g(path('M960 -20L1060 -20L880 600L700 600Z', '#F2F6FF', { opacity: 0.14 }) + path('M1180 -20L1240 -20L1120 600L1020 600Z', '#F2F6FF', { opacity: 0.1 }), { filter: S.blur('isshaft', 20) });
    back += crown(S, -120, 1320, -260, 170, 7503, { leaves: 110, clumps: 18 });
    var roots = '';
    ['root-1', 'root-3', 'root-2'].forEach(function (k, i) { roots += rootBand(S, R.roots[k], 7511 + i); });
    back += g(roots, { filter: S.shadow('m') });
    if (mist !== 'none') back += g(mistBank(S, -40, 1640, 760, 1040, 7521, mist === 'thick' ? 0.7 : 0.5, null) + (mist === 'thick' ? mistBank(S, 200, 1400, 260, 640, 7522, 0.45, null) : ''), { 'data-art': 'mist', 'data-mist': mist });
    back += crowdOf(S, R.seats, 0);
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ CASE: at cat height in the clearing

  var CASE = {
    horizon: 470, moon: [1490, 84, 42],
    river: [[1120, 520], [1640, 516], [1640, 1012], [1580, 1012], [1530, 880], [1440, 740], [1300, 610], [1180, 560]],
    trunk: 'M-80 -20L190 -20Q170 300 210 560Q236 690 300 760L-80 760Z',
    root: [[200, 700, 110], [360, 712, 80], [520, 724, 56], [660, 740, 30]],
    // (the two filling seats furthest back first: each sits behind a nearer seat it meets, and the crowd is drawn in
    // list order, so back to front)
    seats: [[550, 590, 'right', 'sit', 0.82, 'groveclan', 4], [1116, 596, 'left', 'sit', 0.82, 'reedclan', 4],
      [90, 640, 'right', 'sit', 0.86], [320, 610, 'right', 'sit', 0.84], [560, 616, 'right', 'sit', 0.84], [880, 612, 'left', 'sit', 0.84, 'groveclan', 4],
      [1080, 620, 'left', 'sit', 0.84, 'reedclan', 3], [1250, 640, 'left', 'sit', 0.86, 'reedclan', 4], [660, 640, 'right', 'sit', 0.84, 'groveclan', 5], [1360, 680, 'left', 'sit', 0.86, 'otter', 2]],
    small: { one: [[1420, 690, 0.9, -1]], some: [[1250, 670, 0.75, -1], [1380, 700, 0.95, -1], [1500, 660, 0.75, -1], [1560, 720, 0.85, -1]], coming: [[1080, 840, 1.2, -1], [1250, 780, 1.05, -1], [1400, 740, 0.9, -1]] },
    drawing: [900, 980]
  };
  function catDrawing(S, x, y, k) {
    // four legs, two ears and a tail, scratched in the earth (Wisp's): a small bare patch, the lines in it
    var d = 'M' + n(x - 40 * k) + ' ' + n(y - 20 * k) + 'Q' + n(x - 10 * k) + ' ' + n(y - 34 * k) + ' ' + n(x + 24 * k) + ' ' + n(y - 22 * k) +
      'M' + n(x + 24 * k) + ' ' + n(y - 22 * k) + 'Q' + n(x + 44 * k) + ' ' + n(y - 30 * k) + ' ' + n(x + 46 * k) + ' ' + n(y - 16 * k) + 'Q' + n(x + 40 * k) + ' ' + n(y - 4 * k) + ' ' + n(x + 24 * k) + ' ' + n(y - 10 * k) +
      'M' + n(x + 30 * k) + ' ' + n(y - 28 * k) + 'l' + n(2 * k) + ' ' + n(-12 * k) + 'l' + n(6 * k) + ' ' + n(10 * k) + 'M' + n(x + 40 * k) + ' ' + n(y - 27 * k) + 'l' + n(4 * k) + ' ' + n(-11 * k) + 'l' + n(4 * k) + ' ' + n(12 * k) +
      'M' + n(x - 40 * k) + ' ' + n(y - 20 * k) + 'Q' + n(x - 38 * k) + ' ' + n(y - 8 * k) + ' ' + n(x + 20 * k) + ' ' + n(y - 10 * k) +
      'M' + n(x - 34 * k) + ' ' + n(y - 12 * k) + 'l' + n(-2 * k) + ' ' + n(14 * k) + 'M' + n(x - 22 * k) + ' ' + n(y - 11 * k) + 'l' + n(1 * k) + ' ' + n(14 * k) + 'M' + n(x + 6 * k) + ' ' + n(y - 10 * k) + 'l' + n(-1 * k) + ' ' + n(14 * k) + 'M' + n(x + 16 * k) + ' ' + n(y - 10 * k) + 'l' + n(2 * k) + ' ' + n(14 * k) +
      'M' + n(x - 40 * k) + ' ' + n(y - 18 * k) + 'Q' + n(x - 66 * k) + ' ' + n(y - 24 * k) + ' ' + n(x - 60 * k) + ' ' + n(y - 46 * k);
    return g(ell(x, y - 14 * k, 84 * k, 30 * k, C.earth, { opacity: 0.55 }) + stroke(d, C.printDry, 4.4 * k, { 'stroke-linecap': 'round', opacity: 0.95 }) + stroke(d, C.crack, 2 * k, { 'stroke-linecap': 'round', opacity: 0.6 }),
      { 'data-art': 'drawing', 'data-box': boxAttr([x - 84 * k, y - 60 * k, x + 84 * k, y + 16 * k]) });
  }
  function smallShapes(S, list, key) {
    var s = '';
    list.forEach(function (q) { s += smallShape(S, q[0], q[1], q[2], q[3]); });
    return inMist(S, s, key, { 'data-art': 'small', 'data-n': String(list.length) });
  }
  function drawCase(S) {
    var back = '', front = '', P = CASE, o = S.opts, mist = opt(S, 'mist', 'none'), small = opt(S, 'small', 'none');
    back += skyBack(S, P.horizon + 30, P.moon[0], P.moon[1]) + fullMoon(S, P.moon[0], P.moon[1], P.moon[2]);
    back += farBank(S, -20, 1640, P.horizon, 30, 7601);
    back += water(S, [[-30, P.horizon], [1640, P.horizon], [1640, 530], [-30, 530]], 7602, 1100);
    back += grass(S, [[-30, 520], [400, 516], [800, 520], [1200, 530], [1640, 524]], 7603, 170);
    back += water(S, P.river, 7604, 1450);
    back += g(barkFill(S, P.trunk, -80, 300, -20, 760, 7605), { 'data-art': 'trunk', filter: S.shadow('m') });
    back += rootBand(S, P.root, 7606);
    back += crown(S, -200, 1330, -300, 160, 7607, { leaves: 120, clumps: 20 });
    if (mist !== 'none' || small !== 'none') back += g(mistBank(S, 1040, 1660, 420, 760, 7611, mist === 'thick' ? 0.85 : 0.7, [P.moon[0], P.moon[1], 320]) + (mist === 'thick' ? mistBank(S, -40, 1040, 440, 600, 7612, 0.55, null) : ''), { 'data-art': 'mist', 'data-mist': mist === 'none' ? 'small' : mist });
    if (mist !== 'none' || small !== 'none') back += moonThrough(S, P.moon);
    if (small !== 'none' && P.small[small]) back += smallShapes(S, P.small[small], 'issmall');
    back += crowdOf(S, P.seats, 0);
    if (o.drawing === 'cat') back += catDrawing(S, P.drawing[0], P.drawing[1], 1.1);
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ FOX: at the clearing's edge, the river behind

  var FOX = {
    horizon: 420,
    river: [[-30, 420], [1640, 420], [1640, 1012], [1124, 1012], [1170, 820], [1214, 690], [1240, 560], [1180, 470], [-30, 470]],
    seats: [[70, 640, 'right', 'sit', 0.88], [200, 610, 'right', 'sit', 0.86, 'groveclan', 4], [330, 640, 'right', 'sit', 0.86], [470, 610, 'right', 'sit', 0.86, 'reedclan', 3], [600, 636, 'right', 'sit', 0.86, 'otter', 1]],
    moon: [1300, 110, 48]
  };
  function drawFox(S) {
    var back = '', F = FOX, mist = opt(S, 'mist', 'none');
    back += skyBack(S, F.horizon + 40, F.moon[0], F.moon[1]) + fullMoon(S, F.moon[0], F.moon[1], F.moon[2]);
    back += farBank(S, -20, 1640, F.horizon, 32, 7701);
    back += water(S, F.river, 7702, 1300);
    // the clearing's grass to its edge, the bank's lip along the water
    back += grass(S, [[-30, 470], [600, 474], [1000, 480], [1180, 470], [1240, 560], [1214, 690], [1170, 820], [1124, 1012]], 7703, 140);
    back += stroke(smooth([[1180, 470], [1240, 560], [1214, 690], [1170, 820], [1124, 1012]]), C.mudWet, 16, { opacity: 0.6 }) + stroke(smooth([[1180, 470], [1240, 560], [1214, 690], [1170, 820], [1124, 1012]]), C.rip, 3, { opacity: 0.85 });
    back += crown(S, -300, 760, -240, 150, 7704, { leaves: 70 });
    if (mist !== 'none') back += g(mistBank(S, 1100, 1660, 380, mist === 'thick' ? 900 : 700, 7711, mist === 'thick' ? 0.8 : 0.65, [F.moon[0], F.moon[1], 300]) +
      (mist === 'thick' ? mistBank(S, -40, 760, 260, 640, 7712, 0.4, null) : ''), { 'data-art': 'mist', 'data-mist': mist }) + moonThrough(S, F.moon);
    back += crowdOf(S, F.seats, 0);
    var c;
    ['water', 'water-2', 'water-3'].forEach(function (k) { if ((c = at(S, k))) S.covers[k] = ringsOver(S, k, c.a, 0.34); });
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ MIST: Mama's face out of the mist

  var MIST = {
    horizon: 560, moon: [1300, 150, 50],
    trunk: 'M-80 -20L230 -20Q210 360 250 640Q270 740 330 800L-80 800Z',
    bank: [760, 1660, 120, 900], veil: [1360, 1620, 200, 1000],
    tail: [1450, 170, 0.9],
    grown: [[1080, 300, 0.75, -1], [1500, 330, 0.9, -1], [1300, 170, 0.55, -1]],
    // (the small shapes in the mist band at the left, beside Mama: at her right they sat behind her face and neck, and
    // under her nose behind Sprinkle at `nose`; three for 'some', the right edge being all Mama's neck)
    small: { one: [[580, 590, 0.8, -1]], some: [[420, 560, 0.6, -1], [570, 600, 0.75, -1], [700, 530, 0.6, -1]], coming: [[1040, 940, 1.2, -1], [1210, 900, 1.05, -1], [1370, 860, 0.95, -1]] }
  };
  function tailTip(S, x, y, k) {
    // the tip of a huge, soft grey tail, curling up through the mist, rounded ridges along it
    var d = 'M' + n(x + 220 * k) + ' ' + n(y + 140 * k) + 'Q' + n(x + 40 * k) + ' ' + n(y + 120 * k) + ' ' + n(x - 20 * k) + ' ' + n(y + 20 * k) + 'Q' + n(x - 60 * k) + ' ' + n(y - 70 * k) + ' ' + n(x + 20 * k) + ' ' + n(y - 100 * k) +
      'Q' + n(x + 90 * k) + ' ' + n(y - 120 * k) + ' ' + n(x + 100 * k) + ' ' + n(y - 60 * k) + 'Q' + n(x + 96 * k) + ' ' + n(y - 20 * k) + ' ' + n(x + 56 * k) + ' ' + n(y - 30 * k) +
      'Q' + n(x + 40 * k) + ' ' + n(y - 60 * k) + ' ' + n(x + 16 * k) + ' ' + n(y - 40 * k) + 'Q' + n(x - 4 * k) + ' ' + n(y + 20 * k) + ' ' + n(x + 60 * k) + ' ' + n(y + 60 * k) + 'Q' + n(x + 140 * k) + ' ' + n(y + 86 * k) + ' ' + n(x + 240 * k) + ' ' + n(y + 70 * k) + 'Z';
    var ridge = 'M' + n(x - 20 * k) + ' ' + n(y - 10 * k) + 'l' + n(-16 * k) + ' ' + n(-8 * k) + 'M' + n(x - 14 * k) + ' ' + n(y - 60 * k) + 'l' + n(-14 * k) + ' ' + n(-14 * k) + 'M' + n(x + 30 * k) + ' ' + n(y - 102 * k) + 'l' + n(-4 * k) + ' ' + n(-18 * k);
    return g(path(d, C.shape) + stroke(ridge, C.shapeDk, 9 * k, { 'stroke-linecap': 'round' }) + path(d, 'none', { stroke: C.shapeLt, 'stroke-width': n(4 * k) }), { 'data-art': 'tail', 'data-box': boxAttr([x - 60 * k, y - 120 * k, x + 240 * k, y + 140 * k]) });
  }
  // the thin veil in the over layer (thick mist on `mist` and `sky`): soft wisps at the panel's right only, each
  // left out where it would cross a face at speak, mentor, nose or mama
  function veil(S, zone, names, seed) {
    var faces = [], r = rng(seed), s = '';
    names.forEach(function (k) { var c = at(S, k); if (c) faces.push(headAt(S, c.m, c.a)); });
    for (var i = 0; i < 14; i++) {
      var x = lerp(zone[0], zone[1], r()), y = lerp(zone[2], zone[3], r()), rx = 70 + r() * 90, ry = 26 + r() * 30, b = [x - rx, y - ry, x + rx, y + ry];
      if (faces.some(function (f) { return meets(b, f, 20); })) continue;
      s += ell(x, y, rx, ry, C.mist);
    }
    return s ? g(g(s, { filter: S.blur('isveil', 16) }), { 'data-art': 'veil', opacity: '0.45', 'data-zone': boxAttr([zone[0], zone[2], zone[1], zone[3]]) }) : '';
  }
  function drawMist(S) {
    var back = '', over = '', front = '', M = MIST, o = S.opts, mist = opt(S, 'mist', 'none'), small = opt(S, 'small', 'none');
    back += skyBack(S, M.horizon, M.moon[0], M.moon[1]) + fullMoon(S, M.moon[0], M.moon[1], M.moon[2]);
    back += farBank(S, -20, 1640, M.horizon - 60, 30, 7801);
    back += water(S, [[-30, M.horizon - 60], [1640, M.horizon - 60], [1640, M.horizon + 30], [-30, M.horizon + 30]], 7802, 1300);
    back += grass(S, [[-30, M.horizon + 20], [500, M.horizon + 26], [1000, M.horizon + 30], [1640, M.horizon + 20]], 7803, 150);
    back += g(barkFill(S, M.trunk, -80, 330, -20, 800, 7804), { 'data-art': 'trunk', filter: S.shadow('m') });
    back += crown(S, -320, 820, -260, 170, 7805, { leaves: 80 });
    if (mist !== 'none') {
      var B = M.bank;
      back += g(mistBank(S, B[0], B[1], mist === 'thick' ? B[2] : 420, B[3], 7811, mist === 'thick' ? 0.92 : 0.8, [M.moon[0], M.moon[1], 360]) + (mist === 'thick' ? mistBank(S, 200, 900, 300, 780, 7812, 0.45, null) : ''),
        { 'data-art': 'mist', 'data-mist': mist, 'data-box': boxAttr([B[0], mist === 'thick' ? B[2] : 420, B[1], B[3]]) });
      if (o.grown === true) back += inMist(S, M.grown.map(function (q, i) { return grownShape(S, q[0], q[1], q[2], q[3], 7821 + i); }).join(''), 'isgrown', { 'data-art': 'grown', 'data-n': String(M.grown.length) });
      back += moonThrough(S, M.moon);
      if (o.tail === true) back += tailTip(S, M.tail[0], M.tail[1], M.tail[2]);
      if (o.tap === 'mist') front += tapRect(S, 'mist', [1000, 300, 1560, 760]);
    } else if (o.grown === true) back += inMist(S, M.grown.map(function (q, i) { return grownShape(S, q[0], q[1], q[2], q[3], 7821 + i); }).join(''), 'isgrown', { 'data-art': 'grown', 'data-n': String(M.grown.length) });
    if (small !== 'none' && M.small[small]) back += smallShapes(S, M.small[small], 'issmall');
    if (mist === 'thick') over += veil(S, M.veil, ['speak', 'mentor', 'nose', 'mama'], 7831);
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ SKY: looking up past the crown

  var SKY = {
    moon: [860, 300, 110], veil: [1300, 1620, 120, 1000],
    grown: [[1200, 780, 0.8, -1], [1480, 840, 0.7, -1]],
    rising: [[1160, 420, 0.75, 1], [1420, 280, 0.6, 1], [1520, 560, 0.5, 1]], risingSmall: [1290, 600, 0.7, 1],
    zip: [720, 800, 1]
  };
  function zipper(S, x, y, k) {
    // one small winged shape zipping off left toward the towers, speed lines, a ring of hiccup mist behind it
    var s = '', f = -1;
    s += ell(x + 70 * k, y + 4 * k, 15 * k, 10 * k, 'none', { stroke: '#EEF3FF', 'stroke-width': n(3.6 * k), opacity: 0.9 }) + ell(x + 70 * k, y + 4 * k, 15 * k, 10 * k, '#EEF3FF', { opacity: 0.25 });
    s += stroke('M' + n(x + 20 * k) + ' ' + n(y - 6 * k) + 'h' + n(36 * k) + 'M' + n(x + 24 * k) + ' ' + n(y + 8 * k) + 'h' + n(28 * k), '#EEF3FF', 2.4 * k, { opacity: 0.7 });
    s += path('M' + n(x + 14 * k) + ' ' + n(y + 2 * k) + 'Q' + n(x) + ' ' + n(y - 8 * k) + ' ' + n(x - 18 * k) + ' ' + n(y - 2 * k) + 'Q' + n(x - 24 * k) + ' ' + n(y + 4 * k) + ' ' + n(x - 16 * k) + ' ' + n(y + 6 * k) + 'Q' + n(x) + ' ' + n(y + 10 * k) + ' ' + n(x + 14 * k) + ' ' + n(y + 2 * k) + 'Z', '#5E6A82');
    s += path('M' + n(x) + ' ' + n(y - 2 * k) + 'Q' + n(x + 6 * k) + ' ' + n(y - 30 * k) + ' ' + n(x + 22 * k) + ' ' + n(y - 34 * k) + 'Q' + n(x + 12 * k) + ' ' + n(y - 16 * k) + ' ' + n(x + 8 * k) + ' ' + n(y + 2 * k) + 'Z', '#48546C');
    return g(s, { 'data-art': 'zip', 'data-box': boxAttr([x - 30 * k, y - 40 * k, x + 90 * k, y + 20 * k]) });
  }
  function drawSky(S) {
    var back = '', over = '', M = SKY, o = S.opts, mist = opt(S, 'mist', 'none');
    var st = [];
    for (var i = 0; i < C.sky.length; i++) st.push([i / (C.sky.length - 1), C.sky[i]]);
    back += rect(-10, -10, 1620, 1020, S.linU(st, 0, 0, 0, 1000));
    back += circ(M.moon[0], M.moon[1], 900, S.radU([[0, C.skyGlow, 0.5], [0.3, C.skyGlow, 0.18], [1, C.skyGlow, 0]], M.moon[0], M.moon[1], 900));
    back += K.stars(S, 0, 0, 1600, 900, 520, 7901);
    back += fullMoon(S, M.moon[0], M.moon[1], M.moon[2]);
    // far below at the left, the river and the towers tiny far off downriver
    // far below, the river and the towers tiny far off downriver, along the bottom
    back += farBank(S, 380, 1240, 952, 22, 7905);
    back += towersFar(S, [[500, 880, 22, 952], [532, 860, 18, 952], [558, 892, 24, 952], [590, 874, 16, 952], [616, 900, 20, 952]]);
    back += water(S, [[380, 952], [1240, 952], [1240, 1012], [380, 1012]], 7902, 600);
    // the great tree's crown, from below, filling the bottom left corner
    back += crown(S, -420, 520, 720, 1400, 7903, { leaves: 70, branches: 0 });
    if (mist !== 'none') back += g(mistBank(S, 900, 1660, mist === 'thick' ? 620 : 800, 1060, 7911, mist === 'thick' ? 0.92 : 0.8, null), { 'data-art': 'mist', 'data-mist': mist }) + moonThrough(S, M.moon);
    if (o.grown === true) back += inMist(S, M.grown.map(function (q, i) { return grownShape(S, q[0], q[1], q[2], q[3], 7921 + i); }).join(''), 'isgrown', { 'data-art': 'grown', 'data-n': String(M.grown.length) });
    if (o.rising === true) {
      var rs = M.rising.map(function (q, i) { return grownShape(S, q[0], q[1], q[2] * 0.7, q[3], 7931 + i); }).join('') + smallShape(S, M.risingSmall[0], M.risingSmall[1], M.risingSmall[2], 1);
      back += inMist(S, rs, 'isrise', { 'data-art': 'rising', 'data-n': String(M.rising.length + 1) });
    }
    if (o.zip === true) back += zipper(S, M.zip[0], M.zip[1], M.zip[2] * 2);
    if (mist === 'thick') over += veil(S, M.veil, ['nose'], 7941);
    return { back: back, over: over, front: '' };
  }

  // ------------------------------------------------------------------ PAWS: close on her forepaws

  function drawPaws(S) {
    var back = '', r = rng(8001), i;
    // the moonlit grass close up, the clearing soft behind, the moon's light from the upper left
    back += rect(-10, -10, 1620, 1020, S.linU([[0, C.grassFar], [0.5, C.grass], [1, C.grassNear]], 0, 0, 0, 1000));
    back += circ(160, -40, 1100, S.radU([[0, '#F4F8FF', 0.5], [0.4, '#E2EBFC', 0.18], [1, '#E2EBFC', 0]], 160, -40, 1100));
    var soft = '';
    for (i = 0; i < 14; i++) soft += blob(lerp(-40, 1640, r()), lerp(40, 420, r()), 90 + r() * 140, 30 + r() * 40, 9, r, 0.3, 0.3);
    back += g(path(soft, C.grassLt, { opacity: 0.5 }), { filter: S.blur('ispaws', 16) });
    var a = '', b = '';
    for (i = 0; i < 160; i++) {
      var x = lerp(-30, 1630, r()), y = lerp(300, 1010, Math.pow(r(), 0.6)), k = lerp(0.8, 2.6, (y - 300) / 700), dd = '';
      for (var j = 0; j < 3; j++) dd += bladeD(x + (j - 1) * 7 * k, y, (14 + r() * 18) * k, (j - 1) * 7 * k, 2.4 * k);
      if (r() < 0.5) a += dd; else b += dd;
    }
    back += path(a, C.blade, { opacity: 0.7 }) + path(b, C.bladeLt, { opacity: 0.75 });
    return { back: g(back, { 'data-art': 'grass' }), over: '', front: '' };
  }

  // ------------------------------------------------------------------ the set

  function draw(S) {
    if (S.comp === 'shore') return drawShore(S);
    if (S.comp === 'roots') return drawRoots(S);
    if (S.comp === 'case') return drawCase(S);
    if (S.comp === 'fox') return drawFox(S);
    if (S.comp === 'mist') return drawMist(S);
    if (S.comp === 'sky') return drawSky(S);
    if (S.comp === 'paws') return drawPaws(S);
    return drawWide(S);
  }

  // a leader's spot on a root: its x, its feet on the root's top there
  function onRoot(P, x, h, face) { return A(x, Math.round(rootTop(P, x)), h, face); }

  art.defineSet('island', {
    label: 'Gathering Island: the clearing under the great tree', tod: 'night', todFixed: 'night', draw: draw,
    cams: {
      shore: { box: [0, 0, 1600], comp: 'shore' },
      wide: { box: [0, 0, 1600] },
      roots: { box: [0, 0, 1600], comp: 'roots' },
      case: { box: [0, 0, 1600], comp: 'case' },
      fox: { box: [0, 0, 1600], comp: 'fox' },
      mist: { box: [0, 0, 1600], comp: 'mist' },
      sky: { box: [0, 0, 1600], comp: 'sky' },
      paws: { box: [0, 0, 1600], comp: 'paws' }
    },
    anchors: {
      // stepping off, up the slope; the poler at the ferry's front at the water's edge; Riffle on the mud by the
      // heap; the print's spot on the mud, her nose to it
      shore: {
        'land-1': A(1010, 880, 280, 'right'), 'land-2': A(1190, 820, 262, 'right'), 'land-3': A(1360, 760, 244, 'right'),
        raft: A(330, 812, 264, 'right'), drag: A(840, 960, 292, 'right'), print: A(760, 964, 292, 'right')
      },
      // the roots behind every Clan spot (the depth rule): the leaders on the roots; the ring's front; the elder at
      // its back left; our cat in the middle; the river edge at the right; the heap's place at the left edge
      main: {
        'root-1': onRoot(WIDE.roots['root-1'], 520, 186, 'right'), 'root-2': A(800, Math.round(556 - 50), 190, 'right'), 'root-3': onRoot(WIDE.roots['root-3'], 1000, 186, 'left'),
        'crowd-1': A(300, 800, 262, 'right'), 'crowd-2': A(500, 890, 292, 'right'), 'crowd-3': A(150, 690, 228, 'right'),
        'crowd-4': A(1130, 690, 232, 'left'), 'crowd-5': A(1290, 790, 262, 'left'), 'crowd-6': A(1210, 920, 300, 'left'),
        elder: A(360, 640, 220, 'right'), centre: A(780, 880, 290, 'right'), beside: A(990, 900, 296, 'left'),
        edge: A(1420, 720, 238, 'left'), 'edge-2': A(1520, 800, 262, 'left'), 'edge-3': A(1350, 640, 214, 'left'),
        bank: A(1460, 940, 302, 'left'), luggage: A(140, 960, 300, 'right')
      },
      roots: {
        'root-1': onRoot(ROOTS.roots['root-1'], 330, 300, 'right'), 'root-2': A(800, Math.round(720 - 80), 300, 'right'), 'root-3': onRoot(ROOTS.roots['root-3'], 1270, 300, 'left'),
        step: A(800, 950, 340, 'right'), 'near-1': A(520, 960, 340, 'right'), 'near-2': A(1080, 960, 340, 'left')
      },
      case: {
        speak: A(600, 940, 350, 'right'), beside: A(930, 950, 352, 'left'), mentor: A(330, 880, 324, 'right'),
        root: A(470, Math.round(rootTop(CASE.root, 470)), 272, 'right', { elev: true }),
        fox: A(1380, 810, 300, 'left'), 'weasel-1': A(1440, 950, 330, 'left'), 'weasel-2': A(1330, 985, 345, 'left'),
        'front-1': A(170, 724, 252, 'right'), 'front-2': A(760, 694, 244, 'right'), 'front-3': A(990, 702, 246, 'left'), 'front-4': A(1190, 700, 246, 'left')
      },
      fox: {
        fox: A(620, 930, 360, 'left'), 'weasel-1': A(860, 952, 330, 'left'), 'weasel-2': A(1000, 884, 304, 'left'),
        water: A(1390, 770, 250, 'right', { air: true }), 'water-2': A(1260, 885, 300, 'right', { air: true }), 'water-3': A(1200, 960, 320, 'right', { air: true })
      },
      mist: {
        mama: A(1360, 1060, 440, 'left', { elev: true }), eldest: A(1480, 1000, 400, 'left', { elev: true }),
        nose: A(820, 936, 330, 'right'), beside: A(760, 898, 312, 'right'),
        speak: A(470, 962, 346, 'right'), mentor: A(240, 914, 322, 'right'), 'front-1': A(120, 800, 282, 'right'), 'front-2': A(340, 786, 276, 'right')
      },
      sky: {
        fly: A(600, 660, 250, 'right', { elev: true, air: true }), nose: A(1270, 560, 240, 'left', { elev: true, air: true }), far: A(1240, 300, 96, 'right', { elev: true, air: true })
      },
      paws: { close: A(470, 1004, 1300, 'right'), above: A(1250, 640, 420, 'left', { elev: true }) }
    },
    opts: { crowd: [false, true, 'standing'], luggage: ['none', 'heap', 'open'], ferry: [false, true], print: [false, true], mist: ['none', 'rolling', 'thick'],
      tail: [false, true], grown: [false, true], small: ['none', 'one', 'some', 'coming'], rising: [false, true], zip: [false, true], drawing: ['none', 'cat'],
      bubbles: [false, true], tap: ['none', 'reeds', 'mist', 'print'] },
    defaults: {}
  });

  // For the tests: the geometry of each camera, the seats each gives the crowd, the roots' tops.
  art.islandInfo = function () {
    var copy = function (o) { return JSON.parse(JSON.stringify(o)); };
    return {
      colours: copy(C), shore: copy(SHORE), wide: copy(WIDE), roots: copy(ROOTS), case: copy(CASE), fox: copy(FOX), mist: copy(MIST), sky: copy(SKY),
      seats: { wide: copy(WIDE.seats), roots: copy(ROOTS.seats), case: copy(CASE.seats), fox: copy(FOX.seats) },
      rootTop: rootTop, inPoly: inPoly
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
