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
   * close above its speaker's head, in reading order after the previous box. Returns {x,y} or
   * null when nothing fits (the caller then stacks the balloons under the panel). */
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
        if (cost < bestCost) { bestCost = cost; best = { x: x, y: y, cost: cost }; }
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
  UI.layout = { findSpot: findSpot, tailGeom: tailGeom, rectCircle: rectCircle, overlap: overlap, segHitsRect: segHitsRect };

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
  var NAMES = {
    tallyheart: 'Tallyheart', glintstar: 'Glintstar', waffles: 'Princess Waffles', tallone: 'The Tall One',
    grizzled: 'Grizzled old tom', snorer: 'Snoring apprentice', mutterer: 'Muttering apprentice', snorter: 'Snorting apprentice',
    clancat: 'A Clan cat', sparrow: 'Sparrow', moth: 'Moth'
  };
  var PITCH = { waffles: 1.45, tallyheart: 0.92, glintstar: 0.85, grizzled: 0.6, player: 1.2, snorer: 1.1, mutterer: 1.3, snorter: 1.15, clancat: 1.0, tallone: 1.0 };
  function speakerName(s) {
    if (s.name) return fill(s.name);
    if (s.who === 'player') return cat && cat.name ? cat.name + 'paw' : 'You';
    var ch = PC.art && (PC.art.characters || PC.art.cast);
    if (ch && ch[s.who] && ch[s.who].name) return ch[s.who].name;
    return NAMES[s.who] || cap1(String(s.who || ''));
  }
  function balloonsOf(frame) {
    var cast = (frame.scene && frame.scene.cast) || [], nth = {};
    return asList(frame.say).map(function (s) {
      if (typeof s === 'string') s = { text: s };
      // the speaker's cast entry (the nth balloon from a who is the nth of them in the cast), for its coat
      var mine = cast.filter(function (c) { return c && c.who === s.who; }), k = nth[s.who] = (nth[s.who] == null ? 0 : nth[s.who] + 1);
      var member = mine[k] || mine[0];
      return { who: s.who || '', text: fill(s.text || ''), kind: s.kind || 'say', name: s.name, variant: member && member.variant, raw: s };
    }).filter(function (b) { return b.text; });
  }
  function captionsOf(frame) { return asList(frame.caption).map(fill).filter(Boolean); }

  /* Heads from PC.art.render: an array in cast order (null = out of shot), each {x, y} in percent
   * of the panel, optionally with r (face radius, percent of panel width). An object keyed by who
   * is accepted too. Without r, the face size is estimated from the character's scale in the svg
   * (cats are drawn in a 200 × 200 box, placed with "translate(x y) scale(s) translate(-100 -200)"),
   * else a default. Returns [{ who, h: {x, y, r} | null }] in cast order. */
  function parseCats(svg) {
    var out = { box: null, cats: [] };
    if (typeof svg !== 'string') return out;
    var vb = /viewBox="\s*(-?[\d.]+)[ ,]+(-?[\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)\s*"/.exec(svg);
    if (vb) out.box = { x: +vb[1], y: +vb[2], w: +vb[3], h: +vb[4] };
    var re = /translate\((-?[\d.]+)[ ,]+(-?[\d.]+)\)\s*scale\((-?[\d.]+)(?:[ ,]+(-?[\d.]+))?\)\s*translate\(-100[ ,]+-200\)/g, m;
    while ((m = re.exec(svg))) out.cats.push({ x: +m[1], y: +m[2], s: Math.abs(+(m[4] || m[3])) });
    return out;
  }
  function castHeads(heads, cast, svg) {
    var out = [];
    if (Array.isArray(heads)) {
      var est = null;
      (cast || []).forEach(function (c, i) {
        var h = heads[i];
        if (!h || typeof h.x !== 'number') { out.push({ who: c && c.who, h: null }); return; }
        var r = typeof h.r === 'number' ? h.r : null;
        if (r == null) {
          if (c.who === 'sparrow' || c.who === 'moth') r = 2.5;
          else if (c.who === 'tallone') r = 2;
          else {
            est = est || parseCats(svg);
            if (est.box && est.cats.length) {
              var hx = est.box.x + h.x / 100 * est.box.w, hy = est.box.y + h.y / 100 * est.box.h, best = null, bd = Infinity;
              est.cats.forEach(function (k) {
                var d = Math.abs(hx - k.x) + Math.abs(hy - (k.y - 110 * k.s));
                if (d < bd) { bd = d; best = k; }
              });
              if (best && bd < 240 * best.s) r = clamp(40 * best.s / est.box.w * 100, 1.8, 16);
            }
          }
        }
        out.push({ who: c && c.who, h: { x: h.x, y: h.y, r: r == null ? 6.5 : r } });
      });
    } else if (heads && typeof heads === 'object') {
      Object.keys(heads).forEach(function (k) {
        var h = heads[k];
        if (h && typeof h.x === 'number') out.push({ who: k.replace(/[-]?\d+$/, ''), h: { x: h.x, y: h.y, r: typeof h.r === 'number' ? h.r : 6.5 } });
      });
    }
    return out;
  }
  function headFor(list, who, nth) {
    var k = 0;
    for (var i = 0; i < list.length; i++) if (list[i].who === who) { if (k === (nth || 0)) return list[i].h; k++; }
    // fewer cast members than balloons from this speaker: use the first one
    for (i = 0; i < list.length; i++) if (list[i].who === who) return list[i].h;
    return null;
  }

  /* ================================================================ boot */
  function boot() {
    E = PC.engine;
    story = PC.story && PC.story.ch01;
    if (PC.art && typeof PC.art.css === 'string' && !$('pc-art-css')) {
      var st = doc.createElement('style'); st.id = 'pc-art-css'; st.textContent = PC.art.css; doc.head.appendChild(st);
    }
    store = E ? E.createStore() : null;
    save = store ? store.load() : null;
    if (!E || !story) { $('screen').innerHTML = '<div class="err"><p class="h2">The story didn’t load.</p><p>Check the connection and reload the page.</p><p><button class="btn go" onclick="location.reload()">Reload</button></p></div>'; return; }
    cat = E.currentCat(save);
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
    doc.addEventListener('keydown', function (e) { if (keyHandler) keyHandler(e); });
    if ('speechSynthesis' in root) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () { voice = null; }; } catch (e) {} }
    PC.debug = {
      goto: function (id) {
        if (!story.frames[id]) return 'no frame ' + id;
        if (!cat) { cat = E.addCat(save, { now: now() }) || save.cats[0]; save.current = cat.id; E.startChapter(cat, story, now()); }
        E.go(cat, story, id, now()); persist(); go('frame'); return id;
      },
      state: function () { return E.util.clone(save); },
      cat: function () { return cat; },
      reset: function () { if (store) store.clear(); save = E.newSave(); cat = null; go('title'); return 'reset'; },
      check: function () { return E.checkStory(story); },
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
      if (now() - renderedAt < 350) { e.stopPropagation(); e.preventDefault(); }
    }, true);
    $('backBtn').addEventListener('click', onBack);
    $('catsBtn').addEventListener('click', function () { go('who'); });
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
    if (!opts.keepScroll) root.scrollTo(0, 0);
    if (save.settings.readAloud) speakItems(currentSpeech);
  }
  function updateBar() {
    var n = view.name, back = $('backBtn'), title = $('barTitle');
    var showBack = n !== 'title' && !(n === 'frame' && !E.canBack(cat));
    back.classList.toggle('invisible', !showBack);
    back.disabled = !showBack;
    $('catsBtn').hidden = n === 'title' || n === 'who';   // no room taken, so the bar title fits on a phone
    var t = '';
    if (n === 'title') t = '';
    else if (n === 'who') t = 'Potomac Crossing';
    else if (cat) t = esc(E.displayName(cat)) + (n === 'frame' ? '<small>Chapter ' + (story.number || 1) + ' · ' + esc(story.title) + '</small>' : '');
    title.innerHTML = t;
  }
  function onBack() {
    var n = view.name;
    if (n === 'who') return go('title', { back: true });
    if (n === 'frame') {
      if (E.back(cat, story)) { persist(); return go('frame', { back: true }); }
      return go('who', { back: true });
    }
    if (n === 'book') return view.opts.from === 'end' ? go('frame', { back: true }) : go('hub', { back: true });
    if (n === 'hollow' || n === 'nest') return go(view.opts.from === 'book' ? 'book' : 'hub', { back: true });
    if (n === 'hub') return go('who', { back: true });
    go('title', { back: true });
  }
  function openCat(c) {
    cat = c; save.current = c.id; lookCache = null;
    if (!c.chapter || !c.frame) E.startChapter(c, story, now());
    persist();
    if (c.done && E.kindOf(E.currentFrame(c, story)) === 'end') return go('hub');
    go('frame');
  }

  /* ================================================================ title */
  function renderTitle() {
    // the cat on the wall is the last cat played, or a silhouette for a brand-new device
    var look = cat && cat.look;
    var r = artRender({ set: 'title', cam: 'wide', cast: look ? [{ who: 'player', pose: 'sit', mood: 'dreamy', at: 'wall', facing: 'left' }] : [], fx: ['dusk'] }, look || E.defaultLook(0));
    $('screen').innerHTML =
      '<section class="title-screen">' +
      '<figure class="panel" aria-label="A cat sits on a wall by the river at dusk. Glass towers glow behind.">' +
      '<div class="art" aria-hidden="true">' + r.svg + '</div>' +
      '<h1 class="logo">Potomac Crossing<small>Chapter 1 · Through the Glass</small></h1>' +
      '</figure>' +
      '<p class="tagline">A pillow cat. A hidden Clan. A storm on the river.</p>' +
      '<div class="title-cta">' +
      (cat ? '<button class="btn go big" id="resumeBtn" type="button">' + (cat.done && E.kindOf(E.currentFrame(cat, story)) === 'end' ? 'Back to camp, ' : 'Keep reading, ') + esc(E.displayName(cat)) + '</button>' +
        '<button class="btn quiet" id="playBtn" type="button">Who’s playing?</button>'
        : '<button class="btn go big" id="playBtn" type="button">Play</button>') +
      '</div></section>';
    $('playBtn').addEventListener('click', function () { go('who'); });
    if ($('resumeBtn')) $('resumeBtn').addEventListener('click', function () { openCat(cat); });
    currentSpeech = [{ text: 'Potomac Crossing. Chapter 1: Through the Glass.' }];
    keyHandler = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (cat) openCat(cat); else go('who'); } };
  }

  /* ================================================================ who's playing */
  function renderWho() {
    var cards = save.cats.map(function (c, i) {
      var status = c.done ? 'Chapter 1 finished' : (c.history && c.history.length ? 'Chapter 1 · page ' + (c.history.length + 1) : 'Just starting');
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
      E.startChapter(c, story, now());
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
    var hs = castHeads(r.heads, (frame.scene && frame.scene.cast) || [], r.svg);
    hs.keep = r.keep || [];   // areas the art asks the lettering to keep off (percent of the panel)
    return hs;
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
    var id = E.frameId(cat, story);
    cat.frame = id;
    var f = story.frames[id];
    var kind = E.kindOf(f);
    var scr = $('screen');
    scr.innerHTML = frameShell(kind, id);
    var panel = $('panel');
    var heads = drawArt(panel, f, cat.look);
    var caps = captionsOf(f), balloons = balloonsOf(f);
    panel.setAttribute('aria-label', caps.length ? plain(caps.join(' ')) : (balloons.length ? 'A comic panel' : 'A comic panel'));

    // counts: resume a lesson in progress straight away
    if (kind === 'counts' && cat.lesson && cat.lesson.frame === id && cat.lesson.state && !E.counts.done(cat.lesson.state)) {
      return startChapterLesson(f, id, true);
    }

    // on a frame that asks something, the captions are the question: they stay in the text column,
    // right above the answers, so the prompt is always read before the options
    var ctx = { panel: panel, frame: f, heads: heads, caps: caps, balloons: balloons, keepCaptions: kind === 'choice' || kind === 'input' || kind === 'look' || kind === 'end' };
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
    var nth = {};
    var spots = [];
    var allFit = bs.length > 0;
    var padX = fs * 0.95, padY = fs * 0.62;
    for (var bi = 0; bi < bs.length && allFit; bi++) {
      var b = bs[bi];
      var n = nth[b.who] = (nth[b.who] == null ? 0 : nth[b.who] + 1);
      var head = headFor(heads, b.who, n);
      var hd = head ? { x: head.x * W / 100, y: head.y * H / 100, r: head.r * W / 100 } : null;
      if (hd && (hd.x < 0 || hd.x > W || hd.y < 0 || hd.y > H)) hd = null;
      var t = doc.createElement('div');
      t.className = 'btext ' + b.kind;
      var prevB = bi > 0 ? bs[bi - 1] : null;
      // a voice from outside the panel gets a name tag, unless it continues the balloon before
      t.innerHTML = (!hd && !(prevB && prevB.who === b.who) ? '<span class="tagin">' + esc(speakerName(b)) + '</span>' : '') + rich(b.text);
      var len = b.text.length;
      var maxW = Math.min(W * 0.5, Math.max(fs * 6, Math.sqrt(len) * fs * 2.3));
      t.style.maxWidth = Math.round(maxW) + 'px';
      t.style.visibility = 'hidden';
      ov.appendChild(t);
      var tw = Math.ceil(t.offsetWidth) + 1, th = Math.ceil(t.offsetHeight);
      var ex = b.kind === 'shout' ? 12 : (b.kind === 'think' ? 10 : 0);
      var bw = tw + padX * 2 + ex * 2, bh = th + padY * 2 + ex * 2;
      var prevSpot = spots.length ? spots[spots.length - 1] : null;
      var link = prevSpot && prevSpot.b.who === b.who && b.who ? prevSpot : null;
      // reading order: each balloon goes below the one before it, or to its right; only when that is
      // impossible (a crowded panel) is it allowed elsewhere, and then only for a different speaker
      var capFirst = bi === 0 && layout.captions === 'panel' && placed.length ? capBox : null;
      var spot = findSpot({ W: W, H: H, w: bw, h: bh, faces: faceList, bodies: bodies, placed: placed, head: hd, near: link ? link.box : null, after: prevSpot ? prevSpot.box : null, afterCap: capFirst, prev: prevSpot ? prevSpot.box : null, index: bi, margin: 8 });
      if (!spot && capFirst) spot = findSpot({ W: W, H: H, w: bw, h: bh, faces: faceList, bodies: bodies, placed: placed, head: hd, index: bi, margin: 8 });
      if (!spot && prevSpot && !link) {
        // a crowded panel: anywhere free will do, as long as it still reads after the balloon before
        // it (at or below it, or to its right); otherwise the balloons stack under the panel, in order
        var fb = findSpot({ W: W, H: H, w: bw, h: bh, faces: faceList, bodies: bodies, placed: placed, head: hd, prev: prevSpot.box, index: bi, margin: 8 });
        var pb0 = prevSpot.box;
        if (fb && (fb.y >= pb0.y - 4 || fb.x >= pb0.x + pb0.w - 4)) spot = fb;
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
        var gapY = 14, pb = link.box, others = placed.filter(function (p) { return p !== pb; });
        var blk = findSpot({ W: W, H: H, w: Math.max(pb.w, bw), h: pb.h + gapY + bh, faces: faceList, bodies: bodies, placed: others, head: link.hd, near: link.link ? link.link.box : null, after: link.link ? link.link.box : null, prev: spots.length > 1 ? spots[spots.length - 2].box : null, index: bi - 1, margin: 8 });
        if (blk) {
          var bwid = Math.max(pb.w, bw);
          var nb = { x: blk.x + (bwid - pb.w) / 2, y: blk.y, w: pb.w, h: pb.h };
          placed[placed.indexOf(pb)] = nb; link.box = nb;
          box = { x: blk.x + (bwid - bw) / 2, y: blk.y + pb.h + gapY, w: bw, h: bh };
        } else {
          spot = findSpot({ W: W, H: H, w: bw, h: bh, faces: faceList, bodies: bodies, placed: placed, head: hd, near: link.box, after: link.box, prev: link.box, index: bi, margin: 8 });
          if (spot) box = { x: spot.x, y: spot.y, w: bw, h: bh };
        }
      } else if (spot) box = { x: spot.x, y: spot.y, w: bw, h: bh };
      if (!box) { allFit = false; t.remove(); break; }
      placed.push(box);
      spots.push({ b: b, el: t, box: box, hd: hd, tw: tw, ex: ex, link: link });
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
        drawBalloon(svgParts, s, W, H);
        reading.push({ text: s.b.text, who: s.b.who });
      });
    } else if (bs.length) {
      spots.forEach(function (s) { s.el.remove(); });
      placed = placed.slice(0, placed.length - spots.length);
      layout.balloons = 'stack';
      stack.innerHTML = bs.map(function (b) { return stackBalloon(b); }).join('');
      bs.forEach(function (b) { reading.push({ text: b.text, who: b.who }); });
    }

    // 3. sound effect: big, tilted, somewhere it doesn't cover a face
    var sfx = ctx.frame.sfx ? fill(ctx.frame.sfx) : '';
    if (sfx) layout.sfx = drawSfx(svgParts, sfx, W, H, faceList, placed, ctx.frame);

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
    var face = speakerFace(b.who, b.variant);
    return '<div class="sbrow' + (right ? ' right' : '') + '">' + (face ? '<span class="sface" aria-hidden="true">' + face + '</span>' : '') +
      '<div class="sb ' + esc(b.kind || '') + (right ? ' right' : '') + ' ' + (extraClass || '') + '"><span class="who">' + esc(speakerName(b)) + '</span>' + (b.html != null ? b.html : rich(b.text)) + '</div></div>';
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
    var size = clamp(W * 0.085, 30, 92) * (text.length > 9 ? 0.82 : 1) * (quiet ? 0.6 : 1);
    var estW = text.length * size * 0.5 + size * 0.4, estH = size * 1.05;
    var hash = 0; for (var i = 0; i < (frame && frame.sfx || '').length; i++) hash = (hash * 31 + frame.sfx.charCodeAt(i)) | 0;
    var rot = ((hash & 1) ? 7 : -8) * (quiet ? 0.5 : 1);
    var spots = [
      [W - estW - W * 0.04, H * 0.06], [W * 0.04, H * 0.06], [W - estW - W * 0.04, H - estH - H * 0.08],
      [W * 0.04, H - estH - H * 0.08], [(W - estW) / 2, H * 0.08], [(W - estW) / 2, H - estH - H * 0.1],
      // when captions fill the top corners and faces the bottom: halfway down a side, or the middle
      [W * 0.04, (H - estH) * 0.45], [W - estW - W * 0.04, (H - estH) * 0.45], [(W - estW) / 2, (H - estH) * 0.45]
    ];
    var best = null, bestScore = Infinity;
    spots.forEach(function (p, k) {
      var r = { x: p[0], y: p[1], w: estW, h: estH }, score = k * 2;
      faces.forEach(function (c) { if (rectCircle(r, c)) score += 1000; });
      // captions and balloons sit on top of the lettering, so any overlap hides it: worse than a face
      placed.forEach(function (b) { var a = overlapArea(r, b); if (a > 0) score += 1500 + a / 50; });
      if (score < bestScore) { bestScore = score; best = r; }
    });
    var cx = best.x + estW / 2, cy = best.y + estH * 0.82;
    var sw = quiet ? Math.max(3, size * 0.14) : Math.max(4, size * 0.12);
    var t = '<text x="' + f1(cx) + '" y="' + f1(cy) + '" text-anchor="middle" font-size="' + f1(size) + '"' + (quiet ? ' letter-spacing="1"' : '');
    parts.front.push('<g class="sfx' + (reduceMotion ? '' : ' pop') + '"><g transform="rotate(' + rot + ' ' + f1(cx) + ' ' + f1(cy - size * 0.35) + ')">' +
      (quiet ? '' : t + ' fill="#1b1622" stroke="#1b1622" stroke-width="' + f1(sw) + '" transform="translate(' + f1(size * 0.06) + ' ' + f1(size * 0.07) + ')">' + esc(text) + '</text>') +
      t + ' fill="' + (quiet ? '#fff6dc' : 'url(#sfxg)') + '" stroke="#1b1622" stroke-width="' + f1(sw) + '">' + esc(text) + '</text></g></g>');
    return best;
  }

  /* ---------------------------------------------------------------- interactions */
  function renderInteraction(f, kind, id, ctx) {
    var box = $('interact'), panel = ctx.panel;
    var nextBtn = function (label, onClick, cls) {
      box.innerHTML = '<div class="next-row"><button class="btn go big ' + (cls || '') + '" id="nextBtn" type="button">' + esc(label) +
        ' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';
      $('nextBtn').addEventListener('click', onClick);
    };
    if (kind === 'next') {
      var adv = function () {
        if (now() - renderedAt < 280) return;
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
      nextBtn('See your book', function () { go('book', { from: 'end' }); });
      keyHandler = function (e) { if (!isTyping(e) && e.key === 'ArrowLeft') onBack(); };
      return;
    }
    if (kind === 'choice') {
      var opts = f.choice.options || [];
      var prompt = f.choice.prompt ? '<p class="prompt">' + rich(fill(f.choice.prompt)) + '</p>' : '';
      var picked = cat.choices[id] ? cat.choices[id].index : -1;
      box.innerHTML = prompt + '<div class="choices" role="group">' + opts.map(function (o, i) {
        return '<button class="choice" type="button" data-i="' + i + '" data-n="' + (i + 1) + '"' + (i === picked ? ' aria-current="true"' : '') + '>' + rich(fill(o.label)) + '</button>';
      }).join('') + '</div>';
      Array.prototype.forEach.call(box.querySelectorAll('.choice'), function (b) {
        b.addEventListener('click', function () {
          if (now() - renderedAt < 280) return;
          if (E.choose(cat, story, +b.getAttribute('data-i'), now())) { persist(); go('frame'); }
        });
      });
      keyHandler = function (e) {
        if (isTyping(e)) return;
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= opts.length) { var b = box.querySelector('[data-i="' + (n - 1) + '"]'); if (b) b.click(); }
        else if (e.key === 'ArrowLeft') onBack();
      };
      if (prompt) ctx.reading.push({ text: fill(f.choice.prompt) });
      opts.forEach(function (o) { ctx.reading.push({ text: fill(o.label) }); });
      return;
    }
    if (kind === 'input') return renderInput(f, id, box);
    if (kind === 'look') return renderLook(f, id, box, ctx);
    if (kind === 'counts') {
      var done = cat.lessons[f.counts.set];
      if (done) {
        box.innerHTML = '<div class="row end"><button class="btn quiet" id="againBtn" type="button">Count them again</button><button class="btn go big" id="nextBtn" type="button">Next</button></div>';
        $('nextBtn').addEventListener('click', function () { if (E.finishCounts(cat, story, done, now())) { persist(); go('frame'); } });
        $('againBtn').addEventListener('click', function () { startChapterLesson(f, id, false); });
      } else {
        nextBtn('Let’s count!', function () { startChapterLesson(f, id, false); });
      }
      keyHandler = function (e) { if (!isTyping(e) && e.key === 'ArrowLeft') onBack(); };
    }
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
        '<div class="row end"><button class="btn go big" id="okBtn" type="button" disabled>That’s me!</button></div>';
    } else if (kind === 'clanname') {
      html = '<p class="prompt">Type the first part of your Clan name.</p>' +
        '<input class="field" id="inp" type="text" maxlength="20" placeholder="Like Moon, or Fern…" autocomplete="off" autocorrect="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" aria-label="The first part of your Clan name">' +
        '<div class="preview" id="preview" aria-live="polite"></div>' +
        '<div class="row"><button class="btn quiet" id="ideasBtn" type="button" aria-expanded="false">Ideas?</button></div>' +
        '<div class="chips" id="ideas" hidden>' + sugg.map(function (s) { return '<button class="chip" type="button" aria-pressed="false" data-v="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>' +
        '<div class="row end"><button class="btn go big" id="okBtn" type="button" disabled>That’s my name!</button></div>';
    } else {
      html = '<textarea class="field" id="inp" maxlength="' + E.DREAM_MAX + '" placeholder="' + esc(inp.placeholder ? fill(inp.placeholder) : 'Otters… a giant fish… flying over the river…') + '" aria-label="Your dream" enterkeyhint="done"></textarea>' +
        '<p class="hint">You can skip this. It goes in your book.</p>' +
        '<div class="row end"><button class="btn quiet" id="skipBtn" type="button">Skip</button><button class="btn go big" id="okBtn" type="button" disabled>Put it in my book</button></div>';
    }
    box.innerHTML = '<div class="look">' + html + '</div>';
    var field = $('inp'), ok = $('okBtn'), preview = $('preview');
    var prev = kind === 'petname' ? cat.petname : kind === 'clanname' ? cat.name : kind === 'dream' ? cat.dream : '';
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
      if (e.key === 'Enter' && !e.shiftKey && !ok.disabled) { e.preventDefault(); submit(field.value); }
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
      }).join('') + '<div class="next-row"><button class="btn go big" id="okBtn" type="button">That’s me!</button></div></div>';
      Array.prototype.forEach.call(box.querySelectorAll('.sw'), function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-k'), v = b.getAttribute('data-v');
          var p = {}; p[k] = v; E.setLook(cat, p); persist();
          ctx.heads = drawArt(ctx.panel, f, cat.look);
          layoutText(ctx);
          var y = root.scrollY;
          draw();
          root.scrollTo(0, y);
          var again = box.querySelector('.sw[data-k="' + k + '"][data-v="' + v + '"]');
          if (again) again.focus({ preventScroll: true });
        });
      });
      $('okBtn').addEventListener('click', function () { if (E.confirmLook(cat, story, null, now())) { persist(); go('frame'); } });
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
    var setId = f.counts.set, def = Object.assign({ id: setId }, story.counts[setId]);
    var st;
    if (resume && cat.lesson && cat.lesson.state) st = cat.lesson.state;
    else {
      st = E.counts.start(def, { set: setId, mode: 'chapter', now: now() });
      cat.lesson = { mode: 'chapter', frame: id, state: st };
      persist();
    }
    var intro = resume ? [] : balloonsOf(f);
    runLesson({
      def: def, state: st, intro: intro, mode: 'chapter',
      onDone: function (sum) {
        // the scene again, with the teacher's last line in a balloon over it (the lesson was
        // recorded on the cat at its last answer, so a page closed now loses nothing)
        renderedAt = now();
        var scr = $('screen');
        scr.innerHTML = frameShell('counts', id);
        var panel = $('panel');
        var heads = drawArt(panel, f, cat.look);
        var line = fill(def.done || 'Good work.');
        var ctx = { panel: panel, frame: { scene: f.scene, sfx: '' }, heads: heads, caps: [], balloons: [{ who: def.teacher || 'tallyheart', text: line, kind: 'say' }] };
        relayoutFn = function () { layoutText(ctx); };
        layoutText(ctx);
        $('interact').innerHTML = '<div class="next-row"><button class="btn go big" id="nextBtn" type="button">Next</button></div>';
        $('nextBtn').addEventListener('click', function () { if (E.finishCounts(cat, story, sum, now())) { persist(); go('frame'); } });
        keyHandler = function (e) { if (!isTyping(e) && (e.key === 'Enter' || e.key === 'ArrowRight')) $('nextBtn').click(); };
        persist();
        speakItems([{ text: line, who: def.teacher || 'tallyheart' }]);
      }
    });
  }

  /* One lesson, used by the chapter and the Training Hollow alike. */
  function runLesson(o) {
    var def = o.def, st = o.state;
    var teacher = def.teacher || 'tallyheart';
    var things = def.things || 'tails', thing = def.thing || 'tail';
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

    function say(lines, extraClass) {
      stack.innerHTML = lines.map(function (l) {
        return stackBalloon({ who: l.who || teacher, text: l.text, html: l.html, kind: l.kind, name: l.name }, extraClass);
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
    function picture(highlight) {
      var svg = artCall('countsPicture', { table: q.per, groups: q.groups, highlight: highlight || 0, thing: thing, things: things });
      art.innerHTML = svg || countsFallback(q.groups, q.per, highlight || 0);
    }
    function prompt() {
      var tok = { a: q.a, b: q.b, groups: q.groups, per: q.per, thing: thing, things: things };
      if (q.retry) return 'Here’s that one again. ' + cap1(numWord(q.groups)) + ' ' + (q.groups === 1 ? 'cat' : 'cats') + '. How many ' + things + '?';
      // the chapter's first question is about the cats in the picture before it (story-7)
      if (def.firstPrompt && q.number === 1) return E.fill(def.firstPrompt, cat, tok);
      if (def.prompt) return E.fill(def.prompt, cat, tok);
      return cap1(numWord(q.groups)) + ' ' + (q.groups === 1 ? 'cat' : 'cats') + '. How many ' + things + '?';
    }
    function ask(byTap) {
      if (byTap) padLockedUntil = now() + 400;
      q = E.counts.question(st);
      if (!q) return finish();
      typed = ''; locked = false;
      pad.classList.remove('locked', 'away'); $('lessonNext').hidden = true;
      picture(0);
      var lines = [];
      if (first && o.intro && o.intro.length) lines = o.intro.slice();
      lines.push({ who: teacher, text: prompt() });
      first = false;
      say(lines);
      showQ('', '');
      t0 = performance.now();
      speakItems(lines.map(function (l) { return { text: l.text, who: l.who }; }).concat([{ text: E.counts.ask(def, q) }]));
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
      var res = E.counts.answer(st, def, typed, ms, now());
      E.logAnswer(cat, res.entry);
      // the last answer finishes the lesson: record it now, not after the praise pause
      if (res.done) o.recorded = E.recordLesson(cat, st);
      else if (o.mode === 'chapter') cat.lesson = { mode: 'chapter', frame: cat.frame, state: st };
      else cat.lesson = { mode: o.mode, state: st };
      persist();
      if (res.correct) {
        showQ(typed, 'right');
        picture(q.groups * q.per);
        var line = fill(res.line);
        say([{ who: teacher, text: line }]);
        speakItems([{ text: line, who: teacher }]);
        var wait = save.settings.readAloud ? 2600 : (res.fast ? 1300 : 1500);
        var skip = function () { panel.removeEventListener('click', skip); clearTimers(); ask(true); };
        panel.addEventListener('click', skip);
        later(function () { panel.removeEventListener('click', skip); ask(); }, wait);
      } else {
        showQ(typed, 'miss');
        later(function () { help(res); }, 650);
      }
    }
    function help(res) {
      var hp = res.help, total = hp.groups * hp.per, counted = 0, startedAt = now(), ticking = false;
      pad.classList.add('away');
      // "Close." only when she was close: 0 for 1 × 10 is not
      var near = res.entry.answer != null && Math.abs(res.entry.answer - res.right) <= 1;
      var helpIntro = def.helpIntro || 'Let’s scratch it out together.';
      var intro = fill(near ? helpIntro : (def.helpIntroFar || helpIntro.replace(/^Close\.\s*/, '')));
      say([{ who: teacher, text: intro }]);
      speakItems([{ text: intro, who: teacher }]);
      var sand = function () {
        art.innerHTML = artCall('sand', { groups: hp.groups, per: hp.per, counted: counted }) || sandFallback(hp.groups, hp.per, counted);
      };
      var nums = [];
      sand();
      var finishHelp = function () {
        panel.removeEventListener('click', tapCount);
        counted = total; sand();
        nums = []; for (var i = 1; i <= total; i++) nums.push(i);
        var line = fill(res.line);
        say([{ who: teacher, html: '<span class="counter">' + nums.join(' · ') + '</span>' }, { who: teacher, text: line }]);
        typed = String(hp.answer);
        showQ(typed, 'right');
        speakItems([{ text: hp.a + ' times ' + hp.b + ' is ' + hp.answer + '. ' + line, who: teacher }]);
        $('lessonNext').hidden = false;
        $('gotIt').focus({ preventScroll: true });
      };
      // The count is the teaching moment, so it always runs scratch by scratch (with Reduce Motion
      // too: the scratches light without animating). Tapping the picture counts along, one scratch
      // per tap; it never jumps to the answer.
      var tick = function () {
        if (counted >= total) return;
        counted++;
        nums.push(counted);
        sand();
        var lastSb = stack.lastElementChild && stack.lastElementChild.querySelector('.sb');
        if (lastSb) lastSb.innerHTML = '<span class="who">' + esc(speakerName({ who: teacher })) + '</span><span class="counter">' + nums.join(' · ') + '</span>';
        if (save.settings.readAloud) speakItems([{ text: String(counted), who: teacher }]);
        if (counted >= total) later(finishHelp, 700);
        else later(tick, reduceMotion ? 700 : 620);
      };
      var tapCount = function () {
        if (!ticking || counted >= total || now() - startedAt < 350) return;
        clearTimers(); tick();
      };
      panel.addEventListener('click', tapCount);
      later(function () {
        say([{ who: teacher, text: intro }, { who: teacher, text: '…' }]);
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

  /* ================================================================ hub (a finished chapter) */
  function renderHub() {
    if (!cat) return go('who');
    $('screen').innerHTML =
      '<section class="page center">' +
      '<div class="hero"><span class="face" aria-hidden="true">' + catPortrait(cat.look, 'proud') + '</span>' +
      '<div><h1 class="h1" style="text-align:left">' + esc(E.displayName(cat)) + '</h1><p class="note" style="text-align:left">Apprentice of CrystalClan · Chapter 1 finished</p></div></div>' +
      '<div class="hub">' +
      hubBtn('book', 'Read my book', ICON.book) +
      hubBtn('hollow', 'The Training Hollow', ICON.tree) +
      hubBtn('nest', 'My nest', ICON.nest) +
      hubBtn('again', 'Read chapter 1 again', ICON.again) +
      '<button class="btn quiet" type="button" disabled><i aria-hidden="true">' + ICON.moon + '</i>Chapter 2: After the Storm is coming soon</button>' +
      '</div></section>';
    Array.prototype.forEach.call(doc.querySelectorAll('[data-go]'), function (b) {
      b.addEventListener('click', function () {
        var w = b.getAttribute('data-go');
        if (w === 'again') { E.startChapter(cat, story, now()); persist(); return go('frame'); }
        go(w, { from: 'hub' });
      });
    });
    currentSpeech = [{ text: E.displayName(cat) + ', apprentice of CrystalClan.' }];
  }
  function hubBtn(w, label, icon) { return '<button class="btn" type="button" data-go="' + w + '"><i aria-hidden="true">' + icon + '</i>' + esc(label) + '</button>'; }

  /* ================================================================ the book page */
  function renderBook(opts) {
    if (!cat) return go('who');
    var b = E.buildBook(story, cat);
    $('screen').innerHTML =
      '<article class="book" aria-label="' + esc(b.title) + '">' +
      // a long Clan name ("Thunderwhiskerpaw’s") gets a smaller title, so the word never breaks
      '<h1' + (E.displayName(cat).length > 12 ? ' class="long"' : '') + '>' + esc(b.title) + '</h1><div class="chap">' + esc(b.chapter) + '</div>' +
      '<div class="portrait" aria-hidden="true">' + catPortrait(cat.look, 'happy') + '</div>' +
      b.recap.map(function (p) { return '<p>' + rich(p) + '</p>'; }).join('') +
      (b.dream ? '<p class="dream">' + rich(b.dream) + '</p>' : '') +
      '<div class="sig">' + esc(E.displayName(cat)) + ' of CrystalClan</div>' +
      '</article>' +
      '<div class="links no-print"><button class="btn" id="printBtn" type="button">Print my page</button></div>' +
      '<section class="coming" aria-label="Coming next">' +
      '<span class="soon">Coming soon</span>' +
      '<h2 class="h2">Chapter 2: After the Storm</h2>' +
      '<p>Tomorrow, Tallyheart has a new Count for you: <b>ears</b>. Somebody should count the prey pile, too. It looks a little bit smaller than yesterday…</p>' +
      '<p>And what made that enormous splash down by the river?</p>' +
      '</section>' +
      '<div class="links">' + hubBtn('hollow', 'The Training Hollow', ICON.tree) + hubBtn('nest', 'My nest', ICON.nest) + hubBtn('hub', 'Camp', ICON.moon) + '</div>';
    $('printBtn').addEventListener('click', function () { try { root.print(); } catch (e) {} });
    Array.prototype.forEach.call(doc.querySelectorAll('[data-go]'), function (bt) {
      bt.addEventListener('click', function () { var w = bt.getAttribute('data-go'); go(w, { from: 'book' }); });
    });
    currentSpeech = [{ text: b.title }].concat(b.recap.map(function (p) { return { text: p }; })).concat(b.dream ? [{ text: b.dream }] : []);
  }

  /* ================================================================ the Training Hollow */
  function renderHollow(opts) {
    if (!cat) return go('who');
    if (cat.lesson && cat.lesson.mode === 'hollow' && cat.lesson.state) {
      if (!E.counts.done(cat.lesson.state)) return hollowLesson(E.hollowDef(story, 1), cat.lesson.state, true);
      // a round whose last answer is in but which was never recorded: it counts, once
      var rec = E.settleLesson(cat);
      persist();
      if (rec && rec.hollow) return hollowReward(E.hollowDef(story, 1), rec.hollow);
    }
    var scr = $('screen');
    scr.innerHTML = frameShell('hollow', 'hollow');
    var panel = $('panel');
    var f = {
      scene: { set: 'hollow', cam: 'wide', opts: { marks: 1, glow: !!cat.hollow.glow }, cast: [{ who: 'tallyheart', pose: 'sit', mood: 'kind', at: 'sunpatch', facing: 'left' }, { who: 'player', pose: 'sit', mood: 'happy', at: 'sand-left', facing: 'right' }], fx: ['sunset'] },
      caption: ['The Training Hollow. The old tree leans over the sand like it’s listening.'],
      say: [{ who: 'tallyheart', text: opts && opts.reward ? 'Another round? I’ve got all evening.' : 'Back for more tails? A full round earns a treasure for your nest.' }]
    };
    if (cat.hollow.glow) f.say.push({ who: 'tallyheart', text: 'Look at your claw mark. It glows now. You know your tails.' });
    var heads = drawArt(panel, f, cat.look);
    var ctx = { panel: panel, frame: f, heads: heads, caps: captionsOf(f), balloons: balloonsOf(f) };
    relayoutFn = function () { layoutText(ctx); };
    layoutText(ctx);
    $('interact').innerHTML = '<div class="row end"><button class="btn" type="button" id="nestBtn">My nest</button><button class="btn go big" type="button" id="startBtn">Start a round</button></div>';
    $('nestBtn').addEventListener('click', function () { go('nest', { from: 'hollow' }); });
    $('startBtn').addEventListener('click', function () {
      var r = E.hollowStart(cat, story, now(), 1);
      cat.lesson = { mode: 'hollow', state: r.state }; persist();
      hollowLesson(r.def, r.state, false);
    });
    currentSpeech = ctx.reading || [];
  }
  function hollowLesson(def, st, resume) {
    runLesson({
      def: def, state: st, mode: 'hollow',
      intro: resume ? [] : [{ who: 'tallyheart', text: 'A round of tails. Ready? Here we go.' }],
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
    // an insert on the claw marks (as in the chapter's f063): the tree camera sits above the tree
    // anchor, so a cat there shows only her ear tips; her line comes in from off-panel instead
    var f = { scene: { set: 'hollow', cam: 'tree', opts: { marks: 1, glow: !!cat.hollow.glow }, cast: [], fx: cat.hollow.glow ? ['glow', 'sparkle'] : ['sparkle'] } };
    var heads = drawArt(panel, f, cat.look);
    var line = fill(def.done);
    var ctx = { panel: panel, frame: f, heads: heads, caps: [], balloons: [{ who: 'tallyheart', text: line, kind: 'say' }] };
    relayoutFn = function () { layoutText(ctx); };
    layoutText(ctx);
    $('interact').innerHTML =
      (t ? '<div class="reward' + (reduceMotion ? '' : ' pop') + '" role="status">' + treasureSvg(t.id) + '<b>' + esc(t.name) + '</b><span>for your nest</span></div>' : '') +
      (res.glowNow ? '<p class="glow-note">Look! Your claw mark on the tree is glowing.</p>' : '') +
      '<div class="row end"><button class="btn" type="button" id="nestBtn">My nest</button><button class="btn go big" type="button" id="againBtn">Another round</button></div>';
    $('nestBtn').addEventListener('click', function () { go('nest', { from: 'hub' }); });
    $('againBtn').addEventListener('click', function () { go('hollow', { from: 'hub', reward: true }); });
    currentSpeech = [{ text: line, who: 'tallyheart' }].concat(t ? [{ text: t.name + ', for your nest.' }] : []).concat(res.glowNow ? [{ text: 'Look! Your claw mark on the tree is glowing.' }] : []);
    speakItems(currentSpeech);
  }

  /* ================================================================ my nest */
  function renderNest() {
    if (!cat) return go('who');
    // a Hollow round finished but never recorded still puts its treasure in the nest
    if (cat.lesson && cat.lesson.mode === 'hollow' && E.settleLesson(cat)) persist();
    var items = E.nestItems(cat);
    var scr = $('screen');
    scr.innerHTML = '<section class="page">' +
      '<div class="solo-panel"><figure class="panel" id="panel"><div class="art" aria-hidden="true"></div><div class="ov"></div></figure></div>' +
      '<h1 class="h1">' + esc(E.displayName(cat)) + '’s nest</h1>' +
      (items.length ? '<div class="nest-grid">' + items.map(function (it) {
        return '<div class="treasure">' + (it.count > 1 ? '<span class="n">×' + it.count + '</span>' : '') + treasureSvg(it.treasure.id) + esc(it.treasure.name) + '</div>';
      }).join('') + '</div>' : '<p class="note">Your nest is just moss and rose leaves for now. Finish a round in the Training Hollow to find a treasure.</p>') +
      '<div class="links"><button class="btn go" type="button" data-go="hollow">The Training Hollow</button><button class="btn" type="button" data-go="hub">Camp</button></div>' +
      '</section>';
    var panel = $('panel');
    var f = { scene: { set: 'den', cam: 'nest', cast: [{ who: 'player', pose: 'curl', mood: 'happy', at: 'nest' }], fx: ['night'] } };
    drawArt(panel, f, cat.look);
    panel.setAttribute('aria-label', 'Your nest in the apprentices’ den');
    Array.prototype.forEach.call(doc.querySelectorAll('[data-go]'), function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-go'), { from: 'nest' }); }); });
    currentSpeech = [{ text: E.displayName(cat) + '’s nest.' }].concat(items.map(function (it) { return { text: it.treasure.name }; }));
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
  function speakItems(items) {
    if (!save || !save.settings.readAloud || !('speechSynthesis' in root)) return;
    if (!items || !items.length) return;   // nothing new to say: let what is speaking finish
    try {
      speechSynthesis.cancel();
      (items || []).forEach(function (it) {
        var txt = plain(String(it.text || '').replace(/<[^>]+>/g, ' ')).trim();
        if (!txt) return;
        var u = new SpeechSynthesisUtterance(txt);
        var v = pickVoice(); if (v) u.voice = v;
        u.lang = (v && v.lang) || 'en-US';
        u.rate = 0.95;
        u.pitch = PITCH[it.who] || 1;
        speechSynthesis.speak(u);
      });
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
  var FLAG_WORDS = {
    stepOut: { chase: 'chased the moth out the door', slow: 'stepped out slowly' },
    spokeUp: { 'true': 'spoke up about the thirteenth sparrow', 'false': 'stayed quiet about the sparrow' },
    joinReason: { learn: 'asked to join to learn everything', count: 'asked to join because “I can learn to count anything”', brave: 'asked to join because “I’m braver than I look”' },
    specialty: { noticing: 'good at noticing', sneaking: 'good at sneaking', climbing: 'good at climbing', swimming: 'likes water (swimming)', friends: 'good at making friends' },
    worry: { small: 'worries about being too small', water: 'worries about deep water', talk: 'talks when nervous', shiny: 'distracted by shiny things' }
  };
  function fmtMs(ms) { return ms == null ? '–' : (ms / 1000).toFixed(1) + ' s'; }
  function openGrownups() {
    stopSpeech();
    var sheet = $('sheet');
    var cats = save.cats;
    var html = '<div class="sheet-in"><button class="gbtn close" type="button" id="gClose">Close</button>' +
      '<h2>Grown-ups corner</h2><p class="muted">Potomac Crossing ' + esc(E.VERSION) + ' · saves on this device only, under one key (' + esc(E.STORAGE_KEY) + ')' +
      (store && !store.ok ? ' · <b>this browser is not letting it save</b>' : '') + '</p>' +
      '<p class="muted">Counts times are for you, not her: the game never shows a clock. “Right first time” counts the first ask of a fact in each lesson; “helped” is how often the sand count came out.</p>';
    if (!cats.length) html += '<p>No cats on this device yet.</p>';
    cats.forEach(function (c) {
      var table = E.factTable(c.counts);
      var L = lookOptions();
      var lookTxt = [lookDef('sex', c.look.sex).label, lookDef('fur', c.look.fur).label, lookDef('marking', c.look.marking).label, lookDef('eyes', c.look.eyes).label + ' eyes'].join(' · ');
      var flags = Object.keys(c.flags || {}).filter(function (k) { return k !== 'looked'; }).map(function (k) {
        var w = FLAG_WORDS[k] && FLAG_WORDS[k][String(c.flags[k])];
        return '<li>' + esc(w || (k + ': ' + c.flags[k])) + '</li>';
      }).join('');
      var choices = Object.keys(c.choices || {}).map(function (fid) {
        return '<li><span class="muted">' + esc(fid) + '</span> ' + esc(E.fill(c.choices[fid].label, c)) + '</li>';
      }).join('');
      var nest = E.nestItems(c).map(function (it) { return it.treasure.name + (it.count > 1 ? ' ×' + it.count : ''); }).join(', ');
      html += '<h3>' + esc(E.displayName(c)) + '</h3>' +
        '<dl><dt>Clan name</dt><dd>' + esc(c.name ? c.name + 'paw' : '(not yet)') + '</dd>' +
        '<dt>Pet name</dt><dd>' + esc(c.petname || '(not yet)') + '</dd>' +
        '<dt>Look</dt><dd>' + esc(lookTxt) + '</dd>' +
        '<dt>Dream</dt><dd>' + esc(c.dream || '–') + '</dd>' +
        '<dt>Chapter 1</dt><dd>' + (c.done ? 'finished' : 'on frame ' + esc(c.frame || '–') + ', page ' + ((c.history || []).length + 1)) + '</dd>' +
        '<dt>Training Hollow</dt><dd>' + c.hollow.rounds + ' round' + (c.hollow.rounds === 1 ? '' : 's') + ', ' + c.hollow.cleanRounds + ' without help' + (c.hollow.glow ? ', claw mark glowing' : '') + '</dd>' +
        '<dt>Nest</dt><dd>' + esc(nest || '–') + '</dd></dl>' +
        (flags ? '<h4>What the choices say</h4><ul>' + flags + '</ul>' : '') +
        (choices ? '<h4>Choices, in order</h4><ul>' + choices + '</ul>' : '') +
        '<h4>The Counts</h4>' +
        (table.length ? '<div class="scroll"><table><thead><tr><th>Fact</th><th>Attempts</th><th>Right first time</th><th>Helped</th><th>Typical time</th></tr></thead><tbody>' +
          table.map(function (r) { return '<tr><td>' + r.a + ' × ' + r.b + '</td><td>' + r.attempts + '</td><td>' + r.rightFirst + ' of ' + r.firstAsks + '</td><td>' + r.helped + '</td><td>' + fmtMs(r.medianMs) + '</td></tr>'; }).join('') +
          '</tbody></table></div>' : '<p class="muted">No answers yet.</p>') +
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
        if (cat && cat.id === c.id) cat = fresh;
        persist(); close(); go('who');
      });
    });
    Array.prototype.forEach.call(sheet.querySelectorAll('[data-remove]'), function (b) {
      b.addEventListener('click', function () {
        var c = E.getCat(save, b.getAttribute('data-remove'));
        if (!c || !root.confirm('Remove ' + E.displayName(c) + ' from this device? This can’t be undone.')) return;
        E.removeCat(save, c.id);
        if (cat && cat.id === c.id) cat = null;
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
      case 'pebble': return o + '<ellipse cx="50" cy="56" rx="34" ry="24" fill="#8f97a8"/><path d="M20 58c16-8 44-8 60 0" fill="none" stroke="#f2f2f2" stroke-width="5"/><ellipse cx="38" cy="44" rx="8" ry="4" fill="#fff" stroke="none" opacity=".8"/>' + c;
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
      default: return o + '<circle cx="50" cy="50" r="28" fill="#ffd23f"/>' + c;
    }
  }
  UI.treasureSvg = treasureSvg;

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(typeof globalThis !== 'undefined' ? globalThis : this);
