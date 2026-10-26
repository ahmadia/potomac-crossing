/* Potomac Crossing · app/art/sets/grove.js
 *
 * The set: GroveClan's woods (chapter 9, "Featherlight"; docs/chapters/09-featherlight.spec.md, section 4,
 * "The new set, grove"). Down the river path a little old footbridge crosses a narrow channel into very old
 * woods: very tall trees with wide trunks and roots like arms, ferns, dappled light on soft ground, and the
 * old oak, furry with moss, with the hollow high in its trunk. A bright afternoon, green and gold, and never
 * dark: the channel is narrow, bright and clear in the sun (the standing rule for water), the shade under the
 * trees a soft green, the hollow a cosy nook. Nothing in it is frightening. It is drawn only by day (`todFixed`):
 * any hour a frame names, the woods keep their afternoon.
 *
 * Five cameras, each its own composition in the 1600 x 1000 world, with its own anchors:
 *   bridge  the approach: the river path's near bank at the left, the little footbridge (low stone sides, a
 *           worn flat top) over the channel of clear bright water, and on its far side the very old trees.
 *           Anchors `near-1`, `near-2` (on the near bank at the bridge's foot, facing right), `span-1`,
 *           `span-2` (on the bridge itself: her first steps on it; Riffle waiting with his mint), `far` (at the
 *           bridge's far end). Nobody's spot is on the water: the two on the span stand on its deck.
 *   wide    over the bridge: the bridge's end small at the left, the woods rising across the panel, huge
 *           trunks, green-gold light, ferns; the visitors small under the trees. Anchors `edge-1`, `edge-2`,
 *           `edge-3` (at the bridge's end, waiting to be asked in, facing right), `elder` (stepping out from
 *           between the trunks at the right, facing left), `fern` (behind the elder, half hidden by a fern:
 *           the apprentice, a face and ears showing).
 *   meet    at cat height under the trees: `meet-1`, `meet-2`, `meet-3` (the visitors, left, facing right),
 *           `elder` (right, facing left), `fern` (behind the elder, as on `wide`).
 *   oak     the old oak: an enormous trunk furry with moss, green, gold and grey; on its shaded north side
 *           (the left: the afternoon sun is on its right), low, a patch of soft silver moss, always drawn
 *           (<g data-art="silver-moss" data-box>); roots like arms at its foot; high in the trunk the hollow,
 *           a round opening, its inside a soft dusk-green, never black (<g data-art="hollow" data-box>).
 *           Anchors `root-1`, `root-2`, `root-3` (at the oak's foot among the roots), `elder` (beside the oak,
 *           right), `trunk` (on the trunk partway up toward the hollow: a climber in `stretch`; `elev` and
 *           `air`, so scenes.js lays no ground shadow on the bark), `moss` (at the silver moss, low: a cat
 *           crouched there gathering it, facing it).
 *   hollow  inside the hollow, close: a snug round nook of old wood lined with soft moss, warm green-gold light
 *           through the opening at the left. Anchors `nook` (on the moss: Mizzle, small, curled or sitting up)
 *           and `lip` (at the opening: our cat, head, shoulders and forepaws in, the rest of her cut by the
 *           opening's rim, as the tracks' `stash-in`; the rim cuts below her forepaws, so a leaf held at her
 *           paws, and its `tap: 'leaf'` box, stay in view). `lip` is on the opening's sill, above the nook's
 *           floor (`elev`).
 *
 * Covers, each drawn just after whoever is at the spot (scenes.js S.covers), with `data-part` and a
 * `data-box` (the world box it covers: x0 y0 x1 y1) for the tests:
 *   fern  (wide, meet) a fern over the apprentice up to her eyes: her ears, eyes and the top of her head above it
 *   lip   (hollow) the opening's bark rim over all of her but her head, shoulders and forepaws (`data-cut`: the
 *         rim's edge, behind her shoulders); nothing below her forepaws is drawn over her
 *
 * Options: none (`opts: {}`, `defaults: {}`). The snore from the hollow is the frame's sound, not the art's.
 *
 * PC.art.groveInfo() -> the geometry the tests read: the channel (bridge), the bridge's deck, the oak's
 * trunk, its hollow and its silver moss, the nook's opening and its rim.
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
    dot = K.dot, mix = K.mix, lerp = K.lerp, clamp = K.clamp, rng = K.rng, blob = K.blob, mound = K.mound, leafD = K.leafD, A = K.anchor;

  // ------------------------------------------------------------------ colours: an old wood in the afternoon sun

  // Green and gold. Nothing here is darker than the shade side of an old trunk in the sun, and that is a warm
  // grey-brown: the woods are bright, the shade soft and green, the water clear.
  var C = {
    sky: '#CFE8F2', skyGold: '#FFF4CC', haze: '#E4F0D8',
    leafDeep: '#4B8640', leaf: '#62A048', leafMid: '#7DB653', leafLt: '#A4CD62', leafGold: '#D3DC74', leafSun: '#EEF0A6',
    farTrunk: '#B9B39A', farTrunkLt: '#D6D2BA', farLeaf: '#A9C98A',
    bark: '#8E765C', barkDk: '#76624E', barkLt: '#B2967A', barkSun: '#D6BC92', barkLine: '#665444',
    mossG: '#7DAF45', mossGLt: '#A9CF5E', mossGold: '#CDB955', mossGoldLt: '#EAD983', mossGrey: '#A8AE9C', mossGreyLt: '#CBD0C0',
    silver: '#C9D6D2', silverLt: '#E9F1EE', silverDk: '#A9BAB5', silverSheen: '#FFFFFF',
    ground: '#8DBB5A', groundFar: '#A9CB72', groundNear: '#77A84C', groundLt: '#B9D57C', litter: '#D9BE6E', litterDk: '#B99B52',
    path: '#DCC596', pathLt: '#EEDDB4', pathDk: '#C2A878',
    fern: '#5E9E46', fernLt: '#8CC35C',
    water: '#A8E0D2', waterFar: '#CBEDE0', waterNear: '#BDEADB', waterDeep: '#8CCFC0', bed: '#E8DDB2', bedDk: '#CDBE8C', ripple: '#FFFFFF',
    stone: '#C6BFAC', stoneLt: '#E6E0CF', stoneDk: '#A39A86', stoneLine: '#8E8572', deck: '#DAD3BF', deckLt: '#EEE9D9',
    light: '#FFF3BE', sun: '#FFF9DC',
    // the hollow in the oak, from outside: a soft dusk-green, never black
    inDusk: '#6E9A72', inDeep: '#5C8862', inGlow: '#A6C98A',
    // inside the nook: warm old wood, soft moss, green-gold light
    wood: '#A98360', woodLt: '#CBA57A', woodDk: '#8C6C4E', woodLine: '#7E6046', nookMoss: '#8FBE5E', nookMossLt: '#B9D97E', nookMossDk: '#74A44A',
    out: '#EAF3C6', outLeaf: '#B9D87A', outLeafLt: '#DCEB9C'
  };

  // ------------------------------------------------------------------ helpers

  // a smooth path through points (quadratic midpoints); closed with Z when asked
  function smooth(P, closed) {
    var d = 'M' + n(P[0][0]) + ' ' + n(P[0][1]), i;
    for (i = 1; i < P.length - 1; i++) d += 'Q' + n(P[i][0]) + ' ' + n(P[i][1]) + ' ' + n((P[i][0] + P[i + 1][0]) / 2) + ' ' + n((P[i][1] + P[i + 1][1]) / 2);
    d += 'L' + n(P[P.length - 1][0]) + ' ' + n(P[P.length - 1][1]);
    return closed ? d + 'Z' : d;
  }
  // y of a left-to-right polyline at x
  function lineAt(P, x) {
    if (x <= P[0][0]) return P[0][1];
    for (var i = 1; i < P.length; i++) if (x <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / ((P[i][0] - P[i - 1][0]) || 1));
    return P[P.length - 1][1];
  }
  function inPoly(P, x, y) {
    var inside = false;
    for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
      if (((P[i][1] > y) !== (P[j][1] > y)) && (x < (P[j][0] - P[i][0]) * (y - P[i][1]) / ((P[j][1] - P[i][1]) || 1e-9) + P[i][0])) inside = !inside;
    }
    return inside;
  }
  function boxAttr(b) { return n(b[0]) + ' ' + n(b[1]) + ' ' + n(b[2]) + ' ' + n(b[3]); }

  // ------------------------------------------------------------------ who is where (for the covers)

  // Where a cast member at spot `a` is drawn, as scenes.js draws it (the cats' units, a sitting Clan cat's
  // height to the spot's `h`, the size band art.sizeBands holds a newcomer to): its body and head boxes in the
  // world, [x0, y0, x1, y1]. Without the character drawings, a sitting cat's shape at the spot.
  var OWN = { who: 1, at: 1, pose: 1, mood: 1, variant: 1, facing: 1, size: 1, purr: 1, lift: 1, look: 1, sex: 1, taken: 1 };
  function castEst(S, m, a) {
    var fn = art.character, who = m.who || 'clancat', face = m.facing || a.face || 'right', H = a.h * (m.size > 0 ? +m.size : 1), k;
    var o = { pose: m.pose || 'sit', mood: m.mood || 'neutral' };
    if (m.variant != null) o.variant = m.variant;
    for (k in m) if (Object.prototype.hasOwnProperty.call(m, k) && !OWN[k] && m[k] != null) o[k] = m[k];
    function lookOf(w, oo) { if (w === 'player') { oo.look = S.look || {}; if (oo.look.sex) oo.sex = oo.look.sex; } return oo; }
    lookOf(who, o);
    o.facing = face;
    var ch = null, ref = null;
    if (typeof fn === 'function' && !fn.placeholder) {
      try { ch = fn(who, o); ref = fn('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }); } catch (e) { ch = null; }
    }
    if (!ch || !(ch.w > 0) || !(ch.h > 0) || !ref || !(ref.h > 0)) {
      return { face: face, body: [a.x - H * 0.42, a.y - H * 0.78, a.x + H * 0.42, a.y], head: [a.x - H * 0.2, a.y - H * 0.78, a.x + H * 0.2, a.y - H * 0.42], held: null, drawn: false };
    }
    var s = H / ref.h, band = art.sizeBands && art.sizeBands[who];
    if (band) {
      var meas = function (w, pose) {
        var c = null;
        try { c = fn(w, lookOf(w, { pose: pose, mood: 'neutral' })); } catch (e) { c = null; }
        var hb = c && c.headBox;
        if (!c || !hb) return 1;
        return Math.max(1, band.by === 'head' ? ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2 : c.h - hb.y0);
      };
      var ratio = meas(who, band.pose) / meas(band.ref, 'sit');
      if (ratio > 0 && isFinite(ratio)) s = s * clamp(ratio, band.min, band.max) / ratio;
    }
    var bb = ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h };
    var hb = ch.headBox || { x0: ch.head.x - ch.w * 0.2, y0: ch.head.y - ch.h * 0.18, x1: ch.head.x + ch.w * 0.2, y1: ch.head.y + ch.h * 0.18 };
    function W(b) { return [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s]; }
    var held = ch.held ? [a.x + (ch.held.x - ch.w / 2) * s, a.y + (ch.held.y - ch.h) * s, ch.held.r * s] : null;
    return { face: face, body: W(bb), head: W(hb), held: held, drawn: true };
  }
  // the first cast member at a named spot here, with its spot
  function who(S, name) {
    var a = (S.anchorMap || {})[name], cast = S.cast || [];
    if (!a) return null;
    for (var i = 0; i < cast.length; i++) if (cast[i] && cast[i].at === name) return { m: cast[i], a: a };
    return null;
  }

  // ------------------------------------------------------------------ painters

  // The light under old trees: the sky's gold glimpses behind everything, a soft haze low down.
  function skyBack(S, y1) {
    var s = rect(-10, -10, 1620, y1 + 20, S.linU([[0, C.sky], [0.55, C.skyGold], [1, C.haze]], 0, 0, 0, y1));
    s += circ(1180, 120, 520, S.radU([[0, C.sun, 0.9], [0.35, C.light, 0.45], [1, C.light, 0]], 1180, 120, 520));
    return s;
  }

  // A canopy of leaves across the top, from x0 to x1, its lower edge about `low` (uneven: here a mass of leaves
  // hangs lower, there a gap), in layers: deep green behind, then mid greens, sunlit gold-green clusters toward the
  // sun (the right); small gaps of gold sky. o.clear: [x0, x1, y] keeps every leaf above y between x0 and x1.
  function canopy(S, x0, x1, low, seed, o) {
    o = o || {};
    var r = rng(seed), s = '', layers = [[C.leafDeep, 0.78], [C.leaf, 0.9], [C.leafMid, 1]];
    function capY(x, y, ry) { var cl = o.clear; return cl && x > cl[0] - 120 && x < cl[1] + 120 ? Math.min(y, cl[2] - ry * 0.75) : y; }
    layers.forEach(function (L, li) {
      var d = '';
      for (var x = x0 - 60; x < x1 + 60; x += 60 + r() * 60) {
        var rx = 60 + r() * 80, ry = 40 + r() * 50, dip = r() < 0.25 ? low * 0.35 : 0;
        var y = capY(x, low * L[1] - ry * 0.5 + (r() - 0.5) * low * 0.25 + dip, ry);
        d += blob(x, y, rx, ry, 9, r, 0.25, 0.32);
      }
      d += 'M' + n(x0 - 60) + ' -20H' + n(x1 + 60) + 'V' + n(low * L[1] * 0.45) + 'H' + n(x0 - 60) + 'Z';
      s += path(d, L[0]);
    });
    // sunlit clusters (more toward the right, where the sun is), and leaves along the lower edge
    var sun = '', sun2 = '', lv = '', lv2 = '';
    for (var i = 0; i < (o.clusters || 14); i++) {
      var cx = lerp(x0, x1, Math.pow(r(), 0.7)), cy = capY(cx, low * (0.15 + r() * 0.6), 30);
      if (i % 2) sun += blob(cx, cy, 30 + r() * 50, 18 + r() * 28, 8, r, 0.3, 0.3); else sun2 += blob(cx, cy, 24 + r() * 36, 14 + r() * 20, 8, r, 0.3, 0.3);
    }
    for (i = 0; i < (o.leaves || 60); i++) {
      var lx = x0 + r() * (x1 - x0), ly = capY(lx, low * (0.55 + r() * 0.6), 20), la = Math.PI / 2 + (r() - 0.5) * 1.6;
      if (i % 3) lv += leafD(lx, ly, 16 + r() * 18, la, 6 + r() * 4); else lv2 += leafD(lx, ly, 14 + r() * 16, la, 5 + r() * 4);
    }
    s += path(sun, C.leafLt, { opacity: 0.85 }) + path(sun2, C.leafGold, { opacity: 0.8 }) + path(lv, C.leafMid) + path(lv2, C.leafSun, { opacity: 0.85 });
    // small gaps where the gold sky shows through
    var gaps = '';
    for (i = 0; i < (o.gaps || 8); i++) gaps += blob(x0 + r() * (x1 - x0), low * (0.1 + r() * 0.35), 8 + r() * 16, 6 + r() * 9, 7, r, 0.3, 0.3);
    s += path(gaps, C.skyGold, { opacity: 0.9 });
    return g(s, { 'data-art': 'canopy' });
  }
  // The woods going on behind: pale soft masses of leaves between the far trunks, from the floor up into the haze.
  function farWoods(S, floor, seed) {
    var r = rng(seed), a = '', b = '';
    for (var x = -60; x < 1680; x += 90 + r() * 90) {
      var rx = 90 + r() * 110, ry = 70 + r() * 110, y = floor - ry * (0.6 + r() * 1.4);
      if (r() < 0.5) a += blob(x, y, rx, ry, 9, r, 0.25, 0.3); else b += blob(x, y, rx, ry, 9, r, 0.25, 0.3);
    }
    return path(a, C.farLeaf, { opacity: 0.75 }) + path(b, mix(C.farLeaf, C.haze, 0.4), { opacity: 0.8 });
  }

  // Soft slanting beams of afternoon light through the leaves (from the upper right). list: [[xTop, wTop, xBot, wBot, yBot, op]]
  function shafts(S, list) {
    var s = '';
    list.forEach(function (q, i) {
      var f = S.linU([[0, C.light, 0], [0.25, C.light, q[5] || 0.28], [1, C.light, 0]], 0, 0, 0, q[4]);
      s += poly([[q[0] - q[1] / 2, -10], [q[0] + q[1] / 2, -10], [q[2] + q[3] / 2, q[4]], [q[2] - q[3] / 2, q[4]]], f);
    });
    return g(s, { 'data-art': 'light' });
  }

  // Soft ground from y0 (far) down, green and gold, leaf litter and tufts on it.
  function groundLayer(S, top, seed, o) {
    o = o || {};
    var r = rng(seed), s = '';
    var d = smooth(top) + 'L1640 1030L-40 1030Z';
    s += path(d, S.linU([[0, C.groundFar], [0.45, C.ground], [1, C.groundNear]], 0, lineAt(top, 800), 0, 1000));
    // leaf litter and soft moss mounds
    var lit = '', litDk = '', mossy = '', y0 = lineAt(top, 800);
    for (var i = 0; i < (o.litter || 90); i++) {
      var x = r() * 1600, y = lineAt(top, x) + 6 + Math.pow(r(), 0.8) * (1000 - lineAt(top, x));
      var k = 0.5 + (y - y0) / 600;
      if (i % 4) lit += leafD(x, y, 9 * k + r() * 7 * k, r() * 6.28, 3 * k); else litDk += leafD(x, y, 9 * k, r() * 6.28, 3 * k);
      if (i % 6 === 0) mossy += blob(x, y, 30 * k + r() * 30 * k, 7 * k + r() * 5 * k, 8, r, 0.3, 0.3);
    }
    s += path(mossy, C.groundLt, { opacity: 0.55 }) + path(lit, C.litter, { opacity: 0.8 }) + path(litDk, C.litterDk, { opacity: 0.6 });
    s += K.tufts(S, 0, 1600, y0 + 10, 990, o.tufts || 46, seed + 7, C.mossG, C.leafLt, o.tuftSize || 1.6);
    if (o.flowers) s += K.flowers(S, 0, 1600, y0 + 20, 980, o.flowers, seed + 9, '#FFF8EC');
    return s;
  }

  // Dappled sunlight on the ground (kit.sunSpots), warm and soft.
  function dapples(S, list) { return K.sunSpots(S, list); }

  // A moss patch: a soft scalloped cushion with a furry edge and a light top. col, lt: its two tones.
  function mossPatch(S, cx, cy, rx, ry, col, lt, seed) {
    var r = rng(seed), d = blob(cx, cy, rx, ry, 10, r, 0.3, 0.35), fur = '', hi = '';
    for (var i = 0; i < Math.round(8 + rx / 4); i++) {
      var a = r() * Math.PI * 2, ex = cx + Math.cos(a) * rx * 0.98, ey = cy + Math.sin(a) * ry * 0.98, l = 3 + r() * 5;
      fur += 'M' + n(ex) + ' ' + n(ey) + 'l' + n(Math.cos(a) * l) + ' ' + n(Math.sin(a) * l);
    }
    hi += blob(cx - rx * 0.15, cy - ry * 0.3, rx * 0.55, ry * 0.35, 8, r, 0.3, 0.3);
    return path(d, col) + stroke(fur, col, 2.4) + path(hi, lt, { opacity: 0.7 });
  }
  // Moss growing on bark: a long soft streak up the trunk, following its furrows, furry at the edges (short
  // strands hanging down from it), its sunny side lighter, fine strands over it. w, h: its size.
  function mossStreak(S, cx, cy, w, h, col, lt, seed) {
    var r = rng(seed), P = [], k = 12, i;
    for (i = 0; i < k; i++) {
      var a = Math.PI * 2 * i / k, j = 0.8 + r() * 0.4;
      P.push([cx + Math.cos(a) * w / 2 * j * (Math.sin(a) > 0 ? 1.1 : 0.9), cy + Math.sin(a) * h / 2 * j]);
    }
    var d = K.scallops(P, cx, cy, 0.3, true), fur = '', strands = '';
    for (i = 0; i < Math.round(6 + w / 5); i++) {
      var t = r(), ex = cx + (t - 0.5) * w * 0.9, ey = cy + h * 0.38 + r() * h * 0.1, l = 4 + r() * 8;
      fur += 'M' + n(ex) + ' ' + n(ey) + 'l' + n((r() - 0.5) * 3) + ' ' + n(l);
    }
    for (i = 0; i < Math.round(4 + h / 10); i++) {
      var sx = cx + (r() - 0.5) * w * 0.7, sy = cy + (r() - 0.5) * h * 0.7;
      strands += 'M' + n(sx) + ' ' + n(sy) + 'l' + n((r() - 0.5) * 2) + ' ' + n(-4 - r() * 6);
    }
    return path(d, col) + stroke(fur, col, 2.2) + path(blob(cx + w * 0.16, cy - h * 0.1, w * 0.3, h * 0.32, 8, r, 0.3, 0.3), lt, { opacity: 0.65 }) + stroke(strands, lt, 1.6, { opacity: 0.7 });
  }

  // An old trunk: wide, its foot flaring into roots, bark in long furrows, the sun on its right, the shade on its
  // left a soft warm grey-brown; moss in patches, green, gold and grey (more toward the shaded side).
  // T: { cx, top, base, wt (half-width at the top), wb (half-width above the flare), fl (the flare), lean, seed, moss, far }
  function trunkShape(T) {
    var L = [[T.cx - T.wt + (T.lean || 0), T.top], [T.cx - T.wt * 1.04 + (T.lean || 0) * 0.5, lerp(T.top, T.base, 0.45)], [T.cx - T.wb, lerp(T.top, T.base, 0.8)], [T.cx - T.wb - T.fl * 0.5, T.base - (T.base - T.top) * 0.04], [T.cx - T.wb - T.fl, T.base]];
    var R = [[T.cx + T.wb + T.fl, T.base], [T.cx + T.wb + T.fl * 0.5, T.base - (T.base - T.top) * 0.04], [T.cx + T.wb, lerp(T.top, T.base, 0.8)], [T.cx + T.wt * 1.04 + (T.lean || 0) * 0.5, lerp(T.top, T.base, 0.45)], [T.cx + T.wt + (T.lean || 0), T.top]];
    return { L: L, R: R, d: smooth(L.concat([[T.cx, T.base + 8]], R), true) };
  }
  function trunk(S, T) {
    var sh = trunkShape(T), r = rng(T.seed || 501), s = '', far = T.far || 0, i;
    var col = function (c) { return far ? mix(c, C.haze, far) : c; };
    var x0 = T.cx - T.wb - T.fl, x1 = T.cx + T.wb + T.fl;
    s += path(sh.d, S.linU([[0, col(C.barkDk)], [0.4, col(C.bark)], [0.78, col(C.barkLt)], [1, col(C.barkSun)]], x0, 0, x1, 0));
    var clip = S.clip('trk' + (T.seed || 501), path(sh.d, '#fff'));
    // furrows: long wavy lines up the bark, lighter ridges beside them
    var fur = '', ridge = '', H = T.base - T.top;
    for (i = 0; i < Math.round((x1 - x0) / 26); i++) {
      var fx = x0 + (i + 0.5) * (x1 - x0) / Math.round((x1 - x0) / 26) + (r() - 0.5) * 10, y = T.top - 10, P = [[fx, y]];
      for (var k = 1; k <= 8; k++) P.push([fx + Math.sin(k * 1.3 + i) * 7 + (r() - 0.5) * 6, T.top + H * k / 8 + 10]);
      fur += smooth(P);
      ridge += smooth(P.map(function (q) { return [q[0] + 7, q[1]]; }));
    }
    var inner = stroke(fur, col(C.barkLine), Math.max(2, (x1 - x0) * 0.008), { opacity: 0.45 }) + stroke(ridge, col(C.barkSun), Math.max(1.4, (x1 - x0) * 0.005), { opacity: 0.35 });
    // the sun on the right edge, a soft green shade on the left
    inner += rect(x1 - (x1 - x0) * 0.16, T.top - 20, (x1 - x0) * 0.2, H + 40, S.linU([[0, C.barkSun, 0], [1, C.sun, 0.45]], x1 - (x1 - x0) * 0.16, 0, x1, 0));
    inner += rect(x0 - 10, T.top - 20, (x1 - x0) * 0.32, H + 40, S.linU([[0, C.leafMid, 0.22], [1, C.leafMid, 0]], x0, 0, x0 + (x1 - x0) * 0.32, 0));
    // moss in patches
    var moss = '', cnt = T.moss == null ? 4 : Math.round(T.moss * 0.6);
    for (i = 0; i < cnt; i++) {
      var u = Math.pow(r(), 1.3), mx = lerp(x0 + (x1 - x0) * 0.08, x1 - (x1 - x0) * 0.2, u), my = T.top + H * (0.3 + r() * 0.65), kind = r();
      var mc = kind < 0.5 ? [C.mossG, C.mossGLt] : kind < 0.78 ? [C.mossGold, C.mossGoldLt] : [C.mossGrey, C.mossGreyLt];
      mc = [mix(mc[0], C.bark, 0.25), mix(mc[1], C.bark, 0.15)];
      moss += mossStreak(S, mx, my, (x1 - x0) * (0.08 + r() * 0.08), (x1 - x0) * (0.18 + r() * 0.2), col(mc[0]), col(mc[1]), (T.seed || 501) * 7 + i);
    }
    inner += moss;
    s += g(inner, { 'clip-path': clip });
    return s;
  }

  // A root like an arm: from (x0, y0) at the trunk's foot out along the ground to (x1, y1), thick to thin,
  // bending by `bend`; the bark's colour, its top lit, a moss tuft or two.
  function rootArm(S, x0, y0, x1, y1, w0, bend, seed, far) {
    var r = rng(seed), mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - bend, top = [], bot = [], mid = [];
    for (var i = 0; i <= 14; i++) {
      var t = i / 14, u = 1 - t, x = u * u * x0 + 2 * u * t * mx + t * t * x1, y = u * u * y0 + 2 * u * t * my + t * t * y1;
      // thick where it leaves the trunk, a knuckle or two, thin at its end
      var w = lerp(w0, w0 * 0.1, Math.pow(t, 0.7)) * (1 + 0.12 * Math.sin(t * 9 + seed));
      top.push([x, y - w * 0.62]); bot.unshift([x, y + w * 0.38]); mid.push([x, y - w * 0.3]);
    }
    var col = function (c) { return far ? mix(c, C.haze, far) : c; };
    var d = smooth(top.concat(bot), true);
    // its shadow on the ground, then the root: lit along its top, rounder and darker underneath
    var s = path(smooth(bot.map(function (q) { return [q[0], q[1] + 4]; }).concat(top.slice().reverse().map(function (q) { return [q[0], q[1] + w0 * 0.5]; })), true), C.groundNear, { opacity: 0.35 });
    s += path(d, S.linU([[0, col(C.barkSun)], [0.35, col(C.barkLt)], [0.75, col(C.bark)], [1, col(C.barkDk)]], 0, Math.min(y0, y1) - w0 * 0.6, 0, Math.max(y0, y1) + w0 * 0.4));
    s += stroke(smooth(mid), col(C.barkLine), Math.max(1.5, w0 * 0.03), { opacity: 0.35 });
    if (r() < 0.85) s += mossStreak(S, lerp(x0, x1, 0.28), lerp(y0, y1, 0.28) - w0 * 0.42, w0 * 0.9, w0 * 0.32, col(C.mossG), col(C.mossGLt), seed + 3);
    return s;
  }

  // A fern clump (kit.fernClump) in this wood's greens.
  function fern(S, x, y, size, seed, o) {
    o = o || {};
    return K.fernClump(S, x, y, size, { seed: seed, count: o.count || 7, spread: o.spread || 2.2, lean: o.lean || 0, color: o.color || C.fern, rim: C.leafSun, rimOp: 0.7, avoid: o.avoid });
  }

  // ------------------------------------------------------------------ BRIDGE: the approach

  // The channel: narrow, bright and clear, running from the woods (far, top) toward us under the bridge.
  var CH_L = [[808, 556], [770, 640], [712, 760], [664, 880], [626, 1010]], CH_R = [[872, 556], [918, 640], [990, 760], [1050, 880], [1094, 1010]];
  var CHANNEL = CH_L.concat(CH_R.slice().reverse());
  // The footbridge: its deck's top line (a gentle hump), from its near end on the path to its far end in the woods.
  var DECK = { x0: 470, x1: 1210, y: 738, hump: 20, front: 112 };
  function deckY(x) { return DECK.y - DECK.hump * Math.sin(Math.PI * clamp((x - DECK.x0) / (DECK.x1 - DECK.x0), 0, 1)); }
  var ARCH = { cx: 846, w: 300, top: 778, foot: 868 };

  // x of a bank line (top to bottom) at height y
  function bankX(P, y) {
    if (y <= P[0][1]) return P[0][0];
    for (var i = 1; i < P.length; i++) if (y <= P[i][1]) return lerp(P[i - 1][0], P[i][0], (y - P[i - 1][1]) / ((P[i][1] - P[i - 1][1]) || 1));
    return P[P.length - 1][0];
  }
  function water(S, seed) {
    var r = rng(seed), s = '', d = pts(CHANNEL) + 'Z', clip = S.clip('gvch', path(d, '#fff'));
    s += path(d, S.linU([[0, C.waterFar], [0.4, C.water], [1, C.waterNear]], 0, 556, 0, 1010));
    var inner = '';
    // the sandy bed seen through it, and pebbles
    var bed = '', peb = '';
    for (var i = 0; i < 46; i++) {
      var y = 580 + Math.pow(r(), 0.7) * 420, xl = bankX(CH_L, y), xr = bankX(CH_R, y), x = lerp(xl, xr, 0.08 + r() * 0.84), k = 0.5 + (y - 556) / 400;
      if (i % 3) peb += blob(x, y, (5 + r() * 6) * k, (3 + r() * 3) * k, 7, r, 0.25, 0.25); else bed += blob(x, y, (20 + r() * 30) * k, (5 + r() * 5) * k, 8, r, 0.3, 0.3);
    }
    inner += path(bed, C.bed, { opacity: 0.6 }) + path(peb, C.bedDk, { opacity: 0.55 });
    // ripples, the sun's net on the bottom, sparkles
    var rip = '', net = '', sp = '';
    for (i = 0; i < 30; i++) {
      y = 570 + Math.pow(r(), 0.8) * 430; xl = bankX(CH_L, y); xr = bankX(CH_R, y); x = lerp(xl, xr, 0.1 + r() * 0.8);
      var L = (14 + r() * 26) * (0.5 + (y - 556) / 300);
      rip += 'M' + n(x) + ' ' + n(y) + 'q' + n(L / 4) + ' -3 ' + n(L / 2) + ' 0t' + n(L / 2) + ' 0';
    }
    for (i = 0; i < 60; i++) {
      y = 600 + r() * 400; xl = bankX(CH_L, y); xr = bankX(CH_R, y); x = lerp(xl, xr, r());
      var cl = (8 + r() * 12) * (0.6 + (y - 556) / 400), ca = r() * Math.PI;
      net += 'M' + n(x - Math.cos(ca) * cl / 2) + ' ' + n(y - Math.sin(ca) * cl * 0.2) + 'Q' + n(x) + ' ' + n(y + (r() - 0.5) * 6) + ' ' + n(x + Math.cos(ca) * cl / 2) + ' ' + n(y + Math.sin(ca) * cl * 0.2);
    }
    inner += stroke(net, '#FFFFFF', 1.5, { opacity: 0.4 }) + g(stroke(rip, C.ripple, 2.4, { opacity: 0.8 }), { 'class': 'pcs-drift', style: 'animation-duration:12s' });
    for (i = 0; i < 12; i++) {
      y = 600 + r() * 390; xl = bankX(CH_L, y); xr = bankX(CH_R, y); x = lerp(xl, xr, 0.15 + r() * 0.7);
      sp += path(K.sparkleD(x, y, 5 + r() * 7), '#FFFFFF', { 'class': i % 2 ? 'pcs-glint' : 'pcs-twk', style: 'animation-delay:-' + (r() * 3).toFixed(1) + 's' });
    }
    inner += sp;
    // the banks' soft edges
    s += g(inner, { 'clip-path': clip });
    s += stroke(smooth(CH_L), C.groundLt, 5, { opacity: 0.8 }) + stroke(smooth(CH_R), C.groundLt, 5, { opacity: 0.8 });
    return g(s, { 'data-art': 'channel' });
  }

  // Stone blocks in courses over a band: from x0 to x1, between yTop(x) and yBot(x). o: rows, seed, col, lt, dk
  function courses(S, x0, x1, yTop, yBot, o) {
    var r = rng(o.seed || 601), s = '', joints = '', moss = '', rows = o.rows || 3;
    for (var j = 0; j < rows; j++) {
      var x = x0 - r() * 30;
      while (x < x1) {
        var w = 40 + r() * 46, xa = Math.max(x, x0), xb = Math.min(x + w, x1), mid = (xa + xb) / 2;
        var t0 = lerp(yTop(mid), yBot(mid), j / rows), t1 = lerp(yTop(mid), yBot(mid), (j + 1) / rows);
        var c = mix(o.col, r() < 0.5 ? o.lt : o.dk, r() * 0.45);
        s += poly([[xa + 2, lerp(yTop(xa), yBot(xa), j / rows) + 2], [xb - 2, lerp(yTop(xb), yBot(xb), j / rows) + 2], [xb - 2, lerp(yTop(xb), yBot(xb), (j + 1) / rows) - 2], [xa + 2, lerp(yTop(xa), yBot(xa), (j + 1) / rows) - 2]], c);
        joints += 'M' + n(xa + 4) + ' ' + n(t0 + 3) + 'H' + n(xb - 4);
        if (r() < 0.22) moss += blob(mid, t1 - 2, w * 0.24, 5, 7, r, 0.3, 0.3);
        x += w;
      }
    }
    return s + stroke(joints, o.lt, 2, { opacity: 0.6 }) + path(moss, C.mossG, { opacity: 0.85 });
  }

  // The little old footbridge: a low arch of stone over the channel, low stone sides (the far one a low wall
  // behind whoever crosses; the near one a low kerb at the deck's edge, below their paws), a worn flat top.
  function footbridge(S) {
    var s = '', x0 = DECK.x0, x1 = DECK.x1;
    function top(x) { return deckY(x); }
    // the far side's low wall
    var wallTop = function (x) { return top(x) - 52; }, wallBot = function (x) { return top(x) - 32; };
    var wall = [];
    for (var x = x0 + 30; x <= x1 - 30; x += 20) wall.push([x, wallTop(x)]);
    for (x = x1 - 30; x >= x0 + 30; x -= 20) wall.push([x, wallBot(x)]);
    s += poly(wall, C.stoneDk) + courses(S, x0 + 30, x1 - 30, wallTop, wallBot, { rows: 1, seed: 611, col: mix(C.stone, C.stoneDk, 0.5), lt: C.stone, dk: C.stoneDk });
    var cap = [];
    for (x = x0 + 24; x <= x1 - 24; x += 20) cap.push([x, wallTop(x) - 6]);
    s += stroke(smooth(cap), mix(C.stone, C.mossG, 0.25), 10) + stroke(smooth(cap.map(function (q) { return [q[0], q[1] - 3]; })), C.stoneLt, 3, { opacity: 0.8 });
    // the worn flat top
    var deck = [];
    for (x = x0; x <= x1; x += 20) deck.push([x, top(x) - 32]);
    for (x = x1; x >= x0; x -= 20) deck.push([x, top(x) + 6]);
    s += poly(deck, S.linU([[0, mix(C.deck, C.stoneDk, 0.25)], [1, C.deckLt]], 0, DECK.y - 52, 0, DECK.y + 6));
    var worn = '';
    for (x = x0 + 60; x < x1 - 60; x += 50) worn += 'M' + n(x) + ' ' + n(top(x) - 14) + 'h' + n(26) + 'M' + n(x + 20) + ' ' + n(top(x) - 24) + 'h' + n(18);
    s += stroke(worn, C.stoneDk, 2, { opacity: 0.35 });
    // the front face, an arch under it where the water runs through
    var yb = function (x) { return Math.max(top(x) + 6, lerp(860, 830, Math.abs(x - ARCH.cx) / 400)); };
    var face = [];
    for (x = x0; x <= x1; x += 20) face.push([x, top(x) + 6]);
    face.push([x1 + 10, 860]);
    face.push([x0 - 10, 860]);
    var ad = 'M' + n(ARCH.cx - ARCH.w / 2) + ' ' + n(ARCH.foot) + 'L' + n(ARCH.cx - ARCH.w / 2) + ' ' + n(ARCH.top + 40) + 'Q' + n(ARCH.cx - ARCH.w / 2) + ' ' + n(ARCH.top) + ' ' + n(ARCH.cx) + ' ' + n(ARCH.top) +
      'Q' + n(ARCH.cx + ARCH.w / 2) + ' ' + n(ARCH.top) + ' ' + n(ARCH.cx + ARCH.w / 2) + ' ' + n(ARCH.top + 40) + 'L' + n(ARCH.cx + ARCH.w / 2) + ' ' + n(ARCH.foot) + 'Z';
    var faceD = pts(face) + 'Z';
    var fclip = S.clip('gvface', path(faceD, '#fff'));
    var stones = courses(S, x0 - 10, x1 + 10, function (xx) { return top(xx) + 6; }, function () { return 868; }, { rows: 3, seed: 621, col: mix(C.stone, C.stoneDk, 0.2), lt: C.stoneLt, dk: C.stoneDk });
    s += g(path(faceD, mix(C.stone, C.stoneDk, 0.3)) + stones, { 'clip-path': fclip });
    // through the arch: the channel going on, bright, a soft cool shade on the water just under the stones
    s += path(ad, S.linU([[0, C.waterDeep], [0.45, C.water], [1, C.waterNear]], 0, ARCH.top, 0, ARCH.foot));
    s += stroke('M' + n(ARCH.cx - ARCH.w * 0.35) + ' ' + n(ARCH.foot - 26) + 'q30 -4 60 0t60 0M' + n(ARCH.cx + ARCH.w * 0.05) + ' ' + n(ARCH.foot - 14) + 'q24 -3 48 0t48 0', '#FFFFFF', 2.4, { opacity: 0.7 });
    s += stroke(ad.replace(/Z$/, ''), C.stoneLt, 6, { opacity: 0.8 });
    // the near kerb: a low lip of stone at the deck's edge, under their paws
    var kerb = [];
    for (x = x0; x <= x1; x += 20) kerb.push([x, top(x) + 6]);
    s += stroke(smooth(kerb), C.stoneLt, 8) + stroke(smooth(kerb.map(function (q) { return [q[0], q[1] + 5]; })), C.stoneDk, 3, { opacity: 0.5 });
    // moss on the end posts
    s += mossPatch(S, x0 + 34, top(x0 + 34) - 40, 24, 12, C.mossG, C.mossGLt, 631) + mossPatch(S, x1 - 34, top(x1 - 34) - 40, 24, 12, C.mossG, C.mossGLt, 632);
    return g(s, { 'data-art': 'footbridge', filter: S.shadow('s') });
  }

  function drawBridge(S) {
    var back = '', over = '', front = '';
    back += skyBack(S, 600);
    // far woods: pale trunks in the haze, their leaves
    back += trunk(S, { cx: 300, top: -20, base: 560, wt: 28, wb: 30, fl: 10, seed: 701, moss: 2, far: 0.55 }) + trunk(S, { cx: 1030, top: -20, base: 562, wt: 40, wb: 44, fl: 14, seed: 702, moss: 2, far: 0.5 }) +
      trunk(S, { cx: 660, top: -20, base: 556, wt: 22, wb: 24, fl: 8, seed: 703, moss: 1, far: 0.6 });
    back += farWoods(S, 580, 704);
    // the ground: the near bank (the river path's side) at the left, the far bank in the woods
    back += groundLayer(S, [[-40, 560], [400, 560], [800, 556], [1200, 560], [1640, 562]], 711, { litter: 70, tufts: 40, flowers: 12 });
    // the river path: sandy, from the bottom left up to the bridge's foot
    var pathD = smooth([[-40, 1010], [120, 930], [300, 840], [430, 780], [500, 752]]) + 'L' + n(560) + ' 760' + smooth([[560, 760], [470, 830], [330, 930], [200, 1010]]).slice(smooth([[560, 760], [470, 830], [330, 930], [200, 1010]]).indexOf('Q')) + 'Z';
    back += path(pathD, S.linU([[0, C.pathDk], [0.4, C.path], [1, C.pathLt]], 0, 740, 0, 1010), { opacity: 0.95 });
    back += dapples(S, [[260, 900, 90, 18], [420, 800, 60, 12], [1300, 760, 80, 15], [1460, 900, 110, 20], [900, 600, 50, 8], [140, 980, 80, 14]]);
    // the channel, then the bridge over it
    back += water(S, 721);
    // the far bank: old trees with roots like arms, ferns
    back += rootArm(S, 1290, 740, 1120, 790, 46, 10, 731) + rootArm(S, 1360, 742, 1560, 800, 54, 14, 732);
    back += trunk(S, { cx: 1330, top: -20, base: 742, wt: 100, wb: 110, fl: 46, seed: 733, moss: 7 });
    back += fern(S, 1180, 800, 110, 741, { lean: -0.3 }) + fern(S, 1560, 860, 150, 742, { lean: 0.2 });
    back += footbridge(S);
    back += canopy(S, -40, 1640, 210, 751, { clusters: 16, leaves: 70 });
    back += shafts(S, [[1180, 120, 900, 260, 1000, 0.22], [1420, 80, 1200, 200, 1000, 0.18], [700, 70, 470, 180, 1000, 0.14]]);
    // ferns and grass in the near corners, framing it
    front += fern(S, 40, 1010, 230, 761, { lean: 0.25, count: 8 }) + fern(S, 1600, 1010, 210, 762, { lean: -0.35, count: 7 });
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ WIDE: over the bridge, the woods rising

  // the fern a peeking apprentice is half hidden by (wide, meet): drawn over her up to her chin, every frond kept
  // off her face, so her face and ears show over it
  function fernCover(S, est, a, seed) {
    var b = est.body, hb = est.head, chin = hb[3] - (hb[3] - hb[1]) * 0.08, w = (b[2] - b[0]), base = Math.max(b[3], a.y) + 8, size = (base - chin) * 1.04;
    var face = [hb[0] - 4, hb[1] - 30, hb[2] + 4, chin], s = '';
    s += K.fernClump(S, (b[0] + b[2]) / 2 - w * 0.18, base, size, { seed: seed, count: 8, spread: 1.9, lean: 0.12, color: C.fern, rim: C.leafSun, rimOp: 0.7, avoid: [face] });
    s += K.fernClump(S, (b[0] + b[2]) / 2 + w * 0.22, base, size * 0.96, { seed: seed + 1, count: 7, spread: 1.8, lean: -0.15, color: C.fernLt, rim: C.leafSun, rimOp: 0.6, avoid: [face] });
    return g(s, { 'data-part': 'cover-fern', 'data-box': boxAttr([b[0] - w * 0.3, chin, b[2] + w * 0.3, base]), 'data-face': boxAttr(face) });
  }

  // the channel at the bridge's end (wide), bright, at the bottom left
  var WIDE_WATER = [[-40, 800], [120, 792], [250, 806], [300, 880], [290, 1010], [-40, 1010]];
  function drawWide(S) {
    var back = '', over = '', front = '', c;
    back += skyBack(S, 760);
    // far trunks in the haze, deep in the woods
    [[120, 690, 26, 0.5], [420, 700, 22, 0.55], [930, 700, 30, 0.5], [1250, 706, 24, 0.55]].forEach(function (q, i) {
      back += trunk(S, { cx: q[0], top: -20, base: q[1], wt: q[2], wb: q[2] * 1.08, fl: q[2] * 0.4, seed: 800 + i, moss: 1, far: q[3] });
    });
    back += farWoods(S, 730, 811);
    back += groundLayer(S, [[-40, 720], [400, 716], [800, 712], [1200, 716], [1640, 722]], 812, { litter: 90, tufts: 50, flowers: 16 });
    // the bridge's far end, small at the left, the channel's bright edge beside it
    // (the channel beside it, bright, running off under it at the bottom left)
    var be = '';
    be += path(smooth(WIDE_WATER, true), S.linU([[0, C.waterFar], [1, C.waterNear]], 0, 800, 0, 1010));
    be += stroke('M-20 880q30 -3 60 0t60 0M60 940q24 -3 48 0t48 0M10 990q30 -3 60 0t60 0', '#FFFFFF', 2.4, { opacity: 0.75 });
    be += path(K.sparkleD(150, 900, 9), '#FFFFFF', { 'class': 'pcs-glint' });
    // its far wall, worn top and kerb, ending at a mossy post on the woods' side
    be += poly([[-40, 760], [236, 768], [236, 800], [-40, 794]], C.stoneDk) + courses(S, -40, 236, function (x) { return 760 + x * 0.03; }, function (x) { return 794 + x * 0.025; }, { rows: 1, seed: 822, col: mix(C.stone, C.stoneDk, 0.5), lt: C.stone, dk: C.stoneDk });
    be += poly([[-40, 794], [250, 800], [262, 826], [-40, 830]], S.linU([[0, mix(C.deck, C.stoneDk, 0.25)], [1, C.deckLt]], 0, 794, 0, 830));
    be += poly([[-40, 830], [262, 826], [262, 880], [-40, 900]], mix(C.stone, C.stoneDk, 0.3)) + courses(S, -40, 262, function () { return 832; }, function () { return 892; }, { rows: 2, seed: 821, col: mix(C.stone, C.stoneDk, 0.2), lt: C.stoneLt, dk: C.stoneDk });
    be += stroke('M-40 830L262 826', C.stoneLt, 7);
    be += rect(222, 734, 44, 70, C.stone, { rx: 6 }) + rect(218, 728, 52, 12, C.stoneLt, { rx: 4 }) + mossPatch(S, 244, 744, 22, 9, C.mossG, C.mossGLt, 823);
    back += g(be, { 'data-art': 'bridge-end', filter: S.shadow('s') });
    // huge trunks, roots like arms
    back += rootArm(S, 770, 868, 640, 930, 62, 14, 831) + rootArm(S, 900, 870, 1010, 936, 56, 10, 832);
    back += trunk(S, { cx: 836, top: -20, base: 872, wt: 108, wb: 116, fl: 50, seed: 833, moss: 8 });
    back += rootArm(S, 1070, 846, 960, 880, 30, 8, 834);
    back += trunk(S, { cx: 1080, top: -20, base: 848, wt: 64, wb: 70, fl: 28, seed: 835, moss: 5 });
    back += rootArm(S, 1500, 900, 1380, 960, 52, 12, 836);
    back += trunk(S, { cx: 1540, top: -20, base: 900, wt: 120, wb: 130, fl: 50, seed: 837, moss: 7 });
    back += fern(S, 950, 900, 120, 841, { lean: -0.2 }) + fern(S, 640, 930, 110, 842, { lean: 0.3 });
    back += dapples(S, [[400, 900, 110, 18], [600, 960, 80, 14], [1180, 940, 120, 20], [300, 780, 70, 10], [1000, 760, 60, 9]]);
    back += canopy(S, -40, 1640, 200, 851, { clusters: 18, leaves: 80 });
    back += shafts(S, [[1250, 140, 950, 300, 1000, 0.24], [600, 90, 380, 220, 1000, 0.16], [1500, 70, 1350, 160, 1000, 0.16]]);
    // the apprentice's fern (a cover, when she is there) and ferns along the floor in front
    if ((c = who(S, 'fern'))) S.covers.fern = fernCover(S, castEst(S, c.m, c.a), c.a, 861);
    front += fern(S, 1280, 1010, 170, 871, { lean: -0.1, count: 6 }) + fern(S, 70, 1010, 190, 872, { lean: 0.3, count: 7 });
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ MEET: at cat height under the trees

  function drawMeet(S) {
    var back = '', over = '', front = '', c;
    back += skyBack(S, 660);
    [[340, 610, 30, 0.5], [760, 616, 40, 0.45], [1020, 612, 26, 0.55]].forEach(function (q, i) {
      back += trunk(S, { cx: q[0], top: -20, base: q[1], wt: q[2], wb: q[2] * 1.08, fl: q[2] * 0.4, seed: 900 + i, moss: 2, far: q[3] });
    });
    back += farWoods(S, 650, 911);
    back += groundLayer(S, [[-40, 640], [400, 636], [800, 632], [1200, 636], [1640, 640]], 912, { litter: 120, tufts: 60, flowers: 18, tuftSize: 2.2 });
    // a huge old trunk behind the elder, its roots reaching out; another at the left edge
    back += rootArm(S, 1180, 840, 980, 900, 70, 14, 931) + rootArm(S, 1420, 850, 1640, 930, 80, 18, 932);
    back += trunk(S, { cx: 1300, top: -20, base: 846, wt: 170, wb: 180, fl: 70, seed: 933, moss: 10 });
    back += trunk(S, { cx: 40, top: -20, base: 780, wt: 110, wb: 116, fl: 40, seed: 934, moss: 6 });
    back += fern(S, 900, 820, 160, 941, { lean: -0.25 }) + fern(S, 120, 860, 150, 942, { lean: 0.3 });
    back += dapples(S, [[500, 980, 160, 26], [880, 900, 120, 20], [300, 760, 90, 14], [1100, 960, 140, 22], [700, 700, 70, 10]]);
    back += canopy(S, -40, 1640, 190, 951, { clusters: 14, leaves: 60 });
    back += shafts(S, [[1100, 160, 760, 360, 1000, 0.22], [1450, 90, 1260, 220, 1000, 0.16]]);
    if ((c = who(S, 'fern'))) S.covers.fern = fernCover(S, castEst(S, c.m, c.a), c.a, 961);
    front += fern(S, 1600, 1010, 220, 971, { lean: -0.35, count: 6 });
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ OAK: the old oak

  var OAK = { cx: 840, top: -20, base: 872, wt: 230, wb: 262, fl: 90, seed: 1001 };
  var HOLLOW = { cx: 904, cy: 352, rx: 74, ry: 86 };
  // the silver moss: on the shaded north side (the left), low, hugging the bark
  var SILVER = { cx: 640, cy: 760, rx: 66, ry: 80 };

  function oakHollow(S) {
    var H = HOLLOW, s = '';
    // the bark lips round it, swollen and mossy
    s += ell(H.cx + 4, H.cy + 6, H.rx * 1.32, H.ry * 1.26, C.barkLt) + ell(H.cx + 10, H.cy + 4, H.rx * 1.2, H.ry * 1.16, C.barkSun, { opacity: 0.5 });
    // inside: a soft dusk-green, lighter at the bottom where a little moss shows
    s += ell(H.cx, H.cy, H.rx, H.ry, S.radU([[0, C.inGlow], [0.55, C.inDusk], [1, C.inDeep]], H.cx + H.rx * 0.2, H.cy + H.ry * 0.35, H.ry * 1.2));
    s += path(mound(H.cx - H.rx * 0.82, H.cx + H.rx * 0.82, H.cy + H.ry * 0.86, H.cy + H.ry * 0.5, 6, rng(1011), 0.35, 0.2, 0.2), C.nookMoss);
    s += mossPatch(S, H.cx - H.rx * 0.9, H.cy + H.ry * 0.95, 34, 14, C.mossG, C.mossGLt, 1012) + mossPatch(S, H.cx + H.rx * 0.8, H.cy - H.ry * 0.9, 26, 11, C.mossGold, C.mossGoldLt, 1013);
    return g(s, { 'data-art': 'hollow', 'data-box': boxAttr([H.cx - H.rx, H.cy - H.ry, H.cx + H.rx, H.cy + H.ry]) });
  }
  // the oak's left edge at height y (its shaded side), from its outline
  function trunkEdgeAt(y) {
    var L = trunkShape(OAK).L;
    for (var i = 1; i < L.length; i++) if (y <= L[i][1]) return lerp(L[i - 1][0], L[i][0], (y - L[i - 1][1]) / ((L[i][1] - L[i - 1][1]) || 1));
    return L[L.length - 1][0];
  }
  function silverMoss(S) {
    var M = SILVER, r = rng(1021), s = '', curls = '', sheen = '', fur = '';
    // a soft cushion of it in lobes, silvery sage, a sheen of light on it, fine curly strands all over (the soft
    // silver kind: plainly not the grey moss higher up)
    var lobes = [[M.cx, M.cy, M.rx, M.ry * 0.62], [M.cx - M.rx * 0.18, M.cy + M.ry * 0.5, M.rx * 0.85, M.ry * 0.45], [M.cx + M.rx * 0.15, M.cy - M.ry * 0.55, M.rx * 0.7, M.ry * 0.4]];
    lobes.forEach(function (L, i) {
      s += path(blob(L[0], L[1], L[2], L[3], 11, rng(1022 + i), 0.25, 0.35), S.linU([[0, C.silverDk], [0.5, C.silver], [1, C.silverLt]], L[0] - L[2], 0, L[0] + L[2], 0));
      for (var j = 0; j < 26; j++) {
        var a = r() * Math.PI * 2, ex = L[0] + Math.cos(a) * L[2] * 0.96, ey = L[1] + Math.sin(a) * L[3] * 0.96, l = 4 + r() * 6;
        fur += 'M' + n(ex) + ' ' + n(ey) + 'q' + n(Math.cos(a) * l * 0.6 - 2) + ' ' + n(Math.sin(a) * l * 0.6) + ' ' + n(Math.cos(a) * l) + ' ' + n(Math.sin(a) * l + 2);
      }
    });
    for (var i = 0; i < 60; i++) {
      var hx = M.cx + (r() - 0.5) * M.rx * 1.6, hy = M.cy + (r() - 0.5) * M.ry * 1.7;
      curls += 'M' + n(hx) + ' ' + n(hy) + 'q3 -4 0 -7q-3 -3 1 -6';
    }
    sheen += ell(M.cx + M.rx * 0.2, M.cy - M.ry * 0.12, M.rx * 0.42, M.ry * 0.22, '#FFFFFF', { opacity: 0.45 }) + ell(M.cx - M.rx * 0.1, M.cy + M.ry * 0.52, M.rx * 0.3, M.ry * 0.12, '#FFFFFF', { opacity: 0.35 });
    s += stroke(fur, C.silver, 2.2) + stroke(curls, C.silverLt, 1.5, { opacity: 0.85 }) + sheen;
    // it grows on the bark: the trunk's edge cuts it
    var clip = S.clip('gvsilver', path(trunkShape(OAK).d, '#fff'));
    var box = [Math.max(M.cx - M.rx * 1.1, trunkEdgeAt(M.cy)), M.cy - M.ry * 1.1, M.cx + M.rx * 1.05, M.cy + M.ry * 1.1];
    return g(g(s, { 'clip-path': clip }), { 'data-art': 'silver-moss', 'data-box': boxAttr(box) });
  }

  function drawOak(S) {
    var back = '', over = '', front = '';
    back += skyBack(S, 720);
    [[160, 690, 30, 0.5], [1380, 696, 34, 0.5], [1560, 700, 24, 0.55]].forEach(function (q, i) {
      back += trunk(S, { cx: q[0], top: -20, base: q[1], wt: q[2], wb: q[2] * 1.08, fl: q[2] * 0.4, seed: 1030 + i, moss: 2, far: q[3] });
    });
    back += farWoods(S, 720, 1040);
    back += groundLayer(S, [[-40, 700], [400, 700], [800, 700], [1200, 700], [1640, 704]], 1042, { litter: 110, tufts: 50, flowers: 14 });
    back += dapples(S, [[320, 960, 130, 22], [1160, 970, 140, 22], [1400, 860, 90, 14], [200, 800, 80, 12]]);
    // roots like arms, spreading over the ground (behind the trunk first, then in front)
    back += rootArm(S, 620, 846, 300, 902, 96, 30, 1051) + rootArm(S, 1060, 846, 1420, 906, 100, 28, 1052);
    // the oak: furry with moss, green, gold and grey
    var T = OAK;
    back += trunk(S, { cx: T.cx, top: T.top, base: T.base, wt: T.wt, wb: T.wb, fl: T.fl, seed: T.seed, moss: 0 });
    var sh = trunkShape(T), clip = S.clip('gvoak', path(sh.d, '#fff')), r = rng(1061), fur = '';
    for (var i = 0; i < 40; i++) {
      var u = r(), mx = lerp(T.cx - T.wb * 0.95, T.cx + T.wb * 0.8, u), my = 120 + r() * 700, kind = r();
      // more grey and green on the shaded left, more gold where the sun reaches on the right
      var mc = u < 0.4 ? (kind < 0.5 ? [C.mossG, C.mossGLt] : [C.mossGrey, C.mossGreyLt]) : kind < 0.45 ? [C.mossGold, C.mossGoldLt] : kind < 0.8 ? [C.mossG, C.mossGLt] : [C.mossGrey, C.mossGreyLt];
      if (Math.hypot((mx - HOLLOW.cx) / (HOLLOW.rx * 1.6), (my - HOLLOW.cy) / (HOLLOW.ry * 1.5)) < 1) continue;
      if (Math.hypot((mx - SILVER.cx) / (SILVER.rx * 1.5), (my - SILVER.cy) / (SILVER.ry * 1.3)) < 1) continue;
      fur += mossStreak(S, mx, my, 34 + r() * 40, 70 + r() * 110, mc[0], mc[1], 1100 + i);
    }
    back += g(fur, { 'clip-path': clip, 'data-art': 'oak-moss' });
    back += oakHollow(S) + silverMoss(S);
    // roots in front of the trunk's foot
    back += rootArm(S, 730, 862, 590, 956, 104, 22, 1071) + rootArm(S, 960, 864, 1120, 958, 98, 20, 1072);
    back += fern(S, 1500, 980, 150, 1081, { lean: -0.2 }) + fern(S, 90, 960, 140, 1082, { lean: 0.3 });
    back += canopy(S, -40, 1640, 170, 1091, { clusters: 12, leaves: 50, clear: [HOLLOW.cx - HOLLOW.rx * 1.4, HOLLOW.cx + HOLLOW.rx * 1.4, HOLLOW.cy - HOLLOW.ry * 1.5] });
    back += shafts(S, [[1300, 140, 1150, 280, 1000, 0.22], [500, 80, 330, 200, 1000, 0.14]]);
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ HOLLOW: inside the nook

  // the opening at the left (the outside bright through it), the rim's wood round it, and the sill under it
  // (the rim is thick: the old oak's wall, seen from inside, between the bright opening and the nook)
  var NOOK = {
    open: [[-40, 150], [40, 118], [108, 150], [142, 300], [150, 480], [142, 640], [128, 786], [-40, 792]],
    jamb: 338,          // the rim's inner edge (where the wood of the opening meets the nook), behind her shoulders
    sill: 790           // the sill's top: her forepaws rest on it
  };
  // the wood round the opening, its outline (the hole is NOOK.open)
  var RIM_OUT = [[-40, 40], [110, 20], [262, 90], [334, 270], [348, 520], [338, 760], [362, 870], [-40, 880]];
  function rimFill(S) { return S.linU([[0, C.woodLt], [0.55, C.wood], [1, C.woodDk]], 0, 0, NOOK.jamb + 20, 0); }
  function nookOutside(S) {
    var r = rng(1201), s = '', d = smooth(NOOK.open, true);
    s += path(d, S.linU([[0, '#DDF0F4'], [0.5, C.out], [1, C.leafSun]], 0, 120, 0, 790));
    var lv = '', lv2 = '';
    for (var i = 0; i < 40; i++) { var x = -40 + r() * 290, y = 130 + r() * 660; if (i % 2) lv += leafD(x, y, 22 + r() * 22, r() * 6.28, 8 + r() * 5); else lv2 += leafD(x, y, 18 + r() * 18, r() * 6.28, 7 + r() * 4); }
    s += path(blob(60, 300, 120, 90, 9, rng(1202), 0.3, 0.3) + blob(-10, 600, 110, 130, 9, rng(1203), 0.3, 0.3), C.outLeaf, { opacity: 0.85 }) + path(lv, C.outLeafLt, { opacity: 0.9 }) + path(lv2, C.leafLt, { opacity: 0.8 });
    s += ell(140, 300, 140, 150, S.radU([[0, C.sun, 0.9], [1, C.sun, 0]], 140, 300, 150));
    return g(g(s, { 'clip-path': S.clip('gvopen', path(d, '#fff')) }), { 'data-art': 'opening' });
  }
  function nookRim(S) {
    // the wood round the opening: its thickness seen from inside, rounded, its edge lit by the outside, moss on it
    var s = '', O = NOOK.open;
    var d = smooth(RIM_OUT, true) + smooth(O, true);
    s += path(d, rimFill(S), { 'fill-rule': 'evenodd' });
    // the light from outside on the hole's edge, the grain running round the hole, the rounded inner edge lit
    s += stroke(smooth(O, true), C.sun, 8, { opacity: 0.85 }) + stroke(smooth(O, true), C.barkSun, 3, { opacity: 0.9 });
    var grain = '';
    for (var i = 0; i < 7; i++) grain += smooth([[150 + i * 26, 120 + i * 14], [196 + i * 24, 400], [176 + i * 26, 740]]);
    s += stroke(grain, C.woodLine, 2.2, { opacity: 0.28 });
    s += stroke(smooth(RIM_OUT.slice(1, 7)), C.woodLt, 6, { opacity: 0.7 });
    s += mossPatch(S, 60, 812, 130, 24, C.nookMoss, C.nookMossLt, 1212) + mossPatch(S, 240, 120, 46, 16, C.mossG, C.mossGLt, 1213);
    return g(s, { 'data-art': 'rim' });
  }
  // The rim over her (`lip`): the opening's bark over all of her but her head, shoulders and forepaws. It cuts
  // behind her shoulders (as the tracks' stash-in, never across her head) and stops at the sill: nothing below her
  // forepaws, and nothing in front of them, is drawn over her, so a leaf she holds at her paws stays in view.
  function lipCover(S, est, a, seed) {
    var bb = est.body, hb = est.head, w = bb[2] - bb[0], hgt = bb[3] - bb[1], dir = est.face === 'left' ? -1 : 1, m = Math.max(10, w * 0.05), r = rng(seed);
    var back = dir > 0 ? bb[0] : bb[2], cut = back + dir * w * 0.4;
    // never across her head
    cut = dir > 0 ? Math.min(cut, hb[0] - w * 0.03) : Math.max(cut, hb[2] + w * 0.03);
    var xb = back - dir * m * 2, yt = Math.min(bb[1], hb[1]) - m * 3, yb = NOOK.sill + 2;
    var P = [[xb, yb], [xb, yt]], k = 4;
    for (var i = 1; i <= k; i++) P.push([lerp(xb, cut - dir * m, i / k), yt - r() * m]);
    P.push([cut + dir * hgt * 0.05, lerp(yt, yb, 0.35)], [cut + dir * hgt * 0.02, lerp(yt, yb, 0.75)], [cut, yb]);
    var d = smooth(P, true);
    // the rim's own wood (the same light across it as the rim behind), its rounded edge lit beside her
    var s = path(d, rimFill(S));
    var y0 = Math.min(bb[1], hb[1]);
    s += stroke(smooth([[cut + dir * hgt * 0.04, y0], [cut + dir * hgt * 0.05, lerp(y0, yb, 0.35)], [cut + dir * hgt * 0.02, lerp(y0, yb, 0.75)], [cut, yb]]), C.woodLt, Math.max(4, hgt * 0.035), { opacity: 0.85 });
    s += mossPatch(S, lerp(xb, cut, 0.62), yb - m * 0.5, Math.abs(cut - xb) * 0.32, m * 1.2, C.nookMoss, C.nookMossLt, seed + 1);
    return g(s, { 'data-part': 'cover-rim', 'data-box': boxAttr([Math.min(xb, cut), yt, Math.max(xb, cut), yb]), 'data-cut': n(cut) });
  }

  function drawHollow(S) {
    var back = '', over = '', front = '', c, r = rng(1301);
    // the nook's round walls of old wood, warm, the grain curving round; never dark
    back += rect(-10, -10, 1620, 1020, C.wood);
    // the grain curving round the nook, as the wood grew round the hollow
    var rings = '';
    for (var i = 0; i < 11; i++) {
      var R = 360 + i * 46;
      rings += 'M' + n(900 - R * 1.25) + ' ' + n(1010) + 'Q' + n(900 - R * 1.35) + ' ' + n(560 - R * 0.95) + ' ' + n(900) + ' ' + n(560 - R * 0.9) + 'Q' + n(900 + R * 1.35) + ' ' + n(560 - R * 0.95) + ' ' + n(900 + R * 1.25) + ' ' + n(1010);
    }
    back += stroke(rings, C.woodLine, 3, { opacity: 0.26 }) + stroke(rings, C.woodLt, 2, { opacity: 0.3, transform: 'translate(0 6)' });
    // round: the walls curving away into a soft warm shade at the edges (never dark)
    back += rect(-10, -10, 1620, 1020, S.radU([[0, C.woodLt, 0.35], [0.55, C.wood, 0], [0.85, C.woodDk, 0.55], [1, C.woodDk, 0.9]], 880, 560, 900));
    // the light from the opening: warm green-gold, spreading in over everything
    back += ell(300, 520, 1300, 760, S.radU([[0, C.sun, 0.7], [0.35, C.leafSun, 0.35], [1, C.leafSun, 0]], 300, 520, 1300));
    back += nookOutside(S) + nookRim(S);
    // the moss lining: a soft bowl of it on the floor and up the walls
    var bowl = mound(220, 1700, 1010, 690, 12, rng(1311), 0.3, 0.2, 0.3);
    back += path(bowl, S.linU([[0, C.nookMossLt], [0.5, C.nookMoss], [1, C.nookMossDk]], 0, 700, 0, 1010));
    var tuft = '', hi = '';
    for (i = 0; i < 70; i++) {
      var x = 300 + r() * 1300, y = 760 + r() * 240, l = 6 + r() * 8;
      tuft += 'M' + n(x) + ' ' + n(y) + 'l' + n((r() - 0.5) * 6) + ' ' + n(-l);
      if (i % 3 === 0) hi += blob(x, y, 20 + r() * 26, 6 + r() * 6, 7, r, 0.3, 0.3);
    }
    back += path(hi, C.nookMossLt, { opacity: 0.6 }) + stroke(tuft, C.nookMossDk, 2.2, { opacity: 0.6 });
    // moss up the walls round the bowl, thick at the right where the nook curves in
    var wall = smooth([[1700, 120], [1560, 200], [1500, 380], [1440, 560], [1380, 720], [1300, 820], [1700, 900]], true);
    back += path(wall, S.linU([[0, C.nookMossDk], [1, C.nookMoss]], 1300, 0, 1700, 0));
    var wf = '';
    for (i = 0; i < 40; i++) { var t = r(), wy = lerp(220, 820, t), wx = lerp(1540, 1320, t) + (r() - 0.5) * 30; wf += 'M' + n(wx) + ' ' + n(wy) + 'l' + n(-4 - r() * 6) + ' ' + n(2 + r() * 4); }
    back += stroke(wf, C.nookMossLt, 2.2, { opacity: 0.8 }) + mossStreak(S, 1470, 300, 80, 120, C.nookMoss, C.nookMossLt, 1321);
    // the light from the opening across the nook: a warm green-gold beam
    back += poly([[150, 160], [150, 760], [1300, 1010], [1500, 600]], S.linU([[0, C.sun, 0.45], [0.6, C.leafSun, 0.15], [1, C.leafSun, 0]], 150, 0, 1500, 0), { filter: S.blur('gvbeam', 26) });
    // a few motes of light floating in the beam (the shared pcs-float)
    var motes = '';
    for (i = 0; i < 8; i++) motes += g(circ(380 + r() * 700, 260 + r() * 400, 3 + r() * 3, '#FFF6CF', { opacity: 0.9 }), { 'class': 'pcs-float', style: 'animation-delay:-' + (r() * 6).toFixed(1) + 's' });
    back += motes;
    if ((c = who(S, 'lip'))) S.covers.lip = lipCover(S, castEst(S, c.m, c.a), c.a, 1331);
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ the set

  function draw(S) {
    if (S.comp === 'bridge') return drawBridge(S);
    if (S.comp === 'meet') return drawMeet(S);
    if (S.comp === 'oak') return drawOak(S);
    if (S.comp === 'hollow') return drawHollow(S);
    return drawWide(S);
  }

  art.defineSet('grove', {
    label: 'GroveClan’s woods: the little bridge, the old trees and the old oak', tod: 'day', todFixed: 'day', draw: draw,
    cams: {
      bridge: { box: [0, 0, 1600], comp: 'bridge' },
      wide: { box: [0, 0, 1600] },
      meet: { box: [0, 0, 1600], comp: 'meet' },
      oak: { box: [0, 0, 1600], comp: 'oak' },
      hollow: { box: [0, 0, 1600], comp: 'hollow' }
    },
    anchors: {
      // the near bank at the bridge's foot (the river path's side), facing the bridge; the two on the span stand
      // on its deck (her first steps on it at its near end; Riffle in its middle); `far` at its far end
      bridge: {
        'near-1': A(250, 920, 270), 'near-2': A(430, 846, 236),
        'span-1': A(600, Math.round(deckY(600) - 12), 196), 'span-2': A(856, Math.round(deckY(856) - 12), 190), far: A(1116, Math.round(deckY(1116) - 12), 194, 'left')
      },
      // at the bridge's end, small under the trees, waiting to be asked in; the elder stepping out between the
      // trunks at the right; the apprentice behind her, peeking over a fern (drawn behind everyone)
      main: {
        'edge-1': A(340, 884, 176), 'edge-2': A(466, 894, 182), 'edge-3': A(592, 888, 180),
        elder: A(1236, 892, 190, 'left'), fern: A(1388, 868, 172, 'left', { z: 'behind' })
      },
      meet: {
        'meet-1': A(250, 958, 340), 'meet-2': A(520, 972, 360), 'meet-3': A(770, 962, 330),
        elder: A(1220, 968, 350, 'left'), fern: A(1440, 896, 296, 'left', { z: 'behind' })
      },
      // the oak's foot among its roots; the elder beside it at the right; a climber partway up the trunk (on the
      // bark: `elev`, `air`); a cat crouched at the silver moss, low on the shaded side, facing it
      oak: {
        'root-1': A(230, 936, 226), 'root-2': A(700, 952, 232), 'root-3': A(1010, 946, 230),
        elder: A(1340, 922, 224, 'left'), trunk: A(800, 660, 210, 'right', { elev: true, air: true }), moss: A(498, 884, 214, 'right')
      },
      // Mizzle on the moss; our cat at the opening, her forepaws on the sill (above the nook's floor)
      hollow: { nook: A(1090, 936, 420, 'left'), lip: A(368, NOOK.sill, 520, 'right', { elev: true }) }
    },
    opts: {}, defaults: {}
  });

  // For the tests: the channel and the bridge's deck (bridge), the oak, its hollow and its silver moss, the nook's
  // opening and its rim.
  art.groveInfo = function () {
    return {
      channel: CHANNEL.map(function (q) { return q.slice(); }), deck: { x0: DECK.x0, x1: DECK.x1, y: DECK.y, hump: DECK.hump, at: deckY },
      oak: { cx: OAK.cx, base: OAK.base, wb: OAK.wb, fl: OAK.fl }, hollow: { cx: HOLLOW.cx, cy: HOLLOW.cy, rx: HOLLOW.rx, ry: HOLLOW.ry },
      silver: { cx: SILVER.cx, cy: SILVER.cy, rx: SILVER.rx, ry: SILVER.ry }, nook: { open: NOOK.open.map(function (q) { return q.slice(); }), jamb: NOOK.jamb, sill: NOOK.sill },
      inChannel: function (x, y) { return inPoly(CHANNEL, x, y); }, wideWater: WIDE_WATER.map(function (q) { return q.slice(); }),
      inWideWater: function (x, y) { return inPoly(WIDE_WATER, x, y); }
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
