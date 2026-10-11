/* Potomac Crossing · app/art/cards.js
 *
 * The Case File's cards (chapter 4 on; docs/build.md, "Chapter 4", Cards art): curls of pale,
 * papery bark from the Training Tree, each flattened to about the size of a paw, with one picture
 * scratched in thin dark lines, as simple as a cave drawing (a child could copy one), and a small
 * mark in one corner: an eye for what she saw herself, an ear for what she was only told.
 *
 *   PC.art.card({ picture, mark, big, look, blank }) -> '<svg viewBox="0 0 200 240" …>…</svg>'
 *       picture: a key of PC.art.cardPictures (a card definition's `picture`: the card's own id).
 *                A key nobody has drawn gives the bare bark (and the mark), never an error.
 *       mark:    'eye' (an almond with a slit in it, a cat's) | 'ear' (one triangle with a notch);
 *                anything else, no mark (her first card, before Tallyheart has said the rule).
 *       big:     the card as it is shown large (tapped): the same drawing in thinner lines, each
 *                with the pale lip a claw raises, more grain in the bark, and the small touches
 *                (a tucked tail, a wing's ribs, the fox's smile) that would only blur at the size
 *                of a paw. Without it the lines are heavier, so a card reads in a row of them.
 *       look:    the player's look, taken as every art call takes it. Nothing on a card depends
 *                on it: the bark is the same bark for every cat.
 *       blank:   the bare curl, nothing scratched yet (the bark Taps), whatever else is passed.
 *   PC.art.cardGroup(opts) -> { svg, w: 200, h: 240, label }: the same drawing as a group (no outer
 *       <svg>), for a set that lays cards in a scene (on the sand, along the nest's edge).
 *   PC.art.cardPictures -> { key: { label, draw(claw) } }: one drawing for every card. A later
 *       chapter adds its own: draw(claw) scratches in the card's 200 x 240 box (a picture keeps
 *       inside x 22..178, y 60..204; the mark has the top left corner, the curl the bottom edge)
 *           claw.line(d, { t, w })    a scratch: path data, an optional transform and weight
 *           claw.fine(d, { t, w })    a scratch made only on the large card
 *           claw.dot(x, y, { t, w })  a peck
 *       and claw.big says which size is being drawn. Lines only: nothing is filled.
 *   PC.art.cardMarks -> ['eye', 'ear']
 *   PC.art.cardMark('eye' | 'ear') -> '<svg viewBox="0 0 40 28" …>…</svg>': the mark by itself, the
 *       very strokes a card has in its corner, in the page's own colour (currentColor), for a
 *       heading or a line of words beside the cards ("What I saw myself"). Any other mark: ''.
 *   PC.art.fileIcon() -> '<svg viewBox="0 0 48 48" …>…</svg>': the curl of bark on the Case File
 *       button, drawn like the hub's own icons (flat colours, an ink outline).
 *
 * No ids, gradients, filters or text anywhere, so any number of cards can share a page (and Quick
 * Look draws them as Safari does). The groups carry classes for the page's own styling: `pcc-bark`,
 * `pcc-pic` (the picture) and `pcc-mark`.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});

  var W = 200, H = 240;

  // ------------------------------------------------------------------ helpers

  function N(v) { var r = Math.round(v * 10) / 10; return String(r === 0 ? 0 : r); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  // Mirror absolute M/L/C/Q path data about the vertical line x = ax.
  function mirrorX(d, ax) {
    var i = 0;
    return d.replace(/-?\d*\.?\d+/g, function (v) { return (i++ % 2 === 0) ? N(2 * ax - +v) : v; });
  }

  // the bark, and what a claw leaves in it
  var C = {
    face: '#EDE1C5',      // the pale, papery inside of the curl: what she scratches on
    under: '#7C6444',     // its own thickness, seen at the lower right
    edge: '#8A7350',
    grain: '#D9CAA6',     // the little dashes paper bark has
    fleck: '#CDBB93',
    shade: '#DACBA6',     // the face in the lee of the curl
    roll: '#B48D61',      // the outside of the bark, where the foot of it still curls up
    rollLight: '#D2B084',
    rollEdge: '#7A5C3C',
    ink: '#3A281E',       // a scratch (the colour of her claw marks in the Training Tree)
    cut: '#FBF5E4'        // the pale lip a scratch raises, seen large
  };

  // ------------------------------------------------------------------ the claw

  // What a picture is scratched with: it only collects strokes. Every stroke is a thin dark line
  // with round ends; `w` is its weight beside the others (a peck is 1.6).
  function Claw(big) { this.big = !!big; this.out = []; }
  Claw.prototype.line = function (d, o) {
    this.out.push({ d: String(d), t: (o && o.t) || '', w: (o && o.w) || 1 });
    return this;
  };
  Claw.prototype.fine = function (d, o) { return this.big ? this.line(d, o) : this; };
  Claw.prototype.dot = function (x, y, o) {
    return this.line('M' + N(x) + ' ' + N(y) + 'h.1', { t: o && o.t, w: (o && o.w) || 1.6 });
  };

  // The strokes as paths (neighbours with the same transform and weight share one).
  function strokes(items, sw) {
    var s = '', i = 0;
    while (i < items.length) {
      var it = items[i], d = it.d;
      i++;
      while (i < items.length && items[i].t === it.t && items[i].w === it.w) { d += items[i].d; i++; }
      s += '<path d="' + d + '"' + (it.t ? ' transform="' + it.t + '"' : '') +
        (it.w !== 1 ? ' stroke-width="' + N(sw * it.w) + '"' : '') + '/>';
    }
    return s;
  }
  // Scratched lines: dark, thin, round-ended. Large, each has the pale lip a claw raises, a hair
  // below and to the right (the light comes from the upper left, as in every panel).
  function scratched(items, sw, big, cls) {
    if (!items.length) return '';
    var body = strokes(items, sw), s = '<g class="' + cls + '" fill="none" stroke-linecap="round" stroke-linejoin="round">';
    if (big) s += '<g stroke="' + C.cut + '" stroke-width="' + N(sw) + '" transform="translate(1 1.3)" opacity=".85">' + body + '</g>';
    return s + '<g stroke="' + C.ink + '" stroke-width="' + N(sw) + '">' + body + '</g></g>';
  }

  // ------------------------------------------------------------------ the bark

  // One curl, pressed flat: no edge quite straight, and the foot of it has not given up curling.
  var FACE = 'M32 15C70 10 130 14 166 15C180 15 188 24 187 40C190 96 185 150 188 204C188 212 187 218 186 222L16 224C14 216 13 210 13 204C10 150 16 96 12 42C11 26 18 16 32 15Z';
  var ROLL = 'M16 211.4C60 215.4 140 212.4 183 208.4C189.6 208 193 212.4 192.6 218C192.4 224.4 188 227.6 182 227.8C140 231.2 62 227 22 229.4C14.6 229.8 10 226.4 10 220.6C10 215.4 12.4 211.6 16 211.4Z';
  var ROLL_SHADE = 'M13.4 203C60 207 140 204 188 200L187.6 209.4C140 212.6 60 215.6 15 211.6Z';
  var ROLL_LIGHT = 'M19 216.2C62 220 140 217 181 213.6';
  var ROLL_END = 'M184.6 212.6Q188.4 218 185 223.8';
  // the dashes of paper bark: [x, y, length]; the first seven are all a small card shows
  var GRAIN = [[30, 78, 12], [118, 38, 16], [150, 96, 12], [26, 152, 10], [142, 190, 14], [66, 198, 10], [84, 28, 9],
    [52, 100, 8], [154, 150, 9], [98, 58, 7], [30, 190, 9], [112, 180, 8], [156, 60, 9], [62, 60, 7], [100, 204, 9], [164, 122, 7], [40, 124, 6], [170, 32, 8]];
  var FLECKS = [[62, 38], [138, 72], [44, 176], [126, 150], [92, 192], [166, 172], [74, 132], [28, 108], [108, 96], [150, 30], [176, 84], [22, 60]];

  function bark(big) {
    var s = '<g class="pcc-bark">', g = '', n = big ? GRAIN.length : 7, i;
    s += '<path d="' + FACE + '" fill="' + C.under + '" transform="translate(2.6 3.4)"/>';
    s += '<path d="' + FACE + '" fill="' + C.face + '" stroke="' + C.edge + '" stroke-width="3.2" stroke-linejoin="round"/>';
    for (i = 0; i < n; i++) g += 'M' + N(GRAIN[i][0]) + ' ' + N(GRAIN[i][1]) + 'h' + N(GRAIN[i][2]);
    s += '<path d="' + g + '" fill="none" stroke="' + C.grain + '" stroke-width="' + (big ? '1.8' : '2.4') + '" stroke-linecap="round"/>';
    if (big) {
      var f = '';
      for (i = 0; i < FLECKS.length; i++) f += 'M' + N(FLECKS[i][0]) + ' ' + N(FLECKS[i][1]) + 'h.1';
      s += '<path d="' + f + '" fill="none" stroke="' + C.fleck + '" stroke-width="2.2" stroke-linecap="round"/>';
    }
    s += '<path d="' + ROLL_SHADE + '" fill="' + C.shade + '"/>';
    s += '<path d="' + ROLL + '" fill="' + C.under + '" transform="translate(2.6 3.4)"/>';
    s += '<path d="' + ROLL + '" fill="' + C.roll + '" stroke="' + C.rollEdge + '" stroke-width="2.4" stroke-linejoin="round"/>';
    s += '<path d="' + ROLL_LIGHT + '" fill="none" stroke="' + C.rollLight + '" stroke-width="2.2" stroke-linecap="round"/>';
    s += '<path d="' + ROLL_END + '" fill="none" stroke="' + C.rollEdge + '" stroke-width="1.8" stroke-linecap="round"/>';
    return s + '</g>';
  }

  // ------------------------------------------------------------------ the two marks (top left corner)

  var MARKS = {
    // an eye: an almond with a slit in it, a cat's. "I saw it myself."
    eye: { label: 'an eye', draw: function (c) {
      c.line('M25 44Q44 27 63 44Q44 61 25 44Z');
      c.line('M44 37.5V50.5', { w: 1.25 });
    } },
    // an ear: one triangle with a notch (Tallyheart's own has one). "Somebody told me."
    ear: { label: 'an ear', draw: function (c) {
      c.line('M27 60Q30 40 42 25Q46.6 31 50.2 38.6L44.2 45.8L54 46Q58.6 52 61 60Z');
    } }
  };

  // ------------------------------------------------------------------ what the pictures are made of

  // A little mouse on the pile, lying nose to the right like the pile's own: a dome with a round ear.
  // (x, y) is the middle of its place on the ground, k its size (1: about eleven wide). `tail`:
  // 'straight' (laid out behind it: the tidy pile), 'wave', or none: tucked up, and scratched only
  // on the large card (the long row has no room between its mice). `w`: its lines' weight.
  function mouse(c, x, y, k, tail, w) {
    function P(a, b) { return N(x + a * k) + ' ' + N(y + b * k); }
    var o = w ? { w: w } : null;
    c.line('M' + P(-5, 0) + 'C' + P(-6, -7.8) + ' ' + P(1.4, -9) + ' ' + P(5.6, -0.4) + 'Z', o);
    c.line('M' + P(-0.7, -6.7) + 'C' + P(-0.9, -11.2) + ' ' + P(4.3, -10.8) + ' ' + P(3.3, -5.3), o);
    if (tail === 'straight') c.line('M' + P(-5.3, -1.3) + 'L' + P(-10.8, -1.3), o);
    else if (tail === 'wave') c.line('M' + P(-5.3, -1.5) + 'Q' + P(-8, -4.2) + ' ' + P(-10.9, -0.9), o);
    else c.fine('M' + P(-5.2, -2.6) + 'Q' + P(-7.8, -4.8) + ' ' + P(-6, -8.6), { w: 0.75 });
    if (k >= 1.4) c.fine('M' + P(2.4, -3.5) + 'h.1', { w: 1.2 });
  }

  // A long low shape, seen from above, nose toward -y: a little fuller at the shoulders, with a
  // slink in it. A shape and nothing more: no ears, no tail, no feet. (x, y) is its nose, L its
  // length, hw half its width.
  function slink(x, y, L, hw) {
    var n = 8, left = [], right = [], i;
    for (i = 0; i <= n; i++) {
      var q = i / n, cx = x + 2.4 * Math.sin(q * Math.PI * 1.6), cy = y + q * L;
      var h = hw * Math.pow(Math.sin(Math.PI * Math.pow(q, 0.8)), 0.34);
      left.push([cx - h, cy]);
      if (i > 0 && i < n) right.unshift([cx + h, cy]);
    }
    var p = left.concat(right), m = p.length, d = 'M' + N(p[0][0]) + ' ' + N(p[0][1]);
    for (i = 0; i < m; i++) {
      var p0 = p[(i - 1 + m) % m], p1 = p[i], p2 = p[(i + 1) % m], p3 = p[(i + 2) % m];
      d += 'C' + N(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + N(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        N(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + N(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + N(p2[0]) + ' ' + N(p2[1]);
    }
    return d + 'Z';
  }

  // The fox's head, from the side, nose to the right: two tall ears, a long nose with a dot on the
  // end, a fluffy cheek and a half-closed eye. His mouth is shut (no teeth, ever) and he is never
  // drawn full-face. In an 80 x 76 box at (x, y), k its size.
  function fox(c, x, y, k) {
    var t = 'translate(' + N(x) + ' ' + N(y) + ') scale(' + N(k) + ')';
    c.line('M19 36L18 10L33 27', { t: t });                                             // the far ear
    c.line('M30 30L42 2L54 29', { t: t });                                              // the near ear
    c.line('M54 29C60 33 67 40 78 49C71 55 63 57 56 57L52 69L45 61L39 73L33 62C24 58 17 49 19 36', { t: t });
    c.line('M49 41.4Q55 36 61 40.6', { t: t });                                         // the eye, half closed
    c.dot(77.4, 49.6, { t: t, w: 1.9 });                                                // the nose
    c.fine('M71 53.6Q64 57.4 57.6 54', { t: t, w: 0.8 });                               // the smile that is always on
    c.fine('M36 26L42 12L47 26', { t: t, w: 0.75 });                                    // inside the near ear
  }

  // One wing with the skin of a sail (Sprinkle's kind): its arm along the top, and the scalloped
  // edge between the tips of its fingers. Raised, as the fox tells it; the right one is its mirror.
  var WING = 'M0 0C-8 -22 -25 -37 -46 -43Q-37 -31 -34 -22Q-25 -21 -20 -11Q-11 -10 0 0';
  var WING_RIBS = 'M0 0Q-15 -19 -34 -22M0 0Q-10 -8 -20 -11';
  var WING_FLAP = 'M-47 -25Q-51 -19 -49 -12M-36 -7Q-39 -2 -37 4';

  // ------------------------------------------------------------------ the pictures

  var PICS = art.cardPictures = art.cardPictures || {};

  // Four gone every night. (eye) This morning's back row: three, four empty places, three.
  PICS['four-a-night'] = { label: 'a row of little mice with a gap in it: six mice, and four empty places', draw: function (c) {
    var step = 15.6, x0 = 100 - 4.5 * step, y = 142, empty = '';
    for (var i = 0; i < 10; i++) {
      var x = x0 + i * step;
      if (i < 3 || i > 6) mouse(c, x + 0.2, y, 1.14, null, c.big ? 0.62 : 0.74);
      else empty += 'M' + N(x - 3.8) + ' ' + N(y) + 'h7.6';
    }
    c.line(empty, { w: 0.8 });
  } };

  // The thief leaves the pile tidy. (eye) Two short rows, every piece straight.
  PICS.tidy = { label: 'two short rows of mice, every one straight', draw: function (c) {
    [122, 174].forEach(function (y) {
      for (var i = 0; i < 4; i++) mouse(c, 56 + i * 33, y, 1.7, 'straight');
      c.line('M30 ' + N(y + 6) + 'H172', { w: 0.8 });
    });
  } };

  // Freshly dug earth behind the pile. (eye, noticing only) A small crumbly heap behind a row.
  PICS['dug-earth'] = { label: 'a small crumbly heap of earth behind a row of mice', draw: function (c) {
    for (var i = 0; i < 4; i++) mouse(c, 56 + i * 33, 190, 1.7, 'wave');
    c.line('M30 196H172', { w: 0.8 });
    c.line('M52 147C66 145 73 127 83 114C89 106 97 108 102 102C110 97 119 104 123 114C131 129 137 145 150 147');
    [[92, 124], [108, 134], [84, 139], [121, 139], [104, 116]].forEach(function (p) { c.dot(p[0], p[1], { w: 1.25 }); });
    [[60, 133], [143, 131], [69, 115], [134, 111], [160, 137], [44, 137]].forEach(function (p) { c.dot(p[0], p[1], { w: 1.25 }); });
    c.line('M60 153h9M133 153h11M95 153h13', { w: 0.8 });
  } };

  // The 'scale' is smooth, like glass. (eye) Round at one end, a blunt point at the other; it shines.
  PICS.scale = { label: 'the scale, with shine lines', draw: function (c) {
    var t = 'translate(92 138) rotate(14)';
    c.line('M-6 -46Q0 -50 6 -46C21 -34 39 -10 38 9C37 30 21 39 0 39C-21 39 -37 30 -38 9C-39 -10 -21 -34 -6 -46Z', { t: t });
    c.line('M-19 12L-4 -11M-8 24L10 -3', { t: t, w: 0.85 });                             // smooth: the two strokes that mean glass
    c.line('M44 -36L56 -48M56 -12L72 -17M22 -52L27 -68M58 14L74 17', { t: t, w: 0.85 }); // and it shines
  } };

  // The fox says it FLEW. (ear) A fox's head, and two flapping wings.
  PICS['fox-flew'] = { label: 'a fox’s head, and two flapping wings', draw: function (c) {
    var t = 'translate(127 112)';
    fox(c, 22, 122, 1);
    c.line(WING + mirrorX(WING, 0), { t: t });
    c.fine(WING_RIBS + mirrorX(WING_RIBS, 0), { t: t, w: 0.75 });
    c.line(WING_FLAP + mirrorX(WING_FLAP, 0), { t: t, w: 0.8 });
  } };

  // The fox says the MOON was out on the storm night. (ear) A fox's head, and a round moon.
  PICS['fox-moon'] = { label: 'a fox’s head, and a round moon', draw: function (c) {
    fox(c, 22, 122, 1);
    c.line('M112 94a28 28 0 1 0 56 0a28 28 0 1 0 -56 0Z');
    c.line('M126 85a5.4 5.4 0 1 0 10.8 0a5.4 5.4 0 1 0 -10.8 0ZM144 103a4.2 4.2 0 1 0 8.4 0a4.2 4.2 0 1 0 -8.4 0Z', { w: 0.8 });
    c.dot(133, 108, { w: 1.2 });
    c.fine('M149 79a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0Z', { w: 0.8 });
  } };

  // Squall says two skinny shapes carry something to the tracks. (ear) Seen from above: the two
  // lines of a track, and two long low shapes going to it side by side, with something between
  // them.
  PICS['squall-shapes'] = { label: 'two long low shapes carrying something, seen from above, and the two lines of a track', draw: function (c) {
    var t = 'translate(128 102) rotate(36)';
    c.line('M-58 -8H54M-58 8H54', { t: t });
    c.line('M-46 -14V14M-26 -14V14M-6 -14V14M14 -14V14M34 -14V14', { t: t, w: 0.75 });
    c.line(slink(-15, 30, 64, 4.7) + slink(12, 41, 64, 4.7), { t: t });
    c.line('M-6.6 60C-6 53.6 3.4 52.6 6.4 58C8.8 63.6 5.6 70.4 -0.2 70.4C-4.4 70.4 -7 65.6 -6.6 60Z', { t: t, w: 0.85 });
  } };

  // Sprinkle's scales are grey and bumpy. (eye) A patch of bumpy scales.
  PICS['sprinkle-scales'] = { label: 'a patch of bumpy scales', draw: function (c) {
    var rows = [[96, [70, 100, 130]], [116, [55, 85, 115, 145]], [136, [70, 100, 130]], [156, [85, 115]]], d = '';
    rows.forEach(function (r) {
      var y = r[0];
      r[1].forEach(function (x) {
        d += 'M' + N(x - 15) + ' ' + N(y) + 'C' + N(x - 15) + ' ' + N(y + 14) + ' ' + N(x - 8) + ' ' + N(y + 22) + ' ' + N(x) + ' ' + N(y + 22) +
          'C' + N(x + 8) + ' ' + N(y + 22) + ' ' + N(x + 15) + ' ' + N(y + 14) + ' ' + N(x + 15) + ' ' + N(y);
      });
    });
    c.line(d);
    rows.forEach(function (r) { r[1].forEach(function (x) { c.dot(x, r[0] + 10, { w: 1.3 }); }); });
  } };

  // Sprinkle can't fly. (eye) A drooping wing: it hangs from the shoulder, low and half shut, its
  // tips on the ground. Never crooked or bent.
  PICS['cant-fly'] = { label: 'a drooping wing', draw: function (c) {
    c.line('M50 80C66 70 94 76 110 96C124 114 140 146 140 178Q126 168 118 194Q108 174 94 188Q86 146 54 114');
    c.line('M110 96Q122 146 118 194M110 96Q104 146 94 188', { w: 0.8 });
    c.line('M50 80Q44 96 54 114', { w: 0.8 });
    c.line('M80 198H154', { w: 0.8 });
    c.fine('M110 96Q112 88 119 88', { w: 0.8 });                                         // the little hook at its wrist
  } };

  // ------------------------------------------------------------------ public

  function build(o) {
    o = o || {};
    var big = !!o.big, blank = !!o.blank;
    var pic = !blank && o.picture != null && own(PICS, String(o.picture)) ? PICS[String(o.picture)] : null;
    var mark = !blank && own(MARKS, String(o.mark)) ? MARKS[String(o.mark)] : null;
    var s = bark(big), c;
    if (pic && typeof pic.draw === 'function') {
      // a drawing that fails leaves the bark bare: her file never fails to open over one card
      c = new Claw(big);
      try { pic.draw(c); s += scratched(c.out, big ? 2.7 : 4.3, big, 'pcc-pic'); } catch (e) { pic = null; }
    } else pic = null;
    if (mark) { c = new Claw(big); mark.draw(c); s += scratched(c.out, big ? 2.7 : 4, big, 'pcc-mark'); }
    var label = !pic && !mark ? 'A blank piece of bark' :
      'A piece of bark' + (pic ? ': ' + (pic.label || String(o.picture)) : '') + (mark ? (pic ? '; ' : ': ') + 'in its corner, ' + mark.label : '');
    return { svg: s, w: W, h: H, label: label };
  }

  art.cardGroup = build;
  art.card = function (o) {
    var r = build(o);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(r.label) + '">' + r.svg + '</svg>';
  };
  art.cardMarks = ['eye', 'ear'];
  // A mark by itself, fitted to a 40 x 28 box: [the middle of the mark on a card, its scale there].
  var MARK_FIT = { eye: [44, 44, 0.9], ear: [44, 42.6, 0.7] };
  art.cardMark = function (mark) {
    if (!own(MARKS, String(mark))) return '';
    var f = MARK_FIT[mark], c = new Claw(false);
    MARKS[mark].draw(c);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 28" role="img" aria-label="' + esc(MARKS[mark].label) + '">' +
      '<g transform="translate(20 14) scale(' + f[2] + ') translate(' + N(-f[0]) + ' ' + N(-f[1]) + ')" fill="none" stroke="currentColor" stroke-width="' + N(3.2 / f[2]) + '" stroke-linecap="round" stroke-linejoin="round">' +
      strokes(c.out, 3.2 / f[2]) + '</g></svg>';
  };

  // The Case File button: one curl of bark, its foot rolled up, three scratches on it.
  art.fileIcon = function () {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="a curl of bark">' +
      '<g stroke="#1b1622" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M12 5C20 3.6 30 4.4 37 5C39.4 5.2 40.6 6.6 40.4 9C39.8 17 41 26 40.6 37L9.4 38C9 28 10.4 17 9.6 9C9.4 6.6 10.2 5.4 12 5Z" fill="' + C.face + '"/>' +
      '<path d="M8.4 34.4C18 35.4 32 34.8 40.8 33.8C43.6 33.6 45.2 35.6 45.2 38.4C45.2 41.6 43 43.4 40.4 43.6C30 44.6 18 43.8 8.8 44.4C5.8 44.6 3.8 42.6 3.8 39.4C3.8 36.4 5.8 34.4 8.4 34.4Z" fill="' + C.roll + '"/>' +
      '</g>' +
      '<path d="M16 12.5h17M16 19.5h11M16 26.5h15" fill="none" stroke="' + C.ink + '" stroke-width="2.8" stroke-linecap="round"/>' +
      '</svg>';
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
