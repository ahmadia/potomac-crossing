/* Potomac Crossing · app/art/sets/crossing.js
 *
 * The set: the Crossing at Gravelly Point (chapters 2 and 5), by day. A rocky point right beside the
 * airport, where the river opens out wide and shining and the airplanes come in very low on
 * their way down to land. The otters' raft of logs, tied with vines, floats at the water's edge;
 * the DC shore lies low and hazy across the river (the Needle, a dome, the Old Bridge far off).
 *
 *   cameras  wide    the whole point: rocks at left, the raft at right, the river and the far shore
 *            low     looking up from the rocks (its own composition): with plane: 'low' an
 *                    airplane's belly fills the top of the panel, its row of round windows along
 *                    its side, wheels down; the cats on the rocks at the bottom, the raft small
 *                    on the river at right
 *            rocks   medium on the rocks (rock-left, pebbles, rock-high, rock-right, shore)
 *            raft    close on the raft (raft-1..3, water, and shore at its left edge)
 *   anchors  rock-left, rock-right, rock-high (elevated), shore, pebbles, raft-1..3, water
 *            (swimming: the river laps over whoever is there, so they sit low in the water)
 *   options  plane: 'none' | 'high' | 'low' (default high), pebbles: true (the heap of pebbles;
 *            it is also drawn whenever someone stands at `pebbles`, which is "by the heap")
 *
 * Chapter 5 (docs/chapters/05-riffles-river.md, "Art needs" and "Build"): the Crossing again, with a
 * raft to board. Chapter 2's four cameras and nine anchors are as they were.
 *   camera   board   close at the water's edge, at cat height (its own composition): the point's last
 *                    ledge of rock at the left, the raft's near end at the right, riding low, and a
 *                    strip of deep water between them, the mooring vine across it: our cat's four
 *                    paws at the rocks' edge and the first log (the paws-aboard Tap's panel).
 *                    Anchors there: `shore` (at the ledge's edge, about to step), `raft-1` (aboard, on
 *                    the first log), `raft-2`, `raft-3` (along the raft: Riffle and his pole),
 *                    `rock-right` (on the ledge behind `shore`: near enough to lean to her ear),
 *                    `rock-left` (a rock further back), `rock-high` (the tall rock, top left:
 *                    Tallyheart), `water` (swimming, in front of the raft). No `pebbles` there.
 *   options  tuft: true   a tuft of thin brown fur caught in the raft's mooring vine (main composition
 *                    and `board`; made for the `raft` camera). The vine is drawn over the cast, pulled
 *                    taut between the stake and the raft, the tuft hanging from it:
 *                    <g class="pc-tap" data-art="tuft">, the fur Tap's target (the page draws the
 *                    glow), and in `keep`. Somebody small; nothing of the animal is ever drawn.
 *            late: true   late light, the last gold of the afternoon, for the way home: the golden
 *                    palette and a low sun over the far shore, whatever daylight the frame names
 *                    (dusk and night stay themselves, and `fx: ['sunset']` keeps its own colours).
 *            fish: 'spare'   the way home: the marsh's fourth string, a reed loop with its two spare
 *                    fish, lying on the raft's logs at `raft-3` (so nobody is cast there with it):
 *                    the main composition and `board`. The fish are PC.art.prey's, on its string
 *                    (app/art/sets/pile.js). 'none' (default).
 *   The sun comes down with the day: low over the far shore in late light and at sunset, going
 *   behind it at dusk (chapter 2 only ever came here by day, under a high sun).
 *   The pole twice his size is Riffle's own (`holds: 'pole'`, drawn with him by cats.js); Tallyheart
 *   sits on `rock-high` as any cat does.
 *
 * Registered with PC.art.defineSet (app/art/scenes.js); painters come from PC.art.kit.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});
  var K = art.kit;
  if (!K || !art.defineSet) return;

  var n = K.n, mix = K.mix, rng = K.rng, rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke,
    poly = K.poly, g = K.g, tr = K.tr, dot = K.dot, blob = K.blob, mound = K.mound, leafD = K.leafD, A = K.anchor;

  var SHORE = 548;                  // the far shore's water line (main composition)
  var MIRROR = 'matrix(-1 0 0 1 1600 0)';

  function dark(S) { return S.tod === 'night' || S.tod === 'storm'; }

  // A rounded closed shape through the midpoints of a polygon (papercut rocks, the land).
  function smooth(P) {
    var m = P.length, s = [(P[m - 1][0] + P[0][0]) / 2, (P[m - 1][1] + P[0][1]) / 2], d = 'M' + n(s[0]) + ' ' + n(s[1]);
    for (var i = 0; i < m; i++) {
      var c = P[i], e = P[(i + 1) % m];
      d += 'Q' + n(c[0]) + ' ' + n(c[1]) + ' ' + n((c[0] + e[0]) / 2) + ' ' + n((c[1] + e[1]) / 2);
    }
    return d + 'Z';
  }
  function yRange(P) {
    var lo = Infinity, hi = -Infinity;
    for (var i = 0; i < P.length; i++) { lo = Math.min(lo, P[i][1]); hi = Math.max(hi, P[i][1]); }
    return [lo, hi];
  }

  // The CSS drift (scenes.js .pcs-drift) slides things left; these planes fly right, toward the
  // airport, so the drifting group is mirrored and its contents mirrored back.
  function driftRight(inner) {
    return g(g(g(inner, { transform: MIRROR }), { 'class': 'pcs-drift' }), { transform: MIRROR });
  }

  // ------------------------------------------------------------------ sky and far shore

  function puffs(S, list) {
    if (dark(S)) return '';
    var p = S.pal, top = mix('#FFFFFF', p.sky[p.sky.length - 1], 0.25), under = mix(p.sky[1], '#FFFFFF', 0.55), s = '';
    for (var i = 0; i < list.length; i++) {
      var c = list[i], r = rng(c[4]), d = '', du = '';
      for (var j = 0; j < 4; j++) {
        var bx = c[0] + (j - 1.5) * c[2] * 0.42 + (r() - 0.5) * c[2] * 0.12, by = c[1] - (j === 1 || j === 2 ? c[3] * 0.45 : 0);
        var rx = c[2] * (j === 1 || j === 2 ? 0.42 : 0.32), ry = c[3] * (j === 1 || j === 2 ? 1.05 : 0.75);
        d += blob(bx, by, rx, ry, 9, r, 0.12, 0.3);
      }
      du = blob(c[0], c[1] + c[3] * 0.25, c[2] * 0.95, c[3] * 0.55, 12, rng(c[4] + 1), 0.08, 0.25);
      s += path(du + d, under, { opacity: 0.75, transform: 'translate(0 ' + n(c[3] * 0.18) + ')' }) + path(du + d, top, { opacity: 0.92 });
    }
    return g(s, { 'class': 'pcs-drift', style: 'animation-duration:60s' });
  }

  // DC across the river: trees, a few low buildings, the Needle and a dome, all in haze; the Old
  // Bridge far off at left. k scales it (the low camera sees it smaller and lower).
  function farShore(S, base, k, needleX, domeX, bridge) {
    var p = S.pal, s = '', far = mix(p.haze, p.sky[Math.min(3, p.sky.length - 1)], 0.35), trees = mix(p.haze, p.leaf, 0.38), pale = mix(p.haze, '#FFFFFF', 0.3);
    if (dark(S)) { far = mix(p.sky[1], p.shade, 0.3); trees = mix(p.sky[0], p.shade, 0.5); pale = mix(p.sky[2], p.shade, 0.2); }
    // a long, low line of land: a few gentle rises, never hills
    var line = 'M-20 ' + n(base + 2) + 'V' + n(base - 9 * k), r = rng(501);
    for (var lx = -20; lx < 1620; lx += 160) line += 'Q' + n(lx + 80) + ' ' + n(base - (12 + r() * 9) * k) + ' ' + n(lx + 160) + ' ' + n(base - (7 + r() * 4) * k);
    s += path(line + 'V' + n(base + 2) + 'Z', far);
    var bld = '';
    for (var x = 380; x < 1440; x += 30 + r() * 46) { var bh = (10 + r() * 20) * k, bw = (16 + r() * 30) * k; bld += 'M' + n(x) + ' ' + n(base) + 'v' + n(-bh) + 'h' + n(bw) + 'v' + n(bh) + 'z'; }
    s += path(bld, mix(far, pale, 0.45));
    // the Needle
    var nx = needleX, nb = base - 4 * k;
    s += path('M' + n(nx - 8 * k) + ' ' + n(nb) + 'L' + n(nx - 4.5 * k) + ' ' + n(nb - 112 * k) + 'L' + n(nx) + ' ' + n(nb - 124 * k) + 'L' + n(nx + 4.5 * k) + ' ' + n(nb - 112 * k) + 'L' + n(nx + 8 * k) + ' ' + n(nb) + 'Z', pale) +
      path('M' + n(nx) + ' ' + n(nb) + 'L' + n(nx) + ' ' + n(nb - 124 * k) + 'L' + n(nx + 4.5 * k) + ' ' + n(nb - 112 * k) + 'L' + n(nx + 8 * k) + ' ' + n(nb) + 'Z', mix(pale, far, 0.45));
    // the dome
    var dx = domeX, db = base - 8 * k;
    s += rect(dx - 34 * k, db - 10 * k, 68 * k, 14 * k, pale) + path('M' + n(dx - 22 * k) + ' ' + n(db - 10 * k) + 'A' + n(22 * k) + ' ' + n(20 * k) + ' 0 0 1 ' + n(dx + 22 * k) + ' ' + n(db - 10 * k) + 'Z', pale) +
      rect(dx - 3 * k, db - 38 * k, 6 * k, 9 * k, pale) + path('M' + n(dx) + ' ' + n(db - 30 * k) + 'A' + n(22 * k) + ' ' + n(20 * k) + ' 0 0 1 ' + n(dx + 22 * k) + ' ' + n(db - 10 * k) + 'H' + n(dx) + 'Z', mix(pale, far, 0.4));
    // a fringe of little trees along the water
    var tr2 = '', rt = rng(503);
    for (var tx = -10; tx < 1620; tx += 14 + rt() * 22) tr2 += blob(tx, base - 3 * k, (8 + rt() * 9) * k, (4 + rt() * 4) * k, 7, rt, 0.2, 0.3);
    s += path(tr2 + 'M-20 ' + n(base - 3 * k) + 'H1620V' + n(base + 2) + 'H-20Z', trees);
    if (bridge) {
      // the Old Bridge, long and low, far up the river
      var bc = mix(far, p.shade, 0.25), piers = '';
      for (var bx = 0; bx < bridge; bx += 46 * k) piers += 'M' + n(bx) + ' ' + n(base - 15 * k) + 'v' + n(15 * k);
      s += stroke('M-20 ' + n(base - 17 * k) + 'L' + n(bridge) + ' ' + n(base - 14 * k), bc, 4 * k) + stroke(piers, bc, 3 * k);
      var truss = '';
      for (bx = 0; bx < bridge - 20; bx += 22 * k) truss += 'M' + n(bx) + ' ' + n(base - 18 * k) + 'l' + n(11 * k) + ' ' + n(-8 * k) + 'l' + n(11 * k) + ' ' + n(8 * k);
      s += stroke(truss, bc, 1.6 * k, { opacity: 0.8 });
    }
    return s;
  }

  // The airport's edge on our side of the river, to the right: a flat strip, a little control
  // tower and a row of approach lights.
  function airport(S, x0, base, k) {
    var p = S.pal, land = mix(p.grassFar, p.haze, 0.55), tw = mix(p.haze, p.stone, 0.45), s = '';
    if (dark(S)) { land = mix(p.grass, p.shade, 0.4); tw = mix(p.stone, p.shade, 0.3); }
    s += path('M' + n(x0) + ' ' + n(base + 12 * k) + 'Q' + n(x0 + 60 * k) + ' ' + n(base - 4 * k) + ' ' + n(x0 + 160 * k) + ' ' + n(base - 4 * k) + 'H1620V' + n(base + 12 * k) + 'Z', land);
    var tx = x0 + 280 * k;
    s += rect(tx - 6 * k, base - 92 * k, 12 * k, 90 * k, tw) + path('M' + n(tx - 22 * k) + ' ' + n(base - 92 * k) + 'L' + n(tx - 26 * k) + ' ' + n(base - 112 * k) + 'H' + n(tx + 26 * k) + 'L' + n(tx + 22 * k) + ' ' + n(base - 92 * k) + 'Z', tw) +
      rect(tx - 24 * k, base - 108 * k, 48 * k, 9 * k, dark(S) ? '#FFD98A' : mix(p.glassBot, p.haze, 0.35)) + rect(tx - 20 * k, base - 120 * k, 40 * k, 8 * k, tw) +
      rect(tx - 1.5 * k, base - 134 * k, 3 * k, 14 * k, tw) + circ(tx, base - 135 * k, 2.6 * k, '#FF6B5E', { 'class': 'pcs-blink' });
    var lights = '';
    for (var i = 0; i < 9; i++) lights += dot(x0 + 40 * k + i * 30 * k, base + 4 * k, 2.2 * k);
    s += path(lights, '#FFF2C8', { opacity: 0.85 });
    return s;
  }

  // ------------------------------------------------------------------ the river

  function riverFill(S, y0, y1) {
    var p = S.pal, top = mix(p.sky[p.sky.length - 1], '#FFFFFF', 0.15), mid = mix(p.sky[Math.min(3, p.sky.length - 1)], p.water, 0.4);
    return S.linU([[0, top], [0.12, mid], [0.5, p.water], [1, mix(p.water, p.shade, 0.3)]], 0, y0, 0, y1);
  }

  // The river from y0 to the bottom, shining: a glitter path under the sun, glints, soft swells.
  function river(S, y0, sunX, k, seed) {
    var p = S.pal, s = rect(0, y0, 1600, 1000 - y0, riverFill(S, y0, 1000)), r = rng(seed);
    var shine = p.sun || p.glow;
    if (!dark(S)) {
      // a soft shimmer under the sun (no hard edges: it must never read as a road)
      s += ell(sunX, y0 + 26 * k, 260 * k, 34 * k, S.radB('xshine', [[0, shine, 0.75], [1, shine, 0]]));
      s += ell(sunX, y0 + 150 * k, 150 * k, 150 * k, S.radB('xshine2', [[0, shine, 0.32], [0.6, shine, 0.12], [1, shine, 0]]), { transform: 'translate(' + n(sunX) + ' ' + n(y0) + ') scale(1 1.5) translate(' + n(-sunX) + ' ' + n(-y0) + ')' });
    }
    var sw = '', gl = '', gl2 = '';
    for (var i = 0; i < 80; i++) {
      var t = Math.pow(r(), 1.3), y = y0 + 6 + t * (1000 - y0 - 6), len = (14 + t * 90) * k * (0.6 + r() * 0.8), x = r() * 1600;
      sw += 'M' + n(x) + ' ' + n(y) + 'q' + n(len / 2) + ' ' + n(-3 - t * 5) + ' ' + n(len) + ' 0';
    }
    s += stroke(sw, mix(p.water, '#FFFFFF', 0.35), 2.2 * k, { opacity: 0.45 });
    for (i = 0; i < 70; i++) {
      var ty = y0 + 4 + Math.pow(r(), 1.2) * (1000 - y0 - 4), spread = 60 * k + (ty - y0) * 0.7;
      gl += 'M' + n(sunX + (r() - 0.5) * spread * 2) + ' ' + n(ty) + 'h' + n((10 + (ty - y0) * 0.1) * k);
    }
    for (i = 0; i < 46; i++) { var gy = y0 + 6 + r() * (1000 - y0 - 6); gl2 += 'M' + n(r() * 1600) + ' ' + n(gy) + 'h' + n((8 + (gy - y0) * 0.08) * k); }
    s += stroke(gl, dark(S) ? '#C9D6F0' : '#FFF8E0', 3 * k, { opacity: 0.85, 'class': 'pcs-glint' });
    s += stroke(gl2, '#FFFFFF', 2.2 * k, { opacity: 0.55, 'class': 'pcs-glint', style: 'animation-delay:-1.6s' });
    return { svg: s };
  }

  // Rings and a little foam where something sits in the water.
  function ripples(S, x, y, w, op, half) {
    // half: only the front of each ring (the back of it is behind whoever sits in the water)
    var p = S.pal, c = mix(p.water, '#FFFFFF', 0.55), o = op == null ? 0.7 : op, out = '';
    var rings = [[0.55, 0.07, 0, '#FFFFFF', 0.018, 1], [0.8, 0.11, 0.03, c, 0.013, 0.7], [1.05, 0.15, 0.07, c, 0.01, 0.4]];
    for (var i = 0; i < rings.length; i++) {
      var q = rings[i], rx = w * q[0], ry = w * q[1], cy = y + w * q[2], sw = Math.max(1.2, w * q[4]);
      if (half) out += stroke('M' + n(x - rx) + ' ' + n(cy) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 0 ' + n(x + rx) + ' ' + n(cy), q[3], sw, { opacity: o * q[5], 'stroke-dasharray': n(rx * 0.9) + ' ' + n(rx * 0.25) });
      else out += ell(x, cy, rx, ry, 'none', { stroke: q[3], 'stroke-width': sw, opacity: o * q[5] });
    }
    return out;
  }

  // The water closing over whoever is swimming at `a`: the river itself (the same drawing, clipped
  // to a patch with a wavy top edge) laid back over their lower part, with rings at the waterline.
  // Otters swimming or floating already show only what is above the water, so only their bottom
  // edge goes under; anyone else sits deeper, but never so deep that the patch would reach the raft
  // behind them (minTop).
  function swimCover(S, a, water, m, minTop) {
    var pose = (m && m.pose) || '', low = pose === 'swim' || pose === 'float';
    var h = a.h, top = low ? a.y - h * 0.06 : Math.max(a.y - h * 0.34, minTop), bot = a.y + h * 0.2, x0 = a.x - h * 0.62, x1 = a.x + h * 0.62;
    var d = 'M' + n(x0) + ' ' + n(bot) + 'Q' + n(x0 + h * 0.06) + ' ' + n(top + h * 0.05) + ' ' + n(x0 + h * 0.22) + ' ' + n(top + h * 0.02);
    for (var i = 0; i < 4; i++) {
      var xa = x0 + h * 0.22 + i * h * 0.2;
      d += 'Q' + n(xa + h * 0.05) + ' ' + n(top - h * 0.02) + ' ' + n(xa + h * 0.1) + ' ' + n(top) + 'T' + n(xa + h * 0.2) + ' ' + n(top + (i === 3 ? h * 0.02 : 0));
    }
    d += 'Q' + n(x1 - h * 0.06) + ' ' + n(top + h * 0.05) + ' ' + n(x1) + ' ' + n(bot) + 'Z';
    var p = S.pal;
    return g(water, { 'clip-path': S.clip('swim-' + S.comp, path(d, '#fff')) }) +
      stroke('M' + n(a.x - h * 0.36) + ' ' + n(top + h * 0.006) + 'Q' + n(a.x) + ' ' + n(top - h * 0.03) + ' ' + n(a.x + h * 0.36) + ' ' + n(top + h * 0.006), '#FFFFFF', Math.max(2, h * 0.012), { opacity: 0.8 }) +
      ripples(S, a.x, top + h * 0.02, h * 0.62, 0.7, true) +
      stroke('M' + n(a.x - h * 0.42) + ' ' + n(top + h * 0.08) + 'h' + n(h * 0.12) + 'M' + n(a.x + h * 0.22) + ' ' + n(top + h * 0.1) + 'h' + n(h * 0.16), mix(p.water, '#FFFFFF', 0.5), Math.max(1.5, h * 0.01), { opacity: 0.6 });
  }

  // ------------------------------------------------------------------ rocks and the land

  // A papercut rock: lit rim up and to the left, a lighter top face, cracks and a little moss.
  function rock(S, P, o) {
    o = o || {};
    var p = S.pal, d = smooth(P), yr = yRange(P), r = rng(o.seed || 7), s = '';
    var fill = S.linU([[0, mix(p.stoneLight, p.rim, 0.15)], [0.3, p.stone], [1, mix(p.stoneDark, p.shade, 0.2)]], 0, yr[0], 0, yr[1]);
    s += path(d, p.rim, { transform: 'translate(-3 -5)', opacity: 0.75 }) + path(d, fill);
    if (o.face) {
      var f = o.face;   // [cx, cy, rx, ry]: the flat top a cat sits on
      s += path(blob(f[0], f[1], f[2], f[3], 12, r, 0.08, 0.2), mix(p.stoneLight, p.rim, 0.25), { opacity: 0.85 });
      s += stroke('M' + n(f[0] - f[2] * 0.7) + ' ' + n(f[1] - f[3] * 0.55) + 'Q' + n(f[0]) + ' ' + n(f[1] - f[3] * 1.05) + ' ' + n(f[0] + f[2] * 0.6) + ' ' + n(f[1] - f[3] * 0.6), p.rim, 2.5, { opacity: 0.8 });
    }
    if (o.cracks) s += stroke(o.cracks, mix(p.stoneDark, p.shade, 0.3), 2.5, { opacity: 0.45 });
    if (o.moss) {
      var ms = '';
      for (var i = 0; i < o.moss.length; i++) ms += blob(o.moss[i][0], o.moss[i][1], o.moss[i][2], o.moss[i][2] * 0.35, 8, r, 0.3, 0.3);
      s += path(ms, p.moss, { opacity: 0.9 });
    }
    return s;
  }

  // A heap of pebbles centred at x, its foot at y: rounded stones of every colour, lit on top.
  function heap(S, x, y, w, h, seed) {
    var p = S.pal, r = rng(seed || 41), cols = [p.stone, p.stoneLight, p.stoneDark, mix(p.sand, p.stone, 0.4), mix(p.stoneDark, p.woodDark, 0.4), mix(p.stoneLight, '#FFFFFF', 0.3)];
    var s = ell(x, y + h * 0.04, w * 0.58, h * 0.16, p.shade, { opacity: 0.25 }), hi = '';
    var rows = 5, pr = w * 0.07;
    for (var row = 0; row < rows; row++) {
      var t = row / (rows - 1), half = w * 0.5 * (1 - t * 0.78), yy = y - h * 0.06 - t * h * 0.72, count = Math.max(1, Math.round(half * 2 / (pr * 1.5)));
      for (var i = 0; i < count; i++) {
        var px = x - half + (count === 1 ? half : i * (half * 2) / (count - 1)) + (r() - 0.5) * pr * 0.6, py = yy + (r() - 0.5) * pr * 0.5;
        var rx = pr * (0.75 + r() * 0.5), ry = rx * (0.62 + r() * 0.2), c = cols[Math.floor(r() * cols.length)];
        s += ell(px, py + ry * 0.2, rx, ry, mix(c, p.shade, 0.35)) + ell(px, py, rx, ry, c);
        hi += 'M' + n(px - rx * 0.5) + ' ' + n(py - ry * 0.3) + 'q' + n(rx * 0.4) + ' ' + n(-ry * 0.45) + ' ' + n(rx * 0.85) + ' ' + n(-ry * 0.15);
      }
    }
    return s + stroke(hi, p.rim, Math.max(1.5, pr * 0.16), { opacity: 0.7 });
  }

  // ------------------------------------------------------------------ the raft

  // Logs side by side from x0 to x1, the deck from yTop to yBot, lashed with vines. k scales the
  // details (the low camera sees the raft small).
  function raft(S, x0, x1, yTop, yBot, k, seed) {
    var p = S.pal, r = rng(seed), s = '', logs = 4, dy = (yBot - yTop) / logs, front = 26 * k;
    // reflection and the water line
    s += path('M' + n(x0 + 10 * k) + ' ' + n(yBot + front - 4 * k) + 'H' + n(x1 - 6 * k) + 'Q' + n(x1 + 10 * k) + ' ' + n(yBot + front + 18 * k) + ' ' + n(x1 - 20 * k) + ' ' + n(yBot + front + 30 * k) +
      'H' + n(x0 + 24 * k) + 'Q' + n(x0 - 4 * k) + ' ' + n(yBot + front + 18 * k) + ' ' + n(x0 + 10 * k) + ' ' + n(yBot + front - 4 * k) + 'Z', p.shade, { opacity: 0.28 });
    // logs, back to front
    for (var i = 0; i < logs; i++) {
      var ya = yTop + i * dy - 4 * k, yb = ya + dy + 10 * k, ja = (r() - 0.5) * 30 * k, jb = (r() - 0.5) * 30 * k;
      var la = x0 + ja + (i % 2) * 14 * k, lb = x1 + jb - (i % 2) * 10 * k, rr = (yb - ya) / 2;
      var col = i % 2 ? p.woodLight : p.wood, bark = mix(col, p.woodDark, 0.45);
      s += rect(la, ya, lb - la, yb - ya + (i === logs - 1 ? front : 0), S.linU([[0, mix(col, p.rim, 0.25)], [0.45, col], [1, bark]], 0, ya, 0, yb + (i === logs - 1 ? front : 0)), { rx: rr });
      var tex = '';
      for (var j = 0; j < 7; j++) { var tx = la + 30 * k + r() * (lb - la - 60 * k); tex += 'M' + n(tx) + ' ' + n(ya + rr * (0.5 + r() * 0.6)) + 'h' + n((18 + r() * 40) * k); }
      s += stroke(tex, p.woodDark, 2.2 * k, { opacity: 0.4 }) + stroke('M' + n(la + rr) + ' ' + n(ya + 3 * k) + 'H' + n(lb - rr), p.rim, 2.4 * k, { opacity: 0.55 });
      // the cut end at the left, with its rings
      var ex = la + rr * 0.55, ey = ya + rr;
      s += ell(ex, ey, rr * 0.55, rr * 0.92, mix(p.sand, p.woodLight, 0.4)) + ell(ex, ey, rr * 0.34, rr * 0.6, 'none', { stroke: p.woodDark, 'stroke-width': 1.6 * k, opacity: 0.5 }) +
        ell(ex, ey, rr * 0.14, rr * 0.25, p.woodDark, { opacity: 0.45 });
    }
    // vine lashings: a vine wound round every log, a knot on top and a few leaves
    var vine = mix(p.leaf, p.woodDark, 0.25), lv = '', ln = '', knots = '';
    for (var v = 0; v < 3; v++) {
      var vx = x0 + (x1 - x0) * (0.2 + v * 0.3) + (r() - 0.5) * 20 * k;
      for (i = 0; i < logs; i++) {
        var la0 = yTop + i * dy - 2 * k, lb0 = yTop + (i + 1) * dy + (i === logs - 1 ? front : 6 * k);
        for (var w2 = 0; w2 < 2; w2++) {
          var wx = vx + w2 * 13 * k + i * 3 * k;
          ln += 'M' + n(wx - 4 * k) + ' ' + n(la0) + 'Q' + n(wx + 7 * k) + ' ' + n((la0 + lb0) / 2) + ' ' + n(wx - 1 * k) + ' ' + n(lb0);
        }
      }
      knots += dot(vx + 8 * k, yTop + 2 * k, 9 * k);
      lv += leafD(vx + 8 * k, yTop, 24 * k, -2.4, 9 * k) + leafD(vx + 10 * k, yTop, 20 * k, -0.6, 8 * k) + leafD(vx + 2 * k + logs * 3 * k, yBot + front - 4 * k, 18 * k, 0.9, 6 * k);
    }
    s += stroke(ln, vine, 6 * k) + stroke(ln, p.leafLight, 1.8 * k, { opacity: 0.55, transform: 'translate(-1.5 -1)' }) + path(knots, vine) + path(lv, p.leafMid);
    // a loose end trailing in the water
    s += stroke('M' + n(x1 - 30 * k) + ' ' + n(yBot + front - 6 * k) + 'q' + n(26 * k) + ' ' + n(20 * k) + ' ' + n(60 * k) + ' ' + n(14 * k) + 't' + n(50 * k) + ' ' + n(8 * k), vine, 5 * k);
    // the river lapping along its front
    s += stroke('M' + n(x0 + 6 * k) + ' ' + n(yBot + front + 2 * k) + 'H' + n(x1 - 8 * k), '#FFFFFF', 3 * k, { opacity: 0.6 });
    return s;
  }

  // ------------------------------------------------------------------ airplanes

  // A big airliner seen from below and a little to one side: the row of round windows along its
  // side, the belly in shade, one wing toward us with its engine, wheels down for landing. Local
  // units: 1000 from tail (x -500) to nose (x +500). o.span shortens the wings (the low camera).
  function airliner(S, x, y, k, o) {
    o = o || {};
    var p = S.pal, dk = dark(S), sp = o.span == null ? 1 : o.span;
    var body = dk ? '#5A627C' : mix('#F8F6FA', p.sky[p.sky.length - 1], 0.15), hiC = dk ? '#78809C' : '#FFFFFF';
    var belly = dk ? '#3A4058' : mix('#BFC3D2', p.shade, 0.1), under = dk ? '#2E3448' : mix('#A3A9BE', p.shade, 0.18);
    var blue = dk ? '#3E5C8A' : '#3B7BC2', win = dk ? '#FFD98A' : '#2B3C56', glint = dk ? '#FFF6D8' : '#FFFFFF';
    var s = '';
    function wing(rootL, rootT, dir, len, sweep, chord) {
      // rootL/rootT: leading and trailing root x; dir: +1 down, -1 up; returns the outline
      var ly = dir > 0 ? 58 : -48, tipL = [rootL - sweep * len, ly + dir * len], tipT = [tipL[0] - chord, tipL[1] - dir * 8];
      return { d: 'M' + n(rootL) + ' ' + n(ly) + 'L' + n(tipL[0]) + ' ' + n(tipL[1]) + 'Q' + n(tipL[0] - chord * 0.5) + ' ' + n(tipL[1] + dir * 10) + ' ' + n(tipT[0]) + ' ' + n(tipT[1]) +
        'L' + n(rootT) + ' ' + n(ly) + 'Z', tipL: tipL, tipT: tipT, ly: ly };
    }
    function engine(cx, cy) {
      var e = '';
      e += path('M' + n(cx - 20) + ' ' + n(cy - 46) + 'L' + n(cx + 40) + ' ' + n(cy - 46) + 'L' + n(cx + 24) + ' ' + n(cy - 20) + 'L' + n(cx - 30) + ' ' + n(cy - 20) + 'Z', under);
      e += path('M' + n(cx - 90) + ' ' + n(cy - 30) + 'Q' + n(cx - 110) + ' ' + n(cy) + ' ' + n(cx - 90) + ' ' + n(cy + 30) + 'L' + n(cx + 80) + ' ' + n(cy + 38) + 'L' + n(cx + 80) + ' ' + n(cy - 38) + 'Z',
        S.lin('pln-eng' + (dk ? 'd' : ''), [[0, hiC], [0.35, body], [1, belly]]));
      e += path('M' + n(cx - 90) + ' ' + n(cy - 14) + 'L' + n(cx - 128) + ' ' + n(cy - 8) + 'L' + n(cx - 128) + ' ' + n(cy + 8) + 'L' + n(cx - 90) + ' ' + n(cy + 14) + 'Z', mix(under, p.shade, 0.3));
      e += ell(cx + 80, cy, 15, 38, mix(body, belly, 0.4)) + ell(cx + 82, cy, 10, 31, '#2A2E3C') + circ(cx + 86, cy, 7, hiC) +
        stroke('M' + n(cx + 84) + ' ' + n(cy - 26) + 'L' + n(cx + 84) + ' ' + n(cy + 26) + 'M' + n(cx + 78) + ' ' + n(cy - 18) + 'L' + n(cx + 90) + ' ' + n(cy + 18) + 'M' + n(cx + 90) + ' ' + n(cy - 18) + 'L' + n(cx + 78) + ' ' + n(cy + 18), '#4A5068', 2.4);
      e += stroke('M' + n(cx - 80) + ' ' + n(cy - 26) + 'L' + n(cx + 74) + ' ' + n(cy - 32), hiC, 3, { opacity: 0.7 });
      return e;
    }
    var FUS = 'M-470 -46Q-420 -66 -330 -70L380 -70Q468 -68 500 -14Q512 20 472 48Q440 70 380 70L-180 70Q-300 66 -400 22Q-470 -10 -482 -30Q-484 -44 -470 -46Z';
    // the far wing, its engine and the far tailplane, behind the body
    var up = wing(70, -150, -1, 320 * sp, 0.72, 80);
    s += path(up.d, mix(under, p.sky[1] || under, 0.25)) + stroke('M' + n(-150) + ' ' + n(up.ly) + 'L' + n(up.tipT[0]) + ' ' + n(up.tipT[1]), mix(under, '#000000', 0.2), 3, { opacity: 0.4 });
    s += engine(70 - 0.72 * 320 * sp * 0.36 + 10, -48 - 320 * sp * 0.36 + 44);
    s += path('M-350 -40L-440 -40L-520 -122Q-526 -132 -514 -132L-488 -132Z', under);
    // the tail fin, with a round sun on it
    s += path('M-300 -64L-394 -252Q-402 -266 -420 -266L-466 -266Q-488 -264 -486 -244L-474 -46Z', blue) +
      path('M-300 -64L-394 -252Q-399 -260 -408 -263L-326 -66Z', '#FFFFFF', { opacity: 0.25 }) + circ(-426, -168, 26, '#FFD25E') + circ(-426, -168, 16, '#FFE9A0');
    // the body
    var fus = path(FUS, S.lin('pln-body' + (dk ? 'd' : ''), [[0, hiC], [0.3, body], [0.62, mix(body, belly, 0.5)], [1, under]]));
    var clipF = S.clip('pln-fus', path(FUS, '#fff'));
    var band = path('M-470 6L470 6L478 20L-460 22Z', blue) + path('M-466 26L476 26L472 32L-458 32Z', '#FFD25E', { opacity: 0.85 }) +
      path('M-480 40Q0 46 480 40V80H-480Z', mix(belly, p.shade, 0.15), { opacity: 0.5 });
    fus += g(band, { 'clip-path': clipF });
    fus += stroke('M-330 -62L384 -62', hiC, 6, { opacity: 0.85 });
    var wins = '', rims = '', gls = '';
    for (var wx = -326; wx <= 362; wx += 32) {
      if (Math.abs(wx - 378) < 30 || Math.abs(wx + 380) < 30) continue;
      rims += dot(wx, -24, 13); wins += dot(wx, -24, 9.5); gls += dot(wx - 3.2, -27.2, 2.8);
    }
    fus += path(rims, mix(body, belly, 0.55)) + path(wins, win) + path(gls, glint, { opacity: dk ? 0.6 : 0.85 });
    fus += path('M-392 -54h30a8 8 0 0 1 8 8v70a8 8 0 0 1-8 8h-30a8 8 0 0 1-8-8v-70a8 8 0 0 1 8-8Z' + 'M378 -54h30a8 8 0 0 1 8 8v70a8 8 0 0 1-8 8h-30a8 8 0 0 1-8-8v-70a8 8 0 0 1 8-8Z', 'none',
      { stroke: mix(body, '#5A6078', 0.5), 'stroke-width': 2.6 });
    fus += path('M424 -40L456 -42L468 -26L428 -24Z' + 'M464 -40L484 -32L489 -22L472 -24Z', '#2B3C56') + path('M430 -37L446 -38L436 -28Z', glint, { opacity: 0.7 });
    s += fus;
    // the near tailplane, the near wing, its engine, the wheels and the lights
    s += path('M-350 30L-440 30L-508 118Q-512 128 -500 128L-476 128Z', under);
    var lo = wing(90, -170, 1, 330 * sp, 0.74, 86);
    s += path(lo.d, S.lin('pln-wing' + (dk ? 'd' : ''), [[0, mix(under, hiC, 0.25)], [1, under]])) +
      path('M90 58L' + n(lo.tipL[0]) + ' ' + n(lo.tipL[1]) + 'L' + n(lo.tipL[0] - 12) + ' ' + n(lo.tipL[1] - 4) + 'L78 58Z', hiC, { opacity: 0.55 }) +
      stroke('M-120 62L' + n(lo.tipT[0] + 34) + ' ' + n(lo.tipT[1] - 8) + 'M-60 62L' + n(lo.tipT[0] + 60) + ' ' + n(lo.tipT[1] - 6), mix(under, '#000000', 0.25), 2.4, { opacity: 0.35 });
    s += circ(lo.tipL[0] - 30, lo.tipL[1] + 2, 6, '#FF5A4E', { 'class': 'pcs-blink' });
    s += engine(90 - 0.74 * 330 * sp * 0.42 + 20, 58 + 330 * sp * 0.42 + 40);
    if (o.gear !== false) {
      // wheels down for landing: the main wheels just behind the engine, the nose wheels forward
      var gear = '', tyre = '#2A2A34', hub = '#C9CDD8', leg = '#6A7088', gy = 150;
      gear += stroke('M-150 60L-158 ' + n(gy) + 'M-96 60L-104 ' + n(gy) + 'M420 62V120', leg, 10);
      gear += stroke('M-158 ' + n(gy - 30) + 'L-104 ' + n(gy - 30), leg, 6);
      gear += circ(-158, gy, 27, tyre) + circ(-104, gy, 27, tyre) + circ(-158, gy, 11, hub) + circ(-104, gy, 11, hub) +
        circ(-162, gy - 6, 4, '#FFFFFF', { opacity: 0.5 }) + circ(-108, gy - 6, 4, '#FFFFFF', { opacity: 0.5 });
      gear += circ(418, 132, 20, tyre) + circ(418, 132, 8, hub);
      s += gear;
    }
    // the landing light and the beacon
    s += circ(120, 66, 70, S.radB('pln-light', [[0, '#FFF8D8', 0.95], [0.25, '#FFF0B8', 0.6], [1, '#FFF0B8', 0]])) + circ(120, 66, 9, '#FFFDF0');
    s += circ(60, 72, 6, '#FF5A4E', { 'class': 'pcs-blink' });
    return g(s, { transform: tr(x, y, k) + ' rotate(' + n(o.rot == null ? 6 : o.rot) + ')' });
  }

  // The plane's shadow on the river: a cross of fuselage and swept wings, squashed by distance.
  function planeShadow(S, x, y, w) {
    var k = w / 1000, s = 'M-480 0Q-480 -26 -440 -26L420 -26Q500 -20 510 0Q500 20 420 26L-440 26Q-480 26 -480 0Z' +
      'M-120 -20L-330 -470L-250 -470L120 -20ZM-120 20L-330 470L-250 470L120 20ZM-390 -18L-470 -170L-430 -170L-330 -18ZM-390 18L-470 170L-430 170L-330 18Z';
    return g(path(s, S.pal.shade), { transform: tr(x, y, k, k * 0.22) + ' rotate(-4)', opacity: 0.22, filter: S.blur('xshadow', 4) });
  }

  // Small planes further off, in a line coming down to land at the airport (to the right).
  function highPlanes(S, list) {
    var s = '';
    for (var i = 0; i < list.length; i++) s += K.plane(S, 1600 - list[i][0], list[i][1], list[i][2], 'left');
    return g(s, { transform: MIRROR });
  }

  // ------------------------------------------------------------------ MAIN: wide, rocks, raft

  function drawMain(S) {
    var p = S.pal, o = S.opts, back = '', front = '', plane = o.plane || 'high';
    var cast = S.cast || [];
    var late = lowSun(S);
    back += K.sky(S, 0, 0, 1600, SHORE + 12, late ? { sun: [1300, late], sunR: 560 } : { sun: [1330, 150], sunR: 430 });
    back += puffs(S, [[170, 250, 230, 34, 511], [930, 96, 260, 38, 512], [1480, 400, 150, 22, 513]]);
    if (plane === 'high') back += highPlanes(S, [[250, 120, 0.85], [640, 196, 1.5], [1100, 296, 2.5]]);
    back += farShore(S, SHORE, 1, 820, 1090, 420);
    back += airport(S, 1190, SHORE + 10, 1);
    var R = river(S, SHORE - 2, late ? 1300 : 1330, 1, 521);
    back += R.svg;
    if (plane === 'low') back += driftRight(planeShadow(S, 760, 664, 760));
    // the land: Gravelly Point's grass at the back, gravel and rocks running out to the point
    var land = [[-40, 636], [130, 630], [290, 646], [440, 684], [580, 724], [720, 770], [860, 816], [990, 856], [1052, 890], [1040, 960], [1000, 1040], [-40, 1040]];
    back += path(smooth(land), p.rim, { transform: 'translate(0 -5)', opacity: 0.8 });
    back += path(smooth(land), S.linU([[0, p.grass], [0.16, mix(p.grass, p.stone, 0.45)], [0.3, mix(p.sand, p.stone, 0.7)], [1, mix(p.sandDark, p.stoneDark, 0.65)]], 0, 630, 0, 1000));
    back += stroke('M-40 640Q130 626 290 644Q440 682 580 722Q720 768 860 814Q990 854 1050 888', '#FFFFFF', 4, { opacity: 0.55 });
    back += K.tufts(S, 0, 470, 640, 720, 40, 531, p.grassNear, p.grassLight, 0.9);
    back += g(path(mound(-80, 260, 650, 560, 7, rng(532), 0.32, 0.25, 0.3), p.leaf) + path(mound(-60, 230, 650, 586, 6, rng(533), 0.32, 0.25, 0.3), p.leafMid, { opacity: 0.9 }) +
      path(mound(230, 400, 662, 620, 5, rng(534), 0.32, 0.25, 0.3), p.leafMid), { filter: S.shadow('s') });
    // gravel speckle
    var gr = '', r = rng(535);
    for (var i = 0; i < 160; i++) {
      var gx = r() * 1040, gy = 700 + Math.pow(r(), 0.8) * 300;
      if (gy < 640 + gx * 0.21) continue;
      gr += blob(gx, gy, 2 + (gy - 700) * 0.018 + r() * 3, 1.4 + (gy - 700) * 0.01 + r() * 2, 6, r, 0.3, 0.3);
    }
    back += path(gr, p.stoneDark, { opacity: 0.45 });
    // riprap: rounded rocks all along the water's edge and scattered over the gravel, behind the cats
    var rip = '';
    var RR = [[300, 668, 22], [360, 680, 30], [420, 694, 26], [720, 776, 36], [790, 796, 30], [850, 816, 34], [904, 834, 26],
      [130, 700, 18], [60, 780, 26], [400, 812, 30], [560, 860, 22], [620, 836, 30], [470, 870, 18], [120, 850, 20]];
    for (i = 0; i < RR.length; i++) {
      var q = RR[i], rr = rng(540 + i), w0 = q[2] * (0.9 + rr() * 0.3);
      rip += rock(S, [[q[0] - w0, q[1] + 6], [q[0] - w0 * 0.8, q[1] - q[2] * 0.5], [q[0] - w0 * 0.1, q[1] - q[2] * (0.7 + rr() * 0.3)], [q[0] + w0 * 0.7, q[1] - q[2] * 0.55], [q[0] + w0, q[1] + 6]], { seed: 540 + i });
    }
    back += g(rip, { filter: S.shadow('s') });
    // the tall boulder (rock-high)
    back += g(rock(S, [[452, 826], [454, 720], [486, 664], [550, 638], [626, 640], [676, 672], [698, 740], [702, 826]], {
      seed: 551, face: [568, 650, 70, 13], cracks: 'M520 700Q540 740 530 790M640 690Q620 730 650 780', moss: [[600, 812, 46], [480, 760, 20]]
    }), { filter: S.shadow('m') });
    // the raft, tied to the point with a vine
    back += g(raft(S, 1050, 1584, 760, 852, 1, 561), { filter: S.shadow('m') });
    back += spareFish(S, 1452, 796, MAIN['raft-3'].h);
    back += ripples(S, 1060, 882, 120, 0.5) + ripples(S, 1570, 882, 120, 0.5);
    // rocks in the water off the point
    back += g(rock(S, [[1040, 974], [1050, 944], [1090, 932], [1134, 946], [1142, 974]], { seed: 557 }), { filter: S.shadow('s') });
    back += ripples(S, 1092, 972, 110, 0.55);
    // the slab for rock-left, the rock for rock-right, the tip of the point (shore)
    back += g(rock(S, [[60, 1000], [62, 930], [96, 894], [190, 882], [306, 884], [356, 906], [370, 1000]], {
      seed: 552, face: [216, 900, 124, 16], cracks: 'M120 940Q150 960 140 990M300 930L320 980', moss: [[340, 960, 26]]
    }) + rock(S, [[636, 968], [640, 904], [686, 870], [802, 864], [866, 878], [888, 968]], {
      seed: 553, face: [764, 884, 98, 14], cracks: 'M700 920Q720 940 712 960M840 910L852 950', moss: [[650, 940, 22]]
    }), { filter: S.shadow('m') });
    var stake = '';
    stake += rect(984, 790, 14, 66, p.woodDark, { rx: 5 }) + rect(984, 790, 5, 66, p.woodLight, { opacity: 0.6, rx: 2 });
    var vine = mix(p.leaf, p.woodDark, 0.25);
    // (chapter 5, `tuft`: the mooring vine is pulled taut and drawn over the cast, below)
    if (o.tuft !== true) stake += stroke('M992 804Q1020 826 1056 812', vine, 7) + path(leafD(1016, 818, 18, 0.8, 7) + leafD(994, 800, 16, -2.2, 6), p.leafMid);
    back += g(stake, { filter: S.shadow('s') });
    back += g(rock(S, [[858, 948], [862, 884], [900, 852], [982, 846], [1034, 868], [1048, 916], [1012, 952]], {
      seed: 554, face: [944, 862, 74, 12], cracks: 'M920 900Q930 920 924 940', moss: [[1000, 930, 24]]
    }), { filter: S.shadow('m') });
    back += stroke('M1012 952Q1040 940 1050 906', '#FFFFFF', 3.5, { opacity: 0.6 });
    // little round rocks in the foreground
    back += g(rock(S, [[-30, 1010], [-20, 960], [30, 948], [86, 970], [96, 1010]], { seed: 555 }) +
      rock(S, [[560, 1010], [570, 984], [620, 976], [668, 990], [676, 1010]], { seed: 556 }), { filter: S.shadow('s') });
    // the heap of pebbles: in front of whoever stands at `pebbles` (they dig in it)
    var atPeb = null, atWater = null;
    for (i = 0; i < cast.length; i++) { if (cast[i].at === 'pebbles') atPeb = atPeb || cast[i]; if (cast[i].at === 'water') atWater = atWater || cast[i]; }
    var pa = MAIN.pebbles;
    if (o.pebbles || atPeb) S.covers.pebbles = heap(S, pa.x + pa.h * 0.34, pa.y + pa.h * 0.03, pa.h * 0.78, pa.h * 0.26, 571);
    if (atWater) S.covers.water = swimCover(S, MAIN.water, R.svg, atWater, 906);
    // foreground grass at the bottom-left corner
    front += g(K.tufts(S, -10, 120, 990, 1012, 12, 581, p.grassNear, p.grassLight, 2.2), { filter: S.shadow('s') });
    if (plane === 'low') back += driftRight(airliner(S, 770, 196, 1.04, { rot: 5, span: 0.62 }));
    // chapter 5: the raft's vine, lifted, and the tuft of fur caught in it
    if (o.tuft === true) front += mooring(S, TUFT.main);
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ LOW: looking up from the rocks

  function drawLow(S) {
    var o = S.opts, back = '', plane = o.plane || 'high', cast = S.cast || [], i;
    back += K.sky(S, 0, 0, 1600, 800, lowSun(S) ? { sun: [1450, lowSun(S) + 116], sunR: 640 } : { sun: [1450, 120], sunR: 560 });
    back += puffs(S, [[260, 680, 220, 30, 611], [1180, 610, 180, 26, 612], [760, 730, 140, 18, 613]]);
    if (plane === 'high') back += highPlanes(S, [[420, 380, 1.4], [820, 250, 2.6], [1240, 120, 4.2]]);
    else if (plane === 'none') back += puffs(S, [[600, 220, 300, 44, 614], [1250, 330, 200, 30, 615]]);
    back += farShore(S, 800, 0.55, 560, 760, 0);
    back += airport(S, 1300, 806, 0.6);
    var R = river(S, 798, 1450, 0.7, 621);
    back += R.svg;
    // the raft, small on the river at right (raft-1..3 here are the otters sunning on it)
    back += g(raft(S, 1090, 1560, 834, 870, 0.5, 631), { filter: S.shadow('s') });
    // the rocks we are lying on: a tall one at left, flat ones along the bottom, the tip at right
    back += g(rock(S, [[-40, 1040], [-30, 860], [20, 820], [120, 806], [230, 820], [290, 880], [300, 1040]], {
      seed: 641, face: [140, 820, 96, 14], cracks: 'M60 880Q80 920 70 980M240 900L256 960', moss: [[30, 960, 30]]
    }), { filter: S.shadow('m') });
    back += g(rock(S, [[240, 1060], [250, 990], [300, 958], [500, 952], [580, 972], [600, 1060]], { seed: 642, face: [410, 968, 150, 14] }) +
      rock(S, [[570, 1060], [580, 986], [640, 950], [880, 946], [940, 972], [950, 1060]], { seed: 643, face: [770, 958, 150, 14] }) +
      rock(S, [[900, 1060], [910, 960], [960, 926], [1080, 924], [1120, 960], [1110, 1060]], { seed: 644, face: [1010, 938, 84, 12] }), { filter: S.shadow('m') });
    back += stroke('M1110 1000Q1124 970 1118 950', '#FFFFFF', 3, { opacity: 0.6 });
    var atWater = null;
    for (i = 0; i < cast.length; i++) if (cast[i].at === 'water') { atWater = cast[i]; break; }
    if (atWater) S.covers.water = swimCover(S, LOW.water, R.svg, atWater, 900);
    // the airplane: enormous, the top of the panel
    if (plane === 'low') back += driftRight(airliner(S, 640, 248, 1.9, { rot: 6, span: 0.42 }));
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ chapter 5: late light, the tuft, the paws aboard

  // `late: true`: the last gold of the afternoon. The set takes the golden palette in place of the
  // frame's daylight (before anything is drawn, so the cast's tint and every shadow follow it).
  function lateLight(S) { if (S.opts.late === true && S.pal && S.pal.day) { S.tod = 'golden'; S.pal = K.PAL.golden; } }
  function isLate(S) { return S.opts.late === true && S.tod === 'golden'; }
  // The sun has come down toward the far shore: in late light and at a frame's own sunset it stands
  // low over it; at dusk it is going behind it. Returns its height in the main composition (0 by
  // day: the high sun of chapter 2).
  function lowSun(S) { return isLate(S) || S.tod === 'sunset' ? 404 : S.tod === 'dusk' ? 520 : 0; }

  // `fish: 'spare'` (the way home): the string of two spare fish (PC.art.prey.string), laid on the
  // logs with its loop at (x, y), the fish lying along the log toward +x; h: a sitting cat's height there.
  function spareFish(S, x, y, h) {
    if (S.opts.fish !== 'spare' || !art.prey || typeof art.prey.string !== 'function') return '';
    return g('<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(-84)">' + art.prey.string({ count: 2, len: h * 0.19 }) + '</g>', { filter: S.shadow('s'), 'data-part': 'spare-fish' });
  }

  // The raft's mooring vine with a tuft of thin brown fur caught in it. T = { a: the stake's end, b:
  // the raft's end, lift, at: 0..1 along it, r: the tuft's size }. The vine is pulled taut, a little
  // up in the middle (somebody has just lifted it), and the tuft hangs from it: fine strands fanned
  // from where the vine pinches them. Thin brown fur: not a cat's, not an otter's, not a fox's, and
  // nobody is drawn to say whose. The tuft is the fur Tap's target (class pc-tap) and in keep.
  var TUFT = { main: { a: [991, 800], b: [1066, 794], lift: 16, at: 0.52, r: 34 }, board: { a: [655, 790], b: [848, 812], lift: 34, at: 0.5, r: 52 } };
  var FUR = { base: '#8A5B38', light: '#C99C6E', dark: '#5B3A22' };
  // where the tuft is pinched: on the vine, `at` of the way along it
  function tuftAt(T) {
    var q = K.bez2(T.a, [(T.a[0] + T.b[0]) / 2, (T.a[1] + T.b[1]) / 2 - T.lift], T.b, T.at);
    return [q[0], q[1] + Math.max(5, T.r * 0.2) * 0.3];
  }
  function mooring(S, T) {
    var p = S.pal, vine = mix(p.leaf, p.woodDark, 0.25), a = T.a, b = T.b, r = T.r, rr = rng(871);
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - T.lift, w = Math.max(5, r * 0.2);
    var d = 'M' + n(a[0]) + ' ' + n(a[1]) + 'Q' + n(mx) + ' ' + n(my) + ' ' + n(b[0]) + ' ' + n(b[1]);
    var q = tuftAt(T), tx = q[0], ty = q[1];
    var s = stroke(d, vine, w) + stroke(d, p.leafLight, w * 0.3, { opacity: 0.55, transform: 'translate(-1 -1)' }) +
      path(leafD(K.bez2(a, [mx, my], b, 0.2)[0], K.bez2(a, [mx, my], b, 0.2)[1], r * 0.62, -2.1, r * 0.22) + leafD(K.bez2(a, [mx, my], b, 0.84)[0], K.bez2(a, [mx, my], b, 0.84)[1], r * 0.56, -0.7, r * 0.2), p.leafMid);
    // the tuft: fine strands hanging and fanning from the pinch, pale tips over a soft dark heart, a wisp or two astray
    var dk = '', md = '', lt = '', k = dark(S) ? 0.45 : 0, cols = [mix(FUR.dark, p.shade, k), mix(FUR.base, p.shade, k), mix(FUR.light, p.shade, k)];
    for (var i = 0; i < 26; i++) {
      var f = (i / 25 - 0.5) * 2.1 + (rr() - 0.5) * 0.2, len = r * (0.62 + rr() * 0.62) * (1 - Math.abs(f) * 0.2), curl = (rr() - 0.5) * r * 0.42;
      var ex = tx + Math.sin(f) * len + curl * 0.5, ey = ty + Math.cos(f) * len * 0.96;
      var st = 'M' + n(tx + Math.sin(f) * r * 0.1) + ' ' + n(ty + r * 0.04) + 'Q' + n(tx + Math.sin(f) * len * 0.5 + curl) + ' ' + n(ty + Math.cos(f) * len * 0.52) + ' ' + n(ex) + ' ' + n(ey);
      if (i % 3 === 0) dk += st; else if (i % 3 === 1) md += st; else lt += st;
    }
    var tuft = path(blob(tx, ty + r * 0.34, r * 0.5, r * 0.4, 9, rr, 0.25, 0.3), cols[1], { opacity: 0.6 }) +
      stroke(dk, cols[0], Math.max(1.2, r * 0.06)) + stroke(md, cols[1], Math.max(1.2, r * 0.066)) + stroke(lt, cols[2], Math.max(1, r * 0.05)) +
      ell(tx, ty - w * 0.1, w * 0.62, w * 0.5, vine);
    (S.keep = S.keep || []).push({ x: tx - r * 1.15, y: ty - r * 0.4, w: r * 2.3, h: r * 1.8 });
    return g(s, { 'data-art': 'mooring' }) + g(tuft, { 'class': 'pc-tap', 'data-art': 'tuft' });
  }

  // BOARD: close at the water's edge, at cat height. The point's last ledge of rock at the left, the
  // raft's near end at the right, its deck a little lower than the ledge ("The raft sits low"), and
  // between them a strip of the river, deeper green for being deep. Everything a cat steps across is
  // in the panel: the ledge's edge, the gap, the first log.
  var BSHORE = 404;                 // the far shore's water line here: about a cat's eye level
  var BRAFT = [832, 1780, 812, 948, 2.4];
  function drawBoard(S) {
    var p = S.pal, o = S.opts, back = '', front = '', plane = o.plane || 'high', cast = S.cast || [], late = lowSun(S), i;
    back += K.sky(S, 0, 0, 1600, BSHORE + 12, late ? { sun: [1250, late - 104], sunR: 540 } : { sun: [1300, 104], sunR: 420 });
    back += puffs(S, [[250, 190, 210, 30, 711], [900, 84, 240, 34, 712], [1500, 270, 140, 20, 713]]);
    if (plane === 'high') back += highPlanes(S, [[330, 84, 0.9], [760, 150, 1.6], [1180, 232, 2.6]]);
    back += farShore(S, BSHORE, 0.9, 650, 950, 320);
    back += airport(S, 1280, BSHORE + 8, 0.85);
    var R = river(S, BSHORE - 2, late ? 1250 : 1300, 1.3, 721);
    back += R.svg;
    if (plane === 'low') back += driftRight(planeShadow(S, 820, 540, 900));
    // the deep water between the ledge and the raft: the same river, darker and greener for being deep
    var deepC = mix(mix(p.water, '#1E5548', 0.45), p.shade, 0.3);
    back += path('M690 850Q760 800 900 812L960 1010H650Z', S.linU([[0, deepC, 0], [0.22, deepC, 0.62], [1, deepC, 0.86]], 0, 806, 0, 1000));
    // the tall rock (rock-high), a rock beside it (rock-left), and the ledge: the tip of the point
    back += g(rock(S, [[-60, 900], [-52, 650], [-2, 562], [92, 522], [206, 518], [276, 558], [306, 650], [316, 900]], {
      seed: 731, face: [142, 532, 104, 13], cracks: 'M30 640Q54 700 40 780M236 610Q222 670 250 750', moss: [[230, 840, 40], [10, 770, 22]]
    }), { filter: S.shadow('m') });
    back += g(rock(S, [[286, 890], [294, 794], [340, 760], [430, 752], [500, 772], [522, 890]], { seed: 732, face: [412, 766, 84, 11], moss: [[330, 860, 24]] }), { filter: S.shadow('s') });
    back += g(rock(S, [[-60, 1060], [-60, 862], [70, 844], [340, 834], [560, 838], [668, 852], [712, 886], [722, 952], [704, 1060]], {
      seed: 733, face: [372, 858, 330, 20], cracks: 'M96 930Q130 970 116 1020M430 920Q452 960 436 1010M610 906L632 980', moss: [[662, 946, 30], [250, 1000, 36]]
    }), { filter: S.shadow('m') });
    // the stake the raft is tied to, at the ledge's edge
    var stake = rect(640, 762, 18, 92, p.woodDark, { rx: 6 }) + rect(640, 762, 6, 92, p.woodLight, { opacity: 0.6, rx: 3 });
    var vine = mix(p.leaf, p.woodDark, 0.25);
    stake += stroke('M644 790q10 5 18 -1M643 803q10 5 18 -1', vine, 6);
    back += g(stake, { filter: S.shadow('s') });
    // the raft, riding low; the river lapping at the ledge and at the raft's end
    back += g(raft(S, BRAFT[0], BRAFT[1], BRAFT[2], BRAFT[3], BRAFT[4], 741), { filter: S.shadow('m') });
    back += spareFish(S, 1478, 846, BOARD['raft-3'].h);
    back += stroke('M716 890Q730 930 722 978', '#FFFFFF', 4, { opacity: 0.6 }) + stroke('M742 872q22 -8 46 0M756 930q20 -7 42 0M748 984q22 -8 48 0', '#FFFFFF', 3, { opacity: 0.4 });
    // the mooring vine: slack across the gap, or (tuft) pulled taut with the tuft in it, over the cast
    if (o.tuft === true) front += mooring(S, TUFT.board);
    else back += g(stroke('M655 792Q742 856 846 812', vine, 9) + path(leafD(712, 834, 26, 0.7, 10) + leafD(664, 798, 22, -2.2, 8) + leafD(800, 832, 22, 2.6, 8), p.leafMid), { filter: S.shadow('s') });
    var atWater = null;
    for (i = 0; i < cast.length; i++) if (cast[i].at === 'water') { atWater = cast[i]; break; }
    if (atWater) S.covers.water = swimCover(S, BOARD.water, R.svg, atWater, 975);
    if (plane === 'low') back += driftRight(airliner(S, 800, 170, 1.1, { rot: 5, span: 0.5 }));
    return { back: back, over: '', front: front };
  }

  function draw(S) {
    lateLight(S);
    return S.comp === 'low' ? drawLow(S) : S.comp === 'board' ? drawBoard(S) : drawMain(S);
  }

  // ------------------------------------------------------------------ the set

  var MAIN = {
    'rock-left': A(214, 902, 295), pebbles: A(398, 952, 312), 'rock-high': A(564, 648, 222, 'left', { elev: true }),
    'rock-right': A(764, 884, 282, 'left'), shore: A(940, 860, 268),
    'raft-1': A(1124, 812, 192), 'raft-2': A(1306, 798, 186), 'raft-3': A(1490, 812, 192, 'left'),
    water: A(1400, 962, 280, 'left')
  };
  var LOW = {
    'rock-left': A(410, 968, 340), 'rock-right': A(770, 958, 330, 'left'), 'rock-high': A(140, 820, 290, 'right', { elev: true }),
    shore: A(1010, 938, 300),
    'raft-1': A(1168, 856, 112), 'raft-2': A(1314, 850, 108), 'raft-3': A(1462, 856, 112, 'left'),
    water: A(1440, 968, 210, 'left')
  };

  // chapter 5: at the water's edge. The ledge and the raft's near end are side by side, so a cat is
  // the same size on either; a rock further back and the tall rock are at the left; the swimmer is
  // in front of the raft.
  var BOARD = {
    'rock-left': A(412, 768, 330), 'rock-right': A(292, 862, 420), 'rock-high': A(146, 534, 290, 'right', { elev: true }),
    shore: A(556, 864, 430), 'raft-1': A(1000, 892, 430), 'raft-2': A(1268, 886, 404, 'left'), 'raft-3': A(1452, 882, 384, 'left'),
    water: A(1160, 996, 280, 'left')
  };

  art.defineSet('crossing', {
    label: 'the Crossing at Gravelly Point', tod: 'day', draw: draw,
    cams: {
      wide: { box: [0, 0, 1600] },
      low: { box: [0, 0, 1600], comp: 'low' },
      rocks: { box: [60, 387, 980] },
      raft: { box: [800, 500, 800] },
      // chapter 5
      board: { box: [0, 0, 1600], comp: 'board' }
    },
    anchors: { main: MAIN, low: LOW, board: BOARD },
    opts: { plane: ['none', 'high', 'low'], pebbles: [true, false], tuft: [false, true], late: [false, true], fish: ['none', 'spare'] },
    defaults: { plane: 'high' }
  });

  // for the tests and the gallery: where chapter 5's things are (world units)
  art.crossingInfo = function () {
    function tuft(T) { var q = tuftAt(T); return { x: q[0], y: q[1], r: T.r, stake: T.a.slice(), raft: T.b.slice() }; }
    return { board: { horizon: BSHORE, ledge: 722, raft: { x0: BRAFT[0], top: BRAFT[2], bottom: BRAFT[3] } }, tuft: { main: tuft(TUFT.main), board: tuft(TUFT.board) } };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
