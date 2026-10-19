/* Potomac Crossing · app/art/sets/field.js
 *
 * The set: the Barking Field (chapter 2), by day. A muddy square of grass behind a tall
 * chain-link fence, seen from the path outside it where the cats walk. Tallwalker dogs live in
 * there; we go AROUND. Always.
 *
 * Cameras (docs/build.md, "Art vocabulary, chapter 2"): `wide`, `fence` (close on the wire: a
 * nose squashed through it, cats on the path) and `dogs` (the three dogs bouncing at the fence,
 * seen from the path). Each camera has its own composition in the 1600 x 1000 world, so the
 * wire's diamonds grow as the camera closes in.
 *
 * The fence is the `over` layer and the anchors inside it (`dog-1`..`dog-3`, `field`) are
 * z: 'behind', so whoever stands in the field is always behind the wire and the cats on the path
 * (`path-left`, `path-right`) always in front of it, in any cast order. A dog jumping or bouncing
 * at the fence stretches the wire round itself (BOING); in `fence`, the first dog at the wire
 * pushes its nose through: the diamonds open round its snout and bunch up at the edge.
 *
 * Far inside the fence, in every camera, a hollow log lies in the grass, its dark round opening
 * toward the path. Nobody remarks on it (the text keeps it as a quiet plant for a later chapter).
 *
 * Chapter 4, the border (docs/build.md, "Chapter 4"): the far corner of the fence, where the mown
 * path gives way to long golden grass. Three more cameras, each its own composition, all seen
 * from the path with the last post standing between the Clan and the fox:
 *   `border`      wide, both sides of the post: the fence coming up the path from the left, turning
 *                 at the post and running away to the right; the path ending; the long grass.
 *   `border-two`  at cat height, closer: two cats shoulder to shoulder left of the post, the fox
 *                 beyond it.
 *   `border-fox`  the fox chest-up, the long grass round him, the fence behind; whoever is at
 *                 `left` or `right` is only a corner of a cat in the near edge.
 * Their anchors: `fox` (in the long grass past the post: never on the Clan's side of it, never
 * over a cat, never bigger than the cats beside the post), `lead` (Glintstar, in front), `left`
 * and `right` (at her shoulders, as the panel shows them: `right` is the one between `left` and the
 * fox, so Tallyheart at `right` has her shoulder between the fox and a cat at `left`), `back-1` to
 * `back-4` (the cats behind them, always drawn under the three in front, in any cast order), and
 * `dog-1` to `dog-3` behind the wire that runs away behind the fox. The chapter 2 cameras keep
 * their own six anchors and do not see the border's; the border's do not see `path-left`,
 * `path-right` or `field`.
 *
 * `foxTail: true` (the `dogs` camera): a white-tipped tail going into long golden grass at the
 * panel's edge, on the side where no cat sits on the path; drawn under everyone.
 *
 * Chapter 6 (docs/chapters/06-the-snake-in-the-stones.spec.md, section 4, the field row): anchor `grass` in
 * the border's three cameras, Sleet's spot in the long grass just past the last post: nearer than the fox's
 * spot, his face close enough to talk across the post, low in the panel, and far enough past it that no pose
 * of his that stands up (nor, in `border` and the close-up, flat on his belly) puts anything of him on the
 * Clan's side. Whoever is there gets long grass drawn over his lower body, just after him (<g data-part=
 * "grass-cover">, never left of the post): sitting up it reaches his legs and haunches, his chest and head
 * clear; lying low it stands over his body and comes only to his chin in front of his face. Nobody there:
 * nothing, so chapter 4's panels are as they were. The fox is never drawn in his chapter.
 *
 * Registered with PC.art.defineSet (app/art/scenes.js); painters come from PC.art.kit.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});
  var K = art.kit;
  if (!K || !art.defineSet) return;

  var n = K.n, rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke, g = K.g,
    dot = K.dot, mix = K.mix, lerp = K.lerp, clamp = K.clamp, rng = K.rng, blob = K.blob, mound = K.mound, A = K.anchor;

  var DOG_SPOTS = { 'dog-1': 1, 'dog-2': 1, 'dog-3': 1 };
  var BOUNCY = { jump: 1, bounce: 1 };

  // ------------------------------------------------------------------ colours from the palette

  function colors(S) {
    var p = S.pal, dark = S.tod === 'night' || S.tod === 'storm', sk = p.sky, top = sk[sk.length - 1];
    return {
      dim: dark ? 0.5 : (S.tod === 'dusk' || S.tod === 'sunset') ? 0.15 : 0,
      mud: mix(p.wood, p.woodDark, 0.5), mudDark: mix(p.woodDark, p.shade, 0.3), mudLight: mix(mix(p.wood, p.woodDark, 0.3), p.grassFar, 0.45),
      water: mix(sk[1], p.water, 0.3), waterHi: mix(top, '#FFFFFF', dark ? 0.1 : 0.55),
      wire: mix(p.stoneDark, '#4E5A66', 0.5), wireHi: mix(p.rim, p.stoneLight, 0.35),
      metal: mix(p.stone, '#A9B3BD', 0.45), metalDark: mix(p.stoneDark, '#56626E', 0.5), metalLight: mix(p.stoneLight, '#FFFFFF', 0.35),
      path: mix(p.sand, p.stone, 0.45), pathDark: mix(p.sandDark, p.stoneDark, 0.5), pathLight: mix(p.sandLight, p.stoneLight, 0.5),
      cloud: mix(top, '#FFFFFF', dark ? 0.12 : 0.85), cloudShade: mix(sk[2], '#FFFFFF', dark ? 0.04 : 0.5)
    };
  }
  function toyCol(S, C, hex) { return mix(hex, S.pal.shade, C.dim); }

  // ------------------------------------------------------------------ sky, far things

  // A flat-bottomed papercut cloud: a shaded under-layer, the body a little above it.
  function cloud(S, C, x, base, w, h, seed) {
    var d = mound(x - w / 2, x + w / 2, base, base - h, 5, rng(seed), 0.42, 0.28, 0.1);
    return path(d, C.cloudShade, { opacity: 0.9 }) + path(d, C.cloud, { transform: 'translate(0 ' + n(-h * 0.14) + ')' });
  }

  function skyAndCity(S, C, L) {
    var s = K.sky(S, 0, 0, 1600, L.sky, { sun: L.sun, sunR: L.sunR });
    if (S.tod !== 'storm') L.clouds.forEach(function (c) { s += cloud(S, C, c[0], c[1], c[2], c[3], c[4]); });
    if (L.plane) s += K.plane(S, L.plane[0], L.plane[1], L.plane[2], 'left');
    s += K.towers(S, L.towers);
    return s;
  }

  // The trees beyond the field: a low hazy line and a few round trees standing out of it.
  function treeLine(S, L) {
    var p = S.pal, T = L.trees, r = rng(T.seed), col = mix(p.leaf, p.haze, 0.35), col2 = mix(p.leafMid, p.haze, 0.2), s = '';
    var d = mound(-80, 1680, T.base, T.top, Math.round(1760 / T.bump), r, 0.34, 0.3, 0.55);
    s += path(d, p.rim, { transform: 'translate(0 -5)', opacity: 0.55 }) + path(d, col);
    var trees = '';
    T.round.forEach(function (t, i) {
      var tx = t[0], R = t[1], cy = T.base - R * 1.55, rr = rng(T.seed + 11 * (i + 1));
      trees += rect(tx - R * 0.09, cy, R * 0.18, T.base - cy + 2, mix(p.woodDark, p.haze, 0.25));
      var cd = blob(tx, cy, R, R * 0.88, 11, rr, 0.12, 0.3);
      trees += path(cd, p.rim, { transform: 'translate(' + n(-R * 0.04) + ' ' + n(-R * 0.06) + ')', opacity: 0.7 }) + path(cd, col2);
      var lv = '';
      for (var j = 0; j < 14; j++) lv += K.leafD(tx + (rr() - 0.6) * R * 1.2, cy + (rr() - 0.7) * R * 1.1, R * 0.16, rr() * 6.28, R * 0.05);
      trees += path(lv, p.leafLight, { opacity: 0.45 });
    });
    return g(s + trees, { filter: S.shadow('s') });
  }

  // ------------------------------------------------------------------ the wire

  // The mesh's two families of wires, as paths. `pushes` stretch it: each bows the wires away
  // from a point (a dog's snout, a bounce), each wire to its own side, by up to `a` at the point
  // and fading out over `s`, so no wire ever comes nearer the point than `a`. Untouched runs stay
  // single straight segments.
  function meshD(x0, x1, top, base, cw, ch, pushes, step) {
    var H = base - top, sl = cw / ch, a = '', b = '', segs = pushes.length ? Math.max(1, Math.ceil(H / step)) : 1;
    var L = Math.sqrt(1 + sl * sl);
    function bend(x, y, nx, ny) {
      var d = 0, hit = false;
      for (var i = 0; i < pushes.length; i++) {
        var P = pushes[i], ex = x - P.x, ey = y - P.y, r2 = ex * ex + ey * ey;
        if (r2 > P.s * P.s * 7.84) continue;
        hit = true;
        var side = ex * nx + ey * ny < 0 ? -1 : 1;
        d += side * P.a * Math.exp(-r2 / (P.s * P.s));
      }
      // the mesh stays between its rail and its foot
      return [x + nx * d, clamp(y + ny * d, top, base), hit];
    }
    function wire(c, dir) {
      var P = [], nx = 1 / L, ny = -dir * sl / L;
      for (var i = 0; i <= segs; i++) { var y = top + H * i / segs; P.push(bend(c + dir * (y - top) * sl, y, nx, ny)); }
      var d = '';
      for (i = 0; i <= segs; i++) {
        if (i > 0 && i < segs && !P[i][2] && !P[i - 1][2] && !P[i + 1][2]) continue;
        d += (d ? 'L' : 'M') + n(P[i][0]) + ' ' + n(P[i][1]);
      }
      return d;
    }
    var c0 = x0 - Math.ceil(H * sl / cw + 1) * cw;
    for (var c = c0; c <= x1 + cw; c += cw) a += wire(c, 1);
    for (c = x0 - cw; c <= x1 + H * sl + cw; c += cw) b += wire(c, -1);
    return a + b;
  }

  function railH(S, C, x0, x1, y, t) {
    return rect(x0, y - t / 2, x1 - x0, t, S.lin('frail', [[0, C.metalLight], [0.4, C.metal], [1, C.metalDark]]), { rx: t / 2 }) +
      rect(x0, y - t * 0.38, x1 - x0, t * 0.16, '#FFFFFF', { opacity: 0.35, rx: t * 0.08 });
  }

  function post(S, C, x, top, base, w) {
    var s = rect(x - w / 2, top, w, base - top, S.lin('fpost', [[0, C.metalLight], [0.35, C.metal], [1, C.metalDark]], 0, 0, 1, 0));
    // tension bands, each with its bolt
    var bands = '', bolts = '';
    for (var y = base - w * 2.2; y > top + w * 1.6; y -= w * 5.5) {
      bands += 'M' + n(x - w * 0.62) + ' ' + n(y) + 'h' + n(w * 1.24) + 'v' + n(w * 0.32) + 'h' + n(-w * 1.24) + 'Z';
      bolts += dot(x + w * 0.72, y + w * 0.16, w * 0.13);
    }
    s += path(bands, C.metalDark) + path(bolts, C.metalDark);
    return s;
  }

  // A loop cap where the top rail runs through a post.
  function cap(S, C, x, y, w) {
    var d = 'M' + n(x - w * 0.72) + ' ' + n(y + w * 0.62) + 'V' + n(y - w * 0.2) + 'Q' + n(x - w * 0.72) + ' ' + n(y - w * 0.95) + ' ' + n(x) + ' ' + n(y - w * 0.95) +
      'Q' + n(x + w * 0.72) + ' ' + n(y - w * 0.95) + ' ' + n(x + w * 0.72) + ' ' + n(y - w * 0.2) + 'V' + n(y + w * 0.62) + 'Z';
    return path(d, S.lin('fcap', [[0, C.metalLight], [0.4, C.metal], [1, C.metalDark]], 0, 0, 1, 0)) +
      stroke('M' + n(x - w * 0.45) + ' ' + n(y - w * 0.55) + 'Q' + n(x - w * 0.1) + ' ' + n(y - w * 0.85) + ' ' + n(x + w * 0.25) + ' ' + n(y - w * 0.7), '#FFFFFF', w * 0.12, { opacity: 0.5 });
  }

  // The near fence: the mesh over whoever is in the field, its rail and posts, and the grass
  // that grows up against its foot on the path side.
  function nearFence(S, C, F, pushes) {
    var p = S.pal, s = '';
    var d = meshD(-40, 1640, F.top, F.base, F.cell, F.cell * 1.24, pushes, Math.min(F.cell / 4, 12));
    s += g(stroke(d, C.wire, F.wire) +
      stroke(d, C.wireHi, F.wire * 0.4, { opacity: 0.6, transform: 'translate(' + n(-F.wire * 0.28) + ' ' + n(-F.wire * 0.28) + ')' }), { filter: S.shadow('s') });
    // the bottom tension wire, and the mesh's twisted ends
    var knots = '';
    for (var x = Math.ceil(-40 / F.cell) * F.cell; x < 1640; x += F.cell) knots += 'M' + n(x - F.cell * 0.12) + ' ' + n(F.base + F.wire * 2.2) + 'l' + n(F.cell * 0.12) + ' ' + n(-F.wire * 2.6) + 'l' + n(F.cell * 0.12) + ' ' + n(F.wire * 2.6);
    s += stroke(knots, C.wire, F.wire * 0.8) + stroke('M-40 ' + n(F.base - F.wire) + 'H1640', C.metalDark, F.wire * 0.9);
    var posts = '', caps = '';
    F.posts.forEach(function (px) {
      posts += post(S, C, px, F.top, F.base + F.post * 0.8, F.post);
      caps += cap(S, C, px, F.top, F.post);
    });
    var rail = railH(S, C, -40, 1640, F.top, F.rail);
    s += g(posts + rail + caps, { filter: S.shadow('m') });
    // grass against the foot of the fence, outside
    s += K.tufts(S, -20, 1620, F.base + F.verge * 0.15, F.base + F.verge * 0.85, F.tufts, F.seed, p.grassNear, p.grassLight, F.tuft);
    return s;
  }

  // Where a dog just bounced off the wire, the top rail rattles: little shake marks either side.
  function rattle(S, F, x) {
    var w = F.cell * 1.7, y = F.top, d = '', k = F.cell / 34;
    for (var i = 0; i < 2; i++) {
      var off = w + i * 11 * k, h = (15 - i * 4) * k;
      d += 'M' + n(x - off) + ' ' + n(y - h) + 'q' + n(-7 * k) + ' ' + n(h) + ' 0 ' + n(2 * h);
      d += 'M' + n(x + off) + ' ' + n(y - h) + 'q' + n(7 * k) + ' ' + n(h) + ' 0 ' + n(2 * h);
    }
    return g(stroke(d, '#FFFFFF', 5.5 * k, { opacity: 0.85 }) + stroke(d, S.pal.ink, 2.4 * k, { opacity: 0.6 }), { 'class': 'pcs-pulse' });
  }

  // ------------------------------------------------------------------ the field

  function mudPatch(S, C, cx, cy, rx, ry, seed) {
    var r = rng(seed);
    var dry = blob(cx, cy, rx * 1.06, ry * 1.18, 12, r, 0.22, 0.28);
    var wet = blob(cx, cy, rx, ry, 12, rng(seed + 1), 0.25, 0.26);
    var deep = blob(cx + rx * 0.05, cy + ry * 0.08, rx * 0.6, ry * 0.5, 10, rng(seed + 2), 0.3, 0.3);
    var sheen = '';
    for (var i = 0; i < 3; i++) {
      var sx = cx + (r() - 0.5) * rx * 1.1, sy = cy + (r() - 0.5) * ry * 0.9, sw = rx * (0.08 + r() * 0.08);
      sheen += 'M' + n(sx - sw) + ' ' + n(sy) + 'q' + n(sw) + ' ' + n(-ry * 0.1) + ' ' + n(sw * 2) + ' 0';
    }
    return path(dry, C.mudLight, { opacity: 0.75 }) + path(wet, C.mud) + path(deep, C.mudDark, { opacity: 0.55 }) +
      stroke(sheen, '#FFFFFF', Math.max(1, ry * 0.06), { opacity: 0.35 });
  }

  function puddle(S, C, cx, cy, rx, ry, seed) {
    var r = rng(seed), d = blob(cx, cy, rx, ry, 10, r, 0.18, 0.22);
    var s = path(blob(cx, cy + ry * 0.12, rx * 1.08, ry * 1.2, 10, rng(seed + 3), 0.18, 0.22), C.mudDark, { opacity: 0.6 }) + path(d, C.water);
    s += ell(cx - rx * 0.2, cy - ry * 0.15, rx * 0.5, ry * 0.32, C.waterHi, { opacity: 0.55 });
    s += stroke('M' + n(cx - rx * 0.55) + ' ' + n(cy + ry * 0.2) + 'h' + n(rx * 0.35) + 'M' + n(cx + rx * 0.15) + ' ' + n(cy + ry * 0.4) + 'h' + n(rx * 0.3),
      '#FFFFFF', Math.max(1.2, ry * 0.12), { opacity: 0.8, 'class': 'pcs-glint' });
    return s;
  }

  // Dog paw prints in the mud: a pad and four toes, in a wandering trail.
  function prints(S, C, list) {
    var d = '';
    list.forEach(function (t) {
      var x0 = t[0], y0 = t[1], x1 = t[2], y1 = t[3], cnt = t[4], k = t[5], r = rng(t[6] || 7);
      var ang = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(ang), ny = Math.cos(ang);
      for (var i = 0; i < cnt; i++) {
        var u = cnt === 1 ? 0 : i / (cnt - 1), side = i % 2 ? 1 : -1;
        var px = lerp(x0, x1, u) + nx * side * 7 * k, py = lerp(y0, y1, u) + ny * side * 3 * k + (r() - 0.5) * 2 * k;
        var fx = Math.cos(ang), fy = Math.sin(ang) * 0.4;
        d += K.blob(px, py, 4.2 * k, 3 * k, 6, r, 0.2, 0.25);
        for (var j = 0; j < 4; j++) {
          var a = (j - 1.5) * 0.5;
          d += dot(px + (fx * Math.cos(a) - fy * Math.sin(a)) * 7 * k, py + (fy * Math.cos(a) + fx * Math.sin(a)) * 5 * k - 2.6 * k, 1.5 * k);
        }
      }
    });
    return path(d, C.mudDark, { opacity: 0.5 });
  }

  // A dug hole with its heap of thrown-out earth.
  function hole(S, C, x, y, rx, ry) {
    var r = rng(Math.round(x * 7 + y));
    return path(blob(x + rx * 1.1, y - ry * 0.3, rx * 0.9, ry * 0.9, 9, r, 0.3, 0.3), C.mudLight) +
      path(blob(x + rx * 1.1, y - ry * 0.1, rx * 0.8, ry * 0.6, 9, r, 0.3, 0.3), C.mud) +
      ell(x, y, rx, ry, C.mud) + ell(x, y + ry * 0.12, rx * 0.84, ry * 0.7, mix(C.mudDark, '#000000', 0.25)) +
      path(dot(x - rx * 1.4, y + ry * 0.4, rx * 0.12) + dot(x + rx * 2.3, y + ry * 0.6, rx * 0.1) + dot(x - rx * 0.9, y - ry * 1.1, rx * 0.09), C.mud);
  }

  // ------------------------------------------------------------------ Tallwalker toys

  // A tennis ball, sunk a little in the mud.
  function ball(S, C, x, y, R, sunk) {
    var body = toyCol(S, C, '#D6E04A'), shade = toyCol(S, C, '#A9B42E');
    var s = ell(x + R * 0.2, y + R * 0.05, R * 1.1, R * 0.28, S.pal.shade, { opacity: 0.3 });
    s += circ(x, y - R * 0.85, R, shade) + circ(x - R * 0.06, y - R * 0.91, R * 0.9, body);
    s += stroke('M' + n(x - R * 0.82) + ' ' + n(y - R * 1.35) + 'Q' + n(x - R * 0.05) + ' ' + n(y - R * 0.95) + ' ' + n(x - R * 0.3) + ' ' + n(y - R * 0.05) +
      'M' + n(x + R * 0.86) + ' ' + n(y - R * 0.4) + 'Q' + n(x + R * 0.12) + ' ' + n(y - R * 0.8) + ' ' + n(x + R * 0.38) + ' ' + n(y - R * 1.72), '#FFFFFF', R * 0.13, { opacity: 0.9 });
    s += ell(x - R * 0.38, y - R * 1.22, R * 0.22, R * 0.14, '#FFFFFF', { opacity: 0.45 });
    if (sunk) s += path(blob(x, y - R * 0.05, R * 1.15, R * 0.3, 9, rng(Math.round(x + y)), 0.3, 0.3), C.mud);
    return s;
  }

  // A frisbee, seen from a low angle, with a bite chewed out of its rim.
  function frisbee(S, C, x, y, rx, ry, bite) {
    var P = [], top = toyCol(S, C, '#F5862E'), rim = toyCol(S, C, '#C25A1C'), ring = toyCol(S, C, '#FFC07A');
    for (var i = 0; i < 48; i++) {
      var a = i / 48 * Math.PI * 2, k = 1, da = Math.abs(((a - bite + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (da < 0.5) k = 0.7 + 0.12 * Math.abs(Math.sin(da * 13)) + da * 0.3;
      P.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]);
    }
    var d = K.pts(P) + 'Z';
    var s = ell(x + rx * 0.08, y + ry * 0.9, rx * 1.05, ry * 0.7, S.pal.shade, { opacity: 0.25 });
    s += path(d, rim, { transform: 'translate(0 ' + n(ry * 0.45) + ')' }) + path(d, top);
    s += ell(x, y, rx * 0.62, ry * 0.6, 'none', { stroke: ring, 'stroke-width': n(Math.max(1, ry * 0.18)), opacity: 0.8 });
    // tooth marks
    var t = '';
    for (i = 0; i < 4; i++) { var ta = bite + (i - 1.5) * 0.35; t += dot(x + Math.cos(ta) * rx * 0.62, y + Math.sin(ta) * ry * 0.58, Math.max(0.8, ry * 0.08)); }
    s += path(t, rim, { opacity: 0.8 });
    return s;
  }

  // A knotted rope toy, red and cream, its ends frayed.
  function rope(S, C, x, y, len, k) {
    var cream = toyCol(S, C, '#F1E3C6'), red = toyCol(S, C, '#D9453F');
    var d = 'M' + n(x) + ' ' + n(y) + 'q' + n(len * 0.5) + ' ' + n(-len * 0.22) + ' ' + n(len) + ' ' + n(-len * 0.04);
    var w = 7 * k, s = ell(x + len * 0.5, y + w * 0.6, len * 0.55, w * 0.7, S.pal.shade, { opacity: 0.22 });
    s += stroke(d, cream, w) + stroke(d, red, w, { 'stroke-dasharray': n(w * 0.9) + ' ' + n(w * 0.9), 'stroke-linecap': 'butt' });
    s += circ(x, y, w * 1.1, red) + circ(x + len, y - len * 0.04, w * 1.1, cream);
    s += stroke('M' + n(x - w) + ' ' + n(y) + 'l' + n(-w) + ' ' + n(-w * 0.5) + 'M' + n(x - w) + ' ' + n(y + w * 0.3) + 'l' + n(-w * 1.2) + ' ' + n(w * 0.4) +
      'M' + n(x + len + w) + ' ' + n(y - len * 0.04) + 'l' + n(w * 1.1) + ' ' + n(-w * 0.4) + 'M' + n(x + len + w) + ' ' + n(y - len * 0.04 + w * 0.3) + 'l' + n(w) + ' ' + n(w * 0.5),
      cream, w * 0.35);
    return s;
  }

  // A chewed stick.
  function stick(S, C, x, y, len, k) {
    var p = S.pal, w = 6 * k;
    var d = K.taper([x, y], [x + len * 0.35, y - w * 0.8], [x + len * 0.7, y - w * 0.4], [x + len, y - w * 1.2], w * 1.4, w * 0.9, 10);
    return ell(x + len * 0.5, y + w * 0.5, len * 0.52, w * 0.6, p.shade, { opacity: 0.2 }) + path(d, p.woodLight) +
      stroke('M' + n(x + len * 0.55) + ' ' + n(y - w * 0.7) + 'l' + n(len * 0.12) + ' ' + n(-w * 2.2), p.woodLight, w * 0.7) +
      path(d, p.wood, { transform: 'translate(0 ' + n(w * 0.35) + ')', opacity: 0.5 }) +
      path(dot(x + len * 0.06, y - w * 0.1, w * 0.36) + dot(x + len * 0.93, y - w * 1.15, w * 0.3), mix(p.woodLight, '#FFFFFF', 0.45));
  }

  // A hollow log lying far inside the fence: a short barked cylinder, lying side-on, its near
  // end turned a little toward the path so the round dark opening shows. Nobody remarks on it
  // (a quiet plant for a later chapter). x, y: the middle of its foot on the ground; len, R: its
  // length and its radius.
  function hollowLog(S, C, x, y, len, R) {
    var p = S.pal, x0 = x - len / 2, x1 = x + len / 2, top = y - R * 2, cy = y - R, ex = R * 0.46;
    var bark = mix(mix(p.wood, p.woodDark, 0.35), p.shade, C.dim), barkDk = mix(p.woodDark, p.shade, C.dim * 0.6 + 0.1);
    var cut = mix(p.woodLight, p.shade, C.dim), hollow = mix(p.woodDark, '#000000', 0.55), r = rng(Math.round(x * 3 + y));
    var s = ell(x + R * 0.3, y + R * 0.06, len * 0.56, R * 0.3, p.shade, { opacity: 0.3 });
    // the barrel: from the open end (an ellipse at x0) to a rounded far end at x1
    var body = 'M' + n(x0) + ' ' + n(top) + 'H' + n(x1 - ex) + 'A' + n(ex) + ' ' + n(R) + ' 0 0 1 ' + n(x1 - ex) + ' ' + n(y) + 'H' + n(x0) + 'Z';
    s += path(body, S.lin('flog', [[0, mix(bark, p.rim, 0.25)], [0.45, bark], [1, barkDk]]));
    // bark: long grain lines and a knot
    var grain = '';
    for (var i = 0; i < 4; i++) {
      var gy = top + R * (0.45 + i * 0.4) + (r() - 0.5) * R * 0.1, gx0 = x0 + ex * 0.9 + r() * len * 0.12, gx1 = x1 - ex - r() * len * 0.15;
      grain += 'M' + n(gx0) + ' ' + n(gy) + 'Q' + n((gx0 + gx1) / 2) + ' ' + n(gy + (r() - 0.5) * R * 0.25) + ' ' + n(gx1) + ' ' + n(gy);
    }
    s += stroke(grain, barkDk, Math.max(1, R * 0.08), { opacity: 0.55 });
    s += ell(x0 + len * 0.62, cy - R * 0.2, R * 0.2, R * 0.13, barkDk, { opacity: 0.7 });
    s += stroke('M' + n(x0 + ex) + ' ' + n(top + R * 0.12) + 'H' + n(x1 - ex * 1.3), '#FFFFFF', Math.max(1, R * 0.1), { opacity: 0.25 });
    // moss on its back
    s += path(blob(x0 + len * 0.42, top + R * 0.06, len * 0.16, R * 0.16, 8, r, 0.3, 0.3) + blob(x0 + len * 0.72, top + R * 0.1, len * 0.09, R * 0.12, 7, r, 0.3, 0.3), mix(p.moss, p.shade, C.dim));
    // the open end: the cut rim, a ring, and the dark round hollow inside
    s += ell(x0, cy, ex, R, cut) + ell(x0, cy, ex * 0.8, R * 0.84, 'none', { stroke: barkDk, 'stroke-width': n(Math.max(0.8, R * 0.05)), opacity: 0.5 });
    s += ell(x0 + ex * 0.06, cy + R * 0.04, ex * 0.66, R * 0.7, hollow);
    s += ell(x0 + ex * 0.2, cy + R * 0.12, ex * 0.4, R * 0.46, '#000000', { opacity: 0.35 });
    // grass grown up round its foot
    s += K.tufts(S, x0 - R * 0.6, x1 + R * 0.4, y - R * 0.1, y + R * 0.15, Math.max(4, Math.round(len / 18)), Math.round(x + y), p.grassNear, p.grassLight, Math.max(0.35, R / 40));
    return s;
  }

  function toy(S, C, t) {
    if (t.kind === 'ball') return ball(S, C, t.x, t.y, t.r, t.sunk);
    if (t.kind === 'frisbee') return frisbee(S, C, t.x, t.y, t.rx, t.ry, t.bite == null ? -0.6 : t.bite);
    if (t.kind === 'rope') return rope(S, C, t.x, t.y, t.len, t.k);
    if (t.kind === 'stick') return stick(S, C, t.x, t.y, t.len, t.k);
    return '';
  }

  // The square of grass, its mud, puddles, holes, prints and toys; and the far fence behind it.
  function field(S, C, L) {
    var p = S.pal, F = L.field, s = '';
    s += rect(-20, F.top - 4, 1640, F.base - F.top + 24, S.lin('ffield', [[0, mix(p.grassFar, p.haze, 0.15)], [0.5, p.grassFar], [1, p.grass]]));
    // the far side of the square: little posts and a faint wire
    var FF = L.far, ftop = FF.base - FF.h, far = '';
    far += stroke(meshD(-40, 1640, ftop, FF.base, FF.cell, FF.cell * 1.24, [], 999), C.wire, Math.max(0.8, FF.cell * 0.08), { opacity: 0.45 });
    far += rect(-40, ftop - FF.h * 0.03, 1680, Math.max(2, FF.h * 0.05), C.metal, { opacity: 0.8 });
    for (var x = FF.step / 2; x < 1640; x += FF.step) far += rect(x - FF.h * 0.045, ftop - FF.h * 0.08, FF.h * 0.09, FF.h * 1.1, C.metal) + rect(x - FF.h * 0.045, ftop - FF.h * 0.08, FF.h * 0.03, FF.h * 1.1, C.metalLight, { opacity: 0.7 });
    s += g(far, { filter: S.shadow('s') });
    s += K.tufts(S, -20, 1620, F.top + 4, F.base - 6, F.tufts, F.seed, p.grassNear, p.grassLight, F.tuft);
    s += K.flowers(S, 0, 1600, F.top + 10, F.base - 20, Math.round(F.tufts / 9), F.seed + 1, '#FFF6EA');
    L.mud.forEach(function (m, i) { s += mudPatch(S, C, m[0], m[1], m[2], m[3], F.seed + 10 + i * 5); });
    (L.holes || []).forEach(function (h) { s += hole(S, C, h[0], h[1], h[2], h[3]); });
    L.puddles.forEach(function (m, i) { s += puddle(S, C, m[0], m[1], m[2], m[3], F.seed + 40 + i * 5); });
    s += prints(S, C, L.prints);
    // tufts along the mud's edges, nearer ones bigger
    s += K.tufts(S, -20, 1620, F.base - (F.base - F.top) * 0.35, F.base, Math.round(F.tufts * 0.4), F.seed + 2, p.grassNear, p.grassLight, F.tuft * 1.1);
    // the hollow log, far in, behind the wire like everything in the field
    if (L.log) s += g(hollowLog(S, C, L.log[0], L.log[1], L.log[2], L.log[3]), { filter: S.shadow('s'), 'data-part': 'log' });
    var toys = '';
    L.toys.forEach(function (t) { toys += toy(S, C, t); });
    s += g(toys, { filter: S.shadow('s') });
    return s;
  }

  // ------------------------------------------------------------------ the path outside

  function pathway(S, C, L) {
    var p = S.pal, P = L.path, r = rng(P.seed), s = '';
    // the verge between the fence and the path
    s += rect(-20, L.fence.base - 6, 1640, P.top - L.fence.base + 30, S.lin('fverge', [[0, p.grass], [1, p.grassNear]]));
    var edge = 'M-20 ' + n(P.top + 8) + 'C300 ' + n(P.top - 6) + ' 700 ' + n(P.top + 14) + ' 1000 ' + n(P.top + 2) + 'S1500 ' + n(P.top - 4) + ' 1620 ' + n(P.top + 6);
    s += path(edge + 'V1020H-20Z', S.lin('fpath', [[0, C.pathLight], [0.35, C.path], [1, mix(C.path, C.pathDark, 0.35)]]));
    s += stroke(edge, p.rim, 3 * P.k, { opacity: 0.55 });
    var a = '', b = '';
    for (var i = 0; i < P.grit; i++) {
      var gx = r() * 1600, gy = P.top + 14 + Math.pow(r(), 0.8) * (1000 - P.top - 14), gk = lerp(0.5, 1.4, (gy - P.top) / (1000 - P.top)) * P.k;
      if (r() < 0.55) a += blob(gx, gy, 3.2 * gk, 2 * gk, 6, r, 0.3, 0.3); else b += dot(gx, gy, 1.5 * gk);
    }
    s += path(a, C.pathDark, { opacity: 0.45 }) + path(b, C.pathLight, { opacity: 0.9 });
    P.puddles.forEach(function (m, i) { s += puddle(S, C, m[0], m[1], m[2], m[3], P.seed + 20 + i * 5); });
    return s;
  }

  // ------------------------------------------------------------------ who is at the wire

  // Where a cast member's head (and nose) lands, drawn the way scenes.js will draw it: feet
  // bottom-centre at the anchor, scaled to the anchor's sitting-cat height. A drawing that
  // reports `nose` ({x, y} or [x, y], its own units) is used as is; otherwise the nose is just
  // below the head point, as cats.js draws every face (cats, otters, dogs) looking out at us.
  var refCache = { fn: null, h: 100 };
  function refH() {
    var fn = art.character;
    if (refCache.fn === fn) return refCache.h;
    var h = 100;
    try { var c = fn('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }); if (c && c.h > 0) h = c.h; } catch (e) { /* default */ }
    refCache = { fn: fn, h: h };
    return h;
  }
  function headOf(m, a) {
    var fn = art.character;
    if (typeof fn !== 'function' || fn.placeholder || !a) return null;
    var face = m.facing || a.face || 'right';
    var o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: face };
    if (m.variant != null) o.variant = m.variant;
    var ch;
    try { ch = fn(m.who || 'clancat', o); } catch (e) { return null; }
    if (!ch || !(ch.w > 0) || !(ch.h > 0)) return null;
    var s = a.h / refH() * (m.size > 0 ? +m.size : 1);
    var W = function (px, py) { return [a.x + (px - ch.w / 2) * s, a.y + (py - ch.h) * s]; };
    var hd = ch.head || { x: ch.w / 2, y: ch.h * 0.25 };
    var hb = ch.headBox || { x0: hd.x - ch.w * 0.2, y0: hd.y - ch.h * 0.18, x1: hd.x + ch.w * 0.2, y1: hd.y + ch.h * 0.18 };
    var bh = hb.y1 - hb.y0;
    var nz = ch.nose || {}, nx = +(nz.x != null ? nz.x : nz[0]), ny = +(nz.y != null ? nz.y : nz[1]);
    var nose = isFinite(nx) && isFinite(ny) && ch.nose ? W(nx, ny) : W(hd.x, hd.y + bh * 0.07);
    return { nose: nose, head: W(hd.x, hd.y), hh: bh * s };
  }

  // The stretches in the wire: every dog jumping or bouncing at it, and in `fence` the first dog
  // at the wire, nose through.
  function wirePushes(S, F) {
    var out = [], bounces = [], noseDone = S.comp !== 'fence', cast = S.cast || [], AM = S.anchorMap || {};
    for (var i = 0; i < cast.length; i++) {
      var m = cast[i];
      if (!m || m.who !== 'dog' || typeof m.at !== 'string' || !DOG_SPOTS[m.at] || !AM[m.at]) continue;
      var a = AM[m.at], h = headOf(m, a);
      if (!noseDone) {
        noseDone = true;
        var q = h ? h.nose : [a.x, a.y - a.h * 1.1];
        // the snout opens one diamond, a little wider than the wire's own gaps
        var rad = clamp((h ? h.hh : a.h * 0.5) * 0.2, F.cell * 0.3, F.cell * 0.6);
        out.push({ x: q[0], y: q[1], a: rad, s: rad * 1.75 });
        // the nose through the wire is what the panel is about: the lettering keeps off it
        (S.keep = S.keep || []).push({ x: q[0] - rad * 1.25, y: q[1] - rad * 1.25, w: rad * 2.5, h: rad * 2.5 });
        continue;
      }
      if (BOUNCY[m.pose]) {
        var c = h ? h.head : [a.x, a.y - a.h];
        out.push({ x: c[0], y: c[1] + (h ? h.hh * 0.6 : 0), a: F.cell * 0.42, s: F.cell * 2.2 });
        bounces.push(a.x);
      }
    }
    return { pushes: out, bounces: bounces };
  }

  // ------------------------------------------------------------------ chapter 4: the border

  var poly = K.poly;

  // Long golden grass, in this light.
  function goldCols(S, C) {
    var p = S.pal, t = function (h) { return mix(mix(h, p.rim, 0.06), p.shade, C.dim * 0.9); };
    return { base: t('#D8B24A'), light: t('#F3DA8A'), dark: t('#A9822F'), seed: t('#EFD998'), stub: t('#C7B36C'), ground: t('#BF9A3C') };
  }

  // A run of the fence seen at an angle. R: { near: [x, top, base], far: [x, top, base], len (its
  // real length, in the near end's units), cell, wire, rail, post, posts: [u, …] }. at(u, v): u
  // along it in real steps (the far half is the shorter one on the panel), v down it; [x, y, scale].
  function runAt(R) {
    var Hn = R.near[2] - R.near[1], rf = (R.far[2] - R.far[1]) / Hn;
    return function (u, v) {
      var t = u / (u + (1 - u) * rf);
      var top = lerp(R.near[1], R.far[1], t), base = lerp(R.near[2], R.far[2], t);
      return [lerp(R.near[0], R.far[0], t), lerp(top, base, v), lerp(1, rf, t)];
    };
  }
  // its wire: every strand is straight in the fence's own plane, so straight on the panel
  function runMeshD(R) {
    var at = runAt(R), Hn = R.near[2] - R.near[1], cu = R.cell / R.len, du = Hn / (R.cell * 1.24) * cu, d = '';
    function seg(u0, v0, u1, v1) {
      if (u0 > u1) { var tu = u0, tv = v0; u0 = u1; v0 = v1; u1 = tu; v1 = tv; }
      if (u1 <= 0 || u0 >= 1) return;
      if (u0 < 0) { v0 += (v1 - v0) * (0 - u0) / (u1 - u0); u0 = 0; }
      if (u1 > 1) { v1 = v0 + (v1 - v0) * (1 - u0) / (u1 - u0); u1 = 1; }
      var a = at(u0, v0), b = at(u1, v1);
      d += 'M' + n(a[0]) + ' ' + n(a[1]) + 'L' + n(b[0]) + ' ' + n(b[1]);
    }
    for (var c = -du; c <= 1 + cu; c += cu) { seg(c, 0, c + du, 1); seg(c + du, 0, c, 1); }
    return d;
  }
  function fenceRun(S, C, R, key) {
    var at = runAt(R), d = runMeshD(R), s = '', a0 = at(0, 0), a1 = at(1, 0), b0 = at(0, 1), b1 = at(1, 1), k1 = a1[2];
    s += g(stroke(d, C.wire, R.wire * (0.55 + 0.45 * k1)) +
      stroke(d, C.wireHi, R.wire * 0.4, { opacity: 0.6, transform: 'translate(' + n(-R.wire * 0.28) + ' ' + n(-R.wire * 0.28) + ')' }), { filter: S.shadow('s') });
    s += stroke('M' + n(b0[0]) + ' ' + n(b0[1] - R.wire) + 'L' + n(b1[0]) + ' ' + n(b1[1] - R.wire * k1), C.metalDark, R.wire * 0.9);
    var posts = '';
    (R.posts || []).forEach(function (u, i) {
      var t = at(u, 0), b = at(u, 1), w = R.post * t[2];
      posts += poly([[t[0] - w / 2, t[1] - w * 0.5], [t[0] + w / 2, t[1] - w * 0.5], [b[0] + w / 2, b[1] + w * 0.7], [b[0] - w / 2, b[1] + w * 0.7]],
        S.lin('fpost' + key + i, [[0, C.metalLight], [0.35, C.metal], [1, C.metalDark]], 0, 0, 1, 0));
    });
    var h0 = R.rail / 2, h1 = R.rail / 2 * k1;
    var rail = poly([[a0[0], a0[1] - h0], [a1[0], a1[1] - h1], [a1[0], a1[1] + h1], [a0[0], a0[1] + h0]], S.lin('frail' + key, [[0, C.metalLight], [0.4, C.metal], [1, C.metalDark]])) +
      stroke('M' + n(a0[0]) + ' ' + n(a0[1] - h0 * 0.5) + 'L' + n(a1[0]) + ' ' + n(a1[1] - h1 * 0.5), '#FFFFFF', Math.max(1, R.rail * 0.14), { opacity: 0.35 });
    return s + g(posts + rail, { filter: S.shadow('m') });
  }
  // the line a run's foot follows on the panel: y at x
  function footAt(R, x) { return lerp(R.near[2], R.far[2], (x - R.near[0]) / (R.far[0] - R.near[0])); }

  // Short green grass along a slanted foot, in little runs.
  function tuftsAlong(S, x0, x1, yAt, d0, d1, per, seed, size) {
    var p = S.pal, s = '', i = 0;
    for (var x = x0; x < x1; x += 70) {
      var xe = Math.min(x1, x + 70), y = yAt((x + xe) / 2);
      s += K.tufts(S, x, xe, y + d0, y + d1, per, seed + (i++) * 7, p.grassNear, p.grassLight, size);
    }
    return s;
  }

  // A row of long golden grass from x0 to x1, its roots on y = yAt(x): blades about h tall, a seed
  // head on some. `low`: [[x0, x1, k], …] keeps it short where somebody sits (k of its height).
  function grassRow(S, G, x0, x1, yAt, h, gap, seed, low) {
    var r = rng(seed), a = '', b = '', c = '', heads = '';
    for (var x = x0; x < x1; x += gap * (0.55 + r() * 0.9)) {
      var k = 1;
      (low || []).forEach(function (z) { if (x > z[0] && x < z[1]) k = Math.min(k, z[2]); });
      var y = yAt(x) + (r() - 0.5) * h * 0.05, hh = h * k * (0.6 + r() * 0.5), lean = (r() - 0.42) * hh * 0.36, w = Math.max(1.4, h * 0.034) * (0.8 + r() * 0.5);
      var d = K.bladeD(x, y, hh, lean, w), q = r();
      if (q < 0.4) a += d; else if (q < 0.76) b += d; else c += d;
      if (r() < 0.32) heads += K.leafD(x + lean, y - hh * 0.98, h * 0.17, -1.57 + lean / Math.max(1, hh) * 1.3 + (r() - 0.5) * 0.5, Math.max(1.2, h * 0.036));
    }
    return path(c, G.dark, { opacity: 0.92 }) + path(a, G.base) + path(b, G.light, { opacity: 0.95 }) + path(heads, G.seed);
  }

  // The last post: stouter than the others, both rails meeting in its cap.
  function lastPost(S, C, P) {
    var s = post(S, C, P.x, P.top, P.base, P.w) + cap(S, C, P.x, P.top, P.w);
    return g(s, { filter: S.shadow('m'), 'data-part': 'last-post' });
  }

  // The fox's tail: an enormous brush, red-orange, its tip white (app/art/cats.js draws the fox;
  // tests/set-field.test.js checks these still match). From its root (x, y) to its tip, `len` away
  // toward `dir` (+1 right, -1 left) and a little up; fullest in the middle, a soft point at the end.
  var FOX_TAIL = { base: '#e2632a', line: '#7b2d12', light: '#f6975a', tip: '#fffaf0' };
  function foxBrush(S, C, x, y, len, dir) {
    var p = S.pal, t = function (h) { return mix(h, p.shade, C.dim); }, r = rng(Math.round(x + y + len));
    var A0 = [x, y], A1 = [x + dir * len * 0.3, y + len * 0.1], A2 = [x + dir * len * 0.7, y + len * 0.02], A3 = [x + dir * len, y - len * 0.3];
    var L = [], R = [], N = 20, i;
    function at(u) { return K.bez3(A0, A1, A2, A3, u); }
    for (i = 0; i <= N; i++) {
      var u = i / N, q = at(u), q2 = at(Math.min(1, u + 0.02)), q1 = at(Math.max(0, u - 0.02));
      var dx = q2[0] - q1[0], dy = q2[1] - q1[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
      var w = i === N ? 0 : len * (0.035 + 0.17 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.86)), 0.8));
      var jag = i === N ? 1 : (i % 2 ? 1.09 : 0.94) + (r() - 0.5) * 0.05;
      L.push([q[0] - dy / l * w * jag, q[1] + dx / l * w * jag]);
      R.push([q[0] + dy / l * w * jag, q[1] - dx / l * w * jag]);
    }
    var body = K.pts(L.concat(R.slice().reverse())) + 'Z';
    // the white tip: its last third, the edge between the colours a little ragged
    var k0 = Math.round(N * 0.68);
    var tip = K.pts(L.slice(k0).concat(R.slice(k0).reverse())) + 'Z';
    var s = path(body, t(FOX_TAIL.line), { stroke: t(FOX_TAIL.line), 'stroke-width': n(Math.max(2, len * 0.024)), 'stroke-linejoin': 'round' }) +
      path(body, t(FOX_TAIL.base), { 'data-fox': 'tail' }) + path(tip, t(FOX_TAIL.tip), { 'data-fox': 'tip' });
    // the ragged edge where the red meets the white, and lighter strokes of fur along it
    var zig = '', hi = '', e0 = L[k0], e1 = R[k0];
    for (i = 0; i <= 6; i++) { var zx = lerp(e0[0], e1[0], i / 6), zy = lerp(e0[1], e1[1], i / 6), off = (i % 2 ? 1 : -0.2) * len * 0.035; zig += (i ? 'L' : 'M') + n(zx + dir * off) + ' ' + n(zy - off * 0.3); }
    s += path(zig + 'Z', t(FOX_TAIL.base));
    for (i = 3; i < k0 - 2; i += 3) { var a = at(i / N), b = at((i + 1.6) / N); hi += 'M' + n(a[0]) + ' ' + n(a[1] - len * 0.03) + 'L' + n(b[0]) + ' ' + n(b[1] - len * 0.035); }
    s += stroke(hi, t(FOX_TAIL.light), Math.max(1.5, len * 0.022), { opacity: 0.75 });
    return s;
  }

  // `foxTail` (the dogs camera): long golden grass where the path ends at the panel's edge, and the
  // tail going into it, on the side where no cat sits on the path. On this side of the wire, so
  // over the dogs and under the cats.
  function foxExit(S, C, L) {
    var G = goldCols(S, C), right = true, on = {};
    (S.cast || []).forEach(function (m) { if (m && typeof m.at === 'string') on[m.at] = true; });
    if (on['path-right'] && !on['path-left']) right = false;
    var dir = right ? 1 : -1, ex = right ? 1600 : 0, y0 = L.fence.base + 4, s = '';
    function X(d) { return ex - dir * d; }   // d in from the panel's edge
    function span(d0, d1) { return [Math.min(X(d0), X(d1)), Math.max(X(d0), X(d1))]; }
    function flat(y) { return function () { return y; }; }
    // the ground the long grass stands in: gold from the fence's foot down, ragged where the path ends
    var gd = [[X(-40), y0 - 8], [X(196), y0 - 6], [X(232), y0 + 50], [X(206), y0 + 96], [X(250), 1020], [X(-40), 1020]];
    s += path(K.pts(gd) + 'Z', S.linU([[0, mix(G.ground, S.pal.grass, 0.3)], [0.4, G.ground], [1, mix(G.ground, G.dark, 0.4)]], 0, y0, 0, 1000));
    var a = span(-30, 200), b = span(-30, 214), c = span(-30, 236);
    s += grassRow(S, G, a[0], a[1], flat(y0 + 26), 230, 9, 772);
    // the tail, going in: its root already deep in the grass, its white tip the last of him
    s += g(foxBrush(S, C, X(120), y0 + 86, 300, -dir), { filter: S.shadow('s'), 'data-part': 'fox-tail' });
    // the grass he went through, closing over its root
    s += grassRow(S, G, b[0], b[1], flat(y0 + 112), 200, 10, 773) + grassRow(S, G, c[0], c[1], flat(1014), 230, 12, 774);
    // quick dashes where he went
    var dz = '';
    for (var i = 0; i < 3; i++) dz += 'M' + n(X(470 + i * 30)) + ' ' + n(y0 + 4 + i * 36) + 'h' + n(dir * (74 - i * 14));
    s += g(stroke(dz, '#FFFFFF', 6, { opacity: 0.85 }), { 'class': 'pcs-whoosh' });
    return g(s, { 'data-part': 'fox-exit' });
  }

  // ---- chapter 6: Sleet's spot in the long grass, `grass`

  // Where a cast member at anchor `a` is drawn, as scenes.js draws him (the cats' units, a sitting Clan
  // cat's height to the anchor's `h`, and the size band PC.art.sizeBands holds him to): his body and
  // head boxes and his chin, in the world. Null without the character drawings.
  function castEstimate(S, m, a) {
    var fn = art.character;
    if (typeof fn !== 'function' || !m) return null;
    var who = m.who || 'clancat', o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: m.facing || a.face || 'right' };
    if (m.variant != null) o.variant = m.variant;
    if (who === 'player') { o.look = S.look || {}; if (o.look.sex) o.sex = o.look.sex; }
    var ch = null, ref = null;
    try { ch = fn(who, o); ref = fn('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }); } catch (e) { return null; }
    if (!ch || !ch.w || !ch.h || !ref || !ref.h) return null;
    var s = a.h * (m.size > 0 ? +m.size : 1) / ref.h, band = art.sizeBands && art.sizeBands[who];
    if (band) {
      var meas = function (w, pose) {
        var c = fn(w, { pose: pose, mood: 'neutral' }), hb = c && c.headBox;
        if (!c || !hb) return 1;
        return Math.max(1, band.by === 'head' ? ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2 : c.h - hb.y0);
      };
      var ratio = meas(who, band.pose) / meas(band.ref, 'sit');
      s = s * clamp(ratio, band.min, band.max) / ratio;
    }
    var bb = ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h }, hb = ch.headBox || null;
    function W(b) { return [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s]; }
    return { s: s, body: W(bb), head: hb ? W(hb) : null };
  }

  // The long grass over the lower body of whoever is at `grass` (Sleet), drawn just after him. Sitting
  // up (his chin high), it reaches his legs and haunches only, a third of a cat's height, so his chest
  // and head are clear of it (his tail flicking up out of the grass stands as tall as he sits, its curled
  // tip high: it gets the same). Lying low (flat on his belly, hidden), it stands over his lower body,
  // about half as high as he lies, and comes up only to his chin in front of his face: never over his
  // eyes. Never on the Clan's side of the post. Nobody there: nothing (chapter 4's
  // panels never had it).
  function grassCover(S, C, G, B) {
    var a = (S.anchorMap || {}).grass, m = null;
    (S.cast || []).forEach(function (c) { if (!m && c && c.at === 'grass') m = c; });
    if (!a || !m) return '';
    var H = a.h * (m.size > 0 ? +m.size : 1), est = castEstimate(S, m, a), px = B.post.x + B.post.w / 2 + 4;
    var body = est ? est.body : [a.x - H * 0.6, a.y - H, a.x + H * 0.6, a.y], head = est && est.head ? est.head : [a.x - H * 0.2, a.y - H, a.x + H * 0.2, a.y - H * 0.6];
    var chinH = a.y - head[3], upright = chinH > H * 0.75, over = Math.max(H * 0.12, (a.y - body[1]) * 0.45);
    var m0 = H * 0.1, w0 = Math.max(1.6, H * 0.016), x0 = Math.max(px + w0 * 1.4, body[0] - H * 0.08, -40), x1 = Math.min(body[2] + H * 0.08, 1640);
    if (x1 <= x0) return '';
    // how high the grass stands at x: in front of his face no higher than his chin
    function tallAt(x) {
      var t = upright ? Math.min(H * 0.34, chinH) : over;
      return x > head[0] - m0 && x < head[2] + m0 ? Math.min(t, chinH) : t;
    }
    var r = rng(B.seed + 900 + Math.round(a.x)), a1 = '', b1 = '', c1 = '', heads = '', gap = Math.max(5, H * 0.03), top = a.y;
    for (var x = x0; x < x1; x += gap * (0.55 + r() * 0.9)) {
      var tall = tallAt(x);
      // (in front of a chin that lies on the ground, no grass at all)
      if (tall < H * 0.05) continue;
      var seed = r() < 0.22 && tall > H * 0.15 && !(x > head[0] - m0 && x < head[2] + m0), sh = seed ? H * 0.05 : 0;
      // (a blade leans out sideways at its tip; its tip, and the seed head on it, never higher than the grass's top there)
      var y = a.y + H * (0.03 + r() * 0.04), hh = (tall - sh) * (0.78 + r() * 0.22) + (y - a.y), lean = (r() - 0.5) * hh * 0.22, w = w0 * (0.8 + r() * 0.5);
      var d = K.bladeD(x, y, hh, lean, w), q = r();
      if (q < 0.4) a1 += d; else if (q < 0.76) b1 += d; else c1 += d;
      top = Math.min(top, y - hh - sh);
      if (seed) heads += K.leafD(x + lean, y - hh * 0.97, sh, -1.57 + (r() - 0.5) * 0.5, Math.max(1.2, H * 0.011));
    }
    return g(path(c1, G.dark, { opacity: 0.92 }) + path(a1, G.base) + path(b1, G.light, { opacity: 0.95 }) + path(heads, G.seed),
      { 'data-part': 'grass-cover', 'data-top': n(top) });
  }

  /* The border, drawn for one of its three compositions (L.border). Back to front: sky, trees and
   * the field as ever; the fence coming up the path from the left; the verge, the path and its end;
   * the ground the long grass stands in. Over whoever is in the field: the fence running away to
   * the right, the last post, and the grass that grows against it. In front of everyone: the grass
   * at the fox's feet and in the near corner, short where he sits so it never hides him. */
  function drawBorder(S, L) {
    var p = S.pal, C = colors(S), G = goldCols(S, C), B = L.border, back = '', over = '', front = '', i;
    back += skyAndCity(S, C, L) + treeLine(S, L) + field(S, C, L);
    function footL(x) { return footAt(B.left, x); }
    function footR(x) { return footAt(B.right, x); }
    var px = B.post.x;
    // the fence up the path
    back += g(fenceRun(S, C, B.left, 'bl'), { 'data-part': 'fence-left' });
    // the verge under it, and the mown path
    var P = B.path, vg = [[-40, footL(-40) - 4], [px, footL(px) - 4], [px + 40, P.end[0][1]], [P.end[0][0], P.end[0][1] + 4], [-40, P.top[0][1] + 4]];
    back += path(K.pts(vg) + 'Z', S.lin('fbverge', [[0, p.grass], [1, p.grassNear]]));
    var edge = [[-40, P.top[0][1]]].concat(P.top.slice(1)), pd = K.pts(edge);
    for (i = 1; i < P.end.length; i++) pd += 'L' + n(P.end[i][0]) + ' ' + n(P.end[i][1]);
    back += path(pd + 'L-40 1020Z', S.lin('fbpath', [[0, C.pathLight], [0.35, C.path], [1, mix(C.path, C.pathDark, 0.35)]]));
    back += stroke(K.pts(edge), p.rim, 3 * P.k, { opacity: 0.55 });
    var r = rng(P.seed), a = '', b = '', endX = function (y) {
      for (var j = 1; j < P.end.length; j++) if (y <= P.end[j][1]) return lerp(P.end[j - 1][0], P.end[j][0], (y - P.end[j - 1][1]) / (P.end[j][1] - P.end[j - 1][1]));
      return P.end[P.end.length - 1][0];
    };
    for (i = 0; i < P.grit; i++) {
      var gy = P.top[0][1] + 50 + Math.pow(r(), 0.8) * (1000 - P.top[0][1] - 50), gx = r() * (endX(gy) - 20), gk = lerp(0.5, 1.4, (gy - P.top[0][1]) / (1000 - P.top[0][1])) * P.k;
      if (gy < lerp(P.top[0][1], P.top[1][1], gx / P.top[1][0]) + 14) continue;
      if (r() < 0.55) a += blob(gx, gy, 3.2 * gk, 2 * gk, 6, r, 0.3, 0.3); else b += dot(gx, gy, 1.5 * gk);
    }
    back += path(a, C.pathDark, { opacity: 0.45 }) + path(b, C.pathLight, { opacity: 0.9 });
    (P.puddles || []).forEach(function (m, pi) { back += puddle(S, C, m[0], m[1], m[2], m[3], P.seed + 20 + pi * 5); });
    back += tuftsAlong(S, -20, px - 10, footL, 2, B.verge, 5, B.seed, B.tuft);
    // where the path gives way: the ground the long grass stands in, right of the path's end
    var gd = 'M' + n(px - 6) + ' ' + n(footR(px) - 2) + 'L1660 ' + n(footR(1660) - 2) + 'V1020H' + n(P.end[P.end.length - 1][0]);
    for (i = P.end.length - 1; i >= 0; i--) gd += 'L' + n(P.end[i][0]) + ' ' + n(P.end[i][1]);
    back += path(gd + 'Z', S.linU([[0, mix(G.ground, p.grass, 0.25)], [0.3, G.ground], [1, mix(G.ground, G.dark, 0.4)]], 0, footR(px), 0, 1000), { 'data-part': 'long-grass-ground' });
    // stubble and the first tall tufts along the path's end
    var st = '';
    for (i = 0; i < P.end.length - 1; i++) {
      var e0 = P.end[i], e1 = P.end[i + 1];
      for (var u = 0; u < 1; u += 0.2) { var sx = lerp(e0[0], e1[0], u), sy = lerp(e0[1], e1[1], u); for (var bl = 0; bl < 4; bl++) st += K.bladeD(sx - 26 + bl * 9 + r() * 6, sy + 6 + r() * 8, (16 + r() * 16) * B.grassK, (r() - 0.5) * 10, 2.4 * B.grassK); }
    }
    back += path(st, G.stub, { opacity: 0.9 });

    // ---- over whoever is in the field
    over += g(fenceRun(S, C, B.right, 'br'), { 'data-part': 'fence-right' });
    over += lastPost(S, C, B.post);
    over += tuftsAlong(S, px - 30, px + 46, function (x) { return x < px ? footL(x) : footR(x); }, 4, B.verge * 0.8, 4, B.seed + 300, B.tuft * 1.1);
    var rows = '';
    (B.rows || []).forEach(function (q, qi) { rows += grassRow(S, G, q[0], q[1], function (x) { return footR(x) + q[2] + (x - px) * (q[5] || 0); }, q[3] * B.grassK, q[4] * B.grassK, B.seed + 400 + qi * 13); });
    over += g(rows, { filter: S.shadow('s'), 'data-part': 'long-grass' });

    // ---- in front of everyone: grass at the fox's feet and in the near corner, never over him
    var low = [], fa = (S.anchorMap || {}).fox;
    if (fa && (S.cast || []).some(function (m) { return m && m.at === 'fox'; })) low.push([fa.x - fa.h * 0.8, fa.x + fa.h * 1.25, B.frontLow]);
    var fr = '';
    (B.front || []).forEach(function (q, qi) { fr += grassRow(S, G, q[0], q[1], function () { return q[2]; }, q[3] * B.grassK, q[4] * B.grassK, B.seed + 500 + qi * 17, q[5] ? null : low); });
    front += g(fr, { filter: S.shadow('s'), 'data-part': 'long-grass-front' });
    // chapter 6: the long grass over Sleet's lower body at `grass`, drawn just after him
    var gc = grassCover(S, C, G, B);
    if (gc) S.covers.grass = gc;
    return { back: back, over: g(over, { 'data-part': 'fence' }), front: front };
  }

  // ------------------------------------------------------------------ the compositions

  var COMPS = {
    // wide: the whole square behind its fence; the path along the bottom
    main: {
      sky: 640, sun: [1350, 120], sunR: 400,
      clouds: [[260, 158, 250, 72, 3], [720, 96, 150, 44, 4], [1120, 206, 200, 58, 5]],
      plane: [930, 150, 1.05],
      towers: [
        { x: -30, w: 130, top: 300, base: 520, far: 0.78 }, { x: 96, w: 92, top: 352, base: 520, far: 0.82, cap: 'slant' },
        { x: 190, w: 70, top: 392, base: 520, far: 0.86, cap: 'round' }, { x: 1318, w: 96, top: 330, base: 520, far: 0.8, cap: 'round' },
        { x: 1418, w: 142, top: 286, base: 520, far: 0.78, cap: 'step' }, { x: 1556, w: 80, top: 366, base: 520, far: 0.84 }
      ],
      trees: { base: 534, top: 428, bump: 92, seed: 401, round: [[350, 64], [640, 52], [985, 70], [1250, 56]] },
      far: { base: 542, h: 58, cell: 12, step: 190 },
      field: { top: 538, base: 764, tufts: 110, tuft: 0.8, seed: 410 },
      mud: [[830, 652, 360, 52], [800, 744, 770, 22], [250, 592, 140, 22], [1300, 590, 120, 18]],
      holes: [[1330, 640, 30, 8]],
      log: [706, 584, 134, 18],
      puddles: [[700, 664, 88, 13], [1060, 700, 58, 9], [430, 746, 66, 8]],
      prints: [[560, 640, 1040, 668, 9, 1, 3], [180, 742, 640, 748, 8, 1.2, 5], [960, 742, 1440, 738, 8, 1.2, 9]],
      toys: [
        { kind: 'ball', x: 585, y: 702, r: 13, sunk: true }, { kind: 'frisbee', x: 1150, y: 668, rx: 32, ry: 9, bite: -0.9 },
        { kind: 'rope', x: 300, y: 612, len: 52, k: 0.7 }, { kind: 'stick', x: 560, y: 590, len: 62, k: 0.65 }
      ],
      fence: { top: 250, base: 764, cell: 34, wire: 2.5, posts: [80, 560, 1040, 1520], post: 20, rail: 14, verge: 36, tufts: 150, tuft: 1.05, seed: 420 },
      path: { top: 800, k: 1, grit: 260, seed: 430, puddles: [[1300, 900, 118, 17], [230, 968, 92, 13]] },
      front: { tufts: [[-20, 290], [1320, 1620]], y0: 974, y1: 1006, size: 2.3 }
    },
    // dogs: closer and lower, the three dogs along the wire, the cats' path at the bottom
    dogs: {
      sky: 520, sun: [1380, 70], sunR: 360,
      clouds: [[300, 150, 280, 78, 13], [1030, 96, 190, 54, 14]],
      plane: [760, 120, 1.2],
      towers: [
        { x: -40, w: 150, top: 230, base: 452, far: 0.76 }, { x: 104, w: 100, top: 290, base: 452, far: 0.8, cap: 'slant' },
        { x: 1350, w: 120, top: 250, base: 452, far: 0.78, cap: 'round' }, { x: 1476, w: 160, top: 200, base: 452, far: 0.76, cap: 'step' }
      ],
      trees: { base: 474, top: 340, bump: 110, seed: 441, round: [[290, 82], [700, 70], [1110, 90]] },
      far: { base: 484, h: 72, cell: 15, step: 230 },
      field: { top: 480, base: 846, tufts: 130, tuft: 1.05, seed: 450 },
      mud: [[780, 612, 430, 56], [800, 820, 820, 36], [1360, 548, 150, 22]],
      holes: [[300, 596, 40, 10]],
      log: [1004, 546, 150, 20],
      puddles: [[560, 622, 118, 17], [1150, 822, 84, 12], [240, 822, 76, 11]],
      prints: [[620, 590, 1120, 630, 9, 1.3, 13], [120, 820, 700, 826, 9, 1.8, 15], [880, 822, 1500, 816, 9, 1.8, 17]],
      toys: [
        { kind: 'frisbee', x: 450, y: 612, rx: 42, ry: 12, bite: -0.8 }, { kind: 'ball', x: 1010, y: 800, r: 20, sunk: true },
        { kind: 'rope', x: 1240, y: 600, len: 70, k: 0.95 }, { kind: 'stick', x: 1300, y: 720, len: 80, k: 0.9 }
      ],
      fence: { top: 74, base: 846, cell: 52, wire: 3.5, posts: [96, 1504], post: 30, rail: 22, verge: 40, tufts: 150, tuft: 1.4, seed: 460 },
      path: { top: 884, k: 1.3, grit: 200, seed: 470, puddles: [[800, 952, 130, 18]] },
      front: { tufts: [[-20, 330], [1270, 1620]], y0: 978, y1: 1008, size: 2.8 }
    },
    // fence: right up at the wire, low; one dog's nose comes through it, the cats on the path
    fence: {
      sky: 430, sun: [1360, 50], sunR: 340,
      clouds: [[1230, 140, 260, 76, 23], [380, 92, 170, 50, 24]],
      plane: null,
      towers: [{ x: -40, w: 140, top: 210, base: 392, far: 0.78 }, { x: 1440, w: 180, top: 180, base: 392, far: 0.76, cap: 'step' }],
      trees: { base: 412, top: 266, bump: 130, seed: 481, round: [[470, 92], [1180, 104]] },
      far: { base: 424, h: 78, cell: 17, step: 260 },
      field: { top: 420, base: 800, tufts: 110, tuft: 1.3, seed: 490 },
      mud: [[880, 774, 900, 40], [760, 560, 360, 40]],
      holes: [],
      log: [1290, 474, 160, 22],
      puddles: [[1390, 776, 112, 15], [560, 568, 110, 15]],
      prints: [[300, 772, 900, 780, 7, 2.2, 21], [600, 548, 960, 570, 6, 1.2, 23]],
      toys: [{ kind: 'ball', x: 1500, y: 784, r: 30, sunk: true }, { kind: 'frisbee', x: 300, y: 560, rx: 46, ry: 13, bite: -2.2 }],
      fence: { top: -60, base: 800, cell: 104, wire: 6, posts: [190], post: 46, rail: 30, verge: 44, tufts: 130, tuft: 1.9, seed: 500 },
      path: { top: 840, k: 1.6, grit: 170, seed: 510, puddles: [[1240, 950, 150, 20]] },
      front: { tufts: [[-20, 240], [1360, 1620]], y0: 980, y1: 1010, size: 3.2 }
    },
    // border: the fence's far corner from the path, both sides of the last post
    border: {
      sky: 640, sun: [1400, 120], sunR: 400,
      clouds: [[250, 176, 260, 70, 63], [780, 112, 170, 46, 64], [1230, 236, 210, 56, 65]],
      plane: null,
      towers: [{ x: -30, w: 124, top: 372, base: 592, far: 0.8 }, { x: 92, w: 88, top: 424, base: 592, far: 0.84, cap: 'slant' }, { x: 184, w: 70, top: 456, base: 592, far: 0.86, cap: 'round' }],
      trees: { base: 604, top: 500, bump: 100, seed: 601, round: [[330, 60], [640, 50], [905, 64], [1215, 56], [1490, 66]] },
      far: { base: 610, h: 52, cell: 12, step: 200 },
      field: { top: 606, base: 800, tufts: 90, tuft: 0.9, seed: 610 },
      mud: [[520, 704, 300, 34], [1270, 694, 250, 28], [200, 656, 120, 16]],
      holes: [[770, 664, 26, 7]],
      log: [420, 646, 124, 17],
      puddles: [[640, 710, 80, 11], [1400, 702, 66, 9]],
      prints: [[300, 694, 700, 712, 8, 1, 33], [1090, 704, 1500, 694, 7, 1, 35]],
      toys: [{ kind: 'ball', x: 870, y: 722, r: 12, sunk: true }, { kind: 'frisbee', x: 1190, y: 676, rx: 28, ry: 8, bite: -0.9 }],
      border: {
        post: { x: 1000, top: 190, base: 806, w: 30 }, seed: 620, verge: 34, tuft: 1.1, grassK: 1, frontLow: 0.42,
        left: { near: [1000, 198, 792], far: [-60, 304, 740], len: 1250, cell: 44, wire: 2.8, rail: 16, post: 22, posts: [0.3, 0.7] },
        right: { near: [1000, 198, 792], far: [1660, 290, 748], len: 760, cell: 44, wire: 2.8, rail: 16, post: 22, posts: [0.56] },
        path: { top: [[-20, 772], [962, 830]], end: [[962, 830], [1044, 872], [1104, 932], [1144, 1010]], k: 1.1, grit: 230, seed: 630, puddles: [] },
        // rows of long grass behind the fox: [x0, x1, how far below the fence's foot, height, gap, slope]
        rows: [[1016, 1640, 10, 52, 9], [1024, 1640, 44, 84, 11, 0.02], [1050, 1640, 84, 122, 13, 0.05]],
        // and in front of him: [x0, x1, y, height, gap, tall even where he sits]
        front: [[1124, 1640, 968, 96, 14], [1150, 1640, 1012, 150, 16]]
      }
    },
    // border-two: closer, at cat height: shoulder to shoulder on the path, the fox past the post
    'border-two': {
      sky: 700, sun: [1420, 96], sunR: 380,
      clouds: [[300, 150, 300, 80, 73], [1180, 230, 230, 60, 74]],
      plane: null,
      towers: [{ x: -40, w: 150, top: 400, base: 680, far: 0.8 }, { x: 110, w: 100, top: 470, base: 680, far: 0.84, cap: 'round' }],
      trees: { base: 694, top: 560, bump: 130, seed: 641, round: [[420, 84], [760, 70], [1230, 90]] },
      far: { base: 702, h: 70, cell: 16, step: 260 },
      field: { top: 698, base: 840, tufts: 70, tuft: 1.2, seed: 650 },
      mud: [[560, 772, 330, 30], [1330, 768, 260, 26]],
      holes: [],
      log: [330, 728, 150, 20],
      // (no puddle in the field here: the one at [760, 780] lay exactly under Glintstar's chin whenever
      // she faced left, and read as a blue bib; the mud patches stay)
      puddles: [],
      prints: [[300, 768, 700, 780, 6, 1.4, 43]],
      toys: [{ kind: 'frisbee', x: 1220, y: 752, rx: 36, ry: 10, bite: -0.9 }],
      border: {
        post: { x: 1010, top: -40, base: 842, w: 44 }, seed: 660, verge: 44, tuft: 1.6, grassK: 1.6, frontLow: 0.36,
        left: { near: [1010, -70, 826], far: [-60, 96, 778], len: 1150, cell: 70, wire: 4.2, rail: 24, post: 32, posts: [0.5] },
        right: { near: [1010, -70, 826], far: [1660, 60, 788], len: 720, cell: 70, wire: 4.2, rail: 24, post: 32, posts: [] },
        path: { top: [[-20, 812], [972, 866]], end: [[972, 866], [1056, 906], [1108, 960], [1130, 1010]], k: 1.6, grit: 150, seed: 670, puddles: [] },
        rows: [[1030, 1640, 12, 60, 9], [1040, 1640, 50, 96, 11, 0.02]],
        front: [[1130, 1640, 996, 96, 13], [1530, 1640, 1016, 170, 15, true]]
      }
    },
    // border-fox: the fox chest-up among the long grass, the fence running away behind him
    'border-fox': {
      sky: 760, sun: [1440, 110], sunR: 400,
      clouds: [[420, 170, 340, 90, 83], [1240, 300, 260, 70, 84]],
      plane: null,
      towers: [],
      trees: { base: 760, top: 600, bump: 170, seed: 681, round: [[520, 110], [1330, 120]] },
      far: { base: 770, h: 90, cell: 20, step: 330 },
      field: { top: 764, base: 900, tufts: 40, tuft: 1.8, seed: 690 },
      mud: [[1250, 840, 300, 30]],
      holes: [],
      log: null,
      puddles: [],
      prints: [],
      toys: [],
      border: {
        post: { x: 96, top: -60, base: 1010, w: 70 }, seed: 700, verge: 60, tuft: 2.4, grassK: 2.6, frontLow: 0.5,
        left: { near: [96, -200, 1000], far: [-220, -150, 980], len: 300, cell: 124, wire: 6.5, rail: 34, post: 44, posts: [] },
        right: { near: [96, -200, 1000], far: [1700, -40, 870], len: 1500, cell: 124, wire: 6.5, rail: 34, post: 44, posts: [0.62] },
        path: { top: [[-20, 1004], [60, 1006]], end: [[60, 1006], [80, 1012]], k: 2, grit: 0, seed: 710, puddles: [] },
        rows: [[130, 1640, -30, 70, 7, -0.02], [130, 1640, 20, 110, 9]],
        // (nothing in front at the left: that corner is the cats')
        front: [[740, 1640, 1018, 50, 12]]
      }
    }
  };

  function draw(S) {
    var L = COMPS[S.comp] || COMPS.main, p = S.pal, C = colors(S), back = '', over = '', front = '';
    if (L.border) return drawBorder(S, L);
    back += skyAndCity(S, C, L);
    back += treeLine(S, L);
    back += field(S, C, L);
    back += pathway(S, C, L);

    // the near fence goes over everyone in the field
    var W = wirePushes(S, L.fence);
    over += nearFence(S, C, L.fence, W.pushes);
    W.bounces.forEach(function (x) { over += rattle(S, L.fence, x); });
    // chapter 4: the fox's exit, on the path's side of the wire: over the dogs, under the cats
    // (he is never drawn over a cat)
    if (S.opts.foxTail === true && S.comp === 'dogs') over += foxExit(S, C, L);
    // grass in the near corners, kept off any cat sitting on the path there
    var cats = [];
    (S.cast || []).forEach(function (m) {
      var a = m && typeof m.at === 'string' && (m.at === 'path-left' || m.at === 'path-right') ? (S.anchorMap || {})[m.at] : null;
      if (a) cats.push([a.x - a.h * 0.75, a.x + a.h * 0.75]);
    });
    L.front.tufts.forEach(function (t, i) {
      for (var x = t[0]; x < t[1]; x += 70) {
        var x1 = Math.min(t[1], x + 70), hit = cats.some(function (c) { return x1 > c[0] && x < c[1]; });
        if (!hit) front += K.tufts(S, x, x1, L.front.y0, L.front.y1, 4, 520 + i * 31 + Math.round(x), p.grassNear, p.grassLight, L.front.size);
      }
    });
    return { back: back, over: g(over, { 'data-part': 'fence' }), front: g(front, { filter: S.shadow('s') }) };
  }

  var B = { z: 'behind' };
  art.defineSet('field', {
    label: 'the Barking Field', tod: 'day', draw: draw,
    cams: {
      wide: { box: [0, 0, 1600] },
      fence: { box: [0, 0, 1600], comp: 'fence' },
      dogs: { box: [0, 0, 1600], comp: 'dogs' },
      border: { box: [0, 0, 1600], comp: 'border' },
      'border-two': { box: [0, 0, 1600], comp: 'border-two' },
      'border-fox': { box: [0, 0, 1600], comp: 'border-fox' }
    },
    anchors: {
      main: {
        'path-left': A(470, 918, 250), 'path-right': A(1050, 936, 262, 'left'),
        'dog-1': A(320, 752, 150, 'right', B), 'dog-2': A(800, 756, 152, 'left', B), 'dog-3': A(1290, 752, 150, 'left', B),
        field: A(1160, 604, 84, 'left', B)
      },
      dogs: {
        'path-left': A(150, 992, 300), 'path-right': A(1450, 996, 310, 'left'),
        'dog-1': A(400, 832, 225, 'right', B), 'dog-2': A(800, 836, 228, 'left', B), 'dog-3': A(1200, 832, 225, 'left', B),
        field: A(1150, 562, 110, 'left', B)
      },
      fence: {
        'path-left': A(330, 962, 300), 'path-right': A(720, 948, 290),
        'dog-1': A(1080, 786, 245, 'left', B), 'dog-2': A(1460, 770, 210, 'left', B), 'dog-3': A(560, 772, 175, 'right', B),
        field: A(900, 534, 110, 'left', B)
      },
      // chapter 4. The fox sits past the post; the three in front are drawn over the four behind
      // them (z: 'behind') whatever the cast's order; the dogs are behind the wire that runs away.
      // `back-4` (Murmurchime, who brought the news) looks out between Tallyheart's head and
      // Glintstar's chest, clear of Glintstar's raised tail (at x 708 the tail ran down her face in
      // every panel where Glintstar stands); the shaggy dog at `dog-1` is clear of the corner post
      border: {
        fox: A(1296, 928, 246, 'left'), lead: A(812, 934, 258), left: A(392, 916, 250), right: A(600, 958, 262),
        'back-1': A(70, 900, 206, 'right', B), 'back-2': A(226, 872, 204, 'right', B), 'back-3': A(500, 862, 208, 'right', B), 'back-4': A(740, 868, 214, 'right', B),
        'dog-1': A(1164, 776, 160, 'left', B), 'dog-2': A(1344, 764, 154, 'left', B), 'dog-3': A(1510, 752, 148, 'left', B),
        // chapter 6: Sleet in the long grass just past the post, nearer than the fox's spot, his face
        // close enough to talk across the post; low in the panel. Far enough along that every pose he
        // has, stretched flat on his belly too, is past the post. (On the line the other ground spots
        // make, h = 254 + (y - 934) / 3, so a spot of its own gets the depth it always got.)
        grass: A(1445, 970, 266, 'left')
      },
      'border-two': {
        fox: A(1330, 968, 392, 'left'), lead: A(850, 952, 396), left: A(250, 986, 432), right: A(540, 992, 440),
        // the four behind look out past the three in front: two at the left, one in each gap between heads
        'back-1': A(40, 934, 330, 'right', B), 'back-2': A(150, 888, 280, 'right', B), 'back-3': A(408, 900, 300, 'right', B), 'back-4': A(734, 896, 300, 'right', B),
        'dog-1': A(1150, 806, 250, 'left', B), 'dog-2': A(1340, 800, 244, 'left', B), 'dog-3': A(1516, 794, 238, 'left', B),
        // (nearer than the fox's spot, and as big as he can be with every pose of his that stands up
        // past the post and his head inside the panel; `elev`: kept out of the depth a spot of its own
        // gets, which the spots of chapter 4 fix)
        grass: A(1485, 990, 395, 'left', { elev: true })
      },
      // the fox chest-up (his feet are below the panel); `left` and `right` are a corner of a cat in
      // the near edge, drawn bigger than he is, their feet far below the panel: `right` is set for a
      // grown cat (Tallyheart: her ears and eyes over the bottom edge), `left` for an apprentice (our
      // cat: the corner of her face), so each one's head point is just inside the panel and her
      // balloon has somewhere to point. `lead` is the edge of a face at the panel's left, where he is
      // looking. The four behind are out of this camera's sight
      'border-fox': {
        fox: A(1150, 1182, 1100, 'left'), lead: A(-60, 1262, 1120), left: A(-30, 1530, 1120), right: A(282, 1657, 1120),
        'dog-1': A(470, 884, 330, 'right', B), 'dog-2': A(1400, 866, 320, 'left', B), 'dog-3': A(1548, 856, 300, 'left', B),
        // chapter 6: Sleet close, his head about where the fox's was, sitting up or flat on his belly in
        // the grass with his face in the panel, clear of the two corners of cats at the left; the fox is
        // never drawn in his chapter. (`elev`: the corners' depth here is not the grass's, so the spot
        // takes no part in the depth a spot of its own gets)
        grass: A(1260, 1010, 440, 'left', { elev: true })
      }
    },
    opts: { foxTail: [false, true] }, defaults: {}
  });

  // for the tests: where each border composition puts the last post and the two runs of the fence
  art.fieldInfo = function () {
    var out = { border: {}, foxTail: FOX_TAIL };
    Object.keys(COMPS).forEach(function (k) {
      var B = COMPS[k].border;
      if (B) out.border[k] = { post: { x: B.post.x, top: B.post.top, base: B.post.base, w: B.post.w }, left: { near: B.left.near.slice(), far: B.left.far.slice() },
        right: { near: B.right.near.slice(), far: B.right.far.slice() }, pathEnd: B.path.end.map(function (q) { return q.slice(); }), log: !!COMPS[k].log };
    });
    return out;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
