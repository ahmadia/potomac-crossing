/* Potomac Crossing · app/art/sets/bridge.js
 *
 * The set: the Old Bridge (chapter 2), the rail bridge's near (Virginia) end, by day: old stone
 * legs, an iron truss on top, the river brown and swirly after the storm, the reeds squashed flat.
 *
 * Four compositions in the 1600 x 1000 world, one per camera (docs/build.md, "Art vocabulary,
 * chapter 2"), each camera showing the whole of its own:
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
 *          `eyes` shows two big round shining eyes ('open'), half closed ('blink'), or nothing.
 *          Anchor: `near` (big, bottom left, looking in; a ridge of mud hides its paws).
 *
 * Options: `train: true` (an Ironsnake crossing on top: the whole train in `bank`, its cars and
 * wheels right overhead in `mouth`, grit shaken down in `under` and `back`), `eyes` ('none' |
 * 'open' | 'blink', drawn in `back`, and small in `under`; the render's `keep` names them so the
 * lettering stays off), `drag` (default true), `drips` (default true; they fall with the shared
 * pcs-float animation, so reduced motion leaves them hanging).
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

  function drawBank(S) {
    var p = S.pal, o = S.opts, c = cols(S), back = '', over = '', front = '', r = rng(401), i, x, y;
    // sky, soft clouds blowing away after the storm, an airplane drifting down toward the river
    back += K.sky(S, 0, 0, 1600, 640, { sun: [1430, 130], sunR: 460 });
    var cl = blob(1130, 250, 130, 34, 10, rng(402), 0.25, 0.32) + blob(1220, 236, 90, 30, 9, rng(403), 0.25, 0.32) + blob(760, 120, 100, 26, 9, rng(404), 0.25, 0.32) + blob(820, 112, 70, 24, 9, rng(405), 0.25, 0.32);
    back += path(cl, mix(p.sky[1], '#FFFFFF', 0.4), { transform: 'translate(0 6)', opacity: 0.7 }) + path(cl, '#FFFFFF', { opacity: 0.8 });
    back += K.plane(S, 960, 196, 0.9, 'left');
    // the far shore: a low line of trees, and the Needle
    var shore = mix(p.leaf, p.haze, 0.6);
    back += path(mound(380, 1720, 602, 556, 14, rng(406), 0.3, 0.3, 0.3), shore);
    back += path('M1372 600L1379 452L1386 440L1393 452L1400 600Z', mix(p.haze, p.stoneDark, 0.3)) + rect(1388, 452, 5, 148, mix(p.haze, '#FFFFFF', 0.4), { opacity: 0.7 });
    // the river
    back += riverWater(S, c, 0, 598, 1600, 1000, { key: 'bank', lines: 54, swirls: 20, debris: 8 });
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
    // reeds standing along the water's edge (a gap where something came up out of the river)
    var spots = [];
    for (x = 570; x < 1650; x += 9 + r() * 10) {
      if (o.drag !== false && Math.abs(x - 925) < 75) continue;
      y = yOn(EDGE, x) + 4 + r() * 24;
      spots.push([x, y, (60 + r() * 60) * clamp((y - 640) / 240, 0.5, 1.2)]);
    }
    back += g(reedBed(S, c, spots, { seed: 415, lean: 0.25 }), { filter: S.shadow('s') });
    // Riffle's rock at the shadow's edge
    over += g(rock(S, c, 492, 780, 124, 64, 416, { shadeLeft: 0.35 }), { filter: S.shadow('s') });
    // reeds in front of a cat among the reeds
    S.covers.reeds = flatReeds(S, c, [[950, 882, 40, -0.3], [980, 888, 46, -2.6], [1030, 884, 38, -0.5], [1060, 890, 30, 3.0], [920, 886, 32, 0.2]]) +
      reedBed(S, c, [[904, 892, 74], [1092, 894, 70], [1112, 896, 56]], { seed: 417, lean: 0.4 });
    // framing reeds in the bottom corners
    var fr = [];
    for (i = 0; i < 26; i++) fr.push([-40 + r() * 170, 994 + r() * 20, 150 + r() * 170]);
    for (i = 0; i < 24; i++) fr.push([1460 + r() * 190, 994 + r() * 20, 140 + r() * 160]);
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
    fl += path(bs, c.dark2) + stroke(bsh, c.dark4, 2, { opacity: 0.5 });
    // the dark gathers toward the back and the right; daylight warms the mud by the water
    fl += path('M-10 470H1610V1010H-10Z', S.linU([[0, c.dark0, 0], [0.4, c.dark0, 0.2], [1, c.dark0, 0.6]], 420, 1000, 1300, 520));
    fl += ell(240, 940, 480, 170, S.radU([[0, c.warm, 0.32], [1, c.warm, 0]], 240, 940, 480));
    back += g(fl, { 'clip-path': fClip });
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
    // dark clods of mud in the near right corner
    front += g(path(blob(1560, 1000, 200, 60, 10, rng(606), 0.25, 0.3) + blob(1380, 1020, 120, 36, 9, rng(607), 0.25, 0.3), mix(c.dark1, c.mudDk, 0.3)) +
      stroke('M1370 970q90 -36 230 -30', c.dark4, 3, { opacity: 0.4 }), { filter: S.shadow('m') });
    // the rain only shows in the daylight at the side
    S.weatherClip = S.clip('brurain', path(side, '#fff'));
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ BACK: the very back of the dark

  var B_MARKS = [[640, 1040], [720, 880], [880, 760], [1010, 690]];

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
    fl += path(fd, S.linU([[0, c.dark0, 0.55], [0.5, c.dark0, 0.2], [1, c.dark0, 0]], 0, 680, 0, 1000));
    back += g(fl, { 'clip-path': S.clip('brbfloor', path(fd, '#fff')) });
    // the beam overhead, warm daylight along its lower edge from the way she came in
    back += path(quad([[-10, -10], [1610, -10], [1610, 86], [-10, 122]]), S.linU([[0, c.dark2], [1, c.dark1]], 0, 0, 0, 122));
    back += path(quad([[-10, 104], [1610, 72], [1610, 92], [-10, 128]]), c.dark2);
    var riv = '';
    for (x = 20; x < 1610; x += 44) riv += dot(x, 40 - x * 0.012, 4.5) + dot(x, 98 - x * 0.02, 4);
    back += path(riv, c.dark3) + stroke(pts([[-10, 128], [1610, 92]]), S.linU([[0, c.warm, 0.7], [0.5, c.warm, 0.15], [1, c.warm, 0]], 0, 0, 1600, 0), 4);
    // daylight from behind, warming the near edge of things
    back += rect(-10, 500, 900, 520, S.radU([[0, c.warm, 0.3], [0.55, c.warm, 0.08], [1, c.warm, 0]], -60, 1080, 760));
    // the eyes (or only the dark), with their shine in a little puddle below
    if (o.eyes === 'open' || o.eyes === 'blink') {
      back += eyePair(S, c, 1040, 446, 44, 176, o.eyes);
      back += puddle(S, 1030, 772, 120, 16, 702, mix(c.dark0, '#0A1020', 0.4), c.dark3);
      back += ell(964, 772, 6, 2.5, '#FFD98A', { opacity: o.eyes === 'blink' ? 0.35 : 0.7 }) + ell(1104, 772, 6, 2.5, '#FFD98A', { opacity: o.eyes === 'blink' ? 0.35 : 0.7 });
      (S.keep = S.keep || []).push({ x: 840, y: 370, w: 400, h: 150 });
    } else {
      back += puddle(S, 1030, 772, 120, 16, 702, mix(c.dark0, '#0A1020', 0.4), c.dark3);
    }
    if (o.drips !== false) back += drip(S, 560, 118, 750, 5.2, 0.4, c.drop, c.dark4) + drip(S, 1030, 92, 664, 4.6, 1.3, c.drop, c.dark4) + drip(S, 1440, 82, 640, 5, 0.9, c.drop, c.dark4);
    if (o.train) back += grit(S, 100, 1500, 110, 600, 22, 703, mix(c.dark4, '#FFFFFF', 0.2));
    // a low ridge of mud and stone right in front, over the paws of a cat looking in
    S.covers.near = g(path(mound(-80, 820, 1012, 950, 10, rng(704), 0.3, 0.3, 0.35), mix(c.dark2, c.mudDk, 0.25)) +
      stroke('M-10 966Q200 946 420 950Q640 954 800 990', c.warm, 4, { opacity: 0.45 }), { filter: S.shadow('m') });
    front += g(path(blob(1560, 1010, 180, 54, 10, rng(705), 0.25, 0.3), mix(c.dark1, c.mudDk, 0.3)), { filter: S.shadow('m') });
    S.weatherClip = S.clip('brbrain', rect(0, 0, 0, 0, '#fff'));
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ the set

  function draw(S) {
    if (S.comp === 'mouth') return drawMouth(S);
    if (S.comp === 'under') return drawUnder(S);
    if (S.comp === 'back') return drawBack(S);
    return drawBank(S);
  }

  art.defineSet('bridge', {
    label: 'the Old Bridge', tod: 'day', draw: draw,
    cams: {
      bank: { box: [0, 0, 1600] },
      mouth: { box: [0, 0, 1600], comp: 'mouth' },
      under: { box: [0, 0, 1600], comp: 'under' },
      back: { box: [0, 0, 1600], comp: 'back' }
    },
    anchors: {
      // the riverbank; `rock` and `edge` also show here, small, at the dark's mouth
      main: {
        'bank-left': A(300, 930, 285), 'bank-right': A(1250, 936, 285, 'left'), reeds: A(1000, 880, 240, 'left'),
        rock: A(492, 722, 140, 'right', { elev: true }), edge: A(330, 772, 176, 'left')
      },
      // `sun-edge`: in the sun just out of the shadow, beside `sun` (a cat there and Tallyheart at
      // `sun` sit side by side: f097a, f100a, f101a); its height is the depth there
      mouth: { rock: A(415, 708, 230, 'right', { elev: true }), edge: A(770, 880, 300, 'left'), sun: A(1330, 965, 340, 'left'), 'sun-edge': A(1100, 958, 337, 'right') },
      under: { mud: A(640, 900, 320), inside: A(1010, 640, 165) },
      back: { near: A(360, 1000, 440) }
    },
    opts: { train: [false, true], eyes: ['none', 'open', 'blink'], drag: [true, false], drips: [true, false] },
    defaults: { train: false, eyes: 'none', drag: true, drips: true }
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
