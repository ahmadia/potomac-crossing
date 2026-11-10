// Potomac Crossing: the offscreen WebKit tool's in-page measure (the canonical copy, 2026-11-02; README.md beside this
// file). Written fresh by the aa-layout judge (2026-10-26); since then it also finds text spilling its box and words
// broken inside themselves. Read-only: it changes nothing in the page but the frame it opens.
// window.__JM(tag): the screen as it is now, at the current scroll. Every shown control in #screen (buttons,
// fields, links styled as buttons; .sr skipped; her Case File's and the sheet's when open) with its viewport box; a
// control is "in" when wholly inside [0,vw] x [bar bottom (when scrolled), vh] (`bad`: name@top-bottom:flags, X off
// sideways, b cut by the fold, B wholly below it, T under the bar). Also Back, Next, the bottom row's row count, the
// choices, the keypad, the question line, the column's type size, the panel's box, and two fingerprints (every shown
// box in #app; the panel and everything in it, relative to the panel) for the "Aa off: nothing changes" check.
// On a take page (the take-aways kit), also the column, the outlined box and the stack's last balloon, and the bar's
// bottom (`take`, `tcol`, `tbox`, `tsf`, `tsb`, `tbar`): tools/sweep.mjs's `col-off`. The kit v0.4 (decision 57) adds the
// small boxes (`tmini`), the tap targets' hit boxes (`ttgt`), the slot's balloon (`tslot`) and the marks page (`tpick`,
// its little 1 `tone`): `col-off`, `hit-small`, `marks-small`; and on a take, store, Hollow or Spanish screen a hash of
// the screen's markup (`hx`), for `--takes --compare`.
// `spill`: lettering outside its own box, or cut off by a box that clips it (name:side px); `broken`: a word broken
// across two lines inside itself (`Wo|rd in .caption`; a break after a hyphen, a dash or a soft hyphen is fine).
// A box that scrolls (the book, her Case File) clips nothing; a box with overflow hidden or clip (the panel) does.
// `sw` > `vw` is sideways scroll; `errs` page errors; `said`, `read`, `silent` the silence (window.__shotsSaid).
// window.__JSWEEP(mode): every frame of every chapter (mode 'plain'), or the Taps pages tapped through
// ('taps'), or each Counts frame's keypad screen after the game's own scroll ('lessons').
(function () {
  var de = document.documentElement;
  function box(e) { var r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }
  function shown(e) {
    if (!e || !e.getClientRects().length) return false;
    if (typeof e.className === 'string' && /(^| )sr( |$)/.test(e.className)) return false;
    var cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1;
  }
  function name(e) {
    var t = (e.textContent || e.value || '').replace(/\s+/g, ' ').trim().slice(0, 18).replace(/"/g, "'");
    return (e.id ? '#' + e.id : (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : e.tagName.toLowerCase())) + (t ? '"' + t + '"' : '');
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }
  /* The kit v0.4 (decision 57; design section 3), on a take page or a marks page, each key only where there is one:
   *   tmini  every shown .tmini in the column (the ringed one, an open one's place, a right one's green): { b (its box),
   *          on (1 when ringed, .tmini.on), and for a front box (the little 1's, `'one'`: a .tmini in or under an element
   *          whose class says front, or with data-front, or one at least half inside the top digits' row) front: 1, own
   *          (the ink box of its own digit or mark: the lettering in its cell, .ttop or .tmark, outside the front box;
   *          with no cell, the nearest lettering to its right in its row), nb (the ink box of the neighbour's mark: the
   *          nearest mark to its left; a mark is any shown lettering in the column that is not in a digit, a box, a head,
   *          the sign or the rule) }
   *   ttgt   every [role="button"] in the column (the tap targets: their own boxes are the hit areas, widened by
   *          index.html): { b, live (0 while hidden, aria-disabled, tabindex -1, pointer-events none or not shown), n }
   *   tslot  the slot's balloon under the column's line (.tslot or [data-slot]), when shown
   *   tpick  the marks page (.tpick), when shown; tone, its 'one' picture's little 1 ([data-style="one"], else the
   *          button that says "little 1", else the first): { b, fs (its font size as rendered, px: a transform's scale in
   *          it) }, or null when none is found (a [class*="front"] element, else a lone "1" that is no digit or box). */
  var TCELL = /(^| )(tsign|thead|ttop|tbot|tbox|trule|tmini)( |$)/;
  function cls(e) { return typeof e.className === 'string' ? e.className : (e.getAttribute && e.getAttribute('class')) || ''; }
  function leafText(e) { return !e.children.length && /\S/.test(e.textContent || ''); }
  // (lettering's own box, its ink's line box: a digit's cell is the grid column's width)
  function ink(e) { var r = document.createRange(); r.selectNodeContents(e); var q = r.getBoundingClientRect(); return q.width > 0.5 ? [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)] : box(e); }
  // (the ink of a cell's lettering outside its front box: the digit or gold number a little 1 stands before; null for none)
  function inkBesides(cell) {
    var tw = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null), n, u = null;
    while ((n = tw.nextNode())) {
      if (!/\S/.test(n.nodeValue) || !n.parentElement || n.parentElement.closest('.tmini, [class*="front"], .sr')) continue;
      var r = document.createRange(); r.selectNodeContents(n); var g = r.getBoundingClientRect();
      if (g.width <= 0.5) continue;
      var q = [Math.round(g.left), Math.round(g.top), Math.round(g.right), Math.round(g.bottom)];
      u = u ? [Math.min(u[0], q[0]), Math.min(u[1], q[1]), Math.max(u[2], q[2]), Math.max(u[3], q[3])] : q;
    }
    return u;
  }
  function takeMoves(m, tcol) {
    var minis = tcol ? Array.prototype.filter.call(tcol.querySelectorAll('.tmini'), shown) : [];
    if (minis.length) {
      var tops = Array.prototype.filter.call(tcol.querySelectorAll('.ttop'), function (e) { return shown(e) && /\S/.test(e.textContent || ''); }).map(ink);
      var marks = Array.prototype.filter.call(tcol.querySelectorAll('*'), function (e) {
        return leafText(e) && !TCELL.test(cls(e)) && !e.closest('svg') && !e.closest('.tmini') && !e.closest('.sr') && !e.closest('.ttop, .tbot, .tbox') && shown(e);
      }).map(ink);
      var across = function (b, t, part) { return Math.min(b[3], t[3]) - Math.max(b[1], t[1]) >= part * Math.max(1, Math.min(b[3] - b[1], t[3] - t[1])); };
      m.tmini = minis.map(function (e) {
        var b = box(e), o = { b: b, on: /(^| )on( |$)/.test(cls(e)) ? 1 : 0 };
        if (e.closest('[class*="front"]') || e.hasAttribute('data-front') || tops.some(function (t) { return across(b, t, 0.5); })) {
          var own = null, nb = null, cx = (b[0] + b[2]) / 2, cell = e.closest('.ttop, .tmark');
          if (cell && cell !== e) own = inkBesides(cell);
          else tops.concat(marks).forEach(function (t) { if (t[0] >= cx && across(b, t, 0.34) && (!own || t[0] < own[0])) own = t; });
          marks.forEach(function (k) { if (k[2] <= cx && (!nb || k[2] > nb[2])) nb = k; });
          o.front = 1; o.own = own; o.nb = nb;
        }
        return o;
      });
    }
    var tg = tcol ? Array.prototype.filter.call(tcol.querySelectorAll('[role="button"]'), function (e) { return e.getClientRects().length > 0; }) : [];
    if (tg.length) m.ttgt = tg.map(function (e) {
      var cs = getComputedStyle(e), b = box(e);
      var off = e.hidden || e.getAttribute('aria-disabled') === 'true' || e.getAttribute('tabindex') === '-1' || cs.pointerEvents === 'none' || cs.visibility === 'hidden' || cs.display === 'none' || b[2] - b[0] < 1 || b[3] - b[1] < 1;
      return { b: b, live: off ? 0 : 1, n: (e.getAttribute('aria-label') || name(e)).slice(0, 30) };
    });
    var slot = document.querySelector('#screen .tslot, #screen [data-slot]'); if (slot && shown(slot)) m.tslot = box(slot);
    var pick = document.querySelector('#screen .tpick');
    if (pick && shown(pick)) {
      m.tpick = box(pick);
      var btns = Array.prototype.filter.call(pick.querySelectorAll('button, [role="button"]'), shown);
      var ob = pick.querySelector('[data-style="one"]') || btns.filter(function (x) { return /little 1/i.test((x.textContent || '') + ' ' + (x.getAttribute('aria-label') || '')); })[0] || btns[0] || null;
      var one = ob && (Array.prototype.filter.call(ob.querySelectorAll('[class*="front"]'), function (x) { return shown(x) && (x.textContent || '').trim() === '1'; })[0] ||
        Array.prototype.filter.call(ob.querySelectorAll('.tcol *'), function (x) { return leafText(x) && x.textContent.trim() === '1' && !x.closest('.tbot, .tbox, .thead, svg, .sr') && shown(x); })[0]);
      if (one) {
        var r1 = one.getBoundingClientRect(), sc = one.offsetHeight ? r1.height / one.offsetHeight : 1;
        m.tone = { b: box(one), fs: Math.round(parseFloat(getComputedStyle(one).fontSize) * (Math.abs(sc - 1) > 0.05 ? sc : 1) * 10) / 10 };
      } else m.tone = null;
    }
  }
  window.__JM = function (tag) {
    var vw = de.clientWidth, vh = de.clientHeight, sy = Math.round(window.scrollY);
    var bar = document.getElementById('bar') || document.querySelector('.bar');
    var top = sy > 0 && bar ? Math.round(bar.getBoundingClientRect().bottom) : 0;
    var fr = document.querySelector('#screen .frame');
    var m = { t: tag, vw: vw, vh: vh, sw: de.scrollWidth, sh: de.scrollHeight, sy: sy, big: de.classList.contains('big'),
      k: fr ? fr.getAttribute('data-kind') : null, solo: !!(fr && fr.classList.contains('solo')), fit: !!(fr && fr.classList.contains('fit')) };
    var fo = document.getElementById('file'), so = document.getElementById('sheet');
    var extra = (fo && shown(fo) ? ', #file button' : '') + (so && shown(so) ? ', #sheet button' : '');
    var ctl = Array.prototype.filter.call(document.querySelectorAll('#screen button, #screen input, #screen textarea, #screen select, #screen a.btn' + extra), shown);
    var bad = [], low = 0;
    ctl.forEach(function (e) {
      var b = box(e), f = '';
      if (b[0] < -0.5 || b[2] > vw + 0.5) f += 'X';
      if (b[3] > vh + 0.5) f += b[1] < vh ? 'b' : 'B';
      if (b[1] < top - 0.5) f += 'T';
      if (b[3] > low) low = b[3];
      if (f) bad.push(name(e) + '@' + b[1] + '-' + b[3] + ':' + f);
    });
    m.n = ctl.length; m.bad = bad; m.slack = ctl.length ? vh - low : null;
    var bk = document.getElementById('backBottom'); if (bk && shown(bk)) m.back = box(bk);
    var nx = document.getElementById('nextBtn'); if (nx && shown(nx)) m.next = box(nx);
    var row = document.querySelector('#screen .next-row, #screen .row.end');
    if (row && shown(row)) { var tops = []; Array.prototype.forEach.call(row.children, function (c) { if (c.tagName === 'BUTTON' && shown(c)) { var t = Math.round(c.getBoundingClientRect().top); if (tops.every(function (x) { return Math.abs(x - t) > 4; })) tops.push(t); } }); m.rows = tops.length; }
    var ch = Array.prototype.filter.call(document.querySelectorAll('#screen .choice'), shown).map(box);
    if (ch.length) m.choices = [ch.length, Math.min.apply(null, ch.map(function (b) { return b[1]; })), Math.max.apply(null, ch.map(function (b) { return b[3]; })), Math.min.apply(null, ch.map(function (b) { return b[3] - b[1]; }))];
    var kp = document.querySelector('#screen .keypad'); if (kp && shown(kp)) m.kp = box(kp);
    var q = document.querySelector('#screen .q'); if (q && shown(q)) m.q = box(q);
    var col = document.querySelector('#screen .frame .col'); if (col && shown(col)) m.col = box(col);
    var cap = document.querySelector('#screen .frame .col .caption, #screen .frame .col .sb'); if (cap) { var cs = getComputedStyle(cap); m.colFs = [parseFloat(cs.fontSize), parseFloat(cs.lineHeight) || cs.lineHeight]; }
    if (bk && shown(bk)) m.btnFs = parseFloat(getComputedStyle(bk).fontSize);
    var p = document.querySelector('#screen .panel'); if (p && shown(p)) { var pb = p.getBoundingClientRect(); m.panel = [Math.round(pb.width), Math.round(pb.height), Math.round(pb.left), Math.round(pb.top)]; }
    // the take-aways kit's page (docs/take-aways.md, section 6): `bad` above sees only controls, so a take page that
    // pushed its column or its line under the bar would pass. On a take page (its frame's data-mode, or a .tcol in the
    // screen): `take`, the bar's bottom at any scroll (`tbar`: the bar is sticky), and the viewport boxes of the column
    // (`tcol`), the outlined box (`tbox`, .tbox.on) and the stack's first and last balloons (`tsf`, `tsb`: chapter 12's
    // review, 58 − 23 opened with its first balloon under the bar and its last on the screen), each null when not shown, and
    // the column's type size (`tfs`). tools/sweep.mjs reports `col-off` when one is not wholly between `tbar` and `vh`.
    // (the page's own column: never a picture's on the marks page, .tpick, whose buttons draw the kit's .tcol markup)
    var tcol = Array.prototype.filter.call(document.querySelectorAll('#screen .tcol'), function (e) { return !e.closest('.tpick'); })[0] || null;
    var tpk = document.querySelector('#screen .tpick');
    if ((fr && fr.getAttribute('data-mode') === 'take') || tcol || (tpk && shown(tpk))) {
      m.take = !!(fr && fr.getAttribute('data-mode') === 'take');
      m.tbar = bar && shown(bar) ? Math.round(bar.getBoundingClientRect().bottom) : 0;
      m.tcol = tcol && shown(tcol) ? box(tcol) : null;
      var tbx = document.querySelector('#screen .tcol .tbox.on, #screen .tbox.on'); m.tbox = tbx && shown(tbx) ? box(tbx) : null;
      var sbs = Array.prototype.filter.call(document.querySelectorAll('#screen #stack .sb, #screen .stack .sb'), shown); m.tsb = sbs.length ? box(sbs[sbs.length - 1]) : null; m.tsf = sbs.length ? box(sbs[0]) : null;
      if (m.tcol) m.tfs = parseFloat(getComputedStyle(tcol).fontSize);
      takeMoves(m, tcol);
    }
    // the screen's markup, on the kit's and chapter 12's screens (`--takes --compare`: byte for byte against the live tree)
    if (/^(take|store|hollow|es):/.test(String(tag))) { var scr = document.getElementById('screen'); m.hx = scr ? hash(scr.innerHTML) : null; }
    // lettering: spilling its box (or cut by one that clips it), and words broken inside themselves. A text's box is
    // its nearest element that is not inline (an svg's <text>, a sound effect: the svg); clipped means outside the
    // nearest box with overflow other than visible.
    var roots = [document.getElementById('screen')].concat(fo && shown(fo) ? [fo] : [], so && shown(so) ? [so] : []).filter(Boolean);
    m.spill = []; m.broken = [];
    var rg = document.createRange();
    var boxOf = function (e, root) { while (e && e !== root && /^(inline|contents)$/.test(getComputedStyle(e).display)) e = e.parentElement; return e; };
    var clipOf = function (e) {
      for (var a = e.parentElement; a && a !== document.body && a !== de; a = a.parentElement) {
        var cs = getComputedStyle(a);
        if (/(hidden|clip)/.test(cs.overflowX + ' ' + cs.overflowY)) return a;   // (a box that scrolls clips nothing: it scrolls)
      }
      return null;
    };
    var rectsOf = function (tn, i, j) { rg.setStart(tn, i); rg.setEnd(tn, j); return Array.prototype.filter.call(rg.getClientRects(), function (q) { return q.width > 0.5 && q.height > 0.5; }); };
    roots.forEach(function (root) {
      var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, boxes = [], texts = [];
      while ((n = tw.nextNode())) {
        if (!/\S/.test(n.nodeValue) || !n.parentElement || n.parentElement.closest('.sr') || !shown(n.parentElement)) continue;
        var bx = boxOf(n.parentElement, root), k = boxes.indexOf(bx);
        if (k < 0) { k = boxes.push(bx) - 1; texts.push([]); }
        texts[k].push(n);
      }
      boxes.forEach(function (bx, k) {
        var rs = [];
        texts[k].forEach(function (tn) { rs = rs.concat(rectsOf(tn, 0, tn.nodeValue.length)); });
        if (!rs.length) return;
        var t = { l: Math.min.apply(null, rs.map(function (q) { return q.left; })), r: Math.max.apply(null, rs.map(function (q) { return q.right; })),
          t: Math.min.apply(null, rs.map(function (q) { return q.top; })), b: Math.max.apply(null, rs.map(function (q) { return q.bottom; })) };
        // up and down, a text's range is its font's whole height, well past its ink (a big number's, most of all):
        // only what one side has more than the other counts (a line-height tighter than the font puts it past its
        // box as much above as below), and only past a third of a line
        var lineH = Math.max.apply(null, rs.map(function (q) { return q.height; })), vtol = Math.max(3, 0.35 * lineH);
        var out = function (box, what) {
          var d = [];
          if (t.l < box.left - 2) d.push('left ' + Math.round(box.left - t.l));
          if (t.r > box.right + 2) d.push('right ' + Math.round(t.r - box.right));
          var up = box.top - t.t, down = t.b - box.bottom;
          if (up - Math.max(down, 0) > vtol) d.push('top ' + Math.round(up - Math.max(down, 0)));
          if (down - Math.max(up, 0) > vtol) d.push('bottom ' + Math.round(down - Math.max(up, 0)));
          if (d.length) m.spill.push(name(bx) + (what ? ' (cut by ' + what + ')' : '') + ': ' + d.join(', '));
          return d.length;
        };
        var c = !out(bx.getBoundingClientRect(), '') && clipOf(bx);
        if (c) out(c.getBoundingClientRect(), name(c));
        // words broken inside themselves (only where the lettering runs to two lines or more)
        var tops = []; rs.forEach(function (q) { if (tops.every(function (x) { return Math.abs(x - q.top) > 3; })) tops.push(q.top); });
        if (tops.length < 2) return;
        texts[k].forEach(function (tn) {
          var re = /\S+/g, mm, sv = tn.nodeValue;
          while ((mm = re.exec(sv))) {
            if (mm[0].length < 2) continue;
            var ws = rectsOf(tn, mm.index, mm.index + mm[0].length);
            if (ws.length < 2 || !ws.some(function (q) { return Math.abs(q.top - ws[0].top) > 3; })) continue;
            var at = -1;
            for (var i = 1; i < mm[0].length; i++) { var q1 = rectsOf(tn, mm.index + i, mm.index + i + 1)[0]; if (q1 && Math.abs(q1.top - ws[0].top) > 3) { at = i; break; } }
            if (at > 0 && /[-\u2010\u2013\u2014\/\u00ad]/.test(mm[0][at - 1])) continue;
            m.broken.push(mm[0].slice(0, at) + '|' + mm[0].slice(at) + ' in ' + name(bx));
          }
        });
      });
    });
    // fingerprints
    var s = vw + 'x' + vh + ' ' + de.scrollWidth + 'x' + de.scrollHeight + '|';
    var all = document.querySelectorAll('#app *' + (extra ? ', #file *, #sheet *' : ''));
    for (var i = 0; i < all.length; i++) { var e = all[i]; if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue; if (!e.getClientRects().length) continue; var r = e.getBoundingClientRect(); s += e.tagName + (typeof e.className === 'string' ? e.className : '') + Math.round(r.left * 4) + ',' + Math.round(r.top * 4) + ',' + Math.round(r.width * 4) + ',' + Math.round(r.height * 4) + ';'; }
    m.fp = hash(s);
    if (p) { var P = p.getBoundingClientRect(), pv = Math.round(P.width * 4) + 'x' + Math.round(P.height * 4) + '|'; Array.prototype.forEach.call(p.querySelectorAll('*'), function (e) { if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') return; if (!e.getClientRects().length) return; var r = e.getBoundingClientRect(); pv += e.tagName + Math.round((r.left - P.left) * 4) + ',' + Math.round((r.top - P.top) * 4) + ',' + Math.round(r.width * 4) + ',' + Math.round(r.height * 4) + ':' + (e.textContent || '').length + ';'; }); m.pfp = hash(pv); }
    var L = null; try { L = PC.debug.layout(); } catch (e) {} m.lay = L ? L.captions + '/' + L.balloons : null;
    m.silent = window.__shotsSilent === true; m.said = (window.__shotsSaid || []).length; m.read = PC.debug.state().settings.readAloud;
    m.errs = (window.__errs || []).length;
    return m;
  };
  window.__JSWEEP = function (mode, only) {
    var out = [], realNow = Date.now, styled = null;
    // (the page's zero-delay calls made while `fn` runs, held: run0 runs them now, pass0 hands them to the real timer as
    // they would have gone; any other timer goes as it would)
    var held = function (fn) {
      var list = [], st = window.setTimeout;
      window.setTimeout = function (f, ms) { if (!ms && typeof f === 'function') { list.push(f); return st.call(window, function () {}, 0); } return st.apply(window, arguments); };
      try { fn(); } finally { window.setTimeout = st; }
      return list;
    };
    var run0 = function (list) { list.forEach(function (f) { try { f(); } catch (e) {} }); };
    var pass0 = function (list) { list.forEach(function (f) { window.setTimeout(f, 0); }); };
    // (the marks the lessons job gave the cat at a chapter's marks page, taken back off it)
    var unstyle = function () { if (!styled) return; if (styled.takes) styled.cat.takes = styled.takes; else delete styled.cat.takes; styled = null; };
    Object.keys(PC.story).forEach(function (ch) {
      if (styled && styled.ch !== ch) unstyle();
      Object.keys(PC.story[ch].frames).forEach(function (fid) {
        if (only && only.indexOf(ch + ':' + fid) < 0) return;
        var r = PC.debug.goto(fid, ch);
        if (r !== fid) { out.push({ t: ch + ':' + fid, err: String(r) }); return; }
        window.scrollTo(0, 0);
        var k = (document.querySelector('#screen .frame') || { getAttribute: function () { return null; } }).getAttribute('data-kind');
        if (mode === 'plain') { out.push(window.__JM(ch + ':' + fid)); return; }
        var clock = realNow.call(Date); Date.now = function () { clock += 1000; return clock; };
        try {
          if (mode === 'taps') {
            // tapped through with the page's own PC.debug.tap() (a fast clock passes its 220 ms double-tap guard), the
            // worst moment kept: the column grows as she counts, so Back can sink before Next ever shows
            if (!/^(skip|scratch|ask|glint)$/.test(k)) return;
            var here = function () { var f = document.querySelector('#screen .frame'); return f && f.getAttribute('data-frame') === fid; };
            var lowest = function () { var lo = null; Array.prototype.forEach.call(document.querySelectorAll('#screen button, #screen input, #screen a.btn'), function (e) { if (!shown(e)) return; var b = e.getBoundingClientRect().bottom; if (!lo || b > lo[0]) lo = [Math.round(b), name(e)]; }); return lo; };
            var n = 0, res = 'max', worst = null, vh = de.clientHeight;
            for (; n < 300; n++) {
              if (!here()) { res = 'turned'; break; }
              if (document.getElementById('nextBtn')) { res = 'next'; break; }
              window.scrollTo(0, 0);
              var lo = lowest(); if (!lo) { res = 'turning'; break; }
              if (!worst || lo[0] > worst[0]) worst = lo;
              if (PC.debug.tap() !== true) { res = 'tap refused'; break; }
            }
            window.scrollTo(0, 0);
            var m = here() ? window.__JM(ch + ':' + fid + '@tapped') : { t: ch + ':' + fid + '@tapped', bad: [] };
            var lo2 = here() ? lowest() : null; if (lo2 && (!worst || lo2[0] > worst[0])) worst = lo2;
            m.taps = n; m.res = res; m.worst = worst ? [vh - worst[0], worst[1]] : null; m.k = k; out.push(m);
          } else if (mode === 'lessons' && k === 'counts') {
            var b = document.getElementById('againBtn') || document.getElementById('nextBtn');
            if (!b) return;
            var later0 = held(function () { b.click(); });
            // (on the kit v0.4's marks page, its pictures brought into view after go()'s scroll to the top, as the page's own
            // zero-delay call does: run now, so the row is the page as she sees it; every other page's left to run later, as
            // before, so no row of chapters 1 to 12 moves)
            if (document.querySelector('#screen .tpick')) run0(later0); else pass0(later0);
            var m2 = window.__JM(ch + ':' + fid + '@lesson');   // at the game's own scroll
            window.scrollTo(0, 0); m2.at0 = window.__JM('').bad; out.push(m2);
            // the kit v0.4's marks page (a take set with the moves, the cat with no marks yet): her marks then picked, as a
            // player's are at the chapter's first spread, and the take page as it then opens measured too
            // (`@lesson:column`); her marks kept for the chapter's later take frames (chapter 13's pile is measured on its
            // column, as she meets it), and taken back off the cat when the chapter changes and at the end (chapter 13's
            // review: f039@lesson measured the marks page, which no player sees there, and no sweep reached the columns)
            if (document.querySelector('#screen .tpick') && PC.engine.setTakeStyle) {
              var sc = PC.debug.cat();
              if (sc && !styled) styled = { ch: ch, cat: sc, takes: sc.takes ? JSON.parse(JSON.stringify(sc.takes)) : null };
              if (sc) PC.engine.setTakeStyle(sc, 'above');
              // (the lesson she began is in the slot, so the frame comes back as its take page; else its button opens it; the
              // keypad brought into view after go()'s scroll to the top, the page's own zero-delay call, run before measuring)
              var col3 = function () { var tc = document.querySelector('#screen #tcol'); return !!tc && !tc.hidden && !document.querySelector('#screen .tpick'); };
              var back = false, later3 = sc ? held(function () {
                if (PC.debug.goto(fid, ch) !== fid) return;
                back = true; window.scrollTo(0, 0);
                var b3 = col3() ? null : document.getElementById('againBtn') || document.getElementById('nextBtn');
                if (b3) b3.click();
              }) : [];
              if (back && col3()) { run0(later3); var m3 = window.__JM(ch + ':' + fid + '@lesson:column'); window.scrollTo(0, 0); m3.at0 = window.__JM('').bad; out.push(m3); }
              else pass0(later3);
            }
          }
        } finally { Date.now = realNow; }
      });
    });
    unstyle();
    return out;
  };
})();
true;
