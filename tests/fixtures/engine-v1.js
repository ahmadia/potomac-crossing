/* FIXTURE: app/engine.js exactly as shipped with chapter 1 (v0.1.0, commit 257d080), kept so
 * tests/engine.test.js can run real version-1 saves and replay chapter 1 through the old engine
 * beside the new one. Never edited; never loaded by the game. */
/* Potomac Crossing: the engine.
 *
 * Pure logic, no DOM. Loads in Node (module.exports = PC) and in the browser (window.PC.engine).
 * The UI owns drawing; the engine owns state: the cats on this device, tokens, the flow through
 * a chapter's frames, input cleaning, the Counts lesson runner, the book recap, the Training
 * Hollow, and saving to localStorage under one key, 'potomac-crossing.v1'.
 *
 * Functions that change a cat change the object they are given (and return it or a result).
 * Nothing here reads the clock on its own: callers pass `now` (ms since epoch) where it matters,
 * so the tests are deterministic.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var E = {};

  E.VERSION = '0.1.0 (chapter 1, 2026-10-03)';
  E.STORAGE_KEY = 'potomac-crossing.v1';
  E.SAVE_VERSION = 1;
  E.MAX_CATS = 4;
  E.FAST_MS = 4000;          // an answer under this earns a "didn't even have to count" line
  E.REQUEUE_GAP = 2;         // a missed fact comes back two questions later
  E.MAX_REQUEUE = 2;         // ...at most twice per fact per lesson
  E.HISTORY_CAP = 500;
  E.LOG_CAP = 2000;          // counts answers kept per cat
  E.CLAN_MAX = 14;
  E.PET_MAX = 24;
  E.DREAM_MAX = 200;
  E.GLOW_ROUNDS = 3;         // Training Hollow rounds without help before the claw mark glows

  /* ------------------------------------------------------------ helpers */
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function isObj(o) { return o !== null && typeof o === 'object' && !Array.isArray(o); }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function median(a) {
    if (!a.length) return null;
    var s = a.slice().sort(function (x, y) { return x - y; }), h = s.length >> 1;
    return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
  }
  function mulberry32(seed) {
    var t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(list, i) {
    if (!list) return '';
    if (typeof list === 'string') return list;
    if (!list.length) return '';
    return list[((i % list.length) + list.length) % list.length];
  }
  function asList(x) { return x == null ? [] : (Array.isArray(x) ? x : [x]); }
  E.util = { clone: clone, median: median, rng: mulberry32 };

  /* ------------------------------------------------------------ looks
   * The ids the engine stores; they match PC.art.vocab.looks (app/art/cats.js), which draws them. Labels and swatches are
   * for the reflection chooser; PC.art may publish its own list, which the UI prefers. */
  E.LOOKS = {
    sex: [
      { id: 'she', label: 'She-cat' },
      { id: 'tom', label: 'Tom' }
    ],
    fur: [
      { id: 'black', label: 'Midnight black', swatch: ['#3d3844', '#5b5465'] },
      { id: 'white', label: 'Snow white', swatch: ['#fbf8f2', '#e3dbcd'] },
      { id: 'silver-tabby', label: 'Silver tabby', swatch: ['#c3cbd4', '#6c7886'], stripes: true },
      { id: 'brown-tabby', label: 'Brown tabby', swatch: ['#b5895b', '#5b3f27'], stripes: true },
      { id: 'ginger', label: 'Ginger', swatch: ['#e8913a', '#b5602a'], stripes: true },
      { id: 'cream', label: 'Cream', swatch: ['#f2dbb1', '#d8b47f'], stripes: true },
      { id: 'grey', label: 'Grey', swatch: ['#9ea5ad', '#7d848c'] },
      // a soft hyphen: a narrow swatch breaks the word as Tortoise-shell
      { id: 'tortie', label: 'Tortoise\u00ADshell', swatch: ['#3f3330', '#da853b', '#ecb877'], patches: true },
      { id: 'calico', label: 'Calico', swatch: ['#fbf8f2', '#e3893a', '#3d3844'], patches: true }
    ],
    marking: [
      { id: 'none', label: 'No marking' },
      { id: 'white-paws', label: 'White paws' },
      { id: 'white-chest', label: 'A white chest' },
      { id: 'back-stripe', label: 'A dark stripe down your back' },
      { id: 'nose-splash', label: 'A splash of white on your nose' }
    ],
    eyes: [
      { id: 'green', label: 'Green', swatch: ['#8fca66'] },
      { id: 'amber', label: 'Amber', swatch: ['#f4aa2b'] },
      { id: 'blue', label: 'Blue', swatch: ['#79b9ee'] },
      { id: 'copper', label: 'Copper', swatch: ['#e27a32'] },
      { id: 'odd', label: 'One blue, one green', swatch: ['#79b9ee', '#8fca66'] }
    ]
  };
  E.LOOK_KEYS = ['sex', 'fur', 'marking', 'eyes'];
  var DEFAULT_FURS = ['brown-tabby', 'ginger', 'silver-tabby', 'grey'];
  E.defaultLook = function (i) {
    i = i || 0;
    return { sex: 'she', fur: DEFAULT_FURS[((i % 4) + 4) % 4], marking: 'none', eyes: 'green' };
  };
  /* Merge a partial look into a cat's look. Unknown keys are ignored; values are kept as given
   * (the art may know more than the engine's list), but must be short strings. */
  E.setLook = function (cat, partial) {
    if (!cat.look) cat.look = E.defaultLook(0);
    if (!isObj(partial)) return cat.look;
    E.LOOK_KEYS.forEach(function (k) {
      var v = partial[k];
      if (typeof v === 'string' && v.length && v.length <= 32) cat.look[k] = v;
    });
    return cat.look;
  };

  /* ------------------------------------------------------------ tokens */
  E.pronouns = function (sex) {
    var tom = sex === 'tom';
    return {
      they: tom ? 'he' : 'she', them: tom ? 'him' : 'her', their: tom ? 'his' : 'her',
      shecat: tom ? 'tom' : 'she-cat'
    };
  };
  function cap1(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  E.tokens = function (cat) {
    cat = cat || {};
    var look = cat.look || {};
    var p = E.pronouns(look.sex);
    var name = cat.name || '';
    var pet = cat.petname || '';
    if (!name) name = pet || 'Pillow';
    if (!pet) pet = 'Pillow Cat';
    var t = {
      name: name, petname: pet, dream: cat.dream || '',
      they: p.they, them: p.them, their: p.their, shecat: p.shecat,
      They: cap1(p.they), Them: cap1(p.them), Their: cap1(p.their), Shecat: cap1(p.shecat),
      THEY: p.they.toUpperCase(), THEM: p.them.toUpperCase(), THEIR: p.their.toUpperCase(),
      SHECAT: p.shecat.toUpperCase(), NAME: name.toUpperCase(), PETNAME: pet.toUpperCase()
    };
    return t;
  };
  /* Fill {tokens} from a cat. Unknown tokens stay as written, so a typo shows up instead of
   * vanishing. `extra` adds tokens (the Counts runner uses {a} {b} {groups} ...). */
  E.fill = function (text, cat, extra) {
    if (text == null) return '';
    var t = E.tokens(cat);
    return String(text).replace(/\{([A-Za-z]+)\}/g, function (m, k) {
      if (extra && own(extra, k)) return String(extra[k]);
      return own(t, k) ? t[k] : m;
    });
  };

  /* ------------------------------------------------------------ input cleaning */
  var LETTER = /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ]/;
  function keepNameChars(raw) {
    var s = String(raw == null ? '' : raw).replace(/[‘’ʼ]/g, "'").replace(/[‐-—]/g, '-');
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (LETTER.test(c) || c === "'" || c === '-') out += c;
      else if (/\s/.test(c)) out += ' ';
    }
    return out.replace(/\s+/g, ' ').replace(/^[\s'-]+|[\s'-]+$/g, '');
  }
  function titleCase(s) {
    return s.toLowerCase().replace(/(^|[\s-])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); });
  }
  function niceCase(s) {
    if (!s) return s;
    var first = s.charAt(0), rest = s.slice(1);
    // ALL CAPS (caps lock) reads like shouting on every screen, and stray capitals ("pAw",
    // "mOON") are slips: both become Title case. "McFluff" and "Sir Pounce-a-lot" stay as typed.
    var allCaps = s.length > 1 && s === s.toUpperCase() && s !== s.toLowerCase();
    var stray = first === first.toLowerCase() && rest !== rest.toLowerCase();
    if (allCaps || stray) return titleCase(s);
    return first.toUpperCase() + rest;
  }
  /* Shorten a name to max characters, at a word boundary when the cut would split a later word
   * ("Shimmering River" -> "Shimmering", not "Shimmering Riv"); one long word is simply cut. A
   * clipped name never ends on a small word: "the destroyer of socks and…" never stops at "and". */
  var SMALL_WORDS = /[\s-]+(a|an|and|of|the)$/i;
  function clip(s, max) {
    if (s.length <= max) return s;
    var cut = s.slice(0, max);
    if (LETTER.test(s.charAt(max))) {
      var b = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf('-'));
      if (b > 0) cut = cut.slice(0, b);
    }
    cut = cut.replace(/[\s'-]+$/, '');
    while (SMALL_WORDS.test(cut)) cut = cut.replace(SMALL_WORDS, '').replace(/[\s'-]+$/, '');
    return cut;
  }
  E.hasLetter = function (raw) { return LETTER.test(String(raw == null ? '' : raw)); };
  /* The first part of a Clan name. Letters, space, hyphen, apostrophe; at most 14 characters;
   * a trailing "paw" in any case is dropped (Moonpaw -> Moon, never Moonpawpaw) unless nothing
   * would be left (a cat called "Paw" becomes Pawpaw); first letter capitalised; never empty. */
  E.cleanClanName = function (raw, fallback) {
    var s = keepNameChars(raw);
    for (var guard = 0; guard < 4; guard++) {
      var m = /^(.*?)[\s'-]*paw$/i.exec(s);
      if (!m) break;
      var rest = m[1].replace(/[\s'-]+$/, '');
      if (!rest || !LETTER.test(rest)) break;
      s = rest;
    }
    s = clip(s, E.CLAN_MAX);
    s = niceCase(s);
    if (!s || !LETTER.test(s)) s = fallback ? E.cleanClanName(fallback) : 'Moon';
    return s;
  };
  E.cleanPetName = function (raw, fallback) {
    var s = keepNameChars(raw);
    s = clip(s, E.PET_MAX);
    // A name typed all in small letters gets a capital on every word, the way pet names are
    // written ("princess sparkle muffin" -> "Princess Sparkle Muffin"); anything else as niceCase.
    if (s && s === s.toLowerCase()) {
      var small = /^(a|an|and|at|for|in|of|on|the|to)$/;
      s = s.split(' ').map(function (w, i) {
        return (i > 0 && small.test(w)) || !w ? w : w.charAt(0).toUpperCase() + w.slice(1);
      }).join(' ');
    }
    else s = niceCase(s);
    if (!s || !LETTER.test(s)) s = fallback ? E.cleanPetName(fallback) : 'Muffin';
    return s;
  };
  /* The dream line: optional, at most 200 characters, whitespace tidied. Empty means skipped. */
  E.cleanDream = function (raw) {
    var s = String(raw == null ? '' : raw).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
    if (s.length > E.DREAM_MAX) s = s.slice(0, E.DREAM_MAX).trim();
    return s;
  };
  E.clanName = function (cat) { return cat && cat.name ? cat.name + 'paw' : ''; };
  E.displayName = function (cat) {
    if (!cat) return '';
    if (cat.name) return cat.name + 'paw';
    if (cat.petname) return cat.petname;
    return 'New cat';
  };

  /* ------------------------------------------------------------ saves and cats */
  E.newSave = function () {
    return { v: E.SAVE_VERSION, cats: [], current: null, settings: { readAloud: false, bigText: false } };
  };
  var idSeq = 0;
  function newId(now) {
    idSeq = (idSeq + 1) % 1000;
    return 'c' + Math.floor(now || 0).toString(36) + idSeq.toString(36) + Math.floor(Math.random() * 1296).toString(36);
  }
  E.blankCat = function (opts) {
    opts = opts || {};
    var now = opts.now || 0;
    return {
      id: opts.id || newId(now),
      created: now, updated: now,
      look: opts.look ? clone(opts.look) : E.defaultLook(opts.index || 0),
      petname: '', name: '', dream: '',
      flags: {}, choices: {},
      chapter: null, frame: null, history: [], done: false, doneAt: null,
      counts: [],            // every Counts answer: {set, a, b, answer, correct, ms, helped, retry, at}
      lessons: {},           // finished lessons by set id: summary
      lesson: null,          // a lesson in progress: { mode, frame, state }
      nest: [],              // treasure ids, in the order found
      hollow: { rounds: 0, cleanRounds: 0, glow: false }
    };
  };
  /* Add a cat to the device. Returns the cat, or null when four cats already live here. */
  E.addCat = function (save, opts) {
    if (save.cats.length >= E.MAX_CATS) return null;
    opts = opts || {};
    var cat = E.blankCat({ now: opts.now, index: save.cats.length, look: opts.look });
    while (E.getCat(save, cat.id)) cat.id = newId(opts.now) + 'x';
    save.cats.push(cat);
    save.current = cat.id;
    return cat;
  };
  E.getCat = function (save, id) {
    if (!save || !save.cats) return null;
    for (var i = 0; i < save.cats.length; i++) if (save.cats[i].id === id) return save.cats[i];
    return null;
  };
  E.currentCat = function (save) { return E.getCat(save, save && save.current); };
  E.removeCat = function (save, id) {
    var n = save.cats.length;
    save.cats = save.cats.filter(function (c) { return c.id !== id; });
    if (save.current === id) save.current = null;
    return save.cats.length < n;
  };
  /* Start a cat over: same slot, same id, everything else new. */
  E.resetCat = function (save, id, now) {
    for (var i = 0; i < save.cats.length; i++) {
      if (save.cats[i].id === id) {
        var fresh = E.blankCat({ id: id, now: now, index: i });
        save.cats[i] = fresh;
        return fresh;
      }
    }
    return null;
  };

  function normCat(c, i) {
    var b = E.blankCat({ id: typeof c.id === 'string' && c.id ? c.id : undefined, index: i });
    var out = b;
    Object.keys(b).forEach(function (k) {
      if (!own(c, k)) return;
      var v = c[k];
      if (Array.isArray(b[k])) { if (Array.isArray(v)) out[k] = v; }
      else if (isObj(b[k])) { if (isObj(v)) out[k] = v; }
      else if (k === 'lesson') { out[k] = isObj(v) ? v : null; }
      else if (k === 'chapter' || k === 'frame' || k === 'doneAt') { out[k] = (typeof v === 'string' || typeof v === 'number') ? v : null; }
      else if (typeof v === typeof b[k]) out[k] = v;
    });
    var look = E.defaultLook(i);
    E.LOOK_KEYS.forEach(function (k) { if (out.look && typeof out.look[k] === 'string') look[k] = out.look[k]; });
    out.look = look;
    if (!isObj(out.hollow)) out.hollow = { rounds: 0, cleanRounds: 0, glow: false };
    ['rounds', 'cleanRounds'].forEach(function (k) { if (typeof out.hollow[k] !== 'number') out.hollow[k] = 0; });
    out.hollow.glow = !!out.hollow.glow;
    return out;
  }
  /* Bring any stored value up to the current save shape. Never throws. */
  E.migrate = function (data) {
    var s = E.newSave();
    if (!isObj(data)) return s;
    if (Array.isArray(data.cats)) {
      s.cats = data.cats.filter(isObj).slice(0, E.MAX_CATS).map(normCat);
    }
    if (typeof data.current === 'string' && E.getCat(s, data.current)) s.current = data.current;
    if (isObj(data.settings)) {
      s.settings.readAloud = !!data.settings.readAloud;
      s.settings.bigText = !!data.settings.bigText;
    }
    return s;
  };

  /* Storage that cannot break the game. Every access is in try/catch; if the browser refuses
   * (private mode, full disk, blocked site data) the game carries on with an in-memory copy. */
  E.createStore = function (storage) {
    var memory = null;
    var useGiven = arguments.length > 0;
    function ls() {
      try { return useGiven ? (typeof storage === 'function' ? storage() : storage) : root.localStorage; }
      catch (e) { return null; }
    }
    var store = {
      ok: true,
      load: function () {
        var raw = null;
        try { var s = ls(); raw = s ? s.getItem(E.STORAGE_KEY) : null; }
        catch (e) { store.ok = false; raw = null; }
        if (raw == null || raw === '') return memory ? clone(memory) : E.newSave();
        try { return E.migrate(JSON.parse(raw)); }
        catch (e) { return memory ? clone(memory) : E.newSave(); }
      },
      save: function (data) {
        var json;
        try { json = JSON.stringify(data); } catch (e) { return false; }
        memory = JSON.parse(json);
        try {
          var s = ls();
          if (!s) { store.ok = false; return false; }
          s.setItem(E.STORAGE_KEY, json);
          store.ok = true;
          return true;
        } catch (e) { store.ok = false; return false; }
      },
      clear: function () {
        memory = null;
        try { var s = ls(); if (s) s.removeItem(E.STORAGE_KEY); return true; } catch (e) { return false; }
      }
    };
    return store;
  };

  /* ------------------------------------------------------------ flow */
  E.KINDS = ['next', 'choice', 'input', 'look', 'counts', 'end'];
  E.kindOf = function (frame) {
    if (!frame) return null;
    if (frame.end) return 'end';
    if (frame.choice) return 'choice';
    if (frame.input) return 'input';
    if (frame.look) return 'look';
    if (frame.counts) return 'counts';
    if (frame.next) return 'next';
    return 'end';
  };
  E.startChapter = function (cat, story, now) {
    cat.chapter = story.id;
    cat.frame = story.start;
    cat.history = [];
    cat.lesson = null;
    if (now) cat.updated = now;
    return cat;
  };
  /* The frame a cat is on. A save that points at a frame the story no longer has (the story was
   * edited) falls back to the last frame in its history that still exists, then the start. */
  E.frameId = function (cat, story) {
    if (cat.frame && story.frames[cat.frame]) return cat.frame;
    for (var i = cat.history.length - 1; i >= 0; i--) if (story.frames[cat.history[i]]) return cat.history[i];
    return story.start;
  };
  E.currentFrame = function (cat, story) { return story.frames[E.frameId(cat, story)]; };
  E.go = function (cat, story, to, now) {
    if (!to || !story.frames[to]) return false;
    var from = E.frameId(cat, story);
    cat.history.push(from);
    if (cat.history.length > E.HISTORY_CAP) cat.history.splice(0, cat.history.length - E.HISTORY_CAP);
    cat.frame = to;
    cat.chapter = story.id;
    if (story.frames[to].end && !cat.done) { cat.done = true; cat.doneAt = now || null; }
    if (now) cat.updated = now;
    return true;
  };
  E.next = function (cat, story, now) {
    var f = E.currentFrame(cat, story);
    var to = f && (f.next || (f.look && f.look.next));
    return E.go(cat, story, to, now);
  };
  E.choose = function (cat, story, index, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.choice || !f.choice.options || !f.choice.options[index]) return false;
    var opt = f.choice.options[index];
    if (isObj(opt.sets)) Object.keys(opt.sets).forEach(function (k) { cat.flags[k] = opt.sets[k]; });
    cat.choices[id] = { index: index, label: opt.label };
    return E.go(cat, story, opt.next, now);
  };
  /* Store what she typed (cleaned) and move on. For a dream, an empty value means skipped. */
  E.submitInput = function (cat, story, value, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.input) return false;
    var kind = f.input.kind;
    if (kind === 'petname') cat.petname = E.cleanPetName(value, f.input.suggestions && f.input.suggestions[0]);
    else if (kind === 'clanname') cat.name = E.cleanClanName(value, f.input.suggestions && f.input.suggestions[0]);
    else if (kind === 'dream') cat.dream = E.cleanDream(value);
    else if (kind) { cat.flags[kind] = E.cleanDream(value); }
    return E.go(cat, story, f.input.next, now);
  };
  E.confirmLook = function (cat, story, look, now) {
    var f = E.currentFrame(cat, story);
    if (!f || !f.look) return false;
    if (look) E.setLook(cat, look);
    cat.flags.looked = true;
    return E.go(cat, story, f.look.next, now);
  };
  E.finishCounts = function (cat, story, summary, now) {
    var f = E.currentFrame(cat, story);
    if (!f || !f.counts) return false;
    if (summary) cat.lessons[f.counts.set] = summary;
    cat.lesson = null;
    return E.go(cat, story, f.counts.next, now);
  };
  E.canBack = function (cat) { return !!(cat && cat.history && cat.history.length); };
  E.back = function (cat, story) {
    while (cat.history.length) {
      var prev = cat.history.pop();
      // a lesson in progress stays: coming forward again resumes it at the same question
      if (!story || story.frames[prev]) { cat.frame = prev; return true; }
    }
    return false;
  };
  /* Where to go from a frame, for graph checks and the storyboard. */
  E.exits = function (frame) {
    var k = E.kindOf(frame);
    if (k === 'next') return [frame.next];
    if (k === 'choice') return frame.choice.options.map(function (o) { return o.next; });
    if (k === 'input') return [frame.input.next];
    if (k === 'look') return [frame.look.next];
    if (k === 'counts') return [frame.counts.next];
    return [];
  };

  /* ------------------------------------------------------------ the Counts runner
   * A lesson is plain data, so it can be saved mid-lesson and resumed:
   *   state = { set, table, queue: [{a,b,retry,filler?,hard?}], pos, requeues: {"3x1": n}, log: [],
   *             lines, missed }
   * question(state) -> the fact to ask now, or null when the lesson is over.
   * answer(state, def, value, ms, now) -> what happened (and the state moves on).
   * A miss shows help, reveals the answer, and puts the fact back exactly two questions later, at
   * most twice per fact. Near the end of a lesson there may be fewer than two questions left, so
   * filler questions (facts she already got right in this lesson) are added first: the retry never
   * comes straight back. Nothing ever blocks: every answer moves the lesson forward. */
  function factKey(a, b) { return a + 'x' + b; }
  function pairKey(a, b) { return Math.min(a, b) + 'x' + Math.max(a, b); }   // 9×1 and 1×9 are one fact
  function groupsFor(a, b, table) {
    // the picture: `groups` cats each carrying `per` things (for the 1s, n cats, one tail each)
    if (table && b === table) return { groups: a, per: b };
    if (table && a === table) return { groups: b, per: a };
    return { groups: a, per: b };
  }
  var C = {};
  C.start = function (def, opts) {
    opts = opts || {};
    var facts = opts.facts || def.facts || [];
    return {
      set: opts.set || def.id || null,
      table: def.table || null,
      mode: opts.mode || 'chapter',
      // a fact is [a, b] or { a, b, hard } (the Hollow marks facts that were hard last time)
      queue: facts.map(function (f) {
        var item = Array.isArray(f) ? { a: +f[0], b: +f[1], retry: false } : { a: +f.a, b: +f.b, retry: false };
        if (!Array.isArray(f) && f.hard) item.hard = true;
        return item;
      }),
      pos: 0,
      requeues: {},
      log: [],
      lines: { praise: 0, fast: 0, again: 0, fastLast: false },
      missed: false,
      startedAt: opts.now || 0
    };
  };
  C.done = function (st) { return !st || st.pos >= st.queue.length; };
  C.question = function (st) {
    if (C.done(st)) return null;
    var q = st.queue[st.pos];
    var g = groupsFor(q.a, q.b, st.table);
    return {
      a: q.a, b: q.b, answer: q.a * q.b, retry: !!q.retry, filler: !!q.filler, hard: !!q.hard,
      number: st.pos + 1, total: st.queue.length,
      groups: g.groups, per: g.per
    };
  };
  C.ask = function (def, q) {
    return E.fill(def.ask || '{a} × {b}', null, { a: q.a, b: q.b });
  };
  /* Up to n facts to ask between a miss and its retry when the lesson is nearly over: facts she has
   * already answered right in this lesson, most recent first; failing that, any other fact from
   * the lesson's own list. Never the missed fact itself. */
  function fillers(st, q, n) {
    var miss = pairKey(q.a, q.b), out = [], taken = {};
    taken[miss] = true;
    function add(a, b) {
      var k = pairKey(a, b);
      if (out.length >= n || taken[k]) return;
      taken[k] = true;
      out.push({ a: a, b: b, retry: false, filler: true });
    }
    for (var i = st.log.length - 1; i >= 0 && out.length < n; i--) {
      var e = st.log[i];
      if (e.correct) add(e.a, e.b);
    }
    for (var j = 0; j < st.queue.length && out.length < n; j++) {
      var it = st.queue[j];
      if (!it.retry && !it.filler) add(it.a, it.b);
    }
    return out;
  }
  C.answer = function (st, def, value, ms, now) {
    if (C.done(st)) return null;
    def = def || {};
    var q = st.queue[st.pos];
    var right = q.a * q.b;
    var n = typeof value === 'number' ? value : parseInt(String(value == null ? '' : value).replace(/\D/g, ''), 10);
    var given = isNaN(n) ? null : n;
    var correct = given === right;
    ms = Math.max(0, Math.round(+ms || 0));
    var g = groupsFor(q.a, q.b, st.table);
    var entry = {
      set: st.set, a: q.a, b: q.b, answer: given, correct: correct, ms: ms,
      helped: !correct, retry: !!q.retry, at: now || 0
    };
    if (q.filler) entry.filler = true;
    // "after a miss" lines are true only once a miss has happened in this lesson
    var missedBefore = !!st.missed || st.log.some(function (e) { return !e.correct; });
    st.log.push(entry);
    var res = { correct: correct, right: right, fast: correct && ms < E.FAST_MS, entry: entry, requeued: false, line: '', lineKind: '' };
    var L = st.lines || (st.lines = { praise: 0, fast: 0, again: 0, fastLast: false });
    if (correct) {
      // after a miss in this lesson (and only then) the fastAfterMiss lines lead, taking turns with the fast ones
      var afterMiss = missedBefore && def.fastAfterMiss && def.fastAfterMiss.length ? asList(def.fastAfterMiss) : null;
      var fastLines = afterMiss ? afterMiss.concat(asList(def.fast)) : (def.fast && def.fast.length ? asList(def.fast) : null);
      if (q.retry) {
        res.line = pick(def.again || ['There it is. You remembered that one.', 'Yes! That one came back, and you knew it.'], L.again++);
        res.lineKind = 'again'; L.fastLast = false;
      } else if (q.hard) {
        // the Hollow remembers what was hard last time
        var ri = L.remembered || 0; L.remembered = ri + 1;
        res.line = E.fill(pick(def.remembered || 'Last time {a} × {b} made you stop and think. Not today!', ri), null, { a: q.a, b: q.b });
        res.lineKind = 'remembered'; L.fastLast = false;
      } else if (res.fast && fastLines && !L.fastLast) {
        var fi = afterMiss ? (L.fastAfter || 0) : L.fast;
        if (afterMiss) L.fastAfter = fi + 1; else L.fast++;
        res.line = pick(fastLines, fi); res.lineKind = 'fast'; L.fastLast = true;
      } else {
        res.line = pick(def.praise || ['Yes!'], L.praise++); res.lineKind = 'praise'; L.fastLast = false;
      }
    } else {
      L.fastLast = false;
      st.missed = true;
      res.lineKind = 'miss';
      res.help = { a: q.a, b: q.b, answer: right, groups: g.groups, per: g.per };
      var key = factKey(q.a, q.b);
      var used = st.requeues[key] || 0;
      if (used < E.MAX_REQUEUE) {
        st.requeues[key] = used + 1;
        // exactly REQUEUE_GAP questions between the miss and its retry: pad the end when it is near
        var left = st.queue.length - (st.pos + 1);
        if (left < E.REQUEUE_GAP) st.queue.push.apply(st.queue, fillers(st, q, E.REQUEUE_GAP - left));
        var at = Math.min(st.pos + 1 + E.REQUEUE_GAP, st.queue.length);
        st.queue.splice(at, 0, { a: q.a, b: q.b, retry: true });
        res.requeued = true;
      }
      // "we'll come back to that one" only when it really comes back
      res.line = res.requeued ? pick(def.miss || 'There. We\'ll come back to that one.', 0)
        : pick(def.missLast || 'There. Now you’ve seen it counted.', 0);
    }
    st.pos++;
    res.done = C.done(st);
    return res;
  };
  C.summary = function (st) {
    var log = st.log;
    var seen = {}, firstRight = 0, facts = 0;
    log.forEach(function (e) {
      var k = factKey(e.a, e.b);
      if (!seen[k]) { seen[k] = true; facts++; if (e.correct) firstRight++; }
    });
    var helped = log.filter(function (e) { return e.helped; }).length;
    return {
      set: st.set, mode: st.mode,
      answers: log.length,
      correct: log.filter(function (e) { return e.correct; }).length,
      fast: log.filter(function (e) { return e.correct && e.ms < E.FAST_MS; }).length,
      facts: facts, firstTry: firstRight, helped: helped, noHelp: helped === 0,
      finished: C.done(st)
    };
  };
  E.counts = C;
  /* A finished lesson goes on the cat the moment its last answer is in, not after the praise
   * pause, so a page closed in that gap loses nothing. Chapter: the summary under its set id.
   * Hollow: the round counts (E.hollowFinish, exactly once). Returns { mode, summary, hollow }. */
  E.recordLesson = function (cat, st) {
    if (!st || !C.done(st)) return null;
    if (st.mode === 'hollow') {
      var h = E.hollowFinish(cat, st);
      return { mode: 'hollow', summary: h.summary, hollow: h };
    }
    var sum = C.summary(st);
    if (st.set) cat.lessons[st.set] = sum;
    cat.lesson = null;
    return { mode: st.mode || 'chapter', summary: sum, hollow: null };
  };
  /* A saved lesson whose last answer is in but which was never recorded (an older save, or a
   * page closed at just the wrong moment): record it now. Returns what recordLesson returns, or
   * null when there is nothing to settle. */
  E.settleLesson = function (cat) {
    var L = cat && cat.lesson;
    if (!L || !L.state || !C.done(L.state)) return null;
    if (!L.state.mode && L.mode) L.state.mode = L.mode;
    return E.recordLesson(cat, L.state);
  };
  /* Log a lesson's answer on the cat (capped), so the grown-ups corner sees it. */
  E.logAnswer = function (cat, entry) {
    cat.counts.push(entry);
    if (cat.counts.length > E.LOG_CAP) cat.counts.splice(0, cat.counts.length - E.LOG_CAP);
  };
  /* Per-fact table for grown-ups: attempts, right first time (per lesson), helped, median ms. */
  E.factTable = function (log) {
    var rows = {}, order = [];
    (log || []).forEach(function (e) {
      var k = factKey(e.a, e.b);
      if (!rows[k]) { rows[k] = { a: e.a, b: e.b, attempts: 0, firstAsks: 0, rightFirst: 0, helped: 0, times: [] }; order.push(k); }
      var r = rows[k];
      r.attempts++;
      if (e.helped) r.helped++;
      if (e.correct && typeof e.ms === 'number') r.times.push(e.ms);
      if (!e.retry && !e.filler) { r.firstAsks++; if (e.correct) r.rightFirst++; }
    });
    return order.map(function (k) {
      var r = rows[k];
      return { a: r.a, b: r.b, attempts: r.attempts, firstAsks: r.firstAsks, rightFirst: r.rightFirst, helped: r.helped, medianMs: median(r.times) };
    }).sort(function (x, y) {
      var ax = Math.max(x.a, x.b), ay = Math.max(y.a, y.b);
      return ax - ay || x.a - y.a;
    });
  };

  /* ------------------------------------------------------------ the book */
  /* A recap line shows when every key in `when` matches: flags first, then the look (sex, fur
   * ...), then the cat's own fields. A value may be a list (any of). No `when` = always. */
  E.matches = function (when, cat) {
    if (!when) return true;
    if (!isObj(when)) return true;
    return Object.keys(when).every(function (k) {
      var want = when[k], have;
      if (cat.flags && own(cat.flags, k)) have = cat.flags[k];
      else if (cat.look && own(cat.look, k)) have = cat.look[k];
      else if (own(cat, k) && k !== 'flags' && k !== 'look') have = cat[k];
      if (Array.isArray(want)) return want.indexOf(have) !== -1;
      if (want === true) return have === true;
      if (want === false) return have === false || have == null || have === '';
      return have === want;
    });
  };
  /* The dream as the book prints it (cat.dream itself is kept as typed): a capital first letter,
   * "i" and "i'm" as "I" and "I'm", and a full stop unless it already ends a sentence. */
  E.tidyDream = function (raw) {
    var s = E.cleanDream(raw);
    if (!s) return s;
    s = s.replace(/(^|[^\p{L}\p{N}'’])i(?=$|[^\p{L}\p{N}])/gu, '$1I');
    s = s.charAt(0).toUpperCase() + s.slice(1);
    if (!/[.!?…"”’'»]$/.test(s)) s += '.';
    return s;
  };
  E.buildBook = function (story, cat) {
    var book = (story && story.book) || {};
    var recap = (book.recap || []).filter(function (r) {
      return r && typeof r.text === 'string' && E.matches(r.when, cat);
    }).map(function (r) { return E.fill(r.text, cat); });
    var dream = cat.dream ? E.fill(book.dream || '{name}paw’s dream: “{dream}”', cat, { dream: E.tidyDream(cat.dream) })
      : (book.noDream ? E.fill(book.noDream, cat) : '');
    return {
      title: E.fill(book.title || '{name}paw’s First Moon', cat),
      chapter: E.fill(book.chapter || ('Chapter ' + (story.number || 1) + ': ' + (story.title || '')), cat),
      recap: recap,
      dream: dream,
      dreamText: cat.dream || ''
    };
  };

  /* ------------------------------------------------------------ the Training Hollow */
  E.TREASURES = [
    { id: 'moss', name: 'A pillow of soft green moss' },
    { id: 'feather', name: 'A blue jay feather' },
    { id: 'shell', name: 'A tiny river shell' },
    { id: 'pebble', name: 'A shiny striped pebble' },
    { id: 'acorn', name: 'An acorn in its little hat' },
    { id: 'snail', name: 'A swirly snail shell (nobody home)' },
    { id: 'eggshell', name: 'A sky-blue robin’s eggshell' },
    { id: 'glass', name: 'A piece of river glass, smooth as soap' },
    { id: 'clover', name: 'A four-leaf clover' },
    { id: 'dandelion', name: 'A dandelion puff (don’t sneeze!)' },
    { id: 'leaf', name: 'A bright red leaf from leaf-drop' },
    { id: 'pinecone', name: 'A tiny pinecone' },
    { id: 'marble', name: 'A Tallwalker marble with a swirl inside' },
    { id: 'button', name: 'A lost Tallwalker button, very shiny' }
  ];
  E.treasure = function (id) {
    for (var i = 0; i < E.TREASURES.length; i++) if (E.TREASURES[i].id === id) return E.TREASURES[i];
    return null;
  };
  /* One round: the ten facts of a table (n × table, both orders mixed), shuffled the same way
   * every time for the same round number. */
  E.hollowFacts = function (round, table) {
    table = table || 1;
    var rnd = mulberry32(((round | 0) + 1) * 2654435761 ^ (table * 40503));
    var facts = [];
    for (var n = 1; n <= 10; n++) facts.push(rnd() < 0.5 ? [n, table] : [table, n]);
    for (var i = facts.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1)), t = facts[i]; facts[i] = facts[j]; facts[j] = t;
    }
    return facts;
  };
  /* The lesson definition for a Hollow round: the chapter's own Count (lines and pictures),
   * with the round's facts and the Hollow's ending. */
  E.hollowDef = function (story, table) {
    table = table || 1;
    var base = null;
    var sets = (story && story.counts) || {};
    Object.keys(sets).forEach(function (k) { if (!base && sets[k] && sets[k].table === table) base = sets[k]; });
    var def = clone(base || { table: table, thing: 'tail', things: 'tails', teacher: 'tallyheart', ask: '{a} × {b}', praise: ['Yes!'], fast: [], miss: 'There. We\'ll come back to that one.' });
    def.id = 'hollow-' + table + 's';
    def.done = 'A full round! That deserves a treasure for your nest.';
    delete def.firstPrompt;   // the chapter's first question is about the three cats in f061
    return def;
  };
  /* The facts of a table that were hard last time: the most recent first ask of each (not a retry,
   * not a filler) in the cat's Counts log was wrong, or right but not fast. 9×1 and 1×9 are one
   * fact. Returns [[a, b]] as last asked, the misses first, then the slowest. */
  E.hardFacts = function (cat, table) {
    table = table || 1;
    var mine = {};
    for (var n = 1; n <= 10; n++) mine[pairKey(n, table)] = true;
    var last = {};
    (cat && cat.counts || []).forEach(function (e, i) {
      if (!e || e.retry || e.filler) return;
      var k = pairKey(e.a, e.b);
      if (mine[k]) last[k] = { e: e, i: i };
    });
    return Object.keys(last).map(function (k) { return last[k]; }).filter(function (x) {
      return !x.e.correct || !(typeof x.e.ms === 'number' && x.e.ms < E.FAST_MS);
    }).sort(function (x, y) {
      return (x.e.correct ? 1 : 0) - (y.e.correct ? 1 : 0) || (y.e.ms || 0) - (x.e.ms || 0) || y.i - x.i;
    }).map(function (x) { return [x.e.a, x.e.b]; });
  };
  E.HARD_PER_ROUND = 3;
  E.hollowStart = function (cat, story, now, table) {
    var round = (cat.hollow.rounds || 0) + 1;
    var def = E.hollowDef(story, table);
    var facts = E.hollowFacts(round, table);
    // up to three facts that were hard last time come early (positions 1-3, in this round's own
    // order of a and b); the first question stays an easy one
    var hard = {};
    E.hardFacts(cat, table).slice(0, E.HARD_PER_ROUND).forEach(function (f) { hard[pairKey(f[0], f[1])] = true; });
    var easy = facts.filter(function (f) { return !hard[pairKey(f[0], f[1])]; });
    var early = facts.filter(function (f) { return hard[pairKey(f[0], f[1])]; }).map(function (f) { return { a: f[0], b: f[1], hard: true }; });
    if (early.length && easy.length) facts = [easy[0]].concat(early, easy.slice(1));
    var st = C.start(def, { facts: facts, set: def.id, mode: 'hollow', now: now });
    st.round = round;
    return { def: def, state: st };
  };
  /* A finished round earns the next treasure. Returns what changed. */
  E.hollowFinish = function (cat, state) {
    var sum = C.summary(state);
    if (!sum.finished) return { awarded: null, summary: sum, glowNow: false };
    var h = cat.hollow;
    h.rounds = (h.rounds || 0) + 1;
    if (sum.noHelp) h.cleanRounds = (h.cleanRounds || 0) + 1;
    var t = E.TREASURES[(h.rounds - 1) % E.TREASURES.length];
    cat.nest.push(t.id);
    var wasGlow = !!h.glow;
    h.glow = h.cleanRounds >= E.GLOW_ROUNDS;
    cat.lesson = null;
    return { awarded: t, summary: sum, glowNow: h.glow && !wasGlow, rounds: h.rounds };
  };
  /* The nest, grouped: [{ treasure, count }] in the order first found. */
  E.nestItems = function (cat) {
    var seen = {}, out = [];
    (cat.nest || []).forEach(function (id) {
      if (seen[id]) { seen[id].count++; return; }
      var t = E.treasure(id) || { id: id, name: id };
      seen[id] = { treasure: t, count: 1 };
      out.push(seen[id]);
    });
    return out;
  };

  /* ------------------------------------------------------------ story checks */
  /* Problems with a story's frame graph, as strings (empty = fine). Used by tests and the UI's
   * debug hook. */
  E.checkStory = function (story) {
    var errs = [];
    if (!story || !story.frames) return ['no frames'];
    if (!story.frames[story.start]) errs.push('start frame missing: ' + story.start);
    Object.keys(story.frames).forEach(function (id) {
      var f = story.frames[id];
      var kinds = ['next', 'choice', 'input', 'look', 'counts', 'end'].filter(function (k) { return f[k]; });
      if (kinds.length !== 1) errs.push(id + ': needs exactly one of next/choice/input/look/counts/end, has ' + (kinds.join(',') || 'none'));
      E.exits(f).forEach(function (to) { if (!story.frames[to]) errs.push(id + ' -> missing ' + to); });
      if (f.counts && !(story.counts && story.counts[f.counts.set])) errs.push(id + ': unknown counts set ' + f.counts.set);
    });
    return errs;
  };

  PC.engine = E;
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
