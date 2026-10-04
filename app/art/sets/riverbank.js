/* Potomac Crossing · app/art/sets/riverbank.js
 *
 * The set: the riverbank path (chapter 2, "Down by the river"), by day. A narrow path runs along
 * the water at the foot of a muddy bank; Crystal City's glass towers shine above the bank, and
 * upside down in the river too. The tallest tower has a little red light on its roof.
 *
 * Two compositions in the 1600 x 1000 world:
 *   main  the river path, seen from just out over the water: sky, towers, the bank top with its
 *         bushes, the muddy bank (high at the left, where the slide runs down it), the path, the
 *         river with the towers' rippled reflection. Cameras `path` (wide), `water` (close at the
 *         water's edge) and `slide` (the muddy bank down to the water) look at it.
 *   roof  `roof`: looking straight up the tallest tower to its roof, the red light and the sky.
 *
 * Options: `plane: 'low'` (an airplane low over the river, its shadow sliding across the water),
 * `roar: true` (jagged sound lines from the tallest tower's roof; the roarer is never seen),
 * `light` (the red light blinks; default true; false leaves it lit and still).
 *
 * `bank-top` is behind the lip of the bank (z: 'behind'): the bank is drawn in the `over` layer,
 * so a cat there shows only its head over the top. Registered with PC.art.defineSet
 * (app/art/scenes.js); the painters come from PC.art.kit.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});
  var K = art.kit;
  if (!K || !art.defineSet) return;

  var n = K.n, rng = K.rng, mix = K.mix, lerp = K.lerp;
  var rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke, pts = K.pts, poly = K.poly, g = K.g, tr = K.tr;
  var dot = K.dot, bladeD = K.bladeD, leafD = K.leafD, blob = K.blob, mound = K.mound, sparkleD = K.sparkleD;

  // ------------------------------------------------------------------ geometry (main)

  // A smooth curve through the points (Catmull-Rom), sampled about every `step` units.
  function spline(P, step) {
    var out = [];
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      var segs = Math.max(2, Math.round(Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)) / (step || 12)));
      for (var j = 0; j < segs; j++) {
        var t = j / segs, t2 = t * t, t3 = t2 * t, q = [];
        for (var c = 0; c < 2; c++) {
          q.push(0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3));
        }
        out.push(q);
      }
    }
    out.push(P[P.length - 1].slice());
    return out;
  }
  // y of a left-to-right curve at x
  function yAt(list, x) {
    if (x <= list[0][0]) return list[0][1];
    for (var i = 1; i < list.length; i++) {
      if (list[i][0] >= x) {
        var a = list[i - 1], b = list[i], t = (x - a[0]) / ((b[0] - a[0]) || 1);
        return a[1] + (b[1] - a[1]) * t;
      }
    }
    return list[list.length - 1][1];
  }

  // The lip of the bank: a high bluff at the left (where the slide starts), lower toward the right.
  var LIP = spline([[-30, 412], [150, 422], [300, 440], [430, 482], [580, 540], [760, 580], [960, 596], [1250, 604], [1630, 598]], 10);
  var FOOT = 724;           // where the bank meets the path
  var EDGE = 786;           // the water's edge (the front of the path)
  var BASE = 612;           // the towers' feet, hidden behind the bank top
  // The tallest tower, seen from the path (the red light sits on a mast on its roof).
  var TT = { x: 1012, w: 186, top: 112, base: BASE };
  var MAST = { x: TT.x + TT.w * 0.74, top: 62 };
  // The slide: a slick trough from the top of the bluff down the bank to the path (`slope` is halfway).
  var SLIDE = [[250, 442], [312, 530], [420, 640], [612, 734]];
  var SLOPE_T = 0.5;
  var SLOPE_AT = K.bez3(SLIDE[0], SLIDE[1], SLIDE[2], SLIDE[3], SLOPE_T);
  // a head over the bank: feet behind the lip, so the chin sits just at it
  var BT = { x: 540, h: 190 };
  BT.y = yAt(LIP, BT.x) + BT.h * 0.44;

  // The slide's centre line, top to water: down the bluff (SLIDE), then a short smear across the path.
  function slideLine() {
    var C = [], A3 = SLIDE[3];
    for (var i = 0; i <= 22; i++) C.push(K.bez3(SLIDE[0], SLIDE[1], SLIDE[2], SLIDE[3], i / 22));
    var E1 = [A3[0] + 56, A3[1] + 24], E2 = [A3[0] + 100, EDGE - 12];
    for (i = 1; i <= 5; i++) C.push(K.bez2(A3, E1, E2, i / 5));
    return C;
  }

  // ------------------------------------------------------------------ small painters

  // a soft, flat fair-weather cloud
  function cloud(S, cx, cy, w, seed) {
    var p = S.pal, r = rng(seed), d = '', dr = '';
    var day = !(S.tod === 'night' || S.tod === 'storm');
    if (!day) return '';
    var col = mix('#FFFFFF', p.sky[p.sky.length - 1], 0.25), under = mix(p.sky[2], '#FFFFFF', 0.45);
    for (var i = 0; i < 5; i++) {
      var t = i / 4, bx = cx + (t - 0.5) * w * 0.8, by = cy - Math.sin(t * Math.PI) * w * 0.1 + (r() - 0.5) * w * 0.04;
      var rx = w * (0.16 + r() * 0.08) * (1 - Math.abs(t - 0.5) * 0.6), ry = rx * 0.72;
      d += blob(bx, by, rx, ry, 8, r, 0.15, 0.25);
    }
    dr = path(blob(cx, cy + w * 0.07, w * 0.46, w * 0.07, 10, r, 0.12, 0.2), under, { opacity: 0.9 });
    return g(dr + path(d, col, { opacity: 0.94 }) + ell(cx, cy + w * 0.085, w * 0.44, w * 0.035, under, { opacity: 0.7 }), { 'class': 'pcs-drift', style: 'animation-duration:' + (34 + (seed % 9)) + 's' });
  }

  // the little red light, with its glow; `blink` uses the shared .pcs-blink
  function redLight(S, x, y, r, blink) {
    var night = S.tod === 'night' || S.tod === 'storm' || S.tod === 'dusk';
    var halo = circ(x, y, r * (night ? 7 : 5), S.radU([[0, '#FF6A5A', night ? 0.7 : 0.55], [0.35, '#FF5A4E', 0.22], [1, '#FF5A4E', 0]], x, y, r * (night ? 7 : 5)));
    var core = circ(x, y, r, '#FF4B3E') + circ(x - r * 0.3, y - r * 0.3, r * 0.4, '#FFD0C8', { opacity: 0.9 });
    return g(halo + core, { 'class': blink ? 'pcs-blink' : null });
  }

  // A roar from somewhere nobody can see: jagged sound arcs opening upward from (cx, cy), three
  // rings of them, the inner ones first (each pulses on the shared .pcs-pulse).
  function roarLines(S, cx, cy, r0, gap, k, seed, squash, avoid) {
    var r = rng(seed), out = '';
    for (var ring = 0; ring < 3; ring++) {
      var R = r0 + ring * gap, a0 = -172 + ring * 3, a1 = -8 - ring * 3, P = [];
      var steps = Math.max(8, Math.round(R * (a1 - a0) * Math.PI / 180 / (9 * k)));
      for (var j = 0; j <= steps; j++) {
        var a = (a0 + (a1 - a0) * j / steps) * Math.PI / 180, rr = R + (j % 2 ? 1 : -1) * 4.5 * k * (j === 0 || j === steps ? 0 : 1);
        P.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * (squash || 0.86)]);
      }
      // break each ring into three pieces, so it reads as sound and not as a fence, and leave a
      // gap round the red light (avoid: [x, y, r])
      var third = Math.round(steps / 3), parts = [], cur = [], d = '';
      for (var q = 0; q < P.length; q++) {
        var hide = avoid && Math.pow(P[q][0] - avoid[0], 2) + Math.pow(P[q][1] - avoid[1], 2) < avoid[2] * avoid[2];
        if (hide || (q && q % third === 0 && q < P.length - 2)) { if (cur.length > 1) parts.push(cur); cur = hide ? [] : [P[q]]; continue; }
        cur.push(P[q]);
      }
      if (cur.length > 1) parts.push(cur);
      for (q = 0; q < parts.length; q++) d += pts(parts[q]);
      if (!d) continue;
      out += g(stroke(d, '#2A2236', 11 * k, { opacity: 0.28 }) + stroke(d, '#FFFDF6', 6 * k),
        { 'class': 'pcs-pulse', style: 'animation-duration:1.2s;animation-delay:-' + (0.9 - ring * 0.3).toFixed(1) + 's' });
    }
    return out;
  }

  // the low airplane's shadow on the water: a long dark plane shape, flattened by the angle,
  // with streaks trailing behind it (it flies to the left)
  function planeShadow(S, x, y, s) {
    var p = S.pal, col = mix(p.shade, p.water, 0.25);
    var d = 'M' + n(x - 34 * s) + ' ' + n(y) + 'Q' + n(x - 30 * s) + ' ' + n(y - 2.4 * s) + ' ' + n(x - 20 * s) + ' ' + n(y - 2.6 * s) +
      'L' + n(x + 26 * s) + ' ' + n(y - 2.4 * s) + 'L' + n(x + 36 * s) + ' ' + n(y - 7 * s) + 'L' + n(x + 39 * s) + ' ' + n(y - 6.6 * s) +
      'L' + n(x + 34 * s) + ' ' + n(y + 0.6 * s) + 'Q' + n(x + 20 * s) + ' ' + n(y + 2.8 * s) + ' ' + n(x - 22 * s) + ' ' + n(y + 2.6 * s) + 'Z' +
      'M' + n(x - 8 * s) + ' ' + n(y - 1 * s) + 'L' + n(x + 6 * s) + ' ' + n(y - 1.4 * s) + 'L' + n(x + 22 * s) + ' ' + n(y + 9 * s) + 'L' + n(x + 12 * s) + ' ' + n(y + 9.4 * s) + 'Z' +
      'M' + n(x - 6 * s) + ' ' + n(y + 1 * s) + 'L' + n(x + 8 * s) + ' ' + n(y + 1.2 * s) + 'L' + n(x + 2 * s) + ' ' + n(y - 6 * s) + 'L' + n(x - 6 * s) + ' ' + n(y - 6 * s) + 'Z';
    var streaks = '';
    for (var i = 0; i < 5; i++) {
      var sy = y + (i - 2) * 2.6 * s, sx = x + (40 + (i % 2) * 10) * s;
      streaks += 'M' + n(sx) + ' ' + n(sy) + 'h' + n((26 + (i * 7) % 20) * s);
    }
    return g(path(d, col, { opacity: 0.42, filter: S.blur('pshadow', 2.2 * s / 7) }) + stroke(streaks, col, 1.4 * s, { opacity: 0.22 }), { 'class': 'pcs-drift', style: 'animation-duration:9s' });
  }

  // speed lines behind the low airplane
  function planeSpeed(S, x, y, s) {
    var r = rng(77), d = '';
    for (var i = 0; i < 5; i++) {
      var yy = (i - 2) * 3.4 + (r() - 0.5) * 1.2, x0 = 30 + r() * 6 + (i === 0 ? 4 : 0);
      d += 'M' + n(x0) + ' ' + n(yy) + 'h' + n(8 + r() * 10);
    }
    return g(g(stroke(d, '#FFFFFF', 1.1, { opacity: 0.75 }), { transform: tr(x, y, s, s) + ' rotate(-7)' }), { 'class': 'pcs-whoosh' });
  }

  // grass along the lip of the bank: a strip, tufts, and a few blades hanging over the edge
  function lipGrass(S, list, x0, x1, seed) {
    var p = S.pal, r = rng(seed), top = [], bot = [];
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      if (q[0] < x0 - 20 || q[0] > x1 + 20) continue;
      top.push([q[0], q[1] - 6 + Math.sin(q[0] * 0.07) * 2]);
      bot.push([q[0], q[1] + 14 + Math.sin(q[0] * 0.05 + 1) * 4]);
    }
    if (top.length < 2) return '';
    var band = pts(top.concat(bot.reverse())) + 'Z';
    var s = path(band, p.grass) + stroke(pts(top), p.grassLight, 4, { opacity: 0.85 });
    var a = '', b = '', hang = '';
    for (var x = x0; x < x1; x += 9 + r() * 10) {
      var y = yAt(list, x), h = 12 + r() * 20;
      var d = bladeD(x, y - 3, h, (r() - 0.5) * 16, 2.4);
      if (r() < 0.5) a += d; else b += d;
      if (r() < 0.1) hang += 'M' + n(x) + ' ' + n(y + 8) + 'q' + n(4 + r() * 6) + ' ' + n(6 + r() * 8) + ' ' + n(2 + r() * 6) + ' ' + n(16 + r() * 14);
    }
    return s + path(a, p.grassNear, { opacity: 0.95 }) + path(b, p.grassLight, { opacity: 0.9 }) + stroke(hang, p.grassNear, 2.4, { opacity: 0.9 });
  }

  // cattails and reeds rising from the water, framing a corner
  function reeds(S, x0, x1, base, hMax, seed, lean) {
    var p = S.pal, r = rng(seed), a = '', b = '', heads = '', stems = '';
    for (var i = 0; i < 16; i++) {
      var x = x0 + r() * (x1 - x0), h = hMax * (0.45 + r() * 0.55), l = (lean || 0) * h * 0.25 + (r() - 0.5) * h * 0.18;
      var d = bladeD(x, base, h, l, 6 + r() * 3);
      if (r() < 0.55) a += d; else b += d;
      if (i % 4 === 0) {
        var hx = x + l * 0.2, hy = base - h * 1.02;
        stems += 'M' + n(x) + ' ' + n(base) + 'Q' + n(x + l * 0.1) + ' ' + n(base - h * 0.6) + ' ' + n(hx) + ' ' + n(hy);
        heads += 'M' + n(hx - 8) + ' ' + n(hy + 6) + 'q0-46 8-48q8 2 8 48q-8 6-16 0z';
        stems += 'M' + n(hx) + ' ' + n(hy - 40) + 'v-16';
      }
    }
    return path(b, p.grassNear) + path(a, mix(p.grassNear, p.leafMid, 0.5)) + stroke(stems, p.grassNear, 4) +
      path(heads, mix(p.woodDark, '#000', 0.1)) + stroke(heads, p.rim, 1.5, { opacity: 0.25 });
  }

  // ------------------------------------------------------------------ MAIN: the river path

  function drawPath(S) {
    var p = S.pal, o = S.opts, back = '', over = '', front = '', r = rng(5101), i;
    var night = S.tod === 'night' || S.tod === 'storm';
    var mudLight = mix(p.wood, p.sand, 0.32), mudMid = mix(p.wood, p.woodDark, 0.15), mudDark = mix(p.woodDark, p.water, 0.22);

    // sky
    var low = S.tod === 'sunset' || S.tod === 'dusk' || S.tod === 'golden';   // a low sun sits just over the bluff
    back += K.sky(S, 0, 0, 1600, 660, { sun: low ? [250, 360] : [240, 150], sunR: low ? 520 : 430 });
    back += cloud(S, 520, 170, 300, 11) + cloud(S, 1420, 110, 240, 12) + cloud(S, 120, 330, 200, 13);
    // far airplanes, drifting down toward the airport
    back += K.plane(S, 860, 62, 0.9, 'left') + K.plane(S, 1500, 250, 0.6, 'left');

    // the towers: far ones in the haze, then Crystal City close behind the bank
    var far = [
      { x: 40, w: 140, top: 330, base: BASE, far: 0.7, cap: 'slant' }, { x: 230, w: 110, top: 380, base: BASE, far: 0.72 },
      { x: 600, w: 130, top: 330, base: BASE, far: 0.66, cap: 'round' }, { x: 890, w: 100, top: 360, base: BASE, far: 0.7, cap: 'slant' }, { x: 1196, w: 90, top: 330, base: BASE, far: 0.7 },
      { x: 1500, w: 140, top: 340, base: BASE, far: 0.7, cap: 'step' }
    ];
    var near = [
      { x: 486, w: 130, top: 318, base: BASE, far: 0.4, cap: 'slant' }, { x: 686, w: 168, top: 226, base: BASE, far: 0.3, cap: 'step' },
      { x: 1262, w: 150, top: 214, base: BASE, far: 0.3, cap: 'round' }, { x: 1452, w: 190, top: 300, base: BASE, far: 0.34 }
    ];
    back += K.towers(S, far);
    var city = K.towers(S, near) + tallest(S, TT);
    back += g(city, { filter: S.shadow('m') });
    // the red light (and the roar) on the tallest roof
    back += redLight(S, MAST.x, MAST.top, 7, o.light !== false);
    (S.keep = S.keep || []).push({ x: MAST.x - 40, y: MAST.top - 36, w: 80, h: 70 });
    if (o.roar) back += roarLines(S, TT.x + TT.w * 0.5, TT.top - 12, 62, 38, 0.85, 5113, 0.5, [MAST.x, MAST.top, 22]);

    // bushes and little trees along the top of the bank, hiding the towers' feet
    var bush = '';
    var tops = [[-60, 160, 70], [120, 330, 60], [300, 470, 54], [440, 640, 62], [600, 820, 58], [790, 1010, 52], [980, 1220, 56], [1190, 1420, 60], [1390, 1660, 64]];
    for (i = 0; i < tops.length; i++) {
      var bx0 = tops[i][0], bx1 = tops[i][1], bb = Math.max(yAt(LIP, bx0), yAt(LIP, bx1)) + 16, bt = Math.min(yAt(LIP, bx0), yAt(LIP, bx1)) - tops[i][2];
      var md = mound(bx0, bx1, bb, bt, 7, rng(5120 + i), 0.34, 0.2, 0.2);
      bush += md;
    }
    back += g(path(bush, p.rim, { transform: 'translate(0 -6)', opacity: 0.8 }) + path(bush, mix(p.leaf, p.leafMid, 0.4)), { filter: S.shadow('s') });
    var lv = '';
    for (i = 0; i < 90; i++) { var lx = r() * 1600, ly = yAt(LIP, lx) - 8 - r() * 44; lv += leafD(lx, ly, 10 + r() * 8, r() * 6.28, 3.4); }
    back += path(lv, p.leafLight, { opacity: 0.45 });

    // the path along the water
    var pathTop = [], pathBot = [];
    for (var x = -20; x <= 1620; x += 40) { pathTop.push([x, FOOT - 4 + Math.sin(x * 0.013) * 3]); pathBot.push([x, EDGE + Math.sin(x * 0.009 + 2) * 3]); }
    var pathD = pts(pathTop.concat(pathBot.slice().reverse())) + 'Z';
    var trail = mix(p.sand, p.stone, 0.45);
    back += path(pathD, S.lin('rbpath', [[0, mix(trail, p.woodDark, 0.18)], [0.35, trail], [1, mix(trail, p.stoneLight, 0.3)]]));
    var peb = '', peb2 = '', pud = '';
    for (i = 0; i < 70; i++) {
      var px = r() * 1600, py = FOOT + 8 + r() * (EDGE - FOOT - 14), pr = 2 + r() * 4;
      if (r() < 0.6) peb += blob(px, py, pr * 1.2, pr * 0.7, 6, r, 0.3, 0.3); else peb2 += blob(px, py, pr, pr * 0.6, 6, r, 0.3, 0.3);
    }
    back += path(peb, p.stoneDark, { opacity: 0.55 }) + path(peb2, p.stoneLight, { opacity: 0.8 });
    // puddles left by the storm, with sky in them
    [[880, 762, 46], [1330, 754, 34], [250, 768, 30]].forEach(function (q) {
      pud += ell(q[0], q[1], q[2], q[2] * 0.22, mix(p.sky[3], p.water, 0.3)) + ell(q[0] - q[2] * 0.25, q[1] - q[2] * 0.06, q[2] * 0.35, q[2] * 0.05, '#FFFFFF', { opacity: 0.6 });
    });
    back += pud;
    back += K.tufts(S, 0, 1600, FOOT - 2, FOOT + 10, 40, 5131, p.grassNear, p.grassLight, 0.9);

    // the river: the sky and the towers upside down in it
    var W = EDGE + 2;
    back += rect(0, W, 1600, 1000 - W, S.lin('rbwater', [[0, mix(p.sky[p.sky.length - 1], p.water, 0.3)], [0.45, mix(p.sky[2], p.water, 0.45)], [1, mix(p.sky[0], p.water, 0.62)]]));
    back += reflection(S, W, far, near);
    // the bank's dark edge, mirrored right under the stones
    back += rect(0, W, 1600, 12, mudDark, { opacity: 0.4 }) + rect(0, W + 12, 1600, 8, mudDark, { opacity: 0.15 });
    // ripples and glints
    var rip = '', rip2 = '', gl = '';
    for (i = 0; i < 30; i++) {
      var ry = W + 16 + Math.pow(r(), 1.25) * (1000 - W - 16), rw = 18 + (ry - W) * 0.4 * (0.5 + r());
      var rx = r() * 1600;
      if (r() < 0.55) rip += 'M' + n(rx) + ' ' + n(ry) + 'q' + n(rw / 2) + ' ' + n(-3) + ' ' + n(rw) + ' 0'; else rip2 += 'M' + n(rx) + ' ' + n(ry) + 'h' + n(rw * 0.7);
    }
    for (i = 0; i < 26; i++) { var gy = W + 20 + r() * (1000 - W - 30), gx = r() * 1600; gl += 'M' + n(gx) + ' ' + n(gy) + 'h' + n(10 + (gy - W) * 0.12); }
    back += stroke(rip, mix(p.water, p.shade, 0.35), 2.2, { opacity: 0.35 }) + stroke(rip2, '#FFFFFF', 2.2, { opacity: night ? 0.18 : 0.45 }) +
      stroke(gl, p.rim, 3, { opacity: night ? 0.3 : 0.8, 'class': 'pcs-glint' });
    // rings in the water where the slide comes out
    var sx0 = SLIDE[3][0] + 110, sy0 = EDGE + 22;
    back += stroke('M' + n(sx0 - 60) + ' ' + n(sy0) + 'A60 9 0 0 0 ' + n(sx0 + 60) + ' ' + n(sy0) + 'M' + n(sx0 - 100) + ' ' + n(sy0 + 4) + 'A100 15 0 0 0 ' + n(sx0 - 20) + ' ' + n(sy0 + 19) +
      'M' + n(sx0 + 30) + ' ' + n(sy0 + 18) + 'A100 15 0 0 0 ' + n(sx0 + 100) + ' ' + n(sy0 + 4), '#FFFFFF', 2.4, { opacity: night ? 0.2 : 0.55 });
    // stones along the water's edge
    back += K.stonePath(S, [[-30, EDGE + 2], [1630, EDGE + 2]], { size: 15, seed: 5141, y0: 600, y1: 1000 });

    // the low airplane, its shadow sliding over the water
    if (o.plane === 'low') {
      if (!night) back += planeShadow(S, 1040, 872, 7.4);   // no sun, no shadow
      back += planeSpeed(S, 560, 250, 6.4) + K.plane(S, 560, 250, 6.4, 'left');
    }

    // ripples round whoever floats at `water` (drawn over them, so they sit in the river)
    var wa = MAIN.water, swimmer = (S.cast || []).some(function (m) { return m && m.at === 'water'; });
    if (swimmer) S.covers.water = g(path('M' + n(wa.x - wa.h * 0.62) + ' ' + n(wa.y - 6) + 'A' + n(wa.h * 0.62) + ' ' + n(wa.h * 0.11) + ' 0 0 0 ' + n(wa.x + wa.h * 0.62) + ' ' + n(wa.y - 6) +
      'A' + n(wa.h * 0.5) + ' ' + n(wa.h * 0.05) + ' 0 0 1 ' + n(wa.x - wa.h * 0.62) + ' ' + n(wa.y - 6) + 'Z', mix(p.water, p.sky[2], 0.35), { opacity: 0.55 }) +
      stroke('M' + n(wa.x - wa.h * 0.66) + ' ' + n(wa.y - 4) + 'A' + n(wa.h * 0.66) + ' ' + n(wa.h * 0.12) + ' 0 0 0 ' + n(wa.x + wa.h * 0.66) + ' ' + n(wa.y - 4) +
        'M' + n(wa.x - wa.h * 0.86) + ' ' + n(wa.y + 6) + 'A' + n(wa.h * 0.86) + ' ' + n(wa.h * 0.16) + ' 0 0 0 ' + n(wa.x - wa.h * 0.2) + ' ' + n(wa.y + wa.h * 0.15) +
        'M' + n(wa.x + wa.h * 0.3) + ' ' + n(wa.y + wa.h * 0.15) + 'A' + n(wa.h * 0.86) + ' ' + n(wa.h * 0.16) + ' 0 0 0 ' + n(wa.x + wa.h * 0.86) + ' ' + n(wa.y + 6),
      '#FFFFFF', 3, { opacity: night ? 0.25 : 0.7 }));

    // ---- the bank (drawn over anyone behind its lip, so only a head shows at `bank-top`)
    var lipPts = LIP.map(function (q) { return [q[0], q[1] + 4]; });
    var footPts = [];
    for (x = 1630; x >= -30; x -= 40) footPts.push([x, FOOT + Math.sin(x * 0.02) * 4]);
    var bankD = pts(lipPts.concat(footPts)) + 'Z';
    var bank = path(bankD, S.lin('rbmud', [[0, mudLight], [0.55, mudMid], [1, mudDark]]));
    // the wet lower bank: a lumpy band of darker mud, its own paper layer
    var edgeP = [], k2 = 0;
    for (x = -30; x <= 1640; x += 46 + (k2++ % 3) * 14) edgeP.push([x, lerp(yAt(LIP, x), FOOT, 0.66) + Math.sin(x * 0.012 + 2) * 8 + (r() - 0.5) * 8]);
    var wetTop = K.scallops(edgeP, 800, 2000, 0.22, false).replace(/Z$/, '');
    bank += g(path(wetTop + 'L1640 ' + (FOOT + 8) + 'L-30 ' + (FOOT + 8) + 'Z', S.lin('rbwet', [[0, mix(mudMid, mudDark, 0.35)], [1, mudDark]])), { filter: S.shadow('s') });
    bank += stroke(wetTop, p.rim, 2, { opacity: night ? 0.1 : 0.3, transform: 'translate(0 -1.5)' });
    // little pools of rain on the wet mud, with sky in them
    var pools = '', poolHi = '';
    [[140, 0.86, 30], [760, 0.84, 38], [1180, 0.88, 26], [1490, 0.83, 34]].forEach(function (q) {
      var py0 = lerp(yAt(LIP, q[0]), FOOT, q[1]);
      pools += ell(q[0], py0, q[2], q[2] * 0.16, mix(p.sky[3], p.water, 0.35));
      poolHi += 'M' + n(q[0] - q[2] * 0.6) + ' ' + n(py0 - 1) + 'h' + n(q[2] * 0.5);
    });
    bank += pools + stroke(poolHi, '#FFFFFF', 2, { opacity: night ? 0.2 : 0.7 });
    // pebbles, roots, wet shine and grass clumps on the slope
    var bp = '', roots = '', shine = '', clumps = '';
    for (i = 0; i < 40; i++) {
      var qx = r() * 1600, qy = lerp(yAt(LIP, qx) + 26, FOOT - 8, r());
      bp += blob(qx, qy, 3 + r() * 5, 2 + r() * 3, 6, r, 0.3, 0.3);
    }
    for (i = 0; i < 5; i++) {
      var rxx = 60 + r() * 1480, ryy = yAt(LIP, rxx) + 16, rl = 16 + r() * 22, rd = r() < 0.5 ? -1 : 1;
      roots += 'M' + n(rxx) + ' ' + n(ryy) + 'q' + n(rd * rl * 0.4) + ' ' + n(rl * 0.5) + ' ' + n(rd * rl * 0.1) + ' ' + n(rl) + 'q' + n(-rd * 4) + ' ' + n(6) + ' ' + n(-rd * 2) + ' ' + n(10);
    }
    for (i = 0; i < 18; i++) {
      var sx = r() * 1600, sy = lerp(yAt(LIP, sx) + 40, FOOT - 6, 0.5 + r() * 0.5);
      shine += 'M' + n(sx) + ' ' + n(sy) + 'q' + n(10) + ' ' + n(-3) + ' ' + n(18 + r() * 14) + ' ' + n(-1);
    }
    for (i = 0; i < 7; i++) {
      var cxx = 80 + r() * 1440, cyy = lerp(yAt(LIP, cxx) + 30, FOOT, 0.25 + r() * 0.3);
      for (var b2 = 0; b2 < 5; b2++) clumps += bladeD(cxx + (b2 - 2) * 4, cyy, 10 + r() * 12, (b2 - 2) * 4, 2);
    }
    bank += path(bp, p.stone, { opacity: 0.7 }) + stroke(roots, p.woodDark, 3, { opacity: 0.8 }) + stroke(shine, p.rim, 2.2, { opacity: night ? 0.15 : 0.5 }) + path(clumps, p.grassNear, { opacity: 0.9 });
    // the slide: a smooth, slick trough of wet mud worn down the bluff, shining where it's wettest,
    // fanning out across the path to the water
    var wet = mix(mudMid, mudDark, 0.45), wetHi = mix(mudLight, p.sky[p.sky.length - 1], 0.35);
    var C = slideLine(), Lft = [], Rgt = [], rs = rng(5155), nTop = 23;
    for (i = 0; i < C.length; i++) {
      var q0 = C[Math.max(0, i - 1)], q1 = C[Math.min(C.length - 1, i + 1)], tx = q1[0] - q0[0], ty = q1[1] - q0[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
      var u = i / (nTop - 1), wdt = (i < nTop ? lerp(40, 84, Math.sqrt(u)) : lerp(84, 96, (i - nTop + 1) / (C.length - nTop))) / 2;
      Lft.push([C[i][0] + ty / tl * wdt, C[i][1] - tx / tl * wdt]);
      Rgt.push([C[i][0] - ty / tl * wdt, C[i][1] + tx / tl * wdt]);
    }
    var top0 = C[0], last = C[C.length - 1];
    var trough = pts(Lft) + 'Q' + n(last[0] + 40) + ' ' + n(last[1] + 18) + ' ' + n(Rgt[Rgt.length - 1][0]) + ' ' + n(Rgt[Rgt.length - 1][1]) +
      pts(Rgt.slice().reverse()).replace(/^M/, 'L') + 'Q' + n(top0[0] - 10) + ' ' + n(top0[1] - 26) + ' ' + n(Lft[0][0]) + ' ' + n(Lft[0][1]) + 'Z';
    var sl = path(trough, S.lin('rbslide', [[0, mix(wet, mudMid, 0.4)], [0.75, wet], [1, mix(wet, trail, 0.35)]]));
    // shade inside the upper (left) wall, then the wet shine down the middle
    var inner = [], shine = [], shine2 = [];
    for (i = 0; i < C.length; i++) inner.push([lerp(Lft[i][0], C[i][0], 0.45), lerp(Lft[i][1], C[i][1], 0.45)]);
    sl += path(pts(Lft) + pts(inner.slice().reverse()).replace(/^M/, 'L') + 'Z', mix(wet, p.shade, 0.25), { opacity: 0.3 });
    for (i = 3; i < C.length - 2; i++) {
      var f = Math.sin((i - 3) / (C.length - 5) * Math.PI), off = 0.12;
      shine.push([lerp(C[i][0], Rgt[i][0], off) + (Lft[i][0] - C[i][0]) * 0.1 * f, lerp(C[i][1], Rgt[i][1], off) + (Lft[i][1] - C[i][1]) * 0.1 * f]);
      shine2.push([lerp(C[i][0], Rgt[i][0], off + 0.42 * f), lerp(C[i][1], Rgt[i][1], off + 0.42 * f)]);
    }
    sl += path(pts(shine) + pts(shine2.slice().reverse()).replace(/^M/, 'L') + 'Z', wetHi, { opacity: night ? 0.15 : 0.6 });
    sl += path(sparkleD(C[7][0] + 6, C[7][1] + 4, 9) + sparkleD(C[17][0] + 10, C[17][1] + 4, 7), '#FFFFFF', { opacity: night ? 0.3 : 0.85, 'class': 'pcs-glint' });
    // on the bank it is a dark trough; across the path, a thin wet smear to the stones, where the river takes over
    var smearCol = mix(trail, mudMid, 0.45);
    var smear = path(trough, smearCol) + path(pts(shine) + pts(shine2.slice().reverse()).replace(/^M/, 'L') + 'Z', wetHi, { opacity: night ? 0.12 : 0.45 }) +
      path(blob(Rgt[nTop + 1][0] + 30, Rgt[nTop + 1][1] + 10, 14, 5, 7, rs, 0.3, 0.3) + blob(Lft[nTop + 2][0] - 26, Lft[nTop + 2][1] + 6, 10, 4, 7, rs, 0.3, 0.3), smearCol);
    bank += g(sl, { 'clip-path': S.clip('rbslide', rect(-60, 0, 1720, FOOT + 4, '#fff')) }) +
      g(smear, { 'clip-path': S.clip('rbsmear', rect(-60, FOOT + 4, 1720, EDGE - FOOT - 6, '#fff')) });
    // otter paw prints beside the top of the slide
    var paws = '';
    [[214, 452], [196, 438], [176, 448], [158, 434]].forEach(function (q) {
      paws += dot(q[0], q[1], 4.2) + dot(q[0] - 5, q[1] - 6, 1.6) + dot(q[0], q[1] - 7.5, 1.6) + dot(q[0] + 5, q[1] - 6, 1.6);
    });
    over += g(bank, { filter: S.shadow('m') });
    over += g(lipGrass(S, LIP, -30, 1630, 5161), { filter: S.shadow('s') });
    over += path(paws, mudDark, { opacity: 0.7 });

    // reeds framing the bottom corners
    front += g(reeds(S, -40, 150, 1012, 300, 5171, 0.4) + reeds(S, 1450, 1640, 1012, 260, 5172, -0.4), { filter: S.shadow('m') });
    return { back: back, over: over, front: front };
  }

  // The tallest tower: a plain glass slab with a flat roof, a little hut on top and a mast
  // for the red light.
  function tallest(S, t) {
    var p = S.pal, s = K.tower(S, { x: t.x, w: t.w, top: t.top, base: t.base, far: 0.14 });
    var roofCol = mix(p.glassBot, p.shade, 0.25), lip = mix(p.glassEdge, p.stoneLight, 0.4);
    s += rect(t.x - 4, t.top - 8, t.w + 8, 12, roofCol, { rx: 3 }) + rect(t.x - 4, t.top - 8, t.w + 8, 3.5, lip, { rx: 2, opacity: 0.9 });
    s += rect(t.x + t.w * 0.14, t.top - 34, t.w * 0.3, 27, roofCol, { rx: 3 }) + rect(t.x + t.w * 0.14, t.top - 34, t.w * 0.3, 3, lip, { opacity: 0.8 });
    s += rect(MAST.x - 2.5, MAST.top, 5, t.top - MAST.top - 6, roofCol) + rect(MAST.x - 7, t.top - 14, 14, 7, roofCol, { rx: 2 });
    return s;
  }

  // A tower as the river shows it: its outline and glass colour, a few floors, the bright edge;
  // no windows (the ripples break them up).
  function ghostTower(S, t) {
    var p = S.pal, far = t.far || 0, x = t.x, w = t.w, top = t.top, base = t.base, d;
    var cTop = mix(p.glassTop, p.haze, far * 0.55), cBot = mix(p.glassBot, p.haze, far * 0.42);
    if (t.cap === 'step') {
      var sw = w * 0.62, sx = x + (w - sw) / 2;
      d = 'M' + n(x) + ' ' + n(base) + 'V' + n(top + 70) + 'H' + n(sx) + 'V' + n(top) + 'H' + n(sx + sw) + 'V' + n(top + 70) + 'H' + n(x + w) + 'V' + n(base) + 'Z';
    } else if (t.cap === 'slant') {
      d = 'M' + n(x) + ' ' + n(base) + 'V' + n(top + w * 0.35) + 'L' + n(x + w) + ' ' + n(top) + 'V' + n(base) + 'Z';
    } else if (t.cap === 'round') {
      d = 'M' + n(x) + ' ' + n(base) + 'V' + n(top + w * 0.3) + 'Q' + n(x) + ' ' + n(top) + ' ' + n(x + w / 2) + ' ' + n(top) + 'Q' + n(x + w) + ' ' + n(top) + ' ' + n(x + w) + ' ' + n(top + w * 0.3) + 'V' + n(base) + 'Z';
    } else {
      d = 'M' + n(x) + ' ' + n(base) + 'V' + n(top) + 'H' + n(x + w) + 'V' + n(base) + 'Z';
    }
    var floors = '';
    for (var y = base - 44; y > top + 30; y -= 44) floors += 'M' + n(x + 4) + ' ' + n(y) + 'H' + n(x + w - 4);
    return path(d, S.lin('rbg' + Math.round(far * 5), [[0, cTop], [1, cBot]])) + stroke(floors, p.mullion, 3, { opacity: 0.18 }) +
      rect(x + w - Math.max(4, w * 0.05), top + (t.cap === 'slant' ? 0 : t.cap === 'round' ? w * 0.3 : t.cap === 'step' ? 70 : 0), Math.max(4, w * 0.05), base - top, p.glassEdge, { opacity: 0.5 }) +
      poly([[x, base - (base - top) * 0.55], [x + w, base - (base - top) * 0.7], [x + w, base - (base - top) * 0.6], [x, base - (base - top) * 0.45]], p.refl, { opacity: 0.25 });
  }

  // The towers upside down in the river: drawn once into <defs>, then shown in horizontal bands,
  // each nudged sideways a little, so the reflection ripples. Squashed toward the water so the
  // towers' upside-down tops (and the tallest one's red light) show above the bottom of the panel.
  function reflection(S, W, far, near) {
    var p = S.pal, k = 0.36, i;
    var inner = rect(-20, BASE - 14, 1640, 34, mix(p.leaf, p.water, 0.25));
    for (i = 0; i < far.length; i++) inner += ghostTower(S, far[i]);
    for (i = 0; i < near.length; i++) inner += ghostTower(S, near[i]);
    var roofCol = mix(p.glassBot, p.shade, 0.25);
    inner += ghostTower(S, { x: TT.x, w: TT.w, top: TT.top, base: TT.base, far: 0.14 }) +
      rect(TT.x - 4, TT.top - 8, TT.w + 8, 12, roofCol) + rect(TT.x + TT.w * 0.14, TT.top - 34, TT.w * 0.3, 27, roofCol) +
      rect(MAST.x - 3, MAST.top, 6, TT.top - MAST.top, roofCol) + g(circ(MAST.x, MAST.top, 12, '#FF5A4E'), { 'class': S.opts.light !== false ? 'pcs-blink' : null });
    var id = S.id('rbrefl');
    S.defs.push('<g id="' + id + '" transform="translate(0 ' + n(W) + ') scale(1 ' + n(-k) + ') translate(0 ' + n(-BASE) + ')">' + inner + '</g>');
    var out = '', lines = '', lines2 = '', y = W, r = rng(5191);
    i = 0;
    while (y < 1000) {
      var bh = 6 + (y - W) * 0.1, dx = Math.sin(i * 2.3 + 0.5) * (2.5 + (y - W) * 0.05);
      var clip = S.clip('rbband' + i, rect(-40, y, 1680, bh + 0.5, '#fff'));
      out += g('<use href="#' + id + '" x="' + n(dx) + '"/>', { 'clip-path': clip });
      // a broken ripple line along some of the seams
      for (var x = -40 + r() * 120; x < 1600; x += 90 + r() * 160) {
        var L = 30 + r() * (60 + (y - W) * 0.5);
        if (i % 2) lines += 'M' + n(x) + ' ' + n(y) + 'h' + n(L); else lines2 += 'M' + n(x) + ' ' + n(y) + 'h' + n(L * 0.7);
      }
      y += bh; i++;
    }
    var night = S.tod === 'night' || S.tod === 'storm';
    return g(out, { opacity: night ? 0.8 : 0.78 }) + rect(0, W, 1600, 1000 - W, S.lin('rbtint', [[0, p.water, 0.05], [1, p.water, 0.35]])) +
      stroke(lines, '#FFFFFF', 2, { opacity: night ? 0.12 : 0.32 }) + stroke(lines2, mix(p.water, p.shade, 0.4), 2, { opacity: 0.2 });
  }

  // ------------------------------------------------------------------ ROOF: looking up the tallest tower

  // Front face of the tower in strong perspective: wide at the bottom of the panel, narrow at the roof.
  var ROOF = { bl: 470, br: 1130, tl: 650, trr: 950, top: 250, side: 150, sideTop: 54 };

  function drawRoof(S) {
    var p = S.pal, o = S.opts, back = '', r = rng(5201), i;
    var night = S.tod === 'night' || S.tod === 'storm';
    var R = ROOF;
    var low = S.tod === 'sunset' || S.tod === 'dusk' || S.tod === 'golden';   // looking up, a low sun is only a glow behind the bushes
    // the same way the path camera faces (toward the bank and the towers), so the sun is at the
    // upper left here too, as in the frames either side; the left cloud keeps clear of it
    back += K.sky(S, 0, 0, 1600, 1000, { sun: low ? [140, 900] : [270, 150], sunR: low ? 700 : 560, starDepth: 0.8 });
    back += cloud(S, 470, 340, 300, 21) + cloud(S, 1260, 420, 300, 22) + cloud(S, 150, 560, 220, 23);
    back += K.plane(S, 1180, 90, 1.1, 'left');
    // neighbouring towers leaning in from the edges, lower than the tallest
    function lean(list, ang) { return g(K.towers(S, list), { transform: 'translate(0 1000) skewX(' + ang + ') translate(0 -1000)' }); }
    back += g(lean([{ x: -180, w: 330, top: 380, base: 1000, far: 0.18, cap: 'slant' }, { x: 120, w: 190, top: 560, base: 1000, far: 0.32 }], -14) +
      lean([{ x: 1300, w: 200, top: 520, base: 1000, far: 0.32, cap: 'round' }, { x: 1460, w: 320, top: 330, base: 1000, far: 0.18, cap: 'step' }], 14), { filter: S.shadow('m') });

    // the tallest tower
    var t = '';
    var face = 'M' + R.bl + ' 1010L' + R.tl + ' ' + R.top + 'H' + R.trr + 'L' + R.br + ' 1010Z';
    var sideD = 'M' + R.br + ' 1010L' + R.trr + ' ' + R.top + 'L' + (R.trr + R.sideTop) + ' ' + (R.top + 8) + 'L' + (R.br + R.side) + ' 1010Z';
    t += path(face, S.lin('rbface', [[0, mix(p.glassTop, p.sky[0], 0.25)], [0.6, p.glassTop], [1, p.glassBot]]));
    t += path(sideD, S.lin('rbside', [[0, mix(p.glassBot, p.sky[0], 0.2)], [1, mix(p.glassBot, p.shade, 0.3)]]));
    // floors: closer together toward the roof
    var floors = '', sideFloors = '', lit = '', y = 1000, gap = 64, rows = [];
    while (y > R.top + 6) { rows.push(y); y -= gap; gap *= 0.93; if (gap < 9) gap = 9; }
    function xl(yy) { return lerp(R.bl, R.tl, (1010 - yy) / (1010 - R.top)); }
    function xr(yy) { return lerp(R.br, R.trr, (1010 - yy) / (1010 - R.top)); }
    function xs(yy) { return lerp(R.br + R.side, R.trr + R.sideTop, (1010 - yy) / (1010 - R.top)); }
    rows.forEach(function (yy) {
      floors += 'M' + n(xl(yy)) + ' ' + n(yy) + 'H' + n(xr(yy));
      sideFloors += 'M' + n(xr(yy)) + ' ' + n(yy) + 'L' + n(xs(yy)) + ' ' + n(yy + 6 * (yy - R.top) / (1010 - R.top) + 2);
    });
    var cols = 12, mull = '';
    for (i = 1; i < cols; i++) {
      var u = i / cols;
      mull += 'M' + n(lerp(R.bl, R.br, u)) + ' 1010L' + n(lerp(R.tl, R.trr, u)) + ' ' + R.top;
    }
    for (i = 1; i < rows.length; i++) {
      for (var c = 0; c < cols; c++) {
        if (p.litP >= 0.1 && r() < p.litP * 1.2) {
          var y0 = rows[i], y1 = rows[i - 1], u0 = c / cols, u1 = (c + 1) / cols;
          lit += pts([[lerp(xl(y1), xr(y1), u0) + 4, y1 - 3], [lerp(xl(y1), xr(y1), u1) - 4, y1 - 3], [lerp(xl(y0), xr(y0), u1) - 4, y0 + 3], [lerp(xl(y0), xr(y0), u0) + 4, y0 + 3]]) + 'Z';
        }
      }
    }
    t += path(lit, p.lit, { opacity: 0.85 });
    t += stroke(floors, p.mullion, 2.2, { opacity: 0.4 }) + stroke(mull, p.mullion, 2.6, { opacity: 0.35 }) + stroke(sideFloors, p.mullion, 2, { opacity: 0.35 });
    // the sky and clouds shining in the glass
    t += path('M' + n(xl(900)) + ' 900L' + n(xl(640)) + ' 640L' + n(xr(560)) + ' 560L' + n(xr(800)) + ' 800Z', p.refl, { opacity: night ? 0.12 : 0.32 });
    t += path('M' + n(xl(560)) + ' 560L' + n(xl(500)) + ' 500L' + n(xr(440)) + ' 440L' + n(xr(470)) + ' 470Z', p.refl, { opacity: night ? 0.1 : 0.26 });
    t += path(blob(lerp(xl(760), xr(760), 0.35), 760, 110, 34, 9, rng(5211), 0.2, 0.3), '#FFFFFF', { opacity: night ? 0.05 : 0.22 });
    t += stroke('M' + R.br + ' 1010L' + R.trr + ' ' + R.top, p.glassEdge, 6, { opacity: 0.7 });
    // the roof: a ledge, a little hut, the mast and the red light
    var roofCol = mix(p.glassBot, p.shade, 0.3), ledge = mix(p.glassEdge, p.stoneLight, 0.4);
    t += path('M' + n(R.tl - 16) + ' ' + n(R.top + 6) + 'L' + n(R.tl - 8) + ' ' + n(R.top - 18) + 'H' + n(R.trr + 10) + 'L' + n(R.trr + R.sideTop + 8) + ' ' + n(R.top - 8) +
      'L' + n(R.trr + R.sideTop + 6) + ' ' + n(R.top + 12) + 'L' + n(R.trr + 12) + ' ' + n(R.top + 6) + 'Z', roofCol);
    t += stroke('M' + n(R.tl - 8) + ' ' + n(R.top - 18) + 'H' + n(R.trr + 10) + 'L' + n(R.trr + R.sideTop + 8) + ' ' + n(R.top - 8), ledge, 4, { opacity: 0.9 });
    t += path('M686 ' + n(R.top - 18) + 'V' + n(R.top - 66) + 'Q686 ' + n(R.top - 72) + ' 692 ' + n(R.top - 72) + 'H782Q788 ' + n(R.top - 72) + ' 788 ' + n(R.top - 66) + 'V' + n(R.top - 18) + 'Z', roofCol);
    t += rect(686, R.top - 72, 102, 5, ledge, { rx: 2, opacity: 0.85 });
    t += path('M892 ' + n(R.top - 18) + 'L897 ' + n(R.top - 150) + 'H903L908 ' + n(R.top - 18) + 'Z', roofCol) + rect(886, R.top - 30, 28, 12, roofCol, { rx: 3 });
    back += g(t, { filter: S.shadow('l') });
    back += redLight(S, 900, R.top - 158, 14, o.light !== false);
    (S.keep = S.keep || []).push({ x: 620, y: R.top - 230, w: 360, h: 250 });
    if (o.roar) back += roarLines(S, 800, R.top - 30, 120, 52, 1.9, 5221, 0.72, [900, R.top - 158, 46]);
    if (o.plane === 'low') back += planeSpeed(S, 330, 470, 6) + K.plane(S, 330, 470, 6, 'left');
    // the top of the bank, seen from the path below: bushes along the bottom of the panel
    var backBush = mound(-80, 1680, 1060, 800, 13, rng(5232), 0.34, 0.35, 0.3), bush = mound(-120, 1720, 1080, 880, 17, rng(5231), 0.34, 0.3, 0.3);
    var lv = '', lv2 = '';
    for (i = 0; i < 70; i++) lv += leafD(r() * 1600, 905 + r() * 100, 14 + r() * 10, r() * 6.28, 4.5);
    for (i = 0; i < 40; i++) lv2 += leafD(r() * 1600, 830 + r() * 60, 12 + r() * 8, r() * 6.28, 4);
    back += g(path(backBush, p.rim, { transform: 'translate(0 -7)', opacity: 0.7 }) + path(backBush, p.leafMid) + path(lv2, p.leafLight, { opacity: 0.5 }), { filter: S.shadow('s') });
    back += g(path(bush, p.rim, { transform: 'translate(0 -7)', opacity: 0.8 }) + path(bush, mix(p.leaf, p.leafMid, 0.25)) + path(lv, p.leafLight, { opacity: 0.45 }) +
      K.flowers(S, 0, 1600, 930, 990, 14, 5233, '#FFF6EA'), { filter: S.shadow('m') });
    // (all in `back`: the cats at the bottom corners stand in front of the bushes)
    return { back: back, over: '', front: '' };
  }

  function draw(S) { return S.comp === 'roof' ? drawRoof(S) : drawPath(S); }

  // ------------------------------------------------------------------ the set

  var MAIN = {
    'path-left': K.anchor(790, 764, 200),
    'path-right': K.anchor(1140, 764, 200, 'left'),
    water: K.anchor(930, 906, 262),
    'bank-top': K.anchor(BT.x, Math.round(BT.y), BT.h, 'right', { z: 'behind', elev: true }),
    slope: K.anchor(Math.round(SLOPE_AT[0]), Math.round(SLOPE_AT[1]), 196, 'right', { elev: true })
  };

  art.defineSet('riverbank', {
    label: 'the riverbank path', tod: 'day', draw: draw,
    cams: {
      path: { box: [0, 0, 1600] },
      water: { box: [580, 562, 700] },
      roof: { box: [0, 0, 1600], comp: 'roof' },
      slide: { box: [0, 300, 1000] }
    },
    anchors: {
      main: MAIN,
      // the roof shot: two cats at the bottom corners, looking up with us
      roof: { 'path-left': K.anchor(250, 1000, 330), 'path-right': K.anchor(1350, 1000, 330, 'left') }
    },
    opts: { plane: ['none', 'low'], roar: [false, true], light: [true, false] },
    defaults: { plane: 'none', roar: false, light: true }
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
