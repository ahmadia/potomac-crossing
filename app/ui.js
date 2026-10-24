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
 * voices (Hail, Snip, Snatch), and the corner's words for `foundHail`.
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
   * stacks the balloons under the panel). */
  function findSpot(o) {
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
    tailOverFaces: tailOverFaces, keepCircles: keepCircles };

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
    hail: 'Hail', snip: 'Snip', snatch: 'Snatch'
  };
  // otters and dogs are told apart by their variant (docs/build.md, cast, chapter 2)
  var VARIANT_NAMES = {
    otter: { 1: 'The old ferry otter', 2: 'An otter', 3: 'An otter' },
    dog: { 1: 'The shaggy dog', 2: 'The spotty dog', 3: 'The tiny dog' },
    // chapter 6: the she-cat never speaks; 3 and 4 are the watchers' two more marsh coats
    reedclan: { 1: 'ReedClan she-cat', 2: 'Young ReedClan tom', 3: 'A ReedClan cat', 4: 'A ReedClan cat' }
  };
  var PITCH = { waffles: 1.45, tallyheart: 0.92, glintstar: 0.85, grizzled: 0.6, player: 1.2, snorer: 1.1, mutterer: 1.3, snorter: 1.15, clancat: 1.0, tallone: 1.0,
    riffle: 1.5, otter: 1.05, dog: 0.9, sprinkle: 1.38, murmurchime: 1.3, reynard: 0.8, squall: 1.7,
    patience: 0.7, puddle: 1.32, wisp: 1.25,
    coil: 0.72, sloshbank: 0.62, sleet: 1.45, reedclan: 1.0,
    hail: 1.5, snip: 1.65, snatch: 1.35 };
  var VARIANT_PITCH = { otter: { 1: 0.68 }, dog: { 1: 0.55, 2: 0.95, 3: 1.75 }, reedclan: { 2: 1.12 } };
  // Sprinkle is shy: a little slower than everyone else's 0.95. Reynard is slow and smooth; Squall
  // is high and loud (as loud as the voice goes), and in a hurry. Chapter 5: Patience is low and
  // slow; Puddle is bright and quick, a little out of breath. Chapter 6: Coil is low and very slow
  // (every word on its own); Sloshbank low and slow, a big stern tom; Sleet high, quick and loud (the
  // voice's full volume, as everyone's); the young ReedClan tom a little high (VARIANT_PITCH). Chapter 8:
  // Hail bright and quick; Snip squeaky and quicker still; Snatch a little lower, his mouth full of mouse
  var RATE = { sprinkle: 0.86, reynard: 0.82, squall: 1.02, patience: 0.8, puddle: 1.05, coil: 0.7, sloshbank: 0.88, sleet: 1.04,
    hail: 1.08, snip: 1.12, snatch: 1.0 };
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
    foundHail: { 'true': 'found Hail in the hollow log in the Barking Field (later chapters remember)' }
  };
  UI.flagWords = FLAG_WORDS;
  // flags the engine keeps for itself: never listed among "what the choices say"
  var QUIET_FLAGS = { looked: 1, caseFileOpen: 1 };
  UI.quietFlags = QUIET_FLAGS;

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
  var fileState = null;
  var fileTeach = null;
  var frameTap = null;

  function $(id) { return doc.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rich(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
  }
  function plain(s) { return String(s == null ? '' : s).replace(/\*+/g, '').replace(/×/g, ' times '); }
  function fill(s) { return E.fill(s, cat); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function asList(x) { return x == null ? [] : (Array.isArray(x) ? x : [x]); }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }
  function now() { return Date.now(); }
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
  function speakerName(s) { return speakerLabel(s, { cat: cat, story: story, fill: fill }); }
  /* A frame's balloons as she sees them (E.balloons: `when` applied). The nth balloon from a who
   * belongs to the nth of them in the cast (hidden balloons still count), for its coat and voice.
   * `digits` (the Warrior Counts: "7 × 8") are lettered small in Andika beside the balloon. */
  function balloonsOf(frame) {
    var cast = (frame.scene && frame.scene.cast) || [];
    return E.balloons(frame, cat).map(function (s) {
      var mine = cast.filter(function (c) { return c && c.who === s.who; });
      var member = mine[s.nth] || mine[0];
      var b = { who: s.who || '', text: fill(s.text || ''), kind: s.kind || 'say', name: s.name, nth: s.nth, variant: member && member.variant, raw: s };
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
      if (!relayoutFn) return;
      var p = $('panel');
      if (p && lastLayout && p.clientWidth === lastLayout.W && p.clientHeight === lastLayout.H) return;
      relayoutFn();
    }, 120));
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { if (relayoutFn) relayoutFn(); });
    if (doc.fonts && doc.fonts.addEventListener) doc.fonts.addEventListener('loadingdone', function () { if (relayoutFn) relayoutFn(); });
    doc.addEventListener('keydown', function (e) {
      // her Case File is open over the page: its own keys only (Escape: back to her cards, then closed)
      if (fileState) { fileKey(e); return; }
      if (!keyHandler) return;
      // a held-down Enter, or a page key on a screen just drawn, is not a new press (UI.keys)
      if (!keyFresh(e, renderedAt, now())) { if (PAGE_KEYS[e.key] && !isTyping(e)) e.preventDefault(); return; }
      keyHandler(e);
    });
    if ('speechSynthesis' in root) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () { voice = null; }; } catch (e) {} }
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
      speech: function () { return (currentSpeech || []).map(function (it) { return plain(String((it && it.text) || '').replace(/<[^>]+>/g, ' ')).trim(); }).filter(Boolean); },
      go: go,
      /* Chapter 4, for tools/shots.mjs: her Case File open over the page (a card's id: that card
       * shown large), closed again, and one tap on the page's tap picture (a skip-count, the row of
       * bark, the glint). */
      file: function (cardId) { if (!cat) return 'no cat'; openFile({ card: cardId || null, quiet: true }); return fileState ? true : 'not open'; },
      closeFile: function () { closeFile(true); return true; },
      tap: function () { if (typeof frameTap !== 'function') return 'nothing to tap here'; frameTap(); return true; }
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
      if (now() - renderedAt < UI_GUARD_MS) { e.stopPropagation(); e.preventDefault(); }
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
      fo.addEventListener('click', function (e) { if (e.target === fo) closeFile(); });
    }
    $('textBtn').addEventListener('click', function () {
      save.settings.bigText = !save.settings.bigText; applySettings(); persist();
      if (relayoutFn) relayoutFn();
    });
    $('readBtn').addEventListener('click', function () {
      save.settings.readAloud = !save.settings.readAloud; applySettings(); persist();
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
    var fn = { title: renderTitle, who: renderWho, frame: renderFrame, book: renderBook, hub: renderHub, hollow: renderHollow, nest: renderNest }[name];
    if (!fn) fn = renderTitle;
    fn(opts);
    if (!reduceMotion) { void scr.offsetWidth; scr.classList.add(opts.back ? 'enter-back' : 'enter'); }
    renderedAt = now();
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
    // her Case File, on every frame of every chapter once she has it (from the `file` frame on);
    // left off a lesson's keypad screen, as Back is. On the `file` frame itself it glows
    var fb = $('fileBtn');
    if (fb) {
      var hasFile = n === 'frame' && !!cat && E.hasFile(cat) && !inLesson;
      fb.hidden = !hasFile;
      $('bar').classList.toggle('has-file', hasFile);
      fb.classList.toggle('glow', hasFile && !!story && E.kindOf(E.currentFrame(cat, story)) === 'file');
      if (!hasFile) fb.classList.remove('got', 'nudge');
    }
    var t = '';
    if (n === 'title') t = '';
    else if (n === 'who') t = 'Potomac Crossing';
    else if (cat) t = esc(E.displayName(cat)) + (n === 'frame' && story ? '<small>Chapter ' + (story.number || 1) + ' · ' + esc(story.title) + '</small>' : '');
    title.innerHTML = t;
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
    if (n === 'hollow' || n === 'nest') return go(view.opts.from === 'book' ? 'book' : 'hub', { back: true });
    if (n === 'hub') return go('who', { back: true });
    go('title', { back: true });
  }
  /* The big Back button at the left of every frame's bottom row, beside Next, the same size. On the
     first frame there is nothing to go back to: it keeps its place, invisible, so Next never moves. */
  function backBottom() {
    var can = E.canBack(cat);
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
      (cat ? '<button class="btn go big" id="resumeBtn" type="button">' + (atCampEnd(cat) ? 'Back to camp, ' : 'Keep reading, ') + esc(E.displayName(cat)) + '</button>' +
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
        '<b' + (E.displayName(c).length > 12 ? ' class="long"' : '') + '>' + esc(E.displayName(c)) + '</b><span>' + esc(status) + '</span></button>';
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
    var soloOk = kind === 'next' || kind === 'counts' || kind === 'scratch' || kind === 'file';
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
    };
    relayoutFn();
    playFx(panel, f);
    renderInteraction(f, kind, id, ctx);
    currentSpeech = ctx.reading || [];
    persist();
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
        el.innerHTML = rich(caps[ci]);
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
        if (ctx.frame.end && /^(the )?end of chapter/i.test(c)) return '<p class="endcap">' + rich(c) + '</p>';
        return '<p class="caption">' + rich(c) + '</p>';
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
      t.innerHTML = (!hd && !(prevB && same) ? '<span class="tagin">' + esc(speakerName(b)) + '</span>' : '') + rich(b.text);
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
      stack.innerHTML = bs.map(function (b) { return stackBalloon(b); }).join('');
      bs.forEach(function (b) { reading.push({ text: b.text, who: b.who, variant: b.variant }); });
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
    return '<div class="sbrow' + (right ? ' right' : '') + '">' + (face ? '<span class="sface" aria-hidden="true">' + face + '</span>' : '') +
      '<div class="sb ' + esc(b.kind || '') + (right ? ' right' : '') + ' ' + (extraClass || '') + '"><span class="who">' + esc(speakerName(b)) + '</span>' + (b.html != null ? b.html : rich(b.text)) +
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
        return '<button class="choice" type="button" data-i="' + o.index + '" data-n="' + (n + 1) + '"' + (o.index === picked ? ' aria-current="true"' : '') + '>' + rich(fill(E.optionLabel(o.option, cat))) + '</button>';
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
    if (kind === 'scratch') return renderGlint(f, id, ctx, box, panel);
    if (kind === 'input') return renderInput(f, id, box);
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
    var hint = words.prompt ? fill(words.prompt) : '';
    panel.setAttribute('aria-label', words.aria);
    $('colTop').innerHTML = caps.map(function (c) { return '<p class="caption">' + rich(c) + '</p>'; }).join('');
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
        lines.push(counter);
      }
      if (v.done && sk.done) lines.push({ who: teacher, name: tname, text: fill(sk.done) });
      $('stack').innerHTML = lines.map(function (b) { return stackBalloon(b); }).join('');
      // the bottom row: Back (and Next, only after a done line); counting is done on the cats
      var showNext = v.done && !!sk.done;
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
      speakItems([{ text: v.say || String(v.total), who: teacher }].concat(v.done && sk.done ? [{ text: fill(sk.done), who: teacher }] : []));
      if (v.done && sk.done) { var nb = $('nextBtn'); if (nb) nb.focus({ preventScroll: true }); }
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
        if (E.skipView(sk, taps).done) { if (sk.done) advance(); } else tap();
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
      if (v.done) { var nb = $('nextBtn'); if (nb) nb.focus({ preventScroll: true }); }
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
    $('colTop').innerHTML = caps.map(function (c) { return '<p class="caption">' + rich(c) + '</p>'; }).join('');
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
    drawFile();
    $('file').hidden = false;
    doc.documentElement.classList.add('file-open');   // the page behind it stays put
  }
  /* Close it: back to the same frame, nothing changed (`silent`: the page is changing anyway). */
  function closeFile(silent) {
    var st = fileState, el = $('file');
    if (!st) return;
    fileState = null;
    el.hidden = true; el.innerHTML = '';
    doc.documentElement.classList.remove('file-open');
    stopSpeech();
    if (silent) return;
    if (st.onClose) st.onClose();
    else if (st.restore && st.restore.focus) { try { st.restore.focus({ preventScroll: true }); } catch (e) {} }
  }
  function fileKey(e) {
    if (e.key === 'Escape' || (e.key === 'ArrowLeft' && fileState.card)) {
      e.preventDefault();
      if (fileState.card) { fileState.card = null; drawFile(); } else closeFile();
    }
  }
  function fileCard(c) {
    var line = fill(c.line);
    return '<button class="cf-card ' + c.mark + '" type="button" data-card="' + esc(c.id) + '" aria-label="' + esc(plain(line) + ' ' + E.markMeans(c.mark)) + '">' +
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
      html = '<div class="cf-in"><div class="cf-head"><h2 class="cf-title' + (E.displayName(cat).length > 12 ? ' long' : '') + '" id="fileTitle">' + esc(F.title) + '</h2>' + close + '</div>' +
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

  /* ---------------------------------------------------------------- inputs */
  function renderInput(f, id, box) {
    var inp = f.input, kind = inp.kind;
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
    var finish = function (sum) { if (E.finishCounts(cat, story, sum, now())) { persist(); go('frame'); } };
    runLesson({
      def: def, state: st, intro: intro, mode: 'chapter',
      onDone: function (sum) {
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
      }
    });
  }

  /* One lesson, used by the chapter and the Training Hollow alike. A borrowed question (a filler
   * from the set's fillFrom) is asked as its lending set's: D is the set the question is asked as. */
  function runLesson(o) {
    var def = o.def, st = o.state, D = def;
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
    var art = panel.querySelector('.art');
    var stack = $('stack'), box = $('interact');
    var typed = '', t0 = 0, locked = false, q = null, first = true;
    // "Got it!" sits over the keypad: after a tap brings the next question, the keypad ignores
    // presses for a moment, so the second tap of a double tap never types into the new question
    var padLockedUntil = 0;
    relayoutFn = null;
    panel.setAttribute('aria-label', 'Counting picture');
    box.innerHTML =
      '<div class="counts">' +
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
    function fillQ(t) { return E.fill(t, cat, { a: q.a, b: q.b, answer: q.answer, groups: q.groups, per: q.per, thing: thing, things: things }); }
    function balloonLines(x) {
      return asList(x).map(function (b) { return typeof b === 'string' ? { text: b } : b; }).filter(function (b) { return b && b.text; })
        .map(function (b) { return b.kind === 'caption' ? { text: fillQ(b.text), kind: 'caption' } : { who: b.who || teacher, text: fillQ(b.text), kind: b.kind }; });
    }
    /* What is said before she answers (E.promptLines: the question's own prompt, the set's first
     * question, a retry's againIntro, a borrowed question's fillIntro, or the generic question), with
     * the cat's tokens filled. */
    function promptLines() {
      return E.promptLines(def, D, q).map(function (l) {
        return l.kind === 'caption' ? { text: fill(l.text), kind: 'caption' } : { who: l.who, text: fill(l.text), kind: l.kind };
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
      q = E.counts.question(st);
      if (!q) return finish();
      asSet(E.questionDef(def, q, story, stories()));
      typed = ''; locked = false;
      pad.classList.remove('locked', 'away'); $('lessonNext').hidden = true;
      $('gotIt').textContent = 'Got it!';
      // `lit`: what glows as it is asked (2 × 6: the first five cats' ears, ten, to hop on from)
      // (chapter 5's nines open on the hop: all ten claws lit on every cat; then playTuck)
      var tuck = q.light === 'tuck' ? E.lightSteps(D, q) : null;
      if (tuck) paint(tuck.open); else picture(q.lit || 0);
      var lines = [];
      if (first && o.intro && o.intro.length) lines = o.intro.slice();
      lines = lines.concat(promptLines());
      first = false;
      say(lines);
      showQ('', '');
      // a long intro (two balloons and a caption over the first question) can push the keypad's
      // last row below the screen: bring the whole keypad into view, whatever the intro's length
      var kb = pad.getBoundingClientRect().bottom, vh = root.innerHeight || 0;
      if (vh && kb > vh) root.scrollBy(0, kb - vh + 8);
      t0 = performance.now();
      var asked = q;
      if (tuck) playTuck(asked, tuck);
      else if (q.light) lightUp(asked);
      speakItems(lines.map(function (l) { return { text: l.text, who: l.who, variant: l.variant }; }).concat([{ text: E.counts.ask(def, q) }]),
        function () { restartClock(asked); });
    }
    function press(k) {
      if (locked || now() < padLockedUntil) return;
      if (k === 'ok') return submit();
      typed = keypadPress(typed, k);   // up to three digits: 10 × 10 is 100
      showQ(typed, '');
    }
    function submit() {
      if (!typed || locked) return;
      locked = true; pad.classList.add('locked');
      var ms = performance.now() - t0;
      // a borrowed question earns its own lesson's praise and fast lines
      var res = E.counts.answer(st, D, typed, ms, now());
      E.logAnswer(cat, res.entry);
      // the last answer finishes the lesson: record it now, not after the praise pause
      if (res.done) o.recorded = E.recordLesson(cat, st);
      else if (o.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, chapter: story.id, state: st };
      else cat.lesson = { mode: o.mode, state: st };
      persist();
      if (res.correct) {
        showQ(typed, 'right');
        // five pairs of ears sliding into two rows of five: the picture regroups, all lit
        if (res.rightPicture) { var R = look(res.rightPicture); picture(R.groups * R.per, res.rightPicture); }
        else if (res.shows) answersPicture(res.shows, null);   // chapter 5: her two answers in the sand, under the line about them
        else picture(q.groups * q.per);
        if (res.balloons && res.balloons.length) {
          // the question's own lines go on with the story: she reads them, then taps on
          var lines = balloonLines(res.balloons);
          say(lines);
          speakItems(lines.map(function (l) { return { text: l.text, who: l.who }; }));
          pad.classList.add('away');
          $('gotIt').textContent = 'Next';
          $('lessonNext').hidden = false;
          later(function () { $('gotIt').focus({ preventScroll: true }); }, 50);
          return;
        }
        var line = fill(res.line);
        // a set may have nothing to say after a right answer (the next frame answers): no empty balloon
        say(line ? [{ who: teacher, text: line }] : []);
        if (line) speakItems([{ text: line, who: teacher }]);
        var wait = !line ? 800 : save.settings.readAloud ? 2600 : (res.fast ? 1300 : 1500);
        var skip = function () { panel.removeEventListener('click', skip); clearTimers(); ask(true); };
        panel.addEventListener('click', skip);
        later(function () { panel.removeEventListener('click', skip); ask(); }, wait);
      } else {
        showQ(typed, 'miss');
        later(function () { help(res); }, 650);
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
      speakItems([{ text: intro, who: opener }]);
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
        say([{ who: counter, html: '<span class="counter">' + nums.join(' · ') + '</span>' }].concat(line ? [{ who: teacher, text: line }] : []));
        typed = String(hp.answer);
        showQ(typed, 'right');
        speakItems([{ text: hp.a + ' times ' + hp.b + ' is ' + hp.answer + '. ' + line, who: teacher }]);
        $('lessonNext').hidden = false;
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
      later(function () {
        say([{ who: opener, text: intro }, { who: counter, text: '…' }]);
        ticking = true;
        tick();
      }, 900);
    }
    function finish() {
      keyHandler = null;
      inLesson = false;
      var sum = E.counts.summary(st);
      // recorded at the last answer; this only catches a lesson that somehow was not
      if (!o.recorded && cat.lesson && cat.lesson.state === st) { o.recorded = E.recordLesson(cat, st); persist(); }
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
      else if (e.key === 'Enter') { e.preventDefault(); if (!$('lessonNext').hidden) ask(true); else press('ok'); }
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
    $('screen').innerHTML =
      '<section class="page center">' +
      '<div class="hero"><span class="face" aria-hidden="true">' + catPortrait(cat.look, 'proud') + '</span>' +
      '<div><h1 class="h1" style="text-align:left">' + esc(E.displayName(cat)) + '</h1><p class="note" style="text-align:left">Apprentice of CrystalClan' +
      (latest ? ' · Chapter ' + (latest.number || 1) + ' finished' : '') + '</p></div></div>' +
      // "… is coming soon" stands where the big button goes, so it never sinks below the screen
      '<div class="hub">' + big + soon +
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
    currentSpeech = [{ text: E.displayName(cat) + ', apprentice of CrystalClan.' }].concat(p.next ? [{ text: bigSays }] : p.soon ? [{ text: p.soon.title + ' is coming soon.' }] : []);
    keyHandler = function (e) { if (!isTyping(e) && e.key === 'Enter' && $('nextChapter') && doc.activeElement === doc.body) { e.preventDefault(); $('nextChapter').click(); } };
  }
  function hubBtn(w, label, icon, ch) { return '<button class="btn" type="button" data-go="' + w + '"' + (ch ? ' data-ch="' + esc(ch) + '"' : '') + '><i aria-hidden="true">' + icon + '</i>' + esc(label) + '</button>'; }

  /* ================================================================ the book */
  /* One book: the title and portrait once, then a page per finished chapter, then the latest
   * chapter's teaser. Printing puts each chapter on its own page. */
  function renderBook(opts) {
    if (!cat) return go('who');
    var b = E.buildFullBook(cat, stories());
    var t = b.teaser;
    $('screen').innerHTML =
      '<article class="book" aria-label="' + esc(b.title) + '">' +
      // a long Clan name ("Thunderwhiskerpaw’s") gets a smaller title, so the word never breaks
      '<h1' + (E.displayName(cat).length > 12 ? ' class="long"' : '') + '>' + esc(b.title) + '</h1>' +
      '<div class="portrait" aria-hidden="true">' + catPortrait(cat.look, 'happy') + '</div>' +
      (b.pages.length ? b.pages.map(function (pg) {
        return '<section class="bookpage" id="book-' + esc(pg.id) + '"><h2 class="chap">' + esc(pg.heading) + '</h2>' +
          pg.recap.map(function (p) { return '<p>' + rich(p) + '</p>'; }).join('') +
          (pg.dream ? '<p class="dream">' + rich(pg.dream) + '</p>' : '') + '</section>';
      }).join('') : '<p class="chap">Finish a chapter, and it goes in your book.</p>') +
      dragonetPages(b.dragonets) +
      '<div class="sig">' + esc(E.displayName(cat)) + ' of CrystalClan</div>' +
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
      bt.addEventListener('click', function () { var w = bt.getAttribute('data-go'); go(w, { from: 'book' }); });
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
      if (pg.dream) currentSpeech.push({ text: pg.dream });
    });
    if (b.dragonets) {
      currentSpeech.push({ text: 'The dragonets.' });
      b.dragonets.found.forEach(function (d) { currentSpeech.push({ text: d.name + '.' }); d.lines.forEach(function (l) { currentSpeech.push({ text: l }); }); });
      if (b.dragonets.toFind) currentSpeech.push({ text: cap1(numWord(b.dragonets.toFind)) + ' more, still to find.' });
    }
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
  function renderHollow(opts) {
    if (!cat) return go('who');
    // the round in progress: in the slot, or back from waiting while a chapter lesson had it
    // (that chapter lesson now waits in its chapter's place)
    var waited = !!cat.hollowWaiting, HL = E.hollowRound(cat);
    if (waited) persist();
    if (HL) {
      var tbl = HL.state.table || 1;
      if (!E.counts.done(HL.state)) return hollowLesson(E.hollowDef(stories(), tbl), HL.state, true);
      // a round whose last answer is in but which was never recorded: it counts, once
      var rec = E.settleLesson(cat);
      persist();
      if (rec && rec.hollow) return hollowReward(E.hollowDef(stories(), tbl), rec.hollow);
    }
    // the Counts she can practise and Tallyheart's lines about them (E.hollowLines: each Count's own
    // word there, "tens" for the 10s, so the 5s and the 10s never read the same)
    var HW = E.hollowLines(cat, stories(), { reward: !!(opts && opts.reward) });
    var defs = HW.counts;
    var scr = $('screen');
    scr.innerHTML = frameShell('hollow', 'hollow');
    var panel = $('panel');
    var one = HW.one;
    var f = {
      scene: hollowScene('wide', [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'sunpatch', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'sand-left', facing: 'right' }], ['sunset']),
      caption: ['The Training Hollow. The old tree leans over the sand like it’s listening.'],
      say: [{ who: 'tallyheart', text: HW.greet }]
    };
    if (HW.glow) f.say.push({ who: 'tallyheart', text: HW.glow });
    var heads = drawArt(panel, shownFrame(f), cat.look);
    var ctx = { panel: panel, frame: f, heads: heads, caps: captionsOf(f), balloons: balloonsOf(f) };
    relayoutFn = function () { layoutText(ctx); };
    layoutText(ctx);
    var start = function (table) {
      var r = E.hollowStart(cat, stories(), now(), table);
      E.holdLesson(cat);   // a chapter lesson in progress waits in its chapter's place, never lost to the round
      cat.lesson = { mode: 'hollow', state: r.state }; persist();
      hollowLesson(r.def, r.state, false);
    };
    if (one) {
      $('interact').innerHTML = '<div class="row end"><button class="btn" type="button" id="nestBtn">My nest</button><button class="btn go big" type="button" id="startBtn" data-t="' + one.table + '">Start a round</button></div>';
    } else {
      $('interact').innerHTML = '<div class="counts-pick" role="group" aria-label="Which Count?">' + defs.map(function (d) {
        return '<button class="btn go big" type="button" data-t="' + d.table + '">' + (d.glow ? '<i class="glowdot" role="img" aria-label="glowing"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.7 7.8 7.8 2.7-7.8 2.7L12 22.5l-2.7-7.8L1.5 12l7.8-2.7z"/></svg></i>' : '') + esc(d.name) + '</button>';
      }).join('') + '</div><div class="row end"><button class="btn" type="button" id="nestBtn">My nest</button></div>';
    }
    $('nestBtn').addEventListener('click', function () { go('nest', { from: 'hollow' }); });
    Array.prototype.forEach.call($('interact').querySelectorAll('[data-t]'), function (b) {
      b.addEventListener('click', function () { start(+b.getAttribute('data-t')); });
    });
    currentSpeech = (ctx.reading || []).concat(one ? [] : defs.map(function (d) { return { text: d.name.replace(' · ', ', ') }; }));
  }
  function hollowLesson(def, st, resume) {
    runLesson({
      def: def, state: st, mode: 'hollow',
      intro: resume ? [] : [{ who: 'tallyheart', text: E.hollowRoundLine(def) }],
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
      '<h1 class="h1">' + esc(E.displayName(cat)) + '’s nest</h1>' +
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
    panel.setAttribute('aria-label', 'Your nest in the apprentices’ den');
    Array.prototype.forEach.call(doc.querySelectorAll('[data-go]'), function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-go'), { from: 'nest' }); }); });
    if ($('nestFile')) $('nestFile').addEventListener('click', function () { openFile(); });
    currentSpeech = [{ text: E.displayName(cat) + '’s nest.' }]
      .concat(g.gifts.length ? [{ text: 'From friends:' }] : [])
      .concat(g.gifts.map(function (it) { return { text: it.treasure.name + ', from ' + it.treasure.from + '.' }; }))
      .concat(g.treasures.map(function (it) { return { text: it.treasure.name }; }));
  }

  /* ================================================================ read to me */
  var currentSpeech = [];
  var voice = null;
  function pickVoice() {
    if (voice) return voice;
    try {
      var vs = speechSynthesis.getVoices() || [];
      var en = vs.filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
      var pref = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Google US English'];
      for (var i = 0; i < pref.length && !voice; i++) voice = en.filter(function (v) { return v.name.indexOf(pref[i]) === 0; })[0] || null;
      if (!voice) voice = en.filter(function (v) { return /en-US/i.test(v.lang); })[0] || en[0] || null;
    } catch (e) { voice = null; }
    return voice;
  }
  /* Read to me: say these, in order. `onDone` runs when the last one has been said (a lesson's
   * clock starts again then: the time it took to read the question aloud is not hers). */
  function speakItems(items, onDone) {
    if (!save || !save.settings.readAloud || !('speechSynthesis' in root)) return;
    if (!items || !items.length) return;   // nothing new to say: let what is speaking finish
    try {
      speechSynthesis.cancel();
      var last = null;
      (items || []).forEach(function (it) {
        var txt = plain(String(it.text || '').replace(/<[^>]+>/g, ' ')).trim();
        if (!txt) return;
        var u = new SpeechSynthesisUtterance(txt);
        var v = pickVoice(); if (v) u.voice = v;
        u.lang = (v && v.lang) || 'en-US';
        u.rate = rateOf(it.who);
        u.pitch = pitchOf(it.who, it.variant);
        speechSynthesis.speak(u);
        last = u;
      });
      if (last && onDone) last.onend = function () { onDone(); };
    } catch (e) {}
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
    return E.isOpen(c, s, stories()) ? 'not started' : 'opens when the chapter before it is finished';
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
      var hollowTxt = c.hollow.rounds + ' round' + (c.hollow.rounds === 1 ? '' : 's') + (learned.length ? ': ' + learned.map(function (k) {
        var r = E.hollowTable(c, k.table);
        return 'the ' + k.table + 's ' + r.rounds + ' (' + r.cleanRounds + ' without help' + (r.glow ? ', claw mark glowing' : '') + ')';
      }).join('; ') : '');
      html += '<h3>' + esc(E.displayName(c)) + '</h3>' +
        '<dl><dt>Clan name</dt><dd>' + esc(c.name ? c.name + 'paw' : '(not yet)') + '</dd>' +
        '<dt>Pet name</dt><dd>' + esc(c.petname || '(not yet)') + '</dd>' +
        '<dt>Look</dt><dd>' + esc(lookTxt) + '</dd>' +
        chs.map(function (s) { return '<dt>Chapter ' + (s.number || 1) + '</dt><dd>' + esc(chapterProgress(c, s)) + '</dd>'; }).join('') +
        '<dt>Dreams</dt><dd>' + esc(dreams || '–') + '</dd>' +
        '<dt>Training Hollow</dt><dd>' + esc(hollowTxt) + '</dd>' +
        '<dt>Nest</dt><dd>' + esc(nestTxt || '–') + '</dd></dl>' +
        (flags ? '<h4>What the choices say</h4><ul>' + flags + '</ul>' : '') +
        (choices ? '<h4>Choices, in order</h4><ul>' + choices + '</ul>' : '') +
        (cardsTxt ? '<h4>The Case File' + (E.hasFile(c) ? '' : ' (its button appears when she is shown how to open it)') + '</h4><ul>' + cardsTxt + '</ul>' : '') +
        '<h4>The Counts</h4>' +
        (c.counts.length ? E.factTables(c, stories()).map(function (t) {
          return '<h5>' + esc(t.name) + '</h5><div class="scroll"><table><thead><tr><th>Fact</th><th>Attempts</th><th>Right first time</th><th>Helped</th><th>Typical time</th></tr></thead><tbody>' +
            t.rows.map(function (r) { return '<tr><td>' + r.a + ' × ' + r.b + '</td><td>' + r.attempts + '</td><td>' + r.rightFirst + ' of ' + r.firstAsks + '</td><td>' + r.helped + '</td><td>' + fmtMs(r.medianMs) + '</td></tr>'; }).join('') +
            '</tbody></table></div>';
        }).join('') : '<p class="muted">No answers yet.</p>') +
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
