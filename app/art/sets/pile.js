/* Potomac Crossing · app/art/sets/pile.js
 *
 * The set: the prey pile in camp (chapter 2), and PC.art.prey, the one piece of prey that both
 * the set and the Counts pictures draw.
 *
 *   pile: a shady corner of camp under a low arch of brambles; the pile sits in the arch's
 *   mouth in neat stacks of two (mice and voles only, soft and round with their tails tucked in;
 *   every eye shut, no blood; CrystalClan doesn't fish); the dry fountain's edge at the right.
 *   Morning by default (the morning after the storm, washed clean); `sunset` is the camp's last
 *   golden light (the old tom guarding the restacked pile).
 *
 *   Cameras (docs/build.md, "Art vocabulary, chapter 2"):
 *     wide   the pile left of centre, Clan cats crowding round, the fountain's edge at the right
 *     low    a medium two-shot at cat height beside the pile, the arch overhead (its own composition)
 *     close  the pile fills the panel (the low composition, close)
 *   Options: pairs 0-10 (default 8), lit 0-10 (the first n stacks glow, back row first, left to
 *   right), dug: true (soft, lumpy, dug-up earth behind the pile), vole: true (one plump vole on
 *   the ground in front of the pile, just right of `pile-left`: the one Tallyheart nudges over, off
 *   the top of the front row's first vole stack, which keeps only its bottom piece).
 *   The stacks (and the vole) are reported in `keep`, one box each, so the lettering stays off the prey.
 *
 *   PC.art.prey({ kind: 'mouse' | 'vole' | 'fish', lit, seed, facing?, part? }) -> { svg, w, h }:
 *   (the pile itself draws no fish; `fish` stays drawable only in case Aron rules to keep a few,
 *   traded from the otters, which the text would then have to say at the pile)
 *   one piece in its own box (0..w, 0..h), resting on the box's bottom centre. It uses no defs and
 *   no ids, so it can be dropped into any SVG. `lit` adds the Counts pictures' warm glow (an outline
 *   halo in #ffb21f / #ffe36e, as cats.js lights a tail, and a little sparkle). `facing` is 'right'
 *   (default) or 'left'. `part` ('glow' | 'body' | 'spark') returns one layer only, for a caller
 *   that stacks pieces and wants every halo behind every body.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});

  // ------------------------------------------------------------------ PC.art.prey (no kit needed)

  var GLOW = '#ffb21f', GLOW2 = '#ffe36e';
  function f1(v) { var r = Math.round(v * 10) / 10; return r === 0 ? '0' : String(r); }
  function prng(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hx(h) { var v = parseInt(String(h).slice(1), 16) || 0; return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; }
  function blend(a, b, t) {
    var A = hx(a), B = hx(b), s = '#';
    for (var i = 0; i < 3; i++) { var x = Math.max(0, Math.min(255, Math.round(A[i] + (B[i] - A[i]) * t))); s += (x < 16 ? '0' : '') + x.toString(16); }
    return s;
  }
  function pth(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function lin(d, col, w, extra) {
    return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + f1(w) + '" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/>';
  }
  function op(v) { return ' opacity="' + v + '"'; }
  function sparkle(x, y, r) {
    var k = r * 0.2;
    return '<path d="M' + f1(x) + ' ' + f1(y - r) + 'Q' + f1(x + k) + ' ' + f1(y - k) + ' ' + f1(x + r) + ' ' + f1(y) + 'Q' + f1(x + k) + ' ' + f1(y + k) + ' ' +
      f1(x) + ' ' + f1(y + r) + 'Q' + f1(x - k) + ' ' + f1(y + k) + ' ' + f1(x - r) + ' ' + f1(y) + 'Q' + f1(x - k) + ' ' + f1(y - k) + ' ' + f1(x) + ' ' + f1(y - r) +
      'Z" fill="#fffbe8" stroke="#eea20c" stroke-width="1.6" stroke-linejoin="round"/>';
  }

  // Each piece is drawn facing right in its own frame (bw x bh), resting on y = bh; the box adds a
  // margin M on the left, right and top for the glow.
  var M = 12;
  var PREY = {
    mouse: {
      bw: 110, bh: 64,
      body: 'M10 64C2 50 4 22 26 12C40 5 62 4 76 14C86 21 94 31 101 44Q106 52 106 57Q104 64 92 64Z',
      ears: [[58, 12, 10], [71, 15, 12.5]],
      fur: '#AE998A', dark: '#8C7666', belly: '#F2E6D6', inner: '#F2B6B4', nose: '#E58C9C', tail: '#D7A39C',
      draw: function (c) {
        // a cream chest, the haunch, and the tail curled round it (tucked in)
        return pth('M68 64Q68 50 82 46Q97 45 102 55Q103 64 92 64Z', c.belly) +
          lin('M20 63Q20 46 36 42Q50 41 56 54', c.dark, 2.4, op('.4')) +
          lin('M10 58Q0 42 14 33Q28 26 34 37Q38 46 29 48', c.tail, 3.6) +
          pth('M78 64Q79 58 85 58Q90 59 89 64ZM88 64Q89 58 95 58Q99 60 98 64Z', c.inner) +
          lin('M83 30Q88 35 93 30', '#3B2C27', 2.8) +
          '<circle cx="105" cy="55" r="3.8" fill="' + c.nose + '"/>' +
          lin('M100 51L114 46M100 54L115 55', '#FFFFFF', 1.2, op('.75'));
      }
    },
    vole: {
      bw: 106, bh: 64,
      body: 'M8 64C0 46 8 16 36 10C60 4 86 12 98 32C104 42 106 52 102 58Q98 64 88 64Z',
      ears: [[70, 13, 7]],
      fur: '#8E6448', dark: '#6E4C36', belly: '#E3C59E', inner: '#C99480', nose: '#B8707C', tail: '#6E4C36',
      draw: function (c) {
        return pth('M64 64Q64 50 78 46Q93 45 99 54Q100 64 90 64Z', c.belly) +
          lin('M18 63Q18 46 34 42Q48 41 54 54', c.dark, 2.4, op('.45')) +
          lin('M10 55Q1 55 2 62', c.tail, 4.4) +
          lin('M30 22l6 -4M42 16l6 -3M56 13l6 -1M22 32l5 -5', c.dark, 2.2, op('.55')) +
          pth('M76 64Q77 58 83 58Q88 59 87 64ZM86 64Q87 58 93 58Q97 60 96 64Z', c.inner) +
          lin('M80 31Q85 36 90 31', '#3B2C27', 2.8) +
          '<circle cx="101" cy="51" r="3.6" fill="' + c.nose + '"/>' +
          lin('M97 48L110 44M97 52L111 53', '#F4E8DA', 1.2, op('.7'));
      }
    },
    fish: {
      bw: 140, bh: 46,
      body: 'M28 26C44 6 96 0 124 18C134 24 136 30 128 34C104 50 54 50 28 30Z',
      // the fish's tail and dorsal fin are shapes (`tailPath`, `fin`); a mouse's or vole's `tail` is a colour
      tailPath: 'M31 27C21 22 11 10 2 6C8 18 8 32 2 44C12 40 22 32 31 30Z',
      fin: 'M64 8Q78 -2 94 6L90 10Z',
      fur: '#C5D2DE', dark: '#6F8AA6', belly: '#EEF3F8', inner: '#9FB3C6', nose: '#8DA2B8', tail2: '#9FB3C6',
      draw: function (c) {
        return pth('M28 26C44 6 96 0 124 18C127 20 130 22 131 25C100 17 60 17 28 27Z', c.dark) +
          pth('M31 32C56 46 102 46 127 34C104 41 60 41 31 32Z', c.belly) +
          lin('M50 24C70 20 96 20 114 24', '#FFFFFF', 3, op('.65')) +
          lin('M44 30C64 33 92 33 112 30', c.nose, 1.2, op('.6')) +
          lin('M54 27a4 3 0 0 1 7 0M64 26a4 3 0 0 1 7 0M74 26a4 3 0 0 1 7 0M59 31a4 3 0 0 1 7 0M69 31a4 3 0 0 1 7 0', '#FFFFFF', 1.1, op('.5')) +
          pth('M96 34Q88 42 80 41Q86 34 96 32Z', c.inner) +
          lin('M108 15Q101 27 109 38', c.nose, 2) +
          lin('M114 21Q118 25 123 21', '#2F3A48', 2.6) +
          lin('M131 28L135 29', '#2F3A48', 1.6);
      }
    }
  };

  function preyColors(spec, r) {
    var t = (r() - 0.5) * 0.16, toward = t < 0 ? '#3A2A22' : '#FFFFFF';
    return {
      fur: blend(spec.fur, toward, Math.abs(t)), dark: spec.dark, belly: spec.belly, inner: spec.inner,
      nose: spec.nose, tail: spec.tail || spec.dark, tail2: spec.tail2
    };
  }

  // The silhouette (body and ears / the fish's tail and fin), used for the paper shadow and the glow
  // halo. Only the fish has a tail and a fin to outline: a mouse's or vole's `tail` is its colour (its
  // tail is tucked in, drawn inside the body), never a path.
  function silhouette(spec) {
    var s = pth(spec.body, '#000');
    if (spec.ears) spec.ears.forEach(function (e) { s += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="' + e[2] + '" fill="#000"/>'; });
    if (spec.tailPath) s += pth(spec.tailPath, '#000');
    if (spec.fin) s += pth(spec.fin, '#000');
    return s;
  }

  function preyLayers(kind, seed) {
    var spec = PREY[kind] || PREY.mouse, r = prng(Math.imul(seed >>> 0, 2654435761) + 7), c = preyColors(spec, r);
    var sil = silhouette(spec);
    var glow = '<g fill="' + GLOW + '" stroke="' + GLOW + '" stroke-width="20" stroke-linejoin="round" opacity=".42">' + sil.replace(/ fill="#000"/g, '') + '</g>' +
      '<g fill="' + GLOW2 + '" stroke="' + GLOW2 + '" stroke-width="9" stroke-linejoin="round" opacity=".85">' + sil.replace(/ fill="#000"/g, '') + '</g>';
    var body = '<g transform="translate(0 2.5)" fill="#2A2236" opacity=".22">' + sil.replace(/ fill="#000"/g, '') + '</g>';
    if (kind === 'fish') {
      body += pth(spec.tailPath, c.tail2) + lin('M10 14Q18 24 10 36', c.dark, 1.4, op('.45')) +
        pth(spec.fin, c.tail2) + pth(spec.body, c.fur) + spec.draw(c);
    } else {
      var ears = spec.ears, back = ears.length > 1 ? ears[0] : null, front = ears[ears.length - 1];
      if (back) body += '<circle cx="' + back[0] + '" cy="' + back[1] + '" r="' + back[2] + '" fill="' + c.dark + '"/>';
      body += pth(spec.body, c.fur) +
        lin('M12 40C16 24 34 10 56 9', '#FFFFFF', 4, op('.32')) +
        '<circle cx="' + front[0] + '" cy="' + front[1] + '" r="' + front[2] + '" fill="' + c.fur + '"/>' +
        '<circle cx="' + f1(front[0] + 1) + '" cy="' + f1(front[1] + 1) + '" r="' + f1(front[2] * 0.58) + '" fill="' + c.inner + '"/>' +
        spec.draw(c);
    }
    var spark = sparkle(spec.bw * 0.72, -4, 9);
    return { glow: glow, body: body, spark: spark, bw: spec.bw, bh: spec.bh };
  }

  art.prey = function (o) {
    o = o || {};
    var kind = PREY[o.kind] ? o.kind : 'mouse', L = preyLayers(kind, +o.seed || 0);
    var w = L.bw + M * 2, h = L.bh + M;
    var inner = o.part === 'glow' ? (o.lit ? L.glow : '') : o.part === 'body' ? L.body : o.part === 'spark' ? (o.lit ? L.spark : '') :
      (o.lit ? L.glow : '') + L.body + (o.lit ? L.spark : '');
    var t = 'translate(' + M + ' ' + M + ')';
    if (o.facing === 'left') t = 'translate(' + f1(w) + ' 0) scale(-1 1) ' + t;
    return { svg: inner ? '<g transform="' + t + '">' + inner + '</g>' : '', w: w, h: h, kind: kind };
  };
  art.prey.kinds = ['mouse', 'vole', 'fish'];

  // ------------------------------------------------------------------ the set

  var K = art.kit;
  if (!K || !art.defineSet) {
    if (typeof module !== 'undefined' && module.exports) module.exports = PC;
    return;
  }
  var n = K.n, rect = K.rect, ell = K.ell, path = K.path, stroke = K.stroke, poly = K.poly, g = K.g, tr = K.tr;
  var mix = K.mix, rng = K.rng, blob = K.blob, mound = K.mound, leafD = K.leafD, clamp = K.clamp, A = K.anchor;

  // the order the kinds go in, stack by stack: mice and voles only, each row alternating and the
  // two rows out of step, so neighbours differ (no fish: see the note on PC.art.prey above)
  var KINDS = ['mouse', 'vole', 'mouse', 'vole', 'vole', 'mouse', 'vole', 'mouse', 'mouse', 'vole'];
  var FACING = ['right', 'right', 'left', 'right', 'left', 'right', 'left', 'left', 'right', 'left'];

  function optInt(v, def, lo, hi) {
    var x = Math.round(+v);
    return isFinite(x) ? clamp(x, lo, hi) : def;
  }

  // Where each stack goes: the back row (the first half, rounded down) a little higher and set
  // between the front row's stacks, so every pair shows. Positions are bottom-centre, world units.
  function layout(count, cx, base, pw) {
    var back = Math.floor(count / 2), front = count - back, sp = pw * (count > 8 ? 1.12 : 1.3), out = [], i;
    var k = pw / PREY.mouse.bw, stackH = PREY.mouse.bh * k * 1.62, rise = stackH * 0.8;
    var shiftB = back === front ? -sp / 4 : 0, shiftF = back === front ? sp / 4 : 0;
    for (i = 0; i < back; i++) out.push({ x: cx + shiftB + (i - (back - 1) / 2) * sp, y: base - rise, row: 0 });
    for (i = 0; i < front; i++) out.push({ x: cx + shiftF + (i - (front - 1) / 2) * sp, y: base, row: 1 });
    out.forEach(function (s, j) { s.i = j; s.kind = KINDS[j % KINDS.length]; s.face = FACING[j % FACING.length]; });
    return { stacks: out, k: k, sp: sp, stackH: stackH, rise: rise };
  }

  // The pile: soft shadows, then each stack (glow, bottom piece, top piece, sparkle). Returns the
  // svg and one keep box per stack.
  function pileSvg(S, cx, base, pw, seed) {
    var o = S.opts, count = optInt(o.pairs, 8, 0, 10), lit = optInt(o.lit, 0, 0, 10);
    var L = layout(count, cx, base, pw), k = L.k, s = '', shadows = '', boxes = [];
    // `vole`: the loose vole was nudged off the top of a front stack (the front row's first vole
    // stack, nearest the cat at pile-left), which keeps only its bottom piece: the pile and the vole
    // together still hold what the pile held
    var front = L.stacks.filter(function (st) { return st.row === 1; });
    var taken = o.vole ? (front.filter(function (st) { return st.kind === 'vole'; })[0] || front[0] || null) : null;
    L.stacks.forEach(function (st) {
      shadows += ell(st.x, st.y - 1, pw * 0.62, pw * 0.1, S.pal.shade, { opacity: 0.3 });
    });
    L.stacks.forEach(function (st) {
      var on = st.i < lit, spec = PREY[st.kind], pw0 = spec.bw + M * 2, ph0 = spec.bh + M, one = st === taken;
      var lift = spec.bh * k * 0.64;   // the top piece settles into the curve of the one below
      function piece(y, part, sd) {
        var p1 = art.prey({ kind: st.kind, seed: sd, facing: st.face, lit: on, part: part });
        return p1.svg ? '<g transform="' + tr(st.x - pw0 * k / 2, y - ph0 * k, k) + '">' + p1.svg + '</g>' : '';
      }
      var sd0 = seed + st.i * 2, sd1 = sd0 + 1, y0 = st.y, y1 = st.y - lift;
      // the glow breathes softly (scenes.js's pcs-pulse, inside prefers-reduced-motion); the prey don't
      if (on) s += g(piece(y0, 'glow', sd0) + (one ? '' : piece(y1, 'glow', sd1)), { 'class': 'pcs-pulse' });
      s += one ? piece(y0, 'body', sd0) + piece(y0, 'spark', sd0) : piece(y0, 'body', sd0) + piece(y1, 'body', sd1) + piece(y1, 'spark', sd1);
      var w = pw0 * k, top = (one ? y0 : y1) - ph0 * k;
      boxes.push({ x: st.x - w / 2, y: top, w: w, h: y0 - top });
    });
    return { svg: shadows + s, boxes: boxes, layout: L };
  }

  // The `vole` option: one plump vole lying on its own on the ground in front of the pile, nosed
  // over toward the cat at `pile-left` (it faces her), eyes shut like every piece. A pile piece's
  // size, a touch bigger for being nearer; reported in keep, since it's what the panel is about.
  function looseVole(S, x, y, pw) {
    var spec = PREY.vole, k = pw / PREY.mouse.bw, w = (spec.bw + M * 2) * k, h = (spec.bh + M) * k;
    var one = art.prey({ kind: 'vole', seed: 23, facing: 'left' });
    var svg = ell(x, y - 1, w * 0.4, pw * 0.09, S.pal.shade, { opacity: 0.32 }) +
      '<g transform="' + tr(x - w / 2, y - h, k) + '">' + one.svg + '</g>';
    return { svg: svg, box: { x: x - w / 2 + M * k * 0.5, y: y - h + M * k * 0.5, w: w - M * k, h: h - M * k * 0.5 } };
  }

  // Soft, lumpy, freshly turned earth (the `dug` clue): lumps behind the pile, crumbs round it.
  function dugEarth(S, cx, base, w, k, seed) {
    var r = rng(seed), p = S.pal, soil = mix('#7A5638', p.shade, 0.18), soilLt = mix('#A27A55', p.rim, 0.12), soilDk = mix('#4E3524', p.shade, 0.2);
    var lumps = '', tops = '', crumbs = '', i;
    var y0 = base - 40 * k;
    lumps += ell(cx, y0 + 10 * k, w * 0.56, 34 * k, soilDk, { opacity: 0.85 });
    for (i = 0; i < 13; i++) {
      var u = (i / 12 - 0.5) * 2, lx = cx + u * w * 0.5 + (r() - 0.5) * 20 * k, ly = y0 - (1 - u * u) * 26 * k + (r() - 0.5) * 10 * k;
      var rx = (26 + r() * 22) * k, ry = (14 + r() * 12) * k;
      lumps += path(blob(lx, ly, rx, ry, 8, r, 0.25, 0.32), soil);
      tops += path(blob(lx - rx * 0.15, ly - ry * 0.35, rx * 0.6, ry * 0.42, 7, r, 0.3, 0.3), soilLt, { opacity: 0.8 });
    }
    // a soft dip at the back where the earth has fallen in (a careful eye might wonder)
    lumps += ell(cx + w * 0.22, y0 - 18 * k, 34 * k, 10 * k, soilDk, { opacity: 0.9 });
    for (i = 0; i < 26; i++) {
      var side = i % 2 ? 1 : -1, cxx = cx + side * (w * 0.42 + r() * w * 0.2), cyy = base - r() * 50 * k;
      crumbs += path(blob(cxx, cyy, (4 + r() * 7) * k, (3 + r() * 4) * k, 6, r, 0.3, 0.3), r() < 0.5 ? soil : soilLt);
    }
    var roots = stroke('M' + n(cx - w * 0.3) + ' ' + n(y0 - 6 * k) + 'q' + n(10 * k) + ' ' + n(-16 * k) + ' ' + n(26 * k) + ' ' + n(-12 * k) +
      'M' + n(cx + w * 0.36) + ' ' + n(y0 - 2 * k) + 'q' + n(-6 * k) + ' ' + n(-14 * k) + ' ' + n(-20 * k) + ' ' + n(-14 * k), mix('#C9A27A', p.shade, 0.2), 2.4 * k);
    return lumps + tops + roots + crumbs;
  }

  // Leaves along a bramble mass's edge, and its leafy texture, inside a shape built from mounds.
  function leafTex(S, x0, x1, y0, y1, count, size, seed, col, opac, keepIn) {
    var r = rng(seed), d = '';
    for (var i = 0; i < count; i++) {
      var x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0);
      if (keepIn && !keepIn(x, y)) { r(); r(); continue; }
      d += leafD(x, y, size * (0.7 + r() * 0.6), r() * 6.28, size * 0.3);
    }
    return path(d, col, { opacity: opac });
  }

  // A water sliver in the fountain (the rain's still in it in the morning) or its dry, mossy floor.
  function fountainEdge(S, cx, cy, rx, ry, wall) {
    var p = S.pal, s = '', r = rng(431), wet = S.tod === 'morning' || S.tod === 'day';
    // the outer wall: the front half of the rim's ellipse, carried down to the ground
    s += ell(cx - 30, cy + wall + 10, rx + 40, ry * 0.5, p.shade, { opacity: 0.2 });
    var P = [], N = 40, i;
    for (i = 0; i <= N; i++) { var a = Math.PI - Math.PI * i / N; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    for (i = N; i >= 0; i--) { var b = Math.PI - Math.PI * i / N; P.push([cx + Math.cos(b) * rx, cy + wall + Math.sin(b) * ry]); }
    s += poly(P, S.lin('pilebasin', [[0, p.stone], [1, p.stoneDark]]));
    // brick joints
    var bricks = '';
    for (i = 1; i < 14; i++) {
      var t = Math.PI - Math.PI * i / 14, bx = cx + Math.cos(t) * rx, by = cy + Math.sin(t) * ry;
      bricks += 'M' + n(bx) + ' ' + n(by + 8) + 'V' + n(by + wall - 4);
    }
    var mid = [];
    for (i = 0; i <= N; i++) { var c2 = Math.PI - Math.PI * i / N; mid.push([cx + Math.cos(c2) * rx, cy + wall * 0.5 + Math.sin(c2) * ry]); }
    bricks += K.pts(mid);
    s += stroke(bricks, p.stoneDark, 2.5, { opacity: 0.55 });
    // the rim and the inside
    s += ell(cx, cy, rx, ry, p.stoneLight);
    s += ell(cx, cy + 4, rx - 34, ry - 18, wet ? mix(p.water, p.sky[2], 0.5) : mix(p.stoneDark, p.sand, 0.35));
    if (wet) {
      // the sky in the rainwater, and a glint
      s += ell(cx - 60, cy + 2, rx * 0.55, (ry - 18) * 0.55, p.sky[3] || p.sky[1], { opacity: 0.55 });
      s += stroke('M' + n(cx - rx * 0.62) + ' ' + n(cy - 6) + 'q60 -10 130 -4M' + n(cx - rx * 0.5) + ' ' + n(cy + 12) + 'q40 -6 90 -2', '#FFFFFF', 3, { opacity: 0.7, 'class': 'pcs-glint' });
    } else {
      var lv = '';
      for (i = 0; i < 12; i++) lv += leafD(cx - rx * 0.8 + r() * rx * 0.9, cy - 10 + r() * 30, 14, r() * 6.28, 5);
      s += path(lv, '#C9853F', { opacity: 0.85 });
    }
    s += ell(cx, cy - 3, rx, ry, 'none', { stroke: p.rim, 'stroke-width': 4, opacity: 0.75, 'stroke-dasharray': '420 2000', 'stroke-dashoffset': '-1180' });
    s += path(blob(cx - rx * 0.86, cy + ry * 0.2, 40, 11, 8, r, 0.3, 0.3) + blob(cx - rx * 0.45, cy + ry * 0.86, 46, 10, 8, r, 0.3, 0.3) +
      blob(cx - rx * 0.7, cy + wall * 0.8 + ry * 0.6, 30, 14, 8, r, 0.3, 0.3), p.moss);
    return s;
  }

  // ------------------------------------------------------------------ wide (main composition)

  var MAIN = { cx: 615, base: 800, pw: 74, open: [335, 905, 548, 830], vole: [408, 902, 1.06] };
  // the thicket: two rounded mounds [x0, x1, top] on a base at y 846 (its top edge, for the leaf texture)
  var THICKET = [[-700, 830, 250], [420, 1050, 420]];
  function thicketTop(x) {
    var best = 2000;
    THICKET.forEach(function (m) {
      var c = (m[0] + m[1]) / 2, rx = (m[1] - m[0]) / 2, u = (x - c) / rx;
      if (Math.abs(u) < 1) best = Math.min(best, 846 - (846 - m[2]) * Math.sqrt(1 - u * u));
    });
    return best;
  }
  function inThicket(x, y) { return y > thicketTop(x) + 26; }

  function avoidBoxes(S, pad) {
    // rough body boxes of the cast at their anchors, for foreground leaves to keep off
    var out = [], map = S.anchorMap || {};
    (S.cast || []).forEach(function (m) {
      var a = m && typeof m.at === 'string' ? map[m.at] : null;
      if (!a) return;
      var wide = { lie: 1, flat: 1, stand: 1, walk: 1, crouch: 1, loaf: 1, curl: 1 }[m.pose] ? 0.56 : 0.4, sz = m.size > 0 ? +m.size : 1, h = a.h * sz;
      out.push([a.x - h * wide - (pad || 0), a.y - h * 1.02, a.x + h * wide + (pad || 0), a.y + 6]);
    });
    return out;
  }

  function drawMain(S) {
    var p = S.pal, o = S.opts, back = '', front = '', r = rng(401), wet = S.tod === 'morning' || S.tod === 'day', i;
    var sun = wet ? [1300, 250] : [1210, 470];
    back += K.sky(S, 0, 0, 1600, 700, { sun: sun, sunR: wet ? 460 : 560 });
    back += K.towers(S, [
      { x: 560, w: 120, top: 250, base: 640, far: 0.65, cap: 'slant' }, { x: 700, w: 100, top: 330, base: 640, far: 0.75 },
      { x: 860, w: 150, top: 200, base: 640, far: 0.55, cap: 'step' }, { x: 1030, w: 110, top: 300, base: 640, far: 0.7 },
      { x: 1180, w: 130, top: 150, base: 640, far: 0.5, cap: 'spire' }, { x: 340, w: 150, top: 120, base: 640, far: 0.5 }
    ]);
    back += g(K.towers(S, [
      { x: 1350, w: 150, top: 60, base: 660, far: 0.25, cap: 'round' }, { x: 1480, w: 200, top: -20, base: 660, far: 0.12, cap: 'slant' },
      { x: -40, w: 230, top: -20, base: 660, far: 0.15, cap: 'step' }
    ]), { filter: S.shadow('m') });
    back += K.plane(S, 1010, 120, 0.95, 'left');
    // light from the open side of camp
    back += g(poly([[sun[0] - 40, sun[1]], [sun[0] + 30, sun[1]], [1450, 1000], [1060, 1000]], S.linU([[0, p.sun || p.glow, 0.28], [1, p.sun || p.glow, 0]], 0, sun[1], 0, 1000)), { style: 'mix-blend-mode:screen' });
    // the ring of hedge round camp
    var ringD = mound(560, 1720, 670, 540, 16, rng(402), 0.32, 0.3, 0.35);
    back += g(path(ringD, p.rim, { transform: 'translate(0 -7)' }) + path(ringD, p.leaf) +
      path(blob(1190, 560, 110, 50, 9, rng(403), 0.2, 0.3), p.leafMid, { opacity: 0.8 }), { filter: S.shadow('m') });
    // ground
    back += rect(0, 620, 1600, 380, S.lin('pileground', [[0, p.grassFar], [0.3, p.grass], [1, p.grassNear]]));
    back += ell(1180, 900, 420, 80, p.rim, { opacity: wet ? 0.14 : 0.18 });
    back += K.tufts(S, 960, 1600, 650, 1000, 60, 404, p.grassNear, p.grassLight, 1);
    back += K.flowers(S, 1000, 1600, 680, 990, 12, 405, '#FFF6EA');
    // the fountain's edge, at the right
    back += g(fountainEdge(S, 1760, 690, 570, 96, 112), { filter: S.shadow('l') });
    // puddles left by the storm (morning)
    if (wet) {
      [[1010, 958, 120, 18], [760, 932, 70, 11], [1240, 836, 60, 9]].forEach(function (q) {
        back += ell(q[0], q[1] + 2, q[2] + 6, q[3] + 3, mix(p.grassNear, p.shade, 0.3), { opacity: 0.5 }) +
          ell(q[0], q[1], q[2], q[3], S.linU([[0, p.sky[1]], [1, p.sky[3]]], 0, q[1] - q[3], 0, q[1] + q[3])) +
          stroke('M' + n(q[0] - q[2] * 0.5) + ' ' + n(q[1] - q[3] * 0.2) + 'h' + n(q[2] * 0.45), '#FFFFFF', 2.5, { opacity: 0.75 });
      });
    }
    // the bramble thicket in the camp's corner, with its low arch over the pile
    var O = MAIN.open, ox0 = O[0], ox1 = O[1], otop = O[2], obase = O[3], ocx = (ox0 + ox1) / 2;
    var T0 = THICKET[0], T1 = THICKET[1];
    var mA = mound(T0[0], T0[1], 846, T0[2], 16, rng(406), 0.3, 0.12, 0.12), mB = mound(T1[0], T1[1], 846, T1[2], 9, rng(407), 0.3, 0.12, 0.12);
    var th = path(mA + mB, p.rim, { transform: 'translate(0 -8)' }) + path(mA + mB, p.leaf);
    th += path(mound(T0[0] + 60, T0[1] - 70, 846, T0[2] + 60, 14, rng(408), 0.3, 0.14, 0.12) + mound(T1[0] + 50, T1[1] - 50, 846, T1[2] + 60, 8, rng(409), 0.3, 0.14, 0.12), p.leafMid, { opacity: 0.7 });
    th += leafTex(S, 0, 1040, 240, 840, 300, 18, 410, p.leafLight, 0.42, inThicket);
    // the arch's mouth: deep, cool shade with a few spots of light
    var archD = 'M' + n(ox0) + ' ' + n(obase) + 'C' + n(ox0 - 8) + ' ' + n(otop + 120) + ' ' + n(ox0 + 70) + ' ' + n(otop) + ' ' + n(ocx) + ' ' + n(otop) +
      'C' + n(ox1 - 70) + ' ' + n(otop) + ' ' + n(ox1 + 8) + ' ' + n(otop + 120) + ' ' + n(ox1) + ' ' + n(obase) + 'Z';
    var deep = mix(p.leaf, p.shade, 0.7), mid = mix(p.leaf, p.shade, 0.45);
    th += path(archD, S.linU([[0, deep], [0.75, mid], [1, mix(mid, p.wood, 0.3)]], 0, otop, 0, obase));
    th += leafTex(S, ox0 + 30, ox1 - 30, otop + 30, obase - 80, 70, 20, 411, mix(p.leaf, p.shade, 0.75), 0.6);
    // brambles over everything, and the canes that make the arch
    th += K.bramble(S, -40, 800, 846, 330, { seed: 414, w: 10, canes: 8, len: 210 });
    th += K.bramble(S, 440, 1030, 846, 460, { seed: 415, w: 10, canes: 2, len: 150, openings: [[ocx, ox1 - ox0, obase - otop - 40]] });
    // drooping cane tips in the arch's mouth
    var drip = '', dl = '';
    [[ocx - 170, otop + 20, 70], [ocx - 40, otop + 6, 56], [ocx + 120, otop + 14, 76], [ocx + 230, otop + 60, 50]].forEach(function (c, j) {
      drip += 'M' + n(c[0]) + ' ' + n(c[1]) + 'q' + n(10 - j * 4) + ' ' + n(c[2] * 0.5) + ' ' + n(-4 + j * 3) + ' ' + n(c[2]);
      dl += leafD(c[0] + (j % 2 ? 4 : -2), c[1] + c[2], 16, 1.9 - j * 0.2, 6) + leafD(c[0] + 2, c[1] + c[2] * 0.55, 13, j % 2 ? 0.4 : 2.7, 5);
    });
    th += stroke(drip, mix(p.woodDark, p.leaf, 0.35), 4) + path(dl, p.leafMid);
    if (wet) {
      // raindrops still hanging on the leaves
      var dr = '';
      for (i = 0; i < 60; i++) { var dx = r() * 1040, dy = 240 + r() * 600, rr = 2 + r() * 2.2; if ((dx > ox0 && dx < ox1 && dy > otop) || !inThicket(dx, dy)) continue; dr += K.dot(dx, dy, rr); }
      th += path(dr, '#FFFFFF', { opacity: 0.75 });
    }
    back += g(th, { filter: S.shadow('l') });
    // the floor of the arch: packed earth and moss
    back += ell(ocx, obase - 6, (ox1 - ox0) * 0.56, 40, mix(p.wood, p.shade, 0.25));
    back += ell(ocx, obase - 12, (ox1 - ox0) * 0.48, 28, mix(p.wood, p.sand, 0.25), { opacity: 0.6 });
    back += path(blob(ox0 + 20, obase + 4, 60, 14, 8, rng(416), 0.3, 0.3) + blob(ox1 - 30, obase + 2, 70, 14, 8, rng(417), 0.3, 0.3), p.moss, { opacity: 0.9 });
    // ferns at the thicket's foot
    var avoid = avoidBoxes(S, 10);
    back += K.fernClump(S, 1000, 852, 150, { seed: 418, count: 6, avoid: avoid }) + K.fernClump(S, 40, 860, 180, { seed: 419, count: 6, avoid: avoid });
    back += K.tufts(S, 0, 960, 840, 1000, 50, 420, p.grassNear, p.grassLight, 1.2);
    // the pile
    if (o.dug) back += dugEarth(S, MAIN.cx, MAIN.base - 36, 420, 0.9, 421);
    var pile = pileSvg(S, MAIN.cx, MAIN.base, MAIN.pw, 7), vole = o.vole ? looseVole(S, MAIN.vole[0], MAIN.vole[1], MAIN.pw * MAIN.vole[2]) : null;
    back += g(pile.svg + (vole ? vole.svg : ''), S.tod === 'morning' || S.tod === 'day' ? null : { filter: pileTint(S) });
    keepBoxes(S, pile.boxes.concat(vole ? [vole.box] : []));
    // foreground: grass and a frond at the corners, clear of the cast
    front += g(K.tufts(S, 0, 1600, 975, 1012, 34, 422, p.grassNear, p.grassLight, 2) +
      K.fernClump(S, 1660, 1030, 260, { seed: 423, count: 5, spread: 1.4, lean: -0.5, avoid: avoid }) +
      K.fernClump(S, -60, 1030, 240, { seed: 424, count: 5, spread: 1.4, lean: 0.5, avoid: avoid }), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  // the prey sit in the scene's light: warm at last light, cool at dusk and night
  var TINT = {
    golden: '1 0 0 0 0.02  0 0.96 0 0 0.01  0 0 0.86 0 0  0 0 0 1 0',
    dusk: '0.9 0 0 0 0.01  0 0.86 0 0 0.01  0 0 0.94 0 0.03  0 0 0 1 0',
    night: '0.62 0 0 0 0.01  0 0.66 0 0 0.02  0 0 0.82 0 0.06  0 0 0 1 0'
  };
  function pileTint(S) {
    var m = TINT[S.tod];
    return m ? S.filter('piletint', '<feColorMatrix type="matrix" values="' + m + '"/>') : null;
  }

  function keepBoxes(S, boxes) {
    S.keep = S.keep || [];
    boxes.forEach(function (b) { S.keep.push({ x: b.x - 4, y: b.y - 4, w: b.w + 8, h: b.h + 8 }); });
  }

  // ------------------------------------------------------------------ low and close (cat height)

  var LOW = { cx: 715, base: 874, pw: 126, vole: [432, 964, 1.12] };

  function inPoly(P, x, y) {
    var c = false;
    for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
      if (((P[i][1] > y) !== (P[j][1] > y)) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c;
    }
    return c;
  }

  // A bramble cane along a cubic curve, leaves in threes on alternate sides, a few blossoms and
  // berries (the same look as the kit's bramble, for canes that hang down from the arch).
  function vine(A0, B0, C0, D0, w, r, out) {
    out.stem += 'M' + n(A0[0]) + ' ' + n(A0[1]) + 'C' + n(B0[0]) + ' ' + n(B0[1]) + ' ' + n(C0[0]) + ' ' + n(C0[1]) + ' ' + n(D0[0]) + ' ' + n(D0[1]);
    var side = 1;
    for (var t = 0.06; t < 0.97; t += 0.075 + r() * 0.03) {
      var q = K.bez3(A0, B0, C0, D0, t), q2 = K.bez3(A0, B0, C0, D0, Math.min(1, t + 0.01));
      var tx = q2[0] - q[0], ty = q2[1] - q[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
      tx /= tl; ty /= tl; side = -side;
      var nx = -ty * side, ny = tx * side, la = Math.atan2(ny + ty * 0.6, nx + tx * 0.6), ll = w * (2 + r() * 1.2);
      out.thorns += 'M' + n(q[0] + tx * w * 0.3) + ' ' + n(q[1] + ty * w * 0.3) + 'L' + n(q[0] + nx * w * 0.9) + ' ' + n(q[1] + ny * w * 0.9) + 'L' + n(q[0] - tx * w * 0.2) + ' ' + n(q[1] - ty * w * 0.2) + 'Z';
      out.leaves += leafD(q[0], q[1], ll, la, ll * 0.36) + leafD(q[0], q[1], ll * 0.78, la + 0.7, ll * 0.28) + leafD(q[0], q[1], ll * 0.78, la - 0.7, ll * 0.28);
      if (r() < 0.08) for (var b = 0; b < 5; b++) { var ba = b * 1.2566; out.blossoms += K.dot(q[0] - nx * w * 1.6 + Math.cos(ba) * w * 0.44, q[1] - ny * w * 1.6 + Math.sin(ba) * w * 0.44, w * 0.34); }
      if (r() < 0.07) for (b = 0; b < 5; b++) out.berries += K.dot(q[0] + nx * w * 1.8 + (b % 3 - 1) * w * 0.44, q[1] + ny * w * 1.8 + Math.floor(b / 3) * w * 0.44, w * 0.31);
    }
  }

  // A leafy bramble mass in papercut layers: a lit rim on the side the light comes from, the mass,
  // a lighter inner layer, leaf texture kept inside, and raindrops in the morning.
  function brambleMass(S, P, cx, cy, rim, seed, wet) {
    var p = S.pal, r = rng(seed), d = K.scallops(P, cx, cy, 0.34, true), s = '';
    s += path(d, p.rim, { transform: 'translate(' + n(rim[0]) + ' ' + n(rim[1]) + ')', opacity: 0.85 }) + path(d, p.leaf);
    var Q = P.map(function (pt) { return [cx + (pt[0] - cx) * 0.86, cy + (pt[1] - cy) * 0.86]; });
    s += path(K.scallops(Q, cx, cy, 0.3, true), p.leafMid, { opacity: 0.55 });
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    P.forEach(function (pt) { x0 = Math.min(x0, pt[0]); x1 = Math.max(x1, pt[0]); y0 = Math.min(y0, pt[1]); y1 = Math.max(y1, pt[1]); });
    var inside = function (x, y) { return inPoly(P, x, y); }, area = (x1 - x0) * (y1 - y0);
    s += leafTex(S, x0, x1, y0, y1, Math.min(320, Math.round(area / 1500)), 24, seed + 1, p.leafLight, 0.45, inside);
    s += leafTex(S, x0, x1, y0, y1, Math.min(160, Math.round(area / 3000)), 22, seed + 2, p.leaf, 0.5, inside);
    if (wet) {
      var dr = '';
      for (var i = 0; i < Math.round(area / 9000); i++) { var x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), rr = 2.4 + r() * 2.4; if (inside(x, y)) dr += K.dot(x, y, rr); }
      s += path(dr, '#FFFFFF', { opacity: 0.75 });
    }
    return s;
  }

  function drawLow(S) {
    var p = S.pal, o = S.opts, back = '', front = '', r = rng(501), wet = S.tod === 'morning' || S.tod === 'day', i;
    // through the open side of the arch, at the right: sky, towers, the camp in the sun
    back += K.sky(S, 1100, 0, 500, 720, { sun: wet ? [1470, 210] : [1430, 430], sunR: 420 });
    back += K.towers(S, [{ x: 1380, w: 130, top: 130, base: 660, far: 0.5, cap: 'spire' }, { x: 1510, w: 140, top: 250, base: 660, far: 0.62 }]);
    back += path(mound(1160, 1720, 668, 586, 8, rng(502), 0.3, 0.25, 0.3), p.leaf);
    back += rect(1100, 650, 500, 350, S.lin('pilelowfield', [[0, p.grassFar], [1, p.grass]]));
    back += g(fountainEdge(S, 1790, 690, 300, 40, 48), { filter: S.shadow('s') });
    back += K.tufts(S, 1300, 1600, 680, 790, 24, 503, p.grassNear, p.grassLight, 0.8);
    // the back of the arch: deep, cool shade with leaves dim in it, and the floor
    var deep = mix(p.leaf, p.shade, 0.66), mid = mix(p.leaf, p.shade, 0.42);
    back += rect(-10, 0, 1290, 800, S.linU([[0, deep], [0.55, deep], [1, mid]], 0, 0, 0, 800));
    back += leafTex(S, 0, 1260, 250, 780, 200, 30, 504, mix(p.leaf, p.shade, 0.8), 0.7);
    back += leafTex(S, 0, 1260, 300, 780, 70, 28, 505, mix(p.leafMid, p.shade, 0.4), 0.45);
    back += path('M-10 770Q400 754 820 762Q1100 766 1300 752V1010H-10Z', S.lin('pilelowfloor', [[0, mix(p.wood, p.shade, 0.4)], [1, mix(p.wood, p.sand, 0.2)]]));
    back += path('M1190 756Q1320 746 1610 742V1010H1060Q1140 890 1190 756Z', S.lin('pilelowgrass', [[0, p.grass], [1, p.grassNear]]), { opacity: 0.95 });
    back += g(poly([[1640, 260], [1700, 260], [1320, 1010], [900, 1010]], S.linU([[0, p.sun || p.glow, 0], [0.45, p.sun || p.glow, 0.2], [1, p.sun || p.glow, 0.05]], 0, 260, 0, 1000)), { style: 'mix-blend-mode:screen' });
    back += path(blob(150, 806, 120, 18, 9, rng(509), 0.3, 0.3) + blob(1170, 800, 90, 16, 8, rng(510), 0.3, 0.3) + blob(420, 984, 140, 20, 9, rng(511), 0.3, 0.3), p.moss, { opacity: 0.85 });
    var lv = '';
    for (i = 0; i < 14; i++) lv += leafD(40 + r() * 1200, 806 + r() * 186, 18 + r() * 8, r() * 6.28, 7);
    back += path(lv, '#C98A45', { opacity: 0.8 });
    if (wet) back += ell(1430, 846, 110, 16, S.linU([[0, p.sky[1]], [1, p.sky[3]]], 0, 830, 0, 862)) + stroke('M1380 842h60', '#FFFFFF', 2.5, { opacity: 0.75 });
    // the arch overhead, seen from below: the canopy, its left leg and its right leg
    var edge = [], x;
    for (x = 1250; x >= -40; x -= 75) edge.push([x, 268 + Math.sin(x * 0.009 + 1) * 26 + (r() - 0.5) * 22]);
    var canopy = [[-40, -40], [1520, -40], [1520, 70], [1440, 170], [1340, 236]].concat(edge);
    var leftLeg = [[-40, 230], [90, 250], [150, 330], [128, 450], [152, 580], [118, 700], [140, 800], [-40, 800]];
    var rightLeg = [[1150, 250], [1300, 200], [1388, 150], [1440, 260], [1356, 380], [1376, 540], [1340, 660], [1366, 800], [1176, 800], [1196, 660], [1166, 520], [1186, 380]];
    var arch = brambleMass(S, leftLeg, 40, 520, [6, 0], 521, wet) + brambleMass(S, rightLeg, 1270, 500, [7, 0], 522, wet) + brambleMass(S, canopy, 760, 60, [0, 8], 523, wet);
    // spots of sun that find their way through the leaves, on the floor
    var floorSpots = '';
    [[285, 790, 30, 16], [528, 838, 22, 12], [834, 800, 34, 18], [1059, 904, 20, 11], [690, 946, 16, 9]].forEach(function (q) {
      floorSpots += ell(q[0], q[1], q[2] * 1.8, q[3] * 0.7, mix(p.rim, p.sand, 0.4), { opacity: 0.13 });
    });
    // canes looping down from the canopy and over the legs
    var vo = { stem: '', thorns: '', leaves: '', blossoms: '', berries: '' };
    [[-20, 250, 300, 330], [220, 290, 560, 300], [470, 300, 830, 300], [760, 300, 1080, 290], [1000, 300, 1300, 250]].forEach(function (c, j) {
      var sag = 70 + r() * 50;
      vine([c[0], c[1]], [c[0] + 60, c[1] + sag], [c[2] - 60, c[3] + sag], [c[2], c[3]], 12, r, vo);
    });
    vine([150, 300], [190, 420], [100, 520], [150, 660], 12, r, vo);
    vine([1180, 300], [1140, 420], [1230, 560], [1180, 700], 12, r, vo);
    var stemCol = mix(p.woodDark, p.leaf, 0.35);
    arch += stroke(vo.stem, p.rim, 9, { transform: 'translate(0 4)', opacity: 0.6 }) + stroke(vo.stem, stemCol, 11) + path(vo.thorns, stemCol) +
      path(vo.leaves, p.rim, { transform: 'translate(0 3)', opacity: 0.5 }) + path(vo.leaves, p.leafMid) +
      path(vo.berries, '#4A2A4E') + path(vo.blossoms, '#FFF6EA', { opacity: 0.92 });
    // cane tips hanging into the shade
    var drip = '', dl = '';
    [[330, 300, 110], [640, 312, 150], [930, 300, 100], [1100, 320, 130]].forEach(function (c, j) {
      drip += 'M' + n(c[0]) + ' ' + n(c[1]) + 'q' + n(14 - j * 6) + ' ' + n(c[2] * 0.5) + ' ' + n(-6 + j * 3) + ' ' + n(c[2]);
      dl += leafD(c[0] - 6 + j * 3, c[1] + c[2], 26, 1.7, 10) + leafD(c[0] + 4, c[1] + c[2] * 0.55, 22, j % 2 ? 0.5 : 2.6, 8) + leafD(c[0], c[1] + c[2] * 0.25, 20, j % 2 ? 2.7 : 0.4, 7);
    });
    arch += stroke(drip, stemCol, 5) + path(dl, p.leafMid);
    back += floorSpots + g(arch, { filter: S.shadow('l') });
    // the pile and what's behind it
    if (o.dug) back += dugEarth(S, LOW.cx, LOW.base - 76, 760, 1.5, 518);
    var pile = pileSvg(S, LOW.cx, LOW.base, LOW.pw, 7), vole = o.vole ? looseVole(S, LOW.vole[0], LOW.vole[1], LOW.pw * LOW.vole[2]) : null;
    back += g(pile.svg + (vole ? vole.svg : ''), wet ? null : { filter: pileTint(S) });
    keepBoxes(S, pile.boxes.concat(vole ? [vole.box] : []));
    // foreground: grass and a frond at the bottom edge, clear of the cast
    var avoid = avoidBoxes(S, 16);
    front += g(K.tufts(S, 0, 1600, 985, 1014, 26, 519, p.grassNear, p.grassLight, 2.6) +
      K.fernClump(S, 1660, 1040, 330, { seed: 520, count: 5, spread: 1.3, lean: -0.55, avoid: avoid }), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  function draw(S) { return S.comp === 'low' ? drawLow(S) : drawMain(S); }

  art.defineSet('pile', {
    label: 'the prey pile in camp', tod: 'morning', todMap: { sunset: 'golden' }, draw: draw,
    cams: {
      wide: { box: [0, 0, 1600] },
      low: { box: [0, 0, 1600], comp: 'low' },
      close: { box: [305, 470, 820], comp: 'low' }
    },
    anchors: {
      main: {
        'pile-left': A(300, 896, 258), 'pile-right': A(1185, 902, 262, 'left'), beside: A(985, 856, 236, 'left'),
        'crowd-1': A(140, 838, 228), 'crowd-2': A(1080, 742, 180, 'left'), 'crowd-3': A(1385, 948, 284, 'left'),
        'fountain-edge': A(1490, 764, 245, 'left', { elev: true })
      },
      low: {
        'pile-left': A(180, 946, 396), beside: A(1305, 914, 376, 'left'), 'pile-right': A(1458, 932, 396, 'left')
      }
    },
    opts: { pairs: 'number', lit: 'number', dug: [true, false], vole: [true, false] },
    defaults: { pairs: 8, lit: 0, dug: false, vole: false }
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
