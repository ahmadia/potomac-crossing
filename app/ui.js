/* Potomac Crossing: the UI.
 *
 * The comic page: title, "Who's playing?", the frames (panel, captions, balloons, sound effects,
 * and one interaction each), the Counts lesson with its keypad, the book page, the Training
 * Hollow, My nest, and the grown-ups corner. All state lives in PC.engine; this file draws it.
 * Chapter 4 adds her Case File: its curl of bark in the top bar and the hub, the screen it opens
 * over the page (her cards on moss, in two groups; a card shown large), the card a frame gives her
 * shown under its panel, and three pages she taps: the row of bark she scratches (`scratch`), the
 * glint at the pile (`scratch` with `tap`), and the first time she opens her file (`file`).
 * Chapter 5 adds the page of questions she taps out of an otter (`ask`), the skip-count's new forms
 * (the tuck, her paws aboard, nine claws in a log on the frame's own scene, the mud count), a soft
 * glow of the page's own on anything a frame asks her to tap (`scratch` with `tap`: a nose, a tuft
 * of fur, a patch of mud) with a small answer to a tap anywhere else, the nines in a lesson (the hop
 * and the tuck as a question is asked, the help in two phases, two answers scratched in the sand),
 * a lesson nobody speaks in (captions), cards lying three in a row in her Case File, and a dragonet
 * drawn in its own pose in her book. Chapter 8 adds a row of four in her Case File (the middle join's
 * line centred between the first, kept left, and the last, kept right), three speakers and their
 * voices (Hail, Snip, Snatch), and the corner's words for `foundHail`. Chapter 9 adds three speakers
 * and their voices (Thymeleaf, Mizzle, GroveClan's cats by variant) and the corner's words for
 * `foundMizzle` and `ch9Roof`; nothing else on the page changes. Chapter 11 adds the Type screen (her own warrior
 * ending, typed after her first part, refused in place by a balloon: renderEnding, UI.ending) and her warrior name
 * wherever E.displayName shows (nameHtml lets it break between its halves); nothing changes for a cat not yet named.
 * Chapter 12 adds Chispapaw's Spanish: rich() letters the engine's «…» marks in italics (lang="es") with the English
 * gloss upright under them, Read to me says them in the Spanish voice by locale and name (UI.voices: never a novelty
 * voice, never Spanish in an English voice), the echoes on the Counts page and the take page, the Spanish count on a
 * skip, Chispapaw on the Hollow's shelf and the grown-ups corner's voice line; no line of chapters 1 to 11 has a mark.
 *
 * Loads in Node without a DOM (it only exports the pure layout helpers there).
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var UI = PC.ui = PC.ui || {};

  /* ================================================================ pure layout helpers */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function rectCircle(r, c) {
    var nx = clamp(c.x, r.x, r.x + r.w), ny = clamp(c.y, r.y, r.y + r.h);
    var dx = c.x - nx, dy = c.y - ny;
    return dx * dx + dy * dy < c.r * c.r;
  }
  function overlap(a, b, gap) {
    gap = gap || 0;
    return a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
  }
  function overlapArea(a, b) {
    var w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    var h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? w * h : 0;
  }
  function segHitsRect(x1, y1, x2, y2, r) {
    // Liang-Barsky clip of a segment against a rectangle
    var t0 = 0, t1 = 1, dx = x2 - x1, dy = y2 - y1;
    var p = [-dx, dx, -dy, dy], q = [x1 - r.x, r.x + r.w - x1, y1 - r.y, r.y + r.h - y1];
    for (var i = 0; i < 4; i++) {
      if (p[i] === 0) { if (q[i] < 0) return false; }
      else {
        var t = q[i] / p[i];
        if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; }
        else { if (t < t0) return false; if (t < t1) t1 = t; }
      }
    }
    return t1 - t0 > 0.02;
  }
  /* Find a spot for a w×h box inside a W×H panel: never over a face, never over a placed box,
   * close above its speaker's head, in reading order after the previous box. Returns the box
   * {x, y, w, h, cost} (so readsAfter can judge it) or null when nothing fits (the caller then
   * stacks the balloons under the panel).
   * What the picture is about (a `keep` circle: the claw marks, the camp's moon) is kept off by the
   * tail too: a balloon whose tail would cross one is ruled out on a first pass, as a box over one
   * always was, and such a spot is taken only when nothing else fits (ch11 f023: the old tom's tail
   * ran through the moon; the polish release v23). A face under a tail stays a cost (tailOverFaces). */
  function findSpot(o) {
    if (o.head && !o.near && (o.faces || []).some(isKeep)) {
      var clear = spotScan(o, true);
      if (clear) return clear;
    }
    return spotScan(o, false);
  }
  // a keep circle (keepCircles: no speaker, no face radius), not a face
  function isKeep(c) { return !c.who && !c.rr; }
  /* Whether a balloon's tail, as drawBalloon draws it, crosses a keep circle: the wedge from the box (its middle) to
   * its tip (1.12 of the face's radius short of the face's middle), min(13, w / 7) wide each side where it leaves the box
   * (and its 3px stroke), narrowing to the tip, against the area the art keeps (the circle less the 4px of room a box
   * keeps from it, keepCircles: a tail through that room alone hides nothing, and moving for it only lengthened tails).
   * Sampled along its length. Pure: tested in Node. */
  function tailOverKeep(box, head, faces) {
    var keeps = (faces || []).filter(isKeep);
    if (!keeps.length || !head) return false;
    var cx = box.x + box.w / 2, cy = box.y + box.h / 2, dx = cx - head.x, dy = cy - head.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
    var reach = (head.r || 0) * 1.12;
    if (d <= reach) return false;
    var tx = head.x + dx / d * reach, ty = head.y + dy / d * reach, ux = tx - cx, uy = ty - cy;
    var tEdge = Math.min(Math.abs(ux) > 1e-6 ? (box.w / 2) / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-6 ? (box.h / 2) / Math.abs(uy) : Infinity);
    if (tEdge >= 1) return false;   // the tip inside the box: no tail
    var half = Math.min(13, box.w / 7) + 1.5;
    for (var k = 0; k <= 24; k++) {
      var t = tEdge + (1 - tEdge) * k / 24, px = cx + ux * t, py = cy + uy * t, hw = half * (1 - k / 24);
      for (var i = 0; i < keeps.length; i++) {
        var ex = px - keeps[i].x, ey = py - keeps[i].y, rr = Math.max(0, keeps[i].r - 4) + hw;
        if (ex * ex + ey * ey < rr * rr) return true;
      }
    }
    return false;
  }
  function spotScan(o, keepTails) {
    var W = o.W, H = o.H, w = o.w, h = o.h, m = o.margin == null ? 8 : o.margin;
    if (w > W - 2 * m || h > H - 2 * m) return null;
    var faces = o.faces || [], placed = o.placed || [], bodies = o.bodies || [];
    var head = o.head, prev = o.prev, step = o.step || 6;
    var best = null, bestCost = Infinity, low = null, lowCost = Infinity;
    for (var y = m; y <= H - h - m; y += step) {
      for (var x = m; x <= W - w - m; x += step) {
        var r = { x: x, y: y, w: w, h: h };
        var bad = false, i, alt = null;
        for (i = 0; i < faces.length && !bad; i++) if (rectCircle(r, faces[i])) bad = true;
        for (i = 0; i < placed.length && !bad; i++) if (overlap(r, placed[i], 6)) bad = true;
        if (!bad && o.after) {
          // reading order is a rule here: below the balloon before it, or to its right
          // (a balloon mostly to the LEFT of the one before it must sit wholly below it, or it is read first)
          var af = o.after, leftOf = x + w <= af.x + af.w * 0.4;
          if (!(y >= af.y + af.h * (leftOf ? 1 : 0.5) || (x >= af.x + af.w * 0.6 && y >= af.y - 10))) bad = true;
        }
        if (!bad && o.afterCap) {
          // captions are read first: the first balloon sits wholly below the opening caption, or to its right
          var ac = o.afterCap;
          if (!(y >= ac.y + ac.h || (x >= ac.x + ac.w * 0.6 && y >= ac.y - 10))) bad = true;
        }
        if (!bad && keepTails && tailOverKeep(r, head, faces)) bad = true;
        if (bad) continue;
        var cx = x + w / 2, bottom = y + h, cost = 0;
        if (o.near) {
          var nb = o.near, ncx = nb.x + nb.w / 2, ncy = nb.y + nb.h / 2;
          var gx = Math.max(0, Math.max(nb.x - (x + w), x - (nb.x + nb.w))), gy = Math.max(0, Math.max(nb.y - (y + h), y - (nb.y + nb.h)));
          cost += (gx + gy) * 2.2 + Math.abs(cx - ncx) * 0.15;
          if (y + h / 2 < ncy - 4) cost += 80;
          // the neck that joins it to the balloon before it is a line across the picture too: off every face
          // (the neck is the only line a chained balloon draws: it has no tail of its own, so a face
          // between it and its speaker costs nothing. Charged, that undrawn tail threw chapter 2's
          // "Flat ears still count." across the panel, onto another cat)
          cost += tailOverFaces(cx, y + h / 2, { x: ncx, y: ncy }, faces);
          if (head) {
            var hx2 = head.x, hy2 = head.y;
            for (i = 0; i < placed.length; i++) if (placed[i] !== nb && segHitsRect(cx, y + h / 2, hx2, hy2, placed[i])) cost += 300;
          }
        } else if (head) {
          for (i = 0; i < placed.length; i++) if (segHitsRect(cx, y + h / 2, head.x, head.y, placed[i])) cost += 400;
          cost += tailOverFaces(cx, y + h / 2, head, faces);
          var top = head.y - head.r;
          var ideal = top - Math.max(18, H * 0.06);
          cost += Math.abs(cx - head.x) * 0.55;
          cost += Math.abs(bottom - ideal) * 0.5;
          if (bottom > top) cost += (bottom - top) * 2.5;
          var tx = clamp(head.x, x, x + w), ty = clamp(head.y, y, y + h);
          var len = Math.sqrt((tx - head.x) * (tx - head.x) + (ty - head.y) * (ty - head.y)) - head.r;
          if (len > W * 0.38) cost += (len - W * 0.38) * 1.2;
        } else {
          cost += y * 1.2 + (o.index === 0 ? x * 0.25 : 0);
          // an off-panel voice: its tail leaves through the top edge, so keep that path clear
          for (i = 0; i < placed.length; i++) if (segHitsRect(cx, y, cx + w * 0.2, -6, placed[i])) cost += 400;
          // ... or, from the lower part of the panel, through the bottom edge (drawBalloon's rule). The
          // panel's last balloon (`o.last`: nothing has to read after it) is weighed a second way there,
          // `alt`: as LOW as it can go, by the edge its tail leaves through, its way down clear of the
          // balloons already placed and of every face (see below, where the best spot is chosen)
          if (o.last && y > H * 0.4) {
            var exit = { x: clamp(x + w * 0.7, 10, W - 10), y: H + 6 };
            alt = (H - y - h) * 1.2 + tailOverFaces(cx, y + h / 2, exit, faces);
            for (i = 0; i < placed.length; i++) if (segHitsRect(cx, y + h, exit.x, exit.y, placed[i])) alt += 400;
          }
        }
        if (prev) {
          if (y < prev.y - 4) cost += (prev.y - y) * 3 + 80;
          if (y < prev.y + prev.h && y + h > prev.y && x < prev.x) cost += 60;
        }
        for (i = 0; i < bodies.length; i++) cost += overlapArea(r, bodies[i]) * 0.012;
        if (cost < bestCost) { bestCost = cost; best = { x: x, y: y, w: w, h: h, cost: cost }; }
        if (alt != null) {
          // (the same reading-order and body terms, on the second weighing)
          if (prev) {
            if (y < prev.y - 4) alt += (prev.y - y) * 3 + 80;
            if (y < prev.y + prev.h && y + h > prev.y && x < prev.x) alt += 60;
          }
          for (i = 0; i < bodies.length; i++) alt += overlapArea(r, bodies[i]) * 0.012;
          if (alt < lowCost) { lowCost = alt; low = { x: x, y: y, w: w, h: h, cost: alt }; }
        }
      }
    }
    // An off-panel voice that lands in the lower part of the panel hangs its tail down to the bottom
    // edge. Where it lands is decided as it always was (so nothing moves between the top and the
    // bottom: chapter 3's sleepy voice from across camp stays under its captions); but once it is in
    // the lower part, the panel's last balloon takes the lowest clear spot there, not the highest:
    // as high as would fit, it hung a long tail down across the picture (chapter 4's "GLINTSTAR!",
    // shouted from outside the pile, past our cat's face; chapter 3's f045, 235px of tail)
    if (low && best && best.y > H * 0.4) best = low;
    return best;
  }
  /* A tail that would run across somebody else's face (or what the picture is about: a `keep` area's
   * circle): a spot to avoid, as dear as a tail over another balloon. The tail is the line from the
   * balloon's middle (x1, y1) to its speaker's head; a face counts as the square inside its circle
   * (0.7 of its radius each way), and the speaker's own is passed over. Pure: tested in Node. */
  function tailOverFaces(x1, y1, head, faces) {
    var cost = 0;
    for (var i = 0; i < (faces || []).length; i++) {
      var fc = faces[i];
      if (Math.abs(fc.x - head.x) < 2 && Math.abs(fc.y - head.y) < 2) continue;   // the speaker's own
      if (segHitsRect(x1, y1, head.x, head.y, { x: fc.x - fc.r * 0.7, y: fc.y - fc.r * 0.7, w: fc.r * 1.4, h: fc.r * 1.4 })) cost += 500;
    }
    return cost;
  }
  /* What the picture is about (the art's `keep` areas, percent of the panel): the circles the
   * lettering keeps off, in a W × H panel. An area up to four times as long as it is wide is one
   * circle round it, as chapters 1 to 3 always had it (their longest is 3.1 to 1). A longer one (a
   * row of the pile: chapter 4's back row is 14 to 1) is kept clear along its length, a row of small
   * circles: as one circle it would be as wide as the row is long, cover half the panel, and push
   * every caption and balloon out of the picture. Pure: tested in Node. */
  function keepCircles(k, W, H) {
    var kw = k.w * W / 100, kh = k.h * H / 100, lng = Math.max(kw, kh), thin = Math.min(kw, kh);
    var n = thin > 0 && lng > thin * 4 ? Math.ceil(lng / thin) : 1, out = [];
    // (the one circle, to the last bit as it always was: chapters 1 to 3 letter exactly as they did)
    if (n === 1) return [{ x: (k.x + k.w / 2) * W / 100, y: (k.y + k.h / 2) * H / 100, r: Math.max(k.w * W, k.h * H) / 200 + 4, who: '', rr: 0 }];
    for (var i = 0; i < n; i++) {
      out.push({ x: k.x * W / 100 + (kw >= kh ? kw * (i + 0.5) / n : kw / 2), y: k.y * H / 100 + (kw >= kh ? kh / 2 : kh * (i + 0.5) / n),
        r: thin * 0.71 + 4, who: '', rr: 0 });
    }
    return out;
  }
  /* A balloon tail: a wedge from inside the box to a tip just short of the speaker's face. */
  function tailGeom(box, tip, width) {
    var cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    var dx = tip.x - cx, dy = tip.y - cy, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / len, uy = dy / len;
    var tEdge = Math.min(Math.abs(dx) > 1e-6 ? (box.w / 2) / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-6 ? (box.h / 2) / Math.abs(dy) : Infinity);
    var ex = cx + dx * tEdge, ey = cy + dy * tEdge;                // where the line leaves the box
    if (tEdge >= 1) return null;                                     // tip inside the box
    var inset = Math.min(14, Math.min(box.w, box.h) / 3);
    var bx = ex - ux * inset, by = ey - uy * inset;                  // tail base, inside the box
    var px = -uy, py = ux;
    var full = Math.sqrt((tip.x - bx) * (tip.x - bx) + (tip.y - by) * (tip.y - by));
    var bend = Math.min(10, full * 0.12);
    var mx = (bx + tip.x) / 2 + px * bend, my = (by + tip.y) / 2 + py * bend;
    var d = 'M' + f1(bx + px * width) + ' ' + f1(by + py * width) + ' Q' + f1(mx + px * width * 0.35) + ' ' + f1(my + py * width * 0.35) + ' ' + f1(tip.x) + ' ' + f1(tip.y) +
      ' Q' + f1(mx - px * width * 0.35) + ' ' + f1(my - py * width * 0.35) + ' ' + f1(bx - px * width) + ' ' + f1(by - py * width) + 'Z';
    // the mouth: covers the balloon's border where the tail joins
    var k = (inset + 3) / full, w2 = Math.max(0, width * (1 - k) - 2);
    var ox = ex + ux * 3, oy = ey + uy * 3;
    var mouth = 'M' + f1(bx + px * (width - 2)) + ' ' + f1(by + py * (width - 2)) + ' L' + f1(ox + px * w2) + ' ' + f1(oy + py * w2) +
      ' L' + f1(ox - px * w2) + ' ' + f1(oy - py * w2) + ' L' + f1(bx - px * (width - 2)) + ' ' + f1(by - py * (width - 2)) + 'Z';
    return { d: d, mouth: mouth, edge: { x: ex, y: ey }, dir: { x: ux, y: uy } };
  }
  function f1(n) { return (Math.round(n * 10) / 10).toString(); }
  /* Heads from PC.art.render: an array in cast order (null = out of shot), each {x, y} in percent
   * of the panel, with r (the face's radius, percent of the panel width) for the cats, Riffle, the
   * otters and the dogs, measured by the art (app/art/scenes.js, faceR). A face is kept between
   * 1.8 and 16 (a close-up still leaves the balloons room). The sparrow, the moth and the Tall One
   * (seen only from cat height) have small fixed sizes; anything else without r gets a default.
   * An object keyed by who is accepted too. Returns [{ who, h: {x, y, r} | null }] in cast order.
   * Pure: tested in Node. */
  var FACE_R = { sparrow: 2.5, moth: 2.5, tallone: 2 };
  function castHeads(heads, cast) {
    var out = [];
    if (Array.isArray(heads)) {
      (cast || []).forEach(function (c, i) {
        var h = heads[i];
        if (!h || typeof h.x !== 'number') { out.push({ who: c && c.who, h: null }); return; }
        var who = c && c.who, r = typeof h.r === 'number' && isFinite(h.r) && h.r > 0 ? clamp(h.r, 1.8, 16)
          : Object.prototype.hasOwnProperty.call(FACE_R, who) ? FACE_R[who] : 6.5;
        out.push({ who: who, h: { x: h.x, y: h.y, r: r } });
      });
    } else if (heads && typeof heads === 'object') {
      Object.keys(heads).forEach(function (k) {
        var h = heads[k];
        if (h && typeof h.x === 'number') out.push({ who: k.replace(/[-]?\d+$/, ''), h: { x: h.x, y: h.y, r: typeof h.r === 'number' ? h.r : 6.5 } });
      });
    }
    return out;
  }
  /* Which of the cast members with this `who` a balloon comes from: its `nth` (E.balloons: its place
   * among that speaker's balloons), or the first of them when the cast has fewer. So one cat speaking
   * twice is one speaker (both balloons slot 0: the second chains to the first, with a neck), and two
   * dogs in a row are two (slots 0 and 1, each with a tail to its own head). A speaker not in the
   * cast at all is slot 0. `list` is castHeads' list. Pure: tested in Node. */
  function speakerSlot(list, who, nth) {
    var count = 0;
    for (var i = 0; i < (list || []).length; i++) if (list[i].who === who) count++;
    nth = nth > 0 ? Math.floor(nth) : 0;
    return nth < count ? nth : 0;
  }
  /* For each balloon (in order): its speaker's slot, and `same`: it continues the balloon before
   * (the same `who`, and the same one of them). A balloon knows which of its speaker's cast members
   * it is from E.balloons' `nth` (hidden balloons still count), else by counting. A balloon that
   * continues the one before is chained to it (a neck, placed with it) and gets no tail or name tag
   * of its own. Pure: tested in Node. */
  function speakerRuns(list, bs) {
    var nth = {}, out = [];
    (bs || []).forEach(function (b, bi) {
      var n = nth[b.who] = (nth[b.who] == null ? 0 : nth[b.who] + 1);
      if (typeof b.nth === 'number') n = b.nth;
      n = speakerSlot(list, b.who, n);
      out.push({ slot: n, same: bi > 0 && bs[bi - 1].who === b.who && !!b.who && out[bi - 1].slot === n });
    });
    return out;
  }
  /* A crowded panel's fallback spot still has to read after the balloon before it: on a lower tier
   * (its top below that balloon's middle) or on the same tier to its right, never above it nor on its
   * tier to its left. When no spot passes, the balloons stack beside the panel, in order. */
  function readsAfter(b, prev) {
    // side by side (sharing more than half the shorter one's height) is one tier: read left to right
    var ov = Math.min(b.y + b.h, prev.y + prev.h) - Math.max(b.y, prev.y);
    if (ov > Math.min(b.h, prev.h) * 0.5) return b.x >= prev.x + prev.w - 4;
    return b.y >= prev.y + prev.h * 0.5;
  }
  /* A sound effect's lettering: LOUD sounds big and gold, quiet ones (all lower case) small and pale;
   * a long one ("CLANKETY-CLANK! RUMMMBLE-RUMMMBLE!") shrinks until its estimated width fits the panel
   * (the estimate runs about a fifth wide for Bangers, so the real line keeps a margin, rotated too). */
  function sfxFit(text, W) {
    var quiet = text === text.toLowerCase();
    var size = clamp(W * 0.085, 30, 92) * (text.length > 9 ? 0.82 : 1) * (quiet ? 0.6 : 1);
    var estW = text.length * size * 0.5 + size * 0.4, estH = size * 1.05;
    var maxW = W * 0.92;
    if (estW > maxW) { size *= maxW / estW; estW = maxW; estH = size * 1.05; }
    return { quiet: quiet, size: size, estW: estW, estH: estH };
  }
  /* Where a sound effect goes: the freest of nine spots (the top corners first; a face costs less
   * than a caption or a balloon, which would hide it) at its fitted size, as chapters 1 and 2 placed
   * it: a face alone never shrinks it (chapter 2's PLIP! lands on the cat's nose). Only when the best
   * spot would sit under a caption or a balloon does the lettering shrink (down to half, never below
   * 18px unless it was smaller to start with), and then on until a spot is clear of faces too, if
   * one is (chapter 3's train runs along the top, clear of the cats' faces). Returns
   * { box: {x, y, w, h}, size, clear } (clear: no caption or balloon over it).
   * Chapter 5: a frame may say where its sound goes (`sfxAt: [x, y]`, the middle of the lettering in
   * hundredths of the panel: the Roar, "lettered across the whole sky", under the airplane). `at` is
   * that: the lettering goes there at its fitted size, kept inside the panel, and smaller (the same
   * steps, down to half) only while a caption or a balloon would hide it; if one still would at
   * half size, it is placed as any other. Faces and the kept areas do not move it: the frame chose
   * the spot with the picture in front of it. */
  function sfxPlace(text, W, H, faces, placed, at) {
    var fit = sfxFit(text, W), size0 = fit.size, estW0 = fit.estW, estH0 = fit.estH;
    var best = null, bestScore = Infinity, bestHidden = true, size = size0;
    if (Array.isArray(at) && at.length === 2 && isFinite(+at[0]) && isFinite(+at[1])) {
      var fixed = null;
      [1, 0.85, 0.72, 0.6, 0.5].some(function (sk) {
        var s2 = sk === 1 ? size0 : Math.max(Math.min(18, size0), size0 * sk), eW = estW0 * s2 / size0, eH = estH0 * s2 / size0;
        var r = { x: clamp(W * +at[0] / 100 - eW / 2, W * 0.02, Math.max(W * 0.02, W * 0.98 - eW)), y: clamp(H * +at[1] / 100 - eH / 2, H * 0.02, Math.max(H * 0.02, H * 0.98 - eH)), w: eW, h: eH };
        if ((placed || []).some(function (b) { return overlapArea(r, b) > 0; })) return false;
        fixed = { box: r, size: s2, clear: true };
        return true;
      });
      if (fixed) return fixed;
    }
    [1, 0.85, 0.72, 0.6, 0.5].some(function (sk) {
      var s2 = sk === 1 ? size0 : Math.max(Math.min(18, size0), size0 * sk), eW = estW0 * s2 / size0, eH = estH0 * s2 / size0;
      var spots = [
        [W - eW - W * 0.04, H * 0.06], [W * 0.04, H * 0.06], [W - eW - W * 0.04, H - eH - H * 0.08],
        [W * 0.04, H - eH - H * 0.08], [(W - eW) / 2, H * 0.08], [(W - eW) / 2, H - eH - H * 0.1],
        // when captions fill the top corners and faces the bottom: halfway down a side, or the middle
        [W * 0.04, (H - eH) * 0.45], [W - eW - W * 0.04, (H - eH) * 0.45], [(W - eW) / 2, (H - eH) * 0.45]
      ];
      spots.forEach(function (p, k) {
        var r = { x: p[0], y: p[1], w: eW, h: eH }, score = k * 2 + (1 - sk) * 40, hidden = false;
        (faces || []).forEach(function (c) { if (rectCircle(r, c)) score += 1000; });
        // captions and balloons sit on top of the lettering, so any overlap hides it: worse than a face
        (placed || []).forEach(function (b) { var a = overlapArea(r, b); if (a > 0) { score += 1500 + a / 50; hidden = true; } });
        if (score < bestScore) { bestScore = score; best = r; size = s2; bestHidden = hidden; }
      });
      return sk === 1 ? !bestHidden : bestScore < 1000;
    });
    return { box: best, size: size, clear: !bestHidden };
  }
  UI.layout = { findSpot: findSpot, tailGeom: tailGeom, rectCircle: rectCircle, overlap: overlap, segHitsRect: segHitsRect, castHeads: castHeads,
    speakerSlot: speakerSlot, speakerRuns: speakerRuns, readsAfter: readsAfter, sfxFit: sfxFit, sfxPlace: sfxPlace,
    tailOverFaces: tailOverFaces, keepCircles: keepCircles, tailOverKeep: tailOverKeep };

  /* Keys that turn pages (Enter, Space, → and ←) get the guard taps have: held down, Enter's
   * auto-repeat would go title → hub → chapter 2 in one press, so a repeated Enter or Space is never
   * a press; and in the first moments of a screen (GUARD_MS, the double-tap guard in bindChrome) a
   * page key is the end of the press that drew it. Typing (digits, letters, Backspace) is never held
   * back. `since` is when the screen was drawn, `t` now (ms). Pure: tested in Node. */
  var PAGE_KEYS = { Enter: 1, ' ': 1, ArrowRight: 1, ArrowLeft: 1 };
  function keyFresh(e, since, t) {
    var k = e && e.key;
    if ((k === 'Enter' || k === ' ') && e.repeat) return false;
    if (PAGE_KEYS[k] && t - since < UI_GUARD_MS) return false;
    return true;
  }
  var UI_GUARD_MS = 350;
  UI.keys = { fresh: keyFresh, GUARD_MS: UI_GUARD_MS, PAGE_KEYS: PAGE_KEYS };

  /* ---------------------------------------------------------------- speakers (pure: tested in Node)
   * A balloon's name tag: its own `name` ("A small voice" before Sprinkle shows herself; tokens
   * filled), else the chapter's `names` for that speaker (chapter 3's tortie: "{Murmur}paw"), else the
   * player's Clan name, an otter's or a dog's by variant, the art's name, or the list below. `fill`
   * fills the cat's tokens. Read to me gives each speaker a pitch and a pace of their own. */
  var NAMES = {
    tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles', tallone: 'The Tall One',
    grizzled: 'Grizzled old tom', snorer: 'Snoring apprentice', mutterer: 'Muttering apprentice', snorter: 'Snorting apprentice',
    clancat: 'A Clan cat', sparrow: 'Sparrow', moth: 'Moth',
    riffle: 'Riffle', otter: 'An otter', dog: 'A dog',
    sprinkle: 'Sprinkle', murmurchime: '{Murmur}chime',
    // chapter 4: the chapter that meets them labels each "The fox" and "The little dragon" (its
    // `names`) until he is named on screen; from then on his balloons carry `name`
    reynard: 'Reynard', squall: 'Squall',
    // chapter 5: the heron is Patience from her first balloon (Riffle has named her); Puddle is "The
    // big-footed dragon" (the chapter's `names`) until "I'm Puddle"; Wisp never speaks on screen
    patience: 'Patience', puddle: 'Puddle', wisp: 'Wisp',
    // chapter 6: Coil is "A voice", then "The snake" (the chapter's `names`) until Riffle names him; Sleet
    // is "The long grass", then "The silver-white dragon" until "I'm Sleet"; ReedClan's cats by variant
    coil: 'Coil', sloshbank: 'Sloshbank', sleet: 'Sleet', reedclan: 'A ReedClan cat',
    // chapter 8: Hail is "The speckled dragonet" (the chapter's `names`) until "I'm Hail!"; the weasels
    // are "A weasel" until the caption tells them apart, and their balloons carry `name` from then on
    hail: 'Hail', snip: 'Snip', snatch: 'Snatch',
    // chapter 9: Thymeleaf from his first balloon (Tallyheart has just said his name); Mizzle is "The
    // sleepy dragonet" (the chapter's `names`) until "I'm Mizzle."; GroveClan's cats by variant, unnamed
    thymeleaf: 'Thymeleaf', mizzle: 'Mizzle', groveclan: 'A GroveClan cat',
    // chapter 10: the Mistscales by variant (Mama; the eldest, who never speaks); ReedClan's and GroveClan's
    // leaders are their Clans' variants 5 and 3 (below), Granny chapter 5's otter variant 3, by the chapter's `names`
    mistscale: 'A Mistscale',
    // chapter 12: "The little cat" (each balloon's `name`) until Glintstar names her, then Chispapaw
    chispapaw: 'Chispapaw',
    // chapter 13: the first of the seven sleepers; "The round brown thing" (each balloon's `name`) until it says GROUNDHOG
    groundhog: 'The groundhog'
  };
  // otters and dogs are told apart by their variant (docs/build.md, cast, chapter 2)
  var VARIANT_NAMES = {
    otter: { 1: 'The old ferry otter', 2: 'An otter', 3: 'An otter' },
    dog: { 1: 'The shaggy dog', 2: 'The spotty dog', 3: 'The tiny dog' },
    // chapter 6: the she-cat never speaks; 3 and 4 are the watchers' two more marsh coats
    reedclan: { 1: 'ReedClan she-cat', 2: 'Young ReedClan tom', 3: 'A ReedClan cat', 4: 'A ReedClan cat', 5: 'ReedClan’s leader' },
    // chapter 9: labels only, never names (the brief, call 11); the apprentice never speaks; no variant reads as 1
    groveclan: { 1: 'A GroveClan elder', 2: 'A GroveClan apprentice', 3: 'GroveClan’s leader' },
    // chapter 10: Mama and the eldest Mistscale; the Clans' leaders at the Gathering (GroveClan's crowd, 4 and 5, are
    // "A GroveClan cat")
    mistscale: { 1: 'Mama', 2: 'The eldest Mistscale' }
  };
  var PITCH = { waffles: 1.45, tallyheart: 0.92, glintstar: 0.85, grizzled: 0.6, player: 1.2, snorer: 1.1, mutterer: 1.3, snorter: 1.15, clancat: 1.0, tallone: 1.0,
    riffle: 1.5, otter: 1.05, dog: 0.9, sprinkle: 1.38, murmurchime: 1.3, reynard: 0.8, squall: 1.7,
    patience: 0.7, puddle: 1.32, wisp: 1.25,
    coil: 0.72, sloshbank: 0.62, sleet: 1.45, reedclan: 1.0,
    hail: 1.5, snip: 1.65, snatch: 1.35,
    thymeleaf: 0.82, mizzle: 1.35,
    mistscale: 0.7,
    chispapaw: 1.42,
    groundhog: 0.78 };
  var VARIANT_PITCH = { otter: { 1: 0.68, 3: 0.92 }, dog: { 1: 0.55, 2: 0.95, 3: 1.75 }, reedclan: { 2: 1.12, 5: 0.8 }, groveclan: { 1: 0.78, 3: 0.88 },
    mistscale: { 2: 0.6 } };
  // Sprinkle is shy: a little slower than everyone else's 0.95. Reynard is slow and smooth; Squall
  // is high and loud (as loud as the voice goes), and in a hurry. Chapter 5: Patience is low and
  // slow; Puddle is bright and quick, a little out of breath. Chapter 6: Coil is low and very slow
  // (every word on its own); Sloshbank low and slow, a big stern tom; Sleet high, quick and loud (the
  // voice's full volume, as everyone's); the young ReedClan tom a little high (VARIANT_PITCH). Chapter 8:
  // Hail bright and quick; Snip squeaky and quicker still; Snatch a little lower, his mouth full of mouse.
  // Chapter 9: Thymeleaf low, warm and slow; Mizzle sweet and sleepy, slow; GroveClan's elder old and slow
  // (VARIANT_PITCH; the rate takes no variant, so it is every GroveClan cat's: the apprentice never speaks).
  // Chapter 10: Mama low, soft and slow (the eldest lower still, and never speaks); ReedClan's and GroveClan's
  // leaders a little low, at their Clans' rates; Granny, chapter 5's otter variant 3, a little low (no rate:
  // RATE.otter would change chapter 5's otters). Chapter 12: Chispapaw high and quick, in English and in Spanish (the
  // Spanish voice takes her pitch and 0.9 of her rate: UI.voices.plan). Chapter 13: the groundhog low, grumpy and slow
  var RATE = { sprinkle: 0.86, reynard: 0.82, squall: 1.02, patience: 0.8, puddle: 1.05, coil: 0.7, sloshbank: 0.88, sleet: 1.04,
    hail: 1.08, snip: 1.12, snatch: 1.0,
    thymeleaf: 0.85, mizzle: 0.82, groveclan: 0.86,
    mistscale: 0.8,
    chispapaw: 1.02,
    groundhog: 0.84 };
  function pitchOf(who, variant) {
    var v = VARIANT_PITCH[who] && VARIANT_PITCH[who][variant || 1];
    return v || PITCH[who] || 1;
  }
  function rateOf(who) { return RATE[who] || 0.95; }
  function speakerLabel(s, o) {
    o = o || {};
    var f = o.fill || function (x) { return x; };
    if (s.name) return f(s.name);
    var names = o.story && o.story.names;
    if (names && typeof names[s.who] === 'string') return f(names[s.who]);
    if (s.who === 'player') return o.cat && o.cat.name ? o.cat.name + 'paw' : 'You';
    if (VARIANT_NAMES[s.who]) return VARIANT_NAMES[s.who][s.variant || 1] || NAMES[s.who];
    var ch = PC.art && (PC.art.characters || PC.art.cast);
    if (ch && !Array.isArray(ch) && ch[s.who] && ch[s.who].name) return ch[s.who].name;
    return NAMES[s.who] ? f(NAMES[s.who]) : (s.who ? String(s.who).charAt(0).toUpperCase() + String(s.who).slice(1) : '');
  }
  /* A voice the story hasn't shown yet keeps its face to itself in the stacked balloons: a named
   * balloon whose speaker isn't in the picture, or is only eyes in the dark ("A small voice"), or
   * hides her face under her tail ("A muffled voice", "The tail"). Chapter 6: or is only a stone in
   * the wall (Coil's `stone`: "A voice"), or only bent grass or a tail's tip in the long grass
   * (Sleet's `hidden` and `tail`: "The long grass"). */
  var NO_FACE_POSES = { eyes: 1, hide: 1, stone: 1, hidden: 1, tail: 1 };
  function faceHidden(s, member) { return !!s.name && (!member || NO_FACE_POSES[member.pose] === 1); }
  /* The name a speaker's balloons carry on a page (the latest of that speaker's that has one), for a
   * balloon the page adds itself: a skip-count's counter under Squall's own "Squall" balloon is his
   * too, not the chapter's "The little dragon". Undefined when none of them is named. */
  function nameOn(balloons, who) {
    var name;
    (balloons || []).forEach(function (b) { if (b && b.who === who && b.name) name = b.name; });
    return name;
  }
  /* The balloons a Counts frame says again over its first question: its own, unless the lesson is
   * being picked up again (`skip`: resumed, or its balloons were just read over a kept skip picture),
   * or the frame carries a whole conversation (three balloons or more: the riddle's "HALT!", "Friend!
   * Sprinkle sent me.", "PROVE it!" over a three-line question made the page taller than the screen,
   * and it opened scrolled; she has just read them on the frame itself). Chapter 5: nor does a frame
   * that says so (`counts: { intro: false }`, passed in as `skip`: the tens warm-up, whose first
   * question may be her hardest ten and is timed on itself). */
  function lessonIntro(said, skip) { return skip || (said || []).length > 2 ? [] : said || []; }
  UI.speakers = { label: speakerLabel, pitch: pitchOf, rate: rateOf, faceHidden: faceHidden, nameOn: nameOn, lessonIntro: lessonIntro, NAMES: NAMES };
  /* The grown-ups corner's words for the story's flags (every flag a chapter sets has words here;
   * filled with the cat's tokens, so a tom reads "his"). */
  var FLAG_WORDS = {
    stepOut: { chase: 'chased the moth out the door', slow: 'stepped out slowly' },
    spokeUp: { 'true': 'spoke up about the thirteenth sparrow', 'false': 'stayed quiet about the sparrow' },
    joinReason: { learn: 'asked to join to learn everything', count: 'asked to join because “I can learn to count anything”', brave: 'asked to join because “I’m braver than I look”' },
    specialty: { noticing: 'good at noticing', sneaking: 'good at sneaking', climbing: 'good at climbing', swimming: 'likes water (swimming)', friends: 'good at making friends' },
    worry: { small: 'worries about being too small', water: 'worries about deep water', talk: 'talks when nervous', shiny: 'distracted by shiny things' },
    // chapter 2
    ch2SaidAloud: { 'true': 'said the missing prey out loud, to the whole Clan', 'false': 'whispered the missing prey to Tallyheart, who told the whole camp' },
    ch2Path: { bridge: 'peeked under the Old Bridge, against the rule (chapter 3 remembers)', river: 'stayed by the river with Riffle and heard the tower roar (chapters 3 and 4 remember)' },
    ch2Stone: { nose: 'put Riffle’s stone by {their} nose (chapter 3 remembers)', chin: 'put Riffle’s stone under {their} chin (chapter 3 remembers)' },
    // chapter 3
    ch3Told: { 'true': 'told Tallyheart about Sprinkle, and Tallyheart helped hide her (later chapters remember)', 'false': 'kept Sprinkle’s secret: only Riffle knows too (later chapters remember)' },
    // chapter 4: two flags set by reaching a frame, never by a choice, and never unset
    foundSquall: { 'true': 'found Squall on the tower roof (later chapters remember)' },
    ch4CaughtFly: { 'true': 'caught the fox’s “flew”: Sprinkle can’t fly (later chapters remember)' },
    caseFile: { 'true': 'started a Case File' },
    // chapter 5: the witness she asked first, and three flags set by finishing a scene, never unset
    ch5First: { otters: 'asked the ferry otters first', heron: 'asked the heron first' },
    ch5Roof: { 'true': 'met Squall in chapter 5: the roof, offered again ({their} book says so on chapter 5’s page)' },
    foundPuddle: { 'true': 'found Puddle under the ferry raft (later chapters remember)' },
    foundWisp: { 'true': 'found Wisp in the heron’s reeds (later chapters remember)' },
    // chapter 6: set on the last screen of Sleet's scene, never unset
    foundSleet: { 'true': 'found Sleet at the last post of the Barking Field (later chapters remember)' },
    // chapter 7: set on the FLEW screen at the Old Bridge, every path, never unset (chapter 4's `fox-flew`
    // link reads it beside ch4CaughtFly, so her Case File draws FLEW and can't-fly touching from then on)
    ch7Flew: { 'true': 'saw Sprinkle try to fly at the Old Bridge: the fox’s “flew” can’t be true (later chapters remember)' },
    // chapter 8: set on the last screen of Hail's scene in the Barking Field, never unset (no flag records the route)
    foundHail: { 'true': 'found Hail in the hollow log in the Barking Field (later chapters remember)' },
    // chapter 9: set on the last screen of Mizzle's scene in the old oak, and on the last frame of chapter 4's
    // roof scene run again for a cat who meets Squall here (with foundSquall, as chapter 5's ch5Roof); never unset.
    // (`ch3Told` false above stays as it is: after chapter 9 Tallyheart knows on both paths, but the words
    // describe the chapter 3 choice, and the goldens pin them: chapter 9's spec, section 7, item 16)
    foundMizzle: { 'true': 'found Mizzle in the old oak in GroveClan’s woods (later chapters remember)' },
    ch9Roof: { 'true': 'met Squall in chapter 9: the roof, offered again ({their} book says so on chapter 9’s page)' },
    // chapter 10: Puddle found under the Moon Ferry (set with foundPuddle, never alone), and Tallyheart's question
    // at the end; the five card picks' flags follow, built from the stories' pick frames (UI.pickFlagWords)
    ch10Puddle: { 'true': 'found Puddle under the Moon Ferry (chapter 10; {their} book says so on chapter 10’s page)' },
    ch10Best: { sprinkle: 'will remember Sprinkle most', friends: 'will remember {their} friends most', truth: 'will remember finding the truth most', counts: 'will remember the Counts most' },
    // chapter 11: how she was named (her name itself is the corner's heading, E.displayName)
    ch11Named: { offer: 'took one of the three names Glintstar saw in {them}', self: 'named {them}self' },
    // chapter 13: how she taught Chispapaw the crouch (replaced on a reread), and the groundhog found (never unset)
    teach: { show: 'taught Chispapaw the hunter’s crouch by showing her (chapter 21 remembers)', try: 'let Chispapaw try the hunter’s crouch first, and watched (chapter 21 remembers)',
      words: 'taught Chispapaw the hunter’s crouch with Tallyheart’s own words (chapter 21 remembers)' },
    foundGroundhog: { 'true': 'found the groundhog asleep beside the big dig in GroveClan’s woods (later chapters remember)' }
  };
  UI.flagWords = FLAG_WORDS;
  // flags the engine keeps for itself: never listed among "what the choices say"
  var QUIET_FLAGS = { looked: 1, caseFileOpen: 1 };
  UI.quietFlags = QUIET_FLAGS;

  /* ---------------------------------------------------------------- the card pick (pure: tested in Node)
   * Chapter 10. The corner's words for a pick's flag, built from the stories' pick frames: an entry for
   * every card id any story defines (openGrownups reads FLAG_WORDS[k][value] and has no fallback), a right
   * card's with its line: 'answered Reynard’s “It FLEW out of your camp!” with: Sprinkle can’t fly.', any
   * other's (the guard's, unreachable) without. `stories` is a map like PC.story, or a list. */
  function storyValues(stories) {
    var list = Array.isArray(stories) ? stories : Object.keys(stories || {}).map(function (k) { return stories[k]; });
    return list.filter(function (st) { return st && st.frames; });
  }
  UI.pickFlagWords = function (stories) {
    var list = storyValues(stories), ids = [], lines = {}, out = {};
    list.forEach(function (st) {
      Object.keys(st.cards || {}).forEach(function (id) {
        if (Object.prototype.hasOwnProperty.call(lines, id)) return;
        var c = st.cards[id];
        lines[id] = c && typeof c.line === 'string' ? c.line : '';
        ids.push(id);
      });
    });
    list.forEach(function (st) {
      Object.keys(st.frames).forEach(function (fid) {
        var pk = st.frames[fid] && st.frames[fid].pick;
        if (!pk || typeof pk.flag !== 'string' || !pk.flag || typeof pk.claim !== 'string') return;
        var said = 'answered Reynard’s “' + pk.claim + '”', right = Array.isArray(pk.right) ? pk.right : [], w = out[pk.flag] = {};
        ids.forEach(function (id) { w[id] = right.indexOf(id) >= 0 ? said + ' with: ' + lines[id] : said; });
      });
    });
    return out;
  };
  (function () {
    var pw = UI.pickFlagWords(PC.story || {});
    Object.keys(pw).forEach(function (k) { if (!FLAG_WORDS[k]) FLAG_WORDS[k] = pw[k]; });
  })();
  /* The pick screen as the page draws and says it, for a view (E.pickView), the wrong picks made on the
   * frame so far, the newest nudge's line, the openings of the screen on this frame (1 the first), and
   * whether the tap being answered was on a dimmed card after the glow:
   *   strip: { who, text, word }, his claim, its word lit; nudge: { who, text, kind: 'whisper' } or null,
   *   the newest, whatever `dimmed` says; cards: [{ id, glow, dim }] in her file's order (after the
   *   glow, the right cards she holds glow and the rest are dimmed);
   *   speech, what Read to me says as the screen opens: the first opening, the claim (his voice) and
   *   every card's line in her file's order (the cards' lines only: no heading, no link line); a reopen,
   *   the claim and then `said`;
   *   said, what the newest pick says: nothing before a wrong pick; the nudge (a whisper) after one or
   *   two; the nudge and the glowing cards' lines after three or more; after a dimmed tap (only after
   *   the glow: before it nothing is dimmed, and `dimmed` is ignored) the glowing cards' lines alone. */
  UI.pickPage = function (view, wrongs, nudge, opened, dimmed) {
    view = view || {};
    var n = typeof wrongs === 'number' && isFinite(wrongs) ? wrongs : 0;
    var glow = n >= ((PC.engine && PC.engine.PICK_GLOW) || 3), right = view.right || [], F = view.file || { groups: [], links: [] }, all = [];
    (F.groups || []).forEach(function (g) { all = all.concat(g.cards || []); });
    (F.links || []).forEach(function (l) { all = all.concat(l.cards || []); });
    var strip = { who: view.who || 'reynard', text: view.claim || '', word: view.word || null };
    var nd = n > 0 && typeof nudge === 'string' && nudge ? { who: view.by || 'tallyheart', text: nudge, kind: 'whisper' } : null;
    var lit = all.filter(function (c) { return glow && right.indexOf(c.id) >= 0; }).map(function (c) { return { text: c.line }; });
    var said = n <= 0 ? [] : glow && dimmed ? lit : (nd ? [{ text: nd.text, who: nd.who, kind: 'whisper' }] : []).concat(glow ? lit : []);
    var claim = { text: strip.text, who: strip.who };
    var speech = !(opened > 1) ? [claim].concat(all.map(function (c) { return { text: c.line }; })) : [claim].concat(said);
    return { strip: strip, nudge: nd,
      cards: all.map(function (c) { var g = glow && right.indexOf(c.id) >= 0; return { id: c.id, glow: g, dim: glow && !g }; }),
      speech: speech, said: said };
  };

  /* The keypad (pure: tested in Node): what is typed after a key. Up to three digits (10 × 10 is
   * 100); a lone 0 gives way to the next digit; Delete takes the last one. OK is the caller's. */
  function keypadPress(typed, k) {
    typed = String(typed == null ? '' : typed);
    if (k === 'del') return typed.slice(0, -1);
    if (!/^[0-9]$/.test(String(k))) return typed;
    if (typed.length < 3) return (typed === '0' ? '' : typed) + k;
    return typed;
  }
  UI.keypad = { press: keypadPress, MAX: 3 };

  /* The glitter Tap (pure: tested in Node): whether a tap at (x, y) in a W × H panel lands on the
   * spot (`spot`: percent of the panel). A generous reach, for a small finger: 11% of the panel's
   * width, never less than 48px, and as wide as the art's own target when it draws one. */
  function tapHit(W, H, spot, x, y, artReach) {
    // (`artReach`: the art's own target around its glint, in percent of the width, when it is wider)
    var dx = x - W * spot.x / 100, dy = y - H * spot.y / 100, reach = Math.max(48, W * 0.11, W * (artReach > 0 ? artReach : 0) / 100);
    return dx * dx + dy * dy <= reach * reach;
  }
  /* Chapter 5, the one-tap frames (`scratch: { tap: 'nose' }`): which of a picture's marked elements
   * a tap is for. `marks` are the picture's candidates in document order, each { tap, art, cls }:
   * its `data-tap`, its `data-art`, its class names. The one named for the tap wins (`data-tap`, a
   * class `pc-tap-NAME`, or `data-art`), so a picture with two (the marsh's mud and Riffle's pole)
   * gives each frame its own; else the first glint or `pc-tap`. Returns its index, or -1. */
  function tapPick(marks, name) {
    var i, m, list = marks || [];
    for (i = 0; i < list.length; i++) {
      m = list[i] || {};
      if (name && (m.tap === name || m.art === name || (' ' + (m.cls || '') + ' ').indexOf(' pc-tap-' + name + ' ') >= 0)) return i;
    }
    for (i = 0; i < list.length; i++) {
      m = list[i] || {};
      // (an element named for another tap is not this one's)
      if (m.tap && m.tap !== name) continue;
      if (m.art === 'glint' || /(^| )(pc-glint|pc-tap)( |$)/.test(m.cls || '')) return i;
    }
    return -1;
  }
  /* The glow the page draws on such a target: as wide as the thing itself and a little more, never
   * smaller than a fingertip nor wider than a quarter of the panel (percent of the panel's width). */
  function tapGlow(reach) { return clamp((reach > 0 ? reach : 0) * 2.5, 9, 26); }
  /* Chapter 5, two answers scratched in the sand: whether the art's picture is of these numbers (its
   * aria-label names each of them, as whole numbers). An art that doesn't know `answers` draws a
   * scratch or two: the page then draws the numbers itself. */
  function namesAnswers(svg, answers) {
    var m = /aria-label="([^"]*)"/.exec(String(svg || ''));
    if (!m || !(answers || []).length) return false;
    return answers.every(function (n) { return new RegExp('(^|[^0-9])' + n + '([^0-9]|$)').test(m[1]); });
  }
  UI.taps = { hit: tapHit, pick: tapPick, glow: tapGlow, namesAnswers: namesAnswers };

  /* ---------------------------------------------------------------- the Warrior Counts (pure: tested in Node)
   * docs/warrior-counts.md, section 7's UI table: what the hub's big button says, the four paws, the
   * pauses' length, the opening with Tallyheart's "we start fresh", the result's pages and buttons, the
   * tricky chips and the grown-ups corner's line. Each takes what the engine hands the page
   * (E.warriorState, E.warriorResult, PC.warrior) and nothing from the screen, so Node checks the words.
   * None of it runs for a cat with no `warrior` data before the Counts are open: chapters 1 to 8's
   * screens letter exactly as before. */
  var W_PAW_WORDS = ['first', 'second', 'third', 'fourth'];
  var W_QUARTERS = [14, 14, 14, 13];   // the four paws: 14, 14, 14 and 13 questions
  function wNum(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }
  /* The paw she is on (0 to 3) after `answered` answers, and the four paws' fill, 0 to 1: the one she
   * is on fills a little at every answer, a miss the same as a right one; full ones stay full. */
  function wPawOn(answered) {
    var n = Math.max(0, wNum(answered, 0)), k = 0, start = 0;
    while (k < 3 && n >= start + W_QUARTERS[k]) { start += W_QUARTERS[k]; k++; }
    return k;
  }
  function wPawFills(answered) {
    var n = Math.max(0, wNum(answered, 0)), start = 0;
    return W_QUARTERS.map(function (size) { var f = clamp((n - start) / size, 0, 1); start += size; return Math.round(f * 1000) / 1000; });
  }
  /* The engine's paws (E.warriorPaws: four fills, 0 to 1), or, without them, counted from the answers. */
  function wPaws(v, answered) {
    if (Array.isArray(v) && v.length === 4 && v.every(function (x) { return typeof x === 'number' && isFinite(x); })) return v.map(function (x) { return clamp(x, 0, 1); });
    return wPawFills(answered);
  }
  /* What E.warriorState says: the sitting to pick up (none once stale: { at, answered, paw, paws }), how
   * far in it is, the latest finished attempt, whether its result is unseen. */
  function wSittingOf(ws) {
    var s = ws && ws.sitting;
    return s && typeof s === 'object' ? s : null;
  }
  function wAnswered(ws) {
    var s = wSittingOf(ws);
    if (!s) return 0;
    var st = s.state || s;
    if (typeof s.answered === 'number') return s.answered;
    if (st && Array.isArray(st.log)) return st.log.length;
    return wNum(st && st.pos, 0);
  }
  function wPawOfState(ws) {
    // (E.warriorState's sitting names its paw 1 to 4; without one, it is counted from the answers)
    var s = wSittingOf(ws), p = s && s.paw;
    if (typeof p === 'number' && isFinite(p)) return clamp(Math.round(p) - 1, 0, 3);
    return wPawOn(wAnswered(ws));
  }
  function wFinished(list) { return (list || []).filter(function (a) { return a && a.finished; }); }
  function wLastFinished(ws) {
    if (ws && ws.last && ws.last.finished) return ws.last;
    var f = wFinished(ws && ws.attempts);
    return f.length ? f[f.length - 1] : null;
  }
  function wUnseen(ws) {
    if (!ws) return false;
    if (typeof ws.unseen === 'boolean') return ws.unseen;
    var l = wLastFinished(ws);
    return !!(l && l.seen === false);
  }
  function wPassed(ws) { return !!(ws && (ws.passed || (typeof ws.passedAt === 'number' && ws.passedAt > 0))); }
  /* An unseen result that ended after her pass (a sitting again): her pass is known and kept for good,
   * so nothing waits for Glintstar to say it. Her first pass's own attempt set passedAt, so it is never
   * this; nor is anything the state cannot tell (no passedAt, no last). */
  function wAfterPassUnseen(ws) {
    var last = wLastFinished(ws);
    return wUnseen(ws) && wPassed(ws) && !!last && typeof ws.passedAt === 'number' && ws.passedAt > 0 && ws.passedAt < wNum(last.done, 0);
  }
  /* Her pass can be shown (the hub's "again" and "coming soon", the book's "coming soon"): she has passed,
   * and Glintstar has said so, or the result waiting is a sitting again's. */
  function wPassShown(ws) { return wPassed(ws) && (!wUnseen(ws) || wAfterPassUnseen(ws)); }
  function wOpen(ws) { return !!(ws && (ws.open || wPassed(ws))); }
  /* The hub's warrior slot. `ws` is E.warriorState (null: no Counts in this build, or none for her),
   * `p` E.progress. Returns null while the Counts are closed (the hub is as it always was); else
   * { big, quiet, soon, hideSoon }: `big` the big button ({ id, act, label, small, says }: act 'result'
   * reopens an unseen result, 'begin' sits or picks up), `quiet` the quiet "again" button after the
   * pass, `soon` the line in the coming-soon slot ("Your ceremony is coming soon."), `hideSoon`: while
   * the Counts are open, no chapter teaser's "coming soon" shows, and `hideNext`: while her first pass
   * waits to be seen, the Ceremony's chapter button is not there either (nothing on the hub says she
   * passed before Glintstar does). A result of a sitting again after the pass gives nothing away (her
   * pass is known and kept for good): it waits in the quiet slot, "The Warrior Counts: Glintstar is
   * waiting" (act 'result'), and the Ceremony keeps the big one. `p.ceremonyBuilt`: the Ceremony
   * chapter exists (finished or not). */
  function wHub(ws, p) {
    if (!wOpen(ws)) return null;
    p = p || {};
    var passed = wPassed(ws), sitting = wSittingOf(ws), last = wLastFinished(ws);
    // (an unseen result that ended after her pass, a sitting again's, waits quietly; her first pass's, and
    // anything the state cannot tell, in the big slot)
    var unseen = wUnseen(ws), waitsQuietly = wAfterPassUnseen(ws);
    // (chapter 11: once the Ceremony is finished the teasers show again: read from E.progress's `finished`, never
    // `latest`, which is chapter 12 once that is finished; a `p` with no `finished` hides them, as before)
    var hideSoon = !(p.finished || []).some(function (s) { return s.opensWhen === 'warrior'; });
    var out = { big: null, quiet: null, soon: null, hideSoon: hideSoon, hideNext: unseen && !waitsQuietly };
    var big = function (act, label, small, says) { return { id: 'warriorBtn', act: act, label: label, small: small, says: says }; };
    if (unseen && !waitsQuietly) out.big = big('result', 'The Warrior Counts', 'Glintstar is waiting', 'The Warrior Counts. Glintstar is waiting.');
    else if (!passed && sitting) {
      var paw = W_PAW_WORDS[wPawOfState(ws)];
      out.big = big('begin', 'Keep going', 'The Warrior Counts · ' + paw + ' paw', 'Keep going: the Warrior Counts, ' + paw + ' paw.');
    } else if (!passed && last && !last.passed) out.big = big('begin', 'The Warrior Counts', 'Try again whenever you like', 'The Warrior Counts. Try again whenever you like.');
    else if (!passed) out.big = big('begin', 'The Warrior Counts', 'When you’re ready', 'The Warrior Counts. When you’re ready.');
    // (passed, once Glintstar has said so: while her first pass is unseen nothing here gives it away)
    if (wPassShown(ws)) {
      // the Ceremony's chapter button is the hub's own (E.progress's next, as for any chapter); under it,
      // quietly, the Counts again, or the result of a sitting again waiting to be seen
      out.quiet = waitsQuietly ? { id: 'warriorAgain', act: 'result', label: 'The Warrior Counts: Glintstar is waiting' }
        : { id: 'warriorAgain', act: 'begin', label: sitting ? 'Keep going: the Warrior Counts' : 'The Warrior Counts again' };
      if (!p.next && !p.ceremonyBuilt) out.soon = 'Your ceremony is coming soon.';
    }
    return out;
  }
  /* The tricky ones as she sees them, written out in Andika: "7 × 8 = 56", up to six. */
  function wChips(missed, n) {
    return (missed || []).filter(function (m) { return Array.isArray(m) && m.length === 2; }).slice(0, n == null ? 6 : n).map(function (m) { return m[0] + ' × ' + m[1] + ' = ' + (m[0] * m[1]); });
  }
  /* A missed answer that is the start of the right one ("2" for 20, "5" for 56): a slip on the keypad
   * (OK sits beside 0), marked for grown-ups so the play test shows whether the keypad needs a guard. */
  function wSlip(a, b, given) {
    if (given == null || given === '' || isNaN(+given)) return false;
    var right = String(a * b), g = String(+given);
    return g !== right && g.length < right.length && right.indexOf(g) === 0;
  }
  /* How long a pause stays: 2.5 s, or 3.5 s when its line is over six words, or as long as its words
   * take to read (wReadMs: 0.6 s and 0.38 s a word) when that is longer, so a pause picked up with
   * "Where were we? Ah, yes." in front (14 words) stays 5.9 s. (Read to me on: until the speech ends,
   * and half a second more, and at most this long after that; the page's own.) */
  function wBeatMs(lines) {
    var words = 0, said = [];
    asList0(lines).forEach(function (l) {
      var t = String(typeof l === 'string' ? l : (l && l.text) || '');
      words += t.split(/\s+/).filter(Boolean).length;
      said.push(t);
    });
    return Math.max(words > 6 ? 3500 : 2500, wReadMs(said.join(' '), false));
  }
  function asList0(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
  /* How long Read to me takes to say these (each { text, who }): about 150 words a minute at the
   * voice's rate 1, each speaker at its own rate (rateOf). A pause, a right answer's line and the help's
   * first line wait this long (and a little more) when the voice never says it has finished. */
  function wSpeechMs(items) {
    var ms = 0;
    asList0(items).forEach(function (it) {
      var t = String(typeof it === 'string' ? it : (it && (it.text || it.html)) || '').replace(/<[^>]+>/g, ' ').replace(/×/g, ' times ');
      ms += t.split(/\s+/).filter(Boolean).length / 2.5 / rateOf(it && it.who) * 1000;
    });
    return Math.round(ms);
  }
  /* How long a right answer's line stays when she reads it herself (Read to me off): the runner's 1.3 s
   * (a quick answer) or 1.5 s, or longer for a long line, 0.6 s and 0.38 s a word ("Last time, 7 × 8
   * made you stop and think. Not today!" is 4.8 s). A tap on the panel still moves on. */
  function wReadMs(line, fast) {
    var n = String(line || '').split(/\s+/).filter(function (w) { return /[\p{L}\p{N}]/u.test(w); }).length;
    return Math.max(fast ? 1300 : 1500, Math.round(600 + 380 * n));
  }
  /* The opening's frames for this sitting: E.warriorOpen's kind ('first', 'again', 'quiet'), with
   * Tallyheart's "we start fresh" (`aside`: PC.warrior.aside's line) said once, at the start of her
   * balloon, before "Every Count, same as before." (else at the start of her first balloon, else as one
   * of its own on the last panel). Returns copies: the story's frames are never changed. */
  function wOpening(Wd, kind, aside) {
    var list = asList0(Wd && Wd.open && Wd.open[kind]).map(function (f) { return Object.assign({}, f, { say: asList0(f && f.say).map(function (b) { return typeof b === 'string' ? { text: b } : Object.assign({}, b); }) }); });
    var line = aside && Wd && Wd.aside ? Wd.aside[aside] : null;
    if (typeof line === 'string' && line && list.length) {
      var hit = null;
      var find = function (test) {
        for (var i = 0; i < list.length && !hit; i++) for (var k = 0; k < list[i].say.length && !hit; k++) if (list[i].say[k] && test(list[i].say[k])) hit = list[i].say[k];
      };
      find(function (b) { return b.who === 'tallyheart' && /^Every Count/.test(b.text || ''); });
      if (!hit) find(function (b) { return b.who === 'tallyheart'; });
      if (hit) hit.text = line + ' ' + hit.text;
      else list[list.length - 1].say.push({ who: 'tallyheart', text: line });
    }
    return list;
  }
  /* The kind of opening (E.warriorOpen, E.warriorBegin's `opening`: { kind, aside }; a bare word too). */
  function wOpenKind(op) {
    if (typeof op === 'string') return { kind: op, aside: null };
    op = op || {};
    return { kind: op.kind || 'first', aside: op.aside === 'late' || op.aside === 'practice' ? op.aside : null };
  }
  /* E.warriorResult's variant as a set of words: 'pass', 'clean', 'quiet', 'afterPass', which not-yet
   * ('first', 'second', 'later'), Tallyheart's number ('better', 'close', 'plain') and 'number' (her
   * number is said: after the pass, 50 to 54); a word, a list of them, or an object whose keys are true
   * or whose values are words. */
  var W_VARIANT_WORDS = ['pass', 'clean', 'quiet', 'afterPass', 'notYet', 'first', 'second', 'later', 'better', 'close', 'plain', 'number'];
  function wVariant(v) {
    var out = {};
    var add = function (w) { if (typeof w === 'string' && W_VARIANT_WORDS.indexOf(w) >= 0) out[w] = true; };
    if (typeof v === 'string') v.split(/[^A-Za-z]+/).forEach(add);
    else if (Array.isArray(v)) v.forEach(function (w) { if (typeof w === 'string') w.split(/[^A-Za-z]+/).forEach(add); });
    else if (v && typeof v === 'object') Object.keys(v).forEach(function (k) { if (v[k] === true) add(k); else if (typeof v[k] === 'string') v[k].split(/[^A-Za-z]+/).forEach(add); });
    return out;
  }
  /* The tables her misses fall in, as Tallyheart names them: "the 7s and the 8s". */
  function wTricky(t) {
    if (typeof t === 'string') return t;
    var list = asList0(t).map(function (x) { return typeof x === 'number' ? 'the ' + x + 's' : x && typeof x.table === 'number' ? 'the ' + x.table + 's' : typeof x === 'string' ? x : ''; }).filter(Boolean);
    return list.length > 1 ? list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1] : list[0] || 'the tricky ones';
  }
  /* The result's own tokens, in number words (E.countWords): {right} {Right} {last} {Last} {short}
   * {tricky}, filled before the cat's own. */
  function wTokens(R, words) {
    R = R || {};
    var w = typeof words === 'function' ? words : function (n) { return String(n); };
    var right = wNum(R.right, 0), last = wNum(R.last, null);
    var cap = function (x) { return x ? x.charAt(0).toUpperCase() + x.slice(1) : x; };
    var t = { right: w(right), Right: cap(w(right)), short: w(Math.max(0, 50 - right)), tricky: wTricky(R.tricky) };
    t.Tricky = cap(t.tricky);
    if (last != null) { t.last = w(last); t.Last = cap(w(last)); }
    return t;
  }
  /* The result's pages and buttons (docs/warrior-counts.md section 5), from E.warriorResult
   * ({ right, last, missed, tricky, variant }) and PC.warrior's `pass`, `notYet` or `afterPass`: each
   * `{ frames, <variant>: frame }`, a slot in `frames` (`{ by, else }`) playing the frame under the
   * first of its keys the variant names, else its `else`, else nothing. `o.quiet`: the pass came in a
   * quiet sitting (when the engine's variant does not say), `o.ceremony`: the Ceremony chapter is
   * built, `o.hollowRound`: a Training Hollow round is in progress. Returns { kind, variant, pages:
   * [{ frame, chips?, chipsAt? }], buttons: [{ id, label, big, act, disabled? }], note? }. */
  function wResult(Wd, R, o) {
    o = o || {};
    R = R || {};
    var v = wVariant(R.variant);
    // (a pass in a quiet sitting: the engine's variant says so, or, when it does not say, the page's `o.quiet`)
    var said = !!(R.variant && typeof R.variant === 'object' && !Array.isArray(R.variant) && Object.prototype.hasOwnProperty.call(R.variant, 'quiet'));
    if (!v.quiet && !said && o.quiet && v.pass && !v.afterPass) v.quiet = true;
    var kind = v.afterPass ? 'afterPass' : v.pass || v.clean ? 'pass' : 'notYet';
    var src = (Wd && Wd[kind]) || {};
    var frames = [];
    asList0(src.frames).forEach(function (e) {
      if (!e) return;
      if (e.by) {
        var key = asList0(e.by).filter(function (k) { return v[k] && src[k]; })[0];
        if (key) frames.push(src[key]); else if (e.else) frames.push(e.else);
      } else frames.push(e);
    });
    var chips = wChips(R.missed);
    var pages = frames.map(function (f) {
      var pg = { frame: f };
      var bs = asList0(f.say), at = -1;
      for (var i = 0; i < bs.length; i++) if (bs[i] && bs[i].chips) { at = i; break; }
      if (at >= 0) {
        pg.chipsAt = at; pg.chips = chips;
        // one chip under the balloon: its own words for one ("This was the tricky one."), on a copy
        if (chips.length === 1 && typeof bs[at].one === 'string' && bs[at].one) {
          pg.frame = Object.assign({}, f, { say: bs.map(function (b, k) { return k === at ? Object.assign({}, b, { text: b.one }) : b; }) });
        }
      }
      return pg;
    });
    var buttons, note = null;
    if (kind === 'pass') {
      if (o.ceremony) buttons = [{ id: 'resultCamp', label: 'Camp', big: false, act: 'camp' }, { id: 'resultCeremony', label: 'To your ceremony', big: true, act: 'ceremony' }];
      else { note = 'Your ceremony is coming soon.'; buttons = [{ id: 'resultSoon', label: note, big: false, disabled: true }, { id: 'resultCamp', label: 'Camp', big: true, act: 'camp' }]; }
    } else if (kind === 'notYet') {
      buttons = [{ id: 'resultCamp', label: 'Camp', big: false, act: 'camp' }, { id: 'resultHollow', label: o.hollowRound ? 'Back to the Training Hollow' : 'The Training Hollow', big: true, act: 'hollow' }];
    } else {
      buttons = [{ id: 'resultHollow', label: 'The Training Hollow', big: false, act: 'hollow' }, { id: 'resultCamp', label: 'Camp', big: true, act: 'camp' }];
    }
    // (the engine's number words when it gives them, E.warriorResult's `tokens`; {tricky} from its tables)
    var tokens = wTokens(R, o.countWords);
    if (R.tokens && typeof R.tokens === 'object') Object.keys(R.tokens).forEach(function (k) { if (typeof R.tokens[k] === 'string' && (R.tokens[k] || !tokens[k])) tokens[k] = R.tokens[k]; });
    return { kind: kind, variant: v, pages: pages, buttons: buttons, note: note, tokens: tokens };
  }
  /* The pause due before the next question of a sitting (runLesson's, between two answers): null, or
   * { at, lines } with Tallyheart's lines (PC.warrior.beats: after the 14th and the 42nd answers), or
   * { at, halfway: true } after the 28th, where the halfway page takes the screen. E.warriorBeat keeps
   * each in the sitting's `beats`, so a sitting picked up never shows one twice. Lines are { who, text }
   * with the tokens left for the page. */
  function wPause(E, Wd, st) {
    if (!E || typeof E.warriorBeat !== 'function' || !st) return null;
    var at = E.warriorBeat(st);
    if (!at) return null;
    if (!Array.isArray(st.beats)) st.beats = [];
    if (st.beats.indexOf(at) < 0) st.beats.push(at);
    var b = Wd && Wd.beats ? Wd.beats[at] : null;
    if (b == null) return { at: at, halfway: true };
    return { at: at, lines: asList0(b).map(function (l) { return typeof l === 'string' ? { who: 'tallyheart', text: l } : { who: l.who || 'tallyheart', text: l.text, kind: l.kind }; }).filter(function (l) { return l.text; }) };
  }
  /* The question panel (and the halfway page's own scene, `own`): the story's scene, written with the
   * crowd, drawn with the sitting's `st.crowd`: the whole Clan round the fountain until she has a
   * finished sitting, then the camp quiet (decision 49). A copy: the story's scene is never changed. */
  function wScene(Wd, st, own) {
    var sc = own || (Wd && Wd.scene), crowd = !!(st && st.crowd);
    if (!sc) return null;
    var out = Object.assign({}, sc, { opts: Object.assign({}, sc.opts || {}) });
    if (crowd) out.opts.crowd = true; else delete out.opts.crowd;
    return out;
  }
  /* The grown-ups corner's Warrior Counts line (no pronoun: the corner's lines are for a tom too):
   * not open yet; open, not sat; then each attempt, oldest first: its date, right of 55, passed or not,
   * the missed pairs with what was typed (one that is the start of the right answer marked "a slip?":
   * "2" for 20, "5" for 56), the typical time; a sitting set aside marked, and why; and a sitting in
   * progress. `o.open`: the Counts are open; `o.after`: the chapter they open after ("Chapter 10");
   * `o.date(ms)` and `o.secs(ms)` format a time. Returns { line, attempts: [lines], sitting }. */
  function wCorner(c, o) {
    o = o || {};
    var date = o.date || function (ms) { return new Date(ms).toISOString().slice(0, 10); };
    var secs = o.secs || function (ms) { return (ms / 1000).toFixed(1) + ' s'; };
    var W = c && c.warrior && typeof c.warrior === 'object' ? c.warrior : null;
    var attempts = W && Array.isArray(W.attempts) ? W.attempts : [];
    var S = W && W.sitting && W.sitting.state ? W.sitting : null;
    if (!o.open && !W) return { line: 'not open yet: they open once ' + (o.after || 'chapter 10') + ' is finished', attempts: [], sitting: null };
    var fin = attempts.filter(function (a) { return a && a.finished; });
    var passedAt = W && typeof W.passedAt === 'number' && W.passedAt > 0 ? W.passedAt : 0;
    var line = !attempts.length && !S ? 'open; not sat yet' :
      (passedAt ? 'passed on ' + date(passedAt) : 'not passed yet') + '; ' + fin.length + ' finished sitting' + (fin.length === 1 ? '' : 's') +
      (attempts.length > fin.length ? ', ' + (attempts.length - fin.length) + ' set aside' : '');
    var log = (c && Array.isArray(c.counts) ? c.counts : []).filter(function (e) { return e && e.set === 'warrior'; });
    var lines = attempts.map(function (a, k) {
      var head = '#' + (a.n != null ? a.n : k + 1) + (typeof a.at === 'number' && a.at > 1e11 ? ', ' + date(a.at) : '') + ': ';
      if (!a.finished) {
        var why = a.aside === 'late' ? 'two hours went by' : a.aside === 'practice' ? 'other Counts were practiced in between' : 'left unfinished';
        return head + 'set aside after ' + wNum(a.answered, 0) + ' of 55 answered (' + wNum(a.right, 0) + ' right): ' + why + '; never counted as a not-yet';
      }
      var t0 = wNum(a.at, -Infinity), t1 = wNum(a.done, Infinity);
      var mine = log.filter(function (e) { return !e.correct && typeof e.at === 'number' && e.at >= t0 && e.at <= t1; });
      var miss = asList0(a.missed).filter(function (m) { return Array.isArray(m) && m.length === 2; }).map(function (m) {
        var e = mine.filter(function (x) { return x.a === m[0] && x.b === m[1]; })[0];
        var typed = e && e.answer != null ? e.answer : null;
        return m[0] + ' × ' + m[1] + (typed != null ? ' (typed ' + typed + (wSlip(m[0], m[1], typed) ? ': a slip?' : '') + ')' : '');
      });
      return head + wNum(a.right, 0) + ' of 55 right, ' + (a.passed ? 'passed' : 'not yet') + (typeof a.ms === 'number' ? '; typical time ' + secs(a.ms) : '') +
        (miss.length ? '; missed ' + miss.join(', ') : '; nothing missed');
    });
    // (`o.stale`, E.warriorState's: a sitting the game will not pick up says so, in the words its attempt line will use)
    var nAns = S && S.state ? (Array.isArray(S.state.log) ? S.state.log.length : wNum(S.state.pos, 0)) : 0;
    var sitting = !(S && S.state) ? null : o.stale === 'practice' || o.stale === 'late' ?
      'a sitting left at ' + nAns + ' of 55 answered: it starts fresh next time (' + (o.stale === 'late' ? 'two hours went by' : 'other Counts were practiced in between') + ')' :
      'a sitting in progress: ' + nAns + ' of 55 answered' + (typeof S.at === 'number' && S.at > 1e11 ? ', the last at ' + date(S.at) : '');
    return { line: line, attempts: lines, sitting: sitting };
  }
  UI.warrior = { corner: wCorner, PAW_WORDS: W_PAW_WORDS, QUARTERS: W_QUARTERS, pawOn: wPawOn, pawFills: wPawFills, paws: wPaws, hub: wHub, chips: wChips, slip: wSlip,
    beatMs: wBeatMs, opening: wOpening, openKind: wOpenKind, unseen: wUnseen, passed: wPassed, open: wOpen, sittingOf: wSittingOf, lastFinished: wLastFinished,
    afterPassUnseen: wAfterPassUnseen, passShown: wPassShown,
    variant: wVariant, tricky: wTricky, tokens: wTokens, result: wResult, pause: wPause, scene: wScene, speechMs: wSpeechMs, readMs: wReadMs };

  /* ---------------------------------------------------------------- her warrior name (chapter 11; pure: tested in Node)
   * docs/chapters/11-the-warrior-ceremony.spec.md, section 6. The Type screen's rules without a page: the preview's
   * words, which line and speaker a refusal gets (the frame's `input.refuse`; the clan line's speaker is the Clan cat
   * whose name it is), the field's first value (her ending only when she typed it, `ch11Named: 'self'`: one she typed comes
   * back to be changed, an offered one she picked before is never handed back as if she had typed it, even once her
   * offers have changed with a reread of chapter 1 or 10), and what a tap
   * sends (that first value unchanged goes as her whole name, so the first-part rule drops exactly her first part). */
  var ENDING_PROMPT = 'Type your new ending.';
  // her book's “Next” once she has passed and the Ceremony is built: Glintstar's pass line (app/story/warrior.js)
  var CEREMONY_NEXT = 'Tonight, the Clan gathers again. For your warrior name.';
  function endingPrefill(cat) {
    return cat && cat.flags && cat.flags.ch11Named === 'self' && typeof cat.ending === 'string' && cat.ending ? cat.ending : '';
  }
  function endingValue(cat, typed) {
    var pre = endingPrefill(cat);
    return pre && typed === pre ? (cat.name || '') + cat.ending : typed;
  }
  function endingPreview(cat, raw) {
    var e = PC.engine.cleanEnding(raw, cat);
    return 'You will be: ' + ((cat && cat.name) || '') + (e || '…');
  }
  function endingRefusal(input, cat, raw) {
    var E0 = PC.engine, r = E0.checkEnding(raw, cat);
    if (!r.refuse) return null;
    var line = input && input.refuse && input.refuse[r.refuse];
    var who = r.refuse === 'clan' ? r.who : line && line.who;
    return { who: who || '', text: line && typeof line.text === 'string' ? E0.fill(line.text, cat) : '' };
  }
  UI.ending = { PROMPT: ENDING_PROMPT, preview: endingPreview, refusal: endingRefusal, prefill: endingPrefill, value: endingValue, ceremonyNext: CEREMONY_NEXT };
  /* The story the Warrior Counts' page labels balloons by (the page's `story` is the last chapter read): for a cat
   * with a warrior name, the same with her own balloons named `{name}{ending}`, so a re-sit after the Ceremony tags
   * her "A HUNDRED!" with the name Glintstar's "Halfway, …" says; every other label, and every other cat's, as it was. */
  function warriorLabels(story, cat) {
    if (!(PC.engine && PC.engine.warriorName(cat))) return story;
    var names = Object.assign({}, story && story.names, { player: '{name}{ending}' });
    return Object.assign({}, story, { names: names });
  }
  UI.speakers.warriorStory = warriorLabels;

  /* ---------------------------------------------------------------- the take-aways kit (pure: tested in Node)
   * docs/take-aways.md v0.3, sections 1, 2, 6 and 8: what the take page shows and says, from what the engine hands
   * it (E.takes' question, E.takeLine, E.takeQuestion, E.takeShow, E.takeHelp, E.takePicture) and nothing from the
   * screen, so Node checks the column, its boxes and marks, the lines at every stage, the waits and the reading
   * order. Columns are counted ones first, as the engine counts them (0 the ones, 1 the tens, 2 the hundreds); the
   * column is drawn left to right. Nothing here runs before chapter 12: no chapter 1 to 11 has a take set. */
  var TAKE_ZONES = ['ones', 'tens', 'hundreds'];
  var TAKE_HEADS = ['dot', 'line', 'square'];                              // the quick picture's marks over each column
  var TAKE_PIC = { ones: 'loose', tens: 'rows', hundreds: 'squares' };     // each column's picture word (E.TAKE_WORDS)
  // the page's times (sections 1 and 2): the next column 0.9 s after the last spread lands; the help 650 ms after a
  // miss; keys ignored 400 ms after every OK; a hop of the count 775 ms; a row slides 600 ms and opens 400 ms; a line
  // stays 0.6 s and 0.38 s a word (1.8 s at the least at a problem's end, 1.6 s for a step), or, Read to me on, until it
  // has been said and 0.4 s (a step 0.3 s) more, at most twice the reading time; a tap on the sand counts after 350 ms
  var TAKE_MS = { outline: 900, miss: 650, ok: 400, hop: 775, slide: 600, open: 400, tapGuard: 350, endMin: 1800, stepMin: 1600,
    endSaid: 400, stepSaid: 300, word: 380, base: 600, quiet: 1000 };
  // the kit's words as the engine reads them now (E.TAKE_WORDS, a getter over PC.words): one place for the class words
  // (decision 53). PC.engine, not E: PC.ui.takes can be called before boot sets E
  function takeWordsNow() { return PC.engine.TAKE_WORDS; }
  function tEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function tWords(s) { return String(s == null ? '' : s).trim().split(/\s+/).filter(Boolean).length; }
  /* One digit a box: a new digit replaces the one there (no Delete hunt), Delete empties it. OK is the caller's. */
  function takePress(typed, k) {
    if (k === 'del') return '';
    if (/^[0-9]$/.test(String(k))) return String(k);
    return String(typed == null ? '' : typed);
  }
  /* How long a line stays (section 1's problem end, section 2's steps): `kind` 'end', 'step' or 'hop'. `read` without
   * Read to me; with it, `after` once it has been said, never longer than `cap`. */
  function takeWaits(text, kind) {
    if (kind === 'hop') return { read: TAKE_MS.hop, after: 0, cap: TAKE_MS.hop };
    var min = kind === 'end' ? TAKE_MS.endMin : TAKE_MS.stepMin, n = tWords(text);
    var read = n ? Math.max(min, TAKE_MS.base + TAKE_MS.word * n) : TAKE_MS.quiet;
    return { read: read, after: kind === 'end' ? TAKE_MS.endSaid : TAKE_MS.stepSaid, cap: read * 2 };
  }
  /* A head: the quick picture's own mark (PC.art.quickMarks, in the sand's strokes), on its sand chip (index.html). */
  function takeHeadSvg(zone) {
    var o = { ground: 'sand' }, g = '';
    o[zone] = 1;
    try { g = PC.art && typeof PC.art.quickMarks === 'function' ? PC.art.quickMarks(32, 32, 0.9, o) : ''; } catch (e) { g = ''; }
    if (!g) g = zone === 'hundreds' ? '<rect x="9" y="9" width="46" height="46" fill="none" stroke="#7a5b2e" stroke-width="5"/>' :
      zone === 'tens' ? '<path d="M34 6 L30 58" stroke="#7a5b2e" stroke-width="5" stroke-linecap="round"/>' : '<circle cx="32" cy="32" r="12" fill="#7a5b2e"/>';
    // (cropped to the mark, so each fills its chip: the art's dot is half a square's size, too small to read there)
    var vb = zone === 'ones' ? '17 17 30 30' : '4 4 56 56';
    return '<svg viewBox="' + vb + '" aria-hidden="true" focusable="false">' + g + '</svg>';
  }
  /* The column as the page draws it (section 1): `plan` (E.takePlan), and from the page `marks` (per column, ones
   * first: { struck, mark }, as the engine letters them by the mode), `boxes` (per column: { v, cls }: her digit and
   * 'right', 'miss', 'blank' or 'pulse'), `on` (the outlined column, -1 for none), `glow` (a help's `kept` or `zero` at a
   * column that lent: its struck digit and gold mark glow) and `ask` (the problem in words, the group's label). Cells left to right: the head and its label ("hundreds, squares"), the gold mark, the top digit
   * (struck or not), the bottom digit ('' where the bottom has none), and the box with its label ("ones: 5"). */
  function takeView(plan, o) {
    o = o || {};
    var W = o.words || takeWordsNow(), cells = [];
    for (var i = plan.n - 1; i >= 0; i--) {
      var c = plan.cols[i], m = (o.marks && o.marks[i]) || {}, b = (o.boxes && o.boxes[i]) || {}, z = TAKE_ZONES[i];
      var v = b.v == null ? '' : String(b.v), cls = (o.on === i ? 'on' : '') + (b.cls ? (o.on === i ? ' ' : '') + b.cls : '');
      var cell = { col: i, zone: z, head: TAKE_HEADS[i], headLabel: W[z] + ', ' + W[TAKE_PIC[z]],
        top: String(c.top), bottom: c.bottom == null ? '' : String(c.bottom), struck: !!m.struck, mark: m.mark == null ? '' : String(m.mark),
        box: v, boxCls: cls, boxLabel: W[z] + (v !== '' ? ': ' + v : ''), current: o.on === i, glow: o.glow === i };
      if (o.moves) takeCellMoves(cell, m, o, W);
      cells.push(cell);
    }
    var view = { n: plan.n, cells: cells, label: o.ask || '' };
    if (o.moves) view.moves = true;
    return view;
  }
  /* The kit v0.4's column (decision 57; design sections 2 and 3), only with `o.moves`: `o.marks` are E.takeMoveMarks'
   * objects ({ struck, front, frontStruck, m1, m2 }); `o.box` the box she types into (T.question's: { col, kind: 'lend' |
   * 'get' | 'answer', row: 1 | 2 | 'front' }) with `o.typed` in it and `o.miniOn` (ringed); `o.flash` ({ col, row, v }:
   * a right number, green for 250 ms); `o.targets` (the columns she can tap now: a role="button" each, its hit box);
   * `o.lit` (columns glowing: a lender lit, the struck lender, a move-help's fix); `o.halo` (the column whose receiver's
   * mark has the marks page's halo); `o.ripple` (Tallyheart's paw-tap); `o.wig` (her own top digit's wiggle); `o.col`
   * the column she is on (a target next to it widens into it, the leftmost outwards). */
  var TAKE_MINI_JOB = { lend: 'new number', get: 'new number', front: 'the little 1' };
  function takeCellMoves(cell, m, o, W) {
    var i = cell.col, bx = o.box && o.box.col === i && (o.box.kind === 'lend' || o.box.kind === 'get') ? o.box : null;
    cell.mm = { struck: !!m.struck, front: m.front == null ? null : m.front, frontStruck: !!m.frontStruck, m1: m.m1 || null, m2: m.m2 || null };
    cell.mark = '';
    if (bx) {
      var tv = o.typed == null ? '' : String(o.typed), job = bx.row === 'front' ? 'front' : bx.kind;
      cell.mini = { kind: bx.kind, row: bx.row, v: tv, on: !!o.miniOn, label: W[cell.zone] + ', ' + TAKE_MINI_JOB[job] + (tv !== '' ? ': ' + tv : '') };
    } else cell.mini = null;
    cell.flash = o.flash && o.flash.col === i ? { row: o.flash.row, v: String(o.flash.v == null ? '' : o.flash.v) } : null;
    cell.target = (o.targets || []).indexOf(i) >= 0 ? { label: takeSpreadLabel(cell.zone, W), near: o.col == null || o.col === i - 1 } : null;
    cell.lit = (o.lit || []).indexOf(i) >= 0;
    cell.halo = o.halo === i; cell.ripple = o.ripple === i; cell.wig = o.wig === i;
  }
  /* The column's markup (index.html's .tcol: a grid, the sign's column and one a digit; rows for the heads, the marks,
   * the top, the bottom, the rule and the boxes, every row reserved from the start, so nothing moves). */
  function takeHtml(v) {
    var s = '<span class="tsign" aria-hidden="true">−</span>';
    v.cells.forEach(function (c, k) {
      var gc = ' style="grid-column:' + (k + 2) + '"';
      if (v.moves) { s += takeCellHtml(c, gc); return; }
      s += '<span class="thead" role="img" aria-label="' + tEsc(c.headLabel) + '"' + gc + '>' + takeHeadSvg(c.zone) + '</span>' +
        '<span class="tmark' + (c.glow ? ' tglow' : '') + '" aria-hidden="true"' + gc + '>' + tEsc(c.mark) + '</span>' +
        '<span class="tdig ttop' + (c.struck ? ' tstruck' : '') + (c.glow ? ' tglow' : '') + '" data-col="' + c.col + '" aria-hidden="true"' + gc + '>' + tEsc(c.top) + '</span>' +
        '<span class="tdig tbot" aria-hidden="true"' + gc + '>' + tEsc(c.bottom) + '</span>' +
        '<span class="tbox' + (c.boxCls ? ' ' + c.boxCls : '') + '" data-col="' + c.col + '" role="img" aria-label="' + tEsc(c.boxLabel) + '"' + (c.current ? ' aria-current="true"' : '') + gc + '>' +
        (c.box !== '' ? tEsc(c.box) : ' ') + '</span>';
    });
    return s + '<span class="trule" aria-hidden="true"></span>';
  }
  /* A small box (.tmini): only where her digits go, never a tap target; an empty one holds a no-break space (never reads as
   * a 0); the 'one' front box fits two digits in its own width (she typed 1, 3: thirteen) until OK letters the little 1. */
  function tMini(mini, cls) {
    var v = mini.v, inner = v === '' ? '\u00a0' : mini.row === 'front' && v.length > 1 ? '<span class="tfit">' + tEsc(v) + '</span>' : tEsc(v);
    return '<span class="tmini' + (mini.kind === 'get' ? ' tw2' : '') + (mini.on ? ' on' : '') + (cls ? ' ' + cls : '') + '" role="img" aria-label="' + tEsc(mini.label) + '"' +
      (mini.on ? ' aria-current="true"' : '') + '>' + inner + '</span>';
  }
  function tFlash(f, two) { return '<span class="tmini right' + (two ? ' tw2' : '') + '" aria-hidden="true">' + tEsc(f.v) + '</span>'; }
  // a marks row's content (m1, or m2 in the heads row's place): her gold number (struck as one when changed again), a little
  // 1 lettered or boxed in front of it ('one': a column that lent, then got), or the box she types into
  function tMarkHtml(m, c, row, halo) {
    if (!m) return '';
    var mini = c.mini, fl = c.flash;
    if (m.box) return fl && fl.row === row ? tFlash(fl, mini ? mini.kind === 'get' : c.mini && c.mini.kind === 'get') : mini && mini.row === row ? tMini(mini) : '<span class="tmini" aria-hidden="true">\u00a0</span>';
    if (fl && fl.row === row) return tFlash(fl, String(m.v).length > 1);
    var front = m.front === 1 ? (fl && fl.row === 'front' ? '<span class="tfront tin tfb">' + tFlash(fl) + '</span>' : '<span class="tfront tin' + (halo ? ' thalo' : '') + '">1</span>') :
      m.front === 'box' ? '<span class="tfront tin tfb">' + (mini && mini.row === 'front' ? tMini(mini) : '<span class="tmini" aria-hidden="true">\u00a0</span>') + '</span>' : '';
    var inner = front + '<span class="tmv' + (halo && m.front !== 1 ? ' thalo' : '') + '">' + tEsc(m.v) + '</span>';
    return m.struck ? '<span class="tgrp tstruck">' + inner + '</span>' : inner;
  }
  /* One column of the kit v0.4 (takeView's `moves`): the heads row (its chip, or the second marks row in its place: the chip's
   * words kept in its aria-label), the marks row, the top digit (struck, or with the little 1 in front: lettered, boxed, or
   * struck with it as one), the bottom digit, her answer box, and the tap target over the lender's column above the rule. */
  function takeCellHtml(c, gc) {
    var mm = c.mm, lit = c.lit || c.glow, two = !!mm.m2;
    var hasBox = function (m, row) { return !!(c.mini && c.mini.row === row && m); };
    var s = '<span class="thead' + (two ? ' tgone' : '') + '" role="img" aria-label="' + tEsc(c.headLabel) + '"' + gc + '>' + takeHeadSvg(c.zone) + '</span>';
    if (two) s += '<span class="tmark tm2' + (lit ? ' tglow' : '') + (hasBox(mm.m2, 2) ? ' tbx"' : '" aria-hidden="true"') + gc + '>' + tMarkHtml(mm.m2, c, 2, false) + '</span>';
    var m1box = !!mm.m1 && (mm.m1.box || mm.m1.front === 'box') && !!c.mini;
    s += '<span class="tmark' + (lit ? ' tglow' : '') + (m1box ? (mm.m1.box ? ' tbx"' : '"') : '" aria-hidden="true"') + gc + '>' + tMarkHtml(mm.m1, c, mm.m1 && mm.m1.front === 'box' ? 'front' : 1, c.halo && !two) + '</span>';
    var fl = c.flash && c.flash.row === 'front' && !mm.m1 ? c.flash : null, front = '';
    if (mm.front === 1) front = fl ? '<span class="tfront tfb">' + tFlash(fl) + '</span>' : '<span class="tfront' + (c.halo ? ' thalo' : '') + '">1</span>';
    else if (mm.front === 'box') front = '<span class="tfront tfb">' + (c.mini && c.mini.row === 'front' && !mm.m1 ? tMini(c.mini) : '<span class="tmini" aria-hidden="true">\u00a0</span>') + '</span>';
    var top = front + tEsc(c.top), frontBox = mm.front === 'box' && !!c.mini && !mm.m1;
    s += '<span class="tdig ttop' + (mm.struck && !mm.frontStruck ? ' tstruck' : '') + (lit ? ' tglow' : '') + (c.ripple ? ' tripple' : '') + (c.wig ? ' twig' : '') + '" data-col="' + c.col + '"' +
      (frontBox ? '' : ' aria-hidden="true"') + gc + '>' + (mm.frontStruck ? '<span class="tgrp tstruck tfs">' + top + '</span>' : top) + '</span>';
    s += '<span class="tdig tbot" aria-hidden="true"' + gc + '>' + tEsc(c.bottom) + '</span>' +
      '<span class="tbox' + (c.boxCls ? ' ' + c.boxCls : '') + '" data-col="' + c.col + '" role="img" aria-label="' + tEsc(c.boxLabel) + '"' + (c.current ? ' aria-current="true"' : '') + gc + '>' +
      (c.box !== '' ? tEsc(c.box) : '\u00a0') + '</span>';
    if (c.target) s += '<span class="ttarget' + (c.target.near ? '' : ' tfar') + '" role="button" tabindex="0" aria-label="' + tEsc(c.target.label) + '" data-col="' + c.col + '"' + gc + '></span>';
    return s;
  }
  function tHasPrompt(p) { return asList0(p).some(function (b) { return typeof b === 'string' ? !!b : !!(b && b.text); }); }
  /* The column's line as it is outlined (section 1, E.takeLine), '' where it says nothing: the first column of a
   * problem with a prompt, when the line is short (its prompt's balloon is what she reads). */
  function takeColLine(def, q) {
    if (q.col === 0 && !q.full && tHasPrompt(q.prompt)) return '';
    return PC.engine.takeLine(def, q.plan, q.col, q.stage, q.mode, q.full);
  }
  function tBalloon(b, teacher, fill) {
    var o = { who: b.who || teacher, text: fill(b.text) };
    if (b.kind) o.kind = b.kind;
    if (b.variant) o.variant = b.variant;
    if (b.name) o.name = b.name;
    return o;
  }
  /* What the first column of a problem letters and says (sections 1 and 6). Lettered: `o.intro` (the page's own: a
   * frame's balloons, the Warrior Counts' waiting line), the prompt's balloons with the column's line joined to the
   * last of them when that one is the teacher's (else the line follows in a balloon of its own), a twin's or the
   * warm-up's introduction, the column's line. Heard: the same in order, but the question in words ("Five hundred
   * three take away two hundred seventy-eight.", said only) comes before the column's line, which is split out of
   * the joined balloon for speech. `o.line` stands in for the column's line (the ones-first pointer); `o.fill` fills
   * the cat's tokens. */
  function takeFirst(def, q, o) {
    o = o || {};
    var E0 = PC.engine, fill = o.fill || function (s) { return s; }, teacher = E0.teacherOf(def);
    var tq = E0.takeQuestion(def, q), intro = !!(q.twin || q.of || q.warm), B = tq.balloons;
    var prompts = (intro ? B.slice(0, -1) : B).map(function (b) { return tBalloon(b, teacher, fill); });
    var introB = intro && B.length ? [tBalloon(B[B.length - 1], teacher, fill)] : [];
    var line = o.line != null ? o.line : takeColLine(def, q);
    line = line ? fill(line) : '';
    var pre = asList0(o.intro).map(function (b) { return Object.assign({}, b); });
    var lines = pre.concat(prompts.map(function (b) { return Object.assign({}, b); }));
    var last = prompts.length ? lines[lines.length - 1] : null;
    var joined = !!(line && last && !introB.length && last.who === teacher && (!last.kind || last.kind === 'say'));
    if (joined) last.text = last.text + ' ' + line;
    lines = lines.concat(introB);
    if (line && !joined) lines.push({ who: teacher, text: line });
    var ask = tBalloon(tq.ask, teacher, fill);
    var heard = pre.concat(prompts, introB, [ask], line ? [{ who: teacher, text: line }] : []);
    return { lines: lines, heard: heard, joined: joined, line: line, ask: ask.text };
  }
  function tOnesFirst(def) {
    var E0 = PC.engine, L = def && def.lines && def.lines.onesFirst != null ? def.lines.onesFirst : E0.TAKE_LINES.onesFirst;
    return E0.takeFill(typeof L === 'string' ? L : asList0(L)[0], {});
  }
  /* The stacks she may type under in this problem, from the column she is on to its last (section 6, "The keypad
   * stays put"): the page sets the stack's min-height to the tallest of them on the first column, so the keypad never
   * moves within a problem. The first column's (and its ones-first pointer's, while it can come); every later column's
   * line in its full form (as after a help), under the echo's room on a page with an echo (`o.echo`); a 'show'
   * column's steps and a 'tap' column's lines, each under its column's lettering (the keypad is away then, but its
   * place must not move when it wakes). A balloon `{ room: true }` is the echo's room: Chispapaw's two lines; when
   * `o.echo` is a function (the page's hook, called with the column before), the echo itself is measured too, since
   * an eight-word Spanish line runs to three lines in the lesson column at 1080 x 720. */
  function takeReserve(def, q, o) {
    o = o || {};
    if (q.moves) return takeReserveMoves(def, q, o);
    var E0 = PC.engine, p = q.plan, teacher = E0.teacherOf(def), fill = o.fill || function (s) { return s; }, out = [];
    var B = function (t) { return { who: teacher, text: fill(t) }; };
    var room = o.echo ? [{ who: o.echoWho || 'chispapaw', room: true }] : [];
    for (var c = q.col; c < p.n; c++) {
      var bases;
      if (c === q.col && c === 0) {
        bases = [takeFirst(def, q, o).lines];
        if (!q.onesFirst) out.push(takeFirst(def, q, Object.assign({}, o, { line: tOnesFirst(def) })).lines);
      } else if (c === q.col) {
        var l0 = takeColLine(def, q);
        bases = [asList0(o.intro).concat(l0 ? [B(l0)] : [])];
      } else {
        var L = [B(E0.takeLine(def, p, c, 'before', q.mode, true))], e = typeof o.echo === 'function' ? o.echo(c - 1) : null;
        bases = [room.concat(L)].concat(e ? [[e].concat(L)] : []);
      }
      var extra = [];
      if (p.cols[c].spreads.length && q.mode === 'show') extra = E0.takeShow(def, p, c, { mode: 'show' }).steps.map(function (s) { return s.say; });
      if (p.cols[c].spreads.length && q.mode === 'tap') {
        var sh = E0.takeShow(def, p, c, { mode: 'tap' });
        extra = sh.taps.map(function (t) { return t.say; }).concat(Object.keys(sh.here).map(function (k) { return sh.here[k]; }), [sh.line]);
      }
      bases.forEach(function (base) {
        out.push(base);
        extra.forEach(function (t) { out.push(base.concat([B(t)])); });
      });
    }
    return out;
  }
  /* The kit v0.4's stacks (decision 57; design section 3, "The keypad stays put"): per column from the one she is on, the
   * lines over it with each prompt a 'tap' or 'show' turn says under them (askLend, askGet, tapRow, colShown; 'show''s
   * steps), and the one slot: the longest line a move-help or a pointer can bring at this column's moves (not their sum),
   * in the column line's place (the reserve probe: under it, the keypad went under at 1080 x 720), so `slotBase` is the
   * lines over the column with its line taken out (a prompt's and the page's intro stay; an echo about the column before
   * goes with it: a help is about this one). `o.taught` (the state's) says whether a column with no spread has a
   * target (an `extra` touch). A balloon `{ slot: true }` is drawn as the slot. */
  function takePrompts(def, q, c) {
    var E0 = PC.engine, p = q.plan;
    if (!p.cols[c].spreads.length || q.mode === 'hers') return [];
    var S = E0.takeShow(def, p, c, { mode: q.mode, style: q.style, picture: q.picture });
    if (q.mode === 'show') return S.steps.map(function (x) { return x.say; });
    return S.taps.filter(function (x) { return x.say; }).map(function (x) { return x.say; }).concat([S.line]);
  }
  function takeSlotLines(def, q, c, taught) {
    var E0 = PC.engine, p = q.plan, col = p.cols[c], style = q.style, mode = q.mode, out = [];
    if (mode === 'show') return out;
    var M = q.moves[c];
    var add = function (k, j) { var h = E0.takeMoveHelp(def, p, c, k, j, style, mode); if (h && h.say) out.push(h.say.filter(Boolean).join(' ')); };
    if (!col.spreads.length) {
      if (E0.takeTargets(p, c, 0, taught).length) add(0, { slip: 'extra', line: 'extraTouch', touched: c + 1 });
      return out;
    }
    var form = (col.bottom || 0) - col.before === col.digit ? 'flip' : 'right';
    if (mode === 'tap') {
      var S = E0.takeShow(def, p, c, { mode: 'tap', style: style, picture: q.picture });
      Object.keys(S.here).forEach(function (z) { out.push(S.here[z]); });
    }
    M.forEach(function (m, k) {
      if (m.move === 'touch' && (k === 0 || k === 3)) {
        if (mode === 'hers') {
          (k === 3 ? ['zeroStop', 'factSpread'] : col.chain ? ['zero', 'factSpread'] : ['flip', 'nospread', 'factSpread']).forEach(function (key) { add(k, { slip: key === 'factSpread' ? 'fact' : key === 'zeroStop' ? 'zero' : key, line: key }); });
          add(k, { pointer: 'ahead', form: form, line: 'ahead' });
          add(k, { pointer: 'tap', line: 'tap' });
          if (M[k + 1]) add(k + 1, { pointer: 'askLend', line: 'askLend' });
        }
        if (col.chain && k === 0) add(k, { pointer: 'zeroFirst', line: 'zeroTouch' });
        if (col.chain && k === 3) add(k, { pointer: 'gave', line: 'gave' });
        if (!col.chain && E0.takeTargets(p, c, k, taught).length > 1) add(k, { pointer: 'where', line: 'where' });
      } else if (m.move === 'lend') {
        if (m.zero) add(k, { slip: 'zero', line: 'zeroLend' });
        else { add(k, { slip: 'kept', line: 'keptMove' }); add(k, { slip: 'lend', line: 'lendMove' }); }
      } else if (m.move === 'get') {
        add(k, { slip: 'get', line: 'getMove' });
        if (m.zero) add(k, { pointer: 'nine', line: 'nine' });
      } else if (m.move === 'answer' && k > 0) add(k, { pointer: 'order', line: 'order' });
    });
    return out;
  }
  function takeReserveMoves(def, q, o) {
    var E0 = PC.engine, p = q.plan, teacher = E0.teacherOf(def), fill = o.fill || function (s) { return s; }, out = [];
    var B = function (t) { return { who: teacher, text: fill(t) }; };
    var room = o.echo ? [{ who: o.echoWho || 'chispapaw', room: true }] : [];
    for (var c = q.col; c < p.n; c++) {
      var bases, slotBases;
      if (c === q.col && c === 0) {
        bases = [takeFirst(def, q, o).lines];
        slotBases = [takeFirst(def, q, Object.assign({}, o, { line: '' })).lines];
        if (!q.onesFirst) out.push(takeFirst(def, q, Object.assign({}, o, { line: tOnesFirst(def) })).lines);
      } else if (c === q.col) {
        var l0 = takeColLine(def, q);
        bases = [asList0(o.intro).concat(l0 ? [B(l0)] : [])];
        slotBases = [asList0(o.intro).slice()];
      } else {
        var L = [B(E0.takeLine(def, p, c, 'before', q.mode, true))], e = typeof o.echo === 'function' ? o.echo(c - 1) : null;
        bases = [room.concat(L)].concat(e ? [[e].concat(L)] : []);
        slotBases = [[]];   // (a help is about this column: it takes the echo's place too)
      }
      var prompts = takePrompts(def, q, c), longest = '';
      takeSlotLines(def, q, c, o.taught).forEach(function (t) { if (t.length > longest.length) longest = t; });
      bases.forEach(function (base) {
        out.push(base);
        prompts.forEach(function (t) { out.push(base.concat([B(t)])); });
      });
      if (longest) slotBases.forEach(function (base) { out.push(base.concat([{ who: teacher, text: fill(longest), slot: true }])); });
    }
    return out;
  }
  /* The help's stack at step `i` (section 2): the slip's line, which stays above the steps to the end (glowing for
   * `kept` and `zero` at a column that lent); from the first step on, the counter in a balloon of its own (as the
   * lesson's help puts it: "10 · 5", growing a hop at a time; "…" before the first) when the help counts; and the
   * step's line: three balloons. `join` (a phone held sideways with Aa on, section 6's named fallback): the counter
   * joins the step's line, two balloons. */
  function takeHelpStack(help, i, teacher, join) {
    var steps = help.steps, s = steps[Math.max(0, Math.min(steps.length - 1, i))], out = [{ who: teacher, text: help.intro, glow: !!steps[0].glow }];
    if (i <= 0) return out;
    var counts = steps.some(function (x) { return x.n != null; });
    var nums = steps.slice(1, i + 1).filter(function (x) { return x.n != null; }).map(function (x) { return x.n; });
    var counter = counts ? (nums.length ? nums.join(' · ') : '…') : null;
    if (counter != null && join) return out.concat([{ who: teacher, text: s.say, counter: counter }]);
    if (counter != null) out.push({ who: teacher, counter: counter });
    out.push({ who: teacher, text: s.say });
    return out;
  }
  /* The problem's end (section 1): its one line (`res.line`; a blank praise letters nothing), or its own `right`
   * lines (`res.balloons`, which wait for Next), with an echo of Chispapaw's after a right problem (chapter 12 on). */
  function takeEnd(def, res, o) {
    o = o || {};
    var teacher = PC.engine.teacherOf(def), fill = o.fill || function (s) { return s; };
    var echo = o.echo ? [o.echo] : [];
    if (res.balloons && res.balloons.length) return { lines: res.balloons.map(function (b) { return tBalloon(b, teacher, fill); }).concat(echo), next: true };
    var line = res.line ? fill(res.line) : '';
    return { lines: (line ? [{ who: teacher, text: line }] : []).concat(echo), next: false };
  }
  /* The panel's label (section 6): the store in words, what is left ("Five squares, three loose"). */
  function takeStoreLabel(po, W) {
    W = W || takeWordsNow();
    var E0 = PC.engine, t = (po && po.taken) || {}, parts = [];
    var left = function (k) { return Math.max(0, ((po && po[k]) || 0) - (t[k] || 0)); };
    var h = left('hundreds'), r = left('tens'), l = left('ones');
    if (h) parts.push(E0.numberWords(h) + ' ' + (h === 1 ? W.square : W.squares));
    if (r) parts.push(E0.numberWords(r) + ' ' + (r === 1 ? W.row : W.rows));
    if (l) parts.push(E0.numberWords(l) + ' ' + W.loose);
    var s = parts.join(', ');
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }
  /* The 'tap' page's hidden button for VoiceOver ("Spread a row", "Spread a square"): the zone that spreads. */
  function takeSpreadLabel(zone, W) {
    W = W || takeWordsNow();
    return W.Spread + ' a ' + (zone === 'hundreds' ? W.square : W.row);
  }
  /* plain()'s minus (section 6): U+2212 read as the words table's "take away", read at call time. */
  function takeMinus(s) {
    s = String(s == null ? '' : s);
    return s.indexOf('−') < 0 ? s : s.replace(/\s*−\s*/g, ' ' + takeWordsNow().takeAway + ' ');
  }
  /* The grown-ups corner's take-aways (section 8, openGrownups): `takes` the cat's (null: nothing at all, for a cat who has
   * not met a take-away), `table` E.takeTable's. `line` goes on the Training Hollow's line ("Count the store 3 (2 without
   * help)"); `html` the table by kind (problems, right first time of her own first asks, helped, typical time, her
   * commonest slip) under a note on what its columns count, its heading "(her last 500)" once the log is at its cap
   * (`table.capped`, `table.cap`: the table reads only the log, the line every round), and under it the teen facts her
   * `fact` slips missed ("13 − 8 ×2"), for grown-ups only. A ratio and a fact never break inside (a phone wrapped "36 of"
   * from its "40"). `secs` formats a time. */
  var TAKE_KIND_WORDS = { none: 'No regrouping', ones: 'Regroup a ten', tens: 'Regroup a hundred', both: 'Regroup both',
    zero: 'Across a zero', zeros: 'Across two zeros' };
  var TAKE_SLIP_WORDS = { zero: 'across the zero', flip: 'smaller from bigger', nospread: 'did not regroup', kept: 'kept the ten it gave',
    extra: 'regrouped when not needed', fact: 'a fact slipped' };
  // (what the columns count: E.takeTable's own-ask rule and its typical time, docs/take-aways.md section 4)
  var TAKE_CORNER_NOTE = '<p class="muted">“Right first time” is her own first try at a problem with every column right; worked problems, ones where she was told to regroup, and second goes are left out. “Problems” and “Helped” count them all (“helped”: a column slipped and Tallyheart helped). Typical time is of her right answers to problems she worked herself (not worked examples or ones she was told to regroup).</p>';
  // the kit v0.4 (decision 57): a row with moves names the move slips, and `kept` as a move ("did not take one off")
  var TAKE_SLIP_MOVES = { lend: 'new number for the one that gave', get: 'new number for her column', kept: 'did not take one off' };
  var TAKE_CORNER_MARKS = '<p class="muted">Her marks are the new numbers she writes when she spreads: the one that gave, then her column. “Marks right” is how many of them, in her own first tries, were right first time.</p>';
  var TAKE_STYLE_WORDS = { one: 'Her marks: a little 1 in front (¹3), her choice. She can change it in the Training Hollow (My marks).',
    above: 'Her marks: the new number on top (13 over a crossed-out 3), her choice. She can change it in the Training Hollow (My marks).',
    none: 'Her marks: not chosen yet (on top until she does).' };
  function takeCorner(takes, table, secs, steps) {
    if (!takes || typeof takes !== 'object') return null;
    secs = secs || function (ms) { return ms == null ? '–' : (ms / 1000).toFixed(1) + ' s'; };
    var n = function (v) { return typeof v === 'number' && v >= 0 ? Math.floor(v) : 0; };
    var line = 'Count the store ' + n(takes.rounds) + ' (' + n(takes.cleanRounds) + ' without help)';
    var T0 = table || { rows: [], teen: [] };
    // (the kit v0.4: "Marks right" and "In her head first" only once a row has moves; a chapter-12-only cat's table as it was)
    var mv = T0.rows.some(function (r) { return r.moves != null; }), heads = T0.rows.reduce(function (a, r) { return a + n(r.ahead); }, 0);
    var html = '<h4>Take-aways' + (T0.capped ? ' <span class="muted">(her last ' + T0.cap + ')</span>' : '') + '</h4>' + (T0.rows.length ? TAKE_CORNER_NOTE + (mv ? TAKE_CORNER_MARKS : '') +
      '<div class="scroll"><table><thead><tr><th>Kind</th><th>Problems</th><th>Right first time</th>' + (mv ? '<th>Marks right</th>' : '') + '<th>Helped</th><th>Typical time</th><th>Commonest slip</th></tr></thead><tbody>' +
      T0.rows.map(function (r) {
        var sw = r.slip ? (r.moves != null && TAKE_SLIP_MOVES[r.slip]) || TAKE_SLIP_WORDS[r.slip] || r.slip : '–';
        return '<tr><td>' + tEsc(TAKE_KIND_WORDS[r.kind] || r.kind) + '</td><td>' + r.problems + '</td><td>' + (r.firstAsks ? r.rightFirst + '&nbsp;of&nbsp;' + r.firstAsks : '–') + '</td>' +
          (mv ? '<td>' + (r.moves ? n(r.movesRight) + '&nbsp;of&nbsp;' + n(r.moves) : '–') + '</td>' : '') + '<td>' + r.helped + '</td><td>' +
          tEsc(secs(r.ms)) + '</td><td>' + tEsc(sw) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      (T0.teen.length ? '<p class="muted">Teen facts missed: ' + tEsc(T0.teen.map(function (t) { return t.text.replace(/ /g, '\u00a0'); }).join(', ')) + '</p>' : '') +
      (mv && heads ? '<p class="muted">In her head first: ' + heads + '</p>' : '') : '<p class="muted">No take-aways yet.</p>');
    // her marks, once she has learned to spread a row (`steps`: E.takeSteps) or has chosen them
    var style = takes.style === 'one' || takes.style === 'above' ? takes.style : null;
    if (style || (steps || []).indexOf('ones2') >= 0) html += '<p class="muted">' + tEsc(TAKE_STYLE_WORDS[style || 'none']) + '</p>';
    return { line: line, html: html };
  }
  /* The kit v0.4's two-digit box (a get, and the 'one' front box): a digit is added while it holds fewer than two and starts
   * it again when it holds two (no Delete hunt: 1, 4, 1, 3 gives 13); Delete empties it. */
  function takePress2(typed, k) {
    typed = String(typed == null ? '' : typed);
    if (k === 'del') return '';
    if (!/^[0-9]$/.test(String(k))) return typed;
    return typed.length < 2 ? typed + k : String(k);
  }
  /* A key on the kit v0.4's page (design section 3): `o` { phase, k, typed, kind (the ringed box: 'lend', 'get', 'answer'),
   * lit (a decide while the lender glows after `ahead` or a pointer: a digit goes straight to the engine, which types nothing
   * and points), now, okLock (OK's 400 ms guard: OK only, never a digit) }. { act: 'none' | 'wiggle' (the 'tap' page's
   * glowing zone) | 'type' (typed: the box's new digits) | 'ok' | 'digit' }. A move-help's reading lock is its own phase. */
  function takeKey(o) {
    var k = String(o.k);
    if (o.phase === 'tap') return { act: k === 'del' ? 'none' : 'wiggle' };
    if (o.phase !== 'type') return { act: 'none' };
    if (k === 'ok') return { act: o.now < (o.okLock || 0) ? 'none' : 'ok' };
    if (o.lit) return { act: /^[0-9]$/.test(k) ? 'digit' : 'none' };
    return { act: 'type', typed: o.kind === 'get' ? takePress2(o.typed, k) : takePress(o.typed, k) };
  }
  /* A tap on the kit v0.4's page (design section 1, "What she can tap" and "A tap is a tap"): `o` { where: 'col' | 'panel' |
   * 'stack', slide (px), held (ms), phase, advance (a move-on surface is waiting: a line, a help, 'show'), now, quiet (the
   * column's 400 ms after a phase change or an outline), the column: col (under the tap, above the rule; null), target (a
   * live target's column), onTop (her own top digit), her (her column), kind and boxCol (the ringed box), typed (its
   * digits); the panel: zone, glow (the lender glowing, its zone) }. { act: 'none' | 'advance' | 'touch' (col) | 'wiggle'
   * (her own digit, no line) | 'off' (the 'tap' page's tap off the glow: tapHere once) }. In 'hers' at a decide nothing
   * glows, so the panel is neither a target nor a move-on surface. */
  function takeTapAct(o) {
    if ((o.slide || 0) > 10 || (o.held || 0) > 500) return { act: 'none' };
    var live = o.phase === 'type' || o.phase === 'tap';
    if (o.where === 'stack') return o.advance && o.phase !== 'help' ? { act: 'advance' } : o.phase === 'tap' ? { act: 'off' } : { act: 'none' };
    if (o.where === 'panel') {
      if (o.advance) return { act: 'advance' };
      if (!live || !o.glow || o.now < (o.quiet || 0)) return { act: 'none' };
      if (o.zone === o.glow) return { act: 'touch', col: TAKE_ZONES.indexOf(o.glow) };
      return o.phase === 'tap' ? { act: 'off' } : { act: 'none' };
    }
    if (o.advance && o.phase !== 'help') return { act: 'advance' };
    if (!live || o.now < (o.quiet || 0)) return { act: 'none' };
    if (o.target != null) return { act: 'touch', col: o.target };
    if (o.col == null) return { act: 'none' };
    if (o.col === o.her) return o.onTop ? { act: 'wiggle', col: o.col } : { act: 'none' };
    if (o.kind === 'lend' && o.col === o.boxCol) return o.typed ? { act: 'none' } : { act: 'touch', col: o.col };
    return { act: 'touch', col: o.col };
  }
  /* The marks page's pictures (design section 2, "Where she picks"): two big buttons, each a small column of 43 − 16 done
   * (the kit's .tcol markup, its answer 2 7 in plain ink, no ring) in one style, a soft gold halo on the receiver's mark, its
   * label under it; `o` { options (E.takeMarksPage's), live (the buttons answer a tap), pressed (her style: a ring, a check,
   * aria-pressed), glow ('one', 'above', 'both': the pictures lifting with the line shown) }. Sized by font-size only. */
  var TAKE_PICK_CHECK = '<svg class="tcheck" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11" fill="#ffd23f" stroke="#1b1622" stroke-width="2"/><path d="M6.5 12.5l3.6 3.6 7.4-7.6" fill="none" stroke="#1b1622" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function takeMarksPic(style) {
    var E0 = PC.engine, p = E0.takePlan(43, 16), mk = E0.takeMoveMarks(p, style, p.n, 0);
    var v = takeView(p, { moves: true, marks: mk, boxes: [{ v: '7', cls: 'plain' }, { v: '2', cls: 'plain' }], on: -1, halo: 0 });
    return '<span class="tcol" style="--tn:2" aria-hidden="true">' + takeHtml(v) + '</span>';
  }
  function takeMarksHtml(o) {
    var glow = o.glow || null;
    return '<div class="tpick' + (o.live ? ' tlive' : '') + '" role="group">' + (o.options || []).map(function (op) {
      var on = o.pressed === op.style, lit = glow === 'both' || glow === op.style;
      return '<button class="tpb' + (lit ? ' tglowing' : '') + '" type="button" data-style="' + op.style + '" aria-pressed="' + (on ? 'true' : 'false') + '"' + (o.live ? '' : ' aria-disabled="true"') + '>' +
        takeMarksPic(op.style) + '<span class="tlbl">' + tEsc(op.label) + '</span>' + TAKE_PICK_CHECK + '</button>';
    }).join('') + '</div>';
  }
  // which picture lifts with line `k` (design section 2's table): the last line both; before it, by speaker: the one whose
  // answer line the style's is (Chispapaw's little 1, Tallyheart's on top), both when one cat says both
  function takeMarksGlow(page, k) {
    var L = page.lines || [];
    if (k >= L.length - 1) return 'both';
    var who = L[k] && L[k].who, a = page.after || {}, w1 = a.one && a.one[0] && a.one[0].who, w2 = a.above && a.above[0] && a.above[0].who;
    if (who && who === w1 && who !== w2) return 'one';
    if (who && who === w2 && who !== w1) return 'above';
    return 'both';
  }
  /* The marks page's run (design section 2, "How it runs"), pure, so Node runs it: one balloon at a time, its picture
   * lifting; the buttons live only once the last line is shown (its reading time, or said); a pick saves and presses, and
   * its answer line is lettered; through it the other button switches; the page goes on after the answer line's reading
   * time or a tap on the stack or the panel, never a tap on a button. The answer line takes the last line's place (the
 * question it answers), so the page never holds more than its lines. `o` { page (E.takeMarksPage's, its balloons filled),
   * live (the shelf's: every line shown and both live at once), stay (the shelf's: a pick never goes on) }; `h` { show(list,
   * glow), live(), press(style), save(style), wait(items, fn) (the line's reading time; a new wait withdraws the last),
   * hush(), labels() (Read to me's labels, each as its button glows), goOn() }. */
  function takeMarksFlow(o, h) {
    var page = o.page, L = page.lines || [], at = -1, isLive = false, picked = null, shown = [], gone = false;
    var goOn = function () { if (gone) return; gone = true; h.goOn(); };
    var goLive = function () { if (isLive) return; isLive = true; h.live(); if (h.labels) h.labels(); };
    var step = function (k) {
      at = k; shown = L.slice(0, k + 1);
      h.show(shown, takeMarksGlow(page, k));
      h.wait([L[k]], k >= L.length - 1 ? goLive : function () { step(k + 1); });
    };
    return {
      start: function () {
        if (o.live || !L.length) { at = L.length - 1; shown = L.slice(); h.show(shown, 'both'); goLive(); return; }
        step(0);
      },
      tap: function () {
        if (gone) return;
        if (picked) { if (!o.stay) { h.hush(); goOn(); } return; }
        if (isLive) return;
        h.hush();
        if (at >= L.length - 1) goLive(); else step(at + 1);
      },
      pick: function (style) {
        if (!isLive || gone || (style !== 'one' && style !== 'above')) return false;
        picked = style;
        h.save(style); h.press(style);
        // (the answer line takes the question's place: four balloons at most, so the pictures stay on the screen)
        var a = (page.after && page.after[style]) || [];
        h.show(shown.slice(0, Math.max(0, shown.length - 1)).concat(a), style);
        if (!o.stay) h.wait(a, goOn);
        return true;
      },
      state: function () { return { at: at, live: isLive, picked: picked, gone: gone }; }
    };
  }
  /* The store at a move picked up (design section 3, "Back, Camp, a reload"): drawn at rest, a lend made and its get not yet
   * the lender's piece resting unopened ('hers': after her lend; 'tap' and 'show': after the touch); E.takePicture's stage. */
  function takeStageAt(q) {
    var M = q.moves && q.moves[q.col], k = q.move || 0, n = 0, half = false, lead = q.mode === 'hers' ? 'lend' : 'touch';
    (M || []).forEach(function (m, j) { if (m.move === lead && j < k) { n = m.link + 1; half = !(j + 1 < k); } });
    var st = { col: q.col, spreads: n };
    if (half && n) st.half = true;
    return st;
  }
  UI.takes = { press: takePress, waits: takeWaits, view: takeView, html: takeHtml, colLine: takeColLine, first: takeFirst,
    reserve: takeReserve, helpStack: takeHelpStack, end: takeEnd, storeLabel: takeStoreLabel, spreadLabel: takeSpreadLabel,
    minus: takeMinus, words: takeWordsNow, corner: takeCorner, MS: TAKE_MS, ZONES: TAKE_ZONES,
    press2: takePress2, key: takeKey, tapAct: takeTapAct, prompts: takePrompts, slotLines: takeSlotLines, marksHtml: takeMarksHtml,
    marksGlow: takeMarksGlow, marksFlow: takeMarksFlow, stageAt: takeStageAt };

  /* ---------------------------------------------------------------- chapter 12: Spanish, the voice (pure: tested in Node)
   * docs/chapters/12-a-spark-at-the-hedge.spec.md, section 6. The Spanish voice is picked by locale and by name, never a
   * novelty voice (iPads carry eight in every Spanish locale): es-US, es-MX, every other Latin American es-*, plain es,
   * es-ES last; in each a she-voice by name first (names NFC-normalised), then any other of that locale; null when there is
   * none. The English rule is pickVoice's, as before. UI.voices.plan is what Read to me says, row by row, and speakItems
   * only turns its rows into utterances: an item with Spanish in it (the engine's « marks, or `lang: 'es'`) is said in
   * parts (E.speechParts), a Spanish part in the Spanish voice (the speaker's pitch, 0.9 of the speaker's rate), with none a
   * whole line not said (its gloss follows) and a word said as its English (a name its respelling, a number its words) in
   * the English voice; never Spanish in an English voice, and no part with no letter or digit (iOS may never end an
   * utterance of punctuation alone). Every other item exactly as before, respelled by E.sayAs ("Cheespa-paw"). */
  var EN_VOICES = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Google US English'];
  var ES_NOVELTY = ['Eddy', 'Flo', 'Grandma', 'Grandpa', 'Reed', 'Rocko', 'Sandy', 'Shelley'];
  var ES_SHE = ['Google español de Estados Unidos', 'Paulina', 'Mónica', 'Angélica', 'Isabela', 'Francisca', 'Soledad', 'Marisol'];
  function vNfc(s) { s = String(s == null ? '' : s); return typeof s.normalize === 'function' ? s.normalize('NFC') : s; }
  function vLang(v) { return String((v && v.lang) || '').replace('_', '-').toLowerCase(); }
  // a novelty voice: its name's first word (before any " (") is exactly one of them; "Reedy" or "Florencia" is kept
  function vNovelty(v) { return ES_NOVELTY.indexOf(vNfc(v && v.name).split(' (')[0].trim().split(/\s+/)[0]) >= 0; }
  function vTier(l) { return l === 'es-us' ? 0 : l === 'es-mx' ? 1 : l === 'es-es' ? 4 : l === 'es' ? 3 : 2; }
  function voicePick(list, lang) {
    list = Array.isArray(list) ? list : list ? Array.prototype.slice.call(list) : [];
    if (lang !== 'es') {
      var en = list.filter(function (v) { return v && /^en(-|_|$)/i.test(v.lang); }), got = null;
      for (var i = 0; i < EN_VOICES.length && !got; i++) got = en.filter(function (v) { return String(v.name).indexOf(EN_VOICES[i]) === 0; })[0] || null;
      return got || en.filter(function (v) { return /en-US/i.test(v.lang); })[0] || en[0] || null;
    }
    var es = list.filter(function (v) { var l = vLang(v); return !!v && (l === 'es' || l.indexOf('es-') === 0) && !vNovelty(v); });
    for (var t = 0; t <= 4; t++) {
      var here = es.filter(function (v) { return vTier(vLang(v)) === t; });
      if (!here.length) continue;
      for (var k = 0; k < ES_SHE.length; k++) {
        var she = here.filter(function (v) { return vNfc(v.name).indexOf(vNfc(ES_SHE[k])) === 0; })[0];
        if (she) return she;
      }
      return here[0];
    }
    return null;
  }
  // an item said in parts: Spanish in it, as the engine's marks or a whole line's `lang`
  function saysSpanish(it) { return !!it && (String(it.text || '').indexOf('«') >= 0 || it.lang === 'es'); }
  // `voices`: a voice list (each language picked from it) or { en, es } as picked; `opts.cat`: for E.sayAs
  function voicePlan(items, voices, opts) {
    var E0 = PC.engine, cat0 = (opts && opts.cat) || null;
    var vs = Array.isArray(voices) ? { en: voicePick(voices, 'en'), es: voicePick(voices, 'es') } : voices || {};
    var en = vs.en || null, es = vs.es || null, rows = [];
    var clean = function (t) { return plain(String(t == null ? '' : t).replace(/<[^>]+>/g, ' ')).trim(); };
    var some = function (t) { return /[\p{L}\p{N}]/u.test(t); };
    var row = function (text, lang, it) {
      var v = lang === 'es' ? es : en, r = rateOf(it.who);
      rows.push({ text: text, lang: lang, voice: v ? v.name : null, rate: lang === 'es' ? Math.round(r * 900) / 1000 : r, pitch: pitchOf(it.who, it.variant) });
    };
    (items || []).forEach(function (it) {
      if (!it) return;
      if (!saysSpanish(it)) { var txt = E0.sayAs(clean(it.text || ''), cat0); if (txt) row(txt, 'en', it); return; }
      // (a line's English parts in a row, the Spanish fallen back to its English with no Spanish voice, are one utterance:
      // three in the same voice paused between them, the third starting at a full stop, the review's round)
      var from = rows.length;
      E0.speechParts(String(it.text || '').replace(/<[^>]+>/g, ' '), it.lang, cat0).forEach(function (p) {
        var t = clean(p.lang === 'es' && !es ? (p.line ? '' : p.en) : p.text);
        if (!some(t)) return;
        var lang = p.lang === 'es' && es ? 'es' : 'en', last = rows.length > from ? rows[rows.length - 1] : null;
        if (last && lang === 'en' && last.lang === 'en') last.text = (last.text + ' ' + t).replace(/ ([.,!?;:…])/g, '$1');
        else row(t, lang, it);
      });
    });
    return rows;
  }
  UI.voices = { pick: voicePick, plan: voicePlan, saysSpanish: saysSpanish, NOVELTY: ES_NOVELTY, SHE: ES_SHE };
  // (the lettering, for the tests in Node: rich() and plain() are declared further down, in the browser part, and hoisted)
  UI.letter = { rich: rich, plain: plain };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
  var doc = root.document;
  if (!doc || typeof doc.createElement !== 'function') return;

  /* ================================================================ browser from here on */
  var E, story, store, save, cat;
  var view = { name: 'title', opts: {} };
  var timers = [];
  var relayoutFn = null;
  var keyHandler = null;
  var renderedAt = 0;
  var lastLayout = null;
  var reduceMotion = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // chapter 4: a lesson's keypad screen is up (the Case File's button is left off it, as Back is);
  // the Case File open over the page; and, on the `file` frame, what the top bar's button does
  var inLesson = false;
  // the Warrior Counts: a pause on screen, when Read to me is switched on during it (it says its line
  // and waits for the end of it; false once its page is gone)
  var pauseRead = null;
  var fileState = null;
  var fileTeach = null;
  var frameTap = null;

  function $(id) { return doc.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* Lettering: **bold**, *italic*, line breaks, and a dash kept with the word it follows (a word joiner, U+2060, between
   * them: ch05 f051a's "…Thirty. FORTY—" put the dash on a line alone at every iPad size, the polish release v23).
   * Chapter 12: Spanish between the engine's marks, «…», in italics with lang="es" (the marks dropped), and the gloss in
   * parentheses on the line straight after it upright, on a line of its own, a hyphened number in it kept whole (a word
   * joiner after the hyphen: “(One hundred thirty-” / “three!)” at 1080 x 720, the review's round); no line of chapters 1
   * to 11 has a «. */
  function rich(s) {
    return esc(s).replace(/«([^«»]*)»\n(\([^\n]*\))/g, function (m, es, gl) { return '<i class="es" lang="es">' + es + '</i><br><span class="gloss">' + gl.replace(/([A-Za-z])-([A-Za-z])/g, '$1-\u2060$2') + '</span>'; })
      .replace(/«([^«»]*)»/g, '<i class="es" lang="es">$1</i>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>')
      .replace(/([A-Za-z0-9À-ɏ])—/g, '$1⁠—');
  }
  // (the take-aways kit: a minus sign, U+2212, is read as the words table's "take away", read at call time, so a changed
  // word reaches the reading too; no line of chapters 1 to 11 or the Warrior Counts has one: UI.takes.minus)
  // (chapter 12: the engine's marks for Spanish, « and », are never read)
  function plain(s) { return takeMinus(String(s == null ? '' : s).replace(/\*+/g, '').replace(/×/g, ' times ').replace(/[«»]/g, '')); }
  /* Her name as lettered on the page (chapter 11): a warrior name may break between its two halves, Thunderwhisker and
   * butterscotch, where a 26-letter word would otherwise break anywhere; every other name exactly as before. */
  function nameHtml(c) { return E.warriorName(c) ? esc(c.name) + '<wbr>' + esc(c.ending) : esc(E.displayName(c)); }
  /* Lettering with her name in it (chapter 11): where her first part runs straight on into a word the story joins to it
   * (her ending, Thunderwhisker|butterscotch; one of Glintstar's three names for her, {name}moon; a shouted word, the old
   * tom's {name}PINECONE), a line may break at the join, as nameHtml's may: a 26-letter word with no break ran out of its
   * balloon, past the column and off a phone's screen (the endcap), or broke at any letter. Nothing else changes: not
   * `{name}paw`, not a word that only starts with her name (Fern, Ferns), so chapters 1 to 10 letter exactly as before;
   * Read to me keeps the plain text. The joined word, with its trailing punctuation, is one .wn box (inline-block, at
   * most the line's width): a name that fits moves to the next line whole, and only one longer than the line breaks at
   * the join (the fix round's check: a bare break split Moon|silver at a line's end where it fit before). A one-letter
   * first part takes no join with a shouted word (the final review: a cat named A boxed A|LIVE!, A|GAIN? on 44 to 55
   * live frames, and ch05 f006's balloon re-wrapped upright); her ending and her offers still join. */
  function richN(s) {
    var h = rich(s), n = cat && typeof cat.name === 'string' && cat.name ? esc(cat.name) : '';
    if (!n) return h;
    var joins = E.warriorOffers(cat).concat(typeof cat.ending === 'string' && cat.ending ? [cat.ending] : []);
    var out = '', i = 0, j, k, w, t;
    while ((j = h.indexOf(n, i)) >= 0) {
      k = j + n.length;
      w = (/^[A-Za-z\u00C0-\u024F]+/.exec(h.slice(k)) || [''])[0];
      if (w && !/[A-Za-z\u00C0-\u024F]/.test(h.charAt(j - 1)) && ((n !== n.toUpperCase() && /^[A-Z]{2,}$/.test(w)) || joins.indexOf(w) >= 0)) {
        t = (/^[^\s<&]*/.exec(h.slice(k + w.length)) || [''])[0];
        out += h.slice(i, j) + '<span class="wn">' + h.slice(j, k) + '<wbr>' + w + t + '</span>';
        i = k + w.length + t.length;
      } else { out += h.slice(i, k); i = k; }
    }
    return out + h.slice(i);
  }
  function fill(s) { return E.fill(s, cat); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function asList(x) { return x == null ? [] : (Array.isArray(x) ? x : [x]); }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }
  function now() { return Date.now(); }
  // when the screen was drawn on the input's own clock (an event's timeStamp is performance.now()'s), so
  // a guard can tell a tap made before it from one merely handed over late (the Warrior Counts' pages)
  var renderedPerf = 0;
  function perfNow() { try { return root.performance && performance.now ? performance.now() : 0; } catch (e) { return 0; } }
  function tappedEarly(e, ms) { var t = e && typeof e.timeStamp === 'number' ? e.timeStamp : 0; return t > 0 && renderedPerf > 0 && t - renderedPerf < ms; }
  function persist() { if (cat) cat.updated = now(); if (store) store.save(save); }
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function numWord(n) { return NUMW[n] || String(n); }
  function cap1(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------------------------------------------------------------- art adapters */
  function artRender(scene, look) {
    try {
      if (scene && PC.art && typeof PC.art.render === 'function') {
        var r = PC.art.render(scene, { look: look || E.defaultLook(0) });
        if (r && typeof r.svg === 'string') return { svg: r.svg, heads: r.heads || {}, keep: Array.isArray(r.keep) ? r.keep : [] };
        if (typeof r === 'string') return { svg: r, heads: {} };
      }
    } catch (e) { if (root.console) console.warn('PC.art.render failed', scene, e); }
    return { svg: fallbackScene(scene), heads: {} };
  }
  function fallbackScene(scene) {
    var night = scene && /den|sky|river/.test(scene.set || '');
    var a = night ? '#0e1430' : '#f3a55c', b = night ? '#2a2358' : '#4a3170';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="fb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="' + b + '"/><stop offset="1" stop-color="' + a + '"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#fb)"/><g fill="#1b1622" opacity=".55"><rect x="120" y="300" width="160" height="700"/><rect x="330" y="200" width="130" height="800"/><rect x="1200" y="260" width="170" height="740"/><rect x="1400" y="380" width="120" height="620"/></g></svg>';
  }
  function artCall(name, arg) {
    try { if (PC.art && typeof PC.art[name] === 'function') { var r = PC.art[name](arg); if (r && typeof r === 'object' && r.svg) r = r.svg; if (typeof r === 'string') return r; } }
    catch (e) { if (root.console) console.warn('PC.art.' + name + ' failed', e); }
    return null;
  }
  /* A Case File card (PC.art.card): a curl of bark flattened to a paw's size, its picture scratched
   * in, its mark in a corner. `o.blank`: a blank curl; `o.mark === false`: no mark yet; `o.big`: the
   * card shown large. A plain curl stands in when the art has none. */
  function cardSvg(c, o) {
    o = o || {};
    var arg = o.blank || !c ? { blank: true } : { picture: c.picture, mark: o.mark === false ? null : c.mark, big: !!o.big, look: cat && cat.look };
    return artCall('card', arg) || cardFallback(arg);
  }
  function cardFallback(a) {
    var mark = a.mark === 'ear' ? '<path d="M150 204 L163 178 L176 204 Z M163 192 L163 204" fill="none" stroke="#3b2c1c" stroke-width="3" stroke-linejoin="round"/>'
      : a.mark === 'eye' ? '<path d="M146 194 Q163 178 180 194 Q163 210 146 194 Z" fill="none" stroke="#3b2c1c" stroke-width="3"/><path d="M163 186 V202" stroke="#3b2c1c" stroke-width="3" stroke-linecap="round"/>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><path d="M22 20 Q100 6 178 22 Q190 120 180 222 Q100 234 20 220 Q8 120 22 20 Z" fill="#e9dcc0" stroke="#8a7350" stroke-width="4" stroke-linejoin="round"/>' +
      (a.blank ? '' : '<path d="M52 96 q24 -22 48 0 t48 0 M52 132 q24 -22 48 0 t48 0" fill="none" stroke="#3b2c1c" stroke-width="3.5" stroke-linecap="round"/>') + mark + '</svg>';
  }
  /* The curl of bark that stands for her Case File (the top bar, the hub): PC.art.fileIcon, or ours. */
  function fileIcon() {
    return artCall('fileIcon') || ICON.file;
  }
  /* A cat's portrait. PC.art.cat({look, pose, mood}) returns { svg: '<g>…', w, h, head } (a
   * group in a 0..w × 0..h box); a full <svg> string is accepted too. `bust` crops to the head. */
  function wrapChar(r, bust) {
    if (!r) return null;
    if (typeof r === 'string') return /^\s*<svg/i.test(r) ? r : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' + r + '</svg>';
    if (typeof r.svg !== 'string') return null;
    if (/^\s*<svg/i.test(r.svg)) return r.svg;
    var w = r.w || 200, h = r.h || 200, vb = [0, 0, w, h];
    if (bust && r.head) { var s = Math.min(w, h) * 0.62; vb = [r.head.x - s / 2, r.head.y - s * 0.52, s, s]; }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb.map(f1).join(' ') + '" preserveAspectRatio="xMidYMid meet">' + r.svg + '</svg>';
  }
  function catPortrait(look, mood, bust) {
    try {
      if (PC.art && typeof PC.art.cat === 'function') {
        var out = wrapChar(PC.art.cat({ look: look || {}, pose: 'sit', mood: mood || 'happy', facing: 'right' }), bust);
        if (out) return out;
      }
    } catch (e) { if (root.console) console.warn('PC.art.cat failed', e); }
    return faceSvg(look);
  }
  var faceCache = {};
  function speakerFace(who, variant) {
    if (!who) return '';
    var key = who === 'player' ? 'player:' + JSON.stringify(cat && cat.look) : who + ':' + (variant || 1);
    if (faceCache[key] != null) return faceCache[key];
    var out = '';
    try {
      if (who === 'player') out = catPortrait(cat && cat.look, 'happy', true);
      else if (PC.art && typeof PC.art.character === 'function' && (!PC.art.vocab || !PC.art.vocab.cast || PC.art.vocab.cast.indexOf(who) >= 0)) {
        out = wrapChar(PC.art.character(who, { pose: 'sit', mood: 'kind', facing: 'right', variant: variant || 1 }), true) || '';
      }
    } catch (e) { out = ''; }
    faceCache[key] = out;
    return out;
  }
  function lookDef(key, id) {
    var list = lookOptions()[key] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0] || { id: id, swatch: ['#999'] };
  }
  function faceSvg(look) {
    look = look || {};
    var fur = lookDef('fur', look.fur), eye = lookDef('eyes', look.eyes);
    var c0 = (fur.swatch || ['#a77a4f'])[0], c1 = (fur.swatch || [])[1] || c0;
    var e0 = (eye.swatch || ['#5fbf5a'])[0], e1 = (eye.swatch || [])[1] || e0;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 104"><g stroke="#1b1622" stroke-width="3.5" stroke-linejoin="round">' +
      '<path d="M22 50 L18 10 L48 30 Z M98 50 L102 10 L72 30 Z" fill="' + c0 + '"/>' +
      '<ellipse cx="60" cy="58" rx="42" ry="38" fill="' + c0 + '"/>' +
      (fur.stripes ? '<path d="M50 22 q10 8 20 0 M44 30 q16 10 32 0" stroke="' + c1 + '" stroke-width="5" fill="none"/>' : '') +
      (fur.patches ? '<path d="M28 44 q10 -16 24 -8 q-4 14 -24 8z" fill="' + c1 + '" stroke="none"/>' : '') +
      '<ellipse cx="44" cy="56" rx="8" ry="9" fill="' + e0 + '"/><ellipse cx="76" cy="56" rx="8" ry="9" fill="' + e1 + '"/>' +
      '<path d="M44 50v12M76 50v12" stroke-width="3"/>' +
      '<path d="M55 70 h10 l-5 6z" fill="#f29aa5" stroke-width="2.5"/><path d="M60 76 q-5 7 -12 4 M60 76 q5 7 12 4" fill="none" stroke-width="2.5"/>' +
      '</g></svg>';
  }

  /* The reflection chooser's options. The art may publish its own list (PC.art.looks); else the
   * engine's. Either way the ids are what goes into the cat's look. */
  var lookCache = null;
  function lookOptions() {
    if (lookCache) return lookCache;
    var base = E.LOOKS, src = PC.art && (PC.art.looks || PC.art.LOOKS || (PC.art.vocab && PC.art.vocab.looks));
    var out = {};
    E.LOOK_KEYS.forEach(function (k) {
      var list = src && src[k];
      if (Array.isArray(list) && list.length) {
        out[k] = list.map(function (it) {
          var id = typeof it === 'string' ? it : it.id;
          var mine = (base[k] || []).filter(function (b) { return b.id === id; })[0] || {};
          var o = typeof it === 'object' ? it : {};
          var sw = o.swatch || o.colors || (o.color ? [o.color] : null) || mine.swatch;
          if (typeof sw === 'string') sw = [sw];
          return {
            id: id, label: o.label || o.name || mine.label || cap1(String(id).replace(/-/g, ' ')),
            swatch: sw || ['#999'], stripes: o.stripes != null ? o.stripes : (o.tabby != null ? o.tabby : mine.stripes),
            patches: o.patches != null ? o.patches : mine.patches
          };
        });
      } else out[k] = base[k];
    });
    lookCache = out;
    return out;
  }

  /* ---------------------------------------------------------------- speakers */
  function speakerName(s) { return speakerLabel(s, { cat: cat, story: view.name === 'warrior' ? warriorLabels(story, cat) : story, fill: fill }); }
  /* A frame's balloons as she sees them (E.balloons: `when` applied). The nth balloon from a who
   * belongs to the nth of them in the cast (hidden balloons still count), for its coat and voice.
   * `digits` (the Warrior Counts: "7 × 8") are lettered small in Andika beside the balloon. Chapter 12: a balloon with
   * `lang: 'es'` is a whole Spanish line, lettered by E.esLine (the Spanish between its marks, its English under it). */
  function balloonsOf(frame) {
    var cast = (frame.scene && frame.scene.cast) || [];
    return E.balloons(frame, cat).map(function (s) {
      var mine = cast.filter(function (c) { return c && c.who === s.who; });
      var member = mine[s.nth] || mine[0];
      var b = { who: s.who || '', text: s.lang === 'es' ? E.esLine(s.text || '', cat) : fill(s.text || ''), kind: s.kind || 'say', name: s.name, nth: s.nth, variant: member && member.variant, raw: s };
      if (typeof s.digits === 'string' && s.digits) b.digits = s.digits;
      if (faceHidden(s, member)) b.noFace = true;
      return b;
    }).filter(function (b) { return b.text; });
  }
  function captionsOf(frame) { return E.captions(frame, cat).map(fill).filter(Boolean); }

  // the head of the speaker in that slot (speakerSlot: fewer cast members than balloons from this
  // speaker means the first one)
  function headFor(list, who, nth) {
    var k = 0, slot = speakerSlot(list, who, nth);
    for (var i = 0; i < list.length; i++) if (list[i].who === who) { if (k === slot) return list[i].h; k++; }
    return null;
  }

  /* ================================================================ boot */
  /* The chapters (PC.story) and the one being read. `story` always follows the current cat. */
  function stories() { return PC.story || {}; }
  function syncStory() {
    var s = cat && E.chapter(cat.chapter, stories());
    story = s || E.firstChapter(stories());
    return story;
  }
  function boot() {
    E = PC.engine;
    story = E && E.firstChapter(stories());
    if (PC.art && typeof PC.art.css === 'string' && !$('pc-art-css')) {
      var st = doc.createElement('style'); st.id = 'pc-art-css'; st.textContent = PC.art.css; doc.head.appendChild(st);
    }
    store = E ? E.createStore() : null;
    save = store ? store.load() : null;
    if (!E || !story) { $('screen').innerHTML = '<div class="err"><p class="h2">The story didn’t load.</p><p>Check the connection and reload the page.</p><p><button class="btn go" onclick="location.reload()">Reload</button></p></div>'; return; }
    cat = E.currentCat(save);
    syncStory();
    applySettings();
    bindChrome();
    // Safari's toolbar collapsing, the on-screen keyboard and rotation all fire resize; only a panel
    // that changed size needs its lettering laid out again (which would also replay the sound effect)
    root.addEventListener('resize', debounce(function () {
      fitBarName();
      if (!relayoutFn) return;
      var p = $('panel');
      if (p && lastLayout && p.clientWidth === lastLayout.W && p.clientHeight === lastLayout.H) return;
      relayoutFn();
    }, 120));
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitBarName(); if (relayoutFn) relayoutFn(); });
    if (doc.fonts && doc.fonts.addEventListener) doc.fonts.addEventListener('loadingdone', function () { fitBarName(); if (relayoutFn) relayoutFn(); });
    doc.addEventListener('keydown', function (e) {
      // her Case File is open over the page: its own keys only (Escape: back to her cards, then closed)
      if (fileState) { fileKey(e); return; }
      if (!keyHandler) return;
      // a held-down Enter, or a page key on a screen just drawn, is not a new press (UI.keys)
      if (!keyFresh(e, renderedAt, now())) { if (PAGE_KEYS[e.key] && !isTyping(e)) e.preventDefault(); return; }
      keyHandler(e);
    });
    if ('speechSynthesis' in root) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () { voice = null; voiceEs = null; }; } catch (e) {} }
    // the Warrior Counts: a hub left open (an iPad asleep overnight) reads E.warriorState again when it
    // is seen, so it never offers "Keep going" for a sitting gone stale (only with the Counts open)
    doc.addEventListener('visibilitychange', function () {
      // the sitting's own screen, left open past its two hours (a question, the halfway page, an opening
      // page): to the hub, whose next tap sets it aside and starts afresh (never a stale "Keep going")
      if (doc.visibilityState === 'visible' && view.name === 'warrior' && view.opts.step !== 'result' && cat && wv && wv.state && warriorStale()) { wv = null; return go('hub'); }
      if (doc.visibilityState !== 'visible' || view.name !== 'hub' || !cat || hubWarriorSig == null || fileState) return;
      var was = hubWarriorSig;
      hubWarrior(E.progress(cat, stories()));
      if (hubWarriorSig !== was) go('hub', { keepScroll: true });
    });
    PC.debug = {
      /* Open a frame of any chapter (the cat's own when no chapter is named), with a test cat if
       * there is none. tools/shots.mjs uses it. */
      goto: function (id, chapterId) {
        var target = chapterId ? E.chapter(chapterId, stories()) : (cat && E.chapter(cat.chapter, stories())) || E.firstChapter(stories());
        if (!target) return 'no chapter ' + chapterId;
        if (!target.frames[id]) return 'no frame ' + id + ' in ' + target.id;
        if (!cat) { cat = E.addCat(save, { now: now() }) || save.cats[0]; save.current = cat.id; }
        if (cat.chapter !== target.id || cat.frame == null) E.openChapter(cat, target, now());
        story = target;
        if (E.frameId(cat, story) !== id) E.go(cat, story, id, now());
        persist(); go('frame'); return id;
      },
      state: function () { return E.util.clone(save); },
      cat: function () { return cat; },
      save: function () { persist(); return true; },
      story: function () { return story; },
      reset: function () { if (store) store.clear(); save = E.newSave(); cat = null; syncStory(); go('title'); return 'reset'; },
      check: function () {
        var out = {};
        E.chapters(stories()).forEach(function (s) { out[s.id] = E.checkStory(s, stories()); });
        return out;
      },
      layout: function () { return lastLayout; },
      /* What Read to me would say on this screen, line by line, as it would be handed to the
       * synthesizer. Nothing is said, and the setting is not read: tools/shots.mjs prints it
       * (DRY=1) on a Mac that makes no sound. */
      speech: function () { return (currentSpeech || []).map(function (it) { return saysSpanish(it) ? speechRows(it) : [E.sayAs(plain(String((it && it.text) || '').replace(/<[^>]+>/g, ' ')).trim(), cat)]; }).reduce(function (a, b) { return a.concat(b); }, []).filter(Boolean); },
      /* Chapter 12: UI.voices.plan's rows for this screen, with a made-up voice list (tools/shots.mjs's DRY=1 with
       * VOICES=es and VOICES=none): each part, its voice, its lang. Nothing is said. */
      plan: function (list) { return voicePlan(currentSpeech || [], Array.isArray(list) ? list : [], { cat: cat }); },
      go: go,
      /* Chapter 4, for tools/shots.mjs: her Case File open over the page (a card's id: that card
       * shown large), closed again, and one tap on the page's tap picture (a skip-count, the row of
       * bark, the glint). */
      file: function (cardId) { if (!cat) return 'no cat'; openFile({ card: cardId || null, quiet: true }); return fileState ? true : 'not open'; },
      closeFile: function () { closeFile(true); return true; },
      tap: function () { if (typeof frameTap !== 'function') return 'nothing to tap here'; frameTap(); return true; },
      /* The Warrior Counts, for tools/shots.mjs (its test cat has finished chapter 10, and a `warrior` set
       * up through the engine): 'open', the screen as the hub opens it (`i`: a later page of the
       * opening); 'q', a question (the opening passed over); 'sand', a question answered wrong, its help
       * counted out at once; 'halfway', a sitting picked up at its halfway page; 'result', her result's
       * page `i` (the last: -1). */
      warrior: function (what, i) { return warriorDebug(what, i); },
      /* Chapter 10, for tools/shots.mjs: the pick screen open on the pick frame she is on, and these card
       * ids tapped in turn through the pick's own handler, past its tap guards (#pick3: three wrong picks,
       * then the glow). */
      pick: function (ids) {
        if (!cat || !pickState) return 'not on a pick frame';
        if (!fileState && !openPick(true)) return 'not on a pick frame';
        if (!fileState.pick) return 'her Case File is open, not the pick screen';
        (ids || []).forEach(function (id) { pickTapCard(id, true); });
        return true;
      },
      /* Chapter 12, for the tools (tools/shots.mjs's es: targets, dev/webkit/run.mjs's `spanish` job): Chispapaw's Spanish
       * on the pages that carry it, on the cat on screen, never saved (spanishDebug: echo, take, skip, worked, worked:tens,
       * try, try:pointer, store). */
      spanish: function (what) { return spanishDebug(what); },
      /* The take-aways kit, for the tools (tools/shots.mjs's take: targets, dev/webkit/run.mjs's `takes` job): the take page
       * on the cat on screen, from definitions of its own, never saved (takesDebug: first, q, show, tap, spread, echo, sand,
       * done; the Hollow's shelf and a Count the store round, from a stub chapter of its own; `opts.keys === false`: nothing
       * typed). */
      takes: function (what, opts) { return takesDebug(what, opts); }
    };
    go('title');
  }

  function applySettings() {
    var s = save.settings;
    doc.documentElement.classList.toggle('big', !!s.bigText);
    $('textBtn').setAttribute('aria-pressed', s.bigText ? 'true' : 'false');
    $('readBtn').setAttribute('aria-pressed', s.readAloud ? 'true' : 'false');
    if (!('speechSynthesis' in root)) $('readBtn').hidden = true;
  }

  function bindChrome() {
    // The second tap of a double tap lands on whatever the next screen put in the same place (f084's
    // "Put it in my book" over f085's "See your book"). For a moment after a screen is drawn, taps on
    // it are swallowed before any handler sees them. The top bar and the grown-ups sheet are outside.
    $('screen').addEventListener('click', function (e) {
      // (the Warrior Counts' pages also by when the tap was made: a busy page can hand over the second
      // tap of a double tap late, after the guard's moment, and it would turn the next page too)
      if (now() - renderedAt < UI_GUARD_MS || (view.name === 'warrior' && tappedEarly(e, UI_GUARD_MS))) { e.stopPropagation(); e.preventDefault(); }
    }, true);
    $('backBtn').addEventListener('click', onBack);
    $('catsBtn').addEventListener('click', function () { go('who'); });
    $('campBtn').addEventListener('click', function () { if (cat) { persist(); go('hub'); } });
    // her Case File: its curl of bark (the art's, when it has one) opens it over the page; on the
    // `file` frame, where she is shown how, closing it goes on with the story (fileTeach)
    var fb = $('fileBtn');
    if (fb) {
      var ic = artCall('fileIcon');
      if (ic) fb.innerHTML = ic;
      fb.addEventListener('click', function () { if (!cat || !E.hasFile(cat)) return; if (fileTeach) fileTeach(); else openFile(); });
    }
    var fo = $('file');
    if (fo) {
      // the second tap of a double tap never lands on a card or on Close
      fo.addEventListener('click', function (e) { if (fileState && now() - fileState.at < UI_GUARD_MS) { e.stopPropagation(); e.preventDefault(); } }, true);
      fo.addEventListener('click', function (e) { if (e.target === fo && !(fileState && fileState.pending)) closeFile(); });
    }
    $('textBtn').addEventListener('click', function () {
      save.settings.bigText = !save.settings.bigText; applySettings(); persist();
      if (relayoutFn) relayoutFn();
    });
    $('readBtn').addEventListener('click', function () {
      save.settings.readAloud = !save.settings.readAloud; applySettings(); persist();
      // (a pause of the Warrior Counts on screen: it says its line and waits for it, from here)
      if (save.settings.readAloud && pauseRead && pauseRead()) return;
      if (save.settings.readAloud) speakItems(currentSpeech); else stopSpeech();
    });
    bindLeaf();
  }

  /* ================================================================ navigation */
  function go(name, opts) {
    opts = opts || {};
    clearTimers(); stopSpeech();
    if (fileState) closeFile(true);
    relayoutFn = null; keyHandler = null; currentSpeech = [];
    inLesson = false; fileTeach = null; frameTap = null;
    view = { name: name, opts: opts };
    var scr = $('screen');
    scr.classList.remove('enter', 'enter-back');
    var fn = { title: renderTitle, who: renderWho, frame: renderFrame, book: renderBook, hub: renderHub, hollow: renderHollow, nest: renderNest, warrior: renderWarrior }[name];
    if (!fn) fn = renderTitle;
    fn(opts);
    if (!reduceMotion) { void scr.offsetWidth; scr.classList.add(opts.back ? 'enter-back' : 'enter'); }
    renderedAt = now(); renderedPerf = perfNow();
    updateBar();
    if (!opts.keepScroll && !opts.scrollTo) root.scrollTo(0, 0);
    if (save.settings.readAloud) speakItems(currentSpeech);
  }
  function updateBar() {
    var n = view.name, back = $('backBtn'), title = $('barTitle');
    // on a chapter's first page, the bar's Back still leads somewhere: camp, or who's playing
    var showBack = n !== 'title' && !(n === 'frame' && !E.canBack(cat) && !E.hasFinished(cat));
    back.classList.toggle('invisible', !showBack);
    back.disabled = !showBack;
    $('catsBtn').hidden = n === 'title' || n === 'who';   // no room taken, so the bar title fits on a phone
    // Camp, partway through a chapter (once there is a camp: a chapter finished). Her place stays:
    // the hub's big button picks it up, a lesson in progress too
    $('campBtn').hidden = !(n === 'frame' && cat && E.hasFinished(cat));
    // the Warrior Counts: Camp is there on every page of them (she has finished every chapter), the
    // sitting kept; her Case File's button stays off, as in the Hollow
    if (n === 'warrior') $('campBtn').hidden = !cat;
    // her Case File, on every frame of every chapter once she has it (from the `file` frame on);
    // left off a lesson's keypad screen, as Back is. On the `file` frame itself it glows
    var fb = $('fileBtn');
    if (fb) {
      var hasFile = n === 'frame' && !!cat && E.hasFile(cat) && !inLesson;
      fb.hidden = !hasFile;
      $('bar').classList.toggle('has-file', hasFile);
      fb.classList.toggle('glow', hasFile && !!story && ['file', 'pick'].indexOf(E.kindOf(E.currentFrame(cat, story))) >= 0);
      if (!hasFile) fb.classList.remove('got', 'nudge');
    }
    var t = '';
    if (n === 'title') t = '';
    else if (n === 'who') t = 'Potomac Crossing';
    else if (cat) t = nameHtml(cat) + (n === 'frame' && story ? '<small>Chapter ' + (story.number || 1) + ' · ' + esc(story.title) + '</small>' : '') +
      (n === 'warrior' ? '<small>The Warrior Counts</small>' : '');
    title.classList.toggle('wname', !!cat && n !== 'title' && n !== 'who' && !!E.warriorName(cat));
    title.innerHTML = t;
    fitBarName();
  }
  /* Her warrior name in the bar on a phone (chapter 11 on; the polish release v23): there the title is two lines, broken at
   * the join (nameHtml's <wbr>: Moon / bright), as large as fits up to the bar's own size (index.html, `.bar-title.wname`).
   * With the Case File and Camp shown the title has 92px at 390 x 844, and one line cut every name over about 10 letters
   * (THUNDERWH…); Thunderwhisker alone is set a little smaller, till it fits. On an iPad, and for a cat not yet named, the
   * title is one line, as before (nothing is set). Weighed again on a turn of the phone and once the fonts are in. */
  function fitBarName() {
    var t = $('barTitle');
    if (!t) return;
    t.style.fontSize = '';
    if (!t.classList.contains('wname') || !root.matchMedia || !root.matchMedia('(max-width: 520px)').matches || !t.clientWidth) return;
    var over = function () { return t.scrollWidth > t.clientWidth || t.scrollHeight > t.clientHeight + 1; };
    if (!over()) return;
    var fs = parseFloat(root.getComputedStyle(t).fontSize) || 22;
    // the widest line scaled to the room at once, then down a half pixel at a time while a line still runs over (or a
    // name with a space in it takes a third line)
    fs = Math.max(12, Math.min(fs, Math.floor(fs * t.clientWidth / t.scrollWidth * 2) / 2));
    t.style.fontSize = fs + 'px';
    for (var i = 0; i < 20 && fs > 12 && over(); i++) { fs -= 0.5; t.style.fontSize = fs + 'px'; }
  }
  function onBack() {
    var n = view.name;
    if (n === 'who') return go('title', { back: true });
    if (n === 'frame') {
      if (E.back(cat, story)) { persist(); return go('frame', { back: true }); }
      // a chapter's first page: back to camp once a chapter is finished
      return go(E.hasFinished(cat) ? 'hub' : 'who', { back: true });
    }
    if (n === 'book') return view.opts.from === 'end' ? go('frame', { back: true }) : go('hub', { back: true });
    // (book two: the Hollow and My nest, opened from her book, go back to the volume she left)
    // (the take-aways kit: One Count at a time's page, under the Hollow's shelf, goes back to the shelf)
    if (n === 'hollow' && hollowSub === 'marks') return go('hollow', { from: view.opts.from, vol: view.opts.vol, back: true, stories: view.opts.stories });
    if (n === 'hollow' && hollowSub === 'counts') return go('hollow', { from: view.opts.from, vol: view.opts.vol, back: true, stories: view.opts.stories });
    if (n === 'hollow' || n === 'nest') return go(view.opts.from === 'book' ? 'book' : 'hub', view.opts.from === 'book' && view.opts.vol ? { back: true, vol: view.opts.vol } : { back: true });
    if (n === 'hub') return go('who', { back: true });
    // the Warrior Counts: to camp, the sitting kept (E.warriorKeep has it after every answer)
    if (n === 'warrior') return go('hub', { back: true });
    go('title', { back: true });
  }
  /* The big Back button at the left of every frame's bottom row, beside Next, the same size. On the
     first frame there is nothing to go back to: it keeps its place, invisible, so Next never moves. */
  function backBottom(can) {
    // (the Warrior Counts' frames say themselves whether there is a page to go back to: `can`)
    if (can == null) can = E.canBack(cat);
    return '<button class="btn big back' + (can ? '' : ' nohist') + '" id="backBottom" type="button"' +
      (can ? '' : ' tabindex="-1" aria-hidden="true"') + '>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Back</button>';
  }
  function wireBackBottom() {
    var b = $('backBottom');
    if (b) b.addEventListener('click', function () {
      if (now() - renderedAt < 280) return;   // a double tap never goes back two pages
      onBack();
    });
  }
  /* On a finished chapter's end frame, a cat belongs in camp (the hub). */
  function atCampEnd(c) {
    var s = c && E.chapter(c.chapter, stories());
    return !!(s && E.isFinished(c, s.id) && E.kindOf(E.currentFrame(c, s)) === 'end');
  }
  function openCat(c) {
    cat = c; save.current = c.id; lookCache = null;
    var s = E.chapter(c.chapter, stories());
    if (!s || c.frame == null) { s = E.upNext(c, stories()) || E.firstChapter(stories()); E.openChapter(c, s, now()); }
    story = s;
    persist();
    if (atCampEnd(c)) return go('hub');
    go('frame');
  }
  /* A chapter from the hub: `resume` picks up her place in it (E.openChapter: each chapter keeps
   * its own, so reading chapter 1 again never moves her place in chapter 2); else it starts from
   * its first page (a finished chapter read again). */
  function readChapter(s, resume) {
    if (resume) E.openChapter(cat, s, now());
    else E.startChapter(cat, s, now());
    story = s;
    persist();
    go('frame');
  }

  /* ================================================================ title */
  function renderTitle() {
    // the cat on the wall is the last cat played, or a silhouette for a brand-new device
    var look = cat && cat.look;
    var shown = (cat && E.chapter(cat.chapter, stories())) || E.firstChapter(stories());
    var heading = 'Chapter ' + (shown.number || 1) + ' · ' + shown.title;
    var r = artRender({ set: 'title', cam: 'wide', cast: look ? [{ who: 'player', pose: 'sit', mood: 'dreamy', at: 'wall', facing: 'left' }] : [], fx: ['dusk'] }, look || E.defaultLook(0));
    $('screen').innerHTML =
      '<section class="title-screen">' +
      '<figure class="panel" aria-label="A cat sits on a wall by the river at dusk. Glass towers glow behind.">' +
      '<div class="art" aria-hidden="true">' + r.svg + '</div>' +
      '<h1 class="logo">Potomac Crossing<small>' + esc(heading) + '</small></h1>' +
      '</figure>' +
      '<p class="tagline">A pillow cat. A hidden Clan. A storm on the river.</p>' +
      '<div class="title-cta">' +
      (cat ? '<button class="btn go big" id="resumeBtn" type="button">' + (atCampEnd(cat) ? 'Back to camp, ' : 'Keep reading, ') + nameHtml(cat) + '</button>' +
        '<button class="btn quiet" id="playBtn" type="button">Who’s playing?</button>'
        : '<button class="btn go big" id="playBtn" type="button">Play</button>') +
      '</div></section>';
    $('playBtn').addEventListener('click', function () { go('who'); });
    if ($('resumeBtn')) $('resumeBtn').addEventListener('click', function () { openCat(cat); });
    currentSpeech = [{ text: 'Potomac Crossing. Chapter ' + (shown.number || 1) + ': ' + shown.title + '.' }];
    keyHandler = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (cat) openCat(cat); else go('who'); } };
  }

  /* ================================================================ who's playing */
  function renderWho() {
    var cards = save.cats.map(function (c, i) {
      var status = E.status(c, stories());
      return '<button class="catcard" type="button" data-cat="' + esc(c.id) + '">' +
        '<span class="face" aria-hidden="true">' + catPortrait(c.look, 'happy') + '</span>' +
        '<b' + (E.displayName(c).length > 12 ? ' class="long"' : '') + '>' + nameHtml(c) + '</b><span>' + esc(status) + '</span></button>';
    });
    if (save.cats.length < E.MAX_CATS) {
      cards.push('<button class="catcard new" type="button" id="newCat"><span class="face" aria-hidden="true">+</span><b>New cat</b><span>Start a new story</span></button>');
    }
    $('screen').innerHTML =
      '<section class="page center"><h1 class="h1">Who’s playing?</h1>' +
      '<div class="cats">' + cards.join('') + '</div>' +
      (save.cats.length >= E.MAX_CATS ? '<p class="note">This device has room for four cats. A grown-up can make room in the grown-ups corner (press and hold the leaf).</p>' : '') +
      (store && !store.ok ? '<p class="note">This browser isn’t letting the game save, so progress lasts until the page closes.</p>' : '') +
      '</section>';
    Array.prototype.forEach.call(doc.querySelectorAll('[data-cat]'), function (b) {
      b.addEventListener('click', function () { openCat(E.getCat(save, b.getAttribute('data-cat'))); });
    });
    var nb = $('newCat');
    if (nb) nb.addEventListener('click', function () {
      var c = E.addCat(save, { now: now() });
      if (!c) return;
      E.startChapter(c, E.firstChapter(stories()), now());
      openCat(c);
    });
    currentSpeech = [{ text: 'Who’s playing?' }];
  }

  /* ================================================================ the frame */
  function frameShell(kind, id) {
    return '<section class="frame" data-kind="' + kind + '" data-frame="' + esc(id || '') + '">' +
      '<div class="panel-side"><figure class="panel" id="panel"><div class="art" aria-hidden="true"></div><div class="ov"></div><div class="flash"></div></figure></div>' +
      '<div class="col"><div class="col-top" id="colTop"></div><div class="stack" id="stack" aria-live="polite"></div><div class="interact" id="interact"></div></div>' +
      '</section>';
  }
  /* Draw a frame's scene into a panel. Returns the cast's heads, ready for the balloons. */
  function drawArt(panel, frame, look) {
    var r = artRender(frame.scene, look);
    var art = panel.querySelector('.art');
    if (frame.image) art.innerHTML = '<img src="' + esc(frame.image) + '" alt="">';
    else art.innerHTML = r.svg;
    var hs = castHeads(r.heads, (frame.scene && frame.scene.cast) || []);
    hs.keep = r.keep || [];   // areas the art asks the lettering to keep off (percent of the panel)
    return hs;
  }
  /* The frame as drawn: scene options the cat fills in (the claw marks: marks/glow 'auto'). */
  function shownFrame(f) {
    if (!f || !f.scene) return f;
    var sc = E.resolveScene(f.scene, cat, stories());
    return sc === f.scene ? f : Object.assign({}, f, { scene: sc });
  }
  function playFx(panel, frame) {
    var fx = (frame.scene && frame.scene.fx) || [];
    if (reduceMotion) return;
    // a thunderclap (lightning plus a LOUD sound effect) shakes and flashes even if the story didn't ask
    var clap = fx.indexOf('lightning') >= 0 && frame.sfx && /[A-Z]/.test(frame.sfx);
    if (fx.indexOf('shake') >= 0 || clap) { panel.classList.remove('fx-shake'); void panel.offsetWidth; panel.classList.add('fx-shake'); }
    if (fx.indexOf('flash') >= 0 || clap) { panel.classList.remove('fx-flash'); void panel.offsetWidth; panel.classList.add('fx-flash'); }
  }

  function renderFrame() {
    if (!cat) return go('who');
    // a chapter lesson whose last answer is in but which was never recorded (the page closed during
    // the praise): it counts as finished, so f062 offers "Count them again" and "Next"
    if (cat.lesson && cat.lesson.mode !== 'hollow' && cat.lesson.state && E.counts.done(cat.lesson.state)) {
      if (E.settleLesson(cat)) persist();
    }
    syncStory();
    var id = E.frameId(cat, story);
    cat.frame = id;
    var f = story.frames[id];
    var kind = E.kindOf(f);
    if (kind === 'skip') return renderSkip(f, id);
    // chapter 5: the questions she taps out of somebody: the scene is drawn again at every tap
    if (kind === 'ask') return renderAsk(f, id);
    // the bark Taps (a row of bark, or the one curl): the pieces of bark take the panel
    if (kind === 'scratch' && !f.scratch.tap) return renderScratch(f, id);
    var scr = $('screen');
    scr.innerHTML = frameShell(kind, id);
    var panel = $('panel');
    var kept = E.keptSkip(story, id, cat);
    var heads = kept ? drawKept(panel, kept.skip) : drawArt(panel, shownFrame(f), cat.look);
    // a kept counting picture sits on the lesson's sand, as on the skip page and in the lesson
    if (kept) panel.classList.add('lesson-panel');
    var caps = captionsOf(f), balloons = balloonsOf(f);
    // the captions as they are heard: with the frame's sound in words after the caption that runs on
    // into it (`sfxRead`, E.captionsRead); the lettering on the page is `caps`, unchanged
    var capsRead = E.captionsRead(f, cat).map(fill).filter(Boolean);
    panel.setAttribute('aria-label', capsRead.length ? plain(capsRead.join(' ')) : (balloons.length ? 'A comic panel' : 'A comic panel'));

    // counts: resume a lesson in progress straight away (this chapter's, at this frame; one that
    // waited in the chapter's place while a Hollow round had the slot comes back here too)
    if (kind === 'counts' && E.lessonAt(cat, story, id)) {
      persist();
      return startChapterLesson(f, id, true);
    }

    // on a frame that asks something, the captions are the question: they stay in the text column,
    // right above the answers, so the prompt is always read before the options
    var ctx = { panel: panel, frame: f, heads: heads, caps: caps, capsRead: capsRead, balloons: balloons, keepCaptions: kind === 'choice' || kind === 'input' || kind === 'look' || kind === 'end' };
    // the page a skip-count turns to shows the number the count reached, big, over the picture
    var into = E.skipInto(story, id, cat);
    if (into) ctx.bigNum = String(E.skipReached(into));
    // a skip-count that keeps its totals (`keep`): its counting picture, every group lit and the
    // running totals under them, stays up on the pages after it, to the lesson that follows
    // (chapter 5's tuck keeps no totals under its cats: the number it reached stays over them, 45)
    if (kept) { ctx.keepCaptions = true; ctx.forceStack = true; if (kept.skip.tuck) ctx.bigNum = String(E.skipReached(kept.skip)); }
    // the glitter Tap: where the glint is in the picture, and the lettering keeps off it
    if (kind === 'scratch') {
      ctx.tap = tapSpot(panel, heads, f.scratch);
      heads.keep.push({ x: ctx.tap.x - 7, y: ctx.tap.y - 9, w: 14, h: 18 });
    }
    // When everything fits in the panel, the panel gets the whole page (landscape especially):
    // try that first, and fall back to the two-column spread when text has to sit beside it.
    var frameEl = scr.querySelector('.frame');
    var soloOk = kind === 'next' || kind === 'counts' || kind === 'scratch' || kind === 'file' || kind === 'pick';
    // a frame that gives her a card shows it under the panel: the panel leaves it room (on a screen
    // too short for both, the card sits in the column beside the panel)
    if (f.card != null && E.cardsOn(f, cat, story, stories()).length) {
      frameEl.classList.add('has-card');
      if ((root.innerHeight || 800) < 640) soloOk = false;
    }
    relayoutFn = function () {
      if (soloOk) {
        frameEl.classList.add('solo');
        var L = layoutText(ctx);
        if ((L.captions === 'column' && ctx.caps.length) || L.balloons === 'stack') { frameEl.classList.remove('solo'); layoutText(ctx); }
      } else layoutText(ctx);
      snugChoice(frameEl);
    };
    relayoutFn();
    playFx(panel, f);
    renderInteraction(f, kind, id, ctx);
    snugChoice(frameEl);
    currentSpeech = ctx.reading || [];
    persist();
  }

  /* A page of choices on an upright phone whose Back is under the screen as the page opens (ch06 f100 for a cat who kept
   * the snake's secret: a caption, four balloons stacked under the picture and two options ran Back 21px under a 390 x
   * 844 screen, Aa off): its column sits a little closer and its stacked balloons a little snugger, as Bigger text
   * already sets them upright (index.html, `.frame.snug`), so Back comes up onto the screen. Back stays under the
   * options, never sticky (chapter 4's rule); a page whose Back is on the screen is never touched (the polish release
   * v23). Run after every layout, so a turn of the phone or a late font weighs it again. */
  function snugChoice(frameEl) {
    if (!frameEl) return;
    frameEl.classList.remove('snug');
    if (frameEl.getAttribute('data-kind') !== 'choice' || !root.matchMedia || !root.matchMedia('(max-width: 520px)').matches) return;
    var b = $('backBottom');
    if (b && b.getBoundingClientRect().bottom + (root.pageYOffset || 0) > (root.innerHeight || Infinity)) frameEl.classList.add('snug');
  }

  /* Captions and balloons: in the panel when they fit, otherwise in the column. */
  function layoutText(ctx) {
    var panel = ctx.panel, colTop = $('colTop'), stack = $('stack');
    if (!panel || !colTop) return;
    var ov = panel.querySelector('.ov');
    var W = panel.clientWidth, H = panel.clientHeight;
    var big = save.settings.bigText;
    var fs = clamp(W * 0.026, 15.5, 22) * (big ? 1.18 : 1);
    ov.style.setProperty('--bfs', fs.toFixed(1) + 'px');
    ov.innerHTML = '';
    colTop.innerHTML = ''; stack.innerHTML = '';
    var reading = [];
    var heads = ctx.heads || [];
    var faceList = heads.filter(function (o) { return o.h; }).map(function (o) {
      var r = o.h.r * W / 100;
      return { x: o.h.x * W / 100, y: o.h.y * H / 100, r: r * 1.15 + 6, who: o.who, rr: r };
    }).filter(function (c) { return c.x > -c.r && c.x < W + c.r && c.y > -c.r && c.y < H + c.r; });
    var bodies = faceList.map(function (c) { return { x: c.x - c.rr * 1.7, y: c.y + c.rr * 0.5, w: c.rr * 3.4, h: c.rr * 4 }; });
    // what the picture is about (the claw marks): captions, balloons and sound effects avoid it like a face
    // (a long band, a row of the pile, is kept clear along its length: keepCircles)
    (heads.keep || []).forEach(function (k) { faceList = faceList.concat(keepCircles(k, W, H)); });
    var placed = [];
    var svgParts = { under: [], back: [], over: [], front: [] };
    var layout = { W: W, H: H, captions: 'column', balloons: 'none', sfx: null };

    // 1. captions: overlay in the corners when they are few and short
    var caps = ctx.caps || [];
    // what Read to me says for them: the same lines, and a frame's sound in words where a caption
    // runs on into it (`sfxRead`: the frame's own page gives `capsRead`, E.captionsRead)
    var heard = ctx.capsRead || caps;
    var capEls = [], capBox = null;
    if (!ctx.keepCaptions && caps.length && caps.length <= 2 && W >= 460 && caps.every(function (c) { return c.length <= 95; })) {
      // the first caption opens the panel, so it only goes at the top; the second may close it, unless
      // the panel has balloons: captions are read before balloons, so then it joins the first at the top
      var talk = (ctx.balloons || []).length > 0;
      var ok = true, corners = [['tl', 'tr'], talk ? ['tr', 'under'] : ['br', 'bl', 'tr']];
      var capPlaced = [];
      for (var ci = 0; ci < caps.length && ok; ci++) {
        var el = doc.createElement('p');
        el.className = 'ctext';
        el.innerHTML = richN(caps[ci]);
        el.style.maxWidth = Math.round(W * 0.48) + 'px';
        el.style.visibility = 'hidden';
        ov.appendChild(el);
        var w = el.offsetWidth, h = el.offsetHeight, m = 10, done = false;
        if (h > H * 0.34) { ok = false; break; }
        var list = corners[ci];
        for (var k = 0; k < list.length && !done; k++) {
          var c = list[k], x, y;
          if (c === 'under') {
            // stacked right under the first caption, on its side of the panel
            var p0 = capPlaced[0];
            if (!p0) continue;
            x = p0.x + w > W - m ? W - w - m : (p0.x > W / 2 ? p0.x + p0.w - w : p0.x); y = p0.y + p0.h + 6;
            if (y + h > H - m) continue;
          } else { x = c.charAt(1) === 'l' ? m : W - w - m; y = c.charAt(0) === 't' ? m : H - h - m; }
          var rect = { x: x, y: y, w: w, h: h };
          var hit = faceList.some(function (fc) { return rectCircle(rect, fc); }) || capPlaced.some(function (p) { return overlap(rect, p, 6); });
          if (!hit) { el.style.left = x + 'px'; el.style.top = y + 'px'; capPlaced.push(rect); done = true; }
        }
        if (!done) ok = false;
        capEls.push(el);
      }
      if (ok) {
        capEls.forEach(function (el) { el.style.visibility = ''; });
        placed = placed.concat(capPlaced);
        capBox = capPlaced.reduce(function (u, r) {
          if (!u) return { x: r.x, y: r.y, w: r.w, h: r.h };
          var x0 = Math.min(u.x, r.x), y0 = Math.min(u.y, r.y);
          return { x: x0, y: y0, w: Math.max(u.x + u.w, r.x + r.w) - x0, h: Math.max(u.y + u.h, r.y + r.h) - y0 };
        }, null);
        layout.captions = 'panel';
        heard.forEach(function (c) { reading.push({ text: c }); });
      } else {
        capEls.forEach(function (el) { el.remove(); });
      }
    }
    if (layout.captions === 'column') {
      colTop.innerHTML = caps.map(function (c) {
        if (ctx.frame.end && /^(the )?end of chapter/i.test(c)) return '<p class="endcap">' + richN(c) + '</p>';
        return '<p class="caption">' + richN(c) + '</p>';
      }).join('');
      heard.forEach(function (c) { reading.push({ text: c }); });
    }

    // 2. balloons
    var bs = ctx.balloons || [];
    var runs = speakerRuns(heads, bs);
    var spots = [], placedBefore = placed.length;
    // a page that shows a counting picture in place of its scene has no faces to point at: its
    // balloons go beside it, as on the skip-count itself
    var allFit = bs.length > 0 && !ctx.forceStack;
    var padX = fs * 0.95, padY = fs * 0.62;
    for (var bi = 0; bi < bs.length && allFit; bi++) {
      var b = bs[bi];
      // which of its speaker's cast members a balloon is, and whether it continues the one before
      var n = runs[bi].slot, same = runs[bi].same;
      var head = headFor(heads, b.who, n);
      var hd = head ? { x: head.x * W / 100, y: head.y * H / 100, r: head.r * W / 100 } : null;
      if (hd && (hd.x < 0 || hd.x > W || hd.y < 0 || hd.y > H)) hd = null;
      var t = doc.createElement('div');
      t.className = 'btext ' + b.kind;
      var prevB = bi > 0 ? bs[bi - 1] : null;
      // a voice from outside the panel gets a name tag, unless it continues the balloon before
      t.innerHTML = (!hd && !(prevB && same) ? '<span class="tagin">' + esc(speakerName(b)) + '</span>' : '') + richN(b.text);
      var len = b.text.length;
      var maxW = Math.min(W * 0.5, Math.max(fs * 6, Math.sqrt(len) * fs * 2.3));
      t.style.maxWidth = Math.round(maxW) + 'px';
      t.style.visibility = 'hidden';
      ov.appendChild(t);
      var tw = Math.ceil(t.offsetWidth) + 1, th = Math.ceil(t.offsetHeight);
      var ex = b.kind === 'shout' ? 12 : (b.kind === 'think' ? 10 : 0);
      var bw = tw + padX * 2 + ex * 2, bh = th + padY * 2 + ex * 2;
      // `digits` (the Warrior Counts' "7 × 8"): a small tag in Andika hanging under the balloon's
      // edge, with room kept for it below the balloon
      var pill = null, pw = 0, ph = 0, extra = 0;
      if (b.digits) {
        pill = doc.createElement('span');
        pill.className = 'dpill';
        pill.textContent = b.digits;
        pill.style.visibility = 'hidden';
        ov.appendChild(pill);
        pw = Math.ceil(pill.offsetWidth); ph = Math.ceil(pill.offsetHeight); extra = Math.round(ph * 0.75);
      }
      var bhR = bh + extra;
      var prevSpot = spots.length ? spots[spots.length - 1] : null;
      var link = prevSpot && same && prevSpot.b === bs[bi - 1] ? prevSpot : null;
      // reading order: each balloon goes below the one before it, or to its right; only when that is
      // impossible (a crowded panel) is it allowed elsewhere, and then only for a different speaker
      var capFirst = bi === 0 && layout.captions === 'panel' && placed.length ? capBox : null;
      // (`last`: the panel's last balloon, with nothing to read after it: an off-panel voice may sit by the bottom edge)
      var lastB = bi === bs.length - 1;
      var spot = findSpot({ W: W, H: H, w: bw, h: bhR, faces: faceList, bodies: bodies, placed: placed, head: hd, near: link ? link.box : null, after: prevSpot ? prevSpot.box : null, afterCap: capFirst, prev: prevSpot ? prevSpot.box : null, index: bi, last: lastB, margin: 8 });
      if (!spot && capFirst) spot = findSpot({ W: W, H: H, w: bw, h: bhR, faces: faceList, bodies: bodies, placed: placed, head: hd, index: bi, last: lastB, margin: 8 });
      if (!spot && prevSpot && !link) {
        // a crowded panel: anywhere free will do, as long as it still reads after the balloon before
        // it (at or below it, or to its right); otherwise the balloons stack under the panel, in order
        var fb = findSpot({ W: W, H: H, w: bw, h: bhR, faces: faceList, bodies: bodies, placed: placed, head: hd, prev: prevSpot.box, index: bi, last: lastB, margin: 8 });
        if (fb && readsAfter({ x: fb.x, y: fb.y, w: bw, h: bhR }, prevSpot.box)) spot = fb;
      }
      var box = null;
      if (spot && link) {
        // a chained balloon far from the one before it reads badly: try the pair as one block first
        var lb = link.box;
        var gapX = Math.max(0, Math.max(lb.x - (spot.x + bw), spot.x - (lb.x + lb.w))), gapYY = Math.max(0, Math.max(lb.y - (spot.y + bh), spot.y - (lb.y + lb.h)));
        if (gapX + gapYY > 36) spot = null;
      }
      if (!spot && link) {
        // no room after it: place the two as one block, the first on top
        // (the block still reads after whatever came before the pair: f081's "THAT'S HIM!" and "He
        // climbs…" never go up above the shout they answer)
        var gapY = 14, pb = link.box, others = placed.filter(function (p) { return p !== pb; });
        var before = link.link ? link.link.box : (spots.length > 1 ? spots[spots.length - 2].box : null);
        var blk = findSpot({ W: W, H: H, w: Math.max(pb.w, bw), h: pb.h + gapY + bhR, faces: faceList, bodies: bodies, placed: others, head: link.hd, near: link.link ? link.link.box : null, after: before, prev: spots.length > 1 ? spots[spots.length - 2].box : null, index: bi - 1, margin: 8 });
        if (blk) {
          var bwid = Math.max(pb.w, bw);
          var nb = { x: blk.x + (bwid - pb.w) / 2, y: blk.y, w: pb.w, h: pb.h };
          placed[placed.indexOf(pb)] = nb; link.box = nb;
          box = { x: blk.x + (bwid - bw) / 2, y: blk.y + pb.h + gapY, w: bw, h: bh };
        } else {
          spot = findSpot({ W: W, H: H, w: bw, h: bhR, faces: faceList, bodies: bodies, placed: placed, head: hd, near: link.box, after: link.box, prev: link.box, index: bi, margin: 8 });
          if (spot) box = { x: spot.x, y: spot.y, w: bw, h: bh };
        }
      } else if (spot) box = { x: spot.x, y: spot.y, w: bw, h: bh };
      if (!box) { allFit = false; t.remove(); if (pill) pill.remove(); break; }
      placed.push(box);
      var pillAt = null;
      if (pill) {
        // on the side away from the tail, so it never sits on it
        var leftSide = hd && hd.x > box.x + box.w / 2;
        pillAt = { x: leftSide ? box.x + 14 : box.x + box.w - pw - 14, y: box.y + bh - Math.round(ph * 0.25), w: pw, h: ph };
        placed.push(pillAt);
      }
      spots.push({ b: b, el: t, box: box, hd: hd, tw: tw, ex: ex, link: link, pill: pill, pillAt: pillAt });
    }
    // balloons that would bury the picture (a small screen, a lot of talk) go under the panel
    var talkArea = spots.reduce(function (a, sp) { return a + sp.box.w * sp.box.h; }, 0);
    if (allFit && talkArea > W * H * 0.42) allFit = false;
    if (allFit && bs.length) {
      layout.balloons = 'panel';
      spots.forEach(function (s) {
        s.el.style.left = (s.box.x + padX + s.ex) + 'px';
        s.el.style.top = (s.box.y + padY + s.ex) + 'px';
        s.el.style.width = s.tw + 'px';
        s.el.style.visibility = '';
        if (s.pill) { s.pill.style.left = s.pillAt.x + 'px'; s.pill.style.top = s.pillAt.y + 'px'; s.pill.style.visibility = ''; }
        drawBalloon(svgParts, s, W, H);
        reading.push({ text: s.b.text, who: s.b.who, variant: s.b.variant });
      });
    } else if (bs.length) {
      spots.forEach(function (s) { s.el.remove(); if (s.pill) s.pill.remove(); });
      placed = placed.slice(0, placedBefore);
      layout.balloons = 'stack';
      // (the Warrior Counts: the tricky ones written out under one of the balloons, `afterBalloon`)
      var ab = ctx.afterBalloon || null;
      stack.innerHTML = bs.map(function (b, i) { return stackBalloon(b) + (ab && ab.i === i ? ab.html : ''); }).join('');
      bs.forEach(function (b, i) { reading.push({ text: b.text, who: b.who, variant: b.variant }); if (ab && ab.i === i) reading.push.apply(reading, ab.reading || []); });
    }

    // 3. sound effect: big, tilted, somewhere it doesn't cover a face
    var sfx = ctx.frame.sfx ? fill(ctx.frame.sfx) : '';
    if (sfx) layout.sfx = drawSfx(svgParts, sfx, W, H, faceList, placed, ctx.frame);
    // 4. the number a skip-count reached (the page it turns to): big, in the times-table font
    if (ctx.bigNum) layout.bigNum = drawBigNum(svgParts, ctx.bigNum, W, H, faceList, layout.sfx ? placed.concat([layout.sfx]) : placed);

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' +
      '<defs><linearGradient id="sfxg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff07a"/><stop offset=".55" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff8f2e"/></linearGradient></defs>' +
      svgParts.under.join('') + svgParts.back.join('') + svgParts.over.join('') + svgParts.front.join('') + '</svg>';
    ov.insertAdjacentHTML('afterbegin', svg);
    ctx.reading = reading;
    lastLayout = layout;
    return layout;
  }

  function stackBalloon(b, extraClass) {
    var right = b.who === 'player';
    var face = b.noFace ? '' : speakerFace(b.who, b.variant);
    var who = speakerName(b);
    // a long warrior name labelling her own balloon on the Warrior Counts' pages (a re-sit after the Ceremony) takes a
    // line of its own, so her shout keeps its line: "Thunderwhiskerbutterscotch A / HUNDRED!" (the final review)
    var longWho = view.name === 'warrior' && right && E.warriorName(cat) && who.length > 12;
    return '<div class="sbrow' + (right ? ' right' : '') + '">' + (face ? '<span class="sface" aria-hidden="true">' + face + '</span>' : '') +
      '<div class="sb ' + esc(b.kind || '') + (right ? ' right' : '') + ' ' + (extraClass || '') + '"><span class="who' + (longWho ? ' long' : '') + '">' + esc(who) + '</span>' + (b.html != null ? b.html : richN(b.text)) +
      (b.digits ? '<span class="dpill">' + esc(b.digits) + '</span>' : '') + '</div></div>';
  }
  function drawBalloon(parts, s, W, H) {
    var box = s.box, kind = s.b.kind, ex = s.ex;
    var inner = { x: box.x + ex, y: box.y + ex, w: box.w - 2 * ex, h: box.h - 2 * ex };
    var tip = null;
    if (s.link) {
      var a = s.link.box, ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 }, bc = { x: inner.x + inner.w / 2, y: inner.y + inner.h / 2 };
      var neck = 'M' + f1(ac.x) + ' ' + f1(ac.y) + ' L' + f1(bc.x) + ' ' + f1(bc.y);
      parts.under.push('<path d="' + neck + '" stroke="#1b1622" stroke-width="17" stroke-linecap="round"/>');
      parts.over.push('<path d="' + neck + '" stroke="#fffaf0" stroke-width="10.5" stroke-linecap="butt"/>');
    } else if (s.hd) {
      var cx = inner.x + inner.w / 2, cy = inner.y + inner.h / 2;
      var dx = cx - s.hd.x, dy = cy - s.hd.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      var reach = s.hd.r * 1.12;
      tip = { x: s.hd.x + dx / d * reach, y: s.hd.y + dy / d * reach };
    } else if (!s.link) {
      // an off-panel voice: the tail points out of the top of the panel
      tip = { x: clamp(inner.x + inner.w * 0.7, 10, W - 10), y: -6 };
      if (inner.y > H * 0.4) tip = { x: clamp(inner.x + inner.w * 0.7, 10, W - 10), y: H + 6 };
    }
    var stroke = '#1b1622', fillc = '#fffaf0', sw = 3;
    var dash = kind === 'whisper' ? ' stroke-dasharray="8 6"' : '';
    var rx = Math.min(inner.h / 2, inner.w / 2, 30);
    var body;
    if (kind === 'shout') body = spikyPath(box, 11);
    else body = null;
    var g = [];
    if (kind === 'think') {
      var circles = cloudCircles(inner);
      g.push(circles.map(function (c) { return '<circle cx="' + f1(c.x) + '" cy="' + f1(c.y) + '" r="' + f1(c.r) + '" fill="' + fillc + '" stroke="' + stroke + '" stroke-width="' + sw + '"/>'; }).join(''));
      g.push('<rect x="' + f1(inner.x) + '" y="' + f1(inner.y) + '" width="' + f1(inner.w) + '" height="' + f1(inner.h) + '" rx="' + f1(rx) + '" fill="' + fillc + '"/>');
      g.push(circles.map(function (c) { return '<circle cx="' + f1(c.x) + '" cy="' + f1(c.y) + '" r="' + f1(c.r - sw / 2 - 0.5) + '" fill="' + fillc + '"/>'; }).join(''));
      if (tip) {
        var tg = tailGeom(inner, tip, 4);
        if (tg) {
          var e1 = tg.edge;
          [0.3, 0.58, 0.82].forEach(function (k, i) {
            var px = e1.x + (tip.x - e1.x) * k, py = e1.y + (tip.y - e1.y) * k;
            g.push('<circle cx="' + f1(px) + '" cy="' + f1(py) + '" r="' + (7 - i * 2) + '" fill="' + fillc + '" stroke="' + stroke + '" stroke-width="2.5"/>');
          });
        }
      }
      parts.back.push('<g class="balloon">' + g.join('') + '</g>');
      return;
    }
    var tail = tip ? tailGeom(inner, tip, Math.min(13, inner.w / 7)) : null;
    if (tail) g.push('<path d="' + tail.d + '" fill="' + fillc + '" stroke="' + stroke + '" stroke-width="' + sw + '" stroke-linejoin="round"' + dash + '/>');
    if (body) g.push('<path d="' + body + '" fill="' + fillc + '" stroke="' + stroke + '" stroke-width="' + (sw + 0.5) + '" stroke-linejoin="round"/>');
    else g.push('<rect x="' + f1(inner.x) + '" y="' + f1(inner.y) + '" width="' + f1(inner.w) + '" height="' + f1(inner.h) + '" rx="' + f1(rx) + '" fill="' + fillc + '" stroke="' + stroke + '" stroke-width="' + sw + '"' + dash + '/>');
    if (tail) g.push('<path d="' + tail.mouth + '" fill="' + fillc + '"/>');
    parts.back.push('<g class="balloon">' + g.join('') + '</g>');
  }
  function spikyPath(box, spike) {
    var x0 = box.x + spike, y0 = box.y + spike, w = box.w - 2 * spike, h = box.h - 2 * spike;
    var cx = x0 + w / 2, cy = y0 + h / 2, pts = [];
    var n = Math.max(14, Math.round((w + h) / 16));
    for (var i = 0; i < n * 2; i++) {
      var a = (i / (n * 2)) * Math.PI * 2;
      var ca = Math.cos(a), sa = Math.sin(a);
      // point on the rectangle boundary in this direction
      var t = Math.min(Math.abs(ca) > 1e-6 ? (w / 2) / Math.abs(ca) : Infinity, Math.abs(sa) > 1e-6 ? (h / 2) / Math.abs(sa) : Infinity);
      var out = i % 2 ? spike * 0.95 : spike * 0.15;
      pts.push(f1(cx + ca * (t + out)) + ' ' + f1(cy + sa * (t + out)));
    }
    return 'M' + pts.join(' L') + 'Z';
  }
  function cloudCircles(r) {
    var out = [], step = 22, rad = 13;
    for (var x = r.x + 8; x <= r.x + r.w - 8; x += step) { out.push({ x: x, y: r.y + 2, r: rad }); out.push({ x: x + step / 2, y: r.y + r.h - 2, r: rad }); }
    for (var y = r.y + 12; y <= r.y + r.h - 12; y += step) { out.push({ x: r.x + 2, y: y, r: rad }); out.push({ x: r.x + r.w - 2, y: y + step / 2 > r.y + r.h - 8 ? y : y + step / 2, r: rad }); }
    return out;
  }
  function drawSfx(parts, text, W, H, faces, placed, frame) {
    // LOUD sounds are big and gold; quiet ones (all lower case: "tink", "sniff… sniff…") are small and pale
    var quiet = text === text.toLowerCase();
    var hash = 0; for (var i = 0; i < (frame && frame.sfx || '').length; i++) hash = (hash * 31 + frame.sfx.charCodeAt(i)) | 0;
    var rot = ((hash & 1) ? 7 : -8) * (quiet ? 0.5 : 1);
    // sized to fit the panel, and smaller still rather than cover a balloon (sfxPlace)
    // (a frame's own `sfxAt` first: the Roar goes in the sky the frame names)
    var pl = sfxPlace(text, W, H, faces, placed, frame && frame.sfxAt), best = pl.box, size = pl.size, estW = best.w, estH = best.h;
    var cx = best.x + estW / 2, cy = best.y + estH * 0.82;
    var sw = quiet ? Math.max(3, size * 0.14) : Math.max(4, size * 0.12);
    var t = '<text x="' + f1(cx) + '" y="' + f1(cy) + '" text-anchor="middle" font-size="' + f1(size) + '"' + (quiet ? ' letter-spacing="1"' : '');
    parts.front.push('<g class="sfx' + (reduceMotion ? '' : ' pop') + '"><g transform="rotate(' + rot + ' ' + f1(cx) + ' ' + f1(cy - size * 0.35) + ')">' +
      (quiet ? '' : t + ' fill="#1b1622" stroke="#1b1622" stroke-width="' + f1(sw) + '" transform="translate(' + f1(size * 0.06) + ' ' + f1(size * 0.07) + ')">' + esc(text) + '</text>') +
      t + ' fill="' + (quiet ? '#fff6dc' : 'url(#sfxg)') + '" stroke="#1b1622" stroke-width="' + f1(sw) + '">' + esc(text) + '</text></g></g>');
    return best;
  }

  /* The skip-count's number on the page it turns to: where the skip frame shows it (top middle)
   * when that is free, else the freest corner; never over a face, a caption or a balloon. */
  function drawBigNum(parts, text, W, H, faces, placed) {
    var size = clamp(H * 0.2, 40, 104), estW = text.length * size * 0.56 + size * 0.2, estH = size * 1.02;
    var spots = [[(W - estW) / 2, H * 0.03], [W - estW - W * 0.04, H * 0.04], [W * 0.04, H * 0.04],
      [W - estW - W * 0.04, (H - estH) * 0.45], [W * 0.04, (H - estH) * 0.45], [(W - estW) / 2, H - estH - H * 0.06]];
    var best = null, bestScore = Infinity;
    spots.forEach(function (p, k) {
      var r = { x: p[0], y: p[1], w: estW, h: estH }, score = k * 2;
      faces.forEach(function (c) { if (rectCircle(r, c)) score += 1000; });
      placed.forEach(function (b) { var a = overlapArea(r, b); if (a > 0) score += 1500 + a / 50; });
      if (score < bestScore) { bestScore = score; best = r; }
    });
    var cx = best.x + estW / 2, cy = best.y + size * 0.86, sw = Math.max(5, size * 0.1);
    var t = '<text x="' + f1(cx) + '" y="' + f1(cy) + '" text-anchor="middle" font-size="' + f1(size) + '" font-weight="700" style="font-family:Andika, ui-rounded, system-ui, sans-serif"';
    parts.front.push('<g class="bignum' + (reduceMotion ? '' : ' pop') + '">' +
      t + ' fill="#1b1622" stroke="#1b1622" stroke-width="' + f1(sw) + '" stroke-linejoin="round" transform="translate(' + f1(size * 0.05) + ' ' + f1(size * 0.05) + ')">' + esc(text) + '</text>' +
      t + ' fill="#ffd23f" stroke="#1b1622" stroke-width="' + f1(sw * 0.7) + '" stroke-linejoin="round" paint-order="stroke">' + esc(text) + '</text></g>');
    return best;
  }

  /* ---------------------------------------------------------------- interactions */
  function renderInteraction(f, kind, id, ctx) {
    var box = $('interact'), panel = ctx.panel;
    var nextBtn = function (label, onClick, cls) {
      box.innerHTML = '<div class="next-row">' + backBottom() + '<button class="btn go big ' + (cls || '') + '" id="nextBtn" type="button">' + esc(label) +
        ' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';
      $('nextBtn').addEventListener('click', onClick);
      wireBackBottom();
    };
    renderInteractionKind(f, kind, id, ctx, box, panel, nextBtn);
    // a gift frame: a small note that it's in her nest now (she finds it under "From friends")
    if (f.gift && cat.nest.indexOf(f.gift) >= 0) {
      var g = E.gift(f.gift) || { id: f.gift, name: f.gift };
      box.insertAdjacentHTML('afterbegin', '<p class="giftnote" role="status">' + treasureSvg(g.id) + '<span><b>' + esc(giftShort(g)) + '</b> is in your nest.</span></p>');
      if (ctx.reading) ctx.reading.push({ text: giftShort(g) + ' is in your nest.' });
    }
    cardNote(f, id, box, ctx.reading);
  }
  /* A frame that gives her a card shows the card itself under the panel: its picture, its mark and
   * its line, and no other words (a line the frame's own balloon already says is lettered once: the
   * card is its picture alone). Once her Case File's button is there, it wiggles and glows as the
   * card appears, so each new card is seen to go into the file she can open. A card she already
   * holds may lie beside the new one (the story's `held: true`: the wing beside the fox's FLEW). */
  function cardNote(f, id, box, reading, quiet) {
    if (f.card == null) return;
    var got = E.cardsOn(f, cat, story, stories());
    if (!got.length) return;
    box.insertAdjacentHTML('afterbegin', '<div class="cardnote" role="status">' + got.map(function (c) {
      var line = fill(c.line);
      return '<div class="cn-card' + (c.held ? ' held' : '') + (reduceMotion ? '' : ' pop') + '" role="img" aria-label="' + esc((c.held ? 'Beside it, from your Case File: ' : 'A new card for your Case File: ') + plain(line)) + '">' +
        '<span class="cn-pic" aria-hidden="true">' + cardSvg(c, { mark: c.showMark }) + '</span>' +
        (c.showLine ? '<span class="cn-line" aria-hidden="true">' + rich(line) + '</span>' : '') + '</div>';
    }).join('') + '</div>');
    got.forEach(function (c) { if (c.showLine && reading) reading.push({ text: fill(c.line) }); });
    if (!quiet && E.fileWiggles(cat, story, id)) fileGot();
  }
  /* The Case File's button, once: a wiggle and a glow (a card just went in), or a nudge (she tapped
   * somewhere else on the page that asks her to tap it). */
  var fileGotTimer = null;
  function fileGot(cls) {
    var b = $('fileBtn');
    if (!b) return;
    cls = cls || 'got';
    // (the button may still be hidden while the page is drawn: the wiggle starts as it appears)
    b.classList.remove('got', 'nudge'); void b.offsetWidth; b.classList.add(cls);
    clearTimeout(fileGotTimer);
    fileGotTimer = setTimeout(function () { b.classList.remove('got', 'nudge'); }, reduceMotion ? 1700 : 1300);
  }
  /* "Riffle’s lucky stone" from "Riffle’s lucky stone: dark and smooth, …" */
  function giftShort(g) { return String(g.name || g.id).split(':')[0]; }
  function renderInteractionKind(f, kind, id, ctx, box, panel, nextBtn) {
    if (kind === 'next') {
      // straight after a skip-count's last hop she is still tapping: give the page a moment
      var hold = view.opts && view.opts.fromSkip ? 1100 : 280;
      var adv = function () {
        if (now() - renderedAt < hold) return;
        if (E.next(cat, story, now())) { persist(); go('frame'); }
      };
      nextBtn('Next', adv);
      panel.classList.add('tappable');
      panel.addEventListener('click', adv);
      keyHandler = function (e) {
        if (isTyping(e)) return;
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); adv(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
      };
      return;
    }
    if (kind === 'end') {
      nextBtn('See your book', function () { go('book', { from: 'end', scrollTo: story.id }); });
      keyHandler = function (e) { if (!isTyping(e) && e.key === 'ArrowLeft') onBack(); };
      return;
    }
    if (kind === 'choice') {
      // options with a `when` that doesn't match are hidden (a choice keeps at least one)
      var opts = E.options(f, cat);
      var prompt = f.choice.prompt ? '<p class="prompt">' + rich(fill(f.choice.prompt)) + '</p>' : '';
      var was = E.chosen(cat, story, id), picked = was ? was.index : -1;
      box.innerHTML = prompt + '<div class="choices" role="group">' + opts.map(function (o, n) {
        return '<button class="choice" type="button" data-i="' + o.index + '" data-n="' + (n + 1) + '"' + (o.index === picked ? ' aria-current="true"' : '') + '>' + richN(fill(E.optionLabel(o.option, cat))) + '</button>';
      }).join('') + '</div><div class="next-row">' + backBottom() + '</div>';
      wireBackBottom();
      Array.prototype.forEach.call(box.querySelectorAll('.choice'), function (b) {
        b.addEventListener('click', function () {
          if (now() - renderedAt < 280) return;
          if (E.choose(cat, story, +b.getAttribute('data-i'), now())) { persist(); go('frame'); }
        });
      });
      keyHandler = function (e) {
        if (isTyping(e)) return;
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= opts.length) { var b = box.querySelector('[data-n="' + n + '"]'); if (b) b.click(); }
        else if (e.key === 'ArrowLeft') onBack();
      };
      if (prompt) ctx.reading.push({ text: fill(f.choice.prompt) });
      opts.forEach(function (o) { ctx.reading.push({ text: fill(E.optionLabel(o.option, cat)) }); });
      return;
    }
    if (kind === 'file') return renderFileFrame(f, id, ctx, box, panel);
    if (kind === 'pick') return renderPickFrame(f, id, ctx, box, panel, nextBtn);
    if (kind === 'scratch') return renderGlint(f, id, ctx, box, panel);
    if (kind === 'input') return renderInput(f, id, box, ctx);
    if (kind === 'look') return renderLook(f, id, box, ctx);
    if (kind === 'counts') {
      var done = cat.lessons[f.counts.set];
      if (done) {
        box.innerHTML = '<div class="row end">' + backBottom() + '<button class="btn quiet" id="againBtn" type="button">Count them again</button><button class="btn go big" id="nextBtn" type="button">Next</button></div>';
        wireBackBottom();
        $('nextBtn').addEventListener('click', function () { if (E.finishCounts(cat, story, done, now())) { persist(); go('frame'); } });
        $('againBtn').addEventListener('click', function () { startChapterLesson(f, id, false); });
      } else {
        nextBtn('Let’s count!', function () { startChapterLesson(f, id, false); });
      }
      keyHandler = function (e) { if (!isTyping(e) && e.key === 'ArrowLeft') onBack(); };
    }
  }

  /* ---------------------------------------------------------------- the skip-count
   * `skip: { table, groups, who?, next, done? }`: the panel is the counting picture, the next group
   * (the next cat) glowing softly. A tap on that cat (a generous area: its whole column of the
   * panel) lights its things, adds its running total under it and grows the big number; the
   * teacher's balloon keeps the count. A tap anywhere else makes the glowing cat wiggle, with no
   * line and no penalty, and nothing is logged. The last tap turns the page to `next`, which shows
   * the number she reached (renderFrame); a skip with a `done` line shows it instead, then Next.
   * Space, Enter or → counts the next cat too, and a hidden "Count the next cat" button does for
   * VoiceOver. Chapter 4: both forepaws together (`paws: 'both'`), the pile of six (`paws: 'pile'`),
   * one group (Squall's forepaw), and an instruction under the panel (`prompt`); what is drawn and
   * said comes from the engine (E.skipPicture, E.skipWords). */
  function renderSkip(f, id) {
    // chapter 5: the skip as this cat meets it (the mud count: a forepaw for everyone she has found)
    var sk = E.skipFor(f.skip, cat), taps = 0, turning = false;
    var scr = $('screen');
    scr.innerHTML = frameShell('skip', id);
    var panel = $('panel'), art = panel.querySelector('.art'), ov = panel.querySelector('.ov');
    // chapter 5, nine claws in the log (`paws: 'log'`): no counting picture. The frame's own scene
    // stays up and is drawn again at every tap (E.skipScene: a claw dug in, the skymonster growing)
    var onScene = E.skipOnScene(sk) && !!f.scene, lastStep = -1;
    if (onScene) panel.classList.add('tappable');
    else panel.classList.add('lesson-panel', 'tappable');
    var caps = captionsOf(f), intro = balloonsOf(f);
    // `paws: 'own'` (the bedtime hop): her own two forepaws, the glow taking turns; the number is
    // in her own murmur unless the frame names a teacher. The words are the engine's (E.skipWords):
    // who keeps the count, whether it is murmured, the hidden button's and the panel's labels
    var words = E.skipWords(sk, intro[0] && intro[0].who);
    var own = words.whisper, teacher = words.teacher, noted = false;
    // the count's name tag is the frame's own for that speaker ("Squall", once he has said his name)
    var tname = nameOn(intro, teacher);
    // (chapter 11: or the skip's own `name`, where the frame has no balloon of the counter's to take it from: f052's
    // whispered count is tagged with her warrior name)
    if (sk.name != null) tname = sk.name;
    var hint = words.prompt ? fill(words.prompt) : '';
    panel.setAttribute('aria-label', words.aria);
    $('colTop').innerHTML = caps.map(function (c) { return '<p class="caption">' + richN(c) + '</p>'; }).join('');
    function draw(fresh) {
      var v = E.skipView(sk, taps);
      if (onScene) {
        var sc = E.skipScene(E.resolveScene(f.scene, cat, stories()), sk, taps, f.sfx ? fill(f.sfx) : '');
        drawArt(panel, { scene: sc.scene }, cat.look);
        // the step's lettering (the roar: rrr… RRR…), a little larger at each step, along the top
        ov.innerHTML = sc.sfx ? '<div class="skipsfx s' + Math.max(1, Math.min(3, sc.step + 1)) + (fresh && sc.step !== lastStep && !reduceMotion ? ' pop' : '') + '" aria-hidden="true">' + esc(sc.sfx) + '</div>' : '';
        lastStep = sc.step;
      } else {
        // her own paws: each tap lights that paw's five claws again (v.lit), the other one glows next (v.nextPaw)
        var po = E.skipPicture(sk, taps);
        po.look = cat && cat.look;
        art.innerHTML = artCall('countsPicture', po) || countsFallback(v.groups, v.per, v.highlight);
        hopGroup();
        // (one group, Squall's forepaw: the big number beside the lit claws, not at the top centre, where his face is)
        // (chapter 5's tuck: the number is there from the start, 50, and steps back a claw a tap)
        // (her paws aboard and the mud count: no big number, E.skipWords' `noNumber`)
        ov.innerHTML = v.total && !words.noNumber ? '<div class="skipnum' + (v.groups === 1 ? ' one' : '') + (fresh && !reduceMotion ? ' pop' : '') + '" aria-hidden="true">' + v.total + '</div>' : '';
      }
      var lines = intro.slice();
      // the count: in the counter's balloon (murmured on her own paws at bedtime; a thought, with nine
      // claws in a log; in words when Tallyheart counts her paws aboard: "One. Two.")
      if (v.taps) {
        var counter = { who: teacher, name: tname, html: '<span class="counter' + (words.words ? ' words' : '') + '">' + esc(v.count) + '</span>' };
        if (own) counter.kind = 'whisper'; else if (words.think) counter.kind = 'think';
        // (chapter 12: a Spanish count is lettered as Spanish, its gloss under it at the end, in the `counter words` class)
        if (sk.lang === 'es') counter.html = '<span class="counter words">' + rich(v.count) + '</span>';
        lines.push(counter);
      }
      if (v.done && sk.done) lines.push({ who: teacher, name: tname, text: fill(sk.done) });
      $('stack').innerHTML = lines.map(function (b) { return stackBalloon(b); }).join('');
      // the bottom row: Back (and Next, only after a done line, or at the end of a Spanish count, which waits for it:
      // chapter 12's `wait`); counting is done on the cats
      var showNext = v.done && (!!sk.done || !!v.wait);
      $('interact').innerHTML = (hint && !v.done ? '<p class="prompt tapline">' + rich(hint) + '</p>' : '') + '<div class="next-row">' + backBottom() +
        (showNext ? '<button class="btn go big" id="nextBtn" type="button">Next <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
          : (v.done ? '' : '<button class="sr" id="countBtn" type="button">' + esc(words.label) + '</button>')) + '</div>';
      // a card this frame gives her is shown here too, under the picture (the button wiggles once)
      cardNote(f, id, $('interact'), null, noted);
      noted = true;
      wireBackBottom();
      if ($('nextBtn')) $('nextBtn').addEventListener('click', advance);
      if ($('countBtn')) $('countBtn').addEventListener('click', function () { tap(); var b = $('countBtn'); if (b) b.focus({ preventScroll: true }); });
      return v;
    }
    /* The glowing cat and its glow, in one group that can wiggle (the art draws the glow just
     * before the cat it is behind). */
    function hopGroup() {
      var nx = art.querySelector('.pc-next');
      if (!nx || !nx.parentNode) return null;
      var par = nx.parentNode;
      if (par.getAttribute && par.getAttribute('class') === 'pc-hop') return par;
      var g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'pc-hop');
      var cell = nx.nextElementSibling;
      par.insertBefore(g, nx);
      g.appendChild(nx);
      if (cell && /^g$/i.test(cell.tagName)) g.appendChild(cell);
      return g;
    }
    function onTarget(e) {
      if (!e || e.detail === 0) return true;   // a click from the keyboard or VoiceOver: no place to aim
      if (onScene || E.skipView(sk, taps).anywhere) return true;   // nine claws in the log: a tap anywhere digs the next
      var nx = art.querySelector('.pc-next');
      if (!nx || !nx.getBoundingClientRect) return true;   // a picture with nothing to aim at: any tap counts
      var r = nx.getBoundingClientRect(), pr = panel.getBoundingClientRect();
      if (!r.width) return true;
      // both forepaws glowing together (chapter 4) may be two glows: either one, and between them
      var left = r.left, right = r.right;
      Array.prototype.forEach.call(art.querySelectorAll('.pc-next'), function (g) {
        var q = g.getBoundingClientRect();
        if (q.width) { left = Math.min(left, q.left); right = Math.max(right, q.right); }
      });
      var mx = r.width * 0.22;
      return e.clientX >= left - mx && e.clientX <= right + mx && e.clientY >= pr.top && e.clientY <= pr.bottom;
    }
    function wiggle() {
      var g = hopGroup();
      if (!g) return;
      g.classList.remove('wiggle'); void g.getBoundingClientRect(); g.classList.add('wiggle');
    }
    var lastTap = 0;
    function tap() {
      if (turning || now() - lastTap < 220) return;   // a double tap counts one cat, not two
      var before = E.skipView(sk, taps);
      if (before.done) return;
      taps++;
      lastTap = now();
      var v = draw(true);
      // (chapter 12: a Spanish count's newest number in the Spanish voice, or its English; at the end its gloss after it,
      // or with no Spanish voice the gloss alone: UI.voices.plan)
      speakItems([{ text: sk.lang === 'es' && v.gloss ? v.say + '\n(' + v.gloss + ')' : v.say || String(v.total), who: teacher }].concat(v.done && sk.done ? [{ text: fill(sk.done), who: teacher }] : []));
      if (v.done && (sk.done || v.wait)) {
        var nb = $('nextBtn');
        // (chapter 12: the Spanish count waits for Next, the only way on; a phone held sideways left it under the screen:
        // brought in, as chapter 9's f118 does; the paw counts of chapters 1 to 11 have no wait)
        if (nb && v.wait) { var nbb = nb.getBoundingClientRect().bottom, nvh = root.innerHeight || 0; if (nvh && nbb > nvh) root.scrollBy(0, nbb - nvh + 8); }
        if (nb) nb.focus({ preventScroll: true });
      }
      else if (v.done) {
        // the last hop turns the page: the next frame shows the number she just reached
        turning = true;
        later(function () { if (E.next(cat, story, now())) { persist(); go('frame', { fromSkip: true }); } }, save.settings.readAloud ? 1100 : 750);
      }
    }
    function advance() {
      // the tap that finished the count never also turns the page
      if (now() - renderedAt < 280 || now() - lastTap < 450) return;
      if (E.next(cat, story, now())) { persist(); go('frame'); }
    }
    panel.addEventListener('click', function (e) {
      if (turning || E.skipView(sk, taps).done) return;
      if (onTarget(e)) tap(); else wiggle();
    });
    relayoutFn = function () { draw(false); };
    draw(false);
    frameTap = tap;
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (e.target && e.target.id === 'countBtn') return;   // the button counts on its own click
        e.preventDefault();
        if (E.skipView(sk, taps).done) { if (sk.done || E.skipView(sk, taps).wait) advance(); } else tap();
      } else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
    };
    currentSpeech = caps.map(function (c) { return { text: c }; }).concat(intro.map(function (b) { return { text: b.text, who: b.who, variant: b.variant }; }))
      .concat(hint ? [{ text: hint }] : []);
    persist();
  }
  /* A page after a skip-count that keeps its totals: the count's picture, every group lit, the
   * running totals (5, 10, 15, 20, 25) under the groups. No faces to point balloons at. */
  function drawKept(panel, sk) {
    var v = E.skipView(sk, sk.groups);
    var po = E.keptPicture(sk);
    po.look = cat && cat.look;
    panel.querySelector('.art').innerHTML = artCall('countsPicture', po) || countsFallback(v.groups, v.per, v.highlight);
    var hs = [];
    hs.keep = [];
    return hs;
  }
  /* ---------------------------------------------------------------- chapter 5: the questions she taps out
   * `ask: { who, to, pairs: [[question, answer], …], next }` (Riffle's seven questions for the heron):
   * the frame's own scene, the asker glowing softly. A tap on him letters his next question in his
   * balloon and her answer in hers, and the scene is drawn again with one more owed (E.askScene: a
   * pair of fish in the thought cloud over the heron). The pairs before stay under the panel, small,
   * so all of them can be read back and the newest is always the big one. A tap anywhere else makes
   * him hop; Space, Enter and → ask the next; a hidden button does it for VoiceOver. No number is
   * shown and nothing is logged. After the last pair the frame shows Next. */
  var HALO = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="th-glow" cx="50" cy="50" r="46"/><circle class="th-ring" cx="50" cy="50" r="40"/></svg>';
  function renderAsk(f, id) {
    var ak = f.ask, taps = 0, lastTap = 0, spot = null, halo = null;
    var scr = $('screen');
    scr.innerHTML = frameShell('ask', id);
    var panel = $('panel');
    panel.classList.add('tappable');
    var caps = captionsOf(f), intro = balloonsOf(f), words = E.askWords(ak);
    var hint = words.prompt ? fill(words.prompt) : '';
    var base = E.resolveScene(f.scene, cat, stories());
    var ctx = null;
    function draw(fresh) {
      var v = E.askView(ak, taps), scene = E.askScene(base, ak, taps);
      var heads = drawArt(panel, { scene: scene }, cat.look);
      // the newest question and its answer, each with a tail to its speaker; before the first tap, the frame's own balloons
      var bs = v.pair ? [{ who: v.who, text: fill(v.pair[0]), kind: 'say' }, { who: v.to, text: fill(v.pair[1]), kind: 'say' }] : intro;
      // where the asker is: the art's own mark when the scene carries one, else his head
      var artEl = panel.querySelector('.art .pc-next, .art .pc-tap'), pr = panel.getBoundingClientRect(), h = headFor(heads, v.who, 0);
      spot = null;
      if (artEl && artEl.getBoundingClientRect && pr.width) {
        var r = artEl.getBoundingClientRect();
        if (r.width) spot = { x: (r.left + r.width / 2 - pr.left) / pr.width * 100, y: (r.top + r.height / 2 - pr.top) / pr.height * 100, reach: Math.max(r.width, r.height) / 2 / pr.width * 100, art: true };
      }
      if (!spot && h) spot = { x: h.x, y: h.y + h.r * 0.9, reach: h.r * 2.1 };
      if (!spot) spot = { x: 50, y: 60, reach: 12 };
      if (!v.done) heads.keep.push({ x: spot.x - 5, y: spot.y - 6, w: 10, h: 12 });
      ctx = { panel: panel, frame: { scene: scene, sfx: f.sfx || '', sfxAt: f.sfxAt }, heads: heads, caps: caps, balloons: bs };
      layoutText(ctx);
      // the soft glow on him, the page's own (it hops when she taps somewhere else), until he has asked them all
      var old = panel.querySelector('.tapspot'); if (old) old.remove();
      halo = null;
      if (!v.done && !spot.art) {
        halo = doc.createElement('div');
        halo.className = 'tapspot soft';
        halo.style.left = f1(spot.x) + '%'; halo.style.top = f1(spot.y) + '%'; halo.style.width = f1(tapGlow(spot.reach)) + '%';
        halo.innerHTML = HALO;
        panel.insertBefore(halo, panel.querySelector('.ov'));
      }
      panel.setAttribute('aria-label', (caps.length ? plain(caps.join(' ')) + ' ' : '') + (v.done ? '' : 'Touch ' + speakerName({ who: v.who }) + ' to hear the next question.'));
      // under the panel: what was asked before, small, oldest first; the instruction; Back, and Next at the end
      var before = v.before.map(function (p) { return '<li><q>' + rich(fill(p[0])) + '</q> <q class="a">' + rich(fill(p[1])) + '</q></li>'; }).join('');
      $('interact').innerHTML = (before ? '<ol class="asked" aria-label="Asked already">' + before + '</ol>' : '') +
        (hint && !v.done ? '<p class="prompt tapline">' + rich(hint) + '</p>' : '') + '<div class="next-row">' + backBottom() +
        (v.done ? '<button class="btn go big" id="nextBtn" type="button">Next <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
          : '<button class="sr" id="askBtn" type="button">' + esc(words.label) + '</button>') + '</div>';
      wireBackBottom();
      if ($('nextBtn')) $('nextBtn').addEventListener('click', advance);
      if ($('askBtn')) $('askBtn').addEventListener('click', function () { tap(); var b = $('askBtn'); if (b) b.focus({ preventScroll: true }); });
      return v;
    }
    function tap() {
      if (now() - lastTap < 260) return;   // a double tap asks one question, not two
      if (E.askView(ak, taps).done) return;
      taps++;
      lastTap = now();
      var v = draw(true);
      speakItems([{ text: fill(v.pair[0]), who: v.who }, { text: fill(v.pair[1]), who: v.to }]);
      if (v.done) {
        // (chapter 9's f118: six pairs with Aa on can leave Next below the screen, the only way on; bring it in as
        // the help's end brings in "Got it!")
        var nb = $('nextBtn');
        if (nb) {
          var nbb = nb.getBoundingClientRect().bottom, nvh = root.innerHeight || 0;
          if (nvh && nbb > nvh) root.scrollBy(0, nbb - nvh + 8);
          nb.focus({ preventScroll: true });
        }
      }
    }
    function hop() {
      if (halo) { halo.classList.remove('hop'); void halo.offsetWidth; halo.classList.add('hop'); return; }
      // the art's own glow (a cast member with `glow: true`): the glow and the one it is behind wiggle
      // together, as the glowing cat of a skip-count does when she taps somewhere else
      var nx = panel.querySelector('.art .pc-next');
      if (!nx || !nx.parentNode) return;
      var g = nx.parentNode;
      if (!(g.getAttribute && g.getAttribute('class') === 'pc-hop')) {
        var w = doc.createElementNS('http://www.w3.org/2000/svg', 'g'), cell = nx.nextElementSibling;
        w.setAttribute('class', 'pc-hop');
        g.insertBefore(w, nx);
        w.appendChild(nx);
        if (cell && /^g$/i.test(cell.tagName)) w.appendChild(cell);
        g = w;
      }
      g.classList.remove('wiggle'); void g.getBoundingClientRect(); g.classList.add('wiggle');
    }
    function advance() {
      // the tap that asked the last question never also turns the page
      if (now() - renderedAt < 280 || now() - lastTap < 600) return;
      if (E.next(cat, story, now())) { persist(); go('frame'); }
    }
    panel.addEventListener('click', function (e) {
      if (E.askView(ak, taps).done || now() - renderedAt < 280) return;
      var pr = panel.getBoundingClientRect();
      // a click from the keyboard or VoiceOver has no place to aim
      if (!e || e.detail === 0 || !pr.width || !spot || tapHit(pr.width, pr.height, spot, e.clientX - pr.left, e.clientY - pr.top, spot.reach)) tap(); else hop();
    });
    relayoutFn = function () { draw(false); };
    draw(false);
    frameTap = tap;
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (e.target && (e.target.id === 'askBtn' || e.target.id === 'nextBtn')) return;   // a button does it on its own click
        e.preventDefault();
        if (E.askView(ak, taps).done) advance(); else tap();
      } else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
    };
    currentSpeech = (ctx.reading || []).concat(hint ? [{ text: hint }] : []);
    persist();
  }
  function isTyping(e) {
    var t = e.target; if (!t) return false;
    var tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || t.isContentEditable || e.metaKey || e.ctrlKey || e.altKey;
  }

  /* ================================================================ chapter 4: the pages she taps, and her Case File
   * Three pages with something to tap and nothing to get wrong, each with a hidden button for
   * VoiceOver, and Space, Enter and → doing what a tap does:
   *   the bark Taps   `scratch: { cards | draws }` (renderScratch): blank curls of bark in a row, the
   *                   next one glowing; a tap scratches its picture in (a small "skritch"), letters
   *                   its line under it and gives her the card; the last tap turns the page;
   *   the glint       `scratch: { tap: 'glint' }` (renderGlint): the scene's glint pulses; a tap on it
   *                   makes it flare and turns the page; a tap anywhere else makes it twinkle;
   *   her Case File   `file` (renderFileFrame): its curl of bark appears in the top bar, glowing; a
   *                   tap on it opens the real screen, and closing it goes on with the story.
   * The Case File itself (openFile) lies over the page: closing it returns to the same frame; it
   * changes nothing and logs nothing. */
  var SPARK = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="ts-halo" cx="50" cy="50" r="40"/>' +
    '<path class="ts-star" d="M50 6 L58 42 L94 50 L58 58 L50 94 L42 58 L6 50 L42 42 Z"/><circle class="ts-core" cx="50" cy="50" r="7"/></svg>';
  /* Where the glint is, in percent of the panel: where the art drew it (the pile's own star of light,
   * `<g data-art="glint">`, whose box is a generous target; or any element of class pc-glint or
   * pc-tap), which then pulses, twinkles and flares itself (`el`); else the frame's own `at`; else
   * what the art says the picture is about (its first `keep` area); else the middle of the ground. */
  function tapSpot(panel, heads, sc) {
    // chapter 5: a picture may mark more than one thing to tap (the marsh's mud, and Riffle's pole):
    // the one named for this frame's tap (tapPick: `data-tap`, `pc-tap-NAME`, `data-art`), else the first
    var art = panel.querySelector('.art'), name = sc && sc.tap;
    var els = art ? Array.prototype.slice.call(art.querySelectorAll('[data-art="glint"], .pc-glint, .pc-tap, [data-tap]')) : [];
    var at = tapPick(els.map(function (e) { return { tap: e.getAttribute('data-tap'), art: e.getAttribute('data-art'), cls: e.getAttribute('class') }; }), name);
    var el = at >= 0 ? els[at] : null;
    if (el && el.getBoundingClientRect) {
      var r = el.getBoundingClientRect(), pr = panel.getBoundingClientRect();
      if (r.width && pr.width) {
        var spot = { x: clamp((r.left + r.width / 2 - pr.left) / pr.width * 100, 4, 96), y: clamp((r.top + r.height / 2 - pr.top) / pr.height * 100, 6, 94),
          el: el, reach: r.width / 2 / pr.width * 100 };
        // the art's own glint pulses, twinkles and flares itself; anything else it marks (a nose, a
        // tuft of fur, a patch of mud) gets the page's own soft glow, as big as the thing
        if (!(el.getAttribute('data-art') === 'glint' || /(^| )pc-glint( |$)/.test(el.getAttribute('class') || ''))) {
          spot.soft = true;
          spot.reach = Math.max(r.width, r.height) / 2 / pr.width * 100;
        }
        return spot;
      }
    }
    var soft = !!name && name !== 'glint';
    if (sc && sc.at && typeof sc.at.x === 'number' && typeof sc.at.y === 'number') return { x: sc.at.x, y: sc.at.y, soft: soft };
    var k = heads && heads.keep && heads.keep[0];
    if (k) return { x: k.x + k.w / 2, y: k.y + k.h / 2, soft: soft };
    return { x: 50, y: 58, soft: soft };
  }
  function renderGlint(f, id, ctx, box, panel) {
    var sc = f.scratch, tw = E.tapWords(f), turning = false, spot = ctx.tap || { x: 50, y: 58 };
    var hint = tw.prompt ? fill(tw.prompt) : '';
    // the instruction sits in the bottom row, where Next would be: the page stays one panel tall
    box.innerHTML = '<div class="next-row">' + backBottom() + (hint ? '<p class="prompt tapline">' + rich(hint) + '</p>' : '') +
      '<button class="sr" id="tapBtn" type="button">' + esc(tw.label) + '</button></div>';
    wireBackBottom();
    // the art's own glint, when it drew one (it pulses already); else a star of ours on the spot
    var el = spot.el || null;
    // chapter 5: anything else to tap glows softly with the page's own glow, on the thing itself
    var marks = el ? [el] : [], artBox = panel.querySelector('.art');
    if (!el || spot.soft) {
      var own = doc.createElement('div');
      own.className = 'tapspot' + (spot.soft ? ' soft' : sc.tap === 'glint' ? ' glint' : '');
      own.style.left = f1(spot.x) + '%'; own.style.top = f1(spot.y) + '%';
      if (spot.soft) own.style.width = f1(tapGlow(spot.reach)) + '%';
      own.innerHTML = spot.soft ? HALO : SPARK;
      panel.appendChild(own);
      marks.push(own);
      if (!el) el = own;
    }
    panel.classList.add('tappable');
    function flare() {
      if (turning || now() - renderedAt < 280) return;
      turning = true;
      marks.forEach(function (m) { m.classList.remove('twinkle'); m.classList.add('flare'); });
      if (artBox) artBox.classList.add('tap-hit');   // (the art may answer too: whiskers that jump, a snail's horns going in)
      // (she is still tapping: the next page waits a moment before a tap turns it, as after a skip-count)
      later(function () { if (E.next(cat, story, now())) { persist(); go('frame', { fromSkip: true }); } }, reduceMotion ? 380 : 700);
    }
    function twinkle() {
      if (turning) return;
      marks.forEach(function (m) { m.classList.remove('twinkle'); void m.getBoundingClientRect().width; m.classList.add('twinkle'); });
      // chapter 5: the small answer to a tap anywhere else ("snnnrrk…"), lettered small by the spot
      if (tw.miss) {
        var was = panel.querySelector('.tapmiss'); if (was) was.remove();
        var w = doc.createElement('div');
        w.className = 'tapmiss';
        w.setAttribute('aria-hidden', 'true');
        w.textContent = fill(tw.miss);
        w.style.left = f1(clamp(spot.x, 14, 86)) + '%'; w.style.top = f1(clamp(spot.y - 15, 5, 88)) + '%';
        panel.appendChild(w);
        setTimeout(function () { if (w.parentNode) w.remove(); }, reduceMotion ? 1500 : 1300);
      }
      if (artBox) { artBox.classList.remove('tap-miss'); void artBox.offsetWidth; artBox.classList.add('tap-miss'); }
    }
    // after a twinkle the glint goes back to its soft pulse
    marks.forEach(function (m) { m.addEventListener('animationend', function () { if (!turning) m.classList.remove('twinkle'); }); });
    panel.addEventListener('click', function (e) {
      var pr = panel.getBoundingClientRect();
      // a click from the keyboard or VoiceOver has no place to aim
      if (!e || e.detail === 0 || !pr.width || tapHit(pr.width, pr.height, spot, e.clientX - pr.left, e.clientY - pr.top, spot.reach)) flare(); else twinkle();
    });
    $('tapBtn').addEventListener('click', flare);
    frameTap = flare;
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (e.target && e.target.id === 'tapBtn') return;   // the button does it on its own click
        e.preventDefault(); flare();
      } else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
    };
    if (hint) ctx.reading.push({ text: hint });
  }

  /* The `file` frame, chapter 4's "Skritch": her Case File's curl of bark has appeared in the top
   * bar, glowing (updateBar). The instruction under the panel says to tap it, and that she can open
   * it any time; the tap opens the real screen, and closing it turns the page. A tap anywhere else
   * nudges the curl. */
  function renderFileFrame(f, id, ctx, box, panel) {
    var tw = E.tapWords(f), hint = tw.prompt ? fill(tw.prompt) : '';
    var openIt = function () {
      if (now() - renderedAt < 280 || fileState) return;
      openFile({ onClose: function () { if (E.next(cat, story, now())) { persist(); go('frame'); } } });
    };
    box.innerHTML = '<div class="next-row">' + backBottom() +
      (hint ? '<p class="prompt tapline">' + rich(hint) + ' <button class="tapicon" id="tapFile" type="button" tabindex="-1" aria-hidden="true">' + fileIcon() + '</button></p>' : '') +
      '<button class="sr" id="openFile" type="button">' + esc(tw.label) + '</button></div>';
    wireBackBottom();
    $('openFile').addEventListener('click', openIt);
    if ($('tapFile')) $('tapFile').addEventListener('click', openIt);
    fileTeach = openIt; frameTap = openIt;
    panel.classList.add('tappable');
    panel.addEventListener('click', function () { fileGot('nudge'); });
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (e.target && (e.target.id === 'openFile' || e.target.id === 'fileBtn')) return;
        e.preventDefault(); openIt();
      } else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
    };
    if (hint) ctx.reading.push({ text: hint });
  }

  /* The bark Taps: the pieces of bark take the panel, on the sand (or the frame's `ground`). The row
   * is the engine's (E.scratchPieces): a piece is scratched when she holds its card, so the row picks
   * up where she left it; coming Back to a row all scratched, there is only Next. */
  function renderScratch(f, id) {
    var sc = f.scratch, tw = E.tapWords(f), turning = false, drawn = false, fresh = null, lastTap = 0;
    var scr = $('screen');
    scr.innerHTML = frameShell('scratch', id);
    var panel = $('panel'), art = panel.querySelector('.art');
    panel.classList.add('bark-panel', 'tappable', 'ground-' + (/^[a-z]+$/.test(sc.ground || '') ? sc.ground : 'sand'));
    var caps = captionsOf(f), intro = balloonsOf(f);
    var hint = tw.prompt ? fill(tw.prompt) : '';
    $('colTop').innerHTML = caps.map(function (c) { return '<p class="caption">' + richN(c) + '</p>'; }).join('');
    $('stack').innerHTML = intro.map(function (b) { return stackBalloon(b); }).join('');
    function pieces() {
      var ps = E.scratchPieces(f, cat, story, stories());
      ps.forEach(function (p) { if (p.draws) p.done = drawn; });
      return ps;
    }
    function nextOf(ps) {
      for (var i = 0; i < ps.length; i++) if (!ps[i].head && !ps[i].done) return i;
      return -1;
    }
    var allDone = nextOf(pieces()) < 0;   // she has been here: every piece is scratched already
    function draw() {
      var ps = pieces(), nx = nextOf(ps), W = panel.clientWidth || 600;
      var fs = clamp(W * 0.026, 14.5, 21) * (save.settings.bigText ? 1.14 : 1) * (ps.length > 3 ? 0.92 : 1);
      panel.setAttribute('aria-label', ps.length === 1 ? 'A curl of bark on the sand.' + (nx >= 0 ? ' Touch it to scratch it.' : '')
        : cap1(numWord(ps.length)) + ' pieces of bark in a row.' + (nx >= 0 ? ' Touch the glowing one to scratch it.' : ''));
      art.innerHTML = '<div class="bark-row n' + ps.length + '" style="font-size:' + fs.toFixed(1) + 'px">' + ps.map(function (p, i) {
        // a card's line is lettered under it once it is scratched (the one curl of `draws` has none:
        // the frame it turns to gives the card, and says its line)
        var line = p.done && !p.draws && p.line ? fill(p.line) : '';
        return '<div class="bark' + (p.done ? ' done' : '') + (i === nx ? ' next' : '') + (p.id === fresh ? ' fresh' : '') + '" data-i="' + i + '">' +
          '<span class="bark-pic">' + (p.done ? cardSvg(p, { mark: p.draws ? false : undefined }) : cardSvg(null, { blank: true })) +
          (p.id === fresh ? '<i class="skritch" aria-hidden="true">skritch</i>' : '') + '</span>' +
          '<span class="bark-line">' + (line ? rich(line) : '') + '</span></div>';
      }).join('') + '</div>';
      var done = nx < 0;
      $('interact').innerHTML = (hint && !done ? '<p class="prompt tapline">' + rich(hint) + '</p>' : '') + '<div class="next-row">' + backBottom() +
        (done ? (allDone ? '<button class="btn go big" id="nextBtn" type="button">Next <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : '')
          : '<button class="sr" id="scratchBtn" type="button">' + esc(tw.label) + '</button>') +
        '</div><p class="sr" role="status" id="scratchSay"></p>';
      wireBackBottom();
      if ($('nextBtn')) $('nextBtn').addEventListener('click', advance);
      if ($('scratchBtn')) $('scratchBtn').addEventListener('click', function () { tap(); var b = $('scratchBtn'); if (b) b.focus({ preventScroll: true }); });
    }
    function advance() {
      if (now() - renderedAt < 280) return;
      if (E.next(cat, story, now())) { persist(); go('frame'); }
    }
    function tap() {
      if (turning || now() - lastTap < 220) return;   // a double tap scratches one piece, not two
      var ps = pieces(), nx = nextOf(ps);
      if (nx < 0) return;
      lastTap = now();
      var p = ps[nx], line = '';
      if (p.draws) drawn = true;
      else {
        E.scratchTap(cat, story, now());
        persist();
        line = p.line ? fill(p.line) : '';
        if (E.hasFile(cat)) fileGot();   // a later chapter's row: each card is seen to go into her file
      }
      fresh = p.id;
      draw();
      fresh = null;
      if (line) { var sayEl = $('scratchSay'); if (sayEl) sayEl.textContent = plain(line); speakItems([{ text: line, who: 'player' }]); }
      if (nextOf(pieces()) < 0) {
        // the last tap turns the page, once she has seen what she scratched
        turning = true;
        later(function () { if (E.next(cat, story, now())) { persist(); go('frame', { fromSkip: true }); } }, line ? (save.settings.readAloud ? 2400 : 1500) : 950);
      }
    }
    function wiggle() {
      var el = art.querySelector('.bark.next');
      if (!el) return;
      el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle');
    }
    panel.addEventListener('click', function (e) {
      if (turning) return;
      var el = art.querySelector('.bark.next');
      if (!el) return;
      var r = el.getBoundingClientRect();
      // a generous target: the glowing piece and a margin around it
      var hit = !e || e.detail === 0 || !r.width || (e.clientX >= r.left - r.width * 0.18 && e.clientX <= r.right + r.width * 0.18 && e.clientY >= r.top - r.height * 0.12 && e.clientY <= r.bottom + r.height * 0.12);
      if (hit) tap(); else wiggle();
    });
    relayoutFn = function () { if (!turning) draw(); };
    draw();
    frameTap = tap;
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (e.target && (e.target.id === 'scratchBtn' || e.target.id === 'nextBtn')) return;   // a button does it on its own click
        e.preventDefault();
        if (nextOf(pieces()) < 0) { if (allDone) advance(); } else tap();
      } else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
    };
    currentSpeech = caps.map(function (c) { return { text: c }; }).concat(intro.map(function (b) { return { text: b.text, who: b.who, variant: b.variant }; }))
      .concat(hint ? [{ text: hint }] : []);
    persist();
  }

  /* ---------------------------------------------------------------- the Case File's screen
   * "{name}paw’s Case File", over the page: her cards on moss in two groups, side by side (one above
   * the other on a narrow screen, the claims first), each in the order found, each card with its
   * picture, its mark and its line; a tap on a card shows it large, with what its mark means. Two
   * cards she has linked are drawn touching, across the groups, over the link's line. Read to me
   * reads the lines (and, on a card shown large, its mark's meaning). */
  var MARK = {
    eye: '<svg viewBox="0 0 40 28" aria-hidden="true"><path d="M3 14 Q20 -4 37 14 Q20 32 3 14 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M20 6 V22" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/></svg>',
    ear: '<svg viewBox="0 0 40 28" aria-hidden="true"><path d="M8 26 L20 2 L32 26 Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M20 26 V15" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>'
  };
  // the mark beside a heading or a line of words: the art's own, the very strokes her cards carry
  // (PC.art.cardMark), so the legend shows the mark she scratched; ours stands in without the art
  function markSvg(mark) { return artCall('cardMark', mark) || MARK[mark] || ''; }
  function openFile(o) {
    o = o || {};
    if (!cat || fileState) return;
    stopSpeech();
    fileState = { at: o.quiet ? 0 : now(), onClose: o.onClose || null, card: o.card || null, restore: doc.activeElement };
    // chapter 10: the pick screen (o.pick, the pick frame's page) is her file in pick mode, drawn by the card pick's section
    if (o.pick) { fileState.pick = o.pick; drawPick(false); } else drawFile();
    $('file').hidden = false;
    // (a pick screen opens at its top: drawPick's scroll to the top is lost while the file is hidden, and WebKit puts
    // back the scroll the last Case File screen was left at)
    if (o.pick) $('file').scrollTop = 0;
    doc.documentElement.classList.add('file-open');   // the page behind it stays put
  }
  /* Close it: back to the same frame, nothing changed (`silent`: the page is changing anyway). */
  function closeFile(silent) {
    var st = fileState, el = $('file');
    if (!st) return;
    fileState = null;
    // (a pick screen leaves no scroll behind it, for the next claim or the plain Case File after it)
    if (st.pick) el.scrollTop = 0;
    el.hidden = true; el.innerHTML = '';
    doc.documentElement.classList.remove('file-open');
    stopSpeech();
    if (silent) return;
    if (st.onClose) st.onClose();
    else if (st.restore && st.restore.focus) { try { st.restore.focus({ preventScroll: true }); } catch (e) {} }
  }
  function fileKey(e) {
    if (fileState.pick) { if (e.key === 'Escape' || e.key === 'ArrowLeft') { e.preventDefault(); if (!fileState.pending) closeFile(); } return; }
    if (e.key === 'Escape' || (e.key === 'ArrowLeft' && fileState.card)) {
      e.preventDefault();
      if (fileState.card) { fileState.card = null; drawFile(); } else closeFile();
    }
  }
  function fileCard(c, o) {
    var line = fill(c.line), pk = o && o.pick === true;   // (the plain file's .map(fileCard) passes an index here)
    return '<button class="cf-card ' + c.mark + '" type="button" data-card="' + esc(c.id) + '"' + (pk ? ' id="pickcard-' + esc(c.id) + '"' + (o.dim ? ' aria-disabled="true"' : '') : '') +
      ' aria-label="' + esc(plain(line) + ' ' + E.markMeans(c.mark) + (pk ? ' Pick this card.' : '')) + '">' +
      '<span class="cf-pic" aria-hidden="true">' + cardSvg(c) + '</span><span class="cf-line" aria-hidden="true">' + rich(line) + '</span></button>';
  }
  function drawFile() {
    var el = $('file'), st = fileState, F = E.caseFile(cat, stories()), all = [], speech = [], html;
    F.groups.forEach(function (g) { all = all.concat(g.cards); });
    F.links.forEach(function (l) { all = all.concat(l.cards); });
    var big = st.card ? all.filter(function (c) { return c.id === st.card; })[0] : null;
    var close = '<button class="btn cf-close" id="fileClose" type="button">Close</button>';
    if (st.card && !big) st.card = null;
    if (big) {
      var line = fill(big.line), means = E.markMeans(big.mark);
      html = '<div class="cf-in big"><div class="cf-head"><button class="btn cf-back" id="fileBack" type="button">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg> My cards</button>' + close + '</div>' +
        '<div class="cf-bigcard" id="fileBig"><span class="cf-bigpic" aria-hidden="true">' + cardSvg(big, { big: true }) + '</span>' +
        '<p class="cf-bigline">' + rich(line) + '</p>' +
        '<p class="cf-means ' + big.mark + '"><i class="cf-mark" aria-hidden="true">' + markSvg(big.mark) + '</i>' + esc(means) + '</p></div></div>';
      speech = [{ text: line }, { text: means }];
    } else {
      var shown = F.groups.filter(function (g) { return g.cards.length; });
      speech.push({ text: F.title + '.' });
      var groups = shown.map(function (g) {
        speech.push({ text: g.title.replace(/[()]/g, ',') + ':' });
        g.cards.forEach(function (c) { speech.push({ text: fill(c.line) }); });
        return '<section class="cf-group ' + g.mark + '" aria-label="' + esc(g.title) + '"><h3 class="cf-h"><i class="cf-mark" aria-hidden="true">' + markSvg(g.mark) + '</i>' + esc(g.title) + '</h3>' +
          '<div class="cf-cards">' + g.cards.map(fileCard).join('') + '</div></section>';
      }).join('');
      // two cards she has linked: drawn touching, across the groups, over the link's line
      // (chapter 5: three in a row when one card touches two, a line for each join, the first under
      // the left pair and the second under the right; and several such lots, side by side where there is room.
      // Chapter 8: a row of four, three joins: the first kept left (`j0`), the last kept right (`j1`), the one
      // between them centred (`jm`), so each line still reads under its own join; a row of three is as it was)
      var links = F.links.map(function (l) {
        var joins = l.lines || [l.line];
        var side = function (i) { return i === 0 ? 'j0' : i === joins.length - 1 ? 'j1' : 'jm'; };
        l.cards.forEach(function (c) { speech.push({ text: fill(c.line) }); });
        joins.forEach(function (t) { speech.push({ text: fill(t) }); });
        if (joins.length > 1) {
          return '<section class="cf-link row" aria-label="' + esc(plain(joins.map(fill).join(' '))) + '"><div class="cf-pair n' + l.cards.length + '">' + l.cards.map(fileCard).join('') + '</div>' +
            joins.map(function (t, i) { return '<p class="cf-linkline ' + side(i) + '">' + rich(fill(t)) + '</p>'; }).join('') + '</section>';
        }
        return '<section class="cf-link" aria-label="' + esc(plain(fill(l.line))) + '"><div class="cf-pair">' + l.cards.map(fileCard).join('') + '</div>' +
          '<p class="cf-linkline">' + rich(fill(l.line)) + '</p></section>';
      });
      links = links.length > 1 ? '<div class="cf-links">' + links.join('') + '</div>' : links.join('');
      html = '<div class="cf-in"><div class="cf-head"><h2 class="cf-title' + ((E.clanName(cat) || E.displayName(cat)).length > 12 ? ' long' : '') + '" id="fileTitle">' + esc(F.title) + '</h2>' + close + '</div>' +
        (F.count ? '<div class="cf-groups' + (shown.length < 2 ? ' one' : F.links.length ? ' linked' : '') + (F.links.length > 1 ? ' many' : '') + '">' + groups + links + '</div>'
          : '<p class="cf-none">No cards yet.</p>') + '</div>';
    }
    el.innerHTML = html;
    el.setAttribute('aria-label', F.title);
    el.scrollTop = 0;
    $('fileClose').addEventListener('click', function () { closeFile(); });
    if ($('fileBack')) $('fileBack').addEventListener('click', function () { st.card = null; drawFile(); });
    if ($('fileBig')) $('fileBig').addEventListener('click', function () { st.card = null; drawFile(); });
    Array.prototype.forEach.call(el.querySelectorAll('[data-card]'), function (b) {
      b.addEventListener('click', function () { st.card = b.getAttribute('data-card'); drawFile(); });
    });
    var first = big ? $('fileBack') : $('fileClose');
    if (first) { try { first.focus({ preventScroll: true }); } catch (e) {} }
    speakItems(speech);
  }

  /* ---------------------------------------------------------------- the card pick (chapter 10)
   * `pick` (E.pickJudge): Reynard's claim, answered with a card from her Case File. On the frame, the
   * instruction under the panel with the file's curl as its tap icon, Back, and a hidden button; a tap
   * on the panel or the icon, the top bar's Case File button (it glows here, as on a `file` frame), or
   * Space, Enter or → opens the pick screen: her Case File's own screen (#file) in pick mode. Its head
   * is the claim strip (his balloon, its word lit gold; under it, once she has picked wrong, Tallyheart's
   * whispered nudge, the newest only), which stays at the top as she scrolls; its body is her whole file
   * laid out as drawFile lays it, every card face up and a button (fileCard). A right pick pops and turns
   * the page 900 ms later (at once with reduced motion), every tap and key ignored till then
   * (fileState.pending); a wrong one wiggles and nudges; after three the right cards she holds glow and
   * the rest are dimmed (a tap on one makes the glowing ones wiggle). Back, Escape or ← closes it, the
   * wrong picks and the openings kept while she is on the frame (the page's, never saved). The mode's
   * class goes on the .cf-in this section writes, never on #file (which lives for the whole session).
   * Read to me and the live region say PC.ui.pickPage's `speech` and `said`. */
  var pickState = null;   // the pick frame on the page: { at, f, wrongs, opened, nudge, dimmed, last, view }
  var PICK_TURN_MS = 900, PICK_WIGGLE_MS = 600;
  function renderPickFrame(f, id, ctx, box, panel, nextBtn) {
    var pw = E.pickWords(f), hint = pw.prompt ? fill(pw.prompt) : '';
    pickState = { at: story.id + ':' + id, f: f, wrongs: 0, opened: 0, nudge: null, dimmed: false, last: null, view: null };
    // the guard (a data slip the story test rules out): her file shows no card, so there is nothing to
    // pick, and Next follows the pick's `next` (E.next's one pick branch)
    if (!E.cards(cat, stories()).length) {
      var adv = function () {
        if (now() - renderedAt < 280) return;
        if (E.next(cat, story, now(), stories())) { persist(); go('frame'); }
      };
      nextBtn('Next', adv);
      panel.classList.add('tappable');
      panel.addEventListener('click', adv);
      keyHandler = function (e) {
        if (isTyping(e)) return;
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); adv(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
      };
      return;
    }
    var openIt = function () {
      if (now() - renderedAt < 280 || fileState) return;
      openPick(false);
    };
    box.innerHTML = '<div class="next-row">' + backBottom() +
      (hint ? '<p class="prompt tapline">' + rich(hint) + ' <button class="tapicon" id="tapPick" type="button" tabindex="-1" aria-hidden="true">' + fileIcon() + '</button></p>' : '') +
      '<button class="sr" id="openPick" type="button">' + esc(pw.label) + '</button></div>';
    wireBackBottom();
    $('openPick').addEventListener('click', openIt);
    if ($('tapPick')) $('tapPick').addEventListener('click', openIt);
    fileTeach = openIt; frameTap = openIt;
    panel.classList.add('tappable');
    panel.addEventListener('click', openIt);
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (e.target && (e.target.id === 'openPick' || e.target.id === 'fileBtn')) return;   // a button does it on its own click
        e.preventDefault(); openIt();
      } else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
    };
    if (hint) ctx.reading.push({ text: hint });
  }
  /* The pick screen over the page (openFile's pick mode); closed, the frame's speech and focus come back. */
  function openPick(quiet) {
    var ps = pickState;
    if (!ps || !cat || fileState || E.currentFrame(cat, story) !== ps.f) return false;
    ps.opened++;
    ps.dimmed = false;
    ps.view = E.pickView(ps.f, cat, stories());
    var frameSpeech = currentSpeech, was = doc.activeElement;
    openFile({ pick: ps, quiet: !!quiet, onClose: function () {
      currentSpeech = frameSpeech;
      var b = was && was.isConnected && was !== doc.body ? was : $('openPick');
      if (b && b.focus) { try { b.focus({ preventScroll: true }); } catch (e) {} }
    } });
    // (focus once the screen is shown: openFile unhides #file after drawing it)
    var fc = fileState && fileState.pick && $('fileClose');
    if (fc) { try { fc.focus({ preventScroll: true }); } catch (e) {} }
    // (reopened after the glow, at its top: a glowing card brought into sight)
    if (fc && ps.wrongs >= E.PICK_GLOW) pickShowGlow();
    return !!(fileState && fileState.pick);
  }
  function pickSpeech(items) {
    return (items || []).map(function (it) { var o = { text: fill(it.text) }; if (it.who) o.who = it.who; if (it.kind) o.kind = it.kind; return o; });
  }
  // the claim with its one word in capitals lit
  function pickClaim(text, word) {
    var i = word ? text.indexOf(word) : -1;
    if (i < 0) return rich(fill(text));
    return rich(fill(text.slice(0, i))) + '<b class="pick-lit">' + esc(word) + '</b>' + rich(fill(text.slice(i + word.length)));
  }
  function drawPick(again) {
    var el = $('file'), st = fileState, ps = st.pick, v = ps.view, F = v.file;
    var page = UI.pickPage(v, ps.wrongs, ps.nudge, ps.opened, ps.dimmed), state = {};
    page.cards.forEach(function (c) { state[c.id] = c; });
    var card = function (c) { return fileCard(c, { pick: true, dim: !!(state[c.id] && state[c.id].dim) }); };
    var glowing = page.cards.some(function (c) { return c.glow; });
    var shown = F.groups.filter(function (pg) { return pg.cards.length; });
    // her whole file as drawFile lays it (its classes, so the Case File's own rules reach this screen as they are)
    var groups = shown.map(function (pg) {
      return '<section class="cf-group ' + pg.mark + '" aria-label="' + esc(pg.title) + '"><h3 class="cf-h"><i class="cf-mark" aria-hidden="true">' + markSvg(pg.mark) + '</i>' + esc(pg.title) + '</h3>' +
        '<div class="cf-cards">' + pg.cards.map(card).join('') + '</div></section>';
    }).join('');
    var links = F.links.map(function (l) {
      var joins = l.lines || [l.line];
      var side = function (i) { return i === 0 ? 'j0' : i === joins.length - 1 ? 'j1' : 'jm'; };
      if (joins.length > 1) {
        return '<section class="cf-link row" aria-label="' + esc(plain(joins.map(fill).join(' '))) + '"><div class="cf-pair n' + l.cards.length + '">' + l.cards.map(card).join('') + '</div>' +
          joins.map(function (t, i) { return '<p class="cf-linkline ' + side(i) + '">' + rich(fill(t)) + '</p>'; }).join('') + '</section>';
      }
      return '<section class="cf-link" aria-label="' + esc(plain(fill(l.line))) + '"><div class="cf-pair">' + l.cards.map(card).join('') + '</div>' +
        '<p class="cf-linkline">' + rich(fill(l.line)) + '</p></section>';
    });
    links = links.length > 1 ? '<div class="cf-links">' + links.join('') + '</div>' : links.join('');
    // the head: the claim strip (his balloon, its word lit), the newest nudge under it (her whisper from Tallyheart), and Back
    var strip = '<div class="pick-strip"><div class="pick-claim" role="heading" aria-level="2" id="fileTitle">' + stackBalloon({ who: page.strip.who, html: pickClaim(page.strip.text, page.strip.word) }) + '</div>' +
      (page.nudge ? '<div class="pick-nudge">' + stackBalloon({ who: page.nudge.who, text: fill(page.nudge.text), kind: 'whisper' }) + '</div>' : '') + '</div>';
    var y = again ? el.scrollTop : 0;
    el.innerHTML = '<div class="cf-in picking' + (glowing ? ' glowing' : '') + '"><div class="cf-head">' + strip + '<button class="btn cf-close" id="fileClose" type="button">Back</button></div>' +
      '<div class="cf-groups' + (shown.length < 2 ? ' one' : F.links.length ? ' linked' : '') + (F.links.length > 1 ? ' many' : '') + '">' + groups + links + '</div>' +
      '<p class="sr" id="pickSay" role="status" aria-live="polite"></p></div>';
    el.setAttribute('aria-label', 'Pick a card');
    el.scrollTop = y;
    $('fileClose').addEventListener('click', function () { if (fileState && !fileState.pending) closeFile(); });
    Array.prototype.forEach.call(el.querySelectorAll('[data-card]'), function (b) {
      b.addEventListener('click', function () { pickTapCard(b.getAttribute('data-card'), false); });
    });
    currentSpeech = pickSpeech(page.speech);
    if (!again) {
      var first = $('fileClose');
      if (first) { try { first.focus({ preventScroll: true }); } catch (e) {} }
      speakItems(currentSpeech);
    }
  }
  // (lit a moment as it wiggles, so with reduced motion, where nothing wiggles, the card still answers)
  function pickWiggle(list) {
    list.forEach(function (b) {
      if (!b) return;
      b.classList.remove('pick-wiggle'); void b.offsetWidth; b.classList.add('pick-wiggle');
      clearTimeout(b.pcWiggle);
      b.pcWiggle = later(function () { b.classList.remove('pick-wiggle'); }, PICK_WIGGLE_MS + 100);
    });
  }
  /* After the glow, a glowing card in sight: when no glowing card shows half its picture between the strip and the screen's
   * foot (her file is long, and she picked wrong far from them), her file slides till the first in her file's order sits
   * just under the strip (at once with reduced motion), so the glow, and a dimmed card's answer, are never all off the screen. */
  function pickShowGlow() {
    var el = $('file'), hd = el.querySelector('.cf-in.glowing .cf-head');
    if (!hd || !fileState || !fileState.pick || fileState.pending) return;
    var top = hd.getBoundingClientRect().bottom, foot = Math.min(el.getBoundingClientRect().bottom, root.innerHeight || Infinity);
    var lit = Array.prototype.slice.call(el.querySelectorAll('.cf-card:not([aria-disabled="true"])'));
    var seen = lit.some(function (b) { var r = b.querySelector('.cf-pic').getBoundingClientRect(); return Math.min(r.bottom, foot) - Math.max(r.top, top) >= r.height / 2; });
    if (!lit.length || seen) return;
    var y = el.scrollTop + lit[0].getBoundingClientRect().top - top - 12;
    try { el.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) { el.scrollTop = y; }
  }
  /* What the newest pick says: Read to me cuts in with it (any tap stops what was being read), and the
   * live region is emptied and given it 100 ms later, so a polite region reads a repeat too. */
  function pickSay(said) {
    var items = pickSpeech(said), live = $('pickSay');
    stopSpeech();
    speakItems(items);
    if (live) live.textContent = '';
    later(function () { var l = $('pickSay'); if (l) l.textContent = items.map(function (it) { return plain(it.text); }).join(' '); }, 100);
  }
  /* A tap on a card (`direct`: PC.debug.pick, past the tap guards). Returns true on a right pick. */
  function pickTapCard(id, direct) {
    var st = fileState, ps = st && st.pick;
    if (!ps || st.pending) return false;
    var el = $('file'), btn = $('pickcard-' + id);
    // the card she just picked wrong, tapped again while it wiggles: no new pick; it wiggles again and the nudge stays
    if (!direct && ps.last && ps.last.id === id && now() - ps.last.at < PICK_WIGGLE_MS) { pickWiggle([btn]); return false; }
    var r = E.pick(cat, story, id, now(), ps.wrongs, stories());
    fileState.at = now();   // a double tap picks one card, not two
    if (!r) {
      // after the glow, a dimmed card is no pick and gets no nudge: the glowing ones wiggle, and their lines are said again
      if (ps.wrongs < E.PICK_GLOW) return false;
      ps.dimmed = true;
      pickShowGlow();
      pickWiggle(Array.prototype.slice.call(el.querySelectorAll('.cf-card:not([aria-disabled="true"])')));
      pickSay(UI.pickPage(ps.view, ps.wrongs, ps.nudge, ps.opened, true).said);
      return false;
    }
    if (r.right) {
      // the flag and the landing are saved at the tap; the screen holds still till the page turns
      st.pending = true;
      persist();
      stopSpeech();
      var inner = el.querySelector('.cf-in');
      if (inner) inner.classList.add('picked');
      if (btn) {
        // the pop grows toward the free side: a card just under the strip grows down, one at the screen's foot grows up,
        // so its mark never goes under the strip or off the screen at the pop's peak (1.14, 7% each side)
        var br = btn.getBoundingClientRect(), hdr = el.querySelector('.cf-head'), mg = br.height * 0.07;
        btn.style.transformOrigin = hdr && br.top - mg < hdr.getBoundingClientRect().bottom ? '50% 0' : br.bottom + mg > (root.innerHeight || Infinity) ? '50% 100%' : '';
        btn.classList.add('pick-right');
      }
      var turn = function () { closeFile(true); go('frame'); };
      if (reduceMotion) turn(); else later(turn, PICK_TURN_MS);
      return true;
    }
    ps.wrongs = r.wrongs; ps.nudge = r.line; ps.dimmed = false; ps.last = { id: id, at: now() };
    var y0 = btn ? btn.getBoundingClientRect().top : null;
    var hd0 = el.querySelector('.cf-head'), hb0 = hd0 ? hd0.getBoundingClientRect().bottom : 0;
    drawPick(true);
    // the card stays where she tapped it (the nudge under the claim makes the head taller)
    var nb = $('pickcard-' + id);
    if (nb && y0 != null) el.scrollTop += nb.getBoundingClientRect().top - y0;
    // unless the taller strip would cover it: then it moves down by the part the strip would cover, at most the strip's
    // growth, so its picture and its mark (the wrong pick's feedback) stay in view while it wiggles
    var hd1 = el.querySelector('.cf-head');
    if (nb && hd1) {
      var hb1 = hd1.getBoundingClientRect().bottom, under = Math.min(hb1 - hb0, hb1 + 4 - nb.getBoundingClientRect().top);
      if (under > 0) el.scrollTop -= under;
    }
    if (nb) { try { nb.focus({ preventScroll: true }); } catch (e) {} }
    pickWiggle([nb]);
    pickSay(UI.pickPage(ps.view, ps.wrongs, ps.nudge, ps.opened, false).said);
    // the third: once her card has wiggled, a glowing card brought into sight
    if (ps.wrongs >= E.PICK_GLOW) later(pickShowGlow, PICK_WIGGLE_MS);
    return false;
  }

  /* ---------------------------------------------------------------- inputs */
  function renderInput(f, id, box, ctx) {
    var inp = f.input, kind = inp.kind;
    // chapter 11: her own warrior ending, typed after her first part (a page of its own, with refusals in place)
    if (kind === 'ending') return renderEnding(f, id, box, ctx);
    var sugg = (inp.suggestions || []).map(fill);
    var html = '';
    if (kind === 'petname') {
      html = '<p class="prompt">Pick one, or type your own.</p>' +
        '<div class="chips" role="group" aria-label="Pet names">' + sugg.map(function (s) { return '<button class="chip" type="button" aria-pressed="false" data-v="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>' +
        '<input class="field" id="inp" type="text" maxlength="' + E.PET_MAX + '" placeholder="Or type your own…" autocomplete="off" autocorrect="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" aria-label="Your pet name">' +
        '<div class="preview" id="preview" aria-live="polite"></div>' +
        '<div class="row end">' + backBottom() + '<button class="btn go big" id="okBtn" type="button" disabled>That’s me!</button></div>';
    } else if (kind === 'clanname') {
      html = '<p class="prompt">Type the first part of your Clan name.</p>' +
        '<input class="field" id="inp" type="text" maxlength="20" placeholder="Like Moon, or Fern…" autocomplete="off" autocorrect="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" aria-label="The first part of your Clan name">' +
        '<div class="preview" id="preview" aria-live="polite"></div>' +
        '<div class="row"><button class="btn quiet" id="ideasBtn" type="button" aria-expanded="false">Ideas?</button></div>' +
        '<div class="chips" id="ideas" hidden>' + sugg.map(function (s) { return '<button class="chip" type="button" aria-pressed="false" data-v="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>' +
        '<div class="row end">' + backBottom() + '<button class="btn go big" id="okBtn" type="button" disabled>That’s my name!</button></div>';
    } else {
      html = '<textarea class="field" id="inp" maxlength="' + E.DREAM_MAX + '" placeholder="' + esc(inp.placeholder ? fill(inp.placeholder) : 'Otters… a giant fish…') + '" aria-label="Your dream" enterkeyhint="done"></textarea>' +
        '<p class="hint">You can skip this. It goes in your book.</p>' +
        '<div class="row end">' + backBottom() + '<button class="btn quiet" id="skipBtn" type="button">Skip</button><button class="btn go big" id="okBtn" type="button" disabled>Put it in my book</button></div>';
    }
    box.innerHTML = '<div class="look">' + html + '</div>';
    wireBackBottom();
    var field = $('inp'), ok = $('okBtn'), preview = $('preview');
    // what she typed before, for Back (each chapter keeps its own dream)
    var prev = kind === 'petname' ? cat.petname : kind === 'clanname' ? cat.name : kind === 'dream' ? E.dreamOf(cat, story.id) : '';
    if (prev) field.value = prev;
    var sync = function () {
      var v = field.value;
      ok.disabled = kind === 'dream' ? !v.trim() : !E.hasLetter(v);
      Array.prototype.forEach.call(box.querySelectorAll('.chip'), function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-v') === v.trim() ? 'true' : 'false'); });
      if (preview && kind === 'clanname') {
        preview.innerHTML = E.hasLetter(v) ? '<small>You will be:</small>' + esc(E.cleanClanName(v)) + 'paw' : '<small>You will be:</small>…paw';
      } else if (preview) {
        // the name as it will be used, so a long one is never cut short by surprise
        preview.innerHTML = E.hasLetter(v) ? '<small>Waffles will call you:</small>' + esc(E.cleanPetName(v)) : '';
      }
    };
    field.addEventListener('input', sync);
    field.addEventListener('focus', function () { later(function () { try { field.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {} }, 300); });
    Array.prototype.forEach.call(box.querySelectorAll('.chip'), function (c) {
      c.addEventListener('click', function () { field.value = c.getAttribute('data-v'); sync(); ok.focus(); });
    });
    var ideas = $('ideasBtn');
    if (ideas) ideas.addEventListener('click', function () {
      var list = $('ideas'); list.hidden = !list.hidden; ideas.setAttribute('aria-expanded', list.hidden ? 'false' : 'true');
    });
    var submit = function (val) {
      if (E.submitInput(cat, story, val, now())) { persist(); go('frame'); }
    };
    ok.addEventListener('click', function () { if (!ok.disabled) submit(field.value); });
    var skip = $('skipBtn');
    if (skip) skip.addEventListener('click', function () { submit(''); });
    field.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !ok.disabled) { e.preventDefault(); if (!e.repeat) submit(field.value); }
    });
    sync();
    keyHandler = function (e) { if (!isTyping(e) && e.key === 'ArrowLeft') onBack(); };
  }

  /* The Type screen (chapter 11; docs/chapters/11-the-warrior-ceremony.spec.md, section 6): her first part, then the
   * field, one row (the field wraps under her first part where the row does not fit); the live preview; "That’s my
   * name!", always enabled. A refusal is a balloon by its speaker on this panel (the clan line's by the Clan cat
   * whose name it is), after the frame's own and replacing any earlier one, laid out as the page lays out every
   * balloon; what she typed stays, selected, and a tap within the double-tap guard of a refusal is ignored, so
   * she always sees the real reason. Read to me says the prompt, and a refusal at once when it is on. */
  function renderEnding(f, id, box, ctx) {
    var inp = f.input, first = cat.name || '';
    box.innerHTML = '<div class="look">' +
      '<p class="prompt">' + esc(ENDING_PROMPT) + '</p>' +
      '<div class="ending-row"><span class="ending-name">' + esc(first) + '</span>' +
      '<input class="field" id="inp" type="text" maxlength="30"' + (inp.placeholder ? ' placeholder="' + esc(fill(inp.placeholder)) + '"' : '') +
      ' autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="done" aria-label="' + esc('Your new ending, after ' + first) + '"></div>' +
      '<div class="preview ending-preview" id="preview" aria-live="polite"></div>' +
      '<div class="row end">' + backBottom() + '<button class="btn go big" id="okBtn" type="button">That’s my name!</button></div>' +
      '</div>';
    wireBackBottom();
    var field = $('inp'), ok = $('okBtn'), preview = $('preview');
    // her ending again, only when she typed it (an offered one is never handed back as hers)
    var pre = endingPrefill(cat);
    if (pre) field.value = pre;
    // (the preview's words are UI.ending.preview's; her name may break between its two halves, as everywhere)
    var sync = function () {
      var e = E.cleanEnding(endingValue(cat, field.value), cat);
      preview.innerHTML = '<small>You will be:</small>' + esc(first) + '<wbr>' + esc(e || '…');
    };
    var refusedAt = -1e9, quietFocus = false;
    var submit = function () {
      if (now() - refusedAt < UI_GUARD_MS) return;
      var raw = endingValue(cat, field.value), no = endingRefusal(inp, cat, raw);
      if (!no) { if (E.submitInput(cat, story, raw, now())) { persist(); go('frame'); } return; }
      refusedAt = now();
      var cast = (f.scene && f.scene.cast) || [];
      var member = cast.filter(function (c) { return c && c.who === no.who; })[0];
      var b = { who: no.who, text: no.text, kind: 'say', nth: 0, variant: member && member.variant, refusal: true };
      ctx.balloons = (ctx.balloons || []).filter(function (x) { return !x.refusal; }).concat(no.text ? [b] : []);
      relayoutFn = function () { layoutText(ctx); };
      layoutText(ctx);
      currentSpeech = (ctx.reading || []).concat([{ text: ENDING_PROMPT }]);
      // the field keeps the focus, what she typed selected, so her next keystroke replaces it
      quietFocus = true;
      try { field.focus({ preventScroll: true }); } catch (e) { field.focus(); }
      quietFocus = false;
      try { field.select(); } catch (e) {}
      // the balloon in view (the keyboard may be up): the last balloon, in the panel or under it
      var els = ctx.panel.querySelectorAll('.ov .btext'), stackEls = $('stack') ? $('stack').querySelectorAll('.sbrow') : [];
      var el = lastLayout && lastLayout.balloons === 'stack' ? stackEls[stackEls.length - 1] : els[els.length - 1];
      if (el && el.scrollIntoView) { try { el.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {} }
      if (no.text && save.settings.readAloud) speakItems([{ text: no.text, who: b.who, variant: b.variant }]);
    };
    field.addEventListener('input', sync);
    field.addEventListener('focus', function () {
      if (quietFocus) return;
      later(function () { try { field.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {} }, 300);
    });
    ok.addEventListener('click', function () { submit(); });
    field.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!e.repeat) submit(); }
    });
    sync();
    if (ctx.reading) ctx.reading.push({ text: ENDING_PROMPT });
    keyHandler = function (e) { if (!isTyping(e) && e.key === 'ArrowLeft') onBack(); };
  }

  /* ---------------------------------------------------------------- the reflection chooser */
  function renderLook(f, id, box, ctx) {
    var L = lookOptions();
    var groups = [
      { k: 'sex', title: 'She-cat or tom?' },
      { k: 'fur', title: 'Your fur' },
      { k: 'marking', title: 'A marking, if you like' },
      { k: 'eyes', title: 'Your eyes' }
    ];
    function swatches(g) {
      return (L[g.k] || []).map(function (o) {
        var on = cat.look[g.k] === o.id;
        if (g.k === 'sex') return '<button class="sw word" type="button" data-k="sex" data-v="' + esc(o.id) + '" aria-pressed="' + on + '"><span>' + esc(o.label) + '</span></button>';
        var art = g.k === 'fur' ? furSwatch(o) : g.k === 'eyes' ? eyeSwatch(o) : markSwatch(o, lookDef('fur', cat.look.fur));
        // the long marking descriptions get a wider swatch, so they read in two lines, never cut short
        var wide = String(o.label || '').length > 20 ? ' wide' : '';
        return '<button class="sw' + wide + '" type="button" data-k="' + g.k + '" data-v="' + esc(o.id) + '" aria-pressed="' + on + '" aria-label="' + esc(String(o.label).replace(/\u00AD/g, '')) + '">' + art + '<span aria-hidden="true">' + esc(o.label) + '</span></button>';
      }).join('');
    }
    function draw() {
      box.innerHTML = '<div class="look">' + groups.map(function (g) {
        return '<div role="group" aria-label="' + esc(g.title) + '"><h3>' + esc(g.title) + '</h3><div class="sw-row">' + swatches(g) + '</div></div>';
      }).join('') + '<div class="next-row">' + backBottom() + '<button class="btn go big" id="okBtn" type="button">That’s me!</button></div></div>';
      Array.prototype.forEach.call(box.querySelectorAll('.sw'), function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-k'), v = b.getAttribute('data-v');
          var p = {}; p[k] = v; E.setLook(cat, p); persist();
          ctx.heads = drawArt(ctx.panel, shownFrame(f), cat.look);
          layoutText(ctx);
          var y = root.scrollY;
          draw();
          root.scrollTo(0, y);
          var again = box.querySelector('.sw[data-k="' + k + '"][data-v="' + v + '"]');
          if (again) again.focus({ preventScroll: true });
        });
      });
      $('okBtn').addEventListener('click', function () { if (E.confirmLook(cat, story, null, now())) { persist(); go('frame'); } });
      wireBackBottom();
    }
    draw();
    keyHandler = function (e) { if (!isTyping(e) && e.key === 'ArrowLeft') onBack(); };
  }
  function furSwatch(o) {
    var c = o.swatch || ['#999'], c0 = c[0], c1 = c[1] || c0, c2 = c[2] || c1;
    var s = '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="30" fill="' + c0 + '"/>';
    if (o.stripes) s += '<g fill="none" stroke="' + c1 + '" stroke-width="5" stroke-linecap="round"><path d="M8 18 q8 6 4 16"/><path d="M24 6 q8 10 2 24"/><path d="M42 8 q8 10 0 22"/><path d="M54 24 q-2 8 -8 14"/></g>';
    if (o.patches) s += '<path d="M2 26 q10 -20 26 -10 q-2 16 -26 10z" fill="' + c1 + '"/><path d="M36 40 q14 -10 22 2 q-8 16 -22 -2z" fill="' + c2 + '"/>';
    return s + '</svg>';
  }
  function eyeSwatch(o) {
    var c = o.swatch || ['#5fbf5a'];
    var eye = function (cx, col, rx) {
      return '<path d="M' + (cx - rx) + ' 30 Q' + cx + ' ' + (30 - rx * 0.9) + ' ' + (cx + rx) + ' 30 Q' + cx + ' ' + (30 + rx * 0.9) + ' ' + (cx - rx) + ' 30Z" fill="' + col + '" stroke="#1b1622" stroke-width="2.5"/>' +
        '<ellipse cx="' + cx + '" cy="30" rx="' + (rx * 0.18) + '" ry="' + (rx * 0.62) + '" fill="#1b1622"/><circle cx="' + (cx + rx * 0.3) + '" cy="' + (30 - rx * 0.3) + '" r="' + (rx * 0.14) + '" fill="#fff"/>';
    };
    var s = '<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#3a3046"/>';
    if (c.length > 1) s += eye(17, c[0], 12) + eye(43, c[1], 12);
    else s += eye(30, c[0], 20);
    return s + '</svg>';
  }
  function markSwatch(o, fur) {
    // white markings vanish on a pale coat, so pale furs show them on a neutral mid-tone cat
    var pale = !!fur && /^(white|cream|calico)$/.test(fur.id || '');
    var c = pale ? ['#a77a4f', '#5b3f27'] : (fur && fur.swatch) || ['#a77a4f'], c0 = c[0], c1 = c[1] || '#4e3524';
    var white = '#fffaf0';
    var s = '<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#3a3046"/>' +
      '<g stroke="#1b1622" stroke-width="2" stroke-linejoin="round"><path d="M14 30 L12 10 L26 20 Z M46 30 L48 10 L34 20 Z" fill="' + c0 + '"/>' +
      '<path d="M8 62 Q8 40 30 40 Q52 40 52 62Z" fill="' + c0 + '"/>' +
      '<ellipse cx="30" cy="30" rx="18" ry="15" fill="' + c0 + '"/></g>';
    if (o.id === 'paws' || /paw/.test(o.id)) s += '<ellipse cx="17" cy="56" rx="6" ry="4" fill="' + white + '" stroke="#1b1622" stroke-width="1.5"/><ellipse cx="43" cy="56" rx="6" ry="4" fill="' + white + '" stroke="#1b1622" stroke-width="1.5"/>';
    if (o.id === 'chest' || /chest|bib/.test(o.id)) s += '<path d="M22 44 Q30 58 38 44 Q30 48 22 44Z" fill="' + white + '"/>';
    if (o.id === 'stripe' || /stripe/.test(o.id)) s += '<path d="M30 15 L30 26" stroke="' + (c1 === c0 ? '#1b1622' : c1) + '" stroke-width="5" stroke-linecap="round"/><path d="M30 42 L30 60" stroke="' + (c1 === c0 ? '#1b1622' : c1) + '" stroke-width="5" stroke-linecap="round"/>';
    if (o.id === 'nose' || /nose|blaze/.test(o.id)) s += '<path d="M26 22 Q30 20 34 22 L33 38 Q30 40 27 38Z" fill="' + white + '"/>';
    s += '<circle cx="24" cy="29" r="2.4" fill="#1b1622"/><circle cx="36" cy="29" r="2.4" fill="#1b1622"/><path d="M28 35 h4 l-2 2z" fill="#f29aa5"/>';
    return s + '</svg>';
  }

  /* ================================================================ the Counts lesson */
  function startChapterLesson(f, id, resume) {
    var setId = f.counts.set, def, st;
    if (resume && cat.lesson && cat.lesson.state) {
      def = Object.assign({ id: setId }, E.countsSet(setId, story, stories()));
      st = cat.lesson.state;
    } else {
      // the set's facts as she gets them (an adaptive warm-up), and the fillers it borrows (fillFrom)
      var r = E.chapterLesson(cat, story, setId, now(), stories());
      def = r.def; st = r.state;
      // a lesson still going further on (she came Back to count this one again) waits for its frame
      E.beginLesson(cat, story, id, st);
      persist();
    }
    // a Counts frame that showed its balloons over a kept skip picture (f036 after the rim) doesn't
    // say them again over the first question: they were just read
    // (nor does a frame that carries a whole conversation: lessonIntro)
    // (chapter 5: nor one that says so, `counts: { intro: false }`: the tens warm-up, whose first
    // question may be her hardest ten: it appears with the engine's own words alone, and is timed on itself)
    var intro = lessonIntro(balloonsOf(f), !!(resume || f.counts.intro === false || E.keptSkip(story, id, cat)));
    // (the Warrior Counts: while a sitting with an answer in it waits, an answer here sets it aside, as one in the Hollow
    // does, so the lesson warns her first, as a round picked up in the Hollow does: Tallyheart's waiting line over the
    // first question, the last line before it, said with it, before any answer; Back from there loses nothing. A cat
    // with no `warrior` data, or a sitting gone stale, counts as she always did)
    var wWait = cat.warrior ? E.hollowLines(cat, stories(), { now: now() }).waiting : null;
    if (wWait) intro = (intro || []).concat([{ who: 'tallyheart', text: wWait }]);
    var finish = function (sum) { if (E.finishCounts(cat, story, sum, now())) { persist(); go('frame'); } };
    var onDone = function (sum) {
      // a lesson inside the story (the prey pile) may have no closing line: the next frame answers
      if (def.done === '' || def.done === null) { renderedAt = now(); return finish(sum); }
      // the scene again, with the teacher's last line in a balloon over it (the lesson was
      // recorded on the cat at its last answer, so a page closed now loses nothing)
      renderedAt = now();
      var scr = $('screen');
      scr.innerHTML = frameShell('counts', id);
      var panel = $('panel');
      var heads = drawArt(panel, shownFrame(f), cat.look);
      var line = fill(def.done || 'Good work.');
      var ctx = { panel: panel, frame: { scene: f.scene, sfx: '' }, heads: heads, caps: [], balloons: [{ who: def.teacher || 'tallyheart', text: line, kind: 'say' }] };
      relayoutFn = function () { layoutText(ctx); };
      layoutText(ctx);
      $('interact').innerHTML = '<div class="next-row"><button class="btn go big" id="nextBtn" type="button">Next</button></div>';
      $('nextBtn').addEventListener('click', function () { finish(sum); });
      keyHandler = function (e) { if (!isTyping(e) && (e.key === 'Enter' || e.key === 'ArrowRight')) $('nextBtn').click(); };
      persist();
      speakItems([{ text: line, who: def.teacher || 'tallyheart' }]);
    };
    // (the take-aways kit: a take set, `op: '-'`, runs on its own page, runTakes, with the same options and the same end)
    if (st && st.op === '-') return runTakes({ def: def, state: st, intro: intro, mode: 'chapter', waitLine: wWait, onDone: onDone });
    runLesson({ def: def, state: st, intro: intro, mode: 'chapter', waitLine: wWait, onDone: onDone });
  }

  /* One lesson, used by the chapter and the Training Hollow alike. A borrowed question (a filler
   * from the set's fillFrom) is asked as its lending set's: D is the set the question is asked as. */
  function runLesson(o) {
    var def = o.def, st = o.state, D = def;
    // the Warrior Counts (`mode: 'warrior'`, docs/warrior-counts.md section 7): the panel is the fountain
    // scene, not a counting picture (the sand on a miss, as in every lesson); each question asked as
    // E.warriorAsk's set; the sitting kept after every answer (E.warriorKeep) and recorded at its last;
    // the four paws above the question line; Tallyheart's pauses and the halfway page between questions;
    // Read to me says Glintstar's balloon and not the question line again
    var warrior = o.mode === 'warrior';
    var teacher = def.teacher || 'tallyheart';
    var things = def.things || 'tails', thing = def.thing || 'tail';
    function asSet(d) {
      D = d || def;
      teacher = D.teacher || def.teacher || 'tallyheart';
      things = D.things || 'tails'; thing = D.thing || 'tail';
    }
    var scr = $('screen');
    scr.innerHTML = frameShell('lesson', o.frameId || '');
    inLesson = true;      // the keypad screen: no Case File button, as there is no Back
    fileTeach = null; frameTap = null;
    renderedAt = now();   // a new screen: the double-tap guard in bindChrome applies
    var panel = $('panel');
    panel.classList.add('lesson-panel');
    if (warrior) scr.querySelector('.frame').setAttribute('data-mode', 'warrior');
    var art = panel.querySelector('.art');
    var stack = $('stack'), box = $('interact');
    var typed = '', t0 = 0, locked = false, q = null, first = true;
    // (the Warrior Counts: a pause on screen, Tallyheart's line between two questions: how it ends)
    var beatEnd = null;
    // "Got it!" sits over the keypad: after a tap brings the next question, the keypad ignores
    // presses for a moment, so the second tap of a double tap never types into the new question
    var padLockedUntil = 0;
    relayoutFn = null;
    panel.setAttribute('aria-label', warrior ? 'The fountain: Glintstar on top, you at its foot, Tallyheart beside you' : 'Counting picture');
    box.innerHTML =
      '<div class="counts">' +
      (warrior ? '<div class="wpaws" id="wpaws" aria-hidden="true"></div>' : '') +
      '<div class="q" id="qline" aria-live="polite"></div>' +
      '<div class="padwrap"><div class="keypad" id="keypad">' +
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button class="key" type="button" data-k="' + n + '">' + n + '</button>'; }).join('') +
      '<button class="key del" type="button" data-k="del" aria-label="Delete"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h11v14H9l-6-7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 9l5 6M17 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>' +
      '<button class="key" type="button" data-k="0">0</button>' +
      '<button class="key ok" type="button" data-k="ok" aria-label="OK">OK</button>' +
      '</div><div class="gotit" id="lessonNext" hidden><button class="btn go big" id="gotIt" type="button">Got it!</button></div></div></div>';
    var qline = $('qline'), pad = $('keypad'), okKey = pad.querySelector('[data-k="ok"]');
    // (a font that loads late, a turned screen: the question line is fitted again)
    relayoutFn = function () { fitQ(); };

    // a line of kind 'caption' is narration (8 × 2's "You touch your nose to each little stack…"):
    // a caption box, as the chapter's captions are lettered in the column; the rest are balloons
    // (chapter 5: so is every line of a set nobody speaks in, `teacher: 'caption'`: Wisp's riddle)
    function say(lines, extraClass) {
      stack.innerHTML = lines.map(function (l) {
        if (l.kind === 'caption' || l.who === 'caption') return '<p class="caption">' + rich(l.text) + '</p>';
        return stackBalloon({ who: l.who || teacher, text: l.text, html: l.html, kind: l.kind, name: l.name, variant: l.variant }, extraClass);
      }).join('');
    }
    function showQ(slotText, cls) {
      var askTxt = E.counts.ask(def, q);
      var parts = askTxt.split('×');
      var left = esc((parts[0] || '').trim()), right = esc((parts[1] || '').trim());
      qline.innerHTML = '<span>' + left + '</span><span class="x">×</span><span>' + right + '</span><span>=</span>' +
        '<span class="slot ' + (cls || '') + (slotText ? '' : ' empty') + '">' + (slotText ? esc(slotText) : '?') + '</span>';
      qline.setAttribute('aria-label', askTxt.replace('×', 'times') + ' equals ' + (slotText || 'what?'));
      okKey.disabled = !typed || locked;
      fitQ();
    }
    /* The question line is sized by the lesson column (14cqi, the page's CSS), which holds "10 × 10 =
     * 100" with a little to spare. Safari sizes a cqi font by the page zoom too, so on a zoomed page
     * the line can come out wider than its column (at 115% the last zero of "100" was cut off). Then,
     * and only then, the line is set to the size that fits: measured with the answer's digits in the
     * slot, so it does not change as she types. Unzoomed, nothing is touched. */
    function fitQ() {
      var slot = qline.lastElementChild, lead = qline.firstElementChild;
      qline.style.fontSize = '';
      if (!q || !slot || !lead || !slot.getBoundingClientRect || !qline.clientWidth) return;
      var shown = slot.textContent, digits = Math.max(String(q.answer).length, shown.length);
      slot.textContent = '000'.slice(0, digits) || '0';
      var need = slot.getBoundingClientRect().right - lead.getBoundingClientRect().left, room = qline.clientWidth - 8;
      slot.textContent = shown;
      if (need > room && room > 0) qline.style.fontSize = (Math.floor(parseFloat(root.getComputedStyle(qline).fontSize) * room / need * 10) / 10) + 'px';
    }
    /* The picture for this question: the set's picture (cats or prey, stacks or rows, a thought
     * cloud), the fact's own on top of it. `over` redraws it another way (rightPicture). */
    function look(over) {
      // a regrouped picture (rightPicture: five pairs of ears as two rows of five) is in rows unless it says otherwise
      var p = Object.assign({}, D.picture || {}, q.picture || {}, over ? Object.assign({ layout: 'rows' }, over.picture || {}) : {});
      var g = over && typeof over.groups === 'number' ? over.groups : q.groups;
      var per = over && typeof over.per === 'number' ? over.per : q.per;
      // who sits in the picture's places: the fact's own (the rim's first three), else the set's
      var who = q.who || (Array.isArray(D.who) ? D.who : null);
      return { kind: p.kind, layout: p.layout, thought: p.thought, groups: g, per: per, who: who };
    }
    function picture(highlight, over) {
      // as the engine pictures it (E.lessonPicture: the set's picture, the fact's own on top, who sits in it)
      paint(E.lessonPicture(D, q, highlight, over));
    }
    function paint(po) {
      po.look = cat && cat.look;
      art.innerHTML = artCall('countsPicture', po) || countsFallback(po.groups, po.per, po.highlight || 0);
    }
    /* Chapter 5, `shows` (res.shows): her answers scratched in the sand, with the line that talks
     * about them (18 and 36: "Three and six make nine. One and eight make nine."). The art's picture
     * when it has one of these very numbers; else the page's own. */
    function answersPicture(shows, plan) {
      var o = E.answersOpts(plan, shows), svg = artCall('sand', o);
      if (!namesAnswers(svg, o.answers)) svg = artCall('countsPicture', Object.assign({ kind: 'answers' }, o));
      art.innerHTML = namesAnswers(svg, o.answers) ? svg : answersFallback(o.answers);
    }
    /* The Warrior Counts: the panel between questions is the fountain (PC.warrior.scene, the Clan round it
     * or the camp quiet), drawn once a sitting; the four paws fill as she goes (E.warriorPaws). */
    var sceneSvg = null;
    function fountain() {
      if (sceneSvg == null) sceneSvg = warriorSceneSvg(st);
      art.innerHTML = sceneSvg;
    }
    function drawPaws() {
      var el = $('wpaws');
      // (shown again after the help's last page, which hides them)
      if (el) el.hidden = false;
      if (el) el.innerHTML = pawsSvg(wPaws(typeof E.warriorPaws === 'function' ? E.warriorPaws(st) : null, st.log.length));
    }
    /* A pause before the next question (E.warriorBeat: after the 14th and the 42nd answers, Tallyheart's
     * line; after the 28th, the halfway page), each once a sitting (kept in the sitting's `beats`).
     * Returns true when a pause took the screen: it asks the next question itself when it is over. */
    function pause() {
      if (E.counts.done(st)) return false;
      var P = wPause(E, PC.warrior, st);
      if (!P) return false;
      keepSitting(st);
      persist();
      if (P.halfway) { if (o.onHalfway) o.onHalfway(P.at); return true; }
      var lines = P.lines.map(function (l) { return { who: l.who, text: fill(l.text), kind: l.kind }; });
      // a sitting picked up right at a pause: "Where were we? Ah, yes." first, here, and not again over
      // the question after it
      if (first && o.intro && o.intro.length) { lines = o.intro.slice().concat(lines); first = false; }
      q = null;
      pad.classList.add('away'); $('lessonNext').hidden = true;
      // (the panel between questions is the fountain, even when the pause is the first thing drawn, or
      // comes after a miss's sand)
      drawPaws(); fountain();
      say(lines);
      var heard = lines.map(function (l) { return { text: l.text, who: l.who }; });
      saying(heard);
      // (a tap on the page moves on: listened for on this lesson's own page, which goes with it)
      var done = false, scrEl = scr.querySelector('.frame'), timer = null;
      beatEnd = function () {
        // (once its page is gone, a pause never asks: a late end of its speech finds nothing to do)
        if (done || !scrEl.isConnected) return;
        done = true; beatEnd = null; pauseRead = null; clearTimers();
        scrEl.removeEventListener('click', tapOn);
        ask(true);
      };
      var end = function () { if (beatEnd) beatEnd(); };
      var tapOn = function (e) { if (e.target && e.target.closest && e.target.closest('.bar')) return; end(); };
      later(function () { scrEl.addEventListener('click', tapOn); }, 300);
      // 2.5 s, or 3.5 s when the line is over six words, or as long as its words take to read when that
      // is longer (wBeatMs); with Read to me on, until it has been said and half a second more, and never
      // longer than that after that (a voice that never says it has finished, a speech that fails, Read to
      // me switched off partway: the pause still ends)
      var spoken = function () {
        speakItems(heard, function () { later(end, 500); });
        if (timer) clearTimeout(timer);
        timer = later(end, wBeatMs(lines) + wSpeechMs(heard));
      };
      if (save.settings.readAloud && 'speechSynthesis' in root) spoken();
      else timer = later(end, wBeatMs(lines));
      // (Read to me switched on during the pause: the line said from its start, the pause waiting for it)
      pauseRead = function () { if (done || !scrEl.isConnected || !('speechSynthesis' in root)) return false; spoken(); return true; };
      return true;
    }
    /* What this page says, for Read to me's button and PC.debug.speech (DRY=1): the Warrior Counts and a
     * chapter's or the Hollow's lesson alike (a lesson's page once said the frame's old lines). Set
     * once the page is drawn: a question asked as the screen opens is spoken here, with its own wait,
     * never a second time by go(). */
    function saying(items) { later(function () { currentSpeech = items; }, 0); }
    function fillQ(t) { return E.fill(t, cat, { a: q.a, b: q.b, answer: q.answer, groups: q.groups, per: q.per, thing: thing, things: things }); }
    function balloonLines(x) {
      return asList(x).map(function (b) { return typeof b === 'string' ? { text: b } : b; }).filter(function (b) { return b && b.text; })
        .map(function (b) { return b.kind === 'caption' ? { text: fillQ(b.text), kind: 'caption' } : { who: b.who || teacher, text: fillQ(b.text), kind: b.kind, variant: b.variant }; });
    }
    /* What is said before she answers (E.promptLines: the question's own prompt, the set's first
     * question, a retry's againIntro, a borrowed question's fillIntro, or the generic question), with
     * the cat's tokens filled. */
    function promptLines() {
      return E.promptLines(def, D, q).map(function (l) {
        var x = l.kind === 'caption' ? { text: fill(l.text), kind: 'caption' } : { who: l.who, text: fill(l.text), kind: l.kind, variant: l.variant };
        if (l.lang) x.lang = l.lang;   // (chapter 12's design: a Spanish ask keeps its lang)
        return x;
      });
    }
    /* The clock is for the fact, not the reading: it starts again when the question has been read
     * aloud (Read to me) and when the picture has finished lighting up, unless she is already typing. */
    function restartClock(forQ) {
      if (q === forQ && !locked && !typed) t0 = performance.now();
    }
    /* `light`: the picture lights a group at a time as it is asked (the pile's stacks as she noses
     * them, the check's top row then its bottom row), with no number; she can answer at any time. */
    /* Chapter 5, `light: 'tuck'` (the 9s): the two steps without a word. The picture has opened with
     * all ten claws lit on every cat (the hop); one curls in on each (the tuck); then the claws go
     * unlit, nine out and one tucked, and the clock starts again from there. */
    function playTuck(forQ, steps) {
      var k = 0;
      var step = function () {
        if (q !== forQ || locked) return;
        paint(steps[k].picture);
        k++;
        if (k < steps.length) later(step, steps[k].wait);
        else restartClock(forQ);
      };
      if (steps.length) later(step, steps[0].wait);
    }
    function lightUp(forQ) {
      var L = look(), k = 0, base = q.lit || 0;
      var stepMs = q.light === 'rows' ? 1000 : 560;
      var tickL = function () {
        if (q !== forQ || locked) return;
        k++;
        picture(Math.max(base, k * L.per));
        if (k < L.groups) later(tickL, stepMs);
        else restartClock(forQ);
      };
      later(tickL, 700);
    }
    function ask(byTap) {
      if (byTap) padLockedUntil = now() + 400;
      // (the Warrior Counts: a pause comes first, when one is due)
      if (warrior && pause()) return;
      q = E.counts.question(st);
      if (!q) return finish();
      asSet(warrior ? E.warriorAsk(def, st, q, stories()) : E.questionDef(def, q, story, stories()));
      typed = ''; locked = false;
      pad.classList.remove('locked', 'away'); $('lessonNext').hidden = true; $('lessonNext').style.alignItems = '';
      $('gotIt').textContent = 'Got it!';
      // `lit`: what glows as it is asked (2 × 6: the first five cats' ears, ten, to hop on from)
      // (chapter 5's nines open on the hop: all ten claws lit on every cat; then playTuck)
      var tuck = q.light === 'tuck' ? E.lightSteps(D, q) : null;
      if (warrior) { fountain(); drawPaws(); }
      else if (tuck) paint(tuck.open); else picture(q.lit || 0);
      var lines = [], waitFirst = first;
      if (first && o.intro && o.intro.length) lines = o.intro.slice();
      lines = lines.concat(promptLines());
      first = false;
      say(lines);
      showQ('', '');
      // a long intro (two balloons and a caption over the first question) can push the keypad's
      // last row below the screen: bring the whole keypad into view, whatever the intro's length
      var kb = pad.getBoundingClientRect().bottom, vh = root.innerHeight || 0;
      if (vh && kb > vh) root.scrollBy(0, kb - vh + 8);
      // (the Warrior Counts: a question drawn as its screen opens is drawn inside go(), whose scroll to
      // the top comes after this; so look again once go() is done: a picked-up question's keypad, under
      // "Where were we? Ah, yes.", is brought into view too; and a Training Hollow round picked up, drawn
      // inside go('hollow'), under the Counts' waiting line: only for a cat with Warrior Counts data, so
      // the Hollow of chapters 1 to 8 is as it was; and a chapter's lesson picked up, drawn inside
      // go('frame'), under the waiting line or not: it only ever scrolls a keypad that ends below the screen)
      if (warrior || o.mode === 'chapter' || (o.mode === 'hollow' && cat && cat.warrior)) later(function () {
        var kb2 = pad.getBoundingClientRect().bottom, vh2 = root.innerHeight || 0;
        if (vh2 && kb2 > vh2) root.scrollBy(0, kb2 - vh2 + 8);
      }, 0);
      t0 = performance.now();
      var asked = q;
      if (tuck) playTuck(asked, tuck);
      else if (q.light) lightUp(asked);
      // (the Counts' waiting line over a chapter's first question, Read to me off: she reads it first, so the
      // clock starts again once it would have been read; never once she has started typing)
      if (waitFirst && o.waitLine && !save.settings.readAloud) later(function () { restartClock(asked); }, wReadMs(o.waitLine, false));
      // (the Warrior Counts: Glintstar's balloon asks it in words; the question line is not read again)
      var heard = lines.map(function (l) { return { text: l.text, who: l.who, variant: l.variant }; });
      // (what the page says for Read to me's button: the lines over the question, then the question; the
      // Warrior Counts' balloon asks it in words)
      saying(warrior ? heard : heard.concat([{ text: E.counts.ask(def, q) }]));
      // (the Warrior Counts: her clock starts again when the question has been said, or at the latest
      // when it would have been, so a voice that never says it has finished is never timed as hers)
      var restarted = false, rc = function () { if (!restarted) { restarted = true; restartClock(asked); } };
      speakItems(warrior ? heard : heard.concat([{ text: E.counts.ask(def, q) }]),
        warrior ? rc : function () { restartClock(asked); });
      if (warrior && save.settings.readAloud && 'speechSynthesis' in root) later(rc, wSpeechMs(heard) + 300);
    }
    function press(k) {
      if (locked || now() < padLockedUntil) return;
      if (k === 'ok') return submit();
      typed = keypadPress(typed, k);   // up to three digits: 10 × 10 is 100
      showQ(typed, '');
    }
    function submit() {
      if (!typed || locked) return;
      // (the Warrior Counts: a screen left open past the sitting's two hours never takes another answer
      // into it; the hub's next tap sets it aside and starts afresh)
      if (warrior && warriorStale()) { wv = null; return go('hub'); }
      locked = true; pad.classList.add('locked');
      var ms = performance.now() - t0;
      // a borrowed question earns its own lesson's praise and fast lines
      var res = E.counts.answer(st, D, typed, ms, now());
      // (chapter 12: a set's `echo`, Chispapaw's Spanish after the line this answer earned, waiting for Next as a fact's own lines)
      var echoed = res.correct ? E.countsEcho(def, st, res, teacher) : null; if (echoed) res.balloons = echoed;
      E.logAnswer(cat, res.entry);
      // the last answer finishes the lesson: record it now, not after the praise pause
      if (res.done) o.recorded = E.recordLesson(cat, st);
      // (the Warrior Counts: the sitting is kept in its own slot, never `lesson`)
      else if (warrior) E.warriorKeep(cat, st, now());
      else if (o.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: st };
      else cat.lesson = { mode: o.mode, state: st };
      persist();
      if (warrior) drawPaws();
      if (res.correct) {
        showQ(typed, 'right');
        // five pairs of ears sliding into two rows of five: the picture regroups, all lit
        // (the Warrior Counts: the fountain stays)
        if (warrior) fountain();
        else if (res.rightPicture) { var R = look(res.rightPicture); picture(R.groups * R.per, res.rightPicture); }
        else if (res.shows) answersPicture(res.shows, null);   // chapter 5: her two answers in the sand, under the line about them
        else picture(q.groups * q.per);
        if (res.balloons && res.balloons.length) {
          // the question's own lines go on with the story: she reads them, then taps on
          var lines = balloonLines(res.balloons);
          say(lines);
          // (what Read to me says from here is the lines on the page, not the question)
          saying(lines.map(function (l) { return { text: l.text, who: l.who, variant: l.variant }; }));
          speakItems(lines.map(function (l) { return { text: l.text, who: l.who, variant: l.variant }; }));
          pad.classList.add('away');
          $('gotIt').textContent = 'Next';
          $('lessonNext').hidden = false;
          // (chapter 12: the warm-up's echo page, the line she earned, Chispapaw's Spanish with its English and her line, keeps
          // Next at the top of the keypad's place, as the Warrior Counts' help and the take page do (ask() puts it back), and
          // brings it in if a long fact or a zoomed page still leaves it under the screen; no chapter 1 to 11 has an echo)
          if (echoed) {
            $('lessonNext').style.alignItems = 'flex-start';
            var eb = $('gotIt').getBoundingClientRect().bottom, evh = root.innerHeight || 0;
            if (evh && eb > evh) root.scrollBy(0, eb - evh + 8);
          }
          later(function () { $('gotIt').focus({ preventScroll: true }); }, 50);
          return;
        }
        var line = fill(res.line);
        // a set may have nothing to say after a right answer (the next frame answers): no empty balloon
        say(line ? [{ who: teacher, text: line }] : []);
        saying(line ? [{ text: line, who: teacher }] : []);
        if (line) speakItems([{ text: line, who: teacher }]);
        var wait = !line ? 800 : save.settings.readAloud ? 2600 : (res.fast ? 1300 : 1500);
        // (the Warrior Counts: a long line, her hard fact remembered, stays until it can be said or read
        // to its end: "Not today!" is the point of it)
        if (warrior && line) wait = save.settings.readAloud ? Math.max(2600, wSpeechMs([{ text: line, who: teacher }]) + 400) : wReadMs(line, res.fast);
        var skip = function () { panel.removeEventListener('click', skip); clearTimers(); ask(true); };
        panel.addEventListener('click', skip);
        later(function () { panel.removeEventListener('click', skip); ask(); }, wait);
      } else {
        showQ(typed, 'miss');
        later(function () { help(res); }, quickHelp ? 0 : 650);
      }
    }
    function help(res) {
      // the help as the engine plans it (E.helpPlan): its first line (the five-or-zero reminder, "Close."
      // only when she was close: one hop of the count off, or exactly one group off), who keeps the count
      // (the teacher, or the player: under the bridge she hops and Sprinkle swipes), the ground (the
      // lesson set's: sand, the earth by the doorway and the pile, the mud), and swipes on the 5s
      var plan = E.helpPlan(def, D, q, res);
      var hp = res.help, startedAt = now(), ticking = false;
      var step = plan.step, counter = plan.counter;
      // chapter 5: the count step by step is the engine's (E.helpSteps: the 9s hop by tens, then rub a
      // line out of every pair and step back by ones); `says`: who says the first line when it is
      // not the teacher (Patience's one line in a set nobody else speaks in)
      var steps = E.helpSteps(plan), at = 0, cur = { counted: 0 }, opener = plan.says || teacher;
      pad.classList.add('away');
      var intro = fill(plan.intro);
      say([{ who: opener, text: intro }]);
      // (the Warrior Counts, Read to me on: the first line is the anchor's reminder, the five-or-zero,
      // the zero, the nines' digits; the count waits until it has been said, so the first number never
      // cuts it off. Elsewhere, as it always was)
      var readFirst = warrior && save.settings.readAloud && 'speechSynthesis' in root, startCount = null;
      if (readFirst) speakItems([{ text: intro, who: opener }], function () { later(function () { if (startCount) startCount(); }, 300); });
      else speakItems([{ text: intro, who: opener }]);
      saying([{ text: intro, who: opener }]);
      // the scratches match the picture: a picture in rows is scratched in rows (lit a column at a
      // time, top and bottom together; a whole row at a time when the help hops by the row: the
      // pile's rows of ten). On the 10s the swipes come in pairs, one for each forepaw (E.sandOpts)
      // (chapter 5, `help: 'picture'`: nothing is scratched; the set's own picture lights a group at a
      // time: Puddle's bump stars a log at a time, Wisp's herons one by one)
      var sand = function () {
        if (plan.picture) return picture(cur.counted);
        art.innerHTML = artCall('sand', E.sandOpts(plan, cur.counted, cur.rubbed)) || sandFallback(hp.groups, plan.tuck ? 10 : hp.per, cur.counted);
      };
      var nums = [];
      sand();
      var finishHelp = function () {
        panel.removeEventListener('click', tapCount);
        if (steps.length) cur = steps[steps.length - 1];
        at = steps.length;
        // (chapter 5: a fact that `shows` her answers ends its help on them, under its own miss line)
        if (res.shows) answersPicture(res.shows, plan); else sand();
        nums = plan.nums.slice();
        var line = fill(res.line);
        // (the Warrior Counts: the anchor's reminder stays above the count, so a reader of eight can finish
        // it; "Got it!" is the only way on)
        say((warrior && intro ? [{ who: opener, text: intro }] : []).concat([{ who: counter, html: '<span class="counter">' + nums.join(' · ') + '</span>' }], line ? [{ who: teacher, text: line }] : []));
        typed = String(hp.answer);
        showQ(typed, 'right');
        var told = [{ text: hp.a + ' times ' + hp.b + ' is ' + hp.answer + '. ' + line, who: teacher }];
        saying(told);
        speakItems(told);
        $('lessonNext').hidden = false;
        // (the Warrior Counts: the paws step aside on the help's last page, and “Got it!” sits at the top of
        // the keypad's place (index.html), so the reminder above the count stays on the screen when “Got it!”
        // is brought in; drawPaws() shows them again for the next question, or a pause)
        if (warrior && $('wpaws')) $('wpaws').hidden = true;
        // (chapter 9's review: the longest help line, 7 × 8's, can leave “Got it!” below the screen with Aa on in
        // landscape: bring it into view, as the keypad is brought in for a long intro; nothing moves where it fits;
        // the Warrior Counts' too)
        var gb = $('gotIt').getBoundingClientRect().bottom, gvh = root.innerHeight || 0;
        if (gvh && gb > gvh) root.scrollBy(0, gb - gvh + 8);
        $('gotIt').focus({ preventScroll: true });
      };
      // The count is the teaching moment, so it always runs step by step (with Reduce Motion
      // too: the scratches light without animating). Tapping the picture counts along, one step
      // per tap; it never jumps to the answer.
      var tick = function () {
        if (at >= steps.length) return;
        cur = steps[at++];
        nums.push(cur.n);
        sand();
        var lastSb = stack.lastElementChild && stack.lastElementChild.querySelector('.sb');
        if (lastSb) lastSb.innerHTML = '<span class="who">' + esc(speakerName({ who: counter })) + '</span><span class="counter">' + nums.join(' · ') + '</span>';
        if (save.settings.readAloud) speakItems([{ text: String(cur.n), who: counter }]);
        if (at >= steps.length) later(finishHelp, 700);
        else later(tick, (reduceMotion ? 700 : 620) * (step > 1 ? 1.25 : 1));
      };
      var tapCount = function () {
        if (!ticking || at >= steps.length || now() - startedAt < 350) return;
        clearTimers(); tick();
      };
      panel.addEventListener('click', tapCount);
      // (tools/shots.mjs's picture of the sand: the count already out, PC.debug.warrior('sand'))
      if (quickHelp) { quickHelp = false; return finishHelp(); }
      var began = false;
      startCount = function () {
        if (began) return;
        began = true; startCount = null;
        say([{ who: opener, text: intro }, { who: counter, text: '…' }]);
        ticking = true;
        tick();
      };
      // (with readFirst: once the first line has been said, or at the latest when it would have been)
      later(function () { if (startCount) startCount(); }, readFirst ? wSpeechMs([{ text: intro, who: opener }]) + 600 : 900);
    }
    function finish() {
      keyHandler = null;
      inLesson = false;
      var sum = E.counts.summary(st);
      // recorded at the last answer; this only catches a lesson that somehow was not
      if (!o.recorded && cat.lesson && cat.lesson.state === st) { o.recorded = E.recordLesson(cat, st); persist(); }
      // (nor a sitting of the Warrior Counts, still in its own slot)
      if (warrior && !o.recorded && cat.warrior && cat.warrior.sitting && cat.warrior.sitting.state === st) { o.recorded = E.recordLesson(cat, st); persist(); }
      o.onDone(sum, o.recorded);
      updateBar();   // the keypad screen is over: her Case File's button is back
    }
    pad.addEventListener('click', function (e) {
      var b = e.target.closest('.key'); if (!b) return;
      press(b.getAttribute('data-k'));
    });
    $('gotIt').addEventListener('click', function () { ask(true); });
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); }
      else if (e.key === 'Backspace') { e.preventDefault(); press('del'); }
      else if (e.key === 'Enter') { e.preventDefault(); if (beatEnd) beatEnd(); else if (!$('lessonNext').hidden) ask(true); else press('ok'); }
      // (a pause of the Warrior Counts: Space moves on too, as a tap does)
      else if (e.key === ' ' && beatEnd) { e.preventDefault(); beatEnd(); }
    };
    updateBar();
    ask();
  }
  function countsFallback(groups, per, hi) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#e8cf98"/>', k = 0;
    for (var i = 0; i < groups; i++) {
      var x = 110 + (i % 5) * 145, y = 170 + Math.floor(i / 5) * 190 + (groups <= 5 ? 90 : 0);
      s += '<ellipse cx="' + x + '" cy="' + y + '" rx="48" ry="34" fill="#c98a4a" stroke="#1b1622" stroke-width="4"/><circle cx="' + (x + 40) + '" cy="' + (y - 30) + '" r="26" fill="#c98a4a" stroke="#1b1622" stroke-width="4"/>';
      for (var t = 0; t < per; t++) { var lit = k++ < hi; s += '<path d="M' + (x - 44) + ' ' + (y + 6 - t * 10) + ' q-40 -10 -30 -60" fill="none" stroke="' + (lit ? '#ffd23f' : '#c98a4a') + '" stroke-width="12" stroke-linecap="round"/>'; }
    }
    return s + '</svg>';
  }
  /* Her answers scratched in the sand, the page's own drawing (used until the art has one: namesAnswers). */
  function answersFallback(answers) {
    var n = Math.max(1, answers.length), W = 800, H = 500, s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Scratched in the sand: ' + esc(answers.join(' and ')) + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="#e8cf98"/><ellipse cx="400" cy="250" rx="372" ry="212" fill="#efd6a2" stroke="#cfae72" stroke-width="4"/>';
    answers.forEach(function (a, i) {
      var x = W * (i + 0.5) / n, rot = i % 2 ? 3 : -4;
      var t = '<text x="' + f1(x) + '" y="318" text-anchor="middle" font-size="' + (n > 2 ? 150 : 200) + '" font-weight="700" style="font-family:Andika, ui-rounded, system-ui, sans-serif" transform="rotate(' + rot + ' ' + f1(x) + ' 250)"';
      s += t + ' fill="none" stroke="#fbecc8" stroke-width="18" stroke-linejoin="round" dx="4" dy="5">' + esc(a) + '</text>' +
        t + ' fill="#9c7440" stroke="#7d5a2e" stroke-width="5" stroke-linejoin="round">' + esc(a) + '</text>';
    });
    return s + '</svg>';
  }
  function sandFallback(groups, per, counted) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#e2c084"/>', k = 0;
    for (var i = 0; i < groups; i++) for (var j = 0; j < per; j++) {
      var lit = k++ < counted, x = 80 + (i % 5) * 150 + j * 18, y = 120 + Math.floor(i / 5) * 200;
      s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 10) + '" y2="' + (y + 110) + '" stroke="' + (lit ? '#ffbf2f' : '#8a6a3a') + '" stroke-width="' + (lit ? 10 : 7) + '" stroke-linecap="round"/>';
    }
    return s + '</svg>';
  }

  /* ================================================================ the take-aways kit: the take page
   * docs/take-aways.md v0.3, sections 1, 2, 6 and 8 (PC.ui.takes, above, has its words, stacks and waits). One take
   * set on its own page: a chapter's lesson (startChapterLesson, a set with `op: '-'`) and a Count the store round
   * (storeLesson). The lesson page's shape, kept: the panel (the store picture, PC.art.placeValue; on a miss
   * the help's sand, PC.art.sand's `quick`), the stack of balloons, the keypad where her fingers know it; the question
   * line's place holds the column, answered one box at a time, ones first, with OK. Within a problem nothing above the
   * keypad changes height (the stack's min-height, the column's reserved rows), so a digit typed fast never lands on
   * the wrong key. `o`: { def, state, intro, waitLine, mode ('chapter'; 'hollow' (a Count the store round); 'debug': nothing
   * is saved, PC.debug.takes), frameId, onDone(summary, recorded), echo (chapter 12's Chispapaw: called with each right
   * column and each right problem, returning a balloon or nothing; absent, the no-op), debug ({ quick, stop }) }.
   * Nothing here runs before chapter 12: no chapter 1 to 11 has a take set. */
  var TAKE_PHONE = '(orientation: landscape) and (max-height: 500px)';   // index.html's phone held sideways
  function takeKeys() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button class="key" type="button" data-k="' + n + '">' + n + '</button>'; }).join('') +
      '<button class="key del" type="button" data-k="del" aria-label="Delete"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h11v14H9l-6-7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 9l5 6M17 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>' +
      '<button class="key" type="button" data-k="0">0</button>' +
      '<button class="key ok" type="button" data-k="ok" aria-label="OK">OK</button>';
  }
  // (the store and the sand drawn plainly, should the art not draw them: a number of each, in place)
  function takeStoreFallback(po) {
    var t = po.taken || {}, z = [['hundreds', po.hundreds, t.hundreds], ['tens', po.tens, t.tens], ['ones', po.ones, t.ones]];
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800"><rect width="1600" height="800" fill="#e8cf98"/>' +
      z.map(function (x, i) { return '<text x="' + (270 + i * 530) + '" y="440" font-size="160" text-anchor="middle" fill="#5a4326" font-family="Andika, sans-serif">' + ((x[1] || 0) - (x[2] || 0)) + '</text>'; }).join('') + '</svg>';
  }
  function takeSandFallback(s) {
    var o = (s && s.sand) || {};
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600"><rect width="1600" height="600" fill="#e2c084"/><text x="800" y="340" font-size="150" text-anchor="middle" fill="#5a4326" font-family="Andika, sans-serif">' +
      [o.hundreds || 0, o.tens || 0, o.ones || 0].join(' · ') + '</text></svg>';
  }
  function runTakes(o) {
    var def = o.def, st = o.state, T = E.takes, teacher = E.teacherOf(def), keep = o.mode !== 'debug';
    var dbg = o.debug || null, quick = !!(dbg && dbg.quick), frozen = false;
    var scr = $('screen');
    scr.innerHTML = frameShell('lesson', o.frameId || '');
    var frameEl = scr.querySelector('.frame');
    frameEl.setAttribute('data-mode', 'take');
    // the kit v0.4 (decision 57): the spread as moves she makes, only under the engine's gate (a `taught` holding a step
    // from `ones2` on): chapter 12's pages, take:first and PC.debug.spanish never have it, so they draw and play as v25
    var mv = E.takeMovesOn(st);
    if (mv) frameEl.classList.add('tmoves');
    inLesson = true;      // the keypad screen: no Case File button, as on a lesson
    fileTeach = null; frameTap = null;
    renderedAt = now();
    var panel = $('panel'), art = panel.querySelector('.art'), stack = $('stack'), box = $('interact');
    panel.classList.add('lesson-panel');
    box.innerHTML = '<div class="counts takes"><div class="tcol" id="tcol" role="group"></div>' +
      '<div class="padwrap"><div class="keypad" id="keypad">' + takeKeys() + '</div>' +
      '<div class="gotit" id="lessonNext" hidden><button class="btn go big" id="gotIt" type="button">Got it!</button></div></div>' +
      '<button class="sr" id="tspread" type="button" hidden></button></div>';
    var tcol = $('tcol'), pad = $('keypad'), okKey = pad.querySelector('[data-k="ok"]'), gotBtn = $('gotIt'), nextWrap = $('lessonNext'), spreadBtn = $('tspread');
    var padWrap = box.querySelector('.padwrap');
    // (the kit v0.4's: the one slot under the column's line and the lines it stands under, the column's quiet time after a
    // phase change, the green flash, Tallyheart's paw-tap, her own digit's wiggle, a move-help's glow, the last press)
    var slot = null, slotHelp = false, slotBase = [], slotHeard = [], quietUntil = 0, flash = null, ripple = -1, wig = -1, wigGen = 0, helpGlow = -1, press0 = null;
    // the problem as it stands (E.takes' question), her digit in the outlined box, the boxes and the marks as drawn
    var q = null, typed = '', boxes = [], marks = [], on = -1, glowCol = -1, askText = '';
    // 'line' (a column outlined), 'show', 'tap', 'type' (the keypad awake), 'busy' (a spread landing), 'help', 'end'
    var phase = 'idle', padLockedUntil = 0, t0 = 0, firstAsk = true, firstIntro = [];
    // (`base` the lines on the page over the column; `baseHeard` what Read to me's button says of them: on a first column the
    // question in words before the column's line, section 6's order, which every later line of the column is said after)
    var base = [], baseHeard = [], echoLines = [], advance = null, gotAct = null, tapWant = null, tapShow = null, flying = null;
    relayoutFn = null;

    // the page's own timers: none moves the page on once PC.debug.takes has stopped it for a picture (`quick`: at once), nor
    // once the page is gone (Camp or ‹: a speech `end` that comes after go() never brings a dead page back, as the
    // Warrior pause's `!scrEl.isConnected`)
    function wait(fn, ms) { return later(function () { if (!frozen && frameEl.isConnected) fn(); }, quick ? 0 : ms); }
    // a tap that moves the page on: every wait begun before it is withdrawn (its timers cleared, its speech stopped, and a
    // speech `end` that still comes, from cancel() or late, finds its generation gone and runs nothing)
    var waitGen = 0;
    function hush() { waitGen++; clearTimers(); stopSpeech(); }
    function stop(tag) { if (dbg && dbg.stop === tag) { frozen = true; return true; } return false; }
    function stackHtml(list) {
      return list.map(function (l) {
        if (l.kind === 'caption' || l.who === 'caption') return '<p class="caption">' + rich(l.text) + '</p>';
        // (the echo's room, for measuring only: Chispapaw's balloon two lines tall)
        if (l.room) return stackBalloon({ who: l.who, html: 'M<br>M' }, 'troom');
        // (the kit v0.4's slot under the column's line)
        if (l.slot) return stackBalloon({ who: l.who || teacher, text: l.text, kind: l.kind, name: l.name, variant: l.variant }, 'tslot');
        var cnt = l.counter != null ? '<span class="counter">' + esc(l.counter) + '</span>' : '';
        if (cnt) return stackBalloon({ who: l.who || teacher, html: l.text ? cnt + ' ' + richN(l.text) : cnt });
        return stackBalloon({ who: l.who || teacher, text: l.text, kind: l.kind, name: l.name, variant: l.variant });
      }).join('');
    }
    function say(list) { stack.innerHTML = stackHtml(list); }
    // what Read to me's button says (PC.debug.speech): the page's lines, never the counter's numbers alone
    function heard(list) {
      return list.filter(function (l) { return !l.room && l.text; }).map(function (l) { var h = { text: l.text, who: l.who || teacher }; if (l.variant) h.variant = l.variant; if (l.lang) h.lang = l.lang; return h; });
    }
    function saying(items) { later(function () { currentSpeech = items; }, 0); }
    function T1(text) { return { who: teacher, text: fill(text) }; }
    function helpedMap() { var h = {}; ((q && q.helped) || []).forEach(function (c) { h[c] = true; }); return h; }
    function qAt(col) { return { plan: q.plan, col: col == null ? q.col : col, picture: q.picture }; }

    function drawCol() {
      if (!q) return;
      if (mv) return drawColM();
      tcol.style.setProperty('--tn', String(q.plan.n));
      tcol.innerHTML = takeHtml(takeView(q.plan, { marks: marks, boxes: boxes, on: on, glow: glowCol, ask: askText }));
      tcol.setAttribute('aria-label', askText);
      // OK is dim while the box is empty, except on the leftmost box (lit there on every problem: an empty OK is a 0)
      okKey.disabled = phase === 'tap' || (typed === '' && !(q.okEmpty && on === q.col));
    }
    function paintStore(po) {
      if (!po) return;
      art.innerHTML = artCall('placeValue', po) || takeStoreFallback(po);
      panel.setAttribute('aria-label', takeStoreLabel(po) || 'The store');
    }
    function store(stage, col) { paintStore(E.takePicture(def, qAt(col), stage)); }
    function paintSand(step) {
      art.innerHTML = artCall('sand', E.takeSandOpts(step)) || takeSandFallback(step);
      panel.setAttribute('aria-label', 'Tallyheart’s sand');
    }
    /* A spread landing in the store: a row (or a square) slides (600 ms), opens into ten (400 ms), and lands; with
     * Reduce Motion, and on a tap (`flying()`), its end at once. */
    function flyTo(po, then) {
      flying = null;
      if (!po) return then();
      var sp = po.spread, endPo = Object.assign({}, po, { spread: null });
      if (!sp || reduceMotion || quick) { paintStore(endPo); return then(); }
      var me = function () { if (flying !== me) return; flying = null; paintStore(endPo); then(); };
      flying = me;
      paintStore(Object.assign({}, po, { spread: Object.assign({}, sp, { stage: 'slide' }) }));
      wait(function () {
        if (flying !== me) return;
        paintStore(Object.assign({}, po, { spread: Object.assign({}, sp, { stage: 'open' }) }));
        wait(me, TAKE_MS.open);
      }, TAKE_MS.slide);
    }
    function landNow() { if (flying) { var f = flying; clearTimers(); f(); } }
    /* A line on the page until it can be read, or, Read to me on, said and a little more (at most twice as long). */
    function timedWait(items, kind, fn) {
      var text = items.map(function (i) { return i.text || ''; }).join(' '), w = takeWaits(text, kind), done = false, g = ++waitGen;
      var next = function () { if (done || g !== waitGen) return; done = true; fn(); };
      if (save.settings.readAloud && 'speechSynthesis' in root && items.length) {
        speakItems(items, function () { wait(next, w.after); });
        wait(next, w.cap);
      } else { speakItems(items); wait(next, w.read); }
    }
    /* The column's clock (section 4's `cols`): it starts again once the column's line has been said, or would have
     * been read, and never while she is typing. */
    function startClock(items) {
      var forCol = q.col, forPos = st.pos;
      t0 = perfNow();
      var rc = function () { if (q && q.col === forCol && st.pos === forPos && phase === 'type' && typed === '') t0 = perfNow(); };
      var text = items.map(function (i) { return i.text || ''; }).join(' ');
      if (save.settings.readAloud && 'speechSynthesis' in root && items.length) speakItems(items, rc);
      else { speakItems(items); if (text) later(rc, takeWaits(text, 'step').read); }
    }
    function bringIn(el) {
      var b = el.getBoundingClientRect().bottom, vh = root.innerHeight || 0;
      if (vh && b > vh) root.scrollBy(0, b - vh + 8);
    }
    // the keypad, and "Got it!", brought into view (after go()'s scroll to the top too: a lesson picked up is drawn inside it)
    function bringPad() { bringIn(pad); later(function () { bringIn(pad); }, 0); }
    function bringGot() { bringIn(gotBtn); }
    function keepSlot() {
      if (!keep) return;
      if (o.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: st };
      else cat.lesson = { mode: o.mode, state: st };
      persist();
    }
    /* The stack held through a problem (section 6): its min-height the tallest it will be while she types the problem,
     * from the column she is on (PC.ui.takes.reserve), each candidate measured where the stack stands (and what it
     * holds now: a relayout mid-problem). */
    function reserve() {
      stack.style.minHeight = '';
      if (!q) return;
      // (each height up to the next whole pixel: offsetHeight rounds, so a stack 0.11 px over its held height moved the
      // keypad, measured at 1024 x 768 with Aa on once the gold marks' row was 17px)
      var tall = function () { return Math.ceil(stack.getBoundingClientRect().height - 0.01); };
      var was = stack.innerHTML, max = tall();
      var echoAt = typeof o.echo === 'function' ? function (c) { return echoOf(echoInfo(c)); } : false;
      takeReserve(def, q, { intro: firstAsk ? firstIntro : [], fill: fill, echo: echoAt, taught: st.taught }).forEach(function (L) {
        stack.innerHTML = stackHtml(L);
        max = Math.max(max, tall());
      });
      stack.innerHTML = was;
      if (max) stack.style.minHeight = max + 'px';
    }
    // what the echo hook is told of a right column: its top at her turn (and as written), its bottom and its digit
    function echoInfo(col) { var c = q.plan.cols[col]; return { col: col, top: c.at, written: c.top, bottom: c.bottom, digit: c.digit, a: q.a, b: q.b }; }
    /* The fallbacks (section 6), only when this problem's held stack leaves the keypad under the screen: first the heads
     * row; then sideways the keys at 56px, upright the panel shorter (never under half its height); then the keypad is
     * brought into view, as a lesson's is under a long intro. Set before she types, so nothing moves within a problem;
     * a phone held sideways never needs them (the stack stands over the panel). */
    function fit() {
      frameEl.classList.remove('tnohead', 'tkeys');
      panel.style.height = '';
      var vh = root.innerHeight || 0, mm = root.matchMedia;
      if (!vh || !pad.getBoundingClientRect || (mm && mm(TAKE_PHONE).matches)) return;
      var over = function () { return pad.getBoundingClientRect().bottom + (root.scrollY || root.pageYOffset || 0) - vh; };
      if (over() <= 0) return;
      frameEl.classList.add('tnohead');
      var left = over();
      if (left <= 0) return;
      if (mm && mm('(orientation: portrait)').matches) {
        var ph = panel.getBoundingClientRect().height;
        panel.style.height = Math.max(Math.round(ph / 2), Math.floor(ph - left)) + 'px';
      } else frameEl.classList.add('tkeys');
    }
    function echoOf(info) {
      if (typeof o.echo !== 'function') return null;
      var e = null;
      try { e = o.echo(info); } catch (x) { e = null; }
      if (typeof e === 'string') e = e ? { text: e } : null;
      if (!e || !e.text) return null;
      var b = { who: e.who || 'chispapaw', text: fill(e.text), lang: e.lang || 'es' };
      if (e.variant) b.variant = e.variant;
      return b;
    }
    // chapter 12: a set's own `echo`, read at every finished problem's end, right or helped (E.takeEcho); never made into the
    // `o.echo` hook, so reserve() holds no echo room above any column
    function setEcho(info) { var x = E.takeEcho(def, info, st); return x ? { who: x.who || 'chispapaw', text: fill(x.text), lang: 'es' } : null; }
    function wiggle() {
      panel.classList.remove('twiggle'); void panel.offsetWidth; panel.classList.add('twiggle');
      later(function () { panel.classList.remove('twiggle'); }, 700);
    }

    /* ---------------------------------------------------------------- the kit v0.4 (decision 57): the moves
     * Only under E.takeMovesOn(st) (`mv`), so chapter 12's pages never reach these. Design sections 1 to 4: at a turn that
     * spreads she taps the lender (struck, its small box open at once), types its new number, types her column's new number
     * in her style, then the answer; a slip is helped at its move, in the one slot under the column's line, the keypad dim
     * for its reading time. PC.ui.takes has the column (takeView's `moves`), the stacks (takeReserve), the keys (takeKey),
     * the taps (takeTapAct), the marks page (takeMarksHtml, takeMarksFlow) and the store at rest (takeStageAt). */
    function styleNow() { return o.style === 'one' || o.style === 'above' ? o.style : E.takeStyle(cat); }
    function curMove() { var M = q && q.moves && q.moves[q.col]; return M ? M[Math.min(q.move || 0, M.length - 1)] : null; }
    // a decide while the lender glows ('hers', after `ahead` or a pointer): a digit types nothing, the engine points
    function litDecide() { var m = curMove(); return !!(q && q.mode !== 'tap' && q.glow && m && m.move === 'touch'); }
    function litZone() { return q && q.glow ? q.glow : null; }
    function needMarks() {
      if (!q || q.col !== 0 || (q.move || 0) !== 0 || !q.plan.cols.some(function (c) { return c.spreads.length; })) return false;
      var it = st.queue[st.pos];
      if (it && it.moveStyle) return false;
      return dbg ? !!dbg.marks : !(cat && cat.takes && (cat.takes.style === 'one' || cat.takes.style === 'above'));
    }
    // a phase change: the column's taps wait 400 ms (a double tap meant as "go on" never lands as a touch)
    function toPhase(p) { phase = p; quietUntil = now() + TAKE_MS.ok; }
    function drawColM() {
      var bx = phase === 'help' || phase === 'end' || phase === 'busy' ? null : q.box || null, mini = !!bx && (bx.kind === 'lend' || bx.kind === 'get');
      var foc = doc.activeElement && doc.activeElement.closest ? doc.activeElement.closest('#tcol .ttarget') : null, fc = foc ? foc.getAttribute('data-col') : null;
      var lit = [];
      if (q.glow && phase !== 'help') lit.push(TAKE_ZONES.indexOf(q.glow));
      if (bx && bx.kind === 'lend') lit.push(bx.col);   // the struck lender glows while its box is open
      if (helpGlow >= 0) lit.push(helpGlow);
      // the answer box ringed at a decide and the answer (never while a lit lender waits for her touch: her digit stays pale)
      var ring = !!bx && bx.kind === 'answer' && (phase === 'type' || phase === 'tap' || phase === 'line' || phase === 'show') && !litDecide() ? q.col : -1;
      tcol.style.setProperty('--tn', String(q.plan.n));
      tcol.innerHTML = takeHtml(takeView(q.plan, { moves: true, marks: marks, boxes: boxes, on: ring, glow: glowCol, ask: askText, box: bx, typed: mini ? typed : '',
        miniOn: mini && phase === 'type', flash: flash, targets: phase === 'type' || phase === 'tap' ? q.targets || [] : [], lit: lit, ripple: ripple, wig: wig, col: q.col }));
      tcol.setAttribute('aria-label', askText);
      okKey.disabled = phase !== 'type' || litDecide() || (typed === '' && !q.okEmpty);
      if (fc != null) { var nf = tcol.querySelector('.ttarget[data-col="' + fc + '"]'); if (nf) { try { nf.focus({ preventScroll: true }); } catch (x) {} } }
    }
    // the one slot under the column's line (design section 3): a 'tap' or 'show' prompt stands under the lines; a move-help
    // or a pointer takes the column line's place (`help`: the reserve probe); each replaces the one there
    function slotSay(b, help, speak) {
      slot = b; slotHelp = !!help;
      say((help ? slotBase : base).concat([Object.assign({}, b, { slot: true })]));
      saying((help ? slotHeard : baseHeard).concat(heard([b])));
      if (speak) speakItems(heard([b]));
    }
    // the store at a move (design section 1): a lend's piece slides out and rests ('out', 600 ms), a get's ten opens (400 ms);
    // with Reduce Motion, and on a debug picture, at rest at once. Picture only: no key ever waits for it
    var storeGen = 0;
    function moveStore(po, glowZ) {
      if (!po) return;
      var g = ++storeGen, sp = po.spread;
      var at = function (stage) { var x = Object.assign({}, po, { spread: stage ? Object.assign({}, sp, { stage: stage }) : null }); if (glowZ) x.glow = glowZ; return x; };
      var after = function (fn, ms) { root.setTimeout(function () { if (g === storeGen && !frozen && frameEl.isConnected) fn(); }, ms); };
      if (sp && sp.stage === 'out') {
        if (reduceMotion || quick) return paintStore(at('out'));
        paintStore(at('slide'));
        return after(function () { paintStore(at('out')); }, TAKE_MS.slide);
      }
      if (sp && sp.stage === 'open' && !(reduceMotion || quick)) {
        paintStore(at('open'));
        return after(function () { paintStore(at(null)); }, TAKE_MS.open);
      }
      paintStore(at(null));
    }
    // the store at rest at the move she is at (a column outlined, a move picked up, an undo): a lend's piece resting 'out',
    // never a slide replayed
    function storeNowM() { var po = E.takePicture(def, qAt(), takeStageAt(q)); if (po && litZone()) po.glow = litZone(); paintStore(po); }
    /* A column outlined (v0.3's line, then): 'show' (Tallyheart's touches, her numbers), 'tap' (the lender glowing), or her
     * keys; picked up at a move (a reload, ‹, Camp), the marks so far lettered, the store at rest, the open box empty. */
    function outlineM(fresh) {
      advance = null; gotAct = null; glowCol = -1; helpGlow = -1; flash = null; ripple = -1; wig = -1;
      on = q.col; typed = '';
      boxes[q.col] = q.pale != null ? { v: String(q.pale), cls: 'pale' } : { v: '', cls: '' };
      marks = q.marks;
      storeNowM();
      var lines, said;
      if (q.col === 0 && fresh) {
        var F = takeFirst(def, q, { intro: firstIntro, fill: fill }), F0 = takeFirst(def, q, { intro: firstIntro, fill: fill, line: '' });
        lines = F.lines; said = F.heard; slotBase = F0.lines; slotHeard = F0.heard;
      } else {
        var lt = takeColLine(def, q), L = lt ? [T1(lt)] : [];
        var pre = fresh ? firstIntro : echoLines;
        lines = pre.concat(L); said = (fresh ? heard(pre) : []).concat(L);
        // (a help is about this column: an echo about the one before goes with the line; the page's intro stays)
        slotBase = fresh ? pre.slice() : []; slotHeard = heard(slotBase);
      }
      firstAsk = false;
      base = lines;
      baseHeard = q.col === 0 && fresh ? said : heard(lines);
      slot = null; slotHelp = false;
      toPhase('line');
      say(lines); saying(baseHeard);
      drawCol();
      var m = curMove(), k = q.move || 0, spreads = q.plan.cols[q.col].spreads.length;
      // (a later column: the keypad brought back into view, where the first column's bringPad put it: WebKit's scroll
      // anchoring moved a scrolled page 13px up between two columns, 1080 x 700 with Aa on)
      if (!fresh) bringPad();
      if (q.mode === 'show' && spreads) {
        toPhase('show'); pad.classList.add('away'); drawCol();
        if (k > 0) { var sp0 = movePrompt(k); if (sp0) slotSay(T1(sp0), false, false); return resumeM(); }
        advance = function () { hush(); showOpenM(); };
        return timedWait(save.settings.readAloud || !(q.col === 0 && fresh) ? said : heard(lines), 'step', showOpenM);
      }
      if (q.mode === 'tap' && spreads && m && m.move === 'touch' && q.tap) return tapM(said);
      if (k > 0) { var pr = movePrompt(k); if (pr) slotSay(T1(pr), false, false); }
      wakeM(said);
    }
    // the prompt a 'tap' or 'show' column stands at, move k (the step or the ask at it, else the last before it)
    function movePrompt(k) {
      if (q.mode === 'hers' || !q.plan.cols[q.col].spreads.length) return null;
      var S = E.takeShow(def, q.plan, q.col, { mode: q.mode, style: q.style, picture: q.picture }), M = q.moves[q.col];
      if (k >= M.length - 1) return S.line;
      var list = (q.mode === 'show' ? S.steps.slice(1) : S.taps).filter(function (x) { return x.idx <= k && x.say; });
      return list.length ? list[list.length - 1].say : null;
    }
    function wakeM(said) {
      toPhase('type'); advance = null;
      pad.classList.remove('away', 'dim', 'locked'); nextWrap.hidden = true; spreadBtn.hidden = true;
      if (q.box && q.box.kind === 'answer' && typed === '') boxes[q.col] = q.pale != null ? { v: String(q.pale), cls: 'pale' } : { v: '', cls: '' };
      drawCol();
      // (each move's clock starts when its box opens or its target is live; the first column's after its line, as v0.3's)
      if (said && said.length) startClock(said); else t0 = perfNow();
    }
    // 'show' (the worked example): the column's opening line, then Tallyheart's touches
    function showOpenM() {
      var b = T1(E.takeShow(def, q.plan, q.col, { mode: 'show', style: q.style, picture: q.picture }).steps[0].say);
      slotSay(b, false, false);
      advance = function () { hush(); showTouchM(); };
      if (stop('show0')) return;
      timedWait([b], 'step', showTouchM);
    }
    // 'show': Tallyheart taps the lender (a paw-tap ripple; Reduce Motion, a glow), it is struck, the store moves, she says
    // its new number and Lissa's box is ringed for it
    function showTouchM() {
      advance = null;
      var m = curMove();
      if (!m || m.move !== 'touch') return wakeM(null);
      var r = T.touch(st, def, m.col, now(), 0);
      if (!r || !r.accepted) return wakeM(null);
      keepSlot();
      q = T.question(st); marks = q.marks;
      ripple = m.col;
      var rg = ripple;
      if (!quick) root.setTimeout(function () { if (ripple === rg && frameEl.isConnected && !frozen) { ripple = -1; drawCol(); } }, 650);
      moveStore(r.picture);
      if (r.line) slotSay(T1(r.line), false, true);
      wakeM(null);
    }
    // 'tap' (the guided problem): the lender glows in the column and its zone in the store, the keypad dim, the tap prompt said
    function tapM(said) {
      var t = E.takeShow(def, q.plan, q.col, { mode: 'tap', style: q.style, picture: q.picture }).taps.filter(function (x) { return x.idx === (q.move || 0); })[0];
      toPhase('tap'); advance = null;
      pad.classList.remove('away'); pad.classList.add('dim'); spreadBtn.hidden = true;
      paintStore(E.takePicture(def, qAt(), Object.assign(takeStageAt(q), { glow: q.glow })));
      var b = t && t.say ? T1(t.say) : null;
      if (b) slotSay(b, false, false);
      speakItems((said || []).concat(b ? heard([b]) : []));
      drawCol();
      t0 = perfNow();
    }
    // the next move's phase: Tallyheart's touch ('show'), the glowing lender ('tap'), or her keys
    function resumeM() {
      var m = curMove(), spreads = q.plan.cols[q.col].spreads.length;
      if (q.mode === 'show' && spreads && m && m.move === 'touch') return showTouchM();
      if (q.mode === 'tap' && spreads && m && m.move === 'touch' && q.tap) return tapM(null);
      wakeM(null);
    }
    /* After a move (T.touch, or T.digit at a decide, a lend or a get): the next box opens at once and the store moves beside
     * it; a slip gets its move-help; a pointer its line in the slot (the lender lit where it says). */
    function afterMove(r) {
      quietUntil = now() + TAKE_MS.ok;
      q = T.question(st); marks = q.marks;
      if (r.help && r.help.say) return moveHelpM(r);
      if (r.off) { if (r.say && r.line) slotSay(T1(r.line), true, true); paintStore(E.takePicture(def, qAt(), Object.assign(takeStageAt(q), { glow: q.glow }))); return; }
      if (r.undone) { storeNowM(); return resumeM(); }
      if (r.pointer) {
        if (r.pointer === 'ahead') { typed = ''; boxes[q.col] = { v: String(r.pale), cls: 'pale' }; }
        if (r.line) slotSay(T1(r.line), true, true);
        moveStore(r.picture || E.takePicture(def, qAt(), takeStageAt(q)), litZone());
        return resumeM();
      }
      moveStore(r.picture, litZone());
      if (r.line && !(q.mode === 'tap' && curMove() && curMove().move === 'touch' && q.tap)) slotSay(T1(r.line), false, true);
      resumeM();
    }
    /* A move's help (design section 4): the slip's line in the slot, the move she missed made for her and glowing, the keypad
     * dim and deaf until the line can be read (or has been said); a tap moves on at once. Then the next move is hers. */
    function moveHelpM(r) {
      var H = r.help, b = T1((r.say || H.say || []).filter(Boolean).join(' '));
      toPhase('mhelp'); typed = '';
      helpGlow = H.glow ? TAKE_ZONES.indexOf(H.glow) : -1;
      pad.classList.remove('away'); pad.classList.add('dim');
      drawCol();
      moveStore(H.picture || E.takePicture(def, qAt(), takeStageAt(q)));
      slotSay(b, true, false);
      var done = function () { advance = null; helpGlow = -1; pad.classList.remove('dim'); resumeM(); };
      advance = function () { hush(); done(); };
      if (stop('mhelp')) return;
      timedWait([b], 'step', done);
    }
    // a right number turns its box green for 250 ms, then it is the gold mark
    function flashBox(bx, v) {
      if (quick || !bx) return;
      var f = { col: bx.col, row: bx.row, v: v };
      flash = f;
      root.setTimeout(function () { if (flash === f && frameEl.isConnected && !frozen) { flash = null; drawCol(); } }, 250);
    }
    function pressM(k) {
      if (!q) return;
      var bx = q.box || {}, A = takeKey({ phase: phase, k: k, typed: typed, kind: bx.kind, lit: litDecide(), now: now(), okLock: padLockedUntil });
      if (A.act === 'wiggle') return wiggle();
      if (A.act === 'ok') return submitM();
      if (A.act === 'digit') return digitM(k);
      if (A.act !== 'type') return;
      typed = A.typed;
      if (bx.kind === 'answer') boxes[q.col] = typed === '' && q.pale != null ? { v: String(q.pale), cls: 'pale' } : { v: typed, cls: '' };
      drawCol();
    }
    // a digit while the lender glows: the engine says `tap`'s line once, then makes the touch for her (both nudges)
    function digitM(k) {
      var r = T.digit(st, def, k, Math.max(0, perfNow() - t0), now());
      if (!r || r.ignored) return;
      keepSlot();
      afterMove(r);
    }
    /* The ringed box's OK (T.digit): a move's number, or the answer as v0.3 (right: the next column; wrong: the sand's help,
     * her marks kept). The page's 400 ms guard after an OK ignores OK only, never a digit. */
    function submitM() {
      var bx = q.box || {};
      if (typed === '' && !q.okEmpty) return;
      var res = T.digit(st, def, typed, Math.max(0, perfNow() - t0), now());
      if (!res) return;
      if (res.ignored) { if (res.ignored === 'tap') wiggle(); return; }
      padLockedUntil = now() + TAKE_MS.ok;
      if (res.pointer === 'onesFirst') {
        // her first digit typed left to right: not checked, not logged; the box clears, the ones box pulses
        typed = ''; boxes[0] = { v: '', cls: 'pulse' };
        var F = takeFirst(def, q, { intro: firstIntro, fill: fill, line: res.line });
        base = F.lines; baseHeard = F.heard; say(base); saying(F.heard);
        drawCol(); keepSlot();
        return startClock([T1(res.line)]);
      }
      if (keep) {
        if (res.entry) E.logTake(cat, res.entry);
        if (res.done) { o.recorded = E.recordLesson(cat, st); persist(); }
        else keepSlot();
      }
      var was = typed;
      typed = '';
      if (res.move === 'answer') return answerM(res);
      if (res.right && (bx.kind === 'lend' || bx.kind === 'get')) flashBox(bx, was);
      afterMove(res);
    }
    function answerM(res) {
      phase = 'busy'; on = -1; slot = null; slotHelp = false;
      var col = res.col;
      if (res.right) {
        boxes[col] = res.blank ? { v: '', cls: 'blank' } : { v: String(res.digit), cls: 'right' };
        marks = res.marks; drawCol();
        store({ col: col, spreads: 9, taken: true });
        return afterRight(res, false, false);
      }
      boxes[col] = { v: res.given === '' ? '' : String(res.given), cls: 'miss' };
      drawCol();
      wait(function () { help(res); }, TAKE_MS.miss);
    }
    // a tap on a column (her finger, a target's Space or Enter, the glowing zone): T.touch decides what it was
    function touchCol(col) {
      if (!q) return;
      var r = T.touch(st, def, col, now(), Math.max(0, perfNow() - t0));
      if (!r) return;
      if (r.ignored) { if (r.ignored === 'own') wigCol(col); return; }
      keepSlot();
      afterMove(r);
    }
    // her own top digit wiggles once (180 ms), at every turn, needed or not: no line, no glow
    function wigCol(col) {
      var w = ++wigGen;
      wig = col; drawCol();
      root.setTimeout(function () { if (w === wigGen && frameEl.isConnected) { wig = -1; drawCol(); } }, 180);
    }
    // the 'tap' page's tap off the glow: "The rows: the glowing ones." once, the zone glowing again
    function offTapM() {
      if (!q) return;
      var r = T.tap(st, true, def, now());
      if (!r) return;
      if (r.say && r.line) { slotSay(T1(r.line), true, true); keepSlot(); }
      paintStore(E.takePicture(def, qAt(), Object.assign(takeStageAt(q), { glow: q.glow })));
    }
    function pressAt(e) { return press0 ? { slide: Math.max(Math.abs(e.clientX - press0.x), Math.abs(e.clientY - press0.y)), held: perfNow() - press0.t } : { slide: 0, held: 0 }; }
    // the column under a tap above the rule (its box's width and half of each gap), or null
    function colAt(e) {
      var rule = tcol.querySelector('.trule'), rb = rule && rule.getBoundingClientRect();
      if (rb && e.clientY > rb.top) return null;
      var bs = tcol.querySelectorAll('.tbox[data-col]'), R = [];
      for (var i = 0; i < bs.length; i++) R.push(bs[i].getBoundingClientRect());
      var gap = R.length > 1 ? Math.max(0, R[1].left - R[0].right) : 0;
      for (var j = 0; j < R.length; j++) if (e.clientX >= R[j].left - gap / 2 && e.clientX <= R[j].right + gap / 2) return +bs[j].getAttribute('data-col');
      return null;
    }
    function doTap(A) {
      if (A.act === 'advance') { if (advance) advance(); return; }
      if (A.act === 'touch') return touchCol(A.col);
      if (A.act === 'wiggle') return wigCol(A.col);
      if (A.act === 'off') return offTapM();
    }
    function colClickM(e) {
      var P = pressAt(e), cl = function (s) { return e.target && e.target.closest ? e.target.closest(s) : null; };
      var tg = cl('.ttarget'), top = cl('.ttop'), col = tg ? +tg.getAttribute('data-col') : colAt(e);
      doTap(takeTapAct({ where: 'col', slide: P.slide, held: P.held, phase: phase, advance: !!advance, now: now(), quiet: quietUntil, col: col, target: tg ? col : null,
        onTop: !!(top && q && +top.getAttribute('data-col') === q.col), her: q ? q.col : -1, kind: q && q.box ? q.box.kind : null, boxCol: q && q.box ? q.box.col : null, typed: typed }));
    }
    function panelClickM(e) {
      var P = pressAt(e);
      doTap(takeTapAct({ where: 'panel', slide: P.slide, held: P.held, phase: phase, advance: !!advance, now: now(), quiet: quietUntil, zone: zoneAt(e.clientX), glow: q ? q.glow : null }));
    }
    function stackClickM(e) {
      var P = pressAt(e);
      doTap(takeTapAct({ where: 'stack', slide: P.slide, held: P.held, phase: phase, advance: !!advance }));
    }
    /* The marks page (design section 2), before her first spread when she has not chosen: the interact area holds the two
     * pictures (marksPage), the keypad hidden, the store at the problem's top; the set's lines (or the kit's) one at a time;
     * a pick saves her style (and this lesson's); then the problem's prompt, as it would have come. */
    function marksPhase(then) {
      var page = E.takeMarksPage(def, cat), fb = function (b) { var x = Object.assign({}, b); x.who = b.who || teacher; x.text = fill(b.text); return x; };
      var P = { lines: page.lines.map(fb), options: page.options, after: { one: page.after.one.map(fb), above: page.after.above.map(fb) } };
      var labels = P.options.map(function (op) { return { text: op.label }; });
      toPhase('marks'); advance = null;
      stack.style.minHeight = ''; stack.innerHTML = '';
      paintStore(E.takePicture(def, qAt(0), { col: 0, spreads: 0 }));
      tcol.hidden = true; padWrap.hidden = true; nextWrap.hidden = true; spreadBtn.hidden = true;
      var host = doc.createElement('div');
      host.className = 'tpickwrap';
      box.querySelector('.counts').insertBefore(host, tcol);
      var mp = marksPage(host, { page: P });
      // (the stack held from the start at its tallest, every line and the longer answer line, so the pictures never move as
      // the lines come one at a time; the keypad's own rule)
      frameEl.classList.add('tmkpage');
      var tall = function () { return Math.ceil(stack.getBoundingClientRect().height - 0.01); }, hmax = 0, last = P.lines.slice(0, Math.max(0, P.lines.length - 1));
      [P.lines, last.concat(P.after.one), last.concat(P.after.above)].forEach(function (L) { say(L); hmax = Math.max(hmax, tall()); });
      stack.innerHTML = '';
      if (hmax) stack.style.minHeight = hmax + 'px';
      // (a phone held upright: the pictures stacked under four balloons run under the screen; the panel shorter first, never
      // under half its height, as the take page's own fallback; the pictures brought into view once they are live)
      var vh0 = root.innerHeight || 0;
      if (vh0 && root.matchMedia && root.matchMedia('(orientation: portrait)').matches) {
        var over0 = host.getBoundingClientRect().bottom + (root.scrollY || root.pageYOffset || 0) - vh0;
        if (over0 > 0) { var ph0 = panel.getBoundingClientRect().height; panel.style.height = Math.max(Math.round(ph0 / 2), Math.floor(ph0 - over0)) + 'px'; }
      }
      var flow = takeMarksFlow({ page: P }, {
        show: function (list, g) { say(list); saying(heard(list).concat(labels)); mp.glow(g); },
        live: function () { mp.live(true); bringIn(host); },
        press: function (s) { mp.press(s); },
        // (her pick saved; PC.debug.takes writes nothing to the test cat: the page's own style follows the pick)
        save: function (s) { st.style = s; if (keep) { E.setTakeStyle(cat, s); persist(); } else { o.style = s; if (dbg) dbg.marks = false; } },
        wait: function (items, fn) { timedWait(heard(items), 'step', fn); },
        hush: hush,
        // Read to me: after the lines, each label said as its button glows
        labels: function () {
          if (!(save.settings.readAloud && 'speechSynthesis' in root)) return;
          var g = waitGen;
          mp.glow('one');
          speakItems([labels[0]], function () { if (g !== waitGen || !frameEl.isConnected) return; mp.glow('above'); speakItems([labels[1]], function () { if (g === waitGen && frameEl.isConnected) mp.glow('both'); }); });
        },
        goOn: function () { advance = null; mp.remove(); stack.style.minHeight = ''; panel.style.height = ''; frameEl.classList.remove('tmkpage'); tcol.hidden = false; padWrap.hidden = false; then(); }
      });
      mp.onPick(function (s) { flow.pick(s); });
      advance = function () { flow.tap(); };
      flow.start();
    }

    /* A problem: the next one in the queue, at the column she is on (a lesson picked up comes back at its column). */
    function ask() {
      q = T.question(st);
      if (!q) return finish();
      if (mv) {
        // (a problem with no look yet takes her style as it begins: a change on the shelf reaches a lesson waiting in its place;
        // her first spread with no style chosen opens the marks page first, before the prompt)
        var it0 = st.queue[st.pos];
        if (it0 && !it0.moveStyle) { st.style = styleNow(); q = T.question(st); }
        if (needMarks()) return marksPhase(ask);
        frameEl.classList.toggle('tsecond', E.takeMoveMarks(q.plan, q.style, q.plan.n, 0).some(function (m) { return !!m.m2; }));
      }
      typed = ''; echoLines = []; glowCol = -1; marks = q.marks;
      boxes = q.plan.cols.map(function (c, i) { return i < q.col ? (q.got[i] === '' ? { v: '', cls: 'blank' } : { v: String(q.got[i]), cls: 'right' }) : { v: '', cls: '' }; });
      askText = fill(E.takeQuestion(def, q).ask.text);
      firstIntro = firstAsk ? asList(o.intro) : [];
      pad.classList.remove('locked');
      on = q.col; phase = 'line';
      drawCol();
      stack.innerHTML = '';
      reserve();
      outline(true);
      fit();
      bringPad();
    }
    /* A column outlined: its line (section 1), then 'show''s steps, 'tap''s taps, or the keypad awake. */
    function outline(fresh) {
      if (mv) return outlineM(fresh);
      advance = null; gotAct = null; glowCol = -1;
      on = q.col; typed = ''; boxes[q.col] = { v: '', cls: '' };
      marks = q.marks;
      store({ col: q.col, spreads: q.mode === 'tap' ? q.tapped : 0 });
      var lines, said;
      if (q.col === 0 && fresh) {
        var F = takeFirst(def, q, { intro: firstIntro, fill: fill });
        lines = F.lines; said = F.heard;
      } else {
        var lt = takeColLine(def, q), L = lt ? [T1(lt)] : [];
        var pre = fresh ? firstIntro : echoLines;
        lines = pre.concat(L); said = (fresh ? heard(pre) : []).concat(L);
      }
      firstAsk = false;
      base = lines;
      // (Read to me's button: the first column in section 6's order, the question in words before the column's line,
      // split out of the joined balloon; a later column, what is on the page, Chispapaw's echo with it. A 'show' step, a
      // 'tap' line or "up here" is said after it, so a first column's question in words is never dropped)
      baseHeard = q.col === 0 && fresh ? said : heard(lines);
      phase = 'line';
      say(lines); saying(baseHeard);
      drawCol();
      if (q.show) {
        phase = 'show'; pad.classList.add('away'); drawCol();
        advance = function () { hush(); playShow(); };
        // (Read to me off: the first column waits for what is lettered, not for the question in words, which is only said)
        return timedWait(save.settings.readAloud || !(q.col === 0 && fresh) ? said : heard(lines), 'step', playShow);
      }
      if (q.tap) return startTap(said);
      wake(said);
    }
    function wake(said) {
      phase = 'type'; typed = ''; on = q.col; advance = null;
      pad.classList.remove('away', 'dim', 'locked'); nextWrap.hidden = true; spreadBtn.hidden = true;
      boxes[q.col] = { v: '', cls: '' };
      drawCol();
      startClock(said || []);
    }
    /* 'show': Tallyheart works the column's spreads before she types it, a step a line; a tap moves on. */
    function playShow() {
      var S = E.takeShow(def, q.plan, q.col, { mode: 'show', helped: helpedMap(), picture: q.picture }), steps = S ? S.steps : [];
      if (!steps.length) return wake([]);
      phase = 'show'; pad.classList.add('away');
      var step = function (j) {
        var s = steps[j], line = T1(s.say), last = j === steps.length - 1;
        marks = s.marks; drawCol();
        say(base.concat([line])); saying(baseHeard.concat(heard([line])));
        flyTo(s.picture, function () {});
        if (last) { landNow(); wake([line]); stop('show' + j); return; }
        if (stop('show' + j)) return;
        advance = function () { landNow(); hush(); step(j + 1); };
        timedWait([line], 'step', function () { step(j + 1); });
      };
      step(0);
    }
    /* 'tap': the zone to spread glows and the keypad is dim; she taps it (or the lending digit), Space, or the hidden
     * button; a tap elsewhere makes it glow again and says "The rows: up here." once; a digit wiggles it. */
    function startTap(said) {
      tapShow = E.takeShow(def, q.plan, q.col, { mode: 'tap', helped: helpedMap(), picture: q.picture });
      var cur = tapShow.taps[Math.min(q.tapped, tapShow.taps.length - 1)], line = T1(cur.say);
      phase = 'tap'; tapWant = cur.glow;
      pad.classList.remove('away'); pad.classList.add('dim');
      paintStore(cur.picture);
      say(base.concat([line])); saying(baseHeard.concat(heard([line])));
      speakItems((said || []).concat([line]));
      spreadBtn.textContent = takeSpreadLabel(cur.glow); spreadBtn.hidden = false;
      drawCol();
    }
    function tapZone(zone) {
      if (mv) { var zc = typeof zone === 'number' ? zone : TAKE_ZONES.indexOf(zone); return zc >= 0 ? touchCol(zc) : offTapM(); }
      if (phase !== 'tap') return;
      if (zone !== tapWant) {
        var r0 = T.tap(st, true);
        if (r0 && r0.say && tapShow.here[r0.glow]) { var hl = T1(tapShow.here[r0.glow]); say(base.concat([hl])); saying(baseHeard.concat(heard([hl]))); speakItems([hl]); keepSlot(); }
        // (drawn again, so its glow pulses from the start)
        paintStore(E.takePicture(def, qAt(), { col: q.col, spreads: st.tapped, glow: tapWant }));
        return;
      }
      var r = T.tap(st);
      if (!r) return;
      keepSlot();
      phase = 'busy'; spreadBtn.hidden = true;
      marks = r.marks; drawCol();
      advance = landNow;
      flyTo(E.takePicture(def, qAt(), { col: q.col, spreads: r.tapped, flight: 'end' }), function () {
        advance = null;
        q = T.question(st);
        if (r.left) {
          var nx = tapShow.taps[r.tapped], nl = T1(nx.say);
          phase = 'tap'; tapWant = nx.glow;
          paintStore(nx.picture);
          say(base.concat([nl])); saying(baseHeard.concat(heard([nl]))); speakItems([nl]);
          spreadBtn.textContent = takeSpreadLabel(nx.glow); spreadBtn.hidden = false;
          return;
        }
        var al = T1(E.takeLine(def, q.plan, q.col, 'after', 'tap', q.full));
        say(base.concat([al])); saying(baseHeard.concat(heard([al])));
        wake([al]);
      });
    }
    function press(k) {
      if (mv) return pressM(k);
      if (phase === 'tap') { if (k !== 'del') wiggle(); return; }   // a digit before the spread types nothing
      if (phase !== 'type' || now() < padLockedUntil) return;
      if (k === 'ok') return submit();
      typed = takePress(typed, k);
      boxes[q.col] = { v: typed, cls: '' };
      drawCol();
    }
    /* One column's OK (E.takes.digit): right, the ones-first pointer, or a miss and its help. */
    function submit() {
      if (typed === '' && !q.okEmpty) return;
      var res = T.digit(st, def, typed, Math.max(0, perfNow() - t0), now());
      if (!res) return;
      if (res.ignored) { if (res.ignored === 'tap') wiggle(); return; }
      // keys are ignored for 400 ms after every OK: the second tap of a double tap never reaches the next box
      padLockedUntil = now() + TAKE_MS.ok;
      if (res.pointer) {
        // her first digit typed left to right: not checked, not logged; the box clears, the ones box pulses
        typed = ''; boxes[0] = { v: '', cls: 'pulse' };
        var F = takeFirst(def, q, { intro: firstIntro, fill: fill, line: res.line });
        base = F.lines; baseHeard = F.heard; say(base); saying(F.heard);
        drawCol(); keepSlot();
        return startClock([T1(res.line)]);
      }
      phase = 'busy';
      if (keep) {
        if (res.entry) E.logTake(cat, res.entry);
        // the last answer finishes the lesson: recorded now, not after its line
        if (res.done) { o.recorded = E.recordLesson(cat, st); persist(); }
        else keepSlot();
      }
      var col = res.col;
      on = -1;
      if (res.right) {
        boxes[col] = res.blank ? { v: '', cls: 'blank' } : { v: String(res.digit), cls: 'right' };
        if (res.spread && res.spread.length) { drawCol(); return playSpread(res); }
        marks = res.marks; drawCol();
        store({ col: col, spreads: 9, taken: true });
        return afterRight(res, false, false);
      }
      boxes[col] = { v: res.given === '' ? '' : String(res.given), cls: 'miss' };
      drawCol();
      wait(function () { help(res); }, TAKE_MS.miss);
    }
    /* 'hers': a right digit tells the page she spread in her head; the store catches up (a spread at a time), the
     * lenders are struck and this column lettered, then what is taken goes pale. A tap draws the end at once. */
    function playSpread(res) {
      var col = res.col, n = res.spread.length, k = 0, helped = helpedMap(), qa = qAt(col), hurry = false;
      var landed = function () {
        k++;
        if (k < n && hurry) k = n;
        marks = k < n ? E.takeMarks(q.plan, q.mode, helped, col, k) : res.marks;
        drawCol();
        if (k < n) return fly();
        store({ col: col, spreads: 9, taken: true });
        afterRight(res, true, hurry);
      };
      var fly = function () { flyTo(E.takePicture(def, qa, { col: col, spreads: k + 1, flight: 'end' }), landed); };
      advance = function () { hurry = true; landNow(); };
      if (reduceMotion || quick) { k = n - 1; return landed(); }
      fly();
    }
    /* After a right column: Chispapaw's echo (chapter 12 on) over the next column's line, which is outlined 0.9 s
     * after the last spread lands, or at once with no spread (after the echo's reading time when she echoes). */
    function afterRight(res, spread, hurry) {
      advance = null;
      if (res.problemDone) return problemEnd(res);
      if (stop('landed')) return;
      var e = echoOf(echoInfo(res.col)), d = spread && !hurry ? TAKE_MS.outline : 0;
      echoLines = e ? [e] : [];
      var next = function () { advance = null; q = T.question(st); outline(false); };
      if (!d && !e) return next();
      advance = function () { hush(); next(); };
      // (the echo lettered and said at once; the next column once it can be read, or has been said, and the 0.9 s)
      if (e) { say(echoLines); saying(heard(echoLines)); return timedWait(heard(echoLines), 'step', d ? function () { wait(next, d); } : next); }
      wait(next, d);
    }
    /* A miss: the help in the sand (section 2), a step a line; the slip's line stays above the steps; the digit is
     * written into the box at the end, and "Got it!" outlines the next column. A tap on the sand moves on one step. */
    function help(res) {
      var H = res.help, steps = H.steps, col = res.col, at = 0, startedAt = now();
      // (a phone held sideways with Aa on: the counter joins the step's line, section 6's named fallback)
      var join = !!(root.matchMedia && root.matchMedia(TAKE_PHONE).matches && save.settings.bigText);
      phase = 'help'; on = -1;
      pad.classList.add('away'); nextWrap.hidden = true;
      var show = function (i) {
        at = i;
        var s = steps[i];
        paintSand(s);
        marks = s.marks; glowCol = steps[0].glow ? col : -1;
        if (s.write) boxes[col] = H.blank ? { v: '', cls: 'blank' } : { v: String(H.digit), cls: 'right' };
        drawCol();
        var L = takeHelpStack(H, i, teacher, join).map(function (l) { return l.text ? Object.assign({}, l, { text: fill(l.text) }) : l; });
        say(L); saying(heard(L));
      };
      var end = function (said) {
        advance = null;
        speakItems(said);
        gotBtn.textContent = 'Got it!'; nextWrap.hidden = false;
        gotAct = function () {
          padLockedUntil = now() + TAKE_MS.ok;   // the double-tap guard after "Got it!"
          marks = res.marks; glowCol = -1;
          if (res.problemDone) return problemEnd(res);
          q = T.question(st); outline(false);
        };
        bringGot();
        try { gotBtn.focus({ preventScroll: true }); } catch (x) {}
        stop('help');
      };
      var step = function (i) {
        show(i);
        var s = steps[i], line = T1(s.say);
        if (s.write) return end([line]);
        advance = function () { if (now() - startedAt < TAKE_MS.tapGuard || at >= steps.length - 1) return; hush(); step(at + 1); };
        timedWait([line], s.hop ? 'hop' : 'step', function () { step(i + 1); });
      };
      // (PC.debug.takes: the help at a step, for a picture: its last, "Got it!", by default)
      if (dbg && dbg.stop === 'help') {
        var k = Math.max(0, Math.min(steps.length - 1, dbg.at < 0 ? steps.length + dbg.at : dbg.at));
        if (steps[k].write) return step(k);
        show(k); frozen = true; return;
      }
      step(0);
    }
    /* The problem's end: the answer row complete, the store showing what is left, its one line (or its own `right`
     * lines, which wait for Next); then the next problem, or the lesson's end. The stack's height is released. */
    function problemEnd(res) {
      phase = 'end'; echoLines = []; on = -1; glowCol = -1;
      stack.style.minHeight = '';
      marks = res.marks; drawCol();
      store('done', q.plan.n);
      pad.classList.add('locked'); okKey.disabled = true;
      var e = res.entry ? (def.echo ? setEcho({ problem: true, a: res.entry.a, b: res.entry.b, answer: res.entry.answer, correct: res.entry.correct, helped: res.entry.helped }) : (res.entry.correct ? echoOf({ problem: true, a: res.entry.a, b: res.entry.b, answer: res.entry.answer }) : null)) : null;
      var Ed = takeEnd(def, res, { fill: fill, echo: e });
      var lines = (res.blank && res.right && res.blankLine ? [T1(res.blankLine)] : []).concat(Ed.lines);
      say(lines); saying(heard(lines));
      var goOn = function () { advance = null; gotAct = null; if (res.done) return finish(); ask(); };
      if (Ed.next) {
        speakItems(heard(lines));
        pad.classList.add('away'); gotBtn.textContent = 'Next'; nextWrap.hidden = false;
        gotAct = goOn;
        bringGot();
        later(function () { try { gotBtn.focus({ preventScroll: true }); } catch (x) {} }, 50);
        stop('end');
        return;
      }
      advance = function () { hush(); goOn(); };
      if (stop('end')) return;
      timedWait(heard(lines), 'end', goOn);
    }
    function finish() {
      if (!frameEl.isConnected) return;   // (the page left: no done page, no reward, over the next screen)
      keyHandler = null; relayoutFn = null;
      inLesson = false; phase = 'done';
      var sum = T.summary(st);
      // recorded at the last answer; this only catches a lesson that somehow was not
      if (keep && !o.recorded && cat.lesson && cat.lesson.state === st) { o.recorded = E.recordLesson(cat, st); persist(); }
      if (o.onDone) o.onDone(sum, o.recorded);
      updateBar();   // the keypad screen is over: her Case File's button is back
    }
    function zoneAt(x) {
      var rs = art.querySelectorAll('.pc-zone');
      for (var i = 0; i < rs.length; i++) { var b = rs[i].getBoundingClientRect(); if (x >= b.left && x <= b.right) return rs[i].getAttribute('data-zone'); }
      return null;
    }
    pad.addEventListener('click', function (e) { var b = e.target.closest('.key'); if (b) press(b.getAttribute('data-k')); });
    gotBtn.addEventListener('click', function () { var f = gotAct; gotAct = null; if (!f) return; nextWrap.hidden = true; f(); });
    spreadBtn.addEventListener('click', function () { tapZone(tapWant); });
    // the tap target: the glowing zone, the panel's full height (generous), or the lending digit's column in the column, its
    // full height (hit by x against its box, 6 px either side: the lending digit alone is under 44 px, and a near miss said
    // "up here" though she tapped the right column; only one thing can be tapped in this phase)
    panel.addEventListener('click', function (e) { if (mv) return panelClickM(e); if (phase === 'tap') return tapZone(zoneAt(e.clientX) || 'off'); if (advance) advance(); });
    tcol.addEventListener('click', function (e) {
      if (mv) return colClickM(e);
      if (phase !== 'tap') { if (advance && phase !== 'help') advance(); return; }
      var w = TAKE_ZONES.indexOf(tapWant), wb = tcol.querySelector('.tbox[data-col="' + w + '"]'), r = wb && wb.getBoundingClientRect();
      tapZone(r && e.clientX >= r.left - 6 && e.clientX <= r.right + 6 ? tapWant : 'off');
    });
    stack.addEventListener('click', function (e) { if (mv) return stackClickM(e); if (phase === 'tap') return tapZone('off'); if (advance && phase !== 'help') advance(); });
    // (the kit v0.4: a press that slides more than 10 px or is held more than 0.5 s is not a tap)
    if (mv) [tcol, panel, stack].forEach(function (el) { el.addEventListener('pointerdown', function (e) { press0 = { x: e.clientX, y: e.clientY, t: perfNow() }; }); });
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (mv && (e.key === ' ' || e.key === 'Enter')) {
        // a tap target focused (VoiceOver, a keyboard): Space or Enter taps it; Space on the 'tap' page taps the glowing lender
        var tgt = doc.activeElement && doc.activeElement.closest ? doc.activeElement.closest('#tcol .ttarget') : null;
        if (tgt) { e.preventDefault(); if (phase === 'type' || phase === 'tap') touchCol(+tgt.getAttribute('data-col')); return; }
        if (e.key === ' ' && phase === 'tap' && q && q.glow) { e.preventDefault(); return touchCol(TAKE_ZONES.indexOf(q.glow)); }
      }
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); }
      else if (e.key === 'Backspace') { e.preventDefault(); press('del'); }
      else if (e.key === 'Enter') { e.preventDefault(); if (!nextWrap.hidden) gotBtn.click(); else if (phase === 'type') press('ok'); else if (phase === 'tap') wiggle(); else if (advance) advance(); }
      else if (e.key === ' ') { if (phase === 'tap') { e.preventDefault(); tapZone(tapWant); } else if (advance && phase !== 'type') { e.preventDefault(); advance(); } }
    };
    // (a font that loads late, a turned screen, Aa: the stack's held height measured again)
    relayoutFn = function () { if (q && phase !== 'end' && phase !== 'help' && phase !== 'done' && phase !== 'marks') { reserve(); fit(); } };
    updateBar();
    // (chapter 12's review: a take page opened while a Warrior Counts re-sit waits, a chapter's lesson or a store round picked
    // up, says Tallyheart's waiting line on a page of its own, with Next, before the first column: over the column, with the
    // keypad brought in, it lay under the bar on a sideways iPad, and it is her only warning before her first take answer
    // sets the re-sit aside. PC.debug.takes('first') passes it with Next, as she would)
    var wAlone = o.waitLine && asList(o.intro).some(function (l) { return l.text === o.waitLine; }) ? o.waitLine : null;
    if (wAlone) {
      o.intro = asList(o.intro).filter(function (l) { return l.text !== wAlone; });
      var q0 = T.question(st), wl = [T1(wAlone)];
      if (q0) paintStore(E.takePicture(def, { plan: q0.plan, col: q0.col, picture: q0.picture }, { col: q0.col, spreads: 0 }));
      phase = 'wait';
      say(wl); saying(heard(wl)); speakItems(heard(wl));
      pad.classList.add('away'); gotBtn.textContent = 'Next'; nextWrap.hidden = false;
      gotAct = function () { hush(); pad.classList.remove('away'); ask(); };
      later(function () { gotBtn.focus({ preventScroll: true }); }, 50);
    } else ask();
    return { press: press, tap: function (z) { tapZone(z || tapWant); } };
  }

  /* PC.debug.spanish(what), for the tools (chapter 12's spec, section 6: tools/shots.mjs's es: targets, dev/webkit/run.mjs's
   * `spanish` job): the pages that carry Chispapaw's Spanish, on the cat on screen (a test cat), built from inline copies of
   * the spec's section 2 sets and the paw thing's frame, or from PC.story.ch12's own when it has them, never saved (a Counts
   * page's answer is put back: the cat as it was):
   *   echo          the warm-up's echo page after 7 × 8 right (her hard pick, quick: the remembered line, then the echo)
   *   take          the end of 475 − 132 with its echo
   *   skip          the paw thing after its fifth tap (the gloss in, Next waiting)
   *   worked        254 − 131 at its first column (the prompt joined); worked:tens at its tens, the school words in
   *   try           58 − 23 at its first column (its prompt with the column's line, one balloon; three in v0.2); try:pointer
   *                 after a leading 3 typed first (the pointer)
   *   store         175 − 42 at its first column (Glintstar's question)
   * Returns true or an error string, as PC.debug.takes does. */
  var ES_DEBUG = { echo: 1, take: 1, skip: 1, worked: 1, 'worked:tens': 1, 'try': 1, 'try:pointer': 1, store: 1 };
  function esT(text) { return { who: 'tallyheart', text: text }; }
  var ES_DEBUG_SETS = {
    'ch12-warm': { teacher: 'tallyheart', warmHard: { table: 'all', at: [0, 1], alt: [{ a: 3, b: 8, table: 3 }, { a: 4, b: 7, table: 4 }, { a: 9, b: 6, table: 9 }] },
      facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }], praise: [], fast: [], done: '',
      echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }, { who: 'chispapaw', text: 'My little Tall One says these every night! I never knew what they MEANT.' }] } },
    'ch12-take': { op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
      facts: [{ a: 254, b: 131, regroup: 'show', prompt: 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.', right: [esT('One square, two rows, three loose left.')] },
        { a: 58, b: 23, prompt: [esT('Now you try, all by yourself. Little take-aways first, then big.')] },
        { a: 76, b: 42, prompt: [{ who: 'chispapaw', kind: 'whisper', text: 'My little Tall One always sighs at homework.' }] }, [475, 132], [368, 145]],
      echo: { on: [[475, 132]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] } },
    'ch12-store': { op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, twins: false, done: '',
      facts: [{ a: 175, b: 42, prompt: [{ who: 'glintstar', text: 'How many stay in the store, {name}{ending}?' }], right: [{ who: 'glintstar', text: 'One hundred thirty-three in the store.' }] }] }
  };
  var ES_DEBUG_SKIP = { board: 'DEBUG.', scene: { set: 'den', cam: 'inside', opts: { weather: 'clear' }, cast: [{ who: 'snorer', pose: 'sit', at: 'sleeper-1' }, { who: 'chispapaw', pose: 'loaf', at: 'nest' }] },
    caption: ['You do the paws. She does the words.'], say: [{ who: 'chispapaw', lang: 'es', text: '{es:aContar}' }],
    skip: { table: 10, groups: 5, paws: 'both', teacher: 'chispapaw', lang: 'es', carry: false, prompt: '**Tap** your forepaws.', next: 'f075' } };
  function spanishDebug(what) {
    if (!E || typeof E.esLine !== 'function' || typeof E.takePlan !== 'function') return 'no Spanish in this build';
    if (!ES_DEBUG[what]) return 'spanish: echo, take, skip, worked, worked:tens, try, try:pointer or store';
    if (!cat) { cat = E.addCat(save, { now: now() }) || save.cats[0]; save.current = cat.id; }
    var ch = PC.story && PC.story.ch12;
    var setOf = function (id) { var d = ch && ch.counts && ch.counts[id]; return Object.assign({ id: id }, E.util.clone(d && typeof d === 'object' ? d : ES_DEBUG_SETS[id])); };
    clearTimers(); stopSpeech();
    if (fileState) closeFile(true);
    relayoutFn = null; keyHandler = null; currentSpeech = [];
    view = { name: 'frame', opts: {} };
    $('screen').classList.remove('enter', 'enter-back');
    // (`own`: the echo page and the Spanish count keep the scroll the page itself made after the answer or the last tap, from
    // a question page at the top, as in play: chapter 12's review brings Next in there on a phone held sideways)
    var t = now(), done = function (own) { renderedAt = now(); renderedPerf = perfNow(); updateBar(); if (!own) root.scrollTo(0, 0); return true; };
    if (what === 'echo') {
      // her hard pick first, answered right and quick on the page's own keypad; the cat put back as it was after it
      var wd = setOf('ch12-warm'), kept = E.util.clone(cat);
      var tb = typeof E.warriorAnchor === 'function' ? E.warriorAnchor(7, 8, stories()) : 8;
      var wst = E.counts.start(wd, { facts: [{ a: 7, b: 8, table: tb, hard: true }].concat(wd.facts.slice(2)), set: wd.id, mode: 'chapter', now: t });
      runLesson({ def: wd, state: wst, intro: [], mode: 'debug', frameId: 'es-echo', onDone: function () {} });
      renderedAt = now() - UI_GUARD_MS - 1; renderedPerf = perfNow() - UI_GUARD_MS - 1;   // (past the double-tap guard: these taps are the tool's)
      root.scrollTo(0, 0);
      ['5', '6', 'ok'].forEach(function (k) { var b = doc.querySelector('#screen .key[data-k="' + k + '"]'); if (b) b.click(); });
      Object.keys(cat).forEach(function (k) { delete cat[k]; });
      Object.assign(cat, kept);
      persist();
      return $('lessonNext') && !$('lessonNext').hidden ? done(true) : 'spanish: no echo after 7 × 8';
    }
    if (what === 'skip') {
      // the paw thing's frame (the chapter's own when it has it), its five taps past the double-tap guard (a clock of
      // this call's own, as dev/webkit/run.mjs's shott: does)
      var f = ch && ch.frames && ch.frames.f074 && ch.frames.f074.skip && ch.frames.f074.skip.lang === 'es' ? ch.frames.f074 : ES_DEBUG_SKIP;
      renderSkip(f, 'f074');
      root.scrollTo(0, 0);
      var realNow = Date.now, clock = realNow.call(Date);
      Date.now = function () { clock += 1000; return clock; };
      try { for (var i = 0; i < 5; i++) if (typeof frameTap === 'function') frameTap(); } finally { Date.now = realNow; }
      return $('nextBtn') ? done(true) : 'spanish: the count did not wait for Next';
    }
    // the take pages: chapter 12's own sets, on the take page in debug mode (nothing saved)
    var def = setOf(what === 'store' ? 'ch12-store' : 'ch12-take');
    var facts = what === 'take' ? [[475, 132]] : what === 'try' || what === 'try:pointer' ? [def.facts[1]] : def.facts;
    var st = E.takes.start(def, { facts: facts, set: def.id, mode: 'chapter', now: t, logged: 0 }), o = { mode: 'debug', debug: { quick: true }, frameId: 'es-' + what, onDone: function () {} }, keys = null;
    if (what === 'take') { E.takes.digit(st, def, 3, 3000, t - 60000); E.takes.digit(st, def, 4, 3000, t - 50000); keys = ['3', 'ok']; o.debug.stop = 'end'; }
    if (what === 'worked:tens') E.takes.digit(st, def, 3, 3000, t - 60000);
    if (what === 'try:pointer') keys = ['3', 'ok'];
    var h = runTakes(Object.assign({ def: def, state: st, intro: [] }, o));
    if (keys) keys.forEach(function (k) { h.press(k); });
    return done();
  }
  /* PC.debug.takes(what), for the tools (section 8: tools/shots.mjs's take: targets, dev/webkit/run.mjs's `takes` job):
   * the take page on the cat on screen (a test cat), built from definitions of its own (no chapter has a take set,
   * and tests/fixtures/takes-stub.js is not served), never saved and never logged:
   *   first   chapter 12's worked example (254 − 131, 'show', its prompt), the first column, the prompt joined, the
   *           Warrior Counts' waiting line over it (wWait)
   *   q       503 − 278 'hers' at its tens: the ones right, the 3 struck with 13 over it, the 5 and the 0 struck
   *   show    503 − 278 'show', its second step: a square spread, the zero lettered 10
   *   tap     43 − 16 'tap': the rows glowing, the keypad dim
   *   spread  503 − 278: 5 at the ones, the spreads landed, what is taken pale
   *   echo    the same, with a stub Spanish balloon from `o.echo` over the tens' line
   *   sand    503 − 278's ones answered 0 (`zero`): the help's last step, three balloons and "Got it!"
   *   done    503 − 278 right in every column: two squares, two rows and five loose left, and its line
   *   shelf   the Training Hollow's shelf (Count the store open), through go('hollow') with `opts.stories`
   *   store   a Count the store round's first problem, its introduction over its first column
   * The kit v0.4 (decision 57): every spread screen above but `first` (q, show, tap, spread, echo, sand, done) plays with
   * `taught: E.TAKE_STEPS`, so it shows the moves (503 − 278's six moves made before its tens, its answer, its help); and:
   *   touch       43 − 16 'hers', the 4 tapped through the page: struck, its lend box ringed
   *   lend        the same picked up at its lend move, before the 3 is typed (the tools type 3, OK: the get box)
   *   get         43 − 16 'above' after the 3: the 13 box ringed over the struck 3; get:one the same in 'one' (the front box)
   *   chain       503 − 278 at the zero's lend: 4 over the 5, 10 over the 0, the 10 struck, its box in the heads row's place
   *   help:move   43 − 16 with 4 typed at the lend (`kept`): the move-help in the slot, the 3 lettered, the keypad dim
   *   ahead       52 − 27 after a 5: her digit pale, the tens and the rows glowing, "Marks first, then the answer."
   *   marks       the take page's marks page (chapter 13's four lines inline, or PC.story.ch13's own), its last line shown
   *   hollow:marks  My marks in the Hollow (the kit's lines, both pictures live), through go('hollow', { marks: true })
   * `opts.step`: the worked spread's step ('show'), or the help's ('sand'), from 0, from the end below 0; `opts.keys`
   * false: nothing typed (a tool that types itself). The shelf and the store need a `teach` set finished: an in-memory
   * stories list, the chapters and a stub chapter 12 with one (never registered in PC.story), passed as `opts.stories`, and
   * the stub's lesson marked finished on the test cat in memory (never saved by this call).
   * Returns true or an error string, as PC.debug.warrior does. */
  var TAKE_DEBUG_PROMPT = 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.';
  var TAKE_DEBUG_ECHO = '¡Trece menos ocho son cinco! ¡Muy bien, amiga!';   // eight words: an echo's most
  var TAKE_DEBUG = { first: 1, q: 1, show: 1, tap: 1, spread: 1, echo: 1, sand: 1, done: 1, shelf: 1, store: 1,
    touch: 1, lend: 1, get: 1, 'get:one': 1, chain: 1, 'help:move': 1, ahead: 1, marks: 1, 'hollow:marks': 1 };
  // chapter 13's marks page, inline (its spec's `ch13-take` marks: design section 2's table), until PC.story.ch13 has its own
  var TAKE_DEBUG_MARKS = { lines: [{ who: 'chispapaw', text: 'My little Tall One writes it like THIS.' }, { who: 'chispapaw', text: 'A little 1 in front!' },
    { who: 'tallyheart', text: 'Some write the new number on top instead.' }, { who: 'tallyheart', text: 'Both are right. Which way do YOU like?' }],
  one: [{ who: 'chispapaw', text: 'Just like my little Tall One!' }], above: [{ who: 'tallyheart', text: 'On top it is.' }] };
  function takeDebugMarks() {
    var ch = PC.story && PC.story.ch13, sets = ch && ch.counts ? Object.keys(ch.counts).map(function (k) { return ch.counts[k]; }) : [];
    var own = sets.filter(function (d) { return d && d.op === '-' && d.marks && typeof d.marks === 'object'; })[0];
    return E.util.clone(own ? own.marks : TAKE_DEBUG_MARKS);
  }
  // the shelf's and the store's stub: a chapter 12 whose lesson teaches the first step (`teach: 'none'`)
  var TAKE_DEBUG_CH = { id: 'take-debug-ch12', number: 12, module: 2, title: 'Take-aways (debug)', start: 'f001',
    frames: { f001: { board: 'DEBUG.', end: true } },
    counts: { 'take-debug-none': { op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, facts: [[58, 23], [76, 42], [475, 132]] } } };
  function takesDebug(what, opts) {
    if (!E || !E.takes || typeof E.takePlan !== 'function') return 'no take-aways kit in this build';
    if (!TAKE_DEBUG[what]) return 'takes: first, q, show, tap, spread, echo, sand, done, shelf, store, touch, lend, get, get:one, chain, help:move, ahead, marks or hollow:marks';
    if (!cat) { cat = E.addCat(save, { now: now() }) || save.cats[0]; save.current = cat.id; }
    if (what === 'shelf' || what === 'store' || what === 'hollow:marks') {
      var list = E.chapters(stories()).concat([TAKE_DEBUG_CH]);
      cat.lessons['take-debug-none'] = { set: 'take-debug-none', mode: 'chapter', op: '-', answers: 3, correct: 3, fast: 0, facts: 3, firstTry: 3, helped: 0, noHelp: true, finished: true };
      if (!E.storeOpen(cat, list)) return 'takes: the store did not open for the test cat';
      if (what === 'shelf') { go('hollow', { from: 'hub', stories: list }); return $('storeBtn') ? true : 'takes: no shelf drawn (a round in the slot?)'; }
      if (what === 'hollow:marks') { go('hollow', { from: 'hub', marks: true, stories: list }); return $('marksPick') ? true : 'takes: no marks page drawn (a round in the slot?)'; }
      var r = E.takeRoundStart(cat, stories(), now(), { stories: list });
      clearTimers(); stopSpeech();
      if (fileState) closeFile(true);
      relayoutFn = null; keyHandler = null; currentSpeech = [];
      view = { name: 'hollow', opts: { from: 'hub' } };
      $('screen').classList.remove('enter', 'enter-back');
      storeLesson(r.state, false, null, true);
      renderedAt = now(); renderedPerf = perfNow();
      updateBar();
      root.scrollTo(0, 0);
      return true;
    }
    var def = { id: 'take-debug', op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' },
      praise: ['Yes!', '', 'That’s it.', '', 'Every column.', ''], done: '' };
    var t = now(), o = { mode: 'debug', debug: { quick: true }, frameId: 'take-' + what, onDone: function () {} }, keys = null;
    def.facts = what === 'first' ? [{ a: 254, b: 131, regroup: 'show', prompt: TAKE_DEBUG_PROMPT, right: ['One square, two rows, three loose left.'] }, [58, 23], [76, 42]] :
      what === 'show' ? [{ a: 503, b: 278, regroup: 'show' }] : what === 'tap' ? [{ a: 43, b: 16, regroup: 'tap' }] :
      what === 'marks' ? [{ a: 43, b: 16, regroup: 'show' }] : what === 'ahead' ? [[52, 27]] : /^(touch|lend|get|get:one|help:move)$/.test(what) ? [[43, 16]] : [[503, 278]];
    // (the kit v0.4: every screen but `first` with every step taught, so the moves are on; her marks 'above' unless `:one`)
    var v4 = what !== 'first';
    o.style = what === 'get:one' ? 'one' : 'above';
    if (what === 'marks') { def.marks = takeDebugMarks(); o.debug.marks = true; }
    var st = E.takes.start(def, v4 ? { set: def.id, mode: 'chapter', now: t, logged: 5, taught: E.TAKE_STEPS.slice(), style: o.style } : { set: def.id, mode: 'chapter', now: t, logged: 5 });
    // (moves made before the page opens: 't2' a touch on the hundreds, a number a lend's or a get's, a digit an answer)
    var walk = function (list) { list.forEach(function (x, i) { var tt = t - 60000 + i * 1000; if (/^t\d$/.test(x)) E.takes.touch(st, def, +x.slice(1), tt); else E.takes.digit(st, def, x, 2000, tt); }); };
    var CHAIN = ['t2', '4', '10', 't1', '9', '13'];
    if (what === 'first') { o.intro = [{ who: 'tallyheart', text: E.WARRIOR_WAITING }]; o.waitLine = E.WARRIOR_WAITING; }
    // (`opts.step`: a step of the worked spread or of the help, from 0, from the end below 0)
    var at = opts && typeof opts.step === 'number' && isFinite(opts.step) ? Math.round(opts.step) : null;
    if (what === 'show') {
      // the worked example's steps under the moves: 0 the opening line, then each of Tallyheart's numbers, her box ringed
      // (1 the square's lend, 2 the zero's ten, 3 the row's lend, 4 the loose, 5 "Thirteen take away eight.")
      var SV = E.takeShow(def, E.takePlan(503, 278), 0, { mode: 'show', style: o.style }).steps, ns = SV.length, sj = Math.max(0, Math.min(ns - 1, at == null ? 1 : at < 0 ? ns + at : at));
      walk([[], ['t2'], ['t2', '4'], ['t2', '4', '10', 't1'], ['t2', '4', '10', 't1', '9'], ['t2', '4', '10', 't1', '9', '13']][sj]);
      if (sj === 0) o.debug.stop = 'show0';
    }
    if (what === 'q' || what === 'done' || what === 'spread' || what === 'echo' || what === 'sand') walk(CHAIN);
    if (what === 'q' || what === 'done') E.takes.digit(st, def, 5, 3000, t - 50000);
    if (what === 'done') { E.takes.digit(st, def, 2, 3000, t - 40000); keys = ['2', 'ok']; o.debug.stop = 'end'; }
    if (what === 'spread') { keys = ['5', 'ok']; o.debug.stop = 'landed'; }
    if (what === 'echo') { keys = ['5', 'ok']; o.echo = function (x) { return x && !x.problem ? { who: 'chispapaw', text: TAKE_DEBUG_ECHO } : null; }; }
    if (what === 'sand') { keys = ['4', 'ok']; o.debug.stop = 'help'; o.debug.at = at == null ? -1 : at; }
    if (what === 'lend' || what === 'help:move') walk(['t1']);
    if (what === 'get' || what === 'get:one') walk(['t1', '3']);
    if (what === 'chain') walk(['t2', '4', '10', 't1']);
    if (what === 'help:move') { keys = ['4', 'ok']; o.debug.stop = 'mhelp'; }
    if (what === 'ahead') keys = ['5', 'ok'];
    clearTimers(); stopSpeech();
    if (fileState) closeFile(true);
    relayoutFn = null; keyHandler = null; currentSpeech = [];
    view = { name: 'frame', opts: {} };
    $('screen').classList.remove('enter', 'enter-back');
    var h = runTakes(Object.assign({ def: def, state: st }, o));
    // (take:first: the re-sit's waiting line has a page of its own, chapter 12's review; Next, as she would, so the screen is
    // the worked example's first column, the prompt joined, the worst case a lesson shows)
    if (what === 'first' && $('lessonNext') && !$('lessonNext').hidden) {
      renderedAt = now() - UI_GUARD_MS - 1; renderedPerf = perfNow() - UI_GUARD_MS - 1;   // (past the double-tap guard: this tap is the tool's)
      $('gotIt').click();
    }
    // (`opts.keys === false`: nothing typed, for a tool that types itself)
    if (keys && !(opts && opts.keys === false)) keys.forEach(function (k) { h.press(k); });
    // (take:touch: the 4 tapped through the page, as her finger would)
    if (what === 'touch' && !(opts && opts.keys === false)) h.tap(1);
    renderedAt = now(); renderedPerf = perfNow();
    updateBar();
    root.scrollTo(0, 0);
    return true;
  }

  /* ================================================================ hub (after any finished chapter) */
  function renderHub() {
    if (!cat) return go('who');
    syncStory();
    var p = E.progress(cat, stories());
    var latest = p.latest;
    var learned = E.learnedCounts(cat, stories());
    var big = '';
    var bigSays = '';
    if (p.next) {
      // the next chapter is the big button; partway through it (even while reading another chapter
      // again), the button picks up her place in it
      var nn = p.next.number || 1;
      bigSays = p.nextInProgress ? 'Keep reading Chapter ' + nn + ': ' + p.next.title + '.' : E.chapterHeading(p.next) + '.';
      big = '<button class="btn go big hub-next" type="button" id="nextChapter"><i aria-hidden="true">' + ICON.moon + '</i><span>' +
        (p.nextInProgress ? '<b>Keep reading Chapter ' + nn + '</b><small>' + esc(p.next.title) + ' · page ' + p.nextPage + '</small>'
          : '<b>' + esc(E.chapterHeading(p.next)) + '</b><small>' + (latest ? 'A new chapter' : 'Start reading') + '</small>') + '</span></button>';
    }
    var again = p.finished.map(function (s) { return hubBtn('again', 'Read chapter ' + (s.number || 1) + ' again', ICON.again, s.id); }).join('');
    var soon = p.soon ? '<button class="btn quiet" type="button" disabled><i aria-hidden="true">' + ICON.moon + '</i>' + esc(p.soon.title) + ' is coming soon</button>' : '';
    // the Warrior Counts (docs/warrior-counts.md, section 7): once chapter 10 is finished the big button
    // is theirs until she passes (an unseen result first); then the Ceremony's chapter button, as for any
    // chapter, with a quiet "The Warrior Counts again" under it (UI.warrior.hub). Null for every cat
    // before then: the hub is as it always was
    var WH = hubWarrior(p), wbig = '', wquiet = '';
    // chapter 11: a warrior once she has her warrior name (the hub's line and what Read to me says)
    var rank = E.warriorName(cat) ? 'warrior' : 'apprentice';
    if (WH) {
      // (a result waiting to be seen: the Ceremony's chapter button waits too, so the hub never tells her
      // she passed before Glintstar does)
      if (WH.hideNext && big) { big = ''; bigSays = ''; }
      if (WH.hideSoon) soon = '';
      if (WH.soon) soon = '<button class="btn quiet" type="button" disabled><i aria-hidden="true">' + ICON.moon + '</i>' + esc(WH.soon) + '</button>';
      if (WH.big) wbig = '<button class="btn go big hub-next hub-warrior" type="button" id="warriorBtn"><i aria-hidden="true">' + ICON.paw + '</i><span>' +
        '<b>' + esc(WH.big.label) + '</b><small>' + esc(WH.big.small) + '</small></span></button>';
      if (WH.quiet) wquiet = '<button class="btn quiet hub-again" type="button" id="warriorAgain"><i aria-hidden="true">' + ICON.paw + '</i>' + esc(WH.quiet.label) + '</button>';
    }
    $('screen').innerHTML =
      '<section class="page center">' +
      '<div class="hero"><span class="face" aria-hidden="true">' + catPortrait(cat.look, 'proud') + '</span>' +
      '<div><h1 class="h1" style="text-align:left">' + nameHtml(cat) + '</h1><p class="note" style="text-align:left">' + cap1(rank) + ' of CrystalClan' +
      (latest ? ' · Chapter ' + (latest.number || 1) + ' finished' : '') + '</p></div></div>' +
      // "… is coming soon" stands where the big button goes, so it never sinks below the screen
      '<div class="hub">' + wbig + big + soon + wquiet +
      (latest ? hubBtn('book', 'Read my book', ICON.book) : '') +
      (learned.length ? hubBtn('hollow', 'The Training Hollow', ICON.tree) : '') +
      hubBtn('nest', 'My nest', ICON.nest) +
      // her Case File, once she has it (chapter 4's "Skritch"): it opens over the hub
      (E.hasFile(cat) ? '<button class="btn" type="button" id="hubFile"><i aria-hidden="true">' + fileIcon() + '</i>My Case File</button>' : '') +
      again +
      '</div></section>';
    Array.prototype.forEach.call(doc.querySelectorAll('[data-go]'), function (b) {
      b.addEventListener('click', function () {
        var w = b.getAttribute('data-go');
        if (w === 'again') return readChapter(E.chapter(b.getAttribute('data-ch'), stories()), false);
        go(w, { from: 'hub' });
      });
    });
    if ($('nextChapter')) $('nextChapter').addEventListener('click', function () { readChapter(p.next, true); });
    if ($('hubFile')) $('hubFile').addEventListener('click', function () { openFile(); });
    currentSpeech = [{ text: E.displayName(cat) + ', ' + rank + ' of CrystalClan.' }].concat(p.next ? [{ text: bigSays }] : p.soon ? [{ text: p.soon.title + ' is coming soon.' }] : []);
    // (the Warrior Counts' slot, when it holds the big button or the coming-soon line: Read to me names it)
    // (chapter 11: once the Ceremony is finished, the teaser under it too: WH.hideSoon)
    if (WH) currentSpeech = [{ text: E.displayName(cat) + ', ' + rank + ' of CrystalClan.' }].concat(WH.big ? [{ text: WH.big.says }] : [])
      .concat(p.next && bigSays ? [{ text: bigSays }] : WH.soon ? [{ text: WH.soon }] : p.soon && !WH.hideSoon ? [{ text: p.soon.title + ' is coming soon.' }] : []);
    if (WH) wireHubWarrior(WH);
    // Enter: whichever holds the big slot (the Warrior Counts' button, else the next chapter's); with the
    // Warrior Counts' slot, also once a tap has put the focus on the page itself (main#screen)
    keyHandler = function (e) {
      var bb = $('warriorBtn') || $('nextChapter'), here = doc.activeElement === doc.body || (!!WH && doc.activeElement === $('screen'));
      if (!isTyping(e) && e.key === 'Enter' && bb && here) { e.preventDefault(); bb.click(); }
    };
  }
  function hubBtn(w, label, icon, ch) { return '<button class="btn" type="button" data-go="' + w + '"' + (ch ? ' data-ch="' + esc(ch) + '"' : '') + '><i aria-hidden="true">' + icon + '</i>' + esc(label) + '</button>'; }

  /* ================================================================ the book */
  /* One book: the title and portrait once, then a page per finished chapter, then the latest
   * chapter's teaser. Printing puts each chapter on its own page. */
  function renderBook(opts) {
    if (!cat) return go('who');
    // book two (docs/take-aways.md, section 7): the volume on screen, one a module (bookVol); the first is the book as it
    // always was, and the only one until she finishes a module 2 chapter
    // (the Warrior Counts' teaser lines below never touch the second volume: module 2 comes after the Ceremony, which is
    // built, and no module 2 teaser leads to it)
    var vols = E.books(cat, stories()), vol = bookVol(opts, vols);
    var b = vol > 1 ? E.buildFullBook(cat, stories(), vol) : E.buildFullBook(cat, stories());
    var t = b.teaser;
    // the Warrior Counts passed, the Ceremony not built yet: "Your ceremony is coming soon." in place of
    // chapter 10's teaser lines (a UI choice: E.teaser is unchanged)
    // (once Glintstar has said it: never while her first pass's result is unseen; a sitting again's
    // unseen result gives nothing away, as on the hub)
    var wsBook = t && !t.built && warriorBuilt() ? warriorNow() : null;
    // (chapter 11: only while the Ceremony is not built: after it, her book never promises the ceremony she had)
    if (wsBook && wPassShown(wsBook) && !E.chapters(stories()).some(function (s) { return s.opensWhen === 'warrior'; })) t = Object.assign({}, t, { lines: ['Your ceremony is coming soon.'] });
    // (the Ceremony built, its teaser next, her pass seen: chapter 10's teaser would ask her to pass Counts she has
    // passed; Glintstar's pass line, which she has read, stands in its place till she reads the chapter)
    var wsNext = t && t.built && warriorBuilt() && (E.chapter(t.next, stories()) || {}).opensWhen === 'warrior' ? warriorNow() : null;
    if (wsNext && wPassShown(wsNext)) t = Object.assign({}, t, { lines: [CEREMONY_NEXT] });
    var volBtns = bookVolButtons(vols, vol);
    $('screen').innerHTML =
      '<article class="book' + (vol > 1 ? ' vol' + vol : '') + '" aria-label="' + esc(b.title) + '">' +
      // a long Clan name ("Thunderwhiskerpaw’s") gets a smaller title, so the word never breaks (the name the title
      // shows: {name}paw, her warrior name or not, chapter 11; the second volume's shows her warrior name: bookTitleTwo)
      (vol > 1 ? bookTitleTwo(b.title) + volBtns : '<h1' + ((E.clanName(cat) || E.displayName(cat)).length > 12 ? ' class="long"' : '') + '>' + esc(b.title) + '</h1>' + volBtns) +
      '<div class="portrait" aria-hidden="true">' + catPortrait(cat.look, 'happy') + '</div>' +
      (b.pages.length ? b.pages.map(function (pg) {
        return '<section class="bookpage" id="book-' + esc(pg.id) + '"><h2 class="chap">' + esc(pg.heading) + '</h2>' +
          pg.recap.map(function (p) { return '<p>' + richN(p) + '</p>'; }).join('') +
          // book two: the store as the chapter left it, under its recap
          (pg.store != null ? storePic(pg.store) : '') +
          (pg.dream ? '<p class="dream">' + richN(pg.dream) + '</p>' : '') + '</section>';
      }).join('') : '<p class="chap">Finish a chapter, and it goes in your book.</p>') +
      dragonetPages(b.dragonets) +
      (vol > 1 ? sleeperPages(b.sleepers) + badgerPage(b.badger) + keepsakePage(b.keepsake) : '') +
      '<div class="sig">' + nameHtml(cat) + ' of CrystalClan</div>' +
      '</article>' +
      '<div class="links no-print"><button class="btn" id="printBtn" type="button">Print my book</button></div>' +
      (t ? '<section class="coming" aria-label="Coming next">' +
        '<span class="soon">' + (t.built ? 'Next' : 'Coming soon') + '</span>' +
        '<h2 class="h2">' + esc(t.title) + '</h2>' +
        t.lines.map(function (l) { return '<p>' + rich(l) + '</p>'; }).join('') +
        '</section>' : '') +
      '<div class="links">' + (E.learnedCounts(cat, stories()).length ? hubBtn('hollow', 'The Training Hollow', ICON.tree) : '') + hubBtn('nest', 'My nest', ICON.nest) + hubBtn('hub', 'Camp', ICON.moon) + '</div>';
    $('printBtn').addEventListener('click', function () { try { root.print(); } catch (e) {} });
    Array.prototype.forEach.call(doc.querySelectorAll('[data-go]'), function (bt) {
      // (book two: the Hollow and My nest come back to the volume she left)
      bt.addEventListener('click', function () { var w = bt.getAttribute('data-go'); go(w, vols.length > 1 ? { from: 'book', vol: vol } : { from: 'book' }); });
    });
    // book two: the other volume, from its top; Back still goes where it went (a chapter's end, or camp)
    Array.prototype.forEach.call(doc.querySelectorAll('[data-vol]'), function (bt) {
      bt.addEventListener('click', function () {
        var m = +bt.getAttribute('data-vol');
        if (m !== vol) go('book', { from: view.opts.from, vol: m });
      });
    });
    // from a chapter's end: open the book at that chapter's page (when it isn't the first)
    if (opts && opts.scrollTo && b.pages.length > 1) {
      var pageEl = $('book-' + opts.scrollTo);
      if (pageEl) later(function () { try { pageEl.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {} }, 60);
    } else root.scrollTo(0, 0);
    currentSpeech = [{ text: b.title }];
    b.pages.forEach(function (pg) {
      currentSpeech.push({ text: pg.heading + '.' });
      pg.recap.forEach(function (p) { currentSpeech.push({ text: p }); });
      if (pg.store != null) currentSpeech.push({ text: storeSays(pg.store) });
      if (pg.dream) currentSpeech.push({ text: pg.dream });
    });
    if (b.dragonets) {
      currentSpeech.push({ text: 'The dragonets.' });
      b.dragonets.found.forEach(function (d) { currentSpeech.push({ text: d.name + '.' }); d.lines.forEach(function (l) { currentSpeech.push({ text: l }); }); });
      if (b.dragonets.toFind) currentSpeech.push({ text: cap1(numWord(b.dragonets.toFind)) + ' more, still to find.' });
    }
    if (vol > 1) bookTwoSays(b).forEach(function (it) { currentSpeech.push(it); });
  }
  /* ---------------------------------------------------------------- book two (docs/take-aways.md, section 7)
   * Read my book in volumes, one a module: "{name}paw’s First Moon" as it always was, and "{name}{ending}’s First
   * Frost-Time" once she finishes chapter 12. The volume: `opts.vol` when she has it (its button, or back from the Hollow
   * or My nest); from a chapter's end, that chapter's; else her latest finished chapter's. */
  function bookVol(opts, vols) {
    var has = function (m) { return vols.some(function (v) { return v.module === m; }); };
    if (opts && typeof opts.vol === 'number' && has(opts.vol)) return opts.vol;
    var end = opts && opts.scrollTo ? E.chapter(opts.scrollTo, stories()) : null;
    if (end && has(E.moduleOf(end))) return E.moduleOf(end);
    var done = E.chapters(stories()).filter(function (s) { return E.isFinished(cat, s.id); });
    return done.length ? E.moduleOf(done[done.length - 1]) : 1;
  }
  /* Two volumes: a button for each under the title ("First Moon", "First Frost-Time"), the open one pressed, each at least
   * 44px tall for a child's finger; never printed. One volume: nothing, as before. */
  function bookVolButtons(vols, vol) {
    if (vols.length < 2) return '';
    return '<div class="vols no-print" role="group" aria-label="Your books">' + vols.map(function (v) {
      var short = (/[’']s\s+(.+)$/.exec(v.title) || [])[1] || v.title;
      return '<button class="btn vol" type="button" data-vol="' + v.module + '" aria-pressed="' + (v.module === vol ? 'true' : 'false') + '">' + esc(short) + '</button>';
    }).join('') + '</div>';
  }
  /* The second volume's title shows her warrior name, up to 26 letters: it may break at the join (richN, as her name does
   * in the story's lettering), and a long one is set smaller, as the first volume's is. A word with a hyphen in it stays
   * whole ("Frost-Time": at 1080 x 720 it broke after "Frost-"). */
  function bookTitleTwo(title) {
    var n = E.displayName(cat).length;
    return '<h1' + (n > 17 ? ' class="long longer"' : n > 12 ? ' class="long"' : '') + '>' +
      richN(title).replace(/[A-Za-z\u00C0-\u024F]+(?:-[A-Za-z\u00C0-\u024F]+)+/g, '<span class="nw">$&</span>') + '</h1>';
  }
  /* The store as a chapter left it (`book.store`), small under its recap: the kit's place-value picture (PC.art.placeValue,
   * `small`), "In the store:" in Comic Neue and the number in Andika, as everywhere words and numbers are set. */
  function storePic(n) {
    var po = { hundreds: Math.floor(n / 100), tens: Math.floor(n / 10) % 10, ones: n % 10, kind: 'store', small: true };
    return '<figure class="storepic">' + (n > 0 ? '<div class="sp-pic" aria-hidden="true">' + (artCall('placeValue', po) || takeStoreFallback(po)) + '</div>' : '') +
      '<figcaption><span class="sp-words">In the store:</span> <span class="sp-num">' + n + '</span></figcaption></figure>';
  }
  function storeSays(n) { return 'In the store: ' + E.numberWords(n) + '.'; }
  /* The winter sleepers, as the dragonets' pages (their classes reused): a page for each she has found, with room for her
   * own drawing, and the rest as silhouettes, still sleeping. */
  function sleeperPages(sp) {
    if (!sp || !sp.found.length) return '';
    var found = sp.found.map(function (d) {
      return '<div class="dragonet sleeper"><div class="dn-pic" aria-hidden="true">' + sleeperArt(d.id, false, 0, d.pose) + '</div>' +
        '<div class="dn-text"><h3>' + esc(cap1(d.name)) + '</h3>' + d.lines.map(function (l) { return '<p>' + richN(l) + '</p>'; }).join('') +
        '<div class="dn-draw" aria-hidden="true">Draw ' + esc(d.name.replace(/^The /, 'the ')) + ' here</div></div></div>';
    }).join('');
    var sil = '';
    for (var i = 0; i < sp.toFind; i++) sil += '<div class="dragonet sil sleeper"><div class="dn-pic">' + sleeperArt(null, true, i) + '</div></div>';
    return '<section class="bookpage dragonets sleepers" id="book-sleepers"><h2 class="chap">The winter sleepers</h2>' + found +
      (sil ? '<div class="dn-find" aria-hidden="true">' + sil + '</div><p class="dn-more">' + esc(sleepersMore(sp.toFind)) + '</p>' : '') + '</section>';
  }
  function sleepersMore(n) { return cap1(numWord(n)) + ' more, still sleeping.'; }
  /* A sleeper: its chapter's art (PC.art.character, the page's `pose`, else curled up asleep), or, until its chapter
   * brings it, a plain curled-up shape; every silhouette is the plain shape, so none gives away who is still to find. */
  function sleeperArt(id, silhouette, i, pose) {
    try {
      if (id && PC.art && typeof PC.art.character === 'function' && PC.art.vocab && PC.art.vocab.cast && PC.art.vocab.cast.indexOf(id) >= 0) {
        var out = wrapChar(PC.art.character(id, { pose: pose || 'sleep', mood: 'neutral', facing: 'right' }), false);
        if (out) return out;
      }
    } catch (e) { if (root.console) console.warn('PC.art.character failed', e); }
    var flip = i % 2 ? ' transform="translate(200 0) scale(-1 1)"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g' + flip + ' fill="' + (silhouette ? '#1b1622' : '#a08a6e') + '" stroke="#1b1622" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M30 150 C26 112 62 84 106 86 C150 88 176 114 172 146 C170 162 150 170 100 170 C56 170 32 166 30 150 Z"/>' +
      '<path d="M150 150 C172 150 182 132 176 116 C190 128 192 158 168 168 C150 174 128 168 118 160 Z"/>' +
      '<path d="M44 140 C40 118 58 104 78 108 C96 112 102 132 90 146 C80 156 50 156 44 140 Z"/>' +
      (silhouette ? '' : '<path d="M58 128 Q64 134 70 128" fill="none" stroke-width="3.5"/><g fill="none" stroke-width="3"><path d="M110 58 h12 l-12 12 h12"/><path d="M134 40 h9 l-9 9 h9"/></g>') + '</g></svg>';
  }
  /* The badger page, "What is a badger LIKE?" (from chapter 13): two columns, They say (an ear, the Case File's mark for
   * what she was told) and I saw (an eye); a row an answer, its rumours crossed out once she has seen what answers them.
   * Under 520px wide a row's sighting goes under its rumours (index.html). */
  function badgerPage(bg) {
    if (!bg || !bg.rows.length) return '';
    var ear = '<i class="bg-mark" aria-hidden="true">' + markSvg('ear') + '</i>', eye = '<i class="bg-mark" aria-hidden="true">' + markSvg('eye') + '</i>';
    return '<section class="bookpage badger" id="book-badger"><h2 class="chap">What is a badger LIKE?</h2>' +
      '<div class="bg-heads" aria-hidden="true"><span class="bg-h">' + ear + 'They say</span><span class="bg-h">' + eye + 'I saw</span></div>' +
      bg.rows.map(function (r) {
        return '<div class="bg-row' + (r.crossed ? ' crossed' : '') + '">' +
          '<ul class="bg-say" aria-label="They say">' + r.say.map(function (l) {
            return '<li>' + ear + '<span class="bg-line">' + (r.crossed ? '<span class="sr">crossed out: </span><s>' + richN(l.text) + '</s>' : richN(l.text)) +
              (l.who ? ' <span class="bg-who">' + esc(l.who) + '</span>' : '') + '</span></li>';
          }).join('') + '</ul>' +
          '<ul class="bg-saw" aria-label="I saw">' + r.saw.map(function (l) { return '<li>' + eye + '<span class="bg-line">' + richN(l.text) + '</span></li>'; }).join('') + '</ul></div>';
      }).join('') + '</section>';
  }
  /* The keepsake that closes the volume (chapter 21's stone tooth), drawn as a nest treasure is. */
  function keepsakePage(k) {
    if (!k) return '';
    return '<section class="bookpage keepsake" id="book-keepsake"><div class="ks-pic" aria-hidden="true">' + treasureSvg(k.id) + '</div>' +
      '<h2 class="chap">' + esc(k.name) + '</h2>' + k.lines.map(function (l) { return '<p>' + richN(l) + '</p>'; }).join('') + '</section>';
  }
  /* What Read to me says of the second volume's own pages, after its chapters: the sleepers as the dragonets; each
   * rumour, "Crossed out:" before a crossed one, then what she saw; the keepsake. */
  function bookTwoSays(b) {
    var out = [];
    if (b.sleepers) {
      out.push({ text: 'The winter sleepers.' });
      b.sleepers.found.forEach(function (d) { out.push({ text: cap1(d.name) + '.' }); d.lines.forEach(function (l) { out.push({ text: l }); }); });
      if (b.sleepers.toFind) out.push({ text: sleepersMore(b.sleepers.toFind) });
    }
    if (b.badger) {
      out.push({ text: 'What is a badger LIKE?' });
      b.badger.rows.forEach(function (r) {
        r.say.forEach(function (l) { out.push({ text: (r.crossed ? 'Crossed out: ' : '') + (l.who ? (r.crossed ? l.who : cap1(l.who)) + ' said, ' : '') + l.text }); });
        r.saw.forEach(function (l) { out.push({ text: 'I saw: ' + l.text }); });
      });
    }
    if (b.keepsake) {
      out.push({ text: b.keepsake.name + '.' });
      b.keepsake.lines.forEach(function (l) { out.push({ text: l }); });
    }
    return out;
  }
  /* The dragonets in her book (module-1, "Her book"): a page for each one she has found, with room
   * for her own drawing, and the rest of the clutch as silhouettes, still to find. */
  function dragonetPages(dn) {
    if (!dn || !dn.found.length) return '';
    var found = dn.found.map(function (d) {
      return '<div class="dragonet"><div class="dn-pic" aria-hidden="true">' + dragonetArt(d.id, false, 0, d.pose) + '</div>' +
        '<div class="dn-text"><h3>' + esc(d.name) + '</h3>' + d.lines.map(function (l) { return '<p>' + rich(l) + '</p>'; }).join('') +
        '<div class="dn-draw" aria-hidden="true">Draw ' + esc(d.name) + ' here</div></div></div>';
    }).join('');
    var sil = '';
    for (var i = 0; i < dn.toFind; i++) sil += '<div class="dragonet sil"><div class="dn-pic">' + dragonetArt(dn.found[0].id, true, i) + '</div></div>';
    var more = cap1(numWord(dn.toFind)) + ' more, still to find.';
    return '<section class="bookpage dragonets" id="book-dragonets"><h2 class="chap">The dragonets</h2>' + found +
      (sil ? '<div class="dn-find" aria-hidden="true">' + sil + '</div><p class="dn-more">' + esc(more) + '</p>' : '') + '</section>';
  }
  /* A dragonet, sitting: the art's (PC.art.character), or a plain shape until the art has her; as
   * a silhouette, every other one facing the other way. Chapter 5: `pose`, the dragonet's own on its
   * page (`book.dragonet`'s: Puddle's head out of the water, Wisp on one leg), when sitting is not its way. */
  function dragonetArt(id, silhouette, i, pose) {
    try {
      if (PC.art && typeof PC.art.character === 'function' && PC.art.vocab && PC.art.vocab.cast && PC.art.vocab.cast.indexOf(id) >= 0) {
        var out = wrapChar(PC.art.character(id, { pose: pose || 'sit', mood: silhouette ? 'neutral' : 'happy', facing: i % 2 ? 'left' : 'right' }), false);
        if (out) return out;
      }
    } catch (e) { if (root.console) console.warn('PC.art.character failed', e); }
    var flip = i % 2 ? ' transform="translate(200 0) scale(-1 1)"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g' + flip + ' fill="' + (silhouette ? '#1b1622' : '#9aa3ad') + '" stroke="#1b1622" stroke-width="4" stroke-linejoin="round">' +
      '<path d="M48 176 C40 130 60 96 92 92 C96 70 104 46 122 38 C140 32 156 42 156 58 C156 72 142 80 130 76 C122 90 122 104 130 120 C146 140 150 162 140 176 Z"/>' +
      '<path d="M50 172 C26 170 14 150 22 132 C30 146 40 152 56 150 Z"/><path d="M96 104 C70 80 44 78 30 92 C52 96 70 108 84 126 Z"/>' +
      (silhouette ? '' : '<circle cx="138" cy="54" r="7" fill="#fff6dc"/><circle cx="139" cy="54" r="3.5" fill="#1b1622" stroke="none"/>') + '</g></svg>';
  }

  /* ================================================================ the Training Hollow, one claw mark per Count */
  function hollowScene(cam, cast, fx) {
    return { set: 'hollow', cam: cam, opts: { marks: 'auto', glow: 'auto' }, cast: cast, fx: fx };
  }
  // the take-aways kit: 'counts' while the Counts page under the shelf is on screen (its ‹ goes back to the shelf), else null
  var hollowSub = null;
  function renderHollow(opts) {
    if (!cat) return go('who');
    hollowSub = null;
    // the round in progress: in the slot, or back from waiting while a chapter lesson had it
    // (that chapter lesson now waits in its chapter's place)
    var waited = !!cat.hollowWaiting, HL = E.hollowRound(cat);
    if (waited) persist();
    if (HL && HL.state.op === '-') {
      // the take-aways kit (docs/take-aways.md, section 5): a Count the store round picked up at its problem and column,
      // under the Warrior Counts' waiting line while a sitting waits (as a round of Counts is); one whose last answer is
      // in but which was never recorded counts now, once, and shows its reward
      if (!E.takes.done(HL.state)) return storeLesson(HL.state, true, cat.warrior ? E.hollowLines(cat, stories(), { now: now() }).waiting : null);
      var srec = E.settleLesson(cat);
      persist();
      if (srec && srec.store && srec.store.awarded) return storeReward(srec.store);
    } else if (HL) {
      var tbl = HL.state.table || 1;
      if (!E.counts.done(HL.state)) {
        // (the Warrior Counts: a sitting paused at the fountain is said over the round's next question, so
        // she knows an answer here starts the Counts fresh later; only for a cat with `warrior` data)
        var wl = cat.warrior ? E.hollowLines(cat, stories(), { now: now() }).waiting : null;
        return hollowLesson(E.hollowDef(stories(), tbl), HL.state, true, wl);
      }
      // a round whose last answer is in but which was never recorded: it counts, once
      var rec = E.settleLesson(cat);
      persist();
      if (rec && rec.hollow) return hollowReward(E.hollowDef(stories(), tbl), rec.hollow);
    }
    // the take-aways kit (section 5): once Count the store is open (a take set with `teach` finished), the Hollow opens on its
    // shelf; One Count at a time (`opts.counts`) draws the Counts page below, word for word as it always was. A cat without
    // the store (every cat before chapter 12) gets that page at once, as before. `opts.stories`: PC.debug.takes' stub chapter
    // (the kit v0.4, decision 57: My marks, under the shelf, the marks page with the kit's lines; its ‹ goes back to the shelf)
    if (opts && opts.marks) return renderMarks(opts);
    var SH = opts && opts.counts ? null : E.hollowShelf(cat, stories(), { reward: !!(opts && opts.reward), now: now(), stories: opts && opts.stories });
    if (SH) return renderShelf(SH, opts || {});
    // the Counts she can practise and Tallyheart's lines about them (E.hollowLines: each Count's own
    // word there, "tens" for the 10s, so the 5s and the 10s never read the same)
    // (the Warrior Counts: with `now`, a paused sitting that has gone stale is not "waiting")
    // (and the tricky greeting, after a round she went back to from a not-yet: wTrickyDue, once)
    var HW = E.hollowLines(cat, stories(), cat.warrior ? { reward: !!(opts && opts.reward), now: now(), tricky: wTrickyDue } : { reward: !!(opts && opts.reward) });
    wTrickyDue = false;
    var defs = HW.counts;
    var scr = $('screen');
    scr.innerHTML = frameShell('hollow', 'hollow');
    var panel = $('panel');
    var one = HW.one;
    var f = {
      scene: hollowScene('wide', [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'sunpatch', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'sand-left', facing: 'right' }], ['sunset']),
      caption: ['The Training Hollow. The old tree leans over the sand like it’s listening.'],
      // the Warrior Counts: a sitting paused at the fountain is said before she picks a Count, in the
      // greeting's place (the tricky greeting would say "first" the other way; the paws on the
      // buttons still mark the tricky Counts)
      say: [{ who: 'tallyheart', text: HW.waiting || HW.greet }]
    };
    if (HW.glow) f.say.push({ who: 'tallyheart', text: HW.glow });
    var heads = drawArt(panel, shownFrame(f), cat.look);
    var ctx = { panel: panel, frame: f, heads: heads, caps: captionsOf(f), balloons: balloonsOf(f) };
    relayoutFn = function () { layoutText(ctx); };
    layoutText(ctx);
    // (One Count at a time, under the shelf: its ‹ goes back to the shelf, not to camp, until a round starts)
    if (opts && opts.counts) hollowSub = 'counts';
    var start = function (table) {
      hollowSub = null;
      var r = E.hollowStart(cat, stories(), now(), table);
      E.holdLesson(cat);   // a chapter lesson in progress waits in its chapter's place, never lost to the round
      cat.lesson = { mode: 'hollow', state: r.state }; persist();
      hollowLesson(r.def, r.state, false);
    };
    if (one) {
      $('interact').innerHTML = '<div class="row end"><button class="btn" type="button" id="nestBtn">My nest</button><button class="btn go big" type="button" id="startBtn" data-t="' + one.table + '">Start a round</button></div>';
    } else {
      $('interact').innerHTML = '<div class="counts-pick" role="group" aria-label="Which Count?">' + defs.map(function (d) {
        return '<button class="btn go big" type="button" data-t="' + d.table + '">' + (d.glow ? '<i class="glowdot" role="img" aria-label="glowing"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.7 7.8 7.8 2.7-7.8 2.7L12 22.5l-2.7-7.8L1.5 12l7.8-2.7z"/></svg></i>' : '') +
          // (the Warrior Counts: a small paw on a Count whose tricky ones are still to practise)
          (d.tricky ? '<i class="trickypaw" role="img" aria-label="tricky ones">' + ICON.paw + '</i>' : '') + esc(d.name) + '</button>';
      }).join('') + '</div><div class="row end"><button class="btn" type="button" id="nestBtn">My nest</button></div>';
    }
    $('nestBtn').addEventListener('click', function () { go('nest', { from: 'hollow' }); });
    Array.prototype.forEach.call($('interact').querySelectorAll('[data-t]'), function (b) {
      b.addEventListener('click', function () { start(+b.getAttribute('data-t')); });
    });
    currentSpeech = (ctx.reading || []).concat(one ? [] : defs.map(function (d) { return { text: d.name.replace(' · ', ', ') }; }));
  }
  /* The take-aways kit's shelf (docs/take-aways.md, section 5; E.hollowShelf): the Hollow's opening page once Count the
   * store is open, as the Counts page is drawn (the wide sand, Tallyheart and her, the caption), with Tallyheart's greeting
   * (after a round, "Another round?"; while a Warrior Counts sitting waits, its waiting line in that place) and its buttons:
   * Count the store (big, its icon the quick picture's three marks), One Count at a time (big: today's Counts page) and My
   * nest. Chapter 14 adds Tricky Counts between the two big ones. `opts.stories` (PC.debug.takes) reaches the round. */
  function renderShelf(SH, opts) {
    var scr = $('screen');
    scr.innerHTML = frameShell('hollow', 'hollow');
    // (`data-mode="shelf"`: on a phone held sideways its stack stands over the panel, as the take page's does, so the
    // greeting with Aa on never pushes the buttons under the screen; every other size is the Hollow's own layout)
    scr.querySelector('.frame').setAttribute('data-mode', 'shelf');
    var panel = $('panel');
    var f = {
      scene: hollowScene('wide', [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'sunpatch', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'sand-left', facing: 'right' }], ['sunset']),
      caption: ['The Training Hollow. The old tree leans over the sand like it’s listening.'],
      say: [{ who: 'tallyheart', text: SH.line }].concat(SH.friend ? [SH.friend] : [])
    };
    // chapter 12: Chispapaw on the shelf with her "¡A contar!" (E.hollowShelf's `friend`), on the sand at the right, facing left
    if (SH.friend) f.scene.cast.push({ who: 'chispapaw', pose: 'sit', mood: 'happy', at: 'sand-right', facing: 'left' });
    var heads = drawArt(panel, shownFrame(f), cat.look);
    var ctx = { panel: panel, frame: f, heads: heads, caps: captionsOf(f), balloons: balloonsOf(f) };
    // (a phone held sideways: a greeting that went to the stack made the panel shorter, so the text is laid out again for it)
    var lay = function () { layoutText(ctx); if ($('stack').innerHTML && root.matchMedia && root.matchMedia(TAKE_PHONE).matches) layoutText(ctx); };
    relayoutFn = lay;
    lay();
    var label = function (id) { var b = SH.buttons.filter(function (x) { return x.id === id; })[0]; return b ? b.label : id; };
    // (the kit v0.4: My marks beside My nest once she has learned to spread a row, or has chosen her marks)
    var marksOn = E.takeSteps(cat, opts.stories || stories()).indexOf('ones2') >= 0 || !!(cat.takes && (cat.takes.style === 'one' || cat.takes.style === 'above'));
    $('interact').innerHTML = '<div class="counts-pick tshelf" role="group" aria-label="What to practise">' +
      '<button class="btn go big" type="button" id="storeBtn"><i class="storeicon" aria-hidden="true">' + storeIcon() + '</i>' + esc(label('store')) + '</button>' +
      '<button class="btn go big" type="button" id="countsBtn">' + esc(label('counts')) + '</button></div>' +
      '<div class="row end">' + (marksOn ? '<button class="btn" type="button" id="marksBtn">' + takeMarksIcon(E.takeStyle(cat)) + 'My marks</button>' : '') +
      '<button class="btn" type="button" id="shelfNest">' + esc(label('nest')) + '</button></div>';
    if (marksOn) $('marksBtn').addEventListener('click', function () { go('hollow', { marks: true, from: view.opts.from, vol: view.opts.vol, stories: opts.stories }); });
    $('storeBtn').addEventListener('click', function () {
      var r = E.takeRoundStart(cat, stories(), now(), { stories: opts.stories });
      E.holdLesson(cat);   // a chapter lesson in progress waits in its chapter's place, never lost to the round
      cat.lesson = { mode: 'hollow', state: r.state }; persist();
      storeLesson(r.state, false, null);
    });
    $('countsBtn').addEventListener('click', function () { go('hollow', { counts: true, from: view.opts.from, vol: view.opts.vol, stories: opts.stories }); });
    $('shelfNest').addEventListener('click', function () { go('nest', { from: 'hollow' }); });
    currentSpeech = (ctx.reading || []).concat([{ text: label('store') + '.' }, { text: label('counts') + '.' }], marksOn ? [{ text: 'My marks.' }] : []);
  }
  /* My marks' icon (the kit v0.4): only her receiver's mark, as the column draws it, its digit 32 px: a little 1 in front of
   * the 3, or 13 over a struck 3 (before she picks, on top: the default). */
  function takeMarksIcon(style) {
    return style === 'one' ? '<i class="tpickicon tpi-one" aria-hidden="true"><span class="tpi-d"><span class="tpi-f">1</span>3</span></i>' :
      '<i class="tpickicon" aria-hidden="true"><span class="tpi-m">13</span><span class="tpi-d tstruck">3</span></i>';
  }
  /* The kit v0.4's marks page (decision 57; design section 2): the two picture buttons (PC.ui.takes.marksHtml) in a .tpick
   * wrapper drawn into `host`; runTakes' 'marks' phase and the Hollow's { marks: true } branch call it. `o` { page (its
   * options), live, pressed }. Returns { glow(which), live(on), press(style), onPick(fn), remove() }: a button answers only
   * while live (a tap made to move the lines on never picks) and never moves the page on. */
  function marksPage(host, o) {
    var pickFn = null;
    host.innerHTML = takeMarksHtml({ options: o.page.options, live: !!o.live, pressed: o.pressed || null, glow: o.glow || null });
    var wrap = host.querySelector('.tpick'), btns = function () { return Array.prototype.slice.call(host.querySelectorAll('.tpb')); };
    host.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.tpb') : null;
      if (!b) return;
      if (!wrap.classList.contains('tlive') || !pickFn) return;
      pickFn(b.getAttribute('data-style'));
    });
    return {
      glow: function (g) { btns().forEach(function (b) { var s = b.getAttribute('data-style'); b.classList.toggle('tglowing', g === 'both' || g === s); }); },
      live: function (on) { on = on !== false; wrap.classList.toggle('tlive', on); btns().forEach(function (b) { if (on) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true'); }); },
      press: function (style) {
        btns().forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-style') === style ? 'true' : 'false'); });
        var pb = host.querySelector('.tpb[data-style="' + style + '"]');
        if (pb) { try { pb.focus({ preventScroll: true }); } catch (x) {} }
      },
      onPick: function (fn) { pickFn = fn; },
      remove: function () { if (host.parentNode) host.parentNode.removeChild(host); }
    };
  }
  /* My marks in the Training Hollow (go('hollow', { marks: true }), a branch of renderHollow: no new view): the wide sand,
   * Tallyheart with the kit's lines, the two pictures live at once, her style pressed; a tap changes it at once, at no cost,
   * saved, and Tallyheart says the answer line; ‹ goes back to the shelf (onBack, `hollowSub`). */
  function renderMarks(opts) {
    hollowSub = 'marks';
    var scr = $('screen');
    scr.innerHTML = frameShell('hollow', 'hollow');
    // (the shelf's own mode: on a phone held sideways the pictures on the left, the balloons over the panel)
    scr.querySelector('.frame').setAttribute('data-mode', 'shelf');
    var panel = $('panel'), page = E.takeMarksPage(E.takeRoundDef(), cat);
    var fb = function (b) { return { who: b.who || 'tallyheart', text: fill(b.text) }; };
    var labels = page.options.map(function (op) { return { text: op.label + '.' }; });
    var draw = function (lines) {
      var f = { scene: hollowScene('wide', [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'sunpatch', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'sand-left', facing: 'right' }], ['sunset']),
        say: lines };
      var heads = drawArt(panel, shownFrame(f), cat.look);
      var ctx = { panel: panel, frame: f, heads: heads, caps: captionsOf(f), balloons: balloonsOf(f) };
      var lay = function () { layoutText(ctx); if ($('stack').innerHTML && root.matchMedia && root.matchMedia(TAKE_PHONE).matches) layoutText(ctx); };
      relayoutFn = lay;
      lay();
      return ctx;
    };
    var ctx = draw(page.lines.map(fb));
    $('interact').innerHTML = '<div class="tpickwrap" id="marksPick"></div>';
    var mp = marksPage($('marksPick'), { page: page, live: true, pressed: page.current });
    mp.onPick(function (s) {
      if (!E.setTakeStyle(cat, s)) return;
      persist();
      mp.press(s);
      var after = page.after[s].map(fb);
      ctx = draw(page.lines.slice(0, Math.max(0, page.lines.length - 1)).map(fb).concat(after));
      currentSpeech = (ctx.reading || []).concat(labels);
      speakItems(after);
    });
    currentSpeech = (ctx.reading || []).concat(labels);
  }
  /* The store icon: the quick picture's three marks (a square, a line, a dot) on a sand chip, as the column's heads are. */
  function storeIcon() {
    var g = '';
    try { g = PC.art && typeof PC.art.quickMarks === 'function' ? PC.art.quickMarks(0, 0, 0.92, { hundreds: 1, tens: 1, ones: 1, ground: 'sand' }) : ''; } catch (e) { g = ''; }
    if (!g) g = '<rect x="-80" y="-26" width="52" height="52" fill="none" stroke="#9c7440" stroke-width="7"/><path d="M14 -28 L8 28" stroke="#9c7440" stroke-width="7" stroke-linecap="round"/><circle cx="62" cy="0" r="10" fill="#9c7440"/>';
    return '<svg viewBox="-100 -44 200 88" focusable="false"><rect x="-96" y="-40" width="192" height="80" rx="18" fill="#e8cf98" stroke="#1b1622" stroke-width="5"/>' + g + '</svg>';
  }
  /* A Count the store round on the take page (runTakes, `mode: 'hollow'`: the slot kept after every column, the round
   * recorded at its last answer by E.recordLesson, which sends it to E.takeRoundFinish): introduced "Five from the store.
   * Ready? Here we go."; picked up, nothing first but the Warrior Counts' waiting line while a sitting waits. `debug`:
   * PC.debug.takes('store'), nothing saved. */
  function storeLesson(st, resume, waiting, debug) {
    var def = E.takeRoundDef();
    return runTakes({
      def: def, state: st, mode: debug ? 'debug' : 'hollow', frameId: 'store', waitLine: waiting || null,
      intro: resume ? (waiting ? [{ who: 'tallyheart', text: waiting }] : []) : [{ who: 'tallyheart', text: def.intro }],
      debug: debug ? { quick: true } : null,
      onDone: function (sum, rec) {
        // the round was counted (E.takeRoundFinish, once) when its last answer went in
        storeReward(rec && rec.store ? rec.store : { awarded: null });
      }
    });
  }
  /* A store round's reward (hollowReward's shape): the tree insert (no claw mark and no glow: the tree is full), Tallyheart's
   * closing line, the frost-time treasure, My nest and "Another round", which goes back to the shelf. */
  function storeReward(res) {
    renderedAt = now();   // a new screen: the double-tap guard in bindChrome applies
    var t = res && res.awarded, def = E.takeRoundDef();
    var scr = $('screen');
    scr.innerHTML = frameShell('reward', 'reward');
    // (`data-mode="store-reward"`: on a phone held sideways its stack stands over the panel and the treasure's card lies
    // flat, as the shelf's page does, so "Another round" is on the screen, Aa on or off; every other size as hollowReward)
    scr.querySelector('.frame').setAttribute('data-mode', 'store-reward');
    var panel = $('panel');
    var f = { scene: hollowScene('tree', [], ['sparkle']) };
    var heads = drawArt(panel, shownFrame(f), cat.look);
    var line = fill(def.done);
    var ctx = { panel: panel, frame: f, heads: heads, caps: [], balloons: [{ who: 'tallyheart', text: line, kind: 'say' }] };
    // (a phone held sideways: a line that went to the stack made the panel shorter, so the text is laid out again for it)
    var lay = function () { layoutText(ctx); if ($('stack').innerHTML && root.matchMedia && root.matchMedia(TAKE_PHONE).matches) layoutText(ctx); };
    relayoutFn = lay;
    lay();
    $('interact').innerHTML =
      (t ? '<div class="reward' + (reduceMotion ? '' : ' pop') + '" role="status">' + treasureSvg(t.id) + '<b>' + esc(t.name) + '</b><span>for your nest</span></div>' : '') +
      '<div class="row end"><button class="btn" type="button" id="storeNest">My nest</button><button class="btn go big" type="button" id="againBtn">Another round</button></div>';
    $('storeNest').addEventListener('click', function () { go('nest', { from: 'hub' }); });
    $('againBtn').addEventListener('click', function () { go('hollow', { from: 'hub', reward: true }); });
    currentSpeech = [{ text: line, who: 'tallyheart' }].concat(t ? [{ text: t.name + ', for your nest.' }] : []);
    speakItems(currentSpeech);
  }
  function hollowLesson(def, st, resume, waiting) {
    runLesson({
      def: def, state: st, mode: 'hollow',
      // (a round picked up says nothing first, but the Warrior Counts' waiting line when a sitting is paused)
      intro: resume ? (waiting ? [{ who: 'tallyheart', text: waiting }] : []) : [{ who: 'tallyheart', text: E.hollowRoundLine(def) }],
      onDone: function (sum, rec) {
        // the round was counted (E.hollowFinish, once) when its last answer went in
        hollowReward(def, rec && rec.hollow ? rec.hollow : { awarded: null, glowNow: false });
      }
    });
  }
  function hollowReward(def, res) {
    renderedAt = now();   // a new screen: the double-tap guard in bindChrome applies
    var t = res.awarded;
    var scr = $('screen');
    scr.innerHTML = frameShell('reward', 'reward');
    var panel = $('panel');
    var glows = E.hollowTable(cat, def.table || 1).glow;
    var many = E.learnedCounts(cat, stories()).length > 1;
    // an insert on the claw marks (as in the chapter's f063): the tree camera sits above the tree
    // anchor, so a cat there shows only her ear tips; her line comes in from off-panel instead
    var f = { scene: hollowScene('tree', [], glows ? ['glow', 'sparkle'] : ['sparkle']) };
    var heads = drawArt(panel, shownFrame(f), cat.look);
    var line = fill(def.done);
    var ctx = { panel: panel, frame: f, heads: heads, caps: [], balloons: [{ who: 'tallyheart', text: line, kind: 'say' }] };
    relayoutFn = function () { layoutText(ctx); };
    layoutText(ctx);
    var glowNote = E.hollowGlowNote(def, many);
    $('interact').innerHTML =
      (t ? '<div class="reward' + (reduceMotion ? '' : ' pop') + '" role="status">' + treasureSvg(t.id) + '<b>' + esc(t.name) + '</b><span>for your nest</span></div>' : '') +
      (res.glowNow ? '<p class="glow-note">' + esc(glowNote) + '</p>' : '') +
      '<div class="row end"><button class="btn" type="button" id="nestBtn">My nest</button><button class="btn go big" type="button" id="againBtn">Another round</button></div>';
    $('nestBtn').addEventListener('click', function () { go('nest', { from: 'hub' }); });
    $('againBtn').addEventListener('click', function () { go('hollow', { from: 'hub', reward: true }); });
    currentSpeech = [{ text: line, who: 'tallyheart' }].concat(t ? [{ text: t.name + ', for your nest.' }] : []).concat(res.glowNow ? [{ text: glowNote }] : []);
    speakItems(currentSpeech);
  }

  /* ================================================================ the Warrior Counts
   * docs/warrior-counts.md (decisions 48 and 49). A screen of its own, like the Hollow's: the opening's
   * frames (the big Back beside Next, within their own list), the sitting (runLesson's warrior mode:
   * the fountain, the sand on a miss, the four paws, Tallyheart's pauses), the halfway page, and the
   * result's pages. `wv` is the sitting on screen: a page turn (go('warrior', { step })) reads it; a
   * visit from the hub starts again from E.warriorBegin, which picks a sitting up or starts one, or
   * reopens a result she has not seen to the end. Nothing here runs before the Counts are open. */
  var wv = null;
  var hubWarriorSig = null;
  // the not-yet's "Back to the Training Hollow" picked a round up: the tricky greeting is kept for the
  // first Hollow page after it (its reward's "Another round" included), once
  var wTrickyDue = false;
  var quickHelp = false;   // PC.debug.warrior('sand') only: the help's count is out at once, for a picture
  function warriorDebug(what, i) {
    if (!cat) return 'no cat';
    if (!warriorBuilt()) return 'no Warrior Counts in this build';
    var ws = warriorNow();
    if (!wOpen(ws)) return 'the Warrior Counts are not open for this cat (finished.' + PC.warrior.after + '?)';
    if (what === 'result') {
      if (!wLastFinished(ws)) return 'no finished sitting';
      wv = { cat: cat.id };
      var n = wResult(PC.warrior, E.warriorResult(cat, stories()), { quiet: warriorQuietPass(), ceremony: false }).pages.length;
      go('warrior', { step: 'result', i: i == null ? 0 : i < 0 ? n + i : i });
      return true;
    }
    if (wUnseen(ws)) return 'a result is waiting to be seen (PC.debug.warrior("result"))';
    go('warrior');
    if (!wv || !wv.state) return 'no sitting';
    if (what === 'open') { if (i) go('warrior', { step: 'open', i: i }); return view.name === 'warrior' ? true : view.name; }
    if (what === 'halfway') return view.opts.step === 'halfway' ? true : 'not at the halfway page (give the sitting 28 answers)';
    if (what === 'q' || what === 'sand') {
      if (!$('keypad')) go('warrior', { step: 'q' });
      if (!$('keypad')) return 'no question';
      if (what === 'sand') {
        var qq = E.counts.question(wv.state);
        if (!qq) return 'no question';
        quickHelp = true;
        renderedAt = now() - UI_GUARD_MS - 1; renderedPerf = perfNow() - UI_GUARD_MS - 1;   // (past the double-tap guard: these taps are the tool's)
        // a wrong answer that is not a slip: one more than the right one
        String(qq.a * qq.b + 1).split('').concat(['ok']).forEach(function (k) { var b = doc.querySelector('.key[data-k="' + k + '"]'); if (b) b.click(); });
      }
      return true;
    }
    return 'warrior: open, q, sand, halfway or result';
  }
  function warriorBuilt() {
    return !!(PC.warrior && E && typeof E.warriorState === 'function' && typeof E.warriorBegin === 'function');
  }
  /* E.warriorState, read now (a sitting that is done is settled first: saved when she has `warrior` data). */
  function warriorNow() {
    if (!cat || !warriorBuilt()) return null;
    var ws = null;
    try { ws = E.warriorState(cat, stories(), now()); } catch (e) { if (root.console) console.warn('E.warriorState failed', e); return null; }
    if (cat.warrior) persist();
    return ws;
  }
  /* The sitting on screen has gone stale (two hours since its last answer, or practice since): read
   * now, as the hub reads it. */
  function warriorStale() {
    var ws = warriorNow();
    return !!(ws && ws.stale);
  }
  function hubWarrior(p) {
    // (whether the Ceremony chapter is built, finished or not: once it is, never "coming soon")
    var built = E.chapters(stories()).some(function (s) { return s.opensWhen === 'warrior'; });
    var h = wHub(warriorNow(), Object.assign({}, p, { ceremonyBuilt: built }));
    // (what the slot offers, to tell when it has changed: on a tap, and when the page is seen again)
    hubWarriorSig = h ? JSON.stringify(h) : null;
    return h;
  }
  function wireHubWarrior(WH) {
    var drawn = hubWarriorSig;
    // read again on a tap: what the button offered may have gone stale (a sitting past its two hours)
    var tap = function (act) {
      if (now() - renderedAt < UI_GUARD_MS) return;
      hubWarrior(E.progress(cat, stories()));
      if (hubWarriorSig !== drawn) return go('hub', { keepScroll: true });
      go('warrior', act === 'result' ? { result: true } : {});
    };
    if ($('warriorBtn')) $('warriorBtn').addEventListener('click', function () { tap(WH.big.act); });
    if ($('warriorAgain')) $('warriorAgain').addEventListener('click', function () { tap(WH.quiet && WH.quiet.act === 'result' ? 'result' : 'begin'); });
  }
  /* The question panel: the fountain, the whole Clan round it in a sitting with the crowd, else the camp
   * quiet (PC.warrior.scene, written with the crowd, drawn with `crowd` as the sitting's; the halfway
   * page's own scene the same way, `own`). */
  function warriorScene(st, own) { return wScene(PC.warrior, st, own); }
  function warriorSceneSvg(st) { return artRender(warriorScene(st), cat && cat.look).svg; }
  /* A pause's `beats` are on the sitting kept in its slot (the same state, or kept again at its own time). */
  function keepSitting(st) {
    var S = cat.warrior && cat.warrior.sitting;
    if (S && S.state === st) return;
    if (typeof E.warriorKeep === 'function') E.warriorKeep(cat, st, S && typeof S.at === 'number' ? S.at : now());
  }
  var PAW_PATH = '<path d="M24 25c-6.6 0-12.4 6.6-12.4 11.9 0 3.9 3.2 5.4 6.2 5.4 2.5 0 4-1.3 6.2-1.3s3.7 1.3 6.2 1.3c3 0 6.2-1.5 6.2-5.4C36.4 31.6 30.6 25 24 25z"/>' +
    '<ellipse cx="10.6" cy="20" rx="4.3" ry="5.5" transform="rotate(-20 10.6 20)"/><ellipse cx="18.6" cy="12" rx="4.5" ry="5.9" transform="rotate(-6 18.6 12)"/>' +
    '<ellipse cx="29.4" cy="12" rx="4.5" ry="5.9" transform="rotate(6 29.4 12)"/><ellipse cx="37.4" cy="20" rx="4.3" ry="5.5" transform="rotate(20 37.4 20)"/>';
  /* The four paw prints above the question line: each filled from the heel up as far as it has gone
   * (over the print's own height, heel to toe tips, so the first answer of a paw already shows). */
  function pawsSvg(fills) {
    return fills.map(function (fl, i) {
      // (a begun paw shows at once: its first answer fills the heel pad's bottom 4.5, every later one ~2 more)
      var top = 5.8, heel = 42.6, y = fl >= 1 ? 0 : Math.min(heel - 4.5, heel - (heel - top) * fl), h = 48 - y;
      return '<svg class="wpaw' + (fl >= 1 ? ' full' : fl > 0 ? ' on' : '') + '" viewBox="0 0 48 48"><defs><clipPath id="wpc' + i + '"><rect x="0" y="' + f1(y) + '" width="48" height="' + f1(h) + '"/></clipPath></defs>' +
        '<g class="wpaw-e">' + PAW_PATH + '</g>' + (fl > 0 ? '<g class="wpaw-f" clip-path="url(#wpc' + i + ')">' + PAW_PATH + '</g>' : '') + '</svg>';
    }).join('');
  }
  /* A frame of the Warrior Counts with its tokens filled (the result's {right}, {Right}, {last}, {Last},
   * {short} in number words, then the cat's own), never changing the story's. */
  function warriorFilled(f, extra) {
    if (!f) return f;
    var put = function (t) { return E.fill(t, cat, extra || {}); };
    var g = Object.assign({}, f);
    if (f.caption != null) g.caption = asList(f.caption).map(function (c) { return typeof c === 'string' ? put(c) : c && Object.assign({}, c, { text: put(c.text) }); });
    if (f.say != null) g.say = asList(f.say).map(function (b) { return typeof b === 'string' ? put(b) : b && Object.assign({}, b, { text: put(b.text) }); });
    return g;
  }
  /* One page of the Warrior Counts drawn from a frame: its panel, captions and balloons laid out as a
   * chapter's are, and a row of buttons under it. `o.back`: the big Back beside them (a function; null
   * keeps its place, invisible; false: no Back at all, the halfway page). `o.buttons`: [{ id, label, big,
   * act }], the last the big one. `o.chips`: the tricky ones written out under one of the balloons. */
  function warriorPlate(f, id, o) {
    var scr = $('screen');
    scr.innerHTML = frameShell('next', 'warrior-' + id);
    var frameEl = scr.querySelector('.frame');
    frameEl.setAttribute('data-mode', 'warrior');
    var panel = $('panel');
    var heads = drawArt(panel, shownFrame(f), cat.look);
    var caps = captionsOf(f), balloons = balloonsOf(f);
    var capsRead = E.captionsRead(f, cat).map(fill).filter(Boolean);
    panel.setAttribute('aria-label', capsRead.length ? plain(capsRead.join(' ')) : 'A comic panel');
    var ctx = { panel: panel, frame: f, heads: heads, caps: caps, capsRead: capsRead, balloons: balloons };
    if (o.chips && o.chips.list.length) {
      // the chips go under her balloon, in the column: the balloons stack there with them
      ctx.forceStack = true;
      ctx.afterBalloon = { i: Math.min(o.chips.at, Math.max(0, balloons.length - 1)),
        html: '<div class="wchips" role="list" aria-label="The tricky ones">' + o.chips.list.map(function (c) { return '<span class="wchip" role="listitem">' + esc(c) + '</span>'; }).join('') + '</div>',
        reading: o.chips.list.map(function (c) { return { text: c.replace(/ × /, ' times ').replace(/ = /, ' is '), who: 'tallyheart' }; }) };
    }
    relayoutFn = function () {
      frameEl.classList.add('solo');
      var L = layoutText(ctx);
      if ((L.captions === 'column' && ctx.caps.length) || L.balloons === 'stack') { frameEl.classList.remove('solo'); layoutText(ctx); }
    };
    relayoutFn();
    playFx(panel, f);
    var box = $('interact'), bs = o.buttons || [];
    var back = o.back === false ? '' : backBottom(!!o.back);
    box.innerHTML = '<div class="' + (bs.length > 1 ? 'row end' : 'next-row') + '">' + back + bs.map(function (b, i) {
      var last = i === bs.length - 1;
      return '<button class="btn ' + (b.big || (last && b.big !== false) ? 'go big' : 'quiet') + '" id="' + esc(b.id) + '" type="button"' + (b.disabled ? ' disabled' : '') + '>' + esc(b.label) +
        (b.next ? ' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') + '</button>';
    }).join('') + '</div>';
    // (by when the tap was made, too: the second tap of a double tap handed over late never turns this page)
    var guard = function (fn) { return function (e) { if (now() - renderedAt < 280 || tappedEarly(e, 280)) return; fn(); }; };
    bs.forEach(function (b) { if (!b.disabled && $(b.id)) $(b.id).addEventListener('click', guard(b.act)); });
    if (o.back && $('backBottom')) $('backBottom').addEventListener('click', guard(o.back));
    var nextB = bs.length === 1 && bs[0].next ? bs[0] : null;
    if (nextB) { panel.classList.add('tappable'); panel.addEventListener('click', guard(nextB.act)); }
    keyHandler = function (e) {
      if (isTyping(e)) return;
      var main = bs.length ? bs[bs.length - 1] : null;
      if ((e.key === 'ArrowRight' && nextB) || ((e.key === ' ' || e.key === 'Enter') && main && !main.disabled)) { e.preventDefault(); (nextB || main).act(); }
      else if (e.key === 'ArrowLeft' && o.back) { e.preventDefault(); o.back(); }
    };
    currentSpeech = (ctx.reading || []).concat(o.say ? asList(o.say).map(function (t) { return { text: t }; }) : []);
  }
  function renderWarrior(opts) {
    if (!cat) return go('who');
    if (!warriorBuilt()) return go('hub');
    opts = opts || {};
    var step = opts.step;
    if (!step || !wv || wv.cat !== cat.id) {
      var ws = warriorNow();
      if (!wOpen(ws)) return go('hub');
      if (opts.result || wUnseen(ws)) { wv = { cat: cat.id }; return warriorResultPage(0); }
      var r = E.warriorBegin(cat, stories(), now());
      persist();
      var op = wOpenKind(r.opening != null ? r.opening : typeof E.warriorOpen === 'function' ? E.warriorOpen(cat, r.state) : 'first');
      wv = { cat: cat.id, def: r.def, state: r.state, op: op, frames: op.kind === 'resume' ? [] : wOpening(PC.warrior, op.kind, op.aside) };
      if (!wv.frames.length) return runWarrior(op.kind === 'resume');
      return warriorOpenPage(0);
    }
    // (a page turned on a sitting gone stale while its screen was open: to the hub, which starts afresh)
    if ((step === 'open' || step === 'q' || step === 'halfway') && wv.state && warriorStale()) { wv = null; return go('hub'); }
    if (step === 'open') return warriorOpenPage(opts.i || 0);
    if (step === 'q' && wv.state) return runWarrior(false);
    if (step === 'halfway' && wv.state) return warriorHalfway();
    if (step === 'result') return warriorResultPage(opts.i || 0);
    go('hub');
  }
  /* The opening: Glintstar's rule and Tallyheart's sand the first time, one panel after that. */
  function warriorOpenPage(i) {
    var list = wv.frames, f = list[i];
    if (!f) return runWarrior(false);
    warriorPlate(f, 'open-' + i, {
      back: i > 0 ? function () { go('warrior', { step: 'open', i: i - 1, back: true }); } : null,
      buttons: [{ id: 'nextBtn', label: 'Next', next: true, act: function () { go('warrior', i + 1 < list.length ? { step: 'open', i: i + 1 } : { step: 'q' }); } }]
    });
  }
  /* The sitting itself (runLesson, mode 'warrior'). A sitting picked up with an answer in it opens on
   * Tallyheart's "Where were we? Ah, yes." over her question (PC.warrior.open.resume). */
  function runWarrior(resume) {
    var rs = resume && PC.warrior.open ? PC.warrior.open.resume : null;
    var intro = asList(rs).map(function (l) { return typeof l === 'string' ? { who: 'tallyheart', text: fill(l) } : { who: l.who || 'tallyheart', text: fill(l.text), kind: l.kind }; }).filter(function (l) { return l.text; });
    runLesson({
      def: wv.def, state: wv.state, mode: 'warrior', intro: intro, frameId: 'warrior',
      onHalfway: function () { go('warrior', { step: 'halfway' }); },
      onDone: function (sum, rec) { wv.rec = rec; wv.result = null; go('warrior', { step: 'result', i: 0 }); }
    });
  }
  /* After the 28th answer: Murmurchime's tail straight up, Glintstar's "Halfway", the big stretch. One
   * button; no Back (it comes after an answer). */
  function warriorHalfway() {
    var f = asList(PC.warrior.halfway)[0];
    if (!f) return runWarrior(false);
    // (written with the crowd, drawn like the question panel: the crowd as the sitting's)
    if (f.scene) f = Object.assign({}, f, { scene: warriorScene(wv.state, f.scene) });
    warriorPlate(f, 'halfway', { back: false, buttons: [{ id: 'keepGoing', label: 'Keep going', big: true, act: function () { go('warrior', { step: 'q' }); } }] });
  }
  /* The result: the variant's pages (UI.warrior.result), Back beside Next, the last with its buttons;
   * each of those marks the result seen (E.warriorSeen) before it goes on. */
  function warriorResultPage(i) {
    var R = wv.result || (wv.result = typeof E.warriorResult === 'function' ? E.warriorResult(cat, stories()) : null);
    if (!R) return go('hub');
    var ceremony = E.chapters(stories()).filter(function (s) { return s.opensWhen === 'warrior'; })[0] || null;
    var round = !!E.hollowRound(cat);
    var RP = wResult(PC.warrior, R, {
      quiet: warriorQuietPass(), ceremony: !!ceremony, hollowRound: round, countWords: E.countWords
    });
    if (!RP.pages.length) return go('hub');
    i = clamp(i, 0, RP.pages.length - 1);
    var pg = RP.pages[i], last = i === RP.pages.length - 1;
    var seen = function (fn) { return function () { if (typeof E.warriorSeen === 'function') E.warriorSeen(cat); persist(); wv = null; fn(); }; };
    var acts = {
      ceremony: function () { readChapter(ceremony, false); },
      camp: function () { go('hub'); },
      // (a round in progress picks up first: the tricky greeting waits for the Hollow's page after it)
      hollow: function () { wTrickyDue = round; go('hollow', { from: 'hub' }); }
    };
    warriorPlate(warriorFilled(pg.frame, RP.tokens), 'result-' + i, {
      back: i > 0 ? function () { go('warrior', { step: 'result', i: i - 1, back: true }); } : null,
      chips: pg.chips ? { at: pg.chipsAt || 0, list: pg.chips } : null,
      say: last && RP.note ? [RP.note] : null,
      buttons: last ? RP.buttons.map(function (b) { return { id: b.id, label: b.label, big: b.big, disabled: b.disabled, act: b.disabled ? null : seen(acts[b.act] || acts.camp) }; })
        : [{ id: 'nextBtn', label: 'Next', next: true, act: function () { go('warrior', { step: 'result', i: i + 1 }); } }]
    });
  }
  /* A pass in a sitting after a finished one is a quiet sitting's: the Clan comes running. */
  function warriorQuietPass() {
    var list = (cat.warrior && cat.warrior.attempts) || [];
    var fin = list.filter(function (a) { return a && a.finished; });
    return fin.length > 1;
  }

  /* ================================================================ my nest */
  function renderNest() {
    if (!cat) return go('who');
    // a Hollow round finished but never recorded still puts its treasure in the nest
    if (cat.lesson && cat.lesson.mode === 'hollow' && E.settleLesson(cat)) persist();
    var g = E.nestGroups(cat);
    var card = function (it) {
      return '<div class="treasure' + (it.gift ? ' gift' : '') + '">' + (it.count > 1 ? '<span class="n">×' + it.count + '</span>' : '') + treasureSvg(it.treasure.id) +
        esc(it.treasure.name) + (it.gift && it.treasure.from ? '<small>from ' + esc(it.treasure.from) + '</small>' : '') + '</div>';
    };
    var scr = $('screen');
    scr.innerHTML = '<section class="page">' +
      '<div class="solo-panel"><figure class="panel" id="panel"><div class="art" aria-hidden="true"></div><div class="ov"></div></figure></div>' +
      '<h1 class="h1">' + nameHtml(cat) + '’s nest</h1>' +
      // gifts from friends come first
      (g.gifts.length ? '<h2 class="h2 nest-h">From friends</h2><div class="nest-grid">' + g.gifts.map(card).join('') + '</div>' : '') +
      (g.treasures.length ? (g.gifts.length ? '<h2 class="h2 nest-h">Treasures</h2>' : '') + '<div class="nest-grid">' + g.treasures.map(card).join('') + '</div>' : '') +
      (!g.gifts.length && !g.treasures.length ? '<p class="note">Your nest is just moss and rose leaves for now. Finish a round in the Training Hollow to find a treasure.</p>' : '') +
      '<div class="links">' + (E.learnedCounts(cat, stories()).length ? '<button class="btn go" type="button" data-go="hollow">The Training Hollow</button>' : '') +
      (E.hasFile(cat) ? '<button class="btn" type="button" id="nestFile">My Case File</button>' : '') + '<button class="btn" type="button" data-go="hub">Camp</button></div>' +
      '</section>';
    var panel = $('panel');
    var f = { scene: { set: 'den', cam: 'nest', cast: [{ who: 'player', pose: 'curl', mood: 'happy', at: 'nest' }], fx: ['night'] } };
    drawArt(panel, f, cat.look);
    // (chapter 11: her nest is with the warriors once she is named)
    panel.setAttribute('aria-label', E.warriorName(cat) ? 'Your nest with the warriors' : 'Your nest in the apprentices’ den');
    Array.prototype.forEach.call(doc.querySelectorAll('[data-go]'), function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-go'), { from: 'nest' }); }); });
    if ($('nestFile')) $('nestFile').addEventListener('click', function () { openFile(); });
    currentSpeech = [{ text: E.displayName(cat) + '’s nest.' }]
      .concat(g.gifts.length ? [{ text: 'From friends:' }] : [])
      .concat(g.gifts.map(function (it) { return { text: it.treasure.name + ', from ' + it.treasure.from + '.' }; }))
      .concat(g.treasures.map(function (it) { return { text: it.treasure.name }; }));
  }

  /* ================================================================ read to me */
  var currentSpeech = [];
  // the English voice and (chapter 12) the Spanish one, each kept once found; onvoiceschanged clears both
  var voice = null, voiceEs = null;
  /* The voice for English (pickVoice() and pickVoice('en'), as before) or for Spanish (pickVoice('es')): UI.voices.pick. */
  function pickVoice(lang) {
    if (lang === 'es') {
      if (voiceEs) return voiceEs;
      try { voiceEs = voicePick(speechSynthesis.getVoices() || [], 'es'); } catch (e) { voiceEs = null; }
      return voiceEs;
    }
    if (voice) return voice;
    try { voice = voicePick(speechSynthesis.getVoices() || [], 'en'); } catch (e) { voice = null; }
    return voice;
  }
  /* Read to me: say these, in order. `onDone` runs when the last one has been said (a lesson's
   * clock starts again then: the time it took to read the question aloud is not hers).
   * Chapter 12: each item's words as before, respelled for English speech (E.sayAs); an item with Spanish in it is said
   * in parts, each in its own voice: the rows are UI.voices.plan's, and onDone hangs on the last one actually said. */
  function speakItems(items, onDone) {
    if (!save || !save.settings.readAloud || !('speechSynthesis' in root)) return;
    if (!items || !items.length) return;   // nothing new to say: let what is speaking finish
    try {
      speechSynthesis.cancel();
      var last = null, vs = { en: pickVoice(), es: pickVoice('es') };
      (items || []).forEach(function (it) {
        var said = it;
        if (!saysSpanish(it)) {
          var txt = plain(String(it.text || '').replace(/<[^>]+>/g, ' ')).trim();
          if (!txt) return;
          said = { text: E.sayAs(txt, cat), who: it.who, variant: it.variant };
        }
        voicePlan([said], vs, { cat: cat }).forEach(function (r) {
          var u = new SpeechSynthesisUtterance(r.text);
          var v = r.lang === 'es' ? vs.es : vs.en; if (v) u.voice = v;
          u.lang = (v && v.lang) || 'en-US';
          u.rate = r.rate;
          u.pitch = pitchOf(it.who, it.variant);
          speechSynthesis.speak(u);
          last = u;
        });
      });
      if (last && onDone) last.onend = function () { onDone(); };
    } catch (e) {}
  }
  /* What speakItems would hand the synthesizer for one item with Spanish in it, a line a row, "[es] " before what the
   * Spanish voice says (PC.debug.speech: DRY=1 shows which voice says what, and nothing is said). */
  function speechRows(it) {
    return voicePlan([it], { en: pickVoice(), es: pickVoice('es') }, { cat: cat }).map(function (r) { return (r.lang === 'es' ? '[es] ' : '') + r.text; });
  }
  /* The grown-ups corner's line for chapter 12: which voice reads Chispapaw's Spanish, or how to add one. Built by
   * concatenation (E.fill's {name} is a cat's); the voices read afresh when the corner opens (they may load late). */
  function esVoiceLine() {
    try { if ('speechSynthesis' in root) speechSynthesis.getVoices(); } catch (e) {}
    voiceEs = null;
    var v = pickVoice('es');
    return '<p class="muted">' + (v ? 'Chispapaw’s Spanish is read by this iPad’s Spanish voice: ' + esc(v.name) + ' (' + esc(v.lang) + ').'
      : 'No Spanish voice on this iPad, so Read to me says her Spanish in English. To add one: Settings › Accessibility › Spoken Content › Voices › Spanish.') + '</p>';
  }
  function stopSpeech() { try { if ('speechSynthesis' in root) speechSynthesis.cancel(); } catch (e) {} }

  /* ================================================================ grown-ups corner */
  function bindLeaf() {
    var leaf = $('leaf'), t = null;
    var start = function (e) {
      if (e && e.type === 'keydown') { if ((e.key !== ' ' && e.key !== 'Enter') || e.repeat) return; e.preventDefault(); }
      if (t) return;
      leaf.classList.add('holding');
      t = setTimeout(function () { t = null; leaf.classList.remove('holding'); openGrownups(); }, 1500);
    };
    var stop = function () { if (t) { clearTimeout(t); t = null; } leaf.classList.remove('holding'); };
    leaf.addEventListener('pointerdown', function (e) { e.preventDefault(); start(e); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { leaf.addEventListener(ev, stop); });
    leaf.addEventListener('keydown', start);
    leaf.addEventListener('keyup', stop);
    leaf.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    leaf.addEventListener('click', function (e) { e.preventDefault(); });
  }
  function fmtMs(ms) { return ms == null ? '–' : (ms / 1000).toFixed(1) + ' s'; }
  /* Each chapter's progress, for grown-ups. */
  function chapterProgress(c, s) {
    if (E.isFinished(c, s.id)) {
      var at = c.finished[s.id];
      var when = typeof at === 'number' && at > 1e11 ? ' ' + new Date(at).toLocaleDateString() : '';
      var re = c.chapter === s.id && E.kindOf(E.currentFrame(c, s)) !== 'end' ? '; reading it again, page ' + ((c.history || []).length + 1) : '';
      return 'finished' + when + re;
    }
    var pl = E.place(c, s.id);
    if (pl) {
      var reading = c.chapter === s.id;
      return 'on frame ' + (reading ? E.frameId(c, s) : pl.frame) + ', page ' + (pl.history.length + 1) +
        (pl.lesson ? ', partway through a lesson' : '') + (reading ? '' : ' (kept while another chapter is read)');
    }
    // (the Ceremony: it opens once the Warrior Counts are passed, not when the chapter before it is finished)
    return E.isOpen(c, s, stories()) ? 'not started' : s.opensWhen === 'warrior' ? 'opens once the Warrior Counts are passed' : 'opens when the chapter before it is finished';
  }
  /* The corner's Warrior Counts for one cat (UI.warrior.corner), or null in a build without them. */
  function warriorCornerOf(c) {
    if (!PC.warrior || typeof E.warriorState !== 'function') return null;
    var ws = null;
    try { ws = E.warriorState(c, stories(), now()); } catch (e) { ws = null; }
    var after = E.chapter(PC.warrior.after, stories());
    return wCorner(c, { open: wOpen(ws), after: after ? 'chapter ' + (after.number || '') : 'chapter 10', stale: ws ? ws.stale : null,
      date: function (ms) { return new Date(ms).toLocaleDateString(); }, secs: fmtMs });
  }
  function openGrownups() {
    stopSpeech();
    var sheet = $('sheet');
    var cats = save.cats;
    var chs = E.chapters(stories());
    var html = '<div class="sheet-in"><button class="gbtn close" type="button" id="gClose">Close</button>' +
      '<h2>Grown-ups corner</h2><p class="muted">Potomac Crossing ' + esc(E.VERSION) + ' · chapters: ' + chs.map(function (s) { return esc(s.number + ' ' + s.title); }).join(', ') +
      ' · saves on this device only, under one key (' + esc(E.STORAGE_KEY) + ', save version ' + E.SAVE_VERSION + ')' +
      (store && !store.ok ? ' · <b>this browser is not letting it save</b>' : '') + '</p>' +
      '<p class="muted">Counts times are for you, not her: the game never shows a clock. “Right first time” counts the first ask of a fact in each lesson; “helped” is how often the sand count came out.</p>';
    // chapter 12: the Spanish voice, once a cat on this device has chapter 12 open
    var ch12 = E.chapter('ch12', stories());
    if (ch12 && cats.some(function (c) { return E.isOpen(c, ch12, stories()); })) html += esVoiceLine();
    if (!cats.length) html += '<p>No cats on this device yet.</p>';
    cats.forEach(function (c) {
      var lookTxt = [lookDef('sex', c.look.sex).label, lookDef('fur', c.look.fur).label, lookDef('marking', c.look.marking).label, lookDef('eyes', c.look.eyes).label + ' eyes'].join(' · ');
      var flags = Object.keys(c.flags || {}).filter(function (k) { return !QUIET_FLAGS[k]; }).map(function (k) {
        var w = FLAG_WORDS[k] && FLAG_WORDS[k][String(c.flags[k])];
        return '<li>' + esc(w ? E.fill(w, c) : (k + ': ' + c.flags[k])) + '</li>';
      }).join('');
      // choices are keyed "chapter:frame"; listed by chapter, in the order made
      var choices = Object.keys(c.choices || {}).map(function (key) {
        var parts = key.split(':'), s = parts.length > 1 ? E.chapter(parts[0], stories()) : null;
        var where = s ? 'Ch ' + (s.number || 1) + ' · ' + parts[1] : key;
        return '<li><span class="muted">' + esc(where) + '</span> ' + esc(E.fill(c.choices[key].label, c)) + '</li>';
      }).join('');
      var g = E.nestGroups(c);
      var nestTxt = g.gifts.concat(g.treasures).map(function (it) { return it.treasure.name + (it.gift ? ' (from ' + it.treasure.from + ')' : '') + (it.count > 1 ? ' ×' + it.count : ''); }).join(', ');
      var dreams = chs.filter(function (s) { return c.dreams && typeof c.dreams[s.id] === 'string'; }).map(function (s) {
        return 'Ch ' + (s.number || 1) + ': ' + (c.dreams[s.id] || '(skipped)');
      }).join(' · ');
      // her Case File: every card she has been given, in order, with its mark in words; one her file
      // doesn't show yet (given on the roof, shown once that scene is finished) says so
      var cardsTxt = E.cards(c, stories(), { all: true }).map(function (k) {
        return '<li>' + esc(E.fill(k.line, c)) + ' <span class="muted">(' + (k.mark === 'ear' ? 'an ear: she was told, to check' : 'an eye: she saw it herself') +
          (k.shown ? '' : '; given, not in her file yet') + ')</span></li>';
      }).join('');
      var learned = E.learnedCounts(c, stories());
      var WC = warriorCornerOf(c);
      var hollowTxt = c.hollow.rounds + ' round' + (c.hollow.rounds === 1 ? '' : 's') + (learned.length ? ': ' + learned.map(function (k) {
        var r = E.hollowTable(c, k.table);
        return 'the ' + k.table + 's ' + r.rounds + ' (' + r.cleanRounds + ' without help' + (r.glow ? ', claw mark glowing' : '') + ')';
      }).join('; ') : '');
      // the take-aways kit (docs/take-aways.md, section 8): only for a cat with `takes` data
      var TC = c.takes ? takeCorner(c.takes, E.takeTable(c), fmtMs, E.takeSteps(c, stories())) : null;
      if (TC) hollowTxt += '; ' + TC.line;
      if (TC) hollowTxt = 'One Count at a time ' + hollowTxt;
      html += '<h3>' + nameHtml(c) + '</h3>' +
        '<dl><dt>Clan name</dt><dd>' + esc(c.name ? c.name + 'paw' : '(not yet)') + '</dd>' +
        '<dt>Pet name</dt><dd>' + esc(c.petname || '(not yet)') + '</dd>' +
        '<dt>Look</dt><dd>' + esc(lookTxt) + '</dd>' +
        chs.map(function (s) { return '<dt>Chapter ' + (s.number || 1) + '</dt><dd>' + esc(chapterProgress(c, s)) + '</dd>'; }).join('') +
        '<dt>Dreams</dt><dd>' + esc(dreams || '–') + '</dd>' +
        '<dt>Training Hollow</dt><dd>' + esc(hollowTxt) + '</dd>' +
        // the Warrior Counts (docs/warrior-counts.md, section 7): only in a build that has them
        (WC ? '<dt>Warrior Counts</dt><dd>' + esc(WC.line) + '</dd>' : '') +
        '<dt>Nest</dt><dd>' + esc(nestTxt || '–') + '</dd></dl>' +
        (flags ? '<h4>What the choices say</h4><ul>' + flags + '</ul>' : '') +
        (choices ? '<h4>Choices, in order</h4><ul>' + choices + '</ul>' : '') +
        (cardsTxt ? '<h4>The Case File' + (E.hasFile(c) ? '' : ' (its button appears when she is shown how to open it)') + '</h4><ul>' + cardsTxt + '</ul>' : '') +
        (WC && (WC.attempts.length || WC.sitting) ? '<h4>The Warrior Counts, sitting by sitting</h4><ul>' + WC.attempts.concat(WC.sitting ? [WC.sitting] : []).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '') +
        '<h4>The Counts</h4>' +
        (c.counts.length ? E.factTables(c, stories()).map(function (t) {
          return '<h5>' + esc(t.name) + '</h5><div class="scroll"><table><thead><tr><th>Fact</th><th>Attempts</th><th>Right first time</th><th>Helped</th><th>Typical time</th></tr></thead><tbody>' +
            t.rows.map(function (r) { return '<tr><td>' + r.a + ' × ' + r.b + '</td><td>' + r.attempts + '</td><td>' + r.rightFirst + ' of ' + r.firstAsks + '</td><td>' + r.helped + '</td><td>' + fmtMs(r.medianMs) + '</td></tr>'; }).join('') +
            '</tbody></table></div>';
        }).join('') : '<p class="muted">No answers yet.</p>') +
        (TC ? TC.html : '') +
        '<p><button class="gbtn warn" type="button" data-reset="' + esc(c.id) + '">Start this cat over</button>' +
        '<button class="gbtn warn" type="button" data-remove="' + esc(c.id) + '">Remove this cat from this device</button></p>';
    });
    html += '</div>';
    sheet.innerHTML = html;
    sheet.hidden = false;
    var close = function () { sheet.hidden = true; sheet.innerHTML = ''; doc.removeEventListener('keydown', esc1); };
    var esc1 = function (e) { if (e.key === 'Escape') close(); };
    doc.addEventListener('keydown', esc1);
    $('gClose').addEventListener('click', close);
    $('gClose').focus();
    sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });
    Array.prototype.forEach.call(sheet.querySelectorAll('[data-reset]'), function (b) {
      b.addEventListener('click', function () {
        var c = E.getCat(save, b.getAttribute('data-reset'));
        if (!c || !root.confirm('Start ' + E.displayName(c) + ' over from the very beginning? Names, choices, Counts and treasures all go.')) return;
        var fresh = E.resetCat(save, c.id, now());
        if (cat && cat.id === c.id) { cat = fresh; syncStory(); }
        persist(); close(); go('who');
      });
    });
    Array.prototype.forEach.call(sheet.querySelectorAll('[data-remove]'), function (b) {
      b.addEventListener('click', function () {
        var c = E.getCat(save, b.getAttribute('data-remove'));
        if (!c || !root.confirm('Remove ' + E.displayName(c) + ' from this device? This can’t be undone.')) return;
        E.removeCat(save, c.id);
        if (cat && cat.id === c.id) { cat = null; syncStory(); }
        persist(); close(); go('who');
      });
    });
  }

  /* ================================================================ little drawings */
  var ICON = {
    book: '<svg viewBox="0 0 48 48"><path d="M6 10c6-2 12-2 18 2v28c-6-4-12-4-18-2z" fill="#fffaf0" stroke="#1b1622" stroke-width="3" stroke-linejoin="round"/><path d="M42 10c-6-2-12-2-18 2v28c6-4 12-4 18-2z" fill="#ffe8a3" stroke="#1b1622" stroke-width="3" stroke-linejoin="round"/></svg>',
    tree: '<svg viewBox="0 0 48 48"><path d="M22 44c2-10 0-18-6-26M24 44c1-8 6-14 14-18" stroke="#5a3a22" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="14" cy="14" r="9" fill="#5fae5a" stroke="#1b1622" stroke-width="2.5"/><circle cx="34" cy="18" r="10" fill="#6fc06a" stroke="#1b1622" stroke-width="2.5"/><path d="M20 30l2-5M23 31l2-5M26 32l2-5" stroke="#ffd23f" stroke-width="2.5" stroke-linecap="round"/></svg>',
    nest: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="32" rx="19" ry="10" fill="#8a6a3a" stroke="#1b1622" stroke-width="3"/><path d="M8 30c6 4 26 4 32 0" stroke="#5fae5a" stroke-width="4" fill="none"/><circle cx="18" cy="26" r="4" fill="#9fd3ff" stroke="#1b1622" stroke-width="2"/><path d="M28 18c4 2 6 6 4 10" stroke="#4f86d8" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
    again: '<svg viewBox="0 0 48 48"><path d="M38 24a14 14 0 1 1-5-10.7" fill="none" stroke="#1b1622" stroke-width="4" stroke-linecap="round"/><path d="M34 6v9h-9" fill="none" stroke="#1b1622" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    moon: '<svg viewBox="0 0 48 48"><path d="M30 6a18 18 0 1 0 12 30A15 15 0 0 1 30 6z" fill="#ffe8a3" stroke="#1b1622" stroke-width="3" stroke-linejoin="round"/></svg>',
    // the Warrior Counts: a paw print, as on the four above the question line
    paw: '<svg viewBox="0 0 48 48"><g fill="#ffe8a3" stroke="#1b1622" stroke-width="3" stroke-linejoin="round">' + PAW_PATH + '</g></svg>',
    // her Case File: a curl of pale bark with a scratch on it (the art's PC.art.fileIcon, when it has one, is used instead)
    file: '<svg viewBox="0 0 48 48"><path d="M9 8 Q24 3 39 9 Q43 24 40 40 Q24 45 8 40 Q5 24 9 8 Z" fill="#e9dcc0" stroke="#1b1622" stroke-width="3" stroke-linejoin="round"/><path d="M39 9 Q33 12 34 18 Q40 17 40 12" fill="#cdbb95" stroke="#1b1622" stroke-width="2.4" stroke-linejoin="round"/><path d="M14 20 q5 -5 10 0 t10 0 M14 29 q5 -5 10 0 t8 0" fill="none" stroke="#5a4326" stroke-width="2.6" stroke-linecap="round"/></svg>'
  };
  function treasureSvg(id) {
    var o = '<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="#1b1622" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">';
    var c = '</g></svg>';
    switch (id) {
      case 'moss': return o + '<path d="M10 74c0-16 12-24 22-20 4-12 22-14 28-4 10-6 26 0 28 14 4 2 4 10 0 10z" fill="#5fae5a"/><path d="M24 62c4-2 8 0 8 4M50 54c4-2 8 0 9 4M70 62c3-2 7 0 7 3" fill="none" stroke="#a6e08f"/>' + c;
      case 'feather': return o + '<path d="M22 86 C30 60 46 30 78 14 C80 40 64 66 30 80z" fill="#4f86d8"/><path d="M40 62l12 6M48 48l12 6M58 34l11 5" stroke="#fffaf0" stroke-width="4"/><path d="M40 62l12 6M48 48l12 6" stroke="#1b1622" stroke-width="2"/><path d="M16 92 L66 28" fill="none"/>' + c;
      case 'shell': return o + '<path d="M50 84 L18 44 C22 22 78 22 82 44 Z" fill="#ffc9a8"/><path d="M50 84 L32 34M50 84 L50 28M50 84 L68 34M50 84 L24 44M50 84 L76 44" fill="none" stroke-width="2"/><path d="M42 84h16l-2 6h-12z" fill="#ffc9a8"/>' + c;
      // speckled, not striped: the white stripe is Riffle's lucky stone's alone
      case 'pebble': return o + '<ellipse cx="50" cy="56" rx="34" ry="24" fill="#8f97a8"/><g fill="#f2f2f2" stroke="none"><circle cx="34" cy="60" r="3"/><circle cx="49" cy="66" r="2.4"/><circle cx="62" cy="55" r="3.2"/><circle cx="70" cy="66" r="2.2"/><circle cx="44" cy="52" r="2"/><circle cx="57" cy="70" r="1.8"/><circle cx="27" cy="52" r="1.8"/></g><ellipse cx="38" cy="44" rx="8" ry="4" fill="#fff" stroke="none" opacity=".8"/>' + c;
      case 'acorn': return o + '<path d="M30 46 C30 76 50 88 50 88 C50 88 70 76 70 46z" fill="#c9843a"/><path d="M24 46 C24 30 76 30 76 46z" fill="#7a5230"/><path d="M50 32 v-12" stroke-width="5"/><path d="M34 40l6-6M44 42l6-8M56 42l6-8M66 42l4-5" stroke-width="2"/>' + c;
      case 'snail': return o + '<path d="M50 50 m-30 0 a30 30 0 1 1 60 0 a30 30 0 1 1 -60 0z" fill="#e8b46a"/><path d="M50 50 m0 -18 a18 18 0 1 1 -18 18 a12 12 0 1 1 12 -12 a6 6 0 1 1 6 6" fill="none" stroke-width="3"/>' + c;
      case 'eggshell': return o + '<path d="M18 58 C18 86 82 86 82 58 L74 50 L66 60 L58 48 L50 60 L42 48 L34 60 L26 50z" fill="#9fd8e8"/><circle cx="36" cy="72" r="2.5" fill="#5a8a9a" stroke="none"/><circle cx="60" cy="70" r="2" fill="#5a8a9a" stroke="none"/>' + c;
      case 'glass': return o + '<path d="M26 34 L56 22 L80 42 L70 74 L36 80 L20 58z" fill="#7fd6a8" opacity=".95"/><path d="M34 40 L50 34" stroke="#fff" stroke-width="5" opacity=".9"/>' + c;
      case 'clover': return o + '<path d="M50 50 C30 50 26 26 40 24 C48 22 50 34 50 50 C50 34 52 22 60 24 C74 26 70 50 50 50 C70 50 74 74 60 76 C52 78 50 66 50 50 C50 66 48 78 40 76 C26 74 30 50 50 50z" fill="#5fae5a"/><path d="M50 50 C56 66 62 78 72 90" fill="none" stroke="#3f7a3a" stroke-width="4"/>' + c;
      case 'dandelion': return o + '<path d="M50 92 C50 70 48 56 50 44" fill="none" stroke="#3f7a3a" stroke-width="4"/><circle cx="50" cy="34" r="24" fill="#fffaf0"/><g stroke-width="1.5">' +
        [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(function (a) { var r = a * Math.PI / 180; return '<path d="M50 34 L' + f1(50 + Math.cos(r) * 22) + ' ' + f1(34 + Math.sin(r) * 22) + '" />'; }).join('') + '</g>' + c;
      case 'leaf': return o + '<path d="M50 88 L50 64 L24 70 L32 56 L14 44 L30 40 L26 22 L42 32 L50 12 L58 32 L74 22 L70 40 L86 44 L68 56 L76 70 L50 64z" fill="#e2483a"/><path d="M50 88 L50 24" fill="none" stroke-width="2"/>' + c;
      case 'pinecone': return o + '<path d="M50 88 C28 72 26 40 50 16 C74 40 72 72 50 88z" fill="#9a6a3a"/><path d="M36 40h28M32 54h36M36 68h28M42 80h16" fill="none" stroke-width="2.5"/><path d="M44 34l6 6 6-6M40 48l10 6 10-6M40 62l10 6 10-6" fill="none" stroke-width="2"/>' + c;
      case 'marble': return o + '<circle cx="50" cy="52" r="30" fill="#4f9ae8"/><path d="M28 56 C40 40 52 70 72 46" fill="none" stroke="#ffd23f" stroke-width="6"/><circle cx="40" cy="40" r="6" fill="#fff" stroke="none" opacity=".85"/>' + c;
      case 'button': return o + '<circle cx="50" cy="52" r="30" fill="#ffd23f"/><circle cx="50" cy="52" r="22" fill="none" stroke-width="2"/><circle cx="43" cy="45" r="4" fill="#1b1622"/><circle cx="57" cy="45" r="4" fill="#1b1622"/><circle cx="43" cy="59" r="4" fill="#1b1622"/><circle cx="57" cy="59" r="4" fill="#1b1622"/>' + c;
      // Riffle's lucky stone: smooth, nearly black, a white stripe all the way around, never broken
      // chapter 10: Sprinkle's mist stone, a grey egg of a pebble with a band of blue and green across it
      case 'mist-stone': return o + '<path d="M50 16 C70 16 81 40 81 58 C81 76 67 88 50 88 C33 88 19 76 19 58 C19 40 30 16 50 16 Z" fill="#9aa1ab"/>' +
        '<path d="M20 50 Q50 60 80 50 L81 58 Q50 68 19 58 Z" fill="#4f9fd6" stroke="none"/><path d="M19 58 Q50 68 81 58 L80 66 Q50 76 20 66 Z" fill="#58b878" stroke="none"/>' +
        '<path d="M50 16 C70 16 81 40 81 58 C81 76 67 88 50 88 C33 88 19 76 19 58 C19 40 30 16 50 16 Z" fill="none"/>' +
        '<ellipse cx="39" cy="34" rx="7" ry="4" fill="#fff" stroke="none" opacity=".45"/>' + c;
      // the take-aways kit's frost-time treasures (docs/take-aways.md, section 5), a full Count the store round's: a leaf
      // rimmed with frost (not leaf-drop's bright red one), a white feather (not the blue jay's), the cap alone with no acorn
      // in it (not the acorn in its little hat), a plain smooth river pebble (neither speckled nor striped)
      case 'frost-leaf': return o + '<path d="M50 90 L50 70 C30 72 16 58 18 40 C28 44 32 40 30 30 C40 34 44 26 50 12 C56 26 60 34 70 30 C68 40 72 44 82 40 C84 58 70 72 50 70z" fill="#cfe6ee"/>' +
        '<path d="M50 88 L50 24 M50 56 L32 44 M50 56 L68 44 M50 42 L38 32 M50 42 L62 32" fill="none" stroke="#6e9bb0" stroke-width="2.5"/>' +
        '<g stroke="#fff" stroke-width="2.4"><path d="M24 34l6 6M30 34l-6 6M27 32v10M74 52l6 6M80 52l-6 6M77 50v10M58 16l5 5M63 16l-5 5"/></g>' + c;
      case 'snow-feather': return o + '<path d="M22 86 C30 60 46 30 78 14 C80 40 64 66 30 80z" fill="#fbfbff"/><path d="M40 62l12 6M48 48l12 6M58 34l11 5" stroke="#b9c3d6" stroke-width="3"/>' +
        '<path d="M16 92 L66 28" fill="none" stroke="#8a93a8" stroke-width="2.5"/>' + c;
      case 'acorn-cap': return o + '<path d="M18 58 C18 34 82 34 82 58 C70 66 30 66 18 58z" fill="#8a5d34"/><path d="M50 38 C52 30 56 24 62 20" fill="none" stroke-width="5"/>' +
        '<path d="M28 50l8 6M38 46l8 8M50 44l8 9M62 46l8 8M72 50l4 4M32 56l6-6M44 58l8-10M58 58l8-10M70 56l4-5" fill="none" stroke="#5a3a1e" stroke-width="2"/>' +
        '<path d="M26 62 C40 68 60 68 74 62" fill="none" stroke="#d9b07a" stroke-width="2.5"/>' + c;
      case 'river-pebble': return o + '<path d="M16 62 C14 44 34 34 54 34 C76 34 88 46 86 60 C84 74 66 80 48 80 C30 80 18 74 16 62z" fill="#a8927c"/>' +
        '<path d="M28 50 C36 42 50 40 60 42" fill="none" stroke="#fff" stroke-width="4" opacity=".5"/>' + c;
      case 'riffle-stone': return o + '<ellipse cx="50" cy="58" rx="36" ry="26" fill="#2f2b33"/>' +
        '<path d="M16 52 C30 66 70 66 84 50" fill="none" stroke="#f6f1e6" stroke-width="7" stroke-linecap="butt"/>' +
        '<ellipse cx="38" cy="46" rx="9" ry="4.5" fill="#fff" stroke="none" opacity=".35"/>' + c;
      default: return o + '<circle cx="50" cy="50" r="28" fill="#ffd23f"/>' + c;
    }
  }
  UI.treasureSvg = treasureSvg;

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(typeof globalThis !== 'undefined' ? globalThis : this);
