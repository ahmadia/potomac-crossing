/* Potomac Crossing · app/art/sets/ferry.js
 *
 * The set: the otters' Moon Ferry (chapter 10, "The Gathering"; docs/chapters/10-the-gathering.spec.md, section 4,
 * "The new set, ferry"). The otters' long line of log rafts, logs lashed with green-gold reeds: the front raft (the
 * ferry itself, chapter 5's otters' ferry raft: four logs on every camera, as Puddle's riddle counts them) biggest and
 * nearest, more rafts tied behind it in a line. The river is silver-blue under the full
 * moon, bright and clear and NEVER dark or black: moonlight on every ripple, the far banks dark green but lit, the
 * glass towers small far off downriver. Two lights only (todMap): `dusk`, the boarding at the Crossing (rose and
 * lilac, the moon just up, round, over the water), and `night`, everything after; an hour a frame names that is
 * neither draws the nearer of the two (sunset dusk, the day's hours night). The raft is never damaged and never
 * tips; nothing dark is drawn in the water under a cat (chapter 5's rule). The set draws no otter and no named
 * cat: every otter is cast, and the Clan's crowd (`clan`) is the kit's (K.crowd, scenes.js).
 *
 * Six cameras, each a composition of its own in the 1600 x 1000 world, with its own anchors:
 *   shore  the Crossing's edge: chapter 2's flat stones and pebbles at the left, the front raft's near end at the
 *          stones' edge, the rafts behind it going off upriver (to the right, smaller), tied raft to raft with
 *          reed ropes; the moon rising over the water. Anchors `bank-1`, `bank-2`, `bank-3` (on the stones,
 *          walking down to the rafts, facing right), `edge` (at the stones' edge by the front raft), `log-1`,
 *          `log-2` (on the front raft's near logs), `pole` (standing at the front raft's far end).
 *   deck   aboard the front raft from its back end, looking forward upriver: the logs running away from us, the
 *          front end and the poler against the moonlit river, the moon ahead and high. Anchors `seat-1`, `seat-2`,
 *          `seat-3` (the left side, near to far), `seat-4`, `seat-5`, `seat-6` (the right side, far to near:
 *          the near ones bigger), `front` (mid-raft at the left, facing right), `beside` (beside `front`),
 *          `pole` (at the front end), `back` (at the near right corner, beside the luggage).
 *   back   close on the very back of the front raft: the heap of reeds (`luggage`) takes the right half, the
 *          river behind. Anchors `heap` (beside the heap, facing left), `back-1`, `back-2`, `back-3` (at the
 *          left, facing right).
 *   low    at cat height on the front raft's logs: the logs running away from us, and between the two middle
 *          logs a wedge of silver water, the gap (<g data-art="gap" data-box>). Anchors `gap` (in the water
 *          there: `air`, no ground shadow; the set draws rings over whoever is in it), `lie` (lying flat on the
 *          left log at the gap's edge, chin over it), `sit-1` (beside the gap, left, facing right), `sit-2`
 *          (beside the gap, right, facing left), `sit-3` (behind `sit-1`, facing right).
 *   under  looking straight down into the gap: silver water filling the panel, the logs' wet tops at the left
 *          and right edges, the moon's reflection (with `moon`). Anchors `water` (in the water, centre: `air`,
 *          rings drawn over him) and `lip` (at the left log's inner edge at the panel's top, looking down into the
 *          water: her head and forepaws over the water, the rest of her hidden by the log, a cover; `elev`, as
 *          grove's lip, so it never skews the camera's depth scale).
 *   river  wide: the ferry gliding upriver (to the right) under the moon, the front raft with its poler and its
 *          small seated cats, the line of rafts behind (at the left); with `home`, the same raft bumping home at
 *          the Crossing's stones (at the left: the line of rafts turned round, heading left, the spots moved
 *          with it through S.spots). Anchors `raft-1`, `raft-2` (small cats on the front raft), `pole` (the poler).
 *
 * Covers, each drawn just after whoever is at the spot (scenes.js S.covers), with `data-part` and a `data-box`
 * (the world box it covers: x0 y0 x1 y1) for the tests:
 *   gap    (low) rings of silver ripples round his foot or head where it meets the water
 *   water  (under) the same, round whoever is in the water
 *   lip    (under) the left log again, over all of her but her head and forepaws (`data-cut`: the x it stops at,
 *          never across her head), as grove's rim: she leans over its edge, the rest of her beyond it
 *
 * Options (every one off by default; off draws exactly as left out):
 *   moon: n        the moon n evenings old (kit.waxingMoon; 14 the full moon, round), in the sky of every camera
 *                  but `under`, and in the water as its reflection (its path of glints; on `under` its disc). In
 *                  `keep`
 *   clan: true     (shore, deck, river) the rest of CrystalClan seated along the logs of the front raft and the
 *                  rafts behind: K.crowd's small seated Clan cats (their seats carry no who and no variant, so
 *                  they keep the camp's CROWD_COATS), kept clear of the frame's cast; called guarded, so until
 *                  the kit has it nothing is drawn
 *   luggage: true  (deck, back, river) the heap of reeds at the back of the front raft, round and lumpy, loose
 *                  green-gold reeds, nothing of Sprinkle showing (<g data-art="luggage" data-box>)
 *   puff: true     (back, with the heap) a little cloud of mist puffing out of the heap's top (<g data-art="puff">)
 *   low: true      (low) the front raft riding low: the water right at the logs' tops all round and in the gap,
 *                  never over them (without it the logs' round sides show above the water)
 *   home: true     (river) the raft at the Crossing's stones, bumping in, the moon high
 *
 * PC.art.ferryInfo() -> the geometry the tests read: each camera's water (its polygons and colours), the rafts,
 * the gap, the stones, the heap, the moon's place.
 *
 * Registered with PC.art.defineSet (app/art/scenes.js); painters come from PC.art.kit.
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

  var n = K.n, rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke, pts = K.pts, poly = K.poly, g = K.g,
    mix = K.mix, lerp = K.lerp, clamp = K.clamp, rng = K.rng, blob = K.blob, mound = K.mound, bladeD = K.bladeD, A = K.anchor;

  // ------------------------------------------------------------------ colours: the river under the moon

  // Two lights. Night is the moonlit river: silver-blue water, every colour a step lighter and cooler than the
  // camp's night, nothing near black. Dusk is the boarding: rose and lilac, the water holding the sky's pinks.
  var NIGHT = {
    sky: ['#192B5C', '#223A72', '#2F4C88', '#43649F', '#6385BA'], skyGlow: '#D6E2FA', haze: '#7E98C8',
    water: ['#B6CAEC', '#9DB6E0', '#88A6D8', '#7A98CE'], waterLit: '#E2EBFC', rip: '#F2F6FF', ripDk: '#7E98C6', glint: '#FFFFFF',
    bank: '#466F6A', bankTop: '#6E9A90', bankLit: '#A9CBBE', bankFar: '#6886A0', tree: '#3E6662', treeLit: '#6E9A8E',
    log: '#8E8279', logTop: '#ABA197', logSide: '#766A6C', logSheen: '#DCD8DC', logEnd: '#CBBBA6', logRing: '#A08E7A', logLine: '#62585C',
    reed: '#A2B06E', reedLt: '#D4D896', reedDk: '#7C8C52', reedGold: '#D8C67E',
    stone: '#ADB4C8', stoneTop: '#CFD5E4', stoneDk: '#8C93AA', pebble: '#C2C8D8', wet: '#9AA8C6',
    tower: '#56729A', towerTop: '#7690B6', towerLit: '#FFDB92', mist: '#F0F4FC'
  };
  var DUSK = {
    sky: ['#4A4C90', '#6E5FA4', '#9C78B4', '#CF90AE', '#F1B5A2'], skyGlow: '#FFE4CC', haze: '#C99AB0',
    water: ['#EEC2C2', '#D0B2D0', '#B0A6D6', '#98A0D6'], waterLit: '#FFF0E6', rip: '#FFF6F2', ripDk: '#9A94C4', glint: '#FFFFFF',
    bank: '#5E6C6A', bankTop: '#7E8C7C', bankLit: '#C9AFA6', bankFar: '#8C86A6', tree: '#56625E', treeLit: '#8C9488',
    log: '#9C806C', logTop: '#BC9E86', logSide: '#82685C', logSheen: '#F2D8C6', logEnd: '#DCC2A2', logRing: '#B09276', logLine: '#6C5650',
    reed: '#AAB26A', reedLt: '#E2D896', reedDk: '#82884E', reedGold: '#E6C47A',
    stone: '#C6B4B2', stoneTop: '#E6D4CE', stoneDk: '#A08E94', pebble: '#D8C8C4', wet: '#B4A4BC',
    tower: '#6C7AA0', towerTop: '#8E98BC', towerLit: '#FFD98E', mist: '#FFF4F0'
  };
  function cols(S) { return S.tod === 'dusk' ? DUSK : NIGHT; }

  // ------------------------------------------------------------------ helpers

  function smooth(P, closed) {
    var d = 'M' + n(P[0][0]) + ' ' + n(P[0][1]), i;
    for (i = 1; i < P.length - 1; i++) d += 'Q' + n(P[i][0]) + ' ' + n(P[i][1]) + ' ' + n((P[i][0] + P[i + 1][0]) / 2) + ' ' + n((P[i][1] + P[i + 1][1]) / 2);
    d += 'L' + n(P[P.length - 1][0]) + ' ' + n(P[P.length - 1][1]);
    return closed ? d + 'Z' : d;
  }
  function boxAttr(b) { return n(b[0]) + ' ' + n(b[1]) + ' ' + n(b[2]) + ' ' + n(b[3]); }
  function quad(P) { return pts(P) + 'Z'; }
  function inPoly(P, x, y) {
    var inside = false;
    for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
      if (((P[i][1] > y) !== (P[j][1] > y)) && (x < (P[j][0] - P[i][0]) * (y - P[i][1]) / ((P[j][1] - P[i][1]) || 1e-9) + P[i][0])) inside = !inside;
    }
    return inside;
  }
  function moonAge(S) { var m = S.opts.moon; return typeof m === 'number' && m > 0 ? m : 0; }
  function keepBox(S, x, y, w, h) { (S.keep = S.keep || []).push({ x: x, y: y, w: w, h: h }); }

  // Where a cast member at spot `a` is drawn, as scenes.js draws it (grove's castEst, for the `lip` cover): its body and
  // head boxes in the world, [x0, y0, x1, y1]; without the character drawings, a sitting cat's shape at the spot
  var OWN = { who: 1, at: 1, pose: 1, mood: 1, variant: 1, facing: 1, size: 1, look: 1, sex: 1 };
  function castEst(S, m, a) {
    var fn = art.character, who = m.who || 'clancat', face = m.facing || a.face || 'right', H = a.h * (m.size > 0 ? +m.size : 1), k;
    var o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: face };
    if (m.variant != null) o.variant = m.variant;
    for (k in m) if (Object.prototype.hasOwnProperty.call(m, k) && !OWN[k] && m[k] != null) o[k] = m[k];
    if (who === 'player') { o.look = S.look || {}; if (o.look.sex) o.sex = o.look.sex; }
    var ch = null, ref = null;
    if (typeof fn === 'function' && !fn.placeholder) {
      try { ch = fn(who, o); ref = fn('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }); } catch (e) { ch = null; }
    }
    if (!ch || !(ch.w > 0) || !(ch.h > 0) || !ref || !(ref.h > 0)) {
      return { face: face, body: [a.x - H * 0.42, a.y - H * 0.78, a.x + H * 0.42, a.y], head: [a.x - H * 0.2, a.y - H * 0.78, a.x + H * 0.2, a.y - H * 0.42] };
    }
    var s = H / ref.h, bb = ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h };
    var hb = ch.headBox || { x0: ch.head.x - ch.w * 0.2, y0: ch.head.y - ch.h * 0.18, x1: ch.head.x + ch.w * 0.2, y1: ch.head.y + ch.h * 0.18 };
    function W(b) { return [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s]; }
    return { face: face, body: W(bb), head: W(hb) };
  }
  // the first cast member at a named spot here, with its spot
  function at(S, name) {
    var a = (S.anchorMap || {})[name], cast = S.cast || [];
    if (!a) return null;
    for (var i = 0; i < cast.length; i++) if (cast[i] && cast[i].at === name) return { m: cast[i], a: a };
    return null;
  }

  // ------------------------------------------------------------------ painters

  // the sky: the light's gradient down to the horizon, stars at night, a glow low over the water
  function skyBack(S, y1, glowX) {
    var C = cols(S), st = [];
    for (var i = 0; i < C.sky.length; i++) st.push([i / (C.sky.length - 1), C.sky[i]]);
    var s = rect(-10, -10, 1620, y1 + 20, S.linU(st, 0, 0, 0, y1));
    s += ell(glowX, y1, 900, y1 * 0.6, S.radU([[0, C.skyGlow, S.tod === 'dusk' ? 0.55 : 0.28], [1, C.skyGlow, 0]], glowX, y1, 900));
    if (S.tod !== 'dusk') s += K.stars(S, 0, 0, 1600, y1 * 0.85, Math.round(1600 * y1 / 2600), 9101 + Math.round(y1));
    return g(s, { 'data-art': 'sky' });
  }
  // the moon, n evenings old, with its glow; kept clear of the lettering
  function moonAt(S, x, y, r) {
    var age = moonAge(S);
    if (!age) return '';
    keepBox(S, x - r - 10, y - r - 10, 2 * r + 20, 2 * r + 20);
    var glow = circ(x, y, r * 4.6, S.radU([[0, '#F2F6FF', S.tod === 'dusk' ? 0.3 : 0.4], [0.45, '#DCE6FF', 0.12], [1, '#DCE6FF', 0]], x, y, r * 4.6));
    return g(glow + K.waxingMoon(S, x, y, r, 18, age), { 'data-art': 'moon', 'data-age': n(age), 'data-at': n(x) + ' ' + n(y) + ' ' + n(r) });
  }
  // the far bank along the horizon: a low line of trees, dark green but lit along its top by the moon
  function farBank(S, x0, x1, y, hgt, seed) {
    var C = cols(S), r = rng(seed), top = [];
    for (var x = x0 - 20; x <= x1 + 20; x += 26 + r() * 30) top.push([x, y - hgt * (0.35 + r() * 0.65)]);
    var d = smooth(top) + 'L' + n(x1 + 20) + ' ' + n(y + 8) + 'L' + n(x0 - 20) + ' ' + n(y + 8) + 'Z';
    var lit = smooth(top.map(function (q) { return [q[0], q[1] + 3]; }));
    return g(path(d, S.linU([[0, C.treeLit], [0.5, C.tree], [1, C.bank]], 0, y - hgt, 0, y + 8)) + stroke(lit, C.bankLit, 3, { opacity: 0.7 }), { 'data-art': 'far-bank' });
  }
  // the glass towers, small, far off downriver: soft blue glass, a few lit windows
  function farTowers(S, list) {
    var C = cols(S), s = '', lit = '';
    list.forEach(function (t, i) {
      var r = rng(9201 + i);
      s += rect(t[0], t[1], t[2], t[3] - t[1], S.linU([[0, C.towerTop], [1, C.tower]], 0, t[1], 0, t[3]), { opacity: 0.72 });
      s += rect(t[0] + t[2] - 2, t[1], 2, t[3] - t[1], C.skyGlow, { opacity: 0.35 });
      for (var yy = t[1] + 6; yy < t[3] - 6; yy += 9) for (var xx = t[0] + 3; xx < t[0] + t[2] - 4; xx += 7) if (r() < 0.32) lit += 'M' + n(xx) + ' ' + n(yy) + 'h3v4h-3z';
    });
    return g(s + path(lit, C.towerLit, { opacity: 0.9 }), { 'data-art': 'towers' });
  }
  // the river: from the horizon at y0 to y1, far to near; ripples and glints; with the moon, its path of light
  function riverBack(S, y0, y1, seed, moonX) {
    var C = cols(S), r = rng(seed), W = C.water;
    var s = rect(-10, y0, 1620, y1 - y0 + 10, S.linU([[0, W[0]], [0.3, W[1]], [0.7, W[2]], [1, W[3]]], 0, y0, 0, y1));
    // a soft sheen across the middle, the sky's light on the water
    s += ell(moonX == null ? 800 : moonX, y0 + (y1 - y0) * 0.25, 1100, (y1 - y0) * 0.4, S.radU([[0, C.waterLit, 0.45], [1, C.waterLit, 0]], moonX == null ? 800 : moonX, y0 + (y1 - y0) * 0.25, 1100));
    var rip = '', rip2 = '', dk = '';
    for (var i = 0; i < 60; i++) {
      var t = Math.pow(r(), 1.4), y = lerp(y0 + 6, y1, t), w = lerp(16, 120, t) * (0.6 + r() * 0.8), x = r() * 1640 - 20;
      if (i % 3 === 0) dk += 'M' + n(x) + ' ' + n(y + 3) + 'q' + n(w / 2) + ' ' + n(3) + ' ' + n(w) + ' 0';
      else if (i % 3 === 1) rip += 'M' + n(x) + ' ' + n(y) + 'q' + n(w / 2) + ' ' + n(-3 - t * 3) + ' ' + n(w) + ' 0';
      else rip2 += 'M' + n(x) + ' ' + n(y) + 'h' + n(w * 0.7);
    }
    s += stroke(dk, C.ripDk, 2.4, { opacity: 0.3 }) + stroke(rip, C.rip, 2.6, { opacity: 0.8 }) + stroke(rip2, C.rip, 2, { opacity: 0.6, 'class': 'pcs-glint' });
    if (moonAge(S) && moonX != null) s += moonPath(S, moonX, y0 + 4, y1, seed + 7);
    return g(s, { 'data-art': 'river' });
  }
  function moonPath(S, x, y0, y1, seed) {
    var r = rng(seed), d = '', d2 = '';
    for (var i = 0; i < 40; i++) {
      var t = i / 39, y = lerp(y0, y1, t) + (r() - 0.5) * 6, w = lerp(10, 150, t) * (0.45 + r() * 0.75), cx = x + (r() - 0.5) * lerp(16, 180, t);
      if (i % 3) d += 'M' + n(cx - w / 2) + ' ' + n(y) + 'h' + n(w); else d2 += 'M' + n(cx - w / 2) + ' ' + n(y) + 'h' + n(w);
    }
    return g(stroke(d, '#FFFFFF', 3.4, { opacity: 0.8 }) + stroke(d2, '#F2F6FF', 5.5, { opacity: 0.6, 'class': 'pcs-glint' }), { 'data-art': 'moon-path' });
  }
  // a raft seen from the side and a little above: its near edge from p0 to p1, its deck reaching back by (dx, -dy),
  // `logs` logs running along it, round ends at both sides, the near log's side showing, reed lashings across it
  // near each end. Returns { svg, deck } (the deck's outline, for the tests and the crowd)
  function raftSide(S, p0, p1, dx, dy, logs, seed, o) {
    o = o || {};
    var C = cols(S), r = rng(seed), s = '', side = Math.max(8, dy * 0.26), i;
    var far0 = [p0[0] + dx, p0[1] - dy], far1 = [p1[0] + dx, p1[1] - dy];
    // the water's darker ring round it and a bright line where it meets the water
    s += path(blob((p0[0] + p1[0]) / 2 + dx / 2, (p0[1] + p1[1]) / 2 - dy / 2 + side * 0.6, (p1[0] - p0[0]) / 2 + dx * 0.6 + 26, dy / 2 + side + 10, 12, rng(seed + 1), 0.06, 0.1), C.ripDk, { opacity: 0.22 });
    // the logs, far to near
    for (i = logs - 1; i >= 0; i--) {
      var t0 = i / logs, t1 = (i + 1) / logs;
      var a0 = [lerp(p0[0], far0[0], t1), lerp(p0[1], far0[1], t1)], a1 = [lerp(p1[0], far1[0], t1), lerp(p1[1], far1[1], t1)];
      var b0 = [lerp(p0[0], far0[0], t0), lerp(p0[1], far0[1], t0)], b1 = [lerp(p1[0], far1[0], t0), lerp(p1[1], far1[1], t0)];
      var th = Math.abs(b0[1] - a0[1]), jag = (r() - 0.5) * th * 0.6;
      var body = 'M' + n(a0[0] + jag) + ' ' + n(a0[1]) + 'L' + n(a1[0] + jag * 0.5) + ' ' + n(a1[1]) +
        'Q' + n(a1[0] + jag * 0.5 + th * 0.7) + ' ' + n((a1[1] + b1[1]) / 2) + ' ' + n(b1[0] + jag * 0.5) + ' ' + n(b1[1] + (i === 0 ? side : 0)) +
        'L' + n(b0[0] + jag) + ' ' + n(b0[1] + (i === 0 ? side : 0)) + 'Q' + n(b0[0] + jag - th * 0.7) + ' ' + n((a0[1] + b0[1]) / 2) + ' ' + n(a0[0] + jag) + ' ' + n(a0[1]) + 'Z';
      s += path(body, S.linU([[0, C.logTop], [0.6, C.log], [1, C.logSide]], 0, a0[1], 0, b0[1] + (i === 0 ? side : 0)));
      // moonlight along its top, a dark line where it meets the next
      s += stroke('M' + n(a0[0] + jag + th * 0.4) + ' ' + n(a0[1] + th * 0.28) + 'L' + n(a1[0] + jag * 0.5 - th * 0.2) + ' ' + n(a1[1] + th * 0.28), C.logSheen, Math.max(1.5, th * 0.16), { opacity: 0.55 });
      s += stroke('M' + n(a0[0] + jag) + ' ' + n(a0[1]) + 'L' + n(a1[0] + jag * 0.5) + ' ' + n(a1[1]), C.logLine, Math.max(1.2, th * 0.08), { opacity: 0.45 });
      // the log's cut end at the left: rings
      var ex = b0[0] + jag - th * 0.42, ey = (a0[1] + b0[1]) / 2 + (i === 0 ? side * 0.5 : 0), er = th * 0.5 + (i === 0 ? side * 0.5 : 0);
      s += ell(ex, ey, er * 0.62, er, C.logEnd) + ell(ex, ey, er * 0.36, er * 0.6, 'none', { stroke: C.logRing, 'stroke-width': n(Math.max(1, er * 0.1)) }) + ell(ex, ey, er * 0.12, er * 0.2, C.logRing);
    }
    // reed lashings across it, near each end
    [0.1, 0.88].forEach(function (u, k) {
      var q0 = [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) + side], q1 = [lerp(far0[0], far1[0], u), lerp(far0[1], far1[1], u)];
      var wv = Math.max(6, (p1[0] - p0[0]) * 0.022), band = quad([[q0[0] - wv, q0[1]], [q1[0] - wv * 0.7, q1[1]], [q1[0] + wv * 0.7, q1[1]], [q0[0] + wv, q0[1]]]);
      var wraps = '';
      for (var j = 1; j < logs * 2; j++) { var t = j / (logs * 2), wx = lerp(q0[0], q1[0], t), wy = lerp(q0[1], q1[1], t); wraps += 'M' + n(wx - wv) + ' ' + n(wy + 1) + 'L' + n(wx + wv) + ' ' + n(wy - 2); }
      s += path(band, k ? C.reed : C.reedGold) + stroke(wraps, C.reedDk, Math.max(1.2, wv * 0.22), { opacity: 0.8 }) + stroke(band, C.reedLt, 1.2, { opacity: 0.5 });
    });
    // the bright line of water along its near side
    s += stroke('M' + n(p0[0] - 10) + ' ' + n(p0[1] + side + 3) + 'L' + n(p1[0] + 14) + ' ' + n(p1[1] + side + 3), C.rip, 2.6, { opacity: 0.85 });
    var deck = [[p0[0], p0[1]], [p1[0], p1[1]], far1, far0];
    return { svg: g(s, { 'data-art': o.art || 'raft', 'data-box': boxAttr([Math.min(p0[0], far0[0]) - 20, Math.min(far0[1], far1[1]), Math.max(p1[0], far1[0]) + 20, Math.max(p0[1], p1[1]) + side]) }), deck: deck };
  }
  // a reed rope from one raft to the next, sagging toward the water
  function rope(S, a, b) {
    var C = cols(S), mx = (a[0] + b[0]) / 2, my = Math.max(a[1], b[1]) + Math.abs(b[0] - a[0]) * 0.08;
    var d = 'M' + n(a[0]) + ' ' + n(a[1]) + 'Q' + n(mx) + ' ' + n(my) + ' ' + n(b[0]) + ' ' + n(b[1]);
    return stroke(d, C.reedDk, 5) + stroke(d, C.reed, 2.6);
  }
  // reed lashings across a deck seen from aboard: a twist of reeds round each log at height y, w thick, from xl to xr
  function lashing(S, logs, y, w, xl, xr) {
    var C = cols(S), s = '', hi = '';
    for (var j = 0; j < logs; j++) {
      var a = lerp(xl, xr, j / logs) + 3, b = lerp(xl, xr, (j + 1) / logs) - 3, m = (a + b) / 2;
      s += 'M' + n(a) + ' ' + n(y - w * 0.3) + 'Q' + n(m) + ' ' + n(y - w * 0.75) + ' ' + n(b) + ' ' + n(y - w * 0.3) + 'L' + n(b) + ' ' + n(y + w * 0.3) + 'Q' + n(m) + ' ' + n(y - w * 0.15) + ' ' + n(a) + ' ' + n(y + w * 0.3) + 'Z';
      for (var k = 0; k < 3; k++) { var x = lerp(a, b, (k + 0.5) / 3); hi += 'M' + n(x - w * 0.35) + ' ' + n(y - w * 0.4) + 'L' + n(x + w * 0.25) + ' ' + n(y + w * 0.2); }
    }
    return g(path(s, C.reed) + stroke(hi, C.reedDk, Math.max(1.2, w * 0.1), { opacity: 0.75 }) + stroke(s, C.reedLt, 1, { opacity: 0.5 }), { 'data-art': 'lashing' });
  }
  // the heap of reeds (the luggage): round and lumpy, loose reeds green-gold in the moonlight, nothing of anyone
  // showing; (cx, base) its foot, w its width, hgt its height
  function reedHeap(S, cx, base, w, hgt, seed) {
    var C = cols(S), r = rng(seed), s = '', i;
    s += ell(cx, base - 4, w * 0.52, Math.max(6, hgt * 0.06), C.ripDk, { opacity: 0.3 });
    var mnd = mound(cx - w / 2, cx + w / 2, base, base - hgt, 7, rng(seed + 1), 0.22, 0.18, 0.22);
    s += path(mnd, S.linU([[0, C.reedLt], [0.45, C.reed], [1, C.reedDk]], cx - w / 2, base - hgt, cx + w * 0.3, base));
    // lumps, then the loose reeds lying every way over it, a few sticking up and hanging over its edge
    var lumps = '';
    for (i = 0; i < 6; i++) { var lx = cx + (r() - 0.5) * w * 0.7, ly = base - hgt * (0.25 + r() * 0.5); lumps += blob(lx, ly, w * (0.1 + r() * 0.08), hgt * (0.08 + r() * 0.06), 8, r, 0.3, 0.3); }
    s += path(lumps, C.reedLt, { opacity: 0.18 });
    var a = '', b2 = '', c = '', tips = '';
    for (i = 0; i < 160; i++) {
      var u = r(), vx = cx + (u - 0.5) * w * 0.95, top = base - hgt * Math.sqrt(Math.max(0, 1 - Math.pow((u - 0.5) * 2, 2))) * 0.96;
      var vy = lerp(top + 6, base - 4, Math.pow(r(), 1.3)), L = (60 + r() * 110) * w / 600, ang = (r() - 0.5) * 1.4 + (u < 0.5 ? 0.3 : -0.3), ex = vx + Math.cos(ang) * L * (u < 0.5 ? -1 : 1), ey = vy + Math.sin(ang) * L * 0.3 - 4;
      var dd = 'M' + n(vx) + ' ' + n(vy) + 'Q' + n((vx + ex) / 2) + ' ' + n((vy + ey) / 2 - 8) + ' ' + n(ex) + ' ' + n(ey);
      if (i % 3 === 0) a += dd; else if (i % 3 === 1) b2 += dd; else c += dd;
    }
    for (i = 0; i < 14; i++) { var tx = cx + (r() - 0.5) * w * 0.6, ty = base - hgt * (0.82 + r() * 0.1); tips += bladeD(tx, ty, 30 + r() * 40, (r() - 0.5) * 40, 4); }
    var sw = Math.max(1.6, w / 160);
    s += stroke(a, C.reedDk, sw * 1.2, { opacity: 0.7 }) + stroke(b2, C.reed, sw) + stroke(c, C.reedGold, sw * 0.9, { opacity: 0.95 }) + path(tips, C.reedLt, { opacity: 0.9 });
    // the moon's sheen on its top
    s += path(blob(cx - w * 0.1, base - hgt * 0.78, w * 0.26, hgt * 0.1, 9, rng(seed + 2), 0.3, 0.3), '#FFFFFF', { opacity: 0.18 });
    return g(s, { 'data-art': 'luggage', 'data-box': boxAttr([cx - w / 2, base - hgt, cx + w / 2, base]) });
  }
  // a little cloud of mist puffing out of the heap's top: soft rounds, a curl, rising
  function puffCloud(S, x, y, k) {
    var C = cols(S), s = '';
    // one soft round cloud: puffs side by side, a flat bottom, a little curl of mist at its top
    [[-34, -34, 24], [-6, -50, 30], [26, -40, 25], [46, -26, 18], [-50, -20, 16], [8, -24, 26]].forEach(function (q) { s += circ(x + q[0] * k, y + q[1] * k, q[2] * k, C.mist, { opacity: 0.85 }); });
    s += stroke('M' + n(x - 8 * k) + ' ' + n(y - 78 * k) + 'q' + n(-16 * k) + ' ' + n(-10 * k) + ' ' + n(-6 * k) + ' ' + n(-24 * k) + 'q' + n(10 * k) + ' ' + n(-10 * k) + ' ' + n(20 * k) + ' ' + n(2 * k), '#FFFFFF', 3 * k, { opacity: 0.75 });
    return g(g(s, { filter: S.blur('fypuff', 2.4 * k) }), { 'data-art': 'puff', 'class': 'pcs-pulse', 'data-box': boxAttr([x - 70 * k, y - 104 * k, x + 72 * k, y]) });
  }
  // flat stones and pebbles, chapter 2's Crossing in this light
  function stones(S, P, seed, count) {
    var C = cols(S), r = rng(seed), s = '', top = '', peb = '', wet = '';
    s += path(smooth(P, true), S.linU([[0, C.stoneTop], [1, C.stone]], 0, Math.min.apply(null, P.map(function (q) { return q[1]; })), 0, 1000));
    var xs = P.map(function (q) { return q[0]; }), ys = P.map(function (q) { return q[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys);
    for (var i = 0; i < count; i++) {
      var x = lerp(x0, x1, r()), y = lerp(y0, 1000, Math.pow(r(), 0.8));
      if (!inPoly(P, x, y)) continue;
      var k = lerp(0.5, 1.4, (y - y0) / (1000 - y0)), rx = (40 + r() * 50) * k, ry = rx * 0.32;
      s += ell(x, y + ry * 0.35, rx, ry, C.stoneDk) + ell(x, y, rx * 0.97, ry * 0.92, mix(C.stone, C.stoneTop, r()));
      top += 'M' + n(x - rx * 0.55) + ' ' + n(y - ry * 0.35) + 'Q' + n(x) + ' ' + n(y - ry * 0.95) + ' ' + n(x + rx * 0.5) + ' ' + n(y - ry * 0.4);
      if (r() < 0.6) peb += blob(x + (r() - 0.5) * rx * 2.2, y + ry * 1.4, 4 + r() * 6 * k, 3 + r() * 3 * k, 6, r, 0.3, 0.3);
    }
    // the wet edge along the water: a darker band and a bright line
    var edge = P.filter(function (q) { return q[1] < 1000 && q[0] > x0 + 4; });
    if (edge.length > 1) wet += stroke(smooth(edge), C.wet, 10, { opacity: 0.6 }) + stroke(smooth(edge), C.rip, 2.4, { opacity: 0.9 });
    return g(s + stroke(top, '#FFFFFF', 2, { opacity: 0.45 }) + path(peb, C.pebble) + wet, { 'data-art': 'stones' });
  }
  // the Clan, seated, through the kit's crowd helper (scenes.js's, the nest owner's): until it is there, nobody
  function crowd(S, seats, k0) { return S.opts.clan === true && K.crowd ? (K.crowd(S, seats, k0) || '') : ''; }
  // silver rings round whoever is in the water at a spot, drawn over them (a cover)
  function ringsOver(S, name, a, k, seed) {
    var C = cols(S), w = a.h * k, y = a.y - a.h * 0.02, s = '';
    s += path('M' + n(a.x - w) + ' ' + n(y) + 'A' + n(w) + ' ' + n(w * 0.16) + ' 0 0 0 ' + n(a.x + w) + ' ' + n(y) + 'A' + n(w * 0.8) + ' ' + n(w * 0.07) + ' 0 0 1 ' + n(a.x - w) + ' ' + n(y) + 'Z', C.waterLit, { opacity: 0.55 });
    s += stroke('M' + n(a.x - w * 1.05) + ' ' + n(y + 2) + 'A' + n(w * 1.05) + ' ' + n(w * 0.18) + ' 0 0 0 ' + n(a.x + w * 1.05) + ' ' + n(y + 2) +
      'M' + n(a.x - w * 1.4) + ' ' + n(y + 10) + 'A' + n(w * 1.4) + ' ' + n(w * 0.25) + ' 0 0 0 ' + n(a.x - w * 0.3) + ' ' + n(y + w * 0.26) +
      'M' + n(a.x + w * 0.4) + ' ' + n(y + w * 0.26) + 'A' + n(w * 1.4) + ' ' + n(w * 0.25) + ' 0 0 0 ' + n(a.x + w * 1.4) + ' ' + n(y + 10), C.rip, Math.max(2.4, a.h * 0.012), { opacity: 0.85 });
    return g(s, { 'data-part': 'cover-' + name, 'data-box': boxAttr([a.x - w * 1.4, y - w * 0.16, a.x + w * 1.4, y + w * 0.26]) });
  }

  // ------------------------------------------------------------------ SHORE: the boarding at the Crossing

  var SHORE = {
    horizon: 470,
    stones: [[-30, 590], [110, 600], [250, 640], [380, 704], [492, 782], [574, 862], [622, 940], [650, 1012], [-30, 1012]],
    front: { p0: [628, 934], p1: [1236, 902], dx: 92, dy: 150, logs: 4 },
    behind: [{ p0: [1392, 790], p1: [1560, 782], dx: 40, dy: 62, logs: 5 }, { p0: [1572, 694], p1: [1690, 690], dx: 24, dy: 38, logs: 4 }],
    moon: [1220, 300, 48]
  };
  function drawShore(S) {
    var back = '', L = SHORE, C = cols(S);
    back += skyBack(S, L.horizon, L.moon[0]) + moonAt(S, L.moon[0], L.moon[1], L.moon[2]);
    back += farTowers(S, [[80, 410, 24, 466], [110, 390, 20, 466], [134, 420, 28, 466], [170, 402, 18, 466], [196, 426, 22, 466]]);
    back += farBank(S, -20, 1640, L.horizon, 36, 9401);
    back += riverBack(S, L.horizon, 1000, 9402, L.moon[0]);
    // the rafts behind, tied in a line off upriver, then the front raft at the stones' edge
    var rafts = '', ropes = '';
    L.behind.slice().reverse().forEach(function (q, i) { rafts += raftSide(S, q.p0, q.p1, q.dx, q.dy, q.logs, 9411 + i, { art: 'raft-behind' }).svg; });
    var F = L.front, front = raftSide(S, F.p0, F.p1, F.dx, F.dy, F.logs, 9421, { art: 'raft-front' });
    ropes += rope(S, [F.p1[0] + F.dx * 0.6, F.p1[1] - F.dy * 0.4], [L.behind[0].p0[0] + 4, L.behind[0].p0[1] - 10]) +
      rope(S, [L.behind[0].p1[0] + 20, L.behind[0].p1[1] - 20], [L.behind[1].p0[0] + 2, L.behind[1].p0[1] - 8]);
    back += g(rafts, { filter: S.shadow('s') }) + ropes + g(front.svg, { filter: S.shadow('s') });
    // moored to the stones by a reed rope
    back += rope(S, [F.p0[0] - 20, F.p0[1] - 40], [556, 870]);
    // the Clan seated along the logs (the kit's crowd): on the front raft's far logs and the rafts behind
    back += crowd(S, [[790, 812, 'right', 'sit', 0.72], [900, 806, 'right', 'sit', 0.72], [1040, 800, 'left', 'sit', 0.72], [1150, 794, 'left', 'sit', 0.72],
      [1446, 752, 'right', 'sit', 0.6], [1520, 748, 'left', 'sit', 0.6], [1610, 672, 'right', 'sit', 0.46]], 0);
    back += stones(S, L.stones, 9431, 60);
    // pebbles along the very front
    back += K.tufts(S, -20, 560, 960, 1000, 10, 9441, C.reed, C.reedDk, 1.1);
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ DECK: aboard, looking forward upriver

  var DECK = { horizon: 360, front: 520, bl: -140, br: 1740, fl: 560, fr: 1040, logs: 4, moon: [800, 160, 58], heap: [1540, 1004, 340, 230] };
  function deckEdgeAt(side, y) {
    var D = DECK, t = (y - D.front) / (1000 - D.front);
    return side < 0 ? lerp(D.fl, D.bl, t) : lerp(D.fr, D.br, t);
  }
  function drawDeck(S) {
    var back = '', D = DECK, C = cols(S), r = rng(9501), i;
    back += skyBack(S, D.horizon, D.moon[0]) + moonAt(S, D.moon[0], D.moon[1], D.moon[2]);
    back += farBank(S, -20, 620, D.horizon, 30, 9502) + farBank(S, 980, 1640, D.horizon, 34, 9503);
    back += riverBack(S, D.horizon, 1000, 9504, D.moon[0]);
    // the deck: logs converging toward the front end
    var logs = '', lines = '', sheen = '', ends = '';
    for (i = 0; i < D.logs; i++) {
      var u0 = i / D.logs, u1 = (i + 1) / D.logs;
      var P = [[lerp(D.fl, D.fr, u0), D.front], [lerp(D.fl, D.fr, u1), D.front], [lerp(D.bl, D.br, u1), 1010], [lerp(D.bl, D.br, u0), 1010]];
      var mid0 = (P[0][0] + P[1][0]) / 2, mid1 = (P[2][0] + P[3][0]) / 2;
      logs += path(quad(P), S.linU([[0, C.logSide], [0.35, C.logTop], [0.65, C.log], [1, C.logSide]], P[3][0], 1000, P[2][0], 1000));
      lines += 'M' + n(P[0][0]) + ' ' + n(P[0][1]) + 'L' + n(P[3][0]) + ' ' + n(P[3][1]);
      sheen += 'M' + n(mid0 - (P[1][0] - P[0][0]) * 0.12) + ' ' + n(D.front + 4) + 'L' + n(mid1 - (P[2][0] - P[3][0]) * 0.12) + ' ' + n(1010);
      // the cut ends at the front: small round ends with rings
      var ew = (P[1][0] - P[0][0]) * 0.5;
      ends += ell(mid0, D.front + 2, ew * 0.95, ew * 0.55, C.logEnd) + ell(mid0, D.front + 2, ew * 0.5, ew * 0.28, 'none', { stroke: C.logRing, 'stroke-width': 1.6 });
    }
    lines += 'M' + n(D.fr) + ' ' + n(D.front) + 'L' + n(D.br) + ' 1010';
    var deckD = quad([[D.fl, D.front], [D.fr, D.front], [D.br, 1010], [D.bl, 1010]]);
    back += g(path(deckD, C.logSide) + logs + stroke(lines, C.logLine, 3, { opacity: 0.55 }) + stroke(sheen, C.logSheen, 5, { opacity: 0.35 }) + ends, { 'data-art': 'deck', 'data-box': boxAttr([D.bl, D.front, D.br, 1000]) });
    // the bright water along both edges, where the logs meet it
    back += stroke('M' + n(D.fl - 4) + ' ' + n(D.front) + 'L' + n(D.bl - 6) + ' 1010M' + n(D.fr + 4) + ' ' + n(D.front) + 'L' + n(D.br + 6) + ' 1010', C.rip, 4, { opacity: 0.8 });
    // reed lashings across the logs, two bands
    [0.24, 0.62].forEach(function (t) { back += lashing(S, D.logs, lerp(D.front, 1000, t), lerp(7, 26, t), deckEdgeAt(-1, lerp(D.front, 1000, t)), deckEdgeAt(1, lerp(D.front, 1000, t))); });
    // a few drops of water shining on the logs
    var drops = '';
    for (i = 0; i < 18; i++) { var dy = lerp(D.front + 30, 990, r()), dx = lerp(deckEdgeAt(-1, dy) + 30, deckEdgeAt(1, dy) - 30, r()); drops += K.sparkleD(dx, dy, lerp(3, 9, (dy - D.front) / 480)); }
    back += path(drops, '#FFFFFF', { opacity: 0.6, 'class': 'pcs-glint' });
    // the Clan seated along both sides of the deck (the kit's crowd), the far end first
    // (placed in the gaps a full deck leaves: the Moon Ferry Counts' nine at their spots, every seat but one taken)
    back += crowd(S, [[680, 560, 'right', 'sit', 0.86], [930, 556, 'left', 'sit', 0.86], [990, 800, 'left', 'sit', 0.9], [1340, 800, 'left', 'sit', 0.9],
      [440, 930, 'right', 'sit', 0.92], [50, 950, 'right', 'sit', 0.92]], 0);
    // the luggage at the near right corner
    if (S.opts.luggage === true) back += reedHeap(S, D.heap[0], D.heap[1], D.heap[2], D.heap[3], 9511);
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ BACK: the heap of reeds, close

  var BACK = { horizon: 400, deckTop: 846, heap: [1250, 960, 620, 520], moon: [420, 170, 50] };
  function drawBack(S) {
    var back = '', B = BACK, C = cols(S), i;
    back += skyBack(S, B.horizon, B.moon[0]) + moonAt(S, B.moon[0], B.moon[1], B.moon[2]);
    back += farBank(S, -20, 1640, B.horizon, 40, 9601);
    back += riverBack(S, B.horizon, B.deckTop + 40, 9602, B.moon[0]);
    // the deck at cat height: three logs across the bottom, the nearest biggest, their round ends at the back (right)
    var bands = [[B.deckTop, 896], [896, 950], [950, 1012]], logs = '';
    bands.forEach(function (bd, k) {
      var y0 = bd[0], y1 = bd[1], th = y1 - y0, end = 1540 - k * 10;
      logs += path('M-20 ' + n(y0) + 'H' + n(end) + 'Q' + n(end + th * 0.6) + ' ' + n((y0 + y1) / 2) + ' ' + n(end) + ' ' + n(y1) + 'H-20Z', S.linU([[0, C.logTop], [0.5, C.log], [1, C.logSide]], 0, y0, 0, y1));
      logs += stroke('M-20 ' + n(y0 + th * 0.24) + 'H' + n(end - 10), C.logSheen, Math.max(2, th * 0.12), { opacity: 0.45 }) + stroke('M-20 ' + n(y0) + 'H' + n(end), C.logLine, 2.4, { opacity: 0.5 });
      logs += ell(end + th * 0.18, (y0 + y1) / 2, th * 0.3, th * 0.5, C.logEnd) + ell(end + th * 0.18, (y0 + y1) / 2, th * 0.16, th * 0.28, 'none', { stroke: C.logRing, 'stroke-width': 2 });
    });
    // the water's bright edge along the far log, and past the logs' ends at the right
    back += stroke('M-20 ' + n(B.deckTop - 2) + 'H1560', C.rip, 3, { opacity: 0.85 });
    back += g(logs, { 'data-art': 'deck' });
    // a lashing near the back end
    var lx = 1440, wraps = '';
    for (i = 0; i < 9; i++) wraps += 'M' + n(lx - 18) + ' ' + n(B.deckTop + i * 19) + 'L' + n(lx + 14) + ' ' + n(B.deckTop + i * 19 + 12);
    back += path(quad([[lx - 22, B.deckTop - 2], [lx + 22, B.deckTop - 2], [lx + 26, 1010], [lx - 26, 1010]]), C.reedGold) + stroke(wraps, C.reedDk, 3, { opacity: 0.8 });
    if (S.opts.luggage === true) {
      back += reedHeap(S, B.heap[0], B.heap[1], B.heap[2], B.heap[3], 9611);
      if (S.opts.puff === true) back += puffCloud(S, B.heap[0] - 60, B.heap[1] - B.heap[3] + 40, 1.3);
    }
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ LOW: at cat height on the logs, the gap

  var LOW = { horizon: 300, front: 470, bl: -620, br: 2220, fl: 600, fr: 1000, logs: 4, gapLog: 2, gapTop: 620, gapW: 260, moon: [1160, 140, 50] };
  // the gap between logs gapLog-1 and gapLog, opening from gapTop toward us
  function gapPoly() {
    var L = LOW, u = L.gapLog / L.logs, xt = lerp(L.fl, L.fr, u), xb = lerp(L.bl, L.br, u);
    var cAt = function (y) { var t = (y - L.front) / (1000 - L.front); return lerp(xt, xb, t); };
    var wAt = function (y) { return L.gapW * clamp((y - L.gapTop) / (1000 - L.gapTop), 0, 1); };
    var P = [], Q = [];
    for (var y = L.gapTop; y <= 1010; y += 30) { P.push([cAt(y) - wAt(y) * 0.5, y]); Q.push([cAt(y) + wAt(y) * 0.5, y]); }
    return P.concat(Q.reverse());
  }
  function drawLow(S) {
    var back = '', L = LOW, C = cols(S), low = S.opts.low === true, i;
    back += skyBack(S, L.horizon, L.moon[0]) + moonAt(S, L.moon[0], L.moon[1], L.moon[2]);
    back += farBank(S, -20, 1640, L.horizon, 30, 9701);
    back += riverBack(S, L.horizon, 1000, 9702, L.moon[0]);
    // the logs running away from us; riding low, the water right at their tops along the raft's sides
    var logs = '', lines = '', sheen = '';
    for (i = 0; i < L.logs; i++) {
      var u0 = i / L.logs, u1 = (i + 1) / L.logs;
      var P = [[lerp(L.fl, L.fr, u0), L.front], [lerp(L.fl, L.fr, u1), L.front], [lerp(L.bl, L.br, u1), 1010], [lerp(L.bl, L.br, u0), 1010]];
      logs += path(quad(P), S.linU([[0, C.logSide], [0.3, C.logTop], [0.7, C.log], [1, C.logSide]], P[3][0], 1000, P[2][0], 1000));
      lines += 'M' + n(P[0][0]) + ' ' + n(P[0][1]) + 'L' + n(P[3][0]) + ' ' + n(P[3][1]);
      sheen += 'M' + n((P[0][0] + P[1][0]) / 2 - (P[1][0] - P[0][0]) * 0.15) + ' ' + n(L.front + 4) + 'L' + n((P[2][0] + P[3][0]) / 2 - (P[2][0] - P[3][0]) * 0.15) + ' 1010';
    }
    var deckD = quad([[L.fl, L.front], [L.fr, L.front], [L.br, 1010], [L.bl, 1010]]);
    // without `low`, the logs' round sides show above the water along the raft's edges
    var side = low ? '' : path(quad([[L.fl - 4, L.front], [L.fl, L.front + 14], [L.bl - 30, 1010], [L.bl - 60, 1010]]), C.logSide) +
      path(quad([[L.fr + 4, L.front], [L.fr, L.front + 14], [L.br + 30, 1010], [L.br + 60, 1010]]), C.logSide);
    back += g(side + path(deckD, C.logSide) + logs + stroke(lines, C.logLine, 3.4, { opacity: 0.55 }) + stroke(sheen, C.logSheen, 7, { opacity: 0.32 }), { 'data-art': 'deck' });
    // the water at the raft's edges: lapping right at the logs' tops when it rides low
    var lap = 'M' + n(L.fl - 6) + ' ' + n(L.front) + 'L' + n(L.bl - (low ? 6 : 64)) + ' 1010M' + n(L.fr + 6) + ' ' + n(L.front) + 'L' + n(L.br + (low ? 6 : 64)) + ' 1010';
    back += stroke(lap, C.rip, low ? 10 : 4, { opacity: low ? 0.7 : 0.8 });
    if (low) {
      var wav = '';
      for (i = 0; i < 9; i++) { var t = (i + 0.5) / 9, wy = lerp(L.front + 20, 990, t), wl = lerp(L.fl, L.bl, (wy - L.front) / 530), wr = lerp(L.fr, L.br, (wy - L.front) / 530), ww = lerp(10, 60, t);
        wav += 'M' + n(wl - ww) + ' ' + n(wy) + 'q' + n(ww * 0.6) + ' ' + n(-ww * 0.25) + ' ' + n(ww * 1.1) + ' ' + n(ww * 0.05) + 'M' + n(wr + ww) + ' ' + n(wy) + 'q' + n(-ww * 0.6) + ' ' + n(-ww * 0.25) + ' ' + n(-ww * 1.1) + ' ' + n(ww * 0.05); }
      back += stroke(wav, '#FFFFFF', 3, { opacity: 0.75, 'class': 'pcs-glint' });
    }
    // the gap: silver water between the two middle logs; deeper (the logs' sides showing) unless the raft rides low
    var G = gapPoly(), gd = quad(G), gs = '';
    if (!low) gs += path(gd, C.logSide);
    var inner = low ? gd : quad(G.map(function (q, k) { var mid = (G[k][0] + G[G.length - 1 - k][0]) / 2; return [lerp(q[0], mid, 0.16), q[1] + 6]; }));
    gs += path(inner, S.linU([[0, C.water[3]], [0.6, C.water[2]], [1, C.water[1]]], 0, LOW.gapTop, 0, 1000));
    gs += stroke(smooth(G.slice(0, G.length / 2)), C.rip, 3, { opacity: 0.8 }) + stroke(smooth(G.slice(G.length / 2)), C.rip, 3, { opacity: 0.8 });
    var gr = '';
    for (i = 0; i < 7; i++) { var gy = lerp(LOW.gapTop + 60, 990, i / 6), gx = (G[Math.round(i / 6 * (G.length / 2 - 1))][0] + G[G.length - 1 - Math.round(i / 6 * (G.length / 2 - 1))][0]) / 2, gw = lerp(8, 60, i / 6);
      gr += 'M' + n(gx - gw) + ' ' + n(gy) + 'q' + n(gw) + ' ' + n(-5) + ' ' + n(gw * 2) + ' 0'; }
    gs += stroke(gr, C.rip, 2.6, { opacity: 0.85 });
    if (moonAge(S)) gs += path(K.sparkleD(G[G.length - 4][0] - 40, 930, 10) + K.sparkleD(G[6][0] + 30, 820, 7), '#FFFFFF', { opacity: 0.85, 'class': 'pcs-glint' });
    back += g(gs, { 'data-art': 'gap', 'data-box': boxAttr([Math.min.apply(null, G.map(function (q) { return q[0]; })), LOW.gapTop, Math.max.apply(null, G.map(function (q) { return q[0]; })), 1000]) });
    // a lashing across, beyond the gap
    var ly = 590;
    back += lashing(S, L.logs, ly, 14, lerp(L.fl, L.bl, (ly - L.front) / 530), lerp(L.fr, L.br, (ly - L.front) / 530));
    // rings round whoever is in the gap
    var c = at(S, 'gap');
    if (c) S.covers.gap = ringsOver(S, 'gap', c.a, 0.34, 9711);
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ UNDER: straight down into the gap

  var UNDER = { left: [[-30, -20], [330, -20], [356, 200], [342, 520], [362, 800], [338, 1020], [-30, 1020]], right: [[1630, -20], [1262, -20], [1240, 260], [1258, 560], [1236, 840], [1256, 1020], [1630, 1020]],
    sill: 300, moon: [1050, 300, 64] };
  function logTopDown(S, P, seed, side) {
    var C = cols(S), r = rng(seed), s = '', xs = P.map(function (q) { return q[0]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), inner = side < 0 ? x1 : x0, outer = side < 0 ? x0 : x1;
    s += path(smooth(P, true), S.linU([[0, C.logSide], [0.4, C.logTop], [0.75, C.log], [1, C.logSide]], outer, 0, inner, 0));
    // the bark's grain running along it, wet shine on its top, a knot
    var grain = '';
    for (var i = 0; i < 9; i++) { var gx = lerp(x0 + 30, x1 - 30, (i + 0.5) / 9), dx = (r() - 0.5) * 30; grain += 'M' + n(gx) + ' -20Q' + n(gx + dx) + ' 500 ' + n(gx - dx * 0.5) + ' 1020'; }
    s += stroke(grain, C.logLine, 2.2, { opacity: 0.3 });
    var mid = lerp(x0, x1, side < 0 ? 0.42 : 0.58);
    s += stroke('M' + n(mid) + ' -20Q' + n(mid + side * 12) + ' 500 ' + n(mid) + ' 1020', C.logSheen, 18, { opacity: 0.32 }) + stroke('M' + n(mid + 10) + ' -20Q' + n(mid + 22) + ' 500 ' + n(mid + 10) + ' 1020', '#FFFFFF', 4, { opacity: 0.35 });
    s += ell(mid - side * 40, 640, 26, 40, C.logSide) + ell(mid - side * 40, 640, 14, 24, C.logRing);
    var drops = '';
    for (i = 0; i < 10; i++) drops += K.sparkleD(lerp(x0 + 40, x1 - 40, r()), lerp(40, 960, r()), 5 + r() * 5);
    s += path(drops, '#FFFFFF', { opacity: 0.7, 'class': 'pcs-glint' });
    // the bright wet edge where the log meets the water
    s += stroke(smooth(P.slice(1, P.length - 1)), C.rip, 5, { opacity: 0.8 });
    return g(s, { 'data-art': 'log' });
  }
  function drawUnder(S) {
    var back = '', U = UNDER, C = cols(S), r = rng(9801), i;
    // the water filling the panel: silver, lighter in the middle where the sky shows in it
    back += rect(-10, -10, 1620, 1020, S.linU([[0, C.water[0]], [0.5, C.water[1]], [1, C.water[2]]], 0, 0, 0, 1000));
    back += ell(820, 520, 760, 520, S.radU([[0, C.waterLit, 0.65], [0.6, C.waterLit, 0.2], [1, C.waterLit, 0]], 820, 520, 760));
    // the moon's reflection, wobbling, and its glints
    if (moonAge(S)) {
      var M = U.moon, wob = '';
      keepBox(S, M[0] - M[2] - 10, M[1] - M[2] - 10, 2 * M[2] + 20, 2 * M[2] + 20);
      for (i = 0; i < 6; i++) wob += 'M' + n(M[0] - M[2] * (1.3 - i * 0.1)) + ' ' + n(M[1] - M[2] + i * M[2] * 0.4) + 'h' + n(M[2] * (2.6 - i * 0.2));
      back += g(circ(M[0], M[1], M[2] * 3, S.radU([[0, '#FFFFFF', 0.4], [1, '#FFFFFF', 0]], M[0], M[1], M[2] * 3)) + K.waxingMoon(S, M[0], M[1], M[2], -18, moonAge(S)) +
        stroke(wob, C.water[1], 3, { opacity: 0.5 }), { 'data-art': 'moon', 'data-age': n(moonAge(S)), 'data-at': n(M[0]) + ' ' + n(M[1]) + ' ' + n(M[2]) });
    }
    var rip = '', rip2 = '';
    for (i = 0; i < 40; i++) { var x = 360 + r() * 880, y = r() * 1000, w = 30 + r() * 90; if (i % 2) rip += 'M' + n(x) + ' ' + n(y) + 'q' + n(w / 2) + ' ' + n(-6) + ' ' + n(w) + ' 0'; else rip2 += 'M' + n(x) + ' ' + n(y) + 'h' + n(w * 0.6); }
    back += stroke(rip, C.rip, 3, { opacity: 0.7 }) + stroke(rip2, C.ripDk, 2.4, { opacity: 0.25 });
    back += g(logTopDown(S, U.left, 9811, -1) + logTopDown(S, U.right, 9812, 1), { filter: S.shadow('m') });
    var c = at(S, 'water');
    if (c) S.covers.water = ringsOver(S, 'water', c.a, 0.3, 9821);
    if ((c = at(S, 'lip'))) S.covers.lip = lipCover(S, castEst(S, c.m, c.a));
    return { back: back, over: '', front: '' };
  }
  // The left log over her (`lip`): the same log, drawn again over all of her but her head and forepaws, so she leans
  // over its edge with the rest of her beyond it. It cuts behind her head (never across it), in a band round her only.
  function lipCover(S, est) {
    var U = UNDER, bb = est.body, hb = est.head, w = bb[2] - bb[0], dir = est.face === 'left' ? -1 : 1, m = Math.max(10, w * 0.05);
    var back = dir > 0 ? bb[0] : bb[2], cut = back + dir * w * 0.4;
    cut = dir > 0 ? Math.min(cut, hb[0] - w * 0.03) : Math.max(cut, hb[2] + w * 0.03);
    var x0 = dir > 0 ? -40 : cut, x1 = dir > 0 ? cut : 1640, y0 = Math.min(bb[1], hb[1]) - m * 2, y1 = bb[3] + m * 2;
    var clip = S.clip('fylip', rect(x0, y0, x1 - x0, y1 - y0, '#fff'));
    return g(g(logTopDown(S, U.left, 9811, -1), { 'clip-path': clip }), { 'data-part': 'cover-lip', 'data-box': boxAttr([x0, y0, x1, y1]), 'data-cut': n(cut) });
  }

  // ------------------------------------------------------------------ RIVER: wide, the ferry gliding upriver

  var RIVER = { horizon: 440, front: { p0: [470, 800], p1: [1130, 780], dx: 58, dy: 90, logs: 4 },
    behind: [{ p0: [40, 792], p1: [400, 786], dx: 50, dy: 76, logs: 4 }, { p0: [-360, 794], p1: [-30, 790], dx: 46, dy: 70, logs: 4 }],
    stones: [[-30, 700], [120, 706], [260, 730], [380, 770], [452, 830], [498, 900], [516, 1012], [-30, 1012]], moon: [1200, 150, 54] };
  function homeOn(S) { return S.opts.home === true; }
  function mirX(S, x) { return homeOn(S) ? 1600 - x : x; }
  function mirRaft(S, q) {
    if (!homeOn(S)) return q;
    // turned round: the near edge's ends swap, the deck still reaching back the same way
    return { p0: [1600 - q.p1[0] - q.dx, q.p1[1]], p1: [1600 - q.p0[0] - q.dx, q.p0[1]], dx: q.dx, dy: q.dy, logs: q.logs };
  }
  function drawRiver(S) {
    var back = '', R = RIVER, C = cols(S), home = homeOn(S);
    if (home) {
      // the spots turn round with the raft (a cat at the same place on its logs, facing the other way); moved before the
      // crowd is drawn, so the kit keeps the Clan clear of the cast where it really is
      S.spots = {};
      for (var k in MAINR) S.spots[k] = A(1600 - MAINR[k].x - 12, MAINR[k].y, MAINR[k].h, MAINR[k].face === 'right' ? 'left' : 'right');
      var moved = {};
      for (k in S.anchorMap) moved[k] = S.spots[k] || S.anchorMap[k];
      S.anchorMap = moved;
    }
    back += skyBack(S, R.horizon, R.moon[0]) + moonAt(S, R.moon[0], R.moon[1], R.moon[2]);
    back += farTowers(S, [[40, 346, 30, 436], [80, 312, 26, 436], [114, 360, 34, 436], [160, 330, 24, 436], [196, 372, 30, 436], [240, 352, 22, 436]]);
    back += farBank(S, -20, 1640, R.horizon, 40, 9901);
    back += riverBack(S, R.horizon, 1000, 9902, R.moon[0]);
    // the line of rafts behind (downriver of the front one), tied raft to raft, then the front raft
    var F = mirRaft(S, R.front), rafts = '', ropes = '';
    R.behind.forEach(function (q, i) { rafts += raftSide(S, mirRaft(S, q).p0, mirRaft(S, q).p1, q.dx, q.dy, q.logs, 9911 + i, { art: 'raft-behind' }).svg; });
    var b0 = mirRaft(S, R.behind[0]), b1 = mirRaft(S, R.behind[1]);
    ropes += home ? rope(S, [F.p1[0] + 20, F.p1[1] - 30], [b0.p0[0] + 10, b0.p0[1] - 26]) + rope(S, [b0.p1[0] + 20, b0.p1[1] - 26], [b1.p0[0] + 10, b1.p0[1] - 24])
      : rope(S, [F.p0[0] - 10, F.p0[1] - 30], [b0.p1[0] + 30, b0.p1[1] - 26]) + rope(S, [b0.p0[0] - 10, b0.p0[1] - 26], [b1.p1[0] + 30, b1.p1[1] - 24]);
    var front = raftSide(S, F.p0, F.p1, F.dx, F.dy, F.logs, 9921, { art: 'raft-front' });
    // a wake behind the front raft as it glides (or the bump's rings at the stones)
    var wake = '', wx = home ? F.p1[0] + 40 : F.p0[0] - 30, dir = home ? 1 : -1;
    for (var i = 0; i < 4; i++) wake += 'M' + n(wx + dir * i * 60) + ' ' + n(F.p0[1] + 8 + i * 6) + 'q' + n(dir * 30) + ' ' + n(6) + ' ' + n(dir * 70) + ' ' + n(4);
    back += stroke(wake, C.rip, 3, { opacity: 0.7 }) + g(rafts, { filter: S.shadow('s') }) + ropes + g(front.svg, { filter: S.shadow('s') });
    if (S.opts.luggage === true) back += reedHeap(S, home ? F.p1[0] - 40 : F.p0[0] + 60, F.p0[1] - 22, 110, 76, 9931);
    // the Clan seated small along the logs of every raft
    var seats = [[F.p0[0] + 120, F.p0[1] - 34, 'right', 'sit', 0.62], [F.p0[0] + 330, F.p0[1] - 40, 'right', 'sit', 0.62], [F.p0[0] + 450, F.p0[1] - 42, 'left', 'sit', 0.62],
      [b0.p0[0] + 90, b0.p0[1] - 30, 'right', 'sit', 0.6], [b0.p0[0] + 220, b0.p0[1] - 32, 'left', 'sit', 0.6], [b0.p0[0] + 320, b0.p0[1] - 32, 'right', 'sit', 0.6]];
    if (home) seats = seats.map(function (st) { return [st[0], st[1], st[2] === 'right' ? 'left' : 'right', st[3], st[4]]; });
    back += crowd(S, seats, 0);
    if (home) {
      // the Crossing's stones at the left, the raft's front end bumping in: rings where it meets them
      back += stones(S, R.stones, 9941, 46);
      var bx = R.stones[5][0] + 14, by = F.p0[1] + 2;
      back += stroke('M' + n(bx - 20) + ' ' + n(by) + 'q' + n(30) + ' ' + n(-12) + ' ' + n(60) + ' 0M' + n(bx - 40) + ' ' + n(by + 14) + 'q' + n(50) + ' ' + n(-16) + ' ' + n(100) + ' 0', C.rip, 3, { opacity: 0.85, 'data-art': 'bump' });
    }
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ the set

  function draw(S) {
    if (S.comp === 'shore') return drawShore(S);
    if (S.comp === 'back') return drawBack(S);
    if (S.comp === 'low') return drawLow(S);
    if (S.comp === 'under') return drawUnder(S);
    if (S.comp === 'river') return drawRiver(S);
    return drawDeck(S);
  }

  var MAINR = { 'raft-1': A(700, 752, 184, 'right'), 'raft-2': A(880, 746, 182, 'right'), pole: A(1090, 736, 180, 'right') };

  art.defineSet('ferry', {
    label: 'the otters’ Moon Ferry: a line of log rafts on the moonlit river', tod: 'night', draw: draw,
    // two lights: the boarding at dusk, and the night; any other hour a frame names draws the nearer of them
    todMap: { sunset: 'dusk', golden: 'dusk', day: 'night', morning: 'night' },
    cams: {
      shore: { box: [0, 0, 1600], comp: 'shore' },
      deck: { box: [0, 0, 1600] },
      back: { box: [0, 0, 1600], comp: 'back' },
      low: { box: [0, 0, 1600], comp: 'low' },
      under: { box: [0, 0, 1600], comp: 'under' },
      river: { box: [0, 0, 1600], comp: 'river' }
    },
    anchors: {
      // on the stones, walking down to the rafts; at the stones' edge by the front raft; on its near logs; the poler
      shore: {
        'bank-1': A(210, 930, 286, 'right'), 'bank-2': A(300, 792, 236, 'right'), 'bank-3': A(130, 690, 200, 'right'),
        edge: A(540, 936, 286, 'right'), 'log-1': A(760, 862, 266, 'left'), 'log-2': A(940, 851, 262, 'right'), pole: A(1170, 838, 258, 'left')
      },
      // aboard: three a side, the near ones bigger; our cat mid-raft at the left and her friend beside her; the
      // poler at the front end; the near right corner by the luggage
      main: {
        'seat-1': A(240, 908, 304, 'right'), 'seat-2': A(436, 700, 206, 'right'), 'seat-3': A(548, 604, 160, 'right'),
        'seat-4': A(1050, 592, 152, 'left'), 'seat-5': A(1160, 676, 192, 'left'), 'seat-6': A(1280, 772, 240, 'left'),
        front: A(626, 806, 256, 'right'), beside: A(836, 806, 256, 'left'), pole: A(800, 536, 138, 'right'), back: A(1190, 952, 322, 'left')
      },
      // the heap's side, and the three at the left
      back: { heap: A(810, 940, 330, 'left'), 'back-1': A(160, 958, 340, 'right'), 'back-2': A(392, 902, 306, 'right'), 'back-3': A(606, 956, 338, 'right') },
      // the gap's left edge (lying flat, chin over it), beside it on both sides, behind
      low: {
        gap: A(800, 936, 300, 'right', { air: true }), lie: A(584, 972, 336, 'right'),
        'sit-1': A(560, 904, 316, 'right'), 'sit-2': A(1040, 904, 316, 'left'), 'sit-3': A(270, 874, 300, 'right')
      },
      under: { water: A(800, 780, 380, 'right', { air: true }), lip: A(340, UNDER.sill, 380, 'right', { elev: true }) },
      river: MAINR
    },
    opts: { moon: 'number', clan: [false, true], luggage: [false, true], puff: [false, true], low: [false, true], home: [false, true] },
    defaults: {}
  });

  // For the tests: the geometry of each camera (the water's colours by light, the rafts, the gap, the stones, the
  // heap, the moon), and the seats the crowd is given.
  art.ferryInfo = function () {
    return {
      colours: { night: JSON.parse(JSON.stringify(NIGHT)), dusk: JSON.parse(JSON.stringify(DUSK)) },
      shore: JSON.parse(JSON.stringify(SHORE)), deck: JSON.parse(JSON.stringify(DECK)), back: JSON.parse(JSON.stringify(BACK)),
      low: JSON.parse(JSON.stringify(LOW)), gap: gapPoly(), under: JSON.parse(JSON.stringify(UNDER)), river: JSON.parse(JSON.stringify(RIVER)),
      inPoly: inPoly, deckEdgeAt: deckEdgeAt
    };
  };

  // The painters Gathering Island shares (sets/island.js, loaded after this file): the same front raft at its
  // shore, the same heap of reeds, the same water, in the night's colours.
  art.ferryParts = { raftSide: raftSide, reedHeap: reedHeap, rope: rope, farBank: farBank, farTowers: farTowers, moonPath: moonPath, night: NIGHT };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
