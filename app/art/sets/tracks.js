/* Potomac Crossing · app/art/sets/tracks.js
 *
 * The set: the railway bank by the tracks, its weasel holes, and the weasels' tunnel (chapter 8, "The
 * Night Trail"; docs/chapters/08-the-night-trail.spec.md, section 4, "The new set, tracks"). Nobody's
 * land: the trains own it. Always at night (it is never drawn by day: `todFixed`), moonlit and silver,
 * never black; the tunnel and the stash dim blue-grey and readable. Nothing in it is frightening, and
 * no art key draws shining eyes. Nothing of the Clan's is here: no anchor but `rails` is on the rails
 * or the sleepers, and `rails` is the fox's.
 *
 * Three pictures, eight cameras (each camera its own composition, so each has its own anchors; the
 * cameras of one picture are drawn by one painter, so they show the same place):
 *   the bank      wide   the high grassy bank from its foot (about y 760) to its flat top (about y 380),
 *                        the ballast, the sleepers and two long rails on top, bright in the moonlight,
 *                        the sky with stars and the moon above; six holes in its face (the tunnel's end
 *                        at the very foot at the left; the little hole, the weasels' bed; a second small
 *                        hole above it; the biggest, low on the right, the stash; two higher up); faint
 *                        tiny prints round every hole, always; tall weeds along the foot; the near ground
 *                        dark earth and short grass
 *                 hide   at cat height in the tall weeds at the bank's foot, looking up the bank: the
 *                        weeds across the bottom fifth, the bank beyond with its holes, the rails at the
 *                        top against the moonlit sky
 *                 holes  close on the bank's face at weasel height: the little hole (left), the second
 *                        small hole just beside it (higher up, between it and the biggest), the biggest
 *                        (right, a small cat's shoulders wide: about her head's width and a little more,
 *                        lower than she is crouched, a tight squeeze); prints round every hole; tall weeds at
 *                        the left edge
 *                 brag   low, up the bank from beside the holes: the rails along the crest against the
 *                        moon and stars, the slope falling to the bottom corners. No cat of the Clan
 *   the stash     stash  inside the biggest hole: a low earthen chamber, roots in its roof, a shaft of
 *                        moonlight from the mouth at the left; mice and voles in tidy rows along the back
 *                        (PC.art.prey, sets/pile.js: eyes shut, no blood; about a third with darker,
 *                        muddy bellies and feet: ReedClan's); beside them on the right a heap of tower
 *                        glass, flat, clear and angular, glittering (the "scale"'s look)
 *                 stash-close  the heap close: the moonlight through the pieces, one big piece in front
 *   the tunnel    crawl  inside the tunnel at cat height: earth walls close round a crawling cat, the
 *                        roof just clearing a sitting cat's ears at `crawl-1`, lower behind her; roots
 *                        hanging from it; a soft floor with tiny prints going both ways (always). Over the
 *                        roof (here and in `fork`) solid dark earth up to the top of the panel, a lip along the
 *                        roof line, short roots in it, so the tunnel reads as just taller than she is
 *                 fork   where it splits in two: the roof low over her ears, two small ways on, flat on the
 *                        floor, unequal and offset, each in its own rim of dug earth, a root hanging between them
 *
 * Anchors: tunnel-end, foot-1, foot-2, hole-1, hole-2, rails (wide); weeds-1, weeds-2, hole-1, hole-2,
 * rails (hide); hole-1, hole-2, stash-mouth, watch (holes); rails, slope-1, slope-2 (brag); stash-in
 * (stash); near (stash-close); crawl-1, crawl-2 (crawl); fork-1, fork-2 (fork).
 * `near` is drawn bigger than the panel (the field's border-fox `left`), the corner of her face at the
 * left edge: the set moves the spot for her pose (S.spots, as the hollow's heap moves the rim's), so
 * crouched, sitting up or lying, her head point lands at the same place, inside the panel and clear of
 * the heap; crouched, a forepaw shows at the bottom-left.
 *
 * Covers, each drawn just after whoever is at the spot (scenes.js S.covers), with `data-part` and a
 * `data-box` (the world box it covers: x0 y0 x1 y1) for the tests:
 *   tunnel-end    the tunnel end's lip of earth over her back half, in any pose: head and shoulders out
 *   hole-1/-2     for a cast member in pose `peek`: the hole's lip over its back half (head and
 *                 shoulders out); in any other pose nothing: it stands on the slope in front of its hole
 *   weeds-1/-2    tall weeds over her up to the eyes (ears, eyes and the top of the head above; a
 *                 `tailUp` tail's tip stands above them, and where a raised tail's tip is lower than
 *                 the eyes, an otter standing up, the weeds part round it), as the field's `grass`
 *                 covers Sleet
 *   watch         weeds over her legs
 *   stash-in      the mouth's rim over all of her but her head, shoulders and forepaws
 *   crawl-2       with `tight: true`, an earth lip and roots over her back half (the tunnel narrows)
 *
 * Options (every one off by default, and off draws exactly as left out):
 *   moon: n       the moon n evenings old (kit.waxingMoon, as the pile's), in the sky of wide, hide and
 *                 brag; 8 is the eighth evening's half moon, high in the sky. In `keep`
 *   tap           an unpainted <rect class="pc-tap" data-tap="…"> (the marsh's, the pile's): 'weeds' on
 *                 wide (the tall weeds' box), 'stash' on holes (the biggest hole's mouth), 'glass' on
 *                 stash (one small piece at the heap's near edge, painted with or without it). Nothing is
 *                 painted, so a scene with it draws as it does without; the box goes first in `keep`
 *   tight: true   (crawl) the cover at crawl-2, above
 *   worm: true    (fork) one pink worm poking out of the left way's wall
 *
 * `keep`: the rails (wide, hide, brag), the moon, the prey rows and the glass heap (stash), the heap
 * (stash-close: the whisper's lettering stays off it).
 *
 * PC.art.tracksInfo() -> the geometry the tests read: each bank composition's rails band, holes,
 * weeds and tap boxes; the stash's rows, heap and glass piece; the tunnel's roof and floor.
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

  var n = K.n, rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke, poly = K.poly, g = K.g, pts = K.pts,
    dot = K.dot, mix = K.mix, lerp = K.lerp, clamp = K.clamp, rng = K.rng, blob = K.blob, mound = K.mound, A = K.anchor;

  // ------------------------------------------------------------------ colours: a silver night

  // The set's own night: the palette's night is for a camp under trees; this is open ground under a
  // half moon, so everything is a step lighter and cooler (silver, never black). Inside the earth the
  // light is a dim blue-grey that still reads.
  var COL = {
    sky: ['#121E46', '#1A2A5E', '#243A72', '#334C86', '#4A6198'], haze: '#6A80B0',
    bankTop: '#7E98A8', bank: '#5C7A89', bankLow: '#46636F', bankDark: '#344E5C', rim: '#BFD2E2',
    tuftA: '#7894A0', tuftB: '#3F5B68',
    earth: '#7A6C70', earthLight: '#A8999C', earthDark: '#54484F', holeIn: '#2A2C44', holeDeep: '#191B30',
    print: '#2A2A40',
    ballast: '#747A8C', ballastLight: '#A9B0C2', ballastDark: '#4E5367',
    sleeper: '#3E3846', sleeperTop: '#5E5668',
    rail: '#F0F5FF', railGlow: '#D2E2FF',
    weedDark: '#253F3F', weed: '#3C5C5A', weedLight: '#82A3A0', seed: '#BCCDCA',
    ground: '#323A4E', groundLight: '#4A5570', grassNear: '#2E4B4A',
    wall: '#50556E', wallLight: '#6A7090', wallDark: '#393D55', solid: '#2A2D42', floor: '#5E6280', floorLight: '#777C9A',
    root: '#83767C', rootDark: '#5E525A', moonLight: '#DDE7FF', outside: '#8EA2C8',
    worm: '#E9A0AE', wormDark: '#C77888'
  };
  // the "scale"'s look (sets/pile.js: clear, a faint green cast at its edge, a white shine)
  var GLASS = { clear: '#E2F6EC', green: '#8ED4B2', deep: '#5FB392', line: '#3E9273', blue: '#BFE6F0' };

  function inEll(x, y, H, k) { var dx = (x - H.cx) / (H.rx * k), dy = (y - H.cy) / (H.ry * k); return dx * dx + dy * dy < 1; }
  // a polyline's y at x (points left to right)
  function lineAt(P, x) {
    if (x <= P[0][0]) return P[0][1];
    for (var i = 1; i < P.length; i++) if (x <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0]));
    return P[P.length - 1][1];
  }
  // a smooth path through points (quadratic midpoints)
  function smooth(P) {
    var d = 'M' + n(P[0][0]) + ' ' + n(P[0][1]);
    for (var i = 1; i < P.length - 1; i++) d += 'Q' + n(P[i][0]) + ' ' + n(P[i][1]) + ' ' + n((P[i][0] + P[i + 1][0]) / 2) + ' ' + n((P[i][1] + P[i + 1][1]) / 2);
    return d + 'L' + n(P[P.length - 1][0]) + ' ' + n(P[P.length - 1][1]);
  }
  function keepBox(S, b) { (S.keep = S.keep || []).push({ x: b.x, y: b.y, w: b.w, h: b.h }); }

  // The Tap's target: an unpainted rect of class pc-tap named `data-tap` (the pile's), first in keep, so
  // the page's glow and the lettering both find it. Nothing is painted.
  function tapRect(S, name, b) {
    (S.keep = S.keep || []).unshift({ x: b.x - 4, y: b.y - 4, w: b.w + 8, h: b.h + 8 });
    return rect(b.x, b.y, b.w, b.h, 'none', { 'class': 'pc-tap', 'data-tap': name, 'pointer-events': 'none' });
  }

  // ------------------------------------------------------------------ who is where (for the covers)

  // Where a cast member at spot `a` is drawn, as scenes.js draws it (the cats' units, a sitting Clan
  // cat's height to the spot's `h`, the size band art.sizeBands holds a newcomer to, every extra the
  // painter takes): its body and head boxes in the world, [x0, y0, x1, y1]. Without the character
  // drawings (or with the placeholders), a sitting cat's shape at the spot.
  var OWN = { who: 1, at: 1, pose: 1, mood: 1, variant: 1, facing: 1, size: 1, purr: 1, lift: 1, look: 1, sex: 1, taken: 1 };
  function castEst(S, m, a) {
    var fn = art.character, who = m.who || 'clancat', face = m.facing || a.face || 'right', H = a.h * (m.size > 0 ? +m.size : 1);
    var o = { pose: m.pose || 'sit', mood: m.mood || 'neutral' }, k;
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
      return { face: face, body: [a.x - H * 0.42, a.y - H * 0.78, a.x + H * 0.42, a.y], head: [a.x - H * 0.2, a.y - H * 0.78, a.x + H * 0.2, a.y - H * 0.42], point: [a.x, a.y - H * 0.6], drawn: false };
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
    var hp = ch.head || { x: ch.w / 2, y: ch.h * 0.25 };
    var out = { face: face, body: W(bb), head: W(hb), point: [a.x + (hp.x - ch.w / 2) * s, a.y + (hp.y - ch.h) * s], drawn: true };
    // a raised tail's tip (`tailUp`), where the painter marks it for the tail Tap (pc-tap-tail), in the world
    if (m.tailUp === true) {
      var tch = ch;
      if (ch.svg.indexOf('pc-tap-tail') < 0) { var ot = {}; for (k in o) ot[k] = o[k]; ot.tap = 'tail'; try { tch = fn(who, ot); } catch (e) { tch = null; } }
      var tip = tch && markAt(tch.svg, 'tail');
      if (tip) out.tail = [a.x + (tip[0] - tch.w / 2) * s, a.y + (tip[1] - tch.h) * s, tip[2] * s];
    }
    return out;
  }
  // The centre and radius of a drawing's tap mark (an unpainted circle in a group of class pc-tap-NAME),
  // in the drawing's own box: carried out through the transforms of the groups round it.
  function markAt(svg, name) {
    var i = svg.indexOf('pc-tap-' + name);
    if (i < 0) return null;
    var c = /<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([-\d.]+)"/.exec(svg.slice(i));
    if (!c) return null;
    var re = /<g\b[^>]*>|<\/g>/g, stack = [], mt;
    while ((mt = re.exec(svg)) && mt.index < i + c.index) { if (mt[0] === '</g>') stack.pop(); else stack.push(mt[0]); }
    var p = [+c[1], +c[2]], q = [+c[1] + +c[3], +c[2]];
    for (var j = stack.length - 1; j >= 0; j--) {
      var t = / transform="([^"]+)"/.exec(stack[j]);
      if (t) { p = through(t[1], p); q = through(t[1], q); }
    }
    return [p[0], p[1], Math.sqrt((q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1]))];
  }
  function through(t, p) {
    var ops = [], re = /(\w+)\(([^)]*)\)/g, mt;
    while ((mt = re.exec(t))) ops.push([mt[1], mt[2].split(/[\s,]+/).filter(function (v) { return v !== ''; }).map(Number)]);
    for (var i = ops.length - 1; i >= 0; i--) {
      var op = ops[i][0], v = ops[i][1];
      if (op === 'translate') p = [p[0] + v[0], p[1] + (v[1] || 0)];
      else if (op === 'scale') p = [p[0] * v[0], p[1] * (v.length > 1 ? v[1] : v[0])];
      else if (op === 'matrix') p = [v[0] * p[0] + v[2] * p[1] + v[4], v[1] * p[0] + v[3] * p[1] + v[5]];
      else if (op === 'rotate') { var r = v[0] * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r), cx = v[1] || 0, cy = v[2] || 0, x = p[0] - cx, y = p[1] - cy; p = [cx + cs * x - sn * y, cy + sn * x + cs * y]; }
    }
    return p;
  }
  // the first cast member at a named spot here, with its spot
  function who(S, name) {
    var a = (S.anchorMap || {})[name], cast = S.cast || [];
    if (!a) return null;
    for (var i = 0; i < cast.length; i++) if (cast[i] && cast[i].at === name) return { m: cast[i], a: a };
    return null;
  }
  function boxAttr(b) { return n(b[0]) + ' ' + n(b[1]) + ' ' + n(b[2]) + ' ' + n(b[3]); }

  // ------------------------------------------------------------------ small painters

  // Tall weeds: blades (and a few seed heads) along a base line from x0 to x1, `tall(x)` high at x,
  // three tones. With `cap(x)`, no blade (seed head and all) reaches above that y.
  function weedBlades(x0, x1, base, tall, seed, o) {
    o = o || {};
    var r = rng(seed), a = '', b = '', c = '', heads = '', top = base, i = 0;
    var gap = o.gap || 6, w0 = o.w || 2.4;
    for (var x = x0; x < x1 && i < 900; x += gap * (0.45 + r() * 0.9), i++) {
      var hgt = typeof tall === 'function' ? tall(x) : tall;
      if (!(hgt > 0)) continue;
      var y = base + (r() - 0.25) * (o.jit == null ? hgt * 0.05 : o.jit), hh = hgt * (o.even ? 0.86 + r() * 0.14 : 0.6 + r() * 0.4);
      var seedy = r() < (o.seeds == null ? 0.12 : o.seeds), sh = seedy ? Math.max(4, hgt * 0.07) : 0;
      if (o.cap) hh = Math.min(hh, y - o.cap(x) - sh);
      if (hh < 3) continue;
      var lean = (r() - 0.5) * hh * (o.lean == null ? 0.26 : o.lean), w = w0 * (0.7 + r() * 0.6);
      var d = K.bladeD(x, y, hh, lean, w), q = r();
      if (q < 0.36) a += d; else if (q < 0.74) b += d; else c += d;
      if (seedy) heads += K.leafD(x + lean, y - hh + 1, sh, -Math.PI / 2 + (r() - 0.5) * 0.4, Math.max(1.2, w * 0.7));
      top = Math.min(top, y - hh - sh);
    }
    return { svg: path(c, COL.weedDark, { opacity: 0.96 }) + path(a, COL.weed) + path(b, COL.weedLight, { opacity: 0.92 }) + path(heads, COL.seed, { opacity: 0.9 }), top: top };
  }

  // One tiny print, a weasel's: a round pad, five little toes close together ahead of it (toward `ang`).
  function printD(x, y, r, ang) {
    var d = dot(x, y, r);
    for (var i = 0; i < 5; i++) {
      var t = ang + (i - 2) * 0.42, R = r * (i === 0 || i === 4 ? 1.35 : 1.55);
      d += dot(x + Math.cos(t) * R, y + Math.sin(t) * R * 0.8, r * 0.36);
    }
    return d;
  }
  // Prints round a hole: two little trails out of it, down and away on each side, and a few at its
  // sides: coming and going.
  function printsRound(H, pr, seed) {
    var r = rng(seed), d = '';
    [-1, 1].forEach(function (side) {
      var x = H.cx + side * H.rx * 0.55, y = H.cy + H.ry * 1.25, ang = Math.PI / 2 + side * 0.7;
      for (var i = 0; i < 4; i++) {
        var off = (i % 2 ? 1 : -1) * pr * 1.5;
        d += printD(x + Math.cos(ang + Math.PI / 2) * off, y + Math.sin(ang + Math.PI / 2) * off, pr, i % 2 ? ang : ang + Math.PI);
        x += Math.cos(ang) * pr * 4.4 + (r() - 0.5) * pr; y += Math.sin(ang) * pr * 3.2;
      }
      for (var j = 0; j < 2; j++) {
        var t = (side < 0 ? Math.PI : 0) + (j ? -0.5 : 0.35) * side;
        d += printD(H.cx + Math.cos(t) * H.rx * 1.42, H.cy + Math.sin(t) * H.ry * 1.5, pr * 0.92, t + (r() - 0.5));
      }
    });
    return d;
  }

  // Tufts of short grass scattered over a region, clear of the holes.
  function faceTufts(x0, x1, yAt, y1, count, size, seed, holes, colA, colB) {
    var r = rng(seed), a = '', b = '';
    for (var i = 0; i < count; i++) {
      var tx = x0 + r() * (x1 - x0), y0 = yAt(tx), ty = y0 + 8 + r() * (y1(tx) - y0 - 8), sc = size * (0.6 + r() * 0.7);
      var clear = true;
      for (var h = 0; h < holes.length; h++) if (inEll(tx, ty, holes[h], 1.7)) clear = false;
      if (!clear) continue;
      var d = '';
      for (var j = 0; j < 4; j++) d += K.bladeD(tx + (j - 1.5) * 3.4 * sc, ty, (9 + r() * 10) * sc, (j - 1.5) * 3.6 * sc, 1.6 * sc);
      if (r() < 0.55) a += d; else b += d;
    }
    return path(a, colA, { opacity: 0.7 }) + path(b, colB, { opacity: 0.75 });
  }

  // ------------------------------------------------------------------ the sky, the moon, the tracks

  function nightSky(S, L) {
    var y1 = L.sky, c = COL.sky;
    var s = rect(-10, -10, 1620, y1 + 20, S.linU([[0, c[0]], [0.35, c[1]], [0.65, c[2]], [0.88, c[3]], [1, c[4]]], 0, 0, 0, y1));
    s += K.stars(S, 0, 0, 1600, y1 * 0.88, Math.round(1600 * y1 / 2400), L.seed + 1);
    // a silver haze low over the bank, where the moonlight lies
    s += rect(-10, y1 * 0.5, 1620, y1 * 0.5 + 10, S.linU([[0, COL.haze, 0], [1, COL.haze, 0.32]], 0, y1 * 0.5, 0, y1));
    return g(s, { 'data-art': 'sky' });
  }

  // `moon: n`: the moon n evenings old (kit.waxingMoon, as over the pile and the den), each evening a
  // little fatter, bigger and higher; 8, the eighth evening's half moon, high in the sky. Only in a
  // camera with sky (wide, hide, brag); in keep, so the lettering stays off it.
  function moonAge(o) { var v = o ? o.moon : null; return typeof v === 'number' && isFinite(v) && v > 0 ? clamp(v, 1, 15) : 0; }
  function trackMoon(S, L) {
    var age = moonAge(S.opts), M = L.moon;
    if (!age || !M) return '';
    var e = clamp(age - 4, 0, 10), x = M.x + M.dx * e, y = Math.max(M.r + 10, M.y + M.dy * e), r = Math.min(M.rmax, M.r + M.dr * e);
    keepBox(S, { x: x - r - 8, y: y - r - 8, w: 2 * r + 16, h: 2 * r + 16 });
    return K.waxingMoon(S, x, y, r, Math.max(8, 38 - 3 * e), age);
  }

  // The tracks along the top of the bank: the ballast shoulder, its bed, the sleepers across it and two
  // long rails, bright in the moonlight, each about T.rail wide over a soft glow (the pile's far tracks,
  // drawn to read on an iPad page). T.y: the near rail's y at the left and right ends; T.gap: to the far
  // rail. The rails band goes in keep (Reynard trots there; the lettering stays off it).
  function tracks(S, T) {
    var x0 = T.x0, x1 = T.x1, yL = T.y[0], yR = T.y[1], gp = T.gap, s = '', i;
    function yAt(x) { return lerp(yL, yR, (x - x0) / (x1 - x0)); }
    var top0 = yL - gp - T.bed[0], top1 = yR - gp - T.bed[0], bot0 = yL + T.bed[1], bot1 = yR + T.bed[1];
    // the ballast shoulder, falling to the bank top
    s += poly([[x0, bot0 - 4], [x1, bot1 - 4], [x1, bot1 + T.shoulder], [x0, bot0 + T.shoulder]], S.linU([[0, COL.ballast], [1, mix(COL.ballast, COL.bankTop, 0.5)]], 0, bot0, 0, bot0 + T.shoulder));
    var r = rng(T.seed), stones = '', lights = '';
    for (i = 0; i < T.stones; i++) {
      var sx = x0 + r() * (x1 - x0), sy = yAt(sx) + T.bed[1] + r() * T.shoulder, sr = T.pebble * (0.6 + r() * 0.8);
      if (r() < 0.6) stones += dot(sx, sy, sr); else lights += dot(sx, sy, sr * 0.8);
    }
    s += path(stones, COL.ballastDark, { opacity: 0.55 }) + path(lights, COL.ballastLight, { opacity: 0.7 });
    // the bed
    s += poly([[x0, top0], [x1, top1], [x1, bot1], [x0, bot0]], COL.ballastDark);
    // the sleepers: short dark bars across the bed, with a lit top edge
    var sl = '', st = '';
    for (var x = x0 + T.step * 0.3; x < x1; x += T.step) {
      var y = yAt(x), w = T.sleeper, a0 = y - gp - T.bed[0] * 0.55, a1 = y + T.bed[1] * 0.6;
      sl += 'M' + n(x - w / 2) + ' ' + n(a0) + 'H' + n(x + w / 2) + 'V' + n(a1) + 'H' + n(x - w / 2) + 'Z';
      st += 'M' + n(x - w / 2) + ' ' + n(a0) + 'H' + n(x + w / 2);
    }
    s += path(sl, COL.sleeper) + stroke(st, COL.sleeperTop, Math.max(1, T.sleeper * 0.22), { opacity: 0.9 });
    // the rails: a soft glow, then the bright line (far rail first)
    var d = 'M' + n(x0) + ' ' + n(yL - gp) + 'L' + n(x1) + ' ' + n(yR - gp) + 'M' + n(x0) + ' ' + n(yL) + 'L' + n(x1) + ' ' + n(yR);
    s += stroke(d, COL.railGlow, T.glow, { opacity: 0.24 }) + stroke(d, COL.rail, T.rail);
    keepBox(S, { x: Math.max(0, x0), y: Math.min(top0, top1) - 4, w: Math.min(1600, x1) - Math.max(0, x0), h: Math.max(bot0, bot1) - Math.min(top0, top1) + 8 });
    return g(s, { 'data-art': 'tracks' });
  }

  // ------------------------------------------------------------------ the bank

  function bankFace(S, L) {
    var B = L.bank, top = B.top, foot = B.foot;
    var d = smooth(top) + 'L' + n(foot[foot.length - 1][0]) + ' ' + n(foot[foot.length - 1][1]);
    for (var i = foot.length - 2; i >= 0; i--) d += 'L' + n(foot[i][0]) + ' ' + n(foot[i][1]);
    var y0 = Math.min.apply(null, top.map(function (q) { return q[1]; })), y1 = Math.max.apply(null, foot.map(function (q) { return q[1]; }));
    var s = path(d + 'Z', S.linU([[0, COL.bankTop], [0.3, COL.bank], [0.75, COL.bankLow], [1, COL.bankDark]], 0, y0, 0, y1));
    // the moonlight lies brightest high on the bank
    s += path(d + 'Z', S.radU([[0, COL.moonLight, 0.14], [1, COL.moonLight, 0]], B.glow ? B.glow[0] : 1100, B.glow ? B.glow[1] : y0, B.glow ? B.glow[2] : 900));
    // the moon's light along the top edge
    s += stroke(smooth(top), COL.rim, B.rim, { opacity: 0.6 });
    s += faceTufts(top[0][0], top[top.length - 1][0], function (x) { return lineAt(top, x) + B.rim; }, function (x) { return lineAt(foot, x) - 6; },
      B.tufts, B.tuft, L.seed + 20, L.holes, COL.tuftA, COL.tuftB);
    return g(s, { 'data-art': 'bank' });
  }

  // A hole's dark mouth (never black: a deep blue-grey, deepest in the middle) in its ring of earth.
  function holeMouth(S, H) {
    var s = '', cx = H.cx, cy = H.cy, rx = H.rx, ry = H.ry, r = rng(H.seed);
    // the dug earth spilled under it
    s += path(blob(cx, cy + ry * 1.0, rx * 1.5, ry * 0.8, 12, r, 0.16, 0.2), COL.earthDark, { opacity: 0.8 });
    s += path(blob(cx, cy + ry * 0.85, rx * 1.32, ry * 0.6, 11, r, 0.16, 0.22), COL.earth);
    s += ell(cx, cy, rx * 1.1, ry * 1.12, COL.earthDark);
    s += ell(cx, cy, rx, ry, S.radU([[0, COL.holeDeep], [0.65, COL.holeIn], [1, mix(COL.holeIn, COL.earthDark, 0.55)]], cx, cy - ry * 0.12, Math.max(rx, ry) * 1.05));
    // the top rim catches the moon
    s += stroke('M' + n(cx - rx * 1.02) + ' ' + n(cy - ry * 0.05) + 'A' + n(rx * 1.04) + ' ' + n(ry * 1.08) + ' 0 0 1 ' + n(cx + rx * 1.02) + ' ' + n(cy - ry * 0.05),
      COL.earthLight, Math.max(1.4, ry * 0.11), { opacity: 0.75 });
    return s;
  }
  // its front lip: a raised crescent of earth over the mouth's lower edge, its top edge lit
  function holeLip(S, H) {
    var cx = H.cx, cy = H.cy, rx = H.rx, ry = H.ry;
    var top = 'M' + n(cx - rx * 1.14) + ' ' + n(cy + ry * 0.2) + 'Q' + n(cx) + ' ' + n(cy + ry * 0.72) + ' ' + n(cx + rx * 1.14) + ' ' + n(cy + ry * 0.2);
    var d = top + 'Q' + n(cx + rx * 1.12) + ' ' + n(cy + ry * 1.18) + ' ' + n(cx) + ' ' + n(cy + ry * 1.2) + 'Q' + n(cx - rx * 1.12) + ' ' + n(cy + ry * 1.18) + ' ' + n(cx - rx * 1.14) + ' ' + n(cy + ry * 0.2) + 'Z';
    return path(d, COL.earth) + stroke(top, COL.earthLight, Math.max(1.4, ry * 0.1), { opacity: 0.85 });
  }

  // The tunnel's end at the foot of the bank: its mouth flat on the ground, let into the bank (the dug earth
  // round it is the bank's own, a shade darker: a hole at its foot, never a hut on the grass), the lip that goes
  // over the back half of whoever wriggles out.
  var TUNNEL_EARTH = { dark: mix(COL.bankDark, COL.earthDark, 0.3), mid: mix(COL.bankLow, COL.earth, 0.28), light: mix(COL.rim, COL.earthLight, 0.35) };
  function tunnelMouth(S, H) {
    var cx = H.cx, cy = H.cy, rx = H.rx, ry = H.ry, base = H.base, r = rng(H.seed), s = '';
    s += path(mound(cx - rx * 1.55, cx + rx * 1.55, base + 4, cy - ry * 1.32, 12, r, 0.24, 0.12, 0.35), TUNNEL_EARTH.dark, { opacity: 0.85 });
    s += path(mound(cx - rx * 1.4, cx + rx * 1.4, base + 2, cy - ry * 1.2, 12, r, 0.24, 0.12, 0.35), TUNNEL_EARTH.mid);
    s += stroke('M' + n(cx - rx * 1.3) + ' ' + n(cy - ry * 0.5) + 'Q' + n(cx - rx * 1.1) + ' ' + n(cy - ry * 1.24) + ' ' + n(cx) + ' ' + n(cy - ry * 1.22) + 'Q' + n(cx + rx * 1.1) + ' ' + n(cy - ry * 1.24) + ' ' + n(cx + rx * 1.3) + ' ' + n(cy - ry * 0.5),
      TUNNEL_EARTH.light, Math.max(2, ry * 0.08), { opacity: 0.6 });
    // the mouth: an arch, flat on the ground
    var d = 'M' + n(cx - rx) + ' ' + n(base) + 'V' + n(cy) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 1 ' + n(cx + rx) + ' ' + n(cy) + 'V' + n(base) + 'Z';
    s += path(d, S.radU([[0, COL.holeDeep], [0.7, COL.holeIn], [1, mix(COL.holeIn, COL.earthDark, 0.5)]], cx, cy + ry * 0.2, rx * 1.15));
    s += stroke('M' + n(cx - rx) + ' ' + n(cy) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 1 ' + n(cx + rx) + ' ' + n(cy), COL.earthLight, Math.max(2, ry * 0.07), { opacity: 0.6 });
    // the earth on the floor of the mouth, pressed smooth, with prints going in and out
    s += ell(cx, base - 2, rx * 0.95, ry * 0.12, mix(COL.earth, COL.holeIn, 0.4));
    return s;
  }
  // A closed outline whose every edge bulges outward (kit.scallops round its own middle): it covers at
  // least the polygon through P, so a cover built on it never leaves a corner of what it hides.
  function lumpy(P, bulge) {
    var cx = 0, cy = 0;
    P.forEach(function (q) { cx += q[0] / P.length; cy += q[1] / P.length; });
    return K.scallops(P, cx, cy, bulge, true);
  }
  // The lip over her back half (in any pose): a heap of the tunnel's dug earth from behind her back end
  // to just behind her shoulders, a little above her and down to the ground, lumpy on top; its front
  // edge is the mouth's rim, lit. Head and shoulders out.
  function tunnelLip(S, est, a, seed) {
    var bb = est.body, w = bb[2] - bb[0], hgt = bb[3] - bb[1], dir = est.face === 'left' ? -1 : 1, m = Math.max(8, w * 0.06), r = rng(seed);
    var back = dir > 0 ? bb[0] : bb[2], cut = back + dir * w * 0.45, xb = back - dir * m * 1.6, yt = bb[1] - m, yb = Math.max(bb[3], a.y) + m * 0.6;
    var P = [[xb, yb], [xb, lerp(yb, yt, 0.55)]], i, k = 5;
    for (i = 0; i <= k; i++) P.push([lerp(xb + dir * m, cut - dir * m * 0.5, i / k), yt - r() * hgt * 0.06 - (i === 0 ? 0 : m * 0.3)]);
    P.push([cut + dir * hgt * 0.07, lerp(yt, yb, 0.4)], [cut + dir * hgt * 0.04, lerp(yt, yb, 0.8)], [cut, yb]);
    var d = lumpy(P, 0.16), edge = smooth([[cut - dir * m, yt - m * 0.2], [cut + dir * hgt * 0.07, lerp(yt, yb, 0.4)], [cut + dir * hgt * 0.04, lerp(yt, yb, 0.8)], [cut, yb]]);
    var crumbs = '', clods = '';
    for (i = 0; i < 9; i++) crumbs += dot(lerp(xb, cut, 0.12 + r() * 0.75), lerp(yt, yb, 0.15 + r() * 0.75), Math.max(1.5, hgt * 0.018) * (0.6 + r()));
    for (i = 0; i < 4; i++) clods += blob(lerp(xb, cut, 0.2 + r() * 0.6), lerp(yt, yb, 0.1 + r() * 0.3), hgt * (0.06 + r() * 0.05), hgt * (0.035 + r() * 0.03), 7, r, 0.3, 0.25);
    var s = path(d, TUNNEL_EARTH.mid) + path(clods, TUNNEL_EARTH.light, { opacity: 0.3 }) + path(crumbs, TUNNEL_EARTH.dark, { opacity: 0.55 }) +
      stroke(edge, TUNNEL_EARTH.light, Math.max(2, hgt * 0.03), { opacity: 0.85 });
    return g(s, { 'data-part': 'cover-tunnel', 'data-box': boxAttr([Math.min(xb, cut), yt, Math.max(xb, cut), yb]), 'data-cut': n(cut), filter: S.shadow('s') });
  }
  // A weasel peeking out of its hole: the hole's near lip, raised to just under its chin where its head
  // is, over the rest of it. The lip's top is the mouth's lower rim: from the hole's sides it dips to
  // the line under the chin, so its head and shoulders are out and the dark of the hole shows round them.
  function peekLip(S, H, est, a) {
    var hb = est.head, bb = est.body, hh = hb[3] - hb[1], m = Math.max(4, hh * 0.15);
    var line = hb[3] + hh * 0.3, hx = clamp((hb[0] + hb[2]) / 2, H.cx - H.rx * 0.6, H.cx + H.rx * 0.6);
    var xl = Math.min(H.cx - H.rx * 1.12, bb[0] - m), xr = Math.max(H.cx + H.rx * 1.12, bb[2] + m), side = Math.min(line, H.cy + H.ry * 0.1);
    var yb = Math.max(bb[3] + m, a.y + m, H.cy + H.ry * 1.2), cyL = 2 * line - side, k = 0.5;
    // the top edge: two curves meeting under the chin
    var top = 'M' + n(xl) + ' ' + n(side) + 'Q' + n(lerp(xl, hx, k)) + ' ' + n(cyL) + ' ' + n(hx) + ' ' + n(line) + 'Q' + n(lerp(hx, xr, 1 - k)) + ' ' + n(cyL) + ' ' + n(xr) + ' ' + n(side);
    var d = top + 'Q' + n(xr + H.rx * 0.05) + ' ' + n(yb) + ' ' + n((xl + xr) / 2) + ' ' + n(yb) + 'Q' + n(xl - H.rx * 0.05) + ' ' + n(yb) + ' ' + n(xl) + ' ' + n(side) + 'Z';
    var s = path(d, S.linU([[0, COL.earthLight], [0.15, COL.earth], [1, COL.earthDark]], 0, line, 0, yb)) + stroke(top, COL.earthLight, Math.max(1.4, H.ry * 0.1), { opacity: 0.9 });
    // what it covers for sure: the body below the line, across the body
    return g(s, { 'data-part': 'cover-lip', 'data-box': boxAttr([Math.max(xl, bb[0] - m * 0.5), line, Math.min(xr, bb[2] + m * 0.5), yb]), 'data-line': n(line) });
  }
  // A clump of weed: a dark mass whose top is a row of blade tips (a zigzag at `top(x)`), and blades over
  // it reaching up to `cap(x)` (no blade, seed head and all, above it). Used over a cat's lower body.
  function weedClump(x0, x1, base, massTop, cap, seed, o) {
    o = o || {};
    // (beyond x0..x1, `o.taper` more each side, falling away to the ground: no hard edge)
    var tp = o.taper || 0, X0 = x0, X1 = x1, mt = massTop, cp = cap;
    if (tp > 0) {
      x0 = X0 - tp; x1 = X1 + tp;
      var fall = function (x) { var t = x < X0 ? (X0 - x) / tp : x > X1 ? (x - X1) / tp : 0; return t * t * (base - mt(clamp(x, X0, X1))) * 0.85; };
      massTop = function (x) { return mt(clamp(x, X0, X1)) + fall(x); };
      cap = function (x) { return cp(clamp(x, X0, X1)) + fall(x); };
    }
    var r = rng(seed), gap = o.gap, d = 'M' + n(x0) + ' ' + n(base), x = x0;
    d += 'L' + n(x0) + ' ' + n(massTop(x0) + gap);
    while (x < x1) {
      var tip = massTop(x + gap * 0.5) - r() * gap * 0.6;
      d += 'L' + n(x + gap * 0.5) + ' ' + n(tip) + 'L' + n(Math.min(x1, x + gap)) + ' ' + n(massTop(x + gap) + gap * (0.8 + r() * 0.6));
      x += gap;
    }
    d += 'L' + n(x1) + ' ' + n(base) + 'Z';
    var bl = weedBlades(x0, x1, base, function (xx) { return base - cap(xx); }, seed + 7, { gap: o.blade, w: o.w, even: true, jit: o.jit || 0, cap: cap, seeds: o.seeds == null ? 0.14 : o.seeds, lean: 0.16 });
    return { svg: path(d, COL.weedDark) + bl.svg, top: Math.min(bl.top, cp(X0)), solid: mt(X0) + gap * 1.4 };
  }
  // Tall weeds over whoever is at a weeds spot: across her face up to her eyes (her ears, eyes and the top
  // of her head stand above them), and everywhere else as high as the top of her back, so her back, flank,
  // haunch and tail are in the weeds too (crouched, a cat's back and haunch rise above her eyes). A raised
  // tail's tip stands above them: where it would be in the weeds, they part round it.
  function weedsCover(S, est, a, seed, name) {
    var hb = est.head, bb = est.body, hh = hb[3] - hb[1], eye = hb[1] + hh * 0.66, wdt = bb[2] - bb[0], m = Math.max(10, wdt * 0.1);
    var x0 = bb[0] - m, x1 = bb[2] + m, base = Math.max(bb[3], a.y) + Math.max(20, hh * 0.3);
    // the window over her face, and the ramp each side of it up to her back's height
    var h0 = hb[0] - hh * 0.02, h1 = hb[2] + hh * 0.02, ramp = Math.max(10, hh * 0.14), back = Math.min(eye, bb[1] + hh * 0.1);
    function cap(x) {
      var d = x < h0 ? h0 - x : x > h1 ? x - h1 : 0, t = clamp(d / ramp, 0, 1);
      return lerp(eye, back, t * t * (3 - 2 * t));
    }
    // a raised tail whose tip would be in the weeds (crouched, or an otter standing up): they part round it
    var T = est.tail, notch = T && T[1] + T[2] * 1.3 > cap(T[0]) ? [T[0] - T[2] * 1.5, T[0] + T[2] * 1.5, T[1] + T[2] * 1.3] : null;
    function low(f) { return function (x) { var y = f(x); return notch && x > notch[0] && x < notch[1] ? Math.max(y, notch[2]) : y; }; }
    var C = weedClump(x0, x1, base, low(function (x) { return cap(x) + hh * 0.16; }), low(cap), seed, { gap: Math.max(8, hh * 0.09), blade: Math.max(4, hh * 0.035), w: Math.max(2.4, hh * 0.03), jit: hh * 0.06, taper: m * 3 });
    var at = { 'data-part': 'cover-weeds', 'data-at': name, 'data-top': n(C.top), 'data-eye': n(eye), 'data-back': n(back), 'data-face': n(h0) + ' ' + n(h1), 'data-box': boxAttr([x0, C.solid, x1, base]) };
    if (notch) at['data-notch'] = n(notch[0]) + ' ' + n(notch[1]) + ' ' + n(notch[2]);
    return g(C.svg, at);
  }
  // Weeds over her legs (the friend keeping watch among the weeds).
  function legsCover(S, est, a, seed) {
    var bb = est.body, hgt = Math.max(1, a.y - bb[1]), cap = Math.max(a.y - hgt * 0.3, est.head[3] + hgt * 0.04), m = Math.max(8, (bb[2] - bb[0]) * 0.1);
    var x0 = bb[0] - m, x1 = bb[2] + m, base = a.y + hgt * 0.08;
    var C = weedClump(x0, x1, base, function () { return cap + hgt * 0.1; }, function () { return cap; }, seed, { gap: Math.max(8, hgt * 0.05), blade: Math.max(4, hgt * 0.02), w: Math.max(2.2, hgt * 0.014), taper: m * 2 });
    return g(C.svg, { 'data-part': 'cover-watch', 'data-top': n(C.top), 'data-box': boxAttr([x0, C.solid, x1, base]) });
  }

  function drawBank(S, L) {
    var o = S.opts, back = '', over = '', front = '';
    if (L.sky) back += nightSky(S, L);
    back += trackMoon(S, L);
    if (L.towers) back += g(K.towers(S, L.towers), { opacity: 0.8, 'data-art': 'towers' });
    if (L.track) back += tracks(S, L.track);
    back += bankFace(S, L);
    var holes = '', lips = '', pr = '';
    L.holes.forEach(function (H, j) {
      if (H.kind === 'tunnel') holes += tunnelMouth(S, H);
      else { holes += holeMouth(S, H); lips += holeLip(S, H); }
      pr += printsRound(H, H.print || L.print, L.seed + 60 + j * 7);
    });
    back += g(holes, { 'data-art': 'holes' });
    if (L.ground) back += nearGround(S, L);
    back += g(lips, { filter: S.shadow('s') });
    // faint tiny prints round every hole, always
    back += g(path(pr, COL.print, { opacity: 0.5 }), { 'data-art': 'prints' });
    // tall weeds
    var wd = '';
    (L.weeds || []).forEach(function (W, j) {
      var tall = function (x) { var t = (x - W[0]) / (W[1] - W[0]); return W[3] * (0.72 + 0.28 * Math.sin(Math.PI * clamp(t, 0, 1))); };
      if (W[6]) wd += weedClump(W[0], W[1], W[2] + 10, function (x) { return W[2] - W[6] * (0.8 + 0.2 * Math.sin(x / 37)); }, function (x) { return W[2] - tall(x); }, L.seed + 200 + j * 11,
        { gap: (W[4] || 6) * 2.2, blade: W[4] || 6, w: W[5] || 2.6, jit: 10 }).svg;
      else wd += weedBlades(W[0], W[1], W[2], tall, L.seed + 200 + j * 11, { gap: W[4] || 6, w: W[5] || 2.6 }).svg;
    });
    if (wd) back += g(wd, { filter: S.shadow('s'), 'data-art': 'weeds' });
    // covers, each drawn just after whoever is at its spot
    var c;
    if ((c = who(S, 'tunnel-end'))) S.covers['tunnel-end'] = tunnelLip(S, castEst(S, c.m, c.a), c.a, L.seed + 301);
    ['hole-1', 'hole-2'].forEach(function (k, j) {
      var w = who(S, k), H = L.holeAt && L.holeAt[k];
      if (w && H && w.m.pose === 'peek') S.covers[k] = peekLip(S, H, castEst(S, w.m, w.a), w.a);
    });
    ['weeds-1', 'weeds-2'].forEach(function (k, j) {
      var w = who(S, k);
      if (w) S.covers[k] = weedsCover(S, castEst(S, w.m, w.a), w.a, L.seed + 400 + j * 17, k);
    });
    if ((c = who(S, 'watch'))) S.covers.watch = legsCover(S, castEst(S, c.m, c.a), c.a, L.seed + 450);
    // in front of everyone: a few near tufts at the bottom corners
    if (L.near) front += g(faceTufts(L.near[0], L.near[1], function () { return L.near[2]; }, function () { return L.near[3]; }, L.near[4], L.near[5], L.seed + 500, [], COL.grassNear, COL.weedDark), { 'data-art': 'near' });
    // the Taps
    if (o.tap === 'weeds' && L.weedsTap) front += tapRect(S, 'weeds', L.weedsTap);
    if (o.tap === 'stash' && L.stashHole) {
      var H = L.stashHole;
      front += tapRect(S, 'stash', { x: H.cx - H.rx, y: H.cy - H.ry, w: H.rx * 2, h: H.ry * 2 });
    }
    return { back: back, over: over, front: front };
  }

  // The near ground under the bank (wide): dark earth and short grass, a few fallen ballast stones.
  function nearGround(S, L) {
    var G = L.ground, foot = L.bank.foot, d = smooth(foot.map(function (q) { return [q[0], q[1] - 6]; })) + 'L1640 1010L-40 1010Z';
    var s = path(d, S.linU([[0, COL.groundLight], [0.25, COL.ground], [1, mix(COL.ground, COL.solid, 0.4)]], 0, G.y, 0, 1000));
    s += faceTufts(-20, 1620, function (x) { return lineAt(foot, x); }, function () { return 990; }, G.tufts, G.tuft, L.seed + 30, [], COL.grassNear, mix(COL.grassNear, COL.weedLight, 0.4));
    var r = rng(L.seed + 31), st = '';
    for (var i = 0; i < 14; i++) { var x = r() * 1600, y = lineAt(foot, x) + 20 + r() * (980 - lineAt(foot, x)); st += K.blob(x, y, 5 + r() * 6, 3 + r() * 4, 7, r, 0.3, 0.25); }
    s += path(st, COL.ballast, { opacity: 0.55 });
    return g(s, { 'data-art': 'ground' });
  }

  // ------------------------------------------------------------------ the stash

  // Mice and voles in tidy rows (every one facing the same way, mice and voles in turn), in the
  // chamber's dim light; about a third of them muddy underneath (ReedClan's): the same piece again,
  // darkened like wet mud, clipped to its belly and feet.
  function preyRows(S, rows, seed) {
    if (typeof art.prey !== 'function') return { svg: '', boxes: [] };
    var body = '', boxes = [], muddy = [], ri;
    // the mud's edge: a wavy line across each muddy piece's lower half (splashed up its side)
    function mudBand(R) {
      var y = R.y - 64 * R.k * 0.5, d = 'M' + n(R.x - R.step) + ' ' + n(R.y + 6);
      for (var x = R.x - R.step; x <= R.x + R.step * R.count; x += R.step * 0.25) d += 'L' + n(x) + ' ' + n(y + Math.sin(x * 0.11) * 64 * R.k * 0.08);
      return d + 'L' + n(R.x + R.step * R.count) + ' ' + n(R.y + 6) + 'Z';
    }
    var tint = S.filter('trprey', '<feColorMatrix type="matrix" values="0.78 0 0 0 0.03  0 0.8 0 0 0.04  0 0 0.9 0 0.08  0 0 0 1 0"/>');
    var mud = S.filter('trmud', '<feColorMatrix type="matrix" values="0.18 0 0 0 0.17  0 0.14 0 0 0.11  0 0 0.1 0 0.06  0 0 0 1 0"/>');
    for (ri = 0; ri < rows.length; ri++) {
      var R = rows[ri], row = '', mrow = '';
      for (var i = 0; i < R.count; i++) {
        var kind = (i + ri) % 2 ? 'vole' : 'mouse', pr = art.prey({ kind: kind, seed: seed + ri * 31 + i * 7, facing: R.facing || 'right' });
        var k = R.k, x = R.x + i * R.step - pr.w * k / 2, y = R.y - pr.h * k;
        var piece = '<g transform="translate(' + n(x) + ' ' + n(y) + ') scale(' + K.n4(k) + ')">' + pr.svg + '</g>';
        row += piece;
        if (R.mud.indexOf(i) >= 0) mrow += piece;
      }
      body += row;
      boxes.push({ x: R.x - R.step * 0.6, y: R.y - 76 * R.k - 6, w: R.step * (R.count - 1) + R.step * 1.2, h: 76 * R.k + 10 });
      if (mrow) muddy.push(g(mrow, { 'clip-path': S.clip('trmudrow' + ri, path(mudBand(R), '#fff')), filter: mud }));
    }
    return { svg: g(g(body + muddy.join(''), { filter: tint }), { 'data-art': 'prey', 'data-muddy': String(rows.reduce(function (t, R) { return t + R.mud.length; }, 0)) }), boxes: boxes };
  }

  // A heap of tower glass: flat, clear, angular pieces with straight edges, piled up from `base` (a
  // mound between x0 and x1, `top` at its peak), back to front; the moonlight through them, white
  // glints, a pale blue-green edge, and a few twinkling stars of light. `k`: a piece's size. `big`: one
  // big piece in front. `small`: the piece at the heap's near edge (the take-one Tap's), whose box is
  // returned.
  function shard(cx, cy, size, r) {
    var nv = 3 + Math.floor(r() * 3), a0 = r() * Math.PI * 2, P = [];
    for (var i = 0; i < nv; i++) {
      var a = a0 + Math.PI * 2 * i / nv + (r() - 0.5) * 0.8, rr = size * (0.55 + r() * 0.6);
      P.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.62]);
    }
    return P;
  }
  function glassPiece(P, k, lit, r) {
    var d = pts(P) + 'Z', s = '';
    s += path(d, GLASS.clear, { opacity: (0.26 + r() * 0.2).toFixed(2) });
    s += path(d, 'none', { stroke: GLASS.green, 'stroke-width': n(Math.max(1, k * 0.07)), 'stroke-linejoin': 'round', opacity: 0.8 });
    // the white shine along one edge, and a glint at a corner
    var e = Math.floor(r() * P.length), a = P[e], b = P[(e + 1) % P.length];
    s += stroke('M' + n(lerp(a[0], b[0], 0.15)) + ' ' + n(lerp(a[1], b[1], 0.15)) + 'L' + n(lerp(a[0], b[0], 0.8)) + ' ' + n(lerp(a[1], b[1], 0.8)), '#FFFFFF', Math.max(1, k * 0.09), { opacity: lit ? 0.95 : 0.7 });
    var c = [0, 0];
    P.forEach(function (q) { c[0] += q[0] / P.length; c[1] += q[1] / P.length; });
    s += path('M' + n(c[0] - k * 0.3) + ' ' + n(c[1] + k * 0.1) + 'L' + n(c[0] + k * 0.15) + ' ' + n(c[1] - k * 0.35), 'none', { stroke: GLASS.blue, 'stroke-width': n(Math.max(1, k * 0.12)), opacity: 0.45, 'stroke-linecap': 'round' });
    return s;
  }
  function glassHeap(S, G) {
    var r = rng(G.seed), list = [], i, k = G.k, cx = (G.x0 + G.x1) / 2, half = (G.x1 - G.x0) / 2;
    for (i = 0; i < G.count; i++) {
      var t = (r() * 2 - 1), u = Math.pow(r(), 0.7), x = cx + t * half * (1 - u * 0.15);
      var hAt = (G.base - G.top) * Math.pow(Math.max(0, 1 - Math.abs(t)), 0.8), y = G.base - u * hAt;
      list.push({ x: x, y: y, size: k * (0.55 + r() * 0.75) * (1 - u * 0.25) });
    }
    list.sort(function (a, b) { return a.y - b.y; });
    var s = '', glints = '';
    // the moonlight pooled on the floor under it
    s += ell(cx, G.base + k * 0.1, half * 1.15, k * 0.55, S.radU([[0, COL.moonLight, 0.28], [1, COL.moonLight, 0]], cx, G.base, half * 1.15));
    list.forEach(function (p, j) { s += glassPiece(shard(p.x, p.y, p.size, r), p.size, j % 3 === 0, r); });
    var out = { box: { x: G.x0 - k * 0.6, y: G.top - k * 0.8, w: G.x1 - G.x0 + k * 1.2, h: G.base - G.top + k * 1.3 } };
    if (G.big) {
      var B = G.big, P = [[B.x - B.w * 0.5, B.y], [B.x - B.w * 0.36, B.y - B.h * 0.92], [B.x + B.w * 0.18, B.y - B.h], [B.x + B.w * 0.5, B.y - B.h * 0.3], [B.x + B.w * 0.34, B.y + B.h * 0.06]];
      s += path(pts(P) + 'Z', COL.solid, { opacity: 0.35, transform: 'translate(' + n(B.w * 0.03) + ' ' + n(B.w * 0.02) + ')' }) +
        path(pts(P) + 'Z', GLASS.clear, { opacity: 0.4 }) + path(pts(P) + 'Z', 'none', { stroke: GLASS.line, 'stroke-width': n(B.w * 0.03), 'stroke-linejoin': 'round', opacity: 0.6 }) +
        path(pts(P) + 'Z', 'none', { stroke: GLASS.green, 'stroke-width': n(B.w * 0.016), 'stroke-linejoin': 'round', opacity: 0.95 }) +
        path(pts([[B.x - B.w * 0.5, B.y], [B.x - B.w * 0.36, B.y - B.h * 0.92], [B.x - B.w * 0.3, B.y - B.h * 0.86], [B.x - B.w * 0.43, B.y]]) + 'Z', GLASS.green, { opacity: 0.45 }) +
        stroke('M' + n(B.x - B.w * 0.26) + ' ' + n(B.y - B.h * 0.7) + 'L' + n(B.x + B.w * 0.06) + ' ' + n(B.y - B.h * 0.94), '#FFFFFF', B.w * 0.03, { opacity: 0.9 }) +
        stroke('M' + n(B.x - B.w * 0.16) + ' ' + n(B.y - B.h * 0.42) + 'L' + n(B.x + B.w * 0.22) + ' ' + n(B.y - B.h * 0.78), '#FFFFFF', B.w * 0.014, { opacity: 0.6 }) +
        // the floor seen through it: a little wavy, a little green
        stroke('M' + n(B.x - B.w * 0.4) + ' ' + n(B.y - B.h * 0.2) + 'q' + n(B.w * 0.1) + ' ' + n(-B.h * 0.05) + ' ' + n(B.w * 0.2) + ' 0t' + n(B.w * 0.2) + ' 0t' + n(B.w * 0.2) + ' 0', GLASS.deep, B.w * 0.01, { opacity: 0.5 });
      out.big = { x: B.x - B.w * 0.5, y: B.y - B.h, w: B.w, h: B.h * 1.06 };
    }
    if (G.small) {
      var Q = G.small, P2 = [[Q.x - Q.s, Q.y], [Q.x - Q.s * 0.4, Q.y - Q.s * 0.9], [Q.x + Q.s * 0.9, Q.y - Q.s * 0.5], [Q.x + Q.s * 0.7, Q.y + Q.s * 0.1]];
      s += g(glassPiece(P2, Q.s, true, rng(G.seed + 5)), { 'data-art': 'glass-piece' });
      out.small = { x: Q.x - Q.s * 1.15, y: Q.y - Q.s * 1.05, w: Q.s * 2.2, h: Q.s * 1.3 };
    }
    // twinkles: stars of light on the heap
    for (i = 0; i < G.glints; i++) {
      var gp = list[Math.floor(r() * list.length)], gr = k * (0.22 + r() * 0.25);
      glints += path(K.sparkleD(gp.x, gp.y - gp.size * 0.3, gr), '#FFFFFF', { 'class': 'pcs-tw', style: 'animation-delay:-' + (r() * 2.8).toFixed(1) + 's' });
    }
    out.svg = g(s + glints, { 'data-art': 'glass-heap' });
    return out;
  }

  // Roots hanging from a roof: each a wavering line that thins to its tip, with a side root or two.
  function roots(list, col, seed) {
    var r = rng(seed), s = '';
    list.forEach(function (q) {
      var x = q[0], y = q[1], len = q[2], w = q[3] || 6, P = [[x, y]], steps = 6;
      for (var i = 1; i <= steps; i++) P.push([x + Math.sin(i * 1.3 + r() * 2) * len * 0.06, y + len * i / steps]);
      var d = smooth(P);
      s += stroke(d, col, w, { opacity: 0.95 }) + stroke(smooth(P.slice(Math.floor(steps / 2))), col, w * 0.6);
      if (r() < 0.8) {
        var b = P[2 + Math.floor(r() * 3)], dir = r() < 0.5 ? -1 : 1;
        s += stroke('M' + n(b[0]) + ' ' + n(b[1]) + 'q' + n(dir * len * 0.12) + ' ' + n(len * 0.1) + ' ' + n(dir * len * 0.18) + ' ' + n(len * 0.3), col, w * 0.45);
      }
    });
    return s;
  }

  function drawStash(S, L) {
    var o = S.opts, back = '', over = '', front = '', r = rng(L.seed), i;
    S.weatherClip = S.clip('trnorain', rect(0, 0, 0, 0, '#fff'));
    // the earth all round, and the chamber in it
    back += rect(-10, -10, 1620, 1020, COL.solid);
    var C = L.room, roof = smooth(C.roof), d = roof + 'L' + n(C.roof[C.roof.length - 1][0]) + ' 1010L' + n(C.roof[0][0]) + ' 1010Z';
    back += path(d, S.linU([[0, COL.wallDark], [0.45, COL.wall], [1, COL.wallDark]], 0, C.roofY, 0, C.floor));
    // texture on the back wall: pebbles and streaks
    var peb = '', str = '';
    for (i = 0; i < 26; i++) { var px = r() * 1600, py = lineAt(C.roof, px) + 30 + r() * (C.floor - lineAt(C.roof, px) - 40); peb += blob(px, py, 4 + r() * 8, 3 + r() * 5, 7, r, 0.3, 0.25); }
    for (i = 0; i < 18; i++) { var sx = r() * 1600, sy = lineAt(C.roof, sx) + 20 + r() * 200; str += 'M' + n(sx) + ' ' + n(sy) + 'q' + n(20 + r() * 30) + ' ' + n(4) + ' ' + n(50 + r() * 60) + ' ' + n(-2); }
    back += path(peb, COL.wallLight, { opacity: 0.35 }) + stroke(str, COL.wallDark, 3, { opacity: 0.5 });
    // the floor: earth pressed smooth by little feet
    back += path('M-20 ' + n(C.floor) + 'Q800 ' + n(C.floor - 18) + ' 1620 ' + n(C.floor + 6) + 'V1020H-20Z', S.linU([[0, COL.floorLight], [0.4, COL.floor], [1, mix(COL.floor, COL.solid, 0.5)]], 0, C.floor - 20, 0, 1000));
    // the left wall, seen slantwise, and the mouth in it: the moonlit night outside, round where a cat
    // come in from it has her head and shoulders; the moonlight coming in through it
    if (C.mouth) {
      var M = C.mouth;
      back += path(lumpy([[-40, lineAt(C.roof, 0) + 10], [M.wall, lineAt(C.roof, M.wall) + 30], [M.wall + 30, C.floor - 40], [M.wall - 20, 1020], [-40, 1020]], 0.06), S.linU([[0, COL.wallDark], [1, mix(COL.wall, COL.wallLight, 0.2)]], -40, 0, M.wall, 0));
      back += ell(M.cx, M.cy, M.rx * 1.08, M.ry * 1.05, COL.wallDark);
      back += g(ell(M.cx, M.cy, M.rx, M.ry, S.radU([[0, mix(COL.moonLight, COL.outside, 0.35)], [0.75, COL.outside], [1, mix(COL.outside, COL.wall, 0.4)]], M.cx - M.rx * 0.3, M.cy - M.ry * 0.3, M.ry * 1.2)) +
        // the grass outside, dark against the moonlit sky
        path('M' + n(M.cx - M.rx) + ' ' + n(M.cy + M.ry * 0.5) + 'Q' + n(M.cx) + ' ' + n(M.cy + M.ry * 0.3) + ' ' + n(M.cx + M.rx) + ' ' + n(M.cy + M.ry * 0.45) + 'V' + n(M.cy + M.ry) + 'H' + n(M.cx - M.rx) + 'Z', COL.bankLow, { 'clip-path': S.clip('trmouth', ell(M.cx, M.cy, M.rx, M.ry, '#fff')) }), { 'data-art': 'mouth' });
      back += stroke('M' + n(M.cx - M.rx * 0.2) + ' ' + n(M.cy - M.ry) + 'A' + n(M.rx) + ' ' + n(M.ry) + ' 0 0 1 ' + n(M.cx + M.rx) + ' ' + n(M.cy + M.ry * 0.2), COL.moonLight, 6, { opacity: 0.5 });
    }
    if (C.shaft) {
      var Sh = C.shaft;
      back += poly(Sh, S.linU([[0, COL.moonLight, 0.26], [1, COL.moonLight, 0]], Sh[0][0], Sh[0][1], Sh[2][0], Sh[2][1]), { 'data-art': 'moonlight' });
    }
    // roots in the roof
    back += roots(L.roots, COL.root, L.seed + 3) + path(roof + 'L1620 -20L-20 -20Z', COL.solid) + stroke(roof, COL.wallLight, 5, { opacity: 0.35 });
    // the prey and the glass
    var heap = null;
    if (L.rows) {
      var pr = preyRows(S, L.rows, L.seed + 40);
      back += g(pr.svg, { filter: S.shadow('s') });
      pr.boxes.forEach(function (b) { keepBox(S, b); });
    }
    if (L.heap) {
      heap = glassHeap(S, L.heap);
      back += heap.svg;
      keepBox(S, heap.box);
      if (o.tap === 'glass' && heap.small && L.tapGlass) front += tapRect(S, 'glass', heap.small);
    }
    var c;
    if ((c = who(S, 'stash-in'))) S.covers['stash-in'] = rimCover(S, castEst(S, c.m, c.a), c.a, L.seed + 70);
    // `near`: the corner of her face at the left edge, drawn bigger than the panel. Leaning in or sitting
    // up, her head point lands at the same place (L.nearHead), inside the panel and clear of the heap, so the
    // spot moves for this panel (scenes.js reads S.spots after the draw, as the hollow's heap does)
    if (L.nearHead && (c = who(S, 'near'))) {
      var e = castEst(S, c.m, c.a);
      if (e.drawn) (S.spots = S.spots || {}).near = A(c.a.x + L.nearHead[0] - e.point[0], c.a.y + L.nearHead[1] - e.point[1], c.a.h, c.a.face, { elev: true });
    }
    return { back: back, over: over, front: front };
  }
  // The mouth's rim over a cat come in from it: all of her behind her shoulders (her head, shoulders
  // and forepaws in the chamber), the earth of the wall round the mouth, its edge catching the moonlight.
  function rimCover(S, est, a, seed) {
    var bb = est.body, w = bb[2] - bb[0], hgt = bb[3] - bb[1], dir = est.face === 'left' ? -1 : 1, m = Math.max(10, w * 0.06), r = rng(seed);
    var back = dir > 0 ? bb[0] : bb[2], cut = back + dir * w * 0.4, xb = back - dir * m * 2, yt = bb[1] - m * 2, yb = Math.max(bb[3], a.y) + m;
    var P = [[xb, yb], [xb, yt]], k = 4;
    for (var i = 1; i <= k; i++) P.push([lerp(xb, cut - dir * m, i / k), yt - r() * m]);
    P.push([cut + dir * hgt * 0.06, lerp(yt, yb, 0.35)], [cut + dir * hgt * 0.03, lerp(yt, yb, 0.75)], [cut, yb]);
    var d = lumpy(P, 0.12), edge = smooth([[cut - dir * m, yt - m * 0.4], [cut + dir * hgt * 0.06, lerp(yt, yb, 0.35)], [cut + dir * hgt * 0.03, lerp(yt, yb, 0.75)], [cut, yb]]);
    var s = path(d, S.linU([[0, COL.wallDark], [1, mix(COL.wall, COL.wallLight, 0.15)]], xb, 0, cut, 0)) + stroke(edge, COL.moonLight, Math.max(3, hgt * 0.025), { opacity: 0.6 }) +
      roots([[lerp(xb, cut, 0.55), yt, hgt * 0.4, Math.max(3, hgt * 0.025)], [lerp(xb, cut, 0.85), yt, hgt * 0.28, Math.max(2.5, hgt * 0.02)]], COL.rootDark, seed);
    return g(s, { 'data-part': 'cover-rim', 'data-box': boxAttr([Math.min(xb, cut), yt, Math.max(xb, cut), yb]), 'data-cut': n(cut) });
  }

  // ------------------------------------------------------------------ the tunnel

  function tubeBack(S, L, seed) {
    var r = rng(seed), s = '', i, R = L.roof, F = L.floor;
    s += rect(-10, -10, 1620, 1020, COL.solid);
    var d = smooth(R) + 'L1640 ' + n(F + 40) + 'L-40 ' + n(F + 40) + 'Z';
    s += path(d, S.linU([[0, COL.wallDark], [0.5, COL.wall], [1, mix(COL.wall, COL.wallLight, 0.3)]], 0, lineAt(R, 800), 0, F));
    var peb = '', str = '';
    for (i = 0; i < 30; i++) { var px = r() * 1600, py = lineAt(R, px) + 20 + r() * Math.max(10, F - lineAt(R, px) - 40); peb += blob(px, py, 4 + r() * 7, 3 + r() * 4, 7, r, 0.3, 0.25); }
    for (i = 0; i < 14; i++) { var sx = r() * 1600, sy = lineAt(R, sx) + 30 + r() * 160; str += 'M' + n(sx) + ' ' + n(sy) + 'q' + n(30 + r() * 30) + ' 5 ' + n(70 + r() * 60) + ' -2'; }
    s += path(peb, COL.wallLight, { opacity: 0.3 }) + stroke(str, COL.wallDark, 3, { opacity: 0.45 });
    return s;
  }
  // The earth over the tunnel: solid and dark all the way up (no lighter bands in it, which read as a far cave
  // wall with open air over her), a few stones set in it, faint, and short roots in it just above the roof, running
  // down to the lip; along the roof line a clear lip of earth. So the lighter band between the roof and the floor
  // reads as a tunnel just taller than she is, with the solid ground over it (the final review, 2026-10-24).
  function earthAbove(S, R, seed) {
    var r = rng(seed), s = '', i, st = '', rt = '';
    s += path(smooth(R) + 'L1640 -20L-40 -20Z', S.linU([[0, mix(COL.solid, '#000000', 0.3)], [1, COL.solid]], 0, 0, 0, lineAt(R, 800)));
    for (i = 0; i < 40; i++) {
      var sx = r() * 1600, top = lineAt(R, sx) - 24, sy = r() * top;
      if (sy > top - 10) continue;
      st += blob(sx, sy, 6 + r() * 16, 4 + r() * 9, 8, r, 0.3, 0.25);
    }
    s += path(st, mix(COL.solid, COL.wallDark, 0.6), { opacity: 0.7 });
    for (i = 0; i < 9; i++) {
      var rx = 60 + r() * 1480, end = lineAt(R, rx), start = end - 70 - r() * 80, P2 = [[rx + (r() - 0.5) * 30, start]];
      for (var j = 1; j <= 4; j++) P2.push([rx + Math.sin(j * 1.7 + r() * 3) * 12, lerp(start, end, j / 4)]);
      rt += smooth(P2);
    }
    s += stroke(rt, COL.rootDark, 5, { opacity: 0.5 });
    // the lip: a band of earth along the roof line, its edge catching the faint light
    s += stroke(smooth(R), mix(COL.solid, COL.wallDark, 0.5), 22, { 'data-art': 'lip' });
    return g(s, { 'data-art': 'earth' });
  }
  // tiny prints along a floor, both ways
  function floorPrints(x0, x1, y, pr, seed, yAt) {
    var r = rng(seed), d = '';
    for (var lane = 0; lane < 2; lane++) {
      var dir = lane ? -1 : 1, yy = y + (lane ? pr * 5 : -pr * 2);
      for (var x = x0 + r() * 30; x < x1; x += pr * (5 + r() * 2)) {
        var yv = (yAt ? yAt(x) : 0) + yy + ((x / pr | 0) % 2 ? pr * 1.3 : -pr * 1.3);
        d += printD(x, yv, pr, dir > 0 ? 0 : Math.PI);
      }
    }
    return d;
  }

  function drawCrawl(S, L) {
    var o = S.opts, back = '', over = '', front = '', F = L.floor;
    S.weatherClip = S.clip('trnorain', rect(0, 0, 0, 0, '#fff'));
    back += tubeBack(S, L, L.seed);
    // the floor: soft earth, tiny prints going both ways (faint, always there)
    back += path('M-20 ' + n(F - 8) + 'Q500 ' + n(F - 20) + ' 900 ' + n(F - 10) + 'T1620 ' + n(F - 14) + 'V1020H-20Z', S.linU([[0, COL.floorLight], [0.2, COL.floor], [1, COL.solid]], 0, F - 20, 0, 1000));
    back += g(path(floorPrints(30, 1580, F + 16, L.print, L.seed + 5), COL.print, { opacity: 0.45 }), { 'data-art': 'prints' });
    // the roof and the earth above it, roots hanging
    back += roots(L.roots, COL.root, L.seed + 9);
    back += earthAbove(S, L.roof, L.seed + 13);
    back += stroke(smooth(L.roof), COL.wallLight, 6, { opacity: 0.35 });
    // the roots she touches at crawl-1 (the roof Tap): down to her raised forepaw
    back += g(roots(L.pawRoots, mix(COL.root, COL.moonLight, 0.15), L.seed + 11), { 'data-art': 'paw-roots' });
    var c = who(S, 'crawl-2');
    if (o.tight === true && c) S.covers['crawl-2'] = tightCover(S, castEst(S, c.m, c.a), c.a, L);
    return { back: back, over: over, front: front };
  }
  // The tunnel narrows at crawl-2: a collar of earth from the roof to the floor, over the back half of
  // whoever is there (her front half through), roots hanging over its edge.
  function tightCover(S, est, a, L) {
    var bb = est.body, w = bb[2] - bb[0], hgt = bb[3] - bb[1], dir = est.face === 'left' ? -1 : 1, m = Math.max(10, w * 0.06), r = rng(L.seed + 23);
    var back = dir > 0 ? bb[0] : bb[2], cut = back + dir * w * 0.5, xb = back - dir * m * 3, yt = Math.min(lineAt(L.roof, cut) - 40, bb[1] - m), yb = 1020;
    var P = [[xb, yb], [xb, yt], [cut - dir * m, yt], [cut + dir * hgt * 0.16, lerp(yt, bb[1], 0.6)], [cut + dir * hgt * 0.06, bb[1] + hgt * 0.2],
      [cut + dir * hgt * 0.1, lerp(bb[1], bb[3], 0.6)], [cut + dir * hgt * 0.14, Math.max(bb[3], a.y) - hgt * 0.05], [cut + dir * hgt * 0.05, yb]];
    var d = lumpy(P, 0.1), edge = smooth(P.slice(2)), clods = '';
    for (var i = 0; i < 6; i++) clods += blob(lerp(xb, cut, 0.3 + r() * 0.6), lerp(yt + 40, yb - 80, r()), hgt * (0.05 + r() * 0.05), hgt * (0.03 + r() * 0.03), 7, r, 0.3, 0.25);
    var s = path(d, S.linU([[0, COL.solid], [1, mix(COL.wallDark, COL.wall, 0.3)]], xb, 0, cut, 0)) + path(clods, COL.wallLight, { opacity: 0.3 }) +
      stroke(edge, COL.wallLight, Math.max(3, hgt * 0.03), { opacity: 0.75 }) +
      roots([[cut + dir * hgt * 0.1, bb[1] - m, hgt * 0.5, Math.max(3, hgt * 0.03)], [cut + dir * hgt * 0.13, lerp(bb[1], bb[3], 0.35), hgt * 0.35, Math.max(2.5, hgt * 0.022)]], COL.root, L.seed + 21);
    return g(s, { 'data-part': 'cover-tight', 'data-box': boxAttr([Math.min(xb, cut), yt, Math.max(xb, cut), yb]), 'data-cut': n(cut) });
  }

  // The fork: looking along the tunnel to where it splits. A small cat's way (the brief): the roof low over
  // her ears, the earth close all round, and at the far wall two ways on, small burrow mouths flat on the
  // floor (doorways, never round eyes), unequal and offset, each in a rim of dug earth of its own, with a
  // root hanging between them that ends well above her ears. Nothing in it looks back at her.
  function drawFork(S, L) {
    var o = S.opts, back = '', over = '', front = '', F = L.floor, R = L.roof;
    S.weatherClip = S.clip('trnorain', rect(0, 0, 0, 0, '#fff'));
    // the tunnel's inside, earth walls lit a little toward the middle
    back += rect(-10, -10, 1620, 1020, S.radU([[0, mix(COL.wall, COL.wallLight, 0.15)], [0.65, COL.wall], [1, COL.wallDark]], L.glow[0], L.glow[1], L.glow[2]));
    // the far wall, where it splits: a band of earth a little darker than the walls, lumpy along its foot
    back += path(blob(L.far.cx, L.far.cy, L.far.rx, L.far.ry, 16, rng(L.seed + 1), 0.1, 0.14), mix(COL.wall, COL.wallDark, 0.35), { opacity: 0.7 });
    // the floor: soft earth, pressed by tiny feet into both ways
    back += path('M-40 ' + n(F + 30) + 'Q420 ' + n(F - 6) + ' 800 ' + n(F - 10) + 'T1640 ' + n(F + 40) + 'V1020H-40Z', S.linU([[0, COL.floor], [0.5, mix(COL.floor, COL.floorLight, 0.4)], [1, COL.floor]], 0, F - 10, 0, 1000));
    // the two ways on: small, unequal, each in its own rim of dug earth
    var ways = '';
    L.ways.forEach(function (H, j) { ways += wayMouth(S, H, L.seed + 20 + j * 7); });
    back += g(ways, { 'data-art': 'ways' });
    var pd = '';
    L.ways.forEach(function (H, j) {
      var x0 = H.cx, y0 = H.base - 4, x1 = j ? 1250 : 330, y1 = 990, steps = 7;
      for (var i = 0; i < steps; i++) {
        var t = i / (steps - 1), pr = L.print * lerp(0.6, 1.3, t), x = lerp(x0, x1, t) + (i % 2 ? 1 : -1) * pr * 2, y = lerp(y0, y1, t);
        pd += printD(x, y, pr, Math.atan2(y0 - y1, x0 - x1) + (i % 3 === 0 ? Math.PI : 0));
      }
    });
    back += g(path(pd, COL.print, { opacity: 0.45 }), { 'data-art': 'prints' });
    // the earth over the roof, close above her: the roof low, coming down to the floor at both sides
    back += earthAbove(S, R, L.seed + 13);
    back += stroke(smooth(R), COL.wallLight, 6, { opacity: 0.35 });
    back += roots(L.roots.map(function (q) { return [q[0], lineAt(R, q[0]) - 4, q[1], q[2]]; }), COL.root, L.seed + 6);
    // the root between the two ways: thick at the roof, twisting down and tapering to a tip well above her ears
    var Rt = L.root, top = lineAt(R, Rt.x) - 20, Y = function (t) { return lerp(top, Rt.y1, t); };
    var rd = K.taper([Rt.x + Rt.w * 0.5, top], [Rt.x - Rt.w * 1.3, Y(0.4)], [Rt.x + Rt.w * 1.1, Y(0.75)], [Rt.x - Rt.w * 0.4, Rt.y1], Rt.w * 2.2, Rt.w * 0.25, 16);
    var tw = K.taper([Rt.x - Rt.w * 0.6, Y(0.3)], [Rt.x - Rt.w * 2, Y(0.36)], [Rt.x - Rt.w * 2.7, Y(0.5)], [Rt.x - Rt.w * 3.1, Y(0.66)], Rt.w * 0.5, 1.5, 10) +
      K.taper([Rt.x + Rt.w * 0.4, Y(0.55)], [Rt.x + Rt.w * 1.6, Y(0.6)], [Rt.x + Rt.w * 2.3, Y(0.72)], [Rt.x + Rt.w * 2.6, Y(0.86)], Rt.w * 0.4, 1.5, 10);
    back += g(path(rd + tw, COL.rootDark) + stroke(smooth([[Rt.x + Rt.w * 0.1, top + 10], [Rt.x - Rt.w * 0.8, Y(0.4)], [Rt.x + Rt.w * 0.6, Y(0.72)], [Rt.x - Rt.w * 0.3, Rt.y1 - 14]]), COL.root, Rt.w * 0.4, { opacity: 0.85 }), { filter: S.shadow('s'), 'data-art': 'root' });
    // `worm: true`: one pink worm poking out of the left way's wall, just in front of her nose as she sniffs it
    if (o.worm === true) back += worm(L.worm);
    return { back: back, over: over, front: front };
  }
  // A way on: an arch flat on the floor, deep blue-grey inside (never black), in a lumpy rim of dug earth
  // a little darker than the wall (a recess, not a lit ring), only its top edge catching the light, two thin
  // roots hanging over it.
  function wayMouth(S, H, seed) {
    var r = rng(seed), cx = H.cx, cy = H.cy, rx = H.rx, ry = H.ry, base = H.base, s = '';
    s += path(mound(cx - rx * 1.5, cx + rx * 1.4, base + 8, cy - ry * 1.45, 11, r, 0.24, 0.16, 0.3), mix(COL.wall, COL.wallDark, 0.55));
    s += path(mound(cx - rx * 1.26, cx + rx * 1.2, base + 4, cy - ry * 1.2, 11, r, 0.22, 0.14, 0.3), mix(COL.wall, COL.wallDark, 0.25));
    var d = 'M' + n(cx - rx) + ' ' + n(base) + 'V' + n(cy) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 1 ' + n(cx + rx) + ' ' + n(cy) + 'V' + n(base) + 'Z';
    s += path(d, S.radU([[0, COL.holeDeep], [0.7, COL.holeIn], [1, mix(COL.holeIn, COL.wall, 0.45)]], cx, base - ry * 0.2, Math.max(rx, ry) * 1.25));
    s += stroke('M' + n(cx - rx * 0.96) + ' ' + n(cy - ry * 0.25) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 1 ' + n(cx + rx * 0.96) + ' ' + n(cy - ry * 0.25), COL.wallLight, 3, { opacity: 0.3 });
    // the floor running in, pressed smooth
    s += ell(cx, base - 3, rx * 0.9, ry * 0.1, mix(COL.floor, COL.holeIn, 0.5));
    s += roots([[cx - rx * 0.35, cy - ry * 1.12, ry * 0.55, 3], [cx + rx * 0.45, cy - ry * 1.05, ry * 0.4, 2.4]], COL.rootDark, seed + 3);
    return s;
  }
  function worm(W) {
    var dir = W.dir || 1, s = W.s, P = [[W.x, W.y], [W.x + dir * s * 0.5, W.y - s * 0.25], [W.x + dir * s * 0.95, W.y + s * 0.05], [W.x + dir * s * 1.3, W.y - s * 0.3], [W.x + dir * s * 1.55, W.y - s * 0.12]];
    var d = smooth(P), rings = '';
    for (var i = 1; i < 6; i++) {
      var t = i / 6, q = [lerp(P[0][0], P[4][0], t), lerp(P[0][1], P[4][1], t) + Math.sin(t * Math.PI * 2) * s * 0.05];
      rings += 'M' + n(q[0] - 1) + ' ' + n(q[1] - s * 0.07) + 'l2 ' + n(s * 0.14);
    }
    return g(ell(W.x, W.y, s * 0.22, s * 0.15, COL.wallDark) + ell(W.x, W.y, s * 0.16, s * 0.1, COL.holeDeep) + stroke(d, COL.wormDark, s * 0.2) + stroke(d, COL.worm, s * 0.15) + stroke(rings, COL.wormDark, Math.max(1, s * 0.025), { opacity: 0.6 }) +
      stroke(d, '#FFFFFF', s * 0.035, { opacity: 0.35, transform: 'translate(0 ' + n(-s * 0.04) + ')' }), { 'data-art': 'worm' });
  }

  // ------------------------------------------------------------------ the compositions

  var BANK = {
    // wide: the whole bank, from the tall weeds at its foot to the rails on top
    main: {
      seed: 801, sky: 420,
      moon: { x: 1290, y: 150, r: 34, dx: -10, dy: -12, dr: 4, rmax: 60 },
      towers: [
        { x: -24, w: 104, top: 262, base: 396, far: 0.86, cap: 'step' }, { x: 92, w: 66, top: 312, base: 396, far: 0.9, cap: 'round' },
        { x: 1452, w: 82, top: 286, base: 396, far: 0.9 }, { x: 1530, w: 100, top: 246, base: 396, far: 0.86, cap: 'slant' }
      ],
      track: { x0: -40, x1: 1640, y: [372, 366], gap: 16, bed: [9, 8], shoulder: 24, step: 28, sleeper: 7, rail: 5, glow: 12, stones: 60, pebble: 2.4, seed: 811 },
      bank: { top: [[-40, 404], [400, 398], [800, 402], [1200, 396], [1640, 400]], foot: [[-40, 778], [300, 774], [700, 770], [1100, 762], [1640, 756]], rim: 4, tufts: 70, tuft: 1.6 },
      holes: [
        { id: 'tunnel', kind: 'tunnel', cx: 262, cy: 724, rx: 82, ry: 66, base: 776, seed: 821, print: 2.6 },
        { id: 'little', cx: 930, cy: 646, rx: 34, ry: 24, seed: 822 },
        { id: 'second', cx: 1046, cy: 588, rx: 30, ry: 21, seed: 823 },
        { id: 'big', cx: 1206, cy: 664, rx: 54, ry: 39, seed: 824 },
        { id: 'high-1', cx: 640, cy: 486, rx: 30, ry: 21, seed: 825 },
        { id: 'high-2', cx: 1424, cy: 474, rx: 28, ry: 20, seed: 826 }
      ],
      print: 2.4,
      // [x0, x1, base, tall, gap, blade width]: along the foot, the main bed between the tunnel and the holes
      weeds: [[-30, 150, 784, 196, 6, 2.6, 60], [384, 872, 780, 236, 5.5, 2.8, 80], [1296, 1640, 766, 206, 6, 2.6, 60]],
      weedsTap: { x: 384, y: 540, w: 488, h: 244 },
      ground: { y: 760, tufts: 60, tuft: 1.8 },
      near: [-20, 1620, 985, 1000, 40, 2.6]
    },
    // hide: at cat height in the weeds, looking up the bank
    hide: {
      seed: 831, sky: 196,
      moon: { x: 1460, y: 120, r: 26, dx: -6, dy: -10, dr: 3, rmax: 46 },
      track: { x0: -40, x1: 1640, y: [190, 184], gap: 20, bed: [11, 10], shoulder: 30, step: 36, sleeper: 9, rail: 6, glow: 14, stones: 70, pebble: 3, seed: 841 },
      bank: { top: [[-40, 226], [500, 220], [1100, 224], [1640, 218]], foot: [[-40, 1010], [1640, 1010]], rim: 5, tufts: 90, tuft: 2.4 },
      holes: [
        { id: 'little', cx: 640, cy: 560, rx: 56, ry: 39, seed: 851 },
        { id: 'second', cx: 828, cy: 452, rx: 48, ry: 33, seed: 852 },
        { id: 'big', cx: 1080, cy: 612, rx: 86, ry: 61, seed: 853 },
        { id: 'high-1', cx: 330, cy: 380, rx: 40, ry: 28, seed: 854 },
        { id: 'high-2', cx: 1360, cy: 372, rx: 38, ry: 26, seed: 855 }
      ],
      print: 3.6,
      weeds: [[-30, 1640, 1012, 236, 6, 4.4, 120]],
      near: null
    },
    // holes: close on the bank's face at weasel height
    holes: {
      seed: 861, sky: 0,
      bank: { top: [[-40, -20], [1640, -20]], foot: [[-40, 1020], [1640, 1020]], rim: 0, tufts: 120, tuft: 3.2 },
      holes: [
        { id: 'little', cx: 420, cy: 556, rx: 80, ry: 56, seed: 871 },
        { id: 'second', cx: 716, cy: 352, rx: 70, ry: 48, seed: 872 },
        { id: 'big', cx: 1160, cy: 636, rx: 100, ry: 70, seed: 873 }
      ],
      print: 7,
      weeds: [[-40, 270, 1012, 540, 6, 5, 200]],
      near: [1250, 1620, 980, 1000, 14, 4]
    },
    // brag: low, up the bank from beside the holes; the rails along the crest
    brag: {
      seed: 881, sky: 600,
      moon: { x: 1100, y: 250, r: 52, dx: -10, dy: -16, dr: 6, rmax: 92 },
      track: { x0: -40, x1: 1640, y: [566, 560], gap: 12, bed: [8, 14], shoulder: 26, step: 52, sleeper: 16, rail: 9, glow: 20, stones: 60, pebble: 4, seed: 891 },
      bank: { top: [[-40, 594], [400, 588], [800, 592], [1200, 586], [1640, 590]], foot: [[-40, 1020], [1640, 1020]], rim: 6, tufts: 70, tuft: 3.4 },
      holes: [
        { id: 'little', cx: 120, cy: 900, rx: 92, ry: 64, seed: 901 },
        { id: 'second', cx: 1500, cy: 910, rx: 86, ry: 60, seed: 902 }
      ],
      print: 6,
      weeds: [],
      near: null
    }
  };
  // the holes the anchors stand at, by camera
  function holeOf(L, id) { for (var i = 0; i < L.holes.length; i++) if (L.holes[i].id === id) return L.holes[i]; return null; }
  BANK.main.holeAt = { 'hole-1': holeOf(BANK.main, 'little'), 'hole-2': holeOf(BANK.main, 'second') };
  BANK.hide.holeAt = { 'hole-1': holeOf(BANK.hide, 'little'), 'hole-2': holeOf(BANK.hide, 'second') };
  BANK.holes.holeAt = { 'hole-1': holeOf(BANK.holes, 'little'), 'hole-2': holeOf(BANK.holes, 'second') };
  BANK.holes.stashHole = holeOf(BANK.holes, 'big');
  BANK.brag.holeAt = {};

  var STASH = {
    stash: {
      seed: 911,
      room: { roof: [[-20, 330], [300, 190], [800, 132], [1300, 170], [1620, 300]], roofY: 132, floor: 626,
        mouth: { cx: 236, cy: 628, rx: 150, ry: 178, wall: 420 },
        shaft: [[330, 470], [372, 790], [1240, 900], [800, 900]] },
      roots: [[420, 200, 120, 7], [560, 170, 90, 5], [760, 140, 150, 8], [980, 145, 110, 6], [1180, 165, 140, 7], [1390, 210, 90, 5]],
      rows: [
        { x: 556, y: 660, step: 86, k: 0.74, count: 6, mud: [1, 4] },
        { x: 528, y: 748, step: 100, k: 0.88, count: 6, mud: [0, 3, 5] }
      ],
      heap: { x0: 1130, x1: 1540, base: 790, top: 500, k: 54, count: 46, glints: 10, seed: 921, small: { x: 1140, y: 812, s: 24 } },
      tapGlass: true
    },
    'stash-close': {
      seed: 931,
      room: { roof: [[-20, 120], [800, 60], [1620, 110]], roofY: 60, floor: 900,
        shaft: [[-20, 60], [-20, 380], [1500, 1000], [1000, 1000]] },
      roots: [[300, 80, 160, 9], [900, 60, 120, 7], [1400, 90, 150, 8]],
      rows: null,
      heap: { x0: 600, x1: 1640, base: 900, top: 300, k: 130, count: 30, glints: 8, seed: 941, big: { x: 1020, y: 980, w: 520, h: 400 } },
      // where her head point goes, whatever her pose
      nearHead: [64, 724]
    }
  };
  var TUNNEL = {
    crawl: {
      seed: 951, floor: 884, print: 5,
      // the roof just clears a sitting cat's ears at crawl-1 (x 980), lower behind her toward crawl-2
      roof: [[-40, 640], [200, 630], [520, 604], [800, 558], [1000, 544], [1240, 546], [1640, 586]],
      roots: [[90, 632, 60, 6], [330, 616, 80, 6], [600, 596, 64, 5], [760, 570, 50, 4], [1300, 552, 110, 7], [1470, 566, 90, 6]],
      // where her raised forepaw (pawup, at crawl-1, at her cheek) touches them: just in front of her face,
      // down to the paw itself
      pawRoots: [[1110, 548, 184, 6], [1126, 548, 176, 5], [1144, 548, 150, 4]]
    },
    fork: {
      seed: 961, floor: 806, print: 5,
      // the roof low, lowest over the split and just over her ears there, coming down to the floor at both
      // sides; not the same each side (the tunnel bends a little), so the picture is no face
      roof: [[-40, 980], [30, 830], [130, 712], [300, 640], [560, 606], [800, 598], [1060, 606], [1300, 640], [1470, 724], [1580, 846], [1660, 990]],
      glow: [820, 780, 1000],
      far: { cx: 790, cy: 730, rx: 560, ry: 110 },
      // the ways: small (about as tall as she is crouched, a little wider), unequal and offset, flat on the
      // floor: the left lower and wider, the right a step up and narrower. cx, cy the arch's centre; base its floor
      ways: [{ cx: 500, cy: 734, rx: 104, ry: 78, base: 808 }, { cx: 1070, cy: 714, rx: 88, ry: 66, base: 786 }],
      // hanging from the roof between them, its tip well above the ears of a cat crouched at fork-1
      root: { x: 792, y1: 650, w: 18 },
      roots: [[170, 60, 5], [340, 50, 4], [1200, 44, 4], [1400, 64, 5]],
      // just in front of her nose (a cat crouched at fork-1 facing left sniffs the left way), out of its wall
      worm: { x: 606, y: 800, s: 66, dir: -1 }
    }
  };

  function draw(S) {
    var c = S.comp;
    if (STASH[c]) return drawStash(S, STASH[c]);
    if (c === 'crawl') return drawCrawl(S, TUNNEL.crawl);
    if (c === 'fork') return drawFork(S, TUNNEL.fork);
    return drawBank(S, BANK[c] || BANK.main);
  }

  var UP = { elev: true };
  art.defineSet('tracks', {
    label: 'the railway bank by the tracks, its weasel holes, and the weasels’ tunnel', tod: 'night', todFixed: 'night', draw: draw,
    cams: {
      wide: { box: [0, 0, 1600] },
      hide: { box: [0, 0, 1600], comp: 'hide' },
      holes: { box: [0, 0, 1600], comp: 'holes' },
      brag: { box: [0, 0, 1600], comp: 'brag' },
      stash: { box: [0, 0, 1600], comp: 'stash' },
      'stash-close': { box: [0, 0, 1600], comp: 'stash-close' },
      crawl: { box: [0, 0, 1600], comp: 'crawl' },
      fork: { box: [0, 0, 1600], comp: 'fork' }
    },
    anchors: {
      // the tunnel's end at the foot (whoever is there wriggling out, facing out); two cats on the
      // ground right of it; a weasel at the little hole and at the second; the fox, small, up on the
      // rails (the holes and the rails are off the ground the depth of a spot of its own is read from)
      main: {
        'tunnel-end': A(270, 790, 226), 'foot-1': A(560, 892, 236), 'foot-2': A(808, 902, 240, 'left'),
        'hole-1': A(930, 670, 150, 'right', UP), 'hole-2': A(1046, 609, 140, 'left', UP),
        rails: A(1000, 368, 110, 'right', UP)
      },
      // two cats deep in the weeds (their feet below the panel), the weasels at their holes up the bank,
      // the fox up on the rails, never bigger than a cat's head down here
      hide: {
        'weeds-1': A(430, 1000, 400), 'weeds-2': A(1180, 1004, 410, 'left'),
        'hole-1': A(640, 599, 190, 'right', UP), 'hole-2': A(828, 485, 180, 'left', UP),
        rails: A(1000, 186, 90, 'right', UP)
      },
      // a weasel at the little hole and at the second (about half a cat's height here), a cat crouched
      // at the biggest with her head at its mouth, and the friend a little way off in the weeds
      holes: {
        'hole-1': A(420, 618, 400, 'right', UP), 'hole-2': A(716, 404, 390, 'right', UP),
        'stash-mouth': A(880, 760, 430), watch: A(150, 930, 330)
      },
      // the fox on the rails at a fox's size beside the weasels, who sit at the bottom corners
      brag: { rails: A(800, 562, 330, 'right', UP), 'slope-1': A(250, 1004, 420), 'slope-2': A(1360, 1004, 420, 'left') },
      // come in from the mouth at the left
      stash: { 'stash-in': A(250, 800, 430) },
      // the corner of her face and a forepaw at the left edge, drawn bigger than the panel (the field's
      // `border-fox` `left`), her head point just inside the panel, clear of the heap
      'stash-close': { near: A(-186, 995, 1150, 'right', UP) },
      // the leader crawling, facing on; behind her at the left, partly out of the panel
      crawl: { 'crawl-1': A(980, 884, 440), 'crawl-2': A(150, 890, 420) },
      // a cat at the split, between the two ways (her nose at the left way's rim when she faces it, at the
      // right way's when she faces that; the root hangs above her ears), and behind her, nearer us at the
      // right, clear of both ways
      fork: { 'fork-1': A(800, 900, 440), 'fork-2': A(1380, 1000, 470, 'left') }
    },
    opts: { moon: 'number', tap: ['none', 'weeds', 'stash', 'glass'], tight: [false, true], worm: [false, true] },
    defaults: { tap: 'none', tight: false, worm: false }
  });

  // For the tests: the geometry of each composition.
  art.tracksInfo = function () {
    var out = {};
    Object.keys(BANK).forEach(function (k) {
      var L = BANK[k], T = L.track;
      out[k] = {
        rails: T ? { y0: Math.min(T.y[0], T.y[1]) - T.gap - T.bed[0], y1: Math.max(T.y[0], T.y[1]) + T.bed[1] + T.shoulder, near: T.y.slice(), gap: T.gap, width: T.rail } : null,
        holes: L.holes.map(function (H) { return { id: H.id, kind: H.kind || 'hole', cx: H.cx, cy: H.cy, rx: H.rx, ry: H.ry }; }),
        holeAt: Object.keys(L.holeAt || {}).reduce(function (o, a) { o[a] = L.holeAt[a].id; return o; }, {}),
        weeds: (L.weeds || []).map(function (W) { return { x0: W[0], x1: W[1], base: W[2], tall: W[3] }; }),
        weedsTap: L.weedsTap ? JSON.parse(JSON.stringify(L.weedsTap)) : null,
        stashTap: L.stashHole ? { x: L.stashHole.cx - L.stashHole.rx, y: L.stashHole.cy - L.stashHole.ry, w: L.stashHole.rx * 2, h: L.stashHole.ry * 2 } : null,
        moon: !!L.moon, sky: L.sky
      };
    });
    Object.keys(STASH).forEach(function (k) {
      var L = STASH[k], H = L.heap;
      out[k] = { heap: { x0: H.x0, x1: H.x1, base: H.base, top: H.top }, rows: (L.rows || []).map(function (R) { return { x: R.x, y: R.y, step: R.step, k: R.k, count: R.count, mud: R.mud.slice() }; }),
        small: H.small ? { x: H.small.x - H.small.s * 1.15, y: H.small.y - H.small.s * 1.05, w: H.small.s * 2.2, h: H.small.s * 1.3 } : null, mouth: L.room.mouth ? JSON.parse(JSON.stringify(L.room.mouth)) : null };
    });
    out.crawl = { roof: TUNNEL.crawl.roof.map(function (q) { return q.slice(); }), floor: TUNNEL.crawl.floor, pawRoots: TUNNEL.crawl.pawRoots.map(function (q) { return { x: q[0], top: q[1], tip: q[1] + q[2] }; }) };
    out.fork = { ways: TUNNEL.fork.ways.map(function (H) { return { cx: H.cx, cy: H.cy, rx: H.rx, ry: H.ry, base: H.base }; }), root: JSON.parse(JSON.stringify(TUNNEL.fork.root)), worm: JSON.parse(JSON.stringify(TUNNEL.fork.worm)),
      roof: TUNNEL.fork.roof.map(function (q) { return q.slice(); }), floor: TUNNEL.fork.floor, roofAt: function (x) { return lineAt(TUNNEL.fork.roof, x); } };
    out.roofAt = function (x) { return lineAt(TUNNEL.crawl.roof, x); };
    return out;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
