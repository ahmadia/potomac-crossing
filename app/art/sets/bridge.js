/* Potomac Crossing · app/art/sets/bridge.js
 *
 * The set: the Old Bridge (chapters 2 to 5), the rail bridge's near (Virginia) end, by day: old stone
 * legs, an iron truss on top, the river brown and swirly after the storm, the reeds squashed flat.
 *
 * Five compositions in the 1600 x 1000 world, one per camera (docs/build.md, "Art vocabulary,
 * chapter 2", and "Chapter 3 (v0.4)"), each camera showing the whole of its own:
 *   main   `bank`: wide from the riverbank. The bridge runs from its near end at the left out
 *          across the river to the right; the dark space under the near end sits at the left, a
 *          rock at its shadow's edge, and a trail of drag marks through flattened reeds comes up
 *          out of the river into it. Anchors: `bank-left`, `bank-right` (the near bank), `reeds`
 *          (among the reeds at the water, facing the dark), and, small at the dark's mouth,
 *          `rock` (on Riffle's rock) and `edge` (the shadow's edge).
 *   mouth  `mouth`: close on the dark from outside in the sun. The deck's iron edge across the
 *          top, a stone leg each side, and between them the bank climbing up under the deck into
 *          a deep wedge of dark (the den). Anchors: `rock` (elevated, on Riffle's rock, left),
 *          `edge` (the shadow's edge, middle), `sun` (in the sunshine, front right), `sun-edge`
 *          (in the sun just out of the shadow, beside `sun`).
 *   under  `under`: inside the dark, her view. Slivers of daylight and the river between the
 *          stone legs at the left; mud by the water with deep drag marks coming up out of it and
 *          running on into the dark; dry ground rising at the back to meet the deck; drips.
 *          Anchors: `mud` (by the water, front), `inside` (further in, on the marks).
 *   back   `back`: the very back of the dark. A heap of old stones with a dry nook in it, where
 *          `eyes` shows two big round shining eyes ('open'), half closed ('blink'), or nothing;
 *          'sprinkle' (chapter 3) draws them at her size, where her face is at `dragon` next panel.
 *          Anchors: `near` (big, bottom left, looking in; a ridge of mud hides its paws), and
 *          (chapter 3) `dragon` (Sprinkle's spot, sitting in the nook's mouth, a heron-sized dragonet
 *          whose head is well above any cat's, facing the way in), `beside` (a cat pressed against
 *          her flank, a step nearer, so drawn after her it sits against her body: list Sprinkle first),
 *          `back-left` and `back-right` (Riffle and Tallyheart, nearer, either side of her). Depth
 *          runs h = y - 560 here (a cat-height camera), so the four sit in one believable floor.
 *   paws   `paws` (chapter 3): the dry floor at the back of the dark, close, from above; with
 *          `pawsIn: true` the three forepaws of the promise piled in a warm pool of light, fanned
 *          and offset so all fifteen claws show and can be counted: hers (from the player's look,
 *          its fur and white paws), Sprinkle's (big, mist grey, five long pale claws) and Riffle's
 *          (webbed, brown). Frame art, not a Counts picture. No anchors: a face is never in it.
 *
 * Options: `train: true` (an Ironsnake crossing on top: the whole train in `bank`, its cars and
 * wheels right overhead in `mouth`, grit shaken down in `under` and `back`), `eyes` ('none' |
 * 'open' | 'blink', drawn in `back`, and small in `under`; the render's `keep` names them so the
 * lettering stays off), `drag` (default true), `drips` (default true; they fall with the shared
 * pcs-float animation, so reduced motion leaves them hanging).
 * Chapter 3: `pebble: 'in' | 'out' | 'paws'` (`mouth` and `under`: Riffle's fifth juggling pebble,
 * a plain round brown one, in the dark, rolling out, or at her paws: the player's, else the first
 * cat's, else a spot of the camera's own; kept clear of the lettering), `branch: true` (a fallen
 * branch dragged across the back: in `back`, in front of `dragon`, so she can peek over it; small,
 * a heap of sticks, at the far back in `under`), `prints: true` (Sprinkle's big five-claw prints,
 * each as big as a heron's foot, beside the drag marks in `under` and `back`, alternating sides,
 * never mentioned: chapter 7 compares the weasel's tiny ones against them; off by default so
 * chapter 2's frames keep their look, and chapter 3 and every later chapter set it wherever the
 * drag marks show), `pawsIn: true` (the `paws` camera's three forepaws; with `hop: true` each paw's
 * five claws lit gold and its running total, 5, 10, 15, lettered beyond them). At `sunset` and `dusk`
 * the light under the bridge changes (chapter 2 is all `day`): the low sun reaches far in as long
 * gold shafts, or dusk leaves a soft rose light by the way in, so the dark still reads.
 *
 * Chapter 4 (docs/build.md, "Chapter 4 (v0.4)"): `pawsIn: 'both'`, the thirty-claw promise: six forepaws
 * piled, a friend's pair to a layer, in the text's order (Sprinkle holds out both forepaws; hers go on
 * top; then Riffle's), fanned so all thirty claws show: three rows of ten, hers reaching in from the
 * bottom edge as her own forepaws do. The hop lights a friend's pair at a time: `hop: true` every
 * friend, or a count (`hop: 2`, or `lit: 2`: the first two friends in pile order; the promise Tap
 * passes its taps), each lit pair's ten claws warm gold and its running total (10, 20, 30) lettered
 * beside them. The pile is <g data-art="paws"> (with data-lit, the friends lit, when 'both'): the
 * Tap's target, and what wiggles.
 *
 * Chapter 5 (docs/chapters/05-riffles-river.md, "Art needs" and "Build"): the Old Bridge at sunset.
 *   `bank` gains the anchor `water`: swimming in the river just off the bank, where the reeds part
 *   (Riffle, swimming alongside as she walks home). The brown river closes over whoever is there, with
 *   rings round them, and any reed that stands in front of them is drawn in front; he is drawn before
 *   everyone on the bank, whatever the cast's order. `fx: ['sunset']`
 *   lights the bank as it lights the dark, the sun low behind the truss (going behind the far shore at
 *   dusk); chapters 2 to 4 only ever came to the bank by day, under a high sun.
 *   `mudPaws: 6 | 7` (on `back`): little forepaws drawn in the mud with one claw, a palm and five claw
 *   marks each, on the floor in front of Sprinkle's spot: chapter 3's six drawn again (two rows of
 *   three), and with 7 her own beside them, nearest her (four above three, as the mud count's picture
 *   lays them). <g data-art="mud-paws">, each paw <g data-paw="mud"> with five data-claw="mud"; in
 *   `keep`. They are drawings: nothing lights here (the count's own picture does that).
 *
 * Chapter 6 (docs/chapters/06-the-snake-in-the-stones.spec.md, section 4, the bridge row): Coil's stones.
 *   `stones: true` (on `back`; off by default, so chapters 3 to 5's back is as it was): the bridge's stone leg
 *   beside Sprinkle's nook, at the left, big old fitted stones (courses of uneven height, worn corners, a few
 *   cracks, moss in the low joints) standing on the dry floor, with one dark gap low in its bottom course where
 *   a block is long gone: Coil's door (<g data-art="leg">, the gap <g data-art="gap" data-x0 data-x1 data-top
 *   data-foot>, in `keep`). Anchor `gap` at its mouth, on the floor (h = y - 560, as the others): Coil's head
 *   there, his body trailing back along the wall's foot to the panel's left edge, behind every spot.
 *   Camera `wall`, its own composition (Coil's close beats): at cat height, the leg across the middle distance,
 *   its far end at the right where the dark of the back goes on, its gap low a little over a quarter of the
 *   way across, the dry floor in front, the deck's beam overhead. Anchors (back's names): `gap` (Coil, facing
 *   the cats; his body trails off the panel's left edge; its height is his size in this close shot, not a
 *   depth: his head about two fifths of our cat's beside him, as chapter 6 draws him in `back` with
 *   `size`), `back-left` (our cat, near, between the gap and the
 *   centre, facing it), `back-right` (Riffle, near, on the right), `dragon` (at the right edge, her feet far
 *   below the panel: only Sprinkle's head and neck come in; drawn behind the others, out of the depth sums).
 *   No `near`, no `beside`. `train: true` shakes grit down in front of the wall; `drips` as ever; the
 *   evening light as in `back`. Nobody's spot covers the gap or Coil's head (tests/set-bridge.test.js).
 *
 * Chapter 7 (docs/chapters/07-the-counts-dont-lie.spec.md, section 4, the bridge row): every option off by
 * default and the camera additional, so chapters 2 to 6 draw as they did.
 *   `tap: 'print'` (on `under`, with `prints: true`): the Tap's target, an unpainted <rect class="pc-tap"
 *   data-tap="print"> on the nearest of her big prints that lies wholly in the picture and clear of the spot
 *   at `mud` (where she crouches, looking down at it); first in `keep`.
 *   `compare: [24, 60]` (on `under`): the sum scratched in the open mud right of `mud`, in the kit's
 *   compareLines (the hollow's drawing): a short line by 24, one two and a half times as long by 60, on a
 *   patch of smoothed mud; clear of the drag marks, every print and the spots at `mud`, `inside` and
 *   { x: 400, y: 940 }; in `keep`. <g data-art="compare" data-nums data-box aria-label>.
 *   `wing: true` (on `back`; final review): Sprinkle's drooping wing, where her `wings` pose at `dragon` holds
 *   it out low toward `back-right`, goes in `keep` (WING_KEEP), so no balloon covers the evidence that she
 *   can't fly (the FLY panels); nothing is drawn, and off it is exactly as before.
 *   Camera `print`, its own composition: at cat height, close on the mud, one of her big prints in front
 *   (<g data-art="print">, its lit rim <g data-art="print-rim"> drawn after her shadows), the drag marks'
 *   edge along the right. Anchor `over`: our cat crouched with `reach: true`, her paw over the print's heel
 *   pad, its toes and claws fanned out beyond toward us (the spot is where the paw hangs, `air` and `elev`,
 *   as the marsh's `raft-edge`); the set lays her feet line just above the print and draws her shadows.
 *
 * Chapter 9 (docs/chapters/09-featherlight.spec.md, section 4, "The sunny bank"): every option off by default and every
 * anchor additional, so chapters 2 to 8 draw as they did (tests/set-bridge.test.js holds the fingerprints).
 *   `shallows: true` (on `bank`): the water at the bank's edge bright and clear in the sun, pale green-gold over a sandy
 *   bottom you can see (its ripples, pebbles and the sun's net of light), sparkles and small rings, fading softly into the
 *   brown river beyond (<g data-art="shallows">); and a strip of soft pale sand along the edge (<g data-art="sand">),
 *   tucked at the bridge's foot (the edge of its shadow lies over the strip's left end) and screened from the river path
 *   by the reeds, which part along the sand and stand again past it. Never dark. The friends' corner reeds at the
 *   bottom left are shorter with it, so whoever watches there shows; `reeds`' own cover is drawn only for someone there.
 *   Anchors on `bank` (`main`): `run` (on the sand, mid-right: Sprinkle at heron size), `run-2` (on the sand left of
 *   it, facing her), `skim` (between run and paddle at the water's edge, her paws just clear of the sand; elev, air),
 *   `air` (above run, her paws about a third of a cat's height off the sand: the lift; elev, air), `paddle` (in the
 *   shallows; air), `watch-1` … `watch-4` (the friends side by side on the bank at the left, in the edge of the bridge's
 *   shadow, facing right). The set lays the shadows at the spots in the air: a soft one on the sand under whoever is at
 *   `air` and a fainter one under `skim` (<g data-art="air-shadow">, "skim-shadow"), each only when someone is there
 *   (scenes.js lays none at an `air` spot, and NO_SHADOW.sprinkle stops her own); whoever is at `paddle` has the bright
 *   water laid back over her legs (her chest, splashing), its top a little wavy, rings and drops round her, nothing dark
 *   in it (<g data-art="paddle">). PC.art.bridgeBankInfo() gives the tests the edge, the sand and the shallows.
 *
 * The dark is mysterious and a little sad, never scary: cool blues with faint shapes of stones and
 * mud in them, soft rounded shapes, a warm rim of daylight at its edges, and gentle round eyes.
 * The rocks are drawn in the `over` layer, so a custom spot `{ x, y, z: 'behind' }` just behind
 * one hides all but a head. Registered with PC.art.defineSet (app/art/scenes.js); the painters
 * come from PC.art.kit.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});
  var K = art.kit;
  if (!K || !art.defineSet) return;

  var n = K.n, rng = K.rng, mix = K.mix, lerp = K.lerp, clamp = K.clamp;
  var rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke, pts = K.pts, g = K.g;
  var dot = K.dot, bladeD = K.bladeD, leafD = K.leafD, blob = K.blob, mound = K.mound, bez3 = K.bez3;
  var A = K.anchor;

  // ------------------------------------------------------------------ colours

  function cols(S) {
    var p = S.pal, sh = p.shade, far = p.sky[p.sky.length - 1];
    return {
      water: mix('#92704A', p.water, 0.14), waterDk: mix('#664A30', p.water, 0.1), waterFar: mix('#AE8E66', far, 0.34),
      swirl: mix('#E8D3AA', p.rim, 0.2), foam: mix('#F6EEDF', p.rim, 0.25),
      mud: mix('#86684A', p.sand, 0.12), mudWet: mix('#5C4532', sh, 0.08), mudDk: mix('#3F2E20', sh, 0.18), mudLt: mix('#B39472', p.rim, 0.3),
      iron: mix('#526170', p.ink, 0.12), ironDk: mix('#333D49', p.ink, 0.2), ironLt: mix('#9AAAB6', p.rim, 0.35), rivet: mix('#6E7E8C', p.rim, 0.2),
      stone: mix(p.stone, '#B9A890', 0.25), stoneDk: mix(p.stoneDark, '#77685A', 0.25), stoneLt: mix(p.stoneLight, '#F1E4CC', 0.25),
      reed: mix('#A39552', p.grass, 0.32), reedDk: mix('#6C6634', p.grassNear, 0.35), reedLt: mix('#D8CA90', p.rim, 0.3), tail: mix('#6E4A30', sh, 0.08),
      // the dark under the bridge: deep blues, never black, so faint shapes still read on an iPad
      dark0: mix('#18223A', sh, 0.2), dark1: mix('#202D48', sh, 0.15), dark2: mix('#2C3C5A', sh, 0.12), dark3: mix('#3E5274', sh, 0.08),
      dark4: mix('#5C7296', p.rim, 0.1), drop: '#C4DDEE',
      warm: mix(p.glow || '#FFE2A8', '#FFCB78', 0.4)
    };
  }

  // ------------------------------------------------------------------ geometry

  // A point on the cubic P = [a, b, c, d] at t, with its unit tangent and normal.
  function along(P, t) {
    var q = bez3(P[0], P[1], P[2], P[3], t), a = bez3(P[0], P[1], P[2], P[3], Math.max(0, t - 0.01)), b = bez3(P[0], P[1], P[2], P[3], Math.min(1, t + 0.01));
    var tx = b[0] - a[0], ty = b[1] - a[1], l = Math.sqrt(tx * tx + ty * ty) || 1;
    return { x: q[0], y: q[1], tx: tx / l, ty: ty / l, nx: -ty / l, ny: tx / l };
  }
  // A closed ribbon along the cubic P from t0 to t1: `off` from the curve and `w` wide, both
  // easing from their t = 0 to their t = 1 values. `wob` roughens the edges (churned mud).
  function ribbon(P, off0, off1, w0, w1, t0, t1, steps, wob) {
    var L = [], R = [], k = steps || 20;
    for (var i = 0; i <= k; i++) {
      var t = lerp(t0, t1, i / k), a = along(P, t), o = lerp(off0, off1, t), w = lerp(w0, w1, t) / 2;
      var wl = wob ? w * (1 + wob * Math.sin(t * 37 + 1.3) * 0.6 + wob * Math.sin(t * 91) * 0.4) : w, wr = wob ? w * (1 + wob * Math.sin(t * 43 + 4.1) * 0.6 + wob * Math.sin(t * 79 + 2) * 0.4) : w;
      L.push([a.x + a.nx * (o - wl), a.y + a.ny * (o - wl)]);
      R.push([a.x + a.nx * (o + wr), a.y + a.ny * (o + wr)]);
    }
    return pts(L.concat(R.reverse())) + 'Z';
  }
  // A straight member from a to b, w0 wide at a and w1 at b.
  function bar(a, b, w0, w1) {
    var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / l, ny = dx / l;
    if (w1 == null) w1 = w0;
    return pts([[a[0] + nx * w0 / 2, a[1] + ny * w0 / 2], [b[0] + nx * w1 / 2, b[1] + ny * w1 / 2], [b[0] - nx * w1 / 2, b[1] - ny * w1 / 2], [a[0] - nx * w0 / 2, a[1] - ny * w0 / 2]]) + 'Z';
  }
  // A smooth open path through the points (quadratic through the midpoints).
  function smooth(P) {
    var d = 'M' + n(P[0][0]) + ' ' + n(P[0][1]);
    for (var i = 1; i < P.length - 1; i++) d += 'Q' + n(P[i][0]) + ' ' + n(P[i][1]) + ' ' + n((P[i][0] + P[i + 1][0]) / 2) + ' ' + n((P[i][1] + P[i + 1][1]) / 2);
    return d + 'L' + n(P[P.length - 1][0]) + ' ' + n(P[P.length - 1][1]);
  }
  // y of a left-to-right polyline at x
  function yOn(P, x) {
    if (x <= P[0][0]) return P[0][1];
    for (var i = 1; i < P.length; i++) if (P[i][0] >= x) { var a = P[i - 1], b = P[i]; return lerp(a[1], b[1], (x - a[0]) / ((b[0] - a[0]) || 1)); }
    return P[P.length - 1][1];
  }
  function quad(Q) { return pts(Q) + 'Z'; }
  // a point inside the quad Q = [top-left, top-right, bottom-right, bottom-left] at (u, v)
  function inQuad(Q, u, v) {
    var tx = lerp(Q[0][0], Q[1][0], u), ty = lerp(Q[0][1], Q[1][1], u), bx = lerp(Q[3][0], Q[2][0], u), by = lerp(Q[3][1], Q[2][1], u);
    return [lerp(tx, bx, v), lerp(ty, by, v)];
  }

  // ------------------------------------------------------------------ painters

  // Old stone blocks laid in courses over the quad Q, mapped so a face can recede. o: rows, per
  // (blocks to a course), seed, col, dk, lt, mortar, rim (the light on each block's top edge),
  // rimOp, lw, moss (chance of a moss tuft under a block), mossCol.
  function stoneFace(S, Q, o) {
    var r = rng(o.seed || 7), rows = o.rows || 6, per = o.per || 3, d = ['', '', ''], hi = '', lo = '', moss = '';
    for (var row = 0; row < rows; row++) {
      var v0 = (row + 0.07) / rows, v1 = (row + 0.93) / rows, u = -((row % 2) * 0.5 + r() * 0.25) / per;
      while (u < 1) {
        var w = (0.7 + r() * 0.6) / per, a0 = Math.max(0, u) + 0.05 / per, a1 = Math.min(1, u + w) - 0.05 / per;
        if (a1 - a0 > 0.14 / per) {
          var cu = Math.min((a1 - a0) * 0.2, 0.12 / per), cv = (v1 - v0) * 0.24;
          var P = [inQuad(Q, a0 + cu, v0), inQuad(Q, a1 - cu, v0), inQuad(Q, a1, v0 + cv), inQuad(Q, a1, v1 - cv), inQuad(Q, a1 - cu, v1),
            inQuad(Q, a0 + cu, v1), inQuad(Q, a0, v1 - cv), inQuad(Q, a0, v0 + cv)];
          d[Math.floor(r() * 3)] += pts(P) + 'Z';
          hi += pts([P[0], P[1]]);
          lo += pts([P[5], P[4]]);
          if (o.moss && r() < o.moss) {
            var m = inQuad(Q, (a0 + a1) / 2 + (r() - 0.5) * 0.3 / per, v1);
            moss += blob(m[0], m[1], (o.mossW || 14) * (0.7 + r() * 0.7), (o.mossW || 14) * 0.35, 7, r, 0.3, 0.3);
          }
        }
        u += w;
      }
    }
    var col = o.col, lw = o.lw || 2.5;
    return path(quad(Q), o.mortar || mix(col, o.dk, 0.65)) + path(d[0], col) + path(d[1], mix(col, o.dk, 0.28)) + path(d[2], mix(col, o.lt, 0.3)) +
      stroke(lo, o.dk, lw * 1.4, { opacity: 0.45 }) + stroke(hi, o.rim || o.lt, lw, { opacity: o.rimOp == null ? 0.6 : o.rimOp }) +
      (moss ? path(moss, o.mossCol || S.pal.moss, { opacity: 0.8 }) : '');
  }

  // A spiral, flattened by `flat` (the water lies flat), turning `dir`.
  function swirlD(cx, cy, R, turns, flat, dir) {
    var d = '', k = Math.max(12, Math.round(turns * 22));
    for (var i = 0; i <= k; i++) {
      var t = i / k, a = dir * t * turns * Math.PI * 2, rr = R * (0.16 + 0.84 * t);
      d += (i ? 'L' : 'M') + n(cx + Math.cos(a) * rr) + ' ' + n(cy + Math.sin(a) * rr * flat);
    }
    return d;
  }

  // Brown, swirly water after the storm in the box x0..x1, y0..y1: lighter far off (the sky in
  // it), darker near; current lines and swirls grow with nearness and drift slowly downstream;
  // sticks and leaves ride along. o: key (for the gradients), seed, lines, swirls, debris, size.
  function riverWater(S, c, x0, y0, x1, y1, o) {
    o = o || {};
    var p = S.pal, r = rng(o.seed || 31), key = o.key || 'w', H = y1 - y0, k, x, y, i;
    var s = rect(x0, y0, x1 - x0, H, S.lin('brw' + key, [[0, c.waterFar], [0.28, c.water], [1, c.waterDk]]));
    s += rect(x0, y0, x1 - x0, Math.min(H, 60), S.lin('brws' + key, [[0, p.sky[p.sky.length - 1], 0.55], [1, c.waterFar, 0]]));
    var cur = ['', '', ''], sw = ['', '', ''], sticks = '', leaves = '', glints = '';
    for (i = 0; i < (o.lines || 46); i++) {
      k = Math.pow(r(), 0.75); y = y0 + 4 + k * (H - 8); x = x0 - 60 + r() * (x1 - x0 + 120);
      var L = (o.size || 1) * (24 + k * 170);
      cur[k < 0.33 ? 0 : k < 0.66 ? 1 : 2] += 'M' + n(x) + ' ' + n(y) + 'q' + n(L / 4) + ' ' + n(-2 - k * 7) + ' ' + n(L / 2) + ' 0t' + n(L / 2) + ' 0';
    }
    for (i = 0; i < (o.swirls || 16); i++) {
      k = Math.pow(r(), 0.7); y = y0 + 8 + k * (H - 16); x = x0 - 40 + r() * (x1 - x0 + 80);
      sw[k < 0.33 ? 0 : k < 0.66 ? 1 : 2] += swirlD(x, y, (o.size || 1) * (10 + k * 62), 1.2 + r() * 0.9, 0.32, r() < 0.5 ? 1 : -1);
    }
    for (i = 0; i < (o.debris || 7); i++) {
      k = 0.25 + r() * 0.75; y = y0 + 10 + k * (H - 20); x = x0 + r() * (x1 - x0);
      var sl = (o.size || 1) * (16 + k * 60), sa = (r() - 0.5) * 0.5;
      sticks += 'M' + n(x - Math.cos(sa) * sl / 2) + ' ' + n(y - Math.sin(sa) * sl / 2) + 'L' + n(x + Math.cos(sa) * sl / 2) + ' ' + n(y + Math.sin(sa) * sl / 2) +
        'M' + n(x + sl * 0.15) + ' ' + n(y) + 'l' + n(sl * 0.18) + ' ' + n(-sl * 0.14);
      leaves += leafD(x - sl * 0.3, y - 2, sl * 0.3, -0.3 + r(), sl * 0.1) + leafD(x + sl * 0.4, y + 3, sl * 0.24, 2.6 + r(), sl * 0.08);
    }
    for (i = 0; i < 26; i++) { k = r(); y = y0 + 6 + k * (H - 12); x = x0 + r() * (x1 - x0); glints += 'M' + n(x) + ' ' + n(y) + 'h' + n(6 + k * 26); }
    var dk = { transform: 'translate(0 3)' }, wDk = mix(c.waterDk, '#2A1C10', 0.2);
    var drift = stroke(cur[0], c.swirl, 1.5, { opacity: 0.4 }) + stroke(cur[1], c.swirl, 2.6, { opacity: 0.4 }) + stroke(cur[2], c.swirl, 4, { opacity: 0.38 }) +
      g(stroke(sw[0], wDk, 2, { opacity: 0.3 }) + stroke(sw[1], wDk, 3.2, { opacity: 0.3 }) + stroke(sw[2], wDk, 5, { opacity: 0.3 }), dk) +
      stroke(sw[0], c.swirl, 1.8, { opacity: 0.7 }) + stroke(sw[1], c.swirl, 3, { opacity: 0.7 }) + stroke(sw[2], c.swirl, 4.6, { opacity: 0.66 }) +
      stroke(sticks, mix(c.mudDk, '#000', 0.1), (o.size || 1) * 4, { opacity: 0.85 }) + path(leaves, mix(p.leafMid, '#C9A040', 0.35), { opacity: 0.9 });
    s += g(g(drift, { 'class': 'pcs-drift', style: 'animation-duration:30s' }), { 'clip-path': S.clip('brwc' + key, rect(x0, y0, x1 - x0, H, '#fff')) });
    s += stroke(glints, '#FFF6DE', 2.4, { opacity: 0.55, 'class': 'pcs-glint' });
    return s;
  }

  // Reeds standing along a bank: blades, cattails on their stems, and stems the flood snapped and
  // folded over. spots: [[x, y, h], …]; o: seed, lean (-1 … 1), k (stroke scale).
  function reedBed(S, c, spots, o) {
    o = o || {};
    var r = rng(o.seed || 41), a = '', b = '', stems = '', tails = '', snapped = '', lw = 2.2 * (o.k || 1);
    for (var i = 0; i < spots.length; i++) {
      var x = spots[i][0], y = spots[i][1], h = spots[i][2], k = h / 100, kind = r(), lean = ((o.lean || 0) + (r() - 0.5) * 0.7) * h * 0.45;
      if (kind < 0.55) {
        var bd = bladeD(x, y, h * (0.8 + r() * 0.4), lean, (2.4 * k + 0.6) * (o.w || 1));
        if (r() < 0.5) a += bd; else b += bd;
      } else if (kind < 0.78) {
        var tx = x + lean * 0.8, ty = y - h * 1.05;
        stems += 'M' + n(x) + ' ' + n(y) + 'Q' + n(x + lean * 0.15) + ' ' + n(y - h * 0.6) + ' ' + n(tx) + ' ' + n(ty);
        var ang = Math.atan2(ty - (y - h * 0.6), tx - (x + lean * 0.15));
        tails += leafD(tx - Math.cos(ang) * 6 * k, ty - Math.sin(ang) * 6 * k, 26 * k, ang, 5.5 * k);
      } else {
        var mx = x + lean * 0.25, my = y - h * (0.4 + r() * 0.25), dir = r() < 0.5 ? -1 : 1;
        var ex = mx + dir * h * (0.32 + r() * 0.2), ey = my + h * (0.12 + r() * 0.22), w = 2.2 * k + 0.6;
        snapped += 'M' + n(x - w) + ' ' + n(y) + 'L' + n(mx - w * 0.6) + ' ' + n(my) + 'L' + n(ex) + ' ' + n(ey) + 'L' + n(mx + w * 0.8) + ' ' + n(my + w * 1.4) + 'L' + n(x + w) + ' ' + n(y) + 'Z';
      }
    }
    return path(b, c.reedDk) + path(snapped, mix(c.reed, c.reedLt, 0.4)) + path(a, c.reed) + stroke(stems, c.reedDk, lw) + path(tails, c.tail);
  }

  // Reeds squashed flat: blades lying on the ground, the pale undersides up, pointing along `ang`
  // (radians, screen space). spots: [[x, y, len, ang], …].
  function flatReeds(S, c, spots) {
    var a = '', b = '';
    for (var i = 0; i < spots.length; i++) {
      var sp = spots[i], d = leafD(sp[0], sp[1], sp[2], sp[3], Math.max(1.2, sp[2] * 0.055));
      if (i % 3) a += d; else b += d;
    }
    return path(b, c.reed, { opacity: 0.95 }) + path(a, c.reedLt, { opacity: 0.9 });
  }
  // flattened blades scattered along the cubic P, lying in the direction it runs (start to end)
  function swathAlong(P, w0, w1, count, seed, len0, len1) {
    var r = rng(seed), out = [];
    for (var i = 0; i < count; i++) {
      var t = r(), q = along(P, t), w = lerp(w0, w1, t), side = (r() - 0.5) * 2;
      var off = side * w * 0.95, len = lerp(len0, len1, t) * (0.7 + r() * 0.6);
      out.push([q.x + q.nx * off, q.y + q.ny * off, len, Math.atan2(q.ty, q.tx) + (r() - 0.5) * 0.5]);
    }
    return out;
  }

  // Deep drag marks from P[0] (near, wide) to P[3] (far, narrow): a smooth trough with a raised,
  // lit lip, deep grooves in it (two, or one down the middle when seen from far off: two thin
  // lines read as rails), and soft scuffs pressed in along both sides. o: lip, bed, deep
  // (colours), grooves.
  function dragMarks(S, P, w0, w1, o) {
    var s = '', sc = '', scHi = '', G = o.grooves === 1 ? [0] : [-0.22, 0.22], gw = o.grooves === 1 ? 0.3 : 0.15;
    s += path(ribbon(P, -w0 * 0.05, -w1 * 0.05, w0 * 1.18, w1 * 1.18, 0, 1, 40, 0.14), o.lip, { opacity: 0.75 });
    s += path(ribbon(P, 0, 0, w0, w1, 0, 1, 40, 0.1), o.bed);
    for (var gi = 0; gi < G.length; gi++) {
      var sd = G[gi];
      s += path(ribbon(P, sd * w0 + w0 * 0.035, sd * w1 + w1 * 0.035, w0 * (gw + 0.02), w1 * (gw + 0.02), 0, 1, 40, 0.12), o.lip, { opacity: 0.4 });
      s += path(ribbon(P, sd * w0, sd * w1, w0 * gw, w1 * gw, 0, 1, 40, 0.15), o.deep, { opacity: 0.9 });
    }
    for (var t = 0.07; o.scuffs !== false && t < 0.93; t += 0.105) {
      var q = along(P, t), w = lerp(w0, w1, t);
      for (sd = -1; sd <= 1; sd += 2) {
        var tt = t + (sd > 0 ? 0.04 : 0), q2 = along(P, Math.min(1, tt)), cx = q2.x + q2.nx * sd * w * 0.68, cy = q2.y + q2.ny * sd * w * 0.68;
        var rx = w * 0.16, ry = w * 0.075, ang = Math.atan2(q.ty, q.tx);
        sc += blob(cx, cy, rx, ry, 7, rng(Math.round(t * 1000) + sd), 0.15, 0.3);
        scHi += 'M' + n(cx - Math.cos(ang) * rx * 0.8 - q.nx * ry * 0.6) + ' ' + n(cy - Math.sin(ang) * rx * 0.8 - q.ny * ry * 0.6) + 'L' + n(cx + Math.cos(ang) * rx * 0.8 - q.nx * ry * 0.6) + ' ' + n(cy + Math.sin(ang) * rx * 0.8 - q.ny * ry * 0.6);
      }
    }
    return s + path(sc, o.deep, { opacity: 0.85 }) + stroke(scHi, o.lip, Math.max(1, w0 * 0.012), { opacity: 0.5 });
  }

  // A drip: a drop hanging at (x, y) that falls `fall` and fades as it goes, and a ring that
  // spreads on the puddle where it lands. The fall is pcs-float run upside down: inside the
  // matrix below, pcs-float's rise of (14, -110) becomes a straight drop of `fall`.
  var SKEW = 14 / 110;
  function drip(S, x, y, fall, size, delay, col, ringCol) {
    var F = fall / 110, P = [], i, a;
    // the drop in world units around its middle, then into the falling frame
    for (i = 0; i <= 10; i++) { a = Math.PI * i / 10; P.push([Math.cos(a) * size, Math.sin(a) * size]); }
    P.push([-size * 0.86, -size * 0.9], [-size * 0.4, -size * 1.8], [0, -size * 2.3], [size * 0.4, -size * 1.8], [size * 0.86, -size * 0.9]);
    var L = P.map(function (q) { return [q[0] + SKEW * q[1] / F, -q[1] / F]; });
    var dur = 1.9 + (delay % 0.7);
    var drop = g(path(pts(L) + 'Z', col, { opacity: 0.95 }), { 'class': 'pcs-float', style: 'animation-duration:' + n(dur) + 's;animation-delay:-' + n(delay) + 's' });
    var s = '<g transform="matrix(1 0 ' + K.n4(SKEW) + ' ' + K.n4(-F) + ' ' + n(x) + ' ' + n(y + size * 0.9) + ')">' + drop + '</g>';
    if (ringCol) {
      var ly = y + size + fall;
      s += ell(x, ly, size * 3.4, size * 0.95, 'none', { stroke: ringCol, 'stroke-width': Math.max(1.2, size * 0.32), opacity: 0.75 });
      s += ell(x, ly, size * 6, size * 1.6, 'none', { stroke: ringCol, 'stroke-width': Math.max(1, size * 0.26), opacity: 0.5, 'class': 'pcs-ring', style: 'animation-duration:' + n(dur) + 's;animation-delay:-' + n(delay) + 's' });
    }
    return s;
  }
  // a puddle: a smooth pool of `fill` (the sky in it, or the dark) with a wet rim of `rim`
  function puddle(S, x, y, rx, ry, seed, fill, rim) {
    var d = blob(x, y, rx, ry, 12, rng(seed), 0.12, 0.1);
    return path(d, rim, { opacity: 0.7, transform: 'translate(0 ' + n(Math.max(2, ry * 0.25)) + ') scale(1.04 1.1)', 'transform-origin': n(x) + ' ' + n(y) }) + path(d, fill) +
      stroke('M' + n(x - rx * 0.5) + ' ' + n(y - ry * 0.3) + 'q' + n(rx * 0.3) + ' ' + n(-ry * 0.25) + ' ' + n(rx * 0.6) + ' ' + n(-ry * 0.1), '#FFFFFF', Math.max(1.5, ry * 0.16), { opacity: 0.45 });
  }

  // Two big round shining eyes, open or half closed: gentle, a little sad (the lids sit higher at
  // the inner corners), round pupils (no snake ever blinked). state 'open' | 'blink'.
  function eyePair(S, c, cx, cy, R, gap, state) {
    if (state !== 'open' && state !== 'blink') return '';
    var blink = state === 'blink', s = '';
    s += g(ell(cx, cy, gap * 0.5 + R * 2.6, R * 2.4, S.radU([[0, '#FFE6A6', blink ? 0.2 : 0.36], [0.5, '#FFD27A', blink ? 0.07 : 0.14], [1, '#FFD27A', 0]], cx, cy, gap * 0.5 + R * 2.6)),
      { 'class': 'pcs-pulse' });
    for (var i = -1; i <= 1; i += 2) {
      var ex = cx + i * gap / 2, ey = cy, outX = ex + i * R * 1.25, inX = ex - i * R * 1.25;
      var clip = S.clip('eye' + Math.round(ex) + '-' + Math.round(ey), circ(ex, ey, R, '#fff'));
      var e = circ(ex, ey, R, S.radU([[0, '#FFF4C8'], [0.5, '#F7C65C'], [1, '#C98B30']], ex - R * 0.15, ey - R * 0.2, R * 1.25));
      e += circ(ex, ey + R * 0.12, R * 0.47, '#1C1828');
      e += circ(ex - R * 0.28, ey - R * 0.2, R * 0.22, '#FFFFFF', { opacity: 0.95 }) + circ(ex + R * 0.22, ey + R * 0.32, R * 0.09, '#FFFFFF', { opacity: 0.85 });
      e += stroke('M' + n(ex - R * 0.7) + ' ' + n(ey + R * 0.62) + 'Q' + n(ex) + ' ' + n(ey + R * 1.02) + ' ' + n(ex + R * 0.7) + ' ' + n(ey + R * 0.62), '#FFF6DA', R * 0.08, { opacity: 0.55 });
      var lo = blink ? ey + R * 0.04 : ey - R * 0.66, li = blink ? ey - R * 0.14 : ey - R * 0.92, mid = (lo + li) / 2 + R * (blink ? 0.2 : 0.16);
      var lid = 'M' + n(outX) + ' ' + n(ey - R * 1.4) + 'L' + n(inX) + ' ' + n(ey - R * 1.4) + 'L' + n(inX) + ' ' + n(li) + 'Q' + n(ex) + ' ' + n(mid) + ' ' + n(outX) + ' ' + n(lo) + 'Z';
      e += path(lid, c.dark1) + stroke('M' + n(inX) + ' ' + n(li) + 'Q' + n(ex) + ' ' + n(mid) + ' ' + n(outX) + ' ' + n(lo), c.dark4, R * 0.07, { opacity: 0.8 });
      if (blink) {
        var low = 'M' + n(outX) + ' ' + n(ey + R * 1.4) + 'L' + n(inX) + ' ' + n(ey + R * 1.4) + 'L' + n(inX) + ' ' + n(ey + R * 0.62) + 'Q' + n(ex) + ' ' + n(ey + R * 0.42) + ' ' + n(outX) + ' ' + n(ey + R * 0.6) + 'Z';
        e += path(low, c.dark1);
      }
      s += ell(ex, ey + R * 0.08, R * 1.22, R * 1.16, c.dark0, { opacity: 0.7 });
      s += g(e, { 'clip-path': clip });
    }
    return s;
  }

  // A rounded river rock on the ground at (cx, base): sunlit from the right, moss in the cracks.
  function rock(S, c, cx, base, w, h, seed, o) {
    o = o || {};
    var r = rng(seed), d = mound(cx - w / 2, cx + w / 2, base, base - h, 9, r, 0.18, 0.08, 0.42);
    var s = ell(cx + w * 0.04, base, w * 0.58, h * 0.13, S.pal.shade, { opacity: 0.3 });
    s += path(d, S.lin('brrock' + seed, [[0, mix(c.stoneDk, c.dark2, o.dim || 0)], [0.55, mix(c.stone, c.dark2, (o.dim || 0) * 0.7)], [1, mix(c.stoneLt, c.dark3, (o.dim || 0) * 0.5)]], 0, 0, 1, 0));
    s += path(mound(cx - w * 0.44, cx + w * 0.3, base - h * 0.32, base - h * 0.96, 8, rng(seed + 1), 0.2, 0.1, 0.4), mix(c.stoneLt, '#FFFFFF', 0.1), { opacity: 0.35 });
    s += stroke('M' + n(cx - w * 0.22) + ' ' + n(base - h * 0.95) + 'Q' + n(cx + w * 0.12) + ' ' + n(base - h * 1.04) + ' ' + n(cx + w * 0.4) + ' ' + n(base - h * 0.62), S.pal.rim, Math.max(2, h * 0.035), { opacity: 0.85 });
    s += path(blob(cx - w * 0.3, base - h * 0.12, w * 0.12, h * 0.07, 7, r, 0.3, 0.3) + blob(cx + w * 0.22, base - h * 0.08, w * 0.09, h * 0.05, 7, r, 0.3, 0.3), S.pal.moss, { opacity: 0.85 });
    s += stroke('M' + n(cx - w * 0.08) + ' ' + n(base - h * 0.5) + 'q' + n(w * 0.05) + ' ' + n(h * 0.14) + ' ' + n(w * 0.02) + ' ' + n(h * 0.3), c.stoneDk, Math.max(1.5, h * 0.025), { opacity: 0.5 });
    if (o.shadeLeft) s += path(d, S.linU([[0, c.dark1, o.shadeLeft], [0.45, c.dark1, o.shadeLeft * 0.5], [0.7, c.dark1, 0]], cx - w / 2, 0, cx + w / 2, 0));
    return s;
  }

  // Grit and dust shaken down by a passing train: specks falling from the line y between x0 and x1.
  function grit(S, x0, x1, y, fall, count, seed, col) {
    var r = rng(seed), s = '';
    for (var i = 0; i < count; i++) {
      var x = x0 + r() * (x1 - x0), sz = 1.6 + r() * 2.4;
      s += drip(S, x, y + r() * 30, fall * (0.6 + r() * 0.5), sz, r() * 2, col, null);
    }
    return s;
  }

  // ------------------------------------------------------------------ BANK (main): the wide view

  // The bridge recedes from its near end (left) toward a vanishing point off to the right:
  // every line along it passes through (VPX, VPY), and things at x are sv(x) as big as at x = 0.
  var VPX = 2600, VPY = 600;
  function yv(y0, x) { return y0 + (VPY - y0) * x / VPX; }
  function sv(x) { return (VPX - x) / VPX; }
  function xd(d) { return VPX - (VPX - 560) / (1 + d); }     // screen x a distance d along the bridge (d = 0: the first leg)
  var DT = 282, DB = 384, TT = 70, WL = 804;                 // deck top, deck bottom, truss top, water line, at x = 0
  var SPAN = 0.275, PANEL = SPAN / 4, D_END = (VPX - 560) / (VPX - 40) - 1;
  var LEGS = [0, 1, 2, 3, 4].map(function (i) { return xd(SPAN * i); });
  // our bank's edge, from under the abutment past the first leg and along the water
  var EDGE = [[-30, 700], [92, 708], [300, 724], [514, 748], [560, 762], [640, 790], [760, 822], [900, 846], [1060, 864], [1250, 878], [1450, 886], [1640, 890]];
  var BANK_MARKS = [[930, 852], [780, 900], [470, 830], [300, 712]];

  function bankLeg(S, c, x, i) {
    var s = sv(x), w = 116 * s, top = yv(DB, x), base = yv(WL, x) + 8 * s, wb = w * 1.1, p = S.pal, out = '', hz = clamp((x - 700) / 1500, 0, 0.45);
    var Q = [[x - w / 2, top], [x + w / 2, top], [x + wb / 2, base], [x - wb / 2, base]];
    out += stoneFace(S, Q, { rows: Math.max(4, Math.round(9 * s)), per: 2, seed: 60 + i, col: mix(c.stone, p.haze, hz), dk: mix(c.stoneDk, p.haze, hz), lt: c.stoneLt, rim: p.rim, rimOp: 0.5, lw: 2.4 * s, moss: 0.25, mossW: 12 * s });
    out += path(quad([[x - w / 2, top], [x - w * 0.18, top], [x - wb * 0.2, base], [x - wb / 2, base]]), c.dark2, { opacity: 0.22 });
    out += rect(x - w * 0.62, top, w * 1.24, 16 * s, c.stoneLt, { rx: 4 * s }) + rect(x - w * 0.62, top + 13 * s, w * 1.24, 4 * s, c.stoneDk, { opacity: 0.5 });
    out += path(quad([[x + w / 2 - 6 * s, top + 16 * s], [x + w / 2, top + 16 * s], [x + wb / 2, base], [x + wb / 2 - 7 * s, base]]), p.rim, { opacity: 0.55 });
    // wet and dark where the flood rose, foam where the water piles against the stone
    out += path(quad([[x - w * 0.53, base - 70 * s], [x + w * 0.53, base - 70 * s], [x + wb / 2, base], [x - wb / 2, base]]), S.linU([[0, c.mudDk, 0], [1, c.mudDk, 0.55]], 0, base - 70 * s, 0, base));
    out += path(blob(x, base, wb * 0.75, 9 * s, 9, rng(70 + i), 0.3, 0.3), c.foam, { opacity: 0.75 });
    out += stroke('M' + n(x - wb * 0.95) + ' ' + n(base + 10 * s) + 'q' + n(wb * 0.3) + ' ' + n(-6 * s) + ' ' + n(wb * 0.6) + ' 0M' + n(x + wb * 0.3) + ' ' + n(base + 12 * s) + 'q' + n(wb * 0.3) + ' ' + n(-6 * s) + ' ' + n(wb * 0.7) + ' 0', c.foam, 2.5 * s, { opacity: 0.6 });
    return out;
  }

  function bankTruss(S, c, far) {
    var p = S.pal, col = far ? mix(c.iron, p.haze, 0.42) : c.iron, mem = '', hi = '', gus = '', riv = '', xs = [], k, x;
    function P(xx, y0) { var s = sv(xx); return [xx - (far ? 30 * s : 0), yv(y0, xx) - (far ? 14 * s : 0)]; }
    for (k = 0; k < 40; k++) { x = xd(D_END + PANEL * k); xs.push(x); if (x > 1720) break; }
    var x0 = xs[0], x1 = xs[1], xe = xs[xs.length - 1];
    mem += quad([P(x0, DT - 18), P(xe, DT - 18), P(xe, DT + 2), P(x0, DT + 2)]);
    mem += quad([P(x1, TT - 10), P(xe, TT - 10), P(xe, TT + 14), P(x1, TT + 14)]);
    mem += bar(P(x0 + 6, DT - 6), P(x1, TT + 2), 30 * sv(x0), 26 * sv(x1));
    hi += pts([P(x1, TT - 10), P(xe, TT - 10)]) + pts([P(x0 - 8, DT - 14), P(x1 - 10, TT - 8)]);
    for (k = 1; k < xs.length; k++) {
      var xa = xs[k], s = sv(xa);
      mem += bar(P(xa, TT + 2), P(xa, DT - 10), 15 * s, 15 * s);
      if (k + 1 < xs.length) {
        var xb = xs[k + 1], sb = sv(xb);
        mem += k % 2 ? bar(P(xa, TT + 8), P(xb, DT - 14), 13 * s, 13 * sb) : bar(P(xa, DT - 14), P(xb, TT + 8), 13 * s, 13 * sb);
      }
      var a = P(xa, TT + 2), b = P(xa, DT - 9);
      gus += dot(a[0], a[1], 15 * s) + dot(b[0], b[1], 13 * s);
      hi += pts([[a[0] + 6 * s, a[1] + 10 * s], [b[0] + 6 * s, b[1] - 8 * s]]);
      if (!far && xa < 1000) for (var j = 0; j < 4; j++) riv += dot(a[0] + (j - 1.5) * 7 * s, a[1] - 6 * s, 2.4 * s) + dot(b[0] + (j - 1.5) * 7 * s, b[1] + 3 * s, 2.4 * s);
    }
    var out = path(mem, col) + path(gus, far ? col : mix(c.iron, c.ironLt, 0.2));
    if (!far) out += stroke(hi, c.ironLt, 2.6, { opacity: 0.7 }) + path(riv, c.rivet);
    else for (k = 1; k < xs.length; k += 1) { var n0 = [xs[k], yv(TT, xs[k])], f0 = P(xs[k], TT); out += path(bar(n0, f0, 8 * sv(xs[k]), 8 * sv(xs[k])), col); }
    return out;
  }

  function bankDeck(S, c) {
    var p = S.pal, x0 = 30, x1 = 1720, out = '', seams = '', riv = '';
    out += path(quad([[x0, yv(DT, x0)], [x1, yv(DT, x1)], [x1, yv(DB, x1)], [x0, yv(DB, x0)]]), S.linU([[0, c.ironLt], [0.12, c.iron], [1, c.ironDk]], 0, yv(DT, 0), 0, yv(DB, 0)));
    out += path(quad([[x0, yv(DB - 14, x0)], [x1, yv(DB - 14, x1)], [x1, yv(DB, x1)], [x0, yv(DB, x0)]]), c.ironDk);
    out += stroke(pts([[x0, yv(DT + 1, x0)], [x1, yv(DT + 1, x1)]]), p.rim, 3, { opacity: 0.75 });
    for (var k = 0; k < 40; k++) {
      var x = xd(D_END + PANEL * k * 0.5), s = sv(x);
      if (x > x1) break;
      if (k % 2 === 0) seams += pts([[x, yv(DT + 4, x)], [x, yv(DB - 16, x)]]);
      if (x < 1100) riv += dot(x + 10 * s, yv(DT + 12, x), 2.8 * s) + dot(x + 10 * s, yv(DB - 24, x), 2.8 * s) + dot(x + 30 * s, yv(DT + 12, x), 2.8 * s) + dot(x + 30 * s, yv(DB - 24, x), 2.8 * s);
    }
    return out + stroke(seams, c.ironDk, 2, { opacity: 0.6 }) + path(riv, c.rivet, { opacity: 0.9 });
  }

  // The Ironsnake: a long silver train inside the truss, filling the bridge from end to end.
  function bankTrain(S, c) {
    var p = S.pal, body = mix('#DDE2E8', p.rim, 0.12), bodyDk = mix('#97A3B0', p.ink, 0.1), roofC = mix('#BCC5CE', p.rim, 0.2), winC = mix('#2E3D52', p.sky[1], 0.2);
    var CAR = 0.112, GAP = 0.007, bot = DT - 8, top = DT - 150, roof = DT - 166;
    var bodies = '', roofs = '', lows = '', wins = '', glare = '', stripe = '', stripe2 = '', wheels = '', joins = '';
    for (var d = -0.33; xd(d) < 1720; d += CAR + GAP) {
      var xa = xd(d), xb = xd(d + CAR);
      bodies += quad([[xa, yv(top, xa)], [xb, yv(top, xb)], [xb, yv(bot, xb)], [xa, yv(bot, xa)]]);
      roofs += quad([[xa + 6 * sv(xa), yv(roof, xa)], [xb - 6 * sv(xb), yv(roof, xb)], [xb, yv(top + 4, xb)], [xa, yv(top + 4, xa)]]);
      lows += quad([[xa, yv(bot - 26, xa)], [xb, yv(bot - 26, xb)], [xb, yv(bot, xb)], [xa, yv(bot, xa)]]);
      stripe += quad([[xa, yv(top + 84, xa)], [xb, yv(top + 84, xb)], [xb, yv(top + 96, xb)], [xa, yv(top + 96, xa)]]);
      stripe2 += quad([[xa, yv(top + 98, xa)], [xb, yv(top + 98, xb)], [xb, yv(top + 103, xb)], [xa, yv(top + 103, xa)]]);
      for (var j = 0; j < 6; j++) {
        var u0 = d + CAR * (0.07 + j * 0.152), u1 = u0 + CAR * 0.1, wa = xd(u0), wb = xd(u1);
        wins += quad([[wa, yv(top + 24, wa)], [wb, yv(top + 24, wb)], [wb, yv(top + 72, wb)], [wa, yv(top + 72, wa)]]);
        glare += quad([[wa, yv(top + 30, wa)], [lerp(wa, wb, 0.45), yv(top + 30, wa)], [wa, yv(top + 52, wa)]]);
      }
      [0.12, 0.22, 0.78, 0.88].forEach(function (u) { var wx = xd(d + CAR * u); wheels += dot(wx, yv(bot + 2, wx), 15 * sv(wx)); });
      var xg = xd(d + CAR + GAP / 2);
      joins += quad([[xg - 5 * sv(xg), yv(top + 30, xg)], [xg + 5 * sv(xg), yv(top + 30, xg)], [xg + 5 * sv(xg), yv(bot - 8, xg)], [xg - 5 * sv(xg), yv(bot - 8, xg)]]);
    }
    var out = path(joins, c.ironDk) + path(wheels, c.ironDk) + path(bodies, body) + path(lows, bodyDk) + path(roofs, roofC) + path(stripe, '#3268AE') + path(stripe2, '#D0504A') +
      path(wins, winC) + path(glare, '#FFFFFF', { opacity: 0.35 });
    // speed lines at the near end
    var sp = '', r = rng(431);
    for (var i = 0; i < 6; i++) { var yy = lerp(top + 20, bot - 20, i / 5) + (r() - 0.5) * 10, x0 = 40 + r() * 140; sp += pts([[x0, yv(yy, x0)], [x0 + 150, yv(yy, x0 + 150)]]); }
    return out + g(stroke(sp, '#FFFFFF', 4, { opacity: 0.6 }), { 'class': 'pcs-whoosh' });
  }

  // Chapter 5: the river closing over whoever swims at `a` (the bank's `water`): the same water (its
  // drawing, clipped to a patch with a wavy top edge) laid back over their lower part, rings and a
  // little foam at the waterline, and then the reeds that stand between them and us, drawn again in
  // front. An otter swimming or floating already shows only what is above the water, so only its
  // bottom edge goes under; anyone else sits deeper.
  // (z: 'behind': the swimmer and the water over him are drawn before everyone on the bank, whatever
  // the cast's order, so his river never lies over a cat standing in front of it)
  var BANK_WATER = A(936, 832, 232, 'left', { z: 'behind' });
  function swimCover(S, c, a, water, reeds, m) {
    var pose = (m && m.pose) || '', low = pose === 'swim' || pose === 'float' || pose === 'dive';
    var h = a.h * (m && m.size > 0 ? +m.size : 1), top = low ? a.y - h * 0.06 : a.y - h * 0.3, bot = a.y + h * 0.2, x0 = a.x - h * 0.66, x1 = a.x + h * 0.66;
    var d = 'M' + n(x0) + ' ' + n(bot) + 'Q' + n(x0 + h * 0.06) + ' ' + n(top + h * 0.05) + ' ' + n(x0 + h * 0.24) + ' ' + n(top + h * 0.02);
    for (var i = 0; i < 4; i++) {
      var xa = x0 + h * 0.24 + i * h * 0.21;
      d += 'Q' + n(xa + h * 0.05) + ' ' + n(top - h * 0.02) + ' ' + n(xa + h * 0.105) + ' ' + n(top) + 'T' + n(xa + h * 0.21) + ' ' + n(top + (i === 3 ? h * 0.02 : 0));
    }
    d += 'Q' + n(x1 - h * 0.06) + ' ' + n(top + h * 0.05) + ' ' + n(x1) + ' ' + n(bot) + 'Z';
    // (the patch stops at the bank's edge: the river never lies over the mud)
    var wet = [];
    for (var x = -30; x <= 1640; x += 40) wet.push([x, yOn(EDGE, x) + 2]);
    var s = g(g(water, { 'clip-path': S.clip('brswim', path(d, '#fff')) }), { 'clip-path': S.clip('brswimedge', path(pts([[-30, 560]].concat(wet, [[1640, 560]])) + 'Z', '#fff')) });
    s += stroke('M' + n(a.x - h * 0.36) + ' ' + n(top + h * 0.006) + 'Q' + n(a.x) + ' ' + n(top - h * 0.03) + ' ' + n(a.x + h * 0.36) + ' ' + n(top + h * 0.006), c.foam, Math.max(2, h * 0.014), { opacity: 0.85 });
    [[0.56, 0.07, 0, 0.75], [0.82, 0.11, 0.03, 0.5], [1.08, 0.15, 0.07, 0.3]].forEach(function (q) {
      var rx = h * 0.62 * q[0], ry = h * 0.62 * q[1], cy = top + h * 0.02 + h * 0.62 * q[2];
      s += stroke('M' + n(a.x - rx) + ' ' + n(cy) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 0 ' + n(a.x + rx) + ' ' + n(cy), c.foam, Math.max(1.4, h * 0.011), { opacity: q[3], 'stroke-dasharray': n(rx * 0.9) + ' ' + n(rx * 0.25) });
    });
    return g(s + g(reeds, { 'clip-path': S.clip('brswimreeds', rect(a.x - h * 0.8, a.y - h * 0.7, h * 1.6, h * 1.05, '#fff')) }), { 'data-art': 'swim' });
  }

  // ------------------------------------------------------------------ chapter 9: the sunny bank

  // Chapter 9's spots on the bank (docs/chapters/09-featherlight.spec.md, section 4, "The sunny bank"): the
  // practice on the strip of sand at the water's edge, the friends watching from the bank at the left, in the
  // edge of the bridge's shadow. Their heights are the depth there (h about 0.8 (y - 580), as the others').
  // `air` is above `run`, her paws a little more than her own leg's length off the sand (a third of a sitting
  // cat's height there); `skim` at the water's edge, her paws just clear of the sand; `paddle` in the shallows.
  var BANK9 = {
    run: A(960, 884, 244, 'left'), 'run-2': A(700, 850, 222, 'right'),
    skim: A(1135, 862, 236, 'left', { elev: true, air: true }),
    air: A(960, 884 - Math.round(244 * 0.34), 244, 'left', { elev: true, air: true }),
    paddle: A(1250, 860, 226, 'left', { air: true }),
    'watch-1': A(165, 822, 196, 'right'), 'watch-2': A(300, 830, 200, 'right'), 'watch-3': A(435, 838, 204, 'right'), 'watch-4': A(570, 846, 208, 'right')
  };
  // the sand under each of the two spots in the air: where their shadows lie
  var SAND_UNDER = { air: BANK9.run.y, skim: BANK9.skim.y + 10 };
  // the strip of sand along the water's edge, from the bridge's foot (in the edge of its shadow) to where the
  // reeds stand again and screen it from the river path; the shallows over the sand bottom just off it
  var SAND9 = { x0: 520, x1: 1440 };
  function shoalDepth(x) {
    // how far out from the edge the bright shallows reach: little by the leg, wide round the practice
    var t = clamp((x - SAND9.x0) / (SAND9.x1 - SAND9.x0), 0, 1);
    return 22 + 108 * Math.sin(Math.PI * Math.pow(t, 0.8)) + 10 * Math.sin(x * 0.021);
  }
  function sandWidth(x) {
    var t = clamp((x - SAND9.x0) / (SAND9.x1 - SAND9.x0), 0, 1);
    return 10 + 44 * Math.sin(Math.PI * Math.pow(t, 0.75)) + 3 * Math.sin(x * 0.037);
  }
  function shoalCols(S) {
    var p = S.pal;
    return {
      bed: mix('#F3E8C4', p.sandLight, 0.3), bedFar: mix('#DCE7BE', p.sandLight, 0.1), green: mix('#C2DFBA', p.sky[3], 0.12), blend: mix('#BCC59C', '#92704A', 0.12),
      ripple: '#FFFDF2', pebble: mix('#E3D3A6', p.sand, 0.3), pebbleDk: mix('#BFA878', p.sandDark, 0.3),
      sand: mix('#F6EACA', p.sandLight, 0.4), sandLt: '#FFF7E2', sandDamp: mix('#E2CFA0', p.sand, 0.3), sandDot: mix('#D9C391', p.sandDark, 0.2)
    };
  }
  // The shallows (`shallows: true`): the water at the bank's edge bright and clear in the sun, pale green-gold
  // over a sandy bottom you can see (its ripples and a few pebbles under the water), sun lines dancing on it,
  // sparkles and small rings. It fades out into the brown river beyond. <g data-art="shallows">.
  function shoalPoly(k) {
    var top = [], bot = [];
    for (var x = SAND9.x0 - 20; x <= SAND9.x1 + 20; x += 20) { top.push([x, yOn(EDGE, x) - shoalDepth(x) * k]); bot.unshift([x, yOn(EDGE, x) + 6]); }
    return { d: smooth(top) + 'L' + pts(bot).slice(1) + 'Z', top: top };
  }
  function shallowsWater(S, c) {
    var q = shoalCols(S), r = rng(901), s = '', i, x, y;
    var clip = S.clip('brshoal', path(shoalPoly(0.86).d, '#fff'));
    // the bed seen through the water, in soft bands: pale sand near the edge, a clear pale green further out,
    // fading softly into the brown river (each band's edge blurred, so the water has no hard line in it)
    var soft = path(shoalPoly(1).d, q.blend, { opacity: 0.55, filter: S.blur('brshoal1', 10) }) +
      path(shoalPoly(0.84).d, q.green, { opacity: 0.85, filter: S.blur('brshoal2', 8) }) +
      path(shoalPoly(0.6).d, q.bedFar, { opacity: 0.92, filter: S.blur('brshoal3', 6) }) +
      path(shoalPoly(0.34).d, q.bed, { filter: S.blur('brshoal4', 4) });
    var bed = '';
    // ripples in the sand bottom and pebbles lying on it
    var rip = '', peb = '', pebDk = '';
    for (i = 0; i < 34; i++) {
      x = SAND9.x0 + r() * (SAND9.x1 - SAND9.x0); y = yOn(EDGE, x) - r() * shoalDepth(x) * 0.8;
      var L = 20 + r() * 40;
      rip += 'M' + n(x) + ' ' + n(y) + 'q' + n(L / 4) + ' ' + n(-3) + ' ' + n(L / 2) + ' 0t' + n(L / 2) + ' 0';
    }
    for (i = 0; i < 16; i++) {
      x = SAND9.x0 + 40 + r() * (SAND9.x1 - SAND9.x0 - 80); y = yOn(EDGE, x) - 6 - r() * shoalDepth(x) * 0.55;
      var pr = 4 + r() * 6;
      peb += blob(x, y, pr * 1.3, pr * 0.7, 7, r, 0.2, 0.25); pebDk += blob(x + 1, y + pr * 0.35, pr * 1.1, pr * 0.35, 6, r, 0.2, 0.2);
    }
    s += bed + stroke(rip, q.bedFar, 2.4, { opacity: 0.55 }) + path(pebDk, q.pebbleDk, { opacity: 0.45 }) + path(peb, q.pebble, { opacity: 0.85 });
    // the sun's net of light on the sandy bottom (clear water over sand)
    var net = '';
    for (i = 0; i < 90; i++) {
      x = SAND9.x0 + r() * (SAND9.x1 - SAND9.x0); y = yOn(EDGE, x) - 2 - r() * shoalDepth(x) * 0.8;
      var cl = 10 + r() * 16, ca = r() * Math.PI;
      net += 'M' + n(x - Math.cos(ca) * cl / 2) + ' ' + n(y - Math.sin(ca) * cl * 0.18) + 'Q' + n(x) + ' ' + n(y + (r() - 0.5) * 8) + ' ' + n(x + Math.cos(ca) * cl / 2) + ' ' + n(y + Math.sin(ca) * cl * 0.18);
    }
    s += stroke(net, '#FFFFFF', 1.6, { opacity: 0.4 });
    // the sky in it, out where it is a little deeper
    var sheen = '';
    for (i = 0; i < 12; i++) { x = SAND9.x0 + 100 + r() * (SAND9.x1 - SAND9.x0 - 200); y = yOn(EDGE, x) - shoalDepth(x) * (0.55 + r() * 0.25); sheen += 'M' + n(x) + ' ' + n(y) + 'h' + n(30 + r() * 60); }
    s += stroke(sheen, mix(S.pal.sky[3], '#FFFFFF', 0.5), 3, { opacity: 0.55 });
    // the sun's lines on the water, dancing (the shared pcs-drift: still under reduced motion)
    var sun = '', sun2 = '';
    for (i = 0; i < 40; i++) {
      x = SAND9.x0 + r() * (SAND9.x1 - SAND9.x0); y = yOn(EDGE, x) - 4 - r() * shoalDepth(x) * 0.95;
      var w = 14 + r() * 34, a = 2 + r() * 3;
      var wave = 'M' + n(x) + ' ' + n(y) + 'q' + n(w / 4) + ' ' + n(-a) + ' ' + n(w / 2) + ' 0t' + n(w / 2) + ' 0';
      if (i % 3) sun += wave; else sun2 += wave;
    }
    s += g(stroke(sun, q.ripple, 2.6, { opacity: 0.7 }) + stroke(sun2, q.ripple, 1.6, { opacity: 0.55 }), { 'class': 'pcs-drift', style: 'animation-duration:14s' });
    // a soft bright edge where the water laps the sand
    var lap = [];
    for (x = SAND9.x0; x <= SAND9.x1; x += 20) lap.push([x, yOn(EDGE, x) - 3]);
    s += stroke(smooth(lap), '#FFFFFF', 3.4, { opacity: 0.75 });
    // small rings, and sparkles where the sun catches it
    var rings = '', sp = '';
    for (i = 0; i < 7; i++) {
      x = SAND9.x0 + 120 + r() * (SAND9.x1 - SAND9.x0 - 240); y = yOn(EDGE, x) - 14 - r() * shoalDepth(x) * 0.6;
      var rx = 14 + r() * 16;
      rings += 'M' + n(x - rx) + ' ' + n(y) + 'a' + n(rx) + ' ' + n(rx * 0.3) + ' 0 1 0 ' + n(rx * 2) + ' 0a' + n(rx) + ' ' + n(rx * 0.3) + ' 0 1 0 ' + n(-rx * 2) + ' 0';
    }
    s += stroke(rings, q.ripple, 1.8, { opacity: 0.6 });
    for (i = 0; i < 14; i++) {
      x = SAND9.x0 + 30 + r() * (SAND9.x1 - SAND9.x0 - 60); y = yOn(EDGE, x) - 6 - r() * shoalDepth(x) * 0.9;
      sp += path(K.sparkleD(x, y, 5 + r() * 7), '#FFFFFF', { 'class': i % 2 ? 'pcs-glint' : 'pcs-twk', style: 'animation-delay:-' + (r() * 3).toFixed(1) + 's' });
    }
    s += sp;
    return g(soft + g(s, { 'clip-path': clip }), { 'data-art': 'shallows' });
  }
  // The strip of soft pale sand along the edge, damp and a little darker where the water laps it, a few
  // grains and shell-bits; it fades into the mud at both ends, and the edge of the bridge's shadow lies over
  // its left end. <g data-art="sand">.
  function sandStrip(S, c) {
    var q = shoalCols(S), r = rng(931), top = [], bot = [], x, i, s = '';
    for (x = SAND9.x0; x <= SAND9.x1; x += 20) { top.push([x, yOn(EDGE, x) + 1]); bot.unshift([x, yOn(EDGE, x) + sandWidth(x)]); }
    var d = smooth(top) + 'L' + pts(bot).slice(1) + 'Z';
    s += path(d, S.linU([[0, q.sandDamp], [0.25, q.sand], [1, q.sandLt]], 0, 800, 0, 920));
    var dots = '', bits = '';
    for (i = 0; i < 60; i++) {
      x = SAND9.x0 + 30 + r() * (SAND9.x1 - SAND9.x0 - 60);
      var y = yOn(EDGE, x) + 4 + r() * Math.max(2, sandWidth(x) - 8);
      if (i % 5) dots += dot(x, y, 1.2 + r() * 1.6); else bits += blob(x, y, 3 + r() * 3, 1.8 + r() * 1.4, 6, r, 0.3, 0.3);
    }
    s += path(dots, q.sandDot, { opacity: 0.5 }) + path(bits, '#FFFFFF', { opacity: 0.7 });
    // the damp line where the water reaches
    var damp = [];
    for (x = SAND9.x0 + 10; x <= SAND9.x1 - 10; x += 20) damp.push([x, yOn(EDGE, x) + 5 + Math.sin(x * 0.05) * 1.5]);
    s += stroke(smooth(damp), q.sandDamp, 4, { opacity: 0.7 });
    // the edge of the bridge's shadow over its left end
    s += path(d, S.linU([[0, c.dark1, 0.42], [1, c.dark1, 0]], SAND9.x0, 0, SAND9.x0 + 140, 0));
    return g(s, { 'data-art': 'sand' });
  }

  // Where a cast member at spot `a` is drawn (as scenes.js draws it: the cats' units, a sitting Clan cat's
  // height to the spot's `h`), its body box in the world [x0, y0, x1, y1] and its head box; without the
  // character drawings, a sitting cat's shape there.
  var OWN9 = { who: 1, at: 1, pose: 1, mood: 1, variant: 1, facing: 1, size: 1, purr: 1, lift: 1, look: 1, sex: 1, taken: 1 };
  function castEst9(S, m, a) {
    var fn = art.character, who = m.who || 'clancat', face = m.facing || a.face || 'right', H = a.h * (m.size > 0 ? +m.size : 1), k;
    var o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: face };
    if (m.variant != null) o.variant = m.variant;
    for (k in m) if (Object.prototype.hasOwnProperty.call(m, k) && !OWN9[k] && m[k] != null) o[k] = m[k];
    if (who === 'player') { o.look = S.look || {}; if (o.look.sex) o.sex = o.look.sex; }
    var ch = null, ref = null;
    if (typeof fn === 'function' && !fn.placeholder) {
      try { ch = fn(who, o); ref = fn('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }); } catch (e) { ch = null; }
    }
    if (!ch || !(ch.w > 0) || !(ch.h > 0) || !ref || !(ref.h > 0)) return { body: [a.x - H * 0.42, a.y - H * 0.78, a.x + H * 0.42, a.y], head: [a.x - H * 0.2, a.y - H * 0.78, a.x + H * 0.2, a.y - H * 0.42] };
    var s = H / ref.h, bb = ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h };
    var hb = ch.headBox || { x0: ch.head.x - ch.w * 0.2, y0: ch.head.y - ch.h * 0.18, x1: ch.head.x + ch.w * 0.2, y1: ch.head.y + ch.h * 0.18 };
    function W(b) { return [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s]; }
    return { body: W(bb), head: W(hb) };
  }
  function atSpot9(S, name) {
    var cast = S.cast || [];
    for (var i = 0; i < cast.length; i++) if (cast[i] && cast[i].at === name) return cast[i];
    return null;
  }
  // The soft shadow on the sand under whoever is in the air at `air` (and a fainter one under `skim`): scenes.js
  // lays none there (the spots are `air`), so the set lays it, as chapter 7's `over` does. Under her body as drawn,
  // on the sand below her. Nothing when nobody is there.
  function sandShadow(S, name) {
    var m = atSpot9(S, name), a = BANK9[name];
    if (!m) return '';
    var b = castEst9(S, m, a).body, cx = (b[0] + b[2]) / 2, rx = (b[2] - b[0]) * (name === 'air' ? 0.28 : 0.3), ry = Math.max(7, a.h * 0.06), y = SAND_UNDER[name];
    var op = name === 'air' ? 0.34 : 0.22;
    return g(ell(cx, y, rx, ry, S.pal.shade, { opacity: op, filter: S.blur('brsand', 4) }), { 'data-art': name + '-shadow' });
  }
  // Whoever is at `paddle` sits in the bright shallows: the water laid back over her legs (her chest, sitting up
  // in `splash`), its top a little wavy, rings round her and drops flying; nothing dark in it, ever (no shadow
  // shows under the water). <g data-art="paddle">.
  function paddleCover(S, m) {
    var a = BANK9.paddle, q = shoalCols(S), e = castEst9(S, m, a), b = e.body, bh = b[3] - b[1], r = rng(951);
    var deep = m.pose === 'splash' ? 0.34 : 0.22, top = a.y - bh * deep, x0 = b[0] - bh * 0.1, x1 = b[2] + bh * 0.1, bot = a.y + a.h * 0.3;
    // a pool round her: its top a little wavy, its ends rounded down into the shallows (no straight side)
    var dd = (x1 - x0) * 0.1, d = 'M' + n(x0) + ' ' + n(bot) + 'Q' + n(x0) + ' ' + n(top + 8) + ' ' + n(x0 + dd) + ' ' + n(top + 6), k = 6, i;
    for (i = 0; i < k; i++) { var xa = lerp(x0 + dd, x1 - dd, i / k), xb = lerp(x0 + dd, x1 - dd, (i + 1) / k); d += 'Q' + n((xa + xb) / 2) + ' ' + n(top - 5 + (i % 2) * 8) + ' ' + n(xb) + ' ' + n(top + 6); }
    d += 'Q' + n(x1) + ' ' + n(top + 8) + ' ' + n(x1) + ' ' + n(bot) + 'Z';
    // the water stops at the edge: it never lies over the sand
    var wet = [];
    for (var x = -30; x <= 1640; x += 40) wet.push([x, yOn(EDGE, x) + 2]);
    var edgeClip = S.clip('brpaddleedge', path(pts([[-30, 560]].concat(wet, [[1640, 560]])) + 'Z', '#fff'));
    // (soft at its ends: a wide pool blurred, and over it a narrower one, so no edge shows on the river)
    var inner = 'M' + n(x0 + dd * 2) + ' ' + n(bot) + 'Q' + n(x0 + dd * 2) + ' ' + n(top + 10) + ' ' + n(x0 + dd * 3) + ' ' + n(top + 8) + 'L' + n(x1 - dd * 3) + ' ' + n(top + 8) + 'Q' + n(x1 - dd * 2) + ' ' + n(top + 10) + ' ' + n(x1 - dd * 2) + ' ' + n(bot) + 'Z';
    var water = path(d, S.linU([[0, q.green], [0.45, q.bedFar], [1, q.bed]], 0, top, 0, a.y + 10), { opacity: 0.8, filter: S.blur('brpaddle', 10) }) +
      path(inner, S.linU([[0, q.green], [0.45, q.bedFar], [1, q.bed]], 0, top, 0, a.y + 10), { opacity: 0.9, filter: S.blur('brpaddle2', 3) });
    var lines = '';
    for (i = 0; i < 6; i++) { var lx = x0 + r() * (x1 - x0), ly = top + 10 + r() * (a.y - top - 10), lw = 20 + r() * 30; lines += 'M' + n(lx) + ' ' + n(ly) + 'q' + n(lw / 4) + ' -3 ' + n(lw / 2) + ' 0t' + n(lw / 2) + ' 0'; }
    water += stroke(lines, q.ripple, 2, { opacity: 0.6 });
    var s = g(water, { 'clip-path': edgeClip });
    var cx = (b[0] + b[2]) / 2, w = (x1 - x0) / 2;
    s += stroke('M' + n(x0 + w * 0.12) + ' ' + n(top + 4) + 'Q' + n(cx) + ' ' + n(top - 4) + ' ' + n(x1 - w * 0.12) + ' ' + n(top + 4), '#FFFFFF', Math.max(2, a.h * 0.014), { opacity: 0.9 });
    [[0.62, 0.09, 0.8], [0.86, 0.13, 0.55], [1.08, 0.17, 0.32]].forEach(function (t) {
      var rx = w * t[0], ry = w * t[1];
      s += stroke('M' + n(cx - rx) + ' ' + n(top + 6) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 0 ' + n(cx + rx) + ' ' + n(top + 6), q.ripple, Math.max(1.4, a.h * 0.011), { opacity: t[2], 'stroke-dasharray': n(rx * 0.8) + ' ' + n(rx * 0.22) });
    });
    // drops flying up round her
    var drops = '';
    for (i = 0; i < (m.pose === 'splash' ? 9 : 4); i++) {
      var side = i % 2 ? 1 : -1, dx = cx + side * w * (0.55 + r() * 0.5), dy = top - 10 - r() * bh * 0.35, dr = 3 + r() * 4;
      drops += K.dropD(dx, dy, dr);
    }
    s += path(drops, '#F2FBFF', { opacity: 0.9 });
    return g(s, { 'data-art': 'paddle' });
  }

  function drawBank(S) {
    var p = S.pal, o = S.opts, c = cols(S), back = '', over = '', front = '', r = rng(401), i, x, y;
    // sky, soft clouds blowing away after the storm, an airplane drifting down toward the river
    // (chapter 5: at sunset the sun has come down behind the truss; at dusk it is going behind the far shore)
    var eve = evening(S);
    back += K.sky(S, 0, 0, 1600, 640, eve ? { sun: [1296, eve === 'dusk' ? 552 : 414], sunR: 520 } : { sun: [1430, 130], sunR: 460 });
    var cl = blob(1130, 250, 130, 34, 10, rng(402), 0.25, 0.32) + blob(1220, 236, 90, 30, 9, rng(403), 0.25, 0.32) + blob(760, 120, 100, 26, 9, rng(404), 0.25, 0.32) + blob(820, 112, 70, 24, 9, rng(405), 0.25, 0.32);
    back += path(cl, mix(p.sky[1], '#FFFFFF', 0.4), { transform: 'translate(0 6)', opacity: 0.7 }) + path(cl, '#FFFFFF', { opacity: 0.8 });
    back += K.plane(S, 960, 196, 0.9, 'left');
    // the far shore: a low line of trees, and the Needle
    var shore = mix(p.leaf, p.haze, 0.6);
    back += path(mound(380, 1720, 602, 556, 14, rng(406), 0.3, 0.3, 0.3), shore);
    back += path('M1372 600L1379 452L1386 440L1393 452L1400 600Z', mix(p.haze, p.stoneDark, 0.3)) + rect(1388, 452, 5, 148, mix(p.haze, '#FFFFFF', 0.4), { opacity: 0.7 });
    // the river
    var water = riverWater(S, c, 0, 598, 1600, 1000, { key: 'bank', lines: 54, swirls: 20, debris: 8 });
    back += water;
    // chapter 9: the bright shallows at the bridge's foot (`shallows: true`); off, nothing at all
    var shoal = o.shallows === true ? shallowsWater(S, c) : '';
    back += shoal;
    // the far legs, far to near, with the river and the far shore showing between them
    for (i = 4; i >= 1; i--) back += bankLeg(S, c, LEGS[i], i);
    // the dark space under the near end
    var mouthQ = [[92, yv(DB, 92) - 2], [560, yv(DB, 560) - 2], [560, 762], [514, 748], [300, 724], [92, 708]];
    var mouthD = pts(mouthQ) + 'Z', mouthClip = S.clip('brmouth', path(mouthD, '#fff'));
    var inner = rect(80, 380, 500, 400, S.linU([[0, c.dark0], [0.55, c.dark0], [0.85, c.dark1], [1, mix(c.dark2, c.mudDk, 0.3)]], 0, 392, 0, 750));
    // the deck's underside: cross beams, closer together as they go back toward the bank
    [[8, 16], [52, 9], [84, 5]].forEach(function (cb) {
      inner += path(quad([[80, yv(DB, 80) + cb[0]], [580, yv(DB, 580) + cb[0]], [580, yv(DB, 580) + cb[0] + cb[1]], [80, yv(DB, 80) + cb[0] + cb[1]]]), c.dark1) +
        stroke(pts([[80, yv(DB, 80) + cb[0] + cb[1]], [580, yv(DB, 580) + cb[0] + cb[1]]]), c.dark2, 2, { opacity: 0.8 });
    });
    // the back, where the bank climbs to meet the deck: old stones, big and small
    inner += path(mound(100, 570, 650, 540, 8, rng(407), 0.32, 0.25, 0.4), c.dark1);
    var st = '', sth = '';
    for (i = 0; i < 14; i++) {
      var big = i < 7, sx = big ? 130 + i * 66 + r() * 16 : 150 + (i - 7) * 62 + r() * 20, sy = big ? 612 + r() * 16 : 574 + r() * 14, srx = big ? 30 + r() * 10 : 18 + r() * 8, sry = big ? 20 + r() * 6 : 12 + r() * 4;
      st += blob(sx, sy, srx, sry, 8, r, 0.2, 0.25); sth += 'M' + n(sx - srx * 0.6) + ' ' + n(sy - sry * 0.7) + 'q' + n(srx * 0.6) + ' ' + n(-sry * 0.4) + ' ' + n(srx * 1.2) + ' 0';
    }
    inner += path(st, mix(c.dark1, c.dark2, 0.5)) + stroke(sth, c.dark3, 2.2, { opacity: 0.6 });
    inner += ell(330, 560, 300, 150, S.radU([[0, '#0E1424', 0.6], [1, '#0E1424', 0]], 330, 560, 300));
    inner += path('M92 708L300 724L514 748L560 762L560 690Q330 650 92 664Z', S.linU([[0, mix(c.dark3, '#8A8070', 0.15)], [1, mix(c.dark2, c.mudDk, 0.25)]], 0, 660, 0, 760));
    inner += ell(330, 742, 230, 22, S.radU([[0, c.warm, 0.32], [1, c.warm, 0]], 330, 742, 230));
    if (o.drag !== false) inner += dragMarks(S, BANK_MARKS, 74, 26, { lip: c.dark0, bed: c.dark3, deep: c.dark1, scuffs: false });
    if (o.drips !== false) inner += drip(S, 210, yv(DB, 210) + 4, 300, 3.2, 0.3, c.drop, c.dark4) + drip(S, 430, yv(DB, 430) + 4, 300, 3.2, 1.2, c.drop, c.dark4);
    back += g(inner, { 'clip-path': mouthClip });
    // the first leg and the abutment, the deck and the truss over all of it
    back += g(bankLeg(S, c, LEGS[0], 0), { filter: S.shadow('m') });
    var ab = stoneFace(S, [[-30, 250], [96, 250], [96, 712], [-30, 704]], { rows: 10, per: 1.4, seed: 81, col: c.stone, dk: c.stoneDk, lt: c.stoneLt, rim: p.rim, rimOp: 0.55, moss: 0.3, mossW: 16 });
    ab += path('M-30 250H40L40 300H-30Z', mix(p.grass, p.leaf, 0.3)) + path(mound(-60, 70, 262, 220, 6, rng(82), 0.3, 0.2, 0.3), p.grass);
    ab += path(quad([[82, 250], [96, 250], [96, 712], [82, 712]]), c.warm, { opacity: 0.45 });
    back += g(ab, { filter: S.shadow('m') });
    var bridge = bankTruss(S, c, true) + bankDeck(S, c);
    if (o.train) bridge += bankTrain(S, c);
    bridge += bankTruss(S, c, false);
    back += g(bridge, { filter: S.shadow('m') });
    if (o.train) back += grit(S, 120, 520, yv(DB, 300) + 6, 260, 14, 432, mix(c.mudLt, '#FFFFFF', 0.3));
    // our bank: mud by the water, flattened grass, puddles
    var gd = smooth(EDGE) + 'L1640 1020L-30 1020Z';
    back += path(gd, S.linU([[0, mix(c.mud, c.mudWet, 0.3)], [0.35, mix(c.mud, p.grass, 0.18)], [0.7, mix(c.mud, p.grass, 0.38)], [1, mix(p.grassNear, c.mudDk, 0.45)]], 0, 700, 0, 1000));
    var gtex = '';
    for (i = 0; i < 26; i++) { x = r() * 1600; y = 790 + r() * 200; if (y < yOn(EDGE, x) + 20) continue; gtex += blob(x, y, 40 + r() * 70, 6 + (y - 780) * 0.04, 9, r, 0.25, 0.2); }
    back += path(gtex, c.mudWet, { opacity: 0.5 });
    var wet = [], wetB = [];
    for (x = 514; x <= 1640; x += 40) { wet.push([x, yOn(EDGE, x)]); wetB.unshift([x, yOn(EDGE, x) + 18 + (x - 514) * 0.02]); }
    back += path(pts(wet.concat(wetB)) + 'Z', c.mudWet, { opacity: 0.8 }) + stroke(smooth(wet), c.foam, 2.5, { opacity: 0.6 });
    back += path('M92 708L300 724L514 748L600 778L480 804L92 784L-30 774L-30 700Z', c.dark1, { opacity: 0.5, filter: S.blur('brsh', 9) });
    var groundClip = S.clip('brground', path(gd, '#fff'));
    var ground = '';
    var sky = S.lin('brpud', [[0, mix(p.sky[1], c.mudWet, 0.2)], [1, mix(p.sky[3], c.mudWet, 0.15)]]);
    ground += puddle(S, 660, 912, 74, 11, 411, sky, c.mudWet) + puddle(S, 1010, 966, 96, 13, 412, sky, c.mudWet) + puddle(S, 130, 836, 48, 7, 413, sky, c.mudWet);
    var fl = [];
    for (i = 0; i < 90; i++) { x = r() * 1640; y = 760 + Math.pow(r(), 0.8) * 250; if (y < yOn(EDGE, x) + 10) continue; fl.push([x, y, 14 + (y - 700) * 0.09 * (0.6 + r() * 0.6), 0.25 + (r() - 0.5) * 0.5]); }
    ground += flatReeds(S, c, fl);
    if (o.drag !== false) {
      ground += flatReeds(S, c, swathAlong(BANK_MARKS, 100, 46, 80, 414, 38, 18));
      ground += dragMarks(S, BANK_MARKS, 74, 26, { lip: mix(c.mudWet, c.mudDk, 0.3), bed: mix(c.mud, c.mudLt, 0.2), deep: c.mudWet, scuffs: false });
    }
    back += g(ground, { 'clip-path': groundClip });
    // chapter 9: the strip of soft sand along the water at the bridge's foot, and the soft shadows on it under
    // whoever is in the air (`air`, `skim`: only when someone is there)
    if (o.shallows === true) back += sandStrip(S, c);
    back += sandShadow(S, 'air') + sandShadow(S, 'skim');
    // reeds standing along the water's edge (a gap where something came up out of the river)
    var spots = [];
    for (x = 570; x < 1650; x += 9 + r() * 10) {
      if (o.drag !== false && Math.abs(x - 925) < 75) continue;
      y = yOn(EDGE, x) + 4 + r() * 24;
      spots.push([x, y, (60 + r() * 60) * clamp((y - 640) / 240, 0.5, 1.2)]);
    }
    // (chapter 9: along the sand they part, and stand again past it, screening the practice from the river path)
    if (o.shallows === true) spots = spots.filter(function (q) { return q[0] < SAND9.x0 || q[0] > SAND9.x1 - 10; });
    var reeds = reedBed(S, c, spots, { seed: 415, lean: 0.25 });
    back += g(reeds, { filter: S.shadow('s') });
    // chapter 5: whoever swims alongside (`water`) sits in the river, beyond the reeds
    var swimmer = null;
    for (i = 0; i < (S.cast || []).length; i++) if (S.cast[i] && S.cast[i].at === 'water') { swimmer = S.cast[i]; break; }
    if (swimmer) S.covers.water = swimCover(S, c, BANK_WATER, water + shoal, reeds, swimmer);
    // chapter 9: whoever paddles in the shallows
    var paddler = atSpot9(S, 'paddle');
    if (paddler) S.covers.paddle = paddleCover(S, paddler);
    // Riffle's rock at the shadow's edge
    over += g(rock(S, c, 492, 780, 124, 64, 416, { shadeLeft: 0.35 }), { filter: S.shadow('s') });
    // reeds in front of a cat among the reeds (chapter 9: with the sand there, only when someone is at `reeds`)
    if (o.shallows !== true || atSpot9(S, 'reeds')) S.covers.reeds = flatReeds(S, c, [[950, 882, 40, -0.3], [980, 888, 46, -2.6], [1030, 884, 38, -0.5], [1060, 890, 30, 3.0], [920, 886, 32, 0.2]]) +
      reedBed(S, c, [[904, 892, 74], [1092, 894, 70], [1112, 896, 56]], { seed: 417, lean: 0.4 });
    // framing reeds in the bottom corners
    var fr = [];
    for (i = 0; i < 26; i++) fr.push([-40 + r() * 170, 994 + r() * 20, 150 + r() * 170]);
    for (i = 0; i < 24; i++) fr.push([1460 + r() * 190, 994 + r() * 20, 140 + r() * 160]);
    // (chapter 9: with the sand, the left corner's reeds are shorter, so the friends watching there show)
    if (o.shallows === true) fr = fr.map(function (q) { return q[0] < 400 ? [q[0] - 20, q[1], q[2] * 0.62] : q; });
    front += g(reedBed(S, c, fr, { seed: 418, lean: 0.1, k: 2.6, w: 1.6 }), { filter: S.shadow('m') });
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ MOUTH: close on the dark

  function gTop(x) { return 128 - 28 * x / 1600; }   // the deck's iron edge across the top
  function gBot(x) { return 252 - 36 * x / 1600; }
  var M_EDGE = [[-30, 846], [175, 834], [600, 822], [1070, 812], [1270, 812], [1380, 838], [1500, 864], [1640, 880]];
  var M_MARKS = [[1660, 930], [1180, 1000], [1000, 830], [640, 540]];

  function drawMouth(S) {
    var p = S.pal, o = S.opts, c = cols(S), back = '', over = '', front = '', r = rng(501), i, x, y;
    // the sky over the deck, and the daylight beyond the right-hand leg
    back += K.sky(S, 0, 0, 1600, 600, { sun: [1500, 60], sunR: 520 });
    var shore = mix(p.leaf, p.haze, 0.55);
    back += path(mound(1220, 1680, 578, 540, 6, rng(502), 0.3, 0.3, 0.3), shore);
    back += path('M1466 576L1470 494L1474 488L1478 494L1482 576Z', mix(p.haze, '#FFFFFF', 0.25));
    back += riverWater(S, c, 1150, 572, 1640, 960, { key: 'mouth', lines: 26, swirls: 10, debris: 4, seed: 503 });
    // inside the dark: the deck's underside going back, and the bank climbing up under it, so the
    // deepest dark is the wedge where the two meet (the den nobody goes into)
    var Q = { L: [175, gBot(175)], R: [1070, gBot(1070)], DL: [175, 834], DR: [1070, 812] };
    var opening = pts([Q.L, Q.R, Q.DR, Q.DL]) + 'Z', clipIn = S.clip('brin', path(opening, '#fff'));
    var inner = path(opening, c.dark0);
    inner += rect(150, 200, 950, 300, S.linU([[0, c.dark2], [0.6, c.dark1], [1, '#111a2e']], 0, 230, 0, 500));
    [[10, 30], [96, 16], [156, 8]].forEach(function (cb) {
      inner += path(quad([[150, gBot(150) + cb[0]], [1100, gBot(1100) + cb[0]], [1100, gBot(1100) + cb[0] + cb[1]], [150, gBot(150) + cb[0] + cb[1]]]), c.dark1) +
        stroke(pts([[150, gBot(150) + cb[0] + cb[1]], [1100, gBot(1100) + cb[0] + cb[1]]]), c.dark3, 2.5, { opacity: 0.4 });
    });
    // the legs' inner faces, a little way in before the dark takes them
    inner += stoneFace(S, [Q.L, [262, gBot(262) + 40], [262, 770], Q.DL], { rows: 7, per: 1, seed: 511, col: c.dark2, dk: c.dark0, lt: c.dark3, mortar: c.dark0, rim: c.dark4, rimOp: 0.4, lw: 2.5 });
    inner += stoneFace(S, [[992, gBot(992) + 40], Q.R, Q.DR, [992, 762]], { rows: 7, per: 1, seed: 512, col: c.dark2, dk: c.dark0, lt: c.dark3, mortar: c.dark0, rim: c.dark4, rimOp: 0.4, lw: 2.5 });
    // the bank, climbing to meet the deck: mud at its foot, dry and pale higher up, old stones on top
    var slope = 'M150 840L150 546Q300 500 450 514Q600 474 760 500Q900 482 1100 526L1100 820Z';
    inner += path(slope, S.linU([[0, mix(c.dark3, '#A09682', 0.24)], [0.35, mix(c.dark2, '#8A7C68', 0.22)], [0.75, mix(c.dark2, c.mudWet, 0.4)], [1, mix(c.dark3, c.mudWet, 0.55)]], 0, 480, 0, 834));
    var pb = '';
    for (i = 0; i < 46; i++) { x = 200 + r() * 860; y = 560 + Math.pow(r(), 1.3) * 260; pb += blob(x, y, 3 + (y - 540) * 0.035 + r() * 4, 2 + (y - 540) * 0.016, 6, r, 0.3, 0.3); }
    inner += path(pb, c.dark3, { opacity: 0.6 });
    if (o.drag !== false) inner += dragMarks(S, M_MARKS, 150, 30, { lip: c.dark4, bed: c.dark1, deep: c.dark0 });
    var bst = '', bsh = '';
    for (i = 0; i < 17; i++) {
      var bx = 180 + i * 56 + r() * 16, by = 514 + Math.sin(i * 1.7) * 14 + r() * 16, br = 20 + r() * 12;
      bst += blob(bx, by, br * 1.45, br, 8, r, 0.2, 0.3); bsh += 'M' + n(bx - br * 0.9) + ' ' + n(by - br * 0.72) + 'q' + n(br * 0.9) + ' ' + n(-br * 0.42) + ' ' + n(br * 1.8) + ' 0';
    }
    inner += path(bst, c.dark2) + stroke(bsh, c.dark4, 2.5, { opacity: 0.55 });
    // the dark deepens up the slope; a little daylight lies on the mud at its foot
    inner += path(slope, S.linU([[0, c.dark0, 0.5], [0.45, c.dark0, 0.15], [1, c.dark0, 0]], 0, 480, 0, 834));
    inner += ell(620, 470, 520, 120, S.radU([[0, '#0C1222', 0.75], [1, '#0C1222', 0]], 620, 470, 520));
    inner += ell(620, 834, 480, 56, S.radU([[0, c.warm, 0.26], [1, c.warm, 0]], 620, 834, 480));
    if (o.drips !== false) {
      inner += drip(S, 520, 292, 330, 4.5, 0.7, c.drop, c.dark4) + drip(S, 800, 300, 400, 3.8, 1.6, c.drop, c.dark4) + drip(S, 340, 296, 420, 4, 0.2, c.drop, c.dark4);
    }
    // chapter 3: Riffle's fifth pebble, in the dark at the foot of the slope, rolling out, or at her paws
    var peb = pebbleProp(S, c, o.pebble, [620, 806, 262], [1000, 975, 337]);
    inner += peb.back;
    back += g(inner, { 'clip-path': clipIn });
    // the right-hand leg: old stone, sunlit on its right, the flood's debris piled at its foot
    var leg = stoneFace(S, [[1070, gBot(1070) - 4], [1270, gBot(1270) - 4], [1282, 818], [1062, 818]], { rows: 11, per: 2, seed: 521, col: c.stone, dk: c.stoneDk, lt: c.stoneLt, rim: p.rim, rimOp: 0.6, lw: 3, moss: 0.3, mossW: 20 });
    leg += path(quad([[1070, gBot(1070)], [1104, gBot(1104)], [1098, 818], [1062, 818]]), c.dark2, { opacity: 0.3 });
    leg += path(quad([[1252, gBot(1252)], [1270, gBot(1270)], [1282, 818], [1262, 818]]), p.rim, { opacity: 0.55 });
    leg += path(quad([[1066, 740], [1276, 740], [1282, 818], [1062, 818]]), S.linU([[0, c.mudDk, 0], [1, c.mudDk, 0.5]], 0, 740, 0, 818));
    leg += stroke('M1060 806L1200 770M1110 812L1290 790M1170 816l40 -30', mix(c.mudDk, '#000', 0.1), 9) + path(leafD(1120, 798, 30, -0.4, 9) + leafD(1230, 784, 26, 3.4, 8) + leafD(1180, 806, 24, -2.2, 8), mix(p.leafMid, '#C9A040', 0.3));
    back += g(leg, { filter: S.shadow('m') });
    // the left-hand wall: the abutment's face, warm daylight along its edge
    var abt = stoneFace(S, [[-30, gBot(0) - 10], [175, gBot(175) - 6], [175, 836], [-30, 848]], { rows: 12, per: 1.6, seed: 531, col: c.stone, dk: c.stoneDk, lt: c.stoneLt, rim: p.rim, rimOp: 0.55, lw: 3, moss: 0.3, mossW: 20 });
    abt += path(quad([[150, gBot(150)], [175, gBot(175)], [175, 836], [150, 838]]), c.warm, { opacity: 0.5 });
    back += g(abt, { filter: S.shadow('m') });
    // the deck's iron edge across the top, and the truss rising from it
    var deck = '', top = '', hi = '';
    for (i = 0; i < 5; i++) {
      x = -80 + i * 420;
      top += bar([x, gTop(x) - 10], [x, -40], 46, 46);
      top += bar([x + 20, gTop(x + 20) - 18], [x + 400, -40], 40, 40);
      hi += pts([[x + 22, gTop(x) - 18], [x + 22, -40]]);
    }
    top += quad([[-20, gTop(-20) - 34], [1620, gTop(1620) - 34], [1620, gTop(1620) + 2], [-20, gTop(-20) + 2]]);
    var trainPart = '';
    if (o.train) {
      var under = mix('#3A4450', p.ink, 0.2), bodyC = mix('#DDE2E8', p.rim, 0.12), wh = '', axles = '', sparks = '';
      var winC = mix('#2E3D52', p.sky[1], 0.2), wins = '';
      trainPart += rect(-20, -20, 1660, 66, bodyC) + rect(-20, 20, 1660, 9, '#3268AE') + rect(-20, 31, 1660, 4, '#D0504A') + rect(-20, 42, 1660, 34, under);
      for (x = 30; x < 1640; x += 110) wins += 'M' + x + ' -20h64v26h-64z';
      trainPart += path(wins, winC);
      for (i = 0; i < 4; i++) trainPart += rect(-10 + i * 460, -20, 22, 96, mix(under, '#000', 0.25));
      for (x = 40; x < 1640; x += 230) {
        wh += dot(x, gTop(x) - 58, 30) + dot(x + 84, gTop(x + 84) - 58, 30);
        axles += pts([[x, gTop(x) - 58], [x + 84, gTop(x + 84) - 58]]);
        sparks += K.sparkleD(x + 30, gTop(x) - 34, 12) + K.sparkleD(x + 120, gTop(x) - 30, 9);
      }
      trainPart += stroke(axles, under, 12) + path(wh, mix(under, '#000', 0.2)) + stroke(wh, c.ironLt, 3, { opacity: 0.5 });
      trainPart += path(sparks, '#FFF2B0', { 'class': 'pcs-tw' });
      var sp = '';
      for (i = 0; i < 6; i++) { var sy = 6 + i * 9; sp += 'M' + n(80 + i * 230) + ' ' + n(sy) + 'h' + n(160 + (i % 3) * 40); }
      trainPart += g(stroke(sp, '#FFFFFF', 4, { opacity: 0.55 }), { 'class': 'pcs-whoosh' });
    }
    deck += path(quad([[-20, gTop(-20)], [1620, gTop(1620)], [1620, gBot(1620)], [-20, gBot(-20)]]), S.linU([[0, c.ironLt], [0.1, c.iron], [1, c.ironDk]], 0, 120, 0, 250));
    deck += path(quad([[-20, gBot(-20) - 16], [1620, gBot(1620) - 16], [1620, gBot(1620)], [-20, gBot(-20)]]), c.ironDk);
    var riv = '', seams = '';
    for (x = 20; x < 1620; x += 36) riv += dot(x, gTop(x) + 14, 4) + dot(x, gBot(x) - 28, 4);
    for (x = 180; x < 1620; x += 300) seams += pts([[x, gTop(x) + 4], [x, gBot(x) - 18]]);
    deck += stroke(seams, c.ironDk, 3, { opacity: 0.6 }) + path(riv, c.rivet) + stroke(pts([[-20, gTop(-20) + 1], [1620, gTop(1620) + 1]]), p.rim, 4, { opacity: 0.8 });
    back += g(trainPart + g(path(top, c.iron) + stroke(hi, c.ironLt, 3, { opacity: 0.6 }), { filter: S.shadow('s') }) + deck, { filter: S.shadow('m') });
    if (o.drips !== false) back += drip(S, 640, gBot(640) + 2, 360, 4.4, 1.1, '#E6F2FA', c.dark4) + drip(S, 900, gBot(900) + 2, 330, 4, 0.4, '#E6F2FA', c.dark4);
    if (o.train) back += grit(S, 200, 1050, gBot(600) + 4, 420, 22, 504, mix(c.mudLt, '#FFFFFF', 0.3));
    // the ground in front: sun on wet mud, puddles, reeds squashed flat; the shadow's soft edge
    var gd = smooth(M_EDGE) + 'L1640 1020L-30 1020Z';
    back += path(gd, S.linU([[0, mix(c.mud, c.mudWet, 0.2)], [0.3, mix(c.mud, c.mudLt, 0.45)], [1, mix(c.mud, c.mudLt, 0.2)]], 0, 812, 0, 1000));
    var ground = '';
    var sky = S.lin('brpud', [[0, mix(p.sky[1], c.mudWet, 0.2)], [1, mix(p.sky[3], c.mudWet, 0.15)]]);
    ground += puddle(S, 250, 968, 110, 15, 541, sky, c.mudWet) + puddle(S, 1010, 950, 80, 11, 542, sky, c.mudWet);
    var fl = [];
    for (i = 0; i < 70; i++) { x = r() * 1640; y = 830 + Math.pow(r(), 0.8) * 180; if (y < yOn(M_EDGE, x) + 8) continue; fl.push([x, y, 26 + (y - 820) * 0.25 * (0.6 + r() * 0.6), 0.3 + (r() - 0.5) * 0.6]); }
    ground += flatReeds(S, c, fl);
    if (o.drag !== false) {
      ground += flatReeds(S, c, swathAlong(M_MARKS, 220, 80, 50, 543, 90, 40));
      ground += dragMarks(S, M_MARKS, 150, 34, { lip: c.mudLt, bed: c.mudWet, deep: c.mudDk });
    }
    back += g(ground, { 'clip-path': S.clip('brmground', path(gd, '#fff')) });
    back += path('M175 834L600 822L1070 812L1120 864Q900 896 600 900Q380 904 175 908L-30 914L-30 846Z', c.dark1, { opacity: 0.68, filter: S.blur('brmsh', 7) });
    // standing reeds along the water's edge at the right
    var spots = [];
    for (x = 1290; x < 1650; x += 10 + r() * 12) { y = yOn(M_EDGE, x) + 6 + r() * 26; spots.push([x, y, 110 + r() * 110]); }
    back += g(reedBed(S, c, spots, { seed: 544, lean: -0.15, k: 1.6 }), { filter: S.shadow('s') });
    // soft sunbeams outside the dark
    back += g(path('M1600 220L1640 220L1640 520L1180 1000L960 1000Z', S.linU([[0, '#FFF6D8', 0.28], [1, '#FFF6D8', 0]], 1600, 220, 1100, 1000)), { style: 'mix-blend-mode:screen' });
    // Riffle's rock, right at the shadow's edge (its left side in the shade)
    over += g(rock(S, c, 415, 905, 310, 205, 545, { shadeLeft: 0.7 }), { filter: S.shadow('m') });
    // tufts squashed in the bottom corners
    var fr = [];
    for (i = 0; i < 12; i++) fr.push([-30 + r() * 140, 1000 + r() * 14, 120 + r() * 120]);
    front += g(reedBed(S, c, fr, { seed: 546, lean: 0.5, k: 2.4 }), { filter: S.shadow('s') });
    front += peb.front;
    // the rain only falls outside
    S.weatherClip = S.clip('brmrain', path('M0 0H1600V1000H0Z' + opening, '#fff', { 'clip-rule': 'evenodd' }));
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ UNDER: inside the dark

  // One-point view toward the back of the dark, everything running back to U_VP. The open side is
  // at the left: slivers of daylight and the river between the stone legs. The deck's underside is
  // overhead; at the back the bank climbs to meet it, and the dark is deepest where they meet.
  var U_VP = [1000, 470];
  function uDeck(x) { return 290 + 0.18 * x; }       // the deck's edge along the open side
  function uWater(x) { return 830 - 0.36 * x; }      // the water line along the open side
  var U_LEGS = [[140, 340, 621], [520, 590, 622], [742, 774, 623]];
  var U_MARKS = [[420, 1050], [820, 1000], [880, 720], [1040, 506]];
  var U_EDGE = [[460, 1010], [520, 900], [610, 800], [720, 690], [820, 590], [880, 528]];   // the water's edge on the floor, front to back
  // the ground, rising at the back into the bank that climbs to meet the deck
  var U_GROUND = 'M-10 834L880 513Q940 496 1000 490Q1100 476 1200 482Q1290 480 1350 506L1350 560L1610 628L1610 1010L-10 1010Z';
  var U_RW = [[1350, 430], [1610, 400], [1610, 628], [1350, 560]];

  function drawUnder(S) {
    var p = S.pal, o = S.opts, c = cols(S), back = '', front = '', r = rng(601), i, x, y;
    back += rect(-10, -10, 1620, 1020, c.dark0);
    // daylight through the open side: sky, the far shore at eye level, the river; dimmer further back
    var side = pts([[-10, uDeck(-10)], [880, uDeck(880)], [880, uWater(880)], [-10, uWater(-10)]]) + 'Z';
    var day = K.sky(S, -10, 0, 900, 480, { sun: [70, 200], sunR: 380 });
    day += path(mound(-40, 900, 478, 444, 10, rng(602), 0.3, 0.3, 0.3), mix(p.leaf, p.haze, 0.55));
    day += riverWater(S, c, -10, 474, 900, 920, { key: 'under', lines: 30, swirls: 10, debris: 4, seed: 603, size: 0.8 });
    day += rect(-10, 0, 910, 920, S.linU([[0, c.dark0, 0], [0.3, c.dark0, 0.3], [1, c.dark0, 0.72]], 150, 0, 880, 0));
    back += g(day, { 'clip-path': S.clip('brside', path(side, '#fff')) });
    // the deck overhead: its underside, beams running back toward the dark
    var ceil = pts([[-10, -10], [1610, -10], [1610, 400], [1350, 430], [880, 440], [-10, uDeck(-10)]]) + 'Z';
    back += path(ceil, S.linU([[0, c.dark2], [0.65, c.dark1], [1, '#121a2e']], 0, 0, 0, 440));
    var beams = '', bhi = '', cross = '';
    [-300, 100, 500, 900, 1300, 1700, 2100].forEach(function (fx) {
      var ex = lerp(fx, U_VP[0], 0.8), ey = lerp(-10, U_VP[1], 0.8);
      beams += bar([fx, -10], [ex, ey], 64, 10);
      bhi += pts([[fx - 28, -10], [ex - 4, ey]]);
    });
    // cross beams, closer together as they go back
    [[24, 40], [160, 26], [256, 17], [322, 12], [368, 8], [402, 6]].forEach(function (cb) {
      cross += quad([[-10, cb[0]], [1610, cb[0]], [1610, cb[0] + cb[1]], [-10, cb[0] + cb[1]]]);
    });
    back += g(path(cross, c.dark1) + path(beams, c.dark1) + stroke(bhi, c.dark3, 3, { opacity: 0.5 }), { 'clip-path': S.clip('brceil', path(ceil, '#fff')) });
    // the right-hand wall: the abutment's inner face, old stone fading into the dark
    back += stoneFace(S, U_RW, { rows: 6, per: 3, seed: 611, col: c.dark1, dk: c.dark0, lt: c.dark2, mortar: c.dark0, rim: c.dark3, rimOp: 0.45, lw: 2.5 });
    // the darkest dark: where the bank meets the deck at the back
    back += path(pts([[870, 436], [1350, 426], [1350, 540], [870, 540]]) + 'Z', '#0E1526');
    if (o.eyes === 'open' || o.eyes === 'blink') {
      back += ell(1100, 458, 110, 36, S.radU([[0, '#0A1020', 0.95], [1, '#0E1526', 0]], 1100, 458, 110));
      back += eyePair(S, c, 1100, 457, 11, 40, o.eyes);
      (S.keep = S.keep || []).push({ x: 1050, y: 432, w: 100, h: 50 });
    }
    // the ground: mud by the water, drier and paler toward the back, up the bank to the dark
    back += path(U_GROUND, S.linU([[0, mix(c.dark3, '#A09682', 0.24)], [0.25, mix(c.dark2, '#80725E', 0.24)], [1, mix(c.mudWet, c.dark2, 0.25)]], 0, 480, 0, 1000));
    var fClip = S.clip('brfloor', path(U_GROUND, '#fff')), fl = '';
    var bs = '', bsh = '';
    for (i = 0; i < 12; i++) { x = 900 + i * 40 + r() * 10; y = 494 + Math.sin(i * 1.9) * 6 + r() * 6; var br = 14 + r() * 7; bs += blob(x, y, br * 1.4, br, 8, r, 0.2, 0.3); bsh += 'M' + n(x - br * 0.9) + ' ' + n(y - br * 0.7) + 'q' + n(br * 0.9) + ' ' + n(-br * 0.4) + ' ' + n(br * 1.8) + ' 0'; }
    // the water along the open side, lit by the daylight
    var wd = smooth(U_EDGE.concat([[900, uWater(900)]])) + 'L-10 ' + n(uWater(-10)) + 'L-10 1010Z';
    fl += g(riverWater(S, c, -10, 500, 920, 1010, { key: 'uw', lines: 34, swirls: 10, debris: 3, seed: 604 }), { 'clip-path': S.clip('bruw', path(wd, '#fff')) });
    fl += path(wd, S.linU([[0, c.dark0, 0.05], [0.6, c.dark0, 0.25], [1, c.dark0, 0.55]], 200, 1000, 880, 540));
    fl += stroke(smooth(U_EDGE), c.foam, 3, { opacity: 0.4 });
    var dots = '';
    for (i = 0; i < 70; i++) { x = 540 + r() * 1060; y = 560 + Math.pow(r(), 1.3) * 440; dots += blob(x, y, 2 + (y - 540) * 0.025 + r() * 4, 1.5 + (y - 540) * 0.012, 6, r, 0.3, 0.3); }
    fl += path(dots, mix(c.dark3, '#A09682', 0.25), { opacity: 0.55 });
    if (o.drag !== false) fl += dragMarks(S, U_MARKS, 220, 30, { lip: mix(c.mudLt, c.dark3, 0.5), bed: mix(c.mudWet, c.dark1, 0.3), deep: mix(c.mudDk, c.dark0, 0.45) });
    // chapter 3: Sprinkle's own prints beside them, big, five long claws each
    if (o.prints === true) fl += printsAlong(S, U_MARKS, U_PRINTS.w0, U_PRINTS.w1, { lip: mix(c.mudLt, c.dark4, U_PRINTS.lipK), deep: mix(c.mudDk, c.dark0, 0.6), fs: U_PRINTS.fs, size: U_PRINTS.size, gap: U_PRINTS.gap, step: U_PRINTS.step, t0: U_PRINTS.t0, t1: U_PRINTS.t1 });
    fl += path(bs, c.dark2) + stroke(bsh, c.dark4, 2, { opacity: 0.5 });
    // the dark gathers toward the back and the right; daylight warms the mud by the water
    fl += path('M-10 470H1610V1010H-10Z', S.linU([[0, c.dark0, 0], [0.4, c.dark0, 0.2], [1, c.dark0, 0.6]], 420, 1000, 1300, 520));
    fl += ell(240, 940, 480, 170, S.radU([[0, c.warm, 0.32], [1, c.warm, 0]], 240, 940, 480));
    back += g(fl, { 'clip-path': fClip });
    // chapter 7: the sum scratched in the open mud at the front (`compare`), and the Tap on the nearest print
    if (o.compare) {
      var cmp = K.compareLines ? K.compareLines(S, { nums: o.compare, x: U_COMPARE.x, y: U_COMPARE.y, w: U_COMPARE.w, size: U_COMPARE.size, gap: U_COMPARE.gap,
        groove: mix(c.mudDk, '#0A0F1C', 0.45), shine: mix(c.mudLt, '#FFF1D8', 0.55), patch: mix(c.mudLt, c.dark3, 0.3), word: 'mud' }) : null;
      if (cmp) { back += cmp.svg; (S.keep = S.keep || []).push(cmp.box); }
    }
    if (o.tap === 'print' && o.prints === true) {
      var tp = tapPrint(S);
      if (tp) {
        var tb = tp.box;
        back += rect(tb[0], tb[1], tb[2] - tb[0], tb[3] - tb[1], 'none', { 'class': 'pc-tap', 'data-tap': 'print', 'pointer-events': 'none' });
        (S.keep = S.keep || []).unshift({ x: tb[0] - 4, y: tb[1] - 4, w: tb[2] - tb[0] + 8, h: tb[3] - tb[1] + 8 });
      }
    }
    var ev = evening(S), ec = ev ? eveCol(S, ev) : null, eo = ev === 'gold' ? 1 : 0.55;
    if (ev) {
      // evening: the low light comes in long from the open side, in bands across the floor toward the back
      var bands = '';
      [[928, 986], [776, 812], [660, 680], [586, 596]].forEach(function (b) { bands += pts([[-10, b[0]], [1610, b[0] - 14], [1610, b[1] - 10], [-10, b[1]]]) + 'Z'; });
      back += g(path(bands, S.linU([[0, ec, 0.5 * eo], [0.55, ec, 0.22 * eo], [1, ec, 0.04]], 0, 0, 1500, 0)), { 'clip-path': fClip, style: 'mix-blend-mode:screen' });
      back += ell(160, 900, 560, 260, S.radU([[0, ec, 0.38 * eo], [1, ec, 0]], 160, 900, 560), { style: 'mix-blend-mode:screen' });
    }
    // chapter 3: the branch, a heap of old sticks at the far back; the pebble in the dark
    if (o.branch === true) back += g(fallenBranch(S, c, 1080, 516, 1330, 494, 0.3, 731, 0.6), { 'data-art': 'branch' });
    var peb = pebbleProp(S, c, o.pebble, [1150, 548, 140], [760, 930, 320]);
    back += peb.back;
    // the stone legs along the open side, warm daylight on their edges; the deck's edge above
    U_LEGS.forEach(function (L) {
      var x0 = L[0], x1 = L[1], w = x1 - x0, Q = [[x0, uDeck(x0) - 4], [x1, uDeck(x1) - 4], [x1, uWater(x1) + 12], [x0, uWater(x0) + 12]];
      back += stoneFace(S, Q, { rows: Math.round(4 + w / 18), per: 1.2, seed: L[2], col: mix(c.dark3, c.stoneDk, 0.3), dk: c.dark1, lt: c.dark4, mortar: c.dark1, rim: c.dark4, rimOp: 0.5, lw: 2.5, moss: 0.2, mossCol: mix(p.moss, c.dark2, 0.5), mossW: 8 + w * 0.06 });
      back += path(quad([[x0, uDeck(x0)], [x0 + w * 0.12, uDeck(x0 + w * 0.12)], [x0 + w * 0.12, uWater(x0 + w * 0.12) + 12], [x0, uWater(x0) + 12]]), c.warm, { opacity: 0.55 });
      back += path(quad([[x0 + w * 0.5, uDeck(x0 + w * 0.5)], [x1, uDeck(x1)], [x1, uWater(x1) + 12], [x0 + w * 0.5, uWater(x0 + w * 0.5) + 12]]), c.dark0, { opacity: 0.3 });
      back += path(blob((x0 + x1) / 2, uWater((x0 + x1) / 2) + 12, w * 0.7, 5 + w * 0.04, 8, rng(L[2] + 9), 0.3, 0.3), c.foam, { opacity: 0.35 });
    });
    back += path(pts([[-10, 200], [900, 404], [900, uDeck(900) + 4], [-10, uDeck(-10) + 6]]) + 'Z', c.dark1);
    back += stroke(pts([[-10, uDeck(-10) + 4], [900, uDeck(900) + 2]]), c.warm, 4, { opacity: 0.5 });
    // drips from the beams, rings spreading where they land
    if (o.drips !== false) {
      back += drip(S, 600, 210, 600, 5, 0.5, c.drop, c.dark4) + drip(S, 950, 310, 340, 4, 1.4, c.drop, c.dark4) + drip(S, 1230, 230, 520, 4.6, 0.9, c.drop, c.dark4) +
        drip(S, 1460, 130, 700, 5.4, 0.1, c.drop, c.dark4) + drip(S, 800, 260, 430, 4.2, 1.9, c.drop, c.dark4);
    }
    if (o.train) back += grit(S, 300, 1500, 40, 560, 26, 605, mix(c.dark4, '#FFFFFF', 0.2));
    // evening: the beams overhead catch it along their lower edges
    if (ev) {
      var edges = '';
      [-300, 100, 500, 900, 1300].forEach(function (fx) { edges += pts([[fx + 30, -10], [lerp(fx, U_VP[0], 0.8) + 4, lerp(-10, U_VP[1], 0.8)]]); });
      [[64, 0], [186, 0], [273, 0], [334, 0]].forEach(function (cb) { edges += pts([[-10, cb[0]], [1610, cb[0]]]); });
      back += g(stroke(edges, ec, 3, { opacity: 0.32 * eo }), { 'clip-path': S.clip('brceil', path(ceil, '#fff')) });
    }
    // dark clods of mud in the near right corner
    front += g(path(blob(1560, 1000, 200, 60, 10, rng(606), 0.25, 0.3) + blob(1380, 1020, 120, 36, 9, rng(607), 0.25, 0.3), mix(c.dark1, c.mudDk, 0.3)) +
      stroke('M1370 970q90 -36 230 -30', c.dark4, 3, { opacity: 0.4 }), { filter: S.shadow('m') });
    front += peb.front;
    // the rain only shows in the daylight at the side
    S.weatherClip = S.clip('brurain', path(side, '#fff'));
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ BACK: the very back of the dark

  var B_MARKS = [[640, 1040], [720, 880], [880, 760], [1010, 690]];

  // where Sprinkle's hurt wing lies when she opens her wings (`wings`) at `dragon` on `back`: from her back to
  // its tip, above her tail (measured off the drawing: her figure spans x 808 to 1434; the drooping wing x 1040
  // to 1434, y 640 to 770)
  var WING_KEEP = { x: 1040, y: 630, w: 400, h: 150 };
  function drawBack(S) {
    var p = S.pal, o = S.opts, c = cols(S), back = '', front = '', r = rng(701), i, x, y;
    back += rect(-10, -10, 1620, 1020, S.linU([[0, c.dark1], [0.45, c.dark0], [1, mix(c.dark2, c.mudDk, 0.2)]], 0, 0, 0, 1000));
    // a cross beam further back, and the big beam overhead
    back += path(quad([[-10, 200], [1610, 176], [1610, 214], [-10, 236]]), c.dark1) + stroke(pts([[-10, 200], [1610, 176]]), c.dark3, 2.5, { opacity: 0.6 });
    // the heap of old stones at the back (some of them the bridge's own blocks, fallen long ago),
    // fading up into the dark, with a dry nook in the middle of it
    var NX = 1040, NY = 470, rows = [[250, 0.55, 36], [330, 0.65, 46], [410, 0.75, 56], [500, 0.85, 66], [590, 0.95, 76], [660, 1, 70]];
    var tones = [mix(c.dark0, c.dark1, 0.6), c.dark1, mix(c.dark1, c.dark2, 0.5), c.dark2, mix(c.dark2, c.dark3, 0.25), mix(c.dark2, c.dark3, 0.4)];
    for (var ri = 0; ri < rows.length; ri++) {
      var ry0 = rows[ri][0], k = rows[ri][1], sz = rows[ri][2], d = '', hi = '', warm = '', edge = { stroke: c.dark0, 'stroke-width': n(3 + k * 3), 'stroke-linejoin': 'round' };
      for (x = -40 + r() * 60; x < 1660; x += sz * (1.5 + r() * 0.9)) {
        y = ry0 + (r() - 0.5) * sz * 0.9;
        var rx = sz * (0.9 + r() * 0.7), ryy = sz * (0.55 + r() * 0.3);
        if (Math.pow((x - NX) / 290, 2) + Math.pow((y - NY) / 190, 2) < 0.75) continue;
        // each stone its own shape, so the ones in front hide the edges of the ones behind
        d += path(r() < 0.3 ? blob(x, y, rx, ryy, 6, r, 0.08, 0.12) : blob(x, y, rx, ryy, 9, r, 0.18, 0.3), tones[ri], edge);
        if (r() < 0.6) hi += 'M' + n(x - rx * 0.6) + ' ' + n(y - ryy * 0.7) + 'Q' + n(x - rx * 0.1) + ' ' + n(y - ryy * 1.02) + ' ' + n(x + rx * 0.45) + ' ' + n(y - ryy * 0.8);
        if (x < 640 && ri >= 3) warm += 'M' + n(x - rx * 0.85) + ' ' + n(y + ryy * 0.1) + 'Q' + n(x - rx * 0.9) + ' ' + n(y - ryy * 0.6) + ' ' + n(x - rx * 0.4) + ' ' + n(y - ryy * 0.9);
      }
      back += d + stroke(hi, c.dark4, 2 + k * 1.2, { opacity: 0.08 + k * 0.25 }) + (warm ? stroke(warm, c.warm, 2.5, { opacity: 0.3 }) : '');
      // the dark settles over each row higher up
      if (ri < 3) back += rect(-10, ry0 - 70, 1620, 140, S.linU([[0, c.dark0, 0.3 - ri * 0.08], [1, c.dark0, 0]], 0, ry0 - 70, 0, ry0 + 70));
    }
    // the nook: deepest at its heart, soft at its rim, ringed by an arch of stones
    back += ell(NX, NY, 320, 205, S.radU([[0, '#0E1424'], [0.7, c.dark0], [1, c.dark0, 0]], NX, NY, 320));
    var arch = '', archHi = '';
    for (i = 0; i < 10; i++) {
      var a = Math.PI * (1.0 + i * 0.111), ax = NX + Math.cos(a) * 310 + (r() - 0.5) * 20, ay = NY + 50 + Math.sin(a) * 230;
      arch += path(blob(ax, ay, 56 + r() * 20, 40 + r() * 12, 9, r, 0.15, 0.3), mix(c.dark1, c.dark2, 0.6), { stroke: c.dark0, 'stroke-width': 5, 'stroke-linejoin': 'round' });
      archHi += 'M' + n(ax - 36) + ' ' + n(ay - 30) + 'Q' + n(ax) + ' ' + n(ay - 48) + ' ' + n(ax + 32) + ' ' + n(ay - 32);
    }
    back += arch + stroke(archHi, c.dark4, 2.5, { opacity: 0.3 });
    // dry stuff in the nook's mouth: a few old leaves and twigs, as if something made a bed there
    back += path(leafD(930, 640, 26, -0.3, 8) + leafD(1120, 650, 22, 3.5, 7) + leafD(1010, 662, 20, 0.6, 6), mix(c.dark3, '#8A6A3E', 0.3), { opacity: 0.7 }) +
      stroke('M900 662l70 -10M1080 668l60 6', mix(c.dark3, '#6A5038', 0.3), 4, { opacity: 0.7 });
    // the dry floor, pale and dusty, the drag marks fading into the nook
    var fd = 'M-10 700Q300 660 600 690Q900 710 1200 676Q1420 656 1610 690V1010H-10Z';
    back += path(fd, S.linU([[0, mix(c.dark3, '#A09682', 0.2)], [1, mix(c.dark2, '#7E7464', 0.18)]], 0, 660, 0, 1000));
    var fl = '', dust = '', leaves = '';
    for (i = 0; i < 80; i++) { x = r() * 1600; y = 690 + Math.pow(r(), 1.2) * 310; dust += blob(x, y, 2 + (y - 680) * 0.02 + r() * 4, 1.5 + (y - 680) * 0.01, 6, r, 0.3, 0.3); }
    for (i = 0; i < 14; i++) leaves += leafD(r() * 1600, 720 + r() * 260, 16 + r() * 14, r() * 6.28, 6);
    fl += path(dust, mix(c.dark3, '#B0A690', 0.2), { opacity: 0.6 }) + path(leaves, mix(c.dark3, '#8A6A3E', 0.3), { opacity: 0.75 });
    if (o.drag !== false) fl += dragMarks(S, B_MARKS, 160, 46, { lip: mix(c.dark3, '#A09682', 0.2), bed: c.dark1, deep: c.dark0 });
    // chapter 3: Sprinkle's own prints beside them, big, five long claws each
    if (o.prints === true) fl += printsAlong(S, B_MARKS, 160, 46, { lip: mix(c.dark4, '#B7AC94', 0.35), deep: mix(c.dark0, '#0A0F1C', 0.3), fs: 0.55, size: 1.05, gap: 0.5, step: 0.14, t0: 0.12, t1: 0.92 });
    fl += path(fd, S.linU([[0, c.dark0, 0.55], [0.5, c.dark0, 0.2], [1, c.dark0, 0]], 0, 680, 0, 1000));
    back += g(fl, { 'clip-path': S.clip('brbfloor', path(fd, '#fff')) });
    // chapter 6: the bridge's stone leg beside the nook, big old fitted stones, Coil's gap low in it
    if (o.stones === true) back += backLeg(S, c);
    // chapter 7, `wing: true`: Sprinkle's drooping wing (her right, at `dragon`, held out low toward
    // `back-right`) is what the panel is about, so the lettering keeps off it; nothing is drawn
    if (o.wing === true) (S.keep = S.keep || []).push({ x: WING_KEEP.x, y: WING_KEEP.y, w: WING_KEEP.w, h: WING_KEEP.h });
    // the beam overhead, warm daylight along its lower edge from the way she came in
    back += path(quad([[-10, -10], [1610, -10], [1610, 86], [-10, 122]]), S.linU([[0, c.dark2], [1, c.dark1]], 0, 0, 0, 122));
    back += path(quad([[-10, 104], [1610, 72], [1610, 92], [-10, 128]]), c.dark2);
    var riv = '';
    for (x = 20; x < 1610; x += 44) riv += dot(x, 40 - x * 0.012, 4.5) + dot(x, 98 - x * 0.02, 4);
    back += path(riv, c.dark3) + stroke(pts([[-10, 128], [1610, 92]]), S.linU([[0, c.warm, 0.7], [0.5, c.warm, 0.15], [1, c.warm, 0]], 0, 0, 1600, 0), 4);
    // daylight from behind, warming the near edge of things
    back += rect(-10, 500, 900, 520, S.radU([[0, c.warm, 0.3], [0.55, c.warm, 0.08], [1, c.warm, 0]], -60, 1080, 760));
    var ev = evening(S);
    if (ev) {
      // evening: the low sun reaches right in from the way she came, long bands across the floor and
      // light on the stones' faces (gold at sunset; a softer rose at dusk, so the dark still reads)
      var ec = eveCol(S, ev), eo = ev === 'gold' ? 1 : 0.6, bands = '';
      var wash = ev === 'gold' ? 0.2 : 0.08;
      back += rect(-10, 120, 1620, 900, S.linU([[0, ec, wash], [0.45, ec, wash * 0.3], [1, ec, 0]], 0, 0, 1500, 0), { style: 'mix-blend-mode:screen' });
      [[952, 1010], [838, 880], [752, 776]].forEach(function (b) { bands += pts([[-10, b[0]], [1610, b[0] - 30], [1610, b[1] - 22], [-10, b[1]]]) + 'Z'; });
      back += g(path(bands, S.linU([[0, ec, 0.46 * eo], [0.6, ec, 0.2 * eo], [1, ec, 0.03]], 0, 0, 1500, 0)), { 'clip-path': S.clip('brbfloor', path(fd, '#fff')), style: 'mix-blend-mode:screen' });
      back += stroke(pts([[-10, 128], [1610, 92]]), ec, 5, { opacity: 0.45 * eo });
    }
    // chapter 5: the little forepaws she has drawn in the mud, in front of her spot
    back += mudPaws(S, c, o.mudPaws);
    // the eyes (or only the dark), with their shine in a little puddle below
    if (o.eyes === 'open' || o.eyes === 'blink') {
      back += eyePair(S, c, 1040, 446, 44, 176, o.eyes);
      back += puddle(S, 1030, 772, 120, 16, 702, mix(c.dark0, '#0A1020', 0.4), c.dark3);
      back += ell(964, 772, 6, 2.5, '#FFD98A', { opacity: o.eyes === 'blink' ? 0.35 : 0.7 }) + ell(1104, 772, 6, 2.5, '#FFD98A', { opacity: o.eyes === 'blink' ? 0.35 : 0.7 });
      (S.keep = S.keep || []).push({ x: 840, y: 370, w: 400, h: 150 });
    } else if (o.eyes === 'sprinkle') {
      // chapter 3: her own two eyes, open in the dark exactly where her face is in the next panel
      // (sitting up at `dragon`, unfolding): their size, their spacing, their place
      back += eyePair(S, c, 907, 467, 26, 72, 'open');
      back += puddle(S, 920, 772, 110, 15, 702, mix(c.dark0, '#0A1020', 0.4), c.dark3);
      back += ell(871, 772, 5, 2.2, '#FFD98A', { opacity: 0.7 }) + ell(943, 772, 5, 2.2, '#FFD98A', { opacity: 0.7 });
      (S.keep = S.keep || []).push({ x: 830, y: 425, w: 155, h: 85 });
    } else {
      back += puddle(S, 1030, 772, 120, 16, 702, mix(c.dark0, '#0A1020', 0.4), c.dark3);
    }
    if (o.drips !== false) back += drip(S, 560, 118, 750, 5.2, 0.4, c.drop, c.dark4) + drip(S, 1030, 92, 664, 4.6, 1.3, c.drop, c.dark4) + drip(S, 1440, 82, 640, 5, 0.9, c.drop, c.dark4);
    if (o.train) back += grit(S, 100, 1500, 110, 600, 22, 703, mix(c.dark4, '#FFFFFF', 0.2));
    // a low ridge of mud and stone right in front, over the paws of a cat looking in
    // chapter 3: the fallen branch dragged across the back, in front of Sprinkle's spot (drawn just after
    // whoever is at `dragon`, so she can peek over it and the others stand in front)
    // A heap, not one limb: three limbs piled across her, so the sticks mass from the floor up to her
    // shoulders and only her head, from the eyes up, rises over them (the text: "Now it looks like a
    // heap of old sticks"); the thickest lies in front, the others behind it, higher
    // (her face, peering over at `dragon`, stays clear of the forks: BRANCH_FACE)
    if (o.branch === true) S.covers.dragon = g(fallenBranch(S, c, 880, 866, 1480, 700, 0.85, 743, 0.36, 1, BRANCH_FACE) + fallenBranch(S, c, 760, 884, 1500, 760, 0.9, 742, 0.33, 1, BRANCH_FACE) +
      fallenBranch(S, c, 600, 872, 1490, 726, 1, 741, 0.3, 2, BRANCH_FACE), { 'data-art': 'branch', filter: S.shadow('m') });
    S.covers.near = g(path(mound(-80, 820, 1012, 950, 10, rng(704), 0.3, 0.3, 0.35), mix(c.dark2, c.mudDk, 0.25)) +
      stroke('M-10 966Q200 946 420 950Q640 954 800 990', c.warm, 4, { opacity: 0.45 }), { filter: S.shadow('m') });
    front += g(path(blob(1560, 1010, 180, 54, 10, rng(705), 0.25, 0.3), mix(c.dark1, c.mudDk, 0.3)), { filter: S.shadow('m') });
    S.weatherClip = S.clip('brbrain', rect(0, 0, 0, 0, '#fff'));
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ chapter 6: the stone leg and Coil's gap

  // The bridge's stone leg, as Coil knows it: big old fitted stones. Courses of uneven height, each
  // of blocks of uneven width, their corners worn, laid with a dark joint between them; each block's
  // top edge catches what light there is, a few are cracked, a little moss grows in the lowest joints,
  // and the dark settles over the leg higher up. Q: the face [top-left, top-right, bottom-right,
  // bottom-left]; o: rows, per (blocks to a course, about), seed, k (line weight), gap: { x, w } (px):
  // the one block of the bottom course that is long gone, left open for Coil's gap. Returns { svg, gap:
  // { x0, x1, top, foot } } (the opening, in the world).
  function oldStones(S, c, Q, o) {
    var p = S.pal, r = rng(o.seed), k = o.k || 1, rows = o.rows || 6, per = o.per || 4, i;
    var W = Math.abs(Q[1][0] - Q[0][0]), H = Math.abs(Q[3][1] - Q[0][1]), ju = 7 * k / W, jv = 7 * k / H;
    var hs = [], tot = 0;
    for (i = 0; i < rows; i++) { hs.push(0.82 + r() * 0.4); tot += hs[i]; }
    var g0 = null, g1 = null, gapOut = null;
    if (o.gap) { g0 = (o.gap.x - o.gap.w / 2 - Q[3][0]) / (Q[2][0] - Q[3][0]); g1 = (o.gap.x + o.gap.w / 2 - Q[3][0]) / (Q[2][0] - Q[3][0]); }
    var fills = ['', '', ''], hi = '', lo = '', cracks = '', moss = '', v = 0;
    function block(a0, a1, v0, v1) {
      var cu = Math.min((a1 - a0) * 0.16, (0.05 + r() * 0.07) * (H / W)), cv = (v1 - v0) * (0.12 + r() * 0.14);
      var P = [[a0 + cu, v0], [a1 - cu * (0.5 + r()), v0], [a1, v0 + cv], [a1, v1 - cv * (0.5 + r() * 0.8)], [a1 - cu, v1], [a0 + cu * (0.4 + r()), v1], [a0, v1 - cv], [a0, v0 + cv * (0.6 + r() * 0.8)]]
        .map(function (q) { var m = inQuad(Q, q[0], q[1]); return [m[0] + (r() - 0.5) * 4 * k, m[1] + (r() - 0.5) * 4 * k]; });
      fills[Math.floor(r() * 3)] += pts(P) + 'Z';
      hi += pts([P[7], P[0], P[1], P[2]]);
      lo += pts([P[3], P[4], P[5]]);
      if (r() < 0.2) {
        var cx = lerp(P[0][0], P[1][0], 0.3 + r() * 0.4), cy = P[0][1], L = (P[5][1] - P[0][1]) * (0.35 + r() * 0.3);
        cracks += 'M' + n(cx) + ' ' + n(cy) + 'l' + n((r() - 0.5) * 14 * k) + ' ' + n(L * 0.4) + 'l' + n((r() - 0.5) * 18 * k) + ' ' + n(L * 0.35) + 'l' + n((r() - 0.5) * 10 * k) + ' ' + n(L * 0.25);
      }
      return P;
    }
    for (var row = 0; row < rows; row++) {
      var v0 = v + jv / 2, v1 = v + hs[row] / tot - jv / 2, last = row === rows - 1, u = -r() * 0.7 / per;
      v += hs[row] / tot;
      if (last) v1 = 1;
      while (u < 1) {
        var w = (0.6 + r() * 0.8) / per, a0 = Math.max(0, u) + ju / 2, a1 = Math.min(1, u + w) - ju / 2;
        if (last && g0 != null && a1 > g0 - ju && a0 < g1 + ju) {
          // the block that is gone: a joint each side of the gap, the gap itself open
          if (g0 - ju / 2 - a0 > 0.2 / per) block(a0, g0 - ju / 2, v0, v1);
          u = g1 + ju / 2;
          var tl = inQuad(Q, g0, v0 - jv / 2), tr = inQuad(Q, g1, v0 - jv / 2), bl = inQuad(Q, g0, 1), br = inQuad(Q, g1, 1);
          gapOut = { x0: tl[0], x1: tr[0], top: Math.max(tl[1], tr[1]) + 2 * k, foot: (bl[1] + br[1]) / 2 };
          g0 = null;
          continue;
        }
        if (a1 - a0 > 0.12 / per) {
          var P = block(a0, a1, v0, v1);
          if (row >= rows - 2 && r() < 0.3) moss += blob(lerp(P[5][0], P[4][0], 0.3 + r() * 0.4), P[4][1] + 3 * k, (10 + r() * 10) * k, 5 * k, 7, r, 0.3, 0.3);
        }
        u += w;
      }
    }
    var col = mix(c.dark2, c.dark3, 0.38), lw = 3 * k;
    var svg = path(quad(Q), mix(c.dark0, '#090D18', 0.4)) + path(fills[0], col) + path(fills[1], mix(col, c.dark1, 0.32)) + path(fills[2], mix(col, c.dark4, 0.22)) +
      stroke(lo, c.dark0, lw * 1.5, { opacity: 0.5 }) + stroke(hi, c.dark4, lw, { opacity: 0.42 }) + stroke(cracks, c.dark0, lw * 0.9, { opacity: 0.7 }) +
      (moss ? path(moss, mix(p.moss, c.dark2, 0.55), { opacity: 0.8 }) : '') +
      path(quad(Q), S.linU([[0, c.dark0, 0.62], [0.5, c.dark0, 0.22], [1, c.dark0, 0]], 0, Math.min(Q[0][1], Q[1][1]), 0, Math.max(Q[2][1], Q[3][1])));
    return { svg: svg, gap: gapOut };
  }
  // Coil's door: the block that is gone from the bottom course, a dark gap whose mouth is on the floor:
  // G { x0, x1, top, foot }. Darkest at its heart, the block over it shadowing its top, its edges worn
  // and broken, a few chips of old stone fallen at its foot. In `keep`, with room over it for his head.
  function stoneGap(S, c, G, seed) {
    var r = rng(seed), x0 = G.x0, x1 = G.x1, w = x1 - x0, h = G.foot - G.top, x = (x0 + x1) / 2, foot = G.foot;
    var d = 'M' + n(x0 + w * 0.02) + ' ' + n(foot) + 'L' + n(x0 + w * 0.04) + ' ' + n(G.top + h * 0.34) + 'L' + n(x0 + w * 0.01) + ' ' + n(G.top + h * 0.18) + 'L' + n(x0 + w * 0.1) + ' ' + n(G.top + h * 0.02) +
      'L' + n(x0 + w * 0.42) + ' ' + n(G.top + h * 0.06) + 'L' + n(x0 + w * 0.5) + ' ' + n(G.top) + 'L' + n(x1 - w * 0.12) + ' ' + n(G.top + h * 0.03) + 'L' + n(x1 - w * 0.01) + ' ' + n(G.top + h * 0.2) +
      'L' + n(x1 - w * 0.05) + ' ' + n(G.top + h * 0.5) + 'L' + n(x1 - w * 0.02) + ' ' + n(foot) + 'Z';
    var s = path(d, S.radU([[0, '#05080F'], [0.55, mix(c.dark0, '#05080F', 0.6)], [1, c.dark0]], x, foot - h * 0.25, w * 0.66));
    // the block over it shadows its top; the worn edge on the side the light comes from
    s += path(d, S.linU([[0, '#03050B', 0.75], [0.35, '#03050B', 0]], 0, G.top, 0, foot));
    s += stroke('M' + n(x0 + w * 0.02) + ' ' + n(foot) + 'L' + n(x0 + w * 0.04) + ' ' + n(G.top + h * 0.34) + 'L' + n(x0 + w * 0.01) + ' ' + n(G.top + h * 0.18), c.dark4, Math.max(1.5, h * 0.025), { opacity: 0.35 });
    // its dark spilling a little onto the floor, and chips of stone at its foot
    s += ell(x, foot + h * 0.03, w * 0.58, h * 0.08, '#05080F', { opacity: 0.4 });
    var chips = '';
    [[-0.62, 0.05, 0.06], [0.58, 0.07, 0.05], [0.7, 0.01, 0.035], [-0.48, 0.1, 0.035]].forEach(function (q) {
      chips += blob(x + q[0] * w, foot + q[1] * h, w * q[2], w * q[2] * 0.6, 7, r, 0.25, 0.3);
    });
    s += path(chips, mix(c.dark2, c.dark3, 0.5), { stroke: c.dark0, 'stroke-width': n(Math.max(1.5, h * 0.025)), 'stroke-linejoin': 'round' });
    (S.keep = S.keep || []).push({ x: x0 - w * 0.06, y: G.top - h * 0.5, w: w * 1.12, h: h * 1.62 });
    return g(s, { 'data-art': 'gap', 'data-x0': n(x0), 'data-x1': n(x1), 'data-top': n(G.top), 'data-foot': n(foot) });
  }
  // The floor line of a face Q at x (its foot).
  function footOf(Q, x) { return lerp(Q[3][1], Q[2][1], (x - Q[3][0]) / (Q[2][0] - Q[3][0])); }

  // `stones: true` on `back`: the leg stands on the dry floor at the left, beside the nook, over the
  // left of the heap; its far side recedes toward the nook. The gap is low in its bottom course near
  // the panel's left edge, so Coil at `gap` (facing right, his body trailing back along the wall's
  // foot) lies between the panel's edge and every spot: clear of `near`, of `back-left` and of
  // Sprinkle's nook.
  var B_LEG = { face: [[-10, 96], [598, 104], [604, 752], [-10, 760]], side: [[598, 104], [660, 128], [664, 712], [604, 752]], gap: { x: 100, w: 124 }, rows: 6, per: 3.2, seed: 762 };
  function backLeg(S, c) {
    var L = B_LEG, s = '';
    s += path(quad(L.side), S.linU([[0, c.dark0], [1, mix(c.dark1, c.dark2, 0.3)]], 0, 120, 0, 740));
    s += oldStones(S, c, L.side, { rows: L.rows, per: 1, seed: 761 }).svg;
    var face = oldStones(S, c, L.face, { rows: L.rows, per: L.per, seed: L.seed, gap: L.gap });
    s += face.svg;
    // its foot on the dry floor: a soft dark line where stone meets dust
    s += stroke('M-10 758L604 750L664 712', '#070B16', 10, { opacity: 0.5 }) + stroke('M-10 764L604 756', mix(c.dark3, '#A09682', 0.2), 3, { opacity: 0.35 });
    if (face.gap) s += stoneGap(S, c, face.gap, 763);
    return g(s, { 'data-art': 'leg' });
  }

  // ------------------------------------------------------------------ chapter 6: WALL, Coil's close beats

  // Its own composition, at cat height under the bridge: the stone leg across the middle distance,
  // its far end at the right where the dark of the back goes on; Coil's gap low in it a little under a
  // third of the way across; the dry floor in front. The overhead beam at the top. Our cat and Riffle
  // sit near, Sprinkle's head and neck come in at the right edge; nobody's spot covers the gap.
  var W_LEG = { face: [[-10, 84], [1232, 92], [1236, 704], [-10, 712]], side: [[1232, 92], [1312, 124], [1314, 668], [1236, 704]], gap: { x: 420, w: 156 }, rows: 6, per: 5, seed: 1612 };
  var W_FLOOR = 'M-10 708L1236 702L1314 666Q1460 652 1610 664V1010H-10Z';
  function drawWall(S) {
    var p = S.pal, o = S.opts, c = cols(S), back = '', front = '', r = rng(1601), i, x, y;
    back += rect(-10, -10, 1620, 1020, S.linU([[0, c.dark1], [0.5, c.dark0], [1, mix(c.dark2, c.mudDk, 0.2)]], 0, 0, 0, 1000));
    // beyond the leg's far end, the very back: the heap of old stones fading into the dark
    var heap = '';
    for (i = 0; i < 9; i++) { x = 1300 + i * 46 + r() * 20; y = 520 + Math.sin(i * 2.3) * 60 + r() * 40; heap += blob(x, y, 40 + r() * 20, 26 + r() * 10, 9, r, 0.18, 0.3); }
    for (i = 0; i < 7; i++) { x = 1320 + i * 52 + r() * 16; y = 620 + r() * 24; heap += blob(x, y, 46 + r() * 16, 28 + r() * 8, 9, r, 0.18, 0.3); }
    back += path(heap, mix(c.dark0, c.dark1, 0.6), { stroke: c.dark0, 'stroke-width': 4, 'stroke-linejoin': 'round' });
    back += rect(1260, 300, 360, 420, S.radU([[0, '#0A1020', 0.7], [1, '#0A1020', 0]], 1460, 520, 300));
    // the dry floor, pale and dusty, darker toward the back
    back += path(W_FLOOR, S.linU([[0, mix(c.dark3, '#A09682', 0.22)], [1, mix(c.dark2, '#7E7464', 0.2)]], 0, 660, 0, 1000));
    var dust = '', leaves = '', st = '', sth = '';
    for (i = 0; i < 90; i++) { x = r() * 1600; y = 712 + Math.pow(r(), 1.1) * 290; dust += blob(x, y, 2 + (y - 700) * 0.024 + r() * 4, 1.5 + (y - 700) * 0.012, 6, r, 0.3, 0.3); }
    for (i = 0; i < 16; i++) leaves += leafD(r() * 1600, 730 + r() * 260, 16 + r() * 16, r() * 6.28, 6);
    [[160, 960, 44], [1500, 930, 38], [980, 748, 22], [70, 760, 26]].forEach(function (q) {
      st += blob(q[0], q[1], q[2], q[2] * 0.62, 9, r, 0.2, 0.3);
      sth += 'M' + n(q[0] - q[2] * 0.6) + ' ' + n(q[1] - q[2] * 0.42) + 'q' + n(q[2] * 0.6) + ' ' + n(-q[2] * 0.26) + ' ' + n(q[2] * 1.2) + ' 0';
    });
    var fl = path(dust, mix(c.dark3, '#B0A690', 0.2), { opacity: 0.6 }) + path(leaves, mix(c.dark3, '#8A6A3E', 0.3), { opacity: 0.75 }) +
      path(st, mix(c.dark1, c.dark2, 0.5), { stroke: c.dark0, 'stroke-width': 4, 'stroke-linejoin': 'round' }) + stroke(sth, c.dark4, 2.5, { opacity: 0.4 });
    fl += path(W_FLOOR, S.linU([[0, c.dark0, 0.5], [0.4, c.dark0, 0.15], [1, c.dark0, 0]], 0, 680, 0, 1000));
    back += g(fl, { 'clip-path': S.clip('brwfloor', path(W_FLOOR, '#fff')) });
    // the leg: its far side receding into the dark, its face of big fitted stones, its foot on the floor
    var L = W_LEG, face = oldStones(S, c, L.face, { rows: L.rows, per: L.per, seed: L.seed, k: 1.15, gap: L.gap });
    back += path(quad(L.side), S.linU([[0, c.dark0], [1, mix(c.dark1, c.dark2, 0.3)]], 0, 120, 0, 700));
    back += oldStones(S, c, L.side, { rows: L.rows, per: 1, seed: 1611, k: 1.15 }).svg;
    back += g(face.svg, { 'data-art': 'leg' });
    back += stroke('M-10 710L1236 703L1314 667', '#070B16', 12, { opacity: 0.5 }) + stroke('M-10 717L1236 709', mix(c.dark3, '#A09682', 0.2), 3, { opacity: 0.35 });
    if (face.gap) back += stoneGap(S, c, face.gap, 1613);
    // the beam overhead, warm daylight along its lower edge from the way in, behind us at the left
    back += path(quad([[-10, -10], [1610, -10], [1610, 62], [-10, 92]]), S.linU([[0, c.dark2], [1, c.dark1]], 0, 0, 0, 92));
    back += path(quad([[-10, 78], [1610, 50], [1610, 66], [-10, 96]]), c.dark2);
    var riv = '';
    for (x = 20; x < 1610; x += 44) riv += dot(x, 28 - x * 0.012, 4.5) + dot(x, 72 - x * 0.018, 4);
    back += path(riv, c.dark3) + stroke(pts([[-10, 96], [1610, 66]]), S.linU([[0, c.warm, 0.7], [0.5, c.warm, 0.15], [1, c.warm, 0]], 0, 0, 1600, 0), 4);
    // daylight from the way in, warming the near floor and the leg's low left
    back += rect(-10, 380, 1100, 640, S.radU([[0, c.warm, 0.3], [0.55, c.warm, 0.08], [1, c.warm, 0]], -80, 1060, 900));
    var ev = evening(S);
    if (ev) {
      var ec = eveCol(S, ev), eo = ev === 'gold' ? 1 : 0.6, bands = '', wash = ev === 'gold' ? 0.2 : 0.08;
      back += rect(-10, 90, 1620, 930, S.linU([[0, ec, wash], [0.45, ec, wash * 0.3], [1, ec, 0]], 0, 0, 1500, 0), { style: 'mix-blend-mode:screen' });
      [[948, 1010], [836, 876], [752, 774]].forEach(function (b) { bands += pts([[-10, b[0]], [1610, b[0] - 30], [1610, b[1] - 22], [-10, b[1]]]) + 'Z'; });
      back += g(path(bands, S.linU([[0, ec, 0.46 * eo], [0.6, ec, 0.2 * eo], [1, ec, 0.03]], 0, 0, 1500, 0)), { 'clip-path': S.clip('brwfloor', path(W_FLOOR, '#fff')), style: 'mix-blend-mode:screen' });
      back += stroke(pts([[-10, 96], [1610, 66]]), ec, 5, { opacity: 0.45 * eo });
    }
    if (o.drips !== false) back += drip(S, 300, 96, 680, 5, 0.6, c.drop, c.dark4) + drip(S, 1080, 80, 640, 4.6, 1.5, c.drop, c.dark4);
    // a train overhead: grit shaken down in front of the wall
    if (o.train) back += grit(S, 60, 1540, 90, 580, 26, 1614, mix(c.dark4, '#FFFFFF', 0.2));
    // dark clods in the near corners
    front += g(path(blob(-20, 1010, 200, 56, 10, rng(1615), 0.25, 0.3) + blob(1620, 1012, 150, 44, 9, rng(1616), 0.25, 0.3), mix(c.dark1, c.mudDk, 0.3)), { filter: S.shadow('m') });
    S.weatherClip = S.clip('brwrain', rect(0, 0, 0, 0, '#fff'));
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ chapter 5: the forepaws in the mud

  // `mudPaws`: little forepaws drawn in the mud with one long claw (as chapter 3's Counts picture drew
  // six, `kind: 'mud'`, and the roof's grit has seven): a palm and five claw marks each, on the floor
  // of the `back` composition in front of Sprinkle's spot, clear of the drag marks, of her own big
  // prints beside them and of everyone's feet. Seven places, four above three, the way the mud count's
  // picture lays seven; the first (top left, nearest her claw) is her own, drawn last: with 6 it is
  // still bare mud. MUD_PAWS: [cx, cy, k, squash (the floor seen from cat height)].
  var MUD_PAWS = [1120, 934, 0.72, 0.5], MUD_GAP = 118, MUD_ROWS = [-50, 50];
  function mudPawCount(v) { var k = v === true ? 7 : Math.round(+v); return isFinite(k) ? clamp(k, 0, 7) : 0; }
  function mudPaws(S, c, v) {
    var count = mudPawCount(v);
    if (!count) return '';
    var G = MUD_PAWS, cx = G[0], cy = G[1], k = G[2], sq = G[3], r = rng(9500), all = '', tagged = '';
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    function W(px, py) {
      var q = [cx + px * k, cy + py * k * sq];
      x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
      return q;
    }
    function d2(list) { return pts(list.map(function (q) { return W(q[0], q[1]); })); }
    for (var i = 0; i < 7; i++) {
      var row = i < 4 ? 0 : 1, col = row ? i - 4 : i, cnt = row ? 3 : 4;
      var ox = (col - (cnt - 1) / 2) * MUD_GAP + (r() - 0.5) * 8, oy = MUD_ROWS[row] + (r() - 0.5) * 6, tilt = (r() - 0.5) * 0.22, claws = '', pawD = '', wob = [r(), r(), r(), r(), r()];
      // (every place draws its numbers, so the six are the same six with or without the seventh)
      if (i < 7 - count) continue;
      var rot = function (px, py) { return [ox + px * Math.cos(tilt) - py * Math.sin(tilt), oy + px * Math.sin(tilt) + py * Math.cos(tilt)]; };
      var palm = [];
      for (var a = 0; a < 16; a++) { var t = Math.PI * 2 * a / 16; palm.push(rot(Math.cos(t) * 27, 6 + Math.sin(t) * 22)); }
      var pd = d2(palm) + 'Z';
      pawD += pd;
      for (var j = 0; j < 5; j++) {
        var an = (-146 + 112 * j / 4) * Math.PI / 180, cd = d2([rot(Math.cos(an) * 36, 2 + Math.sin(an) * 34), rot(Math.cos(an) * 60 + (wob[j] - 0.5) * 3, 2 + Math.sin(an) * 58)]);
        pawD += cd;
        claws += '<path d="' + cd + '" data-claw="mud"/>';
      }
      all += pawD;
      tagged += '<g data-paw="mud"' + (i === 0 ? ' data-own="sprinkle"' : '') + '><path d="' + pd + '"/>' + claws + '</g>';
    }
    var lw = Math.max(2.2, 6.4 * k * Math.sqrt(sq + 0.2));
    // the mud she smoothed to draw on, a little paler and wetter than the floor; then each line a dark
    // groove in it, its far lip catching what light there is
    var mcx = (x0 + x1) / 2, mcy = (y0 + y1) / 2, mud = mix(c.dark3, '#96836A', 0.4);
    var s = path(blob(mcx, mcy + 2, (x1 - x0) / 2 + 36, (y1 - y0) / 2 + 17, 16, rng(9501), 0.16, 0.2), mix(c.dark1, c.mudDk, 0.3), { opacity: 0.5, transform: 'translate(0 4)' }) +
      path(blob(mcx, mcy, (x1 - x0) / 2 + 34, (y1 - y0) / 2 + 15, 16, rng(9501), 0.16, 0.2), mud, { opacity: 0.62 }) +
      stroke('M' + n(mcx - (x1 - x0) * 0.36) + ' ' + n(y0 - 7) + 'q' + n((x1 - x0) * 0.18) + ' -5 ' + n((x1 - x0) * 0.4) + ' -1', mix(c.dark4, '#D9CFB8', 0.4), 2.5, { opacity: 0.4 }) +
      stroke(all, mix(c.dark4, '#D9CFB8', 0.5), lw * 0.5, { opacity: 0.85, transform: 'translate(' + n(lw * 0.3) + ' ' + n(lw * 0.36) + ')' }) +
      g(tagged, { fill: 'none', stroke: mix(c.dark0, '#0A0F1C', 0.45), 'stroke-width': n(lw), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    (S.keep = S.keep || []).push({ x: x0 - lw * 2, y: y0 - lw * 2, w: x1 - x0 + lw * 4, h: y1 - y0 + lw * 4 });
    return g(s, { 'data-art': 'mud-paws', 'data-count': count });
  }

  // ------------------------------------------------------------------ chapter 3: the pebble, the prints, the branch, evening light

  // Riffle's fifth juggling pebble: plain, round and brown. The text keeps its three stones apart:
  // this one, Riffle's stone (nearly black, its white band) and Sprinkle's egg-smooth grey pebble.
  var PEBBLE = { fill: '#93704F', dark: '#5D4331', light: '#C8A27D' };
  var CAT_WHO = { player: 1, tallyheart: 1, glintstar: 1, waffles: 1, grizzled: 1, snorer: 1, mutterer: 1, snorter: 1, clancat: 1 };

  // Where a cast member stands here: its anchor, or its own spot { x, y } (its height, unless given,
  // from the nearest ground anchor). Null when it is out of this camera's sight.
  function spotOf(S, m) {
    var map = S.anchorMap || {}, at = m && m.at;
    if (typeof at === 'string') return map[at] || null;
    if (at && typeof at === 'object' && isFinite(+at.x) && isFinite(+at.y)) {
      var best = null;
      for (var k in map) if (!map[k].elev && (!best || Math.abs(map[k].y - at.y) < Math.abs(best.y - at.y))) best = map[k];
      return { x: +at.x, y: +at.y, h: at.h > 0 ? +at.h : best ? best.h : 260, face: at.facing || 'right', elev: !!at.elev };
    }
    return null;
  }
  // The spot just in front of her forepaws (the player's, else the first cat's on the ground), on the
  // ground a touch nearer than her feet: { x, y, h }. Without one, the camera's own spot fb [x, y, h].
  function pawsSpot(S, fb) {
    var cast = S.cast || [], m = null, a = null, i;
    function pick(ok) {
      for (i = 0; i < cast.length && !m; i++) {
        var s = cast[i] && ok(cast[i]) ? spotOf(S, cast[i]) : null;
        if (s && !s.elev) { m = cast[i]; a = s; }
      }
    }
    pick(function (x) { return x.who === 'player'; });
    pick(function (x) { return CAT_WHO[x.who]; });
    if (!m) return { x: fb[0], y: fb[1], h: fb[2] };
    var h = a.h * (m.size > 0 ? +m.size : 1), dir = (m.facing || a.face || 'right') === 'left' ? -1 : 1;
    return { x: a.x + dir * h * 0.36, y: a.y + h * 0.025, h: h };
  }
  // The pebble resting on the ground at (x, y), radius r; `dim` (0..1) sinks it into the dark;
  // `roll` adds a curl of spin on it.
  function pebbleSvg(S, c, x, y, r, dim, roll) {
    var f = mix(PEBBLE.fill, c.dark2, dim), dk = mix(PEBBLE.dark, c.dark0, dim), lt = mix(PEBBLE.light, c.dark3, dim * 0.8), cy = y - r * 0.9;
    var s = ell(x, y - r * 0.05, r * 1.18, r * 0.26, S.pal.shade, { opacity: n(0.42 - dim * 0.2) });
    s += ell(x, cy, r, r * 0.92, f, { stroke: dk, 'stroke-width': n(Math.max(1.4, r * 0.12)) });
    s += path('M' + n(x - r * 0.9) + ' ' + n(cy + r * 0.18) + 'Q' + n(x) + ' ' + n(cy + r * 1.2) + ' ' + n(x + r * 0.9) + ' ' + n(cy + r * 0.18) +
      'Q' + n(x) + ' ' + n(cy + r * 0.62) + ' ' + n(x - r * 0.9) + ' ' + n(cy + r * 0.18) + 'Z', dk, { opacity: 0.35 });
    s += ell(x - r * 0.34, cy - r * 0.34, r * 0.34, r * 0.2, lt, { opacity: 0.85, transform: 'rotate(-28 ' + n(x - r * 0.34) + ' ' + n(cy - r * 0.34) + ')' });
    if (roll) s += stroke('M' + n(x + r * 0.15) + ' ' + n(cy - r * 0.62) + 'A' + n(r * 0.62) + ' ' + n(r * 0.62) + ' 0 0 1 ' + n(x + r * 0.5) + ' ' + n(cy + r * 0.36), dk, Math.max(1.2, r * 0.11), { opacity: 0.6 });
    return s;
  }
  // `pebble`: 'in' lies in the dark at `dark` [x, y, h] with a faint glint; 'out' rolls out toward her
  // paws, two little hops behind it (the text's plink… plink…); 'paws' rests just in front of her
  // forepaws (fb [x, y, h] when no cat is there). Returns { back, front }; the pebble goes in keep.
  function pebbleProp(S, c, mode, dark, fb) {
    var out = { back: '', front: '' }, x, y, r, s;
    if (mode !== 'in' && mode !== 'out' && mode !== 'paws') return out;
    S.keep = S.keep || [];
    if (mode === 'in') {
      r = dark[2] * 0.06;
      out.back = g(pebbleSvg(S, c, dark[0], dark[1], r, 0.5, false) + path(K.dot(dark[0] - r * 0.32, dark[1] - r * 1.24, Math.max(1.5, r * 0.15)), '#FFF4DA', { opacity: 0.7, 'class': 'pcs-glint' }), { 'data-art': 'pebble' });
      S.keep.push({ x: dark[0] - r * 2, y: dark[1] - r * 2.4, w: r * 4, h: r * 3 });
      return out;
    }
    var at = pawsSpot(S, fb);
    if (mode === 'paws') {
      r = at.h * 0.06;
      out.front = g(pebbleSvg(S, c, at.x, at.y, r, 0, false), { 'data-art': 'pebble' });
      S.keep.push({ x: at.x - r * 1.6, y: at.y - r * 2.2, w: r * 3.2, h: r * 2.6 });
      return out;
    }
    // 'out': most of the way from the dark to her paws, sinking less into the dark as it comes
    var k = 0.6, h = lerp(dark[2], at.h, k);
    x = lerp(dark[0], at.x, k); y = lerp(dark[1], at.y, k); r = h * 0.06;
    var mx = lerp(dark[0], x, 0.5), my = lerp(dark[1], y, 0.5), hop = 'M' + n(dark[0]) + ' ' + n(dark[1] - r) +
      'Q' + n(lerp(dark[0], mx, 0.5)) + ' ' + n(Math.min(dark[1], my) - h * 0.2) + ' ' + n(mx) + ' ' + n(my - r) +
      'Q' + n(lerp(mx, x, 0.4)) + ' ' + n(Math.min(my, y) - h * 0.11) + ' ' + n(x - (x - mx) * 0.18) + ' ' + n(y - r * 1.4);
    s = stroke(hop, mix(c.drop, '#FFFFFF', 0.4), Math.max(2, r * 0.18), { opacity: 0.75, 'stroke-dasharray': n(r * 0.7) + ' ' + n(r * 0.55) });
    s += stroke('M' + n(mx - r * 0.9) + ' ' + n(my + r * 0.1) + 'q' + n(r * 0.9) + ' ' + n(-r * 0.5) + ' ' + n(r * 1.8) + ' 0', mix(c.drop, '#FFFFFF', 0.4), Math.max(1.5, r * 0.14), { opacity: 0.6 });
    out.front = g(s + pebbleSvg(S, c, x, y, r, 0.15, true), { 'data-art': 'pebble' });
    S.keep.push({ x: x - r * 1.6, y: y - r * 2.2, w: r * 3.2, h: r * 2.6 });
    return out;
  }

  // One of Sprinkle's forepaw prints pressed into the ground at (x, y), L long, its toes pointing along
  // the screen direction (tx, ty), foreshortened by fs (the ground seen from cat height): a broad
  // pad, five long toe dents fanned like a hand, and a claw slash beyond each, a little apart, so the
  // five claws can be counted. { pad, claws } paths.
  var PRINT_FAN = [-0.82, -0.41, 0, 0.41, 0.82];
  function printD(x, y, L, tx, ty, fs) {
    var gx = tx, gy = ty / fs, gl = Math.sqrt(gx * gx + gy * gy) || 1, i, k;
    gx /= gl; gy /= gl;
    function P(u, v) { return [x + (gx * u - gy * v) * L, y + (gy * u + gx * v) * L * fs]; }
    // a dent along the angle f: its middle at distance c, ru long, rv wide
    function dent(f, c, ru, rv, ox) {
      var cu = Math.cos(f), cv = Math.sin(f), Q = [];
      for (var j = 0; j < 12; j++) { var t = Math.PI * 2 * j / 12, al = c + Math.cos(t) * ru, ac = Math.sin(t) * rv; Q.push(P(ox + cu * al - cv * ac, cv * al + cu * ac)); }
      return pts(Q) + 'Z';
    }
    var pad = [];
    for (k = 0; k < 16; k++) { var a = Math.PI * 2 * k / 16, ca = Math.cos(a); pad.push(P(-0.2 + ca * (ca > 0 ? 0.16 : 0.13), Math.sin(a) * (0.18 + (ca > 0 ? 0.04 : 0)))); }
    var d = pts(pad) + 'Z', claws = '';
    for (i = 0; i < 5; i++) {
      var f = PRINT_FAN[i], cu = Math.cos(f), cv = Math.sin(f), c = i === 0 || i === 4 ? 0.22 : 0.27;
      d += dent(f, c, 0.135, 0.055, -0.05);
      // the claw: a narrow slash beyond the toe, pointing on along it
      var c0 = c + 0.19, c1 = c + 0.37, w = 0.028;
      claws += pts([P(-0.05 + cu * c0 - cv * w, cv * c0 + cu * w), P(-0.05 + cu * c1, cv * c1), P(-0.05 + cu * c0 + cv * w, cv * c0 - cu * w)]) + 'Z';
    }
    return { pad: d, claws: claws };
  }
  // Sprinkle's prints beside the drag marks P (the same cubic, w0 to w1 wide), one every `step` from t0
  // to t1, sides taking turns, each its own group (data-art="print"). o: lip, deep, fs, size (print
  // length as a share of the marks' width there), gap (how far out beside them), step, t0, t1.
  function printsAlong(S, P, w0, w1, o) {
    var s = '', side = 1;
    for (var t = o.t0; t <= o.t1 + 1e-6; t += o.step) {
      var q = along(P, t), w = lerp(w0, w1, t), L = w * o.size, off = side * (w * 0.5 + L * o.gap);
      if (L < 8) break;
      var pr = printD(q.x + q.nx * off, q.y + q.ny * off + L * 0.05 * side, L, q.tx, q.ty, o.fs), lift = n(Math.max(1.5, L * 0.035));
      s += g(path(pr.pad, o.lip, { opacity: 0.7, transform: 'translate(0 ' + lift + ')' }) + path(pr.pad, o.deep, { opacity: 0.92 }) +
        path(pr.claws, o.lip, { opacity: 0.6, transform: 'translate(0 ' + lift + ')' }) + path(pr.claws, o.deep), { 'data-art': 'print' });
      side = -side;
    }
    return s;
  }

  // A fallen branch dragged across the back: a long limb lying on the floor from (x0, y0) (its thick
  // end) to (x1, y1), forks and twigs standing up, a few dry leaves, loose sticks under it. k scales
  // it; `dim` sinks it into the dark. A heap of old sticks, nothing more.
  // `leafy` (the front limb of the told path's heap) grows its dry leaves that many times bigger;
  // `clear` [x0, y0, x1, y1]: a fork that would rise into this box (her face, peering over the heap)
  // stops short of it, so the sticks never cross her eyes.
  var BRANCH_FACE = [790, 540, 975, 722];
  function fallenBranch(S, c, x0, y0, x1, y1, k, seed, dim, leafy, clear) {
    var lk = leafy || 1;
    var r = rng(seed), wood = mix('#6E5646', c.dark2, dim), woodDk = mix('#3F3129', c.dark0, dim), woodLt = mix('#A88B6C', c.dark3, dim), leafC = mix('#8E6B3E', c.dark2, dim * 0.9);
    var C = [[x0, y0], [lerp(x0, x1, 0.33), lerp(y0, y1, 0.33) + 26 * k], [lerp(x0, x1, 0.66), lerp(y0, y1, 0.66) + 18 * k], [x1, y1]];
    var limb = ribbon(C, 0, 0, 50 * k, 14 * k, 0, 1, 24, 0.05), forks = '', twigs = '', leaves = '', sticks = '', bark = '', hi = '';
    // loose sticks lying under it
    for (var i = 0; i < 11; i++) {
      var sx = lerp(x0, x1, 0.05 + r() * 0.9) + (r() - 0.5) * 60 * k, sy = lerp(y0, y1, (sx - x0) / ((x1 - x0) || 1)) + (-30 + r() * 56) * k, sa = (r() - 0.5) * 1.4, sl = (90 + r() * 120) * k;
      sticks += bar([sx - Math.cos(sa) * sl / 2, sy - Math.sin(sa) * sl / 2], [sx + Math.cos(sa) * sl / 2, sy + Math.sin(sa) * sl / 2], 11 * k, 6 * k);
    }
    // forks standing up out of the limb, each with two twigs and a few dry leaves
    [0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.9].forEach(function (t, j) {
      var q = along(C, t), up = -Math.PI / 2 + (j % 2 ? 0.5 : -0.45) + (r() - 0.5) * 0.5, len = (230 - t * 100) * k * (0.75 + r() * 0.45);
      if (clear) {
        // walk the fork up; where it would enter the box (with room for its leaves), it ends below it
        for (var cl = 0; cl < 12 && len > 20; cl++) {
          var hx = q.x + Math.cos(up) * len, hy = q.y + Math.sin(up) * len, m = 34 * k * lk;
          var lo = Math.min(q.x, hx) - m, hi = Math.max(q.x, hx) + m;
          if (hi < clear[0] || lo > clear[2] || hy - m > clear[3]) break;
          len *= 0.82;
        }
      }
      var ex = q.x + Math.cos(up) * len, ey = q.y + Math.sin(up) * len;
      forks += bar([q.x, q.y], [ex, ey], (20 - t * 9) * k, 5 * k);
      for (var tw = 0; tw < 2; tw++) {
        var tt = 0.45 + tw * 0.3, bx = lerp(q.x, ex, tt), by = lerp(q.y, ey, tt), ta = up + (tw ? -0.7 : 0.75), tl = len * 0.42;
        twigs += 'M' + n(bx) + ' ' + n(by) + 'L' + n(bx + Math.cos(ta) * tl) + ' ' + n(by + Math.sin(ta) * tl);
        leaves += leafD(bx + Math.cos(ta) * tl, by + Math.sin(ta) * tl, 26 * k * lk, ta + 0.3, 10 * k * lk) + leafD(bx + Math.cos(ta) * tl * 0.6, by + Math.sin(ta) * tl * 0.6, 22 * k * lk, ta - 1.2, 8 * k * lk) +
          leafD(bx + Math.cos(ta) * tl * 0.85, by + Math.sin(ta) * tl * 0.85, 20 * k * lk, ta + 1.9, 8 * k * lk);
      }
      leaves += leafD(ex, ey, 28 * k * lk, up + 0.2, 11 * k * lk) + leafD(ex, ey, 24 * k * lk, up - 1.4, 9 * k * lk);
    });
    for (i = 0; i < 9; i++) { var q2 = along(C, 0.05 + i * 0.1); bark += 'M' + n(q2.x - 18 * k) + ' ' + n(q2.y + (r() - 0.5) * 8 * k) + 'l' + n(30 * k) + ' ' + n((r() - 0.5) * 6 * k); }
    for (i = 0; i <= 12; i++) { var q3 = along(C, i / 12), w3 = lerp(50, 14, i / 12) * k; hi += (i ? 'L' : 'M') + n(q3.x - q3.nx * w3 * 0.36) + ' ' + n(q3.y - q3.ny * w3 * 0.36); }
    return path(sticks, mix(wood, woodDk, 0.35), { stroke: woodDk, 'stroke-width': n(2.5 * k), 'stroke-linejoin': 'round' }) + stroke(twigs, woodDk, 5 * k) +
      path(forks, wood, { stroke: woodDk, 'stroke-width': n(3 * k), 'stroke-linejoin': 'round' }) +
      path(limb, wood, { stroke: woodDk, 'stroke-width': n(3.5 * k), 'stroke-linejoin': 'round' }) + stroke(bark, woodDk, 2.5 * k, { opacity: 0.6 }) +
      stroke(hi, woodLt, 3.5 * k, { opacity: 0.7 }) + path(leaves, leafC, { opacity: 0.92, stroke: mix(leafC, woodDk, 0.5), 'stroke-width': n(1.5 * k) });
  }

  // The evening under the bridge (chapter 2 is all day): 'gold' at sunset, when the low sun reaches far
  // in; 'dusk' after it, a soft rose light by the way in. Null by day, morning, night and storm.
  function evening(S) { return S.tod === 'sunset' || S.tod === 'golden' ? 'gold' : S.tod === 'dusk' ? 'dusk' : null; }
  function eveCol(S, ev) { return ev === 'gold' ? mix(S.pal.sun || '#FFE9AE', '#FFC062', 0.55) : mix(S.pal.glow, '#E59AB4', 0.3); }

  // ------------------------------------------------------------------ PAWS: the promise, three forepaws piled

  // The cats' coats (app/art/cats.js, FUR: base, line, stripe, light, pattern, patches), so her own
  // forepaw wears her look; tests/set-bridge.test.js checks they still match cats.js. A white-paws
  // marking makes the paw white (bright white on a pale coat, as cats.js does).
  var FURS = {
    black: { base: '#3d3844', line: '#18161c', light: '#5b5465' },
    white: { base: '#fbf8f2', line: '#a39787', light: '#ffffff' },
    'silver-tabby': { base: '#c3cbd4', line: '#5a6574', stripe: '#6c7886', light: '#e4e9ef', pattern: 'tabby' },
    'brown-tabby': { base: '#b5895b', line: '#4c3522', stripe: '#5b3f27', light: '#d5ae80', pattern: 'tabby' },
    ginger: { base: '#e8913a', line: '#8f4a1b', stripe: '#b5602a', light: '#f7b86e', pattern: 'tabby' },
    cream: { base: '#f2dbb1', line: '#a3855a', stripe: '#d8b47f', light: '#fcf0da', pattern: 'tabby' },
    grey: { base: '#9ea5ad', line: '#4f565e', light: '#c3c9cf' },
    tortie: { base: '#3f3330', line: '#1b1412', light: '#5e4b44', pattern: 'tortie', patches: ['#da853b', '#ecb877'] },
    calico: { base: '#fbf8f2', line: '#998b7b', light: '#ffffff', pattern: 'calico', patches: ['#e3893a', '#3d3844'] }
  };
  var PALE_FUR = { white: 1, cream: 1, calico: 1 };
  // Riffle (cats.js BEASTS.riffle's base, line and light), the skin between his toes a little paler
  var RIFFLE_PAW = { base: '#8c5a36', line: '#3b2415', light: '#bd875a', web: '#b98a62', claw: '#f3e4c8' };
  // Sprinkle: mist-grey matte scales in soft ridges, paler at the edges; five long pale claws
  var SPRINKLE_PAW = { base: '#a3acb5', line: '#56606b', light: '#d6dce2', ridge: '#87919c', claw: '#efe9dd', clawLine: '#8b8476' };

  // A paw's own frame: u along the paw (its toes at +u), v across; (ox, oy) the middle of its palm,
  // `a` the direction its toes point (radians, screen), s its width in world units.
  function pawFrame(ox, oy, a, s) {
    var ca = Math.cos(a), sa = Math.sin(a);
    return function (u, v) { return [ox + (u * ca - v * sa) * s, oy + (u * sa + v * ca) * s]; };
  }
  function ovalP(X, u0, v0, ru, rv, k) {
    var P = [];
    for (var i = 0; i < k; i++) { var t = Math.PI * 2 * i / k; P.push(X(u0 + Math.cos(t) * ru, v0 + Math.sin(t) * rv)); }
    return P;
  }
  // an irregular patch of colour (a tortie's or a calico's), wobbling round (u0, v0)
  function patchP(X, u0, v0, ru, rv, seed) {
    var P = [], r = rng(seed), k = 16, ph = r() * 6.28, ph2 = r() * 6.28;
    for (var i = 0; i < k; i++) {
      var t = Math.PI * 2 * i / k, w = 1 + 0.18 * Math.sin(3 * t + ph) + 0.1 * Math.sin(5 * t + ph2);
      P.push(X(u0 + Math.cos(t) * ru * w, v0 + Math.sin(t) * rv * w));
    }
    return P;
  }
  // a digit from distance r0 to r1 along the angle f from the palm's middle, w0 to w1 either side, round-tipped
  function digitP(X, f, r0, r1, w0, w1) {
    var cu = Math.cos(f), cv = Math.sin(f), nu = -cv, nv = cu, P = [X(cu * r0 + nu * w0, cv * r0 + nv * w0)];
    for (var i = 0; i <= 6; i++) {
      var a = Math.PI / 2 - Math.PI * i / 6, su = Math.sin(a) * w1, fu = Math.cos(a) * w1;
      P.push(X(cu * (r1 + fu) + nu * su, cv * (r1 + fu) + nv * su));
    }
    P.push(X(cu * r0 - nu * w0, cv * r0 - nv * w0));
    return P;
  }
  // a claw from its base (u0, v0), w either side, to its tip (u1, v1), bent a little to one side
  function clawUV(X, u0, v0, u1, v1, w, bend) {
    var du = u1 - u0, dv = v1 - v0, l = Math.sqrt(du * du + dv * dv) || 1, nu = -dv / l, nv = du / l, b = bend * l, um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
    return [X(u0 + nu * w, v0 + nv * w), X(um + nu * (w * 0.5 + b), vm + nv * (w * 0.5 + b)), X(u1 + nu * b * 0.6, v1 + nv * b * 0.6),
      X(um - nu * (w * 0.5 - b), vm - nv * (w * 0.5 - b)), X(u0 - nu * w, v0 - nv * w)];
  }
  // a claw out along the angle f from the palm's middle, from r0 to r1
  function clawP(X, f, r0, r1, w, bend) { var cu = Math.cos(f), cv = Math.sin(f); return clawUV(X, cu * r0, cv * r0, cu * r1, cv * r1, w, bend); }
  // the arm, from the wrist (u0) back past the panel's edge: w0 either side at the wrist, w1 far back
  function armP(X, u0, w0, w1) {
    return [X(u0, -w0), X(-0.9, -w0 * 1.06), X(-1.8, -(w0 + w1) / 2 * 1.04), X(-6, -w1), X(-6, w1), X(-1.8, (w0 + w1) / 2 * 1.04), X(-0.9, w0 * 1.06), X(u0, w0)];
  }
  // fur along an arm's edges: little flicks of the line colour, w either side
  function furFlicks(X, w, u0, u1, step) {
    var d = '';
    for (var u = u0; u > u1; u -= step) for (var sd = -1; sd <= 1; sd += 2) {
      var a = X(u, sd * w * 0.98), b = X(u - step * 0.3, sd * w * 0.8), c2 = X(u - step * 0.12, sd * w * 0.99);
      d += 'M' + n(a[0]) + ' ' + n(a[1]) + 'L' + n(b[0]) + ' ' + n(b[1]) + 'M' + n(c2[0]) + ' ' + n(c2[1]) + 'L' + n(b[0]) + ' ' + n(b[1]);
    }
    return d;
  }

  // One paw, papercut style: every body shape outlined together as one silhouette (each outline
  // carries data-paw: nothing drawn after a claw may cover it, the tests check), then the arm, what
  // lies on the arm (stripes, patches, scales), the paw's own shapes, its details, and its claws
  // (data-claw, five a paw). P: { arm, shapes: [[points, fill], …], under, over, claws, line, lw,
  // clawFill, clawLine }.
  function pawSvg(who, P) {
    var all = [[P.arm, P.armFill]].concat(P.shapes), outl = '', fills = '', cl = '';
    all.forEach(function (sh) { outl += path(pts(sh[0]) + 'Z', P.line, { stroke: P.line, 'stroke-width': n(P.lw * 2), 'stroke-linejoin': 'round', 'data-paw': who }); });
    P.shapes.forEach(function (sh) { fills += path(pts(sh[0]) + 'Z', sh[1]); });
    P.claws.forEach(function (C) {
      cl += path(pts(C) + 'Z', P.clawFill, { stroke: P.clawLine, 'stroke-width': n(Math.max(1.6, P.lw)), 'stroke-linejoin': 'round', 'data-claw': who });
    });
    return outl + path(pts(P.arm) + 'Z', P.armFill) + P.under + fills + P.over + cl;
  }

  // Her forepaw, from her look: the arm in her coat (tabby bands, tortie or calico patches), the paw
  // white for white paws, four toes and the dewclaw up the side `dew` (+1 / -1), five claws out.
  var CAT_TOES = [-0.68, -0.23, 0.23, 0.68];
  function catPaw(X, s, look, dew) {
    look = look || {};
    var furId = FURS[look.fur] ? look.fur : 'brown-tabby', F = FURS[furId], white = look.marking === 'white-paws';
    var pawC = white ? (PALE_FUR[furId] ? '#ffffff' : '#fcf9f3') : F.base, lw = Math.max(1.6, s * 0.013), under = '', shapes = [], claws = [];
    if (F.pattern === 'tabby') {
      var bands = '';
      [-0.74, -1.16, -1.6, -2.06, -2.52].forEach(function (u, i) {
        var w = 0.44 + (-0.3 - u) * 0.025, t = 0.08 + (i % 2) * 0.02;
        bands += pts([X(u, -w), X(u + 0.07, -w * 0.3), X(u + 0.02, w * 0.25), X(u + 0.06, w), X(u - t, w), X(u - t - 0.03, w * 0.25), X(u - t + 0.04, -w * 0.3), X(u - t, -w)]) + 'Z';
      });
      under += path(bands, F.stripe, { opacity: 0.9 });
    } else if (F.pattern === 'tortie' || F.pattern === 'calico') {
      under += path(pts(patchP(X, -1.0, 0.16, 0.42, 0.3, 61)) + 'Z', F.patches[0]) + path(pts(patchP(X, -1.75, -0.14, 0.36, 0.3, 62)) + 'Z', F.patches[1]) +
        path(pts(patchP(X, -2.5, 0.1, 0.4, 0.34, 63)) + 'Z', F.patches[0]);
    }
    under += path(pts([X(-0.36, 0.22), X(-6, 0.3), X(-6, 0.5), X(-0.36, 0.4)]) + 'Z', mix(F.base, F.line, 0.2), { opacity: 0.5 }) +
      stroke(pts([X(-0.5, -0.26), X(-6, -0.34)]), F.light, s * 0.045, { opacity: 0.45 });
    // a white paw: a sock over the wrist, its top softly scalloped
    if (white) shapes.push([[X(-0.64, -0.41), X(-0.72, -0.2), X(-0.65, 0), X(-0.73, 0.2), X(-0.64, 0.41), X(-0.1, 0.47), X(-0.1, -0.47)], pawC]);
    CAT_TOES.forEach(function (f) { shapes.push([ovalP(X, Math.cos(f) * 0.43, Math.sin(f) * 0.43, 0.2, 0.175, 16), pawC]); });
    shapes.push([ovalP(X, 0, 0, 0.44, 0.5, 24), pawC]);
    shapes.push([ovalP(X, -0.16, dew * 0.47, 0.12, 0.1, 12), pawC]);
    var parts = '';
    [-0.45, 0, 0.45].forEach(function (f) { parts += pts([X(Math.cos(f) * 0.3, Math.sin(f) * 0.3), X(Math.cos(f) * 0.56, Math.sin(f) * 0.56)]); });
    var over = stroke(parts, F.line, lw * 1.3, { opacity: 0.7 }) + stroke(pts([X(-0.27, dew * 0.38), X(-0.1, dew * 0.42)]), F.line, lw, { opacity: 0.5 });
    CAT_TOES.forEach(function (f) { claws.push(clawP(X, f, 0.56, 0.86, 0.05, 0.1)); });
    claws.push(clawUV(X, -0.1, dew * 0.55, 0.1, dew * 0.8, 0.045, 0.1 * dew));
    under += stroke(furFlicks(X, 0.45, -0.8, -3.2, 0.42), F.line, lw, { opacity: 0.4 });
    return { arm: armP(X, -0.3, 0.4, 0.5), armFill: F.base, shapes: shapes, under: under, over: over, claws: claws, line: F.line, lw: lw,
      clawFill: '#f8f3ea', clawLine: mix(F.line, '#7a6e66', 0.4) };
  }

  // Sprinkle's forepaw: big, mist grey, soft ridges of matte scales up the arm, a broad palm and five
  // long digits fanned like a hand, each with a long pale claw.
  var DRAGON_DIGITS = [-0.78, -0.39, 0, 0.39, 0.78];
  function dragonPaw(X, s) {
    var D = SPRINKLE_PAW, lw = Math.max(1.6, s * 0.01), shapes = [], claws = [], ridges = '', knuckles = '';
    for (var u = -0.62; u > -6; u -= 0.3) {
      var w = 0.27 + Math.min(0.06, (-u - 0.3) * 0.012), st = X(u, -w * 0.92);
      ridges += 'M' + n(st[0]) + ' ' + n(st[1]);
      for (var j = 0; j < 3; j++) {
        var v0 = -w * 0.92 + j * w * 0.613, v1 = v0 + w * 0.613, mid = X(u + 0.1, (v0 + v1) / 2), e = X(u, v1);
        ridges += 'Q' + n(mid[0]) + ' ' + n(mid[1]) + ' ' + n(e[0]) + ' ' + n(e[1]);
      }
    }
    var under = stroke(ridges, D.ridge, lw * 1.4, { opacity: 0.75 }) + stroke(pts([X(-0.45, -0.21), X(-6, -0.28)]), D.light, s * 0.035, { opacity: 0.6 }) +
      stroke(pts([X(-0.45, 0.21), X(-6, 0.28)]), mix(D.base, D.line, 0.25), s * 0.035, { opacity: 0.5 });
    DRAGON_DIGITS.forEach(function (f, i) {
      var r1 = i === 0 || i === 4 ? 0.62 : 0.72, cu = Math.cos(f), cv = Math.sin(f), nu = -cv, nv = cu;
      shapes.push([digitP(X, f, 0.18, r1, 0.1, 0.078), D.base]);
      [0.44, 0.58].forEach(function (rk) {
        if (rk > r1 - 0.06) return;
        var a = X(cu * rk + nu * 0.07, cv * rk + nv * 0.07), m = X(cu * (rk + 0.04), cv * (rk + 0.04)), b = X(cu * rk - nu * 0.07, cv * rk - nv * 0.07);
        knuckles += 'M' + n(a[0]) + ' ' + n(a[1]) + 'Q' + n(m[0]) + ' ' + n(m[1]) + ' ' + n(b[0]) + ' ' + n(b[1]);
      });
      claws.push(clawP(X, f, r1 + 0.03, r1 + 0.4, 0.06, 0.12));
    });
    shapes.push([ovalP(X, -0.02, 0, 0.4, 0.44, 24), D.base]);
    var over = stroke(knuckles, D.ridge, lw * 1.3, { opacity: 0.8 }) + path(pts(ovalP(X, -0.06, -0.12, 0.22, 0.14, 14)) + 'Z', D.light, { opacity: 0.45 });
    return { arm: armP(X, -0.3, 0.26, 0.33), armFill: D.base, shapes: shapes, under: under, over: over, claws: claws, line: D.line, lw: lw, clawFill: D.claw, clawLine: D.clawLine };
  }

  // Riffle's forepaw: sleek brown, five short toes with the skin stretched between them (webbed),
  // little pale claws.
  var OTTER_TOES = [-0.92, -0.46, 0, 0.46, 0.92];
  function otterPaw(X, s) {
    var R = RIFFLE_PAW, lw = Math.max(1.6, s * 0.015), shapes = [], claws = [];
    var tipR = OTTER_TOES.map(function (f, i) { return i === 0 || i === 4 ? 0.56 : 0.63; });
    for (var i = 0; i < 4; i++) {
      var g0 = OTTER_TOES[i], g1 = OTTER_TOES[i + 1], gm = (g0 + g1) / 2, rr = Math.min(tipR[i], tipR[i + 1]) - 0.07;
      shapes.push([[X(Math.cos(g0) * 0.28, Math.sin(g0) * 0.28), X(Math.cos(g0) * rr, Math.sin(g0) * rr), X(Math.cos(gm) * (rr - 0.08), Math.sin(gm) * (rr - 0.08)),
        X(Math.cos(g1) * rr, Math.sin(g1) * rr), X(Math.cos(g1) * 0.28, Math.sin(g1) * 0.28)], R.web]);
    }
    OTTER_TOES.forEach(function (f, i) {
      shapes.push([digitP(X, f, 0.2, tipR[i], 0.08, 0.066), R.base]);
      claws.push(clawP(X, f, tipR[i] + 0.04, tipR[i] + 0.22, 0.034, 0.1));
    });
    shapes.push([ovalP(X, 0, 0, 0.38, 0.44, 22), R.base]);
    var under = stroke(furFlicks(X, 0.31, -0.8, -3.2, 0.5), R.line, lw, { opacity: 0.3 }) + stroke(pts([X(-0.45, -0.18), X(-6, -0.22)]), R.light, s * 0.05, { opacity: 0.55 }) +
      path(pts([X(-0.36, 0.14), X(-6, 0.18), X(-6, 0.35), X(-0.36, 0.29)]) + 'Z', mix(R.base, R.line, 0.22), { opacity: 0.5 });
    var over = path(pts(ovalP(X, -0.08, -0.12, 0.2, 0.13, 12)) + 'Z', R.light, { opacity: 0.4 });
    return { arm: armP(X, -0.28, 0.29, 0.35), armFill: R.base, shapes: shapes, under: under, over: over, claws: claws, line: R.line, lw: lw, clawFill: R.claw, clawLine: R.line };
  }

  // The pile, bottom to top as the text has it: her paw held out, Sprinkle's big paw set on it, Riffle's
  // slapped on top. Fanned and offset like hands piled in a circle: hers comes in from the bottom left,
  // its toes up to the right; Sprinkle reaches down from the top right, her palm on the heel of it and
  // her long digits spread down to the left; Riffle's comes up from below, his palm on her wrist, his
  // webbed toes up top. Each palm rests on the one below, and each paw's toes and claws (her dewclaw
  // too, on the side away from the pile) lie where nothing comes after them: fifteen claws, none
  // covered, the nearest two of them 90 apart (tests/set-bridge.test.js checks every coat).
  // PAW_PILE: [palm x, palm y, the toes' direction in degrees, the paw's width], found by trying many
  // and keeping the one with the most room round every claw.
  var PAW_PILE = { player: [1025, 532, -36, 260], sprinkle: [660, 520, 127, 330], riffle: [815, 351, -102, 240] };
  // Chapter 4, the thirty-claw promise (`pawsIn: 'both'`): six forepaws, bottom to top as the text has
  // it: Sprinkle holds out both of hers, the player's go on top, then Riffle's. Every arm reaches in
  // from the bottom edge (her own forepaws as she sees them, and her friends' beside hers), each pair
  // set a little back from the pair below, so the three pairs' claws lie in three rows, ten to a row,
  // none covered. [who, palm x, palm y, the toes' direction in degrees, the paw's width, the dewclaw's
  // side]: found as PAW_PILE was, by trying many (symmetric about the pile's middle) and keeping the
  // one with the most room round every claw, then loosened a little by hand so it is not a diagram.
  // PAW_PILE6_AT: where each friend's running total is lettered, beside its row of claws, on no paw.
  var PAW_PILE6 = [
    ['sprinkle', 458, 424, -98.6, 322, -1], ['sprinkle', 922, 420, -81.4, 322, 1],
    ['player', 470, 503, -86, 254, -1], ['player', 912, 498, -94.5, 254, 1],
    ['riffle', 541, 700, -102.7, 234, -1], ['riffle', 840, 696, -78.3, 234, 1]
  ];
  var PAW_PILE6_AT = [[1300, 204], [1226, 380], [1156, 596]];
  // `hop: true` (the promise's second panel, Sprinkle hopping along by fives): every paw's five claws
  // lit warm gold, and its running total, 5, 10 and 15 in pile order (hers, Sprinkle's, Riffle's),
  // lettered just beyond its claw fan, outside the pile, where nothing covers it.
  var HOP_GOLD = { fill: '#FFE07A', line: '#C98A12', glow: '#FFD86E' };
  // whether (x, y) lies on any paw of the pile: its arm, palm and toes, or a claw (a little margin round each claw)
  function inPoly(P, x, y) {
    var c = false;
    for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
      if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c;
    }
    return c;
  }
  function pileHit(pile, x, y) {
    return pile.some(function (pr) {
      var P = pr[1];
      if (inPoly(P.arm, x, y) || P.shapes.some(function (sh) { return inPoly(sh[0], x, y); })) return true;
      // a claw keeps a wide berth: a number never sits in among the claws, only beyond them
      return P.claws.some(function (C) { return C.some(function (q) { return Math.abs(q[0] - x) < 40 && Math.abs(q[1] - y) < 40; }) || inPoly(C, x, y); });
    });
  }
  // The paws of a pile in drawing order (the bottom one first), each { who, x, y, a, s, dew }.
  function pawList(both) {
    if (both) return PAW_PILE6.map(function (q) { return { who: q[0], x: q[1], y: q[2], a: q[3], s: q[4], dew: q[5] }; });
    return ['player', 'sprinkle', 'riffle'].map(function (k) { var q = PAW_PILE[k]; return { who: k, x: q[0], y: q[1], a: q[2], s: q[3], dew: 1 }; });
  }
  // How far the hop has got: `hop: true`, every friend; a count (`hop: 2`, or `lit: 2`: chapter 4's
  // promise Tap, a friend at a tap), that many friends in pile order; anything else, nobody.
  function hopCount(o, friends) {
    if (o.hop === true) return friends;
    var v = typeof o.hop === 'number' ? o.hop : typeof o.lit === 'number' ? o.lit : 0;
    return isFinite(v) ? clamp(Math.round(v), 0, friends) : 0;
  }
  function pawPile(S) {
    var both = S.opts.pawsIn === 'both', L = pawList(both), s = '', nums = '', friends = [], per = both ? 10 : 5;
    L.forEach(function (q) { if (friends.indexOf(q.who) < 0) friends.push(q.who); });
    var lit = hopCount(S.opts, friends.length);
    var pile = L.map(function (q) {
      var X = pawFrame(q.x, q.y, q.a * Math.PI / 180, q.s);
      return [q.who, q.who === 'player' ? catPaw(X, q.s, S.look, q.dew) : q.who === 'sprinkle' ? dragonPaw(X, q.s) : otterPaw(X, q.s), q];
    });
    var box = [1e9, 1e9, -1e9, -1e9];
    pile.forEach(function (pr) {
      pr[1].claws.forEach(function (C) { C.forEach(function (q) { box = [Math.min(box[0], q[0]), Math.min(box[1], q[1]), Math.max(box[2], q[0]), Math.max(box[3], q[1])]; }); });
      pr[1].shapes.forEach(function (sh) { sh[0].forEach(function (q) { box = [Math.min(box[0], q[0]), Math.min(box[1], q[1]), Math.max(box[2], q[0]), Math.max(box[3], q[1])]; }); });
    });
    var numBoxes = [];
    friends.forEach(function (who, fi) {
      if (fi >= lit) return;
      // this friend's claws lit, each with a soft glow under it
      var cx = 0, cy = 0, nq = 0, px = 0, py = 0, np = 0;
      pile.forEach(function (pr) {
        if (pr[0] !== who) return;
        var P = pr[1], glow = '';
        P.claws.forEach(function (C) {
          var mx = 0, my = 0;
          C.forEach(function (q) { mx += q[0] / C.length; my += q[1] / C.length; });
          glow += circ(mx, my, Math.max(16, pr[2].s * 0.07), HOP_GOLD.glow, { opacity: 0.5 });
          cx += mx; cy += my; nq++;
        });
        P.over += glow;
        P.clawFill = HOP_GOLD.fill; P.clawLine = HOP_GOLD.line;
        px += pr[2].x; py += pr[2].y; np++;
      });
      // the running total: just beyond the fan, on the first spot (nearest first, straight out from
      // the palm first, then turning either way) where it covers no paw, claw or arm of the pile;
      // the six-paw pile has a place set for each, beside its row of claws
      cx /= nq; cy /= nq; px /= np; py /= np;
      var total = (fi + 1) * per, dx = cx - px, dy = cy - py, a0 = Math.atan2(dy, dx);
      var fs = both ? 92 : 76, hw = fs * 0.32 * String(total).length + 8, hh = fs * 0.42 + 8, tx = null, ty = null;
      if (both) { tx = PAW_PILE6_AT[fi][0]; ty = PAW_PILE6_AT[fi][1]; }
      for (var dd = 50; dd <= 420 && tx === null; dd += 15) {
        [0, -0.45, 0.45, -0.9, 0.9, -1.35, 1.35].forEach(function (da) {
          if (tx !== null) return;
          var qx = cx + Math.cos(a0 + da) * dd, qy = cy + Math.sin(a0 + da) * dd;
          if (qx - hw < 20 || qx + hw > 1580 || qy - hh < 20 || qy + hh > 980) return;
          var probe = [];
          for (var px2 = -1; px2 <= 1; px2 += 0.5) for (var py2 = -1; py2 <= 1; py2 += 1) probe.push([qx + px2 * hw, qy + py2 * hh]);
          if (!probe.some(function (q) { return pileHit(pile, q[0], q[1]); })) { tx = qx; ty = qy; }
        });
      }
      if (tx === null) { tx = clamp(cx + Math.cos(a0) * 90, hw + 20, 1580 - hw); ty = clamp(cy + Math.sin(a0) * 90, hh + 20, 980 - hh); }
      nums += '<text x="' + n(tx) + '" y="' + n(ty + fs * 0.36) + '" text-anchor="middle" font-family="Andika, &quot;Comic Neue&quot;, sans-serif" font-size="' + fs + '" font-weight="700" fill="#FFF4C8" stroke="#3A2A12" stroke-width="7" stroke-linejoin="round" paint-order="stroke" data-hop="' + total + '">' + total + '</text>';
      numBoxes.push({ x: tx - hw, y: ty - hh, w: hw * 2, h: hh * 2 });
    });
    pile.forEach(function (pr) {
      var P = pr[1], body = pts(P.arm) + 'Z';
      P.shapes.forEach(function (sh) { body += pts(sh[0]) + 'Z'; });
      // a soft shadow on whatever is below
      s += path(body, '#0B1020', { opacity: 0.3, transform: 'translate(9 15)' }) + pawSvg(pr[0], P);
    });
    // what the panel is about: every palm, toe and claw (not the arms), kept clear of the lettering,
    // and the hop's numbers too
    (S.keep = S.keep || []).push({ x: box[0] - 12, y: box[1] - 12, w: box[2] - box[0] + 24, h: box[3] - box[1] + 24 });
    numBoxes.forEach(function (b) { S.keep.push(b); });
    S.pawsLit = lit;
    return s + nums;
  }

  function drawPaws(S) {
    var p = S.pal, o = S.opts, c = cols(S), back = '', front = '', r = rng(801), i, x, y;
    var ev = evening(S), lightC = ev ? eveCol(S, ev) : c.warm;
    // the dry floor at the back of the dark, close and from above: pale dust, old leaves, a stone or two
    back += rect(-10, -10, 1620, 1020, S.linU([[0, mix(c.dark2, '#7E7464', 0.16)], [1, mix(c.dark3, '#A09682', 0.22)]], 0, 0, 0, 1000));
    var dust = '', leaves = '', st = '', sth = '';
    for (i = 0; i < 160; i++) { x = r() * 1600; y = r() * 1000; dust += blob(x, y, 3 + r() * 7, 2 + r() * 4, 6, r, 0.3, 0.3); }
    for (i = 0; i < 16; i++) leaves += leafD(r() * 1600, r() * 1000, 30 + r() * 26, r() * 6.28, 11);
    [[120, 140, 70], [1480, 860, 90], [1390, 120, 60], [230, 900, 54], [1560, 420, 44]].forEach(function (q) {
      st += blob(q[0], q[1], q[2], q[2] * 0.72, 9, r, 0.2, 0.3);
      sth += 'M' + n(q[0] - q[2] * 0.6) + ' ' + n(q[1] - q[2] * 0.5) + 'q' + n(q[2] * 0.6) + ' ' + n(-q[2] * 0.3) + ' ' + n(q[2] * 1.2) + ' 0';
    });
    back += path(dust, mix(c.dark3, '#B0A690', 0.25), { opacity: 0.55 }) + path(leaves, mix(c.dark3, '#8A6A3E', 0.35), { opacity: 0.75 });
    back += g(path(st, mix(c.dark1, c.dark2, 0.5), { stroke: c.dark0, 'stroke-width': 5, 'stroke-linejoin': 'round' }) + stroke(sth, c.dark4, 3, { opacity: 0.4 }), { filter: S.shadow('m') });
    // the edge of a drag mark across the top corner
    back += path(ribbon([[-40, 300], [200, 180], [420, 60], [560, -40]], 0, 0, 150, 120, 0, 1, 24, 0.1), c.dark1, { opacity: 0.7 }) +
      stroke(smooth([[-40, 230], [200, 112], [420, -6]]), mix(c.dark3, '#A09682', 0.2), 4, { opacity: 0.5 });
    // dark round the edges, and a warm pool of light where the paws meet
    back += rect(-10, -10, 1620, 1020, S.radU([[0, c.dark0, 0], [0.55, c.dark0, 0.2], [1, c.dark0, 0.7]], 800, 520, 980));
    back += ell(800, 540, 640, 440, S.radU([[0, lightC, ev === 'dusk' ? 0.3 : 0.42], [0.6, lightC, 0.12], [1, lightC, 0]], 800, 540, 640), { style: 'mix-blend-mode:screen' });
    if (o.pawsIn === true) {
      back += g(pawPile(S), { 'data-art': 'paws' });
      back += rect(-10, -10, 1620, 1020, S.radU([[0, c.dark0, 0], [0.62, c.dark0, 0], [1, c.dark0, 0.55]], 800, 500, 960));
    } else if (o.pawsIn === 'both') {
      // chapter 4: six forepaws; the pile says how many friends are lit (the Tap reads it, or just redraws)
      var six = pawPile(S);
      back += g(six, { 'data-art': 'paws', 'data-lit': S.pawsLit });
      back += rect(-10, -10, 1620, 1020, S.radU([[0, c.dark0, 0], [0.66, c.dark0, 0], [1, c.dark0, 0.5]], 800, 500, 960));
    }
    S.weatherClip = S.clip('brprain', rect(0, 0, 0, 0, '#fff'));
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ chapter 7: her paw over a print, the Tap on one, the sum in the mud

  // The box [x0, y0, x1, y1] of each print printsAlong lays (the same walk, the same order, the same
  // prints), with its middle and length: so a Tap can be put on one, and the sum kept clear of them all.
  function printBoxes(P, w0, w1, o) {
    var out = [], side = 1;
    for (var t = o.t0; t <= o.t1 + 1e-6; t += o.step) {
      var q = along(P, t), w = lerp(w0, w1, t), L = w * o.size, off = side * (w * 0.5 + L * o.gap);
      if (L < 8) break;
      var cx = q.x + q.nx * off, cy = q.y + q.ny * off + L * 0.05 * side, pr = printD(cx, cy, L, q.tx, q.ty, o.fs), b = [1e9, 1e9, -1e9, -1e9];
      ((pr.pad + pr.claws).match(/-?\d+(\.\d+)?/g) || []).forEach(function (v, i) {
        v = +v;
        if (i % 2) { b[1] = Math.min(b[1], v); b[3] = Math.max(b[3], v); } else { b[0] = Math.min(b[0], v); b[2] = Math.max(b[2], v); }
      });
      out.push({ box: b, x: cx, y: cy, L: L, t: t });
      side = -side;
    }
    return out;
  }
  // `under`'s prints (drawUnder lays them so), and the one the Tap is on (`tap: 'print'`): the nearest
  // that lies wholly in the picture and clear of the spot at `mud` (where she crouches, looking down at
  // it: a print under her would hide the thing to touch)
  var U_PRINTS = { lipK: 0.35, w0: 220, w1: 30, fs: 0.5, size: 0.82, gap: 0.55, step: 0.09, t0: 0.14, t1: 0.92 };
  function tapPrint(S) {
    var a = (S.anchorMap || {}).mud, clear = a ? [a.x - a.h * 0.5, a.y - a.h * 0.6, a.x + a.h * 0.55, a.y + 4] : null, list = printBoxes(U_MARKS, U_PRINTS.w0, U_PRINTS.w1, U_PRINTS);
    for (var i = 0; i < list.length; i++) {
      var b = list[i].box;
      if (b[0] < 8 || b[1] < 8 || b[2] > 1592 || b[3] > 992) continue;
      if (clear && b[0] < clear[2] && b[2] > clear[0] && b[1] < clear[3] && b[3] > clear[1]) continue;
      return list[i];
    }
    return null;
  }

  // `compare: [24, 60]` on `under` (the kept path's sum, spec section 4): two lines scratched in the open
  // mud at the front, right of `mud`, the short one by 24 and the long one, two and a half times as long,
  // by 60 (the kit's compareLines, the hollow's drawing). Clear of the drag marks and every print beside
  // them, of the spots at `mud` and `inside` and of Riffle's at { x: 400, y: 940 }, and short of the
  // clods of mud in the near right corner. As high and as big as that leaves room for (digits 42 tall, the
  // group about y 855–955), well off the panel's bottom edge, so the kept path's sum reads as plainly as the
  // told path's in the sand.
  var U_COMPARE = { x: 990, y: 856, w: 320, size: 42, gap: 10 };

  /* `print` (chapter 7, its own composition, as `wall` is): at cat height, close on the mud under the
   * bridge. One of Sprinkle's big prints in front (five long claws: the print `prints: true` lays, as big
   * as a heron's foot), the drag marks' edge along the right side, the mud running back into the dark,
   * the daylight and the river at the open side far off at the left. `over`: our cat crouched at the
   * print's far edge with `reach: true`, her near forepaw held just over its broad heel pad, the pad
   * showing all round her paw and the five toes and long claws fanned out beyond it, toward us, clear of
   * her leg. The print is as big as the wide shots draw it (about four-tenths of her sitting height, as
   * big as a heron's foot), so her paw is about a fifth of its length: the marsh's measure turned round,
   * with room to spare. The spot is where her paw hangs, as the marsh's `raft-edge` is: the set puts the
   * line her feet are on (the cat drawing's `reach.edge`) on the mud just above the print, and draws her
   * shadow there and her paw's on the print. */
  // PR: where the print lies (its heel-to-toe line through x, y), which way it points (toward us and a
  // little right, away from her foreleg, which comes down from the upper left), how the mud is
  // foreshortened; `over` (below, in the anchors): her paw's spot, so the paw hangs over the heel pad's
  // middle and the line her feet are on lies along the print's far edge
  var PR = { x: 1069, y: 818, tx: 0.25, ty: 1, fs: 0.7, h: 1040, paw: 4.6 };
  // the print's length: her paw (the cat drawing's reach.r, at her size here) about a fifth of it
  function printLen(S) {
    var a = (S.anchorMap || {}).over, h = a ? a.h : PR.h, k = h / 200, r = 8.2;
    try {
      var c = typeof art.character === 'function' && !art.character.placeholder ? art.character('player', { pose: 'crouch', reach: true, look: S.look || {} }) : null;
      if (c && c.reach && c.reach.r > 0) { r = c.reach.r; k = h / (c.h || 200); }
    } catch (e) { /* the plain measure */ }
    return r * 2 * k * PR.paw;
  }
  var P_FLOOR = 'M-10 318Q500 300 1000 306Q1300 310 1610 300V1010H-10Z';
  var P_MARKS = [[1760, 1060], [1530, 860], [1420, 560], [1330, 316]];
  function drawPrint(S) {
    var p = S.pal, o = S.opts, c = cols(S), back = '', front = '', r = rng(1701), i, x, y;
    back += rect(-10, -10, 1620, 1020, S.linU([[0, c.dark1], [0.6, c.dark0], [1, c.dark0]], 0, 0, 0, 330));
    // far off at the left, the open side: daylight between two stone legs, a sliver of the brown river
    var side = 'M-10 120L330 168L330 312L-10 326Z';
    var day = K.sky(S, -10, 100, 360, 160, { sun: [40, 140], sunR: 260 }) + riverWater(S, c, -10, 250, 350, 330, { key: 'prw', lines: 12, swirls: 3, debris: 1, seed: 1702, size: 0.5 });
    day += rect(-10, 100, 360, 240, S.linU([[0, c.dark0, 0], [0.5, c.dark0, 0.25], [1, c.dark0, 0.7]], 0, 0, 340, 0));
    back += g(day, { 'clip-path': S.clip('prside', path(side, '#fff')) });
    back += stoneFace(S, [[150, 140], [214, 150], [214, 318], [150, 320]], { rows: 6, per: 1, seed: 1703, col: mix(c.dark3, c.stoneDk, 0.3), dk: c.dark1, lt: c.dark4, mortar: c.dark1, rim: c.dark4, rimOp: 0.5, lw: 2 });
    // the deck's beams overhead, running back into the dark
    back += path('M-10 -10H1610V96Q800 128 -10 112Z', S.linU([[0, c.dark2], [1, c.dark1]], 0, 0, 0, 120));
    back += stroke('M-10 112Q800 128 1610 96', c.warm, 4, { opacity: 0.35 });
    // the mud: wet and dark at the back, lit warm toward the front and the open side
    back += path(P_FLOOR, S.linU([[0, mix(c.dark2, c.mudWet, 0.3)], [0.35, mix(c.dark3, c.mudWet, 0.45)], [1, mix(c.mud, c.dark3, 0.35)]], 0, 300, 0, 1000));
    var fClip = S.clip('prfloor', path(P_FLOOR, '#fff')), fl = '', dots = '', st = '', sth = '';
    for (i = 0; i < 80; i++) { x = r() * 1600; y = 330 + Math.pow(r(), 0.9) * 670; dots += blob(x, y, 2 + (y - 300) * 0.02 + r() * 4, 1.4 + (y - 300) * 0.011, 6, r, 0.3, 0.3); }
    fl += path(dots, mix(c.mudDk, c.dark1, 0.3), { opacity: 0.45 });
    // the drag marks' edge, along the right side
    if (o.drag !== false) fl += dragMarks(S, P_MARKS, 520, 70, { lip: mix(c.mudLt, c.dark3, 0.45), bed: mix(c.mudWet, c.dark1, 0.3), deep: mix(c.mudDk, c.dark0, 0.4) });
    [[260, 930, 34], [1180, 412, 18], [470, 470, 22], [130, 640, 26]].forEach(function (q) {
      st += blob(q[0], q[1], q[2], q[2] * 0.6, 9, r, 0.2, 0.3);
      sth += 'M' + n(q[0] - q[2] * 0.6) + ' ' + n(q[1] - q[2] * 0.4) + 'q' + n(q[2] * 0.6) + ' ' + n(-q[2] * 0.25) + ' ' + n(q[2] * 1.2) + ' 0';
    });
    fl += path(st, mix(c.dark2, c.mudDk, 0.4), { stroke: c.dark0, 'stroke-width': 3, 'stroke-linejoin': 'round' }) + stroke(sth, c.dark4, 2, { opacity: 0.4 });
    // the daylight from the open side warms the near mud
    fl += rect(-10, 300, 1620, 720, S.radU([[0, c.warm, 0.34], [0.6, c.warm, 0.1], [1, c.warm, 0]], 200, 1000, 1100));
    fl += path(P_FLOOR, S.linU([[0, c.dark0, 0.55], [0.3, c.dark0, 0.15], [1, c.dark0, 0]], 0, 300, 0, 800));
    back += g(fl, { 'clip-path': fClip });
    var ev = evening(S);
    if (ev) {
      var ec = eveCol(S, ev), eo = ev === 'gold' ? 1 : 0.55;
      back += ell(160, 900, 760, 320, S.radU([[0, ec, 0.34 * eo], [1, ec, 0]], 160, 900, 760), { style: 'mix-blend-mode:screen' });
    }
    // the print: one of hers, big, its toes toward us
    var L = printLen(S), pr = printD(PR.x, PR.y, L, PR.tx, PR.ty, PR.fs), lift = n(Math.max(2, L * 0.03));
    var lip = mix(c.mudLt, '#EADBBE', 0.35), deep = mix(c.mudDk, '#0A0F1C', 0.6);
    back += g(path(pr.pad, lip, { opacity: 0.75, transform: 'translate(0 ' + lift + ')' }) + path(pr.pad, deep, { opacity: 0.92 }) +
      path(pr.claws, lip, { opacity: 0.65, transform: 'translate(0 ' + lift + ')' }) + path(pr.claws, deep), { 'data-art': 'print' });
    var pb = [1e9, 1e9, -1e9, -1e9];
    ((pr.pad + pr.claws).match(/-?\d+(\.\d+)?/g) || []).forEach(function (v, j) { v = +v; if (j % 2) { pb[1] = Math.min(pb[1], v); pb[3] = Math.max(pb[3], v); } else { pb[0] = Math.min(pb[0], v); pb[2] = Math.max(pb[2], v); } });
    (S.keep = S.keep || []).push({ x: pb[0] - 6, y: pb[1] - 6, w: pb[2] - pb[0] + 12, h: pb[3] - pb[1] + 12 });
    // our cat at `over`: her shadow along the line her feet are on, just above the print, and her paw's on it
    var m = null;
    (S.cast || []).forEach(function (cm) { if (cm && cm.at === 'over' && !m) m = cm; });
    var a = (S.anchorMap || {}).over;
    if (m && a && typeof art.character === 'function' && !art.character.placeholder) {
      var ch = null;
      try {
        var co = { pose: m.pose || 'crouch', mood: m.mood || 'neutral', facing: m.facing || a.face || 'right' };
        if (m.reach != null) co.reach = m.reach;
        if (m.who === 'player' || !m.who) { co.look = S.look || {}; if (co.look.sex) co.sex = co.look.sex; }
        ch = art.character(m.who || 'player', co);
      } catch (e) { ch = null; }
      if (ch && ch.w > 0 && ch.h > 0) {
        var k = a.h / 200 * (m.size > 0 ? +m.size : 1), X = function (u) { return a.x + (u - ch.w / 2) * k; }, Y = function (v) { return a.y + (v - ch.h) * k; };
        var rc = ch.reach, lipY = rc ? Y(rc.edge) : a.y, sh = ell(a.x - 20 * k, lipY - 1, a.h * 0.36, Math.max(3, a.h * 0.034), S.pal.shade, { opacity: 0.3 });
        if (rc) {
          var pwx = X(rc.x), pwy = Y(rc.y), pwr = rc.r * k;
          sh += ell(pwx, Math.max(pwy + pwr * 0.9, (pb[1] + pb[3]) / 2 + pwr * 0.5), pwr * 1.15, pwr * 0.4, S.pal.shade, { opacity: 0.3, 'data-art': 'paw-shadow' });
        }
        back += g(sh, { 'data-art': 'over-shadow' });
      }
    }
    // the pressed edge all round it catches the light, drawn after her shadows so it reads all round her
    // paw: the print's outline, lit, wherever the paw does not hang
    var rimW = n(Math.max(3, L * 0.018));
    back += g(path(pr.pad + pr.claws, 'none', { stroke: lip, 'stroke-width': rimW, 'stroke-linejoin': 'round', opacity: 0.9 }), { 'data-art': 'print-rim' });
    if (o.drips !== false) back += drip(S, 640, 110, 520, 5, 0.6, c.drop, c.dark4) + drip(S, 1380, 100, 380, 4.4, 1.6, c.drop, c.dark4);
    if (o.train) back += grit(S, 60, 1540, 110, 380, 22, 1704, mix(c.dark4, '#FFFFFF', 0.2));
    front += g(path(blob(-30, 1012, 190, 50, 10, rng(1705), 0.25, 0.3), mix(c.dark1, c.mudDk, 0.3)), { filter: S.shadow('m') });
    S.weatherClip = S.clip('prrain', path(side, '#fff'));
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ the set

  function draw(S) {
    if (S.comp === 'mouth') return drawMouth(S);
    if (S.comp === 'under') return drawUnder(S);
    if (S.comp === 'back') return drawBack(S);
    if (S.comp === 'paws') return drawPaws(S);
    if (S.comp === 'wall') return drawWall(S);
    if (S.comp === 'print') return drawPrint(S);
    return drawBank(S);
  }

  art.defineSet('bridge', {
    label: 'the Old Bridge', tod: 'day', draw: draw,
    cams: {
      bank: { box: [0, 0, 1600] },
      mouth: { box: [0, 0, 1600], comp: 'mouth' },
      under: { box: [0, 0, 1600], comp: 'under' },
      back: { box: [0, 0, 1600], comp: 'back' },
      paws: { box: [0, 0, 1600], comp: 'paws' },
      // chapter 6: Coil's close beats, its own composition (sharing `back`'s anchor names)
      wall: { box: [0, 0, 1600], comp: 'wall' },
      // chapter 7: close on one of Sprinkle's prints in the mud, her paw held over it
      print: { box: [0, 0, 1600], comp: 'print' }
    },
    anchors: {
      // the riverbank; `rock` and `edge` also show here, small, at the dark's mouth
      main: {
        'bank-left': A(300, 930, 285), 'bank-right': A(1250, 936, 285, 'left'), reeds: A(1000, 880, 240, 'left'),
        rock: A(492, 722, 140, 'right', { elev: true }), edge: A(330, 772, 176, 'left'),
        // chapter 5: swimming alongside, in the river where the reeds part
        water: BANK_WATER,
        // chapter 9: the practice on the sand (`run`, `run-2`), in the air over it (`skim`, `air`), in the shallows
        // (`paddle`), and the friends watching from the bank at the left (`watch-1` … `watch-4`)
        run: BANK9.run, 'run-2': BANK9['run-2'], skim: BANK9.skim, air: BANK9.air, paddle: BANK9.paddle,
        'watch-1': BANK9['watch-1'], 'watch-2': BANK9['watch-2'], 'watch-3': BANK9['watch-3'], 'watch-4': BANK9['watch-4']
      },
      // `sun-edge`: in the sun just out of the shadow, beside `sun` (a cat there and Tallyheart at
      // `sun` sit side by side: f097a, f100a, f101a); its height is the depth there
      mouth: { rock: A(415, 708, 230, 'right', { elev: true }), edge: A(770, 880, 300, 'left'), sun: A(1330, 965, 340, 'left'), 'sun-edge': A(1100, 958, 337, 'right') },
      under: { mud: A(640, 900, 320), inside: A(1010, 640, 165) },
      // chapter 3: Sprinkle in the nook's mouth, facing the way in; a cat pressed against her flank, just
      // in front of her (list Sprinkle first, so the cat is drawn over her); Riffle and Tallyheart either
      // side, nearer. A cat-height camera, so h = y - 560 all over this floor
      back: {
        near: A(360, 1000, 440), dragon: A(1040, 820, 260, 'left'), beside: A(1150, 850, 290, 'left'),
        'back-left': A(560, 900, 340, 'right'), 'back-right': A(1430, 885, 325, 'left'),
        // chapter 6: the mouth of Coil's gap, low in the stone leg (`stones: true`): his head here, his
        // body trailing back along the wall's foot toward the panel's left edge, behind every spot
        gap: A(B_LEG.gap.x, Math.round(footOf(B_LEG.face, B_LEG.gap.x)), Math.round(footOf(B_LEG.face, B_LEG.gap.x)) - 560, 'right')
      },
      // the three forepaws, close: no faces in it
      paws: {},
      // chapter 6: Coil at his gap, facing the cats (his body trails left along the wall's foot, off
      // the panel's left edge); our cat near, between the gap and the centre, facing it; Riffle near on
      // the right; Sprinkle's head and neck at the right edge (her feet far below the panel, drawn
      // behind the others and left out of the depth a spot of its own gets). No `near`, no `beside`.
      wall: {
        gap: A(W_LEG.gap.x, Math.round(footOf(W_LEG.face, W_LEG.gap.x)), 370, 'right'), 'back-left': A(740, 958, 430, 'left'), 'back-right': A(1110, 948, 418, 'left'),
        dragon: A(1560, 1100, 320, 'left', { z: 'behind' })
      },
      // chapter 7: `over`, our cat crouched at the print's far edge with `reach: true`, her near forepaw held
      // over its heel pad. As the marsh's `raft-edge`, the spot is where the paw hangs (her feet are on the mud
      // above it, the line the cat drawing calls `reach.edge`), so it is `air` and `elev` to scenes.js and the
      // set draws her shadows itself; its height is her size in this close shot. No spot of Tallyheart's.
      print: { over: A(775, 799, PR.h, 'right', { air: true, elev: true }) }
    },
    opts: { train: [false, true], eyes: ['none', 'open', 'blink', 'sprinkle'], drag: [true, false], drips: [true, false],
      pebble: ['in', 'out', 'paws'], branch: [true, false], prints: [true, false], pawsIn: [true, false, 'both'], hop: [false, true],
      // chapter 5: the little forepaws drawn in the mud (`back`)
      mudPaws: [0, 6, 7],
      // chapter 6: the stone leg beside the nook, with Coil's gap (`back`; `wall` always has it)
      stones: [false, true],
      // chapter 7: the Tap on the nearest of her prints (`under`, with `prints: true`), and the sum scratched in
      // the mud (`under`: a list of two numbers, compared by value as the pile's rows; the kit's compareLines)
      tap: ['none', 'print'], compare: [false, [24, 60]],
      // chapter 7 (final review): the lettering keeps off Sprinkle's drooping wing (`back`, her `wings` at `dragon`)
      wing: [false, true],
      // chapter 9: the bright shallows and the strip of sand at the bridge's foot (`bank`)
      shallows: [false, true] },
    defaults: { train: false, eyes: 'none', drag: true, drips: true, branch: false, prints: false, pawsIn: false, hop: false, mudPaws: 0, stones: false, tap: 'none', compare: false, wing: false, shallows: false }
  });

  // For the tests (chapter 9): the bank's water's edge (y at x), the strip of sand along it and the shallows off it
  // ([top, bottom] at x, inside SAND9's x0 … x1), and where the shadows under `air` and `skim` lie.
  art.bridgeBankInfo = function () {
    return {
      edgeAt: function (x) { return yOn(EDGE, x); }, sand: { x0: SAND9.x0, x1: SAND9.x1 },
      sandAt: function (x) { return [yOn(EDGE, x), yOn(EDGE, x) + sandWidth(x)]; }, shoalAt: function (x) { return [yOn(EDGE, x) - shoalDepth(x), yOn(EDGE, x)]; },
      shadowY: { air: SAND_UNDER.air, skim: SAND_UNDER.skim }
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
