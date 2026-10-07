/* Potomac Crossing: the UI.
 *
 * The comic page: title, "Who's playing?", the frames (panel, captions, balloons, sound effects,
 * and one interaction each), the Counts lesson with its keypad, the book page, the Training
 * Hollow, My nest, and the grown-ups corner. All state lives in PC.engine; this file draws it.
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
    var best = null, bestCost = Infinity;
    for (var y = m; y <= H - h - m; y += step) {
      for (var x = m; x <= W - w - m; x += step) {
        var r = { x: x, y: y, w: w, h: h };
        var bad = false, i;
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
          if (head) { var hx2 = head.x, hy2 = head.y; for (i = 0; i < placed.length; i++) if (placed[i] !== nb && segHitsRect(cx, y + h / 2, hx2, hy2, placed[i])) cost += 300; }
        } else if (head) {
          for (i = 0; i < placed.length; i++) if (segHitsRect(cx, y + h / 2, head.x, head.y, placed[i])) cost += 400;
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
        }
        if (prev) {
          if (y < prev.y - 4) cost += (prev.y - y) * 3 + 80;
          if (y < prev.y + prev.h && y + h > prev.y && x < prev.x) cost += 60;
        }
        for (i = 0; i < bodies.length; i++) cost += overlapArea(r, bodies[i]) * 0.012;
        if (cost < bestCost) { bestCost = cost; best = { x: x, y: y, w: w, h: h, cost: cost }; }
      }
    }
    return best;
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
   * { box: {x, y, w, h}, size, clear } (clear: no caption or balloon over it). */
  function sfxPlace(text, W, H, faces, placed) {
    var fit = sfxFit(text, W), size0 = fit.size, estW0 = fit.estW, estH0 = fit.estH;
    var best = null, bestScore = Infinity, bestHidden = true, size = size0;
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
    speakerSlot: speakerSlot, speakerRuns: speakerRuns, readsAfter: readsAfter, sfxFit: sfxFit, sfxPlace: sfxPlace };

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
    sprinkle: 'Sprinkle', murmurchime: '{Murmur}chime'
  };
  // otters and dogs are told apart by their variant (docs/build.md, cast, chapter 2)
  var VARIANT_NAMES = {
    otter: { 1: 'The old ferry otter', 2: 'An otter', 3: 'An otter' },
    dog: { 1: 'The shaggy dog', 2: 'The spotty dog', 3: 'The tiny dog' }
  };
  var PITCH = { waffles: 1.45, tallyheart: 0.92, glintstar: 0.85, grizzled: 0.6, player: 1.2, snorer: 1.1, mutterer: 1.3, snorter: 1.15, clancat: 1.0, tallone: 1.0,
    riffle: 1.5, otter: 1.05, dog: 0.9, sprinkle: 1.38, murmurchime: 1.3 };
  var VARIANT_PITCH = { otter: { 1: 0.68 }, dog: { 1: 0.55, 2: 0.95, 3: 1.75 } };
  // Sprinkle is shy: a little slower than everyone else's 0.95
  var RATE = { sprinkle: 0.86 };
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
   * hides her face under her tail ("A muffled voice", "The tail"). */
  function faceHidden(s, member) { return !!s.name && (!member || member.pose === 'eyes' || member.pose === 'hide'); }
  UI.speakers = { label: speakerLabel, pitch: pitchOf, rate: rateOf, faceHidden: faceHidden, NAMES: NAMES };
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
    ch3Told: { 'true': 'told Tallyheart about Sprinkle, and Tallyheart helped hide her (later chapters remember)', 'false': 'kept Sprinkle’s secret: only Riffle knows too (later chapters remember)' }
  };
  UI.flagWords = FLAG_WORDS;

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
  // "tails and ears", "tails, ears and claws"
  function andList(a) { return a.length > 2 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a.join(' and '); }

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
        E.chapters(stories()).forEach(function (s) { out[s.id] = E.checkStory(s); });
        return out;
      },
      layout: function () { return lastLayout; },
      go: go
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
    relayoutFn = null; keyHandler = null; currentSpeech = [];
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
    var scr = $('screen');
    scr.innerHTML = frameShell(kind, id);
    var panel = $('panel');
    var kept = E.keptSkip(story, id, cat);
    var heads = kept ? drawKept(panel, kept.skip) : drawArt(panel, shownFrame(f), cat.look);
    // a kept counting picture sits on the lesson's sand, as on the skip page and in the lesson
    if (kept) panel.classList.add('lesson-panel');
    var caps = captionsOf(f), balloons = balloonsOf(f);
    panel.setAttribute('aria-label', caps.length ? plain(caps.join(' ')) : (balloons.length ? 'A comic panel' : 'A comic panel'));

    // counts: resume a lesson in progress straight away (this chapter's, at this frame; one that
    // waited in the chapter's place while a Hollow round had the slot comes back here too)
    if (kind === 'counts' && E.lessonAt(cat, story, id)) {
      persist();
      return startChapterLesson(f, id, true);
    }

    // on a frame that asks something, the captions are the question: they stay in the text column,
    // right above the answers, so the prompt is always read before the options
    var ctx = { panel: panel, frame: f, heads: heads, caps: caps, balloons: balloons, keepCaptions: kind === 'choice' || kind === 'input' || kind === 'look' || kind === 'end' };
    // the page a skip-count turns to shows the number the count reached, big, over the picture
    var into = E.skipInto(story, id, cat);
    if (into) { var sv = E.skipView(into, 0); ctx.bigNum = String(sv.groups * sv.table); }
    // a skip-count that keeps its totals (`keep`): its counting picture, every group lit and the
    // running totals under them, stays up on the pages after it, to the lesson that follows
    if (kept) { ctx.keepCaptions = true; ctx.forceStack = true; }
    // When everything fits in the panel, the panel gets the whole page (landscape especially):
    // try that first, and fall back to the two-column spread when text has to sit beside it.
    var frameEl = scr.querySelector('.frame');
    var soloOk = kind === 'next' || kind === 'counts';
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
    (heads.keep || []).forEach(function (k) {
      faceList.push({ x: (k.x + k.w / 2) * W / 100, y: (k.y + k.h / 2) * H / 100, r: Math.max(k.w * W, k.h * H) / 200 + 4, who: '', rr: 0 });
    });
    var placed = [];
    var svgParts = { under: [], back: [], over: [], front: [] };
    var layout = { W: W, H: H, captions: 'column', balloons: 'none', sfx: null };

    // 1. captions: overlay in the corners when they are few and short
    var caps = ctx.caps || [];
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
        caps.forEach(function (c) { reading.push({ text: c }); });
      } else {
        capEls.forEach(function (el) { el.remove(); });
      }
    }
    if (layout.captions === 'column') {
      colTop.innerHTML = caps.map(function (c) {
        if (ctx.frame.end && /^(the )?end of chapter/i.test(c)) return '<p class="endcap">' + rich(c) + '</p>';
        return '<p class="caption">' + rich(c) + '</p>';
      }).join('');
      caps.forEach(function (c) { reading.push({ text: c }); });
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
      var spot = findSpot({ W: W, H: H, w: bw, h: bhR, faces: faceList, bodies: bodies, placed: placed, head: hd, near: link ? link.box : null, after: prevSpot ? prevSpot.box : null, afterCap: capFirst, prev: prevSpot ? prevSpot.box : null, index: bi, margin: 8 });
      if (!spot && capFirst) spot = findSpot({ W: W, H: H, w: bw, h: bhR, faces: faceList, bodies: bodies, placed: placed, head: hd, index: bi, margin: 8 });
      if (!spot && prevSpot && !link) {
        // a crowded panel: anywhere free will do, as long as it still reads after the balloon before
        // it (at or below it, or to its right); otherwise the balloons stack under the panel, in order
        var fb = findSpot({ W: W, H: H, w: bw, h: bhR, faces: faceList, bodies: bodies, placed: placed, head: hd, prev: prevSpot.box, index: bi, margin: 8 });
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
    var pl = sfxPlace(text, W, H, faces, placed), best = pl.box, size = pl.size, estW = best.w, estH = best.h;
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
        return '<button class="choice" type="button" data-i="' + o.index + '" data-n="' + (n + 1) + '"' + (o.index === picked ? ' aria-current="true"' : '') + '>' + rich(fill(o.option.label)) + '</button>';
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
      opts.forEach(function (o) { ctx.reading.push({ text: fill(o.option.label) }); });
      return;
    }
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
   * VoiceOver. */
  function renderSkip(f, id) {
    var sk = f.skip, taps = 0, turning = false;
    var scr = $('screen');
    scr.innerHTML = frameShell('skip', id);
    var panel = $('panel'), art = panel.querySelector('.art'), ov = panel.querySelector('.ov');
    panel.classList.add('lesson-panel', 'tappable');
    var caps = captionsOf(f), intro = balloonsOf(f);
    // `paws: 'own'` (the bedtime hop): her own two forepaws, the glow taking turns; the number is
    // in her own murmur unless the frame names a teacher
    var own = sk.paws === 'own';
    var teacher = sk.teacher || (own ? 'player' : (intro[0] && intro[0].who) || 'tallyheart');
    var DEF_THINGS = { 2: ['ear', 'ears'], 5: ['claw', 'claws'] }[sk.table] || ['thing', 'things'];
    var thing = sk.thing || DEF_THINGS[0], things = sk.things || DEF_THINGS[1];
    var v0 = E.skipView(sk, 0);
    panel.setAttribute('aria-label', own ? 'Your two forepaws on the moss. Touch the glowing one.'
      : 'Counting picture: ' + numWord(v0.groups) + ' groups of ' + numWord(v0.table) + '. Touch the glowing one.');
    $('colTop').innerHTML = caps.map(function (c) { return '<p class="caption">' + rich(c) + '</p>'; }).join('');
    function draw(fresh) {
      var v = E.skipView(sk, taps);
      var po = { table: v.table, groups: v.groups, per: v.per, highlight: v.highlight, totals: true, next: !v.done, who: sk.who, thing: thing, things: things, look: cat && cat.look };
      // her own paws: each tap lights that paw's five claws again (v.lit), the other one glows next (v.nextPaw)
      if (own) { po.paws = 'own'; po.taps = v.taps; po.lit = v.lit; po.nextPaw = v.nextPaw; po.totals = false; }
      art.innerHTML = artCall('countsPicture', po) || countsFallback(v.groups, v.per, v.highlight);
      hopGroup();
      ov.innerHTML = v.total ? '<div class="skipnum' + (fresh && !reduceMotion ? ' pop' : '') + '" aria-hidden="true">' + v.total + '</div>' : '';
      var lines = intro.slice();
      if (v.taps) lines.push(own ? { who: teacher, kind: 'whisper', html: '<span class="counter">' + esc(v.count) + '</span>' }
        : { who: teacher, html: '<span class="counter">' + esc(v.count) + '</span>' });
      if (v.done && sk.done) lines.push({ who: teacher, text: fill(sk.done) });
      $('stack').innerHTML = lines.map(function (b) { return stackBalloon(b); }).join('');
      // the bottom row: Back (and Next, only after a done line); counting is done on the cats
      var showNext = v.done && !!sk.done;
      $('interact').innerHTML = '<div class="next-row">' + backBottom() +
        (showNext ? '<button class="btn go big" id="nextBtn" type="button">Next <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
          : (v.done ? '' : '<button class="sr" id="countBtn" type="button">' + esc(own ? 'Tap your next forepaw.' : 'Count the next ' + (sk.table === 2 ? 'cat' : sk.table === 5 ? 'paw' : 'one')) + '</button>')) + '</div>';
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
      var nx = art.querySelector('.pc-next');
      if (!nx || !nx.getBoundingClientRect) return true;   // a picture with nothing to aim at: any tap counts
      var r = nx.getBoundingClientRect(), pr = panel.getBoundingClientRect();
      if (!r.width) return true;
      var mx = r.width * 0.22;
      return e.clientX >= r.left - mx && e.clientX <= r.right + mx && e.clientY >= pr.top && e.clientY <= pr.bottom;
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
      speakItems([{ text: String(v.total), who: teacher }].concat(v.done && sk.done ? [{ text: fill(sk.done), who: teacher }] : []));
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
    keyHandler = function (e) {
      if (isTyping(e)) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (e.target && e.target.id === 'countBtn') return;   // the button counts on its own click
        e.preventDefault();
        if (E.skipView(sk, taps).done) { if (sk.done) advance(); } else tap();
      } else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
    };
    currentSpeech = caps.map(function (c) { return { text: c }; }).concat(intro.map(function (b) { return { text: b.text, who: b.who, variant: b.variant }; }));
    persist();
  }
  /* A page after a skip-count that keeps its totals: the count's picture, every group lit, the
   * running totals (5, 10, 15, 20, 25) under the groups. No faces to point balloons at. */
  function drawKept(panel, sk) {
    var v = E.skipView(sk, sk.groups);
    var DEF_THINGS = { 2: ['ear', 'ears'], 5: ['claw', 'claws'] }[v.table] || ['thing', 'things'];
    var po = { table: v.table, groups: v.groups, per: v.per, highlight: v.highlight, totals: true, next: false, who: sk.who,
      thing: sk.thing || DEF_THINGS[0], things: sk.things || DEF_THINGS[1], look: cat && cat.look };
    if (sk.paws === 'own') { po.paws = 'own'; po.taps = v.taps; po.lit = v.lit; po.nextPaw = null; po.totals = false; }
    panel.querySelector('.art').innerHTML = artCall('countsPicture', po) || countsFallback(v.groups, v.per, v.highlight);
    var hs = [];
    hs.keep = [];
    return hs;
  }
  function isTyping(e) {
    var t = e.target; if (!t) return false;
    var tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || t.isContentEditable || e.metaKey || e.ctrlKey || e.altKey;
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
    var intro = resume || E.keptSkip(story, id, cat) ? [] : balloonsOf(f);
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

    // a line of kind 'caption' is narration (8 × 2's "You touch your nose to each little stack…"):
    // a caption box, as the chapter's captions are lettered in the column; the rest are balloons
    function say(lines, extraClass) {
      stack.innerHTML = lines.map(function (l) {
        if (l.kind === 'caption') return '<p class="caption">' + rich(l.text) + '</p>';
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
      var L = look(over);
      var svg = artCall('countsPicture', { table: q.table || L.per, groups: L.groups, per: L.per, highlight: highlight || 0, kind: L.kind, layout: L.layout, thought: L.thought, who: L.who || undefined, thing: thing, things: things, look: cat && cat.look });
      art.innerHTML = svg || countsFallback(L.groups, L.per, highlight || 0);
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
      picture(q.lit || 0);
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
      if (q.light) lightUp(asked);
      speakItems(lines.map(function (l) { return { text: l.text, who: l.who, variant: l.variant }; }).concat([{ text: E.counts.ask(def, q) }]),
        function () { restartClock(asked); });
    }
    function press(k) {
      if (locked || now() < padLockedUntil) return;
      if (k === 'del') typed = typed.slice(0, -1);
      else if (k === 'ok') return submit();
      else if (typed.length < 3) typed = (typed === '0' ? '' : typed) + k;
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
      var hp = res.help, total = plan.total, counted = 0, startedAt = now(), ticking = false;
      var step = plan.step, counter = plan.counter;
      pad.classList.add('away');
      var intro = fill(plan.intro);
      say([{ who: teacher, text: intro }]);
      speakItems([{ text: intro, who: teacher }]);
      // the scratches match the picture: a picture in rows is scratched in rows (lit a column at a
      // time, top and bottom together)
      var sand = function () {
        var o = { groups: hp.groups, per: hp.per, counted: counted, layout: plan.layout || undefined, ground: plan.ground === 'sand' ? undefined : plan.ground };
        if (plan.style) o.style = plan.style;
        art.innerHTML = artCall('sand', o) || sandFallback(hp.groups, hp.per, counted);
      };
      var nums = [];
      sand();
      var finishHelp = function () {
        panel.removeEventListener('click', tapCount);
        counted = total; sand();
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
        if (counted >= total) return;
        counted = Math.min(total, counted + step);
        nums.push(counted);
        sand();
        var lastSb = stack.lastElementChild && stack.lastElementChild.querySelector('.sb');
        if (lastSb) lastSb.innerHTML = '<span class="who">' + esc(speakerName({ who: counter })) + '</span><span class="counter">' + nums.join(' · ') + '</span>';
        if (save.settings.readAloud) speakItems([{ text: String(counted), who: counter }]);
        if (counted >= total) later(finishHelp, 700);
        else later(tick, (reduceMotion ? 700 : 620) * (step > 1 ? 1.25 : 1));
      };
      var tapCount = function () {
        if (!ticking || counted >= total || now() - startedAt < 350) return;
        clearTimers(); tick();
      };
      panel.addEventListener('click', tapCount);
      later(function () {
        say([{ who: teacher, text: intro }, { who: counter, text: '…' }]);
        ticking = true;
        tick();
      }, 900);
    }
    function finish() {
      keyHandler = null;
      var sum = E.counts.summary(st);
      // recorded at the last answer; this only catches a lesson that somehow was not
      if (!o.recorded && cat.lesson && cat.lesson.state === st) { o.recorded = E.recordLesson(cat, st); persist(); }
      o.onDone(sum, o.recorded);
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
      return '<div class="dragonet"><div class="dn-pic" aria-hidden="true">' + dragonetArt(d.id, false, 0) + '</div>' +
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
   * a silhouette, every other one facing the other way. */
  function dragonetArt(id, silhouette, i) {
    try {
      if (PC.art && typeof PC.art.character === 'function' && PC.art.vocab && PC.art.vocab.cast && PC.art.vocab.cast.indexOf(id) >= 0) {
        var out = wrapChar(PC.art.character(id, { pose: 'sit', mood: silhouette ? 'neutral' : 'happy', facing: i % 2 ? 'left' : 'right' }), false);
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
    var learned = E.learnedCounts(cat, stories());
    var defs = learned.map(function (c) { return { table: c.table, def: E.hollowDef(stories(), c.table), glow: E.hollowTable(cat, c.table).glow }; });
    var scr = $('screen');
    scr.innerHTML = frameShell('hollow', 'hollow');
    var panel = $('panel');
    var one = defs.length === 1 ? defs[0] : null;
    var f = {
      scene: hollowScene('wide', [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'sunpatch', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'sand-left', facing: 'right' }], ['sunset']),
      caption: ['The Training Hollow. The old tree leans over the sand like it’s listening.'],
      say: [{ who: 'tallyheart', text: opts && opts.reward ? 'Another round? I’ve got all evening.'
        : one ? 'Back for more ' + (one.def.things || 'tails') + '? A full round earns a treasure for your nest.'
          : defs.length ? 'Which Count today? A full round earns a treasure for your nest.' : 'Finish a Count in your story first. Then come back and practise it.' }]
    };
    var glowing = defs.filter(function (d) { return d.glow; });
    if (one && one.glow) f.say.push({ who: 'tallyheart', text: 'Look at your claw mark. It glows now. You know your ' + (one.def.things || 'tails') + '.' });
    else if (glowing.length) f.say.push({ who: 'tallyheart', text: 'Look at your claw marks. Your ' + andList(glowing.map(function (d) { return d.def.things; })) + ' ' + (glowing.length === 1 ? 'mark glows' : 'marks glow') + ' now.' });
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
        return '<button class="btn go big" type="button" data-t="' + d.table + '">' + (d.glow ? '<i class="glowdot" role="img" aria-label="glowing"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.7 7.8 7.8 2.7-7.8 2.7L12 22.5l-2.7-7.8L1.5 12l7.8-2.7z"/></svg></i>' : '') + esc(E.countName(d.def, d.table)) + '</button>';
      }).join('') + '</div><div class="row end"><button class="btn" type="button" id="nestBtn">My nest</button></div>';
    }
    $('nestBtn').addEventListener('click', function () { go('nest', { from: 'hollow' }); });
    Array.prototype.forEach.call($('interact').querySelectorAll('[data-t]'), function (b) {
      b.addEventListener('click', function () { start(+b.getAttribute('data-t')); });
    });
    currentSpeech = (ctx.reading || []).concat(one ? [] : defs.map(function (d) { return { text: E.countName(d.def, d.table).replace(' · ', ', ') }; }));
  }
  function hollowLesson(def, st, resume) {
    runLesson({
      def: def, state: st, mode: 'hollow',
      intro: resume ? [] : [{ who: 'tallyheart', text: 'A round of ' + (def.things || 'tails') + '. Ready? Here we go.' }],
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
    var glowNote = many ? 'Look! Your ' + (def.things || 'tails') + ' claw mark on the tree is glowing.' : 'Look! Your claw mark on the tree is glowing.';
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
      '<div class="links">' + (E.learnedCounts(cat, stories()).length ? '<button class="btn go" type="button" data-go="hollow">The Training Hollow</button>' : '') + '<button class="btn" type="button" data-go="hub">Camp</button></div>' +
      '</section>';
    var panel = $('panel');
    var f = { scene: { set: 'den', cam: 'nest', cast: [{ who: 'player', pose: 'curl', mood: 'happy', at: 'nest' }], fx: ['night'] } };
    drawArt(panel, f, cat.look);
    panel.setAttribute('aria-label', 'Your nest in the apprentices’ den');
    Array.prototype.forEach.call(doc.querySelectorAll('[data-go]'), function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-go'), { from: 'nest' }); }); });
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
      var flags = Object.keys(c.flags || {}).filter(function (k) { return k !== 'looked'; }).map(function (k) {
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
    moon: '<svg viewBox="0 0 48 48"><path d="M30 6a18 18 0 1 0 12 30A15 15 0 0 1 30 6z" fill="#ffe8a3" stroke="#1b1622" stroke-width="3" stroke-linejoin="round"/></svg>'
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
