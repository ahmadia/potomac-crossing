/* Potomac Crossing: the engine.
 *
 * Pure logic, no DOM. Loads in Node (module.exports = PC) and in the browser (window.PC.engine).
 * The UI owns drawing; the engine owns state: the cats on this device, tokens, the chapters and
 * the flow through each one's frames (her place in each chapter kept apart), input cleaning, lines that show only `when` they match, the
 * Counts lesson runner, the skip-count, gifts, the book, the Training Hollow (one claw mark per
 * Count), and saving to localStorage under one key, 'potomac-crossing.v1' (save version 2 since
 * chapter 2; E.migrate brings a version-1 save forward without losing anything). Chapter 3 adds
 * frames shown only `when` they match, the words the page says around a question (E.promptLines,
 * E.helpPlan: who counts, on which ground), borrowed questions in the borrower's voice, the adaptive
 * warm-up's ordered alt and `avoid`, reading time in E.hardFacts, and the book's dragonet pages
 * (docs/build.md, "Chapter 3 (v0.4)").
 *
 * Functions that change a cat change the object they are given (and return it or a result).
 * Nothing here reads the clock on its own: callers pass `now` (ms since epoch) where it matters,
 * so the tests are deterministic. Where a function needs the chapters, it takes them as its last
 * argument (one story, a list, or a map like PC.story); without it, it uses PC.story.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var E = {};

  E.VERSION = '0.3.0 (chapter 3, 2026-10-06)';
  E.STORAGE_KEY = 'potomac-crossing.v1';   // the key stays: renaming it would strand every save
  E.SAVE_VERSION = 2;
  E.MAX_CATS = 4;
  E.FAST_MS = 4000;          // an answer under this earns a "didn't even have to count" line
  E.REQUEUE_GAP = 2;         // a missed fact comes back two questions later
  E.MAX_REQUEUE = 2;         // ...at most twice per fact per lesson
  E.HISTORY_CAP = 500;
  E.LOG_CAP = 2000;          // counts answers kept per cat
  E.CLAN_MAX = 14;
  E.PET_MAX = 24;
  E.DREAM_MAX = 200;
  E.GLOW_ROUNDS = 3;         // Training Hollow rounds of one Count without help before its claw mark glows
  E.MAX_MARKS = 10;          // claw marks on the tree: one per Count, the 1s to the 10s (every table to 10 × 10)
  E.DRAGONETS = 7;           // the clutch: a page in her book for each, a silhouette until she finds it

  /* ------------------------------------------------------------ helpers */
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function isObj(o) { return o !== null && typeof o === 'object' && !Array.isArray(o); }
  function own(o, k) { return o != null && Object.prototype.hasOwnProperty.call(o, k); }
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
  function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }
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
      { id: 'tortie', label: 'Tortoise­shell', swatch: ['#3f3330', '#da853b', '#ecb877'], patches: true },
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
    // the tortoiseshell denmate (chapter 3): Murmurpaw, then Murmurchime; Mutterpaw and Mutterchime
    // for a player whose own Clan name is Murmur ("{murmur}ing", "{murmur}ed" read right either way)
    var murmur = E.tortieWord(cat);
    var t = {
      name: name, petname: pet, dream: E.dreamOf(cat, cat.chapter),
      they: p.they, them: p.them, their: p.their, shecat: p.shecat,
      They: cap1(p.they), Them: cap1(p.them), Their: cap1(p.their), Shecat: cap1(p.shecat),
      THEY: p.they.toUpperCase(), THEM: p.them.toUpperCase(), THEIR: p.their.toUpperCase(),
      SHECAT: p.shecat.toUpperCase(), NAME: name.toUpperCase(), PETNAME: pet.toUpperCase(),
      Murmur: cap1(murmur), murmur: murmur, MURMUR: murmur.toUpperCase()
    };
    return t;
  };
  /* "murmur", or "mutter" when her own Clan name is Murmur, so the tortie never shares her name. */
  E.tortieWord = function (cat) {
    return cat && typeof cat.name === 'string' && cat.name.toLowerCase() === 'murmur' ? 'mutter' : 'murmur';
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
  /* Only a question's own tokens ({a} {b} {answer}); the cat's are filled later, by the UI. */
  function fillFact(text, q) {
    return String(text == null ? '' : text).replace(/\{(a|b|answer)\}/g, function (m, k) {
      return String(k === 'answer' ? q.a * q.b : q[k]);
    });
  }

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

  /* ------------------------------------------------------------ chapters
   * Each chapter is one story file (app/story/chNN.js) defining PC.story.chNN. They are read in
   * the order of their `number`; chapter n+1 opens once chapter n is finished. */
  function storyList(x) {
    if (x && x.frames) return [x];
    if (Array.isArray(x)) return x.filter(function (s) { return s && s.frames; });
    var src = x || PC.story || {};
    return Object.keys(src).map(function (k) { return src[k]; }).filter(function (s) { return s && s.frames; });
  }
  E.chapters = function (stories) {
    return storyList(stories).map(function (s, i) { return { s: s, i: i }; }).sort(function (x, y) {
      return num(x.s.number, 0) - num(y.s.number, 0) || x.i - y.i;
    }).map(function (x) { return x.s; });
  };
  E.chapter = function (id, stories) {
    var list = storyList(stories);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };
  E.firstChapter = function (stories) { return E.chapters(stories)[0] || null; };
  /* The chapter after this one, if it is built. */
  E.nextChapter = function (story, stories) {
    var list = E.chapters(stories);
    for (var i = 0; i < list.length; i++) if (list[i].id === story.id) return list[i + 1] || null;
    return null;
  };
  E.chapterHeading = function (story) { return 'Chapter ' + (story.number || 1) + ': ' + (story.title || ''); };
  E.isFinished = function (cat, id) { return !!(cat && isObj(cat.finished) && cat.finished[id]); };
  E.hasFinished = function (cat) {
    return !!(cat && isObj(cat.finished) && Object.keys(cat.finished).some(function (k) { return cat.finished[k]; }));
  };
  /* A chapter is open when it is the first, when the one before it is finished, or when it was
   * finished itself (read again). */
  E.isOpen = function (cat, story, stories) {
    var list = E.chapters(stories);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id !== story.id) continue;
      return i === 0 || E.isFinished(cat, list[i - 1].id) || E.isFinished(cat, story.id);
    }
    return false;
  };
  /* The chapter a cat reads next: the first, in order, that she has not finished, while it is
   * open. Null when every built chapter is finished. */
  E.upNext = function (cat, stories) {
    var list = E.chapters(stories);
    for (var i = 0; i < list.length; i++) {
      if (E.isFinished(cat, list[i].id)) continue;
      return E.isOpen(cat, list[i], list) ? list[i] : null;
    }
    return null;
  };
  /* The "coming soon" after a chapter: its teaser, filled, with `built` true when the next
   * chapter exists after all (then the hub offers that chapter instead). */
  E.teaser = function (story, cat, stories) {
    if (!story) return null;
    var next = E.nextChapter(story, stories);
    var t = isObj(story.teaser) ? story.teaser : null;
    if (!t && !next) return null;
    return {
      title: E.fill(t && t.title ? t.title : E.chapterHeading(next), cat),
      lines: asList(t && t.lines).map(function (l) { return E.fill(l, cat); }),
      built: !!next, next: next ? next.id : null
    };
  };
  /* Where a cat is in the chapters: the hub's buttons, the cards on "Who's playing?", the title. */
  E.progress = function (cat, stories) {
    var list = E.chapters(stories);
    var finished = list.filter(function (s) { return E.isFinished(cat, s.id); });
    var reading = cat && E.chapter(cat.chapter, list);
    var atEnd = !!(reading && E.kindOf(E.currentFrame(cat, reading)) === 'end');
    var next = E.upNext(cat, list);
    var latest = finished.length ? finished[finished.length - 1] : null;
    var teaser = latest ? E.teaser(latest, cat, list) : null;
    // her place in the next chapter: the one she is reading, or one parked while she reads another
    var np = next ? E.place(cat, next.id) : null;
    return {
      chapters: list, finished: finished, latest: latest, reading: reading, atEnd: atEnd,
      page: reading ? (cat.history || []).length + 1 : 0,
      next: next,
      // she is partway through the next chapter: its button resumes, it doesn't start over
      nextInProgress: !!(np && (np.history.length || np.frame !== next.start || np.lesson)),
      nextPage: np ? np.history.length + 1 : 0,
      soon: !next && teaser && !teaser.built ? teaser : null
    };
  };
  /* "Chapter 2 · page 7", "Chapter 2 finished", or "Just starting". */
  E.status = function (cat, stories) {
    if (!cat) return '';
    var p = E.progress(cat, stories);
    if (!p.reading) return p.latest ? 'Chapter ' + (p.latest.number || 1) + ' finished' : 'Just starting';
    var n = p.reading.number || 1;
    if (p.atEnd && E.isFinished(cat, p.reading.id)) return 'Chapter ' + n + ' finished';
    if (!(cat.history && cat.history.length) && !p.finished.length) return 'Just starting';
    return 'Chapter ' + n + ' · page ' + p.page;
  };

  /* ------------------------------------------------------------ saves and cats
   * Save version 2 (the stored object carries `version: 2`). Per cat: `chapter`, `frame` and
   * `history` are the chapter being read, its frame and that chapter's back-history, and `lesson`
   * a lesson in progress (that chapter's, or a Training Hollow round), and `hollowWaiting` a Hollow
   * round in progress that gave way to a chapter lesson (E.hollowRound); `places` keeps every other
   * chapter she is partway through, by chapter id: { frame, history, lesson } (see "places" below);
   * `finished` maps a chapter id to when its end frame was first reached; `dreams` maps a chapter
   * id to her dream as typed; `flags` and `choices` are one object for all chapters (a choice is
   * keyed "chapter:frame"); `lessons` holds finished lessons by set id; `hollow` counts every round
   * and keeps each Count's rounds and glow in `byTable`; `nest` holds treasure and gift ids. */
  E.newSave = function () {
    return { version: E.SAVE_VERSION, cats: [], current: null, settings: { readAloud: false, bigText: false } };
  };
  var idSeq = 0;
  function newId(now) {
    idSeq = (idSeq + 1) % 1000;
    return 'c' + Math.floor(now || 0).toString(36) + idSeq.toString(36) + Math.floor(Math.random() * 1296).toString(36);
  }
  function blankHollow() { return { rounds: 0, byTable: {} }; }
  function blankTable() { return { rounds: 0, cleanRounds: 0, glow: false }; }
  E.blankCat = function (opts) {
    opts = opts || {};
    var now = opts.now || 0;
    return {
      id: opts.id || newId(now),
      created: now, updated: now,
      look: opts.look ? clone(opts.look) : E.defaultLook(opts.index || 0),
      petname: '', name: '',
      flags: {}, choices: {},
      chapter: null, frame: null, history: [],
      places: {},            // chapter id -> { frame, history, lesson }: her place in a chapter she isn't reading now
      finished: {},          // chapter id -> when its end frame was first reached
      dreams: {},            // chapter id -> her dream, as typed ('' = skipped)
      counts: [],            // every Counts answer: {set, a, b, answer, correct, ms, helped, retry, at}
      lessons: {},           // finished lessons by set id: summary
      lesson: null,          // a lesson in progress: { mode, frame, state }
      hollowWaiting: null,   // a Training Hollow round in progress that gave way to a chapter lesson: { mode: 'hollow', state }
      nest: [],              // treasure and gift ids, in the order found
      hollow: blankHollow()  // { rounds, byTable: { '1': { rounds, cleanRounds, glow } } }
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

  /* A version-1 cat (chapter 1 only) in the version-2 shape. Nothing is lost: `done`/`doneAt`
   * become finished.ch01, `dream` becomes dreams.ch01 ('' when a finished chapter 1 skipped it),
   * the one Hollow record becomes the 1s', and
   * a choice keyed by its frame id ("f031") is keyed "ch01:f031". */
  function isV1Cat(c) {
    if (isObj(c.finished) || isObj(c.dreams)) return false;
    return !(isObj(c.hollow) && isObj(c.hollow.byTable));
  }
  function fromV1(c) {
    var out = {};
    Object.keys(c).forEach(function (k) {
      if (k !== 'done' && k !== 'doneAt' && k !== 'dream' && k !== 'hollow' && k !== 'choices') out[k] = c[k];
    });
    out.finished = {};
    if (c.done === true) out.finished.ch01 = (typeof c.doneAt === 'number' && c.doneAt) || 1;
    out.dreams = {};
    // a finished chapter 1 went past the dream frame: an empty dream there was skipped
    if (typeof c.dream === 'string' && (c.dream || out.finished.ch01)) out.dreams.ch01 = c.dream;
    var h = isObj(c.hollow) ? c.hollow : {};
    out.hollow = {
      rounds: num(h.rounds, 0),
      byTable: { '1': { rounds: num(h.rounds, 0), cleanRounds: num(h.cleanRounds, 0), glow: !!h.glow } }
    };
    out.choices = {};
    if (isObj(c.choices)) Object.keys(c.choices).forEach(function (k) { out.choices[k.indexOf(':') >= 0 ? k : 'ch01:' + k] = c.choices[k]; });
    return out;
  }
  /* A saved lesson the runner can take up: { mode?, frame?, chapter?, state } whose state has a
   * queue of facts (finite a and b), a whole-number pos inside it, a log list and a requeues
   * object. Anything else (a hand-edited or half-written save) is dropped, so E.lessonAt,
   * E.counts.done and the keypad never meet it; the Count is simply started again. */
  function okNum(v) { return typeof v === 'number' && isFinite(v); }
  function okLesson(L) {
    if (!isObj(L) || !isObj(L.state)) return false;
    if (L.mode != null && L.mode !== 'chapter' && L.mode !== 'hollow') return false;
    if (L.frame != null && typeof L.frame !== 'string' && typeof L.frame !== 'number') return false;
    if (L.chapter != null && typeof L.chapter !== 'string') return false;
    var st = L.state;
    if (!Array.isArray(st.queue) || !st.queue.every(function (q) { return isObj(q) && okNum(q.a) && okNum(q.b); })) return false;
    if (!okNum(st.pos) || st.pos !== Math.floor(st.pos) || st.pos < 0 || st.pos > st.queue.length) return false;
    if (!Array.isArray(st.log) || !st.log.every(isObj) || !isObj(st.requeues)) return false;
    if (st.lines != null && !isObj(st.lines)) return false;
    if ((st.pool != null && !Array.isArray(st.pool)) || (st.asked != null && !Array.isArray(st.asked))) return false;
    if (st.avoid != null && !Array.isArray(st.avoid)) return false;
    return true;
  }
  E.okLesson = okLesson;
  function normCat(c, i) {
    if (isV1Cat(c)) c = fromV1(c);
    var b = E.blankCat({ id: typeof c.id === 'string' && c.id ? c.id : undefined, index: i });
    var out = b;
    Object.keys(b).forEach(function (k) {
      if (!own(c, k)) return;
      var v = c[k];
      if (Array.isArray(b[k])) { if (Array.isArray(v)) out[k] = v; }
      else if (isObj(b[k])) { if (isObj(v)) out[k] = v; }
      else if (k === 'lesson') { out[k] = okLesson(v) ? v : null; }
      else if (k === 'hollowWaiting') { out[k] = okLesson(v) && v.mode === 'hollow' ? v : null; }
      else if (k === 'chapter' || k === 'frame') { out[k] = (typeof v === 'string' || typeof v === 'number') ? v : null; }
      else if (typeof v === typeof b[k]) out[k] = v;
    });
    var look = E.defaultLook(i);
    E.LOOK_KEYS.forEach(function (k) { if (out.look && typeof out.look[k] === 'string') look[k] = out.look[k]; });
    out.look = look;
    var h = isObj(out.hollow) ? out.hollow : {};
    out.hollow = { rounds: num(h.rounds, 0), byTable: {} };
    if (isObj(h.byTable)) Object.keys(h.byTable).forEach(function (t) {
      var r = h.byTable[t];
      if (!isObj(r)) return;
      out.hollow.byTable[t] = { rounds: num(r.rounds, 0), cleanRounds: num(r.cleanRounds, 0), glow: !!r.glow };
    });
    Object.keys(out.finished).forEach(function (k) { if (!out.finished[k]) delete out.finished[k]; });
    Object.keys(out.dreams).forEach(function (k) { if (typeof out.dreams[k] !== 'string') delete out.dreams[k]; });
    // places (none in a version-1 save, or a version-2 save from before them): { frame, history,
    // lesson } each; a place with no frame is a chapter lesson waiting for its frame (E.lessonAt)
    var pl = out.places;
    out.places = {};
    Object.keys(pl).forEach(function (id) {
      var p = pl[id];
      if (!isObj(p)) return;
      var frame = typeof p.frame === 'string' || typeof p.frame === 'number' ? p.frame : null;
      var lesson = okLesson(p.lesson) ? p.lesson : null;
      if (frame == null && !lesson) return;
      out.places[id] = { frame: frame, history: frame != null && Array.isArray(p.history) ? p.history : [], lesson: lesson };
    });
    return out;
  }
  /* Bring any stored value up to the current save shape: version 1 (chapter 1's) or 2. Lossless
   * for a version-1 save, idempotent, and never throws. */
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

  /* ------------------------------------------------------------ gifts and treasures */
  E.TREASURES = [
    { id: 'moss', name: 'A pillow of soft green moss' },
    { id: 'feather', name: 'A blue jay feather' },
    { id: 'shell', name: 'A tiny river shell' },
    { id: 'pebble', name: 'A shiny speckled pebble' },   // speckled: Riffle’s lucky stone is the striped one
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
  /* Gifts come from the story (a frame's `gift`), once each; My nest shows them first. */
  E.GIFTS = [
    { id: 'riffle-stone', name: 'Riffle’s lucky stone: dark and smooth, with a white stripe all the way around', from: 'Riffle' }
  ];
  E.gift = function (id) {
    for (var i = 0; i < E.GIFTS.length; i++) if (E.GIFTS[i].id === id) return E.GIFTS[i];
    return null;
  };
  E.treasure = function (id) {
    for (var i = 0; i < E.TREASURES.length; i++) if (E.TREASURES[i].id === id) return E.TREASURES[i];
    return E.gift(id);
  };
  /* Put a gift in her nest, once. Returns true when it is new. */
  E.giveGift = function (cat, id) {
    if (!id || !cat) return false;
    if (!Array.isArray(cat.nest)) cat.nest = [];
    if (cat.nest.indexOf(id) >= 0) return false;
    cat.nest.push(id);
    return true;
  };
  /* The nest, grouped: [{ treasure, count, gift }] in the order first found. */
  E.nestItems = function (cat) {
    var seen = {}, out = [];
    (cat.nest || []).forEach(function (id) {
      if (seen[id]) { seen[id].count++; return; }
      var g = E.gift(id);
      var t = E.treasure(id) || { id: id, name: id };
      seen[id] = { treasure: t, count: 1, gift: !!g };
      out.push(seen[id]);
    });
    return out;
  };
  /* For My nest: the gifts from friends first, then the treasures. */
  E.nestGroups = function (cat) {
    var all = E.nestItems(cat);
    return { gifts: all.filter(function (x) { return x.gift; }), treasures: all.filter(function (x) { return !x.gift; }) };
  };

  /* ------------------------------------------------------------ lines that show `when` they match
   * A book recap line, a caption, a balloon or a choice option shows when every key in its `when`
   * matches: a flag first, then the look (sex, fur ...), then the cat's own fields. A value may be
   * a list (any of). Two lesson keys: `lessonClean: 'ch02-tails'` (that lesson finished with no
   * help) and `firstTry: '10x2'` (her most recent first ask of that fact, in either order, was
   * right without help). `not: { … }` matches when what it holds does not. No `when` = always. */
  function anyOf(want, fn) { return asList(want).some(function (w) { return fn(w); }); }
  E.lessonClean = function (cat, setId) {
    var L = cat && cat.lessons && cat.lessons[setId];
    return !!(L && L.noHelp && L.finished !== false);
  };
  E.firstTry = function (cat, key) {
    var m = /^(\d+)\s*[x×*]\s*(\d+)$/.exec(String(key == null ? '' : key).trim());
    if (!m) return false;
    var k = pairKey(+m[1], +m[2]), log = (cat && cat.counts) || [];
    for (var i = log.length - 1; i >= 0; i--) {
      var e = log[i];
      if (!e || e.retry || e.filler || pairKey(e.a, e.b) !== k) continue;
      return !!e.correct && !e.helped;
    }
    return false;
  };
  E.matches = function (when, cat) {
    if (!when) return true;
    if (!isObj(when)) return true;
    cat = cat || {};
    return Object.keys(when).every(function (k) {
      var want = when[k], have;
      if (k === 'not') return isObj(want) ? !E.matches(want, cat) : true;
      if (k === 'lessonClean') return anyOf(want, function (s) { return E.lessonClean(cat, s); });
      if (k === 'firstTry') return anyOf(want, function (f) { return E.firstTry(cat, f); });
      if (cat.flags && own(cat.flags, k)) have = cat.flags[k];
      else if (cat.look && own(cat.look, k)) have = cat.look[k];
      else if (own(cat, k) && k !== 'flags' && k !== 'look') have = cat[k];
      if (Array.isArray(want)) return want.indexOf(have) !== -1;
      if (want === true) return have === true;
      if (want === false) return have === false || have == null || have === '';
      return have === want;
    });
  };
  /* A frame's captions as she sees them (raw text, tokens unfilled): a caption is a string or
   * { when, text }. */
  E.captions = function (frame, cat) {
    return asList(frame && frame.caption).map(function (c) {
      if (typeof c === 'string') return c;
      if (isObj(c) && typeof c.text === 'string' && E.matches(c.when, cat)) return c.text;
      return null;
    }).filter(function (c) { return c; });
  };
  /* A frame's balloons as she sees them: [{ who, text, kind, … }]. `nth` is the speaker's place
   * among all of that speaker's balloons (hidden ones included), so a balloon keeps its cast
   * member however many before it are hidden. */
  E.balloons = function (frame, cat) {
    var nth = {}, out = [];
    asList(frame && frame.say).forEach(function (s) {
      if (typeof s === 'string') s = { text: s };
      if (!isObj(s)) return;
      var who = s.who || '';
      var k = nth[who] = nth[who] == null ? 0 : nth[who] + 1;
      if (!E.matches(s.when, cat)) return;
      var b = {};
      Object.keys(s).forEach(function (x) { if (x !== 'when') b[x] = s[x]; });
      b.who = who; b.nth = k;
      out.push(b);
    });
    return out;
  };
  /* A choice's options as she sees them: [{ option, index }] (index into choice.options). An
   * option with a `when` that doesn't match is hidden; a choice keeps at least one option. */
  E.options = function (frame, cat) {
    var opts = (frame && frame.choice && frame.choice.options) || [];
    var out = [];
    opts.forEach(function (o, i) { if (o && E.matches(o.when, cat)) out.push({ option: o, index: i }); });
    if (!out.length && opts.length) out.push({ option: opts[0], index: 0 });
    return out;
  };

  /* ------------------------------------------------------------ flow */
  E.KINDS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'end'];
  E.kindOf = function (frame) {
    if (!frame) return null;
    if (frame.end) return 'end';
    if (frame.choice) return 'choice';
    if (frame.input) return 'input';
    if (frame.look) return 'look';
    if (frame.counts) return 'counts';
    if (frame.skip) return 'skip';
    if (frame.next) return 'next';
    return 'end';
  };
  /* A frame may carry `when` (matched as lines are: E.matches). A frame whose `when` doesn't match
   * is skipped, forward and back, as if its `next` led straight on (chapter 3's river-path screen). */
  E.shows = function (frame, cat) { return !!frame && (!frame.when || E.matches(frame.when, cat)); };
  /* Where a page turn to `to` lands for her: `to`, or the first frame after it that shows. */
  E.landing = function (cat, story, to) {
    for (var guard = 0; guard < 64 && to && story.frames[to] && !E.shows(story.frames[to], cat); guard++) to = E.exits(story.frames[to])[0];
    return to;
  };
  /* Arriving on a frame: an end frame finishes its chapter (the first time); a gift frame puts its
   * gift in her nest (once; Back never takes it away). */
  function arrive(cat, story, id, now) {
    var f = story.frames[id];
    if (!f) return;
    if (f.end && !E.isFinished(cat, story.id)) {
      if (!isObj(cat.finished)) cat.finished = {};
      cat.finished[story.id] = now || 1;
    }
    if (f.gift) E.giveGift(cat, f.gift);
  }
  /* ------------------------------------------------------------ places: one reading position per chapter
   * The chapter she is reading keeps its place on the cat itself (`chapter`, `frame`, `history`,
   * and its lesson in progress in `lesson`). Every other chapter she is partway through waits in
   * `places`, by chapter id: { frame, history, lesson }. Going from one chapter to another parks
   * the one she leaves (E.startChapter, E.openChapter), so reading a finished chapter again never
   * moves her place in another; E.openChapter picks a parked place up where she left it. A
   * finished chapter is never parked: it is read again from its start. The one lesson slot
   * (`lesson`) is shared with the Training Hollow: a chapter lesson that gives way to a Hollow round
   * waits in its chapter's place with no frame, and E.lessonAt brings it back at its frame. */
  // L, when it is a chapter lesson of chapter `id` (a lesson with no `chapter` belongs to `owner`)
  function lessonOf(L, owner, id) {
    return isObj(L) && L.mode !== 'hollow' && isObj(L.state) && (L.chapter || owner) === id ? L : null;
  }
  function placesOf(cat) { return isObj(cat.places) ? cat.places : (cat.places = {}); }
  function busy(L) { return isObj(L) && isObj(L.state) && !E.counts.done(L.state); }
  // Two chapter lessons of one chapter in progress and one place to keep them (a Count she counts
  // again while a later lesson waits): a first go is never pushed out by counting a finished Count
  // again; otherwise the newer stays.
  function keepOne(cat, newer, older) {
    if (!busy(older)) return newer || older || null;
    if (!busy(newer)) return older;
    var again = function (L) { return !!(L.state.set && isObj(cat.lessons) && cat.lessons[L.state.set]); };
    return again(newer) && !again(older) ? older : newer;
  }
  /* Park the chapter she is reading (its frame, back-history and lesson in progress); a finished
   * one is let go. Afterwards she is reading nothing, until the caller opens a chapter. */
  function park(cat) {
    var id = cat.chapter;
    if (!id) return;
    var P = placesOf(cat), waiting = P[id] && P[id].lesson;
    var L = lessonOf(cat.lesson, id, id);
    if (L && !busy(L)) { E.settleLesson(cat); L = null; }   // all answered, never recorded: record it
    if (L) cat.lesson = null;
    delete P[id];
    if (cat.frame != null && !E.isFinished(cat, id)) P[id] = { frame: cat.frame, history: cat.history || [], lesson: keepOne(cat, L, waiting) };
    cat.chapter = null; cat.frame = null; cat.history = [];
  }
  /* Where she is in a chapter: { frame, history, lesson } (the chapter she is reading, or a parked
   * one), else null. */
  E.place = function (cat, id) {
    if (!cat || !id) return null;
    var P = isObj(cat.places) ? cat.places[id] : null;
    if (cat.chapter === id && cat.frame != null) {
      return { frame: cat.frame, history: cat.history || [], lesson: lessonOf(cat.lesson, id, id) || (P && P.lesson) || null };
    }
    return P && P.frame != null ? { frame: P.frame, history: P.history || [], lesson: P.lesson || null } : null;
  };
  /* Read a chapter from its first page (a new chapter, or a finished one again). The chapter she
   * was reading is parked first; this chapter's own old place, if any, is let go. */
  E.startChapter = function (cat, story, now) {
    if (cat.chapter && cat.chapter !== story.id) park(cat);
    if (isObj(cat.places)) delete cat.places[story.id];
    cat.chapter = story.id;
    cat.frame = E.landing(cat, story, story.start);
    cat.history = [];
    if (!(isObj(cat.lesson) && cat.lesson.mode === 'hollow')) cat.lesson = null;   // a Hollow round in progress stays
    arrive(cat, story, cat.frame, now);
    if (now) cat.updated = now;
    return cat;
  };
  /* Go to a chapter where she left it: the chapter she is reading carries on; a parked place is
   * picked up (frame, back-history, lesson); else the chapter starts from its first page. */
  E.openChapter = function (cat, story, now) {
    if (cat.chapter === story.id && cat.frame != null) return cat;
    var P = isObj(cat.places) ? cat.places[story.id] : null;
    if (!P || P.frame == null) return E.startChapter(cat, story, now);
    park(cat);
    delete cat.places[story.id];
    cat.chapter = story.id;
    // a parked page that no longer shows (f081 after chapter 2 is read again on the other path)
    // lands as a page turn would: on the first frame after it that shows
    cat.frame = E.landing(cat, story, P.frame);
    cat.history = Array.isArray(P.history) ? P.history : [];
    if (P.lesson) {
      if (isObj(cat.lesson) && !busy(cat.lesson)) E.settleLesson(cat);
      // a Hollow round in progress keeps the slot; the chapter's lesson waits for its frame
      if (busy(cat.lesson)) cat.places[story.id] = { frame: null, history: [], lesson: P.lesson };
      else cat.lesson = P.lesson;
    }
    if (now) cat.updated = now;
    return cat;
  };
  /* The chapter lesson in progress at this frame of the chapter she is reading, or null. One that
   * waits in the chapter's place takes the slot now (as starting a lesson there would). */
  E.lessonAt = function (cat, story, frameId) {
    if (!cat || !story) return null;
    var L = lessonOf(cat.lesson, cat.chapter, story.id);
    if (L && L.frame === frameId && busy(L)) return L;
    var P = cat.chapter === story.id && isObj(cat.places) ? cat.places[story.id] : null;
    var W = P && lessonOf(P.lesson, story.id, story.id);
    if (W && W.frame === frameId && busy(W)) {
      delete cat.places[story.id];
      setAsideHollow(cat);
      cat.lesson = W;
      return W;
    }
    return null;
  };
  /* A Training Hollow round in progress gives way to a chapter lesson as a chapter lesson gives way
   * to a round: when E.lessonAt or E.beginLesson takes the slot from it, it waits in
   * `hollowWaiting` (a round all answered but never recorded counts now instead), and E.hollowRound
   * hands it back when she opens the Hollow again. */
  function setAsideHollow(cat) {
    var L = cat.lesson;
    if (!(isObj(L) && L.mode === 'hollow' && isObj(L.state))) return;
    if (!busy(L)) { E.settleLesson(cat); return; }
    cat.hollowWaiting = L;
    cat.lesson = null;
  }
  /* The Training Hollow round in progress, in the slot, or null. One that gave way to a chapter
   * lesson comes back into the slot now, and that chapter lesson waits in its chapter's place
   * (E.holdLesson), as it does when a round starts. A round in the slot is returned as it is (the
   * caller settles one whose last answer is in). */
  E.hollowRound = function (cat) {
    if (!cat) return null;
    var L = cat.lesson;
    if (isObj(L) && L.mode === 'hollow' && isObj(L.state)) return L;
    var W = cat.hollowWaiting;
    if (!(isObj(W) && W.mode === 'hollow' && busy(W))) { cat.hollowWaiting = null; return null; }
    E.holdLesson(cat);
    if (busy(cat.lesson)) return null;   // the slot can't be freed: the round keeps waiting
    cat.lesson = W;
    cat.hollowWaiting = null;
    return W;
  };
  /* Before a Training Hollow round takes the lesson slot: a chapter lesson in progress there waits
   * in its chapter's place (E.lessonAt brings it back at its frame). */
  E.holdLesson = function (cat) {
    var L = cat && isObj(cat.lesson) && cat.lesson.mode !== 'hollow' && isObj(cat.lesson.state) ? cat.lesson : null;
    if (!L) return false;
    if (!busy(L)) { E.settleLesson(cat); return false; }   // all answered, never recorded: record it
    var id = L.chapter || cat.chapter, P = placesOf(cat);
    // a lesson already waiting there (one she left to count an earlier Count again) is kept too
    if (id && id === cat.chapter) P[id] = { frame: null, history: [], lesson: keepOne(cat, L, P[id] && P[id].frame == null ? P[id].lesson : null) };
    else if (id && P[id] && P[id].frame != null) P[id].lesson = keepOne(cat, L, P[id].lesson);
    else return false;
    cat.lesson = null;
    return true;
  };
  /* A chapter lesson starts at a frame ("Let’s count!", or "Count them again" on a Count she has
   * finished) and takes the slot. A lesson still going at another frame of this chapter (she went
   * Back past it to count an earlier Count again) waits in the chapter's place, as it does for a
   * Hollow round, and E.lessonAt hands it back at its own frame. Returns the new lesson. */
  E.beginLesson = function (cat, story, frameId, state) {
    var L = lessonOf(cat.lesson, cat.chapter, story.id);
    if (L && L.frame !== frameId && cat.chapter === story.id) E.holdLesson(cat);
    setAsideHollow(cat);   // a Hollow round in progress waits too (E.hollowRound)
    cat.lesson = { mode: 'chapter', frame: frameId, chapter: story.id, state: state };
    return cat.lesson;
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
    arrive(cat, story, to, now);
    if (now) cat.updated = now;
    return true;
  };
  E.next = function (cat, story, now) {
    var f = E.currentFrame(cat, story);
    var to = f && (f.next || (f.look && f.look.next) || (f.skip && f.skip.next));
    return E.go(cat, story, E.landing(cat, story, to), now);
  };
  /* A choice is remembered under "chapter:frame", so chapters never overwrite each other's. */
  E.choiceKey = function (story, frameId) { return story.id + ':' + frameId; };
  E.chosen = function (cat, story, frameId) {
    var c = cat && cat.choices && cat.choices[E.choiceKey(story, frameId)];
    return c || null;
  };
  E.choose = function (cat, story, index, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.choice || !f.choice.options || !f.choice.options[index]) return false;
    // a hidden option can't be chosen
    if (!E.options(f, cat).some(function (o) { return o.index === index; })) return false;
    var opt = f.choice.options[index];
    if (isObj(opt.sets)) Object.keys(opt.sets).forEach(function (k) { cat.flags[k] = opt.sets[k]; });
    cat.choices[E.choiceKey(story, id)] = { index: index, label: opt.label };
    return E.go(cat, story, E.landing(cat, story, opt.next), now);
  };
  /* Store what she typed (cleaned) and move on. For a dream, an empty value means skipped; each
   * chapter keeps its own dream. */
  E.submitInput = function (cat, story, value, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.input) return false;
    var kind = f.input.kind;
    if (kind === 'petname') cat.petname = E.cleanPetName(value, f.input.suggestions && f.input.suggestions[0]);
    else if (kind === 'clanname') cat.name = E.cleanClanName(value, f.input.suggestions && f.input.suggestions[0]);
    else if (kind === 'dream') { if (!isObj(cat.dreams)) cat.dreams = {}; cat.dreams[story.id] = E.cleanDream(value); }
    else if (kind) { cat.flags[kind] = E.cleanDream(value); }
    return E.go(cat, story, E.landing(cat, story, f.input.next), now);
  };
  /* Her dream for a chapter, as typed ('' when skipped or not reached). */
  E.dreamOf = function (cat, chapterId) {
    if (!cat) return '';
    if (typeof cat.dream === 'string' && cat.dream) return cat.dream;   // a version-1 cat, or a test's
    var d = isObj(cat.dreams) && chapterId ? cat.dreams[chapterId] : '';
    return typeof d === 'string' ? d : '';
  };
  E.confirmLook = function (cat, story, look, now) {
    var f = E.currentFrame(cat, story);
    if (!f || !f.look) return false;
    if (look) E.setLook(cat, look);
    cat.flags.looked = true;
    return E.go(cat, story, E.landing(cat, story, f.look.next), now);
  };
  /* Next on a Counts frame (its lesson just finished, or finished before). Only this frame's own
   * lesson leaves the slot: Next on an earlier Count she finished long ago (she went Back past a
   * later lesson in progress) never touches that later lesson, nor a Training Hollow round. */
  E.finishCounts = function (cat, story, summary, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.counts) return false;
    if (summary) cat.lessons[f.counts.set] = summary;
    var L = cat.lesson;
    if (!(isObj(L) && (L.mode === 'hollow' || (busy(L) && L.frame !== id)))) cat.lesson = null;
    return E.go(cat, story, E.landing(cat, story, f.counts.next), now);
  };
  E.canBack = function (cat) { return !!(cat && cat.history && cat.history.length); };
  E.back = function (cat, story) {
    while (cat.history.length) {
      var prev = cat.history.pop();
      // a lesson in progress stays: coming forward again resumes it at the same question; a page
      // whose `when` no longer matches is passed over, as it is going forward
      if (!story || (story.frames[prev] && E.shows(story.frames[prev], cat))) { cat.frame = prev; return true; }
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
    if (k === 'skip') return [frame.skip.next];
    return [];
  };

  /* ------------------------------------------------------------ the skip-count
   * `skip: { table, groups, who?, next, done? }`: each tap counts the next group, lighting its
   * things and adding its running total (2, 4, 6…). Nothing can be got wrong and nothing is logged.
   * skipView(skip, taps) is what the panel shows after that many taps. */
  E.skipView = function (skip, taps) {
    skip = skip || {};
    var table = Math.max(1, num(skip.table, 2) | 0), groups = Math.max(1, num(skip.groups, 5) | 0);
    var n = Math.max(0, Math.min(groups, num(taps, 0) | 0));
    var totals = [];
    for (var i = 1; i <= n; i++) totals.push(i * table);
    var done = n >= groups;
    var v = {
      table: table, groups: groups, per: table, taps: n, highlight: n * table,
      total: n * table, totals: totals, done: done,
      // the teacher's balloon keeps the count: "2… 4… 6…", and the last number on its own at the end
      // (the bedtime hop, `paws: 'own'`, trails off sleepily: "5… 10… 15… 20…")
      count: !n ? '' : totals.join('… ') + (done ? (skip.paws === 'own' ? '…' : '!') : '…')
    };
    // `paws: 'own'` (the bedtime hop): her own two forepaws taking turns, left, right, left, right;
    // `lit` is the paw the last tap lit, `nextPaw` the one glowing for the next
    if (skip.paws === 'own') {
      v.paws = 'own';
      v.lit = n ? (n % 2 ? 'left' : 'right') : null;
      v.nextPaw = done ? null : (n % 2 ? 'right' : 'left');
    }
    return v;
  };
  /* `keep: true` on a skip: the running totals stay. The page it turns to, the plain pages after
   * that, and the first Counts frame they reach (until its lesson starts) show the skip's counting
   * picture, every group lit, its running totals under the groups ("every number you land on ends
   * in a five or a zero"), in place of their scenes. Returns { id, skip } for such a page, else null. */
  E.keptSkip = function (story, frameId, cat) {
    var F = (story && story.frames) || {};
    for (var id in F) {
      if (!own(F, id) || !F[id] || !F[id].skip || !F[id].skip.keep) continue;
      var at = cat ? E.landing(cat, story, F[id].skip.next) : F[id].skip.next;
      for (var guard = 0; guard < 32 && at && F[at]; guard++) {
        if (at === frameId) return { id: id, skip: F[id].skip };
        var k = E.kindOf(F[at]);
        if (k !== 'next') break;
        at = cat ? E.landing(cat, story, F[at].next) : F[at].next;
      }
    }
    return null;
  };
  /* The skip-count a page comes straight after (it shows the number reached, big), or null. */
  E.skipInto = function (story, frameId, cat) {
    var F = (story && story.frames) || {};
    for (var id in F) {
      if (!own(F, id) || !F[id] || !F[id].skip) continue;
      if ((cat ? E.landing(cat, story, F[id].skip.next) : F[id].skip.next) === frameId) return F[id].skip;
    }
    return null;
  };

  /* ------------------------------------------------------------ scene options from the cat
   * On the `hollow` set, `marks: 'auto'` is one mark per Count she has finished a chapter lesson
   * for, and `glow: 'auto'` lights each mark whose Count glows in the Training Hollow. On the `den`,
   * `stone: 'auto'` is Riffle's stone where she put it (`flags.ch2Stone`). The story's own scene is
   * never changed: a resolved scene is a copy. */
  E.resolveScene = function (scene, cat, stories) {
    if (!scene || !isObj(scene.opts)) return scene;
    var o = scene.opts;
    if (o.marks !== 'auto' && o.glow !== 'auto' && o.stone !== 'auto') return scene;
    var s = clone(scene);
    if (o.marks === 'auto' || o.glow === 'auto') {
      var counts = E.learnedCounts(cat, stories).slice(0, E.MAX_MARKS);
      var byT = (cat && cat.hollow && cat.hollow.byTable) || {};
      if (s.opts.marks === 'auto') s.opts.marks = counts.length;
      if (s.opts.glow === 'auto') s.opts.glow = counts.map(function (c) { return !!(byT[c.table] && byT[c.table].glow); });
    }
    // the den's `stone: 'auto'`: Riffle's stone where she put it in her nest (chapter 2's f108 sets
    // `ch2Stone`, 'nose' or 'chin'); not chosen yet, between her paws
    if (o.stone === 'auto') {
      var put = cat && isObj(cat.flags) ? cat.flags.ch2Stone : null;
      s.opts.stone = put === 'nose' || put === 'chin' ? put : true;
    }
    return s;
  };

  /* ------------------------------------------------------------ the Counts runner
   * A lesson is plain data, so it can be saved mid-lesson and resumed:
   *   state = { set, table, queue: [{a,b,retry,filler?,hard?, …}], pos, requeues: {"3x1": n}, log: [],
   *             lines, missed, pool?, asked?, avoid? }
   * question(state) -> the fact to ask now, or null when the lesson is over.
   * answer(state, def, value, ms, now) -> what happened (and the state moves on).
   * A miss shows help, reveals the answer, and puts the fact back exactly two questions later, at
   * most twice per fact. Near the end of a lesson there may be fewer than two questions left, so
   * filler questions are added first: from the set named by `fillFrom` (her right answers there,
   * then its facts; carried in state.pool), else facts she already got right in this lesson, else
   * other facts from it already asked. A fact still ahead in the queue is never a filler (it would
   * be asked twice running), and while there is another to take, a filler is never a pair this
   * lesson has asked already, nor one its sibling sets (the pile and the check: the sets of the
   * chapter that borrow from the same set) asked in this reading (state.asked), nor one the set
   * avoids (state.avoid: chapter 3's warm-up stays off the pile's pairs). An avoided pair comes last
   * of all, after every other pair (chapter 2 has none, so it borrows as it did). A borrowed filler
   * carries `from`, its lending set: it is asked in that set's picture and words, with that set's
   * praise (E.questionDef). With too few fillers the retry comes back as late as it can. Nothing
   * ever blocks: every answer moves the lesson forward.
   * A fact is [a, b] or { a, b, table?, groups?, per?, picture?, who?, lit?, light?, prompt?,
   * retryPrompt?, right?, rightAgain?, rightPicture?, check?, hard? }. */
  function factKey(a, b) { return a + 'x' + b; }
  function pairKey(a, b) { return Math.min(a, b) + 'x' + Math.max(a, b); }   // 9×1 and 1×9 are one fact
  function groupsFor(a, b, table) {
    // the picture: `groups` cats each carrying `per` things (for the 1s, n cats, one tail each)
    if (table && b === table) return { groups: a, per: b };
    if (table && a === table) return { groups: b, per: a };
    return { groups: a, per: b };
  }
  /* A fact's own keys. `who` puts characters in the picture's places (the rim cats); `lit` is how
   * many things glow as it is asked (2 × 6: the first five cats' ten ears); `light: 'groups'`
   * lights the picture a group at a time as it is asked, with no number (the pile's stacks, or the
   * check's two rows); `check: true` goes on its log entry (E.hardFacts skips a right one). */
  var FACT_KEYS = ['table', 'groups', 'per', 'picture', 'who', 'lit', 'light', 'check', 'prompt', 'retryPrompt', 'right', 'rightAgain', 'rightPicture'];
  // a retry is pictured the same and asked plainly, unless the fact keeps a prompt for it (retryPrompt)
  var RETRY_KEYS = ['table', 'groups', 'per', 'picture', 'who', 'lit', 'light', 'check', 'rightPicture'];
  function normFact(f) {
    if (Array.isArray(f)) return { a: +f[0], b: +f[1], retry: false };
    var item = { a: +f.a, b: +f.b, retry: false };
    if (f.hard) item.hard = true;
    FACT_KEYS.forEach(function (k) { if (f[k] != null) item[k] = clone(f[k]); });
    return item;
  }
  function copyKeys(from, to, keys) { keys.forEach(function (k) { if (from[k] != null) to[k] = clone(from[k]); }); return to; }
  var C = {};
  C.start = function (def, opts) {
    opts = opts || {};
    var facts = opts.facts || def.facts || [];
    var st = {
      set: opts.set || def.id || null,
      table: def.table || null,
      mode: opts.mode || 'chapter',
      queue: facts.map(normFact),
      pos: 0,
      requeues: {},
      log: [],
      lines: { praise: 0, fast: 0, again: 0, fastLast: false },
      missed: false,
      startedAt: opts.now || 0
    };
    if (Array.isArray(opts.pool) && opts.pool.length) st.pool = opts.pool.map(function (p) { return copyKeys(p, { a: +p.a, b: +p.b }, ['table', 'from']); });
    // the pairs this lesson's sibling sets have asked in this reading (a filler skips them while it can)
    if (Array.isArray(opts.asked) && opts.asked.length) st.asked = opts.asked.slice();
    // the pairs the set avoids (`avoid`): a filler takes them only when nothing else is left
    if (Array.isArray(opts.avoid) && opts.avoid.length) st.avoid = opts.avoid.slice();
    return st;
  };
  C.done = function (st) { return !st || st.pos >= st.queue.length; };
  /* The count of a miss goes up by the Count's table (2, 4, 6… for the 2s) when the picture's
   * groups divide that way, else by one. */
  function stepFor(table, per) { return table > 1 && per % table === 0 ? table : 1; }
  C.question = function (st) {
    if (C.done(st)) return null;
    var q = st.queue[st.pos];
    var table = q.table || st.table || null;
    var g = groupsFor(q.a, q.b, table);
    if (typeof q.groups === 'number') g.groups = q.groups;
    if (typeof q.per === 'number') g.per = q.per;
    var first = !q.retry && !q.filler;
    return {
      a: q.a, b: q.b, answer: q.a * q.b, retry: !!q.retry, filler: !!q.filler, hard: !!q.hard,
      from: q.from || null,
      number: st.pos + 1, total: st.queue.length,
      groups: g.groups, per: g.per, table: table,
      picture: q.picture || null,
      who: Array.isArray(q.who) ? q.who : null,
      lit: Math.max(0, num(q.lit, 0) | 0),
      light: q.light === 'groups' || q.light === 'rows' ? q.light : null,
      // a retry is asked plainly ("Here's that one again." and the generic question) unless the
      // fact keeps a prompt for it (2 × 6's hop on from ten, the check's "Two rows of eight.")
      prompt: first ? (q.prompt != null ? q.prompt : null) : (q.retry && q.retryPrompt != null ? q.retryPrompt : null),
      right: first && q.right != null ? q.right : null,
      rightPicture: q.rightPicture || null,
      step: stepFor(table || 1, g.per)
    };
  };
  C.ask = function (def, q) {
    return E.fill(def.ask || '{a} × {b}', null, { a: q.a, b: q.b });
  };
  /* Up to n facts to ask between a miss and its retry when the lesson is nearly over (see above).
   * Never the missed pair or one still ahead; first, nothing already asked (in this lesson, or by a
   * sibling set in this reading: state.asked) and nothing the set avoids (state.avoid); then, if that
   * leaves too few, the next pair in order that the set doesn't avoid (chapter 2's rule as it shipped:
   * with no `avoid`, these two passes are exactly its fresh-then-anything); and last an avoided pair. */
  function fillers(st, q, n) {
    var miss = pairKey(q.a, q.b), out = [], taken = {}, asked = {}, avoided = {};
    taken[miss] = true;
    for (var k = st.pos + 1; k < st.queue.length; k++) taken[pairKey(st.queue[k].a, st.queue[k].b)] = true;
    st.log.forEach(function (e) { asked[pairKey(e.a, e.b)] = true; });
    (st.asked || []).forEach(function (key) { asked[key] = true; });
    (st.avoid || []).forEach(function (key) { avoided[key] = true; });
    var cands = [];
    (st.pool || []).forEach(function (p) { cands.push({ a: p.a, b: p.b, table: p.table, from: p.from }); });
    for (var i = st.log.length - 1; i >= 0; i--) {
      var e = st.log[i];
      if (e.correct) cands.push({ a: e.a, b: e.b, table: e.table });
    }
    for (var j = 0; j <= st.pos && j < st.queue.length; j++) {
      var it = st.queue[j];
      if (!it.retry && !it.filler) cands.push({ a: it.a, b: it.b, table: it.table });
    }
    // three passes: fresh pairs; then anything but an avoided pair, in order; and only then an
    // avoided one (st.avoid: the pile's 9 × 2 and 7 × 2 at chapter 3's warm-up)
    [0, 1, 2].forEach(function (pass) {
      cands.forEach(function (c) {
        var key = pairKey(c.a, c.b);
        if (out.length >= n || taken[key] || (pass < 2 && avoided[key]) || (pass < 1 && asked[key])) return;
        taken[key] = true;
        var f = { a: c.a, b: c.b, retry: false, filler: true };
        if (c.table && c.table !== st.table) f.table = c.table;
        if (c.from) f.from = c.from;
        out.push(f);
      });
    });
    return out;
  }
  /* The retry of a missed fact: pictured the same; its retryPrompt (true: the fact's own prompt)
   * and its rightAgain lines (true: its `right` lines; by default, a fact whose picture regroups
   * after a right answer keeps its `right` lines, which say why the picture moved). */
  function retryOf(q) {
    var r = copyKeys(q, { a: q.a, b: q.b, retry: true }, RETRY_KEYS);
    var rp = q.retryPrompt === true ? q.prompt : q.retryPrompt;
    if (rp != null && rp !== false) r.retryPrompt = clone(rp);
    var ra = q.rightAgain === true ? q.right : q.rightAgain;
    if (ra == null && q.rightPicture && q.right != null) ra = q.right;
    if (ra != null && ra !== false) r.rightAgain = clone(ra);
    if (q.from) r.from = q.from;
    return r;
  }
  /* Lines tied to one question, as balloons: a string is the teacher's. */
  function balloonList(x) {
    return asList(x).map(function (b) { return typeof b === 'string' ? { text: b } : b; }).filter(function (b) { return b && b.text; });
  }
  C.answer = function (st, def, value, ms, now) {
    if (C.done(st)) return null;
    def = def || {};
    var q = st.queue[st.pos];
    var qq = C.question(st);
    var right = q.a * q.b;
    var n = typeof value === 'number' ? value : parseInt(String(value == null ? '' : value).replace(/\D/g, ''), 10);
    var given = isNaN(n) ? null : n;
    var correct = given === right;
    ms = Math.max(0, Math.round(+ms || 0));
    var entry = {
      set: st.set, a: q.a, b: q.b, answer: given, correct: correct, ms: ms,
      helped: !correct, retry: !!q.retry, at: now || 0
    };
    if (q.filler) entry.filler = true;
    if (q.from) entry.from = q.from;   // a borrowed question: the set it came from
    // a check (the pile's 8 × 2 and 2 × 8): its clock runs while she reads, and "sixteen" is on
    // screen by then, so a right one never makes the fact hard or easy (E.hardFacts)
    if (q.check) entry.check = true;
    if (q.table && q.table !== st.table) entry.table = q.table;   // a fact from another Count (mixed lessons)
    // "after a miss" lines are true only once a miss has happened in this lesson
    var missedBefore = !!st.missed || st.log.some(function (e) { return !e.correct; });
    st.log.push(entry);
    var res = { correct: correct, right: right, fast: correct && ms < E.FAST_MS, entry: entry, requeued: false, line: '', lineKind: '' };
    var L = st.lines || (st.lines = { praise: 0, fast: 0, again: 0, fastLast: false });
    if (correct) {
      if (q.rightPicture) res.rightPicture = clone(q.rightPicture);
      // after a miss in this lesson (and only then) the fastAfterMiss lines lead, taking turns with the fast ones
      var afterMiss = missedBefore && def.fastAfterMiss && def.fastAfterMiss.length ? asList(def.fastAfterMiss) : null;
      var fastLines = afterMiss ? afterMiss.concat(asList(def.fast)) : (def.fast && def.fast.length ? asList(def.fast) : null);
      if (q.retry && q.rightAgain != null) {
        // this question's own lines for a right retry (the old tom's "Hmph."; 5 × 2's same ten)
        res.balloons = clone(balloonList(q.rightAgain));
        res.lineKind = 'right'; L.fastLast = false;
      } else if (q.retry) {
        res.line = pick(def.again || ['There it is. You remembered that one.', 'Yes! That one came back, and you knew it.'], L.again++);
        res.lineKind = 'again'; L.fastLast = false;
      } else if (q.hard) {
        // the Hollow (and an adaptive warm-up) remembers what was hard last time: "Not today!" only
        // when it was quick today; right but slow again, it is getting easier
        var ri = L.remembered || 0; L.remembered = ri + 1;
        if (res.fast) {
          res.line = pick(def.remembered || 'Last time {a} × {b} made you stop and think. Not today!', ri);
          res.lineKind = 'remembered';
        } else {
          res.line = pick(def.rememberedSlow || '{a} × {b} again, and you got it. It’s getting easier.', ri);
          res.lineKind = 'rememberedSlow';
        }
        L.fastLast = false;
      } else if (qq.right) {
        // this question's own lines, in place of praise (the story goes on in them)
        res.balloons = clone(balloonList(qq.right));
        res.lineKind = 'right'; L.fastLast = false;
      } else if (res.fast && fastLines && !L.fastLast) {
        var fi = afterMiss ? (L.fastAfter || 0) : L.fast;
        if (afterMiss) L.fastAfter = fi + 1; else L.fast++;
        res.line = pick(fastLines, fi); res.lineKind = 'fast'; L.fastLast = true;
      } else {
        res.line = pick(def.praise || ['Yes!'], L.praise++); res.lineKind = 'praise'; L.fastLast = false;
      }
      res.line = fillFact(res.line, q);
    } else {
      L.fastLast = false;
      st.missed = true;
      res.lineKind = 'miss';
      res.help = { a: q.a, b: q.b, answer: right, groups: qq.groups, per: qq.per };
      // `near`: one hop of the count off (|answer − right| ≤ step: 1 on the 1s, 2 on the 2s, the hop
      // the sand counts in), or exactly one group off (a row of eight on the check: one row counted,
      // or three), when the help opens on "Close." (the set's helpIntro). Not anything within a
      // row: 10 or 24 for the check's 16 is not close.
      var off = given != null ? Math.abs(given - right) : null;
      res.near = off != null && (off <= Math.max(1, qq.step) || off === qq.per);
      // on the 5s, an answer that ends in neither 5 nor 0 (34 for 7 × 5) gets the five-or-zero
      // reminder first (a set's helpIntroNotFive)
      if (qq.table === 5 && given != null && given % 5 !== 0) res.notFive = true;
      if (qq.table && qq.table !== 1) res.help.table = qq.table;
      if (qq.step !== 1) res.help.step = qq.step;
      var key = factKey(q.a, q.b);
      var used = st.requeues[key] || 0;
      if (used < E.MAX_REQUEUE) {
        st.requeues[key] = used + 1;
        // exactly REQUEUE_GAP questions between the miss and its retry: pad the end when it is near
        var left = st.queue.length - (st.pos + 1);
        if (left < E.REQUEUE_GAP) st.queue.push.apply(st.queue, fillers(st, q, E.REQUEUE_GAP - left));
        var at = Math.min(st.pos + 1 + E.REQUEUE_GAP, st.queue.length);
        st.queue.splice(at, 0, retryOf(q));
        res.requeued = true;
      }
      // "we'll come back to that one" only when it really comes back
      res.line = res.requeued ? pick(def.miss || 'There. We\'ll come back to that one.', 0)
        : pick(def.missLast || 'There. Now you’ve seen it counted.', 0);
      res.line = fillFact(res.line, q);
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

  /* A chapter's Counts set by id: this story's first, then any chapter's. */
  E.countsSet = function (setId, story, stories) {
    if (story && story.counts && story.counts[setId]) return story.counts[setId];
    var list = storyList(stories);
    for (var i = 0; i < list.length; i++) if (list[i].counts && list[i].counts[setId]) return list[i].counts[setId];
    return null;
  };
  /* The facts a chapter lesson asks, after `warmHard` adapts them: if E.hardFacts(cat, table) has a
   * fact (passing over the set's `avoid` pairs, either way round: none left, nothing is hard), it
   * takes position `at` (marked hard, so a right answer earns the `remembered` line).
   * `alt` as one pair (chapter 2's): another fact that is the same pair as the hard one becomes it.
   * `alt` as an ordered list (chapter 3's): the opener is replaced when its pair is the hard fact's or
   * one of her top hard facts (E.hardFacts(…).slice(0, E.HARD_PER_ROUND)), by the first entry whose
   * pair is not the hard fact's, not one of those, and not in `avoid`; if none is, the first that
   * isn't the hard fact's pair. So she never opens on a hard fact, nor meets one pair twice running. */
  function factPair(f) { return Array.isArray(f) ? [+f[0], +f[1]] : isObj(f) ? [+f.a, +f.b] : [NaN, NaN]; }
  function pairSet(list) {
    var out = {};
    asList(list).forEach(function (f) { var p = factPair(f); if (p[0] >= 0 && p[1] >= 0) out[pairKey(p[0], p[1])] = true; });
    return out;
  }
  // a list of pairs ([[2, 3], [2, 2]]), not one pair ([1, 3])
  function altList(alt) { return Array.isArray(alt) && alt.length > 0 && (Array.isArray(alt[0]) || isObj(alt[0])); }
  E.lessonFacts = function (cat, def, stories) {
    var facts = (def.facts || []).slice();
    var w = def.warmHard;
    if (!isObj(w) || !facts.length) return facts;
    var avoid = pairSet(def.avoid);
    var all = E.hardFacts(cat, w.table || def.table || 1, stories);
    var hard = all.filter(function (f) { return !avoid[pairKey(f[0], f[1])]; })[0];
    if (!hard) return facts;
    var at = Math.max(0, Math.min(facts.length - 1, num(w.at, 0) | 0));
    var hk = pairKey(hard[0], hard[1]);
    if (!altList(w.alt)) {
      return facts.map(function (f, i) {
        if (i === at) return { a: hard[0], b: hard[1], hard: true };
        var p = factPair(f);
        if (pairKey(p[0], p[1]) === hk && w.alt) return clone(w.alt);
        return f;
      });
    }
    var top = {};
    all.slice(0, E.HARD_PER_ROUND).forEach(function (f) { top[pairKey(f[0], f[1])] = true; });
    var alts = w.alt.filter(function (f) { var p = factPair(f); return p[0] >= 0 && p[1] >= 0; });
    var pk = function (f) { var p = factPair(f); return pairKey(p[0], p[1]); };
    var pickAlt = alts.filter(function (f) { var k = pk(f); return k !== hk && !top[k] && !avoid[k]; })[0] ||
      alts.filter(function (f) { return pk(f) !== hk; })[0] || null;
    return facts.map(function (f, i) {
      if (i === at) return { a: hard[0], b: hard[1], hard: true };
      var k = pk(f), opener = i === 0;
      if (pickAlt && (k === hk || (opener && top[k]))) return clone(pickAlt);
      return f;
    });
  };
  /* The fillers a set lends another (its `fillFrom`): her right answers there, most recent first,
   * then its facts. Each carries `from: setId`, so it is asked as that set's question. `order:
   * 'easiest'` (the borrowing set's `fillOrder`) sorts them by product instead, smallest first (a
   * missed dinner under the bridge borrows 1 × 5 and 5 × 3, never the lesson's 10 × 5 and 7 × 5). */
  E.EASIEST_POOL = 5;
  E.fillPool = function (cat, setId, stories, order) {
    var out = [], seen = {};
    function add(a, b, table) {
      var k = pairKey(a, b);
      if (seen[k] || !(a > 0) || !(b > 0)) return;
      seen[k] = true;
      var p = { a: a, b: b };
      if (table) p.table = table;
      p.from = setId;
      out.push(p);
    }
    var log = (cat && cat.counts) || [];
    for (var i = log.length - 1; i >= 0; i--) { var e = log[i]; if (e && e.set === setId && e.correct && !e.filler) add(+e.a, +e.b, e.table); }
    var def = E.countsSet(setId, null, stories);
    (def && def.facts || []).forEach(function (f) {
      if (Array.isArray(f)) add(+f[0], +f[1]);
      else if (isObj(f)) add(+f.a, +f.b, f.table);
    });
    if (order === 'easiest') {
      out = out.map(function (p, i) { return { p: p, i: i }; })
        .sort(function (x, y) { return x.p.a * x.p.b - y.p.a * y.p.b || x.i - y.i; })
        .map(function (x) { return x.p; });
    }
    return out;
  };
  /* The pairs a borrowing set and its siblings (the sets of its chapter that borrow from the same
   * set: the pile and the check) have asked in this reading, fillers included: the cat's latest run
   * of their answers, back to the last answer from another lesson of the chapter (the ears lesson
   * before the pile). Answers from elsewhere (a Hollow round, chapter 1 read again) don't end the
   * run. A borrowed question skips these while there is another to take. */
  E.siblingAsked = function (cat, story, setId) {
    var counts = (story && story.counts) || {}, def = counts[setId];
    if (!def || !def.fillFrom) return [];
    var sets = {};
    Object.keys(counts).forEach(function (id) { if (counts[id] && counts[id].fillFrom === def.fillFrom) sets[id] = true; });
    sets[setId] = true;
    var out = [], seen = {}, log = (cat && cat.counts) || [];
    for (var i = log.length - 1; i >= 0; i--) {
      var e = log[i];
      if (!e) continue;
      if (sets[e.set]) { var k = pairKey(e.a, e.b); if (!seen[k]) { seen[k] = true; out.push(k); } continue; }
      if (counts[e.set]) break;
    }
    return out;
  };
  /* Start a chapter lesson: the set's definition (with its id) and a fresh lesson state. */
  E.chapterLesson = function (cat, story, setId, now, stories) {
    var raw = E.countsSet(setId, story, stories) || {};
    var def = Object.assign({ id: setId }, raw);
    var opts = { facts: E.lessonFacts(cat, def, stories || story), set: setId, mode: 'chapter', now: now };
    if (def.fillFrom) {
      opts.pool = E.fillPool(cat, def.fillFrom, stories || story, def.fillOrder);
      // 'easiest' (Sprinkle's dinner and the six): only the five easiest, so a child who has just
      // missed twice is never handed the lesson's hardest (7 × 5, 5 × 8, 9 × 5); when those five are
      // used up, an easy pair comes round again
      if (def.fillOrder === 'easiest') opts.pool = opts.pool.slice(0, E.EASIEST_POOL);
      opts.asked = E.siblingAsked(cat, story, setId);
      // `avoid` (the warm-up stays off the pile's pairs): what it borrows passes over them too,
      // while the pool has any other pair, fresh or not (state.avoid; fillers() takes them last)
      opts.avoid = Object.keys(pairSet(def.avoid));
    }
    return { def: def, state: C.start(def, opts) };
  };
  /* The set a question is asked as: a borrowed filler (or its retry) is its lending set's question,
   * in that set's picture and words, with its praise and fast lines; anything else, the lesson's
   * own. The UI asks with it and passes it to E.counts.answer.
   * A borrowing set with `fillVoice: 'borrower'` (Sprinkle's two under the bridge) keeps its own
   * voice: a borrowed question takes only the lending set's picture (VOICE_PICTURE) and everything
   * said (teacher, praise, fast, again, miss, the help's lines and who counts) is the borrower's. */
  var VOICE_PICTURE = ['table', 'thing', 'things', 'unit', 'units', 'picture', 'who'];
  E.questionDef = function (def, q, story, stories) {
    if (!q || !q.from || (def && def.id === q.from)) return def;
    var lend = E.countsSet(q.from, story, stories);
    if (!lend) return def;
    if (def && def.fillVoice === 'borrower') {
      var out = Object.assign({}, def, { id: q.from, voice: def.id });
      VOICE_PICTURE.forEach(function (k) { if (lend[k] != null) out[k] = lend[k]; else delete out[k]; });
      ['firstPrompt', 'prompt', 'facts', 'warmHard'].forEach(function (k) { delete out[k]; });
      return out;
    }
    return Object.assign({ id: q.from }, lend);
  };
  /* ------------------------------------------------------------ what the page says around a question
   * Pure, so Node can test the words: the question as asked (E.promptLines), the generic question
   * ("Three cats. How many tails?"), and the help after a miss (E.helpPlan). `def` is the lesson's
   * set, `D` the set the question is asked as (E.questionDef). Lines are { who, text, kind? } (a
   * line of kind 'caption' is narration); a question's own tokens ({a} {b} {answer} {groups} {per}
   * {thing} {things}) are filled here, the cat's ({name}…) are left for the page. */
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  E.numWord = function (n) { return NUMW[n] || String(n); };
  function pictureOf(D, q) { return Object.assign({}, (D && D.picture) || {}, (q && q.picture) || {}); }
  function fillQ(text, D, q) {
    var x = { a: q.a, b: q.b, answer: q.answer != null ? q.answer : q.a * q.b, groups: q.groups, per: q.per,
      thing: (D && D.thing) || 'tail', things: (D && D.things) || 'tails' };
    return String(text == null ? '' : text).replace(/\{([A-Za-z]+)\}/g, function (m, k) { return own(x, k) ? String(x[k]) : m; });
  }
  /* "Three cats. How many tails?": a group is a cat unless the set says otherwise (the pile's
   * pairs, the bridge's forepaws); a picture in rows is counted in rows ("Two rows of eight."). */
  E.genericQuestion = function (D, q) {
    D = D || {};
    var things = D.things || 'tails';
    if (pictureOf(D, q).layout === 'rows') return cap1(E.numWord(q.groups)) + ' ' + (q.groups === 1 ? 'row' : 'rows') + ' of ' + E.numWord(q.per) + '. How many ' + things + '?';
    var unit = D.unit || 'cat', units = D.units || (D.unit ? D.unit + 's' : 'cats');
    return cap1(E.numWord(q.groups)) + ' ' + (q.groups === 1 ? unit : units) + '. How many ' + things + '?';
  };
  E.teacherOf = function (def, D) { return (D && D.teacher) || (def && def.teacher) || 'tallyheart'; };
  /* What is said before she answers: the question's own prompt (a line, or balloons from anyone),
   * else the set's firstPrompt (its first question), its prompt, or the generic question. A retry:
   * the set's `againIntro` ("Here’s that one again.") and the generic question, or the prompt the fact
   * keeps for it. A borrowed question: the borrowing set's `fillIntro` ("One from yesterday."), then
   * its own lesson's generic question. */
  E.promptLines = function (def, D, q) {
    def = def || {}; D = D || def;
    var teacher = E.teacherOf(def, D);
    var lines = function (x) {
      return asList(x).map(function (b) { return typeof b === 'string' ? { text: b } : b; }).filter(function (b) { return b && b.text; })
        .map(function (b) { return b.kind === 'caption' ? { text: fillQ(b.text, D, q), kind: 'caption' } : { who: b.who || teacher, text: fillQ(b.text, D, q), kind: b.kind }; });
    };
    if (q.retry) {
      // a borrowed question coming back under the bridge isn't "my dinner again": it opens as it did,
      // in the borrower's words ("Count another one with me.")
      var lentBack = q.from && def.fillVoice === 'borrower' && def.id !== q.from && def.fillIntro;
      var again = lentBack ? def.fillIntro : (D.againIntro || 'Here’s that one again.');
      if (typeof q.prompt === 'string') return [{ who: teacher, text: again + ' ' + fillQ(q.prompt, D, q) }];
      if (q.prompt != null) return [{ who: teacher, text: again }].concat(lines(q.prompt));
      return [{ who: teacher, text: again + ' ' + E.genericQuestion(D, q) }];
    }
    if (q.filler && q.from && def.fillIntro) return [{ who: teacher, text: def.fillIntro + ' ' + E.genericQuestion(D, q) }];
    if (q.prompt != null) {
      if (typeof q.prompt === 'string') return [{ who: teacher, text: fillQ(q.prompt, D, q) }];
      return lines(q.prompt);
    }
    if (D.firstPrompt && q.number === 1) return [{ who: teacher, text: fillQ(D.firstPrompt, D, q) }];
    if (D.prompt) return [{ who: teacher, text: fillQ(D.prompt, D, q) }];
    return [{ who: teacher, text: E.genericQuestion(D, q) }];
  };
  /* Where the help is scratched: the lesson set's `ground` ('sand', 'earth', 'mud'); else, for a
   * borrowed question, earth when the borrowing set's own picture is prey (the pile scratches a
   * borrowed ears question in the earth beside it), else sand; for its own question, earth for prey,
   * mud for a picture drawn in the mud, else sand. The Training Hollow is always sand. */
  E.helpGround = function (def, D, q) {
    def = def || {};
    if (def.ground === 'sand' || def.ground === 'earth' || def.ground === 'mud') return def.ground;
    var borrowed = q && q.from && def.id !== q.from;
    var kind = borrowed ? (def.picture && def.picture.kind) : pictureOf(D || def, q || {}).kind;
    return kind === 'prey' ? 'earth' : kind === 'mud' ? 'mud' : 'sand';
  };
  /* The help after a miss (E.counts.answer's `help`, `near`, `notFive`, `line`): its first line, who
   * keeps the count (the teacher, or with `helpCounter: 'you'` the player: under the bridge she hops
   * and Sprinkle swipes), the ground, the scratches' style ('swipe': five short lines a paw, on the
   * 5s) and the count, step by step (5 · 10 · 15 … on the 5s), then the miss line. */
  E.helpPlan = function (def, D, q, res) {
    def = def || {}; D = D || def;
    var hp = res.help || {}, step = hp.step || 1, total = hp.groups * hp.per;
    var teacher = E.teacherOf(def, D);
    var helpIntro = D.helpIntro || 'Let’s scratch it out together.';
    var intro = res.notFive && D.helpIntroNotFive ? D.helpIntroNotFive
      : res.near ? helpIntro : (D.helpIntroFar || helpIntro.replace(/^Close\.\s*/, ''));
    var nums = [];
    for (var i = step; i <= total; i += step) nums.push(i);
    if (nums[nums.length - 1] !== total) nums.push(total);
    var pic = pictureOf(D, q || {});
    return {
      intro: intro, teacher: teacher, counter: D.helpCounter === 'you' ? 'player' : teacher,
      ground: E.helpGround(def, D, q), style: (hp.table || (q && q.table)) === 5 && hp.per === 5 ? 'swipe' : null,
      layout: pic.layout === 'rows' ? 'rows' : null,
      step: step, total: total, nums: nums, groups: hp.groups, per: hp.per, answer: hp.answer, line: res.line || ''
    };
  };

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
  /* Which Count an answer belongs to: its own `table` (a mixed lesson), else its set's (a
   * chapter's set, or the Hollow's "hollow-2s"), else the smaller factor of the fact. */
  E.tableOf = function (entry, stories) {
    if (!entry) return 1;
    if (typeof entry.table === 'number') return entry.table;
    var m = /^hollow-(\d+)s$/.exec(entry.set || '');
    if (m) return +m[1];
    var def = entry.set && E.countsSet(entry.set, null, stories);
    if (def && def.table) return def.table;
    return Math.min(entry.a, entry.b) || 1;
  };
  /* The grown-ups' Counts, one per-fact table for each Count: [{ table, name, rows }]. */
  E.factTables = function (cat, stories) {
    var by = {};
    ((cat && cat.counts) || []).forEach(function (e) {
      var t = E.tableOf(e, stories);
      (by[t] || (by[t] = [])).push(e);
    });
    return Object.keys(by).map(Number).sort(function (a, b) { return a - b; }).map(function (t) {
      var c = E.countFor(t, stories);
      return { table: t, name: c ? E.countName(c.def, t) : 'The ' + t + 's', rows: E.factTable(by[t]) };
    });
  };

  /* ------------------------------------------------------------ the book */
  /* The dream as the book prints it (the cat keeps what she typed): a capital first letter,
   * "i" and "i'm" as "I" and "I'm", and a full stop unless it already ends a sentence. */
  E.tidyDream = function (raw) {
    var s = E.cleanDream(raw);
    if (!s) return s;
    s = s.replace(/(^|[^\p{L}\p{N}'’])i(?=$|[^\p{L}\p{N}])/gu, '$1I');
    s = s.charAt(0).toUpperCase() + s.slice(1);
    if (!/[.!?…"”’'»]$/.test(s)) s += '.';
    return s;
  };
  /* One chapter's page: its heading, its recap (lines whose `when` matches), its dream line. */
  E.buildBook = function (story, cat) {
    var book = (story && story.book) || {};
    var recap = (book.recap || []).filter(function (r) {
      return r && typeof r.text === 'string' && E.matches(r.when, cat);
    }).map(function (r) { return E.fill(r.text, cat); });
    var typed = E.dreamOf(cat, story && story.id);
    var dream = typed ? E.fill(book.dream || '{name}paw’s dream: “{dream}”', cat, { dream: E.tidyDream(typed) })
      : (book.noDream ? E.fill(book.noDream, cat) : '');
    return {
      title: E.fill(book.title || '{name}paw’s First Moon', cat),
      chapter: E.fill(book.chapter || ('Chapter ' + (story.number || 1) + ': ' + (story.title || '')), cat),
      recap: recap,
      dream: dream,
      dreamText: typed
    };
  };
  /* Her whole book: the title once, then a page per finished chapter, in order, then the latest
   * finished chapter's teaser. */
  E.buildFullBook = function (cat, stories) {
    var list = E.chapters(stories);
    var first = list[0];
    var pages = list.filter(function (s) { return E.isFinished(cat, s.id); }).map(function (s) {
      var b = E.buildBook(s, cat);
      return { id: s.id, number: s.number || 1, heading: b.chapter, recap: b.recap, dream: b.dream, dreamText: b.dreamText };
    });
    var latest = pages.length ? E.chapter(pages[pages.length - 1].id, list) : null;
    return {
      title: E.fill((first && first.book && first.book.title) || '{name}paw’s First Moon', cat),
      pages: pages,
      dragonets: E.dragonets(cat, list),
      teaser: latest ? E.teaser(latest, cat, list) : null
    };
  };
  /* The dragonets she has found: a page in her book for each, from the finished chapter that finds
   * it (`book.dragonet: { id, name, lines }`, Sprinkle in chapter 3), in chapter order; the rest of the
   * clutch (E.DRAGONETS in all) are silhouettes, still to find. Null until she has found one. */
  E.dragonets = function (cat, stories) {
    var found = [], seen = {};
    E.chapters(stories).forEach(function (s) {
      var d = s.book && s.book.dragonet;
      if (!isObj(d) || !d.id || seen[d.id] || !E.isFinished(cat, s.id)) return;
      seen[d.id] = true;
      found.push({ id: d.id, name: E.fill(d.name || d.id, cat), lines: asList(d.lines).map(function (l) { return E.fill(l, cat); }), chapter: s.id });
    });
    return found.length ? { found: found, toFind: Math.max(0, E.DRAGONETS - found.length) } : null;
  };

  /* ------------------------------------------------------------ the Training Hollow
   * One claw mark per Count: once a chapter lesson of a Count is finished, the Hollow offers it,
   * a round of its ten facts at a time. Each Count keeps its own rounds and glow; every full round
   * (of any Count) earns the next treasure. */
  var COUNT_THINGS = { 1: ['tail', 'tails'], 2: ['ear', 'ears'], 3: ['cat', 'cats'], 4: ['paw', 'paws'], 5: ['claw', 'claws'], 10: ['claw', 'claws'] };
  function setTable(def) {
    if (!def) return null;
    if (def.table) return def.table;
    var f = (def.facts || [])[0];
    return f && !Array.isArray(f) && f.table ? f.table : null;
  }
  /* Every Count the chapters teach, in the order they are taught: [{ table, setId, def, chapter }].
   * A Count's own set is the first chapter's to use its table (the one with the most facts there). */
  E.countSets = function (stories) {
    var out = [], byT = {};
    E.chapters(stories).forEach(function (s) {
      Object.keys(s.counts || {}).forEach(function (id) {
        var def = s.counts[id], t = setTable(def);
        if (!t) return;
        var n = (def.facts || []).length;
        if (!byT[t]) { byT[t] = { table: t, setId: id, def: def, chapter: s.id, n: n }; out.push(byT[t]); }
        else if (byT[t].chapter === s.id && n > byT[t].n) { byT[t].setId = id; byT[t].def = def; byT[t].n = n; }
      });
    });
    return out.map(function (c) { return { table: c.table, setId: c.setId, def: c.def, chapter: c.chapter }; });
  };
  E.countFor = function (table, stories) {
    var all = E.countSets(stories);
    for (var i = 0; i < all.length; i++) if (all[i].table === table) return all[i];
    return null;
  };
  /* "Tails · the 1s", "Ears · the 2s". */
  E.countName = function (def, table) {
    table = table || setTable(def) || 1;
    var things = (def && def.things) || (COUNT_THINGS[table] || ['thing', 'things'])[1];
    return cap1(things) + ' · the ' + table + 's';
  };
  /* The Counts she has learned (finished a chapter lesson of), in the order they are taught. */
  E.learnedCounts = function (cat, stories) {
    var done = {};
    var list = E.chapters(stories);
    list.forEach(function (s) {
      Object.keys(s.counts || {}).forEach(function (id) {
        var L = cat && cat.lessons && cat.lessons[id];
        if (L && L.finished !== false) { var t = setTable(s.counts[id]); if (t) done[t] = true; }
      });
    });
    return E.countSets(list).filter(function (c) { return done[c.table]; });
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
  /* The lesson definition for a Hollow round: the Count's own set (lines and pictures), with the
   * round's facts and the Hollow's ending. */
  E.hollowDef = function (stories, table) {
    table = table || 1;
    var c = E.countFor(table, stories);
    var things = COUNT_THINGS[table] || ['thing', 'things'];
    var def = clone(c ? c.def : { thing: things[0], things: things[1], teacher: 'tallyheart', ask: '{a} × {b}', praise: ['Yes!'], fast: [], miss: 'There. We\'ll come back to that one.' });
    def.id = 'hollow-' + table + 's';
    def.table = table;
    def.done = 'A full round! That deserves a treasure for your nest.';
    delete def.firstPrompt;   // the chapter's first question is about the cats in the picture before it
    delete def.warmHard; delete def.fillFrom; delete def.facts;
    // the Hollow is Tallyheart's sand: nothing borrowed, nothing scratched anywhere else
    delete def.fillIntro; delete def.fillOrder; delete def.fillVoice; delete def.avoid; delete def.ground;
    return def;
  };
  /* The facts of a table that were hard last time: the most recent first ask of each (not a retry,
   * not a filler, not a right check) in the cat's Counts log was wrong, or right but not fast. 9×1 and 1×9 are one
   * fact. Returns [[a, b]] as last asked, the misses first, then the slowest. */
  /* A fact asked under something to read first: its clock ran while she read, so a right answer's
   * speed says nothing about the fact. From the answer's own set (no new log field, so chapter 2's
   * saves work as they are): the fact has its own `prompt` there (2 × 6's "hop on from ten", the old
   * tom's 10 × 2), or it opens the set (its first fact, or a warm-up's `alt` opener) and the set has a
   * `firstPrompt` or its Counts frame has balloons (asked under them). The Hollow's are never.
   * "Opens" is where it was asked, not which pair it is: only the first answer of a run of the set
   * in the log can be the opener, so a warm-up's hard pick asked second (whatever its pair, 4 × 2
   * or an `alt` pair among them) is timed for itself. Returns { own, open } by fact key. */
  function readFacts(setId, stories) {
    // the chapters given, then every chapter loaded (a warm-up given only its own chapter still
    // knows chapter 1's lesson)
    var list = storyList(stories).concat(stories ? storyList() : []), story = null, def = null;
    for (var i = 0; i < list.length && !def; i++) if (list[i].counts && list[i].counts[setId]) { story = list[i]; def = list[i].counts[setId]; }
    if (!def) return null;
    var out = { own: {}, open: {} }, facts = def.facts || [];
    facts.forEach(function (f) { if (isObj(f) && f.prompt != null) out.own[factKey(+f.a, +f.b)] = true; });
    var balloons = Object.keys(story.frames || {}).some(function (id) {
      var f = story.frames[id];
      return f && f.counts && f.counts.set === setId && asList(f.say).length > 0;
    });
    if (facts.length && (def.firstPrompt || balloons)) {
      var p = factPair(facts[0]);
      out.open[factKey(p[0], p[1])] = true;
      var w = def.warmHard;
      if (isObj(w) && num(w.at, 0) !== 0 && w.alt) (altList(w.alt) ? w.alt : [w.alt]).forEach(function (f) { var q = factPair(f); out.open[factKey(q[0], q[1])] = true; });
    }
    return out;
  }
  // `opener`: whether the entry was the first answer of its run of the set (E.hardFacts reads it
  // from the log); left out, an opener pair counts as read first
  E.readFirst = function (entry, stories, memo, opener) {
    if (!entry || !entry.set) return false;
    var r = memo && own(memo, entry.set) ? memo[entry.set] : readFacts(entry.set, stories);
    if (memo) memo[entry.set] = r;
    var k = factKey(entry.a, entry.b);
    return !!(r && (r.own[k] || (opener !== false && r.open[k])));
  };
  E.hardFacts = function (cat, table, stories) {
    table = table || 1;
    var mine = {};
    for (var n = 1; n <= 10; n++) mine[pairKey(n, table)] = true;
    var last = {}, memo = {};
    (cat && cat.counts || []).forEach(function (e, i, log) {
      // a right check says nothing about the fact (she read the long prompt; the answer was on
      // screen already), so the pair's ask before it decides; a missed check still counts. A right
      // first ask read under a prompt is the same: only a miss there makes the fact hard. The
      // opener is the first answer of its run of the set (a warm-up's hard pick, second, is not)
      if (!e || e.retry || e.filler || (e.check && e.correct)) return;
      var opener = !(i > 0 && log[i - 1] && log[i - 1].set === e.set);
      if (e.correct && mine[pairKey(e.a, e.b)] && E.readFirst(e, stories, memo, opener)) return;
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
  function tableRecord(cat, table) {
    if (!isObj(cat.hollow)) cat.hollow = blankHollow();
    if (!isObj(cat.hollow.byTable)) cat.hollow.byTable = {};
    var key = String(table || 1);
    return cat.hollow.byTable[key] || (cat.hollow.byTable[key] = blankTable());
  }
  E.hollowTable = function (cat, table) {
    var r = cat && cat.hollow && cat.hollow.byTable && cat.hollow.byTable[String(table || 1)];
    return r ? { rounds: num(r.rounds, 0), cleanRounds: num(r.cleanRounds, 0), glow: !!r.glow } : blankTable();
  };
  E.hollowStart = function (cat, stories, now, table) {
    table = table || 1;
    var round = E.hollowTable(cat, table).rounds + 1;   // each Count's rounds are shuffled on their own
    var def = E.hollowDef(stories, table);
    var facts = E.hollowFacts(round, table);
    // up to three facts that were hard last time come early (positions 1-3, in this round's own
    // order of a and b); the first question stays an easy one
    var hard = {};
    E.hardFacts(cat, table, stories).slice(0, E.HARD_PER_ROUND).forEach(function (f) { hard[pairKey(f[0], f[1])] = true; });
    var easy = facts.filter(function (f) { return !hard[pairKey(f[0], f[1])]; });
    var early = facts.filter(function (f) { return hard[pairKey(f[0], f[1])]; }).map(function (f) { return { a: f[0], b: f[1], hard: true }; });
    if (early.length && easy.length) facts = [easy[0]].concat(early, easy.slice(1));
    var st = C.start(def, { facts: facts, set: def.id, mode: 'hollow', now: now });
    st.round = round;
    return { def: def, state: st };
  };
  /* A finished round earns the next treasure, and counts toward its own Count's glow. */
  E.hollowFinish = function (cat, state) {
    var sum = C.summary(state);
    if (!sum.finished) return { awarded: null, summary: sum, glowNow: false };
    var table = state.table || 1;
    var rec = tableRecord(cat, table), h = cat.hollow;
    h.rounds = num(h.rounds, 0) + 1;
    rec.rounds = num(rec.rounds, 0) + 1;
    if (sum.noHelp) rec.cleanRounds = num(rec.cleanRounds, 0) + 1;
    var t = E.TREASURES[(h.rounds - 1) % E.TREASURES.length];
    cat.nest.push(t.id);
    var wasGlow = !!rec.glow;
    rec.glow = rec.cleanRounds >= E.GLOW_ROUNDS;
    cat.lesson = null;
    return { awarded: t, summary: sum, glowNow: rec.glow && !wasGlow, rounds: h.rounds, table: table };
  };

  /* ------------------------------------------------------------ story checks */
  /* Problems with a story's frame graph, as strings (empty = fine). Used by tests and the UI's
   * debug hook. */
  E.checkStory = function (story) {
    var errs = [];
    if (!story || !story.frames) return ['no frames'];
    if (!story.frames[story.start]) errs.push('start frame missing: ' + story.start);
    function checkWhen(where, w) {
      if (w == null) return;
      if (!isObj(w)) { errs.push(where + ': when must be an object'); return; }
      if (isObj(w.not)) checkWhen(where + ' (not)', w.not);
      asList(w.lessonClean).forEach(function (s) { if (!E.countsSet(s, story)) errs.push(where + ': lessonClean names no counts set here: ' + s); });
      asList(w.firstTry).forEach(function (k) { if (!/^\d+\s*[x×]\s*\d+$/.test(String(k))) errs.push(where + ': firstTry wants "AxB": ' + k); });
    }
    Object.keys(story.frames).forEach(function (id) {
      var f = story.frames[id];
      var kinds = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'end'].filter(function (k) { return f[k]; });
      if (kinds.length !== 1) errs.push(id + ': needs exactly one of next/choice/input/look/counts/skip/end, has ' + (kinds.join(',') || 'none'));
      E.exits(f).forEach(function (to) { if (!story.frames[to]) errs.push(id + ' -> missing ' + to); });
      if (f.counts && !(story.counts && story.counts[f.counts.set])) errs.push(id + ': unknown counts set ' + f.counts.set);
      if (f.skip && !(num(f.skip.table, 0) >= 1 && num(f.skip.groups, 0) >= 1)) errs.push(id + ': skip needs a table and groups');
      if (f.gift && !E.gift(f.gift)) errs.push(id + ': unknown gift ' + f.gift);
      asList(f.caption).forEach(function (c, i) {
        if (isObj(c)) { if (typeof c.text !== 'string') errs.push(id + ': caption ' + i + ' has no text'); checkWhen(id + ' caption ' + i, c.when); }
        else if (typeof c !== 'string') errs.push(id + ': caption ' + i + ' must be a string or { when, text }');
      });
      asList(f.say).forEach(function (b, i) {
        if (!isObj(b)) return;
        checkWhen(id + ' say ' + i, b.when);
        if (b.digits != null && (typeof b.digits !== 'string' || !b.digits.trim())) errs.push(id + ': say ' + i + ': digits is a short line, like "7 × 8"');
      });
      if (f.choice) (f.choice.options || []).forEach(function (o, i) { if (o) checkWhen(id + ' option ' + i, o.when); });
      // a frame shown only `when` it matches is passed over as if its next led straight on
      if (f.when != null) {
        checkWhen(id + ' when', f.when);
        if (E.exits(f).length !== 1) errs.push(id + ': a frame with when needs exactly one way on (next)');
        if (id === story.start) errs.push(id + ': the start frame always shows (no when)');
      }
      if (f.skip && f.skip.paws != null && f.skip.paws !== 'own') errs.push(id + ': skip paws is "own"');
      if (f.skip && f.skip.keep != null && typeof f.skip.keep !== 'boolean') errs.push(id + ': skip keep is true or false');
    });
    var dn = story.book && story.book.dragonet;
    if (dn != null && !(isObj(dn) && typeof dn.id === 'string' && dn.id && typeof dn.name === 'string' && dn.name)) errs.push('book.dragonet needs an id and a name');
    Object.keys(story.counts || {}).forEach(function (sid) {
      var d = story.counts[sid];
      if (d.fillFrom && !E.countsSet(d.fillFrom, story)) errs.push('counts ' + sid + ': fillFrom names no set in this chapter: ' + d.fillFrom);
      if (d.fillIntro != null && typeof d.fillIntro !== 'string') errs.push('counts ' + sid + ': fillIntro must be a line');
      if (d.fillIntro != null && !d.fillFrom) errs.push('counts ' + sid + ': fillIntro without fillFrom');
      // chapter 3's keys
      if (d.ground != null && ['sand', 'earth', 'mud'].indexOf(d.ground) < 0) errs.push('counts ' + sid + ': ground is "sand", "earth" or "mud"');
      if (d.fillOrder != null && d.fillOrder !== 'easiest') errs.push('counts ' + sid + ': fillOrder is "easiest"');
      if (d.fillVoice != null && d.fillVoice !== 'borrower') errs.push('counts ' + sid + ': fillVoice is "borrower"');
      if ((d.fillOrder != null || d.fillVoice != null) && !d.fillFrom) errs.push('counts ' + sid + ': fillOrder and fillVoice need fillFrom');
      if (d.helpCounter != null && d.helpCounter !== 'you') errs.push('counts ' + sid + ': helpCounter is "you"');
      ['againIntro', 'helpIntroNotFive', 'helpIntro', 'helpIntroFar'].forEach(function (k) {
        if (d[k] != null && (typeof d[k] !== 'string' || !d[k].trim())) errs.push('counts ' + sid + ': ' + k + ' is a line');
      });
      if (d.done != null && typeof d.done !== 'string') errs.push('counts ' + sid + ': done is a line, \'\' or null');
      if (d.avoid != null && !(Array.isArray(d.avoid) && d.avoid.every(function (f) { var p = factPair(f); return p[0] >= 0 && p[1] >= 0; }))) errs.push('counts ' + sid + ': avoid is a list of facts, like [[9, 2], [7, 2]]');
      if (isObj(d.warmHard) && d.warmHard.alt != null) {
        var alts = altList(d.warmHard.alt) ? d.warmHard.alt : [d.warmHard.alt];
        if (!alts.every(function (f) { var p = factPair(f); return p[0] >= 0 && p[1] >= 0; })) errs.push('counts ' + sid + ': warmHard alt is a fact, or a list of facts in order');
      }
      (d.facts || []).forEach(function (f, i) {
        var a = Array.isArray(f) ? f[0] : f && f.a, b = Array.isArray(f) ? f[1] : f && f.b;
        if (!(a >= 0 && b >= 0)) errs.push('counts ' + sid + ': fact ' + i + ' needs a and b');
        if (!isObj(f)) return;
        if (f.light != null && f.light !== 'groups' && f.light !== 'rows') errs.push('counts ' + sid + ': fact ' + i + ': light is "groups" or "rows"');
        if (f.lit != null && !(num(f.lit, -1) >= 0)) errs.push('counts ' + sid + ': fact ' + i + ': lit is a number of things');
        if (f.who != null && !Array.isArray(f.who)) errs.push('counts ' + sid + ': fact ' + i + ': who is a list, left to right');
        if (f.retryPrompt === true && f.prompt == null) errs.push('counts ' + sid + ': fact ' + i + ': retryPrompt: true keeps a prompt it does not have');
        if (f.rightAgain === true && f.right == null) errs.push('counts ' + sid + ': fact ' + i + ': rightAgain: true keeps right lines it does not have');
      });
    });
    return errs;
  };

  PC.engine = E;
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
