/* Potomac Crossing · app/art/cards.js
 *
 * The Case File's cards (chapter 4 on; docs/build.md, "Chapter 4", Cards art): curls of pale,
 * papery bark from the Training Tree, each flattened to about the size of a paw, with one picture
 * scratched in thin dark lines, as simple as a cave drawing (a child could copy one), and a small
 * mark in one corner: an eye for what she saw herself, an ear for what she was only told.
 *
 * Chapter 4's nine pictures, and chapter 5's nine (the table in its text's notes, "The Case File":
 * prints-pile, puddle-paws, otter-fox, fur, heron-no-moon, heron-shapes, prints-marsh,
 * prints-tracks, wisp-fox), and chapter 6's three (its spec, "3. The Case File": reed-pile, which lays
 * `tidy`'s own row down with one place empty, since the two lie touching; coil-diggers; sleet-den, with
 * the one fox), and chapter 7's four (its spec, "3. The Case File": waffles-no-moon, under heron-no-moon's
 * own sky; my-count, the sum's two lines and their numbers; prints-sprinkle, one big print and one tiny;
 * tunnel, coil-diggers' own mice with the tunnel's hatched mouth at the end of their ground). Cards the file lays touching show one thing drawn one way: one fox's
 * head wherever the fox is (`fox`), one heron's head (`heron`), one track (`TRACK`: Squall's), one
 * tiny print at one size (`prints`, `PRINT`), one kind of long low shape (`slink`), one "scale"
 * (`shard`). Whoever took the prey is never on a card: paws, prints, two shapes, and nothing more
 * of the animal.
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

  // ------------------------------------------------------------------ chapter 5: what its pictures are made of

  // Where a small thing is scratched, at any size and turn: spot(x, y, k, rot) gives the place of
  // the point (a, b) of the thing's own drawing when it is set down at (x, y), k its size, turned
  // `rot` degrees (clockwise, as the page turns things), and at(...) gives it as path data. The
  // numbers are worked out here and not left to a transform: a scaled group would scale the weight
  // of its lines too.
  function spot(x, y, k, rot) {
    var r = (rot || 0) * Math.PI / 180, cs = Math.cos(r) * (k || 1), sn = Math.sin(r) * (k || 1);
    return function (a, b) { return [x + a * cs - b * sn, y + a * sn + b * cs]; };
  }
  function at(x, y, k, rot) {
    var S = spot(x, y, k, rot);
    return function (a, b) { var p = S(a, b); return N(p[0]) + ' ' + N(p[1]); };
  }

  // Tiny prints, each [x, y, the way it walks in degrees (0: up the bark)]: a pad, and five little
  // toes close together over it (module-1's clue 4). Nobody counts them: at the size of a paw they
  // run into one beaded line, and it is the size of the print that tells. k: 1 is about 16 across.
  // PRINT is the size they are wherever she is close enough to measure one (behind the pile, at
  // the marsh: "half the size of yours" both times, so the two cards are sized one way).
  var PRINT = 1.45;
  var TOES = [[-6.6, -1.8], [-3.9, -5.2], [0, -6.5], [3.9, -5.2], [6.6, -1.8]];
  function prints(c, list, k) {
    var pads = '', toes = '';
    list.forEach(function (p) {
      var P = at(p[0], p[1], k, p[2]);
      pads += 'M' + P(-1.7, 2.2) + 'L' + P(1.7, 2.2);
      TOES.forEach(function (t) { toes += 'M' + P(t[0], t[1]) + 'h.1'; });
    });
    c.line(pads, { w: c.big ? 2.2 : 1.6 });
    c.line(toes, { w: c.big ? 1.3 : 0.9 });
  }

  // The train tracks as Squall's card has them, from above: two long lines and their ties, in the
  // same place at the same slant, so two cards that lie touching show one track.
  var TRACK = { t: 'translate(128 102) rotate(36)', at: [128, 102, 36], rails: 'M-58 -8H54M-58 8H54', ties: 'M-46 -14V14M-26 -14V14M-6 -14V14M14 -14V14M34 -14V14' };

  // Patience's head, from the side, bill to the right: a long bill, one round eye, the dark stripe
  // that runs back into a thin plume, and the top of her neck. A head and no more, as the fox is;
  // the same heron on both of her cards. In a 122 x 68 box whose corner is (x, y).
  function heron(c, x, y) {
    var t = 'translate(' + N(x) + ' ' + N(y) + ')';
    c.line('M26 30C26 16 38 8 50 9C56 9.5 60 12 64 15L120 26L62 31C56 33 50 36 46 42C40 52 30 56 30 68', { t: t });   // crown, bill, throat
    c.line('M26 30C20 42 12 54 14 68', { t: t });                                        // the back of her neck
    c.line('M56 14C44 9.4 32 13 24 22C18 28 10 33 2 40', { t: t, w: 0.85 });             // the stripe, and its plume
    c.dot(54, 21, { t: t, w: 1.5 });                                                     // one round eye
    c.fine('M64 23.6L110 26.4', { t: t, w: 0.7 });                                       // her bill is shut
    c.fine('M22 30Q14 36 8 46', { t: t, w: 0.7 });                                       // a second plume
  }

  // A cloud with a flat foot, w wide, its left end at (x, y).
  function cloud(x, y, w) {
    var k = w / 60;
    function P(a, b) { return N(x + a * k) + ' ' + N(y + b * k); }
    return 'M' + P(4, 0) + 'C' + P(-6, 0) + ' ' + P(-6, -13) + ' ' + P(6, -13) + 'C' + P(6, -25) + ' ' + P(24, -28) + ' ' + P(30, -18) +
      'C' + P(36, -27) + ' ' + P(52, -23) + ' ' + P(50, -11) + 'C' + P(62, -12) + ' ' + P(64, 0) + ' ' + P(54, 0) + 'Z';
  }

  // The "scale" as its own card draws it, small: round at one end, a blunt point at the other.
  function shard(x, y, k, rot) {
    var P = at(x, y, k, rot);
    return 'M' + P(-6, -46) + 'Q' + P(0, -50) + ' ' + P(6, -46) + 'C' + P(21, -34) + ' ' + P(39, -10) + ' ' + P(38, 9) +
      'C' + P(37, 30) + ' ' + P(21, 39) + ' ' + P(0, 39) + 'C' + P(-21, 39) + ' ' + P(-37, 30) + ' ' + P(-38, 9) + 'C' + P(-39, -10) + ' ' + P(-21, -34) + ' ' + P(-6, -46) + 'Z';
  }

  // A ring on still water, seen from a cat's height: a flat oval.
  function ring(x, y, rx, ry) {
    return 'M' + N(x - rx) + ' ' + N(y) + 'a' + N(rx) + ' ' + N(ry) + ' 0 1 0 ' + N(2 * rx) + ' 0a' + N(rx) + ' ' + N(ry) + ' 0 1 0 ' + N(-2 * rx) + ' 0Z';
  }

  // ------------------------------------------------------------------ chapter 5: the pictures

  // Tiny prints in the dug earth behind the pile. (eye, noticing only) The heap of her dug-earth
  // card, close (its very outline, half as big again), and three tiny prints going up it.
  PICS['prints-pile'] = { label: 'a small crumbly heap of earth with three tiny prints in it', draw: function (c) {
    c.line('M26.5 176C47.5 173 58 146 73 126.5C82 114.5 94 117.5 101.5 108.5C113.5 101 127 111.5 133 126.5C145 149 154 173 173.5 176');
    prints(c, [[69, 160, 70], [95, 151, 70], [121, 144, 70]], PRINT);
    [[38, 154], [52, 128], [163, 151], [150, 121], [68, 106], [137, 99]].forEach(function (p) { c.dot(p[0], p[1], { w: 1.25 }); });
    c.line('M36 185h13M150 185h14M91 185h17', { w: 0.8 });
    c.fine('M24 150h.1M176 138h.1M102 92h.1', { w: 1.1 });
  } };

  // Puddle says clever little paws picked up mice on the storm night. (ear) One flash from the air:
  // a heap of mice, and two little paws lifting the top one off it. Paws, and nothing of whose.
  PICS['puddle-paws'] = { label: 'two little paws lifting a mouse off a heap of mice, under a zigzag of lightning', draw: function (c) {
    var x = 86, y = 195, up = 125;
    [x - 24, x, x + 24].forEach(function (mx) { mouse(c, mx, y, 2); });                  // a heap: three,
    [x - 12, x + 12].forEach(function (mx) { mouse(c, mx, y - 22, 2); });                // two on them,
    c.line('M' + N(x - 46) + ' ' + N(y + 5) + 'H' + N(x + 48), { w: 0.8 });
    mouse(c, x, up, 2.4);                                                                // and the top one, going up
    // a paw: a round end (two toe lines, large) and a wrist that comes from nowhere
    [[x - 25.9, up - 10.8, 112], [x + 27.3, up - 10.8, -112]].forEach(function (p) {
      var P = at(p[0], p[1], 1.6, p[2]);
      c.line('M' + P(-4.6, 12) + 'L' + P(-4.6, 3) + 'C' + P(-6.8, -1) + ' ' + P(-5.6, -8) + ' ' + P(0, -8) + 'C' + P(5.6, -8) + ' ' + P(6.8, -1) + ' ' + P(4.6, 3) + 'L' + P(4.6, 12), { w: 0.85 });
      c.fine('M' + P(-1.9, -7.6) + 'L' + P(-1.9, -3.2) + 'M' + P(1.9, -7.6) + 'L' + P(1.9, -3.2), { w: 0.6 });
    });
    c.line('M172 62L150 96H170L144 134');                                                // FLASH!
    c.fine('M' + N(x - 7) + ' ' + N(up - 32) + 'v-7M' + N(x) + ' ' + N(up - 34) + 'v-8M' + N(x + 7) + ' ' + N(up - 32) + 'v-7', { w: 0.7 });   // up it goes
  } };

  // The old otter says the fox told him the dragon story. (ear) The fox's head, his nose at the old
  // otter's ear (a small round one, and it does not hear well).
  PICS['otter-fox'] = { label: 'a fox’s head beside an otter’s ear', draw: function (c) {
    var t = 'translate(104 102)';
    fox(c, 6, 88, 1);
    // the old otter, looking the other way: a low flat head on a neck as thick as it is
    c.line('M2 86C0 72 2 60 8 50C10 38 22 28 36 27C48 26 60 30 66 38C70 43 70 50 65 54C60 58 54 59 48 58C46.4 66 47 76 48 86', { t: t });
    c.line('M9 51C1 48 -3 37 4 32C11 28 19 33 18 41', { t: t });                         // his ear
    c.dot(50, 37, { t: t, w: 1.3 });
    c.dot(66.4, 45, { t: t, w: 1.9 });
    c.line('M60 51Q68 49 72 53M59 54Q67 57 71 65M57 57Q62 63 63 73', { t: t, w: 0.75 });  // his long whiskers
    c.fine('M7 45C3 41 4 35 9 34', { t: t, w: 0.75 });
    c.fine('M65 51C61 55 55 56 51 54', { t: t, w: 0.75 });
    c.fine('M91 130Q95 137.6 91 145M96 126Q102 137.6 96 149', { w: 0.75 });              // told
  } };

  // Thin brown fur at the Crossing. (eye) The raft's vine, a twist in it, and a tuft caught there.
  PICS.fur = { label: 'a tuft of fur caught on a twist of vine', draw: function (c) {
    c.line('M24 104C50 94 76 94 96 102C110 108 112 124 101 126C90 127 89 112 102 105C124 95 152 99 176 90');
    c.line('M56 97C52 86 57 77 67 74C69 84 65 93 56 97ZM142 99C147 109 156 113 166 111C163 102 153 97 142 99Z', { w: 0.8 });
    c.line('M97 121C90 136 84 152 85 168M99 123C95 142 91 162 95 180M100 124C100 146 101 168 108 188M101 124C105 146 110 166 122 184' +
      'M102 123C109 142 118 158 132 172M103 122C113 138 124 150 139 158M104 120C114 130 126 138 140 142', { w: 0.65 });
    c.fine('M98 122C92 140 87 158 89 174M100 124C97 146 96 168 101 186M101 124C103 148 106 170 115 188M102 123C107 144 114 164 127 180M103 122C111 140 121 154 136 166', { w: 0.5 });
    c.fine('M57 96Q62 86 66 76M144 100Q154 104 164 110', { w: 0.6 });
  } };

  // Patience says there was NO moon on the storm night. (ear) Her head under a dark sky: clouds
  // where the fox's card has its moon, and nothing coming down from them (his moon came out "when
  // the rain stopped", so a line of rain here would let both be true).
  PICS['heron-no-moon'] = { label: 'a heron’s head under a dark sky: clouds, and no moon', draw: function (c) {
    c.line(cloud(104, 104, 68) + cloud(30, 116, 56));
    c.line('M76 68H176M72 78H100M28 86H92M98 112H176M112 121H176', { w: 0.8 });   // dark: no moon anywhere in it
    heron(c, 30, 122);
  } };

  // Patience says two small shapes crossed her mud, carrying something. (ear) Her head, and under
  // it two small low shapes, each with something at its front end. Shapes and nothing more, as
  // Squall's two are: no ears, no tails, no feet.
  PICS['heron-shapes'] = { label: 'a heron’s head, and under it two small low shapes, each with something in its mouth', draw: function (c) {
    heron(c, 52, 60);
    c.line(slink(0, 0, 50, 6.2), { t: 'translate(150 150) rotate(90)' });
    c.line(slink(0, 0, 50, 6.2), { t: 'translate(108 180) rotate(90)' });
    [[158, 150], [116, 180]].forEach(function (p) {
      var P = at(p[0], p[1], 1, 0);
      c.line('M' + P(-5, 0) + 'C' + P(-5, -5.6) + ' ' + P(4.6, -6.4) + ' ' + P(6, -0.4) + 'C' + P(6.6, 5.4) + ' ' + P(-4.4, 6.2) + ' ' + P(-5, 0) + 'Z', { w: 0.85 });
    });
    c.line('M94 164H170M50 194H128', { w: 0.8 });                                        // her mud
  } };

  // Tiny prints in the marsh mud. Much smaller than a cat's. (eye) A line of them across the mud,
  // and her own forepaw held over one from the raft: a paw, never a print of hers in that mud.
  PICS['prints-marsh'] = { label: 'a line of tiny prints, and her own paw held over one, twice its size', draw: function (c) {
    prints(c, [[34, 96, 90], [67, 88, 90], [100, 96, 90], [133, 88, 90], [166, 96, 90]], PRINT);
    c.line('M83 204C84 188 83 172 81.5 160C78 151 77.6 139 81 132C81 122 90 119 91.5 128C91.5 116 100 114 100 125C100 114 108.5 116 108.5 128C110 119 119 122 119 132C122.4 139 122 151 118.5 160C117 172 116 188 117 204');
    c.line('M91.5 128V138M100 125V137M108.5 128V138', { w: 0.8 });
    c.fine('M85 186l5 -4M115 186l-5 -4M86 196l5 -4M114 196l-5 -4', { w: 0.6 });
  } };

  // The tiny prints run toward the train tracks. (eye, climbing only) From the top of Riffle's pole:
  // Squall's track, and a line of tiny prints running off to it where his card has the two shapes.
  PICS['prints-tracks'] = { label: 'a line of tiny prints running off to the two lines of a track', draw: function (c) {
    var T = spot(TRACK.at[0], TRACK.at[1], 1, TRACK.at[2]), list = [], i;
    c.line(TRACK.rails, { t: TRACK.t });
    c.line(TRACK.ties, { t: TRACK.t, w: 0.75 });
    // six of them, left and right, straight at the nearer rail (in the track's own frame the rails
    // lie level and the prints come up from below); from up here they are smaller still
    for (i = 0; i < 6; i++) list.push(T(i % 2 ? 4.5 : -4.5, 25 + i * 17).concat(TRACK.at[2]));
    prints(c, list, 0.9);
  } };

  // Wisp drew a fox dropping something glittering in the reeds. (ear) Her drawing, copied: the fox,
  // a small thing with shine lines falling from his shut mouth, and a ring of ripples.
  PICS['wisp-fox'] = { label: 'a fox’s head, a small shining thing falling from its mouth, and a ring of ripples', draw: function (c) {
    fox(c, 46, 64, 1);
    c.line(shard(129, 152, 0.3, 14));
    c.line('M146 138L155 131M149 151L160 150M111 144L101 139M109 157L99 160', { w: 0.85 });
    c.line(ring(128, 190, 40, 9.5), { w: 0.85 });
    c.line(ring(128, 190, 19, 4.4), { w: 0.85 });
    c.fine('M124 124V132M133 122V131', { w: 0.7 });                                       // falling
  } };

  // ------------------------------------------------------------------ chapter 6: the pictures

  // (docs/chapters/06-the-snake-in-the-stones.spec.md, "3. The Case File": three ears)

  // Tidy's own row: four places at its step on its ruled ground, the row `tidy` draws twice, here
  // once, at its lower row's height, so the two cards that lie touching show one pile. `gap`: the
  // places left empty, each a light level dent in the earth where a piece lay (as "four gone").
  var TIDY_ROW = { x0: 56, step: 33, y: 174, k: 1.7 };
  function tidyRow(c, gap) {
    var R = TIDY_ROW, dents = '';
    for (var i = 0; i < 4; i++) {
      var x = R.x0 + i * R.step;
      if ((gap || []).indexOf(i) >= 0) dents += 'M' + N(x - 5.6) + ' ' + N(R.y) + 'h11.2';
      else mouse(c, x, R.y, R.k, 'straight');
    }
    c.line('M30 ' + N(R.y + 6) + 'H172', { w: 0.8 });
    if (dents) c.line(dents, { w: 0.8 });
  }

  // Sloshbank says ReedClan's pile is robbed too, and left tidy. (ear) A stern cat's head, three
  // drips falling from under his chin (his belly is always dripping), beside tidy's row with one gap.
  PICS['reed-pile'] = { label: 'a stern cat’s head with three drips under its chin, beside a tidy row of mice with one gap in it', draw: function (c) {
    // a big tom's broad head, ears up, cheeks full: a face, front on
    c.line('M84 86C80 100 82 114 94 121Q110 129 126 121C138 114 140 100 136 86');
    c.line('M84 86L86 64L101 75Q110 72 119 75L134 64L136 86');
    c.line('M89 93L104 99M131 93L116 99', { w: 1.15 });                                // stern: brows down to the middle
    c.line('M93 103H103M117 103H127', { w: 0.9 });                                       // eyes level and narrow
    c.line('M106.6 109.6H113.4L110 113.6Z', { w: 0.85 });                               // the nose
    c.line('M103.6 119H116.4', { w: 0.9 });                                              // a mouth that does not smile
    c.fine('M90 72L92 81M130 72L128 81', { w: 0.7 });                                    // inside the ears
    c.fine('M80 108L66 106M80 113L67 116M140 108L154 106M140 113L153 116', { w: 0.6 });  // whiskers
    // three drips under his chin, the last one falling
    c.line('M100 129Q103.6 136 103.6 138.8A3.6 3.6 0 0 1 96.4 138.8Q96.4 136 100 129Z' +
      'M110 134Q113.6 141 113.6 143.8A3.6 3.6 0 0 1 106.4 143.8Q106.4 141 110 134Z' +
      'M120 129Q123.6 136 123.6 138.8A3.6 3.6 0 0 1 116.4 138.8Q116.4 136 120 129Z', { w: 0.85 });
    c.fine('M110 151v2.6', { w: 0.7 });                                                 // drip
    tidyRow(c, [2]);
  } };

  // Coil says small diggers come and go under our pile. (ear) A snake's rounded head at the left, his
  // chin on the ground, one round eye that never shuts; the pile's mice on the ground beside him;
  // and under the ground only a few short scrape marks. Nothing of the diggers: no animal, no hole.
  PICS['coil-diggers'] = { label: 'a snake’s head with one round unblinking eye, beside a row of mice on the ground, and short scrape marks under the ground', draw: function (c) {
    // his head, side on, nose to the right: round over the top, the chin flat on the ground (listening),
    // and his neck going off to the left along the ground
    c.line('M24 140C34 140 40 132 50 126C62 118 78 120 84 132C87 138 86 146 82 150L28 150');
    c.line('M52 134a6.4 6.4 0 1 0 12.8 0a6.4 6.4 0 1 0 -12.8 0Z', { w: 0.9 });        // one round eye, wide open
    c.dot(58.4, 134, { w: 1.6 });                                                        // its round pupil
    c.line('M70 145Q76 147 82 145', { w: 0.8 });                                        // his mouth, shut
    c.fine('M80 136h.1', { w: 1.1 });                                                    // a nostril
    c.fine('M30 145Q36 142 40 145M42 141Q48 138 52 141', { w: 0.6 });                   // his scales
    // the ground and the pile's mice on it
    [104, 132, 160].forEach(function (x) { mouse(c, x, 150, 1.5, 'straight'); });
    c.line('M22 156H176', { w: 0.8 });
    // scrape, scrape: under the ground, under the pile, a few short claw scrapes, two strokes side by
    // side each, this way and that (never a line long enough to be a way through)
    c.line('M98 166l6 7M104 166l6 7M126 172l-6 7M132 172l-6 7M148 166l6 7M154 166l6 7', { w: 0.85 });
    c.fine('M110 186l5 6M115 186l5 6M141 187l-5 6M146 187l-5 6', { w: 0.65 });
  } };

  // Sleet says the fox talks about 'a fine, dry den'. (ear) The fox's head, eyes half shut, a small
  // curl of words from his mouth, and beside him a round den mouth with three short straight lines
  // standing over it: dry (no rain, nothing falling).
  PICS['sleet-den'] = { label: 'a fox’s head saying something, and a round den mouth with three short dry lines over it', draw: function (c) {
    fox(c, 22, 114, 1);
    c.line('M104 150Q109 144 114 147Q118 151 113 154Q109 155 109 151', { w: 0.85 });   // a small speech curl
    // the den: a round mouth in the ground, its inside, the ground it opens in
    c.line('M118 196C118 158 172 158 172 196');
    c.line('M128 196C128 172 162 172 162 196', { w: 0.8 });
    c.line('M108 196H178', { w: 0.8 });
    // dry: three short straight lines standing over it, fanned out, nothing coming down
    c.line('M145 150V136M130 154L123 142M160 154L167 142', { w: 0.85 });
    c.fine('M136 182h.1M152 186h.1M144 178h.1', { w: 1.1 });                            // dry leaves inside
  } };

  // ------------------------------------------------------------------ chapter 7: the pictures

  // (docs/chapters/07-the-counts-dont-lie.spec.md, "3. The Case File": one ear, three eyes)

  // Digits scratched with one claw, each in its own 10 x 16 box (x right, y down), drawn at (x, y),
  // its top left, k its size: the numbers a card writes ("24" by a short line, "60" by a long one).
  // (Every point is a pair, M, L and C only, so each one is moved to its place, as `at` places it.)
  var DIGIT = {
    0: 'M5 0C11.6 0 11.6 16 5 16C-1.6 16 -1.6 0 5 0Z',
    2: 'M0.4 4C0.6 0.4 9.6 -0.6 9.8 4.2C10 7.6 3.6 11 0.2 16L10 16',
    4: 'M7.4 16L7.4 0L0 11L10 11',
    6: 'M9.2 1.6C6 -0.6 0.4 0.6 0.2 8.6C0 13.6 2.2 16 5 16C8 16 10 14 10 11C10 8 8 6.4 5.2 6.4C2.6 6.4 0.8 7.8 0.2 10'
  };
  function digits(c, str, x, y, k, w) {
    String(str).split('').forEach(function (dg, i) {
      var d = DIGIT[dg];
      if (!d) return;
      var P = at(x + i * 13.6 * k, y, k, 0);
      c.line(d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, function (m0, a, b) { return P(+a, +b); }), w ? { w: w } : null);
    });
  }

  // Waffles says there was NO moon on the storm night. (ear) Her head, front on, under heron-no-moon's
  // own dark sky (clouds where the fox's card has its moon, nothing falling), since the three lie in one
  // row: a flat face, round fluffy cheeks, two small ears in the fluff and her bow on the right one.
  PICS['waffles-no-moon'] = { label: 'a fluffy cat’s head with a bow, under a dark sky: clouds, and no moon', draw: function (c) {
    c.line(cloud(104, 104, 68) + cloud(30, 116, 56));
    c.line('M76 68H176M72 78H100M28 86H92M98 112H176M112 121H176', { w: 0.8 });   // dark: no moon anywhere in it
    // the fluff all round her face: a ring of soft bumps, fullest at the cheeks
    var cx = 92, cy = 170, d = '', N0 = 14, i;
    for (i = 0; i <= N0; i++) {
      var a = Math.PI * 2 * i / N0 - Math.PI / 2, rx = 37 + 4 * Math.abs(Math.cos(a)), ry = 29, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      if (i === 0) d += 'M' + N(x) + ' ' + N(y);
      else {
        var am = a - Math.PI / N0, bx = cx + Math.cos(am) * (rx + 7), by = cy + Math.sin(am) * (ry + 6);
        d += 'Q' + N(bx) + ' ' + N(by) + ' ' + N(x) + ' ' + N(y);
      }
    }
    c.line(d + 'Z');
    c.line('M66 147L68 129L82 141M118 147L116 129L102 141', { w: 0.9 });          // two small ears in the fluff
    // her bow, on the right ear: two loops and the knot, two short tails
    c.line('M119 133Q108 120 106 131Q107 140 119 133Q131 121 134 131Q132 141 119 133Z', { w: 0.85 });
    c.line('M118 135l-4 8M120 135l5 7', { w: 0.75 });
    // a flat face: big round eyes, a tiny nose right between them, a small mouth
    c.line('M70 168a7.4 7.4 0 1 0 14.8 0a7.4 7.4 0 1 0 -14.8 0ZM99.2 168a7.4 7.4 0 1 0 14.8 0a7.4 7.4 0 1 0 -14.8 0Z', { w: 0.9 });
    c.dot(78.6, 168.6, { w: 1.7 });
    c.dot(105.4, 168.6, { w: 1.7 });
    c.line('M88.6 176.6H95.4L92 180Z', { w: 0.8 });
    c.line('M92 180Q90 185 86 184M92 180Q94 185 98 184', { w: 0.75 });
    c.fine('M60 176L46 173M60 181L47 184M124 176L138 173M124 181L137 184', { w: 0.6 });   // whiskers
  } };

  // My count: twenty-four gone in six nights; a dragon would take sixty. (eye) The panel's own
  // comparison: two straight lines one above the other, starting together, the long one two and a half
  // times the short one, "24" scratched by the short line and "60" by the long one.
  var MY_COUNT = { x: 30, k: 1.8, line: 76, short: 40, long: 100, rows: [104, 156] };
  PICS['my-count'] = { label: 'a short line and a long one, 24 and 60', draw: function (c) {
    var M = MY_COUNT;
    [['24', M.short], ['60', M.long]].forEach(function (r, i) {
      var y = M.rows[i];
      digits(c, r[0], M.x, y - 8 * M.k, M.k, 0.9);
      c.line('M' + N(M.line) + ' ' + N(y) + 'H' + N(M.line + r[1]), { w: 1.25 });
    });
  } };

  // Sprinkle's prints are huge; the thief's are tiny. (eye) One of her big prints, pointing up the bark:
  // a broad pad, five long toes fanned like a hand, a long claw beyond each (the print the Old Bridge's
  // mud holds, app/art/sets/bridge.js); and beside it one tiny print, drawn as prints-marsh draws them.
  var BIG_PRINT = { x: 84, y: 160, L: 120, fan: [-0.82, -0.41, 0, 0.41, 0.82] };
  PICS['prints-sprinkle'] = { label: 'one big print with five long claws, and a tiny print beside it', draw: function (c) {
    var B = BIG_PRINT;
    function P(u, v) { return N(B.x + v * B.L) + ' ' + N(B.y - u * B.L); }
    // the pad: a rounded heel, a little broader toward the toes
    var pad = '', i, k;
    for (k = 0; k <= 16; k++) {
      var a = Math.PI * 2 * k / 16, ca = Math.cos(a);
      pad += (k ? 'L' : 'M') + P(-0.2 + ca * (ca > 0 ? 0.15 : 0.13), Math.sin(a) * (0.17 + (ca > 0 ? 0.04 : 0)));
    }
    c.line(pad + 'Z');
    var toes = '', claws = '';
    for (i = 0; i < 5; i++) {
      var f = B.fan[i], cu = Math.cos(f), cv = Math.sin(f), r0 = i === 0 || i === 4 ? 0.21 : 0.26, toe = '';
      for (k = 0; k <= 10; k++) {
        var t = Math.PI * 2 * k / 10, al = r0 + Math.cos(t) * 0.11, ac = Math.sin(t) * 0.05;
        toe += (k ? 'L' : 'M') + P(-0.05 + cu * al - cv * ac, cv * al + cu * ac);
      }
      toes += toe + 'Z';
      // the claw: a long slash beyond the toe, pointing on along it
      claws += 'M' + P(-0.05 + cu * (r0 + 0.16), cv * (r0 + 0.16)) + 'L' + P(-0.05 + cu * (r0 + 0.38), cv * (r0 + 0.38));
    }
    c.line(toes, { w: 0.85 });
    c.line(claws, { w: 1.1 });
    // the thief's: one tiny print beside it, at the size every tiny print is drawn
    prints(c, [[154, 178, 0]], PRINT);
    c.fine('M70 196h28M142 196h24', { w: 0.6 });                                        // the mud
  } };

  // A tunnel under the back of the pile, too small for a dragon. (eye) Coil's row of mice on the
  // ground, exactly as coil-diggers draws them (the two lie touching), and at the left end of the
  // ground the tunnel: its mouth a small flat oval in the ground, hatched close inside so it reads
  // dark, two lines going down from it and in under the ground beneath the mice, and a few thin root
  // lines arching over the mouth. Nothing in it, nothing coming out. (Plainly not sleet-den's den: no
  // arch standing on the ground, no dry lines over it.)
  var TUNNEL = { cx: 46, cy: 158, rx: 17, ry: 6.4 };
  PICS.tunnel = { label: 'a row of mice on the ground, and a tunnel going down under them, its mouth hatched dark, roots over it', draw: function (c) {
    var T = TUNNEL, hatch = '', i;
    [104, 132, 160].forEach(function (x) { mouse(c, x, 150, 1.5, 'straight'); });
    c.line('M22 156H27M67 156H176', { w: 0.8 });                                         // the ground, broken by the mouth
    c.line('M' + N(T.cx - T.rx) + ' ' + N(T.cy) + 'a' + N(T.rx) + ' ' + N(T.ry) + ' 0 1 0 ' + N(2 * T.rx) + ' 0a' + N(T.rx) + ' ' + N(T.ry) + ' 0 1 0 ' + N(-2 * T.rx) + ' 0Z');
    // hatched close inside: short slanting strokes, each from edge to edge of the oval
    for (i = -7; i <= 7; i++) {
      var x0 = T.cx + i * 2.6, s = 0.55, pts = [];
      // the line x = x0 + s * (y - cy), cut by the oval
      var A = s * s / (T.rx * T.rx) + 1 / (T.ry * T.ry), Bq = 2 * s * (x0 - T.cx) / (T.rx * T.rx), Cq = (x0 - T.cx) * (x0 - T.cx) / (T.rx * T.rx) - 1, D = Bq * Bq - 4 * A * Cq;
      if (D <= 0) continue;
      [-1, 1].forEach(function (sg) { var dy = (-Bq + sg * Math.sqrt(D)) / (2 * A) * 0.82; pts.push([x0 + s * dy, T.cy + dy]); });
      if (Math.abs(pts[1][1] - pts[0][1]) > 1.4) hatch += 'M' + N(pts[0][0]) + ' ' + N(pts[0][1]) + 'L' + N(pts[1][0]) + ' ' + N(pts[1][1]);
    }
    c.line(hatch, { w: 0.6 });
    // going down, and in, under the mice
    c.line('M31 162L118 197M60 163L126 186', { w: 0.85 });
    // the bramble's roots, arching low over the mouth, thin and wandering, a rootlet or two
    c.line('M20 124C34 116 54 120 63 135C66 140 67 146 66 151M28 136C38 132 47 136 51 145M34 112C52 104 74 110 82 128C84 134 84 140 82 145', { w: 0.7 });
    c.line('M42 119l-3 -7M57 125l5 -5M74 116l4 -6M39 133l-4 -5', { w: 0.55 });
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
