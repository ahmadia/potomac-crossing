/* Potomac Crossing · app/art/sets/roof.js
 *
 * The set: the roof of the tallest tower (chapter 4, "The littlest dragonet"), in the afternoon's
 * gold. Flat and wide, pale grit underfoot, a low wall all the way round. In the middle stands one
 * pole with a small red light that blinks; at one side the little hut with the roof door, propped
 * open with a brick (the riverbank set draws the same hut and mast from far below); a rain puddle
 * (his water). Sky everywhere. Beyond the wall, small and bright: the green patch of camp behind
 * its hedge, the river, the Old Bridge, and the two shiny lines of the track running off behind
 * it all.
 *
 * The height is funny, never frightening (the text's Tone note): the wall is always between
 * everyone and the drop, no anchor is anywhere near it, and nothing here says how far down it is.
 * An airplane (`plane: true`) passes WELL ABOVE the roof, higher than the red light in every
 * camera that shows it, and is never level with the roof or beside it: the `over` and `paw`
 * cameras, whose only sky is level with the roof, never draw one.
 *
 * The light is afternoon gold by default (the `golden` palette, still blue overhead), and for
 * `fx: ['sunset']`; `day`, `morning`, `dusk` and `night` redraw it.
 *
 * Six cameras, each its own composition in the 1600 x 1000 world (docs/build.md, "Chapter 4"):
 *   main  `wide`  the whole roof: the hut and its door at the left, the pole in the middle with the
 *                 dragonet at its foot, the far wall and the view over it.
 *   pole  `pole`  close on whoever sits at the foot of the pole.
 *   two   `two`   cat and dragonet at the same height, the pole behind him, the wall behind both.
 *   over  `over`  from beside the pole, looking out: the wall's top edge across the panel and the
 *                 whole view beyond it. Our cat's spot is at the left here, the dragonet's at the
 *                 pole to her right, and the track comes down the right of the picture past the
 *                 hedge: that is where a claw at `pole` points. The camp is up over their heads,
 *                 never on his claw's line.
 *   sky   `sky`   looking up from the roof's floor: the pole, the red light, and the airplane
 *                 overhead (drawn here unless `plane: false`).
 *   paw   `paw`   close on the one forepaw he holds up, five claws out, at our cat's nose height:
 *                 Squall at `pole` is drawn so big that the forepaw his `pawup` pose raises
 *                 (app/art/cats.js draws it, and lights its claws) is in the middle of the panel,
 *                 and it goes in `keep`. With nobody at `pole` the set draws the forepaw itself,
 *                 reaching up from below (data-claw on each claw), so the picture is never without it.
 *
 * Anchors, in every composition: `pole` (the foot of the pole: the pole stands exactly at its x,
 * as thick as the pole Squall's `hug` holds, and behind him, so his paws and tail lie over it),
 * `beside` (next to it: on its right, except in `over`), `door` (by the hut's door). None at the wall.
 *
 * Options: `plane: true`, `moth: true` (a moth or two round the light), `grit: 'none' | 'paws'`
 * (seven little forepaws scratched in the grit, four above three, five claw marks each: the
 * riddle's picture; they are in `keep`).
 *
 * Registered with PC.art.defineSet (app/art/scenes.js); painters come from PC.art.kit.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});
  var K = art.kit;
  if (!K || !art.defineSet) return;

  var n = K.n, rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke, pts = K.pts, poly = K.poly, g = K.g,
    dot = K.dot, mix = K.mix, lerp = K.lerp, clamp = K.clamp, rng = K.rng, blob = K.blob, mound = K.mound, A = K.anchor;

  // ------------------------------------------------------------------ colours from the palette

  function colors(S) {
    var p = S.pal, dark = S.tod === 'night' || S.tod === 'storm', sk = p.sky, low = sk[sk.length - 1];
    var dim = dark ? 0.55 : S.tod === 'dusk' ? 0.22 : S.tod === 'sunset' ? 0.1 : 0;
    var grit = mix(mix(p.stoneLight, p.sandLight, 0.3), dark ? p.stoneLight : '#EFEAE0', 0.4);
    return {
      dark: dark, dim: dim, low: low,
      grit: grit, gritFar: mix(grit, low, 0.3), gritNear: mix(grit, p.stone, 0.24),
      speck: mix(p.stoneDark, p.stone, 0.3), speckLight: mix(grit, '#FFFFFF', dark ? 0.12 : 0.6),
      groove: mix(p.stoneDark, p.shade, 0.3), grooveHi: mix(grit, '#FFFFFF', dark ? 0.15 : 0.75), seam: mix(p.stone, p.stoneDark, 0.45),
      wall: mix(p.stone, p.stoneLight, 0.3), wallShade: mix(p.stone, p.stoneDark, 0.55), wallLit: mix(p.stoneLight, p.rim, 0.22),
      cap: mix(p.stoneLight, '#FFFFFF', dark ? 0.05 : 0.4), capEdge: mix(p.stone, p.stoneDark, 0.2),
      metal: mix(p.stone, '#B9C2CB', 0.55), metalDark: mix(p.stoneDark, '#56626E', 0.5), metalLight: mix(p.stoneLight, '#FFFFFF', 0.45),
      hut: mix(p.stoneLight, p.sand, 0.22), hutShade: mix(p.stone, p.stoneDark, 0.28), hutLit: mix(p.stoneLight, p.rim, 0.35),
      door: mix('#5F8A8C', p.shade, dim), doorDark: mix('#3C5F62', p.shade, dim), doorLight: mix('#93B8B6', p.shade, dim),
      brick: mix('#B5553B', p.shade, dim), brickTop: mix('#D67B5C', p.shade, dim), brickDark: mix('#8A3B28', p.shade, dim),
      inside: mix(p.shade, '#17131C', 0.45),
      cloud: mix(low, '#FFFFFF', dark ? 0.12 : 0.72), cloudShade: mix(sk[Math.min(2, sk.length - 1)], '#FFFFFF', dark ? 0.04 : 0.3),
      iron: mix(p.shade, p.stoneDark, 0.35), shine: mix('#FFFFFF', p.sun || p.rim, dark ? 0.6 : 0.2)
    };
  }

  // ------------------------------------------------------------------ the sky

  // A flat-bottomed papercut cloud, as over the Barking Field: a shaded under-layer, the body above it.
  function cloud(S, C, x, base, w, h, seed) {
    var d = mound(x - w / 2, x + w / 2, base, base - h, 5, rng(seed), 0.42, 0.28, 0.1);
    return path(d, C.cloudShade, { opacity: 0.9 }) + path(d, C.cloud, { transform: 'translate(0 ' + n(-h * 0.14) + ')' });
  }

  function skyLayer(S, C, L) {
    var p = S.pal, s = K.sky(S, 0, 0, 1600, L.sky, { starDepth: 0.95, seed: 9001 });
    // afternoon gold: still blue overhead, warming to gold toward the wall
    if (S.tod === 'golden') {
      var hh = L.sky * 0.7;
      s += rect(0, 0, 1600, hh, S.linU([[0, '#7FAADD', 0.7], [0.5, '#A6C2E4', 0.32], [1, '#CBD8E8', 0]], 0, 0, 0, hh));
    }
    if (p.sun && L.sun) {
      var R = L.sunR || 480;
      s += circ(L.sun[0], L.sun[1], R, S.radU([[0, p.sun, 0.95], [0.16, p.glow, 0.6], [0.5, p.glow, 0.18], [1, p.glow, 0]], L.sun[0], L.sun[1], R));
      s += circ(L.sun[0], L.sun[1], R * 0.1, p.sun, { opacity: 0.9 });
    }
    if (S.tod !== 'storm') (L.clouds || []).forEach(function (c) { s += cloud(S, C, c[0], c[1], c[2], c[3], c[4]); });
    return s;
  }

  // ------------------------------------------------------------------ the view beyond the wall

  // A tapering ribbon along a polyline: half-widths w0 (first point) to w1 (last).
  function ribbon(P, w0, w1) {
    var L = [], R = [], m = P.length;
    for (var i = 0; i < m; i++) {
      var a = P[Math.max(0, i - 1)], b = P[Math.min(m - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
      var w = lerp(w0, w1, m === 1 ? 0 : i / (m - 1)), nx = -dy / l, ny = dx / l;
      L.push([P[i][0] + nx * w, P[i][1] + ny * w]);
      R.push([P[i][0] - nx * w, P[i][1] - ny * w]);
    }
    return pts(L.concat(R.reverse())) + 'Z';
  }
  // The same polyline moved sideways by d (its left when d > 0).
  function offsetLine(P, d0, d1) {
    var out = [], m = P.length;
    for (var i = 0; i < m; i++) {
      var a = P[Math.max(0, i - 1)], b = P[Math.min(m - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
      var d = lerp(d0, d1, m === 1 ? 0 : i / (m - 1));
      out.push([P[i][0] - dy / l * d, P[i][1] + dx / l * d]);
    }
    return out;
  }
  // A smooth curve through the points (Catmull-Rom), `segs` pieces between each pair.
  function smooth(P, segs) {
    var out = [];
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (var j = 0; j < segs; j++) {
        var t = j / segs, t2 = t * t, t3 = t2 * t, q = [];
        for (var c = 0; c < 2; c++) q.push(0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3));
        out.push(q);
      }
    }
    out.push(P[P.length - 1].slice());
    return out;
  }

  /* The view, in its own units: u across (0 at V.cx), v down from the horizon (V.hz), both times
   * V.s. Far to near: the far shore (v < 16), the river (16 to about 140), the Old Bridge across it
   * (its near end at u 210, v 150), the track running from the bridge off to the right behind the
   * camp (v 150 to 290), the camp (round u -230, v 250) with its hedge along its near side, and under
   * the hedge the garden lawn, which only the `over` camera is high enough to see. Glass towers,
   * lower than this roof, stand all around. Everything the names promise carries a data-view tag. */
  var VIEW = {
    bridge: { near: [210, 150], far: [-30, 14] },
    track: [[210, 150], [300, 186], [430, 220], [600, 246], [820, 264], [1100, 278], [1500, 290], [2600, 304]],
    trackFar: [[-30, 14], [-74, 2], [-140, -8]],
    camp: { u: -230, v: 250, ru: 215, rv: 78 },
    // towers round the camp and along the track, hand-placed: [u, v (roof's far edge), w, d, height]
    towers: [[-610, 196, 118, 26, 150], [-520, 304, 150, 34, 320], [10, 268, 96, 24, 130], [86, 326, 130, 30, 300],
      [470, 300, 130, 30, 300], [690, 326, 150, 34, 320]]
  };
  // A soft rolling skyline from x0 to x1 standing on `base`, up to `amp` high, its humps `wave` wide.
  function hillsD(x0, x1, base, amp, wave, seed) {
    var r = rng(seed), a = r() * 6.28, b = r() * 6.28, c = r() * 6.28, P = [], step = Math.max(6, wave / 14);
    for (var x = x0; x <= x1 + step; x += step) {
      var t = x / wave * 6.283, h = 0.52 + 0.3 * Math.sin(t + a) + 0.13 * Math.sin(t * 2.3 + b) + 0.05 * Math.sin(t * 5.1 + c);
      P.push([x, base - amp * clamp(h, 0.04, 1)]);
    }
    return pts(P) + 'L' + n(x1 + step) + ' ' + n(base) + 'L' + n(x0) + ' ' + n(base) + 'Z';
  }
  // how big things look at depth v (the bridge's far end is small, the camp's hedge big)
  function depthK(v) { return clamp(0.3 + v / 190, 0.3, 2.3); }

  function view(S, C, V) {
    var p = S.pal, s = V.s, x0 = -30, x1 = 1630, bot = V.bottom, out = '', i, r = rng(9100);
    function X(u) { return V.cx + u * s; }
    function Y(v) { return V.hz + v * s; }
    function far(c, t) { return mix(c, p.haze, t); }
    function XY(q) { return [X(q[0]), Y(q[1])]; }
    var night = C.dark, TRACK = V.track || VIEW.track, TOWERS = V.towers || VIEW.towers;
    // how far a point of the view (u, v) is from the track
    function offTrack(u, v) {
      var best = 1e9;
      for (var ti = 1; ti < TRACK.length; ti++) {
        var p0 = TRACK[ti - 1], p1 = TRACK[ti], du = p1[0] - p0[0], dv = p1[1] - p0[1], l2 = du * du + dv * dv || 1;
        var t = clamp(((u - p0[0]) * du + (v - p0[1]) * dv) / l2, 0, 1);
        best = Math.min(best, Math.sqrt(Math.pow(p0[0] + t * du - u, 2) + Math.pow(p0[1] + t * dv - v, 2)));
      }
      return best;
    }

    // ---- the far shore: hills in the haze, a far-off town, a line of trees at the water
    out += rect(x0, Y(-60), x1 - x0, 80 * s, S.linU([[0, p.haze, 0], [1, p.haze, 0.55]], 0, Y(-60), 0, Y(20)));
    out += path(hillsD(x0, x1, Y(18), 44 * s, 620 * s, 9101), far(p.leafMid, 0.7)) + path(hillsD(x0, x1, Y(18), 26 * s, 330 * s, 9103), far(p.leafMid, 0.56));
    var town = '';
    for (i = 0; i < 26; i++) {
      var tu = -2300 + i * 180 + r() * 90, tw0 = 26 + r() * 40, th = 14 + r() * 34;
      if (tu > -180 && tu < 60) continue;   // the bridge lands here
      town += 'M' + n(X(tu)) + ' ' + n(Y(16)) + 'v' + n(-th * s) + 'h' + n(tw0 * s) + 'v' + n(th * s) + 'Z';
    }
    out += path(town, far(p.glassTop, 0.72), { opacity: 0.85 });
    out += path(hillsD(x0, x1, Y(20), 13 * s, 90 * s, 9102), far(p.leaf, 0.46));

    // ---- the river, wide and shining
    var rTop = Y(16), rBot = Y(146);
    out += g(rect(x0, rTop, x1 - x0, rBot - rTop, S.linU([[0, mix(C.low, '#FFFFFF', night ? 0.05 : 0.55)], [0.45, mix(p.water, night ? p.water : '#C4DCF0', 0.6)], [1, mix(p.water, night ? p.water : '#A6C8E8', 0.5)]], 0, rTop, 0, rBot)), { 'data-view': 'river' });
    var gl = '', gl2 = '';
    for (i = 0; i < Math.round(46 * Math.max(0.6, s)); i++) {
      var gy = rTop + 4 * s + r() * (rBot - rTop - 8 * s), gx = x0 + r() * (x1 - x0), gw = (8 + r() * 26) * Math.max(0.5, s) * (0.5 + (gy - rTop) / (rBot - rTop));
      if (r() < 0.6) gl += 'M' + n(gx) + ' ' + n(gy) + 'h' + n(gw); else gl2 += 'M' + n(gx) + ' ' + n(gy) + 'h' + n(gw * 0.7);
    }
    out += stroke(gl, '#FFFFFF', Math.max(1.2, 2.4 * s), { opacity: night ? 0.18 : 0.75, 'class': 'pcs-glint' }) +
      stroke(gl2, mix(p.water, p.shade, 0.3), Math.max(1, 1.8 * s), { opacity: 0.22 });

    // ---- the land this side of it, down to the wall
    var bank = [], bx;
    for (bx = x0; bx <= x1 + 40; bx += 40) bank.push([bx, Y(140) + Math.sin(bx * 0.011 + 1.3) * 5 * s + Math.sin(bx * 0.031) * 2 * s]);
    out += path(pts(bank) + 'L' + n(x1) + ' ' + n(bot + 6) + 'L' + n(x0) + ' ' + n(bot + 6) + 'Z',
      S.linU([[0, far(p.grassFar, 0.42)], [0.5, far(p.grassFar, 0.22)], [1, far(p.grass, 0.1)]], 0, Y(140), 0, Math.max(Y(420), bot)));
    out += stroke(pts(bank), mix(p.sandLight, p.haze, 0.3), Math.max(1.2, 3 * s), { opacity: 0.75 });
    // streets between the blocks, pale and thin; trees dotted along the bank
    var streets = '', trees = '', treeHi = '';
    for (i = 0; i < 9; i++) {
      var su = -2000 + i * 500 + (r() - 0.5) * 120;
      streets += 'M' + n(X(su)) + ' ' + n(Y(150)) + 'L' + n(X(su * 1.5)) + ' ' + n(Y(440));
    }
    streets += 'M' + n(x0) + ' ' + n(Y(350)) + 'L' + n(X(-470)) + ' ' + n(Y(352)) + 'M' + n(X(30)) + ' ' + n(Y(356)) + 'L' + n(x1) + ' ' + n(Y(372));
    out += stroke(streets, mix(p.stoneLight, p.haze, 0.3), Math.max(1.4, 5 * s), { opacity: 0.4, 'stroke-linecap': 'butt' });
    for (i = 0; i < 120; i++) {
      var tv = 152 + Math.pow(r(), 1.3) * 250, tuu = -2300 + r() * 4600, tk = depthK(tv) * s, tr0 = (6 + r() * 5) * tk;
      // not on the track, the camp or the bridge's end
      if (Math.abs(tuu - VIEW.camp.u) < VIEW.camp.ru + 30 && Math.abs(tv - VIEW.camp.v) < VIEW.camp.rv + 80) continue;
      if (offTrack(tuu, tv) < 26 + depthK(tv) * 12) continue;
      trees += blob(X(tuu), Y(tv), tr0 * 1.25, tr0, 7, r, 0.2, 0.3);
      treeHi += dot(X(tuu) - tr0 * 0.3, Y(tv) - tr0 * 0.35, tr0 * 0.4);
    }
    out += path(trees, far(p.leafMid, 0.22)) + path(treeHi, far(p.leafLight, 0.2), { opacity: 0.7 });

    // ---- the Old Bridge: stone legs, an iron truss on top, the track across it
    var BN = VIEW.bridge.near, BF = VIEW.bridge.far, kN = depthK(BN[1]), kF = depthK(BF[1]), rf = kF / kN;
    // t along the bridge in real steps; on the panel its far half is the shorter one
    function bAt(t) { var tp = t / (t + (1 - t) * rf); return { x: lerp(X(BN[0]), X(BF[0]), tp), y: lerp(Y(BN[1]), Y(BF[1]), tp), k: lerp(kN, kF, tp) * s }; }
    var br = '', piers = '', refl = '', truss = '', deck = [], top = [], panels = 9;
    [0.14, 0.36, 0.58, 0.8].forEach(function (t) {
      var q = bAt(t), pw = Math.max(2.2, 5.5 * q.k), ph = Math.max(5, 13 * q.k);
      piers += 'M' + n(q.x - pw) + ' ' + n(q.y) + 'h' + n(pw * 2) + 'v' + n(ph) + 'h' + n(-pw * 2) + 'Z';
      refl += 'M' + n(q.x - pw * 0.9) + ' ' + n(q.y + ph) + 'h' + n(pw * 1.8) + 'l' + n(-pw * 0.3) + ' ' + n(ph * 0.9) + 'h' + n(-pw * 1.2) + 'Z';
    });
    for (i = 0; i <= panels; i++) {
      var q0 = bAt(i / panels);
      deck.push([q0.x, q0.y]);
      if (i < panels) { var qm = bAt((i + 0.5) / panels); top.push([qm.x, qm.y - Math.max(6.5, 17 * qm.k)]); }
    }
    for (i = 0; i < panels; i++) truss += 'M' + n(deck[i][0]) + ' ' + n(deck[i][1]) + 'L' + n(top[i][0]) + ' ' + n(top[i][1]) + 'L' + n(deck[i + 1][0]) + ' ' + n(deck[i + 1][1]);
    var iron = far(C.iron, 0.18);
    br += path(refl, mix(p.water, p.shade, 0.35), { opacity: 0.28 }) + path(piers, far(p.stoneLight, 0.12)) +
      path(ribbon(deck, Math.max(2.2, 3.6 * kN * s), Math.max(1.4, 3.6 * kF * s)), iron) +
      stroke(truss, iron, Math.max(1.5, 1.9 * kN * s * 0.75)) + stroke(pts(top), iron, Math.max(1.9, 2.6 * kN * s * 0.75));

    // ---- the track: a bed of pale stones and two shiny lines, off behind it all
    function rails(design, kA, kB, tag) {
      var P = smooth(design.map(XY), 6), m = P.length;
      // the rails stay two lines however small the view is drawn
      var gA = Math.max(V.gauge || 2.6, 5.2 * kA * s), gB = Math.max(V.gauge || 2.6, 5.2 * kB * s);
      var bed = ribbon(P, gA * 1.5, gB * 1.5), a = offsetLine(P, gA * 0.72, gB * 0.72), b = offsetLine(P, -gA * 0.72, -gB * 0.72);
      var lw = Math.max(V.gauge ? V.gauge * 0.36 : 1.1, 1.7 * Math.min(kA, kB) * s), ties = '';
      if (s > 0.8) for (var j = 0; j < m - 1; j += 1) {
        var e0 = offsetLine(P, gA * 1.25, gB * 1.25)[j], e1 = offsetLine(P, -gA * 1.25, -gB * 1.25)[j];
        ties += 'M' + n(e0[0]) + ' ' + n(e0[1]) + 'L' + n(e1[0]) + ' ' + n(e1[1]);
      }
      return g(path(bed, far(mix(p.stoneDark, p.woodDark, 0.35), 0.12)) + stroke(ties, far(p.woodDark, 0.1), Math.max(1, 2.2 * s), { opacity: 0.6, 'stroke-linecap': 'butt' }) +
        stroke(pts(a), C.shine, lw, { 'data-rail': '1' }) + stroke(pts(b), C.shine, lw, { 'data-rail': '2' }), { 'data-view': tag });
    }
    var trk = rails(TRACK, kN, depthK(TRACK[TRACK.length - 1][1]), 'track');
    // across the bridge, and away on the far shore
    var across = [deck[0], deck[panels]];
    var ga = Math.max(V.gauge ? V.gauge * 0.8 : 1.6, 3.6 * kN * s), gb = Math.max(1, 3.6 * kF * s);
    var onDeck = stroke(pts(offsetLine(across, ga * 0.55, gb * 0.55)), C.shine, Math.max(1, 1.2 * kN * s * 0.8), { opacity: 0.9 }) +
      stroke(pts(offsetLine(across, -ga * 0.55, -gb * 0.55)), C.shine, Math.max(1, 1.2 * kN * s * 0.8), { opacity: 0.9 });
    var beyond = stroke(pts(smooth(VIEW.trackFar.map(XY), 4)), C.shine, Math.max(1, 1.6 * kF * s), { opacity: 0.6 });
    out += beyond + trk + g(br + onDeck, { 'data-view': 'bridge' });
    // a glint where the sun catches the rails, on the stretch of them this panel shows
    if (!night) {
      var seen = smooth(TRACK.map(XY), 6).filter(function (q) { return q[0] > 60 && q[0] < 1540 && q[1] < bot - 20; });
      if (seen.length) {
        var gq = seen[Math.floor(seen.length * 0.6)], gr = Math.max(5, 9 * s);
        out += path(K.sparkleD(gq[0], gq[1] - gr * 0.2, gr), '#FFFFFF', { opacity: 0.9, 'class': 'pcs-glint', 'data-view': 'glint' });
      }
    }

    // ---- the towers: lower than this roof, so their flat tops show; glass below
    var blocks = TOWERS.slice();
    for (i = 0; i < 26; i++) {
      var bu = -2500 + i * 200 + r() * 110, bv = 168 + r() * 190, bw = 90 + r() * 80;
      if (bu + bw > -760 && bu < 1000 && bv < 345) continue;      // the camp, the bridge and the track's first run keep their sky
      // nothing stands on the track, or in front of it
      var onIt = false;
      for (var bq = 0; bq <= 4 && !onIt; bq++) for (var bh2 = 0; bh2 <= 3 && !onIt; bh2++) if (offTrack(bu + bw * bq / 4, bv + bh2 * 60) < 70) onIt = true;
      if (onIt) continue;
      blocks.push([bu, bv, bw, 20 + r() * 16, 150 + r() * 260]);
    }
    blocks.sort(function (a, b) { return a[1] - b[1]; });
    var tw = '';
    blocks.forEach(function (t, bi) {
      var k = depthK(t[1]) * 0.62, tx = X(t[0]), ty = Y(t[1]), w = t[2] * s * k, d = t[3] * s * k, h = t[4] * s * k, hz = clamp((t[1] - 150) / 260, 0, 1);
      var roofC = far(mix(p.stoneLight, p.sandLight, 0.3), 0.3 - hz * 0.2), gTop = far(p.glassTop, 0.5 - hz * 0.3), gBot = far(p.glassBot, 0.45 - hz * 0.3);
      var side = w * 0.2;
      tw += rect(tx, ty + d, w, h, S.linU([[0, gTop], [1, gBot]], 0, ty + d, 0, ty + d + h)) +
        poly([[tx + w, ty + d], [tx + w + side, ty + d * 0.35], [tx + w + side, ty + d * 0.35 + h], [tx + w, ty + d + h]], mix(gBot, p.shade, 0.18)) +
        poly([[tx, ty + d], [tx + side, ty + d * 0.35 - d * 0.65], [tx + w + side, ty + d * 0.35 - d * 0.65], [tx + w + side, ty + d * 0.35], [tx + w, ty + d]], roofC);
      var grid = '';
      for (var fy = ty + d + 7 * s * k * 2.2; fy < Math.min(ty + d + h, bot + 4); fy += 9 * s * k * 2.2) grid += 'M' + n(tx) + ' ' + n(fy) + 'h' + n(w);
      for (var fx = tx + w / 4; fx < tx + w - 1; fx += w / 4) grid += 'M' + n(fx) + ' ' + n(ty + d) + 'v' + n(Math.min(h, bot + 4 - ty - d));
      tw += stroke(grid, p.mullion, Math.max(0.7, 1.1 * s * k), { opacity: 0.22, 'stroke-linecap': 'butt' });
      tw += rect(tx + w - Math.max(1, w * 0.05), ty + d, Math.max(1, w * 0.05), h, p.glassEdge, { opacity: 0.5 });
      if (bi % 3 === 0) tw += rect(tx + w * 0.25, ty + d * 0.1 - d * 0.5, w * 0.22, d * 0.5, mix(roofC, p.stoneDark, 0.3));
    });
    out += g(tw, { 'data-view': 'towers' });

    // ---- the camp: the green patch behind its hedge, the fountain a pale dot in the middle
    var Cm = VIEW.camp, cx = X(Cm.u), cy = Y(Cm.v), ru = Cm.ru * s, rv = Cm.rv * s, camp = '';
    var patch = blob(cx, cy, ru, rv, 14, rng(9111), 0.12, 0.28);
    camp += path(patch, p.rim, { opacity: 0.7, transform: 'translate(0 ' + n(-Math.max(1, 2.4 * s)) + ')' }) + path(patch, far(mix(p.grass, p.leafMid, 0.45), 0.06));
    camp += ell(cx + 10 * s, cy + 4 * s, ru * 0.56, rv * 0.5, far(mix(p.grassLight, p.grass, 0.45), 0.05));
    // brambles arching over the dens, round the clearing
    var br2 = '', holes = '', leaf = '';
    [[-150, -30, 62, 30], [-60, -48, 70, 30], [48, -44, 66, 28], [140, -22, 58, 28], [-168, 20, 52, 26], [156, 22, 50, 24]].forEach(function (b, bi) {
      var mx = cx + b[0] * s, my = cy + b[1] * s + b[3] * s * 0.5;
      br2 += mound(mx - b[2] * s / 2, mx + b[2] * s / 2, my, my - b[3] * s, 5, rng(9120 + bi), 0.34, 0.25, 0.25);
      holes += 'M' + n(mx - 7 * s) + ' ' + n(my) + 'a' + n(7 * s) + ' ' + n(8 * s) + ' 0 0 1 ' + n(14 * s) + ' 0Z';
      leaf += dot(mx - b[2] * s * 0.2, my - b[3] * s * 0.62, Math.max(0.8, 4 * s)) + dot(mx + b[2] * s * 0.15, my - b[3] * s * 0.5, Math.max(0.7, 3 * s));
    });
    camp += path(br2, far(p.leaf, 0.04)) + path(leaf, p.leafLight, { opacity: 0.6 }) + path(holes, mix(p.shade, p.leaf, 0.3), { opacity: 0.85 });
    // mossy paths to the fountain, and the fountain
    camp += stroke('M' + n(cx - 110 * s) + ' ' + n(cy + 12 * s) + 'Q' + n(cx - 50 * s) + ' ' + n(cy + 2 * s) + ' ' + n(cx + 10 * s) + ' ' + n(cy + 6 * s) +
      'Q' + n(cx + 60 * s) + ' ' + n(cy + 14 * s) + ' ' + n(cx + 116 * s) + ' ' + n(cy + 8 * s) + 'M' + n(cx + 10 * s) + ' ' + n(cy + 8 * s) + 'L' + n(cx + 36 * s) + ' ' + n(cy + 62 * s),
      mix(p.stoneLight, p.moss, 0.4), Math.max(1.2, 6 * s), { opacity: 0.7 });
    camp += ell(cx + 10 * s, cy + 6 * s, 20 * s, 8.5 * s, mix(p.stone, p.stoneDark, 0.3)) + ell(cx + 10 * s, cy + 4 * s, 19 * s, 7.5 * s, p.stoneLight) +
      ell(cx + 10 * s, cy + 2 * s, 9 * s, 3.4 * s, mix(p.stoneLight, '#FFFFFF', 0.6));
    // the hedge along its near side, with its gap; the garden lawn under it
    // (the garden is at this tower's own foot: its near side is under the wall, straight below us)
    var hy = cy + rv * 0.98, gapU = 36, ly = Math.max(hy + 74 * s, bot + 8), lk = 1.06 + (ly - hy - 74 * s) / (ru * 9);
    var lawn = 'M' + n(cx - ru * 0.96) + ' ' + n(hy) + 'H' + n(cx + ru * 0.96) + 'L' + n(cx + ru * lk) + ' ' + n(ly) + 'H' + n(cx - ru * lk) + 'Z';
    camp += path(lawn, far(mix(p.grassLight, p.grass, 0.4), 0.04)) +
      stroke('M' + n(cx - 118 * s) + ' ' + n(hy + 44 * s) + 'v' + n(-26 * s), p.mullion, Math.max(1, 2.4 * s), { opacity: 0.8 }) + circ(cx - 118 * s, hy + 16 * s, Math.max(1.4, 4.5 * s), mix(p.lit, '#FFFFFF', 0.4));
    var hd = mound(cx - ru * 0.98, cx + gapU * s - 9 * s, hy + 9 * s, hy - 15 * s, 9, rng(9131), 0.3, 0.12, 0.8) +
      mound(cx + gapU * s + 9 * s, cx + ru * 0.98, hy + 9 * s, hy - 15 * s, 7, rng(9132), 0.3, 0.12, 0.8);
    camp += g(path(hd, p.rim, { opacity: 0.75, transform: 'translate(0 ' + n(-Math.max(0.8, 2 * s)) + ')' }) + path(hd, far(p.leaf, 0.02)), { 'data-view': 'hedge' });
    out += g(camp, { 'data-view': 'camp' });

    // ---- far and bright: a little of the afternoon's haze over all of it
    out += rect(x0, Y(-60), x1 - x0, bot - Y(-60) + 6, S.linU([[0, p.haze, night ? 0.1 : 0.3], [0.5, p.haze, 0.1], [1, p.haze, 0.02]], 0, Y(-20), 0, bot));
    return g(out, { 'data-part': 'view' });
  }

  // ------------------------------------------------------------------ the wall, all the way round

  // Where the line from the vanishing point through (x, y) reaches the panel's side at xe.
  function runTo(vp, x, y, xe) { return y + (y - vp[1]) * (xe - x) / (x - vp[0]); }

  function walls(S, C, L) {
    var W = L.wall, vp = L.vp, cap = W.cap, s = '', x, H = W.foot - W.top;
    var xa = Math.max(W.x0, -40), xb = Math.min(W.x1, 1640);
    // its shadow on the floor: the sun is ahead of us, so the far wall's shade falls our way
    s += rect(xa, W.foot - 1, xb - xa, H * 0.3, S.linU([[0, S.pal.shade, 0.26], [1, S.pal.shade, 0]], 0, W.foot, 0, W.foot + H * 0.3));
    // the far wall, in its own shade, its top bright
    s += rect(xa, W.top, xb - xa, H, S.linU([[0, mix(C.wall, C.wallShade, 0.35)], [1, C.wallShade]], 0, W.top, 0, W.foot));
    var joints = '', step = H * 1.7, drains = '';
    for (x = Math.ceil((xa - W.x0) / step) * step + W.x0 + step * 0.5; x < xb; x += step) joints += 'M' + n(x) + ' ' + n(W.top + 2) + 'V' + n(W.foot);
    s += stroke(joints, C.wallShade, Math.max(1, H * 0.016), { opacity: 0.55, 'stroke-linecap': 'butt' });
    // where the rain runs off: small dark slots at its foot
    (W.drains || []).forEach(function (dx) { drains += 'M' + n(dx - H * 0.14) + ' ' + n(W.foot) + 'v' + n(-H * 0.1) + 'q' + n(H * 0.14) + ' ' + n(-H * 0.08) + ' ' + n(H * 0.28) + ' 0v' + n(H * 0.1) + 'Z'; });
    s += path(drains, mix(C.wallShade, S.pal.shade, 0.6));
    // the side walls, running from the far corners toward us
    if (W.sides !== false) {
      var lt = runTo(vp, W.x0, W.top, -40), lf = runTo(vp, W.x0, W.foot, -40), rt = runTo(vp, W.x1, W.top, 1640), rfo = runTo(vp, W.x1, W.foot, 1640);
      var kL = (lt - vp[1]) / (W.top - vp[1]), kR = (rt - vp[1]) / (W.top - vp[1]);
      // the right wall's shade on the floor
      s += poly([[W.x1, W.foot], [1640, rfo], [1640 - H * 0.5 * kR, rfo], [W.x1 - H * 0.2, W.foot]], S.pal.shade, { opacity: 0.14 });
      s += poly([[W.x0, W.top], [-40, lt], [-40, lf], [W.x0, W.foot]], S.linU([[0, C.wallLit], [1, C.wall]], 0, W.top, 0, lf));
      s += poly([[W.x1, W.top], [1640, rt], [1640, rfo], [W.x1, W.foot]], S.linU([[0, mix(C.wall, C.wallShade, 0.5)], [1, C.wallShade]], 0, W.top, 0, rfo));
      s += poly([[W.x0, W.top - cap], [-40, lt - cap * kL], [-40, lt + cap * 0.5 * kL], [W.x0, W.top + cap * 0.5]], C.cap) +
        poly([[W.x0, W.top + cap * 0.5], [-40, lt + cap * 0.5 * kL], [-40, lt + cap * 0.95 * kL], [W.x0, W.top + cap * 0.95]], C.capEdge);
      s += poly([[W.x1, W.top - cap], [1640, rt - cap * kR], [1640, rt + cap * 0.5 * kR], [W.x1, W.top + cap * 0.5]], C.cap) +
        poly([[W.x1, W.top + cap * 0.5], [1640, rt + cap * 0.5 * kR], [1640, rt + cap * 0.95 * kR], [W.x1, W.top + cap * 0.95]], C.capEdge);
    }
    // the far wall's coping: its top catches the sun, a darker lip under it
    s += rect(xa - 2, W.top - cap, xb - xa + 4, cap * 1.5, C.cap) + rect(xa - 2, W.top + cap * 0.5, xb - xa + 4, cap * 0.45, C.capEdge) +
      rect(xa - 2, W.top - cap, xb - xa + 4, Math.max(1.5, cap * 0.22), '#FFFFFF', { opacity: C.dark ? 0.1 : 0.55 });
    return g(s, { 'data-part': 'wall' });
  }

  // ------------------------------------------------------------------ the floor: pale grit

  function floor(S, C, L) {
    var W = L.wall, vp = L.vp, r = rng(L.seed || 9200), s = '', i, z = L.zoom || 1;
    s += rect(-20, W.foot - 2, 1640, 1024 - W.foot, S.linU([[0, C.gritFar], [0.4, C.grit], [1, C.gritNear]], 0, W.foot, 0, 1000));
    if (1000 - W.foot < 40) return g(s, { 'data-part': 'floor' });
    // the roofing's seams: long strips running away from us, a cross seam or two
    var seams = '', gap = 300 * z;
    for (var xb = vp[0] - gap * 8 + gap * 0.4; xb < vp[0] + gap * 8; xb += gap) {
      var t = (W.foot - vp[1]) / (1000 - vp[1]);
      seams += 'M' + n(vp[0] + (xb - vp[0]) * t) + ' ' + n(W.foot) + 'L' + n(xb) + ' 1000';
    }
    [0.36, 0.7].forEach(function (f) { var y = lerp(W.foot, 1000, f); seams += 'M-20 ' + n(y) + 'H1620'; });
    s += stroke(seams, C.seam, Math.max(1, 1.6 * z), { opacity: 0.2, 'stroke-linecap': 'butt' }) +
      stroke(seams, '#FFFFFF', Math.max(0.8, 1.1 * z), { opacity: C.dark ? 0.04 : 0.3, 'stroke-linecap': 'butt', transform: 'translate(0 ' + n(1.6 * z) + ')' });
    // grit: specks, bigger as they come nearer
    var a = '', b = '', c = '', count = L.specks || 420;
    for (i = 0; i < count; i++) {
      var d = Math.pow(r(), 0.8), gx = r() * 1600, gy = W.foot + 4 + d * (996 - W.foot), gk = lerp(0.55, 1.9, d) * z;
      var k = r();
      if (k < 0.5) a += blob(gx, gy, 2.6 * gk, 1.5 * gk, 5, r, 0.3, 0.3); else if (k < 0.85) b += dot(gx, gy, 1.2 * gk); else c += blob(gx, gy, 4 * gk, 2 * gk, 6, r, 0.3, 0.3);
    }
    s += path(a, C.speck, { opacity: 0.32 }) + path(b, C.speckLight, { opacity: 0.85 }) + path(c, mix(C.speck, C.grit, 0.4), { opacity: 0.35 });
    return g(s, { 'data-part': 'floor' });
  }

  // The rain puddle (his water): sky in it, a damp edge, a glint.
  function puddle(S, C, q) {
    var p = S.pal, cx = q[0], cy = q[1], rx = q[2], ry = q[3], r = rng(Math.round(cx * 3 + cy));
    var damp = blob(cx, cy + ry * 0.1, rx * 1.16, ry * 1.3, 12, rng(Math.round(cx + cy * 7)), 0.16, 0.24), d = blob(cx, cy, rx, ry, 12, r, 0.16, 0.22);
    var sk = p.sky, s = path(damp, mix(C.gritNear, p.stoneDark, 0.35), { opacity: 0.55 });
    s += path(d, S.linU([[0, mix(p.water, C.dark ? p.water : '#BCD6EC', 0.62)], [1, mix(sk[sk.length - 1], '#FFFFFF', C.dark ? 0.05 : 0.5)]], 0, cy - ry, 0, cy + ry));
    s += ell(cx - rx * 0.22, cy - ry * 0.18, rx * 0.46, ry * 0.3, '#FFFFFF', { opacity: C.dark ? 0.12 : 0.5 });
    s += stroke('M' + n(cx - rx * 0.6) + ' ' + n(cy + ry * 0.25) + 'h' + n(rx * 0.34) + 'M' + n(cx + rx * 0.12) + ' ' + n(cy + ry * 0.45) + 'h' + n(rx * 0.3),
      '#FFFFFF', Math.max(1.2, ry * 0.12), { opacity: 0.8, 'class': 'pcs-glint' });
    return g(s, { 'data-part': 'puddle' });
  }

  // ------------------------------------------------------------------ the pole and its red light

  // the little red light, with its glow (as on the riverbank's far view of it); it blinks
  function redLight(S, x, y, r) {
    var night = S.tod === 'night' || S.tod === 'storm' || S.tod === 'dusk', R = r * (night ? 7 : 5);
    var halo = circ(x, y, R, S.radU([[0, '#FF6A5A', night ? 0.7 : 0.55], [0.35, '#FF5A4E', 0.22], [1, '#FF5A4E', 0]], x, y, R));
    var core = circ(x, y, r, '#FF4B3E') + circ(x - r * 0.3, y - r * 0.3, r * 0.4, '#FFD0C8', { opacity: 0.9 });
    return g(halo + core, { 'class': 'pcs-blink', 'data-part': 'light' });
  }

  // The height of a sitting cat in the drawings' own units, and the width of the pole Squall's `hug`
  // is drawn round (app/art/cats.js reports it as `pole.w`, in his box).
  var cal = { fn: null, ref: 200, pole: 13 };
  function calib() {
    var fn = art.character;
    if (cal.fn === fn) return cal;
    cal = { fn: fn, ref: 200, pole: 13 };
    if (typeof fn !== 'function' || fn.placeholder) return cal;
    try { var c = fn('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }); if (c && c.h > 0) cal.ref = c.h; } catch (e) { /* default */ }
    try { var q = fn('squall', { pose: 'hug', mood: 'neutral', facing: 'right' }); if (q && q.pole && q.pole.w > 0) cal.pole = q.pole.w; } catch (e2) { /* default */ }
    return cal;
  }
  // how thick the pole is where someone at anchor `a` holds it
  function poleWidth(a) { var c = calib(); return c.pole * a.h / c.ref; }

  // P: { x, foot, top, w (half-width at the foot), w1 (at the top), r (the light; 0 when the top is out of the panel) }
  function mast(S, C, P) {
    var p = S.pal, x = P.x, w0 = P.w, w1 = P.w1 || P.w * 0.62, s = '', sh = '';
    // its long thin shadow on the grit, toward us and to the left
    sh += poly([[x - w0, P.foot], [x + w0, P.foot], [x - w0 * 10, P.foot + w0 * 5.4], [x - w0 * 12.4, P.foot + w0 * 5.2]], p.shade, { opacity: 0.16 });
    // the foot: a plate bolted down, a collar
    s += ell(x, P.foot, w0 * 2.5, w0 * 0.74, C.metalDark) + ell(x, P.foot - w0 * 0.16, w0 * 2.4, w0 * 0.66, C.metal);
    var bolts = '';
    [-1.75, -0.7, 0.7, 1.75].forEach(function (k) { bolts += dot(x + w0 * k, P.foot - w0 * 0.16 + (Math.abs(k) < 1 ? w0 * 0.34 : 0), w0 * 0.17); });
    s += path(bolts, C.metalDark);
    var shaft = S.linU([[0, C.metalLight], [0.38, C.metal], [1, C.metalDark]], x - w0, 0, x + w0, 0);
    s += poly([[x - w0, P.foot - w0 * 0.2], [x - w1, P.top], [x + w1, P.top], [x + w0, P.foot - w0 * 0.2]], shaft);
    s += rect(x - w0 * 1.3, P.foot - w0 * 1.5, w0 * 2.6, w0 * 1.3, shaft, { rx: w0 * 0.25 });
    // welded rings up its length
    var rings = '', len = P.foot - P.top, gapR = Math.max(w0 * 7, 150);
    for (var y = P.foot - gapR; y > P.top + w1 * 3; y -= gapR) {
      var wy = lerp(w0, w1, (P.foot - y) / len);
      rings += 'M' + n(x - wy * 1.16) + ' ' + n(y) + 'h' + n(wy * 2.32) + 'v' + n(wy * 0.42) + 'h' + n(-wy * 2.32) + 'Z';
    }
    s += path(rings, C.metalDark, { opacity: 0.85 });
    s += stroke('M' + n(x - w0 * 0.5) + ' ' + n(P.foot - w0 * 1.6) + 'L' + n(x - w1 * 0.5) + ' ' + n(P.top + w1), '#FFFFFF', Math.max(1, w1 * 0.3), { opacity: C.dark ? 0.1 : 0.4 });
    var out = sh + g(s, { filter: S.shadow('s'), 'data-part': 'pole' });
    if (P.r > 0) {
      // the lamp: a little cap and cage, the red light in it
      var r = P.r, ly = P.top - r * 1.25, lamp = '';
      lamp += rect(x - w1 * 1.5, P.top - r * 0.3, w1 * 3, r * 0.6, C.metalDark, { rx: r * 0.2 });
      out += g(lamp, { 'data-part': 'lamp' }) + redLight(S, x, ly, r) +
        stroke('M' + n(x - r * 1.05) + ' ' + n(P.top - r * 0.3) + 'V' + n(ly - r * 0.4) + 'Q' + n(x - r * 1.05) + ' ' + n(ly - r * 1.35) + ' ' + n(x) + ' ' + n(ly - r * 1.35) +
          'Q' + n(x + r * 1.05) + ' ' + n(ly - r * 1.35) + ' ' + n(x + r * 1.05) + ' ' + n(ly - r * 0.4) + 'V' + n(P.top - r * 0.3), C.metalDark, Math.max(1, r * 0.2), { opacity: 0.8 });
      (S.keep = S.keep || []).push({ x: x - r * 3, y: ly - r * 3, w: r * 6, h: r * 6 });
    }
    return out;
  }

  // ------------------------------------------------------------------ the hut with the roof door

  /* The little hut over the stairs. H: { x (its front's left), foot (its front's foot), w, h,
   * side (how far its right side shows, toward the vanishing point), vp }. The door is in the front
   * wall, hinged at its left and swung out toward us, a brick at its foot keeping it open. */
  function hut(S, C, H) {
    var p = S.pal, x = H.x, f = H.foot, w = H.w, h = H.h, vp = H.vp, s = '', k = w / 350;
    var sx = H.side, top = f - h;
    function back(yy) { return yy + (vp[1] - yy) * (sx / (vp[0] - (x + w))); }
    // its shade on the grit
    s += poly([[x - 4, f], [x + w, f], [x + w - 70 * k, f + 44 * k], [x - 150 * k, f + 40 * k]], p.shade, { opacity: 0.16 });
    // the side that catches the sun
    s += poly([[x + w, top], [x + w + sx, back(top)], [x + w + sx, back(f)], [x + w, f]], S.linU([[0, C.hutLit], [1, mix(C.hutLit, C.hut, 0.6)]], 0, top, 0, f));
    // the front, in its own shade
    s += rect(x, top, w, h, S.linU([[0, mix(C.hut, C.hutShade, 0.45)], [1, C.hutShade]], 0, top, 0, f));
    var boards = '';
    for (var by = top + 46 * k; by < f - 8; by += 46 * k) boards += 'M' + n(x) + ' ' + n(by) + 'h' + n(w);
    s += stroke(boards, mix(C.hutShade, p.shade, 0.25), Math.max(0.8, 1.4 * k), { opacity: 0.3, 'stroke-linecap': 'butt' });
    // the flat lid, a little wider than the walls
    s += poly([[x - 12 * k, top - 16 * k], [x + w + 12 * k, top - 16 * k], [x + w + sx + 10 * k, back(top) - 15 * k], [x + w + sx + 10 * k, back(top) + 3 * k], [x + w + 12 * k, top + 4 * k], [x - 12 * k, top + 4 * k]], mix(C.metal, C.hut, 0.4));
    s += rect(x - 12 * k, top - 16 * k, w + 24 * k, 5 * k, '#FFFFFF', { opacity: C.dark ? 0.08 : 0.45 });
    // a little lamp over the door (out, by day), a pipe up the wall
    var dw = 124 * k, dh = 300 * k, dx = x + w * 0.44, dTop = f - dh;
    s += rect(dx + dw * 0.36, dTop - 34 * k, dw * 0.28, 15 * k, C.metalDark, { rx: 4 * k }) + ell(dx + dw * 0.5, dTop - 17 * k, dw * 0.1, 6 * k, mix(p.lit, C.hut, 0.5));
    s += stroke('M' + n(x + w * 0.9) + ' ' + n(f) + 'V' + n(top + 30 * k) + 'q0 ' + n(-10 * k) + ' ' + n(10 * k) + ' ' + n(-10 * k), C.metalDark, Math.max(1.5, 6 * k), { opacity: 0.75 });
    // the doorway: dark, the top of the stairs just showing, a rail going down
    s += rect(dx - 7 * k, dTop - 7 * k, dw + 14 * k, dh + 7 * k, mix(C.metal, C.metalDark, 0.5));
    s += rect(dx, dTop, dw, dh, S.linU([[0, C.inside], [1, mix(C.inside, p.wood, 0.22)]], 0, dTop, 0, f));
    var steps = '';
    [[0.86, 0.06], [0.74, 0.16], [0.62, 0.26]].forEach(function (st) { steps += 'M' + n(dx + dw * st[1]) + ' ' + n(dTop + dh * st[0]) + 'H' + n(dx + dw); });
    s += stroke(steps, mix(p.stone, C.inside, 0.45), Math.max(1.2, 5 * k), { opacity: 0.7, 'stroke-linecap': 'butt' }) +
      stroke('M' + n(dx + dw * 0.78) + ' ' + n(dTop + dh * 0.5) + 'L' + n(dx + dw * 0.3) + ' ' + n(dTop + dh * 0.86), mix(C.metalLight, C.inside, 0.5), Math.max(1.2, 4 * k), { opacity: 0.6 });
    // the door, swung out to the left, its outside toward us: a kick plate, a push bar, a small pane
    var ox = dx - 62 * k, oy = 34 * k, leaf = [[dx, dTop], [ox, dTop - 5 * k], [ox, f + oy], [dx, f]];
    function onLeaf(u, v) { return [lerp(dx, ox, u), lerp(lerp(dTop, dTop - 5 * k, u), lerp(f, f + oy, u), v)]; }
    var door = poly(leaf, S.linU([[0, C.doorLight], [1, C.door]], ox, 0, dx, 0)) +
      poly([onLeaf(0.16, 0.1), onLeaf(0.84, 0.1), onLeaf(0.84, 0.3), onLeaf(0.16, 0.3)], mix(p.glassTop, C.doorDark, 0.35)) +
      poly([onLeaf(0.06, 0.82), onLeaf(0.94, 0.82), onLeaf(0.94, 0.97), onLeaf(0.06, 0.97)], C.doorDark, { opacity: 0.6 }) +
      stroke(pts([onLeaf(0.14, 0.52), onLeaf(0.86, 0.52)]), C.metalLight, Math.max(1.5, 6 * k)) +
      stroke(pts([[ox, dTop - 5 * k], [ox, f + oy]]), C.doorDark, Math.max(1, 3 * k)) + stroke(pts([[dx, dTop], [dx, f]]), C.doorDark, Math.max(1, 2.4 * k), { opacity: 0.7 });
    s += g(door, { 'data-part': 'door' });
    // the brick that props it: on the grit against the door's foot
    var bx = ox - 30 * k, byy = f + oy + 2 * k, bw = 44 * k, bh = 17 * k, bd = 12 * k;
    var brick = ell(bx + bw * 0.5, byy + bh * 0.2, bw * 0.7, bh * 0.5, p.shade, { opacity: 0.22 }) +
      rect(bx, byy - bh, bw, bh, C.brick) + poly([[bx, byy - bh], [bx + bd, byy - bh - bd * 0.6], [bx + bw + bd, byy - bh - bd * 0.6], [bx + bw, byy - bh]], C.brickTop) +
      poly([[bx + bw, byy - bh], [bx + bw + bd, byy - bh - bd * 0.6], [bx + bw + bd, byy - bd * 0.6], [bx + bw, byy]], C.brickDark) +
      path(dot(bx + bw * 0.28 + bd * 0.5, byy - bh - bd * 0.3, bh * 0.13) + dot(bx + bw * 0.52 + bd * 0.5, byy - bh - bd * 0.3, bh * 0.13) + dot(bx + bw * 0.76 + bd * 0.5, byy - bh - bd * 0.3, bh * 0.13), C.brickDark, { opacity: 0.8 });
    s += g(brick, { 'data-part': 'brick' });
    return s;
  }

  // ------------------------------------------------------------------ seven little forepaws in the grit

  /* The riddle's picture, scratched by one small claw: seven forepaws, four above three, a palm and
   * five claw marks each (as Sprinkle drew six in the mud; the Counts picture `kind: 'grit'` is the
   * same drawing from straight above). G: [cx, cy, k, squash] (the floor's foreshortening). */
  function gritPaws(S, C, G) {
    var cx = G[0], cy = G[1], k = G[2], sq = G[3], r = rng(9300), gapX = 128, rowY = [-46, 50], all = '', tagged = '';
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    function W(px, py) {
      var q = [cx + px * k, cy + py * k * sq];
      x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
      return q;
    }
    function d2(list) { return pts(list.map(function (q) { return W(q[0], q[1]); })); }
    for (var row = 0; row < 2; row++) {
      var cnt = row === 0 ? 4 : 3;
      for (var i = 0; i < cnt; i++) {
        var ox = (i - (cnt - 1) / 2) * gapX + (r() - 0.5) * 8, oy = rowY[row] + (r() - 0.5) * 6, tilt = (r() - 0.5) * 0.2, claws = '';
        var rot = function (px, py) { return [ox + px * Math.cos(tilt) - py * Math.sin(tilt), oy + px * Math.sin(tilt) + py * Math.cos(tilt)]; };
        // the palm: a rounded groove
        var palm = [];
        for (var a = 0; a < 16; a++) { var t = Math.PI * 2 * a / 16; palm.push(rot(Math.cos(t) * 27, 6 + Math.sin(t) * 22)); }
        var pd = d2(palm) + 'Z';
        all += pd;
        // five claw marks, fanned over it
        for (var j = 0; j < 5; j++) {
          var an = (-146 + 112 * j / 4) * Math.PI / 180, wob = (r() - 0.5) * 3;
          var cd = d2([rot(Math.cos(an) * 36, 2 + Math.sin(an) * 34), rot(Math.cos(an) * 60 + wob, 2 + Math.sin(an) * 58)]);
          all += cd;
          claws += '<path d="' + cd + '" data-claw="grit"/>';
        }
        tagged += '<g data-paw="grit"><path d="' + pd + '"/>' + claws + '</g>';
      }
    }
    var lw = Math.max(1.6, 5.2 * k * Math.sqrt(sq + 0.2));
    // each scratch: a dark groove, its far edge catching the light
    var s = stroke(all, C.grooveHi, lw * 0.5, { opacity: C.dark ? 0.4 : 0.9, transform: 'translate(' + n(lw * 0.32) + ' ' + n(lw * 0.34) + ')' }) +
      g(tagged, { fill: 'none', stroke: C.groove, 'stroke-width': n(lw), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'data-part': 'grit-paws' });
    (S.keep = S.keep || []).push({ x: x0 - lw * 2, y: y0 - lw * 2, w: x1 - x0 + lw * 4, h: y1 - y0 + lw * 4 });
    return s;
  }

  // ------------------------------------------------------------------ the one forepaw he holds up

  // Squall's scales (app/art/cats.js draws him; tests/set-roof.test.js checks these still match):
  // slate, the dark blue-grey of a storm cloud, matte and ridged, yellow flecks like sparks, pale claws.
  var SQUALL_PAW = { base: '#5f6c7e', line: '#28303c', light: '#8a97a9', ridge: '#74818f', fleck: '#f6d24e', claw: '#f4ecd9', clawLine: '#6f6857' };

  // A paw's own frame: u along it (the digits at +u), v across; (ox, oy) the middle of its palm,
  // `a` the way the digits point (radians), s its width.
  function pawFrame(ox, oy, a, s) {
    var ca = Math.cos(a), sa = Math.sin(a);
    return function (u, v) { return [ox + (u * ca - v * sa) * s, oy + (u * sa + v * ca) * s]; };
  }
  function ovalP(X, u0, v0, ru, rv, k) {
    var P = [];
    for (var i = 0; i < k; i++) { var t = Math.PI * 2 * i / k; P.push(X(u0 + Math.cos(t) * ru, v0 + Math.sin(t) * rv)); }
    return P;
  }
  function digitP(X, f, r0, r1, w0, w1) {
    var cu = Math.cos(f), cv = Math.sin(f), nu = -cv, nv = cu, P = [X(cu * r0 + nu * w0, cv * r0 + nv * w0)];
    for (var i = 0; i <= 6; i++) {
      var a = Math.PI / 2 - Math.PI * i / 6, su = Math.sin(a) * w1, fu = Math.cos(a) * w1;
      P.push(X(cu * (r1 + fu) + nu * su, cv * (r1 + fu) + nv * su));
    }
    P.push(X(cu * r0 - nu * w0, cv * r0 - nv * w0));
    return P;
  }
  function clawP(X, f, r0, r1, w, bend) {
    var cu = Math.cos(f), cv = Math.sin(f), u0 = cu * r0, v0 = cv * r0, u1 = cu * r1, v1 = cv * r1;
    var l = r1 - r0, nu = -cv, nv = cu, b = bend * l, um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
    return [X(u0 + nu * w, v0 + nv * w), X(um + nu * (w * 0.5 + b), vm + nv * (w * 0.5 + b)), X(u1 + nu * b * 0.6, v1 + nv * b * 0.6),
      X(um - nu * (w * 0.5 - b), vm - nv * (w * 0.5 - b)), X(u0 - nu * w, v0 - nv * w)];
  }

  /* The forepaw, big and near: a broad palm, five digits fanned like a hand, a pale claw on each,
   * the foreleg tapering away to `from` ([x, y]: his shoulder, or the panel's edge). B: { palm:
   * [x, y], ang (degrees), w, from, far (the foreleg's half-width at `from`) }. */
  var PAW_DIGITS = [-0.8, -0.4, 0, 0.4, 0.8];
  function bigPaw(S, C, B) {
    var D = SQUALL_PAW, dim = C.dim, sW = B.w, X = pawFrame(B.palm[0], B.palm[1], B.ang * Math.PI / 180, sW), lw = Math.max(2, sW * 0.012);
    var base = mix(D.base, S.pal.shade, dim), line = mix(D.line, S.pal.shade, dim), light = mix(D.light, S.pal.shade, dim), ridge = mix(D.ridge, S.pal.shade, dim);
    var shapes = [], claws = [], knuckles = '', i, box = [1e9, 1e9, -1e9, -1e9];
    function grow(P) { P.forEach(function (q) { box = [Math.min(box[0], q[0]), Math.min(box[1], q[1]), Math.max(box[2], q[0]), Math.max(box[3], q[1])]; }); return P; }
    // the foreleg: from the wrist back to where it comes from, thinner the further away
    var wr = X(-0.34, 0), fx = B.from[0], fy = B.from[1], ax = wr[0] - fx, ay = wr[1] - fy, al = Math.sqrt(ax * ax + ay * ay) || 1, nx = -ay / al, ny = ax / al;
    var wN = sW * 0.27, wF = B.far, arm = [[wr[0] + nx * wN, wr[1] + ny * wN], [fx + nx * wF, fy + ny * wF], [fx - nx * wF, fy - ny * wF], [wr[0] - nx * wN, wr[1] - ny * wN]];
    var ridges = '', flecks = '', rr = rng(9400), steps = Math.max(3, Math.round(al / (sW * 0.16)));
    for (i = 1; i < steps; i++) {
      var t = i / steps, mx = lerp(wr[0], fx, t), my = lerp(wr[1], fy, t), ww = lerp(wN, wF, t) * 0.92, bow = sW * 0.05 * (1 - t * 0.6);
      ridges += 'M' + n(mx + nx * ww) + ' ' + n(my + ny * ww) + 'Q' + n(mx + ax / al * bow) + ' ' + n(my + ay / al * bow) + ' ' + n(mx - nx * ww) + ' ' + n(my - ny * ww);
      if (i % 2) { var fo = (rr() - 0.5) * ww * 1.2; flecks += dot(mx + nx * fo - ax / al * sW * 0.07, my + ny * fo - ay / al * sW * 0.07, Math.max(1.6, sW * 0.017 * (1 - t * 0.5))); }
    }
    PAW_DIGITS.forEach(function (f, di) {
      var r1 = di === 0 || di === 4 ? 0.6 : 0.7, cu = Math.cos(f), cv = Math.sin(f), nu = -cv, nv = cu;
      shapes.push(grow(digitP(X, f, 0.18, r1, 0.105, 0.082)));
      [0.42, 0.56].forEach(function (rk) {
        if (rk > r1 - 0.06) return;
        var a = X(cu * rk + nu * 0.075, cv * rk + nv * 0.075), m = X(cu * (rk + 0.04), cv * (rk + 0.04)), b = X(cu * rk - nu * 0.075, cv * rk - nv * 0.075);
        knuckles += 'M' + n(a[0]) + ' ' + n(a[1]) + 'Q' + n(m[0]) + ' ' + n(m[1]) + ' ' + n(b[0]) + ' ' + n(b[1]);
      });
      claws.push(grow(clawP(X, f, r1 + 0.03, r1 + 0.36, 0.06, 0.1)));
    });
    shapes.push(grow(ovalP(X, -0.02, 0, 0.4, 0.44, 24)));
    // sparks on the back of the paw
    [[0.06, -0.2], [-0.16, 0.14], [0.2, 0.12], [-0.05, -0.02]].forEach(function (q, qi) { var c = X(q[0], q[1]); flecks += dot(c[0], c[1], Math.max(1.8, sW * (qi % 2 ? 0.016 : 0.022))); });
    var s = '', all = [arm].concat(shapes);
    all.forEach(function (P) { s += path(pts(P) + 'Z', line, { stroke: line, 'stroke-width': n(lw * 2), 'stroke-linejoin': 'round', 'data-paw': 'squall' }); });
    s += path(pts(arm) + 'Z', S.linU([[0, base], [1, mix(base, line, 0.3)]], wr[0], wr[1], fx, fy)) + stroke(ridges, mix(ridge, line, 0.35), lw * 1.3, { opacity: 0.8 });
    shapes.forEach(function (P) { s += path(pts(P) + 'Z', base); });
    s += stroke(knuckles, mix(ridge, line, 0.35), lw * 1.3, { opacity: 0.85 }) + path(pts(ovalP(X, -0.06, -0.12, 0.22, 0.14, 14)) + 'Z', light, { opacity: 0.3 });
    s += path(flecks, mix(D.fleck, S.pal.shade, dim * 0.6), { 'data-fleck': 'squall' });
    claws.forEach(function (P) {
      s += path(pts(P) + 'Z', mix(D.claw, S.pal.shade, dim * 0.5), { stroke: mix(D.clawLine, S.pal.shade, dim), 'stroke-width': n(Math.max(1.6, lw)), 'stroke-linejoin': 'round', 'data-claw': 'squall' });
    });
    // the palm and its claws are what the panel is about
    (S.keep = S.keep || []).push({ x: box[0] - 10, y: box[1] - 10, w: box[2] - box[0] + 20, h: box[3] - box[1] + 20 });
    return g(s, { filter: S.shadow('m'), 'data-part': 'forepaw' });
  }

  // ------------------------------------------------------------------ the compositions

  var COMPS = {
    // wide: the whole roof. A sitting cat is 150 tall at the pole; the horizon is at 392
    main: {
      sky: 560, sun: [1330, 200], sunR: 520, vp: [800, 378], zoom: 1, specks: 460, seed: 9201,
      clouds: [[330, 168, 300, 68, 3], [1040, 104, 200, 46, 4], [1530, 318, 230, 52, 5]],
      view: { hz: 378, cx: 1030, s: 0.4, bottom: 610, gauge: 4.4 },
      wall: { x0: 240, x1: 1360, top: 512, foot: 614, cap: 12, drains: [620, 1180] },
      pole: { x: 800, foot: 806, top: 214, taper: 0.62, r: 8 },
      hut: { x: 96, foot: 704, w: 350, h: 410, side: 46 },
      puddle: [1180, 746, 124, 19],
      paws: [800, 912, 0.5, 0.5],
      plane: [520, 104, 3.3],
      moths: [[840, 222, 110], [768, 262, 90]]
    },
    // pole: close on whoever is at its foot; the wall behind, the sky over it
    pole: {
      sky: 470, sun: [1400, 150], sunR: 500, vp: [800, 452], zoom: 2.6, specks: 240, seed: 9202,
      clouds: [[290, 200, 340, 76, 13], [1190, 132, 250, 56, 14]],
      wall: { x0: -500, x1: 2100, top: 432, foot: 566, cap: 22, sides: false, drains: [420, 1330] },
      pole: { x: 800, foot: 930, top: -60, taper: 0.95, r: 0 },
      puddle: [1350, 668, 200, 24],
      paws: [1040, 972, 0.6, 0.42],
      plane: [470, 112, 4.4],
      moths: [[1010, 330, 420], [640, 230, 360]]
    },
    // two: cat and dragonet at the same height
    two: {
      sky: 500, sun: [1410, 170], sunR: 520, vp: [850, 480], zoom: 2.4, specks: 250, seed: 9203,
      clouds: [[330, 210, 330, 74, 23], [1010, 120, 230, 52, 24]],
      wall: { x0: -500, x1: 2100, top: 456, foot: 584, cap: 21, sides: false, drains: [900] },
      pole: { x: 640, foot: 904, top: -60, taper: 0.94, r: 0 },
      hut: { x: -350, foot: 720, w: 420, h: 840, side: 60 },
      puddle: [1370, 700, 190, 24],
      paws: [850, 950, 0.8, 0.42],
      plane: [1130, 112, 4.4],
      moths: [[812, 418, 300], [498, 300, 260]]
    },
    // over: looking out over the wall from beside the pole; the view is the picture
    over: {
      sky: 230, sun: [1290, 60], sunR: 440, vp: [800, 160], zoom: 2.2, specks: 150, seed: 9204,
      clouds: [[380, 76, 250, 44, 33]],
      // here the track comes down the right of the picture, nearer: where a claw at the pole points
      view: { hz: 160, cx: 1010, s: 1.1, bottom: 700,
        track: [[210, 150], [280, 190], [340, 240], [400, 300], [450, 370], [490, 440], [520, 520], [545, 600]],
        towers: [[-560, 180, 110, 26, 150], [-650, 262, 130, 30, 260], [20, 262, 96, 24, 130], [96, 336, 124, 30, 300]] },
      wall: { x0: -500, x1: 2100, top: 690, foot: 786, cap: 22, sides: false, drains: [1010] },
      pole: { x: 470, foot: 986, top: -60, taper: 0.94, r: 0 },
      puddle: [1190, 884, 170, 22],
      paws: [880, 938, 0.6, 0.44],
      moths: [[640, 600, 230], [380, 520, 200]]
    },
    // sky: looking up from the floor; the airplane overhead, well above the light
    sky: {
      sky: 1000, sun: [1420, 800], sunR: 640, vp: [640, 930], zoom: 2, specks: 0, seed: 9205,
      clouds: [[250, 470, 330, 72, 43], [1270, 610, 300, 66, 44], [900, 800, 230, 50, 45]],
      wall: { x0: -500, x1: 2100, top: 872, foot: 972, cap: 20, sides: false },
      pole: { x: 640, foot: 990, top: 384, taper: 0.4, r: 9 },
      // (at the upper left, below the caption: the page letters the roar at the top right, and at
      // [980, 188, 8.2] the ROOOOAAAR lay across the fuselage and its row of windows)
      plane: [300, 222, 7], planeOn: true,
      moths: [[706, 352, 210], [572, 420, 180]]
    },
    // paw: close on the forepaw he holds up, at our cat's nose height
    paw: {
      sky: 540, sun: [1440, 180], sunR: 540, vp: [800, 500], zoom: 3, specks: 200, seed: 9206,
      clouds: [[520, 150, 320, 68, 53]],
      wall: { x0: -500, x1: 2100, top: 474, foot: 616, cap: 24, sides: false, drains: [760] },
      pole: { x: 520, foot: 975, top: -60, taper: 0.96, r: 0 },
      forepaw: { palm: [806, 610], ang: -90, w: 230 },
      moths: [[1040, 250, 420], [330, 190, 360]]
    }
  };

  // scenes.js holds Squall to our cat's size ("a dragon no bigger than you"): sitting, the top of his
  // head no higher than hers. The same measure here, so `keep` lands on his forepaw as it is drawn.
  function sizeCap(S, who) {
    if (who !== 'squall') return 1;
    try {
      var me = art.character('squall', { pose: 'sit', mood: 'neutral' }), her = art.character('player', { pose: 'sit', mood: 'neutral', look: S.look || {}, sex: (S.look || {}).sex });
      if (me && her && me.headBox && her.headBox) return Math.min(1, (her.h - her.headBox.y0) / (me.h - me.headBox.y0));
    } catch (e) { /* as drawn */ }
    return 1;
  }
  // Whoever is at the pole in this panel (the first of them), or null.
  function atPole(S) {
    var m = null;
    (S.cast || []).forEach(function (c) { if (!m && c && c.at === 'pole') m = c; });
    return m;
  }
  // The forepaw the one at the pole is holding up, as scenes.js will draw it: [x, y, r] in the
  // world, from the `paw` his drawing reports (Squall's `pawup`); null when none is raised.
  function raisedPaw(S, a) {
    var m = atPole(S), fn = art.character;
    if (!m || !a || typeof fn !== 'function' || fn.placeholder) return null;
    var face = m.facing || a.face || 'right', ch;
    try { ch = fn(m.who || 'clancat', { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: face }); } catch (e) { return null; }
    if (!ch || !ch.paw || !(ch.w > 0) || !(ch.h > 0)) return null;
    var k = a.h / calib().ref * (m.size > 0 ? +m.size : 1) * sizeCap(S, m.who);
    return [a.x + (ch.paw.x - ch.w / 2) * k, a.y + (ch.paw.y - ch.h) * k, ch.paw.r * k];
  }

  function draw(S) {
    var L = COMPS[S.comp] || COMPS.main, C = colors(S), o = S.opts, back = '', front = '';
    var AM = SPOTS[S.comp] || SPOTS.main;
    back += skyLayer(S, C, L);
    // the airplane: in the sky behind everything, and only ever high above the light
    var planeOn = L.plane && (o.plane === true || (L.planeOn && o.plane !== false));
    if (planeOn) back += g(K.plane(S, L.plane[0], L.plane[1], L.plane[2], 'left'), { 'data-part': 'plane' });
    if (L.view) back += view(S, C, L.view);
    back += floor(S, C, L);
    back += walls(S, C, L);
    if (L.hut) { L.hut.vp = L.vp; back += g(hut(S, C, L.hut), { filter: S.shadow('m'), 'data-part': 'hut' }); }
    if (L.puddle) back += puddle(S, C, L.puddle);
    if (o.grit === 'paws' && L.paws) back += gritPaws(S, C, L.paws);
    var pw = poleWidth(AM.pole) / 2;
    back += mast(S, C, { x: L.pole.x, foot: L.pole.foot, top: L.pole.top, w: pw, w1: pw * L.pole.taper, r: L.pole.r });
    if (L.forepaw) {
      var held = raisedPaw(S, AM.pole), B = L.forepaw;
      // his own raised forepaw is the picture; with nobody at the pole, the set's stands in for it
      if (held) (S.keep = S.keep || []).push({ x: held[0] - held[2] * 1.35, y: held[1] - held[2] * 1.6, w: held[2] * 2.7, h: held[2] * 2.9 });
      else if (!atPole(S)) front += bigPaw(S, C, { palm: B.palm, ang: B.ang, w: B.w, from: [B.palm[0] - B.w * 0.36, 1070], far: B.w * 0.3 });
    }
    if (o.moth === true) (L.moths || []).forEach(function (m, i) { front += g(K.moth(S, m[0], m[1], m[2], i % 2 ? 'pcs-drift' : 'pcs-hover'), { 'data-part': 'moth' }); });
    // no weather falls through the roof's own art; rain, if a frame ever asks, falls everywhere
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ the set

  // Every composition places every anchor, so nobody a frame names is ever out of sight. `pole` is
  // the pole's own foot (the same x), `beside` is next to it, `door` by the hut's door; none is at
  // the wall (tests/set-roof.test.js measures it).
  var SPOTS = {
    main: { pole: A(800, 806, 150), beside: A(1004, 824, 156, 'left'), door: A(484, 772, 138) },
    pole: { pole: A(800, 930, 600), beside: A(1340, 962, 560, 'left'), door: A(210, 962, 550) },
    two: { pole: A(640, 904, 420), beside: A(1060, 904, 400, 'left'), door: A(215, 930, 392) },
    // (here alone our cat is on the pole's other side, out of the way of his pointing claw)
    over: { pole: A(470, 986, 290), beside: A(170, 990, 290), door: A(1440, 994, 264, 'left') },
    sky: { pole: A(640, 990, 390), beside: A(1090, 994, 380, 'left'), door: A(220, 994, 370) },
    paw: { pole: A(520, 975, 940), beside: A(1240, 985, 650, 'left'), door: A(1500, 996, 430, 'left') }
  };

  art.defineSet('roof', {
    label: 'the tallest tower’s roof', tod: 'golden', todMap: { sunset: 'golden' }, draw: draw,
    cams: {
      wide: { box: [0, 0, 1600] },
      pole: { box: [0, 0, 1600], comp: 'pole' },
      two: { box: [0, 0, 1600], comp: 'two' },
      over: { box: [0, 0, 1600], comp: 'over' },
      sky: { box: [0, 0, 1600], comp: 'sky' },
      paw: { box: [0, 0, 1600], comp: 'paw' }
    },
    anchors: SPOTS,
    opts: { plane: [false, true], moth: [false, true], grit: ['none', 'paws'] },
    defaults: { grit: 'none' }
  });

  // for the tests: where each composition puts the wall, the pole, the light and the airplane
  art.roofInfo = function () {
    var out = {};
    Object.keys(COMPS).forEach(function (k) {
      var L = COMPS[k];
      out[k] = { wall: { top: L.wall.top, foot: L.wall.foot, cap: L.wall.cap }, pole: { x: L.pole.x, foot: L.pole.foot, top: L.pole.top, r: L.pole.r, w: poleWidth(SPOTS[k].pole) },
        plane: L.plane ? { x: L.plane[0], y: L.plane[1], s: L.plane[2], always: !!L.planeOn } : null, hut: !!L.hut, view: !!L.view, paws: L.paws ? L.paws.slice() : null,
        forepaw: L.forepaw ? JSON.parse(JSON.stringify(L.forepaw)) : null };
    });
    return out;
  };
  art.roofInfo.squallPaw = SQUALL_PAW;
  // where the view's named things are on the panel, for a composition that shows it (wide, over)
  art.roofInfo.view = function (comp) {
    var L = COMPS[comp];
    if (!L || !L.view) return null;
    var V = L.view, s = V.s, XY = function (q) { return [V.cx + q[0] * s, V.hz + q[1] * s]; }, Cm = VIEW.camp;
    return { horizon: V.hz, scale: s, river: [V.hz + 16 * s, V.hz + 146 * s], bridge: { near: XY(VIEW.bridge.near), far: XY(VIEW.bridge.far) },
      track: (V.track || VIEW.track).map(XY), camp: { x: V.cx + Cm.u * s, y: V.hz + Cm.v * s, rx: Cm.ru * s, ry: Cm.rv * s }, hedge: V.hz + (Cm.v + Cm.rv * 0.98) * s };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
