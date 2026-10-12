/* Potomac Crossing · app/art/sets/pile.js
 *
 * The set: the prey pile in camp (chapters 2 to 5), and PC.art.prey, the one piece of prey that both
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
 *   right), dug: true (soft, lumpy, dug-up earth behind the pile; 'big', chapter 3, two nights on:
 *   the same patch wider and higher, fresh darker earth on top, a second dip), vole: true (one plump vole on
 *   the ground in front of the pile, just right of `pile-left`: the one Tallyheart nudges over, off
 *   the top of the front row's first vole stack, which keeps only its bottom piece).
 *   The stacks (and the vole) are reported in `keep`, one box each, so the lettering stays off the prey.
 *
 *   Chapter 4 (docs/build.md, "Chapter 4 (v0.4)"; the chapter text's Build notes, "Sets and options"):
 *   Tallyheart's rule, rows of ten. `rows` in place of `pairs`: a list, the front row first, each entry
 *   a count or { n, gap } (places counted from 0: [10, 10, { n: 10, gap: [3, 4, 5, 6] }] is two full
 *   rows and a back row of three pieces, four empty places, three pieces: the hole right in the
 *   middle). One piece to a place, every piece facing the same way, mice and voles turn about; an
 *   empty place is a smooth pressed mark in the earth. `lit` then counts rows (the front row first);
 *   `pairs` and `vole` say nothing once there are rows.
 *   back: 'shadow'  the back row is a band of the brambles' deep shade: only the dim shapes nearest
 *                   its two ends show, and no gap, no dug earth and no "scale" can be made out (the
 *                   picture is the same whatever the row holds, and whatever dug, scale and glint say)
 *   dug             behind the back row, right behind its gap ('big': heaped up, as in chapter 3)
 *   scale: true     the "scale" in the gap, leaning on the next piece: as big as a cat's paw, flat,
 *                   shaped like a giant fish's scale (round at one end, a blunt point at the other),
 *                   smooth at every edge, clear with a faint green cast, a white shine on it. Nothing
 *                   like Sprinkle's matte grey ridges. Nobody ever holds it.
 *   scale: 'behind' tonight: where it was found, on the bare earth behind the back row, a small glimmer
 *   glint: true     the sun on it: a star of light that pulses softly (<g data-art="glint">; a wide
 *                   unpainted circle in the group makes its box a generous target for the glitter Tap)
 *   Cameras: rows (from the front, the rows running back under the brambles), gap (she has come to
 *   the back row: the row across the panel, the earth behind it; this camera draws the back row
 *   alone), and three close-ups with no anchors (a face is never in them; a balloon there comes from
 *   off the panel): scale (where it leans, the piece it leans on beside it), through (the camp seen
 *   through it, wavy and a little green inside its outline, as it always is outside), mirror (her
 *   own small face in it, from the player's look). `wide`, `low` and `close` take `rows` too. The
 *   five new cameras draw rows whatever the options say (the third morning's, when `rows` is missing).
 *   Each row, the band and the "scale" are in `keep`.
 *
 *   Chapter 5 (docs/chapters/05-riffles-river.md, "Art needs" and "Build": the fourth count). The
 *   rows are four now (`rows: [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }]`: three full rows to count,
 *   the hole in the back row where it was yesterday), the "scale" lies behind them (`scale:
 *   'behind'`), and the dug earth behind the gap has three states in every camera that draws rows:
 *   fresh (`dug`, as before), with tiny prints pressed in it (`prints: true`: a short line of them in
 *   the loose earth at the heap's foot, each half a cat's paw; <g data-art="prints">), and swept flat
 *   by the old tom's tail (`swept: true`: no heap, no prints, long side-to-side strokes;
 *   <g data-art="swept">). `prints` and `swept` draw the earth whether or not `dug` is said; under
 *   `back: 'shadow'` none of it shows, as ever. Pairs (chapters 2 and 3) take neither.
 *   The noticing cat's Tap: on the `gap` camera, once the "scale" is behind the row (`scale:
 *   'behind'`), the fresh dug earth carries the Tap's target, an unpainted <rect class="pc-tap"
 *   data-art="dug-tap">, its box the heap (the page draws the glow on it: docs/build.md, "One-tap
 *   frames"). Chapter 4's `gap` frames have no such rect: their Tap is the glint.
 *   Camera `gap-close`: the same earth close, from the gap (its own composition, no anchors: a face is
 *   never in it): the heap across the panel, the pressed places of the gap along the bottom edge, the
 *   "scale" lying beside it when `scale: 'behind'`; with `prints: true` the tiny prints big enough to
 *   read (the picture the Tap turns to), with `swept: true` the earth swept flat. The camera is on
 *   the earth whatever `rows`, `back` and `lit` say (as the "scale" close-ups are on the "scale").
 *   Anchor `behind` (`gap`, `rows`, `wide`, `low` and `close`): behind the back row, between it and
 *   the dug earth, where the old tom has stomped round to look; he faces left, so his tail lies out
 *   over the earth. It is drawn behind everyone else (z: 'behind') and takes no part in the depth a
 *   spot of its own is given.
 *
 *   PC.art.prey({ kind: 'mouse' | 'vole' | 'fish', lit, seed, facing?, part? }) -> { svg, w, h }:
 *   (the pile itself draws no fish; `fish` stays drawable only in case Aron rules to keep a few,
 *   traded from the otters, which the text would then have to say at the pile)
 *   one piece in its own box (0..w, 0..h), resting on the box's bottom centre. It uses no defs and
 *   no ids, so it can be dropped into any SVG. `lit` adds the Counts pictures' warm glow (an outline
 *   halo in #ffb21f / #ffe36e, as cats.js lights a tail, and a little sparkle). `facing` is 'right'
 *   (default) or 'left'. `part` ('glow' | 'body' | 'spark') returns one layer only, for a caller
 *   that stacks pieces and wants every halo behind every body.
 *   PC.art.prey.string({ count, len }) -> svg (chapter 5): `count` fish on a reed loop, for a set
 *   to lay on a raft (the two spare fish on the way home); see the function.
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

  /* PC.art.prey.string({ count, len }) -> svg (chapter 5): a string of fish as it is carried home,
   * the marsh's fourth string with its two spare fish ("Two to spare"; app/art/sets/marsh.js lays the
   * four of them on the raft there, and the open river and the Crossing lay this one on the logs on
   * the way home). `count` fish (two unless it says), each `len` long, fanned a little from the reed
   * loop that holds their tails, eyes shut. The loop lies over the tails: nothing goes through a
   * fish; no hook, no blood. Drawn hanging from (0, 0), heads toward +y: a group with no defs and no
   * ids, for the caller to place and turn with a transform. */
  var STRING = { reed: '#9BAC66', reedDk: '#70824E' };
  art.prey.string = function (o) {
    o = o || {};
    var count = Math.max(1, Math.min(5, Math.round(+o.count) || 2)), len = +o.len > 0 ? +o.len : 60, body = '', i;
    var lw = Math.max(1.5, len * 0.045), ry = len * 0.06, rx = len * (0.07 + count * 0.022), ly = len * 0.13;
    for (i = 0; i < count; i++) {
      var ang = 90 + (i - (count - 1) / 2) * 13, a = ang * Math.PI / 180, f = art.prey({ kind: 'fish', seed: 521 + i });
      body += '<g transform="translate(' + f1(Math.cos(a) * len * 0.44) + ' ' + f1(Math.sin(a) * len * 0.44) + ') rotate(' + f1(ang) + ') scale(' + (len / f.w).toFixed(4) +
        ') translate(' + f1(-f.w / 2) + ' ' + f1(-f.h / 2) + ')" data-fish="1">' + f.svg + '</g>';
    }
    function arc(sweep, col, w) {
      return '<path d="M' + f1(-rx) + ' ' + f1(ly) + 'A' + f1(rx) + ' ' + f1(ry) + ' 0 0 ' + sweep + ' ' + f1(rx) + ' ' + f1(ly) + '" fill="none" stroke="' + col + '" stroke-width="' + f1(w) + '" stroke-linecap="round"/>';
    }
    // the far side of the loop behind the tails, the near side over them, the knot and its two loose ends
    return '<g data-part="fish-string" data-fish-count="' + count + '">' + arc(1, STRING.reedDk, lw) + '<g>' + body + '</g>' + arc(0, STRING.reedDk, lw * 1.5) + arc(0, STRING.reed, lw) +
      '<path d="M' + f1(rx) + ' ' + f1(ly) + 'l' + f1(len * 0.13) + ' ' + f1(-len * 0.09) + 'M' + f1(rx) + ' ' + f1(ly) + 'l' + f1(len * 0.15) + ' ' + f1(len * 0.03) + '" fill="none" stroke="' + STRING.reed + '" stroke-width="' + f1(lw) + '" stroke-linecap="round"/>' +
      '<circle cx="' + f1(rx) + '" cy="' + f1(ly) + '" r="' + f1(lw * 0.9) + '" fill="' + STRING.reedDk + '"/></g>';
  };

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
  // `big` (chapter 3, two nights on, "the dug earth behind the pile is bigger"): the same patch
  // spread wider and heaped higher, a crest of fresh, darker earth turned up on top of the old, a
  // second soft dip where it has fallen in, and crumbs scattered further.
  function dugEarth(S, cx, base, w, k, seed, big) {
    if (big) { w *= 1.22; k *= 1.2; }
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
    if (!big) return lumps + tops + roots + crumbs;
    var r2 = rng(seed + 57), fresh = mix('#5C3F2A', p.shade, 0.16), freshLt = mix('#8C6646', p.rim, 0.12), more = '', moreTops = '', far = '';
    // the fresh crest: newer lumps heaped along the top of the old ones
    for (i = 0; i < 9; i++) {
      var fu = (i / 8 - 0.5) * 1.6, fx = cx + fu * w * 0.5 + (r2() - 0.5) * 18 * k, fy = y0 - (1 - fu * fu * 0.6) * 40 * k + (r2() - 0.5) * 8 * k;
      var frx = (22 + r2() * 18) * k, fry = (12 + r2() * 9) * k;
      more += path(blob(fx, fy, frx, fry, 8, r2, 0.25, 0.32), fresh);
      moreTops += path(blob(fx - frx * 0.2, fy - fry * 0.4, frx * 0.5, fry * 0.36, 7, r2, 0.3, 0.3), freshLt, { opacity: 0.75 });
    }
    // a second dip, at the left, where it has fallen in too
    more += ell(cx - w * 0.26, y0 - 14 * k, 30 * k, 9 * k, soilDk, { opacity: 0.9 });
    // crumbs thrown further out
    for (i = 0; i < 22; i++) {
      var sd2 = i % 2 ? 1 : -1, fcx = cx + sd2 * (w * 0.46 + r2() * w * 0.14), fcy = base - r2() * 40 * k;
      far += path(blob(fcx, fcy, (4 + r2() * 6) * k, (3 + r2() * 3) * k, 6, r2, 0.3, 0.3), r2() < 0.5 ? fresh : soilLt);
    }
    return lumps + tops + more + moreTops + roots + crumbs + far;
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
  // chapter 4's rows of ten, small in the wide shot: ten across between the cat at `pile-left` and the old tom at `beside`
  var MAINROWS = { cx: 622, y0: 838, k0: 0.385, yh: 560, a: 0.16, dugW: 4.6, dugK: 1.3, hit: 70, behind: 0.6, shade: 742, open: [345, 895] };
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
    var rows = rowList(o);
    if (rows) {
      // chapter 4: rows of ten running back into the arch's mouth, on a little more of its floor
      back += ell(ocx, obase - 52, (ox1 - ox0) * 0.45, 62, mix(p.wood, p.shade, 0.5), { opacity: 0.92 });
      var rp = rowsPile(S, MAINROWS, rows, 7, 0);
      back += rp.dug + g(rp.svg, wet ? null : { filter: pileTint(S) });
      keepBoxes(S, rp.boxes);
    } else {
      if (o.dug) back += dugEarth(S, MAIN.cx, MAIN.base - 36, 420, 0.9, 421, o.dug === 'big');
      var pile = pileSvg(S, MAIN.cx, MAIN.base, MAIN.pw, 7), vole = o.vole ? looseVole(S, MAIN.vole[0], MAIN.vole[1], MAIN.pw * MAIN.vole[2]) : null;
      back += g(pile.svg + (vole ? vole.svg : ''), S.tod === 'morning' || S.tod === 'day' ? null : { filter: pileTint(S) });
      keepBoxes(S, pile.boxes.concat(vole ? [vole.box] : []));
    }
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
  // chapter 4's rows of ten, between the cat at `pile-left` and the old tom at `beside` (and whole in the close-up)
  var LOWROWS = { cx: 708, y0: 905, k0: 0.65, yh: 560, a: 0.24, dugW: 4.6, dugK: 1.3, hit: 84, behind: 0.6, shade: 744, open: [170, 1170] };

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
    var rows = rowList(o);
    if (rows) {
      // chapter 4: rows of ten between the arch's legs, the floor carried a little further back for them
      back += ell(LOWROWS.cx, 778, 560, 60, S.linU([[0, mix(p.wood, p.shade, 0.52)], [1, mix(p.wood, p.shade, 0.4)]], 0, 718, 0, 790));
      var rp = rowsPile(S, LOWROWS, rows, 7, 0);
      back += rp.dug + g(rp.svg, wet ? null : { filter: pileTint(S) });
      keepBoxes(S, rp.boxes);
    } else {
      // (big: grown from a slightly narrower base here, a touch to the left, so it stays inside the arch's legs)
      var bigDug = o.dug === 'big';
      if (o.dug) back += dugEarth(S, bigDug ? LOW.cx - 30 : LOW.cx, LOW.base - 76, bigDug ? 660 : 760, 1.5, 518, bigDug);
      var pile = pileSvg(S, LOW.cx, LOW.base, LOW.pw, 7), vole = o.vole ? looseVole(S, LOW.vole[0], LOW.vole[1], LOW.pw * LOW.vole[2]) : null;
      back += g(pile.svg + (vole ? vole.svg : ''), wet ? null : { filter: pileTint(S) });
      keepBoxes(S, pile.boxes.concat(vole ? [vole.box] : []));
    }
    // foreground: grass and a frond at the bottom edge, clear of the cast
    var avoid = avoidBoxes(S, 16);
    front += g(K.tufts(S, 0, 1600, 985, 1014, 26, 519, p.grassNear, p.grassLight, 2.6) +
      K.fernClump(S, 1660, 1040, 330, { seed: 520, count: 5, spread: 1.3, lean: -0.55, avoid: avoid }), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  // ================================================================== chapter 4: rows of ten, the gap, the "scale"

  var circ = K.circ, n4 = K.n4;
  var PLACE = 118;   // one place in a row, in a piece's own units (a mouse is 110 long)
  var MORNING = [10, 10, { n: 10, gap: [3, 4, 5, 6] }];   // the third morning: thirty laid out, four gone from the back row

  // `rows`: the pile laid in rows, the front row first. Each entry is a count (0-10) or { n, gap }
  // (places counted from 0: { n: 10, gap: [3, 4, 5, 6] } is three pieces, four empty places, three
  // pieces); a bare number is that many rows of ten. Null when the scene is in pairs (chapters 2, 3).
  function rowList(o) {
    var v = o ? o.rows : null, i;
    if (typeof v === 'number' && isFinite(v)) { var a = []; for (i = 0; i < clamp(Math.round(v), 0, 5); i++) a.push(10); v = a; }
    if (!Array.isArray(v)) return null;
    return v.slice(0, 5).map(function (e) {
      var obj = !!e && typeof e === 'object', count = optInt(obj ? e.n : e, 10, 0, 10), gap = [];
      if (obj && Array.isArray(e.gap)) e.gap.forEach(function (j) { j = Math.round(+j); if (j >= 0 && j < count && gap.indexOf(j) < 0) gap.push(j); });
      gap.sort(function (p1, p2) { return p1 - p2; });
      return { n: count, gap: gap };
    });
  }

  // Where things lie on a composition's floor. G = { cx, y0, k0, yh, a }: the front row's base and a
  // piece's scale there, and how both shrink with each row back (toward yh, by a a row).
  function depthGeo(G, d) { var s = 1 / (1 + G.a * d); return { y: G.yh + (G.y0 - G.yh) * s, k: G.k0 * s, sp: PLACE * G.k0 * s }; }
  function rowGeo(G, rows, first) {
    return rows.map(function (rw, i) {
      var q = depthGeo(G, i), xs = [];
      for (var j = 0; j < rw.n; j++) xs.push(G.cx + (j - (rw.n - 1) / 2) * q.sp);
      // `r`: the row's own number in the pile (its kinds and seeds follow it, so the back row is the
      // same pieces from every camera, the `gap` camera's close view of it too)
      return { r: (first || 0) + i, n: rw.n, gap: rw.gap, y: q.y, k: q.k, sp: q.sp, xs: xs, h: PREY.mouse.bh * q.k };
    });
  }
  // tidy: every piece faces the same way, mice and voles turn about, the rows out of step
  function placeKind(r, j) { return (r + j) % 2 ? 'mouse' : 'vole'; }
  function rowPiece(kind, seed, lit, part, x, y, k) {
    var spec = PREY[kind], p1 = art.prey({ kind: kind, seed: seed, facing: 'right', lit: lit, part: part });
    return p1.svg ? '<g transform="' + tr(x - (spec.bw + M * 2) * k / 2, y - (spec.bh + M) * k, k) + '">' + p1.svg + '</g>' : '';
  }
  // An empty place: the earth pressed smooth where a piece lay last night (so four empty places
  // read as four, side by side).
  function placeMark(S, x, y, sp) {
    var p = S.pal;
    return ell(x, y - sp * 0.05, sp * 0.4, sp * 0.09, mix(p.wood, p.shade, 0.6), { opacity: 0.6 }) +
      ell(x, y - sp * 0.062, sp * 0.33, sp * 0.06, mix(p.wood, p.sand, 0.3), { opacity: 0.5 }) +
      stroke('M' + n(x - sp * 0.34) + ' ' + n(y - sp * 0.01) + 'q' + n(sp * 0.34) + ' ' + n(sp * 0.085) + ' ' + n(sp * 0.68) + ' 0', mix(p.sand, p.rim, 0.4), Math.max(1, sp * 0.022), { opacity: 0.7 });
  }
  function rowSvg(S, row, lit, seed) {
    var marks = '', shadows = '', glow = '', bodies = '', sparks = '';
    for (var j = 0; j < row.n; j++) {
      var x = row.xs[j];
      if (row.gap.indexOf(j) >= 0) { marks += placeMark(S, x, row.y, row.sp); continue; }
      var kind = placeKind(row.r, j), sd = seed + row.r * 16 + j;
      shadows += ell(x, row.y - 1, row.sp * 0.45, row.sp * 0.075, S.pal.shade, { opacity: 0.3 });
      if (lit) glow += rowPiece(kind, sd, true, 'glow', x, row.y, row.k);
      bodies += rowPiece(kind, sd, lit, 'body', x, row.y, row.k);
      if (lit) sparks += rowPiece(kind, sd, true, 'spark', x, row.y, row.k);
    }
    return g(marks, { 'data-art': 'places' }) + shadows + (glow ? g(glow, { 'class': 'pcs-pulse' }) : '') + bodies + sparks;
  }

  // `back: 'shadow'`: the back row under the brambles, before she walks to it. The brambles' shade
  // lies over the back of the floor, a pool of it deepest in the middle; the row's two ends come out
  // of it (its three outermost places each side, drawn whatever the row holds), and nothing in the
  // middle can be made out: no gap, no dug earth, no "scale". The same picture whatever the back row
  // holds and whatever dug, scale and glint say.
  function shadowBand(S, G, row, seed) {
    var p = S.pal, deep = mix(mix(p.wood, p.shade, 0.82), mix(p.leaf, p.shade, 0.8), 0.45), F = G.shade, s = '', ends = '', tips = '', j;
    for (j = 0; j < row.n; j++) {
      if (Math.abs(j - (row.n - 1) / 2) < 2.5) continue;
      ends += ell(row.xs[j], row.y - 1, row.sp * 0.45, row.sp * 0.075, p.shade, { opacity: 0.3 }) + rowPiece(placeKind(row.r, j), seed + row.r * 16 + j, false, 'body', row.xs[j], row.y, row.k);
    }
    // the shade over the far floor, and the deep pool of it across the row's middle
    s += ell(G.cx, F, (G.open[1] - G.open[0]) * 0.56, row.y + row.h * 1.25 - F, S.radB('pileshade', [[0, deep, 0.86], [0.74, deep, 0.78], [1, deep, 0]]));
    s += ell(G.cx, row.y - row.h * 0.62, row.sp * 4.5, row.h * 1.9, S.radB('pileband', [[0, deep, 0.98], [0.44, deep, 0.97], [0.6, deep, 0.84], [0.82, deep, 0.4], [1, deep, 0]]));
    // bramble tips hanging into it: this is the brambles' own shade
    for (var i = 0; i < 5; i++) {
      var tx = G.cx + (i - 2) * row.sp * 1.55 + (i % 2 ? 0.3 : -0.2) * row.sp, ty = row.y - row.h * 2.1 - (i % 2) * row.h * 0.3;
      tips += leafD(tx, ty, row.sp * 0.46, 1.5 + (i % 3) * 0.25, row.sp * 0.15) + leafD(tx + row.sp * 0.15, ty - row.sp * 0.1, row.sp * 0.4, 0.7, row.sp * 0.13) + leafD(tx - row.sp * 0.1, ty - row.sp * 0.06, row.sp * 0.38, 2.5, row.sp * 0.12);
    }
    return ends + s + path(tips, mix(mix(p.leaf, p.shade, 0.7), p.leaf, 0.3), { opacity: 0.9 });
  }

  // ------------------------------------------------------------------ the "scale"

  // Its outline in its own units, standing on its blunt point at (0, 0), the round end up: as big as
  // a cat's paw (52 by 58, against a mouse's 110 by 64), flat, shaped like a giant fish's scale, and
  // smooth at every edge. `u`: world units to a unit.
  function scaleD(u) {
    function q(x, y) { return n(x * u) + ' ' + n(y * u); }
    return 'M' + q(-5, -1) + 'Q' + q(0, 2.2) + ' ' + q(5, -1) + 'C' + q(14, -9) + ' ' + q(24, -24) + ' ' + q(26, -38) +
      'C' + q(27.4, -50) + ' ' + q(16, -58) + ' ' + q(0, -58) + 'C' + q(-16, -58) + ' ' + q(-27.4, -50) + ' ' + q(-26, -38) +
      'C' + q(-24, -24) + ' ' + q(-14, -9) + ' ' + q(-5, -1) + 'Z';
  }
  // Clear, with a faint green cast where it is thickest (its edge), and a white shine: tower glass,
  // nothing like a Mistscale's matte grey ridges.
  var GLASS = { clear: '#E2F6EC', green: '#8ED4B2', deep: '#5FB392', line: '#3E9273' };

  // Small, in a row: standing on its point at (x, y) and leaning `lean` (+1 right, -1 left) on the
  // next piece; or `flat`, lying on the bare earth. Returns { svg, box (for keep), top (where the sun
  // catches it: the glint's place) }.
  function scaleSmall(S, at) {
    var u = at.u, d = scaleD(u), rot = at.flat ? 74 * at.lean : 24 * at.lean;
    var t = 'translate(' + n(at.x) + ' ' + n(at.y) + ')' + (at.flat ? ' scale(1 0.5)' : '') + ' rotate(' + rot + ')';
    var s = ell(at.x + at.lean * u * (at.flat ? 24 : 9), at.y + u * 0.6, u * (at.flat ? 30 : 17), u * 3.2, S.pal.shade, { opacity: 0.3 });
    var glass = path(d, 'none', { stroke: GLASS.deep, 'stroke-width': n(Math.max(0.8, u * 1.2)), 'stroke-linejoin': 'round', opacity: 0.6, transform: 'translate(' + n(u * 2.4) + ' ' + n(u * 1.2) + ')' }) +
      path(d, GLASS.clear, { opacity: 0.58 }) +
      path(d, 'none', { stroke: GLASS.green, 'stroke-width': n(u * 4), 'stroke-linejoin': 'round', opacity: 0.6, transform: 'translate(0 ' + n(-2.9 * u) + ') scale(0.9)' }) +
      path(d, 'none', { stroke: GLASS.line, 'stroke-width': n(Math.max(1, u * 1.5)), 'stroke-linejoin': 'round', opacity: 0.9 }) +
      stroke('M' + n(-16 * u) + ' ' + n(-20 * u) + 'L' + n(4 * u) + ' ' + n(-51 * u), '#FFFFFF', u * 7, { opacity: 0.36 }) +
      stroke('M' + n(-3 * u) + ' ' + n(-12 * u) + 'L' + n(15 * u) + ' ' + n(-42 * u), '#FFFFFF', u * 2.4, { opacity: 0.3 }) +
      stroke('M' + n(-17 * u) + ' ' + n(-45 * u) + 'L' + n(-9 * u) + ' ' + n(-52.5 * u), '#FFFFFF', Math.max(1.2, u * 2.2), { opacity: 0.95 });
    s += g(glass, { transform: t });
    var r = u * 62;
    return { svg: g(s, { 'data-art': 'scale' }), box: { x: at.x - r * 0.75, y: at.y - (at.flat ? r * 0.5 : r), w: r * 1.5, h: at.flat ? r * 0.62 : r * 1.06 }, top: at.flat ? [at.x + at.lean * u * 26, at.y - u * 12] : [at.x + at.lean * u * 9, at.y - u * 47] };
  }

  // The glitter: a star of light where the sun catches the "scale". It pulses softly (pcs-pulse).
  // With `hit`, the glitter Tap is on it: the group carries data-art="glint", and a wide unpainted
  // circle makes its box a generous target for the UI.
  function star(x, y, R, r2, rot) {
    var P = [];
    for (var i = 0; i < 8; i++) { var a = rot + Math.PI * i / 4, rr = i % 2 ? r2 : R; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    return K.pts(P) + 'Z';
  }
  function glintSvg(S, x, y, r, hit) {
    var s = circ(x, y, r * 1.7, S.radU([[0, '#FFFFFF', 0.9], [0.3, '#FFF7D2', 0.45], [1, '#FFF7D2', 0]], x, y, r * 1.7));
    s += path(star(x, y, r * 1.5, r * 0.11, -Math.PI / 2), '#FFFFFF') + path(star(x, y, r * 0.78, r * 0.13, -Math.PI / 4), '#FFFDF0', { opacity: 0.92 }) + circ(x, y, r * 0.24, '#FFFFFF');
    s = g(s, { 'class': 'pcs-pulse' });
    if (hit) s += circ(x, y, hit, 'none');
    return g(s, hit ? { 'data-art': 'glint' } : { 'data-art': 'glimmer' });
  }

  // Where the "scale" lies in a row: in the gap, leaning on the next piece (the one after the last
  // empty place; the one before the first, when the gap runs to the row's end).
  function scaleSpot(row) {
    if (!row || !row.n) return null;
    var gp = row.gap, last = gp.length ? gp[gp.length - 1] : -1;
    if (gp.length && last + 1 < row.n) return { x: row.xs[last] + row.sp * 0.28, y: row.y, u: row.k, lean: 1 };
    if (gp.length && gp[0] > 0) return { x: row.xs[gp[0]] - row.sp * 0.28, y: row.y, u: row.k, lean: -1 };
    if (gp.length) return { x: row.xs[last], y: row.y, u: row.k, lean: 1, flat: true };
    // no gap to lie in: it leans on the row's last piece, from outside
    return { x: row.xs[row.n - 1] + row.sp * 0.72, y: row.y, u: row.k, lean: -1 };
  }

  // The pile in rows on the floor G. `first`: the pile's row number of rows[0] (the `gap` camera
  // draws the back row alone). Returns { dug, svg, boxes } (the dug earth apart: it is not prey, and
  // takes no evening tint). Options: lit (the first n rows glow, the front row first), dug, back,
  // scale, glint.
  function rowsPile(S, G, rows, seed, first) {
    var o = S.opts, geo = rowGeo(G, rows, first), R = geo.length, lit = optInt(o.lit, 0, 0, 10), back = R ? geo[R - 1] : null;
    var shadow = o.back === 'shadow' && !!back, out = { dug: '', svg: '', boxes: [] }, spot = null, sc = null, r;
    if (back && !shadow) {
      var gx = back.gap.length ? (back.xs[back.gap[0]] + back.xs[back.gap[back.gap.length - 1]]) / 2 : G.cx;
      var kd = back.k * (G.dugK || 1.35), dugY = back.y - back.h * 0.34 - 5 * kd, behind = G.behind || 0.4;
      // tonight the rows are laid a little forward of where it was found: behind the back row there is
      // bare earth, the "scale" on it, and then the dug earth
      if (o.scale === 'behind') dugY = Math.min(dugY, depthGeo(G, R + behind + 0.55).y - 4 * kd);
      // chapter 5: the same earth with tiny prints in it, or swept flat (either draws it, `dug` or not)
      var dugW = back.sp * (G.dugW || 5), bigDug = o.dug === 'big', pk = G.printK || 11;
      if (o.swept === true) out.dug = g(sweptEarth(S, gx, dugY, dugW, kd, seed + 31, bigDug), { 'data-art': 'swept' });
      else if (o.dug) out.dug = g(dugEarth(S, gx, dugY, dugW, kd, seed + 31, bigDug), { 'data-art': 'dug' });
      else if (o.prints === true) out.dug = g(dugEarth(S, gx, dugY, dugW, kd, seed + 31, false), { 'data-art': 'dug' });
      if (o.prints === true && o.swept !== true) { var tp = tinyPrints(S, gx, dugY, dugW, kd, seed + 31, bigDug, pk); out.dug += tp.svg; out.prints = tp.box; }
      if (out.dug) out.earth = earthBox(gx, dugY, dugW, kd, bigDug, o.swept === true);
      if (o.scale === 'behind') {
        var bd = depthGeo(G, R + behind);
        spot = { x: G.cx + bd.sp * 1.7, y: bd.y, u: bd.k, lean: 1, flat: true };
        sc = scaleSmall(S, spot);
        out.svg += sc.svg + glintSvg(S, sc.top[0], sc.top[1], Math.max(7, bd.k * 26), 0);
      }
    }
    for (r = R - 1; r >= 0; r--) {
      var row = geo[r], mh = M * row.k;
      if (shadow && r === R - 1) out.svg += g(shadowBand(S, G, row, seed), { 'data-art': 'band' });
      else out.svg += g(rowSvg(S, row, r < lit, seed), { 'data-art': 'row', 'data-row': row.r });
      if (row.n) out.boxes.unshift({ x: G.cx - row.n * row.sp / 2, y: row.y - row.h - mh, w: row.n * row.sp, h: row.h + mh });
      // this morning: in the gap, leaning on the next piece
      if (r === R - 1 && !shadow && o.scale !== 'behind' && (o.scale === true || o.glint === true)) {
        spot = scaleSpot(row);
        if (spot && o.scale === true) { sc = scaleSmall(S, spot); out.svg += sc.svg; }
      }
    }
    if (spot && !shadow) {
      var top = sc ? sc.top : [spot.x + spot.lean * spot.u * 9, spot.y - spot.u * 47];
      // the sun has slid over the towers: a shaft of it reaches down through the brambles to the "scale"
      if (o.glint === true) out.svg += sunShaft(S, top[0], spot.y, spot.u * 30) + glintSvg(S, top[0], top[1], Math.max(16, spot.u * 44), Math.max(G.hit || 80, spot.u * 90));
      out.boxes.push(sc ? sc.box : { x: top[0] - 30, y: top[1] - 30, w: 60, h: 60 });
    }
    return out;
  }

  // ------------------------------------------------------------------ rows and gap (under the arch, from the front)

  // Under the bramble arch, looking in from the open side: the back of the arch in deep cool shade,
  // the packed-earth floor from C.floor down, the canopy overhead (its lower edge about C.canopy), a
  // leg of brambles each side (C.legs wide), canes looping down. C.key keeps its gradients apart.
  function insideArch(S, C) {
    var p = S.pal, r = rng(C.seed), wet = S.tod === 'morning' || S.tod === 'day', s = '', i, x;
    var deep = mix(p.leaf, p.shade, 0.66), mid = mix(p.leaf, p.shade, 0.42), F = C.floor, L = C.leaf || 1, top = C.canopy, lw = C.legs;
    s += rect(-10, -10, 1620, F + 60, S.linU([[0, deep], [0.6, deep], [1, mid]], 0, 0, 0, F + 40));
    s += leafTex(S, 0, 1600, top - 20, F, Math.round(190 / L), 30 * L, C.seed + 3, mix(p.leaf, p.shade, 0.8), 0.7);
    s += leafTex(S, 0, 1600, top + 30, F, Math.round(64 / L), 28 * L, C.seed + 4, mix(p.leafMid, p.shade, 0.4), 0.45);
    // the floor: packed earth, darkest at the back where the brambles hang lowest
    s += path('M-10 ' + n(F + 10) + 'Q400 ' + n(F - 12) + ' 800 ' + n(F) + 'Q1200 ' + n(F + 10) + ' 1610 ' + n(F - 4) + 'V1010H-10Z',
      S.lin(C.key + 'floor', [[0, mix(p.wood, p.shade, 0.52)], [0.3, mix(p.wood, p.shade, 0.3)], [1, mix(p.wood, p.sand, 0.2)]]));
    // daylight from the open side behind us, across the floor
    s += g(poly([[880, F - 30], [1700, F - 30], [1560, 1010], [330, 1010]], S.linU([[0, p.sun || p.glow, 0], [0.45, p.sun || p.glow, 0.17], [1, p.sun || p.glow, 0.06]], 0, F - 30, 0, 1000)), { style: 'mix-blend-mode:screen' });
    s += path(blob(lw + 60, F + 70, 110, 15, 9, rng(C.seed + 5), 0.3, 0.3) + blob(1540 - lw, F + 58, 104, 14, 8, rng(C.seed + 6), 0.3, 0.3) +
      blob(330, 992, 150, 20, 9, rng(C.seed + 7), 0.3, 0.3) + blob(1300, 996, 130, 18, 9, rng(C.seed + 8), 0.3, 0.3), p.moss, { opacity: 0.85 });
    var lv = '', spots = '';
    for (i = 0; i < 15; i++) lv += leafD(40 + r() * 1520, F + 34 + r() * (950 - F), (16 + r() * 8) * L, r() * 6.28, 6.5 * L);
    s += path(lv, '#C98A45', { opacity: 0.72 });
    [[0.2, 0.3, 30], [0.42, 0.72, 24], [0.66, 0.2, 34], [0.86, 0.55, 22]].forEach(function (q) {
      spots += ell(160 + q[0] * 1280, F + 50 + q[1] * (930 - F), q[2] * 1.9, q[2] * 0.42, mix(p.rim, p.sand, 0.4), { opacity: 0.12 });
    });
    s += spots;
    // the arch overhead, seen from below, and its two legs
    var edge = [];
    for (x = 1640; x >= -40; x -= 80) edge.push([x, top + Math.sin(x * 0.008 + 1) * 24 + (r() - 0.5) * 22]);
    var canopy = [[-40, -40], [1640, -40]].concat(edge), foot = F + (C.foot || 90);
    var leg = [[-40, top - 40], [lw * 0.62, top - 16], [lw, top + 80], [lw * 0.84, (top + foot) / 2 - 40], [lw * 1.04, (top + foot) / 2 + 70], [lw * 0.8, foot - 70], [lw * 0.95, foot], [-40, foot]];
    var legR = leg.map(function (q) { return [1600 - q[0], q[1]]; }).reverse();
    var arch = brambleMass(S, leg, lw * 0.3, (top + foot) / 2, [6, 0], C.seed + 11, wet) + brambleMass(S, legR, 1600 - lw * 0.3, (top + foot) / 2, [-6, 0], C.seed + 12, wet) +
      brambleMass(S, canopy, 800, top - 160, [0, 8], C.seed + 13, wet);
    // canes looping down from the canopy and over the legs, cane tips hanging into the shade
    var vo = { stem: '', thorns: '', leaves: '', blossoms: '', berries: '' }, w = 12 * L;
    [[-20, 250], [270, 560], [520, 860], [800, 1120], [1060, 1360], [1320, 1620]].forEach(function (c) {
      var sag = (60 + r() * 50) * L, y0 = top - 10 + (r() - 0.5) * 30, y1 = top - 10 + (r() - 0.5) * 30;
      vine([c[0], y0], [c[0] + 60, y0 + sag], [c[1] - 60, y1 + sag], [c[1], y1], w, r, vo);
    });
    vine([lw, top + 40], [lw + 40, top + 170], [lw - 50, foot - 230], [lw, foot - 110], w, r, vo);
    vine([1600 - lw, top + 40], [1560 - lw, top + 170], [1650 - lw, foot - 230], [1600 - lw, foot - 110], w, r, vo);
    var stemCol = mix(p.woodDark, p.leaf, 0.35), drip = '', dl = '';
    arch += stroke(vo.stem, p.rim, 9 * L, { transform: 'translate(0 4)', opacity: 0.6 }) + stroke(vo.stem, stemCol, 11 * L) + path(vo.thorns, stemCol) +
      path(vo.leaves, p.rim, { transform: 'translate(0 3)', opacity: 0.5 }) + path(vo.leaves, p.leafMid) +
      path(vo.berries, '#4A2A4E') + path(vo.blossoms, '#FFF6EA', { opacity: 0.92 });
    [[360, 96], [690, 130], [990, 90], [1250, 116]].forEach(function (c, j) {
      var len = c[1] * L, cy = top + 24;
      drip += 'M' + n(c[0]) + ' ' + n(cy) + 'q' + n(14 - j * 6) + ' ' + n(len * 0.5) + ' ' + n(-6 + j * 3) + ' ' + n(len);
      dl += leafD(c[0] - 6 + j * 3, cy + len, 26 * L, 1.7, 10 * L) + leafD(c[0] + 4, cy + len * 0.55, 22 * L, j % 2 ? 0.5 : 2.6, 8 * L) + leafD(c[0], cy + len * 0.25, 20 * L, j % 2 ? 2.7 : 0.4, 7 * L);
    });
    arch += stroke(drip, stemCol, 5 * L) + path(dl, p.leafMid);
    return s + g(arch, { filter: S.shadow('l') });
  }

  // `rows`: from the front, the rows running back under the brambles. Cats sit clear of the rows'
  // ends: one at the front each side, and further back beside the second and the back row.
  var ROWS = { cx: 800, y0: 925, k0: 0.98, yh: -190, a: 0.13, dugW: 4.5, dugK: 1.2, hit: 96, behind: 0.45, shade: 470, open: [140, 1460] };
  function drawRows(S) {
    var p = S.pal, o = S.opts, wet = S.tod === 'morning' || S.tod === 'day', back = '', front = '';
    back += insideArch(S, { key: 'pilerows', seed: 601, floor: 470, canopy: 196, legs: 132, leaf: 1, foot: 190 });
    var rp = rowsPile(S, ROWS, rowList(o) || rowList({ rows: MORNING }), 7, 0);
    back += rp.dug + g(rp.svg, wet ? null : { filter: pileTint(S) });
    keepBoxes(S, rp.boxes);
    var avoid = avoidBoxes(S, 16);
    front += g(K.tufts(S, 0, 1600, 985, 1014, 22, 619, p.grassNear, p.grassLight, 2.4) +
      K.fernClump(S, 1670, 1044, 300, { seed: 620, count: 5, spread: 1.3, lean: -0.55, avoid: avoid }) +
      K.fernClump(S, -70, 1044, 280, { seed: 621, count: 5, spread: 1.3, lean: 0.55, avoid: avoid }), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  // `gap`: she has come to the back row. The row across the panel, the hole right in its middle, the
  // earth behind it (dug: 'big' heaps it up there); the cats sit in front of the row, the middle clear.
  var GAP = { cx: 800, y0: 612, k0: 1.3, yh: -190, a: 0.13, dugW: 4.4, dugK: 1.25, hit: 120, behind: 0.9, shade: 430, open: [100, 1500] };
  function drawGap(S) {
    var p = S.pal, o = S.opts, wet = S.tod === 'morning' || S.tod === 'day', back = '', front = '';
    back += insideArch(S, { key: 'pilegap', seed: 651, floor: 430, canopy: 150, legs: 100, leaf: 1.3, foot: 230 });
    var rows = rowList(o) || rowList({ rows: MORNING });
    var rp = rowsPile(S, GAP, rows.slice(-1), 7, Math.max(0, rows.length - 1));
    back += rp.dug;
    // chapter 5: the "scale" lies behind the row now, and the fresh dug earth is what a noticing cat
    // taps: an unpainted target over the heap (the page draws its glow), which the lettering keeps off
    var tap = o.scale === 'behind' && rp.earth && o.swept !== true && o.prints !== true ? rp.earth : null;
    if (tap) back += rect(tap.x, tap.y, tap.w, tap.h, 'none', { 'class': 'pc-tap', 'data-art': 'dug-tap', 'pointer-events': 'none' });
    back += g(rp.svg, wet ? null : { filter: pileTint(S) });
    keepBoxes(S, rp.boxes);
    if (tap) keepBoxes(S, [tap]);
    if (rp.prints) keepBoxes(S, [rp.prints]);
    front += g(K.tufts(S, 0, 1600, 988, 1014, 18, 669, p.grassNear, p.grassLight, 2.4), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ chapter 5: prints in the dug earth, the earth swept flat, its close-up

  // the dug earth's colours (dugEarth's own)
  function soilCols(S) {
    var p = S.pal;
    return { soil: mix('#7A5638', p.shade, 0.18), lt: mix('#A27A55', p.rim, 0.12), dk: mix('#4E3524', p.shade, 0.2),
      press: mix('#2A1B12', p.shade, 0.25), lip: mix('#C9A27A', p.rim, 0.2) };
  }
  // Where the earth lies, as a box { x, y, w, h }: the heap dugEarth draws at (cx, base), or the flat
  // patch sweptEarth leaves there.
  function earthBox(cx, base, w, k, big, swept) {
    if (big) { w *= 1.22; k *= 1.2; }
    return swept ? { x: cx - w * 0.6, y: base - 40 * k, w: w * 1.2, h: 52 * k } : { x: cx - w * 0.5 - 16 * k, y: base - 84 * k, w: w + 32 * k, h: 90 * k };
  }
  // One tiny print pressed in soft earth at (x, y): a small pad and four toes, L long, the toes along
  // `ang` (radians on the ground), the ground foreshortened by fs. (Nobody counts the toes: the text
  // sizes the prints, "half the size of yours", and no more.)
  function tinyPrintD(x, y, L, ang, fs) {
    var ca = Math.cos(ang), sa = Math.sin(ang), d = '';
    function oval(u0, v0, ru, rv, f) {
      var Q = [], cf = Math.cos(f), sf = Math.sin(f);
      for (var j = 0; j < 10; j++) {
        var t = Math.PI * 2 * j / 10, a = Math.cos(t) * ru, b = Math.sin(t) * rv, u = u0 + cf * a - sf * b, v = v0 + sf * a + cf * b;
        Q.push([x + (ca * u - sa * v) * L, y + (sa * u + ca * v) * L * fs]);
      }
      return K.pts(Q) + 'Z';
    }
    d += oval(-0.16, 0, 0.25, 0.2, 0);
    [-0.82, -0.28, 0.28, 0.82].forEach(function (f, i) { var rr = i === 0 || i === 3 ? 0.31 : 0.4; d += oval(Math.cos(f) * rr, Math.sin(f) * rr, 0.12, 0.082, f); });
    return d;
  }
  // `prints: true`: tiny prints in the dug earth. A spill of loose earth at the heap's foot, and a
  // short line of prints pressed in it, left foot and right taking turns, each `pk` × k long (half a
  // cat's paw at that depth, drawn a little big so it can be found). Returns { svg, box }.
  function tinyPrints(S, cx, base, w, k, seed, big, pk) {
    if (big) { w *= 1.22; k *= 1.2; }
    var c = soilCols(S), r = rng(seed + 307), L = pk * k, fs = 0.5, ya = base - 4 * k, all = '', tagged = '';
    var count = clamp(Math.round(w * 0.6 / (L * 3)) + 1, 3, 7);
    var s = path(blob(cx, ya, w * 0.4, 14 * k, 12, r, 0.12, 0.2), c.soil) + path(blob(cx - w * 0.02, ya - 2.5 * k, w * 0.35, 9.5 * k, 11, r, 0.12, 0.2), c.lt, { opacity: 0.62 });
    for (var i = 0; i < count; i++) {
      var t = (i + 0.5) / count, x = cx + (t - 0.5) * w * 0.62, y = ya - 1.5 * k - Math.sin(Math.PI * t) * 3.5 * k + (i % 2 ? 1 : -1) * L * 0.2;
      var d = tinyPrintD(x, y, L, -0.1 - Math.cos(Math.PI * t) * 0.12 + (r() - 0.5) * 0.24, fs);
      all += d;
      tagged += '<path d="' + d + '" data-print="tiny"/>';
    }
    // each print: the lit lip at its near edge, then the pressed dark of it
    s += path(all, c.lip, { opacity: 0.7, transform: 'translate(0 ' + n(Math.max(1, L * 0.07)) + ')' }) + g(tagged, { fill: c.press, opacity: 0.86 });
    return { svg: g(s, { 'data-art': 'prints' }), box: { x: cx - w * 0.31 - L, y: ya - 6 * k - L * 0.5, w: w * 0.62 + L * 2, h: 8 * k + L } };
  }
  // `swept: true`: the same earth a panel later, swept flat by the old tom's tail as he stomps round
  // the pile: no heap and no prints, a low smooth patch with long side-to-side strokes in it, and a
  // little ridge of crumbs where each stroke ended.
  function sweptEarth(S, cx, base, w, k, seed, big) {
    if (big) { w *= 1.22; k *= 1.2; }
    var c = soilCols(S), r = rng(seed + 211), yc = base - 18 * k, arcs = '', crumbs = '', i;
    var s = ell(cx, yc + 5 * k, w * 0.58, 22 * k, c.dk, { opacity: 0.8 });
    s += path(blob(cx, yc, w * 0.55, 18 * k, 14, r, 0.1, 0.07), c.soil);
    s += path(blob(cx - w * 0.03, yc - 3 * k, w * 0.46, 11.5 * k, 12, r, 0.1, 0.07), c.lt, { opacity: 0.5 });
    for (i = 0; i < 6; i++) {
      var t = i / 5, yy = yc - 12 * k + t * 23 * k, half = w * (0.5 - Math.abs(t - 0.45) * 0.36) * (0.9 + r() * 0.1), sag = (4 + r() * 3.5) * k, x0 = cx - half + (r() - 0.5) * 10 * k;
      arcs += 'M' + n(x0) + ' ' + n(yy) + 'Q' + n(cx + (r() - 0.5) * w * 0.1) + ' ' + n(yy + sag) + ' ' + n(x0 + half * 2) + ' ' + n(yy - 2 * k);
      for (var j = 0; j < 4; j++) crumbs += blob(x0 + half * 2 + (2 + r() * 12) * k, yy - 2 * k + (r() - 0.5) * 9 * k, (2.5 + r() * 4) * k, (1.8 + r() * 2.4) * k, 6, r, 0.3, 0.3);
    }
    s += stroke(arcs, c.dk, 2.8 * k, { opacity: 0.5 }) + stroke(arcs, c.lip, 1.1 * k, { opacity: 0.45, transform: 'translate(0 ' + n(2.4 * k) + ')' });
    s += path(crumbs, c.soil) + path(crumbs, c.lt, { opacity: 0.4, transform: 'translate(' + n(-0.8 * k) + ' ' + n(-0.8 * k) + ')' });
    return s;
  }

  // `gap-close`: the dug earth behind the gap, close, from the gap. The brambles' shade behind it, the
  // packed earth in front, the gap's pressed places along the bottom edge, and the "scale" lying
  // beside it when it is behind the row. Fresh; with tiny prints in it; or swept flat.
  var GAPCLOSE = { cx: 800, base: 640, w: 1300, k: 3.6, printK: 15, hz: 262, scale: [1390, 770, 2.4], places: [270, 623, 977, 1330] };
  function drawGapClose(S) {
    var o = S.opts, C = GAPCLOSE, back = '', big = o.dug === 'big';
    back += gapEarth(S, 'pilegapclose', C.hz, 811);
    C.places.forEach(function (x) { back += placeMark(S, x, 1010, 340); });
    if (o.swept === true) back += g(sweptEarth(S, C.cx, C.base, C.w, C.k, 38, big), { 'data-art': 'swept' });
    else {
      back += g(dugEarth(S, C.cx, C.base, C.w, C.k, 38, big), { 'data-art': 'dug' });
      if (o.prints === true) { var tp = tinyPrints(S, C.cx, C.base, C.w, C.k, 38, big, C.printK); back += tp.svg; keepBoxes(S, [tp.box]); }
    }
    if (o.scale === 'behind') {
      var sc = scaleSmall(S, { x: C.scale[0], y: C.scale[1], u: C.scale[2], lean: 1, flat: true });
      back += sc.svg + glintSvg(S, sc.top[0], sc.top[1], C.scale[2] * 22, 0);
      keepBoxes(S, [sc.box]);
    }
    S.weatherClip = S.clip('pilenorain', rect(0, 0, 0, 0, '#fff'));
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ the "scale", close: scale, through, mirror

  // The "scale" big. G = { x, y, u, lean }: its point on the earth, world units to a unit, how far it
  // leans (degrees). `inner`: what shows in the glass, in world units, clipped to its outline (what
  // lies behind it; the camp through it; her reflection). kind: 'clear' | 'through' | 'mirror'.
  function scaleBig(S, G, inner, kind) {
    var u = G.u, d = scaleD(u), t = 'translate(' + n(G.x) + ' ' + n(G.y) + ') rotate(' + n(G.lean) + ')';
    function q(x, y) { return n(x * u) + ' ' + n(y * u); }
    var clip = S.clip('pileglass', '<path d="' + d + '" transform="' + t + '"/>');
    var s = ell(G.x + u * 11, G.y + u * 1.2, u * 25, u * 3.6, S.pal.shade, { opacity: 0.34 });
    // flat: a plate of glass with a little thickness, its far edge showing through it
    var far = path(d, 'none', { stroke: GLASS.deep, 'stroke-width': n(u * 0.9), 'stroke-linejoin': 'round', opacity: 0.6, transform: 'translate(' + n(u * 2.2) + ' ' + n(u * 1.1) + ')' });
    // the faint green cast, deepest toward the edge, where there is most glass to look through
    var body = path(d, GLASS.clear, { opacity: kind === 'clear' ? 0.3 : 0.08 }) +
      path(d, S.radU([[0, GLASS.green, kind === 'clear' ? 0.05 : 0.14], [0.6, GLASS.green, kind === 'mirror' ? 0.15 : 0.24], [0.9, GLASS.green, 0.5], [1, GLASS.deep, 0.78]], 0, -31 * u, 32 * u));
    // flat glass shines in straight bands
    var sheen = poly([[-31 * u, -8 * u], [-18 * u, -8 * u], [10 * u, -64 * u], [-3 * u, -64 * u]], '#FFFFFF', { opacity: 0.2 }) +
      poly([[-9 * u, -2 * u], [-5.5 * u, -2 * u], [22.5 * u, -64 * u], [19 * u, -64 * u]], '#FFFFFF', { opacity: 0.14 });
    var inside = g((inner || '') + g(body + sheen, { transform: t }), { 'clip-path': clip });
    // the bevel just inside the edge, the smooth green edge itself, a bright line where the sun rides the bevel
    var edge = path(d, 'none', { stroke: '#FFFFFF', 'stroke-width': n(u * 0.42), opacity: 0.6, transform: 'translate(0 ' + n(-3.4 * u) + ') scale(0.89)' }) +
      path(d, 'none', { stroke: GLASS.deep, 'stroke-width': n(u * 1.3), 'stroke-linejoin': 'round', opacity: 0.92 }) +
      path(d, 'none', { stroke: GLASS.line, 'stroke-width': n(u * 0.4), 'stroke-linejoin': 'round' }) +
      stroke('M' + q(-21.6, -41) + 'Q' + q(-21.4, -49) + ' ' + q(-13.5, -52.8), '#FFFFFF', u * 0.9, { opacity: 0.95 }) +
      stroke('M' + q(15, -15.5) + 'L' + q(19.5, -24), '#FFFFFF', u * 0.7, { opacity: 0.7 });
    return g(s + g(far, { transform: t }) + inside + g(edge, { transform: t }), { 'data-art': 'scale' });
  }
  // a point of the "scale" (its own units) in the world
  function scaleAt(G, x, y) {
    var a = G.lean * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
    return [G.x + (x * c - y * sn) * G.u, G.y + (x * sn + y * c) * G.u];
  }

  // The earth of the gap, close: packed, crumbs of fresh earth on it, the brambles' shade behind.
  // `hz`: where the floor meets the shade.
  function gapEarth(S, key, hz, seed) {
    var p = S.pal, r = rng(seed), deep = mix(p.leaf, p.shade, 0.7), s = '', a = '', b = '';
    s += rect(-10, -10, 1620, hz + 40, S.linU([[0, deep], [1, mix(deep, p.wood, 0.3)]], 0, 0, 0, hz + 30));
    s += leafTex(S, 0, 1600, 0, hz - 40, 46, 64, seed + 1, mix(p.leaf, p.shade, 0.84), 0.7) + leafTex(S, 0, 1600, 20, hz - 60, 16, 56, seed + 2, mix(p.leafMid, p.shade, 0.45), 0.4);
    s += path('M-10 ' + n(hz + 12) + 'Q500 ' + n(hz - 14) + ' 900 ' + n(hz) + 'Q1300 ' + n(hz + 12) + ' 1610 ' + n(hz - 2) + 'V1010H-10Z',
      S.lin(key + 'earth', [[0, mix(p.wood, p.shade, 0.52)], [0.35, mix(p.wood, p.shade, 0.27)], [1, mix(p.wood, p.sand, 0.22)]]));
    for (var i = 0; i < 64; i++) {
      var x = r() * 1600, y = hz + 24 + Math.pow(r(), 0.8) * (970 - hz), k = 0.5 + (y - hz) / (1000 - hz), bl = blob(x, y, (4 + r() * 9) * k, (2.5 + r() * 5) * k, 6, r, 0.3, 0.3);
      if (i % 3) a += bl; else b += bl;
    }
    return s + path(a, mix(p.wood, p.shade, 0.5), { opacity: 0.6 }) + path(b, mix(p.wood, p.sand, 0.45), { opacity: 0.55 });
  }
  // The piece the "scale" leans on (the one after the gap, in the back row: the same piece, kind and
  // fur, that the other cameras show there), big, for a close-up at G.
  function leanedOn(S, G, rows) {
    var R = rows.length, br = R ? rows[R - 1] : { n: 0, gap: [] }, last = br.gap.length ? br.gap[br.gap.length - 1] : 6, j = Math.min(last + 1, 9), r = Math.max(0, R - 1);
    var sp = PLACE * G.u, x = G.x + sp * 0.72, wet = S.tod === 'morning' || S.tod === 'day';
    return g(ell(x, G.y - 1, sp * 0.46, sp * 0.07, S.pal.shade, { opacity: 0.32 }) + rowPiece(placeKind(r, j), 7 + r * 16 + j, false, 'body', x, G.y, G.u), wet ? null : { filter: pileTint(S) });
  }
  // A shaft of sun coming down from the upper right onto (x, y), `w` wide there, and its pool of light on the earth.
  function sunShaft(S, x, y, w) {
    var c = S.pal.sun || S.pal.glow, dx = y * 0.42;
    return g(poly([[x + dx - w * 0.3, -20], [x + dx + w * 1.5, -20], [x + w * 1.1, y + 30], [x - w * 1.2, y + 30]], S.linU([[0, c, 0], [0.5, c, 0.16], [1, c, 0.3]], 0, 0, 0, y)) +
      ell(x, y + 6, w * 1.5, w * 0.24, S.radU([[0, c, 0.4], [1, c, 0]], x, y + 6, w * 1.5)), { style: 'mix-blend-mode:screen' });
  }

  // `scale`: close on it where it leans, in the gap: the pressed places, the piece it leans on, the
  // dug earth behind (when dug), the sun's flash on it (glint).
  var CLOSE = { x: 528, y: 852, u: 7.6, lean: 22 };
  function drawScale(S) {
    var o = S.opts, rows = rowList(o) || rowList({ rows: MORNING }), back = '', sp = PLACE * CLOSE.u, x0 = CLOSE.x - sp * 0.28;
    back += gapEarth(S, 'pilescale', 438, 701);
    if (o.dug) back += g(dugEarth(S, x0 - sp * 0.5, 476, 1500, 3.1, 705, o.dug === 'big'), { 'data-art': 'dug' });
    back += placeMark(S, x0, CLOSE.y, sp) + placeMark(S, x0 - sp, CLOSE.y, sp);
    back += leanedOn(S, CLOSE, rows);
    if (o.glint === true) back += sunShaft(S, CLOSE.x + 60, CLOSE.y, 200);
    back += scaleBig(S, CLOSE, '', 'clear');
    var at = scaleAt(CLOSE, -17.5, -47), b0 = scaleAt(CLOSE, 0, -30);
    if (o.glint === true) back += glintSvg(S, at[0], at[1], 76, 250);
    keepBoxes(S, [{ x: b0[0] - 31 * CLOSE.u, y: b0[1] - 33 * CLOSE.u, w: 62 * CLOSE.u, h: 64 * CLOSE.u }]);
    S.weatherClip = S.clip('pilenorain', rect(0, 0, 0, 0, '#fff'));
    return { back: back, over: '', front: '' };
  }

  // ---- the camp through it

  function dense(P, closed, step) {
    var out = [], m = closed ? P.length : P.length - 1;
    for (var i = 0; i < m; i++) {
      var a = P[i], b = P[(i + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], k = Math.max(1, Math.ceil(Math.sqrt(dx * dx + dy * dy) / step));
      for (var j = 0; j < k; j++) out.push([a[0] + dx * j / k, a[1] + dy * j / k]);
    }
    if (!closed) out.push(P[P.length - 1]);
    return out;
  }
  function arc(cx, cy, rx, ry, a0, a1, k) {
    var P = [];
    for (var i = 0; i <= k; i++) { var a = a0 + (a1 - a0) * i / k; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    return P;
  }
  function oval(cx, cy, rx, ry) { return arc(cx, cy, rx, ry, 0, Math.PI * 2 * 23 / 24, 23); }
  function straight(q) { return q; }
  // Old window glass: every upright line wanders, every level line dips, and it all sits a little
  // big. (Drawn point by point, so it is the same wobble on the iPad, in print and in Quick Look.)
  function wobbler(cx, cy) {
    return function (q) {
      var x = cx + (q[0] - cx) * 1.05, y = cy + (q[1] - cy) * 1.05;
      return [x + 22 * Math.sin(y / 46 + 0.7) + 8 * Math.sin(y / 17 + x / 120), y + 11 * Math.sin(x / 70 + 1.9) + 4 * Math.sin(x / 25 + y / 80)];
    };
  }
  // The camp as she sees it with her chin on the earth: the glass towers, the hedge all round, the
  // fountain full of rain, the Clan with their noses to the sky (everybody looks up). Every point
  // goes through W: `straight` outside the glass, `wobbler` inside it.
  function campView(S, W) {
    var p = S.pal, s = '', i, hz = 520;
    function wp(P, fill, extra) { return path(K.pts(dense(P, true, 13).map(W)) + 'Z', fill, extra); }
    function wl(P) { return K.pts(dense(P, false, 13).map(W)); }
    s += rect(-40, -40, 1680, hz + 80, S.lin('pilecampsky', [[0, p.sky[0]], [0.55, p.sky[2]], [1, p.sky[4] || p.sky[3]]]));
    // the glass towers
    var win = '', lit = '';
    [[40, 150, 150, 0.5], [230, 110, 250, 0.68], [380, 170, 60, 0.4], [600, 120, 210, 0.62], [760, 150, 110, 0.5], [960, 110, 260, 0.7], [1110, 170, 30, 0.36], [1320, 130, 190, 0.6], [1480, 150, 90, 0.46]].forEach(function (t, ti) {
      s += wp([[t[0], t[2]], [t[0] + t[1], t[2]], [t[0] + t[1], hz + 10], [t[0], hz + 10]], mix(p.glassTop, p.haze, t[3]));
      lit += K.pts(dense([[t[0] + t[1] * 0.78, t[2]], [t[0] + t[1], t[2]], [t[0] + t[1], hz + 10], [t[0] + t[1] * 0.78, hz + 10]], true, 13).map(W)) + 'Z';
      for (var y = t[2] + 30; y < hz - 10; y += 38) win += wl([[t[0] + 8, y], [t[0] + t[1] - 8, y]]);
      if (ti % 2) win += wl([[t[0] + t[1] * 0.4, t[2] + 10], [t[0] + t[1] * 0.4, hz]]);
    });
    s += path(lit, p.glassEdge, { opacity: 0.35 }) + stroke(win, p.glassEdge, 3, { opacity: 0.5 });
    // the hedge round camp
    var hedge = [[-40, hz + 30]];
    for (i = -40; i <= 1640; i += 14) hedge.push([i, hz - 56 - 20 * Math.abs(Math.sin(i / 47)) - 12 * Math.sin(i / 190 + 1)]);
    hedge.push([1640, hz + 30]);
    s += wp(hedge, p.leaf) + wp(hedge.map(function (q, j) { return j === 0 || j === hedge.length - 1 ? q : [q[0], q[1] + 26]; }), p.leafMid, { opacity: 0.7 });
    // the ground: grass, a mossy stone path, a puddle
    s += wp([[-40, hz], [1640, hz], [1640, 1040], [-40, 1040]], S.lin('pilecampgrass', [[0, p.grassFar], [0.3, p.grass], [1, p.grassNear]]));
    [[760, 930, 120, 30], [840, 820, 90, 22], [900, 730, 70, 16], [950, 668, 52, 11]].forEach(function (q) { s += wp(oval(q[0], q[1], q[2], q[3]), p.stone, { opacity: 0.85 }) + wp(oval(q[0] - q[2] * 0.2, q[1] - q[3] * 0.3, q[2] * 0.6, q[3] * 0.5), p.stoneLight, { opacity: 0.6 }); });
    s += wp(oval(330, 880, 150, 26), p.sky[1], { opacity: 0.9 }) + wp(oval(300, 874, 80, 10), '#FFFFFF', { opacity: 0.55 });
    // the fountain, full of rain
    var fx = 1040, fy = 610, frx = 270, fry = 46, wall = 78;
    s += wp(arc(fx, fy, frx, fry, 0, Math.PI, 24).concat(arc(fx, fy + wall, frx, fry, Math.PI, 0, 24)), S.lin('pilecampbasin', [[0, p.stone], [1, p.stoneDark]]));
    s += wp(oval(fx, fy, frx, fry), p.stoneLight) + wp(oval(fx, fy + 3, frx - 24, fry - 11), mix(p.water, p.sky[2], 0.5)) + wp(oval(fx - 50, fy, (frx - 24) * 0.55, (fry - 11) * 0.5), p.sky[3] || p.sky[1], { opacity: 0.6 });
    s += stroke(wl([[fx - frx, fy + wall * 0.5], [fx - frx * 0.7, fy + wall * 0.5 + fry * 0.72], [fx, fy + wall * 0.5 + fry], [fx + frx * 0.7, fy + wall * 0.5 + fry * 0.72], [fx + frx, fy + wall * 0.5]]), p.stoneDark, 3, { opacity: 0.5 });
    // the Clan, noses to the sky
    function cat(x, y, h, col, dark, f) {
      function U(P) { return P.map(function (q) { return [x + q[0] * h * f, y - q[1] * h]; }); }
      return wp(U(oval(-0.3, 0.07, 0.24, 0.055)), dark) + wp(U(oval(0, 0.3, 0.23, 0.3)), col) + wp(U(oval(0.06, 0.2, 0.1, 0.19)), mix(col, '#FFFFFF', 0.35), { opacity: 0.6 }) +
        wp(U([[-0.12, 0.74], [-0.2, 0.97], [0.04, 0.86]]), dark) + wp(U([[-0.02, 0.84], [-0.02, 1.06], [0.18, 0.88]]), col) +
        wp(U(oval(0.08, 0.73, 0.185, 0.165)), col) + wp(U(oval(0.21, 0.82, 0.085, 0.065)), mix(col, '#FFFFFF', 0.4)) + wp(U(oval(0.275, 0.865, 0.022, 0.018)), '#D98A94');
    }
    s += cat(fx - 170, fy - 4, 150, '#C3CBD4', '#7E8A97', -1);
    s += cat(210, 722, 150, '#4A3A36', '#2E2422', 1) + cat(1500, 750, 170, '#9EA5AD', '#636A72', -1) + cat(700, 760, 185, '#6A4B3A', '#46301F', 1);
    s += cat(455, 820, 235, '#E8913A', '#B5602A', 1) + cat(1340, 850, 215, '#3D3844', '#211E26', -1);
    return s;
  }

  // `through`: her chin on the earth, looking through it where it leans: the whole camp goes wavy,
  // and a little green, inside its outline; outside it the camp is as it always is.
  var THRU = { x: 830, y: 930, u: 15, lean: 8 };
  function drawThrough(S) {
    var p = S.pal, o = S.opts, back = '', c0 = scaleAt(THRU, 0, -31);
    back += campView(S, straight);
    // we are under the brambles: their shade round the edges, the earth she is lying on
    var deep = mix(p.leaf, p.shade, 0.72);
    back += rect(-10, -10, 1620, 1020, S.radU([[0, deep, 0], [0.5, deep, 0.1], [1, deep, 0.6]], c0[0], c0[1], 1050));
    back += leafTex(S, 0, 1600, -40, 150, 34, 78, 731, mix(p.leaf, p.shade, 0.5), 0.95) + leafTex(S, 0, 1600, -30, 110, 22, 66, 732, p.leafMid, 0.8);
    back += path('M-10 ' + n(THRU.y - 26) + 'Q500 ' + n(THRU.y - 44) + ' 900 ' + n(THRU.y - 32) + 'Q1300 ' + n(THRU.y - 22) + ' 1610 ' + n(THRU.y - 36) + 'V1010H-10Z', S.lin('pilethruearth', [[0, mix(p.wood, p.shade, 0.5)], [1, mix(p.wood, p.shade, 0.25)]]));
    back += scaleBig(S, THRU, campView(S, wobbler(c0[0], c0[1])), 'through');
    if (o.glint === true) { var at = scaleAt(THRU, -17.5, -47); back += glintSvg(S, at[0], at[1], 96, 300); }
    keepBoxes(S, [{ x: c0[0] - 21 * THRU.u, y: c0[1] - 22 * THRU.u, w: 42 * THRU.u, h: 42 * THRU.u }]);
    S.weatherClip = S.clip('pilenorain', rect(0, 0, 0, 0, '#fff'));
    return { back: back, over: '', front: '' };
  }

  // `mirror`: she leans over it, and a tiny cat looks back, with her face (her fur, her eyes, from
  // the player's look): the sky and the brambles in it behind her, as in the patio door every evening.
  var MIRR = { x: 800, y: 936, u: 14.4, lean: 7 };
  function herFace(S, cx, cy, headH) {
    var c = null, look = S.look || {};
    try { if (typeof art.character === 'function') c = art.character('player', { pose: 'sit', mood: 'wonder', look: look, sex: look.sex, facing: 'left' }); } catch (e) { c = null; }
    if (!c || typeof c.svg !== 'string' || !c.headBox) {
      // no character art: a plain cat's face, so the picture still says what it is
      var r = headH * 0.42;
      return g(circ(cx, cy, r, '#B5895B') + poly([[cx - r * 0.9, cy - r * 0.5], [cx - r * 0.75, cy - r * 1.5], [cx - r * 0.15, cy - r * 0.9]], '#B5895B') + poly([[cx + r * 0.9, cy - r * 0.5], [cx + r * 0.75, cy - r * 1.5], [cx + r * 0.15, cy - r * 0.9]], '#B5895B') +
        circ(cx - r * 0.38, cy - r * 0.05, r * 0.16, '#2E2420') + circ(cx + r * 0.38, cy - r * 0.05, r * 0.16, '#2E2420'), { 'data-art': 'reflection' });
    }
    var hb = c.headBox, k = headH / (hb.y1 - hb.y0);
    return '<g data-art="reflection" transform="translate(' + n(cx - (hb.x0 + hb.x1) / 2 * k) + ' ' + n(cy - (hb.y0 + hb.y1) / 2 * k) + ') scale(' + n4(k) + ')">' + c.svg + '</g>';
  }
  function drawMirror(S) {
    var p = S.pal, o = S.opts, back = '', c0 = scaleAt(MIRR, 0, -31), u = MIRR.u, sp = PLACE * u;
    back += gapEarth(S, 'pilemirror', 300, 761);
    back += placeMark(S, MIRR.x - sp * 0.28, MIRR.y, sp);
    // in the glass: the sky, the brambles overhead, and her own small face
    var inner = rect(c0[0] - 30 * u, c0[1] - 34 * u, 60 * u, 68 * u, S.linU([[0, p.sky[1]], [0.6, p.sky[3] || p.sky[2]], [1, p.sky[4] || p.sky[3]]], 0, c0[1] - 30 * u, 0, c0[1] + 30 * u));
    inner += path(blob(c0[0] + 9 * u, c0[1] - 13 * u, 9 * u, 2.6 * u, 9, rng(771), 0.25, 0.32) + blob(c0[0] - 10 * u, c0[1] + 2 * u, 7 * u, 2 * u, 8, rng(772), 0.25, 0.32), '#FFFFFF', { opacity: 0.6 });
    inner += leafTex(S, c0[0] - 26 * u, c0[0] + 26 * u, c0[1] - 31 * u, c0[1] - 19 * u, 26, 5.4 * u, 773, mix(p.leaf, p.shade, 0.35), 0.92) + leafTex(S, c0[0] - 26 * u, c0[0] + 26 * u, c0[1] - 30 * u, c0[1] - 21 * u, 14, 4.6 * u, 774, p.leafMid, 0.85);
    inner += herFace(S, c0[0] - 1 * u, c0[1] + 5 * u, 17 * u);
    back += scaleBig(S, MIRR, inner, 'mirror');
    if (o.glint === true) { var at = scaleAt(MIRR, -17.5, -47); back += glintSvg(S, at[0], at[1], 92, 300); }
    keepBoxes(S, [{ x: c0[0] - 21 * u, y: c0[1] - 22 * u, w: 42 * u, h: 44 * u }]);
    S.weatherClip = S.clip('pilenorain', rect(0, 0, 0, 0, '#fff'));
    return { back: back, over: '', front: '' };
  }

  function draw(S) {
    if (S.comp === 'low') return drawLow(S);
    if (S.comp === 'rows') return drawRows(S);
    if (S.comp === 'gap') return drawGap(S);
    if (S.comp === 'gapclose') return drawGapClose(S);
    if (S.comp === 'scale') return drawScale(S);
    if (S.comp === 'through') return drawThrough(S);
    if (S.comp === 'mirror') return drawMirror(S);
    return drawMain(S);
  }

  art.defineSet('pile', {
    label: 'the prey pile in camp', tod: 'morning', todMap: { sunset: 'golden' }, draw: draw,
    cams: {
      wide: { box: [0, 0, 1600] },
      low: { box: [0, 0, 1600], comp: 'low' },
      close: { box: [305, 470, 820], comp: 'low' },
      // chapter 4
      rows: { box: [0, 0, 1600], comp: 'rows' },
      gap: { box: [0, 0, 1600], comp: 'gap' },
      scale: { box: [0, 0, 1600], comp: 'scale' },
      through: { box: [0, 0, 1600], comp: 'through' },
      mirror: { box: [0, 0, 1600], comp: 'mirror' },
      // chapter 5
      'gap-close': { box: [0, 0, 1600], comp: 'gapclose' }
    },
    anchors: {
      main: {
        'pile-left': A(300, 896, 258), 'pile-right': A(1185, 902, 262, 'left'), beside: A(985, 856, 236, 'left'),
        'crowd-1': A(140, 838, 228), 'crowd-2': A(1080, 742, 180, 'left'), 'crowd-3': A(1385, 948, 284, 'left'),
        'fountain-edge': A(1490, 764, 245, 'left', { elev: true }),
        // chapter 5: behind the back row (z: 'behind' also keeps it out of the depth a spot of its own gets)
        behind: A(566, 732, 132, 'left', { z: 'behind' })
      },
      low: {
        'pile-left': A(180, 946, 396), beside: A(1305, 914, 376, 'left'), 'pile-right': A(1458, 932, 396, 'left'),
        behind: A(610, 742, 186, 'left', { z: 'behind' })
      },
      // chapter 4. rows: a cat each side at the front (the old tom sits at `beside`), and further back
      // beside the second row (`pile-right`, `crowd-1`) and the back row (`crowd-2`, `crowd-3`)
      rows: {
        'pile-left': A(118, 958, 320), beside: A(1474, 954, 320, 'left'), 'pile-right': A(1424, 818, 280, 'left'),
        'crowd-1': A(176, 818, 280), 'crowd-2': A(246, 706, 249), 'crowd-3': A(1354, 706, 249, 'left'),
        behind: A(690, 548, 204, 'left', { z: 'behind' })
      },
      // gap: in front of the back row, the middle left clear for the hole. The cats are nearer the
      // camera than the row, three mice tall as in `rows` (at 330 the big ginger was barely two)
      // (chapter 5) `behind`: the old tom, round the back of the row, between its gap and the dug earth
      gap: { 'pile-left': A(200, 998, 430), 'pile-right': A(1400, 998, 430, 'left'), beside: A(1160, 998, 400, 'left'),
        behind: A(680, 474, 236, 'left', { z: 'behind' }) },
      // the three close-ups of the "scale", and chapter 5's of the dug earth: no faces in them
      scale: {}, through: {}, mirror: {}, gapclose: {}
    },
    // `rows` lists its usual values (each a list: compare by value); the set draws any list of up to five rows
    opts: { pairs: 'number', lit: 'number', dug: [true, false, 'big'], vole: [true, false],
      rows: [[10, 10, 10], [10, 10, { n: 10, gap: [3, 4, 5, 6] }], [10, 10, 10, 10], [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }]],
      back: ['none', 'shadow'], scale: [false, true, 'behind'], glint: [false, true],
      // chapter 5: the dug earth with tiny prints in it, and swept flat
      prints: [false, true], swept: [false, true] },
    defaults: { pairs: 8, lit: 0, dug: false, vole: false, back: 'none', scale: false, glint: false, prints: false, swept: false }
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
